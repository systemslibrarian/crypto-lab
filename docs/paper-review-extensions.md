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
| PR-03 | Explicit unintended witnesses and constraint repair | crypto-lab-snark-arena | Live: PR #26, exact-main gate, provenance artifact and every served asset verified |
| PR-04 | CKKS client reaction oracle with exact model boundaries | crypto-lab-ckks-lab | Deferred: public-key/CoeffToSlot/Galois-rotation prerequisites are absent |
| PR-05 | Inconsistent MAC-key contexts and selective failure | crypto-lab-spdz-forge | Live: PR #27, independent audit, exact-main gate and every served asset verified |
| PR-06 | Selective abort and retry effects on DP releases | crypto-lab-proof-tally | Live: PR #20, exact-main gate and every served asset verified |
| PR-07 | Format-based reidentification with synthetic records | crypto-lab-format-ward | Live: PR #24, exact served assets verified |
| PR-08 | Exact parity bias for correlated Markov sources | crypto-lab-noise-to-numbers | Live: PR #6, exact served assets verified |
| PR-09 | Real public-context binding example | crypto-lab-hybrid-guide | Live: PRs #25 and #26, exact served assets verified |
| PR-10 | Precise heuristic FRI-query labels and error-term scope | crypto-lab-stark-tower | Live: PR #23, exact-main gate and every served asset verified |
| PR-11 | Prior-aware controls for profiled leakage metrics | RR-POWER-MEASURED | Planned; narrowed into measured-data controls, with no deep-learning stack planned |

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

### PR-03 SNARK Arena delivery

Source: [CL098 revision 7](https://eprint.iacr.org/2025/2120), dated
2026-04-11. Read Sections 2.1–2.3, Definitions 1–9, Section 3.2.3,
Section 5 and Section 7. The delivered XOR fixture adapts the paper's small
phantom-output example; it does not implement CCC-Check, reproduce the paper's
evaluation or establish general circuit correctness.

Merged [PR #26](https://github.com/systemslibrarian/crypto-lab-snark-arena/pull/26)
as exact main `025f878b22b2fa3df945359548c2422d9548c1f4`. The reviewed feature head
`b9c7545f3b4f3db9cd797dffbd37ed1f4e7efc4a` and merge have identical tree
`4382496ccabf5d3e956a752f9672e50a01b6030c`. The weak public-input XOR relation
accepts an actual Groth16 proof for `(a,b,out)=(2,2,r-4)` because it omits the
Boolean conditions. The repaired circuit adds `a(a-1)=0` and `b(b-1)=0`, uses
separately regenerated circuit-specific WASM, proving key and verification key,
rejects that same assignment, and proves all four legitimate binary rows. Changed
public output, cross-key verification, swapped proof elements and ordinary proof
tampering are separate rejected controls; a browser input check is explicitly not
the repair.

Final-head [run 40207370988](https://github.com/systemslibrarian/crypto-lab-snark-arena/actions/runs/40207370988)
and exact-main/deployment
[run 40207754121](https://github.com/systemslibrarian/crypto-lab-snark-arena/actions/runs/40207754121)
passed 27 provenance controls, 51 unit tests, eight maintenance controls,
typecheck/build and all 42 hosted browser/claim/accessibility tests, including
380-pixel reflow. The focused mutation began with
`baseline: unmutated copy PASSES`, removed both repaired constraints, failed its
owning learner claim, restored every byte, reported `restored baseline PASSES`
and `all 1 mutation(s) caught`. Provenance artifact `12604231532` records
`reproduced-and-bound`: authenticated Circom 2.2.3 builds reproduced all three
shipped witness WASM files twice and bound the XOR R1CS/PTAU/zkey/vkey chain.
Pages artifact `12604427228` identifies the exact merge. An independent exact-main
build, that artifact and all 18 public files have identical file sets and bytes;
the public root contains the CL098 revision-7 lesson and source links.

### PR-06 Proof Tally delivery

Source: Fredrik Meisingseth, *On Aborts in Differential Privacy*, CL084,
manuscript dated 2026-09-16. Read Tables 1–2, Section 1.2,
Definitions 5–7, Section 3.1 and Theorems 2–5 and 9–10. The delivered fixture
is a separately proved finite example; it does not claim that the paper's
general theorems transfer to S04's participant-contributed mechanism.

Merged [PR #20](https://github.com/systemslibrarian/crypto-lab-proof-tally/pull/20)
as exact main `9394e3fd3fd84cab5cfa95016f21808ca9f4e395`. The added route uses neighboring
datasets with `f(D0)=0` and `f(D1)=1`, exact two-sided-geometric noise
`Pr[Z=z]=1/(3*2^|z|)` and the visible abort rule `s <= -1`. One ordinary
attempt retains likelihood ratio 2; conditioning on eventual publication raises
one event's ratio to `5/2` and needs exact `delta = 1/10` to retain epsilon
`ln(2)`; a three-attempt visible transcript reaches ratio 8. An independent
abort coin retains ratio 2. The learner sees exact transcript probabilities,
stopping conditions and observer boundaries, while fresh randomness, a fixed
retry cap and the distinction between attempted and conditioned mechanisms stay
explicit. Existing Prio3 and S04 behavior are unchanged.

Final-head [run 40203960382](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40203960382)
passed 170 unit tests, all 35 hosted browser/claim/accessibility tests, 79
registry tests and 28 rendered-verdict tests. Focused mutation
[run 40203649860](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40203649860)
started from a passing 28-spec baseline, moved both source and bundle hashes for
each case, killed all six named mutations, restored both files and reported
`6/6 killed, 0 survived, 0 neither`. Exact-main/deployment
[run 40204140961](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40204140961)
repeated the complete 170/35/79/28 gate. Pages artifact `12603415366` identifies
the exact merge, and the public HTML, JavaScript and CSS all match that artifact
byte for byte.

### PR-10 STARK Tower delivery

Sources: CL042, *SoK: Hash-Based Polynomial Commitments and Low-Degree Tests:
From FRI to Basefold, STIR, and WHIR*, Sections 2.1–2.5, 4.1–4.3, 5.4–5.5
and 7; CL145, *Small-field hash-based SNARGs are less sound than conjectured*,
Sections 1–1.2, 2.4, 3 and 4.1–4.3; and CL146 v4/TCC, *A Simplified
Round-by-round Soundness Proof of FRI*, Sections 2.1–2.2, 3.1–3.2, 4.1–4.2,
5.1, Theorem 5.2 and Section 5.4. The correction maps only formulas whose
hypotheses are represented; it does not transfer CL145's extension-field
example or turn rejection of fixed fixtures into a protocol theorem.

Merged [PR #23](https://github.com/systemslibrarian/crypto-lab-stark-tower/pull/23)
as exact main `51b29f35a0c593b724c1925d2bbc1c2fcd1fd0af`, building on the real verifier
from PR #21. The learner ledger now labels the convenient `rho^t` capacity
calculation as a heuristic, separately shows the unique-decoding-radius and
strict Johnson-limit examples, computes CL146's conditional query term as
`(1-min(theta,delta))^t`, caps union bounds at one and fails closed when
proximity, fold-MCA, algebraic/composition, Merkle/hash or Fiat–Shamir/BCS
terms are missing. Invalid rates, counts, distances, terms and field parameters
are rejected. Sampled cheating-proof rejection remains empirical evidence, not
a universal soundness proof.

Final-head [run 40203974891](https://github.com/systemslibrarian/crypto-lab-stark-tower/actions/runs/40203974891)
passed the complete computational/DOM/claim gate, all four focused mutations
from a passing baseline, publishing and maintenance controls, the production
build and all 24 hosted browser/accessibility tests after stale wording
assertions were corrected without weakening the labels. Exact-main/deployment
[run 40204331185](https://github.com/systemslibrarian/crypto-lab-stark-tower/actions/runs/40204331185)
repeated 120 computational and 47 DOM assertions, five claim-language tests,
`baseline: unmutated copy PASSES`, all four named mutations, two publishing and
six maintenance checks, the production build and all 24 Linux
browser/accessibility tests. Deploy job `121202686420` used Pages artifact
`12602817749` and names the exact merge. The public HTML, JavaScript and CSS
match that artifact byte for byte. The pre-existing high-severity `undici`
advisory remains owned by Dependabot PR #22; PR-10 did not change dependencies.

### PR-05 SPDZ Forge delivery

Source: Keller, Navot and Tyagi, *Off-Key: Inconsistent MAC Keys Compromise
Privacy in SPDZ-Family MPC*, CL079, manuscript dated 2026-10-17. Read Sections
3, 3.2, 4.1–4.5, 5 and 5.1. The delivered lesson adapts the core blind-opening
algebra to the lab's three-party trusted-dealer shares; it does not claim to
reproduce the paper's two-party preprocessing protocols or evaluated framework
failures.

Merged [PR #27](https://github.com/systemslibrarian/crypto-lab-spdz-forge/pull/27)
as exact main `2bfdc83b0ef587a598afad95d6ef0e72bdfd904b`. The control authenticates the
input and mask under alpha; the vulnerable route authenticates the input under
alpha and the mask/check under beta=alpha+Delta. Both outcomes come from the
actual MAC-check sums. The consistent route derives `Delta(g-d)`, which depends
on the already public blind opening; the inconsistent route derives
`Delta(g-y)`. The original unmasked result recovers the shared input, while a
fresh nonzero multiplier leaves a zero/nonzero selective-failure predicate that
identifies y only under the displayed bit promise. The attacker helpers receive
only their request and visible residual or verdict; hidden shares, keys and y
remain in a separately labeled omniscient audit. Ordinary corrupted-share
detection, a private affine-output control and a same-context repair keep
correctness, prescribed output and privacy distinct.

An independent paper-to-code audit re-derived both residuals, recovery paths and
observer boundaries and found no blocking or nonblocking defect. Final-head
[run 40204049873](https://github.com/systemslibrarian/crypto-lab-spdz-forge/actions/runs/40204049873)
passed 76 unit tests, all three focused mutations from a passing baseline, six
maintenance checks, the production build and all 18 browser/accessibility tests.
Exact-main/deployment
[run 40204752389](https://github.com/systemslibrarian/crypto-lab-spdz-forge/actions/runs/40204752389)
repeated that gate with zero dependency vulnerabilities. Deploy job
`121203752667` used Pages artifact `12603930373` and names the exact merge. The
public HTML, JavaScript and CSS all match that artifact byte for byte.

### Catalog integration

The initial PR-01, PR-02, PR-07, PR-08 and PR-09 deliveries are recorded in
their cards, pinned exhibit maps and generated catalog/README/knowledge-map
entries. Existing exhibit anchors were
mapped to substantive lines in the new commits and checked against committed
source. Source reviews remove claims that came only from related-demo links,
historical attacks or conceptual comparisons. In particular, Polynomial Forge
uses BLS12-381 groups/pairings rather than BLS signatures and does not execute
Groth16, while Hybrid Guide distinguishes its real X25519 exhibit from simulated
ML-KEM inputs.

That initial pass completed its source-anchor, exhibit-pin, evidence-scanner,
teaching-scope, standards/chip, document-generation and date-history checks. The
six-recommendation reconciliation below subsequently added independently reviewed
catalog corrections and roadmap cross-references, so the earlier five-card-only
snapshot is historical rather than a claim about the current diff. Current gate
counts and source pins are recorded with the final central-catalog delivery.

### Six-recommendation reconciliation

The six remaining recommendations were rechecked on 2026-10-25 against the actual
papers, current repository mains and the named pull requests. They are not treated
as automatically correct proposals. The dispositions below preserve active owners,
state missing prerequisites explicitly and distinguish a bounded teaching adaptation
from reproducing a paper's complete system or theorem.

| ID | Disposition | Current evidence, dependency and implementation status |
| --- | --- | --- |
| PR-03 | **Implemented narrowly; live** | SNARK Arena PR #26 is live at exact main `025f878b`. The actual Groth16 backend accepts the weak relation's explicit `(2,2,r-4)` assignment; regenerated repaired-circuit artifacts reject it while all four binary rows prove. Provenance, negative controls, the clean-baseline missing-constraint mutation, exact-main Linux gate, Pages artifact and every served byte were independently verified. The adaptation does not claim CCC-Check or general circuit correctness. |
| PR-04 | **Defer with concrete dependencies** | Fresh exact main `e2f3e59` implements a symmetric teaching model in `src/toyCkks.ts`. It does implement gadget/digit evaluation-key key switching for relinearization after multiplication, but that is not the Galois rotation/key-switching path needed for CoeffToSlot. The lab has no public-key encryption, fresh public `Enc(0)`, coefficient-to-slot transform, or distinct client validity boundary. Those are essential to the paper attack. Retain the visible limitation rather than mislabel an abstract reaction oracle as a CKKS reproduction. A future implementation first needs a validated engine/library for those operations, exact level/scale/no-wrap accounting, then a public-only adaptive attacker and independently checked recovery. An independent re-audit found no present defect and the unchanged 17-test baseline passes. |
| PR-05 | **Implemented narrowly; live** | SPDZ Forge PR #27 is live at exact main `2bfdc83b`. An independent audit re-derived the control residual `Delta(g-d)`, vulnerable residual `Delta(g-y)`, unmasked recovery and masked bit-promise inference from CL079 and the actual code. The bounded three-party trusted-dealer adaptation separates attacker and explanatory views, ordinary corruption and a same-context repair; legitimate additive shares of one global MAC key remain distinct. Exact-main CI passed the complete unit, clean-baseline mutation, maintenance, build and browser/accessibility gate, and all three served files match the deployment artifact. |
| PR-06 | **Implemented narrowly; live** | Proof Tally PR #20 is live at exact main `9394e3fd`. Its separately proved finite model exposes complete one-attempt and capped-retry transcripts, computes exact neighboring probabilities and keeps conditioning on publication distinct from one attempted release. The output-independent-abort control preserves the ordinary ratio, and the UI never gives its observer omniscient state. Exact-main CI, the clean-baseline focused mutations, deployment and every served asset were verified. |
| PR-10 | **Combine with delivered PR #21; live** | STARK Tower PR #21 is live at `4dc27dec` and supplies the real verifier path. PR #23 is live at exact main `51b29f35` and classifies each figure as exact arithmetic, theorem-conditioned, heuristic or empirical; exposes proximity/MCA/composition/hash/Fiat–Shamir terms; validates parameter domains; and retires universal claims from fixture rejection. Exact-main CI passed its complete computational, DOM, claim, mutation and hosted browser/accessibility gate, and all three served files match the exact deployment artifact. |
| PR-11 | **Planned; narrow into RR-POWER-MEASURED** | Fresh exact Power Trace main `c8635e31` runs CPA/DPA rather than a profiled classifier, so the paper's classifier theorems do not directly apply and no deep-learning stack is warranted. Retain controls useful to the measured-data workstream: immutable provenance/license/device/acquisition records, session-grouped and duplicate-safe splits, frozen preprocessing, shuffled trace/label controls, prior-aware interpretation, and independent key-recovery verification. If profiling is later added, require a training-only prior baseline and held-out guessing-entropy/AOD reporting. An independent re-audit found no present defect and the unchanged 49-test baseline passes. |

#### Paper versions and sections reviewed

- **PR-03 / CL098.** [*Language-Agnostic Detection of Computation-Constraint
  Inconsistencies in ZKP Programs via Value Inference*](https://eprint.iacr.org/2025/2120),
  ePrint revision 7 dated 2026-04-11, retrieved 2026-10-25, SHA-256
  `654f286d9d489bd9981b8222a252f97bcc80d70f083efc607b37e7974bfc19f9`. Read Sections 2.1–2.3,
  Definitions 1–9, Section 3.2.3, Section 5 and Section 7. Sections 2.1–2.3
  separate the witness computation from verifier constraints; Section 3.2.3's
  XOR encoding accepts non-Boolean assignments when Boolean constraints are
  absent. The delivered circuit is a small adaptation of that relation, not a
  claim to reproduce the paper's detector. Relevant current paths:
  `public/zk/xor_weak.circom`, `public/zk/xor_repaired.circom`,
  `src/crypto/constraint-gap.ts`, `src/ui/constraint-gap.ts`,
  `src/crypto/constraint-gap.test.ts`, `e2e/constraint-gap.spec.ts`,
  `scripts/check-zk-artifacts.mjs` and `scripts/mutations.mjs`.
- **PR-04 / CL123.** [*Reaction Attack on CKKS Deployments with Asymptotically
  Optimal Query Complexity*](https://arxiv.org/abs/2610.21127), arXiv manuscript
  2610.21127v1 dated 2026-10-15 and accepted for IEEE S&P 2027, retrieved from
  the Drive collection, SHA-256
  `91dd48ef9612896321dd8b579830df9839b03fd3ccb317a377d587cca6f01372`.
  Read Sections 2.2–2.3, 3.1–3.3, Theorems 3.1–3.2 and Sections 4–5. The
  reviewed local manuscript's byte identity with the separate ePrint posting was not
  established, so no ePrint-version claim is made. Relevant current paths:
  `src/toyCkks.ts`, `src/main.ts`, `test/toyCkks.test.ts` and `e2e/claims.spec.ts`.
- **PR-05 / CL079.** [*Off-Key: Inconsistent MAC Keys Compromise Privacy in
  SPDZ-Family MPC*](https://eprint.iacr.org/2026/2533), manuscript dated
  2026-10-17 and public revision dated 2026-10-19, retrieved 2026-10-25,
  SHA-256 `578bda70467f3d658c0011a08c419c37d0f5a987d0e580705c9770c24d5ab0f3`.
  Read Sections 3, 3.2, 4.1–4.5, 5 and 5.1. The delivered lesson is explicitly
  a trusted-dealer algebraic adaptation; it is not a reproduction of every
  preprocessing or persistence assumption in a production SPDZ-family framework.
  Relevant paths: `src/spdz/offkey.ts`, `src/spdz/offkey.test.ts`,
  `src/ui/panels/offkey.ts`, `e2e/behavior.spec.ts`, `e2e/gate.ts` and
  `scripts/mutations.mjs`.
- **PR-06 / CL084.** [*On Aborts in Differential Privacy*](https://eprint.iacr.org/2026/2059),
  manuscript dated 2026-09-16, retrieved 2026-10-25, SHA-256
  `3b7e56f2886bae4981d8a8476d1dcaf97135d8cb258aeb7b489b47b6938ed846`.
  Read Tables 1–2, Section 1.2, Definitions 5–7 and Section 3.1, Theorems 2–5
  and 9–10. The teaching fixture uses exact neighboring-output probabilities and
  a small capped transcript; it does not transfer the paper's general results to
  the existing distributed sampler without a separate proof. Relevant paths:
  `src/distributed/abortModel.ts`, `src/distributed/abortModel.test.ts`,
  `src/ui/abortModel.ts`, `e2e/claims.spec.ts` and `e2e/verdict-mutations.json`.
- **PR-10 / [CL042](https://eprint.iacr.org/2026/1367),
  [CL145](https://eprint.iacr.org/2025/2197) and
  [CL146](https://eprint.iacr.org/2025/1993).** For CL042, read the ePrint PDF
  received 2026-07-02 and approved 2026-07-06, retrieved 2026-10-25, Sections
  2.1–2.5, 4.1–4.3, 5.4–5.5 and 7 (SHA-256
  `629e4b1a18e9e62cfc18fd4139266fbad058714d518356c13bdfe344a81140b9`).
  For CL145 revision 2026-04-09, read Sections 1–1.2, 2.4, 3 and 4.1–4.3
  (SHA-256 `14e3f91c82d7b49d9f140161f90498f0c5b042afbe0b87bc9920d8d12932805d`).
  For CL146 v4/TCC version dated 2026-08-25, read Sections 2.1–2.2, 3.1–3.2,
  4.1–4.2, 5.1, Theorem 5.2 and Section 5.4 (SHA-256
  `15a2f3ec6fc693147c193a8f6a9be184c3cb28f47fe247ea5b4efb82314c3cb7`).
  The lab's base-field fixture does not match CL145's sextic-extension concrete
  example, and the lab lacks the complete parameter mapping needed to label its
  query heuristic a protocol soundness theorem. Relevant paths: `src/soundness.ts`,
  `src/stark.ts`, `tests/claim-language.node.mjs`, `scripts/mutations.mjs` and
  `e2e/claims.spec.ts`.
- **PR-11 / CL092.** [*Is it Really Broken? The Failure of DL-SCA Scoring
  Metrics under Non-Uniform Priors*](https://eprint.iacr.org/2026/338), ePrint
  PDF received 2026-02-20 and approved 2026-02-23, retrieved 2026-10-25,
  SHA-256
  `2b5f0c847ffb817f78d35b371caf7f45a895eb9fbd990ae12e20b5161a7a7a48`.
  Read Sections 2–3, 4.1–4.2, 5.1–5.2, Theorems 1–3 and Section 7. Its
  conclusions concern profiled classifiers; only its prior and control-design
  lessons are being carried into `RR-POWER-MEASURED`. The current
  `src/attack/cpa.ts`, `src/attack/dpa.ts`, their unit tests and
  `src/leakage/traces.ts` remain separately characterized.

The PR-04 and PR-11 dispositions were independently re-audited after refreshing
both repositories from GitHub. CKKS Lab local `HEAD` and `origin/main` both
remain `e2f3e59a4c5af667dab219c5c7048401dcd3f83b`; its 17 tests pass and the tree
is clean. Power Trace local `HEAD` and `origin/main` both remain
`c8635e31bbc5ec93f0617a3bf5ee3747a08c70f1`; its 49 tests pass and the tree is
clean. Neither review found a current correctness defect, so no lab source was
changed merely to make the paper visible.

#### Catalog corrections found during reconciliation

[Crypto Lab PR #291](https://github.com/systemslibrarian/crypto-lab/pull/291)
delivered the corrections found during this reconciliation: CKKS Lab no longer
advertises a reproduced chosen-plaintext or
key-recovery attack; Power Trace's key-recovery credit points to its executable
bounded recovery and its unimplemented NTT/Shamir references are removed; SNARK
Arena removes false discrete-log and PLONK implementation credit while preserving
the toxic-waste forgery in learner copy and its pinned exhibit (the attack
vocabulary has no honest term for that failure); SPDZ Forge describes BigInt
field arithmetic with WebCrypto SHA-256 commitments; and Proof Tally attributes
its local Field64/Prio3 and exact rational DP logic separately from noble's
TurboSHAKE128. The same Hub delivery publishes exact reviewed pins and exhibit
maps for all six targets without changing the recommendations' dispositions.

#### Central catalog delivery

PR #291 merged as exact main
[`2927f2a2b9a0`](https://github.com/systemslibrarian/crypto-lab/tree/2927f2a2b9a08dc7d5d1598e38bb60be10fb5709).
Its seven PR workflows passed all 13 applicable jobs, with only the
event-inapplicable drift job skipped: [README/catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209640766),
[Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209640791),
[learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209640843),
[public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209640876),
[protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209640757),
[arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209640712)
and [maintenance verification](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209640833).
The logs report zero failed tests, 24 live worksheets with 554 controls and zero
drift, and successful final maintenance stages. The six target review pins match
their current clean mains; 51 mapped exhibits and every recorded target anchor
validate. Fifteen separately reported full-fleet stale pins belong to other labs
whose mains moved and were not silently re-reviewed here.

Seven exact-main workflows then passed 14 jobs with the same single skip:
[README/catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209975632),
[Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209975673),
[learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209975631),
[public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209975608),
[protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209975602),
[arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209975679)
and [Pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40209975187).
Pages artifact `12604959808` (5,748,550 bytes, SHA-256
`785c40b07639a0f7fe0f92e7432ddb75cc65b9b41feef693e5dae0d2da803ee8`)
produced successful deployment `7315606531`. The public catalog (821,746 bytes,
SHA-256 `4338aeb90432f4a2ae1a327cde45146c5634dfaf108fd157d1e024115e7c2125`)
and knowledge-map JSON (257,251 bytes, SHA-256
`b893d0099741da57825baea0cedb9d7095d6d3e657645b6b705bf25d1422140c`)
matched the artifact and exact main byte for byte. Served `README.md`, `CATALOG.md`,
the encyclopedia roadmap and this checklist before the present evidence-only
follow-up matched exact main as well.

Across the initial PR-01, PR-02, PR-07, PR-08 and PR-09 deliveries and six
reconciled recommendations, unrelated cryptographic engines and fleet
repositories remain outside this lane's changes.
Delivered demonstrations expose computed results, controls and paper-to-demo
limits; planned and deferred entries above are not delivery claims.
