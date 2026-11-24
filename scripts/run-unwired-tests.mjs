#!/usr/bin/env node
/**
 * Run every test file in tests/ that NO workflow names.
 *
 * Run: node scripts/run-unwired-tests.mjs
 * Prevents: a test file that `npm test` runs and CI does not, so its green means two different things depending on where it ran
 * Reads: the tests/ directory, and every `node --test` invocation in .github/workflows/*.yml
 *
 * WHY THIS EXISTS.
 *
 * `npm test` derives its set from readdirSync(tests/), so a new test file joins
 * it automatically. CI does not: each workflow names its files, and on 2026-11-23
 * **28 of 101 files in tests/ were named by no workflow at all**. They ran on a
 * workstation and nowhere else.
 *
 * That is not hypothetical. tests/clone-currency.test.cjs pinned
 * catalog-evidence's failing condition as a literal regex; #536 added a term to
 * that condition, CI reported 18 green checks, and `main` was red the moment
 * anyone ran the suite locally. The same shape as #530 one layer out: a suite
 * whose green means different things depending on where it ran.
 *
 * WHY A DERIVED SET RATHER THAN A LIST OF 28.
 *
 * A list would close today's gap and reopen it with the next test file somebody
 * adds -- the discovered-denominator defect CLAUDE.md keeps re-finding. So the
 * set is computed: the directory minus everything the workflows name. Add a test
 * file and it is covered here from the first run, by nobody remembering anything.
 * tests/pr-check-partition.test.cjs asserts the sets PARTITION the directory, so
 * neither this runner nor the workflows can quietly stop covering a file.
 *
 * It deliberately does NOT run the whole directory. 73 files are already named by
 * a workflow, several of them in jobs that install browsers first; running them a
 * second time here would double that cost and make this step the slowest in CI
 * for no new answer.
 *
 * CLONE-REQUIRED FILES ARE ROUTED, NOT SKIPPED.
 *
 * Some tests need the sibling crypto-lab-* clones, and the per-PR job has none.
 * tests/source-root-census.test.cjs is the case: it calls the real census() over
 * the clones and refuses when it cannot look -- "an unanswered question is not a
 * pass" -- which is correct and is NOT weakened to accommodate this. Those files
 * are DECLARED in tests/clone-required.json, left out of this runner, and run by
 * .github/workflows/fleet.yml's own step against the clones it already makes.
 *
 * Declared rather than detected, the way tools/clone-holds.json declares a held
 * clone: an absence is not an exclusion, and only one of them is loud. What makes
 * this routing rather than quiet dropping is tests/pr-check-partition.test.cjs,
 * which asserts the three sets -- named by a workflow, picked up here, declared
 * clone-required -- partition tests/ exactly, and that every declared entry
 * carries a reason.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const TESTS = path.join(ROOT, 'tests');
const WORKFLOWS = path.join(ROOT, '.github/workflows');
const IS_TEST = /\.(test|spec)\.(c|m)?js$/;

/**
 * The declared clone-required files, as `tests/<name>` paths.
 *
 * An unreadable or malformed list THROWS rather than returning empty: reading it
 * as "nothing is declared" would put a clone-required file back into the per-PR
 * run and fail it there, which is the same could-not-look-is-not-a-pass rule the
 * census itself applies.
 */
export function cloneRequired(testsDir = TESTS) {
  const file = path.join(testsDir, 'clone-required.json');
  const raw = readFileSync(file, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.files)) throw new Error(`${file}: no "files" array`);
  return parsed.files.map((e) => {
    if (!e || typeof e.file !== 'string' || !e.file) throw new Error(`${file}: an entry has no "file"`);
    if (typeof e.reason !== 'string' || !e.reason.trim()) throw new Error(`${file}: ${e.file} has no reason`);
    return e.file;
  });
}

/** Every tests/<file> a workflow names, plus whether one runs the whole directory. */
export function workflowCoverage(dir = WORKFLOWS) {
  const named = new Set();
  let wholeDir = false;
  for (const f of readdirSync(dir).filter((x) => /\.ya?ml$/.test(x))) {
    const text = readFileSync(path.join(dir, f), 'utf8');
    for (const m of text.matchAll(/node[^\n]*?--test[^\n]*/g)) {
      const line = m[0];
      /* `node --test tests/` with no file list covers everything; a flag may sit
         between, e.g. `--test --test-timeout=180000 tests/`. */
      if (/--test\s+(?:--[\w-]+(?:=\S+)?\s+)*tests\/?\s*$/.test(line)) wholeDir = true;
      for (const t of line.matchAll(/tests\/([A-Za-z0-9._-]+\.(?:test|spec)\.(?:c|m)?js)/g)) named.add(t[1]);
    }
  }
  return { named, wholeDir };
}

/**
 * The files this runner is responsible for: in tests/, named by no workflow, and
 * not declared clone-required. `cloneNeeded` is returned too, so a caller can see
 * where the rest went rather than inferring it from a smaller number.
 */
export function unwired(testsDir = TESTS, workflowsDir = WORKFLOWS) {
  const onDisk = readdirSync(testsDir).filter((f) => IS_TEST.test(f)).sort();
  const { named, wholeDir } = workflowCoverage(workflowsDir);
  const cloneNeeded = cloneRequired(testsDir).map((p) => path.basename(p));
  if (wholeDir) return { files: [], onDisk, named, wholeDir, cloneNeeded };
  const files = onDisk.filter((f) => !named.has(f) && !cloneNeeded.includes(f));
  return { files, onDisk, named, wholeDir, cloneNeeded };
}

if (import.meta.filename === process.argv[1]) {
  /* `--list-clone-required` is how the weekly workflow gets its file list. The
     workflow must not name the files itself: a hand-written list there and a
     declared list here would be two answers to one question, and the second
     reader would miss what the first one learned. */
  if (process.argv.includes('--list-clone-required')) {
    for (const f of cloneRequired()) console.log(f);
    process.exit(0);
  }
  const { files, onDisk, named, wholeDir, cloneNeeded } = unwired();
  console.log(`tests/ holds ${onDisk.length} test files; workflows name ${named.size}`
    + `${wholeDir ? ' and one runs the whole directory' : ''}.`);
  if (cloneNeeded.length) {
    /* Named, not silent. These are routed to the weekly clone-backed job, and a
       reader of this step's log has to be able to see where they went. */
    console.log(`${cloneNeeded.length} file(s) declared clone-required in tests/clone-required.json`
      + ' — run by the weekly fleet job, not here:');
    for (const f of cloneNeeded) console.log(`  ${f}`);
  }
  if (!files.length) {
    /* Not a pass to celebrate: it means either every file is named, or a workflow
       runs the directory wholesale. Either way there is nothing left for this
       runner, and saying so beats printing a green tick over an empty set. */
    console.log('No unwired test file. Nothing for this runner to do.');
    process.exit(0);
  }
  console.log(`Running ${files.length} file(s) no workflow names:\n`);
  for (const f of files) console.log(`  ${f}`);
  console.log('');
  const r = spawnSync(process.execPath, ['--test', ...files.map((f) => path.join('tests', f))],
    { cwd: ROOT, stdio: 'inherit' });
  process.exit(r.status === 0 ? 0 : 1);
}
