/* tools-sync lists only tools git TRACKS, and it must ENUMERATE them from git
 * rather than from the directory.
 *
 * crypto-lab#469: a run made before `git add` produced a README block missing
 * that tool's row, and `check` compared the README against the same incomplete
 * view and passed. The generator agreed with itself and was wrong. The guard
 * added then made `check` FAIL on any untracked script.
 *
 * That guard produced a second defect. tools/majors-sync.js is parked work in
 * progress, gitignored on purpose, and can never become tracked. readdirSync
 * saw it, so `check` failed locally and passed in CI -- CI checks out tracked
 * files only -- and the remedy printed was `git add` on a file .gitignore
 * exists to keep out. A permanently red check with an unactionable remedy
 * teaches people to ignore red.
 *
 * The contract:
 *   - enumeration comes from `git ls-files`, so a GITIGNORED file is invisible
 *     to both modes, in both places;
 *   - an untracked-but-not-ignored script does not fail `check`, because CI can
 *     never reproduce that failure -- it cannot see the file either;
 *   - write mode still warns about one, which is where #469 actually happens;
 *   - a TRACKED tool missing from the block still fails.
 *
 * These controls run against a FIXTURE repository, never this one. The first
 * version drove the real tools/ and rewrote the real README.md, which made the
 * repository working tree shared mutable state: node:test runs test FILES in
 * parallel processes, so while this file had README.md part-written, another
 * file's test could read it and fail on something unrelated. It also wrote
 * .git/info/exclude, which cannot work in a git WORKTREE at all -- there .git
 * is a FILE, so mkdir of .git/info is ENOTDIR, and a worktree is how this
 * repository says to do lane work.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const SYNC = path.join(ROOT, 'tools', 'tools-sync.js');

/* The markers are read out of the generator itself rather than copied, so a
   change to their wording cannot leave this fixture quietly untestable. */
function markers() {
  const src = fs.readFileSync(SYNC, 'utf8');
  const grab = (name) => {
    const m = new RegExp(`const ${name} = '((?:[^'\\\\]|\\\\.)*)'`).exec(src);
    assert.ok(m, `tools-sync.js must still define ${name}`);
    return m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  };
  return { BEGIN: grab('BEGIN'), END: grab('END') };
}

const tool = (name, prevents) => `#!/usr/bin/env node
/* ${name} — fixture tool.
 * Run: node tools/${name}
 * Prevents: ${prevents}
 * Reads: nothing; it is a fixture
 */
`;

/** A self-contained repository with its own tools/, README and .gitignore. */
function fixture(t, { ignored = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tools-sync-fixture-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const { BEGIN, END } = markers();

  fs.mkdirSync(path.join(dir, 'tools'), { recursive: true });
  fs.mkdirSync(path.join(dir, '.github', 'workflows'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'tools', 'alpha-sync.js'), tool('alpha-sync.js', 'alpha drifting'));
  fs.writeFileSync(path.join(dir, 'tools', 'beta-sync.js'), tool('beta-sync.js', 'beta drifting'));
  fs.writeFileSync(path.join(dir, '.github', 'workflows', 'ci.yml'),
    'name: ci\non:\n  pull_request:\njobs:\n  check:\n    runs-on: ubuntu-latest\n'
    + '    steps:\n      - run: node tools/alpha-sync.js\n');
  fs.writeFileSync(path.join(dir, 'README.md'), `# Fixture\n\n${BEGIN}\n${END}\n`);
  if (ignored) fs.writeFileSync(path.join(dir, '.gitignore'), 'tools/parked-sync.js\n');

  const git = (...a) => execFileSync('git', a, { cwd: dir, stdio: 'pipe' });
  git('init', '-q', '-b', 'main');
  git('-c', 'user.email=t@t', '-c', 'user.name=t', 'add', '.');
  git('-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'fixture');
  run(dir, []);                       // fill the block from the tracked tools
  return dir;
}

function run(dir, args) {
  const r = spawnSync('node', [SYNC, ...args], {
    cwd: dir, encoding: 'utf8', env: { ...process.env, CRYPTO_LAB_TOOLS_ROOT: dir },
  });
  return { code: r.status, out: String(r.stdout || ''), err: String(r.stderr || '') };
}

const state = (dir, rel) =>
  execFileSync('git', ['status', '--porcelain', '--ignored', '--', rel], { cwd: dir, encoding: 'utf8' }).slice(0, 2);

test('the fixture starts in step', (t) => {
  const dir = fixture(t);
  const r = run(dir, ['check']);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /tools block in step with tools\//);
  assert.match(fs.readFileSync(path.join(dir, 'README.md'), 'utf8'), /alpha-sync\.js/,
    'the tracked tools must actually be listed, or nothing below compares anything');
});

test('a GITIGNORED script is invisible to check and to write', (t) => {
  const dir = fixture(t, { ignored: true });
  fs.writeFileSync(path.join(dir, 'tools', 'parked-sync.js'), tool('parked-sync.js', 'nothing; it is parked'));
  assert.equal(state(dir, 'tools/parked-sync.js'), '!!', 'the fixture must actually be ignored');

  const c = run(dir, ['check']);
  assert.equal(c.code, 0, 'a parked, gitignored file must not redden a check CI cannot reproduce');
  assert.doesNotMatch(c.out + c.err, /parked-sync/, 'and must not be named');
  const w = run(dir, []);
  assert.equal(w.code, 0);
  assert.doesNotMatch(w.err, /parked-sync/, 'write mode must not nag about a deliberately parked file');
});

test('an untracked NEW script is ignored by check, but write mode warns', (t) => {
  const dir = fixture(t);
  fs.writeFileSync(path.join(dir, 'tools', 'fresh-sync.js'), tool('fresh-sync.js', 'nothing yet'));
  assert.equal(state(dir, 'tools/fresh-sync.js'), '??', 'the fixture must be untracked and not ignored');

  const c = run(dir, ['check']);
  assert.equal(c.code, 0, 'CI cannot see an untracked file, so check must not fail where CI would pass');
  assert.doesNotMatch(fs.readFileSync(path.join(dir, 'README.md'), 'utf8'), /fresh-sync/,
    'and it earns no row in the block');

  /* #469's signal is kept where #469 happens: the moment someone regenerates. */
  const w = run(dir, []);
  assert.equal(w.code, 0, 'refusing to write would leave no way to regenerate');
  assert.match(w.err, /::warning::/, 'but write mode must warn where a run log will show it');
  assert.match(w.err, /fresh-sync\.js/, 'and name the file');
});

test('a TRACKED tool missing from the block still fails check', (t) => {
  const dir = fixture(t);
  const readme = path.join(dir, 'README.md');
  const before = fs.readFileSync(readme, 'utf8');
  const row = /\n\|[^\n]*beta-sync\.js[^\n]*/.exec(before);
  assert.ok(row, 'the fixture row must exist to be removed');
  fs.writeFileSync(readme, before.slice(0, row.index) + before.slice(row.index + row[0].length));

  const r = run(dir, ['check']);
  assert.equal(r.code, 1, 'a tracked tool with no row is the guard that does the real work');
  assert.match(r.out + r.err, /OUT OF DATE/);
});

test('nested fixture scripts are not flattened into top-level tools', (t) => {
  const dir = fixture(t);
  const nested = path.join(dir, 'tools', 'fixtures', 'sample');
  fs.mkdirSync(nested, { recursive: true });
  fs.writeFileSync(path.join(nested, 'playwright.config.mjs'), 'export default {};\n');
  fs.writeFileSync(path.join(nested, 'alpha-sync.js'), 'throw new Error("fixture only");\n');
  execFileSync('git', ['add', 'tools/fixtures'], { cwd: dir });
  fs.writeFileSync(path.join(nested, 'untracked-fixture.js'), 'export default {};\n');
  const before = fs.readFileSync(path.join(dir, 'README.md'), 'utf8');
  for (const args of [['check'], []]) {
    const result = run(dir, args);
    assert.equal(result.code, 0, result.err);
    assert.doesNotMatch(result.out + result.err, /playwright\.config|untracked-fixture/);
  }
  assert.equal(fs.readFileSync(path.join(dir, 'README.md'), 'utf8'), before);
});

/* THE MUTATION: enumerate from the directory instead of from git, and a
   gitignored file becomes visible again -- the local-versus-CI divergence
   returning. */
test('MUTATION: enumerating from the directory makes an ignored file visible again', (t) => {
  const dir = fixture(t, { ignored: true });
  fs.writeFileSync(path.join(dir, 'tools', 'parked-sync.js'), tool('parked-sync.js', 'nothing; it is parked'));

  const src = fs.readFileSync(SYNC, 'utf8');
  const stripped = src
    .replace('const files = [...keep].filter((f) => SCRIPT.test(f)).sort();',
      'const files = fs.readdirSync(TOOLS).filter((f) => SCRIPT.test(f)).filter((f) => keep.has(f)).sort();')
    .replace('return { listed, notRun, untracked: untrackedNotIgnored() };',
      'return { listed, notRun, untracked: fs.readdirSync(TOOLS).filter((f) => SCRIPT.test(f) && !keep.has(f)).sort() };');
  assert.notEqual(stripped, src, 'the mutation must apply');

  /* Outside the fixture's tools/, so the mutant is not itself an untracked
     script the run would report, and with its one relative require pointed at
     the real module -- copying tools/ into the fixture would change the very
     enumeration under test. */
  const mutant = path.join(dir, 'zz-mutant.js');
  fs.writeFileSync(mutant, stripped.replace(
    "require('./three-way.js')",
    JSON.stringify(path.join(ROOT, 'tools', 'three-way.js')).replace(/^/, 'require(').replace(/$/, ')')));
  const m = spawnSync('node', [mutant], {
    cwd: dir, encoding: 'utf8', env: { ...process.env, CRYPTO_LAB_TOOLS_ROOT: dir },
  });
  assert.match(String(m.stderr || ''), /parked-sync/,
    'the mutant names the parked file, which is the defect this fix removes');
  assert.doesNotMatch(run(dir, []).err, /parked-sync/, 'the real one does not');
});
