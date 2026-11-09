/*
 * lab-pages.js — find the visitable HTML pages inside ONE lab checkout, and
 * the file a given page-level fact was read from.
 *
 * Not runnable. Required by scripts/build-audit-corpus.js.
 *
 * Reads: nothing on its own; callers pass a checkout root (which may be a
 *   clone-source.js export directory rather than the clone itself).
 *
 * WHY THIS EXISTS
 *
 * Every tool here that wants "the lab's page" has guessed at its path, and the
 * guess is wrong often enough to matter. `index.html` at the root covers most
 * labs; eight keep it at `demos/<slug>/index.html`; `crypto-lab-quantum-vault-kpqc`
 * keeps it at `web-demo/index.html` and `crypto-lab-blind-oracle-api` has none at
 * all. A three-path guess reported 44 labs as having no hero title, no subtitle,
 * no description and no accent -- a finding about the labs that was really a
 * finding about the search. `lab-dates.js` records the same shape in its own
 * header: a fixed path list "misses demos/<slug>/src, web-demo/src, crates/,
 * native/ and wasm/", and a lab with an unusual layout would carry the wrong
 * answer forever.
 *
 * So the rule is: WALK, do not guess. The exclusions below are the deliberate
 * part, and they are theme-sync.js's exclusions on purpose -- that checker
 * already decided which HTML files in a lab are visitable demo pages and which
 * are harnesses, and two different answers to that question would be worse than
 * either answer. theme-sync.js still carries its own copy because it enumerates
 * the whole fleet from FLEET_ROOT rather than one checkout; this module is the
 * single definition of the RULE, and `SKIP_DIRS`/`NON_DEMO_PAGE` are exported so
 * a drift between the two is visible to a test rather than silent.
 */

'use strict';

const fs = require('fs');
const path = require('path');

/* Build output, vendored code, scratch and archived copies. `original` and
   `archive` are here because two labs keep a pre-rewrite copy of their own page
   under those names, and reading one would describe a page nobody serves. */
const SKIP_DIRS = new Set(['node_modules', 'dist', 'playwright-report',
  'test-results', 'target', 'coverage', 'build', 'original', 'archive']);

/* Any dot-directory is scratch or tooling. GitHub Pages does not serve them and
   Vite builds to dist/, so nothing under one can reach a visitor. */
const isScratchDir = (name) => name.startsWith('.');

/* Not demo pages: error pages, social-card templates, timing harnesses. Failing
   or describing a lab on the strength of one of these is noise. */
const NON_DEMO_PAGE = /(^|\/)(404\.html|og-card\.html|.*-harness\.html|quality-gates\.html|logic-smoke\.html)$/;

const MAX_DEPTH = 4;

/** Every visitable .html page under `root`, nearest the root first. */
function htmlPages(root) {
  const out = [];
  (function walk(dir, depth) {
    if (depth > MAX_DEPTH) return;
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name) && !isScratchDir(entry.name)) walk(p, depth + 1);
      } else if (entry.name.endsWith('.html')) {
        const rel = path.relative(root, p).split(path.sep).join('/');
        if (!NON_DEMO_PAGE.test(rel)) out.push(rel);
      }
    }
  })(root, 0);
  /* Shallowest first, then alphabetical: a lab's entry page is the one nearest
     its root, and ties must resolve the same way on every run or the corpus
     changes without the lab changing. */
  return out.sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
}

/** Source files that can BUILD a page: labs assemble heroes in template literals. */
function sourceFiles(root) {
  const out = [];
  (function walk(dir, depth) {
    if (depth > 5) return;
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name) && !isScratchDir(entry.name)) walk(p, depth + 1);
      } else if (/\.(ts|tsx|js|mjs|jsx)$/.test(entry.name) && !/\.(test|spec)\./.test(entry.name)) {
        out.push(path.relative(root, p).split(path.sep).join('/'));
      }
    }
  })(root, 0);
  return out.sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
}

/** Stylesheets, where `--accent` almost always lives. */
function styleFiles(root) {
  const out = [];
  (function walk(dir, depth) {
    if (depth > 5) return;
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name) && !isScratchDir(entry.name)) walk(p, depth + 1);
      } else if (/\.css$/.test(entry.name)) {
        out.push(path.relative(root, p).split(path.sep).join('/'));
      }
    }
  })(root, 0);
  return out.sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
}

module.exports = { htmlPages, sourceFiles, styleFiles, SKIP_DIRS, NON_DEMO_PAGE, MAX_DEPTH };
