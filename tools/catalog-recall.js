#!/usr/bin/env node
/*
 * catalog-recall.js — measure how much of the truth catalog-evidence.js finds.
 *
 * Run: node tools/catalog-recall.js
 * Prevents: the chip rule being promoted to a failing check on a judgement call rather than a measurement
 * Reads: tools/fixtures/catalog/recall.json, catalog-vocab.js and catalog-reviewed.json (for the review-removal cause), and shells out to `node tools/catalog-evidence.js --json` (which opens every clone)
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
const REVIEWS = require('./catalog-reviewed.json');

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

/* THE LAST RECORDED MEASUREMENT, so a failing run can say what actually moved.
 *
 * Without it the failure message could only assert one cause, and it did:
 * "Something that used to be found is no longer found." That sentence is a claim
 * about the NUMERATOR, and recall is a ratio -- it also falls when the fixture
 * grows and the entries it gains are not all found yet, which is a larger
 * denominator and not a regression at all. The fixture is deliberately grown "as
 * the work goes, not when the gate is in reach", so that case is expected rather
 * than hypothetical, and a message that reports it as something having been lost
 * sends the reader to look for a scanner change that never happened.
 *
 * So the two terms are recorded and the failure prints both deltas and names
 * which one moved.
 *
 * SINCE 2026-11-23 IT ALSO GATES, and that is the fix for #532. It is still not
 * a second floor -- the two answer different questions and BOTH must hold:
 *
 *   FLOOR    an absolute bar. Recall below 0.88 fails, whatever the history.
 *   BASELINE a DROP gate. Recall below the last recorded measurement fails,
 *            however far above the floor it sits.
 *
 * One constant used to do both jobs, and its own first line admitted it: "the
 * floor a regression is measured against, and the bar the gate is set at".
 * CLAUDE.md has always described this check as one that "fails on a DROP", and
 * an absolute bar cannot express a drop -- while recall sat above 0.88 the two
 * answers coincided and nothing made the difference visible. They came apart on
 * 2026-11-20, when a find the OWNER removed took recall to 87.7%: the daily job
 * went red and would have stayed red for as long as recall sat under the bar,
 * which is the state everybody learns to scroll past.
 *
 * #519 proposed making BASELINE the only gate, and was closed unmerged on the
 * owner's ruling of 2026-11-22 for the reason recorded in #532: a baseline that
 * is the sole gate is a number a re-record can move, and a re-record is cheaper
 * than a scanner fix. Keeping the floor absolute removes that hazard -- a
 * re-record can lower what the drop gate compares against, and it still cannot
 * take recall below 0.88 without failing.
 *
 * Update it when a measurement is deliberately re-recorded, with the date and
 * where it was written down, the same way FLOOR carries its reason, and keep the
 * number it replaced in `previous` so a re-record is legible as a re-record. */
const BASELINE = { hit: 57, truth: 64, on: '2026-11-23', where: 'CLAUDE.md, written in #534',
  previous: { hit: 58, truth: 65, on: '2026-10-15', where: 'CLAUDE.md, written in add68e0 (#193)' },
  why: 'The fixture entry for crypto-lab-frozen-heart expected Ed25519 of a lab that does not '
    + 'implement it; a source review had ruled that credit out on 2026-11-09 and #520 removed the '
    + 'expectation. Recall\'s numerator did not move (57 both sides); the denominator fell 65 -> 64. '
    + 'Re-recorded so the drop gate below compares against the measurement that is actually current, '
    + 'rather than reporting a 1-find loss against a denominator that no longer exists.' };

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
    what: 'The implementation is in source this scanner does not read. Pinned source reviews now cover the earlier Rust/Python/C cases; three labs retain opaque bundled WASM and remain explicitly partial.',
    closes: 'reporting, not detection — already handled by the NOT-SCANNED state and the partially-unread note. The chip rule exempts both, so this class cannot produce a false accusation.',
  },
  {
    id: 'vocabulary',
    resolved: true,
    status: 'CLOSED ON THE SAMPLE, and the SAMPLE WAS NEVER THE FLEET — now closed fleet-wide by a check instead of by sampling',
    what: 'The lab implements an algorithm no vocabulary term can name. ristretto255 was on seven labs and in no term; AEGIS-256, HPKE, J-PAKE, CPace, Dragonfly, GHASH, hash-to-curve, HMAC-DRBG and Babai rounding were in none. All are terms now, and coverage moved 68.2% -> 90.8% on this fixture.',
    closes: '`node tools/catalog-evidence.js gaps` lists chips matching no term, which is how the first round was found, and closing it LOWERED recall from 91.1% to 89.8% - a newly nameable algorithm is then held to recall like any other, so a term that exists and still finds nothing is not progress. But `gaps` is a REPORT somebody has to read, and this class was recorded CLOSED on the strength of 20 sampled labs. On 2026-09-29 an audit of Chinese-standard coverage found ZUC missing entirely: crypto-lab-air-stream hand-rolls it in src/zuc/zuc.ts, depends on @li0ard/zuc and chips "ZUC", and because no term could NAME it the card was neither credited with it nor judged by the chip rule - invisible in both directions, on a lab outside the sample. `node tools/catalog-sync.js vocab` is what actually closes the class: it FAILS on any chip no term names whose lab depends on a package of that name, over all 208 cards rather than over the sample, and on its first run it found a second one (Kupyna, crypto-lab-world-hashes). A sampled measurement can only ever say the class is closed WHERE IT LOOKED.',
  },
  {
    id: 'vendored',
    resolved: true,
    status: 'EXEMPTED — a vendored bundle makes the lab partially unread, which the rule skips',
    what: 'The algorithm is implemented by a vendored bundle the scanner deliberately skips, so crypto-lab-snark-arena implements Groth16 through public/vendor/snarkjs.min.js and the scanner reports nothing.',
    closes: 'nothing should. An anchor into a minified line proves nothing about the lab, and skipping it is correct. The chip rule must treat vendored implementations as unjudgeable rather than absent.',
  },
];

/* WHY a particular truth was missed, DERIVED from the scanner's own output and
   the pin table -- never written down per lab, which would be a list of excuses
   that cannot go stale.

   The bare miss list gives a name and nothing else, and the five causes behind
   those names have nothing in common. A term a REVIEW removed is the measurement
   working as designed; a term the scanner saw and ranked a reference is the
   exempted unnamed-implementation class; a term nothing named at all is the only
   one that might be a detection gap worth closing. Printing them
   undifferentiated invites the reader to treat all five as scanner defects, which
   is how a measurement turns into pressure to loosen the scanner.

   Order is most specific first. A review removal overrides everything, because it
   is a decision rather than an observation; protocol-partial before comment-only
   because a lab can be both and the protocol shape's own refusal is the more
   precise statement; reference last, because `references` is where a name lands
   when nothing better fits. */
function causeOf(slug, name, lab) {
  const review = REVIEWS[slug] || {};
  const listed = (key) => (lab && Array.isArray(lab[key]) ? lab[key] : [])
    .some((e) => (typeof e === 'string' ? e : (e && e.name)) === name);
  if ((review.remove || []).includes(name)) {
    return { id: 'removed-by-review', say: 'removed by a reviewed decision in tools/catalog-reviewed.json, so this miss is the measurement working, not the scanner failing' };
  }
  if (listed('protocolPartial')) {
    return { id: 'protocol-partial', say: 'the protocol shape declined to claim it (protocol-partial, an EXEMPTED class: a shape that declines to claim must decline to accuse)' };
  }
  if (listed('commentOnly')) {
    return { id: 'comment-only', say: "named in this lab's code only in COMMENTS (comment-only, the EXEMPTED unnamed-implementation class)" };
  }
  if (listed('references')) {
    return { id: 'reference-only', say: 'the name occurs in this lab only in non-executing text, so it ranked as a REFERENCE rather than an implementation' };
  }
  return { id: 'not-named', say: 'no detection shape named it at all' };
}

const CAUSE_ORDER = ['not-named', 'reference-only', 'comment-only', 'protocol-partial', 'removed-by-review'];

function scanned() {
  const out = execFileSync('node', ['tools/catalog-evidence.js', '--json'], {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
  const byslug = new Map();
  for (const lab of JSON.parse(out)) byslug.set(lab.slug, lab);
  return byslug;
}

/* SAY WHAT MOVED, rather than asserting the one cause this tool cannot know.
 *
 * Recall is a ratio and it falls for two reasons that are fixed by opposite work.
 * The message here used to assert one of them -- "Something that used to be found
 * is no longer found" -- which is a claim about the NUMERATOR and is simply false
 * when the fixture has grown. The fixture is meant to grow, "as the work goes,
 * not when the gate is in reach", so that case is expected rather than
 * hypothetical, and reporting it as a lost find sends the reader hunting a
 * scanner change that never happened.
 *
 * Both deltas are printed and the sentence is DERIVED from them. The four
 * branches are asserted in tests/catalog-recall-drop.test.cjs, because a message
 * that is right in the one direction someone happened to try is the same defect
 * one layer up.
 */
function explainDrop(hit, truth, baseline, rows = []) {
  const dHit = hit - baseline.hit;
  const dTruth = truth - baseline.truth;
  const moved = (d) => (d === 0 ? 'unchanged' : d > 0 ? `${d} more` : `${-d} fewer`);
  const finds = (n) => `${n} find${n === 1 ? '' : 's'} that used to be made ${n === 1 ? 'is' : 'are'} no longer made`;
  const out = [
    `Against the last recorded measurement — ${baseline.hit} of ${baseline.truth}, `
      + `${((baseline.hit / baseline.truth) * 100).toFixed(1)}%, ${baseline.on}, ${baseline.where}:`,
    `  found       ${baseline.hit} -> ${hit}  (${moved(dHit)})`,
    `  measurable  ${baseline.truth} -> ${truth}  (${moved(dTruth)})`,
    '',
  ];
  if (dHit < 0 && dTruth > 0) {
    out.push(`Both terms moved: ${finds(-dHit)}, AND the fixture gained ${dTruth} measurable`);
    out.push('entries. Read the lost find first; a larger denominator on its own is not a regression.');
  } else if (dHit < 0) {
    out.push(`${finds(-dHit)}, over ${dTruth === 0 ? 'the same' : 'a smaller'} denominator.`);
  } else if (dTruth > 0) {
    out.push(`NOTHING STOPPED BEING FOUND. The fixture grew by ${dTruth} measurable entr${dTruth === 1 ? 'y' : 'ies'}`);
    out.push(`and ${dHit === 0 ? 'none' : String(dHit)} of them ${dHit === 1 ? 'is' : 'are'} found yet, so the ratio fell with a larger`);
    out.push('denominator. That is what an honest extension is free to do, and it is not a');
    out.push('scanner regression.');
  } else {
    out.push('Neither term moved the way the baseline records, so the arithmetic does not');
    out.push('explain this on its own. Re-derive both numbers before concluding anything: the');
    out.push(`baseline is maintained by hand (${baseline.where}) and may simply be stale.`);
  }
  /* And which of the current misses are DECISIONS rather than detection. A
     reviewed removal is counted against recall while nothing about the scanner
     moved, and `not-named` is the only class that might be a gap worth closing. */
  const pick = (id) => rows.flatMap((r) => (r.causes || []).filter((c) => c.id === id)
    .map((c) => `${r.slug.replace('crypto-lab-', '')} ${c.name}`));
  const removed = pick('removed-by-review');
  const gaps = pick('not-named');
  if (removed.length) {
    out.push('');
    out.push(`Of the current misses, ${removed.length} ${removed.length === 1 ? 'is a REVIEWED REMOVAL' : 'are REVIEWED REMOVALS'} rather than a detection change:`);
    out.push(`  ${removed.join(', ')}`);
    out.push('A person ruled the credit out, so recall counts it against the scanner while');
    out.push('nothing about the scanner moved.');
  }
  out.push('');
  out.push(gaps.length
    ? `${gaps.length} miss${gaps.length === 1 ? '' : 'es'} in the only class that might be a detection gap (not-named): ${gaps.join(', ')}.`
    : 'NO miss is in the only class that might be a detection gap (not-named): every one');
  if (!gaps.length) out.push('is a reviewed decision or a declared exemption. The WHY block above classifies all of them.');
  else out.push('The WHY block above classifies all of them.');
  return out;
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
    rows.push({ slug, stratum: expect.stratum, expected: allMeasurable.length, missed,
      causes: missed.map((n) => ({ name: n, ...causeOf(slug, n, lab) })),
      promoted: nowNameable, extra: [...got].filter((n) => !allMeasurable.includes(n)) });
  }

  const recall = truth ? hit / truth : 1;
  const coverage = (truth + outOfVocab) ? truth / (truth + outOfVocab) : 1;

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ recall, coverage, hit, truth, outOfVocab, floor: FLOOR, baseline: BASELINE, rows, missClasses: MISS_CLASSES }, null, 2));
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

  /* WHY each miss is a miss, grouped. Derived per miss by causeOf; see its note
     for why an undifferentiated list is the wrong thing to print. */
  const byCause = new Map();
  for (const r of rows) {
    for (const c of r.causes) {
      if (!byCause.has(c.id)) byCause.set(c.id, { say: c.say, items: [] });
      byCause.get(c.id).items.push(`${r.slug.replace('crypto-lab-', '')} ${c.name}`);
    }
  }
  if (byCause.size) {
    console.log(`\n  WHY THE ${[...byCause.values()].reduce((n, g) => n + g.items.length, 0)} MISSES ARE MISSES — derived from the scanner's output and the pin`);
    console.log('  table, not written down per lab. Only `not-named` is a candidate detection gap;');
    console.log('  the other four are a reviewed decision or a declared exemption.');
    for (const id of CAUSE_ORDER) {
      const g = byCause.get(id);
      if (!g) continue;
      console.log(`\n    ${id}  (${g.items.length})`);
      console.log(`      ${g.say}`);
      for (const item of g.items) console.log(`        ${item}`);
    }
  }
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

  /* TWO GATES, TWO JOBS, both checked, neither standing in for the other. The
     split is #532's fix; the reasoning is beside BASELINE above. Printed on
     every run, not only on a failure, because the reason these came apart
     unnoticed is that only one of them was ever printed. */
  const baseRate = BASELINE.hit / BASELINE.truth;
  console.log('\n  TWO GATES, BOTH MUST HOLD:');
  console.log(`    FLOOR  ${(FLOOR * 100).toFixed(0)}%  absolute bar — today ${(recall * 100).toFixed(1)}% `
    + `${recall < FLOOR ? 'is BELOW it' : 'clears it'}.`);
  console.log(`    DROP   ${(baseRate * 100).toFixed(1)}%  the last recorded measurement `
    + `(${BASELINE.hit} of ${BASELINE.truth}, ${BASELINE.on}) — today `
    + `${recall + 1e-9 < baseRate ? 'is a DROP below it' : 'is no drop'}.`);

  if (mode === 'check') {
    const belowFloor = recall < FLOOR;
    /* A hair of tolerance so re-deriving the same measurement cannot fail on
       floating-point: the gate is for a real loss, not for the last bit of a
       division. An actual lost find moves this far more than 1e-9. */
    const dropped = recall + 1e-9 < baseRate;
    if (belowFloor || dropped) {
      if (belowFloor) {
        console.error(`\nFLOOR: recall ${(recall * 100).toFixed(1)}% is below the absolute bar of `
          + `${(FLOOR * 100).toFixed(0)}%.`);
      }
      if (dropped) {
        console.error(`\nDROP: recall ${(recall * 100).toFixed(1)}% is below the last recorded measurement of `
          + `${(baseRate * 100).toFixed(1)}% (${BASELINE.hit} of ${BASELINE.truth}, ${BASELINE.on}).`);
      }
      for (const line of explainDrop(hit, truth, BASELINE, rows)) console.error(line);
      console.error('\nDo not lower the floor, and do not re-record the baseline to clear a DROP:'
        + '\n  a re-record is the right answer only when the MEASUREMENT changed — a fixture entry'
        + '\n  corrected, a lab leaving the sample — and it is the owner\'s. When a find was lost,'
        + '\n  the answer is to find what stopped being found.');
      process.exit(1);
    }
  }
}

if (require.main === module) main();

module.exports = { causeOf, explainDrop, FLOOR, BASELINE, GATE, MISS_CLASSES };
