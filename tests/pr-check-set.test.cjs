/* Which checks a pull request is SUPPOSED to get — #468.
 *
 * `gh pr create` as secrets.GITHUB_TOKEN raises no pull_request event, so a
 * job-opened pull request reports only the checks that run on push. On #467 that
 * was four security scans out of sixteen, and `gh pr checks` said green because
 * what reported was green. #460 landed the same way: four checks, and the
 * explanation at the time — "the others are path-filtered on a corpus-only
 * change" — was wrong. The filters say a corpus-only pull request should receive
 * fifteen.
 *
 * The expected set is therefore derived from the workflow files rather than from
 * what happened to report, and these tests pin that derivation, the request that
 * follows from it, and the merge that waits on it. Each has a mutation that
 * fails.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { expectedChecks, firesForPaths, globMatches, SECURITY_CHECKS, OK } = require('../tools/pr-check-set.js');
const { parseYaml } = require('../tools/gate-sync.js');

const CORPUS_ONLY = ['corpus/index.json', 'corpus/index.md', 'corpus/labs-full.md', 'corpus/labs.jsonl'];
const WF = (f) => parseYaml(fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', f), 'utf8'));

test('a corpus-only pull request is owed fifteen checks, not four', () => {
  const { checks } = expectedChecks(CORPUS_ONLY);
  assert.equal(checks.length, 15,
    'four is what #460 got; fifteen is what the filters say it was owed');
  for (const c of SECURITY_CHECKS) assert.ok(checks.includes(c), `${c} must be expected`);
  /* The twelve that guard the catalog and never ran on #460. */
  for (const c of ['check', 'checker-regressions', 'crypto-gameplay', 'drift', 'layout',
                   'merkle-mystery', 'quantum-courier', 'sealed-showdown', 'secret-council',
                   'validate', 'verify']) {
    assert.ok(checks.includes(c), `${c} must be expected for a corpus-only change`);
  }
  /* And the three that really are path-filtered out, so the claim "some were
     filtered" is not wrong in general — only wrong about these fifteen. */
  for (const c of ['corpus', 'exports', 'teaching']) {
    assert.ok(!checks.includes(c), `${c} is correctly filtered out by its own paths:`);
  }
});

test('the three excluded ones are excluded by their own paths:, not by accident', () => {
  const audit = WF('audit-corpus.yml');
  const paths = (audit.on ?? audit[true]).pull_request.paths;
  assert.ok(Array.isArray(paths) && paths.length);
  assert.ok(!paths.some((p) => p.startsWith('corpus/')),
    'audit-corpus watches its INPUTS, not its own output, which is why a corpus-only change does not re-run it');
  const mv = WF('maintenance-verification.yml');
  const mvPaths = (mv.on ?? mv[true]).pull_request.paths;
  assert.ok(!mvPaths.some((p) => p.startsWith('corpus/')));
});

/* MUTATION: treat a missing pull_request trigger as "runs on everything". That
   is the shape a careless default produces, and it would inflate the expected
   set with checks that cannot run on a pull request at all — fleet.yml,
   pin-advance.yml, teaching-export.yml. An expected set that can never be
   satisfied blocks every merge, which is as bad as one that is too small. */
test('MUTATION: a workflow with no pull_request trigger must not be expected', () => {
  for (const f of ['fleet.yml', 'pin-advance.yml', 'teaching-export.yml']) {
    const doc = WF(f);
    const on = doc.on ?? doc[true];
    assert.equal(firesForPaths(on, CORPUS_ONLY), false, `${f} has no pull_request trigger`);
    const permissive = { ...on, pull_request: null };   // the mutation
    assert.equal(firesForPaths(permissive, CORPUS_ONLY), true,
      'the mutation would pull it into the expected set');
  }
  const { checks } = expectedChecks(CORPUS_ONLY);
  for (const c of ['fleet', 'advance', 'export']) {
    assert.ok(!checks.includes(c), `${c} must never be expected on a pull request`);
  }
});

/* MUTATION: an unreadable glob must throw rather than silently not match. A
   filter this cannot parse becoming "no match" would quietly shrink the
   expected set — the #468 failure mode, reintroduced by a typo in a pattern. */
test('MUTATION: an unsupported path pattern throws instead of silently not matching', () => {
  assert.equal(globMatches('tools/depth-*', 'tools/depth-audit.js'), true);
  assert.equal(globMatches('tools/depth-*', 'tools/other.js'), false);
  assert.throws(() => globMatches('tools/[a-z]udit.js', 'tools/audit.js'), /unsupported path pattern/);
});

test('skipped counts as reported; missing never does', () => {
  assert.ok(OK.has('success'));
  assert.ok(OK.has('skipped'), 'drift is skipped on every pull request here');
  assert.ok(!OK.has('queued'));
  assert.ok(!OK.has('failure'));
});

/* ---- item 1: the job must REQUEST the checks ---- */

test('every workflow a corpus-only PR needs can be dispatched', () => {
  const { workflows } = expectedChecks(CORPUS_ONLY);
  assert.ok(workflows.length >= 6);
  const stuck = workflows.filter((w) => !w.dispatchable);
  assert.deepEqual(stuck.map((w) => w.file), [],
    'a workflow that must run and cannot be dispatched leaves #468 unfixed');
});

test('a job that opens a PR gets its checks by the credential, not by asking', () => {
  /* MECHANISM CHANGED, and the property did not. This used to require
     `pr-check-set.js dispatch`: GITHUB_TOKEN raises no pull_request event, so
     the job asked for the checks afterwards. The App installation token raises
     the event, so they arrive on their own -- and requesting them as well would
     run every workflow TWICE on one SHA, which makes "all 16 present" ambiguous
     to count. What is still asserted is the same thing: a PR this repository
     opens must not be left with the four security scans. The credential is now
     what guarantees it, so the credential is what is checked. pr-check-set.js
     is kept and still used, for `expected` and `await`, which ASSERT the set
     rather than request it. */
  const { parseYaml } = require('../tools/gate-sync.js');
  for (const f of ['audit-corpus.yml', 'pin-advance.yml']) {
    const src = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', f), 'utf8');
    assert.match(src, /gh pr create/, `${f} opens a pull request`);
    assert.doesNotMatch(src, /pr-check-set\.js dispatch/,
      `${f}: the dispatch is retired; the App token makes the event real and a request would double every run`);
    for (const [jobName, job] of Object.entries(parseYaml(src).jobs || {})) {
      const steps = job.steps || [];
      const creator = steps.find((st) => String(st.run || '').includes('gh pr create'));
      if (!creator) continue;
      assert.match(String(creator.env?.GH_TOKEN ?? ''), /steps\.app-token\.outputs\.token/,
        `${f} (${jobName}): the PR must be created with the App installation token`);
    }
  }
});

/* MUTATION: put GITHUB_TOKEN back on the step that opens the pull request --
   the whole of #468 in one line. The assertion above is what catches it. */
test('MUTATION: reverting the PR credential to GITHUB_TOKEN is detected', () => {
  const { parseYaml } = require('../tools/gate-sync.js');
  const src = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', 'pin-advance.yml'), 'utf8');
  const reverted = src.replace(/GH_TOKEN: \$\{\{ steps\.app-token\.outputs\.token \}\}/g,
    'GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}');
  assert.notEqual(reverted, src, 'the mutation must apply');
  const creator = (parseYaml(reverted).jobs.advance.steps || [])
    .find((st) => String(st.run || '').includes('gh pr create'));
  assert.doesNotMatch(String(creator.env?.GH_TOKEN ?? ''), /steps\.app-token\.outputs\.token/,
    'and the reverted version is what the test above would reject');
});

/* ---- item 3: the merge must wait for the whole set ---- */

/* Comment lines are stripped before asserting on what the job RUNS. The file
   explains why it is not using `gh pr merge --auto`, and a naive match on the
   whole file finds that sentence and fails -- which it did, on the first run of
   this test. What matters is that no executable line enables auto-merge. */
const runnableLines = (src) => src.split('\n')
  .filter((l) => !/^\s*#/.test(l))
  .join('\n');

test('the corpus merge waits for the expected set, not for auto-merge', () => {
  const raw = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', 'audit-corpus.yml'), 'utf8');
  const src = runnableLines(raw);
  assert.match(src, /pr-check-set\.js await --sha/,
    'it must wait for the expected set on the head SHA');
  assert.doesNotMatch(src, /gh pr merge --auto/,
    'main carries no branch protection, so --auto has no required checks to wait for and merges at once');
  assert.match(raw, /NOT `gh pr merge --auto`/,
    'and the file should say why, so the next reader does not put it back');
  /* The wait must gate the merge, not follow it. */
  assert.ok(raw.indexOf('pr-check-set.js await') < raw.indexOf('gh pr merge --squash'),
    'the wait must precede the merge');
  /* And the path guard still gates it too — item 3 must not have dropped item 2 of #465. */
  assert.match(src, /grep -v '\^corpus\/'/);
  assert.ok(raw.indexOf("grep -v '^corpus/'") < raw.indexOf('pr-check-set.js await'),
    'confinement is checked before anything waits or merges');
});

test('MUTATION: reverting to --auto is detected', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', 'audit-corpus.yml'), 'utf8');
  const reverted = src.replace(/if node tools\/pr-check-set\.js await[\s\S]*?\n            fi\n/,
    '            gh pr merge --auto --squash "$pr_url"\n');
  assert.notEqual(reverted, src, 'the mutation must apply');
  assert.match(reverted, /gh pr merge --auto/);
  assert.doesNotMatch(reverted, /pr-check-set\.js await/,
    'which is exactly what the test above rejects');
});

/* The permission, and the path that forgot. Both found by running it: run
   43213464970 opened pull request #470 and then failed with
   `HTTP 403: Resource not accessible by integration`, because raising
   workflow_dispatch needs `actions: write` and neither job had it. #469 was
   necessary and not sufficient. */
test('a job that dispatches workflows declares actions: write', () => {
  for (const f of ['audit-corpus.yml', 'pin-advance.yml']) {
    const doc = WF(f);
    const src = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', f), 'utf8');
    if (!/pr-check-set\.js dispatch/.test(src)) continue;
    assert.equal(doc.permissions && doc.permissions.actions, 'write',
      `${f} raises workflow_dispatch, which is 403 without actions: write`);
  }
});

test('an already-open PR is re-checked on the new SHA, because the PUSH raises it', () => {
  /* Same mechanism change, same property. The dispatch existed because a
     refresh pushed to an already-open branch as GITHUB_TOKEN raises no
     `synchronize`, so the PR went on showing the previous commit's checks. The
     App token is now the credential actions/checkout PERSISTS, which is what
     the later `git push` uses, so the new SHA raises the event itself.
     Asserted on the checkout step, because that is where the push credential is
     decided -- the push line has none of its own. */
  const { parseYaml } = require('../tools/gate-sync.js');
  for (const f of ['audit-corpus.yml', 'pin-advance.yml']) {
    const doc = parseYaml(fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', f), 'utf8'));
    for (const [jobName, job] of Object.entries(doc.jobs || {})) {
      const steps = job.steps || [];
      if (!steps.some((st) => /git push/.test(String(st.run || '')))) continue;
      const checkout = steps.find((st) => String(st.uses || '').startsWith('actions/checkout'));
      assert.ok(checkout, `${f} (${jobName}): pushes without a checkout step`);
      assert.match(String(checkout.with?.token ?? ''), /steps\.app-token\.outputs\.token/,
        `${f} (${jobName}): the push credential must be the App token, or the PR goes stale-checked`);
      assert.notEqual(checkout.with?.['persist-credentials'], false,
        `${f} (${jobName}): persist-credentials false leaves the push with no app credential`);
    }
  }
});
