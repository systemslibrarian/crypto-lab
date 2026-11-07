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

module.exports = {
  MATCH, DIFFERS, UNREADABLE,
  compareOrReport, guardedCompare, lookupOrReport, operandsReadable,
};
