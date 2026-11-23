/**
 * The local runner must run EVERY test file, not a subset.
 *
 * scripts/run-tests.mjs splits tests/ into a short serial phase and a parallel
 * phase, so the one suite that builds a 20 MB artefact at module load is not
 * starved by thirty neighbours. A split is a chance to drop a file, and a test
 * file nobody runs reports nothing -- so the split is asserted here to be a
 * partition of the directory, with nothing lost and nothing run twice.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const RUNNER = fs.readFileSync(path.join(ROOT, 'scripts/run-tests.mjs'), 'utf8');

const onDisk = fs.readdirSync(path.join(ROOT, 'tests'))
  .filter((f) => /\.(test|spec)\.(c|m)?js$/.test(f)).sort();

function serialList() {
  const m = RUNNER.match(/const SERIAL = new Set\(\[([\s\S]*?)\]\)/);
  assert.ok(m, 'the runner must declare its serial set');
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

test('the runner discovers test files from the directory, not a written list', () => {
  assert.match(RUNNER, /readdirSync\(TESTS\)/,
    'a hand-written file list would silently miss a new test file');
});

test('serial plus parallel is exactly the directory, with no file lost or doubled', () => {
  const serial = serialList();
  const parallel = onDisk.filter((f) => !serial.includes(f));
  assert.deepEqual([...serial, ...parallel].sort(), onDisk,
    'the two phases must partition tests/');
  assert.equal(new Set([...serial, ...parallel]).size, onDisk.length, 'no file may run twice');
});

test('every serial entry exists, so a stale name cannot hide a suite', () => {
  for (const f of serialList()) {
    assert.ok(onDisk.includes(f), `${f} is listed as serial but is not in tests/`);
  }
});

test('the serial list stays short and is the heavy-build suite only', () => {
  const serial = serialList();
  assert.ok(serial.length <= 3, `serial is ${serial.length} files; each one costs wall-clock`);
  assert.ok(serial.includes('teaching-export.test.cjs'),
    'the suite that builds the export at module load is the reason this split exists');
});

test('the parallel escape hatch is kept, and is not what npm test runs', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts.test, 'node scripts/run-tests.mjs');
  assert.equal(pkg.scripts['test:all-parallel'], 'node --test tests/',
    'the plain run stays available for reproducing the contention it works around');
});

/* PHASE 3: the suite CI runs that lives nowhere in tests/.
 *
 * `npm test` was exactly tests/, so a green local run did not mean a green CI --
 * readme-sync.yml's checker-regressions job also runs a Python suite, and the
 * only thing that ever reported it broken was CI, after the push. Phase 3 closes
 * that, and these assertions keep the local command and CI's command the same
 * command; two copies of an invocation are two chances to drift. */
const WF = fs.readFileSync(path.join(ROOT, '.github/workflows/readme-sync.yml'), 'utf8');

test('the runner runs the Python controls CI runs, with the same discover arguments', () => {
  const m = RUNNER.match(/const PYTHON_CONTROLS = \[([\s\S]*?)\];/);
  assert.ok(m, 'phase 3 must declare the command it runs');
  const args = [...m[1].matchAll(/'([^']*)'/g)].map((x) => x[1]);
  assert.deepEqual(args, ['-B', '-m', 'unittest', 'discover',
    '-s', 'audits/fleet-maintenance-2026-10-09/tools', '-p', 'test_*.py']);
  /* and the same thing, read out of the workflow, so the pair cannot drift */
  const step = WF.match(/run: python3 (-B[^\n]*)/);
  assert.ok(step, 'readme-sync.yml must still run the Python controls');
  const ciArgs = step[1].trim().replace(/'/g, '').split(/\s+/);
  assert.deepEqual(ciArgs.filter((a) => a !== '-v'), args,
    'the local phase and the CI step must invoke the same suite');
});

test('the discover directory exists and holds test files, so the phase cannot be vacuous', () => {
  const dir = path.join(ROOT, 'audits/fleet-maintenance-2026-10-09/tools');
  const files = fs.readdirSync(dir).filter((f) => /^test_.*\.py$/.test(f));
  assert.ok(files.length >= 2, `expected Python controls in ${dir}, found ${files.length}`);
});

test('an absent python3 fails the run rather than passing it', () => {
  /* spawnSync reports ENOENT and there is no exit code to read, so the error
     branch is the only thing standing between "did not run" and "clean". */
  assert.match(RUNNER, /if \(py\.error\)/);
  assert.match(RUNNER, /not the same as passing/);
  const errBranch = RUNNER.slice(RUNNER.indexOf('if (py.error)'), RUNNER.indexOf('process.exit(failed'));
  assert.match(errBranch, /failed \+= 1/, 'the error branch must count as a failure');
});

test('the tools install is conditional, and a failed install is not read as a pass', () => {
  /* npm ci DELETES node_modules and this machine runs several sessions, so the
     install happens only when it is absent or behind the lockfile -- and when it
     does fail, the result below it must not be believed. */
  assert.match(RUNNER, /npm', \['ci', '--ignore-scripts'\]/);
  assert.match(RUNNER, /state === 'current'/, 'a current install must not be reinstalled');
  assert.match(RUNNER, /would fail for the wrong reason/);
});

test('the tools install happens BEFORE any test phase, not after', () => {
  /* The defect this pins, found 2026-11-22: the install sat in phase 3, after the
     two phases that need it. 12 suites in tests/ require
     ../tools/node_modules/playwright at MODULE LOAD, so on a fresh clone or a new
     worktree `npm test` opened with 12 failures reading
     "Cannot find module '../tools/node_modules/playwright'" and then installed the
     thing that would have prevented them. Measured in a fresh worktree before the
     fix: tests 12, pass 0, fail 12.

     Ordering is asserted by source position because that is the property -- the
     install must be upstream of the first `run(...)` call, and no amount of
     correct install logic downstream of it helps. */
  const install = RUNNER.indexOf("spawnSync('npm', ['ci'");
  const firstPhase = RUNNER.indexOf('run(serial,');
  assert.ok(install > 0, 'the runner must install tools deps somewhere');
  assert.ok(firstPhase > 0, 'the runner must have a first test phase to be upstream of');
  assert.ok(install < firstPhase,
    'tools/node_modules must be installed before the phases that require it, not after');
});

test('a still-absent Playwright is one refusal, not twelve suite failures', () => {
  /* The install can fail or be skipped and leave the package absent; 12 suites then
     die at module load and read as 12 defects in the code. The runner stops instead,
     the way it already stops for a stale SERIAL entry. Both branches verified to
     exit 2 by hand on 2026-11-22. */
  const guard = RUNNER.slice(RUNNER.indexOf('const playwrightAt'), RUNNER.indexOf('run-tests: ${serial.length}'));
  assert.match(guard, /process\.exit\(2\)/, 'an absent package must stop the run, not be run into');
  assert.match(guard, /12 suites/, 'the message must say how many suites it is speaking for');
  /* The browser BINARY is a separate failure with a separate remedy, because
     --ignore-scripts suppresses the download that CI does in its own next step. */
  assert.match(guard, /npx playwright install chromium/,
    'a missing Chromium build must name the command that installs it');
  /* And a changed Playwright API must not be able to block every other suite: the
     probe is advisory, so its failure continues rather than exiting. */
  const probe = guard.slice(guard.indexOf('} catch'));
  assert.ok(!/process\.exit/.test(probe),
    'the probe must not turn its own breakage into a refusal of the whole run');
});
