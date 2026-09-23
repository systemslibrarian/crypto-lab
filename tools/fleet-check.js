#!/usr/bin/env node
/*
 * fleet-check.js — run the network-backed fleet checkers together, weekly.
 *
 * Run: node tools/fleet-check.js
 * Prevents: a whole-fleet failure sitting unnoticed because the checker that would catch it is only run by hand
 *
 * These six ask GitHub rather than this repository, which is what makes them the group
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
  { name: 'protection-census', args: ['tools/protection-census.js'] },
];

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
  return [
    SINCE(firstFailed),
    `${failed.length} of ${CHECKERS.length} network-backed checkers failed on the weekly run.`,
    '',
    age,
    '',
    'These six ask GitHub rather than this repository, so their answers change without anyone committing here.',
    '',
    ...failed.flatMap((f) => [
      `### \`${f.command}\``,
      '',
      '```',
      f.tail,
      '```',
      '',
    ]),
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
      `Still failing on the ${today()} run: ${failed.map((f) => `\`${f.name}\``).join(', ')}.`]);
    console.log(`\nUpdated issue #${existing.number} (failing since ${firstFailed}).`);
    return;
  }
  gh(['issue', 'create', '--title', TITLE, '--body', body(failed, today(), runUrl), '--label', 'bug'],
    { stdio: 'inherit' });
}

function main() {
  const results = CHECKERS.map(run); // every one, regardless of earlier failures
  const failed = results.filter((r) => !r.ok);

  if (argv.includes('--json')) {
    console.log(JSON.stringify({ date: today(), results }, null, 2));
  } else {
    console.log(`Weekly fleet check — ${CHECKERS.length} network-backed checkers, all run regardless of failures.\n`);
    for (const r of results) {
      console.log(`  ${(r.ok ? 'PASS' : 'FAIL').padEnd(5)} ${r.name.padEnd(20)} ${String(r.seconds).padStart(3)}s  ${r.command}`);
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
