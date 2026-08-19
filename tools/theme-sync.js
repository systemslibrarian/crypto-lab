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
 * It then sweeps the whole repo for code that still DRIVES a toggle — clicks it,
 * hovers it, waits for it, or asserts the page reaches light. The first version
 * of this script read only index.html, and that is exactly how a second round of
 * breakage got through: the pass that removed the toggle rewrote `e2e/` but never
 * walked `scripts/` or `contrast/`, where six labs keep custom CI runners that
 * clicked the button. Their suites were green; their deploys were red.
 *
 * Finally it asserts the SUPPRESSION RULE. The toggle removal deleted the
 * `#cl-theme-toggle` header button, but 82 labs still build an older
 * `#theme-toggle` of their own, and in 35 of them that button is fully wired —
 * the click handler flips the theme and writes it to localStorage. None of them
 * render it, for exactly one reason: an inline rule in each page,
 *
 *     body :is(#theme-toggle,#themeToggle,.theme-toggle,...){display:none!important}
 *
 * That single line is the only thing standing between this fleet and 35 working
 * toggles that persist a light choice — the precise failure the removal was for.
 * Nothing checked it until now, so a pass that tidied those inline <style> blocks
 * would have brought the toggles back silently and looked correct in every repo.
 * So: any lab that can PRODUCE a legacy toggle must also suppress it, and that is
 * a hard failure. The wired-but-hidden ones are reported as debt rather than
 * failures, because they are genuinely inert today and failing 35 labs' CI is not
 * this script's call to make. See "Legacy toggle debt" in the output.
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

/*
 * A legacy toggle this lab builds itself, predating the shared #cl-theme-toggle.
 * RENDERS_TOGGLE matches markup that creates the element; FLIPS_THEME matches a
 * click handler that actually changes the theme, which is what separates a dead
 * stub from a live control wearing a display:none.
 */
const LEGACY_IDS = ['#theme-toggle', '#themeToggle', '.theme-toggle', '[data-theme-toggle]'];
const RENDERS_TOGGLE =
  /id\s*=\s*["']theme-toggle["']|id\s*=\s*["']themeToggle["']|createElement\([^)]*\)[\s\S]{0,120}theme-toggle/;
const FLIPS_THEME =
  /addEventListener\(\s*['"]click['"][\s\S]{0,300}?(setTheme|setAttribute\(\s*['"]data-theme['"]|localStorage\.setItem\(\s*['"][^'"]*theme)/;
// The rule that keeps every one of those off the page.
const SUPPRESSES_TOGGLE = /#theme-toggle[^}]*display\s*:\s*none/i;

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

// Code that only makes sense when a toggle exists. Comments are ignored: plenty
// of gate.ts files mention the old button in prose, and rewriting prose is not
// what keeps CI green.
const DRIVES_TOGGLE = [
  // Interacting with a button that is not there — these throw or time out.
  /\.click\(\s*['"]#cl-theme-toggle['"]/,
  /#cl-theme-toggle['"]\s*\)\s*\.\s*(click|hover|waitFor|focus)\b/,
  // Asserting the removed button is present.
  /#cl-theme-toggle['"]\s*\)\s*\)\s*\.\s*toBeVisible/,
  /#cl-theme-toggle['"]\s*\)\s*\)\s*\.\s*toHaveCount\(\s*1\s*\)/,
  // Asserting the page reaches a theme that no longer exists.
  /toHaveAttribute\(\s*['"]data-theme['"]\s*,\s*['"]light['"]/,
  /waitForFunction\([^)]*data-theme[^)]*['"]light['"]/,
];
// Deliberately NOT flagged: a lab reading `getAttribute('data-theme') === 'light'`
// in its own src. That is dead but harmless — the branch never runs — and
// rewriting 30 labs' internals to delete it is the CSS-rewrite risk all over
// again. This checker is about what BREAKS, not what is merely unreachable.
const CODE_EXT = ['.ts', '.js', '.mjs', '.cjs', '.tsx'];

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

function toggleDrivers(repo, wantLight) {
  const skip = new Set(['node_modules', 'dist', '.git', 'playwright-report',
    'test-results', 'target', 'coverage', 'build', 'original', 'archive', '.tmp-checks']);
  const found = [];
  (function walk(dir) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { if (!skip.has(e.name)) walk(full); continue; }
      if (!CODE_EXT.includes(path.extname(e.name))) continue;
      let src;
      try { src = stripComments(fs.readFileSync(full, 'utf8')); } catch { continue; }
      for (const re of DRIVES_TOGGLE) {
        // The light lab legitimately asserts it reaches light.
        if (wantLight && String(re).includes('light')) continue;
        if (re.test(src)) { found.push(path.relative(FLEET_ROOT, full)); break; }
      }
    }
  })(path.join(FLEET_ROOT, repo));
  return found;
}

// Where this lab still builds a legacy toggle of its own, and whether that
// toggle is wired to change the theme. Includes the page itself: a few labs
// write the button straight into index.html.
function legacyToggles(repo, page) {
  const skip = new Set(['node_modules', 'dist', '.git', 'playwright-report',
    'test-results', 'target', 'coverage', 'build', 'original', 'archive', '.tmp-checks']);
  const renders = [];
  const live = [];
  const consider = (full, src) => {
    if (!RENDERS_TOGGLE.test(src)) return;
    renders.push(path.relative(FLEET_ROOT, full));
    if (FLIPS_THEME.test(src)) live.push(path.relative(FLEET_ROOT, full));
  };
  try { consider(page, fs.readFileSync(page, 'utf8')); } catch { /* page unreadable */ }
  (function walk(dir) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { if (!skip.has(e.name)) walk(full); continue; }
      if (!CODE_EXT.includes(path.extname(e.name))) continue;
      let src;
      try { src = fs.readFileSync(full, 'utf8'); } catch { continue; }
      consider(full, src);
    }
  })(path.join(FLEET_ROOT, repo));
  return { renders, live };
}

function main() {
  const check = process.argv[2] === 'check';
  const pages = labPages();
  const bad = [];
  const debt = [];

  for (const { repo, file } of pages) {
    const problems = inspect(repo, file);
    const drivers = toggleDrivers(repo, (EXCEPTIONS[repo] || DEFAULT_THEME) === 'light');
    for (const d of drivers) problems.push(`${d} still drives a theme toggle`);

    // A lab that can still build a legacy toggle must still hide it. This is the
    // one line holding 35 wired toggles off the page; losing it is a regression
    // no per-lab test would catch, because the markup looks the same either way.
    const legacy = legacyToggles(repo, file);
    if (legacy.renders.length) {
      const html = fs.readFileSync(file, 'utf8');
      if (!SUPPRESSES_TOGGLE.test(html)) {
        problems.push(
          `builds a legacy toggle (${legacy.renders[0]}) but the page no longer ` +
          `suppresses it — restore the ` +
          `body :is(${LEGACY_IDS.join(',')}){display:none!important} rule`);
      } else if (legacy.live.length) {
        debt.push({ repo, live: legacy.live });
      }
    }

    if (problems.length) bad.push({ repo, file, problems });
  }

  const light = pages.filter((p) => EXCEPTIONS[p.repo]).length;
  console.log(`Lab pages checked: ${pages.length} ` +
    `(${pages.length - light} dark, ${light} deliberately light)`);

  // Not a failure: these are inert today. But they are inert because of one CSS
  // rule per page, so anyone editing those inline <style> blocks needs to know.
  if (debt.length) {
    console.log(`\nLegacy toggle debt (${debt.length}): wired to change the theme, ` +
      'held off the page only by the suppression rule above.');
    for (const { repo, live } of debt) {
      console.log(`  ${repo}  ${live.join(', ')}`);
    }
    console.log('  Removing the code is the real fix; until then the rule is load-bearing.');
  }

  if (!bad.length) {
    console.log('\nEvery lab pins one theme, and none ships a toggle.');
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
