'use strict';
/*
 * What this file is defending.
 *
 * From 2026-10-21 until this fix, every fleet run reported:
 *
 *   COULD NOT LOOK (1) - read failures, not findings about the subject.
 *     crypto-lab-mls-group: run 42745996773 jobs JSON: Cannot read properties of null (reading 'jobs')
 *
 * Three separate defects stacked into that one line, and each gets a test here
 * because each of them can come back on its own:
 *
 *   (A) sh() collapsed every child-process failure to `null`, so the exit code
 *       and stderr were gone at the point of failure. The message that survived
 *       named a TypeError in our own file. Worse, the try/catch around
 *       `JSON.parse(raw).jobs` was never the guard it looked like:
 *       JSON.parse(null) does not throw -- it returns the VALUE null -- so the
 *       parse SUCCEEDED and only the dereference threw. A try/catch around a
 *       parse is not a check; the shape is the check.
 *
 *   (B) The run was not gone. Verified 2026-11-11: both
 *       /actions/runs/42745996773 and .../jobs answer 200. The read failed
 *       because this checker's own burst (measured: 6 REST calls x 254 labs in
 *       a 101s step = ~905 calls/min) sat on GitHub's 900-points-per-minute
 *       secondary rate limit. A transient refusal deserves a retry, and a
 *       bounded fallback to a run whose jobs DO read tells a maintainer which
 *       of the two it was.
 *
 *   (C) Fail-closed was an ACCIDENT. The ledger is flushed by three-way.js on
 *       exit, and nothing connected it to the exit status: the run exited 1
 *       only because the same lab also landed in `broken`. The rule is now
 *       written down, and the test below would fail if it were deleted.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const TOOLS = path.join(__dirname, '..', 'tools');

/* One lab, one deploy workflow, a fake `git` and a fake `gh` on PATH. Same
   staging as tests/deploy-report.test.cjs; kept separate because these modes
   are about HOW a read fails rather than about which verdict a run earns. */
function stage(mode, extraEnv = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-fail-loud-'));
  const hub = path.join(root, 'crypto-lab'), tools = path.join(hub, 'tools');
  const lab = path.join(root, 'crypto-lab-fixture'), bin = path.join(root, 'bin');
  for (const dir of [tools, bin, path.join(hub, '.git'), path.join(lab, '.git'),
    path.join(lab, '.github/workflows')]) fs.mkdirSync(dir, { recursive: true });
  for (const name of ['deploy-sync.js', 'gate-sync.js', 'sibling-labs.js', 'three-way.js',
    'non-exhibit-repos.json']) fs.copyFileSync(path.join(TOOLS, name), path.join(tools, name));
  fs.writeFileSync(path.join(tools, 'dispatch-census.json'), JSON.stringify({ totals: { labs: 2 } }));

  const workflow = 'name: Ship\njobs:\n  deploy:\n    steps:\n      - name: Publish site\n        uses: actions/deploy-pages@v5\n';
  fs.writeFileSync(path.join(lab, '.github/workflows/deploy.yml'), 'name: Uncommitted\njobs: {}\n');

  fs.writeFileSync(path.join(bin, 'git'), `#!${process.execPath}
const a=process.argv.slice(2);
if(a[0]==='rev-parse')console.log('a'.repeat(40));
if(a[0]==='ls-tree'&&!process.cwd().endsWith('crypto-lab'))console.log('.github/workflows/deploy.yml');
if(a[0]==='show')console.log(process.env.DEPLOY_FIXTURE_WORKFLOW);
`, { mode: 0o755 });

  /* The fake gh. ATTEMPTS counts every \`run view\` so the retry tests can assert
     the checker really asked again rather than reporting one answer twice. */
  const counter = path.join(root, 'attempts');
  fs.writeFileSync(path.join(bin, 'gh'), `#!${process.execPath}
const fs=require('fs');const a=process.argv.slice(2),m=process.env.DEPLOY_FIXTURE_MODE;
const C=${JSON.stringify(counter)};
const GOOD=JSON.stringify({jobs:[{name:'deploy',conclusion:'success',steps:[{name:'Publish site',conclusion:'success'}]}]});
if(a[0]==='api'){console.log('workflow');process.exit(0);}
if(a[1]==='view'){
  const runId=a[2];
  const n=(()=>{let v=0;try{v=Number(fs.readFileSync(C,'utf8'))||0;}catch{}fs.writeFileSync(C,String(v+1));return v+1;})();
  if(m==='empty-jobs-body'){process.exit(0);}                       // exit 0, no output at all
  if(m==='non-json-jobs-body'){console.log('<!DOCTYPE html><html>502 Bad Gateway');process.exit(0);}
  if(m==='refused-jobs'){
    process.stderr.write('gh: You have exceeded a secondary rate limit (HTTP 403)\\n');process.exit(1);}
  if(m==='retry-then-ok'){
    if(n<3){process.stderr.write('gh: You have exceeded a secondary rate limit (HTTP 403)\\n');process.exit(1);}
    console.log(GOOD);process.exit(0);}
  if(m==='fallback'){
    if(runId==='1'){process.stderr.write('gh: You have exceeded a secondary rate limit (HTTP 403)\\n');process.exit(1);}
    console.log(GOOD);process.exit(0);}
  console.log(GOOD);process.exit(0);
}
const head='a'.repeat(40), older='c'.repeat(40);
const base={event:'push',name:'Ship',status:'completed',conclusion:'success'};
const runs=[{...base,databaseId:1,headSha:head,updatedAt:'2026-11-10T02:00:00Z'}];
if(m==='fallback')runs.push({...base,databaseId:2,headSha:older,updatedAt:'2026-11-01T02:00:00Z'});
console.log(JSON.stringify(runs));
`, { mode: 0o755 });

  const run = (argv = [], env = {}) => spawnSync(process.execPath,
    [...argv, path.join(tools, 'deploy-sync.js'), 'check'], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}`,
        DEPLOY_FIXTURE_MODE: mode, DEPLOY_FIXTURE_WORKFLOW: workflow,
        DEPLOY_SYNC_JOBS_BACKOFF_MS: '0', ...extraEnv, ...env },
    });
  return { root, tools, run, attempts: () => Number(fs.readFileSync(counter, 'utf8') || 0) };
}

const CLEAN_CLAIM = /All inspected deployment runs have verified publish jobs and Pages configuration/;

/* (A) The original symptom, as a regression test. The message must name what
   GitHub did, and must NOT be a TypeError about this repository's own code. */
for (const [mode, expected] of [
  ['empty-jobs-body', /command succeeded but printed nothing/],
  ['non-json-jobs-body', /not JSON.*502 Bad Gateway/s],
  ['refused-jobs', /exit 1.*secondary rate limit/s],
]) {
  test(`(A) a jobs read that returns ${mode} fails loudly with the real reason`, () => {
    const f = stage(mode);
    try {
      const r = f.run();
      const all = r.stdout + r.stderr;
      assert.match(all, /COULD NOT LOOK/, all);
      assert.match(all, expected, all);
      // The defect, named: this is the string that replaced the diagnosis.
      assert.doesNotMatch(all, /Cannot read properties of null/, all);
      assert.doesNotMatch(r.stdout, CLEAN_CLAIM, all);
      assert.equal(r.status, 1, all);
    } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
  });
}

/* (B) retry. A refusal that clears on the third ask is not a finding about a
   lab, and must not be reported as one. */
test('(B) a jobs read refused twice and answered on the third attempt is CURRENT', () => {
  const f = stage('retry-then-ok');
  try {
    const r = f.run();
    const all = r.stdout + r.stderr;
    assert.equal(f.attempts(), 3, `expected 3 jobs reads, saw ${f.attempts()}\n${all}`);
    assert.doesNotMatch(all, /COULD NOT LOOK/, all);
    assert.match(r.stdout, CLEAN_CLAIM, all);
    assert.equal(r.status, 0, all);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('(B) the retry is bounded: a permanently refused read ends as COULD NOT LOOK, not a hang', () => {
  const f = stage('refused-jobs');
  try {
    const r = f.run();
    const all = r.stdout + r.stderr;
    assert.match(all, /3 attempts/, all);
    assert.equal(r.status, 1, all);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

/* (B)+(C) the fallback. It must REPORT the older readable run -- that is the
   diagnosis -- and it must not launder the unread current run into a pass. */
test('(B) falling back to a run whose jobs DO read still leaves the current run unread', () => {
  const f = stage('fallback');
  try {
    const r = f.run();
    const all = r.stdout + r.stderr;
    assert.match(all, /fell back to run 2 @ccccccc/, all);
    assert.match(all, /whose jobs DO read and verify/, all);
    // and yet:
    assert.match(all, /COULD NOT LOOK/, all);
    assert.match(all, /run 1 jobs/, all);
    assert.match(r.stdout, /crypto-lab-fixture\s+API-ERROR/, all);
    assert.doesNotMatch(r.stdout, CLEAN_CLAIM, all);
    assert.equal(r.status, 1, all);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

/* (C) THE RULE, at the checker.
 *
 * Everything this run looks at is clean: one lab, CURRENT, nothing stale,
 * nothing broken, nothing pending. The ONLY thing wrong is an entry in the
 * unread ledger, put there by a --require preload so that no verdict bucket is
 * involved. Before the rule existed this printed the clean claim and exited 0,
 * because the exit status was derived from `broken` and never from the ledger.
 *
 * Delete `unreadExitCode` from deploy-sync.js AND the enforcement in
 * three-way.js's exit flush and this test fails. That is the point of it. */
test('(C) a non-empty COULD NOT LOOK ledger forces a non-zero exit, as a rule', () => {
  const f = stage('clean');
  try {
    const baseline = f.run();
    assert.match(baseline.stdout, CLEAN_CLAIM, baseline.stdout + baseline.stderr);
    assert.equal(baseline.status, 0, baseline.stdout + baseline.stderr);

    const preload = path.join(f.root, 'note-unread.cjs');
    fs.writeFileSync(preload, `require(${JSON.stringify(path.join(f.tools, 'three-way.js'))})`
      + `.noteUnread('deploy-sync', 'crypto-lab-fixture: something', 'the API refused');\n`);
    const r = f.run(['--require', preload]);
    const all = r.stdout + r.stderr;
    assert.match(all, /COULD NOT LOOK/, all);
    assert.doesNotMatch(r.stdout, CLEAN_CLAIM, all);
    assert.notEqual(r.status, 0, `an unread ledger exited 0 - a failed scan looked like a clean result\n${all}`);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

/* (C) THE RULE, at the ledger that owns it. Independent of deploy-sync so that
   the next checker to use noteUnread inherits it without knowing it exists. */
test('(C) the ledger owns the rule: unreadExitCode, and the exit flush behind it', () => {
  const three = require(path.join(TOOLS, 'three-way.js'));
  three.clearUnread();
  assert.equal(three.unreadExitCode(0), 0, 'an empty ledger must not invent a failure');
  three.noteUnread('t', 'subject', 'why');
  assert.equal(three.unreadExitCode(0), 1, 'a non-empty ledger must force non-zero');
  assert.equal(three.unreadExitCode(2), 2, 'an exit code the checker chose is not overwritten');
  three.clearUnread();

  // And the last line of defence: a checker that armed the rule and then
  // explicitly exits 0 still cannot report a clean result over a read failure,
  // even though it never calls unreadExitCode.
  const armed = spawnSync(process.execPath, ['-e',
    `const t=require(${JSON.stringify(path.join(TOOLS, 'three-way.js'))});`
    + `t.failOnUnread();t.noteUnread('t','s','w');process.exit(0);`], { encoding: 'utf8' });
  assert.notEqual(armed.status, 0, `process.exit(0) over a non-empty ledger exited 0\n${armed.stderr}`);
  assert.match(armed.stderr, /COULD NOT LOOK/, armed.stderr);

  /* And the scope of that, deliberately: a tool that has NOT armed the rule is
     not re-judged by it. tools/depth-audit.js prints its COULD NOT LOOK block
     and exits 0 on purpose -- an absent optional import is a ground-truth lead
     there, pinned by tests/depth-complete.test.cjs. Arming this globally would
     have flipped that tool's contract as a side effect of a deploy-sync fix.
     Whether depth-audit SHOULD exit 0 over its own unread block is a real
     question; it is not answered by this change, and this line records that. */
  const unarmed = spawnSync(process.execPath, ['-e',
    `require(${JSON.stringify(path.join(TOOLS, 'three-way.js'))}).noteUnread('t','s','w');process.exit(0);`],
  { encoding: 'utf8' });
  assert.equal(unarmed.status, 0, 'an unarmed checker must keep the exit status it chose');
  assert.match(unarmed.stderr, /COULD NOT LOOK/, 'but the block is still printed, always');

  // deploy-sync is armed, and that is a line the next edit must not drop.
  const ds = fs.readFileSync(path.join(TOOLS, 'deploy-sync.js'), 'utf8');
  assert.match(ds, /^failOnUnread\(\);$/m, 'deploy-sync.js must arm the rule at module load');
});

/* The budget. The throttle is the fix for (B)'s cause, so the measured cost of
   each subcommand is pinned here: if someone adds a call or changes a flag, the
   arithmetic in deploy-sync.js's header stops being true and this says so. */
test('throttle: the measured per-call costs and the configured rate', async () => {
  const sync = require(path.join(TOOLS, 'deploy-sync.js'));
  assert.equal(sync.ghCost(['api', 'repos/x/pages']), 1);
  assert.equal(sync.ghCost(['run', 'list', '--limit', '60']), 2);
  assert.equal(sync.ghCost(['run', 'view', '1', '--json', 'jobs']), 3);
  assert.equal(sync.ghCost(['something', 'new']), 3, 'an unknown call is charged the maximum');
  assert.equal(sync.ghCost(['api', 'x']) + sync.ghCost(['run', 'list'])
    + sync.ghCost(['run', 'view']), 6, 'six calls per lab is the number in the header');
  assert.ok(sync.GH_CALLS_PER_MIN < 900,
    'GitHub secondary rate limit is 900 REST points/min; the default must sit below it');
});

/* And that the budget actually holds the rate down, observed rather than
   asserted from the constant. 40 calls of budget at 600/min is 4.0s of refill
   after a 20-call burst; measuring the achieved rate is the only honest way to
   say "after" in a report. */
test('throttle: observed rate stays at or below the configured calls/min', async () => {
  const r = spawnSync(process.execPath, ['-e', `
    process.env.DEPLOY_SYNC_GH_CALLS_PER_MIN='600';process.env.DEPLOY_SYNC_GH_BURST='20';
    const s=require(${JSON.stringify(path.join(TOOLS, 'deploy-sync.js'))});
    (async()=>{const t=Date.now();for(let i=0;i<60;i++)await s.spendGhBudget(1);
      const ms=Date.now()-t;console.log(JSON.stringify({calls:60,ms,perMin:60/(ms/60000)}));})();
  `], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const m = JSON.parse(r.stdout);
  // 60 calls from a 20-token bucket at 600/min: the first 20 are the burst and
  // the remaining 40 are paid for at the refill rate = 4.0s.
  assert.ok(m.ms >= 3800, `expected ~4000ms of waiting, got ${m.ms}ms`);
  const sustained = (60 - 20) / (m.ms / 60000);
  assert.ok(sustained <= 620, `observed sustained ${Math.round(sustained)} calls/min`);
  /* The window GitHub measures is a minute, and the worst a token bucket can do
     in any one minute is a full burst plus a minute of refill. That is the
     number that has to clear 900, and it is checked here rather than trusted. */
  const sync = require(path.join(TOOLS, 'deploy-sync.js'));
  assert.ok(sync.GH_BURST + sync.GH_CALLS_PER_MIN <= 900,
    `worst-case minute is ${sync.GH_BURST + sync.GH_CALLS_PER_MIN} calls, over the 900 ceiling`);
  console.log(`    observed: 60 calls in ${m.ms}ms; sustained ${Math.round(sustained)}/min; `
    + `worst-case minute ${sync.GH_BURST + sync.GH_CALLS_PER_MIN}/min`);
});
