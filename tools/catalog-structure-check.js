#!/usr/bin/env node
/*
 * catalog-structure-check.js — check catalog document structure and search behavior.
 *
 * Run: node tools/catalog-structure-check.js
 * Prevents: misplaced catalog cards, missing search semantics and broken metadata, alias or proximity queries
 * Reads: index.html, catalog-search.js and the query fixtures declared in this script
 * This source and fixture check does not exercise browser rendering.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const Search = require('../catalog-search.js');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const footer = html.indexOf('<footer class="footer">');
assert(footer >= 0, 'catalog footer is missing');

const cards = [...html.matchAll(/<a class="[^"]*project-card[^"]*"/g)];
assert(cards.length >= 200, 'catalog unexpectedly has fewer than 200 cards');
assert.strictEqual(cards.filter(m => m.index > footer).length, 0, 'catalog cards must not appear after the footer opens');
assert(html.includes('src="catalog-search.js"'), 'catalog-search.js is not loaded');
assert(html.includes('id="search-suggestions"'), 'autocomplete listbox is not present');
assert(html.includes('aria-autocomplete="list"'), 'search input does not expose autocomplete semantics');
for (const field of ['data-implements','data-attacks','data-references','data-standards','data-implementation']) {
  assert(html.includes("searchValues(card, '" + field + "'"), 'search does not index ' + field);
}

function item(title, fields) {
  return { title, search: Search.prepare(Object.assign({ title }, fields)) };
}
const fixtures = [
  item('KEM Trap', { implements: 'ML-KEM-768 FIPS 203', standards: 'NIST' }),
  item('Nonce Guard', { implements: 'AES-GCM AES-GCM-SIV', attacks: 'nonce reuse attack GHASH key extraction', standards: 'IETF' }),
  item('Padding Oracle', { copy: 'CBC padding oracle attack', attacks: 'padding oracle chosen-ciphertext attack' }),
  item('Lattice Side Channel', { implements: 'Module-LWE lattice', attacks: 'timing side-channel', implementation: 'WebCrypto' }),
  item('Lattice Gentle', { implements: 'lattice LWE SIS LLL' })
];

function titles(q) { return Search.rank(fixtures, q).map(x => x.item.title); }

assert(titles('kyber').includes('KEM Trap'), 'Kyber alias must find ML-KEM');
assert(titles('primitive:ML-KEM').includes('KEM Trap'), 'primitive operator must search implements');
assert(titles('standard:NIST').includes('KEM Trap'), 'standard operator must search standards');
assert(titles('attack:nonce-reuse').includes('Nonce Guard'), 'attack operator must normalize hyphens');
assert.deepStrictEqual(titles('lattice side-channel'), ['Lattice Side Channel'], 'multi-term search must use AND semantics');
assert(titles('"padding oracle"').includes('Padding Oracle'), 'quoted phrase must match');
assert(titles('implementation:WebCrypto').includes('Lattice Side Channel'), 'implementation operator must work');
assert(titles('dilithum').includes('Lattice Side Channel') === false, 'typo tolerance must not invent unrelated matches');

const typoFixtures = [
  item('Dilithium Seal', { implements: 'ML-DSA Dilithium' }),
  item('Kyber Vault', { implements: 'ML-KEM Kyber' })
];
assert(Search.rank(typoFixtures, 'dilithum').some(x => x.item.title === 'Dilithium Seal'), 'dilithum typo must find Dilithium');
assert(Search.rank(typoFixtures, 'kybr').some(x => x.item.title === 'Kyber Vault'), 'kybr typo must find Kyber');

const proximityFixtures = [
  item('Near', { copy: 'lattice side channel leakage' }),
  item('Far', { title: 'Lattice Primer', attacks: 'timing side channel' })
];
assert.strictEqual(Search.rank(proximityFixtures, 'lattice side channel')[0].item.title, 'Near', 'same-field phrase proximity must outrank split-field matches');

console.log('Catalog search/structure: PASS (' + cards.length + ' cards; metadata, typo and proximity search verified)');
