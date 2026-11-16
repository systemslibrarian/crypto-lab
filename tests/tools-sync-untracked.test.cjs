/* tools-sync lists only tools git TRACKS, and it must ENUMERATE them from git
 * rather than from the directory. Those are different claims, and the second one
 * is what this file is mostly about now.
 *
 * The original defect, crypto-lab#469: a run made before `git add` produced a
 * README block missing that tool's row, and `check` compared the README against
 * the same incomplete view and passed. The generator agreed with itself and was
 * wrong. The guard added then made `check` FAIL on any untracked script.
 *
 * That guard then produced a second defect of its own. tools/majors-sync.js is
 * parked work in progress, gitignored on purpose since 2026-08, and it can never
 * become tracked. readdirSync saw it, so `check` failed locally and passed in CI
 * -- CI checks out tracked files only -- and the remedy it printed was `git add`
 * on a file .gitignore exists to keep out. A permanently red check with an
 * unactionable remedy teaches people to ignore red.
 *
 * So the contract is now:
 *   - enumeration comes from `git ls-files`, so a GITIGNORED file is invisible
 *     to both modes, in both places;
 *   - an untracked-but-not-ignored script does not fail `check`, because CI can
 *     never reproduce that failure -- it cannot see the file either;
 *   - write mode still warns about one, which is where #469 actually happens;
 *   - a TRACKED tool missing from the block still fails, which is the guard that
 *     was always doing the real work.
 *
 * These tests drive the real script, because the bug was precisely that the
 * script's own opinion of itself was consistent.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const PROBE = path.join(ROOT, 'tools', 'zz-untracked-probe.js');
const IGNORED = path.join(ROOT, 'tools', 'zz-ignored-probe.js');
const EXCLUDE = path.join(ROOT, '.git', 'info', 'exclude');
const BODY = `#!/usr/bin/env node
/* fixture for tests/tools-sync-untracked.test.cjs.
 * Run: node tools/zz-probe.js
 * Prevents: nothing; it exists only while this test runs.
 * Reads: nothing.
 */
`;

/* spawnSync, not execFileSync: execFileSync returns stdout only, so a helper
   built on it reports an empty stderr on success -- and the warning these tests
   are about goes to stderr on a SUCCESSFUL write. */
function run(args) {
  const r = spawnSync('node', [path.join(ROOT, 'tools', 'tools-sync.js'), ...args],
    { cwd: ROOT, encoding: 'utf8' });
  return { code: r.status, stdout: String(r.stdout || ''), stderr: String(r.stderr || '') };
}

const gitState = (rel) => execFileSync('git', ['status', '--porcelain', '--ignored', '--', rel],
  { cwd: ROOT, encoding: 'utf8' }).slice(0, 2);

/* Ignored through .git/info/exclude rather than .gitignore: the fixture must be
   genuinely ignored for the test to mean anything, and no committed file should
   change to arrange that. --exclude-standard honours this file the same way. */
function withIgnoredProbe(t) {
  const had = fs.existsSync(EXCLUDE) ? fs.readFileSync(EXCLUDE, 'utf8') : null;
  fs.mkdirSync(path.dirname(EXCLUDE), { recursive: true });
  fs.writeFileSync(EXCLUDE, (had || '') + '\ntools/zz-ignored-probe.js\n');
  fs.writeFileSync(IGNORED, BODY);
  t.after(() => {
    fs.rmSync(IGNORED, { force: true });
    if (had === null) fs.rmSync(EXCLUDE, { force: true });
    else fs.writeFileSync(EXCLUDE, had);
  });
  assert.equal(gitState('tools/zz-ignored-probe.js'), '!!', 'the fixture must actually be ignored');
}

test('check passes on a clean tree', () => {
  assert.ok(!fs.existsSync(PROBE), 'the probe must not be left behind by an earlier run');
  const r = run(['check']);
  assert.equal(r.code, 0, r.stderr);
  assert.match(r.stdout, /tools block in step with tools\//);
});

test('a GITIGNORED script is invisible to check and to write', (t) => {
  withIgnoredProbe(t);
  const c = run(['check']);
  assert.equal(c.code, 0, 'a parked, gitignored file must not redden a check CI cannot reproduce');
  assert.doesNotMatch(c.stdout + c.stderr, /zz-ignored-probe/, 'and must not be named');
  const before = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  t.after(() => fs.writeFileSync(path.join(ROOT, 'README.md'), before));
  const w = run([]);
  assert.equal(w.code, 0);
  assert.doesNotMatch(w.stderr, /zz-ignored-probe/, 'write mode must not nag about a deliberately parked file');
});

test('an untracked NEW script is ignored by check, but write mode warns', (t) => {
  fs.writeFileSync(PROBE, BODY);
  const before = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  t.after(() => {
    fs.rmSync(PROBE, { force: true });
    fs.writeFileSync(path.join(ROOT, 'README.md'), before);
  });
  assert.equal(gitState('tools/zz-untracked-probe.js'), '??', 'the fixture must be untracked and not ignored');

  const c = run(['check']);
  assert.equal(c.code, 0, 'CI cannot see an untracked file, so check must not fail where CI would pass');
  assert.doesNotMatch(fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8'), /zz-untracked-probe/,
    'and it earns no row in the block');

  /* #469's signal is kept where #469 happens: the moment someone regenerates. */
  const w = run([]);
  assert.equal(w.code, 0, 'refusing to write would leave no way to regenerate');
  assert.match(w.stderr, /::warning::/, 'but write mode must warn where a run log will show it');
  assert.match(w.stderr, /zz-untracked-probe\.js/, 'and name the file');
});

test('a TRACKED tool missing from the block still fails check', (t) => {
  const readme = path.join(ROOT, 'README.md');
  const before = fs.readFileSync(readme, 'utf8');
  t.after(() => fs.writeFileSync(readme, before));
  const row = /\n\| `node tools\/port-sync\.js check`[^\n]*/.exec(before);
  assert.ok(row, 'the fixture row must exist to be removed');
  fs.writeFileSync(readme, before.slice(0, row.index) + before.slice(row.index + row[0].length));

  const r = run(['check']);
  assert.equal(r.code, 1, 'a tracked tool with no row is the guard that does the real work');
  assert.match(r.stdout + r.stderr, /OUT OF DATE/);
});

/* THE MUTATION, and it is the one the fix turns on: enumerate from the directory
   instead of from git, and a gitignored file becomes visible again -- which is
   the local-versus-CI divergence returning. */
test('MUTATION: enumerating from the directory makes an ignored file visible again', (t) => {
  withIgnoredProbe(t);
  const src = fs.readFileSync(path.join(ROOT, 'tools', 'tools-sync.js'), 'utf8');
  const stripped = src
    .replace('const files = [...keep].filter((f) => SCRIPT.test(f)).sort();',
      'const files = fs.readdirSync(TOOLS).filter((f) => SCRIPT.test(f)).filter((f) => keep.has(f)).sort();')
    .replace('return { listed, notRun, untracked: untrackedNotIgnored() };',
      'return { listed, notRun, untracked: fs.readdirSync(TOOLS).filter((f) => SCRIPT.test(f) && !keep.has(f)).sort() };');
  assert.notEqual(stripped, src, 'the mutation must apply');

  const mutant = path.join(ROOT, 'tools', 'zz-tools-sync-mutant.js');
  fs.writeFileSync(mutant, stripped);
  t.after(() => fs.rmSync(mutant, { force: true }));
  const m = spawnSync('node', [mutant], { cwd: ROOT, encoding: 'utf8' });
  const readme = path.join(ROOT, 'README.md');
  const before = fs.readFileSync(readme, 'utf8');
  t.after(() => fs.writeFileSync(readme, before));

  assert.match(String(m.stderr || ''), /zz-ignored-probe/,
    'the mutant names the parked file, which is the defect this fix removes');
  const real = run([]);
  assert.doesNotMatch(real.stderr, /zz-ignored-probe/, 'the real one does not');
});
