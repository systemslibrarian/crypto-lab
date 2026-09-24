#!/usr/bin/env node
/*
 * catalog-recall.js — measure how much of the truth catalog-evidence.js finds.
 *
 * Run: node tools/catalog-recall.js
 * Prevents: the chip rule being promoted to a failing check on a judgement call rather than a measurement
 *
 * WHY THIS EXISTS
 *
 * `catalog-sync.js chips` encodes a rule: a chip naming an algorithm the lab does
 * not implement must be marked. The rule is sound. It is not a gate, because it
 * is only as good as this scanner's recall — every algorithm the scanner misses
 * becomes a card falsely accused of overclaiming. "Recall is not good enough yet"
 * was a judgement anyone could re-litigate and nobody could check. This makes it
 * a number, from a fixture someone else can read and disagree with.
 *
 * GROUND TRUTH IS NOT DERIVED FROM THE TOOL UNDER TEST. The fixture was built by
 * reading each lab's README for what it claims and confirming each claim in the
 * lab's own source, in whatever language that source is in. Deriving it from
 * catalog-evidence's own output would measure nothing and report 100%.
 *
 * TWO NUMBERS, NEVER AVERAGED
 *
 *   recall      of the algorithms a lab implements AND the vocabulary can name,
 *               how many the scanner found. This measures the detection shapes.
 *   coverage    of everything a lab implements, how many the vocabulary can name
 *               at all. This measures the vocabulary.
 *
 * They fail for different reasons and are fixed by different work, so averaging
 * them into one score would hide whichever is worse behind whichever is better.
 *
 * THIS MEASURES RECALL AND NOT PRECISION. The fixture is a VERIFIED SUBSET of
 * each lab's truth, not an exhaustive enumeration: every entry in it was
 * confirmed, but a lab may implement more than it lists. So an algorithm the
 * scanner found that the fixture does not name is NOT a false positive — it is
 * outside what this fixture claims to know, and the run prints it as such.
 * Precision is measured the other way round, by sampling anchors and reading the
 * lines they point at; the two measurements need different evidence and must not
 * be read off one table.
 *
 * THE GATE CRITERION is written down here rather than argued each time:
 *
 *   the chip rule may become a failing check when recall on this fixture is
 *   >= 95%, the fixture covers >= 20 labs, and every miss class below is either
 *   closed or explicitly exempted by the rule.
 *
 * Usage (from the repo root):
 *   node tools/catalog-recall.js          measure and print
 *   node tools/catalog-recall.js check    also exit 1 if recall fell below the floor
 *   node tools/catalog-recall.js --json   machine-readable
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ALGORITHMS } = require('./catalog-vocab.js');

const ROOT = path.join(__dirname, '..');
const FIXTURE = path.join(__dirname, 'fixtures', 'catalog', 'recall.json');

/* The floor a regression is measured against. Raise it when recall improves;
   never lower it to make a run pass — that is the check inverting itself. */
const FLOOR = 0.80;

/* Classes of miss this scanner is KNOWN to have, each with what would close it.
   A named class is a limit; an unnamed one is a surprise, and the point of
   writing them down is that the list can be checked against the measurement. */
const MISS_CLASSES = [
  {
    id: 'protocol-identity',
    what: 'The lab implements a named PROTOCOL, and no identifier in its source carries the protocol name. crypto-lab-tls-handshake builds a TLS 1.3 handshake and writes no such literal; the same for E91, OPAQUE and Noise.',
    closes: 'a protocol-level shape: treat a lab whose repo slug and README title both name a protocol term as evidence for that term, anchored to the module that implements the handshake.',
  },
  {
    id: 'non-typescript',
    what: 'The implementation is in a language this scanner does not read. Two labs are NOT-SCANNED for this reason and nine more are partially unread, quantum-vault-kpqc alone holding 27 Rust files.',
    closes: 'reporting, not detection — already handled by the NOT-SCANNED state and the partially-unread note. The chip rule exempts both, so this class cannot produce a false accusation.',
  },
  {
    id: 'vocabulary',
    what: 'The lab implements an algorithm no vocabulary term can name. ristretto255 was on seven labs and in no term; AEGIS-256, HPKE, J-PAKE, CPace and Dragonfly are in none today.',
    closes: '`node tools/catalog-evidence.js gaps`, which lists chips matching no term. It is the only way a declared vocabulary sees its own blind spots.',
  },
  {
    id: 'vendored',
    what: 'The algorithm is implemented by a vendored bundle the scanner deliberately skips, so crypto-lab-snark-arena implements Groth16 through public/vendor/snarkjs.min.js and the scanner reports nothing.',
    closes: 'nothing should. An anchor into a minified line proves nothing about the lab, and skipping it is correct. The chip rule must treat vendored implementations as unjudgeable rather than absent.',
  },
];

function scanned() {
  const out = execFileSync('node', ['tools/catalog-evidence.js', '--json'], {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
  const byslug = new Map();
  for (const lab of JSON.parse(out)) byslug.set(lab.slug, lab);
  return byslug;
}

function main() {
  const mode = process.argv[2];
  const fixture = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
  const found = scanned();
  const names = new Set(ALGORITHMS.map((a) => a.name));

  const rows = [];
  let hit = 0;
  let truth = 0;
  let outOfVocab = 0;
  const unnameable = [];

  for (const [slug, expect] of Object.entries(fixture.labs)) {
    const lab = found.get(slug);
    const got = new Set(lab ? lab.implements.map((i) => i.name) : []);
    /* A truth the vocabulary cannot name is not a recall failure. Check that
       here rather than trusting the fixture's own split, so a term added later
       moves the entry into the measured set automatically. */
    const measurable = expect.implements.filter((n) => names.has(n));
    const notNameable = expect.implements.filter((n) => !names.has(n));
    for (const n of notNameable) unnameable.push(`${slug}: ${n}`);
    const missed = measurable.filter((n) => !got.has(n));
    hit += measurable.length - missed.length;
    truth += measurable.length;
    outOfVocab += expect.outOfVocabulary.length;
    rows.push({ slug, stratum: expect.stratum, expected: measurable.length, missed, extra: [...got].filter((n) => !expect.implements.includes(n)) });
  }

  const recall = truth ? hit / truth : 1;
  const coverage = (truth + outOfVocab) ? truth / (truth + outOfVocab) : 1;

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ recall, coverage, hit, truth, outOfVocab, rows, missClasses: MISS_CLASSES }, null, 2));
    return;
  }

  console.log(`Recall fixture: ${Object.keys(fixture.labs).length} labs, sampled ${fixture.sampled}.`);
  console.log(`${fixture.method}\n`);
  for (const r of rows) {
    const mark = r.missed.length ? 'MISS' : ' ok ';
    console.log(`  ${mark}  ${r.slug.replace('crypto-lab-', '').padEnd(24)} ${String(r.expected).padStart(2)} expected` +
      (r.missed.length ? `  — missed ${r.missed.join(', ')}` : '') +
      (r.extra.length ? `  (+${r.extra.length} beyond the fixture's scope)` : ''));
  }
  console.log(`\n  RECALL    ${(recall * 100).toFixed(1)}%  — ${hit} of ${truth} in-vocabulary implementations found`);
  console.log(`  COVERAGE  ${(coverage * 100).toFixed(1)}%  — ${truth} of ${truth + outOfVocab} implementations the vocabulary can name at all`);
  console.log('  (precision is NOT measured here: the fixture is a verified subset, so a find it does');
  console.log('   not name is outside its scope rather than wrong. Precision comes from anchor sampling.)');
  if (unnameable.length) console.log(`  fixture entries no term can name (counted as coverage, not recall): ${unnameable.join('; ')}`);

  console.log('\nKNOWN MISS CLASSES');
  for (const c of MISS_CLASSES) {
    console.log(`\n  ${c.id}`);
    console.log(`    ${c.what}`);
    console.log(`    closes with: ${c.closes}`);
  }

  const gate = recall >= 0.95 && Object.keys(fixture.labs).length >= 20;
  console.log(`\nGATE CRITERION: the chip rule may become a failing check at recall >= 95% over >= 20 labs,`);
  console.log(`with every miss class above closed or exempted by the rule.`);
  console.log(`  today: recall ${(recall * 100).toFixed(1)}%, fixture ${Object.keys(fixture.labs).length} labs — ${gate ? 'MET' : 'NOT MET'}.`);

  if (mode === 'check' && recall < FLOOR) {
    console.error(`\nRecall ${(recall * 100).toFixed(1)}% is below the recorded floor of ${(FLOOR * 100).toFixed(0)}%.`);
    console.error('Something that used to be found is no longer found. Do not lower the floor.');
    process.exit(1);
  }
}

main();
