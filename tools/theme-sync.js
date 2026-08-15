#!/usr/bin/env node
/*
 * theme-sync.js — hold every lab to exactly one theme, pinned, with no toggle.
 *
 * The fleet used to ship a light palette and a header toggle that persisted its
 * choice. The palettes read badly and the persistence meant one past click
 * pinned a returning visitor to light forever, so both were removed: each lab
 * now stamps a single theme before first paint and offers no way to change it.
 *
 * That is an invariant no single repo can defend. A fleet-wide pass re-adding a
 * toggle, or flattening the one lab that is deliberately light, looks locally
 * correct in all 175 repos at once — which is exactly how quantum-vault-kpqc's
 * hanji palette got overwritten the first time. This script is the check that
 * would have caught it.
 *
 * Per lab index.html it asserts:
 *   1. <html> carries data-theme, set to the theme that lab is supposed to have
 *   2. the head pins that theme with a literal, rather than reading a stored one
 *   3. no #cl-theme-toggle survives anywhere in the file
 *
 * Usage (run from the crypto-lab repo root):
 *   node tools/theme-sync.js          Report; exit 0 always.
 *   node tools/theme-sync.js check    Same report; exit 1 on any violation.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const FLEET_ROOT = path.join(REPO_ROOT, '..');

/*
 * Dark everywhere, with one deliberate exception.
 *
 * quantum-vault-kpqc pins LIGHT. Its warm hanji (한지) paper palette with
 * Korean-flag navy/red accents is the intended, culturally-aware look for a
 * demo of Korean post-quantum cryptography, and it is also the palette that
 * passes its axe gate — the dark one has known failures on #btn-export-vault,
 * #btn-reset, #btn-clear-vault and the Import vault label. Do not "fix" this
 * entry to dark; fix the sweep that wants to.
 */
const DEFAULT_THEME = 'dark';
const EXCEPTIONS = { 'crypto-lab-quantum-vault-kpqc': 'light' };

// Labs whose page is not at the repo root. Taken from where index.html is,
// not assembled from the slug.
function labPages() {
  const skip = new Set(['node_modules', 'dist', '.git', 'playwright-report',
    'test-results', 'target', 'coverage', 'build', 'original']);
  const pages = [];
  for (const repo of fs.readdirSync(FLEET_ROOT).sort()) {
    if (!repo.startsWith('crypto-lab-')) continue;
    const root = path.join(FLEET_ROOT, repo);
    if (!fs.statSync(root).isDirectory()) continue;
    const found = [];
    (function walk(dir, depth) {
      if (depth > 3) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          if (!skip.has(entry.name)) walk(path.join(dir, entry.name), depth + 1);
        } else if (entry.name === 'index.html') {
          found.push(path.join(dir, entry.name));
        }
      }
    })(root, 0);
    // A repo with no page at all (an API service) is not a lab; skip it.
    if (found.length) pages.push({ repo, file: found[0] });
  }
  return pages;
}

function inspect(repo, file) {
  const html = fs.readFileSync(file, 'utf8');
  const want = EXCEPTIONS[repo] || DEFAULT_THEME;
  const problems = [];

  const tag = /<html\b[^>]*>/i.exec(html);
  const attr = tag && /data-theme\s*=\s*"([^"]+)"/i.exec(tag[0]);
  if (!attr) {
    problems.push(`<html> has no data-theme (want "${want}")`);
  } else if (attr[1] !== want) {
    problems.push(`<html data-theme="${attr[1]}"> but this lab should be "${want}"`);
  }

  const head = html.slice(0, html.indexOf('</head>') + 1 || html.length);
  const pin = new RegExp(
    `setAttribute\\(\\s*['"]data-theme['"]\\s*,\\s*['"]${want}['"]\\s*\\)`);
  if (!pin.test(head)) {
    problems.push(`the head does not pin data-theme to "${want}" with a literal`);
  }
  // A boot script that still READS a stored preference is the bug that made a
  // single past toggle click permanent.
  if (/getItem\(\s*['"][^'"]*theme['"]\s*\)/.test(head)) {
    problems.push('the head reads a stored theme instead of overwriting it');
  }

  if (html.includes('cl-theme-toggle')) {
    problems.push('#cl-theme-toggle is back in the page');
  }

  return problems;
}

function main() {
  const check = process.argv[2] === 'check';
  const pages = labPages();
  const bad = [];

  for (const { repo, file } of pages) {
    const problems = inspect(repo, file);
    if (problems.length) bad.push({ repo, file, problems });
  }

  const light = pages.filter((p) => EXCEPTIONS[p.repo]).length;
  console.log(`Lab pages checked: ${pages.length} ` +
    `(${pages.length - light} dark, ${light} deliberately light)`);

  if (!bad.length) {
    console.log('Every lab pins one theme, and none ships a toggle.');
    return 0;
  }

  console.log(`\nViolations (${bad.length}):`);
  for (const { repo, file, problems } of bad) {
    console.log(`  ${repo}  (${path.relative(FLEET_ROOT, file)})`);
    for (const p of problems) console.log(`      - ${p}`);
  }
  console.log('\nSee audits/_MASTER-TEMPLATE.md §3.2 for the theme contract.');
  return check ? 1 : 0;
}

process.exit(main());
