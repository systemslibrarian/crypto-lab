'use strict';
/*
 * The four declared mechanisms that let the chip rule clear a chip naming an algorithm
 * the scanner did not anchor, and the lexer fix that feeds the comment-only exemption.
 *
 * Every case is asserted BOTH WAYS. A relation that fired on everything would clear
 * every overclaim in the catalog and read as a smaller number rather than as a broken
 * rule, which is the failure these tables exist to avoid: the disposition in
 * audits/CHIP-DISPOSITION-2026-10-20.md was written because judging chips in isolation
 * accused five honest cards, and the remedy must not over-correct into accusing none.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ENTAILS, entailedBy, QUALIFYING_SIBLINGS, qualifiedBySibling,
  EXECUTED_STACK, executedStack, lessSpecific, satisfiedByGranularity,
} = require('../tools/catalog-sync.js');
const { lex } = require('../tools/catalog-evidence.js');

const term = (name) => ({ name });

test('every ENTAILS entry fires on its entailing algorithm and not without it', () => {
  assert.ok(ENTAILS.length > 0, 'the table must not be empty');
  for (const rule of ENTAILS) {
    for (const from of rule.from) {
      const hit = entailedBy(rule.chip, term(rule.chip), new Set([from]));
      assert.ok(hit, `${rule.chip} should be entailed by an implemented ${from}`);
      assert.equal(hit.from, from);
    }
    /* The control. A lab implementing something unrelated entails nothing, which is
       what keeps this from being a blanket exemption for the chip's name. */
    assert.equal(
      entailedBy(rule.chip, term(rule.chip), new Set(['SHA-256'])), null,
      `${rule.chip} must NOT be entailed by an unrelated implementation`,
    );
    assert.equal(
      entailedBy(rule.chip, term(rule.chip), new Set()), null,
      `${rule.chip} must NOT be entailed by a lab credited with nothing`,
    );
    assert.ok(rule.why && rule.why.length > 40, `${rule.chip} must record WHY`);
  }
});

test('entailment is keyed on an implementation, so discussing is not implementing', () => {
  /* The implement/discuss boundary, which is the whole point of keying on
     data-implements: a lab that merely mentions CKKS is credited with nothing and
     therefore entails nothing. */
  assert.ok(entailedBy('RLWE', term('Ring-LWE'), new Set(['CKKS'])));
  assert.equal(entailedBy('RLWE', term('Ring-LWE'), new Set(['Paillier'])), null);
});

test('an algorithm with no ENTAILS entry is never entailed', () => {
  assert.equal(entailedBy('AES', term('AES'), new Set(['AES-GCM', 'CKKS', 'HQC'])), null);
});

test('a sibling chip qualifies only the declared pair', () => {
  assert.ok(QUALIFYING_SIBLINGS.length > 0);
  for (const rule of QUALIFYING_SIBLINGS) {
    const chips = ['CSIDH', 'Castryck-Decru', 'SQIsign'];
    assert.ok(qualifiedBySibling(term(rule.chip), chips), `${rule.chip} should be qualified`);
    /* Controls: the wrong neighbour does not qualify, and -- the maintainer's decision
       of 2026-10-21 -- `Comparison` is explicitly NOT a blanket exemption. */
    assert.equal(qualifiedBySibling(term(rule.chip), ['CSIDH', 'SQIsign']), null);
    assert.equal(qualifiedBySibling(term(rule.chip), ['Comparison']), null,
      '"Comparison" must not qualify anything');
    assert.ok(rule.why && rule.why.length > 40);
  }
  assert.equal(qualifiedBySibling(term('STARK'), ['Comparison', 'zk-SNARK']), null,
    'zk-arena is marked on its own chip, not by its Comparison sibling');
});

test('the executed stack needs a declared call site, not a dependency listing', () => {
  for (const e of EXECUTED_STACK) {
    assert.ok(executedStack(e.slug, term(e.chip)), `${e.slug}/${e.chip} should resolve`);
    assert.match(e.at, /^src\/.+:\d+$/, 'the call site must be a file:line in the lab');
    assert.ok(e.pkg, 'the package must be named');
    assert.ok(e.why && e.why.length > 40);
    /* Controls: it is scoped to one lab and one chip, so it cannot leak. */
    assert.equal(executedStack('crypto-lab-somewhere-else', term(e.chip)), null);
    assert.equal(executedStack(e.slug, term('Kuznyechik')), null);
  }
});

test('granularity only ever makes a chip LESS specific', () => {
  /* The real case: ablation-wire chips AES-256-GCM and is credited with AES-GCM. */
  const hit = satisfiedByGranularity('AES-256-GCM', new Set(['AES-GCM']));
  assert.ok(hit);
  assert.equal(hit.from, 'AES-GCM');
  /* Controls. A key size is the only thing removed, so AES-GCM can never be reduced to
     AES -- otherwise every AEAD chip would be satisfied by a bare block cipher. */
  assert.equal(lessSpecific('AES-GCM'), 'AES-GCM');
  assert.equal(satisfiedByGranularity('AES-GCM', new Set(['AES'])), null);
  assert.equal(satisfiedByGranularity('AES-256-GCM', new Set(['ChaCha20'])), null);
  assert.equal(satisfiedByGranularity('ML-KEM-768', new Set()), null);
});

test('lex puts a standalone BLOCK comment in the inert view (the contract the fix rests on)', () => {
  /* HONEST SCOPE. `lex` was never the bug and these two tests would pass against the
     old code: the 2026-10-21 fix was in the per-line LOOP, which opened
     `if (!line.trim()) continue` on the STRINGS view -- blank for a line that is
     nothing but a comment -- so the comment-only check BELOW it never ran for one.
     crypto-lab-commit-gate, the case CLAUDE.md cites FOR this exemption, names P-256
     in a block comment and had never been exempted once.
     An end-to-end test of the loop would need a fixture lab at ../crypto-lab-<slug>,
     which makes it a 237th lab to every fleet checker -- the hazard CLAUDE.md records
     for worktrees. So the loop fix is verified by a before/after on the real fleet,
     recorded in the pull request: commit-gate's commentOnly went [] -> [Hash-to-curve,
     P-256], accumulator [] -> [Miller-Rabin, RSA], beacon-lock [] -> [Boneh-Franklin
     IBE, ...], sleeve-check [] -> [Streebog], with catalog-recall unchanged at 89.2%.
     What these two DO pin is the property that fix depends on, and the boundary that
     must never move with it. */
  const src = [
    '/**',
    " * The RSA accumulator itself — Benaloh-de Mare (1993).",
    ' */',
    'export function add(x) { return x; }',
  ].join('\n');
  const out = lex(src);
  assert.match(out.inert, /RSA accumulator/, 'a block comment body must be in the inert view');
  const inertLines = out.inert.split('\n');
  assert.ok(inertLines[1].trim(), 'the comment line must be non-blank in the inert view');
  assert.equal(out.strings.split('\n')[1].trim(), '',
    'and blank in the strings view — which is exactly why the old early-exit skipped it');
});

test('a UI STRING still does NOT reach the comment-only view', () => {
  /* The load-bearing boundary. Including string contents was measured once and took the
     chip rule from 28 violations to 1, because these labs build their interfaces out of
     template literals full of algorithm names. A name in a string is a lab TALKING
     about an algorithm; a name in a comment is code ANNOTATED with it. */
  const src = 'const label = "RSA accumulator explained"; const t = `uses Streebog here`;';
  const out = lex(src);
  assert.doesNotMatch(out.inert, /RSA/, 'a double-quoted string must not exempt');
  assert.doesNotMatch(out.inert, /Streebog/, 'a template literal must not exempt');
  assert.match(out.strings, /RSA accumulator explained/, 'but it is still visible as a string');
});

test('a trailing // comment keeps working, which is the case that always did', () => {
  const out = lex('classical: Uint8Array; // X25519-style shared secret');
  assert.match(out.inert, /X25519/);
});
