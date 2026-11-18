/**
 * The census that would have caught two finished labs sitting unpushed.
 *
 * Every case below is built as a REAL git repository in a temporary directory
 * and driven through the real `git`, because the states this checker exists to
 * find are states of git's own bookkeeping -- a branch.upstream line with no
 * branch.ab beside it, a remote with no refs -- and a hand-written fixture of
 * that bookkeeping would be a fixture of my belief about it. Two of them
 * reproduce the incident exactly: a clone with NO remote at all
 * (crypto-lab-pseudorandom-code) and a clone whose tracked branch was deleted
 * on the remote (crypto-lab-cold-boot, which read [origin/main: gone]).
 *
 * The control that matters most is the LAST one. A checker that reported
 * everything would have "caught" the incident too, and would be worthless on a
 * machine holding 406 work trees: 34 of them legitimately track a branch a
 * finished round deleted. So a fully pushed clone, and a gone upstream over a
 * fully merged branch, must BOTH come back clean -- that is what makes a
 * finding mean something.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const CENSUS = path.join(__dirname, '..', 'tools', 'unpushed-census.js');

function git(dir, ...args) {
  return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

/* A fixture root that becomes the checker's ~/repos via CRYPTO_LAB_REPOS_ROOT.
   Local commits only: no test here may touch a network or the real fleet. */
function freshRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'unpushed-census-'));
  return root;
}

function makeOrigin(root, name) {
  const bare = path.join(root, `${name}.git`);
  fs.mkdirSync(bare, { recursive: true });
  execFileSync('git', ['init', '--bare', '-b', 'main', bare], { stdio: 'ignore' });
  return bare;
}

function makeClone(root, name, { origin = null, commits = 1 } = {}) {
  const dir = path.join(root, name);
  fs.mkdirSync(dir, { recursive: true });
  execFileSync('git', ['init', '-b', 'main', dir], { stdio: 'ignore' });
  git(dir, 'config', 'user.email', 'test@example.invalid');
  git(dir, 'config', 'user.name', 'Census Control');
  git(dir, 'config', 'commit.gpgsign', 'false');
  for (let i = 0; i < commits; i += 1) {
    fs.writeFileSync(path.join(dir, `f${i}.txt`), `body ${i}\n`);
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', `commit ${i}`);
  }
  if (origin) git(dir, 'remote', 'add', 'origin', origin);
  return dir;
}

function census(root) {
  const out = execFileSync(process.execPath, [CENSUS, 'report'], {
    encoding: 'utf8',
    env: { ...process.env, CRYPTO_LAB_REPOS_ROOT: root },
  });
  return out;
}

// Findings for one slug, as "KIND" strings, so a test asserts on the kinds
// rather than on the exact sentence.
function kindsFor(output, slug) {
  const kinds = [];
  let current = null;
  for (const line of output.split('\n')) {
    const m = line.match(/^([A-Z][A-Z ]+) \(\d+\)$/);
    if (m) { current = m[1]; continue; }
    if (current && new RegExp(`^\\s+${slug}\\s`).test(line)) kinds.push(current);
  }
  return kinds;
}

test('a clone with NO remote is reported, with the count of commits that are only there', () => {
  const root = freshRoot();
  makeClone(root, 'crypto-lab-pseudorandom-code', { origin: null, commits: 3 });
  const out = census(root);
  assert.deepEqual(kindsFor(out, 'crypto-lab-pseudorandom-code'), ['NO REMOTE']);
  // The number is the point: 3 commits exist here and on no remote.
  assert.match(out, /crypto-lab-pseudorandom-code\s+no remote configured; 3 commit\(s\) on no remote/);
});

test('an upstream that is [gone] over unpushed work is reported as holding commits', () => {
  const root = freshRoot();
  const bare = makeOrigin(root, 'cold-boot-origin');
  const dir = makeClone(root, 'crypto-lab-cold-boot', { origin: bare, commits: 1 });
  git(dir, 'push', '-q', '-u', 'origin', 'main');
  // Two more commits here, then the branch is deleted on the remote: exactly
  // the state cold-boot was in, where `git pull --ff-only` has nothing to say.
  fs.writeFileSync(path.join(dir, 'later.txt'), 'later\n');
  git(dir, 'add', '-A');
  git(dir, 'commit', '-q', '-m', 'work that never left');
  execFileSync('git', ['-C', bare, 'update-ref', '-d', 'refs/heads/main'], { stdio: 'ignore' });
  git(dir, 'fetch', '-q', '--prune', 'origin');

  const out = census(root);
  const kinds = kindsFor(out, 'crypto-lab-cold-boot');
  assert.ok(kinds.includes('UPSTREAM GONE'), `expected UPSTREAM GONE, got ${kinds.join(',')}`);
  assert.match(out, /crypto-lab-cold-boot[^\n]*which no longer exists; 2 commit\(s\) on no remote/);
});

test('a branch tracking nothing is reported, and separately from a gone upstream', () => {
  const root = freshRoot();
  const bare = makeOrigin(root, 'no-upstream-origin');
  const dir = makeClone(root, 'crypto-lab-no-upstream', { origin: bare, commits: 2 });
  // A remote exists and the branch has never been told about it.
  const out = census(root);
  assert.deepEqual(kindsFor(out, 'crypto-lab-no-upstream'), ['NO UPSTREAM']);
  assert.match(out, /crypto-lab-no-upstream\s+main tracks nothing; 2 commit\(s\) on no remote/);
  assert.equal(git(dir, 'rev-parse', '--abbrev-ref', 'HEAD'), 'main');
});

test('an EMPTY remote is found only under --fetch, which is the whole reason that mode exists', () => {
  const root = freshRoot();
  const bare = makeOrigin(root, 'empty-origin');
  makeClone(root, 'crypto-lab-empty-remote', { origin: bare, commits: 1 });

  const plain = census(root);
  assert.ok(!kindsFor(plain, 'crypto-lab-empty-remote').includes('EMPTY REMOTE'),
    'without --fetch the checker must not claim to know the remote is empty');

  const fetched = execFileSync(process.execPath, [CENSUS, 'report', '--fetch'], {
    encoding: 'utf8',
    env: { ...process.env, CRYPTO_LAB_REPOS_ROOT: root },
  });
  assert.ok(kindsFor(fetched, 'crypto-lab-empty-remote').includes('EMPTY REMOTE'),
    'under --fetch a remote with zero refs must be named');
});

test('a dirty tree is reported even when every commit is pushed', () => {
  const root = freshRoot();
  const bare = makeOrigin(root, 'dirty-origin');
  const dir = makeClone(root, 'crypto-lab-dirty', { origin: bare, commits: 1 });
  git(dir, 'push', '-q', '-u', 'origin', 'main');
  fs.writeFileSync(path.join(dir, 'uncommitted.txt'), 'not committed\n');
  const out = census(root);
  assert.deepEqual(kindsFor(out, 'crypto-lab-dirty'), ['DIRTY']);
});

test('THE CONTROL: a fully pushed clone, and a gone upstream over merged work, are both clean', () => {
  const root = freshRoot();

  // (a) nothing to say about this one at all.
  const bareA = makeOrigin(root, 'clean-origin');
  const clean = makeClone(root, 'crypto-lab-clean', { origin: bareA, commits: 2 });
  git(clean, 'push', '-q', '-u', 'origin', 'main');

  // (b) the common benign case on this machine: a lane branch that was merged
  // into a pushed main and then deleted. Its upstream is gone and it holds
  // nothing unique, so it must NOT read like the incident.
  const bareB = makeOrigin(root, 'merged-origin');
  const merged = makeClone(root, 'crypto-lab-merged-lane', { origin: bareB, commits: 1 });
  git(merged, 'push', '-q', '-u', 'origin', 'main');
  git(merged, 'checkout', '-q', '-b', 'lane/finished');
  fs.writeFileSync(path.join(merged, 'lane.txt'), 'lane work\n');
  git(merged, 'add', '-A');
  git(merged, 'commit', '-q', '-m', 'lane work');
  git(merged, 'push', '-q', '-u', 'origin', 'lane/finished');
  // Merge it into the pushed main, then delete the lane branch on the remote.
  git(merged, 'checkout', '-q', 'main');
  git(merged, 'merge', '-q', '--no-ff', '-m', 'merge lane', 'lane/finished');
  git(merged, 'push', '-q', 'origin', 'main');
  git(merged, 'checkout', '-q', 'lane/finished');
  execFileSync('git', ['-C', bareB, 'update-ref', '-d', 'refs/heads/lane/finished'], { stdio: 'ignore' });
  git(merged, 'fetch', '-q', '--prune', 'origin');

  const out = census(root);
  assert.deepEqual(kindsFor(out, 'crypto-lab-clean'), [],
    'a fully pushed clone must produce no finding');
  // It is reported (its upstream really is gone) but as the tidy-up tier, with
  // no unique commits -- the distinction that keeps this checker readable.
  assert.deepEqual(kindsFor(out, 'crypto-lab-merged-lane'), ['UPSTREAM GONE']);
  assert.match(out, /crypto-lab-merged-lane[^\n]*nothing unique here/);
  assert.match(out, /Holding commits that are on no remote: 0\./);
});

test('check mode fails on unique commits and passes when there are none', () => {
  const root = freshRoot();
  const bare = makeOrigin(root, 'exit-origin');
  const dir = makeClone(root, 'crypto-lab-exit', { origin: bare, commits: 1 });
  git(dir, 'push', '-q', '-u', 'origin', 'main');

  const run = () => {
    try {
      execFileSync(process.execPath, [CENSUS, 'check'], {
        encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, CRYPTO_LAB_REPOS_ROOT: root },
      });
      return 0;
    } catch (e) { return e.status; }
  };
  assert.equal(run(), 0, 'a clean fleet must exit 0');

  fs.writeFileSync(path.join(dir, 'only-here.txt'), 'only here\n');
  git(dir, 'add', '-A');
  git(dir, 'commit', '-q', '-m', 'only here');
  assert.equal(run(), 1, 'a commit on no remote must exit 1');
});
