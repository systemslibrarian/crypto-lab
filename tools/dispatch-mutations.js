#!/usr/bin/env node
/*
 * dispatch-mutations.js — the permanent mutation set for the dispatch checkers.
 *
 * Every fix in this family was made because a checker reported clean over
 * something it could not see. The only durable defence against that is a set of
 * edits that MUST be caught, replayed on every run, so a later refactor that
 * quietly stops catching one of them goes red here instead of going unnoticed
 * for months.
 *
 * Each mutation is a real file under tools/fixtures/dispatch/mutations/, not a
 * string built at run time, so it can be read, diffed and argued with.
 *
 *   M1  CANONICAL says the API dispatch IS suppressed        -> dispatch-claims
 *   M2  CANONICAL says the dispatched run SKIPS the gate     -> dispatch-claims
 *   M3  CANONICAL says a GITHUB_TOKEN merge RAISES a push event
 *                                                            -> dispatch-claims
 *   M4  the auto-merge merges with `gh api ... /merge`        -> dispatch-census
 *   M5  the job map is indented four spaces                   -> dispatch-census
 *   M6  the dispatch line is deleted, the paragraph stays     -> dispatch-census
 *   M7  CANONICAL reworded, same meaning — MUST NOT fail      -> dispatch-claims
 *   M8  the derivation goes blind and sees 0 sites            -> dispatch-claims
 *
 * M1 is the one the 2026-09-10 audit reproduced by hand: with it in place,
 * `node tools/dispatch-proof.js` printed "37 passed, 0 failed" and
 * `dispatch-sync check` went red only because the repos still held the old text,
 * pointing at the writer that would have propagated the false sentence to ~195
 * repos. It is kept here so that path can never be walked in silence again.
 *
 * M7 is the negative control and it is not optional. A checker that fails on
 * ANY change to the paragraph would be the frozen-prose failure one layer up:
 * it would pin the wording rather than the truth. M7 rewrites every clause and
 * must stay green.
 *
 * M7 is scoped to the CLAUSE BINDING, and the scope is worth stating: it does
 * NOT claim the paragraph can be reworded with no other consequence.
 * normaliseBlock still splits the rationale on its closing claim via
 * TERMINAL_RE, so a rewording that changes that closing line must update
 * TERMINAL_RE too — a real structural coupling, not frozen prose, and
 * dispatch-proof A6 names it when it breaks. Measured at HEAD: rewording
 * CANONICAL to M7's text made A6 red on exactly one check, and the FALSE
 * mutations M2 and M3 made it red on the same check — which is why HEAD's
 * redness carried no information about truth, and this file exists.
 *
 * Two things every mutation here asserts, in this order:
 *   1. the UNMUTATED baseline is clean, so the mutation is what fails;
 *   2. the mutation is caught AND NAMED by the check that owns it.
 * A mutation that fails on both sides proves nothing, and this file says so
 * rather than counting it.
 *
 * Purely local — no network, no `gh`. The CANONICAL mutations re-derive the
 * fleet evidence once and reuse it, so the whole run is a few seconds.
 *
 * Usage (from the crypto-lab repo root):
 *   node tools/dispatch-mutations.js        replay every mutation; exit 1 if any
 *                                           survives (or if a control fails)
 *   node tools/dispatch-mutations.js -v     also print each failure's own text
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const claims = require('./dispatch-claims.js');
const census = require('./dispatch-census.js');
const comments = require('./dispatch-comment-sync.js');
const dispatchSync = require('./dispatch-sync.js');

const DIR = path.join(__dirname, 'fixtures', 'dispatch', 'mutations');
const BASELINE = path.join(DIR, 'baseline-attestation-gate.yml');
const LAB = 'crypto-lab-mutant';

let pass = 0;
let fail = 0;
let verbose = false;
const check = (name, ok, detail) => {
  if (ok) { pass++; console.log(`    ok    ${name}`); } else { fail++; console.log(`    FAIL  ${name}`); }
  if (detail && (verbose || !ok)) console.log(`            ${String(detail).replace(/\n/g, '\n            ')}`);
};

/* -------------------------------------------------------- CANONICAL mutations
 *
 * A .txt fixture is the paragraph as it would be written into ~195 repos: the
 * lines of CANONICAL, without the leading `# ` each site supplies itself. */
const canonicalOf = (file) => fs.readFileSync(path.join(DIR, file), 'utf8').replace(/\n+$/, '').split('\n');

const TEXT_MUTATIONS = [
  { id: 'M1', file: 'M1-dispatch-suppressed.txt', clause: 'dispatch-honoured',
    what: '"a workflow_dispatch through the API is suppressed too" — the inversion the 2026-09-10 audit '
      + 'reproduced, which every gate passed' },
  { id: 'M2', file: 'M2-gate-skipped.txt', clause: 'same-gate-then-deploy',
    what: '"skips the gate-then-deploy pipeline, so a bad merge ships anyway"' },
  { id: 'M3', file: 'M3-push-event-raised.txt', clause: 'push-event-suppressed',
    what: '"raises a push event like any other, so the deploy workflow reruns itself"' },
];

function textMutations(evidence) {
  console.log('\nCANONICAL mutations — a clause that becomes FALSE must fail the proof');
  const baseline = claims.verify({ evidence });
  check('baseline: every bound clause of the live CANONICAL is true',
    baseline.failures.length === 0,
    baseline.failures.map((f) => `${f.id}: ${f.status}`).join('\n'));

  for (const m of TEXT_MUTATIONS) {
    console.log(`\n  ${m.id}  ${m.what}`);
    const v = claims.verify({ canonical: canonicalOf(m.file), evidence });
    const row = v.rows.find((r) => r.id === m.clause);
    const others = v.rows.filter((r) => r.id !== m.clause && !r.ok);
    check(`${m.id} is caught, and named: clause \`${m.clause}\``,
      !!row && !row.ok,
      row ? `${row.status}: asserted ${JSON.stringify(row.asserted)} vs derived ${JSON.stringify(row.derived)}\n${row.evidence || ''}`
        : `clause ${m.clause} was not evaluated at all`);
    check(`${m.id} fails only the clause it mutates`,
      others.length === 0,
      others.map((o) => `${o.id}: ${o.status}`).join('\n'));
    if (row && !row.ok) {
      const wasCleanAtBaseline = baseline.rows.find((r) => r.id === m.clause);
      check(`${m.id} is a real mutation (that clause passes unmutated, so it is not failing on both sides)`,
        !!wasCleanAtBaseline && wasCleanAtBaseline.ok,
        wasCleanAtBaseline ? wasCleanAtBaseline.status : 'clause missing at baseline');
    }
  }

  /* The negative control. */
  console.log('\n  M7  every clause reworded, meaning unchanged — MUST stay green');
  const reworded = claims.verify({ canonical: canonicalOf('M7-reworded-still-true.txt'), evidence });
  check('M7 passes: the check binds the claim, not the wording',
    reworded.failures.length === 0,
    reworded.failures.map((f) => `${f.id}: ${f.status} — ${f.why || ''}`).join('\n'));

  /* The mutation against THIS FIX. Every clause is supported by the ABSENCE of
   * counter-evidence, so a derivation that stopped seeing the fleet would
   * report all three true over nothing — the same defect one layer up,
   * committed by the check written to fix it. */
  console.log('\n  M8  the derivation goes blind (0 sites) — the clauses still "pass", so coverage must fail');
  const blind = JSON.parse(JSON.stringify(evidence));
  blind.sites = [];
  for (const k of Object.keys(blind.totals)) {
    if (Array.isArray(blind.totals[k])) blind.totals[k] = [];
  }
  blind.totals.sites = 0;
  const blindV = claims.verify({ evidence: blind });
  check('M8 is caught, and named: clause `evidence-coverage`',
    blindV.failures.some((f) => f.id === 'evidence-coverage'),
    blindV.rows.map((r) => `${r.id}=${r.status}`).join(' '));
  check('M8 is a real mutation (the three factual clauses still read true on no evidence)',
    blindV.rows.filter((r) => r.id !== 'evidence-coverage').every((r) => r.ok),
    blindV.rows.map((r) => `${r.id}=${r.status}`).join(' '));
}

/* ------------------------------------------------------------ fleet mutations
 *
 * Each runs over a synthetic one-lab fleet in a temp directory: the baseline
 * fixture is observed and pinned as the census, then the mutated fixture is put
 * in its place and compared against that pin. That is exactly the sequence the
 * real fleet goes through when a lab drifts, minus the 195 labs that are not
 * changing. */
function miniFleet(fixture) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dispatch-mutations-'));
  const wf = path.join(root, LAB, '.github', 'workflows');
  fs.mkdirSync(wf, { recursive: true });
  fs.copyFileSync(fixture, path.join(wf, 'deploy.yml'));
  return root;
}

const FLEET_MUTATIONS = [
  { id: 'M4', file: 'M4-merge-via-gh-api.yml',
    what: 'the auto-merge merges with `gh api -X PUT repos/.../merge` instead of `gh pr merge`',
    expect: [/UNRECOGNISED .*MERGE-NOT-RECOGNISED/, /MISSING-JOB/, /MISSING-SITE/, /COUNT/] },
  { id: 'M5', file: 'M5-four-space-job-map.yml',
    what: 'the job map is indented four spaces — valid YAML, jobs intact, GitHub runs it',
    expect: [/UNRECOGNISED .*JOB-MAP-UNREADABLE/, /MISSING-JOB/, /MISSING-SITE/, /COUNT/] },
  { id: 'M6', file: 'M6-dispatch-line-deleted.yml',
    what: 'the `gh workflow run` line is deleted; the paragraph defending it stays',
    expect: [/UNRECOGNISED .*RATIONALE-WITHOUT-DISPATCH/, /MISSING-SITE/, /COUNT/] },
];

function fleetMutations() {
  console.log('\nFLEET mutations — a lab that stops being classifiable must be NAMED, not subtracted');

  const baseRoot = miniFleet(BASELINE);
  const baseRows = census.observe(baseRoot);
  const pinned = census.buildCensus(baseRows, baseRoot);
  const baseCmp = census.compare(baseRows, pinned);
  check('baseline: the unmutated lab is classifiable and matches its own census',
    baseCmp.fails.length === 0 && pinned.totals.autoMergeJobs === 1 && pinned.totals.dispatchSites === 1,
    `${JSON.stringify(pinned.totals)} ${baseCmp.fails.map((f) => f.kind).join(',')}`);

  for (const m of FLEET_MUTATIONS) {
    console.log(`\n  ${m.id}  ${m.what}`);
    const root = miniFleet(path.join(DIR, m.file));
    const rows = census.observe(root);
    const { fails, observed } = census.compare(rows, pinned);
    const named = fails.map((f) => `${f.kind}  ${f.repo} — ${f.why}`);

    /* What the checkers said BEFORE the census existed: the numbers alone. */
    const scanned = comments.scan(root).length;
    const verdicts = dispatchSync.inspectText(fs.readFileSync(path.join(DIR, m.file), 'utf8'))
      .map((r) => r.verdict);
    console.log(`        the silent half: dispatch-comment-sync sites ${pinned.totals.dispatchSites} -> ${scanned}`
      + `, auto-merge jobs ${pinned.totals.autoMergeJobs} -> ${observed.autoMergeJobs}`
      + `, dispatch-sync verdicts [${verdicts.join(',') || 'none — the job is not even seen'}]`);

    for (const re of m.expect) {
      check(`${m.id} produces ${re.source}`,
        named.some((n) => re.test(n)),
        named.join('\n') || 'no failures at all — the lab vanished in silence');
    }
    if (verbose) named.forEach((n) => console.log(`            ${n}`));
  }
}

/* Run the whole set. `evidence` is passed in by tools/dispatch-proof.js so the
 * fleet is walked once per run rather than twice. */
function run({ evidence, verbose: v = false } = {}) {
  const before = { pass, fail };
  verbose = v;
  const ev = evidence || claims.derive();
  textMutations(ev);
  fleetMutations();
  return { pass: pass - before.pass, fail: fail - before.fail };
}

function main() {
  console.log('Replaying the permanent dispatch mutation set.');
  const evidence = claims.derive();
  console.log(`(fleet evidence re-derived once: ${evidence.totals.sites} dispatch sites)`);
  run({ evidence, verbose: process.argv.includes('-v') });
  console.log(`\n${pass} passed, ${fail} failed`);
  if (fail) {
    console.log('\nA mutation that is no longer caught means the check that owned it has stopped seeing.');
    console.log('Fix the check — do NOT relax the mutation.');
  }
  return fail ? 1 : 0;
}

module.exports = { run, TEXT_MUTATIONS, FLEET_MUTATIONS, canonicalOf, miniFleet, DIR, BASELINE };

if (require.main === module) process.exit(main());
