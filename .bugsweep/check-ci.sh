#!/usr/bin/env bash
# Refresh CI + live status for every crypto-lab-* repo (and the catalog).
# ROOT was hard-coded to /c/Users/gmcas/repos, a Git-Bash-on-Windows path from the
# July 2026 sweep, so neither script could run anywhere else. Derived from this
# file's own location instead: .bugsweep/ lives in crypto-lab/, whose parent is
# the fleet root.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OWNER="systemslibrarian"
OUT="$ROOT/crypto-lab/.bugsweep/ci-results.tsv"
# shellcheck source=../tools/three-way.sh
. "$ROOT/crypto-lab/tools/three-way.sh"   # match / differs / could-not-look
printf "repo\tsynced\trun_status\trun_concl\trun_is_head\tlive_http\n" > "$OUT"

for dir in "$ROOT"/crypto-lab/ "$ROOT"/crypto-lab-*/; do
  repo="$(basename "$dir")"
  [[ "$repo" == "crypto-lab-blind-oracle-api" ]] && continue
  # Three states, not two. `grep -q` finding nothing used to print "synced=yes",
  # so a directory that is not a repository, or a git that would not run, was
  # reported as a clean lab. stderr is kept and shown rather than discarded.
  sync=could-not-look
  if [ "$(require_readable "$repo clone" "$dir")" = ok ]; then
    sb=$(git -C "$dir" status -sb 2>&1); sb_rc=$?
    if [ "$sb_rc" -ne 0 ]; then
      printf '%s: git status exited %s (%s)\n' "$repo" "$sb_rc" "$(printf '%s' "$sb" | head -1)" >&2
    else
      case "$(printf '%s\n' "$sb" | head -1)" in
        *ahead*|*behind*) sync=no ;;
        *)                sync=yes ;;
      esac
    fi
  fi
  head_sha=$(git -C "$dir" rev-parse HEAD 2>&1) || head_sha=""
  read -r run_status run_concl run_sha < <(gh run list -R "$OWNER/$repo" --limit 1 --json status,conclusion,headSha --jq '"\(.[0].status) \(.[0].conclusion) \(.[0].headSha)"' 2>/dev/null)
  [[ -z "${run_status:-}" ]] && run_status="none"
  # An empty or null sha on either side means the question was never answered.
  # Reporting that as run_is_head=no is a negative finding about the lab drawn
  # from a failed lookup.
  if [ -z "${head_sha:-}" ] || [ -z "${run_sha:-}" ] || [ "$run_sha" = null ]; then
    run_is_head=could-not-look
  elif [ "$run_sha" = "$head_sha" ]; then
    run_is_head=yes
  else
    run_is_head=no
  fi
  live_http=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 25 "https://systemslibrarian.github.io/$repo/" 2>/dev/null)
  printf "%s\t%s\t%s\t%s\t%s\t%s\n" "$repo" "$sync" "$run_status" "$run_concl" "$run_is_head" "$live_http" >> "$OUT"
done
echo "DONE ci sweep"
