# Future work — October 2026

This is a working queue. Remove settled work instead of growing a history log.
Counts are dated snapshots; the generating command or Fleet Console is
authoritative when they disagree.

## Live handoff — 2026-10-23

`crypto-lab` `origin/main` is **`db07bd5`** and `crypto-counsel`
`origin/main` is **`cc2979b`**. The queue branch is based directly on that
Hub main.

Nothing below is merged merely because its checks pass:

- crypto-counsel **#18** reviews the **28** genuinely stale corpus entries
  (16 accurate, 12 corrected, 0 unsettled); **#19** is stacked on #18 and
  refreshes the README snapshot. All 190 `reviewed: null` entries remain
  untouched.
- crypto-lab **#244–#249** contain the date/evidence refreshes, teach probes,
  advisory controls, learning-path split and knowledge-map metadata. **#245**
  is stacked on #244. This handoff is **#243**.
- Forty-four open lab repair PRs have green exact-head Linux CI: the 26
  Fleet-tracked repairs awaiting merge/deployment, AES Anatomy **#2**, Clock
  Arithmetic **#2**, Scloud Vault **#21**, Search Vault **#23** and Shadow Vault
  **#31**, Shamir Gate **#17**, Shor **#21**, Signed Bytes **#23**, Silent
  Tally **#29**, PQ Chooser **#5**, PQ Rotation **#24**, PQ TLS Handshake
  **#26**, PQXDH Wire **#12**, Privacy Pass **#17**, Proof Tally **#18** and
  Protocol Compose **#23**, PSI Gate **#28** and Pulse Chain **#5**. The Fleet records and PR
  comments hold their per-lab evidence; do not duplicate that history here and
  do not merge them from this maintenance pass.
- Sixteen queued security-evidence reviews are complete. Each has readable
  zero-open-alert Dependabot and secret-scanning results plus a zero-advisory
  exact lock; code scanning remains explicitly incomplete because GitHub
  reports no analysis. Their source repairs remain open, and their names and
  evidence stay in the Fleet records rather than becoming history here.

**Next:** Quantum Entropy item `54bf50d9-f1e8-4a26-93af-e1f410b0cffc`.
Continue queued security reviews one lab at a time.

## Fleet Console state — measured 2026-10-23

The work store has **1,204 total, 1,053 complete and 151 active** items:
**118 queued, 27 working and 6 blocked**.

Active work consists of:

- **118 queued security-evidence reviews.** Quantum Entropy is next.
- **27 working items:** 26 repairs awaiting merge/deployment and Adaptor Gate's
  security item for PR **#8**.
- **4 blocked security items:** Time Trust and LLL Break need GitHub alert-state
  reconciliation; Confirmer Signatures and Subliminal Channels return
  `Dependabot alerts are disabled`. Disabled or unreadable providers are not
  zero-alert evidence.
- **2 cross-repository blockers:** Dot's all-lab reading report and the Counsel
  primary API TLS route.

The evidence standard for every queued item is unchanged:

1. **Standing rule:** fetch the repository immediately before every evaluation,
   pin the fresh committed `origin/main`, and re-fetch immediately before
   recording evidence or declaring completion so mid-review movement is
   detected. Never describe an uncommitted working tree.
2. Read the committed README and implementation.
3. Query authenticated Dependabot, secret-scanning and code-scanning endpoints,
   preserving disabled/unavailable states.
4. Query every exact lockfile version against the applicable registry.
5. Run the repository's real unit/build/browser gates and inspect exact-head
   workflow provenance. A timestamp or an absent alert list is not a pass.
6. Track any source repair separately and leave deployment unverified while its
   PR is open.

The saved Fleet snapshot is still from 2026-10-19 at Hub **`b1b9876`** and
contains **232 labs**, while the current catalog contains **243**. Its daily
02:00 America/New_York refresh is disabled. After the open maintenance settles,
run a complete 243-lab refresh and verify the saved readback before publishing
it. Enabling the schedule or changing repository security settings is an owner
decision.

## Hub verification

Before another handoff, fetch both repositories and run:

```sh
git -C . fetch origin
git -C ../crypto-counsel fetch origin
for c in readme-sync corpus-sync concept-sync catalog-sync tools-sync \
         theme-sync gate-sync dispatch-sync port-sync lab-dates \
         games-sync teach-build knowledge-map-sync; do
  printf '%-22s ' "$c"
  node "tools/$c.js" check >/dev/null 2>&1 && echo PASS || echo FAIL
done
```

At this checkpoint, 12 of 13 checks pass on current `origin/main`. `lab-dates`
reports six pins made stale by newer committed lab changes: Iron Letter,
Protocol Compose, Threshold Decrypt, Multivariate, Broken Trust and Time Lock
Puzzle. Re-derive those dates from freshly fetched lab heads before calling the
Hub clean. The earlier #244 refresh predates this movement and must be refreshed
or superseded; do not assume its green historical runs cover the six current
drifts. #245 is stacked on #244 and likewise needs its base rechecked. The
exact-head Teach drift dispatch was green after one transient host-package
timeout: 24 worksheets had zero drift and all 47 recorded issue states were
accounted for (4 automated matches, 43 explicit manual-cadence checks). Hub
#243 and #246–#249 had green exact-head checks at their recorded heads, but all
open Hub PRs must be evaluated against the latest Hub-main movement.

Finish any card-stamping pass with `node tools/level-sync.js`; `data-level`
belongs where the last writer puts it.

## Optional cleanup — not active maintenance

- Nine clean detached `crypto-counsel` worktrees remain under
  `~/repos/.fleet-maintenance-20261009/`. Their commits are ancestors of
  current counsel `main`; removing them is destructive and needs an explicit
  cleanup decision.
- `~/branch-cleanup-2026-10-21.txt` records deleted branches and restore SHAs.
  Keep it until the restore window is intentionally closed.
