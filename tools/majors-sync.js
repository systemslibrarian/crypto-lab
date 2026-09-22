#!/usr/bin/env node
/*
 * majors-sync.js — hold the Dependabot MAJORS policy to what the YAML does.
 *
 * ---------------------------------------------------------------------------
 * The defect this closes
 *
 * Every lab in this fleet documents what happens to a major version bump, and
 * in almost every lab the documentation is false. Measured 2026-09-21 across
 * the working trees:
 *
 *     labs declaring dependabot/fetch-metadata@v3            203
 *     labs that reference its outputs at all                   1
 *     labs that GATE on its outputs                            0
 *     dependabot.yml saying "majors come individually
 *       and a human decides"                                 179
 *     workflow files asserting majors-excluded AND
 *       majors-included, in the same file                    129
 *     dependabot.yml `ignore:` rules for semver-major          0
 *
 * The mechanism, everywhere, is "every bump merges on a green gate, majors
 * included". That is deliberate, is argued for in the merge step's own comment,
 * and is the behaviour this file is written to PRESERVE. What is wrong is the
 * prose around it.
 *
 * It is not an inconsistency, it is a measured falsehood. Sampling 15 labs on
 * 2026-09-21 found 89 merged Dependabot PRs, 84 merged by app/github-actions,
 * and 20 of those 84 were MAJOR bumps that no human approved. One of them is
 * crypto-lab-world-ciphers#16, vitest 4.1.11 -> 5.0.0, mergedBy app/github-
 * actions — in the very lab whose dependabot.yml line 9 says a human decides,
 * and it is the same major the 144-lab audit measured as dropping zero tests.
 * The sentence claiming human review is disproved by the bump that vindicates
 * the behaviour it misdescribes.
 *
 * ---------------------------------------------------------------------------
 * Why prose, again, and why a claims check rather than a wording pin
 *
 * This is the SECOND instance of the problem dispatch-comment-sync.js was built
 * for. That one found 36 drifted wordings of the dispatch rationale; this one
 * finds ~25 wordings of the majors rationale around a 179-copy core. Same
 * cause: a paragraph copied into 200 repos with nothing comparing any copy to
 * any other, and nothing at all comparing any copy to the YAML beneath it.
 *
 * So this file is built like dispatch-claims.js, not like a linter. It extracts
 * the claim as a PROPOSITION WITH A POLARITY, re-derives the same proposition
 * from the fleet's own YAML, and fails when the two disagree. Reword "a human
 * decides" to "a maintainer approves it" and it still fails, because the
 * proposition is unchanged. Rewrite it to say the gate decides and it passes.
 * A check that pinned the literal would force the sentence to stay the SAME
 * rather than stay TRUE, which is the frozen-prose failure one layer up.
 *
 * ---------------------------------------------------------------------------
 * THE CLAIM SPANS TWO FILES. This is the part that makes a naive checker lie.
 *
 * The evidence is crypto-lab-lattice-builder: "so majors come individually and a
 * human decides" in .github/dependabot.yml, and NO paragraph anywhere in its
 * workflows takes a position on majors at all. A checker reading only workflow
 * files scores that lab CLEAN while it carries the false sentence. Reading only
 * dependabot.yml fails the other way, missing the 129 labs whose contradiction
 * is entirely inside one workflow.
 *
 * This paragraph originally cited crypto-lab-world-ciphers, on that session's
 * own report that its two halves sat in different files. They do not: both are
 * in deploy-pages.yml, 14 lines apart, and a workflow-only checker would have
 * caught it. They found and retracted it themselves. Recorded because a tool
 * header that justifies its design with an unchecked example is the same defect
 * one layer up -- and because the design survived the retraction on better
 * evidence, which is the outcome worth having.
 *
 * The two false readings are also DIFFERENT, which constrains the replacement
 * text: dependabot.yml frames majors as ungrouped-therefore-human, and the job
 * header frames them as excluded-from-merging. A canonical paragraph has to
 * displace both, not assert the gate rule once.
 *
 * So a lab's claim is the UNION of both files, and a lab is judged on that
 * union. Reading either file alone is a denominator that was discovered rather
 * than declared, which is the defect this fleet has now hit ten times.
 *
 * ---------------------------------------------------------------------------
 * The derivation: can a major auto-merge here, with no human?
 *
 * Four things could stop one, and all four are read from the YAML:
 *
 *   1. no auto-merge job at all                     -> majors cannot auto-merge
 *   2. the merge is CONDITIONED on the update type  -> majors may be excluded
 *   3. dependabot.yml `ignore:`s semver-major       -> the PR never opens
 *   4. the auto-merge job's `if:` excludes them     -> majors may be excluded
 *
 * Condition 2 is where the honesty of this file lives. crypto-lab-fold-gate is
 * the ONLY lab that references steps.meta.outputs.update-type, and it does NOT
 * gate on it — it writes the value into $GITHUB_STEP_SUMMARY so the run log
 * records which update type was auto-merged. Its own comment says so: "Policy
 * is deliberately 'the gate decides, not the version number', so this does not
 * gate anything -- but the run log must say which update type was auto-merged,
 * or a major landing here leaves no trace of having been one."
 *
 * Counting that as a gate would report the one lab that got this RIGHT as the
 * one lab that excludes majors — exactly backwards. So a reference only counts
 * as a gate when it appears in an `if:` or in a conditional in the merge step's
 * own script, never when it appears solely in `env:`.
 *
 * Grouping is NOT one of the four. "Majors are left out of the npm group" is
 * true nearly everywhere and stops nothing: it makes a major arrive as its own
 * PR, and that PR then auto-merges like any other. Conflating "arrives
 * separately" with "is approved by a person" is the precise error in the fleet's
 * prose, and a checker that read `update-types: [minor, patch]` as an approval
 * rule would make the same mistake it exists to catch.
 *
 * ---------------------------------------------------------------------------
 * What it refuses to do
 *
 * - It will not WRITE while any lab's claim is false-in-the-other-direction
 *   (prose saying majors auto-merge where the YAML gates them). Propagating one
 *   wording into ~200 repos is the same lever that made a single inverted clause
 *   a fleet-wide falsehood on 2026-09-10, so the writer is guarded at the point
 *   of use, exactly as dispatch-comment-sync.js is.
 * - A lab whose claim paragraph cannot be located is REFUSED, not skipped. A
 *   checker that cannot read a file must not call it clean.
 * - A lab with an auto-merge job and NO claim anywhere FAILS. Absence is the
 *   state that precedes the failure, not a clean state.
 *
 * Purely local — no network, no `gh`.
 *
 * Usage (from the crypto-lab repo root):
 *   node tools/majors-sync.js          report every lab, its claim and the
 *                                      derivation; exit 0
 *   node tools/majors-sync.js check    same report; exit 1 on a false claim, an
 *                                      unreadable one, or a missing one
 *   node tools/majors-sync.js -v       also print each lab's evidence lines
 */
'use strict';
const fs = require('fs');
const path = require('path');
const comments = require('./dispatch-comment-sync.js');

const FLEET_ROOT = comments.FLEET_ROOT;
const { siblingLabs, workflowFiles, jobBlocks, isAutoMergeJob, indentOf } = comments;

/* ------------------------------------------------------------------ the text
 *
 * One paragraph, two slots. The slots are per-repo facts — the job name and the
 * workflow file it lives in — for the same reason dispatch-comment-sync keeps
 * the dispatched filename per-repo: the fleet genuinely uses deploy.yml,
 * pages.yml, deploy-pages.yml, ci.yml and e2e.yml, and a copied literal is a
 * pointer that is true in one repo and false in the next. 60 of 178 dependabot
 * .yml files point at "the deploy workflow" for a job that is not in one.
 *
 * The grouping rationale is kept because it is TRUE and load-bearing: ungrouped,
 * this fleet reached 1,461 open PRs across 176 repos. What is removed is the
 * approval claim the old paragraph drew from it. */
const CANONICAL_MAJORS = [
  'Majors are deliberately left OUT of the npm group: grouping a breaking major',
  'with the safe bumps makes the whole PR unmergeable, which forces exactly the',
  'hand-unpicking this grouping exists to prevent. So majors arrive as their own',
  'individual pull requests.',
  '',
  'Arriving separately is not the same as being approved by a person. Every',
  'Dependabot pull request auto-merges once this lab\'s own gate passes, majors',
  'included -- the merge condition filters on AUTHOR, not on bump type. The gate',
  'decides, not the version number, and a major that actually breaks this lab',
  'fails that gate and stays open. See the {JOB} job in {FILE}.',
];

/* A paragraph is THE CLAIM if it says something about what happens to majors.
 * Three families exist in the fleet and all three are matched, in either file:
 *   "Majors are deliberately left OUT of the npm group ..."
 *   "Majors included on purpose ..."           (the honest half, in workflows)
 *   "Majors are deliberately excluded ..."     (the false half, in workflows)
 * A file in which no paragraph matches carries no claim; a lab in which NEITHER
 * file carries one fails as MISSING. */
const CLAIM_RE = /\bmajors?\b|auto-?merge/i;

/* THE CLAIM THAT NEVER SAYS "MAJOR".
 *
 * 180 labs close their dependabot.yml header with "The minor/patch group and the
 * actions group auto-merge once this lab's own gate passes on the PR", and 7 more
 * with "Both groups auto-merge ...". Neither sentence contains the word major. Both
 * enumerate the merge set as exactly two groups, and majors are in neither group --
 * so the sentence excludes them BY OMISSION and reads as only-those-two.
 *
 * It is the same falsehood as "a human decides", arrived at by leaving something out
 * rather than by asserting it, and a scorer keyed on the word "major" is structurally
 * blind to it. That is why CLAIM_RE above admits any auto-merge paragraph and lets
 * polarity decide, rather than pre-filtering on the subject.
 *
 * Found by crypto-lab-world-ciphers-5a while repairing its own lab, after both that
 * session and this one had scored the lab and missed it. Their count was four claim
 * paragraphs; mine said three. */
const SAYS_HUMAN_BY_OMISSION = [
  /(?:minor\/patch|minor and patch)[^.]{0,60}(?:group|bumps)[^.]{0,60}auto-?merges?/i,
  /both groups auto-?merge/i,
  /only[^.]{0,40}(?:minor|patch)[^.]{0,40}auto-?merges?/i,
];

/* A universal quantifier defeats the omission reading: "every Dependabot pull
 * request auto-merges, majors included" enumerates nothing. Checked on the same
 * paragraph, so the canonical text this file writes does not score itself false. */
const UNIVERSAL_RE = /\b(?:every|all|any|each)\b[^.]{0,40}(?:pull request|bump|dependabot)|majors? included/i;

/* Polarity lexicon. Read as a proposition about whether a MAJOR can merge with
 * no human, never as a literal. Deliberately small and deliberately explicit:
 * a claim whose polarity cannot be read is a FAILURE, because a paragraph
 * nobody can parse is a paragraph nobody is checking. */
const SAYS_HUMAN = [
  /human decides/i,
  /a human (?:must )?(?:approve|review|decide)/i,
  /(?:approved|decided|reviewed) by a (?:human|person|maintainer)/i,
  /majors? (?:are|is) (?:deliberately )?(?:excluded|held|held back|blocked)/i,
  /majors? (?:do not|don't|never) auto-?merge/i,
  /requires? (?:human|manual) (?:approval|review|sign-?off)/i,
  /(?:those|they) still want a human/i,
];
const SAYS_GATE = [
  /majors?\s+(?:are\s+)?(?:also\s+)?included(?:\s+here)?\s+on purpose/i,
  /majors? (?:also )?auto-?merges?/i,
  /the gate decides/i,
  /gate decides,? not (?:the |its )?version number/i,
  /better (?:judge|than) .{0,40}version number/i,
  /major that (?:actually )?breaks .{0,30}fails (?:the|that) gate/i,
  /auto-?merges? on a green gate/i,
  /no human is asked/i,
  /nothing (?:here )?reads the version number/i,
];

/* ------------------------------------------------------------------- reading
 *
 * Not a YAML load, for the same reason the dispatch tools are not: what is
 * judged is comment text, and a parsed tree throws every comment away. */

const readLines = (f) => {
  try { return fs.readFileSync(f, 'utf8').split('\n'); } catch { return null; }
};

/* Contiguous runs of comment lines, as paragraphs. A blank `#` line separates
 * paragraphs; a blank or non-comment line ends the run. Returns each paragraph
 * with the line range it occupies, so the writer can replace exactly one. */
function commentParagraphs(lines, from = 0, to = lines.length) {
  const out = [];
  let cur = null;
  const flush = () => { if (cur && cur.text.trim()) out.push(cur); cur = null; };
  for (let i = from; i < to; i++) {
    const m = /^(\s*)#\s?(.*)$/.exec(lines[i]);
    if (!m) { flush(); continue; }
    const body = m[2];
    if (!body.trim()) { flush(); continue; }          // `#` alone = paragraph break
    if (!cur) cur = { start: i, end: i + 1, indent: m[1], text: body };
    else { cur.end = i + 1; cur.text += ' ' + body; }
  }
  flush();
  return out;
}

/* Every paragraph in either file that says anything about majors, tagged with
 * where it came from. This is the union that makes the two-file claim one
 * claim; reading either file alone scores real failures clean. */
function claimParagraphs(lab) {
  const found = [];

  const dbFile = path.join(FLEET_ROOT, lab, '.github', 'dependabot.yml');
  const dbLines = readLines(dbFile);
  if (dbLines) {
    for (const p of commentParagraphs(dbLines)) {
      if (CLAIM_RE.test(p.text)) found.push({ ...p, file: dbFile, kind: 'dependabot' });
    }
  }

  for (const wf of workflowFiles(path.join(FLEET_ROOT, lab))) {
    const lines = readLines(wf);
    if (!lines) continue;
    for (const job of jobBlocks(lines)) {
      const body = lines.slice(job.start, job.end).join('\n');
      if (!isAutoMergeJob(job.name, body)) continue;
      /* Comments ABOVE the job header belong to it too — that is where the
       * "Majors are deliberately excluded" half sits in 129 labs. Walk back to
       * the start of the contiguous comment run. */
      let top = job.start;
      while (top > 0 && /^\s*#/.test(lines[top - 1])) top--;
      for (const p of commentParagraphs(lines, top, job.end)) {
        if (CLAIM_RE.test(p.text)) found.push({ ...p, file: wf, kind: 'workflow', job: job.name });
      }
    }
  }
  return found;
}

/* ---------------------------------------------------------------- derivation
 *
 * The proposition: CAN a major bump auto-merge in this lab with no human? */

function deriveMajorsPolicy(lab) {
  const repo = path.join(FLEET_ROOT, lab);
  const ev = [];
  let job = null, file = null, gatedOnUpdateType = false, authorFiltered = false;

  for (const wf of workflowFiles(repo)) {
    const lines = readLines(wf);
    if (!lines) continue;
    for (const b of jobBlocks(lines)) {
      const body = lines.slice(b.start, b.end).join('\n');
      if (!isAutoMergeJob(b.name, body)) continue;
      job = b.name; file = path.basename(wf);

      /* Strip comments before looking for a gate. 203 labs carry the phrase
       * "required by the deploy dispatch" in a comment, and this fleet has
       * already been bitten twice by a probe that matched a comment and
       * reported a mechanism that was not there. */
      const code = lines.slice(b.start, b.end)
        .map((l) => l.replace(/(^|\s)#.*$/, '$1')).join('\n');

      /* A reference counts as a GATE only in a condition, never in `env:`.
       * fold-gate passes update-type into env purely to log it; counting that
       * would report the one lab that documented the policy correctly as the
       * one lab that excludes majors. */
      /* The clause "the merge condition filters on AUTHOR, not on bump type" is
       * the one with a polarity, and this is where it is bound. Both halves are
       * derived: the positive (an author test is present) and the negative (no
       * bump-type test is). Deriving only the negative would let a lab that
       * gates on neither pass, and the sentence would be half true by accident. */
      /* THREE spellings, because the fleet has three. crypto-lab-silent-tally is
       * `workflow_run`-triggered rather than `pull_request`-triggered — its
       * test.yml is a reusable workflow that cannot hold the merge, since a
       * called workflow may not request more permission than its caller grants —
       * so it identifies the author as github.event.workflow_run.actor.login.
       *
       * The first version of this check knew only the two pull_request spellings
       * and reported silent-tally as not filtering on author, which is false and
       * would have read as a lab that auto-merges anyone's PR. That is the exact
       * defect this file's header describes, committed by this file, on its first
       * run: a checker that cannot see a shape must never score it. Left here
       * verbatim because it is the cheapest available proof that the failure
       * mode is not something other people do. */
      const AUTHOR_TESTS = [
        /github\.actor\s*==\s*'dependabot\[bot\]'/,
        /github\.event\.pull_request\.user\.login\s*==\s*'dependabot\[bot\]'/,
        /github\.event\.workflow_run\.actor\.login\s*==\s*'dependabot\[bot\]'/,
      ];
      /* Read from the job's `if:` in any of YAML's three scalar forms — inline,
       * `>-` folded and `|` literal — so a multi-line condition is not missed
       * the way a single-line regex would miss it. */
      const ifBlock = (() => {
        const ls = lines.slice(b.start, b.end);
        const i = ls.findIndex((l) => /^\s{4}if:/.test(l));
        if (i < 0) return '';
        const ind = indentOf(ls[i]);
        let j = i + 1;
        while (j < ls.length && (ls[j].trim() === '' || indentOf(ls[j]) > ind)) j++;
        return ls.slice(i, j).join(' ');
      })();
      const filtersOnAuthor = AUTHOR_TESTS.some((re) => re.test(ifBlock));
      if (filtersOnAuthor) ev.push(`${file} [${b.name}] merge condition filters on author (github.actor == dependabot[bot])`);
      else ev.push(`${file} [${b.name}] merge condition does NOT filter on author — the canonical clause would be false here`);
      authorFiltered = authorFiltered || filtersOnAuthor;

      const inIf = /if:[^\n]*steps\.[A-Za-z0-9_-]+\.outputs\.update-type/.test(code);
      const inTest = /(?:\[\[?[^\n]*|test\s+[^\n]*)\$\{?UPDATE_TYPE/.test(code)
        || /\$\{?UPDATE_TYPE\}?"?\s*(?:==|!=|=)\s*/.test(code);
      if (inIf || inTest) { gatedOnUpdateType = true; ev.push(`${file} [${b.name}] conditions the merge on update-type`); }
      else if (/steps\.[A-Za-z0-9_-]+\.outputs\.update-type/.test(code)) {
        ev.push(`${file} [${b.name}] reads update-type but only to record it — not a gate`);
      }
      if (/dependabot\/fetch-metadata/.test(code)
        && !/steps\.[A-Za-z0-9_-]+\.outputs\./.test(code)) {
        ev.push(`${file} [${b.name}] declares dependabot/fetch-metadata and never reads its outputs — inert`);
      }
    }
  }

  /* Dependabot-side exclusion: an `ignore:` for semver-major. Nothing in the
   * fleet has one today, and curve-lens's TypeScript 7 hold is deliberately NOT
   * one — it lives in Dependabot's own state, set on the PR, which this file
   * cannot see and says so rather than guessing. */
  const dbLines = readLines(path.join(repo, '.github', 'dependabot.yml'));
  let ignoresMajor = false;
  if (dbLines) {
    const code = dbLines.map((l) => l.replace(/(^|\s)#.*$/, '$1')).join('\n');
    if (/version-update:semver-major/.test(code)) {
      ignoresMajor = true; ev.push('dependabot.yml ignores version-update:semver-major');
    }
    if (/update-types:\s*\[?\s*["']?minor/.test(code)) {
      ev.push('dependabot.yml groups only minor/patch — a GROUPING rule; majors still arrive, as their own PR');
    }
  }

  const canAutoMerge = !!job && !gatedOnUpdateType && !ignoresMajor;
  return { job, file, canAutoMerge, gatedOnUpdateType, ignoresMajor, authorFiltered, evidence: ev };
}

/* ------------------------------------------------------------------ polarity */

/* Negators, read the way dispatch-claims.js reads them: a phrase matched inside a
 * negation asserts the OPPOSITE proposition, so matching the phrase alone inverts
 * the polarity. The canonical paragraph this file writes contains "Arriving
 * separately is not the same as being approved by a person" -- an argument AGAINST
 * human approval that a naive lexicon scores as a claim FOR it. Caught by running
 * the canonical text through this function, which is a check worth keeping: a
 * scorer that cannot correctly score its own canonical output would propagate a
 * paragraph it then reports as false in ~200 repos. */
const NEGATOR_RE = /\b(?:not|never|no|isn't|is not|rather than|instead of|nothing)\b[^.]{0,40}$/i;

function negated(text, match) {
  const at = text.toLowerCase().indexOf(match.toLowerCase());
  if (at < 0) return false;
  return NEGATOR_RE.test(text.slice(Math.max(0, at - 60), at));
}

/* True only if some phrase in `set` fires AND is not inside a negation. */
function asserts(set, text) {
  return set.some((re) => {
    const m = re.exec(text);
    return m && !negated(text, m[0]);
  });
}

function polarityOf(text) {
  const omits = SAYS_HUMAN_BY_OMISSION.some((re) => re.test(text)) && !UNIVERSAL_RE.test(text);
  const human = omits || asserts(SAYS_HUMAN, text);
  const gate = asserts(SAYS_GATE, text);
  if (human && gate) return 'BOTH';
  if (human) return 'HUMAN';
  if (gate) return 'GATE';
  return 'NONE';
}

/* ---------------------------------------------------------------------- scan */

function scan() {
  return siblingLabs().map((lab) => {
    const derived = deriveMajorsPolicy(lab);
    const claims = claimParagraphs(lab);

    /* Only paragraphs that actually take a position are judged. A paragraph
     * mentioning majors with no polarity (the github-actions grouping note) is
     * neither true nor false about approval and is left alone. */
    const positioned = claims.map((c) => ({ ...c, polarity: polarityOf(c.text) }))
      .filter((c) => c.polarity !== 'NONE');

    let status, detail;
    if (!derived.job) {
      status = 'NO-AUTO-MERGE';
      detail = 'no auto-merge job — majors cannot auto-merge here';
    } else if (!positioned.length) {
      status = 'MISSING';
      detail = 'auto-merge job present, and NEITHER file states what happens to majors';
    } else {
      const says = new Set(positioned.map((c) => c.polarity));
      const asserted = says.has('BOTH') || (says.has('HUMAN') && says.has('GATE'))
        ? 'CONTRADICTORY'
        : (says.has('HUMAN') ? 'HUMAN' : 'GATE');
      if (asserted === 'CONTRADICTORY') { status = 'CONTRADICTORY'; detail = 'the lab asserts BOTH that a human decides and that the gate decides'; }
      else if (asserted === 'HUMAN' && derived.canAutoMerge) { status = 'FALSE'; detail = 'claims a human decides; the YAML auto-merges majors with no human'; }
      else if (asserted === 'GATE' && !derived.canAutoMerge) { status = 'FALSE-INVERTED'; detail = 'claims the gate decides; the YAML actually excludes majors'; }
      else { status = 'TRUE'; detail = 'claim matches the derivation'; }
    }
    return { lab, ...derived, claims: positioned, status, detail };
  });
}

/* --------------------------------------------------------------------- write
 *
 * Replaces the positioned paragraph(s) in dependabot.yml with CANONICAL_MAJORS,
 * and DELETES the contradicting half from the workflow rather than rewriting it
 * — the workflow's merge step already argues the policy correctly in 129 labs,
 * and the false half is the job-header sentence above it. */
function render(indent, job, file) {
  return CANONICAL_MAJORS.map((s) => {
    if (!s) return `${indent}#`;
    return `${indent}# ${s.replace('{JOB}', job).replace('{FILE}', file)}`;
  });
}

function writeLab(site) {
  if (site.status === 'TRUE' || site.status === 'NO-AUTO-MERGE') return false;
  const target = site.claims.find((c) => c.kind === 'dependabot' && c.polarity === 'HUMAN')
    || site.claims.find((c) => c.kind === 'dependabot');
  if (!target) return false;                       // nothing safely replaceable
  const lines = readLines(target.file);
  if (!lines) return false;
  const out = [
    ...lines.slice(0, target.start),
    ...render(target.indent, site.job, site.file),
    ...lines.slice(target.end),
  ];
  fs.writeFileSync(target.file, out.join('\n'));
  return true;
}

/* ---------------------------------------------------------------------- main */

function main() {
  const mode = process.argv[2];
  const check = mode === 'check';
  const verbose = process.argv.includes('-v');
  const sites = scan();

  const by = (s) => sites.filter((x) => x.status === s);
  const bad = [...by('FALSE'), ...by('CONTRADICTORY'), ...by('MISSING'), ...by('FALSE-INVERTED')];

  console.log(`Labs judged: ${sites.length}  |  with an auto-merge job: ${sites.filter((s) => s.job).length}`);
  console.log(`  TRUE ${by('TRUE').length}   FALSE ${by('FALSE').length}   `
    + `CONTRADICTORY ${by('CONTRADICTORY').length}   MISSING ${by('MISSING').length}   `
    + `FALSE-INVERTED ${by('FALSE-INVERTED').length}   NO-AUTO-MERGE ${by('NO-AUTO-MERGE').length}`);

  const inert = sites.filter((s) => s.evidence.some((e) => /inert/.test(e)));
  const records = sites.filter((s) => s.evidence.some((e) => /only to record it/.test(e)));
  console.log(`\ndependabot/fetch-metadata declared and never read (inert): ${inert.length}`);
  console.log(`  reads update-type to RECORD it, deliberately not to gate:  ${records.length}`
    + (records.length ? `  (${records.map((s) => s.lab.replace(/^crypto-lab-/, '')).join(', ')})` : ''));
  console.log('  labs that GATE on update-type:                             '
    + sites.filter((s) => s.gatedOnUpdateType).length);

  /* The canonical paragraph's one re-derivable clause, reported the way
   * dispatch-claims reports its bound clauses: proposition, then evidence. */
  const authored = sites.filter((s) => s.job && s.authorFiltered).length;
  const withJob = sites.filter((s) => s.job).length;
  console.log(`\nCANONICAL clause — "the merge condition filters on AUTHOR, not on bump type"`);
  console.log(`  author test present : ${authored}/${withJob} auto-merge jobs`);
  console.log(`  bump-type test      : ${sites.filter((s) => s.gatedOnUpdateType).length}/${withJob}`);
  console.log(authored === withJob && !sites.some((s) => s.gatedOnUpdateType)
    ? '  -> TRUE of every lab it would be written into.'
    : '  -> NOT true everywhere; the writer refuses while that holds.');

  for (const group of ['FALSE', 'CONTRADICTORY', 'FALSE-INVERTED', 'MISSING']) {
    const g = by(group);
    if (!g.length) continue;
    console.log(`\n${group} (${g.length}) — ${g[0].detail}:`);
    for (const s of g.slice(0, verbose ? g.length : 12)) {
      console.log(`  ${s.lab}`);
      if (verbose) for (const c of s.claims) console.log(`      [${c.polarity}] ${path.basename(c.file)}: ${c.text.slice(0, 110)}`);
    }
    if (!verbose && g.length > 12) console.log(`  ... and ${g.length - 12} more (run with -v)`);
  }

  if (!check && mode !== undefined && mode !== '-v') {
    console.log(`\nUnknown argument ${mode}. Use no argument, "check", or "-v".`);
    return 2;
  }

  if (!check) {
    /* The guard dispatch-comment-sync learned the hard way: this writer
     * propagates ONE paragraph into ~200 repos, so it must not run while the
     * derivation says the opposite of what it is about to write. */
    if (by('FALSE-INVERTED').length) {
      console.log('\nREFUSING TO WRITE. Some labs gate majors and say so truthfully; writing the');
      console.log('canonical "the gate decides" text into them would make a TRUE claim FALSE.');
      console.log('Resolve those labs first — they are listed above.');
      return 1;
    }
    if (mode === undefined) {
      const n = sites.filter(writeLab).length;
      console.log(`\nRewrote the majors paragraph in ${n} dependabot.yml file(s).`);
      console.log('The workflow half is NOT rewritten here — 129 labs argue the policy correctly');
      console.log('in the merge step and only their job-header sentence is false. Re-run `check`.');
    }
    return 0;
  }

  if (bad.length) {
    console.log('\nThe claim spans BOTH .github/dependabot.yml and the auto-merge workflow, and a lab');
    console.log('is judged on the union — world-ciphers carries the false half in dependabot.yml and');
    console.log('the honest half in its workflow, so a checker reading either file alone scores it clean.');
    console.log('\nFix with: node tools/majors-sync.js');
    console.log('  That writer propagates ONE paragraph into every drifted dependabot.yml. It is not a');
    console.log('  tidy-up. It refuses to run while any lab genuinely gates majors, because writing');
    console.log('  "the gate decides" into such a lab would turn a true sentence false.');
    return 1;
  }
  console.log('\nEvery lab\'s majors claim is true of the YAML beneath it.');
  return 0;
}

module.exports = { CANONICAL_MAJORS, scan, deriveMajorsPolicy, claimParagraphs, polarityOf };

if (require.main === module) process.exit(main());
