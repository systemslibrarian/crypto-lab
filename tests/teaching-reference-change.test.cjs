'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { compareRecords, buildPackets, verifyPackets } = require('../tools/teaching-reference-change');
const { classify } = require('../tools/corpus-freshness');

const A = 'a'.repeat(40), B = 'b'.repeat(40);
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
const file = (name, text, extra = {}) => ({ path: name, sha256: hash(text), state: 'readable', language: 'fixture', ...extra });
const section = (id, name, text) => ({ id, file: name, sha256: hash(text) });
const record = (files = [file('index.html', '<p>Exact teaching</p>')], sections = [section('intro', 'index.html', 'Exact teaching')]) =>
  ({ source: { indexedSha: A }, files, sections, review: { lastReviewedSha: A } });
const opts = changes => ({ changedPaths: changes, isAncestor: true });
const clone = value => structuredClone(value);
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
function canonical(v) {
  if (Array.isArray(v)) return v.map(canonical);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])]));
  return v;
}
// Re-sign a deliberately malformed fixture to reach structural validation after
// the trusted-manifest hash guard. This is not an authentication mechanism.
function resign(manifest) {
  const { manifestSha256, ...body } = manifest;
  manifest.manifestSha256 = hash(JSON.stringify(canonical(body)));
  return manifest;
}
const docs = () => [{ id: 'alpha', text: 'Aé界🌍\r\n\n# Exact source\n', recordSha256: hash('alpha-record') },
  { id: 'beta', text: 'e\u0301 stays decomposed\n', recordSha256: hash('beta-record') }];

test('safe classifier import does not scan corpus or exit the requiring process', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'teaching-import-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const invalid = path.join(dir, 'corpus.json'); fs.writeFileSync(invalid, '{invalid-json');
  const modulePath = path.resolve(__dirname, '../tools/corpus-freshness.js');
  const child = spawnSync(process.execPath, ['-e', `require(${JSON.stringify(modulePath)}); process.stdout.write('imported');`],
    { encoding: 'utf8', env: { ...process.env, CRYPTO_COUNSEL_CORPUS: invalid } });
  assert.equal(child.status, 0); assert.equal(child.stdout, 'imported'); assert.equal(child.stderr, '');
});

test('unchanged records preserve SHA, review and caller input without claiming a review', () => {
  const before = freeze(record()); const after = freeze(clone(before));
  const result = compareRecords(before, after, opts([]));
  assert.equal(result.state, 'unchanged'); assert.deepEqual(result.trackedChanges, []);
  assert.deepEqual(result.wordingChanged, []); assert.equal(result.unchangedWordingInvalidated, false);
  assert.equal(result.reviewedSha, A); assert.equal(result.fromSha, A); assert.equal(result.toSha, A);
  const never = record(); never.review.lastReviewedSha = null;
  assert.equal(compareRecords(never, never, opts([])).reviewedSha, null);
  assert.equal(compareRecords(never, never, opts([])).state, 'unchanged');
});

test('dependency-only movement invalidates prose even while old corpus scope reports current', () => {
  const before = record([file('package-lock.json', 'old')], []);
  const after = record([file('package-lock.json', 'new')], []); after.source.indexedSha = B;
  const result = compareRecords(before, after, opts([{ path: 'package-lock.json', status: 'M' }]));
  assert.equal(result.state, 'needs-review'); assert.equal(result.unchangedWordingInvalidated, true);
  assert.equal(result.narrowScopeComparison.result.state, 'CURRENT');
  assert.equal(classify({ lab_commit: A }, ['package-lock.json'], true).state, 'CURRENT');
  assert.equal(result.reviewedSha, A); assert.equal(after.review.lastReviewedSha, A);
});

test('indexed-to-indexed narrow comparison cannot claim freshness of an earlier human review', () => {
  const reviewedSha = 'c'.repeat(40);
  for (const changed of [null, 'package-lock.json', 'src/solver.ts']) {
    const files = [file('index.html', 'Same learner-facing words')];
    if (changed) files.push(file(changed, 'old implementation'));
    const before = record(files, [section('intro', 'index.html', 'Same learner-facing words')]);
    const after = clone(before); after.source.indexedSha = B;
    before.review.lastReviewedSha = reviewedSha; after.review.lastReviewedSha = reviewedSha;
    if (changed) after.files.find(f => f.path === changed).sha256 = hash('new implementation');
    const rows = changed ? [{ path: changed, status: 'M' }] : [];
    const result = compareRecords(freeze(before), freeze(after), opts(rows));
    const narrow = result.narrowScopeComparison;
    assert.equal(result.reviewedSha, reviewedSha); assert.deepEqual(result.wordingChanged, []);
    assert.equal(narrow.fromSha, A); assert.equal(narrow.toSha, B); assert.equal(narrow.range, `${A}..${B}`);
    assert.equal(narrow.appliesToLastReviewedSha, false); assert.equal(narrow.reviewFreshness, 'not-measured');
    assert.equal(narrow.result.state, changed === 'src/solver.ts' ? 'STALE' : 'CURRENT');
    assert.equal(result.state, changed ? 'needs-review' : 'unchanged');
    assert.equal(result.unchangedWordingInvalidated, !!changed);
  }
  const matching = compareRecords(record(), record(), opts([])).narrowScopeComparison;
  assert.equal(matching.appliesToLastReviewedSha, true); assert.equal(matching.reviewFreshness, 'limited-corpus-scope-only');
  const initial = compareRecords(null, record(), opts([])).narrowScopeComparison;
  assert.equal(initial.range, null); assert.equal(initial.result, null); assert.equal(initial.appliesToLastReviewedSha, false);
  assert.equal(initial.reviewFreshness, 'not-measured');
  const failed = record(); failed.source.state = 'stale';
  assert.equal(compareRecords(record(), failed, opts([])).narrowScopeComparison.reviewFreshness, 'not-measured');
});

test('root HTML, nested runtime code, Rust and C all invalidate unchanged words', () => {
  for (const name of ['index.html', 'demos/nested/src/main.ts', 'crates/core/src/lib.rs', 'wasm/src/bridge.c']) {
    const before = record([file(name, 'first')], [section('explanation', name, 'Words stay')]);
    const after = record([file(name, 'second')], [section('explanation', name, 'Words stay')]); after.source.indexedSha = B;
    const result = compareRecords(before, after, opts([{ path: name, status: 'M' }]));
    assert.equal(result.trackedChanges[0].category, 'source', name);
    assert.equal(result.unchangedWordingInvalidated, true, name); assert.equal(result.state, 'needs-review', name);
  }
});

test('nested npm shrinkwrap and non-npm dependency manifests remain in the denominator', () => {
  const names = ['web-demo/npm-shrinkwrap.json', 'nested/package-lock.json', 'Cargo.lock', 'wasm/vendor/Cargo.toml', 'pnpm-lock.yaml'];
  const before = record(names.map(n => file(n, 'first')), []);
  const after = record(names.map(n => file(n, 'second')), []); after.source.indexedSha = B;
  const result = compareRecords(before, after, opts([]));
  assert.deepEqual(result.trackedChanges.map(c => c.path), [...names].sort());
  assert(result.trackedChanges.every(c => c.category === 'dependency' && c.needsReview));
  assert.equal(result.unchangedWordingInvalidated, true);
});

test('data, binaries, tests, build configuration and unknown tracked paths need review', () => {
  const names = ['data/vectors.json', 'public/solver.wasm', 'tests/claim.test.ts', '.github/workflows/build.yml', 'opaque.odd'];
  const before = record(names.map(n => file(n, 'first')), []);
  const after = record(names.map(n => file(n, 'second')), []);
  const result = compareRecords(before, after, opts(names.map(path => ({ path, status: 'M' }))));
  assert.deepEqual(Object.fromEntries(result.trackedChanges.map(c => [c.path, c.category])), {
    '.github/workflows/build.yml': 'configuration', 'data/vectors.json': 'data', 'opaque.odd': 'unknown',
    'public/solver.wasm': 'wasm', 'tests/claim.test.ts': 'test',
  });
  assert(result.trackedChanges.every(c => c.needsReview && c.beforeHash !== c.afterHash));
  assert.equal(result.unchangedWordingInvalidated, true);
});

test('known maintenance changes are accounted for and never advance the review pin', () => {
  const before = record([file('AGENTS.md', 'first'), file('index.html', 'same')]);
  const after = record([file('AGENTS.md', 'second'), file('index.html', 'same')]); after.source.indexedSha = B;
  const result = compareRecords(before, after, opts([{ path: 'AGENTS.md', status: 'M' }]));
  assert.equal(result.state, 'unchanged'); assert.equal(result.reviewedSha, A);
  assert.equal(result.trackedChanges.length, 1); assert.equal(result.trackedChanges[0].category, 'maintenance');
  assert.equal(result.trackedChanges[0].needsReview, false); assert.equal(result.unchangedWordingInvalidated, false);
});

test('wording changes retain added/deleted/changed stable IDs and both hashes', () => {
  const before = record([file('README.md', 'old')], [section('same', 'README.md', 'old'), section('deleted', 'README.md', 'gone')]);
  const after = record([file('README.md', 'new')], [section('same', 'README.md', 'new'), section('added', 'README.md', 'arrived')]);
  const result = compareRecords(before, after, opts([{ path: 'README.md', status: 'M' }]));
  assert.deepEqual(result.wordingChanged.map(c => c.id), ['added', 'deleted', 'same']);
  assert.equal(result.wordingChanged[0].beforeHash, null); assert.equal(result.wordingChanged[1].afterHash, null);
  assert.equal(result.wordingChanged[2].beforeHash, hash('old')); assert.equal(result.wordingChanged[2].afterHash, hash('new'));
  assert.equal(result.unchangedWordingInvalidated, false); assert.equal(result.state, 'needs-review');
});

test('maintenance paths cannot waive missing hash, unreadable file or unknown source evidence', () => {
  const before = record([file('AGENTS.md', 'old')], []);
  for (const altered of [{ sha256: null }, { state: 'unreadable' }, { state: 'opaque' }]) {
    const after = record([file('AGENTS.md', 'new', altered)], []);
    const result = compareRecords(before, after, opts([{ path: 'AGENTS.md', status: 'M' }]));
    assert.equal(result.trackedChanges[0].needsReview, true); assert.equal(result.unchangedWordingInvalidated, true);
  }
  const missingHistory = compareRecords(before, record([file('AGENTS.md', 'new')], []), { changedPaths: null, isAncestor: true });
  assert.equal(missingHistory.trackedChanges[0].needsReview, true);
  const invalidSource = record([file('AGENTS.md', 'new')], []); invalidSource.source.indexedSha = null;
  assert.equal(compareRecords(before, invalidSource, opts([])).trackedChanges[0].needsReview, true);
});

test('all manifest-union additions and deletes are accounted for even if Git omitted them', () => {
  const before = record([file('deleted.c', 'removed'), file('same.ts', 'unchanged')], []);
  const after = record([file('new.ts', 'added'), file('same.ts', 'unchanged')], []);
  const result = compareRecords(before, after, opts([]));
  assert.deepEqual(result.trackedChanges.map(c => [c.path, c.status]), [['deleted.c', 'D'], ['new.ts', 'A']]);
  assert.equal(result.trackedChanges[0].afterHash, null); assert.equal(result.trackedChanges[1].beforeHash, null);
  assert.equal(result.state, 'needs-review');
});

test('rename retains both path identities and immutable source hashes without false unreadability', () => {
  const before = record([file('old.ts', 'same')], []); const after = record([file('new.ts', 'same')], []);
  const result = compareRecords(before, after, opts([{ path: 'new.ts', status: 'R100', oldPath: 'old.ts' }]));
  assert.equal(result.state, 'needs-review'); assert.deepEqual(result.gaps, []);
  assert.deepEqual(result.trackedChanges.map(c => c.path), ['new.ts', 'old.ts']);
  assert.equal(result.trackedChanges[0].oldPath, 'old.ts'); assert.equal(result.trackedChanges[0].beforeHash, hash('same'));
  assert.equal(result.trackedChanges[0].afterHash, hash('same')); assert.equal(result.trackedChanges[1].afterHash, null);
});

test('copy records the old path without falsely declaring the original deleted', () => {
  const before = record([file('old.ts', 'same')], []); const after = record([file('old.ts', 'same'), file('copy.ts', 'same')], []);
  const result = compareRecords(before, after, opts([{ path: 'copy.ts', status: 'C100', oldPath: 'old.ts' }]));
  assert.equal(result.state, 'needs-review'); assert.deepEqual(result.gaps, []);
  assert.equal(result.trackedChanges.length, 1); assert.equal(result.trackedChanges[0].beforeHash, hash('same'));
});

test('genuine empty committed inventories are distinct from missing source and initial capture', () => {
  const empty = record([], []); const result = compareRecords(empty, empty, opts([]));
  assert.equal(result.state, 'unchanged'); assert.deepEqual(result.trackedChanges, []);
  assert.equal(compareRecords(null, empty, opts([])).state, 'needs-review');
  const missing = { source: { indexedSha: null }, review: { lastReviewedSha: null } };
  const unread = compareRecords(null, missing); assert.equal(unread.state, 'unknown');
  assert(unread.gaps.some(g => /indexed source SHA/.test(g))); assert(unread.gaps.some(g => /inventory/.test(g)));
});

test('missing diff and ancestry never become zero-change success', () => {
  const before = record();
  for (const options of [{ changedPaths: null, isAncestor: true }, { changedPaths: [], isAncestor: null }, {}]) {
    const result = compareRecords(before, clone(before), options);
    assert.equal(result.state, 'unreadable'); assert.equal(result.unchangedWordingInvalidated, true);
    assert(result.gaps.length > 0);
  }
  assert.equal(compareRecords(before, before, { changedPaths: [], isAncestor: false }).state, 'unpublished-review');
  assert.equal(compareRecords(before, before, { changedPaths: [], isAncestor: 'true' }).state, 'unreadable');
});

test('unlisted changed path is retained as unreadable instead of omitted', () => {
  const before = record(); const result = compareRecords(before, before, opts([{ path: 'hidden.runtime', status: 'M' }]));
  assert.equal(result.state, 'unreadable'); assert.equal(result.trackedChanges.length, 1);
  assert.equal(result.trackedChanges[0].path, 'hidden.runtime'); assert.equal(result.trackedChanges[0].category, 'unknown');
  assert.equal(result.trackedChanges[0].needsReview, true); assert.equal(result.trackedChanges[0].beforeHash, null);
});

test('missing, unreadable, malformed and duplicate inventories fail closed', () => {
  const before = record();
  const candidates = [
    { ...clone(before), files: null },
    { ...clone(before), sections: null },
    { ...clone(before), files: [{ ...before.files[0], sha256: null }] },
    { ...clone(before), files: [{ ...before.files[0], state: 'unreadable' }] },
    { ...clone(before), files: [{ ...before.files[0], state: 'UNREADABLE' }] },
    { ...clone(before), files: [{ ...before.files[0], state: undefined }] },
    { ...clone(before), files: [{ ...before.files[0], state: 'mysteriously-succeeded' }] },
    { ...clone(before), files: [before.files[0], before.files[0]] },
    { ...clone(before), sections: [before.sections[0], before.sections[0]] },
    { ...clone(before), sections: [{ ...before.sections[0], file: 'absent.ts' }] },
    { ...clone(before), sections: [{ ...before.sections[0], sha256: 'truncated' }] },
  ];
  for (const after of candidates) {
    const result = compareRecords(before, after, opts([]));
    assert.equal(result.state, 'unreadable', JSON.stringify(after)); assert(result.gaps.length > 0);
  }
});

test('unsupported language and opaque binary gaps survive unchanged-byte reuse', () => {
  const before = record([file('code.exotic', 'unknown', { state: 'unsupported', language: 'Exotic' }),
    file('public/solver.wasm', 'opaque', { state: 'opaque', language: 'WASM' })], []);
  const result = compareRecords(before, before, opts([]));
  assert.equal(result.state, 'unchanged'); assert.equal(result.gaps.length, 4);
  assert(result.gaps.every(g => /does not establish readable source/.test(g)));
  const after = clone(before); after.files[1].sha256 = hash('different opaque bytes');
  assert.equal(compareRecords(before, after, opts([])).unchangedWordingInvalidated, true);
});

test('stale, incomplete and failed source captures cannot reuse matching bytes as current evidence', () => {
  for (const extra of [{ state: 'incomplete' }, { state: 'stale' }, { state: 'UNREADABLE' }, { state: 'unknown' },
    { state: 'not-scanned' }, { state: 'partial' }, { state: {} }, { incomplete: true }, { error: 'capture failed' }]) {
    for (const side of ['before', 'after']) {
      const before = record(), after = record();
      Object.assign((side === 'before' ? before : after).source, extra);
      const result = compareRecords(freeze(before), freeze(after), opts([]));
      assert.equal(result.state, 'unreadable', `${side}: ${JSON.stringify(extra)}`);
      assert.equal(result.unchangedWordingInvalidated, true);
      assert.equal(result.reviewedSha, A); assert.deepEqual(result.wordingChanged, []);
      assert(result.gaps.some(g => /source capture/.test(g)));
    }
  }
  const before = record([file('AGENTS.md', 'old')], []), after = record([file('AGENTS.md', 'new')], []);
  after.source.state = 'stale';
  assert.equal(compareRecords(before, after, opts([{ path: 'AGENTS.md', status: 'M' }])).trackedChanges[0].needsReview, true);
  const readable = record(); readable.source.state = 'readable';
  assert.equal(compareRecords(readable, readable, opts([])).state, 'unchanged');
});

test('actual NUL-delimited Git inventories and changes preserve literal backslash and newline names', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'teaching-reference-paths-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const git = args => {
    const result = spawnSync('git', ['-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', ...args],
      { cwd: dir, encoding: 'buffer', env: { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' } });
    assert.equal(result.status, 0, result.stderr.toString()); return result.stdout;
  };
  git(['init', '-q']); git(['config', 'user.name', 'selftest']); git(['config', 'user.email', 'selftest@example.invalid']);
  const names = ['literal\\filename.ts', 'line\nfilename.ts'];
  for (const name of names) fs.writeFileSync(path.join(dir, name), 'before');
  git(['add', '--', ...names]); git(['commit', '-q', '-m', 'fixture before']);
  const fromSha = git(['rev-parse', 'HEAD']).toString().trim();
  for (const name of names) fs.writeFileSync(path.join(dir, name), 'after');
  git(['add', '--', ...names]); git(['commit', '-q', '-m', 'fixture after']);
  const toSha = git(['rev-parse', 'HEAD']).toString().trim();
  const capture = indexedSha => {
    const entries = git(['ls-tree', '-rz', '--full-tree', indexedSha]).toString().split('\0').filter(Boolean);
    const files = entries.map(entry => {
      const tab = entry.indexOf('\t'), name = entry.slice(tab + 1), header = entry.slice(0, tab).split(' ');
      assert.equal(header[1], 'blob');
      return file(name, git(['cat-file', 'blob', header[2]]));
    });
    return { source: { indexedSha }, files, sections: [], review: { lastReviewedSha: fromSha } };
  };
  const fields = git(['diff', '--name-status', '-z', '--no-renames', fromSha, toSha]).toString().split('\0');
  assert.equal(fields.pop(), ''); assert.equal(fields.length, names.length * 2);
  const changedPaths = [];
  for (let i = 0; i < fields.length; i += 2) changedPaths.push({ status: fields[i], path: fields[i + 1] });
  git(['merge-base', '--is-ancestor', fromSha, toSha]);
  const result = compareRecords(capture(fromSha), capture(toSha), { changedPaths, isAncestor: true });
  assert.equal(result.fromSha, fromSha); assert.equal(result.toSha, toSha); assert.equal(result.reviewedSha, fromSha);
  assert.equal(result.state, 'needs-review'); assert.equal(result.unchangedWordingInvalidated, true);
  assert.deepEqual(result.gaps, []); assert.deepEqual(result.trackedChanges.map(c => c.path), [...names].sort());
  for (const change of result.trackedChanges) {
    assert.equal(change.status, 'M'); assert.equal(change.beforeHash, hash('before')); assert.equal(change.afterHash, hash('after'));
    assert.equal(change.category, 'source'); assert.equal(change.needsReview, true);
  }
});

test('tracked path spelling including newlines is preserved; invalid paths/status/conflicts are gaps', () => {
  const name = 'data/name\nwith-newline.json'; const before = record([file(name, 'one')], []), after = record([file(name, 'two')], []);
  assert.equal(compareRecords(before, after, opts([{ path: name, status: 'M' }])).trackedChanges[0].path, name);
  for (const rows of [[{ path: '../outside', status: 'M' }], [{ path: 'index.html', status: 'invalid' }],
    [{ path: 'index.html', status: 'M' }, { path: 'index.html', status: 'D' }]]) {
    assert.equal(compareRecords(record(), record(), opts(rows)).state, 'unreadable');
  }
  for (const status of ['U', 'X', 'B']) assert.equal(compareRecords(record(), record(), opts([{ path: 'index.html', status }])).state, 'unreadable');
});

test('valid supplied paths remain accounted for even when status or rename history is malformed', () => {
  const before = record([file('AGENTS.md', 'same')], []);
  for (const rows of [[{ path: 'AGENTS.md', status: 'invalid' }], [{ path: 'AGENTS.md' }],
    [{ path: 'AGENTS.md', status: 'R100', oldPath: '../missing-history' }]]) {
    const result = compareRecords(before, before, opts(rows));
    assert.equal(result.state, 'unreadable'); assert.equal(result.trackedChanges.length, 1);
    assert.equal(result.trackedChanges[0].path, 'AGENTS.md'); assert.equal(result.trackedChanges[0].needsReview, true);
    assert.equal(result.unchangedWordingInvalidated, true); assert(result.gaps.length > 0);
  }
});

test('invalid review/source pins stay explicit and cannot be silently advanced', () => {
  const before = record(); const after = clone(before); after.review.lastReviewedSha = 'bad';
  const result = compareRecords(before, after, opts([]));
  assert.equal(result.state, 'unknown'); assert.equal(result.reviewedSha, 'bad'); assert.equal(after.review.lastReviewedSha, 'bad');
  const wrong = clone(before); wrong.source.indexedSha = 'short';
  assert.equal(compareRecords(wrong, before, opts([])).state, 'unknown');
});

test('packets are deterministic and reconstruct exact ordered Unicode/CRLF/decomposed text', () => {
  const input = docs(); const first = buildPackets(input, { maxBytes: 9 }), second = buildPackets(input, { maxBytes: 9 });
  assert.deepEqual(first, second); assert.equal(verifyPackets(first.manifest, first.packets), true);
  assert.deepEqual(first.manifest.documents.map(d => d.id), ['alpha', 'beta']);
  for (const d of first.manifest.documents) {
    const joined = Buffer.concat(d.parts.map(p => first.packets.find(x => x.path === p.path).bytes));
    assert.equal(joined.toString('utf8'), input.find(x => x.id === d.id).text);
    assert.equal(hash(joined), d.sha256);
  }
  assert(first.packets.every(p => p.bytes.length <= 9 && Buffer.from(p.bytes.toString('utf8')).equals(p.bytes)));
});

test('every UTF-8 boundary and a large section respect the budget without dropping bytes', () => {
  const text = 'Aé界🌍e\u0301\n'.repeat(201);
  for (const maxBytes of [4, 5, 6, 7, 8, 13, 32]) {
    const result = buildPackets([{ id: 'large', text, recordSha256: hash('record') }], { maxBytes });
    assert(result.packets.every(p => p.bytes.length <= maxBytes));
    assert.equal(Buffer.concat(result.packets.map(p => p.bytes)).toString('utf8'), text);
    assert.equal(result.manifest.totalBytes, Buffer.byteLength(text)); assert.equal(verifyPackets(result.manifest, result.packets), true);
  }
});

test('empty documents retain a hashed zero-byte part and exact membership', () => {
  const result = buildPackets([{ id: 'empty', text: '', recordSha256: hash('record') }], { maxBytes: 1 });
  assert.equal(result.packets.length, 1); assert.equal(result.packets[0].bytes.length, 0);
  assert.equal(result.manifest.documents[0].sha256, hash('')); assert.equal(verifyPackets(result.manifest, result.packets), true);
  const none = buildPackets([], { maxBytes: 1 }); assert.equal(none.manifest.documentCount, 0); assert.equal(none.packets.length, 0);
});

test('too-small Unicode budget fails explicitly while ASCII works at one byte', () => {
  assert.throws(() => buildPackets([{ id: 'emoji', text: '🌍', recordSha256: hash('r') }], { maxBytes: 3 }), /UTF-8 code point/);
  assert.equal(buildPackets([{ id: 'ascii', text: 'AB', recordSha256: hash('r') }], { maxBytes: 1 }).packets.length, 2);
});

test('invalid budgets, IDs, record hashes and nonexact Unicode are rejected before export', () => {
  for (const maxBytes of [undefined, 0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => buildPackets(docs(), { maxBytes }), /maxBytes/);
  for (const input of [null, [{ id: '', text: 'a', recordSha256: hash('r') }],
    [{ id: 'a', text: 'a', recordSha256: null }], [{ id: 'a', text: 12, recordSha256: hash('r') }],
    [{ id: 'a', text: '\ud800', recordSha256: hash('r') }], [docs()[0], docs()[0]]]) {
    assert.throws(() => buildPackets(input, { maxBytes: 10 }));
  }
});

test('missing, extra, duplicate, reordered and altered packet bytes are rejected', () => {
  const result = buildPackets(docs(), { maxBytes: 9 }); const packets = result.packets;
  for (const changed of [packets.slice(1), [...packets, packets[0]], [packets[0], packets[0], ...packets.slice(2)],
    [packets[1], packets[0], ...packets.slice(2)]]) assert.throws(() => verifyPackets(result.manifest, changed), /Invalid teaching export/);
  const altered = packets.map(p => ({ ...p, bytes: Buffer.from(p.bytes) })); altered[0].bytes[0] ^= 1;
  assert.throws(() => verifyPackets(result.manifest, altered), /tampered packet bytes/);
  const nonbuffer = packets.map(p => ({ ...p, bytes: new Uint8Array(p.bytes) }));
  assert.throws(() => verifyPackets(result.manifest, nonbuffer), /packet bytes/);
});

test('manifest membership, record identity and packet order changes fail trusted-manifest validation', () => {
  const result = buildPackets(docs(), { maxBytes: 9 });
  for (const mutate of [m => m.documents.pop(), m => m.documents.reverse(), m => { m.documents[0].recordSha256 = hash('changed'); },
    m => m.packets.reverse(), m => { m.documentCount++; }, m => { m.totalBytes--; }]) {
    const manifest = clone(result.manifest); mutate(manifest); assert.notDeepEqual(manifest, result.manifest);
    assert.throws(() => verifyPackets(manifest, result.packets), /manifest membership or metadata changed/);
  }
});

test('structurally incomplete manifests fail even with a recomputed fixture hash', () => {
  const result = buildPackets(docs(), { maxBytes: 9 });
  for (const mutate of [m => { m.documents.pop(); m.documentCount--; }, m => { m.documents[0].parts[0].startByte++; },
    m => { m.documents[0].partCount--; }, m => { m.documents[0].sha256 = hash('incorrect whole document'); },
    m => { m.documents[0].bytes++; }, m => { m.totalBytes--; }, m => { m.packets[0].documentId = 'other'; }]) {
    const manifest = clone(result.manifest); mutate(manifest); resign(manifest);
    assert.throws(() => verifyPackets(manifest, result.packets), /Invalid teaching export/);
  }
});

test('forged UTF-8-cut parts fail despite exact joined bytes and consistent part hashes', () => {
  const bytes = Buffer.from('🌍'); const result = buildPackets([{ id: 'emoji', text: '🌍', recordSha256: hash('r') }], { maxBytes: 4 });
  const packetBytes = [bytes.subarray(0, 1), bytes.subarray(1)]; const manifest = clone(result.manifest);
  manifest.documents[0].parts = packetBytes.map((body, index) => ({ index: index + 1, path: `packet-${String(index + 1).padStart(6, '0')}.md`,
    startByte: index ? 1 : 0, endByte: index ? 4 : 1, bytes: body.length, sha256: hash(body) }));
  manifest.documents[0].partCount = 2; manifest.packetCount = 2;
  manifest.packets = manifest.documents[0].parts.map(p => ({ ...p, documentId: 'emoji', packetIndex: p.index })); resign(manifest);
  const packets = manifest.documents[0].parts.map((part, i) => ({ path: part.path, bytes: packetBytes[i] }));
  assert(Buffer.concat(packets.map(p => p.bytes)).equals(bytes));
  assert.throws(() => verifyPackets(manifest, packets), /cuts or corrupts UTF-8/);
});
