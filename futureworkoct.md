# Future work — October 2026

A working list, so items can be picked by number. **Items are REMOVED as they
complete**; the ledger at the end is one line each, pointing at where the detail
lives. Every figure here was re-measured on the date beside it — if a count
disagrees with its command, the command is right and the line is stale.

---

## Where this left off — 2026-10-22

`crypto-lab` main was caught up to **`1e6f181`** before this queue-only branch;
`crypto-counsel` main is **`cc2979b`**. Completed work is open, not merged:
crypto-counsel **#18** for the stale corpus and **#19**, stacked on #18, for the
catalog README snapshot; crypto-lab **#244** for card dates and generated metadata;
crypto-lab **#245**, stacked on #244, for catalog evidence; and the AES Anatomy
and Clock Arithmetic **#2** PRs for theme pins. The five current depth rows are
also complete in Harvest Vault **#21**, Hybrid Wire **#17**, Shelf Oracle **#13**,
Compression Leak **#6** and WebAuthn **#25**. This queue audit itself is crypto-lab
**#243**. Crypto-lab **#246** completes the teach probes, **#247** validates the
advisory chip rule end to end, and **#248** implements the selected 12+9
Cryptanalyst path split. Crypto-lab **#249** documents the two knowledge-map
tools, and Adaptor Gate **#8** fixes the current Vite advisory plus the Playwright
image and accessibility regression exposed while validating that upgrade.

Fresh `origin/main` remains red until those PRs merge, but the failures formerly
listed as items 10–12 are implemented and verified on their branches. The
executable work through item 5 is complete on open PRs.

The original content queue is complete on open PRs. The six stale date pins
visible on `main` are the six already corrected by #244, not a new queue item.
The separate Fleet Console audit below is now the active maintenance queue.
Items 8 and 9 remain cleanup/settings choices, not unfinished content work.

**Pick up with:** the per-lab Fleet Console dependency and security evidence
reviews below. Do not merge the open PRs; maintainer review is still required.

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

## Active Fleet Console maintenance — 2026-10-22

The private Fleet Console's latest saved source snapshot is still from
2026-10-19 at hub `b1b9876` and contains 232 labs; the current catalog has 243.
Its daily 02:00 America/New_York refresh is disabled. Do not publish a partial
snapshot or treat the saved completion time as current evidence.

After 19 individually evidenced closures, the work store has **1,175 total,
945 complete and 230 active** items: 226 queued, 1 working and 3 blocked. The
active work is:

- **197 security-evidence items.** Collision Vault is complete. Adaptor Gate is
  working on PR #8 and must stay open until the default branch and deployment
  carry the fix. Signature Gate is blocked because GitHub returns HTTP 403,
  "Dependabot alerts are disabled"; its exact npm lock has no registry advisory,
  but that does not replace provider evidence and its Python requirements are
  not a complete transitive lock.
- **31 dependency-change reviews.** Dead Sea Cipher and RSA Small Roots are
  complete after current-source reviews and current-main CI; review the
  remaining 31 one lab at a time.
- **2 external/coverage blockers.** Dot's all-lab reading report still requires
  the missing cited Library artifact or independent completion of the remaining
  bounded reviews. Counsel's primary API TLS route still requires the recorded
  Cloudflare certificate repair.

The current security census found 230 repositories whose Dependabot alert API
is readable, 15 where alerts are disabled, and 9 open alerts: three each in
Adaptor Gate, LLL Break and Time Trust. All nine name the Vite/launch-editor
family fixed in Vite 8.3.3. LLL Break and Time Trust already have Vite 8.3.4 on
current `main`, so their provider records need reconciliation rather than a
blind source downgrade. Adaptor Gate still had 8.3.2; PR #8 raises it to 8.3.4
and passes 127 unit plus 116 browser tests in the matching Playwright image.

Dependabot alerts are disabled in: AKE Ladder, AES Anatomy, Clock Arithmetic,
Confirmer Signatures, Compression Leak, DVD Scramble, Hash Hunt, Key Lifecycle,
Log Forge, Next Number, Prime Witness, Residue Gate, Subliminal Channels, TESLA
Broadcast and Twist Trap. Enabling those repository settings is an explicit
owner decision; do not silently report their missing alerts as zero.

Already closed from this snapshot: both knowledge-map tool metadata gaps (#249),
all three missing non-fixture tool runs, all five Signature Gate teaching-role
reviews, Collision Vault's four catalog cascades and security evidence, Signature
Gate's Python interpretation, Lattice Builder's comment-only interpretation,
and the two dependency reviews above. PR #245 now carries the corresponding
Collision Vault, Signature Gate, Attribute Gate, IBE Gate and Polynomial Forge
catalog evidence.

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
| catalog README snapshot refresh | crypto-counsel #19, stacked on #18; nine HTML/numeric entity spellings and the two drifted Cipher Museum/Meow Decoder descriptions now match rendered catalog prose. Crypto Compare's valid custom-domain URL was deliberately preserved |
| #31 final five depth judgements | Harvest Vault #21 and Compression Leak #6 pin published vectors through production helpers; Hybrid Wire #17 and Shelf Oracle #13 add outside-library cross-checks; WebAuthn #25 pins its production SHA-256 helper to NIST CAVP. All five implementations were correct but incompletely verified; every mutation control failed as intended |
| generated knowledge map and card dates | crypto-lab #244; 243 repositories refreshed, 34 date-evidence records moved and six displayed months changed; knowledge map, catalog/date/level/readme/concept checks and six card-stamp tests pass |
| AES Anatomy and Clock Arithmetic theme pins | each lab's #2; literal dark pin corrected, unit/build checks pass, and fleet theme-sync reports 255 pages with no violations; browser-owned mutation baselines remain unreadable here because Chromium exits with macOS bootstrap error 141 |
| catalog evidence refresh | crypto-lab #245, stacked on #244; nine stale reviews individually re-read, then Harvest Vault and Shelf Oracle rechecked after four more anchors moved (22 stale source-anchor claims total). Collision Vault was re-pinned after full committed-source validation. Attribute Gate, IBE Gate and Polynomial Forge lost false BLS-signature credits; five Signature Gate teaching distinctions were recorded; Signature Gate's five Python files were manually classified while retaining the honest scanner-coverage warning. Shelf Oracle's cited-but-unreproduced IND-CPA-D research is excluded from attack credit |
| teach-layer unchecked claims | crypto-lab #246; all 43 manual claims individually reviewed and converted, leaving 47 automated and 0 manual probes; the full Linux Chromium/Firefox/WebKit run reports 47 MATCHES, 0 GONE and 0 UNREADABLE |
| advisory chip-rule validation | crypto-lab #247; the production classifier, all four declared relations, five qualifier words, uncertainty ordering and the scanner's comment/string boundary now have positive and mutation controls; live output remains 0 violations and the gate remains advisory |
| Cryptanalyst path split | crypto-lab #248; the former 21-step path is now exact-cover 12+9 Structure and Statistics / Implementation and Composition paths, with the original id retained, ten generated paths and browser plus persistent-state regressions passing |
| knowledge-map tool metadata | crypto-lab #249; both runnable tools now state their source-supported purpose and the collector reports 41 registered tools with 0 documentation gaps |
| Fleet Console first repair pass | 19 findings closed with item-level evidence: 2 tool metadata, 3 real tool runs, 5 Signature Gate relationships, 5 Collision Vault findings, 2 interpretation findings and 2 dependency reviews. Adaptor Gate security remains working on #8 rather than falsely complete before merge |
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
