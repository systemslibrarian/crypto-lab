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
    process.stdout.write(JSON.stringify({ files: r.files, named: [...r.named], onDisk: r.onDisk,
      wholeDir: r.wholeDir, cloneNeeded: r.cloneNeeded }));
  `;
  return JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8' }));
}

test('every test file is run by exactly one of the three routes', () => {
  /* THREE routes now, not two: named by a workflow, picked up by the unwired
     runner, or declared clone-required and run by the weekly job. The third
     exists so tests/source-root-census.test.cjs can keep refusing when it cannot
     see the clones -- that refusal is correct -- while still being RUN somewhere.
     Asserting a partition is what makes it routing: a file that appeared on the
     declared list and nowhere else would be dropped, and this fails on it. */
  const r = askRunner(path.join(ROOT, 'tests'), path.join(ROOT, '.github/workflows'));
  const namedInDir = r.named.filter((f) => r.onDisk.includes(f));
  const routes = { named: namedInDir, unwired: r.files, cloneRequired: r.cloneNeeded };
  const covered = [...new Set([...routes.named, ...routes.unwired, ...routes.cloneRequired])].sort();
  assert.deepEqual(covered, [...r.onDisk].sort(),
    'every test file must be named by a workflow, picked up by the unwired runner, or declared clone-required');
  for (const [a, b] of [['named', 'unwired'], ['named', 'cloneRequired'], ['unwired', 'cloneRequired']]) {
    const both = routes[a].filter((f) => routes[b].includes(f));
    assert.deepEqual(both, [], `a file in both ${a} and ${b} is wasted CI time, not safety`);
  }
});

test('every declared clone-required entry carries a non-empty reason', () => {
  /* The declaration is the exemption, so an entry without a reason is an
     exemption nobody argued for. tools/clone-holds.json is held to the same rule. */
  const decl = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/clone-required.json'), 'utf8'));
  assert.ok(Array.isArray(decl.files), 'the declaration must carry a files array');
  assert.ok(typeof decl.why === 'string' && decl.why.trim().length > 80,
    'and say why the list exists at all');
  for (const e of decl.files) {
    assert.ok(e.file && /^tests\/[A-Za-z0-9._-]+\.(test|spec)\.(c|m)?js$/.test(e.file),
      `malformed file path: ${JSON.stringify(e.file)}`);
    assert.ok(fs.existsSync(path.join(ROOT, e.file)), `${e.file} is declared but does not exist`);
    assert.ok(typeof e.reason === 'string' && e.reason.trim().length > 40,
      `${e.file} needs a reason, not a placeholder`);
  }
});

test('the runner REFUSES a declared entry with no reason, rather than routing it silently', () => {
  /* A reason-less entry must not simply be honoured. Checked against a fixture
     directory, so the live declaration is never written to. */
  const os = require('node:os');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cr-bad-'));
  fs.writeFileSync(path.join(dir, 'clone-required.json'),
    JSON.stringify({ why: 'x'.repeat(100), files: [{ file: 'tests/a.test.cjs' }] }));
  fs.writeFileSync(path.join(dir, 'a.test.cjs'), '');
  const script = `
    import { cloneRequired } from ${JSON.stringify(RUNNER)};
    try { cloneRequired(${JSON.stringify(dir)}); process.stdout.write('NO-THROW'); }
    catch (e) { process.stdout.write('THREW: ' + e.message); }
  `;
  const out = execFileSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8' });
  assert.match(out, /^THREW:/, 'an entry with no reason must throw, not be routed');
  assert.match(out, /has no reason/);
});

test('the weekly job runs what the declaration holds, resolved rather than text-matched', () => {
  /* Checked by WHAT IT DOES, the lesson from #540: a test that pinned a literal
     broke the moment a term was added to the thing it described. So the step's
     own command is extracted and EXECUTED, and its output compared with the
     declaration. A step that named the file by hand would pass a text match and
     fail this. */
  const fleet = fs.readFileSync(path.join(ROOT, '.github/workflows/fleet.yml'), 'utf8');
  const step = /- name: Test files that need the clones\n([\s\S]*?)\n      - name:/.exec(fleet);
  assert.ok(step, 'the weekly job must have a step for the clone-required files');
  const body = step[1];

  const listCmd = /(node scripts\/run-unwired-tests\.mjs --list-clone-required)/.exec(body);
  assert.ok(listCmd, 'the step must obtain its list by running the runner, not by naming files');
  const produced = execFileSync('node', ['scripts/run-unwired-tests.mjs', '--list-clone-required'],
    { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').filter(Boolean).sort();
  const declared = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/clone-required.json'), 'utf8'))
    .files.map((e) => e.file).sort();
  assert.deepEqual(produced, declared,
    'the command the step runs must produce exactly the declared list');

  assert.match(body, /node --test "\$\{FILES\[@\]\}"/,
    'and must pass that list to node --test as an array, so a path with a space cannot split');
  /* No test filename may be written into the workflow by hand. */
  const handNamed = [...body.matchAll(/tests\/[A-Za-z0-9._-]+\.(?:test|spec)\.(?:c|m)?js/g)]
    .map((m) => m[0])
    .filter((p) => !/^tests\/(?:clone-required\.json|pr-check-partition)/.test(p));
  assert.deepEqual(handNamed, [],
    'the workflow must not name a test file itself — two lists is how the second reader misses the first');
});

test('a workflow naming no test file at all leaves every file to the runner', () => {
  /* The derivation must not depend on the workflows happening to name things. */
  const empty = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'wf-empty-'));
  fs.writeFileSync(path.join(empty, 'nothing.yml'), 'name: x\njobs: {}\n');
  const r = askRunner(path.join(ROOT, 'tests'), empty);
  assert.equal(r.files.length, r.onDisk.length - r.cloneNeeded.length,
    'with no workflow coverage the runner owns everything EXCEPT the declared clone-required files,'
    + ' which are routed to the weekly job rather than dropped');
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
  assert.equal(r.files.length, r.onDisk.length - 1 - r.cloneNeeded.length,
    'everything else is the runner\'s, less the declared clone-required files');
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
