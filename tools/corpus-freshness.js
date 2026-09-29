#!/usr/bin/env node
/*
 * corpus-freshness.js — has each corpus entry's prose been checked against the lab it describes?
 *
 * Run: node tools/corpus-freshness.js
 * Prevents: a corpus entry going on describing a lab that has since changed underneath it, with every other checker green
 * Reads: corpus.json from $CRYPTO_COUNSEL_CORPUS, ../crypto-counsel-1/ or ../crypto-counsel/; and git log in each ../crypto-lab-<slug> clone
 *
 * corpus-sync answers WHICH demos have entries. It cannot answer whether an
 * entry still describes its demo, and the two are different failures. On
 * 2026-09-29 crypto-lab-export-grade gained two exhibits at b61f133 while its
 * corpus entry went on describing four panes — carded, entried, and completely
 * misdescribed, with corpus-sync green throughout. That is the gap this fills.
 *
 * It compares each entry's `reviewed.lab_commit` (see crypto-counsel's
 * scripts/validate.mjs, which requires the field) against that lab's current
 * HEAD, and reports FOUR states, never folded into each other:
 *
 *   CURRENT             nothing substantive has landed since the review
 *   STALE               the lab has moved in a way a reader would ask about
 *   NEVER-REVIEWED      reviewed is null — the prose has never been checked
 *   UNPUBLISHED-REVIEW  the reviewed commit is not in origin/main's history
 *   UNREADABLE          no clone, or git refused — "could not look", never "nothing there"
 *
 * UNREADABLE is its own state for the reason protection-census keeps one: a
 * missing clone must never read as a clean bill of health, and folding it into
 * CURRENT is how a checker starts lying quietly.
 *
 * UNPUBLISHED-REVIEW is its own state for a related reason, and it is the one
 * failure here that is about the RECORD rather than the lab. A reviewed commit
 * that is not in origin/main's history is not a baseline: the prose was written
 * from a build nobody else can reach. On 2026-09-29 eight entries were pinned
 * that way — the clones sat on a lane's local `verdict-harness` branch — and one
 * of them, privacy-pass, described a client-roster control that exists on no
 * published branch. The check then reported all eight STALE, which was true and
 * for the wrong reason, and a reader following that report would have re-read
 * eight labs to fix one bad sha. It fails loudly rather than being accepted,
 * because "the commit I read" and "the commit anyone else can read" are
 * different facts and only the second is a baseline for prose about a live site.
 *
 * SUBSTANTIVE CHANGE is defined here, deliberately and narrowly: a commit that
 * touches the lab's README.md or anything under src/. Those are the surfaces the
 * corpus prose is written from. Everything else — workflow edits, dependency
 * bumps, e2e and config churn — is excluded, because this fleet runs grouped
 * Dependabot across 208 labs and a rule counting every commit would flag nearly
 * everything within a week. A check that always fires is one nobody reads. That
 * scope is a judgement and is written down here so the next reader can argue
 * with it rather than reverse-engineer it from the output.
 *
 * REPORT-ONLY, on purpose, for now. 199 of 209 entries have never been reviewed,
 * and failing on that would redden CI over a backlog nobody created today rather
 * than over a regression. It exits 0 whatever it finds. Turning it into a gate
 * is a maintainer's call once NEVER-REVIEWED is down to a number worth defending
 * — and the honest order is to shrink that first and gate afterwards, not to
 * gate and then discover the backlog.
 *
 * Usage (from the crypto-lab repo root):
 *   node tools/corpus-freshness.js            Report; exit 0 always.
 *   node tools/corpus-freshness.js --stale    Only the STALE rows, with what moved.
 *   node tools/corpus-freshness.js --fetch    Refresh each clone's origin/main first (slow, accurate).
 *   node tools/corpus-freshness.js selftest   Offline: the classifier against fixtures.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const SIBLINGS = path.join(REPO_ROOT, '..');

function findCorpus(explicit) {
  const candidates = [
    explicit,
    process.env.CRYPTO_COUNSEL_CORPUS,
    path.join(SIBLINGS, 'crypto-counsel-1', 'corpus.json'),
    path.join(SIBLINGS, 'crypto-counsel', 'corpus.json'),
  ].filter(Boolean);
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return null;
}

/* Pure, so selftest can drive every branch with no clone and no network.
 * `changed` is the list of paths touched since the reviewed commit, or null
 * when git could not be asked at all. */
function classify(reviewed, changed, isAncestor) {
  if (reviewed === null || reviewed === undefined) return { state: 'NEVER-REVIEWED' };
  if (changed === null) return { state: 'UNREADABLE' };
  // A reviewed commit that is not in origin/main's history is not a baseline at
  // all. It happened on 2026-09-29: eight entries were pinned to commits on a
  // lane's local `verdict-harness` branch, so the check compared a published
  // branch against a private one and called the entries stale for the wrong
  // reason. One of the eight, privacy-pass, described a control that is not
  // published anywhere — prose written from a build no visitor can reach.
  //
  // It is its own state rather than an UNREADABLE or a STALE, because it is a
  // different fact with a different fix: not "the lab moved" and not "I could
  // not look", but "this review was never of the published lab". Folding it into
  // either would let the sha stay wrong while the row looked explicable.
  if (isAncestor === false) return { state: 'UNPUBLISHED-REVIEW' };
  if (isAncestor === null) return { state: 'UNREADABLE' };
  const substantive = changed.filter((f) => f === 'README.md' || f.startsWith('src/'));
  if (!substantive.length) return { state: 'CURRENT', skipped: changed.length };
  return { state: 'STALE', files: substantive };
}

/* Compare against origin/main, NOT the local HEAD.
 *
 * The first version of this diffed `sha..HEAD` and reported 0 stale out of 209,
 * which was false: the ten reviewed entries were pinned to the local clones'
 * HEADs, so every diff was empty by construction while eight of those ten labs
 * had already moved on origin. A local clone nobody pulled would have made the
 * whole fleet read CURRENT — the same "could not look, so nothing there" defect
 * UNREADABLE exists to prevent, arriving through the ref rather than the error.
 *
 * It does NOT fetch by default: 209 fetches is a slow tool, and slow tools go
 * unrun. So it reports how stale its own view is, and --fetch refreshes first.
 * A clone with no origin/main is UNREADABLE rather than silently falling back to
 * HEAD, because that fallback is the bug above. */
function refFor(dir) {
  try {
    execFileSync('git', ['-C', dir, 'rev-parse', '--verify', 'origin/main'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return 'origin/main';
  } catch {
    return null;
  }
}

/* Is the reviewed commit actually in origin/main's history?
 *
 * `git merge-base --is-ancestor A B` exits 0 when A is an ancestor of B, 1 when
 * it is not, and something else when it cannot tell — an unknown sha, a shallow
 * clone, not a repository. The three answers are kept apart: true, false, and
 * null for "could not tell", because collapsing the third into either direction
 * is how a checker starts asserting things it did not establish. */
function isAncestorOf(dir, sha, ref) {
  const r = require('child_process').spawnSync('git',
    ['-C', dir, 'merge-base', '--is-ancestor', sha, ref], { stdio: 'ignore' });
  if (r.error || r.status === null) return null;
  if (r.status === 0) return true;
  if (r.status === 1) return false;
  return null; // 128 and friends: could not tell
}

function changedSince(dir, sha, fetch) {
  const ref = refFor(dir);
  if (!ref) return null;
  if (fetch) {
    try { execFileSync('git', ['-C', dir, 'fetch', '-q', 'origin'], { stdio: 'ignore' }); } catch { /* report on what we have */ }
  }
  try {
    const out = execFileSync('git', ['-C', dir, 'diff', '--name-only', `${sha}..${ref}`],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return out.split('\n').filter(Boolean);
  } catch {
    return null; // unknown sha, not a repo, shallow clone — all "could not look"
  }
}

function selftest() {
  const fixtures = [
    { why: 'never reviewed is its own state, not a stale one',
      reviewed: null, changed: [], expect: 'NEVER-REVIEWED' },
    { why: 'git could not be asked; must never read as current',
      reviewed: { lab_commit: 'a'.repeat(40), date: '2026-09-29' }, changed: null, expect: 'UNREADABLE' },
    { why: 'nothing has landed at all since the review',
      reviewed: { lab_commit: 'a'.repeat(40), date: '2026-09-29' }, changed: [], expect: 'CURRENT' },
    { why: 'a grouped Dependabot bump is not a reason to re-read the prose',
      reviewed: { lab_commit: 'a'.repeat(40), date: '2026-09-29' },
      changed: ['package.json', 'package-lock.json', '.github/workflows/deploy.yml'], expect: 'CURRENT' },
    { why: 'e2e and config churn does not change what the page says',
      reviewed: { lab_commit: 'a'.repeat(40), date: '2026-09-29' },
      changed: ['e2e/gate.ts', 'playwright.config.ts'], expect: 'CURRENT' },
    { why: 'a README rewrite is exactly what the prose was written from',
      reviewed: { lab_commit: 'a'.repeat(40), date: '2026-09-29' },
      changed: ['README.md'], expect: 'STALE' },
    { why: 'export-grade: two exhibits added under src/ while the entry described four panes',
      reviewed: { lab_commit: 'a'.repeat(40), date: '2026-09-29' },
      changed: ['src/ui/panes.ts', 'src/data/attacks.ts'], expect: 'STALE' },
    { why: 'one substantive file among noise still counts',
      reviewed: { lab_commit: 'a'.repeat(40), date: '2026-09-29' },
      changed: ['package-lock.json', 'src/main.ts'], expect: 'STALE' },
    { why: 'reviewed at a commit outside origin/main: the record is wrong, not the lab',
      reviewed: { lab_commit: 'a'.repeat(40), date: '2026-09-29' },
      changed: ['README.md'], ancestor: false, expect: 'UNPUBLISHED-REVIEW' },
    { why: 'an unpublished review outranks STALE — fix the sha before re-reading the lab',
      reviewed: { lab_commit: 'a'.repeat(40), date: '2026-09-29' },
      changed: ['README.md', 'src/main.ts'], ancestor: false, expect: 'UNPUBLISHED-REVIEW' },
    { why: 'ancestry could not be determined; must not be read as published',
      reviewed: { lab_commit: 'a'.repeat(40), date: '2026-09-29' },
      changed: [], ancestor: null, expect: 'UNREADABLE' },
  ];
  const fail = [];
  let pass = 0;

  /* The classifier fixtures above drive the decision with a boolean. This one
   * drives the PROBE, against a real repository built here and thrown away:
   * a commit on `main`, then a commit on a side branch that main never sees.
   * That is exactly the shape that produced the 2026-09-29 mispinning, and a
   * boolean fixture cannot catch a probe that reads git wrongly. */
  {
    const os = require('os');
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-ancestry-'));
    const git = (...a) => require('child_process').execFileSync('git', ['-C', tmp, ...a],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    try {
      git('init', '-q', '-b', 'main');
      git('config', 'user.email', 'selftest@example.invalid');
      git('config', 'user.name', 'selftest');
      fs.writeFileSync(path.join(tmp, 'README.md'), 'base\n');
      git('add', 'README.md'); git('commit', '-qm', 'base');
      const onMain = git('rev-parse', 'HEAD');
      // A local branch whose commit main will never contain.
      git('checkout', '-q', '-b', 'side');
      fs.writeFileSync(path.join(tmp, 'README.md'), 'side only\n');
      git('add', 'README.md'); git('commit', '-qm', 'side only');
      const onSideOnly = git('rev-parse', 'HEAD');
      git('checkout', '-q', 'main');

      const cases = [
        ['a commit on main is an ancestor of main', onMain, 'main', true],
        ['a commit only on a side branch is NOT an ancestor of main', onSideOnly, 'main', false],
        ['an unknown sha is "could not tell", not "not an ancestor"', 'b'.repeat(40), 'main', null],
      ];
      for (const [why, sha, ref, want] of cases) {
        const got = isAncestorOf(tmp, sha, ref);
        if (got !== want) fail.push(`probe: expected ${want}, got ${got} — ${why}`);
        else { pass++; console.log(`  ok  ${String(want).padEnd(14)} ${why}`); }
      }
    } catch (e) {
      fail.push(`probe fixture could not be built: ${e.message}`);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  }

  for (const f of fixtures) {
    const got = classify(f.reviewed, f.changed, 'ancestor' in f ? f.ancestor : true).state;
    if (got !== f.expect) fail.push(`expected ${f.expect}, got ${got} — ${f.why}`);
    else { pass++; console.log(`  ok  ${f.expect.padEnd(14)} ${f.why}`); }
  }
  // Every state the reporter can print must be reachable from a fixture.
  for (const state of ['CURRENT', 'STALE', 'NEVER-REVIEWED', 'UNPUBLISHED-REVIEW', 'UNREADABLE']) {
    if (!fixtures.some((f) => f.expect === state)) fail.push(`no fixture covers ${state}`);
  }
  console.log(fail.length ? `\n${pass} passed, ${fail.length} FAILED` : `\n${pass} passed, 0 failed`);
  for (const m of fail) console.log(`  FAIL  ${m}`);
  return fail.length ? 1 : 0;
}

function main() {
  if (process.argv[2] === 'selftest') process.exit(selftest());
  const staleOnly = process.argv.includes('--stale');
  const doFetch = process.argv.includes('--fetch');

  const corpusPath = findCorpus(null);
  if (!corpusPath) {
    console.log('No corpus.json found. Set CRYPTO_COUNSEL_CORPUS or clone crypto-counsel beside this repo.');
    return 0;
  }
  const corpus = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));
  const demos = corpus.filter((e) => typeof e.id === 'string' && e.id.startsWith('demo_'));

  const rows = demos.map((e) => {
    const slug = e.id.replace(/^demo_(?:crypto_lab_)?/, '').replace(/_/g, '-');
    const dir = path.join(SIBLINGS, `crypto-lab-${slug}`);
    let changed = null;
    let ancestor = null;
    if (e.reviewed && fs.existsSync(dir)) {
      changed = changedSince(dir, e.reviewed.lab_commit, doFetch);
      if (changed !== null) ancestor = isAncestorOf(dir, e.reviewed.lab_commit, 'origin/main');
    }
    return { slug, reviewed: e.reviewed, ...classify(e.reviewed, changed, ancestor) };
  });

  const by = (s) => rows.filter((r) => r.state === s);
  const stale = by('STALE');

  console.log(`Corpus: ${corpusPath}`);
  console.log(`Demo entries: ${rows.length} | current ${by('CURRENT').length} | stale ${stale.length} | ` +
    `never reviewed ${by('NEVER-REVIEWED').length} | unpublished ${by('UNPUBLISHED-REVIEW').length} | ` +
    `unreadable ${by('UNREADABLE').length}`);

  if (stale.length) {
    console.log(`\nSTALE (${stale.length}) — the lab moved under the entry; re-read it and re-pin reviewed:`);
    for (const r of stale) {
      console.log(`  ${r.slug}  reviewed at ${r.reviewed.lab_commit.slice(0, 8)} (${r.reviewed.date})`);
      console.log(`      since then: ${r.files.slice(0, 4).join(', ')}${r.files.length > 4 ? ` (+${r.files.length - 4} more)` : ''}`);
    }
  }
  if (staleOnly) return 0;

  const unpublished = by('UNPUBLISHED-REVIEW');
  if (unpublished.length) {
    console.log(`\nUNPUBLISHED-REVIEW (${unpublished.length}) — reviewed at a commit that is NOT in`);
    console.log('origin/main\'s history, so the prose was written from a build no visitor can reach.');
    console.log('Re-read the lab at origin/main and re-pin; do not just move the sha:');
    for (const r of unpublished) {
      console.log(`  ${r.slug}  reviewed at ${r.reviewed.lab_commit.slice(0, 8)} (${r.reviewed.date}) — not an ancestor of origin/main`);
    }
  }

  const unreadable = by('UNREADABLE');
  if (unreadable.length) {
    console.log(`\nUNREADABLE (${unreadable.length}) — could not look, which is not the same as nothing there:`);
    for (const r of unreadable) console.log(`  ${r.slug}`);
  }
  const never = by('NEVER-REVIEWED');
  if (never.length) {
    console.log(`\nNEVER-REVIEWED (${never.length}) — prose never checked against the lab. Not a regression:`);
    console.log('  a backlog, recorded rather than back-dated. Re-read one, then pin reviewed in corpus.json.');
  }
  if (!stale.length && !unreadable.length && !never.length && !unpublished.length) {
    console.log('\nEvery corpus entry has been checked against its lab since that lab last changed.');
  }
  console.log(`\nCompared against origin/main in each clone${doFetch ? ' (fetched just now)' : ', WITHOUT fetching'}.`);
  if (!doFetch) console.log('Re-run with --fetch for an answer that does not depend on when you last pulled.');
  console.log('Report-only: this exits 0 whatever it finds. See the header for why, and for what');
  console.log('"substantive change" is scoped to.');
  return 0;
}

process.exit(main());
