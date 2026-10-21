'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { canonicalOrigin, canonicalWorktree, repositorySource, siblingLabs,
  fleetUnreadLine, pinnedCloneCount } = require('../tools/sibling-labs.js');
const committed = require('../tools/clone-source.js');

function fixture(t, slug = 'crypto-lab-fixture') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'canonical-fleet-control-'));
  t.after(() => { committed.forget(); fs.rmSync(root, { recursive: true, force: true }); });
  /* The base clone is named after the slug its origin names. It used to be `base`,
     which stopped being a valid ordinary clone when repositorySource began holding
     ordinary clones to the same origin rule worktrees already obeyed: a directory
     called `base` with origin systemslibrarian/crypto-lab-fixture is a clone whose
     origin names a DIFFERENT repository, which is exactly what the rule refuses.
     Naming it after its own origin keeps these assertions testing what they were for
     -- that an ordinary clone is retained -- rather than testing the mismatch. */
  const base = path.join(root, slug);
  const fleet = path.join(root, 'fleet');
  fs.mkdirSync(base); fs.mkdirSync(fleet);
  const git = (args, cwd = base) => execFileSync('git', args, {
    cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
  git(['init', '--quiet', '-b', 'main']);
  git(['config', 'user.name', 'Synthetic fixture']);
  git(['config', 'user.email', 'fixture@example.invalid']);
  git(['config', 'core.hooksPath', '/dev/null']);
  fs.writeFileSync(path.join(base, 'README.md'), 'Committed source\n');
  fs.mkdirSync(path.join(base, '.github', 'workflows'), { recursive: true });
  fs.writeFileSync(path.join(base, '.github', 'workflows', 'ci.yml'), 'name: fixture\n');
  git(['add', 'README.md', '.github/workflows/ci.yml']);
  git(['commit', '--quiet', '-m', 'Fixture']);
  const origin = `https://github.com/systemslibrarian/${slug}.git`;
  git(['remote', 'add', 'origin', origin]);
  const add = name => {
    const directory = path.join(fleet, name);
    git(['worktree', 'add', '--detach', directory, 'HEAD']);
    return directory;
  };
  const dir = add(slug);
  return { root, base, fleet, git, add, dir, slug, origin,
    metadata: fs.readFileSync(path.join(dir, '.git'), 'utf8') };
}

test('canonical source worktree is counted once while the duplicate lane stays excluded', t => {
  const f = fixture(t); f.add(`${f.slug}-lane`);
  const result = siblingLabs(f.fleet, { requireWorkflows: true });
  assert.deepEqual(result.labs, [f.slug]);
  assert.deepEqual(result.excluded, [`${f.slug}-lane`]);
  assert.equal(result.clones, 1);
  assert.equal(result.pinned, pinnedCloneCount());
  assert.equal(result.shortfall, result.pinned - 1);
  assert.match(fleetUnreadLine(result), /FLEET-UNREAD/); // no denominator waiver
});

test('the canonical Hub is a required subject; a Hub checkout named as a lab is not', t => {
  const f = fixture(t, 'crypto-lab'); f.add('crypto-lab-unrelated');
  assert.deepEqual(siblingLabs(f.fleet).labs, ['crypto-lab']);
  assert.deepEqual(siblingLabs(f.fleet).excluded, ['crypto-lab-unrelated']);
});

test('an ordinary clone is retained when its origin names its own directory', t => {
  /* Renamed from "ordinary clone directories retain their existing discovery
     behavior", which is no longer true: ordinary clones are now held to the origin
     rule, so what is retained is a clone whose origin names ITS OWN directory. The
     two tests below cover the cases that behaviour change actually introduced. */
  const f = fixture(t);
  assert.equal(repositorySource(f.base), true);
  assert.equal(canonicalWorktree(f.base), false);
});

test('a lab-named clone of the Hub repository itself is refused', t => {
  /* The case the rule was written for. crypto-lab-clean-origin-main is a second clone
     of THE CATALOG sitting in the fleet root, origin systemslibrarian/crypto-lab. It
     was counted as a lab by every fleet checker and dispatch-census.js PINNED it,
     which is the census recording a non-lab as a lab. The `.git`-is-a-FILE test that
     catches a lane worktree cannot see a full clone, so the origin check that already
     guarded the worktree path was never reachable for one. */
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-clone-under-lab-name-'));
  t.after(() => { committed.forget(); fs.rmSync(root, { recursive: true, force: true }); });
  const fleet = path.join(root, 'fleet');
  const dir = path.join(fleet, 'crypto-lab-clean-origin-main');
  fs.mkdirSync(dir, { recursive: true });
  const git = args => execFileSync('git', args, { cwd: dir, stdio: 'ignore' });
  git(['init', '--quiet', '-b', 'main']);
  git(['config', 'core.hooksPath', '/dev/null']);
  git(['remote', 'add', 'origin', 'https://github.com/systemslibrarian/crypto-lab.git']);
  assert.equal(fs.lstatSync(path.join(dir, '.git')).isDirectory(), true); // a full clone
  assert.equal(repositorySource(dir), false);
  const result = siblingLabs(fleet);
  assert.deepEqual(result.labs, []);
  assert.deepEqual(result.excluded, ['crypto-lab-clean-origin-main']); // named, not silent
  assert.equal(result.clones, 0);
});

test('a clone with no origin at all is still retained', t => {
  /* The narrowing that keeps the rule from shrinking the denominator. An empty
     repository has no origin, and three labs in this fleet are empty, so refusing a
     clone for having no origin would be the discovered-denominator defect this file
     exists to prevent. Only a clone whose origin names a DIFFERENT repository is
     refused. */
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clone-without-origin-'));
  t.after(() => { committed.forget(); fs.rmSync(root, { recursive: true, force: true }); });
  const dir = path.join(root, 'crypto-lab-no-remote');
  fs.mkdirSync(dir, { recursive: true });
  const git = args => execFileSync('git', args, { cwd: dir, stdio: 'ignore' });
  git(['init', '--quiet', '-b', 'main']);
  git(['config', 'core.hooksPath', '/dev/null']);
  assert.equal(execFileSync('git', ['-C', dir, 'remote'], { encoding: 'utf8' }).trim(), '');
  assert.equal(repositorySource(dir), true);
});

test('genuine empty canonical subjects count while corrupt HEAD and spoofed origins do not', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'empty-canonical-fleet-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  // Named after its origin slug, for the reason in fixture() above.
  const base = path.join(root, 'crypto-lab-empty'); const fleet = path.join(root, 'fleet');
  fs.mkdirSync(base); fs.mkdirSync(fleet);
  const git = args => execFileSync('git', args, { cwd: base, stdio: 'ignore' });
  git(['init', '--quiet', '-b', 'main']);
  git(['config', 'core.hooksPath', '/dev/null']);
  git(['remote', 'add', 'origin', 'https://github.com/systemslibrarian/crypto-lab-empty.git']);
  assert.equal(repositorySource(base), true); // empty ordinary clone is retained
  const dir = path.join(fleet, 'crypto-lab-empty');
  git(['worktree', 'add', '--quiet', '--orphan', '-b', 'waiting-for-code', dir]);
  assert.equal(canonicalWorktree(dir), true);
  assert.deepEqual(siblingLabs(fleet).labs, ['crypto-lab-empty']);
  git(['remote', 'set-url', 'origin', 'https://github.com/another/crypto-lab-empty.git']);
  assert.equal(canonicalWorktree(dir), false);
  git(['remote', 'set-url', 'origin', 'https://github.com/systemslibrarian/crypto-lab-empty.git']);
  const admin = fs.readFileSync(path.join(dir, '.git'), 'utf8').trim().slice('gitdir: '.length);
  const head = path.join(admin, 'HEAD'); const original = fs.readFileSync(head);
  fs.writeFileSync(head, 'f'.repeat(40) + '\n');
  assert.equal(canonicalWorktree(dir), false);
  fs.writeFileSync(head, original);
  assert.equal(canonicalWorktree(dir), true);
});

test('strict origin identity accepts supported GitHub transports and rejects spoofing', () => {
  const name = 'crypto-lab-fixture';
  for (const origin of [`https://github.com/systemslibrarian/${name}.git`,
    `git@github.com:systemslibrarian/${name}.git`, `ssh://git@github.com/systemslibrarian/${name}.git`]) {
    assert.equal(canonicalOrigin(origin, name), true);
  }
  for (const origin of [`https://github.com/another/${name}.git`,
    `https://github.com.evil.invalid/systemslibrarian/${name}.git`,
    `https://github.com/systemslibrarian/${name}.git?other=1`,
    `https://github.com/systemslibrarian/${name}.git#other`,
    `https://user:token@github.com/systemslibrarian/${name}.git`,
    `https://github.com/systemslibrarian/../${name}.git`,
    `https://github.com/systemslibrarian/%2e%2e/${name}.git`,
    `http://github.com/systemslibrarian/${name}.git`,
    `git@github.com:systemslibrarian/${name}-other.git`, 'unreadable']) {
    assert.equal(canonicalOrigin(origin, name), false);
  }
});

test('wrong or absent origin cannot make a canonical-looking worktree count', t => {
  const f = fixture(t);
  f.git(['remote', 'set-url', 'origin', 'https://github.com/another/crypto-lab-fixture.git']);
  assert.equal(canonicalWorktree(f.dir), false);
  assert.equal(siblingLabs(f.fleet).clones, 0);
  f.git(['remote', 'remove', 'origin']);
  assert.equal(repositorySource(f.dir), false);
});

test('malformed, missing and traversal pointers remain unreadable', t => {
  const f = fixture(t); const file = path.join(f.dir, '.git');
  for (const value of ['not Git metadata\n', 'gitdir: /missing/admin\n',
    `gitdir: ${path.join(f.base, '.git')}\n`, 'gitdir: ../../unrelated/.git\n',
    `${f.metadata}unexpected second line\n`, 'gitdir: bad\u0000pointer\n']) {
    fs.writeFileSync(file, value);
    assert.equal(canonicalWorktree(f.dir), false);
    assert.equal(repositorySource(f.dir), false);
  }
  fs.writeFileSync(file, f.metadata);
  assert.equal(canonicalWorktree(f.dir), true);
});

test('a valid relative administrative pointer still must have the correct back-pointer', t => {
  const f = fixture(t); const file = path.join(f.dir, '.git');
  const admin = f.metadata.trim().slice('gitdir: '.length);
  // macOS /var aliases /private/var; Git resolves relative pointers from the
  // physical directory, so construct a genuinely valid relative Git pointer.
  fs.writeFileSync(file, `gitdir: ${path.relative(fs.realpathSync(f.dir), admin)}\n`);
  assert.equal(canonicalWorktree(f.dir), true);
  const back = path.join(admin, 'gitdir'); const original = fs.readFileSync(back);
  fs.writeFileSync(back, path.join(f.root, 'unrelated', '.git'));
  assert.equal(canonicalWorktree(f.dir), false);
  fs.writeFileSync(back, original);
  assert.equal(canonicalWorktree(f.dir), true);
});

test('canonical directory alias counts once, a symlink duplicate and substituted .git do not', t => {
  const f = fixture(t); const duplicate = `${f.slug}-alias`;
  const physical = path.join(f.root, 'physical-source');
  f.git(['worktree', 'move', f.dir, physical]);
  fs.symlinkSync(physical, f.dir, 'dir');
  assert.equal(canonicalWorktree(f.dir), true);
  fs.symlinkSync(f.dir, path.join(f.fleet, duplicate), 'dir');
  assert.deepEqual(siblingLabs(f.fleet).labs, [f.slug]);
  assert.deepEqual(siblingLabs(f.fleet).excluded, [duplicate]);
  const saved = path.join(f.root, 'saved-git-file');
  fs.renameSync(path.join(f.dir, '.git'), saved);
  fs.symlinkSync(saved, path.join(f.dir, '.git'));
  assert.equal(repositorySource(f.dir), false);
  fs.unlinkSync(path.join(f.dir, '.git')); fs.renameSync(saved, path.join(f.dir, '.git'));
});

test('read failures and unrelated directories cannot raise the visible denominator', t => {
  const f = fixture(t); fs.mkdirSync(path.join(f.fleet, 'crypto-lab-plain-directory'));
  assert.equal(repositorySource(path.join(f.fleet, 'crypto-lab-plain-directory')), false);
  const original = fs.readFileSync;
  try {
    fs.readFileSync = (file, ...args) => {
      if (String(file) === path.join(f.dir, '.git')) throw new Error('Synthetic permission failure');
      return original(file, ...args);
    };
    assert.equal(repositorySource(f.dir), false);
    assert.equal(siblingLabs(f.fleet).clones, 0);
  } finally { fs.readFileSync = original; }
});

test('dirty canonical worktree still uses the unchanged committed-source guard', t => {
  const f = fixture(t);
  fs.writeFileSync(path.join(f.dir, 'README.md'), 'Uncommitted different source\n');
  assert.equal(canonicalWorktree(f.dir), true);
  assert.equal(siblingLabs(f.fleet).clones, 1);
  const source = committed.sourceRoot(f.dir);
  assert.equal(source.from, 'HEAD');
  assert.equal(fs.readFileSync(path.join(source.root, 'README.md'), 'utf8'), 'Committed source\n');
  assert.equal(fs.readFileSync(path.join(f.dir, 'README.md'), 'utf8'), 'Uncommitted different source\n');
});
