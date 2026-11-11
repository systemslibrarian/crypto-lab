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
