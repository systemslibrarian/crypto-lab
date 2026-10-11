'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const comments = require('../tools/dispatch-comment-sync.js');
const claims = require('../tools/dispatch-claims.js');
const dispatch = require('../tools/dispatch-sync.js');

const ci = 'on: [pull_request, workflow_dispatch]\njobs:\n  test:\n    steps:\n      - run: npm test\n';
const pages = 'on: [push, pull_request, workflow_dispatch]\njobs:\n  build:\n    steps:\n      - run: npm test\n  deploy:\n    needs: build\n    steps:\n      - uses: actions/deploy-pages@v5\n';
const rationale = comments.CANONICAL.map((s) => `          # ${s}`).join('\n');
function merge(commands, guard = 'negative') {
  const body = guard === 'positive'
    ? `          if [ -n "$merged" ]; then\n${commands}\n          fi`
    : `          if [ -z "$merged" ]; then\n            exit 0\n          fi\n${commands}`;
  return `on: pull_request\njobs:\n  dependabot-auto-merge:\n    steps:\n      - name: Merge\n        run: |\n          if gh pr merge --squash "$PR_URL"; then\n            merged=1\n          fi\n${body}\n`;
}
function fleet(t, source, extra = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dispatch-targets-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const dir = path.join(root, 'crypto-lab-fixture', '.github', 'workflows');
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, 'merge.yml'), source);
  for (const [name, text] of Object.entries({ 'ci.yml': ci, 'pages.yml': pages, ...extra })) {
    if (text !== null) fs.writeFileSync(path.join(dir, name), text);
  }
  return {root, dir};
}
const call = (name) => `          gh workflow run ${name} --ref main`;
for (const order of ['before', 'after']) {
  test(`auxiliary verification ${order} deployment keeps the actual publisher and paragraph`, (t) => {
    const pub = `${rationale}\n${call('pages.yml')}`;
    const source = merge(order === 'before' ? `${call('ci.yml')}\n${pub}` : `${pub}\n${call('ci.yml')}`);
    const {root} = fleet(t, source);
    assert.deepEqual(claims.dispatchSites(root).map((s) => s.target), ['pages.yml']);
    assert.deepEqual(comments.scan(root).map((s) => [s.target, s.status]), [['pages.yml', 'CANONICAL']]);
    assert.equal(claims.verify({root}).failures.length, 0);
    assert.equal(dispatch.inspectText(source)[0].verdict, 'OK');
  });
}
test('every executable dispatch on a line is captured; comment mentions are excluded', () => {
  const src = ['# gh workflow run phantom.yml', 'actions: write # gh workflow run phantom.yml',
    'run: gh workflow run ci.yml; gh workflow run pages.yml'];
  assert.deepEqual(comments.findDispatches(src, 0, src.length).map((d) => d.target), ['ci.yml', 'pages.yml']);
});
test('verification alone cannot substitute for a deployment', (t) => {
  const {root} = fleet(t, merge(call('ci.yml')));
  assert.equal(claims.verify({root}).failures.some((f) => f.id === 'same-gate-then-deploy'), true);
});
for (const [name, text] of [
  ['missing.yml', null], ['malformed.yml', 'jobs: ['], ['empty.yml', 'on: workflow_dispatch\njobs: {}\n'],
  ['null.yml', 'on: workflow_dispatch\njobs:\n  test: null\n'],
  ['dynamic.yml', 'on: workflow_dispatch\njobs:\n  test:\n    uses: example/private/.github/workflows/gate.yml@main\n'],
  ['no-gate.yml', 'on: workflow_dispatch\njobs:\n  test:\n    steps:\n      - run: echo "npm test"\n'],
  ['install-only.yml', 'on: workflow_dispatch\njobs:\n  test:\n    steps:\n      - run: npm ci\n'],
  ['no-dispatch.yml', ci.replace('pull_request, workflow_dispatch', 'pull_request')],
]) {
  test(`a valid publisher cannot conceal ${name}`, (t) => {
    const {root} = fleet(t, merge(`${call(name)}\n${rationale}\n${call('pages.yml')}`), {[name]: text});
    assert.equal(claims.dispatchSites(root).length, 2);
    assert.ok(claims.verify({root}).failures.length > 0);
  });
}
test('unreadable target stays a failure without throwing or dropping coverage', (t) => {
  const {root, dir} = fleet(t, merge(`${call('unreadable.yml')}\n${call('pages.yml')}`));
  fs.mkdirSync(path.join(dir, 'unreadable.yml'));
  assert.equal(claims.dispatchSites(root).length, 2);
  assert.ok(claims.verify({root}).failures.length > 0);
});
test('dynamic and traversing target names stay explicit failures', (t) => {
  const {root} = fleet(t, merge(`${call('${{ inputs.target }}')}\n${call('../outside.yml')}\n${call('pages.yml')}`));
  assert.equal(claims.dispatchSites(root).length, 3);
  assert.ok(claims.verify({root}).failures.length > 0);
});
test('a later ungated publisher is inspected even after a sound publisher', (t) => {
  const bad = pages.replace('    needs: build\n', '');
  const {root} = fleet(t, merge(`${call('pages.yml')}\n${call('bad.yml')}`), {'bad.yml': bad});
  assert.equal(claims.derive(root).totals.sites, 2);
  assert.equal(claims.verify({root}).failures.some((f) => f.id === 'same-gate-then-deploy'), true);
});
test('a guarded first dispatch cannot hide a later dispatch outside its positive guard', () => {
  const source = merge(call('ci.yml'), 'positive') + call('pages.yml') + '\n';
  assert.equal(dispatch.inspectText(source)[0].verdict, 'UNGUARDED-DISPATCH');
});
test('a negative flag test without exit cannot establish protection', () => {
  const source = merge(`${call('ci.yml')}\n${call('pages.yml')}`).replace('            exit 0', '            echo failed');
  assert.equal(dispatch.inspectText(source)[0].verdict, 'UNGUARDED-DISPATCH');
});
test('an exit conditional on another test cannot terminate every failed-merge path', () => {
  const source = merge(call('pages.yml')).replace('            exit 0', '            if [ -n "$other" ]; then\n              exit 0\n            fi');
  assert.equal(dispatch.inspectText(source)[0].verdict, 'UNGUARDED-DISPATCH');
});
test('the established chained terminating guard protects both dispatches', () => {
  const source = merge(`${call('ci.yml')}\n${call('pages.yml')}`)
    .replace('          if [ -z "$merged" ]; then\n            exit 0\n          fi', '          [ -n "$merged" ] || { echo failed; exit 0; }');
  assert.equal(dispatch.inspectText(source)[0].verdict, 'OK');
});
function splitSteps(lastIf) {
  return `jobs:\n  dependabot-auto-merge:\n    steps:\n      - name: Merge\n        run: |\n          if gh pr merge "$PR_URL"; then\n            echo "merged=1" >> "$GITHUB_ENV"\n          fi\n      - if: env.merged == '1'\n        run: gh workflow run ci.yml\n      - ${lastIf ? `if: ${lastIf}\n        ` : ''}run: gh workflow run pages.yml\n`;
}
test('every separate dispatch step needs the actual successful-merge guard', () => {
  assert.equal(dispatch.inspectText(splitSteps("env.merged == '1'"))[0].verdict, 'OK');
  assert.equal(dispatch.inspectText(splitSteps("success() && env.merged == '1'"))[0].verdict, 'OK');
  assert.equal(dispatch.inspectText(splitSteps(null))[0].verdict, 'FLAG-NOT-READ');
  assert.equal(dispatch.inspectText(splitSteps("env.merged == '0'"))[0].verdict, 'FLAG-NOT-READ');
  assert.equal(dispatch.inspectText(splitSteps("env.merged == '1' || true"))[0].verdict, 'FLAG-NOT-READ');
});
