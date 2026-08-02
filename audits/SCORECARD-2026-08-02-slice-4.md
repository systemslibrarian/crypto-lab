# Crypto Lab — pedagogy scorecard, 2026-08-02, slice 4

Scored 2026-08-02 against the claim-complete bar (SCORECARD-2026-08-01 calibration; no 10s ever awarded).
Repos in this slice, with HEAD short hashes as scored:

model-breach ebc639b · musig-gate 638c110 · nonce-collision 2bb1691 · nonce-lattice 4fee888 ·
padding-oracle 5f2f536 · paillier-gate ddd50d0 · pairing-gate e0f1da0 · pq-families 3862c88 ·
pq-rotation 5ffb07b · pq-tls-handshake 7c86f5e · protocol-checker f335d93 ·
quantum-vault-kpqc dabc9f2 · reshare-circle 985d32e · rsa-educational 261ad16 ·
rsa-forge c287679 · salamander 7222f73 · schnorr-forge a02b70f · shamir-gate a777192 ·
shamir-vs-frost 35eaaba

| Demo | HEAD | Score | Justification |
|---|---|--:|---|
| `model-breach` | ebc639b | **8** | Real AESL (FIPS-197 round vector KAT), a structurally correct toy HiAE, and a black-box key recovery that is genuinely computed — the seed is rediscovered from one keystream query, the forgery is accepted by the real decryption oracle, a random tag is rejected, and the "EXACT MATCH" verdict actually compares recovered bytes to ground truth. Honesty is unusually good: an explicit callout that the browser's 2^16 seed search and the paper's 2^209 MITM are *different techniques*, not one at two sizes. It stops at 8 because Panel B (threat-model map, scenario tabs A/B/C, log-scale bars, academic record, "what the paper shows") is entirely static prose, the headline 2^256→2^209 figure is quoted rather than derived, the standard-model "dead-end" is a scripted spinner rather than a computed impossibility, and the learner never parameterizes anything — Run Attack is the only lever. |
| `musig-gate` | 638c110 | **9** | The strongest demo in this slice. Real BIP-327 over secp256k1 with all 56 official KAT vectors executed on load, per-signer partials verified *in the group* (`s_i·G` vs `(R_i1+b·R_i2)^± + e·a_i·g′·P_i`, byte-compared and displayed), and every finished signature cross-checked against `@noble/curves`' own verifier. Two genuine forgeries run live — Wagner's k-list at reduced challenge width, and **ROS at the full 256 bits with nothing reduced**, 256 sessions in / 257 signatures out — each with the k-sum or linear relation shown matching byte-for-byte, and each shown failing against two nonces via a round-by-round table where `b` visibly moves the target. It carries an explicit "what is asserted rather than proven" panel, 261 unit tests and 247 e2e assertions. Held off 10 only because the 2^85 Wagner cost and the F_127 point count are quoted rather than derived, the BIP-327 rogue-key defence is a bounded miss-loop (a demonstration, not the impossibility argument), and the F_127 plot is a real but separate group from the secp256k1 story it illustrates. |
| `nonce-collision` | 2bb1691 | **8** | The four break paths are all real and all computed: crib-dragging recovers message 2 from live AES-CTR ciphertext, Joux's forbidden attack recovers GHASH `H` and **WebCrypto's own AES-GCM verifier accepts the forged tag**, the hand-rolled Poly1305 verifier accepts a tag from a recovered `(r,s)`, and CBC prefix leakage is shown as a block-by-block byte comparison with a computed shared-block count. Its best feature is precision discipline — a two-indicator layout separating the primitive's return value from the security verdict, and a scoreboard row "Encryption key recovered" that stays **No** everywhere, with the `matches ground truth` flags actually read from the attack result. It stops at 8 because exhibit 4 ("why the forgeries work") — the panel that explains the mechanism — is a pure CSS class-toggle over static HTML with a hardcoded caption, computing nothing and unconnected to the live run; the safe-path verdicts assert "no tag can be forged" instead of attempting the attack and showing it fail; exhibit 6 (GCM-SIV) is prose only; and the e2e suite is a11y + border specs with no functional assertions, so every browser state above is visited by the a11y sweep rather than tested. |
| `nonce-lattice` | 4fee888 | **8** | The old 5-cluster anchor is stale. Full-size secp256k1/P-256 signatures that really verify, an exact-bigint HNP lattice built by the Nguyen–Shparlinski reduction, real LLL, and a byte-grid comparison of all 32 recovered bytes validated through `Q = dG`. Crucially it has a **reachable, learner-caused failure**: drag leak size to 4 bits / 4 signatures, the gauge flips to INFEASIBLE, and the run really returns "no matching key recovered" — and the RFC 6979 preset returns a *different* honest reason ("current leak mode does not yield an HNP lattice instance"), which is the kind of precision most of the fleet fumbles. The 2-D projection is a genuine projection of the real basis rows with per-axis normalisation openly disclosed, and the PS3 derivation prints the run's own `r, h₁, h₂, s₁, s₂, k, d`. It stops at 8 because the "What this run is doing" walkthrough is one fixed four-paragraph template rendered identically under all four step tabs (only the bit count and timing interpolate), the History section and Attack/Defense columns are static lists, and the e2e suite is `a11y.spec.ts` + `a11y-states.spec.ts` only — every state above is visited, none is asserted. |

<!-- ROWS -->

## What would raise it

### model-breach
- Let the learner pick the toy seed / keyspace width and watch recovery time and candidate count move with it, instead of a fixed Generate-then-Run.
- Make the leak micro-explainer read the *live* instance key rather than the hardcoded `deriveToyKey(0x1a2b)` demo key — it currently shows a block unrelated to the instance being attacked.
- Make the standard-model side a real dead-end: let the learner submit a candidate and show there is no predicate to evaluate, rather than a timed spinner that prints a canned "unresolvable".
- Drive the scenario tabs from the attack: pressing Scenario A should actually disable the decryption oracle and show Run Attack failing, so the threat-model contract is enforced rather than described.

### musig-gate
- Derive the 2^85 Wagner k-tree cost in-page from the chosen challenge width and list size (the cost panel already computes list size and point ops) instead of stating it in prose.
- Make the BIP-327 rogue-key defence argue rather than sample: the round loop shows N misses, but the reason (the coefficient is a hash of the key being solved for) is only prose — show the fixed-point equation and why it has no closed-form solution.
- Let the learner set the ROS session count and watch the forgery fail below the bit width required, so the "256 sessions" figure becomes a measured threshold rather than a fixed constant.
- The F_127 plot is excellent but disconnected — draw the secp256k1 aggregate as the same picture (even schematically) so the learner can transfer the coefficient intuition back to the real curve.

### nonce-collision
- Drive the "why the forgeries work" cancellation from the live run's actual tag bytes — show `tag1 ⊕ tag2` computed and the mask term vanishing in real hex, instead of `viz.classList.add('cancelled')` plus a fixed caption string.
- On the fresh-nonce path, actually run the forbidden attack and the Poly1305 recovery and show them failing, so "H stays hidden and no tag can be forged" is a computed result rather than a prose claim.
- Add functional e2e assertions (the repo has only `a11y.spec.ts` and `border.spec.ts`) covering: forged GCM tag accepted, forged Poly1305 tag accepted, CBC shared-block count, and the scoreboard's "Encryption key recovered = No" row.
- Let the learner type the forged message rather than shipping a fixed `"PWNED: nonce reuse forged this tag"` — the forgery is real, but the learner never chooses what they forge.

### nonce-lattice
- Add functional e2e assertions for the four states the page actually distinguishes: recovered (MSB preset), not-recovered-below-floor, not-recovered-no-HNP-instance (RFC 6979), and the PS3 two-signature path. All four exist and work; none is tested.
- Make the "What this run is doing" walkthrough step-specific — it currently renders the identical four paragraphs under Sign, Build HNP, Reduce and Extract, so the guided tabs gate panels without narrating them.
- Show the actual reduced-vector norms alongside the projection: the note correctly says "compare shape, not pixel length" because of per-axis normalisation, which means the headline "watch the vectors get short" is the one thing the picture cannot show. Print ‖b_i‖ before/after.
- Let the learner sweep the gauge and have the page *record* whether each prediction matched the run outcome, turning the feasibility boundary from a drawn curve into a measured one.
