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
| PR-01 | AEGIS two-key commitment collision and state trace | crypto-lab-aegis-gate | In progress |
| PR-02 | KZG final-challenge binding in a multi-point batch | crypto-lab-polynomial-forge | Queued |
| PR-03 | Explicit unintended witnesses and constraint repair | crypto-lab-snark-arena | Queued |
| PR-04 | FHE client reaction oracle with exact model boundaries | crypto-lab-ckks-lab | Queued; public-key/C2S prerequisites |
| PR-05 | Inconsistent MAC-key contexts and selective failure | crypto-lab-spdz-forge | Queued |
| PR-06 | Selective abort and retry effects on DP releases | crypto-lab-proof-tally | Coordinate with S04 owner before edits |
| PR-07 | Format-based reidentification with synthetic records | crypto-lab-format-ward | Queued |
| PR-08 | Exact parity bias for correlated Markov sources | crypto-lab-noise-to-numbers | Queued |
| PR-09 | Real public-context binding example | crypto-lab-hybrid-guide | Queued |
| PR-10 | Precise heuristic FRI-query labels and error-term scope | crypto-lab-stark-tower | Queued |
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
