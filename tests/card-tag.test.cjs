'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const cardTag = require(path.join(ROOT, 'tools/card-tag.js'));
const { readCards } = require(path.join(ROOT, 'tools/card-reader.js'));
const { setHrefLineAttrs, setOwnLineAttrs, DATE_ATTRS, TAIL_ATTRS } = cardTag;

const HREF = 'href="https://systemslibrarian.github.io/crypto-lab-x/"';

/* ------------------------------------------------------------------- placement */

test('dates sit on the href line, in canonical order', () => {
  const tag = `<a class="project-card" data-category="X" ${HREF}\n            data-implements="A@src/a.ts:1"\n            data-level="advanced"\n            target="_blank">`;
  const out = setHrefLineAttrs(tag, {
    'data-added': '2026-04', 'data-added-on': '2026-04-06', 'data-updated': '2026-11',
  });
  const first = out.split('\n')[0];
  assert.match(first, /href="[^"]*" data-added="2026-04" data-added-on="2026-04-06" data-updated="2026-11"$/);
});

test('data-level sits after the derived block and ABOVE data-overlaps', () => {
  const tag = [
    `<a class="project-card" ${HREF}`,
    '            data-implements="A@src/a.ts:1"',
    '            data-implementation="hand-rolled"',
    '            data-overlaps="something judged by a person"',
    '            target="_blank">',
  ].join('\n');
  const out = setOwnLineAttrs(tag, { 'data-level': 'advanced' });
  const names = [...out.matchAll(/^[ \t]*(data-[a-z-]+)="/gm)].map((m) => m[1]);
  assert.deepEqual(names, ['data-implements', 'data-implementation', 'data-level', 'data-overlaps'],
    'data-overlaps is hand-written and stays below; inserting after the LAST own-line attribute moved data-level down a line on 19 real cards');
});

test('data-overlaps is the only declared tail attribute', () => {
  assert.deepEqual(TAIL_ATTRS, ['data-overlaps']);
});

/* --------------------------------------------------- order must not matter */

/*
 * THE DEFECT THIS MODULE EXISTS FOR. catalog-evidence, lab-dates and level-sync
 * each had their own copy of "where does this attribute go", so whichever ran
 * LAST reformatted all 252 cards: #374's commit carried an 803-line index.html
 * diff, #377's carried 762 back the other way, and a level-sync run moves 766 --
 * while four cards had actually changed. These assert the property that stops it.
 */
const dates = { 'data-added': '2026-04', 'data-added-on': '2026-04-06', 'data-updated': '2026-11' };
const level = { 'data-level': 'advanced' };
const FIXTURE = [
  `<a class="project-card" data-category="X" ${HREF}`,
  '            data-implements="A@src/a.ts:1"',
  '            data-attacks="B@src/b.ts:2"',
  '            data-overlaps="judged by a person"',
  '            target="_blank" rel="noopener">',
].join('\n');

test('dates then level equals level then dates', () => {
  const a = setOwnLineAttrs(setHrefLineAttrs(FIXTURE, dates), level);
  const b = setHrefLineAttrs(setOwnLineAttrs(FIXTURE, level), dates);
  assert.equal(a, b, 'the two writers must not be able to disagree about layout');
});

test('stamping the same values twice changes nothing', () => {
  const once = setOwnLineAttrs(setHrefLineAttrs(FIXTURE, dates), level);
  const twice = setOwnLineAttrs(setHrefLineAttrs(once, dates), level);
  assert.equal(once, twice);
  const thrice = setHrefLineAttrs(setOwnLineAttrs(twice, level), dates);
  assert.equal(once, thrice, 'idempotent in either order, not just the one we happened to run');
});

test('a value removed is removed from wherever it sat', () => {
  const stamped = setHrefLineAttrs(FIXTURE, dates);
  const cleared = setHrefLineAttrs(stamped, { 'data-added': null, 'data-added-on': null, 'data-updated': null });
  for (const n of DATE_ATTRS) assert.ok(!cleared.includes(n), `${n} survived removal`);
});

/* --------------------------------------------- the acceptance test, on the real file */

/*
 * Every committed card must already be in the canonical layout, so re-stamping a
 * card with its OWN current values is a no-op. This is the check that would have
 * failed on every one of the three flip commits, and it covers all 252 cards
 * rather than a fixture.
 */
test('re-stamping every real card with its own values changes nothing', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const { cards, hrefless } = readCards(html);
  assert.equal(hrefless.length, 0);
  assert.ok(cards.length > 200, `expected the full catalog, got ${cards.length}`);
  const moved = [];
  for (const c of cards) {
    const own = (n) => {
      const m = new RegExp(`${n}="([^"]*)"`).exec(c.tag);
      return m ? m[1] : null;
    };
    let out = setHrefLineAttrs(c.tag, {
      'data-added': own('data-added'),
      'data-added-on': own('data-added-on'),
      'data-updated': own('data-updated'),
    });
    out = setOwnLineAttrs(out, { 'data-level': own('data-level') });
    if (out !== c.tag) moved.push(c.slug);
  }
  assert.deepEqual(moved, [], `${moved.length} card(s) are not in the canonical layout: ${moved.slice(0, 6).join(', ')}`);
});

/* ------------------------------------------------------------ one definition */

test('no tool keeps its own copy of the placement rule', () => {
  for (const f of ['lab-dates.js', 'level-sync.js', 'catalog-evidence.js']) {
    const src = fs.readFileSync(path.join(ROOT, 'tools', f), 'utf8');
    assert.ok(!/^function stampTag\(/m.test(src),
      `${f} defines its own stampTag again; three copies is what reformatted every card`);
    assert.match(src, /require\('\.\/card-tag\.js'\)/, `${f} must import the shared placement rule`);
  }
});
