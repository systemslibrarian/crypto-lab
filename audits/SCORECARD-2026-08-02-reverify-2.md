# Re-verification slice 2 — 2026-08-02

Re-verifier: subagent slice 2. Read-only pass over demo repos; scores re-verified against
fetched current source, built output driven with Playwright chromium.

Assigned demos (15): garbled-gate, hash-zoo, hqc-vault, isogeny-atlas, isogeny-gate,
jwt-forge, kdf-arena, kdf-chain, key-mirror, lms-ledger, lms-xmss, mac-race,
mceliece-gate, mls-group, multivariate.

| demo | HEAD | prior | current | what changed |
|---|---|--:|--:|---|
| garbled-gate | fcb4b14 | 9 | 9 | Two post-scoring fixes landed: millionaire verdict now decoded from the garbled run with per-gate label validation (7fe9b64), and free-XOR savings split into measured bytes vs labeled counterfactual estimate (fcb4b14). All exhibits verified live: verdict flips correctly with inputs, OT trace real, 19-gate stepper live, label-reuse attack derives Alice's bit and checks the deduction against her actual bit. Prior 9 stands. |

- garbled-gate gaps: 1-100 wealth quantised to 3 bits, so nearby values honestly report "Equal" (displayed, but easy to misread as a bug); quizzes are static multiple-choice; free-XOR classic-garbling comparison remains an estimate (clearly labeled as such).
| hash-zoo | b785c3c | 8 | 8 | Only accessibility/contrast commits since scoring; content unchanged. Verified live: avalanche measured per run (130/256 bits), every-bit sweep really flips 344 input bits (mean 49.8%), and the length-extension forgery resumes from the published tag and is proven by an independent from-scratch SHA-256 recomputation that matches. The held-back reason stands: the sponge/tree half is still static SVGs and prose tabs. Prior 8 stands. |

- hash-zoo gaps: Section C (Merkle-Damgard vs sponge vs tree) is diagrams and tabbed prose with no interaction| hash-zoo | b785c3c | 8 | 8 | Only border-contrast/accessibility commits landed since scoring (b785c3c, a8e4d7d); no pedagogy change. Verified live: length-extension forgery computes a forged tag from the published tag + length and proves it by recomputing SHA-256(secret ‖ glue ‖ append) from scratch to the same 889decf3… value; avalanche heatmap and 344-flip every-bit sweep (mean 49.8%, range 39.8-57.8%) are real. The sponge/tree comparison half is still static SVG diagrams. Prior 8 stands. |

- hash-zoo gaps: Section C sponge vs tree construction is static SVGs + prose, not computed/interactive; the flagship break (length-extension) is the only place anything is forged; nothing in the sponge/tree half can be broken.
