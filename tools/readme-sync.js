// readme-sync.js — regenerate README.md's Featured, Learning Paths, and All
// Demos tables from index.html, so the site is the single source of truth.
//   node tools/readme-sync.js        rewrite README.md
//   node tools/readme-sync.js check  exit 1 if README differs from generated
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

if (process.argv[2] === 'check') {
  if (out === md) { console.log('README tables in sync with index.html cards (' + cards.length + ' cards).'); }
  else { console.error('README tables out of sync with index.html cards. Run: node tools/readme-sync.js'); process.exit(1); }
} else {
  fs.writeFileSync(mdPath, out);
  console.log('README.md regenerated: ' + cards.length + ' cards, ' + featSlugs.length + ' featured, ' + paths.length + ' learning paths.');
}
