'use strict';
/*
 * The guard for the cmp exit-code slip of 2026-11-06.
 *
 * Two canonical PDFs were compared with `cmp -s` against copies in ~/Downloads
 * that had since been cleared. `cmp` exits 2 for a missing operand exactly as
 * it exits 1 for differing content, the run branched on "non-zero", and it
 * reported "differs from Downloads" for both files. They did not differ. The
 * identity had been measured while the files were present and was unchanged.
 *
 * Recording that in a progress file is not a guard, so this is the guard. It
 * asserts the distinction the slip destroyed: a comparison that DID NOT HAPPEN
 * reports as could-not-look and never as differs.
 *
 * The headline case is `missing operand` below. The rest exist so that case is
 * visible as the one that discriminates rather than as the only one that runs.
 */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const {
  MATCH, DIFFERS, UNREADABLE, compareOrReport, guardedCompare, lookupOrReport, operandsReadable,
} = require('../tools/three-way.js');
const { movedSubstantively } = require('../tools/catalog-evidence.js');

const ROOT = path.resolve(__dirname, '..');
const SH = path.join(ROOT, 'tools', 'three-way.sh');

function tmpdir(tag) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `cl-3way-${tag}-`));
}

test('a missing operand reports could-not-look, never differs', () => {
  const dir = tmpdir('missing');
  try {
    const present = path.join(dir, 'present.txt');
    const absent = path.join(dir, 'absent.txt');
    fs.writeFileSync(present, 'bytes\n');

    // The whole point. cmp exits 2 here, the same family of non-zero as the 1
    // it uses for "different", and the two must not come out the same.
    const r = compareOrReport('missing operand', 'cmp', ['-s', present, absent],
      { operands: [present, absent] });
    assert.equal(r.state, UNREADABLE, 'a missing operand must not be reported as differs');
    assert.notEqual(r.state, DIFFERS);
    assert.equal(r.readable, false);
    assert.match(r.why, /absent\.txt could not be read/);

    // And with the pre-check skipped, so the verdict comes from cmp's own exit
    // code rather than from the operand check: still could-not-look.
    const raw = compareOrReport('missing operand, no precheck', 'cmp', ['-s', present, absent]);
    assert.equal(raw.state, UNREADABLE);
    assert.match(raw.why, /exited 2 without comparing/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the other two states still answer, so could-not-look is not swallowing them', () => {
  const dir = tmpdir('states');
  try {
    const a = path.join(dir, 'a'); const b = path.join(dir, 'b'); const c = path.join(dir, 'c');
    fs.writeFileSync(a, 'same\n'); fs.writeFileSync(b, 'same\n'); fs.writeFileSync(c, 'other\n');
    assert.equal(compareOrReport('same', 'cmp', ['-s', a, b], { operands: [a, b] }).state, MATCH);
    assert.equal(compareOrReport('diff', 'cmp', ['-s', a, c], { operands: [a, c] }).state, DIFFERS);
    assert.equal(operandsReadable('both there', [a, b]), null);
    // A directory is not a comparable operand, and is not "different" either.
    assert.equal(compareOrReport('dir', 'cmp', ['-s', a, dir], { operands: [a, dir] }).state, UNREADABLE);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a command that cannot run, or is killed, is could-not-look', () => {
  const absent = compareOrReport('no such tool', 'cl-definitely-not-installed', ['a', 'b']);
  assert.equal(absent.state, UNREADABLE);
  assert.match(absent.why, /did not run/);

  const killed = compareOrReport('killed', process.execPath,
    ['-e', 'process.kill(process.pid, "SIGKILL")']);
  assert.equal(killed.state, UNREADABLE, 'a signalled process must not be read as differs');
  assert.match(killed.why, /killed by SIG/);
});

test('grep three ways: found, not found, and could not look', () => {
  const dir = tmpdir('grep');
  try {
    const f = path.join(dir, 'f.txt');
    fs.writeFileSync(f, 'needle\n');
    assert.equal(compareOrReport('found', 'grep', ['-q', 'needle', f]).state, MATCH);
    assert.equal(compareOrReport('not found', 'grep', ['-q', 'haystack', f]).state, DIFFERS);
    assert.equal(compareOrReport('no file', 'grep', ['-q', 'needle', path.join(dir, 'gone')]).state,
      UNREADABLE);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a throwing comparison or lookup is could-not-look, not a finding', () => {
  assert.equal(guardedCompare('throws', () => { throw new Error('boom'); }).state, UNREADABLE);
  assert.equal(guardedCompare('true', () => true).state, MATCH);
  assert.equal(guardedCompare('false', () => false).state, DIFFERS);
  // The shape `catch { return false }` produces: a failed question answered
  // "absent". An undefined answer is not an answer.
  assert.equal(guardedCompare('no answer', () => undefined).state, UNREADABLE);
  assert.equal(lookupOrReport('throws', () => { throw new Error('nope'); }).state, UNREADABLE);
  assert.equal(lookupOrReport('present', () => true).state, MATCH);
  assert.equal(lookupOrReport('absent', () => false).state, DIFFERS);
});

test('catalog-evidence reports an unreadable clone as unreadable, not as a stale review', () => {
  const gone = path.join(os.tmpdir(), 'cl-3way-no-such-clone-' + process.pid);
  assert.equal(fs.existsSync(gone), false, 'fixture must not exist');

  // Before the fix this answered 'moved', which the caller turns into
  // STALE-REVIEW: a finding against a lab nobody managed to open. This is the
  // assertion that tells the fix from the bug.
  assert.equal(movedSubstantively(gone, 'a'.repeat(40), 'b'.repeat(40)), 'unreadable');

  // And the selftested row it must NOT have swallowed: a pin genuinely absent
  // from a clone that is genuinely complete is still 'moved'.
  const repo = tmpdir('repo');
  try {
    const git = (...a) => execFileSync('git', ['-C', repo, ...a],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    git('init', '--quiet');
    git('config', 'user.email', 't@example.invalid');
    git('config', 'user.name', 'T');
    fs.writeFileSync(path.join(repo, 'README.md'), 'one\n');
    git('add', 'README.md');
    git('commit', '--quiet', '-m', 'one');
    assert.equal(movedSubstantively(repo, 'd'.repeat(40), 'HEAD'), 'moved',
      'an absent pin in a complete clone is a real finding and must survive the fix');
  } finally {
    fs.rmSync(repo, { recursive: true, force: true });
  }
});

test('the shell helper agrees with the Node one, including on the missing operand', () => {
  const dir = tmpdir('sh');
  try {
    const a = path.join(dir, 'a'); const b = path.join(dir, 'b');
    fs.writeFileSync(a, 'x\n'); fs.writeFileSync(b, 'y\n');
    const gone = path.join(dir, 'gone');
    const run = (script) => execFileSync('bash', ['-c', `set -eu; . '${SH}'; ${script}`],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

    assert.equal(run(`compare_or_report L cmp -s '${a}' '${a}'`), 'match');
    assert.equal(run(`compare_or_report L cmp -s '${a}' '${b}'`), 'differs');
    assert.equal(run(`compare_or_report L cmp -s '${a}' '${gone}'`), 'could-not-look',
      'the shell helper must not report a missing operand as differs');
    assert.equal(run(`require_readable L '${a}' '${gone}'`), 'could-not-look');
    assert.equal(run(`require_readable L '${a}' '${b}'`), 'ok');
    assert.equal(run(`lookup_or_report L grep -q x '${a}'`), 'present');
    assert.equal(run(`lookup_or_report L grep -q zzz '${a}'`), 'absent');
    assert.equal(run(`lookup_or_report L grep -q x '${gone}'`), 'could-not-look');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('no checker folds a comparison failure back into a verdict', () => {
  // The call sites this round converted. A plain `|| echo yes`, `|| continue`
  // or bare `else status=FAIL` beside a comparison is the shape that caused the
  // slip, so the scripts are read rather than trusted to stay fixed.
  const sweep = [
    ['.bugsweep/check-ci.sh', ['could-not-look', 'require_readable']],
    ['.bugsweep/run-tests.sh', ['COULD-NOT-LOOK', 'lookup_or_report']],
  ];
  for (const [rel, needles] of sweep) {
    const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    for (const n of needles) {
      assert.ok(src.includes(n), `${rel} lost its third state (${n})`);
    }
    assert.ok(!/grep -qE 'ahead\|behind' && echo no \|\| echo yes/.test(src),
      `${rel} went back to folding a failed lookup into a clean answer`);
  }
  // And the rule is written down where the next pass will read it.
  const claude = fs.readFileSync(path.join(ROOT, 'CLAUDE.md'), 'utf8');
  assert.match(claude, /only where THAT TOOL documents it as an\s+operational failure/);
  assert.match(claude, /git exits 128 for everything/);
  assert.match(claude, /a non-zero exit never decides\s+readability by itself/);
});

/* ------------------------------------------------------------------ the ledger
 *
 * The audit of 2026-11-07 classified all 105 catch blocks in tools/ and
 * .bugsweep/ as SURFACED or SILENT. A SILENT one removes its item from the
 * numerator AND the denominator at once, so the run comes back clean and
 * smaller with nothing saying so — `catch { continue }` inside a scan.
 *
 * The 23 silent sites now call noteUnread. These tests feed the failing
 * condition and assert the item shows up. The failure is forced with EISDIR:
 * a DIRECTORY where a file is expected makes readFileSync throw, portably,
 * without needing root or a broken disk.
 */

function eisdirRepo(tag, slug) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `cl-eisdir-${tag}-`));
  const wf = path.join(root, slug, '.github', 'workflows');
  fs.mkdirSync(wf, { recursive: true });
  // A readable one, so the scan has something to succeed on as well.
  fs.writeFileSync(path.join(wf, 'ok.yml'), 'name: ok\njobs:\n  build:\n    steps: []\n');
  // And one that cannot be read: a directory wearing a .yml name.
  fs.mkdirSync(path.join(wf, 'deploy.yml'));
  return root;
}

test('an unreadable workflow is reported by dispatch-comment-sync, not skipped', () => {
  const tw = require('../tools/three-way.js');
  const dcs = require('../tools/dispatch-comment-sync.js');
  const root = eisdirRepo('dcs', 'crypto-lab-fixture');
  try {
    tw.clearUnread();
    dcs.sites('crypto-lab-fixture', root);
    const rows = tw.unreadEntries('dispatch-comment-sync');
    assert.equal(rows.length, 1, 'the unreadable workflow must be recorded, not silently skipped');
    assert.match(rows[0].subject, /deploy\.yml/);
    assert.match(tw.formatUnread('dispatch-comment-sync'), /COULD NOT LOOK \(1\)/);
  } finally {
    require('../tools/three-way.js').clearUnread();
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('an unreadable workflow is reported by dispatch-census, not skipped', () => {
  const tw = require('../tools/three-way.js');
  const census = require('../tools/dispatch-census.js');
  const root = eisdirRepo('census', 'crypto-lab-fixture');
  try {
    tw.clearUnread();
    census.observeRepo(root, 'crypto-lab-fixture');
    const rows = tw.unreadEntries('dispatch-census');
    assert.equal(rows.length, 1, 'the lab must not lose a workflow from its counts in silence');
    assert.match(rows[0].subject, /deploy\.yml/);
  } finally {
    tw.clearUnread();
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('a fleet entry that cannot be stat-ed joins the printed exclusions', () => {
  const tw = require('../tools/three-way.js');
  const { siblingLabs } = require('../tools/sibling-labs.js');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cl-eisdir-sib-'));
  try {
    // A dangling symlink: present in readdir, but statSync throws ENOENT. Before
    // the conversion this `continue`d without joining `excluded`, so the entry
    // was in neither the labs list nor the exclusion list.
    fs.symlinkSync(path.join(root, 'nowhere'), path.join(root, 'crypto-lab-dangling'));
    tw.clearUnread();
    const out = siblingLabs(root);
    assert.ok(out.excluded.includes('crypto-lab-dangling'),
      'an unstattable entry must be named in excluded, not vanish');
    assert.equal(tw.unreadEntries('sibling-labs').length, 1);
  } finally {
    tw.clearUnread();
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('every converted site still routes its read failure to the ledger', () => {
  // The 12 files the 2026-11-07 audit converted. A future edit that puts back a
  // bare `catch { continue }` on one of these reads reddens this.
  const converted = {
    'tools/catalog-evidence.js': 2,
    'tools/catalog-sync.js': 3,
    'tools/theme-sync.js': 7,
    'tools/dispatch-census.js': 1,
    'tools/dispatch-sync.js': 2,
    'tools/dispatch-comment-sync.js': 1,
    'tools/tools-sync.js': 1,
    'tools/test-invocation.js': 1,
    'tools/sibling-labs.js': 1,
    'tools/deploy-sync.js': 2,
    'tools/games-sync.js': 2,
    'tools/depth-audit-report.js': 1,
  };
  for (const [rel, want] of Object.entries(converted)) {
    const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    assert.ok(src.includes("require('./three-way.js')"), `${rel} lost its ledger import`);
    const got = (src.match(/noteUnread\(/g) || []).length;
    assert.equal(got, want, `${rel} has ${got} noteUnread call(s), expected ${want}`);
  }
  // And the ledger cannot be silently emptied of its reporting path.
  const tw = fs.readFileSync(path.join(ROOT, 'tools', 'three-way.js'), 'utf8');
  assert.match(tw, /process\.on\('exit'/, 'the auto-flush is what stops a checker forgetting to print');
  assert.match(tw, /EXIT_CODES/, 'the per-tool table is the rule; it must stay in the module');
});

test('the per-tool exit-code table says git decides nothing by its code alone', () => {
  const { EXIT_CODES } = require('../tools/three-way.js');
  // The two counterexamples the narrowed rule rests on.
  assert.deepEqual(EXIT_CODES.git.finding, [], 'git must claim no finding code');
  assert.deepEqual(EXIT_CODES.git.unreadable, [], 'git must claim no could-not-look code');
  assert.match(EXIT_CODES.git.note, /rev-parse --git-dir/);
  assert.deepEqual(EXIT_CODES['git show-ref --verify'].finding, [1],
    'show-ref is the one git command whose 1 really means absent');
  // And the tools where the 0/1/2 shorthand does hold.
  for (const t of ['cmp', 'diff', 'grep', 'shasum']) {
    assert.deepEqual(EXIT_CODES[t].unreadable, [2], `${t} should document 2 as could-not-look`);
    assert.deepEqual(EXIT_CODES[t].finding, [1], `${t} should document 1 as the finding`);
  }
  assert.deepEqual(EXIT_CODES.sh.unreadable, [126, 127]);
  assert.deepEqual(EXIT_CODES.node.unreadable, [], 'node exits 1 for a missing script, so nothing is readable from it');
});

test('run-tests.sh maps 124 to TIMEOUT and an in-script 126/127 to FAIL', () => {
  const sh = path.join(ROOT, '.bugsweep', 'run-tests.sh');
  const verdict = (code) => execFileSync('bash',
    ['-c', `. '${sh}'; npm_test_verdict ${code}`], { encoding: 'utf8' }).trim();

  // 124 is its own state: the suite ran and did not finish.
  assert.equal(verdict(124), 'TIMEOUT');
  // THE DECISION: npm's presence is established once before the loop, so a
  // 126/127 from the run came from inside the lab's own test script.
  assert.equal(verdict(126), 'FAIL');
  assert.equal(verdict(127), 'FAIL');
  assert.equal(verdict(0), 'PASS');
  assert.equal(verdict(1), 'FAIL');

  const src = fs.readFileSync(sh, 'utf8');
  assert.match(src, /NPM_PRESENT/, 'npm presence must be established before the loop');
  assert.match(src, /124\s+TIMEOUT/, 'the verdict table must document 124');
  assert.match(src, /126, 127 FAIL/, 'the verdict table must document the 126\/127 decision');

  // And the real passthrough the decision rests on: a missing command inside a
  // lab's own test script exits 127, identically to npm being absent.
  const lab = fs.mkdtempSync(path.join(os.tmpdir(), 'cl-npm127-'));
  try {
    fs.writeFileSync(path.join(lab, 'package.json'), JSON.stringify(
      { name: 'x', version: '1.0.0', scripts: { test: 'cl-definitely-not-a-command' } }));
    const r = require('node:child_process').spawnSync('npm', ['test', '--silent'],
      { cwd: lab, encoding: 'utf8' });
    if (r.error) {
      // npm genuinely absent here: then the script's own COULD-NOT-LOOK branch
      // is the right answer and there is nothing to assert about 127.
      assert.ok(src.includes('npm is not on PATH'));
    } else {
      assert.equal(r.status, 127, 'npm passes an in-script 127 straight through');
      assert.equal(verdict(r.status), 'FAIL');
    }
  } finally {
    fs.rmSync(lab, { recursive: true, force: true });
  }
});

/* ------------------------------------------------- the per-tool rows, corrected
 *
 * Follow-up to #368. Every row re-probed on 2026-11-07 against coreutils 9.11,
 * gh 2.96.0 and ugrep 7.8.4, and the fallthrough made uniform.
 */

test('an unmapped exit code is could-not-look for EVERY tool, never a finding', () => {
  const tw = require('../tools/three-way.js');
  const tools = Object.keys(tw.EXIT_CODES);
  assert.ok(tools.length >= 13, 'the table should cover every tool we shell out to');
  tw.clearUnread();
  try {
    for (const tool of tools) {
      for (const code of [99, 3, 57, 200]) {
        // 3 is a real curl code, so skip the one tool that claims any non-zero.
        if (tool === 'curl') continue;
        const r = tw.classifyExit(tool, code);
        assert.equal(r.state, tw.UNREADABLE,
          `${tool} exit ${code} must be could-not-look, got ${r.state}`);
        assert.notEqual(r.state, tw.DIFFERS, `${tool} exit ${code} must never be a finding`);
      }
      // and it reaches the ledger, which is how a caller surfaces it
      tw.noteUnread(`exit-codes/${tool}`, `${tool} exit 99`, tw.classifyExit(tool, 99).why);
    }
    const rows = tw.unreadEntries();
    assert.equal(rows.length, tools.length, 'every tool should have recorded its unmapped code');
    assert.match(tw.formatUnread(), /COULD NOT LOOK \(\d+\)/);
    assert.match(rows[0].why, /not in its exit-code row/);
  } finally {
    tw.clearUnread();
  }
});

test('an unknown tool concludes nothing, even from exit 0', () => {
  const tw = require('../tools/three-way.js');
  const r = tw.classifyExit('cl-no-such-tool', 0);
  assert.equal(r.state, tw.UNREADABLE);
  assert.match(r.why, /no exit-code row/);
});

test('timeout: 124 and 137 are their own state, 125/126/127 are could-not-look', () => {
  const tw = require('../tools/three-way.js');
  // Documented in `timeout --help` (GNU coreutils 9.11) and all measured.
  for (const code of [124, 137]) {
    assert.equal(tw.classifyExit('timeout', code).state, tw.TIMED_OUT,
      `timeout ${code} is the suite running and not finishing, not a verdict either way`);
  }
  for (const code of [125, 126, 127]) {
    assert.equal(tw.classifyExit('timeout', code).state, tw.UNREADABLE,
      `timeout ${code} is an operational failure`);
  }
  assert.equal(tw.classifyExit('timeout', 0).state, tw.MATCH);
  assert.deepEqual(tw.EXIT_CODES.timeout.unreadable, [125, 126, 127]);
  assert.deepEqual(tw.EXIT_CODES.timeout.ownState[tw.TIMED_OUT], [124, 137]);
  assert.match(tw.EXIT_CODES.timeout.source, /coreutils 9\.11/);
  // The pass-through is reachable only by asking for it.
  assert.equal(tw.classifyExit('timeout', 42).state, tw.UNREADABLE);
  assert.match(tw.programStatus('timeout', 42).why, /the command's own/);
  assert.equal(tw.programStatus('timeout', 124), null, 'a claimed code is not a pass-through');
});

test('gh has no finding code at all: 1, 2 and 4 are could-not-look', () => {
  const tw = require('../tools/three-way.js');
  // gh help exit-codes (2.96.0): 0 ok, 1 any failure, 2 cancelled, 4 auth required.
  for (const code of [1, 2, 4]) {
    assert.equal(tw.classifyExit('gh', code).state, tw.UNREADABLE, `gh ${code}`);
  }
  assert.deepEqual(tw.EXIT_CODES.gh.finding, [],
    'gh claims no finding code, which is why collapsing every non-zero to null loses nothing');
  assert.match(tw.EXIT_CODES.gh.note, /4 is authentication required/);
  assert.match(tw.EXIT_CODES.gh.note, /documented and unmeasured/,
    'the one row that could not be reproduced here must say so');
  // Subcommand-specific: only gh pr checks has one, and 8 is its own state.
  assert.equal(tw.classifyExit('gh pr checks', 8).state, tw.PENDING);
  assert.deepEqual(tw.EXIT_CODES['gh pr checks'].ownState[tw.PENDING], [8]);
  assert.match(tw.EXIT_CODES['gh pr checks'].source, /Additional exit codes/);
});

test('grep -q cannot be relied on to surface an error, and the row says so', () => {
  const tw = require('../tools/three-way.js');
  assert.deepEqual(tw.EXIT_CODES.grep.unreadable, [2]);
  assert.match(tw.EXIT_CODES.grep.note, /ugrep/);
  assert.match(tw.EXIT_CODES.grep.note, /BSD grep/);
  assert.match(tw.EXIT_CODES.grep.note, /check operand readability/);

  // Measured on this machine: the two greps disagree, and POSIX permits both.
  // A match in one operand plus an unreadable second operand gives 2 under
  // ugrep and 0 under BSD grep, so the exit code is not a reliable channel.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cl-grepq-'));
  try {
    const has = path.join(dir, 'has.txt');
    fs.writeFileSync(has, 'needle\n');
    const gone = path.join(dir, 'gone.txt');
    const code = (bin) => {
      const r = require('node:child_process').spawnSync(bin, ['-q', 'needle', has, gone],
        { encoding: 'utf8' });
      return r.error ? null : r.status;
    };
    const seen = [code('grep'), code('/usr/bin/grep')].filter((c) => c !== null);
    assert.ok(seen.length >= 1, 'at least one grep must be runnable');
    // Whichever answers, the operand pre-check must catch it regardless.
    const pre = compareOrReport('grep operands', 'grep', ['-q', 'needle', has, gone],
      { operands: [has, gone] });
    assert.equal(pre.state, UNREADABLE,
      'the operand pre-check is what makes this safe whichever grep is on PATH');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('every exit-code row carries a source, so no row is there on memory alone', () => {
  const { EXIT_CODES } = require('../tools/three-way.js');
  for (const [tool, row] of Object.entries(EXIT_CODES)) {
    assert.ok(typeof row.source === 'string' && row.source.length > 4,
      `${tool} has no source; a row without one is a recollection`);
  }
});
