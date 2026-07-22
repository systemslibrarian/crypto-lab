#!/usr/bin/env bash
# Refresh CI + live status for every crypto-lab-* repo (and the catalog).
ROOT="/c/Users/gmcas/repos"
OWNER="systemslibrarian"
OUT="$ROOT/crypto-lab/.bugsweep/ci-results.tsv"
printf "repo\tsynced\trun_status\trun_concl\trun_is_head\tlive_http\n" > "$OUT"

for dir in "$ROOT"/crypto-lab/ "$ROOT"/crypto-lab-*/; do
  repo="$(basename "$dir")"
  [[ "$repo" == "crypto-lab-blind-oracle-api" ]] && continue
  sync=$(git -C "$dir" status -sb 2>/dev/null | head -1 | grep -qE 'ahead|behind' && echo no || echo yes)
  head_sha=$(git -C "$dir" rev-parse HEAD 2>/dev/null)
  read -r run_status run_concl run_sha < <(gh run list -R "$OWNER/$repo" --limit 1 --json status,conclusion,headSha --jq '"\(.[0].status) \(.[0].conclusion) \(.[0].headSha)"' 2>/dev/null)
  [[ -z "${run_status:-}" ]] && run_status="none"
  [[ "$run_sha" == "$head_sha" ]] && run_is_head=yes || run_is_head=no
  live_http=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 25 "https://systemslibrarian.github.io/$repo/" 2>/dev/null)
  printf "%s\t%s\t%s\t%s\t%s\t%s\n" "$repo" "$sync" "$run_status" "$run_concl" "$run_is_head" "$live_http" >> "$OUT"
done
echo "DONE ci sweep"
