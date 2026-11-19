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
 * The controls matter as much as the cases. A checker that reported everything
 * would have "caught" the incident too, and would be worthless on a machine
 * holding 406 work trees: 34 of them legitimately track a branch a finished
 * round deleted. So a fully pushed clone and a landed-then-deleted lane must
 * both come back clean -- that is what makes a finding mean something.
 *
 * AND THE SHAPE OF THAT LANDING IS THE WHOLE POINT, because the first version
 * of this file got it wrong in a way that passed. It built the merged lane with
 * a MERGE COMMIT, which leaves the lane's commits as ancestors of main, so
 * `rev-list --not --remotes` returned 0 and the control went green. This fleet
 * does not land lanes that way: the hub uses
 * `gh pr merge --squash --delete-branch`, and a squash writes a NEW commit
 * holding the lane's tree, so none of the lane's own commits is an ancestor of
 * anything on any remote. Same construction, squashed, counts 2 on git 2.54 --
 * so the tool was wrong about every finished lane on this machine while this
 * suite reported it correct. A control is only as good as its fidelity to the
 * operation being controlled, and "merged" was not specific enough to be one.
 *
 * Both shapes are now here: the squash cases, and the merge-commit case kept
 * explicitly labelled so it documents the difference rather than standing in
 * for it.
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

test('a no-remote clone is never told to re-run with --fetch, because there is nothing to ask', () => {
  const root = freshRoot();
  makeClone(root, 'crypto-lab-noremote', { origin: null, commits: 1 });
  const out = census(root);
  // No remote means no refs/pull/<n>/head can exist, so the count is
  // established whether or not anyone fetched. This printed the advice during
  // a --fetch run, telling the reader to do the thing they had just done.
  assert.match(out, /crypto-lab-noremote\s+no remote configured; 1 commit\(s\) on no remote$/m);
  assert.ok(!/crypto-lab-noremote[^\n]*re-run with --fetch/.test(out),
    'a work tree with no remote has no PR heads to go and ask about');
});

test('AHEAD says both things at once: not on main, and whether anything is only here', () => {
  const root = freshRoot();
  const bare = makeOrigin(root, 'ahead-origin');
  const dir = makeClone(root, 'crypto-lab-ahead', { origin: bare, commits: 1 });
  git(dir, 'push', '-q', '-u', 'origin', 'main');
  fs.writeFileSync(path.join(dir, 'next.txt'), 'next\n');
  git(dir, 'add', '-A');
  git(dir, 'commit', '-q', '-m', 'one past the upstream');
  const out = census(root);
  // Ahead AND unique, so both halves agree here. The line has to carry both
  // because when they DISAGREE -- ahead of main but reachable from a PR head --
  // the tier placement reads as a contradiction without it.
  assert.match(out, /crypto-lab-ahead\s+1 commit\(s\) not on origin\/main; 1 commit\(s\) on no remote/);
});

test('a remote that was asked and refused says so, and is not told to re-run --fetch', () => {
  const root = freshRoot();
  const dir = makeClone(root, 'crypto-lab-refused', { origin: null, commits: 1 });
  // A remote that cannot resolve: the fetch fails, so the PR heads were asked
  // for and not supplied. Telling the reader to re-run with --fetch when
  // --fetch is exactly what failed is advice that costs an afternoon.
  git(dir, 'remote', 'add', 'origin', path.join(root, 'does-not-exist.git'));
  const out = execFileSync(process.execPath, [CENSUS, 'report', '--fetch'], {
    encoding: 'utf8',
    env: { ...process.env, CRYPTO_LAB_REPOS_ROOT: root },
  });
  assert.match(out, /crypto-lab-refused[^\n]*the remote could not be asked/);
  assert.ok(!/crypto-lab-refused[^\n]*re-run with --fetch/.test(out),
    'this run did ask; the remote refused');
  // And git's multi-line error must not break the one-row-per-finding layout.
  const row = out.split('\n').find((l) => l.includes('crypto-lab-refused') && l.includes('origin:'));
  assert.ok(row && !row.includes('\n'), 'the error is collapsed onto its own single row');
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

/* The shape this fleet actually uses, and the one the control below originally
   got wrong. `gh pr merge --squash --delete-branch` writes a NEW commit on main
   carrying the lane's tree, so none of the lane's own commits is an ancestor of
   anything on a remote-tracking ref. Delete the branch, prune, and
   `rev-list --count HEAD --not --remotes` in the lane's work tree returns the
   lane's commit count -- 2 here, reproduced on git 2.54. A control built with a
   merge commit or a fast-forward returns 0 and passes for a merge nobody here
   makes, which is exactly how the first version of this suite passed while the
   tool was wrong about 25 finished lanes. */
function squashLandedLane(root, name) {
  const bare = makeOrigin(root, `${name}-origin`);
  const dir = makeClone(root, name, { origin: bare, commits: 1 });
  git(dir, 'push', '-q', '-u', 'origin', 'main');
  git(dir, 'checkout', '-q', '-b', 'lane/finished');
  for (const n of ['one', 'two']) {
    fs.writeFileSync(path.join(dir, `${n}.txt`), `${n}\n`);
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', `lane ${n}`);
  }
  git(dir, 'push', '-q', '-u', 'origin', 'lane/finished');
  const laneTip = git(dir, 'rev-parse', 'HEAD');
  // The squash: a new commit on main, then the branch deleted on the remote.
  git(dir, 'checkout', '-q', 'main');
  execFileSync('git', ['-C', dir, 'merge', '--squash', 'lane/finished'], { stdio: 'ignore' });
  git(dir, 'commit', '-q', '-m', 'Lane, squashed (#1)');
  git(dir, 'push', '-q', 'origin', 'main');
  git(dir, 'push', '-q', 'origin', '--delete', 'lane/finished');
  git(dir, 'checkout', '-q', 'lane/finished');
  git(dir, 'fetch', '-q', '--prune', 'origin');
  return { bare, dir, laneTip };
}

test('a squash-merged, pruned lane counts its own commits — the shape this fleet lands', () => {
  const root = freshRoot();
  const { dir } = squashLandedLane(root, 'crypto-lab-squashed-lane');
  // The raw question, which is what made this worth fixing.
  assert.equal(git(dir, 'rev-list', '--count', 'HEAD', '--not', '--remotes'), '2',
    'a squash leaves the lane commits as non-ancestors of everything on the remote');
  // And a merge commit does NOT, which is why the old control proved nothing.
  assert.match(git(dir, 'status', '-sb'), /\[gone\]/);
});

test('the PR head GitHub keeps makes that lane read clean, and a commit on top still counts', () => {
  const root = freshRoot();
  const { bare, dir, laneTip } = squashLandedLane(root, 'crypto-lab-prhead-lane');
  // GitHub retains refs/pull/<n>/head after the branch is deleted; a local bare
  // repo does not grow one on its own, so the fixture writes the ref the real
  // remote would still be serving.
  execFileSync('git', ['-C', bare, 'update-ref', 'refs/pull/1/head', laneTip], { stdio: 'ignore' });

  const { examine } = require('../tools/unpushed-census.js');
  const heads = [laneTip];
  const asked = new Map([[dir, { ok: true, remote: 'origin', refs: 1, pr: { ok: true, heads, offered: 1 } }]]);
  const withPr = examine(dir, asked);
  assert.equal(withPr.only, 0, 'the lane tip is named by refs/pull/1/head, so nothing is only here');
  assert.ok(!withPr.findings.some((f) => f.only > 0 && f.firm),
    'a finished lane must not read as established unpushed work');

  // The control that stops this excluding REAL work: one commit past the PR head.
  fs.writeFileSync(path.join(dir, 'after.txt'), 'after\n');
  git(dir, 'add', '-A');
  git(dir, 'commit', '-q', '-m', 'made after the PR head');
  const after = examine(dir, asked);
  assert.equal(after.only, 1, 'a commit made after the PR head is still only here');
  assert.ok(after.findings.some((f) => f.only === 1 && f.firm),
    'and it is established, not unverified, because the remote was asked');
});

test('without asking the remote, that same lane is UNVERIFIED rather than clean or guilty', () => {
  const root = freshRoot();
  const { dir } = squashLandedLane(root, 'crypto-lab-unasked-lane');
  const { examine } = require('../tools/unpushed-census.js');
  const r = examine(dir, null); // no --fetch: nobody asked for the PR heads
  assert.equal(r.only, 2, 'the raw count is what it is');
  const gone = r.findings.find((f) => f.kind === 'UPSTREAM GONE');
  assert.ok(gone, 'the upstream really is gone');
  assert.equal(gone.firm, false, 'but the count is not established without the PR heads');
  assert.match(gone.detail, /re-run with --fetch/);
});

test('a PR head whose objects are absent cannot exclude anything, and is not an error', () => {
  const root = freshRoot();
  const { dir } = squashLandedLane(root, 'crypto-lab-absent-prhead');
  const { examine } = require('../tools/unpushed-census.js');
  // 40 hex characters this repository has never heard of. Handing it to
  // rev-list unfiltered would make the walk fail and turn the work tree into
  // NOT ASKED, so prHeadsFor filters to objects actually present.
  const bogus = 'f'.repeat(40);
  const asked = new Map([[dir, { ok: true, remote: 'origin', refs: 1, pr: { ok: true, heads: [], offered: 1 } }]]);
  const r = examine(dir, asked);
  assert.equal(r.only, 2, 'nothing was excluded, because nothing excludable was held');
  assert.ok(!r.unreadable, 'and the work tree is still answerable');
  assert.equal(bogus.length, 40);
});

test('a remote that cannot be asked for its PR heads is NOT ASKED, never 0', () => {
  const root = freshRoot();
  const { dir } = squashLandedLane(root, 'crypto-lab-unreadable-prhead');
  const { examine } = require('../tools/unpushed-census.js');
  const asked = new Map([[dir, { ok: true, remote: 'origin', refs: 1, pr: { ok: false, err: 'could not read Username' } }]]);
  const r = examine(dir, asked);
  assert.ok(r.unreadable, 'a refusal must not read as a clean answer');
  assert.match(r.unreadable, /refs\/pull/);
});

test('THE CONTROL: a fully pushed clone, and a MERGE-COMMIT landed lane, are both clean', () => {
  const root = freshRoot();

  // (a) nothing to say about this one at all.
  const bareA = makeOrigin(root, 'clean-origin');
  const clean = makeClone(root, 'crypto-lab-clean', { origin: bareA, commits: 2 });
  git(clean, 'push', '-q', '-u', 'origin', 'main');

  // (b) a lane branch merged into a pushed main with a MERGE COMMIT and then
  // deleted. Its upstream is gone and it holds nothing unique, so it must NOT
  // read like the incident. NOTE this is not the shape this fleet lands --
  // `gh pr merge --squash` is, and a squash leaves the lane commits as
  // non-ancestors so this same construction counts 2 rather than 0. That is
  // covered by its own tests above; keeping this one documents the difference
  // rather than standing in for it.
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
  assert.match(out, /Holding commits that are on no remote: 0 established\./);
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
