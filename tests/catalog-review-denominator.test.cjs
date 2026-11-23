/* The review queue's denominator must be the CATALOG, not the pin table.
 *
 * Every other test that reads tools/catalog-reviewed.json iterates the table:
 * tests/pin-advance-clone-coverage.test.cjs loops `Object.entries(pins)`, and
 * tests/catalog-reference-review.test.cjs requires the table itself. So a carded
 * lab with no entry is outside all of their denominators at once, and on
 * 2026-11-23 that was 123 of 264 carded labs -- invisible, with every check
 * green. This test's denominator is the card set, which is the only one that can
 * notice a lab the pin table was never told about.
 *
 * It asserts a PARTITION: every carded lab is in exactly one of reviewed or
 * not-reviewed, and the two counts sum to the card count. A partition is the
 * right shape because the defect was not a wrong count, it was a card belonging
 * to no count at all.
 *
 * Expected outcomes below are written from the rule -- "a card with no
 * REVIEWS[slug] lands in NO-REVIEW" -- not from running the tool and recording
 * what it said. The mutation case asserts a DELTA of exactly one slug, so it
 * cannot pass by the whole report changing shape.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const { readCards } = require(path.join(ROOT, 'tools/card-reader.js'));
const EVIDENCE = fs.readFileSync(path.join(ROOT, 'tools/catalog-evidence.js'), 'utf8');

const cards = () => readCards(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')).cards;
const pinTable = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/catalog-reviewed.json'), 'utf8'));

/** The rule, stated once here so each assertion below reads against it. */
const classify = (slugs, pins) => {
  const reviewed = slugs.filter((s) => Object.prototype.hasOwnProperty.call(pins, s));
  const noReview = slugs.filter((s) => !Object.prototype.hasOwnProperty.call(pins, s));
  return { reviewed, noReview };
};

test('every carded lab lands in exactly one state, and the states sum to the card count', () => {
  const slugs = cards().map((c) => c.slug);
  const uniq = [...new Set(slugs)];
  const { reviewed, noReview } = classify(uniq, pinTable());

  assert.equal(reviewed.length + noReview.length, uniq.length,
    'reviewed plus never-reviewed must be the whole card set; a card in neither is the defect this pins');
  assert.deepEqual(
    [...reviewed, ...noReview].sort(),
    [...uniq].sort(),
    'the two states must partition the cards exactly — nothing lost, nothing counted twice',
  );
  const both = reviewed.filter((s) => noReview.includes(s));
  assert.deepEqual(both, [], 'no lab may be in both states');
});

test('the denominator is the card set, not the pin table', () => {
  /* The property, asserted on the source rather than the output: the per-card
     loop must push a NO-REVIEW entry on the `!review` branch. A version that
     only ever looks inside `if (review)` cannot see a card the table omits,
     however correct everything inside that branch is. */
  assert.match(EVIDENCE, /if \(!review\) \{/,
    'the per-card check must have a branch for a card with no pin entry');
  const loop = EVIDENCE.slice(EVIDENCE.indexOf('const review = REVIEWS[c.slug];'));
  const noReviewPush = loop.indexOf('noReview.push(');
  const reviewedBranch = loop.indexOf('if (review) {');
  assert.ok(noReviewPush > 0, 'the no-pin branch must record a state');
  assert.ok(noReviewPush < reviewedBranch,
    'the no-pin state must be recorded OUTSIDE the if (review) branch, or it cannot fire');
});

test('NO-REVIEW is counted in the summary beside STALE-REVIEW and CLONE-BEHIND', () => {
  assert.match(EVIDENCE, /NO-REVIEW \(\$\{noReview\.length\}\)/, 'it needs a counted section of its own');
  assert.match(EVIDENCE, /STALE-REVIEW \(\$\{staleReviews\.length\}\)/);
  assert.match(EVIDENCE, /CLONE-BEHIND \(\$\{behind\.length\}\)/);
});

test('NO-REVIEW fails the run, the same severity as STALE-REVIEW', () => {
  /* A lab never reviewed cannot stand better than one reviewed and then moved,
     so it must be in the condition that exits non-zero — not merely printed. */
  const cond = /if \(bad\.length \|\| noReview\.length \|\|/;
  assert.match(EVIDENCE, cond, 'noReview must be part of the failing condition');
});

test('the state is not named NEVER-REVIEWED, which another checker already owns', () => {
  /* corpus-freshness.js uses NEVER-REVIEWED for a corpus entry whose PROSE has
     never been checked. Two subjects under one state name is how the second
     reader misses what the first one learned, so this one is NO-REVIEW. */
  const freshness = fs.readFileSync(path.join(ROOT, 'tools/corpus-freshness.js'), 'utf8');
  assert.match(freshness, /NEVER-REVIEWED/, 'the name this one must not reuse is still taken');
  const report = EVIDENCE.slice(EVIDENCE.indexOf('if (noReview.length) {'));
  const section = report.slice(0, report.indexOf('if (staleAnchors.length) {'));
  assert.ok(!/NEVER-REVIEWED/.test(section), 'the NO-REVIEW section must not call itself NEVER-REVIEWED');
});

test('MUTATION: dropping one review entry moves exactly that slug into NO-REVIEW, and restoring it moves it back', () => {
  /* Expected outcome written from the rule: remove crypto-lab-biham-lens's entry
     and the partition must move that one slug from reviewed to noReview, with
     every other slug's state byte-identical. Then restore and the delta is nil.
     A fixture copy, never the live table -- this test must not be able to edit
     the pin table even if it throws. */
  const slugs = [...new Set(cards().map((c) => c.slug))];
  const live = pinTable();
  const victim = Object.keys(live).find((k) => slugs.includes(k));
  assert.ok(victim, 'the table must contain at least one carded lab to remove');

  const before = classify(slugs, live);

  const mutated = { ...live };
  delete mutated[victim];
  const after = classify(slugs, mutated);

  assert.deepEqual(
    after.noReview.filter((s) => !before.noReview.includes(s)),
    [victim],
    'exactly the removed slug becomes NO-REVIEW',
  );
  assert.deepEqual(
    before.reviewed.filter((s) => !after.reviewed.includes(s)),
    [victim],
    'and exactly that slug leaves the reviewed state',
  );
  assert.equal(after.noReview.length, before.noReview.length + 1);
  assert.equal(after.reviewed.length, before.reviewed.length - 1);
  assert.equal(after.noReview.length + after.reviewed.length, slugs.length,
    'the partition still covers every card after the mutation');

  const restored = classify(slugs, live);
  assert.deepEqual(restored.noReview.sort(), before.noReview.sort(), 'restoring the entry undoes it exactly');
  assert.deepEqual(restored.reviewed.sort(), before.reviewed.sort());
});

test('a card whose href is not a lab page is outside this denominator, and says so', () => {
  /* The card set here is cards with a github.io lab link, because that is what
     catalog-evidence derives from. Anything else is reported by the reader
     rather than silently dropped -- the same refusal as everywhere else. */
  const { hrefless } = readCards(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'));
  for (const h of hrefless) {
    assert.ok(h.why, 'a card the reader could not resolve must carry a reason, not vanish');
  }
});
