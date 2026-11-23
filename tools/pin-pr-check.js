#!/usr/bin/env node
/*
 * pin-pr-check.js — does this pull request advance a pin past the source a person read?
 *
 * Run: node tools/pin-pr-check.js check
 * Prevents: a pin whose `commit` moves over substantive source while `reviewedCommit` stays put, which publishes anchors derived from code nobody read
 * Reads: git diff of tools/catalog-reviewed.json between $PIN_PR_BASE (default origin/main) and HEAD; and, per changed lab, two commits fetched --depth 1 into a scratch clone under os.tmpdir()
 *
 * WHY THIS EXISTS, from #530.
 *
 * tests/catalog-teaching-scope.test.cjs asserts that every anchored line is
 * readable at BOTH the commit a person reviewed and the commit the pin names.
 * That needs the sibling lab clone. The job that runs it -- `checker-regressions`
 * in .github/workflows/readme-sync.yml -- checks out THIS repository and nothing
 * else, so those assertions are not asked in CI: they are skipped and the job
 * reports green. A checker whose green means two different things depending on
 * where it ran is the defect this fleet keeps closing.
 *
 * It showed on 2026-11-23. 47e0f6b advanced 44 pins, one of them past a renamed
 * brief, and `main` was red on that test LOCALLY for days while every pull
 * request opened afterwards reported green. The failure was found by running the
 * suite on a workstation, not by any gate.
 *
 * WHAT IT ASKS, and why it is scoped to the PR rather than to the whole table.
 *
 * The invariant: for a pin this pull request CHANGES, the range
 * reviewedCommit..commit must not be substantive. If it is, the pin asserts a
 * review of source that was never read, and every anchor derived at `commit`
 * rests on it.
 *
 * Scoped to the changed entries, deliberately, and this was MEASURED before it
 * was written: run over all 141 pins on main today, the same rule reports 8
 * violations (hqc-timing, proof-tally, timing-sidechannel, kem-trap,
 * shamir-vs-frost, hybrid-guide, spdz-forge, bike-vault). A whole-table check
 * would therefore redden CI on arrival and be switched off within a week, which
 * is worse than no check. Scoping it to the diff makes it bite on every NEW
 * advance while leaving the standing eight to the owner -- they are a finding to
 * report, not a gate to fail on, and clearing one means re-reading a lab.
 *
 * COULD NOT LOOK IS NOT A PASS. A lab whose two commits cannot be fetched, or
 * whose diff cannot be taken, is UNREADABLE and FAILS. The whole point is to
 * stop CI reporting green about a question it never asked, so answering "I could
 * not ask" with exit 0 would rebuild the defect one layer in.
 */
'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const TABLE = 'tools/catalog-reviewed.json';
const { countsAsSubstantive, rootsFor } = require('./moved-substantively.js');

const SHA = /^[0-9a-f]{40}$/;

function git(dir, args) {
  const r = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
  if (r.error || r.status !== 0) return null;
  return r.stdout.trim();
}

/** The pin table as of a ref, or null when that ref has no such file. */
function tableAt(ref, root = ROOT) {
  const r = spawnSync('git', ['-C', root, 'show', `${ref}:${TABLE}`], { encoding: 'utf8' });
  if (r.error || r.status !== 0) return null;
  try { return JSON.parse(r.stdout); } catch { return null; }
}

/**
 * Entries this branch changes relative to `base`: added, or whose `commit` or
 * `reviewedCommit` moved. An entry whose prose changed and whose two commits did
 * not is NOT a pin advance and is not judged here.
 */
function changedPins(base, root = ROOT) {
  const head = tableAt('HEAD', root);
  if (head === null) return { error: `cannot read ${TABLE} at HEAD` };
  const old = tableAt(base, root) || {};
  const changed = [];
  for (const [slug, e] of Object.entries(head)) {
    if (!e || typeof e !== 'object') continue;
    const was = old[slug];
    const moved = !was
      || was.commit !== e.commit
      || was.reviewedCommit !== e.reviewedCommit;
    if (moved) changed.push({ slug, entry: e, previous: was || null });
  }
  return { changed };
}

/** Fetch exactly two commits of one lab, each at depth 1, into a scratch clone. */
function scratchWith(slug, shas, tmpRoot) {
  const dir = path.join(tmpRoot, slug);
  fs.mkdirSync(dir, { recursive: true });
  if (git(dir, ['init', '--quiet']) === null) return { error: 'git init failed' };
  const url = process.env.PIN_PR_REMOTE_BASE
    ? `${process.env.PIN_PR_REMOTE_BASE}/${slug}`
    : `https://github.com/systemslibrarian/${slug}.git`;
  if (git(dir, ['remote', 'add', 'origin', url]) === null) return { error: 'git remote add failed' };
  for (const sha of shas) {
    /* --depth 1 per commit. `git diff A..B` compares TREES, so two unconnected
       grafts are enough; the connecting history is never needed and fetching it
       would make this step the slowest in the job for no answer. */
    if (git(dir, ['fetch', '--quiet', '--depth', '1', 'origin', sha]) === null) {
      return { error: `could not fetch ${sha.slice(0, 12)}` };
    }
  }
  return { dir };
}

/**
 * The card's derived anchors for one lab: `Name@path:line` inside
 * data-implements / data-references / data-attacks.
 */
function anchorsFor(slug, html) {
  const open = new RegExp(`<a class="project-card[^>]*?github\\.io/${slug}/`, 'i');
  const at = html.search(open);
  if (at === -1) return [];
  const tagEnd = html.indexOf('>', at);
  const tag = html.slice(at, tagEnd === -1 ? at + 4000 : tagEnd + 1);
  const out = [];
  for (const field of ['data-implements', 'data-references', 'data-attacks']) {
    const m = new RegExp(`${field}="([^"]*)"`).exec(tag);
    if (!m) continue;
    for (const item of m[1].split('|').map((x) => x.trim()).filter(Boolean)) {
      const sep = item.lastIndexOf('@');
      if (sep === -1) continue;
      const loc = item.slice(sep + 1);
      const colon = loc.lastIndexOf(':');
      if (colon === -1) continue;
      const file = loc.slice(0, colon);
      const line = Number(loc.slice(colon + 1));
      if (file && Number.isInteger(line) && line > 0) out.push({ field, term: item.slice(0, sep), file, line });
    }
  }
  return out;
}

/**
 * Every anchor on the card must be READABLE at both commits.
 *
 * This is the half the substantive rule cannot reach, and #530's incident is
 * exactly it: crypto-lab-biham-lens renamed a markdown brief, the staleness rule
 * excludes ALL markdown deliberately, so the pin advance was NOT substantive --
 * and the attack anchor pointing INTO that markdown moved with the rename. Run
 * against that advance, the substantive rule alone returns OK. The anchor rule
 * catches it, because the new path does not exist at the reviewed commit.
 */
function judgeAnchors(slug, reviewedCommit, commit, dir, html) {
  const anchors = anchorsFor(slug, html);
  const broken = [];
  for (const a of anchors) {
    for (const sha of [reviewedCommit, commit]) {
      const blob = git(dir, ['show', `${sha}:${a.file}`]);
      if (blob === null) { broken.push({ ...a, at: sha, why: 'path absent' }); continue; }
      const lines = blob.split('\n').length;
      if (a.line > lines) broken.push({ ...a, at: sha, why: `only ${lines} line(s)` });
    }
  }
  return { anchors: anchors.length, broken };
}

/** The rule, over one lab whose two commits are present in `dir`. */
function judge(slug, reviewedCommit, commit, dir) {
  for (const sha of [reviewedCommit, commit]) {
    if (git(dir, ['cat-file', '-e', `${sha}^{commit}`]) === null) {
      return { state: 'UNREADABLE', why: `${sha.slice(0, 12)} is not present after the fetch` };
    }
  }
  const out = git(dir, ['diff', '--name-only', `${reviewedCommit}..${commit}`]);
  if (out === null) return { state: 'UNREADABLE', why: 'the range could not be diffed' };
  const demoHasSrc = (name) => git(dir, ['cat-file', '-t', `${commit}:demos/${name}/src`]) === 'tree';
  let roots;
  try { roots = rootsFor(slug); } catch { roots = undefined; }
  const files = out.split('\n').filter(Boolean);
  const substantive = files.filter((f) => {
    try { return countsAsSubstantive(f, demoHasSrc, roots); } catch { return false; }
  });
  if (substantive.length) {
    return { state: 'UNREVIEWED-ADVANCE', files: substantive, total: files.length };
  }
  return { state: 'OK', total: files.length };
}

function check({ base = process.env.PIN_PR_BASE || 'origin/main', root = ROOT, tmpRoot = null } = {}) {
  const { changed, error } = changedPins(base, root);
  if (error) {
    console.error(`pin-pr-check: ${error}`);
    return 2;
  }
  if (!changed.length) {
    console.log(`pin-pr-check: no entry in ${TABLE} changed against ${base}; nothing to judge.`);
    return 0;
  }
  const tmp = tmpRoot || fs.mkdtempSync(path.join(os.tmpdir(), 'pin-pr-check-'));
  console.log(`pin-pr-check: ${changed.length} pin entr${changed.length === 1 ? 'y' : 'ies'} changed against ${base}.`);
  const fail = [];
  const anchorFail = [];
  const unread = [];
  const ok = [];
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const { slug, entry } of changed) {
    const pin = entry.commit;
    const rc = entry.reviewedCommit;
    if (!SHA.test(pin || '')) { unread.push({ slug, why: 'no 40-character `commit` in the entry' }); continue; }
    if (!SHA.test(rc || '')) {
      /* No reviewedCommit at all: 11 entries on main are in that state. There is
         nothing to compare the pin against, so this rule has no view -- say so
         rather than pass it, and rather than invent a comparison. */
      unread.push({ slug, why: 'no 40-character `reviewedCommit`, so there is nothing to compare the pin against' });
      continue;
    }
    if (rc === pin) { ok.push({ slug, note: 'pin is the reviewed commit' }); continue; }
    const s = scratchWith(slug, [rc, pin], tmp);
    if (s.error) { unread.push({ slug, why: s.error }); continue; }
    const v = judge(slug, rc, pin, s.dir);
    if (v.state === 'UNREVIEWED-ADVANCE') { fail.push({ slug, rc, pin, ...v }); continue; }
    if (v.state === 'UNREADABLE') { unread.push({ slug, why: v.why }); continue; }
    /* The anchor half. Substantive-but-OK is not the end of the question: a
       markdown rename is deliberately NOT substantive and still moves an anchor
       that points into it. See judgeAnchors. */
    const a = judgeAnchors(slug, rc, pin, s.dir, html);
    if (a.broken.length) anchorFail.push({ slug, rc, pin, ...a });
    else ok.push({ slug, note: `${v.total} file(s) changed, none substantive; ${a.anchors} anchor(s) read at both` });
  }

  for (const o of ok) console.log(`  ok          ${o.slug.padEnd(32)} ${o.note}`);
  for (const f of fail) {
    console.log(`  FAIL        ${f.slug.padEnd(32)} reviewed ${f.rc.slice(0, 12)} -> pin ${f.pin.slice(0, 12)}`);
    console.log(`              substantive: ${f.files.slice(0, 4).join(', ')}${f.files.length > 4 ? ` +${f.files.length - 4}` : ''}`);
  }
  for (const a of anchorFail) {
    console.log(`  FAIL        ${a.slug.padEnd(32)} reviewed ${a.rc.slice(0, 12)} -> pin ${a.pin.slice(0, 12)}`);
    for (const b of a.broken.slice(0, 4)) {
      console.log(`              ${b.term}@${b.file}:${b.line} — ${b.why} at ${b.at.slice(0, 12)}`);
    }
  }
  for (const u of unread) console.log(`  UNREADABLE  ${u.slug.padEnd(32)} ${u.why}`);
  console.log('');

  if (fail.length) {
    console.error(`UNREVIEWED-ADVANCE (${fail.length}) — the pin moved over source nobody read.`);
    console.error('Each of these advances `commit` across a change the staleness rule calls substantive');
    console.error('while `reviewedCommit` stays where it was, so the entry asserts a review that did not');
    console.error('happen and every anchor derived at the new commit rests on it.');
    console.error('Fix by READING the lab at the new commit and moving `reviewedCommit` with the pin —');
    console.error('never by moving `reviewedCommit` without reading, which is the same claim one step on.');
  }
  if (anchorFail.length) {
    console.error(`\nANCHOR-NOT-AT-BOTH (${anchorFail.length}) — the pin moved and took an anchor off the`);
    console.error('source a person read. This is the half the substantive rule cannot reach, and it is');
    console.error('#530\'s own incident: crypto-lab-biham-lens RENAMED a markdown brief, the staleness rule');
    console.error('excludes all markdown deliberately, so that advance is not substantive — and the attack');
    console.error('anchor pointing into the brief moved with the rename. Run against that advance the');
    console.error('substantive rule alone returns OK, which is why both halves are checked here.');
    console.error('Fix by re-reading the lab and moving `reviewedCommit` with the pin, or by reverting the');
    console.error('pin to a commit the anchors can be read at — never by editing the anchor alone.');
  }
  if (unread.length) {
    console.error(`\nUNREADABLE (${unread.length}) — this check could not ask its question.`);
    console.error('Failing rather than passing, deliberately: #530 is a checker that reported green about');
    console.error('a question it never asked, and answering "could not ask" with exit 0 rebuilds it.');
  }
  return fail.length || anchorFail.length || unread.length ? 1 : 0;
}

module.exports = { changedPins, judge, judgeAnchors, anchorsFor, scratchWith, check, tableAt };

if (require.main === module) {
  const argv = process.argv.slice(2);
  if (argv[0] === 'check' || argv.length === 0) process.exit(check());
  console.error('usage: node tools/pin-pr-check.js check');
  process.exit(2);
}
