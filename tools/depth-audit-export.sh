#!/bin/bash
# depth-audit-export.sh — export every lab's remote default branch into .scratch/.
#
# Run: node tools/depth-audit.js export
# Prevents: assurance reports inheriting uncommitted or stale local clone contents
# Reads: GitHub repository/default-branch listings and tarball endpoints through gh; records exports and read failures under .scratch/
# This helper is invoked by depth-audit.js export, not scheduled as a second audit.
#
# Called by `node tools/depth-audit.js export`. Read-only against GitHub: it asks
# for a tarball and writes nothing to any lab repository. It deliberately does NOT
# use the local clones — those carry uncommitted work and stale branches, and the
# whole value of the audit is that it read what GitHub serves.
#
# The sha of each export is recorded in .scratch/.exported.tsv so every anchor in
# the report points at the commit that was actually read. A lab that cannot be
# read lands in .scratch/.export-failed.tsv and is reported as unread rather than
# scored low.
set -uo pipefail
OWNER=systemslibrarian
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/.scratch"
if ! command -v gh >/dev/null 2>&1; then
  echo 'UNREAD: GitHub CLI is unavailable; prior exports were preserved.' >&2
  exit 1
fi
listing=$(mktemp)
trap 'rm -f "$listing"' EXIT

# The denominator is DECLARED by asking GitHub for the organisation's repositories,
# then keeping the lab-shaped ones. A hand-maintained list would be the thing that
# silently stops mentioning a lab.
if ! gh repo list "$OWNER" --limit 400 --json name,defaultBranchRef \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
      const repos = JSON.parse(s);
      if (!Array.isArray(repos)) throw new Error("Repository listing is not an array");
      for (const r of repos) {
        if (!r || typeof r.name !== "string") throw new Error("Repository name is unreadable");
        if (!/^crypto-lab-/.test(r.name) && !["snow2","crypto-compare"].includes(r.name)) continue;
        process.stdout.write(`${r.name}\t${(r.defaultBranchRef && r.defaultBranchRef.name) || "main"}\n`);
      }});' > "$listing"; then
  echo 'UNREAD: repository discovery failed; prior exports were preserved.' >&2
  exit 1
fi
mkdir -p "$DEST"
mv "$listing" "$DEST/.to-export.tsv"
: > "$DEST/.exported.tsv"
: > "$DEST/.export-failed.tsv"

one() {
  lab="$1"; branch="$2"
  tmp=$(mktemp -d)
  if ! gh api "repos/$OWNER/$lab/tarball/$branch" > "$tmp/a.tgz" 2>"$tmp/err"; then
    printf '%s\t%s\t%s\n' "$lab" "$branch" "$(head -c 200 "$tmp/err" | tr '\n' ' ')" >> "$DEST/.export-failed.tsv"
    rm -rf "$tmp"; return
  fi
  top=$(tar tzf "$tmp/a.tgz" 2>/dev/null | head -1 | cut -d/ -f1)
  if [ -z "$top" ]; then
    printf '%s\t%s\t%s\n' "$lab" "$branch" "empty or unreadable tarball" >> "$DEST/.export-failed.tsv"
    rm -rf "$tmp"; return
  fi
  if ! tar xzf "$tmp/a.tgz" -C "$tmp" 2>/dev/null; then
    printf '%s\t%s\t%s\n' "$lab" "$branch" "archive extraction failed" >> "$DEST/.export-failed.tsv"
    rm -rf "$tmp"; return
  fi
  rm -rf "$DEST/$lab"; mkdir -p "$DEST/$lab"
  if ! cp -a "$tmp/$top/." "$DEST/$lab/"; then
    printf '%s\t%s\t%s\n' "$lab" "$branch" "export copy failed" >> "$DEST/.export-failed.tsv"
    rm -rf "$tmp"; return
  fi
  printf '%s\t%s\t%s\n' "$lab" "$branch" "${top##*-}" >> "$DEST/.exported.tsv"
  rm -rf "$tmp"
}

n=0
while IFS=$'\t' read -r lab branch; do
  one "$lab" "$branch" &
  n=$((n+1))
  [ $((n % 8)) -eq 0 ] && wait
done < "$DEST/.to-export.tsv"
wait
printf 'exported %s, unreadable %s\n' \
  "$(wc -l < "$DEST/.exported.tsv" | tr -d ' ')" \
  "$(wc -l < "$DEST/.export-failed.tsv" | tr -d ' ')"
[ ! -s "$DEST/.export-failed.tsv" ]
