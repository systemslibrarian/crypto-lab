# Encyclopedia implementation roadmap

**Updated:** 2026-10-24 (UTC).

## Current milestone

**Nine implementation milestones are shipped across eight live proposals.** E-K-01 is live end to end in Envelope KMS: its first key-handle exercise and its later import, alias and bounded-search milestone are both deployed. Search Vault now carries L-R-09's query-result integrity exercise, A-D-02's public-key searchable-encryption lesson and L-R-07's bounded Boolean-search lesson. E-K-02's executable HIBE delegation exercise is live in IBE Gate, AES Anatomy carries both A-D-06's classical differential fault analysis and E-K-06's accepted-output fault analysis, and Dedup Vault delivers A-D-01's encrypted-deduplication lesson. [Envelope KMS](https://systemslibrarian.github.io/crypto-lab-envelope-kms/) · [Search Vault](https://systemslibrarian.github.io/crypto-lab-search-vault/) · [IBE Gate](https://systemslibrarian.github.io/crypto-lab-ibe-gate/) · [AES Anatomy](https://systemslibrarian.github.io/crypto-lab-aes-anatomy/) · [Dedup Vault](https://systemslibrarian.github.io/crypto-lab-dedup-vault/)

E-K-01 is **live**: Envelope KMS now searches a declared finite state model for mutable-role, known-key-import and distinct same-value-handle disclosures, distinguishes a completed bounded miss from an incomplete cutoff, and replays found witnesses with real RFC 3394 and AES-GCM. L-R-09 is **live**: Search Vault distinguishes per-record authenticity from completeness and freshness with honest, omission, fabrication and stale-snapshot cases. A-D-02 is **live** there too: a public sender creates randomized Type-3 BLS12-381 PEKS tags, the recipient issues a deterministic trapdoor, the server runs public Test, and a bounded attacker exercises exposed-trapdoor dictionary guessing while the interface keeps search, access, volume and active-guessing leakage separate. L-R-07 is now **live** in the same repository: two actual isolated SSE searches are compared with a bounded two-term OXT adapter over canonical ristretto255 points, five controls measure equality/intersection leakage, and the Path ORAM comparison keeps its separate-server assumptions explicit. E-K-02 is **live**: IBE Gate executes bounded descendant-key delegation, sibling/ancestor failure boundaries, subtree compromise and retained root escrow. A-D-06 is **live**: AES Anatomy derives last-round key constraints from real round-9 AES-128 faults, intersects candidates, reverses the key schedule and verifies the recovered master key. E-K-06 is also **live**: finite samples execute correct and first-round-faulted AES-128, classify exact ciphertext equality and rank one key byte from the selected inputs, while a separate analytic census, a secret-independent null and bounded infection/reference-oracle cases keep the statistical claim scoped. A-D-01 is **live**: Dedup Vault executes fresh-key, local message-locked and RFC 9497 VOPRF-aided modes, measures exact-byte deduplication, and keeps dictionary, role and lifecycle boundaries separate. Shelf Oracle's PIR scope correction is merged and verified, and L-R-04 compressed-query implementation is now **in progress** there. The counts below describe whole proposals.

| Proposal status | Count |
| --- | ---: |
| Planned | 39 |
| In progress | 1 |
| Verified | 0 |
| Merged | 0 |
| Live | 8 |
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

**Implementation work:** complete the active L-R-04 Shelf Oracle extension: independently review its bounded four-block compressed-query construction, finish the learner-visible comparison and negative cases, and run the complete unit, build, hosted browser/accessibility and publication gates before any merge or live credit. Preserve the live L-R-07 source and proof boundaries. Optional P2 workshop depth and P3 specialist scope remain queued choices, with no implied delivery dates.

**Maintainer feedback — optional:**

- [ ] Try Dedup Vault's three modes, role views and lifecycle cases; note any explanation, boundary or control that feels unclear.
- [ ] Flag any change you want in the next implementation queue below.

### Next implementation queue — implementation owner: assistant

1. **L-R-04 — PIR compressed queries:** finish and independently audit the active four-block expansion lesson against current Shelf Oracle, then compare actual compressed and direct one-hot query representations while deriving evaluation-key, upload, response, server-operation and noise costs from the implementation.

The phase tables below group the whole backlog; this short queue records the next work to pick up. Recheck current source before starting each item.

## Delivery evidence for completed milestones

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

### Hub catalog and roadmap

The current integration records **244 labs** and **1,740 reviewed sections**, eleven more than the 1,729 on the prior Hub baseline. In addition to preserving the existing LFSR Trivium, first Envelope KMS key-handle and Search Vault query-integrity sections, it maps Envelope KMS's bounded key-handle state search, IBE Gate's executable HIBE delegation, AES Anatomy's classical DFA and accepted-output fault lessons, Dedup Vault's five A-D-01 exhibits, Search Vault's executable A-D-02 PEKS exhibit and its bounded L-R-07 OXT exhibit. It updates their cards and the knowledge map, pins the current reviewed source revisions, and retains Search Vault's repaired query-integrity catalog prose. The forty concept boundaries and their statuses remain unchanged.

The source mappings were checked against committed AES Anatomy `1f0f6b86a2dd`, IBE Gate `7dfebaff27c4`, Dedup Vault `3cbf467bdb1a` and Search Vault `d904972690e1`; Envelope KMS, LFSR Forge and Shelf Oracle were separately re-reconciled against current main and live deployments. The scoped algorithm review keeps excluded side-channel and mutation-only fault mentions out of implementation credit, distinguishes differential fault analysis from ordinary differential cryptanalysis and deterministic finite automata, and records SIFA, HIBE, the DupLESS-shaped VOPRF substitution, Type-3 PEKS and bounded OXT adapter as teaching adaptations rather than inheriting their papers' full results. The `ed25519.js` module filename used to import noble's ristretto255 group is not catalogued as an Ed25519 implementation or reference. Catalog schema/source checks, generated-file freshness checks, search/structure checks, knowledge-map assertions, teaching-scope controls and the broader non-browser CI suites gate this integration. This is verification of the changed mappings, not a new runtime test of all 244 labs.

The A-D-01, A-D-02 and L-R-07 integrations close vocabulary gaps rather than leaving their central claims as unchecked card labels. Message-locked encryption has a reviewed implementation anchor in Dedup Vault; PEKS and OXT have exact Search Vault source anchors with their searchable-encryption family and non-standardization boundaries recorded. Dictionary attack credit was checked one lab at a time against committed source and retained for ten learner-executed searches: Search Vault, Dedup Vault, Phantom Vault, Bcrypt Forge, Commit Gate, OPAQUE Gate, PSI Gate, PAKE Gate, SPAKE Gate and DNSSEC Chain. Search Vault's imported `bls` module alias does not implement a BLS signature, its mutation-test default does not execute a cryptographic fault, and the noble module filename does not turn ristretto255 into Ed25519; all three false credits are excluded. Quantum Vault's only dictionary match remains an explicitly out-of-scope threat. Commit Gate's live P-256 point arithmetic remains implementation credit, while its expressly non-RFC 9380 try-and-increment teaching map remains comment-only. Teaching-scope mutations now fail if OXT, ristretto255, HMAC-SHA-512, PEKS or active-guessing evidence disappears, if a Search Vault false positive returns, if any positive dictionary credit or Dedup's message-locked implementation disappears, or if the Quantum threat-only mention is promoted to an executed attack.

[Hub PR #254](https://github.com/systemslibrarian/crypto-lab/pull/254) published the completed E-K-01 mapping as merge commit [`8e1880454949`](https://github.com/systemslibrarian/crypto-lab/tree/8e18804549499bac2581bedc660e56c1514300df). All seven exact-main workflows passed: [Learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369430), [Protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369432), [Three arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369426), [Public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369462), [README catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369460), [Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369425) and [Pages deployment](https://github.com/systemslibrarian/crypto-lab/actions/runs/40049369417). The deployed catalog was fetched after that deployment and matched `index.html` from the merge commit byte for byte: 784,834 bytes, SHA-256 `9a97c1be9c6e39844ed92c8fe43bd43ec6a7c45290d349fd399f0f5931a74304`; its updated Envelope KMS card appeared exactly once.

[Hub PR #256](https://github.com/systemslibrarian/crypto-lab/pull/256) published the A-D-01 card, five-exhibit map and reviewed vocabulary boundaries as merge commit [`5a4387d63b7c`](https://github.com/systemslibrarian/crypto-lab/tree/5a4387d63b7c1a904f7d6be89253e4f027893af3). All seven exact-main workflows passed: [Learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915563), [Protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915687), [Three arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915590), [Public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915598), [README catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915569), [Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915594) and [Pages deployment](https://github.com/systemslibrarian/crypto-lab/actions/runs/40057915954). Fourteen executed jobs passed; the event-inapplicable drift job alone was skipped. The deployed `index.html` matched the merge commit byte for byte: 789,782 bytes, SHA-256 `db0287a91fddf4a9588820adee4ef547f75cb8b53c395a4a641105c0080c53f3`; it contains 244 project cards and exactly one Dedup Vault card with the correct GitHub Pages link. Hosted logs also reported action-runtime deprecation notices and one moderate npm dependency finding in each shared npm install; no test or deployment gate was bypassed, and those maintenance signals are not counted as cryptographic acceptance evidence.

[Hub PR #258](https://github.com/systemslibrarian/crypto-lab/pull/258) published the A-D-02 card, PEKS exhibit map, reviewed algorithm/attack boundaries and L-R-07 design as merge commit [`402f87ed4198`](https://github.com/systemslibrarian/crypto-lab/tree/402f87ed419872d22b34391c4b46dee80e4956e2). All seven exact-main workflows passed: 14 jobs succeeded and only the event-inapplicable scheduled drift job was skipped. The [Pages run 40062710009](https://github.com/systemslibrarian/crypto-lab/actions/runs/40062710009) built and deployed that exact revision. The public `index.html` matched the merge commit byte for byte at 791,777 bytes and SHA-256 `21f7bdcbf7f41ebe2b0f1f132ac788ad437f5d8f4ccc2cd657d8c4cf4a2bcd1b`; the Search Vault PEKS card, source pin and GitHub Pages link each occur exactly once. The served roadmap also matched exact main byte for byte at 147,109 bytes and SHA-256 `4280cd4ed07b9ddd67ba85788b5ae013fc6a1ab9297b55b5fd8039a28777267a` before this later status update.

[Hub PR #260](https://github.com/systemslibrarian/crypto-lab/pull/260) published the completed L-R-07 OXT exhibit map, Search Vault source pin and reviewed teaching boundaries as squash commit [`89215362ee59`](https://github.com/systemslibrarian/crypto-lab/tree/89215362ee5980571c1e75760085c67709b7ec3f). All seven exact-main workflows passed: [Three arcade games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500907), [Pages deployment](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500502), [Public evidence](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500906), [Protocol workshops](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500957), [Learning games](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500972), [README catalog](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500919) and [Teach pages](https://github.com/systemslibrarian/crypto-lab/actions/runs/40089500924). Fourteen jobs succeeded and the event-inapplicable scheduled drift job alone was skipped. The deployed `index.html` matched exact main byte for byte at 792,411 bytes and SHA-256 `3a13bc46b45bb1584e683f64b1085c244f717de3b32b4d499580f36a2d5823a2`; the served roadmap also matched exact main at 156,366 bytes and SHA-256 `b24c8103a270908f0d59465091e077d8cf8763baf9701eba39ccff84b28daf2` before this later status update.

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
| M-SHELF | **Live** | [PR #14](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/pull/14), merged as `882c4f0083fd6b6513b77c2e8e1acfba4b624e65`, scopes O(N) scanning to the direct one-hot construction and cites preprocessing alternatives with setup/state/refresh costs. Exact-main [run 39973030539](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/actions/runs/39973030539) passed 87 unit and 31 hosted browser tests and deployed; served JavaScript and CSS matched a fresh build byte-for-byte. | This documentation correction does not complete L-R-05 or A-D-10. The demonstrated direct one-hot implementation still scans every row; preprocessing alternatives carry setup, state and refresh costs. |

Evidence: [Trivium controls and explicit limits](https://github.com/systemslibrarian/crypto-lab-lfsr-forge/blob/2800c76acf9ddc7bd79210327372b95b64d444e6/src/trivium/panel.ts#L17); [zero-round recovery](https://github.com/systemslibrarian/crypto-lab-lfsr-forge/blob/2800c76acf9ddc7bd79210327372b95b64d444e6/src/trivium/zero-round.ts#L46). Shelf’s corrected [README at the merge commit](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/882c4f0083fd6b6513b77c2e8e1acfba4b624e65/README.md) is present on main. Its [PR gate](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/actions/runs/39972300157) passed; the [post-merge build and deployment](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/actions/runs/39973030539) also passed. The corrected pinned README was retrieved and checked.

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
| Phase 2 — Privacy, storage and query integrity | 11 | P1 | 5 live; 1 in progress; 5 planned |
| Phase 3 — Protocols and arithmetic | 5 | P1 | 5 planned |
| Phase 4 — Construction and cryptanalysis depth | 16 | P2 | 2 live; 14 planned |
| Phase 5 — Advanced privacy and optional workshop depth | 8 | P2 | 8 planned |
| Phase 6 — Optional specialist and research scope | 7 | P3 | 7 planned |

### Coordination and optional scope

- L-R-05 and A-D-10 share one preprocessing/stateful PIR project with separate acceptance criteria. L-R-04 adds query compression and must keep server work separate from communication.
- Search extensions A-D-02, L-R-07, E-K-08 and L-R-08 share the Search Vault baseline, but have distinct roles, query semantics and leakage.
- A-D-06 teaches classical AES faulty-output recovery before E-K-06’s accepted-output selection leakage. Existing lattice faults and AES layer ablations remain credited.
- A-D-03 and L-R-03 can share an advanced ABE project; policy hiding, independent authorities and revocation need separate claims. E-K-02’s actual descendant key delegation is a different interface.
- S03 and E-K-05 are explicitly optional P2 workshop extensions. Their existing hub workshops already execute basic timestamping and direct/ideal-intermediary fair exchange.
- All seven Phase 6 proposals are optional specialist/research scope. Implementation must first select a faithful primary construction and precise model; a conceptual version must be labeled conceptual.

## Phase 1 — Stateful key-handle policy

The complete bounded E-K-01 proposal is delivered, and the two maintenance corrections are recorded above.

<a id="e-k-01"></a>

### E-K-01 — Stateful cryptographic API misuse and nonextractable key policies

**Priority:** P1 — next · **Status:** Live · **Workstream:** Stateful key APIs.

**Target:** Envelope KMS, linked to Protocol Checker.

**Existing base:** Envelope KMS executes wrapping, raw DEK retrieval, AAD/tenant binding, rotation and an opt-in caller/key/operation grant model. Protocol Checker searches message-role/attacker-knowledge states and explains symbolic attack traces.

**Acceptance criteria:**

- [x] First exercise: create protected key handles, expose an explicit attribute/operation policy, and execute a reproducible wrap/decrypt trace that discloses a protected key using only permitted modeled API calls.
- [x] Compare a vulnerable policy with a specific restrictive policy; show the same attack being rejected at the responsible transition and keep legitimate operations working. Derive every disclosure/rejection verdict from the current state.
- [x] Complete the broader proposal with import/attribute-confusion and alias-state cases plus bounded state search. Record the invariant, attacker knowledge, transition rules and search bound; a manual trace alone does not complete these extensions.

**Next action:** Preserve the verified model boundaries and source pins while the implementation queue advances to L-R-04.

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

**Next action:** Preserve the delivered source and Hub pins and retain the verified adaptation and non-claim boundaries while the implementation queue advances through L-R-04. The Hub catalog and Crypto Counsel corpus publications are merged and live.

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

**Next action:** Preserve the delivered source, proof/non-claim boundaries and Hub mapping while the implementation queue advances to L-R-04.

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

**Priority:** P1 — next · **Status:** In progress · **Workstream:** Advanced PIR.

**Target:** Shelf Oracle extension.

**Existing base:** Shelf Oracle `882c4f0083fd` implements real BFV ciphertext arithmetic and one encrypted selection bit per record; the server folds every record. Its README explicitly says SealPIR query expansion is absent. Active local implementation adds a bounded adaptation that covers the 64-record catalog with four fixed 16-selector ciphertext blocks: the client keeps the selected block and index private, the server receives no plaintext selector metadata, expands every block, scans all 64 records and returns four fixed response ciphertexts.

**Acceptance criteria:**

- Retrieve the same record using existing direct one-hot ciphertexts and an actual compressed-query representation.
- Trace server expansion and account for evaluation keys, serialized upload, response bytes, server operations and noise.
- Compute the comparison from the implementation instead of copying SealPIR paper measurements.

**Next action:** Complete the independent cryptographic/source audit and the unit, build, browser/accessibility and mutation gates for the active implementation. Reconcile any finding without weakening existing checks, then open a Shelf Oracle PR only after the complete local evidence is final.

**Scope and limits:** Query compression and sublinear server work are separate claims. This bounded teaching adaptation uses four fixed blocks and four fixed responses to avoid revealing which 16-record block contains the selection; it does not claim one-ciphertext expansion across all 64 records. No final test, merge, deployment or live learner-behavior credit is recorded yet.

**Audit references:** [PIR with Compressed Queries (original PDF pp. 4502–4509)](https://doi.org/10.1007/978-3-030-71522-9_1792).

**Pinned baseline:** [Shelf Oracle 882c4f0083fd](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/882c4f0083fd6b6513b77c2e8e1acfba4b624e65/README.md).

<a id="l-r-05"></a>

### L-R-05 — Offline/online and stateful PIR

**Priority:** P1 — next · **Status:** Planned · **Workstream:** Advanced PIR.

**Target:** Shelf Oracle advanced mode or companion, linked to ORAM Vault.

**Existing base:** Current PIR executes direct per-query scanning with a real cost comparison; ORAM Vault teaches a different model with local position-map/stash state. Oblivious Shelf names offline/online deployment examples, but does not run such a protocol.

**Acceptance criteria:**

- Execute one preprocessing/stateful PIR construction beside the direct scan and separate setup, online work, storage and total amortized cost.
- Exercise hint consumption/refresh, client-state loss and a database update; show their effect on correctness and cost.
- State the construction's lower-bound and trust model and distinguish PIR state from ORAM state.

**Next action:** Design one shared advanced-PIR implementation with A-D-10, including update and lost-state cases; the README scope correction is already implemented locally.

**Scope and limits:** Correcting the README does not implement preprocessing. No universal speedup or universal O(N) online-work claim.

**Audit references:** [Private Information Retrieval with Preprocessing (original PDF pp. 4826–4832)](https://doi.org/10.1007/978-3-030-71522-9_1470); [Private Stateful Information Retrieval (original PDF pp. 4840–4845)](https://doi.org/10.1007/978-3-030-71522-9_1466).

**Pinned baseline:** [Shelf Oracle 852f23ff8b40](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/852f23ff8b406bd7f98f06cbea34f5cec6cca389/README.md); [ORAM Vault 8a2aa66111da](https://github.com/systemslibrarian/crypto-lab-oram-vault/blob/8a2aa66111da27768a42510c02a2391ee409f1e6/README.md).

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

**Priority:** P1 — next · **Status:** Planned · **Workstream:** Advanced ABE.

**Target:** Attribute Gate advanced extension.

**Existing base:** Attribute Gate has real FAME ABE, policy trees/MSPs, threshold reconstruction, key issuance and a collusion experiment. Its Envelope explicitly includes public policy, expression and MSP fields; the learner sees the policy builder.

**Acceptance criteria:**

- Compare equal-length encrypted records with different sensitive public policies and identify the metadata visible to the observer.
- Execute a specified policy-hiding construction and distinguish hidden attribute values from hidden names and structure.
- Demonstrate authorized decryption while displaying the unauthorized observer's remaining leakage.

**Next action:** Select the precise policy-privacy model and a primary construction before changing the current FAME interface.

**Scope and limits:** Removing the policy tree from the UI does not hide it cryptographically; current FAME remains labeled as public-policy ABE.

**Audit references:** [Attribute Based Encryption with Access Policy Hiding (original PDF pp. 432–436)](https://doi.org/10.1007/978-3-030-71522-9_1461).

**Pinned baseline:** [Attribute Gate d0bb24262e9b](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d0bb24262e9b2b6e47044ef49e5941bdb332e17c/src/fame/system.ts#L71-L80).

<a id="l-r-03"></a>

### L-R-03 — Independent ABE authorities and working revocation

**Priority:** P1 — next · **Status:** Planned · **Workstream:** Advanced ABE.

**Target:** Attribute Gate advanced extension or companion.

**Existing base:** Attribute Gate executes single-authority FAME, threshold policy reconstruction, a same-authority collusion failure, authority escrow and an explicit no-revocation demonstration. README prose names multi-authority/threshold issuance as possible mitigations.

**Acceptance criteria:**

- Issue independently controlled attributes from two authorities; allow same-user combination and test rejection of pooled attributes belonging to different users.
- Compromise one issuer and show which policies still depend on the other.
- Implement a separate epoch/update revocation mechanism and expose retained old-key/ciphertext access, update costs and escrow.

**Next action:** Select one multi-authority scheme and define identity binding and revocation as separate claims in the same project.

**Scope and limits:** Independent issuers alone do not solve revocation; a date string alone is not the new revocation mechanism.

**Audit references:** [Multi-authority and Decentralized Attribute-Based Encryption (original PDF pp. 3945–3950)](https://doi.org/10.1007/978-3-030-71522-9_1458).

**Pinned baseline:** [Attribute Gate d0bb24262e9b](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d0bb24262e9b2b6e47044ef49e5941bdb332e17c/README.md).

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

**Priority:** P1 — next · **Status:** Planned · **Workstream:** Private aggregation and DP.

**Target:** Cross-lab extension using Proof Tally/Silent Tally and DP Noise.

**Existing base:** Proof Tally and Silent Tally compute private aggregates; Proof Tally explicitly adds no DP. DP Noise runs privacy mechanisms/accounting separately. SPDZ models malicious-party computation.

**Acceptance criteria:**

- Demonstrate disclosure from an exact secure aggregate, then compute a release with calibrated jointly generated noise.
- Declare clipping, adjacency, sensitivity, distribution and accounting, and vary corrupt or dropped participants.
- Compare central, local and distributed/shuffled trust assumptions and show precisely when the stated guarantee no longer applies.

**Next action:** Select one secure-aggregation plus DP composition and derive its honest-party and dropout requirements before coding.

**Scope and limits:** Secret sharing and arbitrary summed party noise do not themselves establish differential privacy.

**Audit references:** [Secure Computation of Differentially Private Mechanisms (original PDF pp. 5492–5499)](https://doi.org/10.1007/978-3-030-71522-9_1714).

**Pinned baseline:** [Proof Tally fe703a3d31e2](https://github.com/systemslibrarian/crypto-lab-proof-tally/tree/fe703a3d31e22fd6961d736af428abf0eda8108a); [DP Noise ea6eac3e9fc1](https://github.com/systemslibrarian/crypto-lab-dp-noise/tree/ea6eac3e9fc145c9f3306d4f6610b0662f8a794f); [SPDZ Forge d5d8b60211fa](https://github.com/systemslibrarian/crypto-lab-spdz-forge/tree/d5d8b60211fa4842cd83ebab27699a9b097a9b10); [Silent Tally 108c5da4c880](https://github.com/systemslibrarian/crypto-lab-silent-tally/tree/108c5da4c880472187ee14dc093b952429ea5af8).

<a id="s02"></a>

### S02 — Key-evolving audit logs after compromise

**Priority:** P1 — next · **Status:** Planned · **Workstream:** Durable cryptographic evidence.

**Target:** Envelope KMS extension linked to Merkle Proofs, Key Mirror and Stream Ward.

**Existing base:** Envelope KMS has a real SHA-256 linked audit log. Merkle Proofs already runs rewrite/delete/reorder checks against trusted roots; Key Mirror adds retained anchors, signed heads and gossip. Stream Ward teaches final-marker truncation.

**Acceptance criteria:**

- Compromise the current logging key at a chosen event and compare ordinary keyed logging with a specified forward-secure authenticator.
- Attempt earlier and later record rewrites and compute which records remain protected under the key-evolution and erasure assumptions.
- Compose with retained checkpoints and truncation controls, making forward integrity, append-only consistency and freshness separate results.

**Next action:** Select the key-evolution construction and define the compromise event and modeled erasure boundary.

**Scope and limits:** Hash chaining and trusted-root rewrite detection already exist. Browser key erasure is a model assumption, and key evolution alone does not prevent truncation.

**Audit references:** [Secure Audit Logs (original PDF pp. 5482–5486)](https://doi.org/10.1007/978-3-030-71522-9_688).

**Pinned baseline:** [Envelope KMS 3fcc80aa1e36](https://github.com/systemslibrarian/crypto-lab-envelope-kms/tree/3fcc80aa1e36576d8e728aa05f0efcdc5e4862ff); [Merkle Proofs bc58ccd5b628](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/tree/bc58ccd5b628403e8c5002df74fa304b0ce16021); [Key Mirror 605ac80779c6](https://github.com/systemslibrarian/crypto-lab-key-mirror/tree/605ac80779c6821afb42da5db651d4f72c1ed553); [Stream Ward 6109350d814f](https://github.com/systemslibrarian/crypto-lab-stream-ward/tree/6109350d814ff614012a32c1d745c8f275fddae8).

## Phase 3 — Protocols and arithmetic

Add the remaining P1 mechanisms with explicit protocol, adversary and arithmetic boundaries.

<a id="a-d-04"></a>

### A-D-04 — Dining-cryptographers anonymous broadcast

**Priority:** P1 — next · **Status:** Planned · **Workstream:** Anonymous communication.

**Target:** New focused DC-net lab.

**Existing base:** Sphinx Mix executes packet construction/peeling and traffic-model anonymity; Blind Relay splits source identity and HTTP content across operators. Silent Tally privately aggregates Shamir-shared counts.

**Acceptance criteria:**

- Compute pairwise fresh masks, participant broadcasts and their cancellation to reveal one anonymous sender's message.
- Compare each participant's and a coalition's possible-sender views under the declared key graph.
- Exercise simultaneous senders, malformed contributions and mask reuse, with synchrony and disruption assumptions visible.

**Next action:** Define the small participant graph and adversary views, then implement the classical DC-net mechanism.

**Scope and limits:** Separate information-theoretic fresh masks from pseudorandom generation and avoid importing dated open-problem claims.

**Audit references:** [Dining Cryptographers (DC) Network (original PDF pp. 1747–1751)](https://doi.org/10.1007/978-3-030-71522-9_194).

**Pinned baseline:** [Sphinx Mix 51c0b320ba40](https://github.com/systemslibrarian/crypto-lab-sphinx-mix/blob/51c0b320ba40cc97236a5d3ddd0e6e5840491917/README.md); [Blind Relay b3732c88b2d4](https://github.com/systemslibrarian/crypto-lab-blind-relay/blob/b3732c88b2d4ba4e3b94c8f949cb5f4243b17c8b/README.md); [Silent Tally 108c5da4c880](https://github.com/systemslibrarian/crypto-lab-silent-tally/blob/108c5da4c880472187ee14dc093b952429ea5af8/README.md).

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

- Select traffic policy and transport/tunnel mode, trace IKE authentication and establish the first Child SA during IKE_AUTH.
- Compute one modern ESP suite and display encrypted/authenticated fields, one-way SAs and SPI lookup.
- Send reordered, replayed, modified and rekey-boundary packets and show admission decisions from the actual anti-replay state.

**Next action:** Specify a bounded RFC 7296/RFC 4303 teaching profile, packet fields and SA lifecycle before implementing the UI.

**Scope and limits:** Correct the encyclopedia's initial-Child-SA exchange ordering; distinguish modeled policy/routing from cryptographic packet processing and label interoperability omissions.

**Audit references:** [IPsec (original PDF pp. 3260–3268)](https://doi.org/10.1007/978-3-030-71522-9_269).

**Pinned baseline:** [Noise Pipe 689e2b07a366](https://github.com/systemslibrarian/crypto-lab-noise-pipe/blob/689e2b07a3662d0ae9c49594f3372ee7c7987768/README.md#L28).

Implementation correction: [RFC 7296 §1.2](https://www.rfc-editor.org/rfc/rfc7296.html#section-1.2) establishes the first Child SA during IKE_AUTH; do not reproduce the encyclopedia’s extra CREATE_CHILD_SA exchange for that initial SA.

<a id="s01"></a>

### S01 — Signcryption: insider security and transferable evidence

**Priority:** P1 — next · **Status:** Planned · **Workstream:** Public-key composition.

**Target:** HPKE Envelope/Protocol Compose companion comparison.

**Existing base:** Protocol Compose runs MAC/encryption composition; Iron Letter runs ECIES and identity-key MITM defenses. HPKE Envelope already executes Auth modes and context binding, and explicitly describes recipient-key KCI.

**Acceptance criteria:**

- Execute one named signcryption construction beside the existing HPKE Auth baseline with both participant identities and application context bound.
- Compromise a sender or recipient and compute the selected construction's insider/outsider confidentiality and authenticity outcomes.
- Forward a valid object to a third party and distinguish transferable evidence from recipient-only authentication.

**Next action:** Select the signcryption construction and write its exact compromise, multi-user and evidence-transfer model.

**Scope and limits:** HPKE Auth already covers public-key authenticated encryption and context binding. Public verifiability is not a property of every signcryption scheme.

**Audit references:** [Signcryption (original PDF pp. 5952–5963)](https://doi.org/10.1007/978-3-030-71522-9_156).

**Pinned baseline:** [Protocol Compose 5dd48e8f4abf](https://github.com/systemslibrarian/crypto-lab-protocol-compose/tree/5dd48e8f4abf8d222985d1578da699c61c07b0ee); [Iron Letter e5326a46e859](https://github.com/systemslibrarian/crypto-lab-iron-letter/tree/e5326a46e85923e95083baffbad57c9d68af3b16); [HPKE Envelope bb39ab7a5f04](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/tree/bb39ab7a5f048ffd51396de8dc8b99c255f61948).

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

- Show an exposed/easily predicted input predicate under a separately stated one-wayness assumption.
- Compute the random inner-product construction for (f(x), r) and display the biased-predictor reconstruction argument.
- Distinguish finite enumeration from the asymptotic theorem and state the security-parameter assumptions.

**Next action:** Design the easy-predicate counterexample and bounded Goldreich–Levin reconstruction illustration.

**Scope and limits:** Hidden Bit already teaches GGM, DDH reductions and security games; a small-domain experiment cannot demonstrate computational hardness.

**Audit references:** [Hard-Core Bit (original PDF pp. 2700–2702)](https://doi.org/10.1007/978-3-030-71522-9_412).

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

**Scope and limits:** Target collision resistance is not established by empirical collision counts.

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

**Priority:** P2 — depth · **Status:** Planned · **Workstream:** Advanced PIR.

**Target:** Shared advanced-PIR project with Shelf Oracle.

**Existing base:** Shelf Oracle homomorphically folds every database row against a BFV encrypted selection vector; its current README describes one plaintext-ciphertext multiplication per record. Patron Shield reduces communication, while Split Point supplies a different multi-server/DPF route.

**Acceptance criteria:**

- Account separately for wire bytes, records touched and server operations in the current scan-based baseline.
- Implement or clearly label a specified preprocessing model with ProcessDB cost, storage, client state and online response work.
- Measure total-cost crossover and update overhead across repeated queries in the shared L-R-05 project.

**Next action:** Define the cost ledger jointly with L-R-05 and select a construction whose online-work claim can be demonstrated faithfully.

**Scope and limits:** Sublinear communication is not sublinear server work; modeled cost curves must not be reported as implementation timings.

**Audit references:** [Doubly Efficient Private Information Retrieval (original PDF pp. 1817–1822)](https://doi.org/10.1007/978-3-030-71522-9_1479).

**Pinned baseline:** [Shelf Oracle 852f23ff8b40](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/852f23ff8b406bd7f98f06cbea34f5cec6cca389/README.md); [Patron Shield f8a82cf820f7](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/f8a82cf820f7e4d1135fb2fdca214d6b0e553f91/README.md); [Split Point e0b0a2d565e9](https://github.com/systemslibrarian/crypto-lab-split-point/blob/e0b0a2d565e9668af3ad2d9a32889296e4a22dda/README.md).

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

Apply the repository’s existing workflows from [CLAUDE.md](../CLAUDE.md) and the relevant lab’s instructions. Re-read current source before upgrading a pin. Generated algorithm fields and catalog/README output remain generator-owned. Preserve exact evidence and current-source guards; do not turn a README mention, UI label or failed finite search into an implementation/security claim. Each rendered result must be derived from that run, and changed inputs must retire stale verdicts.

## Audit provenance and interpretation

- Source audit: `audit-deliverable.json`, 2026-10-23; SHA-256 `89fa56f83d8b2b30347b2b9c967bbdb09cb81ad2035c55bb069178e7375da4a8`. All 48 findings are represented once in the numbered proposal sections above.
- Audit baseline: [main 743f03b9c6134cdcf51b79189e4eadab41bf85ea](https://github.com/systemslibrarian/crypto-lab/blob/743f03b9c6134cdcf51b79189e4eadab41bf85ea/CATALOG.md), with 243 standalone labs and 1,726 mapped standalone sections; hub workshops were reviewed separately. The rollout checkout observed while writing this ledger was `cc49eb16881e1b4cf1c8a7a17c0a77aa7b1bda57`. These are snapshot revisions, not permanent claims about current main.
- Book: [supplied encyclopedia PDF](https://drive.google.com/file/d/1SzZkTCSygwEKIBenMLpM9r3o2nbdGrto/view), 6,913 pages. Original-page references above mean one-based PDF positions, not publisher printed page labels.
- Screening covered the titles/definitions of all 2,029 named entries, including 969 cross-references and 1,060 substantive entries; 69 selected entry bodies received full-entry review, and 41 targeted repository heads were checked. It was not a word-for-word review of the whole encyclopedia or every repository file.
- The original audit did not runtime-test apps. Existing-coverage statements above retain their source-review scope. The new rollout must supply runtime evidence for any implemented learner behavior.
- Priorities are curriculum judgments. A partial/depth proposal does not mean the entire subject is absent. Re-evaluate a proposal when current source changes; record narrowing or withdrawal without recycling its ID.
- The encyclopedia supplies a topic inventory. Current primary papers/specifications must establish implementation semantics, security models and parameters; historical security or performance statements are not current deployment guidance.
