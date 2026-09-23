#!/usr/bin/env node
/*
 * fleet-check.js — run the network-backed fleet checkers together, weekly.
 *
 * Run: node tools/fleet-check.js
 * Prevents: a whole-fleet failure sitting unnoticed because the checker that would catch it is only run by hand
 *
 * These five ask GitHub rather than this repository, which is what makes them the group
 * worth scheduling: their answers change without anyone touching this repo. A lab can
 * start serving a stale build, or be published with no card, or have its branch
 * protection altered, on a day nobody commits anything here. Every other checker
 * compares files that only move when someone moves them.
 *
 * FOUR THINGS IT DOES ON PURPOSE
 *
 * Every checker runs, even after one fails. Chaining them would mean the first failure
 * hides the other five, and the first failure is not the most important one — it is
 * just the one that sorts first.
 *
 * One issue per run, listing every checker that failed. Six issues a week is how people
 * learn to close them unread, and a checker whose issues get closed unread has stopped
 * being a checker.
 *
 * An open issue is REUSED rather than replaced. The same failure persisting for a month
 * is one fact, not four, and it reads as one: the issue records when it first failed and
 * every run adds how long it has been failing. A new issue each week would reset that
 * count and hide exactly the thing worth seeing.
 *
 * It closes nothing. A run where everything passes says so in the log and leaves any
 * open issue alone, because "the checker passed once" is not the same as "the problem
 * was dealt with", and deciding that is a person's job.
 *
 * Usage (from the repo root):
 *   node tools/fleet-check.js                 run all six, exit 1 if any failed
 *   node tools/fleet-check.js --open-issues   also open or update the one issue
 *                                             (needs the gh CLI and GH_TOKEN)
 *   node tools/fleet-check.js --json          machine-readable
 */
'use strict';
const { execFileSync, spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TITLE = 'Weekly fleet check: one or more checkers failed';
const SINCE = (d) => `<!-- fleet-check:since=${d} -->`;

/* The network-backed group. Each asks GitHub, not this repository. */
const CHECKERS = [
  { name: 'fleet-sync', args: ['tools/fleet-sync.js', 'check'] },
  { name: 'deploy-sync', args: ['tools/deploy-sync.js', 'check'] },
  { name: 'gate-sync', args: ['tools/gate-sync.js', 'check'] },
  { name: 'dispatch-sync', args: ['tools/dispatch-sync.js', 'check'] },
  { name: 'theme-sync', args: ['tools/theme-sync.js', 'check'] },
];

/* protection-census is NOT in that list, and the reason is worth keeping.
 *
 * It belongs there by every other measure — it asks GitHub, its answer changes without
 * anyone committing here, and it is how a branch protection change gets noticed. But
 * `secrets.GITHUB_TOKEN` is scoped to the repository the workflow runs in, so reading
 * branch protection on a sibling repo answers `403 Resource not accessible by
 * integration`. The first scheduled run reported UNREAD for all 204 labs and filed that
 * as a failure: a weekly false alarm, which is how a checker's issues start being closed
 * unread.
 *
 * Adding it back needs a PAT with read access to the other repositories, not a change
 * here. Until then it stays manual, the table says manual, and nothing claims a coverage
 * this job cannot establish. Muting the 403 inside the census would have been worse than
 * leaving it out: UNREAD exists precisely so "could not look" never reads as "nothing
 * there", and that is the one rule that file is built around. */

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
  'dispatch-sync': [
    {
      marker: 'RE-QUERY',
      decision: 'D4',
      unblocks: 'fold-gate\'s RE-QUERY gets its own small PR once #11 merges — deliberately not folded in, so the PR that merges stays the PR that was audited',
    },
    {
      marker: 'UNPINNED-LAB',
      decision: 'D12',
      unblocks: 'the census is deliberately unpinned: re-pin with `node tools/dispatch-census.js write` once the six new labs have their initial commits and the lane building them reports done',
    },
    {
      marker: 'COUNT',
      decision: 'D12',
      unblocks: 'same pin as UNPINNED-LAB — a pin taken over a half-built fleet is a figure inherited from a moment rather than derived from a state',
    },
  ],
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
  const r = spawnSync('node', checker.args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
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

function body(failed, firstFailed, runUrl) {
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
      + (tracked.length ? `, ${tracked.length} of them entirely on findings already decided on.` : '.'),
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
    runUrl ? `Run: ${runUrl}` : null,
    '',
    '_Updated in place by `tools/fleet-check.js`. It reuses this issue rather than opening a new one each week, so the "failing since" date keeps counting; it never closes one, because a checker passing once is not the same as the problem being dealt with._',
  ].filter((l) => l !== null).join('\n');
}

function report(failed, runUrl) {
  const existing = findOpenIssue();
  if (!failed.length) {
    console.log(existing
      ? `\nAll checkers passed. Issue #${existing.number} is left open — closing it is a person's decision.`
      : '\nAll checkers passed. No issue to open.');
    return;
  }
  if (existing) {
    const m = /<!-- fleet-check:since=(\d{4}-\d{2}-\d{2}) -->/.exec(existing.body || '');
    const firstFailed = m ? m[1] : today();
    gh(['issue', 'edit', String(existing.number), '--body', body(failed, firstFailed, runUrl)]);
    gh(['issue', 'comment', String(existing.number), '--body',
      `Still failing on the ${today()} run: ${failed.map((f) => `\`${f.name}\`${f.tracked ? ' (expected)' : ''}`).join(', ')}.`]);
    console.log(`\nUpdated issue #${existing.number} (failing since ${firstFailed}).`);
    return;
  }
  gh(['issue', 'create', '--title', TITLE, '--body', body(failed, today(), runUrl), '--label', 'bug'],
    { stdio: 'inherit' });
}

function main() {
  const results = CHECKERS.map(run).map(classify); // every one, regardless of earlier failures
  const failed = results.filter((r) => !r.ok);

  if (argv.includes('--json')) {
    console.log(JSON.stringify({ date: today(), results }, null, 2));
  } else {
    console.log(`Weekly fleet check — ${CHECKERS.length} network-backed checkers, all run regardless of failures.\n`);
    for (const r of results) {
      const note = r.ok ? '' : r.tracked ? `  (expected: ${[...new Set(r.matched.map((e) => e.decision))].join(', ')})` : '';
      console.log(`  ${(r.ok ? 'PASS' : 'FAIL').padEnd(5)} ${r.name.padEnd(20)} ${String(r.seconds).padStart(3)}s  ${r.command}${note}`);
    }
    console.log(`\n  ${results.filter((r) => r.ok).length} passed, ${failed.length} failed.`);
    for (const f of failed) {
      console.log(`\n--- ${f.command} (exit ${f.code}) ---\n${f.tail}`);
    }
  }

  if (argv.includes('--open-issues')) {
    const runUrl = process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : '';
    try {
      report(failed, runUrl);
    } catch (e) {
      console.error(`could not open or update the issue: ${String(e.message).split('\n')[0]}`);
      process.exit(failed.length ? 1 : 2);
    }
  }
  process.exit(failed.length ? 1 : 0);
}

main();
