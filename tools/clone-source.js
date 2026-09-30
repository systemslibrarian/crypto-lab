/*
 * clone-source.js — read a sibling lab from its COMMITTED HEAD when its working
 * tree is dirty.
 *
 * Not runnable. Required by catalog-evidence.js and catalog-sync.js.
 *
 * WHY THIS EXISTS
 *
 * Three agents work in this fleet at once. The staging rule that came out of
 * that — stage explicit paths, never `git add -A` — covers one way another
 * lane's uncommitted work gets swept into your commit. It does not cover this
 * one, and this one needs no `git add` at all:
 *
 *   a GENERATOR that derives a tracked file from the sibling clones will read
 *   whatever is on disk in those clones, including another lane's half-finished
 *   edits, and write it into output you then commit under your own name.
 *
 * Measured, not imagined. On 2026-09-29 a `catalog-evidence write` run in the
 * vocabulary lane picked up three labs' in-progress derivations from clones
 * another lane was mid-edit in: crypto-lab-export-grade (a new src/data/attacks.ts
 * and a rewritten reference set), crypto-lab-falcon-seal and
 * crypto-lab-pq-families (attack anchors shifted by edits above them). One of
 * them, `AES@src/ui/app.ts:696`, did not even survive to the end of the same
 * session — `catalog-evidence verify` reported it stale, because the line it
 * pointed at had moved again. The lane caught it by diffing its own output card
 * by card, which is not a control, it is luck.
 *
 * WHAT IT DOES
 *
 * `git status --porcelain` on each clone before reading it. A clean clone is
 * read straight from the working tree, because it is byte-identical to HEAD. A
 * DIRTY clone is exported once with `git archive HEAD` into a temp directory and
 * read from there, so the derivation describes the lab's committed state and
 * nothing else. A clone that cannot be exported — an empty repository with no
 * HEAD, most often — is REFUSED by name rather than read anyway.
 *
 * HEAD-reading rather than refusing, for the reason the fleet already knows:
 * "could not look" must never be published as "nothing there". Refusing every
 * dirty lab would silently shrink the generated catalog whenever a colleague had
 * a file open, which is a discovered denominator — the defect this repository
 * keeps re-finding. Reading HEAD keeps every lab in the answer and makes the
 * answer reproducible.
 *
 * COST: one `git status --porcelain` per clone, about 10 seconds across 213
 * clones, plus one `git archive` per DIRTY clone — three on the day this was
 * written. Untracked files are deliberately INCLUDED in the dirty test: the
 * scanner walks directories, so an untracked file is read like any other.
 *
 * TRACKED FILES ONLY, AND WHY THE DIRTY TEST WAS NOT ENOUGH.
 *
 * `git status --porcelain` does not report IGNORED files. So a clone holding a
 * gitignored file reads as CLEAN, is read from its working tree, and the
 * directory walk opens that file like any other. On 2026-09-30 that put 19
 * `CRYPTO-LAB-TEMPLATE.md` references and anchors into index.html — a scaffolding
 * document `.gitignore` excludes, present on 25 clones because a session copied
 * it in, absent from every one of those repositories. It credited labs with
 * BB84, E91, OPAQUE, PQXDH and more, and emitted anchors into a file no fresh
 * clone has: they resolve here and fail anywhere else.
 *
 * `trackedFiles()` is therefore the only list a generator may read. It comes
 * from `git ls-files`, so it is exactly what a fresh clone would receive, and it
 * is used for CLEAN clones as well as dirty ones — the clean case is the one
 * that was wrong. A HEAD export already contains only tracked paths, so the same
 * list addresses both roots and one code path serves both.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const cache = new Map();
const trackedCache = new Map();
let tmpRoot = null;

function tmp() {
  if (!tmpRoot) {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'crypto-lab-head-'));
    process.on('exit', () => { try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch { /* best effort */ } });
  }
  return tmpRoot;
}

/** Porcelain status, or null when git itself could not answer. */
function dirtyPaths(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'status', '--porcelain'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 16 * 1024 * 1024,
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Where to READ this lab's files from.
 *   { root, from: 'worktree' }  clean, or not a git repo this tool should judge
 *   { root, from: 'HEAD', dirty }  dirty; root is an export of the committed tree
 *   { root: null, from: 'refused', why }  dirty and HEAD could not be exported
 * Git COMMANDS must still be run against the real clone, never against `root`.
 */
function sourceRoot(dir) {
  if (cache.has(dir)) return cache.get(dir);
  let out;
  const status = dirtyPaths(dir);
  if (status === null || status === '') {
    out = { root: dir, from: 'worktree', dirty: 0 };
  } else {
    const dirty = status.split('\n').filter(Boolean).length;
    const dest = path.join(tmp(), path.basename(dir));
    try {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
        const tar = path.join(tmp(), `${path.basename(dir)}.tar`);
        execFileSync('git', ['-C', dir, 'archive', '--format=tar', `--output=${tar}`, 'HEAD'], { stdio: ['ignore', 'ignore', 'ignore'] });
        execFileSync('tar', ['-xf', tar, '-C', dest], { stdio: ['ignore', 'ignore', 'ignore'] });
        fs.rmSync(tar, { force: true });
      }
      out = { root: dest, from: 'HEAD', dirty };
    } catch (e) {
      /* An empty repository has no HEAD to archive. Refusing by name is right
         here and reading the working tree would not help: there is nothing
         committed to describe. */
      out = { root: null, from: 'refused', dirty, why: 'working tree is dirty and HEAD could not be exported (empty repository?)' };
    }
  }
  cache.set(dir, out);
  return out;
}

/* THE RACE THIS CANNOT CLOSE, AND MUST THEREFORE REPORT.
 *
 * The status answer is cached per clone, because a run is supposed to describe
 * ONE snapshot of the fleet and re-statting on every file read would cost more
 * than the whole scan. That leaves a real window: a generator here takes about
 * two and a half minutes, and another lane can start editing a clone inside it.
 * A clone read as clean at minute one can be dirty by minute two, and the bytes
 * already read would be a mix of both.
 *
 * It cannot be prevented cheaply — exporting all 213 clones to be safe costs
 * more than it saves. So it is DETECTED instead: re-ask every clone that was
 * read from its working tree, and if any has since become dirty, the snapshot
 * was torn and the run must say so rather than print a clean result over it.
 * This is the protection-census rule again — "could not look" is never
 * "nothing there", and here "the ground moved" is never "the ground was still". */
function tornSnapshot() {
  const torn = [];
  for (const [dir, v] of cache) {
    if (v.from !== 'worktree') continue;
    const now = dirtyPaths(dir);
    if (now) torn.push({ slug: path.basename(dir), dirty: now.split('\n').filter(Boolean).length });
  }
  return torn;
}

/**
 * The paths a fresh clone of this lab would have: `git ls-files`, relative,
 * NUL-separated so a filename with a newline cannot split a record.
 *
 * Returns null when git cannot answer — the caller must treat that as "could
 * not look", never as "this lab has no files".
 */
function trackedFiles(dir) {
  if (trackedCache.has(dir)) return trackedCache.get(dir);
  let out;
  try {
    const raw = execFileSync('git', ['-C', dir, 'ls-files', '-z'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024,
    });
    out = raw.split('\0').filter(Boolean);
  } catch {
    out = null;
  }
  trackedCache.set(dir, out);
  return out;
}

/** Is this path one git tracks in that clone? Used to refuse an anchor into a
 *  file the repository does not contain. */
function isTracked(dir, rel) {
  const list = trackedFiles(dir);
  if (list === null) return null;
  return list.includes(rel.split(path.sep).join('/'));
}

/** Drop the cached status for one clone. Only tests should need this. */
function forget(dir) { cache.delete(dir); trackedCache.delete(dir); }

/** What this process read from HEAD or refused, for the run to print. */
function summary() {
  const fromHead = [];
  const refused = [];
  for (const [dir, v] of cache) {
    if (v.from === 'HEAD') fromHead.push({ slug: path.basename(dir), dirty: v.dirty });
    if (v.from === 'refused') refused.push({ slug: path.basename(dir), why: v.why });
  }
  return { fromHead, refused };
}

module.exports = { sourceRoot, summary, tornSnapshot, forget, trackedFiles, isTracked };
