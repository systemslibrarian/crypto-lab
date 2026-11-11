#!/usr/bin/env node
/*
 * catalog-exhibits.js — validate pinned, source-reviewed exhibit maps.
 *
 * Run: node tools/catalog-exhibits.js verify
 *      node tools/catalog-exhibits.js advance [--write]
 * Prevents: an exhibit map claiming current or complete UI coverage from stale or missing source anchors
 * Reads: tools/catalog-exhibits.json, tools/fleet-edits.json, tools/clone-holds.json; sibling and repos/ lab checkouts at each pinned Git commit
 */
'use strict';

/* An exhibit map is a deliberate review of a lab's UI and source at one commit.
 * It is not derived from a card's chips, algorithm inventory, or prose. */
const MODES = new Set(['interactive', 'comparison', 'explanation']);
const EXECUTION = new Set(['real-crypto', 'real-operation', 'conceptual', 'real-values', 'simulation']);
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { countsAsSubstantive, rootsFor, demoHasSrcFrom } = require('./moved-substantively.js');
const SHA = /^[0-9a-f]{40}$/;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG = /^crypto-lab-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SOURCE = /^([^:#\s][^:#\r\n]*):([1-9]\d*)$/;

/* `anchorsUnchangedAt` records a MECHANICAL check, and it is a cache of a result
 * rather than the result. `commit` and `reviewed` say what a person read and
 * when; this says only that every file the map ANCHORS is byte-identical between
 * that commit and another one -- or differs only by hunks declared in
 * tools/fleet-edits.json. verify never trusts the stored value: with the clone
 * present it re-diffs the blobs and fails if the stored basis does not hold. A
 * stale or forged field is therefore worth nothing, which is the point of
 * letting a machine write it at all. */
const BASIS = new Set(['anchored-blobs-identical', 'anchored-diff-allowlisted-edit']);

/* Where a new exhibit can appear.
 *
 * This does NOT get its own path rule. `moved-substantively.js` already owns
 * the question "is this file the lab's own code", including the declared source
 * roots five labs need, and this fleet has been bitten twice by a second copy
 * of a path rule drifting from the first (PAGES_PUBLISHERS, port-sync's own
 * sibling regex). So a panel source is what that module calls substantive,
 * with two adjustments the ruling names:
 *   - any index.html counts, at any depth. A lab whose UI is markup can gain a
 *     whole panel there, and demos/<x>/index.html is substantive to that module
 *     only when the demo has no src/ beside it.
 *   - README.md does not. It is not a published panel, and a scheduled task
 *     rewrites these fleet-wide; counting it would refuse nearly every lab for
 *     a change no visitor can see.
 * Lockfiles, manifests, workflows, tests and vendored bundles are excluded by
 * that module, which is the whole reason to call it rather than restate it. */
const INDEX_HTML = /(?:^|\/)index\.html$/;
function isPanelSource(file, demoHasSrc, roots) {
  if (file === 'README.md') return false;
  if (INDEX_HTML.test(file)) return true;
  return countsAsSubstantive(file, demoHasSrc, roots);
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\d$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function prose(value) {
  return typeof value === 'string' && value.trim() === value && value.length > 0
    && !/[\r\n<>`]/.test(value);
}

function validateExhibitManifest(manifest, cardSlugs) {
  const errors = [];
  if (!manifest || manifest.schemaVersion !== 1 || !manifest.labs || Array.isArray(manifest.labs)
      || typeof manifest.labs !== 'object') return ['exhibit manifest needs schemaVersion 1 and a labs object'];
  const known = new Set(cardSlugs);
  for (const [slug, review] of Object.entries(manifest.labs)) {
    if (!SLUG.test(slug) || !known.has(slug)) errors.push(`${slug}: exhibit map has no matching card`);
    if (!review || typeof review !== 'object' || Array.isArray(review)) {
      errors.push(`${slug}: exhibit review must be an object`); continue;
    }
    if (!SHA.test(review.commit)) errors.push(`${slug}: review commit must be a full lowercase 40-character SHA`);
    if (!validDate(review.reviewed)) errors.push(`${slug}: reviewed must be a valid ISO date`);
    if (!['selected', 'complete'].includes(review.reviewScope)) {
      errors.push(`${slug}: reviewScope must be selected or complete`);
    }
    if (review.anchorsUnchangedAt !== undefined) {
      const at = review.anchorsUnchangedAt;
      if (!at || typeof at !== 'object' || Array.isArray(at)) {
        errors.push(`${slug}: anchorsUnchangedAt must be an object`);
      } else {
        if (!SHA.test(at.commit)) errors.push(`${slug}: anchorsUnchangedAt.commit must be a full lowercase 40-character SHA`);
        if (!validDate(at.checked)) errors.push(`${slug}: anchorsUnchangedAt.checked must be a valid ISO date`);
        /* An unknown basis is REFUSED rather than ignored. The field's whole
         * value is that a reader knows which question was asked of it. */
        if (!BASIS.has(at.basis)) errors.push(`${slug}: anchorsUnchangedAt.basis must be one of ${[...BASIS].join(', ')}`);
        if (at.basis === 'anchored-diff-allowlisted-edit') {
          if (!Array.isArray(at.allowlist) || !at.allowlist.length || at.allowlist.some((v) => !ID.test(v))) {
            errors.push(`${slug}: an allowlisted-edit basis must name the tools/fleet-edits.json entries it rests on`);
          }
        } else if (at.allowlist !== undefined) {
          errors.push(`${slug}: only an allowlisted-edit basis may carry an allowlist`);
        }
        if (at.commit === review.commit) errors.push(`${slug}: anchorsUnchangedAt.commit repeats the review commit and records nothing`);
      }
    }
    if (!Array.isArray(review.exhibits) || !review.exhibits.length) {
      errors.push(`${slug}: review needs at least one source-backed exhibit`); continue;
    }
    const ids = new Set();
    for (const e of review.exhibits) {
      if (!e || typeof e !== 'object' || Array.isArray(e)) {
        errors.push(`${slug}: exhibit must be an object`); continue;
      }
      if (!ID.test(e.id)) errors.push(`${slug}: exhibit id must be a stable lowercase slug`);
      else if (ids.has(e.id)) errors.push(`${slug}: duplicate exhibit id ${e.id}`);
      ids.add(e.id);
      if (!MODES.has(e.kind)) errors.push(`${slug}/${e.id}: unknown interaction kind`);
      if (!EXECUTION.has(e.execution)) errors.push(`${slug}/${e.id}: unknown execution status`);
      if (e.section !== undefined && !prose(e.section)) errors.push(`${slug}/${e.id}: section needs an exact plain-text UI label`);
      for (const field of ['title', 'action', 'outcome']) {
        if (!prose(e[field])) errors.push(`${slug}/${e.id}: ${field} needs plain, single-line text`);
      }
      if (!Array.isArray(e.concepts) || !e.concepts.length || e.concepts.some((v) => !prose(v))) {
        errors.push(`${slug}/${e.id}: concepts need one or more precise, single-line terms`);
      } else if (new Set(e.concepts.map((v) => v.toLowerCase())).size !== e.concepts.length) {
        errors.push(`${slug}/${e.id}: duplicate concept`);
      }
      if (e.related !== undefined && (!Array.isArray(e.related) || e.related.some((v) => !prose(v)))) {
        errors.push(`${slug}/${e.id}: related terms must be an array of plain text`);
      }
      if (e.limits !== undefined && !prose(e.limits)) errors.push(`${slug}/${e.id}: limits needs plain, single-line text`);
      if (!Array.isArray(e.evidence) || !e.evidence.length) {
        errors.push(`${slug}/${e.id}: needs at least one exact source path:line`);
      } else {
        const seen = new Set();
        for (const anchor of e.evidence) {
          const match = typeof anchor === 'string' && SOURCE.exec(anchor);
          if (!match || match[1].split('/').includes('..') || match[1].startsWith('/')) {
            errors.push(`${slug}/${e.id}: invalid source anchor ${anchor}`);
          } else if (seen.has(anchor)) {
            errors.push(`${slug}/${e.id}: duplicate source anchor ${anchor}`);
          }
          seen.add(anchor);
        }
      }
    }
  }
  return errors;
}

function sourceLink(slug, commit, anchor) {
  const at = SOURCE.exec(anchor);
  const encoded = at[1].split('/').map(encodeURIComponent).join('/');
  return `[\`${anchor}\`](https://github.com/systemslibrarian/${slug}/blob/${commit}/${encoded}#L${at[2]})`;
}

function reviewedExhibits(manifest) {
  return Object.entries(manifest.labs).flatMap(([slug, review]) => review.exhibits.map((exhibit) => ({ slug, review, exhibit })));
}

/** Every file an exhibit map anchors, once each, in a stable order. */
function anchoredFilesOf(review) {
  const files = new Set();
  for (const e of review.exhibits || []) for (const a of e.evidence || []) {
    const at = SOURCE.exec(a);
    if (at) files.add(at[1]);
  }
  return [...files].sort();
}

/** A unified diff's changed hunks, as {removed, added} with whitespace trimmed.
 * Trimming is what lets ONE allowlist entry cover a sweep that landed at four
 * indentations; everything else about the hunk is compared exactly. */
function hunksOf(diffText) {
  const out = [];
  let current = null;
  for (const line of String(diffText).split('\n')) {
    if (line.startsWith('@@')) { current = { removed: [], added: [] }; out.push(current); continue; }
    if (!current) continue;
    if (line.startsWith('+++') || line.startsWith('---')) continue;
    if (line.startsWith('-')) current.removed.push(line.slice(1).trim());
    else if (line.startsWith('+')) current.added.push(line.slice(1).trim());
  }
  return out.filter((h) => h.removed.length || h.added.length);
}

/** The tools/fleet-edits.json entry this hunk IS, or null. Exact, in order. */
function allowlistIdFor(hunk, edits) {
  const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
  for (const edit of edits) {
    const removed = (edit.removed || []).map((v) => v.trim());
    const added = (edit.added || []).map((v) => v.trim());
    if (same(hunk.removed, removed) && same(hunk.added, added)) return edit.id;
  }
  return null;
}

/**
 * Re-derive what moved between a map's pinned commit and another commit of the
 * same clone. This IS the check that anchorsUnchangedAt caches, so nothing here
 * reads the stored field -- verify calls this and compares.
 *
 * `anchored` answers the map's own evidence; `panelBlockers` answers the wider
 * question a reviewScope of "complete" makes: a new panel can land in a file the
 * map does not anchor, or inside an existing one, and byte-identical anchors say
 * nothing about it.
 */
function rangeReport(git, clone, review, to, edits, slug) {
  const anchored = anchoredFilesOf(review);
  const anchoredSet = new Set(anchored);
  /* Only the ANCHORED diff decides the basis -- that is what the field claims.
   * An allowlisted hunk in an unanchored panel source stops it being a blocker
   * and nothing more; folding it into the basis would let a lab whose anchors
   * never moved be recorded as resting on a fleet edit. */
  const used = new Set();
  const changedAnchored = [];
  for (const file of anchored) {
    const diff = git(clone, ['diff', '-U0', `${review.commit}..${to}`, '--', file]);
    const hunks = hunksOf(diff);
    if (!hunks.length) continue;
    const ids = hunks.map((h) => allowlistIdFor(h, edits));
    if (ids.every(Boolean)) { ids.forEach((id) => used.add(id)); continue; }
    changedAnchored.push({ file, hunks: hunks.length, unmatched: ids.filter((id) => !id).length });
  }
  const panelBlockers = [];
  if (review.reviewScope === 'complete') {
    const names = git(clone, ['diff', '--name-only', `${review.commit}..${to}`])
      .split('\n').map((v) => v.trim()).filter(Boolean);
    const demoHasSrc = demoHasSrcFrom(git(clone, ['ls-tree', '-r', '--name-only', to]));
    const roots = rootsFor(slug || '');
    for (const file of names) {
      if (anchoredSet.has(file) || !isPanelSource(file, demoHasSrc, roots)) continue;
      const hunks = hunksOf(git(clone, ['diff', '-U0', `${review.commit}..${to}`, '--', file]));
      if (!hunks.length) continue;
      const ids = hunks.map((h) => allowlistIdFor(h, edits));
      if (ids.every(Boolean)) continue;
      panelBlockers.push({ file, unmatched: ids.filter((id) => !id).length });
    }
  }
  return {
    anchored: changedAnchored.length ? 'changed' : (used.size ? 'allowlisted' : 'identical'),
    allowlist: [...used].sort(),
    changedAnchored,
    panelBlockers,
  };
}

/**
 * Which queue a refusal joins. The anchored diff is what anchorsUnchangedAt
 * claims, so it is what decides: anchors moved is STALE (the exhibits really
 * did change and a person must re-read them), anything else blocking a complete
 * scope is REFUSED (the anchors held and something unanchored landed, which may
 * be a new published panel). A hold is neither and never reaches here.
 */
function refusalQueue(report) {
  return report.anchored === 'changed' ? 'stale' : 'panel';
}

/** May a machine write anchorsUnchangedAt for this range? Rule 2(b): a
 * "complete" scope is refused when any unanchored panel source moved by
 * anything the allowlist does not name. */
function advanceVerdict(report) {
  if (report.anchored === 'changed') {
    return { ok: false, why: `anchored source changed: ${report.changedAnchored.map((c) => c.file).join(', ')}` };
  }
  if (report.panelBlockers.length) {
    return { ok: false, why: `unanchored panel source changed under a complete review scope: ${report.panelBlockers.map((c) => c.file).join(', ')}` };
  }
  return {
    ok: true,
    basis: report.anchored === 'allowlisted' ? 'anchored-diff-allowlisted-edit' : 'anchored-blobs-identical',
    allowlist: report.allowlist,
  };
}

/* Optional local review check. A missing clone stays UNKNOWN; a present clone
 * must contain the pinned commit, every anchored line, and the same HEAD. The
 * latter is a freshness warning about this checkout, not a remote-branch claim. */
function verifyLocalSources(manifest, parentDirectory, edits) {
  const allow = edits || (require('./fleet-edits.json').edits || []);
  const errors = [];
  const missing = [];
  let checked = 0;
  const git = (clone, args) => execFileSync('git', ['-C', clone, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trimEnd();
  for (const [slug, review] of Object.entries(manifest.labs)) {
    // Fleet checkouts can be siblings of the catalog or collected in repos/.
    // Both layouts are read-only here; absence from one is not an absent lab.
    const clone = [
      path.join(parentDirectory, slug),
      path.join(parentDirectory, 'repos', slug),
    ].find((candidate) => fs.existsSync(path.join(candidate, '.git')));
    if (!clone) { missing.push(slug); continue; }
    checked += 1;
    try {
      const head = git(clone, ['rev-parse', 'HEAD']);
      /* A map is current either because a person read this commit, or because
       * the anchored blobs provably did not move since they read an earlier
       * one. The second is RE-DERIVED here, every run: the stored field names
       * the commit and the basis, and this re-diffs the blobs to find out
       * whether the basis still holds. A field that no longer describes the
       * clone fails, which is why writing one is not a way to silence this. */
      const at = review.anchorsUnchangedAt;
      if (head !== review.commit) {
        if (!at) {
          errors.push(`${slug}: source review ${review.commit.slice(0, 12)} is older/different than local HEAD ${head.slice(0, 12)}; re-review before claiming current coverage`);
        } else if (at.commit !== head) {
          errors.push(`${slug}: anchorsUnchangedAt names ${at.commit.slice(0, 12)} but local HEAD is ${head.slice(0, 12)}; the anchored-blob check has not been re-run for this checkout`);
        } else {
          const report = rangeReport(git, clone, review, head, allow, slug);
          const verdict = advanceVerdict(report);
          if (!verdict.ok) {
            errors.push(`${slug}: anchorsUnchangedAt claims ${at.basis} over ${review.commit.slice(0, 12)}..${head.slice(0, 12)} and that is not true of this clone -- ${verdict.why}`);
          } else if (verdict.basis !== at.basis) {
            errors.push(`${slug}: anchorsUnchangedAt records basis ${at.basis}, but re-deriving the range gives ${verdict.basis}`);
          } else if (at.basis === 'anchored-diff-allowlisted-edit'
                     && verdict.allowlist.join('|') !== [...(at.allowlist || [])].sort().join('|')) {
            errors.push(`${slug}: anchorsUnchangedAt rests on fleet edits [${(at.allowlist || []).join(', ')}], but the range actually uses [${verdict.allowlist.join(', ')}]`);
          }
        }
      }
      const paths = new Map();
      for (const e of review.exhibits) for (const anchor of e.evidence) {
        const [, file, line] = SOURCE.exec(anchor);
        if (!paths.has(file)) {
          try { paths.set(file, git(clone, ['show', `${review.commit}:${file}`]).split('\n')); }
          catch { errors.push(`${slug}: ${file} cannot be read at pinned commit`); paths.set(file, []); }
        }
        if (!paths.get(file)[Number(line) - 1]?.trim()) errors.push(`${slug}/${e.id}: ${anchor} is absent/blank at pinned commit`);
      }
    } catch { errors.push(`${slug}: could not read local clone HEAD`); }
  }
  return { checked, missing, errors };
}

/* Write anchorsUnchangedAt into the manifest TEXT, field by field. The file is
 * hand-maintained 2-space JSON and stays that way: this only ever inserts,
 * replaces or removes the one key, and re-reads the result to prove the rest of
 * the file is byte-identical. commit and reviewed are never touched. */
function writeAnchorsUnchangedAt(text, slug, value) {
  const before = JSON.parse(text);
  const key = JSON.stringify(slug);
  const start = text.indexOf(`    ${key}: {`);
  if (start === -1) throw new Error(`${slug}: not found in the manifest text`);
  const bodyStart = text.indexOf('\n', start) + 1;
  const reviewedLine = text.indexOf('      "reviewed":', bodyStart);
  if (reviewedLine === -1 || reviewedLine > text.indexOf('\n      "exhibits":', bodyStart)) {
    throw new Error(`${slug}: no reviewed line to anchor the write to`);
  }
  const afterReviewed = text.indexOf('\n', reviewedLine) + 1;
  const existing = text.indexOf('      "anchorsUnchangedAt": {', bodyStart);
  const scopeAt = text.indexOf('      "reviewScope":', bodyStart);
  let head = text, tail = '';
  if (existing !== -1 && existing < scopeAt) {
    /* Only the block layout this writer emits can be replaced by this writer.
     * A hand-written one-liner is REFUSED by name rather than edited by
     * arithmetic that would run past the end of the lab and swallow the next
     * one -- the file is hand-maintained, so that layout is a thing a person
     * can plausibly leave behind, and "could not look" is never permission. */
    if (text.slice(existing).split('\n', 1)[0].trim() !== '"anchorsUnchangedAt": {') {
      throw new Error(`${slug}: anchorsUnchangedAt is not in the block layout this writer can edit; fix it by hand or delete it`);
    }
    const close = text.indexOf('\n      },\n', existing) + '\n      },\n'.length;
    head = text.slice(0, existing); tail = text.slice(close);
  } else {
    head = text.slice(0, afterReviewed); tail = text.slice(afterReviewed);
  }
  const block = value === null ? '' : [
    '      "anchorsUnchangedAt": {',
    `        "commit": ${JSON.stringify(value.commit)},`,
    `        "checked": ${JSON.stringify(value.checked)},`,
    `        "basis": ${JSON.stringify(value.basis)}${value.allowlist ? ',' : ''}`,
    ...(value.allowlist ? [`        "allowlist": [${value.allowlist.map((v) => `\n          ${JSON.stringify(v)}`).join(',')}\n        ]`] : []),
    '      },',
    '',
  ].join('\n');
  const out = head + block + tail;
  assertOnlyFieldMoved(before, out, slug, value);
  return out;
}

/* The guard, separate from the editing so it can be tested on its own: after a
 * write, EVERY lab must be byte-for-byte the data it was apart from this one
 * key, and this lab must carry exactly the value asked for. The editing above
 * is string arithmetic over a hand-maintained file, which is the kind of code
 * that goes wrong quietly and at scale -- #429 is the precedent, where a global
 * replace of one date broke an unrelated lab. */
function assertOnlyFieldMoved(before, afterText, slug, value) {
  let after;
  try { after = JSON.parse(afterText); }
  catch (e) { throw new Error(`${slug}: the write did not leave valid JSON (${e.message})`); }
  for (const [k, lab] of Object.entries(after.labs)) {
    const was = { ...(before.labs[k] || {}) }; const now = { ...lab };
    delete was.anchorsUnchangedAt; delete now.anchorsUnchangedAt;
    if (JSON.stringify(was) !== JSON.stringify(now)) throw new Error(`${k}: the write moved a field outside anchorsUnchangedAt`);
  }
  if (Object.keys(after.labs).length !== Object.keys(before.labs).length) {
    throw new Error('the write changed how many labs the manifest holds');
  }
  if (JSON.stringify(after.labs[slug].anchorsUnchangedAt ?? null) !== JSON.stringify(value)) {
    throw new Error(`${slug}: the write did not produce the intended field`);
  }
}

if (require.main === module && process.argv[2] === 'advance') {
  const write = process.argv.includes('--write');
  const manifestPath = path.join(__dirname, 'catalog-exhibits.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const allow = require('./fleet-edits.json').edits || [];
  const parent = path.resolve(__dirname, '..', '..');
  /* Holds are read the way catalog-evidence reads them, and an unreadable list
   * is REFUSED rather than treated as "nothing is held" -- that file's own
   * rationale says an absence must never pass for an exclusion, and a catch
   * returning an empty set would turn every hold into a lab this tool happily
   * advances. */
  const held = (() => {
    const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'clone-holds.json'), 'utf8'));
    if (!Array.isArray(d.holds)) throw new Error('tools/clone-holds.json is unreadable, so which clones are held is undefined');
    return new Map(d.holds.map((h) => [h.repo, h]));
  })();
  const git = (clone, args) => execFileSync('git', ['-C', clone, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 }).trimEnd();
  const today = new Date().toISOString().slice(0, 10);
  /* Three refusal reasons, counted apart. They are different kinds of fact and
   * different people work them down: a changed anchor is a lab whose exhibits
   * moved and needs a re-read; a panel blocker is a complete-scope map that may
   * have gained a published section; a hold is the owner's standing decision and
   * is not work at all. COULD NOT LOOK is none of the three. Main reported all
   * of them as one `REFUSED (a person must look) : 119`, which is true and
   * useless -- it cannot be worked down because it does not say what it is. */
  const eligible = []; const current = []; const unreadable = [];
  const anchorsMoved = []; const panelMoved = []; const heldBack = [];
  for (const [slug, review] of Object.entries(manifest.labs)) {
    const clone = [path.join(parent, slug), path.join(parent, 'repos', slug)]
      .find((c) => fs.existsSync(path.join(c, '.git')));
    if (!clone) { unreadable.push([slug, 'no clone on disk']); continue; }
    if (held.has(slug)) { heldBack.push([slug, held.get(slug).reason]); continue; }
    let head;
    try { head = git(clone, ['rev-parse', 'HEAD']); } catch { unreadable.push([slug, 'could not read HEAD']); continue; }
    if (head === review.commit) { current.push(slug); continue; }
    let report;
    try { report = rangeReport(git, clone, review, head, allow, slug); }
    catch { unreadable.push([slug, `could not diff ${review.commit.slice(0, 12)}..${head.slice(0, 12)}`]); continue; }
    const verdict = advanceVerdict(report);
    if (!verdict.ok) {
      /* The anchored diff is what the field claims, so it decides which queue a
         refusal joins: anchors moved is STALE, anything else blocking a
         complete scope is REFUSED. */
      (refusalQueue(report) === 'stale' ? anchorsMoved : panelMoved).push([slug, verdict.why]);
      continue;
    }
    const value = { commit: head, checked: today, basis: verdict.basis };
    if (verdict.basis === 'anchored-diff-allowlisted-edit') value.allowlist = verdict.allowlist;
    if (JSON.stringify(review.anchorsUnchangedAt ?? null) === JSON.stringify(value)) { current.push(slug); continue; }
    eligible.push([slug, value]);
  }
  const counts = [
    ['current (pin or recorded check already at HEAD)', current.length],
    ['writable anchorsUnchangedAt', eligible.length],
    ['STALE - anchored source changed', anchorsMoved.length],
    ['REFUSED - unanchored panel source changed', panelMoved.length],
    ['HELD - the owner asked for this clone to stay put', heldBack.length],
    ['COULD NOT LOOK', unreadable.length],
  ];
  console.log('EXHIBIT-MAP ANCHOR REPORT');
  for (const [label, n] of counts) console.log(`  ${label.padEnd(50)}: ${n}`);
  for (const [slug, why] of anchorsMoved) console.log(`    STALE    ${slug}: ${why}`);
  for (const [slug, why] of panelMoved) console.log(`    REFUSED  ${slug}: ${why}`);
  for (const [slug, why] of heldBack) console.log(`    HELD     ${slug}: ${why}`);
  for (const [slug, why] of unreadable) console.log(`    UNREAD   ${slug}: ${why}`);
  if (write && eligible.length) {
    let text = fs.readFileSync(manifestPath, 'utf8');
    for (const [slug, value] of eligible) text = writeAnchorsUnchangedAt(text, slug, value);
    fs.writeFileSync(manifestPath, text);
    console.log(`\nWrote anchorsUnchangedAt for ${eligible.length} lab(s). commit and reviewed untouched.`);
  } else if (!write) {
    console.log('\nNothing written. Re-run with --write.');
  }
}

if (require.main === module && process.argv[2] === 'verify') {
  const manifest = require('./catalog-exhibits.json');
  const malformed = validateExhibitManifest(manifest, Object.keys(manifest.labs || {}));
  if (malformed.length) {
    for (const error of malformed) console.error(`ERROR ${error}`);
    process.exitCode = 1;
  } else {
    const result = verifyLocalSources(manifest, path.resolve(__dirname, '..', '..'));
    console.log(`Exhibit source pins checked against ${result.checked} local clones; ${result.missing.length} clones unavailable.`);
    if (result.missing.length) console.log(`Not checked: ${result.missing.join(', ')}`);
    for (const error of result.errors) console.error(`ERROR ${error}`);
    if (result.errors.length) process.exitCode = 1;
  }
}

module.exports = {
  validateExhibitManifest, sourceLink, reviewedExhibits, verifyLocalSources,
  anchoredFilesOf, hunksOf, allowlistIdFor, rangeReport, advanceVerdict, isPanelSource,
  writeAnchorsUnchangedAt, assertOnlyFieldMoved, BASIS, refusalQueue,
};
