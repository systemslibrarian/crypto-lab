'use strict';

const assert = require('assert');
const Search = require('./catalog-search.js');
let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log('PASS: ' + name);
}
function score(copy, query) {
  return Search.score(Search.prepare({ copy }), query);
}

test('short acronyms reject unrelated words and match complete tokens', () => {
  for (const word of ['adversary', 'conversation', 'universal']) {
    assert.strictEqual(score(word, 'rsa'), -1);
  }
  assert(score('RSA-OAEP', 'rsa') >= 0);
  assert.strictEqual(score('machine', 'mac'), -1);
  assert.strictEqual(score('html', 'ml'), -1);
  assert(score('MAC authentication', 'mac') >= 0);
  assert(score('ML-KEM', 'ml') >= 0);
});
test('prefix and reduced-score embedded matches', () => {
  assert(score('Kyber', 'kybe') >= 0);
  assert.strictEqual(score('prefixkyber', 'kyber'), 15);
  assert.strictEqual(score('ECDSA', 'dsa'), 15);
  assert(score('DSA', 'dsa') > score('ECDSA', 'dsa'));
});
test('unquoted aliases merge and find acronym-only copy', () => {
  for (const [query, copy] of [
    ['ml kem', 'Kyber'], ['post quantum', 'PQC'],
    ['zero knowledge', 'ZK'], ['zero knowledge proof', 'ZKP'],
    ['man in the middle', 'MITM'], ['harvest now decrypt later', 'HNDL'],
    ['deterministic random bit generator', 'DRBG']
  ]) {
    assert.strictEqual(Search.parse(query).length, 1, query);
    assert(score(copy, query) >= 0, query);
  }
  assert.strictEqual(Search.parse('"ml" kem').length, 2);
  assert.strictEqual(Search.parse('title:ml kem').length, 2);
  assert.strictEqual(Search.parse('ml -kem').length, 2);
});
test('exclusions use aliases, skip fuzzy matching, and preserve AND semantics', () => {
  assert.strictEqual(score('Kyber', '-kyber'), -1);
  assert.strictEqual(score('Kyber', '-"ml kem"'), -1);
  assert.strictEqual(score('ML-KEM', '-kyber'), -1);
  assert.strictEqual(score('Kyber', '-kyver'), 0);
  assert.strictEqual(score('Kyber', 'kyber -aes'), score('Kyber', 'kyber'));
  assert.strictEqual(score('AES encryption', '-kyber'), 0);
  assert.strictEqual(score('Kyber', 'kyber aes'), -1);
  const items = ['Kyber', 'AES'].map(title => ({ title, search: Search.prepare({ title }) }));
  assert.deepStrictEqual(Search.rank(items, '-kyber').map(x => x.item.title), ['AES']);
});
test('exclusions do not contribute phrase bonuses', () => {
  const copy = 'lattice side channel';
  assert.strictEqual(score(copy, 'lattice side -kyber'), score(copy, 'lattice side'));
});
test('sentence periods are removed; numeric versions survive', () => {
  assert.strictEqual(Search.normalize('using Kyber.'), 'using kyber');
  assert(score('using Kyber.', 'kyver') >= 0);
  assert.strictEqual(Search.normalize('1.0'), '1.0');
  assert.strictEqual(Search.normalize('v1.0.2. .Kyber.'), 'v1.0.2 kyber');
});
test('field operators, quotes, cached variants, and typo distance still work', () => {
  const prepared = Search.prepare({ implements: 'ML-KEM', copy: 'padding oracle' });
  assert(Search.score(prepared, 'primitive:ML-KEM') >= 0);
  assert(Search.score(prepared, '"padding oracle"') >= 0);
  assert.strictEqual(Search.score(prepared, 'title:kyber'), -1);
  const parsed = Search.parse('ml kem');
  assert(parsed[0].variants.includes('kyber'));
  assert(score('Kyber', 'ml kem') === Search.score(Search.prepare({ copy: 'Kyber' }), parsed));
  assert.strictEqual(Search.editDistance('kyber', 'kybre', 1), 1);
});
console.log('Catalog search: ' + passed + ' test groups passed');
