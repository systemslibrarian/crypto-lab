#!/usr/bin/env node
/*
 * dispatch-census.js — pin WHICH labs the dispatch checkers judge, and refuse to
 * lose one in silence.
 *
 * ---------------------------------------------------------------------------
 * The defect this closes
 *
 * dispatch-sync and dispatch-comment-sync both DISCOVER their own denominator:
 * they walk ../crypto-lab-*, find the Dependabot auto-merge job by what it
 * contains, and report on what they found. Every number they print is therefore
 * a count of labs they managed to recognise — never a count of labs that exist.
 * A lab that stops being recognisable does not fail: it leaves the report, the
 * total quietly decrements, and the run exits 0.
 *
 * Three ways in, all found by an adversarial audit on 2026-09-10 and all three
 * kept as permanent mutations in tools/dispatch-mutations.js:
 *
 *   a. the auto-merge merges with `gh api -X PUT repos/.../merge` instead of
 *      `gh pr merge`. isAutoMergeJob() hard-requires the literal `gh pr merge`,
 *      so the job is not an auto-merge job any more and the lab is simply not
 *      in the report.
 *   b. the workflow's job map is indented four spaces. Valid YAML, jobs intact,
 *      GitHub runs it — but jobBlocks() requires `^  <key>:` at exactly two
 *      spaces, so the file parses to zero jobs and the lab drops out.
 *   c. the `gh workflow run` line is deleted while the rationale paragraph that
 *      defends it stays. dispatch-comment-sync counts SITES, and a site is a
 *      rationale block ABOVE A DISPATCH; with the dispatch gone there is no
 *      site, so the count goes 195 -> 194 and exits 0.
 *
 * This is the third instance of one defect in this fleet — a checker that cannot
 * see, reporting clean. gate-sync missed `peaceiris` publishers; gate-sync never
 * opened uncloned labs; now this. The shared shape is that the denominator is
 * discovered rather than declared.
 *
 * ---------------------------------------------------------------------------
 * What this file does instead
 *
 * dispatch-census.json DECLARES the denominator: every lab, and what each one
 * owes — an auto-merge job, a dispatch site, or neither. The census is generated
 * (`write`) and checked (`check`), like every other derived file in this repo.
 * A lab that stops matching its pinned row is a NAMED failure:
 *
 *   MISSING-JOB        pinned to run an auto-merge job; none was recognised
 *   MISSING-SITE       pinned to carry a dispatch site; none was found
 *   UNEXPECTED-JOB     an auto-merge job appeared where none is pinned
 *   UNEXPECTED-SITE    a dispatch site appeared where none is pinned
 *   UNPINNED-LAB       cloned here, absent from the census
 *   NOT-CLONED         in the census, not cloned here — so nothing judges it
 *   COUNT              a pinned total disagrees with what was observed
 *   UNRECOGNISED       the lab holds a Dependabot merge this checker cannot
 *                      judge (see the three anomaly kinds below)
 *
 * The UNRECOGNISED anomalies are the positive half, and they matter because
 * they fire even for a lab the census has never seen — a brand-new clone that
 * arrives already shaped like (a) or (b) is named, not silently skipped:
 *
 *   JOB-MAP-UNREADABLE      `jobs:` is present, keys exist under it, and none
 *                           of them is at two-space indent            (mutation b)
 *   MERGE-NOT-RECOGNISED    a Dependabot workflow merges a pull request by some
 *                           means other than `gh pr merge`            (mutation a)
 *   RATIONALE-WITHOUT-DISPATCH
 *                           an auto-merge job still carries the paragraph
 *                           explaining why it dispatches, and no longer
 *                           dispatches                                (mutation c)
 *
 * Purely local — no network, no `gh`.
 *
 * Usage (from the crypto-lab repo root):
 *   node tools/dispatch-census.js          report; exit 0 always
 *   node tools/dispatch-census.js check    same report; exit 1 on any failure
 *   node tools/dispatch-census.js write    regenerate tools/dispatch-census.json
 *                                          from what is on disk NOW. Read the
 *                                          diff: this file is the only thing
 *                                          that remembers a lab used to be here.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const comments = require('./dispatch-comment-sync.js');

const FLEET_ROOT = comments.FLEET_ROOT;
const CENSUS_FILE = path.join(__dirname, 'dispatch-census.json');

/* Merges that are not `gh pr merge`. Each of these lands a Dependabot pull
 * request, and none of them is recognised by isAutoMergeJob(), so a lab that
 * moves onto one drops out of both checkers. Naming them here does not teach
 * the checkers to judge those shapes — it makes the lab loud instead of gone. */
const OTHER_MERGE = [
  { re: /gh\s+api\b[^\n]*\/merge\b/, why: 'merges with `gh api ... /merge`' },
  { re: /\/pulls\/[^\n]*\/merge\b/, why: 'merges through the pulls API' },
  { re: /merge_method\s*[:=]/, why: 'merges through an API call taking `merge_method`' },
  { re: /enable-pull-request-automerge|automerge-action|pascalgn\/automerge/, why: 'merges with a third-party automerge action' },
];

function labDirs(root = FLEET_ROOT) {
  return comments.siblingLabs(root);
}

/* ------------------------------------------------------------------ observe */

function observeRepo(root, repo) {
  const row = { repo, jobs: 0, sites: 0, anomalies: [] };
  const note = (kind, file, why) => row.anomalies.push({ repo, kind, file: path.basename(file), why });

  for (const file of comments.workflowFiles(path.join(root, repo))) {
    let text;
    try { text = fs.readFileSync(file, 'utf8'); } catch { continue; }
    const lines = text.split('\n');
    const jobs = comments.jobBlocks(lines);

    /* (b) A job map the parser cannot read. Not "no jobs" — keys under `jobs:`
     * at some other indent, which is valid YAML that GitHub runs happily. */
    const jobsIdx = lines.findIndex((l) => /^jobs:\s*(#.*)?$/.test(l));
    if (jobsIdx >= 0 && !jobs.length) {
      let first = null;
      for (let i = jobsIdx + 1; i < lines.length && !/^\S/.test(lines[i]); i++) {
        const m = /^(\s+)([A-Za-z0-9_.-]+):/.exec(lines[i]);
        if (m) { first = { indent: m[1].length, name: m[2] }; break; }
      }
      if (first) {
        note('JOB-MAP-UNREADABLE', file,
          `\`jobs:\` has keys but none at two-space indent — \`${first.name}\` sits at ${first.indent}; `
          + 'every job in this file is invisible to dispatch-sync and dispatch-comment-sync');
      }
    }

    let recognisedHere = 0;
    for (const job of jobs) {
      const body = lines.slice(job.start, job.end).join('\n');
      if (!comments.isAutoMergeJob(job.name, body)) continue;
      recognisedHere++;
      row.jobs++;

      /* (c) The paragraph outlived the line it defends. */
      const disp = comments.findDispatchLine(lines, job.start, job.end);
      const commentText = lines.slice(job.start, job.end)
        .filter((l) => /^\s*#/.test(l)).join(' ');
      if (disp < 0 && comments.RATIONALE_RE.test(commentText)) {
        note('RATIONALE-WITHOUT-DISPATCH', file,
          `job \`${job.name}\` still carries the paragraph saying why it dispatches a deploy, and no `
          + 'longer dispatches one — the merge lands and the site keeps serving the previous build');
      }
    }

    /* (a) A Dependabot merge performed by some other means. Judged per FILE:
     * a repo can hold a recognised auto-merge job in one workflow and an
     * unrecognisable one in another, and the second must not hide behind the
     * first. */
    if (!recognisedHere && /dependabot/i.test(text)) {
      for (const { re, why } of OTHER_MERGE) {
        if (!re.test(text)) continue;
        note('MERGE-NOT-RECOGNISED', file,
          `${why} rather than \`gh pr merge\`, so no job here is recognised as a Dependabot auto-merge `
          + 'and this lab asserts nothing in either dispatch checker');
        break;
      }
    }
  }

  row.sites = comments.sites(repo, root).length;
  return row;
}

function observe(root = FLEET_ROOT) {
  return labDirs(root).map((repo) => observeRepo(root, repo));
}

/* ------------------------------------------------------------------- census */

function buildCensus(rows, root = FLEET_ROOT) {
  const sites = rows.filter((r) => r.sites > 0).map((r) => r.repo);
  const jobOnly = rows.filter((r) => r.jobs > 0 && r.sites === 0).map((r) => r.repo);
  const neither = rows.filter((r) => r.jobs === 0 && r.sites === 0).map((r) => r.repo);
  return {
    note: 'Generated by tools/dispatch-census.js write. The pinned denominator for '
      + 'dispatch-sync, dispatch-comment-sync and dispatch-proof. A lab that leaves a list '
      + 'here is a named failure, not a smaller number.',
    generated: new Date().toISOString().slice(0, 10),
    root: path.relative(path.join(__dirname, '..'), root) || '..',
    totals: {
      labs: rows.length,
      autoMergeJobs: rows.reduce((n, r) => n + r.jobs, 0),
      dispatchSites: rows.reduce((n, r) => n + r.sites, 0),
    },
    withDispatchSite: sites,
    autoMergeButNoDispatch: jobOnly,
    noAutoMergeJob: neither,
  };
}

function loadCensus() {
  return JSON.parse(fs.readFileSync(CENSUS_FILE, 'utf8'));
}

/* --------------------------------------------------------------- comparison */

function compare(rows, expected) {
  const fails = [];
  const add = (kind, repo, why) => fails.push({ kind, repo, why });
  const byRepo = new Map(rows.map((r) => [r.repo, r]));

  const pinned = new Map();
  for (const r of expected.withDispatchSite) pinned.set(r, 'site');
  for (const r of expected.autoMergeButNoDispatch) pinned.set(r, 'job-only');
  for (const r of expected.noAutoMergeJob) pinned.set(r, 'none');

  for (const [repo, kind] of pinned) {
    const row = byRepo.get(repo);
    if (!row) {
      add('NOT-CLONED', repo,
        'pinned in tools/dispatch-census.json and not cloned here, so no dispatch checker judges it');
      continue;
    }
    if (kind === 'site') {
      if (!row.jobs) add('MISSING-JOB', repo, 'no Dependabot auto-merge job is recognised here any more');
      if (!row.sites) {
        add('MISSING-SITE', repo,
          'pinned to carry a dispatch rationale site; none was found — the site total would have '
          + 'decremented in silence');
      }
    } else if (kind === 'job-only') {
      if (!row.jobs) add('MISSING-JOB', repo, 'no Dependabot auto-merge job is recognised here any more');
      if (row.sites) add('UNEXPECTED-SITE', repo, 'now carries a dispatch site; re-take the census if that is intended');
    } else {
      if (row.jobs) add('UNEXPECTED-JOB', repo, 'now runs an auto-merge job; re-take the census if that is intended');
      if (row.sites) add('UNEXPECTED-SITE', repo, 'now carries a dispatch site; re-take the census if that is intended');
    }
  }

  for (const row of rows) {
    if (!pinned.has(row.repo)) {
      add('UNPINNED-LAB', row.repo,
        `cloned here and absent from the census (${row.jobs} auto-merge job(s), ${row.sites} dispatch site(s)) `
        + '— a new lab must be pinned before it counts');
    }
  }

  const observed = {
    labs: rows.length,
    autoMergeJobs: rows.reduce((n, r) => n + r.jobs, 0),
    dispatchSites: rows.reduce((n, r) => n + r.sites, 0),
  };
  for (const k of ['labs', 'autoMergeJobs', 'dispatchSites']) {
    if (observed[k] !== expected.totals[k]) {
      add('COUNT', '(fleet)', `${k}: pinned ${expected.totals[k]}, observed ${observed[k]}`);
    }
  }
  /* The census must also agree with itself: a hand-edited totals block that no
   * longer matches its own lists would silence the COUNT check above. */
  const listed = expected.withDispatchSite.length + expected.autoMergeButNoDispatch.length
    + expected.noAutoMergeJob.length;
  if (listed !== expected.totals.labs) {
    add('COUNT', '(census file)',
      `tools/dispatch-census.json lists ${listed} labs but pins totals.labs = ${expected.totals.labs}`);
  }
  if (expected.withDispatchSite.length !== expected.totals.dispatchSites) {
    add('COUNT', '(census file)',
      `tools/dispatch-census.json lists ${expected.withDispatchSite.length} labs with a site but pins `
      + `totals.dispatchSites = ${expected.totals.dispatchSites}`);
  }

  const anomalies = rows.flatMap((r) => r.anomalies);
  for (const a of anomalies) add('UNRECOGNISED', a.repo, `${a.kind} in ${a.file} — ${a.why}`);

  return { fails, observed };
}

/* One call for every other tool: observe the fleet, compare it with the pinned
 * census, hand back named failures. */
function verify(root = FLEET_ROOT, expected = loadCensus()) {
  const rows = observe(root);
  const { fails, observed } = compare(rows, expected);
  return { rows, fails, observed, expected };
}

const ORDER = ['UNRECOGNISED', 'MISSING-SITE', 'MISSING-JOB', 'NOT-CLONED', 'UNPINNED-LAB',
  'UNEXPECTED-JOB', 'UNEXPECTED-SITE', 'COUNT'];

function report(v) {
  console.log(`Dispatch census: ${v.observed.labs} labs, ${v.observed.autoMergeJobs} auto-merge jobs, `
    + `${v.observed.dispatchSites} dispatch sites (pinned: ${v.expected.totals.labs} / `
    + `${v.expected.totals.autoMergeJobs} / ${v.expected.totals.dispatchSites})`);
  if (!v.fails.length) {
    console.log('Every pinned lab is present and classifiable.');
    return 0;
  }
  for (const kind of ORDER) {
    const g = v.fails.filter((f) => f.kind === kind);
    if (!g.length) continue;
    console.log(`\n${kind} (${g.length}):`);
    for (const f of g) console.log(`  ${f.repo}  — ${f.why}`);
  }
  console.log('\nA lab that cannot be classified asserts NOTHING in dispatch-sync or');
  console.log('dispatch-comment-sync. Fix the lab, or — if the change is intended — re-pin it with:');
  console.log('    node tools/dispatch-census.js write     (rewrites tools/dispatch-census.json; read the diff)');
  return v.fails.length;
}

function main() {
  const arg = process.argv[2];
  if (arg === 'write') {
    const rows = observe();
    const census = buildCensus(rows);
    fs.writeFileSync(CENSUS_FILE, `${JSON.stringify(census, null, 2)}\n`);
    console.log(`Wrote ${path.relative(process.cwd(), CENSUS_FILE)}: ${census.totals.labs} labs, `
      + `${census.totals.autoMergeJobs} auto-merge jobs, ${census.totals.dispatchSites} dispatch sites.`);
    const anomalies = rows.flatMap((r) => r.anomalies);
    if (anomalies.length) {
      console.log(`\nWARNING — ${anomalies.length} lab(s) are unclassifiable and were pinned as they stand:`);
      for (const a of anomalies) console.log(`  ${a.repo}  ${a.kind} in ${a.file}`);
    }
    return 0;
  }
  const v = verify();
  const failed = report(v);
  return arg === 'check' && failed ? 1 : 0;
}

module.exports = { observe, observeRepo, buildCensus, compare, verify, loadCensus, CENSUS_FILE, FLEET_ROOT };

if (require.main === module) process.exit(main());
