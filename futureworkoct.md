# Future work — October 2026

This is a working queue. Remove settled work instead of growing a history log.
Counts are dated snapshots; the generating command or Fleet Console is
authoritative when they disagree.

## Live handoff — 2026-10-27, measured at 07:11 EDT

Both remotes were fetched immediately before this handoff was written.
`crypto-lab` `origin/main` is **`8c11d75`** and `crypto-counsel`
`origin/main` is **`2be1cd0`**. This replacement branch starts exactly at that
Hub main. The local counsel checkout is clean but still at **`dbc0912`**, one
commit behind its remote; that distinction explains the local `corpus-sync`
result below.

The catalog contains **251** cards. The hero reads **250**, which is what the
grid shows after excluding the one `learning-game` card. The encyclopedia
roadmap is at **47 Live / 1 Planned** after L-R-12; A-D-15 is the remaining
roadmap integration.

Nothing below is merged merely because its checks pass.

### Hub consistency — 10 of 13 pass in this workspace

`readme-sync`, `concept-sync`, `catalog-sync`, `tools-sync`, `theme-sync`,
`gate-sync`, `lab-dates`, `games-sync`, `teach-build` and
`knowledge-map-sync` pass against the current Hub tree.

The three failures have specific, non-overlapping causes:

- **`corpus-sync` is reading the stale local counsel checkout.** It sees 251
  catalog demos against 250 corpus demos and names `lattice-ibe` as missing.
  Counsel PR #26 already added that record to `origin/main` at `2be1cd0`.
  Checking the exact remote file through `/dev/stdin` passes at 251/251 with
  zero missing and zero stale entries. There is no Lattice corpus content work
  left; an authorized counsel maintenance pass only needs to fast-forward its
  clean local checkout.
- **`dispatch-sync` fails only on `crypto-lab-anamorphic`.** It observes 256
  labs / 254 auto-merge jobs / 253 dispatch sites against census pins of
  255 / 253 / 252. The one unpinned lab accounts for all three count failures
  and the derived evidence-coverage refusal.
- **`port-sync` fails only on `crypto-lab-anamorphic`.** Its Playwright config
  uses unique port **4750** with `--strictPort`; the value is not yet in
  `tools/playwright-ports.json`.

Anamorphic was unmerged when the earlier draft was measured. It is now on
`main`, so its card and both pins belong in the upcoming A-D-15 Hub integration.

### Open Hub pull requests — re-read 2026-10-27

Eight older Hub PRs were open before this replacement branch was pushed. This
branch is intended to add a ninth and supersede #243 without closing or
force-pushing it.

| PR | State | Note |
|---|---|---|
| **#243** | mergeable, unstable | old handoff branch at pushed head `318e42d`; its one failed check describes that old head, not this replacement |
| **#244** | conflicting | |
| **#245** | mergeable, clean | still stacked on #244 rather than `main` |
| **#246** | conflicting | |
| **#247** | conflicting | |
| **#248** | conflicting | |
| **#249** | mergeable, clean | |
| **#251** | conflicting | |

Five of the eight conflict. Refresh or supersede them, and re-read every open
PR after any further movement on Hub main; a historical green run does not
resolve a merge conflict.

### A-D-15 — implementation and Pages delivered; integration remains

`systemslibrarian/crypto-lab-anamorphic` PR #1 was independently corrected at
head **`3f5ce684a4c0`** and merged as main **`c2ef8df2dd20`** on 2026-10-27.
All five PR quality jobs plus CodeQL passed. Exact-main run **40493251507** passed
Node 22/24/26, browser/accessibility/reflow and clean-baseline mutation gates,
then deployed successfully; exact-main CodeQL also passed. GitHub Pages now uses
`build_type: workflow`, the public URL returns HTTP 200, and its served
JavaScript contains the reviewed `WHY IT MATTERS` marker.

The lab is live, but **A-D-15 is not yet published into the Hub, counsel corpus
or roadmap and must not be marked 48/48 early**. Remaining work:

1. Continue in the separate A-D-15 integration lane, not in this tracker PR.
   `../crypto-lab-ad15-integration` is clean at current Hub main on
   `codex/ad15-hub-integration-20261027`. The older
   `../crypto-lab-ad15-hub` still holds an uncommitted roadmap edit on
   `codex/ad15-roadmap-20261027`; it is two Hub-main commits behind and must be
   reconciled with merged #338/#339 rather than overwritten or duplicated.
2. Add the Hub card and exact source review, then run `readme-sync`,
   `lab-dates`, `node tools/catalog-evidence.js write` and
   `catalog-sync check`.
3. Add counsel entry `demo_crypto_lab_anamorphic`, review its prose against
   exact main, and run `corpus-sync check` against the resulting counsel tree.
4. Add the concept-coverage citation and append-only version note, and advance
   the encyclopedia roadmap from 47 Live / 1 Planned to 48/48 only after the
   publication evidence exists.
5. Regenerate the teach layer with `teach-build.js`; a new card otherwise puts
   `teach/index.html` out of date.
6. Pin Playwright port 4750 with `port-sync.js` and update the dispatch census
   with `dispatch-census.js write`.
7. Run all thirteen Hub checkers, finish any card-stamping pass with
   `node tools/level-sync.js`, and verify the deployed Hub and counsel assets.
8. Remove the frozen pre-audit copy `~/repos/_ad15-anamorphic-audit` only after
   the integration owner confirms it is no longer needed. It was not removed
   during this tracker-only pass.

### Fleet pull requests — measured 2026-10-27 at 07:07 EDT

Repositories whose names begin with `crypto-lab` have **293** open PRs:
**223 Dependabot** and **70 owner-authored**. Eight owner-authored PRs are the
Hub PRs above, leaving **62 owner-authored lab PRs**. Per-lab evidence lives in
the Fleet records and PR comments and is not duplicated here. The open
exceptions that still need explicit handling are:

- **Conflicting; rebase before evaluating:** PQ Rotation **#24**
  (`59b1c6dd2f4e`), Search Vault **#23** (`344a310bac0a`) and Shamir Gate
  **#17** (`1968e533e9ac`).
- **Mergeable and clean; stored evidence still unreconciled:** Scloud Vault
  **#21** (`20569e371a4f`) and Shor **#21** (`5982efd13589`). Their build jobs
  passed, but the auto-merge jobs skipped; reconcile their advanced heads
  before any merge.
- Code scanning remains explicitly **unmeasured since 2026-10-23** for the
  reviewed fleet. An absent, disabled or unreadable provider is never
  zero-alert evidence.

Only four of the 223 open fleet Dependabot PRs predate 2026-10-20, and all four
are majors the auto-merge workflow deliberately leaves for a human:

| Lab | PR | Bump |
|---|---|---|
| `crypto-lab-pake-gate` | #43 | `globals` 13.24.0 → 17.13.0 |
| `crypto-lab-air-stream` | #7 | `typescript` 5.9.3 → 7.0.2 |
| `crypto-lab-sm9-forge` | #7 | `typescript` 5.9.3 → 7.0.2 |
| `crypto-lab-tc26-pair` | #8 | `typescript` 5.9.3 → 7.0.2 |

The three TypeScript 5 → 7 bumps are one decision, not three.

**Next security review in the last authoritative Fleet snapshot:** Mayo Seal
item `e67e91de-dce3-4f95-bb27-134a200d6a7b`. Continue queued reviews one lab at
a time.

## Fleet Console state — measured 2026-10-23, not re-measured

The work-store counts below could not be re-derived from repositories. They are
four days old; the Fleet Console is authoritative over them and no current-state
claim should be inferred from this section.

The last snapshot had **1,204 total, 1,073 complete and 131 active** items:
**98 queued, 27 working and 6 blocked**.

- **98 queued security-evidence reviews.** Mayo Seal was next.
- **27 working items:** 26 repairs awaiting merge/deployment and Adaptor Gate's
  security item for PR **#8**.
- **4 blocked security items:** Time Trust and LLL Break needed GitHub
  alert-state reconciliation; Confirmer Signatures and Subliminal Channels
  returned `Dependabot alerts are disabled`.
- **2 cross-repository blockers:** Dot's all-lab reading report and the Counsel
  primary API TLS route.

The evidence standard for every queued item is unchanged:

1. Fetch the repository immediately before evaluation, pin fresh committed
   `origin/main`, and re-fetch before recording evidence so mid-review movement
   is detected. Never describe an uncommitted working tree.
2. Read the committed README and implementation.
3. Query authenticated Dependabot, secret-scanning and code-scanning endpoints,
   preserving disabled and unavailable states.
4. Query every exact lockfile version against the applicable registry.
5. Run the repository's real unit/build/browser gates and inspect exact-head
   workflow provenance. A timestamp or absent alert list is not a pass.
6. Track source repair separately and leave deployment unverified while its PR
   remains open.

At the 2026-10-23 measurement, the saved Fleet snapshot was dated 2026-10-19 at
Hub **`b1b9876`** and contained **232 labs**. Against today's 251 catalog cards,
that saved count is nineteen labs behind. Its daily 02:00 America/New_York
refresh was disabled at that measurement; its current schedule state was not
re-read. After open maintenance settles, refresh against the catalog count
reported that day and verify the saved readback before publishing it. Enabling
the schedule or changing repository security settings is an owner decision.

## Hub verification

Before another handoff, fetch both repositories and run each checker once:

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

`corpus-sync` reads the counsel **working tree**, not its fetched remote. Until
that clean clone is fast-forwarded, verify the remote corpus without modifying
it:

```sh
git -C ../crypto-counsel show origin/main:corpus.json \
  | node tools/corpus-sync.js check /dev/stdin
```

Record what the run reports, not what this handoff predicted. Keep lab-side and
roadmap integration edits out of this tracker-only PR.

## Optional cleanup — no cleanup performed

- Nine detached `crypto-counsel` worktrees remain under
  `~/repos/.fleet-maintenance-20261009/`. All nine are clean and their commits
  are ancestors of counsel `origin/main` at `2be1cd0`, but the directory was
  explicitly left untouched.
- That maintenance directory is **49 GB** with **1,420 top-level entries** and
  **472 top-level directories**. Reclaiming it is a separate, destructive
  owner decision; do not conflate it with the nine counsel registrations.
- Three dead-path worktree registrations are prunable but were not pruned: Hub
  paths `/private/tmp/catalog-evidence-current.64nVx9/crypto-lab` and
  `/private/tmp/lr04-hub-validate.eS15cU/crypto-lab`, plus counsel path
  `/private/tmp/catalog-evidence-current.64nVx9/crypto-counsel`.
- `~/branch-cleanup-2026-10-21.txt` still exists and records deleted branches
  and restore SHAs. Keep it until the restore window is intentionally closed.
