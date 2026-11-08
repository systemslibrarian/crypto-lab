#!/usr/bin/env bash
# Run npm test in every crypto-lab-* repo that defines a test script.
# ROOT was hard-coded to /c/Users/gmcas/repos, a Git-Bash-on-Windows path from the
# July 2026 sweep, so neither script could run anywhere else. Derived from this
# file's own location instead: .bugsweep/ lives in crypto-lab/, whose parent is
# the fleet root.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/crypto-lab/.bugsweep"

# VERDICT TABLE -- what each exit code of `timeout 300 npm test` is recorded as,
# and why. Measured 2026-11-07, not assumed.
#
#   0        PASS            the suite ran and passed
#   124, 137 TIMEOUT         `timeout` killed it: 124 on TERM, 137 when a -k
#                            escalation had to send KILL (128+9). Collapsing 137
#                            into FAIL would call "ran and did not finish" a
#                            defect; it is the same state as 124.
#                            Its own state on purpose: the
#                            suite really ran and really did not finish, which is
#                            neither a finding about the lab nor a failure of this
#                            machine. Folding it into FAIL would accuse a lab of a
#                            defect it may not have; folding it into
#                            COULD-NOT-LOOK would hide a suite that never ends.
#   126, 127 FAIL            THE DECISION: these are the lab's defect, not ours.
#                            `npm run <script>` passes a 127 from inside the
#                            script straight through -- `npm run missing` where
#                            the script body is a command that does not exist
#                            exits 127, identically to npm itself being absent.
#                            The two are only separable by asking whether npm
#                            exists, so that is asked ONCE below, before the loop.
#                            With npm established present, a 126 or 127 from the
#                            run came from inside the lab's own test script, and a
#                            test script that calls something it does not ship is
#                            the lab's problem.
#   anything PASS/FAIL       the suite's own code
#
#   npm absent  COULD-NOT-LOOK for every lab, recorded once and per row, because
#               then nothing was run anywhere and no row is about a lab.

# The verdict table above, as a function, so it can be tested without running a
# fleet sweep. Sourcing this file defines it and runs nothing.
npm_test_verdict() {
  case "$1" in
    0)        printf 'PASS\n' ;;
    124|137)  printf 'TIMEOUT\n' ;;  # 137 is KILL after -k, also "ran and did not finish"
    126|127)  printf 'FAIL\n' ;;     # npm established present: the lab's own script
    *)        printf 'FAIL\n' ;;
  esac
}

NPM_PRESENT=no
if command -v npm >/dev/null 2>&1; then
  NPM_PRESENT=yes
else
  printf 'COULD NOT LOOK: npm is not on PATH, so no lab was tested and no row below is about a lab.\n' >&2
fi

main() {
  # shellcheck source=../tools/three-way.sh
  . "$ROOT/crypto-lab/tools/three-way.sh"   # match / differs / could-not-look
  mkdir -p "$OUT/logs"
  : > "$OUT/test-results.tsv"
  for dir in "$ROOT"/crypto-lab-*/; do
    repo="$(basename "$dir")"
    # A package.json that cannot be read is not a lab without tests. Both of
    # these used to `continue` silently, which is "absent" asserted from a failed
    # look, so the lab vanished from the denominator without being counted.
    if [ "$(require_readable "$repo package.json" "$dir/package.json")" != ok ]; then
      printf "%s\t%s\t%s\n" "$repo" COULD-NOT-LOOK "no readable package.json" >> "$OUT/test-results.tsv"
      echo "$repo COULD-NOT-LOOK"
      continue
    fi
    case "$(lookup_or_report "$repo test script" grep -q '"test"' "$dir/package.json")" in
      present) ;;
      absent)  continue ;;
      *)       printf "%s\t%s\t%s\n" "$repo" COULD-NOT-LOOK "package.json unreadable by grep" >> "$OUT/test-results.tsv"
               echo "$repo COULD-NOT-LOOK"
               continue ;;
    esac
    cd "$dir" || continue
    if [[ ! -d node_modules ]]; then
      npm install --no-audit --no-fund --loglevel=error > "$OUT/logs/$repo.install.log" 2>&1
    fi
    if [ "$NPM_PRESENT" != yes ]; then
      printf "%s\t%s\t%s\n" "$repo" COULD-NOT-LOOK "npm is not on PATH" >> "$OUT/test-results.tsv"
      echo "$repo COULD-NOT-LOOK"
      continue
    fi
    timeout 300 npm test --silent > "$OUT/logs/$repo.test.log" 2>&1
    code=$?
    # See the verdict table at the top of this file. 126/127 are FAIL because npm
    # was established present before the loop, so such a code came from inside the
    # lab's own test script rather than from this machine.
    status=$(npm_test_verdict "$code")
    printf "%s\t%s\t%s\n" "$repo" "$status" "$code" >> "$OUT/test-results.tsv"
    echo "$repo $status"
  done
  echo "DONE test sweep"
}

# Executed: sweep. Sourced (by tests/three-way.test.cjs): define and return.
if [ "${BASH_SOURCE[0]}" = "$0" ]; then main; fi
