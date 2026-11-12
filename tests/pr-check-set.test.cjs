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

test('a job that opens a PR and never requests the checks fails this test', () => {
  for (const f of ['audit-corpus.yml', 'pin-advance.yml']) {
    const src = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', f), 'utf8');
    assert.match(src, /gh pr create/, `${f} opens a pull request`);
    assert.match(src, /pr-check-set\.js dispatch/,
      `${f} opens a pull request and must request its check set; without this it reports only the security scans (#468)`);
    /* Order: the request must follow the create, since it needs the branch to exist. */
    assert.ok(src.indexOf('gh pr create') < src.indexOf('pr-check-set.js dispatch'),
      `${f}: the request must come after the pull request exists`);
  }
});

/* MUTATION: remove the dispatch call from a job that opens a PR. The assertion
   above is what catches it; this proves the assertion is load-bearing rather
   than decorative. */
test('MUTATION: stripping the dispatch call is detected', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', 'audit-corpus.yml'), 'utf8');
  const stripped = src.replace(/node tools\/pr-check-set\.js dispatch[^\n]*\n/, '');
  assert.notEqual(stripped, src, 'the mutation must apply');
  assert.match(src, /pr-check-set\.js dispatch/);
  assert.doesNotMatch(stripped, /pr-check-set\.js dispatch/,
    'and the stripped version is what the test above would reject');
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
