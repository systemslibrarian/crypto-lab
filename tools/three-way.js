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
 * Every row is MEASURED on this machine, and `source` says where the convention
 * is also documented. Re-probe rather than trusting this block: a row is a fact
 * about these binaries at a version, not a promise about every platform. The
 * versions measured on 2026-11-07 were coreutils 9.11, gh 2.96.0, ugrep 7.8.4.
 *
 * FALLTHROUGH, and it is the whole point of having a table: a code that is in
 * none of a tool's lists resolves to COULD-NOT-LOOK. Never to a finding. An
 * unrecognised code is by definition something the caller does not understand,
 * and guessing "that'll be a difference" is the 2026-11-06 slip generalised.
 *
 * THE THREE COUNTEREXAMPLES, which are why this is a table and not a rule:
 *
 *   git exits 128 for an absent object, an absent ref, a bad range AND a
 *   directory that is not a repository. `git cat-file -e <sha>^{commit}` gives
 *   128 both for "this lab's history does not contain the pin", which IS a
 *   finding, and for "there is no repository here", which is not. A first
 *   version of hasCommitState mapped its non-zero exit to could-not-look and
 *   thereby switched off a real finding class in silence; catalog-evidence's
 *   selftest caught it. So for git: A NON-ZERO EXIT NEVER DECIDES READABILITY
 *   BY ITSELF. Ask a separate readability question first — `rev-parse
 *   --git-dir` is the one that answers cleanly.
 *
 *   node exits 1 for a script that does not exist, the same code a script that
 *   ran and failed uses. There is nothing in the code to read.
 *
 *   grep -q DISAGREES WITH ITSELF ACROSS IMPLEMENTATIONS on this machine, and
 *   POSIX permits both answers. Given a match in one operand and an unreadable
 *   second operand: ugrep 7.8.4, which is what `grep` resolves to here, exits 2
 *   and lets the error win; /usr/bin/grep (BSD grep 2.6.0-FreeBSD) exits 0 and
 *   lets the match win. So a `grep -q` over MORE THAN ONE operand cannot be
 *   relied on to surface an error at all. Check operand readability first —
 *   `require_readable` in three-way.sh, or the `operands` option here — rather
 *   than reading it out of the exit code.
 *
 * TWO CODES THAT ARE THEIR OWN STATE, folded into neither finding nor
 * could-not-look, because each is a true and useful answer that is simply not
 * one of the other two:
 *
 *   timeout's 124 and 137 mean the command really ran and really did not
 *   finish. 137 is 128+9, the KILL that `-k` escalates to when the command
 *   ignores TERM. Calling either a finding accuses the subject of a defect it
 *   may not have; calling either could-not-look hides a thing that never ends.
 *
 *   `gh pr checks` exits 8 for "checks pending", documented under its own
 *   "Additional exit codes" heading and nowhere in `gh help exit-codes`. Not
 *   settled is not a verdict, and it is not a read failure either.
 */
const TIMED_OUT = 'timed-out';
const PENDING = 'pending';

const EXIT_CODES = Object.freeze({
  cmp:    { clean: [0], finding: [1], unreadable: [2], source: 'POSIX cmp; measured' },
  diff:   { clean: [0], finding: [1], unreadable: [2], source: 'POSIX diff; measured' },
  grep:   { clean: [0], finding: [1], unreadable: [2],
            source: 'POSIX grep; measured on ugrep 7.8.4',
            note: 'with several operands, a match plus an error exits 2 under ugrep and 0 '
                + 'under BSD grep, so check operand readability instead of reading the code' },
  shasum: { clean: [0], finding: [1], unreadable: [2], source: 'measured' },
  sh:     { clean: [0], finding: 'the command\'s own', unreadable: [126, 127],
            source: 'POSIX shell; measured' },
  timeout: { clean: [0], finding: 'the command\'s own',
             unreadable: [125, 126, 127], ownState: { [TIMED_OUT]: [124, 137] },
             source: 'timeout --help, GNU coreutils 9.11; all six codes measured' },
  tar:    { clean: [0], finding: [], unreadable: [1], source: 'measured; 1 for ALL errors' },
  gh:     { clean: [0], finding: [], unreadable: [1, 2, 4],
            source: 'gh help exit-codes, gh 2.96.0; 1, 2 documented and 0, 1, 4 measured',
            note: '1 is every ordinary failure, 2 is cancelled, 4 is authentication required. '
                + 'None of the six subcommands our checkers call documents an additional code. '
                + '4 is MEASURED as of 2026-11-07: it needs gh isolated from every credential, '
                + 'because blanking the token env vars alone leaves it reading the config dir. '
                + 'env -u GH_TOKEN -u GITHUB_TOKEN -u GH_ENTERPRISE_TOKEN '
                + '-u GITHUB_ENTERPRISE_TOKEN GH_CONFIG_DIR=$(mktemp -d) gh api user exits 4 '
                + 'with: please run gh auth login' },
  'gh pr checks': { clean: [0], finding: [], unreadable: [1, 2, 4], ownState: { [PENDING]: [8] },
            source: 'gh pr checks --help "Additional exit codes: 8: Checks pending"; 8 and 0 measured' },
  curl:   { clean: [0], finding: [], unreadable: 'any non-zero',
            source: 'curl(1) exit codes; 3 and 7 measured' },
  node:   { clean: [0], finding: 'the script\'s own', unreadable: [],
            source: 'measured', note: 'exits 1 for a MISSING script, so nothing is readable from the code' },
  git:    { clean: [0], finding: [], unreadable: [],
            source: 'measured across cat-file, rev-parse, diff, ls-files, archive',
            note: 'a non-zero exit never decides readability; ask rev-parse --git-dir first' },
  'git show-ref --verify': { clean: [0], finding: [1], unreadable: [128],
            source: 'measured; the one git command in our set whose 1 means absent' },
});

/**
 * classifyExit — resolve (tool, code) to a state, with the fallthrough rule.
 *
 * An unknown tool, or a code in none of that tool's lists, is COULD-NOT-LOOK.
 * `finding` is only ever reached by an explicit listing, or by a tool whose
 * `finding` is the string 'the command\'s own' / 'the script\'s own', which
 * means any code not otherwise claimed belongs to the program rather than to
 * the instrument.
 */
function classifyExit(tool, code) {
  const row = EXIT_CODES[tool];
  if (!row) return { state: UNREADABLE, why: `${tool}: no exit-code row, so nothing can be concluded from ${code}` };
  if (row.clean.includes(code)) return { state: MATCH, why: '' };
  for (const [name, codes] of Object.entries(row.ownState || {})) {
    if (codes.includes(code)) return { state: name, why: `${tool}: ${name} (exit ${code})` };
  }
  if (Array.isArray(row.unreadable) ? row.unreadable.includes(code) : row.unreadable === 'any non-zero') {
    return { state: UNREADABLE, why: `${tool}: exit ${code} is an operational failure, not a finding` };
  }
  if (Array.isArray(row.finding) && row.finding.includes(code)) {
    return { state: DIFFERS, why: `${tool}: exit ${code}` };
  }
  /* FALLTHROUGH, and it applies to EVERY tool including the three whose row
     says their finding codes are "the command's own". That string documents the
     convention; it does not license this function to guess. `timeout 42` really
     is the command's own 42, but a classifier that returns `differs` for any
     code it was never told about is the 2026-11-06 slip with extra steps: the
     one code it has no row for is exactly the one it understands least.
     A caller that genuinely wants the program's status asks for it by name. */
  return { state: UNREADABLE,
    why: `${tool}: exit ${code} is not in its exit-code row, so nothing can be concluded from it` };
}

/**
 * programStatus — the pass-through, taken deliberately rather than by default.
 *
 * `sh -c`, `timeout` and `node` return the program's own exit status for codes
 * they do not claim. A caller that knows it is reading the PROGRAM's answer and
 * not the instrument's says so here; `classifyExit` will not infer it, because
 * inferring it is what turns an unrecognised code into a confident verdict.
 *
 * Returns null for a tool that does not pass a status through, and for any code
 * the tool DOES claim — those have a real classification and must use it.
 */
function programStatus(tool, code) {
  const row = EXIT_CODES[tool];
  if (!row || typeof row.finding !== 'string') return null;
  if (row.clean.includes(code)) return null;
  if (Array.isArray(row.unreadable) && row.unreadable.includes(code)) return null;
  for (const codes of Object.values(row.ownState || {})) if (codes.includes(code)) return null;
  return { tool, code, why: `${tool}: exit ${code} is ${row.finding}` };
}

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
  MATCH, DIFFERS, UNREADABLE, TIMED_OUT, PENDING, EXIT_CODES, classifyExit, programStatus,
  noteUnread, unreadEntries, formatUnread, clearUnread, markUnreadPrinted,
  compareOrReport, guardedCompare, lookupOrReport, operandsReadable,
};
