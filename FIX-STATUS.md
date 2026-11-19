# Crypto Lab fix prompt (19 Nov 2026) — Fix status

Maintained by the session finishing the prompt. Commit hashes are the commit that
landed each fix on the repo's `main` (all pushed unless noted).

## Totals

| Group | Items | Done | Follow-up | Owner/deferred |
|---|---:|---:|---:|---:|
| Text corrections (A1–A7) | 7 | 7 | 0 | 0 |
| Leftovers (B1–B4) | 4 | 4 | 0 | 0 |
| New exhibits (D1–D5) | 5 | 5 shipped | all D1–D5 follow-ups done (Phase 3B) | 0 |
| Part C (6 sub-items) | 6 | 5 + 1 n/a | 0 | 0 (3A closed as errata) |

## Text corrections A1–A7 — 7/7 done (reviewer-confirmed correct)

| Item | Repo · commit |
|---|---|
| A1 padding leak | crypto-lab-sphinx-mix · `1701019` |
| A2 BIKE/ML-KEM rates | crypto-lab-bike-vault · `c764857` |
| A3 CKKS noise flooding | crypto-lab-ckks-lab · `a1b97d3` |
| A4 SPDZ α qualifier | crypto-lab-spdz-forge · `8daa7a3` |
| A5 VDF 2^64 soundness | crypto-lab-vdf · `1944493` |
| A6 J-UNIWARD symmetry | crypto-lab-j-uniward · `7306014` |
| A7 PAKE RFC/CPace §refs | crypto-lab-pake-gate · `ff955f6` |

## Leftovers B1–B4 — 4/4 done (reviewer-confirmed)

mpcith-sign `88b8074` · hawk `1fea3b3` · drbg-arena `24b2477` · split-point `821b178`

## New exhibits D1–D5 — 5/5 shipped; follow-ups per reviewer

| Item | Repo · commit | Follow-up |
|---|---|---|
| D1 sphinx-mix | `1701019` | Med: "partially" wording misreads the paper |
| D2 kem-trap | `2701478` | Med: act-5 PK-binding claim; no pinned vectors; two panels "6" |
| D3 spdz-forge | `8daa7a3` | Med: sequential-mode abort hard-coded |
| D4 rsa-forge | `4077494` | Med: npm test flaky/timeout; §3.1→§3.2 |
| D5 wep-crack | `9ffb0cb` then `72ddfe0` | FIXED (Phase 1): seed collision → false "certain" claim corrected; see Phase 1 below |

## Part C hub — 3 done, 1 already-correct, 2 open

| Sub-item | Status |
|---|---|
| Beacon Lock | DONE · crypto-lab `c2650e0` |
| dead-sea Hill | DONE · dead-sea-cipher `e7d269e` + crypto-lab `11c3316` |
| Polygon Miden | DONE · crypto-lab `11c3316` |
| Polygon zkEVM (CATALOG.md) | Already correct ("wound down in 2026"); no defect |
| BIKE "Round 4 alternate" + Polygon zkEVM (evidence.json/labs.csv) | OWNER-ONLY — frozen in the pinned Oct-11 private snapshot; labs already correct at source; needs re-capture + PIN bump + `public-evidence.cjs import` |
| pq-families Lamport note | DONE (Phase 2) · crypto-lab `ecbec19` — pin advanced to 77e32c23, false sentence corrected vs FIPS 205; see Phase 2 below |

---

## PHASE 1 — D5 wep-crack seed collision — CONFIRMED and FIXED

**Verified (step 1):** YES, the reviewer is right. The 16 sweep trials used
`seededKeySource(1000 + t)`, whose splitmix64 init `seed * GOLDEN + 1` shares the
`+ GOLDEN` increment that `next()` adds each step — so seed and seed+1 are exactly
one step apart and the 16 "trials" are ONE stream read at 16 offsets. Measured:
16 trials × 24 draws = 384 outputs, only **39 distinct**. Effective independent
trials: **~1.5 at 16 sessions, ~2.9 at 4 sessions** (not 16). This forged a 100%
("certain") recovery rate.

**Fix (step 2):** `seededKeySource` now hashes the seed through the splitmix64
finaliser before using it as state, so consecutive seeds land at uncorrelated
offsets. Re-measured: 512/512 outputs distinct; 48/48 distinct first-keys.

**Real rates with independent trials (step 3):** over 200 independent trials,
position 2 recovers 3% (64 sessions), 4.5% (256), 10% (512), **20% (1,024)**,
**72.5% (4,096)**, **100% (16,384)**. The old "recovers every time past ~1,000
sessions" claim is false — recovery is ~20% at 1,024 and only becomes reliable
around 16,000 sessions. The displayed sweep is now `[64,256,1024,4096,16384]` ×
30 trials, and the claim is DERIVED from the table (attaches "every time" to the
session count that actually measures 100%), so it cannot contradict the data.

**Tests (step 4):** added a unit independence guard in `broadcast.test.ts` (every
key-half across 16 seeded trials must be distinct — fails on the old init: 31 of
256) and rewrote the e2e sweep assertion to check monotone climb, no fixed
threshold, and that the displayed claim matches the table (the 1,024 %, and that
any "every time" session count is really 100%).

**Fleet sweep (step 5):** grepped every lab for the golden-ratio splitmix pattern.
| Lab | Uses golden const | Collides? |
|---|---|---|
| crypto-lab-wep-crack | `seed*G+1` init, consecutive trial seeds | **YES — fixed** |
| crypto-lab-schnorr-forge (test) | `(1000003*i+7)*G mod N` | No — distinct secret-key scalars, large spread, not a stream |
| crypto-lab-noisy-parity | `+G` step, consecutive seeds (`seed += 1`) | No — RAW-seed init, confirmed 384/384 distinct |
| crypto-lab-ciphertext-mirror | splitmix64→xoshiro256 seeding | No — standard mixed seeding |
| crypto-lab-factor-forge | hex seed folded through splitmix64 | No — string seed, mixed |
| crypto-lab-silent-tally (Rust) | single fixed seed = the constant | No — one deterministic stream |

**wep-crack is the only lab with the defect.** Commit: crypto-lab-wep-crack `72ddfe0` (pushed).

## PHASE 2 — pq-families Lamport re-pin — DONE

Pin advanced `c1161d06 → 77e32c23` (current `main`). Range reviewed by Claude (AI,
not human), recorded in the pin note.

**Step 1 — changed entries in the range (`data.ts`, 118 lines):**
- Falcon single-trace power analysis — Li/Ma/Dou/Guo "One Fell Swoop" (rev. 16 Nov 2026)
- Rainbow MinRank note reworded to Beullens "simple attack" (ePrint 2022/214, ~53h)
- NEW Li–Tao "Extending the Schur–Macaulay Framework" MAYO/UOV structural-estimate entry
- SQIsign → Round 3 of NIST additional-signatures on-ramp (NIST IR 8610, 14 May 2026)
- standardisation span corrected 2016–2024 → 2016–2025
- `src/ui.ts`: UI/rendering copy; `src/data.test.ts`: tests. `src/crypto.ts` BYTE-IDENTICAL.

**Step 2 — adjudication.** The scanner derives the SAME 12 attack names as before; NO
new name appeared. `data.ts` is typed comparison data (no executed attack), so:

| Derived name | Source at HEAD | Ruling |
|---|---|---|
| Birthday bound | data.ts (Wagner GBA history) | removed — prose, unchanged |
| Chosen-ciphertext attack | data.ts (Bos'18 Kyber title) | removed — prose, unchanged |
| Chosen-plaintext attack | data.ts (IND-CCA2 glossary) | removed — prose, unchanged |
| Differential cryptanalysis | data.ts (SFLASH'07 history) | removed — prose, unchanged |
| Discrete log | data.ts (Shor timeline) | removed — prose, unchanged |
| Factoring | data.ts (Shor timeline) | removed — prose, unchanged |
| Fault injection | data.ts (weaknesses bullet) | removed — prose, unchanged |
| Key recovery | data.ts (Falcon power-trace cite) | removed — prose, unchanged |
| Power analysis | data.ts (power-trace cites ×3) | removed — prose, unchanged |
| Side-channel (unspecified) | data.ts (weakness bullet) | removed — prose, unchanged |
| Timing side-channel | data.ts (HQC'23 fix history) | removed — prose, unchanged |
| **Lattice reduction** | **crypto.ts:359 (lagrangeGaussTrace, executed)** | **KEPT — code-verified, unchanged** |

The 14 comment-only reference removals still apply (crypto.ts unchanged; ui.ts is UI,
nothing moved from comment into an implementation). The card's derived `data-implements`,
`data-references` and `data-attacks` are **byte-identical** before/after — advancing the
pin changed no credit. The one credited attack (Lattice reduction) is verified in the
lab's own executed code, not from a paper; no paper claim is credited.

**Step 3 — note corrected.** The false reasoning "the file genuinely implements the leaf
primitive that SPHINCS+ is built from" (quoting a removed README line) is gone. Per
**FIPS 205 §3**, SLH-DSA builds its leaves from **WOTS+** and signs with **FORS** and
never names Lamport; the lab README and crypto.ts already say this. The SPHINCS+
comment-only removal stands on the corrected reasoning.

**Step 4 — `catalog-evidence write` processed pq-families (NOT skipped):** card
`data-review-commit` = `77e32c23`. catalog-sync / readme-sync / concept-sync in step.

**Nothing left ambiguous.** The pq-families `verify` line shows the benign `map < pin`
knowledge-map lag shared by 40+ untouched labs (anchors resolve, pin matches clone) — the
daily job clears it; not a new failure.

Commit: crypto-lab `ecbec19` (this commit).

---

# PHASE 3

## 3A — CLOSED as ERRATA (2026-11-19, baseline intentionally frozen)

Disposition per the owner: do NOT re-capture or re-pin the Oct-11 baseline.
`evidence/ERRATA.md` records the two known-stale frozen rows (BIKE "Round 4
alternate" → "Round 4 Candidate", per bike-vault `src/compare.ts` @ `c764857`;
Polygon zkEVM "production deployment" → historical, per snark-arena `README.md`
@ `eb97e339`) and supersedes them. Linked from `evidence/REVIEW.md` and
`evidence/README.md` (the file the explorer renders), and registered in the
`public-evidence.cjs` reviewed-file allowlist. **No pinned/hashed file changed**
(`PIN.sha256`, `PUBLIC_SHA256`, baseline totals untouched); `public-evidence.cjs
check` passes with identical totals; all hub checks green. Commit `93187e3`.

## 3B re-pins — DONE (2026-11-19)

The four 3B labs re-pinned to their post-fix commits, with a per-lab source review
(commit `e5abd41`):

| Lab | Pin → | Card data-* change |
|---|---|---|
| kem-trap | → `c1fc722` | SHA-3 now a real **implements** (kpke-encrypt.ts:46, G=SHA3-512); ML-KEM anchor → acvp-vectors.ts; FO transform / Key recovery / Timing side-channel stay removed by name |
| spdz-forge | → `19c2a1e` | none (D3 touches only rushing code; evidence unchanged, pin advanced) |
| sphinx-mix | unpinned | none (D1 prose-only; card derives from HEAD) |
| rsa-forge | unpinned | none (D4 prose/test-only; card derives from HEAD) |

Fleet-drift cards from catalog-evidence were reverted, not committed. catalog-sync,
readme-sync, concept-sync in step; kem-trap/spdz-forge anchors resolve (only the
benign knowledge-map "map < pin" lag remains, as for every re-pinned lab).

---

## (original 3A investigation, retained) — BLOCKED (owner/service)

Investigated per the steps; stopping at step 5 rather than forcing it.

**What I found (step 2):**
- **Import form:** `node tools/public-evidence.cjs import <abs-path>` — the snapshot path is a
  command-line argument (public-evidence.cjs:171-175), NOT an env var or stored config. There is
  no fixed path to read.
- **PIN:** `sha256 = be878bc9739e66d3407773dfb679b2bcc7485678a9bc1ed0f6d325e67d5645e2`,
  `captured_at = 2026-10-11T06:20:47Z`, `catalog_commit = 2dbd5ea`. Also `PUBLIC_SHA256 =
  5c2d3ed72dfe…` and hardcoded baseline totals `[228,175,80,221,7,7]` (public-evidence.cjs:29-30,149).
- **Stale rows:**
  - BIKE (`crypto-lab-bike-vault`): `"…side-by-side comparison against ML-KEM. NIST Round 4 alternate candidate."`
  - Polygon zkEVM (`crypto-lab-snark-arena`): `"…production deployments in Zcash, Polygon zkEVM, WorldID, and zkLogin."`
- Both labs are already correct at source (bike-vault says "Round 4 Candidate"; snark-arena README treats zkEVM as historical/wound-down).

**Why it is blocked (step 5):**
1. **No capture process in the repo.** The snapshot is produced by a PRIVATE console service with
   service credentials (evidence/REVIEW.md: built from "console and all lab repositories"; README:
   "retrieved as a saved object … not reconstructed from current repositories"). Neither the console
   nor its credentials is present in this cloud container.
2. **The snapshot file is on the Mac, not reachable.** This session is a Linux cloud container
   (`Linux vm`, home `/root`), not the Mac. The Mac is connected via Remote Control but its only
   shared folder (`MacBook-Air:repos`) is reported `not_available` to cloud sessions — using a folder
   from a cloud session is not available for this account/folder yet. The snapshot is not in the
   container (searched /home, /root, /tmp, /mnt).
3. **The import is triple-pinned to the frozen Oct-11 baseline.** Even with a new snapshot, import
   refuses any bytes that do not hash to `PIN.sha256` (line 175) and any projection that does not hash
   to `PUBLIC_SHA256` (line 177), and asserts the fixed baseline totals (line 149). A corrected capture
   would require updating all three constants — i.e. re-reviewing and re-pinning the public baseline,
   not a mechanical re-import.

**To do this, the owner runs, on the Mac where the private console/snapshot lives:** re-capture the
snapshot through the private console; `node tools/public-evidence.cjs import /abs/new-snapshot.json`;
then update `PIN.sha256`/`captured_at`/`catalog_commit`, `PUBLIC_SHA256`, and the baseline totals to the
new capture, and re-run `check`. Success = evidence.json/labs.csv show BIKE as a "Round 4 Candidate"
and Polygon zkEVM as historical, matching source, with no other unexpected row changes.

Commit: none (nothing changed — correctly not forced).

## 3B — reviewer follow-ups D1–D4

### D1 — sphinx-mix "partially" wording — DONE · crypto-lab-sphinx-mix `37b3cd5`
The act-7 disclosure claimed the paper's title says "(Partially)" because random
padding doesn't stop the marked-payload attack. Wrong: Sphinx answers payload tagging
separately (wide-block payload, act 5), and per the Kuhn/Beck/Strufe abstract
(arXiv:1910.13772) "(Partially)" means they re-prove the fix for ONE protocol of the
family ("showing our improved properties for one protocol, thus partially fixing the
family"). Primary source: the paper's own abstract. Corrected the text and added an e2e
guard asserting the real reason and forbidding the old misattribution.

### D2 — kem-trap three fixes — DONE · crypto-lab-kem-trap `c1fc722`
(a) **Public-key-binding claim fixed at source.** The K-PK note credited act 5's
confirmation MAC with binding the public key; it does not — `deriveSessionKey`/
`confirmationTag` (callers.ts) key on the shared secret over the ciphertext only, so
the two MAL-BIND-K-PK parties get identical tags. The fix is now SHOWN: `bindPublicKey`
= HKDF(ss, ek‖c), panel displays K0Bound ≠ K1Bound (ek0 ≠ ek1) though the raw secrets
collide (Schmieg 2024; Cremers/Dax/Medinger 2024). False "as in act 5" credit removed.
(b) **Official KAT added.** `src/kem/acvp-vectors.ts` — NIST ACVP ML-KEM-768 vector
(ML-KEM-encapDecap-FIPS203, vsId 42, tgId 2, tcId 26; source file sha256
`a556952c…`). Tests assert the reference AND the lab's own FO reconstruction reproduce
(c, k) exactly. Primary source: raw.githubusercontent.com/usnistgov/ACVP-Server.
(c) **Panel renumbered:** security-property matrix `6 ·` → `7 ·` (follows the new act 6);
no other cross-reference used the number. README: exhibit 6 added, test count 45/5 → 60/7.
Verified: 60 unit + 15 chromium e2e pass; the 3 new ACVP KAT tests confirm @noble and the
lab's reconstruction both match NIST's bytes.

### D3 — spdz-forge hard-coded abort in sequential mode — DONE · crypto-lab-spdz-forge `19c2a1e`
`runRushing`'s `sequential-leak-first` schedule hand-built the check-2 result as a
literal `{outcome:'abort', abortAt:'session'}` — not computed, and inaccurate (check 2
is never *scheduled* there; check 1 must complete, aborts, and ends the session). Now the
forge is derived from check 1's computed outcome: `leakingCheck` runs fully (aborts, and
α really leaks — `recoveredAlpha === dealer α`), so check 2 is `not-run` (new `notRunForge`)
and the UI reads "NOT RUN — check 1 aborted the session first". The rewritten test proves
the protection is the SCHEDULING not the algebra: it runs `forgingCheck` (now exported)
with the leaked α and shows it forges, releasing exactly y — only the sequential abort
stops it. 91 unit + 25 e2e pass.

### D4 — rsa-forge two fixes — DONE · crypto-lab-rsa-forge `b324d30`
(a) **Flaky tests fixed at the cause (not timeouts/retries/skips).** Two tests flaked on
unseeded randomness: the end-to-end toy attack generated a fresh random 512-bit RSA key
per message (×3), and generateRsaKeyPair occasionally spent >2s on an unlucky prime search
→ 5s timeout; and "a prime N̂ is forgeable" searched only byte 0 of a random 256-bit N,
where ~30-50% of the time no prime exists in 256 candidates. Both now use fixed precomputed
moduli (deterministic). **Ran the suite 20× in a row: 20/20 pass** (was ~6/20 failing).
(b) **§3.1 → §3.2.** The RSA-1024 success probabilities (0.00282 and the b=4/6/8/10 values)
are in Muir §3.2 ("The off-line search in practice"), not §3.1 ("Analysis"). Verified against
the paper; Figure 3's b=6=0.084 reference was already correct. Fixed seifert.ts,
seifert-panel.ts, extension-panels.ts, the unit tests, and the e2e guard (asserts §3.2,
forbids §3.1). The other §3.1 ref (attacks.ts, the Shea √eNFS paper) is a different paper, correct.

## After 3A/3B — hub regeneration check

As requested, re-ran the hub generators after the Phase 3 lab commits:
- `catalog-sync check`, `readme-sync check`, `concept-sync check` — all in step (OK).
- `catalog-evidence write` — **none of the 3B labs' cards changed.** kem-trap and
  spdz-forge are stale-pinned (their 3B commits moved HEAD past the catalog-reviewed
  pin), so `write` SKIPS them; sphinx-mix and rsa-forge cards were not regenerated
  either. The only cards `write` touches are the ~15 pre-existing fleet-drift labs
  unrelated to this work (the daily job's domain), which were reverted, not committed.
- **No intentional hub card data-* change arises from 3B.** The 3B fixes are lab-source
  and lab-test changes; the hub cards for those labs remain pinned to their pre-3B
  commits and will regenerate when those labs are next source-reviewed and re-pinned.

**Left open / unverified:**
- **3A** (BIKE "Round 4 alternate", Polygon zkEVM in evidence.json/labs.csv): owner/service
  only — no capture process in the repo (private console + credentials), the snapshot is on
  the Mac (folder `not_available` to cloud sessions), and the import is triple-hash-pinned to
  the frozen Oct-11 baseline. Steps for the owner recorded above.
- The hub cards for sphinx-mix/kem-trap/spdz-forge/rsa-forge now lag their labs by the 3B
  commits; re-pinning them (a source review per lab) is the normal follow-up, not forced here.
