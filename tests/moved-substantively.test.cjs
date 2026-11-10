/**
 * The ONE substantive-change rule, both branches.
 *
 * The carve-out branch cannot be covered by live fleet data: measured
 * 2026-11-10, no lab has a demos/<name>/index.html without a sibling
 * demos/<name>/src/, so every real clone exercises the regex branch and never
 * the lookup branch. These are fixtures for that reason, not for convenience.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  SUBSTANTIVE,
  countsAsSubstantive,
  substantiveChanges,
  demoHasSrcFrom,
} = require('../tools/moved-substantively.js');

const hasSrc = demoHasSrcFrom([
  'demos/with-src/src/main.ts',
  'demos/with-src/index.html',
  'demos/html-only/index.html',
  'demos/html-only/style.css',
]);

test('the prefix branch: a lab’s own source counts, wherever the lab keeps it', () => {
  for (const f of [
    'README.md',
    'src/main.ts',
    'demos/with-src/src/main.ts',
    'web-demo/src/app.ts',
    'crates/qv-core/src/lib.rs',
    'wasm/src/exports.c',
    'native/thing.c',
  ]) assert.equal(countsAsSubstantive(f, hasSrc), true, f);
});

test('the carve-out branch: index.html counts ONLY when the demo has no src/', () => {
  // The whole point of the rule: that demo's logic lives in the HTML.
  assert.equal(countsAsSubstantive('demos/html-only/index.html', hasSrc), true);
  // And the case the ruling names explicitly: a demo that HAS a src/ tree, with
  // an index.html-only change, must NOT count. This is crypto-lab-shamir-gate's
  // live situation, and the reason the hub and the console disagreed.
  assert.equal(countsAsSubstantive('demos/with-src/index.html', hasSrc), false);
});

test('the raw regex is untouched, so the existing clone-currency assertions hold', () => {
  assert.equal(SUBSTANTIVE.test('demos/shamir-gate/index.html'), false);
  assert.equal(SUBSTANTIVE.test('index.html'), false);
  assert.equal(SUBSTANTIVE.test('demos/shamir-gate/src/main.ts'), true);
});

test('a top-level index.html is not the carve-out: the rule names demos/<name>/ only', () => {
  assert.equal(countsAsSubstantive('index.html', hasSrc), false);
  assert.equal(countsAsSubstantive('demos/html-only/nested/index.html', hasSrc), false);
});

test('NOT_THE_LAB and NOT_THIS_LABS_CODE apply on top of BOTH branches', () => {
  // The crypto-lab-ghost-commit false positive: an added test under src/.
  assert.equal(countsAsSubstantive('src/git/objects.independent.test.ts', hasSrc), false);
  assert.equal(countsAsSubstantive('src/__tests__/signature-trust.test.ts', hasSrc), false);
  assert.equal(countsAsSubstantive('web-demo/src/__tests__/signature-trust.test.ts', hasSrc), false);
  assert.equal(countsAsSubstantive('src/e2e/gate.ts', hasSrc), false);
  assert.equal(countsAsSubstantive('src/vendor/bundle.js', hasSrc), false);
  assert.equal(countsAsSubstantive('src/sm-crypto.d.ts', hasSrc), false);
  assert.equal(countsAsSubstantive('src/app.min.js', hasSrc), false);
});

test('substantiveChanges returns the offending paths, in input order', () => {
  const changed = [
    '.github/workflows/deploy.yml',
    'demos/with-src/index.html',
    'package-lock.json',
    'src/main.ts',
    'demos/html-only/index.html',
  ];
  assert.deepEqual(substantiveChanges(changed, hasSrc), ['src/main.ts', 'demos/html-only/index.html']);
  // shamir-gate's real change set: CI, page furniture and manifests only.
  assert.deepEqual(substantiveChanges([
    '.github/dependabot.yml',
    '.github/workflows/deploy.yml',
    'demos/with-src/index.html',
    'demos/with-src/package-lock.json',
    'demos/with-src/package.json',
    'demos/with-src/tests/publish-request.node.mjs',
    'demos/with-src/vite.config.ts',
    'demos/with-src/vitest.config.ts',
  ], hasSrc), []);
});

test('an empty or missing change list is not substantive, and never throws', () => {
  assert.deepEqual(substantiveChanges([], hasSrc), []);
  assert.deepEqual(substantiveChanges(null, hasSrc), []);
  assert.deepEqual(substantiveChanges(['', null], hasSrc), []);
});

test('a missing lookup REFUSES rather than deciding the rule for every lab', () => {
  // Only for the branch that needs it: the prefix branch never asks.
  assert.equal(countsAsSubstantive('src/main.ts', undefined), true);
  assert.throws(() => countsAsSubstantive('demos/html-only/index.html', undefined), /needs demoHasSrc/);
});

test('demoHasSrcFrom reads either a newline blob or an array, and only demos/*/src/', () => {
  const fromBlob = demoHasSrcFrom('demos/a/src/x.ts\ndemos/b/index.html\n');
  assert.equal(fromBlob('a'), true);
  assert.equal(fromBlob('b'), false);
  // A src/ somewhere else must not make a demo look sourced.
  const notADemo = demoHasSrcFrom(['src/x.ts', 'demos/c/index.html']);
  assert.equal(notADemo('c'), false);
});
