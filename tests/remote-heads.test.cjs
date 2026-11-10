/* The bounded pool behind remoteHeadsOf.
 *
 * The property that matters is fail-closed: a remote this cannot read must come
 * back empty, so catalog-evidence stores null and reports UNREADABLE. It must
 * never read as "same as local".
 *
 * The regression being guarded is the one that replaced the xargs pipeline. BSD
 * xargs caps an `-I{}` command at -S bytes (255 by default) and the old template
 * substituted the replacement three times, so long checkout paths made xargs
 * print nothing and every remote read as unreadable -- UNREADABLE for all 252
 * labs, which looks like a fleet-wide finding and is actually a dead tool. The
 * long-path test below fails on any implementation that templates paths through
 * a shell. */
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const { remoteHeads, envInt, DEFAULT_CONCURRENCY } = require('../tools/remote-heads.js');
const HELPER = path.join(__dirname, '..', 'tools', 'remote-heads.js');

function repoWithRemote(dir, remote) {
  fs.mkdirSync(dir, { recursive: true });
  execFileSync('git', ['-C', dir, 'init', '-q']);
  execFileSync('git', ['-C', dir, 'remote', 'add', 'origin', remote]);
  return dir;
}

test('an unreadable remote is empty, not absent and not assumed', async () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'rh-'));
  const bad = repoWithRemote(path.join(base, 'bad'), path.join(base, 'no-such-repo'));
  const heads = await remoteHeads([bad], { attempts: 1 });
  assert.ok(heads.has(bad), 'the directory must still be reported');
  assert.equal(heads.get(bad), null, 'an unreadable remote must be null, which is UNREADABLE');
});

test('a readable remote yields its forty-hex head', async () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'rh-'));
  const origin = path.join(base, 'origin.git');
  execFileSync('git', ['init', '-q', '--bare', origin]);
  const work = path.join(base, 'work');
  execFileSync('git', ['init', '-q', work]);
  fs.writeFileSync(path.join(work, 'a'), 'a');
  execFileSync('git', ['-C', work, 'add', 'a']);
  execFileSync('git', ['-C', work, '-c', 'user.email=t@t', '-c', 'user.name=t',
                       'commit', '-qm', 'one']);
  execFileSync('git', ['-C', work, 'branch', '-M', 'main']);
  execFileSync('git', ['-C', work, 'remote', 'add', 'origin', origin]);
  execFileSync('git', ['-C', work, 'push', '-q', 'origin', 'main']);
  execFileSync('git', ['-C', origin, 'symbolic-ref', 'HEAD', 'refs/heads/main']);
  const heads = await remoteHeads([work], { attempts: 1 });
  assert.match(String(heads.get(work)), /^[0-9a-f]{40}$/);
});

test('a path too long for an xargs -I template still works', async () => {
  // 140+ characters, which is what broke the previous implementation.
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'rh-'));
  const deep = path.join(base, 'a'.repeat(60), 'b'.repeat(60), 'c'.repeat(30));
  assert.ok(deep.length > 140, `path is only ${deep.length} characters`);
  const bad = repoWithRemote(deep, path.join(base, 'no-such-repo'));
  const heads = await remoteHeads([bad], { attempts: 1 });
  assert.ok(heads.has(bad), 'a long path must still be reported, not dropped');
  assert.equal(heads.get(bad), null);
});

test('every directory is answered, and the pool is bounded', async () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'rh-'));
  const dirs = Array.from({ length: 40 }, (_, i) =>
    repoWithRemote(path.join(base, `r${i}`), path.join(base, 'no-such-repo')));
  const heads = await remoteHeads(dirs, { attempts: 1, concurrency: 4 });
  assert.equal(heads.size, dirs.length, 'no directory may be dropped');
  for (const d of dirs) assert.equal(heads.get(d), null);
});

test('a malformed concurrency override falls back rather than becoming zero', () => {
  for (const bad of ['', '0', '-3', 'abc', '2.5']) {
    process.env.FLEET_LS_REMOTE_CONCURRENCY = bad;
    assert.equal(envInt('FLEET_LS_REMOTE_CONCURRENCY', DEFAULT_CONCURRENCY), DEFAULT_CONCURRENCY,
                 `override ${JSON.stringify(bad)} must not be honoured`);
  }
  process.env.FLEET_LS_REMOTE_CONCURRENCY = '7';
  assert.equal(envInt('FLEET_LS_REMOTE_CONCURRENCY', DEFAULT_CONCURRENCY), 7);
  delete process.env.FLEET_LS_REMOTE_CONCURRENCY;
});

test('the CLI answers one line per directory, in order', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'rh-'));
  const dirs = [repoWithRemote(path.join(base, 'x'), path.join(base, 'nope')),
                repoWithRemote(path.join(base, 'y'), path.join(base, 'nope'))];
  const r = spawnSync(process.execPath, [HELPER], {
    input: dirs.join('\n'), encoding: 'utf8',
    env: { ...process.env, FLEET_LS_REMOTE_ATTEMPTS: '1' },
  });
  assert.equal(r.status, 0);
  const lines = r.stdout.split('\n').filter(Boolean);
  assert.equal(lines.length, dirs.length);
  lines.forEach((l, i) => assert.equal(l.split('\t')[0], dirs[i]));
});
