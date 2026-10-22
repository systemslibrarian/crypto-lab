#!/usr/bin/env node
/*
 * catalog-exhibits.js — validate pinned, source-reviewed exhibit maps.
 *
 * Run: node tools/catalog-exhibits.js verify
 * Prevents: an exhibit map claiming current or complete UI coverage from stale or missing source anchors
 * Reads: tools/catalog-exhibits.json; sibling and repos/ lab checkouts at each pinned Git commit
 */
'use strict';

/* An exhibit map is a deliberate review of a lab's UI and source at one commit.
 * It is not derived from a card's chips, algorithm inventory, or prose. */
const MODES = new Set(['interactive', 'comparison', 'explanation']);
const EXECUTION = new Set(['real-crypto', 'real-operation', 'conceptual', 'real-values', 'simulation']);
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const SHA = /^[0-9a-f]{40}$/;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG = /^crypto-lab-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SOURCE = /^([^:#\s][^:#\r\n]*):([1-9]\d*)$/;

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

/* Optional local review check. A missing clone stays UNKNOWN; a present clone
 * must contain the pinned commit, every anchored line, and the same HEAD. The
 * latter is a freshness warning about this checkout, not a remote-branch claim. */
function verifyLocalSources(manifest, parentDirectory) {
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
      if (head !== review.commit) errors.push(`${slug}: source review ${review.commit.slice(0, 12)} is older/different than local HEAD ${head.slice(0, 12)}; re-review before claiming current coverage`);
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

module.exports = { validateExhibitManifest, sourceLink, reviewedExhibits, verifyLocalSources };
