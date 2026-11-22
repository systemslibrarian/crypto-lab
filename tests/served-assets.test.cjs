/**
 * The served-byte digest check: every verdict, and the distinction that makes it
 * worth having.
 *
 * deploy-sync verifies the RUN and says so in its own last line — "Live bytes
 * require separate verification." This fills that in, and the only interesting
 * design decision is that a changed digest has TWO meanings:
 *
 *   moved-with-main   the lab's main also moved: a deploy shipped. Expected.
 *   moved-alone       main stood still and the bytes changed anyway. The finding.
 *
 * A check that flagged every changed digest would fire on every ordinary deploy,
 * and a check that fires constantly is one people stop reading. So the separation
 * is pinned here in both directions, along with every UNREAD path — a lab whose
 * page 200s but references no asset is the one that would otherwise compare
 * nothing and report no drift.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { cardedSlugs, assetRefs, verdictFor, sha256, bust } = require('../tools/served-assets.js');

const ROOT = path.join(__dirname, '..');
const TOOL = path.join(ROOT, 'tools', 'served-assets.js');

test.after(() => { require('../tools/three-way.js').clearUnread(); });

const pinned = (over = {}) => ({ page: 'p0', assets: { 'assets/a.js': 'a0' }, commit: 'c'.repeat(40), pinnedAt: '2026-11-21', ...over });
const served = (over = {}) => ({ page: 'p0', assets: { 'assets/a.js': 'a0' }, ...over });

/* ------------------------------------------------------------- the verdicts */

test('UNCHANGED when every digest matches', () => {
  const v = verdictFor('x', served(), pinned(), 'c'.repeat(40));
  assert.equal(v.verdict, 'unchanged');
});

test('MOVED-WITH-MAIN when the digest changed and main moved: expected, not a finding', () => {
  const v = verdictFor('x', served({ page: 'p1' }), pinned(), 'd'.repeat(40));
  assert.equal(v.verdict, 'moved-with-main');
  assert.match(v.why, /a deploy shipped/);
  assert.deepEqual(v.changed, ['page']);
});

test('MOVED-ALONE when the digest changed and main stood still: THE finding', () => {
  const v = verdictFor('x', served({ assets: { 'assets/a.js': 'a9' } }), pinned(), 'c'.repeat(40));
  assert.equal(v.verdict, 'moved-alone');
  assert.match(v.why, /served bytes changed anyway/);
  assert.deepEqual(v.changed, ['assets/a.js']);
});

test('an asset that appears or disappears counts as changed, not as absent', () => {
  /* A deploy that drops a reference is a changed build. Comparing only the keys
     the pin happens to carry would miss a new asset entirely. */
  const added = verdictFor('x', served({ assets: { 'assets/a.js': 'a0', 'assets/b.css': 'b0' } }), pinned(), 'c'.repeat(40));
  assert.equal(added.verdict, 'moved-alone');
  assert.deepEqual(added.changed, ['assets/b.css']);
  const removed = verdictFor('x', served({ assets: {} }), pinned(), 'c'.repeat(40));
  assert.deepEqual(removed.changed, ['assets/a.js']);
});

test('UNPINNED is its own verdict, never "unchanged"', () => {
  const v = verdictFor('x', served(), undefined, 'c'.repeat(40));
  assert.equal(v.verdict, 'unpinned');
  assert.match(v.why, /no pin yet/);
});

test('a changed digest with an unreadable remote HEAD is UNREAD, not a finding', () => {
  /* The commits might be explained by a main that moved, and ls-remote could not
     say. Calling it moved-alone would accuse the lab on a read failure. */
  const v = verdictFor('x', served({ page: 'p1' }), pinned(), null);
  assert.equal(v.verdict, 'unread');
  assert.match(v.why, /could not say whether main moved/);
});

/* ------------------------------------------------------------ what it reads */

test('asset references are same-origin and hashed; a CDN URL is not one', () => {
  const html = '<script src="/crypto-lab-ascon/assets/index-AbC1.js"></script>'
    + '<link href="/crypto-lab-ascon/assets/index-Xy2.css">'
    + '<script src="https://cdn.example.com/assets/other.js"></script>';
  assert.deepEqual(assetRefs(html), ['assets/index-AbC1.js', 'assets/index-Xy2.css']);
});

test('a page with no hashed asset is PAGE-ONLY, not unread — but must name its lab', () => {
  /* This asserted UNREAD until the first full run measured it. Five labs came back
     with no asset: THREE because this pattern rejected the relative `./assets/`
     form (pake-gate's) and two because they genuinely ship one inline page. A real
     inline page is pinnable on its page digest alone, so it is its own state. The
     guard that remains is the one the UNREAD was really for: a generic 200 error
     page also has no assets, so the body must at least name this lab. */
  assert.deepEqual(assetRefs('<html><body>maintenance</body></html>'), []);
  const src = fs.readFileSync(TOOL, 'utf8');
  assert.match(src, /pageOnly: true/);
  assert.match(src, /names neither an asset nor this lab; not pinnable/);
  assert.match(src, /200 error page looks like/, 'the reason the guard remains must be written down');
});

test('the relative ./assets/ form is matched, which the first pattern missed', () => {
  /* crypto-lab-pake-gate serves `./assets/index-4iw58895.js`. The first pattern
     required the absolute /crypto-lab-<slug>/assets/ form and filed the lab UNREAD
     — a clean, specific, wrong finding from the instrument, the same class as the
     underscore-versus-hyphen slug bug in corpus-served. */
  assert.deepEqual(assetRefs('<script src="./assets/index-4iw58895.js"></script>'), ['assets/index-4iw58895.js']);
  assert.deepEqual(assetRefs('<link href="assets/x-A1.css">'), ['assets/x-A1.css']);
  assert.deepEqual(assetRefs('<script src="/crypto-lab-ascon/assets/index-AbC1.js"></script>'), ['assets/index-AbC1.js']);
});

test('another host\'s assets are NOT this lab\'s deploy and are not matched', () => {
  assert.deepEqual(assetRefs('<script src="https://cdn.example.com/assets/other.js"></script>'), []);
  assert.deepEqual(assetRefs('<script src="//cdn.example.com/assets/other.js"></script>'), []);
});

test('carded slugs come from the card href, the same source corpus-served reads', () => {
  const html = '<a class="project-card" href="https://systemslibrarian.github.io/crypto-lab-iron-letter/">'
    + '<a class="project-card" href="https://crypto-lab.systemslibrarian.dev/nope/">';
  assert.deepEqual([...cardedSlugs(html)], ['iron-letter']);
});

test('fetches are cache-busted, so the digest is of what is served now', () => {
  const a = bust('https://x.invalid/a/');
  assert.match(a, /[?&]cb=/);
  assert.notEqual(a, bust('https://x.invalid/a/'));
  assert.match(bust('https://x.invalid/a/?q=1'), /\?q=1&cb=/, 'an existing query must be preserved');
});

test('sha256 is over bytes, so a BOM or encoding change is a change', () => {
  assert.notEqual(sha256(Buffer.from('a')), sha256(Buffer.from('﻿a')));
  assert.equal(sha256(Buffer.from('abc')), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});

/* ----------------------------------------------------- refusals and wiring */

test('an empty lab selection is refused, not reported clean', () => {
  const src = fs.readFileSync(TOOL, 'utf8');
  assert.match(src, /Refusing to report clean over nothing/);
});

test('the verdict counts must sum to the row count or the run refuses', () => {
  const src = fs.readFileSync(TOOL, 'utf8');
  assert.match(src, /verdicts sum to \$\{sum\}, not \$\{rows\.length\}/);
});

test('it never writes into a lab clone: ls-remote only, no fetch', () => {
  const src = fs.readFileSync(TOOL, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.match(src, /'ls-remote'/);
  assert.ok(!/'fetch',/.test(src), 'no git fetch may appear in executable code');
});

test('it is in the daily CHECKERS and out of the fast loop, like corpus-served', () => {
  const fleet = fs.readFileSync(path.join(ROOT, 'tools', 'fleet-check.js'), 'utf8');
  assert.match(fleet, /served-assets/, 'the daily runner must name it');
  const wf = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'readme-sync.yml'), 'utf8');
  assert.ok(!/served-assets\.js (check|write)/.test(wf),
    'it needs the network, so the per-PR job must not run the checker itself');
  assert.match(wf, /tests\/served-assets\.test\.cjs/, 'its offline controls do belong there');
});

test('the pin file is generated and carries what it was pinned against', () => {
  const pinPath = path.join(ROOT, 'tools', 'served-assets.json');
  assert.ok(fs.existsSync(pinPath), 'the pin must be committed, or there is nothing to compare against');
  const pin = JSON.parse(fs.readFileSync(pinPath, 'utf8'));
  assert.match(pin.note, /never hand-edited/);
  const slugs = Object.keys(pin.labs);
  assert.ok(slugs.length > 200, `expected the fleet to be pinned, got ${slugs.length}`);
  for (const s of slugs.slice(0, 40)) {
    const e = pin.labs[s];
    assert.match(e.page, /^[0-9a-f]{64}$/, `${s}: page digest`);
    assert.match(e.commit, /^[0-9a-f]{40}$/, `${s}: the main it was pinned against`);
    assert.match(e.pinnedAt, /^\d{4}-\d{2}-\d{2}$/, `${s}: when`);
    /* A page-only lab legitimately has none; two labs in this fleet are that
       shape. What must always be present is the page digest and the commit. */
    assert.ok(e.assets && typeof e.assets === 'object', `${s}: an asset map, even if empty`);
  }
});
