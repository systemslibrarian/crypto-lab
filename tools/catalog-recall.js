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
 *   >= 88%, the fixture covers >= 20 labs, and every miss class below is either
 *   closed or explicitly exempted by the rule.
 *
 * 88%, not the 95% first written down: see GATE below for why it moved, which
 * matters more than the number.
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

/* The floor a regression is measured against, and the bar the gate is set at.
 *
 * RAISE IT WHEN RECALL IMPROVES. NEVER LOWER IT TO MAKE A RUN PASS — that is the
 * check inverting itself, and it is the one failure mode this whole file exists
 * to prevent. It has been moved exactly once, deliberately and by the
 * maintainer, for the reason recorded in GATE below; a second move is the
 * maintainer's call and not a tool's, and not an agent's. If a run fails here,
 * the answer is to find what stopped being found. */
const FLOOR = 0.88;

/* The gate criterion, and WHY it is where it is. Written down so that the
 * question "can the chip rule be a failing check yet" has an answer someone can
 * check rather than re-argue.
 *
 * It was 95% before the residue was characterized, set when nobody had looked at
 * what the misses actually were. Measuring them showed that most are labs whose
 * source never writes the algorithm's name in executable code - crypto-lab
 * commit-gate does P-256 arithmetic and names the curve only in a comment beside
 * it. No name-based scanner can close that class without reading comments as
 * implementations, which is the precise error the whole design rejects: it would
 * re-admit mentions-as-implementations and hand back the false claims that four
 * cards were just corrected for.
 *
 * So 88% is a bar changed because the measurement taught us something, not
 * because a run would not pass. The distinction is the entire point, and the two
 * look identical from outside unless the reason travels with the number. */
const GATE = { recall: 0.88, labs: 20, movedFrom: 0.95, movedOn: '2026-09-24' };

/* Classes of miss this scanner is KNOWN to have, each with what would close it.
   A named class is a limit; an unnamed one is a surprise, and the point of
   writing them down is that the list can be checked against the measurement. */
const MISS_CLASSES = [
  {
    id: 'protocol-identity',
    resolved: true,
    status: 'PARTLY CLOSED, and the RESIDUE EXEMPTED BY MEASUREMENT — do not reopen without reading the three variants below',
    what: 'The lab implements a named PROTOCOL and no identifier in its source carries the protocol name. crypto-lab-tls-handshake builds a TLS 1.3 handshake and writes no such literal.',
    closes: 'The `protocol` shape closes it for labs declaring TWO of that protocol\'s own message structures with no dominant non-verb prefix; four labs qualify. The residue - a lab naming only ONE, like crypto-lab-blind-hello with its TLS ClientHello - is EXEMPTED rather than chased, recorded as `protocol-partial` and treated by the chip rule as no finding. A shape that declines to claim must decline to accuse.',
    doNotReopen: [
      'Keying on the repo SLUG or README title: would have crypto-lab-hqc-timing claiming HQC, which is the exact false claim four cards were just corrected for. Never tried in anger; rejected on inspection.',
      'Substring matching on structure names: 38 findings, almost all nonsense. `Envelope` (an OPAQUE message) landed on an ECIES lab, `LeafNode` (an MLS one) on an LMS hash tree, and `OpenBase` matched a variable called openBaseline.',
      'Whole-token matching on ONE structure: claimed TLS 1.3 for crypto-lab-ssh-handshake, which declares ServerHello for SSH\'s own exchange, and for crypto-lab-pake-gate, whose author named SRP-6a\'s first message srpClientHello.',
      'Two structures with a UNANIMOUS prefix: still passed pake-gate, which has four srp-prefixed occurrences and one bare local downstream of them. Dominance, not unanimity - and verbs excluded, since `encode` acts on a message where `srp` renames it.',
    ],
  },
  {
    id: 'unnamed-implementation',
    resolved: true,
    status: 'IRREDUCIBLE — now NAMED and EXEMPTED, the way NOT-SCANNED is',
    what: 'The lab computes the algorithm and never writes its name in executable code — only in comments, prose or a UI string, all of which are blanked on purpose because a mention is not an implementation. crypto-lab-commit-gate does P-256 arithmetic and names the curve only in a comment; crypto-lab-harvest-vault implements a ring-LWE KEM whose source never says so; crypto-lab-ggh-trapdoor calls its rounding step nothing in particular; crypto-lab-hqc-timing-break names its inner code `repeats`. FIVE of the six current misses are this class, so it, and not protocol identity, is what holds recall down.',
    closes: 'nothing a name-based scanner can do, and loosening to read comments as implementations would re-admit exactly the mentions-as-implementations error the whole design rejects. It is instead EXEMPTED: catalog-evidence records `comment-only` when an algorithm is named in this lab\'s own code files and never in anything that executes, and the chip rule treats that as no finding, the way it treats NOT-SCANNED. The boundary is narrow on purpose - a name in a README or a UI STRING does not exempt, because that is a lab talking about an algorithm rather than code annotated with it. Including strings was tried and took the rule from 28 violations to 1, since these labs build their UI from template literals full of algorithm names.',
  },
  {
    id: 'non-typescript',
    resolved: true,
    status: 'EXEMPTED — NOT-SCANNED and partially-unread labs are skipped by the rule',
    what: 'The implementation is in a language this scanner does not read. Two labs are NOT-SCANNED for this reason and nine more are partially unread, quantum-vault-kpqc alone holding 27 Rust files.',
    closes: 'reporting, not detection — already handled by the NOT-SCANNED state and the partially-unread note. The chip rule exempts both, so this class cannot produce a false accusation.',
  },
  {
    id: 'vocabulary',
    resolved: true,
    status: 'CLOSED for the sampled labs (coverage 68.2% -> 90.8%)',
    what: 'The lab implements an algorithm no vocabulary term can name. ristretto255 was on seven labs and in no term; AEGIS-256, HPKE, J-PAKE, CPace, Dragonfly, GHASH, hash-to-curve, HMAC-DRBG and Babai rounding were in none. All are terms now, and coverage moved 68.2% -> 90.8% on this fixture.',
    closes: '`node tools/catalog-evidence.js gaps`, which lists chips matching no term - the only way a declared vocabulary sees its own blind spots. Closing it LOWERED recall, from 91.1% to 89.8%, because a newly nameable algorithm is then held to recall like any other: a term that exists and still finds nothing is not progress, and the measurement now says so rather than rewarding the addition.',
  },
  {
    id: 'vendored',
    resolved: true,
    status: 'EXEMPTED — a vendored bundle makes the lab partially unread, which the rule skips',
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
    if (c.doNotReopen) {
      console.log('    ALREADY TRIED, each measured rather than reasoned about:');
      for (const v of c.doNotReopen) console.log(`      - ${v}`);
    }
  }

  const nLabs = Object.keys(fixture.labs).length;
  /* All THREE conditions, not the two that are easy to compute. The written
     criterion has always said "every miss class closed or explicitly exempted",
     and reporting MET on recall and lab count alone would be the same quiet
     substitution this file exists to catch - a number standing in for the claim
     it was supposed to support. */
  const unresolved = MISS_CLASSES.filter((c) => !c.resolved);
  const gate = recall >= GATE.recall && nLabs >= GATE.labs && unresolved.length === 0;
  console.log(`\nGATE CRITERION: the chip rule may become a failing check at recall >= ${(GATE.recall * 100).toFixed(0)}% over >= ${GATE.labs} labs,`);
  console.log(`with every miss class above closed or exempted by the rule.`);
  console.log(`  today: recall ${(recall * 100).toFixed(1)}% (${recall >= GATE.recall ? 'ok' : 'below'}), `
    + `fixture ${nLabs} labs (${nLabs >= GATE.labs ? 'ok' : 'short'}), `
    + `miss classes ${unresolved.length === 0 ? 'all resolved' : `${unresolved.length} unresolved`} — ${gate ? 'MET' : 'NOT MET'}.`);
  if (unresolved.length) {
    console.log(`  blocked by: ${unresolved.map((c) => c.id).join(', ')}.`);
  }
  console.log(`  the bar moved from ${(GATE.movedFrom * 100).toFixed(0)}% on ${GATE.movedOn}, because the residue turned out to be`);
  console.log('  labs whose source never writes the name in executable code — a class no name-based');
  console.log('  scanner can close. Changed by what the measurement taught, not to let a run pass.');
  console.log(`  FLOOR ${(FLOOR * 100).toFixed(0)}%: raised when recall improves, never lowered. Moving it again is the`);
  console.log('  maintainer\'s call, not a tool\'s.');

  if (mode === 'check' && recall < FLOOR) {
    console.error(`\nRecall ${(recall * 100).toFixed(1)}% is below the recorded floor of ${(FLOOR * 100).toFixed(0)}%.`);
    console.error('Something that used to be found is no longer found. Do not lower the floor.');
    process.exit(1);
  }
}

main();
