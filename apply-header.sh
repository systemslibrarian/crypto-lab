#!/usr/bin/env bash
# Inject the Crypto Lab shared global header into each lab's index.html.
# Idempotent (skips repos that already have it). Edits local working trees
# ONLY — does not commit or push. Review with `git diff`, then push yourself.
#
# Usage:
#   ./apply-header.sh              # all crypto-lab-* repos under ../
#   ./apply-header.sh <repo-name>  # a single repo, e.g. crypto-lab-aes-modes
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SNIPPET="$ROOT/crypto-lab/shared-header.html"

[[ -f "$SNIPPET" ]] || { echo "snippet not found: $SNIPPET"; exit 1; }

if [[ $# -ge 1 ]]; then
  dirs=("$ROOT/$1/")
else
  dirs=("$ROOT"/crypto-lab-*/)
fi

applied=0; skipped=0; missing=0
for dir in "${dirs[@]}"; do
  repo="$(basename "$dir")"
  html="$dir/index.html"
  if [[ ! -f "$html" ]]; then echo "MISSING index.html : $repo"; missing=$((missing+1)); continue; fi
  if grep -q 'cl-topbar' "$html"; then echo "SKIP already-has   : $repo"; skipped=$((skipped+1)); continue; fi
  tmp="$(mktemp)"
  sed "s/__REPO__/$repo/g" "$SNIPPET" > "$tmp"
  awk -v f="$tmp" '
    /<body/ && !done { print; while ((getline line < f) > 0) print line; close(f); done=1; next }
    { print }
  ' "$html" > "$html.new" && mv "$html.new" "$html"
  rm -f "$tmp"
  echo "APPLIED            : $repo"; applied=$((applied+1))
done
echo "----------------------------------------"
echo "applied=$applied  skipped=$skipped  missing=$missing"
