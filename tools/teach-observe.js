#!/usr/bin/env node
/*
 * teach-observe.js — record what a page contacts, for teach/_src/evidence.json and the
 * per-exhibit privacy notes on module pages.
 *
 * Run: node tools/teach-observe.js <exhibit url>
 * Prevents: a privacy note on a module page describing contacts the exhibit no longer makes
 *
 * Loads the page, scrolls to the end, waits for the network to go quiet, and prints
 * every origin other than the page's own that it contacted, with the kind of request,
 * plus cookies, web-storage keys and scripts loaded from other origins. It records
 * page load only; run a worksheet's steps by hand (or extend this) to observe those.
 *
 * Usage (from the repo root):
 *   node tools/teach-observe.js <url> [chromium|firefox|webkit]
 *
 * The output is an observation, dated by the day it was made. Copy what it found into
 * evidence.json or a module's privacy field; do not paraphrase it into a promise.
 * Requires playwright: `npm ci` in tools/, then `npx playwright install <engine>` there.
 */
'use strict';
const pw = require('playwright');

async function main() {
  const [url, engine = 'chromium'] = process.argv.slice(2);
  if (!url || !pw[engine]) {
    console.error('Usage: node tools/teach-observe.js <url> [chromium|firefox|webkit]');
    process.exit(2);
  }
  const browser = await pw[engine].launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  const requests = [];
  page.on('request', (r) => requests.push({ url: r.url(), type: r.resourceType() }));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForLoadState('networkidle').catch(() => {});
  const origin = new URL(page.url()).origin;
  const others = {};
  for (const r of requests) {
    if (r.url.startsWith('data:') || r.url.startsWith('blob:')) continue;
    const o = new URL(r.url).origin;
    if (o === origin) continue;
    (others[o] = others[o] || new Set()).add(r.type);
  }
  const storage = await page.evaluate(() => ({
    local: Object.keys(localStorage).sort(),
    session: Object.keys(sessionStorage).sort(),
  }));
  const scripts = await page.evaluate(() => Array.from(document.scripts).map((s) => s.src).filter(Boolean));
  const cookies = await context.cookies();
  const today = new Date().toISOString().slice(0, 10);
  console.log(JSON.stringify({
    url,
    observed: today,
    engine,
    page_origin: origin,
    other_origins: Object.keys(others).sort().map((o) => ({ origin: o, requests: [...others[o]].sort() })),
    cookies: cookies.map((c) => `${c.name} (${c.domain})`).sort(),
    storage: [...storage.local.map((k) => `localStorage: ${k}`), ...storage.session.map((k) => `sessionStorage: ${k}`)],
    external_scripts: scripts.filter((s) => !s.startsWith(origin)).sort(),
  }, null, 2));
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
