const test = require('node:test');
const assert = require('node:assert/strict');
const { ALGORITHMS, standardMetadataProblems } = require('../tools/catalog-vocab.js');

test('historical warnings cannot become standards-body identifiers', () => {
  for (const std of ['broken 2022', 'NIST:', ':FIPS 203', ' NIST:FIPS 203', 2022]) {
    assert.equal(standardMetadataProblems([{ name: 'fixture', std }]).length, 1);
  }
  assert.deepEqual(standardMetadataProblems([
    { name: 'standard', std: 'NIST:FIPS 203' },
    { name: 'draft', std: 'IETF:draft-irtf-cfrg-opaque' },
    { name: 'historical', std: null, status: 'broken 2022' },
  ]), []);
});

test('SIKE status is retained separately; CSIDH is not marked broken', () => {
  const sike = ALGORITHMS.find((t) => t.name === 'SIKE');
  const csidh = ALGORITHMS.find((t) => t.name === 'CSIDH');
  assert.equal(sike.std, null);
  assert.equal(sike.status, 'broken 2022');
  assert.equal(csidh.std, null);
  assert.equal(csidh.status, undefined);
  assert.deepEqual(standardMetadataProblems(), []);
});

test('EME2 discovery does not conflate the original EME or EME-32 construction', () => {
  const eme2 = ALGORITHMS.find((t) => t.name === 'EME2');
  assert.equal(eme2.std, 'IEEE:1619.2');
  assert.equal(eme2.re.test('EME2-AES'), true);
  for (const label of ['EME', 'EME-32', 'EME32', 'EME*']) assert.equal(eme2.re.test(label), false);
});
