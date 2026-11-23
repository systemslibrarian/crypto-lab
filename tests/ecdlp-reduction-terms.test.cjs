/**
 * The two ECDLP-reduction terms from #479, and the two patterns deliberately not
 * shipped beside them.
 *
 * crypto-lab-weak-curves implements Smart's attack (`src/attack/smart.ts`) and the
 * MOV reduction (`src/attack/mov.ts`). No term could name either, so no anchor
 * could resolve, the card credited neither, and `catalog-sync chips` could not
 * judge the two chips claiming them — invisible in both directions.
 *
 * The risk in closing that is the opposite error: a pattern loose enough to credit
 * labs that only MENTION the attacks. Both rejected patterns are asserted here as
 * well as the shipped ones, because "we chose not to use this" is only checkable
 * if the alternative is written down.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const { ALGORITHMS } = require('../tools/catalog-vocab.js');

const term = (name) => {
  const t = ALGORITHMS.find((x) => x.name === name);
  assert.ok(t, `${name} must be in the vocabulary`);
  return t;
};
const SMART = term("Smart's attack");
const MOV = term('MOV reduction');

test('each term matches its own name, which catalog-sync vocab requires', () => {
  /* Four terms were in this broken state once — SM2, SM3, SM4 and ARIA — and the
     chip rule silently judged none of those cards. */
  assert.ok(SMART.re.test("Smart's attack"));
  assert.ok(MOV.re.test('MOV reduction'));
});

test('both match the identifiers the lab actually declares', () => {
  /* src/attack/smart.ts and src/attack/mov.ts, whose exported functions are
     smartAttack and movAttack. The scanner camel-splits identifiers, so both
     spellings must resolve. */
  for (const s of ['smartAttack', 'smart Attack', 'smart_attack', 'smart-attack', "Smart's attack"]) {
    assert.ok(SMART.re.test(s), `Smart's attack should match ${s}`);
  }
  for (const s of ['movAttack', 'mov Attack', 'mov_reduction', 'MOV-reduction', 'MOV reduction']) {
    assert.ok(MOV.re.test(s), `MOV reduction should match ${s}`);
  }
});

test('NOT matched: `\\bmov\\b`, the word-boundary trap', () => {
  /* There is no word boundary between `v` and `A` in `movAttack`, the same trap as
     `\bpedersen\b` missing `commitPedersen`. A bare-word pattern would have
     returned zero and looked like an absence. */
  assert.equal(/\bmov\b/i.test('movAttack'), false, 'this is why the term carries the separator instead');
  assert.ok(MOV.re.test('movAttack'));
});

test('NOT matched: anomalous-curve, which would credit a lab that says it does NOT implement them', () => {
  /* crypto-lab-log-forge carries four such lines, one of them the comment
     "[extension] point: MOV and anomalous-curve attacks need different curve
     choices and algorithms" — a statement that the attacks are absent. */
  const line = '// [extension] point: MOV and anomalous-curve attacks need different curve choices.';
  assert.equal(SMART.re.test(line), false);
  /* The MOV term DOES match this line, and that is correct and harmless: the line
     is a comment, and a name found only in comments is `comment-only`, never an
     implementation credit. What matters is that no term keys on the phrase
     `anomalous-curve` itself. */
  assert.ok(!ALGORITHMS.some((t) => /anomalous/i.test(String(t.re))),
    'no term may key on anomalous-curve');
});

test('NOT matched: an author surname', () => {
  /* Every `menezes` hit in the fleet is a bibliography entry — the Handbook of
     Applied Cryptography, a lattice tutorial, an NFS paper. Crediting a surname is
     the Kipnis-Shamir shape this vocabulary already refuses. */
  for (const cite of [
    'Menezes, van Oorschot & Vanstone, Handbook of Applied Cryptography',
    'A. Menezes, P. Sarkar and S. Singh, "Challenges with Assessing the Impact of NFS"',
    'Menezes, "A gentle introduction to lattice-based cryptography"',
  ]) {
    assert.equal(MOV.re.test(cite), false, `a citation must not credit MOV: ${cite}`);
    assert.equal(SMART.re.test(cite), false);
  }
  assert.ok(!ALGORITHMS.some((t) => /menezes/i.test(String(t.re))), 'no term may key on the surname');
});

test('neither term collides with an existing one', () => {
  /* catalog-sync vocab fails two terms indexing the same algorithm. */
  const names = ALGORITHMS.map((t) => t.name);
  assert.equal(names.filter((n) => n === "Smart's attack").length, 1);
  assert.equal(names.filter((n) => n === 'MOV reduction').length, 1);
  for (const probe of ['smartAttack', 'movAttack']) {
    const matched = ALGORITHMS.filter((t) => t.re.test(probe)).map((t) => t.name);
    assert.deepEqual(matched, [probe === 'smartAttack' ? "Smart's attack" : 'MOV reduction'],
      `${probe} must resolve to exactly one term, got ${JSON.stringify(matched)}`);
  }
});
