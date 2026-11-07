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
tmp_run="$(mktemp)"
trap 'rm -f "$tmp_run"' EXIT
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
  # gh has NO finding exit code: 1 is every ordinary failure, 2 is cancelled and
  # 4 is authentication required, all could-not-look (gh help exit-codes, 2.96.0).
  # So an empty answer here never means "this lab has no CI runs" -- it used to be
  # recorded as run_status=none, which is a finding about the lab drawn from a
  # lookup that failed. The exit code is now read and stderr is kept.
  run_status=""; run_concl=""; run_sha=""
  gh_err=$(gh run list -R "$OWNER/$repo" --limit 1 \
    --json status,conclusion,headSha \
    --jq '"\(.[0].status) \(.[0].conclusion) \(.[0].headSha)"' 2>&1 >"$tmp_run") || gh_rc=$?
  gh_rc=${gh_rc:-0}
  if [ "$gh_rc" -ne 0 ]; then
    run_status=could-not-look
    printf '%s: `gh run list` exited %s (%s)\n' "$repo" "$gh_rc" "$(printf '%s' "$gh_err" | head -1)" >&2
  else
    read -r run_status run_concl run_sha < "$tmp_run"
    # A repo that really has no runs answers with gh exit 0 and a null row.
    if [ -z "${run_status:-}" ] || [ "$run_status" = null ]; then run_status="none"; fi
  fi
  unset gh_rc
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
