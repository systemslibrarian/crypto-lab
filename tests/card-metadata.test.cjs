const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const levels = require('../tools/level-sync.js');
const dates = require('../tools/lab-dates.js');

const slug = 'crypto-lab-fixture';
const head = '<a class="project-card" data-category="HASHING" href="https://systemslibrarian.github.io/crypto-lab-fixture/"';
const pins = { [slug]: { added: '2026-04', updated: '2026-10', level: 'advanced' } };

test('metadata reads the whole tag and detects matching and conflicting duplicates', () => {
  const valid = head + ' data-implements="AES@src/a.ts:1" data-level="advanced" data-added="2026-04" data-updated="2026-10">body</a>';
  assert.deepEqual(levels.readLevels(valid)[slug], { level: 'advanced', duplicates: false, conflicts: false });
  assert.equal(dates.readAttrs(valid)[slug].updated, '2026-10');
  for (const other of ['advanced', 'beginner']) {
    const dirty = valid.replace('>body', ' data-level="' + other + '" data-added="2026-04" data-updated="2026-09">body');
    assert.equal(levels.readLevels(dirty)[slug].duplicates, true);
    assert.equal(levels.readLevels(dirty)[slug].conflicts, other !== 'advanced');
    assert.deepEqual(dates.readAttrs(dirty)[slug].duplicates, ['added', 'updated']);
    assert.deepEqual(dates.readAttrs(dirty)[slug].conflicts, ['updated']);
  }
});

test('both metadata writers remove separated duplicates and remain stable in either order', () => {
  const dirty = head + ' data-added="2026-04" data-level="beginner" data-implements="AES@src/a.ts:1" data-updated="2026-09" data-level="advanced" data-added="2026-04" data-updated="2026-10">body</a>';
  const clean = levels.stamp(dates.stamp(dirty, pins), pins);
  assert.deepEqual(levels.readLevels(clean)[slug], { level: 'advanced', duplicates: false, conflicts: false });
  assert.deepEqual(dates.readAttrs(clean)[slug], { added: '2026-04', updated: '2026-10', duplicates: [], conflicts: [] });
  assert.equal(levels.stamp(dates.stamp(clean, pins), pins), clean);
  const reverse = dates.stamp(levels.stamp(clean, pins), pins);
  assert.equal(dates.stamp(levels.stamp(reverse, pins), pins), reverse);
  assert.equal(levels.stamp(dates.stamp(reverse, pins), pins), clean);
  assert.ok(clean.includes('data-implements="AES@src/a.ts:1"'));
  assert.ok(clean.endsWith('>body</a>'));
  const absent = levels.stamp(dates.stamp(dirty, {}), {});
  assert.equal(/data-(?:level|added|updated)=/.test(absent), false);
});

test('all published cards carry one value per metadata field matching the existing pins', () => {
  const root = path.resolve(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const lp = JSON.parse(fs.readFileSync(path.join(root, 'tools/lab-levels.json'), 'utf8')).labs;
  const dp = JSON.parse(fs.readFileSync(path.join(root, 'tools/lab-dates.json'), 'utf8')).labs;
  const levelCards = levels.readLevels(html);
  const dateCards = dates.readAttrs(html);
  assert.equal(Object.keys(levelCards).length, Object.keys(lp).length);
  for (const [name, pin] of Object.entries(lp)) {
    assert.deepEqual(levelCards[name], { level: pin.level, duplicates: false, conflicts: false }, name);
    assert.deepEqual(dateCards[name], { added: dp[name].added || null, updated: dp[name].updated || null, duplicates: [], conflicts: [] }, name);
  }
});
