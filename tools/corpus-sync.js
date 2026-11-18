#!/usr/bin/env node
/*
 * corpus-sync.js — keep the crypto-counsel RAG corpus in step with this catalog.
 *
 * Run: node tools/corpus-sync.js check
 * Prevents: a demo staying invisible to the crypto-counsel chatbot, or the one record describing the whole catalog to it drifting from the catalog
 * Reads: index.html hrefs and cards; README.md's readme-sync:all-demos block; corpus.json from $CRYPTO_COUNSEL_CORPUS, ../crypto-counsel-1/ or ../crypto-counsel/; gen: ../crypto-lab-<slug>/README.md
 *
 * The crypto-counsel chatbot embeds a snapshot of crypto-lab demo cards in its
 * corpus.json (entries with id "demo_crypto_lab_<slug>"). That snapshot does NOT
 * update itself, so every time a demo is added here it must also be added there.
 *
 * Usage (run from the crypto-lab repo root):
 *   node tools/corpus-sync.js check ["<path-to-corpus.json>"]
 *       Report which catalog demos are missing from / stale in the corpus.
 *
 *   node tools/corpus-sync.js gen <slug> "<Title>"
 *       Print a corpus-entry skeleton for one demo, seeded from that demo's
 *       README, ready to refine and append. The prose sections marked TODO
 *       must be written by hand (grounded in the README) before appending —
 *       do not append TODO text to the live corpus.
 *
 *   node tools/corpus-sync.js overview [--write] ["<path-to-corpus.json>"]
 *       Print the `crypto_lab_readme` All Demos block derived from this
 *       repository's own README, or splice it into the corpus with --write.
 *
 * Corpus location: pass it as the 2nd arg to `check`, or set CRYPTO_COUNSEL_CORPUS,
 * else the script probes sibling clones ../crypto-counsel-1 then ../crypto-counsel.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const SIBLINGS = path.join(REPO_ROOT, '..');

function findCorpus(explicit) {
  const candidates = [
    explicit,
    process.env.CRYPTO_COUNSEL_CORPUS,
    path.join(SIBLINGS, 'crypto-counsel-1', 'corpus.json'),
    path.join(SIBLINGS, 'crypto-counsel', 'corpus.json'),
  ].filter(Boolean);
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function catalogSlugs() {
  const html = fs.readFileSync(path.join(REPO_ROOT, 'index.html'), 'utf8');
  const slugs = new Set();
  const re = /crypto-lab-([a-z0-9-]+)\//g;
  let m;
  while ((m = re.exec(html)) !== null) slugs.add(m[1]);
  slugs.delete('2026'); // the Cybersecurity Excellence Awards URL, not a demo
  return slugs;
}

function corpusSlugs(corpusPath) {
  const arr = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));
  return new Set(
    arr
      .map((e) => String(e.id || ''))
      .filter((id) => id.startsWith('demo_crypto_lab_'))
      .map((id) => id.replace('demo_crypto_lab_', '').replace(/_/g, '-'))
  );
}

/* Fields every demo record must carry, and which a slug-set comparison cannot
 * see. `reviewed` records when the prose was last checked against its lab, with
 * null meaning never; crypto-counsel's scripts/validate.mjs fails without it.
 * Kept here as data so the list can grow without touching the walk. */
const REQUIRED_DEMO_FIELDS = ['id', 'text', 'reviewed'];

/** `<id> missing <field>` for every demo record that is short one. */
function missingFieldsIn(records) {
  const out = [];
  for (const e of records) {
    const id = String((e && e.id) || '');
    if (!id.startsWith('demo_')) continue;
    for (const f of REQUIRED_DEMO_FIELDS) {
      if (!(f in e)) out.push(`${id} missing ${f}`);
    }
  }
  return out.sort();
}

function missingFields(corpusPath) {
  return missingFieldsIn(JSON.parse(fs.readFileSync(corpusPath, 'utf8')));
}

/* ---------------------------------------------------------------------------
 * The record that describes the WHOLE catalog, rather than one demo.
 *
 * corpus.json carries one `crypto_lab_readme` entry whose "All Demos:" list is
 * the chatbot's only view of what the catalog contains. It was hand-kept, and
 * on 2026-11-17 36 of its 258 lines named chips their card does not carry and
 * one named the wrong kicker, while every slug-level check above it stayed
 * green: a set comparison cannot see what a line SAYS, only that it is there.
 *
 * So the block is derived rather than written, and from the README's generated
 * all-demos rows rather than from the cards directly. Both are available and
 * the README is the better source for exactly one reason: `readme-sync check`
 * already fails when those rows disagree with the cards, so reading them makes
 * this record agree with the cards THROUGH a link something else is already
 * guarding. Re-reading the cards here would add a second, unguarded path to the
 * same facts, which is how the two copies came apart in the first place.
 *
 * The kicker is the exception, and it is read from the card. The all-demos
 * table has no kicker column -- it prints Exhibit, Description, Source and
 * Primitives -- so there is nothing in the README to copy. It comes through
 * `card-reader.js`, the same reader `readme-sync` itself uses, so the two
 * cannot disagree about which card is which.
 *
 * Chips are copied as the README's Primitives CELL, separator included, not
 * re-joined with ", ". The old record re-joined them and `What Is PQC` is the
 * case that proves the cost: its chip `Size, Not Strength` contains a comma, so
 * the line read as five chips where the card carries four, and nothing could
 * tell the comma inside a chip from the comma between two.
 *
 * Only the "All Demos:" block is derived. "Related Projects:" is NOT, and that
 * is a decision rather than an omission: the README writes Crypto Compare as
 * https://systemslibrarian.github.io/crypto-compare/, and crypto-counsel's own
 * validate.mjs fails any github.io URL in corpus prose that is not the live
 * site of a corpus DEMO -- which that is not. Copying those four lines verbatim
 * would turn this repository's green run into a red one next door.
 */
const REFERENCE_DOC_ID = 'crypto_lab_readme';
const SECTIONS_HEADING = 'Catalog sections:';
const LEGACY_HEADING = 'All Demos:';
const RELATED_HEADING = 'Related Projects:';
const DEMO_BEGIN = 'readme-sync:all-demos:begin';
const DEMO_END = 'readme-sync:all-demos:end';
const CATALOG_URL = 'https://crypto-lab.systemslibrarian.dev/';

/* crypto-counsel truncates a retrieved document at MAX_DOCUMENT = 10000 chars
 * in index.html's getContext(), appending an "[Incomplete excerpt]" warning.
 * The single All Demos record was 25,619 chars, so about 96 of its 258 lines
 * ever reached the model and every demo after Symmetric Encryption was cut --
 * the record that exists to say what the catalog CONTAINS was answering about
 * the first third of it. One record per README section fixes that, and the cap
 * is checked here rather than hoped for.
 *
 * 9000 rather than 10000 is margin, and the margin is doing a specific job:
 * MAX_DOCUMENT caps ONE document, while MAX_CONTEXT = 24000 is shared across
 * up to five retrieved documents, so the third or later document can be handed
 * less than 10000. 9000 keeps a section record whole wherever MAX_DOCUMENT is
 * the binding limit and leaves room for the catalog to grow; it is NOT a
 * promise that a record is never truncated in a crowded context, which is a
 * property of the context and not of the record. */
const RETRIEVAL_MAX_DOCUMENT = 10000;
const RECORD_CAP = 9000;

/* The README's generated demo rows, grouped by its own `### <label>` headings
 * and in its own order. Returns null rather than a short list when the block,
 * a heading or a row cannot be read: a partial parse would delete lines from a
 * record and call it a sync. */
function readmeSectionRows(readme) {
  const b = readme.indexOf(DEMO_BEGIN);
  const e = readme.indexOf(DEMO_END);
  if (b === -1 || e === -1 || e < b) return null;
  const out = [];
  let current = null;
  for (const line of readme.slice(b, e).split('\n')) {
    const heading = /^### (.+)$/.exec(line);
    if (heading) {
      current = { label: heading[1].trim(), rows: [] };
      out.push(current);
      continue;
    }
    if (!line.startsWith('| [')) continue;
    if (!current) return null; // a row outside any section heading
    const cells = line.split('|');
    // | Exhibit | Description | Source | Primitives | -> 6 with the empty ends
    if (cells.length !== 6) return null;
    const name = /^\s*\[([^\]]+)\]/.exec(cells[1]);
    if (!name) return null;
    current.rows.push({ name: name[1].trim(), primitives: cells[4].trim() });
  }
  if (!out.length || out.some((s) => !s.rows.length)) return null;
  return out;
}

/* The page's own SECTIONS literal: id and label, in curriculum order. The id is
 * what the corpus record is named after, never the label -- a label can be
 * reworded (and has been) while a corpus id is a schema the sibling repo's
 * validator and link rules both key on. */
function catalogSections(html) {
  const start = html.indexOf('var SECTIONS = [');
  if (start === -1) return null;
  const end = html.indexOf('];', start);
  if (end === -1) return null;
  const out = [];
  const body = html.slice(start, end);
  const re = /\{\s*id:\s*'([^']+)'\s*,\s*label:\s*'([^']+)'\s*\}/g;
  let m;
  while ((m = re.exec(body)) !== null) out.push({ id: m[1], label: m[2] });
  return out.length ? out : null;
}

/** 'post-quantum' -> 'crypto_lab_post_quantum_readme'. */
function sectionDocId(sectionId) {
  return 'crypto_lab_' + sectionId.replace(/-/g, '_') + '_readme';
}

/* Title -> kicker, through the shared card reader and its shared decoder, so
   this agrees with what `readme-sync` put in the row by construction rather
   than by two regexes happening to match. A card the reader cannot place is
   returned as null, never skipped: a dropped card would quietly shorten a
   record and the shorter record would then be what `check` calls correct. */
function cardKickers(html) {
  const { readCards, decode } = require('./card-reader.js');
  const { cards, hrefless } = readCards(html);
  if (hrefless.length) return null;
  const map = new Map();
  for (const c of cards) {
    const k = /class="card-kicker">([^<]+)</.exec(c.block);
    map.set(decode(c.title), k ? decode(k[1].trim()) : '');
  }
  return map;
}

/* One `- Name: Kicker — Chips` line per row.
 *
 * Both the cards and the README carry these facts, and the README is the
 * better source for one reason: `readme-sync check` already fails when those
 * rows disagree with the cards, so reading them makes these records agree with
 * the cards THROUGH a link something else is already guarding. Re-reading the
 * cards here would add a second, unguarded path to the same facts, which is
 * how the hand-kept copy came apart -- 36 of its 258 lines named chips their
 * card does not carry.
 *
 * The kicker is the exception and comes from the card: the all-demos table
 * prints Exhibit, Description, Source and Primitives, so there is nothing in
 * the README to copy.
 *
 * Chips are copied as the README's Primitives CELL, separator included, not
 * re-joined with ", ". `What Is PQC` is the case that proves the cost: its
 * chip `Size, Not Strength` contains a comma, so a re-joined line read as five
 * chips where the card carries four, and nothing could tell the comma inside a
 * chip from the comma between two. */
function demoLines(rows, kickers) {
  const lines = [];
  for (const r of rows) {
    if (!kickers.has(r.name)) return null; // a row with no card: refuse, do not guess
    const k = kickers.get(r.name);
    lines.push('- ' + r.name + (k ? ': ' + k : '') + ' \u2014 ' + r.primitives);
  }
  return lines;
}

/* Replace the lines between two headings, leaving every other byte alone. The
 * start fence accepts the legacy `All Demos:` heading as well as the current
 * one, so the first run after the split migrates the parent record and every
 * run after it is idempotent. */
function spliceBetween(text, startHeadings, endHeading, heading, lines) {
  const src = text.split('\n');
  let at = -1;
  for (const h of startHeadings) {
    at = src.indexOf(h);
    if (at !== -1) break;
  }
  if (at === -1) return null;
  const end = src.indexOf(endHeading, at + 1);
  if (end === -1) return null;
  return [...src.slice(0, at), heading, ...lines, '', ...src.slice(end)].join('\n');
}

/** The whole record family: the parent index, then one record per section. */
function overviewFamily(readme, html) {
  const sections = readmeSectionRows(readme);
  const declared = catalogSections(html);
  const kickers = cardKickers(html);
  if (!sections || !declared || !kickers) return null;
  /* The README's headings are readme-sync's own rendering of SECTIONS, so they
     must line up exactly. If they do not, the id this record is named after
     cannot be established and the run refuses rather than guessing a name. */
  if (sections.length !== declared.length) return null;
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].label !== declared[i].label) return null;
  }

  const total = sections.reduce((n, s) => n + s.rows.length, 0);
  const index = sections.map((s, i) =>
    `- ${s.label} (${s.rows.length} demos): ${sectionDocId(declared[i].id)}`);
  index.push(`- ${total} demos in ${sections.length} records, listed in the catalog's own order.`);

  const out = [{ id: REFERENCE_DOC_ID, index }];
  for (let i = 0; i < sections.length; i++) {
    const lines = demoLines(sections[i].rows, kickers);
    if (!lines) return null;
    const label = sections[i].label;
    out.push({
      id: sectionDocId(declared[i].id),
      text: [
        `Project: Crypto Lab \u2014 ${label}`,
        `URL: ${CATALOG_URL}#section-${declared[i].id}`,
        `Part of: ${REFERENCE_DOC_ID}, which indexes every section of the catalog.`,
        '',
        `Demos in ${label} (${lines.length}):`,
        ...lines,
        '',
        'One record per catalog section, because a single record listing all of',
        'them was longer than the retrieval limit and was being cut off partway',
        'through. Each demo has its own corpus entry with the full description;',
        'these lines are the section index.',
      ].join('\n'),
    });
  }
  return out;
}

/** Records over the retrieval cap, as `<id> is N chars (cap M)`. */
function overCap(records) {
  return records
    .filter((r) => r.text.length > RECORD_CAP)
    .map((r) => `${r.id} is ${r.text.length} chars (cap ${RECORD_CAP}, retrieval truncates at ${RETRIEVAL_MAX_DOCUMENT})`);
}

/** The family as it should be, given the corpus's current parent record. */
function wantedFamily(corpus, readme, html) {
  const family = overviewFamily(readme, html);
  if (!family) return null;
  const parent = corpus.find((e) => e && e.id === REFERENCE_DOC_ID);
  if (!parent) return null;
  const text = spliceBetween(parent.text, [SECTIONS_HEADING, LEGACY_HEADING],
    RELATED_HEADING, SECTIONS_HEADING, family[0].index);
  if (text === null) return null;
  return [{ id: REFERENCE_DOC_ID, text }, ...family.slice(1)];
}

/** [] when every record in the family is the derived one and under the cap. */
function overviewDrift(corpusPath, readme, html) {
  const corpus = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));
  if (!corpus.find((e) => e && e.id === REFERENCE_DOC_ID)) {
    return [`corpus has no ${REFERENCE_DOC_ID} record`];
  }
  const want = wantedFamily(corpus, readme, html);
  if (!want) return ['could not derive the catalog overview records from README.md and index.html'];
  const out = [];
  const have = new Map(corpus.filter((e) => e && typeof e.id === 'string').map((e) => [e.id, e.text]));
  for (const r of want) {
    if (!have.has(r.id)) { out.push(`${r.id} is missing from the corpus`); continue; }
    if (have.get(r.id) === r.text) continue;
    const a = String(have.get(r.id)).split('\n');
    const b = r.text.split('\n');
    if (a.length !== b.length) out.push(`${r.id} has ${a.length} lines, the catalog gives ${b.length}`);
    /* Say WHICH kind of difference this is before listing lines. A record
       holding every right line in the wrong order differs on nearly every line
       and has no wrong fact in it; one in the right order with a wrong chip
       differs on one. The bare count cannot tell those apart. */
    if ([...a].sort().join('\n') === [...b].sort().join('\n')) {
      out.push(`${r.id}: every line is right and the ORDER is not the catalog's`);
    }
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] !== b[i]) out.push(`${r.id} line ${i + 1}: record "${a[i]}" / catalog "${b[i]}"`);
    }
  }
  /* A record that is correct and too long is still a defect: the reader never
     sees its tail. Checked over what the corpus HOLDS, not only over what this
     tool would write, so a record someone lengthens by hand is caught too. */
  out.push(...overCap(want.map((r) => ({ id: r.id, text: have.get(r.id) ?? r.text }))));
  return out;
}

function cmdOverview(args) {
  const write = args.includes('--write');
  const explicit = args.find((x) => x && !x.startsWith('--'));
  const readme = fs.readFileSync(path.join(REPO_ROOT, 'README.md'), 'utf8');
  const html = fs.readFileSync(path.join(REPO_ROOT, 'index.html'), 'utf8');
  const corpusPath = findCorpus(explicit);
  if (!corpusPath) {
    console.error('Could not locate crypto-counsel corpus.json. Pass a path or set CRYPTO_COUNSEL_CORPUS.');
    process.exit(2);
  }
  const raw = fs.readFileSync(corpusPath, 'utf8');
  const corpus = JSON.parse(raw);
  const want = wantedFamily(corpus, readme, html);
  if (!want) {
    console.error('Could not derive the overview records. Run node tools/readme-sync.js check first,');
    console.error(`and confirm ${REFERENCE_DOC_ID} still has its "${RELATED_HEADING}" heading.`);
    process.exit(2);
  }
  const over = overCap(want);
  if (over.length) {
    console.error('Refusing to write: a generated record is over the retrieval cap.');
    for (const o of over) console.error('  ' + o);
    process.exit(1);
  }
  if (!write) {
    for (const r of want) console.log(`----- ${r.id} (${r.text.length} chars) -----\n${r.text}`);
    return;
  }

  let changed = 0;
  let added = 0;
  const parentAt = corpus.findIndex((e) => e && e.id === REFERENCE_DOC_ID);
  for (const r of want) {
    const at = corpus.findIndex((e) => e && e.id === r.id);
    if (at === -1) {
      /* A new section record goes directly after the parent that indexes it,
         so the family reads together in the file and a diff stays local. */
      corpus.splice(parentAt + 1 + added, 0, { id: r.id, text: r.text });
      added++;
      continue;
    }
    if (corpus[at].text === r.text) continue;
    corpus[at].text = r.text;
    changed++;
  }
  if (!changed && !added) { console.log('Already in step; corpus.json not touched.'); return; }
  /* corpus.json is minified, one line, no trailing newline, and it is read back
     byte for byte by a guard next door. JSON.stringify with no spacing is that
     shape; anything that pretty-prints or escapes non-ASCII rewrites ~1MB of
     someone else's file to say the same thing. */
  fs.writeFileSync(corpusPath, JSON.stringify(corpus));
  console.log(`Wrote ${changed} changed and ${added} new record(s) into ${corpusPath}`);
  for (const r of want) console.log(`  ${r.id}  ${r.text.length} chars`);
}

/* ---------------------------------------------------------------------------
 * Byte-faithful JSON.
 *
 * Every data file below is written by a tool with JSON.stringify and read back
 * byte for byte by a guard. Python's json.dumps defaults ensure_ascii=TRUE, so
 * one hand edit in Python rewrites every non-ASCII character as a \uXXXX
 * escape -- same JSON, different bytes, and the byte-faithfulness guard fails
 * somewhere else entirely. It has happened twice: `catalog-reviewed.json` was
 * escaped that way once before, and 2,743 escapes went into
 * `../crypto-counsel/corpus.json` during the 2026-11-17 record split and were
 * caught only by diffing the raw bytes against HEAD.
 *
 * The rule asks each file to be exactly what JSON.stringify would produce for
 * its OWN shape -- indentation and trailing newline are detected from the file
 * rather than declared, because these files disagree about both (corpus.json is
 * minified with no trailing newline; lab-dates.json uses one space; most use
 * two). So the check adapts to the file and still fails on an escape, because
 * JSON.stringify never escapes a printable non-ASCII character.
 *
 * On its first run it found `tools/catalog-chip-exempt.json` carrying four
 * \u2014 em dashes, which is this defect sitting in the tree. */
const BYTE_FAITHFUL_JSON = [
  'tools/catalog-reviewed.json',
  'tools/catalog-exhibits.json',
  'tools/catalog-chip-exempt.json',
  'tools/lab-dates.json',
  'tools/playwright-ports.json',
  'tools/dispatch-census.json',
  'tools/non-exhibit-repos.json',
  'tools/clone-holds.json',
  'knowledge-map/catalog.json',
];

/** The indentation and trailing newline a file already uses. */
function jsonShape(raw) {
  const m = /^[[{]\n([ \t]+)/.exec(raw);
  return { indent: m ? m[1].length : 0, trailingNewline: raw.endsWith('\n') };
}

/**
 * null when `raw` is exactly JSON.stringify's output for its own shape;
 * otherwise a message naming the file, the first differing byte and both sides.
 */
function jsonFaithfulIn(label, raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return `${label} is not valid JSON: ${e.message}`;
  }
  const shape = jsonShape(raw);
  const want = JSON.stringify(parsed, null, shape.indent) + (shape.trailingNewline ? '\n' : '');
  if (want === raw) return null;
  let i = 0;
  while (i < Math.min(raw.length, want.length) && raw[i] === want[i]) i++;
  const escapes = (raw.match(/\\u[0-9a-fA-F]{4}/g) || []).length;
  const hint = escapes
    ? ` It carries ${escapes} \\uXXXX escape(s), which is what Python's json.dumps writes by default — re-serialise with JSON.stringify.`
    : '';
  return `${label} is not byte-identical to JSON.stringify(…, null, ${shape.indent})`
    + ` — first difference at byte ${i}: file ${JSON.stringify(raw.slice(i, i + 24))}`
    + ` vs canonical ${JSON.stringify(want.slice(i, i + 24))}.${hint}`;
}

/** Every declared JSON file that is not byte-faithful, named. */
function jsonUnfaithful(repoRoot, corpusPath) {
  const out = [];
  const files = [...BYTE_FAITHFUL_JSON.map((f) => [f, path.join(repoRoot, f)])];
  if (corpusPath) files.push([corpusPath, corpusPath]);
  for (const [label, abs] of files) {
    if (!fs.existsSync(abs)) continue; // an absent optional file is not a finding
    const bad = jsonFaithfulIn(label, fs.readFileSync(abs, 'utf8'));
    if (bad) out.push(bad);
  }
  return out;
}

function cmdCheck(explicit) {
  const corpusPath = findCorpus(explicit);
  if (!corpusPath) {
    console.error('Could not locate crypto-counsel corpus.json. Pass a path or set CRYPTO_COUNSEL_CORPUS.');
    process.exit(2);
  }
  const cat = catalogSlugs();
  const cor = corpusSlugs(corpusPath);
  const missing = [...cat].filter((s) => !cor.has(s)).sort();
  const stale = [...cor].filter((s) => !cat.has(s)).sort();
  /* Slug parity was the only question this asked, so a record could be present,
     counted and still be invalid. It was: six demo records carried no `reviewed`
     field at all, which crypto-counsel's own validator requires, and this check
     reported `Missing from corpus (0)` throughout. A set comparison cannot see
     a field, so the field is asked about separately. */
  const incomplete = missingFields(corpusPath);
  /* And one record is not a demo at all: `crypto_lab_readme` is the chatbot's
     only account of what the catalog CONTAINS. Slug parity says nothing about
     it -- it carries no slugs -- so it is asked about on its own terms. */
  const readme = fs.readFileSync(path.join(REPO_ROOT, 'README.md'), 'utf8');
  const html = fs.readFileSync(path.join(REPO_ROOT, 'index.html'), 'utf8');
  const overview = overviewDrift(corpusPath, readme, html);
  /* And every one of these files must still be the bytes its writer produced. */
  const unfaithful = jsonUnfaithful(REPO_ROOT, corpusPath);
  console.log('Corpus:', corpusPath);
  console.log('Catalog demos:', cat.size, '| Corpus demo entries:', cor.size);
  console.log('Missing from corpus (' + missing.length + '):', JSON.stringify(missing));
  console.log('Stale in corpus (' + stale.length + '):', JSON.stringify(stale));
  console.log('Records missing a required field (' + incomplete.length + '):',
    JSON.stringify(incomplete.slice(0, 12)));
  if (incomplete.length > 12) console.log('  ...and ' + (incomplete.length - 12) + ' more');
  console.log('Catalog overview record drifted (' + overview.length + '):',
    JSON.stringify(overview.slice(0, 6)));
  if (overview.length > 6) console.log('  ...and ' + (overview.length - 6) + ' more');
  if (overview.length) console.log('  Fix with: node tools/corpus-sync.js overview --write');
  console.log('JSON files not byte-faithful (' + unfaithful.length + '):');
  for (const u of unfaithful) console.log('  ' + u);
  process.exit(missing.length || stale.length || incomplete.length || overview.length || unfaithful.length ? 1 : 0);
}

/* Offline test of the required-field rule, on synthetic records: no corpus, no
 * clones, no network. The rule exists because a slug-set comparison reported
 * `Missing from corpus (0)` while six records were short a field the sibling
 * repository's validator requires, so the control that matters is the one that
 * FAILS without the check -- a record present, slug-correct, and incomplete. */
function cmdSelftest() {
  const fail = [];
  let pass = 0;
  const ok = (cond, what) => { if (cond) { pass++; console.log('  ok  ' + what); } else fail.push(what); };

  const complete = { id: 'demo_crypto_lab_example', text: 'x', reviewed: null };
  const noReviewed = { id: 'demo_crypto_lab_example', text: 'x' };
  const reviewedObject = { id: 'demo_crypto_lab_example', text: 'x', reviewed: { lab_commit: 'abc' } };
  const notADemo = { id: 'aes256gcm', text: 'x' };

  ok(missingFieldsIn([complete]).length === 0,
    'a record with id, text and reviewed is complete');
  ok(missingFieldsIn([reviewedObject]).length === 0,
    'reviewed may be an object as well as null -- the rule asks for PRESENCE, not a value');
  ok(missingFieldsIn([notADemo]).length === 0,
    'a non-demo entry is not held to the demo fields');

  /* THE CONTROL. This is the real defect: six records looked exactly like this
     and the old check reported zero problems. */
  const found = missingFieldsIn([noReviewed]);
  ok(found.length === 1 && found[0] === 'demo_crypto_lab_example missing reviewed',
    'a demo record with no reviewed field is named, field included');

  ok(missingFieldsIn([complete, noReviewed]).length === 1,
    'one incomplete record among complete ones is still found');

  /* MUTATION: drop `reviewed` from the required list and the control above goes
     quiet, which is precisely the state this rule was added to end. */
  const shortened = REQUIRED_DEMO_FIELDS.filter((f) => f !== 'reviewed');
  const underMutation = [];
  for (const f of shortened) if (!(f in noReviewed)) underMutation.push(f);
  ok(underMutation.length === 0 && found.length === 1,
    'MUTATION: without reviewed in the required list the same record passes');


  /* --- the catalog overview records -------------------------------------
     Synthetic README and page, so this says nothing about the real catalog and
     needs neither it nor a corpus to run. */
  const README = [
    'intro',
    '<!-- readme-sync:all-demos:begin -->',
    '',
    '### Foundations',
    '',
    '| Exhibit | Description | Source | Primitives |',
    '|---|---|---|---|',
    '| [Alpha](https://systemslibrarian.github.io/crypto-lab-a/) | does a thing | [crypto-lab-a](https://g/a) | AES-GCM \u00b7 HKDF |',
    '',
    '### Post-Quantum',
    '',
    '| Exhibit | Description | Source | Primitives |',
    '|---|---|---|---|',
    '| [Beta](https://systemslibrarian.github.io/crypto-lab-b/) | does another | [crypto-lab-b](https://g/b) | Size, Not Strength |',
    '<!-- readme-sync:all-demos:end -->',
    'outro',
  ].join('\n');
  const PAGE =
    "var SECTIONS = [{ id: 'foundations', label: 'Foundations' }," +
    " { id: 'post-quantum', label: 'Post-Quantum' }];\n" +
    '<a class="project-card" data-category="X" href="https://systemslibrarian.github.io/crypto-lab-a/">' +
    '<div class="card-kicker">Kick A</div><div class="project-title">Alpha</div>' +
    '<div class="project-copy">c</div><span class="chip">AES-GCM</span></a>' +
    '<a class="project-card" data-category="X" href="https://systemslibrarian.github.io/crypto-lab-b/">' +
    '<div class="card-kicker">Kick B</div><div class="project-title">Beta</div>' +
    '<div class="project-copy">c</div><span class="chip">Size, Not Strength</span></a>';

  const fam = overviewFamily(README, PAGE);
  ok(fam && fam.length === 3, 'one parent record plus one per README section');
  ok(fam && fam[1].id === 'crypto_lab_foundations_readme' &&
     fam[2].id === 'crypto_lab_post_quantum_readme',
    'a record is named after the SECTIONS id, not the label');
  ok(fam && fam[1].text.includes('- Alpha: Kick A \u2014 AES-GCM \u00b7 HKDF'),
    "a line is name, kicker from the card, and the README's Primitives cell");

  /* THE CASE THAT MOTIVATED THE SEPARATOR. One chip contains a comma, so a
     line re-joined with ", " cannot be read back as one chip. */
  ok(fam && fam[2].text.includes('- Beta: Kick B \u2014 Size, Not Strength'),
    'a chip containing a comma survives as ONE chip');
  ok(fam && !fam[1].text.includes('Beta') && !fam[2].text.includes('Alpha'),
    'a demo appears in its own section record and in no other');
  ok(fam && fam[0].index.some((l) => l.includes('Foundations (1 demos)')) &&
     fam[0].index.some((l) => l.includes('crypto_lab_post_quantum_readme')),
    'the parent indexes each section by name, count and record id');

  ok(overviewFamily(README.replace('readme-sync:all-demos:begin', 'x'), PAGE) === null,
    'no all-demos block: refuse, rather than emit empty records');
  ok(overviewFamily(README, PAGE.replace('>Alpha<', '>Gamma<')) === null,
    'a README row with no card: refuse, rather than drop the line');
  ok(overviewFamily(README, PAGE.replace("label: 'Post-Quantum'", "label: 'Quantum'")) === null,
    'a README heading that is not the page\'s own SECTIONS label: refuse, rather than guess the record id');

  const REC = ['Project: Crypto Lab', '', 'All Demos:', '- stale line', '',
    'Related Projects:', '- something', '', 'tail paragraph'].join('\n');
  const spliced = spliceBetween(REC, [SECTIONS_HEADING, LEGACY_HEADING],
    RELATED_HEADING, SECTIONS_HEADING, ['- one']);
  ok(spliced === ['Project: Crypto Lab', '', 'Catalog sections:', '- one', '',
    'Related Projects:', '- something', '', 'tail paragraph'].join('\n'),
    'the parent splice replaces the demo block, renames the heading, and leaves Related Projects alone');
  ok(spliceBetween(spliced, [SECTIONS_HEADING, LEGACY_HEADING], RELATED_HEADING,
    SECTIONS_HEADING, ['- one']) === spliced,
    'splicing the migrated record again is a no-op, so the writer is idempotent');
  ok(spliceBetween(REC, ['Nothing:'], RELATED_HEADING, SECTIONS_HEADING, ['- one']) === null,
    'a record with no such heading is refused, not appended to');

  /* MUTATION 1: re-join the chips with ", ", which is what the hand-kept record
     did. The Beta line then reads as two chips, so the comparison must see it. */
  const rejoined = fam[2].text.replace(' \u00b7 ', ', ');
  ok(rejoined !== fam[2].text || !fam[2].text.includes(' \u00b7 '),
    'MUTATION: chips re-joined with ", " produce a different record text');

  /* MUTATION 2: push one record over the cap. This is the defect the split
     exists to end -- a record longer than crypto-counsel's MAX_DOCUMENT is
     truncated on retrieval, and the reader never sees its tail. The check must
     fail on size even when every line in it is correct. */
  ok(overCap(fam.slice(1)).length === 0, 'the synthetic section records are under the cap');
  const bloated = [{ id: 'crypto_lab_foundations_readme', text: 'x'.repeat(RECORD_CAP + 1) }];
  const overFound = overCap(bloated);
  ok(overFound.length === 1 && overFound[0].startsWith('crypto_lab_foundations_readme is ' + (RECORD_CAP + 1)),
    'MUTATION: a record one char over the cap is named, with its size and the cap');
  ok(overCap([{ id: 'x', text: 'x'.repeat(RECORD_CAP) }]).length === 0,
    'a record exactly at the cap is not over it');
  ok(RECORD_CAP < RETRIEVAL_MAX_DOCUMENT,
    'the cap leaves margin under the retrieval limit it exists to respect');

  /* --- byte-faithful JSON --------------------------------------------- */
  const faithful2 = '[\n  {\n    "a": "em \u2014 dash"\n  }\n]\n';
  ok(jsonFaithfulIn('two-space.json', faithful2) === null,
    'a two-space file that matches JSON.stringify passes');
  ok(jsonFaithfulIn('minified.json', '[{"a":"em \u2014 dash"}]') === null,
    'a minified file with no trailing newline passes, because the shape is read off the file');
  ok(jsonFaithfulIn('one-space.json', '{\n "a": 1\n}\n') === null,
    'one-space indentation passes too -- lab-dates.json and playwright-ports.json use it');

  /* THE MUTATION. One character escaped the way Python's json.dumps escapes it.
     The JSON still parses and still means the same thing; only the bytes moved,
     which is exactly why nothing else catches it. */
  const escaped = faithful2.replace('\u2014', '\\u2014');
  ok(JSON.stringify(JSON.parse(escaped)) === JSON.stringify(JSON.parse(faithful2)),
    'the escaped file parses to the SAME value, so a JSON-level comparison cannot see it');
  const caught = jsonFaithfulIn('tools/catalog-chip-exempt.json', escaped);
  ok(caught !== null && caught.startsWith('tools/catalog-chip-exempt.json is not byte-identical'),
    'MUTATION: one escaped character fails the check, naming the file');
  ok(caught !== null && caught.includes("json.dumps"),
    'and the message names the cause, so the reader knows to re-serialise rather than hand-edit');
  ok(jsonFaithfulIn('broken.json', '{not json') !== null,
    'an unparseable file is a finding, not a skip');
  ok(jsonFaithfulIn('reordered.json', '[\n  {\n    "b": 1,\n    "a": 2\n  }\n]\n') === null,
    'key ORDER is preserved by JSON.stringify, so a file is judged as written rather than re-sorted');

  for (const f of fail) console.error('  FAIL ' + f);
  console.log(`${pass} passed, ${fail.length} failed`);
  return fail.length ? 1 : 0;
}

function cmdGen(slug, title) {
  if (!slug || !title) {
    console.error('Usage: node tools/corpus-sync.js gen <slug> "<Title>"');
    process.exit(2);
  }
  const readmePath = path.join(SIBLINGS, 'crypto-lab-' + slug, 'README.md');
  let intro = 'TODO: 4-6 sentences grounded in the README — what it demonstrates, the primitives, the problem it solves, and the security model.';
  if (fs.existsSync(readmePath)) {
    const md = fs.readFileSync(readmePath, 'utf8');
    const para = md
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith('#') && !l.startsWith('[!') && !l.startsWith('>') && !l.startsWith('|') && l.length > 60);
    if (para) intro = para + '\n\nTODO: extend to 4-6 sentences, grounded in the README.';
  } else {
    console.error('(note: ' + readmePath + ' not found — fill What It Is by hand)');
  }
  const id = 'demo_crypto_lab_' + slug.replace(/-/g, '_');
  const text = [
    'Demo Repository: crypto-lab-' + slug,
    'GitHub: https://github.com/systemslibrarian/crypto-lab-' + slug,
    '',
    '# ' + title,
    '',
    '## What It Is',
    '',
    intro,
    '',
    '## When to Use It',
    '',
    '- TODO: Use it to <…>, because <…>.',
    '- TODO: Use it for <…>, because <…>.',
    '- TODO: Use it to <…>, because <…>.',
    '- Do not use it <…>, because it is a demo app and does not provide hardened operational controls.',
    '',
    '## Live Demo',
    '',
    // The dev domain serves the catalog page itself; per-demo subpaths under it
    // 404. This template previously emitted that form, which is how 242 dead
    // Live Demo links accumulated across the corpus. Always the github.io form.
    'https://systemslibrarian.github.io/crypto-lab-' + slug + '/',
    '',
    'TODO: one paragraph on what the demo lets you do interactively.',
    '',
    '## How to Run Locally',
    '',
    '```bash',
    'git clone https://github.com/systemslibrarian/crypto-lab-' + slug + '.git',
    'cd crypto-lab-' + slug,
    'npm install',
    'npm run dev',
    '```',
    '',
    'No environment variables are required.',
    '',
    '## Part of the Crypto-Lab Suite',
    '',
    title + ' is one module in the broader Crypto-Lab collection at https://crypto-lab.systemslibrarian.dev/.',
    '',
    'Whether you eat or drink or whatever you do, do it all for the glory of God. — 1 Corinthians 10:31',
  ].join('\n');
  /* Emit a single {id, text, reviewed} object ready to drop into the corpus
     array. `reviewed` is REQUIRED by crypto-counsel's scripts/validate.mjs and
     is emitted as null, which is that validator's own value for prose that has
     never been checked back against its lab -- not a placeholder waiting for a
     date. Six consecutive cardings shipped without it (weak-curves,
     honey-encryption, tropical-exchange, subverted-cipher, lthash,
     noisy-parity) because this writer did not emit it and the checklist did not
     mention it; the omission only surfaced in a DIFFERENT repository's CI. */
  console.log(JSON.stringify({ id, text, reviewed: null }, null, 2));
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'check') cmdCheck(a);
else if (cmd === 'selftest') process.exit(cmdSelftest());
else if (cmd === 'gen') cmdGen(a, b);
else if (cmd === 'overview') cmdOverview(process.argv.slice(3));
else {
  console.error('Usage:\n  node tools/corpus-sync.js check ["<corpus.json>"]\n  node tools/corpus-sync.js gen <slug> "<Title>"\n  node tools/corpus-sync.js overview [--write] ["<corpus.json>"]');
  process.exit(2);
}
