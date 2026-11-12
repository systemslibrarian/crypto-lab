'use strict';

/*
 * Chaum-Pedersen is not a Pedersen commitment.
 *
 * It is a non-interactive proof that two discrete logs are equal. A Pedersen
 * commitment is a hiding, binding commitment over two independent generators.
 * A bare /pedersen/i credited the first as the second, and
 * crypto-lab-threshold-decrypt was published implementing "Pedersen
 * commitment" on the strength of the type name `ChaumPedersenChecks` in an
 * import line -- the lab has no second generator and no blinding factor
 * anywhere in it.
 *
 * Same family as `\bsm-?crypto\b` crediting SM2 from a package name, and
 * `Fiat-Shamir` matching Shamir secret sharing: fixed in the vocabulary, not
 * per card, because the pattern would otherwise do it again to the next lab
 * that uses a Chaum-Pedersen proof.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const vocab = require('../tools/catalog-vocab.js');

const term = (() => {
  const list = vocab.ALGORITHMS || vocab.TERMS || Object.values(vocab).find(Array.isArray);
  const found = list.find((t) => t.name === 'Pedersen commitment');
  assert.ok(found, 'the Pedersen commitment term must still exist');
  return found;
})();

test('Chaum-Pedersen does not read as a Pedersen commitment', () => {
  /* Every spelling the fleet actually contains, taken from
     crypto-lab-threshold-decrypt at ea5045a3d1db. */
  const chaum = [
    "type ChaumPedersenChecks } from './elgamal';",
    '/** Exponential ElGamal and CDS disjunctive Chaum–Pedersen over P-256.',
    'export type ChaumPedersenProof = {',
    "describe('Chaum-Pedersen partial-decryption proof', () => {",
    ' * The three checks a Chaum-Pedersen verifier runs, each reported separately so a',
    'const checks: ChaumPedersenChecks[] = [];',
    'a Chaum—Pedersen proof',
    'a Chaum Pedersen proof',
  ];
  for (const line of chaum) {
    assert.equal(term.re.test(line), false, `must not match: ${line.trim().slice(0, 70)}`);
  }
});

test('every real Pedersen spelling in the fleet still matches', () => {
  /* Taken from the seven cards that keep the credit, so a narrowing that
     silently dropped one of them fails here rather than in a card diff. */
  const real = [
    'const runPedersenBtn = document.querySelector<HTMLButtonElement>(',          // vss-gate
    'export function deal(dealer: number, n: number, t: number, rng: Rng)',       // dkg-gate, via src/dkg/pedersen.ts
    'export const commitPedersen = async (message: bigint, blinding?: bigint)',   // commit-gate
    "import { commit, getHGenerator } from './crypto/pedersen';",                  // bulletproofs
    'const pedersenCommitments = (f: bigint[], r: bigint[]): bigint[] =>',        // reshare-circle
    "import { commit } from '../commit/pedersen'",                                // fold-gate
    'src/dkg/pedersen.ts',
    'a Pedersen commitment hides the value and binds the committer',
    'Pedersen commitment',
  ];
  const missed = real.filter((line) => !term.re.test(line) && /pedersen/i.test(line));
  assert.deepEqual(missed, [], 'these name a real Pedersen construction and must still match');
});

test('the narrowing is a lookbehind, not a word boundary', () => {
  /* MUTATION. `\bpedersen\b` is the obvious first idea and it is wrong in both
     directions: it still matches `Chaum-Pedersen` (the hyphen makes a
     boundary) and it stops matching `commitPedersen` (m-to-P is not one). If a
     future edit reaches for it, this fails. */
  const boundary = /\bpedersen\b/i;
  assert.equal(boundary.test('describe(\'Chaum-Pedersen partial-decryption proof\''), true,
    'a word boundary does not exclude Chaum-Pedersen -- that is why it is not the fix');
  assert.equal(boundary.test('export const commitPedersen = async ('), false,
    'and it would drop a real one');

  /* The shipped pattern gets both right. */
  assert.equal(term.re.test("describe('Chaum-Pedersen partial-decryption proof'"), false);
  assert.equal(term.re.test('export const commitPedersen = async ('), true);

  /* And it uses only FIXED-length lookbehinds, so it needs no recent-engine
     behaviour. A variable-length one would work in V8 and is avoided. */
  assert.doesNotMatch(String(term.re), /\(\?<![^)]*[*+{]/,
    'keep the lookbehinds fixed-length');
});
