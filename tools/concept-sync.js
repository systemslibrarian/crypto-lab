#!/usr/bin/env node
/*
 * concept-sync.js — keep concept-coverage.md in step with the catalog.
 *
 * concept-coverage.md maps every demo onto the concept it teaches, so "what's
 * left to build?" is a lookup rather than an audit. That map only stays useful
 * if it stays honest: a new demo that never gets filed under a concept silently
 * breaks the claim that the gap list is complete, and a renamed demo turns a
 * citation into a dangling name.
 *
 * This script checks both directions against index.html:
 *   - every demo the map cites resolves to a real card, and
 *   - every card is cited by some concept.
 *
 * Usage (run from the crypto-lab repo root):
 *   node tools/concept-sync.js          Report coverage; exit 0 always.
 *   node tools/concept-sync.js check    Same report; exit 1 on either drift.
 *
 * Two kinds of citation are expected NOT to have a card, and are reported as
 * backlog rather than errors:
 *   *Name (built, uncatalogued)*   built demo still missing its card
 *   `slug` in flight               demo being built now
 */
'use strict';
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const MAP_PATH = path.join(REPO_ROOT, 'concept-coverage.md');
const HTML_PATH = path.join(REPO_ROOT, 'index.html');

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

// Card titles, exactly as readme-sync.js reads them.
function cardTitles() {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  const titles = [];
  const re = /class="(?:feature|project)-title">([^<]+)</g;
  let m;
  while ((m = re.exec(html)) !== null) titles.push(decode(m[1].trim()));
  return titles;
}

/*
 * Concept entries look like:
 *
 *   **5. Message authentication — `COVERED`**
 *   MAC Race · Poly1305 MAC · AEGIS Gate · Nonce Guard. Polynomial MACs, AEAD, and
 *   misuse-resistant AEAD.
 *
 * The citation list is the FIRST paragraph after the header: a `·`-separated run
 * of demo titles ending at the first sentence break. Later paragraphs under a
 * concept are commentary and may name demos rhetorically — those are not
 * citations and are deliberately not parsed.
 */
function parseConcepts(md) {
  const concepts = [];
  // Note: `$` is not usable as the paragraph terminator here — under /m it would
  // match every line end and truncate the citation list to its first line.
  // Numbers may carry a letter suffix ("23b") — a concept inserted mid-list without
  // renumbering, because the §-cross-references between concepts are load-bearing.
  const re = /^\*\*(\d+[a-z]?)\.\s+(.+?)\s+—\s+`(COVERED|DEEP|PARTIAL|GAP)`\*\*[ \t]*\r?\n([\s\S]*?)(?:\r?\n\r?\n|(?![\s\S]))/gm;
  let m;
  while ((m = re.exec(md)) !== null) {
    concepts.push({
      num: m[1],
      title: m[2],
      status: m[3],
      demos: parseCitations(m[4]),
    });
  }
  return concepts;
}

function parseCitations(para) {
  // Unwrap hard line breaks first — titles wrap mid-name ("HQC Timing\nBreak").
  const flat = para.replace(/\s*\r?\n\s*/g, ' ').trim();
  const out = [];
  for (const raw of flat.split(' · ')) {
    let s = raw
      .replace(/\([^)]*\)/g, ' ') // parenthetical gloss: Shor (period finding)
      .replace(/\*+/g, '') // emphasis markers
      .replace(/`[^`]*`/g, ' '); // inline code, e.g. the in-flight slug
    // The final citation runs into the concept's prose; cut at the sentence break.
    s = s.split(/\.(?:\s|$)/)[0].replace(/\s+/g, ' ').trim();
    if (!s) continue;
    // A citation is a demo name, not a sentence. Anything with a comma, an arrow,
    // or a lowercase-word opener is prose that leaked past the sentence split.
    if (/[,:;→]/.test(s) || /^[a-z]/.test(s)) continue;
    out.push({ title: s, uncatalogued: /built,\s*uncatalogued/.test(raw) });
  }
  return out;
}

// The "In flight, already closing gaps:" line names slugs, not titles.
function parseInFlight(md) {
  const line = /\*\*In flight, already closing gaps:\*\*([^\n]*(?:\r?\n(?!\r?\n)[^\n]*)*)/.exec(md);
  if (!line) return [];
  return [...line[1].matchAll(/`([a-z0-9-]+)`/g)].map((x) => x[1]);
}

// The gap-summary table's bolded second column.
function parseGaps(md) {
  const tbl = /## Gap summary[\s\S]*?\n\|---[\s\S]*?\n([\s\S]*?)\r?\n\r?\n/.exec(md);
  if (!tbl) return [];
  return [...tbl[1].matchAll(/^\|\s*\d+\s*\|\s*\*\*(.+?)\*\*\s*\|/gm)].map((x) => x[1]);
}

function version(md) {
  const v = /^\*Version (\S+?)\s/m.exec(md);
  return v ? 'v' + v[1] : 'unversioned';
}

function main() {
  const check = process.argv[2] === 'check';
  const md = fs.readFileSync(MAP_PATH, 'utf8');
  const titles = cardTitles();
  const carded = new Set(titles);

  const concepts = parseConcepts(md);
  const inFlight = parseInFlight(md);
  const gaps = parseGaps(md);

  // Fold citations into a title -> [concept numbers] index.
  const citedIn = new Map();
  const backlog = new Set();
  for (const c of concepts) {
    for (const d of c.demos) {
      if (!citedIn.has(d.title)) citedIn.set(d.title, []);
      citedIn.get(d.title).push(c.num);
      if (d.uncatalogued) backlog.add(d.title);
    }
  }

  const dangling = [...citedIn.keys()].filter((t) => !carded.has(t) && !backlog.has(t)).sort();
  const unmapped = titles.filter((t) => !citedIn.has(t)).sort();
  const stale = [...backlog].filter((t) => carded.has(t)).sort();

  const byStatus = (s) => concepts.filter((c) => c.status === s).length;
  console.log(
    'concept-coverage.md ' + version(md) + ' — ' + concepts.length + ' concepts (' +
      ['DEEP', 'COVERED', 'PARTIAL', 'GAP'].map((s) => s + ' ' + byStatus(s)).join(' · ') + ')'
  );
  console.log('Cards in index.html: ' + titles.length + ' | cited in map: ' + citedIn.size);
  console.log('Cited but no card (' + dangling.length + '):', JSON.stringify(dangling));
  console.log('Carded but unmapped (' + unmapped.length + '):', JSON.stringify(unmapped));
  console.log('Uncatalogued backlog (' + backlog.size + '):', JSON.stringify([...backlog].sort()));
  console.log('In flight (' + inFlight.length + '):', JSON.stringify(inFlight));
  console.log('Open gaps (' + gaps.length + '):', JSON.stringify(gaps));
  if (stale.length) {
    console.log('Marked uncatalogued but now carded (' + stale.length + '):', JSON.stringify(stale));
    console.log('  → drop the "(built, uncatalogued)" marker for these.');
  }

  const errors = dangling.length + unmapped.length + stale.length;
  if (errors && check) {
    console.error('\nconcept-coverage.md out of step with index.html.');
    if (dangling.length) console.error('  Cited-but-no-card: a demo was renamed, or the citation is a typo.');
    if (unmapped.length) console.error('  Carded-but-unmapped: file each new demo under its concept in concept-coverage.md.');
    process.exit(1);
  }
  if (check) console.log('\nconcept-coverage.md in step with index.html.');
}

main();
