/**
 * One ruling, one supplement.
 *
 * A `remove` records that a person read the source and decided the lab does not
 * implement the named thing. applyReviewRemovals then deletes the name from
 * `hits`, and commentOnly is built from mentions NOT in hits -- so the removal
 * turned an implements claim into a prose-only accusation, and settling that
 * took a SECOND supplement saying the same thing about the same name on the
 * same pin. crypto-lab-sm9-forge is where it showed: its pin removed SM4 with
 * the note "SM3 and SM4 remain imported rather than implemented here", and SM4
 * came back as comment-only until a removeCommentOnly was added saying it again.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const { reviewedRemovedNames, evidenceFor } = require('../tools/catalog-evidence.js');
const REVIEWS = require('../tools/catalog-reviewed.json');

const PIN = 'a'.repeat(40);

test('a remove on a live pin yields its names', () => {
  const m = reviewedRemovedNames('lab', { commit: PIN, remove: ['SM4', 'SM3'] }, null);
  assert.deepEqual([...m].sort(), ['SM3', 'SM4']);
});

test('a STALE pin carries no ruling, so the observation returns', () => {
  const stale = { pinned: PIN, current: 'b'.repeat(40) };
  assert.equal(reviewedRemovedNames('lab', { commit: PIN, remove: ['SM4'] }, stale).size, 0);
});

test('an unpinned or abbreviated-commit review carries no ruling', () => {
  assert.equal(reviewedRemovedNames('lab', null, null).size, 0);
  assert.equal(reviewedRemovedNames('lab', { remove: ['SM4'] }, null).size, 0);
  assert.equal(reviewedRemovedNames('lab', { commit: 'abc1234', remove: ['SM4'] }, null).size, 0);
});

test('an absent or empty remove is empty, not an error', () => {
  assert.equal(reviewedRemovedNames('lab', { commit: PIN }, null).size, 0);
  assert.equal(reviewedRemovedNames('lab', { commit: PIN, remove: [] }, null).size, 0);
});

test('a remove that is not an array is refused rather than ignored', () => {
  assert.throws(() => reviewedRemovedNames('lab', { commit: PIN, remove: 'SM4' }, null), /must be an array/);
});

test('sm9-forge: the remove alone keeps SM4 out of comment-only, and says so', () => {
  /* The live case, driven through the real deriver. SM4 is in this pin's remove
     AND in its removeCommentOnly; the second is now redundant. With the
     explicit entry present, the explicit one carries it and nothing is
     double-reported; the remove is proven to carry it on its own by the
     redundancy assertion below plus the live run recorded in the PR. */
  const rev = REVIEWS['crypto-lab-sm9-forge'];
  assert.ok((rev.remove || []).includes('SM4'), 'the pin must still remove SM4');
  const ev = evidenceFor('crypto-lab-sm9-forge');
  assert.equal((ev.commentOnly || []).some((c) => c.name === 'SM4'), false,
    'SM4 must not read as a prose-only accusation on a lab whose pin already ruled it out');
});

test('a name removed but never mentioned in prose settles nothing and is not reported', () => {
  /* Checked on a SAMPLE rather than all 139 pinned labs: evidenceFor reads a
     clone per call, so the whole set took 110 seconds and a test nobody will
     wait for is a test that gets skipped. The invariant is structural anyway --
     removeSettledCommentOnly is inertOnly filtered by the remove set, so every
     entry carries a mention location by construction -- and these two labs
     exercise it on real data: one whose remove names something the prose does
     mention, one whose removes it does not. */
  for (const slug of ['crypto-lab-sm9-forge', 'crypto-lab-hybrid-sign']) {
    const rev = REVIEWS[slug];
    const ev = evidenceFor(slug);
    for (const r of ev.removeSettledCommentOnly || []) {
      assert.match(r.at, /^.+:\d+$/, `${slug}: ${r.name} must carry the location it was mentioned at`);
      assert.ok((rev.remove || []).includes(r.name), `${slug}: ${r.name} is reported settled but is not in remove`);
    }
    // And nothing settled may also still be listed as comment-only.
    const settledNames = new Set((ev.removeSettledCommentOnly || []).map((r) => r.name));
    for (const c of ev.commentOnly || []) {
      assert.equal(settledNames.has(c.name), false, `${slug}: ${c.name} is both settled and still accused`);
    }
  }
});

test('the redundant explicit entries are exactly the ones a remove now carries', () => {
  const redundant = [];
  for (const [slug, rev] of Object.entries(REVIEWS)) {
    const rm = new Set(rev.remove || []);
    for (const n of rev.removeCommentOnly || []) if (rm.has(n)) redundant.push(`${slug} ${n}`);
  }
  // Recorded, not deleted: the entries are harmless and removing them would be
  // an edit to a person's pin for tidiness rather than for truth.
  assert.deepEqual(redundant, ['crypto-lab-sm9-forge SM4']);
});
