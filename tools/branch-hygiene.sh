#!/bin/zsh
# Run: node -e "" ; ./tools/branch-hygiene.sh
# Prevents: a finished round leaving its own working branches behind on the remote.
# Reads: the GitHub branches API for every crypto-lab* repo, via gh.
# Asserts the round left no branch behind that this session created, and reports
# every other non-main branch with whose it is and whether it still holds work.
#
# My branch prefixes this round and last: a11y/, msrv/, and any local throwaway
# (pr*work). Anything under codex/, claude/, chatgpt/ belongs to another lane.
# dependabot/* is Dependabot's and is deleted by its own merges.
MINE='^(a11y|msrv)/|work$'
: > /tmp/bc_out.txt
if [ ! -s "${REPOLIST:-/tmp/allrepos.txt}" ]; then
  gh repo list systemslibrarian --limit 400 --json name -q '.[].name' | grep '^crypto-lab' | sort > /tmp/allrepos.txt
fi
while read -r r; do
  gh api "repos/systemslibrarian/$r/branches?per_page=100" -q '.[].name' 2>/dev/null \
    | grep -v '^main$' | sed "s|^|$r\||" >> /tmp/bc_out.txt
done < "${REPOLIST:-/tmp/allrepos.txt}"
mine=$(awk -F'|' -v p="$MINE" '$2 ~ p' /tmp/bc_out.txt | wc -l | tr -d ' ')
echo "branches created by this session still on the remote: $mine"
if [ "$mine" != "0" ]; then
  echo "LEFTOVERS:"; awk -F'|' -v p="$MINE" '$2 ~ p {printf "  %s  %s\n", $1, $2}' /tmp/bc_out.txt
  exit 1
fi
echo "OK — no branch of mine survives."
echo "--- everything else that exists, by owner:"
awk -F'|' '{b=$2; print (b ~ /^dependabot\//) ? "dependabot (its own PRs)" : (b ~ /^codex\//) ? "codex lane" : (b ~ /^claude\//) ? "claude lane" : (b ~ /^chatgpt\//) ? "chatgpt lane" : "other/unowned"}' /tmp/bc_out.txt | sort | uniq -c | sort -rn
