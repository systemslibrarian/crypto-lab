# Future work — October 2026

A working list, so items can be picked by number. **Items are REMOVED as they
complete**; the ledger at the end is one line each, pointing at where the detail
lives. Every figure here was re-measured on the date beside it — if a count
disagrees with its command, the command is right and the line is stale.

---

## Where this left off — 2026-10-21

`crypto-lab` main was caught up to **`1e6f181`** before this queue-only branch;
`crypto-counsel` main is **`cc2979b`**. Completed work is open, not merged:
crypto-counsel **#18** for the stale corpus and **#19**, stacked on #18, for
snapshot characters; crypto-lab **#244** for card dates and generated metadata;
crypto-lab **#245**, stacked on #244, for catalog evidence; and the AES Anatomy
and Clock Arithmetic **#2** PRs for theme pins. The five current depth rows are
also complete in Harvest Vault **#21**, Hybrid Wire **#17**, Shelf Oracle **#13**,
Compression Leak **#6** and WebAuthn **#25**. This queue audit itself is crypto-lab
**#243**.

Fresh `origin/main` remains red until those PRs merge, but the failures formerly
listed as items 10–12 are implemented and verified on their branches. The
remaining executable queue begins with the teach-layer claims.

**Two things still wait on a maintainer DECISION** — items 6 and 7. Item 6 now
needs its proposal refreshed before the old 20-step choice can be acted on.

**Pick up with:** item 4 (teach layer), the largest executable work item.

Before touching anything, re-fetch and re-run the fast loop — the figures below
were measured on the dates beside them and other sessions work in these repos:

```
git -C . fetch origin && git -C ../crypto-counsel fetch origin
for c in readme-sync corpus-sync concept-sync catalog-sync tools-sync \
         theme-sync gate-sync dispatch-sync port-sync lab-dates \
         games-sync teach-build knowledge-map-sync; do
  printf '%-22s ' "$c"; node "tools/$c.js" check >/dev/null 2>&1 && echo PASS || echo FAIL
done
```

(Quote `"tools/$c.js"` and pass `check` as its own argument. zsh does not
word-split an unquoted `$c`, so `node tools/$c` with `c="x.js check"` looks for a
file literally named `x.js check` and every checker reports MODULE_NOT_FOUND.)

---

## 4. Teach layer — 43 unchecked claims

Each needs a needle taken from the live page and VERIFIED before it can become an
automated probe, because an unverified needle reports a false failure. The report
names a cadence per item. Judgement per item, not a sweep.

Current result (2026-10-21): **43 UNCHECKED and 4 UNREADABLE**. The four are three
AES Modes observations and one Nonce Collision observation. Reinstalling all
three Playwright browsers did not clear them in this execution environment: a
direct launch smoke test found Chromium's macOS Mach-port bootstrap failing with
error 141, Firefox exiting by `SIGABRT`, and WebKit aborting. That is an
environment-readability failure, not evidence that the four page claims moved.
Re-run in a normal terminal before changing those records.

Check: `node tools/teach-issues.js`

---

## 5. Chip rule — advisory, and staying advisory for now

The 23 findings are dispositioned in `audits/CHIP-DISPOSITION-2026-10-20.md`.
The maintainer's decisions of 2026-10-21 are implemented in
`tools/catalog-sync.js`: four new qualifier words scoped to the chip they appear
in, a declared `ENTAILS` table keyed on anchored implementations, one declared
`QUALIFYING_SIBLINGS` pair, and the executed-stack rule requiring a verified call
site rather than a dependency listing.

Re-derived 2026-10-21: **0 violations**, 26 names cleared by the rule, 11 by a
declared relation, and 33 explicitly `Cannot judge`. **Remaining before anyone
proposes enabling the gate:** finish validating the rules, and keep the
distinction between implementing and discussing. The gate decision is the
maintainer's.

Check: `node tools/catalog-sync.js chips`

---

## 6. DECISION: refresh the path proposal, then split or retain it

**Waiting on the maintainer; no split is implemented.** The merged proposal in
`audits/CRYPTANALYST-PATH-SPLIT-PROPOSAL-2026-10-21.md` is now a useful design
note but no longer a current implementation plan.

Re-derived from `LEARNING_PATHS` on 2026-10-21: Cryptanalyst is **21 steps**, not
20, because AES Anatomy is now in the path. There are **nine** paths, not eight,
and Developer is now 18 steps. The proposal's claims that its 11+9 split covers
every step and that Cryptanalyst is the only path past 17 are therefore false on
current main. Current lengths are 13, 12, 12, 11, 18, 21, 12, 12 and 9.
Those counts were rechecked at `1e6f181` after both textbook-alignment commits;
the commits changed reading-guide content, not the nine path memberships.

Three choices remain, but use the current list:

1. **Leave Cryptanalyst at 21.** Delete this item, and separately decide whether
   Developer at 18 needs the same exception.
2. **Two paths.** Refresh the old 11+9 proposal by placing AES Anatomy; placing
   it with Structure and Statistics would make the natural split 12+9.
3. **Three paths.** The proposal's composition seed remains Salamander, Frozen
   Heart and Padding Oracle, matching `concept-coverage.md` §29.

If 2 or 3 is chosen, re-verify that every current step appears exactly once.
**The writer-order trap remains:** `knowledge-map-sync write` records the path
count and hashes `index.html`, so it must run after any card stamper.

---

## 7. DECISION: two drifted Related Projects lines in the corpus snapshot

**Offered during #17 and deliberately left out of it**, because the instruction
was to add Snow 2 "in the same form as the other three" — so all three were left
untouched. Two of them have since been shown to differ from the catalog README:
the comparison below was re-run against current files on 2026-10-21 and is still
exact.

| | snapshot | catalog README |
|---|---|---|
| Cipher Museum | `Interactive museum spanning ... history — thirteen halls` | `An interactive museum spanning ... history. Thirteen halls` |
| Meow Decoder | ends at `via QR-code GIFs.` | plus `AES-256-GCM + Argon2id + ML-KEM-1024 + fountain codes. Python + Rust.` |

Both are wording, neither is a link. Small, and a one-line re-derivation each
from the README's Related Projects block.

**The third line, Crypto Compare, is NOT a defect — do not "fix" it.** The
snapshot's `https://crypto-compare.systemslibrarian.dev/` is that project's own
live address: its repository's `CNAME` contains exactly that host and its README
links it. An earlier read of mine called it dead by applying the rule about
`crypto-lab.systemslibrarian.dev/<slug>/` 404ing, which is a DIFFERENT host
serving the catalog page. The conflation is the thing worth remembering.

If anything the discrepancy runs the other way: **the catalog README uses the
github.io form for a project that has its own domain.** That is a question about
`README.md` here, not about the snapshot, and nobody has decided it. Changing it
would also move the generated All Demos table's sibling block, so check what
`readme-sync` writes before assuming it is a one-line edit.

---

## 8. The nine detached worktrees under `~/repos/.fleet-maintenance-20261009/`

**Left alone on 2026-10-21 by instruction. Listed here so the state is not
rediscovered as a surprise.**

All nine are `crypto-counsel` worktrees on DETACHED HEADs, and all nine were
clean (no uncommitted paths) when checked. Their commits — `0d032ee`, `051a93c`,
`2186e49` (x2), `4de0cfe`, `7631877`, `a6b1036`, `08dade2` (x2) — are now all
ancestors of current counsel `main`. The earlier claim that only the worktrees
kept them reachable is stale.

Removing these worktrees therefore no longer risks losing unique commits, but it
still deletes nine checkout directories. Do it only as an explicit cleanup task.

```
git -C ../crypto-counsel worktree list
```

---

## 9. Branch-cleanup restore window

`~/branch-cleanup-2026-10-21.txt` holds 34 rows: 30 deleted remote branches
(26 crypto-lab from PRs #192-#240, 4 crypto-counsel from #14-#17) and 4 deleted
local branches, each with its full tip SHA, PR number and the PR's merged head
SHA. Every row restores with:

```
git push origin <sha>:refs/heads/<branch>
```

or the "Restore branch" button on that PR. 20 stale remote-tracking refs were
pruned in crypto-lab, 0 in crypto-counsel.

**Delete that file once you are satisfied nothing is missing.** It is the only
record outside GitHub's own reflog, and keeping it indefinitely makes it look
like a live list rather than a receipt.

GitHub's repository settings were re-read on 2026-10-21: "Automatically delete
head branches" is **ON for `crypto-lab` and OFF for `crypto-counsel`**. The old
claim that both were on is stale. Decide whether to re-enable it for counsel;
until then, counsel branches such as #18's will need deliberate cleanup after
merge.

---

## Done — one line each

| item | where the detail is |
|---|---|
| #31, 13 of 18 rows | the lab PRs; three real conformance bugs (both TLS labs' RFC 5869 absent salt, `lms-xmss`' RFC 8554 HSS) |
| 4a chip disposition | `audits/CHIP-DISPOSITION-2026-10-20.md` |
| 4d unmarked title | "Mental Poker, Simplified: Shuffle Showdown" |
| 4e game CSPs | all 11 pages under the gate; `merkle-mystery` needed a real fix — CSSOM positioning, not `unsafe-inline` |
| 5a gate.ts copy count | 83 of 184, re-derived; CLAUDE.md |
| 5b legacy toggles | warning had gone SILENT; 46 build one, 36 confirmed wired; CLAUDE.md |
| 6 protection-census | scheduled; `FLEET_READ_TOKEN` set, census PASSED in CI in 33s |
| 7 write half of #125 | one `stampTag()`; `tests/card-stamp.test.cjs` fails 2 of 6 against the old writers |
| Trivium, Davies-Meyer | both were absent from the vocabulary; `lfsr-forge`'s N/A was false |
| five uncarded labs + four missing corpus entries | #239 and crypto-counsel #16; `fleet-sync` and `corpus-sync` both clean |
| cryptanalyst path proposal at its then-current 20 steps | PROPOSAL ONLY in crypto-lab #240, `audits/CRYPTANALYST-PATH-SPLIT-PROPOSAL-2026-10-21.md`; current 21-step refresh is item 6 |
| eleven stale `crypto_lab_readme` lines | crypto-counsel #17; Snow 2 was a MOVE to Related Projects, and `validate.mjs` was widened with M25-M27 as its controls |
| corpus prose stale review | crypto-counsel #18; 28 re-derived rather than the noted 20: 16 accurate, 12 corrected, 0 unsettled; 190 never-reviewed entries left untouched |
| nine snapshot character lines | crypto-counsel #19, stacked on #18; rendered cards plus the catalog README are canonical, and only the nine HTML/numeric entity spellings changed |
| #31 final five depth judgements | Harvest Vault #21 and Compression Leak #6 pin published vectors through production helpers; Hybrid Wire #17 and Shelf Oracle #13 add outside-library cross-checks; WebAuthn #25 pins its production SHA-256 helper to NIST CAVP. All five implementations were correct but incompletely verified; every mutation control failed as intended |
| generated knowledge map and card dates | crypto-lab #244; 243 repositories refreshed, 34 date-evidence records moved and six displayed months changed; knowledge map, catalog/date/level/readme/concept checks and six card-stamp tests pass |
| AES Anatomy and Clock Arithmetic theme pins | each lab's #2; literal dark pin corrected, unit/build checks pass, and fleet theme-sync reports 255 pages with no violations; browser-owned mutation baselines remain unreadable here because Chromium exits with macOS bootstrap error 141 |
| catalog evidence refresh | crypto-lab #245, stacked on #244; nine stale reviews individually re-read, 18 stale anchors regenerated, copied-tool and scanner false positives excluded, 1,554 anchors resolve, and 75 tests pass with 0 failures/skips |
| branch cleanup, both repos | 30 remote + 4 local deleted, 20 tracking refs pruned; manifest `~/branch-cleanup-2026-10-21.txt`; auto-delete is now on only for `crypto-lab`. Decide from the PR, never `git branch --merged` — squash merges make almost every merged branch read as unmerged |
| futureworkoct queue update | #241 |
| futureworkoct current-state audit | this queue-only PR; caught main up through `1e6f181`, removed the completed corpus and depth items, and recorded the reproducible failures without fixing out-of-scope files |

**Finish a card-stamping pass with `node tools/level-sync.js`.** `data-level` sits
where the writer that ran last put it; running it last took a real repin's diff
from 704 lines to 10.

## Settled — do not re-file these

- **`key-rush`'s "checked by recombining the actual share values" is TRUE.**
  `core.mjs:59` Lagrange-interpolates and `:60` throws `Reconstruction mismatch`.
- **`secret-council/vault.mjs:92`'s count is DERIVED**, from `result.possibilities`.
- **The games being outside the derived catalog views** is deliberate: they get
  `games-sync`, not cards and not an exemption.
- **`quantum-vault-kpqc`'s light theme**, **`blind-oracle-api`'s missing page**,
  and **`confirmer-signatures`' absent `dependabot.yml`** are load-bearing
  divergences. A sweep that flattens one is a regression.
