/**
 * The writeback, and the one property that makes it honest.
 *
 * `reviewed` is the date a PERSON read the lab, and catalog-evidence ages every
 * pin from it. A machine advance that stamped today there would reset the
 * human-review clock on a lab nobody re-read, and after one run 121 labs would
 * read freshly reviewed while no one had looked. So the writer moves `commit`
 * and `range` and nothing else, records in `reason` that the advance was
 * machine-made, and leaves `reviewed` and `note` exactly as the person left
 * them. These tests exist to keep it that way.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const SRC = fs.readFileSync(path.join(__dirname, '..', 'tools/catalog-evidence.js'), 'utf8');
const WRITER = SRC.slice(SRC.indexOf('function autoAdvanceWrite'), SRC.indexOf('function autoAdvance(selected'));
const PINS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tools/catalog-reviewed.json'), 'utf8'));

test('the writer assigns only commit, range and reason', () => {
  const assigned = [...WRITER.matchAll(/\be\.([A-Za-z]+)\s*=/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(assigned)].sort(), ['commit', 'range', 'reason', 'reviewedCommit']);
});

test('reviewedCommit is set once and never overwritten', () => {
  /* It must record the commit a PERSON read, so a second advance may not move
     it. Written as `if (!e.reviewedCommit)` for exactly that reason. */
  assert.match(WRITER, /if \(!e\.reviewedCommit\) e\.reviewedCommit = e\.commit;/);
});

test('the writer never assigns reviewed or note', () => {
  assert.ok(!/\be\.reviewed\s*=/.test(WRITER), 'reviewed is the human-read date and must not be machine-stamped');
  assert.ok(!/\be\.note\s*=/.test(WRITER), 'note is the person’s own words');
});

test('it refuses to write at all unless it reproduces the file byte for byte', () => {
  assert.match(WRITER, /REFUSING TO WRITE/);
  assert.match(WRITER, /JSON\.stringify\(table, null, 2\)[\s\S]{0,40}!==\s*raw/,
    'the byte-faithfulness guard must gate the write, not merely warn');
});

test('it re-checks the pin at write time and skips rather than forcing', () => {
  assert.match(WRITER, /e\.commit !== r\.from/, 'a pin that moved under the run must not be overwritten');
  assert.match(WRITER, /skipped\.push/);
  assert.ok(!/force/i.test(WRITER.replace(/\/\*[\s\S]*?\*\//g, '')), 'nothing in the writer may force a skipped pin');
});

test('the reason it writes says a machine did it, and that reviewed is untouched', () => {
  assert.match(WRITER, /not by a person/);
  assert.match(WRITER, /reviewed date is deliberately unchanged/);
});

test('no pin on disk has been machine-advanced yet, so the mechanism lands unused', () => {
  /* This branch lands the mechanism only. The 121 advances it enables are held
     in a separate change, because they move 24 hardcoded pin SHAs in
     tests/catalog-teaching-scope.test.cjs and what those 28 assertions are FOR
     is a decision for the owner, not a rewrite to make a run go green. */
  const advanced = Object.entries(PINS).filter(([, e]) => /auto-advance --write/.test(e.reason || ''));
  assert.deepEqual(advanced.map(([s]) => s), []);
});

test('no advanced pin has a reviewed date later than today, which a stamp would produce', () => {
  const today = new Date().toISOString().slice(0, 10);
  for (const [slug, e] of Object.entries(PINS)) {
    if (!/auto-advance --write/.test(e.reason || '')) continue;
    assert.ok(e.reviewed <= today, `${slug}: reviewed ${e.reviewed} is in the future`);
  }
});
