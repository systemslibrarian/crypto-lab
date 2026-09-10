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

  /* ----------------------------------------------------------------- A5 */
  console.log('\nA5  the canonical paragraph\'s closing claim, re-derived over the live fleet');
  const PUBLISH = /actions\/deploy-pages|peaceiris\/actions-gh-pages/;
  const root = comments.FLEET_ROOT;
  let sites = 0; const missing = []; const ungated = [];
  for (const repo of comments.siblingLabs()) {
    const dir = path.join(root, repo, '.github', 'workflows');
    const files = fs.readdirSync(dir).filter((f) => /\.ya?ml$/.test(f));
    for (const f of files) {
      const text = fs.readFileSync(path.join(dir, f), 'utf8');
      if (!/dependabot/i.test(text)) continue;
      const m = /gh workflow run\s+(\S+\.ya?ml)/.exec(text);
      if (!m) continue;
      sites++;
      if (!files.includes(m[1])) { missing.push(`${repo} → ${m[1]}`); continue; }
      const tl = fs.readFileSync(path.join(dir, m[1]), 'utf8').split('\n');
      const pub = dispatchSync.jobBlocks(tl).filter((j) => PUBLISH.test(tl.slice(j.start, j.end).join('\n')));
      if (!pub.length) { ungated.push(`${repo} → ${m[1]} (no publisher job found)`); continue; }
      for (const j of pub) {
        const body = tl.slice(j.start, j.end);
        const needs = body.some((l) => /^\s*needs:/.test(l));
        /* A fused build-and-deploy job is gated by step order instead: the
         * publish step sits after the test/build steps in the same job. */
        const pubAt = body.findIndex((l) => PUBLISH.test(l));
        const testBefore = body.slice(0, pubAt).some((l) => /run:.*(npm (test|run (build|type-check))|test:a11y|test:e2e)/.test(l));
        if (!needs && !testBefore) ungated.push(`${repo} → ${m[1]} [${j.name}]`);
      }
    }
  }
  check(`every dispatch target exists (${sites} sites)`, missing.length === 0, missing.join('\n'));
  check('every dispatch target gates before it publishes', ungated.length === 0, ungated.join('\n'));
  console.log(`          (${sites} dispatch sites re-derived under ${root})`);

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
