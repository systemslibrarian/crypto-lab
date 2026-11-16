// llms-sync.js — keep llms.txt's published counts in step with the catalog.
//
// Run: node tools/llms-sync.js check
// Prevents: llms.txt publishing a catalog size, exhibit count or concept count the catalog no longer has
// Reads: llms.txt, index.html's cards and its id="exhibit-count" literal, concept-coverage.md's concept headers
//
//   node tools/llms-sync.js        rewrite llms.txt's counts from the catalog
//   node tools/llms-sync.js check  exit 1 if any published count disagrees
//
// llms.txt is the one file in the registration chain with neither a generator
// nor a checker, and it carries THREE figures: the card total, the exhibit
// count that excludes the learning game, and the concept count. Each of those
// lives in a different file, so a lab landing anywhere moves one of them and
// nothing noticed.
//
// It does NOT re-implement the hero rule. The exhibit figure is compared
// against index.html's own id="exhibit-count" literal, which readme-sync
// generates and readme-sync check already gates, so the learning-game
// exclusion has exactly one owner. Deriving it a second time here is how two
// checkers come to disagree about the same number.

const fs = require('fs');
const path = require('path');
const { readCards } = require('./card-reader.js');
const { parseConcepts } = require('./concept-sync.js');

const ROOT = path.resolve(__dirname, '..');
const LLMS = path.join(ROOT, 'llms.txt');
const INDEX = path.join(ROOT, 'index.html');
const CONCEPTS = path.join(ROOT, 'concept-coverage.md');

function figures() {
  const html = fs.readFileSync(INDEX, 'utf8');
  const total = readCards(html).cards.length;
  const hero = /id="exhibit-count">(\d+)</.exec(html);
  if (!hero) throw new Error('index.html has no id="exhibit-count" literal to compare against');
  // parseConcepts is concept-sync's own parser, imported rather than copied: a
  // concept number may carry a letter suffix ("23b", inserted mid-list), and a
  // second regex here counted 47 against its 48 the first time this was written.
  const concepts = parseConcepts(fs.readFileSync(CONCEPTS, 'utf8')).length;
  if (!concepts) throw new Error('concept-coverage.md yielded no concepts');
  return { total, exhibits: Number(hero[1]), concepts };
}

// Each claim names the figure it publishes and how to find it. The catalog
// sentence spans a line break, so whitespace inside it is matched loosely.
const CLAIMS = [
  { key: 'total', what: 'catalog size',
    re: /(A catalog of )(\d+)( browser-based)/ },
  { key: 'exhibits', what: 'exhibit count',
    re: /(\(\s*)(\d+)(\s+interactive\s*(?:\n>\s*)?exhibits)/ },
  { key: 'total', what: 'repository count',
    re: /(cloning )(\d+)( repositories)/ },
  { key: 'concepts', what: 'concept count',
    re: /(mapped onto about )(\d+)( concepts)/ },
];

function apply(text, want) {
  const problems = [];
  let out = text;
  for (const c of CLAIMS) {
    const m = c.re.exec(out);
    if (!m) { problems.push(`${c.what}: llms.txt no longer carries this claim, so nothing was checked`); continue; }
    const found = Number(m[2]);
    if (found !== want[c.key]) {
      problems.push(`${c.what}: llms.txt says ${found}, the catalog says ${want[c.key]}`);
      out = out.replace(c.re, (_, a, __, z) => a + want[c.key] + z);
    }
  }
  return { out, problems };
}

// "plus one learning game" is a count in words. If the gap between the two
// figures stops being 1, the sentence is wrong in a way no numeral shows.
function gapClaim(text, want) {
  const gap = want.total - want.exhibits;
  const m = /plus (one|two|three|four|five) learning game/.exec(text);
  if (!m) return gap === 0 ? [] : [`the catalog/exhibit gap is ${gap} and llms.txt makes no claim about it`];
  const words = { one: 1, two: 2, three: 3, four: 4, five: 5 };
  return words[m[1]] === gap ? []
    : [`learning-game wording: llms.txt says "${m[1]}", the gap between the two figures is ${gap}`];
}

if (require.main === module) {
  const check = process.argv[2] === 'check';
  const want = figures();
  const text = fs.readFileSync(LLMS, 'utf8');
  const { out, problems } = apply(text, want);
  const all = problems.concat(gapClaim(text, want));
  console.log(`llms.txt: catalog ${want.total} | exhibits ${want.exhibits} | concepts ${want.concepts}`);
  if (!all.length) {
    console.log('Every published count matches the catalog.');
    process.exit(0);
  }
  for (const p of all) console.error('  ' + p);
  if (check) {
    console.error('Fix with: node tools/llms-sync.js');
    process.exit(1);
  }
  if (out !== text) { fs.writeFileSync(LLMS, out); console.log('llms.txt rewritten.'); }
  if (all.length > problems.length) process.exit(1); // wording needs a person
}

module.exports = { figures, apply, gapClaim, CLAIMS };
