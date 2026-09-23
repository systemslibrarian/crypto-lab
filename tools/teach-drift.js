#!/usr/bin/env node
/*
 * teach-drift.js — the daily worksheet drift check.
 *
 * Run: node tools/teach-drift.js
 * Prevents: a worksheet naming a control its live exhibit no longer has
 *
 * For every worksheet listed in a teach/<module>/anchors.json, open the live exhibit in
 * Chromium and confirm that each control the worksheet names is present on the page.
 * A missing control, or an exhibit that will not load, fails the run; with --open-issues
 * it also opens one issue per affected worksheet, naming it.
 *
 * What this can and cannot tell you. It finds a named control that has been removed or
 * renamed, within a day of the change going live. It cannot stop a lab from publishing
 * that change — it runs in this repository, not in the lab's CI — and it cannot confirm
 * that the lab still behaves the way the worksheet describes, only that the controls the
 * worksheet names are still there.
 *
 * A control counts as present when it is in the DOM after the page has rendered, whether
 * or not it is visible: a control on a tab that is not open is still on the page.
 *   "#id"          an element with that id
 *   "label:Name"   an element whose accessible name, label or text is exactly Name
 *
 * Usage (from the repo root):
 *   node tools/teach-drift.js                 check every worksheet; exit 1 on drift
 *   node tools/teach-drift.js --open-issues   also open an issue per drifted worksheet
 *                                             (needs the gh CLI and GH_TOKEN; skips a
 *                                             worksheet that already has an open one)
 *   node tools/teach-drift.js --manifest <file>   check one manifest instead of all
 *
 * Requires playwright: `npm ci` in tools/, then `npx playwright install chromium` there.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const TEACH = path.join(ROOT, 'teach');
const ROLES = ['button', 'link', 'tab', 'checkbox', 'radio', 'textbox', 'combobox', 'listbox',
  'slider', 'spinbutton', 'switch', 'option', 'menuitem', 'heading', 'region', 'group', 'table'];
const ATTEMPTS = 3;
const RENDER_WAIT_MS = 15000;

function manifests(argv) {
  const one = argv.indexOf('--manifest');
  if (one !== -1) return [path.resolve(argv[one + 1])];
  return fs.readdirSync(TEACH, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    .map((e) => path.join(TEACH, e.name, 'anchors.json'))
    .filter((p) => fs.existsSync(p))
    .sort();
}

async function present(page, anchor) {
  if (anchor.kind === 'id') {
    const sel = `[id="${anchor.value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"]`;
    return (await page.locator(sel).count()) > 0;
  }
  const name = anchor.value;
  if ((await page.getByLabel(name, { exact: true }).count()) > 0) return true;
  if ((await page.getByText(name, { exact: true }).count()) > 0) return true;
  for (const role of ROLES) {
    if ((await page.getByRole(role, { name, exact: true, includeHidden: true }).count()) > 0) return true;
  }
  return false;
}

/* Labs render with JavaScript, so poll until every anchor is found or the wait runs out. */
async function checkWorksheet(browser, ws) {
  let lastError = null;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const page = await browser.newPage();
    try {
      const res = await page.goto(ws.url, { waitUntil: 'load', timeout: 60000 });
      if (!res || !res.ok()) throw new Error(`HTTP ${res ? res.status() : 'no response'} for ${ws.url}`);
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      const deadline = Date.now() + RENDER_WAIT_MS;
      let missing = ws.anchors;
      for (;;) {
        const next = [];
        for (const a of missing) if (!(await present(page, a))) next.push(a);
        missing = next;
        if (!missing.length || Date.now() > deadline) break;
        await page.waitForTimeout(1000);
      }
      await page.close();
      return { ok: missing.length === 0, missing };
    } catch (e) {
      lastError = e;
      await page.close().catch(() => {});
      if (attempt < ATTEMPTS) await new Promise((r) => setTimeout(r, 20000));
    }
  }
  return { ok: false, missing: [], error: String(lastError && lastError.message || lastError) };
}

const show = (a) => (a.kind === 'id' ? `#${a.value}` : `label:${a.value}`);

function openIssue(mod, ws, result) {
  const title = `Worksheet drift: ${mod}/${ws.exhibit}`;
  const open = JSON.parse(execFileSync('gh', ['issue', 'list', '--state', 'open', '--search', `"${title}" in:title`,
    '--json', 'title', '--limit', '50'], { encoding: 'utf8' }));
  if (open.some((i) => i.title === title)) {
    console.log(`  an open issue already tracks ${title}; not opening another`);
    return;
  }
  const run = process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : '';
  const body = [
    `The daily worksheet drift check could not find everything the **${ws.exhibit}** worksheet names on its live exhibit.`,
    '',
    `- Worksheet: ${ws.worksheet}`,
    `- Exhibit: ${ws.url}`,
    `- Worksheet last checked against lab commit \`${ws.source_commit}\` on ${ws.checked}`,
    result.error
      ? `- The exhibit did not load after ${ATTEMPTS} attempts: ${result.error}`
      : `- Missing: ${result.missing.map((a) => '`' + show(a) + '`').join(', ')}`,
    run ? `- Run: ${run}` : null,
    '',
    'Update the worksheet (teach/_src/worksheets/) to match the exhibit and rerun `node tools/teach-build.js`, or, if the lab changed by mistake, fix the lab. This check only reports that controls are missing; it does not show whether the exhibit still behaves as the worksheet describes.',
  ].filter((l) => l !== null).join('\n');
  execFileSync('gh', ['issue', 'create', '--title', title, '--body', body, '--label', 'bug'], { stdio: 'inherit' });
}

async function main() {
  const argv = process.argv.slice(2);
  const files = manifests(argv);
  const browser = await chromium.launch();
  let failed = 0;
  let checked = 0;
  for (const file of files) {
    const m = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const ws of m.worksheets) {
      checked++;
      const r = await checkWorksheet(browser, ws);
      const label = `${m.module}/${ws.exhibit}`;
      if (r.ok) {
        console.log(`ok      ${label}  (${ws.anchors.length} controls on ${ws.url})`);
        continue;
      }
      failed++;
      console.log(r.error
        ? `DRIFT   ${label}  exhibit did not load: ${r.error}`
        : `DRIFT   ${label}  missing ${r.missing.map(show).join(', ')}`);
      if (argv.includes('--open-issues')) openIssue(m.module, ws, r);
    }
  }
  await browser.close();
  console.log(`${checked} worksheet(s) checked, ${failed} drifted.`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
