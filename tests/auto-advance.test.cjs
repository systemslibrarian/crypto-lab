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
  const v = autoAdvanceVerdict({ changed: ['.github/workflows/ci.yml'], anchors: ANCHOR,
                                 atPin: () => pin, atHead: () => head, terms });
  assert.equal(v.verdict, 'eligible', v.why);
});

test('(b) an anchored line that itself changed is refused', () => {
  const pin = tree({ 'README.md': readme('filler') });
  const moved = ['# Lab', '', 'Timing Side-Channel constant-time compare, reworded.', '', '', '', '', '', 'filler'].join('\n');
  const head = tree({ 'README.md': moved });
  const v = autoAdvanceVerdict({ changed: ['.github/workflows/ci.yml'], anchors: ANCHOR,
                                 atPin: () => pin, atHead: () => head, terms });
  assert.equal(v.verdict, 'refused');
  assert.equal(v.condition, 'b');
  assert.match(v.why, /anchor line moved/);
});

test('(a) a src\\/ path whose LINES run is refused before anchors are even read', () => {
  /* This used to assert that any path under src/ refused. It no longer does:
     the path is the first half of the question and tools/markup-only.js is the
     second, because two prose commits in crypto-lab-hybrid-sign were refused
     here while every anchored blob stayed byte-identical. What must not change
     is that a refusal at (a) still happens WITHOUT reading either commit. */
  const v = autoAdvanceVerdict({ changed: ['.github/workflows/ci.yml', 'src/crypto.ts'], anchors: ANCHOR,
                                 atPin: () => { throw new Error('must not be read'); },
                                 atHead: () => { throw new Error('must not be read'); }, terms,
                                 classify: () => ({ verdict: 'executable', why: 'src/crypto.ts:9 changes code' }) });
  assert.equal(v.verdict, 'refused');
  assert.equal(v.condition, 'a');
  assert.match(v.why, /src\//);
});

test('(a) a src\\/ path that is markup-only falls THROUGH to the anchor checks', () => {
  /* The other half of the same decision: markup-only does not clear a pin by
     itself, it only stops (a) refusing. (b) and (c) still run, and the proof
     that they run is that this reads the commits the test above forbade. */
  /* Line 3 names the anchor's own term, so (c) passes and the verdict reaches
     eligible -- which is what proves (b) and (c) ran at all. */
  const same = ['# Lab', '', 'a Timing side-channel is measured here', '', '', '', '', '', 'x'].join('\n');
  const pin = tree({ 'README.md': same });
  const head = tree({ 'README.md': same });
  const v = autoAdvanceVerdict({ changed: ['src/ui.ts'], anchors: ANCHOR,
                                 atPin: () => pin, atHead: () => head, terms,
                                 classify: () => ({ verdict: 'markup', why: '1 path(s) changed, every changed line is markup, prose or comment' }) });
  assert.equal(v.verdict, 'eligible', JSON.stringify(v));
  assert.match(String(v.markupWhy), /markup, prose or comment/);
});

test('(a) a change the classifier cannot read is refused, not cleared', () => {
  const v = autoAdvanceVerdict({ changed: ['src/crypto.ts'], anchors: ANCHOR,
                                 atPin: () => { throw new Error('must not be read'); },
                                 atHead: () => { throw new Error('must not be read'); }, terms,
                                 classify: () => ({ verdict: 'unreadable', why: 'diff did not run' }) });
  assert.equal(v.verdict, 'refused');
  assert.equal(v.condition, 'a');
  assert.match(v.why, /could not classify/);
});

test('(c) an anchored line that no longer names its term is refused', () => {
  const same = ['# Lab', '', 'nothing here names the technique', '', '', '', '', '', 'x'].join('\n');
  const pin = tree({ 'README.md': same });
  const head = tree({ 'README.md': same });       // byte-identical, so (b) passes
  const v = autoAdvanceVerdict({ changed: ['.github/workflows/ci.yml'], anchors: ANCHOR,
                                 atPin: () => pin, atHead: () => head, terms });
  assert.equal(v.verdict, 'refused');
  assert.equal(v.condition, 'c');
  assert.match(v.why, /no longer resolves/);
});

test('a card with no anchors is refused rather than passing vacuously', () => {
  const d = tree({ 'README.md': 'x' });
  const v = autoAdvanceVerdict({ changed: ['.github/workflows/ci.yml'], anchors: [],
                                 atPin: () => d, atHead: () => d, terms });
  assert.equal(v.verdict, 'refused');
  assert.match(v.why, /vacuous/);
});

test('an unextractable commit is refused, not assumed unchanged', () => {
  const d = tree({ 'README.md': readme('x') });
  const v = autoAdvanceVerdict({ changed: ['.github/workflows/ci.yml'], anchors: ANCHOR,
                                 atPin: () => null, atHead: () => d, terms });
  assert.equal(v.verdict, 'refused');
  assert.equal(v.condition, 'read');
});

test('an anchor missing at one end is refused', () => {
  const pin = tree({ 'README.md': readme('x') });
  const head = tree({ 'README.md': '# Lab' });    // line 3 does not exist
  const v = autoAdvanceVerdict({ changed: ['.github/workflows/ci.yml'], anchors: ANCHOR,
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

test('(a) asks the SHARED substantive rule, so a test file under src/ is not a refusal', () => {
  /* The defect this locks. Condition (a) used a bare /src\// regex of its own
     and refused crypto-lab-quantum-vault-kpqc over
     web-demo/src/__tests__/signature-trust.test.ts. NOT_THE_LAB excludes test
     files, the deriver never reads one, and a gate stricter than the thing it
     guards reports rot that is not there -- the crypto-lab-ghost-commit lesson
     for the fourth time. */
  const pin = tree({ 'README.md': readme('filler') });
  const head = tree({ 'README.md': readme('filler') });
  const v = autoAdvanceVerdict({
    changed: ['web-demo/src/__tests__/signature-trust.test.ts', 'src/git/objects.independent.test.ts'],
    anchors: ANCHOR, atPin: () => pin, atHead: () => head, terms,
  });
  assert.equal(v.verdict, 'eligible', `test files must not refuse an advance: ${v.why}`);
});

test('(a) still refuses real source, and README.md counts because the shared rule says so', () => {
  const pin = tree({ 'README.md': readme('filler') });
  const head = tree({ 'README.md': readme('filler') });
  for (const f of ['src/crypto.ts', 'README.md', 'crates/core/src/lib.rs', 'web-demo/src/app.ts']) {
    const v = autoAdvanceVerdict({ changed: [f], anchors: ANCHOR, atPin: () => pin, atHead: () => head, terms });
    assert.equal(v.verdict, 'refused', f);
    assert.equal(v.condition, 'a', f);
    assert.match(v.why, /substantive path/);
  }
});

test('(c) does NOT name-judge a review-backed anchor, which verify also exempts', () => {
  /* The whole of this report's 37 anchor refusals. A pinned review may credit
     the implementing operation under a generic symbol, so the review is the
     evidence for the NAME and a name grep is not asked -- verifyAnchors says
     the same thing in the same words. Byte-identity (b) still applies. */
  const pin = tree({ 'README.md': readme('filler') });
  // Line 3 reworded so it no longer names the term: (c) would fire if asked.
  const silent = ['# Lab', '', 'constant-time compare.', '', '', '', '', '', 'filler'].join('\n');
  const head = tree({ 'README.md': silent });

  const judged = autoAdvanceVerdict({
    changed: ['.github/workflows/ci.yml'], anchors: ANCHOR,
    atPin: () => pin, atHead: () => head, terms, reviewedAnchor: () => false,
  });
  assert.equal(judged.verdict, 'refused', 'an unreviewed anchor is still name-judged');
  assert.equal(judged.condition, 'b', 'the line changed, so (b) catches it first');

  // Byte-identical at both ends, no longer naming the term, but review-backed.
  const quiet = tree({ 'README.md': silent });
  const backed = autoAdvanceVerdict({
    changed: ['.github/workflows/ci.yml'],
    anchors: [{ name: 'Timing side-channel', file: 'README.md', line: 3 }],
    atPin: () => quiet, atHead: () => tree({ 'README.md': silent }), terms,
    reviewedAnchor: () => true,
  });
  assert.equal(backed.verdict, 'eligible', `a review-backed anchor is not name-judged: ${backed.why}`);
  assert.equal(backed.reviewBacked, 1, 'the row must record that the anchor rested on a review');

  // The same anchor, NOT review-backed, is refused on (c) -- proving the
  // exemption is what changed the answer and not the fixture.
  const unbacked = autoAdvanceVerdict({
    changed: ['.github/workflows/ci.yml'],
    anchors: [{ name: 'Timing side-channel', file: 'README.md', line: 3 }],
    atPin: () => quiet, atHead: () => tree({ 'README.md': silent }), terms,
    reviewedAnchor: () => false,
  });
  assert.equal(unbacked.verdict, 'refused');
  assert.equal(unbacked.condition, 'c');
});
