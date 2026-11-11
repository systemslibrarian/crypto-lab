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

test('every machine-advanced pin carries the shape the writer promises', () => {
  /* This asserted that NO pin had been advanced, because the mechanism landed
     unused while the owner decided what the hardcoded pin SHAs in
     tests/catalog-teaching-scope.test.cjs were FOR. That decision is made --
     they assert what a PERSON reviewed, so they now read reviewedCommit -- and
     the advances have landed. The guard inverts rather than disappearing: what
     must stay true is the SHAPE of an advance, and the fields it must not
     touch. */
  const advanced = Object.entries(PINS).filter(([, e]) => /auto-advance --write/.test(e.reason || ''));
  assert.ok(advanced.length > 0, 'the advances have landed, so this must not be empty');
  for (const [slug, e] of advanced) {
    assert.match(String(e.reviewedCommit), /^[0-9a-f]{40}$/, `${slug}: an advanced pin must record the commit a person read`);
    assert.notEqual(e.reviewedCommit, e.commit, `${slug}: reviewedCommit must stay behind the advanced commit`);
    assert.match(String(e.range), new RegExp(`^[0-9a-f]{40}\\.\\.${e.commit}$`), `${slug}: the range must end at the pin`);
    assert.match(String(e.reviewed), /^\d{4}-\d{2}-\d{2}$/, `${slug}: the human review date must survive`);
    assert.ok(/not by a person/.test(e.reason), `${slug}: the reason must say the advance was not a person's`);
  }
});

test('no advanced pin has a reviewed date later than today, which a stamp would produce', () => {
  const today = new Date().toISOString().slice(0, 10);
  for (const [slug, e] of Object.entries(PINS)) {
    if (!/auto-advance --write/.test(e.reason || '')) continue;
    assert.ok(e.reviewed <= today, `${slug}: reviewed ${e.reviewed} is in the future`);
  }
});
