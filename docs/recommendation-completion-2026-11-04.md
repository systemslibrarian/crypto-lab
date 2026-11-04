# Recommendation completion — 4 November 2026

All three recommendations selected by the current-source review, plus the KDF mathematical correction, are implemented on their default branches and deployed with verified content. This is a bounded completion record, not a new full-fleet audit or a rereading of the paper collection. The [machine-readable receipts](recommendation-completion-2026-11-04.json) separate reviewed heads, merged commits, test outcomes and deployment observations.

## Delivered behavior

| Recommendation | Result | Delivery |
| --- | --- | --- |
| Ascon nonce-misuse explanation, CL010 | Both honest packets undergo real authenticated decryption. Separate ciphertext and tag modifications produce actual rejection verdicts and empty recipient output. Message edits clear stale evidence; leakage recovery remains separate from recipient plaintext. Wording no longer claims general authentication security under nonce reuse. | [PR24](https://github.com/systemslibrarian/crypto-lab-ascon/pull/24) · [live lesson](https://systemslibrarian.github.io/crypto-lab-ascon/#exhibit-nonce) |
| TLS application/service binding, CL1619 | A separate synthetic route/policy exercise compares cryptographic acceptance, certificate-name matching, SNI policy, ALPN selection and handler binding. Eight routes and four policies include the same-hostname wrong-service case, missing or unoffered ALPN and wrong handlers. The current handshake's actual verifier result remains an independent admission gate. | [PR27](https://github.com/systemslibrarian/crypto-lab-tls-handshake/pull/27) · [live lesson](https://systemslibrarian.github.io/crypto-lab-tls-handshake/#service-binding) |
| Password-record design, CL2864 | Real bounded scrypt F and real SHA-256 H compare invented records F(p), F(p) together with p, and F(p) together with H(p). Actual operation counts show full derivation, direct disclosure and cheap dictionary recovery. Existing absolute per-guess RAM claims are qualified to their displayed cost model. | [PR24](https://github.com/systemslibrarian/crypto-lab-kdf-arena/pull/24) · [live lesson](https://systemslibrarian.github.io/crypto-lab-kdf-arena/#record-design) |
| KDF converse disposition, CL965 / R20261031-14 | The unrestricted deterministic converse is rejected as stated. Complete proofs give the floor-adjusted deterministic replacement and the separately qualified randomized version. The calculator explains the correction beside its results; its supported forward formulas and refusal gates remain unchanged. | [PR27](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/pull/27) · [live calculator](https://systemslibrarian.github.io/crypto-lab-quantum-entropy/#kdf-calculator) · [proofs and counterexample](kdf-converse-resolution-2026-11-04.md) |

## The KDF issue is resolved by correcting the claim

The earlier wording “the calculator does not resolve the broader claim” left the action unclear. The broader deterministic claim is false as written, as shown by the exact eight-atom counterexample. It should not remain an unspecified promise to prove it later.

For N uniform reference atoms, a deterministic test can accept at most `q = floor(δN)` atoms. When q ≥ 1, the correct density threshold uses `δ_eff = q/N` and `t = ε/δ_eff`. The original ratio `ε/δ` follows for an integer-aligned budget, or under the stronger premise covering every randomized test. The zero-budget case is vacuous. The complete proofs explicitly cover all joint output/seed acceptance sets and retain the flat-source and independent-uniform-seed assumptions.

The forward calculator separately uses `η + tδ`, so its two supported examples remain `65·2^-64` and `3·2^-64`. These are conditional application-failure bounds. The correction does not establish output entropy, an HKDF guarantee, or physical source validation. This is a project derivation, not an author-issued erratum or a certification of every theorem in the paper.

## Validation

| Project | Verified before merge |
| --- | --- |
| Ascon | 36 unit tests including official vectors; production build; all 19 hosted browser tests; code scanning; independent source review. |
| TLS Handshake | 303 protocol/model assertions; production build; all 37 hosted browser tests; all 14 existing behavioral source mutations detected; code scanning; independent source review. |
| KDF Arena | 32 unit tests, including 12 record-design tests; production build; all 23 hosted browser tests; code scanning; independent source review. |
| Quantum Entropy | 79 unit tests; Node 22/24 checks and production build; all 27 hosted browser tests; code scanning. |
| Mathematical correction | Independent review of the final proofs and checker; all 256 counterexample acceptance sets; 6,609 exact probability histograms, including 25,140 nonvacuous deterministic and 57,568 randomized premise-satisfying cases; 59,544 vacuous cases kept separate; forward tail checks for every integer b = 6…256. |

The new browser checks found two concrete accessibility defects, both fixed before merge: Ascon's horizontal comparison table needed a named, keyboard-focusable scroll region; the TLS policy selector needed an unambiguous label. The Ascon gate also verifies that ArrowRight actually scrolls the table. Existing workflow gates were preserved. Local Chromium downloads were truncated, so actual browser execution used the pinned browser in hosted CI; successful test discovery alone was not counted as browser validation.

The finite mathematical checks are regression evidence alongside the general proofs. They are not a universal proof by enumeration. The hub now runs the exact checker in its existing README/catalog workflow.

## Deployment observations

| Project | Post-merge workflow | Observed content |
| --- | --- | --- |
| Ascon | [41848486975](https://github.com/systemslibrarian/crypto-lab-ascon/actions/runs/41848486975) — success | Live HTML and both referenced assets match the validated build byte-for-byte. |
| KDF Arena | [41848056012](https://github.com/systemslibrarian/crypto-lab-kdf-arena/actions/runs/41848056012) — success | Live HTML and both referenced assets match the validated build byte-for-byte. |
| Quantum Entropy | [41848498177](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/actions/runs/41848498177) — success | Live HTML and both referenced assets match the validated build; the served JavaScript contains the corrected converse explanation. |
| TLS Handshake | [41849861267](https://github.com/systemslibrarian/crypto-lab-tls-handshake/actions/runs/41849861267) — success | Live HTML and both referenced assets match the validated build; the served JavaScript contains the new service-binding panel. |

Exact merge commits and SHA-256 observations are retained in the JSON receipt. These are bounded build/content comparisons, not an independent live-site penetration test. The four hub cards, affected exhibit maps and generated catalog/navigation data have been reconciled to the reviewed source. Exhibit review scope is explicitly selected; unrelated algorithm-review pins are retained. The final hub gate caught old October date pins behind the updated November card labels; all four selected dates were re-derived from full repository histories with the existing content-path rules, and the unchanged metadata test passed.

## Source and completion boundaries

The source connections are CL010, *[SoK: Security of the Ascon Modes](https://doi.org/10.46586/tosc.v2025.i1.138-210)*; CL1619, *[ALPACA](https://www.usenix.org/conference/usenixsecurity21/presentation/brinkmann)*, with [RFC 9325](https://www.rfc-editor.org/rfc/rfc9325.html), [RFC 7301](https://www.rfc-editor.org/rfc/rfc7301.html) and the current [RFC 9846](https://www.rfc-editor.org/rfc/rfc9846.html); CL2864, *[Multi-Instance Unrecoverability of iMHF-Based Password Hashing](https://eprint.iacr.org/2026/018)*; and CL965, *[Key Derivation Without Entropy Waste](https://eprint.iacr.org/2013/708)*. Each implementation keeps its model limitations visible. None reproduces a full paper's security proof or turns an idealized model into a claim about every implementation.

The previously completed Museum work remains complete. TruePad/ShannonPad's physical entropy-source and independent-seed validation still requires real hardware evidence; this software pass does not supply it. The unrelated FROST-extension and saved zkExp adoption holds remain source-specific dispositions, not newly discovered defects in the existing projects. Historical reading receipts and paper counts are preserved without new full-paper reading credit.
