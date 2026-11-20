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
     does fail, the Python result below it must not be believed. */
  assert.match(RUNNER, /npm', \['ci', '--ignore-scripts'\]/);
  assert.match(RUNNER, /state === 'current'/, 'a current install must not be reinstalled');
  assert.match(RUNNER, /would fail for the wrong reason/);
});
