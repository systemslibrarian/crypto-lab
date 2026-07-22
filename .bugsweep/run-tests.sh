#!/usr/bin/env bash
# Run npm test in every crypto-lab-* repo that defines a test script.
ROOT="/c/Users/gmcas/repos"
OUT="$ROOT/crypto-lab/.bugsweep"
mkdir -p "$OUT/logs"
: > "$OUT/test-results.tsv"

for dir in "$ROOT"/crypto-lab-*/; do
  repo="$(basename "$dir")"
  [[ -f "$dir/package.json" ]] || continue
  grep -q '"test"' "$dir/package.json" || continue
  cd "$dir" || continue
  if [[ ! -d node_modules ]]; then
    npm install --no-audit --no-fund --loglevel=error > "$OUT/logs/$repo.install.log" 2>&1
  fi
  timeout 300 npm test --silent > "$OUT/logs/$repo.test.log" 2>&1
  code=$?
  if [[ $code -eq 0 ]]; then status=PASS; elif [[ $code -eq 124 ]]; then status=TIMEOUT; else status=FAIL; fi
  printf "%s\t%s\t%s\n" "$repo" "$status" "$code" >> "$OUT/test-results.tsv"
  echo "$repo $status"
done
echo "DONE test sweep"
