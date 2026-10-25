# Paper review implementation checklist

Updated: 2026-10-25. This is the separate implementation queue from the Crypto Lab
Drive paper review. The [encyclopedia roadmap](encyclopedia-roadmap.md) remains the
living record for the encyclopedia workstream; its entries and ownership are not
changed by this checklist.

Before starting a repository, reread that roadmap, fetch current main, inspect open
pull requests, and reconcile existing coverage. A queued item does not reserve a
repository. Do not mark an item live until checks pass and served assets are verified.

| ID | Extension | Repository | Status |
| --- | --- | --- | --- |
| PR-01 | AEGIS two-key commitment collision and state trace | crypto-lab-aegis-gate | Live: PR #25, exact served assets verified |
| PR-02 | KZG final-challenge binding in a multi-point batch | crypto-lab-polynomial-forge | PR #12: local gate and mutations passed; hosted gate running |
| PR-03 | Explicit unintended witnesses and constraint repair | crypto-lab-snark-arena | Deferred: active maintenance PR #24 |
| PR-04 | FHE client reaction oracle with exact model boundaries | crypto-lab-ckks-lab | Queued; public-key/C2S prerequisites |
| PR-05 | Inconsistent MAC-key contexts and selective failure | crypto-lab-spdz-forge | Deferred: active maintenance PR #25 |
| PR-06 | Selective abort and retry effects on DP releases | crypto-lab-proof-tally | Coordinate with S04 owner before edits |
| PR-07 | Format-based reidentification with synthetic records | crypto-lab-format-ward | Implementation and validation in progress |
| PR-08 | Exact parity bias for correlated Markov sources | crypto-lab-noise-to-numbers | Implementation and validation in progress |
| PR-09 | Real public-context binding example | crypto-lab-hybrid-guide | Queued |
| PR-10 | Precise heuristic FRI-query labels and error-term scope | crypto-lab-stark-tower | Deferred: active maintenance PR #21 |
| PR-11 | Prior-aware controls for profiled leakage metrics | RR-POWER-MEASURED | Coordinate with existing owner; profiling scope is optional |

## PR-01 AEGIS commitment

Source: Derbez et al., [Key Committing Attacks against AES-based AEAD Schemes](https://doi.org/10.46586/tosc.v2024.i1.135-157),
Section 3 and Appendix A.2 (PDF page 22, journal page 156).

The known-key fixture must accept one ciphertext/tag under two different key/AD
contexts sharing a nonce. Show the actual state comparison before and after AD,
both decryption outcomes, both tag lengths, and a one-byte AD negative control.
The lesson is full robustness/key commitment, not recovery of an unknown key or
ordinary fixed-key authentication forgery. Verdicts and counts must be computed.

Preflight: encyclopedia roadmap blob `9d4ebd21b3a1184b240425a4b4e751274287bc18`
does not claim this repository. AEGIS main is `96c9e52024915148f967a8d0c9b57feaa6eb4d9b`;
no open PR was returned at preflight. Baseline: 87 unit tests and production build
pass. The paper fixture was reproduced locally for 128-bit tags; generated
256-bit tags also collide. No implementation or deployment is credited yet.

## Delivery evidence

Record each completed item's commit, exact test results, mutation checks, CI and
served-asset verification here. Preserve scoped limitations and unfinished work.

### PR-01 delivery

Merged [AEGIS PR #25](https://github.com/systemslibrarian/crypto-lab-aegis-gate/pull/25) as `85dbee492ea12792b8ebe1397b10104e53623ac5`. Local checks: 94 unit tests, build, 25 browser/accessibility tests; all three successful-build assertion mutations killed and source/bundle restored. Local browser was Chromium 153 through an untracked executable-path override; committed CI browser and checks were unchanged. Final PR workflow 40196495251 and exact-main deployment workflow 40196664984 passed. Public HTML, JS and CSS matched the verified build byte for byte. JavaScript SHA-256: `c799a44707c733f2f35a1b59af2115ce3b3ea05a5ca6e546e7d175412ea46933`.

The original PR upload was incomplete and failed CI; it was corrected before merge. The final branch tree was compared with the tested local tree and matched exactly. No failed revision was deployed.

### Ownership boundaries

SNARK Arena PR #24, SPDZ Forge PR #25, and STARK Tower PR #21 are active implementation/maintenance work, so the paper-review lane leaves those repositories untouched. PR-06 and PR-11 remain shared-owner coordination items. Queued recommendations are not delivery claims.
