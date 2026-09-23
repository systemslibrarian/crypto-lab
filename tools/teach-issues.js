#!/usr/bin/env node
/*
 * teach-issues.js — re-derive the issues recorded against each exhibit, against the
 * live page.
 *
 * WHY THIS EXISTS
 *
 * A module page publishes the problems its exhibits have: "in WebKit at phone width
 * the page sits about 136px wider than the screen". That is a claim about a lab, and
 * it is inherited from whenever somebody last looked. On 2026-09-22 the four issues
 * recorded across these modules were re-derived against the live pages for the first
 * time since they were written, and three of them were wrong:
 *
 *   - Padding Oracle's WebKit padding failure no longer reproduced at all
 *   - DP Noise's sideways scroll no longer reproduced at all
 *   - Protocol Checker's overflow had moved from about 136px to about 92px
 *
 * Only ECDSA Forge still matched what was written. A defect note nobody re-checks is
 * a claim about a lab that the lab has stopped supporting — and it is worse than no
 * note, because an instructor reads it and plans around a problem that is not there.
 *
 * WHAT IT CHECKS
 *
 * Every `support.results[]` entry whose `result` is not "pass" carries an `issue`
 * with a `kind`. This tool re-derives the kinds it can:
 *
 *   horizontal-overflow   loads the live exhibit in the engine and at the viewport
 *                         the result names, measures documentElement.scrollWidth
 *                         minus clientWidth, and compares with `overflow_px`
 *   manual                cannot be re-derived by a tool. Reported as UNCHECKED with
 *                         the date it was last re-derived by hand — never as a pass.
 *
 * A `manual` issue is deliberately not silent. The whole failure this fleet keeps
 * finding is a checker reporting clean over something it could not look at, so an
 * issue no tool can re-derive is printed every run, with its age.
 *
 * WHAT IT DOES NOT DO
 *
 * It does not edit the module files. Clearing or re-measuring a recorded issue is a
 * judgement — whether the lab changed or the engine did, whether the remaining note
 * is still worth publishing — so this reports, and a maintainer writes.
 *
 * Usage (from the repo root):
 *   node tools/teach-issues.js                  re-derive every recorded issue
 *   node tools/teach-issues.js --open-issues    also open one GitHub issue per stale
 *                                               record (needs gh and GH_TOKEN; skips
 *                                               a record that already has one open)
 *   node tools/teach-issues.js --json           machine-readable
 *
 * Exit codes: 0 every recorded issue still matches what is written; 1 at least one is
 * stale, unreadable, or could not be re-derived automatically.
 *
 * Requires playwright: `npm ci` in tools/, then
 * `npx playwright install chromium firefox webkit` there.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const playwright = require('playwright');

const ROOT = path.join(__dirname, '..');
const MODULES = path.join(ROOT, 'teach', '_src', 'modules');
const INDEX = path.join(ROOT, 'index.html');
const ATTEMPTS = 3;
/* A browser reports a fractional width and a lab's own layout jitters by a pixel
   between engines, so a difference this small is the same measurement, not a move.
   Anything larger is reported with both numbers rather than judged here. */
const TOLERANCE_PX = 8;

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');

/* engine name as recorded ("WebKit 26.6") -> the playwright launcher */
function launcher(engine) {
  const first = String(engine).split(/\s+/)[0].toLowerCase();
  if (first === 'chromium' || first === 'chrome') return playwright.chromium;
  if (first === 'firefox') return playwright.firefox;
  if (first === 'webkit' || first === 'safari') return playwright.webkit;
  return null;
}

/* "390x720", or "1280x720 and 390x720" — every width the result was taken at. */
function viewports(text) {
  return [...String(text).matchAll(/(\d{3,4})\s*x\s*(\d{3,4})/g)]
    .map((m) => ({ width: Number(m[1]), height: Number(m[2]) }));
}

function cardUrls() {
  const html = fs.readFileSync(INDEX, 'utf8');
  const urls = new Map();
  for (const m of html.matchAll(/href="(https:\/\/systemslibrarian\.github\.io\/([^/"]+)\/)"/g)) {
    urls.set(m[2].replace(/^crypto-lab-/, ''), m[1]);
  }
  return urls;
}

function records() {
  const urls = cardUrls();
  const out = [];
  for (const file of fs.readdirSync(MODULES).filter((f) => f.endsWith('.json')).sort()) {
    const m = JSON.parse(fs.readFileSync(path.join(MODULES, file), 'utf8'));
    for (const x of m.exhibits || []) {
      for (const r of ((x.support || {}).results || [])) {
        if (r.result === 'pass') continue;
        out.push({
          module: m.id,
          exhibit: x.name,
          url: urls.get(x.name) || null,
          engine: r.engine,
          viewport: r.viewport,
          result: r.result,
          rederived: r.rederived || null,
          issue: r.issue || {},
        });
      }
    }
  }
  return out;
}

async function measureOverflow(rec) {
  const launch = launcher(rec.engine);
  if (!launch) return { error: `no engine for "${rec.engine}"` };
  const vps = viewports(rec.viewport);
  if (!vps.length) return { error: `no viewport parsed from "${rec.viewport}"` };
  /* An overflow is recorded at the narrow width, so judge the narrowest one named. */
  const vp = vps.reduce((a, b) => (b.width < a.width ? b : a));

  const browser = await launch.launch();
  try {
    for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
      const page = await browser.newPage({ viewport: vp });
      try {
        await page.goto(rec.url, { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(1500);
        const over = await page.evaluate(() => {
          const de = document.documentElement;
          return de.scrollWidth - de.clientWidth;
        });
        await page.close();
        return { overflow: over, at: `${vp.width}x${vp.height}` };
      } catch (e) {
        await page.close().catch(() => {});
        if (attempt === ATTEMPTS) return { error: String(e.message).split('\n')[0] };
      }
    }
    return { error: 'unreachable' };
  } finally {
    await browser.close();
  }
}

function openIssue(rec, verdict) {
  const title = `Recorded issue out of date: ${rec.module}/${rec.exhibit} (${rec.engine})`;
  const open = JSON.parse(execFileSync('gh', ['issue', 'list', '--state', 'open', '--search',
    `"${title}" in:title`, '--json', 'title', '--limit', '50'], { encoding: 'utf8' }));
  if (open.some((i) => i.title === title)) {
    console.log(`  an open issue already tracks ${title}; not opening another`);
    return;
  }
  const run = process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : '';
  const body = [
    `An issue published on the **${rec.module}** module page no longer matches the live exhibit.`,
    '',
    `- Exhibit: ${rec.url}`,
    `- Recorded: ${rec.engine} at ${rec.viewport} — ${rec.result}`,
    `- Last re-derived by hand: ${rec.rederived || 'never recorded'}`,
    `- Re-derived just now: ${verdict.detail}`,
    run ? `- Run: ${run}` : null,
    '',
    'The module page publishes this issue to instructors, so while it is out of date the page is describing a problem that is not there, or understating one that is.',
    '',
    `Update the \`support.results\` entry for this engine in \`teach/_src/modules/${rec.module}.json\` — the figure, the note, the \`headline\`, and \`rederived\` — then rerun \`node tools/teach-build.js\`. Clearing a record is a judgement rather than a measurement: whether the lab changed or the engine did is not something this check can tell you, and it does not edit the file itself.`,
  ].filter((l) => l !== null).join('\n');
  execFileSync('gh', ['issue', 'create', '--title', title, '--body', body, '--label', 'bug'], { stdio: 'inherit' });
}

async function main() {
  const recs = records();
  const findings = [];

  for (const rec of recs) {
    const label = `${rec.module}/${rec.exhibit} ${rec.engine}`;
    if (rec.issue.kind === 'manual') {
      findings.push({ rec, state: 'UNCHECKED', detail: `no tool can re-derive this kind; last re-derived by hand ${rec.rederived || 'never'}` });
      continue;
    }
    if (rec.issue.kind !== 'horizontal-overflow') {
      findings.push({ rec, state: 'UNREADABLE', detail: `unknown issue kind "${rec.issue.kind}"` });
      continue;
    }
    if (!rec.url) {
      findings.push({ rec, state: 'UNREADABLE', detail: `no card in index.html links this exhibit, so its live URL is unknown` });
      continue;
    }
    const got = await measureOverflow(rec);
    if (got.error) {
      findings.push({ rec, state: 'UNREADABLE', detail: got.error });
      continue;
    }
    const want = rec.issue.overflow_px;
    if (got.overflow <= 0) {
      findings.push({ rec, state: 'GONE', detail: `recorded about ${want}px of overflow at ${got.at}; the page now matches the viewport` });
    } else if (Math.abs(got.overflow - want) > TOLERANCE_PX) {
      findings.push({ rec, state: 'MOVED', detail: `recorded about ${want}px at ${got.at}; measured ${got.overflow}px` });
    } else {
      findings.push({ rec, state: 'MATCHES', detail: `${got.overflow}px at ${got.at}, against ${want}px recorded` });
    }
  }

  if (asJson) {
    console.log(JSON.stringify(findings.map((f) => ({ ...f.rec, state: f.state, detail: f.detail })), null, 2));
  } else {
    console.log(`Recorded issues re-derived against the live pages: ${findings.length} checked.\n`);
    for (const f of findings) {
      console.log(`  ${f.state.padEnd(10)} ${`${f.rec.module}/${f.rec.exhibit}`.padEnd(34)} ${f.rec.engine.padEnd(14)} ${f.detail}`);
    }
    const by = (s) => findings.filter((f) => f.state === s).length;
    console.log('');
    for (const s of ['MATCHES', 'MOVED', 'GONE', 'UNCHECKED', 'UNREADABLE']) {
      if (by(s)) console.log(`  ${String(by(s)).padStart(3)}  ${s}`);
    }
  }

  const stale = findings.filter((f) => f.state !== 'MATCHES');
  if (argv.includes('--open-issues')) {
    for (const f of stale.filter((x) => x.state === 'GONE' || x.state === 'MOVED')) openIssue(f.rec, f);
  }
  if (stale.length && !asJson) {
    console.log('\nA recorded issue that no longer matches the live page is a claim the module page is'
      + '\nstill publishing to instructors. Update the support.results entry and its rederived date.');
  }
  process.exit(stale.length ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
