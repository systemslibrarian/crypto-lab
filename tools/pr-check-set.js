#!/usr/bin/env node
/*
 * pr-check-set.js — which checks a pull request is SUPPOSED to get, derived from
 *   the workflow files rather than from what happened to report.
 *
 * Run: node tools/pr-check-set.js expected --paths-from <file>
 *      node tools/pr-check-set.js verify --sha <sha> --paths-from <file> [--repo owner/name]
 *      node tools/pr-check-set.js workflows --paths-from <file>
 * Prevents: a pull request merging on four checks that say nothing about the
 *   catalog, because the twelve that guard it were never requested.
 * Reads: .github/workflows/*.yml -- the pull_request trigger and its
 *   paths/paths-ignore filters -- plus SECURITY_CHECKS below.
 *
 * WHY THIS EXISTS. `gh pr create` authenticated as secrets.GITHUB_TOKEN does not
 * raise a `pull_request` event, so a pull request opened by a job reports only
 * the checks that run on `push`. On crypto-lab#467 that was four security scans
 * out of sixteen, and `gh pr checks` said green, because what reported was
 * green. Issue #468. The same property is already documented one layer up: a
 * GITHUB_TOKEN merge raises no push event, which is why every lab carries an
 * explicit deploy dispatch and why dispatch-sync exists.
 *
 * The answer to "is this pull request fully checked" therefore cannot be "are
 * the checks that reported green". It has to be "did the checks that SHOULD run
 * report, and are they green" -- and the only honest source for the first half
 * is the workflow files.
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const WF_DIR = path.join(ROOT, '.github', 'workflows');

/* CodeQL's four checks come from GitHub's DEFAULT SETUP, which is repository
   configuration and not a file in this repository -- grep the workflows and you
   will not find them. They report on a push to any branch, which is why they are
   the four that did report on #467. Declared here so the expected set is
   complete, and marked so a reader knows why they have no workflow file. */
const SECURITY_CHECKS = ['CodeQL', 'Analyze (actions)', 'Analyze (javascript-typescript)', 'Analyze (python)'];

/** Minimal YAML reach for the shapes GitHub Actions actually uses here. */
function loadWorkflow(file) {
  const { parseYaml } = require('./gate-sync.js');
  return parseYaml(fs.readFileSync(file, 'utf8'));
}

/* A `paths:` entry is a glob. Only the forms these workflows use are
   implemented, and an unrecognised one THROWS rather than silently failing to
   match -- a filter this cannot read must not quietly become "runs on
   everything" or "runs on nothing". */
function globMatches(pattern, file) {
  if (pattern === file) return true;
  if (!/[*?\[]/.test(pattern)) return pattern === file;
  if (/\*\*/.test(pattern)) {
    const re = new RegExp('^' + pattern.split('**').map(escapeLiteral).join('.*') + '$');
    return re.test(file);
  }
  if ((pattern.match(/\*/g) || []).length >= 1 && !pattern.includes('[') && !pattern.includes('?')) {
    const re = new RegExp('^' + pattern.split('*').map(escapeLiteral).join('[^/]*') + '$');
    return re.test(file);
  }
  throw new Error(`pr-check-set: unsupported path pattern ${JSON.stringify(pattern)}`);
}
const escapeLiteral = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Does this workflow's pull_request trigger fire for these changed paths? */
function firesForPaths(on, files) {
  const pr = on && on.pull_request;
  if (pr === undefined) return false;                 // no pull_request trigger at all
  if (pr === null || typeof pr !== 'object') return true;  // `pull_request:` with no filter
  const { paths, 'paths-ignore': ignore } = pr;
  if (Array.isArray(paths)) return files.some((f) => paths.some((p) => globMatches(p, f)));
  if (Array.isArray(ignore)) return files.some((f) => !ignore.some((p) => globMatches(p, f)));
  return true;
}

/**
 * The check names a pull request touching `files` should receive.
 * Returns { checks, workflows } -- workflows is what must be dispatched when the
 * pull_request event was never raised.
 */
function expectedChecks(files) {
  if (!Array.isArray(files) || !files.length) throw new Error('pr-check-set: no changed paths given');
  const checks = new Set(SECURITY_CHECKS);
  const workflows = [];
  for (const name of fs.readdirSync(WF_DIR).filter((f) => f.endsWith('.yml')).sort()) {
    const doc = loadWorkflow(path.join(WF_DIR, name));
    const on = doc.on ?? doc[true];
    if (!firesForPaths(on, files)) continue;
    const jobs = Object.keys(doc.jobs || {});
    for (const j of jobs) checks.add(j);
    workflows.push({ file: name, jobs, dispatchable: !!(on && 'workflow_dispatch' in on) });
  }
  return { checks: [...checks].sort(), workflows };
}

/** What actually reported on a SHA, latest run per name. */
function actualChecks(sha, repo) {
  const out = execFileSync('gh', ['api',
    `repos/${repo}/commits/${sha}/check-runs?per_page=100&filter=latest`,
    '--jq', '.check_runs[] | [.name, (.conclusion // .status)] | @tsv',
  ], { encoding: 'utf8' });
  const map = new Map();
  for (const line of out.split('\n').filter(Boolean)) {
    const [name, state] = line.split('\t');
    map.set(name, state);
  }
  return map;
}

/* `skipped` counts as reported-and-fine. A path-filtered job inside a workflow
   that did fire reports skipped, and teach.yml's `drift` is skipped on every
   pull request in this repository. Treating skipped as a failure would make the
   expected set unsatisfiable; treating MISSING as fine is the bug this file
   exists to stop. */
const OK = new Set(['success', 'skipped']);

function verify(sha, files, repo) {
  const { checks } = expectedChecks(files);
  const actual = actualChecks(sha, repo);
  const missing = checks.filter((c) => !actual.has(c));
  const bad = checks.filter((c) => actual.has(c) && !OK.has(actual.get(c)));
  const pending = checks.filter((c) => ['queued', 'in_progress', 'waiting', 'pending'].includes(actual.get(c)));
  return { checks, missing, bad, pending, ok: !missing.length && !bad.length && !pending.length, actual };
}

/* `CodeQL` is the umbrella check CodeQL default setup creates on a
   pull_request event. A push to main produces only the three per-language
   `Analyze` checks, so verifying a MAIN commit against this set reports CodeQL
   missing -- correctly, because that commit was never checked as a pull request.
   This tool is for pull-request head SHAs. */

/**
 * Raise the checks a pull request should have had. GITHUB_TOKEN may raise
 * workflow_dispatch even though it may not raise pull_request, which is the
 * whole reason this works.
 */
function dispatchFor(files, ref, repo) {
  const { workflows } = expectedChecks(files);
  /* A workflow that must run and cannot be dispatched is a HARD error. Skipping
     it would reproduce #468 with extra steps: the run would look like it had
     requested everything and quietly not have. */
  const stuck = workflows.filter((w) => !w.dispatchable);
  if (stuck.length) {
    throw new Error('pr-check-set: these workflows must run but have no workflow_dispatch trigger: '
      + stuck.map((w) => w.file).join(', '));
  }
  const raised = [];
  for (const w of workflows) {
    execFileSync('gh', ['workflow', 'run', w.file, '--repo', repo, '--ref', ref], { encoding: 'utf8' });
    raised.push(w.file);
  }
  return raised;
}

/** Wait, bounded, for every expected check to report on a SHA. */
async function awaitChecks(sha, files, repo, timeoutMs, pollMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  let last = null;
  for (;;) {
    last = verify(sha, files, repo);
    if (last.ok) return last;
    /* A check that reported a real failure is final: keep waiting only while
       something is missing or still running. */
    if (last.bad.length) return last;
    if (Date.now() >= deadline) return last;
    await new Promise((r) => setTimeout(r, pollMs));
  }
}

module.exports = { expectedChecks, firesForPaths, globMatches, verify, dispatchFor, awaitChecks, SECURITY_CHECKS, OK };

if (require.main === module) {
  const argv = process.argv.slice(2);
  const arg = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
  const mode = argv[0];
  const pathsFile = arg('--paths-from', null);
  if (!pathsFile) { console.error('pr-check-set: --paths-from <file> is required'); process.exit(2); }
  const files = fs.readFileSync(pathsFile, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);

  if (mode === 'expected') {
    const { checks } = expectedChecks(files);
    for (const c of checks) console.log(c);
    process.exit(0);
  }
  if (mode === 'workflows') {
    const { workflows } = expectedChecks(files);
    for (const w of workflows) console.log(`${w.file}\t${w.dispatchable ? 'dispatchable' : 'NOT-DISPATCHABLE'}\t${w.jobs.join(',')}`);
    process.exit(0);
  }
  if (mode === 'verify') {
    const sha = arg('--sha', null);
    const repo = arg('--repo', process.env.GITHUB_REPOSITORY || 'systemslibrarian/crypto-lab');
    if (!sha) { console.error('pr-check-set: --sha is required'); process.exit(2); }
    const r = verify(sha, files, repo);
    console.log(`expected ${r.checks.length} check(s) on ${sha.slice(0, 12)}`);
    for (const c of r.checks) console.log(`  ${(r.actual.get(c) || 'MISSING').padEnd(12)} ${c}`);
    if (r.missing.length) console.log(`MISSING (never requested): ${r.missing.join(', ')}`);
    if (r.pending.length) console.log(`PENDING: ${r.pending.join(', ')}`);
    if (r.bad.length) console.log(`NOT OK: ${r.bad.map((c) => `${c}=${r.actual.get(c)}`).join(', ')}`);
    process.exit(r.ok ? 0 : 1);
  }
  if (mode === 'dispatch') {
    const ref = arg('--ref', null);
    const repo = arg('--repo', process.env.GITHUB_REPOSITORY || 'systemslibrarian/crypto-lab');
    if (!ref) { console.error('pr-check-set: --ref is required'); process.exit(2); }
    const raised = dispatchFor(files, ref, repo);
    console.log(`requested ${raised.length} workflow(s) on ${ref}: ${raised.join(', ')}`);
    process.exit(0);
  }
  if (mode === 'await') {
    const sha = arg('--sha', null);
    const repo = arg('--repo', process.env.GITHUB_REPOSITORY || 'systemslibrarian/crypto-lab');
    const timeout = Number(arg('--timeout', '1500')) * 1000;
    if (!sha) { console.error('pr-check-set: --sha is required'); process.exit(2); }
    awaitChecks(sha, files, repo, timeout).then((r) => {
      for (const c of r.checks) console.log(`  ${(r.actual.get(c) || 'MISSING').padEnd(12)} ${c}`);
      if (r.ok) { console.log(`all ${r.checks.length} expected check(s) reported success on ${sha.slice(0, 12)}`); process.exit(0); }
      if (r.bad.length) console.log(`FAILED: ${r.bad.map((c) => `${c}=${r.actual.get(c)}`).join(', ')}`);
      if (r.missing.length) console.log(`NEVER REQUESTED: ${r.missing.join(', ')}`);
      if (r.pending.length) console.log(`STILL RUNNING at the deadline: ${r.pending.join(', ')}`);
      process.exit(1);
    });
    return;
  }
  console.error('pr-check-set: mode must be expected, workflows, dispatch, await or verify');
  process.exit(2);
}
