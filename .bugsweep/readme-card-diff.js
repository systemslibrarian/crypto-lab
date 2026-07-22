// Compare every README table row (Category + Stack columns) against the
// live card in index.html (kicker + chips). Reports drift both ways.
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const md = fs.readFileSync('README.md', 'utf8');
const decode = s => s.replace(/&amp;/g, '&').replace(/&rarr;/g, '→');

const cards = {};
const cardRe = /<a class="(?:project|feature)-card[^"]*" data-category="[^"]*" href="https:\/\/systemslibrarian\.github\.io\/crypto-lab-([^\/"]+)\/"[\s\S]*?<\/a>/g;
let m;
while ((m = cardRe.exec(html)) !== null) {
  const b = m[0];
  const kicker = /card-kicker">([^<]+)</.exec(b);
  const chips = [...b.matchAll(/class="chip">([^<]+)</g)].map(x => decode(x[1].trim()));
  cards[m[1]] = { kicker: kicker ? decode(kicker[1].trim()) : '?', chips };
}

const rowRe = /^\|\s*\[([^\]]+?)\](?:\s*\*\(WIP\)\*)?\(https:\/\/systemslibrarian\.github\.io\/crypto-lab-([^\/)]+)\/\)\s*(?:\*\(WIP\)\*\s*)?\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/gm;
let issues = 0;
const seen = new Set();
while ((m = rowRe.exec(md)) !== null) {
  const [, title, slug, cat, stack] = m;
  const key = slug + '|' + cat;
  if (seen.has(key)) continue; // featured dupes
  seen.add(key);
  const card = cards[slug];
  if (!card) { console.log(slug + ': no card'); issues++; continue; }
  const stackItems = stack.split('·').map(s => s.trim());
  const catOk = cat.trim() === card.kicker;
  const stackOk = stackItems.join('|') === card.chips.join('|');
  if (!catOk || !stackOk) {
    issues++;
    console.log('=== ' + slug + ' (' + title + ')');
    if (!catOk) console.log('  readme cat:  "' + cat.trim() + '"  vs kicker: "' + card.kicker + '"');
    if (!stackOk) console.log('  readme stack: ' + stackItems.join(' · ') + '\n  card chips:   ' + card.chips.join(' · '));
  }
}
console.log(issues + ' rows with drift');
