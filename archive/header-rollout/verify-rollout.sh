#!/usr/bin/env bash
# Verify the shared-header rollout across every modified repo:
#  - local HEAD index.html still contains the header
#  - branch is in sync with origin (pushed)
#  - latest Actions run is green (success) on the pushed commit
#  - the LIVE GitHub Pages site actually contains the header
set -uo pipefail
ROOT="/c/Users/gmcas/repos"
OWNER="systemslibrarian"
OUT="$ROOT/crypto-lab/verify-results.tsv"
printf "repo\tsynced\thead_has\trun_status\trun_concl\trun_is_head\tlive_http\tlive_has\n" > "$OUT"

problems=0; checked=0

check_repo() {
  local repo="$1" marker="$2" liveurl="$3"
  local dir="$ROOT/$repo"
  # local file
  local f="$dir/index.html"
  [[ -f "$f" ]] || f="$(find "$dir" -name index.html -not -path '*/node_modules/*' -not -path '*/dist/*' 2>/dev/null | head -1)"
  local rel="${f#$dir/}"
  local head_has sync run_status run_concl run_sha head_sha run_is_head live_http live_has
  head_has=$(git -C "$dir" show "HEAD:$rel" 2>/dev/null | grep -c "$marker")
  sync=$(git -C "$dir" status -sb 2>/dev/null | head -1 | grep -qE 'ahead|behind' && echo no || echo yes)
  head_sha=$(git -C "$dir" rev-parse HEAD 2>/dev/null)
  # latest actions run
  read -r run_status run_concl run_sha < <(gh run list -R "$OWNER/$repo" --limit 1 --json status,conclusion,headSha --jq '"\(.[0].status) \(.[0].conclusion) \(.[0].headSha)"' 2>/dev/null)
  [[ -z "${run_status:-}" ]] && run_status="none"
  [[ "$run_sha" == "$head_sha" ]] && run_is_head=yes || run_is_head=no
  # live page
  live_http=$(curl -s -o /tmp/v_live.html -w "%{http_code}" -L --max-time 25 "$liveurl" 2>/dev/null)
  live_has=$(grep -c "$marker" /tmp/v_live.html 2>/dev/null)
  printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" "$repo" "$sync" "$head_has" "$run_status" "$run_concl" "$run_is_head" "$live_http" "$live_has" >> "$OUT"
  checked=$((checked+1))
  # flag a problem
  if [[ "$sync" != yes || "$head_has" -lt 1 || "$live_has" -lt 1 || "$run_concl" != "success" ]]; then
    problems=$((problems+1))
    echo "PROBLEM: $repo  synced=$sync head_has=$head_has run=$run_status/$run_concl head=$run_is_head live=$live_http/$live_has"
  fi
}

# catalog (own header is cl-header; verify the award banner is live)
check_repo "crypto-lab" "award-banner" "https://systemslibrarian.github.io/crypto-lab/"

# all labs (header marker = cl-topbar), excluding the backend with no page
for dir in "$ROOT"/crypto-lab-*/; do
  repo="$(basename "$dir")"
  [[ "$repo" == "crypto-lab-blind-oracle-api" ]] && continue
  check_repo "$repo" "cl-topbar" "https://systemslibrarian.github.io/$repo/"
done

echo "========================================"
echo "checked=$checked  problems=$problems"
echo "full table: $OUT"
