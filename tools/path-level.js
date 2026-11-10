/*
 * path-level.js — one definition of a journey's level badge, shared by every
 * surface that shows one.
 *
 * Run: (no command of its own — a shared module, see docs/maintenance-coverage.md)
 * Prevents: the hub, the knowledge map and README disagreeing about a journey's level
 * Reads: nothing on disk; callers pass the per-step levels they already hold
 *
 * THE RULE. A journey is labelled with a single level when at least 75% of its
 * steps carry that level; otherwise it is Mixed. The threshold is a constant
 * here rather than a literal at three call sites, because three copies of a
 * number is how the fleet's "N of these M" lines drifted.
 *
 * Steps whose level is unknown stay in the DENOMINATOR. A journey half of whose
 * labs have no level is not 100% anything, and dropping them would let a single
 * levelled step decide the badge for a journey nobody has classified. That is
 * the same refusal the rest of this repository makes: could-not-read is never
 * nothing-there.
 */

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const LABEL = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
const MIXED = 'Mixed';
const THRESHOLD = 0.75;

/* levels: an array of per-step level strings, with null/undefined for unknown.
   Returns 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed', or '' for no steps. */
function pathBadge(levels) {
  const steps = Array.isArray(levels) ? levels : [];
  if (!steps.length) return '';
  const counts = Object.fromEntries(LEVELS.map((l) => [l, 0]));
  for (const l of steps) if (Object.prototype.hasOwnProperty.call(counts, l)) counts[l] += 1;
  for (const l of LEVELS) if (counts[l] / steps.length >= THRESHOLD) return LABEL[l];
  return MIXED;
}

function pathCounts(levels) {
  const steps = Array.isArray(levels) ? levels : [];
  const counts = Object.fromEntries(LEVELS.map((l) => [l, 0]));
  let unknown = 0;
  for (const l of steps) {
    if (Object.prototype.hasOwnProperty.call(counts, l)) counts[l] += 1;
    else unknown += 1;
  }
  return { total: steps.length, ...counts, unknown };
}

module.exports = { pathBadge, pathCounts, LEVELS, LABEL, MIXED, THRESHOLD };
