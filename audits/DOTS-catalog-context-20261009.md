# Catalog teaching-context review, 2026-10-09

Hub starting SHA: `f290adb17faaa1902fc6c1e6375ad481ae91f1e0`.

The catalog previously credited attacks mentioned in biographies, prevention explanations, security risks or explicit exclusions. It also credited comparison parameters and symbolic terms as primitive implementations. Read the current README and implementation of each source below before recording a review at its exact SHA. These repairs describe the demonstrated teaching scope; application tests do not establish compiler or opaque-binary provenance.

| Repository | Inspected SHA | Source-backed interpretation |
| --- | --- | --- |
| crypto-lab-iron-serpent | `ad43da5eefeeac37d662c939f208a62ca488d609` | Read current README, author biography, Argon2 worker/KDF and MAC/Serpent paths. Weak-passphrase risk and Eli Biham's biography are references, not executed attacks. Argon2id call at kdf.ts:48 remains verified; external WASM source/compiler provenance remains unresolved. |
| crypto-lab-sphincs-ledger | `bd4ec08e10b1d543439c4d371f8daf9cb451cd35` | Read current main.ts hash-only security panel and README: factoring/discrete-log assumptions are explicitly unnecessary, not attacks executed by this hash-based signature lab. |
| crypto-lab-dead-sea-cipher | `f0bf09cc973e79eeabc7e1401b7ea66c36175094` | Read current README production limitation and classical cipher/AES source. Missing protection from side-channel extraction is a limitation; preserve real brute-force and frequency-analysis demonstrations. |
| crypto-lab-kyber-vault | `394479e8df1e941e4618de5f407fe810bdc7ba26` | Read current LWE search-space helper, FO explanation and assurance/power-research panel. Search-space count is not enumeration; FO prevention and external side-channel research are references/limitations, not browser attacks. Preserve actual LWE/ML-KEM/AES and tests. |
| crypto-lab-dilithium-seal | `cefaaacd854329b40ca70f25d844ad8b86ebc411` | Read current comparison table, Shor explanation, README risks, timing-variability panel and runtime assurance limits. These five credits are references/negated claims/risks. Preserve measured signing-time variability (Timing side-channel); it is explicitly not key recovery or hardware trace validation. |
| crypto-lab-zk-arena | `96f5ec88184aef25f7ed141e4dc35ccd83043b64` | Read current proof-size visualizer and Schnorr prover. starkProofBytes estimates comparison sizes, not a STARK prover. Preserve actual Schnorr/Fiat-Shamir/BSGS and reference STARK. |
| crypto-lab-broken-trust | `2f1cd8b5f8fab914ecc52971105b57c28e405818` | Read current README and paperData/model source. ML_DSA_SETS stores published parameters/results; the disclosed dimension-eight optimization model has no real ML-DSA key or signature. N/A applies to named primitive implementations, not absence of a working toy model. |
| crypto-lab-kem-trap | `df1798af8fd289168cb06027c6aebcfaaa4223be` | Read current comparison model/paper explanation: schematic partial-ciphertext comparison does not reproduce the referenced key recovery or break correct ML-KEM. Preserve actual full ML-KEM decapsulation and comparison/oracle-surface teaching. |
| crypto-lab-frozen-heart | `fbcafa21d97e27e1b62fa8b96efa55b2f205a79d` | Read current group.ts and Schnorr README/source: Ed25519 supplies a scalar-order constant; the proof uses Ristretto points, not Ed25519 signatures. Preserve real Ristretto/Schnorr/Fiat-Shamir and Ed25519 reference. |
| crypto-lab-credential-veil | `9ac8fd5c499e11504aff79a96397abdbfa999e97` | Read current README naming note, CONTRIBUTING, bbs sign/verify/proof and ciphersuite. Implements CFRG draft BBS (A,e), not BBS+ (A,e,s); uses BLS12-381 group/pairing without BLS signing. Explicit BBS source anchor preserves genuine implementation, official draft vectors recorded separately. |
| crypto-lab-protocol-checker | `11afc3b81faf85dbcd70df4be6b24f42437b5a91` | Read current symbolic protocol/terms and honesty panel. DH is symbolic term algebra; listed key recovery/discrete-log/padding/timing/side-channel attacks are blind spots, not executed. Preserve genuine bounded symbolic MITM/reachability; N/A means no named arithmetic primitive, not no model. |
| crypto-lab-isogeny-atlas | `587e9b049f356597858564e56b163e442b026495` | Read current README/math/walk.ts: polynomial root factorization is not an integer factoring attack. cglWalk is a real graph walk with disclosed toy edge ordering, not complete kernel-ordered CGL. Preserve real Isogeny walk and tiny-graph brute-force collision enumeration; CGL remains a reference. |
| crypto-lab-dp-noise | `85ca9a3bf809877cca008bd42018de4d0985074c` | Read current README, exact discrete Laplace/Gaussian samplers and continuous Laplace source. Differential privacy bounds nonzero distinguishing advantage; it does not make neighbouring databases indistinguishable. Existing implementation anchors45/40 retained after current-source review. |

Additional previously verified RSA, LWE and Power repairs moved source lines. Re-read those current sources before refreshing their catalog anchors; RSA review pin is `81e413b19edd40bf825dd654798ac397366ad5fc`. Date stamps were regenerated from committed demo history with the existing `lab-dates` generator.

Credential Veil computes CFRG BBS signatures `(A,e)`, rather than BBS+ `(A,e,s)` or BLS signatures. Its BLS12-381 group remains credited. Primary scheme reference: https://datatracker.ietf.org/doc/draft-irtf-cfrg-bbs-signatures/ .

The scanner now rejects bounded negated/risk/biographical attack contexts while preserving executable attack shapes and positive demonstrations. Ambiguous evidence still requires a source-pinned review. The catalog validator rejects reintroduced review-removed attacks as well as implementations. Unknown, N/A and incomplete coverage remain distinct.

## Verification

All commands below exited 0 against the final repair content. The Node test command covered all eight `tests/*.test.cjs` files: 63 passed, zero skipped.

- `node --test tests/card-metadata.test.cjs tests/catalog-standards.test.cjs tests/catalog-teaching-scope.test.cjs tests/deploy-report.test.cjs tests/depth-export.test.cjs tests/hub-accessible-name.test.cjs tests/teach-issues.test.cjs tests/tools-cadence.test.cjs`: passed.
- `node tools/catalog-evidence.js selftest`: passed.
- `node tools/gate-sync.js selftest`: passed.
- `node tools/fleet-sync.js selftest`: passed.
- `node tools/deploy-sync.js selftest`: passed.
- `node tools/corpus-freshness.js selftest`: passed.
- `node tools/lab-dates.js selftest`: passed.
- `node tools/port-sync.js selftest`: passed.
- `node tools/evidence-shape-proof.js`: passed.
- `node tools/clone-guard-proof.js`: passed.
- `node tools/catalog-structure-check.js`: passed.
- `node tools/catalog-sync.js check`: passed.
- `node tools/readme-sync.js check`: passed.
- `node tools/concept-sync.js check`: passed.
- `node tools/level-sync.js check`: passed.
- `node tools/teach-build.js check`: passed.
- `node tools/tools-sync.js check`: passed.
- `node tools/lab-dates.js check`: passed.
- `node tools/validate-manifest.mjs --check-fixtures`: passed.
- `node tools/teach-layout.js`: passed.
- `node tools/corpus-sync.js check ../crypto-counsel/corpus.json`: passed.
- `node tools/catalog-evidence.js verify`: 1,566 anchors checked; all resolve and every review pin matches the inspected clone.
- Local Chromium controls at 1366px and 390px: 228 unique cards; Credential Veil/DP wording; search; sorting; beginner filter (32) and clearing (228); zero horizontal overflow and page/console errors.
- `git diff --check`: passed.

Generation used `node tools/catalog-evidence.js write --lab <slug>` for the 13 reviewed targets and RSA/LWE/Power, `node tools/catalog-sync.js write`, `node tools/readme-sync.js write`, and `node tools/lab-dates.js`. The catalog contains 228 labs and 175 named algorithms after adding the independently inspected BBS implementation.

The initial full check found five stale demo dates; those were regenerated and the complete applicable suite then passed. The initial browser fixture attempted to open an already-open desktop filter panel; the final fixture uses the desktop/mobile visibility distinction. These local results establish neither a new production deployment nor a lab-code merge.

The repair is intended for a reviewed branch/PR. Existing hub publication, lab source and unresolved binary/compiler provenance are outside this change.

## Current integration review, 2026-10-10

All 13 interpretation source SHAs in the table were fetched and independently confirmed unchanged. Subsequent Dot repairs moved HTTPS Padlock to `8065456c2dd118341ae3a30f59e9b3993ec2b09b` and E91 to `1168cf259655710b12040982a83545c395f99326`. A fresh anchor check exited 1: one HTTPS stale review and one moved E91 side-channel anchor. Those were preserved as failures, not waived.

Re-read HTTPS hostname extraction, PKI signature verification, ClientHello construction and the complete source diff; refreshed that review after its verified bounded URL/SNI/reflow repair, preserving captured-certificate, offline, root-store and partial-validation limits.

Re-read E91 engine, comparison data, README and the UI honesty panel. Its BB84 credit points to a comparison table, while the side-channel anchor is inside “Does not model”; the MITM anchor is an unauthenticated-channel warning. Neither is an executed attack. A scoped review removes those credits and anchors E91 at the actual `runE91` statistical simulator, explicitly distinguishing this from physical QKD or a finite-key security proof. Two new negative catalog controls fail on the prior card and pass after guarded regeneration; actual measured Dilithium timing, Dead Sea enumeration and isogeny collision demonstrations remain credited.

Generation used the existing guarded catalog writer for only HTTPS Padlock and E91, followed by catalog, README and committed-history date generators. No stale-review guard was bypassed, no unknown or opaque source was reclassified as verified, and no lab code or workflow was changed in this follow-up. Local receipts retain exact negative and positive outputs and separately dated source checks.

Final current candidate checks: all 24 commands above and their added anchor/browser/diff controls exited 0; 63 Node tests, zero skips; 1,564 anchors resolve and all scoped review pins match current source. Catalog membership remains 228 unique labs, now 176 named algorithms after replacing the comparison credit with the actual E91 model. The full 35-page teaching layout check passed, as did local hub browser search, sorting, filtering and layout controls. Exact stdout/stderr/exit codes are retained in the local maintenance progress directory. GitHub integration and public deployment are separate subsequent evidence states.
