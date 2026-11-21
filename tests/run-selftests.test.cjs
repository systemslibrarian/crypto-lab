/**
 * `npm run selftest`, and the one property that nearly was not true.
 *
 * The runner derives its set from the tools rather than from a written list, so a
 * checker that grows a selftest is picked up without anyone remembering. The
 * first version of that derivation matched only `=== 'selftest'`, with single
 * quotes. All ten live tools happen to be written that way, so the real set was
 * complete and nothing would ever have shown the gap: a tool written
 * `=== "selftest"` was simply absent, and a DELIBERATELY FAILING one produced a
 * clean exit 0. The negative control caught it, which is the whole argument for
 * running one.
 *
 * So the quote shapes are pinned here, and so is the thing the owner asked for
 * and the thing they asked not to happen: it must exit non-zero when a command
 * fails, and `npm test` must NOT call it.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const RUNNER = fs.readFileSync(path.join(ROOT, 'scripts/run-selftests.mjs'), 'utf8');
const PKG = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

/** The runner's own detector, lifted verbatim so the test cannot drift from it. */
function detector() {
  const m = RUNNER.match(/return (\/===[^;]*?\/)\.test\(src\);/);
  assert.ok(m, 'the selftest detector must be a single regexp literal this test can lift');
  // eslint-disable-next-line no-eval
  return eval(m[1]);
}

test('the script exists and npm exposes it as `selftest`', () => {
  assert.equal(PKG.scripts.selftest, 'node scripts/run-selftests.mjs');
});

test('it is NOT wired into npm test, by instruction', () => {
  /* "Don't wire it into npm test or pre-push yet." Pinned, because the natural
     next edit is to fold it in and that is the owner's call, not a tidy-up. */
  assert.equal(PKG.scripts.test, 'node scripts/run-tests.mjs');
  const runTests = fs.readFileSync(path.join(ROOT, 'scripts/run-tests.mjs'), 'utf8');
  assert.ok(!/run-selftests/.test(runTests), 'npm test must not call the selftest runner');
  assert.ok(!/selftest/.test(PKG.scripts.test));
});

test('the detector accepts both quote shapes and a backtick', () => {
  const re = detector();
  for (const q of ["'", '"', '`']) {
    assert.ok(re.test(`if (process.argv[2] === ${q}selftest${q}) run();`), `${q} must be accepted`);
    assert.ok(re.test(`if (mode === ${q}selftest${q}) process.exit(selftest());`), `${q}, mode form`);
  }
});

test('the detector does NOT credit a tool that merely mentions a selftest', () => {
  const re = detector();
  assert.ok(!re.test("// run tools/gate-sync.js selftest after changing this"));
  assert.ok(!re.test("console.log('see gate-sync selftest for the fixtures');"));
  assert.ok(!re.test("const SELFTESTS = ['selftest'];"), 'a list of the word is not a mode');
});

test('comments are stripped before the detector runs', () => {
  assert.match(RUNNER, /replace\(\/\\\/\\\*\[\\s\\S\]\*\?\\\*\\\/\/g, ''\)/,
    'block comments must be removed, or a tool discussing another is credited');
  assert.match(RUNNER, /startsWith\('\/\/'\)/);
});

test('the set is derived from tracked files, and a read failure is not an empty set', () => {
  assert.match(RUNNER, /ls-files', '--', 'tools'/, 'untracked or parked tools must not join the set');
  assert.match(RUNNER, /That is a read failure, not an empty set/);
});

test('a near-empty derivation is refused rather than reported clean', () => {
  /* An empty result is a claim about every tool, and this repository's own
     lesson is that a sweep coming back near-empty is the thing to distrust. */
  assert.match(RUNNER, /jsTools\.length < 5/);
  assert.match(RUNNER, /refusing to report a/i);
});

test('every command runs even after one fails', () => {
  /* fleet-check.js's rule, for its recorded reason: one failure must not hide
     the other ten. */
  const loop = RUNNER.slice(RUNNER.indexOf('for (const c of commands)'), RUNNER.indexOf('const failed ='));
  assert.ok(!/break|return|process\.exit/.test(loop), 'nothing may stop the loop early');
  assert.match(RUNNER, /process\.exit\(failed\.length \? 1 : 0\)/);
});

test('an absent interpreter or script is a could-not-run, never a pass', () => {
  assert.match(RUNNER, /could-not-run/);
  assert.match(RUNNER, /ok: !r\.error && r\.status === 0/);
});

test('it names the selftests no workflow runs', () => {
  /* api-budget.js today. A selftest nothing runs is the same as no selftest, and
     the count printed must not read as CI coverage. */
  assert.match(RUNNER, /NOT RUN BY ANY WORKFLOW/);
  assert.match(RUNNER, /node \(tools\\\/\[\\w\.-\]\+\\\.js\) selftest/);
});

test('the adjacent self-checks it leaves out are named, so the absence is a statement', () => {
  for (const f of ['evidence-shape-proof', 'clone-guard-proof', 'dispatch-proof', 'dispatch-mutations']) {
    assert.ok(RUNNER.includes(f), `${f} must be named as out of scope`);
  }
});

test('END TO END: it runs the real set and passes', () => {
  /* The real run, not a fixture. ~5 seconds, which is why it can be a test. */
  const r = spawnSync(process.execPath, ['scripts/run-selftests.mjs'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const m = r.stdout.match(/(\d+) of (\d+) passed in/);
  assert.ok(m, 'the run must report its own counts');
  assert.equal(m[1], m[2], 'all of them must pass');
  assert.ok(Number(m[2]) >= 10, `expected at least 10 commands, got ${m[2]}`);
});
