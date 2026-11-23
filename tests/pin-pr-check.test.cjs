/* The per-PR pin check, proved against real repositories rather than asserted.
 *
 * #530 is a checker that reported green about a question it never asked. A test
 * for its fix that only grepped the source would be the same mistake in a new
 * place, so every case here builds throwaway git repositories -- a fake lab and
 * a fake catalog -- advances a pin in them, and reads what the rule returns.
 *
 * The cases, and each is here because it must come out differently:
 *
 *   1  pin advanced over src/      , reviewedCommit still    -> UNREVIEWED-ADVANCE
 *   2  pin advanced over a lockfile, reviewedCommit still    -> OK   (not substantive)
 *   3  pin advanced over src/      , reviewedCommit moved too -> OK
 *   4  pin == reviewedCommit                                  -> OK
 *   5  a commit that cannot be read                           -> UNREADABLE, and FAILS
 *   6  the pin table untouched by the branch                  -> nothing judged
 *
 * Case 6 is the baseline control: without it, a rule that flagged every lab
 * would pass cases 1 and 5 and look like a working check. Case 2 is the other
 * control -- it is what stops the rule degenerating into "any pin advance fails",
 * which would make the fleet's grouped Dependabot bumps unmergeable.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const TOOL = require('../tools/pin-pr-check.js');

const run = (dir, ...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' }).trim();

/** A fake lab with three commits: base, a src/ change, a lockfile-only change. */
function fakeLab(root) {
  const dir = path.join(root, 'crypto-lab-fixture');
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  run(dir, 'init', '--quiet', '-b', 'main');
  run(dir, 'config', 'user.email', 'f@x');
  run(dir, 'config', 'user.name', 'Fixture');
  fs.writeFileSync(path.join(dir, 'src', 'main.ts'), 'export const a = 1;\n');
  fs.writeFileSync(path.join(dir, 'package-lock.json'), '{"v":1}\n');
  run(dir, 'add', '-A'); run(dir, 'commit', '--quiet', '-m', 'base');
  const base = run(dir, 'rev-parse', 'HEAD');

  fs.writeFileSync(path.join(dir, 'package-lock.json'), '{"v":2}\n');
  run(dir, 'add', '-A'); run(dir, 'commit', '--quiet', '-m', 'bump only');
  const bump = run(dir, 'rev-parse', 'HEAD');

  fs.writeFileSync(path.join(dir, 'src', 'main.ts'), 'export const a = 2; // reworked\n');
  run(dir, 'add', '-A'); run(dir, 'commit', '--quiet', '-m', 'real source change');
  const src = run(dir, 'rev-parse', 'HEAD');

  return { dir, base, bump, src };
}

/** judge() against a real repository, which is what the CI step ends up doing. */
const judgeIn = (lab, rc, pin) => TOOL.judge('crypto-lab-fixture', rc, pin, lab.dir);

test('1 — pin advanced over src/ while reviewedCommit stays: UNREVIEWED-ADVANCE', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pinpr-1-'));
  const lab = fakeLab(root);
  const v = judgeIn(lab, lab.base, lab.src);
  assert.equal(v.state, 'UNREVIEWED-ADVANCE', 'a real source change past the review must be caught');
  assert.deepEqual(v.files, ['src/main.ts'], 'and must name the file that made it substantive');
});

test('2 — pin advanced over a lockfile only: OK, because that is not the lab', () => {
  /* The control that stops this becoming "any pin advance fails". This fleet
     merges grouped Dependabot bumps automatically; if those failed the check,
     it would be switched off within a week. */
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pinpr-2-'));
  const lab = fakeLab(root);
  const v = judgeIn(lab, lab.base, lab.bump);
  assert.equal(v.state, 'OK', 'a lockfile-only advance is not a review defect');
  assert.equal(v.total, 1, 'and the file really did change — the range is not empty');
});

test('3 — reviewedCommit moved with the pin: OK', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pinpr-3-'));
  const lab = fakeLab(root);
  const v = judgeIn(lab, lab.src, lab.src);
  assert.equal(v.state, 'OK', 'a review at the pinned commit is the state this check wants');
});

test('4 — pin equals reviewedCommit: OK with nothing in the range', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pinpr-4-'));
  const lab = fakeLab(root);
  const v = judgeIn(lab, lab.base, lab.base);
  assert.equal(v.state, 'OK');
  assert.equal(v.total, 0);
});

test('5 — a commit that is not present is UNREADABLE, never OK', () => {
  /* #530 in miniature: the one answer this check must never give to "I could
     not look" is a pass. */
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pinpr-5-'));
  const lab = fakeLab(root);
  const absent = '0'.repeat(39) + '1';
  const v = judgeIn(lab, absent, lab.src);
  assert.equal(v.state, 'UNREADABLE');
  assert.match(v.why, /not present/);
});

test('6 — a branch that does not touch the pin table has nothing to judge', () => {
  /* BASELINE CONTROL. Without it, a rule that flagged everything would still
     pass cases 1 and 5 and read as a working check. */
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pinpr-6-'));
  const repo = path.join(root, 'catalog');
  fs.mkdirSync(path.join(repo, 'tools'), { recursive: true });
  run(repo, 'init', '--quiet', '-b', 'main');
  run(repo, 'config', 'user.email', 'f@x');
  run(repo, 'config', 'user.name', 'Fixture');
  const table = { 'crypto-lab-fixture': { commit: 'a'.repeat(40), reviewedCommit: 'a'.repeat(40), reviewed: '2026-01-01' } };
  fs.writeFileSync(path.join(repo, 'tools/catalog-reviewed.json'), `${JSON.stringify(table, null, 2)}\n`);
  run(repo, 'add', '-A'); run(repo, 'commit', '--quiet', '-m', 'pins');
  const base = run(repo, 'rev-parse', 'HEAD');
  fs.writeFileSync(path.join(repo, 'README.md'), 'unrelated\n');
  run(repo, 'add', '-A'); run(repo, 'commit', '--quiet', '-m', 'unrelated change');

  const { changed, error } = TOOL.changedPins(base, repo);
  assert.equal(error, undefined);
  assert.deepEqual(changed, [], 'a branch that does not move a pin must be judged on nothing');
});

test('6b — and the same branch WITH a pin advance is seen, so case 6 is not blindness', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pinpr-6b-'));
  const repo = path.join(root, 'catalog');
  fs.mkdirSync(path.join(repo, 'tools'), { recursive: true });
  run(repo, 'init', '--quiet', '-b', 'main');
  run(repo, 'config', 'user.email', 'f@x');
  run(repo, 'config', 'user.name', 'Fixture');
  const write = (t) => fs.writeFileSync(path.join(repo, 'tools/catalog-reviewed.json'), `${JSON.stringify(t, null, 2)}\n`);
  write({ 'crypto-lab-fixture': { commit: 'a'.repeat(40), reviewedCommit: 'a'.repeat(40) } });
  run(repo, 'add', '-A'); run(repo, 'commit', '--quiet', '-m', 'pins');
  const base = run(repo, 'rev-parse', 'HEAD');
  write({ 'crypto-lab-fixture': { commit: 'b'.repeat(40), reviewedCommit: 'a'.repeat(40) } });
  run(repo, 'add', '-A'); run(repo, 'commit', '--quiet', '-m', 'advance the pin');

  const { changed } = TOOL.changedPins(base, repo);
  assert.equal(changed.length, 1, 'a moved `commit` must be picked up');
  assert.equal(changed[0].slug, 'crypto-lab-fixture');
  assert.equal(changed[0].previous.commit, 'a'.repeat(40), 'and the previous value travels with it');
});

test('a prose-only pin edit is not treated as an advance', () => {
  /* `reason` and `note` change often; neither moves the source a review covers. */
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pinpr-prose-'));
  const repo = path.join(root, 'catalog');
  fs.mkdirSync(path.join(repo, 'tools'), { recursive: true });
  run(repo, 'init', '--quiet', '-b', 'main');
  run(repo, 'config', 'user.email', 'f@x');
  run(repo, 'config', 'user.name', 'Fixture');
  const write = (t) => fs.writeFileSync(path.join(repo, 'tools/catalog-reviewed.json'), `${JSON.stringify(t, null, 2)}\n`);
  write({ x: { commit: 'a'.repeat(40), reviewedCommit: 'a'.repeat(40), note: 'first' } });
  run(repo, 'add', '-A'); run(repo, 'commit', '--quiet', '-m', 'pins');
  const base = run(repo, 'rev-parse', 'HEAD');
  write({ x: { commit: 'a'.repeat(40), reviewedCommit: 'a'.repeat(40), note: 'reworded' } });
  run(repo, 'add', '-A'); run(repo, 'commit', '--quiet', '-m', 'reword');
  assert.deepEqual(TOOL.changedPins(base, repo).changed, []);
});

test('the tool declares what it reads, which is how anyone checks a checker here', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'tools', 'pin-pr-check.js'), 'utf8');
  assert.match(src, /^ \* Run: /m);
  assert.match(src, /^ \* Prevents: /m);
  assert.match(src, /^ \* Reads: /m);
});

/* ---------------------------------------------------------------- the anchor half
 *
 * The substantive rule above cannot reach #530's own incident, and that was
 * established by running it against the real thing rather than reasoned about:
 * recreating 47e0f6b's advance of crypto-lab-biham-lens (pin ad43089a -> 5eb415b1,
 * reviewedCommit left behind) returns `OK, 11 file(s) changed, none substantive`,
 * because the only movement was a RENAMED MARKDOWN BRIEF and the staleness rule
 * excludes all markdown deliberately. The anchor that pointed into that brief
 * moved with the rename. So both halves are checked, and the cases below are the
 * ones the first half returns OK for.
 */

/** A fake lab whose markdown brief is renamed, with an anchor pointing into it. */
function labWithRenamedBrief(root) {
  const dir = path.join(root, 'crypto-lab-brief');
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  run(dir, 'init', '--quiet', '-b', 'main');
  run(dir, 'config', 'user.email', 'f@x');
  run(dir, 'config', 'user.name', 'Fixture');
  fs.writeFileSync(path.join(dir, 'src', 'main.ts'), 'export const a = 1;\n');
  fs.writeFileSync(path.join(dir, 'brief-old.md'), `${'x\n'.repeat(40)}`);
  run(dir, 'add', '-A'); run(dir, 'commit', '--quiet', '-m', 'base');
  const reviewed = run(dir, 'rev-parse', 'HEAD');

  run(dir, 'mv', 'brief-old.md', 'BRIEF-new.md');
  run(dir, 'commit', '--quiet', '-m', 'rename the brief');
  const pin = run(dir, 'rev-parse', 'HEAD');
  return { dir, reviewed, pin };
}

const cardWith = (slug, attacks) =>
  `<a class="project-card" data-category="ATTACKS" href="https://systemslibrarian.github.io/${slug}/"`
  + ` data-attacks="${attacks}">x</a>`;

test('ANCHOR — a markdown rename is not substantive, and the anchor half still catches it', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pinpr-anchor-'));
  const lab = labWithRenamedBrief(root);

  /* First half: OK, exactly as it answers for the real biham-lens advance. */
  const first = TOOL.judge('crypto-lab-brief', lab.reviewed, lab.pin, lab.dir);
  assert.equal(first.state, 'OK', 'a markdown-only rename must NOT be substantive — that is the premise');

  /* Second half: the card now anchors into the NEW name, which does not exist at
     the reviewed commit. This is the shape that left main red for days. */
  const html = cardWith('crypto-lab-brief', 'Known-plaintext attack@BRIEF-new.md:31');
  const v = TOOL.judgeAnchors('crypto-lab-brief', lab.reviewed, lab.pin, lab.dir, html);
  assert.equal(v.anchors, 1);
  assert.equal(v.broken.length, 1, 'the renamed path must be caught');
  assert.equal(v.broken[0].at, lab.reviewed, 'and caught at the REVIEWED commit, which is where it is absent');
  assert.match(v.broken[0].why, /path absent/);
});

test('ANCHOR — an anchor readable at both commits passes, so the half is not blanket', () => {
  /* The control. Without it a rule that flagged every anchor would pass the case
     above and read as working. */
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pinpr-anchor-ok-'));
  const lab = labWithRenamedBrief(root);
  const html = cardWith('crypto-lab-brief', 'Known-plaintext attack@src/main.ts:1');
  const v = TOOL.judgeAnchors('crypto-lab-brief', lab.reviewed, lab.pin, lab.dir, html);
  assert.equal(v.anchors, 1);
  assert.deepEqual(v.broken, [], 'a path present at both commits is not a finding');
});

test('ANCHOR — a line past the end of the file is caught, not just a missing path', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pinpr-anchor-line-'));
  const lab = labWithRenamedBrief(root);
  const html = cardWith('crypto-lab-brief', 'Known-plaintext attack@src/main.ts:9999');
  const v = TOOL.judgeAnchors('crypto-lab-brief', lab.reviewed, lab.pin, lab.dir, html);
  assert.equal(v.broken.length, 2, 'unreadable at both commits is two findings, one per commit');
  assert.match(v.broken[0].why, /only \d+ line/);
});

test('ANCHOR — a lab with no card contributes no anchors rather than throwing', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pinpr-anchor-none-'));
  const lab = labWithRenamedBrief(root);
  const v = TOOL.judgeAnchors('crypto-lab-brief', lab.reviewed, lab.pin, lab.dir, '<html>no cards</html>');
  assert.equal(v.anchors, 0);
  assert.deepEqual(v.broken, []);
});

test('the real cards parse into anchors, so the reader is not silently finding none', () => {
  /* A parser that returned [] for every lab would make the anchor half dead
     code while every test above still passed on fixtures. */
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const some = TOOL.anchorsFor('crypto-lab-biham-lens', html);
  assert.ok(some.length > 0, 'a real card must yield real anchors');
  for (const a of some) {
    assert.ok(a.file && a.line > 0, 'each anchor must carry a path and a positive line');
  }
});
