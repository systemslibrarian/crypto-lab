# Depth audit — 2026-09-25

## Method and coverage

Remote default branches were exported to `.scratch/exports/` and pinned to the linked commit in each ledger row. First-party source, tests, package scripts, README and workflow jobs were read. A lexical hit is a lead, not proof of vector provenance or an outside oracle. The score records adjudicated dimensions as earned weight / assessed weight; `?` is excluded from both terms. It is a depth-of-evidence score, not a security rating. Low assessed weight does not justify ranking.

| Coverage | Labs | Meaning |
|---|---:|---|
| SCANNED | 205 | Readable first-party source and workflows inventoried |
| PARTIAL | 2 | Vendored paths omitted; first-party results are a floor |
| NOT-SCANNED | 0 | No source finding |
| Course worksheet matches | 24 | `teach/_src/worksheets` |

| Dimension | Weight | Credit |
|---|---:|---|
| Ground truth | 4 | named published fixed vector, distinct from generated values |
| Independent check | 4 | second implementation, outside verifier or executed verification script |
| Displayed claim | 2 | assert computed result equals rendered value |
| Negative test | 2 | tamper, reject, wrong-key, replay or malformed-input assertion |
| Deploy gate | 2 | required test/build path; name browser engines and other gates |
| Limits and guidance | 1 | README explains scale and limits without endorsing demo code for deployment |
| Zero-test check | 1 | executed run reports a nonzero test count; empty optional unit step scores zero |

`+` = credited, `0` = inspected and not met, `?` = unresolved or NOT-SCANNED dimension. Unobserved CI output makes the zero-test dimension unknown even where files exist. Scores with differing assessed weights cannot be compared as full scores. Ranking applies to the individually adjudicated entries; other ledger entries remain unclassified.

## Ranked recommendations
### Reference examples

- **kem-trap** (12/12): ACVP-pinned ML-KEM fixtures. [src/__tests__/mlkem.test.ts:63](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/src/__tests__/mlkem.test.ts#L63); gate [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/.github/workflows/deploy.yml#L32).
- **drbg-arena** (9/9): CAVP DRBG returned-bit vectors. [src/crypto/drbg-kat.test.ts:2](https://github.com/systemslibrarian/crypto-lab-drbg-arena/blob/498abbbad73a2286e4e34f1caf8c6a60c9c51a48/src/crypto/drbg-kat.test.ts#L2); gate [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-drbg-arena/blob/498abbbad73a2286e4e34f1caf8c6a60c9c51a48/.github/workflows/deploy.yml#L30).
- **webauthn** (7/7): challenge and origin rejection checks. [test/engine.test.ts:154](https://github.com/systemslibrarian/crypto-lab-webauthn/blob/1485b67de4cd6cf8d48ae7021bd5900fde771227/test/engine.test.ts#L154); gate [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-webauthn/blob/1485b67de4cd6cf8d48ae7021bd5900fde771227/.github/workflows/deploy.yml#L30).
- **frost-threshold** (9/9): Rust signatures checked by ed25519-dalek. [crate/src/pipeline_tests.rs:372](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/crate/src/pipeline_tests.rs#L372); gate [.github/workflows/deploy.yml:52](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/.github/workflows/deploy.yml#L52).
- **protocol-checker** (11/11): published Lowe attack trace and page verdict. [src/symbolic/search.test.ts:7](https://github.com/systemslibrarian/crypto-lab-protocol-checker/blob/4ce2029d8fb2ee96f858c1380ebc596b396c6890/src/symbolic/search.test.ts#L7); gate [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-protocol-checker/blob/4ce2029d8fb2ee96f858c1380ebc596b396c6890/.github/workflows/deploy.yml#L30).
- **ec-point-arithmetic** (14/14): outside secp256k1 arithmetic and published generator coordinates. [e2e/claims.spec.ts:434](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic/blob/fdcf8ca82a6c4e957b9cf41f95075cd03ada92da/e2e/claims.spec.ts#L434); gate [.github/workflows/deploy.yml:60](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic/blob/fdcf8ca82a6c4e957b9cf41f95075cd03ada92da/.github/workflows/deploy.yml#L60).
- **attribute-gate** (11/11): RFC and Wycheproof primitive fixtures separated from self-generated scheme fixtures. [src/fame/kat.test.ts:2](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d41e1f884de7cdbe1945b5e8755ec918a0c3af19/src/fame/kat.test.ts#L2); gate [.github/workflows/deploy.yml:48](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d41e1f884de7cdbe1945b5e8755ec918a0c3af19/.github/workflows/deploy.yml#L48).

### Needs work — teaching impact, then closure effort

1. **padding-oracle** (Course; 5/13): Pin a CBC block encryption/decryption fixture to NIST SP 800-38A and check a displayed recovered byte against the result. Current attack fixtures use generated oracle cases. Evidence: [src/attack.test.ts:1](https://github.com/systemslibrarian/crypto-lab-padding-oracle/blob/83cc80dc7c198f0d02beeafd72508b74e4f72c43/src/attack.test.ts#L1); gate [.github/workflows/pages.yml:41](https://github.com/systemslibrarian/crypto-lab-padding-oracle/blob/83cc80dc7c198f0d02beeafd72508b74e4f72c43/.github/workflows/pages.yml#L41).
2. **patron-shield** (Course; 7/15): Add a separate checker of two-server XOR reconstruction from Chor et al. (1995) and compare the displayed selected book. The paper supplies equations, not a claimed published byte vector. Evidence: [src/pir.test.ts:152](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/72ee34945097f1dad4d34f387a3dcc99c83a2014/src/pir.test.ts#L152); gate [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/72ee34945097f1dad4d34f387a3dcc99c83a2014/.github/workflows/deploy.yml#L30).
3. **nonce-lattice** (Course; 4/12): Cross-check seeded key recovery with a separate lattice solver; keep RFC 6979 deterministic signatures as the negative control. The RFC is not a published attack-output vector. Evidence: [tests/recover-key.test.ts:1](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/blob/979716174e4bf634c61fce15069bd70f808359d6/tests/recover-key.test.ts#L1); gate [.github/workflows/deploy-pages.yml:45](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/blob/979716174e4bf634c61fce15069bd70f808359d6/.github/workflows/deploy-pages.yml#L45).
4. **pairing-gate** (Outside course; 5/14): Replace the empty optional unit step with a required BLS12-381 G1 hash-to-curve point test pinned to [RFC 9380 Appendix J.9.1](https://www.rfc-editor.org/rfc/rfc9380.html#appendix-J.9.1), using the specified suite and DST; include the pairing identity in the test. Evidence: [package.json:5](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/package.json#L5); gate [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/.github/workflows/pages.yml#L29).

### Correctly light

- **biham-lens** (6/14): toy SPN and differential table. Boundary: [README.md:5](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/27249921456d250cb3955f89b2c43bdbc1c5a577/README.md#L5); behavior: [demos/biham-lens/e2e/claims.spec.ts:177](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/27249921456d250cb3955f89b2c43bdbc1c5a577/demos/biham-lens/e2e/claims.spec.ts#L177). A production primitive vector is not required merely for this model.
- **grover** (7/11): small-state amplitude simulation. Boundary: [README.md:14](https://github.com/systemslibrarian/crypto-lab-grover/blob/1997d5e36dbb38f30c914716d03edfb89972bc5b/README.md#L14); behavior: [src/grover.test.ts:42](https://github.com/systemslibrarian/crypto-lab-grover/blob/1997d5e36dbb38f30c914716d03edfb89972bc5b/src/grover.test.ts#L42). A production primitive vector is not required merely for this model.
- **shor** (5/9): small-number factoring simulation. Boundary: [README.md:24](https://github.com/systemslibrarian/crypto-lab-shor/blob/33d40f79952ee275c6451f5555beba1d095fd8ea/README.md#L24); behavior: [test/shor.test.ts:49](https://github.com/systemslibrarian/crypto-lab-shor/blob/33d40f79952ee275c6451f5555beba1d095fd8ea/test/shor.test.ts#L49). A production primitive vector is not required merely for this model.
- **rsa-educational** (6/10): small-prime arithmetic lesson. Boundary: [README.md:1](https://github.com/systemslibrarian/crypto-lab-rsa-educational/blob/37ca24b0425a5ef953ae036702b8e03fa9464bce/README.md#L1); behavior: [e2e/claims.spec.ts:111](https://github.com/systemslibrarian/crypto-lab-rsa-educational/blob/37ca24b0425a5ef953ae036702b8e03fa9464bce/e2e/claims.spec.ts#L111). A production primitive vector is not required merely for this model.
- **otp-vault** (7/11): one-time pad lesson. Boundary: [README.md:5](https://github.com/systemslibrarian/crypto-lab-otp-vault/blob/fc5b39ab859115ecc2814d963f40f6f71e7c76c3/README.md#L5); behavior: [src/otp/challenges.test.ts:18](https://github.com/systemslibrarian/crypto-lab-otp-vault/blob/fc5b39ab859115ecc2814d963f40f6f71e7c76c3/src/otp/challenges.test.ts#L18). A production primitive vector is not required merely for this model.
- **harvest-vault** (5/9): risk timeline model. Boundary: [README.md:46](https://github.com/systemslibrarian/crypto-lab-harvest-vault/blob/4ee75febfe512a965fc9e4f3e672ffb2924fa494/README.md#L46); behavior: [src/transcript.test.ts:41](https://github.com/systemslibrarian/crypto-lab-harvest-vault/blob/4ee75febfe512a965fc9e4f3e672ffb2924fa494/src/transcript.test.ts#L41). A production primitive vector is not required merely for this model.
- **hqc-timing** (4/8): abstract decoder timing, expressly not BCH. Boundary: [README.md:5](https://github.com/systemslibrarian/crypto-lab-hqc-timing/blob/a6c492ef3b021060e6b2d8413a10719acbeb0112/README.md#L5); behavior: [src/engine.test.ts:383](https://github.com/systemslibrarian/crypto-lab-hqc-timing/blob/a6c492ef3b021060e6b2d8413a10719acbeb0112/src/engine.test.ts#L383). A production primitive vector is not required merely for this model.
- **diffie-hellman-mitm** (5/9): toy-prime interception model. Boundary: [README.md:5](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm/blob/8d69dbc7ae4f267d057374fc08d6a0eca76f98bd/README.md#L5); behavior: [scripts/engine.test.mjs:155](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm/blob/8d69dbc7ae4f267d057374fc08d6a0eca76f98bd/scripts/engine.test.mjs#L155). A production primitive vector is not required merely for this model.

The other ledger entries require provenance or outside-check adjudication before ranking. TLS Handshake and PQ TLS Handshake run RFC 8448 checks, and LMS XMSS runs RFC 8554 examples: those fixtures are present. This ranking does not establish an exhaustive fleet priority order.

## Copy and gate findings

- **FROST share boundary:** [crate/src/lib.rs:17](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/crate/src/lib.rs#L17) returns keygen output as `JsValue`, and [crate/src/keygen.rs:55](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/crate/src/keygen.rs#L55) includes hex signing shares. [README.md:12](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/README.md#L12) cautions against production use. Put that warning by API examples so readers do not infer participant isolation from the JavaScript return.
- **Overstated gate:** [.github/workflows/pages.yml:50](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/.github/workflows/pages.yml#L50) says unit tests gate auto-merge, but [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/.github/workflows/pages.yml#L29) uses an optional command with no package test script. The browser accessibility suite still runs.
- **Deployment-style language for contextual review:** Silent Tally [README.md:153](https://github.com/systemslibrarian/crypto-lab-silent-tally/blob/14e5c0d540be889d414498e74d8f61b951ef639e/README.md#L153) says its app “runs in production” in the context of the published demo. Rekey Relay [README.md:127](https://github.com/systemslibrarian/crypto-lab-rekey-relay/blob/abd49d8b1513636cbbb49779aa95df1f007265a0/README.md#L127) attributes audit and production deployment to an outside library; that upstream assurance is NOT-SCANNED. Neither line establishes a deployment recipe for demo code.

| README manual | Regenerated manual | README scheduled | Regenerated scheduled | Count stale |
|---:|---:|---:|---:|---|
| 9 | 9 | 15 | 15 | No |

The generated checker table retains these counts. The obsolete untracked-tool footnote was removed from the README in this audit PR so the generated-table check runs green.

## Per-lab score and evidence
Marks follow **T I C N G H Z** in rubric order. SCANNED describes source inventory; `?` is dimension uncertainty.

| Lab at export commit | Course | T I C N G H Z | Score | Source scan |
|---|:---:|---|---:|---|
| [crypto-lab-aes-modes](https://github.com/systemslibrarian/crypto-lab-aes-modes/tree/843f0f4a3e14248e2aa6cbc56dde35f8bef62ea8) | yes | `+ ? ? + + + ?` | 9/9 | SCANNED |
| [crypto-lab-blind-relay](https://github.com/systemslibrarian/crypto-lab-blind-relay/tree/eb6ac58b889b6a3fee2ec400df15c0255533cfc5) | yes | `+ ? + + + + ?` | 11/11 | SCANNED |
| [crypto-lab-diffie-hellman-mitm](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm/tree/8d69dbc7ae4f267d057374fc08d6a0eca76f98bd) | yes | `0 ? ? + + + ?` | 5/9 | SCANNED |
| [crypto-lab-downgrade-wire](https://github.com/systemslibrarian/crypto-lab-downgrade-wire/tree/3e68efe38c7b582246acc37fc004111a96cfcd35) | yes | `+ ? ? + + + ?` | 9/9 | SCANNED |
| [crypto-lab-dp-noise](https://github.com/systemslibrarian/crypto-lab-dp-noise/tree/5f45e293c0ba55f928eee1854933e149d08564d4) | yes | `+ ? ? + + + ?` | 9/9 | SCANNED |
| [crypto-lab-ec-point-arithmetic](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic/tree/fdcf8ca82a6c4e957b9cf41f95075cd03ada92da) | yes | `+ + + + + ? ?` | 14/14 | SCANNED |
| [crypto-lab-ecdsa-forge](https://github.com/systemslibrarian/crypto-lab-ecdsa-forge/tree/02cef5916297c7242eeab502438272b0c8224e7b) | yes | `+ + + + + + ?` | 15/15 | SCANNED |
| [crypto-lab-grover](https://github.com/systemslibrarian/crypto-lab-grover/tree/1997d5e36dbb38f30c914716d03edfb89972bc5b) | yes | `0 ? + + + + ?` | 7/11 | SCANNED |
| [crypto-lab-harvest-vault](https://github.com/systemslibrarian/crypto-lab-harvest-vault/tree/4ee75febfe512a965fc9e4f3e672ffb2924fa494) | yes | `0 ? ? + + + ?` | 5/9 | SCANNED |
| [crypto-lab-hidden-bit](https://github.com/systemslibrarian/crypto-lab-hidden-bit/tree/00705ccbf695f887065fe0d770b2eacc0487bb38) | yes | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-hybrid-wire](https://github.com/systemslibrarian/crypto-lab-hybrid-wire/tree/5b7ae68ae3bcc19817870b59954442e49f88aab3) | yes | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-kyber-vault](https://github.com/systemslibrarian/crypto-lab-kyber-vault/tree/3aa79354c57cdbb046d471b1157241a71aa52c35) | yes | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-lattice-gentle](https://github.com/systemslibrarian/crypto-lab-lattice-gentle/tree/8a8896f8b9365a3f8665d6002cb3dd91a13942c0) | yes | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-nonce-collision](https://github.com/systemslibrarian/crypto-lab-nonce-collision/tree/27b6677bbcffd8fda8a7a3d9381672bf5c212cbf) | yes | `+ ? ? + + + ?` | 9/9 | SCANNED |
| [crypto-lab-nonce-lattice](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/tree/979716174e4bf634c61fce15069bd70f808359d6) | yes | `0 0 ? + + ? ?` | 4/12 | SCANNED |
| [crypto-lab-otp-vault](https://github.com/systemslibrarian/crypto-lab-otp-vault/tree/fc5b39ab859115ecc2814d963f40f6f71e7c76c3) | yes | `0 ? + + + + ?` | 7/11 | SCANNED |
| [crypto-lab-padding-oracle](https://github.com/systemslibrarian/crypto-lab-padding-oracle/tree/83cc80dc7c198f0d02beeafd72508b74e4f72c43) | yes | `0 0 ? + + + ?` | 5/13 | SCANNED |
| [crypto-lab-patron-shield](https://github.com/systemslibrarian/crypto-lab-patron-shield/tree/72ee34945097f1dad4d34f387a3dcc99c83a2014) | yes | `0 0 + + + + ?` | 7/15 | SCANNED |
| [crypto-lab-protocol-checker](https://github.com/systemslibrarian/crypto-lab-protocol-checker/tree/4ce2029d8fb2ee96f858c1380ebc596b396c6890) | yes | `+ ? + + + + ?` | 11/11 | SCANNED |
| [crypto-lab-rsa-educational](https://github.com/systemslibrarian/crypto-lab-rsa-educational/tree/37ca24b0425a5ef953ae036702b8e03fa9464bce) | yes | `0 ? + + + ? ?` | 6/10 | SCANNED |
| [crypto-lab-rsa-forge](https://github.com/systemslibrarian/crypto-lab-rsa-forge/tree/9d0b997115a252a21f85f808cffc030c316c1c2f) | yes | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-shelf-oracle](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/tree/66c860a4a312f4f1fe79011934ff4a53b0610e16) | yes | `+ ? + + + + ?` | 11/11 | SCANNED |
| [crypto-lab-shor](https://github.com/systemslibrarian/crypto-lab-shor/tree/33d40f79952ee275c6451f5555beba1d095fd8ea) | yes | `0 ? ? + + + ?` | 5/9 | SCANNED |
| [crypto-lab-tls-handshake](https://github.com/systemslibrarian/crypto-lab-tls-handshake/tree/a9785b48a06b8931191942356315d894a3fed5f3) | yes | `+ ? + + + + ?` | 11/11 | SCANNED |
| [crypto-lab-ablation-wire](https://github.com/systemslibrarian/crypto-lab-ablation-wire/tree/8ad03c068a133660b27755ff0910e0391f8e0dcc) |  | `? ? ? ? + ? ?` | 2/2 | SCANNED |
| [crypto-lab-accumulator](https://github.com/systemslibrarian/crypto-lab-accumulator/tree/50db63d594c6220196d157f58d27a7fc2a5e0b41) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-aegis-gate](https://github.com/systemslibrarian/crypto-lab-aegis-gate/tree/63269b7c4ce3bbc3d434dcaaa1c5758b9743d013) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-air-stream](https://github.com/systemslibrarian/crypto-lab-air-stream/tree/1710b2975733c6652d7e14f8bd99dd5027185164) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-ascon](https://github.com/systemslibrarian/crypto-lab-ascon/tree/61c56db0358e56bd3208b172934761af117d64e8) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-attestation-gate](https://github.com/systemslibrarian/crypto-lab-attestation-gate/tree/ac53f430bec712083a1a2d8100dd6c85d2434619) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-attribute-gate](https://github.com/systemslibrarian/crypto-lab-attribute-gate/tree/d41e1f884de7cdbe1945b5e8755ec918a0c3af19) |  | `+ ? + + + + ?` | 11/11 | SCANNED |
| [crypto-lab-babel-hash](https://github.com/systemslibrarian/crypto-lab-babel-hash/tree/74c523b3f3577dbc63ea59bb6b1f75cb3c5edd97) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-bb84](https://github.com/systemslibrarian/crypto-lab-bb84/tree/4689a88c85ddce5da796f897e670f121d3b71566) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-bcrypt-forge](https://github.com/systemslibrarian/crypto-lab-bcrypt-forge/tree/e46270eafb13e8061b38d4afa2261917970dbb56) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-beacon-lock](https://github.com/systemslibrarian/crypto-lab-beacon-lock/tree/2afde321bfd68c7808b5d5b6da65fba4da485820) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-biham-lens](https://github.com/systemslibrarian/crypto-lab-biham-lens/tree/27249921456d250cb3955f89b2c43bdbc1c5a577) |  | `0 0 + + + ? ?` | 6/14 | SCANNED |
| [crypto-lab-bike-vault](https://github.com/systemslibrarian/crypto-lab-bike-vault/tree/f436ed0dbe26021959356e02b0d887c334229923) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-bitcoin-script](https://github.com/systemslibrarian/crypto-lab-bitcoin-script/tree/40bc5cba8c1f7ee338fd792869b0af2d9b3af241) |  | `? ? + + + ? ?` | 6/6 | SCANNED |
| [crypto-lab-bitcoin-wallet](https://github.com/systemslibrarian/crypto-lab-bitcoin-wallet/tree/951a100896c17a93e9be4388e06af319725c4a84) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-blind-hello](https://github.com/systemslibrarian/crypto-lab-blind-hello/tree/f19da9e8664a4e567929a296364c09b24f6703c2) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-blind-oracle](https://github.com/systemslibrarian/crypto-lab-blind-oracle/tree/91d3cce4e17f1c67cd39ed5345e407a4b6521ab9) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-blind-sign](https://github.com/systemslibrarian/crypto-lab-blind-sign/tree/174e0450b8d4b7e05bb94762c07ca1e74c8d87b9) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-broken-trust](https://github.com/systemslibrarian/crypto-lab-broken-trust/tree/221bbf3950965ceed3106a12dc88e489fef0d36b) |  | `? ? ? ? + + ?` | 3/3 | SCANNED |
| [crypto-lab-bulletproofs](https://github.com/systemslibrarian/crypto-lab-bulletproofs/tree/09b65bc8c29cce5c8747e29823c1cb7eeea28770) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-card-trick](https://github.com/systemslibrarian/crypto-lab-card-trick/tree/126579c282efcf5ea58228252b2ee646c25ec8b4) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-chacha20-stream](https://github.com/systemslibrarian/crypto-lab-chacha20-stream/tree/074aa42b64f02e32e3ec49ffd778d963f8665649) |  | `? ? + ? + + ?` | 5/5 | SCANNED |
| [crypto-lab-chain-of-trust](https://github.com/systemslibrarian/crypto-lab-chain-of-trust/tree/94f33f58e494e0534dbc89e2ec7c75bef0a0448e) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-ciphertext-mirror](https://github.com/systemslibrarian/crypto-lab-ciphertext-mirror/tree/7918b3aec653aa1d6e8ff67d23d250aa62ce4208) |  | `? ? + + + ? ?` | 6/6 | SCANNED |
| [crypto-lab-ckks-lab](https://github.com/systemslibrarian/crypto-lab-ckks-lab/tree/c518cded731c040a165c41e83dff0c739418cb0d) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-collision-vault](https://github.com/systemslibrarian/crypto-lab-collision-vault/tree/476dec52aa83e9eb3045cfb79a6e01d9a030f0d0) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-commit-gate](https://github.com/systemslibrarian/crypto-lab-commit-gate/tree/98f205f1ca920eba6bd67c5d6900d47d7a1864c6) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-context-ward](https://github.com/systemslibrarian/crypto-lab-context-ward/tree/0fa3a0ee23fdb9dc6a8a294592dfed7434622c69) |  | `? ? + + + + ?` | 7/7 | PARTIAL |
| [crypto-lab-corrupted-oracle](https://github.com/systemslibrarian/crypto-lab-corrupted-oracle/tree/ea7644876219e4253875eebbd695417ec2e68b74) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-covert-channel-studio](https://github.com/systemslibrarian/crypto-lab-covert-channel-studio/tree/de4bfe0c9bb1f7733f795d9154a2cf3e023f8117) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-credential-veil](https://github.com/systemslibrarian/crypto-lab-credential-veil/tree/cc97144ec5f02828177b85fc4f87510b01e852e7) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-curve-lens](https://github.com/systemslibrarian/crypto-lab-curve-lens/tree/4d2ab84a2163db17ac075fc3bd1423ff25729c2a) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-curve448](https://github.com/systemslibrarian/crypto-lab-curve448/tree/6429c3062bfed4c8b55d832d97d2d2fd7b4cd7ea) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-dead-sea-cipher](https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher/tree/1a96dd39fc35055072e734bb235eff5e7d71e41c) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-dilithium-reject](https://github.com/systemslibrarian/crypto-lab-dilithium-reject/tree/42090e5a6e9905ae959724792e9bfdf0144c4e51) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-dilithium-seal](https://github.com/systemslibrarian/crypto-lab-dilithium-seal/tree/30268a422f69273a78749ac9df2270de648c1a63) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-dkg-gate](https://github.com/systemslibrarian/crypto-lab-dkg-gate/tree/004e4954b3a469dfb109c49aaec4225f9188db2b) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-dnssec-chain](https://github.com/systemslibrarian/crypto-lab-dnssec-chain/tree/a2bc8b021af1f9129f13aea1147f510fe4a9cf97) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-drbg-arena](https://github.com/systemslibrarian/crypto-lab-drbg-arena/tree/498abbbad73a2286e4e34f1caf8c6a60c9c51a48) |  | `+ ? ? + + + ?` | 9/9 | SCANNED |
| [crypto-lab-e91](https://github.com/systemslibrarian/crypto-lab-e91/tree/8182aaa5c0f9481a77be4cee98665e7bb8905d5e) |  | `? ? + + + ? ?` | 6/6 | SCANNED |
| [crypto-lab-ed25519-forge](https://github.com/systemslibrarian/crypto-lab-ed25519-forge/tree/2b0a14bd6ad0ea68c4496e923cf20fa872a74e62) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-elgamal-plain](https://github.com/systemslibrarian/crypto-lab-elgamal-plain/tree/b3fa02685c9b602e6d36cc94c00964d2abdbbe1c) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-encrochat](https://github.com/systemslibrarian/crypto-lab-encrochat/tree/6ec5b58435455cb017e0abaf2549d7c6f1d168fc) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-enigma-forge](https://github.com/systemslibrarian/crypto-lab-enigma-forge/tree/5f29bf8381b4a7fd8625d9bd75f342ed033b0b2f) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-entropy-collapse](https://github.com/systemslibrarian/crypto-lab-entropy-collapse/tree/77b3e629ab59feabc3d6ff6f6194b19c23105fe0) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-envelope-kms](https://github.com/systemslibrarian/crypto-lab-envelope-kms/tree/81b675c6d18bf2e1ae4df7db234562688d532f76) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-export-grade](https://github.com/systemslibrarian/crypto-lab-export-grade/tree/77601242dfa34d9874e1d363295e0241232d1129) |  | `? ? + + + ? ?` | 6/6 | SCANNED |
| [crypto-lab-factor-forge](https://github.com/systemslibrarian/crypto-lab-factor-forge/tree/2d002143df138883c566aa01b77e0d8b8e8d227a) |  | `? ? + + + ? ?` | 6/6 | SCANNED |
| [crypto-lab-falcon-seal](https://github.com/systemslibrarian/crypto-lab-falcon-seal/tree/0610209d496b459ff172c8dfa9402f3e984e090a) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-feistel-forge](https://github.com/systemslibrarian/crypto-lab-feistel-forge/tree/658dd92925d5ccdad2411fb44d8ed0f9449d3b43) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-fhe-arena](https://github.com/systemslibrarian/crypto-lab-fhe-arena/tree/6e03177e3fcacb1322ffec3266ae225e76f25af2) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-fold-gate](https://github.com/systemslibrarian/crypto-lab-fold-gate/tree/9dac554e1c0e7401ddeba8a62a0c7574ccf5b0c8) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-format-ward](https://github.com/systemslibrarian/crypto-lab-format-ward/tree/ed4d9e769b358e9c2dafbfcc022c7420435f9cc1) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-frodo-vault](https://github.com/systemslibrarian/crypto-lab-frodo-vault/tree/53190e6dde92027c5b635d5b1830e107aeb76d29) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-frost-threshold](https://github.com/systemslibrarian/crypto-lab-frost-threshold/tree/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf) |  | `? + ? + + + ?` | 9/9 | SCANNED |
| [crypto-lab-frozen-heart](https://github.com/systemslibrarian/crypto-lab-frozen-heart/tree/17d6857b25115fa682e05a8fb62980ccc72906ba) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-fte](https://github.com/systemslibrarian/crypto-lab-fte/tree/7f5f70af8bb699573a330b9ff87359b1bede29f2) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-garbled-gate](https://github.com/systemslibrarian/crypto-lab-garbled-gate/tree/1b3a5c7e08c14a34e6314e0eb20d3064aba151c6) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-gg20-wallet](https://github.com/systemslibrarian/crypto-lab-gg20-wallet/tree/e532c377139651b64f2e56a19d4972a253581108) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-ggh-trapdoor](https://github.com/systemslibrarian/crypto-lab-ggh-trapdoor/tree/0132de9231ba293a6c593cf623200c3f38225dc4) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-ghost-commit](https://github.com/systemslibrarian/crypto-lab-ghost-commit/tree/88abb12c24089a2606306816f54a575e58c723b0) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-harvest-timeline](https://github.com/systemslibrarian/crypto-lab-harvest-timeline/tree/afa8ae3d1c07ac72410d08491f8145c888c33fa1) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-hash-zoo](https://github.com/systemslibrarian/crypto-lab-hash-zoo/tree/ea45b742a13f8dc2f5bb131a99ccd5875165dd9c) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-hawk](https://github.com/systemslibrarian/crypto-lab-hawk/tree/10910e698cadfd406c279cf71c7372edbe8d87b8) |  | `? ? ? ? + ? ?` | 2/2 | SCANNED |
| [crypto-lab-hpke-envelope](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/tree/aa3f70da12a81c2ce785be5bf9590cef7b7f80a7) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-hqc-timing](https://github.com/systemslibrarian/crypto-lab-hqc-timing/tree/a6c492ef3b021060e6b2d8413a10719acbeb0112) |  | `0 ? ? + + ? ?` | 4/8 | SCANNED |
| [crypto-lab-hqc-timing-break](https://github.com/systemslibrarian/crypto-lab-hqc-timing-break/tree/50c0b64a3597cfc9caf97eca16b69420e4f09f35) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-hqc-vault](https://github.com/systemslibrarian/crypto-lab-hqc-vault/tree/8c73fdf58b8359965d93e913ffc1b55be394c5e6) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-hybrid-guide](https://github.com/systemslibrarian/crypto-lab-hybrid-guide/tree/0840345bd9fcd1bcda21de80a7c5a290658ac0cb) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-hybrid-pqc](https://github.com/systemslibrarian/crypto-lab-hybrid-pqc/tree/821f811407b8e2331b19adde9737010bf30834ee) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-hybrid-sign](https://github.com/systemslibrarian/crypto-lab-hybrid-sign/tree/115b0d21b723c8937e4a2cf282c7d14c5650b0c5) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-ibe-gate](https://github.com/systemslibrarian/crypto-lab-ibe-gate/tree/aa8f03003319808edac8b8e8f50155926d5aa8a5) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-icy-dvrf](https://github.com/systemslibrarian/crypto-lab-icy-dvrf/tree/9506224c141fb75e84a4b1a686e632939eaf7316) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-iron-letter](https://github.com/systemslibrarian/crypto-lab-iron-letter/tree/3fb357d84f145b7944d02744a08dd8be381618a2) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-iron-serpent](https://github.com/systemslibrarian/crypto-lab-iron-serpent/tree/dabdded459f72d1bd8d58e7bf45f49b8cb9bdd2d) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-isogeny-atlas](https://github.com/systemslibrarian/crypto-lab-isogeny-atlas/tree/17e29746e9ca92518912e7e7962968d74fea8996) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-isogeny-gate](https://github.com/systemslibrarian/crypto-lab-isogeny-gate/tree/f6f409888c6398d8e4b00cda2a7175f0eedc9a51) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-j-uniward](https://github.com/systemslibrarian/crypto-lab-j-uniward/tree/43e7dd883fa866fe213ae16d3536332402fc7266) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-jevil](https://github.com/systemslibrarian/crypto-lab-jevil/tree/4db66aaa6141721e1d2eae35e5ed3f0973288772) |  | `? ? ? ? + + ?` | 3/3 | SCANNED |
| [crypto-lab-jwt-forge](https://github.com/systemslibrarian/crypto-lab-jwt-forge/tree/6d6e78b49289f70f261f11851815b9899827f656) |  | `? ? + + + ? ?` | 6/6 | SCANNED |
| [crypto-lab-kdf-arena](https://github.com/systemslibrarian/crypto-lab-kdf-arena/tree/0e07080eac4564723ac8b36e8a4f86736817baaa) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-kdf-chain](https://github.com/systemslibrarian/crypto-lab-kdf-chain/tree/33acf8dce505c4468fe011989bb5b7cf45e084b6) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-kem-trap](https://github.com/systemslibrarian/crypto-lab-kem-trap/tree/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7) |  | `+ + ? + + ? ?` | 12/12 | SCANNED |
| [crypto-lab-kerberos](https://github.com/systemslibrarian/crypto-lab-kerberos/tree/f580012298b3e5dc8cdbe067c08e2bcf470bf8d6) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-key-exchange](https://github.com/systemslibrarian/crypto-lab-key-exchange/tree/c5be956d0ad547d9ccd543b7163586ee6a2fd184) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-key-mirror](https://github.com/systemslibrarian/crypto-lab-key-mirror/tree/89d7aa6a6a56261525186fb589b4ac04d6e81d40) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-kmac-gate](https://github.com/systemslibrarian/crypto-lab-kmac-gate/tree/2315d38d45b6a9f1bd392c8719490486cef78382) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-kpqc-pair](https://github.com/systemslibrarian/crypto-lab-kpqc-pair/tree/0ef5fe67aec9d501cc58fff9a58fae9f013fa462) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-kyberslash](https://github.com/systemslibrarian/crypto-lab-kyberslash/tree/4b931164d9241702c55070ad4939dba5f35ccd1b) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-lattice-builder](https://github.com/systemslibrarian/crypto-lab-lattice-builder/tree/f4d1b98b6d9bf7a25732c93e179d1da0ad5e6b43) |  | `? ? ? ? + ? ?` | 2/2 | SCANNED |
| [crypto-lab-lattice-fault](https://github.com/systemslibrarian/crypto-lab-lattice-fault/tree/6a12d9310550981ce2dcf4cb9c0b9db999906c9d) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-lll-break](https://github.com/systemslibrarian/crypto-lab-lll-break/tree/f3e51f07a4880ab13f0c2fbe6ffd41d204df13a1) |  | `? ? ? ? + + ?` | 3/3 | SCANNED |
| [crypto-lab-lms-ledger](https://github.com/systemslibrarian/crypto-lab-lms-ledger/tree/b55685fc1fd17a0889caaaf12df919383e2b100d) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-lms-xmss](https://github.com/systemslibrarian/crypto-lab-lms-xmss/tree/727c3d350f4ce75d2f594d0c129b381d8fe1aec6) |  | `+ ? ? + + + ?` | 9/9 | SCANNED |
| [crypto-lab-lwe-hints](https://github.com/systemslibrarian/crypto-lab-lwe-hints/tree/19324cbe8b63b7e31f49e403a7950e50ca8a826d) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-mac-race](https://github.com/systemslibrarian/crypto-lab-mac-race/tree/4c0e376316f4b1c2a4cbd686ef04820f0b8abea4) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-masked-core](https://github.com/systemslibrarian/crypto-lab-masked-core/tree/b9679f4b2bca1e2f3f2aaec88ed7a4c25e878f1f) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-matsui-line](https://github.com/systemslibrarian/crypto-lab-matsui-line/tree/54ae594278d010249b2f72eb664567b0e28c3494) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-mayo-seal](https://github.com/systemslibrarian/crypto-lab-mayo-seal/tree/1586d1a40673179750de0f0f9daa976dbe75f173) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-mceliece-gate](https://github.com/systemslibrarian/crypto-lab-mceliece-gate/tree/7d10dc24ab23f9a341e7249761daa64ee205fbf1) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-merkle-proofs](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/tree/5f2adac7e23cdebb4431dc3c7a424309d75fc109) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-merkle-vault](https://github.com/systemslibrarian/crypto-lab-merkle-vault/tree/ef859d27522ee61447ed9ec86d0c5124d51aa68d) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-misty-lens](https://github.com/systemslibrarian/crypto-lab-misty-lens/tree/19044d74b09ea26520a3502aae764f74ef6e63a9) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-mls-group](https://github.com/systemslibrarian/crypto-lab-mls-group/tree/1f93874318f4c650a4edc1ad67dcbe488aa88f64) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-model-breach](https://github.com/systemslibrarian/crypto-lab-model-breach/tree/a1e3864c76e26f622608c25325ead69869119465) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-mpcith-sign](https://github.com/systemslibrarian/crypto-lab-mpcith-sign/tree/c549dcee8b8f752df7f3021fa81cce457de751e7) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-multivariate](https://github.com/systemslibrarian/crypto-lab-multivariate/tree/711ebba8afd8801167929395aca16b3679acd2a7) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-musig-gate](https://github.com/systemslibrarian/crypto-lab-musig-gate/tree/4a4564b1f4e8f39774ee4068933be7b2491a69e8) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-noise-pipe](https://github.com/systemslibrarian/crypto-lab-noise-pipe/tree/0ac9e9e53d1df2e7aeb48ee1312ff582953f0c0e) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-nonce-guard](https://github.com/systemslibrarian/crypto-lab-nonce-guard/tree/2071c38457185ca146e2348824c7520f105282e2) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-ntru-classic](https://github.com/systemslibrarian/crypto-lab-ntru-classic/tree/7d2037cf8d8d82555d6c31c7a7060bb4f2d5a649) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-oblivious-shelf](https://github.com/systemslibrarian/crypto-lab-oblivious-shelf/tree/031b78797781d0c179b15c8599df80a95e2c251f) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-opaque-gate](https://github.com/systemslibrarian/crypto-lab-opaque-gate/tree/744d8e00f296e65cf1370c92fc6a2018b0c6e538) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-oram-vault](https://github.com/systemslibrarian/crypto-lab-oram-vault/tree/8452868518b71db7681ec07baf069c4257fa6c1f) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-order-leak](https://github.com/systemslibrarian/crypto-lab-order-leak/tree/aa1885268bc4ab2900c9c3a5068c5adb4df0c8fa) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-ot-gate](https://github.com/systemslibrarian/crypto-lab-ot-gate/tree/f62ef729e6bdfdb2f492906c86dbc19fe4488536) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-paillier-gate](https://github.com/systemslibrarian/crypto-lab-paillier-gate/tree/3c46939e75323dab93e75b3647acf43eee33a2ec) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-pairing-gate](https://github.com/systemslibrarian/crypto-lab-pairing-gate/tree/447134e0eb5a31e5b87e04184793a6060c607f35) |  | `0 0 ? + + + 0` | 5/14 | SCANNED |
| [crypto-lab-pake-gate](https://github.com/systemslibrarian/crypto-lab-pake-gate/tree/cebf0a80f3e641dfd7b39688dce074201d21cc14) |  | `? ? + + ? + ?` | 5/5 | SCANNED |
| [crypto-lab-phantom-vault](https://github.com/systemslibrarian/crypto-lab-phantom-vault/tree/737a53531291c24539ffcc6578df2051d6c5c2cb) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-pki-chain](https://github.com/systemslibrarian/crypto-lab-pki-chain/tree/fe738f912b15c946e54bbeb88e6d3cf91d8e51fe) |  | `? ? + + + ? ?` | 6/6 | SCANNED |
| [crypto-lab-poly1305-mac](https://github.com/systemslibrarian/crypto-lab-poly1305-mac/tree/5c9c1f0a293731aa9f6dd1fa8710fc141edd209f) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-polynomial-forge](https://github.com/systemslibrarian/crypto-lab-polynomial-forge/tree/acaed7786ac8a6ea89945f576b2f3bdf38861093) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-power-trace](https://github.com/systemslibrarian/crypto-lab-power-trace/tree/fb1ea2bea78357c7a2389329a280b533c22a9e32) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-pq-families](https://github.com/systemslibrarian/crypto-lab-pq-families/tree/776c4f5d2c2cd2d214f20a2e0cebc1c2835f257a) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-pq-rotation](https://github.com/systemslibrarian/crypto-lab-pq-rotation/tree/df8f7e6edd7491181314be281135217220e5d497) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-pq-tls-handshake](https://github.com/systemslibrarian/crypto-lab-pq-tls-handshake/tree/5d96c84ba99ca041016821f5164a0c7c49601922) |  | `+ ? ? ? + + ?` | 7/7 | SCANNED |
| [crypto-lab-pqxdh-wire](https://github.com/systemslibrarian/crypto-lab-pqxdh-wire/tree/f0bb824c9c3734fe8bdb2b9aeec46fc188b10942) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-privacy-pass](https://github.com/systemslibrarian/crypto-lab-privacy-pass/tree/f3beebad34e09b7967392474369d25f8e29e9a63) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-proof-tally](https://github.com/systemslibrarian/crypto-lab-proof-tally/tree/f85c1910fadac9ebf508e51803c148780b24b697) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-protocol-compose](https://github.com/systemslibrarian/crypto-lab-protocol-compose/tree/dbfb3faed91a90bd4d484088507ac2c3c0b726c8) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-psi-gate](https://github.com/systemslibrarian/crypto-lab-psi-gate/tree/0c9132b25bd513411bc4698abf0f5f5e9dcaeabf) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-quantum-entropy](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/tree/58b690d875abea61f59a9cd89b8d53ea2d487e33) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-quantum-vault-kpqc](https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc/tree/c0c067dba8dc942924fe754949ad4ceb26ec49a6) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-ratchet-wire](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/tree/503c2a1f4cd568287d406c81ed7217a5f9ffc0c9) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-rekey-relay](https://github.com/systemslibrarian/crypto-lab-rekey-relay/tree/abd49d8b1513636cbbb49779aa95df1f007265a0) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-reshare-circle](https://github.com/systemslibrarian/crypto-lab-reshare-circle/tree/09f63b7009834a63e1496e0aa28625b1b7b3bf3d) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-ring-sign](https://github.com/systemslibrarian/crypto-lab-ring-sign/tree/a9938758c5ee4f638d3454683908e4742e0d56c7) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-salamander](https://github.com/systemslibrarian/crypto-lab-salamander/tree/aab11fe0e1e10544bc4a5b92a819d33181643c99) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-schnorr-forge](https://github.com/systemslibrarian/crypto-lab-schnorr-forge/tree/5a643271335b2fe968b48a60fba28a79c3106e23) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-scloud-vault](https://github.com/systemslibrarian/crypto-lab-scloud-vault/tree/5a24fee5e7bd5fb2b66c0cd47a09f7993cf092a0) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-search-vault](https://github.com/systemslibrarian/crypto-lab-search-vault/tree/23afb5d80315cfc22a95f7e03c855435e639de22) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-sector-vault](https://github.com/systemslibrarian/crypto-lab-sector-vault/tree/ba4a5ca451de447bfe658fa106e4d8079ee3a0ae) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-shadow-vault](https://github.com/systemslibrarian/crypto-lab-shadow-vault/tree/f094b96e6bd798867abbd3d2512476a3618cb010) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-shamir-gate](https://github.com/systemslibrarian/crypto-lab-shamir-gate/tree/2436171fb8b9d7ee062e6e3de034c3a7ea3e36d0) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-shamir-vs-frost](https://github.com/systemslibrarian/crypto-lab-shamir-vs-frost/tree/a5e5f027e3ef5b509f3fb0202ba331cfaf238315) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-signed-bytes](https://github.com/systemslibrarian/crypto-lab-signed-bytes/tree/6da21366a24e341b1b39c8d73fab78a661ca134a) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-silent-tally](https://github.com/systemslibrarian/crypto-lab-silent-tally/tree/14e5c0d540be889d414498e74d8f61b951ef639e) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-simon-period](https://github.com/systemslibrarian/crypto-lab-simon-period/tree/34ae1f083434d5753e244fbfb5cb3c9a6a307f15) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-sleeve-check](https://github.com/systemslibrarian/crypto-lab-sleeve-check/tree/97f753a2326d015ec6170b741af40bc91c9258ee) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-sm2-forge](https://github.com/systemslibrarian/crypto-lab-sm2-forge/tree/4205cbff13acd37373e989aee5863878b33ee647) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-snark-arena](https://github.com/systemslibrarian/crypto-lab-snark-arena/tree/9a72143f2668bb590cde2e2296b4460e2e4928bb) |  | `? ? + + + + ?` | 7/7 | PARTIAL |
| [crypto-lab-spake-gate](https://github.com/systemslibrarian/crypto-lab-spake-gate/tree/0e4590532ac33d22f4a0525f66b31ce8a1366c8d) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-spdz-forge](https://github.com/systemslibrarian/crypto-lab-spdz-forge/tree/5a401bfec053f7c97aabd4bc1c991598cb5e53d6) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-sphincs-ledger](https://github.com/systemslibrarian/crypto-lab-sphincs-ledger/tree/92d9ce6a6aee33b014d8cba6b16ef516da5d9e98) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-sphinx-mix](https://github.com/systemslibrarian/crypto-lab-sphinx-mix/tree/def321cb1b28308a7c4190583af9e1940b687a5d) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-split-point](https://github.com/systemslibrarian/crypto-lab-split-point/tree/ab679b95e79e102952ecda35a85202a8d5987bdf) |  | `? ? + + + ? ?` | 6/6 | SCANNED |
| [crypto-lab-ssh-handshake](https://github.com/systemslibrarian/crypto-lab-ssh-handshake/tree/ff9eead05724c199d94b76ce3186c47a3b9a50fc) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-stark-tower](https://github.com/systemslibrarian/crypto-lab-stark-tower/tree/ecaf38b701f8067371edf89b4c6e676bfba3ab6f) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-stego-suite](https://github.com/systemslibrarian/crypto-lab-stego-suite/tree/5dd03b16d2133e2f70ba4369d2cf842e7ac5cac9) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-stream-ward](https://github.com/systemslibrarian/crypto-lab-stream-ward/tree/a5be1dd09f2b135459d168ab60940c85a6624e10) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-syndrome-drain](https://github.com/systemslibrarian/crypto-lab-syndrome-drain/tree/e496ede66340ebae55020e0c29419c710c8c6cf8) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-syndrome-hints](https://github.com/systemslibrarian/crypto-lab-syndrome-hints/tree/34b88b39ec647ac5fcc8d16c9b0194cbfd7c9a3c) |  | `? ? ? ? + + ?` | 3/3 | SCANNED |
| [crypto-lab-tc26-pair](https://github.com/systemslibrarian/crypto-lab-tc26-pair/tree/1524136e52cb64e57adfcdfa3ccead7f320cf1b7) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-threshold-decrypt](https://github.com/systemslibrarian/crypto-lab-threshold-decrypt/tree/a2c571e281d177c53b962ab40592d990ae1e844f) |  | `? ? + + + ? ?` | 6/6 | SCANNED |
| [crypto-lab-threshold-mldsa](https://github.com/systemslibrarian/crypto-lab-threshold-mldsa/tree/cbf0a1b8c086624e6e4db38251c0d978ffc548bf) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-time-lock-puzzle](https://github.com/systemslibrarian/crypto-lab-time-lock-puzzle/tree/fcb981865990380f815403bfb5a883d90b098f16) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-time-trust](https://github.com/systemslibrarian/crypto-lab-time-trust/tree/2852cac498088a44c2b05278f7b7891df684845d) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-timing-oracle](https://github.com/systemslibrarian/crypto-lab-timing-oracle/tree/3ca8a5f15d5775dd6b2356a8eaf56a48c23a3dc2) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-timing-sidechannel](https://github.com/systemslibrarian/crypto-lab-timing-sidechannel/tree/0351f083727575530f3691a8cfb773e01f74f6e6) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-token-tell](https://github.com/systemslibrarian/crypto-lab-token-tell/tree/41100d93f8174cfce0b0be71989aebdde4d6b4db) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-traitor-trace](https://github.com/systemslibrarian/crypto-lab-traitor-trace/tree/0ace9eeb2cd932edef1d5170416994613c1f7776) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-vdf](https://github.com/systemslibrarian/crypto-lab-vdf/tree/c5f2a4b2a0581fcf0c568eea5ba4c65b954928ed) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-vigenere-break](https://github.com/systemslibrarian/crypto-lab-vigenere-break/tree/15dfd3a572dc098a42cf878bfba1005f02b05930) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-vrf-gate](https://github.com/systemslibrarian/crypto-lab-vrf-gate/tree/ec084f1edada61388c54a52334b43b7dc7e61414) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-vss-gate](https://github.com/systemslibrarian/crypto-lab-vss-gate/tree/b88123382255af7c5b6ef4dec1af11fde65ee538) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-web-of-trust](https://github.com/systemslibrarian/crypto-lab-web-of-trust/tree/fcd2d7ca19e58e1821a6cb205bfcd8a27f10bc50) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-webauthn](https://github.com/systemslibrarian/crypto-lab-webauthn/tree/1485b67de4cd6cf8d48ae7021bd5900fde771227) |  | `? ? + + + + ?` | 7/7 | SCANNED |
| [crypto-lab-world-ciphers](https://github.com/systemslibrarian/crypto-lab-world-ciphers/tree/51cea193cf47f4abc491afe6ffb86f0ca7cdac5d) |  | `? ? + + ? + ?` | 5/5 | SCANNED |
| [crypto-lab-world-hashes](https://github.com/systemslibrarian/crypto-lab-world-hashes/tree/6f417f5104da2ee120c0fda724eb7bbc301f280b) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-x3dh-wire](https://github.com/systemslibrarian/crypto-lab-x3dh-wire/tree/0b8587962dd6824778b7d55bdac3c47c86dec9f2) |  | `? ? ? + + + ?` | 5/5 | SCANNED |
| [crypto-lab-zk-arena](https://github.com/systemslibrarian/crypto-lab-zk-arena/tree/dc2c022ab4c6341dbd7fc0c395716cecc97dd126) |  | `? ? ? + + ? ?` | 4/4 | SCANNED |
| [crypto-lab-zk-proof-lab](https://github.com/systemslibrarian/crypto-lab-zk-proof-lab/tree/384ac53a03f26fa86200e6b7ea9e491975e0bf3d) |  | `? ? + + + + ?` | 7/7 | SCANNED |

### Evidence ledger

#### crypto-lab-ablation-wire — 8ad03c068a133660b27755ff0910e0391f8e0dcc

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [codetalker-core/tests/kat.rs:1](https://github.com/systemslibrarian/crypto-lab-ablation-wire/blob/8ad03c068a133660b27755ff0910e0391f8e0dcc/codetalker-core/tests/kat.rs#L1) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Deploy gate (+)**: [.github/workflows/ci.yml:142](https://github.com/systemslibrarian/crypto-lab-ablation-wire/blob/8ad03c068a133660b27755ff0910e0391f8e0dcc/.github/workflows/ci.yml#L142) `deploy (needs: ['core', 'wasm', 'lint', 'supply-chain']): wasm-pack build codetalker-wasm --target web --release --out-dir `; [.github/workflows/ci.yml:142](https://github.com/systemslibrarian/crypto-lab-ablation-wire/blob/8ad03c068a133660b27755ff0910e0391f8e0dcc/.github/workflows/ci.yml#L142) `wasm (needs: —): wasm-pack build codetalker-wasm --target web --release --out-dir `; [.github/workflows/ci.yml:49](https://github.com/systemslibrarian/crypto-lab-ablation-wire/blob/8ad03c068a133660b27755ff0910e0391f8e0dcc/.github/workflows/ci.yml#L49) `core (needs: —): cargo build -p codetalker-core ${{ steps.flags.outputs.args }}`; [.github/workflows/ci.yml:50](https://github.com/systemslibrarian/crypto-lab-ablation-wire/blob/8ad03c068a133660b27755ff0910e0391f8e0dcc/.github/workflows/ci.yml#L50) `core (needs: —): cargo test -p codetalker-core ${{ steps.flags.outputs.args }} -- `; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:94](https://github.com/systemslibrarian/crypto-lab-ablation-wire/blob/8ad03c068a133660b27755ff0910e0391f8e0dcc/README.md#L94) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-accumulator — 50db63d594c6220196d157f58d27a7fc2a5e0b41

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/core/kat.test.ts:4](https://github.com/systemslibrarian/crypto-lab-accumulator/blob/50db63d594c6220196d157f58d27a7fc2a5e0b41/src/core/kat.test.ts#L4) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/core/hashToPrime.test.ts:2](https://github.com/systemslibrarian/crypto-lab-accumulator/blob/50db63d594c6220196d157f58d27a7fc2a5e0b41/src/core/hashToPrime.test.ts#L2) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/flow.spec.ts:85](https://github.com/systemslibrarian/crypto-lab-accumulator/blob/50db63d594c6220196d157f58d27a7fc2a5e0b41/e2e/flow.spec.ts#L85)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-accumulator/blob/50db63d594c6220196d157f58d27a7fc2a5e0b41/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-accumulator/blob/50db63d594c6220196d157f58d27a7fc2a5e0b41/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-accumulator/blob/50db63d594c6220196d157f58d27a7fc2a5e0b41/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-accumulator/blob/50db63d594c6220196d157f58d27a7fc2a5e0b41/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:30](https://github.com/systemslibrarian/crypto-lab-accumulator/blob/50db63d594c6220196d157f58d27a7fc2a5e0b41/README.md#L30)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-aegis-gate — 63269b7c4ce3bbc3d434dcaaa1c5758b9743d013

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [test/aegis.test.ts:84](https://github.com/systemslibrarian/crypto-lab-aegis-gate/blob/63269b7c4ce3bbc3d434dcaaa1c5758b9743d013/test/aegis.test.ts#L84) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [test/aes-round-vis.test.ts:32](https://github.com/systemslibrarian/crypto-lab-aegis-gate/blob/63269b7c4ce3bbc3d434dcaaa1c5758b9743d013/test/aes-round-vis.test.ts#L32)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-aegis-gate/blob/63269b7c4ce3bbc3d434dcaaa1c5758b9743d013/.github/workflows/deploy.yml#L41) `build (needs: —): npm test`; [.github/workflows/deploy.yml:44](https://github.com/systemslibrarian/crypto-lab-aegis-gate/blob/63269b7c4ce3bbc3d434dcaaa1c5758b9743d013/.github/workflows/deploy.yml#L44) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:47](https://github.com/systemslibrarian/crypto-lab-aegis-gate/blob/63269b7c4ce3bbc3d434dcaaa1c5758b9743d013/.github/workflows/deploy.yml#L47) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:50](https://github.com/systemslibrarian/crypto-lab-aegis-gate/blob/63269b7c4ce3bbc3d434dcaaa1c5758b9743d013/.github/workflows/deploy.yml#L50) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-aegis-gate/blob/63269b7c4ce3bbc3d434dcaaa1c5758b9743d013/playwright.config.ts#L18))
- **Limits and guidance (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-aes-modes — 843f0f4a3e14248e2aa6cbc56dde35f8bef62ea8

Source scan: SCANNED.
- **Ground truth (+)**: [src/ccm.test.ts:5](https://github.com/systemslibrarian/crypto-lab-aes-modes/blob/843f0f4a3e14248e2aa6cbc56dde35f8bef62ea8/src/ccm.test.ts#L5)
- **Independent check (?)**: UNRESOLVED: candidate [src/ecb.test.ts:15](https://github.com/systemslibrarian/crypto-lab-aes-modes/blob/843f0f4a3e14248e2aa6cbc56dde35f8bef62ea8/src/ecb.test.ts#L15) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/ccm.test.ts:105](https://github.com/systemslibrarian/crypto-lab-aes-modes/blob/843f0f4a3e14248e2aa6cbc56dde35f8bef62ea8/src/ccm.test.ts#L105)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-aes-modes/blob/843f0f4a3e14248e2aa6cbc56dde35f8bef62ea8/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-aes-modes/blob/843f0f4a3e14248e2aa6cbc56dde35f8bef62ea8/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:35](https://github.com/systemslibrarian/crypto-lab-aes-modes/blob/843f0f4a3e14248e2aa6cbc56dde35f8bef62ea8/.github/workflows/pages.yml#L35) `build (needs: —): npx playwright install --with-deps chromium firefox webkit`; [.github/workflows/pages.yml:37](https://github.com/systemslibrarian/crypto-lab-aes-modes/blob/843f0f4a3e14248e2aa6cbc56dde35f8bef62ea8/.github/workflows/pages.yml#L37) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:20](https://github.com/systemslibrarian/crypto-lab-aes-modes/blob/843f0f4a3e14248e2aa6cbc56dde35f8bef62ea8/playwright.config.ts#L20)), firefox ([playwright.config.ts:38](https://github.com/systemslibrarian/crypto-lab-aes-modes/blob/843f0f4a3e14248e2aa6cbc56dde35f8bef62ea8/playwright.config.ts#L38)), webkit ([playwright.config.ts:43](https://github.com/systemslibrarian/crypto-lab-aes-modes/blob/843f0f4a3e14248e2aa6cbc56dde35f8bef62ea8/playwright.config.ts#L43))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-aes-modes/blob/843f0f4a3e14248e2aa6cbc56dde35f8bef62ea8/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-air-stream — 1710b2975733c6652d7e14f8bd99dd5027185164

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:49](https://github.com/systemslibrarian/crypto-lab-air-stream/blob/1710b2975733c6652d7e14f8bd99dd5027185164/e2e/claims.spec.ts#L49) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:1](https://github.com/systemslibrarian/crypto-lab-air-stream/blob/1710b2975733c6652d7e14f8bd99dd5027185164/e2e/claims.spec.ts#L1) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:99](https://github.com/systemslibrarian/crypto-lab-air-stream/blob/1710b2975733c6652d7e14f8bd99dd5027185164/e2e/claims.spec.ts#L99)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-air-stream/blob/1710b2975733c6652d7e14f8bd99dd5027185164/.github/workflows/deploy.yml#L33) `build (needs: —): npm test`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-air-stream/blob/1710b2975733c6652d7e14f8bd99dd5027185164/.github/workflows/deploy.yml#L35) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-air-stream/blob/1710b2975733c6652d7e14f8bd99dd5027185164/.github/workflows/deploy.yml#L37) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-air-stream/blob/1710b2975733c6652d7e14f8bd99dd5027185164/.github/workflows/deploy.yml#L39) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-air-stream/blob/1710b2975733c6652d7e14f8bd99dd5027185164/.github/workflows/deploy.yml#L41) `build (needs: —): npm run test:e2e`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:5](https://github.com/systemslibrarian/crypto-lab-air-stream/blob/1710b2975733c6652d7e14f8bd99dd5027185164/README.md#L5) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ascon — 61c56db0358e56bd3208b172934761af117d64e8

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [test/kat-full.test.ts:26](https://github.com/systemslibrarian/crypto-lab-ascon/blob/61c56db0358e56bd3208b172934761af117d64e8/test/kat-full.test.ts#L26) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [test/roundtrip.fuzz.test.ts:33](https://github.com/systemslibrarian/crypto-lab-ascon/blob/61c56db0358e56bd3208b172934761af117d64e8/test/roundtrip.fuzz.test.ts#L33)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-ascon/blob/61c56db0358e56bd3208b172934761af117d64e8/.github/workflows/deploy.yml#L36) `build (needs: —): npm test`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-ascon/blob/61c56db0358e56bd3208b172934761af117d64e8/.github/workflows/deploy.yml#L39) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:42](https://github.com/systemslibrarian/crypto-lab-ascon/blob/61c56db0358e56bd3208b172934761af117d64e8/.github/workflows/deploy.yml#L42) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-ascon/blob/61c56db0358e56bd3208b172934761af117d64e8/.github/workflows/deploy.yml#L45) `build (needs: —): npx playwright test`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:24](https://github.com/systemslibrarian/crypto-lab-ascon/blob/61c56db0358e56bd3208b172934761af117d64e8/README.md#L24)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-attestation-gate — ac53f430bec712083a1a2d8100dd6c85d2434619

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/core/cbor.test.ts:6](https://github.com/systemslibrarian/crypto-lab-attestation-gate/blob/ac53f430bec712083a1a2d8100dd6c85d2434619/src/core/cbor.test.ts#L6) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:1](https://github.com/systemslibrarian/crypto-lab-attestation-gate/blob/ac53f430bec712083a1a2d8100dd6c85d2434619/e2e/claims.spec.ts#L1) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:193](https://github.com/systemslibrarian/crypto-lab-attestation-gate/blob/ac53f430bec712083a1a2d8100dd6c85d2434619/e2e/claims.spec.ts#L193)
- **Negative test (+)**: [e2e/claims.spec.ts:182](https://github.com/systemslibrarian/crypto-lab-attestation-gate/blob/ac53f430bec712083a1a2d8100dd6c85d2434619/e2e/claims.spec.ts#L182)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:47](https://github.com/systemslibrarian/crypto-lab-attestation-gate/blob/ac53f430bec712083a1a2d8100dd6c85d2434619/.github/workflows/deploy.yml#L47) `build (needs: —): npm test`; [.github/workflows/deploy.yml:50](https://github.com/systemslibrarian/crypto-lab-attestation-gate/blob/ac53f430bec712083a1a2d8100dd6c85d2434619/.github/workflows/deploy.yml#L50) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:54](https://github.com/systemslibrarian/crypto-lab-attestation-gate/blob/ac53f430bec712083a1a2d8100dd6c85d2434619/.github/workflows/deploy.yml#L54) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:57](https://github.com/systemslibrarian/crypto-lab-attestation-gate/blob/ac53f430bec712083a1a2d8100dd6c85d2434619/.github/workflows/deploy.yml#L57) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:60](https://github.com/systemslibrarian/crypto-lab-attestation-gate/blob/ac53f430bec712083a1a2d8100dd6c85d2434619/.github/workflows/deploy.yml#L60) `build (needs: —): npm run test:e2e`; engines: firefox ([playwright.config.ts:32](https://github.com/systemslibrarian/crypto-lab-attestation-gate/blob/ac53f430bec712083a1a2d8100dd6c85d2434619/playwright.config.ts#L32))
- **Limits and guidance (+)**: [README.md:43](https://github.com/systemslibrarian/crypto-lab-attestation-gate/blob/ac53f430bec712083a1a2d8100dd6c85d2434619/README.md#L43)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-attribute-gate — d41e1f884de7cdbe1945b5e8755ec918a0c3af19

Source scan: SCANNED.
- **Ground truth (+)**: [src/fame/kat.test.ts:2](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d41e1f884de7cdbe1945b5e8755ec918a0c3af19/src/fame/kat.test.ts#L2)
- **Independent check (?)**: UNRESOLVED: candidate [src/fame/kat.test.ts:20](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d41e1f884de7cdbe1945b5e8755ec918a0c3af19/src/fame/kat.test.ts#L20) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:120](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d41e1f884de7cdbe1945b5e8755ec918a0c3af19/e2e/claims.spec.ts#L120)
- **Negative test (+)**: [e2e/claims.spec.ts:177](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d41e1f884de7cdbe1945b5e8755ec918a0c3af19/e2e/claims.spec.ts#L177)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:48](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d41e1f884de7cdbe1945b5e8755ec918a0c3af19/.github/workflows/deploy.yml#L48) `build (needs: —): npm test`; [.github/workflows/deploy.yml:51](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d41e1f884de7cdbe1945b5e8755ec918a0c3af19/.github/workflows/deploy.yml#L51) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:55](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d41e1f884de7cdbe1945b5e8755ec918a0c3af19/.github/workflows/deploy.yml#L55) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:58](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d41e1f884de7cdbe1945b5e8755ec918a0c3af19/.github/workflows/deploy.yml#L58) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:61](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d41e1f884de7cdbe1945b5e8755ec918a0c3af19/.github/workflows/deploy.yml#L61) `build (needs: —): npm run test:claims`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:43](https://github.com/systemslibrarian/crypto-lab-attribute-gate/blob/d41e1f884de7cdbe1945b5e8755ec918a0c3af19/README.md#L43)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-babel-hash — 74c523b3f3577dbc63ea59bb6b1f75cb3c5edd97

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [demos/babel-hash/src/__tests__/sha256-kat.test.ts:9](https://github.com/systemslibrarian/crypto-lab-babel-hash/blob/74c523b3f3577dbc63ea59bb6b1f75cb3c5edd97/demos/babel-hash/src/__tests__/sha256-kat.test.ts#L9) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [demos/babel-hash/e2e/claims.spec.ts:2](https://github.com/systemslibrarian/crypto-lab-babel-hash/blob/74c523b3f3577dbc63ea59bb6b1f75cb3c5edd97/demos/babel-hash/e2e/claims.spec.ts#L2) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [demos/babel-hash/e2e/claims.spec.ts:324](https://github.com/systemslibrarian/crypto-lab-babel-hash/blob/74c523b3f3577dbc63ea59bb6b1f75cb3c5edd97/demos/babel-hash/e2e/claims.spec.ts#L324)
- **Deploy gate (+)**: [.github/workflows/pages.yml:49](https://github.com/systemslibrarian/crypto-lab-babel-hash/blob/74c523b3f3577dbc63ea59bb6b1f75cb3c5edd97/.github/workflows/pages.yml#L49) `build (needs: —): npx vite build`; [.github/workflows/pages.yml:53](https://github.com/systemslibrarian/crypto-lab-babel-hash/blob/74c523b3f3577dbc63ea59bb6b1f75cb3c5edd97/.github/workflows/pages.yml#L53) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:57](https://github.com/systemslibrarian/crypto-lab-babel-hash/blob/74c523b3f3577dbc63ea59bb6b1f75cb3c5edd97/.github/workflows/pages.yml#L57) `build (needs: —): npm run test:a11y`; engines: chromium ([demos/babel-hash/playwright.config.ts:14](https://github.com/systemslibrarian/crypto-lab-babel-hash/blob/74c523b3f3577dbc63ea59bb6b1f75cb3c5edd97/demos/babel-hash/playwright.config.ts#L14))
- **Limits and guidance (+)**: [README.md:12](https://github.com/systemslibrarian/crypto-lab-babel-hash/blob/74c523b3f3577dbc63ea59bb6b1f75cb3c5edd97/README.md#L12)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-bb84 — 4689a88c85ddce5da796f897e670f121d3b71566

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:15](https://github.com/systemslibrarian/crypto-lab-bb84/blob/4689a88c85ddce5da796f897e670f121d3b71566/e2e/claims.spec.ts#L15) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/bb84.test.ts:69](https://github.com/systemslibrarian/crypto-lab-bb84/blob/4689a88c85ddce5da796f897e670f121d3b71566/src/bb84.test.ts#L69)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-bb84/blob/4689a88c85ddce5da796f897e670f121d3b71566/.github/workflows/deploy.yml#L36) `build (needs: —): npm test`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-bb84/blob/4689a88c85ddce5da796f897e670f121d3b71566/.github/workflows/deploy.yml#L39) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:42](https://github.com/systemslibrarian/crypto-lab-bb84/blob/4689a88c85ddce5da796f897e670f121d3b71566/.github/workflows/deploy.yml#L42) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-bb84/blob/4689a88c85ddce5da796f897e670f121d3b71566/.github/workflows/deploy.yml#L45) `build (needs: —): npm run test:browser`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-bb84/blob/4689a88c85ddce5da796f897e670f121d3b71566/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:15](https://github.com/systemslibrarian/crypto-lab-bb84/blob/4689a88c85ddce5da796f897e670f121d3b71566/README.md#L15)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-bcrypt-forge — e46270eafb13e8061b38d4afa2261917970dbb56

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/lib.test.ts:7](https://github.com/systemslibrarian/crypto-lab-bcrypt-forge/blob/e46270eafb13e8061b38d4afa2261917970dbb56/src/lib.test.ts#L7) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/bcrypt.integration.test.ts:23](https://github.com/systemslibrarian/crypto-lab-bcrypt-forge/blob/e46270eafb13e8061b38d4afa2261917970dbb56/src/bcrypt.integration.test.ts#L23)
- **Deploy gate (+)**: [.github/workflows/deploy-pages.yml:43](https://github.com/systemslibrarian/crypto-lab-bcrypt-forge/blob/e46270eafb13e8061b38d4afa2261917970dbb56/.github/workflows/deploy-pages.yml#L43) `deploy (needs: —): npm test`; [.github/workflows/deploy-pages.yml:46](https://github.com/systemslibrarian/crypto-lab-bcrypt-forge/blob/e46270eafb13e8061b38d4afa2261917970dbb56/.github/workflows/deploy-pages.yml#L46) `deploy (needs: —): npm run build`; [.github/workflows/deploy-pages.yml:49](https://github.com/systemslibrarian/crypto-lab-bcrypt-forge/blob/e46270eafb13e8061b38d4afa2261917970dbb56/.github/workflows/deploy-pages.yml#L49) `deploy (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy-pages.yml:52](https://github.com/systemslibrarian/crypto-lab-bcrypt-forge/blob/e46270eafb13e8061b38d4afa2261917970dbb56/.github/workflows/deploy-pages.yml#L52) `deploy (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-bcrypt-forge/blob/e46270eafb13e8061b38d4afa2261917970dbb56/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-bcrypt-forge/blob/e46270eafb13e8061b38d4afa2261917970dbb56/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-beacon-lock — 2afde321bfd68c7808b5d5b6da65fba4da485820

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/core/bls.test.ts:7](https://github.com/systemslibrarian/crypto-lab-beacon-lock/blob/2afde321bfd68c7808b5d5b6da65fba4da485820/src/core/bls.test.ts#L7) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:145](https://github.com/systemslibrarian/crypto-lab-beacon-lock/blob/2afde321bfd68c7808b5d5b6da65fba4da485820/e2e/claims.spec.ts#L145)
- **Negative test (+)**: [e2e/claims.spec.ts:189](https://github.com/systemslibrarian/crypto-lab-beacon-lock/blob/2afde321bfd68c7808b5d5b6da65fba4da485820/e2e/claims.spec.ts#L189)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-beacon-lock/blob/2afde321bfd68c7808b5d5b6da65fba4da485820/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-beacon-lock/blob/2afde321bfd68c7808b5d5b6da65fba4da485820/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-beacon-lock/blob/2afde321bfd68c7808b5d5b6da65fba4da485820/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-beacon-lock/blob/2afde321bfd68c7808b5d5b6da65fba4da485820/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:63](https://github.com/systemslibrarian/crypto-lab-beacon-lock/blob/2afde321bfd68c7808b5d5b6da65fba4da485820/README.md#L63)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-biham-lens — 27249921456d250cb3955f89b2c43bdbc1c5a577

Source scan: SCANNED.
- **Ground truth (0)**: Self-generated fixture at [demos/biham-lens/src/__tests__/spn.test.ts:78](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/27249921456d250cb3955f89b2c43bdbc1c5a577/demos/biham-lens/src/__tests__/spn.test.ts#L78); no published fixture established.
- **Independent check (0)**: No qualifying check established in the inspected source; [README.md:1](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/27249921456d250cb3955f89b2c43bdbc1c5a577/README.md#L1).
- **Displayed claim (+)**: [demos/biham-lens/e2e/claims.spec.ts:291](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/27249921456d250cb3955f89b2c43bdbc1c5a577/demos/biham-lens/e2e/claims.spec.ts#L291)
- **Negative test (+)**: [demos/biham-lens/e2e/claims.spec.ts:177](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/27249921456d250cb3955f89b2c43bdbc1c5a577/demos/biham-lens/e2e/claims.spec.ts#L177)
- **Deploy gate (+)**: [.github/workflows/pages.yml:44](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/27249921456d250cb3955f89b2c43bdbc1c5a577/.github/workflows/pages.yml#L44) `build (needs: —): npm test`; [.github/workflows/pages.yml:47](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/27249921456d250cb3955f89b2c43bdbc1c5a577/.github/workflows/pages.yml#L47) `build (needs: —): npm run build`; [.github/workflows/pages.yml:50](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/27249921456d250cb3955f89b2c43bdbc1c5a577/.github/workflows/pages.yml#L50) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:53](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/27249921456d250cb3955f89b2c43bdbc1c5a577/.github/workflows/pages.yml#L53) `build (needs: —): npm run test:a11y`; engines: chromium ([demos/biham-lens/playwright.config.ts:41](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/27249921456d250cb3955f89b2c43bdbc1c5a577/demos/biham-lens/playwright.config.ts#L41))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:5](https://github.com/systemslibrarian/crypto-lab-biham-lens/blob/27249921456d250cb3955f89b2c43bdbc1c5a577/README.md#L5) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-bike-vault — f436ed0dbe26021959356e02b0d887c334229923

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [test/bike.test.ts:164](https://github.com/systemslibrarian/crypto-lab-bike-vault/blob/f436ed0dbe26021959356e02b0d887c334229923/test/bike.test.ts#L164) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [test/qcmdpc.test.ts:24](https://github.com/systemslibrarian/crypto-lab-bike-vault/blob/f436ed0dbe26021959356e02b0d887c334229923/test/qcmdpc.test.ts#L24)
- **Deploy gate (+)**: [.github/workflows/deploy-pages.yml:37](https://github.com/systemslibrarian/crypto-lab-bike-vault/blob/f436ed0dbe26021959356e02b0d887c334229923/.github/workflows/deploy-pages.yml#L37) `build (needs: —): npm run build`; [.github/workflows/deploy-pages.yml:40](https://github.com/systemslibrarian/crypto-lab-bike-vault/blob/f436ed0dbe26021959356e02b0d887c334229923/.github/workflows/deploy-pages.yml#L40) `build (needs: —): npm test`; [.github/workflows/deploy-pages.yml:43](https://github.com/systemslibrarian/crypto-lab-bike-vault/blob/f436ed0dbe26021959356e02b0d887c334229923/.github/workflows/deploy-pages.yml#L43) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy-pages.yml:46](https://github.com/systemslibrarian/crypto-lab-bike-vault/blob/f436ed0dbe26021959356e02b0d887c334229923/.github/workflows/deploy-pages.yml#L46) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-bike-vault/blob/f436ed0dbe26021959356e02b0d887c334229923/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:16](https://github.com/systemslibrarian/crypto-lab-bike-vault/blob/f436ed0dbe26021959356e02b0d887c334229923/README.md#L16)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-bitcoin-script — 40bc5cba8c1f7ee338fd792869b0af2d9b3af241

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:740](https://github.com/systemslibrarian/crypto-lab-bitcoin-script/blob/40bc5cba8c1f7ee338fd792869b0af2d9b3af241/e2e/claims.spec.ts#L740) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:1](https://github.com/systemslibrarian/crypto-lab-bitcoin-script/blob/40bc5cba8c1f7ee338fd792869b0af2d9b3af241/e2e/claims.spec.ts#L1) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:295](https://github.com/systemslibrarian/crypto-lab-bitcoin-script/blob/40bc5cba8c1f7ee338fd792869b0af2d9b3af241/e2e/claims.spec.ts#L295)
- **Negative test (+)**: [tests/inspect.test.ts:91](https://github.com/systemslibrarian/crypto-lab-bitcoin-script/blob/40bc5cba8c1f7ee338fd792869b0af2d9b3af241/tests/inspect.test.ts#L91)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:29](https://github.com/systemslibrarian/crypto-lab-bitcoin-script/blob/40bc5cba8c1f7ee338fd792869b0af2d9b3af241/.github/workflows/deploy.yml#L29) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-bitcoin-script/blob/40bc5cba8c1f7ee338fd792869b0af2d9b3af241/.github/workflows/deploy.yml#L31) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-bitcoin-script/blob/40bc5cba8c1f7ee338fd792869b0af2d9b3af241/.github/workflows/deploy.yml#L33) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:30](https://github.com/systemslibrarian/crypto-lab-bitcoin-script/blob/40bc5cba8c1f7ee338fd792869b0af2d9b3af241/playwright.config.ts#L30))
- **Limits and guidance (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-bitcoin-wallet — 951a100896c17a93e9be4388e06af319725c4a84

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [tests/engine.test.ts:105](https://github.com/systemslibrarian/crypto-lab-bitcoin-wallet/blob/951a100896c17a93e9be4388e06af319725c4a84/tests/engine.test.ts#L105) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [tests/qr.test.ts:2](https://github.com/systemslibrarian/crypto-lab-bitcoin-wallet/blob/951a100896c17a93e9be4388e06af319725c4a84/tests/qr.test.ts#L2) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:266](https://github.com/systemslibrarian/crypto-lab-bitcoin-wallet/blob/951a100896c17a93e9be4388e06af319725c4a84/e2e/claims.spec.ts#L266)
- **Negative test (+)**: [tests/engine.test.ts:134](https://github.com/systemslibrarian/crypto-lab-bitcoin-wallet/blob/951a100896c17a93e9be4388e06af319725c4a84/tests/engine.test.ts#L134)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-bitcoin-wallet/blob/951a100896c17a93e9be4388e06af319725c4a84/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-bitcoin-wallet/blob/951a100896c17a93e9be4388e06af319725c4a84/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-bitcoin-wallet/blob/951a100896c17a93e9be4388e06af319725c4a84/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-bitcoin-wallet/blob/951a100896c17a93e9be4388e06af319725c4a84/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-bitcoin-wallet/blob/951a100896c17a93e9be4388e06af319725c4a84/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-bitcoin-wallet/blob/951a100896c17a93e9be4388e06af319725c4a84/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-blind-hello — f19da9e8664a4e567929a296364c09b24f6703c2

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/ech/kat.test.ts:2](https://github.com/systemslibrarian/crypto-lab-blind-hello/blob/f19da9e8664a4e567929a296364c09b24f6703c2/src/ech/kat.test.ts#L2) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:31](https://github.com/systemslibrarian/crypto-lab-blind-hello/blob/f19da9e8664a4e567929a296364c09b24f6703c2/e2e/claims.spec.ts#L31)
- **Negative test (+)**: [e2e/claims.spec.ts:74](https://github.com/systemslibrarian/crypto-lab-blind-hello/blob/f19da9e8664a4e567929a296364c09b24f6703c2/e2e/claims.spec.ts#L74)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:58](https://github.com/systemslibrarian/crypto-lab-blind-hello/blob/f19da9e8664a4e567929a296364c09b24f6703c2/.github/workflows/deploy.yml#L58) `build (needs: —): npm test`; [.github/workflows/deploy.yml:61](https://github.com/systemslibrarian/crypto-lab-blind-hello/blob/f19da9e8664a4e567929a296364c09b24f6703c2/.github/workflows/deploy.yml#L61) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:64](https://github.com/systemslibrarian/crypto-lab-blind-hello/blob/f19da9e8664a4e567929a296364c09b24f6703c2/.github/workflows/deploy.yml#L64) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:67](https://github.com/systemslibrarian/crypto-lab-blind-hello/blob/f19da9e8664a4e567929a296364c09b24f6703c2/.github/workflows/deploy.yml#L67) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-blind-hello/blob/f19da9e8664a4e567929a296364c09b24f6703c2/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-blind-hello/blob/f19da9e8664a4e567929a296364c09b24f6703c2/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-blind-oracle — 91d3cce4e17f1c67cd39ed5345e407a4b6521ab9

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/encoding.test.ts:23](https://github.com/systemslibrarian/crypto-lab-blind-oracle/blob/91d3cce4e17f1c67cd39ed5345e407a4b6521ab9/src/encoding.test.ts#L23) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/encoding.test.ts:29](https://github.com/systemslibrarian/crypto-lab-blind-oracle/blob/91d3cce4e17f1c67cd39ed5345e407a4b6521ab9/src/encoding.test.ts#L29)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:70](https://github.com/systemslibrarian/crypto-lab-blind-oracle/blob/91d3cce4e17f1c67cd39ed5345e407a4b6521ab9/.github/workflows/deploy.yml#L70) `build (needs: —): npm test`; [.github/workflows/deploy.yml:72](https://github.com/systemslibrarian/crypto-lab-blind-oracle/blob/91d3cce4e17f1c67cd39ed5345e407a4b6521ab9/.github/workflows/deploy.yml#L72) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:75](https://github.com/systemslibrarian/crypto-lab-blind-oracle/blob/91d3cce4e17f1c67cd39ed5345e407a4b6521ab9/.github/workflows/deploy.yml#L75) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:88](https://github.com/systemslibrarian/crypto-lab-blind-oracle/blob/91d3cce4e17f1c67cd39ed5345e407a4b6521ab9/.github/workflows/deploy.yml#L88) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:21](https://github.com/systemslibrarian/crypto-lab-blind-oracle/blob/91d3cce4e17f1c67cd39ed5345e407a4b6521ab9/playwright.config.ts#L21))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-blind-oracle/blob/91d3cce4e17f1c67cd39ed5345e407a4b6521ab9/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-blind-relay — eb6ac58b889b6a3fee2ec400df15c0255533cfc5

Source scan: SCANNED.
- **Ground truth (+)**: [src/ohttp/kat.test.ts:2](https://github.com/systemslibrarian/crypto-lab-blind-relay/blob/eb6ac58b889b6a3fee2ec400df15c0255533cfc5/src/ohttp/kat.test.ts#L2)
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:538](https://github.com/systemslibrarian/crypto-lab-blind-relay/blob/eb6ac58b889b6a3fee2ec400df15c0255533cfc5/e2e/claims.spec.ts#L538)
- **Negative test (+)**: [e2e/claims.spec.ts:353](https://github.com/systemslibrarian/crypto-lab-blind-relay/blob/eb6ac58b889b6a3fee2ec400df15c0255533cfc5/e2e/claims.spec.ts#L353)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-blind-relay/blob/eb6ac58b889b6a3fee2ec400df15c0255533cfc5/.github/workflows/deploy.yml#L38) `build (needs: —): npm test`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-blind-relay/blob/eb6ac58b889b6a3fee2ec400df15c0255533cfc5/.github/workflows/deploy.yml#L39) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-blind-relay/blob/eb6ac58b889b6a3fee2ec400df15c0255533cfc5/.github/workflows/deploy.yml#L41) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-blind-relay/blob/eb6ac58b889b6a3fee2ec400df15c0255533cfc5/.github/workflows/deploy.yml#L43) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:27](https://github.com/systemslibrarian/crypto-lab-blind-relay/blob/eb6ac58b889b6a3fee2ec400df15c0255533cfc5/playwright.config.ts#L27))
- **Limits and guidance (+)**: [README.md:27](https://github.com/systemslibrarian/crypto-lab-blind-relay/blob/eb6ac58b889b6a3fee2ec400df15c0255533cfc5/README.md#L27)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-blind-sign — 174e0450b8d4b7e05bb94762c07ca1e74c8d87b9

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/rfc9474.test.ts:14](https://github.com/systemslibrarian/crypto-lab-blind-sign/blob/174e0450b8d4b7e05bb94762c07ca1e74c8d87b9/src/rfc9474.test.ts#L14) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:485](https://github.com/systemslibrarian/crypto-lab-blind-sign/blob/174e0450b8d4b7e05bb94762c07ca1e74c8d87b9/e2e/claims.spec.ts#L485)
- **Negative test (+)**: [src/ecblind.test.ts:18](https://github.com/systemslibrarian/crypto-lab-blind-sign/blob/174e0450b8d4b7e05bb94762c07ca1e74c8d87b9/src/ecblind.test.ts#L18)
- **Deploy gate (+)**: [.github/workflows/pages.yml:25](https://github.com/systemslibrarian/crypto-lab-blind-sign/blob/174e0450b8d4b7e05bb94762c07ca1e74c8d87b9/.github/workflows/pages.yml#L25) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:26](https://github.com/systemslibrarian/crypto-lab-blind-sign/blob/174e0450b8d4b7e05bb94762c07ca1e74c8d87b9/.github/workflows/pages.yml#L26) `build (needs: —): npm run build`; [.github/workflows/pages.yml:28](https://github.com/systemslibrarian/crypto-lab-blind-sign/blob/174e0450b8d4b7e05bb94762c07ca1e74c8d87b9/.github/workflows/pages.yml#L28) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-blind-sign/blob/174e0450b8d4b7e05bb94762c07ca1e74c8d87b9/.github/workflows/pages.yml#L30) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-blind-sign/blob/174e0450b8d4b7e05bb94762c07ca1e74c8d87b9/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:4](https://github.com/systemslibrarian/crypto-lab-blind-sign/blob/174e0450b8d4b7e05bb94762c07ca1e74c8d87b9/README.md#L4)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-broken-trust — 221bbf3950965ceed3106a12dc88e489fef0d36b

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/model.test.ts:454](https://github.com/systemslibrarian/crypto-lab-broken-trust/blob/221bbf3950965ceed3106a12dc88e489fef0d36b/src/model.test.ts#L454) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Deploy gate (+)**: [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-broken-trust/blob/221bbf3950965ceed3106a12dc88e489fef0d36b/.github/workflows/deploy.yml#L37) `build (needs: —): npm test`; [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-broken-trust/blob/221bbf3950965ceed3106a12dc88e489fef0d36b/.github/workflows/deploy.yml#L38) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-broken-trust/blob/221bbf3950965ceed3106a12dc88e489fef0d36b/.github/workflows/deploy.yml#L40) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:42](https://github.com/systemslibrarian/crypto-lab-broken-trust/blob/221bbf3950965ceed3106a12dc88e489fef0d36b/.github/workflows/deploy.yml#L42) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-broken-trust/blob/221bbf3950965ceed3106a12dc88e489fef0d36b/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-broken-trust/blob/221bbf3950965ceed3106a12dc88e489fef0d36b/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-bulletproofs — 09b65bc8c29cce5c8747e29823c1cb7eeea28770

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:133](https://github.com/systemslibrarian/crypto-lab-bulletproofs/blob/09b65bc8c29cce5c8747e29823c1cb7eeea28770/e2e/claims.spec.ts#L133) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:75](https://github.com/systemslibrarian/crypto-lab-bulletproofs/blob/09b65bc8c29cce5c8747e29823c1cb7eeea28770/e2e/claims.spec.ts#L75)
- **Negative test (+)**: [e2e/claims.spec.ts:256](https://github.com/systemslibrarian/crypto-lab-bulletproofs/blob/09b65bc8c29cce5c8747e29823c1cb7eeea28770/e2e/claims.spec.ts#L256)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-bulletproofs/blob/09b65bc8c29cce5c8747e29823c1cb7eeea28770/.github/workflows/deploy.yml#L45) `build (needs: —): npm test`; [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-bulletproofs/blob/09b65bc8c29cce5c8747e29823c1cb7eeea28770/.github/workflows/deploy.yml#L46) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:48](https://github.com/systemslibrarian/crypto-lab-bulletproofs/blob/09b65bc8c29cce5c8747e29823c1cb7eeea28770/.github/workflows/deploy.yml#L48) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:50](https://github.com/systemslibrarian/crypto-lab-bulletproofs/blob/09b65bc8c29cce5c8747e29823c1cb7eeea28770/.github/workflows/deploy.yml#L50) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-bulletproofs/blob/09b65bc8c29cce5c8747e29823c1cb7eeea28770/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:12](https://github.com/systemslibrarian/crypto-lab-bulletproofs/blob/09b65bc8c29cce5c8747e29823c1cb7eeea28770/README.md#L12)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-card-trick — 126579c282efcf5ea58228252b2ee646c25ec8b4

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/cards/vectors.test.ts:2](https://github.com/systemslibrarian/crypto-lab-card-trick/blob/126579c282efcf5ea58228252b2ee646c25ec8b4/src/cards/vectors.test.ts#L2) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/cards/protocol.test.ts:45](https://github.com/systemslibrarian/crypto-lab-card-trick/blob/126579c282efcf5ea58228252b2ee646c25ec8b4/src/cards/protocol.test.ts#L45)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:28](https://github.com/systemslibrarian/crypto-lab-card-trick/blob/126579c282efcf5ea58228252b2ee646c25ec8b4/.github/workflows/deploy.yml#L28) `build (needs: —): npm test`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-card-trick/blob/126579c282efcf5ea58228252b2ee646c25ec8b4/.github/workflows/deploy.yml#L30) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-card-trick/blob/126579c282efcf5ea58228252b2ee646c25ec8b4/.github/workflows/deploy.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-card-trick/blob/126579c282efcf5ea58228252b2ee646c25ec8b4/.github/workflows/deploy.yml#L34) `build (needs: —): npm run test:a11y`; engines: firefox ([playwright.config.ts:56](https://github.com/systemslibrarian/crypto-lab-card-trick/blob/126579c282efcf5ea58228252b2ee646c25ec8b4/playwright.config.ts#L56))
- **Limits and guidance (+)**: [README.md:51](https://github.com/systemslibrarian/crypto-lab-card-trick/blob/126579c282efcf5ea58228252b2ee646c25ec8b4/README.md#L51)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-chacha20-stream — 074aa42b64f02e32e3ec49ffd778d963f8665649

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:18](https://github.com/systemslibrarian/crypto-lab-chacha20-stream/blob/074aa42b64f02e32e3ec49ffd778d963f8665649/e2e/claims.spec.ts#L18) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/chacha20.test.ts:8](https://github.com/systemslibrarian/crypto-lab-chacha20-stream/blob/074aa42b64f02e32e3ec49ffd778d963f8665649/src/chacha20.test.ts#L8) requires provenance/execution review.
- **Displayed claim (+)**: [src/ui.test.ts:59](https://github.com/systemslibrarian/crypto-lab-chacha20-stream/blob/074aa42b64f02e32e3ec49ffd778d963f8665649/src/ui.test.ts#L59)
- **Negative test (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-chacha20-stream/blob/074aa42b64f02e32e3ec49ffd778d963f8665649/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-chacha20-stream/blob/074aa42b64f02e32e3ec49ffd778d963f8665649/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-chacha20-stream/blob/074aa42b64f02e32e3ec49ffd778d963f8665649/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-chacha20-stream/blob/074aa42b64f02e32e3ec49ffd778d963f8665649/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-chacha20-stream/blob/074aa42b64f02e32e3ec49ffd778d963f8665649/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-chain-of-trust — 94f33f58e494e0534dbc89e2ec7c75bef0a0448e

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/pki/kat.test.ts:6](https://github.com/systemslibrarian/crypto-lab-chain-of-trust/blob/94f33f58e494e0534dbc89e2ec7c75bef0a0448e/src/pki/kat.test.ts#L6) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:92](https://github.com/systemslibrarian/crypto-lab-chain-of-trust/blob/94f33f58e494e0534dbc89e2ec7c75bef0a0448e/e2e/claims.spec.ts#L92) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:182](https://github.com/systemslibrarian/crypto-lab-chain-of-trust/blob/94f33f58e494e0534dbc89e2ec7c75bef0a0448e/e2e/claims.spec.ts#L182)
- **Negative test (+)**: [e2e/claims.spec.ts:61](https://github.com/systemslibrarian/crypto-lab-chain-of-trust/blob/94f33f58e494e0534dbc89e2ec7c75bef0a0448e/e2e/claims.spec.ts#L61)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-chain-of-trust/blob/94f33f58e494e0534dbc89e2ec7c75bef0a0448e/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-chain-of-trust/blob/94f33f58e494e0534dbc89e2ec7c75bef0a0448e/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-chain-of-trust/blob/94f33f58e494e0534dbc89e2ec7c75bef0a0448e/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-chain-of-trust/blob/94f33f58e494e0534dbc89e2ec7c75bef0a0448e/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:29](https://github.com/systemslibrarian/crypto-lab-chain-of-trust/blob/94f33f58e494e0534dbc89e2ec7c75bef0a0448e/README.md#L29)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ciphertext-mirror — 7918b3aec653aa1d6e8ff67d23d250aa62ce4208

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/lib/mlkem/__tests__/kat.test.ts:2](https://github.com/systemslibrarian/crypto-lab-ciphertext-mirror/blob/7918b3aec653aa1d6e8ff67d23d250aa62ce4208/src/lib/mlkem/__tests__/kat.test.ts#L2) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:161](https://github.com/systemslibrarian/crypto-lab-ciphertext-mirror/blob/7918b3aec653aa1d6e8ff67d23d250aa62ce4208/e2e/claims.spec.ts#L161)
- **Negative test (+)**: [e2e/claims.spec.ts:77](https://github.com/systemslibrarian/crypto-lab-ciphertext-mirror/blob/7918b3aec653aa1d6e8ff67d23d250aa62ce4208/e2e/claims.spec.ts#L77)
- **Deploy gate (+)**: [.github/workflows/deploy-pages.yml:43](https://github.com/systemslibrarian/crypto-lab-ciphertext-mirror/blob/7918b3aec653aa1d6e8ff67d23d250aa62ce4208/.github/workflows/deploy-pages.yml#L43) `build (needs: —): npm run test:coverage`; [.github/workflows/deploy-pages.yml:46](https://github.com/systemslibrarian/crypto-lab-ciphertext-mirror/blob/7918b3aec653aa1d6e8ff67d23d250aa62ce4208/.github/workflows/deploy-pages.yml#L46) `build (needs: —): npm run build`; [.github/workflows/deploy-pages.yml:49](https://github.com/systemslibrarian/crypto-lab-ciphertext-mirror/blob/7918b3aec653aa1d6e8ff67d23d250aa62ce4208/.github/workflows/deploy-pages.yml#L49) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy-pages.yml:52](https://github.com/systemslibrarian/crypto-lab-ciphertext-mirror/blob/7918b3aec653aa1d6e8ff67d23d250aa62ce4208/.github/workflows/deploy-pages.yml#L52) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-ciphertext-mirror/blob/7918b3aec653aa1d6e8ff67d23d250aa62ce4208/playwright.config.ts#L22))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:5](https://github.com/systemslibrarian/crypto-lab-ciphertext-mirror/blob/7918b3aec653aa1d6e8ff67d23d250aa62ce4208/README.md#L5) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ckks-lab — c518cded731c040a165c41e83dff0c739418cb0d

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:23](https://github.com/systemslibrarian/crypto-lab-ckks-lab/blob/c518cded731c040a165c41e83dff0c739418cb0d/e2e/claims.spec.ts#L23) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:326](https://github.com/systemslibrarian/crypto-lab-ckks-lab/blob/c518cded731c040a165c41e83dff0c739418cb0d/e2e/claims.spec.ts#L326)
- **Negative test (+)**: [test/toyCkks.test.ts:63](https://github.com/systemslibrarian/crypto-lab-ckks-lab/blob/c518cded731c040a165c41e83dff0c739418cb0d/test/toyCkks.test.ts#L63)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-ckks-lab/blob/c518cded731c040a165c41e83dff0c739418cb0d/.github/workflows/deploy.yml#L37) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-ckks-lab/blob/c518cded731c040a165c41e83dff0c739418cb0d/.github/workflows/deploy.yml#L39) `build (needs: —): npm test`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-ckks-lab/blob/c518cded731c040a165c41e83dff0c739418cb0d/.github/workflows/deploy.yml#L41) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-ckks-lab/blob/c518cded731c040a165c41e83dff0c739418cb0d/.github/workflows/deploy.yml#L43) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-ckks-lab/blob/c518cded731c040a165c41e83dff0c739418cb0d/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:19](https://github.com/systemslibrarian/crypto-lab-ckks-lab/blob/c518cded731c040a165c41e83dff0c739418cb0d/README.md#L19)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-collision-vault — 476dec52aa83e9eb3045cfb79a6e01d9a030f0d0

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [demos/collision-vault/src/__tests__/vectors.test.ts:9](https://github.com/systemslibrarian/crypto-lab-collision-vault/blob/476dec52aa83e9eb3045cfb79a6e01d9a030f0d0/demos/collision-vault/src/__tests__/vectors.test.ts#L9) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [demos/collision-vault/e2e/border.spec.ts:21](https://github.com/systemslibrarian/crypto-lab-collision-vault/blob/476dec52aa83e9eb3045cfb79a6e01d9a030f0d0/demos/collision-vault/e2e/border.spec.ts#L21)
- **Deploy gate (+)**: [.github/workflows/pages.yml:47](https://github.com/systemslibrarian/crypto-lab-collision-vault/blob/476dec52aa83e9eb3045cfb79a6e01d9a030f0d0/.github/workflows/pages.yml#L47) `build (needs: —): npx vite build`; [.github/workflows/pages.yml:51](https://github.com/systemslibrarian/crypto-lab-collision-vault/blob/476dec52aa83e9eb3045cfb79a6e01d9a030f0d0/.github/workflows/pages.yml#L51) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:55](https://github.com/systemslibrarian/crypto-lab-collision-vault/blob/476dec52aa83e9eb3045cfb79a6e01d9a030f0d0/.github/workflows/pages.yml#L55) `build (needs: —): npm run test:e2e`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-commit-gate — 98f205f1ca920eba6bd67c5d6900d47d7a1864c6

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:1](https://github.com/systemslibrarian/crypto-lab-commit-gate/blob/98f205f1ca920eba6bd67c5d6900d47d7a1864c6/e2e/claims.spec.ts#L1) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:89](https://github.com/systemslibrarian/crypto-lab-commit-gate/blob/98f205f1ca920eba6bd67c5d6900d47d7a1864c6/e2e/claims.spec.ts#L89)
- **Negative test (+)**: [src/commitments.test.ts:42](https://github.com/systemslibrarian/crypto-lab-commit-gate/blob/98f205f1ca920eba6bd67c5d6900d47d7a1864c6/src/commitments.test.ts#L42)
- **Deploy gate (+)**: [.github/workflows/pages.yml:25](https://github.com/systemslibrarian/crypto-lab-commit-gate/blob/98f205f1ca920eba6bd67c5d6900d47d7a1864c6/.github/workflows/pages.yml#L25) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:26](https://github.com/systemslibrarian/crypto-lab-commit-gate/blob/98f205f1ca920eba6bd67c5d6900d47d7a1864c6/.github/workflows/pages.yml#L26) `build (needs: —): npm run build`; [.github/workflows/pages.yml:28](https://github.com/systemslibrarian/crypto-lab-commit-gate/blob/98f205f1ca920eba6bd67c5d6900d47d7a1864c6/.github/workflows/pages.yml#L28) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-commit-gate/blob/98f205f1ca920eba6bd67c5d6900d47d7a1864c6/.github/workflows/pages.yml#L30) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-commit-gate/blob/98f205f1ca920eba6bd67c5d6900d47d7a1864c6/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:10](https://github.com/systemslibrarian/crypto-lab-commit-gate/blob/98f205f1ca920eba6bd67c5d6900d47d7a1864c6/README.md#L10)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-context-ward — 0fa3a0ee23fdb9dc6a8a294592dfed7434622c69

Source scan: PARTIAL. Vendored text omitted (see coverage table).
- **Ground truth (?)**: UNRESOLVED: candidate [verification/verify.py:13](https://github.com/systemslibrarian/crypto-lab-context-ward/blob/0fa3a0ee23fdb9dc6a8a294592dfed7434622c69/verification/verify.py#L13) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:20](https://github.com/systemslibrarian/crypto-lab-context-ward/blob/0fa3a0ee23fdb9dc6a8a294592dfed7434622c69/e2e/claims.spec.ts#L20) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:267](https://github.com/systemslibrarian/crypto-lab-context-ward/blob/0fa3a0ee23fdb9dc6a8a294592dfed7434622c69/e2e/claims.spec.ts#L267)
- **Negative test (+)**: [src/protocol.test.ts:61](https://github.com/systemslibrarian/crypto-lab-context-ward/blob/0fa3a0ee23fdb9dc6a8a294592dfed7434622c69/src/protocol.test.ts#L61)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-context-ward/blob/0fa3a0ee23fdb9dc6a8a294592dfed7434622c69/.github/workflows/deploy.yml#L38) `build (needs: —): npm test`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-context-ward/blob/0fa3a0ee23fdb9dc6a8a294592dfed7434622c69/.github/workflows/deploy.yml#L40) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:58](https://github.com/systemslibrarian/crypto-lab-context-ward/blob/0fa3a0ee23fdb9dc6a8a294592dfed7434622c69/.github/workflows/deploy.yml#L58) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:62](https://github.com/systemslibrarian/crypto-lab-context-ward/blob/0fa3a0ee23fdb9dc6a8a294592dfed7434622c69/.github/workflows/deploy.yml#L62) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:48](https://github.com/systemslibrarian/crypto-lab-context-ward/blob/0fa3a0ee23fdb9dc6a8a294592dfed7434622c69/README.md#L48)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-corrupted-oracle — ea7644876219e4253875eebbd695417ec2e68b74

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:7](https://github.com/systemslibrarian/crypto-lab-corrupted-oracle/blob/ea7644876219e4253875eebbd695417ec2e68b74/e2e/claims.spec.ts#L7) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:91](https://github.com/systemslibrarian/crypto-lab-corrupted-oracle/blob/ea7644876219e4253875eebbd695417ec2e68b74/e2e/claims.spec.ts#L91)
- **Negative test (+)**: [src/stats/nist-tests.test.ts:28](https://github.com/systemslibrarian/crypto-lab-corrupted-oracle/blob/ea7644876219e4253875eebbd695417ec2e68b74/src/stats/nist-tests.test.ts#L28)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-corrupted-oracle/blob/ea7644876219e4253875eebbd695417ec2e68b74/.github/workflows/deploy.yml#L36) `build (needs: —): npm test`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-corrupted-oracle/blob/ea7644876219e4253875eebbd695417ec2e68b74/.github/workflows/deploy.yml#L39) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:42](https://github.com/systemslibrarian/crypto-lab-corrupted-oracle/blob/ea7644876219e4253875eebbd695417ec2e68b74/.github/workflows/deploy.yml#L42) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-corrupted-oracle/blob/ea7644876219e4253875eebbd695417ec2e68b74/.github/workflows/deploy.yml#L45) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:23](https://github.com/systemslibrarian/crypto-lab-corrupted-oracle/blob/ea7644876219e4253875eebbd695417ec2e68b74/playwright.config.ts#L23))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-corrupted-oracle/blob/ea7644876219e4253875eebbd695417ec2e68b74/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-covert-channel-studio — de4bfe0c9bb1f7733f795d9154a2cf3e023f8117

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [test/icmp.test.js:96](https://github.com/systemslibrarian/crypto-lab-covert-channel-studio/blob/de4bfe0c9bb1f7733f795d9154a2cf3e023f8117/test/icmp.test.js#L96) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [test/csp.test.js:22](https://github.com/systemslibrarian/crypto-lab-covert-channel-studio/blob/de4bfe0c9bb1f7733f795d9154a2cf3e023f8117/test/csp.test.js#L22) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [test/bits.test.js:89](https://github.com/systemslibrarian/crypto-lab-covert-channel-studio/blob/de4bfe0c9bb1f7733f795d9154a2cf3e023f8117/test/bits.test.js#L89)
- **Deploy gate (+)**: [.github/workflows/deploy-pages.yml:46](https://github.com/systemslibrarian/crypto-lab-covert-channel-studio/blob/de4bfe0c9bb1f7733f795d9154a2cf3e023f8117/.github/workflows/deploy-pages.yml#L46) `test (needs: —): npm test`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:5](https://github.com/systemslibrarian/crypto-lab-covert-channel-studio/blob/de4bfe0c9bb1f7733f795d9154a2cf3e023f8117/README.md#L5) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-credential-veil — cc97144ec5f02828177b85fc4f87510b01e852e7

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/bbs/bbs.test.ts:2](https://github.com/systemslibrarian/crypto-lab-credential-veil/blob/cc97144ec5f02828177b85fc4f87510b01e852e7/src/bbs/bbs.test.ts#L2) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:374](https://github.com/systemslibrarian/crypto-lab-credential-veil/blob/cc97144ec5f02828177b85fc4f87510b01e852e7/e2e/claims.spec.ts#L374)
- **Negative test (+)**: [e2e/claims.spec.ts:242](https://github.com/systemslibrarian/crypto-lab-credential-veil/blob/cc97144ec5f02828177b85fc4f87510b01e852e7/e2e/claims.spec.ts#L242)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-credential-veil/blob/cc97144ec5f02828177b85fc4f87510b01e852e7/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-credential-veil/blob/cc97144ec5f02828177b85fc4f87510b01e852e7/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-credential-veil/blob/cc97144ec5f02828177b85fc4f87510b01e852e7/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium firefox webkit`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-credential-veil/blob/cc97144ec5f02828177b85fc4f87510b01e852e7/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:27](https://github.com/systemslibrarian/crypto-lab-credential-veil/blob/cc97144ec5f02828177b85fc4f87510b01e852e7/playwright.config.ts#L27)), firefox ([playwright.config.ts:28](https://github.com/systemslibrarian/crypto-lab-credential-veil/blob/cc97144ec5f02828177b85fc4f87510b01e852e7/playwright.config.ts#L28)), webkit ([playwright.config.ts:29](https://github.com/systemslibrarian/crypto-lab-credential-veil/blob/cc97144ec5f02828177b85fc4f87510b01e852e7/playwright.config.ts#L29))
- **Limits and guidance (+)**: [README.md:15](https://github.com/systemslibrarian/crypto-lab-credential-veil/blob/cc97144ec5f02828177b85fc4f87510b01e852e7/README.md#L15)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-curve-lens — 4d2ab84a2163db17ac075fc3bd1423ff25729c2a

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:219](https://github.com/systemslibrarian/crypto-lab-curve-lens/blob/4d2ab84a2163db17ac075fc3bd1423ff25729c2a/e2e/claims.spec.ts#L219) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/brainpool.test.ts:60](https://github.com/systemslibrarian/crypto-lab-curve-lens/blob/4d2ab84a2163db17ac075fc3bd1423ff25729c2a/src/brainpool.test.ts#L60) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:494](https://github.com/systemslibrarian/crypto-lab-curve-lens/blob/4d2ab84a2163db17ac075fc3bd1423ff25729c2a/e2e/claims.spec.ts#L494)
- **Negative test (+)**: [src/brainpool.test.ts:59](https://github.com/systemslibrarian/crypto-lab-curve-lens/blob/4d2ab84a2163db17ac075fc3bd1423ff25729c2a/src/brainpool.test.ts#L59)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-curve-lens/blob/4d2ab84a2163db17ac075fc3bd1423ff25729c2a/.github/workflows/deploy.yml#L38) `build (needs: —): npm test`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-curve-lens/blob/4d2ab84a2163db17ac075fc3bd1423ff25729c2a/.github/workflows/deploy.yml#L39) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:42](https://github.com/systemslibrarian/crypto-lab-curve-lens/blob/4d2ab84a2163db17ac075fc3bd1423ff25729c2a/.github/workflows/deploy.yml#L42) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:44](https://github.com/systemslibrarian/crypto-lab-curve-lens/blob/4d2ab84a2163db17ac075fc3bd1423ff25729c2a/.github/workflows/deploy.yml#L44) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:21](https://github.com/systemslibrarian/crypto-lab-curve-lens/blob/4d2ab84a2163db17ac075fc3bd1423ff25729c2a/playwright.config.ts#L21))
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-curve-lens/blob/4d2ab84a2163db17ac075fc3bd1423ff25729c2a/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-curve448 — 6429c3062bfed4c8b55d832d97d2d2fd7b4cd7ea

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:194](https://github.com/systemslibrarian/crypto-lab-curve448/blob/6429c3062bfed4c8b55d832d97d2d2fd7b4cd7ea/e2e/claims.spec.ts#L194) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:211](https://github.com/systemslibrarian/crypto-lab-curve448/blob/6429c3062bfed4c8b55d832d97d2d2fd7b4cd7ea/e2e/claims.spec.ts#L211)
- **Negative test (+)**: [test/ui.test.ts:57](https://github.com/systemslibrarian/crypto-lab-curve448/blob/6429c3062bfed4c8b55d832d97d2d2fd7b4cd7ea/test/ui.test.ts#L57)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-curve448/blob/6429c3062bfed4c8b55d832d97d2d2fd7b4cd7ea/.github/workflows/deploy.yml#L37) `build (needs: —): npm test`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-curve448/blob/6429c3062bfed4c8b55d832d97d2d2fd7b4cd7ea/.github/workflows/deploy.yml#L39) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-curve448/blob/6429c3062bfed4c8b55d832d97d2d2fd7b4cd7ea/.github/workflows/deploy.yml#L41) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-curve448/blob/6429c3062bfed4c8b55d832d97d2d2fd7b4cd7ea/.github/workflows/deploy.yml#L43) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-curve448/blob/6429c3062bfed4c8b55d832d97d2d2fd7b4cd7ea/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-curve448/blob/6429c3062bfed4c8b55d832d97d2d2fd7b4cd7ea/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-dead-sea-cipher — 1a96dd39fc35055072e734bb235eff5e7d71e41c

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [demos/dead-sea-cipher/src/__tests__/ciphers.test.ts:277](https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher/blob/1a96dd39fc35055072e734bb235eff5e7d71e41c/demos/dead-sea-cipher/src/__tests__/ciphers.test.ts#L277) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [demos/dead-sea-cipher/e2e/claims.spec.ts:92](https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher/blob/1a96dd39fc35055072e734bb235eff5e7d71e41c/demos/dead-sea-cipher/e2e/claims.spec.ts#L92)
- **Negative test (+)**: [demos/dead-sea-cipher/e2e/claims.spec.ts:283](https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher/blob/1a96dd39fc35055072e734bb235eff5e7d71e41c/demos/dead-sea-cipher/e2e/claims.spec.ts#L283)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher/blob/1a96dd39fc35055072e734bb235eff5e7d71e41c/.github/workflows/deploy.yml#L40) `build (needs: —): npm test`; [.github/workflows/deploy.yml:44](https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher/blob/1a96dd39fc35055072e734bb235eff5e7d71e41c/.github/workflows/deploy.yml#L44) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:48](https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher/blob/1a96dd39fc35055072e734bb235eff5e7d71e41c/.github/workflows/deploy.yml#L48) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:52](https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher/blob/1a96dd39fc35055072e734bb235eff5e7d71e41c/.github/workflows/deploy.yml#L52) `build (needs: —): npm run test:e2e`; engines: chromium ([demos/dead-sea-cipher/playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher/blob/1a96dd39fc35055072e734bb235eff5e7d71e41c/demos/dead-sea-cipher/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:12](https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher/blob/1a96dd39fc35055072e734bb235eff5e7d71e41c/README.md#L12)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-diffie-hellman-mitm — 8d69dbc7ae4f267d057374fc08d6a0eca76f98bd

Source scan: SCANNED.
- **Ground truth (0)**: No qualifying check established in the inspected source; [README.md:1](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm/blob/8d69dbc7ae4f267d057374fc08d6a0eca76f98bd/README.md#L1).
- **Independent check (?)**: UNRESOLVED: candidate [scripts/engine.test.mjs:180](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm/blob/8d69dbc7ae4f267d057374fc08d6a0eca76f98bd/scripts/engine.test.mjs#L180) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [scripts/engine.test.mjs:155](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm/blob/8d69dbc7ae4f267d057374fc08d6a0eca76f98bd/scripts/engine.test.mjs#L155)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm/blob/8d69dbc7ae4f267d057374fc08d6a0eca76f98bd/.github/workflows/deploy.yml#L34) `build (needs: —): npm test`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm/blob/8d69dbc7ae4f267d057374fc08d6a0eca76f98bd/.github/workflows/deploy.yml#L35) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm/blob/8d69dbc7ae4f267d057374fc08d6a0eca76f98bd/.github/workflows/deploy.yml#L37) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm/blob/8d69dbc7ae4f267d057374fc08d6a0eca76f98bd/.github/workflows/deploy.yml#L39) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm/blob/8d69dbc7ae4f267d057374fc08d6a0eca76f98bd/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm/blob/8d69dbc7ae4f267d057374fc08d6a0eca76f98bd/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-dilithium-reject — 42090e5a6e9905ae959724792e9bfdf0144c4e51

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:123](https://github.com/systemslibrarian/crypto-lab-dilithium-reject/blob/42090e5a6e9905ae959724792e9bfdf0144c4e51/e2e/claims.spec.ts#L123) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/real-timing.test.ts:2](https://github.com/systemslibrarian/crypto-lab-dilithium-reject/blob/42090e5a6e9905ae959724792e9bfdf0144c4e51/src/real-timing.test.ts#L2) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:409](https://github.com/systemslibrarian/crypto-lab-dilithium-reject/blob/42090e5a6e9905ae959724792e9bfdf0144c4e51/e2e/claims.spec.ts#L409)
- **Negative test (+)**: [src/instrumented-sign.test.ts:39](https://github.com/systemslibrarian/crypto-lab-dilithium-reject/blob/42090e5a6e9905ae959724792e9bfdf0144c4e51/src/instrumented-sign.test.ts#L39)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:21](https://github.com/systemslibrarian/crypto-lab-dilithium-reject/blob/42090e5a6e9905ae959724792e9bfdf0144c4e51/.github/workflows/deploy.yml#L21) `deploy (needs: —): npm test`; [.github/workflows/deploy.yml:22](https://github.com/systemslibrarian/crypto-lab-dilithium-reject/blob/42090e5a6e9905ae959724792e9bfdf0144c4e51/.github/workflows/deploy.yml#L22) `deploy (needs: —): npm run build`; [.github/workflows/deploy.yml:24](https://github.com/systemslibrarian/crypto-lab-dilithium-reject/blob/42090e5a6e9905ae959724792e9bfdf0144c4e51/.github/workflows/deploy.yml#L24) `deploy (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:26](https://github.com/systemslibrarian/crypto-lab-dilithium-reject/blob/42090e5a6e9905ae959724792e9bfdf0144c4e51/.github/workflows/deploy.yml#L26) `deploy (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:21](https://github.com/systemslibrarian/crypto-lab-dilithium-reject/blob/42090e5a6e9905ae959724792e9bfdf0144c4e51/playwright.config.ts#L21))
- **Limits and guidance (+)**: [README.md:43](https://github.com/systemslibrarian/crypto-lab-dilithium-reject/blob/42090e5a6e9905ae959724792e9bfdf0144c4e51/README.md#L43)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-dilithium-seal — 30268a422f69273a78749ac9df2270de648c1a63

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [scripts/fetch-acvp-vectors.mjs:3](https://github.com/systemslibrarian/crypto-lab-dilithium-seal/blob/30268a422f69273a78749ac9df2270de648c1a63/scripts/fetch-acvp-vectors.mjs#L3) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [scripts/verify-deployment.mjs:25](https://github.com/systemslibrarian/crypto-lab-dilithium-seal/blob/30268a422f69273a78749ac9df2270de648c1a63/scripts/verify-deployment.mjs#L25) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:256](https://github.com/systemslibrarian/crypto-lab-dilithium-seal/blob/30268a422f69273a78749ac9df2270de648c1a63/e2e/claims.spec.ts#L256)
- **Negative test (+)**: [e2e/claims.spec.ts:289](https://github.com/systemslibrarian/crypto-lab-dilithium-seal/blob/30268a422f69273a78749ac9df2270de648c1a63/e2e/claims.spec.ts#L289)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:91](https://github.com/systemslibrarian/crypto-lab-dilithium-seal/blob/30268a422f69273a78749ac9df2270de648c1a63/.github/workflows/deploy.yml#L91) `lighthouse (needs: —): npm run build`; [.github/workflows/deploy.yml:89](https://github.com/systemslibrarian/crypto-lab-dilithium-seal/blob/30268a422f69273a78749ac9df2270de648c1a63/.github/workflows/deploy.yml#L89) `build (needs: —): npm test`; [.github/workflows/deploy.yml:91](https://github.com/systemslibrarian/crypto-lab-dilithium-seal/blob/30268a422f69273a78749ac9df2270de648c1a63/.github/workflows/deploy.yml#L91) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:94](https://github.com/systemslibrarian/crypto-lab-dilithium-seal/blob/30268a422f69273a78749ac9df2270de648c1a63/.github/workflows/deploy.yml#L94) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:97](https://github.com/systemslibrarian/crypto-lab-dilithium-seal/blob/30268a422f69273a78749ac9df2270de648c1a63/.github/workflows/deploy.yml#L97) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-dilithium-seal/blob/30268a422f69273a78749ac9df2270de648c1a63/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-dkg-gate — 004e4954b3a469dfb109c49aaec4225f9188db2b

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/dkg/rfc9496.test.ts:2](https://github.com/systemslibrarian/crypto-lab-dkg-gate/blob/004e4954b3a469dfb109c49aaec4225f9188db2b/src/dkg/rfc9496.test.ts#L2) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/dkg/rfc9496.test.ts:9](https://github.com/systemslibrarian/crypto-lab-dkg-gate/blob/004e4954b3a469dfb109c49aaec4225f9188db2b/src/dkg/rfc9496.test.ts#L9) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/dkg/feldman.test.ts:31](https://github.com/systemslibrarian/crypto-lab-dkg-gate/blob/004e4954b3a469dfb109c49aaec4225f9188db2b/src/dkg/feldman.test.ts#L31)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:28](https://github.com/systemslibrarian/crypto-lab-dkg-gate/blob/004e4954b3a469dfb109c49aaec4225f9188db2b/.github/workflows/deploy.yml#L28) `build (needs: —): npm test`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-dkg-gate/blob/004e4954b3a469dfb109c49aaec4225f9188db2b/.github/workflows/deploy.yml#L30) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-dkg-gate/blob/004e4954b3a469dfb109c49aaec4225f9188db2b/.github/workflows/deploy.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-dkg-gate/blob/004e4954b3a469dfb109c49aaec4225f9188db2b/.github/workflows/deploy.yml#L34) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:21](https://github.com/systemslibrarian/crypto-lab-dkg-gate/blob/004e4954b3a469dfb109c49aaec4225f9188db2b/README.md#L21)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-dnssec-chain — a2bc8b021af1f9129f13aea1147f510fe4a9cf97

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/dnssec/kat.test.ts:67](https://github.com/systemslibrarian/crypto-lab-dnssec-chain/blob/a2bc8b021af1f9129f13aea1147f510fe4a9cf97/src/dnssec/kat.test.ts#L67) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:182](https://github.com/systemslibrarian/crypto-lab-dnssec-chain/blob/a2bc8b021af1f9129f13aea1147f510fe4a9cf97/e2e/claims.spec.ts#L182)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:44](https://github.com/systemslibrarian/crypto-lab-dnssec-chain/blob/a2bc8b021af1f9129f13aea1147f510fe4a9cf97/.github/workflows/deploy.yml#L44) `build (needs: —): npm test`; [.github/workflows/deploy.yml:47](https://github.com/systemslibrarian/crypto-lab-dnssec-chain/blob/a2bc8b021af1f9129f13aea1147f510fe4a9cf97/.github/workflows/deploy.yml#L47) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:53](https://github.com/systemslibrarian/crypto-lab-dnssec-chain/blob/a2bc8b021af1f9129f13aea1147f510fe4a9cf97/.github/workflows/deploy.yml#L53) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:56](https://github.com/systemslibrarian/crypto-lab-dnssec-chain/blob/a2bc8b021af1f9129f13aea1147f510fe4a9cf97/.github/workflows/deploy.yml#L56) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:59](https://github.com/systemslibrarian/crypto-lab-dnssec-chain/blob/a2bc8b021af1f9129f13aea1147f510fe4a9cf97/.github/workflows/deploy.yml#L59) `build (needs: —): npm run test:claims`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:35](https://github.com/systemslibrarian/crypto-lab-dnssec-chain/blob/a2bc8b021af1f9129f13aea1147f510fe4a9cf97/README.md#L35)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-downgrade-wire — 3e68efe38c7b582246acc37fc004111a96cfcd35

Source scan: SCANNED.
- **Ground truth (+)**: [src/kex/kex.test.ts:2](https://github.com/systemslibrarian/crypto-lab-downgrade-wire/blob/3e68efe38c7b582246acc37fc004111a96cfcd35/src/kex/kex.test.ts#L2)
- **Independent check (?)**: UNRESOLVED: candidate [src/negotiation/transcript.test.ts:1](https://github.com/systemslibrarian/crypto-lab-downgrade-wire/blob/3e68efe38c7b582246acc37fc004111a96cfcd35/src/negotiation/transcript.test.ts#L1) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/negotiation/failopen.test.ts:5](https://github.com/systemslibrarian/crypto-lab-downgrade-wire/blob/3e68efe38c7b582246acc37fc004111a96cfcd35/src/negotiation/failopen.test.ts#L5)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-downgrade-wire/blob/3e68efe38c7b582246acc37fc004111a96cfcd35/.github/workflows/deploy.yml#L32) `build (needs: —): npm test`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-downgrade-wire/blob/3e68efe38c7b582246acc37fc004111a96cfcd35/.github/workflows/deploy.yml#L33) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-downgrade-wire/blob/3e68efe38c7b582246acc37fc004111a96cfcd35/.github/workflows/deploy.yml#L36) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-downgrade-wire/blob/3e68efe38c7b582246acc37fc004111a96cfcd35/.github/workflows/deploy.yml#L39) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:24](https://github.com/systemslibrarian/crypto-lab-downgrade-wire/blob/3e68efe38c7b582246acc37fc004111a96cfcd35/playwright.config.ts#L24))
- **Limits and guidance (+)**: [README.md:38](https://github.com/systemslibrarian/crypto-lab-downgrade-wire/blob/3e68efe38c7b582246acc37fc004111a96cfcd35/README.md#L38)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-dp-noise — 5f45e293c0ba55f928eee1854933e149d08564d4

Source scan: SCANNED.
- **Ground truth (+)**: [src/dp/params.test.ts:46](https://github.com/systemslibrarian/crypto-lab-dp-noise/blob/5f45e293c0ba55f928eee1854933e149d08564d4/src/dp/params.test.ts#L46)
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/dp/composition.test.ts:44](https://github.com/systemslibrarian/crypto-lab-dp-noise/blob/5f45e293c0ba55f928eee1854933e149d08564d4/src/dp/composition.test.ts#L44)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-dp-noise/blob/5f45e293c0ba55f928eee1854933e149d08564d4/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-dp-noise/blob/5f45e293c0ba55f928eee1854933e149d08564d4/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-dp-noise/blob/5f45e293c0ba55f928eee1854933e149d08564d4/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-dp-noise/blob/5f45e293c0ba55f928eee1854933e149d08564d4/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:20](https://github.com/systemslibrarian/crypto-lab-dp-noise/blob/5f45e293c0ba55f928eee1854933e149d08564d4/playwright.config.ts#L20))
- **Limits and guidance (+)**: [README.md:31](https://github.com/systemslibrarian/crypto-lab-dp-noise/blob/5f45e293c0ba55f928eee1854933e149d08564d4/README.md#L31)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-drbg-arena — 498abbbad73a2286e4e34f1caf8c6a60c9c51a48

Source scan: SCANNED.
- **Ground truth (+)**: [src/crypto/drbg-kat.test.ts:2](https://github.com/systemslibrarian/crypto-lab-drbg-arena/blob/498abbbad73a2286e4e34f1caf8c6a60c9c51a48/src/crypto/drbg-kat.test.ts#L2)
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/exhibits.spec.ts:122](https://github.com/systemslibrarian/crypto-lab-drbg-arena/blob/498abbbad73a2286e4e34f1caf8c6a60c9c51a48/e2e/exhibits.spec.ts#L122)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:42](https://github.com/systemslibrarian/crypto-lab-drbg-arena/blob/498abbbad73a2286e4e34f1caf8c6a60c9c51a48/.github/workflows/deploy.yml#L42) `build (needs: test): npm run build`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-drbg-arena/blob/498abbbad73a2286e4e34f1caf8c6a60c9c51a48/.github/workflows/deploy.yml#L45) `build (needs: test): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:48](https://github.com/systemslibrarian/crypto-lab-drbg-arena/blob/498abbbad73a2286e4e34f1caf8c6a60c9c51a48/.github/workflows/deploy.yml#L48) `build (needs: test): npm run test:a11y`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-drbg-arena/blob/498abbbad73a2286e4e34f1caf8c6a60c9c51a48/.github/workflows/deploy.yml#L30) `test (needs: —): npm test`; engines: chromium ([playwright.config.ts:24](https://github.com/systemslibrarian/crypto-lab-drbg-arena/blob/498abbbad73a2286e4e34f1caf8c6a60c9c51a48/playwright.config.ts#L24))
- **Limits and guidance (+)**: [README.md:27](https://github.com/systemslibrarian/crypto-lab-drbg-arena/blob/498abbbad73a2286e4e34f1caf8c6a60c9c51a48/README.md#L27)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-e91 — 8182aaa5c0f9481a77be4cee98665e7bb8905d5e

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:650](https://github.com/systemslibrarian/crypto-lab-e91/blob/8182aaa5c0f9481a77be4cee98665e7bb8905d5e/e2e/claims.spec.ts#L650)
- **Negative test (+)**: [e2e/claims.spec.ts:347](https://github.com/systemslibrarian/crypto-lab-e91/blob/8182aaa5c0f9481a77be4cee98665e7bb8905d5e/e2e/claims.spec.ts#L347)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:49](https://github.com/systemslibrarian/crypto-lab-e91/blob/8182aaa5c0f9481a77be4cee98665e7bb8905d5e/.github/workflows/deploy.yml#L49) `build (needs: —): npm test`; [.github/workflows/deploy.yml:59](https://github.com/systemslibrarian/crypto-lab-e91/blob/8182aaa5c0f9481a77be4cee98665e7bb8905d5e/.github/workflows/deploy.yml#L59) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:62](https://github.com/systemslibrarian/crypto-lab-e91/blob/8182aaa5c0f9481a77be4cee98665e7bb8905d5e/.github/workflows/deploy.yml#L62) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:67](https://github.com/systemslibrarian/crypto-lab-e91/blob/8182aaa5c0f9481a77be4cee98665e7bb8905d5e/.github/workflows/deploy.yml#L67) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:29](https://github.com/systemslibrarian/crypto-lab-e91/blob/8182aaa5c0f9481a77be4cee98665e7bb8905d5e/playwright.config.ts#L29))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:9](https://github.com/systemslibrarian/crypto-lab-e91/blob/8182aaa5c0f9481a77be4cee98665e7bb8905d5e/README.md#L9) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ec-point-arithmetic — fdcf8ca82a6c4e957b9cf41f95075cd03ada92da

Source scan: SCANNED.
- **Ground truth (+)**: [e2e/claims.spec.ts:434](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic/blob/fdcf8ca82a6c4e957b9cf41f95075cd03ada92da/e2e/claims.spec.ts#L434)
- **Independent check (+)**: [src/math/curve-fp.test.ts:82](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic/blob/fdcf8ca82a6c4e957b9cf41f95075cd03ada92da/src/math/curve-fp.test.ts#L82)
- **Displayed claim (+)**: [e2e/claims.spec.ts:533](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic/blob/fdcf8ca82a6c4e957b9cf41f95075cd03ada92da/e2e/claims.spec.ts#L533)
- **Negative test (+)**: [src/math/curve-real.test.ts:19](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic/blob/fdcf8ca82a6c4e957b9cf41f95075cd03ada92da/src/math/curve-real.test.ts#L19)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:60](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic/blob/fdcf8ca82a6c4e957b9cf41f95075cd03ada92da/.github/workflows/deploy.yml#L60) `build (needs: —): npm test`; [.github/workflows/deploy.yml:61](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic/blob/fdcf8ca82a6c4e957b9cf41f95075cd03ada92da/.github/workflows/deploy.yml#L61) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:64](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic/blob/fdcf8ca82a6c4e957b9cf41f95075cd03ada92da/.github/workflows/deploy.yml#L64) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:70](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic/blob/fdcf8ca82a6c4e957b9cf41f95075cd03ada92da/.github/workflows/deploy.yml#L70) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:17](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic/blob/fdcf8ca82a6c4e957b9cf41f95075cd03ada92da/playwright.config.ts#L17))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:19](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic/blob/fdcf8ca82a6c4e957b9cf41f95075cd03ada92da/README.md#L19) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ecdsa-forge — 02cef5916297c7242eeab502438272b0c8224e7b

Source scan: SCANNED.
- **Ground truth (+)**: [test/rfc6979.test.ts:2](https://github.com/systemslibrarian/crypto-lab-ecdsa-forge/blob/02cef5916297c7242eeab502438272b0c8224e7b/test/rfc6979.test.ts#L2)
- **Independent check (+)**: [e2e/claims.spec.ts:2](https://github.com/systemslibrarian/crypto-lab-ecdsa-forge/blob/02cef5916297c7242eeab502438272b0c8224e7b/e2e/claims.spec.ts#L2)
- **Displayed claim (+)**: [e2e/claims.spec.ts:258](https://github.com/systemslibrarian/crypto-lab-ecdsa-forge/blob/02cef5916297c7242eeab502438272b0c8224e7b/e2e/claims.spec.ts#L258)
- **Negative test (+)**: [test/toycurve.test.ts:63](https://github.com/systemslibrarian/crypto-lab-ecdsa-forge/blob/02cef5916297c7242eeab502438272b0c8224e7b/test/toycurve.test.ts#L63)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-ecdsa-forge/blob/02cef5916297c7242eeab502438272b0c8224e7b/.github/workflows/deploy.yml#L41) `build (needs: —): npm test`; [.github/workflows/deploy.yml:44](https://github.com/systemslibrarian/crypto-lab-ecdsa-forge/blob/02cef5916297c7242eeab502438272b0c8224e7b/.github/workflows/deploy.yml#L44) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:47](https://github.com/systemslibrarian/crypto-lab-ecdsa-forge/blob/02cef5916297c7242eeab502438272b0c8224e7b/.github/workflows/deploy.yml#L47) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:50](https://github.com/systemslibrarian/crypto-lab-ecdsa-forge/blob/02cef5916297c7242eeab502438272b0c8224e7b/.github/workflows/deploy.yml#L50) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:27](https://github.com/systemslibrarian/crypto-lab-ecdsa-forge/blob/02cef5916297c7242eeab502438272b0c8224e7b/playwright.config.ts#L27))
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-ecdsa-forge/blob/02cef5916297c7242eeab502438272b0c8224e7b/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ed25519-forge — 2b0a14bd6ad0ea68c4496e923cf20fa872a74e62

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/ecdsa.test.ts:17](https://github.com/systemslibrarian/crypto-lab-ed25519-forge/blob/2b0a14bd6ad0ea68c4496e923cf20fa872a74e62/src/ecdsa.test.ts#L17) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/forge.test.ts:2](https://github.com/systemslibrarian/crypto-lab-ed25519-forge/blob/2b0a14bd6ad0ea68c4496e923cf20fa872a74e62/src/forge.test.ts#L2) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/forge.test.ts:74](https://github.com/systemslibrarian/crypto-lab-ed25519-forge/blob/2b0a14bd6ad0ea68c4496e923cf20fa872a74e62/src/forge.test.ts#L74)
- **Deploy gate (+)**: [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-ed25519-forge/blob/2b0a14bd6ad0ea68c4496e923cf20fa872a74e62/.github/workflows/pages.yml#L30) `build (needs: —): npm test`; [.github/workflows/pages.yml:31](https://github.com/systemslibrarian/crypto-lab-ed25519-forge/blob/2b0a14bd6ad0ea68c4496e923cf20fa872a74e62/.github/workflows/pages.yml#L31) `build (needs: —): npm run build`; [.github/workflows/pages.yml:33](https://github.com/systemslibrarian/crypto-lab-ed25519-forge/blob/2b0a14bd6ad0ea68c4496e923cf20fa872a74e62/.github/workflows/pages.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:35](https://github.com/systemslibrarian/crypto-lab-ed25519-forge/blob/2b0a14bd6ad0ea68c4496e923cf20fa872a74e62/.github/workflows/pages.yml#L35) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-ed25519-forge/blob/2b0a14bd6ad0ea68c4496e923cf20fa872a74e62/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:11](https://github.com/systemslibrarian/crypto-lab-ed25519-forge/blob/2b0a14bd6ad0ea68c4496e923cf20fa872a74e62/README.md#L11)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-elgamal-plain — b3fa02685c9b602e6d36cc94c00964d2abdbbe1c

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:252](https://github.com/systemslibrarian/crypto-lab-elgamal-plain/blob/b3fa02685c9b602e6d36cc94c00964d2abdbbe1c/e2e/claims.spec.ts#L252) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:350](https://github.com/systemslibrarian/crypto-lab-elgamal-plain/blob/b3fa02685c9b602e6d36cc94c00964d2abdbbe1c/e2e/claims.spec.ts#L350)
- **Negative test (+)**: [src/elgamal.test.ts:39](https://github.com/systemslibrarian/crypto-lab-elgamal-plain/blob/b3fa02685c9b602e6d36cc94c00964d2abdbbe1c/src/elgamal.test.ts#L39)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-elgamal-plain/blob/b3fa02685c9b602e6d36cc94c00964d2abdbbe1c/.github/workflows/deploy.yml#L30) `deploy (needs: —): npm test`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-elgamal-plain/blob/b3fa02685c9b602e6d36cc94c00964d2abdbbe1c/.github/workflows/deploy.yml#L33) `deploy (needs: —): npm run build`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-elgamal-plain/blob/b3fa02685c9b602e6d36cc94c00964d2abdbbe1c/.github/workflows/deploy.yml#L36) `deploy (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-elgamal-plain/blob/b3fa02685c9b602e6d36cc94c00964d2abdbbe1c/.github/workflows/deploy.yml#L39) `deploy (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-elgamal-plain/blob/b3fa02685c9b602e6d36cc94c00964d2abdbbe1c/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-elgamal-plain/blob/b3fa02685c9b602e6d36cc94c00964d2abdbbe1c/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-encrochat — 6ec5b58435455cb017e0abaf2549d7c6f1d168fc

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/crypto/primitives.test.ts:19](https://github.com/systemslibrarian/crypto-lab-encrochat/blob/6ec5b58435455cb017e0abaf2549d7c6f1d168fc/src/crypto/primitives.test.ts#L19) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/crypto/x25519.test.ts:2](https://github.com/systemslibrarian/crypto-lab-encrochat/blob/6ec5b58435455cb017e0abaf2549d7c6f1d168fc/src/crypto/x25519.test.ts#L2) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:383](https://github.com/systemslibrarian/crypto-lab-encrochat/blob/6ec5b58435455cb017e0abaf2549d7c6f1d168fc/e2e/claims.spec.ts#L383)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-encrochat/blob/6ec5b58435455cb017e0abaf2549d7c6f1d168fc/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-encrochat/blob/6ec5b58435455cb017e0abaf2549d7c6f1d168fc/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-encrochat/blob/6ec5b58435455cb017e0abaf2549d7c6f1d168fc/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-encrochat/blob/6ec5b58435455cb017e0abaf2549d7c6f1d168fc/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:23](https://github.com/systemslibrarian/crypto-lab-encrochat/blob/6ec5b58435455cb017e0abaf2549d7c6f1d168fc/playwright.config.ts#L23))
- **Limits and guidance (+)**: [README.md:12](https://github.com/systemslibrarian/crypto-lab-encrochat/blob/6ec5b58435455cb017e0abaf2549d7c6f1d168fc/README.md#L12)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-enigma-forge — 5f29bf8381b4a7fd8625d9bd75f342ed033b0b2f

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:13](https://github.com/systemslibrarian/crypto-lab-enigma-forge/blob/5f29bf8381b4a7fd8625d9bd75f342ed033b0b2f/e2e/claims.spec.ts#L13) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [tests/ui.test.ts:104](https://github.com/systemslibrarian/crypto-lab-enigma-forge/blob/5f29bf8381b4a7fd8625d9bd75f342ed033b0b2f/tests/ui.test.ts#L104)
- **Negative test (+)**: [tests/machine.test.ts:138](https://github.com/systemslibrarian/crypto-lab-enigma-forge/blob/5f29bf8381b4a7fd8625d9bd75f342ed033b0b2f/tests/machine.test.ts#L138)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-enigma-forge/blob/5f29bf8381b4a7fd8625d9bd75f342ed033b0b2f/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-enigma-forge/blob/5f29bf8381b4a7fd8625d9bd75f342ed033b0b2f/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-enigma-forge/blob/5f29bf8381b4a7fd8625d9bd75f342ed033b0b2f/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-enigma-forge/blob/5f29bf8381b4a7fd8625d9bd75f342ed033b0b2f/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:24](https://github.com/systemslibrarian/crypto-lab-enigma-forge/blob/5f29bf8381b4a7fd8625d9bd75f342ed033b0b2f/playwright.config.ts#L24))
- **Limits and guidance (+)**: [README.md:26](https://github.com/systemslibrarian/crypto-lab-enigma-forge/blob/5f29bf8381b4a7fd8625d9bd75f342ed033b0b2f/README.md#L26)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-entropy-collapse — 77b3e629ab59feabc3d6ff6f6194b19c23105fe0

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/crypto/hmac.test.ts:8](https://github.com/systemslibrarian/crypto-lab-entropy-collapse/blob/77b3e629ab59feabc3d6ff6f6194b19c23105fe0/src/crypto/hmac.test.ts#L8) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:10](https://github.com/systemslibrarian/crypto-lab-entropy-collapse/blob/77b3e629ab59feabc3d6ff6f6194b19c23105fe0/e2e/claims.spec.ts#L10) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:261](https://github.com/systemslibrarian/crypto-lab-entropy-collapse/blob/77b3e629ab59feabc3d6ff6f6194b19c23105fe0/e2e/claims.spec.ts#L261)
- **Negative test (+)**: [src/entropy/enumerate.test.ts:41](https://github.com/systemslibrarian/crypto-lab-entropy-collapse/blob/77b3e629ab59feabc3d6ff6f6194b19c23105fe0/src/entropy/enumerate.test.ts#L41)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:29](https://github.com/systemslibrarian/crypto-lab-entropy-collapse/blob/77b3e629ab59feabc3d6ff6f6194b19c23105fe0/.github/workflows/deploy.yml#L29) `build (needs: —): npm test`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-entropy-collapse/blob/77b3e629ab59feabc3d6ff6f6194b19c23105fe0/.github/workflows/deploy.yml#L30) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-entropy-collapse/blob/77b3e629ab59feabc3d6ff6f6194b19c23105fe0/.github/workflows/deploy.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-entropy-collapse/blob/77b3e629ab59feabc3d6ff6f6194b19c23105fe0/.github/workflows/deploy.yml#L34) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:21](https://github.com/systemslibrarian/crypto-lab-entropy-collapse/blob/77b3e629ab59feabc3d6ff6f6194b19c23105fe0/README.md#L21)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-envelope-kms — 81b675c6d18bf2e1ae4df7db234562688d532f76

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:215](https://github.com/systemslibrarian/crypto-lab-envelope-kms/blob/81b675c6d18bf2e1ae4df7db234562688d532f76/e2e/claims.spec.ts#L215) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:295](https://github.com/systemslibrarian/crypto-lab-envelope-kms/blob/81b675c6d18bf2e1ae4df7db234562688d532f76/e2e/claims.spec.ts#L295)
- **Deploy gate (+)**: [.github/workflows/pages.yml:89](https://github.com/systemslibrarian/crypto-lab-envelope-kms/blob/81b675c6d18bf2e1ae4df7db234562688d532f76/.github/workflows/pages.yml#L89) `build (needs: —): npm run test:coverage`; [.github/workflows/pages.yml:106](https://github.com/systemslibrarian/crypto-lab-envelope-kms/blob/81b675c6d18bf2e1ae4df7db234562688d532f76/.github/workflows/pages.yml#L106) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:109](https://github.com/systemslibrarian/crypto-lab-envelope-kms/blob/81b675c6d18bf2e1ae4df7db234562688d532f76/.github/workflows/pages.yml#L109) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-envelope-kms/blob/81b675c6d18bf2e1ae4df7db234562688d532f76/playwright.config.ts#L19))
- **Limits and guidance (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-export-grade — 77601242dfa34d9874e1d363295e0241232d1129

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:18](https://github.com/systemslibrarian/crypto-lab-export-grade/blob/77601242dfa34d9874e1d363295e0241232d1129/e2e/claims.spec.ts#L18) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:19](https://github.com/systemslibrarian/crypto-lab-export-grade/blob/77601242dfa34d9874e1d363295e0241232d1129/e2e/claims.spec.ts#L19)
- **Negative test (+)**: [e2e/claims.spec.ts:70](https://github.com/systemslibrarian/crypto-lab-export-grade/blob/77601242dfa34d9874e1d363295e0241232d1129/e2e/claims.spec.ts#L70)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-export-grade/blob/77601242dfa34d9874e1d363295e0241232d1129/.github/workflows/deploy.yml#L31) `build (needs: —): npm test`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-export-grade/blob/77601242dfa34d9874e1d363295e0241232d1129/.github/workflows/deploy.yml#L33) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-export-grade/blob/77601242dfa34d9874e1d363295e0241232d1129/.github/workflows/deploy.yml#L35) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-export-grade/blob/77601242dfa34d9874e1d363295e0241232d1129/.github/workflows/deploy.yml#L37) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:7](https://github.com/systemslibrarian/crypto-lab-export-grade/blob/77601242dfa34d9874e1d363295e0241232d1129/README.md#L7) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-factor-forge — 2d002143df138883c566aa01b77e0d8b8e8d227a

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:5](https://github.com/systemslibrarian/crypto-lab-factor-forge/blob/2d002143df138883c566aa01b77e0d8b8e8d227a/e2e/claims.spec.ts#L5) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:359](https://github.com/systemslibrarian/crypto-lab-factor-forge/blob/2d002143df138883c566aa01b77e0d8b8e8d227a/e2e/claims.spec.ts#L359)
- **Negative test (+)**: [e2e/claims.spec.ts:204](https://github.com/systemslibrarian/crypto-lab-factor-forge/blob/2d002143df138883c566aa01b77e0d8b8e8d227a/e2e/claims.spec.ts#L204)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:92](https://github.com/systemslibrarian/crypto-lab-factor-forge/blob/2d002143df138883c566aa01b77e0d8b8e8d227a/.github/workflows/deploy.yml#L92) `build (needs: —): npm test`; [.github/workflows/deploy.yml:95](https://github.com/systemslibrarian/crypto-lab-factor-forge/blob/2d002143df138883c566aa01b77e0d8b8e8d227a/.github/workflows/deploy.yml#L95) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:102](https://github.com/systemslibrarian/crypto-lab-factor-forge/blob/2d002143df138883c566aa01b77e0d8b8e8d227a/.github/workflows/deploy.yml#L102) `build (needs: —): npx playwright install --with-deps chromium firefox webkit`; [.github/workflows/deploy.yml:112](https://github.com/systemslibrarian/crypto-lab-factor-forge/blob/2d002143df138883c566aa01b77e0d8b8e8d227a/.github/workflows/deploy.yml#L112) `build (needs: —): npm run test:e2e:all`; engines: firefox ([playwright.config.ts:61](https://github.com/systemslibrarian/crypto-lab-factor-forge/blob/2d002143df138883c566aa01b77e0d8b8e8d227a/playwright.config.ts#L61))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:91](https://github.com/systemslibrarian/crypto-lab-factor-forge/blob/2d002143df138883c566aa01b77e0d8b8e8d227a/README.md#L91) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-falcon-seal — 0610209d496b459ff172c8dfa9402f3e984e090a

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [tests/falcon.test.ts:55](https://github.com/systemslibrarian/crypto-lab-falcon-seal/blob/0610209d496b459ff172c8dfa9402f3e984e090a/tests/falcon.test.ts#L55) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [tests/ui.test.ts:2](https://github.com/systemslibrarian/crypto-lab-falcon-seal/blob/0610209d496b459ff172c8dfa9402f3e984e090a/tests/ui.test.ts#L2) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [tests/trapdoor.test.ts:31](https://github.com/systemslibrarian/crypto-lab-falcon-seal/blob/0610209d496b459ff172c8dfa9402f3e984e090a/tests/trapdoor.test.ts#L31)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:29](https://github.com/systemslibrarian/crypto-lab-falcon-seal/blob/0610209d496b459ff172c8dfa9402f3e984e090a/.github/workflows/deploy.yml#L29) `build (needs: —): npm test`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-falcon-seal/blob/0610209d496b459ff172c8dfa9402f3e984e090a/.github/workflows/deploy.yml#L30) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-falcon-seal/blob/0610209d496b459ff172c8dfa9402f3e984e090a/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-falcon-seal/blob/0610209d496b459ff172c8dfa9402f3e984e090a/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-falcon-seal/blob/0610209d496b459ff172c8dfa9402f3e984e090a/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-feistel-forge — 658dd92925d5ccdad2411fb44d8ed0f9449d3b43

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [scripts/build-vectors.mjs:3](https://github.com/systemslibrarian/crypto-lab-feistel-forge/blob/658dd92925d5ccdad2411fb44d8ed0f9449d3b43/scripts/build-vectors.mjs#L3) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [scripts/build-vectors.mjs:25](https://github.com/systemslibrarian/crypto-lab-feistel-forge/blob/658dd92925d5ccdad2411fb44d8ed0f9449d3b43/scripts/build-vectors.mjs#L25) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:287](https://github.com/systemslibrarian/crypto-lab-feistel-forge/blob/658dd92925d5ccdad2411fb44d8ed0f9449d3b43/e2e/claims.spec.ts#L287)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:48](https://github.com/systemslibrarian/crypto-lab-feistel-forge/blob/658dd92925d5ccdad2411fb44d8ed0f9449d3b43/.github/workflows/deploy.yml#L48) `build (needs: —): npm test`; [.github/workflows/deploy.yml:51](https://github.com/systemslibrarian/crypto-lab-feistel-forge/blob/658dd92925d5ccdad2411fb44d8ed0f9449d3b43/.github/workflows/deploy.yml#L51) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:57](https://github.com/systemslibrarian/crypto-lab-feistel-forge/blob/658dd92925d5ccdad2411fb44d8ed0f9449d3b43/.github/workflows/deploy.yml#L57) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:60](https://github.com/systemslibrarian/crypto-lab-feistel-forge/blob/658dd92925d5ccdad2411fb44d8ed0f9449d3b43/.github/workflows/deploy.yml#L60) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:63](https://github.com/systemslibrarian/crypto-lab-feistel-forge/blob/658dd92925d5ccdad2411fb44d8ed0f9449d3b43/.github/workflows/deploy.yml#L63) `build (needs: —): npm run test:claims`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:44](https://github.com/systemslibrarian/crypto-lab-feistel-forge/blob/658dd92925d5ccdad2411fb44d8ed0f9449d3b43/README.md#L44)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-fhe-arena — 6e03177e3fcacb1322ffec3266ae225e76f25af2

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/toyFhe.test.ts:7](https://github.com/systemslibrarian/crypto-lab-fhe-arena/blob/6e03177e3fcacb1322ffec3266ae225e76f25af2/src/toyFhe.test.ts#L7) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/toyFhe.test.ts:64](https://github.com/systemslibrarian/crypto-lab-fhe-arena/blob/6e03177e3fcacb1322ffec3266ae225e76f25af2/src/toyFhe.test.ts#L64)
- **Deploy gate (+)**: [.github/workflows/deploy-pages.yml:36](https://github.com/systemslibrarian/crypto-lab-fhe-arena/blob/6e03177e3fcacb1322ffec3266ae225e76f25af2/.github/workflows/deploy-pages.yml#L36) `build (needs: —): npm run build`; [.github/workflows/deploy-pages.yml:39](https://github.com/systemslibrarian/crypto-lab-fhe-arena/blob/6e03177e3fcacb1322ffec3266ae225e76f25af2/.github/workflows/deploy-pages.yml#L39) `build (needs: —): npm test`; [.github/workflows/deploy-pages.yml:42](https://github.com/systemslibrarian/crypto-lab-fhe-arena/blob/6e03177e3fcacb1322ffec3266ae225e76f25af2/.github/workflows/deploy-pages.yml#L42) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy-pages.yml:45](https://github.com/systemslibrarian/crypto-lab-fhe-arena/blob/6e03177e3fcacb1322ffec3266ae225e76f25af2/.github/workflows/deploy-pages.yml#L45) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-fhe-arena/blob/6e03177e3fcacb1322ffec3266ae225e76f25af2/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-fhe-arena/blob/6e03177e3fcacb1322ffec3266ae225e76f25af2/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-fold-gate — 9dac554e1c0e7401ddeba8a62a0c7574ccf5b0c8

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:10](https://github.com/systemslibrarian/crypto-lab-fold-gate/blob/9dac554e1c0e7401ddeba8a62a0c7574ccf5b0c8/e2e/claims.spec.ts#L10) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/verdicts.spec.ts:80](https://github.com/systemslibrarian/crypto-lab-fold-gate/blob/9dac554e1c0e7401ddeba8a62a0c7574ccf5b0c8/e2e/verdicts.spec.ts#L80)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:55](https://github.com/systemslibrarian/crypto-lab-fold-gate/blob/9dac554e1c0e7401ddeba8a62a0c7574ccf5b0c8/.github/workflows/deploy.yml#L55) `verdict-coverage (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:57](https://github.com/systemslibrarian/crypto-lab-fold-gate/blob/9dac554e1c0e7401ddeba8a62a0c7574ccf5b0c8/.github/workflows/deploy.yml#L57) `verdict-coverage (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-fold-gate/blob/9dac554e1c0e7401ddeba8a62a0c7574ccf5b0c8/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-fold-gate/blob/9dac554e1c0e7401ddeba8a62a0c7574ccf5b0c8/.github/workflows/deploy.yml#L32) `build (needs: —): npm run test:coverage`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-fold-gate/blob/9dac554e1c0e7401ddeba8a62a0c7574ccf5b0c8/.github/workflows/deploy.yml#L33) `build (needs: —): npm run build`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:11](https://github.com/systemslibrarian/crypto-lab-fold-gate/blob/9dac554e1c0e7401ddeba8a62a0c7574ccf5b0c8/README.md#L11) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-format-ward — ed4d9e769b358e9c2dafbfcc022c7420435f9cc1

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/functional.spec.ts:36](https://github.com/systemslibrarian/crypto-lab-format-ward/blob/ed4d9e769b358e9c2dafbfcc022c7420435f9cc1/e2e/functional.spec.ts#L36) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/fpe.test.ts:1](https://github.com/systemslibrarian/crypto-lab-format-ward/blob/ed4d9e769b358e9c2dafbfcc022c7420435f9cc1/src/fpe.test.ts#L1) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/fpe.test.ts:239](https://github.com/systemslibrarian/crypto-lab-format-ward/blob/ed4d9e769b358e9c2dafbfcc022c7420435f9cc1/src/fpe.test.ts#L239)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-format-ward/blob/ed4d9e769b358e9c2dafbfcc022c7420435f9cc1/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-format-ward/blob/ed4d9e769b358e9c2dafbfcc022c7420435f9cc1/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-format-ward/blob/ed4d9e769b358e9c2dafbfcc022c7420435f9cc1/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-format-ward/blob/ed4d9e769b358e9c2dafbfcc022c7420435f9cc1/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:17](https://github.com/systemslibrarian/crypto-lab-format-ward/blob/ed4d9e769b358e9c2dafbfcc022c7420435f9cc1/playwright.config.ts#L17))
- **Limits and guidance (+)**: [README.md:17](https://github.com/systemslibrarian/crypto-lab-format-ward/blob/ed4d9e769b358e9c2dafbfcc022c7420435f9cc1/README.md#L17)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-frodo-vault — 53190e6dde92027c5b635d5b1830e107aeb76d29

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [tests/math.test.ts:254](https://github.com/systemslibrarian/crypto-lab-frodo-vault/blob/53190e6dde92027c5b635d5b1830e107aeb76d29/tests/math.test.ts#L254) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:1](https://github.com/systemslibrarian/crypto-lab-frodo-vault/blob/53190e6dde92027c5b635d5b1830e107aeb76d29/e2e/claims.spec.ts#L1) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:160](https://github.com/systemslibrarian/crypto-lab-frodo-vault/blob/53190e6dde92027c5b635d5b1830e107aeb76d29/e2e/claims.spec.ts#L160)
- **Negative test (+)**: [tests/frodo-kem.test.ts:42](https://github.com/systemslibrarian/crypto-lab-frodo-vault/blob/53190e6dde92027c5b635d5b1830e107aeb76d29/tests/frodo-kem.test.ts#L42)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-frodo-vault/blob/53190e6dde92027c5b635d5b1830e107aeb76d29/.github/workflows/deploy.yml#L39) `build (needs: —): npm test`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-frodo-vault/blob/53190e6dde92027c5b635d5b1830e107aeb76d29/.github/workflows/deploy.yml#L41) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:44](https://github.com/systemslibrarian/crypto-lab-frodo-vault/blob/53190e6dde92027c5b635d5b1830e107aeb76d29/.github/workflows/deploy.yml#L44) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:47](https://github.com/systemslibrarian/crypto-lab-frodo-vault/blob/53190e6dde92027c5b635d5b1830e107aeb76d29/.github/workflows/deploy.yml#L47) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-frodo-vault/blob/53190e6dde92027c5b635d5b1830e107aeb76d29/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-frodo-vault/blob/53190e6dde92027c5b635d5b1830e107aeb76d29/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-frost-threshold — c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [crate/src/round1.rs:61](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/crate/src/round1.rs#L61) requires provenance/execution review.
- **Independent check (+)**: [crate/src/pipeline_tests.rs:372](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/crate/src/pipeline_tests.rs#L372)
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/functional.spec.ts:21](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/e2e/functional.spec.ts#L21)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:52](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/.github/workflows/deploy.yml#L52) `build (needs: —): cargo test --manifest-path crate/Cargo.toml`; [.github/workflows/deploy.yml:60](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/.github/workflows/deploy.yml#L60) `build (needs: —): npm test`; [.github/workflows/deploy.yml:63](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/.github/workflows/deploy.yml#L63) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:66](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/.github/workflows/deploy.yml#L66) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:69](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/.github/workflows/deploy.yml#L69) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:24](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/playwright.config.ts#L24))
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-frost-threshold/blob/c56b90f0d85a2e97829cb05b23fe2a8ba4144ccf/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-frozen-heart — 17d6857b25115fa682e05a8fb62980ccc72906ba

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/schnorr/group.test.ts:9](https://github.com/systemslibrarian/crypto-lab-frozen-heart/blob/17d6857b25115fa682e05a8fb62980ccc72906ba/src/schnorr/group.test.ts#L9) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/schnorr/group.test.ts:2](https://github.com/systemslibrarian/crypto-lab-frozen-heart/blob/17d6857b25115fa682e05a8fb62980ccc72906ba/src/schnorr/group.test.ts#L2) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:47](https://github.com/systemslibrarian/crypto-lab-frozen-heart/blob/17d6857b25115fa682e05a8fb62980ccc72906ba/e2e/claims.spec.ts#L47)
- **Negative test (+)**: [e2e/claims.spec.ts:154](https://github.com/systemslibrarian/crypto-lab-frozen-heart/blob/17d6857b25115fa682e05a8fb62980ccc72906ba/e2e/claims.spec.ts#L154)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-frozen-heart/blob/17d6857b25115fa682e05a8fb62980ccc72906ba/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-frozen-heart/blob/17d6857b25115fa682e05a8fb62980ccc72906ba/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-frozen-heart/blob/17d6857b25115fa682e05a8fb62980ccc72906ba/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-frozen-heart/blob/17d6857b25115fa682e05a8fb62980ccc72906ba/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:e2e`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:10](https://github.com/systemslibrarian/crypto-lab-frozen-heart/blob/17d6857b25115fa682e05a8fb62980ccc72906ba/README.md#L10)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-fte — 7f5f70af8bb699573a330b9ff87359b1bede29f2

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:730](https://github.com/systemslibrarian/crypto-lab-fte/blob/7f5f70af8bb699573a330b9ff87359b1bede29f2/e2e/claims.spec.ts#L730) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/aead.test.ts:125](https://github.com/systemslibrarian/crypto-lab-fte/blob/7f5f70af8bb699573a330b9ff87359b1bede29f2/src/aead.test.ts#L125)
- **Deploy gate (+)**: [.github/workflows/pages.yml:45](https://github.com/systemslibrarian/crypto-lab-fte/blob/7f5f70af8bb699573a330b9ff87359b1bede29f2/.github/workflows/pages.yml#L45) `build (needs: —): npm test`; [.github/workflows/pages.yml:46](https://github.com/systemslibrarian/crypto-lab-fte/blob/7f5f70af8bb699573a330b9ff87359b1bede29f2/.github/workflows/pages.yml#L46) `build (needs: —): npm run build`; [.github/workflows/pages.yml:63](https://github.com/systemslibrarian/crypto-lab-fte/blob/7f5f70af8bb699573a330b9ff87359b1bede29f2/.github/workflows/pages.yml#L63) `build (needs: —): npx playwright install chromium`; [.github/workflows/pages.yml:68](https://github.com/systemslibrarian/crypto-lab-fte/blob/7f5f70af8bb699573a330b9ff87359b1bede29f2/.github/workflows/pages.yml#L68) `build (needs: —): require('playwright-core').chromium.launch()`; [.github/workflows/pages.yml:82](https://github.com/systemslibrarian/crypto-lab-fte/blob/7f5f70af8bb699573a330b9ff87359b1bede29f2/.github/workflows/pages.yml#L82) `build (needs: —): npm run test:e2e`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:102](https://github.com/systemslibrarian/crypto-lab-fte/blob/7f5f70af8bb699573a330b9ff87359b1bede29f2/README.md#L102)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-garbled-gate — 1b3a5c7e08c14a34e6314e0eb20d3064aba151c6

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:165](https://github.com/systemslibrarian/crypto-lab-garbled-gate/blob/1b3a5c7e08c14a34e6314e0eb20d3064aba151c6/e2e/claims.spec.ts#L165)
- **Negative test (+)**: [src/yao.test.ts:81](https://github.com/systemslibrarian/crypto-lab-garbled-gate/blob/1b3a5c7e08c14a34e6314e0eb20d3064aba151c6/src/yao.test.ts#L81)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:29](https://github.com/systemslibrarian/crypto-lab-garbled-gate/blob/1b3a5c7e08c14a34e6314e0eb20d3064aba151c6/.github/workflows/deploy.yml#L29) `build (needs: —): npm test`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-garbled-gate/blob/1b3a5c7e08c14a34e6314e0eb20d3064aba151c6/.github/workflows/deploy.yml#L30) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-garbled-gate/blob/1b3a5c7e08c14a34e6314e0eb20d3064aba151c6/.github/workflows/deploy.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-garbled-gate/blob/1b3a5c7e08c14a34e6314e0eb20d3064aba151c6/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-garbled-gate/blob/1b3a5c7e08c14a34e6314e0eb20d3064aba151c6/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:16](https://github.com/systemslibrarian/crypto-lab-garbled-gate/blob/1b3a5c7e08c14a34e6314e0eb20d3064aba151c6/README.md#L16)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-gg20-wallet — e532c377139651b64f2e56a19d4972a253581108

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [test/gg20.test.ts:203](https://github.com/systemslibrarian/crypto-lab-gg20-wallet/blob/e532c377139651b64f2e56a19d4972a253581108/test/gg20.test.ts#L203)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-gg20-wallet/blob/e532c377139651b64f2e56a19d4972a253581108/.github/workflows/deploy.yml#L30) `build (needs: —): npm test --if-present`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-gg20-wallet/blob/e532c377139651b64f2e56a19d4972a253581108/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-gg20-wallet/blob/e532c377139651b64f2e56a19d4972a253581108/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-gg20-wallet/blob/e532c377139651b64f2e56a19d4972a253581108/.github/workflows/deploy.yml#L38) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:25](https://github.com/systemslibrarian/crypto-lab-gg20-wallet/blob/e532c377139651b64f2e56a19d4972a253581108/playwright.config.ts#L25))
- **Limits and guidance (+)**: [README.md:20](https://github.com/systemslibrarian/crypto-lab-gg20-wallet/blob/e532c377139651b64f2e56a19d4972a253581108/README.md#L20)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ggh-trapdoor — 0132de9231ba293a6c593cf623200c3f38225dc4

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:231](https://github.com/systemslibrarian/crypto-lab-ggh-trapdoor/blob/0132de9231ba293a6c593cf623200c3f38225dc4/e2e/claims.spec.ts#L231) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:552](https://github.com/systemslibrarian/crypto-lab-ggh-trapdoor/blob/0132de9231ba293a6c593cf623200c3f38225dc4/e2e/claims.spec.ts#L552)
- **Negative test (+)**: [e2e/claims.spec.ts:556](https://github.com/systemslibrarian/crypto-lab-ggh-trapdoor/blob/0132de9231ba293a6c593cf623200c3f38225dc4/e2e/claims.spec.ts#L556)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:107](https://github.com/systemslibrarian/crypto-lab-ggh-trapdoor/blob/0132de9231ba293a6c593cf623200c3f38225dc4/.github/workflows/deploy.yml#L107) `build (needs: —): const need = ["npm run build", "npm test", "npm run test:claims",`; [.github/workflows/deploy.yml:107](https://github.com/systemslibrarian/crypto-lab-ggh-trapdoor/blob/0132de9231ba293a6c593cf623200c3f38225dc4/.github/workflows/deploy.yml#L107) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:107](https://github.com/systemslibrarian/crypto-lab-ggh-trapdoor/blob/0132de9231ba293a6c593cf623200c3f38225dc4/.github/workflows/deploy.yml#L107) `build (needs: —): npm test`; [.github/workflows/deploy.yml:142](https://github.com/systemslibrarian/crypto-lab-ggh-trapdoor/blob/0132de9231ba293a6c593cf623200c3f38225dc4/.github/workflows/deploy.yml#L142) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:107](https://github.com/systemslibrarian/crypto-lab-ggh-trapdoor/blob/0132de9231ba293a6c593cf623200c3f38225dc4/.github/workflows/deploy.yml#L107) `build (needs: —): npm run test:claims`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:57](https://github.com/systemslibrarian/crypto-lab-ggh-trapdoor/blob/0132de9231ba293a6c593cf623200c3f38225dc4/README.md#L57)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ghost-commit — 88abb12c24089a2606306816f54a575e58c723b0

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/git/objects.test.ts:3](https://github.com/systemslibrarian/crypto-lab-ghost-commit/blob/88abb12c24089a2606306816f54a575e58c723b0/src/git/objects.test.ts#L3) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/git/objects.test.ts:56](https://github.com/systemslibrarian/crypto-lab-ghost-commit/blob/88abb12c24089a2606306816f54a575e58c723b0/src/git/objects.test.ts#L56) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/git/objects.test.ts:84](https://github.com/systemslibrarian/crypto-lab-ghost-commit/blob/88abb12c24089a2606306816f54a575e58c723b0/src/git/objects.test.ts#L84)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-ghost-commit/blob/88abb12c24089a2606306816f54a575e58c723b0/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-ghost-commit/blob/88abb12c24089a2606306816f54a575e58c723b0/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-ghost-commit/blob/88abb12c24089a2606306816f54a575e58c723b0/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-ghost-commit/blob/88abb12c24089a2606306816f54a575e58c723b0/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:19](https://github.com/systemslibrarian/crypto-lab-ghost-commit/blob/88abb12c24089a2606306816f54a575e58c723b0/README.md#L19)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-grover — 1997d5e36dbb38f30c914716d03edfb89972bc5b

Source scan: SCANNED.
- **Ground truth (0)**: Self-generated fixture at [src/grover.test.ts:88](https://github.com/systemslibrarian/crypto-lab-grover/blob/1997d5e36dbb38f30c914716d03edfb89972bc5b/src/grover.test.ts#L88); no published fixture established.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:487](https://github.com/systemslibrarian/crypto-lab-grover/blob/1997d5e36dbb38f30c914716d03edfb89972bc5b/e2e/claims.spec.ts#L487)
- **Negative test (+)**: [src/grover.test.ts:42](https://github.com/systemslibrarian/crypto-lab-grover/blob/1997d5e36dbb38f30c914716d03edfb89972bc5b/src/grover.test.ts#L42)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-grover/blob/1997d5e36dbb38f30c914716d03edfb89972bc5b/.github/workflows/deploy.yml#L36) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-grover/blob/1997d5e36dbb38f30c914716d03edfb89972bc5b/.github/workflows/deploy.yml#L39) `build (needs: —): npm test`; [.github/workflows/deploy.yml:42](https://github.com/systemslibrarian/crypto-lab-grover/blob/1997d5e36dbb38f30c914716d03edfb89972bc5b/.github/workflows/deploy.yml#L42) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-grover/blob/1997d5e36dbb38f30c914716d03edfb89972bc5b/.github/workflows/deploy.yml#L45) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:14](https://github.com/systemslibrarian/crypto-lab-grover/blob/1997d5e36dbb38f30c914716d03edfb89972bc5b/README.md#L14)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-harvest-timeline — afa8ae3d1c07ac72410d08491f8145c888c33fa1

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [tests/risk-engine.test.ts:241](https://github.com/systemslibrarian/crypto-lab-harvest-timeline/blob/afa8ae3d1c07ac72410d08491f8145c888c33fa1/tests/risk-engine.test.ts#L241) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [tests/rekey.test.ts:83](https://github.com/systemslibrarian/crypto-lab-harvest-timeline/blob/afa8ae3d1c07ac72410d08491f8145c888c33fa1/tests/rekey.test.ts#L83)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:70](https://github.com/systemslibrarian/crypto-lab-harvest-timeline/blob/afa8ae3d1c07ac72410d08491f8145c888c33fa1/.github/workflows/deploy.yml#L70) `build (needs: —): npm test`; [.github/workflows/deploy.yml:73](https://github.com/systemslibrarian/crypto-lab-harvest-timeline/blob/afa8ae3d1c07ac72410d08491f8145c888c33fa1/.github/workflows/deploy.yml#L73) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:76](https://github.com/systemslibrarian/crypto-lab-harvest-timeline/blob/afa8ae3d1c07ac72410d08491f8145c888c33fa1/.github/workflows/deploy.yml#L76) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:6](https://github.com/systemslibrarian/crypto-lab-harvest-timeline/blob/afa8ae3d1c07ac72410d08491f8145c888c33fa1/.github/workflows/deploy.yml#L6) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-harvest-timeline/blob/afa8ae3d1c07ac72410d08491f8145c888c33fa1/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:39](https://github.com/systemslibrarian/crypto-lab-harvest-timeline/blob/afa8ae3d1c07ac72410d08491f8145c888c33fa1/README.md#L39)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-harvest-vault — 4ee75febfe512a965fc9e4f3e672ffb2924fa494

Source scan: SCANNED.
- **Ground truth (0)**: No qualifying check established in the inspected source; [README.md:1](https://github.com/systemslibrarian/crypto-lab-harvest-vault/blob/4ee75febfe512a965fc9e4f3e672ffb2924fa494/README.md#L1).
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/transcript.test.ts:41](https://github.com/systemslibrarian/crypto-lab-harvest-vault/blob/4ee75febfe512a965fc9e4f3e672ffb2924fa494/src/transcript.test.ts#L41)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-harvest-vault/blob/4ee75febfe512a965fc9e4f3e672ffb2924fa494/.github/workflows/deploy.yml#L37) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-harvest-vault/blob/4ee75febfe512a965fc9e4f3e672ffb2924fa494/.github/workflows/deploy.yml#L40) `build (needs: —): npm test`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-harvest-vault/blob/4ee75febfe512a965fc9e4f3e672ffb2924fa494/.github/workflows/deploy.yml#L43) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-harvest-vault/blob/4ee75febfe512a965fc9e4f3e672ffb2924fa494/.github/workflows/deploy.yml#L46) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:25](https://github.com/systemslibrarian/crypto-lab-harvest-vault/blob/4ee75febfe512a965fc9e4f3e672ffb2924fa494/playwright.config.ts#L25))
- **Limits and guidance (+)**: [README.md:46](https://github.com/systemslibrarian/crypto-lab-harvest-vault/blob/4ee75febfe512a965fc9e4f3e672ffb2924fa494/README.md#L46)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-hash-zoo — ea45b742a13f8dc2f5bb131a99ccd5875165dd9c

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:107](https://github.com/systemslibrarian/crypto-lab-hash-zoo/blob/ea45b742a13f8dc2f5bb131a99ccd5875165dd9c/e2e/claims.spec.ts#L107) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/hasher.test.ts:2](https://github.com/systemslibrarian/crypto-lab-hash-zoo/blob/ea45b742a13f8dc2f5bb131a99ccd5875165dd9c/src/hasher.test.ts#L2) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:347](https://github.com/systemslibrarian/crypto-lab-hash-zoo/blob/ea45b742a13f8dc2f5bb131a99ccd5875165dd9c/e2e/claims.spec.ts#L347)
- **Negative test (+)**: [src/hasher.test.ts:115](https://github.com/systemslibrarian/crypto-lab-hash-zoo/blob/ea45b742a13f8dc2f5bb131a99ccd5875165dd9c/src/hasher.test.ts#L115)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-hash-zoo/blob/ea45b742a13f8dc2f5bb131a99ccd5875165dd9c/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-hash-zoo/blob/ea45b742a13f8dc2f5bb131a99ccd5875165dd9c/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-hash-zoo/blob/ea45b742a13f8dc2f5bb131a99ccd5875165dd9c/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-hash-zoo/blob/ea45b742a13f8dc2f5bb131a99ccd5875165dd9c/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-hash-zoo/blob/ea45b742a13f8dc2f5bb131a99ccd5875165dd9c/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:24](https://github.com/systemslibrarian/crypto-lab-hash-zoo/blob/ea45b742a13f8dc2f5bb131a99ccd5875165dd9c/README.md#L24)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-hawk — 10910e698cadfd406c279cf71c7372edbe8d87b8

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [scripts/verify-phase3.ts:63](https://github.com/systemslibrarian/crypto-lab-hawk/blob/10910e698cadfd406c279cf71c7372edbe8d87b8/scripts/verify-phase3.ts#L63) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Deploy gate (+)**: [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-hawk/blob/10910e698cadfd406c279cf71c7372edbe8d87b8/.github/workflows/deploy.yml#L34) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-hawk/blob/10910e698cadfd406c279cf71c7372edbe8d87b8/.github/workflows/deploy.yml#L37) `build (needs: —): npm test`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-hawk/blob/10910e698cadfd406c279cf71c7372edbe8d87b8/.github/workflows/deploy.yml#L40) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-hawk/blob/10910e698cadfd406c279cf71c7372edbe8d87b8/.github/workflows/deploy.yml#L43) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-hawk/blob/10910e698cadfd406c279cf71c7372edbe8d87b8/playwright.config.ts#L19))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:5](https://github.com/systemslibrarian/crypto-lab-hawk/blob/10910e698cadfd406c279cf71c7372edbe8d87b8/README.md#L5) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-hidden-bit — 00705ccbf695f887065fe0d770b2eacc0487bb38

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/verdicts.spec.ts:200](https://github.com/systemslibrarian/crypto-lab-hidden-bit/blob/00705ccbf695f887065fe0d770b2eacc0487bb38/e2e/verdicts.spec.ts#L200) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:1](https://github.com/systemslibrarian/crypto-lab-hidden-bit/blob/00705ccbf695f887065fe0d770b2eacc0487bb38/e2e/claims.spec.ts#L1) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:126](https://github.com/systemslibrarian/crypto-lab-hidden-bit/blob/00705ccbf695f887065fe0d770b2eacc0487bb38/e2e/claims.spec.ts#L126)
- **Negative test (+)**: [e2e/verdicts.spec.ts:96](https://github.com/systemslibrarian/crypto-lab-hidden-bit/blob/00705ccbf695f887065fe0d770b2eacc0487bb38/e2e/verdicts.spec.ts#L96)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-hidden-bit/blob/00705ccbf695f887065fe0d770b2eacc0487bb38/.github/workflows/deploy.yml#L38) `verdict-coverage (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:74](https://github.com/systemslibrarian/crypto-lab-hidden-bit/blob/00705ccbf695f887065fe0d770b2eacc0487bb38/.github/workflows/deploy.yml#L74) `verdict-coverage (needs: —): npm run test:verdicts`; [.github/workflows/deploy.yml:79](https://github.com/systemslibrarian/crypto-lab-hidden-bit/blob/00705ccbf695f887065fe0d770b2eacc0487bb38/.github/workflows/deploy.yml#L79) `verdict-coverage (needs: —): npm run test:mutations`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-hidden-bit/blob/00705ccbf695f887065fe0d770b2eacc0487bb38/.github/workflows/deploy.yml#L34) `build (needs: —): npm test`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-hidden-bit/blob/00705ccbf695f887065fe0d770b2eacc0487bb38/.github/workflows/deploy.yml#L36) `build (needs: —): npm run build`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-hidden-bit/blob/00705ccbf695f887065fe0d770b2eacc0487bb38/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-hpke-envelope — aa3f70da12a81c2ce785be5bf9590cef7b7f80a7

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/hpke/kat.test.ts:2](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/blob/aa3f70da12a81c2ce785be5bf9590cef7b7f80a7/src/hpke/kat.test.ts#L2) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:397](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/blob/aa3f70da12a81c2ce785be5bf9590cef7b7f80a7/e2e/claims.spec.ts#L397)
- **Negative test (+)**: [e2e/claims.spec.ts:506](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/blob/aa3f70da12a81c2ce785be5bf9590cef7b7f80a7/e2e/claims.spec.ts#L506)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/blob/aa3f70da12a81c2ce785be5bf9590cef7b7f80a7/.github/workflows/deploy.yml#L32) `build (needs: —): npm test`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/blob/aa3f70da12a81c2ce785be5bf9590cef7b7f80a7/.github/workflows/deploy.yml#L33) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/blob/aa3f70da12a81c2ce785be5bf9590cef7b7f80a7/.github/workflows/deploy.yml#L36) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/blob/aa3f70da12a81c2ce785be5bf9590cef7b7f80a7/.github/workflows/deploy.yml#L41) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/blob/aa3f70da12a81c2ce785be5bf9590cef7b7f80a7/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-hpke-envelope/blob/aa3f70da12a81c2ce785be5bf9590cef7b7f80a7/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-hqc-timing — a6c492ef3b021060e6b2d8413a10719acbeb0112

Source scan: SCANNED.
- **Ground truth (0)**: Self-generated fixture at [src/engine.test.ts:24](https://github.com/systemslibrarian/crypto-lab-hqc-timing/blob/a6c492ef3b021060e6b2d8413a10719acbeb0112/src/engine.test.ts#L24); no published fixture established.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/engine.test.ts:383](https://github.com/systemslibrarian/crypto-lab-hqc-timing/blob/a6c492ef3b021060e6b2d8413a10719acbeb0112/src/engine.test.ts#L383)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-hqc-timing/blob/a6c492ef3b021060e6b2d8413a10719acbeb0112/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-hqc-timing/blob/a6c492ef3b021060e6b2d8413a10719acbeb0112/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-hqc-timing/blob/a6c492ef3b021060e6b2d8413a10719acbeb0112/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-hqc-timing/blob/a6c492ef3b021060e6b2d8413a10719acbeb0112/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-hqc-timing/blob/a6c492ef3b021060e6b2d8413a10719acbeb0112/playwright.config.ts#L19))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:5](https://github.com/systemslibrarian/crypto-lab-hqc-timing/blob/a6c492ef3b021060e6b2d8413a10719acbeb0112/README.md#L5) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-hqc-timing-break — 50c0b64a3597cfc9caf97eca16b69420e4f09f35

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:435](https://github.com/systemslibrarian/crypto-lab-hqc-timing-break/blob/50c0b64a3597cfc9caf97eca16b69420e4f09f35/e2e/claims.spec.ts#L435) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:603](https://github.com/systemslibrarian/crypto-lab-hqc-timing-break/blob/50c0b64a3597cfc9caf97eca16b69420e4f09f35/e2e/claims.spec.ts#L603)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-hqc-timing-break/blob/50c0b64a3597cfc9caf97eca16b69420e4f09f35/.github/workflows/deploy.yml#L34) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-hqc-timing-break/blob/50c0b64a3597cfc9caf97eca16b69420e4f09f35/.github/workflows/deploy.yml#L36) `build (needs: —): npm test`; [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-hqc-timing-break/blob/50c0b64a3597cfc9caf97eca16b69420e4f09f35/.github/workflows/deploy.yml#L38) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-hqc-timing-break/blob/50c0b64a3597cfc9caf97eca16b69420e4f09f35/.github/workflows/deploy.yml#L40) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:5](https://github.com/systemslibrarian/crypto-lab-hqc-timing-break/blob/50c0b64a3597cfc9caf97eca16b69420e4f09f35/README.md#L5) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-hqc-vault — 8c73fdf58b8359965d93e913ffc1b55be394c5e6

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:40](https://github.com/systemslibrarian/crypto-lab-hqc-vault/blob/8c73fdf58b8359965d93e913ffc1b55be394c5e6/e2e/claims.spec.ts#L40)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-hqc-vault/blob/8c73fdf58b8359965d93e913ffc1b55be394c5e6/.github/workflows/pages.yml#L29) `build (needs: —): npm run build`; [.github/workflows/pages.yml:31](https://github.com/systemslibrarian/crypto-lab-hqc-vault/blob/8c73fdf58b8359965d93e913ffc1b55be394c5e6/.github/workflows/pages.yml#L31) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:41](https://github.com/systemslibrarian/crypto-lab-hqc-vault/blob/8c73fdf58b8359965d93e913ffc1b55be394c5e6/.github/workflows/pages.yml#L41) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-hqc-vault/blob/8c73fdf58b8359965d93e913ffc1b55be394c5e6/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-hqc-vault/blob/8c73fdf58b8359965d93e913ffc1b55be394c5e6/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-hybrid-guide — 0840345bd9fcd1bcda21de80a7c5a290658ac0cb

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/engine.test.ts:19](https://github.com/systemslibrarian/crypto-lab-hybrid-guide/blob/0840345bd9fcd1bcda21de80a7c5a290658ac0cb/src/engine.test.ts#L19) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/engine.test.ts:168](https://github.com/systemslibrarian/crypto-lab-hybrid-guide/blob/0840345bd9fcd1bcda21de80a7c5a290658ac0cb/src/engine.test.ts#L168)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-hybrid-guide/blob/0840345bd9fcd1bcda21de80a7c5a290658ac0cb/.github/workflows/deploy.yml#L40) `build (needs: —): npm test`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-hybrid-guide/blob/0840345bd9fcd1bcda21de80a7c5a290658ac0cb/.github/workflows/deploy.yml#L41) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-hybrid-guide/blob/0840345bd9fcd1bcda21de80a7c5a290658ac0cb/.github/workflows/deploy.yml#L43) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-hybrid-guide/blob/0840345bd9fcd1bcda21de80a7c5a290658ac0cb/.github/workflows/deploy.yml#L45) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:33](https://github.com/systemslibrarian/crypto-lab-hybrid-guide/blob/0840345bd9fcd1bcda21de80a7c5a290658ac0cb/playwright.config.ts#L33))
- **Limits and guidance (+)**: [README.md:15](https://github.com/systemslibrarian/crypto-lab-hybrid-guide/blob/0840345bd9fcd1bcda21de80a7c5a290658ac0cb/README.md#L15)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-hybrid-pqc — 821f811407b8e2331b19adde9737010bf30834ee

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/crypto/kem.test.ts:30](https://github.com/systemslibrarian/crypto-lab-hybrid-pqc/blob/821f811407b8e2331b19adde9737010bf30834ee/src/crypto/kem.test.ts#L30) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/crypto/sign.test.ts:3](https://github.com/systemslibrarian/crypto-lab-hybrid-pqc/blob/821f811407b8e2331b19adde9737010bf30834ee/src/crypto/sign.test.ts#L3) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/verdict.spec.ts:36](https://github.com/systemslibrarian/crypto-lab-hybrid-pqc/blob/821f811407b8e2331b19adde9737010bf30834ee/e2e/verdict.spec.ts#L36)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-hybrid-pqc/blob/821f811407b8e2331b19adde9737010bf30834ee/.github/workflows/deploy.yml#L40) `build (needs: —): npm test`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-hybrid-pqc/blob/821f811407b8e2331b19adde9737010bf30834ee/.github/workflows/deploy.yml#L41) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-hybrid-pqc/blob/821f811407b8e2331b19adde9737010bf30834ee/.github/workflows/deploy.yml#L43) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-hybrid-pqc/blob/821f811407b8e2331b19adde9737010bf30834ee/.github/workflows/deploy.yml#L45) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:31](https://github.com/systemslibrarian/crypto-lab-hybrid-pqc/blob/821f811407b8e2331b19adde9737010bf30834ee/playwright.config.ts#L31))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:13](https://github.com/systemslibrarian/crypto-lab-hybrid-pqc/blob/821f811407b8e2331b19adde9737010bf30834ee/README.md#L13) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-hybrid-sign — 115b0d21b723c8937e4a2cf282c7d14c5650b0c5

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/composite.test.ts:40](https://github.com/systemslibrarian/crypto-lab-hybrid-sign/blob/115b0d21b723c8937e4a2cf282c7d14c5650b0c5/src/composite.test.ts#L40) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/composite.test.ts:2](https://github.com/systemslibrarian/crypto-lab-hybrid-sign/blob/115b0d21b723c8937e4a2cf282c7d14c5650b0c5/src/composite.test.ts#L2) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/composite.test.ts:73](https://github.com/systemslibrarian/crypto-lab-hybrid-sign/blob/115b0d21b723c8937e4a2cf282c7d14c5650b0c5/src/composite.test.ts#L73)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:42](https://github.com/systemslibrarian/crypto-lab-hybrid-sign/blob/115b0d21b723c8937e4a2cf282c7d14c5650b0c5/.github/workflows/deploy.yml#L42) `build (needs: —): npm test`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-hybrid-sign/blob/115b0d21b723c8937e4a2cf282c7d14c5650b0c5/.github/workflows/deploy.yml#L45) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:48](https://github.com/systemslibrarian/crypto-lab-hybrid-sign/blob/115b0d21b723c8937e4a2cf282c7d14c5650b0c5/.github/workflows/deploy.yml#L48) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:51](https://github.com/systemslibrarian/crypto-lab-hybrid-sign/blob/115b0d21b723c8937e4a2cf282c7d14c5650b0c5/.github/workflows/deploy.yml#L51) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:30](https://github.com/systemslibrarian/crypto-lab-hybrid-sign/blob/115b0d21b723c8937e4a2cf282c7d14c5650b0c5/playwright.config.ts#L30))
- **Limits and guidance (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-hybrid-wire — 5b7ae68ae3bcc19817870b59954442e49f88aab3

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [demos/hybrid-wire/src/__tests__/security.test.ts:153](https://github.com/systemslibrarian/crypto-lab-hybrid-wire/blob/5b7ae68ae3bcc19817870b59954442e49f88aab3/demos/hybrid-wire/src/__tests__/security.test.ts#L153) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [demos/hybrid-wire/src/__tests__/security.test.ts:168](https://github.com/systemslibrarian/crypto-lab-hybrid-wire/blob/5b7ae68ae3bcc19817870b59954442e49f88aab3/demos/hybrid-wire/src/__tests__/security.test.ts#L168) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [demos/hybrid-wire/e2e/resilience.spec.ts:33](https://github.com/systemslibrarian/crypto-lab-hybrid-wire/blob/5b7ae68ae3bcc19817870b59954442e49f88aab3/demos/hybrid-wire/e2e/resilience.spec.ts#L33)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-hybrid-wire/blob/5b7ae68ae3bcc19817870b59954442e49f88aab3/.github/workflows/deploy.yml#L36) `build (needs: —): npm test`; [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-hybrid-wire/blob/5b7ae68ae3bcc19817870b59954442e49f88aab3/.github/workflows/deploy.yml#L38) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-hybrid-wire/blob/5b7ae68ae3bcc19817870b59954442e49f88aab3/.github/workflows/deploy.yml#L41) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:47](https://github.com/systemslibrarian/crypto-lab-hybrid-wire/blob/5b7ae68ae3bcc19817870b59954442e49f88aab3/.github/workflows/deploy.yml#L47) `build (needs: —): npm run test:a11y`; engines: chromium ([demos/hybrid-wire/playwright.config.ts:20](https://github.com/systemslibrarian/crypto-lab-hybrid-wire/blob/5b7ae68ae3bcc19817870b59954442e49f88aab3/demos/hybrid-wire/playwright.config.ts#L20))
- **Limits and guidance (+)**: [README.md:15](https://github.com/systemslibrarian/crypto-lab-hybrid-wire/blob/5b7ae68ae3bcc19817870b59954442e49f88aab3/README.md#L15)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ibe-gate — aa8f03003319808edac8b8e8f50155926d5aa8a5

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [test/ibe.test.ts:75](https://github.com/systemslibrarian/crypto-lab-ibe-gate/blob/aa8f03003319808edac8b8e8f50155926d5aa8a5/test/ibe.test.ts#L75) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [test/ibe.test.ts:2](https://github.com/systemslibrarian/crypto-lab-ibe-gate/blob/aa8f03003319808edac8b8e8f50155926d5aa8a5/test/ibe.test.ts#L2) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [test/ibe.test.ts:181](https://github.com/systemslibrarian/crypto-lab-ibe-gate/blob/aa8f03003319808edac8b8e8f50155926d5aa8a5/test/ibe.test.ts#L181)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-ibe-gate/blob/aa8f03003319808edac8b8e8f50155926d5aa8a5/.github/workflows/deploy.yml#L31) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-ibe-gate/blob/aa8f03003319808edac8b8e8f50155926d5aa8a5/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-ibe-gate/blob/aa8f03003319808edac8b8e8f50155926d5aa8a5/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-ibe-gate/blob/aa8f03003319808edac8b8e8f50155926d5aa8a5/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:37](https://github.com/systemslibrarian/crypto-lab-ibe-gate/blob/aa8f03003319808edac8b8e8f50155926d5aa8a5/playwright.config.ts#L37))
- **Limits and guidance (+)**: [README.md:38](https://github.com/systemslibrarian/crypto-lab-ibe-gate/blob/aa8f03003319808edac8b8e8f50155926d5aa8a5/README.md#L38)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-icy-dvrf — 9506224c141fb75e84a4b1a686e632939eaf7316

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/dvrf/rfc9496.test.ts:2](https://github.com/systemslibrarian/crypto-lab-icy-dvrf/blob/9506224c141fb75e84a4b1a686e632939eaf7316/src/dvrf/rfc9496.test.ts#L2) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/dvrf/rfc9496.test.ts:9](https://github.com/systemslibrarian/crypto-lab-icy-dvrf/blob/9506224c141fb75e84a4b1a686e632939eaf7316/src/dvrf/rfc9496.test.ts#L9) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/ui.spec.ts:73](https://github.com/systemslibrarian/crypto-lab-icy-dvrf/blob/9506224c141fb75e84a4b1a686e632939eaf7316/e2e/ui.spec.ts#L73)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-icy-dvrf/blob/9506224c141fb75e84a4b1a686e632939eaf7316/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-icy-dvrf/blob/9506224c141fb75e84a4b1a686e632939eaf7316/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-icy-dvrf/blob/9506224c141fb75e84a4b1a686e632939eaf7316/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-icy-dvrf/blob/9506224c141fb75e84a4b1a686e632939eaf7316/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-icy-dvrf/blob/9506224c141fb75e84a4b1a686e632939eaf7316/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-iron-letter — 3fb357d84f145b7944d02744a08dd8be381618a2

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/__tests__/known-answer-vectors.test.ts:19](https://github.com/systemslibrarian/crypto-lab-iron-letter/blob/3fb357d84f145b7944d02744a08dd8be381618a2/src/__tests__/known-answer-vectors.test.ts#L19) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/__tests__/ecies.test.ts:76](https://github.com/systemslibrarian/crypto-lab-iron-letter/blob/3fb357d84f145b7944d02744a08dd8be381618a2/src/__tests__/ecies.test.ts#L76)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-iron-letter/blob/3fb357d84f145b7944d02744a08dd8be381618a2/.github/workflows/deploy.yml#L35) `build-and-deploy (needs: —): npm test`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-iron-letter/blob/3fb357d84f145b7944d02744a08dd8be381618a2/.github/workflows/deploy.yml#L37) `build-and-deploy (needs: —): npx playwright install --with-deps chromium firefox webkit`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-iron-letter/blob/3fb357d84f145b7944d02744a08dd8be381618a2/.github/workflows/deploy.yml#L39) `build-and-deploy (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:35](https://github.com/systemslibrarian/crypto-lab-iron-letter/blob/3fb357d84f145b7944d02744a08dd8be381618a2/playwright.config.ts#L35))
- **Limits and guidance (+)**: [README.md:14](https://github.com/systemslibrarian/crypto-lab-iron-letter/blob/3fb357d84f145b7944d02744a08dd8be381618a2/README.md#L14)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-iron-serpent — dabdded459f72d1bd8d58e7bf45f49b8cb9bdd2d

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [demos/iron-serpent/src/__tests__/serpent-rounds.test.ts:4](https://github.com/systemslibrarian/crypto-lab-iron-serpent/blob/dabdded459f72d1bd8d58e7bf45f49b8cb9bdd2d/demos/iron-serpent/src/__tests__/serpent-rounds.test.ts#L4) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [demos/iron-serpent/src/__tests__/serpent.test.ts:62](https://github.com/systemslibrarian/crypto-lab-iron-serpent/blob/dabdded459f72d1bd8d58e7bf45f49b8cb9bdd2d/demos/iron-serpent/src/__tests__/serpent.test.ts#L62) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [demos/iron-serpent/e2e/demo.spec.ts:58](https://github.com/systemslibrarian/crypto-lab-iron-serpent/blob/dabdded459f72d1bd8d58e7bf45f49b8cb9bdd2d/demos/iron-serpent/e2e/demo.spec.ts#L58)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-iron-serpent/blob/dabdded459f72d1bd8d58e7bf45f49b8cb9bdd2d/.github/workflows/deploy.yml#L35) `build (needs: —): npm test`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-iron-serpent/blob/dabdded459f72d1bd8d58e7bf45f49b8cb9bdd2d/.github/workflows/deploy.yml#L36) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-iron-serpent/blob/dabdded459f72d1bd8d58e7bf45f49b8cb9bdd2d/.github/workflows/deploy.yml#L41) `build (needs: —): npx playwright install --with-deps chromium webkit`; [.github/workflows/deploy.yml:42](https://github.com/systemslibrarian/crypto-lab-iron-serpent/blob/dabdded459f72d1bd8d58e7bf45f49b8cb9bdd2d/.github/workflows/deploy.yml#L42) `build (needs: —): npm run test:e2e`; engines: chromium ([demos/iron-serpent/playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-iron-serpent/blob/dabdded459f72d1bd8d58e7bf45f49b8cb9bdd2d/demos/iron-serpent/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:12](https://github.com/systemslibrarian/crypto-lab-iron-serpent/blob/dabdded459f72d1bd8d58e7bf45f49b8cb9bdd2d/README.md#L12)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-isogeny-atlas — 17e29746e9ca92518912e7e7962968d74fea8996

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/math/curve.test.ts:52](https://github.com/systemslibrarian/crypto-lab-isogeny-atlas/blob/17e29746e9ca92518912e7e7962968d74fea8996/src/math/curve.test.ts#L52) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/math/curve.test.ts:68](https://github.com/systemslibrarian/crypto-lab-isogeny-atlas/blob/17e29746e9ca92518912e7e7962968d74fea8996/src/math/curve.test.ts#L68)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-isogeny-atlas/blob/17e29746e9ca92518912e7e7962968d74fea8996/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-isogeny-atlas/blob/17e29746e9ca92518912e7e7962968d74fea8996/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-isogeny-atlas/blob/17e29746e9ca92518912e7e7962968d74fea8996/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-isogeny-atlas/blob/17e29746e9ca92518912e7e7962968d74fea8996/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:19](https://github.com/systemslibrarian/crypto-lab-isogeny-atlas/blob/17e29746e9ca92518912e7e7962968d74fea8996/README.md#L19) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-isogeny-gate — f6f409888c6398d8e4b00cda2a7175f0eedc9a51

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/app.spec.ts:54](https://github.com/systemslibrarian/crypto-lab-isogeny-gate/blob/f6f409888c6398d8e4b00cda2a7175f0eedc9a51/e2e/app.spec.ts#L54) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/ui.test.ts:173](https://github.com/systemslibrarian/crypto-lab-isogeny-gate/blob/f6f409888c6398d8e4b00cda2a7175f0eedc9a51/src/ui.test.ts#L173)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-isogeny-gate/blob/f6f409888c6398d8e4b00cda2a7175f0eedc9a51/.github/workflows/deploy.yml#L40) `build-and-deploy (needs: —): npm test`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-isogeny-gate/blob/f6f409888c6398d8e4b00cda2a7175f0eedc9a51/.github/workflows/deploy.yml#L43) `build-and-deploy (needs: —): npm run build`; [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-isogeny-gate/blob/f6f409888c6398d8e4b00cda2a7175f0eedc9a51/.github/workflows/deploy.yml#L46) `build-and-deploy (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:53](https://github.com/systemslibrarian/crypto-lab-isogeny-gate/blob/f6f409888c6398d8e4b00cda2a7175f0eedc9a51/.github/workflows/deploy.yml#L53) `build-and-deploy (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:32](https://github.com/systemslibrarian/crypto-lab-isogeny-gate/blob/f6f409888c6398d8e4b00cda2a7175f0eedc9a51/playwright.config.ts#L32))
- **Limits and guidance (+)**: [README.md:15](https://github.com/systemslibrarian/crypto-lab-isogeny-gate/blob/f6f409888c6398d8e4b00cda2a7175f0eedc9a51/README.md#L15)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-j-uniward — 43e7dd883fa866fe213ae16d3536332402fc7266

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [scripts/test.ts:212](https://github.com/systemslibrarian/crypto-lab-j-uniward/blob/43e7dd883fa866fe213ae16d3536332402fc7266/scripts/test.ts#L212) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:515](https://github.com/systemslibrarian/crypto-lab-j-uniward/blob/43e7dd883fa866fe213ae16d3536332402fc7266/e2e/claims.spec.ts#L515)
- **Negative test (+)**: [e2e/claims.spec.ts:447](https://github.com/systemslibrarian/crypto-lab-j-uniward/blob/43e7dd883fa866fe213ae16d3536332402fc7266/e2e/claims.spec.ts#L447)
- **Deploy gate (+)**: [.github/workflows/pages.yml:33](https://github.com/systemslibrarian/crypto-lab-j-uniward/blob/43e7dd883fa866fe213ae16d3536332402fc7266/.github/workflows/pages.yml#L33) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:35](https://github.com/systemslibrarian/crypto-lab-j-uniward/blob/43e7dd883fa866fe213ae16d3536332402fc7266/.github/workflows/pages.yml#L35) `build (needs: —): npm run build`; [.github/workflows/pages.yml:37](https://github.com/systemslibrarian/crypto-lab-j-uniward/blob/43e7dd883fa866fe213ae16d3536332402fc7266/.github/workflows/pages.yml#L37) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:39](https://github.com/systemslibrarian/crypto-lab-j-uniward/blob/43e7dd883fa866fe213ae16d3536332402fc7266/.github/workflows/pages.yml#L39) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:24](https://github.com/systemslibrarian/crypto-lab-j-uniward/blob/43e7dd883fa866fe213ae16d3536332402fc7266/playwright.config.ts#L24))
- **Limits and guidance (+)**: [README.md:33](https://github.com/systemslibrarian/crypto-lab-j-uniward/blob/43e7dd883fa866fe213ae16d3536332402fc7266/README.md#L33)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-jevil — 4db66aaa6141721e1d2eae35e5ed3f0973288772

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Deploy gate (+)**: [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-jevil/blob/4db66aaa6141721e1d2eae35e5ed3f0973288772/.github/workflows/deploy.yml#L39) `build (needs: —): npm test`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-jevil/blob/4db66aaa6141721e1d2eae35e5ed3f0973288772/.github/workflows/deploy.yml#L40) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-jevil/blob/4db66aaa6141721e1d2eae35e5ed3f0973288772/.github/workflows/deploy.yml#L43) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:58](https://github.com/systemslibrarian/crypto-lab-jevil/blob/4db66aaa6141721e1d2eae35e5ed3f0973288772/.github/workflows/deploy.yml#L58) `build (needs: —): BASE_URL=http://localhost:4675/crypto-lab-jevil/ npm run test:e2e`; [.github/workflows/deploy.yml:63](https://github.com/systemslibrarian/crypto-lab-jevil/blob/4db66aaa6141721e1d2eae35e5ed3f0973288772/.github/workflows/deploy.yml#L63) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-jevil/blob/4db66aaa6141721e1d2eae35e5ed3f0973288772/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:36](https://github.com/systemslibrarian/crypto-lab-jevil/blob/4db66aaa6141721e1d2eae35e5ed3f0973288772/README.md#L36)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-jwt-forge — 6d6e78b49289f70f261f11851815b9899827f656

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/jwt/base64url.test.ts:26](https://github.com/systemslibrarian/crypto-lab-jwt-forge/blob/6d6e78b49289f70f261f11851815b9899827f656/src/jwt/base64url.test.ts#L26) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/ui/app.test.ts:8](https://github.com/systemslibrarian/crypto-lab-jwt-forge/blob/6d6e78b49289f70f261f11851815b9899827f656/src/ui/app.test.ts#L8) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:581](https://github.com/systemslibrarian/crypto-lab-jwt-forge/blob/6d6e78b49289f70f261f11851815b9899827f656/e2e/claims.spec.ts#L581)
- **Negative test (+)**: [e2e/claims.spec.ts:273](https://github.com/systemslibrarian/crypto-lab-jwt-forge/blob/6d6e78b49289f70f261f11851815b9899827f656/e2e/claims.spec.ts#L273)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-jwt-forge/blob/6d6e78b49289f70f261f11851815b9899827f656/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-jwt-forge/blob/6d6e78b49289f70f261f11851815b9899827f656/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-jwt-forge/blob/6d6e78b49289f70f261f11851815b9899827f656/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-jwt-forge/blob/6d6e78b49289f70f261f11851815b9899827f656/.github/workflows/deploy.yml#L37) `build (needs: —): npm run test:e2e`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-kdf-arena — 0e07080eac4564723ac8b36e8a4f86736817baaa

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [test/kdf.test.ts:5](https://github.com/systemslibrarian/crypto-lab-kdf-arena/blob/0e07080eac4564723ac8b36e8a4f86736817baaa/test/kdf.test.ts#L5) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [test/kdf.test.ts:20](https://github.com/systemslibrarian/crypto-lab-kdf-arena/blob/0e07080eac4564723ac8b36e8a4f86736817baaa/test/kdf.test.ts#L20) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:334](https://github.com/systemslibrarian/crypto-lab-kdf-arena/blob/0e07080eac4564723ac8b36e8a4f86736817baaa/e2e/claims.spec.ts#L334)
- **Negative test (+)**: [e2e/claims.spec.ts:474](https://github.com/systemslibrarian/crypto-lab-kdf-arena/blob/0e07080eac4564723ac8b36e8a4f86736817baaa/e2e/claims.spec.ts#L474)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-kdf-arena/blob/0e07080eac4564723ac8b36e8a4f86736817baaa/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-kdf-arena/blob/0e07080eac4564723ac8b36e8a4f86736817baaa/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-kdf-arena/blob/0e07080eac4564723ac8b36e8a4f86736817baaa/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-kdf-arena/blob/0e07080eac4564723ac8b36e8a4f86736817baaa/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:e2e`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-kdf-arena/blob/0e07080eac4564723ac8b36e8a4f86736817baaa/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-kdf-chain — 33acf8dce505c4468fe011989bb5b7cf45e084b6

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:84](https://github.com/systemslibrarian/crypto-lab-kdf-chain/blob/33acf8dce505c4468fe011989bb5b7cf45e084b6/e2e/claims.spec.ts#L84) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:94](https://github.com/systemslibrarian/crypto-lab-kdf-chain/blob/33acf8dce505c4468fe011989bb5b7cf45e084b6/e2e/claims.spec.ts#L94) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:109](https://github.com/systemslibrarian/crypto-lab-kdf-chain/blob/33acf8dce505c4468fe011989bb5b7cf45e084b6/e2e/claims.spec.ts#L109)
- **Deploy gate (+)**: [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-kdf-chain/blob/33acf8dce505c4468fe011989bb5b7cf45e084b6/.github/workflows/pages.yml#L30) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:31](https://github.com/systemslibrarian/crypto-lab-kdf-chain/blob/33acf8dce505c4468fe011989bb5b7cf45e084b6/.github/workflows/pages.yml#L31) `build (needs: —): npm run build`; [.github/workflows/pages.yml:33](https://github.com/systemslibrarian/crypto-lab-kdf-chain/blob/33acf8dce505c4468fe011989bb5b7cf45e084b6/.github/workflows/pages.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:35](https://github.com/systemslibrarian/crypto-lab-kdf-chain/blob/33acf8dce505c4468fe011989bb5b7cf45e084b6/.github/workflows/pages.yml#L35) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-kdf-chain/blob/33acf8dce505c4468fe011989bb5b7cf45e084b6/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-kdf-chain/blob/33acf8dce505c4468fe011989bb5b7cf45e084b6/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-kem-trap — 8b20cfedbbf88271d7ad9aefd682f39678d3e8f7

Source scan: SCANNED.
- **Ground truth (+)**: [src/__tests__/mlkem.test.ts:63](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/src/__tests__/mlkem.test.ts#L63)
- **Independent check (+)**: [src/__tests__/mlkem.test.ts:2](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/src/__tests__/mlkem.test.ts#L2)
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/smoke.spec.ts:22](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/e2e/smoke.spec.ts#L22)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/.github/workflows/deploy.yml#L32) `build (needs: —): npm run test:coverage`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/.github/workflows/deploy.yml#L34) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/.github/workflows/deploy.yml#L36) `build (needs: —): npm run bundle-budget`; [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/.github/workflows/deploy.yml#L38) `build (needs: —): npx playwright install --with-deps chromium firefox webkit`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/.github/workflows/deploy.yml#L40) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:31](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/playwright.config.ts#L31)), firefox ([playwright.config.ts:34](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/playwright.config.ts#L34)), webkit ([playwright.config.ts:35](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/playwright.config.ts#L35))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:13](https://github.com/systemslibrarian/crypto-lab-kem-trap/blob/8b20cfedbbf88271d7ad9aefd682f39678d3e8f7/README.md#L13) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-kerberos — f580012298b3e5dc8cdbe067c08e2bcf470bf8d6

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:130](https://github.com/systemslibrarian/crypto-lab-kerberos/blob/f580012298b3e5dc8cdbe067c08e2bcf470bf8d6/e2e/claims.spec.ts#L130) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [test/string2key.test.ts:1](https://github.com/systemslibrarian/crypto-lab-kerberos/blob/f580012298b3e5dc8cdbe067c08e2bcf470bf8d6/test/string2key.test.ts#L1) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:92](https://github.com/systemslibrarian/crypto-lab-kerberos/blob/f580012298b3e5dc8cdbe067c08e2bcf470bf8d6/e2e/claims.spec.ts#L92)
- **Negative test (+)**: [test/cts.test.ts:38](https://github.com/systemslibrarian/crypto-lab-kerberos/blob/f580012298b3e5dc8cdbe067c08e2bcf470bf8d6/test/cts.test.ts#L38)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:59](https://github.com/systemslibrarian/crypto-lab-kerberos/blob/f580012298b3e5dc8cdbe067c08e2bcf470bf8d6/.github/workflows/deploy.yml#L59) `build (needs: —): npm test`; [.github/workflows/deploy.yml:62](https://github.com/systemslibrarian/crypto-lab-kerberos/blob/f580012298b3e5dc8cdbe067c08e2bcf470bf8d6/.github/workflows/deploy.yml#L62) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:65](https://github.com/systemslibrarian/crypto-lab-kerberos/blob/f580012298b3e5dc8cdbe067c08e2bcf470bf8d6/.github/workflows/deploy.yml#L65) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:68](https://github.com/systemslibrarian/crypto-lab-kerberos/blob/f580012298b3e5dc8cdbe067c08e2bcf470bf8d6/.github/workflows/deploy.yml#L68) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:23](https://github.com/systemslibrarian/crypto-lab-kerberos/blob/f580012298b3e5dc8cdbe067c08e2bcf470bf8d6/playwright.config.ts#L23))
- **Limits and guidance (+)**: [README.md:12](https://github.com/systemslibrarian/crypto-lab-kerberos/blob/f580012298b3e5dc8cdbe067c08e2bcf470bf8d6/README.md#L12)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-key-exchange — c5be956d0ad547d9ccd543b7163586ee6a2fd184

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [scripts/engine.test.mjs:157](https://github.com/systemslibrarian/crypto-lab-key-exchange/blob/c5be956d0ad547d9ccd543b7163586ee6a2fd184/scripts/engine.test.mjs#L157) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [scripts/engine.test.mjs:30](https://github.com/systemslibrarian/crypto-lab-key-exchange/blob/c5be956d0ad547d9ccd543b7163586ee6a2fd184/scripts/engine.test.mjs#L30) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [scripts/engine.test.mjs:104](https://github.com/systemslibrarian/crypto-lab-key-exchange/blob/c5be956d0ad547d9ccd543b7163586ee6a2fd184/scripts/engine.test.mjs#L104)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:24](https://github.com/systemslibrarian/crypto-lab-key-exchange/blob/c5be956d0ad547d9ccd543b7163586ee6a2fd184/.github/workflows/deploy.yml#L24) `build (needs: —): npm test`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-key-exchange/blob/c5be956d0ad547d9ccd543b7163586ee6a2fd184/.github/workflows/deploy.yml#L37) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-key-exchange/blob/c5be956d0ad547d9ccd543b7163586ee6a2fd184/.github/workflows/deploy.yml#L39) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:50](https://github.com/systemslibrarian/crypto-lab-key-exchange/blob/c5be956d0ad547d9ccd543b7163586ee6a2fd184/.github/workflows/deploy.yml#L50) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-key-exchange/blob/c5be956d0ad547d9ccd543b7163586ee6a2fd184/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-key-exchange/blob/c5be956d0ad547d9ccd543b7163586ee6a2fd184/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-key-mirror — 89d7aa6a6a56261525186fb589b4ac04d6e81d40

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/merkle/kat.test.ts:2](https://github.com/systemslibrarian/crypto-lab-key-mirror/blob/89d7aa6a6a56261525186fb589b4ac04d6e81d40/src/merkle/kat.test.ts#L2) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:306](https://github.com/systemslibrarian/crypto-lab-key-mirror/blob/89d7aa6a6a56261525186fb589b4ac04d6e81d40/e2e/claims.spec.ts#L306)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-key-mirror/blob/89d7aa6a6a56261525186fb589b4ac04d6e81d40/.github/workflows/deploy.yml#L33) `build (needs: —): npm test`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-key-mirror/blob/89d7aa6a6a56261525186fb589b4ac04d6e81d40/.github/workflows/deploy.yml#L34) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-key-mirror/blob/89d7aa6a6a56261525186fb589b4ac04d6e81d40/.github/workflows/deploy.yml#L36) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-key-mirror/blob/89d7aa6a6a56261525186fb589b4ac04d6e81d40/.github/workflows/deploy.yml#L38) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-key-mirror/blob/89d7aa6a6a56261525186fb589b4ac04d6e81d40/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:20](https://github.com/systemslibrarian/crypto-lab-key-mirror/blob/89d7aa6a6a56261525186fb589b4ac04d6e81d40/README.md#L20)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-kmac-gate — 2315d38d45b6a9f1bd392c8719490486cef78382

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:12](https://github.com/systemslibrarian/crypto-lab-kmac-gate/blob/2315d38d45b6a9f1bd392c8719490486cef78382/e2e/claims.spec.ts#L12) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:20](https://github.com/systemslibrarian/crypto-lab-kmac-gate/blob/2315d38d45b6a9f1bd392c8719490486cef78382/e2e/claims.spec.ts#L20) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:141](https://github.com/systemslibrarian/crypto-lab-kmac-gate/blob/2315d38d45b6a9f1bd392c8719490486cef78382/e2e/claims.spec.ts#L141)
- **Negative test (+)**: [e2e/claims.spec.ts:126](https://github.com/systemslibrarian/crypto-lab-kmac-gate/blob/2315d38d45b6a9f1bd392c8719490486cef78382/e2e/claims.spec.ts#L126)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:42](https://github.com/systemslibrarian/crypto-lab-kmac-gate/blob/2315d38d45b6a9f1bd392c8719490486cef78382/.github/workflows/deploy.yml#L42) `build (needs: —): npm test`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-kmac-gate/blob/2315d38d45b6a9f1bd392c8719490486cef78382/.github/workflows/deploy.yml#L45) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:48](https://github.com/systemslibrarian/crypto-lab-kmac-gate/blob/2315d38d45b6a9f1bd392c8719490486cef78382/.github/workflows/deploy.yml#L48) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:51](https://github.com/systemslibrarian/crypto-lab-kmac-gate/blob/2315d38d45b6a9f1bd392c8719490486cef78382/.github/workflows/deploy.yml#L51) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:14](https://github.com/systemslibrarian/crypto-lab-kmac-gate/blob/2315d38d45b6a9f1bd392c8719490486cef78382/README.md#L14)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-kpqc-pair — 0ef5fe67aec9d501cc58fff9a58fae9f013fa462

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:216](https://github.com/systemslibrarian/crypto-lab-kpqc-pair/blob/0ef5fe67aec9d501cc58fff9a58fae9f013fa462/e2e/claims.spec.ts#L216) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/kat/kat.test.ts:1](https://github.com/systemslibrarian/crypto-lab-kpqc-pair/blob/0ef5fe67aec9d501cc58fff9a58fae9f013fa462/src/kat/kat.test.ts#L1) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:148](https://github.com/systemslibrarian/crypto-lab-kpqc-pair/blob/0ef5fe67aec9d501cc58fff9a58fae9f013fa462/e2e/claims.spec.ts#L148)
- **Negative test (+)**: [src/reference.test.ts:19](https://github.com/systemslibrarian/crypto-lab-kpqc-pair/blob/0ef5fe67aec9d501cc58fff9a58fae9f013fa462/src/reference.test.ts#L19)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-kpqc-pair/blob/0ef5fe67aec9d501cc58fff9a58fae9f013fa462/.github/workflows/deploy.yml#L38) `build (needs: —): npm test`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-kpqc-pair/blob/0ef5fe67aec9d501cc58fff9a58fae9f013fa462/.github/workflows/deploy.yml#L41) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:44](https://github.com/systemslibrarian/crypto-lab-kpqc-pair/blob/0ef5fe67aec9d501cc58fff9a58fae9f013fa462/.github/workflows/deploy.yml#L44) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:52](https://github.com/systemslibrarian/crypto-lab-kpqc-pair/blob/0ef5fe67aec9d501cc58fff9a58fae9f013fa462/.github/workflows/deploy.yml#L52) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:55](https://github.com/systemslibrarian/crypto-lab-kpqc-pair/blob/0ef5fe67aec9d501cc58fff9a58fae9f013fa462/.github/workflows/deploy.yml#L55) `build (needs: —): npm run test:e2e`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:26](https://github.com/systemslibrarian/crypto-lab-kpqc-pair/blob/0ef5fe67aec9d501cc58fff9a58fae9f013fa462/README.md#L26)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-kyber-vault — 3aa79354c57cdbb046d471b1157241a71aa52c35

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [demos/kyber-vault/e2e/model-boundary.spec.ts:3](https://github.com/systemslibrarian/crypto-lab-kyber-vault/blob/3aa79354c57cdbb046d471b1157241a71aa52c35/demos/kyber-vault/e2e/model-boundary.spec.ts#L3) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [demos/kyber-vault/e2e/benchmark.spec.ts:26](https://github.com/systemslibrarian/crypto-lab-kyber-vault/blob/3aa79354c57cdbb046d471b1157241a71aa52c35/demos/kyber-vault/e2e/benchmark.spec.ts#L26) requires provenance/execution review.
- **Displayed claim (+)**: [demos/kyber-vault/src/__tests__/parameters-ui.test.ts:20](https://github.com/systemslibrarian/crypto-lab-kyber-vault/blob/3aa79354c57cdbb046d471b1157241a71aa52c35/demos/kyber-vault/src/__tests__/parameters-ui.test.ts#L20)
- **Negative test (+)**: [demos/kyber-vault/e2e/claims.spec.ts:27](https://github.com/systemslibrarian/crypto-lab-kyber-vault/blob/3aa79354c57cdbb046d471b1157241a71aa52c35/demos/kyber-vault/e2e/claims.spec.ts#L27)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:69](https://github.com/systemslibrarian/crypto-lab-kyber-vault/blob/3aa79354c57cdbb046d471b1157241a71aa52c35/.github/workflows/deploy.yml#L69) `build (needs: —): npm test`; [.github/workflows/deploy.yml:75](https://github.com/systemslibrarian/crypto-lab-kyber-vault/blob/3aa79354c57cdbb046d471b1157241a71aa52c35/.github/workflows/deploy.yml#L75) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:79](https://github.com/systemslibrarian/crypto-lab-kyber-vault/blob/3aa79354c57cdbb046d471b1157241a71aa52c35/.github/workflows/deploy.yml#L79) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:83](https://github.com/systemslibrarian/crypto-lab-kyber-vault/blob/3aa79354c57cdbb046d471b1157241a71aa52c35/.github/workflows/deploy.yml#L83) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:98](https://github.com/systemslibrarian/crypto-lab-kyber-vault/blob/3aa79354c57cdbb046d471b1157241a71aa52c35/.github/workflows/deploy.yml#L98) `build (needs: —): npm run build:lighthouse`; engines: chromium ([demos/kyber-vault/playwright.config.ts:33](https://github.com/systemslibrarian/crypto-lab-kyber-vault/blob/3aa79354c57cdbb046d471b1157241a71aa52c35/demos/kyber-vault/playwright.config.ts#L33))
- **Limits and guidance (+)**: [README.md:33](https://github.com/systemslibrarian/crypto-lab-kyber-vault/blob/3aa79354c57cdbb046d471b1157241a71aa52c35/README.md#L33)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-kyberslash — 4b931164d9241702c55070ad4939dba5f35ccd1b

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/implementations.test.ts:58](https://github.com/systemslibrarian/crypto-lab-kyberslash/blob/4b931164d9241702c55070ad4939dba5f35ccd1b/src/implementations.test.ts#L58) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:219](https://github.com/systemslibrarian/crypto-lab-kyberslash/blob/4b931164d9241702c55070ad4939dba5f35ccd1b/e2e/claims.spec.ts#L219)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-kyberslash/blob/4b931164d9241702c55070ad4939dba5f35ccd1b/.github/workflows/deploy.yml#L38) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-kyberslash/blob/4b931164d9241702c55070ad4939dba5f35ccd1b/.github/workflows/deploy.yml#L41) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:44](https://github.com/systemslibrarian/crypto-lab-kyberslash/blob/4b931164d9241702c55070ad4939dba5f35ccd1b/.github/workflows/deploy.yml#L44) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-kyberslash/blob/4b931164d9241702c55070ad4939dba5f35ccd1b/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-lattice-builder — f4d1b98b6d9bf7a25732c93e179d1da0ad5e6b43

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: candidate [test/csp.test.js:25](https://github.com/systemslibrarian/crypto-lab-lattice-builder/blob/f4d1b98b6d9bf7a25732c93e179d1da0ad5e6b43/test/csp.test.js#L25) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Deploy gate (+)**: [.github/workflows/deploy-pages.yml:51](https://github.com/systemslibrarian/crypto-lab-lattice-builder/blob/f4d1b98b6d9bf7a25732c93e179d1da0ad5e6b43/.github/workflows/deploy-pages.yml#L51) `build (needs: —): npm test`; [.github/workflows/deploy-pages.yml:54](https://github.com/systemslibrarian/crypto-lab-lattice-builder/blob/f4d1b98b6d9bf7a25732c93e179d1da0ad5e6b43/.github/workflows/deploy-pages.yml#L54) `build (needs: —): npm run build`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-lattice-fault — 6a12d9310550981ce2dcf4cb9c0b9db999906c9d

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:12](https://github.com/systemslibrarian/crypto-lab-lattice-fault/blob/6a12d9310550981ce2dcf4cb9c0b9db999906c9d/e2e/claims.spec.ts#L12) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [tests/ui.test.ts:3](https://github.com/systemslibrarian/crypto-lab-lattice-fault/blob/6a12d9310550981ce2dcf4cb9c0b9db999906c9d/tests/ui.test.ts#L3) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:388](https://github.com/systemslibrarian/crypto-lab-lattice-fault/blob/6a12d9310550981ce2dcf4cb9c0b9db999906c9d/e2e/claims.spec.ts#L388)
- **Negative test (+)**: [tests/rejection.test.ts:37](https://github.com/systemslibrarian/crypto-lab-lattice-fault/blob/6a12d9310550981ce2dcf4cb9c0b9db999906c9d/tests/rejection.test.ts#L37)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:27](https://github.com/systemslibrarian/crypto-lab-lattice-fault/blob/6a12d9310550981ce2dcf4cb9c0b9db999906c9d/.github/workflows/deploy.yml#L27) `build (needs: —): npm test`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-lattice-fault/blob/6a12d9310550981ce2dcf4cb9c0b9db999906c9d/.github/workflows/deploy.yml#L33) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-lattice-fault/blob/6a12d9310550981ce2dcf4cb9c0b9db999906c9d/.github/workflows/deploy.yml#L35) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-lattice-fault/blob/6a12d9310550981ce2dcf4cb9c0b9db999906c9d/.github/workflows/deploy.yml#L37) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:24](https://github.com/systemslibrarian/crypto-lab-lattice-fault/blob/6a12d9310550981ce2dcf4cb9c0b9db999906c9d/playwright.config.ts#L24))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-lattice-fault/blob/6a12d9310550981ce2dcf4cb9c0b9db999906c9d/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-lattice-gentle — 8a8896f8b9365a3f8665d6002cb3dd91a13942c0

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/kyber/toyKyber.test.ts:85](https://github.com/systemslibrarian/crypto-lab-lattice-gentle/blob/8a8896f8b9365a3f8665d6002cb3dd91a13942c0/src/kyber/toyKyber.test.ts#L85) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/dilithium/toyDilithium.test.ts:74](https://github.com/systemslibrarian/crypto-lab-lattice-gentle/blob/8a8896f8b9365a3f8665d6002cb3dd91a13942c0/src/dilithium/toyDilithium.test.ts#L74)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-lattice-gentle/blob/8a8896f8b9365a3f8665d6002cb3dd91a13942c0/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-lattice-gentle/blob/8a8896f8b9365a3f8665d6002cb3dd91a13942c0/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-lattice-gentle/blob/8a8896f8b9365a3f8665d6002cb3dd91a13942c0/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-lattice-gentle/blob/8a8896f8b9365a3f8665d6002cb3dd91a13942c0/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-lattice-gentle/blob/8a8896f8b9365a3f8665d6002cb3dd91a13942c0/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-lll-break — f3e51f07a4880ab13f0c2fbe6ffd41d204df13a1

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [scripts/guardrails.mjs:44](https://github.com/systemslibrarian/crypto-lab-lll-break/blob/f3e51f07a4880ab13f0c2fbe6ffd41d204df13a1/scripts/guardrails.mjs#L44) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Deploy gate (+)**: [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-lll-break/blob/f3e51f07a4880ab13f0c2fbe6ffd41d204df13a1/.github/workflows/deploy.yml#L43) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-lll-break/blob/f3e51f07a4880ab13f0c2fbe6ffd41d204df13a1/.github/workflows/deploy.yml#L46) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:49](https://github.com/systemslibrarian/crypto-lab-lll-break/blob/f3e51f07a4880ab13f0c2fbe6ffd41d204df13a1/.github/workflows/deploy.yml#L49) `build (needs: —): npm run test:ui`; [.github/workflows/deploy.yml:52](https://github.com/systemslibrarian/crypto-lab-lll-break/blob/f3e51f07a4880ab13f0c2fbe6ffd41d204df13a1/.github/workflows/deploy.yml#L52) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:26](https://github.com/systemslibrarian/crypto-lab-lll-break/blob/f3e51f07a4880ab13f0c2fbe6ffd41d204df13a1/playwright.config.ts#L26))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-lll-break/blob/f3e51f07a4880ab13f0c2fbe6ffd41d204df13a1/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-lms-ledger — b55685fc1fd17a0889caaaf12df919383e2b100d

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [test/rfc8554-vectors.test.ts:2](https://github.com/systemslibrarian/crypto-lab-lms-ledger/blob/b55685fc1fd17a0889caaaf12df919383e2b100d/test/rfc8554-vectors.test.ts#L2) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [test/lms.test.ts:59](https://github.com/systemslibrarian/crypto-lab-lms-ledger/blob/b55685fc1fd17a0889caaaf12df919383e2b100d/test/lms.test.ts#L59)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-lms-ledger/blob/b55685fc1fd17a0889caaaf12df919383e2b100d/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-lms-ledger/blob/b55685fc1fd17a0889caaaf12df919383e2b100d/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-lms-ledger/blob/b55685fc1fd17a0889caaaf12df919383e2b100d/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-lms-ledger/blob/b55685fc1fd17a0889caaaf12df919383e2b100d/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-lms-ledger/blob/b55685fc1fd17a0889caaaf12df919383e2b100d/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:15](https://github.com/systemslibrarian/crypto-lab-lms-ledger/blob/b55685fc1fd17a0889caaaf12df919383e2b100d/README.md#L15)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-lms-xmss — 727c3d350f4ce75d2f594d0c129b381d8fe1aec6

Source scan: SCANNED.
- **Ground truth (+)**: [src/gates/phase1.ts:91](https://github.com/systemslibrarian/crypto-lab-lms-xmss/blob/727c3d350f4ce75d2f594d0c129b381d8fe1aec6/src/gates/phase1.ts#L91)
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:3](https://github.com/systemslibrarian/crypto-lab-lms-xmss/blob/727c3d350f4ce75d2f594d0c129b381d8fe1aec6/e2e/claims.spec.ts#L3)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-lms-xmss/blob/727c3d350f4ce75d2f594d0c129b381d8fe1aec6/.github/workflows/deploy.yml#L46) `build (needs: —): npm test`; [.github/workflows/deploy.yml:49](https://github.com/systemslibrarian/crypto-lab-lms-xmss/blob/727c3d350f4ce75d2f594d0c129b381d8fe1aec6/.github/workflows/deploy.yml#L49) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:52](https://github.com/systemslibrarian/crypto-lab-lms-xmss/blob/727c3d350f4ce75d2f594d0c129b381d8fe1aec6/.github/workflows/deploy.yml#L52) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:55](https://github.com/systemslibrarian/crypto-lab-lms-xmss/blob/727c3d350f4ce75d2f594d0c129b381d8fe1aec6/.github/workflows/deploy.yml#L55) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-lms-xmss/blob/727c3d350f4ce75d2f594d0c129b381d8fe1aec6/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-lms-xmss/blob/727c3d350f4ce75d2f594d0c129b381d8fe1aec6/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-lwe-hints — 19324cbe8b63b7e31f49e403a7950e50ca8a826d

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/attack.test.ts:81](https://github.com/systemslibrarian/crypto-lab-lwe-hints/blob/19324cbe8b63b7e31f49e403a7950e50ca8a826d/src/attack.test.ts#L81) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/attack.test.ts:45](https://github.com/systemslibrarian/crypto-lab-lwe-hints/blob/19324cbe8b63b7e31f49e403a7950e50ca8a826d/src/attack.test.ts#L45)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:57](https://github.com/systemslibrarian/crypto-lab-lwe-hints/blob/19324cbe8b63b7e31f49e403a7950e50ca8a826d/.github/workflows/deploy.yml#L57) `build (needs: —): npm test`; [.github/workflows/deploy.yml:58](https://github.com/systemslibrarian/crypto-lab-lwe-hints/blob/19324cbe8b63b7e31f49e403a7950e50ca8a826d/.github/workflows/deploy.yml#L58) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:60](https://github.com/systemslibrarian/crypto-lab-lwe-hints/blob/19324cbe8b63b7e31f49e403a7950e50ca8a826d/.github/workflows/deploy.yml#L60) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:62](https://github.com/systemslibrarian/crypto-lab-lwe-hints/blob/19324cbe8b63b7e31f49e403a7950e50ca8a826d/.github/workflows/deploy.yml#L62) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:25](https://github.com/systemslibrarian/crypto-lab-lwe-hints/blob/19324cbe8b63b7e31f49e403a7950e50ca8a826d/playwright.config.ts#L25))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-lwe-hints/blob/19324cbe8b63b7e31f49e403a7950e50ca8a826d/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-mac-race — 4c0e376316f4b1c2a4cbd686ef04820f0b8abea4

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/cmac.test.ts:4](https://github.com/systemslibrarian/crypto-lab-mac-race/blob/4c0e376316f4b1c2a4cbd686ef04820f0b8abea4/src/cmac.test.ts#L4) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/sha256core.test.ts:7](https://github.com/systemslibrarian/crypto-lab-mac-race/blob/4c0e376316f4b1c2a4cbd686ef04820f0b8abea4/src/sha256core.test.ts#L7) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:71](https://github.com/systemslibrarian/crypto-lab-mac-race/blob/4c0e376316f4b1c2a4cbd686ef04820f0b8abea4/e2e/claims.spec.ts#L71)
- **Negative test (+)**: [src/lengthext.test.ts:29](https://github.com/systemslibrarian/crypto-lab-mac-race/blob/4c0e376316f4b1c2a4cbd686ef04820f0b8abea4/src/lengthext.test.ts#L29)
- **Deploy gate (+)**: [.github/workflows/pages.yml:31](https://github.com/systemslibrarian/crypto-lab-mac-race/blob/4c0e376316f4b1c2a4cbd686ef04820f0b8abea4/.github/workflows/pages.yml#L31) `build (needs: —): npm run build`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-mac-race/blob/4c0e376316f4b1c2a4cbd686ef04820f0b8abea4/.github/workflows/pages.yml#L34) `build (needs: —): npm test`; [.github/workflows/pages.yml:37](https://github.com/systemslibrarian/crypto-lab-mac-race/blob/4c0e376316f4b1c2a4cbd686ef04820f0b8abea4/.github/workflows/pages.yml#L37) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:39](https://github.com/systemslibrarian/crypto-lab-mac-race/blob/4c0e376316f4b1c2a4cbd686ef04820f0b8abea4/.github/workflows/pages.yml#L39) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-mac-race/blob/4c0e376316f4b1c2a4cbd686ef04820f0b8abea4/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:17](https://github.com/systemslibrarian/crypto-lab-mac-race/blob/4c0e376316f4b1c2a4cbd686ef04820f0b8abea4/README.md#L17)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-masked-core — b9679f4b2bca1e2f3f2aaec88ed7a4c25e878f1f

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:195](https://github.com/systemslibrarian/crypto-lab-masked-core/blob/b9679f4b2bca1e2f3f2aaec88ed7a4c25e878f1f/e2e/claims.spec.ts#L195) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:356](https://github.com/systemslibrarian/crypto-lab-masked-core/blob/b9679f4b2bca1e2f3f2aaec88ed7a4c25e878f1f/e2e/claims.spec.ts#L356)
- **Negative test (+)**: [e2e/claims.spec.ts:320](https://github.com/systemslibrarian/crypto-lab-masked-core/blob/b9679f4b2bca1e2f3f2aaec88ed7a4c25e878f1f/e2e/claims.spec.ts#L320)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:49](https://github.com/systemslibrarian/crypto-lab-masked-core/blob/b9679f4b2bca1e2f3f2aaec88ed7a4c25e878f1f/.github/workflows/deploy.yml#L49) `build (needs: —): npm test`; [.github/workflows/deploy.yml:52](https://github.com/systemslibrarian/crypto-lab-masked-core/blob/b9679f4b2bca1e2f3f2aaec88ed7a4c25e878f1f/.github/workflows/deploy.yml#L52) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:57](https://github.com/systemslibrarian/crypto-lab-masked-core/blob/b9679f4b2bca1e2f3f2aaec88ed7a4c25e878f1f/.github/workflows/deploy.yml#L57) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:60](https://github.com/systemslibrarian/crypto-lab-masked-core/blob/b9679f4b2bca1e2f3f2aaec88ed7a4c25e878f1f/.github/workflows/deploy.yml#L60) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:63](https://github.com/systemslibrarian/crypto-lab-masked-core/blob/b9679f4b2bca1e2f3f2aaec88ed7a4c25e878f1f/.github/workflows/deploy.yml#L63) `build (needs: —): npm run test:claims`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:8](https://github.com/systemslibrarian/crypto-lab-masked-core/blob/b9679f4b2bca1e2f3f2aaec88ed7a4c25e878f1f/README.md#L8)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-matsui-line — 54ae594278d010249b2f72eb664567b0e28c3494

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/crypto/lat.test.ts:8](https://github.com/systemslibrarian/crypto-lab-matsui-line/blob/54ae594278d010249b2f72eb664567b0e28c3494/src/crypto/lat.test.ts#L8) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/behaviour.spec.ts:33](https://github.com/systemslibrarian/crypto-lab-matsui-line/blob/54ae594278d010249b2f72eb664567b0e28c3494/e2e/behaviour.spec.ts#L33)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-matsui-line/blob/54ae594278d010249b2f72eb664567b0e28c3494/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-matsui-line/blob/54ae594278d010249b2f72eb664567b0e28c3494/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-matsui-line/blob/54ae594278d010249b2f72eb664567b0e28c3494/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-matsui-line/blob/54ae594278d010249b2f72eb664567b0e28c3494/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:27](https://github.com/systemslibrarian/crypto-lab-matsui-line/blob/54ae594278d010249b2f72eb664567b0e28c3494/playwright.config.ts#L27))
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-matsui-line/blob/54ae594278d010249b2f72eb664567b0e28c3494/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-mayo-seal — 1586d1a40673179750de0f0f9daa976dbe75f173

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/mayo/mayo.test.ts:19](https://github.com/systemslibrarian/crypto-lab-mayo-seal/blob/1586d1a40673179750de0f0f9daa976dbe75f173/src/mayo/mayo.test.ts#L19) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/journey.spec.ts:64](https://github.com/systemslibrarian/crypto-lab-mayo-seal/blob/1586d1a40673179750de0f0f9daa976dbe75f173/e2e/journey.spec.ts#L64)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-mayo-seal/blob/1586d1a40673179750de0f0f9daa976dbe75f173/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-mayo-seal/blob/1586d1a40673179750de0f0f9daa976dbe75f173/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-mayo-seal/blob/1586d1a40673179750de0f0f9daa976dbe75f173/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-mayo-seal/blob/1586d1a40673179750de0f0f9daa976dbe75f173/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:20](https://github.com/systemslibrarian/crypto-lab-mayo-seal/blob/1586d1a40673179750de0f0f9daa976dbe75f173/playwright.config.ts#L20))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:11](https://github.com/systemslibrarian/crypto-lab-mayo-seal/blob/1586d1a40673179750de0f0f9daa976dbe75f173/README.md#L11) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-mceliece-gate — 7d10dc24ab23f9a341e7249761daa64ee205fbf1

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:15](https://github.com/systemslibrarian/crypto-lab-mceliece-gate/blob/7d10dc24ab23f9a341e7249761daa64ee205fbf1/e2e/claims.spec.ts#L15) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/ui.test.ts:3](https://github.com/systemslibrarian/crypto-lab-mceliece-gate/blob/7d10dc24ab23f9a341e7249761daa64ee205fbf1/src/ui.test.ts#L3) requires provenance/execution review.
- **Displayed claim (+)**: [src/ui.test.ts:130](https://github.com/systemslibrarian/crypto-lab-mceliece-gate/blob/7d10dc24ab23f9a341e7249761daa64ee205fbf1/src/ui.test.ts#L130)
- **Negative test (+)**: [src/ui.test.ts:182](https://github.com/systemslibrarian/crypto-lab-mceliece-gate/blob/7d10dc24ab23f9a341e7249761daa64ee205fbf1/src/ui.test.ts#L182)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-mceliece-gate/blob/7d10dc24ab23f9a341e7249761daa64ee205fbf1/.github/workflows/deploy.yml#L37) `build (needs: —): npm test`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-mceliece-gate/blob/7d10dc24ab23f9a341e7249761daa64ee205fbf1/.github/workflows/deploy.yml#L40) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-mceliece-gate/blob/7d10dc24ab23f9a341e7249761daa64ee205fbf1/.github/workflows/deploy.yml#L43) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-mceliece-gate/blob/7d10dc24ab23f9a341e7249761daa64ee205fbf1/.github/workflows/deploy.yml#L46) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:25](https://github.com/systemslibrarian/crypto-lab-mceliece-gate/blob/7d10dc24ab23f9a341e7249761daa64ee205fbf1/playwright.config.ts#L25))
- **Limits and guidance (+)**: [README.md:16](https://github.com/systemslibrarian/crypto-lab-mceliece-gate/blob/7d10dc24ab23f9a341e7249761daa64ee205fbf1/README.md#L16)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-merkle-proofs — 5f2adac7e23cdebb4431dc3c7a424309d75fc109

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:7](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/blob/5f2adac7e23cdebb4431dc3c7a424309d75fc109/e2e/claims.spec.ts#L7) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [tests/ui.smoke.test.ts:9](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/blob/5f2adac7e23cdebb4431dc3c7a424309d75fc109/tests/ui.smoke.test.ts#L9) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:198](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/blob/5f2adac7e23cdebb4431dc3c7a424309d75fc109/e2e/claims.spec.ts#L198)
- **Negative test (+)**: [tests/ui.smoke.test.ts:82](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/blob/5f2adac7e23cdebb4431dc3c7a424309d75fc109/tests/ui.smoke.test.ts#L82)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/blob/5f2adac7e23cdebb4431dc3c7a424309d75fc109/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/blob/5f2adac7e23cdebb4431dc3c7a424309d75fc109/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/blob/5f2adac7e23cdebb4431dc3c7a424309d75fc109/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/blob/5f2adac7e23cdebb4431dc3c7a424309d75fc109/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/blob/5f2adac7e23cdebb4431dc3c7a424309d75fc109/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:26](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/blob/5f2adac7e23cdebb4431dc3c7a424309d75fc109/README.md#L26)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-merkle-vault — ef859d27522ee61447ed9ec86d0c5124d51aa68d

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/demo.spec.ts:47](https://github.com/systemslibrarian/crypto-lab-merkle-vault/blob/ef859d27522ee61447ed9ec86d0c5124d51aa68d/e2e/demo.spec.ts#L47) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [tests/merkle.test.ts:18](https://github.com/systemslibrarian/crypto-lab-merkle-vault/blob/ef859d27522ee61447ed9ec86d0c5124d51aa68d/tests/merkle.test.ts#L18) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [tests/merkle.test.ts:168](https://github.com/systemslibrarian/crypto-lab-merkle-vault/blob/ef859d27522ee61447ed9ec86d0c5124d51aa68d/tests/merkle.test.ts#L168)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-merkle-vault/blob/ef859d27522ee61447ed9ec86d0c5124d51aa68d/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-merkle-vault/blob/ef859d27522ee61447ed9ec86d0c5124d51aa68d/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-merkle-vault/blob/ef859d27522ee61447ed9ec86d0c5124d51aa68d/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-merkle-vault/blob/ef859d27522ee61447ed9ec86d0c5124d51aa68d/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-merkle-vault/blob/ef859d27522ee61447ed9ec86d0c5124d51aa68d/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:16](https://github.com/systemslibrarian/crypto-lab-merkle-vault/blob/ef859d27522ee61447ed9ec86d0c5124d51aa68d/README.md#L16)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-misty-lens — 19044d74b09ea26520a3502aae764f74ef6e63a9

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/verification.test.ts:4](https://github.com/systemslibrarian/crypto-lab-misty-lens/blob/19044d74b09ea26520a3502aae764f74ef6e63a9/src/verification.test.ts#L4) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:22](https://github.com/systemslibrarian/crypto-lab-misty-lens/blob/19044d74b09ea26520a3502aae764f74ef6e63a9/e2e/claims.spec.ts#L22)
- **Negative test (+)**: [e2e/claims.spec.ts:44](https://github.com/systemslibrarian/crypto-lab-misty-lens/blob/19044d74b09ea26520a3502aae764f74ef6e63a9/e2e/claims.spec.ts#L44)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-misty-lens/blob/19044d74b09ea26520a3502aae764f74ef6e63a9/.github/workflows/deploy.yml#L37) `build (needs: —): npm test`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-misty-lens/blob/19044d74b09ea26520a3502aae764f74ef6e63a9/.github/workflows/deploy.yml#L40) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-misty-lens/blob/19044d74b09ea26520a3502aae764f74ef6e63a9/.github/workflows/deploy.yml#L43) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-misty-lens/blob/19044d74b09ea26520a3502aae764f74ef6e63a9/.github/workflows/deploy.yml#L46) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-misty-lens/blob/19044d74b09ea26520a3502aae764f74ef6e63a9/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-mls-group — 1f93874318f4c650a4edc1ad67dcbe488aa88f64

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/__tests__/key-schedule.test.ts:8](https://github.com/systemslibrarian/crypto-lab-mls-group/blob/1f93874318f4c650a4edc1ad67dcbe488aa88f64/src/__tests__/key-schedule.test.ts#L8) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/__tests__/group-lifecycle.test.ts:21](https://github.com/systemslibrarian/crypto-lab-mls-group/blob/1f93874318f4c650a4edc1ad67dcbe488aa88f64/src/__tests__/group-lifecycle.test.ts#L21) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:137](https://github.com/systemslibrarian/crypto-lab-mls-group/blob/1f93874318f4c650a4edc1ad67dcbe488aa88f64/e2e/claims.spec.ts#L137)
- **Negative test (+)**: [src/__tests__/key-schedule.test.ts:28](https://github.com/systemslibrarian/crypto-lab-mls-group/blob/1f93874318f4c650a4edc1ad67dcbe488aa88f64/src/__tests__/key-schedule.test.ts#L28)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-mls-group/blob/1f93874318f4c650a4edc1ad67dcbe488aa88f64/.github/workflows/deploy.yml#L41) `build (needs: test): npm run build`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-mls-group/blob/1f93874318f4c650a4edc1ad67dcbe488aa88f64/.github/workflows/deploy.yml#L43) `build (needs: test): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-mls-group/blob/1f93874318f4c650a4edc1ad67dcbe488aa88f64/.github/workflows/deploy.yml#L45) `build (needs: test): npm run test:a11y`; [.github/workflows/deploy.yml:29](https://github.com/systemslibrarian/crypto-lab-mls-group/blob/1f93874318f4c650a4edc1ad67dcbe488aa88f64/.github/workflows/deploy.yml#L29) `test (needs: —): npm test`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-mls-group/blob/1f93874318f4c650a4edc1ad67dcbe488aa88f64/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-mls-group/blob/1f93874318f4c650a4edc1ad67dcbe488aa88f64/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-model-breach — a1e3864c76e26f622608c25325ead69869119465

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/aesl.test.ts:13](https://github.com/systemslibrarian/crypto-lab-model-breach/blob/a1e3864c76e26f622608c25325ead69869119465/src/aesl.test.ts#L13) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/attack.test.ts:81](https://github.com/systemslibrarian/crypto-lab-model-breach/blob/a1e3864c76e26f622608c25325ead69869119465/src/attack.test.ts#L81)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-model-breach/blob/a1e3864c76e26f622608c25325ead69869119465/.github/workflows/deploy.yml#L37) `build (needs: —): npm test`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-model-breach/blob/a1e3864c76e26f622608c25325ead69869119465/.github/workflows/deploy.yml#L40) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-model-breach/blob/a1e3864c76e26f622608c25325ead69869119465/.github/workflows/deploy.yml#L43) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-model-breach/blob/a1e3864c76e26f622608c25325ead69869119465/.github/workflows/deploy.yml#L46) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:25](https://github.com/systemslibrarian/crypto-lab-model-breach/blob/a1e3864c76e26f622608c25325ead69869119465/playwright.config.ts#L25))
- **Limits and guidance (+)**: [README.md:25](https://github.com/systemslibrarian/crypto-lab-model-breach/blob/a1e3864c76e26f622608c25325ead69869119465/README.md#L25)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-mpcith-sign — c549dcee8b8f752df7f3021fa81cce457de751e7

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:52](https://github.com/systemslibrarian/crypto-lab-mpcith-sign/blob/c549dcee8b8f752df7f3021fa81cce457de751e7/e2e/claims.spec.ts#L52) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [tests/crypto.test.ts:33](https://github.com/systemslibrarian/crypto-lab-mpcith-sign/blob/c549dcee8b8f752df7f3021fa81cce457de751e7/tests/crypto.test.ts#L33) requires provenance/execution review.
- **Displayed claim (+)**: [tests/ui.test.ts:101](https://github.com/systemslibrarian/crypto-lab-mpcith-sign/blob/c549dcee8b8f752df7f3021fa81cce457de751e7/tests/ui.test.ts#L101)
- **Negative test (+)**: [tests/crypto.test.ts:53](https://github.com/systemslibrarian/crypto-lab-mpcith-sign/blob/c549dcee8b8f752df7f3021fa81cce457de751e7/tests/crypto.test.ts#L53)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-mpcith-sign/blob/c549dcee8b8f752df7f3021fa81cce457de751e7/.github/workflows/deploy.yml#L33) `build (needs: —): npm test`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-mpcith-sign/blob/c549dcee8b8f752df7f3021fa81cce457de751e7/.github/workflows/deploy.yml#L35) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-mpcith-sign/blob/c549dcee8b8f752df7f3021fa81cce457de751e7/.github/workflows/deploy.yml#L37) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-mpcith-sign/blob/c549dcee8b8f752df7f3021fa81cce457de751e7/.github/workflows/deploy.yml#L39) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:23](https://github.com/systemslibrarian/crypto-lab-mpcith-sign/blob/c549dcee8b8f752df7f3021fa81cce457de751e7/playwright.config.ts#L23))
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-mpcith-sign/blob/c549dcee8b8f752df7f3021fa81cce457de751e7/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-multivariate — 711ebba8afd8801167929395aca16b3679acd2a7

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/gf256.test.ts:6](https://github.com/systemslibrarian/crypto-lab-multivariate/blob/711ebba8afd8801167929395aca16b3679acd2a7/src/gf256.test.ts#L6) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/gf256.test.ts:40](https://github.com/systemslibrarian/crypto-lab-multivariate/blob/711ebba8afd8801167929395aca16b3679acd2a7/src/gf256.test.ts#L40)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-multivariate/blob/711ebba8afd8801167929395aca16b3679acd2a7/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-multivariate/blob/711ebba8afd8801167929395aca16b3679acd2a7/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-multivariate/blob/711ebba8afd8801167929395aca16b3679acd2a7/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-multivariate/blob/711ebba8afd8801167929395aca16b3679acd2a7/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-multivariate/blob/711ebba8afd8801167929395aca16b3679acd2a7/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-multivariate/blob/711ebba8afd8801167929395aca16b3679acd2a7/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-musig-gate — 4a4564b1f4e8f39774ee4068933be7b2491a69e8

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/musig/vectors.test.ts:29](https://github.com/systemslibrarian/crypto-lab-musig-gate/blob/4a4564b1f4e8f39774ee4068933be7b2491a69e8/src/musig/vectors.test.ts#L29) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/musig/rogue.test.ts:2](https://github.com/systemslibrarian/crypto-lab-musig-gate/blob/4a4564b1f4e8f39774ee4068933be7b2491a69e8/src/musig/rogue.test.ts#L2) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/flows.spec.ts:109](https://github.com/systemslibrarian/crypto-lab-musig-gate/blob/4a4564b1f4e8f39774ee4068933be7b2491a69e8/e2e/flows.spec.ts#L109)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:28](https://github.com/systemslibrarian/crypto-lab-musig-gate/blob/4a4564b1f4e8f39774ee4068933be7b2491a69e8/.github/workflows/deploy.yml#L28) `build (needs: —): npm test`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-musig-gate/blob/4a4564b1f4e8f39774ee4068933be7b2491a69e8/.github/workflows/deploy.yml#L30) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-musig-gate/blob/4a4564b1f4e8f39774ee4068933be7b2491a69e8/.github/workflows/deploy.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-musig-gate/blob/4a4564b1f4e8f39774ee4068933be7b2491a69e8/.github/workflows/deploy.yml#L34) `build (needs: —): npm run test:a11y`; engines: firefox ([playwright.config.ts:63](https://github.com/systemslibrarian/crypto-lab-musig-gate/blob/4a4564b1f4e8f39774ee4068933be7b2491a69e8/playwright.config.ts#L63))
- **Limits and guidance (+)**: [README.md:31](https://github.com/systemslibrarian/crypto-lab-musig-gate/blob/4a4564b1f4e8f39774ee4068933be7b2491a69e8/README.md#L31)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-noise-pipe — 0ac9e9e53d1df2e7aeb48ee1312ff582953f0c0e

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [test/primitives.test.ts:5](https://github.com/systemslibrarian/crypto-lab-noise-pipe/blob/0ac9e9e53d1df2e7aeb48ee1312ff582953f0c0e/test/primitives.test.ts#L5) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [test/noise-vectors.test.ts:23](https://github.com/systemslibrarian/crypto-lab-noise-pipe/blob/0ac9e9e53d1df2e7aeb48ee1312ff582953f0c0e/test/noise-vectors.test.ts#L23) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:42](https://github.com/systemslibrarian/crypto-lab-noise-pipe/blob/0ac9e9e53d1df2e7aeb48ee1312ff582953f0c0e/e2e/claims.spec.ts#L42)
- **Negative test (+)**: [test/primitives.test.ts:93](https://github.com/systemslibrarian/crypto-lab-noise-pipe/blob/0ac9e9e53d1df2e7aeb48ee1312ff582953f0c0e/test/primitives.test.ts#L93)
- **Deploy gate (+)**: [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-noise-pipe/blob/0ac9e9e53d1df2e7aeb48ee1312ff582953f0c0e/.github/workflows/pages.yml#L30) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:31](https://github.com/systemslibrarian/crypto-lab-noise-pipe/blob/0ac9e9e53d1df2e7aeb48ee1312ff582953f0c0e/.github/workflows/pages.yml#L31) `build (needs: —): npm run build`; [.github/workflows/pages.yml:33](https://github.com/systemslibrarian/crypto-lab-noise-pipe/blob/0ac9e9e53d1df2e7aeb48ee1312ff582953f0c0e/.github/workflows/pages.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:35](https://github.com/systemslibrarian/crypto-lab-noise-pipe/blob/0ac9e9e53d1df2e7aeb48ee1312ff582953f0c0e/.github/workflows/pages.yml#L35) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:29](https://github.com/systemslibrarian/crypto-lab-noise-pipe/blob/0ac9e9e53d1df2e7aeb48ee1312ff582953f0c0e/playwright.config.ts#L29))
- **Limits and guidance (+)**: [README.md:15](https://github.com/systemslibrarian/crypto-lab-noise-pipe/blob/0ac9e9e53d1df2e7aeb48ee1312ff582953f0c0e/README.md#L15)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-nonce-collision — 27b6677bbcffd8fda8a7a3d9381672bf5c212cbf

Source scan: SCANNED.
- **Ground truth (+)**: [src/crypto/aead.test.ts:26](https://github.com/systemslibrarian/crypto-lab-nonce-collision/blob/27b6677bbcffd8fda8a7a3d9381672bf5c212cbf/src/crypto/aead.test.ts#L26)
- **Independent check (?)**: UNRESOLVED: candidate [src/crypto/gf128.test.ts:2](https://github.com/systemslibrarian/crypto-lab-nonce-collision/blob/27b6677bbcffd8fda8a7a3d9381672bf5c212cbf/src/crypto/gf128.test.ts#L2) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/verdicts.spec.ts:35](https://github.com/systemslibrarian/crypto-lab-nonce-collision/blob/27b6677bbcffd8fda8a7a3d9381672bf5c212cbf/e2e/verdicts.spec.ts#L35)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-nonce-collision/blob/27b6677bbcffd8fda8a7a3d9381672bf5c212cbf/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-nonce-collision/blob/27b6677bbcffd8fda8a7a3d9381672bf5c212cbf/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-nonce-collision/blob/27b6677bbcffd8fda8a7a3d9381672bf5c212cbf/.github/workflows/deploy.yml#L37) `build (needs: —): npx playwright install --with-deps chromium firefox webkit`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-nonce-collision/blob/27b6677bbcffd8fda8a7a3d9381672bf5c212cbf/.github/workflows/deploy.yml#L39) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:30](https://github.com/systemslibrarian/crypto-lab-nonce-collision/blob/27b6677bbcffd8fda8a7a3d9381672bf5c212cbf/playwright.config.ts#L30)), firefox ([playwright.config.ts:35](https://github.com/systemslibrarian/crypto-lab-nonce-collision/blob/27b6677bbcffd8fda8a7a3d9381672bf5c212cbf/playwright.config.ts#L35)), webkit ([playwright.config.ts:36](https://github.com/systemslibrarian/crypto-lab-nonce-collision/blob/27b6677bbcffd8fda8a7a3d9381672bf5c212cbf/playwright.config.ts#L36))
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-nonce-collision/blob/27b6677bbcffd8fda8a7a3d9381672bf5c212cbf/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-nonce-guard — 2071c38457185ca146e2348824c7520f105282e2

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/forbidden.test.ts:17](https://github.com/systemslibrarian/crypto-lab-nonce-guard/blob/2071c38457185ca146e2348824c7520f105282e2/src/forbidden.test.ts#L17) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/gf128.test.ts:2](https://github.com/systemslibrarian/crypto-lab-nonce-guard/blob/2071c38457185ca146e2348824c7520f105282e2/src/gf128.test.ts#L2) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/gf128.test.ts:41](https://github.com/systemslibrarian/crypto-lab-nonce-guard/blob/2071c38457185ca146e2348824c7520f105282e2/src/gf128.test.ts#L41)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-nonce-guard/blob/2071c38457185ca146e2348824c7520f105282e2/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-nonce-guard/blob/2071c38457185ca146e2348824c7520f105282e2/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-nonce-guard/blob/2071c38457185ca146e2348824c7520f105282e2/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-nonce-guard/blob/2071c38457185ca146e2348824c7520f105282e2/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:29](https://github.com/systemslibrarian/crypto-lab-nonce-guard/blob/2071c38457185ca146e2348824c7520f105282e2/playwright.config.ts#L29))
- **Limits and guidance (+)**: [README.md:15](https://github.com/systemslibrarian/crypto-lab-nonce-guard/blob/2071c38457185ca146e2348824c7520f105282e2/README.md#L15)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-nonce-lattice — 979716174e4bf634c61fce15069bd70f808359d6

Source scan: SCANNED.
- **Ground truth (0)**: Self-generated fixture at [e2e/attack.spec.ts:308](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/blob/979716174e4bf634c61fce15069bd70f808359d6/e2e/attack.spec.ts#L308); no published fixture established.
- **Independent check (0)**: No qualifying check established in the inspected source; [README.md:1](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/blob/979716174e4bf634c61fce15069bd70f808359d6/README.md#L1).
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [tests/ecdsa.test.ts:34](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/blob/979716174e4bf634c61fce15069bd70f808359d6/tests/ecdsa.test.ts#L34)
- **Deploy gate (+)**: [.github/workflows/deploy-pages.yml:45](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/blob/979716174e4bf634c61fce15069bd70f808359d6/.github/workflows/deploy-pages.yml#L45) `build-test (needs: —): npm test`; [.github/workflows/deploy-pages.yml:47](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/blob/979716174e4bf634c61fce15069bd70f808359d6/.github/workflows/deploy-pages.yml#L47) `build-test (needs: —): npm run build`; [.github/workflows/deploy-pages.yml:49](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/blob/979716174e4bf634c61fce15069bd70f808359d6/.github/workflows/deploy-pages.yml#L49) `build-test (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy-pages.yml:51](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/blob/979716174e4bf634c61fce15069bd70f808359d6/.github/workflows/deploy-pages.yml#L51) `build-test (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/blob/979716174e4bf634c61fce15069bd70f808359d6/playwright.config.ts#L19))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:5](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/blob/979716174e4bf634c61fce15069bd70f808359d6/README.md#L5) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ntru-classic — 7d2037cf8d8d82555d6c31c7a7060bb4f2d5a649

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:7](https://github.com/systemslibrarian/crypto-lab-ntru-classic/blob/7d2037cf8d8d82555d6c31c7a7060bb4f2d5a649/e2e/claims.spec.ts#L7) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [tests/inverse.test.ts:46](https://github.com/systemslibrarian/crypto-lab-ntru-classic/blob/7d2037cf8d8d82555d6c31c7a7060bb4f2d5a649/tests/inverse.test.ts#L46)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-ntru-classic/blob/7d2037cf8d8d82555d6c31c7a7060bb4f2d5a649/.github/workflows/deploy.yml#L37) `build (needs: —): npm test`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-ntru-classic/blob/7d2037cf8d8d82555d6c31c7a7060bb4f2d5a649/.github/workflows/deploy.yml#L43) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-ntru-classic/blob/7d2037cf8d8d82555d6c31c7a7060bb4f2d5a649/.github/workflows/deploy.yml#L46) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:49](https://github.com/systemslibrarian/crypto-lab-ntru-classic/blob/7d2037cf8d8d82555d6c31c7a7060bb4f2d5a649/.github/workflows/deploy.yml#L49) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:27](https://github.com/systemslibrarian/crypto-lab-ntru-classic/blob/7d2037cf8d8d82555d6c31c7a7060bb4f2d5a649/playwright.config.ts#L27))
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-ntru-classic/blob/7d2037cf8d8d82555d6c31c7a7060bb4f2d5a649/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-oblivious-shelf — 031b78797781d0c179b15c8599df80a95e2c251f

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:313](https://github.com/systemslibrarian/crypto-lab-oblivious-shelf/blob/031b78797781d0c179b15c8599df80a95e2c251f/e2e/claims.spec.ts#L313)
- **Negative test (+)**: [src/pir.test.ts:66](https://github.com/systemslibrarian/crypto-lab-oblivious-shelf/blob/031b78797781d0c179b15c8599df80a95e2c251f/src/pir.test.ts#L66)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-oblivious-shelf/blob/031b78797781d0c179b15c8599df80a95e2c251f/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-oblivious-shelf/blob/031b78797781d0c179b15c8599df80a95e2c251f/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-oblivious-shelf/blob/031b78797781d0c179b15c8599df80a95e2c251f/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-oblivious-shelf/blob/031b78797781d0c179b15c8599df80a95e2c251f/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-oblivious-shelf/blob/031b78797781d0c179b15c8599df80a95e2c251f/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:12](https://github.com/systemslibrarian/crypto-lab-oblivious-shelf/blob/031b78797781d0c179b15c8599df80a95e2c251f/README.md#L12)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-opaque-gate — 744d8e00f296e65cf1370c92fc6a2018b0c6e538

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [tests/test-vectors.test.ts:2](https://github.com/systemslibrarian/crypto-lab-opaque-gate/blob/744d8e00f296e65cf1370c92fc6a2018b0c6e538/tests/test-vectors.test.ts#L2) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [tests/test-vectors.test.ts:16](https://github.com/systemslibrarian/crypto-lab-opaque-gate/blob/744d8e00f296e65cf1370c92fc6a2018b0c6e538/tests/test-vectors.test.ts#L16) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [tests/verify.test.ts:121](https://github.com/systemslibrarian/crypto-lab-opaque-gate/blob/744d8e00f296e65cf1370c92fc6a2018b0c6e538/tests/verify.test.ts#L121)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-opaque-gate/blob/744d8e00f296e65cf1370c92fc6a2018b0c6e538/.github/workflows/deploy.yml#L36) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-opaque-gate/blob/744d8e00f296e65cf1370c92fc6a2018b0c6e538/.github/workflows/deploy.yml#L39) `build (needs: —): npm test`; [.github/workflows/deploy.yml:42](https://github.com/systemslibrarian/crypto-lab-opaque-gate/blob/744d8e00f296e65cf1370c92fc6a2018b0c6e538/.github/workflows/deploy.yml#L42) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-opaque-gate/blob/744d8e00f296e65cf1370c92fc6a2018b0c6e538/.github/workflows/deploy.yml#L45) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:5](https://github.com/systemslibrarian/crypto-lab-opaque-gate/blob/744d8e00f296e65cf1370c92fc6a2018b0c6e538/README.md#L5) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-oram-vault — 8452868518b71db7681ec07baf069c4257fa6c1f

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:406](https://github.com/systemslibrarian/crypto-lab-oram-vault/blob/8452868518b71db7681ec07baf069c4257fa6c1f/e2e/claims.spec.ts#L406)
- **Negative test (+)**: [tests/oram.test.ts:48](https://github.com/systemslibrarian/crypto-lab-oram-vault/blob/8452868518b71db7681ec07baf069c4257fa6c1f/tests/oram.test.ts#L48)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-oram-vault/blob/8452868518b71db7681ec07baf069c4257fa6c1f/.github/workflows/deploy.yml#L32) `verify (needs: —): npm test`; [.github/workflows/deploy.yml:44](https://github.com/systemslibrarian/crypto-lab-oram-vault/blob/8452868518b71db7681ec07baf069c4257fa6c1f/.github/workflows/deploy.yml#L44) `build (needs: verify): npm run build`; [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-oram-vault/blob/8452868518b71db7681ec07baf069c4257fa6c1f/.github/workflows/deploy.yml#L46) `build (needs: verify): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:48](https://github.com/systemslibrarian/crypto-lab-oram-vault/blob/8452868518b71db7681ec07baf069c4257fa6c1f/.github/workflows/deploy.yml#L48) `build (needs: verify): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-oram-vault/blob/8452868518b71db7681ec07baf069c4257fa6c1f/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:20](https://github.com/systemslibrarian/crypto-lab-oram-vault/blob/8452868518b71db7681ec07baf069c4257fa6c1f/README.md#L20)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-order-leak — aa1885268bc4ab2900c9c3a5068c5adb4df0c8fa

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/ppe/dte.test.ts:34](https://github.com/systemslibrarian/crypto-lab-order-leak/blob/aa1885268bc4ab2900c9c3a5068c5adb4df0c8fa/src/ppe/dte.test.ts#L34) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:116](https://github.com/systemslibrarian/crypto-lab-order-leak/blob/aa1885268bc4ab2900c9c3a5068c5adb4df0c8fa/e2e/claims.spec.ts#L116)
- **Negative test (+)**: [e2e/claims.spec.ts:3](https://github.com/systemslibrarian/crypto-lab-order-leak/blob/aa1885268bc4ab2900c9c3a5068c5adb4df0c8fa/e2e/claims.spec.ts#L3)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-order-leak/blob/aa1885268bc4ab2900c9c3a5068c5adb4df0c8fa/.github/workflows/deploy.yml#L31) `verdict-coverage (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:52](https://github.com/systemslibrarian/crypto-lab-order-leak/blob/aa1885268bc4ab2900c9c3a5068c5adb4df0c8fa/.github/workflows/deploy.yml#L52) `verdict-coverage (needs: —): npm run test:verdicts`; [.github/workflows/deploy.yml:28](https://github.com/systemslibrarian/crypto-lab-order-leak/blob/aa1885268bc4ab2900c9c3a5068c5adb4df0c8fa/.github/workflows/deploy.yml#L28) `build (needs: —): npm test`; [.github/workflows/deploy.yml:29](https://github.com/systemslibrarian/crypto-lab-order-leak/blob/aa1885268bc4ab2900c9c3a5068c5adb4df0c8fa/.github/workflows/deploy.yml#L29) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-order-leak/blob/aa1885268bc4ab2900c9c3a5068c5adb4df0c8fa/.github/workflows/deploy.yml#L31) `build (needs: —): npx playwright install --with-deps chromium`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-order-leak/blob/aa1885268bc4ab2900c9c3a5068c5adb4df0c8fa/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ot-gate — f62ef729e6bdfdb2f492906c86dbc19fe4488536

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: candidate [src/ot.test.ts:2](https://github.com/systemslibrarian/crypto-lab-ot-gate/blob/f62ef729e6bdfdb2f492906c86dbc19fe4488536/src/ot.test.ts#L2) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:158](https://github.com/systemslibrarian/crypto-lab-ot-gate/blob/f62ef729e6bdfdb2f492906c86dbc19fe4488536/e2e/claims.spec.ts#L158)
- **Negative test (+)**: [src/ot.test.ts:53](https://github.com/systemslibrarian/crypto-lab-ot-gate/blob/f62ef729e6bdfdb2f492906c86dbc19fe4488536/src/ot.test.ts#L53)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-ot-gate/blob/f62ef729e6bdfdb2f492906c86dbc19fe4488536/.github/workflows/pages.yml#L29) `build (needs: —): npm test`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-ot-gate/blob/f62ef729e6bdfdb2f492906c86dbc19fe4488536/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-ot-gate/blob/f62ef729e6bdfdb2f492906c86dbc19fe4488536/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-ot-gate/blob/f62ef729e6bdfdb2f492906c86dbc19fe4488536/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:28](https://github.com/systemslibrarian/crypto-lab-ot-gate/blob/f62ef729e6bdfdb2f492906c86dbc19fe4488536/playwright.config.ts#L28))
- **Limits and guidance (+)**: [README.md:11](https://github.com/systemslibrarian/crypto-lab-ot-gate/blob/f62ef729e6bdfdb2f492906c86dbc19fe4488536/README.md#L11)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-otp-vault — fc5b39ab859115ecc2814d963f40f6f71e7c76c3

Source scan: SCANNED.
- **Ground truth (0)**: No qualifying check established in the inspected source; [README.md:1](https://github.com/systemslibrarian/crypto-lab-otp-vault/blob/fc5b39ab859115ecc2814d963f40f6f71e7c76c3/README.md#L1).
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:698](https://github.com/systemslibrarian/crypto-lab-otp-vault/blob/fc5b39ab859115ecc2814d963f40f6f71e7c76c3/e2e/claims.spec.ts#L698)
- **Negative test (+)**: [src/otp/challenges.test.ts:18](https://github.com/systemslibrarian/crypto-lab-otp-vault/blob/fc5b39ab859115ecc2814d963f40f6f71e7c76c3/src/otp/challenges.test.ts#L18)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-otp-vault/blob/fc5b39ab859115ecc2814d963f40f6f71e7c76c3/.github/workflows/deploy.yml#L34) `build (needs: —): npm test`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-otp-vault/blob/fc5b39ab859115ecc2814d963f40f6f71e7c76c3/.github/workflows/deploy.yml#L35) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-otp-vault/blob/fc5b39ab859115ecc2814d963f40f6f71e7c76c3/.github/workflows/deploy.yml#L37) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-otp-vault/blob/fc5b39ab859115ecc2814d963f40f6f71e7c76c3/.github/workflows/deploy.yml#L39) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:21](https://github.com/systemslibrarian/crypto-lab-otp-vault/blob/fc5b39ab859115ecc2814d963f40f6f71e7c76c3/playwright.config.ts#L21))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-otp-vault/blob/fc5b39ab859115ecc2814d963f40f6f71e7c76c3/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-padding-oracle — 83cc80dc7c198f0d02beeafd72508b74e4f72c43

Source scan: SCANNED.
- **Ground truth (0)**: No qualifying check established in the inspected source; [README.md:1](https://github.com/systemslibrarian/crypto-lab-padding-oracle/blob/83cc80dc7c198f0d02beeafd72508b74e4f72c43/README.md#L1).
- **Independent check (0)**: No qualifying check established in the inspected source; [README.md:1](https://github.com/systemslibrarian/crypto-lab-padding-oracle/blob/83cc80dc7c198f0d02beeafd72508b74e4f72c43/README.md#L1).
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/attack.spec.ts:94](https://github.com/systemslibrarian/crypto-lab-padding-oracle/blob/83cc80dc7c198f0d02beeafd72508b74e4f72c43/e2e/attack.spec.ts#L94)
- **Deploy gate (+)**: [.github/workflows/pages.yml:41](https://github.com/systemslibrarian/crypto-lab-padding-oracle/blob/83cc80dc7c198f0d02beeafd72508b74e4f72c43/.github/workflows/pages.yml#L41) `build (needs: —): npm test`; [.github/workflows/pages.yml:44](https://github.com/systemslibrarian/crypto-lab-padding-oracle/blob/83cc80dc7c198f0d02beeafd72508b74e4f72c43/.github/workflows/pages.yml#L44) `build (needs: —): npm run build`; [.github/workflows/pages.yml:47](https://github.com/systemslibrarian/crypto-lab-padding-oracle/blob/83cc80dc7c198f0d02beeafd72508b74e4f72c43/.github/workflows/pages.yml#L47) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:50](https://github.com/systemslibrarian/crypto-lab-padding-oracle/blob/83cc80dc7c198f0d02beeafd72508b74e4f72c43/.github/workflows/pages.yml#L50) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-padding-oracle/blob/83cc80dc7c198f0d02beeafd72508b74e4f72c43/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-padding-oracle/blob/83cc80dc7c198f0d02beeafd72508b74e4f72c43/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-paillier-gate — 3c46939e75323dab93e75b3647acf43eee33a2ec

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [tests/paillier.test.ts:24](https://github.com/systemslibrarian/crypto-lab-paillier-gate/blob/3c46939e75323dab93e75b3647acf43eee33a2ec/tests/paillier.test.ts#L24)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-paillier-gate/blob/3c46939e75323dab93e75b3647acf43eee33a2ec/.github/workflows/deploy.yml#L36) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-paillier-gate/blob/3c46939e75323dab93e75b3647acf43eee33a2ec/.github/workflows/deploy.yml#L39) `build (needs: —): npm test`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-paillier-gate/blob/3c46939e75323dab93e75b3647acf43eee33a2ec/.github/workflows/deploy.yml#L45) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:48](https://github.com/systemslibrarian/crypto-lab-paillier-gate/blob/3c46939e75323dab93e75b3647acf43eee33a2ec/.github/workflows/deploy.yml#L48) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:28](https://github.com/systemslibrarian/crypto-lab-paillier-gate/blob/3c46939e75323dab93e75b3647acf43eee33a2ec/playwright.config.ts#L28))
- **Limits and guidance (+)**: [README.md:10](https://github.com/systemslibrarian/crypto-lab-paillier-gate/blob/3c46939e75323dab93e75b3647acf43eee33a2ec/README.md#L10)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-pairing-gate — 447134e0eb5a31e5b87e04184793a6060c607f35

Source scan: SCANNED.
- **Ground truth (0)**: No qualifying check established in the inspected source; [README.md:1](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/README.md#L1).
- **Independent check (0)**: No qualifying check established in the inspected source; [README.md:1](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/README.md#L1).
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:26](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/e2e/claims.spec.ts#L26)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:11](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/README.md#L11)
- **Zero-test check (0)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/.github/workflows/pages.yml#L29); optional npm command succeeds with no test script at [package.json:5](https://github.com/systemslibrarian/crypto-lab-pairing-gate/blob/447134e0eb5a31e5b87e04184793a6060c607f35/package.json#L5); browser test:a11y still runs.

#### crypto-lab-pake-gate — cebf0a80f3e641dfd7b39688dce074201d21cc14

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [tests/srp.vectors.test.ts:16](https://github.com/systemslibrarian/crypto-lab-pake-gate/blob/cebf0a80f3e641dfd7b39688dce074201d21cc14/tests/srp.vectors.test.ts#L16) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [tests/cpace.test.ts:6](https://github.com/systemslibrarian/crypto-lab-pake-gate/blob/cebf0a80f3e641dfd7b39688dce074201d21cc14/tests/cpace.test.ts#L6) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:485](https://github.com/systemslibrarian/crypto-lab-pake-gate/blob/cebf0a80f3e641dfd7b39688dce074201d21cc14/e2e/claims.spec.ts#L485)
- **Negative test (+)**: [tests/edge-cases.test.ts:17](https://github.com/systemslibrarian/crypto-lab-pake-gate/blob/cebf0a80f3e641dfd7b39688dce074201d21cc14/tests/edge-cases.test.ts#L17)
- **Deploy gate (?)**: UNRESOLVED: candidate [.github/workflows/browser-gate.yml:52](https://github.com/systemslibrarian/crypto-lab-pake-gate/blob/cebf0a80f3e641dfd7b39688dce074201d21cc14/.github/workflows/browser-gate.yml#L52) requires provenance/execution review.
- **Limits and guidance (+)**: [README.md:15](https://github.com/systemslibrarian/crypto-lab-pake-gate/blob/cebf0a80f3e641dfd7b39688dce074201d21cc14/README.md#L15)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-patron-shield — 72ee34945097f1dad4d34f387a3dcc99c83a2014

Source scan: SCANNED.
- **Ground truth (0)**: Self-generated fixture at [src/pir.test.ts:152](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/72ee34945097f1dad4d34f387a3dcc99c83a2014/src/pir.test.ts#L152); no published fixture established.
- **Independent check (0)**: No qualifying check established in the inspected source; [README.md:1](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/72ee34945097f1dad4d34f387a3dcc99c83a2014/README.md#L1).
- **Displayed claim (+)**: [e2e/claims.spec.ts:656](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/72ee34945097f1dad4d34f387a3dcc99c83a2014/e2e/claims.spec.ts#L656)
- **Negative test (+)**: [src/pir.test.ts:125](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/72ee34945097f1dad4d34f387a3dcc99c83a2014/src/pir.test.ts#L125)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/72ee34945097f1dad4d34f387a3dcc99c83a2014/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/72ee34945097f1dad4d34f387a3dcc99c83a2014/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/72ee34945097f1dad4d34f387a3dcc99c83a2014/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/72ee34945097f1dad4d34f387a3dcc99c83a2014/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/72ee34945097f1dad4d34f387a3dcc99c83a2014/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:9](https://github.com/systemslibrarian/crypto-lab-patron-shield/blob/72ee34945097f1dad4d34f387a3dcc99c83a2014/README.md#L9)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-phantom-vault — 737a53531291c24539ffcc6578df2051d6c5c2cb

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/crypto/hmac-drbg.test.ts:24](https://github.com/systemslibrarian/crypto-lab-phantom-vault/blob/737a53531291c24539ffcc6578df2051d6c5c2cb/src/crypto/hmac-drbg.test.ts#L24) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:141](https://github.com/systemslibrarian/crypto-lab-phantom-vault/blob/737a53531291c24539ffcc6578df2051d6c5c2cb/e2e/claims.spec.ts#L141)
- **Negative test (+)**: [e2e/claims.spec.ts:109](https://github.com/systemslibrarian/crypto-lab-phantom-vault/blob/737a53531291c24539ffcc6578df2051d6c5c2cb/e2e/claims.spec.ts#L109)
- **Deploy gate (+)**: [.github/workflows/pages.yml:60](https://github.com/systemslibrarian/crypto-lab-phantom-vault/blob/737a53531291c24539ffcc6578df2051d6c5c2cb/.github/workflows/pages.yml#L60) `build (needs: —): npm test`; [.github/workflows/pages.yml:62](https://github.com/systemslibrarian/crypto-lab-phantom-vault/blob/737a53531291c24539ffcc6578df2051d6c5c2cb/.github/workflows/pages.yml#L62) `build (needs: —): npm run build`; [.github/workflows/pages.yml:64](https://github.com/systemslibrarian/crypto-lab-phantom-vault/blob/737a53531291c24539ffcc6578df2051d6c5c2cb/.github/workflows/pages.yml#L64) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:70](https://github.com/systemslibrarian/crypto-lab-phantom-vault/blob/737a53531291c24539ffcc6578df2051d6c5c2cb/.github/workflows/pages.yml#L70) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-phantom-vault/blob/737a53531291c24539ffcc6578df2051d6c5c2cb/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:11](https://github.com/systemslibrarian/crypto-lab-phantom-vault/blob/737a53531291c24539ffcc6578df2051d6c5c2cb/README.md#L11)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-pki-chain — fe738f912b15c946e54bbeb88e6d3cf91d8e51fe

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:183](https://github.com/systemslibrarian/crypto-lab-pki-chain/blob/fe738f912b15c946e54bbeb88e6d3cf91d8e51fe/e2e/claims.spec.ts#L183) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:226](https://github.com/systemslibrarian/crypto-lab-pki-chain/blob/fe738f912b15c946e54bbeb88e6d3cf91d8e51fe/e2e/claims.spec.ts#L226)
- **Negative test (+)**: [src/ct.test.ts:37](https://github.com/systemslibrarian/crypto-lab-pki-chain/blob/fe738f912b15c946e54bbeb88e6d3cf91d8e51fe/src/ct.test.ts#L37)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-pki-chain/blob/fe738f912b15c946e54bbeb88e6d3cf91d8e51fe/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-pki-chain/blob/fe738f912b15c946e54bbeb88e6d3cf91d8e51fe/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-pki-chain/blob/fe738f912b15c946e54bbeb88e6d3cf91d8e51fe/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-pki-chain/blob/fe738f912b15c946e54bbeb88e6d3cf91d8e51fe/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-pki-chain/blob/fe738f912b15c946e54bbeb88e6d3cf91d8e51fe/playwright.config.ts#L18))
- **Limits and guidance (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-poly1305-mac — 5c9c1f0a293731aa9f6dd1fa8710fc141edd209f

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/mac.test.ts:29](https://github.com/systemslibrarian/crypto-lab-poly1305-mac/blob/5c9c1f0a293731aa9f6dd1fa8710fc141edd209f/src/mac.test.ts#L29) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:320](https://github.com/systemslibrarian/crypto-lab-poly1305-mac/blob/5c9c1f0a293731aa9f6dd1fa8710fc141edd209f/e2e/claims.spec.ts#L320)
- **Negative test (+)**: [src/mac.test.ts:54](https://github.com/systemslibrarian/crypto-lab-poly1305-mac/blob/5c9c1f0a293731aa9f6dd1fa8710fc141edd209f/src/mac.test.ts#L54)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-poly1305-mac/blob/5c9c1f0a293731aa9f6dd1fa8710fc141edd209f/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-poly1305-mac/blob/5c9c1f0a293731aa9f6dd1fa8710fc141edd209f/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-poly1305-mac/blob/5c9c1f0a293731aa9f6dd1fa8710fc141edd209f/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-poly1305-mac/blob/5c9c1f0a293731aa9f6dd1fa8710fc141edd209f/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:28](https://github.com/systemslibrarian/crypto-lab-poly1305-mac/blob/5c9c1f0a293731aa9f6dd1fa8710fc141edd209f/playwright.config.ts#L28))
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-poly1305-mac/blob/5c9c1f0a293731aa9f6dd1fa8710fc141edd209f/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-polynomial-forge — acaed7786ac8a6ea89945f576b2f3bdf38861093

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/crypto/kat.test.ts:2](https://github.com/systemslibrarian/crypto-lab-polynomial-forge/blob/acaed7786ac8a6ea89945f576b2f3bdf38861093/src/crypto/kat.test.ts#L2) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/crypto/fri.test.ts:3](https://github.com/systemslibrarian/crypto-lab-polynomial-forge/blob/acaed7786ac8a6ea89945f576b2f3bdf38861093/src/crypto/fri.test.ts#L3) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:357](https://github.com/systemslibrarian/crypto-lab-polynomial-forge/blob/acaed7786ac8a6ea89945f576b2f3bdf38861093/e2e/claims.spec.ts#L357)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:49](https://github.com/systemslibrarian/crypto-lab-polynomial-forge/blob/acaed7786ac8a6ea89945f576b2f3bdf38861093/.github/workflows/deploy.yml#L49) `build (needs: —): npm test`; [.github/workflows/deploy.yml:52](https://github.com/systemslibrarian/crypto-lab-polynomial-forge/blob/acaed7786ac8a6ea89945f576b2f3bdf38861093/.github/workflows/deploy.yml#L52) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:70](https://github.com/systemslibrarian/crypto-lab-polynomial-forge/blob/acaed7786ac8a6ea89945f576b2f3bdf38861093/.github/workflows/deploy.yml#L70) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:75](https://github.com/systemslibrarian/crypto-lab-polynomial-forge/blob/acaed7786ac8a6ea89945f576b2f3bdf38861093/.github/workflows/deploy.yml#L75) `build (needs: —): require('playwright-core').chromium.launch()`; [.github/workflows/deploy.yml:87](https://github.com/systemslibrarian/crypto-lab-polynomial-forge/blob/acaed7786ac8a6ea89945f576b2f3bdf38861093/.github/workflows/deploy.yml#L87) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:11](https://github.com/systemslibrarian/crypto-lab-polynomial-forge/blob/acaed7786ac8a6ea89945f576b2f3bdf38861093/README.md#L11)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-power-trace — fb1ea2bea78357c7a2389329a280b533c22a9e32

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/aes/aes.test.ts:6](https://github.com/systemslibrarian/crypto-lab-power-trace/blob/fb1ea2bea78357c7a2389329a280b533c22a9e32/src/aes/aes.test.ts#L6) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/attack/cpa.test.ts:39](https://github.com/systemslibrarian/crypto-lab-power-trace/blob/fb1ea2bea78357c7a2389329a280b533c22a9e32/src/attack/cpa.test.ts#L39)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:28](https://github.com/systemslibrarian/crypto-lab-power-trace/blob/fb1ea2bea78357c7a2389329a280b533c22a9e32/.github/workflows/deploy.yml#L28) `build (needs: —): npm test`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-power-trace/blob/fb1ea2bea78357c7a2389329a280b533c22a9e32/.github/workflows/deploy.yml#L30) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-power-trace/blob/fb1ea2bea78357c7a2389329a280b533c22a9e32/.github/workflows/deploy.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-power-trace/blob/fb1ea2bea78357c7a2389329a280b533c22a9e32/.github/workflows/deploy.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:23](https://github.com/systemslibrarian/crypto-lab-power-trace/blob/fb1ea2bea78357c7a2389329a280b533c22a9e32/playwright.config.ts#L23))
- **Limits and guidance (+)**: [README.md:10](https://github.com/systemslibrarian/crypto-lab-power-trace/blob/fb1ea2bea78357c7a2389329a280b533c22a9e32/README.md#L10)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-pq-families — 776c4f5d2c2cd2d214f20a2e0cebc1c2835f257a

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/demo.spec.ts:292](https://github.com/systemslibrarian/crypto-lab-pq-families/blob/776c4f5d2c2cd2d214f20a2e0cebc1c2835f257a/e2e/demo.spec.ts#L292) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/crypto.test.ts:134](https://github.com/systemslibrarian/crypto-lab-pq-families/blob/776c4f5d2c2cd2d214f20a2e0cebc1c2835f257a/src/crypto.test.ts#L134)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:29](https://github.com/systemslibrarian/crypto-lab-pq-families/blob/776c4f5d2c2cd2d214f20a2e0cebc1c2835f257a/.github/workflows/deploy.yml#L29) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-pq-families/blob/776c4f5d2c2cd2d214f20a2e0cebc1c2835f257a/.github/workflows/deploy.yml#L31) `build (needs: —): npm test`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-pq-families/blob/776c4f5d2c2cd2d214f20a2e0cebc1c2835f257a/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-pq-families/blob/776c4f5d2c2cd2d214f20a2e0cebc1c2835f257a/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:26](https://github.com/systemslibrarian/crypto-lab-pq-families/blob/776c4f5d2c2cd2d214f20a2e0cebc1c2835f257a/playwright.config.ts#L26))
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-pq-families/blob/776c4f5d2c2cd2d214f20a2e0cebc1c2835f257a/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-pq-rotation — df8f7e6edd7491181314be281135217220e5d497

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:24](https://github.com/systemslibrarian/crypto-lab-pq-rotation/blob/df8f7e6edd7491181314be281135217220e5d497/e2e/claims.spec.ts#L24) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [test/hybrid-cert.test.ts:2](https://github.com/systemslibrarian/crypto-lab-pq-rotation/blob/df8f7e6edd7491181314be281135217220e5d497/test/hybrid-cert.test.ts#L2) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:620](https://github.com/systemslibrarian/crypto-lab-pq-rotation/blob/df8f7e6edd7491181314be281135217220e5d497/e2e/claims.spec.ts#L620)
- **Negative test (+)**: [test/hybrid-cert.test.ts:98](https://github.com/systemslibrarian/crypto-lab-pq-rotation/blob/df8f7e6edd7491181314be281135217220e5d497/test/hybrid-cert.test.ts#L98)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-pq-rotation/blob/df8f7e6edd7491181314be281135217220e5d497/.github/workflows/deploy.yml#L37) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-pq-rotation/blob/df8f7e6edd7491181314be281135217220e5d497/.github/workflows/deploy.yml#L40) `build (needs: —): npm test`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-pq-rotation/blob/df8f7e6edd7491181314be281135217220e5d497/.github/workflows/deploy.yml#L43) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-pq-rotation/blob/df8f7e6edd7491181314be281135217220e5d497/.github/workflows/deploy.yml#L46) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-pq-rotation/blob/df8f7e6edd7491181314be281135217220e5d497/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:35](https://github.com/systemslibrarian/crypto-lab-pq-rotation/blob/df8f7e6edd7491181314be281135217220e5d497/README.md#L35)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-pq-tls-handshake — 5d96c84ba99ca041016821f5164a0c7c49601922

Source scan: SCANNED.
- **Ground truth (+)**: [scripts/phase-checks.ts:108](https://github.com/systemslibrarian/crypto-lab-pq-tls-handshake/blob/5d96c84ba99ca041016821f5164a0c7c49601922/scripts/phase-checks.ts#L108)
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Deploy gate (+)**: [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-pq-tls-handshake/blob/5d96c84ba99ca041016821f5164a0c7c49601922/.github/workflows/deploy.yml#L40) `build (needs: —): npm test`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-pq-tls-handshake/blob/5d96c84ba99ca041016821f5164a0c7c49601922/.github/workflows/deploy.yml#L43) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-pq-tls-handshake/blob/5d96c84ba99ca041016821f5164a0c7c49601922/.github/workflows/deploy.yml#L46) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:49](https://github.com/systemslibrarian/crypto-lab-pq-tls-handshake/blob/5d96c84ba99ca041016821f5164a0c7c49601922/.github/workflows/deploy.yml#L49) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-pq-tls-handshake/blob/5d96c84ba99ca041016821f5164a0c7c49601922/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:50](https://github.com/systemslibrarian/crypto-lab-pq-tls-handshake/blob/5d96c84ba99ca041016821f5164a0c7c49601922/README.md#L50)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-pqxdh-wire — f0bb824c9c3734fe8bdb2b9aeec46fc188b10942

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/pqxdh/handshake.test.ts:69](https://github.com/systemslibrarian/crypto-lab-pqxdh-wire/blob/f0bb824c9c3734fe8bdb2b9aeec46fc188b10942/src/pqxdh/handshake.test.ts#L69) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:1](https://github.com/systemslibrarian/crypto-lab-pqxdh-wire/blob/f0bb824c9c3734fe8bdb2b9aeec46fc188b10942/e2e/claims.spec.ts#L1) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:8](https://github.com/systemslibrarian/crypto-lab-pqxdh-wire/blob/f0bb824c9c3734fe8bdb2b9aeec46fc188b10942/e2e/claims.spec.ts#L8)
- **Negative test (+)**: [e2e/claims.spec.ts:40](https://github.com/systemslibrarian/crypto-lab-pqxdh-wire/blob/f0bb824c9c3734fe8bdb2b9aeec46fc188b10942/e2e/claims.spec.ts#L40)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:47](https://github.com/systemslibrarian/crypto-lab-pqxdh-wire/blob/f0bb824c9c3734fe8bdb2b9aeec46fc188b10942/.github/workflows/deploy.yml#L47) `verdict-gate (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:54](https://github.com/systemslibrarian/crypto-lab-pqxdh-wire/blob/f0bb824c9c3734fe8bdb2b9aeec46fc188b10942/.github/workflows/deploy.yml#L54) `verdict-gate (needs: —): npm run test:verdicts`; [.github/workflows/deploy.yml:78](https://github.com/systemslibrarian/crypto-lab-pqxdh-wire/blob/f0bb824c9c3734fe8bdb2b9aeec46fc188b10942/.github/workflows/deploy.yml#L78) `build (needs: —): npm run test:coverage`; [.github/workflows/deploy.yml:80](https://github.com/systemslibrarian/crypto-lab-pqxdh-wire/blob/f0bb824c9c3734fe8bdb2b9aeec46fc188b10942/.github/workflows/deploy.yml#L80) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:47](https://github.com/systemslibrarian/crypto-lab-pqxdh-wire/blob/f0bb824c9c3734fe8bdb2b9aeec46fc188b10942/.github/workflows/deploy.yml#L47) `build (needs: —): npx playwright install --with-deps chromium`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:9](https://github.com/systemslibrarian/crypto-lab-pqxdh-wire/blob/f0bb824c9c3734fe8bdb2b9aeec46fc188b10942/README.md#L9)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-privacy-pass — f3beebad34e09b7967392474369d25f8e29e9a63

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/pass/rfc9578.test.ts:3](https://github.com/systemslibrarian/crypto-lab-privacy-pass/blob/f3beebad34e09b7967392474369d25f8e29e9a63/src/pass/rfc9578.test.ts#L3) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/oprf/voprf.test.ts:1](https://github.com/systemslibrarian/crypto-lab-privacy-pass/blob/f3beebad34e09b7967392474369d25f8e29e9a63/src/oprf/voprf.test.ts#L1) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:66](https://github.com/systemslibrarian/crypto-lab-privacy-pass/blob/f3beebad34e09b7967392474369d25f8e29e9a63/e2e/claims.spec.ts#L66)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-privacy-pass/blob/f3beebad34e09b7967392474369d25f8e29e9a63/.github/workflows/deploy.yml#L33) `verdict-coverage (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:57](https://github.com/systemslibrarian/crypto-lab-privacy-pass/blob/f3beebad34e09b7967392474369d25f8e29e9a63/.github/workflows/deploy.yml#L57) `verdict-coverage (needs: —): npx playwright test e2e/verdicts.spec.ts`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-privacy-pass/blob/f3beebad34e09b7967392474369d25f8e29e9a63/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-privacy-pass/blob/f3beebad34e09b7967392474369d25f8e29e9a63/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-privacy-pass/blob/f3beebad34e09b7967392474369d25f8e29e9a63/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:5](https://github.com/systemslibrarian/crypto-lab-privacy-pass/blob/f3beebad34e09b7967392474369d25f8e29e9a63/README.md#L5) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-proof-tally — f85c1910fadac9ebf508e51803c148780b24b697

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:42](https://github.com/systemslibrarian/crypto-lab-proof-tally/blob/f85c1910fadac9ebf508e51803c148780b24b697/e2e/claims.spec.ts#L42) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:122](https://github.com/systemslibrarian/crypto-lab-proof-tally/blob/f85c1910fadac9ebf508e51803c148780b24b697/e2e/claims.spec.ts#L122)
- **Negative test (+)**: [e2e/claims.spec.ts:31](https://github.com/systemslibrarian/crypto-lab-proof-tally/blob/f85c1910fadac9ebf508e51803c148780b24b697/e2e/claims.spec.ts#L31)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-proof-tally/blob/f85c1910fadac9ebf508e51803c148780b24b697/.github/workflows/deploy.yml#L35) `verdict-coverage (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:64](https://github.com/systemslibrarian/crypto-lab-proof-tally/blob/f85c1910fadac9ebf508e51803c148780b24b697/.github/workflows/deploy.yml#L64) `verdict-coverage (needs: —): npm run test:verdicts`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-proof-tally/blob/f85c1910fadac9ebf508e51803c148780b24b697/.github/workflows/deploy.yml#L31) `build (needs: —): npm test`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-proof-tally/blob/f85c1910fadac9ebf508e51803c148780b24b697/.github/workflows/deploy.yml#L33) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-proof-tally/blob/f85c1910fadac9ebf508e51803c148780b24b697/.github/workflows/deploy.yml#L35) `build (needs: —): npx playwright install --with-deps chromium`; engines: chromium ([playwright.config.ts:16](https://github.com/systemslibrarian/crypto-lab-proof-tally/blob/f85c1910fadac9ebf508e51803c148780b24b697/playwright.config.ts#L16))
- **Limits and guidance (+)**: [README.md:16](https://github.com/systemslibrarian/crypto-lab-proof-tally/blob/f85c1910fadac9ebf508e51803c148780b24b697/README.md#L16)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-protocol-checker — 4ce2029d8fb2ee96f858c1380ebc596b396c6890

Source scan: SCANNED.
- **Ground truth (+)**: [src/symbolic/search.test.ts:7](https://github.com/systemslibrarian/crypto-lab-protocol-checker/blob/4ce2029d8fb2ee96f858c1380ebc596b396c6890/src/symbolic/search.test.ts#L7)
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:203](https://github.com/systemslibrarian/crypto-lab-protocol-checker/blob/4ce2029d8fb2ee96f858c1380ebc596b396c6890/e2e/claims.spec.ts#L203)
- **Negative test (+)**: [e2e/claims.spec.ts:441](https://github.com/systemslibrarian/crypto-lab-protocol-checker/blob/4ce2029d8fb2ee96f858c1380ebc596b396c6890/e2e/claims.spec.ts#L441)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-protocol-checker/blob/4ce2029d8fb2ee96f858c1380ebc596b396c6890/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-protocol-checker/blob/4ce2029d8fb2ee96f858c1380ebc596b396c6890/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-protocol-checker/blob/4ce2029d8fb2ee96f858c1380ebc596b396c6890/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-protocol-checker/blob/4ce2029d8fb2ee96f858c1380ebc596b396c6890/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-protocol-checker/blob/4ce2029d8fb2ee96f858c1380ebc596b396c6890/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-protocol-compose — dbfb3faed91a90bd4d484088507ac2c3c0b726c8

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:527](https://github.com/systemslibrarian/crypto-lab-protocol-compose/blob/dbfb3faed91a90bd4d484088507ac2c3c0b726c8/e2e/claims.spec.ts#L527)
- **Negative test (+)**: [test/compose.test.ts:47](https://github.com/systemslibrarian/crypto-lab-protocol-compose/blob/dbfb3faed91a90bd4d484088507ac2c3c0b726c8/test/compose.test.ts#L47)
- **Deploy gate (+)**: [.github/workflows/pages.yml:25](https://github.com/systemslibrarian/crypto-lab-protocol-compose/blob/dbfb3faed91a90bd4d484088507ac2c3c0b726c8/.github/workflows/pages.yml#L25) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:26](https://github.com/systemslibrarian/crypto-lab-protocol-compose/blob/dbfb3faed91a90bd4d484088507ac2c3c0b726c8/.github/workflows/pages.yml#L26) `build (needs: —): npm run build`; [.github/workflows/pages.yml:28](https://github.com/systemslibrarian/crypto-lab-protocol-compose/blob/dbfb3faed91a90bd4d484088507ac2c3c0b726c8/.github/workflows/pages.yml#L28) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-protocol-compose/blob/dbfb3faed91a90bd4d484088507ac2c3c0b726c8/.github/workflows/pages.yml#L30) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-protocol-compose/blob/dbfb3faed91a90bd4d484088507ac2c3c0b726c8/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:14](https://github.com/systemslibrarian/crypto-lab-protocol-compose/blob/dbfb3faed91a90bd4d484088507ac2c3c0b726c8/README.md#L14)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-psi-gate — 0c9132b25bd513411bc4698abf0f5f5e9dcaeabf

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:871](https://github.com/systemslibrarian/crypto-lab-psi-gate/blob/0c9132b25bd513411bc4698abf0f5f5e9dcaeabf/e2e/claims.spec.ts#L871) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [tests/psi.test.ts:102](https://github.com/systemslibrarian/crypto-lab-psi-gate/blob/0c9132b25bd513411bc4698abf0f5f5e9dcaeabf/tests/psi.test.ts#L102)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-psi-gate/blob/0c9132b25bd513411bc4698abf0f5f5e9dcaeabf/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-psi-gate/blob/0c9132b25bd513411bc4698abf0f5f5e9dcaeabf/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-psi-gate/blob/0c9132b25bd513411bc4698abf0f5f5e9dcaeabf/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:23](https://github.com/systemslibrarian/crypto-lab-psi-gate/blob/0c9132b25bd513411bc4698abf0f5f5e9dcaeabf/playwright.config.ts#L23))
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-psi-gate/blob/0c9132b25bd513411bc4698abf0f5f5e9dcaeabf/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-quantum-entropy — 58b690d875abea61f59a9cd89b8d53ea2d487e33

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/entropy/healthtests.test.ts:15](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/blob/58b690d875abea61f59a9cd89b8d53ea2d487e33/src/entropy/healthtests.test.ts#L15) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:456](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/blob/58b690d875abea61f59a9cd89b8d53ea2d487e33/e2e/claims.spec.ts#L456)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/blob/58b690d875abea61f59a9cd89b8d53ea2d487e33/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/blob/58b690d875abea61f59a9cd89b8d53ea2d487e33/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/blob/58b690d875abea61f59a9cd89b8d53ea2d487e33/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/blob/58b690d875abea61f59a9cd89b8d53ea2d487e33/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:15](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/blob/58b690d875abea61f59a9cd89b8d53ea2d487e33/README.md#L15)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-quantum-vault-kpqc — c0c067dba8dc942924fe754949ad4ceb26ec49a6

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [crates/qv-core/tests/test_vectors.rs:5](https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc/blob/c0c067dba8dc942924fe754949ad4ceb26ec49a6/crates/qv-core/tests/test_vectors.rs#L5) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [web-demo/e2e/vault.spec.ts:127](https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc/blob/c0c067dba8dc942924fe754949ad4ceb26ec49a6/web-demo/e2e/vault.spec.ts#L127)
- **Deploy gate (+)**: [.github/workflows/deploy-pages.yml:73](https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc/blob/c0c067dba8dc942924fe754949ad4ceb26ec49a6/.github/workflows/deploy-pages.yml#L73) `build (needs: —): npm run test`; [.github/workflows/deploy-pages.yml:77](https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc/blob/c0c067dba8dc942924fe754949ad4ceb26ec49a6/.github/workflows/deploy-pages.yml#L77) `build (needs: —): npm run build`; [.github/workflows/deploy-pages.yml:82](https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc/blob/c0c067dba8dc942924fe754949ad4ceb26ec49a6/.github/workflows/deploy-pages.yml#L82) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy-pages.yml:91](https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc/blob/c0c067dba8dc942924fe754949ad4ceb26ec49a6/.github/workflows/deploy-pages.yml#L91) `build (needs: —): npm run test:e2e`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:24](https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc/blob/c0c067dba8dc942924fe754949ad4ceb26ec49a6/README.md#L24)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ratchet-wire — 503c2a1f4cd568287d406c81ed7217a5f9ffc0c9

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [ratchet-wire/src/__tests__/primitives.test.ts:4](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/blob/503c2a1f4cd568287d406c81ed7217a5f9ffc0c9/ratchet-wire/src/__tests__/primitives.test.ts#L4) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [ratchet-wire/src/__tests__/app.integration.test.ts:17](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/blob/503c2a1f4cd568287d406c81ed7217a5f9ffc0c9/ratchet-wire/src/__tests__/app.integration.test.ts#L17) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [ratchet-wire/e2e/app.spec.ts:167](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/blob/503c2a1f4cd568287d406c81ed7217a5f9ffc0c9/ratchet-wire/e2e/app.spec.ts#L167)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/blob/503c2a1f4cd568287d406c81ed7217a5f9ffc0c9/.github/workflows/deploy.yml#L37) `build (needs: —): npm run test:run`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/blob/503c2a1f4cd568287d406c81ed7217a5f9ffc0c9/.github/workflows/deploy.yml#L41) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/blob/503c2a1f4cd568287d406c81ed7217a5f9ffc0c9/.github/workflows/deploy.yml#L45) `build (needs: —): npx playwright install --with-deps`; [.github/workflows/deploy.yml:49](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/blob/503c2a1f4cd568287d406c81ed7217a5f9ffc0c9/.github/workflows/deploy.yml#L49) `build (needs: —): npm run test:e2e`; engines: chromium ([ratchet-wire/playwright.config.ts:43](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/blob/503c2a1f4cd568287d406c81ed7217a5f9ffc0c9/ratchet-wire/playwright.config.ts#L43)), firefox ([ratchet-wire/playwright.config.ts:44](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/blob/503c2a1f4cd568287d406c81ed7217a5f9ffc0c9/ratchet-wire/playwright.config.ts#L44)), webkit ([ratchet-wire/playwright.config.ts:45](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/blob/503c2a1f4cd568287d406c81ed7217a5f9ffc0c9/ratchet-wire/playwright.config.ts#L45))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/blob/503c2a1f4cd568287d406c81ed7217a5f9ffc0c9/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-rekey-relay — abd49d8b1513636cbbb49779aa95df1f007265a0

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [test/kat.test.ts:11](https://github.com/systemslibrarian/crypto-lab-rekey-relay/blob/abd49d8b1513636cbbb49779aa95df1f007265a0/test/kat.test.ts#L11) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [test/hardening.test.ts:2](https://github.com/systemslibrarian/crypto-lab-rekey-relay/blob/abd49d8b1513636cbbb49779aa95df1f007265a0/test/hardening.test.ts#L2) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [test/group.test.ts:33](https://github.com/systemslibrarian/crypto-lab-rekey-relay/blob/abd49d8b1513636cbbb49779aa95df1f007265a0/test/group.test.ts#L33)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-rekey-relay/blob/abd49d8b1513636cbbb49779aa95df1f007265a0/.github/workflows/deploy.yml#L43) `build (needs: —): npm test`; [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-rekey-relay/blob/abd49d8b1513636cbbb49779aa95df1f007265a0/.github/workflows/deploy.yml#L46) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:50](https://github.com/systemslibrarian/crypto-lab-rekey-relay/blob/abd49d8b1513636cbbb49779aa95df1f007265a0/.github/workflows/deploy.yml#L50) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:53](https://github.com/systemslibrarian/crypto-lab-rekey-relay/blob/abd49d8b1513636cbbb49779aa95df1f007265a0/.github/workflows/deploy.yml#L53) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:56](https://github.com/systemslibrarian/crypto-lab-rekey-relay/blob/abd49d8b1513636cbbb49779aa95df1f007265a0/.github/workflows/deploy.yml#L56) `build (needs: —): npm run test:e2e`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:43](https://github.com/systemslibrarian/crypto-lab-rekey-relay/blob/abd49d8b1513636cbbb49779aa95df1f007265a0/README.md#L43)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-reshare-circle — 09f63b7009834a63e1496e0aa28625b1b7b3bf3d

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/reuse/reuse.test.ts:5](https://github.com/systemslibrarian/crypto-lab-reshare-circle/blob/09f63b7009834a63e1496e0aa28625b1b7b3bf3d/src/reuse/reuse.test.ts#L5) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:500](https://github.com/systemslibrarian/crypto-lab-reshare-circle/blob/09f63b7009834a63e1496e0aa28625b1b7b3bf3d/e2e/claims.spec.ts#L500)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-reshare-circle/blob/09f63b7009834a63e1496e0aa28625b1b7b3bf3d/.github/workflows/deploy.yml#L32) `build (needs: —): npm test`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-reshare-circle/blob/09f63b7009834a63e1496e0aa28625b1b7b3bf3d/.github/workflows/deploy.yml#L33) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-reshare-circle/blob/09f63b7009834a63e1496e0aa28625b1b7b3bf3d/.github/workflows/deploy.yml#L36) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-reshare-circle/blob/09f63b7009834a63e1496e0aa28625b1b7b3bf3d/.github/workflows/deploy.yml#L39) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-reshare-circle/blob/09f63b7009834a63e1496e0aa28625b1b7b3bf3d/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:23](https://github.com/systemslibrarian/crypto-lab-reshare-circle/blob/09f63b7009834a63e1496e0aa28625b1b7b3bf3d/README.md#L23)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ring-sign — a9938758c5ee4f638d3454683908e4742e0d56c7

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/ring.test.ts:261](https://github.com/systemslibrarian/crypto-lab-ring-sign/blob/a9938758c5ee4f638d3454683908e4742e0d56c7/src/ring.test.ts#L261) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/ring.test.ts:2](https://github.com/systemslibrarian/crypto-lab-ring-sign/blob/a9938758c5ee4f638d3454683908e4742e0d56c7/src/ring.test.ts#L2) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:172](https://github.com/systemslibrarian/crypto-lab-ring-sign/blob/a9938758c5ee4f638d3454683908e4742e0d56c7/e2e/claims.spec.ts#L172)
- **Negative test (+)**: [src/group.test.ts:28](https://github.com/systemslibrarian/crypto-lab-ring-sign/blob/a9938758c5ee4f638d3454683908e4742e0d56c7/src/group.test.ts#L28)
- **Deploy gate (+)**: [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-ring-sign/blob/a9938758c5ee4f638d3454683908e4742e0d56c7/.github/workflows/pages.yml#L29) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-ring-sign/blob/a9938758c5ee4f638d3454683908e4742e0d56c7/.github/workflows/pages.yml#L30) `build (needs: —): npm run build`; [.github/workflows/pages.yml:32](https://github.com/systemslibrarian/crypto-lab-ring-sign/blob/a9938758c5ee4f638d3454683908e4742e0d56c7/.github/workflows/pages.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:34](https://github.com/systemslibrarian/crypto-lab-ring-sign/blob/a9938758c5ee4f638d3454683908e4742e0d56c7/.github/workflows/pages.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-ring-sign/blob/a9938758c5ee4f638d3454683908e4742e0d56c7/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:11](https://github.com/systemslibrarian/crypto-lab-ring-sign/blob/a9938758c5ee4f638d3454683908e4742e0d56c7/README.md#L11)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-rsa-educational — 37ca24b0425a5ef953ae036702b8e03fa9464bce

Source scan: SCANNED.
- **Ground truth (0)**: Self-generated fixture at [src/rsa/bigint-math.test.ts:5](https://github.com/systemslibrarian/crypto-lab-rsa-educational/blob/37ca24b0425a5ef953ae036702b8e03fa9464bce/src/rsa/bigint-math.test.ts#L5); no published fixture established.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:160](https://github.com/systemslibrarian/crypto-lab-rsa-educational/blob/37ca24b0425a5ef953ae036702b8e03fa9464bce/e2e/claims.spec.ts#L160)
- **Negative test (+)**: [e2e/claims.spec.ts:111](https://github.com/systemslibrarian/crypto-lab-rsa-educational/blob/37ca24b0425a5ef953ae036702b8e03fa9464bce/e2e/claims.spec.ts#L111)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-rsa-educational/blob/37ca24b0425a5ef953ae036702b8e03fa9464bce/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-rsa-educational/blob/37ca24b0425a5ef953ae036702b8e03fa9464bce/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-rsa-educational/blob/37ca24b0425a5ef953ae036702b8e03fa9464bce/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-rsa-educational/blob/37ca24b0425a5ef953ae036702b8e03fa9464bce/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:1](https://github.com/systemslibrarian/crypto-lab-rsa-educational/blob/37ca24b0425a5ef953ae036702b8e03fa9464bce/README.md#L1) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-rsa-forge — 9d0b997115a252a21f85f808cffc030c316c1c2f

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [test/attacks.test.ts:100](https://github.com/systemslibrarian/crypto-lab-rsa-forge/blob/9d0b997115a252a21f85f808cffc030c316c1c2f/test/attacks.test.ts#L100) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [test/oaep-pss.test.ts:8](https://github.com/systemslibrarian/crypto-lab-rsa-forge/blob/9d0b997115a252a21f85f808cffc030c316c1c2f/test/oaep-pss.test.ts#L8) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:181](https://github.com/systemslibrarian/crypto-lab-rsa-forge/blob/9d0b997115a252a21f85f808cffc030c316c1c2f/e2e/claims.spec.ts#L181)
- **Negative test (+)**: [test/oaep-pss.test.ts:100](https://github.com/systemslibrarian/crypto-lab-rsa-forge/blob/9d0b997115a252a21f85f808cffc030c316c1c2f/test/oaep-pss.test.ts#L100)
- **Deploy gate (+)**: [.github/workflows/pages.yml:43](https://github.com/systemslibrarian/crypto-lab-rsa-forge/blob/9d0b997115a252a21f85f808cffc030c316c1c2f/.github/workflows/pages.yml#L43) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:46](https://github.com/systemslibrarian/crypto-lab-rsa-forge/blob/9d0b997115a252a21f85f808cffc030c316c1c2f/.github/workflows/pages.yml#L46) `build (needs: —): npm run build`; [.github/workflows/pages.yml:49](https://github.com/systemslibrarian/crypto-lab-rsa-forge/blob/9d0b997115a252a21f85f808cffc030c316c1c2f/.github/workflows/pages.yml#L49) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:52](https://github.com/systemslibrarian/crypto-lab-rsa-forge/blob/9d0b997115a252a21f85f808cffc030c316c1c2f/.github/workflows/pages.yml#L52) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-rsa-forge/blob/9d0b997115a252a21f85f808cffc030c316c1c2f/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-rsa-forge/blob/9d0b997115a252a21f85f808cffc030c316c1c2f/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-salamander — aab11fe0e1e10544bc4a5b92a819d33181643c99

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/crypto/gf128.test.ts:23](https://github.com/systemslibrarian/crypto-lab-salamander/blob/aab11fe0e1e10544bc4a5b92a819d33181643c99/src/crypto/gf128.test.ts#L23) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/forge.spec.ts:27](https://github.com/systemslibrarian/crypto-lab-salamander/blob/aab11fe0e1e10544bc4a5b92a819d33181643c99/e2e/forge.spec.ts#L27)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:29](https://github.com/systemslibrarian/crypto-lab-salamander/blob/aab11fe0e1e10544bc4a5b92a819d33181643c99/.github/workflows/deploy.yml#L29) `build (needs: —): npm test`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-salamander/blob/aab11fe0e1e10544bc4a5b92a819d33181643c99/.github/workflows/deploy.yml#L30) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-salamander/blob/aab11fe0e1e10544bc4a5b92a819d33181643c99/.github/workflows/deploy.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-salamander/blob/aab11fe0e1e10544bc4a5b92a819d33181643c99/.github/workflows/deploy.yml#L34) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-salamander/blob/aab11fe0e1e10544bc4a5b92a819d33181643c99/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-schnorr-forge — 5a643271335b2fe968b48a60fba28a79c3106e23

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/flows.spec.ts:40](https://github.com/systemslibrarian/crypto-lab-schnorr-forge/blob/5a643271335b2fe968b48a60fba28a79c3106e23/e2e/flows.spec.ts#L40) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/schnorr/bip340.test.ts:2](https://github.com/systemslibrarian/crypto-lab-schnorr-forge/blob/5a643271335b2fe968b48a60fba28a79c3106e23/src/schnorr/bip340.test.ts#L2) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/flows.spec.ts:20](https://github.com/systemslibrarian/crypto-lab-schnorr-forge/blob/5a643271335b2fe968b48a60fba28a79c3106e23/e2e/flows.spec.ts#L20)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:28](https://github.com/systemslibrarian/crypto-lab-schnorr-forge/blob/5a643271335b2fe968b48a60fba28a79c3106e23/.github/workflows/deploy.yml#L28) `build (needs: —): npm test`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-schnorr-forge/blob/5a643271335b2fe968b48a60fba28a79c3106e23/.github/workflows/deploy.yml#L30) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-schnorr-forge/blob/5a643271335b2fe968b48a60fba28a79c3106e23/.github/workflows/deploy.yml#L32) `build (needs: —): npm run size-budget`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-schnorr-forge/blob/5a643271335b2fe968b48a60fba28a79c3106e23/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-schnorr-forge/blob/5a643271335b2fe968b48a60fba28a79c3106e23/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: firefox ([playwright.config.ts:30](https://github.com/systemslibrarian/crypto-lab-schnorr-forge/blob/5a643271335b2fe968b48a60fba28a79c3106e23/playwright.config.ts#L30))
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-schnorr-forge/blob/5a643271335b2fe968b48a60fba28a79c3106e23/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-scloud-vault — 5a24fee5e7bd5fb2b66c0cd47a09f7993cf092a0

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:10](https://github.com/systemslibrarian/crypto-lab-scloud-vault/blob/5a24fee5e7bd5fb2b66c0cd47a09f7993cf092a0/e2e/claims.spec.ts#L10) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [test/sampling.test.ts:46](https://github.com/systemslibrarian/crypto-lab-scloud-vault/blob/5a24fee5e7bd5fb2b66c0cd47a09f7993cf092a0/test/sampling.test.ts#L46)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-scloud-vault/blob/5a24fee5e7bd5fb2b66c0cd47a09f7993cf092a0/.github/workflows/deploy.yml#L36) `build-and-deploy (needs: —): npm test`; [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-scloud-vault/blob/5a24fee5e7bd5fb2b66c0cd47a09f7993cf092a0/.github/workflows/deploy.yml#L38) `build-and-deploy (needs: —): npm run build`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-scloud-vault/blob/5a24fee5e7bd5fb2b66c0cd47a09f7993cf092a0/.github/workflows/deploy.yml#L41) `build-and-deploy (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:44](https://github.com/systemslibrarian/crypto-lab-scloud-vault/blob/5a24fee5e7bd5fb2b66c0cd47a09f7993cf092a0/.github/workflows/deploy.yml#L44) `build-and-deploy (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-scloud-vault/blob/5a24fee5e7bd5fb2b66c0cd47a09f7993cf092a0/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:11](https://github.com/systemslibrarian/crypto-lab-scloud-vault/blob/5a24fee5e7bd5fb2b66c0cd47a09f7993cf092a0/README.md#L11)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-search-vault — 23afb5d80315cfc22a95f7e03c855435e639de22

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/core/aead.test.ts:7](https://github.com/systemslibrarian/crypto-lab-search-vault/blob/23afb5d80315cfc22a95f7e03c855435e639de22/src/core/aead.test.ts#L7) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/sse/vault.test.ts:103](https://github.com/systemslibrarian/crypto-lab-search-vault/blob/23afb5d80315cfc22a95f7e03c855435e639de22/src/sse/vault.test.ts#L103)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-search-vault/blob/23afb5d80315cfc22a95f7e03c855435e639de22/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-search-vault/blob/23afb5d80315cfc22a95f7e03c855435e639de22/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-search-vault/blob/23afb5d80315cfc22a95f7e03c855435e639de22/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-search-vault/blob/23afb5d80315cfc22a95f7e03c855435e639de22/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-search-vault/blob/23afb5d80315cfc22a95f7e03c855435e639de22/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:35](https://github.com/systemslibrarian/crypto-lab-search-vault/blob/23afb5d80315cfc22a95f7e03c855435e639de22/README.md#L35)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-sector-vault — ba4a5ca451de447bfe658fa106e4d8079ee3a0ae

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:445](https://github.com/systemslibrarian/crypto-lab-sector-vault/blob/ba4a5ca451de447bfe658fa106e4d8079ee3a0ae/e2e/claims.spec.ts#L445) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/crypto/xts.cross.test.ts:1](https://github.com/systemslibrarian/crypto-lab-sector-vault/blob/ba4a5ca451de447bfe658fa106e4d8079ee3a0ae/src/crypto/xts.cross.test.ts#L1) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:378](https://github.com/systemslibrarian/crypto-lab-sector-vault/blob/ba4a5ca451de447bfe658fa106e4d8079ee3a0ae/e2e/claims.spec.ts#L378)
- **Negative test (+)**: [e2e/claims.spec.ts:203](https://github.com/systemslibrarian/crypto-lab-sector-vault/blob/ba4a5ca451de447bfe658fa106e4d8079ee3a0ae/e2e/claims.spec.ts#L203)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:48](https://github.com/systemslibrarian/crypto-lab-sector-vault/blob/ba4a5ca451de447bfe658fa106e4d8079ee3a0ae/.github/workflows/deploy.yml#L48) `build (needs: —): npm test`; [.github/workflows/deploy.yml:51](https://github.com/systemslibrarian/crypto-lab-sector-vault/blob/ba4a5ca451de447bfe658fa106e4d8079ee3a0ae/.github/workflows/deploy.yml#L51) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:57](https://github.com/systemslibrarian/crypto-lab-sector-vault/blob/ba4a5ca451de447bfe658fa106e4d8079ee3a0ae/.github/workflows/deploy.yml#L57) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:60](https://github.com/systemslibrarian/crypto-lab-sector-vault/blob/ba4a5ca451de447bfe658fa106e4d8079ee3a0ae/.github/workflows/deploy.yml#L60) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:63](https://github.com/systemslibrarian/crypto-lab-sector-vault/blob/ba4a5ca451de447bfe658fa106e4d8079ee3a0ae/.github/workflows/deploy.yml#L63) `build (needs: —): npm run test:claims`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:57](https://github.com/systemslibrarian/crypto-lab-sector-vault/blob/ba4a5ca451de447bfe658fa106e4d8079ee3a0ae/README.md#L57)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-shadow-vault — f094b96e6bd798867abbd3d2512476a3618cb010

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [crate/src/lib.rs:9](https://github.com/systemslibrarian/crypto-lab-shadow-vault/blob/f094b96e6bd798867abbd3d2512476a3618cb010/crate/src/lib.rs#L9) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [tests/browser/vault.spec.ts:37](https://github.com/systemslibrarian/crypto-lab-shadow-vault/blob/f094b96e6bd798867abbd3d2512476a3618cb010/tests/browser/vault.spec.ts#L37)
- **Deploy gate (+)**: [.github/workflows/pages.yml:42](https://github.com/systemslibrarian/crypto-lab-shadow-vault/blob/f094b96e6bd798867abbd3d2512476a3618cb010/.github/workflows/pages.yml#L42) `build (needs: —): cargo test --release`; [.github/workflows/pages.yml:50](https://github.com/systemslibrarian/crypto-lab-shadow-vault/blob/f094b96e6bd798867abbd3d2512476a3618cb010/.github/workflows/pages.yml#L50) `build (needs: —): npm run build`; [.github/workflows/pages.yml:54](https://github.com/systemslibrarian/crypto-lab-shadow-vault/blob/f094b96e6bd798867abbd3d2512476a3618cb010/.github/workflows/pages.yml#L54) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:65](https://github.com/systemslibrarian/crypto-lab-shadow-vault/blob/f094b96e6bd798867abbd3d2512476a3618cb010/.github/workflows/pages.yml#L65) `build (needs: —): npm run test:browser`; [.github/workflows/pages.yml:70](https://github.com/systemslibrarian/crypto-lab-shadow-vault/blob/f094b96e6bd798867abbd3d2512476a3618cb010/.github/workflows/pages.yml#L70) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-shadow-vault/blob/f094b96e6bd798867abbd3d2512476a3618cb010/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-shadow-vault/blob/f094b96e6bd798867abbd3d2512476a3618cb010/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-shamir-gate — 2436171fb8b9d7ee062e6e3de034c3a7ea3e36d0

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [demos/shamir-gate/e2e/claims.spec.ts:604](https://github.com/systemslibrarian/crypto-lab-shamir-gate/blob/2436171fb8b9d7ee062e6e3de034c3a7ea3e36d0/demos/shamir-gate/e2e/claims.spec.ts#L604)
- **Negative test (+)**: [demos/shamir-gate/src/crypto.test.ts:61](https://github.com/systemslibrarian/crypto-lab-shamir-gate/blob/2436171fb8b9d7ee062e6e3de034c3a7ea3e36d0/demos/shamir-gate/src/crypto.test.ts#L61)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-shamir-gate/blob/2436171fb8b9d7ee062e6e3de034c3a7ea3e36d0/.github/workflows/deploy.yml#L41) `build (needs: —): npm run test:run`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-shamir-gate/blob/2436171fb8b9d7ee062e6e3de034c3a7ea3e36d0/.github/workflows/deploy.yml#L45) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:49](https://github.com/systemslibrarian/crypto-lab-shamir-gate/blob/2436171fb8b9d7ee062e6e3de034c3a7ea3e36d0/.github/workflows/deploy.yml#L49) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:55](https://github.com/systemslibrarian/crypto-lab-shamir-gate/blob/2436171fb8b9d7ee062e6e3de034c3a7ea3e36d0/.github/workflows/deploy.yml#L55) `build (needs: —): npm run test:a11y`; engines: chromium ([demos/shamir-gate/playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-shamir-gate/blob/2436171fb8b9d7ee062e6e3de034c3a7ea3e36d0/demos/shamir-gate/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:23](https://github.com/systemslibrarian/crypto-lab-shamir-gate/blob/2436171fb8b9d7ee062e6e3de034c3a7ea3e36d0/README.md#L23)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-shamir-vs-frost — a5e5f027e3ef5b509f3fb0202ba331cfaf238315

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/tests/shamir.test.ts:47](https://github.com/systemslibrarian/crypto-lab-shamir-vs-frost/blob/a5e5f027e3ef5b509f3fb0202ba331cfaf238315/src/tests/shamir.test.ts#L47) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/exhibits.spec.ts:29](https://github.com/systemslibrarian/crypto-lab-shamir-vs-frost/blob/a5e5f027e3ef5b509f3fb0202ba331cfaf238315/e2e/exhibits.spec.ts#L29)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:29](https://github.com/systemslibrarian/crypto-lab-shamir-vs-frost/blob/a5e5f027e3ef5b509f3fb0202ba331cfaf238315/.github/workflows/deploy.yml#L29) `build (needs: —): npm test`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-shamir-vs-frost/blob/a5e5f027e3ef5b509f3fb0202ba331cfaf238315/.github/workflows/deploy.yml#L30) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-shamir-vs-frost/blob/a5e5f027e3ef5b509f3fb0202ba331cfaf238315/.github/workflows/deploy.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-shamir-vs-frost/blob/a5e5f027e3ef5b509f3fb0202ba331cfaf238315/.github/workflows/deploy.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:20](https://github.com/systemslibrarian/crypto-lab-shamir-vs-frost/blob/a5e5f027e3ef5b509f3fb0202ba331cfaf238315/playwright.config.ts#L20))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-shamir-vs-frost/blob/a5e5f027e3ef5b509f3fb0202ba331cfaf238315/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-shelf-oracle — 66c860a4a312f4f1fe79011934ff4a53b0610e16

Source scan: SCANNED.
- **Ground truth (+)**: [src/pir/chacha20.test.ts:6](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/66c860a4a312f4f1fe79011934ff4a53b0610e16/src/pir/chacha20.test.ts#L6)
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:626](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/66c860a4a312f4f1fe79011934ff4a53b0610e16/e2e/claims.spec.ts#L626)
- **Negative test (+)**: [e2e/claims.spec.ts:205](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/66c860a4a312f4f1fe79011934ff4a53b0610e16/e2e/claims.spec.ts#L205)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:52](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/66c860a4a312f4f1fe79011934ff4a53b0610e16/.github/workflows/deploy.yml#L52) `build (needs: —): npm test`; [.github/workflows/deploy.yml:55](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/66c860a4a312f4f1fe79011934ff4a53b0610e16/.github/workflows/deploy.yml#L55) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:61](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/66c860a4a312f4f1fe79011934ff4a53b0610e16/.github/workflows/deploy.yml#L61) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:66](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/66c860a4a312f4f1fe79011934ff4a53b0610e16/.github/workflows/deploy.yml#L66) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:37](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/66c860a4a312f4f1fe79011934ff4a53b0610e16/playwright.config.ts#L37))
- **Limits and guidance (+)**: [README.md:27](https://github.com/systemslibrarian/crypto-lab-shelf-oracle/blob/66c860a4a312f4f1fe79011934ff4a53b0610e16/README.md#L27)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-shor — 33d40f79952ee275c6451f5555beba1d095fd8ea

Source scan: SCANNED.
- **Ground truth (0)**: No qualifying check established in the inspected source; [README.md:1](https://github.com/systemslibrarian/crypto-lab-shor/blob/33d40f79952ee275c6451f5555beba1d095fd8ea/README.md#L1).
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [test/shor.test.ts:49](https://github.com/systemslibrarian/crypto-lab-shor/blob/33d40f79952ee275c6451f5555beba1d095fd8ea/test/shor.test.ts#L49)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-shor/blob/33d40f79952ee275c6451f5555beba1d095fd8ea/.github/workflows/deploy.yml#L36) `build (needs: —): npm test`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-shor/blob/33d40f79952ee275c6451f5555beba1d095fd8ea/.github/workflows/deploy.yml#L37) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-shor/blob/33d40f79952ee275c6451f5555beba1d095fd8ea/.github/workflows/deploy.yml#L39) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-shor/blob/33d40f79952ee275c6451f5555beba1d095fd8ea/.github/workflows/deploy.yml#L41) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-shor/blob/33d40f79952ee275c6451f5555beba1d095fd8ea/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:24](https://github.com/systemslibrarian/crypto-lab-shor/blob/33d40f79952ee275c6451f5555beba1d095fd8ea/README.md#L24)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-signed-bytes — 6da21366a24e341b1b39c8d73fab78a661ca134a

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/crypto/ed25519.test.ts:5](https://github.com/systemslibrarian/crypto-lab-signed-bytes/blob/6da21366a24e341b1b39c8d73fab78a661ca134a/src/crypto/ed25519.test.ts#L5) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/behavior.spec.ts:14](https://github.com/systemslibrarian/crypto-lab-signed-bytes/blob/6da21366a24e341b1b39c8d73fab78a661ca134a/e2e/behavior.spec.ts#L14)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-signed-bytes/blob/6da21366a24e341b1b39c8d73fab78a661ca134a/.github/workflows/deploy.yml#L32) `build (needs: —): npm test`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-signed-bytes/blob/6da21366a24e341b1b39c8d73fab78a661ca134a/.github/workflows/deploy.yml#L33) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-signed-bytes/blob/6da21366a24e341b1b39c8d73fab78a661ca134a/.github/workflows/deploy.yml#L36) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-signed-bytes/blob/6da21366a24e341b1b39c8d73fab78a661ca134a/.github/workflows/deploy.yml#L39) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:9](https://github.com/systemslibrarian/crypto-lab-signed-bytes/blob/6da21366a24e341b1b39c8d73fab78a661ca134a/README.md#L9)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-silent-tally — 14e5c0d540be889d414498e74d8f61b951ef639e

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src-ts/field.test.ts:17](https://github.com/systemslibrarian/crypto-lab-silent-tally/blob/14e5c0d540be889d414498e74d8f61b951ef639e/src-ts/field.test.ts#L17) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src-ts/field.test.ts:79](https://github.com/systemslibrarian/crypto-lab-silent-tally/blob/14e5c0d540be889d414498e74d8f61b951ef639e/src-ts/field.test.ts#L79)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-silent-tally/blob/14e5c0d540be889d414498e74d8f61b951ef639e/.github/workflows/deploy.yml#L38) `build (needs: test): wasm-pack build --target web --out-dir pkg`; [.github/workflows/deploy.yml:50](https://github.com/systemslibrarian/crypto-lab-silent-tally/blob/14e5c0d540be889d414498e74d8f61b951ef639e/.github/workflows/deploy.yml#L50) `build (needs: test): npx vite build`; [.github/workflows/deploy.yml:53](https://github.com/systemslibrarian/crypto-lab-silent-tally/blob/14e5c0d540be889d414498e74d8f61b951ef639e/.github/workflows/deploy.yml#L53) `build (needs: test): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:59](https://github.com/systemslibrarian/crypto-lab-silent-tally/blob/14e5c0d540be889d414498e74d8f61b951ef639e/.github/workflows/deploy.yml#L59) `build (needs: test): npm run test:a11y`; engines: chromium ([playwright.config.ts:20](https://github.com/systemslibrarian/crypto-lab-silent-tally/blob/14e5c0d540be889d414498e74d8f61b951ef639e/playwright.config.ts#L20))
- **Limits and guidance (+)**: [README.md:132](https://github.com/systemslibrarian/crypto-lab-silent-tally/blob/14e5c0d540be889d414498e74d8f61b951ef639e/README.md#L132)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-simon-period — 34ae1f083434d5753e244fbfb5cb3c9a6a307f15

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:63](https://github.com/systemslibrarian/crypto-lab-simon-period/blob/34ae1f083434d5753e244fbfb5cb3c9a6a307f15/e2e/claims.spec.ts#L63) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:76](https://github.com/systemslibrarian/crypto-lab-simon-period/blob/34ae1f083434d5753e244fbfb5cb3c9a6a307f15/e2e/claims.spec.ts#L76)
- **Negative test (+)**: [e2e/claims.spec.ts:1047](https://github.com/systemslibrarian/crypto-lab-simon-period/blob/34ae1f083434d5753e244fbfb5cb3c9a6a307f15/e2e/claims.spec.ts#L1047)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-simon-period/blob/34ae1f083434d5753e244fbfb5cb3c9a6a307f15/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-simon-period/blob/34ae1f083434d5753e244fbfb5cb3c9a6a307f15/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-simon-period/blob/34ae1f083434d5753e244fbfb5cb3c9a6a307f15/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-simon-period/blob/34ae1f083434d5753e244fbfb5cb3c9a6a307f15/.github/workflows/deploy.yml#L40) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:23](https://github.com/systemslibrarian/crypto-lab-simon-period/blob/34ae1f083434d5753e244fbfb5cb3c9a6a307f15/playwright.config.ts#L23))
- **Limits and guidance (+)**: [README.md:11](https://github.com/systemslibrarian/crypto-lab-simon-period/blob/34ae1f083434d5753e244fbfb5cb3c9a6a307f15/README.md#L11)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-sleeve-check — 97f753a2326d015ec6170b741af40bc91c9258ee

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:406](https://github.com/systemslibrarian/crypto-lab-sleeve-check/blob/97f753a2326d015ec6170b741af40bc91c9258ee/e2e/claims.spec.ts#L406) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [scripts/mutation.mjs:40](https://github.com/systemslibrarian/crypto-lab-sleeve-check/blob/97f753a2326d015ec6170b741af40bc91c9258ee/scripts/mutation.mjs#L40) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:176](https://github.com/systemslibrarian/crypto-lab-sleeve-check/blob/97f753a2326d015ec6170b741af40bc91c9258ee/e2e/claims.spec.ts#L176)
- **Negative test (+)**: [e2e/claims.spec.ts:191](https://github.com/systemslibrarian/crypto-lab-sleeve-check/blob/97f753a2326d015ec6170b741af40bc91c9258ee/e2e/claims.spec.ts#L191)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:71](https://github.com/systemslibrarian/crypto-lab-sleeve-check/blob/97f753a2326d015ec6170b741af40bc91c9258ee/.github/workflows/deploy.yml#L71) `verdict-coverage (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:132](https://github.com/systemslibrarian/crypto-lab-sleeve-check/blob/97f753a2326d015ec6170b741af40bc91c9258ee/.github/workflows/deploy.yml#L132) `verdict-coverage (needs: —): npm run test:verdicts`; [.github/workflows/deploy.yml:52](https://github.com/systemslibrarian/crypto-lab-sleeve-check/blob/97f753a2326d015ec6170b741af40bc91c9258ee/.github/workflows/deploy.yml#L52) `build (needs: —): npm test`; [.github/workflows/deploy.yml:54](https://github.com/systemslibrarian/crypto-lab-sleeve-check/blob/97f753a2326d015ec6170b741af40bc91c9258ee/.github/workflows/deploy.yml#L54) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:71](https://github.com/systemslibrarian/crypto-lab-sleeve-check/blob/97f753a2326d015ec6170b741af40bc91c9258ee/.github/workflows/deploy.yml#L71) `build (needs: —): npx playwright install --with-deps chromium firefox webkit`; engines: firefox ([playwright.config.ts:60](https://github.com/systemslibrarian/crypto-lab-sleeve-check/blob/97f753a2326d015ec6170b741af40bc91c9258ee/playwright.config.ts#L60))
- **Limits and guidance (+)**: [README.md:35](https://github.com/systemslibrarian/crypto-lab-sleeve-check/blob/97f753a2326d015ec6170b741af40bc91c9258ee/README.md#L35)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-sm2-forge — 4205cbff13acd37373e989aee5863878b33ee647

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:5](https://github.com/systemslibrarian/crypto-lab-sm2-forge/blob/4205cbff13acd37373e989aee5863878b33ee647/e2e/claims.spec.ts#L5) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/sm2/sm2.test.ts:61](https://github.com/systemslibrarian/crypto-lab-sm2-forge/blob/4205cbff13acd37373e989aee5863878b33ee647/src/sm2/sm2.test.ts#L61)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-sm2-forge/blob/4205cbff13acd37373e989aee5863878b33ee647/.github/workflows/deploy.yml#L33) `build (needs: —): npm test`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-sm2-forge/blob/4205cbff13acd37373e989aee5863878b33ee647/.github/workflows/deploy.yml#L35) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-sm2-forge/blob/4205cbff13acd37373e989aee5863878b33ee647/.github/workflows/deploy.yml#L37) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-sm2-forge/blob/4205cbff13acd37373e989aee5863878b33ee647/.github/workflows/deploy.yml#L39) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-sm2-forge/blob/4205cbff13acd37373e989aee5863878b33ee647/.github/workflows/deploy.yml#L41) `build (needs: —): npm run test:e2e`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-sm2-forge/blob/4205cbff13acd37373e989aee5863878b33ee647/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-snark-arena — 9a72143f2668bb590cde2e2296b4460e2e4928bb

Source scan: PARTIAL. Vendored text omitted (see coverage table).
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:106](https://github.com/systemslibrarian/crypto-lab-snark-arena/blob/9a72143f2668bb590cde2e2296b4460e2e4928bb/e2e/claims.spec.ts#L106) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:168](https://github.com/systemslibrarian/crypto-lab-snark-arena/blob/9a72143f2668bb590cde2e2296b4460e2e4928bb/e2e/claims.spec.ts#L168)
- **Negative test (+)**: [e2e/claims.spec.ts:162](https://github.com/systemslibrarian/crypto-lab-snark-arena/blob/9a72143f2668bb590cde2e2296b4460e2e4928bb/e2e/claims.spec.ts#L162)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-snark-arena/blob/9a72143f2668bb590cde2e2296b4460e2e4928bb/.github/workflows/deploy.yml#L30) `build (needs: —): npm test --if-present`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-snark-arena/blob/9a72143f2668bb590cde2e2296b4460e2e4928bb/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-snark-arena/blob/9a72143f2668bb590cde2e2296b4460e2e4928bb/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-snark-arena/blob/9a72143f2668bb590cde2e2296b4460e2e4928bb/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:28](https://github.com/systemslibrarian/crypto-lab-snark-arena/blob/9a72143f2668bb590cde2e2296b4460e2e4928bb/playwright.config.ts#L28))
- **Limits and guidance (+)**: [README.md:14](https://github.com/systemslibrarian/crypto-lab-snark-arena/blob/9a72143f2668bb590cde2e2296b4460e2e4928bb/README.md#L14)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-spake-gate — 0e4590532ac33d22f4a0525f66b31ce8a1366c8d

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/spake/spake2.test.ts:15](https://github.com/systemslibrarian/crypto-lab-spake-gate/blob/0e4590532ac33d22f4a0525f66b31ce8a1366c8d/src/spake/spake2.test.ts#L15) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/attack/offline.test.ts:31](https://github.com/systemslibrarian/crypto-lab-spake-gate/blob/0e4590532ac33d22f4a0525f66b31ce8a1366c8d/src/attack/offline.test.ts#L31)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-spake-gate/blob/0e4590532ac33d22f4a0525f66b31ce8a1366c8d/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-spake-gate/blob/0e4590532ac33d22f4a0525f66b31ce8a1366c8d/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-spake-gate/blob/0e4590532ac33d22f4a0525f66b31ce8a1366c8d/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-spake-gate/blob/0e4590532ac33d22f4a0525f66b31ce8a1366c8d/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:21](https://github.com/systemslibrarian/crypto-lab-spake-gate/blob/0e4590532ac33d22f4a0525f66b31ce8a1366c8d/README.md#L21)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-spdz-forge — 5a401bfec053f7c97aabd4bc1c991598cb5e53d6

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/spdz/kats.test.ts:2](https://github.com/systemslibrarian/crypto-lab-spdz-forge/blob/5a401bfec053f7c97aabd4bc1c991598cb5e53d6/src/spdz/kats.test.ts#L2) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/behavior.spec.ts:52](https://github.com/systemslibrarian/crypto-lab-spdz-forge/blob/5a401bfec053f7c97aabd4bc1c991598cb5e53d6/e2e/behavior.spec.ts#L52)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:28](https://github.com/systemslibrarian/crypto-lab-spdz-forge/blob/5a401bfec053f7c97aabd4bc1c991598cb5e53d6/.github/workflows/deploy.yml#L28) `build (needs: —): npm test`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-spdz-forge/blob/5a401bfec053f7c97aabd4bc1c991598cb5e53d6/.github/workflows/deploy.yml#L30) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-spdz-forge/blob/5a401bfec053f7c97aabd4bc1c991598cb5e53d6/.github/workflows/deploy.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-spdz-forge/blob/5a401bfec053f7c97aabd4bc1c991598cb5e53d6/.github/workflows/deploy.yml#L34) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-spdz-forge/blob/5a401bfec053f7c97aabd4bc1c991598cb5e53d6/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-sphincs-ledger — 92d9ce6a6aee33b014d8cba6b16ef516da5d9e98

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [demos/sphincs-ledger/src/__tests__/fors.test.ts:3](https://github.com/systemslibrarian/crypto-lab-sphincs-ledger/blob/92d9ce6a6aee33b014d8cba6b16ef516da5d9e98/demos/sphincs-ledger/src/__tests__/fors.test.ts#L3) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [demos/sphincs-ledger/src/__tests__/wotsplus.test.ts:56](https://github.com/systemslibrarian/crypto-lab-sphincs-ledger/blob/92d9ce6a6aee33b014d8cba6b16ef516da5d9e98/demos/sphincs-ledger/src/__tests__/wotsplus.test.ts#L56) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [demos/sphincs-ledger/e2e/claims.spec.ts:35](https://github.com/systemslibrarian/crypto-lab-sphincs-ledger/blob/92d9ce6a6aee33b014d8cba6b16ef516da5d9e98/demos/sphincs-ledger/e2e/claims.spec.ts#L35)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-sphincs-ledger/blob/92d9ce6a6aee33b014d8cba6b16ef516da5d9e98/.github/workflows/deploy.yml#L36) `build (needs: —): npm test`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-sphincs-ledger/blob/92d9ce6a6aee33b014d8cba6b16ef516da5d9e98/.github/workflows/deploy.yml#L40) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:44](https://github.com/systemslibrarian/crypto-lab-sphincs-ledger/blob/92d9ce6a6aee33b014d8cba6b16ef516da5d9e98/.github/workflows/deploy.yml#L44) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:48](https://github.com/systemslibrarian/crypto-lab-sphincs-ledger/blob/92d9ce6a6aee33b014d8cba6b16ef516da5d9e98/.github/workflows/deploy.yml#L48) `build (needs: —): npm run test:a11y`; engines: chromium ([demos/sphincs-ledger/playwright.config.ts:29](https://github.com/systemslibrarian/crypto-lab-sphincs-ledger/blob/92d9ce6a6aee33b014d8cba6b16ef516da5d9e98/demos/sphincs-ledger/playwright.config.ts#L29))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-sphincs-ledger/blob/92d9ce6a6aee33b014d8cba6b16ef516da5d9e98/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-sphinx-mix — def321cb1b28308a7c4190583af9e1940b687a5d

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/sphinx/kat/kat.test.ts:30](https://github.com/systemslibrarian/crypto-lab-sphinx-mix/blob/def321cb1b28308a7c4190583af9e1940b687a5d/src/sphinx/kat/kat.test.ts#L30) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/sphinx/kat/kat.test.ts:2](https://github.com/systemslibrarian/crypto-lab-sphinx-mix/blob/def321cb1b28308a7c4190583af9e1940b687a5d/src/sphinx/kat/kat.test.ts#L2) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:358](https://github.com/systemslibrarian/crypto-lab-sphinx-mix/blob/def321cb1b28308a7c4190583af9e1940b687a5d/e2e/claims.spec.ts#L358)
- **Negative test (+)**: [e2e/claims.spec.ts:121](https://github.com/systemslibrarian/crypto-lab-sphinx-mix/blob/def321cb1b28308a7c4190583af9e1940b687a5d/e2e/claims.spec.ts#L121)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:47](https://github.com/systemslibrarian/crypto-lab-sphinx-mix/blob/def321cb1b28308a7c4190583af9e1940b687a5d/.github/workflows/deploy.yml#L47) `build (needs: —): npm test`; [.github/workflows/deploy.yml:50](https://github.com/systemslibrarian/crypto-lab-sphinx-mix/blob/def321cb1b28308a7c4190583af9e1940b687a5d/.github/workflows/deploy.yml#L50) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:55](https://github.com/systemslibrarian/crypto-lab-sphinx-mix/blob/def321cb1b28308a7c4190583af9e1940b687a5d/.github/workflows/deploy.yml#L55) `build (needs: —): npx playwright install chromium`; [.github/workflows/deploy.yml:58](https://github.com/systemslibrarian/crypto-lab-sphinx-mix/blob/def321cb1b28308a7c4190583af9e1940b687a5d/.github/workflows/deploy.yml#L58) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:61](https://github.com/systemslibrarian/crypto-lab-sphinx-mix/blob/def321cb1b28308a7c4190583af9e1940b687a5d/.github/workflows/deploy.yml#L61) `build (needs: —): npm run test:claims`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:76](https://github.com/systemslibrarian/crypto-lab-sphinx-mix/blob/def321cb1b28308a7c4190583af9e1940b687a5d/README.md#L76)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-split-point — ab679b95e79e102952ecda35a85202a8d5987bdf

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:128](https://github.com/systemslibrarian/crypto-lab-split-point/blob/ab679b95e79e102952ecda35a85202a8d5987bdf/e2e/claims.spec.ts#L128) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:77](https://github.com/systemslibrarian/crypto-lab-split-point/blob/ab679b95e79e102952ecda35a85202a8d5987bdf/e2e/claims.spec.ts#L77)
- **Negative test (+)**: [e2e/flows.spec.ts:48](https://github.com/systemslibrarian/crypto-lab-split-point/blob/ab679b95e79e102952ecda35a85202a8d5987bdf/e2e/flows.spec.ts#L48)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-split-point/blob/ab679b95e79e102952ecda35a85202a8d5987bdf/.github/workflows/deploy.yml#L35) `verdict-coverage (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:62](https://github.com/systemslibrarian/crypto-lab-split-point/blob/ab679b95e79e102952ecda35a85202a8d5987bdf/.github/workflows/deploy.yml#L62) `verdict-coverage (needs: —): npm run test:verdicts`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-split-point/blob/ab679b95e79e102952ecda35a85202a8d5987bdf/.github/workflows/deploy.yml#L31) `build (needs: —): npm test`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-split-point/blob/ab679b95e79e102952ecda35a85202a8d5987bdf/.github/workflows/deploy.yml#L33) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-split-point/blob/ab679b95e79e102952ecda35a85202a8d5987bdf/.github/workflows/deploy.yml#L35) `build (needs: —): npx playwright install --with-deps chromium`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:7](https://github.com/systemslibrarian/crypto-lab-split-point/blob/ab679b95e79e102952ecda35a85202a8d5987bdf/README.md#L7) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-ssh-handshake — ff9eead05724c199d94b76ce3186c47a3b9a50fc

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/wire.test.ts:8](https://github.com/systemslibrarian/crypto-lab-ssh-handshake/blob/ff9eead05724c199d94b76ce3186c47a3b9a50fc/src/wire.test.ts#L8) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/policy.test.ts:31](https://github.com/systemslibrarian/crypto-lab-ssh-handshake/blob/ff9eead05724c199d94b76ce3186c47a3b9a50fc/src/policy.test.ts#L31)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:29](https://github.com/systemslibrarian/crypto-lab-ssh-handshake/blob/ff9eead05724c199d94b76ce3186c47a3b9a50fc/.github/workflows/deploy.yml#L29) `build (needs: —): npm test`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-ssh-handshake/blob/ff9eead05724c199d94b76ce3186c47a3b9a50fc/.github/workflows/deploy.yml#L30) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-ssh-handshake/blob/ff9eead05724c199d94b76ce3186c47a3b9a50fc/.github/workflows/deploy.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-ssh-handshake/blob/ff9eead05724c199d94b76ce3186c47a3b9a50fc/.github/workflows/deploy.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:18](https://github.com/systemslibrarian/crypto-lab-ssh-handshake/blob/ff9eead05724c199d94b76ce3186c47a3b9a50fc/playwright.config.ts#L18))
- **Limits and guidance (+)**: [README.md:14](https://github.com/systemslibrarian/crypto-lab-ssh-handshake/blob/ff9eead05724c199d94b76ce3186c47a3b9a50fc/README.md#L14)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-stark-tower — ecaf38b701f8067371edf89b4c6e676bfba3ab6f

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [scripts/selftest.ts:122](https://github.com/systemslibrarian/crypto-lab-stark-tower/blob/ecaf38b701f8067371edf89b4c6e676bfba3ab6f/scripts/selftest.ts#L122) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:416](https://github.com/systemslibrarian/crypto-lab-stark-tower/blob/ecaf38b701f8067371edf89b4c6e676bfba3ab6f/e2e/claims.spec.ts#L416)
- **Negative test (+)**: [e2e/claims.spec.ts:152](https://github.com/systemslibrarian/crypto-lab-stark-tower/blob/ecaf38b701f8067371edf89b4c6e676bfba3ab6f/e2e/claims.spec.ts#L152)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-stark-tower/blob/ecaf38b701f8067371edf89b4c6e676bfba3ab6f/.github/workflows/deploy.yml#L39) `build (needs: —): npm test`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-stark-tower/blob/ecaf38b701f8067371edf89b4c6e676bfba3ab6f/.github/workflows/deploy.yml#L40) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:42](https://github.com/systemslibrarian/crypto-lab-stark-tower/blob/ecaf38b701f8067371edf89b4c6e676bfba3ab6f/.github/workflows/deploy.yml#L42) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:44](https://github.com/systemslibrarian/crypto-lab-stark-tower/blob/ecaf38b701f8067371edf89b4c6e676bfba3ab6f/.github/workflows/deploy.yml#L44) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:20](https://github.com/systemslibrarian/crypto-lab-stark-tower/blob/ecaf38b701f8067371edf89b4c6e676bfba3ab6f/playwright.config.ts#L20))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-stark-tower/blob/ecaf38b701f8067371edf89b4c6e676bfba3ab6f/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-stego-suite — 5dd03b16d2133e2f70ba4369d2cf842e7ac5cac9

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:219](https://github.com/systemslibrarian/crypto-lab-stego-suite/blob/5dd03b16d2133e2f70ba4369d2cf842e7ac5cac9/e2e/claims.spec.ts#L219)
- **Negative test (+)**: [e2e/claims.spec.ts:352](https://github.com/systemslibrarian/crypto-lab-stego-suite/blob/5dd03b16d2133e2f70ba4369d2cf842e7ac5cac9/e2e/claims.spec.ts#L352)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:60](https://github.com/systemslibrarian/crypto-lab-stego-suite/blob/5dd03b16d2133e2f70ba4369d2cf842e7ac5cac9/.github/workflows/deploy.yml#L60) `build (needs: —): npm run test`; [.github/workflows/deploy.yml:50](https://github.com/systemslibrarian/crypto-lab-stego-suite/blob/5dd03b16d2133e2f70ba4369d2cf842e7ac5cac9/.github/workflows/deploy.yml#L50) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:64](https://github.com/systemslibrarian/crypto-lab-stego-suite/blob/5dd03b16d2133e2f70ba4369d2cf842e7ac5cac9/.github/workflows/deploy.yml#L64) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:66](https://github.com/systemslibrarian/crypto-lab-stego-suite/blob/5dd03b16d2133e2f70ba4369d2cf842e7ac5cac9/.github/workflows/deploy.yml#L66) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:27](https://github.com/systemslibrarian/crypto-lab-stego-suite/blob/5dd03b16d2133e2f70ba4369d2cf842e7ac5cac9/playwright.config.ts#L27))
- **Limits and guidance (+)**: [README.md:29](https://github.com/systemslibrarian/crypto-lab-stego-suite/blob/5dd03b16d2133e2f70ba4369d2cf842e7ac5cac9/README.md#L29)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-stream-ward — a5be1dd09f2b135459d168ab60940c85a6624e10

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/stream/kat.test.ts:9](https://github.com/systemslibrarian/crypto-lab-stream-ward/blob/a5be1dd09f2b135459d168ab60940c85a6624e10/src/stream/kat.test.ts#L9) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/stream/kat.test.ts:14](https://github.com/systemslibrarian/crypto-lab-stream-ward/blob/a5be1dd09f2b135459d168ab60940c85a6624e10/src/stream/kat.test.ts#L14) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/pages.spec.ts:11](https://github.com/systemslibrarian/crypto-lab-stream-ward/blob/a5be1dd09f2b135459d168ab60940c85a6624e10/e2e/pages.spec.ts#L11)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-stream-ward/blob/a5be1dd09f2b135459d168ab60940c85a6624e10/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-stream-ward/blob/a5be1dd09f2b135459d168ab60940c85a6624e10/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-stream-ward/blob/a5be1dd09f2b135459d168ab60940c85a6624e10/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-stream-ward/blob/a5be1dd09f2b135459d168ab60940c85a6624e10/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:40](https://github.com/systemslibrarian/crypto-lab-stream-ward/blob/a5be1dd09f2b135459d168ab60940c85a6624e10/README.md#L40)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-syndrome-drain — e496ede66340ebae55020e0c29419c710c8c6cf8

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/render-states.spec.ts:41](https://github.com/systemslibrarian/crypto-lab-syndrome-drain/blob/e496ede66340ebae55020e0c29419c710c8c6cf8/e2e/render-states.spec.ts#L41) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/model.test.ts:69](https://github.com/systemslibrarian/crypto-lab-syndrome-drain/blob/e496ede66340ebae55020e0c29419c710c8c6cf8/src/model.test.ts#L69)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-syndrome-drain/blob/e496ede66340ebae55020e0c29419c710c8c6cf8/.github/workflows/deploy.yml#L38) `build (needs: —): npm test`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-syndrome-drain/blob/e496ede66340ebae55020e0c29419c710c8c6cf8/.github/workflows/deploy.yml#L39) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-syndrome-drain/blob/e496ede66340ebae55020e0c29419c710c8c6cf8/.github/workflows/deploy.yml#L41) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:45](https://github.com/systemslibrarian/crypto-lab-syndrome-drain/blob/e496ede66340ebae55020e0c29419c710c8c6cf8/.github/workflows/deploy.yml#L45) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:23](https://github.com/systemslibrarian/crypto-lab-syndrome-drain/blob/e496ede66340ebae55020e0c29419c710c8c6cf8/playwright.config.ts#L23))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-syndrome-drain/blob/e496ede66340ebae55020e0c29419c710c8c6cf8/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-syndrome-hints — 34b88b39ec647ac5fcc8d16c9b0194cbfd7c9a3c

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/sdp/adversarial.test.ts:108](https://github.com/systemslibrarian/crypto-lab-syndrome-hints/blob/34b88b39ec647ac5fcc8d16c9b0194cbfd7c9a3c/src/sdp/adversarial.test.ts#L108) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-syndrome-hints/blob/34b88b39ec647ac5fcc8d16c9b0194cbfd7c9a3c/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-syndrome-hints/blob/34b88b39ec647ac5fcc8d16c9b0194cbfd7c9a3c/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-syndrome-hints/blob/34b88b39ec647ac5fcc8d16c9b0194cbfd7c9a3c/.github/workflows/deploy.yml#L34) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-syndrome-hints/blob/34b88b39ec647ac5fcc8d16c9b0194cbfd7c9a3c/.github/workflows/deploy.yml#L36) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:24](https://github.com/systemslibrarian/crypto-lab-syndrome-hints/blob/34b88b39ec647ac5fcc8d16c9b0194cbfd7c9a3c/playwright.config.ts#L24))
- **Limits and guidance (+)**: [README.md:9](https://github.com/systemslibrarian/crypto-lab-syndrome-hints/blob/34b88b39ec647ac5fcc8d16c9b0194cbfd7c9a3c/README.md#L9)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-tc26-pair — 1524136e52cb64e57adfcdfa3ccead7f320cf1b7

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:35](https://github.com/systemslibrarian/crypto-lab-tc26-pair/blob/1524136e52cb64e57adfcdfa3ccead7f320cf1b7/e2e/claims.spec.ts#L35) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:72](https://github.com/systemslibrarian/crypto-lab-tc26-pair/blob/1524136e52cb64e57adfcdfa3ccead7f320cf1b7/e2e/claims.spec.ts#L72)
- **Negative test (+)**: [src/fixtures.test.ts:39](https://github.com/systemslibrarian/crypto-lab-tc26-pair/blob/1524136e52cb64e57adfcdfa3ccead7f320cf1b7/src/fixtures.test.ts#L39)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-tc26-pair/blob/1524136e52cb64e57adfcdfa3ccead7f320cf1b7/.github/workflows/deploy.yml#L31) `build (needs: —): npm test`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-tc26-pair/blob/1524136e52cb64e57adfcdfa3ccead7f320cf1b7/.github/workflows/deploy.yml#L33) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-tc26-pair/blob/1524136e52cb64e57adfcdfa3ccead7f320cf1b7/.github/workflows/deploy.yml#L35) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:37](https://github.com/systemslibrarian/crypto-lab-tc26-pair/blob/1524136e52cb64e57adfcdfa3ccead7f320cf1b7/.github/workflows/deploy.yml#L37) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:8](https://github.com/systemslibrarian/crypto-lab-tc26-pair/blob/1524136e52cb64e57adfcdfa3ccead7f320cf1b7/README.md#L8)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-threshold-decrypt — a2c571e281d177c53b962ab40592d990ae1e844f

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/elgamal.test.ts:2](https://github.com/systemslibrarian/crypto-lab-threshold-decrypt/blob/a2c571e281d177c53b962ab40592d990ae1e844f/src/elgamal.test.ts#L2) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/threshold.test.ts:2](https://github.com/systemslibrarian/crypto-lab-threshold-decrypt/blob/a2c571e281d177c53b962ab40592d990ae1e844f/src/threshold.test.ts#L2) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:339](https://github.com/systemslibrarian/crypto-lab-threshold-decrypt/blob/a2c571e281d177c53b962ab40592d990ae1e844f/e2e/claims.spec.ts#L339)
- **Negative test (+)**: [src/threshold.test.ts:68](https://github.com/systemslibrarian/crypto-lab-threshold-decrypt/blob/a2c571e281d177c53b962ab40592d990ae1e844f/src/threshold.test.ts#L68)
- **Deploy gate (+)**: [.github/workflows/pages.yml:25](https://github.com/systemslibrarian/crypto-lab-threshold-decrypt/blob/a2c571e281d177c53b962ab40592d990ae1e844f/.github/workflows/pages.yml#L25) `build (needs: —): npm test --if-present`; [.github/workflows/pages.yml:26](https://github.com/systemslibrarian/crypto-lab-threshold-decrypt/blob/a2c571e281d177c53b962ab40592d990ae1e844f/.github/workflows/pages.yml#L26) `build (needs: —): npm run build`; [.github/workflows/pages.yml:28](https://github.com/systemslibrarian/crypto-lab-threshold-decrypt/blob/a2c571e281d177c53b962ab40592d990ae1e844f/.github/workflows/pages.yml#L28) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:30](https://github.com/systemslibrarian/crypto-lab-threshold-decrypt/blob/a2c571e281d177c53b962ab40592d990ae1e844f/.github/workflows/pages.yml#L30) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-threshold-decrypt/blob/a2c571e281d177c53b962ab40592d990ae1e844f/playwright.config.ts#L22))
- **Limits and guidance (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-threshold-mldsa — cbf0a1b8c086624e6e4db38251c0d978ffc548bf

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/never-combine.spec.ts:110](https://github.com/systemslibrarian/crypto-lab-threshold-mldsa/blob/cbf0a1b8c086624e6e4db38251c0d978ffc548bf/e2e/never-combine.spec.ts#L110) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [test/threshold.test.ts:1](https://github.com/systemslibrarian/crypto-lab-threshold-mldsa/blob/cbf0a1b8c086624e6e4db38251c0d978ffc548bf/test/threshold.test.ts#L1) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [test/threshold.test.ts:73](https://github.com/systemslibrarian/crypto-lab-threshold-mldsa/blob/cbf0a1b8c086624e6e4db38251c0d978ffc548bf/test/threshold.test.ts#L73)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:62](https://github.com/systemslibrarian/crypto-lab-threshold-mldsa/blob/cbf0a1b8c086624e6e4db38251c0d978ffc548bf/.github/workflows/deploy.yml#L62) `build (needs: —): npm test`; [.github/workflows/deploy.yml:65](https://github.com/systemslibrarian/crypto-lab-threshold-mldsa/blob/cbf0a1b8c086624e6e4db38251c0d978ffc548bf/.github/workflows/deploy.yml#L65) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:75](https://github.com/systemslibrarian/crypto-lab-threshold-mldsa/blob/cbf0a1b8c086624e6e4db38251c0d978ffc548bf/.github/workflows/deploy.yml#L75) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:80](https://github.com/systemslibrarian/crypto-lab-threshold-mldsa/blob/cbf0a1b8c086624e6e4db38251c0d978ffc548bf/.github/workflows/deploy.yml#L80) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-threshold-mldsa/blob/cbf0a1b8c086624e6e4db38251c0d978ffc548bf/playwright.config.ts#L19))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:11](https://github.com/systemslibrarian/crypto-lab-threshold-mldsa/blob/cbf0a1b8c086624e6e4db38251c0d978ffc548bf/README.md#L11) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-time-lock-puzzle — fcb981865990380f815403bfb5a883d90b098f16

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/crypto/primes.test.ts:11](https://github.com/systemslibrarian/crypto-lab-time-lock-puzzle/blob/fcb981865990380f815403bfb5a883d90b098f16/src/crypto/primes.test.ts#L11)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-time-lock-puzzle/blob/fcb981865990380f815403bfb5a883d90b098f16/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-time-lock-puzzle/blob/fcb981865990380f815403bfb5a883d90b098f16/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-time-lock-puzzle/blob/fcb981865990380f815403bfb5a883d90b098f16/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-time-lock-puzzle/blob/fcb981865990380f815403bfb5a883d90b098f16/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:26](https://github.com/systemslibrarian/crypto-lab-time-lock-puzzle/blob/fcb981865990380f815403bfb5a883d90b098f16/playwright.config.ts#L26))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:3](https://github.com/systemslibrarian/crypto-lab-time-lock-puzzle/blob/fcb981865990380f815403bfb5a883d90b098f16/README.md#L3) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-time-trust — 2852cac498088a44c2b05278f7b7891df684845d

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/crypto/kats.test.ts:3](https://github.com/systemslibrarian/crypto-lab-time-trust/blob/2852cac498088a44c2b05278f7b7891df684845d/src/crypto/kats.test.ts#L3) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:155](https://github.com/systemslibrarian/crypto-lab-time-trust/blob/2852cac498088a44c2b05278f7b7891df684845d/e2e/claims.spec.ts#L155)
- **Negative test (+)**: [e2e/claims.spec.ts:147](https://github.com/systemslibrarian/crypto-lab-time-trust/blob/2852cac498088a44c2b05278f7b7891df684845d/e2e/claims.spec.ts#L147)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-time-trust/blob/2852cac498088a44c2b05278f7b7891df684845d/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-time-trust/blob/2852cac498088a44c2b05278f7b7891df684845d/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-time-trust/blob/2852cac498088a44c2b05278f7b7891df684845d/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-time-trust/blob/2852cac498088a44c2b05278f7b7891df684845d/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:a11y`; engines: engine unspecified in inspected Playwright configuration
- **Limits and guidance (+)**: [README.md:26](https://github.com/systemslibrarian/crypto-lab-time-trust/blob/2852cac498088a44c2b05278f7b7891df684845d/README.md#L26)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-timing-oracle — 3ca8a5f15d5775dd6b2356a8eaf56a48c23a3dc2

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:90](https://github.com/systemslibrarian/crypto-lab-timing-oracle/blob/3ca8a5f15d5775dd6b2356a8eaf56a48c23a3dc2/e2e/claims.spec.ts#L90) requires provenance/execution review.
- **Displayed claim (+)**: [src/ui.test.ts:126](https://github.com/systemslibrarian/crypto-lab-timing-oracle/blob/3ca8a5f15d5775dd6b2356a8eaf56a48c23a3dc2/src/ui.test.ts#L126)
- **Negative test (+)**: [src/hmac.test.ts:11](https://github.com/systemslibrarian/crypto-lab-timing-oracle/blob/3ca8a5f15d5775dd6b2356a8eaf56a48c23a3dc2/src/hmac.test.ts#L11)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:66](https://github.com/systemslibrarian/crypto-lab-timing-oracle/blob/3ca8a5f15d5775dd6b2356a8eaf56a48c23a3dc2/.github/workflows/deploy.yml#L66) `build (needs: —): npm test`; [.github/workflows/deploy.yml:67](https://github.com/systemslibrarian/crypto-lab-timing-oracle/blob/3ca8a5f15d5775dd6b2356a8eaf56a48c23a3dc2/.github/workflows/deploy.yml#L67) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:69](https://github.com/systemslibrarian/crypto-lab-timing-oracle/blob/3ca8a5f15d5775dd6b2356a8eaf56a48c23a3dc2/.github/workflows/deploy.yml#L69) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:77](https://github.com/systemslibrarian/crypto-lab-timing-oracle/blob/3ca8a5f15d5775dd6b2356a8eaf56a48c23a3dc2/.github/workflows/deploy.yml#L77) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:47](https://github.com/systemslibrarian/crypto-lab-timing-oracle/blob/3ca8a5f15d5775dd6b2356a8eaf56a48c23a3dc2/playwright.config.ts#L47))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-timing-oracle/blob/3ca8a5f15d5775dd6b2356a8eaf56a48c23a3dc2/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-timing-sidechannel — 0351f083727575530f3691a8cfb773e01f74f6e6

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [e2e/claims.spec.ts:230](https://github.com/systemslibrarian/crypto-lab-timing-sidechannel/blob/0351f083727575530f3691a8cfb773e01f74f6e6/e2e/claims.spec.ts#L230)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-timing-sidechannel/blob/0351f083727575530f3691a8cfb773e01f74f6e6/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-timing-sidechannel/blob/0351f083727575530f3691a8cfb773e01f74f6e6/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-timing-sidechannel/blob/0351f083727575530f3691a8cfb773e01f74f6e6/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-timing-sidechannel/blob/0351f083727575530f3691a8cfb773e01f74f6e6/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:27](https://github.com/systemslibrarian/crypto-lab-timing-sidechannel/blob/0351f083727575530f3691a8cfb773e01f74f6e6/playwright.config.ts#L27))
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-timing-sidechannel/blob/0351f083727575530f3691a8cfb773e01f74f6e6/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-tls-handshake — a9785b48a06b8931191942356315d894a3fed5f3

Source scan: SCANNED.
- **Ground truth (+)**: [scripts/phase-checks.ts:69](https://github.com/systemslibrarian/crypto-lab-tls-handshake/blob/a9785b48a06b8931191942356315d894a3fed5f3/scripts/phase-checks.ts#L69)
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:307](https://github.com/systemslibrarian/crypto-lab-tls-handshake/blob/a9785b48a06b8931191942356315d894a3fed5f3/e2e/claims.spec.ts#L307)
- **Negative test (+)**: [e2e/claims.spec.ts:194](https://github.com/systemslibrarian/crypto-lab-tls-handshake/blob/a9785b48a06b8931191942356315d894a3fed5f3/e2e/claims.spec.ts#L194)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-tls-handshake/blob/a9785b48a06b8931191942356315d894a3fed5f3/.github/workflows/deploy.yml#L40) `build (needs: —): npm test`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-tls-handshake/blob/a9785b48a06b8931191942356315d894a3fed5f3/.github/workflows/deploy.yml#L43) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:46](https://github.com/systemslibrarian/crypto-lab-tls-handshake/blob/a9785b48a06b8931191942356315d894a3fed5f3/.github/workflows/deploy.yml#L46) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:49](https://github.com/systemslibrarian/crypto-lab-tls-handshake/blob/a9785b48a06b8931191942356315d894a3fed5f3/.github/workflows/deploy.yml#L49) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-tls-handshake/blob/a9785b48a06b8931191942356315d894a3fed5f3/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:14](https://github.com/systemslibrarian/crypto-lab-tls-handshake/blob/a9785b48a06b8931191942356315d894a3fed5f3/README.md#L14)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-token-tell — 41100d93f8174cfce0b0be71989aebdde4d6b4db

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [verification/claims.mjs:405](https://github.com/systemslibrarian/crypto-lab-token-tell/blob/41100d93f8174cfce0b0be71989aebdde4d6b4db/verification/claims.mjs#L405) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [verification/tools/build-manifest.mjs:17](https://github.com/systemslibrarian/crypto-lab-token-tell/blob/41100d93f8174cfce0b0be71989aebdde4d6b4db/verification/tools/build-manifest.mjs#L17) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:371](https://github.com/systemslibrarian/crypto-lab-token-tell/blob/41100d93f8174cfce0b0be71989aebdde4d6b4db/e2e/claims.spec.ts#L371)
- **Negative test (+)**: [e2e/claims.spec.ts:129](https://github.com/systemslibrarian/crypto-lab-token-tell/blob/41100d93f8174cfce0b0be71989aebdde4d6b4db/e2e/claims.spec.ts#L129)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-token-tell/blob/41100d93f8174cfce0b0be71989aebdde4d6b4db/.github/workflows/deploy.yml#L40) `build (needs: —): npm run test:coverage`; [.github/workflows/deploy.yml:43](https://github.com/systemslibrarian/crypto-lab-token-tell/blob/41100d93f8174cfce0b0be71989aebdde4d6b4db/.github/workflows/deploy.yml#L43) `build (needs: —): node verification/tools/build-manifest.mjs --check`; [.github/workflows/deploy.yml:52](https://github.com/systemslibrarian/crypto-lab-token-tell/blob/41100d93f8174cfce0b0be71989aebdde4d6b4db/.github/workflows/deploy.yml#L52) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:55](https://github.com/systemslibrarian/crypto-lab-token-tell/blob/41100d93f8174cfce0b0be71989aebdde4d6b4db/.github/workflows/deploy.yml#L55) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:58](https://github.com/systemslibrarian/crypto-lab-token-tell/blob/41100d93f8174cfce0b0be71989aebdde4d6b4db/.github/workflows/deploy.yml#L58) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:31](https://github.com/systemslibrarian/crypto-lab-token-tell/blob/41100d93f8174cfce0b0be71989aebdde4d6b4db/playwright.config.ts#L31))
- **Limits and guidance (+)**: [README.md:27](https://github.com/systemslibrarian/crypto-lab-token-tell/blob/41100d93f8174cfce0b0be71989aebdde4d6b4db/README.md#L27)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-traitor-trace — 0ace9eeb2cd932edef1d5170416994613c1f7776

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/core/kats.test.ts:3](https://github.com/systemslibrarian/crypto-lab-traitor-trace/blob/0ace9eeb2cd932edef1d5170416994613c1f7776/src/core/kats.test.ts#L3) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/core/broadcast.test.ts:130](https://github.com/systemslibrarian/crypto-lab-traitor-trace/blob/0ace9eeb2cd932edef1d5170416994613c1f7776/src/core/broadcast.test.ts#L130)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:28](https://github.com/systemslibrarian/crypto-lab-traitor-trace/blob/0ace9eeb2cd932edef1d5170416994613c1f7776/.github/workflows/deploy.yml#L28) `build (needs: —): npm test`; [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-traitor-trace/blob/0ace9eeb2cd932edef1d5170416994613c1f7776/.github/workflows/deploy.yml#L30) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-traitor-trace/blob/0ace9eeb2cd932edef1d5170416994613c1f7776/.github/workflows/deploy.yml#L32) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:34](https://github.com/systemslibrarian/crypto-lab-traitor-trace/blob/0ace9eeb2cd932edef1d5170416994613c1f7776/.github/workflows/deploy.yml#L34) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:24](https://github.com/systemslibrarian/crypto-lab-traitor-trace/blob/0ace9eeb2cd932edef1d5170416994613c1f7776/playwright.config.ts#L24)), firefox ([playwright.config.ts:36](https://github.com/systemslibrarian/crypto-lab-traitor-trace/blob/0ace9eeb2cd932edef1d5170416994613c1f7776/playwright.config.ts#L36)), webkit ([playwright.config.ts:37](https://github.com/systemslibrarian/crypto-lab-traitor-trace/blob/0ace9eeb2cd932edef1d5170416994613c1f7776/playwright.config.ts#L37))
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-traitor-trace/blob/0ace9eeb2cd932edef1d5170416994613c1f7776/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-vdf — c5f2a4b2a0581fcf0c568eea5ba4c65b954928ed

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:144](https://github.com/systemslibrarian/crypto-lab-vdf/blob/c5f2a4b2a0581fcf0c568eea5ba4c65b954928ed/e2e/claims.spec.ts#L144)
- **Negative test (+)**: [e2e/claims.spec.ts:184](https://github.com/systemslibrarian/crypto-lab-vdf/blob/c5f2a4b2a0581fcf0c568eea5ba4c65b954928ed/e2e/claims.spec.ts#L184)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-vdf/blob/c5f2a4b2a0581fcf0c568eea5ba4c65b954928ed/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-vdf/blob/c5f2a4b2a0581fcf0c568eea5ba4c65b954928ed/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-vdf/blob/c5f2a4b2a0581fcf0c568eea5ba4c65b954928ed/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-vdf/blob/c5f2a4b2a0581fcf0c568eea5ba4c65b954928ed/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:40](https://github.com/systemslibrarian/crypto-lab-vdf/blob/c5f2a4b2a0581fcf0c568eea5ba4c65b954928ed/.github/workflows/deploy.yml#L40) `build (needs: —): npm run test:claims`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-vdf/blob/c5f2a4b2a0581fcf0c568eea5ba4c65b954928ed/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:16](https://github.com/systemslibrarian/crypto-lab-vdf/blob/c5f2a4b2a0581fcf0c568eea5ba4c65b954928ed/README.md#L16)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-vigenere-break — 15dfd3a572dc098a42cf878bfba1005f02b05930

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/vigenere/cipher.test.ts:20](https://github.com/systemslibrarian/crypto-lab-vigenere-break/blob/15dfd3a572dc098a42cf878bfba1005f02b05930/src/vigenere/cipher.test.ts#L20) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:326](https://github.com/systemslibrarian/crypto-lab-vigenere-break/blob/15dfd3a572dc098a42cf878bfba1005f02b05930/e2e/claims.spec.ts#L326)
- **Negative test (+)**: [e2e/claims.spec.ts:426](https://github.com/systemslibrarian/crypto-lab-vigenere-break/blob/15dfd3a572dc098a42cf878bfba1005f02b05930/e2e/claims.spec.ts#L426)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:57](https://github.com/systemslibrarian/crypto-lab-vigenere-break/blob/15dfd3a572dc098a42cf878bfba1005f02b05930/.github/workflows/deploy.yml#L57) `build (needs: —): npm test`; [.github/workflows/deploy.yml:58](https://github.com/systemslibrarian/crypto-lab-vigenere-break/blob/15dfd3a572dc098a42cf878bfba1005f02b05930/.github/workflows/deploy.yml#L58) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:60](https://github.com/systemslibrarian/crypto-lab-vigenere-break/blob/15dfd3a572dc098a42cf878bfba1005f02b05930/.github/workflows/deploy.yml#L60) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:62](https://github.com/systemslibrarian/crypto-lab-vigenere-break/blob/15dfd3a572dc098a42cf878bfba1005f02b05930/.github/workflows/deploy.yml#L62) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:19](https://github.com/systemslibrarian/crypto-lab-vigenere-break/blob/15dfd3a572dc098a42cf878bfba1005f02b05930/playwright.config.ts#L19))
- **Limits and guidance (+)**: [README.md:12](https://github.com/systemslibrarian/crypto-lab-vigenere-break/blob/15dfd3a572dc098a42cf878bfba1005f02b05930/README.md#L12)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-vrf-gate — ec084f1edada61388c54a52334b43b7dc7e61414

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [scripts/check-rfc9381.ts:10](https://github.com/systemslibrarian/crypto-lab-vrf-gate/blob/ec084f1edada61388c54a52334b43b7dc7e61414/scripts/check-rfc9381.ts#L10) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:558](https://github.com/systemslibrarian/crypto-lab-vrf-gate/blob/ec084f1edada61388c54a52334b43b7dc7e61414/e2e/claims.spec.ts#L558)
- **Negative test (+)**: [e2e/claims.spec.ts:237](https://github.com/systemslibrarian/crypto-lab-vrf-gate/blob/ec084f1edada61388c54a52334b43b7dc7e61414/e2e/claims.spec.ts#L237)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-vrf-gate/blob/ec084f1edada61388c54a52334b43b7dc7e61414/.github/workflows/deploy.yml#L35) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:39](https://github.com/systemslibrarian/crypto-lab-vrf-gate/blob/ec084f1edada61388c54a52334b43b7dc7e61414/.github/workflows/deploy.yml#L39) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-vrf-gate/blob/ec084f1edada61388c54a52334b43b7dc7e61414/.github/workflows/deploy.yml#L41) `build (needs: —): npm run test:browser`; engines: chromium ([playwright.config.ts:22](https://github.com/systemslibrarian/crypto-lab-vrf-gate/blob/ec084f1edada61388c54a52334b43b7dc7e61414/playwright.config.ts#L22))
- **Limits and guidance (+)**: [README.md:7](https://github.com/systemslibrarian/crypto-lab-vrf-gate/blob/ec084f1edada61388c54a52334b43b7dc7e61414/README.md#L7)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-vss-gate — b88123382255af7c5b6ef4dec1af11fde65ee538

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/vss.test.ts:212](https://github.com/systemslibrarian/crypto-lab-vss-gate/blob/b88123382255af7c5b6ef4dec1af11fde65ee538/src/vss.test.ts#L212) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:208](https://github.com/systemslibrarian/crypto-lab-vss-gate/blob/b88123382255af7c5b6ef4dec1af11fde65ee538/e2e/claims.spec.ts#L208)
- **Negative test (+)**: [src/vss.test.ts:36](https://github.com/systemslibrarian/crypto-lab-vss-gate/blob/b88123382255af7c5b6ef4dec1af11fde65ee538/src/vss.test.ts#L36)
- **Deploy gate (+)**: [.github/workflows/deploy-pages.yml:37](https://github.com/systemslibrarian/crypto-lab-vss-gate/blob/b88123382255af7c5b6ef4dec1af11fde65ee538/.github/workflows/deploy-pages.yml#L37) `build (needs: —): npm test`; [.github/workflows/deploy-pages.yml:40](https://github.com/systemslibrarian/crypto-lab-vss-gate/blob/b88123382255af7c5b6ef4dec1af11fde65ee538/.github/workflows/deploy-pages.yml#L40) `build (needs: —): npm run build`; [.github/workflows/deploy-pages.yml:43](https://github.com/systemslibrarian/crypto-lab-vss-gate/blob/b88123382255af7c5b6ef4dec1af11fde65ee538/.github/workflows/deploy-pages.yml#L43) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy-pages.yml:46](https://github.com/systemslibrarian/crypto-lab-vss-gate/blob/b88123382255af7c5b6ef4dec1af11fde65ee538/.github/workflows/deploy-pages.yml#L46) `build (needs: —): npm run test:browser`; engines: chromium ([playwright.config.ts:32](https://github.com/systemslibrarian/crypto-lab-vss-gate/blob/b88123382255af7c5b6ef4dec1af11fde65ee538/playwright.config.ts#L32))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-vss-gate/blob/b88123382255af7c5b6ef4dec1af11fde65ee538/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-web-of-trust — fcd2d7ca19e58e1821a6cb205bfcd8a27f10bc50

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:556](https://github.com/systemslibrarian/crypto-lab-web-of-trust/blob/fcd2d7ca19e58e1821a6cb205bfcd8a27f10bc50/e2e/claims.spec.ts#L556) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:239](https://github.com/systemslibrarian/crypto-lab-web-of-trust/blob/fcd2d7ca19e58e1821a6cb205bfcd8a27f10bc50/e2e/claims.spec.ts#L239)
- **Negative test (+)**: [test/engine.test.ts:71](https://github.com/systemslibrarian/crypto-lab-web-of-trust/blob/fcd2d7ca19e58e1821a6cb205bfcd8a27f10bc50/test/engine.test.ts#L71)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-web-of-trust/blob/fcd2d7ca19e58e1821a6cb205bfcd8a27f10bc50/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-web-of-trust/blob/fcd2d7ca19e58e1821a6cb205bfcd8a27f10bc50/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-web-of-trust/blob/fcd2d7ca19e58e1821a6cb205bfcd8a27f10bc50/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-web-of-trust/blob/fcd2d7ca19e58e1821a6cb205bfcd8a27f10bc50/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:24](https://github.com/systemslibrarian/crypto-lab-web-of-trust/blob/fcd2d7ca19e58e1821a6cb205bfcd8a27f10bc50/playwright.config.ts#L24))
- **Limits and guidance (+)**: [README.md:13](https://github.com/systemslibrarian/crypto-lab-web-of-trust/blob/fcd2d7ca19e58e1821a6cb205bfcd8a27f10bc50/README.md#L13)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-webauthn — 1485b67de4cd6cf8d48ae7021bd5900fde771227

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [test/engine.test.ts:5](https://github.com/systemslibrarian/crypto-lab-webauthn/blob/1485b67de4cd6cf8d48ae7021bd5900fde771227/test/engine.test.ts#L5) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [test/engine.test.ts:72](https://github.com/systemslibrarian/crypto-lab-webauthn/blob/1485b67de4cd6cf8d48ae7021bd5900fde771227/test/engine.test.ts#L72) requires provenance/execution review.
- **Displayed claim (+)**: —
- **Negative test (+)**: [test/engine.test.ts:154](https://github.com/systemslibrarian/crypto-lab-webauthn/blob/1485b67de4cd6cf8d48ae7021bd5900fde771227/test/engine.test.ts#L154)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-webauthn/blob/1485b67de4cd6cf8d48ae7021bd5900fde771227/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:31](https://github.com/systemslibrarian/crypto-lab-webauthn/blob/1485b67de4cd6cf8d48ae7021bd5900fde771227/.github/workflows/deploy.yml#L31) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:33](https://github.com/systemslibrarian/crypto-lab-webauthn/blob/1485b67de4cd6cf8d48ae7021bd5900fde771227/.github/workflows/deploy.yml#L33) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:35](https://github.com/systemslibrarian/crypto-lab-webauthn/blob/1485b67de4cd6cf8d48ae7021bd5900fde771227/.github/workflows/deploy.yml#L35) `build (needs: —): npm run test:a11y`; [.github/workflows/deploy.yml:41](https://github.com/systemslibrarian/crypto-lab-webauthn/blob/1485b67de4cd6cf8d48ae7021bd5900fde771227/.github/workflows/deploy.yml#L41) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.ts:31](https://github.com/systemslibrarian/crypto-lab-webauthn/blob/1485b67de4cd6cf8d48ae7021bd5900fde771227/playwright.config.ts#L31))
- **Limits and guidance (+)**: [README.md:14](https://github.com/systemslibrarian/crypto-lab-webauthn/blob/1485b67de4cd6cf8d48ae7021bd5900fde771227/README.md#L14)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-world-ciphers — 51cea193cf47f4abc491afe6ffb86f0ca7cdac5d

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/ciphers/test-vectors.ts:18](https://github.com/systemslibrarian/crypto-lab-world-ciphers/blob/51cea193cf47f4abc491afe6ffb86f0ca7cdac5d/src/ciphers/test-vectors.ts#L18) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (+)**: [e2e/claims.spec.ts:317](https://github.com/systemslibrarian/crypto-lab-world-ciphers/blob/51cea193cf47f4abc491afe6ffb86f0ca7cdac5d/e2e/claims.spec.ts#L317)
- **Negative test (+)**: [e2e/claims.spec.ts:432](https://github.com/systemslibrarian/crypto-lab-world-ciphers/blob/51cea193cf47f4abc491afe6ffb86f0ca7cdac5d/e2e/claims.spec.ts#L432)
- **Deploy gate (?)**: UNRESOLVED: candidate [.github/workflows/deploy-pages.yml:53](https://github.com/systemslibrarian/crypto-lab-world-ciphers/blob/51cea193cf47f4abc491afe6ffb86f0ca7cdac5d/.github/workflows/deploy-pages.yml#L53) requires provenance/execution review.
- **Limits and guidance (+)**: [README.md:14](https://github.com/systemslibrarian/crypto-lab-world-ciphers/blob/51cea193cf47f4abc491afe6ffb86f0ca7cdac5d/README.md#L14)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-world-hashes — 6f417f5104da2ee120c0fda724eb7bbc301f280b

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [e2e/claims.spec.ts:167](https://github.com/systemslibrarian/crypto-lab-world-hashes/blob/6f417f5104da2ee120c0fda724eb7bbc301f280b/e2e/claims.spec.ts#L167) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/collision-search.test.ts:37](https://github.com/systemslibrarian/crypto-lab-world-hashes/blob/6f417f5104da2ee120c0fda724eb7bbc301f280b/src/collision-search.test.ts#L37)
- **Deploy gate (+)**: [.github/workflows/deploy-pages.yml:40](https://github.com/systemslibrarian/crypto-lab-world-hashes/blob/6f417f5104da2ee120c0fda724eb7bbc301f280b/.github/workflows/deploy-pages.yml#L40) `build (needs: —): npm test`; [.github/workflows/deploy-pages.yml:43](https://github.com/systemslibrarian/crypto-lab-world-hashes/blob/6f417f5104da2ee120c0fda724eb7bbc301f280b/.github/workflows/deploy-pages.yml#L43) `build (needs: —): npm run build`; [.github/workflows/deploy-pages.yml:46](https://github.com/systemslibrarian/crypto-lab-world-hashes/blob/6f417f5104da2ee120c0fda724eb7bbc301f280b/.github/workflows/deploy-pages.yml#L46) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy-pages.yml:49](https://github.com/systemslibrarian/crypto-lab-world-hashes/blob/6f417f5104da2ee120c0fda724eb7bbc301f280b/.github/workflows/deploy-pages.yml#L49) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:28](https://github.com/systemslibrarian/crypto-lab-world-hashes/blob/6f417f5104da2ee120c0fda724eb7bbc301f280b/playwright.config.ts#L28))
- **Limits and guidance (+)**: [README.md:18](https://github.com/systemslibrarian/crypto-lab-world-hashes/blob/6f417f5104da2ee120c0fda724eb7bbc301f280b/README.md#L18)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-x3dh-wire — 0b8587962dd6824778b7d55bdac3c47c86dec9f2

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [src/kdf.test.ts:18](https://github.com/systemslibrarian/crypto-lab-x3dh-wire/blob/0b8587962dd6824778b7d55bdac3c47c86dec9f2/src/kdf.test.ts#L18) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [src/xeddsa.test.ts:1](https://github.com/systemslibrarian/crypto-lab-x3dh-wire/blob/0b8587962dd6824778b7d55bdac3c47c86dec9f2/src/xeddsa.test.ts#L1) requires provenance/execution review.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/x3dh.test.ts:47](https://github.com/systemslibrarian/crypto-lab-x3dh-wire/blob/0b8587962dd6824778b7d55bdac3c47c86dec9f2/src/x3dh.test.ts#L47)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:52](https://github.com/systemslibrarian/crypto-lab-x3dh-wire/blob/0b8587962dd6824778b7d55bdac3c47c86dec9f2/.github/workflows/deploy.yml#L52) `build (needs: —): npm test`; [.github/workflows/deploy.yml:53](https://github.com/systemslibrarian/crypto-lab-x3dh-wire/blob/0b8587962dd6824778b7d55bdac3c47c86dec9f2/.github/workflows/deploy.yml#L53) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:56](https://github.com/systemslibrarian/crypto-lab-x3dh-wire/blob/0b8587962dd6824778b7d55bdac3c47c86dec9f2/.github/workflows/deploy.yml#L56) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:59](https://github.com/systemslibrarian/crypto-lab-x3dh-wire/blob/0b8587962dd6824778b7d55bdac3c47c86dec9f2/.github/workflows/deploy.yml#L59) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:24](https://github.com/systemslibrarian/crypto-lab-x3dh-wire/blob/0b8587962dd6824778b7d55bdac3c47c86dec9f2/playwright.config.ts#L24))
- **Limits and guidance (+)**: [README.md:17](https://github.com/systemslibrarian/crypto-lab-x3dh-wire/blob/0b8587962dd6824778b7d55bdac3c47c86dec9f2/README.md#L17)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-zk-arena — dc2c022ab4c6341dbd7fc0c395716cecc97dd126

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [scripts/check-bundle-size.mjs:20](https://github.com/systemslibrarian/crypto-lab-zk-arena/blob/dc2c022ab4c6341dbd7fc0c395716cecc97dd126/scripts/check-bundle-size.mjs#L20) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Displayed claim (?)**: UNRESOLVED: no corroborated evidence from the readable source search; absence is not inferred.
- **Negative test (+)**: [src/schnorr.test.ts:55](https://github.com/systemslibrarian/crypto-lab-zk-arena/blob/dc2c022ab4c6341dbd7fc0c395716cecc97dd126/src/schnorr.test.ts#L55)
- **Deploy gate (+)**: [.github/workflows/deploy.yml:30](https://github.com/systemslibrarian/crypto-lab-zk-arena/blob/dc2c022ab4c6341dbd7fc0c395716cecc97dd126/.github/workflows/deploy.yml#L30) `build (needs: —): npm test`; [.github/workflows/deploy.yml:32](https://github.com/systemslibrarian/crypto-lab-zk-arena/blob/dc2c022ab4c6341dbd7fc0c395716cecc97dd126/.github/workflows/deploy.yml#L32) `build (needs: —): npm run build`; [.github/workflows/deploy.yml:36](https://github.com/systemslibrarian/crypto-lab-zk-arena/blob/dc2c022ab4c6341dbd7fc0c395716cecc97dd126/.github/workflows/deploy.yml#L36) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/deploy.yml:38](https://github.com/systemslibrarian/crypto-lab-zk-arena/blob/dc2c022ab4c6341dbd7fc0c395716cecc97dd126/.github/workflows/deploy.yml#L38) `build (needs: —): npm run test:e2e`; engines: chromium ([playwright.config.mjs:16](https://github.com/systemslibrarian/crypto-lab-zk-arena/blob/dc2c022ab4c6341dbd7fc0c395716cecc97dd126/playwright.config.mjs#L16))
- **Limits and guidance (?)**: UNRESOLVED: candidate [README.md:20](https://github.com/systemslibrarian/crypto-lab-zk-arena/blob/dc2c022ab4c6341dbd7fc0c395716cecc97dd126/README.md#L20) requires provenance/execution review.
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

#### crypto-lab-zk-proof-lab — 384ac53a03f26fa86200e6b7ea9e491975e0bf3d

Source scan: SCANNED.
- **Ground truth (?)**: UNRESOLVED: candidate [tests/unit/crypto-core.test.ts:79](https://github.com/systemslibrarian/crypto-lab-zk-proof-lab/blob/384ac53a03f26fa86200e6b7ea9e491975e0bf3d/tests/unit/crypto-core.test.ts#L79) requires provenance/execution review.
- **Independent check (?)**: UNRESOLVED: candidate [tests/browser-quality.mjs:69](https://github.com/systemslibrarian/crypto-lab-zk-proof-lab/blob/384ac53a03f26fa86200e6b7ea9e491975e0bf3d/tests/browser-quality.mjs#L69) requires provenance/execution review.
- **Displayed claim (+)**: [e2e/claims.spec.ts:131](https://github.com/systemslibrarian/crypto-lab-zk-proof-lab/blob/384ac53a03f26fa86200e6b7ea9e491975e0bf3d/e2e/claims.spec.ts#L131)
- **Negative test (+)**: [e2e/claims.spec.ts:160](https://github.com/systemslibrarian/crypto-lab-zk-proof-lab/blob/384ac53a03f26fa86200e6b7ea9e491975e0bf3d/e2e/claims.spec.ts#L160)
- **Deploy gate (+)**: [.github/workflows/pages.yml:27](https://github.com/systemslibrarian/crypto-lab-zk-proof-lab/blob/384ac53a03f26fa86200e6b7ea9e491975e0bf3d/.github/workflows/pages.yml#L27) `build (needs: —): npm run build`; [.github/workflows/pages.yml:29](https://github.com/systemslibrarian/crypto-lab-zk-proof-lab/blob/384ac53a03f26fa86200e6b7ea9e491975e0bf3d/.github/workflows/pages.yml#L29) `build (needs: —): npx playwright install --with-deps chromium`; [.github/workflows/pages.yml:31](https://github.com/systemslibrarian/crypto-lab-zk-proof-lab/blob/384ac53a03f26fa86200e6b7ea9e491975e0bf3d/.github/workflows/pages.yml#L31) `build (needs: —): npm run test:a11y`; engines: chromium ([playwright.config.ts:25](https://github.com/systemslibrarian/crypto-lab-zk-proof-lab/blob/384ac53a03f26fa86200e6b7ea9e491975e0bf3d/playwright.config.ts#L25))
- **Limits and guidance (+)**: [README.md:5](https://github.com/systemslibrarian/crypto-lab-zk-proof-lab/blob/384ac53a03f26fa86200e6b7ea9e491975e0bf3d/README.md#L5)
- **Zero-test check (?)**: NOT-SCANNED: run output and executed test count unavailable from this source export.

