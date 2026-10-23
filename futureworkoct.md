# Future work — October 2026

This is a working queue. Remove settled work instead of growing a history log.
Counts are dated snapshots; the generating command or Fleet Console is
authoritative when they disagree.

## Live handoff — 2026-10-23

`crypto-lab` `origin/main` is **`0730c46`** and `crypto-counsel`
`origin/main` is **`cc2979b`**. The queue branch incorporates that freshly
fetched Hub main.

Nothing below is merged merely because its checks pass:

- crypto-counsel **#18** reviews the **28** genuinely stale corpus entries
  (16 accurate, 12 corrected, 0 unsettled); **#19** is stacked on #18 and
  refreshes the README snapshot. All 190 `reviewed: null` entries remain
  untouched.
- crypto-lab **#244–#249** contain the date/evidence refreshes, teach probes,
  advisory controls, learning-path split and knowledge-map metadata. **#245**
  is stacked on #244. This handoff is **#243**.
- Fifty-seven open lab repair PRs have green current-head Linux CI: the 26
  Fleet-tracked repairs awaiting merge/deployment, AES Anatomy **#2**, Clock
  Arithmetic **#2**, Scloud Vault **#21**, Search Vault **#23** and Shadow Vault
  **#31**, Shamir Gate **#17**, Shor **#21**, Signed Bytes **#23**, Silent
  Tally **#29**, PQ Chooser **#5**, PQ Rotation **#24**, PQ TLS Handshake
  **#26**, PQXDH Wire **#12**, Privacy Pass **#17**, Proof Tally **#18** and
  Protocol Compose **#23**, PSI Gate **#28**, Pulse Chain **#5**, Quantum
  Entropy **#23**, Quantum Vault KpqC **#21**, Ratchet Wire **#17**, Reshare
  Circle **#23**, Nonce Lattice **#27**, NTRU Classic **#24**, Oblivious
  Shelf **#21**, Opaque Gate **#34**, ORAM Vault **#30**, Order Leak **#14**,
  OT Gate **#26**, OTP Vault **#26** and Padding Oracle **#23**. The earlier full
  GitHub readback found
  the first 54 open and non-draft with successful current-head workflow runs.
  OT Gate #26 and OTP Vault #26 were then opened, read back open, non-draft and
  cleanly mergeable, and passed their exact-head runs. Padding Oracle **#23**
  was subsequently read back open, non-draft and cleanly mergeable, and passed
  its exact-head run. **PQ Rotation #24** remains the known conflicting PR;
  the other 56 were mergeable at their recorded readbacks. NTRU Classic #24 is
  green at exact head `f81f1ce`, Oblivious Shelf #21 at `02a4593`, and Opaque Gate #34
  at `131cb9f`; ORAM Vault #30 is green at `921428c`; Order Leak #14 is
  green at `8a0b35e`; OT Gate #26 is green at `e4dcca4`; OTP Vault #26 is
  green at `e1d30ba`; Padding Oracle #23 is green at `a8b1ab9`. Scloud Vault #21,
  Search Vault #23, Shadow Vault #31, Shamir Gate #17 and Shor #21 advanced
  after the SHAs stored in their Fleet evidence; their new heads are green,
  but their evidence must be reconciled before merge. The
  Fleet records and PR comments hold their per-lab evidence; do not duplicate
  that history here and do not merge them from this maintenance pass.
- Twenty-nine queued security-evidence reviews are recorded complete. The first
  23 have recorded-head readable zero-open-alert Dependabot and secret-scanning
  results plus a zero-advisory exact lock; code scanning remains explicitly
  incomplete because GitHub reports no analysis. Opaque Gate has a complete
  cursor-paginated zero-open-alert Dependabot read and a zero-vulnerability
  exact-lock audit; no uncollected provider was converted into a pass. ORAM
  Vault has complete cursor-paginated zero-open-alert Dependabot and secret-
  scanning reads plus a zero-vulnerability exact-lock audit; code scanning
  remains explicitly incomplete because GitHub reports no analysis. Order Leak
  has complete zero-open-alert Dependabot and secret-scanning reads, a
  zero-vulnerability exact-lock audit, and a successful Linux run that killed
  all 12 recorded mutations after a green 20-spec baseline; code scanning
  likewise remains explicitly incomplete because GitHub reports no analysis.
  OT Gate has complete zero-open-alert Dependabot and secret-scanning reads,
  zero-vulnerability exact-lock audits on Node 22/24/26, **28/28** Linux
  browser checks and **10/10** killed mutations after a green baseline; code
  scanning again remains explicitly incomplete because GitHub reports no
  analysis. OTP Vault has complete zero-open-alert Dependabot and secret-
  scanning reads, zero-vulnerability exact-lock audits on Node 22/24/26,
  **28/28** Linux browser checks and **9/9** killed mutations after a green
  baseline; code scanning remains incomplete because GitHub reports no
  analysis. Padding Oracle has complete zero-open-alert Dependabot and secret-
  scanning reads, zero-vulnerability exact-lock audits on Node 22/24/26,
  **12/12** Linux browser checks and **9/9** killed mutations after a green
  baseline; code scanning remains incomplete because GitHub reports no
  analysis.
  The five moved heads named above now need fresh evidence reconciliation.
  Their source repairs remain open, and their names and evidence stay in the
  Fleet records rather than becoming history here.

**Next:** Paillier Gate item `7f7f6d35-71d9-423e-9ac5-781df28d058e`.
Continue queued security reviews one lab at a time.

## Fleet Console state — measured 2026-10-23

The work store has **1,204 total, 1,066 complete and 138 active** items:
**105 queued, 27 working and 6 blocked**.

Active work consists of:

- **105 queued security-evidence reviews.** Paillier Gate is next.
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

On this queue branch after incorporating Hub `0730c46`, with counsel **#18**
checked out, 11 of 13 checks pass. Main commit `0730c46` fixed Search Vault's
generated section count and ordering, but `catalog-sync` still reports a
two-line wording drift: the query-integrity outcome and limit in `CATALOG.md`
do not match `tools/catalog-exhibits.json`. `lab-dates` reports six pins made
stale by newer committed lab changes: Iron Letter, Protocol Compose, Threshold
Decrypt, Multivariate, Broken Trust and Time Lock Puzzle. Regenerate the final
catalog wording and re-derive those dates from freshly fetched lab heads before
calling the Hub clean; keep those fixes out of this tracker-only PR.

A fresh PR readback found **#244**, **#246** and **#248** conflicting despite
successful current-head status rollups. **#245** remains stacked on #244 and
has no status rollup of its own. **#247** and **#249** are open, mergeable and
green. **#243** is mergeable, but its current README-catalog workflow correctly
fails on the same two generated `CATALOG.md` lines recorded above. Refresh or
supersede the conflicting branches, and re-evaluate every open Hub PR after any
further Hub-main movement; historical green runs do not resolve a merge conflict.

Finish any card-stamping pass with `node tools/level-sync.js`; `data-level`
belongs where the last writer puts it.

## Optional cleanup — not active maintenance

- Nine clean detached `crypto-counsel` worktrees remain under
  `~/repos/.fleet-maintenance-20261009/`. Their commits are ancestors of
  current counsel `main`; removing them is destructive and needs an explicit
  cleanup decision.
- `~/branch-cleanup-2026-10-21.txt` records deleted branches and restore SHAs.
  Keep it until the restore window is intentionally closed.
