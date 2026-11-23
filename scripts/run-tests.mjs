#!/usr/bin/env node
/**
 * `npm test` for a workstation, in CI's order.
 *
 * Why this exists rather than `node --test tests/`: tests/teaching-export.test.cjs
 * builds the whole 20 MB export at module load, reading 252 sibling clones, and
 * the plain whole-directory run starts that build in parallel with ~30 other
 * test files. Under that contention the build has been seen to die before
 * writing its manifest, and the suite then reports "no coverage.json was
 * produced" -- a FALSE failure about a generator that is fine. A test that fails
 * for environmental reasons teaches people to ignore it, which is the habit this
 * repository keeps closing.
 *
 * CI never had the problem, and the reason is instructive: no workflow runs
 * `npm test` at all. .github/workflows/teaching-export.yml runs
 * `npm run teaching-export` and then `node --test tests/teaching-export.test.cjs`
 * ALONE in its own job, so the heavy build has the machine to itself. This
 * script reproduces that order locally: heavy suites first, by themselves, then
 * everything else in parallel.
 *
 * It does NOT skip anything. The two phases together run exactly the files the
 * plain run would, and the file list is derived from the directory rather than
 * written down, so a new test file cannot be silently left out.
 *
 * AND IT IS NOT ONLY tests/. A green local run has to mean a green CI, and
 * .github/workflows/readme-sync.yml's checker-regressions job runs a suite that
 * lives nowhere in tests/: the maintainer live and integration controls, in
 * Python, under audits/fleet-maintenance-2026-10-09/tools. `npm test` did not run
 * them, so the only thing that ever told anyone they had broken was CI, after the
 * push. They run here now, as a third phase, for the same reason the first two
 * are ordered rather than left to luck.
 *
 * One of those controls asserts that a REAL Playwright CLI is installed rather
 * than substituting one, so the phase needs tools/node_modules -- which is why CI
 * runs `npm ci --ignore-scripts` in tools/ in the step immediately before it.
 * This script does the same install, but only when node_modules is absent or
 * behind tools/package-lock.json. It deliberately does not reinstall otherwise:
 * `npm ci` DELETES node_modules, this machine runs several sessions at once, and
 * taking a sibling's Playwright out from under a running suite is the shared-state
 * defect CLAUDE.md's concurrency rules are about.
 *
 * AND THE INSTALL GOES FIRST, which it did not until 2026-11-22. It sat with the
 * Python controls in phase 3, after the two phases that need it, while 12 suites
 * in tests/ `require('../tools/node_modules/playwright')` at module load. So on a
 * fresh clone or a new worktree `npm test` opened with
 *
 *     Error: Cannot find module '../tools/node_modules/playwright'
 *     tests 12  pass 0  fail 12
 *
 * and then installed the thing that would have prevented it. Twelve red suites
 * that are not about the code is exactly the "test that fails for environmental
 * reasons" this header opens by refusing, and it is worse than the false failure
 * it was written against, because this one reads as twelve defects rather than as
 * one missing install. CI never showed it, for the reason given above: every
 * workflow that runs a browser suite does `npm ci` in tools/ AND
 * `npx playwright install chromium` in the steps immediately before it --
 * arcade-three-games.yml, learning-games.yml (four jobs), protocol-workshops.yml
 * and teach.yml all do -- so the local order was the only one that was wrong.
 */
import { readdirSync, existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const TESTS = path.join(ROOT, 'tests');

/* Suites that build a large artefact at module load. Each runs alone, before
   the parallel phase, for the reason in the header. Keep this list SHORT and
   justified: every entry costs wall-clock, and a suite listed here without a
   heavy build is just slower for nothing. */
const SERIAL = new Set(['teaching-export.test.cjs']);

const all = readdirSync(TESTS).filter((f) => /\.(test|spec)\.(c|m)?js$/.test(f)).sort();
const serial = all.filter((f) => SERIAL.has(f));
const parallel = all.filter((f) => !SERIAL.has(f));

for (const name of SERIAL) {
  if (!all.includes(name)) {
    console.error(`run-tests: ${name} is listed as serial but does not exist in tests/.`);
    console.error('Remove it from SERIAL or restore the file; a stale entry means a suite');
    console.error('nobody runs, which is the one thing this script must not hide.');
    process.exit(2);
  }
}

/* ------------------------------------------- phase 0: what the phases need
 *
 * Before any test runs, not after. The header says why.
 */
const TOOLS = path.join(ROOT, 'tools');
/* Absent, behind the lockfile, or current. npm writes node_modules/.package-lock.json
   on every install, so its mtime against tools/package-lock.json is the cheap
   question "was this installed after the lockfile last moved". */
const toolsDeps = () => {
  const installed = path.join(TOOLS, 'node_modules', '.package-lock.json');
  const lock = path.join(TOOLS, 'package-lock.json');
  if (!existsSync(installed) || !existsSync(lock)) return 'absent';
  try { return statSync(lock).mtimeMs > statSync(installed).mtimeMs ? 'behind' : 'current'; }
  catch { return 'absent'; }
};

let failed = 0;
const state = toolsDeps();
if (state === 'current') {
  console.log('── tools/node_modules matches tools/package-lock.json; no npm ci needed ──');
} else {
  console.log(`── tools/node_modules is ${state}: npm ci --ignore-scripts in tools/ (CI's own step) ──`);
  const r = spawnSync('npm', ['ci', '--ignore-scripts'], { cwd: TOOLS, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.error || r.status !== 0) {
    console.error('run-tests: npm ci in tools/ did not succeed, so the suites below');
    console.error('would fail for the wrong reason. Fix the install before reading their result.');
    failed += 1;
  }
}

/* The install is what those 12 suites resolve at module load, so if it is STILL
   not there the honest answer is one refusal, now, rather than twelve red suites
   about a missing package. Same rule as the stale SERIAL entry above: exit 2 and
   say what to do.

   The browser BINARY is a separate question from the package, because
   `--ignore-scripts` suppresses the postinstall that downloads it -- which is why
   CI runs `npx playwright install chromium` as its own step. It lives in a shared
   per-user cache rather than in node_modules, so it survives a fresh worktree and
   is usually already there; when it is not, say so in those terms instead of
   letting 12 suites fail on a launch. */
const playwrightAt = path.join(TOOLS, 'node_modules', 'playwright');
if (!existsSync(playwrightAt)) {
  console.error(`run-tests: ${path.relative(ROOT, playwrightAt)} is still absent after the step above.`);
  console.error('12 suites in tests/ require it at module load and would report as 12 failures');
  console.error('about the code. Run `npm ci` in tools/ and read why it did not install.');
  process.exit(2);
}
try {
  /* createRequire, not `await import`: playwright's entry point is CommonJS, so a
     dynamic import hangs its exports off `.default` and the destructure silently
     yields undefined -- which is how the first version of this check reported
     "could not ask" on a machine where Chromium was sitting right there. */
  const { chromium } = createRequire(import.meta.url)(playwrightAt);
  const exe = chromium.executablePath();
  if (!existsSync(exe)) {
    console.error('run-tests: Playwright is installed but its Chromium build is not:');
    console.error(`  ${exe}`);
    console.error('`npm ci --ignore-scripts` deliberately skips the download, so run CI\'s own');
    console.error('next step: `npx playwright install chromium` in tools/.');
    process.exit(2);
  }
} catch (e) {
  /* Not a pass and not a stop: the browser suites will say so themselves, and a
     changed Playwright API must not be able to block every other suite here. */
  console.error(`run-tests: could not ask Playwright where its Chromium is (${e.code ?? e.message}).`);
  console.error('Continuing; the browser suites below are the ones that will answer.');
}

console.log(`run-tests: ${serial.length} serial then ${parallel.length} parallel, ${all.length} files total.`);
const run = (files, label) => {
  if (!files.length) return;
  console.log(`\n── ${label} ──`);
  const r = spawnSync(process.execPath, ['--test', ...files.map((f) => path.join('tests', f))],
    { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) failed += 1;
};
run(serial, `serial (${serial.join(', ')})`);
run(parallel, 'parallel (everything else)');

/* ---------------------------------------------------- phase 3: not in tests/
 *
 * CI's own command, character for character, so the two cannot drift:
 * tests/run-tests-partition.test.cjs asserts that this array and the step in
 * readme-sync.yml say the same thing.
 */
const PYTHON_CONTROLS = ['-B', '-m', 'unittest', 'discover',
  '-s', 'audits/fleet-maintenance-2026-10-09/tools', '-p', 'test_*.py'];

console.log('\n── maintainer live and integration controls (Python, not in tests/) ──');
const py = spawnSync('python3', PYTHON_CONTROLS, { cwd: ROOT, stdio: 'inherit' });
if (py.error) {
  /* An absent interpreter is NOT a pass. spawnSync reports ENOENT and there is no
     exit code to read; a suite that did not run must never come back clean, which
     is the same rule every checker here follows for "could not look". */
  console.error(`run-tests: python3 could not be run (${py.error.code}); the Python controls`);
  console.error('did NOT run, which is not the same as passing. CI runs them, so install');
  console.error('python3 or expect CI to disagree with this run.');
  failed += 1;
} else if (py.status !== 0) {
  failed += 1;
}

process.exit(failed ? 1 : 0);
