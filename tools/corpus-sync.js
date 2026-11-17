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
const DEMOS_HEADING = 'All Demos:';
const DEMO_BEGIN = 'readme-sync:all-demos:begin';
const DEMO_END = 'readme-sync:all-demos:end';

/* The README's generated demo rows, in the README's own order.
   Returns null rather than a short list when the block or a row cannot be read:
   a partial parse here would delete lines from the record and call it a sync. */
function readmeDemoRows(readme) {
  const b = readme.indexOf(DEMO_BEGIN);
  const e = readme.indexOf(DEMO_END);
  if (b === -1 || e === -1 || e < b) return null;
  const out = [];
  for (const line of readme.slice(b, e).split('\n')) {
    if (!line.startsWith('| [')) continue;
    const cells = line.split('|');
    // | Exhibit | Description | Source | Primitives | -> 6 with the empty ends
    if (cells.length !== 6) return null;
    const name = /^\s*\[([^\]]+)\]/.exec(cells[1]);
    if (!name) return null;
    out.push({ name: name[1].trim(), primitives: cells[4].trim() });
  }
  return out.length ? out : null;
}

/* Title -> kicker, through the shared card reader and its shared decoder, so
   this agrees with what `readme-sync` put in the row by construction rather
   than by two regexes happening to match. A card the reader cannot place is
   returned as null, never skipped: a dropped card would quietly shorten the
   list and the shorter list would then be what `check` calls correct. */
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

/** The `- Name: Kicker — Chips` lines the record should carry, or null. */
function overviewLines(readme, html) {
  const rows = readmeDemoRows(readme);
  if (!rows) return null;
  const kickers = cardKickers(html);
  if (!kickers) return null;
  const lines = [];
  for (const r of rows) {
    if (!kickers.has(r.name)) return null; // a row with no card: refuse, do not guess
    const k = kickers.get(r.name);
    lines.push('- ' + r.name + (k ? ': ' + k : '') + ' — ' + r.primitives);
  }
  return lines;
}

/* Replace the lines under a heading, leaving every other byte of the record
   alone. The block ends at the first line that is not a "- " item, which is how
   the record is already shaped and how crypto-counsel's validate.mjs reads it. */
function spliceBlock(text, heading, lines) {
  const src = text.split('\n');
  const at = src.indexOf(heading);
  if (at === -1) return null;
  let end = at + 1;
  while (end < src.length && src[end].startsWith('- ')) end++;
  return [...src.slice(0, at + 1), ...lines, ...src.slice(end)].join('\n');
}

/** [] when the record's All Demos block is the derived one; findings otherwise. */
function overviewDrift(corpusPath, readme, html) {
  const corpus = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));
  const rec = corpus.find((e) => e && e.id === REFERENCE_DOC_ID);
  if (!rec) return [`corpus has no ${REFERENCE_DOC_ID} record`];
  const lines = overviewLines(readme, html);
  if (!lines) return [`could not derive the ${DEMOS_HEADING} block from README.md and index.html`];
  const want = spliceBlock(rec.text, DEMOS_HEADING, lines);
  if (want === null) return [`${REFERENCE_DOC_ID} has no "${DEMOS_HEADING}" heading`];
  if (want === rec.text) return [];
  const a = rec.text.split('\n');
  const b = want.split('\n');
  const out = [];
  if (a.length !== b.length) out.push(`${DEMOS_HEADING} has ${a.length} lines, the catalog gives ${b.length}`);
  /* Say WHICH kind of difference this is before listing lines. A block holding
     every right line in the wrong order differs on nearly every line and has no
     wrong fact in it; a block in the right order with one wrong chip differs on
     one. The bare count cannot tell those apart, and they are not the same
     finding. */
  const same = [...a].sort().join('\n') === [...b].sort().join('\n');
  if (same) out.push('every line is right and the ORDER is not the catalog\'s');
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) out.push(`line ${i + 1}: record "${a[i]}" / catalog "${b[i]}"`);
  }
  return out;
}

function cmdOverview(args) {
  const write = args.includes('--write');
  const explicit = args.find((x) => x && !x.startsWith('--'));
  const readme = fs.readFileSync(path.join(REPO_ROOT, 'README.md'), 'utf8');
  const html = fs.readFileSync(path.join(REPO_ROOT, 'index.html'), 'utf8');
  const lines = overviewLines(readme, html);
  if (!lines) {
    console.error('Could not derive the All Demos block. Run node tools/readme-sync.js check first.');
    process.exit(2);
  }
  if (!write) { console.log(lines.join('\n')); return; }

  const corpusPath = findCorpus(explicit);
  if (!corpusPath) {
    console.error('Could not locate crypto-counsel corpus.json. Pass a path or set CRYPTO_COUNSEL_CORPUS.');
    process.exit(2);
  }
  const raw = fs.readFileSync(corpusPath, 'utf8');
  const corpus = JSON.parse(raw);
  const rec = corpus.find((e) => e && e.id === REFERENCE_DOC_ID);
  if (!rec) { console.error(`corpus has no ${REFERENCE_DOC_ID} record`); process.exit(2); }
  const next = spliceBlock(rec.text, DEMOS_HEADING, lines);
  if (next === null) { console.error(`${REFERENCE_DOC_ID} has no "${DEMOS_HEADING}" heading`); process.exit(2); }
  if (next === rec.text) { console.log('Already in step; corpus.json not touched.'); return; }
  rec.text = next;
  /* corpus.json is minified, one line, no trailing newline, and it is read back
     byte for byte by a guard next door. JSON.stringify with no spacing is that
     shape; anything that pretty-prints or escapes non-ASCII rewrites ~1MB of
     someone else's file to say the same thing. */
  fs.writeFileSync(corpusPath, JSON.stringify(corpus));
  console.log(`Wrote ${lines.length} demo lines into ${REFERENCE_DOC_ID} in ${corpusPath}`);
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
  process.exit(missing.length || stale.length || incomplete.length || overview.length ? 1 : 0);
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


  /* --- the catalog overview block ---------------------------------------
     Synthetic README and page, so this says nothing about the real catalog
     and needs neither it nor a corpus to run. */
  const README = [
    'intro',
    '<!-- readme-sync:all-demos:begin -->',
    '| Exhibit | Description | Source | Primitives |',
    '|---|---|---|---|',
    '| [Alpha](https://systemslibrarian.github.io/crypto-lab-a/) | does a thing | [crypto-lab-a](https://g/a) | AES-GCM \u00b7 HKDF |',
    '| [Beta](https://systemslibrarian.github.io/crypto-lab-b/) | does another | [crypto-lab-b](https://g/b) | Size, Not Strength |',
    '<!-- readme-sync:all-demos:end -->',
    'outro',
  ].join('\n');
  const PAGE =
    '<a class="project-card" data-category="X" href="https://systemslibrarian.github.io/crypto-lab-a/">' +
    '<div class="card-kicker">Kick A</div><div class="project-title">Alpha</div>' +
    '<div class="project-copy">c</div><span class="chip">AES-GCM</span></a>' +
    '<a class="project-card" data-category="X" href="https://systemslibrarian.github.io/crypto-lab-b/">' +
    '<div class="card-kicker">Kick B</div><div class="project-title">Beta</div>' +
    '<div class="project-copy">c</div><span class="chip">Size, Not Strength</span></a>';

  const want = overviewLines(README, PAGE);
  ok(want && want.length === 2, 'both README rows become lines');
  ok(want && want[0] === '- Alpha: Kick A \u2014 AES-GCM \u00b7 HKDF',
    'a line is name, kicker from the card, and the README\'s Primitives cell');

  /* THE CASE THAT MOTIVATED THE SEPARATOR. One chip contains a comma, so a
     line re-joined with ", " cannot be read back as one chip. */
  ok(want && want[1] === '- Beta: Kick B \u2014 Size, Not Strength',
    'a chip containing a comma survives as ONE chip');

  ok(overviewLines(README.replace('readme-sync:all-demos:begin', 'x'), PAGE) === null,
    'no all-demos block: refuse, rather than emit an empty list');
  ok(overviewLines(README, PAGE.replace('>Alpha<', '>Gamma<')) === null,
    'a README row with no card: refuse, rather than drop the line');

  const REC = ['Project: Crypto Lab', '', 'All Demos:', '- stale line', '', 'tail paragraph'].join('\n');
  const spliced = spliceBlock(REC, 'All Demos:', want);
  ok(spliced === ['Project: Crypto Lab', '', 'All Demos:', ...want, '', 'tail paragraph'].join('\n'),
    'the splice replaces the block and leaves every other line alone');
  ok(spliceBlock(REC, 'Nothing:', want) === null,
    'a record with no such heading is refused, not appended to');

  /* MUTATION: re-join the chips with ", ", which is what the hand-kept record
     did. The Beta line then reads as two chips and the splice is a different
     string -- so a check comparing the two must NOT be satisfied by it. */
  const mutated = want.map((l) => l.replace(' \u00b7 ', ', '));
  ok(mutated.join('\n') !== want.join('\n') &&
     spliceBlock(REC, 'All Demos:', mutated) !== spliced,
    'MUTATION: chips re-joined with ", " produce a different block, and the comparison sees it');

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
