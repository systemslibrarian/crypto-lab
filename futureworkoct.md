# Future work — October 2026

This is a working queue. Remove work when it is complete; keep only enough
history to avoid reopening settled questions. Counts are dated snapshots, and
the generating command or Fleet Console is authoritative when they disagree.

---

## Current handoff — 2026-10-22

`crypto-lab` `origin/main` is **`1e6f181`** and `crypto-counsel` `origin/main` is
**`cc2979b`**. This queue branch is based directly on that crypto-lab main. The
following completed changes are open for maintainer review and must not be
treated as merged:

- crypto-counsel **#18** reviews the 28 genuinely stale corpus entries; **#19**
  is stacked on #18 and refreshes the catalog README snapshot.
- crypto-lab **#244** refreshes card dates and generated metadata; **#245** is
  stacked on #244 and refreshes catalog evidence.
- crypto-lab **#246–#249** cover teach probes, advisory-chip controls, the
  Cryptanalyst path split and knowledge-map tool metadata.
- AES Anatomy **#2**, Clock Arithmetic **#2**, Harvest Vault **#21**, Hybrid
  Wire **#17**, Shelf Oracle **#13**, Compression Leak **#6** and WebAuthn
  **#25** contain the completed lab-specific fixes and verification work.
- Time-lock Puzzle **#24** and Timing Oracle **#31** make their real npm publish
  controls portable to Homebrew Node 26. Timing Sidechannel **#26** applies the
  same repair, rejects non-terminating secret-generator inputs and corrects its
  running-minimum score documentation. All three required Linux workflows pass.
- Token Tell **#25** protects cache ownership on the shared Pages origin,
  preserves exact 64-bit verification integers and rejects inherited deep-link
  names. VDF **#23** retires in-flight verification verdicts when their inputs
  change and makes its publish test portable. Vigenère Break **#29** retires
  animated solver transcripts when the workbench changes and applies the same
  publish-test repair. VRF Gate **#22** enforces RFC 9381 proof decoding,
  rejects non-canonical VDF proofs and incomplete beacon rounds, retires stale
  asynchronous UI results, and makes its publish test portable. All four
  exact-head Linux workflows pass; their Fleet repair items remain working
  until merge and deployment are verified.
- Web of Trust **#21** replaces collision-prone 8-byte signature bindings with
  full RFC 7638 SHA-256 JWK thumbprints, enforces key self-revocation, rejects
  silent identity replacement and prevents stale asynchronous trust results.
  Its 27 unit tests, 15 browser claims and both axe viewport sweeps pass at the
  exact repair head; the Fleet repair remains working until merge and
  deployment are verified.
- Adaptor Gate **#8** upgrades Vite to 8.3.4 and the Playwright image to 1.64.1,
  and fixes the accessibility regression found during validation. Its 127 unit
  and 116 browser tests pass, but its Fleet item stays working until the fix is
  on the default branch and the deployment is verified.
- This current-state audit is crypto-lab **#243**.

All of those PRs were open and GitHub reported them clean on 2026-10-22. Do not
merge them here; maintainer review is still required.

**Pick up with:** What Is PQC, the next queued Fleet Console security-evidence
review. Read its committed README and implementation, query its exact lock
versions and provider alerts, and record one evidence-backed disposition. Then
continue the queue one lab at a time. Do not infer a clean security state from
an unavailable provider.

Before making another handoff, fetch both repositories and run the fast loop:

```sh
git -C . fetch origin && git -C ../crypto-counsel fetch origin
for c in readme-sync corpus-sync concept-sync catalog-sync tools-sync \
         theme-sync gate-sync dispatch-sync port-sync lab-dates \
         games-sync teach-build knowledge-map-sync; do
  printf '%-22s ' "$c"
  node "tools/$c.js" check >/dev/null 2>&1 && echo PASS || echo FAIL
done
```

Quote `"tools/$c.js"` and pass `check` separately. zsh does not split an
unquoted scalar containing both the script and argument.

At this checkpoint, 12 of 13 checks pass on `origin/main`. `lab-dates` alone
reports the six expected stale pins for BB84, Protocol Compose, Threshold
Decrypt, Multivariate, Broken Trust and Time-lock Puzzle; #244 contains those
six corrections.

---

## Active Fleet Console maintenance — measured 2026-10-22

The work store has **1,183 total, 1,017 complete and 166 active** items:
**155 queued, 6 working and 5 blocked**. Seventy-two work items have been
completed since the preceding version of this file; 91 completions have now
been recorded in this maintenance pass, including newly discovered repairs.

The active queue is:

- **159 security-evidence items:** 155 queued, Adaptor Gate working, and Time
  Trust, LLL Break and Confirmer Signatures blocked.
- **5 green repairs awaiting merge/deployment:** Token Tell #25, VDF #23,
  Vigenère Break #29, VRF Gate #22 and Web of Trust #21. Their implementation
  and exact-head CI are complete, but Fleet correctly retains them as working
  because required deployment is still unverified.
- **2 cross-repository blockers:** Dot's all-lab reading report and the Counsel
  primary API TLS route.
- **0 dependency-change reviews:** all 33 were individually reviewed against
  committed source and current evidence. The 31 that were open at the previous
  checkpoint are now complete.

### Security evidence still needing work

The saved census found 230 repositories whose GitHub Dependabot-alert endpoint
was readable, 15 where alerts were disabled, and nine open alerts: three each in
Adaptor Gate, LLL Break and Time Trust. All nine name the Vite/launch-editor
family fixed in Vite 8.3.3.

- Adaptor Gate's source fix is PR #8; leave the item working until merge and a
  default-branch deployment prove the repair.
- Token Tell, Traitor Trace, VDF, Vigenère Break, VRF Gate and Web of Trust each
  received a committed-source review with exact-lock, provider and exact-head
  workflow evidence. Traitor Trace needed no patch. The other five exposed the
  repair work linked above; their security-evidence items are complete without
  pretending the still-unmerged repairs are deployed. Web of Trust's review
  verified the RFC 7638/8037 publications before changing its key binding.
- LLL Break and Time Trust already have Vite 8.3.4 and clean exact-lock registry
  results on current `main`, but GitHub still reports alerts against 8.3.2.
  Reconcile the provider record; do not downgrade or mark the alert fixed merely
  from local evidence.
- Confirmer Signatures is blocked because GitHub returns HTTP 403,
  `Dependabot alerts are disabled`. Its exact npm lock has no registry advisory,
  but its Python requirements are not a complete transitive lock, so neither
  fact substitutes for provider evidence.
- Dependabot alerts are also disabled for AKE Ladder, AES Anatomy, Clock
  Arithmetic, Compression Leak, DVD Scramble, Hash Hunt, Key Lifecycle, Log
  Forge, Next Number, Prime Witness, Residue Gate, Subliminal Channels, TESLA
  Broadcast and Twist Trap. Enabling those repository settings is an owner
  decision; absent alerts must not be reported as zero.

For the remaining queued items, continue the same per-lab evidence standard:
confirm the inspected SHA is still current, avoid uncommitted working-tree
content, read the committed README and implementation, query all exact lockfile
versions, read the provider result, and verify current-head CI. A saved
completion timestamp alone is not evidence.

### Dashboard state after the queue

The private Fleet Console still shows a saved 2026-10-19 source snapshot at hub
**`b1b9876`**, containing **232 labs**, while the current catalog contains
**243**. Its daily 02:00 America/New_York refresh is disabled. After the open
maintenance is settled, run a complete refresh, verify all 243 labs and only
then publish a replacement snapshot. Enabling the schedule or changing
repository security settings remains an explicit owner decision.

### External blockers

- Dot's all-lab reading report needs the cited Library artifact or independent
  completion of the remaining bounded reviews.
- Counsel's primary API TLS route needs the recorded Cloudflare certificate
  repair. Local repository changes cannot repair that external route.

---

## Optional cleanup decisions

### Detached counsel worktrees

Nine clean detached `crypto-counsel` worktrees remain under
`~/repos/.fleet-maintenance-20261009/`. Their commits (`0d032ee`, `051a93c`,
`2186e49` twice, `4de0cfe`, `7631877`, `a6b1036`, and `08dade2` twice) are all
ancestors of current counsel `main`; the worktrees no longer protect unique
commits. Removing the directories is still destructive, so do it only as an
explicit cleanup task.

```sh
git -C ../crypto-counsel worktree list
```

### Branch-cleanup restore window

`~/branch-cleanup-2026-10-21.txt` records 30 deleted remote branches and four
deleted local branches with full tip SHAs and PR numbers. Keep it until the
restore window is intentionally closed, then delete it. GitHub automatically
deletes merged head branches for `crypto-lab`, but not for `crypto-counsel`;
decide whether to enable that counsel setting.

---

## Completed work retained as pointers

- Corpus: crypto-counsel #18 found **28**, not 20, stale reviewed entries:
  16 accurate, 12 corrected and 0 unsettled. It left all 190 never-reviewed
  entries untouched. #19 refreshes the README snapshot.
- Catalog: crypto-lab #244–#249 contain the date/evidence refreshes, automated
  teach claims, advisory controls, path split and knowledge-map documentation.
- Depth verification: the five lab PRs listed in the handoff pin production
  paths to published vectors or independent implementations; all mutation
  controls failed as intended.
- Fleet Console: 91 work items are complete with item-level evidence. This
  includes both knowledge-map metadata gaps, all three missing real tool runs,
  five Signature Gate teaching-role reviews, Collision Vault's cascades,
  interpretation work, all 33 dependency reviews and 39 security-evidence
  restorations, plus the repair tasks found while restoring that evidence.
- Branch cleanup: 30 remote and four local branches were removed and 20 stale
  tracking refs pruned; the restore manifest is the file named above.

Finish any card-stamping pass with `node tools/level-sync.js`; `data-level`
belongs where the last writer puts it.

## Settled — do not re-file

- `key-rush` really checks shares by recombining their values.
- `secret-council` derives its possibility count from the result.
- Games deliberately use `games-sync` rather than catalog cards or exemptions.
- `quantum-vault-kpqc`'s light theme, `blind-oracle-api`'s absent page and
  `confirmer-signatures`' absent `dependabot.yml` are intentional divergences.
