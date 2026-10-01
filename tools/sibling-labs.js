/*
 * sibling-labs.js — enumerate the sibling lab clones, excluding linked git
 * worktrees, which are working copies of something already counted.
 *
 * Not runnable. Required by theme-sync.js, gate-sync.js and dispatch-sync.js.
 *
 * WHY THIS EXISTS
 *
 * Three checkers here find the fleet by reading this repository's parent
 * directory and keeping the entries whose names begin `crypto-lab`,
 * `crypto-compare` or `crypto-counsel`. CLAUDE.md tells every lane to work in
 * its own worktree and gives the command:
 *
 *     git worktree add ../crypto-lab-lane-<name> -b <branch>
 *
 * which creates a directory matching that pattern, containing this repository's
 * own `.github/workflows` and its own `teach/` pages. Following the documented
 * practice therefore adds a 223rd "lab" that is really the catalog, and:
 *
 *   theme-sync     fails it, because teach/ pages are generated and do not pin
 *                  data-theme with a literal the way a lab's index.html does
 *   dispatch-sync  reports UNPINNED-LAB and COUNT against the census, because
 *                  the pinned denominator says 222 and disk now says 223
 *   gate-sync      judges the catalog's own deploy workflow as a lab's
 *
 * Observed on 2026-10-01: a worktree at ../crypto-lab-expect, made to edit
 * fleet-check.js, failed theme-sync on `crypto-lab-expect/teach/symmetric/
 * index.html`. The finding named a path inside the catalog and read as a lab
 * defect. That is this repository's recurring shape — answering from a copy, and
 * publishing the gap as a fact about the subject — reached by following its own
 * instructions.
 *
 * THE RULE
 *
 * A linked git worktree has `.git` as a FILE holding `gitdir: …`; a clone has
 * `.git` as a DIRECTORY. So a sibling whose `.git` is a file is a second working
 * copy of a repository that is already in the list under its real clone, and is
 * excluded. This covers a worktree of the catalog and a worktree of any lab,
 * without naming either, and without a hand-maintained exception list.
 *
 * It is EXCLUDED, NOT SKIPPED IN SILENCE. `excluded` comes back beside `labs`
 * and each caller prints the names, because a denominator that drops quietly is
 * the defect `dispatch-census.json` exists to make loud. A reader must be able
 * to see that the number moved and why.
 */
'use strict';

const fs = require('fs');
const path = require('path');

/* Directory names that are fleet repositories. crypto-compare and crypto-counsel
 * carry no crypto-lab- prefix, so a glob on crypto-lab-* misses them in silence. */
const LAB_DIR_RE = /^crypto-(lab|compare|counsel)/;

/** Is this a linked git worktree rather than a clone? */
function isLinkedWorktree(dir) {
  try {
    return fs.statSync(path.join(dir, '.git')).isFile();
  } catch {
    return false;
  }
}

/**
 * @param {string} fleetRoot    directory holding the clones (this repo's parent)
 * @param {object} [opts]
 * @param {boolean} [opts.requireWorkflows]  keep only entries with .github/workflows
 * @returns {{ labs: string[], excluded: string[] }}
 */
function siblingLabs(fleetRoot, opts = {}) {
  const named = fs.readdirSync(fleetRoot).sort().filter((d) => LAB_DIR_RE.test(d));
  const excluded = [];
  const labs = [];
  for (const d of named) {
    const dir = path.join(fleetRoot, d);
    try {
      if (!fs.statSync(dir).isDirectory()) continue;
    } catch {
      continue;
    }
    if (isLinkedWorktree(dir)) {
      excluded.push(d);
      continue;
    }
    if (opts.requireWorkflows && !fs.existsSync(path.join(dir, '.github', 'workflows'))) continue;
    labs.push(d);
  }
  return { labs, excluded };
}

/** One line for a report, or '' when nothing was excluded. */
function excludedLine(excluded) {
  if (!excluded.length) return '';
  return `Linked git worktrees beside the clones, excluded as working copies rather than labs (${excluded.length}):\n`
    + excluded.map((d) => `  ${d}`).join('\n');
}

module.exports = { siblingLabs, isLinkedWorktree, excludedLine, LAB_DIR_RE };
