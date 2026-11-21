#!/usr/bin/env node
/**
 * `npm run selftest` — every checker's own fixture self-check, in one command.
 *
 * These are the runs that exercise a DETECTOR against pinned fixtures: they open
 * no clone, ask GitHub nothing, and say whether a checker still bites. CI runs
 * most of them, one step per tool, inside readme-sync.yml's checker-regressions
 * job. Locally there was no way to run the set, so the answer to "did I break a
 * checker" was "push and see".
 *
 * NOT WIRED INTO `npm test` OR ANY HOOK, by instruction. It is a command you run.
 *
 * THE SET IS DERIVED, NOT WRITTEN DOWN. Every git-tracked tools/*.js that
 * implements a `selftest` mode is in it, so a checker that grows one is picked up
 * without anyone remembering to add it here — the failure this repository keeps
 * having is a denominator that is discovered rather than declared, and a
 * hand-kept list of self-checks is exactly that shape. The run also says which of
 * them NO workflow invokes, because a selftest nothing runs is the same as no
 * selftest: today that is api-budget.js.
 *
 * WHAT IS DELIBERATELY NOT IN IT, so the absence is not read as "there is nothing
 * else": the two fixture PROOFS in the same CI job, `node
 * tools/evidence-shape-proof.js` and `node tools/clone-guard-proof.js`, plus the
 * two dispatch proofs (`dispatch-proof.js`, `dispatch-mutations.js`) that are
 * manual. They are self-checks of the same character and were left out because
 * the instruction named selftests and kdf-investigation-check.py. They are
 * printed at the end as the adjacent set.
 *
 * COUNT, because an earlier report of mine said "~20" and that was wrong: there
 * are TEN tools with a selftest mode, NINE of which some workflow invokes, plus
 * the one Python checker below. The ~20 was a miscount of the whole
 * checker-regressions job, which also holds ~20 `node --test` steps.
 *
 * EVERY COMMAND RUNS EVEN AFTER ONE FAILS. One failure must not hide the other
 * ten; this is the rule fleet-check.js already follows, for the reason it
 * records — a single failure that buries the rest is how people learn to read
 * only the first line.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const TOOLS = path.join(ROOT, 'tools');
const WORKFLOWS = path.join(ROOT, '.github', 'workflows');

/** The one non-JS checker in the set, named by instruction. */
const PYTHON_CHECKER = 'tools/kdf-investigation-check.py';

/** Self-checks of the same character, deliberately out of scope. Printed, so the
 *  absence is a statement rather than a silence. */
const ADJACENT = ['tools/evidence-shape-proof.js', 'tools/clone-guard-proof.js',
  'tools/dispatch-proof.js', 'tools/dispatch-mutations.js'];

/** Tracked files only, so a parked or untracked tool cannot join the set. */
function tracked() {
  const r = spawnSync('git', ['-C', ROOT, 'ls-files', '--', 'tools'], { encoding: 'utf8' });
  if (r.status !== 0) {
    console.error('run-selftests: `git ls-files -- tools` failed, so the set could not be derived.');
    console.error('That is a read failure, not an empty set, and it must not pass as one.');
    process.exit(2);
  }
  return new Set(r.stdout.split('\n').map((s) => s.trim()).filter(Boolean));
}

/** Does this tool implement a `selftest` mode? Comments are stripped first: a
 *  tool that merely DISCUSSES another's selftest must not be credited with one.
 *
 *  EITHER QUOTE, and a backtick. The first version of this matched only
 *  `=== 'selftest'`, and the negative control below caught it: a throwaway tool
 *  written with `=== "selftest"` was not in the set at all, so a deliberately
 *  FAILING selftest produced a clean exit 0. All ten live tools happen to use
 *  single quotes, so nothing in the real set would have shown it — the detector
 *  would have gone on reporting a clean run over a set that silently excluded
 *  any double-quoted tool. */
function hasSelftest(file) {
  const src = readFileSync(path.join(TOOLS, file), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n').filter((l) => !l.trim().startsWith('//')).join('\n');
  return /===\s*(['"`])selftest\1/.test(src);
}

/** Which selftests does any workflow actually invoke? */
function invokedByWorkflow() {
  const seen = new Set();
  for (const wf of readdirSync(WORKFLOWS).filter((f) => /\.ya?ml$/.test(f))) {
    const text = readFileSync(path.join(WORKFLOWS, wf), 'utf8')
      .split('\n').filter((l) => !/^\s*#/.test(l)).join('\n');
    for (const m of text.matchAll(/node (tools\/[\w.-]+\.js) selftest/g)) seen.add(m[1]);
  }
  return seen;
}

const trackedFiles = tracked();
const jsTools = [...trackedFiles]
  .filter((p) => /^tools\/[\w.-]+\.js$/.test(p))
  .map((p) => path.basename(p))
  .filter((f) => hasSelftest(f))
  .sort();
const invoked = invokedByWorkflow();

const commands = [
  ...jsTools.map((f) => ({ label: `tools/${f} selftest`, cmd: 'node', args: [`tools/${f}`, 'selftest'],
    ci: invoked.has(`tools/${f}`) })),
  { label: PYTHON_CHECKER, cmd: 'python3', args: [PYTHON_CHECKER], ci: true },
];

if (!trackedFiles.has(PYTHON_CHECKER)) {
  console.error(`run-selftests: ${PYTHON_CHECKER} is not tracked; the set names a file that is not there.`);
  process.exit(2);
}
if (jsTools.length < 5) {
  /* A derivation that comes back near-empty is a claim about every tool, and this
     repository's own lesson is to distrust it before trusting the one finding. */
  console.error(`run-selftests: derived only ${jsTools.length} selftest(s), which is too few to be right.`);
  console.error('The detection pattern or the tracked-file read has broken; refusing to report a');
  console.error('clean run over almost nothing.');
  process.exit(2);
}

console.log(`run-selftests: ${commands.length} command(s) — ${jsTools.length} tool selftest(s) derived from`);
console.log('tools/*.js, plus the one Python checker. Every one runs even after a failure.');
const notInCi = commands.filter((c) => !c.ci);
if (notInCi.length) {
  console.log(`\nNOT RUN BY ANY WORKFLOW (${notInCi.length}) — a selftest nothing runs is the same as no selftest:`);
  for (const c of notInCi) console.log(`  ${c.label}`);
}

const results = [];
for (const c of commands) {
  const started = Date.now();
  const r = spawnSync(c.cmd, c.args, { cwd: ROOT, stdio: 'inherit' });
  const ms = Date.now() - started;
  /* An absent interpreter or script is NOT a pass. spawnSync reports the error
     and there is no exit code to read; node itself exits 1 for a script that does
     not exist, which is the same code a script that ran and failed uses. Either
     way the check did not happen, and a run that did not happen must never come
     back clean. */
  const state = r.error ? `could-not-run (${r.error.code})` : (r.status === 0 ? 'pass' : `fail (exit ${r.status})`);
  results.push({ ...c, ms, state, ok: !r.error && r.status === 0 });
}

const failed = results.filter((x) => !x.ok);
const total = results.reduce((n, x) => n + x.ms, 0);
console.log(`\n${'='.repeat(72)}`);
for (const x of results) {
  console.log(`  ${x.state === 'pass' ? 'pass' : 'FAIL'}  ${String((x.ms / 1000).toFixed(1)).padStart(6)}s  ${x.label}${x.state === 'pass' ? '' : `  — ${x.state}`}`);
}
console.log(`\n${results.length - failed.length} of ${results.length} passed in ${(total / 1000).toFixed(1)}s wall clock.`);
console.log(`Not included, and self-checks of the same character: ${ADJACENT.join(', ')}.`);
if (failed.length) {
  console.error(`\n${failed.length} did not pass: ${failed.map((x) => x.label).join(', ')}`);
}
process.exit(failed.length ? 1 : 0);
