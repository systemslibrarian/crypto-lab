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
 * tests/pr-check-set.test.cjs asserts the two sides PARTITION the directory, so
 * neither this runner nor the workflows can quietly stop covering a file.
 *
 * It deliberately does NOT run the whole directory. 73 files are already named by
 * a workflow, several of them in jobs that install browsers first; running them a
 * second time here would double that cost and make this step the slowest in CI
 * for no new answer.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const TESTS = path.join(ROOT, 'tests');
const WORKFLOWS = path.join(ROOT, '.github/workflows');
const IS_TEST = /\.(test|spec)\.(c|m)?js$/;

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

/** The files this runner is responsible for: in tests/, named by no workflow. */
export function unwired(testsDir = TESTS, workflowsDir = WORKFLOWS) {
  const onDisk = readdirSync(testsDir).filter((f) => IS_TEST.test(f)).sort();
  const { named, wholeDir } = workflowCoverage(workflowsDir);
  if (wholeDir) return { files: [], onDisk, named, wholeDir };
  return { files: onDisk.filter((f) => !named.has(f)), onDisk, named, wholeDir };
}

if (import.meta.filename === process.argv[1]) {
  const { files, onDisk, named, wholeDir } = unwired();
  console.log(`tests/ holds ${onDisk.length} test files; workflows name ${named.size}`
    + `${wholeDir ? ' and one runs the whole directory' : ''}.`);
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
