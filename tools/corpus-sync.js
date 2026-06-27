#!/usr/bin/env node
/*
 * corpus-sync.js — keep the crypto-counsel RAG corpus in step with this catalog.
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
  console.log('Corpus:', corpusPath);
  console.log('Catalog demos:', cat.size, '| Corpus demo entries:', cor.size);
  console.log('Missing from corpus (' + missing.length + '):', JSON.stringify(missing));
  console.log('Stale in corpus (' + stale.length + '):', JSON.stringify(stale));
  process.exit(missing.length || stale.length ? 1 : 0);
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
    '**[Live Demo](https://crypto-lab.systemslibrarian.dev/' + slug + '/)**',
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
  // Emit a single {id, text} object ready to drop into the corpus array.
  console.log(JSON.stringify({ id, text }, null, 2));
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'check') cmdCheck(a);
else if (cmd === 'gen') cmdGen(a, b);
else {
  console.error('Usage:\n  node tools/corpus-sync.js check ["<corpus.json>"]\n  node tools/corpus-sync.js gen <slug> "<Title>"');
  process.exit(2);
}
