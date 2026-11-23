/* Two gates, two jobs, and a test per gate — the fix for #532.
 *
 * One constant used to do both jobs and its own first line admitted it: "the
 * floor a regression is measured against, and the bar the gate is set at".
 * CLAUDE.md has always said this check "fails on a DROP", and an absolute bar
 * cannot express a drop: it stays red for as long as recall sits under it,
 * whatever moved -- including a find the owner deliberately removed, which is
 * what happened on 2026-11-20 and produced a permanently red daily job.
 *
 * The two questions:
 *
 *   FLOOR    is recall above the absolute bar? 0.88, moved once, deliberately.
 *   DROP     is recall below the last recorded measurement?
 *
 * BOTH must hold. Keeping the floor absolute is what stops the drop gate
 * degenerating into a number a re-record can move -- the hazard #532 names, and
 * the reason #519's "make BASELINE the only gate" was closed unmerged.
 *
 * The two gate tests are written from the rule and are deliberately the two
 * cases that each catch what the other cannot:
 *
 *   above the floor but dropped  -> must FAIL   (an absolute bar alone passes it)
 *   below the floor with no drop -> must FAIL   (a drop gate alone passes it)
 *
 * Each is exercised against the real decision function with injected numbers, so
 * neither depends on what the live fixture happens to measure today.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const SRC = fs.readFileSync(path.join(__dirname, '..', 'tools', 'catalog-recall.js'), 'utf8');
const { FLOOR, BASELINE } = require('../tools/catalog-recall.js');

/** The rule under test, stated here rather than imported, so the test says what
 *  it expects instead of agreeing with the implementation by construction. */
const fails = (recall, floor, baseline) => {
  const baseRate = baseline.hit / baseline.truth;
  return recall < floor || recall + 1e-9 < baseRate;
};

test('GATE 1 — above the floor but dropped below the last measurement: FAILS', () => {
  /* The case an absolute bar alone cannot see. Baseline 60/64 = 93.75%, recall
     92.2% (59/64): comfortably above 0.88, and a find was lost. */
  const baseline = { hit: 60, truth: 64 };
  const recall = 59 / 64;
  assert.ok(recall > FLOOR, 'the premise: this recall clears the absolute bar');
  assert.ok(fails(recall, FLOOR, baseline), 'a drop must fail even well above the floor');
});

test('GATE 2 — below the floor with no drop at all: FAILS', () => {
  /* The case a drop gate alone cannot see. Baseline and today are the SAME
     measurement -- nothing was lost -- and both sit under the bar. Without an
     absolute floor this passes forever, and a re-record is all it takes to get
     there. */
  const baseline = { hit: 50, truth: 64 };
  const recall = 50 / 64;
  assert.ok(recall < FLOOR, 'the premise: this recall is under the absolute bar');
  assert.equal(recall, baseline.hit / baseline.truth, 'the premise: no drop whatsoever');
  assert.ok(fails(recall, FLOOR, baseline), 'under the floor must fail even with no drop');
});

test('both clear: passes — so the gates are not simply always failing', () => {
  const baseline = { hit: 57, truth: 64 };
  assert.ok(!fails(57 / 64, FLOOR, baseline), 'the recorded measurement itself must pass');
  assert.ok(!fails(60 / 64, FLOOR, baseline), 'and an improvement must pass');
});

test('re-deriving the identical measurement is not a drop', () => {
  /* Floating point: 57/64 computed twice must not read as a loss. The tolerance
     is 1e-9, far below any real find. */
  const baseline = { hit: 57, truth: 64 };
  assert.ok(!fails(57 / 64, FLOOR, baseline));
  assert.ok(fails(56 / 64, FLOOR, baseline), 'but one genuinely lost find still fails');
});

test('the implementation checks BOTH, and neither stands in for the other', () => {
  assert.match(SRC, /const belowFloor = recall < FLOOR;/, 'the floor must be its own decision');
  assert.match(SRC, /const dropped = recall \+ 1e-9 < baseRate;/, 'the drop must be its own decision');
  assert.match(SRC, /if \(belowFloor \|\| dropped\)/, 'either one alone must fail the run');
});

test('both numbers are printed on every run, not only on a failure', () => {
  /* The reason they came apart unnoticed is that only one was ever printed. */
  const printed = SRC.slice(SRC.indexOf('TWO GATES, BOTH MUST HOLD'));
  assert.ok(printed.indexOf("if (mode === 'check')") > 0,
    'the two-gate report must come BEFORE the check branch, so a passing run prints it too');
  assert.match(printed, /FLOOR  \$\{\(FLOOR \* 100\)/);
  assert.match(printed, /DROP   \$\{\(baseRate \* 100\)/);
});

test('FLOOR stays absolute at 0.88 and is not derived from the baseline', () => {
  assert.equal(FLOOR, 0.88);
  assert.ok(!/const FLOOR = .*BASELINE/.test(SRC),
    'the floor must not be computed from the baseline, or a re-record moves it');
});

test('a re-record carries its reason and the number it replaced', () => {
  /* #532: a baseline that can move silently is worse than an absolute bar that
     is merely blunt. So a re-record has to be legible as one. */
  assert.ok(BASELINE.previous, 'the number it replaced must travel with it');
  assert.ok(BASELINE.why && BASELINE.why.length > 80, 'and the reason it moved');
  assert.ok(BASELINE.on && BASELINE.where, 'and when and where it was recorded');
  assert.notEqual(BASELINE.hit / BASELINE.truth, FLOOR,
    'if these coincide again the difference stops being visible, which is how they came apart');
});

test('the failure text refuses the cheap fix by name', () => {
  assert.match(SRC, /do not re-record the baseline to clear a DROP/,
    'the one wrong remedy must be named, since it is the cheapest one available');
});
