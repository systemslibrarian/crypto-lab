# Remaining work — measured 2026-10-28

Read-only audit. Nothing in Part B was fixed, merged, closed, deleted, committed or
pushed. Every count below was re-measured today against fetched remotes; where a figure
could not be derived, it says so rather than carrying the old one forward.

`futureworkoct.md` was the starting point and is treated as a **stale claim throughout**.
It was written 2026-10-27 at hub `64ae547`, before the encyclopedia audit-fix round, hub
PRs #344 and #343, commits `3586976` and `cab71cb`, and Part A below. It is untouched.

---

## Part A — result-based staleness fix (done, merged, live)

**Commit `241a414`** (`241a41419aeed4807d1bda3ca7a757310b355832`), committed straight to
main from a temporary worktree. All seven hub workflows and the Pages deploy green; the
live hub serves the build byte for byte (`index.html` 883,352 bytes, sha256 `0984d333…`).

**The gap it closes.** `movedSubstantively` asks whether `README.md` or `src/` changed,
because those are what the implementation derivation reads. References are not derived
from those alone: every `.md` in a lab is scanned, `AGENTS.md` and `docs/` included. A
docs edit could therefore change a card's references under a pin that rule still called
fresh. Recorded beside the `cab71cb` fix, and measured there at 23 labs if closed by
widening the path list.

**How it is closed.** For every reviewed lab whose clone has moved past its pin, the
reference set is derived at the pin **and** at the current head and the two are compared.
Identical, the pin holds however many files moved. Different, the lab is reported stale
and the names added or dropped are carried on the state so the report prints them. The
path rule is unchanged and still stale on its own terms; neither rule can overrule the
other into silence. Both sides run `evidenceFor` with no review applied, so the comparison
is between two raw scanner outputs, never between a reviewed card and an unreviewed one.
`verify` asks the same question the writer does.

**Selftests — 97 passed, 0 failed** (was 90). Seven new checks on a throwaway repository
of its own, because `clone-source` caches a clone's tracked-file list for the run and a
fixture that gains a file after that list is read would never have it scanned:

| Case | Asserts |
|---|---|
| docs reword, no reference change | non-substantive by the path rule, **and** the pin holds |
| docs edit adding `Streebog` | non-substantive by the path rule, **and** stale with the name reported |
| derived sets bracket the name | `Streebog` absent before, present after |
| lockfile-only bump | non-substantive, **and** the pin holds under both rules (the `cab71cb` regression) |

Proven to bite: disabling the result rule fails the selftest (96 passed, 1 FAILED).
Positive control on real history — Search Vault and Envelope KMS across 30 commits each
report named drift — so a zero from the fleet run is a measurement, not a silence.

**Fleet run — 0 labs flagged.** 46 reviewed labs have a head past their pin; the drift
test executed on all 46 (counted, not assumed); none has a changed reference set; 0 pins
unreadable. No card changed, no `CATALOG.md` row changed, no lab newly needs re-review.

CI runs it: `tools/catalog-evidence.js selftest` is step 34 of `readme-sync.yml`.

---

## Summary

**Total still open: 418 pull requests (345 Dependabot, 73 owner) plus 7 non-PR work areas.**

### Agent can finish — effort M, roughly one working session in three batches

| Item | Count | Effort |
|---|---|---|
| Hub PR #249, documented tool purposes, mergeable-clean, 4 lines | 1 | S |
| Hub PRs #243/#340 futureworkoct refresh, one supersedes the other | 2 | S |
| Hub PRs #244/#245/#246/#247/#248/#251, all need rebase onto today's main | 6 | M |
| Owner lab PRs that are mergeable-clean and only need gate-watching | 58 | L (mechanical) |
| Dependabot `npm-minor-and-patch` group bumps | 214 | M (auto-merge eligible) |
| Prunable worktree registrations and the stale ad15 roadmap edit | 3 | S |

### Needs Paul's decision — effort S to decide, the work follows

| Item | Why it is not an agent call |
|---|---|
| 35 GB `dots-report-resolution-20261009` and the 49 GB parent | deleting evidence of past audits |
| TypeScript 7 bumps (10 PRs) | blocked upstream; holding or forcing is a policy call |
| pake-gate #43 `globals` 13→17 | would need a pinned lint baseline rewritten |
| Dependabot alerts disabled on 24 crypto-lab repos | repository security settings |
| Code scanning with no analysis on 243 crypto-lab repos | whether to enable at all |
| Fleet Console snapshot refresh and its disabled schedule | console settings, not in this repo |
| The 64-PR "harden/retire/repair" campaign | each is a claim change needing review |

---

## The owner-decision list, as yes/no questions

1. Delete `~/repos/.fleet-maintenance-20261009/dots-report-resolution-20261009` (35 GB)? It holds 54 `node_modules` trees and 2 git clones from 2026-10-09 to 10-12 reproductions.
2. Delete the whole `~/repos/.fleet-maintenance-20261009` (49 GB), keeping only its JSON evidence files?
3. Hold **all ten** TypeScript 7 bumps until upstream peers allow it? (Both tested variants fail `npm ci`.)
4. Close pake-gate #43 (`globals` 13→17) rather than rewrite its pinned lint baseline?
5. Enable Dependabot alerts on the 24 crypto-lab repos that have them off, including Confirmer Signatures and Subliminal Channels?
6. Enable code scanning analysis on the 243 crypto-lab repos that have none, or accept that as intended?
7. Re-enable the Fleet Console's daily 02:00 snapshot refresh?
8. Should the 64 owner lab PRs be merged as a campaign, or closed and re-derived against today's mains?
9. Discard the uncommitted `docs/encyclopedia-roadmap.md` edit in `../crypto-lab-ad15-hub`? It describes A-D-15 as "In progress" and would regress main.
10. Close hub #243 in favour of #340, which states it supersedes it?

---

## B1 — Hub pull requests

Nine open, all owner-authored. Measured 2026-10-28 against main `241a414`.

| PR | State | Files | Changes | What it does | Recommendation |
|---|---|---|---|---|---|
| #243 | MERGEABLE/UNSTABLE | 2 | +1439/−286, 62 commits | `changestorepors.md`, `futureworkoct.md` refresh | **Close** — #340 says it supersedes it, and its head is 99 commits behind the local branch |
| #244 | CONFLICTING/DIRTY | 3 | +331/−575 | `index.html`, `knowledge-map/catalog.json`, `tools/lab-dates.json` | **Refresh** — all three are generated; today's main regenerated them |
| #245 | MERGEABLE/CLEAN | 5 | +1098/−682, 7 commits | catalog review re-pins | **Refresh** — partly superseded; of its three old pins only `9e4c2655…` (collision-vault) is still on main, and none of its new pins is applied |
| #246 | CONFLICTING/DIRTY | 11 | +370/−235 | teach module JSON + generated teach pages | **Refresh** |
| #247 | CONFLICTING/DIRTY | 3 | +255/−88 | `catalog-evidence.js`, `catalog-sync.js`, chip-relations test | **Refresh carefully** — touches the two files Part A and `cab71cb` changed |
| #248 | CONFLICTING/DIRTY | 5 | +160/−87 | Cryptanalyst path split, README, index.html | **Refresh** |
| #249 | MERGEABLE/CLEAN | 2 | +4/−0 | `Reads:`/purpose headers for the two knowledge-map tools | **Merge** — not on main (verified by grep); smallest open item |
| #251 | CONFLICTING/DIRTY | 1 | +17/−13 | `docs/encyclopedia-roadmap.md` HIBE milestone | **Refresh** — the roadmap moved a lot today |
| #340 | MERGEABLE/CLEAN | 1 | +245/−283 | `futureworkoct.md` handoff refresh | **Refresh then merge** — written before today's four commits, so its numbers are already stale |

Evidence: `gh pr view <n> --repo systemslibrarian/crypto-lab --json mergeable,mergeStateStatus,changedFiles`.

---

## B2 — Lab pull requests

**418 open org-wide: 345 Dependabot, 73 owner-authored** (9 hub + 64 lab).
Evidence: `gh api search/issues -f q='org:systemslibrarian is:pr is:open'` → `total_count`.

### The 64 owner-authored lab PRs

Not a backlog of unrelated work. **59 of 64 were opened 2026-10-22 or 10-23** — one stalled
security-review campaign. Titles cluster: 21 "Harden", 7 "Retire", 7 "Repair", 5 "Pin",
3 "Fix", 2 "Restore", 2 "Fail closed", 2 "Cross-check", 2 "test: locate npm CLI portably",
2 "docs: record DAYBREAK audit authorization".

| Status | Count | Notes |
|---|---|---|
| Mergeable, clean | 58 | CI green on the three sampled (otp-vault #26, ring-sign #24, webauthn #25); `deploy` and `dependabot-auto-merge` correctly skipped on PRs |
| Conflicting | 5 | PQ Rotation #24, Matsui Line #25, AES Anatomy #2, Clock Arithmetic #2, TruePad #51 |
| Superseded by main | at least 2 | the two "test: locate npm CLI portably" PRs (Time Lock Puzzle #24, Timing Oracle #31) are the same fix already merged into Envelope KMS, LLL Break and MAC Race today |

**Evidence unreconciled** is the whole campaign's character: these PRs change displayed
claims and recorded evidence, so none is an agent-only merge. Each needs the same
treatment the audit-fix round got.

### The seven you named

| Lab | PR | Author | State | Note |
|---|---|---|---|---|
| PQ Rotation | #24 | owner | CONFLICTING, 10 files | "Fail closed across PQ rotation boundaries" |
| Search Vault | #23 | **Dependabot** | CONFLICTING, 6 files | conflicts because **today's #29 merge moved its lockfile** |
| Shamir Gate | #17 | **Dependabot** | CONFLICTING, 7 files | same cause: today's #19 merge |
| Scloud Vault | #21 | **Dependabot** | MERGEABLE/CLEAN, 5 files | ordinary group bump |
| Shor | #21 | **Dependabot** | MERGEABLE/CLEAN, 11 files | ordinary group bump |
| Shelf Oracle | #13 | owner | MERGEABLE/CLEAN, 3 files | "Cross-check Shelf Oracle ChaCha20 independently" |
| Matsui Line | #25 | owner | CONFLICTING, 26 files | conflicts with today's merged #28 |

**Correction to the brief:** four of the seven (Search Vault #23, Shamir Gate #17, Scloud
Vault #21, Shor #21) are Dependabot, not owner-authored. Two of those four conflict as a
direct consequence of today's merges, so a Dependabot rebase clears them.

---

## B3 — Dependabot

**345 open.** 214 are `npm-minor-and-patch` group bumps, the auto-merge-eligible shape.
**131 are outside that group** and held for a human; most are .NET/NuGet and GitHub Actions
majors on non-crypto-lab repos.

### The TypeScript decision — one decision, ten PRs, and it fails today

| Lab | PR | Bump |
|---|---|---|
| rank-metric | #2 | 6.0.3 → 7.0.2 |
| hostile-paths | #3 | 6.0.3 → 7.0.2 |
| distance-bounding | #2 | 6.0.3 → 7.0.2 |
| ipsec-ike | #2 | 6.0.3 → 7.0.2 |
| dc-net | #2 | 6.0.3 → 7.0.2 |
| dedup-vault | #2 | 6.0.3 → 7.0.2 |
| air-stream | #7 | 5.9.3 → 7.0.2 |
| sm9-forge | #7 | 5.9.3 → 7.0.2 |
| tc26-pair | #8 | 5.9.3 → 7.0.2 |
| truepad-radio-lab | #6 | 5.9.3 → 7.0.2 |

**Tried on scratch clones, not pushed. Both representative variants fail at `npm ci`,
before any build or test could run:**

- `crypto-lab-sm9-forge` #7 (`453004a`): `ERESOLVE` — `@li0ard/sm3@0.1.1` declares
  `peer typescript@"^5"`. Conflicting peer dependency `typescript@5.9.3`.
- `crypto-lab-dedup-vault` #2 (`81c2cd3`): `ERESOLVE` — `typescript-eslint@8.72.0` declares
  `peer typescript@">=4.8.4 <6.1.0"`. Found `typescript@7.0.2`.

**Recommendation: hold all ten.** The blocker is upstream peer ranges, not this fleet.
They clear when `typescript-eslint` supports TS 7 and `@li0ard/sm3` widens its range.
Forcing with `--legacy-peer-deps` would be an unreviewed dependency resolution.

### pake-gate #43, `globals` 13.24.0 → 17.13.0

Tried on a scratch clone at `1a4e5ac`, not pushed.

| Step | Result |
|---|---|
| `npm ci` | **pass** |
| `npm run build` | **pass** (`tsc && vite build`, built in 372 ms) |
| `npm run lint` | **FAIL** |

The failure is `tests/lint-config.node.mjs`, test *"the effective global names and
writability remain identical in every prior scope"*: an `assert.deepStrictEqual` over the
full global-name set. `globals` 17 adds and removes names, so the pinned baseline no longer
matches. Five sibling assertions in that file still pass.

**This is the test doing its job** — it exists to catch a lint-config change arriving as a
dependency bump. Merging needs the baseline deliberately re-pinned, which is a review, not
a rebase. **Recommendation: Paul's call** (question 4).

---

## B4 — Security review queue

**The Fleet Console could not be read.** It is an external work store with no interface
from this machine; `tools/` has only `fleet-check.js` and `fleet-sync.js`, neither of which
reads it. The queue figures in `futureworkoct.md` (1,204 total; 131 active: 98 queued,
27 working, 6 blocked) are therefore **carried, not confirmed**, and are now five days old.

The only local artefacts are `~/repos/.fleet-maintenance-20261009/*snapshot*.json`, which
are **older still**: `meta.hubSha` `ba295530`, `retrievedAt` 2026-10-09T08:04Z, **228 labs**.

What *is* directly measurable was measured today across all 327 org repos
(`gh api repos/{owner}/{repo}/vulnerability-alerts` and `/code-scanning/analyses`):

| Measure | Org-wide | crypto-lab-* only (253) |
|---|---|---|
| Dependabot alerts enabled | 233 | 229 |
| Dependabot alerts **disabled** | 94 | **24** |
| Code scanning with analyses | 24 | 10 |
| Code scanning **"no analysis found"** | 303 | **243** |

### Blocked items and the exact action that unblocks each

| Blocked item | Measured state today | Owner action |
|---|---|---|
| Confirmer Signatures | `vulnerability-alerts` → **HTTP 404 (disabled)** | Enable Dependabot alerts in repo settings |
| Subliminal Channels | `vulnerability-alerts` → **HTTP 404 (disabled)** | Enable Dependabot alerts in repo settings |
| Time Trust | `vulnerability-alerts` → **HTTP 204 (enabled)** | **Appears already unblocked** — re-run its review |
| LLL Break | `vulnerability-alerts` → **HTTP 204 (enabled)** | **Appears already unblocked** — re-run its review |
| Dot's all-lab reading report | cross-repository, not derivable here | Owner |
| Counsel primary API TLS route | cross-repository, not derivable here | Owner |

The other 22 crypto-lab repos with alerts disabled are listed in the appendix; two of them
(Confirmer Signatures, Subliminal Channels) are the named blockers, and the rest will block
the same way when their review comes up.

---

## B5 — Fleet snapshot

| | Value |
|---|---|
| Cards on hub main `241a414` | **252** (`grep -c 'class="project-card' index.html`) |
| Hero figure | 251, correct: one `learning-game` card is excluded by the page's own JS |
| Saved local snapshot | **228 labs**, hub `ba295530`, retrieved 2026-10-09T08:04Z |
| Console snapshot per the stale queue | 232 labs at hub `b1b9876`, 2026-10-19 — **not confirmable from here** |
| Daily 02:00 refresh | **Could not be verified.** It is a console setting; nothing in this repository records or controls it |

The catalog is therefore **at least 20 labs ahead** of the newest snapshot figure anyone has
recorded, and 24 ahead of the newest one actually readable here.

---

## B6 — Cleanup

| Item | Measured | Safe to remove? | What would be lost |
|---|---|---|---|
| `~/repos/.fleet-maintenance-20261009` | **49 GB** | Owner call | Audit evidence JSON plus many build trees |
| └ `dots-report-resolution-20261009` | **35 GB**, 54 `node_modules`, 2 git clones | **Yes, with consent** | Reproduction environments from 2026-10-09 to 10-12; largest children are `iron-argon2-linux-reproduction` 5.7 GB, `certificate-integration` 3.7 GB, `agent-depth-audit` 3.5 GB |
| └ `fleet-console-integration` | 2.2 GB | Owner call | Console integration working data |
| └ `console-research-repos` | 840 MB | Owner call | Holds 5 counsel worktrees |
| Counsel worktrees | **13 registered** | Partly | 9 of 13 live under `.fleet-maintenance-20261009`; `crypto-counsel-ad15` and `crypto-counsel-lr12` are 1.4 MB each and look finished |
| Prunable worktree registrations | **2** (`/private/tmp/catalog-evidence-current.64nVx9`, `/private/tmp/lr04-hub-validate.eS15cU`) | **Yes** | Nothing — the directories are already gone; `git worktree prune` clears the records |
| `_ad15-anamorphic-audit` | 228 KB | **Yes** | A copy of the anamorphic lab used for the A-D-15 audit, which is complete and published |
| `../crypto-lab-ad15-hub` uncommitted roadmap edit | `docs/encyclopedia-roadmap.md`, +10/−5, on `codex/ad15-roadmap-20261027` | **Yes — and it should go** | It sets "Planned 1 / In progress 1" and describes A-D-15 as *In progress*. Main says 48 Live / 0 Planned. Applying it would **regress** the roadmap |
| `~/branch-cleanup-2026-10-21.txt` | 4,614 bytes, 2026-10-21 | **Yes** | A one-off branch list, seven days old |
| ad15/lr12 worktrees | `crypto-lab-ad15-hub` 21 MB, `-integration` 47 MB, `-publication` 21 MB, `crypto-lab-lr12-hub` 47 MB | Likely | Their work is merged; `crypto-lab-lr12-hub` holds the `main` branch ref, so detach or remove it before reusing that branch |

Total immediately reclaimable without losing anything unique: **~35 GB** (question 1),
rising to ~49 GB if the whole maintenance directory goes (question 2).

---

## B7 — Hub checkers

All 13 pass on main `241a414`, one pass, 2026-10-28:

```
readme-sync            exit=0 | README tables in sync with index.html cards (252 cards)
corpus-sync            exit=0 | Stale in corpus (0): []
concept-sync           exit=0 | concept-coverage.md in step with index.html.
catalog-sync           exit=0 | CATALOG.md in step with index.html (252 labs).
tools-sync             exit=0 | README.md tools block in step with tools/ (42 tools listed).
theme-sync             exit=0 | Every lab pins one theme, and none ships a toggle.
gate-sync              exit=0 | 0 carded labs were not opened at all.
dispatch-sync          exit=0 | paragraph is still true of the fleet it is written into.
port-sync              exit=0 | Every lab has its own port, pinned, with --strictPort.
lab-dates              exit=0 | Every card's dates match the repository they describe.
games-sync             exit=0 | CSP forbids, bridges back into the catalog, and pins one theme.
teach-build            exit=0 | Teach pages in sync: 5 module(s), 44 generated file(s).
knowledge-map-sync     exit=0 | PASS (252 exhibits, 40 concepts, 9 paths, 5 modules).
```

Beyond the 13: `catalog-evidence verify` resolves 1,637 anchors with no stale review,
`catalog-exhibits verify` clean, `catalog-evidence selftest` 97/97,
`evidence-shape-proof` 92/92, `catalog-recall check` met, catalog and card tests 140/140.

---

## Recommended order — four batches

**Batch 1 — free space and tidy, after answering questions 1, 2 and 9 (effort S).**
`git worktree prune` in hub and counsel; delete `_ad15-anamorphic-audit`,
`~/branch-cleanup-2026-10-21.txt`, and the stale ad15 roadmap edit; then the 35 GB
directory if approved. No repository state changes.

**Batch 2 — Dependabot, one sweep (effort M).** Rebase the group bumps that today's merges
made conflict (Search Vault #23, Shamir Gate #17 at least) with `@dependabot rebase`, then
let the 214 `npm-minor-and-patch` PRs auto-merge. Hold the 10 TypeScript PRs and pake-gate
#43 pending questions 3 and 4. Expect the count to fall from 345 to roughly 120.

**Batch 3 — hub PRs, smallest first (effort M).** Merge #249. Decide #243 against #340
(question 10) and refresh the survivor. Then rebase #244, #245, #246, #248 and #251 onto
main and re-derive their generated files rather than merging the old output. Treat #247
last and most carefully: it touches `catalog-evidence.js` and `catalog-sync.js`, which both
`cab71cb` and Part A changed.

**Batch 4 — the 64-PR lab campaign (effort L, needs question 8 first).** If they are to
land, do them exactly as the audit-fix round was done: one repo at a time, gate watched to
completion, deploy green, live bytes verified, then the hub re-pinned once at the end. The
5 conflicting ones (PQ Rotation #24, Matsui Line #25, AES Anatomy #2, Clock Arithmetic #2,
TruePad #51) need a rebase first, and the 2 superseded npm-CLI PRs should simply close.

---

## Appendix — the 24 crypto-lab repos with Dependabot alerts disabled

`aes-anatomy`, `ake-ladder`, `anamorphic`, `clock-arithmetic`, `compression-leak`,
`confirmer-signatures`, `dc-net`, `dedup-vault`, `distance-bounding`, `dvd-scramble`,
`hash-hunt`, `hostile-paths`, `ipsec-ike`, `key-lifecycle`, `lattice-ibe`, `log-forge`,
`next-number`, `prime-witness`, `rank-metric`, `residue-gate`, `saml-binding`,
`subliminal-channels`, `tesla-broadcast`, `twist-trap`.

Several are labs delivered in the last two weeks, so this is a gap that grows with each
new repository rather than a fixed backlog.
