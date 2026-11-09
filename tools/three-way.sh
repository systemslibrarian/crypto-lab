#!/usr/bin/env bash
# three-way.sh — compare_or_report / lookup_or_report: MATCH, DIFFERS or
# COULD-NOT-LOOK, with the third state never folded into the second.
#
# Not runnable. Source it rather than executing it: it defines shell functions
# and has no entry point of its own. Required by the shell checkers that compare
# or look things up; tools/three-way.js is the Node counterpart with the same
# three states and the same rule.
#
# cmp, diff, grep -q and sha256sum -c share one convention: 0 means the same,
# 1 means different, and 2 OR MORE means the comparison never happened — a
# missing operand, an unreadable file, a binary that is not installed. Writing
# `if cmp -s a b; then same; else different; fi` collapses the third case into
# the second and then prints it as a finding about the subject.
#
# This repository did that on 2026-11-06: two canonical PDFs were compared with
# `cmp -s` against copies that had since been cleared, cmp exited 2 for a
# missing operand, and the run reported "differs" for both. They did not differ.
#
# The rule: an exit code of 2 or more is a statement about the instrument, not
# about the subject, so it prints as could-not-look and never as a finding.

# compare_or_report <label> <command...>
#   prints exactly one of: match | differs | could-not-look
#   on could-not-look it also writes the exit code and the command's first
#   diagnostic line to stderr. stderr is captured, never discarded: a swallowed
#   diagnostic is how this class of defect stays invisible.
compare_or_report() {
  local label=$1; shift
  # rc defaults to 0 and is set only on failure, so the assignment cannot abort
  # a caller running under `set -e`. A guard that dies on the differs case is
  # its own silent failure mode.
  local err rc=0
  err=$("$@" 2>&1 >/dev/null) || rc=$?
  case "$rc" in
    0) printf 'match\n' ;;
    1) printf 'differs\n' ;;
    *)
      printf 'could-not-look\n'
      printf '%s: `%s` exited %s without comparing (%s)\n' \
        "$label" "$1" "$rc" "${err:-no diagnostic}" >&2
      ;;
  esac
}

# require_readable <label> <path...>
#   prints "ok", or "could-not-look" when any operand is missing or unreadable.
#   Call this BEFORE a comparison: `test -f` answers 1 for a missing file, which
#   is the same code cmp uses for "different", so a caller that branches on
#   `test -f` has already lost the distinction.
require_readable() {
  local label=$1; shift
  local p
  for p in "$@"; do
    if [ ! -e "$p" ]; then
      printf 'could-not-look\n'
      printf '%s: %s does not exist, so nothing was compared\n' "$label" "$p" >&2
      return 0
    fi
    if [ ! -r "$p" ]; then
      printf 'could-not-look\n'
      printf '%s: %s exists but is not readable\n' "$label" "$p" >&2
      return 0
    fi
  done
  printf 'ok\n'
}

# lookup_or_report <label> <command...>
#   The same three states for a lookup: present | absent | could-not-look.
#   grep uses 0 found / 1 not found / 2 trouble, so the mapping is identical.
lookup_or_report() {
  local label=$1; shift
  local err rc=0
  err=$("$@" 2>&1 >/dev/null) || rc=$?
  case "$rc" in
    0) printf 'present\n' ;;
    1) printf 'absent\n' ;;
    *)
      printf 'could-not-look\n'
      printf '%s: `%s` exited %s without answering (%s)\n' \
        "$label" "$1" "$rc" "${err:-no diagnostic}" >&2
      ;;
  esac
}

# gh_pr_checks_state <exit-code>
#   pass | fail | pending | could-not-look
#
# `gh pr checks --help` documents one additional code under its own heading and
# NOT in `gh help exit-codes`: 8 is "Checks pending". Pending is neither green
# nor a read failure, so it is its own answer here.
#
# 0 IS AMBIGUOUS and that is why this function is not the whole guard: gh exits
# 0 both for "every check settled and passed" AND for "no checks have
# registered yet" (CLAUDE.md records a merge that went through on the second
# reading of a 0). So a caller must still wait for the checks to EXIST before
# trusting a 0, then watch. This maps the code; it does not remove that step.
gh_pr_checks_state() {
  case "$1" in
    0)   printf 'pass\n' ;;
    1)   printf 'fail\n' ;;
    8)   printf 'pending\n' ;;
    2|4) printf 'could-not-look\n' ;;
    *)   printf 'could-not-look\n' ;;
  esac
}
