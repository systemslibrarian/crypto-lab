/* tools-sync lists only tools git TRACKS, which is right — work in progress is
 * not fleet machinery. The consequence was not right: a run made before
 * `git add` produced a README block missing that tool's row, and then `check`
 * compared the README against the same incomplete view and passed. The
 * generator agreed with itself and was wrong.
 *
 * Measured on crypto-lab#469: tools/pr-check-set.js was written, tools-sync was
 * run, tools-sync --check said "in step", the commit shipped a README that
 * omitted the tool, and CI failed on the next run once the file was tracked.
 *
 * These tests drive the real script against a real untracked file, because the
 * bug was precisely that the script's own opinion of itself was consistent.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const PROBE = path.join(ROOT, 'tools', 'zz-untracked-probe.js');
const PROBE_BODY = `#!/usr/bin/env node
/* zz-untracked-probe.js — fixture for tests/tools-sync-untracked.test.cjs.
 * Run: node tools/zz-untracked-probe.js
 * Prevents: nothing; it exists only while this test runs.
 * Reads: nothing.
 */
`;

/* spawnSync, not execFileSync: execFileSync returns stdout only, so a helper
   built on it reports an empty stderr on success -- and the warning this test is
   about goes to stderr on a SUCCESSFUL write. Caught by this test failing. */
function run(args) {
  const r = spawnSync('node', [path.join(ROOT, 'tools', 'tools-sync.js'), ...args],
    { cwd: ROOT, encoding: 'utf8' });
  return { code: r.status, stdout: String(r.stdout || ''), stderr: String(r.stderr || '') };
}

/** Is the probe untracked right now? The whole test rests on this. */
const isUntracked = () => execFileSync('git', ['status', '--porcelain', '--', 'tools/zz-untracked-probe.js'],
  { cwd: ROOT, encoding: 'utf8' }).startsWith('??');

test('check passes on a clean tree', () => {
  assert.ok(!fs.existsSync(PROBE), 'the probe must not be left behind by an earlier run');
  const r = run(['check']);
  assert.equal(r.code, 0, r.stderr);
  assert.match(r.stdout, /tools block in step with tools\//);
});

test('check FAILS when an untracked script sits under tools/', (t) => {
  fs.writeFileSync(PROBE, PROBE_BODY);
  t.after(() => { fs.rmSync(PROBE, { force: true }); });
  assert.ok(isUntracked(), 'the fixture must actually be untracked for this to mean anything');

  const r = run(['check']);
  assert.equal(r.code, 1,
    'an untracked tool makes the block incomplete, so checking it against the same view proves nothing');
  assert.match(r.stderr, /untracked script\(s\) under tools\//);
  assert.match(r.stderr, /zz-untracked-probe\.js/, 'it must name the file');
  assert.match(r.stderr, /git add tools\/zz-untracked-probe\.js/, 'and say how to fix it');
});

/* THE MUTATION, and it is the exact one: this is the behaviour before the fix.
   Without the guard, `check` passes while the README omits the tool — the
   generator validating an incomplete view against itself. */
test('MUTATION: without the untracked guard, check would pass on an incomplete block', (t) => {
  fs.writeFileSync(PROBE, PROBE_BODY);
  t.after(() => { fs.rmSync(PROBE, { force: true }); });

  const src = fs.readFileSync(path.join(ROOT, 'tools', 'tools-sync.js'), 'utf8');
  const stripped = src.replace(/\n  const \{ untracked \} = rows\(\);\n  if \(untracked\.length\) \{[\s\S]*?\n  \}\n/, '\n');
  assert.notEqual(stripped, src, 'the mutation must apply');
  assert.doesNotMatch(stripped, /untracked script\(s\) under tools\//, 'the guard is gone in the mutant');

  const mutant = path.join(ROOT, 'tools', 'zz-tools-sync-mutant.js');
  fs.writeFileSync(mutant, stripped);
  t.after(() => { fs.rmSync(mutant, { force: true }); });
  let code;
  try { execFileSync('node', [mutant, 'check'], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }); code = 0; }
  catch (e) { code = e.status; }

  /* The mutant sees two untracked files (the probe and itself) and still says
     the block is in step — which is the bug, reproduced. */
  assert.equal(code, 0, 'the unguarded version passes despite an incomplete block');
  const real = run(['check']);
  assert.equal(real.code, 1, 'the guarded version does not');
  assert.notEqual(code, real.code, 'if these ever agree the guard has stopped working');
});

test('write mode still writes, but says so loudly', (t) => {
  fs.writeFileSync(PROBE, PROBE_BODY);
  const before = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  t.after(() => {
    fs.rmSync(PROBE, { force: true });
    fs.writeFileSync(path.join(ROOT, 'README.md'), before);
  });
  const r = run([]);
  assert.equal(r.code, 0, 'refusing to write would leave no way to regenerate');
  assert.match(r.stderr, /::warning::/, 'but it must warn where a run log will show it');
  assert.match(r.stderr, /zz-untracked-probe\.js/);
});
