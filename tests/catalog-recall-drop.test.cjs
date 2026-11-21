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

test('the bar and the baseline are separate numbers with separate jobs', () => {
  /* DELIBERATELY INVERTED on 2026-11-21. This test used to assert "nothing may
     gate on the baseline; only the floor gates", on the reading that BASELINE was
     a reporting aid. The owner re-recorded the baseline to settle a permanently
     red daily job, and that only works if the regression check compares against
     the recorded measurement -- so BASELINE is now what gates and the 88% is the
     chip-rule bar. What survives is the thing the old assertion was protecting:
     the two numbers answer different questions and must not merge. See the
     two-threshold tests below for both directions. */
  assert.equal(FLOOR, 0.88);
  assert.ok(BASELINE.hit > 0 && BASELINE.truth > 0);
  assert.ok(BASELINE.on && BASELINE.where, 'a recorded measurement travels with where it was recorded');
  const src = fs.readFileSync(path.join(__dirname, '..', 'tools', 'catalog-recall.js'), 'utf8');
  assert.match(src, /TWO NUMBERS WITH TWO JOBS/, 'the distinction must be written down beside the constants');
  assert.notEqual(BASELINE.hit / BASELINE.truth, FLOOR,
    'if these two ever coincide again, the difference stops being visible, which is how they came apart unnoticed');
});

/* ------------------------------------------------- the two thresholds
 *
 * FLOOR used to do two jobs, and its own first line said so: "the floor a
 * regression is measured against, and the bar the gate is set at". While recall
 * sat above 0.88 the two answers coincided and nothing made the difference
 * visible. On 2026-11-20 they came apart, and a permanently red daily job is a
 * daily job people learn to scroll past -- which is how a check stops being one.
 *
 * So `check` now fails on a DROP below the last recorded measurement, and the
 * 88% stays as the bar the chip rule must clear. The risk this introduces is
 * obvious and is the point of these tests: the thing that gates is now a number
 * an edit can move, so the reason has to travel with it, and the two numbers must
 * not quietly become one again.
 */
const { isDrop, baselineRecall, GATE } = require('../tools/catalog-recall.js');

test('recall equal to the last recorded measurement is not a drop', () => {
  assert.equal(isDrop(BASELINE.hit / BASELINE.truth), false);
  assert.equal(isDrop(57 / 65), false, 'the measurement this baseline was recorded from');
});

test('one find fewer over the same denominator IS a drop', () => {
  assert.equal(isDrop((BASELINE.hit - 1) / BASELINE.truth), true);
});

test('the same ratio written with different numbers is not a drop', () => {
  /* 57/65 and 114/130 are the same number and need not be the same float; a
     naive `<` would call a doubled fixture a regression. */
  assert.equal(isDrop((BASELINE.hit * 2) / (BASELINE.truth * 2)), false);
});

test('recall above the baseline but BELOW the gate bar passes the check and does NOT clear the gate', () => {
  /* The whole reason the two numbers are separate. 57/64 = 89.1% is above the
     recorded 87.7% and above the 88% bar; 57/65 is above the baseline and below
     the bar. Passing the regression check must never read as clearing the gate. */
  const between = 0.879;
  assert.ok(between > baselineRecall() && between < FLOOR, 'this control needs a value between the two');
  assert.equal(isDrop(between), false, 'no drop, so check passes');
  assert.ok(between < GATE.recall, 'and the gate is still not met at that recall');
});

test('the gate bar did not move when the baseline was re-recorded', () => {
  assert.equal(FLOOR, 0.88);
  assert.equal(GATE.recall, 0.88);
  assert.equal(GATE.movedFrom, 0.95);
  assert.ok(baselineRecall() < GATE.recall,
    'today the baseline sits BELOW the bar; if this ever flips, raise the bar rather than merging the two');
});

test('a re-recorded baseline must carry its reason and what it replaced', () => {
  /* The only protection there is. The number that gates is now editable, so
     "re-recorded to make the run pass" with nothing written down must fail. */
  assert.ok(String(BASELINE.recordedBy || '').trim().length >= 40, 'a re-record needs a stated reason');
  assert.match(String(BASELINE.recordedBy), /owner/i, 'and it is the owner who re-records');
  assert.ok(BASELINE.previous && BASELINE.previous.hit > 0 && BASELINE.previous.truth > 0,
    'the number it replaced is kept, so the movement is readable rather than lost');
  assert.match(String(BASELINE.on), /^\d{4}-\d{2}-\d{2}$/);
});

test('nothing gates on the bar any more, and the drop predicate is the only exit', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'tools', 'catalog-recall.js'), 'utf8');
  assert.match(src, /mode === 'check' && isDrop\(recall\)/,
    'check must exit on the drop predicate, which is the thing these tests assert');
  assert.ok(!/recall\s*<\s*FLOOR/.test(src),
    'a second comparison against the bar would restore the permanently-red run this replaced');
  assert.match(src, /TWO NUMBERS WITH TWO JOBS/, 'the split must be written down beside the constants');
});
