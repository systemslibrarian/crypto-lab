// readme-sync.js — regenerate README.md's Learning Paths and All
// Demos tables from index.html, so the site is the single source of truth.
//
// Run: node tools/readme-sync.js check
// Prevents: this README’s tables drifting from the cards they are generated from
// Reads: index.html's cards, its SECTIONS / TITLE_TO_SECTION / LEARNING_PATHS literals and #exhibit-count
//   node tools/readme-sync.js        rewrite README.md and index.html's hero count
//   node tools/readme-sync.js check  exit 1 if either differs from generated
//
// All Demos mirrors the live catalog: the same sections (SECTIONS), in the same
// order, and within each section the cards in the order the page shows them —
// document order, exactly as the page's grouping code
// appends them. Each row carries the card's own description, its live demo, its
// source repository and its primitive chips. The section sits between the
// readme-sync:all-demos markers; everything between them is regenerated.
//
// Every card must map to exactly one section (TITLE_TO_SECTION). A card with no
// section fails the run rather than being dropped or filed under a guess: the
// catalog page would not show it under any heading either.
//
// It also owns the hero count in index.html's <h1> (#exhibit-count). That number
// IS written at runtime — the JS counts .project-card and sets
// textContent — so a browser always sees the truth and the stale literal is
// invisible in the one place anybody checks. Everything that reads the raw HTML
// instead sees the literal: crawlers, link-preview cards, anything fetching the
// page. On 2026-09-10 it read 175 against 193 cards, eighteen behind, and it was
// reported from outside rather than caught here. A number a human retypes after
// a runtime path has already made it invisible is the definition of one that
// drifts, so it is generated now.
//
// Output is the same on every OS: no locale-dependent sorting anywhere, and the
// line endings follow the README's own.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const mdPath = path.join(root, 'README.md');
const html = fs.readFileSync(htmlPath, 'utf8');
const md = fs.readFileSync(mdPath, 'utf8');
const eol = md.includes('\r\n') ? '\r\n' : '\n';

const NAMED = { amp: '&', apos: "'", quot: '"', lt: '<', gt: '>', rarr: '→', pi: 'π' };
const decode = s => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (all, n) => (n in NAMED ? NAMED[n] : all));

/* A table cell: a literal pipe would end the cell. */
const cell = s => s.replace(/\|/g, '\\|');

const cards = [];
/* The card matcher is imported, not written here: this file's own rule pinned
   `data-category` before `href` and would have dropped any card that reshuffled
   its attributes. See tools/card-reader.js and #125. `data-format` now comes off
   a properly bounded opening tag, so the `>`-in-an-attribute hazard that the
   previous comment here worked around is gone rather than guarded. */
const { readCards, hreflessLine } = require('./card-reader.js');
const read = readCards(html);
if (read.hrefless.length) {
  console.error(hreflessLine(read.hrefless));
  process.exit(1);
}
for (const card of read.cards) {
  const block = card.block;
  const kicker = /card-kicker">([^<]+)</.exec(block);
  const title = /project-title">([^<]+)</.exec(block);
  const copy = /project-copy">([^<]+)</.exec(block);
  const chips = [...block.matchAll(/class="chip">([^<]+)</g)].map(x => decode(x[1].trim()));
  const format = card.attr('data-format');
  cards.push({
    href: card.href,
    slug: card.slug,
    format: format || '',
    wip: card.wip,
    kicker: kicker ? decode(kicker[1].trim()) : '',
    title: title ? decode(title[1].trim()) : '',
    copy: copy ? decode(copy[1].trim().replace(/\s+/g, ' ')) : '',
    chips,
  });
}
const bySlug = {};
cards.forEach(c => { bySlug[c.slug] = c; });

/* The page's own JS literals, read the same way LEARNING_PATHS is. */
function literal(name, open, close) {
  const start = html.indexOf('var ' + name + ' = ' + open);
  if (start === -1) { console.error(name + ' not found in index.html'); process.exit(1); }
  const end = html.indexOf(close + ';', start);
  return eval('(' + html.slice(start + ('var ' + name + ' = ').length, end + 1) + ')');
}

const row = c =>
  '| [' + c.title + '](' + c.href + ')' + (c.wip ? ' *(WIP)*' : '') +
  ' | ' + c.kicker + ' | ' + c.chips.join(' · ') + ' |';

// All Demos: grouped by the catalog's sections, in the catalog's order.
const SECTIONS = literal('SECTIONS', '[', ']');
const TITLE_TO_SECTION = literal('TITLE_TO_SECTION', '{', '}');
const unsectioned = cards.filter(c => !TITLE_TO_SECTION[c.title]);
if (unsectioned.length) {
  console.error('Cards with no section in TITLE_TO_SECTION (add them there first): '
    + unsectioned.map(c => c.title).join(', '));
  process.exit(1);
}
/* Document order. The editorial strip that used to float four cards to the
   front of this list is gone, so there is nothing to hoist. */
const ordered = cards;
const demoRow = c =>
  '| [' + cell(c.title) + '](' + c.href + ')' + (c.wip ? ' *(WIP)*' : '') +
  ' | ' + cell(c.copy) +
  ' | [' + c.slug + '](https://github.com/systemslibrarian/' + c.slug + ')' +
  ' | ' + cell(c.chips.join(' · ')) + ' |';
const allDemos = [
  '<!-- readme-sync:all-demos:begin — generated by tools/readme-sync.js from index.html; do not edit by hand -->',
  'Grouped the way the [live catalog](https://crypto-lab.systemslibrarian.dev/) groups them, in the same order.',
];
SECTIONS.forEach(s => {
  const inSection = ordered.filter(c => TITLE_TO_SECTION[c.title] === s.id);
  if (!inSection.length) return;
  allDemos.push('', '### ' + s.label, '', '| Exhibit | Description | Source | Primitives |', '|---|---|---|---|');
  inSection.forEach(c => allDemos.push(demoRow(c)));
});
allDemos.push('<!-- readme-sync:all-demos:end -->');
const allBlock = allDemos.join(eol);

// Learning Paths: from the LEARNING_PATHS array in the page's JS.
const paths = literal('LEARNING_PATHS', '[', ']');
const pathRow = p =>
  '| **' + p.label.replace(/ Path$/, '') + '** | ' + p.blurb + (p.guide ? ' [' + p.guide.label + '](https://crypto-lab.systemslibrarian.dev/' + p.guide.href + ')' : '') + ' | ' +
  p.steps.map(s => s.title).join(' → ') + ' |';
const historicalPaths = paths.filter(p => p.historical);
let pathRows = paths.filter(p => !p.historical).map(pathRow).join(eol);
if (historicalPaths.length) {
  pathRows += eol + eol + '### Historical reading' + eol + eol +
    'These companions explore earlier designs and protocol ideas. Read their coverage limits and use current sources for deployment decisions.' + eol + eol +
    '| Path | Focus | Journey |' + eol + '|---|---|---|' + eol + historicalPaths.map(pathRow).join(eol);
}

const allRe = /<!-- readme-sync:all-demos:begin[^\n]*-->[\s\S]*?<!-- readme-sync:all-demos:end -->/;
if (!allRe.test(md)) {
  console.error('README.md has no readme-sync:all-demos markers under "## All Demos" — the section cannot be generated.');
  process.exit(1);
}

let out = md.replace(
  /(\| Path \| Focus \| Journey \|\r?\n\|---\|---\|---\|\r?\n)[\s\S]*?(\r?\n\r?\n---)/,
  (_, head, tail) => head + pathRows + tail);
out = out.replace(allRe, () => allBlock);

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
/* THE HERO COUNTS WHAT THE GRID SHOWS, WHICH IS NOT THE NUMBER OF CARDS.
 *
 * index.html's own JS builds its card list as
 *
 *   .filter(card => data-format === 'learning-game' ? (card.hidden = true, false) : true)
 *
 * and then sets the hero from THAT array's length, so a learning-game card is
 * out of the grid, the chips, the search box and the count together. Generating
 * the literal from `cards.length` therefore published a number no visitor ever
 * sees: 232 in the markup against 231 on the page, once Lattice Builder was
 * re-presented as a game in #196.
 *
 * Which is this generator's own purpose inverted. The comment at the top of this
 * file keeps the literal generated because the runtime overwrite makes drift
 * invisible in a browser while crawlers and link-preview cards read the literal
 * -- so the literal has to match the RENDERED number, not the row count.
 *
 * The README tables keep every card, Lattice Builder included: it is a
 * catalogued demo with a repo, a live site, a corpus entry and a CATALOG.md
 * row, and it is reachable from games/. Only its presentation moved. So the two
 * numbers differ on purpose, and `heroCards` is the one the heading sentence
 * ("Explore N interactive cryptography exhibits") is actually about. */
const heroCards = cards.filter(c => c.format !== 'learning-game');
const heroHtml = html.replace(heroRe, (_, a, __, c) => a + heroCards.length + c);

if (process.argv[2] === 'check') {
  const readmeOk = out === md;
  const heroOk = heroWas === heroCards.length;
  if (readmeOk && heroOk) {
    console.log('README tables in sync with index.html cards (' + cards.length + ' cards); '
      + 'hero count reads ' + heroWas
      + (cards.length === heroCards.length ? '.'
        : ', which is what the grid shows — '
          + (cards.length - heroCards.length) + ' learning-game card(s) are excluded by the page\'s own JS.'));
  } else {
    if (!readmeOk) console.error('README tables out of sync with index.html cards.');
    if (!heroOk) {
      console.error('index.html hero count reads ' + heroWas + ' but the grid shows '
        + heroCards.length + ' of ' + cards.length + ' cards (learning-game cards are excluded '
        + 'by the page\'s own JS). The runtime JS overwrites the literal, so this is invisible '
        + 'in a browser and wrong in every raw-HTML read of the page.');
    }
    console.error('Run: node tools/readme-sync.js');
    process.exit(1);
  }
} else {
  fs.writeFileSync(mdPath, out);
  if (heroHtml !== html) fs.writeFileSync(htmlPath, heroHtml);
  console.log('README.md regenerated: ' + cards.length + ' cards in ' + SECTIONS.length + ' sections, '
    + paths.length + ' learning paths.'
    + (heroHtml !== html ? ' Hero count ' + heroWas + ' -> ' + heroCards.length + '.' : ''));
}
