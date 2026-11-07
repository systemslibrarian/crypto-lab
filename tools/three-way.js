/*
 * three-way.js — run a comparison or a lookup and report MATCH, DIFFERS or
 * COULD-NOT-LOOK, never folding the third state into the second.
 *
 * Not runnable. Required by catalog-evidence.js and tests/three-way.test.cjs;
 * tools/three-way.sh is the shell counterpart with the same three states.
 *
 * WHY THIS EXISTS
 *
 * `cmp`, `diff`, `grep -q` and `sha256sum -c` all use the same convention:
 * exit 0 means the same, exit 1 means different, and exit 2 OR MORE means the
 * comparison did not happen — a missing operand, an unreadable file, a binary
 * that is not installed, a process killed by a signal. Code that branches on
 * `if cmp a b` or `if (status !== 0)` collapses the third case into the second
 * and then publishes it as a finding about the subject.
 *
 * On 2026-11-06 this repository did exactly that. Two canonical PDFs were
 * compared against copies in ~/Downloads with `cmp -s`, the Downloads copies
 * had been cleared, `cmp` exited 2 for a missing operand, and the run reported
 * "differs from Downloads" for both. They did not differ. The earlier identity,
 * measured while the files were present, was unchanged — so the report turned
 * "could not look" into "looked, and they disagree", which is the defect the
 * "Answering from a copy" section of CLAUDE.md is entirely about, in the one
 * direction that section had not yet covered.
 *
 * The rule the states encode: an exit code of 2 or more is never a finding.
 * It is a statement about the instrument, so it is reported as its own result
 * and it is the caller's job to decide what to do about it. A checker that
 * cannot look must say that it could not look.
 */

'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

/** The three states. There is no fourth, and DIFFERS is never a fallback. */
const MATCH = 'match';
const DIFFERS = 'differs';
const UNREADABLE = 'could-not-look';

const result = (state, why) => ({ state, why, match: state === MATCH, readable: state !== UNREADABLE });

/**
 * Is every operand present and readable? Asked BEFORE the comparison runs,
 * because a caller that uses `test -f` to decide gets exit 1 for a missing
 * file, which is the same code `cmp` uses for "different".
 */
function operandsReadable(label, operands) {
  for (const p of operands) {
    try {
      fs.accessSync(p, fs.constants.R_OK);
      if (fs.statSync(p).isDirectory()) {
        return result(UNREADABLE, `${label}: ${p} is a directory, not a comparable operand`);
      }
    } catch (error) {
      return result(UNREADABLE, `${label}: ${p} could not be read (${error.code || error.message})`);
    }
  }
  return null;
}

/**
 * compareOrReport — the one entry point. Give it a label, a command and its
 * arguments; pass `operands` for the paths the command compares and they are
 * checked for readability first.
 *
 * 0        -> match
 * 1        -> differs
 * >= 2     -> could-not-look, with the exit code and whatever the command said
 * no spawn -> could-not-look, with the reason it did not run
 * signal   -> could-not-look, never "differs"
 */
function compareOrReport(label, cmd, args = [], opts = {}) {
  const { operands = [], ...spawnOpts } = opts;
  const unreadableOperand = operandsReadable(label, operands);
  if (unreadableOperand) return unreadableOperand;

  const run = spawnSync(cmd, args, { encoding: 'utf8', ...spawnOpts });
  if (run.error) {
    return result(UNREADABLE, `${label}: ${cmd} did not run (${run.error.code || run.error.message})`);
  }
  if (run.signal) {
    return result(UNREADABLE, `${label}: ${cmd} was killed by ${run.signal} before it answered`);
  }
  if (run.status === 0) return result(MATCH, '');
  if (run.status === 1) return result(DIFFERS, `${label}: the two operands differ`);

  const said = String(run.stderr || '').trim().split('\n')[0] || 'no diagnostic';
  return result(UNREADABLE, `${label}: ${cmd} exited ${run.status} without comparing (${said})`);
}

/**
 * guardedCompare — for a comparison expressed in JavaScript rather than by an
 * external command. `fn` returns true for match and false for differs; if it
 * THROWS, that is could-not-look and not a finding.
 */
function guardedCompare(label, fn) {
  let answer;
  try {
    answer = fn();
  } catch (error) {
    return result(UNREADABLE, `${label}: ${error.message}`);
  }
  if (answer === null || answer === undefined) {
    return result(UNREADABLE, `${label}: the comparison returned no answer`);
  }
  return result(answer ? MATCH : DIFFERS, answer ? '' : `${label}: the two operands differ`);
}

/**
 * lookupOrReport — the same three states for a LOOKUP rather than a
 * comparison: present, absent, or could-not-look. `fn` returns a boolean for
 * present/absent and throws when the question could not be asked, which is the
 * case `catch { return false }` turns into a confident "absent".
 */
function lookupOrReport(label, fn) {
  try {
    const found = fn();
    if (found === null || found === undefined) {
      return result(UNREADABLE, `${label}: the lookup returned no answer`);
    }
    return result(found ? MATCH : DIFFERS, found ? '' : `${label}: not present`);
  } catch (error) {
    return result(UNREADABLE, `${label}: ${error.message}`);
  }
}


/* ------------------------------------------------------------------ EXIT_CODES
 *
 * Which exit codes mean what, PER TOOL. There is no universal rule, and the
 * "2 or more means could not look" shorthand this file shipped with on
 * 2026-11-06 is wrong for the two tools we shell out to most.
 *
 * Every row was MEASURED on 2026-11-07 with the command in `probe`, on this
 * machine's own binaries, and the man-page column says where the convention is
 * documented when it is. A row marked "measured" only is a fact about these
 * binaries, not a promise about every platform.
 *
 *  tool                      clean   finding            could-not-look   source
 *  ------------------------  ------  -----------------  ---------------  ---------------------
 *  cmp                       0 same  1 differ           2                POSIX cmp, measured
 *  diff                      0 same  1 differ           2                POSIX diff, measured
 *  grep -q                   0 found 1 not found        2                POSIX grep, measured
 *  shasum -a 256 -c          0 match 1 mismatch         2                measured
 *  sh -c <cmd>               0       the command's own  126, 127         POSIX shell, measured
 *  timeout N <cmd>           0       the command's own  none; 124 is its own state (see below)
 *  tar tzf                   0       --                 1 (ALL errors)   measured
 *  curl                      0       --                 3, 7, 28, ...    curl(1) exit codes
 *  gh                        0       --                 1 (ALL errors)   measured
 *  node <script>             0       script's own code  none; 1 for a MISSING script
 *  git (almost all)          0       --                 none; 128 for everything
 *  git show-ref --verify     0 found 1 ref absent       128              measured
 *
 * THE TWO COUNTEREXAMPLES, which are why this is a table and not a rule:
 *
 *   git exits 128 for an absent object, an absent ref, a bad range AND a
 *   directory that is not a repository. `git cat-file -e <sha>^{commit}` gives
 *   128 both for "this lab's history does not contain the pin", which IS a
 *   finding, and for "there is no repository here", which is not. A first
 *   version of hasCommitState mapped its non-zero exit to could-not-look and
 *   thereby switched off a real finding class in silence; catalog-evidence's
 *   selftest caught it. So for git: A NON-ZERO EXIT NEVER DECIDES READABILITY
 *   BY ITSELF. Ask a separate readability question first — `rev-parse
 *   --git-dir` is the one that answers cleanly — and only inside a repository
 *   that answered does the second command's code mean present or absent.
 *
 *   node exits 1 for a script that does not exist, which is the same code a
 *   script that ran and failed uses. There is nothing in the code to read.
 *
 * And 124 from `timeout` is a THIRD thing again: the command really ran and
 * really did not finish. That is neither a finding about the subject nor a
 * failure of the instrument, so it gets its own verdict rather than being
 * folded into either. `.bugsweep/run-tests.sh` records it as TIMEOUT.
 */
const EXIT_CODES = Object.freeze({
  cmp:       { clean: [0], finding: [1], unreadable: [2] },
  diff:      { clean: [0], finding: [1], unreadable: [2] },
  grep:      { clean: [0], finding: [1], unreadable: [2] },
  shasum:    { clean: [0], finding: [1], unreadable: [2] },
  sh:        { clean: [0], finding: 'the command\'s own', unreadable: [126, 127] },
  tar:       { clean: [0], finding: [], unreadable: [1] },
  gh:        { clean: [0], finding: [], unreadable: [1] },
  curl:      { clean: [0], finding: [], unreadable: 'any non-zero' },
  node:      { clean: [0], finding: 'the script\'s own', unreadable: [] },
  git:       { clean: [0], finding: [], unreadable: [],
               note: 'a non-zero exit never decides readability; ask rev-parse --git-dir first' },
  'git show-ref --verify': { clean: [0], finding: [1], unreadable: [128] },
});

/* ------------------------------------------------------------- the unread ledger
 *
 * Converting a silent skip into a reported one needs somewhere to report TO, and
 * giving each of twenty call sites its own channel is how they drift apart. One
 * ledger, one format, and each checker prints its own scope at the end.
 *
 * The rule a silent skip breaks: a checker's count is a count of what it
 * managed to READ. `catch { continue }` inside a scan removes the item from the
 * numerator and the denominator at once, so the run comes back clean and
 * smaller, and nothing says so. */
const unread = [];

/** Record that something could not be looked at. Returns nothing; call and continue. */
function noteUnread(scope, subject, why) {
  unread.push({ scope, subject: String(subject),
    why: why && why.message ? why.message.split('\n')[0] : String(why || 'unreadable') });
}

/** Everything recorded, or everything for one scope. */
function unreadEntries(scope) {
  return scope ? unread.filter((u) => u.scope === scope) : unread.slice();
}

/** A printable COULD-NOT-LOOK block, or '' when there is nothing to report. */
function formatUnread(scope) {
  const rows = unreadEntries(scope);
  if (!rows.length) return '';
  const head = `COULD NOT LOOK (${rows.length}) — read failures, not findings about the subject.`;
  return [head, ...rows.map((r) => `  ${r.subject}: ${r.why}`)].join('\n');
}

function clearUnread() { unread.length = 0; flushed = false; }

/* A checker that wants the block inside its own report calls formatUnread and
   marks it printed. Anything NOT printed that way is printed here, once, on the
   way out — because the whole point is that a read failure cannot be the thing
   nobody mentions, and twelve checkers each remembering to print is twelve
   chances to forget. stderr, so it never lands in a generated file. */
let flushed = false;

function markUnreadPrinted() { flushed = true; }

process.on('exit', () => {
  if (flushed || !unread.length) return;
  flushed = true;
  process.stderr.write('\n' + formatUnread() + '\n');
});

module.exports = {
  MATCH, DIFFERS, UNREADABLE, EXIT_CODES,
  noteUnread, unreadEntries, formatUnread, clearUnread, markUnreadPrinted,
  compareOrReport, guardedCompare, lookupOrReport, operandsReadable,
};
