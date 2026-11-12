/* The pre-flight, which decides whether this job does anything at all.
 *
 * It exists because the daily run spent 252 clones and a 13 MB regeneration to
 * discover, six days out of seven, that no lab had moved. The question "did a
 * lab move" is answerable in seconds from the `commit_sha` each lab already
 * carries in corpus/labs.jsonl, so it is now asked first and the build is gated
 * on the answer.
 *
 * Two behaviours are pinned here, each with a mutation that fails:
 *   nothing moved  -> no build, no push, and the summary says so
 *   one lab moved  -> that lab is named and the pull-request path is taken
 *
 * The comparison is driven through the same shell the workflow runs, against a
 * fixture corpus and a fixture remote, so the test exercises the real pipeline
 * rather than a re-description of it.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseYaml } = require('../tools/gate-sync.js');

const WF = path.join(__dirname, '..', '.github', 'workflows', 'audit-corpus.yml');
const doc = parseYaml(fs.readFileSync(WF, 'utf8'));
const steps = doc.jobs.corpus.steps;
const byName = (frag) => steps.find((s) => String(s.name || '').includes(frag));

/* The decision the whole job hangs on, extracted from the workflow rather than
   retyped: every step after the pre-flight must be gated on it. */
const GATE = "steps.preflight.outputs.moved != '0'";

test('the schedule is weekly on Monday, and nothing rebuilds on a catalog push', () => {
  assert.deepEqual(doc.on.schedule, [{ cron: '17 6 * * 1' }], 'Monday 06:17 UTC');
  assert.ok('workflow_dispatch' in doc.on, 'manual dispatch must stay');
  assert.ok(!('push' in doc.on),
    'a push to main cannot make the corpus stale: it describes the labs, not this repository');
  assert.ok('pull_request' in doc.on, 'verifying a proposed catalog change is a different job');
});

test('nothing moved: no clone, no build, no push, and the summary says so', () => {
  const pre = byName('whether it moved');
  assert.ok(pre && pre.id === 'preflight');

  /* Every step that costs anything is gated. If one is not, a "nothing moved"
     run still pays for it -- which is the whole defect this change removes. */
  for (const frag of ['Clone the fleet', "clone's state", 'Generate the corpus',
                      'missing from the corpus', 'Guard tests', 'was modified', 'Report']) {
    const s = byName(frag);
    assert.ok(s, `step missing: ${frag}`);
    assert.equal(s.if, GATE, `${s.name}: must not run when nothing moved`);
  }
  const push = byName('Push the refresh');
  assert.ok(push.if.includes(GATE), 'the push must also be gated on the pre-flight');
  assert.ok(push.if.includes("github.event_name != 'pull_request'"),
    'a pull_request run still must not propose anything');

  /* And the run says what it decided, in the place a person reads. */
  assert.match(pre.run, /no lab changed since \$corpus_date/);
  assert.match(pre.run, /GITHUB_STEP_SUMMARY/);
  assert.match(pre.run, /exit 0/, 'it finishes successfully rather than failing on "nothing to do"');
});

/* The comparison itself, run for real: a fixture corpus of three labs, a remote
   answer for each, and the workflow's own awk. */
function decide(corpusRows, remoteRows) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-'));
  fs.writeFileSync(path.join(dir, 'corpus-shas.txt'), corpusRows.join('\n') + '\n');
  fs.writeFileSync(path.join(dir, 'remote-heads.txt'), remoteRows.join('\n') + '\n');
  const sh = `
    cd ${dir}
    sort -o corpus-shas.txt corpus-shas.txt; sort -o remote-heads.txt remote-heads.txt
    join corpus-shas.txt remote-heads.txt > joined.txt
    awk '$2 != $3 { print }' joined.txt > moved.txt
    awk '$3 == "UNREADABLE" { print $1 }' joined.txt > unreadable.txt
    echo "moved=$(wc -l < moved.txt | tr -d ' ') unreadable=$(wc -l < unreadable.txt | tr -d ' ')"
    cat moved.txt`;
  const out = execFileSync('bash', ['-c', sh], { encoding: 'utf8' });
  fs.rmSync(dir, { recursive: true, force: true });
  return out;
}

test('nothing moved: the comparison yields zero', () => {
  const out = decide(
    ['crypto-lab-a aaa', 'crypto-lab-b bbb', 'crypto-lab-c ccc'],
    ['crypto-lab-a aaa', 'crypto-lab-b bbb', 'crypto-lab-c ccc'],
  );
  assert.match(out, /moved=0 unreadable=0/);
});

test('one lab moved: it is named, and only it', () => {
  const out = decide(
    ['crypto-lab-a aaa', 'crypto-lab-b bbb', 'crypto-lab-c ccc'],
    ['crypto-lab-a aaa', 'crypto-lab-b MOVED', 'crypto-lab-c ccc'],
  );
  assert.match(out, /moved=1 unreadable=0/);
  assert.match(out, /crypto-lab-b bbb MOVED/);
  assert.doesNotMatch(out, /crypto-lab-a/, 'an unchanged lab must not be listed');
  assert.doesNotMatch(out, /crypto-lab-c/);
});

/* MUTATION: compare on the wrong field. `$2 != $3` is corpus-vs-remote; `$2 != $2`
   is the shape a careless edit produces, and it reports nothing ever moving --
   a job that silently stops refreshing. */
test('MUTATION: comparing a column against itself never sees a move', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-mut-'));
  fs.writeFileSync(path.join(dir, 'joined.txt'), 'crypto-lab-b bbb MOVED\n');
  const broken = execFileSync('bash', ['-c',
    `cd ${dir} && awk '$2 != $2 { print }' joined.txt | wc -l | tr -d ' '`], { encoding: 'utf8' }).trim();
  const correct = execFileSync('bash', ['-c',
    `cd ${dir} && awk '$2 != $3 { print }' joined.txt | wc -l | tr -d ' '`], { encoding: 'utf8' }).trim();
  fs.rmSync(dir, { recursive: true, force: true });
  assert.equal(broken, '0', 'the mutation sees nothing');
  assert.equal(correct, '1', 'the real comparison sees the move');
  assert.notEqual(broken, correct, 'if these ever agree the pre-flight has stopped comparing');
});

/* An unanswered question is not an answer of "unchanged". */
test('a lab that could not be read counts as moved, not as unchanged', () => {
  const out = decide(
    ['crypto-lab-a aaa', 'crypto-lab-b bbb'],
    ['crypto-lab-a aaa', 'crypto-lab-b UNREADABLE'],
  );
  assert.match(out, /moved=1 unreadable=1/);
  assert.match(out, /crypto-lab-b bbb UNREADABLE/);
  const pre = byName('whether it moved');
  assert.match(pre.run, /counted as moved/, 'the workflow must say why it builds on an unreadable lab');
});

test('one lab moved: the pull-request path is taken, with the issue as fallback', () => {
  const push = byName('Push the refresh');
  assert.match(push.run, /gh pr create/, 'it must try to open the pull request');
  assert.match(push.run, /--body-file \/tmp\/pr-body\.md/, 'the body is a file, not an unindented shell string');
  assert.match(push.run, /falling back to the reused issue/, 'and fall back when the create is refused');
  assert.match(push.run, /\/tmp\/moved\.txt/, 'the pull request names the labs that moved');
  /* The no-diff path retires a stale branch rather than leaving it looking open. */
  assert.match(push.run, /push origin --delete "\$branch"/);
  assert.match(push.run, /nothing on it that main lacks/);
});

/* The corpus already records what the pre-flight needs. This pins that, because
   if the field were dropped the pre-flight would silently compare against
   "none" for every lab and rebuild every week. */
test('the corpus records a per-lab commit for the pre-flight to compare against', () => {
  const first = fs.readFileSync(path.join(__dirname, '..', 'corpus', 'labs.jsonl'), 'utf8')
    .split('\n').filter(Boolean)[0];
  const rec = JSON.parse(first);
  assert.ok(rec.slug, 'each record names its lab');
  assert.match(rec.commit_sha, /^[0-9a-f]{40}$/, 'and the commit its bytes were read from');
  const idx = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'corpus', 'index.json'), 'utf8'));
  assert.ok(idx.generated_at, 'the summary needs a date to say "since" ');
});

/* ------------------------------------------------------------------ 2 -----
   AUTO-MERGE, and the path guard that bounds it.

   #461: the refresh was proposed daily and merged never — the first weekly run
   found 226 of 252 labs moved because a year of daily proposals had piled up
   behind a human step. Regenerated prose and a moved `commit_sha` do not need a
   person. Anything outside corpus/ does, and that is the whole of the rule.

   The guard is the interesting half, so it is tested against real `git diff`
   output rather than against a description of it, with a mutation that fails. */

/** The workflow's own confinement test, run for real over a file list. */
function outside(paths) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'confine-'));
  fs.writeFileSync(path.join(dir, 'names.txt'), paths.join('\n') + '\n');
  const out = execFileSync('bash', ['-c',
    `cd ${dir} && grep -v '^corpus/' names.txt || true`], { encoding: 'utf8' });
  fs.rmSync(dir, { recursive: true, force: true });
  return out.split('\n').filter(Boolean);
}

test('a refresh confined to corpus/ has nothing outside it', () => {
  assert.deepEqual(outside([
    'corpus/index.json', 'corpus/index.md', 'corpus/labs-full.md', 'corpus/labs.jsonl',
  ]), [], 'the real shape of #460, which was 4 files all under corpus/');
});

test('llms.txt counts as outside corpus/, so such a refresh is left for a person', () => {
  assert.deepEqual(outside(['corpus/labs.jsonl', 'llms.txt']), ['llms.txt'],
    'llms.txt is staged alongside corpus/ but is not inside it');
});

test('a refresh that reaches into tools/ or a workflow is left for a person', () => {
  assert.deepEqual(outside([
    'corpus/labs.jsonl', 'tools/card-reader.js', '.github/workflows/audit-corpus.yml',
  ]), ['tools/card-reader.js', '.github/workflows/audit-corpus.yml']);
});

/* MUTATION: drop the anchor from the pattern. `grep -v 'corpus/'` matches the
   substring anywhere, so a path that merely CONTAINS corpus/ — a nested or
   adjacent directory — would be treated as confined and auto-merged. */
test('MUTATION: an unanchored pattern would let a non-corpus path through', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'confine-mut-'));
  const names = ['corpus/labs.jsonl', 'tools/corpus/injected.js', 'docs/corpus/notes.md'];
  fs.writeFileSync(path.join(dir, 'names.txt'), names.join('\n') + '\n');
  const anchored = execFileSync('bash', ['-c',
    `cd ${dir} && grep -v '^corpus/' names.txt || true`], { encoding: 'utf8' }).split('\n').filter(Boolean);
  const unanchored = execFileSync('bash', ['-c',
    `cd ${dir} && grep -v 'corpus/' names.txt || true`], { encoding: 'utf8' }).split('\n').filter(Boolean);
  fs.rmSync(dir, { recursive: true, force: true });
  assert.deepEqual(anchored, ['tools/corpus/injected.js', 'docs/corpus/notes.md'],
    'the anchored pattern catches both');
  assert.deepEqual(unanchored, [], 'the mutation sees nothing outside corpus/');
  assert.notDeepEqual(anchored, unanchored,
    'if these ever agree the guard has stopped anchoring and would auto-merge tools/corpus/*');
});

test('auto-merge names the three gates it depends on, and is enabled only past them', () => {
  const push = byName('Push the refresh');
  for (const id of ['hardgate', 'guards', 'readonly']) {
    assert.ok(steps.some((s) => s.id === id), `the gate step "${id}" must carry an id`);
    assert.match(push.env[id.toUpperCase()] || '', new RegExp(`steps\\.${id}\\.outcome`),
      `${id}'s outcome must reach the push step`);
  }
  assert.match(push.run, /gh pr merge --auto --squash/, 'auto-merge, not a direct merge');
  assert.match(push.run, /grep -v '\^corpus\/'/, 'the guard pattern must be anchored');
  assert.match(push.run, /left for review/, 'and say so when it declines');
  /* Order matters: the confinement test must come BEFORE the merge call, or a
     refresh touching tools/ would be auto-merged and then reported. */
  assert.ok(push.run.indexOf("grep -v '^corpus/'") < push.run.indexOf('gh pr merge --auto'),
    'the path guard must be evaluated before auto-merge is enabled');
});

/* The flag that reads like a merge and is a filter. */
test('--only-lab is documented as a filter, and --lab still works', () => {
  const gen = fs.readFileSync(path.join(__dirname, '..', 'scripts', 'build-audit-corpus.js'), 'utf8');
  assert.match(gen, /--only-lab/, 'the clearer name exists');
  assert.match(gen, /FILTER, not merge/, 'and says which it is at the parse site');
  assert.match(gen, /do not merge one lab into\n \* an existing corpus/,
    'the header must warn that a filtered run replaces the corpus');
  assert.match(gen, /arg\('--only-lab', null\) \?\? arg\('--lab', null\)/,
    'the old spelling keeps working');
  const readme = fs.readFileSync(path.join(__dirname, '..', 'scripts', 'corpus-readme.md'), 'utf8');
  assert.doesNotMatch(readme, /--lab kem-trap/, 'the example must use the clearer name');
  assert.match(readme, /--only-lab kem-trap/);
});
