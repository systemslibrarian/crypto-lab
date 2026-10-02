/*
 * sibling-labs.js — enumerate the sibling lab clones, excluding linked git
 * worktrees, which are working copies of something already counted.
 *
 * Not runnable. Required by theme-sync.js, gate-sync.js, dispatch-sync.js,
 * dispatch-comment-sync.js, deploy-sync.js and port-sync.js.
 *
 * WHY THIS EXISTS
 *
 * Six checkers here find the fleet by reading this repository's parent
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
 * AND A FLEET OF ZERO IS NOT A CLEAN FLEET
 *
 * Measured on 2026-10-02, by running each clone-reading checker from a worktree
 * outside the fleet root, where the clones are simply not there:
 *
 *   port-sync   exit 0, "Labs with a Playwright config: 0", and then
 *               "Every lab has its own port, pinned, with --strictPort"
 *   theme-sync  exit 0, "Lab pages checked: 0", then "Every lab pins one theme"
 *   gate-sync   exit 0, "Labs gated by both a Pages deploy and an auto-merge: 0"
 *   deploy-sync exit 0, "Deploying labs checked: 0 (0 current, 0 stale)"
 *
 * Three of those four run in the WEEKLY job, which clones the siblings itself.
 * A clone step that half fails therefore turns the fleet green while nothing is
 * being checked — the same could-not-look-reported-as-clean shape this file was
 * written for, one level up: the exclusion was loud, the absence was not.
 *
 * Only dispatch-sync and dispatch-comment-sync refused, and the reason is the
 * one CLAUDE.md already argues: they compare against a DECLARED denominator,
 * tools/dispatch-census.json, so zero labs is a named COUNT failure rather than
 * an empty loop. That denominator is reused here as a floor for every caller:
 * fewer clones on disk than the census pins is FLEET-UNREAD and fails, because
 * a checker that cannot see the fleet must never answer questions about it.
 * Adding or removing a lab therefore means re-pinning the census, which is
 * already the contract.
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

/* The declared denominator: how many clones the fleet is pinned at. Read from
 * the census rather than hardcoded, so it moves when a lab is added or removed
 * and nowhere else. An unreadable census is itself a refusal — it is a tracked
 * file in this repository, so not being able to read it is a broken checkout
 * rather than a smaller fleet. */
function pinnedCloneCount() {
  try {
    const census = JSON.parse(fs.readFileSync(path.join(__dirname, 'dispatch-census.json'), 'utf8'));
    const n = census && census.totals && census.totals.labs;
    return Number.isInteger(n) ? n : null;
  } catch {
    return null;
  }
}

/**
 * @param {string} fleetRoot    directory holding the clones (this repo's parent)
 * @param {object} [opts]
 * @param {boolean} [opts.requireWorkflows]  keep only entries with .github/workflows
 * @returns {{ labs: string[], excluded: string[], clones: number, pinned: number|null, shortfall: number }}
 */
function siblingLabs(fleetRoot, opts = {}) {
  let named = [];
  try {
    named = fs.readdirSync(fleetRoot).sort().filter((d) => LAB_DIR_RE.test(d));
  } catch {
    named = [];
  }
  const excluded = [];
  const labs = [];
  let clones = 0;
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
    clones += 1;
    if (opts.requireWorkflows && !fs.existsSync(path.join(dir, '.github', 'workflows'))) continue;
    labs.push(d);
  }
  const pinned = pinnedCloneCount();
  const shortfall = pinned === null ? 0 : Math.max(0, pinned - clones);
  return { labs, excluded, clones, pinned, shortfall };
}

/**
 * The refusal, from a raw count. '' when the fleet is visible; otherwise the
 * text a caller prints before exiting non-zero. Keyed on the clones FOUND,
 * never on a checker's own filtered subset, because the question is "am I
 * looking at the fleet at all" rather than "how many passed my filter".
 *
 * Takes a number so the self-enumerating callers (theme-sync, deploy-sync,
 * which import only isLinkedWorktree and walk the root themselves) get the same
 * floor as the ones calling siblingLabs().
 */
function fleetUnread(clones) {
  const pinned = pinnedCloneCount();
  return fleetUnreadLine({ clones, pinned, shortfall: pinned === null ? 0 : Math.max(0, pinned - clones) });
}

/** The same refusal, from a siblingLabs() result. */
function fleetUnreadLine(res) {
  if (res.pinned === null) {
    return 'FLEET-UNREAD — tools/dispatch-census.json did not parse, so the pinned\n'
      + '  denominator is unknown and nothing below is a claim about the fleet.';
  }
  if (!res.shortfall) return '';
  return `FLEET-UNREAD — ${res.clones} sibling clones on disk, census pins ${res.pinned}`
    + ` (${res.shortfall} missing).\n`
    + '  Nothing below is a claim about the fleet: a checker that cannot see the clones\n'
    + '  must not report them clean. Clone the missing labs, or re-pin with\n'
    + '  `node tools/dispatch-census.js write` if a lab really has left.';
}

/** One line for a report, or '' when nothing was excluded. */
function excludedLine(excluded) {
  if (!excluded.length) return '';
  return `Linked git worktrees beside the clones, excluded as working copies rather than labs (${excluded.length}):\n`
    + excluded.map((d) => `  ${d}`).join('\n');
}

module.exports = {
  siblingLabs, isLinkedWorktree, excludedLine, fleetUnread, fleetUnreadLine, pinnedCloneCount, LAB_DIR_RE,
};
