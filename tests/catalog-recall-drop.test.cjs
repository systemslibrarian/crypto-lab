/**
 * What the recall check SAYS when it fails, and why that is worth a test.
 *
 * The message asserted one cause: "Something that used to be found is no longer
 * found. Do not lower the floor." The second sentence is right. The first is a
 * claim about the NUMERATOR, and recall is a ratio — it also falls when the
 * FIXTURE grows and the entries it gains are not all found yet. The fixture is
 * deliberately grown "as the work goes, not when the gate is in reach", and round
 * 2 of that growth took recall from 92.6% to 91.1% with nothing lost at all. So
 * the sentence was wrong in a case the design expects, and it sent the reader
 * looking for a scanner change that had not happened.
 *
 * A message that is right in the one direction someone happened to try is the
 * same defect one layer up, so all four branches are asserted here, along with
 * the per-miss cause derivation the message leans on.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { causeOf, explainDrop, FLOOR, BASELINE } = require('../tools/catalog-recall.js');

const BASE = { hit: 58, truth: 65, on: '2026-10-15', where: 'CLAUDE.md' };
const say = (hit, truth, rows = []) => explainDrop(hit, truth, BASE, rows).join('\n');

test('a smaller numerator over the same denominator says a find was lost', () => {
  const out = say(57, 65);
  assert.match(out, /found {7}58 -> 57 {2}\(1 fewer\)/);
  assert.match(out, /measurable {2}65 -> 65 {2}\(unchanged\)/);
  assert.match(out, /1 find that used to be made is no longer made, over the same denominator/);
  assert.doesNotMatch(out, /NOTHING STOPPED BEING FOUND/);
});

test('a LARGER denominator with nothing lost says nothing stopped being found', () => {
  /* The case the old message got wrong. 62 of 72 is 86.1%, below the floor, with
     four MORE finds than the baseline: the honest extension this file's own
     method section says the fixture is free to be. */
  const out = say(62, 72);
  assert.match(out, /NOTHING STOPPED BEING FOUND/);
  assert.match(out, /fixture grew by 7 measurable entries/);
  assert.match(out, /not a\n?\s*scanner regression/);
  assert.doesNotMatch(out, /no longer made/);
});

test('both terms moving says both, and puts the lost find first', () => {
  const out = say(56, 70);
  assert.match(out, /Both terms moved: 2 finds that used to be made are no longer made, AND the fixture gained 5/);
  assert.match(out, /Read the lost find first/);
});

test('a shrinking denominator is named as smaller, not as the same', () => {
  const out = say(55, 60);
  assert.match(out, /over a smaller denominator/);
});

test('arithmetic that does not explain the drop says so instead of guessing', () => {
  /* hit up, truth unchanged, and still below the floor: impossible against a
     correct baseline, which means the baseline is stale. The message must say
     "re-derive" rather than invent a cause. */
  const out = say(60, 65);
  assert.match(out, /does not\n?\s*explain this on its own/);
  assert.match(out, /may simply be stale/);
});

test('the message never claims a lost find unless the numerator actually fell', () => {
  for (const [hit, truth] of [[58, 65], [60, 70], [58, 80], [59, 75]]) {
    assert.doesNotMatch(say(hit, truth), /no longer made/,
      `hit ${hit} truth ${truth}: nothing was lost, so nothing may be said to be`);
  }
});

/* ------------------------------------------------- the per-miss cause */

const lab = (over = {}) => ({ implements: [], references: [], commentOnly: [], protocolPartial: [], ...over });

test('a term a review removed is a reviewed DECISION, not a detection failure', () => {
  /* Checked first on purpose: a removal overrides every observation below it,
     because it is a judgement a person made rather than something the scanner
     saw. kem-trap's Fujisaki-Okamoto transform is the live case. */
  const c = causeOf('crypto-lab-kem-trap', 'Fujisaki-Okamoto transform', lab({ commentOnly: ['Fujisaki-Okamoto transform'] }));
  assert.equal(c.id, 'removed-by-review');
  assert.match(c.say, /the measurement working, not the scanner failing/);
});

test('the review-removal cause is read from the real pin table, not from a fixture', () => {
  const live = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tools', 'catalog-reviewed.json'), 'utf8'));
  assert.ok((live['crypto-lab-kem-trap'].remove || []).includes('Fujisaki-Okamoto transform'),
    'this control needs the live removal it is named after');
  assert.ok((live['crypto-lab-frozen-heart'].remove || []).includes('Ed25519'));
  assert.equal(causeOf('crypto-lab-frozen-heart', 'Ed25519', lab()).id, 'removed-by-review');
});

test('protocol-partial outranks comment-only, because the shape\'s own refusal is more precise', () => {
  const c = causeOf('crypto-lab-blind-hello', 'TLS 1.3',
    lab({ protocolPartial: [{ name: 'TLS 1.3' }], commentOnly: [{ name: 'TLS 1.3' }] }));
  assert.equal(c.id, 'protocol-partial');
  assert.match(c.say, /EXEMPTED/);
});

test('comment-only and reference-only are distinguished, and both are named exempt classes', () => {
  assert.equal(causeOf('x', 'P-256', lab({ commentOnly: [{ name: 'P-256' }] })).id, 'comment-only');
  assert.equal(causeOf('x', 'AES-CTR', lab({ references: [{ name: 'AES-CTR' }] })).id, 'reference-only');
  assert.match(causeOf('x', 'P-256', lab({ commentOnly: ['P-256'] })).say, /EXEMPTED/);
});

test('a term nothing named at all is the only class called a candidate gap', () => {
  const c = causeOf('x', 'Kupyna', lab());
  assert.equal(c.id, 'not-named');
  assert.match(c.say, /no detection shape named it/);
});

test('a missing lab is not an exception: the cause is still derived, not skipped', () => {
  /* A lab absent from the scanner output used to produce an empty `got` set and
     a bare miss with no explanation. It must still classify. */
  assert.equal(causeOf('crypto-lab-not-here', 'AES', undefined).id, 'not-named');
});

test('the floor and the baseline are separate numbers with separate jobs', () => {
  /* CHANGED 2026-11-23, and the dropped assertion is named rather than quietly
     deleted. This used to end with "nothing may gate on the baseline; only the
     floor gates", on the reading that BASELINE was a reporting aid. #532 is the
     argument that reading was wrong: CLAUDE.md has always described this check as
     one that "fails on a DROP", and an absolute bar cannot express a drop, so a
     find lost above the bar went unreported and a find removed BELOW it made the
     daily job permanently red.

     Both numbers gate now. What this test was really protecting survives intact
     and is the part asserted below: the two answer different questions and must
     not merge into one. The hazard the old assertion was guarding against -- a
     gate on a number a re-record can move -- is handled by keeping FLOOR
     absolute, not by leaving the drop unchecked; see #519, closed unmerged for
     proposing BASELINE as the SOLE gate.

     The two gate cases themselves are in tests/catalog-recall-two-gates.test.cjs,
     one per gate, each being the case the other gate cannot catch. */
  assert.equal(FLOOR, 0.88);
  assert.ok(BASELINE.hit > 0 && BASELINE.truth > 0);
  assert.ok(BASELINE.on && BASELINE.where, 'a recorded measurement travels with where it was recorded');
  const src = fs.readFileSync(path.join(__dirname, '..', 'tools', 'catalog-recall.js'), 'utf8');
  assert.match(src, /TWO GATES, TWO JOBS|TWO GATES, BOTH MUST HOLD/,
    'the distinction must be written down beside the constants');
  assert.notEqual(BASELINE.hit / BASELINE.truth, FLOOR,
    'if these two ever coincide again the difference stops being visible, which is how they came apart');
  /* And the floor must still be a literal rather than anything derived from the
     baseline -- that is what keeps a re-record from moving the absolute bar. */
  assert.match(src, /^const FLOOR = 0\.88;$/m, 'the floor stays an absolute literal');
});
