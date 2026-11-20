/**
 * The two guards on the human-review fields, in BOTH directions.
 *
 * A guard that only ever passes is indistinguishable from no guard, and this
 * repository has shipped one of those (`C` in depth-audit credited the PRESENCE
 * of a claims spec, so every lab with the file was credited and every lab
 * without it was not, and the column ranked nothing). So every rule here is
 * asserted twice: once on data that must pass and once on data that must fail,
 * and the failing fixture is the shape that actually happened where there is one.
 *
 * The two rules and why both exist:
 *
 *   ADVANCE-CLAIMS-REVIEW     read off the FILE. A pin whose own reason records a
 *                             machine advance must keep reviewedCommit behind
 *                             commit.
 *   MACHINE-SET-REVIEW-FIELD  read off the COMMITS. No machine-made commit may
 *                             move `reviewed`, or move `reviewedCommit` other
 *                             than by the first-time fill.
 *
 * The test that matters most is 'a hand-written re-pin is invisible to rule 1':
 * e5abd41 is the commit this whole guard exists for, and rule 1 cannot see it.
 * If that test ever starts failing because rule 1 grew to cover it, good — but
 * rule 2 must not be deleted on the strength of it.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const TOOL = path.join(ROOT, 'tools', 'review-record.js');
const {
  isMachineCommit, pinFindings, reviewFieldChanges, addedRemoved, commitFindings,
} = require('../tools/review-record.js');

const SHA_A = 'a'.repeat(40);
const SHA_B = 'b'.repeat(40);
const SHA_C = 'c'.repeat(40);
const ADVANCED = 'Pin advanced aaaaaaaaaaaa..bbbbbbbbbbbb by tools/catalog-evidence.js auto-advance --write, not by a person: 2 file(s) changed.';

/* ----------------------------------------------- who wrote the commit */

test('a commit authored by Anthropic is a machine commit', () => {
  assert.ok(isMachineCommit({ authorEmail: 'noreply@anthropic.com', message: 'Anything' }));
});

test('a Co-Authored-By: Claude trailer makes a human-authored commit a machine one', () => {
  /* This is the live case: .github/workflows/pin-advance.yml commits as
     github-actions[bot] with this trailer, and every agent commit in this
     repository carries it under a human author. */
  const why = isMachineCommit({
    authorEmail: 'systemslibrarian@gmail.com',
    message: 'Advance pins\n\nCo-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>\n',
  });
  assert.match(String(why), /trailer/);
});

test('the trailer test is case-insensitive, because git trailers are written both ways', () => {
  assert.ok(isMachineCommit({ authorEmail: 'x@y.z', message: 'subject\n\nco-authored-by: Claude <noreply@anthropic.com>' }));
});

test('a human commit is not a machine commit', () => {
  assert.equal(isMachineCommit({ authorEmail: 'systemslibrarian@gmail.com', message: 'Re-read kem-trap and re-pin it' }), null);
});

test('merely MENTIONING Claude in the prose does not make a commit a machine one', () => {
  /* The negative control that stops the rule degenerating into a word search.
     Half the commit messages in this repository discuss what an agent did. */
  assert.equal(isMachineCommit({
    authorEmail: 'systemslibrarian@gmail.com',
    message: 'Label the note as a Claude read\n\nThe note said Claude had re-reviewed it, which disagreed with the pin.',
  }), null);
});

/* ------------------------------------- RULE 1, both directions */

test('rule 1 passes a machine-advanced pin whose reviewedCommit stays behind', () => {
  const table = { 'crypto-lab-x': { commit: SHA_B, reviewed: '2026-11-05', reviewedCommit: SHA_A, reason: ADVANCED } };
  assert.deepEqual(pinFindings(table), []);
});

test('rule 1 FAILS a machine-advanced pin whose reviewedCommit is the advanced commit', () => {
  const table = { 'crypto-lab-x': { commit: SHA_B, reviewed: '2026-11-19', reviewedCommit: SHA_B, reason: ADVANCED } };
  const found = pinFindings(table);
  assert.equal(found.length, 1);
  assert.equal(found[0].rule, 'ADVANCE-CLAIMS-REVIEW');
  assert.match(found[0].why, /a person read bytes the machine chose/);
});

test('rule 1 FAILS a machine-advanced pin with no reviewedCommit at all', () => {
  /* An advance that did not preserve the commit a person read leaves the entry
     unable to answer "which bytes did someone look at", which is the whole
     reason autoAdvanceWrite writes the field. */
  const table = { 'crypto-lab-x': { commit: SHA_B, reviewed: '2026-11-05', reason: ADVANCED } };
  assert.match(pinFindings(table)[0].why, /must also record the commit a person read/);
});

test('rule 1 ignores a pin that records no machine advance, which is its blind spot', () => {
  /* THE CASE THAT HAPPENED. e5abd41 re-pinned by hand; its reason records a
     `git diff --name-only` derivation, not an auto-advance. The resulting entry
     is indistinguishable from one a person really did re-read, so rule 1 is
     silent and rule 2 is the only thing that catches it. This test exists so
     nobody reads rule 1's silence as coverage. */
  const table = {
    'crypto-lab-kem-trap': {
      commit: SHA_B, reviewed: '2026-11-19', reviewedCommit: SHA_B,
      reason: 'Over aaaaaaaa..bbbbbbbb, 16 file(s) changed, 6 matching src/. Derived from git diff --name-only over that range.',
    },
  };
  assert.deepEqual(pinFindings(table), []);
});

test('rule 1 holds over the real pin table', () => {
  const live = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'catalog-reviewed.json'), 'utf8'));
  const advanced = Object.values(live).filter((e) => /auto-advance --write/.test(String(e.reason || '')));
  assert.ok(advanced.length > 20, 'this control needs the advances to have landed');
  assert.deepEqual(pinFindings(live).map((f) => f.slug), []);
});

/* ------------------------------------- RULE 2's delta, both directions */

const pin = (over = {}) => ({ commit: SHA_B, range: `${SHA_A}..${SHA_B}`, reviewed: '2026-11-05', reason: 'read', ...over });

test('an unchanged entry produces nothing', () => {
  assert.deepEqual(reviewFieldChanges({ x: pin() }, { x: pin() }), []);
});

test('a changed reviewed date is a finding', () => {
  const found = reviewFieldChanges({ x: pin() }, { x: pin({ reviewed: '2026-11-19' }) });
  assert.equal(found.length, 1);
  assert.deepEqual([found[0].field, found[0].from, found[0].to], ['reviewed', '2026-11-05', '2026-11-19']);
});

test('a reviewedCommit moved from one sha to another is a finding', () => {
  const found = reviewFieldChanges(
    { x: pin({ reviewedCommit: SHA_A }) },
    { x: pin({ reviewedCommit: SHA_C }) },
  );
  assert.equal(found.length, 1);
  assert.equal(found[0].field, 'reviewedCommit');
});

test("the first-time fill PASSES: absent, then set to the pin's previous commit", () => {
  /* autoAdvanceWrite's own write, and the live exemption pin-advance.yml commits
     every Monday under a Claude trailer. `commit` is about to move off SHA_B,
     so recording SHA_B preserves a person's reading rather than claiming one. */
  const before = { x: pin({ commit: SHA_B }) };                            // no reviewedCommit yet
  const after = { x: pin({ commit: SHA_C, reviewedCommit: SHA_B, range: `${SHA_B}..${SHA_C}` }) };
  assert.deepEqual(reviewFieldChanges(before, after), []);
});

test('a "fill" to the NEW commit FAILS, which is the forgery wearing the exemption', () => {
  const before = { x: pin({ commit: SHA_B }) };
  const after = { x: pin({ commit: SHA_C, reviewedCommit: SHA_C, range: `${SHA_B}..${SHA_C}` }) };
  const found = reviewFieldChanges(before, after);
  assert.equal(found.length, 1);
  assert.match(found[0].why, /must preserve the commit a person read, which was bbbbbbbbbbbb/);
});

test('a reviewedCommit that is removed is a finding, not a quiet pass', () => {
  const found = reviewFieldChanges({ x: pin({ reviewedCommit: SHA_A }) }, { x: pin() });
  assert.equal(found.length, 1);
  assert.equal(found[0].to, '(absent)');
});

test('an added or removed entry is reported separately and is not a review-field finding', () => {
  const before = { x: pin() };
  const after = { x: pin(), y: pin({ reviewed: '2026-11-20' }) };
  assert.deepEqual(reviewFieldChanges(before, after), []);
  assert.deepEqual(addedRemoved(before, after), { added: ['y'], removed: [] });
  assert.deepEqual(addedRemoved(after, before), { added: [], removed: ['y'] });
});

/* ------------------------------------- RULE 2 end to end, over real commits */

function scratchRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'review-record-'));
  const git = (...args) => {
    const r = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
    assert.equal(r.status, 0, `git ${args.join(' ')}: ${r.stderr}`);
    return r.stdout.trim();
  };
  git('init', '-q', '-b', 'main');
  git('config', 'user.name', 'Fixture');
  git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  fs.mkdirSync(path.join(dir, 'tools'));
  const write = (table) => fs.writeFileSync(path.join(dir, 'tools', 'catalog-reviewed.json'), `${JSON.stringify(table, null, 2)}\n`);
  const commit = (table, subject, { email = 'fixture@example.invalid', trailer = false } = {}) => {
    write(table);
    git('add', 'tools/catalog-reviewed.json');
    const msg = trailer ? `${subject}\n\nCo-Authored-By: Claude Opus 5 <noreply@anthropic.com>\n` : subject;
    const r = spawnSync('git', ['-C', dir, 'commit', '-q', '-m', msg],
      { encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_EMAIL: email, GIT_COMMITTER_EMAIL: email } });
    assert.equal(r.status, 0, `commit: ${r.stderr}`);
    return git('rev-parse', 'HEAD');
  };
  return { dir, git, commit };
}

test('end to end: a machine commit that moves reviewed is found, a human one is not', () => {
  const { dir, git, commit } = scratchRepo();
  const base = commit({ x: pin({ reviewedCommit: SHA_A }) }, 'initial');
  const human = commit({ x: pin({ reviewedCommit: SHA_A, reviewed: '2026-11-10' }) }, 'A person re-read it');
  const machine = commit({ x: pin({ reviewedCommit: SHA_A, reviewed: '2026-11-19' }) }, 'An agent re-read it', { trailer: true });

  const all = commitFindings(dir, `${base}..${machine}`);
  assert.equal(all.judged, 2, 'both later commits touched the table');
  assert.equal(all.machine, 1, 'only one of them is machine-made');
  assert.equal(all.findings.length, 1);
  assert.equal(all.findings[0].sha, machine);
  assert.equal(all.findings[0].field, 'reviewed');

  const onlyHuman = commitFindings(dir, `${base}..${human}`);
  assert.deepEqual(onlyHuman.findings, [], 'a person may move the field they own');
  assert.equal(git('rev-parse', '--abbrev-ref', 'HEAD'), 'main');
});

test('end to end: the first-time fill by a machine commit passes, a fill to the new commit does not', () => {
  const { dir, commit } = scratchRepo();
  const base = commit({ x: pin({ commit: SHA_B }) }, 'initial, no reviewedCommit');
  const ok = commit({ x: pin({ commit: SHA_C, reviewedCommit: SHA_B, range: `${SHA_B}..${SHA_C}`, reason: ADVANCED }) },
    'Advance pins the Dependabot wave left behind', { trailer: true });
  assert.deepEqual(commitFindings(dir, `${base}..${ok}`).findings, [], 'this is autoAdvanceWrite, and it is allowed');

  const bad = commit({ x: pin({ commit: SHA_A, reviewedCommit: SHA_A, range: `${SHA_C}..${SHA_A}`, reason: ADVANCED }) },
    'Re-pin and stamp it', { trailer: true });
  const found = commitFindings(dir, `${ok}..${bad}`).findings;
  assert.equal(found.length, 1);
  assert.equal(found[0].field, 'reviewedCommit');
});

test('end to end: a commit by Anthropic with no trailer is still judged', () => {
  const { dir, commit } = scratchRepo();
  const base = commit({ x: pin({ reviewedCommit: SHA_A }) }, 'initial');
  const bot = commit({ x: pin({ reviewedCommit: SHA_C }) }, 'no trailer at all', { email: 'noreply@anthropic.com' });
  const found = commitFindings(dir, `${base}..${bot}`).findings;
  assert.equal(found.length, 1);
  assert.match(found[0].machineBecause, /noreply@anthropic\.com/);
});

test('end to end: an entry added by a machine commit is counted, not accused', () => {
  const { dir, commit } = scratchRepo();
  const base = commit({ x: pin({ reviewedCommit: SHA_A }) }, 'initial');
  const carded = commit({ x: pin({ reviewedCommit: SHA_A }), y: pin({ reviewed: '2026-11-20' }) },
    'Card a lab and record what its source review found', { trailer: true });
  const out = commitFindings(dir, `${base}..${carded}`);
  assert.deepEqual(out.findings, []);
  assert.deepEqual(out.added, [`${carded.slice(0, 12)} y`]);
});

/* ------------------------------------- the CLI, and could-not-look */

const cli = (args, cwd = ROOT) => spawnSync(process.execPath, [TOOL, ...args], { cwd, encoding: 'utf8' });

test('the CLI exits 0 on a clean range and says both rules ran', () => {
  const { dir, commit } = scratchRepo();
  const base = commit({ x: pin({ reviewedCommit: SHA_A }) }, 'initial');
  const next = commit({ x: pin({ reviewedCommit: SHA_A, note: 'prose only' }) }, 'reword the note', { trailer: true });
  const r = cli(['check', '--repo', dir, '--range', `${base}..${next}`]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /ADVANCE-CLAIMS-REVIEW/);
  assert.match(r.stdout, /MACHINE-SET-REVIEW-FIELD/);
  assert.match(r.stdout, /No machine has moved a human-review field/);
});

test('the CLI exits 1 and names the lab, the field and the commit', () => {
  const { dir, commit } = scratchRepo();
  const base = commit({ x: pin({ reviewedCommit: SHA_A }) }, 'initial');
  const bad = commit({ x: pin({ reviewedCommit: SHA_A, reviewed: '2026-11-19' }) }, 'stamp it', { trailer: true });
  const r = cli(['check', '--repo', dir, '--range', `${base}..${bad}`]);
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /MACHINE-SET-REVIEW-FIELD x {2}reviewed: 2026-11-05 -> 2026-11-19/);
  assert.match(r.stdout, new RegExp(bad.slice(0, 12)));
  assert.match(r.stdout, /restore it to what the person/);
});

test('an unreadable range is COULD NOT LOOK and exits non-zero, never a clean run', () => {
  /* git exits 128 for a bad range and for a directory that is not a repository,
     so "could not look" must never come back as "nothing there". */
  const { dir } = scratchRepo();
  const r = cli(['check', '--repo', dir, '--range', 'deadbeefdeadbeef..HEAD']);
  assert.notEqual(r.status, 0, r.stdout);
  assert.match(r.stdout + r.stderr, /COULD NOT LOOK/);
});

test('a directory that is not a repository is COULD NOT LOOK, not a pass', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'review-record-bare-'));
  fs.mkdirSync(path.join(dir, 'tools'));
  fs.writeFileSync(path.join(dir, 'tools', 'catalog-reviewed.json'), '{}\n');
  const r = cli(['check', '--repo', dir]);
  assert.notEqual(r.status, 0, r.stdout);
  assert.match(r.stdout + r.stderr, /COULD NOT LOOK/);
  assert.match(r.stdout + r.stderr, /not a git repository/);
});

test('an unreadable pin table is COULD NOT LOOK rather than zero findings', () => {
  const { dir, commit } = scratchRepo();
  const base = commit({ x: pin({ reviewedCommit: SHA_A }) }, 'initial');
  fs.writeFileSync(path.join(dir, 'tools', 'catalog-reviewed.json'), '{ not json');
  const r = cli(['check', '--repo', dir, '--range', `${base}..HEAD`]);
  assert.notEqual(r.status, 0, r.stdout);
  assert.match(r.stdout + r.stderr, /COULD NOT LOOK/);
});

test('an unknown mode is refused rather than silently treated as check', () => {
  const r = cli(['verify']);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /unknown mode/);
});

/* ------------------------------------- the guard is actually wired up */

test('a workflow runs it on pull_request, with the history it needs', () => {
  /* A guard nothing runs is the same as no guard, and it needs fetch-depth: 0 —
     the default shallow checkout has neither the base commit nor the PR's own
     commits, so the range would be UNREADABLE and the job would fail for the
     wrong reason. */
  const wf = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'review-record.yml'), 'utf8');
  assert.match(wf, /^on:[\s\S]*?^ {2}pull_request:/m, 'it must run on pull_request');
  assert.ok(!/^ {2}push:/m.test(wf),
    'it must NOT run on push: main carries changes the owner has already accepted, and re-judging them every time main moves would redden main for a decision already made');
  assert.match(wf, /fetch-depth:\s*0/, 'it reads the PR\'s own commits');
  assert.match(wf, /node tools\/review-record\.js check/);
  assert.match(wf, /REVIEW_RECORD_RANGE/, 'the range must come from the pull request, not from a guess');
});
