'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('node:child_process');
const { pinnedTree, pinnedBlobs } = require('../tools/clone-source.js');
const { cards } = require('../tools/catalog-sync.js');
const { readCards, parseFrontMatterChecked } = require('../tools/teach-build.js');
const { repositoryName, discoverRepositories, parseArgs } = require('../tools/teaching-reference.js');

function repo(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'teaching-source-control-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-q'); git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.invalid');
  return { dir, git };
}

test('immutable source ignores dirty, staged, untracked and ignored files; tracked nested shrinkwrap is retained', t => {
  const { dir, git } = repo(t);
  fs.mkdirSync(path.join(dir, 'demos', 'nested'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), '<p>Exact learner wording.</p>\n');
  fs.writeFileSync(path.join(dir, 'demos', 'nested', 'npm-shrinkwrap.json'), '{"lockfileVersion":3}\n');
  fs.writeFileSync(path.join(dir, '.gitignore'), 'ignored.txt\n');
  git('add', 'index.html', 'demos/nested/npm-shrinkwrap.json', '.gitignore'); git('commit', '-qm', 'original source');
  const sha = git('rev-parse', 'HEAD'); git('update-ref', 'refs/remotes/origin/main', sha); git('symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/main');
  fs.writeFileSync(path.join(dir, 'index.html'), 'Uncommitted replacement');
  fs.writeFileSync(path.join(dir, 'new.txt'), 'Staged replacement'); git('add', 'index.html', 'new.txt');
  fs.writeFileSync(path.join(dir, 'untracked.txt'), 'Untracked'); fs.writeFileSync(path.join(dir, 'ignored.txt'), 'Ignored');
  const before = git('status', '--porcelain');
  const tree = pinnedTree(dir), blobs = pinnedBlobs(dir, tree.entries);
  assert.equal(tree.sha, sha);
  assert.deepEqual(tree.entries.map(e => e.path), ['.gitignore', 'demos/nested/npm-shrinkwrap.json', 'index.html']);
  assert.equal(blobs.get(tree.entries.find(e => e.path === 'index.html').objectOid).toString(), '<p>Exact learner wording.</p>\n');
  assert.equal(git('status', '--porcelain'), before);
});

test('captured binary bytes and newline-containing filenames survive batch parsing', t => {
  const { dir, git } = repo(t); const bytes = Buffer.from([0, 10, 255, 1, 10]);
  fs.writeFileSync(path.join(dir, 'nested\nname.wasm'), bytes); git('add', '.'); git('commit', '-qm', 'binary source');
  const tree = pinnedTree(dir, 'HEAD');
  assert.equal(tree.entries[0].path, 'nested\nname.wasm');
  assert.deepEqual(pinnedBlobs(dir, tree.entries).get(tree.entries[0].objectOid), bytes);
});

test('symlink captures its stored path bytes and never the target contents', t => {
  const { dir, git } = repo(t); const target = path.join(os.tmpdir(), 'teaching-external-' + path.basename(dir));
  fs.writeFileSync(target, 'External content must never be captured'); t.after(() => fs.rmSync(target, { force: true }));
  fs.symlinkSync(target, path.join(dir, 'link')); git('add', 'link'); git('commit', '-qm', 'symlink');
  const tree = pinnedTree(dir, 'HEAD'); assert.equal(tree.entries[0].mode, '120000');
  assert.equal(pinnedBlobs(dir, tree.entries).get(tree.entries[0].objectOid).toString(), target);
});

test('read fails explicitly for unknown refs, empty repositories and invalid immutable blob requests', t => {
  const { dir } = repo(t);
  assert.throws(() => pinnedTree(dir, 'origin/HEAD'));
  assert.throws(() => pinnedBlobs(dir, [{ type: 'blob', objectOid: 'HEAD:index.html', bytes: 1 }]));
});

test('repository discovery uses origin URLs even when directory names differ', t => {
  const { dir, git } = repo(t); git('remote', 'add', 'origin', 'git@github.com:systemslibrarian/crypto-lab-example.git');
  assert.equal(repositoryName('https://github.com/systemslibrarian/crypto-lab-example.git'), 'systemslibrarian/crypto-lab-example');
  assert.equal(repositoryName('https://evil.invalid/systemslibrarian/crypto-lab-example.git'), null);
  assert.equal(discoverRepositories([dir]).repositories.get('systemslibrarian/crypto-lab-example')[0].directory, dir);
});

test('shared catalog parsers are safe imports and agree on supplied membership', () => {
  const html = '<a class="project-card" data-category="math" href="https://systemslibrarian.github.io/crypto-lab-fixture/" data-implements="N/A"><span class="project-title">A &amp; B</span><p class="project-copy">Exact card.</p></a>';
  assert.equal(cards(html)[0].title, 'A & B'); assert.equal(readCards(html).get('crypto-lab-fixture').title, 'A & B');
  assert.equal(parseFrontMatterChecked('title: Teaching\nexhibits:\n  - fixture', 'fixture.md').metadata.exhibits[0], 'fixture');
  assert.ok(parseFrontMatterChecked('invalid syntax', 'fixture.md').errors.length);
  assert.deepEqual(parseFrontMatterChecked('title: Valid', 'fixture.md').errors, []);
});

test('commands require explicit valid arguments and expose records-only coverage limits', () => {
  assert.equal(parseArgs(['check', '--records-only']).recordsOnly, true);
  assert.equal(parseArgs(['check', '--sources']).recordsOnly, false);
  assert.throws(() => parseArgs(['deploy'])); assert.throws(() => parseArgs(['write', '--repositories']));
});


test('immutable commit and blob reads ignore local Git replacement objects', t => {
  const { dir, git } = repo(t);
  fs.writeFileSync(path.join(dir, 'index.html'), '<p>Original pinned words.</p>\n'); git('add', '.'); git('commit', '-qm', 'original');
  const original = git('rev-parse', 'HEAD'), originalBlob = git('rev-parse', 'HEAD:index.html');
  fs.writeFileSync(path.join(dir, 'index.html'), '<p>Replacement words.</p>\n'); git('add', '.'); git('commit', '-qm', 'replacement');
  const replacement = git('rev-parse', 'HEAD'), replacementBlob = git('rev-parse', 'HEAD:index.html');
  git('replace', original, replacement);
  assert.equal(git('show', original + ':index.html'), '<p>Replacement words.</p>', 'Control proves ordinary Git follows replacement');
  let tree = pinnedTree(dir, original);
  assert.equal(tree.sha, original); assert.equal(tree.entries[0].objectOid, originalBlob);
  assert.equal(pinnedBlobs(dir, tree.entries).get(originalBlob).toString(), '<p>Original pinned words.</p>\n');
  git('replace', '-d', original); git('replace', originalBlob, replacementBlob);
  assert.equal(git('cat-file', 'blob', originalBlob), '<p>Replacement words.</p>', 'Control proves ordinary blob read follows replacement');
  tree = pinnedTree(dir, original);
  assert.equal(pinnedBlobs(dir, tree.entries).get(originalBlob).toString(), '<p>Original pinned words.</p>\n');
});
