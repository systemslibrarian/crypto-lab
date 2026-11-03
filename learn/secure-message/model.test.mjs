import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assess } from './model.mjs';
test('both AND branches and the content OR branch over all 32 capability sets', () => {
  for (let bits = 0; bits < 32; bits++) {
    const [ciphertext, key, endpoint, traffic, identities] = Array.from({ length: 5 }, (_, i) => !!(bits & (1 << i)));
    const r = assess({ ciphertext, key, endpoint, traffic, identities });
    assert.equal(r.archive, (bits & 3) === 3);
    assert.equal(r.contents, (bits & 4) === 4 || (bits & 3) === 3);
    assert.equal(r.relationship, (bits & 24) === 24);
  }
});
test('observing a relationship does not establish readable content', () => {
  assert.deepEqual(assess({ traffic: true, identities: true }), { archive: false, contents: false, relationship: true, reasons: [] });
  assert.equal(assess({ ciphertext: true }).contents, false);
  assert.equal(assess({ key: true }).contents, false);
});
