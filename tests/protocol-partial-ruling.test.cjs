/**
 * removeProtocolPartial: a person can rule a protocol-shape observation false
 * without CREDITING the term, which before this existed was the only way out.
 *
 * The controls matter more than the happy path here. This supplement deletes a
 * finding, so every way of writing a careless one must be refused rather than
 * applied, and a pin that no longer describes the lab must not carry a person's
 * judgement forward.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const { reviewedProtocolPartialNames } = require('../tools/catalog-evidence.js');

const PIN = 'a'.repeat(40);
const good = { commit: PIN, removeProtocolPartial: [{ name: 'TLS 1.3', reason: 'matched on this SSH lab’s own ServerHello' }] };

test('a ruling with a written reason applies, name -> reason', () => {
  const m = reviewedProtocolPartialNames('lab', good, null);
  assert.equal(m.size, 1);
  assert.equal(m.get('TLS 1.3'), 'matched on this SSH lab’s own ServerHello');
});

test('a reason is MANDATORY: missing, blank or non-string all throw', () => {
  for (const reason of [undefined, '', '   ', null, 42, {}, ['why']]) {
    assert.throws(
      () => reviewedProtocolPartialNames('lab', { commit: PIN, removeProtocolPartial: [{ name: 'TLS 1.3', reason }] }, null),
      /has no written reason/,
      `reason ${JSON.stringify(reason)} must be refused`,
    );
  }
});

test('a bare string entry is refused, so the supplement cannot be written like the others', () => {
  assert.throws(
    () => reviewedProtocolPartialNames('lab', { commit: PIN, removeProtocolPartial: ['TLS 1.3'] }, null),
    /must be \{ name, reason \} objects/,
  );
  assert.throws(
    () => reviewedProtocolPartialNames('lab', { commit: PIN, removeProtocolPartial: 'TLS 1.3' }, null),
    /must be an array/,
  );
  assert.throws(
    () => reviewedProtocolPartialNames('lab', { commit: PIN, removeProtocolPartial: [null] }, null),
    /must be \{ name, reason \} objects/,
  );
});

test('a name in neither vocabulary throws instead of silently no-opping', () => {
  assert.throws(
    () => reviewedProtocolPartialNames('lab', { commit: PIN, removeProtocolPartial: [{ name: 'Not A Term', reason: 'x' }] }, null),
    /in neither vocabulary/,
  );
  // A typo in a pin used to be a review that looks applied and is not.
  assert.throws(
    () => reviewedProtocolPartialNames('lab', { commit: PIN, removeProtocolPartial: [{ name: 'TLS 1.2', reason: 'x' }] }, null),
    /in neither vocabulary/,
  );
});

test('a STALE pin carries no ruling forward, and the observation returns', () => {
  const stale = { pinned: PIN, current: 'b'.repeat(40) };
  assert.equal(reviewedProtocolPartialNames('lab', good, stale).size, 0);
});

test('an unpinned or abbreviated-commit review carries no ruling', () => {
  assert.equal(reviewedProtocolPartialNames('lab', null, null).size, 0);
  assert.equal(reviewedProtocolPartialNames('lab', { removeProtocolPartial: good.removeProtocolPartial }, null).size, 0);
  assert.equal(reviewedProtocolPartialNames('lab', { commit: 'abc1234', removeProtocolPartial: good.removeProtocolPartial }, null).size, 0);
});

test('absent supplement is empty, not an error', () => {
  assert.equal(reviewedProtocolPartialNames('lab', { commit: PIN }, null).size, 0);
  assert.equal(reviewedProtocolPartialNames('lab', { commit: PIN, removeProtocolPartial: [] }, null).size, 0);
});

test('an attack term may be ruled too, since the residue can name either vocabulary', () => {
  const m = reviewedProtocolPartialNames('lab', { commit: PIN, removeProtocolPartial: [{ name: 'Brute force', reason: 'ordinary English' }] }, null);
  assert.equal(m.get('Brute force'), 'ordinary English');
});
