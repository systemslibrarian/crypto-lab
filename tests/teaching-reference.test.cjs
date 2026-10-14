'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('node:child_process');
const reference = require('../tools/teaching-reference.js');

function fixture(t) {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'teaching-reference-integration-'));
  t.after(() => fs.rmSync(parent, { recursive: true, force: true }));
  const root = path.join(parent, 'hub'); fs.mkdirSync(path.join(root, 'tools'), { recursive: true });
  fs.mkdirSync(path.join(root, 'teach', '_src', 'modules'), { recursive: true });
  fs.writeFileSync(path.join(root, 'tools', 'catalog-reviewed.json'), '{}\n');
  const slugs = ['crypto-lab-root-control', 'crypto-lab-nested-control'];
  fs.writeFileSync(path.join(root, 'index.html'), slugs.map((slug, i) => `<a class="project-card" data-category="education" href="https://systemslibrarian.github.io/${slug}/" data-implements="${i ? 'N/A' : 'SHA-256@src/hash.ts:1'}" data-implementation="Educational control"><span class="project-title">${i ? 'Nested control' : 'Root control'}</span><p class="project-copy">Restricted educational demo.</p></a>`).join('\n'));
  const repos = slugs.map((slug, i) => {
    const dir = path.join(parent, 'checkout-' + i); fs.mkdirSync(dir); const git = (...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    git('init', '-q'); git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.invalid');
    git('remote', 'add', 'origin', 'https://github.com/systemslibrarian/' + slug + '.git');
    fs.mkdirSync(path.join(dir, 'src')); fs.mkdirSync(path.join(dir, 'demo', 'nested'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), '<h1>Source wording</h1>\n<p>Not production crypto. A &amp; B remain exact.</p>\n');
    fs.writeFileSync(path.join(dir, 'README.md'), '# Teaching\n\nAssume a restricted model.\n');
    fs.writeFileSync(path.join(dir, 'src', 'hash.ts'), "export function digest(data: Uint8Array) { return crypto.subtle.digest('SHA-256', data); }\n");
    fs.writeFileSync(path.join(dir, 'src', 'ui.ts'), 'export const warning = "Do not use this for production encryption.";\n');
    if (i) { fs.writeFileSync(path.join(dir, 'demo', 'nested', 'index.html'), '<p>Nested teaching explanation.</p>\n'); fs.writeFileSync(path.join(dir, 'demo', 'nested', 'engine.wasm'), Buffer.from([0, 97, 115, 109, 1, 0, 0, 0])); }
    git('add', '.'); git('commit', '-qm', 'source');
    const pin = () => { const sha = git('rev-parse', 'HEAD'); git('update-ref', 'refs/remotes/origin/main', sha); git('symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/main'); return sha; };
    return { dir, git, pin, sha: pin(), slug };
  });
  return { parent, root, repos, build: previous => reference.build(root, [parent], 'origin/HEAD', previous) };
}

test('deterministic full membership, exact indexed source, root HTML and nested WASM gaps', t => {
  const f = fixture(t), a = f.build(), b = f.build();
  assert.equal(reference.json(a.records), reference.json(b.records)); assert.equal(a.markdown, b.markdown);
  assert.equal(a.records.length, 2); assert.equal(a.manifest.coverage.catalogLabs, 2);
  assert.deepEqual(a.records.map(r => r.source.indexedSha), f.repos.map(r => r.sha));
  assert.ok(a.records[0].sections.some(s => s.file === 'index.html' && s.sourceText.includes('A &amp; B')));
  assert.ok(a.records[1].sections.some(s => s.file === 'demo/nested/index.html' && s.sourceText.includes('Nested teaching')));
  assert.ok(a.records[1].files.some(file => file.path.endsWith('.wasm') && file.sha256 === reference.sha256(Buffer.from([0,97,115,109,1,0,0,0]))));
  assert.ok(a.records[1].gaps.some(g => /wasm|binary|opaque/i.test(g.kind + ' ' + g.reason)));
  assert.ok(a.records[0].claimCodeLinks[0].url.includes('/blob/' + f.repos[0].sha + '/src/hash.ts#L1'));
  assert.equal(a.records[0].claimCodeLinks[0].state, 'readable');
});

test('unchanged labs reuse exact records; extraction never advances the imported review SHA', t => {
  const f = fixture(t);
  fs.writeFileSync(path.join(f.root, 'tools', 'catalog-reviewed.json'), reference.json({ [f.repos[0].slug]: { commit: f.repos[0].sha, note: 'Algorithm anchor reviewed only.', add: ['SHA-256@src/hash.ts:1'] } }));
  const before = f.build(), repeat = f.build(before.records);
  assert.equal(repeat.reused, 2); assert.equal(reference.json(repeat.records), reference.json(before.records));
  fs.writeFileSync(path.join(f.repos[0].dir, 'src', 'hash.ts'), "export function digest(data: Uint8Array) { return crypto.subtle.digest('SHA-256', Uint8Array.from(data)); }\n");
  f.repos[0].git('add', 'src/hash.ts'); f.repos[0].git('commit', '-qm', 'change implementation'); const current = f.repos[0].pin();
  const after = f.build(before.records);
  assert.equal(after.reused, 1); assert.equal(after.records[0].source.indexedSha, current);
  assert.equal(after.records[0].review.lastReviewedSha, f.repos[0].sha);
  assert.equal(after.records[0].review.teachingReferenceReviewedSha, null);
  assert.ok(after.records[0].changeReport.trackedChanges.some(c => c.path === 'src/hash.ts' && c.needsReview));
  assert.equal(after.records[0].claimCodeLinks[0].verification, 'catalog-derived-anchor');
});

test('changed dependency, data, WASM and unexplained paths invalidate unchanged wording and all remain accounted', t => {
  const f = fixture(t), before = f.build(); const r = f.repos[1];
  const changed = ['package-lock.json', 'demo/nested/engine.wasm', 'challenge.dat', 'meaning.unknown'];
  fs.writeFileSync(path.join(r.dir, 'package-lock.json'), '{"lockfileVersion":3,"packages":{}}\n');
  fs.writeFileSync(path.join(r.dir, 'demo/nested/engine.wasm'), Buffer.from([0,97,115,109,2,0,0,0]));
  fs.writeFileSync(path.join(r.dir, 'challenge.dat'), Buffer.from([0,1])); fs.writeFileSync(path.join(r.dir, 'meaning.unknown'), Buffer.from([0,2]));
  r.git('add', ...changed); r.git('commit', '-qm', 'non-wording inputs'); r.pin();
  const after = f.build(before.records), report = after.records[1].changeReport;
  assert.deepEqual(report.trackedChanges.map(c => c.path).sort(), changed.sort());
  assert.ok(report.trackedChanges.every(c => c.needsReview));
  assert.ok(report.trackedChanges.some(c => c.category === 'wasm'));
  assert.equal(report.unchangedWordingInvalidated, true); assert.notEqual(report.state, 'unchanged');
});

test('missing and unreadable sources retain catalog membership and distinct evidence', t => {
  const f = fixture(t); f.repos[0].git('remote', 'remove', 'origin'); f.repos[1].git('symbolic-ref', '--delete', 'refs/remotes/origin/HEAD');
  const out = f.build(); assert.equal(out.records.length, 2);
  assert.equal(out.records[0].source.state, 'missing'); assert.equal(out.records[1].source.state, 'unreadable');
  assert.equal(out.manifest.coverage.missingSources, 1); assert.equal(out.manifest.coverage.unreadableSources, 1);
  assert.ok(out.markdown.includes('No wording extracted')); assert.ok(out.markdown.includes('unavailable'));
});

test('records, render and membership hashes reject omission, source-anchor tampering and changed wording', t => {
  const f = fixture(t), out = f.build(); reference.saveGenerated(f.root, out);
  const dir = path.join(f.root, 'teaching-reference'); const loaded = reference.loadRecords(dir);
  assert.equal(reference.render(loaded.records), fs.readFileSync(path.join(f.root, 'TEACHING-REFERENCE.md'), 'utf8'));
  const record = JSON.parse(JSON.stringify(out.records[0])); record.sections[0].sourceText += ' corrected';
  assert.throws(() => reference.validateRecord(record), /hash mismatch/);
  const anchor = JSON.parse(JSON.stringify(out.records[0])); anchor.sections[0].endLine = 999999;
  assert.throws(() => reference.validateRecord(anchor), /source anchor/);
  fs.writeFileSync(path.join(dir, 'records', 'extra.json'), '{}'); assert.throws(() => reference.loadRecords(dir), /Unmanifested/);
  fs.rmSync(path.join(dir, 'records', 'extra.json'));
  fs.rmSync(path.join(dir, 'records', out.records[0].id + '.json')); assert.throws(() => reference.loadRecords(dir));
});

test('record-only check makes no current-source claim; source check detects moved refs', t => {
  const f = fixture(t), out = f.build(); reference.saveGenerated(f.root, out);
  assert.equal(reference.main(['check', '--records-only', '--root', f.root]), 0);
  fs.writeFileSync(path.join(f.repos[0].dir, 'README.md'), '# Teaching\n\nChanged warning.\n'); f.repos[0].git('add', 'README.md'); f.repos[0].git('commit', '-qm', 'new teaching'); f.repos[0].pin();
  assert.throws(() => reference.main(['check', '--sources', '--root', f.root, '--repositories', f.parent]), /changed/);
});

test('export manifest proves bounded reconstruction of all labs and full all-in-one without overwriting', t => {
  const f = fixture(t), out = f.build(); reference.saveGenerated(f.root, out);
  const target = path.join(f.parent, 'packets');
  assert.equal(reference.main(['export', '--root', f.root, '--out', target, '--max-bytes', '1000']), 0);
  const manifest = JSON.parse(fs.readFileSync(path.join(target, 'manifest.json')));
  assert.equal(manifest.documents.length, 3);
  for (const file of fs.readdirSync(target).filter(name => name !== 'manifest.json')) assert.ok(fs.statSync(path.join(target, file)).size <= 1000);
  assert.throws(() => reference.main(['export', '--root', f.root, '--out', target]), /new or empty/);
});


test('compare computes a fresh comparison against identical bytes instead of reusing historical initial additions', t => {
  const f = fixture(t), out = f.build(); reference.saveGenerated(f.root, out);
  const target = path.join(f.parent, 'comparison.json');
  assert.ok(out.records[0].changeReport.trackedChanges.length, 'Initial capture accounts for tracked files');
  assert.equal(reference.main(['compare', '--against', path.join(f.root, 'teaching-reference'), '--root', f.root, '--repositories', f.parent, '--out', target]), 0);
  const report = JSON.parse(fs.readFileSync(target));
  assert.ok(report.comparisons.every(c => c.state === 'unchanged'));
  assert.ok(report.comparisons.every(c => c.wordingChanged.length === 0 && c.trackedChanges.length === 0));
  assert.equal(report.reviewPinsAdvanced, false);
  assert.equal(reference.json(reference.loadRecords(path.join(f.root, 'teaching-reference')).records), reference.json(out.records), 'Comparison never rewrites baseline records');
});

test('manifest rejects all aggregate coverage claims that disagree with exact records', t => {
  const f = fixture(t), out = f.build(); reference.saveGenerated(f.root, out);
  const dir = path.join(f.root, 'teaching-reference'), file = path.join(dir, 'manifest.json');
  for (const field of ['readableSources', 'missingSources', 'unreadableSources', 'incompleteSources', 'staleSources', 'trackedFiles', 'sourceSections']) {
    const manifest = JSON.parse(reference.json(out.manifest)); manifest.coverage[field]++;
    fs.writeFileSync(file, reference.json(manifest));
    assert.throws(() => reference.loadRecords(dir), /aggregate coverage/);
  }
  fs.writeFileSync(file, reference.json(out.manifest)); assert.equal(reference.loadRecords(dir).records.length, 2);
});


test('cached records are checked against actual immutable tree membership, object identities and source wording', t => {
  const f = fixture(t), initial = f.build(), valid = initial.records[0];
  const { pinnedTree, pinnedBlobs } = require('../tools/clone-source.js');
  const tree = pinnedTree(f.repos[0].dir), blobs = pinnedBlobs(f.repos[0].dir, tree.entries);
  assert.equal(reference.verifyCapturedRecord(valid, tree, blobs), true);
  const omissions = JSON.parse(reference.json(valid)); omissions.files = []; omissions.sections = []; omissions.symbols = []; omissions.citations = []; omissions.claimCodeLinks = [];
  assert.throws(() => reference.verifyCapturedRecord(omissions, tree, blobs));
  const forged = JSON.parse(reference.json(valid)); forged.sections[0].sourceText = 'Invented learner claim.'; forged.sections[0].sha256 = reference.sha256(forged.sections[0].sourceText);
  assert.equal(reference.validateRecord(forged), true, 'Saved JSON consistency alone cannot prove correspondence');
  assert.throws(() => reference.verifyCapturedRecord(forged, tree, blobs), /exact captured source slice/);
  const changedHash = JSON.parse(reference.json(valid)); changedHash.files[0].sha256 = '0'.repeat(64);
  assert.throws(() => reference.verifyCapturedRecord(changedHash, tree, blobs), /hash differs/);
  const treeMismatch = JSON.parse(reference.json(valid)); treeMismatch.source.treeOid = '0'.repeat(40);
  assert.throws(() => reference.verifyCapturedRecord(treeMismatch, tree, blobs), /tree inventory/);
  const after = f.build([forged, initial.records[1]]);
  assert.equal(after.reused, 1); assert.equal(after.records[0].source.state, 'unreadable');
  assert.ok(after.records[0].gaps.some(g => /Cached wording/.test(g.reason || '')));
  assert.equal(after.records.length, 2, 'Bad cache does not drop a catalog member');
});

test('cached summaries cannot retain an unpublished hub pin or altered prose under an otherwise valid input hash', t => {
  const f = fixture(t);
  const git = (...args) => execFileSync('git', ['-C', f.root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-q', '-b', 'main'); git('config', 'user.name', 'Synthetic hub'); git('config', 'user.email', 'fixture@example.invalid');
  git('remote', 'add', 'origin', 'https://github.com/systemslibrarian/crypto-lab.git');
  git('add', 'index.html', 'tools/catalog-reviewed.json'); git('commit', '-qm', 'published hub fixture');
  const published = git('rev-parse', 'HEAD');
  git('update-ref', 'refs/remotes/origin/main', published); git('symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/main');
  fs.writeFileSync(path.join(f.root, 'README.md'), 'Unpublished local tooling documentation.\n');
  git('add', 'README.md'); git('commit', '-qm', 'local-only documentation'); const unpublished = git('rev-parse', 'HEAD');
  const valid = f.build(); assert.equal(valid.records[0].summary.source.indexedSha, published);
  for (const corrupt of [
    record => { record.summary.source.indexedSha = unpublished; record.summary.source.url = record.summary.source.url.replace(published, unpublished); },
    record => { record.summary.text = 'An invented guarantee which the catalog does not make.'; },
  ]) {
    const prior = JSON.parse(reference.json(valid.records)); corrupt(prior[0]);
    assert.equal(reference.validateRecord(prior[0]), true, 'A structurally valid saved record alone does not establish the real summary');
    const unchangedBadRecord = reference.json(prior[0]), refreshed = f.build(prior);
    assert.equal(refreshed.records[0].summary.source.indexedSha, published);
    assert.equal(refreshed.records[0].summary.text, valid.records[0].summary.text);
    assert.equal(refreshed.reused, 1, 'Only the unaltered sibling record is reused');
    assert.equal(reference.json(prior[0]), unchangedBadRecord, 'Historical input evidence is not mutated');
  }
});

test('source and reference anchors reject missing pins, unknown states, misplaced sections and unsupported verified links', t => {
  const f = fixture(t), record = f.build().records[0];
  const corruptions = [
    r => { r.source.indexedSha = null; }, r => { r.source.treeOid = null; },
    r => { r.files[0].state = 'clean-magic'; }, r => { r.review.teachingReferenceReviewedSha = 'short'; },
    r => { r.symbols[0].file = 'absent.ts'; }, r => { r.symbols[0].line = 999999; },
    r => { r.citations.push({ file: 'absent.md', line: 1, url: 'https://example.invalid' }); },
    r => { r.claimCodeLinks[0].sourceSha = '0'.repeat(40); },
    r => { r.claimCodeLinks[0].url = 'https://github.com/owner/wrong/blob/' + r.source.indexedSha + '/src/hash.ts#L1'; },
    r => { r.claimCodeLinks[0].verification = 'verified'; },
    r => { const section = r.sections[0]; r.files.find(file => file.path !== section.file).sectionIds.push(section.id); },
  ];
  for (const mutate of corruptions) { const candidate = JSON.parse(reference.json(record)); mutate(candidate); assert.throws(() => reference.validateRecord(candidate)); }
});


test('full reference keeps test-source inventory separate from learner copy while preserving all exact machine sections', t => {
  const f = fixture(t), r = f.repos[0]; fs.mkdirSync(path.join(r.dir, 'tests'));
  fs.writeFileSync(path.join(r.dir, 'tests', 'lesson.test.ts'), 'const expected = "Internal test sentence, not displayed learner copy.";\n');
  r.git('add', 'tests/lesson.test.ts'); r.git('commit', '-qm', 'test source'); r.pin();
  const result = f.build(), record = result.records[0];
  assert.ok(record.sections.some(s => s.sourceText.includes('Internal test sentence')));
  assert.ok(result.markdown.includes('tests/lesson.test.ts'));
  assert.ok(!result.markdown.includes('Internal test sentence'));
  assert.ok(result.markdown.includes('Test and verification fixture strings are retained'));
  assert.ok(result.markdown.includes('A &amp; B'));
});


test('historical generic review anchors require exact unchanged file objects and never advance human review', t => {
  const f = fixture(t), repo = f.repos[0];
  fs.writeFileSync(path.join(repo.dir, 'src', 'hash.ts'), 'export function digest(data: Uint8Array) { return perform(data); }\n');
  repo.git('add', 'src/hash.ts'); repo.git('commit', '-qm', 'generic reviewed operation'); const reviewedSha = repo.pin();
  fs.writeFileSync(path.join(f.root, 'tools/catalog-reviewed.json'), reference.json({ [repo.slug]: { commit: reviewedSha, note: 'Review only this generic operation.', add: ['SHA-256@src/hash.ts:1'] } }));
  const original = f.build(); assert.equal(original.records[0].claimCodeLinks[0].state, 'readable');
  assert.equal(original.records[0].claimCodeLinks[0].verification, 'existing-reviewed-algorithm-anchor');
  fs.writeFileSync(path.join(repo.dir, 'AGENTS.md'), 'Maintainer instructions.\n'); repo.git('add', 'AGENTS.md'); repo.git('commit', '-qm', 'unrelated maintenance'); const currentSha = repo.pin();
  const retained = f.build(original.records); const record = retained.records[0], link = record.claimCodeLinks[0];
  assert.equal(record.source.indexedSha, currentSha); assert.equal(record.review.lastReviewedSha, reviewedSha);
  assert.equal(record.review.teachingReferenceReviewedSha, null);
  assert.equal(link.state, 'readable'); assert.equal(link.verification, 'historical-reviewed-anchor-unchanged-file');
  assert.match(link.reviewScope, /not a new dependency, caller or learner-wording review/);
  assert.equal(record.review.unchangedReviewedAnchorFiles[0].objectOid, record.files.find(f => f.path === 'src/hash.ts').objectOid);
  assert.equal(f.build(retained.records).reused, 2);
  fs.writeFileSync(path.join(repo.dir, 'src', 'hash.ts'), 'export function digest(data: Uint8Array) { return another(data); }\n');
  repo.git('add', 'src/hash.ts'); repo.git('commit', '-qm', 'changed reviewed file'); repo.pin();
  const changed = f.build(retained.records).records[0];
  assert.equal(changed.claimCodeLinks[0].state, 'failed'); assert.equal(changed.claimCodeLinks[0].verification, 'catalog-derived-anchor');
  assert.equal(changed.review.lastReviewedSha, reviewedSha);
  assert.equal(changed.review.unchangedReviewedAnchorFiles.length, 0);
});


test('nonprinting source characters get explicitly labelled presentation without altering exact machine wording or hashes', () => {
  const text = 'Exact\0source\u0007 word';
  const before = reference.sha256(text), displayed = reference.sourceBlock(text);
  assert.ok(displayed.includes('Control-character presentation'));
  assert.ok(displayed.includes('not') && displayed.includes('literal rendered learner wording'));
  assert.ok(displayed.includes('\\u0000') && displayed.includes('\\u0007'));
  assert.ok(!displayed.includes('\0')); assert.equal(reference.sha256(text), before);
  assert.ok(reference.sourceBlock('Ordinary exact wording.').includes('Ordinary exact wording.'));
});
