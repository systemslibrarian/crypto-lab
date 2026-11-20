#!/usr/bin/env node
/*
 * review-record.js — `reviewed` and `reviewedCommit` in tools/catalog-reviewed.json
 * are the record of a PERSON's reading, and only a person may move them.
 *
 * Run: node tools/review-record.js check
 * Prevents: a machine advancing `reviewed` or `reviewedCommit`, which makes the pin table claim a reading nobody performed
 * Reads: tools/catalog-reviewed.json, and `git rev-parse` / `git log` / `git show` over this pull request's own commit range (REVIEW_RECORD_RANGE, else origin/main..HEAD)
 *
 * WHY THIS EXISTS
 *
 * Every other guard on the pin table asks whether its CONTENT is right. These two
 * fields are different in kind: they are not a claim about a lab, they are a claim
 * about a person. `catalog-evidence` ages every pin from `reviewed` and prints
 * "1234d ... reviewed 2026-xx-xx" in its STALE-REVIEW report, and
 * tests/catalog-teaching-scope.test.cjs reads `reviewedCommit` precisely because
 * it is the commit a person looked at rather than the one a machine advanced to.
 * So a machine that writes either one does not state a falsehood about source —
 * it forges an attestation, and nothing downstream can tell the difference.
 *
 * It happened. e5abd41 advanced two pins and, in the same edit, set both labs'
 * `reviewedCommit` to the commit it had just advanced to and stamped `reviewed`
 * with that day's date. #514 restored one and #515 the other. The note on each
 * said, in its own words, that the reading had been done "by Claude (an AI agent,
 * not a human reviewer)" — so the file contained both the claim and its refutation
 * and no check compared them.
 *
 * TWO RULES, BECAUSE ONE OF THEM CANNOT SEE THE CASE THAT HAPPENED
 *
 *   ADVANCE-CLAIMS-REVIEW   a pin whose own `reason` records a machine advance
 *                           must carry a `reviewedCommit` that is BEHIND
 *                           `commit`. Read off the file, so it holds however the
 *                           entry got there.
 *
 *   MACHINE-SET-REVIEW-FIELD  no machine-made commit in this pull request may
 *                           change any lab's `reviewed`, or change a
 *                           `reviewedCommit` other than by the one legitimate
 *                           first-time fill. Read off the commits, so it holds
 *                           for an entry whose `reason` says nothing.
 *
 * The first rule MISSES e5abd41 and that is not a defect in it: that commit was a
 * hand-written re-pin, its `reason` records a `git diff --name-only` derivation
 * rather than an auto-advance, and there is nothing in the resulting file to
 * distinguish it from a pin a person really did re-read. The only evidence left is
 * WHO WROTE IT, which is why the second rule reads git and not JSON.
 *
 * THE ONE LEGITIMATE MACHINE WRITE
 *
 * `autoAdvanceWrite` sets `reviewedCommit` once, on a pin's first advance, to the
 * value `commit` held before that advance. That write does not claim a reading: it
 * PRESERVES one that `commit` is about to stop recording, which is the whole reason
 * the field exists. It is written `if (!e.reviewedCommit)` for exactly that reason,
 * and .github/workflows/pin-advance.yml commits it every Monday with a
 * `Co-Authored-By: Claude` trailer — so this is a live exemption, exercised on a
 * schedule, not a hypothetical one. It is recognised narrowly: absent before, and
 * afterwards equal to the PREVIOUS `commit`. A fill to the NEW commit is the
 * forgery above wearing the exemption's clothes, and fails.
 *
 * WHAT THIS DOES NOT JUDGE, SAID OUT LOUD
 *
 * An entry ADDED or REMOVED by a machine commit is counted and printed, and is not
 * a finding. Carding a lab writes a new pin with the date its source review was
 * done, and refusing that would refuse the normal way a lab arrives. It is a hole,
 * it is narrow — a new record cannot overwrite a person's existing one — and it is
 * named here rather than left for someone to discover as a silence.
 *
 * And it runs on pull_request ONLY, deliberately. It judges the commits a pull
 * request PROPOSES. Judging `main` would re-judge, every time main moved, a change
 * the owner has already read and accepted — including the two restorations above,
 * which are themselves machine-made commits to these fields made on the owner's
 * instruction.
 *
 * USAGE
 *   node tools/review-record.js check          both rules; exit 1 on any finding
 *   REVIEW_RECORD_RANGE=A..B node tools/review-record.js check
 *   node tools/review-record.js check --range A..B
 *   node tools/review-record.js check --repo <dir>      judge another checkout
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { noteUnread, formatUnread, failOnUnread, unreadExitCode, markUnreadPrinted } = require('./three-way.js');

failOnUnread();

const TABLE_REL = 'tools/catalog-reviewed.json';

/* The sentence autoAdvanceWrite writes into `reason`, and the only machine-advance
   marker there is. Keyed on the COMMAND rather than on prose around it: the rest of
   that sentence is wording and this is the thing that cannot be reworded without
   changing what ran. */
const MACHINE_ADVANCE = /auto-advance --write/;

/** Anthropic's commit identity, and the trailer a Claude-made commit carries. */
const MACHINE_EMAIL = /(^|[<\s])noreply@anthropic\.com(>|\s|$)/i;
const MACHINE_TRAILER = /^\s*co-authored-by:\s*claude\b/im;

const short = (sha) => (typeof sha === 'string' && sha.length >= 12 ? sha.slice(0, 12) : String(sha));

/** Author email or a Claude trailer. Either one makes the commit a machine's. */
function isMachineCommit({ authorEmail = '', message = '' } = {}) {
  if (MACHINE_EMAIL.test(authorEmail)) return 'author is noreply@anthropic.com';
  if (MACHINE_TRAILER.test(message)) return 'the message carries a Co-Authored-By: Claude trailer';
  return null;
}

/* ------------------------------------------------- RULE 1: read off the file */

/** Pins whose own reason records a machine advance but whose reviewedCommit does
 *  not stay behind the commit that advance moved to. */
function pinFindings(table) {
  const out = [];
  for (const [slug, e] of Object.entries(table)) {
    if (!e || typeof e !== 'object') continue;
    if (!MACHINE_ADVANCE.test(String(e.reason || ''))) continue;
    const rc = e.reviewedCommit;
    if (!/^[0-9a-f]{40}$/.test(String(rc || ''))) {
      out.push({ rule: 'ADVANCE-CLAIMS-REVIEW', slug,
        why: `its reason records a machine advance, so it must also record the commit a person read; reviewedCommit is ${rc === undefined ? 'absent' : JSON.stringify(rc)}` });
      continue;
    }
    if (rc === e.commit) {
      out.push({ rule: 'ADVANCE-CLAIMS-REVIEW', slug,
        why: `its reason records a machine advance to ${short(e.commit)} and reviewedCommit is that same commit, so the entry says a person read bytes the machine chose` });
    }
  }
  return out;
}

/* ---------------------------------------------- RULE 2: read off the commits */

/** The review-field changes between two states of the table, with the one
 *  legitimate first-time fill already excluded. */
function reviewFieldChanges(before, after) {
  const out = [];
  for (const [slug, now] of Object.entries(after)) {
    if (!now || typeof now !== 'object') continue;
    const was = before[slug];
    if (!was || typeof was !== 'object') continue;        // added: see addedRemoved
    if (String(was.reviewed ?? '') !== String(now.reviewed ?? '')) {
      out.push({ slug, field: 'reviewed',
        from: was.reviewed ?? '(absent)', to: now.reviewed ?? '(absent)',
        why: 'the date a person read the lab' });
    }
    const wasRc = was.reviewedCommit;
    const nowRc = now.reviewedCommit;
    if (String(wasRc ?? '') === String(nowRc ?? '')) continue;
    /* The first-time fill: absent before, and set to the commit `commit` held
       BEFORE this change. That preserves a person's reading; it does not claim
       one. Anything else, including a fill to the new commit, is a claim. */
    if (wasRc === undefined && typeof nowRc === 'string' && nowRc === was.commit) continue;
    out.push({ slug, field: 'reviewedCommit',
      from: wasRc === undefined ? '(absent)' : short(wasRc),
      to: nowRc === undefined ? '(absent)' : short(nowRc),
      why: wasRc === undefined
        ? `a first-time fill must preserve the commit a person read, which was ${short(was.commit)}`
        : 'the commit a person read' });
  }
  return out;
}

/** Entries a change added or removed outright. Counted, printed, not judged. */
function addedRemoved(before, after) {
  return {
    added: Object.keys(after).filter((s) => !(s in before)),
    removed: Object.keys(before).filter((s) => !(s in after)),
  };
}

/* ------------------------------------------------------------- reading a repo
 *
 * git exits 128 for everything -- an absent object, an absent ref, a bad range,
 * and a directory that is not a repository -- so a non-zero exit never decides
 * readability by itself. Readability is established once, with `rev-parse
 * --git-dir`, and only inside a repository that answered does a later failure
 * mean "this is not there". The rule and the reason are CLAUDE.md's.
 */
function git(repo, args) {
  const r = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.error) return { readable: false, why: r.error.message };
  if (r.status !== 0) return { readable: false, why: (r.stderr || '').trim().split('\n')[0] || `git exit ${r.status}` };
  return { readable: true, value: r.stdout };
}

function isRepo(repo) {
  return git(repo, ['rev-parse', '--git-dir']).readable;
}

/** The table as of one commit. `absent` is its own answer, not an empty table. */
function tableAt(repo, ref) {
  const r = git(repo, ['show', `${ref}:${TABLE_REL}`]);
  if (!r.readable) return { absent: true, why: r.why };
  try { return { table: JSON.parse(r.value) }; }
  catch (e) { return { unparsable: true, why: e.message.split('\n')[0] }; }
}

/** Every non-merge commit in the range that touched the table, newest first. */
function commitsTouchingTable(repo, range) {
  const SEP = '';
  const REC = '';
  const r = git(repo, ['log', '--no-merges', `--format=%H${SEP}%ae${SEP}%B${REC}`, range, '--', TABLE_REL]);
  if (!r.readable) return { readable: false, why: r.why };
  const rows = [];
  for (const chunk of r.value.split(REC)) {
    const body = chunk.replace(/^\n+/, '');
    if (!body.trim()) continue;
    const [sha, authorEmail, ...rest] = body.split(SEP);
    rows.push({ sha: sha.trim(), authorEmail: (authorEmail || '').trim(), message: rest.join(SEP) });
  }
  return { readable: true, rows };
}

function commitFindings(repo, range) {
  const found = commitsTouchingTable(repo, range);
  if (!found.readable) {
    noteUnread('review-record', `git log ${range} -- ${TABLE_REL}`, found.why);
    return { findings: [], judged: 0, machine: 0, added: [], removed: [] };
  }
  const findings = [];
  const added = [];
  const removed = [];
  let machine = 0;
  for (const c of found.rows) {
    const why = isMachineCommit(c);
    if (!why) continue;
    machine += 1;
    const after = tableAt(repo, c.sha);
    const before = tableAt(repo, `${c.sha}^`);
    if (after.unparsable) {
      noteUnread('review-record', `${short(c.sha)}:${TABLE_REL}`, after.why);
      continue;
    }
    if (after.absent) {
      /* The file is gone at this commit. That is a change worth seeing and it is
         not a review-field claim, so it is reported as a read failure rather
         than invented into a finding. */
      noteUnread('review-record', `${short(c.sha)}:${TABLE_REL}`, after.why);
      continue;
    }
    /* A root commit, or the commit that added the file, has nothing before it.
       Everything in it is then an ADDED entry, which this guard declines to
       judge -- see the header. */
    const beforeTable = before.table || {};
    if (before.unparsable) {
      noteUnread('review-record', `${short(c.sha)}^:${TABLE_REL}`, before.why);
      continue;
    }
    const delta = addedRemoved(beforeTable, after.table);
    for (const s of delta.added) added.push(`${short(c.sha)} ${s}`);
    for (const s of delta.removed) removed.push(`${short(c.sha)} ${s}`);
    for (const change of reviewFieldChanges(beforeTable, after.table)) {
      findings.push({ rule: 'MACHINE-SET-REVIEW-FIELD', sha: c.sha,
        authorEmail: c.authorEmail, machineBecause: why,
        subject: (c.message.split('\n')[0] || '').trim(), ...change });
    }
  }
  return { findings, judged: found.rows.length, machine, added, removed };
}

/* ----------------------------------------------------------------------- CLI */

function resolveRange(repo, argv) {
  const i = argv.indexOf('--range');
  if (i >= 0 && argv[i + 1]) return { range: argv[i + 1], from: '--range' };
  if (process.env.REVIEW_RECORD_RANGE && process.env.REVIEW_RECORD_RANGE.includes('..')) {
    return { range: process.env.REVIEW_RECORD_RANGE, from: 'REVIEW_RECORD_RANGE' };
  }
  if (git(repo, ['rev-parse', '--verify', '--quiet', 'origin/main']).readable) {
    return { range: 'origin/main..HEAD', from: 'the default' };
  }
  return { range: null, from: null };
}

function main(argv = process.argv.slice(2)) {
  const ri = argv.indexOf('--repo');
  const repo = ri >= 0 && argv[ri + 1] ? path.resolve(argv[ri + 1]) : path.join(__dirname, '..');
  const tablePath = path.join(repo, TABLE_REL);

  console.log(`review-record — ${repo}`);

  /* RULE 1 */
  let pins = [];
  let advanced = 0;
  try {
    const table = JSON.parse(fs.readFileSync(tablePath, 'utf8'));
    advanced = Object.values(table).filter((e) => e && typeof e === 'object' && MACHINE_ADVANCE.test(String(e.reason || ''))).length;
    pins = pinFindings(table);
    console.log(`  ADVANCE-CLAIMS-REVIEW  ${advanced} machine-advanced pin(s) of ${Object.keys(table).length} judged, ${pins.length} finding(s).`);
  } catch (e) {
    noteUnread('review-record', TABLE_REL, e);
    console.log('  ADVANCE-CLAIMS-REVIEW  the pin table could not be read; see COULD NOT LOOK below.');
  }

  /* RULE 2 */
  let commits = { findings: [], judged: 0, machine: 0, added: [], removed: [] };
  if (!isRepo(repo)) {
    noteUnread('review-record', repo, 'not a git repository, so no commit could be judged');
    console.log('  MACHINE-SET-REVIEW-FIELD  no repository here; see COULD NOT LOOK below.');
  } else {
    const { range, from } = resolveRange(repo, argv);
    if (!range) {
      noteUnread('review-record', 'the commit range', 'no --range, no REVIEW_RECORD_RANGE, and origin/main does not resolve');
      console.log('  MACHINE-SET-REVIEW-FIELD  no range to judge; see COULD NOT LOOK below.');
    } else {
      commits = commitFindings(repo, range);
      console.log(`  MACHINE-SET-REVIEW-FIELD  ${range} (${from}): ${commits.judged} commit(s) touched ${TABLE_REL}, `
        + `${commits.machine} machine-made, ${commits.findings.length} finding(s).`);
      if (commits.added.length || commits.removed.length) {
        console.log(`  not judged, by declared design: ${commits.added.length} entr(ies) added and ${commits.removed.length} removed by those commits.`);
        for (const s of [...commits.added, ...commits.removed].slice(0, 12)) console.log(`      ${s}`);
      }
    }
  }

  const findings = [...pins, ...commits.findings];
  if (findings.length) {
    console.log(`\nFINDINGS (${findings.length}) — a machine has claimed a reading a person did not do.`);
    for (const f of findings) {
      if (f.rule === 'ADVANCE-CLAIMS-REVIEW') {
        console.log(`  ADVANCE-CLAIMS-REVIEW    ${f.slug}`);
        console.log(`      ${f.why}`);
        continue;
      }
      console.log(`  MACHINE-SET-REVIEW-FIELD ${f.slug}  ${f.field}: ${f.from} -> ${f.to}`);
      console.log(`      ${short(f.sha)} <${f.authorEmail}> ${f.subject}`);
      console.log(`      machine because ${f.machineBecause}; ${f.why}`);
    }
    console.log('\nThe fix is never to change the field to match: restore it to what the person');
    console.log('set, and record the machine read in `note`, labelled as unreviewed. Only a');
    console.log(`first-time fill of an absent reviewedCommit to the pin's PREVIOUS commit passes.`);
  } else {
    console.log('\nNo machine has moved a human-review field, and every machine-advanced pin');
    console.log('still records the commit a person read.');
  }

  const block = formatUnread('review-record');
  if (block) { console.error(`\n${block}`); markUnreadPrinted(); }
  return unreadExitCode(findings.length ? 1 : 0);
}

if (require.main === module) {
  const mode = process.argv[2];
  if (mode && mode !== 'check' && !mode.startsWith('--')) {
    console.error(`review-record: unknown mode ${JSON.stringify(mode)}. Usage: node tools/review-record.js check`);
    process.exit(2);
  }
  process.exit(main());
}

module.exports = {
  isMachineCommit, pinFindings, reviewFieldChanges, addedRemoved,
  commitFindings, main, MACHINE_ADVANCE, TABLE_REL,
};
