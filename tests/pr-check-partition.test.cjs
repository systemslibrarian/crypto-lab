/* Every test file in tests/ runs SOMEWHERE in CI, and nothing runs twice by accident.
 *
 * `npm test` derives its set from the directory. CI did not: on 2026-11-23, 28 of
 * 101 files in tests/ were named by no workflow at all, so they ran on a
 * workstation and nowhere else. tests/clone-currency.test.cjs is the one that
 * proved it costs something -- it pinned catalog-evidence's failing condition as a
 * literal, #536 added a term, CI reported 18 green checks, and main was red the
 * moment the suite ran locally.
 *
 * scripts/run-unwired-tests.mjs closes it by DERIVING its set rather than listing
 * it, so a new test file is covered from the first run. This test is what stops
 * that derivation from quietly covering nothing: it asserts the two sides --
 * what the workflows name, and what the runner picks up -- PARTITION the
 * directory. Nothing lost, and nothing in both.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const RUNNER = path.join(ROOT, 'scripts/run-unwired-tests.mjs');

/** The runner is ESM; ask it through node rather than require()ing it. */
function askRunner(testsDir, workflowsDir) {
  const script = `
    import { unwired } from ${JSON.stringify(RUNNER)};
    const r = unwired(${JSON.stringify(testsDir)}, ${JSON.stringify(workflowsDir)});
    process.stdout.write(JSON.stringify({ files: r.files, named: [...r.named], onDisk: r.onDisk, wholeDir: r.wholeDir }));
  `;
  return JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8' }));
}

test('workflow-named and runner-covered partition tests/ exactly', () => {
  const r = askRunner(path.join(ROOT, 'tests'), path.join(ROOT, '.github/workflows'));
  const namedInDir = r.named.filter((f) => r.onDisk.includes(f));
  const covered = [...new Set([...namedInDir, ...r.files])].sort();
  assert.deepEqual(covered, [...r.onDisk].sort(),
    'every test file must be named by a workflow or picked up by the unwired runner');
  const both = r.files.filter((f) => namedInDir.includes(f));
  assert.deepEqual(both, [], 'no file should be in both sets — that is wasted CI time, not safety');
});

test('a workflow naming no test file at all leaves every file to the runner', () => {
  /* The derivation must not depend on the workflows happening to name things. */
  const empty = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'wf-empty-'));
  fs.writeFileSync(path.join(empty, 'nothing.yml'), 'name: x\njobs: {}\n');
  const r = askRunner(path.join(ROOT, 'tests'), empty);
  assert.equal(r.files.length, r.onDisk.length, 'with no workflow coverage, the runner owns everything');
});

test('a workflow that runs the whole directory leaves the runner nothing', () => {
  /* And the opposite end: `node --test tests/` covers every file, so the runner
     must report an empty set rather than running all 101 a second time. */
  const dir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'wf-all-'));
  fs.writeFileSync(path.join(dir, 'all.yml'), 'jobs:\n  x:\n    steps:\n      - run: node --test tests/\n');
  const r = askRunner(path.join(ROOT, 'tests'), dir);
  assert.equal(r.wholeDir, true, 'a bare tests/ argument must be recognised as whole-directory coverage');
  assert.deepEqual(r.files, [], 'and leave the runner nothing to do');
});

test('a flag between --test and tests/ is still whole-directory coverage', () => {
  /* learning-games.yml writes `node --test --test-timeout=180000 tests/<file>`, so
     the flag form is real and the recogniser must not be fooled by it. */
  const dir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'wf-flag-'));
  fs.writeFileSync(path.join(dir, 'all.yml'),
    'jobs:\n  x:\n    steps:\n      - run: node --test --test-timeout=180000 tests/\n');
  const r = askRunner(path.join(ROOT, 'tests'), dir);
  assert.equal(r.wholeDir, true);
});

test('naming one file covers that file and nothing else', () => {
  const dir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'wf-one-'));
  fs.writeFileSync(path.join(dir, 'one.yml'),
    'jobs:\n  x:\n    steps:\n      - run: node --test tests/clone-currency.test.cjs\n');
  const r = askRunner(path.join(ROOT, 'tests'), dir);
  assert.ok(r.named.includes('clone-currency.test.cjs'), 'the named file is recognised');
  assert.ok(!r.files.includes('clone-currency.test.cjs'), 'and is not left to the runner');
  assert.ok(r.files.length === r.onDisk.length - 1, 'everything else still is');
});

test('a workflow step runs the unwired runner, or the derivation is dead code', () => {
  const wfDir = path.join(ROOT, '.github/workflows');
  const runs = fs.readdirSync(wfDir)
    .filter((f) => /\.ya?ml$/.test(f))
    .some((f) => fs.readFileSync(path.join(wfDir, f), 'utf8').includes('run-unwired-tests.mjs'));
  assert.ok(runs, 'some workflow must invoke scripts/run-unwired-tests.mjs');
});

test('npm test and this runner read the same directory with the same filename rule', () => {
  /* Asserted as a PROPERTY, not as a literal line. Pinning the exact expression
     is the brittleness that put main red on 2026-11-23: a test held
     catalog-evidence's exit condition as one literal regex and broke the moment a
     term was added. So: both must read a directory, and both must select files by
     the same rule — whatever they call their variables. */
  const npmRunner = fs.readFileSync(path.join(ROOT, 'scripts/run-tests.mjs'), 'utf8');
  const unwiredRunner = fs.readFileSync(RUNNER, 'utf8');
  const ruleOf = (src) => {
    const m = /\/\\\.\(test\|spec\)\\\.\(c\|m\)\?js\$\//.exec(src);
    return m ? m[0] : null;
  };
  for (const [name, src] of [['run-tests.mjs', npmRunner], ['run-unwired-tests.mjs', unwiredRunner]]) {
    assert.match(src, /readdirSync\(/, `${name} must derive its set from a directory read`);
    assert.ok(ruleOf(src), `${name} must select test files by the shared filename rule`);
  }
  assert.equal(ruleOf(npmRunner), ruleOf(unwiredRunner),
    'and the two rules must be identical, or one runner silently owns files the other skips');
});
