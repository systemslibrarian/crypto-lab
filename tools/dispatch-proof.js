#!/usr/bin/env node
/*
 * dispatch-proof.js — the evidence for tools/dispatch-sync.js and
 * tools/transform.mjs, made re-runnable.
 *
 * The auto-merge rewrite was justified by a proof that existed only in a
 * transcript: the validator passes the labs that already had the fix, fails the
 * old construct, the transform turns one into the other, and under the injected
 * fault the old construct ships nothing while the new one ships. None of that
 * could be re-run, which means none of it could be re-checked after any later
 * edit to either tool. This file is that proof as a test.
 *
 * Everything here runs the REAL tools — dispatch-sync's own inspectText(),
 * transform.mjs's own transform(), dispatch-comment-sync's own normaliseBlock().
 * Nothing is reimplemented. Fixtures under tools/fixtures/dispatch/ are verbatim
 * git captures, named in each check.
 *
 * A note on the count: dispatch-sync's header says EIGHT labs shipped the flag
 * idiom first. Nine did. Rerunning the pre-rewrite validator over the fleet
 * reported "9 sound", and the nine are the fixtures in reference/ — the ninth is
 * crypto-lab-silent-tally, whose job is called `merge` and lives in its own
 * workflow file, which is probably why it was not counted. The fixture set is
 * nine because nine is what passes.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE USED TO PROVE, AND WHAT IT MISSED
 *
 * Until 2026-09-10 every check here compared the FLEET against CANONICAL and
 * none compared CANONICAL against the fleet. So inverting the load-bearing
 * clause — "a workflow_dispatch through the API is not suppressed" -> "is
 * suppressed too", which is false — left this file printing "37 passed, 0
 * failed", exit 0. The only thing that went red was the drift checker, because
 * the repos still held the OLD text, and its remedy line pointed at the writer
 * that would have made the false sentence fleet-wide.
 *
 * A5 now runs ONE derivation (tools/dispatch-claims.js) over the live fleet, and
 * A7 binds each factual clause of CANONICAL to it by POLARITY: reword the
 * paragraph freely and A7 stays green, invert a claim and it fails, naming the
 * clause and the evidence that contradicts it.
 *
 * A7 does not claim every sentence is checked. Two are not derivable from this
 * fleet's YAML and are printed as UNBOUND on every run rather than being counted
 * as verified — chiefly whether GitHub really suppresses the push event of a
 * GITHUB_TOKEN merge, which is platform behaviour.
 *
 * M replays tools/dispatch-mutations.js — the permanent mutation set, including
 * that inversion, so it can never be a passing run again.
 *
 * Usage:
 *   node tools/dispatch-proof.js          run every check, exit 1 on any failure
 *   node tools/dispatch-proof.js -v       also print each check's detail
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const verbose = process.argv.includes('-v');
const FIX = path.join(__dirname, 'fixtures', 'dispatch');
const REF = path.join(FIX, 'reference');

const dispatchSync = require('./dispatch-sync.js');
const comments = require('./dispatch-comment-sync.js');
const claims = require('./dispatch-claims.js');
const mutations = require('./dispatch-mutations.js');

let pass = 0;
let fail = 0;
const check = (name, ok, detail) => {
  if (ok) { pass++; console.log(`  ok    ${name}`); } else { fail++; console.log(`  FAIL  ${name}`); }
  if (detail && (verbose || !ok)) console.log(`          ${String(detail).replace(/\n/g, '\n          ')}`);
};

/* ------------------------------------------------------------------- A1 */
console.log('\nA1  the validator passes the reference labs, untouched');
const refs = fs.readdirSync(REF).filter((f) => f.endsWith('.yml')).sort();
check('nine reference fixtures present', refs.length === 9, `found ${refs.length}: ${refs.join(', ')}`);
for (const f of refs) {
  const rows = dispatchSync.inspectText(fs.readFileSync(path.join(REF, f), 'utf8'));
  check(`${f.replace(/\.yml$/, '')} → OK`,
    rows.length === 1 && rows[0].verdict === 'OK',
    rows.map((r) => `[${r.job}] ${r.verdict}: ${r.detail}`).join('\n'));
}

/* ------------------------------------------------------------------- A2 */
console.log('\nA2  the validator fails the old construct');
const oldText = fs.readFileSync(path.join(FIX, 'old-construct.yml'), 'utf8');
const oldRows = dispatchSync.inspectText(oldText);
check('old-construct.yml → RE-QUERY',
  oldRows.length === 1 && oldRows[0].verdict === 'RE-QUERY',
  oldRows.map((r) => `[${r.job}] ${r.verdict}: ${r.detail}`).join('\n'));
check('old-construct.yml really contains the re-query it is judged on',
  /gh pr view[\s\S]*?\|\s*grep/.test(oldText));

/* ------------------------------------------------------------------- A3 */
console.log('\nA3  the transform turns the old construct into the shape the validator accepts');
(async () => {
  const { transform } = await import('./transform.mjs');

  const first = transform(oldText, 'old-construct.yml');
  check('transform reports REWRITTEN',
    first.results.length === 1 && first.results[0].status === 'REWRITTEN',
    JSON.stringify(first.results));
  check('the dispatched filename is carried across, not assumed',
    first.results[0] && first.results[0].dispatch === 'deploy.yml',
    `dispatch=${first.results[0] && first.results[0].dispatch}`);
  check('the transformed text passes the validator',
    dispatchSync.inspectText(first.text).every((r) => r.verdict === 'OK'),
    dispatchSync.inspectText(first.text).map((r) => `${r.verdict}: ${r.detail}`).join('\n'));
  check('no `gh pr view` survives',
    !/gh pr view/.test(first.text));

  const second = transform(first.text, 'old-construct.yml (2nd pass)');
  check('transform is idempotent (2nd pass reports ALREADY, text unchanged)',
    second.text === first.text && second.results.every((r) => r.status === 'ALREADY'),
    JSON.stringify(second.results));

  /* The narrowed preserve-rule: transform must emit the canonical rationale,
   * not whatever wording the source file happened to carry. old-construct.yml
   * (from crypto-lab-aegis-gate) already had the canonical wording, so it cannot
   * tell the two behaviours apart. old-construct-drifted.yml (from
   * crypto-lab-kmac-gate, pre-rewrite) carries one of the 35 variants instead —
   * this is the check that fails if someone restores the old "preserve every
   * comment line verbatim" behaviour. */
  console.log('\nA3b  transform emits the canonical rationale, not the source file\'s wording');
  const canon = comments.CANONICAL.map((s) => `# ${s}`).join('\n');
  const flatten = (t) => t.split('\n').map((l) => l.trim()).join('\n');
  const driftText = fs.readFileSync(path.join(FIX, 'old-construct-drifted.yml'), 'utf8');
  check('the drifted fixture does NOT carry the canonical wording',
    !flatten(driftText).includes(canon));
  check('the drifted fixture does carry a variant of it',
    comments.RATIONALE_RE.test(driftText));
  const drifted = transform(driftText, 'old-construct-drifted.yml');
  check('transform reports REWRITTEN on the drifted fixture',
    drifted.results.length === 1 && drifted.results[0].status === 'REWRITTEN',
    JSON.stringify(drifted.results));
  check('transform output carries the canonical paragraph — produced, not copied',
    flatten(drifted.text).includes(canon));
  check('the transformed drifted fixture passes the validator',
    dispatchSync.inspectText(drifted.text).every((r) => r.verdict === 'OK'),
    dispatchSync.inspectText(drifted.text).map((r) => `${r.verdict}: ${r.detail}`).join('\n'));
  check('canonical paragraph also present when the source already had it',
    flatten(first.text).includes(canon));

  /* ----------------------------------------------------------------- A4 */
  console.log('\nA4  the injected fault fires: `gh pr view` fails');
  const script = `
gh() {
  case "$1 $2" in
    "pr merge")    echo "merged ok"; return 0;;
    "pr view")     echo "gh: connection reset by peer (HTTP 502)" >&2; return 1;;
    "workflow run") echo "DISPATCH FIRED: $*"; return 0;;
  esac
  return 0
}
export PR_URL=x GITHUB_REPOSITORY=systemslibrarian/x

echo "== OLD =="
( set -e
  for attempt in 1 2 3; do
    if gh pr merge --squash --delete-branch "$PR_URL"; then exit 0; fi
    sleep 0
  done ) >/dev/null 2>&1
echo "old merge step exit=$?"
out=$( ( set -e
  if gh pr view "$PR_URL" --json state --jq .state | grep -q MERGED; then
    gh workflow run deploy.yml --repo "$GITHUB_REPOSITORY" --ref main \\
      || echo "::warning::deploy dispatch failed"
  fi ) 2>&1 )
echo "old deploy step exit=$? stdout=[$out]"

echo "== NEW =="
out=$( ( set -e
  merged=""
  for attempt in 1 2 3; do
    if gh pr merge --squash --delete-branch "$PR_URL"; then merged=1; break; fi
    sleep 0
  done
  if [ -z "$merged" ]; then echo "::warning::gate passed, merge did not land"; exit 0; fi
  gh workflow run deploy.yml --repo "$GITHUB_REPOSITORY" --ref main ) 2>&1 )
echo "new step exit=$? stdout=[$out]"
`;
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'dispatch-proof-')), 'fault.sh');
  fs.writeFileSync(tmp, script);
  const out = execFileSync('bash', [tmp], { encoding: 'utf8' });
  if (verbose) console.log(out.split('\n').map((l) => `          ${l}`).join('\n'));
  const oldDeploy = /old deploy step exit=(\d+) stdout=\[([^\]]*)\]/.exec(out);
  const newStep = /new step exit=(\d+) stdout=\[([^\]]*)\]/.exec(out);
  check('OLD: deploy step exits 0', oldDeploy && oldDeploy[1] === '0', out);
  check('OLD: no dispatch fires', oldDeploy && !/DISPATCH FIRED/.test(oldDeploy[2]), oldDeploy && oldDeploy[2]);
  check('OLD: not even the `|| echo "::warning::"` fires',
    oldDeploy && !/::warning::/.test(oldDeploy[2]), oldDeploy && `stdout=[${oldDeploy[2]}]`);
  check('NEW: the dispatch fires under the same fault',
    newStep && /DISPATCH FIRED/.test(newStep[2]), newStep && newStep[2]);

  /* ----------------------------------------------------------------- A5
   *
   * The derivation itself now lives in tools/dispatch-claims.js, for one
   * reason: A5 used to derive the evidence HERE and compare it to nothing, so
   * the paragraph and the fleet were never actually put side by side. One
   * derivation, used by the proof, by dispatch-sync and by the writer's own
   * guard, is what makes A7 below possible at all.
   *
   * The gate walk is also stricter than the one this replaced. The old test
   * accepted ANY `needs:` as a gate — a publisher needing an empty job would
   * have passed — and required a literal npm command for the fused case, which
   * would have called every cargo lab ungated had one ever taken that shape. */
  console.log('\nA5  the canonical paragraph\'s closing claim, re-derived over the live fleet');
  const root = comments.FLEET_ROOT;
  const evidence = claims.derive(root);
  const t = evidence.totals;
  check(`every dispatch target exists (${t.sites} sites)`, t.targetsMissing.length === 0, t.targetsMissing.join('\n'));
  check('every dispatch target has a Pages publisher to gate', t.noPublisher.length === 0, t.noPublisher.join('\n'));
  check('every dispatch target gates before it publishes', t.ungated.length === 0, t.ungated.join('\n'));
  check('the gate walk follows reusable workflows (crypto-lab-pake-gate reaches its gate through one)',
    evidence.sites.some((s) => (s.gates || []).some((g) => /reusable/.test(g.via))),
    'no site was gated through a `uses: ./.github/workflows/*.yml` call — either the walk stopped '
    + 'following them, or pake-gate changed shape');
  console.log(`          (${t.sites} dispatch sites re-derived under ${root}: `
    + `${Object.entries(t.gateVia).map(([k, n]) => `${n} ${k}`).join(', ')})`);

  /* ----------------------------------------------------------------- A7 */
  console.log('\nA7  CANONICAL\'s factual clauses, bound to that derivation');
  const bound = claims.verify({ evidence, extra: { dispatchFiresUnderFault: !!(newStep && /DISPATCH FIRED/.test(newStep[2])) } });
  for (const r of bound.rows) {
    check(`${r.id} — ${r.ok ? 'asserted polarity matches the fleet' : r.status}`, r.ok,
      `clause:   ${r.sentence || '(not located in CANONICAL)'}\nasserted: ${r.why || ''}\nderived:  ${r.evidence || ''}`
      + `${(r.detail || []).length ? `\n${r.detail.slice(0, 8).join('\n')}` : ''}`);
  }
  console.log('          NOT bound, and not counted as checked:');
  for (const [what, why] of claims.UNBOUND_NOTES) console.log(`            ${what} — ${why}`);

  /* ----------------------------------------------------------------- A6 */
  console.log('\nA6  normaliseBlock: what it rewrites, keeps, and refuses');
  const P = '          ';
  const hash = (a) => a.join('\n');
  const canonBlock = comments.CANONICAL.map((s) => `${P}# ${s}`);

  let r = comments.normaliseBlock([], P);
  check('empty block → ABSENT, canonical inserted',
    r.status === 'ABSENT' && hash(r.lines) === hash(canonBlock), r.status);

  r = comments.normaliseBlock(canonBlock, P);
  check('canonical block → CANONICAL, byte-identical out',
    r.status === 'CANONICAL' && hash(r.lines) === hash(canonBlock), r.status);

  const keptNote = [`${P}# The filename below is deploy-pages.yml here, not deploy.yml.`];
  r = comments.normaliseBlock([...canonBlock, `${P}#`, ...keptNote], P);
  check('per-repo paragraph after the rationale is preserved verbatim',
    r.status === 'CANONICAL' && hash(r.lines) === hash([...canonBlock, `${P}#`, ...keptNote]), r.status);

  /* The four labs whose filename note is inside the rationale paragraph. */
  r = comments.normaliseBlock([...canonBlock, ...keptNote], P);
  check('a note appended to the rationale paragraph is split off, not dropped',
    r.status === 'DRIFTED' && hash(r.lines) === hash([...canonBlock, `${P}#`, ...keptNote]),
    `${r.status}\n${r.lines.join('\n')}`);

  const flagNote = [`${P}# \`merged\` is set by the merge command's own exit status.`];
  r = comments.normaliseBlock([...flagNote, `${P}#`, `${P}# A merge with GITHUB_TOKEN raises no push event, so ask explicitly.`], P);
  check('a paragraph BEFORE the rationale is preserved, rationale replaced',
    r.status === 'DRIFTED' && hash(r.lines) === hash([...flagNote, `${P}#`, ...canonBlock]),
    `${r.status}\n${r.lines.join('\n')}`);

  const twoBlock = [...canonBlock, `${P}#`, `${P}# Also: a GITHUB_TOKEN merge raises no push event.`];
  r = comments.normaliseBlock(twoBlock, P);
  check('two rationale paragraphs → UNRECOGNISED, input returned unchanged',
    r.status === 'UNRECOGNISED' && hash(r.lines) === hash(twoBlock), r.status);

  const noneBlock = [`${P}# Retry three times, then give up.`];
  r = comments.normaliseBlock(noneBlock, P);
  check('no rationale paragraph → UNRECOGNISED, input returned unchanged',
    r.status === 'UNRECOGNISED' && hash(r.lines) === hash(noneBlock), r.status);

  const buriedBlock = [
    `${P}# A merge made with GITHUB_TOKEN raises no push event, so ask explicitly.`,
    `${P}# The dispatched run is the same pipeline, so a bad merge still ships nothing. It is`,
    `${P}# pages.yml here, not deploy.yml.`,
  ];
  r = comments.normaliseBlock(buriedBlock, P);
  check('closing claim buried mid-line → UNRECOGNISED rather than dropping the prose after it',
    r.status === 'UNRECOGNISED' && hash(r.lines) === hash(buriedBlock), `${r.status}: ${r.why}`);

  /* ----------------------------------------------------------------- M */
  console.log('\nM   the permanent mutation set (tools/dispatch-mutations.js)');
  const mut = mutations.run({ evidence, verbose });
  pass += mut.pass; fail += mut.fail;

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
