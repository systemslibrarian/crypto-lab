/*
 * sibling-labs.js — enumerate sibling sources without counting duplicate lanes.
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
 * A `.git` FILE identifies a worktree, not whether the subject is already in
 * this directory. In an isolated current-source layout the canonical repo name
 * may itself be a worktree, with the managed base outside the layout. Count it
 * only when Git metadata/back-pointer/top-level are readable and its strict
 * GitHub owner/repo origin matches that canonical name. Other worktrees remain
 * excluded, including a catalog checkout named as another lab or a lane alias.
 * Discovery establishes identity only: clone-source.js still controls which
 * committed bytes are read from a dirty source, and its guards are unchanged.
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
const { execFileSync } = require('child_process');

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

/** Exact project origin, never a credential URL, URL prefix or another owner. */
function canonicalOrigin(origin, name) {
  if (!LAB_DIR_RE.test(name) || /[\s\u0000-\u001f]/.test(origin)) return false;
  const match = /^(?:https:\/\/github\.com\/|ssh:\/\/git@github\.com\/|git@github\.com:)systemslibrarian\/([A-Za-z0-9._-]+)$/.exec(origin);
  return !!match && match[1].replace(/\.git$/, '') === name;
}

/** A real canonical source worktree; malformed metadata never authorizes it. */
function canonicalWorktree(dir) {
  try {
    const file = path.join(dir, '.git');
    // A directory alias is supported. A substituted .git symlink is not.
    if (!fs.lstatSync(file).isFile()) return false;
    const raw = fs.readFileSync(file, 'utf8');
    const match = /^gitdir: ([^\r\n\u0000]+)\r?\n?$/.exec(raw);
    if (!match || raw.length > 8192) return false;
    const gitDir = fs.realpathSync(path.resolve(dir, match[1]));
    const backFile = path.join(gitDir, 'gitdir');
    if (!fs.lstatSync(backFile).isFile()) return false;
    const back = fs.readFileSync(backFile, 'utf8').trim();
    if (!back || /[\r\n\u0000]/.test(back)
        || fs.realpathSync(path.resolve(gitDir, back)) !== fs.realpathSync(file)) return false;
    // A pointer into an ordinary clone, arbitrary directory or unrelated
    // worktree cannot satisfy both the administrative back-pointer and Git.
    const env = { ...process.env };
    for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE']) delete env[key];
    const git = (args) => execFileSync('git', ['-C', dir, ...args], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 10_000, env,
    }).trim();
    if (git(['rev-parse', '--is-inside-work-tree']) !== 'true'
        || fs.realpathSync(git(['rev-parse', '--show-toplevel'])) !== fs.realpathSync(dir)
        || fs.realpathSync(path.resolve(dir, git(['rev-parse', '--git-dir']))) !== gitDir) return false;
    try {
      if (!/^[a-f0-9]{40}$/.test(git(['rev-parse', '--verify', 'HEAD^{commit}']))) return false;
    } catch (error) {
      // An origin-verified repository waiting for its first commit is still a
      // subject. Distinguish a genuinely unborn branch from corrupt/missing
      // objects, a detached invalid HEAD, timeouts and other read failures.
      if (error.status !== 128) return false;
      const ref = git(['symbolic-ref', '--quiet', 'HEAD']);
      if (!ref.startsWith('refs/heads/')) return false;
      git(['check-ref-format', ref]);
      try {
        git(['show-ref', '--verify', '--quiet', ref]);
        return false; // A present branch whose commit was unreadable is corrupt.
      } catch (missing) {
        if (missing.status !== 1) return false;
      }
    }
    return canonicalOrigin(git(['remote', 'get-url', 'origin']), path.basename(path.resolve(dir)));
  } catch {
    return false; // Unreadable is not a canonical subject.
  }
}

/** Preserve ordinary clones; files require the full canonical worktree check. */
function repositorySource(dir) {
  try {
    const metadata = fs.lstatSync(path.join(dir, '.git'));
    return metadata.isDirectory() || (metadata.isFile() && canonicalWorktree(dir));
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
    if (!repositorySource(dir)) {
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
 * Takes a number so self-enumerating callers get the same floor as the ones
 * calling siblingLabs(). Discovery uses repositorySource() in either case.
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
  return `Noncanonical or unreadable repository entries, excluded rather than counted as lab subjects (${excluded.length}):\n`
    + excluded.map((d) => `  ${d}`).join('\n');
}

module.exports = {
  siblingLabs, isLinkedWorktree, canonicalOrigin, canonicalWorktree,
  repositorySource,
  excludedLine, fleetUnread, fleetUnreadLine, pinnedCloneCount, LAB_DIR_RE,
};
