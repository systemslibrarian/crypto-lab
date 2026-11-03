# Research review implementation 31 October 2026

Fourteen findings from the supplied review are implemented and merged across eleven projects, including the two advanced extensions completed on 3 November 2026. The KDF calculator remains unimplemented; the 3 November investigation supports a bounded forward-only design while retaining the unrestricted-converse hold. Merged commits and deployment observations are recorded separately. The validation narrative below records the original nine-project batch; the dated follow-up has its own receipts.

| Finding | Resulting lesson or behavior | Delivery |
| --- | --- | --- |
| R20261031-01 | Correct the leftover-hash vacuity boundary. | [crypto-lab-quantum-entropy PR](<https://github.com/systemslibrarian/crypto-lab-quantum-entropy/pull/25>) |
| R20261031-02 | Compare signed monobit statistics and folded P/signed Q with exact finite-binomial expectations. | [crypto-lab-drbg-arena PR](<https://github.com/systemslibrarian/crypto-lab-drbg-arena/pull/26>) |
| R20261031-03 | Separate received histories, authenticated semantic disagreement and edit reconciliation from epoch-key equality. | [crypto-lab-mls-group PR](<https://github.com/systemslibrarian/crypto-lab-mls-group/pull/30>) |
| R20261031-04 | Preserve custody, origin, script/language, uncertainty and separate object/image/transcription rights. | [cipher-museum PR](<https://github.com/systemslibrarian/cipher-museum/pull/21>) |
| R20261031-05 | Add optional linguistic categories and an invented ending/punctuation worked example. | [cipher-museum PR](<https://github.com/systemslibrarian/cipher-museum/pull/21>) |
| R20261031-06 | Keep language benchmark stages and historical hypothesis claims separate. | [cipher-museum PR](<https://github.com/systemslibrarian/cipher-museum/pull/21>) |
| R20261031-07 | Attach full DH oracle access, simulation, offline and online costs to the conditional reduction. | [cipher-museum PR](<https://github.com/systemslibrarian/cipher-museum/pull/21>) |
| R20261031-08 | Name the Jasmin compiler-preservation result with dependencies and exclusions. | [crypto-lab-vector-gate PR](<https://github.com/systemslibrarian/crypto-lab-vector-gate/pull/11>) |
| R20261031-09 | Classify semantic proof outcomes, ineffective mutations and malformed-proof controls. | [crypto-lab-snark-arena PR](<https://github.com/systemslibrarian/crypto-lab-snark-arena/pull/27>) |
| R20261031-10 | Exact information/bias calculator, independent versus shared-burst comparison and physical accounting. | [Merged extension](https://github.com/systemslibrarian/crypto-lab-ciphertext-mirror/pull/40) |
| R20261031-11 | Separate authenticity, context commitment, passive leakage and distinct active-fault models. | [crypto-lab-salamander PR](<https://github.com/systemslibrarian/crypto-lab-salamander/pull/33>) |
| R20261031-12 | Compute offline/online/total UOV costs and enforce modeled one-use inventory. | [crypto-lab-multivariate PR](<https://github.com/systemslibrarian/crypto-lab-multivariate/pull/23>) |
| R20261031-13 | Enumerate full-public-helper views for a separately labeled broken polynomial-CRT construction. | [crypto-lab-hostile-paths PR](<https://github.com/systemslibrarian/crypto-lab-hostile-paths/pull/5>) |
| R20261031-14 | Investigated: forward-only specification supported; unrestricted converse held; calculator not implemented. | Deferred advanced option |
| R20261031-15 | Proof-wrapper dependency diagram and conditional hybrid-security comparisons. | [Merged extension](https://github.com/systemslibrarian/crypto-lab-pq-families/pull/28) |

## What was preserved

Museum R01–R14 and F01–F13, the correct TreeKEM convergence and entropy arithmetic, existing weak-XOR controls, key-commitment distinctions, FROST participation lessons and the ECC engines remain in place. No new backend, codebook exploit, dataset redistribution or duplicate noisy-oracle replay was introduced. The optional KDF calculator remains unimplemented; its scope and converse caveat are addressed in the dated investigation below.

## Validation and limits

All nine implementation PRs passed their hosted workflows at the exact head revisions recorded in the JSON ledger, then were squash-merged with those expected heads. Their main references were checked against the returned merge commits. Post-merge workflows and deployment observations are tracked separately in the JSON ledger.

All eight modified Crypto Lab projects passed local unit tests and production builds. New interactions were also exercised with rendered DOM tests: finite P/Q comparisons, all five authenticated group scenarios, semantic proof outcomes, one-use inventory, full-helper coalitions and AEAD property tables. Individual counts and exact source revisions are recorded in the [machine-readable finding ledger](research-review-2026-10-31.json).

The Museum passed the new metadata/bundle/typed-key regressions, existing workbench/DOM checks, v1/v2 fixture replays, release metadata and HTML lint across 216 pages. Its full suite initially had one timing-canary failure while other work was running. The complete engine suite was rerun in isolation and passed, including all 713 engine tests, timing and mutation canaries, and corpus replay. Every other suite in the full run passed. Rebuilt evaluation files update source hashes and machine-specific timing/heap measurements; non-timing outcomes were compared and preserved.

Local Chromium launch was blocked by the execution environment before page execution. Hosted PR workflows ran the actual browser/accessibility gates; their successful conclusions are retained in the JSON ledger. Earlier passes found the new Salamander panel count, UOV button/select styling and an existing DRBG test that incorrectly expected every random sample to pass. The fixes preserve the accessibility gate and compare the DRBG tally against the actual painted bytes. Historical failures remain in GitHub run history. Three deliberate regressions were also caught by their owning tests: discarding Q's sign, blessing inconsistent histories and dropping extended source fields; each source file was restored byte for byte.

No independent paper proof certification, production attack reproduction, live vulnerability verification or deployed-site audit is claimed. The public-helper equations were derived from the saved paper's sections III–IV with valid tiny parameters; an independent algebraic recovery check covers all 625 dealer choices and a full census covers every coalition.

## A cumulative review record

Use stable paper IDs and saved-file SHA-256 values to join reading evidence to exact versions. Intake status, reading depth, implementation and deployment are separate fields. The supplied report's 24 complete reads/492 pages (36/856 cumulatively) remain attributed to that report. This implementation pass does not claim those reads again, recheck all 1,468 saved hashes or replace the existing reading ledgers. Missing hashes stay unknown. Preserve unchanged-version readings, rejected claims and unresolved issues; reopen a paper for a changed version or a concrete new question.

The existing generated CATALOG remains pinned to its earlier section reviews; it was checked for synchronization and was not silently re-pinned as a new full-fleet audit. This supplemental ledger supplies exact commits and paths for the new controls. A later catalog refresh should review and re-anchor the affected sections before advancing its source pins.

## Merged implementations

| Project PR | Merge commit |
| --- | --- |
| [crypto-lab-quantum-entropy #25](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/pull/25) | [690cfa687dac](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/commit/690cfa687dac827e88c5bad3989da8c0674f3195) |
| [crypto-lab-drbg-arena #26](https://github.com/systemslibrarian/crypto-lab-drbg-arena/pull/26) | [0643a7c7c0d2](https://github.com/systemslibrarian/crypto-lab-drbg-arena/commit/0643a7c7c0d22bd43e94463ea860bacd3669533a) |
| [crypto-lab-mls-group #30](https://github.com/systemslibrarian/crypto-lab-mls-group/pull/30) | [1738d76601f4](https://github.com/systemslibrarian/crypto-lab-mls-group/commit/1738d76601f4f4df0d430f7ae444c8fd00185619) |
| [crypto-lab-vector-gate #11](https://github.com/systemslibrarian/crypto-lab-vector-gate/pull/11) | [bf020f31fce1](https://github.com/systemslibrarian/crypto-lab-vector-gate/commit/bf020f31fce12253ad9b82a97794269b0b0b4644) |
| [crypto-lab-snark-arena #27](https://github.com/systemslibrarian/crypto-lab-snark-arena/pull/27) | [45808098106b](https://github.com/systemslibrarian/crypto-lab-snark-arena/commit/45808098106b26da8a69fa56ad5f51809f2b4efa) |
| [crypto-lab-salamander #33](https://github.com/systemslibrarian/crypto-lab-salamander/pull/33) | [828d659533f3](https://github.com/systemslibrarian/crypto-lab-salamander/commit/828d659533f37c538769a45386fb4c55cbbf5d7c) |
| [crypto-lab-multivariate #23](https://github.com/systemslibrarian/crypto-lab-multivariate/pull/23) | [c11034447f72](https://github.com/systemslibrarian/crypto-lab-multivariate/commit/c11034447f72516d0a1fac0ee2d72cd824db3bbf) |
| [crypto-lab-hostile-paths #5](https://github.com/systemslibrarian/crypto-lab-hostile-paths/pull/5) | [bee18d960928](https://github.com/systemslibrarian/crypto-lab-hostile-paths/commit/bee18d960928c1c3cb815ff1828e2ffba76e9609) |
| [cipher-museum #21](https://github.com/systemslibrarian/cipher-museum/pull/21) | [ac659d89de84](https://github.com/systemslibrarian/cipher-museum/commit/ac659d89de8422209fdca944f6d5d5abf9de0797) |

Each merge used the reviewed head as a lease. The deployment status in the JSON ledger is an observed checkpoint; merge completion alone does not establish deployed content.

## Advanced extensions delivered 3 November 2026

- **Ciphertext Mirror:** [live lesson](https://systemslibrarian.github.io/crypto-lab-ciphertext-mirror/?card=imperfect-df-oracle#oracle-information), [implementation PR](https://github.com/systemslibrarian/crypto-lab-ciphertext-mirror/pull/40), merge `44cbf0046d7233548ab0048b5bd4631d7f725c8c`. 74 unit/structural tests, two publishing tests, coverage, lint, formatting and production build passed; 16 hosted browser tests passed. Hosted PR and post-merge workflow receipts are in the JSON ledger.
- **PQ Families:** [live lesson](https://systemslibrarian.github.io/crypto-lab-pq-families/#section-proof-wrapper), [implementation PR](https://github.com/systemslibrarian/crypto-lab-pq-families/pull/28), merge `13acb6a44ca7958bb950ffe513be717b1d08ce54`. 77 unit tests and production build passed; 33 hosted browser tests passed, including the new dependency comparisons. Hosted PR and post-merge workflow receipts are in the JSON ledger.

These are bounded additions to existing lessons. The burst model is an extreme shared-error comparison, not hardware fitting or a new key-recovery engine. The proof diagram is a conceptual dependency audit, not certification of the V2X circuit. Existing blanket hybrid claims were qualified. Selected source rereads do not add full-paper reading credit. The KDF option R20261031-14 is investigated separately below and remains unimplemented. The generated catalog stays at its separately reviewed source pins.

## KDF investigation, 3 November 2026

The [investigation](kdf-calculator-investigation-2026-11-03.md) confirms the converse proof gap and supplies a conditional repair plus an exact deterministic-grid counterexample. It separately derives the sufficient forward bounds without that converse. The [reproducible exact checks](../tools/kdf-investigation-check.py) pass. A restricted educational calculator is supportable under the documented assumptions, but none was implemented or deployed; the unrestricted equivalence remains held.
