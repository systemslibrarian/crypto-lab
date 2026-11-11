'use strict';

/*
 * anchorsUnchangedAt — the field that lets a machine say "the anchored blobs did
 * not move" without saying "a person read this".
 *
 * Every test here carries a MUTATION that must fail, because each property
 * below is the kind that a broken implementation satisfies trivially. A
 * refusal rule that refused everything would pass "salamander is refused"; a
 * verify that ignored the field would pass "a stale field fails" only if the
 * clean case also failed. So each test asserts the discriminating pair.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  validateExhibitManifest, verifyLocalSources, rangeReport, advanceVerdict,
  writeAnchorsUnchangedAt, assertOnlyFieldMoved,
} = require('../tools/catalog-exhibits.js');

const EDITS = [{
  id: 'test-fleet-edit',
  removed: ['<a class="brand" href="/" aria-label="Home">'],
  added: ['<a class="brand" href="/">'],
}];

const git = (dir, args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trimEnd();

/** A throwaway lab: two commits, with `second` applied on top of `first`. */
function lab(first, second) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'exhibit-lab-'));
  git(dir, ['init', '-q', '-b', 'main']);
  git(dir, ['config', 'user.email', 'test@example.invalid']);
  git(dir, ['config', 'user.name', 'Test']);
  const put = (files) => {
    for (const [file, body] of Object.entries(files)) {
      if (body === null) { fs.rmSync(path.join(dir, file), { force: true }); continue; }
      fs.mkdirSync(path.join(dir, path.dirname(file)), { recursive: true });
      fs.writeFileSync(path.join(dir, file), body);
    }
    git(dir, ['add', '-A']);
    git(dir, ['commit', '-q', '-m', 'x']);
    return git(dir, ['rev-parse', 'HEAD']);
  };
  return { dir, from: put(first), to: put(second) };
}

const review = (commit, over) => ({
  commit,
  reviewed: '2026-10-22',
  reviewScope: 'complete',
  exhibits: [{
    id: 'demo', title: 'Demo', kind: 'interactive', execution: 'real-crypto',
    action: 'Press the button.', outcome: 'It runs.',
    concepts: ['hashing'], evidence: ['src/anchored.ts:1'],
  }],
  ...over,
});

/* ------------------------------------------------------------------ 1 ----- */

test('a salamander-shaped range is refused: the anchors held still, and a panel landed anyway', () => {
  /* crypto-lab-salamander gained src/ui/property-scope.ts -- a whole published
     panel with its own heading, claims table and sources -- while every file
     its exhibit map anchors stayed byte-identical. A map claiming COMPLETE
     coverage cannot be carried forward over that. */
  const base = { 'src/anchored.ts': 'export const run = () => 1;\n', 'README.md': 'a\n' };
  const panel = lab(base, { ...base, 'src/ui/property-scope.ts': 'export const panel = () => 2;\n' });
  const report = rangeReport(git, panel.dir, review(panel.from), panel.to, EDITS, 'crypto-lab-test');
  const verdict = advanceVerdict(report);
  assert.equal(report.anchored, 'identical', 'the anchored blob really did not move');
  assert.equal(verdict.ok, false);
  assert.match(verdict.why, /src\/ui\/property-scope\.ts/);

  /* MUTATION 1 — the same shape with the panel file removed from the rule's
     reach. A lockfile is not a panel, and a rule that refused this would refuse
     every lab in the fleet every week, which is the backlog this exists to end. */
  const lock = lab(base, { ...base, 'package-lock.json': '{"lockfileVersion":3}\n' });
  assert.equal(advanceVerdict(rangeReport(git, lock.dir, review(lock.from), lock.to, EDITS, 'crypto-lab-test')).ok,
    true, 'a lockfile bump must stay writable or the rule discriminates nothing');

  /* MUTATION 2 — the same panel under a SELECTED scope. The refusal is the
     completeness claim, not a general fear of change: a map that never claimed
     to cover everything is not falsified by a new panel. */
  assert.equal(advanceVerdict(rangeReport(git, panel.dir, review(panel.from, { reviewScope: 'selected' }), panel.to, EDITS, 'crypto-lab-test')).ok,
    true, 'a selected scope must not be refused by the complete-scope rule');
});

/* ------------------------------------------------------------------ 2 ----- */

test('verify re-derives the field and fails when the anchored blobs actually differ', () => {
  const moved = lab({ 'src/anchored.ts': 'export const run = () => 1;\n' },
    { 'src/anchored.ts': 'export const run = () => 999;\n' });
  const still = lab({ 'src/anchored.ts': 'export const run = () => 1;\n' },
    { 'src/anchored.ts': 'export const run = () => 1;\n', 'docs/note.md': 'n\n' });

  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'exhibit-fleet-'));
  const place = (slug, made) => {
    fs.cpSync(made.dir, path.join(parent, slug), { recursive: true });
    return made;
  };
  place('crypto-lab-moved', moved);
  place('crypto-lab-still', still);

  const manifest = (slug, made, at) => ({
    schemaVersion: 1,
    labs: { [slug]: { ...review(made.from), anchorsUnchangedAt: at } },
  });
  const field = (made) => ({ commit: made.to, checked: '2026-11-11', basis: 'anchored-blobs-identical' });

  /* The stored field is a CACHE. It says the blobs held; verify opens the clone
     and finds out. Here they did not. */
  const bad = verifyLocalSources(manifest('crypto-lab-moved', moved, field(moved)), parent, EDITS);
  assert.equal(bad.errors.length, 1);
  assert.match(bad.errors[0], /that is not true of this clone/);
  assert.match(bad.errors[0], /src\/anchored\.ts/);

  /* MUTATION — the identical field over a range where the blobs really did
     hold. Without this, a verify that rejected every field would pass above. */
  const good = verifyLocalSources(manifest('crypto-lab-still', still, field(still)), parent, EDITS);
  assert.deepEqual(good.errors, [], 'a true field must verify clean');

  /* MUTATION — a field naming some other commit is not a pass for THIS head. */
  const elsewhere = verifyLocalSources(
    manifest('crypto-lab-still', still, { ...field(still), commit: 'b'.repeat(40) }), parent, EDITS);
  assert.match(elsewhere.errors[0], /has not been re-run for this checkout/);

  /* MUTATION — a basis the range does not support is named, not silently kept. */
  const wrongBasis = verifyLocalSources(
    manifest('crypto-lab-still', still, { ...field(still), basis: 'anchored-diff-allowlisted-edit', allowlist: ['test-fleet-edit'] }),
    parent, EDITS);
  assert.match(wrongBasis.errors[0], /re-deriving the range gives anchored-blobs-identical/);
});

/* ------------------------------------------------------------------ 3 ----- */

test('writing the field moves nothing else, and commit and reviewed stay frozen', () => {
  const file = path.join(__dirname, '..', 'tools', 'catalog-exhibits.json');
  const text = fs.readFileSync(file, 'utf8');
  const before = JSON.parse(text);
  /* One lab that has no field yet (the write INSERTS) and one that has (the
     write REPLACES). Both paths edit the same hand-maintained file and both
     have to leave every other lab alone. */
  const slug = Object.keys(before.labs).find((k) => !before.labs[k].anchorsUnchangedAt);
  const already = Object.keys(before.labs).find((k) => before.labs[k].anchorsUnchangedAt);
  assert.ok(slug && already, 'the manifest holds both shapes, so both paths are exercised');
  const value = { commit: 'c'.repeat(40), checked: '2026-11-11', basis: 'anchored-blobs-identical' };

  const out = writeAnchorsUnchangedAt(text, slug, value);
  const after = JSON.parse(out);

  assert.deepEqual(after.labs[slug].anchorsUnchangedAt, value, 'the field must actually land');
  assert.equal(after.labs[slug].commit, before.labs[slug].commit);
  assert.equal(after.labs[slug].reviewed, before.labs[slug].reviewed);
  assert.equal(Object.keys(after.labs).length, Object.keys(before.labs).length);
  for (const k of Object.keys(before.labs)) {
    const was = { ...before.labs[k] }; const now = { ...after.labs[k] };
    delete was.anchorsUnchangedAt; delete now.anchorsUnchangedAt;
    assert.deepEqual(now, was, `${k} moved outside anchorsUnchangedAt`);
  }
  /* The file is hand-maintained 2-space JSON and stays readable as such: the
     write INSERTS a block and leaves every other line untouched, rather than
     round-tripping the file through JSON.stringify. */
  const was = text.split('\n');
  const now = out.split('\n');
  assert.equal(now.length - was.length, 5, 'exactly the new block is inserted');
  /* `now` must be `was` with one contiguous run spliced in -- not merely the
     same set of lines, which a reordering would also satisfy. */
  let at = 0;
  while (at < was.length && was[at] === now[at]) at += 1;
  const inserted = now.slice(at, at + 5);
  assert.deepEqual(now.slice(at + 5), was.slice(at), 'everything after the block is untouched');
  assert.match(inserted[0], /^ {6}"anchorsUnchangedAt": \{$/);
  assert.match(inserted[4], /^ {6}\},$/);
  assert.match(out, /^ {4}"crypto-lab-/m, 'two-space indentation survives');

  /* The REPLACE path: a field already present is swapped, not duplicated, and
     still nothing else moves. */
  const swapped = JSON.parse(writeAnchorsUnchangedAt(text, already, value));
  assert.deepEqual(swapped.labs[already].anchorsUnchangedAt, value);
  assert.equal(swapped.labs[already].commit, before.labs[already].commit);
  assert.equal(swapped.labs[already].reviewed, before.labs[already].reviewed);
  for (const k of Object.keys(before.labs)) {
    if (k === already) continue;
    assert.deepEqual(swapped.labs[k], before.labs[k], `${k} moved during a replace`);
  }

  /* And the REMOVE path, so a field can be withdrawn rather than edited by hand. */
  const removed = JSON.parse(writeAnchorsUnchangedAt(text, already, null));
  assert.equal(removed.labs[already].anchorsUnchangedAt, undefined);
  assert.equal(removed.labs[already].reviewed, before.labs[already].reviewed);

  /* MUTATION — the writer's OWN guard, exercised on the shape that breaks its
     arithmetic. A field already present in a different layout (one line rather
     than a block) makes the replacement search run past the end of this lab and
     swallow the next one. That is a real editing hazard rather than an invented
     one: nothing stops a person hand-writing the field inline, and the writer
     must refuse instead of silently deleting a neighbour. The guard is the only
     thing standing between that and a committed manifest. */
  const blockAt = text.indexOf(`    ${JSON.stringify(slug)}: {`);
  const reviewedAt = text.indexOf('      "reviewed":', blockAt);
  const lineEnd = text.indexOf('\n', reviewedAt) + 1;
  const inline = text.slice(0, lineEnd)
    + `      "anchorsUnchangedAt": {"commit": "${'d'.repeat(40)}", "checked": "2026-11-10", "basis": "anchored-blobs-identical"},\n`
    + text.slice(lineEnd);
  assert.notEqual(inline, text, 'the inline fixture was actually built');
  assert.equal(JSON.parse(inline).labs[slug].anchorsUnchangedAt.commit, 'd'.repeat(40));
  assert.throws(() => writeAnchorsUnchangedAt(inline, slug, value),
    /not in the block layout this writer can edit/,
    'the writer must refuse a layout its block arithmetic cannot edit safely');

  /* MUTATION — the guard itself, on an edit that IS valid JSON and still wrong.
     This is the shape no parse can catch: well-formed output in which another
     lab quietly moved. Without the guard nothing here would notice. */
  const other = Object.keys(before.labs)[1];
  const collateral = out.replace(
    new RegExp(`("${other}":[\\s\\S]{0,120}?"reviewed": )"\\d{4}-\\d\\d-\\d\\d"`),
    '$1"2099-01-01"');
  assert.notEqual(collateral, out, 'the collateral-damage fixture was actually built');
  assert.equal(JSON.parse(collateral).labs[other].reviewed, '2099-01-01', 'and it is valid JSON');
  assert.throws(() => assertOnlyFieldMoved(before, collateral, slug, value),
    new RegExp(`${other}: the write moved a field outside anchorsUnchangedAt`),
    'a valid-JSON write that moved another lab must be refused');
});

/* ------------------------------------------------------------------ 4 ----- */

test('basis is an enum, and an unknown one is rejected rather than carried', () => {
  const slug = 'crypto-lab-sample';
  const base = () => ({ schemaVersion: 1, labs: { [slug]: review('a'.repeat(40)) } });
  const withField = (at) => { const m = base(); m.labs[slug].anchorsUnchangedAt = at; return m; };
  const ok = { commit: 'b'.repeat(40), checked: '2026-11-11', basis: 'anchored-blobs-identical' };

  assert.deepEqual(validateExhibitManifest(base(), [slug]), [], 'the fixture itself is valid');
  assert.deepEqual(validateExhibitManifest(withField(ok), [slug]), []);
  assert.deepEqual(validateExhibitManifest(withField({
    commit: 'b'.repeat(40), checked: '2026-11-11', basis: 'anchored-diff-allowlisted-edit', allowlist: ['brand-link-aria-label-removed-2026-11'],
  }), [slug]), []);

  /* MUTATION — the string a future writer would most plausibly invent. */
  const unknown = validateExhibitManifest(withField({ ...ok, basis: 'anchors-unchanged' }), [slug]).join('\n');
  assert.match(unknown, /basis must be one of anchored-blobs-identical, anchored-diff-allowlisted-edit/);

  /* MUTATION — an allowlisted basis resting on nothing names no fleet edit. */
  assert.match(validateExhibitManifest(withField({ ...ok, basis: 'anchored-diff-allowlisted-edit' }), [slug]).join('\n'),
    /must name the tools\/fleet-edits\.json entries/);

  /* MUTATION — and an allowlist under a basis that does not rest on one. */
  assert.match(validateExhibitManifest(withField({ ...ok, allowlist: ['x'] }), [slug]).join('\n'),
    /only an allowlisted-edit basis may carry an allowlist/);

  /* MUTATION — a field that records the commit already reviewed records nothing. */
  assert.match(validateExhibitManifest(withField({ ...ok, commit: 'a'.repeat(40) }), [slug]).join('\n'),
    /repeats the review commit/);
});
