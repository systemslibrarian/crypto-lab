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
 */
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
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

console.log(`run-tests: ${serial.length} serial then ${parallel.length} parallel, ${all.length} files total.`);
let failed = 0;
const run = (files, label) => {
  if (!files.length) return;
  console.log(`\n── ${label} ──`);
  const r = spawnSync(process.execPath, ['--test', ...files.map((f) => path.join('tests', f))],
    { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) failed += 1;
};
run(serial, `serial (${serial.join(', ')})`);
run(parallel, 'parallel (everything else)');
process.exit(failed ? 1 : 0);
