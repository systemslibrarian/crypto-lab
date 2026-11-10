/**
 * Declared source roots, and the census that stops a sixth blind lab appearing.
 *
 * The control that matters most here is the one that caught a real defect while
 * this was being written: the census first asked only whether the rule matched
 * ANY tracked file, and crypto-lab-ratchet-wire -- the lab it exists for --
 * passed with its declaration removed, because README.md is in SUBSTANTIVE and
 * every lab has one. A census satisfied by a README cannot see the blindness it
 * exists to find.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  countsAsSubstantive, substantiveChanges, demoHasSrcFrom,
  rootsFor, underDeclaredRoot, validateDeclared, DECLARED,
} = require('../tools/moved-substantively.js');

const has = demoHasSrcFrom([]);

test('a declared root makes a lab’s own source visible', () => {
  const roots = rootsFor('crypto-lab-ratchet-wire');
  assert.ok(roots.length, 'ratchet-wire must declare roots');
  // The exact file whose rename did NOT make the pin stale on 2026-11-10.
  assert.equal(countsAsSubstantive('ratchet-wire/src/crypto/hybrid-session.ts', has, roots), true);
  // And without the declaration it is invisible, which was the defect.
  assert.equal(countsAsSubstantive('ratchet-wire/src/crypto/hybrid-session.ts', has, []), false);
});

test('only README.md matches ratchet-wire under the DEFAULTS, which is why a count of matches is not the test', () => {
  const files = ['README.md', 'ratchet-wire/src/crypto/bytes.ts', 'ratchet-wire/vite.config.ts'];
  assert.deepEqual(substantiveChanges(files, has, []), ['README.md']);
  const CODE = /\.(ts|tsx|js|mjs|cjs|rs|go|py|c|cc|cpp|h|hpp|java|cs|swift|wasm|wat)$/i;
  assert.equal(substantiveChanges(files, has, []).filter((f) => CODE.test(f)).length, 0,
    'a README alone must not count as the rule seeing a lab’s implementation');
});

test('what is NOT a root is deliberate: build configs beside the source do not count', () => {
  const roots = rootsFor('crypto-lab-ratchet-wire');
  assert.equal(countsAsSubstantive('ratchet-wire/vite.config.ts', has, roots), false);
  assert.equal(countsAsSubstantive('ratchet-wire/playwright.config.ts', has, roots), false);
});

test('the exclusions still apply INSIDE a declared root', () => {
  const roots = rootsFor('crypto-lab-ratchet-wire');
  assert.equal(countsAsSubstantive('ratchet-wire/src/__tests__/x.test.ts', has, roots), false);
  assert.equal(countsAsSubstantive('ratchet-wire/src/x.spec.ts', has, roots), false);
  assert.equal(countsAsSubstantive('ratchet-wire/src/vendor/bundle.js', has, roots), false);
  assert.equal(countsAsSubstantive('ratchet-wire/src/lib.d.ts', has, roots), false);
});

test('an exact-file root matches only that file', () => {
  const roots = rootsFor('crypto-lab-ablation-wire');
  assert.ok(roots.includes('web/index.html'));
  assert.equal(countsAsSubstantive('web/index.html', has, roots), true);
  assert.equal(countsAsSubstantive('web/404.html', has, roots), false, 'the sibling page is not the implementation');
  assert.equal(countsAsSubstantive('web/README.md', has, roots), false);
});

test('a prefix root matches only under itself, not a sibling with the same stem', () => {
  assert.equal(underDeclaredRoot('js/field.js', ['js/']), true);
  assert.equal(underDeclaredRoot('jsx/field.js', ['js/']), false);
  assert.equal(underDeclaredRoot('vendor/js/field.js', ['js/']), false);
});

test('a lab with no declaration gets no extra roots, so the 248 are unchanged', () => {
  assert.deepEqual(rootsFor('crypto-lab-blind-hello'), []);
  assert.deepEqual(rootsFor(undefined), []);
  assert.equal(countsAsSubstantive('src/main.ts', has, rootsFor('crypto-lab-blind-hello')), true);
  assert.equal(countsAsSubstantive('js/main.js', has, rootsFor('crypto-lab-blind-hello')), false);
});

test('every shipped declaration is well formed and carries a reason', () => {
  assert.doesNotThrow(() => validateDeclared(DECLARED));
  for (const [slug, entry] of Object.entries(DECLARED)) {
    assert.match(slug, /^crypto-lab-/, slug);
    assert.ok(entry.reason.trim().length > 40, `${slug}: the reason must say why, not just that`);
    for (const r of entry.roots) {
      assert.ok(r.endsWith('/') || /\.[a-z]+$/i.test(r), `${slug}: ${r} must be a directory prefix or an exact file`);
    }
  }
});

test('a declaration written wrong is REFUSED, not applied', () => {
  const bad = [
    [{ roots: [], reason: 'x'.repeat(50) }, /declares no roots/],
    [{ roots: ['js/'] }, /no written reason/],
    [{ roots: ['js/'], reason: '   ' }, /no written reason/],
    [{ roots: ['/abs/'], reason: 'x'.repeat(50) }, /repo-relative/],
    [{ roots: ['../up/'], reason: 'x'.repeat(50) }, /repo-relative/],
    [{ roots: ['js/**'], reason: 'x'.repeat(50) }, /no globbing/],
    [{ roots: [''], reason: 'x'.repeat(50) }, /empty root/],
    ['js/', /must be an object/],
  ];
  for (const [entry, re] of bad) {
    assert.throws(() => validateDeclared({ 'crypto-lab-x': entry }), re, JSON.stringify(entry));
  }
});

test('the census reports every carded lab as visible, and names how', () => {
  const { census } = require('../tools/source-root-census.js');
  const { blind, unreadable, staleDeclaration, seen } = census();
  assert.deepEqual(blind, [], 'a blind lab means the rule cannot see its source');
  assert.deepEqual(staleDeclaration, [], 'a declaration matching nothing is a stale entry');
  assert.deepEqual(unreadable, [], 'an unanswered question is not a pass');
  assert.equal(seen.filter((s) => s.declared).length, Object.keys(DECLARED).length);
});
