# Encyclopedia implementation roadmap

**Updated:** 2026-10-25 (UTC).

## Current milestone

**Seventeen implementation milestones are shipped across seventeen live proposals.** Envelope KMS carries E-K-01's complete key-handle exercises and S02's key-evolving audit-log compromise lesson. Search Vault carries L-R-09's query-result integrity exercise, A-D-02's public-key searchable-encryption lesson and L-R-07's bounded Boolean-search lesson. E-K-02's executable HIBE delegation exercise is live in IBE Gate, AES Anatomy carries both A-D-06's classical differential fault analysis and E-K-06's accepted-output fault analysis, Dedup Vault delivers A-D-01's encrypted-deduplication lesson, Shelf Oracle carries L-R-04's compressed-query expansion plus one shared implementation for L-R-05's bounded stateful preprocessing PIR and A-D-10's executed cost model, Attribute Gate carries both A-D-03's bounded hidden-value FABESA lesson and L-R-03's separately scoped RW15 multi-authority and application-layer epoch-gating lessons beside its unchanged FAME route, Proof Tally carries S04's bounded participant-contributed differential-privacy lesson beside its unchanged standardized Prio3 route, DC-net delivers A-D-04's anonymous-broadcast, coalition-view and failure-model lesson, and HPKE Envelope delivers S01's executable Auth KCI and identity-bound Sign-then-Encrypt comparison. [Envelope KMS](https://systemslibrarian.github.io/crypto-lab-envelope-kms/) · [Search Vault](https://systemslibrarian.github.io/crypto-lab-search-vault/) · [IBE Gate](https://systemslibrarian.github.io/crypto-lab-ibe-gate/) · [AES Anatomy](https://systemslibrarian.github.io/crypto-lab-aes-anatomy/) · [Dedup Vault](https://systemslibrarian.github.io/crypto-lab-dedup-vault/) · [Shelf Oracle](https://systemslibrarian.github.io/crypto-lab-shelf-oracle/) · [Attribute Gate](https://systemslibrarian.github.io/crypto-lab-attribute-gate/) · [Proof Tally](https://systemslibrarian.github.io/crypto-lab-proof-tally/) · [DC-net](https://systemslibrarian.github.io/crypto-lab-dc-net/) · [HPKE Envelope](https://systemslibrarian.github.io/crypto-lab-hpke-envelope/)

E-K-01 is **live**: Envelope KMS now searches a declared finite state model for mutable-role, known-key-import and distinct same-value-handle disclosures, distinguishes a completed bounded miss from an incomplete cutoff, and replays found witnesses with real RFC 3394 and AES-GCM. S02 is **live** there too: compromise immediately before period c exposes that period and the future, an earlier rewrite fails only in the key-evolving track under the stated one-way-evolution and modeled-erasure assumptions, and separate retained-checkpoint, expected-close and outside-heartbeat inputs keep integrity, consistency, completeness and freshness distinct. L-R-09 is **live**: Search Vault distinguishes per-record authenticity from completeness and freshness with honest, omission, fabrication and stale-snapshot cases. A-D-02 is **live** there too: a public sender creates randomized Type-3 BLS12-381 PEKS tags, the recipient issues a deterministic trapdoor, the server runs public Test, and a bounded attacker exercises exposed-trapdoor dictionary guessing while the interface keeps search, access, volume and active-guessing leakage separate. L-R-07 is now **live** in the same repository: two actual isolated SSE searches are compared with a bounded two-term OXT adapter over canonical ristretto255 points, five controls measure equality/intersection leakage, and the Path ORAM comparison keeps its separate-server assumptions explicit. E-K-02 is **live**: IBE Gate executes bounded descendant-key delegation, sibling/ancestor failure boundaries, subtree compromise and retained root escrow. A-D-06 is **live**: AES Anatomy derives last-round key constraints from real round-9 AES-128 faults, intersects candidates, reverses the key schedule and verifies the recovered master key. E-K-06 is also **live**: finite samples execute correct and first-round-faulted AES-128, classify exact ciphertext equality and rank one key byte from the selected inputs, while a separate analytic census, a secret-independent null and bounded infection/reference-oracle cases keep the statistical claim scoped. A-D-01 is **live**: Dedup Vault executes fresh-key, local message-locked and RFC 9497 VOPRF-aided modes, measures exact-byte deduplication, and keeps dictionary, role and lifecycle boundaries separate. L-R-04 is **live** in Shelf Oracle: four fixed compressed blocks expand to 64 selectors through executable automorphisms and key switching while the lesson keeps its full scan, four-response shape, circular-security assumption and non-claim of multidimensional or sublinear-server PIR explicit. L-R-05 is **live** there as a separate bounded Piano-style route: client setup streams the static database into private consumable hints, each online request probes eight records, and loss, malformed response, rollback and update cases fail closed or rebuild. A-D-10 is **live** through the same executable ledger, which keeps setup, retained state, wire bytes, records touched, parity contributions, refresh and rebuild costs in separate units rather than claiming a universal speedup. A-D-03 is **live**: Attribute Gate runs a separate lesson using Figure 5's CP-ABE equations with §3.3's partially hidden CP-A2BE payload over Type-3 BLS12-381, compares equal-public-payload worlds with different hidden values, enumerates bounded reconstruction candidates and recognizes a recovered group element only through AES-GCM tag acceptance. L-R-03 is **live** there too: exact asymmetric RW15 independently sets up Hospital and Board authorities, binds issued components to one canonical GID, executes same-GID success, raw cross-GID cryptographic failure and one-issuer compromise, while a separate FAME-based application adaptation executes complete-key epoch reissue, retained old access, trusted-checkpoint rollback detection and owner-assisted DEK rewrap. S04 is **live**: Proof Tally first subtracts two equal-size real Prio3Sum releases to expose a zero-replaced bounded contribution, then runs one all-or-nothing participant-noised release with explicit clipping, adjacency, exact discrete-Laplace sampling, threshold, dropout, collusion, cap and repeat boundaries. S01 is **live**: HPKE Envelope executes RFC 9180 Auth's recipient-key KCI forgery and compares it with a bounded strict-Ed25519 Sign-then-Encrypt profile whose identities, independently expected application context, compromise matrix and transferable-evidence limits are explicit. Hybrid Sign's TLS assignment-status correction is also live. The counts below describe whole proposals.

L-R-05 and its shared A-D-10 cost-model sub-scope are **live** at exact Shelf Oracle main `d08691c9e17a`. The delivered route is a bounded Piano-style parity-and-refresh lesson for a static public database, not a claim that the existing BFV routes gained sublinear server work or that this small adaptation inherits Piano's full theorem. Its exact-main gate and deployment passed, and the public HTML, JavaScript and CSS matched a fresh build byte for byte.

A-D-03 is **live** at exact Attribute Gate main `a4cd1973f99b`. The delivered lesson uses Figure 5's CP-ABE equations with §3.3's partially hidden CP-A2BE payload, keeps the existing FAME results unchanged, states the hidden-value/public-structure boundary, derives each candidate from real pairing equations, fails closed on malformed or over-bound inputs and labels the AES-GCM candidate-recognition wrapper as a bounded teaching adaptation rather than a transferred theorem. The exact-main gate and deployment passed, and the public HTML, JavaScript and CSS matched a fresh build byte for byte.

L-R-03 is **live** at exact Attribute Gate main `ab293fd0386f`. RW15 and the bounded epoch adaptation remain visibly separate: the former implements the paper's decentralized multi-authority equations and GID binding, while the latter is an owner-assisted application-layer FAME composition with no revocable-ABE, public-update or combined-theorem claim. The exact-main gate and deployment passed, and the public HTML, JavaScript and CSS matched a fresh build byte for byte.

S04 is **live** at exact Proof Tally main `f1220e93baa5`. The delivered lesson keeps standardized Prio3 draft-22 and its known-answer values unchanged, executes fixed-size exact-output differencing, and then releases one bounded noisy sum only when the declared cohort, honest-contributor, non-collusion, complete-delivery and output-cap conditions hold. Exact-main CI and deployment passed, the full 64-mutation replay killed every recorded mutation, and the public HTML, JavaScript and CSS matched a fresh build byte for byte.

S02 is **live** at exact Envelope KMS main `d2b6614a9fad`. The delivered integrity-only teaching adaptation compares a static HMAC key with a domain-separated HMAC-SHA-256 state schedule, executes pre-compromise rewrite, compromised-suffix forgery and truncation cases, and requires distinct external evidence for checkpoint consistency, completeness and freshness. Exact-main CI and deployment passed, all 18 combined claim mutations were killed, and the public HTML, JavaScript and CSS matched the reviewed build byte for byte.

A-D-04 is **live** at exact DC-net main `8de5cb25042c`. The five-participant cycle executes fresh pairwise-mask cancellation, observer and coalition components with prior-preserving posteriors, parity-only collisions, malformed and correctly shaped disruption, dropout and reformation, bounded SHA-256 commit/reveal, complete incident-mask reuse and later disclosure. Exact-main CI and deployment passed 44 unit, 11 learner-claim and 12 accessibility/reflow tests, all 22 clean-baseline mutations were caught, CodeQL passed, and the public HTML, JavaScript and CSS matched the exact merged build byte for byte.

S01 is **live** at exact HPKE Envelope main `fcf3b56c06e1`. The executable comparison derives a fresh Auth ciphertext that the intended recipient accepts as the sender using recipient `skR` and public sender `pkS`, then runs a separate Base-HPKE + strict-Ed25519 Sign-then-Encrypt profile over signed sender, recipient, independently expected context and message fields. Recipient, sender and combined compromise, forwarding, public evidence, replay and tamper cases retain the profile's non-standardization and narrow-evidence boundaries. Exact-main CI passed 258 unit tests, all 19 clean-baseline mutations and 27 hosted browser/accessibility tests, deployed, and the public HTML, JavaScript and CSS matched the exact merged tree byte for byte.

| Proposal status | Count |
| --- | ---: |
| Planned | 31 |
| In progress | 0 |
| Verified | 0 |
| Merged | 0 |
| Live | 17 |
| **Total accepted proposals** | **48** |

The 48 proposals retain the audit’s stable IDs and priorities: **17 P1 — next, 24 P2 — depth, and 7 P3 — specialist**. Maintenance corrections are separate from that denominator. A proposal can share an implementation with related IDs, but each ID keeps its own acceptance criteria. These are not 48 requests for standalone labs.

This is the implementation ledger for the user-authorized encyclopedia rollout. [concept-coverage.md](../concept-coverage.md) remains the canonical fleet coverage and gap inventory; this document records the accepted scope, next actions and delivery evidence. It does not replace [TASKS.md](../TASKS.md) or the unrelated queue in [futureworkoct.md](../futureworkoct.md).

### First milestone checklist

- [x] Create this shared ledger with all 48 proposal IDs, acceptance criteria and next actions.
- [x] Add LFSR Forge's Trivium section, regenerate CATALOG.md and pass the catalog/search checks locally.
- [x] Correct Shelf Oracle's full-scan claim, merge [PR #14](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/pull/14) after its gate, and verify its post-merge workflow and corrected README.
- [x] Implement E-K-01's first key-handle model and interface, including actual vulnerable/restricted-policy outcomes and legitimate protected-handle use.
- [x] Complete local production-build browser, accessibility and mutation verification: 96 unit tests, 2 publishing-command controls, 32 browser/accessibility tests with zero retries, and four named mutation kills with exact source/assets restored. The final runner was verified at local `2e8efe0fb9d6a07f2c6ce45d658da44fe4f28a1e`; hosted checks gate integration separately.
- [x] Merge the Envelope KMS and Shelf Oracle changes after their registered checks complete successfully; refresh changed source pins and generated catalog files.
- [x] Verify the Envelope KMS deployment revision, exact served assets and live learner behavior; record the evidence below.
- [x] Implement L-R-09 in Search Vault with deterministic current-snapshot checkpoints and explicit honest/omit/fabricate/stale cases.
- [x] Pass the Search Vault PR gate, merge PR #24, rerun the complete gate on main, and deploy commit `97d9e0ff6fbbcd8d5e526b83497fe7a911fbab26`.
- [x] Reconcile E-K-02 against current IBE Gate, verify its executable HIBE delegation acceptance criteria, hosted tests, deployment revision and served production assets, and record it as live rather than duplicating the work.
- [x] Reconcile A-D-06 against current AES Anatomy, verify its primary-source fault model, recovery and negative/countermeasure cases, complete hosted gate, deployment revision and exact served assets, and record it as live rather than duplicating the work.
- [x] Complete and independently audit E-K-06; merge it only after its full unit, browser/accessibility and mutation gate, then verify the exact deployed assets and learner-visible scope.
- [x] Complete E-K-01's later import, alias and bounded-search milestone; independently audit the model and sources, pass its full hosted gate, and verify its exact deployment and public learner behavior.
- [x] Implement A-D-01 in Dedup Vault; independently audit its cryptographic constructions and boundaries, pass its full hosted unit, learner-claim, accessibility and mutation gate, and verify exact-main deployment and served assets.
- [x] Implement A-D-02 in Search Vault; independently audit its Type-3 PEKS equations and visible proof boundaries, pass its complete unit and hosted browser/accessibility gate, and verify the exact-main deployment and learner-visible attack outcomes.
- [x] Implement L-R-07 in Search Vault; independently audit the bounded OXT algebra, grammar and leakage controls, pass its complete unit and hosted browser/accessibility gate, and verify the exact-main deployment and learner-visible limitations.
- [x] Implement L-R-04 in Shelf Oracle; independently audit its fixed four-block query expansion, direct/expanded agreement, operation and byte accounting, negative cases and visible limits, then verify its exact-main gate and deployed assets.
- [x] Implement L-R-05 and A-D-10 in Shelf Oracle; independently audit the bounded state machine, fixed online shape, recovery/refresh equations, state loss, rollback, update/rebuild behavior and separated cost units, then verify exact-main CI, deployment and served assets.
- [x] Implement A-D-03 in Attribute Gate as a separate bounded FABESA CP-A2BE lesson using Figure 5's CP-ABE equations and §3.3's partially hidden payload; independently audit its equations, anonymity boundary, canonical encodings, candidate search and failure handling, then verify exact-main CI, deployment and served assets.
- [x] Implement L-R-03 in Attribute Gate as an exact RW15 decentralized multi-authority lesson plus a separately labeled application-layer epoch-gating and owner-assisted DEK-rewrap adaptation; independently audit the equations, identity and compromise boundaries, retained access, rollback model, update costs and escrow, then verify exact-main CI, deployment and served assets.
- [x] Implement S04 in Proof Tally as a bounded participant-contributed differential-privacy lesson without changing its standardized Prio3 route; independently audit its sampler, clipping, adjacency, sensitivity, honest-party, dropout, one-release, wrap and collector-view boundaries, then verify the complete hosted gate, deployment and served assets.
- [x] Implement S02 in Envelope KMS as a bounded key-evolving audit-log lesson; independently audit its HMAC schedule, compromise boundary, prior/suffix attacks, checkpoint and truncation results, then verify the complete hosted gate, exact-main deployment and served assets.
- [x] Implement A-D-04 in DC-net; independently audit fresh-mask cancellation, observer and coalition views, collision parity, disruption, dropout, commit/reveal, reuse and later-disclosure boundaries, then verify the complete hosted gate, exact-main deployment and served assets.
- [x] Implement S01 in HPKE Envelope; independently audit the Auth KCI computation, strict Ed25519 transcript and multi-user bindings, sender/recipient compromise matrix, forwarding, transferable-evidence and replay limits, then verify the complete hosted unit, mutation and browser/accessibility gate, exact-main deployment and served assets.

**Implementation work:** S01 is live at exact HPKE Envelope main `fcf3b56c06e1`. L-R-01 remains assigned to a separate implementation worker in Clock Arithmetic and is not credited until reviewed implementation, tests, merge, deployment and live evidence exist. E-K-03 and S06 remain the next unshipped P1 items, but each needs a focused repository that does not yet exist. A-D-05 in the existing LFSR Forge repository is therefore the next immediately implementable unassigned item; its current source already provides Geffe correlation and Trivium/Berlekamp–Massey foundations but not editable Boolean-function, Walsh, resiliency or algebraic-immunity analysis. Optional later P2 and P3 scope remains queued, with no implied delivery dates.

**Maintainer feedback — optional:**

- [ ] Try Dedup Vault's three modes, role views and lifecycle cases; note any explanation, boundary or control that feels unclear.
- [ ] Flag any change you want in the next implementation queue below.

### Next implementation queue — implementation owner: assistant

1. **L-R-01 — Montgomery multiplication:** separately assigned in Clock Arithmetic; retain Planned status until reviewed implementation, test, merge, deployment and live evidence are available. The current external branch is not credited while two browser claims are disabled and the final-subtraction learner path remains incomplete.
2. **E-K-03 — IPsec/IKE security associations and protected packet flow:** create the focused lab only after its repository exists, then implement the bounded RFC 7296/RFC 4303 profile, first Child SA, one-way ESP SAs, SPI lookup, anti-replay state and rekey-boundary cases described below.
3. **S06 — Distance bounding and relay attacks:** create or select a focused repository, choose one primary-source protocol and specify deterministic propagation, processing, pre-guessing and tolerated-error models before implementation; browser wall-clock timing is not evidence of physical distance.
4. **A-D-05 — Boolean combiner design:** next immediately implementable unassigned item while the two focused repositories are absent. Extend current LFSR Forge from a fresh isolated worktree; preserve the unrelated untracked revised brief in its primary checkout and do not stack on failing Dependabot PR #3.

The phase tables below group the whole backlog; this short queue records the next work to pick up. Recheck current source before starting each item.

## Delivery evidence for completed milestones

### HPKE Envelope — S01 signcryption and transferable evidence

- **Merged source:** [PR #31](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/pull/31), exact main [`fcf3b56c06e1`](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/tree/fcf3b56c06e1ef16b10b0db8e1b7fec60d295de8).
- **Pre-merge gates:** final-head [run 40178893409](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/actions/runs/40178893409) passed typechecking, 258 unit tests, the production build, all 27 Chromium functional/accessibility cases and the clean mutation baseline with all 19 mutations caught. An independent source and implementation audit found no remaining code-level blocker after independently expected context, pinned-key, plaintext-quarantine and stale-result controls were tightened.
- **Deployment:** exact-main [run 40179028196](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/actions/runs/40179028196) repeated the full unit, mutation, build and browser/accessibility gate and deployed the exact merge. The event-inapplicable Dependabot auto-merge job alone was skipped.
- **Observed live artifact, 2026-10-25:** the public HTML and named JavaScript/CSS assets returned HTTP 200 and matched a fresh exact-main build byte for byte. The served bundle contains the executable Auth KCI case, bounded strict-Ed25519 Sign-then-Encrypt construction, nine-case compromise/evidence matrix, independently pinned-key warning, replay result and current standards-status limitation.
- **Retained boundary:** the profile is not a standardized signcryption wire format, production protocol or proof transfer. Public signature evidence covers exact disclosed fields under a separately pinned key; it does not prove ciphertext authorship, transmission, receipt, time, human intent or legal non-repudiation. Replay and identity-to-key distribution remain application responsibilities.

### DC-net — A-D-04 anonymous broadcast

- **Merged source:** [PR #1](https://github.com/systemslibrarian/crypto-lab-dc-net/pull/1), exact main [`8de5cb25042c`](https://github.com/systemslibrarian/crypto-lab-dc-net/tree/8de5cb25042cc70b991fe53211d85e3324bc9684).
- **Pre-merge gates:** final-head [run 40172921197](https://github.com/systemslibrarian/crypto-lab-dc-net/actions/runs/40172921197) passed formatting, type checking, lint, 44 unit tests, the production build, dependency audit, 11 independent learner-claim tests, 12 accessibility/reflow tests and all 22 named clean-baseline mutations. Final-head [CodeQL run 40172921166](https://github.com/systemslibrarian/crypto-lab-dc-net/actions/runs/40172921166) passed after correcting and resolving seven review findings.
- **Deployment:** exact-main [run 40173229231](https://github.com/systemslibrarian/crypto-lab-dc-net/actions/runs/40173229231) repeated the full application and mutation gates, printed the required clean-baseline and all-22-caught summaries, uploaded the exact verified Pages artifact and deployed it. Exact-main [CodeQL run 40173229219](https://github.com/systemslibrarian/crypto-lab-dc-net/actions/runs/40173229219) passed. Coverage was 98.83% statements, 97.52% branches, 100% functions and 98.77% lines.
- **Observed live artifact, 2026-10-25:** the public page returned HTTP 200 and a real 390-pixel Chromium session exposed all seven lesson sections, the two initially visible round-action buttons, twelve live regions and no horizontal overflow. Served HTML, JavaScript and CSS matched a fresh exact-main build byte for byte at the sizes and SHA-256 digests recorded in A-D-04 above.
- **Advisor publication:** [Crypto Counsel PR #22](https://github.com/systemslibrarian/crypto-counsel/pull/22) merged as exact main [`815f3137e883`](https://github.com/systemslibrarian/crypto-counsel/tree/815f3137e883ebe0e1156e64615bc526756084b9). Validation retained 345 entries and 246 demos, verified all 56 reviewed pins, passed the 1 ancestry and 4 evidence tests, and reported `baseline: unmutated copy PASSES` followed by `all 27 mutation(s) caught`. Exact-main [validation/deploy run 40174401580](https://github.com/systemslibrarian/crypto-counsel/actions/runs/40174401580) and [Pages run 40174401552](https://github.com/systemslibrarian/crypto-counsel/actions/runs/40174401552) passed; the live 345-entry corpus included DC-net at the reviewed lab pin and matched exact main byte for byte at SHA-256 `f0f5e6db3ec7c3b2c7dfb478d0651162b659ab8c360b3d0aedd6ddd0f57cf85a`.
- **Hub publication:** [Crypto Lab PR #280](https://github.com/systemslibrarian/crypto-lab/pull/280) merged as exact main [`cc1ef850f52e`](https://github.com/systemslibrarian/crypto-lab/tree/cc1ef850f52e5e1c4141b91e0a6fb604703b3bde). Six PR workflows passed all 11 applicable jobs, with only the schedule-only drift job skipped. Seven exact-main workflows then passed 14 jobs, again with only that event-inapplicable job skipped; [Pages run 40175351127](https://github.com/systemslibrarian/crypto-lab/actions/runs/40175351127) deployed the exact merge. The live Hub card retained the three committed-source anchors and reviewed pin, and `index.html`, `README.md`, `CATALOG.md`, concept coverage, this roadmap before the present evidence entry, and the knowledge-map JSON each matched exact main byte for byte.
- **Retained boundary:** anonymous-sender reasoning is conditional on the declared graph, independent uniform secret one-use masks, synchrony and observer knowledge. The public output is XOR parity, not a sender count. WebCrypto randomness is a concrete stand-in for ideal masks; the bounded SHA-256 commitment provides neither formal hiding nor Dissent/Verdict accountability; JavaScript does not establish erasure or role isolation.

### Envelope KMS — S02 key-evolving audit logs

- **Merged source:** [PR #45](https://github.com/systemslibrarian/crypto-lab-envelope-kms/pull/45), exact main [`d2b6614a9fad`](https://github.com/systemslibrarian/crypto-lab-envelope-kms/tree/d2b6614a9fad2fe9667b05d35e3a1e6895ad3293).
- **Pre-merge gates:** final-head [Pages/build run 40136700628](https://github.com/systemslibrarian/crypto-lab-envelope-kms/actions/runs/40136700628) passed 154 unit tests, two publishing controls, the production build, 49 Chromium claim/accessibility/reflow tests, zero dependency vulnerabilities and all 18 combined key-handle/audit-log mutations. [CodeQL run 40136700660](https://github.com/systemslibrarian/crypto-lab-envelope-kms/actions/runs/40136700660) passed. The final mutation artifact was retained after an earlier run correctly rejected seven unowned failures and one surviving assertion; the correction assigned each failure to its mutation ID and asserted the exact rejection reason and record index without weakening the gate.
- **Deployment:** exact-main [Pages/build run 40166747041](https://github.com/systemslibrarian/crypto-lab-envelope-kms/actions/runs/40166747041) repeated the 154-unit, two-publishing-control, 49-browser and 18-mutation gate and deployed the exact merge. Exact-main [CodeQL run 40166747021](https://github.com/systemslibrarian/crypto-lab-envelope-kms/actions/runs/40166747021) passed. Coverage was 91.79% statements, 88.00% branches, 96.07% functions and 93.11% lines; mutation artifact `12588014149` retained the replay evidence.
- **Observed live artifact, 2026-10-25:** the public page exposes the exact compromise boundary, paired static/evolving schedules, prior-record rewrite, compromised-suffix forgery, truncation and four separate property results. Served `index.html` (10,786 bytes, SHA-256 `43c32a1cdbc98f3d3ec03d66e598594e21fad911935eab0bd5f5100ba91c72b5`), `assets/index-ByH15Md7.js` (152,661 bytes, SHA-256 `419c49d1da4aaab77cddd40496e96a39b59c53d278170fd16c84eaa92fb534a4`) and `assets/index-DjTG63om.css` (40,625 bytes, SHA-256 `ef993b5becacdf863f492c0ce49429866abec0357d4e0ae4948b885ba7cd0eaa`) matched the reviewed exact-main build byte for byte.
- **Retained boundary:** the lesson assumes HMAC-SHA-256 security, one-way evolution and effective erasure; JavaScript zeroization is best-effort. It is integrity-only, symmetric/private verification with plaintext messages, and neither key evolution nor its retained linear checkpoint alone establishes completeness, freshness, availability, global consistency or split-view resistance.

### Proof Tally — S04 distributed differential privacy

- **Merged source:** [PR #19](https://github.com/systemslibrarian/crypto-lab-proof-tally/pull/19), exact main [`f1220e93baa5`](https://github.com/systemslibrarian/crypto-lab-proof-tally/tree/f1220e93baa5a5cf549915a1d8a6104748e56303).
- **Pre-merge gates:** the final-head [build and learner gate](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40125465557) passed 151 unit tests, the production build, all 33 Chromium claim/accessibility/reflow tests, 73 verdict-registry tests and all 27 rendered-verdict coverage tests. A separate full [mutation replay](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40123033025) reported `baseline green, 27 specs` and `64/64 killed, 0 survived, 0 neither`; the final cleanup changed only the README evidence paragraph and removed that temporary delivery-only workflow.
- **Deployment:** exact-main [run 40125573428](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40125573428) repeated the complete 151-unit and 33-browser gate, passed the 73-registry/27-verdict gate, reported zero dependency vulnerabilities and deployed the exact merge through Pages.
- **Observed live artifact, 2026-10-24 19:31 UTC:** the public page contains the Distributed DP tab, exact-release differencing, the one-cohort/one-release exercise, collector/omniscient view boundary, collusion and repeat refusals, authenticated sender-to-slot requirement, adaptive-cancellation exclusion, non-durable ledger warning and DAP omission. Served HTML, JavaScript and CSS matched a fresh build of `f1220e93baa5` byte for byte.
- **Hub publication:** [Crypto Lab PR #275](https://github.com/systemslibrarian/crypto-lab/pull/275) merged as [`97bf61563a64`](https://github.com/systemslibrarian/crypto-lab/tree/97bf61563a6400b34dbba8bbbb7a29a7c27f1b98). All six PR workflows passed. The seven exact-main workflows passed 14 jobs, with only the event-inapplicable schedule drift job skipped: [Protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40126836922), [Public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40126837001), [Three arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40126837191), [Learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40126836914), [README catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40126836961), [Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40126836850) and [Pages deployment](https://github.com/systemslibrarian/crypto-lab/actions/runs/40126836731). The public Hub serves the reviewed bounded-cohort copy and `Discrete Laplace` card topic.

| Served artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `index.html` | 24,455 | `78dc02303623749266fc4422a3a34b476461151c3654d6275b409db890365bcb` |
| `assets/index-CCx-HQPl.js` | 62,848 | `44dfb5501c95a7a8be5a2673ed4a0abf77400c084fbcbb2c59e54290eb61d326` |
| `assets/index-CQDLZL8C.css` | 18,049 | `f097976b53536bc04fd4d4d3b664fc394b99c85ba7d9420cf0ce4702a9e9fd74` |

The combined privacy claim remains bounded to fixed-size replace-one salary sums with the displayed clamp, floor quantization, sensitivity, activation, exact discrete-Laplace sampler and cap coupling. Prio3 proves only the shifted combined range. It does not attest salary truth, clipping, decomposition, honest randomness or sender identity, and the lab does not implement durable atomic accounting, authenticated intake, DAP transport, a shuffler, amplification or production isolation.

### Envelope KMS — first E-K-01 exercise

- **Merged source:** [PR #43](https://github.com/systemslibrarian/crypto-lab-envelope-kms/pull/43), commit [`2663e075e1ff`](https://github.com/systemslibrarian/crypto-lab-envelope-kms/tree/2663e075e1ff1500b95fe6f36acd3c50dc8a70be). Its tree equals the final locally verified tree at `2e8efe0fb9d6a07f2c6ce45d658da44fe4f28a1e`.
- **Pre-merge gates:** [build, browser, coverage, audit and mutation gate](https://github.com/systemslibrarian/crypto-lab-envelope-kms/actions/runs/39976983197) passed; [CodeQL](https://github.com/systemslibrarian/crypto-lab-envelope-kms/actions/runs/39976983393) passed and its PR check reported no new alerts. Deployment and Dependabot-only jobs were correctly inapplicable to this ordinary PR.
- **Deployment:** [post-merge workflow](https://github.com/systemslibrarian/crypto-lab-envelope-kms/actions/runs/39977857416) completed successfully for the same merge commit, including build and deployment.
- **Observed live behavior, 2026-10-23 15:28 UTC:** fixed roles blocked the executed trace; legitimate protected unwrap opened the exact challenge; the unsafe policy's displayed 32-byte key independently opened the displayed AES-GCM challenge; a nonextractable target refused wrapping even under the unsafe policy. The visible limitation remained present.

| Verification | Observed result |
| --- | --- |
| Unit and publishing-command controls | 96 unit tests and 2 publishing-command controls passed. |
| Browser and accessibility | All 32 tests passed locally with zero retries; the complete hosted gate also passed. Includes desktop, 380px, reduced motion, keyboard focus, reflow and the existing state drive. |
| Claim mutation verification | All four named mutations were caught by their owning assertions; each source file and the exact original JavaScript asset set was restored, and its owning test passed again. The hosted workflow retains the machine-generated evidence artifact. |
| Coverage and dependency audit | Existing coverage thresholds passed; the new model reached 100% statements, branches, functions and lines. Dependency audit reported zero vulnerabilities. |
| Served JavaScript | `assets/index-DQHi3gOg.js`, 94,668 bytes; SHA-256 `80e6f6be839ce72a5cb0443b81ebd346c5896aaec7e83d13f7af0e8763f83295`. |
| Served CSS | `assets/index-CkJYJNHB.css`, 31,344 bytes; SHA-256 `857f9c7addb46aad13e27c211de900dabbcd2d3b71448617829843122f1169a5`. |

Both served assets matched the locally tested production build byte-for-byte. The source-mutation runner's own file-read races were corrected before merge, and the final security scan passed. The local runtime's certificate authority was placed in a separate test-only browser trust store; TLS validation, page-error checks and accessibility thresholds remained enabled.

### Envelope KMS — complete E-K-01 bounded state search

- **Merged source:** [PR #44](https://github.com/systemslibrarian/crypto-lab-envelope-kms/pull/44), commit [`50fcf5130274`](https://github.com/systemslibrarian/crypto-lab-envelope-kms/tree/50fcf5130274de940aba5a3ada405d95243e4fcb).
- **Pre-merge gates:** [build, browser, coverage, audit and mutation gate](https://github.com/systemslibrarian/crypto-lab-envelope-kms/actions/runs/40047035613) passed; [CodeQL](https://github.com/systemslibrarian/crypto-lab-envelope-kms/actions/runs/40047035602) passed.
- **Deployment:** [exact-main build and deployment](https://github.com/systemslibrarian/crypto-lab-envelope-kms/actions/runs/40047769606) passed for the merge commit, including its complete mutation gate; exact-main [CodeQL run 40047769622](https://github.com/systemslibrarian/crypto-lab-envelope-kms/actions/runs/40047769622) passed.
- **Observed live artifact, 2026-10-24 01:08 UTC:** the public URL returned HTTP 200 and named the new JavaScript and CSS assets. The served HTML, JavaScript and CSS matched both the exact-main Pages artifact and a fresh production build of `50fcf5130274` byte-for-byte. The served JavaScript is also the browser-tested mutation baseline and contains the new learner section, all three presets, complementary role labels, AES-GCM verification label and visible PKCS #11 limitation.

| Verification | Observed result |
| --- | --- |
| Unit and publishing-command controls | 119 unit tests and 2 publishing-command controls passed on exact main. |
| Browser and accessibility | All 39 production-browser/accessibility tests passed. They exercise the fixed-policy bounded miss, a one-state incomplete cutoff, the known-key-import witness at depth 3, the same-value-handle witness at depth 4, two distinct equal-value terminal handles with exact complementary roles, concrete AES-KW replay, AES-GCM verification, keyboard operation, mobile reflow and accessibility. |
| Claim mutation verification | The clean browser baseline passed before mutation, and all ten named cases `KHI-01` through `KHI-04` and `KHS-01` through `KHS-06` were killed with restoration verified. [The exact-main evidence artifact](https://github.com/systemslibrarian/crypto-lab-envelope-kms/actions/runs/40047769606/artifacts/12541513913) retains each mutant and restored-control result. |
| Coverage and dependency audit | Hosted coverage was 91.29% statements, 87.83% branches, 95.18% functions and 92.30% lines. The high-severity dependency audit found zero vulnerabilities. |
| Served HTML | `index.html`, 10,786 bytes; SHA-256 `0b05bdadafa1efda6bd9033a2c34947e9fb68dd5b0ddc7b6b063c584d7badfd1`. |
| Served JavaScript | `assets/index-BZNp5uDZ.js`, 119,979 bytes; SHA-256 `a676607d20756ade334ecd906108c54adafaeebdc04df4c1300777efe3485230`. |
| Served CSS | `assets/index-DDJxzCQC.css`, 34,923 bytes; SHA-256 `7c7ce8066efd7b1d2f2c4e3d832a4129d53c34242cee707dad9d7ba10e866c66`. |

This completes the roadmap's bounded teaching model, not a general API-security proof. Fixed-policy exhaustion means no witness within the displayed bounds; a cap hit remains incomplete. The same-value case uses distinct handles containing equal bytes, and the concrete replay validates a symbolic witness rather than establishing PKCS #11 conformance, HSM isolation or a vendor vulnerability.

### Dedup Vault — A-D-01 encrypted deduplication

- **Merged source:** [PR #1](https://github.com/systemslibrarian/crypto-lab-dedup-vault/pull/1), commit [`3cbf467bdb1a`](https://github.com/systemslibrarian/crypto-lab-dedup-vault/tree/3cbf467bdb1a67cce39466e2e335e443530ac171). Its tree is identical to the final reviewed feature tree at `2f8a3a5b8728`.
- **Pre-merge gates:** [build, learner-claim, accessibility, coverage, audit and mutation run 40055127586](https://github.com/systemslibrarian/crypto-lab-dedup-vault/actions/runs/40055127586) passed; [CodeQL run 40055127584](https://github.com/systemslibrarian/crypto-lab-dedup-vault/actions/runs/40055127584) passed.
- **Deployment:** [exact-main run 40055618704](https://github.com/systemslibrarian/crypto-lab-dedup-vault/actions/runs/40055618704) passed its complete build gate and deployed the merge commit; exact-main [CodeQL run 40055618693](https://github.com/systemslibrarian/crypto-lab-dedup-vault/actions/runs/40055618693) passed with no error or warning annotations.
- **Observed live artifact, 2026-10-24 02:53 UTC:** the public URL returned HTTP 200 from the exact-main Pages deployment. Served HTML, JavaScript, CSS and third-party notices matched a fresh build of `3cbf467bdb1a` byte-for-byte, and the JavaScript retained all five reviewed learner exhibits and the visible construction limits.

| Verification | Observed result |
| --- | --- |
| Unit and coverage | All 38 tests in 7 files passed. Coverage was 98.38% statements, 94.55% branches, 100% functions and 98.85% lines. |
| Learner claims | All 7 production-browser claim tests passed. They independently decrypt displayed AES-CTR output, verify measured equality and byte accounting, exercise actual dictionary-query budgets and proof failure, distinguish role capabilities, and check lifecycle and stale-verdict boundaries. |
| Accessibility and reflow | All 11 tests passed, including automated WCAG A/AA scans under dark and light preferences, keyboard reachability, reduced motion, and page-level reflow at 320, 380, 390, 768 and 1,440 pixels. |
| Claim mutation verification | The exact `baseline: unmutated copy PASSES` line preceded `DV-01` through `DV-24`, each reported caught; the run ended with exact `all 24 mutation(s) caught`. |
| Dependency and source security | The high-severity dependency audit reported zero vulnerabilities. Exact-main CodeQL completed JavaScript extraction, analysis and result upload successfully. |
| Served HTML | `index.html`, 6,654 bytes; SHA-256 `3aa4add5060ad880fc7fd17aa6286024d915343ae058674e27f6ee8d178e2551`. |
| Served JavaScript | `assets/index-C4ZDGYCT.js`, 81,669 bytes; SHA-256 `b6223abf07bbb1ef94347ff3886c1cb7a6a5dfb12632e4f24dafd5d701400ba3`. |
| Served CSS | `assets/index-DBmBcOjh.css`, 6,094 bytes; SHA-256 `0f029fde9b2f154d22e1ac1af911facce5b283d91143708767aaa66a76cca70b`. |
| Served notices | `THIRD_PARTY_NOTICES.txt`, 3,461 bytes; SHA-256 `cb3e5ec3f4d0753c8b7cfadb93a2a9ecda96881372ef5bcb6a9664777630ce51`. |

The delivered exercise is a bounded DupLESS-shaped adaptation, not byte-for-byte DupLESS and not a transfer of the original RSA-OPRF proof to RFC 9497 VOPRF. Each derived AES-CTR key/counter pair is confined to one distinct plaintext value; repeats of that exact value intentionally reuse the pair and ciphertext, while using the pair across different plaintext values would be unsafe. Whole-ciphertext possession is deliberately not presented as a scalable proof-of-ownership protocol, rate limiting only delays guesses within the modeled identities and epochs, and the co-located browser roles do not supply production isolation, authentication, HSM protection or retroactive revocation.

### Search Vault — A-D-02 public-key searchable encryption

- **Merged source:** [PR #25](https://github.com/systemslibrarian/crypto-lab-search-vault/pull/25), commit [`1f0b50595608`](https://github.com/systemslibrarian/crypto-lab-search-vault/tree/1f0b505956087721c7ec3ec3f1221a2df26ae205). Its tree equals the final reviewed feature tree at `596398c1fee`.
- **Pre-merge gate:** [run 40060915246](https://github.com/systemslibrarian/crypto-lab-search-vault/actions/runs/40060915246) passed after two genuine pre-green findings were corrected. A global test selector had also matched the new leakage cards, so it was scoped to `#challenge-outcome`. The zero-guess state had emitted a header-only table that failed the axe `th-has-data-cells` rule, so the meaningless empty table was removed. No browser or accessibility rule was weakened.
- **Deployment:** [exact-main run 40061206280](https://github.com/systemslibrarian/crypto-lab-search-vault/actions/runs/40061206280) passed its complete build and deployment jobs for `1f0b50595608`. The Pages artifact was 63,118 bytes and deployment `7293848801` completed successfully.
- **Observed live artifact, 2026-10-24 04:12 UTC:** the public URL and all five exact built assets returned HTTP 200. Each served file matched a fresh exact-main build byte for byte, and the main bundle references the lazy PEKS core, dictionary-attacker and server chunks and retains the bounded non-recovery explanation.

| Verification | Observed result |
| --- | --- |
| Unit and dependency checks | All 117 tests in 12 files passed. `npm ci` audited 46 packages and reported zero vulnerabilities. |
| Typecheck and production build | TypeScript and Vite completed successfully across 45 transformed modules. |
| Browser and accessibility | All 30 hosted tests passed with zero failures or retries: 14 existing learner claims, 9 PEKS claims, 5 query-integrity claims and 2 all-state accessibility/reflow runs at desktop dark and 380-pixel dark viewports. |
| Independent cryptographic checks | The Type-3 equations `X = xP2`, `A = rP2`, `B = H2(e(H1(w), rX))`, `T = xH1(w)` and `H2(e(T, A))` were checked against an independent fixed `x = 7`, `r = 11` transcript. RFC 9380 hash-to-G1, strict point decoding, randomized equal-keyword tags, wrong-recipient/cancellation cases and public-sender/public-Test role boundaries were exercised separately. |
| Served HTML | `index.html`, 8,673 bytes; SHA-256 `079a5b60e49ac91d476cec48aff30bf01b1f266779d92c7b2d72dde6de8490fc`. |
| Served main JavaScript | `assets/index-xXZ__Q5w.js`, 82,871 bytes; SHA-256 `d8e0140cc855168072ba7c2c20597f386d7ea6773da940b5b3e141b7b04334cd`. |
| Served CSS | `assets/index-B5C55bhn.css`, 11,750 bytes; SHA-256 `fa06bc1734859c693b631ae3c60741f86deac77d45752772251a8643da4bc0f5`. |
| Served lazy chunks | `core-CNFi5dRb.js`, 75,051 bytes, SHA-256 `24171db2357fb6f13bb0d1f90f24d74c20b7c68cdc6eb1505c5b06bfe2b39475`; `dictionary-_eCMAIb6.js`, 947 bytes, SHA-256 `9caa3807c105cf01669cc392d50f282d18c5b9ae7be061c2b2f30218d0fe70fe`; `server-JvCtFakR.js`, 1,028 bytes, SHA-256 `a6fa2ad88465d8eebe23a44c3e22496ddab658e7b9b00a0563218ed1e66624e7`. |

The delivered construction is an algebra-preserving Type-3 teaching adaptation. It does not claim transfer of the original symmetric-pairing proof, a standardized GT wire encoding, exact 128-bit security, CCA security or hardened constant-time behavior. PEKS tags are not body encryption and provide no sender authentication, tag/body binding, completeness, freshness, process isolation or post-quantum security. A bounded dictionary miss remains incomplete evidence, not a security result.

### Search Vault — L-R-07 Boolean encrypted search

- **Merged source:** [PR #26](https://github.com/systemslibrarian/crypto-lab-search-vault/pull/26), commit [`d904972690e1`](https://github.com/systemslibrarian/crypto-lab-search-vault/tree/d904972690e1514d70d5f36fc25b75840b0e4590). The squash-merge tree is identical to the final locally reviewed feature tree at `734b182ff5a4`.
- **Pre-merge gate:** [run 40087851619](https://github.com/systemslibrarian/crypto-lab-search-vault/actions/runs/40087851619) passed dependency install/audit, all unit tests, typecheck/build and the complete hosted Chromium learner-claim/accessibility gate. The local macOS Chromium process could not launch because of host Mach-port error 141, so no local browser-pass claim is made; test discovery and the authoritative hosted run were both read directly.
- **Deployment:** [exact-main run 40088072088](https://github.com/systemslibrarian/crypto-lab-search-vault/actions/runs/40088072088) passed the same complete gate and deployed `d904972690e1`. Its Pages artifact was 77,755 bytes.
- **Observed live artifact, 2026-10-24 11:03 UTC:** the public URL and all six built files returned HTTP 200. Every served byte matched the reviewed production build, and the served main bundle contains the two-keyword control, pre-transmission grammar rejection, five-trace ambiguity warning, Path ORAM boundary and active-server omission/false-inclusion limit.

| Verification | Observed result |
| --- | --- |
| Unit and dependency checks | All 180 tests in 15 files passed. `npm ci` audited 46 packages and reported zero vulnerabilities. |
| Typecheck and production build | TypeScript and Vite completed successfully across 55 transformed modules. |
| Browser and accessibility | All 37 hosted Chromium tests passed with zero failures: 14 existing SSE learner claims, 7 OXT claims, 9 PEKS claims, 5 query-integrity claims and 2 all-state WCAG A/AA/reflow runs at desktop dark and 380-pixel dark viewports. Each accessibility run traversed 38 learner states. |
| Independent cryptographic and semantic checks | RFC 9496 positive and all 29 invalid-encoding cases, RFC 4231 HMAC-SHA-512, zero-scalar retry, strict point/scalar boundaries, five-key separation, all 91 keyword pairs in both operand orders, independent plaintext intersections, invalid grammar, ciphertext/tamper failures and a malicious authentic-row false-inclusion case were checked. |
| Leakage and ORAM controls | Same-x/overlapping-s derived `d13`, `d15`, `d22`; same-x/disjoint-s and different-x/overlapping-s each derived zero repeats for different reasons; repeated-s and identical-query controls separated stag and point equality. The implementation derives 48 encrypted block transfers per logical fetch and 144 for a three-fetch fixed envelope at `N=24`, `Z=4`, `L=5`. |
| Served HTML | `index.html`, 8,658 bytes; SHA-256 `af63c615b1ad257d8a03d90c1091d106b4c05b174614209f53c21d70529c1cbc`. |
| Served main JavaScript | `assets/index-BwyDZU_3.js`, 140,289 bytes; SHA-256 `c563f79dd801b2fb318e27900cb9a944aa5a422259070b5befe9b29cefca995a`. |
| Served CSS | `assets/index-CvGMDEQt.css`, 11,852 bytes; SHA-256 `bf4780369cc5a73dca5f9f7bd1841a686be79d21279b97a48578f13bec702fde`. |
| Served lazy chunks | `core-CmFVdtw2.js`, 56,809 bytes, SHA-256 `14962b8ff6661c24cdbd67a742668d0f460b9d96677f779f66985dc1062303b9`; `dictionary-DfclOzvh.js`, 909 bytes, SHA-256 `4b3428a0b3d87b73575cb9ca070d6dd3d3eb8c4c96a9ec003271e07453407d21`; `server-C9DT7UIt.js`, 1,010 bytes, SHA-256 `d9b2ba7747a705d65522a43429fa9c3cc9ff726e3c35a41c7619ae6994e1f5ae`. |

The delivered construction is a static two-known-distinct-keyword teaching adapter, not the paper's optimized TSet and not a transfer of its complete proof. Exact XSet membership removes probabilistic-filter false positives only for honest execution. A malicious server can omit a valid match or falsely include an authentic s-list row that failed the x test, and the adapter has no completeness or freshness proof. The Path ORAM table is derived arithmetic for a separate non-colluding semi-honest storage server, not an executed ORAM or concealment of OXT search leakage. JavaScript constant-time behavior, dynamic/forward/backward-private search, multiple owners, collusion, OR, NOT, parentheses and longer formulas remain outside the lesson.

### Shelf Oracle — L-R-04 PIR compressed queries

- **Merged source:** [PR #16](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/pull/16), commit [`4d31c5b3ec5e`](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/tree/4d31c5b3ec5e239a170bb4d10c0ba501d95ae7e0).
- **Pre-merge gate:** [run 40094177906](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/actions/runs/40094177906) passed the complete unit, build and production-browser/accessibility gate before merge.
- **Deployment:** [exact-main run 40094580465](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/actions/runs/40094580465) passed for `4d31c5b3ec5e`: `npm ci` reported zero vulnerabilities, all 99 Vitest tests in 7 files passed, the production build succeeded, all 33 Playwright tests passed, and deploy job `120875094004` succeeded.
- **Observed live artifact, 2026-10-24 12:41 UTC:** the public HTML, JavaScript and CSS matched the exact-main build byte for byte. The deployed bundle contains the four-block query path, actual Galois expansion, fixed four-response shape, circular-security boundary and explicit rejection of multidimensional or sublinear-server claims.

| Verification | Observed result |
| --- | --- |
| Executed query paths | The existing 64-ciphertext direct one-hot BFV query and four fixed 16-selector compressed blocks independently recovered the same selected record; direct, expanded and plain-record bytes agreed and passed the record decode tag. |
| Expansion and setup | All four blocks execute the odd automorphisms `1025`, `513`, `257` and `129`, binary-gadget key switching and exact two-prime NTT/CRT products. Missing, truncated, mismatched, noncanonical and corrupted evaluation-key material has explicit negative coverage. |
| Derived communication and work | Each ciphertext serializes to 6,912 bytes. Direct query upload is 442,368 bytes; four compressed blocks are 27,648 bytes; four reusable Galois keys are 746,520 bytes; and the compressed first upload is 774,168 bytes before becoming cumulatively smaller on query two. The direct response is 6,912 bytes and the four fixed compressed responses total 27,648 bytes. Both paths still execute 64 record products. |
| Browser and accessibility | All 33 production-browser tests passed, including independent displayed-value claims, keyboard/focus and live-region behavior, WCAG A/AA checks and 280-pixel reflow. |
| Served HTML | `index.html`, 12,423 bytes; SHA-256 `87a70f78c79ea18f644cc8f53e0e7f96a768145753a3aba74e457a1a9bbe48ac`. |
| Served JavaScript | `assets/index-C1VPXS8v.js`, 111,270 bytes; SHA-256 `1790af6f91b7885f4a4ef08e82db2d6d5bd4579766391794931663a46537f12a`. |
| Served CSS | `assets/index-sI92ZJKz.css`, 13,427 bytes; SHA-256 `39dc0878310c6df8391daf5b5813b04d8956db877139996e8c7f8f39952f0a1e`. |

The delivered lesson is a bounded query-compression adaptation, not SealPIR's multidimensional production design. Its four fixed blocks and four fixed responses prevent the chosen 16-record block from being sent in plaintext, but still scan all 64 records and do not establish sublinear server work. Key-dependent Galois keys add the displayed circular-security assumption; the Homomorphic Encryption Standard comparison is limited to its modulus-bit ceiling because the lab uses a different error distribution; and the record tag does not provide malicious-server integrity.

### Shelf Oracle — L-R-05 stateful PIR and A-D-10 cost model

- **Merged source:** [PR #17](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/pull/17), commit [`d08691c9e17a`](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/tree/d08691c9e17aaf624781adb127ac4a161f993690). Its tree is identical to the final reviewed feature tree at `b231a3c04386`.
- **Pre-merge gate:** [run 40101598377](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/actions/runs/40101598377) passed all 121 unit tests in 8 files, the production build and all 38 hosted Chromium claim/accessibility tests.
- **Deployment:** [exact-main run 40102100735](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/actions/runs/40102100735) passed for `d08691c9e17a`; build job `120896187968` and deploy job `120897039238` succeeded, the Dependabot-only job was correctly skipped, and Pages deployment `7299875025` reached success.
- **Observed live artifact, 2026-10-24 14:26:53 UTC:** the public URL returned HTTP 200 after the deployment. Public HTML, JavaScript and CSS matched both the exact-main Pages artifact and a disposable fresh production build byte for byte. The rendered page contains the Stateful PIR tab, and the deployed bundle retains the setup, canonical query, update/rebuild and adaptation-limit claims.

| Verification | Observed result |
| --- | --- |
| Bounded construction | The executable static model fixes `N = 64`, `B = 512`, eight chunks of eight records, `Q = 33`, 256 primary hints and eight punctured backups/replacements per chunk. Setup streams 32,768 bytes, performs 2,496 parity-record contributions and retains a 197,696-byte base encoding before sparse cache entries. |
| Online recovery and refresh | Each canonical request serializes to exactly 8 bytes, names one record per chunk, causes exactly eight record probes/XOR contributions and receives one 512-byte parity. Recovery and consumed-backup refresh are checked across all 512 bytes; `replacement = target` and duplicate replacements remain valid rather than being resampled away. |
| Stateful and negative cases | All 64 targets, cached-repeat cover queries, setup misses, the 33-request boundary, malformed and abandoned responses, state loss, canonical persistence, external high-water rollback rejection, a pending-request update and full database-update invalidation/rebuild have unit coverage. The visible update diagnostic discloses that it deliberately chooses a retained replacement from private audit state and is not an ordinary privacy experiment. |
| Availability and costs | The page derives `(7/8)^256` for a fixed target and the scoped session union bound `33 · (7/8)^249 ≈ 1.20 × 10^-13 ≈ 2^-42.92`; neither is presented as a 128-bit or end-to-end bound. Setup, retained state, wire bytes, probes, XOR contributions, cache growth, update scans and rebuilds remain separate. The 33-query normal-cache ceiling is 16,929 bytes, and the full-download wire crossover occurs at query two under the displayed comparison. |
| Browser and accessibility | All 38 hosted Chromium tests passed, including four stateful learner-claim tests and three complete WCAG A/AA/reflow drives at 1,280, 380 and 280 pixels. |
| Mutation verification | The restored local baseline passed before and after each probe. The existing twelve mutations plus five Piano-core mutations were caught by their owning tests; two additional state-parser counter guards were removed one at a time, each made its exact test fail, and the 22-test focused Piano baseline passed again after restoration. The parser probes are recorded separately and are not added to the runner's seventeen-mutation total. |
| Served HTML | `index.html`, 13,502 bytes; SHA-256 `eb442c0c74cd47f0d411b1c390b7f96eb84db1442266f6da56edea4478d94612`. |
| Served JavaScript | `assets/index-BQ_h0HyZ.js`, 154,583 bytes; SHA-256 `d1fb39698c4808b8d23c0546b5cebac05e468a8efc3aa9cf36500ddb55bc47a6`. |
| Served CSS | `assets/index-sI92ZJKz.css`, 13,427 bytes; SHA-256 `39dc0878310c6df8391daf5b5813b04d8956db877139996e8c7f8f39952f0a1e`. |

This is a bounded adaptation of Piano's primary/backup-hint idea, not its full theorem, reference wire format, benchmark, pipelined construction, dynamic extension or asymptotic storage regime. The server retains only the ordinary database, so `ProcessDB` is identity/none; the expensive setup is client-specific and the explicit retained state is larger than this toy database. The model is static and honest-but-curious. It does not provide malicious-server privacy or integrity, authenticated freshness, availability, timing or traffic hiding, multi-client sharing, hardened state storage, crash consistency, incremental updates or ORAM. Record hashes and the snapshot digest are diagnostic, not authentication, and logical operation counts are not browser timings.

### Attribute Gate — A-D-03 hidden attribute values

- **Merged source:** [PR #12](https://github.com/systemslibrarian/crypto-lab-attribute-gate/pull/12), commit [`a4cd1973f99b`](https://github.com/systemslibrarian/crypto-lab-attribute-gate/tree/a4cd1973f99b925863b7f83260851ca439edfd81). Its tree is identical to the final independently reviewed feature tree at `5efb065be6fd` and the final local verification tree at `72f8358`.
- **Pre-merge gate:** [run 40109066723](https://github.com/systemslibrarian/crypto-lab-attribute-gate/actions/runs/40109066723) passed the production build, all 162 unit tests, 30 hosted Chromium learner-claim tests and three complete accessibility/reflow drives.
- **Deployment:** [exact-main run 40109374693](https://github.com/systemslibrarian/crypto-lab-attribute-gate/actions/runs/40109374693) passed for `a4cd1973f99b`; build job `120917700865` and deploy job `120918628909` both succeeded.
- **Observed live artifact, 2026-10-24:** the public URL returned the separate FABESA lesson and its learner-visible leakage, candidate-ledger, failure and limitation text. Public HTML, JavaScript and CSS matched a disposable fresh build of exact main byte for byte.

| Verification | Observed result |
| --- | --- |
| Figure 5 core and §3.3 payload | Figure 5's CP-ABE Setup, KeyGen, Encrypt and four-term candidate Decrypt equations execute over the existing Type-3 BLS12-381 plumbing with §3.3's partially hidden CP-A2BE payload. Independent seeded equation checks cover the source-group terms, reconstruction and recovered target-group element; no official test vectors were claimed. |
| Hidden/public boundary | Two equal-length records use equal-size hidden attribute values and the same public names, matrix, row map, structure and dimensions. The ciphertext policy payload exposes the matrix, row map and names; the displayed ciphertext and public key expose group encodings and serialized lengths; the presented key exposes its names; and the interface derives candidate count from that selected policy and key. Attribute values and record plaintext remain hidden. |
| Bounded opening and negative cases | Candidate enumeration is capped at 32 and refuses the ten-row 2-of-10 fixture before any decryption attempt. Wrong values, missing names, foreign-authority keys, spliced components, tampering and malformed ciphertexts fail without an expected-plaintext oracle; unexpected runtime failures retain a distinct lesson-error verdict. |
| Theorem and wrapper boundary | The page states FABESA Theorem 4's random-oracle/DLIN adaptive-anonymity boundary, including equal public payloads and key queries satisfying neither challenge policy. The random-GT/HKDF-SHA-256/AES-256-GCM wrapper uses tag acceptance only to recognize a candidate and does not claim theorem transfer, CCA security, sender provenance, constant-time behavior or production hardening. |
| Mutation verification | The restored baseline passed before and after each probe. Replacing the second `ct1` hash exponent with `s1` left the build green but caused six focused cryptographic tests to fail; raising the candidate cap from 32 to 33 left the build green but failed its exact bound test. Both source mutations were restored. |
| Served HTML | `index.html`, 8,726 bytes; SHA-256 `f505e61504d4c50e7e0d82e6f419ba482f3dad50b17f3fbd1de3ce18d951734d`. |
| Served JavaScript | `assets/index-5pj8r4Sf.js`, 170,156 bytes; SHA-256 `e0739dde4dbc30ed10c02f66635ad237ea5a9d454e3bdb50c758c4474f3deaa9`. |
| Served CSS | `assets/index-DG05eCTB.css`, 14,896 bytes; SHA-256 `57a758fdec09ea4c8943921321a0e471826e9be22f6080588ec0edd8990377e5`. |

The delivered lesson hides attribute values, not attribute names, policy structure, dimensions or serialized lengths. Its bounded profile permits one value per public attribute name and no repeated names in a policy; it does not implement §3.4's multi-use extension. Candidate count and sequential tag trials remain observable, the finite cap is a teaching bound, and paper-faithful zero-scalar sampling retains negligible degeneracies disclosed in the lesson. The separately mounted FAME lesson and all of its prior expected results remain unchanged.

### Attribute Gate — L-R-03 multi-authority ABE and bounded epoch gating

- **Merged source:** [PR #13](https://github.com/systemslibrarian/crypto-lab-attribute-gate/pull/13), commit [`ab293fd0386f`](https://github.com/systemslibrarian/crypto-lab-attribute-gate/tree/ab293fd0386fac2a4e89cede2b414056df3188eb).
- **Pre-merge gate:** [run 40116256609](https://github.com/systemslibrarian/crypto-lab-attribute-gate/actions/runs/40116256609) passed the production build, all 226 unit tests, 36 hosted Chromium learner-claim tests and three complete accessibility/reflow drives at desktop, 380 and 280 pixels. Dependency installation reported zero vulnerabilities.
- **Deployment:** [exact-main run 40116671435](https://github.com/systemslibrarian/crypto-lab-attribute-gate/actions/runs/40116671435) passed for `ab293fd0386f`; build job `120939268636` and deploy job `120940344186` both succeeded, and Pages reported that exact revision deployed.
- **Observed live artifact, 2026-10-24 17:39 UTC:** the public page names and renders the RW15 multi-authority and bounded epoch-gating lessons. Public HTML, JavaScript and CSS matched a fresh production build of the merged tree byte for byte; the served bundle retains the RW15 setup/success controls, epoch-adaptation boundary, rollback verdict and payload-preserving rewrap verdict.

| Verification | Observed result |
| --- | --- |
| RW15 construction | Two independent authority setups execute the asymmetric RW15 Type-3 equations. Authority-qualified attributes issued to one canonical byte-exact GID open the two-authority policy; the strongest raw cross-GID row pool structurally satisfies the LSSS but recovers the wrong `GT` element and fails AES-GCM authentication. A compromised Hospital authority can mint Hospital attributes for any GID and open a Hospital-only branch, but cannot manufacture Board's component. |
| Equation and primitive checks | Tests independently reconstruct both authority public keys, issued components, share vectors, every ciphertext row and the three-pairing row identity. Five RFC 9380 §J.10.1 BLS12-381 G2 vectors pin the primitive used for `H(GID)` and `F(attribute)`, with separate scheme-specific domain separation tags. |
| Epoch and retained-access model | The separate application-layer FAME adaptation issues a fresh complete business-plus-epoch key, withholds it from a revoked holder and demonstrates that an old key plus old header still opens. A separately trusted checkpoint binds object, epoch, revision and the complete access-header digest; rolling storage and checkpoint back together remains outside the detector. |
| Rewrap, escrow and work | A fresh DEK encrypts the payload once. Owner-assisted rewrap recovers that DEK through the owner capsule and changes only the selected access header; the UI verifies byte-identical payload ciphertext, exposes owner and FAME-authority escrow, and reports counters incremented by the executed lifecycle rather than a hardcoded estimate. |
| Negative and mutation verification | Malformed group/runtime records, tampering, cross-record payload/header splicing and incorrect metadata fail closed before or at the named authentication boundary. Three L-R-03-specific source mutations—constant GID hashing, `AND`→`OR` epoch gating and unconditional checkpoint acceptance—kept the build green and were killed by two, three and three focused failures respectively; source and bundle hashes returned exactly after every restoration. |
| Served HTML | `index.html`, 8,768 bytes; SHA-256 `406e839b3a7b42b7be4b01d9335574d5da4b30d213438a3d83c3c95e1397bc32`. |
| Served JavaScript | `assets/index-D9lzyOmQ.js`, 229,770 bytes; SHA-256 `a3d6c05f02971c33afd734b5b5bf34ad869c39b0bebe7a3d62ace361fa253838`. |
| Served CSS | `assets/index-D6XbMU7M.css`, 14,946 bytes; SHA-256 `9ad65c1102c7c3b8fd1619df58d75fe7527dd1474880140f9ca99eaf0afdd842`. |

RW15's cited theorem is static random-oracle `q`-DPBDHE2 security with statically declared corrupt authorities under its challenge restriction. The page tests a narrower exposed-authority-secret case and does not claim rogue-key, adaptive-corruption, directory, CCA, policy-privacy, sender-authentication or production security. The epoch route is not RW15, revocable ABE, revocable-storage ABE or self-updatable encryption: it assumes authenticated issuer state and key delivery, performs owner-assisted per-record rewrap, cannot erase retained data and supplies no public update token or combined theorem.

### Hub catalog and roadmap

The current integration records **244 labs** and **1,749 reviewed sections**, twenty more than the 1,729 on the prior Hub baseline. In addition to preserving the existing LFSR Trivium, first Envelope KMS key-handle and Search Vault query-integrity sections, it maps Envelope KMS's bounded key-handle state search and S02 key-evolving audit-log comparison, IBE Gate's executable HIBE delegation, AES Anatomy's classical DFA and accepted-output fault lessons, Dedup Vault's five A-D-01 exhibits, Search Vault's executable A-D-02 PEKS exhibit and bounded L-R-07 OXT exhibit, Shelf Oracle's eleven re-anchored PIR exhibits, Attribute Gate's ninth through eleventh separately scoped FABESA, RW15 and epoch-gating exhibits, and Proof Tally's exact-release differencing, participant-contributed noisy release and trust-boundary comparison. The Envelope exhibits keep the basic unkeyed hash chain, key-handle policy model and separately bounded HMAC-SHA-256 compromise lesson distinct; the S02 map does not collapse retained-prefix consistency into completeness or freshness. The Shelf exhibit records its bounded stateful client-preprocessing route separately from the direct and compressed full-scan BFV routes; the Attribute Gate exhibits keep partial policy hiding, independent authority/GID binding and the application-layer epoch adaptation distinct from the unchanged public-policy FAME route and from one another; the Proof Tally exhibits keep the deliberately insecure exact-release control, the executable distributed route and the central/local/shuffle comparison distinct. The integration also retains Hybrid Sign's exact source and exhibit pins after its TLS assignment-status correction. It updates the affected card and knowledge map, pins the current reviewed source revisions, and retains Search Vault's repaired query-integrity catalog prose. The forty concept boundaries and their statuses remain unchanged.

The source mappings were checked against committed AES Anatomy `1f0f6b86a2dd`, IBE Gate `7dfebaff27c4`, Dedup Vault `3cbf467bdb1a`, Hybrid Sign `e9e4ddb545c6`, Search Vault `d904972690e1`, Shelf Oracle `d08691c9e17a`, Attribute Gate `ab293fd0386f` and Envelope KMS `d2b6614a9fad`; LFSR Forge was separately re-reconciled against current main and its live deployment. The scoped algorithm review keeps excluded side-channel and mutation-only fault mentions out of implementation credit, distinguishes differential fault analysis from ordinary differential cryptanalysis and deterministic finite automata, and records SIFA, HIBE, the S02 private-verifier log, the DupLESS-shaped VOPRF substitution, Type-3 PEKS, bounded OXT, Shelf Oracle's bounded four-block expansion, its bounded Piano-style stateful route, Attribute Gate's bounded FABESA candidate-opening wrapper and its application-layer epoch gate as teaching adaptations rather than inheriting their papers' full results. RW15 alone is mapped to its executed paper equations; the separate rewrap route is not catalogued as a revocable-ABE construction. Shelf Oracle's IND-CPA prose, Search Vault sibling link and side-channel limitation remain explicit non-attack evidence; prose matches for DES and the Gaussian mechanism remain excluded references. Hybrid Sign's modeled break scenarios are not credited as executed discrete-log, factoring or side-channel attacks, and ordinary-language pairing is not treated as a bilinear-pairing reference. The `ed25519.js` module filename used to import noble's ristretto255 group is not catalogued as an Ed25519 implementation or reference, and Attribute Gate's `bls12_381` group import is not catalogued as a BLS signature implementation. Catalog schema/source checks, generated-file freshness checks, search/structure checks, knowledge-map assertions, teaching-scope controls and the broader non-browser CI suites gate this integration. This is verification of the changed mappings, not a new runtime test of all 244 labs.

The S02, A-D-01, A-D-02, L-R-07, L-R-04, L-R-05 and A-D-10 integrations close vocabulary gaps rather than leaving their central claims as unchecked card labels. Envelope KMS now has an exact HMAC implementation anchor and a separately reviewed Merkle-tree comparison without invented fault or side-channel attack credit. Message-locked encryption has a reviewed implementation anchor in Dedup Vault; PEKS and OXT have exact Search Vault source anchors with their searchable-encryption family and non-standardization boundaries recorded; and Shelf Oracle's BFV, NTT, Ring-LWE and PIR credits point to executable source while its eleven exhibits distinguish direct selection, expansion, stateful preprocessing, costs, negative cases and deployment boundaries. Dictionary attack credit was checked one lab at a time against committed source and retained for ten learner-executed searches: Search Vault, Dedup Vault, Phantom Vault, Bcrypt Forge, Commit Gate, OPAQUE Gate, PSI Gate, PAKE Gate, SPAKE Gate and DNSSEC Chain. Search Vault's imported `bls` module alias does not implement a BLS signature, its mutation-test default does not execute a cryptographic fault, and the noble module filename does not turn ristretto255 into Ed25519; all three false credits are excluded. Quantum Vault's only dictionary match remains an explicitly out-of-scope threat. Commit Gate's live P-256 point arithmetic remains implementation credit, while its expressly non-RFC 9380 try-and-increment teaching map remains comment-only. Teaching-scope mutations now fail if Envelope KMS loses its HMAC anchor or Merkle comparison, shifts the anchor to a comment or regains excluded attack credit; if OXT, ristretto255, HMAC-SHA-512, PEKS or active-guessing evidence disappears; if a Search Vault false positive returns; if any positive dictionary credit or Dedup's message-locked implementation disappears; or if the Quantum threat-only mention is promoted to an executed attack.

[Hub PR #254](https://github.com/systemslibrarian/crypto-lab/pull/254) published the completed E-K-01 mapping as merge commit [`8e1880454949`](https://github.com/systemslibrarian/crypto-lab/tree/8e18804549499bac2581bedc660e56c1514300df). All seven exact-main workflows passed: [Learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369430), [Protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369432), [Three arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369426), [Public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369462), [README catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369460), [Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369425) and [Pages deployment](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369417). The deployed catalog was fetched after that deployment and matched `index.html` from the merge commit byte for byte: 784,834 bytes, SHA-256 `9a97c1be9c6e39844ed92c8fe43bd43ec6a7c45290d349fd399f0f5931a74304`; its updated Envelope KMS card appeared exactly once.

[Hub PR #256](https://github.com/systemslibrarian/crypto-lab/pull/256) published the A-D-01 card, five-exhibit map and reviewed vocabulary boundaries as merge commit [`5a4387d63b7c`](https://github.com/systemslibrarian/crypto-lab/tree/5a4387d63b7c1a904f7d6be89253e4f027893af3). All seven exact-main workflows passed: [Learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915563), [Protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915687), [Three arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915590), [Public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915598), [README catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915569), [Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915594) and [Pages deployment](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915954). Fourteen executed jobs passed; the event-inapplicable drift job alone was skipped. The deployed `index.html` matched the merge commit byte for byte: 789,782 bytes, SHA-256 `db0287a91fddf4a9588820adee4ef547f75cb8b53c395a4a641105c0080c53f3`; it contains 244 project cards and exactly one Dedup Vault card with the correct GitHub Pages link. Hosted logs also reported action-runtime deprecation notices and one moderate npm dependency finding in each shared npm install; no test or deployment gate was bypassed, and those maintenance signals are not counted as cryptographic acceptance evidence.

[Hub PR #258](https://github.com/systemslibrarian/crypto-lab/pull/258) published the A-D-02 card, PEKS exhibit map, reviewed algorithm/attack boundaries and L-R-07 design as merge commit [`402f87ed4198`](https://github.com/systemslibrarian/crypto-lab/tree/402f87ed419872d22b34391c4b46dee80e4956e2). All seven exact-main workflows passed: 14 jobs succeeded and only the event-inapplicable scheduled drift job was skipped. The [Pages run 40062710009](https://github.com/systemslibrarian/crypto-lab/actions/runs/40062710009) built and deployed that exact revision. The public `index.html` matched the merge commit byte for byte at 791,777 bytes and SHA-256 `21f7bdcbf7f41ebe2b0f1f132ac788ad437f5d8f4ccc2cd657d8c4cf4a2bcd1b`; the Search Vault PEKS card, source pin and GitHub Pages link each occur exactly once. The served roadmap also matched exact main byte for byte at 147,109 bytes and SHA-256 `4280cd4ed07b9ddd67ba85788b5ae013fc6a1ab9297b55b5fd8039a28777267a` before this later status update.

[Hub PR #260](https://github.com/systemslibrarian/crypto-lab/pull/260) published the completed L-R-07 OXT exhibit map, Search Vault source pin and reviewed teaching boundaries as squash commit [`89215362ee59`](https://github.com/systemslibrarian/crypto-lab/tree/89215362ee5980571c1e75760085c67709b7ec3f). All seven exact-main workflows passed: [Three arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500907), [Pages deployment](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500502), [Public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500906), [Protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500957), [Learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500972), [README catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500919) and [Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500924). Fourteen jobs succeeded and the event-inapplicable scheduled drift job alone was skipped. The deployed `index.html` matched exact main byte for byte at 792,411 bytes and SHA-256 `3a13bc46b45bb1584e683f64b1085c244f717de3b32b4d499580f36a2d5823a2`; the served roadmap also matched exact main at 156,366 bytes and SHA-256 `b24c8103a270908f0d59465091e077d8cf8763baf9701eba39ccff84b28daf2` before this later status update.

[Hub PR #263](https://github.com/systemslibrarian/crypto-lab/pull/263) published L-R-04's ten Shelf Oracle exhibits, exact source pin, catalog card, concept coverage and roadmap state as squash commit [`a475735174b0`](https://github.com/systemslibrarian/crypto-lab/tree/a475735174b01f2c71a548abd3413507d26cc7bc). All seven exact-main workflows passed: [Learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40096447666), [Protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40096447705), [Three arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40096447658), [Public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40096447688), [README catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40096447676), [Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40096447721) and [Pages deployment](https://github.com/systemslibrarian/crypto-lab/actions/runs/40096447252). Fourteen jobs succeeded and the event-inapplicable scheduled drift job alone was skipped. The deployed 794,684-byte `index.html` matched exact main at SHA-256 `ac0a43032b66fc7956161f3c4a42cbd18235491b0f40ae84539c9ad6a6d86ff6`; the served 167,613-byte roadmap matched at SHA-256 `4936d30155f2c8065fbfaeddebda4328707a81c84208af133462d28b5c392a5f` before this later status update. README, CATALOG, knowledge-map and both reviewed-evidence JSON files also matched exact main byte for byte. The completed local branch and worktree were removed; GitHub had already removed the remote feature branch.

[Hub PR #267](https://github.com/systemslibrarian/crypto-lab/pull/267) published L-R-05/A-D-10's eleventh Shelf Oracle exhibit, source pin, card, concept coverage and live roadmap state, and refreshed Hybrid Sign's exact source/exhibit pins and false-credit boundaries, as squash commit [`938283101233`](https://github.com/systemslibrarian/crypto-lab/tree/9382831012335d5f3dcf4723f07954142bc96bcf). All seven exact-main workflows passed: [Learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40104140667), [Protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40104140638), [Three arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40104140706), [Public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40104140631), [README catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40104140671), [Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40104140606) and [Pages deployment](https://github.com/systemslibrarian/crypto-lab/actions/runs/40104140238). Fourteen jobs succeeded and the event-inapplicable scheduled drift job alone was skipped. The public 796,849-byte `index.html` matched exact main at SHA-256 `878d21baf312a609990352bfe08409e2cda44c5623451acf83d85c68ebf4181d`; the served 182,999-byte roadmap matched at SHA-256 `0018143df3e28f6b73841c3ba381e6d761927cd913e74634c2d3948e53b82975` before this later status update. README, CATALOG, concept coverage, the knowledge map and both reviewed-evidence JSON files also matched exact main byte for byte. The live catalog contains the bounded stateful Shelf route and preserves Hybrid Sign's corrected TLS status without crediting its modeled break scenarios as executed attacks.

## Progress definitions

| Stage | Evidence required |
| --- | --- |
| **Planned** | The scope and next action are recorded; implementation has not started. A named topic in a plan provides no implementation credit. |
| **In progress** | Design or implementation is active. Local implementation can be complete while integration checks or publication remain pending. State which sub-scope is active. |
| **Verified** | The stated acceptance criteria have been checked at a recorded commit, with the relevant command results and observed learner behavior. Remaining limits are explicit. This does not establish merge or deployment. |
| **Merged** | The reviewed change is present on the intended main branch, with its merge commit and completed applicable checks recorded. If main moved, affected generated checks have been rerun. |
| **Live** | Deployment revision matches the intended main commit and served bytes/learner behavior contain the change. A green workflow or push alone is insufficient. |

Use these stages for the rollout’s work. The four resolved checks below describe pre-existing catalog coverage, not newly implemented or runtime-verified achievements. Do not advance an entire proposal because its first sub-exercise passes.

## Maintenance corrections

| ID | State at this snapshot | Scope and evidence | Remaining scope / retained limit |
| --- | --- | --- | --- |
| M-LFSR | **Live** | [catalog-exhibits.json](../tools/catalog-exhibits.json) maps six LFSR Forge sections, including real Trivium state clocking, measured BM/forecast comparison and zero-round key recovery. Source pin `2800c76acf9ddc7bd79210327372b95b64d444e6`; exact-main [run 39503735555](https://github.com/systemslibrarian/crypto-lab-lfsr-forge/actions/runs/39503735555) passed 24 unit and 14 hosted browser tests and deployed. The served production assets matched a fresh build byte-for-byte. Hub PRs [#236](https://github.com/systemslibrarian/crypto-lab/pull/236) and [#250](https://github.com/systemslibrarian/crypto-lab/pull/250) published the vocabulary and six-exhibit map; their post-merge catalog and Pages runs passed. | This is a catalog correction for an existing exercise. Retain the zero-round/no-cube-attack limits; full initialization explicitly rejects the zero-round recovery model. |
| M-SHELF | **Live** | [PR #14](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/pull/14), merged as `882c4f0083fd6b6513b77c2e8e1acfba4b624e65`, scopes O(N) scanning to the direct one-hot construction and cites preprocessing alternatives with setup/state/refresh costs. Exact-main [run 39973030539](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/actions/runs/39973030539) passed 87 unit and 31 hosted browser tests and deployed; served JavaScript and CSS matched a fresh build byte-for-byte. | The correction itself did not implement preprocessing. Shelf Oracle now has a separate live L-R-05/A-D-10 stateful lesson; its direct and compressed BFV routes still scan every record, and the stateful route carries explicit setup, retained-state, refresh and rebuild costs. |
| M-HYBRID-TLS | **Live** | [Hybrid Sign PR #25](https://github.com/systemslibrarian/crypto-lab-hybrid-sign/pull/25), merged as `e9e4ddb545c6f934064483f43e924416d26f009d`, removes the false claim that TLS SignatureScheme values `0x090A` and `0x090B` are assigned. It identifies `mldsa65_ed25519_sha512` as `TBD7` in the active TLS working-group Internet-Draft and separates that pending TLS proposal from the lab's existing LAMPS draft-16 implementation baseline. Exact-main [run 40092067603](https://github.com/systemslibrarian/crypto-lab-hybrid-sign/actions/runs/40092067603) passed 19 unit tests, the production build and 11 hosted browser/accessibility tests, then deployed; served assets matched a fresh exact-main build byte-for-byte. | The October 20, 2026 TLS draft is an Internet-Draft, not a final standard, and its requested identifier remains pending. The catalog description required no factual correction. |
| M-LATTICE-SOURCE | **Planned** | Fresh Lattice Gentle main `ae3495ab8846` visibly labels its Menezes source as v1.1 while linking the mutable ePrint record, which now serves v3.3 dated September 16, 2026. The displayed arithmetic has not been shown wrong, but v1.1 example numbers no longer identify the linked v3.3 examples. | Audit every numbered example and known-answer check against v3.3; update UI, README and test citations to the verified current numbering, or pin a retrievable immutable v1.1 artifact. Independently recheck the values and make the visible source revision, link and tests agree. Do not turn a citation drift into an unsupported arithmetic correction. |
| M-NOISE-RESTART | **Planned** | Fresh Noise to Numbers main `f468565fbc65` ships non-IID assessment but no SP 800-90B restart test. Its own `brief.md` already reserves restart testing and real captures for v2, so this row cross-references existing lab scope rather than inventing a duplicate proposal. | Use provenance-recorded physical-source data from 1,000 representative restarts with 1,000 consecutive raw samples per restart. Execute the §3.1.4 row/column construction, most-common-value sanity check, `H_r`/`H_c` estimates and `H_I/2` failure rule; keep any reduced visualization distinct from the full validation input. Pin tool/input hashes, add pass/fail fixtures and independent checks, and keep restart testing separate from runtime RCT/APT health tests. |
| M-DRBG-REQUEST | **Planned** | Fresh DRBG Arena main `4739c152e1ce` has strong known-answer, state-compromise and entropy-routing lessons, but its three exported Generate functions accept unchecked fractional, negative, non-finite and over-limit byte requests and do not enforce the reseed interval. Its CTR_DRBG no-derivation-function path also accepts short entropy by zero extension. | Add an explicit teaching API boundary for the selected SP 800-90A Rev. 1 mechanism: validate request shape and the mechanism's per-request limit before allocation or state mutation; enforce requested-strength, supported prediction-resistance and reseed-required outcomes where exposed; and enforce the no-DF CTR_DRBG seed/input lengths. Preserve under-seeding only as a visibly nonconforming negative exercise. Add boundary and rejection tests proving failed requests leave state unchanged. |

Evidence: [Trivium controls and explicit limits](https://github.com/systemslibrarian/crypto-lab-lfsr-forge/blob/2800c76acf9ddc7bd79210327372b95b64d444e6/src/trivium/panel.ts#L17); [zero-round recovery](https://github.com/systemslibrarian/crypto-lab-lfsr-forge/blob/2800c76acf9ddc7bd79210327372b95b64d444e6/src/trivium/zero-round.ts#L46). Shelf’s corrected [README at the merge commit](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/882c4f0083fd6b6513b77c2e8e1acfba4b624e65/README.md) is present on main. Its [PR gate](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/actions/runs/39972300157) passed; the [post-merge build and deployment](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/actions/runs/39973030539) also passed. The corrected pinned README was retrieved and checked. For Hybrid Sign, the [IANA TLS SignatureScheme registry](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-signaturescheme) lists `0x0907` through `0x0910` as unassigned, while [draft-ietf-tls-composite-mldsa-00](https://datatracker.ietf.org/doc/draft-ietf-tls-composite-mldsa/00/) requests `mldsa65_ed25519_sha512 (TBD7)` and is dated October 20, 2026. The planned rows are grounded in [Menezes v3.3](https://eprint.iacr.org/2026/1098), [SP 800-90B §3.1.4](https://csrc.nist.gov/pubs/sp/800/90/b/final) and [SP 800-90A Rev. 1](https://csrc.nist.gov/pubs/sp/800/90/a/r1/final).

## Four checks already resolved in the audit baseline

All four were resolved in the [catalog at 743f03b9](https://github.com/systemslibrarian/crypto-lab/blob/743f03b9c6134cdcf51b79189e4eadab41bf85ea/CATALOG.md). Preserve their existing coverage and limits rather than implementing duplicate introductory lessons.

| Existing lab | Resolved coverage check | Source pin | Limit retained |
| --- | --- | --- | --- |
| Matsui Line | Multiple linear masks/four joint outcomes and structural zero-correlation teaching, with computed tiny-SPN values. | [e218f2e71938](https://github.com/systemslibrarian/crypto-lab-matsui-line/tree/e218f2e71938d1514cbfde224fc61b1d68fc2e3a) | Computed two-mask/four-outcome and structural-zero observations on an 8-bit toy SPN; not a full multidimensional production-cipher attack. |
| Iron Letter | 5G identity tab with bounded IMSI-based SUCI Profile A concealment and visible routing fields. | [f0fed901fc32](https://github.com/systemslibrarian/crypto-lab-iron-letter/tree/f0fed901fc32852d74e6054fbe571bba4e666e15) | Bounded IMSI-based SUCI Profile A teaching; not a complete 5G stack, Profile B or universal tracking protection. |
| Prime Witness | Lucas–Pratt certificates | [271adc969b97](https://github.com/systemslibrarian/crypto-lab-prime-witness/tree/271adc969b9793eac7472dae90a99a9a57e77560) | Recursive small-prime Lucas–Pratt certificates; not ECPP/AKS or certification of the separate 1024-bit probable-prime output. |
| Hidden Bit | Multi-key rare-signal game | [5c74e5bf8a18](https://github.com/systemslibrarian/crypto-lab-hidden-bit/tree/5c74e5bf8a1826bc2bc60ac42559eec0033f2da0) | Abstract multi-key rare-signal game; not a new encryption construction or a measured proof for AES. |

**S05 is withdrawn and is not one of the 48 proposals.** Key Exchange already demonstrates commitment-based short-code device pairing, including a late-choice collision and commit-first rejection. [Pinned pairing implementation](https://github.com/systemslibrarian/crypto-lab-key-exchange/blob/95121cd4939143bc30604ea2db2bd2510727a606/src/pairing.ts#L31). The separate distance-bounding proposal S06 remains because authentication and physical proximity have different claims.

## Phase guide

Phases express a sensible teaching/build sequence, not promised dates. Recheck the target lab before starting each proposal; newer work may resolve or narrow it.

| Phase | Proposals | Priority | Current state |
| --- | ---: | --- | --- |
| Phase 1 — Stateful key-handle policy | 1 | P1 | 1 live |
| Phase 2 — Privacy, storage and query integrity | 11 | P1 | 11 live |
| Phase 3 — Protocols and arithmetic | 5 | P1 | 5 planned |
| Phase 4 — Construction and cryptanalysis depth | 16 | P2 | 2 live; 14 planned |
| Phase 5 — Advanced privacy and optional workshop depth | 8 | P2 | 1 live; 7 planned |
| Phase 6 — Optional specialist and research scope | 7 | P3 | 7 planned |

### Coordination and optional scope

- L-R-05 and A-D-10 are delivered through one preprocessing/stateful PIR project with separate acceptance criteria. L-R-04 adds query compression and keeps server work separate from communication.
- Search extensions A-D-02, L-R-07, E-K-08 and L-R-08 share the Search Vault baseline, but have distinct roles, query semantics and leakage.
- A-D-06 teaches classical AES faulty-output recovery before E-K-06’s accepted-output selection leakage. Existing lattice faults and AES layer ablations remain credited.
- A-D-03 and L-R-03 share Attribute Gate but remain separate executable claims: FABESA partial policy hiding, RW15 independent authorities/GID binding and the application-layer epoch adaptation are not one combined construction or theorem. E-K-02’s actual descendant key delegation is a different interface.
- E-K-04 owns one reusable Hidden Bit guided-hybrid scaffold: every adjacent hop must identify an exact rewrite, assumption-based replacement or bounded bad event and accumulate the final advantage. S09 may reuse that interaction vocabulary, but the scaffold alone supplies no target-collision implementation credit.
- S03 and E-K-05 are explicitly optional P2 workshop extensions. Their existing hub workshops already execute basic timestamping and direct/ideal-intermediary fair exchange.
- All seven Phase 6 proposals are optional specialist/research scope. Implementation must first select a faithful primary construction and precise model; a conceptual version must be labeled conceptual.

### Additional source-review follow-ups — outside the 48-proposal denominator

These source-informed gaps were confirmed against fresh repository main branches on October 24, 2026. They are retained as **Planned, unprioritized follow-ups**: they do not change the accepted proposal queue, the 48 accepted encyclopedia proposal IDs or the phase counts. `RR-*` is a local reading-review identifier, not an encyclopedia-audit ID. Existing mechanics named in each row must be reused rather than rebuilt.

| ID | State and target | Confirmed gap and bounded acceptance criteria |
| --- | --- | --- |
| RR-PKI-OPS | **Planned** · HTTPS Padlock / TLS Handshake | HTTPS Padlock `97ad66f4132d` already executes certificate-chain validation, PKI Chain and Merkle Proofs already execute Certificate Transparency evidence, and TLS Handshake `c033c5d11800` already executes resumption and 0-RTT replay cases. Add only the missing operational lifecycle: an issuance and overlapping-renewal state machine with failed renewal and expiry deployment, a CAA authorization decision at issuance, and staged HTTP → HTTPS → HSTS → browser-preload rollout with honest rollback/removal delays. Reuse the existing chain/CT work and do not imply that HSTS preload removal is immediate. Ground the behavior in [ACME (RFC 8555)](https://www.rfc-editor.org/rfc/rfc8555.html), [CAA (RFC 8659)](https://www.rfc-editor.org/rfc/rfc8659.html) and [HSTS (RFC 6797)](https://www.rfc-editor.org/rfc/rfc6797.html). |
| RR-SUMCHECK-GKR | **Planned** · ZK Proof Lab | Fresh main `9af5d31e20b0` has seven exhibits and five real proof protocols, but no sum-check, multilinear-extension or layered-circuit GKR exercise; its toy envelope correctly says it is neither a SNARK nor zero knowledge. Execute sum-check over a stated prime field for an explicit low-degree polynomial on `{0,1}^v`: derive the hypercube sum, expose every prover polynomial, enforce degree and recurrence checks, sample each challenge after its message, and finish with a direct evaluation. Add wrong-sum, inconsistent-round, excessive-degree, false-final-oracle, malformed-transcript and tiny-field exhaustive controls. Reuse the checked primitive in one small layered arithmetic-circuit reduction whose wiring and values are independently recomputed. Call this an interactive-proof/verifiable-computation lesson, not ZK or a SNARK; claim GKR only for the layers and terminal check actually executed. Primary anchors: [LFKN](https://doi.org/10.1145/146585.146605) and [GKR](https://doi.org/10.1145/1374376.1374396). |
| RR-GARBLE-MALICIOUS | **Planned** · Garbled Gate | Fresh main `ed9d62ba47ef` executes a real semi-honest Yao lesson and correctly names malicious-garbler behavior as a limit, but has no executable cut-and-choose defense. Independently garble a bounded batch of the existing fixed comparator and commit to every circuit before an unpredictable check/evaluation challenge. Open and regenerate check circuits; exercise wrong-function and corrupted-row cases; evaluate unopened circuits with consistent inputs; and derive abort/verdict and the exact escape probability from the run, with exhaustive small-subset verification. Keep input consistency, malicious OT, selective-failure protection, authenticated garbling, output fairness and composition explicitly outside the bounded teaching adaptation. Primary anchor: [Lindell–Pinkas 2007](https://doi.org/10.1007/978-3-540-72540-4_4). |
| RR-POWER-MEASURED | **Planned** · Power Trace | Fresh main `c8635e31bbc5` executes real AES CPA/DPA over simulated traces and can import CSV, but its bundled sample and alignment lesson remain simulated. Pin one legally redistributable measured AES trace subset with device, target, firmware, acquisition parameters, plaintext/key mapping, license, immutable version and hash. Run the current CPA from the loaded bytes and call a key recovered only after independent retained-ground-truth verification. Execute only corpus-justified preprocessing, show before/after traces and rankings from the same samples, and add a wrong mapping/window, shuffled association or insufficient-trace control. Keep measured and synthetic routes visibly distinct; one device/build does not calibrate another and a browser performs no physical capture. Masked Core `6196c042b3cc` already owns the centered-product second-order CPA lesson and must not be duplicated here. |
| RR-JOY-17-18 | **Planned** · Ratchet Wire / AKE Ladder | Fresh Ratchet Wire `029bff5f44e6` already executes symmetric/DH ratchets, skipped keys, compromise windows and recovery; fresh AKE Ladder `113e7918f040` already executes AKE variants and identity-binding failures. Add a chapter-linked assessment path, not replacement mechanisms: learners predict the compromise window for existing scenarios and identify the transcript identity/key binding that blocks each attack, with any missing transcript case added only after a source-to-code check. Pin the 2026 online edition's [Chapter 17, Encrypted Messaging and Ratcheting](https://joyofcryptography.com/msg/) and [Chapter 18, Authenticated Key Exchange](https://joyofcryptography.com/ake/). |

## Phase 1 — Stateful key-handle policy

The complete bounded E-K-01 proposal is delivered. Three live maintenance corrections and three planned maintenance follow-ups are recorded above.

<a id="e-k-01"></a>

### E-K-01 — Stateful cryptographic API misuse and nonextractable key policies

**Priority:** P1 — next · **Status:** Live · **Workstream:** Stateful key APIs.

**Target:** Envelope KMS, linked to Protocol Checker.

**Existing base:** Envelope KMS executes wrapping, raw DEK retrieval, AAD/tenant binding, rotation and an opt-in caller/key/operation grant model. Protocol Checker searches message-role/attacker-knowledge states and explains symbolic attack traces.

**Acceptance criteria:**

- [x] First exercise: create protected key handles, expose an explicit attribute/operation policy, and execute a reproducible wrap/decrypt trace that discloses a protected key using only permitted modeled API calls.
- [x] Compare a vulnerable policy with a specific restrictive policy; show the same attack being rejected at the responsible transition and keep legitimate operations working. Derive every disclosure/rejection verdict from the current state.
- [x] Complete the broader proposal with import/attribute-confusion and alias-state cases plus bounded state search. Record the invariant, attacker knowledge, transition rules and search bound; a manual trace alone does not complete these extensions.

**Next action:** Preserve the verified model boundaries and source pins while the unassigned implementation queue advances to E-K-03.

**Delivered scope:** The first exercise's fixed-role refusal, unsafe key disclosure, legitimate protected unwrap and nonextractable-target refusal remain live. The later milestone adds deterministic breadth-first searches for mutable-role, known-key-import/template-confusion and distinct same-value-handle cases. It publishes the invariant, initial knowledge, transition alphabet and exact four-call/four-handle/four-blob/three-template bounds; distinguishes bounded exhaustion from a one-state incomplete cutoff; reports shortest witnesses; retains terminal symbolic handle evidence; and replays every found witness with real RFC 3394 before independently verifying the recovered target with AES-GCM.

**Scope and limits:** This is exhaustive only for the displayed finite teaching model. A cap hit is incomplete, and fixed-policy exhaustion means only no witness within those bounds. Same-value handles are distinct objects containing equal bytes, not two handles to one PKCS #11 object. Browser objects do not supply HSM isolation, establish PKCS #11 conformance, assess a vendor product or prove security for unmodeled calls, resources, sessions, concurrency or side channels.

**Audit references:** [Formal Analysis of Cryptographic APIs (original PDF pp. 2438–2440)](https://doi.org/10.1007/978-3-030-71522-9_873).

**Pinned delivered source:** [Envelope KMS 50fcf5130274](https://github.com/systemslibrarian/crypto-lab-envelope-kms/tree/50fcf5130274de940aba5a3ada405d95243e4fcb); [Protocol Checker adbe6c0612e5](https://github.com/systemslibrarian/crypto-lab-protocol-checker/blob/adbe6c0612e583924ebb0cda3f281521ace9a693/src/symbolic/search.ts#L1).

## Phase 2 — Privacy, storage and query integrity

Extend existing labs through the strongest P1 composition gaps; coordinate related work without claiming a new lab is needed for every proposal.

<a id="a-d-01"></a>

### A-D-01 — Encrypted deduplication and message-locked encryption

**Priority:** P1 — next · **Status:** Live · **Workstream:** Encrypted storage and ownership.

**Target:** New focused Dedup Vault lab; link Envelope KMS, OPAQUE Gate and ORAM Vault.

**Existing base at start:** Envelope KMS encrypts records with random 256-bit DEKs and wraps them under KEKs, then teaches rewrapping and compromise scope. OPAQUE Gate separately exposes blind/unblind OPRF operations in a password-authentication protocol. Current source and public-repository reconciliation found no existing encrypted-deduplication or message-locked-encryption lab to extend, so the focused Dedup Vault lab was added.

**Acceptance criteria:**

- [x] Run equal synthetic files through random-DEK and message-locked modes; compute equality visibility and deduplicated storage.
- [x] Execute a low-entropy file dictionary attack, then compare a specified server-aided derivation with its server trust and rate assumptions.
- [x] Separate proof of possession, authorization, equality leakage and deletion/revocation limits.

**Next action:** Preserve the delivered source and Hub pins and retain the verified adaptation and non-claim boundaries while the unassigned implementation queue advances to E-K-03. The Hub catalog and Crypto Counsel corpus publications are merged and live.

**Delivered scope:** Dedup Vault executes fresh-key, local message-locked and RFC 9497 P256-SHA256 VOPRF-aided modes over the same input. It measures physical ciphertext equality, unique blobs, per-user AES-SIV capsules, byte accounting and deduplication ratio; executes offline and bounded online dictionary cases; rejects tampered VOPRF proofs; separates storage, key-server and client compromise views; and derives possession, authorization, deletion, revocation and rotation outcomes from current state. Exact-main unit, learner-claim, accessibility, coverage, dependency, mutation and CodeQL gates passed, and the public assets match the reviewed build byte-for-byte.

**Reviewed design, 2026-10-24:** Compare a random 128-bit data key with local convergent encryption `K = first128(SHA-256(P || M))` and a server-aided key derived from RFC 9497 P256-SHA256 VOPRF output. Encrypt file bytes with AES-CTR under a derived key/counter pair confined to that distinct plaintext value; an exact repeat intentionally reuses the pair and ciphertext. Protect each user's copy of the data key in a separate RFC 5297 AES-SIV capsule bound to the complete data ciphertext and that user's reference. Deduplicate only after exact ciphertext-byte equality, not a storage-index digest alone. Execute an actual low-entropy ciphertext dictionary attack in local mode; then show authenticated, identity-scoped and epoch-bounded VOPRF requests, including a target within the request budget, a target beyond it, another identity, proof tampering and key-server compromise. Keep client, storage, key-server, storage-attacker, authorized-client-attacker and combined-compromise views distinct.

**Required boundaries:** Equality leakage, bounded whole-ciphertext possession, reference authorization and deletion/revocation are separate transitions. A fresh-nonce whole-ciphertext challenge must reject a blob identifier alone and replay, but must not grant another user's reference or be presented as the scalable Merkle/encoding proof-of-ownership construction. Reference deletion removes the shared service blob only after the last reference. Revocation blocks future modeled API/VOPRF operations but cannot retract cached ciphertext, capsules, keys or plaintext. VOPRF key rotation changes future deterministic ciphertext and is not retroactive revocation.

**Scope and limits:** This is a modern DupLESS-shaped teaching adaptation using RFC 9497 VOPRF, not byte-for-byte DupLESS or a claim that the original RSA-OPRF proof transfers to the substitution. An existing OPAQUE OPRF primitive is not a complete DupLESS or proof-of-ownership protocol. Each derived AES-CTR key/counter pair is confined to one distinct plaintext value; repeats of that exact value intentionally reuse the pair and ciphertext, while using the pair across different plaintext values would be unsafe. The co-located browser roles do not provide process isolation, TLS authentication, HSM protection or enforceable production rate limits. Rate limiting delays guesses outside the modeled budget; it does not make low-entropy messages safe or defeat distributed identities. Equality, length, timing and reference information remain visible to the stated storage view.

**Audit references:** [Deduplication of Encrypted Data (original PDF pp. 1589–1593)](https://doi.org/10.1007/978-3-030-71522-9_1463); [Message-Locked Encryption and Secure Deduplication](https://eprint.iacr.org/2012/631.pdf); [DupLESS](https://www.usenix.org/system/files/conference/usenixsecurity13/sec13-paper_bellare.pdf); [RFC 9497 VOPRF](https://www.rfc-editor.org/rfc/rfc9497.html); [RFC 5297 AES-SIV](https://www.rfc-editor.org/rfc/rfc5297.html); [Proofs of Ownership in Remote Storage Systems](https://eprint.iacr.org/2011/207.pdf).

**Pinned baseline:** [Envelope KMS 50fcf5130274](https://github.com/systemslibrarian/crypto-lab-envelope-kms/blob/50fcf5130274de940aba5a3ada405d95243e4fcb/README.md); [OPAQUE Gate 6fffc04fec90](https://github.com/systemslibrarian/crypto-lab-opaque-gate/blob/6fffc04fec90bb396016dfa12f8bd0a9f862823f/README.md).

<a id="a-d-02"></a>

### A-D-02 — Public-key searchable encryption (PEKS)

**Priority:** P1 — next · **Status:** Live · **Workstream:** Encrypted search.

**Target:** Search Vault extension, linked to IBE Gate.

**Existing base:** Search Vault `97d9e0ff6fbb` supplied static single-keyword SSE, HMAC-derived tokens, encrypted postings, count/co-occurrence inference and a separate query-result integrity lesson. Fresh local, remote-branch and deployed-asset reconciliation found no PEKS, public-key search or pairing implementation to duplicate. IBE Gate `7dfebaff27c4` and Pairing Gate `dddce0a39d0d` supplied reviewed Type-3 BLS12-381 and RFC 9380 precedents, but neither supplied this PEKS ciphertext or its role separation. Search Vault exact main `1f0b50595608` now adds the focused PEKS lesson without replacing those existing outcomes.

**Acceptance criteria:**

- [x] A sender constructs searchable ciphertext with only the recipient public key; the recipient issues a trapdoor and the server computes Test.
- [x] Compare the PEKS role separation with existing SSE and execute a bounded keyword dictionary attack against an exposed trapdoor.
- [x] Display keyword-guessing exposure separately from access/search-pattern leakage.

**Next action:** Preserve the delivered source, proof/non-claim boundaries and Hub mapping while the unassigned implementation queue advances to E-K-03.

**Delivered scope:** Search Vault lazily loads real Type-3 BLS12-381 PEKS operations beside its existing SSE lesson. A recipient generates `X = xP2`; a public sender creates fresh randomized keyword tags; the recipient releases a deterministic trapdoor; the server scans tags through public Test; and a bounded attacker generates legitimate new tags to test candidate words against an exposed trapdoor. The learner interface derives the observed matching identifiers and work from each run and keeps active guessing distinct from repeated-trapdoor linkage, access pattern and volume.

**Verification and publication:** [PR #25](https://github.com/systemslibrarian/crypto-lab-search-vault/pull/25) merged at `1f0b50595608`. Exact-main [run 40061206280](https://github.com/systemslibrarian/crypto-lab-search-vault/actions/runs/40061206280) passed all 117 unit tests and 30 browser/accessibility checks and deployed. A fresh exact-main build matched all six served files byte for byte, including the three lazy PEKS chunks, and the public learner experience contains the sender, recipient, server and bounded-attacker roles. The detailed evidence and retained limitations are recorded above.

**Reviewed design, 2026-10-24:** Adapt the Boneh–Di Crescenzo–Ostrovsky–Persiano bilinear construction to the Type-3 pairing `e: G1 × G2 → GT` available for BLS12-381. Hash a normalized keyword to G1 with the RFC 9380 `BLS12381G1_XMD:SHA-256_SSWU_RO_` suite under a PEKS-specific domain separation tag. The recipient samples nonzero `x` and publishes `X = xP2`; a sender with only `X` samples fresh nonzero `r` and emits `A = rP2` plus a domain-separated SHA-256 digest of `e(H1(w), X)^r`; the recipient emits `T_w = xH1(w)`; and the server tests the digest of `e(T_w, A)`. Correctness follows from bilinearity, but an independent fixed-scalar computation and RFC hash-to-curve vector must test it rather than relying only on the implementation's own Test path.

**Required attack and leakage cases:** A bounded attacker given only the public key, a captured trapdoor and candidate words must generate legitimate randomized PEKS tags and invoke public Test, succeeding only when a candidate is present and reporting an incomplete bounded miss otherwise. Keep that active keyword-guessing result separate from deterministic repeated-trapdoor linkage, access pattern (matching opaque record identifiers) and volume. Equal-keyword tags must differ before a query because sender randomness is fresh; once a trapdoor is released, the server can test retained and future tags. Show that any public sender can make a valid tag, so the construction alone provides neither sender authentication nor proof that a tag describes a separately encrypted body.

**Scope and limits:** This is an algebra-preserving Type-3 teaching adaptation, not the original symmetric-pairing instantiation and not a claim that its random-oracle BDH reduction transfers unchanged; the lab supplies executable correctness, not a new asymmetric-pairing proof. PEKS covers keyword tags, not body encryption, tag/body binding, result completeness/freshness, access-pattern hiding or post-quantum security. It must not claim CCA security, exact 128-bit security, anonymous-IBE security or that public-key search hides keyword distributions. The current CFRG draft estimates the BLS12-381 pairing near 126 bits and remains an Internet-Draft.

**Audit references:** [Asymmetric Setting for Searchable Encryption (original PDF pp. 387–391)](https://doi.org/10.1007/978-3-030-71522-9_1482); [Public Key Encryption with Keyword Search](https://web.cs.ucla.edu/~rafail/PUBLIC/61.pdf); [offline keyword-guessing attack](https://doi.org/10.1007/11844662_6); [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380.html); [CFRG pairing-friendly-curves draft](https://datatracker.ietf.org/doc/draft-irtf-cfrg-pairing-friendly-curves/).

**Pinned source:** [Search Vault 1f0b50595608](https://github.com/systemslibrarian/crypto-lab-search-vault/tree/1f0b505956087721c7ec3ec3f1221a2df26ae205); [IBE Gate 7dfebaff27c4](https://github.com/systemslibrarian/crypto-lab-ibe-gate/tree/7dfebaff27c4e20cd278a4d41a95c538e8807d31); [Pairing Gate dddce0a39d0d](https://github.com/systemslibrarian/crypto-lab-pairing-gate/tree/dddce0a39d0dd5f42c771c65392b3b12d45d368e).

<a id="l-r-07"></a>

### L-R-07 — Boolean encrypted search and its changed leakage

**Priority:** P1 — next · **Status:** Live · **Workstream:** Encrypted search.

**Target:** Search Vault extension.

**Existing base at start:** Search Vault `1f0b50595608` was a substantial static single-keyword SSE lab with real encrypted indexes, count/IKK-style leakage attacks, query-result integrity and the separate A-D-02 PEKS lesson, but it still explicitly excluded Boolean/OXT multi-keyword search. ORAM Vault `8a2aa66111da` supplied the related Path ORAM baseline; it was not part of Search Vault and did not by itself hide a searchable-encryption transcript. Search Vault exact main `d904972690e1` now adds the focused Boolean-search lesson without replacing those outcomes.

**Acceptance criteria:**

- [x] Execute a supported Boolean formula through naive independent keyword queries and a selected structured-encryption construction.
- [x] Display the server's exact visible sets, counts and query volume and compare adversary inference between modes.
- [x] Show the additional cost and assumptions of any ORAM-based access-pattern protection.

**Delivered scope:** Search Vault accepts exactly two known distinct keywords joined by `AND`, rejects every unsupported grammar before either comparison server receives a byte, and selects the lower-frequency s-term with an ASCII tie break. It executes two actual isolated SSE searches and one bounded OXT route, derives every displayed token/list/count/point/match from those runs, persists repeat evidence, and keeps the OXT observations out of the single-keyword IKK input. Five fresh-server controls separate repeated stags from conditional candidate-point equality. The derived Path ORAM table accounts for reads, writes and dummy fetches while retaining the separate non-colluding storage-server assumption.

**Verification and publication:** [PR #26](https://github.com/systemslibrarian/crypto-lab-search-vault/pull/26) merged at `d904972690e1`. Exact-main [run 40088072088](https://github.com/systemslibrarian/crypto-lab-search-vault/actions/runs/40088072088) passed all 180 unit tests and 37 hosted Chromium learner-claim/accessibility checks with zero dependency vulnerabilities and deployed. All six served files matched the reviewed production build byte for byte, and the public learner bundle contains the two-term grammar, exact TSet/XSet trace, five controls, ORAM arithmetic and active-server limitations. Detailed hashes and retained limits are recorded above.

**Reviewed design, 2026-10-24:** Support only `Keyword AND Keyword` over the fixed normalized corpus vocabulary. Reject duplicate terms, `OR`, `NOT`, parentheses and three-or-more-term input. The trusted client chooses the lower-frequency term as the OXT s-term from its private frequency table, with a stable lexicographic tie break, so operand order does not change the result. Compare this path with two actual existing SSE searches performed in fresh isolated state and intersected by the client.

Use the OXT core equations over the standalone prime-order ristretto255 group already available through `@noble/curves`. Domain-separated keyed functions derive nonzero scalars. XSet stores exact, canonically encoded points `[F_X(w) F_I(id)]B`. For the s-term posting at position `c`, TSet stores an encrypted identifier and `y = F_I(id) / F_Z(s || c) mod l`; the query sends the deterministic s-term lookup token and `[F_Z(s || c) F_X(x)]B`; the server multiplies that point by `y` and performs an exact XSet membership check. Cryptographically shuffle the TSet tuples and sort the exact XSet representation for history-independent membership. Do not substitute a Bloom filter or claim false-positive-free results from a probabilistic set representation. Independently pin the client/server algebra to RFC 9496 group encodings and verify all 91 two-keyword pairs against plaintext intersections.

**Required leakage and negative cases:** The naïve baseline exposes both deterministic token-equality patterns, both complete per-term result sets and counts, return volume and final grouping. The OXT path exposes repeated s-term lookup, the selected s-list size, final result/access pattern and conditional cross-term relationships while avoiding disclosure of the entire x-term posting list. The concrete `breach AND audit` and `subpoena AND audit` traces must derive their shared test points from the current corpus; a same-x/disjoint-s trace must show zero repeats while explicitly warning that zero repeats does not prove different x-terms, and a different-x/overlapping-s trace must remain a negative control. Do not feed these partial OXT observations into the existing IKK attack, whose input requires complete single-keyword access sets.

**Bounded ORAM comparison:** For the 24-document teaching store, derive the Path ORAM illustration from `Z = 4` and tree depth `L = 5`: six buckets per path produce 24 encrypted block reads plus 24 writes, or 48 transfers per logical fetch. Padding to the corpus-wide maximum two-keyword intersection of three records costs 144 transfers including dummy fetches. This hides final document addresses and fetch volume only within the fixed-size/block bound and only from a separate non-colluding semi-honest storage server. It does not hide the search server's lookup equality, s-list size, result pattern, membership transcript, search volume or timing; client position-map/stash state, recursive position-map cost, stash-overflow risk and active integrity remain explicit.

**Scope and limits:** Existing single-keyword SSE, result-integrity, leakage and PEKS outcomes remain credited. The model is a static database with one trusted owner/client and an honest-but-curious search server. It does not claim dynamic, forward/backward-private, multi-user or collusion security, active completeness/freshness, JavaScript constant-time behavior or transfer of the paper's full formal theorem to the teaching adapter. Do not claim unsupported disjunction, negation or arbitrary formulas from a two-term conjunction implementation. A Type-3 pairing source group is not rejected by a blanket claim that DDH is always easy there; ristretto255 is selected to keep this lesson's prime-order DDH assumption independent of A-D-02's XDH/pairing setting.

**Audit references:** [Private Boolean Queries on Encrypted Data (original PDF pp. 4814–4818)](https://doi.org/10.1007/978-3-030-71522-9_1559); [Highly-Scalable Searchable Symmetric Encryption with Support for Boolean Queries (OXT)](https://iacr.org/archive/crypto2013/80420310/80420310.pdf); [HXT and OXT leakage terminology](https://eprint.iacr.org/2018/1168.pdf); [RFC 9496 ristretto255](https://www.rfc-editor.org/rfc/rfc9496.html); [Path ORAM](https://pages.cs.wisc.edu/~yxy/pubs/PathORam.pdf); [The Fallacy of Composition of Oblivious RAM and Searchable Encryption](https://eprint.iacr.org/2015/668.pdf).

**Pinned delivered source:** [Search Vault d904972690e1](https://github.com/systemslibrarian/crypto-lab-search-vault/tree/d904972690e1514d70d5f36fc25b75840b0e4590); [ORAM Vault baseline 8a2aa66111da](https://github.com/systemslibrarian/crypto-lab-oram-vault/tree/8a2aa66111da27768a42510c02a2391ee409f1e6).

<a id="l-r-04"></a>

### L-R-04 — PIR compressed queries and server-side expansion

**Priority:** P1 — next · **Status:** Live · **Workstream:** Advanced PIR.

**Target:** Shelf Oracle extension.

**Delivered implementation:** Shelf Oracle preserves its real BFV direct one-hot route and adds a bounded four-block compressed route over the same 64 records. The selected block encrypts `16⁻¹ · X^localIndex` and the other three encrypt zero; the server receives all four ciphertexts with no plaintext index or selected-block field, expands all four through the odd automorphisms and binary-gadget key switching, scans all 64 records and returns four fixed response ciphertexts. Direct, expanded and independently built plaintext records must agree byte for byte.

**Acceptance criteria:**

- [x] Retrieve the same record using existing direct one-hot ciphertexts and an actual compressed-query representation.
- [x] Trace server expansion and account for evaluation keys, serialized upload, response bytes, server operations and noise.
- [x] Compute the comparison from the implementation instead of copying SealPIR paper measurements.

**Next action:** Preserve the delivered source pin, exact fixed-shape and assumption boundaries while the unassigned implementation queue advances to E-K-03.

**Scope and limits:** Query compression and sublinear server work are separate claims. This bounded teaching adaptation uses four fixed blocks and four fixed responses at `q = 2^27 - 39` to avoid revealing which 16-record block contains the selection; it does not claim one-ciphertext expansion across all 64 records, SealPIR's multidimensional recursion or sublinear server work. Both routes still execute 64 record products, and the tempting summed response is discarded because its correctness margin is sample-dependent. Publishing key-dependent Galois material adds the stated circular-security assumption, and the SHA-256 record tag detects decoding failure rather than malicious-server dishonesty.

**Audit references:** [PIR with Compressed Queries (original PDF pp. 4502–4509)](https://doi.org/10.1007/978-3-030-71522-9_1792).

**Pinned delivered source:** [Shelf Oracle 4d31c5b3ec5e](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/tree/4d31c5b3ec5e239a170bb4d10c0ba501d95ae7e0).

<a id="l-r-05"></a>

### L-R-05 — Offline/online and stateful PIR

**Priority:** P1 — next · **Status:** Live · **Workstream:** Advanced PIR.

**Target:** Shelf Oracle advanced mode or companion, linked to ORAM Vault.

**Existing base:** Current PIR executes both direct one-hot and compressed-query expansion paths, each with a full 64-record scan and a real cost comparison; ORAM Vault teaches a different model with local position-map/stash state. Oblivious Shelf names offline/online deployment examples, but does not run such a protocol.

**Acceptance criteria:**

- [x] Execute one preprocessing/stateful PIR construction beside the direct scan and separate setup, online work, storage and total amortized cost.
- [x] Exercise hint consumption/refresh, client-state loss and a database update; show their effect on correctness and cost.
- [x] State the construction's lower-bound and trust model and distinguish PIR state from ORAM state.

**Delivered implementation, 2026-10-24:** Shelf Oracle executes a bounded Piano-style parity-and-refresh adaptation over the fixed 64-record, 512-byte public database, split into eight chunks of eight records. The epoch supports at most `floor(sqrt(64) ln(64)) = 33` committed requests; its 256 primary hints follow the pinned authors' client parameter calculation at this scale rather than the smaller tutorial parameters. The implementation preserves valid `replacement = target` and duplicate replacement cases, keeps cached answers separate from consumed targets, consumes state after a sent request even when its response is malformed, and sends the same eight-index request and 512-byte response shape for cache covers and local preflight failures. The conservative primary-hint availability bound for the whole distinct-target epoch is `33 · (7/8)^249 ≈ 2^-42.92` under the stated independence and target-choice assumptions; this is neither a 128-bit claim nor a transferred Piano correctness theorem.

State loss requires fresh client setup. This bounded construction treats any database update as invalidating parities, replacement copies and caches, then demonstrates full rebuild; it does not implement Piano's separate hierarchical dynamic extension. Record hashes detect accidental decoding mismatch but do not authenticate answers or establish freshness: an old database and its old hashes remain internally consistent. The live path uses private entropy; deterministic setup is test-only and explicitly privacy-void. Displayed costs are derived from serialized requests, responses, retained buffers and executed contribution counters rather than copied benchmarks.

**Next action:** Preserve the delivered source pin, state-machine and assumption boundaries while the unassigned implementation queue advances to E-K-03.

**Scope and limits:** This fixed teaching adaptation does not transfer Piano's theorem, reference wire format, benchmark, dynamic extension or asymptotic storage guarantees. Server `ProcessDB` is identity/none; client setup and retained state pay the preprocessing cost. State loss and any database update require a full rebuild. Hashes do not provide malicious-server integrity or authenticated freshness, and the implementation supplies no availability, hardened storage, crash consistency, traffic hiding, timing protection, multi-client sharing or ORAM guarantee. The displayed crossover is a wire comparison against repeated full download, not a universal speedup.

**Audit references:** [Piano: Extremely Simple, Single-Server PIR with Sublinear Server Computation (ePrint 2023/452)](https://eprint.iacr.org/2023/452); [pinned authors' implementation](https://github.com/wuwuz/Piano-PIR-new/tree/f7107cfadc15a0ac3df20f0bc64f126bf359b702); [Single-Server Private Information Retrieval with Sublinear Amortized Time (ePrint 2022/081)](https://eprint.iacr.org/2022/081); [Private Information Retrieval with Preprocessing (original PDF pp. 4826–4832)](https://doi.org/10.1007/978-3-030-71522-9_1470); [Private Stateful Information Retrieval (original PDF pp. 4840–4845)](https://doi.org/10.1007/978-3-030-71522-9_1466).

**Pinned delivered source:** [Shelf Oracle d08691c9e17a](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/tree/d08691c9e17aaf624781adb127ac4a161f993690); [ORAM Vault 8a2aa66111da](https://github.com/systemslibrarian/crypto-lab-oram-vault/blob/8a2aa66111da27768a42510c02a2391ee409f1e6/README.md).

<a id="l-r-09"></a>

### L-R-09 — Query-result correctness, completeness and freshness

**Priority:** P1 — next · **Status:** Live · **Workstream:** Query integrity.

**Target:** Search Vault extension.

**Existing base:** Search Vault authenticates each returned posting with AES-GCM and address-associated data. Merkle Proofs/Vault teach inclusion, tampering and append-only consistency. ORAM Vault explicitly describes malicious-server/freshness limits in prose.

**Acceptance criteria:**

- [x] Let a server omit a genuine match, fabricate a row and return an old snapshot; distinguish row authentication from completeness and freshness.
- [x] Verify one query type against an independently expected root/version, including boundary or completeness evidence.
- [x] If a sentinel/twin comparison is included, compute its detection probability separately from deterministic proof checking. No probabilistic sentinel/twin mechanism was added; the delivered check is deterministic for the retained snapshot metadata.

**Delivered implementation:** Search Vault now retains, client-side, a snapshot id, expected result count and SHA-256 digest of the complete ordered encrypted answer for each indexed token. The normal `SearchServer` remains honest-but-curious; the learner integrity exercise alters only a copied reply to produce four explicit cases: honest current answer, omission of one authentic posting, one fabricated posting, and an older-snapshot replay. The omission and stale cases demonstrate the intended distinction: returned records can still authenticate individually while the answer as a whole fails completeness or freshness.

**Verification:** [PR #24](https://github.com/systemslibrarian/crypto-lab-search-vault/pull/24) merged as [`97d9e0ff6fbb`](https://github.com/systemslibrarian/crypto-lab-search-vault/tree/97d9e0ff6fbbcd8d5e526b83497fe7a911fbab26). The PR gate [run 39982380580](https://github.com/systemslibrarian/crypto-lab-search-vault/actions/runs/39982380580) passed 87 unit tests, TypeScript/production build, Chromium functional claims and axe WCAG A/AA checks. The post-merge [run 39982763839](https://github.com/systemslibrarian/crypto-lab-search-vault/actions/runs/39982763839) repeated the full gate and deployed successfully. The Playwright dependency step uses the runner's official Ubuntu HTTPS fallback mirror after the Azure HTTP mirror stalled; no browser dependency or test gate was removed.

**Scope and limits:** This is a static teaching checkpoint, not a general verifiable-SSE construction. It assumes the client retained a trusted current snapshot reference and exact expected-answer commitment. A server-supplied hash by itself still cannot prove completeness or freshness.

**Audit references:** [Query Integrity (original PDF pp. 5034–5037)](https://doi.org/10.1007/978-3-030-71522-9_1818); [Probabilistic Query Integrity (original PDF pp. 4863–4868)](https://doi.org/10.1007/978-3-030-71522-9_1819).

**Pinned delivered source:** [Search Vault 1f0b50595608](https://github.com/systemslibrarian/crypto-lab-search-vault/tree/1f0b505956087721c7ec3ec3f1221a2df26ae205); [Merkle Proofs bc58ccd5b628](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/tree/bc58ccd5b628403e8c5002df74fa304b0ce16021); [Merkle Vault 60c4a0f7a952](https://github.com/systemslibrarian/crypto-lab-merkle-vault/tree/60c4a0f7a952f75a119fc6243d8970b6ddecbf18).

<a id="a-d-03"></a>

### A-D-03 — Hide the access policy, not only the ABE plaintext

**Priority:** P1 — next · **Status:** Live · **Workstream:** Advanced ABE.

**Target:** Attribute Gate advanced extension.

**Existing base before delivery:** Attribute Gate had real FAME ABE, policy trees/MSPs, threshold reconstruction, key issuance and a collusion experiment. Its Envelope explicitly included public policy, expression and MSP fields; the learner saw the policy builder.

**Acceptance criteria:**

- [x] Compare equal-length encrypted records with different sensitive policy values and identify the metadata visible to the observer.
- [x] Execute a specified policy-hiding construction and distinguish hidden attribute values from visible names and structure.
- [x] Demonstrate authorized decryption while displaying the unauthorized observer's remaining leakage.

**Delivered implementation, 2026-10-24:** A separately mounted lesson executes Figure 5's CP-ABE equations with §3.3's partially hidden CP-A2BE payload over Type-3 BLS12-381. It compares two equal-length records under policies with the same public names, matrix, row map, structure and dimensions but different hidden values. The ciphertext policy payload retains `M`, `pi` and names; the displayed ciphertext and public key expose group encodings, dimensions and serialized lengths; the presented key exposes its names; and the interface derives candidate count from that selected policy and key. KeyGen binds values through domain-separated `H0`/`H1` encodings; Decrypt enumerates only valid public-name reconstructions, evaluates the paper's four pairing terms for each candidate and uses AES-GCM tag acceptance to recognize a recovered random target-group element without receiving expected plaintext.

**Verification:** [PR #12](https://github.com/systemslibrarian/crypto-lab-attribute-gate/pull/12) merged as [`a4cd1973f99b`](https://github.com/systemslibrarian/crypto-lab-attribute-gate/tree/a4cd1973f99b925863b7f83260851ca439edfd81). The [PR gate](https://github.com/systemslibrarian/crypto-lab-attribute-gate/actions/runs/40109066723) passed 162 unit tests, the production build, 30 Chromium claim tests and three accessibility/reflow drives; the [exact-main deployment](https://github.com/systemslibrarian/crypto-lab-attribute-gate/actions/runs/40109374693) also passed. Two targeted source mutations were killed by their owning cryptographic and bound assertions. Served HTML, JavaScript and CSS matched a fresh exact-main production build byte for byte.

**Next action:** Preserve the delivered source pin, hidden/public boundary and theorem/non-claim wording while the unassigned implementation queue advances to E-K-03.

**Scope and limits:** Removing a policy tree from the UI does not hide it cryptographically; the existing FAME route remains labeled as public-policy ABE. FABESA hides values, not names, structure, dimensions or lengths. The implemented profile permits one value per public attribute name and no repeated names in a policy; §3.4's multi-use extension is not implemented. The 16-row/column, ten-matched-row and 32-candidate limits are teaching bounds, sequential trials leak their count, and the AES-GCM recognition wrapper does not inherit the paper's adaptive-anonymity theorem, supply sender provenance or establish CCA/production security. Paper-faithful scalar sampling retains the disclosed negligible zero-scalar degeneracies.

**Audit references:** [FABESA (ePrint 2024/986)](https://eprint.iacr.org/2024/986); [Attribute Based Encryption with Access Policy Hiding (original PDF pp. 432–436)](https://doi.org/10.1007/978-3-030-71522-9_1461).

**Pinned delivered source:** [Attribute Gate a4cd1973f99b](https://github.com/systemslibrarian/crypto-lab-attribute-gate/tree/a4cd1973f99b925863b7f83260851ca439edfd81).

<a id="l-r-03"></a>

### L-R-03 — Independent ABE authorities and working revocation

**Priority:** P1 — next · **Status:** Live · **Workstream:** Advanced ABE.

**Target:** Attribute Gate advanced extension or companion.

**Existing base before delivery:** Attribute Gate exact main `a4cd1973f99b` executed single-authority FAME, threshold policy reconstruction, a same-authority collusion failure, authority escrow and an explicit no-revocation demonstration. Its separate FABESA lesson hid policy values but did not add independent issuers or revocation.

**Acceptance criteria:**

- [x] Issue independently controlled attributes from two authorities; allow same-user combination and test rejection of pooled attributes belonging to different users.
- [x] Compromise one issuer and show which policies still depend on the other.
- [x] Implement a separate epoch/update revocation mechanism and expose retained old-key/ciphertext access, update costs and escrow.

**Delivered implementation, 2026-10-24:** Exhibit 10 implements asymmetric RW15 decentralized multi-authority CP-ABE over Type-3 BLS12-381. Hospital and Board generate unrelated authority secrets and issue namespace-qualified components bound through `H(GID)` to one canonical byte string. Same-GID components open a two-authority `AND`; the strongest raw cross-GID pool selects both rows but leaves uncancelled GID terms, recovers the wrong target-group element and fails the record tag. Exposing Hospital's authority secret permits arbitrary Hospital attributes and a Hospital-only branch but does not manufacture Board's component. The compiler also executes the paper's repeated-attribute shape without inventing one-use suffixes.

Exhibit 11 is deliberately separate: a bounded application layer around single-authority FAME encrypts the payload once under a fresh DEK, wraps access under `business policy AND Access epoch N`, reissues a complete freshly randomized key for the next epoch, withholds it from a revoked holder and lets an escrowed owner recover and rewrap the DEK for selected records. It demonstrates retained old-key/old-header access, rollback acceptance without trusted current state, rollback rejection against a checkpoint binding object/epoch/revision/full-header digest, byte-identical payload preservation, owner and FAME-authority escrow and a measured operation/byte ledger.

**Verification:** [PR #13](https://github.com/systemslibrarian/crypto-lab-attribute-gate/pull/13) merged as [`ab293fd0386f`](https://github.com/systemslibrarian/crypto-lab-attribute-gate/tree/ab293fd0386fac2a4e89cede2b414056df3188eb). [PR run 40116256609](https://github.com/systemslibrarian/crypto-lab-attribute-gate/actions/runs/40116256609) and [exact-main build/deployment run 40116671435](https://github.com/systemslibrarian/crypto-lab-attribute-gate/actions/runs/40116671435) passed 226 unit tests, the production build, 36 Chromium learner-claim tests and three complete accessibility/reflow drives. Three L-R-03-specific source mutations were killed. Served HTML, JavaScript and CSS matched a fresh merged-tree production build byte for byte, and the live page contains the intended RW15 outcomes, epoch lifecycle and limitation panels.

**Next action:** Preserve the exact scheme/adaptation separation, source pin and visible limitations while the unassigned implementation queue advances to E-K-03.

**Scope and limits:** RW15's static random-oracle `q`-DPBDHE2 theorem and the page's narrower exposed-authority-secret exercise do not establish rogue-key, adaptive-corruption, directory, CCA, policy-privacy, sender-authentication, side-channel or production security. Every issuer must authenticate the subject and use the same canonical GID; the cryptography does not prove civil identity. Independent issuers do not solve revocation. The epoch lesson is not RW15, revocable ABE, revocable-storage ABE or self-updatable encryption; it assumes trusted issuer state and key delivery, performs owner-assisted per-record header replacement, cannot retract saved keys/ciphertexts/plaintext, and detects rollback only against separately trusted current state. It provides no public update token, server-only update, bulk-revocation guarantee or combined theorem.

**Audit references:** [Multi-authority and Decentralized Attribute-Based Encryption (original PDF pp. 3945–3950)](https://doi.org/10.1007/978-3-030-71522-9_1458); [RW15 paper](https://y.rouselakis.com/papers/2015-016.pdf); [authors' asymmetric Charm implementation](https://jhuisi.github.io/charm/_modules/abenc_maabe_rw15.html); [revocable-storage ABE](https://eprint.iacr.org/2012/437); [self-updatable encryption](https://eprint.iacr.org/2013/762).

**Pinned delivered source:** [Attribute Gate ab293fd0386f](https://github.com/systemslibrarian/crypto-lab-attribute-gate/tree/ab293fd0386fac2a4e89cede2b414056df3188eb).

<a id="e-k-02"></a>

### E-K-02 — Executable HIBE delegation and subtree compromise

**Priority:** P1 — next · **Status:** Live · **Workstream:** Identity-based alternatives.

**Target:** IBE Gate extension.

**Existing base before delivery:** IBE Gate performed BasicIdent Setup/Extract/Encrypt/Decrypt and showed master-key escrow and time-bearing identities. Its HIBE mitigation was explanatory text. Attribute Gate computes FAME ciphertext policies and user-key collusion resistance.

**Acceptance criteria:**

- [x] A parent secret key derives an actual descendant key without asking the root to extract it.
- [x] Encrypt to several identity vectors and compute child, sibling and ancestor authorization results.
- [x] Compromise one delegated node and show its affected subtree while retaining the root-escrow boundary.

**Delivered implementation:** IBE Gate implements a bounded Type-3 asymmetric-pairing HIBE adaptation of Ramanna, Chatterjee and Sarkar's Appendix G construction. A root-extracted key delegates recursively through a three-level identity without receiving the master secret; fresh and delegated keys for the same target both decrypt. A too-shallow ancestor is rejected structurally, while a same-depth sibling executes the pairing algebra and recovers the wrong GT secret and plaintext. The learner exercise compromises one delegated node, demonstrates access down that prefix but not across a sibling boundary, and separately shows that the root PKG can still freshly extract every branch.

**Verification:** [PR #24](https://github.com/systemslibrarian/crypto-lab-ibe-gate/pull/24) merged as [`7dfebaff27c4`](https://github.com/systemslibrarian/crypto-lab-ibe-gate/tree/7dfebaff27c4e20cd278a4d41a95c538e8807d31). The post-merge [run 40001216587](https://github.com/systemslibrarian/crypto-lab-ibe-gate/actions/runs/40001216587) passed 35 unit tests and all 17 production-browser checks, including the HIBE claim plus desktop/mobile WCAG checks, then deployed successfully. A fresh build at the merge commit matched the served JavaScript (`assets/index-os7Emwkk.js`, SHA-256 `ea6c558fab56250225d215a9b26e3e0d19a6d8ad714c589f1d8329a3e60e1ffe`) and CSS (`assets/index-D3xblc7f.css`, SHA-256 `d7803b289a905a1f24adc4280c4ae9d1aa7469b5551daade035dc2090104633b`) byte-for-byte. The live bundle contains the descendant-success, sibling-failure and retained-PKG-escrow learner results.

**Scope and limits:** The paper encrypts a GT element directly; the lab uses its encapsulation/delegation algebra with a fixed 32-byte XOR KEM/DEM teaching adaptation and does not claim the paper's full proof for that adaptation. The learner exercise is bounded to depth three. BasicIdent over slash-separated strings and a KMS key hierarchy still do not implement HIBE delegation, and delegation reduces routine root issuance without removing root escrow.

**Audit references:** [Hierarchical Identity-Based Encryption and Attribute-Based Encryption (original PDF pp. 2810–2815)](https://doi.org/10.1007/978-3-030-71522-9_1457); [Ramanna, Chatterjee and Sarkar, *Variants of Waters' Dual-System Primitives Using Asymmetric Pairings*, ePrint 2012/024](https://eprint.iacr.org/2012/024).

**Pinned delivered source:** [IBE Gate 7dfebaff27c4](https://github.com/systemslibrarian/crypto-lab-ibe-gate/tree/7dfebaff27c4e20cd278a4d41a95c538e8807d31); [Attribute Gate d0bb24262e9b](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d0bb24262e9b2b6e47044ef49e5941bdb332e17c/README.md).

<a id="s04"></a>

### S04 — Compose secure aggregation with differential privacy

**Priority:** P1 — next · **Status:** Live · **Workstream:** Private aggregation and DP.

**Target:** Cross-lab extension using Proof Tally/Silent Tally and DP Noise.

**Existing base:** Proof Tally and Silent Tally compute private aggregates; Proof Tally explicitly adds no DP. DP Noise runs privacy mechanisms/accounting separately. SPDZ models malicious-party computation.

**Acceptance criteria:**

- [x] Demonstrate disclosure from an exact secure aggregate, then compute a release with calibrated jointly generated noise.
- [x] Declare clipping, adjacency, sensitivity, distribution and accounting, and vary corrupt or dropped participants.
- [x] Compare central, local and distributed/shuffled trust assumptions and show precisely when the stated guarantee no longer applies.

**Reviewed design, 2026-10-24:** Preserve draft-22 Prio3 unchanged and add a separate application composition over one committed cohort of at most twelve slots. Clamp each salary to `[0, $250,000]`, floor it to `$5,000` units before aggregation and use fixed-size replace-one adjacency, giving `q in [0, 50]` and sensitivity `Delta = 50` units. An honest client independently activates with exact probability `9/10`; on activation it uses the exact integer-only Canonne–Kamath–Steinke algorithms to sample `Lap_Z(50)`. At least six included honest clients make the exact no-honest-activation event `(1/10)^6 = 10^-6`; this is a tighter, explicitly labeled Shi-inspired teaching calibration rather than Shi et al.'s stated beta rule or PSA theorem.

Allow `|Y| = 4096` and abort the whole batch without release when `|Y| > 4096`. The exact per-active-draw tail is `2 exp(-4096/50) / (exp(1/50) + 1)`, and the conservative twelve-client union bound is `3.143493953710e-35`; generic total-variation coupling adds at most `(1 + exp(1))` times that bound, or `1.168839644595e-34`, to delta. Encode the bounded contribution as `q + Y + 4096 in [0, 8242]`, prove that range with real `Prio3Sum(8242)`, require every committed report to arrive and prepare successfully, then subtract the cohort offset with ordinary signed integer arithmetic. Even for twelve maximum contributions, `98,904` is far below the Field64 modulus, so no modular wrap is permitted or silently decoded.

The exact-disclosure control uses two equal-size twelve-slot real-Prio3 queries and replaces Lane's bounded slot with zero; it does not change cohort cardinality. The collector API exposes only one noisy aggregate. Per-client values, activation and noise remain an explicitly omniscient learner trace; Prio3 proves only the combined shifted range, not truth, clipping, decomposition or honest randomness. The combined claim separately requires a non-colluding aggregator, six eligible honest noise contributors using independent CSPRNG coins, atomic complete delivery, no later noise disclosure and one accounted release. Corrupt clients can choose valid false values or fixed noise and destroy utility; pre-report dropout requires a newly committed cohort, while mid-report dropout, a duplicate, rejection or cap overflow aborts with no output. Shuffle DP remains comparison-only because no unlinkable shuffler is implemented.

**Delivered implementation:** Proof Tally keeps its original Prio3 route and vectors unchanged, and adds a separate fourth tab. The disclosure control executes two equal-size twelve-slot Prio3Sum queries and subtracts the zero-replaced result. The bounded release route constructs each shifted contribution with the declared clamp, floor quantization, independently activated exact discrete-Laplace sampler and output cap; every committed report must reach both aggregators and prepare successfully before one collector-visible noisy sum can be released. Below-threshold, all-corrupt, colluding, partial-delivery, cap-overflow and repeated-release scenarios release no aggregate. The UI keeps the collector view, scenario accounting and explicitly omniscient per-client trace separate.

**Verification:** [Proof Tally PR #19](https://github.com/systemslibrarian/crypto-lab-proof-tally/pull/19) merged as [`f1220e93baa5`](https://github.com/systemslibrarian/crypto-lab-proof-tally/tree/f1220e93baa5a5cf549915a1d8a6104748e56303). The final pre-merge [run 40125465557](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40125465557) passed 151 unit tests, all 33 hosted Chromium claim/accessibility/reflow tests, 73 registry tests and 27 verdict tests. [Mutation run 40123033025](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40123033025) established a green 27-spec baseline and killed all 64 recorded mutations. Exact-main [run 40125573428](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40125573428) repeated the complete gate and deployed successfully. The public HTML, JavaScript and CSS matched a fresh exact-main build byte for byte and retained the reviewed learner outcomes and limitations.

**Next action:** Preserve the delivered sampler, fixed-cohort, refusal-state, collector-view and production-boundary claims while the unassigned implementation queue advances to E-K-03.

**Scope and limits:** Secret sharing and arbitrary summed party noise do not themselves establish differential privacy. This is an executable bounded teaching composition, not the Shi private-stream-aggregation system, DAP, a production sampler or a proof that clients generated noise honestly.

**Audit references:** [Secure Computation of Differentially Private Mechanisms (original PDF pp. 5492–5499)](https://doi.org/10.1007/978-3-030-71522-9_1714); [Shi et al., *Privacy-Preserving Aggregation of Time-Series Data*](https://www.ndss-symposium.org/wp-content/uploads/2017/09/shi.pdf); [Canonne, Kamath and Steinke, *The Discrete Gaussian for Differential Privacy*](https://arxiv.org/abs/2004.00010) (Algorithms 1 and 2 supply the exact Bernoulli and discrete-Laplace sampler); [VDAF draft-22](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-vdaf-22) (IRTF Internet-Draft, work in progress); [NIST SP 800-226 final](https://doi.org/10.6028/NIST.SP.800-226).

**Pinned delivered source:** [Proof Tally f1220e93baa5](https://github.com/systemslibrarian/crypto-lab-proof-tally/tree/f1220e93baa5a5cf549915a1d8a6104748e56303); supporting baselines [DP Noise ea6eac3e9fc1](https://github.com/systemslibrarian/crypto-lab-dp-noise/tree/ea6eac3e9fc145c9f3306d4f6610b0662f8a794f), [SPDZ Forge d5d8b60211fa](https://github.com/systemslibrarian/crypto-lab-spdz-forge/tree/d5d8b60211fa4842cd83ebab27699a9b097a9b10) and [Silent Tally 108c5da4c880](https://github.com/systemslibrarian/crypto-lab-silent-tally/tree/108c5da4c880472187ee14dc093b952429ea5af8).

<a id="s02"></a>

### S02 — Key-evolving audit logs after compromise

**Priority:** P1 — next · **Status:** Live · **Workstream:** Durable cryptographic evidence.

**Target:** Envelope KMS extension linked to Merkle Proofs, Key Mirror and Stream Ward.

**Existing base:** Envelope KMS has a real SHA-256 linked audit log. Merkle Proofs already runs rewrite/delete/reorder checks against trusted roots; Key Mirror adds retained anchors, signed heads and gossip. Stream Ward teaches final-marker truncation.

**Acceptance criteria:**

- [x] Compromise the current logging key at a chosen event and compare ordinary keyed logging with a specified forward-secure authenticator.
- [x] Attempt earlier and later record rewrites and compute which records remain protected under the key-evolution and erasure assumptions.
- [x] Compose with retained checkpoints and truncation controls, making forward integrity, append-only consistency and freshness separate results.

**Next action:** Preserve the exact source pin and the integrity/checkpoint/completeness/freshness boundaries while the unassigned implementation queue advances to E-K-03.

**Scope and limits:** The delivered HMAC-SHA-256 construction is a bounded, single-logger/private-verifier teaching adaptation, not the full Schneier–Kelsey protocol, Bellare–Yee's exact construction, a standardized wire format or a security proof. Symmetric verifier state can forge; JavaScript cannot guarantee erasure; messages remain plaintext; compromise exposes the selected period and future; and the retained linear checkpoint does not by itself establish completeness, freshness, availability, global consistency or split-view resistance.

**Audit references:** [Secure Audit Logs (original PDF pp. 5482–5486)](https://doi.org/10.1007/978-3-030-71522-9_688).

**Pinned delivered source and comparison baselines:** [Envelope KMS d2b6614a9fad](https://github.com/systemslibrarian/crypto-lab-envelope-kms/tree/d2b6614a9fad2fe9667b05d35e3a1e6895ad3293); [Merkle Proofs bc58ccd5b628](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/tree/bc58ccd5b628403e8c5002df74fa304b0ce16021); [Key Mirror 605ac80779c6](https://github.com/systemslibrarian/crypto-lab-key-mirror/tree/605ac80779c6821afb42da5db651d4f72c1ed553); [Stream Ward 6109350d814f](https://github.com/systemslibrarian/crypto-lab-stream-ward/tree/6109350d814ff614012a32c1d745c8f275fddae8).

## Phase 3 — Protocols and arithmetic

Add the remaining P1 mechanisms with explicit protocol, adversary and arithmetic boundaries.

<a id="a-d-04"></a>

### A-D-04 — Dining-cryptographers anonymous broadcast

**Priority:** P1 — next · **Status:** Live · **Workstream:** Anonymous communication.

**Target:** New focused DC-net lab.

**Existing base:** Sphinx Mix executes packet construction/peeling and traffic-model anonymity; Blind Relay splits source identity and HTTP content across operators. Silent Tally privately aggregates Shamir-shared counts.

**Acceptance criteria:**

- [x] Compute pairwise fresh masks, participant broadcasts and their cancellation to reveal one anonymous sender's message.
- [x] Compare each participant's and a coalition's possible-sender views under the declared key graph.
- [x] Exercise simultaneous senders, malformed contributions and mask reuse, with synchrony and disruption assumptions visible.

**Delivered implementation:** The focused five-participant cycle computes one public contribution from each input and its two incident masks, then verifies cancellation against the input XOR. External, participant and coalition views remove exactly the masks each observer knows, derive the remaining connected components and component XORs, exhaust all one-bit mask assignments for compatible exactly-one-sender hypotheses and preserve supplied priors. Separate executed cases distinguish collision parity from sender count, malformed input from a correctly shaped jammer, current-round dropout from a newly formed graph, complete incident-mask reuse from a distinct deterministic control, and later mask disclosure. The SHA-256 collect-all-then-reveal route is a separately labeled bounded adaptation rather than an accountability construction.

**Verification:** [DC-net PR #1](https://github.com/systemslibrarian/crypto-lab-dc-net/pull/1) merged as exact main [`8de5cb25042c`](https://github.com/systemslibrarian/crypto-lab-dc-net/tree/8de5cb25042cc70b991fe53211d85e3324bc9684). Final-head [run 40172921197](https://github.com/systemslibrarian/crypto-lab-dc-net/actions/runs/40172921197) passed the full static, 44-unit, 11-claim and 12-accessibility/reflow gate, reported zero audited dependency vulnerabilities and printed `baseline: unmutated copy PASSES` followed by `all 22 mutation(s) caught`; final-head [CodeQL run 40172921166](https://github.com/systemslibrarian/crypto-lab-dc-net/actions/runs/40172921166) passed after all seven review findings were corrected and resolved. Exact-main [run 40173229231](https://github.com/systemslibrarian/crypto-lab-dc-net/actions/runs/40173229231) repeated the complete gate, retained mutation artifact `12590874229`, uploaded Pages artifact `12591490147` and deployed; exact-main [CodeQL run 40173229219](https://github.com/systemslibrarian/crypto-lab-dc-net/actions/runs/40173229219) passed. Coverage is 98.83% statements, 97.52% branches, 100% functions and 98.77% lines. The public 390-pixel learner view returned HTTP 200, exposed all seven lesson sections and the two initially visible round-action buttons without horizontal overflow. Served `index.html` (6,680 bytes, SHA-256 `7d1dd6a9f60b4695ffd67e67b8a5a65c5dcb01e8b27924de41691cf6b1dd14f0`), `assets/index-DP2EGcYv.js` (78,840 bytes, SHA-256 `3641b640864e235b77c0a4b5481b7e740de07f4a639cc794d2c5fc2f0d4f8260`) and `assets/index-qb-UxXWT.css` (11,269 bytes, SHA-256 `518648a04b2f83b2eed5450d4415b861a55ca51cdca4a20ffe158be5d94f84b0`) matched the exact-main build byte for byte.

**Next action:** Preserve the delivered graph, observer, parity, disruption, commitment and one-use-mask boundaries while the separate L-R-01 worker finishes Clock Arithmetic and the unassigned queue advances to E-K-03.

**Scope and limits:** The information-theoretic result assumes the declared graph, independent uniformly random secret one-use masks, synchrony and the stated observer knowledge. WebCrypto supplies concrete CSPRNG-backed masks, not proof of the ideal theorem. The message remains public; component parity is not a sender count; the SHA-256 commitment assumes collision and second-preimage resistance and claims no formal hiding, equation compliance, identity, availability, blame or Dissent/Verdict accountability. All roles share one browser origin, JavaScript cannot prove erasure, and the lab supplies no production membership, Sybil defense, transport privacy or hardened operational controls.

**Audit references:** [Dining Cryptographers (DC) Network (original PDF pp. 1747–1751)](https://doi.org/10.1007/978-3-030-71522-9_194); [Chaum, *The Dining Cryptographers Problem*](https://doi.org/10.1007/BF00206326); [Dissent](https://bford.info/pub/net/dissent-abs/); [Verdict](https://www.usenix.org/conference/usenixsecurity13/technical-sessions/presentation/corrigan-gibbs); [FIPS 180-4](https://doi.org/10.6028/NIST.FIPS.180-4).

**Pinned delivered source and comparison baselines:** [DC-net 8de5cb25042c](https://github.com/systemslibrarian/crypto-lab-dc-net/tree/8de5cb25042cc70b991fe53211d85e3324bc9684); [Sphinx Mix 51c0b320ba40](https://github.com/systemslibrarian/crypto-lab-sphinx-mix/blob/51c0b320ba40cc97236a5d3ddd0e6e5840491917/README.md); [Blind Relay b3732c88b2d4](https://github.com/systemslibrarian/crypto-lab-blind-relay/blob/b3732c88b2d4ba4e3b94c8f949cb5f4243b17c8b/README.md); [Silent Tally 108c5da4c880](https://github.com/systemslibrarian/crypto-lab-silent-tally/blob/108c5da4c880472187ee14dc093b952429ea5af8/README.md).

<a id="l-r-01"></a>

### L-R-01 — Montgomery modular multiplication and reduction

**Priority:** P1 — next · **Status:** Planned · **Workstream:** Arithmetic implementation.

**Target:** Clock Arithmetic extension or focused arithmetic companion.

**Existing base:** Clock Arithmetic computes modular wraparound, inverses, order, subgroups and CRT. Timing Oracle names the Montgomery ladder in an exponentiation timing lesson.

**Acceptance criteria:**

- Compute ordinary and Montgomery multiplication on identical odd moduli and expose cancellation, radix shift and final subtraction.
- Convert into the representation, chain products/squares and convert out; measure setup and repeated-operation cost separately.
- Reject invalid modulus/radix combinations and label any fixed-work comparison according to the implementation actually executed.

**Next action:** Design small worked REDC examples with independent arithmetic checks and choose whether they fit Clock Arithmetic.

**Scope and limits:** The Montgomery ladder is a different lesson; JavaScript timing is not a constant-time security proof.

**Audit references:** [Montgomery Arithmetic (original PDF pp. 3921–3930)](https://doi.org/10.1007/978-3-030-71522-9_38).

**Pinned baseline:** [Clock Arithmetic ba94fa18e427](https://github.com/systemslibrarian/crypto-lab-clock-arithmetic/blob/ba94fa18e4272db71173984a2e2fe00d5818cf91/README.md); [Timing Oracle b206d1b9265d](https://github.com/systemslibrarian/crypto-lab-timing-oracle/tree/b206d1b9265d9400c8a1d9546b0a58460e1d79d2).

<a id="e-k-03"></a>

### E-K-03 — IPsec/IKE security associations and protected packet flow

**Priority:** P1 — next · **Status:** Planned · **Workstream:** IPsec and IKE.

**Target:** New focused IPsec/IKE lab, linked from Noise Pipe.

**Existing base:** Noise Pipe computes Noise handshakes/AEAD transport and maps IKpsk2 onto WireGuard packets. TLS/SSH labs cover other channel protocols. These are strong secure-channel coverage but do not model IPsec.

**Acceptance criteria:**

- Apply an ordered Security Policy Database to concrete flows with `DISCARD`, `BYPASS` and `PROTECT` outcomes; keep that policy decision distinct from routing, and show the negotiated traffic-selector subset that becomes the Child SA policy.
- Execute the four-message IKEv2 setup with a real Curve25519/X25519 shared secret, `SKEYSEED`, `prf+`, encrypted IKE_AUTH and preshared-key AUTH computations. Mask X25519's final-byte most-significant bit and accept non-canonical values as RFC 8031 requires; test an optional, locally declared all-zero-result refusal separately. Establish the first Child SA inside IKE_AUTH, omit its KE transform, and independently reject a changed identity, transcript or AUTH value rather than inserting an extra CREATE_CHILD_SA exchange.
- Derive the initial Child-SA `KEYMAT = prf+(SK_d, Ni | Nr)` from the IKE_SA_INIT nonces, without adding the X25519 secret again, and install the negotiation's two simplex ESP SAs with a distinct inbound SPI chosen by each receiving endpoint, separate AES keys/salts, outbound sequence counters and inbound replay windows. Make the initiator-to-responder-first KEYMAT ordering testable.
- Protect and open actual ESP packets with AES-GCM-16/128. Display the clear SPI, sequence number and explicit IV; the SPI/sequence AAD; the encrypted payload, padding, pad length and next-header fields; the 16-octet tag; and the different outer/inner packet boundaries in transport and tunnel mode.
- Perform inbound SAD lookup before a non-mutating replay precheck, authenticate before committing replay-window state, and execute valid reordering, duplicate replay, too-old, modified-ahead-of-window and unknown-SPI cases from the real 64-packet window.
- Rekey to fresh SPIs, keys, salts, counters and replay windows; exercise old/new overlap, old-SA retirement, a packet labeled with the new SPI but sealed under the old key, and sequence restart. For each negotiated transform-0 SA, initialize the sender counter at zero, transmit one as the first sequence number, and replace the SA before 32-bit wrap. Refuse any repeated nonce under one AES-GCM key.
- Cover transport-mode acceptance, responder fallback to tunnel mode and initiator deletion when that fallback violates local policy; do not label transport mode established unless the responder echoes `USE_TRANSPORT_MODE`.
- Independently cross-check the published X25519 vector, fixed IKE transcript and AUTH/key derivation, and exact ESP packet bytes. Add negative and mutation tests for identity/transcript binding, directional KEYMAT order, IKE-versus-ESP AAD, integrity-before-window-update ordering, mode negotiation and rekey-state separation; every mutation must be caught from a passing baseline.

**Bounded teaching profile:** Use IPv4 TEST-NET fixtures, IKEv2 `Shared Key Message Integrity Code` authentication method 2, Curve25519 Key Exchange Method 31 with X25519 computation, `PRF_HMAC_SHA2_256` transform 5, and `ENCR_AES_GCM_16` Transform ID 20 with Key Length attribute 128 for the IKE SA. Use the same encryption transform and key-length attribute plus Sequence Numbers transform 0 (`32-bit Sequential Numbers`) for ESP, omit the INTEG transform from both AEAD proposals, use a 16-octet tag and maintain a 64-packet receiver window. Transform ID 20 selects the 16-octet ICV variant; the separate Key Length attribute selects AES-128. For IKE key derivation, treat `SK_ai` and `SK_ar` as zero octets and derive `SK_ei` and `SK_er` as 20 octets each: 16-octet AES key followed by four-octet salt. Combine each IKE salt with a unique eight-octet explicit IV per direction and key. IKE encrypted-payload AAD runs from the IKE header through the Encrypted payload header as RFC 5282 specifies; it is not ESP AAD. For each directional ESP SA, consume 20 KEYMAT octets as a 16-octet AES key plus four-octet salt, combine that salt with a unique eight-octet explicit IV, and authenticate the four-octet SPI plus four-octet sequence number as AAD. Tunnel mode is the default; transport mode exists only after the request/echo negotiation above. Learner runs require fresh IKE nonces and ephemeral X25519 keys; deterministic randomness is allowed only through an explicit test seam. These choices bound the lesson rather than claim a deployment mandate: RFC 8247 does not list method 31, so its registered-but-unlisted requirement level defaults to MAY-implement.

**Next action:** Once `crypto-lab-ipsec-ike` exists, refresh its default branch and implement this profile without changing the proposal's Planned status until executable behavior, independent tests, hosted checks, merge, deployment and the public learner experience are verified.

**Scope and limits:** This is a bounded protocol-state and packet-cryptography lesson, not an interoperable VPN daemon. Exclude certificates, EAP, IPv6, NAT traversal, fragmentation, MOBIKE, multiple proposals or key exchanges, AH, multicast, traffic-flow confidentiality padding, extended sequence numbers, kernel routing and production credential storage. A demo may make RFC 7748's optional all-zero shared-secret check a local fail-closed rule, but must not present it as an RFC 8031 MUST. Interpret RFC 8031's published X25519 vectors using its little-endian encoding; erratum 6339's substitute vectors are Rejected, while erratum 6931 is Held for Document Update and asks for clearer encoded-input wording. Algorithm requirement levels describe implementation support, not a universal instruction to deploy that algorithm. Any sequence-derived explicit-IV construction is a declared demo choice whose obligation is uniqueness under one key, not an IKEv2-negotiated IV algorithm. Anti-replay enablement is receiver policy even though transform 0 supplies suitable non-wrapping sequence numbers. Keep policy/routing, peer authentication, IKE-SA protection, Child-SA key derivation, ESP processing and replay state as separately testable claims.

**Audit references:** [IPsec (original PDF pp. 3260–3268)](https://doi.org/10.1007/978-3-030-71522-9_269); [RFC 4301 IPsec architecture](https://www.rfc-editor.org/rfc/rfc4301.html); [RFC 7296 IKEv2](https://www.rfc-editor.org/rfc/rfc7296.html); [RFC 4303 ESP](https://www.rfc-editor.org/rfc/rfc4303.html); [RFC 4106 AES-GCM-ESP](https://www.rfc-editor.org/rfc/rfc4106.html); [RFC 5282 AEAD for IKEv2](https://www.rfc-editor.org/rfc/rfc5282.html); [RFC 7748 X25519/X448](https://www.rfc-editor.org/rfc/rfc7748.html); [RFC 8031 X25519/X448 for IKEv2](https://www.rfc-editor.org/rfc/rfc8031.html); [RFC 8031 erratum 6339 — Rejected](https://www.rfc-editor.org/errata/eid6339); [RFC 8031 erratum 6931 — Held for Document Update](https://www.rfc-editor.org/errata/eid6931); [RFC 8221 ESP/AH algorithm requirements](https://www.rfc-editor.org/rfc/rfc8221.html); [RFC 8247 IKEv2 algorithm guidance](https://www.rfc-editor.org/rfc/rfc8247.html); [RFC 9395 IKEv1 and obsolete-algorithm deprecation update](https://www.rfc-editor.org/rfc/rfc9395.html); [RFC 9370 current Key Exchange Method terminology](https://www.rfc-editor.org/rfc/rfc9370.html); [RFC 9827 current Sequence Numbers terminology](https://www.rfc-editor.org/rfc/rfc9827.html); [IANA IKEv2 parameters](https://www.iana.org/assignments/ikev2-parameters/ikev2-parameters.xhtml).

**Pinned baseline:** [Noise Pipe 689e2b07a366](https://github.com/systemslibrarian/crypto-lab-noise-pipe/blob/689e2b07a3662d0ae9c49594f3372ee7c7987768/README.md#L28).

Implementation correction: [RFC 7296 §1.2](https://www.rfc-editor.org/rfc/rfc7296.html#section-1.2) establishes the first Child SA during IKE_AUTH; do not reproduce the encyclopedia’s extra CREATE_CHILD_SA exchange for that initial SA.

<a id="s01"></a>

### S01 — Signcryption: insider security and transferable evidence

**Priority:** P1 — next · **Status:** Live · **Workstream:** Public-key composition.

**Target:** HPKE Envelope extension, with Protocol Compose and Iron Letter retained as companion comparisons.

**Existing base before delivery:** Protocol Compose ran MAC/encryption composition and an ECIES + Ed25519 composition exhibit; Iron Letter ran ECIES and identity-key MITM defenses. HPKE Envelope executed Auth modes and context binding and described recipient-key KCI, but did not execute that forgery or a transferable-signature comparison.

**Acceptance criteria:**

- [x] Execute one named signcryption construction beside the existing HPKE Auth baseline with both participant identities and application context bound.
- [x] Compromise a sender or recipient and compute the selected construction's insider/outsider confidentiality and authenticity outcomes.
- [x] Forward a valid object to a third party and distinguish transferable evidence from recipient-only authentication.

**Delivered implementation:** HPKE Envelope now executes the RFC 9180 §9.1.1 Auth recipient-key KCI forgery from recipient `skR` and public sender `pkS` without sender `skS`. Beside it, a versioned An–Dodis–Rabin-style multi-user Sign-then-Encrypt teaching profile uses separate X25519 and Ed25519 keys, signs a domain-separated length-framed tuple of sender, intended recipient, application context and message, and separately binds the same outer identities and context in Base HPKE `info` and AAD. Receiver APIs require independently expected context and pinned identity-to-key records. Nine learner cases execute honest delivery, outsider tampering, recipient compromise, sender signing-key compromise, combined compromise, forwarding, public signature evidence and replay; rejected plaintext and evidence remain quarantined.

**Verification:** [HPKE Envelope PR #31](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/pull/31) merged as exact main [`fcf3b56c06e1`](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/tree/fcf3b56c06e1ef16b10b0db8e1b7fec60d295de8). Final-head [run 40178893409](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/actions/runs/40178893409) and exact-main/deployment [run 40179028196](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/actions/runs/40179028196) each passed typechecking, 258 unit tests, a passing unmutated baseline with all 19 security mutations caught, production build and all 27 Chromium functional/accessibility tests. The exact-main run deployed. Public `index.html` (7,519 bytes, SHA-256 `a785fd3b7550a5726ece908de1d807561425af8b535406af91ffd21913eca27b`), `assets/index-BP0y25b8.js` (109,616 bytes, SHA-256 `97a532ad90961e3091803d611ca6bed6fb96b9e45d011e76506d0b7e6be01b94`) and `assets/index-CObJQuzx.css` (11,037 bytes, SHA-256 `bb8e0776ad10b8d2f1549de903f0fd7f7e4240c654c87b290d07c43298fad7e3`) matched a fresh exact-main build byte for byte; the served bundle contains the nine-case completion, current HPKE-draft status, replay result and non-standardized-wire-format boundary.

**Next action:** Preserve the exact KCI, independent-context, pinned-key, plaintext-quarantine and evidence boundaries while the queue advances to S06 or, while its focused repository is absent, A-D-05.

**Scope and limits:** The StE packet is a fixed teaching profile, not a standardized signcryption wire format or production protocol, and no claim is made that the generic paper's proof automatically transfers to this implementation. Recipient-key compromise exposes ciphertexts to that recipient but does not create a new valid sender signature while Ed25519 remains safe; sender-signing-key compromise permits new signed forgeries but does not by itself open recorded Base-HPKE ciphertexts. Public evidence shows only that a separately pinned key signed the exact disclosed fields. It does not prove ciphertext authorship, transmission, receipt, time, human intent or legal non-repudiation. A recipient can re-encrypt an unchanged valid signed payload, and the profile supplies no message identifier or replay cache. Public verifiability is not a property of every signcryption scheme.

**Audit references:** [Signcryption (original PDF pp. 5952–5963)](https://doi.org/10.1007/978-3-030-71522-9_156); [An, Dodis and Rabin, *On the Security of Joint Signature and Encryption*](https://eprint.iacr.org/2002/046); [RFC 9180](https://www.rfc-editor.org/rfc/rfc9180.html); [RFC 8032](https://www.rfc-editor.org/rfc/rfc8032.html); [active HPKE working-group Internet-Draft](https://datatracker.ietf.org/doc/draft-ietf-hpke-hpke/).

**Pinned delivered source and comparison baselines:** [HPKE Envelope fcf3b56c06e1](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/tree/fcf3b56c06e1ef16b10b0db8e1b7fec60d295de8); [Protocol Compose 5dd48e8f4abf](https://github.com/systemslibrarian/crypto-lab-protocol-compose/tree/5dd48e8f4abf8d222985d1578da699c61c07b0ee); [Iron Letter e5326a46e859](https://github.com/systemslibrarian/crypto-lab-iron-letter/tree/e5326a46e85923e95083baffbad57c9d68af3b16).

<a id="s06"></a>

### S06 — Distance bounding and relay attacks

**Priority:** P1 — next · **Status:** Planned · **Workstream:** Device pairing and proximity.

**Target:** New focused proximity protocol model.

**Existing base:** Existing labs authenticate keys and model time/freshness; these do not establish physical proximity.

**Acceptance criteria:**

- Authenticate an exchange successfully through a relay, then add a modeled unpredictable rapid-bit phase.
- Vary propagation delay, processing delay, pre-guessing and tolerated errors and derive the resulting bound and failure cases.
- Separate relay/mafia fraud from dishonest-prover distance fraud in the chosen protocol.

**Next action:** Select a distance-bounding protocol and specify the simulated timing and adversary models.

**Scope and limits:** Browser wall-clock measurements cannot substantiate nanosecond radio distance or physical proximity.

**Audit references:** [Security of Distance Bounding Protocols (original PDF pp. 5725–5727)](https://doi.org/10.1007/978-3-030-71522-9_62).

**Pinned baseline:** [X3DH Wire 2d2d5b13bcb1](https://github.com/systemslibrarian/crypto-lab-x3dh-wire/tree/2d2d5b13bcb115b43a76feb4470a5ea1770bba62); [Time Trust 1578c9763ac5](https://github.com/systemslibrarian/crypto-lab-time-trust/tree/1578c9763ac5aa15a343ee97a75be29eaddf2d79).

## Phase 4 — Construction and cryptanalysis depth

Build P2 lessons on existing mechanisms. Classical faulty-output DFA precedes ineffective-fault work; existing Trivium and Matsui extensions remain credited.

<a id="a-d-06"></a>

### A-D-06 — Classic block-cipher differential fault recovery

**Priority:** P2 — depth · **Status:** Live · **Workstream:** Fault analysis.

**Target:** AES Anatomy extension.

**Existing base before delivery:** AES Anatomy exposed full AES-128/192/256 states and intentional layer-removal attacks. Biham Lens supplies differential cryptanalysis; Lattice Fault executes different fault mechanisms against lattice signatures. The prior AES Anatomy README and catalog listed seven acts and no correct/faulty-output DFA.

**Acceptance criteria:**

- [x] Inject a declared transient byte/round fault into otherwise correct AES and produce both correct and faulty ciphertexts.
- [x] Derive and filter last-round-key candidates using only the permitted observations and verify them on held-out encryptions.
- [x] Exercise recomputation/output checking and a changed fault model, with unsuccessful recovery reported accurately.

**Delivered implementation:** Act 8 injects a known-location, unknown nonzero byte fault after ShiftRows and before MixColumns in AES-128 round 9. It runs the existing AES implementation to produce correct and faulty ciphertexts, then tests round-10 key-byte candidates with `InvSbox(C xor k) xor InvSbox(C_faulty xor k)` against the fault propagated by the appropriate MixColumns coefficient. A second faulty output intersects each quartet's candidate set to one, the exercise reconstructs the full round-10 key, reverses the AES-128 key schedule and verifies the recovered master key on a held-out plaintext. A real fault injected in a different row but analyzed with the original coefficients yields zero survivors rather than a false recovery. Clean recomputation detects the one-sided modeled fault, while two executions with the same modeled common-mode fault compare equal; the page explicitly declines to present that check as a universal defense.

**Verification:** [PR #3](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/pull/3) merged as [`fffbc96eddeb`](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/tree/fffbc96eddebefe2e45bce51890a35d0297570c1). The [pre-merge run 40007330722](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/actions/runs/40007330722) and [post-merge/deployment run 40008442510](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/actions/runs/40008442510) passed 39 unit tests, all 20 production-browser/accessibility checks and all 36 mutation cases. A separate 20-sample random-key/plaintext probe uniquely recovered every quartet within two faults. A fresh build matched the served `index.html` (SHA-256 `9e2f0bf6a97775b9a91a4570e86ee532730875cc3a67a2fbe57d61e2874b9533`), JavaScript (`assets/index-Gz0zo22g.js`, SHA-256 `e77e9df93837e96f1b21f214418c76b0475a9b445b7d96d99a5d13c39f552c70`) and CSS (`assets/index-DUU5TLjf.css`, SHA-256 `0c3b57dde8fb700160bd9270b385133a681a09a4eeff07184bcad9520a67d087`) byte-for-byte.

**Scope and limits:** The fault is a logical browser-state model at a known round/byte location, not a physical injection demonstration. The lesson is AES-128 and does not generalize its recovery count to every implementation or fault distribution. Layer removal is not DFA; RSA-CRT absence was not established and is not added as an accepted gap. The learner UI states the fault boundaries but leaves the full paper attribution in the README.

**Audit references:** [Differential Fault Analysis (original PDF pp. 1676–1682)](https://doi.org/10.1007/978-3-030-71522-9_1707); [Dusart, Letourneux and Vivolo, *Differential Fault Analysis on A.E.S.*, ePrint 2003/010](https://eprint.iacr.org/2003/010).

**Pinned delivered source:** [AES Anatomy fffbc96eddeb](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/tree/fffbc96eddebefe2e45bce51890a35d0297570c1); [Biham Lens 864ee0572f3e](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/864ee0572f3e90496a240347a6094580a88a6318/README.md); [Lattice Fault 27a332b8d838](https://github.com/systemslibrarian/crypto-lab-lattice-fault/blob/27a332b8d83845632a09046dd76c51343fb20514/README.md).

<a id="e-k-06"></a>

### E-K-06 — Ineffective faults and leakage from accepted outputs

**Priority:** P2 — depth · **Status:** Live · **Workstream:** Fault analysis.

**Target:** AES Anatomy follow-on, linked to Lattice Fault and Masked Core.

**Existing base:** A-D-06 now provides the classical faulty-ciphertext AES baseline in AES Anatomy. Lattice Fault already executes/simulates specified rejection-check and loop-abort faults, models timing/power leakage and states the limited protection of final verification. Masked Core and Ciphertext Mirror provide additional masking and detection context.

**Acceptance criteria:**

- [x] Apply a specified fault to a secret-dependent intermediate and retain only outputs classified as unchanged.
- [x] Recover a bit or rank candidates from accepted-output selection, then expose a distinct statistical-bias experiment if claiming SIFA.
- [x] Compare reject-on-detection and one scoped infective defense, including a fault model where the protection fails.

**Delivered implementation:** Act 9 clears a selected bit of state byte 0 immediately after first-round SubBytes, continues the existing real AES-128 implementation and compares the correct and fault-path ciphertexts exactly. Its seeded finite-sample experiment draws plaintext bytes and landing events, then gives the ranker only the inputs observable under the selected output policy and the target bit; it does not give the ranker the victim key, internal state or individual fault labels. A separate 2,048-row analytic census derives the declared six-of-eight population and is explicitly not sampled evidence. The secret-independent bit-flip control removes key-dependent selection. Reject-on-detection exposes absence; the deterministic teaching infection returns an output for every attempt and removes this ranker's selection signal when no classifier exists, while granting an exact clean ciphertext for the same plaintext restores the equality classifier and demonstrates the bounded protection's failure case.

**Verification:** [PR #4](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/pull/4) merged as [`1f0f6b86a2dd`](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/tree/1f0f6b86a2dd5b631df13377b5e1a205e712a502). The [pre-merge run 40040111072](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/actions/runs/40040111072) and exact-main [post-merge/deployment run 40041039537](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/actions/runs/40041039537) passed 51 unit tests, all 21 production-browser/accessibility checks and all 44 mutation cases. The independent audit checked that finite samples execute the real fault path and equality classifier, that the ranker and null do not receive the secret, that the analytic census is labeled separately, and that infection/reference cases execute their claimed boundaries. A fresh exact-main build matched the served `index.html` (SHA-256 `13b8421118e1f55e03aaa0921069db5a07b52bb8b21f7ba9095f58dc05062cb4`), JavaScript (`assets/index-CWXSlZHY.js`, SHA-256 `156e93eafc66c5fdff4719176182aa3c702132d35cf1e81994c5a89c7334e040`), CSS (`assets/index-DsfsZ8HC.css`, SHA-256 `bf0f46a5df84323fa0119d3920a2937f657e4212a154696059b889aacf40e2ce`) and worker (`assets/attack.worker-BuntoPYK.js`, SHA-256 `fc863e3b4488665e75a3f8d82f052592d843a229fe986447b47ede91c3eaa6ae`) byte-for-byte.

**Scope and limits:** This is a chosen-input, one-byte logical teaching model with a declared profiled landing rate, not physical injection or a full multi-byte AES SIFA reproduction. The deterministic infection is not timing- or latency-oblivious, hardened, universal or the circuit defense analyzed by Daemen et al.; output-value, timing, common-mode, multi-fault and physical-oracle attacks remain outside the result. The exact-reference failure case deliberately grants an oracle the unprotected scheme would not normally provide.

**Audit references:** [Clavier, *Secret External Encodings Do Not Prevent Transient Fault Analysis*](https://doi.org/10.1007/978-3-540-74735-2_13); [Dobraunig et al., *SIFA: Exploiting Ineffective Fault Inductions on Symmetric Cryptography*, ePrint 2018/071](https://eprint.iacr.org/2018/071); [Daemen et al., *Protecting against Statistical Ineffective Fault Attacks*, ePrint 2019/536](https://eprint.iacr.org/2019/536).

**Pinned delivered source:** [AES Anatomy 1f0f6b86a2dd](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/tree/1f0f6b86a2dd5b631df13377b5e1a205e712a502); [Lattice Fault 27a332b8d838](https://github.com/systemslibrarian/crypto-lab-lattice-fault/blob/27a332b8d83845632a09046dd76c51343fb20514/README.md#L25).

<a id="a-d-05"></a>

### A-D-05 — Boolean combiner design: resiliency and algebraic immunity

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Symmetric cryptanalysis.

**Target:** LFSR Forge combiner-design extension.

**Existing base:** LFSR Forge demonstrates Geffe correlation recovery. Matsui Line measures linear approximations, and current AES Anatomy exhaustively computes S-box DDT/LAT properties. These are substantial Boolean/S-box foundations.

**Acceptance criteria:**

- Edit a small Boolean truth table and compute balance, ANF degree and the full Walsh spectrum.
- Fix subsets of inputs and compute correlation immunity/resiliency; search the declared bounded annihilator space.
- Provide counterexamples showing that one favorable metric does not certify an entire stream cipher.

**Next action:** Choose a three-to-five-variable bound and independently check the transforms and annihilator search.

**Scope and limits:** Exhaustive toy-function measurements do not show that high algebraic immunity prevents every fast algebraic attack.

**Audit references:** [Algebraic Immunity of Boolean Functions (original PDF pp. 257–261)](https://doi.org/10.1007/978-3-030-71522-9_333); [Correlation Immune and Resilient Boolean Functions (original PDF pp. 1200–1204)](https://doi.org/10.1007/978-3-030-71522-9_340).

**Pinned baseline:** [LFSR Forge 2800c76acf9d](https://github.com/systemslibrarian/crypto-lab-lfsr-forge/blob/2800c76acf9ddc7bd79210327372b95b64d444e6/README.md); [Matsui Line e004db682cee](https://github.com/systemslibrarian/crypto-lab-matsui-line/blob/e004db682cee90b73afd5f7c75f42a7cc20ce96a/README.md); [AES Anatomy 254a8069f781](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/blob/254a8069f7811e6b766199ef97f46c0c56a91c85/README.md).

<a id="a-d-11"></a>

### A-D-11 — Execute a cube sum and recover a superpoly

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Symmetric cryptanalysis.

**Target:** LFSR Forge Trivium companion section.

**Existing base:** The current pinned LFSR Forge already has a wired sixth Trivium panel: real state clocking, 1,152 initialization steps, BM/forecast comparisons and a deliberately broken zero-initialization linear recovery. The panel explicitly says it executes only the zero-round linear attack, not a cube attack.

**Acceptance criteria:**

- Evaluate every assignment of a public-input cube and display monomial cancellation in a tiny Boolean oracle.
- Recover and validate a candidate superpoly and include a cube that fails the required property.
- Use independent valid equations to recover a toy secret and verify it with held-out observations.

**Next action:** Build the explicit toy-oracle exercise before considering a separately labeled reduced-round Trivium variant.

**Scope and limits:** Full Trivium and its zero-round linear recovery already exist. Cube execution is additional depth and does not imply a full Trivium break.

**Audit references:** [Cube Attack (original PDF pp. 1297–1301)](https://doi.org/10.1007/978-3-030-71522-9_342).

**Pinned baseline:** [LFSR Forge 2800c76acf9d](https://github.com/systemslibrarian/crypto-lab-lfsr-forge/blob/2800c76acf9ddc7bd79210327372b95b64d444e6/src/main.ts#L291-L292).

<a id="a-d-12"></a>

### A-D-12 — A5/1 and irregular clocking

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Stream cipher design.

**Target:** LFSR Forge extension.

**Existing base:** LFSR Forge teaches regular LFSRs, Geffe combination/correlation and current Trivium. Air Stream implements SNOW 3G, AES-CTR and ZUC cellular families. These are substantive stream-cipher activities.

**Acceptance criteria:**

- Predict and execute majority/clock-controlled register advances and compare them with regular clocking.
- Implement a separately labeled historical A5/1 mode with correct key/frame initialization and register distinctions.
- Run a bounded known-state or guessing experiment and expose the assumptions changed by irregular stepping.

**Next action:** Pin the historical A5/1 definition and build the clock-control mechanism before the complete initialization walkthrough.

**Scope and limits:** Irregular clocking is not a security proof and A5/1 is not a modern Air Stream primitive.

**Audit references:** [A5/1 (original PDF pp. 111–114)](https://doi.org/10.1007/978-3-030-71522-9_332); [Clock-Controlled Generator (original PDF pp. 997–1001)](https://doi.org/10.1007/978-3-030-71522-9_337).

**Pinned baseline:** [LFSR Forge 2800c76acf9d](https://github.com/systemslibrarian/crypto-lab-lfsr-forge/blob/2800c76acf9ddc7bd79210327372b95b64d444e6/src/trivium/panel.ts#L15-L37); [Air Stream 09529a8de623](https://github.com/systemslibrarian/crypto-lab-air-stream/blob/09529a8de623f097d69bd397467acc2a21660a12/README.md).

<a id="a-d-14"></a>

### A-D-14 — Compose differential and linear cryptanalysis

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Symmetric cryptanalysis.

**Target:** Biham Lens or Matsui Line extension.

**Existing base:** Biham Lens executes differential attacks and Matsui Line executes linear attacks. Matsui’s multiple-mask/four-joint-outcome and structural zero-correlation section is already mapped in the refreshed catalog. The remaining work is an executed differential-linear composition on a shared cipher.

**Acceptance criteria:**

- Use one toy cipher to join a selected differential prefix to a linear suffix at an explicit intermediate state.
- Compute the combined statistic over chosen pairs and compare it with its stated heuristic and a failing-assumption control.
- Apply the statistic to bounded subkey ranking and verify the ranked result independently.

**Next action:** Choose the shared cipher and joining state with the Biham Lens/Matsui Line implementations.

**Scope and limits:** Matsui's two-mask and structural-zero section is already mapped; this adds differential-linear composition, not another multi-mask display.

**Audit references:** [Differential–Linear Attack (original PDF pp. 1698–1699)](https://doi.org/10.1007/978-3-030-71522-9_573).

**Pinned baseline:** [Biham Lens 864ee0572f3e](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/864ee0572f3e90496a240347a6094580a88a6318/README.md); [Matsui Line e004db682cee](https://github.com/systemslibrarian/crypto-lab-matsui-line/blob/e004db682cee90b73afd5f7c75f42a7cc20ce96a/src/main.ts#L50).

<a id="e-k-04"></a>

### E-K-04 — Hard-core predicates and Goldreich–Levin

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Security games.

**Target:** Hidden Bit extension linked to ElGamal Plain.

**Existing base:** Hidden Bit already executes IND-CPA/CCA/signature games, the PRP/PRF switching experiment, a GGM tree, a live DDH reduction and a newer multi-key rare-signal game. ElGamal Plain now computes a public quadratic-character leakage experiment.

**Acceptance criteria:**

- Execute a guided sequence of adjacent hybrids that names each exact rewrite, assumption-based replacement and bounded bad event, then derives the displayed cumulative advantage rather than jumping from endpoints.
- Show an exposed/easily predicted input predicate under a separately stated one-wayness assumption.
- Compute the random inner-product construction for (f(x), r) and display the biased-predictor reconstruction argument.
- Distinguish finite enumeration from the asymptotic theorem and state the security-parameter assumptions.

**Next action:** Design the reusable guided-hybrid scaffold, easy-predicate counterexample and bounded Goldreich–Levin reconstruction illustration.

**Scope and limits:** Hidden Bit already teaches GGM, DDH reductions and security games; a small-domain experiment cannot demonstrate computational hardness.

**Audit references:** [Hard-Core Bit (original PDF pp. 2700–2702)](https://doi.org/10.1007/978-3-030-71522-9_412); [The Joy of Cryptography §2.4, adjacent hybrids and the three-hop maneuver](https://joyofcryptography.com/provsec/#sec.prove).

**Pinned baseline:** [Hidden Bit e3d4a8ddcda3](https://github.com/systemslibrarian/crypto-lab-hidden-bit/blob/e3d4a8ddcda3c03b9e901ecfd2dc7071745b5ad9/README.md#L20); [ElGamal Plain 251bf90ef747](https://github.com/systemslibrarian/crypto-lab-elgamal-plain/blob/251bf90ef747f256d0e18f0fe987eadafa3f06da/src/qrGame.ts).

<a id="s09"></a>

### S09 — Target collision resistance as an order-of-play game

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Security games.

**Target:** Hidden Bit extension linked to Hash Zoo.

**Existing base:** Hash labs teach preimage/second-preimage/collision resistance; Hidden Bit teaches game order and security reductions.

**Acceptance criteria:**

- Run one small keyed-hash family under target-before-key and collision-after-key challenge orders.
- Enforce legal adversary moves in each game and demonstrate a strategy whose legality or success changes with the order.
- Explain the signed (key, hash) pair and target-collision statement without extrapolating toy collision counts to real hashes.

**Next action:** Choose a small family with a clear separating strategy and specify both game state machines.

**Scope and limits:** Target collision resistance is not established by empirical collision counts. Reuse E-K-04's guided-proof interaction vocabulary where it fits, but a generic hybrid scaffold does not satisfy this proposal's challenge-order state machine or separating strategy.

**Audit references:** [Universal One-Way Hash Functions (UOWHF) (original PDF pp. 6634–6637)](https://doi.org/10.1007/978-3-030-71522-9_624).

**Pinned baseline:** [Hidden Bit e3d4a8ddcda3](https://github.com/systemslibrarian/crypto-lab-hidden-bit/tree/e3d4a8ddcda3c03b9e901ecfd2dc7071745b5ad9); [Hash Zoo e86dac25e78b](https://github.com/systemslibrarian/crypto-lab-hash-zoo/tree/e86dac25e78bc6876e9fd644d1c6a0b823e06039).

<a id="a-d-09"></a>

### A-D-09 — Noninteractive designated-verifier proofs

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Proof verification models.

**Target:** Signature Gate extension linked to ZK Proof Lab.

**Existing base:** Signature Gate executes an interactive commit/challenge/response OR exchange for a signer or designated confirmer, and demonstrates how a preselected-challenge recording can be simulated. Its proof/research limits are explicit.

**Acceptance criteria:**

- Compute a properly specified OR proof using either the real statement witness or the designated verifier's secret.
- Allow both prover and verifier to create accepting proofs and show what an external observer cannot establish about their origin.
- Compare with a public transferable proof and the existing interactive confirmer exchange.

**Next action:** Select the proof construction and review Fiat–Shamir transcript binding and model before implementation.

**Scope and limits:** Hashing the existing interactive exchange does not automatically produce a sound noninteractive designated-verifier protocol.

**Audit references:** [Designated Verifier Proofs (original PDF pp. 1624–1625)](https://doi.org/10.1007/978-3-030-71522-9_4).

**Pinned baseline:** [Signature Gate 4cf5a00f4fd1](https://github.com/systemslibrarian/crypto-lab-confirmer-signatures/blob/4cf5a00f4fd11eb1dd3a343930859813f6e8da5d/research/real-pairing/app.mjs#L99-L147); [ZK Proof Lab 9af5d31e20b0](https://github.com/systemslibrarian/crypto-lab-zk-proof-lab/blob/9af5d31e20b0559999611e6536c767da7b890a70/README.md).

<a id="e-k-09"></a>

### E-K-09 — Knapsack trapdoors and the limits of worst-case hardness

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Historical trapdoors.

**Target:** LLL Break extension.

**Existing base:** LLL Break already steps genuine small LLL/BKZ and attacks toy LWE embeddings; GGH Trapdoor is another lattice example. The current LLL README mentions knapsack among applications but does not execute its cryptosystem.

**Acceptance criteria:**

- Generate a toy superincreasing Merkle–Hellman key, encrypt message bits and decrypt with the trapdoor.
- Build a low-density subset-sum lattice, invoke the existing LLL engine and validate recovered bits against the public sum.
- Vary density and show failure cases while distinguishing plaintext recovery from trapdoor reconstruction.

**Next action:** Implement small transparent instances and a checked embedding using LLL Break's current engine.

**Scope and limits:** Keep the construction historical and broken; NP-completeness does not prove security of the generated distribution, and this is not Shamir's trapdoor attack.

**Audit references:** [Knapsack Cryptographic Schemes (original PDF pp. 3448–3471)](https://doi.org/10.1007/978-3-030-71522-9_323).

**Pinned baseline:** [LLL Break a7eea56efd93](https://github.com/systemslibrarian/crypto-lab-lll-break/blob/a7eea56efd93cb05bc578fe18512416698366f0d/README.md#L19).

<a id="l-r-02"></a>

### L-R-02 — Parallelizable block-cipher MAC (PMAC)

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** MAC constructions.

**Target:** MAC Race extension.

**Existing base:** MAC Race already executes HMAC, AES-CMAC, GHASH and Poly1305, with CBC-MAC forgery and key-reuse lessons.

**Acceptance criteria:**

- Compute PMAC block offsets, independent cipher calls, combination and final-block handling from a pinned definition.
- Compare dependency work/span with CMAC using the same message and explicitly modeled scheduling.
- Mutate a block, its position and final-block treatment and verify the resulting tags.

**Next action:** Select the exact PMAC variant and independent vectors, then design the PMAC-versus-CMAC dependency view.

**Scope and limits:** A scheduling visualization is not a measured multicore speedup.

**Audit references:** [PMAC (original PDF pp. 4533–4536)](https://doi.org/10.1007/978-3-030-71522-9_603).

**Pinned baseline:** [MAC Race 06b1646ca40d](https://github.com/systemslibrarian/crypto-lab-mac-race/blob/06b1646ca40d49a8805ddee5b2d6d78b17ce8bcd/README.md).

<a id="a-d-13"></a>

### A-D-13 — BBS pseudorandom bits and Blum-Goldwasser rewind

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Number-theoretic generators.

**Target:** Residue Gate extension.

**Existing base:** Residue Gate implements quadratic residues, the Jacobi +1 challenge, Goldwasser-Micali bit encryption and Rabin roots/CCA factor recovery. It does not currently iterate a BBS state to expose output bits or use a final state to recover a Blum-Goldwasser stream.

**Acceptance criteria:**

- Construct toy Blum primes and a valid quadratic-residue seed, then compute repeated squaring and the specified emitted bits.
- Encrypt using the generated stream and transmitted final state, then use the factors to rewind and decrypt.
- Show state-disclosure and ciphertext-tampering consequences and state the valid seed/output-bit assumptions.

**Next action:** Specify the BBS bit extraction and Blum–Goldwasser state indexing and verify small instances independently.

**Scope and limits:** Toy moduli are breakable; this is not BBS credential signing or an authenticated/CCA-secure deployment recommendation.

**Audit references:** [Blum–Blum–Shub Pseudorandom Bit Generator (original PDF pp. 807–809)](https://doi.org/10.1007/978-3-030-71522-9_141); [Blum–Goldwasser Public Key Encryption System (original PDF pp. 810–813)](https://doi.org/10.1007/978-3-030-71522-9_142).

**Pinned baseline:** [Residue Gate d1f1c553da40](https://github.com/systemslibrarian/crypto-lab-residue-gate/blob/d1f1c553da40f36f1f02b57800262271278f441a/README.md); [DRBG Arena 4739c152e1ce](https://github.com/systemslibrarian/crypto-lab-drbg-arena/blob/4739c152e1ce7a143e359dc671663a5fb82e7b4d/README.md).

<a id="a-d-07"></a>

### A-D-07 — Certificateless public keys and the escrow tradeoff

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Identity-based alternatives.

**Target:** IBE Gate extension linked to PKI Chain.

**Existing base:** IBE Gate exposes the PKG master secret and actually derives arbitrary identity keys, making escrow concrete. The suite separately teaches certificate-based public-key trust.

**Acceptance criteria:**

- Compute authority-issued partial keys and user-chosen secret contributions under a named certificateless construction.
- Compare ordinary PKI, IBE and certificateless issuance on one flow and test what the KGC master secret alone reveals.
- Separate permitted public-key replacement from an adversary possessing the KGC master secret.

**Next action:** Select the construction and define Type I and Type II adversary cases precisely.

**Scope and limits:** An ad hoc two-secret composition is not a certificateless security proof and does not remove every authenticated key-distribution requirement.

**Audit references:** [Certificateless Cryptography (original PDF pp. 929–932)](https://doi.org/10.1007/978-3-030-71522-9_314).

**Pinned baseline:** [IBE Gate b249b17c883b](https://github.com/systemslibrarian/crypto-lab-ibe-gate/blob/b249b17c883b4472ca4ef702866fc609d2c7e943/README.md); [PKI Chain 0ee9ca34cecd](https://github.com/systemslibrarian/crypto-lab-pki-chain/blob/0ee9ca34cecdc1d434f013fa07b23865c56c382b/README.md).

<a id="a-d-08"></a>

### A-D-08 — Direct anonymous attestation and controlled linkability

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Anonymous attestation.

**Target:** Attestation Gate advanced extension.

**Existing base:** Attestation Gate computes measured boot and real ECDSA P-256 signatures over quotes, checks freshness/evidence, and shows the importance of the AK/EK trust story and runtime limits. Anonymous credential and ring-signature primitives exist elsewhere.

**Acceptance criteria:**

- Compare a stable attestation-key quote with issuer Join and anonymous membership verification from one named DAA construction.
- Compute same-basename and different-basename signing cases and display intended linkability.
- Change credential/issuer/revocation state and verify acceptance without creating a universal device identifier.

**Next action:** Choose a correct DAA protocol and its revocation model before adapting the current attestation flow.

**Scope and limits:** Generic anonymous credentials or group signatures alone do not implement DAA; anonymous provenance does not prove runtime integrity.

**Audit references:** [Direct Anonymous Attestation (original PDF pp. 1752–1759)](https://doi.org/10.1007/978-3-030-71522-9_1742).

**Pinned baseline:** [Attestation Gate e78e756f4320](https://github.com/systemslibrarian/crypto-lab-attestation-gate/blob/e78e756f43202bf6ab3ea47d2013a9b805f9a07b/src/tpm/key.ts#L33-L39); [Credential Veil f06bbcaefb28](https://github.com/systemslibrarian/crypto-lab-credential-veil/blob/f06bbcaefb287e438d9d626581f417f0d0fc81f0/README.md); [Ring Sign a1a63b52c927](https://github.com/systemslibrarian/crypto-lab-ring-sign/blob/a1a63b52c9274bef08c581abcfbc35f50803d0d4/README.md).

<a id="s11"></a>

### S11 — Executable TPM sealed storage policy

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** TPM policy enforcement.

**Target:** Attestation Gate extension.

**Existing base:** Attestation Gate already explains sealing in its runtime-compromise panel and boot/PCR discussion, in addition to actual PCR/quote models.

**Acceptance criteria:**

- Seal a synthetic secret to a defined PCR policy and compute Unseal acceptance against the measured state.
- Change firmware/extend measurements, observe rejection and execute a separately authorized update/recovery policy.
- Show that runtime compromise after unsealing can still expose the released secret.

**Next action:** Specify the modeled PCR policy transitions and release boundary using Attestation Gate's existing measured-boot state.

**Scope and limits:** Sealing is already explained. The extension supplies an executable policy model, not a real TPM hardware boundary.

**Audit references:** [Sealed Storage (original PDF pp. 5395–5398)](https://doi.org/10.1007/978-3-030-71522-9_494).

**Pinned baseline:** [Attestation Gate e78e756f4320](https://github.com/systemslibrarian/crypto-lab-attestation-gate/tree/e78e756f43202bf6ab3ea47d2013a9b805f9a07b).

<a id="s07"></a>

### S07 — Visual secret sharing

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Secret sharing variants.

**Target:** Shamir Gate companion section or compact visual-sharing lab.

**Existing base:** Shamir Gate provides polynomial threshold sharing, reconstruction, insufficient-share privacy and an encrypted AES vault.

**Acceptance criteria:**

- Generate shares under a specified visual scheme and reconstruct a black/white symbol using Boolean-OR stacking.
- Compute one-share pixel distributions, pixel expansion and the resulting contrast.
- Compare stacking with XOR and polynomial interpolation and reject a visually scrambled-only secrecy claim.

**Next action:** Implement a small two-share basis-matrix scheme with an explicit distribution check.

**Scope and limits:** Visual scrambling alone does not demonstrate perfect secrecy.

**Audit references:** [Visual Secret Sharing Schemes (original PDF pp. 6718–6721)](https://doi.org/10.1007/978-3-030-71522-9_393).

**Pinned baseline:** [Shamir Gate 66874ed10bbc](https://github.com/systemslibrarian/crypto-lab-shamir-gate/tree/66874ed10bbc796b4d81d3e79c23befaf9f395fd).

## Phase 5 — Advanced privacy and optional workshop depth

Deepen query models and network/privacy composition; timestamp renewal and optimistic fair exchange extend workshops that already work.

<a id="a-d-10"></a>

### A-D-10 — Preprocessing and server work in doubly efficient PIR

**Priority:** P2 — depth · **Status:** Live · **Workstream:** Advanced PIR.

**Target:** Shared advanced-PIR project with Shelf Oracle.

**Existing base:** Shelf Oracle now executes both its direct BFV one-hot query and four fixed compressed blocks expanded through Galois key switching. Both routes still touch all 64 records and execute 64 record products, while the learner-visible ledger derives setup, query, response and server-operation costs from actual serialized buffers and executed work. Patron Shield reduces communication, while Split Point supplies a different multi-server/DPF route.

**Acceptance criteria:**

- [x] Account separately for wire bytes, records touched and server operations in the current scan-based baseline.
- [x] Implement or clearly label a specified preprocessing model with ProcessDB cost, storage, client state and online response work.
- [x] Measure total-cost crossover and update overhead across repeated queries in the shared L-R-05 project.

**Delivered sub-scope, 2026-10-24:** The shared implementation compares the existing direct and compressed BFV routes with the bounded Piano-style lesson without merging unlike operations. For the selected construction, server `ProcessDB` is identity/none: the client performs setup by streaming the ordinary database and privately retaining its own hints. The ledger separately derives setup-stream bytes, explicit retained client state, online request/response bytes, records touched, record contributions and refresh/rebuild work. It shows repeated-query amortization, the full-download wire crossover and database-update rebuild cost, but it does not report modeled operation counts as browser timing measurements or transfer Piano's near-optimal-storage theorem to an explicit toy state that can exceed the database size.

**Next action:** Preserve the executed ledger, independent tests and model boundaries while the unassigned implementation queue advances to E-K-03.

**Scope and limits:** Sublinear communication is not sublinear server work; modeled cost curves must not be reported as implementation timings.

**Audit references:** [Piano (ePrint 2023/452)](https://eprint.iacr.org/2023/452); [Doubly Efficient Private Information Retrieval and Fully Homomorphic RAM Computation from Ring LWE (ePrint 2022/1703)](https://eprint.iacr.org/2022/1703); [Doubly Efficient Private Information Retrieval (original PDF pp. 1817–1822)](https://doi.org/10.1007/978-3-030-71522-9_1479).

**Pinned delivered source:** [Shelf Oracle d08691c9e17a](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/tree/d08691c9e17aaf624781adb127ac4a161f993690); [Patron Shield f8a82cf820f7](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/f8a82cf820f7e4d1135fb2fdca214d6b0e553f91/README.md); [Split Point e0b0a2d565e9](https://github.com/systemslibrarian/crypto-lab-split-point/blob/e0b0a2d565e9668af3ad2d9a32889296e4a22dda/README.md).

<a id="l-r-06"></a>

### L-R-06 — PIR that tolerates unavailable or dishonest servers

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Advanced PIR.

**Target:** Oblivious Shelf/Shelf Oracle advanced companion.

**Existing base:** Oblivious Shelf runs two-server XOR PIR and exposes its noncollusion assumption. Shelf Oracle states an honest-but-curious server model and explicitly disclaims malicious-server integrity.

**Acceptance criteria:**

- Independently drop a server, corrupt an answer and collude selected servers.
- Compute reconstruction, fault tolerance and privacy under one specified robust-PIR model.
- Compare replication and communication with the existing two-server baseline and expose exceeded-threshold outcomes.

**Next action:** Select the robust-PIR construction and record its availability, corruption and collusion thresholds.

**Scope and limits:** Privacy, availability and answer authenticity require different checks; a server's own digest is not an integrity proof.

**Audit references:** [Robust Private Information Retrieval (original PDF pp. 5264–5268)](https://doi.org/10.1007/978-3-030-71522-9_1472).

**Pinned baseline:** [Oblivious Shelf 13bf4fd8b0f5](https://github.com/systemslibrarian/crypto-lab-oblivious-shelf/blob/13bf4fd8b0f560b717cbba7d1158e58a247d7339/README.md); [Shelf Oracle 852f23ff8b40](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/852f23ff8b406bd7f98f06cbea34f5cec6cca389/README.md).

<a id="e-k-08"></a>

### E-K-08 — Fuzzy encrypted search and similarity leakage

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Encrypted search.

**Target:** Search Vault extension.

**Existing base:** Search Vault executes single-keyword exact-match SSE after normalization, with token repetition, access/volume leakage and count/IKK recovery. It already gives a meaningful encrypted-search attack lesson.

**Acceptance criteria:**

- Execute exact search beside a labeled edit-neighborhood or LSH-based fuzzy construction.
- Vary similarity threshold and compute storage/query cost and false-positive/false-negative rates.
- Expose server-visible neighbor overlap and a concrete inference unavailable in the exact-match baseline.

**Next action:** Choose the approximate-match definition and write the scheme-specific leakage ledger before implementing search.

**Scope and limits:** Case/whitespace normalization is not fuzzy search, and one leaky construction does not describe every EFSE scheme.

**Audit references:** [Fuzzy Search on Encrypted Data (original PDF pp. 2500–2506)](https://doi.org/10.1007/978-3-030-71522-9_1469).

**Pinned baseline:** [Search Vault 715cec98e0dd](https://github.com/systemslibrarian/crypto-lab-search-vault/blob/715cec98e0dd03344c0fabc1efd71d0103786bd5/README.md#L15).

<a id="l-r-08"></a>

### L-R-08 — Multi-user encrypted search and collusion

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Encrypted search.

**Target:** Search Vault/Rekey Relay bridge.

**Existing base:** Search Vault has owner-generated keys and static keyword index; Rekey Relay already teaches proxy re-encryption/delegation.

**Acceptance criteria:**

- Assign distinct reader/writer search permissions and execute authorized and rejected operations.
- Let a colluding server and reader use a known query to label another user's matching query pattern.
- Compare a single-server and a specified split-trust construction with each party's visible patterns explicit.

**Next action:** Select a multi-user search construction and define roles, key distribution and collusion capabilities.

**Scope and limits:** Proxy re-encryption alone does not supply multi-user searchable encryption.

**Audit references:** [Multi-User Searchable Encryption (original PDF pp. 4025–4029)](https://doi.org/10.1007/978-3-030-71522-9_1476).

**Pinned baseline:** [Search Vault 715cec98e0dd](https://github.com/systemslibrarian/crypto-lab-search-vault/blob/715cec98e0dd03344c0fabc1efd71d0103786bd5/README.md); [Rekey Relay 934deba71b3e](https://github.com/systemslibrarian/crypto-lab-rekey-relay/tree/934deba71b3e6217d8aff8b734482c8696413a46).

<a id="e-k-07"></a>

### E-K-07 — Geo-indistinguishability and location privacy

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Privacy definitions.

**Target:** DP Noise extension.

**Existing base:** DP Noise already computes Laplace/Gaussian mechanisms, neighboring-database likelihood ratios, declared sensitivity and privacy composition; it also includes k-anonymity and a homogeneity attack.

**Acceptance criteria:**

- Compare two locations using an epsilon-times-distance likelihood-ratio bound.
- Sample from the stated planar mechanism and measure distance or nearest-service utility.
- Account for repeated releases and explain discretization, boundary and correlated-path assumptions.

**Next action:** Select the metric and planar mechanism and derive the effect of finite map boundaries before building the map.

**Scope and limits:** A map display is not a privacy proof; scalar payroll noise is a different lesson.

**Audit references:** [Geo-Indistinguishability (original PDF pp. 2567–2570)](https://doi.org/10.1007/978-3-030-71522-9_1535).

**Pinned baseline:** [DP Noise ea6eac3e9fc1](https://github.com/systemslibrarian/crypto-lab-dp-noise/blob/ea6eac3e9fc145c9f3306d4f6610b0662f8a794f/README.md#L12).

<a id="l-r-10"></a>

### L-R-10 — Perfectly secure message transmission across hostile paths

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Anonymous communication.

**Target:** New advanced network-cryptography lab linked to Shamir Gate/VSS Gate.

**Existing base:** Shamir Gate demonstrates information-theoretic threshold sharing/reconstruction; VSS Gate handles dishonest-dealer share checks. Secure-channel labs instead begin with computational key agreement or credentials.

**Acceptance criteria:**

- Model independent paths and separately introduce observation, modification and message loss.
- Compare naive share routing with one specified perfectly secure message-transmission protocol.
- Compute privacy and reliable-delivery outcomes as feedback, rounds and adversary budget vary under the selected topology condition.

**Next action:** Choose one PSMT model and state its path-connectivity and synchrony assumptions.

**Scope and limits:** Browser paths are a model, not physically independent networks; no universal threshold is asserted.

**Audit references:** [Perfectly Secure Message Transmission (original PDF pp. 4433–4439)](https://doi.org/10.1007/978-3-030-71522-9_326).

**Pinned baseline:** [Shamir Gate 66874ed10bbc](https://github.com/systemslibrarian/crypto-lab-shamir-gate/blob/66874ed10bbc796b4d81d3e79c23befaf9f395fd/README.md); [VSS Gate cda8c3aea867](https://github.com/systemslibrarian/crypto-lab-vss-gate/tree/cda8c3aea86774e1bf9edddfb429bf9eba579509).

<a id="s03"></a>

### S03 — Timestamp batching and timely evidence renewal

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Durable cryptographic evidence.

**Target:** Existing hub Timestamping workshop.

**Existing base:** The existing hub Timestamping workshop issues and verifies signed document-digest receipts, binds request nonces, rejects altered documents/times and replay, demonstrates dishonest backdating, and compares a rewritten hash chain with an external-checkpoint model. Time Trust and the Merkle/PKI labs add clock, proof and trust-chain foundations.

**Acceptance criteria:**

- Extend the existing signed-receipt workshop to stamp a Merkle root and verify each document's inclusion, including wrong-path/root controls.
- Renew still-trustworthy evidence across a specified key/algorithm epoch before its assurance fails.
- Compare unrenewed and timely renewed records and show that a late stamp cannot repair already forged or ambiguously compromised history.

**Next action:** Specify a current timestamp/evidence-renewal model and reuse the existing receipt verifier and Merkle proof mechanics.

**Scope and limits:** Optional depth. Signed digests, nonces, tampering, backdating, chain rewriting and external-checkpoint trust already execute in the hub workshop.

**Audit references:** [Time-Stamping (original PDF pp. 6443–6452)](https://doi.org/10.1007/978-3-030-71522-9_136).

**Pinned baseline:** [Timestamping workshop 743f03b9c613](https://github.com/systemslibrarian/crypto-lab/blob/743f03b9c6134cdcf51b79189e4eadab41bf85ea/learn/timestamping/index.html); [Time Trust 1578c9763ac5](https://github.com/systemslibrarian/crypto-lab-time-trust/tree/1578c9763ac5aa15a343ee97a75be29eaddf2d79); [Merkle Proofs bc58ccd5b628](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/tree/bc58ccd5b628403e8c5002df74fa304b0ce16021); [PKI Chain 0ee9ca34cecd](https://github.com/systemslibrarian/crypto-lab-pki-chain/tree/0ee9ca34cecdc1d434f013fa07b23865c56c382b).

<a id="e-k-05"></a>

### E-K-05 — Optimistic fair exchange beyond the ideal-intermediary workshop

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Fair exchange.

**Target:** Existing hub Fair Exchange workshop.

**Existing base:** The pre-existing hub Fair Exchange workshop executes message/receipt, contract-signature and secret-swap scenarios with actual ECDSA/AES-GCM checks, session/subject binding, direct-delivery advantage, verified deposits to an ideal intermediary, and terminal abort/release states. Adaptor Gate separately executes atomic swaps and PTLC settlement.

**Acceptance criteria:**

- Execute one named optimistic exchange protocol whose honest normal path completes without contacting the intermediary.
- Retain recoverable evidence and exercise stop/delay plus compatible abort/resolve races.
- Track each party's usable evidence and state fairness, timeliness, availability and durable intermediary-state assumptions.

**Next action:** Choose one optimistic signature-exchange protocol and derive its abort/resolve state machine.

**Scope and limits:** Optional depth. The hub already executes direct and ideal-intermediary message/receipt, signature and secret exchanges; Adaptor Gate already supplies atomic swaps/PTLC.

**Audit references:** [Fair Exchange (original PDF pp. 2246–2249)](https://doi.org/10.1007/978-3-030-71522-9_204).

**Pinned baseline:** [Fair Exchange workshop 743f03b9c613](https://github.com/systemslibrarian/crypto-lab/blob/743f03b9c6134cdcf51b79189e4eadab41bf85ea/learn/fair-exchange/index.html); [Adaptor Gate 207c2e1a0b8d](https://github.com/systemslibrarian/crypto-lab-adaptor-gate/blob/207c2e1a0b8d82ffe74a9ae43196a65b6ffa4557/README.md); [Protocol Checker adbe6c0612e5](https://github.com/systemslibrarian/crypto-lab-protocol-checker/blob/adbe6c0612e583924ebb0cda3f281521ace9a693/README.md).

## Phase 6 — Optional specialist and research scope

Retain the seven P3 proposals for deliberate later development after the core operational sequence.

<a id="e-k-10"></a>

### E-K-10 — Hierarchical ORAM as a construction comparison

**Priority:** P3 — specialist · **Status:** Planned · **Workstream:** Advanced ORAM.

**Target:** ORAM Vault advanced extension.

**Existing base:** ORAM Vault already implements Path ORAM access, position remapping, stash management and legal eviction, with bandwidth and semi-honest-server caveats.

**Acceptance criteria:**

- Run the same logical accesses through tiny Path and hierarchical ORAM constructions.
- Compute all-level probes, dummy searches, reinsertion and rebuilds with fresh hashing.
- Compare client state, per-access traffic and rebuild spikes and demonstrate the leak from skipped dummy probes.

**Next action:** Select a bounded hierarchical construction after retaining the existing Path ORAM baseline.

**Scope and limits:** Optional construction breadth; ORAM and access-pattern privacy already have substantive coverage.

**Audit references:** [Hierarchical ORAM Constructions (original PDF pp. 2816–2822)](https://doi.org/10.1007/978-3-030-71522-9_1785).

**Pinned baseline:** [ORAM Vault 8a2aa66111da](https://github.com/systemslibrarian/crypto-lab-oram-vault/blob/8a2aa66111da27768a42510c02a2391ee409f1e6/README.md#L5).

<a id="l-r-13"></a>

### L-R-13 — Mutually distrustful clients sharing an ORAM

**Priority:** P3 — specialist · **Status:** Planned · **Workstream:** Advanced ORAM.

**Target:** ORAM Vault advanced companion.

**Existing base:** ORAM Vault executes Path ORAM with one client position map/stash, AES-GCM blocks and a semi-honest server model. It already explains the need for a malicious-server integrity layer.

**Acceptance criteria:**

- Give mutually distrustful clients different rights over one encrypted store and expose their observations.
- Demonstrate a concrete failure from naively sharing single-client ORAM state.
- Execute the selected construction's authorization, obliviousness and state synchronization and label integrity/concurrency limits separately.

**Next action:** Choose a multi-client ORAM model and define client/server collusion and shared-state assumptions.

**Scope and limits:** Optional advanced scope. Trusted parallel processors and generic multi-server ORAM do not establish this model.

**Audit references:** [Multi-client Oblivious RAM (original PDF pp. 3963–3966)](https://doi.org/10.1007/978-3-030-71522-9_1550).

**Pinned baseline:** [ORAM Vault 8a2aa66111da](https://github.com/systemslibrarian/crypto-lab-oram-vault/blob/8a2aa66111da27768a42510c02a2391ee409f1e6/README.md).

<a id="s10"></a>

### S10 — Rank-metric code cryptography

**Priority:** P3 — specialist · **Status:** Planned · **Workstream:** Code-based families.

**Target:** Code-based family companion linked to PQ Families/McEliece Gate/HQC Vault.

**Existing base:** Code-based labs teach binary/Hamming-code constructions and decoding failures.

**Acceptance criteria:**

- Convert extension-field vectors to base-field matrices and compute Hamming and rank weights on the same examples.
- Execute a small rank-decoding/MRD or Gabidulin example and expose how its metric changes the problem.
- Clearly separate family mathematics from any historical scheme's current security status.

**Next action:** Select field parameters and a primary construction or decoding example; review current cryptanalysis before naming a usable scheme.

**Scope and limits:** Optional mathematical-family extension; no legacy rank-code deployment endorsement.

**Audit references:** [Schemes Based on Rank Codes (original PDF pp. 5355–5363)](https://doi.org/10.1007/978-3-030-71522-9_388).

**Pinned baseline:** [PQ Families ac2429239a36](https://github.com/systemslibrarian/crypto-lab-pq-families/tree/ac2429239a3645c3c3455597f68f7c65856bb26d); [McEliece Gate 3f4a0d6ad769](https://github.com/systemslibrarian/crypto-lab-mceliece-gate/tree/3f4a0d6ad7697a9027f3c703dbcc935a08dd1e25); [HQC Vault 55575851a069](https://github.com/systemslibrarian/crypto-lab-hqc-vault/tree/55575851a069914cddc33e5025edd519a7f9e391).

<a id="s12"></a>

### S12 — SAML assertion and signature-binding failures

**Priority:** P3 — specialist · **Status:** Planned · **Workstream:** Federation protocols.

**Target:** SAML protocol companion linked to JWT Forge and PKI Chain.

**Existing base:** JWT verification, certificate chains and WebAuthn are represented; they do not implement SAML assertions.

**Acceptance criteria:**

- Verify a signed synthetic assertion while showing how authorizing from a different XML node can still be wrong.
- Bind application consumption to the verified object and test audience, recipient, subject, InResponseTo and replay mismatches.
- Label the implemented OASIS profile and omitted federation/session behavior.

**Next action:** Choose a current narrow SAML profile and a safe XML-signature binding exercise with synthetic assertions.

**Scope and limits:** Optional applied-protocol expansion; JWT and WebAuthn coverage do not imply SAML support.

**Audit references:** [Web Single Sign On and SAML (original PDF pp. 6803–6814)](https://doi.org/10.1007/978-3-030-71522-9_906).

**Pinned baseline:** [JWT Forge eeb81b2a1035](https://github.com/systemslibrarian/crypto-lab-jwt-forge/tree/eeb81b2a1035e47ba686a5a3a5cd06672b4bfa48); [PKI Chain 0ee9ca34cecd](https://github.com/systemslibrarian/crypto-lab-pki-chain/tree/0ee9ca34cecdc1d434f013fa07b23865c56c382b); [WebAuthn b9267eb6861c](https://github.com/systemslibrarian/crypto-lab-webauthn/tree/b9267eb6861c8a6793de2d492f37e0868c28e3d2).

<a id="l-r-11"></a>

### L-R-11 — Interactive ℓ-diversity/t-closeness and residual disclosure

**Priority:** P3 — specialist · **Status:** Planned · **Workstream:** Privacy definitions.

**Target:** DP Noise extension.

**Existing base:** DP Noise already computes k-anonymity/homogeneity failures and explicitly names ℓ-diversity and t-closeness in src/ui/leak.ts. It also teaches actual DP mechanisms, neighboring worlds and composition.

**Acceptance criteria:**

- Construct homogeneous, diverse and semantically related sensitive-value classes and compute a specified diversity/closeness criterion.
- Display the utility effect of transforming the table.
- Apply background information or repeated release and contrast residual disclosure with the existing DP neighboring-world guarantee.

**Next action:** Choose exact l-diversity/t-closeness definitions and a synthetic table with informative counterexamples.

**Scope and limits:** Optional depth. DP Noise already names both refinements; these release criteria are not equivalent to differential privacy.

**Audit references:** [ℓ-Diversity (original PDF pp. 3507–3513)](https://doi.org/10.1007/978-3-030-71522-9_899).

**Pinned baseline:** [DP Noise ea6eac3e9fc1](https://github.com/systemslibrarian/crypto-lab-dp-noise/blob/ea6eac3e9fc145c9f3306d4f6610b0662f8a794f/src/ui/leak.ts).

<a id="a-d-15"></a>

### A-D-15 — Anamorphic encryption under ordinary key disclosure

**Priority:** P3 — specialist · **Status:** Planned · **Workstream:** Research extensions.

**Target:** Advanced research companion linked to Subliminal Channels and Shadow Vault.

**Existing base:** Subliminal Channels selects a valid ECDSA signature whose public r parity encodes one overtly documented bit; knowing the rule reveals it, and the README explicitly says this is not encryption. Shadow Vault has real/decoy encrypted slots and explicitly lacks role privacy against a format-aware reader.

**Acceptance criteria:**

- Implement one explicitly named anamorphic construction/model or label an initial exhibit conceptual.
- Separate ordinary receiver/coercer and double-key receiver views, reveal the ordinary key and prescribed overt message, and compute the hidden receiver's additional result.
- Compare with the existing public subliminal bit and role-revealing decoy container without attributing anamorphic security to either.

**Next action:** Review primary constructions and the coercer/distribution model before deciding whether a faithful executable exhibit is feasible.

**Scope and limits:** Optional research scope; a hidden field, parity bit or extra AEAD slot is not anamorphic security.

**Audit references:** [Anamorphic Cryptography (original PDF pp. 281–284)](https://doi.org/10.1007/978-3-030-71522-9_1832).

**Pinned baseline:** [Subliminal Channels 86f4e46fa2fd](https://github.com/systemslibrarian/crypto-lab-subliminal-channels/blob/86f4e46fa2fd4d8991130f97ec0c05df6e7ce147/README.md); [Shadow Vault 5d0ec559a3db](https://github.com/systemslibrarian/crypto-lab-shadow-vault/blob/5d0ec559a3dbd3f2ab3ebb7647f35d4b5433844d/README.md).

<a id="l-r-12"></a>

### L-R-12 — Postquantum identity/policy key extraction

**Priority:** P3 — specialist · **Status:** Planned · **Workstream:** Research extensions.

**Target:** Advanced IBE/ABE companion linked to GGH Trapdoor.

**Existing base:** IBE Gate executes BasicIdent over BLS12-381; Attribute Gate executes pairing-based FAME. Existing PQ labs cover many encryption/signature families, while GGH Trapdoor introduces modern sampling context.

**Acceptance criteria:**

- Map a public identity/policy to an algebraic target and execute a bounded trapdoor preimage-sampling/key-extraction example.
- Compare extraction, encryption and decryption interfaces with BasicIdent/FAME.
- Display assumptions and parameter scale and distinguish mechanism toys from any current approved deployment scheme.

**Next action:** Choose one primary lattice IBE/ABE construction and review its sampling and parameter requirements.

**Scope and limits:** Optional research scope. ML-KEM is not a drop-in replacement for identity/policy key extraction.

**Audit references:** [Post-quantum Identity-Based Encryption and Attribute-Based Encryption (original PDF pp. 4580–4584)](https://doi.org/10.1007/978-3-030-71522-9_1464).

**Pinned baseline:** [IBE Gate b249b17c883b](https://github.com/systemslibrarian/crypto-lab-ibe-gate/blob/b249b17c883b4472ca4ef702866fc609d2c7e943/README.md); [Attribute Gate d0bb24262e9b](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d0bb24262e9b2b6e47044ef49e5941bdb332e17c/README.md); [GGH Trapdoor cb2ece6e0ab3](https://github.com/systemslibrarian/crypto-lab-ggh-trapdoor/tree/cb2ece6e0ab398a3fb249304c4e860ac64fa6588).

## Verification and publication record

For each proposal, append a dated entry below when its state changes. Preserve the ID. Record the exact sub-scope, source commit, meaningful positive/negative evidence, remaining criteria, and main/deployment revisions where applicable. Keep the implementation, source-review and publication claims distinct.

| Date (America/New_York) | Scope | Evidence / state |
| --- | --- | --- |
| 2026-10-23 | Initial rollout ledger | 48 audit IDs reconciled: 17 P1, 24 P2, 7 P3. E-K-01 first exercise in progress; other 47 planned. M-LFSR and M-SHELF implemented locally with integration verification/publication pending. Four historical catalog checks resolved. No proposal marked Verified, Merged or Live by this snapshot. |
| 2026-10-23 | E-K-02 executable HIBE delegation | Reconciled current IBE Gate rather than duplicating completed work. PR #24 is merged at `7dfebaff27c4`; 35 unit and 17 hosted production-browser tests passed, deployment completed, and freshly built assets matched the served site byte-for-byte. Parent-to-child and recursive delegation, ancestor/sibling boundaries, compromised-subtree reach, maximum depth and retained root escrow were checked. Marked **Live** with the bounded Type-3 KEM/DEM teaching-adaptation limit retained. |
| 2026-10-23 | A-D-06 classical AES DFA | Reconciled current AES Anatomy rather than duplicating completed work. PR #3 is merged at `fffbc96eddeb`; 39 unit tests, 20 hosted production-browser/accessibility checks and all 36 mutation cases passed, deployment completed, and freshly built assets matched the served site byte-for-byte. The round-9 single-byte fault and candidate equations were checked against Dusart–Letourneux–Vivolo, and recovery, held-out verification, changed-location failure and common-mode recomputation limit were independently exercised. Marked **Live** with the logical known-location AES-128 fault-model limit retained. |
| 2026-10-23 | E-K-06 accepted-output fault analysis | Draft PR #4 is active in AES Anatomy and is therefore **In progress**, not Planned. At this snapshot typecheck, unit and production build steps passed, while the browser gate failed and mutation/deployment did not run. No acceptance criterion, merge, deployment or learner behavior is credited until the draft is complete and independently checked against primary sources. |
| 2026-10-23 | Hub reconciliation and catalog integration | [Hub PR #252](https://github.com/systemslibrarian/crypto-lab/pull/252), initial commit `9df3ae449107`, maps the two newly reconciled lessons, updates cards and the knowledge map, repairs Search Vault's generated catalog drift, and records the verified maintenance state. All 11 applicable hosted jobs passed: [catalog and checker regressions](https://github.com/systemslibrarian/crypto-lab/actions/runs/40033387335), [teach/layout](https://github.com/systemslibrarian/crypto-lab/actions/runs/40033387279), [learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40033387232), [protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40033387354), [public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40033387701) and [arcade browser playthrough](https://github.com/systemslibrarian/crypto-lab/actions/runs/40033387230). The scheduled-only drift job was correctly skipped. Merge and Hub deployment remain pending at this ledger entry. |
| 2026-10-23 | E-K-06 accepted-output fault analysis | [AES Anatomy PR #4](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/pull/4) merged at `1f0f6b86a2dd`; exact-main run 40041039537 passed 51 unit, 21 production-browser/accessibility and 44 mutation cases and deployed. The served HTML, JavaScript, CSS and worker matched the exact tested build byte-for-byte. Real fault-path equality, sampled selected-output ranking, the separate analytic census, secret-independent null, rejection, bounded hidden infection and exact-reference failure case were independently checked against the primary papers. Marked **Live** with the one-byte logical model and non-hardened/non-universal defense limits retained. |
| 2026-10-23 | E-K-01 complete bounded key-handle model | [Envelope KMS PR #44](https://github.com/systemslibrarian/crypto-lab-envelope-kms/pull/44) merged at `50fcf5130274`; exact-main run 40047769606 passed 119 unit tests, 2 publishing controls, 39 production-browser/accessibility tests and all 10 claim mutations before deploying. CodeQL passed. The served HTML, JavaScript and CSS matched a fresh build byte-for-byte. Fixed-policy bounded exhaustion, incomplete cutoff, depth-3 import and depth-4 distinct same-value-handle witnesses, terminal complementary roles, real AES-KW replay and independent AES-GCM verification were checked. Marked **Live** with the finite-model, non-PKCS #11 and non-HSM limits retained. |
| 2026-10-23 | E-K-01 Hub publication | [Hub PR #254](https://github.com/systemslibrarian/crypto-lab/pull/254) merged at `8e1880454949`; all seven exact-main workflow runs passed, including catalog/public-evidence checks and Pages deployment. The deployed 784,834-byte catalog matched the merge commit byte for byte at SHA-256 `9a97c1be9c6e39844ed92c8fe43bd43ec6a7c45290d349fd399f0f5931a74304`, and the updated Envelope KMS card appeared exactly once. The temporary local and remote feature branches were removed after verification. |
| 2026-10-23 | A-D-01 encrypted deduplication design | Fresh current-source and public-repository reconciliation found no existing MLE/deduplication lab. Envelope KMS `50fcf5130274` and OPAQUE Gate `6fffc04fec90` were read as related baselines. The reviewed design selects a DupLESS-shaped adaptation with local convergent and RFC 9497 P256-SHA256 VOPRF-derived modes, AES-CTR under a key/counter pair confined to one distinct plaintext value with intentional reuse for exact repeats, per-user RFC 5297 AES-SIV key capsules, exact-byte deduplication, executable dictionary/rate/proof failures and separate possession, authorization, deletion and revocation transitions. Marked **In progress**; no implementation, test, merge or deployment credit is claimed yet. |
| 2026-10-23 | A-D-01 encrypted deduplication delivery | [Dedup Vault PR #1](https://github.com/systemslibrarian/crypto-lab-dedup-vault/pull/1) merged at `3cbf467bdb1a`; exact-main [run 40055618704](https://github.com/systemslibrarian/crypto-lab-dedup-vault/actions/runs/40055618704) passed 38 unit, 7 learner-claim, 11 accessibility/reflow and all 24 mutation cases after the clean baseline, then deployed. Exact-main CodeQL passed. Served HTML, JavaScript, CSS and notices matched a fresh build byte-for-byte. Equality and storage accounting, offline and budgeted VOPRF-aided guesses, proof tampering, separate compromise views and possession/authorization/deletion/revocation/rotation boundaries were independently checked. Marked **Live** with the DupLESS-shaped substitution, per-distinct-plaintext AES-CTR key/counter confinement with intentional reuse for exact repeats, bounded possession/rate model and non-production role-isolation limits retained. |
| 2026-10-23 | A-D-01 advisor publication | [Crypto Counsel PR #20](https://github.com/systemslibrarian/crypto-counsel/pull/20) merged at `cf378a975fc8`. Exact-main [run 40056253650](https://github.com/systemslibrarian/crypto-counsel/actions/runs/40056253650) validated 344 entries and 245 demos, passed its ancestry and evidence controls, reported `baseline: unmutated copy PASSES`, caught all 27 corpus mutations and deployed. The generated Pages pipeline also passed. Served `index.html` and `corpus.json` matched the merge commit byte-for-byte; the live corpus contains the Dedup Vault review pin and correct github.io demo link, and the live retrieval logic selects it for a Dedup query. The finished local and remote integration branches were removed after verification. |
| 2026-10-23 | A-D-01 Hub publication | [Hub PR #256](https://github.com/systemslibrarian/crypto-lab/pull/256) merged at `5a4387d63b7c`; 14 executed jobs across all seven exact-main workflows passed and the event-inapplicable drift job was correctly skipped. The hosted gates retained 244 cards, 1,738 reviewed sections, five Dedup exhibits, nine source-checked Dictionary attack implementations, Dedup's Message-Locked Encryption implementation credit, Commit Gate's P-256 implementation credit and Quantum Vault's threat-only exclusion. Pages deployed the exact merge; live `index.html` was byte-identical at 789,782 bytes and SHA-256 `db0287a91fddf4a9588820adee4ef547f75cb8b53c395a4a641105c0080c53f3`, with Dedup Vault and its correct GitHub Pages link each appearing once. |
| 2026-10-23 | A-D-02 PEKS reconciliation and design | Fresh Search Vault `97d9e0ff6fbb`, IBE Gate `7dfebaff27c4`, Pairing Gate `dddce0a39d0d`, fetched branches and the deployed Search Vault assets were reconciled before implementation. No PEKS implementation or new repository was found or needed. The reviewed design adapts the original bilinear PEKS equations to Type-3 BLS12-381, retains RFC 9380 hash-to-G1 and exact role boundaries, executes a public-encryption/Test keyword guess against an exposed trapdoor, and separates guessing, search, access and volume leakage. Marked **In progress**; no implementation, test, merge, deployment or original-proof-transfer claim is credited by this entry. |
| 2026-10-24 | A-D-02 PEKS delivery | [Search Vault PR #25](https://github.com/systemslibrarian/crypto-lab-search-vault/pull/25) merged at `1f0b50595608`; exact-main [run 40061206280](https://github.com/systemslibrarian/crypto-lab-search-vault/actions/runs/40061206280) passed 117 unit tests and 30 hosted browser/accessibility checks, built successfully with zero audited dependency vulnerabilities and deployed. All six public files matched a fresh exact-main build byte for byte. Public-sender encryption, recipient trapdoor generation, server Test, randomized tags, strict decoding, independent fixed-scalar correctness, bounded active guessing and separate leakage views were checked. Marked **Live** with the Type-3 proof-transfer, GT encoding, body-binding, completeness/freshness, post-quantum and hardened-implementation limits retained. The completed local and remote feature branches were removed after live verification. |
| 2026-10-24 | L-R-07 Boolean-search reconciliation | Fresh Search Vault `1f0b50595608` and ORAM Vault `8a2aa66111da` were read after fetching current remote state. Boolean/OXT search remains genuinely absent, and no new repository is needed. The reviewed design selects exactly two distinct keywords joined by `AND`, a real two-query SSE baseline, OXT core over ristretto255 requiring independently pinned algebra and checks of all 91 corpus pairs, explicit conditional-repeat controls, and a 24-document Path ORAM cost/assumption illustration. Status remains **Planned** until implementation begins; no Boolean-search, OXT or ORAM-integration credit is claimed by this design entry. |
| 2026-10-24 | A-D-02 Hub publication | [Hub PR #258](https://github.com/systemslibrarian/crypto-lab/pull/258) merged at `402f87ed4198`; all seven exact-main workflows completed with 14 successful jobs and one correctly skipped schedule-only drift job. Pages deployment `7294037180` published the exact merge. The live 791,777-byte catalog matched exact main at SHA-256 `21f7bdcbf7f41ebe2b0f1f132ac788ad437f5d8f4ccc2cd657d8c4cf4a2bcd1b`, with the reviewed Search Vault PEKS card and correct GitHub Pages link each appearing once. |
| 2026-10-24 | L-R-07 implementation start | Search Vault was fetched and confirmed clean at `1f0b50595608`; implementation began on `codex/lr07-oxt-20261024`, so the proposal moved from **Planned** to **In progress**. The OXT, HXT leakage, RFC 9496, Path ORAM and ORAM/SSE-composition sources are being checked before code is credited. No implementation, test, merge or deployment result is claimed by this status change. |
| 2026-10-24 | L-R-07 Boolean-search delivery | [Search Vault PR #26](https://github.com/systemslibrarian/crypto-lab-search-vault/pull/26) merged at `d904972690e1`; exact-main [run 40088072088](https://github.com/systemslibrarian/crypto-lab-search-vault/actions/runs/40088072088) passed 180 unit and 37 hosted browser/accessibility tests with zero dependency vulnerabilities, then deployed. All six public files matched the reviewed build byte for byte. Two actual SSE searches, the bounded ristretto255 OXT route, all 91 keyword pairs in both orders, five equality/intersection controls, strict invalid grammar and the `N=24`, `Z=4`, `L=5` Path ORAM arithmetic were checked. Marked **Live** with the two-term/static, full-proof-transfer, active completeness/freshness, separate-server ORAM and non-hardened-JavaScript limits retained; the completed local and remote lab branches were removed. |
| 2026-10-24 | L-R-07 Hub publication | [Hub PR #260](https://github.com/systemslibrarian/crypto-lab/pull/260) merged at `89215362ee59`; all seven exact-main workflows passed with 14 successful jobs and one correctly skipped schedule-only drift job. The public 792,411-byte `index.html` matched exact main at SHA-256 `3a13bc46b45bb1584e683f64b1085c244f717de3b32b4d499580f36a2d5823a2`, and the served 156,366-byte roadmap matched at SHA-256 `b24c8103a270908f0d59465091e077d8cf8763baf9701eba39ccff84b28daf2`. |
| 2026-10-24 | L-R-04 compressed-query implementation start | Shelf Oracle was freshly reconciled at `882c4f0083fd`, and implementation is active on the local `codex/lr04-compressed-pir-20261024` branch. The bounded design uses four fixed 16-selector ciphertext blocks to cover all 64 records, sends no selected block or index to the server, expands all four blocks, scans every record and returns four fixed ciphertext responses. Marked **In progress** only: the independent audit and final local gates are still active, and no verified, merged, deployed or live credit is claimed. |
| 2026-10-24 | L-R-04 compressed-query delivery | [Shelf Oracle PR #16](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/pull/16) merged at `4d31c5b3ec5e`; exact-main [run 40094580465](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/actions/runs/40094580465) passed 99 unit and 33 production-browser/accessibility tests with zero dependency vulnerabilities, built successfully and deployed. Served HTML, JavaScript and CSS matched the exact-main build byte for byte. Direct and four-block expanded BFV retrieval, evaluation-key and wire-format failures, actual operation/byte/noise accounting and fixed response shape were checked. Marked **Live** with the circular-security, four-block, four-response, full-scan, honest-but-curious and non-multidimensional limits retained. |
| 2026-10-24 | Hybrid Sign TLS assignment-status correction | [Hybrid Sign PR #25](https://github.com/systemslibrarian/crypto-lab-hybrid-sign/pull/25) merged at `e9e4ddb545c6`; exact-main [run 40092067603](https://github.com/systemslibrarian/crypto-lab-hybrid-sign/actions/runs/40092067603) passed 19 unit tests, the production build and 11 hosted browser/accessibility tests and deployed. The public assets matched a fresh exact-main build byte-for-byte. The learner page and README no longer call `0x090A` or `0x090B` assigned, identify the October 20, 2026 TLS working-group draft's `mldsa65_ed25519_sha512` value as pending `TBD7`, and keep that proposal distinct from the lab's LAMPS draft-16 implementation baseline. No Hub catalog correction was required. |
| 2026-10-24 | L-R-04 Hub publication | [Hub PR #263](https://github.com/systemslibrarian/crypto-lab/pull/263) merged at `a475735174b0`; all seven exact-main workflows passed with 14 successful jobs and one correctly skipped schedule-only drift job. The public 794,684-byte `index.html` matched exact main at SHA-256 `ac0a43032b66fc7956161f3c4a42cbd18235491b0f40ae84539c9ad6a6d86ff6`, and the served 167,613-byte roadmap matched at SHA-256 `4936d30155f2c8065fbfaeddebda4328707a81c84208af133462d28b5c392a5f`. README, CATALOG, knowledge-map and reviewed-evidence files also matched exactly; the finished branch/worktree were removed. |
| 2026-10-24 | L-R-05 and A-D-10 implementation start | Shelf Oracle was fetched and confirmed current at `4d31c5b3ec5e`; implementation began in a clean worktree, so both proposals moved from **Planned** to **In progress** for their distinct shared-project sub-scopes. The reviewed design selects a bounded Piano-style static parity-and-refresh adaptation, corrects the session primary-hint union bound to `33 · (7/8)^249`, treats server `ProcessDB` as identity/none and client setup separately, and requires fixed-shape failure, consumed-state, loss, update, replay/freshness and executed-cost checks. No implementation, verification, merge, deployment or learner-behavior credit is claimed by this status change. |
| 2026-10-24 | L-R-05 primary-source citation metadata | Rechecked ePrint 2022/081 against its publication record and corrected its displayed title to *Single-Server Private Information Retrieval with Sublinear Amortized Time*. The paper remains the cited source for its model-specific client-storage/server-time lower bounds; no proposal status, implementation claim or scope changed. |
| 2026-10-24 | L-R-05 stateful PIR and A-D-10 cost-model delivery | [Shelf Oracle PR #17](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/pull/17) merged at `d08691c9e17a`; the final reviewed feature head and merge have the same tree. Pre-merge [run 40101598377](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/actions/runs/40101598377) passed 121 unit tests, the production build and 38 hosted Chromium claim/accessibility tests. Exact-main [run 40102100735](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/actions/runs/40102100735) repeated that complete gate and deployed successfully. The public HTML, JavaScript and CSS matched both the exact-main artifact and a fresh build byte for byte. The bounded static model executes eight probes with an 8-byte request and 512-byte response, one-use hint recovery/refresh, loss and malformed-response failure, external rollback anchoring, update invalidation and full rebuild while keeping its client-specific setup, 197,696-byte base state, scoped `2^-42.92` primary-hint availability bound and non-Piano-theorem limitations visible. Both proposals are **Live**. |
| 2026-10-24 | L-R-05/A-D-10 Hub publication and Hybrid Sign evidence refresh | [Hub PR #267](https://github.com/systemslibrarian/crypto-lab/pull/267) merged at `938283101233`; all seven exact-main workflows passed with 14 successful jobs and one correctly skipped schedule-only drift job. Pages deployed the exact merge. The public 796,849-byte catalog matched exact main at SHA-256 `878d21baf312a609990352bfe08409e2cda44c5623451acf83d85c68ebf4181d`; the served 182,999-byte roadmap matched at SHA-256 `0018143df3e28f6b73841c3ba381e6d761927cd913e74634c2d3948e53b82975` before this evidence entry. README, CATALOG, concept coverage, the knowledge map and both reviewed-evidence JSON files also matched exact main byte for byte. The Hub now records 244 labs and 1,742 reviewed sections, including Shelf Oracle's eleventh exhibit, while Hybrid Sign retains no false executed discrete-log, factoring, side-channel or bilinear-pairing credit. |
| 2026-10-24 | Refreshed reading-review reconciliation | Reconciled the report's older `409bac75db17` roadmap snapshot against current Hub main `ab57d21c09e8`, all four tracking documents and fresh target-repository mains. The report observed 9 live and 2 active proposals; current main has 11 live and 0 active, so the short queue remains A-D-03 then L-R-03. Retained three concrete maintenance items and five bounded, unprioritized `RR-*` follow-ups; attached the guided-hybrid recommendation to E-K-04/S09 instead of creating a duplicate proposal. Current source already covers Wheatstone's historical 27/26 gearing, Quantum Entropy RCT/APT, certificate-chain and CT mechanics, TLS resumption/0-RTT replay, Masked Core second-order CPA and final SP 800-90C references. NIST's May 29, 2025 potential SP 800-90B corrections are not embedded in the reviewed lab values. No proposal status, phase count or implementation order changed. |
| 2026-10-24 | Refreshed reading-review publication | [Hub PR #269](https://github.com/systemslibrarian/crypto-lab/pull/269) merged at `72f06a7e26d8`. All seven exact-main workflows passed: [Protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40106141648), [Three arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40106141659), [Learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40106141676), [Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40106141652), [README catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40106141655), [Public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40106141668) and [Pages deployment](https://github.com/systemslibrarian/crypto-lab/actions/runs/40106141710). Fourteen jobs succeeded and the event-inapplicable schedule-only drift job was skipped. The public 195,298-byte roadmap matched exact main byte for byte at SHA-256 `0846699c60bb0f83fe7cd64cf9f5977619d446951f1a405f57bc7babaca90223` before this publication-evidence entry; the live document contained the three planned maintenance rows, all five `RR-*` follow-ups and the E-K-04/S09 shared-scaffold boundary. |
| 2026-10-24 | A-D-03 FABESA implementation start | Attribute Gate was fetched and confirmed clean at `d0bb24262e9b`; implementation began on `codex/ad03-fabesa-20261024`, so A-D-03 moved from **Planned** to **In progress**. The reviewed design uses Figure 5's CP-ABE equations with §3.3's partially hidden CP-A2BE payload, keeps names/structure/dimensions public while hiding values, counts four pairings per candidate, uses canonical hash encodings and separates the paper's core theorem from the lab's AEAD-validation wrapper. The authors' Python artifact was treated only as a cross-check because it omits Figure 5's independent `g3` and contains an apparent exponentiation transcription error. No implementation, test, merge, deployment or learner-behavior credit is claimed by this status change. |
| 2026-10-24 | A-D-03 FABESA delivery | [Attribute Gate PR #12](https://github.com/systemslibrarian/crypto-lab-attribute-gate/pull/12) merged as `a4cd1973f99b`; [PR run 40109066723](https://github.com/systemslibrarian/crypto-lab-attribute-gate/actions/runs/40109066723) and [exact-main run 40109374693](https://github.com/systemslibrarian/crypto-lab-attribute-gate/actions/runs/40109374693) passed. The hosted gate reports 162 unit tests, 30 Chromium learner-claim tests and three accessibility/reflow tests. Two targeted mutations were killed. A disposable exact-main build matched all three served assets byte for byte, and the live page contains the separately scoped FABESA lesson using Figure 5's CP-ABE equations and §3.3 payload, public/hidden boundary, bounded candidate workflow, negative cases and theorem/non-claim wording. A-D-03 is **Live**; L-R-03 is next. |
| 2026-10-24 | L-R-03 multi-authority and epoch delivery | [Attribute Gate PR #13](https://github.com/systemslibrarian/crypto-lab-attribute-gate/pull/13) merged as `ab293fd0386f`; [PR run 40116256609](https://github.com/systemslibrarian/crypto-lab-attribute-gate/actions/runs/40116256609) and [exact-main run 40116671435](https://github.com/systemslibrarian/crypto-lab-attribute-gate/actions/runs/40116671435) passed. Both hosted runs report 226 unit tests, 36 Chromium learner-claim tests and three accessibility/reflow drives; the latter deployed the exact merge. Three L-R-03-specific mutations were killed. The public HTML, JavaScript and CSS matched a fresh merged-tree build byte for byte, and the live page contains exact RW15 same-/cross-GID and compromised-issuer outcomes plus the separately scoped epoch reissue, retained-access, rollback, owner-rewrap, escrow and work-ledger cases. L-R-03 is **Live**; S04 is next for repository reconciliation and construction selection. |
| 2026-10-24 | S04 reconciliation and implementation start | Proof Tally, DP Noise, Silent Tally and SPDZ Forge were fetched and read at the pins above. Proof Tally maintenance PR #18 merged at `395e990e1980`; exact-main run `40118954034` passed 62 unit tests, 26 hosted Chromium tests and 22 verdict-coverage tests, deployed, and the served HTML, CSS and JavaScript matched a fresh exact-main build byte for byte. Independent design review selected the bounded fixed-cohort, exact discrete-Laplace construction recorded in S04, including equal-size exact differencing, `beta = 9/10`, six-honest `delta_activation = 10^-6`, explicit sampler-cap coupling, all-or-nothing delivery and separate collector/omniscient views. Implementation is active on a clean branch from that merge. S04 is **In progress** only; no new lesson, test, merge, deployment or public behavior is credited by this entry. |
| 2026-10-24 | S04 distributed differential-privacy delivery | [Proof Tally PR #19](https://github.com/systemslibrarian/crypto-lab-proof-tally/pull/19) merged as `f1220e93baa5`. Final-head [run 40125465557](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40125465557) passed 151 unit tests, the production build, 33 Chromium claim/accessibility/reflow tests, 73 registry tests and 27 rendered-verdict tests. [Mutation run 40123033025](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40123033025) reported `baseline green, 27 specs` and `64/64 killed, 0 survived, 0 neither`. Exact-main [run 40125573428](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40125573428) repeated the complete gate and deployed; public HTML, JavaScript and CSS matched a fresh merge build byte for byte. The live page executes equal-size exact-output differencing and the separately bounded participant-noised release while retaining its collector/omniscient, sender-authentication, collusion, dropout, one-release, cap, DAP and durable-ledger boundaries. S04 is **Live**; S02 is next. |
| 2026-10-24 | S04 Hub publication | [Crypto Lab PR #275](https://github.com/systemslibrarian/crypto-lab/pull/275) merged as `97bf61563a64`. Six PR workflows passed; seven exact-main workflows then passed 14 jobs, with only the event-inapplicable schedule drift job skipped. Pages [run 40126836731](https://github.com/systemslibrarian/crypto-lab/actions/runs/40126836731) deployed that exact merge. The live Hub now exposes Proof Tally's bounded-cohort exact-differencing/noisy-release description, `Discrete Laplace` topic, nine-section source-reviewed exhibit inventory and S04-to-S02 roadmap transition. |
| 2026-10-25 | S02 key-evolving audit-log delivery | [Envelope KMS PR #45](https://github.com/systemslibrarian/crypto-lab-envelope-kms/pull/45) merged as exact main `d2b6614a9fad`. Final-head runs 40136700628 and 40136700660 passed; exact-main Pages/build run 40166747041 and CodeQL run 40166747021 passed. The complete gate reports 154 unit tests, two publishing controls, 49 Chromium claim/accessibility/reflow tests, zero dependency vulnerabilities, coverage of 91.79% statements/88.00% branches/96.07% functions/93.11% lines and all 18 combined claim mutations killed. The public HTML, JavaScript and CSS matched the reviewed build byte for byte. The live lesson separately executes prior rewrite, compromised-suffix forgery, checkpoint comparison, truncation/completeness and freshness while retaining its HMAC, one-way-evolution, modeled-erasure, private-verifier and non-global-consistency limits. S02 is **Live**; A-D-04 is next. |
| 2026-10-25 | S02 Hub publication | [Crypto Lab PR #277](https://github.com/systemslibrarian/crypto-lab/pull/277) merged as `80e80a0cd0b6`. All six PR workflows passed. Seven exact-main workflows then passed 14 jobs, with only the event-inapplicable schedule drift job skipped: [README/catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40169161608), [public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40169161618), [Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40169161616), [learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40169161607), [protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40169161621), [arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40169161626) and [Pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40169161095). Pages deployed that exact merge. The served `index.html`, roadmap, catalog, README, concept coverage and knowledge-map JSON each matched the reviewed tree byte for byte. The live Hub now exposes Envelope KMS's HMAC implementation, Merkle reference-only comparison, eleven-section source-reviewed inventory, precise S02 limits and the S02-to-A-D-04 roadmap transition without inventing fault or side-channel coverage. |
| 2026-10-25 | A-D-04 DC-net implementation start | The newly created [DC-net repository](https://github.com/systemslibrarian/crypto-lab-dc-net) was confirmed to have no commit, branch or workflow, so a normal implementation pull request had no possible base. A minimal title-and-roadmap bootstrap was pushed as exact main `51237cbc73f5`; the implementation then started on `codex/ad04-dc-net-20261025` from that exact revision. Dedup Vault `3cbf467bdb1a`, Proof Tally `f1220e93baa5` and Sphinx Mix `51c0b320ba40` were refreshed and inspected for current quality, deployment and privacy-lesson patterns. Primary-source review fixed the model as a five-participant cycle with independent one-use edge masks, component-parity coalition views, prior-preserving posteriors, parity-only collision output, abort-and-reform dropout handling, bounded SHA-256 commit/reveal and explicit reuse/erasure limits. A-D-04 is **In progress** only; this entry credits no implemented learner behavior, test, merge or deployment. |
| 2026-10-25 | A-D-04 DC-net delivery | [DC-net PR #1](https://github.com/systemslibrarian/crypto-lab-dc-net/pull/1) merged as exact main `8de5cb25042c`. Final-head run 40172921197 and CodeQL run 40172921166 passed after seven CodeQL review findings were corrected; exact-main run 40173229231 repeated 44 unit, 11 learner-claim, 12 accessibility/reflow and all 22 clean-baseline mutation checks, and CodeQL run 40173229219 passed. Pages deployed the exact verified artifact. The public 390-pixel learner view loaded all seven sections without horizontal overflow, and served HTML, JavaScript and CSS matched a fresh exact-main build byte for byte. The live lesson keeps graph-dependent anonymity, exactly-one-sender inference, parity-only collision output, shaped disruption, dropout, bounded commitment, mask reuse and later disclosure distinct without importing Dissent/Verdict accountability. A-D-04 is **Live**; L-R-01 remains separately assigned and E-K-03 is the next unassigned item. |
| 2026-10-25 | A-D-04 advisor publication | [Crypto Counsel PR #22](https://github.com/systemslibrarian/crypto-counsel/pull/22) merged as exact main `815f3137e883`. Local validation retained 345 entries and 246 demos, verified all 56 reviewed pins, passed the ancestry and demo-evidence tests, and caught all 27 mutations from a passing baseline. Exact-main validation/deployment run 40174401580 and Pages run 40174401552 passed. The public 345-entry corpus includes DC-net at reviewed lab main `8de5cb25042c` and matched the exact merged corpus byte for byte. |
| 2026-10-25 | A-D-04 Hub publication | [Crypto Lab PR #280](https://github.com/systemslibrarian/crypto-lab/pull/280) merged as exact main `cc1ef850f52e`. Six PR workflows passed 11 applicable jobs; seven exact-main workflows passed 14 jobs and Pages run 40175351127 deployed the exact merge, with only the event-inapplicable schedule drift job skipped in each event. Six public Hub artifacts matched exact main byte for byte, and the live DC-net card retained its exact implementation, SHA-256, known-plaintext-recovery and reviewed-source anchors. |
| 2026-10-25 | E-K-03 primary-source specification | The focused `crypto-lab-ipsec-ike` repository was rechecked through the GitHub API and still returned 404, so E-K-03 remains **Planned** and this entry claims no implementation, tests, merge or deployment. RFCs 4301, 7296, 4303, 4106, 5282, 7748, 8031, 8221, 8247, 9395, 9370 and 9827 plus the current IANA registry were independently cross-checked to fix the executable contract: ordered SPD outcomes; four-message PSK IKEv2 with Curve25519/X25519 method 31, HMAC-SHA2-256 PRF and AES-GCM-16/128; the first Child SA inside IKE_AUTH; two directional ESP SAs; distinct IKE and ESP AAD; explicit transform-0 sequence state; authenticate-before-window-update replay handling; exact transport-mode echo/fallback behavior; and fresh rekey state. The profile records mandatory recipient handling separately from optional all-zero rejection and does not turn implementation requirement levels into deployment advice. |
| 2026-10-25 | E-K-03 specification publication | [Crypto Lab PR #282](https://github.com/systemslibrarian/crypto-lab/pull/282) merged as exact main `427bac350286`. Six PR workflows passed all 11 applicable jobs, with only the event-inapplicable schedule drift job skipped. Seven exact-main workflows then passed 14 jobs, again with only that schedule-only job skipped: [Protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40176763619), [Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40176763648), [README/catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40176763639), [Three arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40176763638), [public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40176763650), [learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40176763620) and [Pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40176763879). Pages deployed the exact merge; the public 256,165-byte roadmap matched it byte for byte at SHA-256 `249cfbf44e5a2aec8d0a12d53fdba6678b53ce60d79358d2b3299ce856711fb0`. E-K-03 remains **Planned** because its focused repository is still absent; this publication adds no implementation credit. |
| 2026-10-25 | S01 signcryption delivery | [HPKE Envelope PR #31](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/pull/31) merged as exact main `fcf3b56c06e1`. Final-head [run 40178893409](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/actions/runs/40178893409) and exact-main/deployment [run 40179028196](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/actions/runs/40179028196) passed 258 unit tests, 27 hosted Chromium claim/accessibility tests and all 19 clean-baseline S01 mutations. The public HTML, JavaScript and CSS matched a fresh exact-main build byte for byte. The live lesson executes the recipient-key-compromise Auth forgery and separately bounded Ed25519 Sign-then-Encrypt comparison across nine cases, with pinned identities, expected context, strict verification, replay and transferable-evidence limits visible. S01 is **Live**; S06 remains repository-blocked and A-D-05 is the next immediately implementable unassigned item. |
| 2026-10-25 | S01 Hub publication | [Crypto Lab PR #284](https://github.com/systemslibrarian/crypto-lab/pull/284) merged as exact main `26906f7654b6`. All six PR workflows passed 11 applicable jobs, with only the event-inapplicable schedule drift job skipped. Seven exact-main workflows then passed 14 jobs, again with only that schedule-only job skipped: [Public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40180422977), [learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40180423040), [Pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40180422584), [protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40180423088), [three arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40180422989), [README/catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40180423017) and [Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40180423152). Pages deployed the exact merge. The public catalog (806,218 bytes, SHA-256 `dc7fddc2de4618c81d52c64c9185e49ee1c391e3cf1a15f99b069a6256b81368`) and roadmap (266,034 bytes, SHA-256 `e18f66d8c20acfd71a058ed9650b28f3ee8baee72ce623186383031ece70118d`) matched exact main byte for byte, as did README, CATALOG, concept coverage and the knowledge-map JSON. The live HPKE card credits only the executable KCI attack; its old Apple service phrase and nonce-collision sibling link no longer appear as Key recovery or Nonce reuse attacks. |

Apply the repository’s existing workflows from [CLAUDE.md](../CLAUDE.md) and the relevant lab’s instructions. Re-read current source before upgrading a pin. Generated algorithm fields and catalog/README output remain generator-owned. Preserve exact evidence and current-source guards; do not turn a README mention, UI label or failed finite search into an implementation/security claim. Each rendered result must be derived from that run, and changed inputs must retire stale verdicts.

## Audit provenance and interpretation

- Source audit: `audit-deliverable.json`, 2026-10-23; SHA-256 `89fa56f83d8b2b30347b2b9c967bbdb09cb81ad2035c55bb069178e7375da4a8`. All 48 findings are represented once in the numbered proposal sections above.
- Audit baseline: [main 743f03b9c6134cdcf51b79189e4eadab41bf85ea](https://github.com/systemslibrarian/crypto-lab/blob/743f03b9c6134cdcf51b79189e4eadab41bf85ea/CATALOG.md), with 243 standalone labs and 1,726 mapped standalone sections; hub workshops were reviewed separately. The rollout checkout observed while writing this ledger was `cc49eb16881e1b4cf1c8a7a17c0a77aa7b1bda57`. These are snapshot revisions, not permanent claims about current main.
- Screening covered the titles/definitions of all 2,029 named entries, including 969 cross-references and 1,060 substantive entries; 69 selected entry bodies received full-entry review, and 41 targeted repository heads were checked. It was not a word-for-word review of the whole encyclopedia or every repository file.
- The original audit did not runtime-test apps. Existing-coverage statements above retain their source-review scope. The new rollout must supply runtime evidence for any implemented learner behavior.
- Priorities are curriculum judgments. A partial/depth proposal does not mean the entire subject is absent. Re-evaluate a proposal when current source changes; record narrowing or withdrawal without recycling its ID.
- The encyclopedia supplies a topic inventory. Current primary papers/specifications must establish implementation semantics, security models and parameters; historical security or performance statements are not current deployment guidance.
