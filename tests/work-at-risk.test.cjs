/**
 * The at-risk inspector, one test per requirement and per bucket.
 *
 * Each of the three requirements is the fix for a specific wrong answer the
 * previous inspector gave, so each is asserted in BOTH directions — the state it
 * must produce, and the number it must refuse to produce:
 *
 *   1. a count from a stale tracking ref is UNVERIFIED, not established
 *      (`testing-agents` was reported as "1 (understated)" from frozen refs)
 *   2. a local-path or file:// origin is NO REMOTE
 *      (`fork-audit` pushes to a sibling directory and looked safe)
 *   3. the buckets are disjoint and sum to the total, or the run refuses
 *
 * Every behavioural test runs against throwaway repositories built here, never
 * against ~/repos: a test whose fixture is the machine it is describing proves
 * nothing the next machine will reproduce.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync, spawn } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const TOOL = path.join(ROOT, 'tools', 'work-at-risk.js');
const { inspect, decide, classifyRemotes, localOnlyCount, verifyTracking, assertDisjoint, children, BUCKETS, HELD } = require('../tools/work-at-risk.js');

function sh(dir, ...args) {
  const r = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
  assert.equal(r.status, 0, `git ${args.join(' ')} in ${dir}: ${r.stderr}`);
  return r.stdout.trim();
}

/** A root holding throwaway repos, cleaned up after each test. */
function scratchRoot(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'work-at-risk-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

/** A bare repo OUTSIDE the inspected root, plus a clone of it inside.
 *
 *  The bare repo must live outside, or it is itself inspected and lands in
 *  not-a-repo/no-remote and skews the arithmetic the tests assert. Caught by the
 *  first run: the fixture produced `all-pushed.git  no remote at all` as a row of
 *  its own.
 *
 *  There is deliberately NO "pretend this is off-machine" option. It was tried
 *  with `url.<path>.insteadOf` and cannot work: `git remote -v` DISPLAYS the
 *  rewritten URL, so the classifier correctly saw a local path — and that is the
 *  right behaviour, because a repo whose https origin is silently rewritten to a
 *  local path really does push nowhere. So the at-risk/safe DECISION is tested
 *  through the pure `decide()` below, and each git probe is tested here against
 *  real repositories on its own.
 */
function repoWithRemote(root, name, { commitsAhead = 0, remoteUrl = null } = {}) {
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'war-remote-'));
  const bare = path.join(outside, `${name}.git`);
  fs.mkdirSync(bare);
  sh(bare, 'init', '-q', '--bare', '-b', 'main');
  const work = path.join(root, name);
  const r = spawnSync('git', ['clone', '-q', bare, work], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  sh(work, 'config', 'user.name', 'Fixture');
  sh(work, 'config', 'user.email', 'fixture@example.invalid');
  sh(work, 'config', 'commit.gpgsign', 'false');
  fs.writeFileSync(path.join(work, 'a.txt'), 'one\n');
  sh(work, 'add', 'a.txt');
  sh(work, 'commit', '-q', '-m', 'first');
  sh(work, 'push', '-q', 'origin', 'main');
  for (let i = 0; i < commitsAhead; i++) {
    fs.writeFileSync(path.join(work, `b${i}.txt`), `${i}\n`);
    sh(work, 'add', `b${i}.txt`);
    sh(work, 'commit', '-q', '-m', `ahead ${i}`);
  }
  if (remoteUrl) sh(work, 'remote', 'set-url', 'origin', remoteUrl);
  return { work, bare, outside };
}

/* ---------------------------------- requirement 2: a local path is no remote */

test('REQ2: a bare local path origin is NO-REMOTE, not a remote', (t) => {
  /* fork-audit's shape. This is the most dangerous false negative the tool can
     produce: everything looks safe and nothing left the machine. */
  const root = scratchRoot(t);
  repoWithRemote(root, 'local-origin');
  const v = inspect(root, 'local-origin', { verify: true });
  assert.equal(v.bucket, 'no-remote');
  assert.match(v.why, /only local remote\(s\)/);
  assert.match(v.why, /local-origin\.git/, 'the path must be named, so the reader can see what it is');
});

test('REQ2: a file:// origin is NO-REMOTE too', (t) => {
  const root = scratchRoot(t);
  const { bare } = repoWithRemote(root, 'file-origin');
  sh(path.join(root, 'file-origin'), 'remote', 'set-url', 'origin', `file://${bare}`);
  assert.equal(inspect(root, 'file-origin', { verify: true }).bucket, 'no-remote');
});

test('REQ2: an https origin is a real remote and is NOT no-remote', (t) => {
  /* The positive control. Without it, a rule that called everything no-remote
     would pass the two tests above. */
  const root = scratchRoot(t);
  repoWithRemote(root, 'https-origin', { remoteUrl: 'https://github.com/systemslibrarian/does-not-exist.git' });
  const c = classifyRemotes(path.join(root, 'https-origin'));
  assert.equal(c.offMachine.length, 1);
  assert.equal(c.local.length, 0);
});

test('REQ2: an scp-style remote is off-machine, not a path', (t) => {
  const root = scratchRoot(t);
  repoWithRemote(root, 'scp-origin', { remoteUrl: 'git@github.com:systemslibrarian/x.git' });
  const c = classifyRemotes(path.join(root, 'scp-origin'));
  assert.equal(c.offMachine.length, 1, 'git@host:path is a network remote');
  assert.equal(c.local.length, 0);
});

/* ------------------------- requirement 1: a stale count is a state, not a number */

test('REQ1: a refusing remote gives UNVERIFIED, never at-risk', (t) => {
  /* testing-agents' shape: real https origin, remote gone, tracking refs frozen.
     The old inspector turned those frozen refs into "1 (understated)". */
  const root = scratchRoot(t);
  repoWithRemote(root, 'gone-remote', { commitsAhead: 3, remoteUrl: 'https://127.0.0.1:1/nope.git' });
  const v = inspect(root, 'gone-remote', { verify: true });
  assert.equal(v.bucket, 'unverified', 'a remote that refused cannot establish anything');
  assert.match(v.why, /unverified \(remote refused\)/);
  assert.match(v.why, /^3 unverified/, 'the count is shown, labelled, and not presented as a finding');
});

test('REQ1: without --verify, even a reachable remote leaves the count UNVERIFIED', () => {
  /* The honest default. On-disk refs are evidence of the last fetch and of
     nothing since, and the tool must not fetch: a fetch writes to a repository it
     does not own. Through decide(), because a local fixture remote would land in
     no-remote first -- see the fixture note above. */
  const v = decide({ name: 'r', repo: true,
    remotes: { readable: true, offMachine: [{ name: 'origin', url: 'https://github.com/x/y.git' }], local: [], count: 1 },
    localOnly: { readable: true, count: 2 }, verify: false,
    verifyRemote: () => { throw new Error('verifyRemote must not be called without --verify'); } });
  assert.equal(v.bucket, 'unverified');
  assert.equal(v.count, 2);
  assert.match(v.why, /not verified \(run --verify\)/);
});

/* The at-risk and safe DECISIONS, through the pure function. See the fixture note
   above for why these cannot be end-to-end: there is no honest local remote that
   is both network-shaped and reachable, and faking one with insteadOf is defeated
   by `git remote -v` showing the rewrite. */

const remote = (name, url) => ({ readable: true, offMachine: [{ name, url }], local: [], count: 1 });
const ok = { verified: true };

test('AT-RISK: verified unpushed commits are reported as at-risk with a count', () => {
  const v = decide({ name: 'r', repo: true, remotes: remote('origin', 'https://github.com/x/y.git'),
    localOnly: { readable: true, count: 4 }, verify: true, verifyRemote: () => ok });
  assert.equal(v.bucket, 'at-risk');
  assert.equal(v.count, 4);
  assert.match(v.why, /verified against origin/);
});

test('SAFE: a fully pushed repo is safe, verified', () => {
  const v = decide({ name: 'r', repo: true, remotes: remote('origin', 'https://github.com/x/y.git'),
    localOnly: { readable: true, count: 0 }, verify: true, verifyRemote: () => ok });
  assert.equal(v.bucket, 'safe');
  assert.equal(v.count, 0);
});

test('REQ1: ONE refusing remote is enough to make the whole count unverified', () => {
  /* The commits might be on that remote, and the refs cannot say. A repo with two
     remotes where only one answers must not be called at-risk. */
  const two = { readable: true, local: [], count: 2,
    offMachine: [{ name: 'origin', url: 'https://a/x.git' }, { name: 'upstream', url: 'https://b/y.git' }] };
  const v = decide({ name: 'r', repo: true, remotes: two, localOnly: { readable: true, count: 7 },
    verify: true, verifyRemote: (n) => (n === 'origin' ? ok : { verified: false, why: 'ls-remote upstream: refused' }) });
  assert.equal(v.bucket, 'unverified');
  assert.match(v.why, /^7 unverified \(remote refused\)/);
  assert.match(v.why, /upstream/);
});

test('REQ1: a stale tracking ref says STALE, not "remote refused"', () => {
  /* Both make the count unverified, and they are different facts. The first full
     run called 43 repositories "remote refused" when every remote had answered
     and the only disagreement was a merged Dependabot branch still tracked here. */
  const v = decide({ name: 'r', repo: true,
    remotes: { readable: true, offMachine: [{ name: 'origin', url: 'https://a/x.git' }], local: [], count: 1 },
    localOnly: { readable: true, count: 3 }, verify: true,
    verifyRemote: () => ({ verified: false, stale: true, why: '1 tracking ref(s) disagree with origin: dependabot/x (gone)' }) });
  assert.equal(v.bucket, 'unverified');
  assert.match(v.why, /^3 unverified \(tracking refs stale\)/);
  assert.doesNotMatch(v.why, /refused/, 'an answered query is not a refusal');
});

test('REQ1: a refusal and a stale ref are told apart by the reason, not the bucket', () => {
  const refused = decide({ name: 'r', repo: true,
    remotes: { readable: true, offMachine: [{ name: 'origin', url: 'https://a/x.git' }], local: [], count: 1 },
    localOnly: { readable: true, count: 3 }, verify: true,
    verifyRemote: () => ({ verified: false, why: 'ls-remote origin: could not read' }) });
  assert.match(refused.why, /\(remote refused\)/);
  assert.equal(refused.bucket, 'unverified', 'same bucket, different reason');
});

test('REQ1: an unreadable rev-list is UNVERIFIED, never a zero', () => {
  const v = decide({ name: 'r', repo: true, remotes: remote('origin', 'https://a/x.git'),
    localOnly: { readable: false, why: 'bad object' }, verify: true, verifyRemote: () => ok });
  assert.equal(v.bucket, 'unverified');
  assert.match(v.why, /rev-list unreadable/);
});

test('REQ1: unreadable remotes are UNVERIFIED, not no-remote', () => {
  /* "could not read the remotes" and "has no remotes" are different facts, and
     collapsing them would report a reachable repo as unable to reach anything. */
  const v = decide({ name: 'r', repo: true, remotes: { readable: false, why: 'not a git repository' },
    localOnly: { readable: true, count: 0 }, verify: true, verifyRemote: () => ok });
  assert.equal(v.bucket, 'unverified');
  assert.match(v.why, /remotes unreadable/);
});

test('verifyTracking catches a moved remote, against a real repository', (t) => {
  /* The probe on its own, where a local path remote is fine: ls-remote reaches it
     and the question is only whether the tracking refs still agree. */
  const root = scratchRoot(t);
  const { bare } = repoWithRemote(root, 'tracked');
  assert.equal(verifyTracking(path.join(root, 'tracked'), 'origin').verified, true);
  const other = path.join(root, 'other');
  spawnSync('git', ['clone', '-q', bare, other]);
  sh(other, 'config', 'user.email', 'f@example.invalid');
  sh(other, 'config', 'user.name', 'F');
  fs.writeFileSync(path.join(other, 'c.txt'), 'c\n');
  sh(other, 'add', 'c.txt'); sh(other, 'commit', '-q', '-m', 'landed elsewhere');
  sh(other, 'push', '-q', 'origin', 'main');
  const after = verifyTracking(path.join(root, 'tracked'), 'origin');
  assert.equal(after.verified, false, 'the remote moved and this clone was never fetched');
  assert.match(after.why, /tracking ref\(s\) disagree/);
});

test('verifyTracking on an unreachable remote is a refusal, not a pass', (t) => {
  const root = scratchRoot(t);
  repoWithRemote(root, 'nope', { remoteUrl: 'https://127.0.0.1:1/gone.git' });
  const v = verifyTracking(path.join(root, 'nope'), 'origin');
  assert.equal(v.verified, false);
  assert.match(v.why, /ls-remote origin/);
});

test('the local-only count uses --not --remotes and no bare --stdin', () => {
  /* `git rev-list --stdin` ADDS revs unless each is ^-prefixed: measured
     713 -> 743 in SP800-90B_EntropyAssessment, a LARGER number that never looks
     like a failure. This form needs no stdin at all. */
  const src = fs.readFileSync(TOOL, 'utf8');
  assert.match(src, /'rev-list', '--count', '--all', '--not', '--remotes'/);
  assert.ok(!/--stdin/.test(src.replace(/\/\*[\s\S]*?\*\//g, '')),
    'no executable line may pipe revs in, where they would be added rather than excluded');
});

/* -------------------------------- requirement 3: disjoint buckets that reconcile */

test('REQ3: every bucket name is known and the sum equals the total', () => {
  const rows = [
    { name: 'a', bucket: 'safe' }, { name: 'b', bucket: 'at-risk' },
    { name: 'c', bucket: 'held' }, { name: 'd', bucket: 'not-a-repo' },
  ];
  const counts = assertDisjoint(rows, 4);
  assert.equal(BUCKETS.reduce((n, b) => n + counts[b], 0), 4);
});

test('REQ3: a repo in two buckets is refused, not averaged', () => {
  assert.throws(() => assertDisjoint([{ name: 'a', bucket: 'safe' }, { name: 'a', bucket: 'at-risk' }], 2),
    /appears twice/);
});

test('REQ3: a sum that misses the total is refused', () => {
  /* The defect this requirement exists for: a table that does not add up cannot
     be read, because a dropped row and a double count look the same. */
  assert.throws(() => assertDisjoint([{ name: 'a', bucket: 'safe' }], 9), /sum to 1, not the 9/);
});

test('REQ3: an unknown bucket is refused rather than silently dropped', () => {
  assert.throws(() => assertDisjoint([{ name: 'a', bucket: 'probably-fine' }], 1), /unknown bucket/);
});

/* ----------------------------------------------- held, dotted dirs, and the CLI */

test('HELD repos stay in the denominator and get no remote call', (t) => {
  const root = scratchRoot(t);
  const name = [...HELD.keys()][0];
  fs.mkdirSync(path.join(root, name));
  const v = inspect(root, name, { verify: true });
  assert.equal(v.bucket, 'held');
  assert.match(v.why, /owner/i, 'the reason must travel with the hold');
});

test('dotted directories are inspected: the one irreplaceable repo here is dotted', (t) => {
  const root = scratchRoot(t);
  fs.mkdirSync(path.join(root, '.hidden-thing'));
  assert.ok(children(root).includes('.hidden-thing'));
});

test('a directory that is not a repository is its own bucket, not an error', (t) => {
  const root = scratchRoot(t);
  fs.mkdirSync(path.join(root, 'just-a-folder'));
  assert.equal(inspect(root, 'just-a-folder', { verify: true }).bucket, 'not-a-repo');
});

function cli(args) {
  return new Promise((resolve) => {
    const c = spawn(process.execPath, [TOOL, ...args], { cwd: ROOT });
    let out = ''; let err = '';
    c.stdout.on('data', (d) => { out += d; });
    c.stderr.on('data', (d) => { err += d; });
    c.on('close', (status) => resolve({ status, out, err }));
  });
}

test('CLI: no-remote fails `check`, and the table reconciles as repos are added', async (t) => {
  const root = scratchRoot(t);
  repoWithRemote(root, 'all-pushed');
  let r = await cli(['check', '--verify', '--root', root]);
  assert.equal(r.status, 1, 'a local-path origin is NO-REMOTE, so check must fail');
  assert.match(r.out, /NO-REMOTE \(1\)/);
  assert.match(r.out, /= 1$/m, 'one directory, and the arithmetic reconciles');

  repoWithRemote(root, 'ahead', { commitsAhead: 1 });
  r = await cli(['check', '--verify', '--root', root]);
  assert.equal(r.status, 1);
  assert.match(r.out, /NO-REMOTE \(2\)/, 'both fixtures have local-path origins');
  assert.match(r.out, /= 2$/m);
});

test('CLI: an unreadable root is refused, never reported as a clean machine', async () => {
  const r = await cli(['check', '--root', path.join(os.tmpdir(), `no-such-root-${Date.now()}`)]);
  assert.equal(r.status, 2);
  assert.match(r.err, /not an empty machine/);
});

test('CLI: an empty root is refused rather than reported clean', async (t) => {
  const root = scratchRoot(t);
  const r = await cli(['check', '--root', root]);
  assert.equal(r.status, 2);
  assert.match(r.err, /Refusing to report a clean census over nothing/);
});

test('CLI: the arithmetic is printed, so the table can be checked by eye', async (t) => {
  const root = scratchRoot(t);
  repoWithRemote(root, 'one');
  const r = await cli(['--root', root]);
  assert.match(r.out, /ARITHMETIC/);
  assert.match(r.out, /immediate child directories of the root/);
  assert.match(r.out, /every directory is in exactly one bucket/);
});

test('it never fetches: a fetch would write to a repository it does not own', () => {
  const src = fs.readFileSync(TOOL, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.ok(!/'fetch'/.test(src), 'no executable line may fetch');
  assert.match(src, /'ls-remote'/, 'verification is read-only');
});
