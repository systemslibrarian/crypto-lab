const {test} = require('node:test');
const assert = require('node:assert/strict');
const {reviewedReferenceNames} = require('../tools/catalog-evidence.js');
const {ALGORITHMS} = require('../tools/catalog-vocab.js');
const reviews = require('../tools/catalog-reviewed.json');
const fs = require('node:fs');
const path = require('node:path');

const pin = 'a'.repeat(40);
const refs = (slug, raw, hits, review, stale, head = pin) =>
  reviewedReferenceNames(slug, raw, hits, review, stale, head);

const mentions = () => new Map([['OPAQUE', 'opaque-WASM coverage'], ['Streebog', 'hash reference']]);

test('a current source review corrects an ambiguous reference without mutating raw evidence', () => {
  const raw = mentions();
  const before = [...raw];
  assert.deepEqual(refs('fixture', raw, new Map(), {commit: pin, removeReferences: ['OPAQUE']}, null), ['Streebog']);
  assert.deepEqual([...raw], before);
});

test('a stale review cannot remove newly observed references', () => {
  assert.deepEqual(refs('fixture', mentions(), new Map(), {commit: pin, removeReferences: ['OPAQUE']}, {pinned: 'old', current: 'new'}), ['OPAQUE', 'Streebog']);
});

test('an unreadable review comparison cannot remove references', () => {
  assert.deepEqual(refs('fixture', mentions(), new Map(), {commit: pin, removeReferences: ['OPAQUE']}, {unreadable: true}), ['OPAQUE', 'Streebog']);
});

test('other labs retain a real OPAQUE reference and the vocabulary still recognizes PAKE', () => {
  const term = ALGORITHMS.find((term) => term.name === 'OPAQUE');
  assert.ok(term.re.test('OPAQUE password-authenticated key exchange'));
  assert.deepEqual(refs('other-lab', mentions(), new Map(), undefined, null), ['OPAQUE', 'Streebog']);
});

test('reference corrections do not remove actual implementation claims', () => {
  const hits = new Map([['OPAQUE', {at: 'src/pake.ts:20'}]]);
  assert.deepEqual(refs('fixture', mentions(), hits, {commit: pin, removeReferences: ['OPAQUE']}, null), ['Streebog']);
  assert.deepEqual([...hits], [['OPAQUE', {at: 'src/pake.ts:20'}]]);
});

test('misspelled and malformed reference corrections fail visibly', () => {
  for (const removeReferences of ['OPAQUE', ['Opaqu'], ['opaque']]) {
    assert.throws(() => refs('fixture', mentions(), new Map(), {commit: pin, removeReferences}, null), /canonical algorithm names/);
  }
});

test('unreadable review corrections remain unapplied instead of authorizing an exclusion', () => {
  assert.deepEqual(refs('fixture', mentions(), new Map(), {commit: pin, removeReferences: ['Misspelling']}, {unreadable: true}), ['OPAQUE', 'Streebog']);
});

test('TC26 excludes the coverage adjective while preserving its compiled-source limits', () => {
  const review = reviews['crypto-lab-tc26-pair'];
  assert.deepEqual(review.removeReferences, ['OPAQUE']);
  assert.match(review.note, /original compiler remains unknown/i);
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const card = html.match(/<a class="project-card"[^>]*href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-tc26-pair\/"[\s\S]*?<\/a>/)[0];
  const references = card.match(/data-references="([^"]*)"/)[1].split(' | ');
  assert.ok(!references.includes('OPAQUE'));
  assert.ok(references.includes('Merkle tree'));
  assert.match(card, /data-unscanned="WebAssembly:2"/);
});


test('a different HEAD cannot inherit a reference exclusion even if implementation source is unchanged', () => {
  assert.deepEqual(refs('fixture', mentions(), new Map(), {commit: pin, removeReferences: ['OPAQUE']}, null, 'b'.repeat(40)), ['OPAQUE', 'Streebog']);
});

test('missing source identity cannot authorize a reference exclusion', () => {
  assert.deepEqual(reviewedReferenceNames('fixture', mentions(), new Map(), {commit: pin, removeReferences: ['OPAQUE']}, null, undefined), ['OPAQUE', 'Streebog']);
});
