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
| PR-02 | KZG final-challenge binding in a multi-point batch | crypto-lab-polynomial-forge | Live: PR #12, exact served assets verified |
| PR-03 | Explicit unintended witnesses and constraint repair | crypto-lab-snark-arena | Deferred: active maintenance PR #24 |
| PR-04 | FHE client reaction oracle with exact model boundaries | crypto-lab-ckks-lab | Blocked by public-key/C2S prerequisites; no paper-attack claim |
| PR-05 | Inconsistent MAC-key contexts and selective failure | crypto-lab-spdz-forge | Deferred: active maintenance PR #25 |
| PR-06 | Selective abort and retry effects on DP releases | crypto-lab-proof-tally | Coordinate with S04 owner before edits |
| PR-07 | Format-based reidentification with synthetic records | crypto-lab-format-ward | Live: PR #24, exact served assets verified |
| PR-08 | Exact parity bias for correlated Markov sources | crypto-lab-noise-to-numbers | Live: PR #6, exact served assets verified |
| PR-09 | Real public-context binding example | crypto-lab-hybrid-guide | Live: PRs #25 and #26, exact served assets verified |
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
256-bit tags also collide. These were preflight observations; the delivery record below supersedes the initial pending state.

## Delivery evidence

Record each completed item's commit, exact test results, mutation checks, CI and
served-asset verification here. Preserve scoped limitations and unfinished work.

### PR-01 delivery

Merged [AEGIS PR #25](https://github.com/systemslibrarian/crypto-lab-aegis-gate/pull/25) as `85dbee492ea12792b8ebe1397b10104e53623ac5`. Local checks: 94 unit tests, build, 25 browser/accessibility tests; all three successful-build assertion mutations killed and source/bundle restored. Local browser was Chromium 153 through an untracked executable-path override; committed CI browser and checks were unchanged. Final PR workflow 40196495251 and exact-main deployment workflow 40196664984 passed. Public HTML, JS and CSS matched the verified build byte for byte. JavaScript SHA-256: `c799a44707c733f2f35a1b59af2115ce3b3ea05a5ca6e546e7d175412ea46933`.

The original PR upload was incomplete and failed CI; it was corrected before merge. The final branch tree was compared with the tested local tree and matched exactly. No failed revision was deployed.

### PR-02 Polynomial Forge delivery

Source: Ciobotaru, Peter and Velichkov, [The Last Challenge Attack on Fiat-Shamir in KZG-based SNARKs](https://eprint.iacr.org/2024/398), §4.1 equation (11), PDF page 10. Read the construction and surrounding argument on PDF pages 8–10.

Merged [PR #12](https://github.com/systemslibrarian/crypto-lab-polynomial-forge/pull/12) as `f35718189d119ca86025fe31cbb52966e934c628`. The two-opening construction uses public SRS points, never the setup secret. Both individual false claims reject; the premature weighted pairing accepts; hashing both proof points into the challenge rejects this construction. Honest controls use the same actual verifier paths. This isolates the batch-verification flaw, not the complete PLONK exploit or a universal security proof for the repair.

Local checks: 311 unit tests, production build, 24 browser claim tests and three accessibility sweeps covering 32 states at 1280, 380 and 280 pixels. All three successful-build mutations were killed: omitted witness binding, reversed pairing outcome and removed negative scope. Source and bundle restored. PR workflow 40196907376 and exact-main workflow 40197456281 passed. Public HTML and all JS/CSS match the local build. Entry JavaScript SHA-256: `ab75c082783c6463f528135d7d36dd28a17abedeb67708dc20042228366e7c3f`.

### PR-07 Format Ward delivery

Source: Boesgaard and Larsen, [Format-Preserving Encryption Creates a Privacy Attack Surface for Re-Identification](https://eprint.iacr.org/2026/993), §3.1–3.2. Read the model and contextual results on PDF pages 1–5 and 7–9; no population-level rates are transferred into the demo.

Merged [PR #24](https://github.com/systemslibrarian/crypto-lab-format-ward/pull/24) as `0549c626c3b8bf7555c43e990ecfefc42753c3dc`. Eight invented records are encrypted with real FF1, fresh per-field tweaks and shuffled order. The matcher receives only visible ciphertext shapes and the auxiliary roster. Joint name/city word lengths give six unique candidates and two ambiguous candidates; the uniform-prior format partition leaks 2.75 of 3 bits. Fresh fixed-length padded AES-GCM records leave all eight candidates. This is neither FF1 key recovery nor proof of identity in an incomplete roster; padding does not establish anonymity against other information.

Local checks: 36 unit tests, production build and 19 browser/accessibility tests, including four new result states at desktop and 380px. All three successful-build mutations were killed: bypassed format matching, doubled Shannon leakage and removed identity-limit wording. Source and bundle restored. PR workflow 40197707548 and exact-main workflow 40198093828 passed. Public HTML and all JS/CSS match the build. Entry JavaScript SHA-256: `c746eacbc5955d122a264bbdc66861ee84359368df1173310e50884fa7ce0e9a`.

### PR-08 Noise to Numbers delivery

Source: Skorski and Mittmann, [Unpredictability from Parity: Understanding Linear Correctors for Markovian Sources](https://eprint.iacr.org/2026/2417), Theorem III.1, Corollary III.7 and Theorem III.11; read PDF pages 1–5.

Merged [PR #6](https://github.com/systemslibrarian/crypto-lab-noise-to-numbers/pull/6) as `4496fd24173ae0e578d23f8811acd6b22c8ac6bf`. The added conditioning panel computes exact integer fractions using the signed transition kernel, compares them with the product-of-marginal-bias shortcut, and shows the first-order finite-length bound. A symmetric repeat-probability 0.9 source has fair marginal bits but two-bit parity bias 0.8. The displayed distance from a fair output bit is half the absolute signed bias. The panel is an analytic first-order model, separate from the existing native fixture assessments and any hardware claims.

Local checks: 123 unit tests, production build, 25 browser claim tests and two complete accessibility sweeps. Independent path enumeration checks the exact probabilities. All three successful-build mutations were killed: signed-kernel arithmetic, distance conversion and removed model boundary. Source and bundle restored. All three PR workflows (40197554319, 40197554285, 40197554341) and all three exact-main workflows (40198090743, 40198090646, 40198090754) passed. Public HTML, all JS/CSS and the descriptive worker match the build. Entry JavaScript SHA-256: `6fd9f1114788ff2af3b72659c95272a785cf4ed0ee26473a39bbcda58730adb9`.

### PR-09 Hybrid Guide delivery

Source: Kang, Lee and Son, [On the Necessity of Public Contexts in Hybrid KEMs: A Case Study of X-Wing](https://eprint.iacr.org/2026/140), §III-B; read PDF pages 1 and 4–6. Independently checked the native X25519 implementation with the published RFC 7748 test vector.

Merged [PR #25](https://github.com/systemslibrarian/crypto-lab-hybrid-guide/pull/25) as `0a347891e06bde9da5576236781b615d47795183`. Public coordinate inversion gives distinct X25519 inputs with equal raw DH secrets. Secret-only HKDF gives equal keys, while including the public input and recipient key gives distinct keys. Same-input and independent-input controls are computed from native WebCrypto operations. The original hybrid component model stays labeled as a model. No ML-KEM, full X-Wing or HPKE construction executes in this new exhibit; no hybrid or multi-user theorem is claimed.

Local checks: 55 unit tests, production build and 23 browser/accessibility tests. All three successful-build mutations were killed: bypassed public transformation, omitted context binding and removed scope boundary. Source and bundle restored. PR workflow 40198096649 and exact-main workflow 40198225668 passed; the initial deployment's HTML and all JS/CSS matched the build. The layout follow-up, [PR #26](https://github.com/systemslibrarian/crypto-lab-hybrid-guide/pull/26), merged as `b798585d2aaa7ae810ec83dbe7a5f3974f642378`. It applies existing panel/button styles and updates the owning eight-section boot guard; the local build and all 23 browser/accessibility tests pass. PR workflow 40198561630 and exact-main workflow 40198787110 passed. Final public HTML and all JS/CSS match the tested build byte for byte. Entry JavaScript SHA-256: `1d98271859a6b729dee7759dcc2033b893df6f728be345c179a580adb67f1426`. Cryptographic engine bytes are unchanged by the layout follow-up.

### Catalog integration

The five cards, pinned exhibit maps and generated catalog/README/knowledge-map entries record these delivered sources. Existing exhibit anchors were mapped to identical lines in the new commits and checked against the local source. Source reviews remove catalog claims that were only related-demo links, historical attacks, or conceptual comparisons. In particular, Polynomial Forge uses BLS12-381 groups/pairings rather than BLS signatures and does not execute Groth16, and Hybrid Guide's card now distinguishes the real X25519 exhibit from simulated ML-KEM inputs.

Local catalog validation passed: all five source-anchor reviews, exhibit-pin validation for the seven available clones (the other 238 were explicitly unavailable), evidence-scanner selftests, 55 teaching-scope controls, 15 standards/chip/exhibit tests, catalog vocabulary/chip checks, catalog document structure, and README/tools/knowledge-map consistency checks. Exactly these five cards changed; all other cards and the encyclopedia roadmap remain byte-identical.

### Deferred work and handoff conditions

These six recommendations remain unimplemented by this lane. Recheck current main and the living encyclopedia roadmap before taking any of them. The named active PRs were still open at the delivery check on 2026-10-25.

| ID | Evidence and concrete next change | Reason to defer / acceptance boundary |
| --- | --- | --- |
| PR-03 | [CL098: computation/constraint inconsistencies](https://eprint.iacr.org/2025/2120): add an explicit unintended witness accepted by an underconstrained relation, then repair the missing constraint and show rejection. | [SNARK Arena PR #24](https://github.com/systemslibrarian/crypto-lab-snark-arena/pull/24) owns active verifier/evidence work. Reconcile its finished verifier before choosing a new relation; do not mistake witness-generator behavior for verifier constraints. |
| PR-04 | [CL123: CKKS reaction attack](https://eprint.iacr.org/2026/2490): expose exact client-validity feedback and the attacker-visible query transcript. | The current teaching engine lacks the needed public-key/CoeffToSlot attack path. Implement and validate those prerequisites first, or explicitly deliver only a reaction-oracle model without calling it the paper's CKKS attack or transferring its query complexity. |
| PR-05 | [CL079: Off-Key](https://eprint.iacr.org/2026/2533): distinguish corrupted-share detection from inconsistent MAC-key contexts, then make selective failure observable. | [SPDZ Forge PR #25](https://github.com/systemslibrarian/crypto-lab-spdz-forge/pull/25) owns active MPC/evidence work. Match the paper's authentication/preprocessing assumptions; merely flipping a share is not an Off-Key reproduction. |
| PR-06 | [CL084: aborts in DP](https://eprint.iacr.org/2026/2059): compare an unconditional release with output-dependent abort/retry and account for the observer's entire visible transcript. | Shared S04/Proof Tally ownership. Agree the observable abort signal, retry policy and privacy accounting before implementation; do not present conditioning on successful publication as the original DP guarantee. |
| PR-10 | [CL042: hash-based commitments and low-degree tests](https://eprint.iacr.org/2026/1367), [CL145: small-field soundness](https://eprint.iacr.org/2025/2197) and [CL146: FRI soundness](https://eprint.iacr.org/2025/1993): separate the displayed query heuristic from proven error terms and assumptions. | [STARK Tower PR #21](https://github.com/systemslibrarian/crypto-lab-stark-tower/pull/21) owns active verifier/soundness work. Preserve an explicitly heuristic label unless the exact implementation parameters and all relevant error terms have a justified bound. |
| PR-11 | [CL092: non-uniform priors in DL-SCA scoring](https://eprint.iacr.org/2026/338): add prior-only, shuffled-trace and held-out controls before treating an improved score as learned leakage. | RR-POWER-MEASURED shared owner and optional profiling scope. No claim of measured physical leakage from a synthetic model or dataset-prior advantage. |

Across the five deliveries, the original cryptographic engines and unrelated fleet repositories were kept outside this lane's changes. New demonstrations expose computed results, safe/default controls, negative controls and explicit paper-to-demo limits. The broader Drive review screened the 158-paper selection and read substantive body sections of 23 papers; it did not claim a full cover-to-cover reading of all 158 papers.
