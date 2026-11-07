#!/usr/bin/env bash
# Run npm test in every crypto-lab-* repo that defines a test script.
ROOT="/c/Users/gmcas/repos"
OUT="$ROOT/crypto-lab/.bugsweep"
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
  timeout 300 npm test --silent > "$OUT/logs/$repo.test.log" 2>&1
  code=$?
  # 126 and 127 are the shell saying it could not run the command at all -- npm
  # absent, or not executable. Calling that FAIL files a finding against the lab
  # for a fault in this machine.
  case $code in
    0)       status=PASS ;;
    124)     status=TIMEOUT ;;
    126|127) status=COULD-NOT-LOOK ;;
    *)       status=FAIL ;;
  esac
  printf "%s\t%s\t%s\n" "$repo" "$status" "$code" >> "$OUT/test-results.tsv"
  echo "$repo $status"
done
echo "DONE test sweep"
