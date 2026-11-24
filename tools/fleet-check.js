#!/usr/bin/env node
/*
 * fleet-check.js — run the network-backed fleet checkers together, weekly.
 *
 * Run: node tools/fleet-check.js
 * Prevents: a whole-fleet failure sitting unnoticed because the checker that would catch it is only run by hand
 * Reads: nine sibling checkers' stdout (fleet/deploy/gate/dispatch/theme-sync, catalog-evidence, catalog-recall, lab-dates, protection-census) and this repo's open issue body
 *
 * These ask GitHub, or the sibling clones, rather than this repository — which is what makes them the group
 * worth scheduling: their answers change without anyone touching this repo. A lab can
 * start serving a stale build, or be published with no card, or have its branch
 * protection altered, on a day nobody commits anything here. Every other checker
 * compares files that only move when someone moves them.
 *
 * FOUR THINGS IT DOES ON PURPOSE
 *
 * Every checker runs, even after one fails. Chaining them would mean the first failure
 * hides the other eight, and the first failure is not the most important one — it is
 * just the one that sorts first.
 *
 * One issue per run, listing every checker that failed. Nine issues a week is how people
 * learn to close them unread, and a checker whose issues get closed unread has stopped
 * being a checker.
 *
 * An open issue is REUSED rather than replaced. The same failure persisting for a month
 * is one fact, not four, and it reads as one: the issue records when it first failed and
 * every run adds how long it has been failing. A new issue each week would reset that
 * count and hide exactly the thing worth seeing.
 *
 * It CLOSES its own issue on a green run, since 2026-11-23 and by owner instruction.
 * This read "it closes nothing" until then, on the argument that "the checker passed
 * once" is not "the problem was dealt with" and deciding that is a person's job. The
 * argument is sound; the cost of acting on it was measured. #235 stood open 33 days and
 * collected 34 weekly "still failing" comments, and the thing it reported was the
 * refusal queue -- a list this repository has declared known-open. An issue nobody can
 * close without a fleet-wide decision is one everybody scrolls past, which is the same
 * failure the one-issue-per-run rule above exists to prevent, arriving from the other
 * end. The distinction survives in the close comment, which says what a green run does
 * and does not establish and that the next failure opens a FRESH issue rather than
 * reopening this one -- so the run-to-run "failing since" continuity is given up
 * deliberately rather than lost quietly. A close that fails leaves the issue open and
 * does not redden the run: the subject here is the fleet, not the issue tracker.
 *
 * Usage (from the repo root):
 *   node tools/fleet-check.js                 run them all, exit 1 if any failed
 *   node tools/fleet-check.js --open-issues   also open or update the one issue
 *                                             (needs the gh CLI and GH_TOKEN)
 *   node tools/fleet-check.js --json          machine-readable
 *   node tools/fleet-check.js --selftest     assert the `requires` precondition both
 *                                            ways, without running any checker
 */
'use strict';
const { execFileSync, spawnSync } = require('child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TITLE = 'Weekly fleet check: one or more checkers failed';
const SINCE = (d) => `<!-- fleet-check:since=${d} -->`;

/* The network-backed group. Each asks GitHub, or the sibling clones, rather than this
   repository. */
const CHECKERS = [
  { name: 'fleet-sync', args: ['tools/fleet-sync.js', 'check'] },
  { name: 'deploy-sync', args: ['tools/deploy-sync.js', 'check'] },
  { name: 'gate-sync', args: ['tools/gate-sync.js', 'check'] },
  { name: 'dispatch-sync', args: ['tools/dispatch-sync.js', 'check'] },
  { name: 'theme-sync', args: ['tools/theme-sync.js', 'check'] },
  /* Not a GitHub question, but the same shape: its answer changes when a LAB
     changes, not when this repo does. Every anchor on a card is a line number in
     a sibling repo, and a line number rots the moment someone edits above it. */
  { name: 'catalog-evidence', args: ['tools/catalog-evidence.js', 'verify'] },
  /* Recall against the hand-built fixture. Weekly rather than per-PR for the same
     reason as the line above — it reads the clones — and it fails only on a DROP,
     so it catches a scanner change that quietly stops finding things. */
  { name: 'catalog-recall', args: ['tools/catalog-recall.js', 'check'] },
  /* Card dates. Same shape again, and the most literally time-dependent of the
     set: a card says when its demo last changed, so the answer is wrong the
     moment a lab lands a commit here and nobody re-runs the writer. */
  { name: 'lab-dates', args: ['tools/lab-dates.js', 'check'] },
  /* Whether the substantive-change rule can SEE each lab's source at all. Reads
     the clones, so it belongs in this list rather than in a per-PR check. It is
     here because a lab that keeps its source where the rule does not look never
     marks its pin stale, so a reviewed judgement keeps applying over changed
     source -- measured on crypto-lab-ratchet-wire on 2026-11-10, and found by
     hand because nothing was asking. */
  { name: 'source-root-census', args: ['tools/source-root-census.js', 'check'] },
  /* Playwright ports. Reads each clone's playwright.config.ts, so it belongs to
     this group and not to a per-PR check -- readme-sync.yml has no clones, and
     from there port-sync sees zero labs and refuses on its own FLEET-UNREAD
     floor. It guards what every mutation check in the fleet rests on: two labs
     on one port can pass a test against the other lab's server. */
  { name: 'port-sync', args: ['tools/port-sync.js', 'check'] },
  /* The sibling chatbot's corpus. It reads ../crypto-counsel, which this job
     clones because the census pins it, and it answers a question nothing else
     here asks: a lab can be live, carded and correct in this repo and still be
     invisible to crypto-counsel, with every checker in both repos green. It was
     checked only by hand until 2026-11-15, and four labs were missing from the
     corpus when it was finally run. */
  { name: 'corpus-sync', args: ['tools/corpus-sync.js', 'check'] },
  /* The same corpus, asked of the two SERVED origins instead of two working
     trees. corpus-sync above compares the corpus to index.html in THIS checkout,
     which is the right question for a pull request and the wrong one for a
     visitor: the catalog and the corpus are two independent Pages deploys, so
     both sides can be stale separately and every file-to-file check stays green
     while the live chatbot answers about a catalog the live site no longer has.
     It is the deploy-sync argument -- "main disagreeing with what is actually
     served never turns anything red" -- applied to the pair. Network-backed, so
     it belongs here and not in the fast loop, and an unreadable origin is UNREAD
     and fails rather than reporting no drift. */
  { name: 'corpus-served', args: ['tools/corpus-served.js', 'check'] },
  /* The served BYTES of every carded lab, against a pinned digest. deploy-sync
     verifies the RUN and says so in its own last line -- "Live bytes require
     separate verification" -- so a lab can be reported current while what a
     visitor receives is something else. A changed digest whose lab's main ALSO
     moved is an ordinary deploy and passes; a digest that moved with main
     standing still is the finding. Network-backed, so it belongs here. */
  { name: 'served-assets', args: ['tools/served-assets.js', 'check'] },
  /* What protects each lab's default branch, asked of BOTH endpoints. It was out of
     this list until 2026-10-20 for a credential reason rather than a design one, and
     the paragraph below records what changed. `requires` is the whole of the new
     machinery: a census with no credential has NOT LOOKED, which is a third state
     from passing and from failing. */
  {
    name: 'protection-census',
    args: ['tools/protection-census.js'],
    requires: {
      env: 'FLEET_READ_TOKEN',
      why: 'a fine-grained PAT with Administration: Read-only across the crypto-lab-* repos',
      fix: 'gh secret set FLEET_READ_TOKEN --repo systemslibrarian/crypto-lab',
    },
  },
];

/* protection-census JOINED that list on 2026-10-20, when the credential it needs was
 * created. What it was waiting for, and why it waited, is worth keeping:
 *
 * `secrets.GITHUB_TOKEN` is scoped to the repository the workflow runs in, so reading
 * branch protection on a sibling repo answers `403 Resource not accessible by
 * integration`. The first scheduled run reported UNREAD for all 204 labs and filed that
 * as a failure: a weekly false alarm, which is how a checker's issues start being closed
 * unread. Muting the 403 inside the census would have been worse than leaving it out —
 * UNREAD exists precisely so "could not look" never reads as "nothing there", and that
 * is the one rule that file is built around.
 *
 * It now reads `secrets.FLEET_READ_TOKEN`, a fine-grained PAT with ONE permission,
 * Administration: Read-only, which is where both branch protection and rulesets live.
 * Verified before scheduling, against all 234 labs: 1 ruleset, 3 classic, 230 none,
 * 0 UNREAD, in 23 seconds.
 *
 * THE FALSE ALARM IS STILL POSSIBLE, in two different shapes, and they are not the same
 * state:
 *
 *   - The secret is ABSENT — never added, or deleted. The census has no credential and
 *     has not looked at anything. That is a configuration gap in THIS repository, not a
 *     finding about 234 labs, so `requires` reports it as NOT RUN, by name, and does not
 *     count it as a failure. Reporting it as 234 UNREAD labs would be the original false
 *     alarm restored, and would describe the wrong subject.
 *   - The secret is PRESENT but no longer works — a fine-grained PAT EXPIRES, and this
 *     one will. Then the census asks, is refused, and reports UNREAD. That is a real
 *     failure and stays loud: the census genuinely could not read those labs, and a
 *     silent pass would be the exact defect the whole file is built against.
 *
 * The distinction is which subject the run is unable to speak about. No credential means
 * it never asked; a dead credential means it asked and was refused. */

/* Findings already decided on, so a known state does not sit in the same list as a
 * surprise. Each names the decision and what would clear it, and NOTHING is muted: the
 * checker still fails, its full excerpt still goes in the issue, and the run still
 * exits non-zero. The only thing an expectation changes is which list a finding is
 * read in.
 *
 * Keyed on the violation MARKER a checker prints, not on the checker. Marking a whole
 * checker "expected" would hide a new failure behind a known one — dispatch-sync is
 * exactly that case: two of its five markers are decided on, and the other three are
 * not. Decisions live in audits/LANE-VERDICT-HARNESS-2026-09-21.md. */
const EXPECTED = {
  /* EMPTY ON PURPOSE, and emptied by the findings clearing rather than by a decision
   * to stop tracking them. Four entries stood here until 2026-10-01:
   *
   *   catalog-evidence STALE-REVIEW  the maintainer re-read the pinned labs; `verify`
   *                                  now reports every pin matching its clone
   *   dispatch-sync    RE-QUERY      D4 — fold-gate's re-query is gone; 0 of 221
   *                                  auto-merges can skip the dispatch in silence
   *   dispatch-sync    UNPINNED-LAB  D12 — the census is re-pinned at 222/221/220
   *   dispatch-sync    COUNT         D12 — same pin
   *
   * A spent decision is worse than no decision. It keeps reading the marker as
   * known, so the NEXT occurrence — a different lab, a new pin going stale, a
   * census that falls behind again — arrives in the accounted-for list instead of
   * the surprising one. That is the muting this file's own comment warns about, one
   * level down: not a whole checker marked expected, but a marker whose reason has
   * expired. Each is restored by re-deciding it, not by remembering it was here.
   */
};

/* Violation markers these checkers print: `NAME (n)` at the head of a section. A
 * checker that fails without printing one cannot be accounted for by a marker, and is
 * reported as unaccounted rather than assumed fine. */
const MARKERS = /^\s*([A-Z][A-Z-]{2,})\s*\((\d+)\)/gm;

function classify(result) {
  const declared = EXPECTED[result.name] || [];
  const seen = [...new Set([...result.full.matchAll(MARKERS)].map((m) => m[1]))];
  const matched = declared.filter((e) => seen.includes(e.marker));
  const unmatched = seen.filter((m) => !declared.some((e) => e.marker === m));
  /* Tracked only when every marker it printed is one we decided on, and it printed at
     least one. Anything else — an undeclared marker, or no marker at all — is a
     surprise until someone says otherwise. */
  const tracked = matched.length > 0 && unmatched.length === 0;
  return { ...result, tracked, matched, unmatched, seen };
}

const argv = process.argv.slice(2);
const today = () => new Date().toISOString().slice(0, 10);

/* An excerpt a reader can act on: the opening lines, where most of these put their
   counts and their verdict, and the closing lines, where the rest name the labs. */
function excerpt(out, head = 10, tail = 10) {
  const lines = out.trim().split('\n');
  if (lines.length <= head + tail) return lines.join('\n');
  return [...lines.slice(0, head), `  … ${lines.length - head - tail} more lines …`, ...lines.slice(-tail)].join('\n');
}

function run(checker) {
  const started = Date.now();
  /* A declared precondition this repository cannot satisfy. Not a pass — nothing was
     checked — and not a failure, because the subject it could not speak about is this
     repo's own configuration rather than any lab. */
  if (checker.requires && !process.env[checker.requires.env]) {
    return {
      name: checker.name,
      command: `node ${checker.args.join(' ')}`,
      code: 0,
      ok: false,
      unrun: checker.requires,
      seconds: 0,
      tail: `NOT RUN — ${checker.requires.env} is not set.\n`
        + `  It needs ${checker.requires.why}.\n`
        + `  Add it with: ${checker.requires.fix}\n`
        + '  Reported as not run rather than as a fleet finding: with no credential this\n'
        + '  census asked nothing, so it has no view on any lab to report.',
      full: '',
    };
  }
  /* A checker that declares a required credential is RUN WITH IT. Everything else in
     this job authenticates as `secrets.GITHUB_TOKEN`, which is scoped to this repository
     and is the right token for reading public sibling data and for filing the issue — and
     is exactly the token that answers 403 for a sibling's branch protection. Injecting it
     here rather than teaching protection-census.js about this secret keeps that file what
     it is: read-only, and unaware of who is asking. */
  const env = checker.requires
    ? { ...process.env, GH_TOKEN: process.env[checker.requires.env], GITHUB_TOKEN: process.env[checker.requires.env] }
    : process.env;
  const r = spawnSync('node', checker.args, { cwd: ROOT, env, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  const out = `${r.stdout || ''}${r.stderr || ''}`;
  return {
    name: checker.name,
    command: `node ${checker.args.join(' ')}`,
    code: r.status === null ? 1 : r.status,
    ok: r.status === 0,
    seconds: Math.round((Date.now() - started) / 1000),
    /* Head AND tail, because these checkers do not agree on where the finding goes:
       deploy-sync and theme-sync name the labs at the end, dispatch-sync opens with
       its counts and ends with a remedy snippet. Taking only the tail quoted that
       remedy into the issue and left the finding out. */
    tail: excerpt(out),
    full: out,
  };
}

function gh(args, opts = {}) {
  return execFileSync('gh', args, { encoding: 'utf8', cwd: ROOT, ...opts });
}

function findOpenIssue() {
  const list = JSON.parse(gh(['issue', 'list', '--state', 'open', '--search', `"${TITLE}" in:title`,
    '--json', 'number,title,body', '--limit', '20']));
  return list.find((i) => i.title === TITLE) || null;
}

function body(failed, firstFailed, runUrl, unrun = []) {
  const days = Math.max(0, Math.round((Date.parse(today()) - Date.parse(firstFailed)) / 86400000));
  const age = firstFailed === today()
    ? 'First failing run.'
    : `Failing since **${firstFailed}** — ${days} day${days === 1 ? '' : 's'}.`;
  const surprises = failed.filter((f) => !f.tracked);
  const tracked = failed.filter((f) => f.tracked);
  const section = (f) => [
    `### \`${f.command}\``,
    '',
    ...(f.matched.length
      ? [`Decided on: ${f.matched.map((e) => `**${e.decision}** (\`${e.marker}\`) — ${e.unblocks}`).join('; ')}`, '']
      : []),
    ...(f.unmatched.length
      ? [`Not accounted for by any decision: ${f.unmatched.map((m) => `\`${m}\``).join(', ')}`, '']
      : []),
    '```',
    f.tail,
    '```',
    '',
  ];
  return [
    SINCE(firstFailed),
    `${failed.length} of ${CHECKERS.length} network-backed checkers failed on the weekly run`
      + (tracked.length ? `, ${tracked.length} of them entirely on findings already decided on` : '')
      + (unrun.length ? `, and ${unrun.length} did not run at all.` : '.'),
    '',
    age,
    '',
    `These ${CHECKERS.length} ask GitHub rather than this repository, so their answers change without anyone committing here.`,
    '',
    ...(surprises.length
      ? ['## Not accounted for', '',
         'Either carrying a violation no decision covers, or failing without printing one this can read.', '',
         ...surprises.flatMap(section)]
      : ['## Not accounted for', '', '_None — every failure below is a state already decided on._', '']),
    ...(tracked.length
      ? ['## Expected and tracked', '',
         'Still failing, still exiting non-zero, and nothing here is muted — only read separately, so a known state does not sit in the same list as a surprise.',
         '', ...tracked.flatMap(section)]
      : []),
    ...(unrun.length
      ? ['## Did not run', '',
         'Neither passing nor failing. Each declares a precondition this repository does not currently'
         + ' satisfy, so it asked nothing and has no view on any lab — listed here rather than counted'
         + ' as coverage, because a checker that never ran must not leave a clean column behind it.', '',
         ...unrun.flatMap((u) => [`### \`${u.command}\``, '', '```', u.tail, '```', '']) ]
      : []),
    runUrl ? `Run: ${runUrl}` : null,
    '',
    '_Updated in place by `tools/fleet-check.js`. It reuses this issue rather than opening a new one each week, so the "failing since" date keeps counting; it never closes one, because a checker passing once is not the same as the problem being dealt with._',
  ].filter((l) => l !== null).join('\n');
}

function report(failed, runUrl, unrun = []) {
  const existing = findOpenIssue();
  /* An unrun checker on its own does not OPEN an issue — a missing secret in this repo
     is not a fleet failure, and a weekly issue about it is how issues start being closed
     unread, which is the thing the census was kept out of this job to avoid. It is
     printed in the run log every week, and once an issue exists for a real failure it is
     listed there too. */
  if (!failed.length) {
    if (!existing) {
      console.log('\nAll checkers passed. No issue to open.');
      return;
    }
    /* CLOSES ITS OWN ISSUE ON A GREEN RUN, changed 2026-11-23 by owner instruction.
     *
     * This used to leave the issue open and say so, on the argument recorded in
     * this file's header: "the checker passed once" is not "the problem was dealt
     * with", and that judgement is a person's. The argument is not wrong, and the
     * cost of acting on it was measured: #235 stood open for 33 days, accumulated
     * 34 weekly "still failing" comments, and the thing it was reporting was the
     * refusal queue -- a known-open list. An issue nobody can close without a
     * fleet-wide decision is one everybody scrolls past, which is the same failure
     * mode from the other end.
     *
     * What is kept is the distinction the old behaviour was protecting. The close
     * comment says what the green run does and does not establish, and the issue
     * is closed as COMPLETED only in the sense that this checker no longer
     * reports it -- the next failure opens a fresh issue with a fresh since-date,
     * which is the one property genuinely lost. That is said out loud in the
     * comment rather than left for someone to notice. */
    const since = /<!-- fleet-check:since=(\d{4}-\d{2}-\d{2}) -->/.exec(existing.body || '');
    const stood = since ? `, open since ${since[1]}` : '';
    const note = `Every checker passed on the ${today()} run${runUrl ? `: ${runUrl}` : ''}.\n\n`
      + `Closing this issue${stood}, because nothing it reports is still failing.\n\n`
      + 'What that does and does not establish: the checkers this job runs ask GitHub and the '
      + 'sibling clones, so a green run says those answers were clean **at the moment it ran**. '
      + 'It is not evidence that an underlying decision was taken — a refusal queue someone '
      + 'cleared by re-pinning, and a refusal queue that happens to be empty this week, read '
      + 'identically here.\n\n'
      + 'The next failure opens a NEW issue with a new "failing since" date rather than '
      + 'reopening this one, so the run-to-run continuity that keeping it open preserved is '
      + 'lost on purpose. If a problem here needs to stay visible across a green week, it '
      + 'wants an issue of its own that this job does not own.';
    try {
      gh(['issue', 'comment', String(existing.number), '--body', note]);
      gh(['issue', 'close', String(existing.number), '--reason', 'completed']);
      console.log(`\nAll checkers passed. Closed issue #${existing.number}${stood}.`);
    } catch (e) {
      /* A close that fails must not turn a green fleet run red: the subject of
         this run is the fleet, not this repository's issue tracker. Reported
         loudly and left open, which is the previous behaviour as the fallback. */
      console.log(`\nAll checkers passed. Issue #${existing.number} could NOT be closed `
        + `(${String(e.message).split('\n')[0]}); it is left open.`);
    }
    return;
  }
  if (existing) {
    const m = /<!-- fleet-check:since=(\d{4}-\d{2}-\d{2}) -->/.exec(existing.body || '');
    const firstFailed = m ? m[1] : today();
    gh(['issue', 'edit', String(existing.number), '--body', body(failed, firstFailed, runUrl, unrun)]);
    gh(['issue', 'comment', String(existing.number), '--body',
      `Still failing on the ${today()} run: ${failed.map((f) => `\`${f.name}\`${f.tracked ? ' (expected)' : ''}`).join(', ')}.`]);
    console.log(`\nUpdated issue #${existing.number} (failing since ${firstFailed}).`);
    return;
  }
  gh(['issue', 'create', '--title', TITLE, '--body', body(failed, today(), runUrl, unrun), '--label', 'bug'],
    { stdio: 'inherit' });
}

/* The control for `requires`. A precondition that fired in both states would be as
   useless as none at all — it would either skip a checker that could have run, or run one
   that cannot work — so both directions are asserted, with a checker that touches no
   network: `node -e ''` exits 0. */
function selftest() {
  const fake = {
    name: 'fake',
    args: ['-e', ''],
    requires: { env: 'FLEET_CHECK_SELFTEST_TOKEN', why: 'a token that does not exist', fix: 'nothing' },
  };
  let failures = 0;
  const assert = (cond, what) => {
    console.log(`  ${cond ? 'ok  ' : 'FAIL'}  ${what}`);
    if (!cond) failures += 1;
  };

  delete process.env.FLEET_CHECK_SELFTEST_TOKEN;
  const absent = run(fake);
  assert(!!absent.unrun, 'with the env absent, the checker is marked unrun');
  assert(absent.ok === false, 'an unrun checker is NOT ok — it must not leave a clean column');
  assert(/NOT RUN/.test(absent.tail), 'its excerpt says NOT RUN by name');
  assert(/a token that does not exist/.test(absent.tail), 'and says what it needs');

  process.env.FLEET_CHECK_SELFTEST_TOKEN = 'the-pat';
  process.env.GH_TOKEN = 'the-ambient-repo-token';
  const present = run(fake);
  assert(!present.unrun, 'with the env present, the checker is NOT skipped');
  assert(present.ok === true, 'and actually ran (node -e "" exits 0)');

  /* The injection is the half that silently does nothing if it is wrong: the census
     would run under the ambient repository token and report 234 UNREAD, which looks
     exactly like a fleet finding. Asserted by having the child print its own GH_TOKEN. */
  const echo = { ...fake, args: ['-e', 'process.stdout.write(String(process.env.GH_TOKEN))'] };
  const injected = run(echo);
  assert(injected.full === 'the-pat', `the child sees the declared credential as GH_TOKEN (saw "${injected.full}")`);
  const plain = run({ name: 'plain', args: echo.args });
  assert(plain.full === 'the-ambient-repo-token',
    `a checker declaring nothing keeps the ambient token (saw "${plain.full}")`);
  delete process.env.FLEET_CHECK_SELFTEST_TOKEN;
  delete process.env.GH_TOKEN;

  /* The three states must stay three through main()'s own filters, which is where
     folding them back into two would actually do the damage. */
  const sample = [{ ok: true }, { ok: false }, { ok: false, unrun: {} }];
  assert(sample.filter((r) => !r.ok && !r.unrun).length === 1, 'failed counts the failure only');
  assert(sample.filter((r) => r.unrun).length === 1, 'unrun counts the skip only');
  assert(sample.filter((r) => r.ok).length === 1, 'passed counts neither of them');

  /* keepFullOutput() swallows its own errors so a write problem can never change a
     verdict, and that is exactly how it hid a missing `require('fs')`: every write
     threw a ReferenceError into the catch, the run stayed green, fleet-check-full/
     was never created, no step summary was written, and the upload step passed with
     `if-no-files-found: warn` and no artifact. The fs import is on main (ee78f74);
     this is the assertion that would have CAUGHT it, ported from the closed branch
     fix/fleet-check-fs-import rather than merging that branch, which is based on a
     2026-11-21 main and would revert ~8,000 lines.

     `root` is injectable for exactly this: the selftest writes into a scratch
     directory instead of the repository, so asserting the files land costs nothing
     and leaves nothing behind. Without the import these three assertions fail. */
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'fleet-check-selftest-'));
  const savedSummary = process.env.GITHUB_STEP_SUMMARY;
  process.env.GITHUB_STEP_SUMMARY = path.join(scratch, 'summary.md');
  const keptFiles = keepFullOutput(
    [{ name: 'kept one', command: 'node kept.js', code: 1, seconds: 0, ok: false, full: 'the whole output' }],
    scratch,
  );
  if (savedSummary === undefined) delete process.env.GITHUB_STEP_SUMMARY;
  else process.env.GITHUB_STEP_SUMMARY = savedSummary;
  const keptFile = path.join(scratch, 'fleet-check-full', 'kept-one.txt');
  assert(keptFiles.length === 1 && fs.existsSync(keptFile), 'keepFullOutput writes one file per checker');
  assert(fs.existsSync(keptFile) && /the whole output/.test(fs.readFileSync(keptFile, 'utf8')),
    'and the file holds the full output, not the excerpt');
  const summaryFile = path.join(scratch, 'summary.md');
  assert(fs.existsSync(summaryFile) && /the whole output/.test(fs.readFileSync(summaryFile, 'utf8')),
    'and the step summary carries it too');
  fs.rmSync(scratch, { recursive: true, force: true });

  /* And the real entry declares one, or this whole mechanism is dead code. */
  const census = CHECKERS.find((c) => c.name === 'protection-census');
  assert(!!census, 'protection-census is in CHECKERS');
  assert(!!(census && census.requires && census.requires.env), 'and declares the env it requires');

  /* THE CLOSE PATH, both directions. A green run must close the open issue and a
     failing run must not, and asserting only the first would pass for a version
     that closed the issue on every run -- which would be worse than never
     closing it, because it would close the issue reporting the failure. `gh` is
     stubbed so the selftest files nothing. */
  const calls = [];
  const realGh = gh;
  // eslint-disable-next-line no-func-assign
  gh = (args) => { calls.push(args.join(' ')); return ''; };
  const realFind = findOpenIssue;
  // eslint-disable-next-line no-func-assign
  findOpenIssue = () => ({ number: 999, body: '<!-- fleet-check:since=2026-01-01 -->' });
  try {
    report([], 'https://example/run/1', []);
    const closedOnGreen = calls.some((c) => c.startsWith('issue close 999'));
    const commentedOnGreen = calls.some((c) => c.startsWith('issue comment 999'));
    assert(closedOnGreen, 'a green run closes the open issue');
    assert(commentedOnGreen, 'and says in a comment what the green run does not establish');

    calls.length = 0;
    report([{
      name: 'fake', command: 'node -e ""', code: 1, seconds: 0, full: 'x',
      tracked: false, matched: [], unmatched: [], excerpt: 'x',
    }], 'https://example/run/2', []);
    assert(!calls.some((c) => c.startsWith('issue close')),
      'a FAILING run must never close the issue — the control without which closing always would pass');
    assert(calls.some((c) => c.startsWith('issue edit 999')), 'a failing run updates it instead');
  } finally {
    // eslint-disable-next-line no-func-assign
    gh = realGh;
    // eslint-disable-next-line no-func-assign
    findOpenIssue = realFind;
  }

  console.log(`\n  ${failures ? `${failures} failed` : 'all checks passed'}.`);
  process.exit(failures ? 1 : 0);
}

/* The excerpt is for the ISSUE BODY, which a person reads. It is not a record.
 * On 2026-11-20 a 91-lab STALE-REVIEW list could not be recovered at all: the
 * run log, the issue and the API all carried `… 218 more lines …` and nothing
 * else, because excerpt() ran before any of them and the full text was never
 * written anywhere. There were no artifacts and no step summary either, so the
 * names simply did not exist any more.
 *
 * So the full output is now kept twice, and neither changes a verdict:
 *   - $GITHUB_STEP_SUMMARY, where a reader lands from the run page;
 *   - fleet-check-full/<checker>.txt, for the workflow to upload as an artifact.
 * excerpt() is untouched and still the only thing that reaches the issue. */
function keepFullOutput(results, root = ROOT) {
  const dir = path.join(root, 'fleet-check-full');
  const written = [];
  try {
    fs.mkdirSync(dir, { recursive: true });
    for (const r of results) {
      const file = path.join(dir, `${r.name.replace(/[^a-zA-Z0-9._-]/g, '-')}.txt`);
      fs.writeFileSync(file, `$ ${r.command}\nexit ${r.code}  ${r.seconds}s\n\n${r.full || ''}`);
      written.push(file);
    }
  } catch (e) {
    console.error(`could not keep full output: ${String(e.message).split('\n')[0]}`);
  }
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (summary) {
    try {
      const parts = ['## Weekly fleet check — full checker output\n',
        '_The issue body carries an excerpt; this is the whole thing, so a list like',
        'STALE-REVIEW can be recovered later._\n'];
      for (const r of results) {
        const state = r.ok ? 'PASS' : r.unrun ? 'NOT RUN' : `FAIL (exit ${r.code})`;
        parts.push(`<details><summary>${state} — <code>${r.command}</code></summary>\n`);
        parts.push('\n```text\n' + (r.full || '(no output)').replace(/```/g, '`\u200b``') + '\n```\n');
        parts.push('</details>\n');
      }
      fs.appendFileSync(summary, parts.join('\n'));
    } catch (e) {
      console.error(`could not write the step summary: ${String(e.message).split('\n')[0]}`);
    }
  }
  return written;
}

function main() {
  if (argv.includes('--selftest')) return selftest();
  const results = CHECKERS.map(run).map(classify); // every one, regardless of earlier failures
  /* Three states, not two. `unrun` is neither: it did not pass, so it must not be
     counted as coverage, and it did not fail, because it has no view on any lab to
     fail about. Folding it into either one publishes something untrue — a clean
     column for a census that never ran, or a fleet finding about this repo's
     configuration. */
  const unrun = results.filter((r) => r.unrun);
  const failed = results.filter((r) => !r.ok && !r.unrun);
  /* Before any exit path: a run that fails is exactly the run whose full output
     someone will want, and every exit below is non-zero when anything failed. */
  const kept = keepFullOutput(results);

  if (argv.includes('--json')) {
    console.log(JSON.stringify({ date: today(), results }, null, 2));
  } else {
    console.log(`Weekly fleet check — ${CHECKERS.length} network-backed checkers, all run regardless of failures.\n`);
    for (const r of results) {
      const note = r.ok ? '' : r.tracked ? `  (expected: ${[...new Set(r.matched.map((e) => e.decision))].join(', ')})` : '';
      const state = r.ok ? 'PASS' : r.unrun ? 'SKIP' : 'FAIL';
      console.log(`  ${state.padEnd(5)} ${r.name.padEnd(20)} ${String(r.seconds).padStart(3)}s  ${r.command}${note}`);
    }
    console.log(`\n  ${results.filter((r) => r.ok).length} passed, ${failed.length} failed`
      + (unrun.length ? `, ${unrun.length} NOT RUN.` : '.'));
    for (const u of unrun) {
      console.log(`\n--- ${u.command} ---\n${u.tail}`);
    }
    for (const f of failed) {
      console.log(`\n--- ${f.command} (exit ${f.code}) ---\n${f.tail}`);
    }
    if (kept.length) {
      console.log(`\nFull output of all ${kept.length} checkers kept in fleet-check-full/`
        + (process.env.GITHUB_STEP_SUMMARY ? ' and in the run\'s step summary.' : '.'));
    }
  }

  if (argv.includes('--open-issues')) {
    const runUrl = process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : '';
    try {
      report(failed, runUrl, unrun);
    } catch (e) {
      console.error(`could not open or update the issue: ${String(e.message).split('\n')[0]}`);
      process.exit(failed.length ? 1 : 2);
    }
  }
  process.exit(failed.length ? 1 : 0);
}

main();
