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
| hqc-vault | 6be8c03 | 7 | 8 | Prior gap ("push past the error budget slider cannot reach failure") is addressed: 420a9cc fixed the falsifiable side-channel and bit-flip claims, 6be8c03 distinguishes clean vs tampered trials, and the flip lab now honestly explains why random flips mostly miss the small codeword region while still driving seed-recovery failures at the slider max (observed seed=NO / FO=NO across repeated runs). Tamper-d shows real implicit-rejection with divergent K. Real BM/Chien/Forney decoder intact. Moves 7 to 8. |

- hqc-vault gaps: illustrative (tiny) parameters throughout, clearly labeled; reaching an in-codeword decode failure via the random-flip slider is probabilistic rather than deterministic, so a learner may need several runs to see it; still no live full-size KEM.
| isogeny-atlas | 292594b | 9 | 9 | Only improvements since scoring: c267ea2 stops the CGL walk dead-ending and now reports bits consumed / forced steps honestly (with new walk tests), plus a citation fix (8e4a96d) and contrast work. Verified live: self-checks print into the page against classical theorems (vertex count 37 = ⌊p/12⌋+2, Eichler mass), 58/58 tests pass, vertices/edges discovered by real polynomial factorization. Prior 9 stands. |

- isogeny-atlas gaps: toy prime (37-vertex graph) means the CGL walk can run out of legal moves / hit forced single-neighbor steps — now disclosed rather than hidden; jargon-dense for a first-time learner.
| isogeny-gate | 939eeff | 5 | 8 | Both defects that pinned it at 5 are fixed. c52265a rebuilt the graph so vertices are GF(p)-iso classes and walks carry a live curve — the walk now agrees 64/64 with groupAction, and a new "both orders" exhibit demonstrates commutativity live (verified: 5-then-7 and 7-then-5 both land on vertex 98). 939eeff makes exhibit 1 actually compute φ(P)+φ(Q) and the kernel collapse (falsifiable). The attack really brute-forces, recovers an equivalent secret, reproduces the public key, and discloses the 42% literal-secret rate. Moves 5 to 8. |

- isogeny-gate gaps: one stale unit test still asserts the pre-fix wording ("collapse to O") and fails, so the suite is not green (behavior is correct, the test wasn't updated); toy GF(419) parameters; some panels remain reveal/animate rather than learner-driven.
