'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { cards } = require('../tools/catalog-sync.js');
const { hubCardSources, capture } = require('../tools/teaching-reference.js');

const SLUG = 'crypto-lab-hub-pin-control';
const card = (slug = SLUG, copy = 'Published teaching description.') =>
  `<a class="project-card" data-category="education" href="https://systemslibrarian.github.io/${slug}/" data-implements="N/A" data-implementation="Educational control"><span class="project-title">Hub pin control</span><p class="project-copy">${copy}</p></a>`;

function hub(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'teaching-hub-pin-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', ['-C', directory, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-q', '-b', 'main');
  git('config', 'user.name', 'Synthetic hub control');
  git('config', 'user.email', 'fixture@example.invalid');
  git('remote', 'add', 'origin', 'https://github.com/systemslibrarian/crypto-lab.git');
  const index = path.join(directory, 'index.html');
  fs.writeFileSync(index, 'Published prologue\n' + card() + '\n');
  git('add', 'index.html'); git('commit', '-qm', 'published synthetic catalog');
  const published = git('rev-parse', 'HEAD');
  git('update-ref', 'refs/remotes/origin/main', published);
  git('symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/main');
  return { directory, git, index, published };
}

function record(fixture, ref, slug = SLUG) {
  const item = cards(fs.readFileSync(fixture.index, 'utf8')).find(entry => entry.slug === slug);
  return capture(item, [], { catalog: null, counsel: null, worksheets: [], corpusGap: null }, null,
    { generatorHash: 'a'.repeat(64), ref, reused: 0, extracted: 0, hubCards: hubCardSources(fixture.directory, ref) });
}

test('a diverged unpublished hub HEAD pins unchanged cards to the selected remote commit and its line numbers', t => {
  const f = hub(t);
  fs.writeFileSync(f.index, 'Local-only reference link\nAnother local prologue\n' + card() + '\n');
  f.git('add', 'index.html'); f.git('commit', '-qm', 'unpublished local reference');
  const local = f.git('rev-parse', 'HEAD'); assert.notEqual(local, f.published);
  for (const ref of ['origin/main', 'origin/HEAD', 'refs/remotes/origin/main']) {
    const source = hubCardSources(f.directory, ref).get(SLUG);
    assert.equal(source?.indexedSha, f.published);
    assert.equal(source.startLine, 2);
    assert.equal(source.endLine, 2);
    assert.equal(source.url, `https://github.com/systemslibrarian/crypto-lab/blob/${f.published}/index.html#L2`);
    assert.ok(!source.url.includes(local));
    assert.equal(record(f, ref).summary.source.indexedSha, f.published);
  }
});

test('dirty and staged changed cards retain an explicit pin gap and no source URL', t => {
  const f = hub(t); fs.writeFileSync(f.index, card(SLUG, 'Unpublished changed wording.') + '\n');
  for (const stage of [false, true]) {
    if (stage) f.git('add', 'index.html');
    const before = f.git('status', '--porcelain');
    assert.equal(hubCardSources(f.directory, 'origin/main').has(SLUG), false);
    const out = record(f, 'origin/main');
    assert.equal(out.summary.source, null);
    assert.ok(out.gaps.some(gap => gap.kind === 'hub-summary-source-unpinned'));
    assert.equal(f.git('status', '--porcelain'), before);
  }
});

test('a locally committed changed card is still unpublished and cannot receive a HEAD source URL', t => {
  const f = hub(t); fs.writeFileSync(f.index, card(SLUG, 'Locally committed changed wording.') + '\n');
  f.git('add', 'index.html'); f.git('commit', '-qm', 'unpublished card edit');
  const out = record(f, 'origin/HEAD');
  assert.equal(out.summary.source, null);
  assert.ok(out.gaps.some(gap => gap.kind === 'hub-summary-source-unpinned'));
});

test('a new unpublished card has a pin gap while an unchanged published sibling retains its pin', t => {
  const f = hub(t), added = 'crypto-lab-local-only-control';
  fs.writeFileSync(f.index, card() + '\n' + card(added) + '\n');
  f.git('add', 'index.html'); f.git('commit', '-qm', 'unpublished new card');
  const pins = hubCardSources(f.directory, 'origin/main');
  assert.equal(pins.get(SLUG)?.indexedSha, f.published);
  assert.equal(pins.has(added), false);
  assert.equal(record(f, 'origin/main', added).summary.source, null);
  assert.ok(record(f, 'origin/main', added).gaps.some(gap => gap.kind === 'hub-summary-source-unpinned'));
});

test('missing selected remote refs never fall back to readable local HEAD', t => {
  const f = hub(t);
  f.git('symbolic-ref', '--delete', 'refs/remotes/origin/HEAD');
  f.git('update-ref', '-d', 'refs/remotes/origin/main');
  assert.equal(f.git('rev-parse', 'HEAD'), f.published);
  for (const ref of ['origin/HEAD', 'origin/main', 'origin/absent']) {
    assert.equal(hubCardSources(f.directory, ref).size, 0);
    const out = record(f, ref); assert.equal(out.summary.source, null);
    assert.ok(out.gaps.some(gap => gap.kind === 'hub-summary-source-unpinned'));
  }
});

test('unreadable immutable hub blobs retain the source pin gap', t => {
  const f = hub(t), blob = f.git('rev-parse', f.published + ':index.html');
  const object = path.join(f.directory, '.git', 'objects', blob.slice(0, 2), blob.slice(2));
  assert.ok(fs.existsSync(object), 'Only this synthetic fixture object is removed');
  fs.rmSync(object);
  assert.equal(hubCardSources(f.directory, 'origin/main').size, 0);
  const out = record(f, 'origin/main'); assert.equal(out.summary.source, null);
  assert.ok(out.gaps.some(gap => gap.kind === 'hub-summary-source-unpinned'));
});

test('local HEAD or raw commit selections do not establish published hub source identity', t => {
  const f = hub(t);
  for (const ref of ['HEAD', f.published, 'main', 'origin/main~0']) {
    assert.equal(hubCardSources(f.directory, ref).size, 0);
    const out = record(f, ref); assert.equal(out.summary.source, null);
    assert.ok(out.gaps.some(gap => gap.kind === 'hub-summary-source-unpinned'));
  }
});

test('an origin HEAD alias pointing at an unpublished local branch cannot manufacture a remote pin', t => {
  const f = hub(t);
  fs.writeFileSync(f.index, card(SLUG, 'Unpublished branch wording.') + '\n');
  f.git('add', 'index.html'); f.git('commit', '-qm', 'unpublished local branch');
  f.git('symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/heads/main');
  assert.equal(hubCardSources(f.directory, 'origin/HEAD').size, 0);
  assert.equal(record(f, 'origin/HEAD').summary.source, null);
  assert.ok(record(f, 'origin/HEAD').gaps.some(gap => gap.kind === 'hub-summary-source-unpinned'));
});

test('the captured remote summary pin participates in cache input identity even when card bytes are unchanged', t => {
  const f = hub(t), first = record(f, 'origin/main');
  fs.writeFileSync(path.join(f.directory, 'README.md'), 'Published maintenance documentation.\n');
  f.git('add', 'README.md'); f.git('commit', '-qm', 'next published remote revision');
  const next = f.git('rev-parse', 'HEAD'); f.git('update-ref', 'refs/remotes/origin/main', next);
  const second = record(f, 'origin/main');
  assert.equal(first.summary.source.cardSha256, second.summary.source.cardSha256);
  assert.notEqual(first.summary.source.indexedSha, second.summary.source.indexedSha);
  assert.notEqual(first.inputHash, second.inputHash);
});
