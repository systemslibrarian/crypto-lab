'use strict';

/*
 * A family count is not a mention of an isogeny walk.
 *
 * crypto-lab-world-ciphers and crypto-lab-world-hashes each print the NGCC
 * round-one tally of public-key submissions by family: "43 lattice-based, 21
 * code-based, 6 multivariate, 5 isogeny-based, 4 hash-based signatures". A bare
 * /isogen/i listed `Isogeny walk` among both labs' references on the strength
 * of that one number. Neither lab performs or describes a walk, so the card
 * named something its source does not support.
 *
 * Same family as `Fiat-Shamir` matching Shamir secret sharing and
 * `Chaum-Pedersen` matching a Pedersen commitment: fixed in the vocabulary, not
 * with a pinned review per card, because the pattern would otherwise do it
 * again to the next lab that prints a census of submissions.
 *
 * The lines below are copied from the labs, not composed. Measured 2026-11-19
 * over all 264 carded labs: 427 lines match the bare pattern, the four in the
 * first test stop matching, and no other card's derivation changes.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const vocab = require('../tools/catalog-vocab.js');

const term = (() => {
  const list = vocab.ALGORITHMS || vocab.TERMS || Object.values(vocab).find(Array.isArray);
  const found = list.find((t) => t.name === 'Isogeny walk');
  assert.ok(found, 'the Isogeny walk term must still exist');
  return found;
})();

test('a counted family tally does not read as an isogeny mention', () => {
  const tallies = [
    // crypto-lab-world-ciphers at 2f58a4d5e180: README.md:71 and index.html:1254
    '| 84 public-key candidates by family: 43 lattice, 21 code, 6 multivariate, 5 isogeny, 4 hash-based signatures, 4 symmetric VOLE-in-the-head, 1 other group action | The same paper, Table 1 |',
    '        lattice-based, 21 code-based, 6 multivariate, 5 isogeny-based, 4 hash-based signatures, 4',
    // crypto-lab-world-hashes at d794482ff15e: README.md:74 and src/main.ts:1613
    '| 84 public-key candidates by family: 43 lattice, 21 code, 6 multivariate, 5 isogeny, 4 hash-based signatures, 4 symmetric VOLE-in-the-head, 1 other group action | Saarinen, Table 1 |',
    '        lattice-based, 21 code-based, 6 multivariate, 5 isogeny-based, 4 hash-based signatures, 4',
    // A two-digit count is the same census.
    'families: 12 isogeny, 3 lattice',
    // So is a count that begins the line, with nothing before the digit.
    '5 isogeny-based, 4 hash-based signatures, 4',
    '5 isogeny, 4 hash-based signatures',
    '21 isogeny-based',
  ];
  for (const line of tallies) {
    assert.equal(term.re.test(line), false, `must not match: ${line.trim().slice(0, 70)}`);
  }
});

test('every isogeny line the other seven cards rest on still matches', () => {
  /* One line from each lab whose card keeps the term, so a narrowing that
     silently dropped one of them fails here rather than in a card diff. */
  const real = [
    'export function applyIsogenyStep(',                                                    // isogeny-gate src/csidh.ts:92, its anchor
    ' * non-backtracking walks (fixed-degree isogenies), and a toy',                        // isogeny-atlas src/math/walk.ts:4
    "body: 'Castryck and Decru break SIKE — an isogeny-based KEM that was a NIST third-round alternate",  // key-exchange src/data.ts:181
    '— overview of the lattice, code, hash, multivariate, and isogeny PQ families.',       // mceliece-gate README.md:66
    '- [crypto-lab-isogeny-gate](https://systemslibrarian.github.io/crypto-lab-isogeny-gate/) — supersingular curves',  // weak-curves README.md:91
    'The isogeny-based candidate SIKE made the same diversity argument',                    // bike-vault index.html:581
    '<p class="cl-hero-sub">Lattice \\u00b7 Code \\u00b7 Hash \\u00b7 Multivariate \\u00b7 Isogeny \\u00b7 NIST PQC</p>',  // pq-families src/ui.ts:216
    'Isogeny walk',
    'src/isogeny/walk.ts',
  ];
  const missed = real.filter((line) => !term.re.test(line));
  assert.deepEqual(missed, [], 'these name the isogeny family outside a count and must still match');
});

test('the count must stand alone, and a tally beside a real mention still matches', () => {
  /* crypto-lab-pq-families writes the escape `\u00b7 Isogeny` in a string, and
     that ends in a digit and a space exactly as "5 isogeny" does. A lookbehind
     for any digit before the word would drop that line; the count has to follow
     something that is not a word character. */
  assert.equal(term.re.test('Multivariate \\u00b7 Isogeny \\u00b7 NIST PQC'), true);
  assert.equal(term.re.test('a degree-3 isogeny'), true);
  assert.equal(term.re.test('the 2-isogeny graph'), true);
  assert.equal(term.re.test('5 isogeny-based submissions, one of which walks an isogeny graph'), true);

  /* The line-start form is as narrow as the other: a digit that ends a longer
     token at the start of a line is not a count. */
  assert.equal(term.re.test('p434 isogeny'), true);
  assert.equal(term.re.test('3-isogeny chains'), true);
  assert.equal(term.re.test('123 isogeny classes'), true, 'three digits are outside the rule on purpose');

  /* Fixed-length lookbehinds only, as everywhere else in the vocabulary. */
  assert.doesNotMatch(String(term.re), /\(\?<![^)]*[*+{]/, 'keep the lookbehinds fixed-length');
});
