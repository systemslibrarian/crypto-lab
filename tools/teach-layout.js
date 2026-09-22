// teach-layout.js — measure every generated teach page, so a layout that crushes text
// cannot land again.
//   node tools/teach-layout.js          check every page at 1280x720 and 390x720
//   node tools/teach-layout.js --json   the same, as JSON
//
// It exists because the readiness block on a module page once rendered in a column about
// 85px wide: the support list wrapped at eight characters a line against a 736px measure,
// and nothing went red, because every generator check compared files to files. Line length
// is a property of the rendered page, so it has to be measured in a browser.
//
// Three things fail a run:
//   SCROLL   the page itself scrolls sideways (scrollWidth past clientWidth)
//   OVERFLOW an element sticks out past the box of its nearest sized ancestor
//   NARROW   a block of prose wraps at fewer than MIN_CHARS characters a line, while the
//            page's own measure is far wider — the shape of the bug above
//
// A text block is an element with no block-level child, so a paragraph with <strong> in it
// is measured as one block rather than as fragments. Preformatted blocks set their own line
// breaks and are skipped, as is anything inside [data-layout-ok], which is how a deliberate
// narrow column (a card, a sidebar) says so in the markup.
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const TEACH = path.join(ROOT, 'teach');
const WIDTHS = [1280, 390];
const MIN_CHARS = 35;          // below this a line is a column, not a sentence
const MEASURE_RATIO = 0.5;     // and only when the page itself is offering much more room

function pages() {
  const out = [path.join(TEACH, 'index.html')];
  for (const mod of fs.readdirSync(TEACH, { withFileTypes: true })) {
    if (!mod.isDirectory() || mod.name.startsWith('_')) continue;
    const modIndex = path.join(TEACH, mod.name, 'index.html');
    if (fs.existsSync(modIndex)) out.push(modIndex);
    for (const sub of fs.readdirSync(path.join(TEACH, mod.name), { withFileTypes: true })) {
      if (!sub.isDirectory()) continue;
      const p = path.join(TEACH, mod.name, sub.name, 'index.html');
      if (fs.existsSync(p)) out.push(p);
    }
  }
  return out;
}

const IN_PAGE = ({ minChars, ratio }) => {
  const de = document.documentElement;
  const pageScroll = de.scrollWidth - de.clientWidth;

  const BLOCKISH = /^(block|list-item|table|table-row|table-cell|flex|grid|flow-root)$/;
  const isTextBlock = (el) => ![...el.children].some((c) => BLOCKISH.test(getComputedStyle(c).display));
  const lineWidths = (el) => {
    const rg = document.createRange();
    rg.selectNodeContents(el);
    const lines = new Map();
    for (const r of rg.getClientRects()) {
      if (r.width <= 0 || r.height <= 0) continue;
      const key = Math.round(r.top);
      const cur = lines.get(key) || { left: r.left, right: r.right };
      lines.set(key, { left: Math.min(cur.left, r.left), right: Math.max(cur.right, r.right) });
    }
    return [...lines.values()].map((l) => l.right - l.left);
  };

  const prose = [...document.querySelectorAll('p, li, dd, dt, td, th, figcaption')]
    .filter((e) => (e.textContent || '').trim().length > 120);
  const measure = Math.max(0, ...prose.map((e) => e.getBoundingClientRect().width));

  const narrow = [];
  const overflow = [];
  for (const el of document.querySelectorAll('body *')) {
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    if (el.closest('[data-layout-ok]')) continue;

    let parent = el.parentElement;                       // past display:contents wrappers
    while (parent && getComputedStyle(parent).display === 'contents') parent = parent.parentElement;
    if (parent) {
      const pr = parent.getBoundingClientRect();
      const scrolls = ['auto', 'scroll'].includes(getComputedStyle(parent).overflowX);
      if (!scrolls && rect.right > pr.right + 1.5 && rect.width > 8) {
        overflow.push({ sel: el.tagName + (el.className ? '.' + String(el.className).split(' ')[0] : ''), over: Math.round(rect.right - pr.right) });
      }
    }

    if (el.closest('pre, code, svg')) continue;
    const text = (el.textContent || '').trim();
    if (text.length < 120 || !isTextBlock(el)) continue;
    const ws = lineWidths(el);
    if (ws.length < 2) continue;
    const maxLine = Math.max(...ws);
    const chars = text.length / ws.length;
    if (measure && maxLine < measure * ratio && chars < minChars) {
      narrow.push({ sel: el.tagName + (el.className ? '.' + String(el.className).split(' ')[0] : ''),
        charsPerLine: Math.round(chars), maxLine: Math.round(maxLine), measure: Math.round(measure),
        text: text.slice(0, 60) });
    }
  }
  const first = (list) => list.filter((x, i) => list.findIndex((y) => y.sel === x.sel) === i).slice(0, 6);
  return { pageScroll, measure: Math.round(measure), narrow: first(narrow), overflow: first(overflow) };
};

(async () => {
  const asJson = process.argv.includes('--json');
  const files = pages();
  const browser = await chromium.launch();
  const findings = [];
  const results = [];
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const file of files) {
      await page.goto('file://' + file, { waitUntil: 'load' });
      await page.waitForTimeout(250);
      const r = await page.evaluate(IN_PAGE, { minChars: MIN_CHARS, ratio: MEASURE_RATIO });
      const rel = path.relative(ROOT, file);
      results.push({ page: rel, width, ...r });
      if (r.pageScroll > 1) findings.push(`SCROLL   ${rel} at ${width}px scrolls sideways by ${r.pageScroll}px`);
      for (const o of r.overflow) findings.push(`OVERFLOW ${rel} at ${width}px: ${o.sel} sticks out ${o.over}px past its container`);
      for (const n of r.narrow) {
        findings.push(`NARROW   ${rel} at ${width}px: ${n.sel} wraps at about ${n.charsPerLine} characters a line `
          + `(${n.maxLine}px against a ${n.measure}px measure) — "${n.text}"`);
      }
    }
    await page.close();
  }
  await browser.close();

  if (asJson) {
    console.log(JSON.stringify({ findings, results }, null, 1));
  } else if (findings.length) {
    console.error(findings.join('\n'));
    console.error(`\n${findings.length} layout finding(s) across ${files.length} page(s) at ${WIDTHS.join('px and ')}px.`);
  } else {
    console.log(`Layout clean: ${files.length} page(s) at ${WIDTHS.join('px and ')}px — no sideways scrolling, `
      + `nothing overflowing its container, no prose wrapping under ${MIN_CHARS} characters a line.`);
  }
  process.exit(findings.length ? 1 : 0);
})().catch((e) => { console.error('teach-layout failed:', e.message); process.exit(1); });
