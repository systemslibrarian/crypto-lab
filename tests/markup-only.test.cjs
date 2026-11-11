'use strict';
/* The pin gate's new question: did the lines that moved RUN, or are they only
   words the lab renders? Each branch is exercised against real git and the real
   lexer, in a throwaway repository, because the thing being tested is a
   classification of actual diff output and a hand-built fixture string would
   test the fixture. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { markupOnly } = require('../tools/markup-only.js');
const { lex } = require('../tools/catalog-evidence.js');

function repo(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'markup-only-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1',
    GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'f@example.invalid',
    GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'f@example.invalid' };
  const git = (...a) => execFileSync('git', a, { cwd: dir, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '--initial-branch=main');
  const commit = (files) => {
    for (const [f, body] of Object.entries(files)) {
      fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true });
      fs.writeFileSync(path.join(dir, f), body);
    }
    git('add', '-A');
    git('commit', '-m', 'x');
    return git('rev-parse', 'HEAD');
  };
  return { dir, git, commit };
}

/* One shape for every case: a renderApp() whose template literal is assigned to
   innerHTML and carries an interpolation, which is what makes the edge case an
   edge case rather than a hypothetical. */
const page = (caption, count) => `import { ED25519 } from './c';

function renderApp(): void {
  const app = document.querySelector('#app');
  app.innerHTML = \`
  <section class="primer">
    <p class="primer-caption">
      ${caption}
    </p>
    <div class="size-row"><span>Key</span><span>\${${count}}B</span></div>
  </section>
  \`;
}
renderApp();
`;

test('a changed STATEMENT is executable — the branch that still reaches a person', t => {
  const r = repo(t);
  const a = r.commit({ 'src/main.ts': page('Baseline: draft-16.', 'ED25519.privateKeyBytes') });
  const b = r.commit({ 'src/main.ts': page('Baseline: draft-16.', 'ED25519.privateKeyBytes').replace("const app = document.querySelector('#app');", "const app = document.getElementById('app');") });
  const out = markupOnly(r.dir, a, b, ['src/main.ts'], lex);
  assert.equal(out.verdict, 'executable', out.why);
  assert.match(out.why, /src\/main\.ts:4/);
});

test('static markup, prose and a test file are markup — the branch that advances', t => {
  const r = repo(t);
  const a = r.commit({
    'src/main.ts': page('Baseline: draft-16.', 'ED25519.privateKeyBytes'),
    'src/notes.ts': '// RFC 10073 covers X.509.\nexport const N = 1;\n',
    'e2e/x.spec.ts': "test('a', () => {});\n",
  });
  const b = r.commit({
    'src/main.ts': page('Baseline: draft-16. RFC 10073 covers X.509; RFC 10082 covers CMS.', 'ED25519.privateKeyBytes'),
    'src/notes.ts': '// RFC 10073 covers X.509, and RFC 10082 covers CMS.\nexport const N = 1;\n',
    'e2e/x.spec.ts': "test('a', () => {});\ntest('b', () => {});\n",
  });
  /* e2e/ is not passed in: substantiveChanges already drops it before this runs.
     The two src/ files are the whole of what this function is asked about. */
  const out = markupOnly(r.dir, a, b, ['src/main.ts', 'src/notes.ts'], lex);
  assert.equal(out.verdict, 'markup', out.why);
});

test('EDGE CASE: inside a template literal that is evaluated, the line decides', t => {
  const r = repo(t);
  const base = page('Baseline: draft-16.', 'ED25519.privateKeyBytes');
  const a = r.commit({ 'src/main.ts': base });

  /* (i) a static line in that same evaluated literal — markup. */
  const staticEdit = r.commit({ 'src/main.ts': page('Baseline: draft-16. RFC 10082 covers CMS.', 'ED25519.privateKeyBytes') });
  const one = markupOnly(r.dir, a, staticEdit, ['src/main.ts'], lex);
  assert.equal(one.verdict, 'markup', one.why);

  /* (ii) the INTERPOLATED line in the very same literal — executable. The
     literal is evaluated either way, so a per-literal rule would call both of
     these the same and this pair is what proves the rule is per-line. */
  const interpEdit = r.commit({ 'src/main.ts': page('Baseline: draft-16. RFC 10082 covers CMS.', 'ED25519.publicKeyBytes') });
  const two = markupOnly(r.dir, staticEdit, interpEdit, ['src/main.ts'], lex);
  assert.equal(two.verdict, 'executable', two.why);
  assert.match(two.why, /\$\{ED25519\.publicKeyBytes\}/);

  /* The control that stops (i) passing for the wrong reason: the literal really
     is evaluated and really does interpolate at both ends. */
  const head = execFileSync('git', ['-C', r.dir, 'show', `${interpEdit}:src/main.ts`], { encoding: 'utf8' });
  assert.match(head, /app\.innerHTML = `/);
  assert.match(head, /\$\{ED25519\./);
});

test('what it cannot establish is unreadable, never a clearance', t => {
  const r = repo(t);
  const a = r.commit({ 'src/main.ts': page('A', 'ED25519.privateKeyBytes') });
  const b = r.commit({ 'src/gone.ts': 'export const x = 1;\n' });
  /* a path that exists at neither end of the range */
  assert.equal(markupOnly(r.dir, a, b, ['src/never.ts'], lex).verdict, 'markup',
    'a path with no diff contributes no changed lines');
  /* a range that does not resolve */
  const bad = markupOnly(r.dir, 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef', b, ['src/main.ts'], lex);
  assert.equal(bad.verdict, 'unreadable', bad.why);
  /* A file ADDED in the range has only added lines, judged at the end that has
     them. Its content decides, exactly as for an edited file -- this one
     declares a const, so it is executable. */
  const added = markupOnly(r.dir, a, b, ['src/gone.ts'], lex);
  assert.equal(added.verdict, 'executable', added.why);
  /* The same shape with inert content is markup, which is the control that
     stops the line above passing merely because the file is new. */
  const c = r.commit({ 'src/doc.ts': '// RFC 10082 covers CMS.\n' });
  assert.equal(markupOnly(r.dir, b, c, ['src/doc.ts'], lex).verdict, 'markup');
  /* A file DELETED in the range: present at the start, absent at the end. */
  fs.rmSync(path.join(r.dir, 'src/doc.ts'));
  const d = r.commit({});
  const removed = markupOnly(r.dir, c, d, ['src/doc.ts'], lex);
  assert.equal(removed.verdict, 'markup', removed.why);
  assert.equal(markupOnly(r.dir, a, b, []).verdict, 'markup', 'no substantive paths is not a refusal');
});

test('the anchored-file guard is ordered BEFORE the classifier, in source', () => {
  /* The behavioural proof is the three Ruling 1 tests above; this is the
     structural one, because the safety property is an ORDER and an order can be
     broken by a later edit that still passes every behavioural case it happens
     to cover. If the classifier call ever moves above the guard, this fails. */
  const src = fs.readFileSync(path.join(__dirname, '..', 'tools', 'catalog-evidence.js'), 'utf8');
  const guard = src.indexOf('anchored file(s) changed');
  const classifier = src.indexOf('const cls = classify ? classify(src)');
  assert.ok(guard > 0, 'the anchored-file guard must exist');
  assert.ok(classifier > 0, 'the classifier call must exist');
  assert.ok(guard < classifier, 'Ruling 1 must be decided before the classifier is consulted');
  /* And in movedSubstantively, the same order for the STALE-REVIEW reader. */
  const moved = src.indexOf('const touchedAnchored = substantive.filter');
  const movedCls = src.indexOf('const cls = markupOnly(dir, from, to, substantive, lex)');
  assert.ok(moved > 0 && movedCls > 0 && moved < movedCls,
    'movedSubstantively must refuse an anchored path before asking the classifier');
});

/* RULING 1 BOUNDARY — the three cases that define where the classifier may and
   may not speak. The classifier only ever widens eligibility for files that are
   NOT anchored; an anchored file is Ruling 1's business and the classifier is
   never asked about it. */
const { autoAdvanceVerdict } = require('../tools/catalog-evidence.js');

const ANCHORED = [{ name: 'SHA-512', file: 'src/composite.ts', line: 3 }];
const treeOf = (t, files) => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ruling1-'));
  t.after(() => fs.rmSync(d, { recursive: true, force: true }));
  for (const [f, body] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(d, f)), { recursive: true });
    fs.writeFileSync(path.join(d, f), body);
  }
  return d;
};
const ANCHOR_SRC = (tail) => `import {sha512} from './h';\n\nexport function sha512Hash(m) {\n  return sha512(m);\n}\n// ${tail}\n`;

test('RULING 1 — markup-only edit in an ANCHORED file, off the anchor line, is refused', t => {
  /* The 641bff4739a8 -> 3e5159b2386b shape: the anchor line is byte-identical,
     only a comment below it moves, and the blob therefore differs. */
  const pin = treeOf(t, { 'src/composite.ts': ANCHOR_SRC('Baseline: draft-16.') });
  const head = treeOf(t, { 'src/composite.ts': ANCHOR_SRC('Baseline: draft-16. RFC 10082 covers CMS.') });
  assert.equal(fs.readFileSync(path.join(pin, 'src/composite.ts'), 'utf8').split('\n')[2],
               fs.readFileSync(path.join(head, 'src/composite.ts'), 'utf8').split('\n')[2],
               'control: the anchor line must be identical, or this tests nothing');
  const v = autoAdvanceVerdict({ changed: ['src/composite.ts'], anchors: ANCHORED,
                                 atPin: () => pin, atHead: () => head, terms: { ALGORITHMS: [], ATTACKS: [] },
                                 classify: () => { throw new Error('the classifier must never be asked about an anchored file'); } });
  assert.equal(v.verdict, 'refused', JSON.stringify(v));
  assert.match(v.why, /anchored file\(s\) changed/);
});

test('RULING 1 — markup-only edit in an UNANCHORED src/ file is eligible', t => {
  const same = ANCHOR_SRC('unchanged');
  const pin = treeOf(t, { 'src/composite.ts': same });
  const head = treeOf(t, { 'src/composite.ts': same });
  const v = autoAdvanceVerdict({ changed: ['src/ui.ts'], anchors: ANCHORED,
                                 atPin: () => pin, atHead: () => head, terms: { ALGORITHMS: [], ATTACKS: [] },
                                 reviewedAnchor: () => true,
                                 classify: () => ({ verdict: 'markup', why: '1 path(s) changed, every changed line is markup, prose or comment' }) });
  assert.equal(v.verdict, 'eligible', JSON.stringify(v));
  assert.match(String(v.markupWhy), /markup, prose or comment/);
});

test('RULING 1 — executable change in an UNANCHORED src/ file is refused', t => {
  const same = ANCHOR_SRC('unchanged');
  const pin = treeOf(t, { 'src/composite.ts': same });
  const head = treeOf(t, { 'src/composite.ts': same });
  const v = autoAdvanceVerdict({ changed: ['src/ui.ts'], anchors: ANCHORED,
                                 atPin: () => pin, atHead: () => head, terms: { ALGORITHMS: [], ATTACKS: [] },
                                 reviewedAnchor: () => true,
                                 classify: () => ({ verdict: 'executable', why: 'src/ui.ts:12 changes code: const x = f();' }) });
  assert.equal(v.verdict, 'refused', JSON.stringify(v));
  assert.equal(v.condition, 'a');
  assert.match(v.why, /changes code/);
});
