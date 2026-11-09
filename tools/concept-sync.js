#!/usr/bin/env node
/*
 * concept-sync.js — keep concept-coverage.md in step with the catalog.
 *
 * Run: node tools/concept-sync.js check
 * Prevents: the gap list answering “is anything missing?” wrongly because a demo was never filed under a concept
 * Reads: concept-coverage.md's citation paragraphs and total line, and index.html's card titles
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
 * It also checks the file's one catalog count, "**Catalogued total: N.**",
 * against the number of cards. That line is typed by hand, and a count a human
 * retypes drifts the day a card is added or removed (Snow 2's move to Related
 * Projects on 2026-09-22 is what found it), so it is checked, not trusted.
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
const cardReader = require('./card-reader.js');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const MAP_PATH = path.join(REPO_ROOT, 'concept-coverage.md');
const HTML_PATH = path.join(REPO_ROOT, 'index.html');

/* `&amp;` LAST. Decoding it first turns `&amp;lt;` into `&lt;` and then into `<`,
   so an author who wrote a literal entity gets a tag instead -- CodeQL
   js/double-escaping, and the reason entity decoders have a fixed order. */
const decode = (s) =>
  String(s)
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

// Card titles, exactly as readme-sync.js reads them.
function cardTitles() {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  /* Titles OF CARDS, via the shared reader. This used to scan the whole page for
     `class="project-title">` with no anchor scope at all, which is the #123
     shape -- `fleet-sync` counting any github.io URL in the page rather than a
     card, and printing 225 where three other readers said 224. It agreed with
     the others today only because no project-title lives outside a card. */
  const read = cardReader.readCards(html);
  if (read.hrefless.length) {
    console.error(cardReader.hreflessLine(read.hrefless));
    process.exit(1);
  }
  return read.cards.map((c) => decode(c.title));
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
  /* LINE-ORIENTED, not one regex over the whole file. The previous pattern paired
     a lazy `(.+?)` with `\s+` and a lazy `([\s\S]*?)` with an alternation, and in
     both the engine had more than one way to split the same characters -- CodeQL
     js/polynomial-redos, quadratic in the file's length on any input that fails to
     match. Reading lines removes the ambiguity rather than hiding it, and keeps the
     two behaviours the old comment was protecting: the terminator is a BLANK LINE
     rather than `$` under /m, and a number may carry a letter suffix ("23b"),
     because the cross-references between concepts are load-bearing. */
  /* `([^`]+?)\s+` was still ambiguous: `[^`]` matches a space, so the title
     capture and the separator could split the same run and the engine had to
     try both. The title is greedy and must END in a non-space now, and the
     separators are `[ \t]` rather than `\s` -- a line cannot hold a newline
     anyway -- so for any position of the em dash there is exactly one match. */
  /* TWO ANCHORED REGEXES, not one with a greedy capture in the middle. Even
     after the lazy quantifier went, `(.*[^\s])[ \t]+\u2014` made the engine search
     for the separator by backtracking `.*`, and CodeQL still read that as
     polynomial. Matching the head and the tail separately and taking the slice
     between them has no alternative paths to explore at all: each regex is
     anchored, and the title is whatever is left. */
  const headHead = /^\*\*(\d+[a-z]?)\.[ \t]+/;
  /* Anchored at BOTH ends. headTail was `/[ \t]+\u2014[ \t]+.../` with only `$`
     anchored, so the engine tried every start position looking for the
     separator, and a run of k spaces gave it k ways to begin -- still
     polynomial, which is what CodeQL kept reporting after the greedy capture
     went. The em dash is located with lastIndexOf, which is linear, and the
     tail is then tested by a regex anchored at both ends. No floating pattern
     is left in this function. */
  const headTail = /^[ \t]+`(COVERED|DEEP|PARTIAL|GAP)`\*\*[ \t]*$/;
  const lines = md.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const a = headHead.exec(line);
    if (!a) continue;
    const dash = line.lastIndexOf('\u2014');
    if (dash <= a[0].length) continue;
    /* The separator must be preceded by whitespace, as the old pattern required. */
    if (!/[ \t]/.test(line[dash - 1] || '')) continue;
    const b = headTail.exec(line.slice(dash + 1));
    if (!b) continue;
    const title = line.slice(a[0].length, dash).trim();
    if (!title) continue;
    const h = [null, a[1], title, b[1]];
    const body = [];
    for (let j = i + 1; j < lines.length && lines[j].trim() !== ''; j += 1) body.push(lines[j]);
    concepts.push({
      num: h[1],
      title: h[2],
      status: h[3],
      demos: parseCitations(body.join('\n')),
    });
  }
  return concepts;
}

function parseCitations(para) {
  // Unwrap hard line breaks first — titles wrap mid-name ("HQC Timing\nBreak").
  /* One unambiguous run. `\s*\r?\n\s*` lets `\s` match the same newline the
     literal does, so the engine has two ways to split every break and backtracks
     polynomially (CodeQL js/polynomial-redos). Collapsing any whitespace run to a
     single space flattens hard line breaks exactly as before. */
  const flat = para.replace(/\s+/g, ' ').trim();
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
  // The file accumulates one note per revision, oldest first, so the CURRENT
  // version is the LAST match — not the first. Reading the first silently
  // reported v6 from v7 onward.
  const all = [...md.matchAll(/^\*Version (\S+?)\s/gm)];
  const v = all.length ? all[all.length - 1] : null;
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

  const total = /\*\*Catalogued total: (\d+)\.\*\*/.exec(md);
  const totalWrong = total && Number(total[1]) !== titles.length;
  if (!total) console.log('No "**Catalogued total: N.**" line found; nothing to compare.');
  else console.log('Catalogued total line: ' + total[1] + (totalWrong ? ' — but there are ' + titles.length + ' cards' : ' (matches)'));

  const errors = dangling.length + unmapped.length + stale.length + (totalWrong ? 1 : 0);
  if (errors && check) {
    console.error('\nconcept-coverage.md out of step with index.html.');
    if (dangling.length) console.error('  Cited-but-no-card: a demo was renamed, or the citation is a typo.');
    if (unmapped.length) console.error('  Carded-but-unmapped: file each new demo under its concept in concept-coverage.md.');
    if (totalWrong) console.error('  "Catalogued total" disagrees with the card count: set it to ' + titles.length + '.');
    process.exit(1);
  }
  if (check) console.log('\nconcept-coverage.md in step with index.html.');
}

if (require.main === module) main();
module.exports = { parseConcepts };
