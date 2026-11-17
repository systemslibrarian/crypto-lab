#!/usr/bin/env node
/*
 * corpus-sync.js — keep the crypto-counsel RAG corpus in step with this catalog.
 *
 * Run: node tools/corpus-sync.js check
 * Prevents: a demo staying invisible to the crypto-counsel chatbot because its corpus entry was never added
 * Reads: index.html hrefs; corpus.json from $CRYPTO_COUNSEL_CORPUS, ../crypto-counsel-1/ or ../crypto-counsel/; gen: ../crypto-lab-<slug>/README.md
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
  console.log('Corpus:', corpusPath);
  console.log('Catalog demos:', cat.size, '| Corpus demo entries:', cor.size);
  console.log('Missing from corpus (' + missing.length + '):', JSON.stringify(missing));
  console.log('Stale in corpus (' + stale.length + '):', JSON.stringify(stale));
  console.log('Records missing a required field (' + incomplete.length + '):',
    JSON.stringify(incomplete.slice(0, 12)));
  if (incomplete.length > 12) console.log('  ...and ' + (incomplete.length - 12) + ' more');
  process.exit(missing.length || stale.length || incomplete.length ? 1 : 0);
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
else {
  console.error('Usage:\n  node tools/corpus-sync.js check ["<corpus.json>"]\n  node tools/corpus-sync.js gen <slug> "<Title>"');
  process.exit(2);
}
