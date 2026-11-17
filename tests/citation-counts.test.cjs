'use strict';
/*
 * CITATION.cff's abstract publishes two catalog figures, and nothing watched them.
 *
 * It said "254 browser-based cryptography labs (253 interactive demonstrations
 * and one learning game)" while llms.txt — which tools/llms-sync.js does gate —
 * said 258 and 257. CITATION.cff is a hand-edited source (tools/teach-build.js
 * lists it as one, and reads only the author, version and date from it), so a
 * lab landing moved every other published count and left this one behind.
 *
 * The figures come from tools/llms-sync.js's own `figures()` rather than being
 * re-derived here: index.html's cards are the catalog, and its
 * id="exhibit-count" literal is the one owner of the learning-game exclusion.
 * Deriving them a second time is how two checkers come to disagree.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { figures } = require('../tools/llms-sync.js');

const ROOT = path.join(__dirname, '..');
const CFF = path.join(ROOT, 'CITATION.cff');

const ABSTRACT =
  /collection of (\d+) browser-based cryptography labs \((\d+) interactive demonstrations and (one|two|three|four|five) learning game/;
const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5 };

test('CITATION.cff publishes the catalog size the catalog actually has', () => {
  const want = figures();
  const m = ABSTRACT.exec(fs.readFileSync(CFF, 'utf8'));
  assert.ok(m, 'CITATION.cff no longer carries the two-figure abstract this test checks');

  assert.equal(
    Number(m[1]),
    want.total,
    `CITATION.cff says ${m[1]} labs, index.html carries ${want.total} cards`,
  );
  assert.equal(
    Number(m[2]),
    want.exhibits,
    `CITATION.cff says ${m[2]} demonstrations, index.html's exhibit-count says ${want.exhibits}`,
  );
  // "one learning game" is a count in words: if the gap stops being 1, the
  // sentence is wrong in a way neither numeral shows.
  assert.equal(
    WORDS[m[3]],
    want.total - want.exhibits,
    `CITATION.cff says "${m[3]} learning game", the gap between the two figures is ${
      want.total - want.exhibits
    }`,
  );
});
