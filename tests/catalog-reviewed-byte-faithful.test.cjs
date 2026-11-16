/* tools/catalog-reviewed.json has to be reproducible, BYTE FOR BYTE, by the
 * writer that edits it. tools/catalog-evidence.js:3426 refuses to advance any
 * pin unless
 *
 *     JSON.stringify(table, null, 2) + '\n' === raw
 *
 * and that refusal is right: a writer that cannot reproduce the file as it
 * stands must not be the thing that rewrites 121 entries in it.
 *
 * The failure this prevents is small, silent and slow. On 2026-11-16 the weekly
 * pin-advance run refused to write, because ONE string in 525,739 bytes held a
 * `–` escape instead of a literal en dash -- `Grigoriev–Shpilrain`,
 * added in e467be6 by an ad-hoc Python edit, where json.dumps defaults to
 * ensure_ascii=True. Three bytes. Everything else in the file was byte-perfect.
 * The cost was a week of bookkeeping that did not happen: 76 pins were eligible
 * for a purely mechanical anchorsUnchangedAt advance and none of them moved,
 * and the only symptom was a scheduled run going red once a week.
 *
 * There is no Python writer to fix -- both tracked writers of this file are JS
 * and emit literal characters. What was missing was anything that notices
 * within seconds of the edit instead of days later in a cron job. This is that.
 *
 * Scoped deliberately to ONE file. Several other JSON files under tools/ do not
 * round-trip through that expression and are perfectly correct: lab-levels.json,
 * lab-dates.json, playwright-ports.json, fleet-edits.json, source-roots.json
 * and catalog-native.json are hand-formatted or written by tools with their own
 * layout, and catalog-native.json carries escapes on purpose. Asserting
 * byte-faithfulness on those would force a reformat nothing asked for. The
 * requirement belongs to the file whose writer actually imposes it.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'tools', 'catalog-reviewed.json');

test('catalog-reviewed.json is what its writer would emit, byte for byte', () => {
  const raw = fs.readFileSync(FILE, 'utf8');
  const emitted = JSON.stringify(JSON.parse(raw), null, 2) + '\n';
  if (emitted === raw) return;

  /* Name the first offending byte rather than printing a 525 KB diff: the whole
     point is that the cause is usually one character. */
  let at = 0;
  while (at < Math.min(raw.length, emitted.length) && raw[at] === emitted[at]) at += 1;
  const line = raw.slice(0, at).split('\n').length;
  assert.fail(
    `tools/catalog-reviewed.json does not round-trip through `
    + `JSON.stringify(x, null, 2) + "\\n", so tools/catalog-evidence.js will REFUSE to\n`
    + `advance any pin (catalog-evidence.js:3426). First difference at byte ${at}, line ${line}:\n`
    + `  file:    ${JSON.stringify(raw.slice(at - 30 > 0 ? at - 30 : 0, at + 30))}\n`
    + `  writer:  ${JSON.stringify(emitted.slice(at - 30 > 0 ? at - 30 : 0, at + 30))}\n`
    + `If you edited this file from Python, json.dumps defaults to ensure_ascii=True:\n`
    + `  json.dumps(obj, indent=2, ensure_ascii=False) + "\\n"`);
});

test('and it carries no \\uXXXX escapes, which is how that happens', () => {
  const raw = fs.readFileSync(FILE, 'utf8');
  const escapes = raw.match(/\\u[0-9a-fA-F]{4}/g) || [];
  assert.deepEqual(escapes, [],
    'a \\uXXXX escape is valid JSON and is NOT what JSON.stringify emits, so it breaks '
    + 'the writer\'s byte-faithfulness guard while looking entirely correct');
});

/* The control: the real failure, reconstructed. Without it a guard that always
   passed would look exactly like this one. */
test('MUTATION: a single en-dash escape is caught, and named', () => {
  const raw = fs.readFileSync(FILE, 'utf8');
  const broken = raw.replace('Grigoriev–Shpilrain', 'Grigoriev\\u2013Shpilrain');
  assert.notEqual(broken, raw, 'the fixture string must still be in the file');
  assert.equal(JSON.parse(broken)['crypto-lab-tropical-exchange'].add[0],
    JSON.parse(raw)['crypto-lab-tropical-exchange'].add[0],
    'the escape changes no DATA, which is exactly why it went unnoticed');
  assert.notEqual(JSON.stringify(JSON.parse(broken), null, 2) + '\n', broken,
    'and it must break byte-faithfulness, or the guard above guards nothing');
  assert.deepEqual((broken.match(/\\u[0-9a-fA-F]{4}/g) || []).length, 1);
});
