'use strict';
/* The badge rule exists twice on purpose: tools/path-level.js for the two
   generators, and an inline copy in index.html because the hub reads card
   levels from its own DOM and cannot require a module. Two copies of a rule is
   how "N of these M" drifted across this repo, so the copies are pinned to each
   other here rather than trusted to stay in step. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathBadge, pathCounts, THRESHOLD } = require('../tools/path-level.js');

const ROOT = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'knowledge-map/catalog.json'), 'utf8'));
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const levelOf = Object.fromEntries(catalog.exhibits.map((e) => [e.title, e.level ?? null]));

/* The page's inline rule, lifted out of index.html and run against the same
   inputs. Taken from the source rather than reimplemented, so this compares the
   shipped copy and not a third one written to agree. */
function inlineBadge(levels) {
  const src = /var LEVEL_BADGE_THRESHOLD = ([0-9.]+);/.exec(html);
  assert.ok(src, 'the inline threshold must be findable in index.html');
  const body = /function pathLevelBadge\(path\) \{([\s\S]*?)\n      \}/.exec(html);
  assert.ok(body, 'the inline pathLevelBadge must be findable in index.html');
  const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced'];
  const LEVEL_LABEL = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
  const fn = new Function('path', 'titleToCard', 'LEVEL_ORDER', 'LEVEL_LABEL', 'LEVEL_BADGE_THRESHOLD',
    body[1].replace(/window\.__pathLevelBadge[\s\S]*$/, ''));
  const titleToCard = {};
  levels.forEach((l, i) => { titleToCard['s' + i] = { getAttribute: () => l }; });
  return fn({ steps: levels.map((_, i) => ({ title: 's' + i })) },
    titleToCard, LEVEL_ORDER, LEVEL_LABEL, Number(src[1]));
}

test('the inline threshold is the shared one', () => {
  const src = /var LEVEL_BADGE_THRESHOLD = ([0-9.]+);/.exec(html);
  assert.equal(Number(src[1]), THRESHOLD);
});

test('both copies agree on every real journey, and the badges are the published ones', () => {
  assert.ok(catalog.paths.length >= 11, 'the fixture must be the real set of journeys');
  for (const p of catalog.paths) {
    const levels = p.steps.map((s) => levelOf[s.title ?? s] ?? null);
    const want = pathBadge(levels);
    assert.equal(p.level, want, p.id + ': the catalog badge must be the derived one');
    assert.equal(inlineBadge(levels), want, p.id + ': the hub inline copy must agree');
  }
});

test('both copies agree on the boundaries, which the real journeys do not reach', () => {
  const mk = (n, k) => Array.from({ length: n }, (_, i) => (i < k ? 'beginner' : 'advanced'));
  const cases = [
    mk(4, 3),            // exactly 75% — in
    mk(4, 2),            // 50% — Mixed
    mk(8, 6),            // exactly 75% — in
    mk(8, 5),            // 62.5% — Mixed
    mk(100, 75),         // exactly at the threshold on a large journey
    mk(100, 74),         // one short
    ['advanced', null, null, null],
    [null, null, null, null],
    [],
  ];
  for (const c of cases) assert.equal(inlineBadge(c), pathBadge(c), JSON.stringify(c).slice(0, 60));
});

test('an unknown level stays in the denominator rather than being dropped', () => {
  /* Three advanced and one unclassified is 75% of what is known but 75% of the
     whole too, so use a case where dropping would change the answer. */
  const levels = ['advanced', 'advanced', null, null];
  assert.equal(pathCounts(levels).total, 4);
  assert.equal(pathBadge(levels), 'Mixed');
  const dropped = levels.filter(Boolean);
  assert.equal(pathBadge(dropped), 'Advanced', 'the control: dropping unknowns WOULD change it');
});

test('next-steps is every-step intermediate, as the journey claims', () => {
  const p = catalog.paths.find((x) => x.id === 'next-steps');
  assert.ok(p, 'the next-steps journey must exist');
  assert.equal(p.steps.length, 14);
  for (const s of p.steps) assert.equal(levelOf[s.title ?? s], 'intermediate', String(s.title ?? s));
  assert.equal(p.level, 'Intermediate');
});
