# Teaching-accuracy audit: evaluation and corrections

**Review date: 21 October 2026. Verdict: useful recommendations, but the fleet-wide assurance is not established.** The supplied audit identifies real disclosure and evidence gaps. Its conclusion that the fleet is accurate with respect to everything it teaches goes beyond a README scan and sampled review. This follow-up found and corrected substantive teaching errors as well as disclosure gaps.

## What is true, overstated, or unverified

| Original audit statement | Evaluation |
| --- | --- |
| The catalog displays 242 exhibits. | Correct for the visible grid. There are 243 project cards: 242 grid exhibits plus Lattice Builder, which is presented as a learning game. The population must be stated before comparing counts. |
| 244 repositories; honesty/KAT/strong-disclaimer/toy counts of 226/193/119/14. | The original report supplies no repository manifest, exact regexes or source revisions, so those exact results cannot be reproduced. This review found 245 repositories in its inventory, including the catalog and Blind Oracle backend, and pins the 243 demo sources separately. This difference alone does not prove the original snapshot was wrong. |
| About 18 missing markers represent honesty gaps. | A keyword miss is not an absent disclosure. Our documented, normalized README probe found 234/243 matches and nine misses before corrections. Human reading found six adequately scoped under other wording and three useful README improvements. |
| The fleet standard requires claims suites, independent checks and mutation evidence. | The requirements are real. A requirement, KAT mention, filename or green workflow is not proof that every lab complies with all of them. |
| Browser WebCrypto/WASM implementations are not constant-time, audited or FIPS modules. | Invalid as a blanket platform claim. Those properties depend on the specific implementation, build, provider, validation boundary and evidence. The API or compilation format alone establishes neither their presence nor their absence. |
| Toy/simulation caveats should be prominent. | Valid. Ten opening panels were improved, and three README disclosure gaps were closed. |
| Publish a mutation-tested claims-suite census. | Valid goal, but a filename scan cannot assign that status. The published census reports presence separately from execution and mutation verification, which remain explicitly unassessed by that census. |
| Keep “menu, not curriculum.” | Already appropriate. The existing reading paths and modules are preserved. |
| The whole fleet is teaching-accurate; no systematic fabrication. | The supplied method cannot establish the first claim or exclude undiscovered problems. This review found specific inaccurate explanations. It makes no finding of intentional fabrication and does not certify all cryptographic implementations. |

## Reproducible fleet evidence

The [census](CLAIMS-CENSUS-2026-10-21.md) and [JSON snapshot](CLAIMS-CENSUS-2026-10-21.json) cover every project card at catalog commit `9845031ce69a78b7a92d4e1caccefccfb7ffaf13`. Each row records its immutable source commit, README path/hash, and matching test paths. All 243 trees and READMEs were readable. The snapshot deliberately preserves the pre-correction sources.

- **185/243** have a test filename containing `claims`; **58** have no such filename. Tests with other names may still check displayed claims.
- **55/243** have mutation-named paths. This is a discovery signal, not a successful-mutation count; the recorded regex excludes unrelated `permutation` files.
- **234/243** match the documented README marker probe. Neither a match nor a miss establishes teaching accuracy.

The nine marker misses were reviewed individually. HQC Timing and HQC Timing Break already disclose simulations; Bitcoin Script states education-only use; Hybrid PQC says not to lift the sketch into production; Ablation Wire disclaims a secure channel and links its security scope; Lattice Builder says its implementation is written to be read, not deployed. JWT Forge, Time-Lock Puzzle and Point Ledger received substantive scope additions. No bulk warnings were added merely to satisfy a regex.

## Corrections published

| Lab and fixed revision | Change |
| --- | --- |
| [bb84 · `819c34f523`](https://github.com/systemslibrarian/crypto-lab-bb84/commit/819c34f52330fab148168bb635008d7573b62ac5) | Replaced claims that SHA-256 removes Eve’s information with scoped key derivation, an entropy upper bound, and the missing finite-key analysis. Corrected guaranteed-detection wording and showed the classical-simulation caveat in the opening panel. |
| [biham-lens · `8544ee0ff4`](https://github.com/systemslibrarian/crypto-lab-biham-lens/commit/8544ee0ff488f74ce437be57ac5cfd494bbe134c) | Corrected DES’s maximum nonzero-input difference count from 8 to 16/64; normalized the AES and Serpent comparisons. Removed claims of immunity from round count or strong S-boxes, corrected the S-box generalization, and added an independent DES table test. |
| [broken-trust · `ea17f0ca88`](https://github.com/systemslibrarian/crypto-lab-broken-trust/commit/ea17f0ca883ac0181b05ab21727b5b5b0d7305ed) | Made the dimension-8 generated toy key and quoted full-scale performance explicit in the opening panel. |
| [ckks-lab · `e2f3e59a4c`](https://github.com/systemslibrarian/crypto-lab-ckks-lab/commit/e2f3e59a4c5af667dab219c5c7048401dcd3f83b) | Moved the n=8, four-slot teaching-parameter and security-scope warning into the opening explanation. |
| [e91 · `eccf9173e9`](https://github.com/systemslibrarian/crypto-lab-e91/commit/eccf9173e98ab1c54293e47cc79896a2a78930af) | Made the classical simulation explicit. Scoped destruction of Bell violation to the modeled full intercept-resend attack; a violation alone is not a complete finite-key security proof. |
| [fhe-arena · `7898504825`](https://github.com/systemslibrarian/crypto-lab-fhe-arena/commit/78985048259d144c4a80e91a64624a02f241c6e3) | Replaced “semantic security shown” with randomized encryption. Different ciphertexts do not prove IND-CPA security. Added the insecure parameters, randomness and shared-browser trust boundary to the opening panel. |
| [jwt-forge · `eeb81b2a10`](https://github.com/systemslibrarian/crypto-lab-jwt-forge/commit/eeb81b2a1035e47ba686a5a3a5cd06672b4bfa48) | Added README and opening-panel scope: real signature operations, deliberately vulnerable verification paths, no production authentication system. |
| [matsui-line · `7e4c2c46d8`](https://github.com/systemslibrarian/crypto-lab-matsui-line/commit/7e4c2c46d89e8bd59ebc83841b6835159d811404) | Made the 8-bit toy-cipher scope explicit. Raised only the exhaustive screening test’s timeout from 5 to 20 seconds after measuring about 6.8 seconds; retained every candidate, key and assertion. |
| [multivariate · `e475888c7a`](https://github.com/systemslibrarian/crypto-lab-multivariate/commit/e475888c7a6a09634a1f2e4e5b69115d2b44807b) | Surfaced tiny parameters and the non-cryptographic FNV-1a message hash. Removed blanket “shortest signatures” and unsupported NIST-selection explanations. |
| [point-ledger · `b7bf109955`](https://github.com/systemslibrarian/crypto-lab-point-ledger/commit/b7bf1099557c0323e9d84f408c34efb56458c3d8) | Added README guidance separating cited quantum resource estimates from executable classical arithmetic and finite fuzz evidence. Explicitly excluded quantum circuits, real-key recovery, ZK proofs and benchmark submission. |
| [time-lock-puzzle · `d7d0f68ed5`](https://github.com/systemslibrarian/crypto-lab-time-lock-puzzle/commit/d7d0f68ed56ec9ca1b50d5e25cdf86a036873616) | Added README and opening-panel limits for the default 1024-bit modulus, retained trapdoor and lack of a guaranteed wall-clock delay. |

The catalog’s changed source anchors were regenerated and verified for these eleven labs. Five human-review records were refreshed after examining the changes since their prior pins. Biham Lens’s previously added PRESENT-80 engine was read and is now explicitly credited; its known-K32 suffix search is distinguished from an attack that obtains the round key. Merely comparing DES in a table does not credit a DES implementation. Context-only chosen-ciphertext, collision, padding-oracle and linear-cryptanalysis attack credits were also removed from Biham Lens; links to other demos do not execute those attacks.

## Validation and its limits

Ten changed UI projects passed production builds and **431 local unit tests** in total. Point Ledger’s change is documentation only; its runtime was not rerun locally for this review. Local browser checks used Chromium 153.0.8010.0 through a temporary launch configuration because the requested Playwright browser download failed in this environment. No committed gate was bypassed or weakened.

| Lab | Local unit tests | Local browser result | Hosted validation at fixed revision |
| --- | ---: | --- | --- |
| bb84 | 25 | 19 passed | [Passed](https://github.com/systemslibrarian/crypto-lab-bb84/actions/runs/39686042362) |
| biham-lens | 36 | 34 existing tests passed; new DES test passed after its selector correction | [Passed](https://github.com/systemslibrarian/crypto-lab-biham-lens/actions/runs/39686047672) |
| broken-trust | 41 | 26 passed | [Passed](https://github.com/systemslibrarian/crypto-lab-broken-trust/actions/runs/39686055029) |
| ckks-lab | 17 | 23 passed | [Passed](https://github.com/systemslibrarian/crypto-lab-ckks-lab/actions/runs/39686063790) |
| e91 | 35 | 32 passed | [Passed](https://github.com/systemslibrarian/crypto-lab-e91/actions/runs/39686071678) |
| fhe-arena | 20 | 22 passed | [Passed](https://github.com/systemslibrarian/crypto-lab-fhe-arena/actions/runs/39686079175) |
| jwt-forge | 94 | 28 passed | [Passed](https://github.com/systemslibrarian/crypto-lab-jwt-forge/actions/runs/39686085128) |
| matsui-line | 88 | 16 passed | [Passed](https://github.com/systemslibrarian/crypto-lab-matsui-line/actions/runs/39686091781) |
| multivariate | 45 | 4 claims passed; 2 local accessibility runs blocked by font loading | [Passed](https://github.com/systemslibrarian/crypto-lab-multivariate/actions/runs/39686099685) |
| point-ledger | Not rerun | Not rerun; README only | [Passed](https://github.com/systemslibrarian/crypto-lab-point-ledger/actions/runs/39686105778) |
| time-lock-puzzle | 30 | 5 passed | [Passed](https://github.com/systemslibrarian/crypto-lab-time-lock-puzzle/actions/runs/39686110429) |

The two Multivariate local accessibility runs completed their state-driving work but failed the existing console-error gate on an unavailable Google Fonts request (`ERR_EMPTY_RESPONSE`). A request-failure probe identified that exact URL. The unchanged gate subsequently passed in hosted CI: all 45 unit tests and all six browser tests, including its accessibility step. The local failure was not relabeled a pass.

Biham’s new DES test initially selected an unrelated comparison table. After narrowing the locator to the Serpent panel, it passed. The pre-existing 34 browser tests passed in the full local run; hosted CI then passed the complete suite with the corrected selector. Matsui’s original five-second timeout failed twice on the same exhaustive case before the measured, per-test timeout correction; computational work and assertions were not reduced.

### New DES assertion: mutation evidence

The oracle enumerates all eight FIPS 46-3 S-boxes, every nonzero six-bit input difference and all 64 inputs, independently of the lab’s toy SPN and displayed prose. It compares the result with the actual rendered DES cell. The computed maximum is **16/64**, not 8/64.

After committing the real correction locally, the displayed source value was changed back from `16 / 64` to `8 / 64`. The production build succeeded, the served artifact changed, and the owning browser assertion failed with expected `16 / 64`, received `8 / 64`. Restoring the source restored the artifact hash and the passing assertion. This is evidence for this new assertion, not every assertion in the fleet.

| Artifact state | Aggregate SHA-256 of sorted `dist` paths and bytes | Owning test |
| --- | --- | --- |
| Corrected baseline | `ed1dd80ad3668e27bdb3ea37de5713849e3b3e84cb31b29242d10aee0af03046` | Pass |
| Wrong displayed value | `8341e7dc6e3f193aa9d9f2306e9e1172504023520804aed2a0fb18725c8125a9` | Fails at the DES cell assertion |
| Restored source | `ed1dd80ad3668e27bdb3ea37de5713849e3b3e84cb31b29242d10aee0af03046` | Pass |

The digest includes HTML as well as JavaScript because the mutated teaching claim is authored in HTML. Hash construction: for every regular `dist` file in sorted path order, concatenate its relative UTF-8 path, a NUL, its bytes and a NUL; hash that stream with SHA-256. Test selector: `independently enumerated` in `e2e/claims.spec.ts`; each run rebuilt before serving with CI server reuse disabled.

Catalog validation passed: source-anchor verification for all eleven changed labs; catalog vocabulary and generated catalog checks; catalog search/structure; the regenerated knowledge map and its source relationships; README/card parity; teach-page generation/count lint; and rendered layout checks across 35 teaching pages at 1280px and 390px. All eleven linked lab workflows passed at their fixed revisions. Fresh HTTP fetches of production HTML and its referenced JavaScript confirmed the corrected text on all ten changed UI sites. Point Ledger’s updated README was checked against its published commit.

## Primary technical references

- [NIST FIPS 46-3, Appendix 1](https://csrc.nist.gov/files/pubs/fips/46-3/final/docs/fips46-3.pdf): DES S-box tables used by the independent enumeration.
- [Anderson, Biham and Knudsen, *Serpent: A Proposal for the Advanced Encryption Standard*](https://www.cl.cam.ac.uk/archive/rja14/Papers/serpent.pdf): S-box properties and conservative design margin; no universal immunity theorem.
- [Renner and König, *Universally composable privacy amplification against quantum adversaries*](https://arxiv.org/abs/quant-ph/0403133): extracting secrecy against quantum side information requires more than displaying a hash output.
- [W3C Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/), security considerations and underlying implementations: API availability is not certification of the application or every provider.

This review verifies the stated corrections and the recorded checks. It is not an independent cryptanalysis of all 243 demos, a production-readiness certification, or proof of full claims-suite/mutation compliance for the fleet. The 58 filename misses are an investigation list, not 58 established defects.

Original supplied audit SHA-256: `95955be26a312a7cc5978e1b24ed4340c670afd5112c582c8625a3c04483ee45`. The original has been preserved; this is a separate evaluation.
