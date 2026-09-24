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
    status: 'PARTLY CLOSED',
    what: 'The lab implements a named PROTOCOL and no identifier in its source carries the protocol name. crypto-lab-tls-handshake builds a TLS 1.3 handshake and writes no such literal.',
    closes: 'The `protocol` shape now closes it for labs that declare TWO of that protocol\'s own message structures without a dominant foreign prefix — ClientHello AND EncryptedExtensions, say. Three labs qualify. It does NOT reach a lab naming only one, so crypto-lab-blind-hello builds real TLS ClientHello structures and is still missed. Note what was rejected: keying on the repo slug, which would have had crypto-lab-hqc-timing claiming HQC — the exact false claim just removed from four cards. Each looser variant was tried and measured: a substring match gave 38 findings that were mostly nonsense, and single-structure evidence claimed TLS for an SSH lab and an SRP file that had borrowed the names.',
  },
  {
    id: 'unnamed-implementation',
    status: 'IRREDUCIBLE for a name-based scanner',
    what: 'The lab computes the algorithm and never writes its name in executable code — only in comments, prose or a UI string, all of which are blanked on purpose because a mention is not an implementation. crypto-lab-commit-gate does P-256 arithmetic and names the curve only in a comment; crypto-lab-harvest-vault implements a ring-LWE KEM whose source never says so; crypto-lab-ggh-trapdoor calls its rounding step nothing in particular; crypto-lab-hqc-timing-break names its inner code `repeats`. FIVE of the six current misses are this class, so it, and not protocol identity, is what holds recall down.',
    closes: 'nothing a name-based scanner can do, and loosening to read comments would re-admit exactly the mentions-as-implementations error the whole design rejects. The rule must treat it as unjudgeable: it is the reason a recall target of 95% may be the wrong bar, rather than a target still to be reached.',
  },
  {
    id: 'non-typescript',
    what: 'The implementation is in a language this scanner does not read. Two labs are NOT-SCANNED for this reason and nine more are partially unread, quantum-vault-kpqc alone holding 27 Rust files.',
    closes: 'reporting, not detection — already handled by the NOT-SCANNED state and the partially-unread note. The chip rule exempts both, so this class cannot produce a false accusation.',
  },
  {
    id: 'vocabulary',
    status: 'CLOSED for the sampled labs (coverage 68.2% -> 90.8%)',
    what: 'The lab implements an algorithm no vocabulary term can name. ristretto255 was on seven labs and in no term; AEGIS-256, HPKE, J-PAKE, CPace, Dragonfly, GHASH, hash-to-curve, HMAC-DRBG and Babai rounding were in none. All are terms now, and coverage moved 68.2% -> 90.8% on this fixture.',
    closes: '`node tools/catalog-evidence.js gaps`, which lists chips matching no term - the only way a declared vocabulary sees its own blind spots. Closing it LOWERED recall, from 91.1% to 89.8%, because a newly nameable algorithm is then held to recall like any other: a term that exists and still finds nothing is not progress, and the measurement now says so rather than rewarding the addition.',
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
    /* An outOfVocabulary entry is re-checked against the LIVE vocabulary, not
       trusted as written. The fixture records what had no term ON THE DAY it was
       built; adding a term is exactly how the coverage class gets closed, and a
       static list could never show that. Anything now nameable moves into the
       measured set and is held to recall like everything else - which is the
       point: a term that exists and still finds nothing is not progress. */
    const nowNameable = [];
    const stillUnnameable = [];
    for (const n of expect.outOfVocabulary) {
      const term = ALGORITHMS.find((t) => t.re.test(n));
      if (term) nowNameable.push(term.name);
      else stillUnnameable.push(n);
    }
    const allMeasurable = [...new Set([...measurable, ...nowNameable])];
    const missed = allMeasurable.filter((n) => !got.has(n));
    hit += allMeasurable.length - missed.length;
    truth += allMeasurable.length;
    outOfVocab += stillUnnameable.length;
    rows.push({ slug, stratum: expect.stratum, expected: allMeasurable.length, missed, promoted: nowNameable, extra: [...got].filter((n) => !allMeasurable.includes(n)) });
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
      (r.promoted.length ? `  [${r.promoted.length} newly nameable]` : '') +
      (r.extra.length ? `  (+${r.extra.length} beyond the fixture's scope)` : ''));
  }
  console.log(`\n  RECALL    ${(recall * 100).toFixed(1)}%  — ${hit} of ${truth} in-vocabulary implementations found`);
  console.log(`  COVERAGE  ${(coverage * 100).toFixed(1)}%  — ${truth} of ${truth + outOfVocab} implementations the vocabulary can name at all`);
  console.log('  (precision is NOT measured here: the fixture is a verified subset, so a find it does');
  console.log('   not name is outside its scope rather than wrong. Precision comes from anchor sampling.)');
  if (unnameable.length) console.log(`  fixture entries no term can name (counted as coverage, not recall): ${unnameable.join('; ')}`);

  console.log('\nKNOWN MISS CLASSES');
  for (const c of MISS_CLASSES) {
    console.log(`\n  ${c.id}${c.status ? `  [${c.status}]` : ''}`);
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
