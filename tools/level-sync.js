#!/usr/bin/env node
/*
 * level-sync.js — stamp each card with its audience level, and keep
 * LEVELS-REVIEW.md generated from the same judgements.
 *
 * Run: node tools/level-sync.js check
 * Prevents: a card shipping with no audience level, or LEVELS-REVIEW.md disagreeing with the levels the page actually filters on
 * Reads: tools/lab-levels.json, index.html's cards and their data-level, and LEVELS-REVIEW.md
 *
 *   node tools/level-sync.js          stamp data-level on every card, write LEVELS-REVIEW.md
 *   node tools/level-sync.js check    exit 1 if a card is unlevelled or anything drifts
 *
 * WHY THIS IS JUDGED AND NOT DERIVED
 *
 * Every other card field with a tool behind it is DERIVED from the lab's source:
 * `catalog-evidence` reads code and will not write a claim it cannot anchor. A
 * level is not that kind of fact. "Could a 14-year-old follow this?" is a reading
 * of what the lab asks of a person, and no scanner answers it — so this file is
 * the same shape as `data-overlaps`, which CLAUDE.md keeps hand-written for the
 * same reason, and the same shape as `catalog-reviewed.json`, which records a
 * person's reading at a pinned commit.
 *
 * What a first pass over keyword signals produced is worth recording, because it
 * is the argument for not trusting one. Matching substrings put `IBE` inside
 * "described" and `Shor` inside "short", quietly promoting school-level labs to
 * advanced; word boundaries fixed that. It then still called four adaptive-
 * steganography labs "classical, arithmetic only" because they mention hiding a
 * message, and it promoted a hash-comparison lab to advanced because SHA-3 is a
 * sponge. Every lab the rules decided on a SINGLE specialist signal was read by
 * hand afterwards, and 14 were overridden. The rule's verdict is kept in
 * `reviewed: "rule"` vs `"hand"` so a reader can see which is which.
 *
 * UNCERTAINTY IS PUBLISHED, NOT HIDDEN
 *
 * Eleven labs carry an `uncertain` note and LEVELS-REVIEW.md lists them FIRST.
 * A level is a judgement that can be wrong, and the honest failure mode is a
 * maintainer disagreeing with a flagged row rather than never seeing it. This is
 * the same rule the teaching layer applies to a citation year: record what is
 * not established rather than publishing it as settled.
 */
'use strict';
const cardReader = require('./card-reader.js');

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');
const PINS = path.join(__dirname, 'lab-levels.json');
const DOC = path.join(ROOT, 'LEVELS-REVIEW.md');

const LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

/* One line each, shown beside the Level filter on the hub. These say what the
   level asks of a READER, which is what the assignment was judged on -- not a
   school year, which the old names implied and which does not travel. */
const BLURBS = {
  beginner: 'no maths beyond arithmetic',
  intermediate: 'comfortable with algebra and basic modular arithmetic',
  advanced: 'expects the underlying maths (groups, fields, lattices)',
};

/* CARD_HEAD is GONE. It was the write-side matcher and the position rule lives in
 * stampTag() below, over the tag the shared reader bounded. */

function pins() {
  return JSON.parse(fs.readFileSync(PINS, 'utf8'));
}


/* Rewrite one card's opening tag, keeping the position rule: the stamped attributes go
 * AFTER the href, because readme-sync and catalog-sync both match
 * `data-category="…" href="…"` adjacent and anything inserted between them takes
 * catalog-sync to "0 cards".
 *
 * This replaces CARD_HEAD for the WRITE, closing the other half of #125. The READ moved
 * to card-reader.js first and the write was deliberately left behind, because a bug in
 * the stamping path silently rewrites every card. Both now share one definition of where
 * a tag ENDS, and that is the whole point: CARD_HEAD's `([^>]*)` tail stopped at the
 * first `>`, so a `>` inside a quoted attribute value — a review note saying `a > b` —
 * ended the tag early, the writer stripped only the truncated part and re-inserted, and
 * the card came out with TWO data-level attributes. That is on record as the eighth
 * instance of "answering from a copy" in CLAUDE.md. It is now impossible here rather
 * than guarded against downstream.
 *
 * Operates on the tag the shared reader bounded, so a `>` in an attribute value cannot
 * truncate it, and rewrites back by offset. */
function stampTag(tag, names, insert) {
  const strip = new RegExp(`\\s+data-(?:${names.join('|')})="[^"]*"`, 'g');
  const stripped = tag.replace(strip, '');
  if (!insert) return stripped;
  const href = /\shref="[^"]*"/.exec(stripped);
  /* No href means the reader already reported it as CARD-HREFLESS and the caller exits
     non-zero; append rather than guess at a position, and change nothing silently. */
  if (!href) return stripped;
  const at = href.index + href[0].length;
  return `${stripped.slice(0, at)}${insert}${stripped.slice(at)}`;
}

/** Apply `rewrite(card)` to every card's opening tag, from the end so offsets hold. */
function rewriteCards(html, cards, rewrite) {
  let out = html;
  for (let i = cards.length - 1; i >= 0; i -= 1) {
    const card = cards[i];
    const next = rewrite(card);
    if (next === card.tag) continue;
    out = out.slice(0, card.tagStart) + next + out.slice(card.tagEnd + 1);
  }
  return out;
}

function stamp(html, labs) {
  const { cards } = cardReader.readCards(html);
  return rewriteCards(html, cards, (card) => {
    const rec = labs[card.slug];
    const level = rec && rec.level ? ` data-level="${rec.level}"` : '';
    return stampTag(card.tag, ['level'], level);
  });
}

function readLevels(html) {
  const out = {};
  /* READ through the shared reader; the WRITE position below keeps CARD_HEAD.
     That split is deliberate rather than discovered (see #125): a bug in the
     stamping path would silently rewrite 232 cards, so it moves on its own.
     Duplicate detection is kept and is now STRONGER -- it counts occurrences in
     a properly bounded opening tag, where CARD_HEAD's `([^>]*)` tail stopped at
     the first `>` and could miss a duplicate past it, which is exactly how a `>`
     in data-review-note produced two data-level attributes in the first place. */
  const read = cardReader.readCards(html);
  if (read.hrefless.length) {
    console.error(cardReader.hreflessLine(read.hrefless));
    process.exit(1);
  }
  for (const card of read.cards) {
    const levels = [...card.tag.matchAll(/data-level="([^"]*)"/g)].map((v) => v[1]);
    out[card.slug] = { level: levels[0] || null, duplicates: levels.length > 1,
      conflicts: new Set(levels).size > 1 };
  }
  return out;
}

function buildDoc(p) {
  const entries = Object.entries(p.labs);
  const flagged = entries.filter(([, v]) => v.uncertain);
  const counts = {};
  for (const [, v] of entries) counts[v.level] = (counts[v.level] || 0) + 1;

  const L = [];
  L.push('# Audience levels — review sheet');
  L.push('');
  L.push('Generated by `node tools/level-sync.js` from `tools/lab-levels.json`. Edit the JSON, never this file.');
  L.push('');
  L.push('Three levels, as the hub filters on them:');
  L.push('');
  L.push('| Level | What it asks of a reader | Typical material |');
  L.push('|---|---|---|');
  L.push(`| \`beginner\` | ${BLURBS.beginner} | historical and classical ciphers, simple visual ideas |`);
  L.push(`| \`intermediate\` | ${BLURBS.intermediate} | hashing, symmetric and asymmetric basics, simple attacks |`);
  L.push(`| \`advanced\` | ${BLURBS.advanced} | lattices, ZK, FHE, MPC, PQC internals, side channels, formal security games |`);
  L.push('');
  L.push(`**Counts:** ${p.levels.map((lv) => `${LABELS[lv]} — ${counts[lv] || 0}`).join(' · ')}. Total ${entries.length}.`);
  L.push('');
  L.push('Each level was read from that lab\'s own README and card copy, never from its name. Where a keyword rule and a reading disagreed, the reading won and the row says `hand`.');
  L.push('');
  L.push(`## Flagged for your review first (${flagged.length})`);
  L.push('');
  L.push('These are the ones I am least sure about. Each is assigned, and each could reasonably go the other way.');
  L.push('');
  L.push('| Lab | Assigned | Why I am unsure |');
  L.push('|---|---|---|');
  for (const [slug, v] of flagged) {
    L.push(`| [${v.title}](https://systemslibrarian.github.io/${slug}/) | \`${v.level}\` | ${v.uncertain} |`);
  }
  L.push('');
  for (const lv of p.levels) {
    const rows = entries.filter(([, v]) => v.level === lv).sort((a, b) => a[1].title.localeCompare(b[1].title));
    L.push(`## ${LABELS[lv]} — \`${lv}\` (${rows.length})`);
    L.push('');
    L.push('| Lab | Source | Reason |');
    L.push('|---|---|---|');
    for (const [slug, v] of rows) {
      L.push(`| [${v.title}](https://systemslibrarian.github.io/${slug}/) | ${v.reviewed} | ${v.why}${v.uncertain ? ' **(flagged)**' : ''} |`);
    }
    L.push('');
  }
  return L.join('\n') + '\n';
}

function main() {
  const check = process.argv[2] === 'check';
  const p = pins();
  const html = fs.readFileSync(INDEX, 'utf8');
  const onCards = readLevels(html);
  const slugs = Object.keys(onCards);

  if (check) {
    const problems = [];
    for (const slug of slugs) {
      const pin = p.labs[slug];
      if (!pin) { problems.push(`${slug} — carded, absent from tools/lab-levels.json`); continue; }
      if (!p.levels.includes(pin.level)) problems.push(`${slug} — level "${pin.level}" is not one of ${p.levels.join(', ')}`);
      const card = onCards[slug];
      if (card.duplicates) problems.push(`${slug} — ${card.conflicts ? 'conflicting' : 'duplicate'} level attributes`);
      if (card.level !== pin.level) problems.push(`${slug} — card says ${card.level || 'no level'}, pin says ${pin.level}`);
    }
    for (const slug of Object.keys(p.labs)) {
      if (!slugs.includes(slug)) problems.push(`${slug} — levelled, but no card links to it`);
    }
    const want = buildDoc(p);
    if (!fs.existsSync(DOC) || fs.readFileSync(DOC, 'utf8') !== want) {
      problems.push('LEVELS-REVIEW.md differs from the levels in tools/lab-levels.json');
    }
    const counts = {};
    for (const v of Object.values(p.labs)) counts[v.level] = (counts[v.level] || 0) + 1;
    console.log(`Cards levelled: ${slugs.length} | ${p.levels.map((l) => `${l}=${counts[l] || 0}`).join(' ')}`);
    const flagged = Object.values(p.labs).filter((v) => v.uncertain).length;
    if (flagged) console.log(`Flagged for review: ${flagged} — listed first in LEVELS-REVIEW.md`);
    if (problems.length) {
      console.log(`\nDRIFT (${problems.length}) — fix with: node tools/level-sync.js`);
      for (const x of problems) console.log(`  ${x}`);
      return 1;
    }
    console.log('\nEvery card carries a level, and the review sheet matches it.');
    return 0;
  }

  const next = stamp(html, p.labs);
  if (next !== html) fs.writeFileSync(INDEX, next);
  fs.writeFileSync(DOC, buildDoc(p));
  const counts = {};
  for (const v of Object.values(p.labs)) counts[v.level] = (counts[v.level] || 0) + 1;
  console.log(`Levelled ${Object.keys(readLevels(next)).length} cards. index.html ${next !== html ? 'rewritten' : 'already in step'}.`);
  console.log(p.levels.map((l) => `  ${LABELS[l]}: ${counts[l] || 0}`).join('\n'));
  console.log(`LEVELS-REVIEW.md written (${Object.values(p.labs).filter((v) => v.uncertain).length} flagged).`);
  return 0;
}

module.exports = { stamp, readLevels };
if (require.main === module) process.exit(main());
