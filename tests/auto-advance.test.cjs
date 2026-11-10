/* The --auto-advance rule, one test per condition.
 *
 * These are written against the pure decision rather than against whichever
 * labs happen to be behind today: when the report was first run, condition (b)
 * never fired on live data, so the condition the whole rule exists for was
 * untested. The live run is not a test.
 *
 * (b) is line-level, and crypto-lab-masked-core is why. It anchors
 * `Timing side-channel` at README.md:18, and the range that moved its pin
 * edited README.md:208 -- the same file, 190 lines away. A file-level rule
 * ("no anchored file changed") refuses that correct advance. The first test
 * below is that exact shape and must be ELIGIBLE; the second edits the
 * anchored line itself and must be REFUSED.
 */
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { autoAdvanceVerdict, anchorsOnCard, verifyTerms } = require('../tools/catalog-evidence.js');
const terms = verifyTerms();

function tree(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aa-'));
  for (const [rel, text] of Object.entries(files)) {
    const p = path.join(dir, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, text);
  }
  return dir;
}

// A README whose line 3 names the term, with filler so a far edit is possible.
const readme = (line9) => ['# Lab', '', 'Timing Side-Channel constant-time compare.', '', '', '', '', '', line9].join('\n');
const ANCHOR = [{ name: 'Timing side-channel', file: 'README.md', line: 3 }];

test('(b) an anchored line untouched while the same file changes elsewhere is eligible', () => {
  const pin = tree({ 'README.md': readme('see crypto-lab-timing-side-channel') });
  const head = tree({ 'README.md': readme('see crypto-lab-timing-sidechannel') });
  const v = autoAdvanceVerdict({ changed: ['README.md'], anchors: ANCHOR,
                                 atPin: () => pin, atHead: () => head, terms });
  assert.equal(v.verdict, 'eligible', v.why);
});

test('(b) an anchored line that itself changed is refused', () => {
  const pin = tree({ 'README.md': readme('filler') });
  const moved = ['# Lab', '', 'Timing Side-Channel constant-time compare, reworded.', '', '', '', '', '', 'filler'].join('\n');
  const head = tree({ 'README.md': moved });
  const v = autoAdvanceVerdict({ changed: ['README.md'], anchors: ANCHOR,
                                 atPin: () => pin, atHead: () => head, terms });
  assert.equal(v.verdict, 'refused');
  assert.equal(v.condition, 'b');
  assert.match(v.why, /anchor line moved/);
});

test('(a) any path under src\\/ is refused before anchors are even read', () => {
  const v = autoAdvanceVerdict({ changed: ['README.md', 'src/crypto.ts'], anchors: ANCHOR,
                                 atPin: () => { throw new Error('must not be read'); },
                                 atHead: () => { throw new Error('must not be read'); }, terms });
  assert.equal(v.verdict, 'refused');
  assert.equal(v.condition, 'a');
  assert.match(v.why, /src\//);
});

test('(c) an anchored line that no longer names its term is refused', () => {
  const same = ['# Lab', '', 'nothing here names the technique', '', '', '', '', '', 'x'].join('\n');
  const pin = tree({ 'README.md': same });
  const head = tree({ 'README.md': same });       // byte-identical, so (b) passes
  const v = autoAdvanceVerdict({ changed: ['README.md'], anchors: ANCHOR,
                                 atPin: () => pin, atHead: () => head, terms });
  assert.equal(v.verdict, 'refused');
  assert.equal(v.condition, 'c');
  assert.match(v.why, /no longer resolves/);
});

test('a card with no anchors is refused rather than passing vacuously', () => {
  const d = tree({ 'README.md': 'x' });
  const v = autoAdvanceVerdict({ changed: ['README.md'], anchors: [],
                                 atPin: () => d, atHead: () => d, terms });
  assert.equal(v.verdict, 'refused');
  assert.match(v.why, /vacuous/);
});

test('an unextractable commit is refused, not assumed unchanged', () => {
  const d = tree({ 'README.md': readme('x') });
  const v = autoAdvanceVerdict({ changed: ['README.md'], anchors: ANCHOR,
                                 atPin: () => null, atHead: () => d, terms });
  assert.equal(v.verdict, 'refused');
  assert.equal(v.condition, 'read');
});

test('an anchor missing at one end is refused', () => {
  const pin = tree({ 'README.md': readme('x') });
  const head = tree({ 'README.md': '# Lab' });    // line 3 does not exist
  const v = autoAdvanceVerdict({ changed: ['README.md'], anchors: ANCHOR,
                                 atPin: () => pin, atHead: () => head, terms });
  assert.equal(v.verdict, 'refused');
  assert.equal(v.condition, 'b');
  assert.match(v.why, /unreadable at one end/);
});

test('anchorsOnCard reads every evidence attribute and ignores bare names', () => {
  const block = '<a data-implements="AES@src/a.ts:12 | SHA-256" '
              + 'data-attacks="Timing side-channel@src/b.ts:7" '
              + 'data-comment-only="RSA@src/c.ts:3" '
              + 'data-references="HQC">';
  const got = anchorsOnCard(block);
  assert.deepEqual(got.map((a) => `${a.name}@${a.file}:${a.line}`),
                   ['AES@src/a.ts:12', 'Timing side-channel@src/b.ts:7', 'RSA@src/c.ts:3']);
});
