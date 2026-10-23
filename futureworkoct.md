# Future work — October 2026

This is a working queue. Remove settled work instead of growing a history log.
Counts are dated snapshots; the generating command or Fleet Console is
authoritative when they disagree.

## Live handoff — 2026-10-22

`crypto-lab` `origin/main` is **`c58b1c4`** and `crypto-counsel`
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
- Twenty-five open lab repairs have green exact-head Linux CI. The first
  fifteen are Token Tell **#25**, VDF **#23**, Vigenère Break **#29**, VRF Gate
  **#22**, Web of Trust **#21**, What Is PQC **#3**, World Ciphers **#26**,
  Simon Period **#25**, Sleeve Check **#9**, SM2 Forge **#9**, SM9 Forge **#10**,
  SNARK Arena **#24**, SPDZ Forge **#25**, Split Point **#13** and STARK Tower
  **#21**.
- Eight newer green repairs are Subliminal Channels **#6**, Syndrome Drain
  **#26**, Syndrome Hints **#23**, TC26 Pair **#10**, Threshold Decrypt **#21**,
  Return Path **#8**, Ring Sign **#24** and Educational RSA **#23**. Educational
  RSA's separate security-evidence review is complete; its repair caps demo
  primes at 65,537 and hardens publishing. The macOS browser still aborts before
  startup with `MachPortRendezvousServer` error 141, so Linux is the browser
  authority and no local browser pass is claimed.
- RSA Forge **#25** and RSA Small Roots **#3** are the two latest green repairs.
  Their separate security-evidence reviews are complete. RSA Forge binds
  results to current inputs, corrects protocol claims and hardens publishing;
  RSA Small Roots corrects stale 55/18/28 evidence to the measured 63 unit,
  23 browser and 30 mutation results and hardens publishing.

All repair items remain working until a maintainer merges them and the required
Pages deployment is verified. Do not merge them from this maintenance pass.

**Pick up with:** `crypto-lab-schnorr-forge`, Fleet item
`2846962f-30f4-45a9-84b9-8c11f30c82a8`. Fetch fresh `origin/main`, inspect a
clean committed worktree, read the README and implementation, query the exact
lock and authenticated providers, and record one evidence-backed disposition.
Then continue queued security reviews one lab at a time.

## Fleet Console state — measured 2026-10-22

The work store has **1,203 total, 1,036 complete and 167 active** items:
**135 queued, 26 working and 6 blocked**.

Active work consists of:

- **135 queued security-evidence reviews.** Schnorr Forge is next.
- **26 working items:** 25 repairs awaiting merge/deployment (the lab PRs listed
  above) plus Adaptor Gate's security item for PR **#8**.
- **4 blocked security items:** Time Trust and LLL Break need GitHub alert-state
  reconciliation; Confirmer Signatures and Subliminal Channels return
  `Dependabot alerts are disabled`. Disabled or unreadable providers are not
  zero-alert evidence.
- **2 cross-repository blockers:** Dot's all-lab reading report and the Counsel
  primary API TLS route.

The evidence standard for every queued item is unchanged:

1. Fetch the repository immediately before evaluation, pin the fresh committed
   `origin/main`, and re-fetch before recording the result so mid-review movement
   is detected. Never describe an uncommitted working tree.
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
alone reports **11** stale pins after the seven recent Hub commits. The earlier
#244 result covered six pins on its old base, so rebase it onto current main,
regenerate the date ledger, and rerun its exact-head checks before treating it
as current. Hub #243 and #246–#249 had green exact-head checks at their recorded
heads; those results predate the latest main movement. Stacked #245 has no
GitHub suite because its base is #244's branch.

Finish any card-stamping pass with `node tools/level-sync.js`; `data-level`
belongs where the last writer puts it.

## Optional cleanup — not active maintenance

- Nine clean detached `crypto-counsel` worktrees remain under
  `~/repos/.fleet-maintenance-20261009/`. Their commits are ancestors of
  current counsel `main`; removing them is destructive and needs an explicit
  cleanup decision.
- `~/branch-cleanup-2026-10-21.txt` records deleted branches and restore SHAs.
  Keep it until the restore window is intentionally closed.
