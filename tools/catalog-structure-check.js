#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const footer = html.indexOf('<footer class="footer">');
assert(footer >= 0, 'catalog footer is missing');

const cards = [...html.matchAll(/<a class="[^"]*(?:feature-card|project-card)[^"]*"/g)];
assert(cards.length >= 200, 'catalog unexpectedly has fewer than 200 cards');

const afterFooter = cards.filter(m => m.index > footer);
assert.strictEqual(
  afterFooter.length,
  0,
  'catalog cards must not appear after the footer opens'
);

const mainClose = html.indexOf('</main>');
assert(mainClose >= 0 && mainClose < footer, 'catalog footer must follow </main>');

console.log('Catalog structure: PASS (' + cards.length + ' cards; none after footer)');
