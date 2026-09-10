// readme-sync.js — regenerate README.md's Featured, Learning Paths, and All
// Demos tables from index.html, so the site is the single source of truth.
//   node tools/readme-sync.js        rewrite README.md and index.html's hero count
//   node tools/readme-sync.js check  exit 1 if either differs from generated
//
// It also owns the hero count in index.html's <h1> (#exhibit-count). That number
// IS written at runtime — the JS counts .feature-card/.project-card and sets
// textContent — so a browser always sees the truth and the stale literal is
// invisible in the one place anybody checks. Everything that reads the raw HTML
// instead sees the literal: crawlers, link-preview cards, anything fetching the
// page. On 2026-09-10 it read 175 against 193 cards, eighteen behind, and it was
// reported from outside rather than caught here. A number a human retypes after
// a runtime path has already made it invisible is the definition of one that
// drifts, so it is generated now.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const mdPath = path.join(root, 'README.md');
const html = fs.readFileSync(htmlPath, 'utf8');
const md = fs.readFileSync(mdPath, 'utf8');
const eol = md.includes('\r\n') ? '\r\n' : '\n';

const decode = s => s
  .replace(/&amp;/g, '&').replace(/&apos;/g, "'").replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"').replace(/&rarr;/g, '→').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const cards = [];
const cardRe = /<a class="((?:project|feature)-card[^"]*)" data-category="[^"]*" href="(https:\/\/systemslibrarian\.github\.io\/[^\/"]+\/)"[\s\S]*?<\/a>/g;
let m;
while ((m = cardRe.exec(html)) !== null) {
  const block = m[0];
  const kicker = /card-kicker">([^<]+)</.exec(block);
  const title = /(?:project|feature)-title">([^<]+)</.exec(block);
  const chips = [...block.matchAll(/class="chip">([^<]+)</g)].map(x => decode(x[1].trim()));
  cards.push({
    href: m[2],
    wip: m[1].includes('wip-card'),
    kicker: kicker ? decode(kicker[1].trim()) : '',
    title: title ? decode(title[1].trim()) : '',
    chips,
  });
}
const bySlug = {};
cards.forEach(c => { bySlug[c.href.replace(/^.*github\.io\//, '').replace(/\/$/, '')] = c; });

const row = c =>
  '| [' + c.title + '](' + c.href + ')' + (c.wip ? ' *(WIP)*' : '') +
  ' | ' + c.kicker + ' | ' + c.chips.join(' · ') + ' |';

// All Demos: every card, sorted by Category (kicker) then title.
const allRows = [...cards]
  .sort((a, b) => a.kicker.localeCompare(b.kicker, 'en') || a.title.localeCompare(b.title, 'en'))
  .map(row).join(eol);

// Featured: keep the demos and order already listed in the README's Featured table.
const featBody = /## Featured\r?\n\r?\n\|[^\n]*\r?\n\|---\|---\|---\|\r?\n([\s\S]*?)\r?\n\r?\n---/.exec(md);
if (!featBody) { console.error('Featured table not found'); process.exit(1); }
const featSlugs = [...featBody[1].matchAll(/github\.io\/([^\/)]+)\//g)].map(x => x[1]);
const featRows = featSlugs.map(s => {
  if (!bySlug[s]) { console.error('Featured slug has no card: ' + s); process.exit(1); }
  return row(bySlug[s]);
}).join(eol);

// Learning Paths: from the LEARNING_PATHS array in the page's JS.
const pIdx = html.indexOf('var LEARNING_PATHS = [');
const pEnd = html.indexOf('];', pIdx);
if (pIdx === -1) { console.error('LEARNING_PATHS not found'); process.exit(1); }
const paths = eval('(' + html.slice(pIdx + 'var LEARNING_PATHS = '.length, pEnd + 1) + ')');
const pathRows = paths.map(p =>
  '| **' + p.label.replace(/ Path$/, '') + '** | ' + p.blurb + ' | ' +
  p.steps.map(s => s.title).join(' → ') + ' |').join(eol);

let out = md.replace(
  /(## Featured\r?\n\r?\n\|[^\n]*\r?\n\|---\|---\|---\|\r?\n)[\s\S]*?(\r?\n\r?\n---)/,
  (_, head, tail) => head + featRows + tail);
out = out.replace(
  /(\| Path \| Focus \| Journey \|\r?\n\|---\|---\|---\|\r?\n)[\s\S]*?(\r?\n\r?\n---)/,
  (_, head, tail) => head + pathRows + tail);
out = out.replace(
  /(## All Demos\r?\n\r?\n\|[^\n]*\r?\n\|---\|---\|---\|\r?\n)[\s\S]*?(\r?\n\r?\n---)/,
  (_, head, tail) => head + allRows + tail);

/* The hero count. Fail rather than skip if the span is gone: a generator that
   silently finds nothing to generate is how the literal got stale in the first
   place. */
const heroRe = /(id="exhibit-count">)(\d+)(<)/;
const heroMatch = heroRe.exec(html);
if (!heroMatch) {
  console.error('index.html has no id="exhibit-count" span — the hero count cannot be generated. '
    + 'If the heading was restructured, update readme-sync.js rather than dropping the check.');
  process.exit(1);
}
const heroWas = Number(heroMatch[2]);
const heroHtml = html.replace(heroRe, (_, a, __, c) => a + cards.length + c);

if (process.argv[2] === 'check') {
  const readmeOk = out === md;
  const heroOk = heroWas === cards.length;
  if (readmeOk && heroOk) {
    console.log('README tables in sync with index.html cards (' + cards.length + ' cards); '
      + 'hero count reads ' + heroWas + '.');
  } else {
    if (!readmeOk) console.error('README tables out of sync with index.html cards.');
    if (!heroOk) {
      console.error('index.html hero count reads ' + heroWas + ' but there are ' + cards.length
        + ' cards. The runtime JS overwrites it, so this is invisible in a browser and wrong '
        + 'in every raw-HTML read of the page.');
    }
    console.error('Run: node tools/readme-sync.js');
    process.exit(1);
  }
} else {
  fs.writeFileSync(mdPath, out);
  if (heroHtml !== html) fs.writeFileSync(htmlPath, heroHtml);
  console.log('README.md regenerated: ' + cards.length + ' cards, ' + featSlugs.length + ' featured, '
    + paths.length + ' learning paths.'
    + (heroHtml !== html ? ' Hero count ' + heroWas + ' -> ' + cards.length + '.' : ''));
}
