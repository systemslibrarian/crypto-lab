# Crypto Lab fix prompt (19 Nov 2026) — Fix status

Maintained by the session finishing the prompt. Commit hashes are the commit that
landed each fix on the repo's `main` (all pushed unless noted).

## Totals

| Group | Items | Done | Follow-up | Owner/deferred |
|---|---:|---:|---:|---:|
| Text corrections (A1–A7) | 7 | 7 | 0 | 0 |
| Leftovers (B1–B4) | 4 | 4 | 0 | 0 |
| New exhibits (D1–D5) | 5 | 5 shipped | D1–D4 open; D5 fixed | 0 |
| Part C (6 sub-items) | 6 | 4 + 1 n/a | 0 | 1 |

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
| pq-families Lamport note | DONE (Phase 2) · crypto-lab `75a2061` — pin advanced to 77e32c23, false sentence corrected vs FIPS 205; see Phase 2 below |

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

Commit: crypto-lab `75a2061` (this commit).
