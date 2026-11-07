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
  assert.match(claude, /exit cod\w* of 2 or more/i);
});
