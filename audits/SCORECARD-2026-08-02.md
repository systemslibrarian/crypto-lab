# Crypto Lab — pedagogy scorecard, 2026-08-02

Current scores for the whole fleet, against the claim-complete bar: **every claim the page
makes is computed from that run rather than asserted, every verdict states only what the
protocol actually learned, and every important browser state is tested rather than merely
visited.**

**161 demos scored. No demo has reached 10.** Distribution at the time of scoring:
75 at 9, 70 at 8, 16 at 7, none below 7. `blind-oracle-api` is N/A — a headless backend
with no page to score.

Each entry below carries its justification and a "what would raise it" list. That list is
the work queue for the next tier, not commentary — it names the specific exhibit, assertion
or attack the demo is missing.

## How to read this file

It consolidates the twelve slice files the scoring agents wrote (seven covering
never-scored demos, four re-verifying scores recovered from an older session, one
re-scoring the repos fixed on 2026-08-02). They are preserved verbatim below, in order,
under a heading naming their source. Scores in a later section supersede an earlier one for
the same demo — the `postfix` section is the most recent.

Several scores moved after this file's sections were written, because the demos were fixed
the same day. `SUB8-PROGRESS-2026-08-02.md` records that work with commit hashes; where the
two disagree, the SUB8 file is newer.

## Provenance note carried forward from the recovered 2026-08-01 scorecard

An earlier session's summary asserted that scoring was "complete, all 174 demos, calibrated
to your scorecard". The transcript supported 74. That gap is why every score in this file
names the HEAD it was measured at and what was driven to reach it.


---

## Source: `slice-1`

# Crypto Lab — pedagogy scorecard, 2026-08-02, slice 1

Scored 2026-08-02 against the claim-complete bar (SCORECARD-2026-08-01 calibration; no 10s ever awarded).
Repos in this slice, with HEAD short hashes as scored:

ablation-wire f759ebb · accumulator b5a6fe4 · aes-modes bc61c40 · ascon fb4687f · bb84 f0dde0c ·
biham-lens d15a035 · bitcoin-script 315eb70 · bitcoin-wallet a9debb1 · blind-hello 089dd4c ·
blind-oracle 54be935 · blind-oracle-api 1566252 · blind-sign 190efc8 · broken-trust 937fe68 ·
chacha20-stream e295785 · ciphertext-mirror 3febf0d · ckks-lab bf16da8 · commit-gate d78dc88 ·
curve-lens 9114139 · curve448 9cac9d1

| Demo | HEAD | Score | Justification |
|---|---|--:|---|
| `ablation-wire` | f759ebb | 9 | The closest thing to claim-complete in the fleet: every guided-lab string comes from `wasm.lab()`, all five experiment outcomes re-run the real X-Wing/AES-GCM channel and honestly report wrong predictions ("You predicted X. The channel produced Y."), the two-time-pad recovery is a real XOR crib with its length limit asserted, and CI drives the built page in Chrome asserting UI verdicts against crate-declared expectations plus a 128-state URL round-trip. Held off 10 only because the A1–A5 adversary matrix is assessed from configuration flags (a disclosed, test-pinned model) rather than from mounted attacks per adversary, and the `explain` prose — though delivered through the crate — is still authored rather than derived. |
| `accumulator` | b5a6fe4 | 9 | A real RSA accumulator (Bézout non-membership, dynamic witness repair, hash-to-prime) where every displayed value in the revocation tour is live — GCD(x,u) flips on revocation and the cached proof genuinely goes stale against the new digest. The ten-attack forge panel is predict-then-reveal against the real verifier with exactly two attacks that truly succeed, forged-but-accepted renders as ALARM, and 12 Playwright tests assert (not visit) the stale/forgery/repair/deep-link states, with size readouts test-required to carry TOY markers; 116 unit tests incl. adversarial suite pass. Held off 10 because the accumulator-vs-Merkle recommendation is a heuristic decision tree rather than a computed consequence, and parts of the comparison table lean on stated production sizes (384 bytes) rather than measured ones. |
| `aes-modes` | bc61c40 | 8 | Real crypto throughout: CBC/CTR/GCM via WebCrypto, hand-rolled CCM and ECB block loop pinned to FIPS 197 / SP 800-38A / RFC 3610 §8 KATs (28 unit tests). The padding oracle recovers plaintext byte-by-byte from a real PKCS#7 validity oracle (asserted in e2e to contain the actual secret), CTR nonce-reuse computes P2 live via C1⊕C2, and GCM/CCM tamper rejection is a real AEAD failure asserted REJECTED. Held to 8 because the GCM tag-truncation and nonce-reuse-forgery risks — the subtlest lessons the README raises — are stated in prose rather than mounted, and several mode panels are predict-then-reveal text rather than a computed break. |
| `ascon` | fb4687f | 9 | Spec-built Ascon (AEAD128/Hash256/XOF128) from real bitwise BigInt arithmetic, verified against the full official NIST LWC KAT files (25 unit tests incl. fuzz round-trips). The sponge exhibit renders all 320 live bits steppable per-layer, the S-box microscope computes S(0)=4 from the real bitsliced gate code (no lookup table), avalanche paints the actual round-XOR, and nonce-reuse recovers Message 2 by real C1⊕C2 with the duplex first-differing-block nuance pinned by a test. 12 e2e tests assert the sponge/tamper/leak/XOF-prefix/benchmark states rather than visiting them. Off 10 because the comparison table and "why IoT" panel are editorial prose and the quiz is the only untested-by-computation surface. |
| `bb84` | f0dde0c | 8 | An unusually honest classical BB84 sim: QBER, sifting ratio, Eve-detection threshold, SHA-256 privacy amplification, and the AES-256-GCM round trip are all computed, and the standout move is encrypting under Alice's derived key and decrypting under Bob's so a diverged key genuinely fails the GCM tag — the demo shows the missing-reconciliation hole rather than papering it. 12 node:test unit tests assert QBER-with/without-Eve, sift ~50%, PA determinism and expansion, and the AES round trip. Held to 8 by the fleet's simulation ceiling (CSPRNG, not physics — as it says) and because the rich UI exhibits (per-photon sift table, photon inspector, minimap, Eve annotations) have only an a11y spec — those browser states are visited, not asserted. |
| `biham-lens` | d15a035 | 8 | A genuine last-round differential attack on a toy 4-round SPN: it empirically derives the 3-round characteristic, then ranks all 256 candidate subkeys by measured bias and recovers the real key — I verified independently it lands the correct key at rank 1 (60–100% success with the derived characteristic, wrong-key noise floor honestly reasoned in a code comment). Excellent honesty about the toy's negative saving vs a 16-bit keyspace, a live DDT, S-box microscope, and a steppable differential trace. Held to 8 because the attack engine — the entire headline — has zero unit tests (the 21 tests cover only DDT/SPN/S-box) and only an a11y e2e, so its "ranks the correct subkey to the top" claim is computed but pinned nowhere in the repo; the history/Serpent tabs are editorial. |
| `bitcoin-script` | 315eb70 | 9 | A real end-to-end P2PKH spend on @noble/secp256k1 + @noble/hashes: genuine HASH160 commitment, legacy SIGHASH_ALL preimage, low-S DER ECDSA, and a hand-rolled stack interpreter that steps OP_DUP·HASH160·EQUALVERIFY·CHECKSIG. Boot-validated against the privkey=1 KAT vector; 7 scenarios (more than the README lists) each reject at the correct opcode — I confirmed the live UI verdict computes and names OP_EQUALVERIFY as the abort point for the wrong-key case. 44 unit tests assert the exact failure opcode/status per scenario, DER round-trip, and sighash coverage. Off 10 because the browser UI has only an a11y e2e plus a Windows-only puppeteer smoke test that cannot run here (the verdict/stack rendering is pinned only indirectly via the engine tests), and vitest mis-collects the Playwright spec as a failing suite. |
| `bitcoin-wallet` | a9debb1 | 8 | The full real derivation pipeline on @noble libs: secp256k1 → HASH160 → Base58Check P2PKH and Bech32 P2WPKH, BIP-39 entropy→mnemonic→PBKDF2-SHA512 seed, BIP-32 HD child derivation — validated byte-for-byte at boot and in 36 unit tests against BIP-32 Test Vector 1, both official BIP-39 Trezor vectors, the BIP-173 example, WIF, and a CKDpriv edge case forced via injectable HMAC; the QR encoder is pinned to an independent reference and round-trip decoded. Genuine interaction: I confirmed live key-gen yields valid 1.../bc1... addresses, and flip-a-bit / mangle-the-last-word recompute the real checksum. Held to 8 because it is fundamentally a pipeline visualizer with no adversarial exhibit, and the browser UI has only an a11y e2e (test:e2e is a Windows puppeteer harness) so the rendered stages are pinned only through the engine tests. |
| `blind-hello` | 089dd4c | 9 | Real HPKE (RFC 9180) ECH end-to-end: seal → open round-trips with the inner ClientHello checked byte-for-byte, the AAD/wire splice is a computed diff asserting every differing byte lands in the payload slot (not asserted prose), and every attack is a real consequence — outer-SNI swap and payload bit-flip make the genuine AEAD open fail-closed, and the config-substitution exhibit has the attacker actually decrypt your destination (valid crypto, wrong recipient → ALARM). Crypto comes from the KAT-verified hpke-envelope hub; 48 unit tests assert round-trip, splice-in-payload, both attacks, RFC 9180 vectors, and strict ECHConfig parsing; I confirmed the live observer reads bank.example.com in cleartext without ECH. Exceptional honesty (names the DoH bootstrap circularity; lists what ECH does not hide). Off 10 because the observer/attack UI panels have only an a11y e2e and the wire/DNS are honestly-labeled models. |
| `blind-oracle` | 54be935 | 7 | Genuinely real TFHE-rs FHE: I drove the full flow (via the coi-serviceworker cross-origin-isolation shim) and confirmed client-side encrypt of 42 and 17, a real homomorphic add, and client-side decrypt to 59 — "the oracle computed this without ever knowing either value" is true, with value-dependent fingerprints and probabilistic re-encryption shown, not asserted. But two structural strikes hold it down: the headline add runs on an external Render backend (`blind-oracle-api.onrender.com`), against the fleet's browser-only convention — it was up when I tested, but on a cold/absent free-tier server the page boots to an error overlay, and first load already needs a service-worker reload for SharedArrayBuffer. And the 32 unit tests cover encoding/state-machine/a *mocked* apiClient only — the real FHE add, the entire point, is verified nowhere in the repo (a11y-only e2e); multiply is an explainer button, not performed. |
| `blind-oracle-api` | 1566252 | N/A | Not a browser demo — a headless Rust/axum + TFHE-rs backend (the server half of `blind-oracle`), deployed to Render. No `index.html`, no Vite, nothing to build or serve as a page. Out of scope for pedagogy scoring; its correctness is exercised indirectly through `blind-oracle` (which I verified end-to-end: real homomorphic add, 42+17→59). The `/health` endpoint responded 200 during this pass. |
| `blind-sign` | 190efc8 | 9 | Three genuinely real blind-signature engines: textbook BigInt RSA, RFC 9474 blind RSA with full EMSA-PSS checked byte-for-byte against the official Appendix A vectors (encoded/blinded/blind_sig/sig) for both randomized and deterministic variants and re-verified through native crypto.subtle.verify, and an Ed25519 Schnorr blind flow. The blind→sign→unblind→verify lifecycle steps with real modular arithmetic (I confirmed live: valid verify, then Tamper & re-verify flips to "rejected"), a toy small-numbers mode shows r cancelling by hand, and the applied e-cash/voting/credential exhibits each call the real verifier with a computed negative case (forged coin, double-spend, altered claim all rejected). 31 unit tests including the official vectors and unlinkability/independent-blinding. Off 10 because the browser UI has only an a11y e2e, so the rendered protocol/applied states are pinned only indirectly, and the RSA-vs-EC timing panel is measured-but-decorative. |
| `broken-trust` | 937fe68 | 8 | A real toy reconstruction of the ML-DSA scarce-leakage attack (ePrint 2026/472): the scoring function is provably zero exactly at the true key and hill-climbing genuinely descends it to recover the toy secret — 41 unit tests assert convergence to bestScore 0, recovery from ~4000 noiseless relations across fixed seeds, and the monotone-non-increasing descent property within each tier; the climber never peeks at the secret. Live it runs trials to "recovered ✓" and offers real failure scenarios (Too few leaks, Past toy ceiling) plus a playable/steppable descent, and the real-scale numbers carry PAPER-MEASURED provenance badges separating them from the toy. Exceptional honesty — states plainly it runs NO attack on real ML-DSA. Held to 8 because the real-world consequence is necessarily transcribed paper data rather than demonstrated at scale, and the descent visualization has only a11y/border-contrast e2e (the model is what is pinned). |
| `chacha20-stream` | e295785 | 9 | Hand-rolled ChaCha20 pinned to the official RFC 8439 quarter-round/block/keystream vectors AND cross-checked byte-for-byte against production @noble/ciphers, so the visualization is provably the real keystream. Unusually for the fleet, the important browser states are actually tested, not just visited: ui.test.ts boots the real UI in happy-dom and asserts the Section-A XOR visual equals the ciphertext byte-for-byte, the single-bit avalanche flips >40 of 64 cells, and boot populates a live key/nonce/ciphertext. The nonce-reuse exhibit is a genuine two-time-pad whose crib-drag recovers pt2 (unit-tested), and I confirmed the page boots live with block stepping and the reuse control. 29 tests. Off 10 because it is a single confidentiality-only primitive with one adversarial exhibit, and the block-stepping animation has no full Playwright functional pass (a11y only) beyond the DOM unit tests. |
| `ciphertext-mirror` | 3febf0d | 8 | The cryptographic core is a real FIPS 203 ML-KEM (Keccak, NTT, CBD, compression, FO transform) validated byte-for-byte against the official NIST KAT vectors for 512/768/1024 — 57 tests across sha3/kat/fips203/kem/ntt. The three attack/defense cards are honestly-labeled simulations that nonetheless run real math: the masking CPA's trace model is asserted to satisfy XOR(shares)=decisionBit and distinguisher=product-of-(HW+Gaussian) leaks and reports the actual recovered key bit, and the DF-oracle card runs a genuine sum-product belief-propagation decoder on a toy Tanner graph; I confirmed live that a card resolves and accumulates real key bits. A pipeline primer pins each card to the decap stage it perturbs. Held to 8 because the leakage is necessarily modeled rather than measured off real traces, the per-order trace-cost curves are labeled teaching estimates (not computed from the runs), and the card UIs have only an a11y e2e. |
| `ckks-lab` | bf16da8 | 8 | A genuinely real toy CKKS: real canonical-embedding encode/decode, real RLWE encryption whose decrypt provably uses the ciphertext (corrupting c0 shifts the output, a wrong key yields garbage — tests deliberately corrupt to defeat any plaintext-cache shortcut), and homomorphic add and multiply+rescale where Decrypt(Enc(a)⊗Enc(b)) ≈ a·b is decrypted from the actual product ciphertext, with the scale growing to Δ² then rescaling and relinearization holding degree 1. 17 unit tests cover all of it; the live page steps encrypt→decrypt, the canonical embedding (4 slots → 8 coeffs + noise), homomorphic add/multiply, and a +2048 corrupt-a-coefficient interaction. Strong newcomer on-ramp. Held to 8 because it is a builder/visualizer with only a tamper-to-drift break (no noise-budget-exhaustion or misuse failure exhibit), and the stepped UI has only an a11y e2e — the rendered states are pinned through the single engine test file. |
| `commit-gate` | d78dc88 | 8 | Real commitment mechanics: SHA-256 hash commitments (binding rejection, bounded collision search, C(0)/C(1) indistinguishability gap) and Pedersen over P-256 whose second generator H is derived by genuine try-and-increment hash-to-curve (asserted on-curve and distinct from G). The break-it is real — the no-blinding construction falls to a dictionary attack that recovers 'yes' in 3 attempts (unit-tested), and the additive homomorphism C(m1)+C(m2) opens to m1+m2 and matches the direct point sum. 14 unit tests plus a 12-check verify-ui.mjs that drives the built page and asserts each exhibit's verdict (honest-open ok, cheat rejected, homomorphic sum 43, auction winner Bob 31). Held to 8 because the test suite is modest and single-file, the demo's own verify-ui harness is fragile here (stale h1 assertion; E2 collision-search timed out on my run), and the standard Playwright gate is a11y-only. |
| `curve-lens` | 9114139 | 9 | Exact hand-rolled finite-field point arithmetic on the toy curve (identity, inverse, commutativity, scalar mult wrapping to O at the generator order, with intermediate accumulator states asserted) plus real ECDH across P-256/X25519/secp256k1 via @noble — the RFC 7748 X25519 vector and a matching shared secret on every curve are unit-tested. The finite-field visualization draws the real discrete object with the line wrapping the grid (exactly the honest choice the master template demands over a smooth chord), reals-first then F_17, and the ECDH payoff lands on one literal shared dot before the hex. The break-it is a genuine brute-force ECDLP solve that reveals k. Unusually, ui.test.ts boots the real UI in happy-dom and asserts the drawn points, the finite-field point sum, and "Solved: k = N" — the browser states are tested, not just visited (57 tests across 4 files). Off 10 because production ECDH is delegated to @noble (correctly — the toy curve is the inspectable part) and the brute-force solve is the only adversarial exhibit; standard Playwright is a11y-only. |
| `curve448` | 9cac9d1 | 9 | Real X448 and Ed448 on @noble, validated against the RFC 7748 §5.2 and RFC 8032 §7.4 test vectors byte-for-byte, with the X448 handshake producing matching shared secrets (I confirmed a·B = b·A live) and Ed448 sign/verify plus tamper rejection. The domain-separation exhibit is a genuine break-it — a signature valid under context A is asserted (and shown) to fail under context B, off-diagonal. The clamping is shown on a live bit-grid (two low bits→0, top→1), the seed→hash panel contrasts SHA-512 vs SHAKE256, and the security-margin visual is honestly log-scale (replacing a misleading linear bar). ui.test.ts boots the real UI in happy-dom and asserts the IDENTICAL handshake, the clamp bit-grid cells, and VALID/INVALID sign states — browser states tested, not visited (29 tests across 5 files). Off 10 because the 448-bit arithmetic is delegated to @noble (correctly — the protocol flows, clamping, and domain-sep are the taught parts) and standard Playwright is a11y-only. |

## Per-demo notes

### ablation-wire (9)
- What would raise it: mount A3/A5 as real recorded-then-attacked runs instead of a flag-assessed matrix (A2/MITM already is real); derive at least the matrix's confidentiality column from the actual transmit result rather than `Layers` flags.

### accumulator (9)
- What would raise it: derive the deployment recommendation's inputs (proof sizes, update bandwidth) from the measured table it sits beside instead of a rule tree; measure the production-parameter sizes it currently states (384 bytes) by constructing one 3072-bit witness.

### aes-modes (8)
- What would raise it: mount the GCM truncated-tag forgery (n/2^t) and a GCM nonce-reuse authentication-key (H) recovery as real computed breaks rather than SP 800-38D prose; turn the mode "reveal" panels into compute-both-sides comparisons.

### ascon (9)
- What would raise it: derive the AES-GCM/ChaCha comparison table's cells from the same measured benchmark it ships (tab 9) instead of a static table; make the "why IoT" scenario interactive rather than editorial.

### bb84 (8)
- What would raise it: add a functional e2e spec that drives Run-With-Eve and asserts the QBER climb, the sift table KEEP/DISCARD counts, and the Alice≠Bob GCM refusal against the UI (not just the core module); the simulation ceiling caps it near here regardless.

### biham-lens (8)
- What would raise it: add an attack.test.ts asserting correctKeyRank===1 (or evaluateAttack successRate high) across several keys — the demo already ships `evaluateAttack`, so pinning its own central claim is nearly free; add a functional e2e that drives Add-pairs → Run-attack → reveal-K4 and asserts the recovered key equals the hidden subkey.

### bitcoin-script (9)
- What would raise it: replace the Windows-pinned puppeteer smoke test with a cross-platform functional e2e asserting the rendered verdict + stack per scenario; scope vitest include to tests/ so the a11y Playwright spec stops registering as a failed suite.

### bitcoin-wallet (8)
- What would raise it: add a cross-platform functional e2e asserting the rendered pipeline bytes and the mangle→invalid checksum badge; add an adversarial exhibit (e.g. address-reuse privacy erosion, or a mistyped-word recovery) so the learner causes a consequence beyond visualizing the happy path.

### blind-hello (9)
- What would raise it: promote the engine-level attack assertions into a functional e2e that drives the observer stepped-reveal, the swap/tamper/stale/substituted-config buttons, and asserts the rendered verdicts (leak vs opaque, ALARM on wrong-recipient) against the DOM.

### blind-oracle (7)
- What would raise it: move the homomorphic add client-side (TFHE-rs runs the server key in-browser) so the demo is truly backend-free and cannot go dark; or, if the server split is the pedagogical point, add a functional e2e that mocks the server response and asserts the decrypted sum, plus a graceful degraded mode. Actually perform the multiply instead of explaining it.

### blind-oracle-api (N/A)
- No demo page to score. If it were ever to carry a teaching surface, it would be a status/latency page; as-is it is infrastructure for `blind-oracle`.

### blind-sign (9)
- What would raise it: add a functional e2e asserting the four-step protocol verdict, the Tamper→rejected flip, and each applied exhibit's forge/double-spend/altered-claim rejection against the DOM; unit-test the applied exhibits' negative cases directly rather than only the core engine.

### broken-trust (8)
- What would raise it: add a functional e2e that plays the descent and asserts the recovered ✓ verdict and the failure-scenario ceilings against the DOM; consider a mid-scale instance that computes a genuine relation-count vs success curve the learner can compare to the paper's table, so the headline is partly demonstrated rather than wholly cited.

### chacha20-stream (9)
- What would raise it: promote the happy-dom UI assertions into a Playwright functional pass over the real build (block stepping frames, avalanche grids, crib-drag recovery) so the rendered animation states are pinned in the shipped artifact; add the Poly1305 pairing as a companion break-it (tamper → MAC reject) to close the "confidentiality only" caveat it correctly raises.

### ciphertext-mirror (8)
- What would raise it: derive the trace-cost-vs-order chart from the actual simulated runs (measure traces-to-95% empirically) instead of a labeled estimate; add a functional e2e asserting a card resolves the correct target bit and the blinding defense decorrelates the A/B replay.

### ckks-lab (8)
- What would raise it: add a failure exhibit that exhausts the noise budget (chain too many multiplies without rescale and watch the decrypt degrade to garbage), and a functional e2e asserting the add/multiply/rescale slot results and the corrupt-coefficient drift against the DOM.

### commit-gate (8)
- What would raise it: fix verify-ui.mjs's stale h1 assertion ("commit-gate" vs the real "Commitment Schemes") and the E2 collision-search timeout, then wire it into CI as the functional gate alongside a11y; broaden the unit suite (Pedersen binding under adversarial openings, hash-to-curve determinism).

### curve-lens (9)
- What would raise it: promote the happy-dom UI assertions into a Playwright functional pass over the shipped build (finite-field wrap animation, ECDH shared-dot, brute-force solved-k); add a second adversarial angle (e.g. small-subgroup or invalid-point rejection on the toy curve) to deepen the break-it beyond the ECDLP search.

### curve448 (9)
- What would raise it: promote the happy-dom UI assertions into a Playwright functional pass over the shipped build (handshake IDENTICAL, clamp grid, domain-separation off-diagonal INVALID); make the toy-curve k·G visualizer's hopping the hand-rolled inspectable core it hints at, so at least one arithmetic layer is not delegated.

---

## Source: `slice-2`

# Crypto Lab — pedagogy scorecard, slice 2 — 2026-08-02

Gold-standard scoring pass (Task 6), slice 2 of the fleet. Scored against the
claim-completeness bar: every claim computed from the run, every verdict stating only what
the protocol learned, every important browser state tested rather than visited. Calibrated
against `SCORECARD-2026-08-01.md` (74-demo distribution: mode 8, no 10s).

Repos in this slice (HEAD short hashes at scoring time):

| Repo | HEAD |
|---|---|
| dead-sea-cipher | 72d8bea |
| diffie-hellman-mitm | 34dc9a4 |
| dkg-gate | c3e845a |
| downgrade-wire | 7017e9d |
| e91 | cbc5c1b |
| ec-point-arithmetic | 2e90737 |
| ecdsa-forge | b77b677 |
| ed25519-forge | 8787888 |
| elgamal-plain | 0756539 |
| enigma-forge | 2fd6f6f |
| format-ward | 81ed26b |
| frost-threshold | d50b1d1 |
| gg20-wallet | 86fa94c |
| ghost-commit | 027350b |
| grover | c10b613 |
| harvest-timeline | e617bdd |
| harvest-vault | 29c9ea8 |
| hqc-timing | c7d1bec |
| hqc-timing-break | aec829f |

## Scores

| demo | HEAD | score | justification |
|---|---|--:|---|
| `dead-sea-cipher` | 72d8bea | **8** | All four headline attacks are genuinely computed: the Caesar Break It ran real chi-squared over all 26 shifts and recovered the live shift I set (7), the Kasiski panel factors real repeated-trigram gaps, the OTP key-reuse grid shows a real byte-for-byte C1⊕C2 = P1⊕P2 equality over live random keys, and the GCM tamper verdict comes from an actual WebCrypto decrypt failure, not a flag. Docked because the "Peek Inside GCM" exhibit is a static schematic (role="img") whose tamper "propagation" is a choreographed setTimeout animation — GHASH is never computed anywhere in the page — and the e2e suite asserts only axe a11y, so no attack state is browser-tested (34 vitest unit tests do assert the cipher/attack math). |
| `diffie-hellman-mitm` | 34dc9a4 | **9** | Close to the claim-complete pattern: the BSGS break recovered the exact secret exponent I typed (a=9) and the page states it re-computed g^x mod p and compared it against A before printing that line — the claim self-verifies in-page. The MITM runs real BigInt math with learner-set m1/m2, the interception exhibit encrypts under the two real derived session keys (live AES-GCM iv/ct shown), the toy-modulus key-collision edge case is honestly caught and explained (ui.ts:568), and the signed-exchange verdicts read res.verified/res.accepted from a real WebCrypto P-256 ECDSA verify over a domain-separated transcript that binds both shares. 21 engine tests pass. Held off 10 because e2e is axe-only (no attack state browser-asserted) and the BSGS cost table/bars are static prose rather than measured. |
| `dkg-gate` | c3e845a | **9** | Real ristretto255 Pedersen DKG with computed verdicts throughout: the threshold exhibit prints reconstructed·G and ceremony PK as two live byte-identical hex strings (and a genuinely different pair at t−1, which I drove), the bias exhibit enumerates real 2^k subset sums and steered the key to my chosen nibble under naive commitments while the GJKR mode honestly missed, and the ×20 batch counts wins from 20 fresh ceremonies against an expectation the page correctly labels "independence heuristic", not theory (the HEAD commit is that honesty fix). 96 vitest tests cover field/poly/VSS/DKG/bias. Held off 10: e2e is a11y+reflow only, and Exhibit 3 is a disclosed model of the attack rather than a second full commit-then-reveal ceremony. |
| `downgrade-wire` | 7017e9d | **9** | The strongest test discipline in the slice: strip.spec.ts e2e-asserts the important states (COMPLETED-yet-ALARM, Finished-MAC-mismatch abort, DEFENSE HELD, both compare cards, deep-link autoplay) — exactly the "tested not visited" bar. The DEFENSE_HELD verdict is a real byte-compare of two independently derived Finished MACs over the two transcript views (RFC 8446 schedule, KAT-pinned to the RFC 8448 trace), real X25519+ML-KEM-768 shares actually travel the modelled wire, and the fail-open exhibit teaches the subtle truth that attempt 2 is validly bound because the client really did offer less. Held off 10: the unbound-mode ALARM is an omniscient-narrator judgment from listsEqual rather than anything an endpoint computed (deliberate and disclosed), and the sentinel/history panels are partly checkbox-driven prose. |
| `e91` | cbc5c1b | **8** | The statistical honesty is the best part: the secure/compromised/inconclusive verdict is computed from a 95% CI on the sampled |S| (not a threshold on the point estimate), CI widths genuinely widen when I cut rounds to 1000, Eve's run landed at S≈1.43 — the intercept-resend theoretical √2 — and the correlation table shows real per-cell n/SE from the run. It also teaches the right ambiguity: misalignment/noise reduce S for benign reasons and the page says \|S\| alone cannot name the culprit. Docked to 8 because it is a disclosed classical simulation of textbook QM (calibration: quantum-entropy = 8), the learner's only verb is choosing a scenario chip and Run — nothing is mounted or forged by hand — and e2e is axe-only (28 node engine tests cover the math). |

| `ec-point-arithmetic` | 2e90737 | **8** | A clean constructive visualizer where everything on screen is computed live: λ/x₃/y₃ update in lockstep with the draggable chord geometry, the double-and-add trace for my k=13 showed the real bit-by-bit intermediates (O → 5,1 → 6,3 → … → 16,4) with genuine op counts (12 naive vs 6), the identity edge cases (k=0→O, k=order→O) are one-click, and the ECDLP walk counts real multiples live ("Tried 21/99 — no match yet"). secp256k1 arithmetic is cross-checked against @noble/curves in the 27-test suite. Stops at 8 by the fleet's own calibration for constructive-only demos: there is no break-it exhibit (deliberately deferred to Curve Lens and honestly labeled), the learner tunes and reads rather than attacks, and e2e is axe-only. |

| `ecdsa-forge` | b77b677 | **9** | Every headline claim self-verifies. The toy attack recovered the exact d=7 I typed and then forged a *new* signature the toy verifier actually accepts (main.ts:211 `forgeryVerifies = toyVerify(...)`, gated into the verdict at :218). The 256-bit compromise recovers k then d and prints the real key bytes matching Alice's, and step 5's "returns TRUE" reads `result.forgeryVerifies`. `recoverKeyFromNonceReuse` proves itself by re-signing both messages under the recovered key and byte-comparing against the originals (attack.ts:69-74). Verify flips VALID→INVALID on a message edit. The RFC 6979 "blocked" claim only prints after the recovery genuinely returns null with r1≠r2 — not asserted. 38 tests incl. RFC 6979 A.2.5 KATs. Off 10: the safe-attack button ignores the sample panel and fabricates its own two messages, so the exhibit above it is decorative to the test below it; e2e is axe-only. |

| `ed25519-forge` | 8787888 | **8** | The cofactor exhibit is genuinely excellent and fully claim-complete: it builds R = [S]·B against a real torsion point and prints two verdicts both read from live `ed25519.verify` calls that differ only by `{ zip215: false }` (forge.ts:179-180) — ACCEPTS/REJECTS on identical bytes, no narration. Determinism, verify, and the tamper preset are all real and I drove them (identical sig hex on re-sign; INVALID after the byte-32 flip). Docked one point for a real claim-completeness defect: the determinism verdict "CHANGED — one edit produced a completely different signature" is selected by a *string comparison of the message* (`messageChanged`, ui.ts:382/426) and never compares the two signature hexes it just rendered — the one place the page asserts rather than computes, and the same shape as the `ssh-handshake` finding. E2e is axe-only; 22 unit tests. |

| `elgamal-plain` | 0756539 | **9** | Five learner-parameterized attacks that all print recovered-vs-actual side by side rather than a verdict: BSGS recovered x=300 = actual in a measured 42 operations; k-reuse recovered m2=222 from my typed inputs with no private key; mauling produced a forged CT whose real decryption (1500) matches the predicted m·t; signature k-reuse recovered both k=1571 and x=2035 against the true values; and the authenticated-ElGamal fix genuinely REJECTS the identical attack via a recomputed MAC. The honesty about the tradeoff (the MAC kills the homomorphism the earlier exhibits used) is unusually good. 32 unit tests. Off 10: "every future signature is now forgeable" is the one claim not carried out — no forged signature is ever verified — and e2e is axe-only, so none of the five attack states is browser-asserted. |

| `enigma-forge` | 2fd6f6f | **9** | The best-evidenced attack in the slice. The Bombe really searched 17,576 settings and partitioned every one (17,575 killed by CONTRADICTION, 0 by crib re-check, 1 verified stop) — counts computed, not narrated — recovering positions HCT and Stecker A↔R. `BombeCandidate.decryptedCrib` is documented and rendered as the *computed* decrypt "never an echo of the input crib", so a broken verifier would visibly mismatch. Loading the stop back decrypted to WETTERBERICHTLUERDIENACH… — F↔L still transposed because that pair never touches the menu, which the page teaches as the point ("a stop is a recovered key, not a finished decrypt"). The 60-test suite includes real negatives: a wrong crib must *not* recover, a loopless menu must be under-constrained, and the success banner re-checks the crib rather than trusting the load. Off 10 only because the Bombe is a disclosed teaching-scale logical search rather than cycle-accurate hardware, and Playwright covers a11y/contrast while the state assertions live in jsdom. |

| `format-ward` | 81ed26b | **8** | Real FF1/FF3-1 with genuinely computed teaching: the equality-leak panel counts actual repeated ciphertexts in my typed list, the avalanche readout measured 12/16 symbols changed and states the correct 1−1/radix expectation rather than the folk "50%", the domain calculator computes the floor check in BigInt with a comment explaining that `Math.pow` would silently pass anything, and the ZIP option genuinely refuses to run — a rejection that is the exhibit. The standardization framing is scrupulous (it corrects the common Durak-Vaudenay/FF3-1 misattribution). Held to 8 because the demo's own headline — *why FF3-1 broke* — is entirely prose and citation: Beyne's linear attack is never mounted, so FF3-1 is asserted broken while running perfectly on screen. E2e is axe-only; 30 unit tests. |

| `frost-threshold` | d50b1d1 | **8** | Real RFC 9591 FROST in Rust/WASM, and the aggregation panel does something most demos skip: it independently re-sums the three signature shares mod ℓ in the page and compares against the `s` half the aggregator returned, printing "✓ Checked in this page". Lagrange coefficients are recomputed live from the actual signer ids (1,3,5), the under-threshold toggle produces a genuine WASM error ("fewer signature shares than signing commitments") rather than a fake near-miss, and two different subsets I ran produced byte-different signatures that both verify against a byte-identical group key. Held to 8 because both named attacks — nonce reuse and the swapped-commitment/Drijvers case — are prose only (round1.ts:78 asserts "swapped commitment → rejected" and redirects the learner to the *unrelated* under-threshold toggle), and there is no JS test suite at all: `package.json` has no `test` script, only `test:a11y`. |

| `gg20-wallet` | 86fa94c | **9** | The best verdict discipline in the slice. With the cheat toggle on, both Phase-5 identities print their *computed* points next to the expected G and X and read ✗ FAILS, `secp256k1.verify` independently returns false, and the abort banner is derived from the identities rather than the toggle (a node test asserts the Phase-5 verdict and the final verification can never disagree). The ZK range-proof exhibit is exemplary: the malicious prover is rejected by the range bound alone while checks ②–④ *pass*, and the page says so — "the cheater's algebra is valid, which is exactly why the bound has to exist". It also refuses to overclaim: "This is detection, not attribution", with Exhibit 7 listing what is documented rather than implemented. Real Paillier, real MtA with α+β=a·b shown on live numbers, 19 node tests. Off 10 because the browser tests are a11y/contrast only — every state above is asserted in node, not in the page — and the stack is a scaled-down 2-of-2. |

| `ghost-commit` | 027350b | **9** | The verdict scoping is the sharpest in the slice: the HEAD scan reports "0 CANDIDATES · no findings" and immediately says "Read that carefully: it is a statement about the commits this scan was given, and nothing more" — a verdict that refuses to exceed what the scan saw. The history walk then surfaces the real blob (031b080fd0407bf9, reachable from 2 named commits) with the entropy that flagged it (4.63 over a 4.5 alphanumeric threshold) rather than a boolean. Object ids are computed from git's actual byte layouts and KAT-verified against ids generated by the real git 2.53 binary, and switching to SHA-256 rehashes the whole store. The entropy table *is* the formula, per character. 63 tests. Off 10 because Playwright is screenshots + axe (the scan states are asserted only in vitest), and the rotate exhibit's headline — the scan output is byte-identical after rotation — is left for the learner to eyeball rather than diffed on the page. |

| `grover` | c10b613 | **8** | The simulator half is genuinely computed and the overshoot lesson lands empirically: at n=6 I stepped to the optimal k*=6 and Measure ×100 returned 100/100 target against a theoretical 99.7%; stepping to k=12 the same button returned 0/100 against a theoretical 0.0% — sampled from the live state, not printed. The oracle/diffusion decomposition shows the target amplitude going negative (−0.9983) and the mean line the diffusion reflects about, and the honesty box is explicit that no decoherence, gate synthesis, or error correction is modelled. Docked to 8 because the crypto-impact half — the reason the demo exists — is a lookup table: `KEY_DATA` and `QUBIT_COSTS` in `aes-impact.ts` are hardcoded strings and literals (2953 logical qubits, depth exponent 82), so every AES/hash claim is asserted while the simulator beside it computes. 26 unit tests, e2e axe-only. |

| `harvest-timeline` | e617bdd | **7** | The Mosca calculator is genuinely reactive — X=30/Y=5 gives "35 > 7, exposed for 28 years / RISK: CRITICAL", X=2/Y=1 flips to a computed "+4 years margin", and switching to ML-KEM-768 drops it to RISK: NONE with a sourced FIPS 203 note. Sourcing is unusually careful (it corrects the common misreading of the GRI 2024 bands as "share of experts"). But it carries a falsifiable claim: Exhibit 4's standing caption, "Key Insight: Every year of delay increases the exposure window", sits above a table whose exposure columns are **flat across all five delay rows in 4 of the 5 org presets** (Medical 2/3.0 TB/17% unchanged; Bank, Gov, University all pinned at 100%) — only Tech Startup moves. The arithmetic is right; the headline is not what the table shows. Also: no cryptographic mechanism is computed anywhere — every parameter is a literature table — so nothing can fail. 90 vitest tests. |

| `harvest-vault` | 29c9ea8 | **7** | Every verdict is computed and none over-reaches: the three slider states I drove produced CRITICAL / SAFE / MODERATE with the arithmetic shown inline (35 > 10, 5 < 15, 28 > 20) plus derived Q-Day years and "migration needed to start by 2039" deadlines, and the sector matrix reads `m.atRisk` from the same Mosca evaluation rather than a label. The evidence section carries per-claim confidence badges, and the HEAD commit is itself a correction of a fabricated citation attribution — the honesty discipline is real. It stops at 7 for the same structural reason as its sibling: the README states outright this is "the only demo in the suite that does not implement a cryptographic algorithm", so there is no mechanism to show, nothing to break, and the learner's whole verb set is three sliders and a five-question quiz. 19 unit tests; e2e is axe-only. It also overlaps `harvest-timeline` heavily. |

| `hqc-timing` | c7d1bec | **7** | The constant-time verdict is now genuinely measured — HEAD's commit is exactly that fix, and it shows: with CT on the page reported "no measurable timing gap, 15 of 32 bits correct, 47%", a real coin-flip result rather than a flag read. The distinguisher panel computes σ/√N and z live before you run, and the honesty about the abstract timing model is on the page, not just the README. **But two of the four presets carry a falsifiable claim.** "Too noisy — Heavy noise, few trials. Attack fails on its own" recovered 32/32 bits at 100% on 5 of 5 rerolls (weight=5, noise=12, trials=30), and "Borderline — Partial recovery, see what the attacker is up against" did the same on 4 of 4. The demo's own distinguisher called one of those runs z=2.1σ, "below the 4σ bar, consistent with zero" — and the attack beside it still recovered every bit. The advertised failure branch is unreachable. 26 unit tests, e2e axe-only. |

| `hqc-timing-break` | aec829f | **8** | Unlike its sibling, this one's failure branches are genuinely reachable: across rerolls "Noisy co-tenant" gave 8/8, 4/8, 4/8 and "Few probes" gave 7/8, 8/8, 8/8 — the advertised partial-recovery outcomes actually occur. The Soft-ISD trace is the standout: it prints each carrying position's live hit-rate, reliability |p−0.5| and signed LLR, then shows majority voting 2×1 vs 3×0 → wrong while ΣLLR = +0.60 → right, and it is honest when soft *loses* (I saw 5/8 soft vs 6/8 hard displayed without spin). Docked one point for the same defect the sibling repo fixed at its HEAD and this one still carries: `ui.ts:334` selects the verdict from `!params.optimized` — the toggle — so the page printed "Defense held — the channel is silent, recovery is no better than guessing" directly beside its own computed "6/8 · 75% Soft-ISD". 26 unit tests, e2e axe-only. |

### dead-sea-cipher — what would raise it

- Compute a real (even toy-parameter) GHASH over the displayed ciphertext bytes so the "one flipped byte changes the entire GHASH output" claim is shown, not narrated by a timed animation.
- Add e2e assertions for the attack verdict states (Caesar winner shift, OTP equality row, tampered-verify failure) instead of a11y-only Playwright.
- Let the learner pick the tamper position/bit rather than always flipping bit 0 of byte 0.

### diffie-hellman-mitm — what would raise it

- E2e-assert the four verdict states (exchange agree, break recovery, MITM key split, signed-tamper abort) — currently only axe runs in Playwright.
- Measure the BSGS step counts live per preset instead of the static ~sqrt(p) table (the break already reports its own op count, so the table could be fed from runs).

### dkg-gate — what would raise it

- E2e-assert the ceremony abort (t = n with a doubling-down cheater) and the t−1 mismatch state — both exist in the UI but only unit tests touch the math.
- Implement the commit-then-reveal round as a runnable ceremony so Exhibit 3's fix is driven, not modeled.

### downgrade-wire — what would raise it

- Let the learner check the sentinel bytes themselves (type/compare the last 8 bytes) instead of two pre-checked checkboxes selecting the outcome branch.
- Derive the unbound-mode ALARM from a visibly separate "auditor" pane that shows what data the verdict layer used, making the omniscience explicit in the UI, not just in prose.

### e91 — what would raise it

- Give the learner an attacking verb: let them choose Eve's basis strategy (or design one) and see the resulting S, instead of a fixed intercept-resend chip.
- E2e-assert the three verdict classes and the CI-narrowing behavior (deterministic seeds make this easy — the URL-hash reproducibility is already built).

### ec-point-arithmetic — what would raise it

- Add a small break-it moment in-page (e.g. let the learner run the 99-element subgroup search to completion and recover k on the toy curve) rather than deferring every attack to Curve Lens.
- Promote the optional `npm run smoke` browser test into CI with assertions on the trace/identity states.

### ecdsa-forge — what would raise it

- Make the RFC 6979 safe-attack operate on the two samples the learner actually generated in the panel above it, instead of signing its own internally-chosen `msg / 1` and `msg / 2`.
- Let the learner force the failure mode (a "reuse the nonce anyway under RFC 6979" toggle) so the mitigation panel has a reachable losing branch.
- E2e-assert VALID/INVALID and the recovery verdicts; Playwright currently runs axe only.

### ed25519-forge — what would raise it

- Pick the determinism verdict by comparing the two signature hex strings the page already has in hand, not by `lastSignedMessage !== message`. (Both branches happen to be correct today, but the claim is asserted from the input, not computed from the output.)
- Let the learner choose which of the eight torsion points to forge against and see all eight behave the same, rather than one preset index.
- E2e-assert ACCEPTS/REJECTS in the cofactor exhibit — it is the demo's headline and only a11y is tested.

### elgamal-plain — what would raise it

- Finish the signature-forgery claim: after recovering x, sign a message the victim never signed and run it through the real verifier on the page.
- E2e-assert the five recovered-vs-actual states; the unit tests cover the math but no browser state is tested.

### enigma-forge — what would raise it

- Give the learner a path to close the last gap in-page: a hinted "which pair is still transposed?" step that lets them deduce F↔L from the garbled output, rather than leaving it as prose.
- Run the ring search (advanced) at least once in the guided path so the "rings assumed known" limitation is experienced, not just disclosed.
- Promote a few of the jsdom state assertions into Playwright against the real build.

### format-ward — what would raise it

- Mount *an* attack on FF3-1 at toy parameters — even a scaled-down codebook or distinguisher over a tiny domain — so the reason NIST withdrew it is shown rather than cited. Right now the broken cipher and the sound one look identical on screen, which the page notes but never resolves.
- E2e-assert the ZIP refusal and the equality-leak count; only axe runs in the browser today.

### frost-threshold — what would raise it

- Make the swapped-commitment rejection a real button: substitute one signer's commitment from a different attempt and let the verifier reject the assembled signature. Today the claim is prose and points the learner at a different failure.
- Add the nonce-reuse key-recovery exhibit the "What Can Go Wrong" section describes — the two-equations/two-unknowns solve, run live.
- Add a TS test suite (there is none) and browser assertions for the aggregate/failure verdicts.

### gg20-wallet — what would raise it

- Promote the node assertions (Phase-5 verdict ≡ verification, range-proof accept/reject) into Playwright against the built page, so the states are tested where the learner sees them.
- Implement one of the Exhibit-7 attribution proofs so the abort becomes identifiable rather than merely detected — the demo already names this as the gap.

### ghost-commit — what would raise it

- Compute and display the before/after scan diff on rotate (it is byte-identical, which is the point) instead of asking the learner to compare by eye.
- E2e-assert the two scan verdicts and the SHA-1→SHA-256 id change; Playwright currently takes screenshots and runs axe.

### grover — what would raise it

- Derive the AES/hash impact figures from the same simulator: compute k* and the effective work factor from `optimalIterationsForN`-style formulas at the stated key size, and cite the Grassl depth numbers as sourced literature rather than mixing them into the same table as computed output.
- E2e-assert the measure-at-k* vs measure-at-overshoot contrast — it is the demo's best moment and only vitest sees it.

### harvest-timeline — what would raise it

- Replace the static "every year of delay increases the exposure window" caption with one derived from the rendered rows (e.g. "exposure rises from X% to Y% across these five starts", or "already 100% at delay 0 — delay changes nothing here, which is the worse finding"). It is a stronger lesson *and* true.
- Make at least one panel compute something cryptographic rather than actuarial — e.g. derive the AES/RSA "quantum-vulnerable" classification from key size and algorithm family rather than a lookup string.

### harvest-vault — what would raise it

- Add one concrete mechanism moment: capture a real (toy) key-exchange transcript in-page, then show that a PQC upgrade applied *after* capture leaves the recorded transcript exactly as decryptable — the retroactivity claim demonstrated, not stated.
- Resolve the overlap with `harvest-timeline` (same theorem, same sources, two catalog cards) or make each one's distinct contribution explicit on the page.

### hqc-timing — what would raise it

- Fix the noise presets so the promised failure actually happens: either widen the noise range until recovery genuinely degrades, or reword "Too noisy"/"Borderline" to describe what the classifier really does. As shipped, the page names two outcomes it cannot produce.
- Reconcile the distinguisher with the classifier — a run the panel calls "consistent with zero" (z=2.1σ) should not recover 32/32. Either the threshold rule is stronger than the two-bell model admits (say so) or the model is wrong.
- E2e-assert the CT-on vs CT-off outcomes; only axe runs in the browser.

### hqc-timing-break — what would raise it

- Port the sibling's fix: derive the "channel is silent" verdict from the measured hit-rate spread / recovery accuracy of *that run*, not from `!params.optimized`. As shipped it can and does contradict the number printed next to it.
- E2e-assert the four preset outcomes and the majority-vs-LLR disagreement case, which is the demo's best teaching moment.

---

## Source: `slice-3`

# Crypto Lab — pedagogy scorecard, slice 3 — 2026-08-02

Gold-standard scoring pass (Task 6), slice 3 of the fleet. Scored against the
2026-08-01 recovered scorecard's calibration: no demo has ever scored 10; 10 is
reserved for claim-complete (every claim computed from the run, every verdict
states only what the protocol learned, every important state tested).

Repos in this slice, with the HEAD short hash scored:

| demo | HEAD |
|---|---|
| hybrid-guide | 004680f |
| hybrid-pqc | fa9319a |
| hybrid-sign | e2f7cb2 |
| hybrid-wire | a2482aa |
| ibe-gate | ba74aca |
| icy-dvrf | 24dbcdc |
| iron-letter | 25dba13 |
| iron-serpent | f2e73d0 |
| j-uniward | 03b91e9 |
| jevil | 7af2f2b |
| kem-trap | 3447b30 |
| key-exchange | fc0c51c |
| kyberslash | b1a22cc |
| lattice-fault | e6c7139 |
| lattice-gentle | fca3ad7 |
| lwe-hints | 1429cef |
| matsui-line | 4ea59a6 |
| merkle-proofs | b67c381 |
| merkle-vault | 9c3ea37 |

Distribution: 7 × 2, 8 × 6, 9 × 11. No 10s. Median 9, mean 8.5 — higher than the
2026-08-01 recovered set (mean ~7.7), which is a property of this slice rather than
grade inflation: it is heavy on recently-rebuilt labs (`lattice-fault` Exhibit 4,
`iron-letter`'s two-party rework, `lattice-gentle`'s guided shell) and on demos whose
subject is an attack, which forces a computed consequence. Three anchors from the prior
rubric's 5-cluster appear here — `iron-letter` and `lattice-fault` are now 8, and
`lattice-gentle` is 9; in each case the criticised artifacts are gone from the source,
so those 5s are stale rather than wrong at the time.

Read against the recovered scorecard's own reference points: `matsui-line`, `kem-trap`,
`merkle-proofs` and `jevil` sit with `card-trick` / `spdz-forge` at the top of the 9 band
(no falsifiable claim found), while `hybrid-guide`, `hybrid-wire` and `hybrid-pqc` sit
where `patron-shield` does — real crypto with one headline indicator selected by a flag
rather than computed.

## Scores

| demo | HEAD | score | justification |
|---|---|:--:|---|
| hybrid-guide | 004680f | 8 | The headline re-encapsulation attack is genuinely computed and was verified live: under the naive combiner two transcripts derive byte-identical keys, under the bound combiner they differ, both from fresh randomness per click; the performance tab measures real timings and the KAT suite pins the construction. Docked because the demo's namesake "break a half" playground is toggle arithmetic — the verdict text and the 512/256/0-bit entropy bar are selected by checkbox state, not computed from any crypto — and the component "X25519/ML-KEM-768" secrets are random bytes (candidly disclosed, but the learner never touches a real KEM). E2E is a11y-only; behavioral states live solely in unit tests. |

| hybrid-pqc | fa9319a | 8 | Real X25519/ML-KEM-768/Ed25519/ML-DSA-65 via noble; verified live that when both threat switches fall, each column's "Attacker reconstructed the session key" hex is byte-identical to the real session key — the attacker model grants genuine component secrets and reruns the real combiner, so the hedge (single break yields null) is real code, not a caption. Timings are measured (median of 5), and the honest scope line ("only the *event* of a break is simulated") is prominent. Docked because the signature half asserts its headline — "a forged signature passes" is printed from the threat flags without ever producing a forged signature for the real verifier to accept — and the compromise statuses themselves are flag lookups. E2E is a11y-only. |

| hybrid-sign | e2f7cb2 | 8 | Real draft-16 LAMPS composite (Ed25519 + ML-DSA-65 via noble) with the M-prime construction pinned by unit KATs; every scenario verdict is the literal output of `compositeVerify` on a genuinely constructed forged signature — verified live: single-break scenarios show the intact component rejecting (REJECT with the correct catcher named from computed `caughtBy`), double break shows the composite honestly accepting the forgery as residual risk, and tamper buttons flip real signature bytes and re-verify. No falsifiable claim found. Held at 8 because every attack is a canned scenario button over a fixed forged message — the learner watches rather than mounts — and the page is a single narrow exhibit with a11y-only e2e. |

| hybrid-wire | a2482aa | 8 | Real end-to-end pipeline verified live: X25519 (WebCrypto) + ML-KEM-768 handshake completes with byte-compared matching session keys, AES-256-GCM chat round-trips, and "Tamper with session" flips a real ML-KEM ciphertext byte, re-runs real decapsulation (implicit rejection diverges Bob's key), and subsequent decryptions genuinely fail authentication. Benchmark runs 50 live iterations. The threat tab's verdict ("Session still safe/compromised") is a flag-driven pure function, but it honestly defines "broken" and reveals the broken wire's real secret bytes while masking the survivor — showing rather than asserting the half-unknown HKDF input. Docked for the flag-selected resilience verdict, no attacker-side key reconstruction to byte-compare (as hybrid-pqc does), and a11y-only e2e over 18 unit tests. |

| ibe-gate | ba74aca | 9 | Real Boneh-Franklin BasicIdent over BLS12-381 with every exhibit verdict computed and verified live: the bilinearity test derives both sides from fresh random scalars and byte-compares all 576 GT bytes; a learner-typed message encrypts to a learner-typed unenrolled identity and round-trips; the wrong-key path decrypts to genuine garbage; and the escrow exhibit derives d_ID from s and prints what the derived key actually returned "not an echo of what you typed" — even flagging the honest 32-byte message-space truncation. The Type-3 asymmetric-pairing deviation from the paper is documented in-page down to which assumption changes. Off 10 because the attacks remain guided buttons (issue/refuse/collude picks a narrative frame around the computed decryptions), and browser states are covered by unit tests but the e2e layer is a11y-only. |

| icy-dvrf | 24dbcdc | 9 | The 2026-07-20 audit's five blockers have demonstrably landed: construction identity is pinned (docs/CONSTRUCTION.md + frozen golden transcript vectors), uniqueness/liveness/selective-abort are separated and each shown, and the verifier workbench strictly parses a pasted export with independent state — verified live: a real envelope verifies, a one-nibble beta tamper fails with exactly "β = H(Γ) FAILS" while both DLEQ equations still pass. Withhold-only cast's "the β the withholder already knew" is byte-identical to the honest rerun (checked), corrupt-partial cast aborts with per-equation blame naming the right party. One edge overstatement found: in a mixed corrupt+withhold cast, the "β the withholder already knew" is computed over a cast containing a corrupted partial that could never have verified, so that number is not any publishable output. A11y-only e2e keeps browser states unasserted. |

| iron-letter | 25dba13 | 8 | The prior 5 no longer stands — commit a7a30a9 rebuilt the demo around observable asymmetry, and it holds up live: the ECDH convergence panel really derives both halves (ephemeral-priv x Bob-pub and Bob-priv x ephemeral-pub) and byte-compares them ("✓ Both sides derived the SAME 32 bytes" reads a computed `secretsMatch`); "Try opening with Eve's WRONG key" runs the real decryption and catches the real AES-GCM/OAEP failure, with an honest report-it branch if the impossible ever succeeded; boot runs a KAT self-check; benchmark timings are measured. E2E smoke asserts the round trip and the error path, not just a11y. Docked because nothing beyond the wrong-key failure ever breaks — the MITM key-substitution and nonce-reuse hazards its own What-Can-Go-Wrong lists are never mountable, and the exhibits are seal/open round trips. |

| iron-serpent | f2e73d0 | 9 | Spec-faithful throughout: the WASM Serpent engine and a second, independently hand-rolled introspectable Serpent are both pinned to the official AES-submission vectors (22 KAT-anchored unit tests), and the round visualizer steps real 32-round state from learner input. Verified live: the tamper lab's bit-flips produce genuine HMAC rejections (verify-then-decrypt is itself unit-asserted), and the nonce-reuse exhibit computes CT1 XOR CT2 and PT1 XOR PT2 from two real same-nonce encryptions and shows them byte-identical — the catastrophe demonstrated, not narrated. The security-margin exhibit carries the fleet's most careful honesty framing ("not a countdown to being broken"). Off 10: tamper flips a fixed byte rather than a learner-chosen one, the reuse exhibit stops short of letting the learner mount the crib attack it describes, and behavioral e2e coverage is thin. |

| j-uniward | 03b91e9 | 9 | The most technically ambitious demo in this slice and it checks out: the closed-form UNIWARD cost is pinned against a brute-force reference to 1e-9 including image edges (test run: 15/15 pass), embedding is a real STC h=12 Viterbi over a keyed permutation, the full embed-download-extract round trip runs a real JPEG codec, and wrong-key rejection is a real HMAC failure. Driven live: a learner-typed message embeds, and the three-way LSB/F5/J-UNIWARD comparison computes per-method exposure (10%/4%... at equal payload) with J-UNIWARD genuinely winning; the "placement proxy — not a detector" framing is stated at point of use. Off 10: detectability labels rest on the placement heuristic rather than any real steganalyzer, and e2e only covers a11y/contrast, so the browser flows are visited, not asserted. |

| jevil | 7af2f2b | 9 | The cliff is implemented for real and proven live: honest signing revisits hash-derived positions (so the learner sees a signer outlive n*), the adversarial grind packs fresh points and fires at exactly n*+1, and panel 04 reconstructs the secret from public data with a row-by-row recovered-vs-true coefficient table ("EXACT MATCH — all 12 coefficients"), computed each run over either the base Goldilocks field or the paper's real degree-4 tower. The load-bearing omission (no zk-WHIR commitment) is not just disclosed in KNOWN-GAPS.md — malicious mode demonstrates what its absence allows, and the test suite asserts both the escape and the D+1+boost recovery. Uniquely in this slice, scripts/e2e.test.mjs asserts the load-bearing browser states (grind, duplicates, malicious escape, export/verify round trip), not just a11y. Off 10: the "recoverer has become the signer" payoff is prose — the learner never forges with the recovered key — and the plot honestly admits its curve shapes are illustration. |

| kem-trap | 3447b30 | 9 | Teaches caller-side KEM failure semantics with unusual discipline, and it all held up under live driving: flipping a real ciphertext bit drives SAFE→REJECT (via a computed confirmation-MAC failure) and BROKEN→ALARM (keyed on the real implicit-rejection secret K-bar); length corruption shows rc=-1 ignored and the session keyed on resident buffer bytes; the Bob/Carol provenance panel computes the MAC verifying for Bob and failing for Carol — "shown, not asserted" is literally true. The FO branch is reconstructed from the reference's own math surfaces and KAT-checked byte-for-byte against the real decapsulate; crypto-result and security-verdict indicators are kept separate so forged-but-accepted renders as ALARM. E2E smoke asserts the three verdict states, the resident-bytes case, and permalink restore. Off 10: the oracle surface is exposed but never exploited (no CCA key-recovery), and the timing channel is control-flow-modeled, not measured — both disclosed. |

| key-exchange | fc0c51c | 8 | Five-generation survey where every playground computes: the "Break it" button really brute-forces the toy discrete log and prints Alice's exponent; the MitM panel has learner-editable p/g/a/b and Mallory exponents; real ML-KEM-768 runs with a forge check that flips a real ciphertext bit and reports implicit rejection; and the Module-LWE panel genuinely runs Gaussian elimination both ways — noise off recovers s exactly, noise on lands on a computed wrong non-short vector with an honest explanation. Even the quantum-cost table carries a caveat that its two sources are not directly comparable. Smoke script asserts behavioral states (attack recovers, DH/ECDH agreement). Held at 8: it is a long survey with substantial curated-table content, the Shor exhibit is a classical stand-in (labelled), and the learner triggers demonstrations rather than mounting an attack with anything at stake. |

| kyberslash | b1a22cc | 9 | A genuine adaptive attack, not a lookup: the secret only enters inside the modelled device, the attacker sees cycle counts, derives its threshold from the public platform model, and reconstructs coefficients from which step boundaries were crossed — driven live, 768/768 recovered in 18,432 queries, and the "Recovered key matches secret · 100%" pill is a real element-by-element comparison against the true key (`value === truth`), not a completion flag. Switching to the patched Barrett path recovers 0 bits. The honesty is best-in-slice: the README and the on-screen band figures state exactly which numbers are the paper's measurements, which base cost is invented, and that the secret is collapsed to {−1,0,+1} rather than η1=2's real range. Off 10 because the timing itself is a deterministic model, not measurement (unavoidable in a browser, and labelled), the key is a reduced teaching toy, and e2e is a11y-only. |

| lattice-fault | e6c7139 | 8 | The prior 5-cluster anchor is stale. Exhibit 4 (rebuilt in 01b0821) is the standout: it injects a real loop-abort into a real FIPS 204 ExpandMask, checks the faulty signature against the standard's own ‖z‖∞ line-23 bound, inverts c in the real ring, builds a Kannan embedding and runs real LLL — recovering 256/256 s₁ coefficients in 127 ms, printed against the actual secret, with a what's-real/what's-reduced box naming ℓ=1 vs ℓ=4 and the unevaluated ‖r₀‖ check. Exhibits 1-3 are honest models: CPA correlation over simulated traces (with a caveat refusing the "one point reveals the coefficient" reading), a rejection-fault recovery that discloses its fixed-scale c·s₁ shortcut, and a divide-cycle histogram that explains why it refuses `performance.now()`. Held at 8 because three of four exhibits are simulations rather than real primitives, and e2e is a11y-only. |

| lattice-gentle | fca3ad7 | 9 | The 2026-07-20 audit's five blockers have all been addressed and the fix is visible in the source, not just the changelog. GS-01 in particular: the opening thesis now says outright that the standardized schemes never hand honest users a secret good basis and that the secret is a short vector inside noisy modular equations, with the basis picture demoted to "a geometric lens" and MLWE/MSIS named as the exact problems; commit 2527fd9 and fca3ad7 pin those corrections with tests. The page is a gated guided shell (exhibits reveal in sequence, closing with a five-question exit check). Everything I drove computed: toy-Kyber decrypts with a measured ‖E‖∞=10 against the live q/4 ceiling, ciphertext tamper produces real FIPS 203-style implicit rejection ("receiver holds the fallback key"), and toy-Dilithium signs through real Fiat–Shamir aborts (per-attempt bounds printed) then rejects a tampered z with "recomputed challenge differs — w₁′ ≠ w₁". Off 10: it stays at the notes' toy parameters by design (candidly boxed), the LWE/SIS panels are pick-a-preset rather than open attack, and e2e coverage is thin against 58 unit tests. |

| lwe-hints | 1429cef | 7 | Exceptionally honest and well-sourced for what it is, and that is the ceiling: it says outright in README, model.ts and the UI that it "runs NO attack" — no lattice reduction, no side channel, no randomness — and every displayed number carries an explicit `paper` / `model` / `model-derived` provenance tag plus a heuristic·GAA badge. The fitted C=2 is derived from the paper's own anchor and shown reproducing all four Table 1 rows, with the PDF committed and transcribed. Driven live the estimator recomputes correctly across (n,h) and the "why h·log₂h not h" interactive genuinely collapses ambiguous candidate positions as locating hints are added — the one place a mechanism is shown rather than tabulated. But this is a calculator over two closed-form laws: nothing cryptographic executes, nothing can be broken, and the threat calculator's Safe/Manageable/Dangerous verdict is arithmetic thresholding. 35 unit tests pin the model; browser states are unasserted. |

| matsui-line | 4ea59a6 | 9 | The strongest demo in this slice and the closest thing here to claim-complete. Every verdict I triggered was computed from live counters and stated only what the run learned: the successful break names the winning candidate and its exact margin ("beat the loudest wrong guess by 19/1024"); the starve preset reports the real key's counter losing to a specific impostor and says "more traffic may still fix this one"; the add-a-round preset distinguishes that from a ceiling ("every one of the 256 possible plaintexts is already in the count, so this is the ceiling, not a run of bad luck"). Exhibit 6 refuses to draw the formula's curve — it runs 300 complete attacks in a worker and reports measured 3/35/72/85/97% against the formula's 84–100%, then explains the ranking-vs-leaning gap rather than hiding it. The linear hull effect is measured across ten keys, showing the lemma's prediction and reality parting company. 85 unit tests. Off 10 only because the browser states are unasserted in e2e and the target is a toy SPN by design. |

| merkle-proofs | b67c381 | 9 | Broad and uniformly computed. Everything I drove was real: leaf-tamper and proof-bit-flip both flip to REJECTED against a recomputed root; the domain-separation toggle genuinely makes the second-preimage forgery succeed with it off ("a 64-byte value that was never a leaf just proved its own inclusion") and fail with it on; the Bitcoin odd-node rule reproduces the CVE-2012-2459 root collision with both roots printed and identical; consistency proofs catch rewrite/delete/reorder with old and new roots shown. The standout is the trust-model exhibit, which stages the misconception most demos assert away — a prover-supplied root verifies and the panel says so ("VERIFIES — AND PROVES NOTHING ... self-consistent, security-free"). It then verifies a real pinned CT entry at index 1,234,567,890 of a 2.8-billion-cert log with 32 hashes, and a one-bit certificate tamper rejects it. Scope caveats (pinned STH, no ECDSA check, Bitcoin's differing construction) are stated at point of use. Off 10: 69 unit tests but a11y-only e2e, and the CT signed-tree-head is pinned rather than fetched/verified. |

| merkle-vault | 9c3ea37 | 7 | Correct and honest, but it is the smaller sibling of merkle-proofs and covers a fraction of the same ground. What it does, it does properly: the walk-the-proof mode prints each real `H(0x01 ‖ L ‖ R)` step, the recomputed and committed roots are shown side by side with a byte-for-byte verdict that flips to "❌ The two roots differ" after a tamper (and the panel correctly attributes it to "the leaf or a sibling"), and the CVE-2012-2459 panel computes both conventions' roots live, showing the Bitcoin collision and the RFC 6962 divergence. Docked because there is exactly one attack (tamper a leaf), the second-preimage/domain-separation vulnerability its own README calls "a real structural vulnerability" is described but never made mountable, and 23 unit tests sit behind an a11y-only e2e. Its overlap with merkle-proofs (which does all of this plus consistency proofs, the trust-model misconception, and a real CT entry) is the main thing capping it. |

## What would raise it

### hybrid-guide
- Use real X25519 (WebCrypto) and a real ML-KEM (as sibling demos do) so the component secrets the combiner binds are actual KEM outputs rather than `randomBytes(32)`.
- Make the break-a-half exhibit compute a consequence: e.g. after "quantum breaks X25519," actually hand the attacker the classical secret and show a brute-force over the remaining space succeed/fail at toy sizes, instead of a checkbox-driven headline.
- Add behavioral Playwright assertions (attack collision, combiner-switch key change) — currently only the a11y scan drives the page.

### hybrid-pqc
- Give the signature half the same treatment as the KEM half: when both families are "broken," actually mint a forged composite signature and have the real verifier accept it, instead of printing "a forged signature passes" from the threat flags.
- Derive the per-column `secure`/`hedge-holding`/`broken` status from `attackerRecoversKey` returning non-null, so one code path produces both the badge and the hex.
- Add behavioral e2e asserting recovered-key-equals-session-key per column; today only axe drives the page.

### hybrid-sign
- Let the learner author the forgery: an editable forged message plus a per-component "attacker can forge this one" toggle, so the scenario buttons become learner-mounted rather than three canned presets.
- Expose the M-prime construction interactively (edit ctx, watch the representative and both component signatures change) rather than only in the README and unit tests.
- Add a second exhibit — the demo is a single narrow bench, which is what keeps a technically clean lab at 8.

### hybrid-wire
- Compute the threat tab's verdict the way hybrid-pqc does: attempt the HKDF reconstruction from the attacker's known inputs and show it failing, rather than returning a canned `ResilienceVerdict` from two booleans.
- Let the learner choose the tampered byte (and try tampering the X25519 half) instead of a fixed `ciphertext[0] ^= 0x01`.
- Add behavioral e2e for the handshake/tamper/threat states; 18 unit tests currently carry all of it.

### ibe-gate
- Let the learner mount the escrow: type any identity and have the PKG panel decrypt a ciphertext the learner created in Exhibit 2, closing the loop between the two exhibits.
- Make the time-limited exhibit's "refuse" branch produce a real failed decryption attempt rather than narrating that no key was issued.
- Add behavioral e2e (bilinearity byte-equality, wrong-key garbage, escrow recovery) to match the strength of the unit suite.

### icy-dvrf
- Fix the mixed-cast edge: when a corrupted partial is present, the withholder's "β you already knew" is computed over a cast that could never have verified — either recompute it over the honest subset or label it as not-a-publishable-output.
- Let the learner tamper the exported envelope in-page (a byte picker) instead of relying on hand-editing before paste.
- Assert the load-bearing browser states (cheat casts, blame table, workbench accept/reject) in e2e rather than only axe.

### iron-letter
- Make the MITM key-substitution hazard mountable: let a relay swap Bob's public key in the share-URL/QR flow and show Alice sealing to the attacker.
- Add a nonce/IV-reuse exhibit — the README names it as the first thing that can go wrong and nothing on the page demonstrates it.
- Show the RSA-OAEP envelope's internals (wrapped AES key) the way the ECDH convergence panel shows ECIES, so the two tabs teach at the same depth.

### iron-serpent
- Let the learner pick which byte/bit to flip in the tamper lab, and offer a "MAC skipped" mode so the encrypt-then-MAC ordering lesson can be felt, not just read.
- Finish the nonce-reuse exhibit: give the learner a crib box and let them peel PT1 and PT2 out of the XOR the page already computes.
- Add behavioral e2e for round trip, tamper rejection, and the reuse XOR equality.

### j-uniward
- Run at least one real steganalysis feature set (even a small SPAM/CC-JRM subset) so "Resistant/Detectable" is a detector's output rather than a placement heuristic.
- Let the learner choose an embedding key and a cover image and then attack their own stego image, rather than comparing three methods the page drives.
- Add behavioral e2e over the embed/extract/wrong-key paths; the 15-test node suite covers the core but no browser state is asserted.

### jevil
- Close the loop: after recovery, let the learner sign a new message with the recovered key and have the real verifier accept it — the page says "the recoverer has become the signer" without demonstrating it.
- Replace the illustrative curve shapes in the cliff plot with real evaluations of the candidate polynomials, so the "many fit, then one" picture is computed like everything else.
- Add the zk-WHIR-style degree commitment (or a hash-based stand-in) so malicious mode can be shown being stopped, not just being possible.

### kem-trap
- Exploit the oracle it exposes: even a reduced-parameter chosen-ciphertext loop that recovers a few key bits would turn Exhibit 4 from a surface into an attack.
- Measure the timing channel (or drive it from a modelled cycle count as kyberslash does) instead of representing it as a code path.
- Let the learner choose the flipped bit/byte and the corruption shape rather than picking from three preset mutations.

### key-exchange
- Give the MitM playground a computed consequence — encrypt a message under each half-session and show Mallory reading it — rather than displaying the two shared secrets.
- Let the learner attack the ECDH toy curve the way they can attack the DH group (a brute-force ECDLP button), so the second generation breaks too.
- Trim or tab the survey content; the page's best material (DH break, MLWE noise toggle) sits inside a very long scroll.

### kyberslash
- Support the paper's û-multiplier so the full η1=2 secret range is separated, rather than collapsing to {−1,0,+1}.
- Let the learner set the probe positions and measurement count and watch the recovery degrade, instead of running a fixed 18,432-query campaign.
- Assert the recovery/patched states in e2e; the unit suite covers the oracle but no browser state is pinned.

### lattice-fault
- Bring Exhibit 2 up to Exhibit 4's standard: form c·s₁ as a real product in Z_q[x]/(x²⁵⁶+1) instead of the disclosed fixed-scale shortcut.
- Let Exhibit 4 run the remaining ℓ=4 polynomials so a full ML-DSA-44 s₁ is recovered rather than one polynomial's worth.
- Add behavioral e2e for the four exhibits' verdicts, especially the constant-time timing collapse which renders asynchronously.

### lattice-gentle
- Make the LWE/SIS panels open: let the learner search for a short solution (or run a small BKZ/LLL) instead of choosing among precomputed solution buttons.
- Add one non-toy anchor — even a single ML-KEM-768 round trip via a library — so the jump from n=4 to the standard is shown rather than tabulated.
- Extend e2e beyond the guided-shell smoke to assert the KEM implicit-rejection and Dilithium tamper verdicts.

### lwe-hints
- Instantiate one small concrete LWE instance and actually recover its sparse secret from generated hints, so the O(h log h) claim is demonstrated at least once rather than only estimated.
- Show the GAA doing work: sample hint vectors and plot the empirical distribution against the Gaussian assumption, making the heuristic badge an observation rather than a disclaimer.
- Let the learner supply their own leakage trace/rate profile and see the threshold move, instead of three preset scenarios.

### matsui-line
- Add e2e assertions for the cockpit verdicts and the four presets — the reasoning is impeccable and entirely unguarded at the browser level.
- Let the learner choose an approximation mask by hand (not just auto/strongest/bad) and see the search agree or disagree with them.
- Extend Algorithm 2 to a second subkey nibble so the "four bits are now public" ending becomes a full key recovery.

### merkle-vault
- Make the second-preimage attack mountable (a domain-separation toggle like merkle-proofs has) — the README calls it a real structural vulnerability but the page only describes it.
- Add a consistency/append-only proof, the one Merkle idea the demo names in "When to Use It" and never shows.
- Either differentiate it from merkle-proofs or fold it in; as it stands the sibling demo supersedes it on every axis.

### merkle-proofs
- Fetch and verify the CT log's signed tree head (including the ECDSA signature) rather than pinning it, closing the one gap the page itself names.
- Let the learner drive the tampering (choose the byte/leaf) in the consistency and CT exhibits, as they can in the inclusion exhibit.
- Add behavioral e2e over the eight exhibits' verdicts; 69 unit tests currently carry a page with far more reachable states than that.

---

## Source: `slice-4`

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
| `padding-oracle` | 5f2f536 | **7** | The attack itself is entirely real and entirely computed: WebCrypto AES-128-CBC, a genuine one-bit PKCS#7 oracle, byte-by-byte intermediate recovery shown live, and a full three-block decryption that recovered my typed plaintext in a measured 6,855 queries against a computed 12,288 worst case, with the "byte-for-byte match" badge actually reading an `exact` comparison flag. The AEAD panel is a real `crypto.subtle.decrypt` that really throws, and it even carries an "Unexpected: decryption succeeded! This indicates a bug" branch. But over half the page is static: Panel 1 is an SVG flow plus fixed padding tables, Panel 5 is a prose Hall of Fame, and Defenses 1–2 (Encrypt-then-MAC, constant-time validation) are flow diagrams and paragraphs with nothing to run — only Defense 3 is live. Panel 3's plaintext is hardcoded `"Attack at dawn!!"`, and most importantly there is no way to **remove the oracle and watch the attack die**, so the demo's central defensive claim is the one thing it never demonstrates. Tests are 7 `node --test` cases on the attack module; e2e is a11y + border only. |
| `paillier-gate` | ddd50d0 | **7** | The old 5 is stale — everything on this page is now computed. Real BigInt Paillier keygen in a worker, the semantic-security stack decrypts *each* row live and prints the decryption (not a repeat of what you typed), re-randomization uses the public key only, and the multiply-vs-add callout is genuinely proven: the page adds the two ciphertexts as plain integers, actually decrypts that, and prints the wrong value (`45166368670651443643331231508`) beside the correct `19 + 23 = 42`. The overflow preset really wraps — a 96-bit `N` and a sum one over it decrypts to `5` with the bound printed. What holds it at 7 is that **there is no adversary anywhere**: the README names malleability as the scheme's central hazard ("anyone holding a ciphertext can add to it or rescale it") and the page never lets you do it — you cannot rig the encrypted vote tally, cannot factor a 64-bit `N`, cannot break anything. Scenarios A and B are the same aggregation twice with different labels, the "under the hood" panel is prose math, and e2e is a11y-only. |
| `pairing-gate` | e0f1da0 | **7** | The bilinearity playground is the best thing here and is fully computed — drag `a` and `b`, four structurally different pairings are evaluated live on real BLS12-381 and shown to agree across all 576 bytes. Aggregation sums real G₁/G₂ points, verifies with two pairings, and is honest that the timings are single-run samples while "the machine-independent truth is the pairing count". The rogue-key forgery is real, accepted by the genuine verifier, and correctly rendered as an alarm; PoP then really rejects the rogue key. **But its tamper exhibit's headline evidence does not exist on screen.** "Flip One Bit" usually falls through to `σ → −σ`, whose pairing is the Fp12 conjugate — so `e(σ',G₂)` and `e(H,PK)` are byte-identical for their **first 288 of 576 bytes**. The display truncates at 32 bytes, `markFirstDiff` therefore emits zero `<mark>` elements, and the learner sees two identical hex strings under a badge reading "❌ NO MATCH — different G_T elements"; the README's promised "first differing nibble highlighted" never appears, and the full reveal is unhighlighted too. The on-page SIGNATURE block also never re-renders after the flip, so the tampered σ is invisible. Compounding this, the repo has **no unit tests at all** — `package.json` defines only `test:a11y` — and sections A2–A4, D1, D3–D4 and E are static prose. |
| `pq-families` | 3862c88 | **7** | Mostly a curated comparison corpus (five family panels, head-to-head table, timeline, sizes chart, glossary) rendered from a typed data module — accurate, well-organised, and unusually disciplined about saying so: the confidence meter is labelled "not a measured quantity — directional only", the size chart carries "representative parameter sets — not deployment values". Three sub-exhibits are genuinely live: real SHA-256 Lamport keygen/sign/verify where tampering produces an actual digest mismatch with the new digest printed; a Prange ISD calculator that recomputes bits, per-trial probability and NIST category fit from the n/k/t sliders (21.9 bits at t=10, 273.2 at t=120) with a remarkably honest note that raw Prange lands *below* the floors the sets were sized against; and a 2-D Lagrange–Gauss reducer with computed norms, determinant and orthogonality defect. 53 unit tests. It stops at 7 because **nothing ever breaks**: the Lamport panel's whole lesson — sign twice and both private halves leak — is prose beside a button that will not let you do it, the "Broken combo" preset shows a banner rather than a break, and neither the Rainbow nor the SIKE attack the page is built around is ever run. e2e is a11y-only. |
| `pq-rotation` | 5ffb07b | **8** | For a migration-planning demo this is unusually claim-complete. Mosca's inequality is genuinely recomputed from the sliders and the loaded inventory — moving CRQC to 2045 and Y to 1 took the count from "7 of 9 past the line" to "4 of 9", and each HNDL row states its own exposure arithmetic (`X=100 + Y=1 = 101 vs Z=19`). The tamper lab is real crypto: `@noble/curves` ECDSA-P256 and `@noble/post-quantum` ML-DSA-65, a genuine byte flip printed as `0xA7 → 0xA6`, and the two signature verdicts plus the overall trust verdict computed independently — forging either one alone yields VALID/FORGED/FORGED, which is exactly the lesson. Timeline bars are self-explaining computed counts ("1 of 9 planned Phase 1 actions have a target date on or before today; next: … 2026-08-18"), and injecting a failure really rolls the fleet dot grid back to classical. It also ships a **15-check in-browser verification suite** that re-executes the lab's own claims — the "prove it yourself" affordance most of the fleet lacks — plus 36 unit tests. It stops at 8 because the fleet rotation is an operational simulation rather than cryptography (honestly labelled "simulated hour(s)"), the inventory is three fixed datasets the learner cannot edit, and the only crypto break available is a guaranteed-to-fail bit flip, never an actual forgery attempt. |
| `pq-tls-handshake` | 7c86f5e | **7** | The happy path is fully computed and unusually well evidenced: real X25519 + ML-KEM-768, both sides independently reaching a byte-matched 64-byte secret, the whole RFC 8446 §7.1 schedule shown with this run's real derived/handshake/traffic secrets, a wire inspector whose `0x11EC` offset (`0x004b`) and 1295-byte total are computed from the actual serialized ClientHello, live `performance.now()` timings, and a phase-check suite that asserts the sizes, an RFC 8448 label vector, that the key share appears verbatim in the wire bytes, and that `Math.random` never appears in `src/`. It is also honest that bytes, not compute, are the real cost. Two problems hold it at 7. **It never fails at anything** — Exhibit 2, the demo's headline "safe if either primitive holds", is five static Secure/Broken table rows; there is no tamper, no downgrade, no mismatched-share path, no failing handshake anywhere. And there is a real display/reality contradiction on the demo's signature detail: `hybrid.ts` concatenates `mlkem ‖ x25519` (correct per the draft, and Exhibit 3 renders it that way), but `main.ts:267` prints "64 bytes (32 X25519 + 32 ML-KEM)" and `main.ts:439` prints "Final shared secret = X25519_secret ‖ ML-KEM_secret" — stating backwards precisely the ordering trap the README calls out as an interop hazard. |
| `protocol-checker` | f335d93 | **9** | The clearest example of claim-completeness in this slice. A hand-rolled Dolev-Yao engine really searches: NSPK returns Lowe's attack after "3,517 reachable states, 4,586 candidate injections, depth 5"; ticking Lowe's fix and re-running exhausts 5,264 states; naive DH falls in 12 states, signed DH exhausts in 6 — counts that move with the problem, not decoration. Critically, **the secure verdicts are derived, not asserted**: a "WHY THE REPAIR HOLDS — DERIVED, NOT ASSERTED" panel names the exact unification failure (`{Na, ?nb, M}_pkA` vs the relayable `{Na, Nb, B}_pkA`) and the exact missing capability (`the attacker holds no skB`), produced by the same unifier that finds the attacks. Every term in the attacker-knowledge panel carries the rule that derived it (`DEC`, `SPLIT`, `intercept`, `PUB`, `given`), the verdict language is scrupulous ("no attack in this model within 5,264 states (space fully exhausted) — not a proof of security"), and the perfect-cryptography blind spot is stated at the top of the page with links to the labs whose attacks it structurally cannot see. 52 unit tests including a properties file. Short of 10 because the learner cannot author or edit a protocol — the premise is "hand it a protocol you believe is correct" and the library is three fixed runnable entries plus one link-out — and the 60,000-state bound is never reachable, so the bounded-search caveat is stated but never felt. |
| `quantum-vault-kpqc` | dabc9f2 | **8** | The old 5-cluster anchor is stale. Four real primitives actually compose: WASM SMAUG-T Level 1 and HAETAE Mode 2 built from the Rust crates, AES-256-GCM, Shamir over GF(2⁸), PBKDF2 at 600k. Opening with two of three passwords rebuilds the key and prints a per-cell byte comparison against the true original, every cell earning a ✓. Its best feature is epistemic discipline in the failure paths: below threshold the SMAUG-T pill goes **amber** ("share unavailable · 1 of 2 needed") and the page **refuses to display the original key at all** — "a single share reveals NOTHING about the real key, so its true bytes stay unknown" — while tampering turns the HAETAE pill **red** (`pipeline-step failed`, "signature invalid — container was altered") and stops before any share is tried. Two genuinely different failure modes, different colours, different pills, neither overstated. Honesty is exemplary: "Believed, not proven", the exact parameter sets disclosed against the CLI's higher ones, "not audited", "WASM timing is not constant-time". 61 unit tests plus 10 e2e tests / 36 assertions that assert these exact states — the second-best test coverage in this slice. Note: the previously-reported red dark-theme axe gate **passes at this HEAD** (both themes green). It stops at 8 because everything explaining *why* the PQ layer is safe — the 2-D lattice sketch, the RSA-vs-SMAUG toggle, the glossary, the "Go deeper" cards — is static prose and SVG, the tamper is transient (re-opening afterwards succeeds), and there is no adversary beyond that one button. |
| `reshare-circle` | 985d32e | **9** | Real HJKY'95 in the real RFC 3526 group-14 with Feldman verification, and every claim on the page is computed. Turning an epoch reports "5/5 dealings committed to D₀ = 1 · 25/25 Feldman sub-share checks · 5/5 new shares verify", shows all five shares changing, then reconstructs from A,B,C in **both** epochs and prints two byte-identical secrets with the honest note that "the protocol never performs these reconstructions — this page does it, in tab memory only, to prove it to you". The learner **plans the theft campaign themselves** in a custodian × epoch grid, and the two runs genuinely diverge: without resharing the loot interpolates to a value where `g^v = Y` and the page renders that MATCH as **✗ BREACH** (cryptographic result and security verdict as separate indicators, alarm semantics correct); with resharing the same plan lands on noise and reads **✓ HELD**. Panel 5's counterfactual is computed, not asserted — the honest and cheated secrets are printed side by side differing by exactly `+7` in the last nibble, with `Y·g⁷` shown. Scoping is the most complete in this slice: what is real, what is simulated, what it does not prove, and four "this lab is not…" cards pointing elsewhere. 35 unit tests. Short of 10 because `e2e/` is `a11y.spec.ts` only — none of these states is asserted in a browser — and panel 2's GF(1019) walkthrough is an illustrative miniature (honestly labelled) rather than the real object. |
| `rsa-educational` | 261ad16 | **8** | Every exhibit computes and there are three genuine break paths, all on the learner's own key. Weak-key factoring is real: "KEY BROKEN in 0.1 ms", primes `257 × 263` recovered, `d = 47345` reconstructed, and a ciphertext decrypted with it — with the strategy and iteration count reported ("trial-division, 128 iterations"). The signature tamper prints the two mismatching hashes (`49409 vs 7799`) rather than a badge. Best of all, **the malleability attack is actually mounted**: `Enc(3)·Enc(5) mod n` is computed on the live key and decrypts to `15`, forging `Enc(a·b)` with no private key — and a real WebCrypto RSA-OAEP keypair is generated to contrast against the deterministic textbook ciphertexts. Honesty is precise where it matters: the toy FNV-1a hash is flagged as forgeable, the `e·d = 12·φ + 1` identity is derived from the live key, and Euler's-theorem caveat about `gcd(m,n) = 1` is stated with the CRT repair. It stops at 8 because the headline "2048-bit holds" is an explicitly-labelled GNFS *projection* with the button disabled — nothing runs — the signature exhibit teaches structure rather than a real primitive because of the toy hash, and e2e is a11y + border only against 30 unit tests. |
| `rsa-forge` | c287679 | **9** | Two real attacks, both mounted, and — rare in this fleet — **both shown failing against the safe configuration by actually running them there**. Håstad recovers `"Hello!"` from three e=3 ciphertexts via live CRT and an exact integer cube root; the pick-your-config challenge then generates three genuine WebCrypto RSA-2048-OAEP recipients, CRT-combines their real ciphertexts, takes the cube root, and reports the honest outcome ("not your message — recovered value: (no perfect cube — attack fails)"), naming both reasons. Bleichenbacher is the real thing: 55,547 actual oracle queries over 96 iterations on a real 128-bit key, the interval shrinking to 0 bits with plaintext bytes lighting up left-to-right until `"Hi!"` appears, preceded by a homomorphism lever proven byte-identically on the live key (`Enc(42)·Enc(1000) = Enc(42000)`), plus a "You Are the Oracle" mode that puts the learner in the loop. PSS verify/tamper both run on real WebCrypto keys. Scale honesty is exact: "128-bit demo; real attacks target ≥1024-bit; the mathematics are identical — only scale differs", with the 2^20 "million message" figure correctly attributed to 1024 bits, and the factoring wall's 2048-bit cost cited to GNFS L[1/3, 1.923] and NIST SP 800-57. Short of 10 because e2e is `a11y.spec.ts` alone against 43 unit tests — none of these attack states is asserted in a browser — and the CVE receipt tables and "Why OAEP destroys this" panels are static prose. |
| `salamander` | 7222f73 | **9** | Claim-complete in almost every respect. One real AES-GCM ciphertext is forged so WebCrypto's own verifier accepts it under two keys and decrypts to two different chosen messages, with the block layout labelled by role and the single amber GF(2¹²⁸)-solved block identified. The cryptographic result and the security verdict are drawn as **separately computed indicators** — both tags honestly green, the verdict a REJECT/ALARM — with the design rule stated on the page. The math panel steps the real values (`H₁`, `H₂`, `S₁`, `S₂`, the coefficient `H₁²⊕H₂²`, the RHS, the solved `X`) and shows the two tags byte-for-byte differing before and identical after. Panel 3 is the honesty exhibit and it is genuinely instructive: try to force both readers to see chosen text at one offset and you hit `P₁⊕P₂ = KS₁⊕KS₂` with the actual pad printed and Reader B's forced gibberish shown. Panel 6 runs three candidate fixes against a live forgery and the **folk fix genuinely fails** ("Forgery still accepted under both keys"), while padding and HMAC genuinely reject. The AEAD table is stated per construction with Ascon marked "~ Not by default — do not assume it either way". And unlike most of this slice it has **real functional e2e** (5 specs / 15 assertions) covering the headline, the tamper, the before/after tags, the images, and the fix outcomes. Short of 10 because the tamper note is appended *below* reader cards still reading "✓ Tag VERIFIES", so a quick scan sees a contradiction the prose then resolves, and the partitioning-oracle bridge is prose. |
| `schnorr-forge` | a02b70f | **9** | Hand-rolled BIP-340 with every intermediate on the page and nothing asserted. Signing shows commit/challenge/respond with real `k`, `R.x`, `e`, `s`; verification recomputes **both sides** of `s·G = R + e·P` and prints them byte-for-byte; "Break it" flips a message byte and the real verifier rejects with the reason. All **19 official BIP-340 vectors** run through the same hand-rolled `verify()` — including the malformed cases that must be rejected — reporting 19/19 matched-spec with the exact failing stage per row, and the implementation is differentially tested against `@noble/curves`. The nonce-reuse tab is a genuine algebraic recovery on the learner's own two messages: both signatures share an `R.x`, `x = (s₁−s₂)(e₁−e₂)⁻¹ mod n` is computed with every intermediate shown, and the recovered key equals the real secret. The parity-normalization disclosure exposes `d₀`, even-y flags and the negated `k` on live values. Honesty is exemplary where it would be easiest to cheat: the two-signer linearity teaser is explicitly labelled an "illustrative simplification… insecure against rogue-key and Wagner-style attacks", pointing at MuSig2/FROST for the real engineering. 69 unit tests plus a functional `flows.spec.ts`. Short of 10 because the break-it and nonce-reuse paths are still one-button scripts — the learner supplies messages but never causes the failure the way a faulty signer would — and the workbench's malformed presets are curated rather than learner-constructed. |
| `shamir-gate` | a777192 | **8** | It gets right the single claim most secret-sharing demos fumble. Reconstructing from 2 of 3 does not error and does not lie: it prints the value interpolation actually returned, the integer beside it, and states plainly "this is NOT the secret — every possible secret is equally consistent with these shares". At threshold it recovers `"audit probe"` exactly. The security-proof lab lets you type any candidate and builds the fitting polynomial live, tracking "observed shares eliminate 0 of 257 possible secrets" as a running count — and carries a genuinely expert note that S = 10 fits as the degree-1 line `10 + 65x`, that this is legitimate because the splitter draws every non-constant coefficient uniformly including zero, and that forcing a nonzero leading coefficient would make the count "1 of 257". The failure lab's classifications are computed and honest, including "one digit changed → reconstruction returned 45 instead of 42 — **silently**, because plain `x:y:p` shares carry no integrity check". The full polynomial, prime and degree bound are disclosed. 50 unit tests. It stops at 8 because the failure lab is eight canned menu buttons rather than failures the learner causes, the security-proof lab runs on a fixed GF(257) instance with hard-coded observed shares `(1,75),(2,140)` rather than the split the learner just made, the Real World and Adi Shamir tabs are static prose, and `e2e/` is a11y + border-contrast only. |
| `shamir-vs-frost` | 35eaaba | **7** | The head-to-head core is real and well shown: hand-rolled GF(256) Shamir producing real shares, genuine two-round FROST over Ed25519 with each participant's partial `z_i` emitted as its own chip and a running sum visibly accumulating into one 64-byte signature that `@noble/curves` verifies against the group key, and a Shamir compromise banner that exfiltrates the **actually recovered** secret (`"correct horse battery"`). Visual honesty is careful — the interpolation fan is labelled "an illustration over the real numbers… coordinates chosen for legibility, not the actual share bytes", the share plot is labelled "Conceptual — GF(256) values plotted on integer axes" — and the README documents both RFC 9591 deviations by file (bare SHA-512 binding factor instead of `H1`; trusted dealer instead of DKG), with the dealer caveat repeated in-page. But the entire risk layer the README sells as "interactive compromise cards" computes **nothing**: `src/ui/risk-scenarios.ts` builds all three from hardcoded prose and a fixed participant grid, so "the attacker learns P2's share — with k=3 they still need 2 more" is asserted rather than attempted. **FROST never fails at anything** — Sign is disabled below threshold, so the learner cannot try k−1 signers and watch it not verify — and Shamir's Reconstruct is likewise gated, so this lab never shows the sub-threshold behaviour its sibling `shamir-gate` handles so well. The comparison table, decision guide, pitfalls lists and exposure timeline are static. 29 unit tests; e2e a11y-only. |

<!-- ROWS -->

## Distribution — slice 4 (19 demos)

| Score | Count | Demos |
|--:|--:|---|
| 7 | 6 | `padding-oracle` `paillier-gate` `pairing-gate` `pq-families` `pq-tls-handshake` `shamir-vs-frost` |
| 8 | 7 | `model-breach` `nonce-collision` `nonce-lattice` `pq-rotation` `quantum-vault-kpqc` `rsa-educational` `shamir-gate` |
| 9 | 6 | `musig-gate` `protocol-checker` `reshare-circle` `rsa-forge` `salamander` `schnorr-forge` |

No 10s, and nothing in this slice fell below 7 — this is a stronger-than-average band of the fleet,
running ~32% / 37% / 32% against the 2026-08-01 scorecard's 24% / 38% / 28% at 7/8/9. Two structural
findings worth carrying forward:

- **Three of the prior scorecard's 5-cluster anchors are stale.** `nonce-lattice`, `paillier-gate` and
  `quantum-vault-kpqc` were all cited as 5s in the rubric anchors; all three now compute what they
  display, and two of them have real reachable failure paths. The 5-cluster should not be quoted as
  current calibration.
- **The fleet-wide gap in this slice is browser-state testing.** 15 of 19 repos ship `e2e/` containing
  only `a11y.spec.ts` (± a border-contrast spec). Just four assert functional browser state:
  `musig-gate` (247 assertions), `quantum-vault-kpqc` (10 specs / 36), `salamander` (5 specs / 15) and
  `schnorr-forge` (`flows.spec.ts` / 16). Unit coverage is generally good; the "tested rather than
  merely visited" third of the claim-complete bar is where nearly everything loses its point.

One concrete defect found: `pq-tls-handshake` prints the hybrid concatenation order backwards in two
places (`src/main.ts:267`, `src/main.ts:439`) — the exact interop trap its own README flags. And
`pairing-gate`'s tamper exhibit shows two identical hex prefixes under a badge reading "different G_T
elements", because `markFirstDiff` scans 32 bytes while the values agree for 288.


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

### padding-oracle
- Add an oracle-mode toggle (leaky / silent / Encrypt-then-MAC) and re-run the same attack against it. The page asserts these defenses work; the machinery to prove it is already there and unused.
- Let the learner type Panel 3's target block instead of the hardcoded `"Attack at dawn!!"`.
- Make Panel 1's oracle demo learner-driven: let them edit the last padding byte and predict valid/invalid before the oracle answers, rather than one "Try Live Oracle Query" button.
- Add functional e2e coverage — the repo has only `a11y.spec.ts` and `border.spec.ts`, so the recovered-plaintext match, the query counters, and the GCM rejection are all untested in the browser.

### paillier-gate
- Add the malleability attack the README already names: let the learner take a voter's ciphertext from Scenario B, multiply in `Enc(100)` with the public key only, and watch the tally decrypt to a rigged total. This is the single highest-value missing exhibit.
- Let the learner factor a 64-bit `N` in-page and recover λ, so "bigger is harder to factor" becomes a measured wall rather than a caption on the bit-length selector.
- Merge or differentiate Scenarios A and B — as shipped they are the same homomorphic sum with different row labels and no distinct lesson.
- Step the decryption `m = L(c^λ mod N²)·μ mod N` on the live ciphertext instead of stating it in the "under the hood" prose block; the values are all on the page already.

### pairing-gate
- Fix the tamper exhibit: `markFirstDiff` scans only the first 32 bytes, but the negation fallback makes the two G_T values agree for 288 bytes. Scan the whole 1152-nibble string, jump the view to the first difference, and highlight it in both the truncated and the full reveal.
- Re-render the SIGNATURE output block after "Flip One Bit" so the learner can see the byte that changed — right now the displayed σ is stale.
- Prefer a real bit-flip over the `σ.negate()` fallback, or say plainly that the signature was replaced by −σ and why that makes the pairing the conjugate; the current note is rendered but the consequence (identical first half) is not explained.
- Add a unit test suite. There is none — no KATs, no bilinearity assertions, no rogue-key/PoP regression test — for a demo whose entire claim is real pairing arithmetic.

### pq-families
- Add a "Sign a second message" button to the Lamport panel and show both private halves leaking at every differing digest bit, then let the learner forge a third signature the real verifier accepts. The code (`crypto.ts`) already has everything needed; the lesson is currently a paragraph.
- Make the "Broken combo" preset do something: a Rainbow or SIKE break is out of scope in-browser, but even a link-through to `crypto-lab-multivariate` / `crypto-lab-isogeny-gate` driven by the selection would beat a static warning banner.
- Show the Lagrange–Gauss reduction stepping (the swap/subtract iterations) rather than jumping from bad basis to reduced basis in one click — the intermediate states are the lesson.
- Add functional e2e assertions for the Lamport valid/tamper states and the ISD category-fit thresholds; only `a11y.spec.ts` exists.

### pq-rotation
- Let the learner edit the inventory (add a system, set its sensitivity window) instead of choosing among three fixed demo datasets — Mosca's verdict would then be about their situation, which is the demo's whole pitch.
- Make one tamper path a real forgery attempt rather than a bit flip: let the learner try to produce a valid ECDSA signature without the key and watch the ML-DSA half still hold the line, so "breaking only the classical algorithm is not enough" is demonstrated rather than argued from a flipped byte.
- Surface the verification suite's 15 checks next to the claims they verify, rather than only in a block at the bottom — a check labelled "Measured certificate sizes match the real primitives" belongs beside the size bars.
- Add functional e2e assertions; `e2e/` is `a11y.spec.ts` + `border-contrast.spec.ts` only, so the tamper verdicts and the rollback state are untested in the browser despite being fully tested in `test/`.

### pq-tls-handshake
- Fix the two reversed-order strings (`src/main.ts:267` and `src/main.ts:439`). The code, Exhibit 3, and the README all say ML-KEM ‖ X25519; these two lines say the opposite, about the exact detail the README flags as an interop trap. Add a phase-check asserting the rendered order matches `concatBytes` order.
- Give Exhibit 2 something to run: zero one primitive's shared secret and show the handshake still deriving a usable key from the other half, so "safe if either holds" is demonstrated instead of tabulated.
- Add a failure path — a corrupted ML-KEM ciphertext, a substituted server key share, or a downgrade to 0x001d — and show the derived secrets diverging where the page currently only ever prints "✓ match".
- Compute or cite-with-a-date the Exhibit 6 adoption figure in-page; "about 43% of human-generated HTTPS traffic" is the one headline number on the page with no provenance shown next to it.

### protocol-checker
- Let the learner edit a protocol (add/remove a field in a message, add a session) and re-run. The whole premise is handing the checker a protocol you believe is correct; today the only edit available is one prebuilt Lowe-fix checkbox.
- Expose the state bound as a control. It is fixed at 60,000 and never approached, so "no attack in bound" is never something the learner can watch become misleading — lowering it until a known attack disappears is the lesson the honesty panel describes in prose.
- Add a fourth runnable protocol with a subtler flaw (a reflection or type-confusion attack) so the search finds something the learner did not already read about in the intro.
- Add functional e2e assertions; `e2e/` is `a11y.spec.ts` only, so the attack/no-attack verdicts and state counts are unit-tested but never asserted in the browser.

### quantum-vault-kpqc
- The "why can't a quantum computer break layer 2" panel is the demo's motivating claim and is a static 2-D dot sketch. Let the learner solve the nearest-lattice-point problem at n=2, then n=4, then watch the search blow up — the exhibit currently asserts intractability it never shows.
- Make the RSA-vs-SMAUG toggle run something: seal the same secret under a toy RSA wrap and let the learner factor it, so "harvest now, decrypt later" is demonstrated rather than described in two paragraphs of alternate copy.
- Make the tamper persist (or say plainly that it is a one-shot probe) — currently a tampered container opens normally on the next attempt, which quietly softens "any tampering is detected before it opens".
- The key-comparison grid renders 16 cells for a 32-byte AES-256 key; either show all 32 or label the truncation.

### reshare-circle
- Add functional e2e assertions. Everything worth testing already works and is unit-tested; the browser suite is `a11y.spec.ts` alone, so the BREACH/HELD divergence, the D₀ = 1 rejection, the +7 counterfactual and the 4-of-7 redistribution are visited but never asserted.
- Make the erasure assumption playable: a toggle for "custodian keeps the old share" would turn the fine print ("an attacker who can stop the erasure has stopped the defense") into a run the learner can watch fail.
- Panel 2 re-rolls but never breaks — let the learner drag the update polynomial's constant term off zero in GF(1019) and watch the secret's seat move, joining panel 2 to panel 5's lesson.
- Show the cheating-dealer scope as a run too: the page says correctly that a nonzero constant is sabotage rather than theft; letting the learner attempt to *read* the secret from the cheated round and fail would prove it.

### rsa-educational
- Make the "infeasible" side measurable rather than projected: run the same trial-division/Pollard's rho against a ladder of key sizes (16 → 32 → 48 bits), plot the measured times, and let the extrapolation to 2048 bits fall out of the learner's own data instead of a stated GNFS heuristic.
- Offer a real hash (SHA-256 via WebCrypto) alongside the toy FNV-1a, so the signature panel can show a forgery that the toy hash permits and the real one does not — the page correctly says the toy hash is forgeable but never demonstrates it.
- Close the OAEP loop: after showing OAEP is randomized, feed the OAEP ciphertext through the same malleability multiplication and show the integrity check rejecting it. The claim ("the homomorphic structure above is gone") is currently prose sitting directly under a computed attack.
- Add functional e2e assertions for the four verdict states (valid/invalid signature, factored/secure, deterministic/randomized).

### rsa-forge
- Add functional e2e assertions. The Håstad recovery, the OAEP-config failure, the Bleichenbacher query count and recovered plaintext, and the PSS valid/invalid pair are the four states worth locking down, and none is asserted in a browser today.
- Let the learner choose the Bleichenbacher modulus size (64 / 96 / 128 bit) and plot the measured query count against it, so "the mathematics are identical — only scale differs" becomes a curve the learner produced rather than a caption.
- Make the "You Are the Oracle" mode score the learner: track how many of their conformance calls were right and how much interval they cost by getting one wrong.
- Wire the "Why OAEP destroys this attack" bullets to the run that just happened — the OAEP-config challenge already computes the evidence for all three, but the bullets restate them as general prose.

### salamander
- On "Flip one ciphertext byte", re-render the reader cards as REJECTED (or visibly grey them) instead of appending the tamper note under cards that still read "✓ Tag VERIFIES (WebCrypto)". `renderTamper` computes both booleans already; only the display is left stale.
- Make the partitioning-oracle bridge runnable, even at toy scale: one ciphertext verifying under a set of candidate keys is the natural next exhibit and is currently the only major claim on the page that is argued rather than shown.
- Let the learner choose the number of keys (2 vs 3) and watch the solve need a second free block — the expert note already states this, and the machinery to demonstrate it exists.
- Show the ciphertext bytes actually changing in the block map after the tamper, so the flip is visible where the layout is.

### schnorr-forge
- Let the learner pick which byte to flip in "Break it" (and see it still reject), rather than the page choosing — the rejection is real, the agency is not.
- Give the nonce-reuse tab a plausible cause the learner picks: a low-entropy RNG, a reset counter, a copied `aux`. Right now it is a switch labelled "same nonce", which teaches the algebra but not how the mistake happens.
- Let the Verify Workbench build a malformed input by hand (edit one nibble of the public key, push `s` past `n`) and watch the five-stage pipeline stop at a different stage each time; the presets already prove the pipeline works, but the learner never constructs a rejection.
- Extend `flows.spec.ts` to assert the 19/19 vector tally and the recovered-key-equals-secret state — both are the page's load-bearing claims and are currently only unit-tested.

### shamir-gate
- Run the security-proof lab on the learner's own split instead of the fixed GF(257) `(1,75),(2,140)` instance — the same argument over their own shares is far more convincing than over a canned pair.
- Let the learner cause the failures: hand them an editable share string and let them duplicate an x, change a digit, or paste a share from a different split, rather than picking from eight prepared buttons.
- The corrupted-digit case is the best lesson on the page ("returned 45 instead of 42 — silently"). Follow it with an optional checksum format the learner can enable and watch the same corruption get caught.
- Add functional e2e assertions for the below-threshold verdict text, the at-threshold recovery, and the "eliminates 0 of 257" counter; `e2e/` currently holds only `a11y.spec.ts` and `border-contrast.spec.ts`.

### shamir-vs-frost
- Make the FROST compromise card run: hand the attacker P2's real share, let them try to produce a valid signature alone, and show the verifier rejecting it. The card currently states the outcome in `risk-scenarios.ts` as a string.
- Let the learner select k−1 signers and press Sign anyway, so the aggregate visibly fails to verify. Disabling the button hides the very property the page is arguing for.
- Un-gate Shamir's Reconstruct below k and show what interpolation actually returns (the sibling `shamir-gate` does this well) — the asymmetry is currently invisible on both sides.
- Add functional e2e assertions for the two key badges ("YES — it sat in memory" / "NO — never assembled"), the partial-sum aggregation, and the Ed25519 verification result; `e2e/` is `a11y.spec.ts` only.

---

## Source: `slice-5`

# Crypto Lab — gold-standard pedagogy scoring, 2026-08-02, slice 5

Scored by a single agent against the 2026-08-01 recovered scorecard's calibration (no 10s;
9 = exceptional, learner-driven, zero falsifiable claims found). Read-only pass: no demo
repo was modified. Scoring method per demo: fetch + HEAD noted, `npm ci`, README + source
read, `npm run build`, built output served via `vite preview`, page driven with Playwright
chromium (main exhibits + failure/tamper paths), test suite skimmed.

Repos in this slice (HEAD at scoring time):

| repo | HEAD |
|---|---|
| shor | e4146a3 |
| signed-bytes | c36ea47 |
| simon-period | 9c8413a |
| stego-suite | 927cfb2 |
| stream-ward | 3eec4bc |
| syndrome-drain | 06d7279 |
| syndrome-hints | bee3409 |
| threshold-decrypt | 92f5d3b |
| threshold-mldsa | 751ddb5 |
| timing-oracle | 675ccca |
| timing-sidechannel | e6315e2 |
| traitor-trace | 6d5b179 |
| vdf | fb54d03 |
| vigenere-break | 858b405 |
| vss-gate | 6fb7754 |
| world-ciphers | 1779dc0 |

## Scores

| demo | HEAD | score | justification |
|---|---|:--:|---|
| shor | e4146a3 | 9 | The engine is honest end-to-end: the quantum measurement is sampled from the full r-peak QFT distribution and everything downstream runs on the r recovered by continued fractions, never the classically known one — unhelpful peaks genuinely force resamples and base retries. Driven live: the "why r factors N" explainer substitutes the actual run's a=208, r=870, gcd results; the phasor wheels compute Σe^iφ from live phases and choose "add"/"cancel" from the computed magnitude, with learner-retunable on-peak/sampled/off-peak frequencies. Every quantum step is labelled "(classically simulated)". Tests assert invariants (a^r ≡ 1 for every reported CF step, 75-run stress at the hard N values). Held off 10: the RSA Impact panel's complexity numbers are a static (sourced) table, and the learner observes/retunes rather than breaks anything. |

| signed-bytes | c36ea47 | 9 | The verdict-separation architecture is real: "Signature: VALID" and "Verdict: ALARM" are independently computed (raw noble Ed25519 boolean vs canonical-form meaning comparison across first-wins/last-wins parsers), and I watched the centerpiece produce exactly that pair live from the signed dup-key bytes. The Stage 5 tolerance matrix is 16 genuine sign/verify runs (verified cells flip correctly as the boundary slider moves), the JCS toggle re-runs every stage and the dup-key case is genuinely refused at parse. 132 passing tests assert all three verdict states including 'alarm', plus JCS property tests. No falsifiable claim found in the driven session. Off 10 only because the opening walkthrough is guided rather than learner-authored and meaning-equality is definitionally last-wins rather than surfaced as a choice. |

| simon-period | 9c8413a | 9 | An exact statevector simulation rather than a sampled output distribution, and it uses that honesty: the Even-Mansour verdict derives k₂ from one classical query and checks the predicted block against the real cipher (the panel says the full 32-block sweep is the page checking itself, not part of the attack), and the CBC-MAC target forges a tag on a never-queried message the real MAC accepts. The control target correctly reports "rank reached n, that is a proof, not a timeout," and candidates are verified against f over the whole domain before being reported. The query race prints measured means from 40 real trials per width and the page volunteers that the gap "looks modest here" at n=4-6 — a demo grading its own headline down. 78 tests assert exact amplitude identities, half-cancellation to machine zero, and the extra-collision case. Off 10: two of the four listed breaks (Feistel, slide) are cited only, and the interference grid needs a measurement before it does anything. |

| stego-suite | 927cfb2 | 8 | Unusually honest for a stego demo: the Westfeld-Pfitzmann statistic is real (incomplete-gamma Q, degrees of freedom counted from the pairs the carrier actually populates, with the code commenting on why hard-coding 127 would false-positive a limited-palette cover), the chi plot's dof caption is generated from the dof used, and the adaptive-vs-sequential comparison reads its verdict off the two computed pEmbed values through four branches instead of asserting adaptive wins. The detectability curve is a real measured sweep that shows 10%/50% payloads evading and only 100% detected — the demo publishing its own detector's blind spot. LSB and DCT round-trips both extract correctly on live pixels. Held at 8: exhibits 4 and 5 are self-labelled "inspired"/"educational simplification" rather than F5 or WOW, exhibit 6 is prose, and at 39 tests the UI-level dependency-hint and detection-verdict states are asserted only indirectly. |

| stream-ward | 3eec4bc | 9 | Every accept and reject on the page is the genuine hand-written verifier's answer, and I confirmed all six cells: chained rejects truncate/reorder/drop with specific codes (TRUNCATED_STREAM, SEGMENT_AUTH_FAILED with a per-segment explanation naming the sequence number and chain state), naive accepts all three silently and shows the corrupted settlement ledger with the moved and missing lines called out. The scorecard is filled from what the verifier actually reported ("6 of 6 run", nothing pre-written) and the page carries an explicit REAL HERE / MODELLED HERE split. 81 tests, including "rejects a swap of ANY two distinct frames, not just the demo default" and "rejects truncation at EVERY length" — the generalization the demo's single button cannot show. Off 10 for exactly the thing the page admits: exhibit 1's memory ceiling is a model of tracked allocations, not a measured footprint, and the three attacks are fixed presets in the browser. |

| syndrome-drain | 06d7279 | 7 | Exceptionally honest about being a model — "runs no attack, no decoding, no DOOM execution, no random numbers," an inline "idealized √D model" badge on every derived number, and both a computed crossover marker and the paper's full-ISD marker plotted per scheme with an `agree` flag computed rather than asserted. The [7,4] Hamming primer is real GF(2) arithmetic: I flipped bits and the row-by-row H·e parities, the syndrome, and the weight-2 collision partner all recomputed correctly, including the honest "the code says a single flip at position 5" when the true error was weight 2. But the headline exhibit is a curve you drag a slider along; the drain is arithmetic on published constants, nothing is ever decoded, and the √M panel is a deterministic scatter illustrating the bargain rather than measuring it. Only 23 tests for an 803-line UI. |

| syndrome-hints | bee3409 | 9 | The attack genuinely runs: pressing Run executes 15 real Prange/Stern decodes on distinct seeds and reports median work with a p10-p90 spread, median permutations and a "✓ verified" that comes from checking the recovered e — at 0 hints I measured 20.0 bits / 1,450 permutations, at 10 of 11 hints 11.1 bits / 3 permutations. The chart overlays measured dots on modelled curves and says which is which. The scope discipline is the best in this slice: a README table splits the three hint channels into implemented / modelled / cited-only, an in-page ADAPTED badge admits the slider leaks the informative coordinates so "≈ w hints" is this model's best case, and the approximate-hint panel states outright that its discount is "modelled, not executed." Tests include adversarial cases — a contradictory hint never yields solved-but-unverified, and a test asserting the bound does NOT separate the real Level-1 parameter sets. Off 10 because the second hint channel is unexecuted and the attacked instances are n=64 toys, not a real KEM. |

| threshold-decrypt | 92f5d3b | 8 | Real P-256 ElGamal with DKG, Feldman shares and Chaum-Pedersen partials, and the standout is the verifier's per-equation attribution: after injecting the cheating partial I watched P1 fail exactly the two equations the prose predicts (challenge and c1^s = a2·d^c) while g^s = a1·y^c still held, with the narrative explaining why d appears in only one. Recovery genuinely re-runs `checkPartialDecryption` over every selected partial and names the rejected ones rather than trusting the earlier badge, and the code comments show the "unverified vs rejected" distinction was made deliberately so no verdict is printed before it is computed. Held at 8: the cheat is a single canned button (the learner picks neither the cheater nor the modification), exhibit 5's compromise panel is a modelled statement rather than a mounted collusion, and 38 tests is thin for a five-exhibit page — the UI tests assert rendering and locking but not the reject-then-refuse-to-combine path. |

| threshold-mldsa | 751ddb5 | 7 | The honesty is best-in-slice and structural rather than footnoted: the sign button returns "Signature is valid — but this build combined the key to make it. Custody achieved; key-non-reconstruction NOT achieved," with two separate verdict cards and a sentence stating both describe the same run. Disabling the phone produces a real single-share attempt the unmodified FIPS 204 verifier really rejects, the additive share combiner operates on live bytes of the genuine ML-DSA-65 key, and tests explicitly guard against regressions ("carries NO fabricated MPC byte counts", "benchmark reports only measured wall-clock time"). It stops at 7 for the reason it states itself: the thing in the title is not implemented. The round walkthrough is choreography on toy mod-97 polynomials that does not produce the emitted signature, so the learner never sees a threshold signature made, only split custody plus a research table. |

| timing-oracle | 675ccca | 8 | The verdict layer is the model other timing demos should copy: every panel computes a relative gap from live `performance.now()` samples and prints either "Leak detected" with the measured percentage or "Signal below noise this run" with why — and in my headless run it did both honestly (string compare 67% leak, HMAC slope leak, RSA and cache both correctly inconclusive rather than claiming a win the timer could not resolve). The deterministic mechanism animations are exact instruction counts, not the clock: 20 vs 25 byte checks with the bail-out named, and 5 multiplies for 5 one-bits with a test asserting the naive multiply count equals the Hamming weight. Caveats about JS not being constant-time at engine level are inline, not footnoted. Held at 8: the learner measures and compares but never mounts the recovery — no panel walks the oracle to extract the secret byte by byte, which is the payoff a timing-oracle demo owes. |

| timing-sidechannel | e6315e2 | 9 | The learner mounts the real recovery and it works: on the operation-count channel the attack extracted a random 12-character secret ("pwquycgxz1m-") the attack code never sees, position by position, printing a computed 6.2σ separation and the byte counts behind it; retargeted at the constant-time comparator the same attack collapses to chance and says so. On the live `performance.now()` channel in headless chromium it honestly returned "Partial recovery — 0/12 ... timer noise derailed the rest this run. The leak is real," which is the correct verdict rather than a claimed win. Two disclosures stand out: that a bare early-exit compare does not leak its last byte and this oracle appends a sentinel to make it do so, and that the timed comparators wrap each byte in a mixing loop to clear the coarse timer. Tests assert full recovery, recovery under sub-signal noise, failure against constant-time, and that full recovery reads as an alarm rather than a success. Off 10 because the headline result is reliably reachable only on the modelled channel. |

| traitor-trace | 6d5b179 | 9 | The strongest demo in this slice. Revoking #7+#12 recomputes a real SD cover (2 wraps vs CS 6 vs naive 14, "0 keys reissued"), all sixteen decoders run genuine AES-GCM against the real ciphertext, and the tracer binary-searches with visible dud/real probe vectors — six probes named #12 and the page then cross-checks its own accusation against ground truth ("CORRECT — you did copy #12's keys"). Crypto result and security verdict are separate everywhere: the pirate box shows "AES-GCM ✓ opened" beside "✗ BREACH". Best of all it demonstrates its own limit rather than describing it — the evasive coalition run blamed 9 different subscribers over 25 seeded traces and reported "FALSE ACCUSATION — 16 of 25 runs blamed a subscriber whose keys are NOT in the box," reproducible from a seed link, with a box's-eye panel showing the entry asymmetry that makes probe detection possible and why a lone box has nothing to compare. e2e specs assert the header numbers, the breach-accuse-die sequence and the histogram's seed reproducibility. Off 10 only because what the full NNL procedure does about the coalition case is told, not run. |

| vdf | fb54d03 | 8 | Everything cryptographic is live and the cost claim is arithmetic on real counters: 2,048 sequential squarings vs 377 mod-N verify operations, printed as "≈ 5× cheaper" — an honest small number at toy T rather than a borrowed asymptotic. Both tamper buttons flip a real bit and the Wesolowski identity genuinely fails ("π^ℓ · x^r ≡ y failed — Rejected"), and the trapdoor path is isolated in its own module, never wired into eval or verify, and produces byte-identical y with no delay, making the unknown-order assumption concrete. Docked to 8 for one exhibit that is exactly the fleet's banned pattern: "Try 4 parallel workers" is four CSS lanes animating to the same width with a hardcoded note that the step count is unchanged — the load-bearing claim (parallelism cannot shorten the chain) is the one thing on the page asserted rather than computed. 11 tests is thin, with no coverage of the tamper or trapdoor UI states. |

| vigenere-break | 858b405 | 9 | Every number is measured from the ciphertext in front of you and the failure paths are the best part. The full break recovered LEMON and the Declaration text, with the "Cipher broken" verdict derived from computed English-quality signals (word-hit 57%, bigrams 94%, IoC 0.0747, combined 98%). Forcing the wrong key length L=7 produced NLEKNLU, gibberish plaintext, and an honest "Not English yet — one or more columns are off" at 14% combined; a 12-letter ciphertext produced "No repeated substrings of length ≥ 3 — Kasiski yields nothing here" and "No period produces an English-like IoC ... inconclusive." The Kasiski panel even warns that factors 2 and 3 divide every spacing so they always score highest — a demo arguing against its own strongest-looking evidence. 72 tests. Off 10: the corpus and scoring are English-only by construction, and autokey/running-key variants are named as future work rather than shown to resist this attack. |

| vss-gate | 6fb7754 | 8 | The verification is real and legible at two scales at once: the 2048-bit table prints per-participant LHS `g^y` against RHS `∏C_j^(i^j)` and only P2's row fails when the cheating dealer is on, while the mirrored p=2039 panel shows the same check digit by digit (1998 ≠ 1519, with the prose naming that P2's share was bumped to 27 when the committed curve forces f(2)=26). Pedersen's hiding is demonstrated rather than asserted — one published commitment opened to several different secrets, each with its own r — and the page volunteers that its `h` is derived from `g` so `log_g(h)` may be known. Held at 8 because the interactive surface is narrower than the honesty: three fixed Run buttons, tamper limited to a +1 flip on a chosen participant, and the comparison step is a static table. 30 tests cover the crypto module well but a 1,457-line main.ts has no unit or e2e behavior coverage beyond the a11y sweep. |

| world-ciphers | 1779dc0 | 8 | The page opens by proving itself: 7/7 official vectors (RFC 3713, RFC 5794, GB/T 32907-2016, GOST R 34.12-2015) encrypted live in the browser and byte-compared, re-runnable, and gating `npm test`. Avalanche is genuinely measured and learner-driven across cipher and bit — I got "63 of 128 ciphertext bits changed (49.2%)" with the flipped cells highlighted. The SM4 exhibit animates the real 32-round pipeline over the live state you just encrypted and labels the one non-claim honestly ("the stage highlighting is illustrative timing, not a claim about gate-level latency"), and the ECB penguin is a real client-side image encryption, not a stock picture. Held at 8 because nothing adversarial ever happens: the only failure shown is a mode failure (ECB structure leak), no cipher is attacked or distinguished, the Kuznyechik S-box controversy that motivates the whole comparison is prose and citations, and 15 tests cover the vectors but none of the eight exhibits' states. |

## What would raise it

### shor
- Make the RSA Impact bars computed from the live L → qubit/gate formulas rather than a prose-anchored static table.
- Add a break-it interaction: let the learner force a bad base (a with gcd>1, or one with odd r) and watch the retry logic reject it, rather than waiting for chance.
- Surface the off-peak phasor cancel state by default once per run so the contrast is guaranteed seen.

### signed-bytes
- Let the learner pick the sandbox's meaning-equality parser policy (first-wins vs last-wins) instead of fixing last-wins, making the parser-differential explorable in the sandbox too.
- Make the guided walkthrough's gateway re-serialization editable so the learner authors the in-transit mutation.

### simon-period
- Implement one of the two cited-only breaks (3-round Feistel distinguisher is the cheaper) so the "what this breaks" list is fully live.
- Let the learner hand-enter a candidate period and watch the whole-domain verifier reject it, making the Las Vegas caveat learner-driven rather than narrated.
- Pre-populate the interference grid on load so the cancellation exhibit is not gated behind pressing Measure.

### stego-suite
- Add a second, stronger detector (RS or SPA) so the adaptive-vs-sequential contrast has a test that can actually separate them — right now the page's own verdict is "the crude global test is blind here."
- Implement quantized-DCT embedding through an actual JPEG re-encode so exhibit 4's "a change JPEG keeps" claim is demonstrated rather than stated.
- Assert the detection verdict strings and the dependency-hint states in the test suite, not just the numeric statistic.

### stream-ward
- Let the learner choose which segments to swap/drop/truncate-at in the browser, so the "ANY two frames" generality the tests prove is reachable from the page.
- Measure something real for exhibit 1 (e.g. `performance.memory` or an actual large-Blob decrypt) even at a small scale, so the memory story is not the page's one modelled claim.

### syndrome-drain
- Run an actual toy DOOM: give the learner M syndromes of a small random code, let them run a real list-matching search, and plot measured work against M so the √M discount is measured rather than illustrated.
- Extend the Hamming primer into a decode-one-out-of-many mini-exhibit — the same seven-bit code with M targets — bridging the concrete half to the asymptotic half.
- Grow the test suite past the model functions to cover the chart/meter/verdict rendering states.

### syndrome-hints
- Execute the approximate/subblock-weight channel too (even at toy size) so the second panel stops being the page's one modelled claim.
- Offer a non-informative leakage mode (hints on random coordinates, not just support) so the learner can watch the "≈ w hints" bound degrade and see why the ADAPTED badge is there.
- Push one run to a parameter set large enough that the exponential wall is felt as wall-clock time, not just as a plotted exponent.

### threshold-decrypt
- Let the learner choose which party cheats and how (alter d, alter s, replay another party's proof) so the three-equation panel becomes an explorable truth table rather than one scripted outcome.
- Make exhibit 5 mount the collusion it describes: hand t-1 shares to the learner and show the recovered secret still ranging over the whole group.
- Add a UI test for the path where a rejected partial is selected and recovery refuses by name.

### threshold-mldsa
- Implement one real never-combine path end to end, even at toy lattice parameters with a custom verifier, so the ideal animation becomes an executed protocol rather than a played sequence.
- Failing that, make the toy walkthrough emit a toy signature a toy verifier checks — the learner would then have caused an actual threshold signature at some scale.
- Let the learner corrupt one party's z-share and watch the norm check reject it, adding a break-it path to the choreography.

### timing-oracle
- Add a "recover the secret" button that drives the vulnerable comparator byte by byte off its own measurements and prints the recovered string — the payoff the four measurement panels currently set up but never deliver.
- Give the RSA and cache panels a sample-count knob so a learner can push past the inconclusive verdict rather than only reading it.

### timing-sidechannel
- Make the live-timer channel reach full recovery on a default modern browser (SharedArrayBuffer clock, or batching enough repetitions per candidate), so the marquee result does not depend on the modelled channel.
- Correct the per-position explanation's "(expected when the target is constant-time)" parenthetical, which fires on low confidence even when the target is the vulnerable comparator and the real cause is timer coarseness.
- Add an e2e assertion that a full-recovery run renders as an alarm, matching the unit test that already checks it.

### traitor-trace
- Implement the full NNL tracing procedure (subset-splitting on the failed subset) so the exhibit that ends in false accusations can be followed by the fix actually running.
- Let the learner set the evasive box's coin bias and watch the false-accusation rate move, turning the histogram from one scripted parameterization into an explorable curve.

### vdf
- Make the parallelism exhibit real: actually spawn 4 Web Workers, let them try to split the chain, and print their measured wall-clock time next to the single-threaded one. Right now the page's central "no shortcut" claim is the only uncomputed thing on it.
- Add a T slider large enough that the eval-vs-verify gap is felt, and show the ratio growing with T.
- Test the tamper-reject and trapdoor-match paths, not just the happy-path proof round-trip.

### vigenere-break
- Add a running-key/autokey mode the same workbench visibly fails against, so the "why a long non-repeating key wins" lesson is demonstrated rather than deferred to the OTP demo.
- Offer a second plaintext language with its own frequency table, making the "frequency analysis assumes a known language" caveat something the learner can trip.

### vss-gate
- Turn the demo-integrity note into an exhibit: since `log_g(h)` is knowable here, let the learner use it to forge a Pedersen opening and watch binding actually break. That is a real attack the current build is one function away from.
- Let the learner type the tampered share value (or tamper a commitment instead of a share) rather than only toggling a fixed flip.
- Add behavior e2e specs asserting the verified/failed row states — the crypto module is well tested, the page is not.

### world-ciphers
- Give the learner something to break: a round-reduced variant of one cipher with a mountable distinguisher, so "more rounds = larger security margin" is demonstrated rather than tabulated.
- Make the Kuznyechik S-box controversy concrete — show the Biryukov-Perrin-Udovenko decomposition acting on the real S-box next to a random one, instead of citing the papers.
- Assert exhibit states (avalanche percentage bounds, ECB block repetition, SM4 round count) in the test suite.

---

## Source: `slice-6`

# Crypto Lab — gold-standard pedagogy scoring, 2026-08-02, slice 6

Scored by a single agent against the 2026-08-01 recovered scorecard's calibration (no 10s;
9 = exceptional, learner-driven, zero falsifiable claims found; 10 reserved for claim-complete).
Read-only pass: no demo repo was modified. Method per demo: fetch + HEAD noted, `npm ci`,
README + source read, `npm run build`, built output served via `vite preview`, page driven with
Playwright chromium (main exhibits + failure/tamper paths), test suite skimmed.

Repos in this slice: beacon-lock, blind-relay, encrochat, fhe-arena, hpke-envelope, kerberos,
mayo-seal, mpcith-sign, opaque-gate, power-trace, plus a re-verify of credential-veil
(prior 8 in SCORECARD-2026-08-01).

## Scores

| demo | HEAD | score | justification |
|---|---|:--:|---|
| beacon-lock | 8a265a0 | 9 | The strongest kind of honesty in the fleet: driven live, the interop panel decrypted a ciphertext produced by drand's own Go `tlock` (recovered key `2088b21b…` matched all 32 hex digits on screen), the honest open button correctly reports no key exists yet, and "Force it with the latest signature" feeds a genuine wrong-round beacon signature to the real decryptor and gets a real FO rejection back. All nine break-it attacks run through the same `decrypt()` — eight rejected with specific, correct reasons (I ran every one), and the operator-signs-early attack succeeds and renders as alarm because colour tracks whether the system held. The comparison exhibit's 1× rate is genuinely measured BigInt squaring in the visitor's tab; the outage exhibit strands the learner's own ciphertexts by name. 119 tests including the tlock corpus interop KAT, real quicknet signatures, and a fail-closed FO suite ("mask computed twice from disjoint inputs"). Off 10 only because exhibit 5's puzzle/VDF curves are labelled idealized models anchored to the one measured rate, and the e2e specs assert state visibility rather than verdict content. |
| blind-relay | 8ba9865 | 9 | The knowledge-split architecture is computed, not narrated: I typed a query, ran the real HPKE exchange, and the collusion toggle joined the relay's identity column to the gateway's plaintext column keyed on the actual encapsulated bytes both handled — with "Cryptographic result: every AEAD verified" and "Privacy verdict: BROKEN" rendered as separate, independently-derived verdicts. The size-correlation join uses the real encapsulation lengths (4/4 identified at 96/112/118/134 B), and checking the RFC 9292 padding box genuinely collapses it into one 311-B anonymity set while the timing join stays broken — both driven live. All three relay-seat attacks hit the real verifier: wrong key and flipped byte produce genuine AEAD failures, the leaked-key attack succeeds and is coloured as the alarm. The response key schedule prints both independent derivations from the live exchange, byte-compared. 60 tests including the RFC 9458 Appendix A KAT and a 16-test fail-closed suite. Off 10: the arrival clock is simulated (labelled), exhibits 6-7 are editorial prose tables, and browser verdict content is not e2e-asserted. |
| encrochat | 3b38ae5 | 8 | The verdict architecture is genuinely earned: both axes start neutral, "Message encryption: SOUND — 2 of 2 messages authenticated" is a live tally of real GCM verifications, and deploying the implant flips the system banner to COMPROMISED while the encryption verdict honestly stays green — driven live, and every one of those verdict states is asserted in tests (untested-never-green, weakest-link-decides, alarm-on-implant). The wire pane shows the real ratchet packet bytes, the keyless wiretap genuinely fails AEAD, and the byte-41 forge is rejected while the authentic packet still decrypts — rejection commits no ratchet state, also test-asserted. Held at 8: the attack surface is small and fully preset (the learner picks neither the flipped byte nor the tap target), exhibit 5's vertically-integrated-stack lesson is static prose, and the headline "wire unchanged by the implant" is an architectural assertion rather than an on-page byte comparison across implant on/off runs. |
| fhe-arena | 97fab8e | 8 | Everything the page computes is real and I watched it compute: the `c0 + c1·s = Δ·m + e` reveal prints the live signal/recovered/noise values (e=+1 against a Δ/2=1927 ceiling), "multiply until it breaks" is a genuinely measured budget collapse (10.9 → 1.7 → 0.0 bits) ending in an honestly-shown corrupted decrypt (3, expected 12), the semantic-security panel encrypts twice and shows genuinely divergent ciphertexts both decrypting to 7, and the vote tally sums real ciphertexts. Bootstrap-after-overflow honestly refuses to resurrect the destroyed value, with the caveat stated where the learner stands, and the 14 tests assert exactly the on-screen claims (budget-is-measured, relin 3→2, IND-CPA randomization). Held at 8: the demo's namesake comparison — BGV vs BFV vs TFHE — is a static prose table with no second engine, randomness is `Math.random()` (disclosed, but beneath fleet norms), there is no adversarial break-it path (the only failure is the noise ceiling), and exhibits 1, 5 and 6 are largely prose. |
| hpke-envelope | 103b22d | 9 | A model composition lab: the pipeline's every intermediate is the hand-rolled §5.1 KeySchedule's real output, the mode switcher diffs the key_schedule_context byte-for-byte against the previous mode (computed set-diff in `modes.ts`, not annotations), and the break-the-binding panel showed me the exact separation the fleet standard asks for — KEM shared_secret "identical on both sides" while the AEAD key "differs", "Cryptographic result: Open failed" beside "Security verdict: BINDING HELD", and the replay delivering valid crypto beside "REPLAY ACCEPTED — ⚠ ALARM". The learner edits info/AAD/mode on either side against the real verifier; the PSK input fail-closes below 32 bytes per §9.5. 227 tests of which 173 are RFC 9180 Appendix A KATs, plus a binding matrix asserting every mismatch rejects, identical two-sided changes accept, and replay-to-fresh-context accepts — the page's important states are unit-asserted. Off 10: exhibits 5-6 (§9.7 non-goals, PQ HPKE) are honest prose, KCI is named but not mountable, and the nonce-counter table shows seq stepping without an out-of-order delivery the learner can cause. |
| kerberos | ea60d1c | 9 | Better than its recorded 8. The page opens with a live self-check (RFC 3962 §B s2k KAT matching `55a6ac74…`, CTS round-trip, HMAC tamper rejection, six-message flow) computed on every load, and the eight threat cards all print a `Live result` string returned by a real run — I read "AS-REP issued without PA-DATA, enc-part cracked offline after 3 guesses → Summer2024!", "KDC_ERR_PREAUTH_REQUIRED", "replay cache hit", "clock skew exceeded", and the pre-Kerberos pair "NS: Bob accepted forged run as Alice = true" beside "identity mismatch … Bob accepted = false" — the same relay run against both protocols, not an attacker-free rerun. `replayApReq` resubmits the captured authenticator bytes verbatim so AES-256-CTS decryption and HMAC-SHA1-96 verification pass before freshness refuses, and there is a test asserting exactly that split plus one asserting the same ciphertext is accepted by a service that has not seen it. The Lowe re-seal capsule shows `_pkM → _pkB` over the live envelope with the inner nonce unchanged. Off 10: encoding is JSON-not-DER (disclosed prominently), the threat panel's attacks are card-driven rather than learner-composed, and the only learner-authored variable is the clock slider. |
| mayo-seal | 3b87bcc | 9 | Holds its recorded 9 and is the strongest artifact in this slice. In-browser it reproduced the round-2 reference KAT byte for byte — seedsk 24/24, public key 1420/1420, signed message 487/487 bytes all "identical", from the NIST AES-256-CTR-DRBG seeding, at real MAYO1 parameters — and recomputed all seven structural preconditions on demand in 109 ms with per-check timings and a stated consequence of each failing (irreducibility verified by `z^(16^78) ≡ z` plus gcds over proper divisors, not asserted). The forge panel is a genuine break-it ladder: 4,000 random guesses got 0 forgeries with a best of 3/6 coordinates, the wrong-oil-space and one-nibble-of-O signers each produce a well-formed signature the real verifier rejects at a named coordinate, a control with the real O through the identical rebuilt-key path verifies, and 4 malformed inputs are refused (2 on shape before field arithmetic). Tamper buttons print P*(s) beside t coordinate-by-coordinate with the first difference named. The UOV size table is computed from the size formulas, and the restart probability is derived in `uov.ts`, not quoted. 142 tests including "the corrupted entry can land anywhere in O". Off 10: the mechanism steps and predict-first quizzes remain guided rather than learner-authored, and the size/parameter exhibits are read rather than broken. |
| mpcith-sign | 6a7c347 | 7 | Far past its 5-cluster anchor: the typed secret really is the witness (b = A·x recomputes as you edit the hex), party cards carry real SHA-256 commitments with salts and Merkle roots, the verifier reports "accepted all 3 revealed views" from actual checks, and the zero-knowledge panel is unusually honest — it first concedes the sealed party's *output* is pinned at b − Σ(revealed), shows a candidate table where only the real share hits it, then uses a Δ slider to show the *witness coordinate* is what stays hidden. Fiat-Shamir recomputes the challenge from message ‖ roots and the modify-message panel prints the before/after digests with each round's hidden party flipping. The deduction: exhibit 2b, the page's only adversarial exhibit, is not a cheating prover at all — `runCheatBatch` compares a random index to the corrupt index (`hidden !== corrupt`) and never constructs a tampered view, commits it, or runs a verifier, so "try to fake a party's output" is framing over a Bernoulli tally (empirical 20.79% vs theory 25%). Add the honestly-disclosed linear-special-case scope, no learner-mounted tamper against the real FS or PERK verifier, and 19 tests for a 1322-line UI. |
| opaque-gate | f6c62a0 | 9 | Up from its recorded 8. The breach exhibit is the best thing here and it is entirely live: it runs four attacks against *your* envelope for *your* registered user, and attack 2 walks a dictionary through the full OPRF-evaluate → scrypt → `recover()` path — four "MAC mismatch, rejected" lines then "hunter2 — envelope authenticated; credentials recovered", with the cost measured in this browser (5 guesses, 256 ms, 51 ms/guess ≈ 19.5/sec at scrypt N=2¹⁵) and the page saying that rate "not any quoted figure, is the whole defence". Attack 3 evaluates the same password under two users' OPRF keys and shows genuinely different outputs; attack 4 runs a real KE2 from an attacker keypair. Obliviousness is shown, not asserted: two runs produced different blinded/evaluated wire hex and the identical `18e764c1…` output. The stepped KE1/KE2/KE3 handshake aborts on the wrong password with a real `EnvelopeRecoveryError: auth tag mismatch` at client envelope recovery, and the 3DH diagram prints the three live shared secrets. Tests are 12 cases but heavy: 16 byte-for-byte CFRG P256-SHA256 vector checks plus forged-server_mac and forged-client_mac rejections. Off 10: the "poke the forward-secrecy claim" button leaks the session key and then asserts three facts in string literals — the static-only contrast is never computed — and exhibits 1 and 5 are context prose. |
| power-trace | 3a206b5 | 9 | Every displayed number came out of a real computation in my session: CPA recovered key byte 0 as 0x2B at rank #1 with peak r = 0.426 over 400 traces and a live top-8 candidate table; the noise sweep measured traces-to-recover climbing 33 → 1109 as σ went 1 → 10 (the σ² claim shown, not asserted); jitter genuinely collapsed the attack (true byte to rank #189) and cross-correlation resync recovered 0x2B from the identical attack; DPA and CPA raced on the same measurements (400 vs 200 traces, "about 2.0× fewer") rather than quoting the literature. The countermeasure panel is the honest one: masking really does defeat first-order CPA (true byte at rank #95) and the panel immediately says this "does not prove masking is secure, only that the first-order correlation is gone", while shuffling and hiding both still leak 0x2B and are labelled cost-only. Verdict separation is explicit — "AES-128 encryption: correct ✓" beside "⚠ Key byte leaked". Seeded reproducibility, permalinks, JSON/CSV export and a BYO-traces importer with a lossless round-trip test. 45 tests including "jitter collapses CPA, and resync brings it back" and "masking decorrelates the leak". Off 10: the traces are simulated from real intermediates (prominently disclosed, and the honesty panel says what transfers), and the second-order attack that defeats masking is named, not built. |

## What would raise it

### beacon-lock
- Make exhibit 5's puzzle/VDF curves partially measured (e.g. run a short real squaring burst at 2-3 slider points) rather than a model scaled from one calibration.
- Assert verdict *content* (not just visibility) for the nine attack outcomes in an e2e spec, so the browser-level verdicts are regression-locked.
- Let the learner choose the wrong round / bit position in the tamper attacks instead of fixed presets.

### blind-relay
- Drive the timing join off measured (jittered) delivery times of the real in-tab message passing rather than a scripted clock, or let the learner set inter-arrival gaps.
- Make the OHTTP/VPN/Tor/IT-PIR comparison at least partially interactive (e.g. toggle an assumption and watch which guarantees survive).
- Assert the collusion and leaked-key verdict strings in an e2e spec.

### encrochat
- Compute the "wire unchanged by the implant" claim: run the same deterministic session with and without the implant and byte-compare the packets on the page.
- Let the learner choose the byte to flip (and see GCM reject any position), and pick which endpoint the implant lands on.
- Make exhibit 5's stack diagram interactive — toggle which layer is compromised and derive the blast radius rather than narrating it.

### fhe-arena
- Implement a minimal live BGV engine (even at the same toy parameters) so the arena's headline comparison — modulus switching vs scale-invariance — is computed side-by-side rather than tabulated.
- Switch randomness to crypto.getRandomValues; the Math.random() caveat is honest but unnecessary.
- Add a malleability break-it: let the learner (as the server) tamper with a ciphertext and see the tally silently change — the demo already states IND-CPA is not CCA but never shows it.
- Clarify the post-bootstrap wording: the budget meter reads healthy while the decrypt caption still says "budget exhausted"; say "overflowed before bootstrap" instead.

### hpke-envelope
- Let the learner deliver ciphertexts out of order in the nonce exhibit and watch Open() fail on the live context (the test suite covers it; the page only explains it).
- Mount the KCI attack in Auth mode (attacker holding skR forges a message Auth accepts) — currently named-only, and it is the sharpest §9.1.1 lesson.
- Build the PQ exhibit's one-stage swap as a live ML-KEM KEM (the sibling kyber-vault code exists in-fleet).

### kerberos
- Let the learner set the account password and watch the dictionary either crack it or fail — the AS-REP roasting card currently uses a fixed weak password and a 4-word list.
- Give the learner a hand on the wire (edit an authenticator field, forge a ticket, re-time a replay) instead of one-click threat cards.
- Note: prior recorded score was 8 (batch 3, 2026-08-01); the pre-auth/AS-REP-roasting live cards and the byte-verbatim replay path now justify 9.

### mayo-seal
- Let the learner author the corruption: choose which nibble of O to change (and see that any choice is fatal) rather than a scripted one.
- Give the k-slider a consequence beyond the figure — run signing at k below the threshold at TOY parameters and let the learner watch SampleSolution return bottom repeatedly.
- Make the Table 2.2 disagreement flag demonstrable (perturb a size input and watch the flag fire), so the self-check is seen working rather than always silent.

### mpcith-sign
- Make exhibit 2b a real cheat: actually corrupt a party's output, commit it, run the real verifier, and let the catch/slip tally fall out of verification failures instead of an index comparison. This is the single biggest lift available here.
- Add a tamper path on the Fiat-Shamir signature (edit a revealed view or a root) and on the PERK signature, so the learner sees the real verifier reject something they broke.
- Build one nonlinear round (even a single multiplication with correlated randomness) so the exhibit that names the linear special case can also show the thing it says is missing.

### opaque-gate
- Compute the forward-secrecy contrast instead of asserting it: rerun the key schedule with dh1 dropped (or with the ephemerals reused) and show the derived session key and MACs actually change / actually repeat.
- Let the learner supply the dictionary and watch the measured guess rate move with a stronger password, rather than a fixed 5-word list.
- Add a tamper control on the stored envelope so the learner causes the record corruption the verify suite already tests.

### power-trace
- Build the second-order attack (combine the mask sample and the masked-value sample) so the masking panel's own caveat becomes a demonstration rather than a citation. This is the single highest-value addition.
- Ship one real captured trace set (ChipWhisperer public data) alongside the simulated generator, so the importer path is exercised against silicon at least once.
- Extend recovery past byte 0 to the full 16-byte key so the "this is the cipher key" claim is shown end-to-end.

## Re-verification

| demo | HEAD | prior -> current | what changed |
|---|---|:--:|---|
| credential-veil | d15e4e8 | 8 -> 9 | The 2026-08-01 defect was "two of five exhibits stage what they claim to demonstrate." Both are now fixed, and fixed properly. **Unlinkability (`d15e4e8`):** the Ed25519 baseline used to call `verifyEd25519` once, map one hex string three times and pass `markCommonBytes(hex, [hex])` — a string compared with itself. It now builds three separate showings, verifies each independently, and I read the measured output: BBS gave "All 3 proofs verify: true. Shared 8-byte runs across all three proofs: 0. Disclosed values identical across all three: 1 (Class = C)", and Ed25519 gave "Shared 8-byte runs: 171. Byte-for-byte identical: true (100%)". The LINKABLE verdict is now gated on the measured identity. Better still, the over-broad "share nothing correlatable" claim was corrected into a computed one — the default verdict now reads "PROOFS UNLINKABLE, DISCLOSURE IS NOT" and names Class = C as the correlator. **Revocation:** the index used to be a module constant the presentation never carried, with the REJECT coming from a local `isRevoked(17)`. The wallet now binds the index into the presentation header, the verifier reads it off the wire, and the page proves the binding by re-checking the same proof against decoy index 18 (false) — with a test asserting it "fails for every decoy index." **Tamper (`4947965`):** now lies about a value that was actually revealed. The predicate exhibit's three-way separation still holds live (accept / "no proof exists" RangeError for an honest 2010 DOB / forged proof where the pairing passes and the transcript fails). Tests 66 -> 82, including a 13-case adversarial suite (bit flips, re-targeted indexes, mutated deltaHat/rcHat, dropped bit proofs). Off 10: the credential is a fixed teaching fixture the learner cannot author, and the revocation comparison table is prose. |

### credential-veil
- Let the learner build the credential (choose fields and values) so the selective-disclosure and correlator lessons run on their own data.
- Make the accumulator alternative demonstrable rather than tabulated — even a toy "prove my bit is 0" would close the exhibit's own stated tension.
- Add the second colluding-verifier step: let the learner run the correlation join over the three showings themselves instead of reading the count.

---

## Source: `slice-7`

# Crypto Lab — gold-standard pedagogy scoring, 2026-08-02, slice 7

## Why this slice exists

Ten demos were excluded from every earlier slice of the 2026-08-02 scoring pass by an
accounting error. They were simultaneously **previously scored** (so the never-scored pass did
not claim them) and **inside the active border-contrast accessibility work queue** when the
slices were assigned (so the re-verify pass skipped them). Neither pass took them, and they
finished the day without a current score. This slice closes that gap.

Repos in this slice, in order: `dp-noise`, `frodo-vault`, `kyber-vault`, `lll-break`,
`ntru-classic`, `pake-gate`, `protocol-compose`, `spdz-forge`, `time-lock-puzzle`,
`time-trust`.

All ten received border-contrast (SC 1.4.11) accessibility commits earlier today. Those are
accessibility-only and do not by themselves move a pedagogy score; every repo was fetched and
scored at **current HEAD** regardless.

Calibrated against `audits/SCORECARD-2026-08-01.md` (the recovered table plus its per-batch
sections) and `audits/_MASTER-TEMPLATE.md`. No 10s in the fleet; 10 is reserved for
**claim-complete** — every claim computed from that run, every verdict stating only what the
protocol actually learned, every important browser state tested rather than merely visited.

**Read-only pass: no demo repo was modified, committed, or pushed.** Method per demo:
`git fetch` + HEAD noted, `npm ci`, README and main source read, unit suite run, `npm run
build`, built output served via `vite preview`, page driven with Playwright chromium (main
exhibits plus failure/tamper paths), test suite skimmed for asserted-vs-visited states.

## Scores

| demo | HEAD | prior | current | what changed |
|---|---|:--:|:--:|---|
| dp-noise | e79fb33 | 9 (B4) | 9 | Holds, and is better-earned than when it was filed. Commit `dd06b7d` ("Make the page's verdicts derive from its own computations") repaired four falsifiable claims that were live on 2026-08-01: Exhibit 2's "the rails hold" banner branched on which mechanism was selected and now branches on `curve.holds`; Exhibit 4b's refusal matched the string `'expand'` and now derives from `isPrivateCalibration(deltaSource)`; Exhibit 1's "recovered exactly" and "five runs, five different answers" were literals and are now read off the results; and RAPPOR's ε∞ dropped the `2h` factor (reported 2.197 for a deployment whose published `f = 0.75, h = 2` give 2.043) with the test suite pinning the wrong value. `ratioCurve.maxRatio` also underflowed to `Infinity` past ~75 lattice steps and reported the bound broken at ε = 7 and ε = 10 for a mechanism that meets it exactly. I drove every one of those paths live and they now come out both ways: Exhibit 1 exact prints "✗ Alice's salary recovered exactly: $142,000 … error of zero" and at ε = 1 prints "✓ Attack failed — 5 runs, 5 different answers" over five genuinely different values ($60,000 / $125,000 / $595,000 / $180,000 / −$170,000) and a measured miss of ~$82,000; Exhibit 2 at ε = 1 reports "largest ratio anywhere is 2.72 against a ceiling of e^ε = 2.72", and switching to Gaussian flips to "The rails do not hold — this is why δ exists … reaching 3.57 × 10^82 … δ = 1.18e-6"; Exhibit 4b's three branches give clip (bias $230,000, still private), drop (bias $480,000, "answering a different question"), and raise → "✗ Refused — this is not a private calibration", fail-closed with no answer computed. Exhibit 3 runs two independent routes to the same number and says so — 2,000 × 2 real draws measured a 72.8% best-guess rate against a closed-form 73.1%, "agree to 0.33%" — and my own 12 rounds landed 6/12 = 50.0% under a 73.1% ceiling with the page correctly refusing to read that as a comment on my attention span. The ledger genuinely refuses ("Refused — the budget cannot cover this query … 1.900, past the budget of 1.50, so no answer was computed"), computes basic (1.400) and advanced (4.507) on every request and bills the cheaper, and the averaging attack recovered $1,254,567 against a true $1,240,000 from 600 individually-private answers at a stated ε = 300.0. 239 unit tests pass. Unusually for the fleet, `e2e/` is not a lone a11y spec: `task.spec.ts` (213 lines) completes the four core ideas keyboard-only and at 375px and asserts **verdict content** (`recovered exactly`, `recovered to within`, `Refused`), and `claims.spec.ts` asserts the scope card cites a live CI run rather than a copied test count. Off 10 on one point: the page states that the textbook float sampler carries Mironov's (CCS 2012) recoverable artefacts and offers that mode — but selecting it demonstrates nothing, so the sharpest "what can go wrong" claim on the page is the one claim it asserts rather than computes. |
| frodo-vault | e4daf2b | 8 (B2) | 8 | Holds, but for different reasons than it was filed under. The 2026-08-01 defect — "the tamper exhibit shows nothing 99.6% of the time" — is **fixed**. `renderCtDiff` used to render only `min(pre.length, post.length, 64)` bytes from offset 0, so a bit flipped anywhere past byte 64 of a 15,744-byte ciphertext produced a diff with no highlighted byte in it. Commit `3113444` makes it locate the first difference and window `maxBytes` around it, with a test named "centers the preview on a tamper beyond the first 64 bytes". Driven live at FrodoKEM-976: the page flipped byte 11509, the diff rendered `... [bytes 0–11476]` then the window with the tampered byte marked, and re-running decapsulation produced a genuinely different Alice secret (`2ac2aa59…` against Bob's `a6eec568…`) with "✗ Secrets mismatch" and the flow diagram flipping `derives SS_A ✓` to `✗`. The rest is real and I watched it compute: keygen at 976 and 1344 returned distinct previews with measured times (14.4 ms, 22.6 ms) and correct trailing byte counts, the toy LWE solver recovered `s = [3, 7, 11]` exactly with no noise and returned an inconsistent candidate with nonzero residuals `[0,0,0,75,79]` with noise, the hybrid panel ran two real KEMs and hashed their actual secrets, and the failure-probability chart measured a genuine cliff (0.0% at ±3 → 51.0% at ±8). 53 unit tests including a real round-trip and an implicit-rejection case. What keeps it at 8 rather than moving up: the key-size self-check is now half computed and half theatre — `3113444` derives the public-key figure and its `✓` from `16 + n·8·⌈log₂ q⌉/8`, but the private-key and ciphertext lines immediately below it (`src/main.ts:699,702`) still print a literal `✓` beside numbers read straight out of the same parameter table they claim to verify, so two of three checks cannot come out `✗`. The benchmark's headline "≈72.0×" is computed against ML-KEM timings sitting on the timer-resolution floor (keygen 0.100 ms over a 0.000–0.200 ms range, decapsulation 0.000 ms) with no disclosure that the denominator is unresolvable. The tamper byte is chosen by the page, not the learner, and between tampering and re-decapsulating the panel still displays the stale "✓ Secrets match". Exhibits 6 and 7 are editorial prose. `e2e/` is the recurring fleet pattern — an accessibility spec and nothing else — so none of the verdict states above is browser-asserted. |
| kyber-vault | 38d08c2 | 8 (B2, prior 6) | 8 | Holds. Commit `22b0b9e` ("Ground lattice and tamper claims in results") closed two live falsifiable claims and I verified both fixes in the browser. First, the LWE panel displayed the true secret as centered representatives (`s = [1, 1, 0, -1]`) but printed the recovered vector as raw Z₁₇ residues, so "Exactly the true secret" sat next to a vector that did not visibly match it; `centeredRepresentative` now normalises both, and the clean solve printed "Recovered s = [1, 1, 0, -1] (Z₁₇ residues converted to centered representatives). Exactly the true secret". Second, `bruteForceSearchSpace` hardcoded the ML-KEM modulus, so a panel showing a q=17 toy quoted a q=3329 search space; it now takes `q` and reported "For this displayed n=4, q=17 toy … q^n = 83,521 candidates. This deliberately small teaching instance is searchable; it is not an ML-KEM security estimate." Third and best, the hybrid tamper no longer claims a result before one exists: after clicking Tamper the status reads "Ciphertext changed. Authentication has not run yet; click Decrypt message to test it", and only after Decrypt does the alert become "Authentication failed" — a verdict that states exactly what ran. All three are asserted in a new `e2e/claims.spec.ts`, so `e2e/` here is genuinely three specs (a11y, flow-a11y, claims), not the fleet's usual lone axe sweep. The rest holds up live: the stepper ran real `@noble/post-quantum` ML-KEM-768 with measured timings (3.5 / 2.3 / 0.9 ms) and Alice and Bob landing on the identical 32-byte secret shown byte-by-byte, the noisy solve returned `[7, −1, 2, 1]` against a true `[−2, 0, −2, 0]` and said so, `b = As + e (mod q) holds` is computed by `verifyLWEWithQ` rather than printed, and the NTT panel checks against a schoolbook multiply *and* then discloses that the check is over the cyclic ring rather than Kyber's negacyclic X²⁵⁶+1, so the match "proves the transform machinery is correct — it is not the exact Kyber multiply". The benchmark similarly refuses its own headline, stating the JS-vs-native-WebCrypto comparison is not fair. What holds it at 8: the learner authors almost nothing — four Next clicks, one preset Tamper button, and a message textarea are the whole interaction surface, and three of the five tabs (Parameter sets, vs X25519/RSA, How LWE works) are tables and prose. 23 tests, six of which are DOM/a11y assertions, and there is no FIPS 203 ACVP vector in the repo — correctness rests on the dependency's own KATs plus a length check. The README is well below the §5 fleet standard: no Exhibits tour, no What Can Go Wrong, no Build & Verify, no scripture footer. |
| lll-break | a7382c3 | — (never scored) | 6 | Four of five exhibits are genuinely good and the fifth — the one the demo is named for — prints a verdict I falsified four times out of four. The good part first: Exhibit 3 runs real LLL and proves the lattice is unchanged live (`det \|det B\|: 5.000 -> 5.000`, `U = [1, -3] [3, -8]`, `det(U)=1`, orthogonality defect 27.0185 → 1.0000 across the auto run); Exhibit 4's "show the short vector emerge" genuinely collapses the target row to `(-s, e, +1) = [-4, -3, -1, -2 \| 4, 2, 3, 0 \| 1]` against a real secret `[4, 3, 1, 2]`; a seeded run reproduces the same instance twice; and at n=4, q=71, σ=2 the attack really recovered `[3, 1, 1, 4] EXACT MATCH` off a reduced short vector with the structure decomposed block by block. Exhibit 5's self-disclosure is among the most honest in the fleet — it prints its own heuristic's error against reality ("this heuristic at n=256 gives beta~10.9 → off by a factor of ~37 on beta. Do not extrapolate it") and labels the n≈50 marker as hand-placed rather than derived. `scripts/guardrails.mjs` fails the build on any `Math.random(` and on README strings like "LLL breaks Kyber", `verify:algo` reports measured success rates, and `tests/ui.spec.ts` carries real behavioural assertions ("toy LWE attack recovers by genuine reduction, not the baseline", "Kyber-512 button never reports a lattice recovery"). **The defect:** raise σ and the central verdict inverts. At n=6, q=257, σ=10 the true secret was `[0, 1, 4, 1, 4, 0]`, the page reported "Recovered secret: [253, 244, 239, 251, 2, 250] close", and above it printed **"Lattice attack result: SUCCESS — secret read off a reduced short vector"**. Same at n=10/q=71/σ=8, n=12/q=7/σ=10 and n=12/q=257/σ=8 — SUCCESS every time, on candidates bearing no relation to the secret in any representation. `main.ts:1226` computes `latticeOk = ok && result.recoverMethod === 'short-vector'` and never consults the `exact` flag it computes fourteen lines later, and `ok` comes from `checkCandidate(..., sigma)` in `bkz.ts:427`, whose residual tolerance scales with σ — so at large σ an arbitrary short vector passes and is declared the secret. In the same runs `summarizeBKZImpact` printed "the basis stayed too coarse to expose a useful secret vector" directly beneath the SUCCESS banner, and the norm-gap meter read **100.0%** in all four — `scoreFromNormGap` (`main.ts:1081`) returns a flat 100 whenever `shortNorm/targetNorm <= 1`, and `targetNorm` grows with σ, so the meter pins at maximum confidence in precisely the regime where the attack is weakest, under a caption reading "100% means reduction surfaced something at or below the target length (the secret is exposed)". This is reachable by following the demo's own instructions: Challenge 5 tells the learner to "raise sigma and/or n until the lattice attack fails" and states that "the norm-gap meter falls and 'Lattice attack result' flips to FAILED". It does neither. The exhibit was built to stop learners counting a brute-force baseline as a lattice break, and it instead counts a validated-but-wrong candidate as one — a worse version of the error it guards against. No unit-test suite exists (there is no `test` script); `tests/ui.spec.ts` pins only the low-σ success path and the baseline separation, which is why this shipped. |
| ntru-classic | b12e723 | 8 (B2, prior 6) | 8 | Holds. Commit `cf52ccb` ("Gate NTRU recovery claims on verified match") is the fix `lll-break` needs and did not get: `buildLatticeBridge` now carries a `found` flag set only when a reduced row is proven equal to `(p·g ‖ f)` under some sign and rotation, and `runBridgeAttack` returns early with "LLL did not recover the key in this run … It was checked against every sign and cyclic rotation of (p·g ‖ f), and no match was found" rather than narrating a recovery it never verified. The rest of the demo is genuinely computed. At N=443, q=2048 the walkthrough printed live values off my own message: `max |coefficient| = 128 · window is ±1024`, "Identity check: a ≟ ⟨p·r·g + f·m⟩ mod q — holds exactly ✓" (a real comparison with a `mismatch — ciphertext was altered, identity broken ✗` branch at `main.ts:642`), a measured decryption margin of "896 of 1024", and per-stage coefficient profiles. Tampering then produced a real "Decryption mismatch detected: 296/443 coefficients differ" and flipped the panel to "Warning: rare decryption failure or tampering event observed". Part B is the standout and it is the bridge the prior review asked for: a genuine N=5, q=32 NTRU key whose 10×10 lattice basis is built "entirely from h and q — no secret goes in", real LLL returning `recovered = ([0,0,0,-3,3] ‖ [-1,0,0,-1,1])` against a secret `f = [1,0,0,1,-1]`, `p·g = [0,0,0,3,-3]`, correctly reported as "negated and cyclically rotated by 0", with the rotation/sign symmetry explained as a genuine property of the scheme rather than glossed. 52 unit tests. What keeps it at 8: I ran the Part B attack eight times on eight fresh keys and it recovered eight times, so the honest not-found branch `cf52ccb` added is in practice unreachable — the learner has no control (an N slider, a q slider, a weight control) that makes the attack fail, which is the same missing half that the demo's own Exhibit 4 comparison table implies matters. Exhibits 4 and 5 are a static comparison table and a static timeline. Part A's 2D reduction is a fixed three-step example rather than a basis the learner sets. The only learner-authored input on the page is the message text; both the tamper and the attack are single preset buttons. `e2e/` is the axe sweep plus the one claim assertion `cf52ccb` added — better than the fleet norm, still not coverage of the decrypt, identity-check or tamper verdicts. |
| pake-gate | 1c7cf8b | 7 (B3) | 8 | Up one. The 2026-08-01 deduction was "every attack is a canned menu item and guard code for the classic attacks is unreachable from the UI." Commit `0da299f` ("Make the offline dictionary attack able to miss") makes that false for the demo's most important attack, and I verified all three branches live. The SRP grind used to splice the demo's true password into the attacker's wordlist, so a hit was guaranteed and the miss verdict was unreachable — teaching that a breached verifier hands over the password unconditionally rather than handing the attacker a free offline test priced by guessability. The wordlist is now built independently: at the default `hunter2` the grind tested 2 candidates and reported "verifier matched — password recovered offline … note it was not 'the password read off the wire'"; at `Tr0ub4dor&3-zzz` it tested all 10 and reported "No match in 10 candidates. The attacker has learned only that the password is outside this list — and can keep going, for free, at billions of candidates per GPU-day"; and typing that password into the new learner-supplied extra-candidates field produced "candidates tested: 11 (10 wordlist + 1 yours)" and a real hit — the hit is earned, not rigged. `9c74cbb` separately corrected three claims the code did not support: `dragonfly.ts`'s header claimed a "blinded quadratic-residue test" ten lines above a docstring saying the check is unblinded Legendre-style; the SRP taxonomy row labelled RFC 2945 "Informational" (it is Proposed Standard) and attributed the running arithmetic to it (the lab runs RFC 5054's `k = H(N | PAD(g))`); and the README claimed WebCrypto for the hashing that `hashes.ts` deliberately does through `@noble/hashes`. The engines themselves are the strongest part: I ran honest and wrong-password handshakes on all four tabs and got byte-equal confirmed fingerprints on the honest path (SRP `2c5c413b0cf8675e` both sides) and a real abort on the wrong one ("Handshake aborted — SRP M1 mismatch", right side never deriving a key at all). Backed by genuine published vectors — RFC 5054 Appendix B for SRP end to end through the premaster, draft-irtf-cfrg-cpace-21's `G_Coffee25519` ISK_SY reproduced by the stateful engine, and independent Python KAT cross-checks for J-PAKE and Dragonfly matching `ss`, `kck`, `mk` and the confirm tags byte-for-byte. What keeps it off 9: the Active tamper panel is still exactly what the prior review described — two "Arm & run" ops with their expected results printed beside them before you press anything — and the Dragonblood panel is a table of *modelled* iteration counts (legacy 2/2/1/2/1/1 vs a flat 40), honestly labelled but neither measured nor mountable, so the demo's one named real-world attack remains narrated. The taxonomy matrix and the "three distinct breach economics" cards are static prose, and `e2e/` is the a11y spec only. |
| protocol-compose | 2c2ae74 | — (never scored) | 8 | Three real attacks, each with a reachable safe branch that is computed rather than asserted, over real WebCrypto. Exhibit 1 seals the same two messages under all four orders and the equality leak is a live comparison, not a caption: with A and B distinct, E&M reports "✓ Safe: different messages → different tags"; press "Make B identical to A" and the panel relabels itself "TAG — IDENTICAL ACROSS A AND B" over `ab004ace…` twice and flips to "✗ Risk: identical tag → attacker learns A and B are the same message", while EtM and AEAD stay different because a fresh IV feeds their tags. Exhibit 2's padding oracle recovered a message I typed — `TOPSECRET-42` — byte by byte in a measured **7,352 oracle queries**, animating the attacker-controlled `C_{i−1}` block and greening each plaintext byte as it fell, and honestly adding "+ 36 bytes of HMAC tag & CBC padding (also peeled off)"; switching the same exhibit to EtM reports "0 oracle queries possible — the MAC covers the ciphertext and is checked first". Exhibit 3 recovers the full tag in **2,048 timed guesses** with a per-position readout ("ran 2/8 → longest → right" … "ran 8/8"), and the constant-time mode is the honest counterpart — every guess reads 8/8, the bars are flat, and the verdict says "The attack recovers nothing" before revealing the tag it failed to find. Exhibit 4's CRIME run recovered `session=dgg6c9cp` in **288 length measurements** from real compression, and carries the best paragraph on the page: it explains that an incomplete run "is the attack's real texture, not the demo failing", names compression collisions as the cause, and says what real CRIME does about it. The AEAD panel refuses its own good news — "Not invincible — it moves the footgun" — and points at nonce reuse. 43 unit tests across `attacks`, `crime`, `timing`, `compose` and `contrast`. Held at 8: every attack is a single button and the only thing the learner authors is the oracle's message, so nothing is learner-composed; Exhibit 5's TLS 1.0→1.3 walkthrough is a stepper over static prose cards and Exhibit 6 is a three-select decision tree (a sound one — it catches "Order claimed, but not enforced" — but it computes nothing cryptographic); the timing exhibit's clock is modelled as a comparison count rather than measured, which `src/timing.ts` documents well ("unlike a wall-clock read it is deterministic — so the leak is testable rather than flaky") and the page discloses in the bar caption, but the exhibit is still titled "The Clock Never Lies" over a clock that is not one; and `e2e/` is the axe sweep only, so none of the four verdict flips above is browser-asserted. |
| spdz-forge | 67948dd | 9 (B4) | 9 | Holds, at the top of the band, and it is the strongest artifact in this slice. Two commits since it was filed took direct aim at the claim-complete bar the surviving fragment of `audits/spdz-forge.md` names, and both land. `672eea6` ("MAC panel: let the learner execute the attack the page names"): the abort message told the learner the winning move — shift your MAC share by α·Δ — and printed α two paragraphs above, but `tamperShare` deliberately left the MAC share untouched and no control existed, so the one attack the demo named was the one it would not let you run. `tamperShare` now takes an optional `macDelta` and the panel has a second input. I ran all three branches live in one session (α = 2263401197814401711, α·Δ = 118017420538699402 for Δ = 100): with macΔ = 0 it aborts on `Σσᵢ = 2187825588674994549 ≠ 0` and explains "the residue is −α·Δ"; with macΔ = α·Δ − 1 it aborts on `Σσᵢ = 2305843009213693950` (= p − 1, i.e. −1) under "you are off by exactly Σσᵢ … the check has no notion of 'nearly right'"; with macΔ = α·Δ exactly it **accepts** the forged 142 and renders it as "✗ ALARM — a forged value carried a valid MAC", then states the guarantee precisely rather than declaring SPDZ broken: "the MAC check is worth precisely as much as α is secret. You could compute α·Δ only because this tab plays the dealer." `f194a6d` ("Derive the Beaver break-it verdict from the computation, not from a constant") removed an unconditional `chip('alarm', '✗', 'a WRONG product with a perfectly VALID MAC')` whose "wrong product" half was reachably false — the panel's `y` accepts 0 and the error term is δ·y. Verified both ways: at y = 7, δ = 5 the page chips the prediction `z′ = x·y + δ·y = 105 ✓ the opened z′ matches that prediction exactly` and reports the valid-MAC wrong product; at y = 0 it now reads "▸ the product is still correct — δ·y vanished … (SPDZ aborts either way — the opening check does not care whether the lie happened to be harmless)". The same commit deleted a dead branch in `maccheck.ts` that attributed an acceptance to "the modeled 1/p forgery event" (accept requires macΔ = α·Δ exactly, so an acceptance is always the deliberate forgery), and made `variance.ts` count multiplications and openings from `runResult.transcripts` instead of stating 4/4/8 before inspecting the run. Everything else I drove holds to the same standard: the σ-last attack genuinely passes the unordered check ("no α guessing, just patience — the 1/p security bound is simply false for this transcript") and genuinely dies against commit-then-open over real SHA-256 nonces; the honest variance opens `M = 6450` and compares 716.6667 against the plaintext computation with both sides chipped equal; and the lying variance aborts with the most precisely scoped verdict in the fleet — "nothing in the protocol transcript says which hospital cheated — abort detects, it does not attribute", followed by a labelled "Lab control (omniscient view)" paragraph separating what I know from what the parties learn. 58 unit tests including 16 pinned KATs and a `y = 0` regression; 10 e2e behaviour tests labelled GS-01/02/03 that read α·Δ off the page, execute the forgery and assert both the acceptance and that off-by-one still aborts. What still keeps it off 10 is scope, not honesty: roughly a third of SPDZ is disclosed as out of scope rather than demonstrated — the trusted dealer means the offline phase and its sacrifice check present no attack surface at all, batched random-linear-combination checking is named as the thing this page teaches "the pedagogical case of", and identifiable abort is "named, not built". Every one of those is stated plainly in the threat-model matrix, so nothing is claimed falsely; the page simply cannot be claim-complete about a protocol it deliberately builds two thirds of. (Read-only: the preserved untracked `chat.md` was left in place.) |
| time-lock-puzzle | c703250 | — (never scored) | 6 | Real RSW with two genuine computed break-it paths, undone by the fact that the one number the demo exists to tell you is wrong by four orders of magnitude — and is contradicted by the demo's own other tab in the same session. The good parts are real: `generateModulus` draws two real primes, the squaring chain runs as real BigInt work in a worker, the message is sealed with real AES-256-GCM under SHA-256(b), and both attacker paths compute. "⚡ Try to skip the work" submits the base `a` without the 250,000 squarings and gets "🚫 Rejected … AES-GCM's auth tag fails closed — no plaintext leaks"; "🔓 Creator shortcut (trapdoor)" really collapses the tower through `e = 2^t mod φ(N)` and returned my plaintext instantly, correctly framed as creator privilege. Commit `26ca687` fixed three real copy inaccuracies and fixed them well — sequentiality is now stated as the RSW conjecture rather than a theorem ("Nobody has proved that repeated squaring modulo an RSA modulus cannot be parallelised"), the modulus options carry correct security classes whose values check out (I confirmed the 512- and 1024-bit prime options really produce 1024- and 2048-bit moduli), and the delay is now defined correctly as one squaring on the attacker's *fastest* hardware times t. **The defect:** the Create tab's calibration reports **~9–16 billion sequential 1024-bit modular squarings per second**, varying wildly between reads seconds apart (11,519,066,667 / 13,936,233,333 / 9,067,500,000 / 16,060,550,000 across four runs). The Solve tab's own live counter, same device, same session, measured **642,508 squarings/sec** and a t = 250,000 solve took 1.0 s of wall clock — so the calibration overstates the demo's own measurement by a factor of roughly 25,000. The consequence is not cosmetic: because `secs = selectedT() / rate` is always sub-millisecond, the ETA renders "**≈ <1s of sequential work**" for t = 50,000, t = 250,000, t = 1,000,000 **and** t = 100,000,000 — identical across a 2,000× range, where the demo's own measured rate puts the last one at about 156 seconds. The difficulty selector is the learner's only control and its only readout is this number. The cause is visible in `src/ui/bench.ts`: `squareStepBench` never consumes `x` after the timed loop, so the squaring chain is dead code the JIT is free to eliminate and `count / elapsed` reports an empty loop. It is made sharper by the Security tab, which specifically directs the learner to trust this figure — "the demo reports time 'on this device' — an estimate for you, not the guarantee against an adversary." Beyond that: four of the six tabs (What it is, Security, Applications, VDFs) are prose with no interaction, the VDF tab is explicit that the proof is "minus the proof" and left to a future demo, 25 unit tests cover the field/prime/timelock layers but nothing covers the calibration or the ETA, and `e2e/` is the accessibility spec alone, so neither the fail-closed rejection nor the trapdoor is browser-asserted. |
| time-trust | 047c0e0 | 9 (B3) | 9 | Holds, and the 2026-08-01 one-liner ("Replay an intercepted TOTP code a real HMAC accepts; roll a server clock and resurrect a dead signed URL") understates it — both are there and four more panels are as good. The architecture is the thing the rest of the fleet keeps failing at: the **cryptographic result** and the **security verdict** are separate rows on every panel, and a third row compares the verdict against what the *true* clock would have decided. I drove all six and watched that third row earn itself. The signed URL: at T+21 m it rejects on the server clock; rolling the **client** clock back an hour changes nothing and the panel says why ("nothing you do to this clock reaches the verifier"); rolling the **server** clock back accepts, with "⚠ WRONG — in true time this URL expired … the MAC is genuinely valid, no forgery happened, and the file is served anyway." TOTP: first use accepts, replay of the intercepted code is caught by the used-code record ("one-time-use record: ALREADY USED — the used-code record did what RFC 6238 §5.2 requires"), and unchecking that record lets the same replay through under "⚠ WRONG — this exact code was already used once … a real HMAC match let a replay in"; widening tolerance to ±3 recomputes the band live ("7 windows = 210 s … replayable for up to 120 s"). JWT: the split-brain lands on a 45-second sliver where the auth server accepts at 12:14:15 and the resource server rejects at 12:15:45 over byte-identical input, flagged "⚠ WRONG — at the true clock this token is still valid". The replay panel keeps genuinely per-server caches: after routing one request to B, B rejects on a cache hit while A (−4 min) and C (+4 min) both accept and each explains which of the two mechanisms failed for it. The certificate panel is a real hand-encoded X.509 signed with Ed25519, stepped four ways, with a running "Verified 2 times so far; result every time: VALID" accumulator and a bit-flip control that really returns INVALID at every clock position — the exact contrast the panel promises between attacking the math and attacking the clock. 99 unit tests across `kats`, `otp`, `jwt`, `der`, `x509/cert`, `signedurl` and `core/decision`. Off 10 on the third clause of the bar rather than the first two: `e2e/` is the accessibility spec alone, so not one of the verdict flips above — SPLIT-BRAIN, the resurrected URL, the accepted replay — is asserted in a browser, and those verdicts are the demo. Time and the network are simulated (disclosed plainly at the top), and the certificate exhibit is one self-signed cert with chain building and revocation explicitly handed to `chain-of-trust`. |

## What would raise it

### dp-noise
- Build the Mironov attack. The continuous-Laplace mode is selectable and labelled as the thing nearly every tutorial ships, and the page says its low-order bits leak the true answer — but nothing on the page recovers anything from them. Sample that mode a few thousand times, histogram the mantissa low bits under the two neighbouring answers, and let the learner read the answer off the artefact. This is the single highest-value addition and it would close the page's only tell-not-show.
- Extend `e2e/` verdict assertions to the branches that only exist off the guided route: Exhibit 1's DP-mode "Attack failed", the Gaussian "rails do not hold", and 4b's "Refused — this is not a private calibration". Three of the four verdicts repaired in `dd06b7d` are unit-tested but not browser-asserted, which is exactly the regression surface that produced them.
- Let the learner author the database (or at least Alice's salary and the $100,000 threshold) so the differencing and homogeneity attacks run on numbers they chose.

### frodo-vault
- Finish the job `3113444` started: derive the private-key and ciphertext byte counts from their stated formulas the way the public key now is, and let the `✓` be a real comparison. As it stands the page shows a computed check and two decorative ones side by side, and only the computed one can ever disagree.
- Disclose the timer floor on the benchmark, or raise the ML-KEM iteration count until the median clears it. Reporting "≈72.0×" off a 0.000 ms decapsulation measurement is the one number on the page that is not really measured.
- Let the learner pick the tamper byte (and re-decapsulate automatically), so the exhibit stops carrying a stale "✓ Secrets match" between the tamper and the verdict that contradicts it.
- Give `e2e/` one spec beyond the axe sweep asserting the mismatch verdict and the noisy-solve inconsistency — both are the demo's headline lessons and neither is checked in a browser.

### kyber-vault
- Give the learner something to break that they choose. Let them edit the noise vector `e` and watch elimination degrade coefficient by coefficient, or pick the ciphertext byte to corrupt — right now the LWE panel's noise and the tamper target are both dealt by the page.
- Ship a FIPS 203 / ACVP known-answer vector and byte-compare it on the page. The demo asserts spec conformance through a dependency and a length table; the fleet's strongest PQ demos (`mayo-seal`, `beacon-lock`) reproduce a reference vector in the tab and say "identical".
- Bring the README up to §5 — it is missing the Exhibits tour, What Can Go Wrong, Build & Verify and the closing scripture line, and it is the thinnest README of the ten in this slice.
- Build the negacyclic twist the NTT panel already names, so the honest caveat becomes a second, correct multiply rather than a disclaimer.

### lll-break
- **Gate the SUCCESS banner on `exact`, not on `recoverMethod`.** `latticeOk` at `main.ts:1226` should require that the recovered vector equals the secret; a candidate that merely satisfies a σ-scaled residual check is a near-collision, not a break, and calling it "secret read off a reduced short vector" is the single most damaging claim in this demo. This one-line change is the highest-value fix available anywhere in this slice.
- Compare in a single representation. The structure block prints centered values (`s = [-4, -13, …]`) while "Recovered secret" prints residues (`[253, 244, …]`); normalise both before the equality test, the way `kyber-vault` did in `22b0b9e`.
- Rewrite `scoreFromNormGap` so the meter cannot pin at 100%. Returning a flat 100 for every `gap <= 1` makes the meter read maximum confidence in the worst regime, and a decay constant of 18 keeps it above 90% out to a 2× gap. Either report the raw gap or normalise against something that does not itself grow with σ.
- Make the σ slider actually reach failure and assert it. Challenge 5's reveal text describes a FAILED verdict and a falling meter that the app never produces; a `tests/ui.spec.ts` case asserting "at σ=10 the lattice attack reports FAILED" would have caught all of the above.
- Add a unit suite. There is no `test` script at all — `verify:algo` reports aggregate success rates and `tests/ui.spec.ts` covers the happy path, so the recovery predicate itself is untested.

### ntru-classic
- Give Part B an N slider (5 → 11 → 17) so the learner can climb until LLL stops recovering and the honest not-found branch actually fires. As shipped it is dead code, and "that gap is NTRU's security" is the one claim on the page the learner cannot see for themselves.
- Let the learner choose the tamper — which coefficient, by how much — and watch the identity check flip from ✓ to ✗ at a boundary they found, rather than a single button that always breaks everything.
- Make Exhibit 4 do something: the NTRU-vs-Kyber row on decryption failure rates (2⁻⁸⁰ vs 2⁻¹⁶⁴) is exactly the property Exhibit 2 already measures a margin for — connect them instead of tabulating.
- Assert the identity-check and tamper-mismatch verdicts in `e2e/`; `cf52ccb` established the pattern with the bridge assertion and the other two are the demo's headline lessons.

### pake-gate
- Apply the `0da299f` treatment to the tamper panel. Let the learner pick the field, the step and the nibble instead of arming one of two ops whose expected result is printed before they act — the engines already fail closed, so the only thing missing is the control surface.
- Make Dragonblood measurable rather than modelled. Run the real `derivePasswordElement` hunt-and-peck loop over a learner-chosen candidate list and count actual iterations, then let them read the password class off the counts. As shipped, the demo's one named CVE-class attack is the panel that computes least.
- Give the on-path observer something to conclude: have it state, from the transcript alone, what it can and cannot test offline, and let the learner try to falsify that with the grind tool that already exists two panels away.
- Add an `e2e/` claims spec pinning the grind's hit and miss verdicts; `tests/grind.test.ts` covers them at unit level and they are the demo's headline lesson.

### protocol-compose
- Put the learner's hand on one attack. Let them drive the padding oracle a byte at a time — choose the block, sweep the byte, read the oracle's answer — instead of pressing Run and watching 7,352 queries scroll past. The engine already exposes exactly the right interface.
- Make Exhibit 5 derive rather than narrate: let the learner pick a TLS version's record layer and have the page run the matching composition through Exhibits 2 and 3, so "TLS 1.2 still allowed CBC MtE" produces an oracle rather than a caption.
- Either measure the clock or retitle the exhibit. The comparison-count model is the right engineering call and is disclosed twice, but "The Clock Never Lies" over a modelled clock is the one place the page's framing outruns its mechanism; a `performance.now()` histogram beside the modelled bars would settle it honestly.
- Assert the four verdict flips in `e2e/` — E&M snapping identical, MtE broken vs EtM at zero queries, naive vs constant-time recovery. They are computed correctly today and nothing in a browser guards them.

### spdz-forge
- Build the batched check. The page teaches the single-value case and says so, but the real SPDZ check draws its random linear combination *after* the opened values are fixed — and that ordering is the same lesson the σ-last break-it already makes vivid. One batched panel would turn the last "pedagogical case" disclaimer into a demonstration.
- Give the dealer an attack surface. With triples conjured by a trusted dealer there is nothing to break in the offline phase; even a toy sacrifice check (open a random linear combination of two triples and abort on `c ≠ a·b`) would let the learner deal a bad triple and watch it get caught, closing the one phase of SPDZ that is currently unbreakable because it is unmodelled.
- Make identifiable abort a contrast rather than a footnote: run the same cheat under the abort-only check and under a variant that names the deviating party, so "you learn that someone cheated, not who" becomes something the learner watches fail to happen.

### time-lock-puzzle
- **Fix `squareStepBench` and the ETA.** Consume the benchmark's result (return or checksum `x`, or accumulate it into the returned value) so the timed loop cannot be optimised away, and sanity-check the rate against the Solve tab's live counter before displaying it. Reporting 16 billion squarings/sec beside a panel that measures 642,508 is the single defect holding this demo down, and it makes the difficulty selector — the learner's only control — feedback-free.
- Once the rate is real, let the ETA earn its keep: show the projected time updating as the learner drags t, then let them run it and compare projected against actual. That contrast is the demo's whole thesis and it is currently unavailable.
- Add a test for the calibration. A unit test asserting the benchmarked rate lands within an order of magnitude of a directly timed chain would have caught this; nothing in the 25 tests touches `bench.ts`.
- Give the parallelism claim a demonstration. "A thousand friends can't turn it faster" is the headline analogy — spawn two workers on the same chain and show the second one cannot start until the first finishes, rather than asserting it in three separate places.
- Assert the skip-the-work rejection and the trapdoor open in `e2e/`; both are computed correctly today and neither is guarded in a browser.

### time-trust
- Add a browser claims spec. This is the one thing between it and the top of the fleet: assert that the split-brain renders ACCEPT beside REJECT over identical bytes, that the server-clock rollback renders the ⚠ alarm, that the replay is caught with the used-code record and accepted without it, and that the bit-flipped signature reads INVALID at every clock position. The decision logic is unit-tested; the rendering of it is not.
- Let the learner author a token. Every window on the page is a fixture — letting them set an `exp` or a URL expiry and then find the skew that breaks it would turn six demonstrations into six experiments.
- Give the leeway control a consequence the learner can see: the copy correctly says leeway "trades an availability failure for a longer attack window", but nothing on the page measures that window. Show the replay interval widening as leeway rises.

---

## Source: `reverify-1`

# Re-verification pass — 2026-08-02 — slice: reverify-1

Re-verifying recovered scores from `SCORECARD-2026-08-01.md` against fetched current source.
Assigned demos (15): aegis-gate, babel-hash, bike-vault, bulletproofs, card-trick,
chain-of-trust, collision-vault, corrupted-oracle, dilithium-reject, dilithium-seal,
drbg-arena, entropy-collapse, envelope-kms, falcon-seal, frozen-heart.

| demo | HEAD | prior | current | what changed |
|---|---|--:|--:|---|
| aegis-gate | 793d614 | 9 | 9 | Prior 9 stands. Post-scoring commit 793d614 additionally fixed the one asserted claim left (benchmark verdict now computed from the run's measured throughputs, with an honest interpreted-vs-native caveat). Verified live: encrypt/decrypt round-trip, tamper rejection with recomputed-tag display, 4-stage state-machine stepper, AES round opened stage-by-stage, 87/87 unit tests incl. draft vectors; zero console errors. |

- aegis-gate remaining gaps: nonce-reuse recovery exhibit still requires the learner to run it to see where recovery stops being real (fine); 10 would require the family-comparison tables (static prose tables) to be tied to computation, which is arguably out of scope.

| babel-hash | 55e5c96 | 9 | 9 | Prior 9 stands. Post-scoring fixes improved honesty: HMAC length-extension verdict is now computed by actually running the extension math against the HMAC tag (f76e6ec), and the secret length readout is real UTF-8 bytes (94ec129). Verified live: length-extension forgery with glue-padding display and 1-32 length sweep, HMAC rejection computed, comparison tab runs a real lazily-triggered benchmark (measured MB/s), per-bit avalanche sweep. 28/28 tests, zero console errors. |

- babel-hash remaining gaps: tab 5 (Portfolio thread) has zero interactive controls — pure prose; comparison tab's property table (length-extension vulnerable/immune) is asserted rather than demonstrated per algorithm. Those two keep it at the bottom of the 9 band, not 10.

| bike-vault | 9d12a49 | 5 | 8 | Prior 5 no longer stands. Commit ef2822e (post-scoring) implements the actual Black-Gray-Flip decoder (Black flips + the two masked Gray correction passes) that the prior review found narrated-but-absent, and makes every headline number runtime-derived via data-param (sim r=587/w=14/t=13 vs spec 12,323/142/134, stated side by side). Verified live: full KEM round-trip with matching secrets; error-weight slider pushed to 40 produces a real non-convergence and an honest "decoding-failure regime, on purpose" verdict; DFR lab measured 2/600 = 0.33% at t=13 vs 588/600 = 98% at t=30 with fresh keypairs — the six contradicted numbers are gone and there is now a real break path. 32/32 tests, zero console errors. |

- bike-vault remaining gaps: c1 is labeled SIMULATED (not the spec hash construction) and keygen is marked ILLUSTRATIVE — honest but still a reduced-parameter simulation; comparison panel remains spec-figure tables. Those hold it at 8 rather than 9.

| bulletproofs | b40e111 | 8 | 8 | Prior 8 stands. Only accessibility/contrast work and a Ristretto comment correction landed since scoring — no behavior change. Verified live: real prove (127 ms reference verify), tamper t-hat -> both reference and single-MSM verifiers reject, batch verify accepted at 48 ms; full 47-test crypto suite plus UI smoke and a11y suite all pass; zero console errors. |

- bulletproofs remaining gaps: value slider caps at 2^24-1 so the learner never actually pushes an out-of-range value themselves (tamper is a scripted single mutation); the plain-English-to-algebra ramp is strong but the folding/IPA rounds are still watched rather than driven. A learner-chosen mutation target or an out-of-range prove attempt would push toward 9.

| card-trick | a37f82f | 9 | 9 | Prior 9 stands. Since scoring, c11d4d3 corrected six citation/cost claims against primary sources (MKS12 shuffle, Koch citation, GC cost, mirror case) — so the batch agent's "zero falsifiable claims" was slightly optimistic then but is closer to true now — plus 2965dad puts the trick on the first screen. Verified live: five-cut all-at-once protocol runs on chosen secret bits; leakage table is exactly enumerated ("Nothing here is sampled"); break panel has predict-first UI and dealer-distribution choices including the lazy 0-or-1 dealer. 138/138 tests, zero console errors. |

- card-trick remaining gaps: none observed that were previously scored against; the compare/why tabs are prose-heavy but the core three exhibits carry the concept. The gap to 10 is thin — mainly that the leakage table's "information-theoretically secure" verdict is narrated alongside rather than emitted by a computed equality check across secret pairs.

| chain-of-trust | d7e02a1 | 9 | 9 | Prior 9 stands. Since scoring, d76cdd0 tightened honesty further (revocation now reports "unknown" when unchecked instead of implying a checked-good state). Verified live: 10-stage "you are the validator" puzzle graded by the real RFC 5280 validator over fresh session ECDSA P-256 keys, live signature-fact chips split from security verdicts, cross-sign path-building-vs-validation exhibit, and a bring-your-own-PEM validator. 78/78 tests, zero console errors. |

- chain-of-trust remaining gaps: revocation stage is still the thinnest exhibit (CRL state is lab-injected rather than parsed from a real CRL); the mechanism tab's two path-builders are watched rather than steered. Small items; the demo is otherwise at the top of the 9 band.

| collision-vault | 45d3436 | 8 | 8 | Prior 8 stands, now more solidly earned. Post-scoring fixes removed falsifiable claims: 9ea07d1 draws the byte map's crafted-block region from the measured state trace instead of a guess, and 875c8dd cites the RFC 1321 vectors correctly and measures where MD5 states actually diverge. Verified live: published MD5/SHA-1 collision pairs hashed in-browser, byte-diff navigation, flip-one-bit experiment recomputes all digests, SHA-256/SHA-3 keep the pair apart. Interaction census: 4 of 8 numbered sections now carry controls (2, 3, 6, 8) vs the prior "6 of 8 zero interaction". 77/77 tests, zero console errors. |

- collision-vault remaining gaps: sections 4 (identical- vs chosen-prefix), 5 (state convergence trace), and 7 (verification ledger) remain zero-interaction displays; there is no learner-drivable break (inherent — collisions are published artifacts, and the page says so). Converting the state-trace table into a steppable exhibit is the clearest route to 9.

| corrupted-oracle | 49413a5 | 9 | 9 | Prior 9 stands, and its one soft spot is gone: 49413a5 (post-scoring) fixed five claims the code did not establish — the "TOTAL COMPROMISE" verdict was decided by row count rather than the match results and scored absent comparisons as matches; it is now written from a tally of real comparisons, and the heatmap and Block Frequency tail are computed. Verified live: three DRBGs generate, all pass real statistical tests (measured p-values on screen), Trigger Attack recovers Dual_EC state from the learner's own output and the next Generate click matches the prediction byte-for-byte. 32/32 tests, zero console errors. |

- corrupted-oracle remaining gaps: this is now very close to claim-complete; the remaining distance to 10 is that the trapdoor derivation (d relating P and Q) is asserted from setup rather than exhibited, and the stats table's "all pass" framing depends on which battery subset runs. Minor.

| dilithium-reject | 97ac062 | 8 | 8 | Prior 8 stands, and firmed up: 97ac062 (post-scoring) made the four per-check "Show example" panels use a fresh real ML-DSA-65 signing-loop measurement (Measured/Threshold/PASS-REJECT all from the run) instead of prior canned evidence. Verified live: real iteration-by-iteration signing with all four norm checks measured against real bounds, tamper flip of byte 1355 makes noble's untouched verifier reject, 100-run histogram measured P=0.189 vs ref 0.20 with observed-vs-theory tail probabilities. 79/79 tests, zero console errors. |

- dilithium-reject remaining gaps: no adversarial exhibit — the tamper path is one scripted bit-flip, and nothing lets the learner exploit what removing rejection would leak (the demo's own motivating claim). A "sign without aborts and watch the key leak" exhibit is what would take this from 8 to 9.

| dilithium-seal | 4d8ccf3 | 7 | 8 | Up from 7. The named defect — "the toy abort loop reports acceptances that never happened" — is fixed by b8c4557 (post-scoring): signRunSummary now only claims acceptance when the final attempt accepted (unit-tested), the safety-cap case says "did not produce an accepted response", and the hardcoded "typically 10-50x faster" benchmark claim was replaced by the measured browser ratio. Verified live: real ML-DSA-65 keygen/sign/verify, tamper -> FAILED (and tamper button correctly one-way until re-sign), the illustrative abort loop shows real per-attempt REJECT arithmetic with exact bounds, Run Benchmark measures. 20/20 tests, zero console errors. |

- dilithium-seal remaining gaps: tabs 4 (PQC trio) and 5 (About) are still zero-listener prose — the prior "three of five inert" is now two of five, one being About; the abort loop runs at toy parameters (honestly labeled). An interactive PQC-trio exhibit or a leak-the-secret demonstration for the no-abort case would justify 9.

| drbg-arena | f5c8b83 | 6 | 8 | Up from 6. Commit f5c8b83 (post-scoring) fixed all eight audited claims including every defect behind the prior score: the hidden per-click nonce is now on-screen with the determinism verdict computed ("0 hex digits differ" on Same Seed Again, observed live); the broken-generator grid now uses the LCG's low byte so the banding claim is empirically true (measured correlation 1.000 vs 0.022, printed under the grids, verdict written from those numbers); Dual_EC and entropy verdicts are tallies of the run; the speed row is timed on press; under-seeding is disclosed. Verified live plus 29/29 unit tests and NIST CAVP conformance on page load. |

- drbg-arena remaining gaps: nothing to break — no attack or learner-mounted failure anywhere (the Dual_EC row honestly uses OS randomness as a stand-in rather than demonstrating the trapdoor); exhibit 4 (Hash_DRBG) is still a static comparison table. A real backdoor exhibit or a backtracking-resistance break would justify 9.

| entropy-collapse | ae958f0 | 9 | 9 | Prior 9 stands and is now better supported. Three post-scoring honesty commits landed: 71cd802 makes the displayed keyspace the computed one and counts real matching bytes in fork(), 8e7f449 stops promising a sweep past the live-enumeration limit, and ae958f0 makes the clone verdict a tally of fields actually compared so a non-collapsing run would say so. Verified live: seed recovery cracked a real 16,384-seed space in 5,900 guesses / 0.09 s, and the recovered seed re-seeds the real DRBG to reproduce the published nonce and session key. 34/34 tests, zero console errors. |

- entropy-collapse remaining gaps: the enumeration ceiling means the learner brute-forces a deliberately tiny keyspace (honestly labeled, and the Debian CVE framing justifies it); the fork and reseed chapters are stepped rather than adversarial. Close to the top of the 9 band.

| envelope-kms | eba0d26 | 7 | 8 | Up from 7. Commit 66ef023 (post-scoring) fixed a defect the prior pass did not even name: all five security-lab experiments ran the correct primitives, so `held: false` was unreachable and the red "Property broken" badge could never render — a security lab whose failure state cannot occur. Each card now has a weakened build removing exactly the one defense it rests on. Verified live: 5/5 "Property held [real build]" then 5/5 "Property broken [weakened build]", with real observations (envelope opened as tenant=evil once AAD binding is dropped). 62/62 tests; ff6c5c1 also corrected the RFC 3394 vector citations. |

- envelope-kms remaining gaps: the prior score's named defect persists — "Root KEK · HSM boundary" is an SVG label and prose only; nothing in src/kms ever wraps a KEK under a root key, so the headline three-tier hierarchy is still two real tiers (DEK under KEK) plus a drawn third. Making the root a real wrapping key is what would take this to 9.

| falcon-seal | 4226ce6 | 7 | 8 | Up from 7. The prior score's named defect — "a signing path that never touches the private key while the page insists it does" — was fixed by 16eb9cf (post-scoring): the page now says outright that signFalconIllustrative never reads (f,g), explains why a real trapdoor is unreachable here (keygen never solves f*G - g*F = q; no LDL tree in floating point), and rewrites quiz q3, which had marked the trapdoor claim CORRECT while a button on the same panel disproved it. Verified live: forge-pro verifies with no private key and the page says "you found this demo's weak spot"; keygen reports spec vs actual byte sizes separately; real WASM Falcon-1024 measured on-machine; 900c99d corrected FIPS 206 status. 18/18 tests. |

- falcon-seal remaining gaps: signing still does not depend on the private key — the honesty is now complete but the mechanism is not, so the central exhibit teaches a forgeable toy that says so rather than Falcon's actual sampler; the timing lab is a labeled model with no clock read. Implementing a real (F,G) completion, or driving the exhibit from the WASM signer, is the route to 9.

| frozen-heart | e1bd77d | 9 | 9 | Prior 9 stands, and its one asserted element is now computed: 7e0b1ba (post-scoring) replaced the omission-ladder's severity chips — previously a switch on the rung key, which would have read the same had the algebra been wrong — with a pure function of three live measurements per rung (fixed-target forgery, witness-free minting, honest-proof replay), all rendered beside the chip, with the prior prose demoted to labelled commentary. Falsifiability was checked by sabotage. Verified live: dropping R from the hash forges a proof the real verifier accepts, with cryptographic result and security verdict rendered separately and the full s/c/R algebra shown. 49/49 tests, zero console errors. |

- frozen-heart remaining gaps: very close to claim-complete. The residual is that the custom-transcript toggles produce the same five canonical severities rather than surfacing anything the ladder does not already enumerate, and the 2022 real-world incidents are cited rather than reproduced.

---

## Source: `reverify-2`

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
| jwt-forge | c614196 | 9 | 9 | Post-scoring commit c614196 tightened honesty: an allowlisted alg:none token no longer prints "Valid signature — all checks passed" over an unsigned JWS; it now reports 'not-checked' and the banner reads "ACCEPTED UNSECURED — NO SIGNATURE WAS CHECKED". Verified live: alg:none forgery is ACCEPTED by the vulnerable verifier and REJECTED (not in allowlist) by the correct one; key-confusion attack also accepted only by the vulnerable verifier. 46/46 tests pass. Prior 9 stands. |

- jwt-forge gaps: attacks are launcher-driven presets rather than fully free-form token construction; already at the top of the band.
| kdf-arena | 21c0d8a | 8 | 9 | The one defect the prior 8 named ("a hardcoded 64,000x the live grid contradicts") is gone: 72d9fc0 derives every memory-grid/scale caption from the run — verified live it now reads "scrypt, the hungriest KDF in this run at 128 MiB... widest gap 130,000×" and restates when a cost knob moves. 21c0d8a makes the attacker rig drive the benchmark. Salt-reuse toggle confirmed producing byte-identical derived keys across runs. Every claim is now computed; moves 8 to 9 (low end — single break surface). |

- kdf-arena gaps: fundamentally a tune-and-read demo; salt-reuse is the only learner-mounted break; benchmark timings vary by machine (honestly framed).
| kdf-chain | 1233751 | 8 | 8 | Only change since scoring is 1233751 (draw memory costs on a linear scale) plus contrast/a11y — an honesty improvement, no pedagogy shift. Verified live: RFC 5869 HKDF KAT self-test on page, no-salt derivation yields identical keys, full chain runs, ~15 computed panels with inline attacker assumptions. 10/10 unit tests pass. Prior 8 stands. |

- kdf-chain gaps: the learner tunes and reads rather than mounting a break (no adversary the learner drives to a wrong-accept); no single flagship forgery.
| key-mirror | e8b2a1e | 9 | 9 | Reinforced by d8906d3, which replaced a hardcoded "every tag verified" chip (that could never go red and logged tag:valid unconditionally) with one derived from real open() outcomes. Verified live: chip is green on a clean run, stays green under equivocation while the verdict reads "INTERCEPTED, UNDETECTED — no cryptographic check Alice can run has failed", and goes RED "1 of 2 AES-GCM tag checks FAILED" under a bit-flip. The equivocation attack still produces a valid inclusion proof of a lie. 50 tests pass. Prior 9 stands. |

- key-mirror gaps: near the 10 bar; the strongest remaining reach would be letting the learner also forge/repair the consistency (append-only / gossip) proof themselves rather than reading the monitor's verdict.
| lms-ledger | 9f44751 | 8 | 8 | Only change since scoring is 9f44751 (derive LMS/HSS signature sizes instead of hardcoding) plus a11y — verified live the sign panel now computes "2336 bytes = 32-byte C + 67×32 OTS + 5×32 auth path". Core exhibit intact: sign verifies against the real root, and after burning a leaf repeatedly the WOTS+ reuse forgery produces "✓ FORGED SIGNATURE VERIFIES" (grinds the randomizer, advances held chain values). 18 tests pass. Prior 8 stands. |

- lms-ledger gaps: the forgery grinds randomizers automatically for the learner rather than having them assemble the malicious chain values by hand; toy parameter set (w=4, 67 chains) needs ~8 reuses, disclosed honestly.
| lms-xmss | 74ad736 | 7 | 8 | The prior 7's stated defect — "the Danger Zone and the forgery describe two disconnected state machines" — is fixed by 74ad736. Verified live: the forgery reads live signer state ("The live signer burned q=0 ... Leaf 0 is now marked used in Exhibit 1"), the shared pubkey panel's q advances to 1, the unsafe q override is rejected without changing state (aria-invalid, "State was not changed"), and the reach statistic is computed from measured chain depths ("34 of 34 ... not a sampled message"). Forged signature ACCEPTED by the genuine key; all four gate phases pass. Moves 7 to 8. |

- lms-xmss gaps: forgery still grinds randomizers automatically rather than the learner assembling chains by hand; toy tree (1024 leaves) with reuse forced; HSS section is lighter than the LMS one.
| mac-race | 39a2ce4 | 9 | 9 | Reinforced by 39a2ce4, which derives the timing and length-guessing verdicts from each run instead of asserting them — verified live the timing panel reports "Measured spread across mismatch positions: naive 0.500 ms; full-scan 0.100 ms. The full-scan comparison was flatter in this run", an honest per-run statement. Poly1305 key-reuse and GHASH nonce-reuse forgeries both ACCEPTED by their servers; length-extension layout renders with a bare-SHA-accept vs HMAC-reject split. 58 tests pass. Prior 9 stands. |

- mac-race gaps: JS timing is not constant-time and the panel says so — the timing lesson is directional, not a reliable oracle; at the top of the band already.
| mceliece-gate | 20763c1 | 7 | 8 | 20763c1 makes claims track live state: the tamper control now guarantees an over-radius state after learner edits (verified: weight forced to 3 > t=2 with the warning shown), the key-size prose no longer asserts a false "average webpage payload" (now a named fixed example), and Panel 1 computes a real verified G_pub = S·G·P. The prior 7's core dock (live KEM bypasses the S·G·P scrambling) still holds functionally but is now explicitly disclosed in LIMITATIONS.md rather than being a silent contradiction. 27 tests pass. Honesty gains move it 7 to 8. |

- mceliece-gate gaps: the live Panel 3 KEM still decodes against the unscrambled structured generator (disclosed, but a production KEM would encapsulate against G_pub); toy n=16,k=8,t=2 parameters; Panel 2's 261 KB "public key" is a hashed seed, not a real key (disclosed).
| mls-group | 9371174 | 8 | 8 | Only pedagogy-relevant change since scoring is 376277c, which discloses the teaching-subset boundary ("does not implement Ed25519 credential signatures, authenticated handshake framing, or confirmation-tag construction; commits and application messages are unsigned") — an honesty gain, not a regression. Verified live: real RFC 9180 HPKE/TreeKEM, and the removed-member lockout is a real AES-GCM failure (current member reads "Meet at the safe house at 21:00", removed member gets "AEAD authentication failed — locked out"). 19 tests pass. Prior 8 stands. |

- mls-group gaps: unsigned commits/messages (no credential-signature or confirmation-tag verification) — now disclosed rather than closed; the access-control panel is gated behind a CTA/tour before the learner can mount it.
| multivariate | fddef9c | 8 | 8 | e1113cf fixed real falsifiable claims — the tour button now computes its length from the step durations ("Run 32-sec demo" verified live, was a hardcoded "60-sec"), and false "sig fits in N tweets" / "keygen slows visibly" copy is gone. But both defects the prior 8 named still stand: "Watch the collapse" is still four hardcoded phase captions (src/ui.ts phases-1..4, generic, not computed from the run's matrix), and there is still no mounted attack exhibit — the Beullens break is prose and the "forgery" cards are tamper-detection (flip byte / edit message rejected), not a real key recovery. 33 tests pass. Prior 8 stands. |

- multivariate gaps: collapse animation captions are hardcoded, not derived from the signed system's actual bytes; no computed structural/key-recovery attack (e.g. a toy intersection or Kipnis-Shamir recovery at small parameters) — the break stays narrated.

---

## Source: `reverify-3`

# Re-verify pass 3 — 2026-08-02

Re-verification of recovered 2026-08-01 scores against fetched current source.
Assigned demos (15): noise-pipe, nonce-guard, oblivious-shelf, oram-vault, ot-gate,
otp-vault, patron-shield, phantom-vault, pki-chain, poly1305-mac, psi-gate,
quantum-entropy, ratchet-wire, ring-sign, scloud-vault.

Method per demo: `git fetch origin`, read commits since the scoring session, `npm ci`,
check whether the prior justification's named defect still exists in current source,
`npm run build`, serve `dist/`, drive with Playwright chromium.

| demo | HEAD | prior | current | what changed |
|---|---|--:|--:|---|
| noise-pipe | b696d6e | 7 | 8 | 175f67b fixed the named defect: Break-it badges now distinguish held / succeeded / not-applicable / could-not-run instead of rendering every `ok:false` as "Attack succeeded". |
| nonce-guard | 2db23b3 | 8 | 8 | 4ac4e9c converted the Level 2 misattribution from an implied claim into an explicit disclosure; structure unchanged. |
| oram-vault | 2dbff17 | 7 | 8 | e16f2e2 closed the named defect: the chi-square verdict is now computed by `analyzePathUniformity()` with three reachable branches, and two other asserted claims (a fabricated stash bound, "three unrelated paths") were replaced with observed counts. |
| ot-gate | 35c2688 | 8 | 8 | Prior score stands. 3fcceb4 corrected a teaching error the prior score did not catch (choice-hiding was attributed to DDH; it is unconditional) and disclosed the omitted transcript salt. Both HIGH fixes verified still live. |
| otp-vault | fdc3282 | 9 | 9 | Prior score stands. 6cec71f fixed a usability defect in the centerpiece exhibit (crib pins were destroyed on every keystroke); verified live that a pinned crib now survives editing. No falsifiable claims found. |
| patron-shield | db2037f | 8 | 9 | 4973da9 closed the named defect: the correctness badge now reads `result.isCorrect` and names the wrong string on failure, and the cancellation grid derives survival from set membership rather than from `idx === targetIndex`. |
| phantom-vault | 9672507 | 8 | 8 | 61a4752 closed the named sample-size defect — the bias charts now enumerate all 256 byte values exactly instead of binning one run's small sample. The prior's other complaint (nothing to break) still stands, so the 8 holds. |
| pki-chain | 948a95d | 7 | 8 | 635cb58 closed the named defect: the hero no longer claims the X.509 wire format, an encoding note sits under the inspector, and a new in-app Scope section names what the JSON model cannot teach (parsing-differential bugs, absent extensions, non-canonical fingerprints). |
| poly1305-mac | 6d24d15 | 9 | 9 | Score stands, but only because 6d24d15 fixed a severe defect that was live when the 9 was assigned: the two-pair recovery returned a wrong `r` for close message pairs up to 99% of the time, then printed "Forgery did not verify". Recovery now enumerates candidates and reports ambiguity instead of guessing. |
| psi-gate | 98b3c5e | 7 | 9 | 2dc378a fixed five falsifiable claims, including both the prior named ones: `assertValidPoints` now actually runs on every point received (the certificate was for validation nothing called), and the flatness exhibit no longer bins two RFC 9496-constrained bytes that made it routinely print its own failure branch. |
| quantum-entropy | b4028ad | 8 | 9 | 5f776d7 made the panel headline track the live measurement instead of a hardcoded 99.7%, and b4028ad stopped the README calling the modeled source real quantum. Re-audit found the demo well past its thin prior justification: learner-driven sliders collapse attacker work from 2^234.5 to 2^11.7, and over-extraction produces a computed REJECT. |
| ratchet-wire | 90367a8 | 8 | 8 | Prior score stands. 90367a8 closed an unnamed defect (the break-in recovery verdict now reads whether the root key actually rotated, and the aria announcement is gated on the same flag) and corrected four wrong Signal-spec section refs. The prior's named gap — the compromise story stops short of a decrypt — is unchanged. |
| ring-sign | cf0ff1b | 7 | 9 | 7f719ce + 53ed872 fixed six asserted claims including the prior's named one: spend B now has its own signer selector so the "Reuse detected: no" branch is reachable, the chain-closed badge is derived from the recomputed chain AND-ed with verifyLsag(), and the timing exhibit reports a measured OLS fit instead of asserting linearity. |
| scloud-vault | ff21806 | 8 | 8 | Prior score stands. 301a92a removed three invented percentage meters from the review-scrutiny cards (100/45/18% presented as measurements) and corrected the demo's description of its own KEM — it implements full n×32 matrix LWE, not the "single-vector simplification" the README, params.ts and the keygen callout all claimed. |
| oblivious-shelf | 47b43a0 | 7 | 8 | All three named defects fixed by c9b9fe7 + 47b43a0: the anonymity set is now computed candidate-by-candidate, the target highlight is gone from both server-view panels, the hero says "one bit ... its checked-out flag", and Section A's diagrams track the learner's selection. |

## Per-demo notes

### noise-pipe — 7 -> 8 (HEAD b696d6e)

Prior justification: "Broadest and most KAT-anchored implementation in the cluster; the
walkthrough is a scrubbable replay and one attack card teaches the inverse of what its code
does."

The inverted attack card is fixed. `175f67b` added an explicit `AttackOutcome`
(`held` | `succeeded` | `n/a` | `error`) to `FailureResult` and set it at every return site in
the six simulators, with four distinct badges and neutral (non-verdict) styling for the
non-security outcomes. Confirmed live against the built page:

- rs-swap on XX -> "— Not applicable to this pattern" (previously rendered as "Attack succeeded")
- rs-swap on IKpsk2 -> "Attack failed — defense held", with real `realResponderRS` bytes
- bit-flip on XX -> "defense held", with real ciphertext/tampered-ciphertext hex
- nonce reuse -> "Attack succeeded", with two real ciphertexts
- replay on NN -> "Attack succeeded"
- PSK mismatch on a pattern without a PSK -> "Not applicable"

`7b6635b` additionally rewrote 159 lines of `src/patterns.ts` teaching content.

Remaining gaps (what would raise it):
- The walkthrough is still a step-through of a handshake computed once at pattern selection —
  real crypto, but a replay rather than a per-step computation. The new predict-before-step
  prompts partly compensate.
- Break-it attacks are one-click buttons; the learner cannot parameterize an attack.
- `#predict-box` renders only its heading at some steps (no prompt text), so the active-retrieval
  scaffold silently drops out.

### nonce-guard — 8 -> 8 (HEAD 2db23b3)

Prior justification: "Break-before-theory reordering fixed the on-ramp; H recovery plus a
forgery real AES-GCM accepts. Level 2 runs on internal probes, not the learner's messages."

The named defect is unchanged structurally — `runForbiddenAttack()` still runs on two fixed
16-byte probes rather than the learner's messages — but `4ac4e9c` stopped it from reading as a
claim about the learner's own traffic. The heading is now "Level 2 — Separate chosen-probe
demonstration" and the panel leads with "**Not derived from your Message 1 or Message 2.**"
The same commit relabelled the Level 1 readout from "DECODED (PRINTABLE)" to "ASCII PREVIEW OF
XOR BYTES (NOT DECODED PLAINTEXT)" with a paragraph explaining that recovering a plaintext needs
extra information. Verified live: with reuse on, H is recovered exactly and a forged tag is
accepted by real AES-GCM; with reuse off, both columns report "NO ATTACK — nonces are unique".
Honesty improved without the pedagogy changing, so the 8 holds.

Remaining gaps (what would raise it):
- `src/main.ts:287` — the aria-live `announce()` asserts "the GHASH authentication key H was
  recovered exactly, and a forged tag was accepted by real AES-GCM" as a fixed string, while the
  visible badges next to it are correctly gated on `atk.recovered` / `atk.forgeryAccepted`. A
  screen-reader user receives a verdict that never reads the flag the code computes.
- Level 2 still does not act on the learner's own messages.
- The default Message 1 / Message 2 share a long prefix, so the headline `P₁ ⊕ P₂` renders as
  nearly all `·` — the strongest exhibit on the page opens looking empty.

### oblivious-shelf — 7 -> 8 (HEAD 47b43a0)

Prior justification: "Half the page is static prose; the 'record' it retrieves is one bit already
on screen; panels labelled 'Server A's view' highlight the exact index the text says a server
cannot see."

Two commits closed all three. `47b43a0` made `renderXorChain`'s target argument optional and
omits it for anything drawn as a server's view, and added `consistentTargets()` in `pir.ts`,
which for each candidate index reconstructs the subset the patron must have drawn, re-runs that
server's side, and requires the observed view back. `c9b9fe7` made the Step 7 recovery verdict a
real comparison against `db[i]` (`pirQuery` now returns `directBit` and `correct`), and corrected
the false PIR-complexity and PATRIOT Act claims in Sections C and D1. Driven live on book #3:

- Step 8 prints "Candidate targets consistent with that view, checked one by one: 16 of 16" for
  both servers — a computed count, and the tests pin it as falsifiable (an impossible view drops
  every candidate).
- Zero `.xor-term--target` / `.set-el--target` highlights in any of the eight walkthrough steps.
- Step 7 reads "Checked: matches db[3] = 1 read directly from the database", then states that the
  title, author and call number come from `catalog.ts` in the browser and were never requested.
- Hero now reads "Fetch one bit of a library catalog record — its checked-out flag".
- Section A diagrams read "wants book #3" / "Query S△{3}" after selecting #3 (was a hardcoded 9).

24/24 vitest pass, build clean, no page errors.

Remaining gaps (what would raise it):
- The "half the page is static prose" half of the prior verdict is untouched: 4 interactive
  controls on the whole page, and the catalog cards plus one Run button are the entire input
  surface.
- No failure or adversary path. The learner never makes the protocol break, and cannot collude
  the two servers to watch the anonymity set collapse to 1 — which is the natural counterpart to
  the 16-of-16 exhibit the page now computes, and what `patron-shield` has and this does not.

### oram-vault — 7 -> 8 (HEAD 2dbff17)

Prior justification: "A genuine Path ORAM computing a real chi-square from real access traces —
then printing 'Distribution looks uniform' unconditionally next to it."

`e16f2e2` extracted the verdict into `src/analysis.ts:analyzePathUniformity()`, which returns
`consistent: boolean | null` and a verdict that names its own limits. Driven live on Exhibit 4:

- After 20 accesses (expected 1.3/leaf): "Verdict: Inconclusive: need ≥5 expected/leaf — run 80+
  accesses total." χ² = 13.60 was well under the critical value, so the old code would have
  printed a pass here off an invalid test.
- After 100 accesses (expected 6.3/leaf): χ² = 22.56, "This run is consistent with uniform paths
  (fail to reject H₀ at α=0.05)" — a claim scoped to the run, not to Path ORAM.
- All three branches (null / true / false) are pinned in `tests/analysis.test.ts`; 31/31 pass.

The same commit removed two further asserted claims the prior audit did not name: the Stash Peak
stat printed `peak / Z*(L+1) ✓` against a bound that is not the O(log N) guarantee (now just
"Observed Stash Peak"), and the medical-scenario replay hardcoded "three unrelated paths" where
it now reports the distinct-path count actually observed ("3 distinct this run. Collisions are
possible").

Remaining gaps (what would raise it):
- The "deviates from uniform" branch is only reachable by chance (~5% of runs), so most learners
  never see the test fail. A deliberately-broken-ORAM toggle (fixed leaf, or remap disabled) that
  drives χ² through the critical value on demand would make the statistic falsifiable in the UI
  rather than only in the test file.
- Nothing on the page lets the learner break the hiding property; the leakage the caveats list
  (access count, timing, stash overflow) is described in prose but never exhibited.

### ot-gate — 8 -> 8 (HEAD 35c2688)

Prior justification: "Both HIGH fixes from the prior review landed: two independent routes to the
shared point are computed and byte-compared, and the DDH game has a real 1000-round tally."

Both named strengths verified still live. Driving the page with b=1: the "Why the two keys line
up" panel prints the receiver's `r·A` and the sender's `a·(B−A)` as the same truncated point
`598ffad5dc…` with a computed "✓ same point" and shows k0 landing elsewhere
(`6353017000…`); "Verify Correctness" runs both b=0 and b=1 and reports that each chosen message
decrypted and the unchosen one did not; the auto-play tally reported "Computer guessed 331 of
1000 correctly, about 33.1 percent" — measured, not asserted. 14/14 vitest pass.

More important is a defect the prior score missed and `3fcceb4` fixed after it: the page taught
that B = rG vs B = A+rG are "computationally indistinguishable under DDH" and that C3's
"what breaks if DDH is broken" would expose the receiver's choice. Both are wrong — r is a fresh
uniform scalar, so the two distributions are identical (Chou-Orlandi Lemma 1, unbounded sender
still at 1/n), and it is CDH protecting the *sender* whose failure lets a receiver derive both
keys. C2 is now "Choice-Hiding Visualizer", C3 is rewritten in the correct direction, and a new
note discloses that the demo drops Chou-Orlandi's transcript-salted hash and names the MITM
(pass A through, hand the sender B′ = A+B, rotate the ciphertexts) that omission enables.

Remaining gaps (what would raise it):
- Nothing on the page lets the learner succeed at an attack. The one adversarial exhibit is a
  game the learner is supposed to lose, and correctly does.
- The B′ = A+B man-in-the-middle is now honestly described in prose but is not runnable; making
  it a toggle that unlocks the wrong message would be the missing break-it exhibit and the
  strongest argument for a 9.

### otp-vault — 9 -> 9 (HEAD fdc3282)

Prior justification: "Prior score holds. The perfect-secrecy panel is the copyable pattern for
the whole fleet."

Still true, and confirmed from source and live. `perfectSecrecyPanel.ts` fixes one real ciphertext
under a real random key, discards the key, then for any learner-typed target derives
k = c ⊕ p and re-decrypts to check `c ⊕ k === p` — the claim is recomputed per keystroke, and the
wrong-length branch prints "Your target is 5 bytes; it must be exactly 14 bytes to be a
candidate" rather than a silent failure. Every crib-drag readout is likewise computed: the
"✓ All 4 revealed bytes are printable" line reads `hit.allPrintable`, and the candidate ranking
buttons print `Math.round(h.printableRatio * 100)` from `rankByPrintability(dragCrib(...))`, with
a genuine "No offset reveals mostly-printable text for this crib" empty branch.

`6cec71f` (landed after the score) fixed a defect in the demo's centerpiece: `refresh()` cleared
all pins and was called from `update()` on every keystroke into the P1/P2 textareas, so a learner
who pinned "the " and then edited a message silently lost their entire reconstruction. `refresh()`
now takes `{ keepPins }` and replays surviving pins. Verified live: pinned `"the " → P1 @ 0`
persists across a subsequent edit. 46/46 vitest pass.

Remaining gaps (what would raise it):
- Three separate crib workbenches (two-time-pad, keystream-reuse, import) repeat the same
  interaction; the third adds little beyond bring-your-own-ciphertext.
- The perfect-secrecy ciphertext is fixed at panel construction, so the learner cannot re-roll it
  and see the argument hold for a different C without a page reload.

### patron-shield — 8 -> 9 (HEAD db2037f)

Prior justification: "Still the best-structured PIR teaching sequence with a genuinely computed
collusion break — docked one point for a 'Correct' badge that never reads the correctness flag it
computes."

That is exactly the one point, and `4973da9` closed it. `src/main.ts:311-325` now branches on
`result.isCorrect` and, on failure, prints `⚠ Reconstruction FAILED — r₁ ⊕ r₂ gave "<actual>",
expected "<title>"` in the danger colour instead of unhiding a success badge. The same commit
fixed a second, unnamed instance of the same fault: `renderCancellation` decided which record
survives with `idx === targetIndex` — from the answer, not from the masks — so a malformed query
pair would still have drawn a clean survivor sitting on the requested record. `visualizer.ts:179`
now computes `survives = in1 !== in2` off set membership, with a comment recording why.

`db2037f` additionally fixed a 32-bit packing boundary (`lowBitsMask`, now tested at 0/8/31/32
and throwing above 32) and corrected two display claims that did not match the live protocol
(the catalog toggle read "Showing 8 of 8" while showing 4; the PIR mask placeholder showed 8 hex
digits for a 2-digit mask). Verified live end-to-end on book #5: mask/response animation, computed
cancellation grid (`db[5] · ● ✓ keeps` / `db[7] ● ● ✕ cancels`), correct title reconstructed, and
the collusion button producing the real break. 24/24 vitest pass.

Remaining gaps (what would raise it):
- The failure branch of the correctness badge is unreachable through the UI — the protocol always
  succeeds. A "corrupt one server's response" toggle would make the newly-honest badge
  demonstrably falsifiable rather than only correct in principle.
- The naive-vs-PIR comparison panel is a static side-by-side; the naive query string is rendered,
  not sent through anything.

### phantom-vault — 8 -> 8 (HEAD 9672507)

Prior justification: "Entropy cap and modulo-bias panels now live and computed; nothing to break,
and the bias exhibit's sample is too small for the contrast it promises."

The sample-size half is fixed. `61a4752` changed `tallies()` in `src/ui/distribution.ts` from
iterating the run's sampled bytes to iterating `value = 0..255`, so both histograms are now the
exact mapping over the complete input domain rather than an inference from a noisy sample. The
copy was rewritten to match ("Both charts enumerate all 256 possible byte values ... Their shape
is exact rather than an inference from this run's small random sample"), and the live readout is
now a precise statement: "Each highlighted low position receives 3 of 256 possible byte values;
every other position receives 2." The run's actual sample is retained only as an explicitly
labelled run note.

Everything else checks out as computed. Driven live (note the app deliberately clears the
passphrase after each derive, so each run must retype it):

- same inputs twice -> identical password (`MMs#>?3T,gnPq*5oZps$`)
- version 1 -> 2 -> different password (`N>mvnq7GpX^K=g$)$[jE`)
- service change -> different password (`o;EoM+F>o)6Iq:pxb<en`)
- entropy cap genuinely switches which side binds: strong passphrase gives "Effective entropy
  129.5 bits / Format ceiling 129.5 / Master passphrase 164.7 — the output format is the limiting
  factor"; the `password123` preset gives "Effective 56.9 / ceiling 414.4 / passphrase 56.9 —
  your master passphrase, not the charset, is the limit here". Both branches reachable by typing.

Node test suite passes (0 fail).

Remaining gaps (what would raise it):
- The prior's other complaint is untouched: there is no adversary anywhere. Nothing recovers a
  password, and the modulo-bias panel shows the biased map without ever letting a learner exploit
  the bias to narrow a search.
- The "Prove It" panel's four-row table did not populate within 12s of clicking Run Proof in my
  run (all four Password cells stayed em-dashes); worth a look, though the same three claims are
  independently verifiable by hand as above.

### pki-chain — 7 -> 8 (HEAD 948a95d)

Prior justification: "An excellent RFC 6962 CT exhibit bolted onto 'certificates' that are JSON
objects, under a hero bar reading X.509 / RFC 5280."

`635cb58` addressed exactly that mismatch, and did it by dropping the claim rather than by
hand-waving. Confirmed live:

- Hero now reads "X.509 / RFC 5280 *semantics*, JSON standing in for DER · CT (RFC 6962)" and
  links to a new `#scope` section.
- Directly under the certificate inspector: "**Encoding note:** these are not real X.509
  certificates. A certificate here is a JavaScript object, and the bytes that get signed are its
  `JSON.stringify` serialization — there is no ASN.1 or DER anywhere in this lab."
- The new Scope section's "what the JSON encoding leaves out" card names the pedagogical cost
  precisely: no parsing-differential bugs (null-byte-in-CN, BER/DER length ambiguity, length-field
  overflow, the OpenSSL name-constraints/punycode overflows), no DER-canonical fingerprints, and
  no `basicConstraints`/`keyUsage`/`SAN`/name constraints — so the CA/leaf distinction here is
  merely positional.

The underlying lab holds up. Every validation line is computed and every failure path is real:
clean -> `Overall: PASS`; CRL toggle -> `Overall: FAIL` with "A certificate serial appears in a
CRL"; Tamper Leaf -> `Overall: FAIL` with "Leaf signature is invalid". The CT exhibit produces a
real Merkle inclusion path, a consistency proof reporting `old=1 → new=2, path=1 hash,
verify=true`, and a misissuance monitor naming the out-of-policy issuer. 17/17 vitest pass.

Remaining gaps (what would raise it):
- The honesty fix is prose; the lab still cannot exhibit the attack class it now correctly says
  it omits. A single DER-parsing exhibit (even one hand-built certificate with an ambiguous
  length) would convert the Scope card's best paragraph into something the learner can run.
- OCSP status reads `leaf=unknown, intermediate=unknown` on a clean run, which is a weaker
  starting state than the CRL path and makes the OCSP toggle the less legible of the two.

### poly1305-mac — 9 -> 9 (HEAD 6d24d15)

Prior justification: "The learner types a message the sender never signed and the real key accepts
their forged tag — recovered by genuine algebra, not brute force."

That claim is true now. It was substantially false when the 9 was assigned. `6d24d15` documents
the defect with measurements: the candidate filter tested only the clamp mask over the low 16
bytes, but candidates come back reduced mod 2¹³⁰−5, so `r + k·2¹²⁸` has identical low bytes and
passed; the second-tag check is near-vacuous for close messages because neighbouring-Δ candidates
differ by `2¹²⁸·(c₁−c₂)⁻¹` and multiplying that by `(c₁−c₂)` is zero mod 2¹²⁸. Measured wrong-key
rate: 1985/2000 for `"A"`/`"B"`, 1540/2000 for `"abc"`/`"abd"` — the demo displayed the wrong r as
the stolen secret and then printed "Forgery did not verify" under a comment saying that should
never happen. The fix rejects candidates at or above 2¹²⁴ and enumerates all survivors instead of
returning the first, forging only when exactly one survives.

Driven live across four message pairs, all four branches behave correctly:

- `"Hello Alice"` / `"Goodbye Bob"` -> r and s recovered, "VALID — forged tag accepted by the real
  key", tag `95E487310940C424D999B2F66378D85F`
- `"A"` / `"B"` -> uniquely recovered this run, forgery VALID
- `"abc"` / `"abd"` -> "Key not pinned down — 4 candidates fit", no forgery, no r displayed
- `"same"` / `"same"` -> "Need two different messages"

The three verify scenarios return VALID / INVALID / INVALID from real constant-time comparison,
and the stepper prints the real clamped r and field arithmetic. 18/18 vitest pass, including new
cases pinning that a `r + k·2¹²⁸` candidate is rejected and that underdetermined pairs are
reported as ambiguous.

Remaining gaps (what would raise it):
- The ambiguity branch is the most interesting thing on the page and is currently a one-line
  status; showing the surviving candidates and letting the learner see that each reproduces both
  captured tags would turn a refusal into a lesson.
- Both reuse messages must be single-block; the multi-block case (where the polynomial has degree
  > 1) is out of scope and not signposted at the input.

### psi-gate — 7 -> 9 (HEAD 98b3c5e)

Prior justification: "Corrected down from a filed 8. Its DDH exhibit should fail its own test, and
its input-validation certificate is for validation that never runs."

`2dc378a` is the largest single remediation in my slice and closes both, plus three more:

1. **Validation certificate made true, not weakened.** `isValidPoint` was reachable only from
   `attacks.ts` and the tests; neither `psi.ts` nor `oprf-psi.ts` called it, so the identity
   encoding the probe reported as rejected would have been decoded and multiplied on the real
   path, collapsing every Y_i to O — exactly what the probe's own warning text described.
   `assertValidPoints` now runs on X_i in `bobRound2`, Y_i and Z_j in `aliceRound3`, the query in
   `oprfBobRound2` and the evaluation in `oprfAliceRound3`, throwing a typed `InvalidPointError`.
   The probe table now has two columns — `isValidPoint` and `psi.ts bobRound2` — and says "Only
   the second column is evidence about the protocol". Verified live: all four encodings show
   "✓ rejected by validation" in the protocol column. The random-bytes probe is correctly flagged
   `mustBeRejected: false` because ~1 in 16 random strings really is a valid encoding.
2. **Flatness exhibit was biased by construction.** The worker binned all 32 bytes as uniform
   draws, but byte 0 is always even and byte 31 never reaches 0x80 (RFC 9496), adding ~310 of
   systematic χ² to ~255 of noise at n=5000. Bytes 1–30 now carry the test; bytes 0 and 31 are
   charted separately with their constraints **measured per run** ("Byte 0 odd (should be 0): 0 of
   5,000"). Live: χ² = 266.45 inside the α=0.05 band, "Consistent with uniform — cannot reject H₀".
3. **The χ² ladder tested an α it did not report** — the 0.05 band sat strictly inside the 0.01
   band, making the middle branch unreachable. Replaced with exact χ²(255) quantiles, ordered
   strictest-first.
4. **Exhibit 3's alignment grid was a different execution** from the result above it; both now
   read one trace.
5. **"Simulate Scalar Reuse" ran fresh scalars, not the reused α** it was about. Live now:
   "Both sessions above were executed with the reused α shown to the panel", 2 of 3 byte-identical
   X_i shown in hex, and the wire value correctly renamed from Y_i to X_i (Bob draws a fresh β
   each session, so Y_i is not linkable).

Exhibit 1's two columns are now labelled "omniscient view" with the sentence "That is the lab's
omniscient view, not any participant's". 40/40 vitest pass.

Remaining gaps (what would raise it):
- The built page logs a CSP violation for an inline script whose sha256 is not in the meta-tag
  `script-src` list; the page still renders, but the hash list is stale.
- Attacks 1, 2 and 5 are still one-click scripted simulations; only scalar reuse and the injection
  probe let the learner see the mechanism in bytes.

### quantum-entropy — 8 -> 9 (HEAD b4028ad)

Prior justification: "Honest that it is a classical simulation, and says so where the learner
stands." That was recorded by the thin pre-batch pass and understates the demo considerably.

`5f776d7` fixed the one falsifiable claim on the page: the panel h2 read `Shannon says "99.7%
random."` as a string literal, true only at the default 53/47 device — at 70% detector mismatch
the heading still said 99.7% while the statistic three lines below read 0.8813 bits/bit. The
numeral now renders from the same live `hSh`. Verified: 53% -> "99.8%", 70% -> "87.6%",
70%+correlation -> "90.5%", each agreeing with the stat grid beneath it. `b4028ad` fixed the
README tagline that called the modeled beam-splitter "a real quantum source" while every other
surface in the repo said otherwise.

What the re-audit found beyond the prior note — all learner-driven and all computed:

- The stat grid recomputes bias, Shannon H, min-entropy H∞, single-guess success, and naive
  256-bit attacker work per slider move: 2^234.5 at default, 2^131.7 at 70% bias, 2^11.7 with
  correlation added.
- Adding correlation switches the verdict branch entirely: "dependence detected — model rate
  0.0458 bits/bit. First-order diagnostic: a predictor guesses 95.5% of this sample's bits, so
  bias alone no longer describes the source."
- The Toeplitz panel is a real break-it. Demanding m = 256 from k = 234.5 gives "✕ REJECT — the
  bound is vacuous ... The output below still looks perfectly random — that is exactly why the
  accounting, not the appearance, is the verdict." Producing output is explicitly separated from
  being secure ("128 bits produced — the GF(2) multiply always runs fine").
- The extract button is gated on a latched health alarm from panel 5: "A real conditioner never
  accepts material from an alarmed source — repair and recommission first."
- Observed-sample figures are labelled "DIAGNOSTICS ONLY ... never part of the budget", and the
  2⁻³²/2⁻¹⁰ accept lines are labelled "this lab's teaching policy, not part of the theorem".

47/47 vitest pass.

Remaining gaps (what would raise it):
- The photon source is `crypto.getRandomValues` behind a model; honestly labelled everywhere now,
  but no exhibit shows what a genuinely quantum source would change.
- The five panels are independent controls rather than a single narrative; nothing sequences the
  learner from "spec sheet says 99.8%" to "your key has 11.7 bits" without them finding it.

### ratchet-wire — 8 -> 8 (HEAD 90367a8, nested package at `ratchet-wire/`)

Prior justification: "Real Double Ratchet the learner drives with two learner-parameterized
failures; the compromise story stops one decrypt() short of a break."

The named gap is unchanged, so the 8 holds. What did land is `90367a8`, which fixed a defect the
prior score did not name: the break-in recovery panel printed "New root (safe)" and announced
"the attacker is locked out" purely because the button had been pressed. It now computes
`rotated = newRoot !== this.recoverySnapshotRoot` and, when false, prints "New root (UNCHANGED —
no DH ratchet fired) ... but the root key did not move, so nothing was recovered. This is a bug,
not a lesson." The aria-live announcement is gated on the same flag — worth noting because
`nonce-guard` has the opposite pattern (computed badge, fixed announcement). The same commit
corrected four Signal-spec citations that pointed at §3.3 "Initialization" for KDF_RK and
DHRatchet, with the renumbering history (§5.2 -> §7.2 after the Sparse PQ / Triple Ratchet
sections were inserted) recorded in the source comments.

Verified live: compromise -> snapshot root `00AFE098…`; Alice sends with a new DH key; Bob
receives -> new root `C464EFF6…`, "Bob's DH ratchet count: 2", decrypted "Recovered traffic 🔒".
The MITM demo aborts X3DH with a real signature failure. The forward-secrecy panel genuinely
derives the exposed message keys from the stolen chain key and prints their hex (MK[3]
`FACC9420ED97AE46`, MK[4] `DFA2566DDEF2204C`, MK[5] `827CE9822874FA22`) while marking m0–m2
"safe — cannot derive (one-way KDF, chain key gone)". 60/60 vitest pass.

Remaining gaps (what would raise it):
- Still one decrypt short. The attacker derives the right message keys and the page shows them,
  but no ciphertext is ever opened with a stolen key, so the learner reads a hex string where they
  could be reading a plaintext they were not supposed to see.
- The break-in recovery is a fixed three-button sequence; the learner cannot choose when Alice
  ratchets or attempt the recovery from a state where it should fail, so the newly-honest
  "UNCHANGED" branch is unreachable through the UI.

### ring-sign — 7 -> 9 (HEAD cf0ff1b)

Prior justification: "Real LSAG with a genuine tamper path and animated challenge chain — but the
linkability exhibit's 'not linked' branch is unreachable code."

`7f719ce` fixed that and two more; `53ed872` fixed three others. All verified live:

- **The named defect.** `runExhibit2` signed both spends with `state.signerIndex`, so
  `detectKeyImageReuse` could only return true. Spend B now has its own signer selector. Driven:
  B=M1 against A=M2 -> "Reuse detected: **no** — the two key images differ, so the ledger accepted
  both (computed by comparing the images above; spend A signed by M2, spend B by M1)"; B=M2 ->
  "Reuse detected: **yes** — the two key images are equal, so one secret signed both", with the
  ledger showing "✗ REJECTED double-spend".
- **Chain-closed badge was set unconditionally** by the animation. Now
  `chainActuallyCloses(state.ex1Chain) && state.ex1Verified`. Driven: honest run -> "chain closed:
  cₙ == c0 ✓"; after "Flip one byte of a response" -> "chain broken: cₙ ≠ c0 ✗" with the real
  differing endpoints (c0=0a9f4f5… vs cₙ=…), and the tamper line "Flipped one byte of s0 →
  rejected".
- **Exhibit 3 asserted linearity**, including in its aria-label. Now an OLS fit over the samples:
  "sign ≈ 0.983 ms per extra ring member (R² = 0.990), verify ≈ 1.17 ms (R² = 0.995) ... The fit
  above is measured, not assumed", with a "your run was noisy" branch when the fit is weak.
- **Exhibit 4's "Signer identity to verifier: hidden" was a fixed string** while `group.ts` ships
  a stable `credentialId` and the member public key in the clear. New `linkageFromWire()` derives
  the pseudonym from the collected signatures alone. Live after three signings by one member:
  "3 across 1 distinct signer; 3 of them share this pseudonym, linked by the fields credentialId,
  issuedPayload, managerSignatureHex, memberPublicJwk, which were byte-identical across every one
  of them. Any verifier can do that grouping; no manager needed."
- **The response grid was built from the prover's `LsagSignature`**, including `signerIndex`. New
  `toVerifierView()` strips it; a test pins that `verifyLsag` succeeds on a view with a falsified
  `signerIndex` because it never reads one.

35/35 vitest pass.

Remaining gaps (what would raise it):
- After a tamper, the Exhibit 1 status block reads "chain broken: cₙ ≠ c0 ✗" immediately above
  "**Verification:** valid ring signature". Both are true of different objects (the tampered chain
  vs. the original signature) but they share one `aria-live` region with nothing distinguishing
  them; the tamper's own "rejected" line is further down the page.
- The tamper buttons rerun a side verification rather than replacing the session's signature, so
  the learner cannot carry a broken signature forward into Exhibit 2.

### scloud-vault — 8 -> 8 (HEAD ff21806)

Prior justification: "A real hand-rolled Scloud+ and the best on-ramp in the cluster; Exhibit 3's
correction-radius crossing is a true break-it exhibit."

Both halves confirmed. Exhibit 3 driven across three noise regimes is genuinely measured, not
staged: σ=100 -> 100/100 and "All decoded correctly — noise is within BW₃₂ correction radius";
σ=600 -> 99/100; σ=1400 -> 7/100, with the single-trial view showing the message decoding as 10
(01010) when 13 (01101) was sent and "✗ FAILURE — noise exceeded correction radius".

`301a92a` fixed two claims the prior score did not name:

- The review-scrutiny cards rendered `meter()` bars at hardcoded 100% / 45% / 18% widths under
  labels like "Years of public analysis" and "Independent cryptanalysis papers" — invented
  quantities styled as measurements of a research literature. Replaced by six `reviewFact()` rows
  carrying sourced statements ("NIST PQC: 2016–2024", "3 public rounds + FIPS 203", "published in
  2024", "individual IETF draft"). Verified live: 0 meter elements, 6 fact rows.
- The README, `params.ts` and the keygen callout all described the in-browser KEM as a
  "single-vector simplification". It is not — `B` and `S` are n×32 matrices. All three now say so,
  and the live callout reads "This demo's public key is 28832 bytes; the real Scloud+-128 public
  key is 7,200 bytes (paper Table 6) ... it uses a full 600×32 matrix B, a simplified 32-column
  message geometry, and demo packing/coding" — note the demo key is *larger* than spec, which the
  old "scaled down" framing would have made incoherent.

41/41 vitest pass; a new `e2e/claims.spec.ts` pins both fixes.

Remaining gaps (what would raise it):
- `src/exhibits/exhibit3.ts:108-112` — the 100-trial verdict is a three-way branch on 100% / 0% /
  everything else, so both 99/100 and 7/100 print "⚠ Partial failure — noise is near the boundary
  of the correction radius." At 7% success the noise is far past the boundary, and the sentence is
  simply false. This is the one remaining asserted claim I found on the page and the cheapest fix
  on this list.
- The FO transform's tamper path (`#encaps-tamper`) is a single scripted button rather than a
  learner-chosen corruption.

---

## Source: `reverify-4`

# Re-verify pass 4 — 2026-08-02

Re-verification of 14 recovered scores from SCORECARD-2026-08-01.md against fetched current
source, built output, and Playwright-driven behavior. Read-only over the demo repos.

Assigned demos: search-vault, shadow-vault, silent-tally, snark-arena, spake-gate,
sphincs-ledger, ssh-handshake, stark-tower, vrf-gate, web-of-trust, webauthn, world-hashes,
x3dh-wire, zk-arena.

| demo | HEAD | prior | current | what changed |
|---|---|--:|--:|---|
| search-vault | 3bec966 | 9 | 9 | Prior stands. 78/78 unit tests pass; Playwright run confirms the leakage-abuse attack is computed live (14/14 recovered at exact knowledge), the "actually" scoring column is post-hoc as claimed, and the knowledge-error slider genuinely degrades recovery (100% -> 86% -> 29%). Commit 37b816f since scoring hardened unknown-query handling. |

- search-vault remaining gaps: Exhibit 3 (pattern-only visualization) is mostly display; the SSE/ORAM/FHE comparison table mixes one measured number (50 timed searches) with asserted literature costs. Not enough interactive falsification of the comparison exhibit to call it claim-complete.

| shadow-vault | 00f6027 | 6 | 8 | Up. The prior 6's named defects are fixed: 79f9603 documented the global-constant salt and softened the two undetectability claims on-page; 00f6027 put deniability limits ("format-aware adversary knows a second slot exists") and Argon2id creation parameters into the UI, not just .md files. Playwright run: full round trip with a real downloaded container — decoy passphrase decrypts the decoy, real passphrase decrypts the real message, wrong passphrase honestly reports "No message found"; the coercion scenario performs real decryptions of the learner's own messages; attacker/holder container-map toggle works. |

- shadow-vault remaining gaps: "attacker sees uniform noise" is shown as an animation, not a computed statistical comparison against true randomness; no learner-mounted attack (e.g., brute-forcing a weak decoy passphrase to confirm a slot) even though the page states that caveat; entropy meter is an estimate.

| silent-tally | d1507f2 | 7 | 8 | Up. The exact defect that cost the point is fixed: f94b1b6 ("Exhibit 6: compute the coalition attack instead of asserting it") replaced the coalitionArr.length verdict with attackSucceeded read off a real wasm lagrange_interpolate over the coalition's actual shares. Playwright confirms: 1 and 2 colluders reconstruct wrong field-sized values (e.g. 14445048432114572 vs real 983), 3 colluders recover the victim's count exactly (761 = 761). 18/18 unit tests pass. |

- silent-tally remaining gaps: still a guided six-step walkthrough — the learner locks in counts and watches, but never chooses inputs adversarially outside Exhibit 6; the "omniscient view" line is the only place the true secret appears, which is honest but means the sub-threshold "belief unchanged" claim rests on prose rather than a demonstration over multiple candidate secrets.

| snark-arena | 8f79cf2 | 7 | 8 | Up. Both named defects fixed by 8f79cf2: the false "only x = 3" takeaway is now computed via satisfyingWitnesses() over F_8191 (page reads "3 field elements satisfy the circuit: 3, 3527, 4661"), and the decorative Exhibit 02/03 Verify buttons (Math.random() timings for nonexistent proofs) were removed. Playwright confirms: real snarkjs Groth16 prove -> verify true, tamper -> verify false; KZG honest opening accepted (12 = 12) and tau-leak forgery accepted (1 = 1) with both verdicts branching on the computed flag; Exhibit 02 ceremony sim now runs runCeremony() per-click with varying computed verdicts. 8bde172 also fixed four accuracy defects (proof-size labeling, Sapling ceremony counts, Halo2/Scroll, field names). 40/40 tests. |

- snark-arena remaining gaps: quiz is static multiple-choice; Exhibit 02/03 sizes and timings are now honestly labelled published snarkjs figures rather than measured here; the trusted-setup honesty (keys unsound by construction) is stated rather than exploitable — a learner cannot actually use the published tau to forge a Groth16 proof on the featured panel.

| spake-gate | bf2d0ce | 9 | 9 | Prior stands, and is now better-founded than when scored. 0c6266c fixed a defect the prior 9 never caught: the two compromise banners ("Handshake valid" / "IMPERSONATED") were rendered unconditionally and would have read identically on failure; they now branch on the real MAC comparison and on a genuinely forged SPAKE2+ login run against an honest verifier holding only (w0, L). Playwright confirms both branches reachable: weak password -> "IMPERSONATED (after offline crack)", strong password -> "Dictionary exhausted", "No forged handshake", "HELD". RFC 9382/9383 KATs verified live in-page; 18/18 tests. |

- spake-gate remaining gaps: the M/N nothing-up-my-sleeve derivation is displayed and curve-checked but not re-run from the seed in-page (the page says so plainly); dictionary is a fixed 14-entry list rather than learner-supplied; PBKDF2 iteration count is deliberately low, disclosed. Closest of my 14 to the 10 bar.

| sphincs-ledger | ac6439b | 7 | 8 | Up one, by honesty rather than by mechanism. ac6439b addresses both named defects: the checksum omission that "teaches a wrong general fact" is now stated on-page ("It is not a complete WOTS+ signature forgery: this teaching model omits the Winternitz checksum chains that couple the digits"), the exhibit and button were renamed from "Forge" to "One-chain exposure" / "Derive Chain Point", and the hypertree's fixed-constant path is now labelled "an illustrative amber path... not parsed from a signature". Playwright: real SLH-DSA sign VERIFIED in 9.8 ms, byte-flip REJECTED, WOTS reuse derives step 6 -> step 7 by real SHA-256. 55/55 tests. |

- sphincs-ledger remaining gaps: the checksum is still not implemented, so the headline WOTS+ lesson is disclosed-incomplete rather than complete — implementing checksum chains and making a real full forgery reachable is the single item that would take this to 9. The "START HERE" path step 2 still reads "Reuse breaks it / forge it yourself", which now overstates what the panel below it does. Hypertree path remains illustrative.

| ssh-handshake | 7632494 | 8 | 9 | Up. The disputed defect the main thread pinned the 8 on (ui.ts verdict string chosen by checkbox while CSS class came from the result) is gone — 63518fc rebuilt the exhibit as three levels of client checking, each running a real handshake against a real fresh MITM, with every badge/class/verdict derived from the returned ConnectResult plus a computed fingerprint comparison. Playwright confirms the corrected lesson: at KEX only and at KEX+signature the MITM connects with the signature reading VALID ("that is exactly the trap"), and only the known_hosts pin level rejects. Same commit also derived scenarioRogueCa from verifyCert instead of hardcoding it, and fixed the CA fingerprint to be the real ssh-keygen -lf value. 40/40 tests. |

- ssh-handshake remaining gaps: strongest of my 14. Off 10 because most other scenarios (rotation, SSHFP, CA) are still menu-driven scripted paths rather than learner-constructed, and the algorithm-negotiation section is largely display. The MITM lab itself is claim-complete.

| stark-tower | 883421a | 8 | 9 | Up. Three commits since scoring made the metrics claim-complete: 3ec7e3e aligned the stated soundness with what the code computes (24, not 20), 097b819 bound Merkle openings to a position in a vector of known length, and 883421a made the proof metrics and verdicts derived. Playwright: the degree-explosion middle step works both ways (honest remainder 0, deg Q = 1 -> "FRI will accept"; tampered remainder deg 13, deg Q = 15 -> "FRI will reject"), the e2e verifier prints a six-line report where the corrupt run flips exactly the FRI low-degree line to X and lands on REJECTED, and the proof-size/soundness tiles now disclose their own accounting ("only queries x log2(blowup), the FRI query term"). Custom node scripts/test.mjs harness: all DOM checks pass. |

- stark-tower remaining gaps: the jargon wall the prior review named is still the main barrier — Exhibit 01 opens on AIR/LDE/vanishing-polynomial vocabulary with the glossary below the fold. The tradeoff-triangle slider outputs a heuristic labelled as such rather than a measured false-accept rate; an actual sampled liar-slips-through experiment would close the last gap to 10.

| vrf-gate | ec1bad9 | 8 | 8 | Prior stands, but is now earned rather than generous. 62ced3d fixed a real correctness bug (Miller-Rabin ran bases 4, 327, 9377... while claiming the Sorenson-Webster set and its bound), dropped a fabricated estimateVDFTime that divided by a hardcoded 1M squarings/s, and corrected a false claim about composite-ell verification; 3e9c16e/c3dce68 scoped every VDF delay claim to the construction and shipped the lambda shortcut as a learner-pressable button. Playwright: RFC 9381 KAT passes, uniqueness compares all 32 bytes across 5 runs, tamper -> INVALID, the shortcut reproduces y instantly, the beacon runs real VRFs with a withholding validator and prints the counterfactual honest mix. What still holds it at 8 is what the prior review named: it is the weakest-visualized page here — near-everything is a hex readout. |

- vrf-gate remaining gaps: headline VDF metric reads "0.3x cheaper than replaying the squarings" for a verification that measured 24.20ms against a 7ms recompute — i.e. ~3.5x more expensive; the underlying numbers are both shown, so it is a wording defect rather than a hidden claim, but it is the one line on the page that reads backwards. The verifier status pill also stays "VALID" after Tamper until re-verified (stale, not false). Visualization remains the biggest pedagogy gap.

| web-of-trust | a555bdd | 8 | 9 | Up. The prior 8's named defect — "several panels state crypto facts from flags instead of computing them" — is addressed by 1d5cfa8, which made revocation a computed RFC 4880 5.2.1 outcome and named its own simplification (no revocation reason codes, so it takes the conservative branch) in a source comment surfaced on-page, and by 482ad75, which stopped presenting 8-byte truncated key IDs as fingerprints and turned the truncation into a taught lesson about short-ID collisions. Playwright: revoking Alice's key yields REVOKED with the RFC citation and cascades Eve to INVALID; the forged certification is rejected by real Ed25519 verification ("The crypto enforces this, not policy"); over-trusting Eve genuinely promotes Heretic to VALID at depth 3. 24/24 tests. |

- web-of-trust remaining gaps: the five Break-trust experiments are still preset buttons rather than learner-constructed attacks; the WoT-vs-PKI comparison table is entirely static prose; the marginals quorum ("need 3") is stated in the reason string but the learner cannot watch the count cross the threshold. Revoking a certification edge produces the reason "Signed by You, but no trusted path reaches them", which is accurate but reads confusingly.

| webauthn | 8029a42 | 8 | 8 | Prior stands; the 8 is now earned rather than generous. Two defects the prior review missed were fixed since: d4b6000 found that the real-passkey section printed "Verified" off the ECDSA check alone — it would have read Verified for a replayed challenge or a phishing origin — and made the badge the AND of seven checks each rendered as its own pass/fail row; 8029a42 corrected a hero-level overclaim from "Run a real WebAuthn ceremony" to naming the top section a simulation with simplified JSON encoding and the navigator.credentials ceremony a separate section. Playwright: baseline is held beside each attack result with per-check rows — phishing FAILs only Origin match, bit-flip FAILs Signature and Counter. What still caps it at 8 is exactly what the prior review named: every attack is a scripted button. 38/38 tests. |

- webauthn remaining gaps: the learner never composes an attack — no editable clientDataJSON or origin field, only preset mutations. The live navigator.credentials path cannot be exercised headless, so its seven-check verdict was verified by source read plus the repo's own e2e/claims.spec.ts rather than by my driving it. Attestation is out of scope and said to be.

| world-hashes | a8eea9f | 7 | 7 | Prior stands, unmoved. Its named defect is unchanged: I confirmed by visible-element count that only the SM3 tab carries the 61 learner-clickable flip cells; the Streebog and Kupyna avalanche panels compute real digests and real bit counts but the one-character change is not learner-chosen, and the Anchors and Comparison tabs have no avalanche panel at all. Nothing on the page ever breaks. Commits since scoring are honesty and robustness only — b48a176 corrected the construction taxonomy (Kupyna is Grostl-style wide-pipe, not a sponge; SHA-3 is the lab's only sponge) and c5e7f01 pinned that with a claims test asserting the panel reads "It is not a sponge". 58/58 tests, 17/17 KATs green on-page. |

- world-hashes remaining gaps: make the Streebog and Kupyna avalanche panels learner-driven the way SM3's is — that alone is most of the way to an 8. Then give it something that fails: a length-extension forgery against SM3/SHA-256 contrasted with Streebog and Kupyna refusing it is the exhibit the page keeps describing in prose and never runs.

| x3dh-wire | dff31fc | 9 | 9 | Prior stands, and the commit it rests on is confirmed present. 240f4f9 replaced a standalone Ed25519 signing keypair (whose verification key was published in the same bundle, so a substituted bundle substituted the verifier and the signature bound nothing) with real XEdDSA over Curve25519, recovering the signing key from ikBPub via the birational map. Playwright, all four break-it toggles: Tamper SPK -> Signature INVALID; Relay swaps SPK_B -> authentication failed, key mismatch, SK MISMATCH, Decrypt FAILED; Drop OPK -> DH4 omitted but SK still forms; Corrupt EK_A -> SK MISMATCH, Decrypt FAILED. Each is a distinct computed downstream effect, not a shared failure banner. 43/43 tests. |

- x3dh-wire remaining gaps: the missing associated data is disclosed unusually well ("Omitting AD is a real weakening, not a simplification of notation") but is still missing — implementing AD = Encode(IK_A) || Encode(IK_B) and letting the learner mount the re-contextualisation attack it defends against is the path to 10. The five panels remain a linear walkthrough; the break-it toggles are gated behind reaching Panel 5. Prior review said "five toggles"; there are four plus Regenerate.

| zk-arena | 882ba0e | 8 | 9 | Up. The prose self-disclosure the prior 8 praised became a runnable attack: cddd8c7 added a real 2048-bit prime-order parameter set plus a live Pohlig-Hellman lab that recovers 19.11 of 256 bits on the toy group and confirms the recovery against the true secret, then returns empty-handed on the safe group — including an honest note that the computed Legendre symbol distinguishes nothing and an explicit refusal to pretend it factored a 2047-bit number. 882ba0e made the honest-tau branch concrete rather than narrated: it tries s? = s + 1 as one explicit guess and lets the verifier decide. Playwright: malicious tau -> "False claim ACCEPTED" with both sides printed identical; honest tau -> "False claim rejected" with both sides printed different. 81/81 tests. |

- zk-arena remaining gaps: the namesake SNARK-vs-STARK Arena is still an eight-dimension editorial table of literature figures, and no proof of either family is generated anywhere on the page — but it is now correctly labelled ("representative orders of magnitude... Educational comparison only"), which is why it no longer costs a full point. Generating a real proof from each family and measuring the size gap it asserts is the path to 10. The recommender is a scored questionnaire, not a computation.

---

## Source: `postfix`

# Scorecard — 2026-08-02 post-fix re-verification

Twelve Crypto Lab demos received defect fixes on 2026-08-02. This file re-scores each one
**after** its fix, to establish whether the fix actually moved the pedagogy score.

Method per repo: fetch origin and confirm the named fix commit is in history; `npm ci`; read the
prior justification in `SCORECARD-2026-08-01.md` / the `SCORECARD-2026-08-02-slice-*` and
`-reverify-*` files; then verify the fix by **driving the built page with Playwright chromium**,
not by reading the diff. Scoring is against the whole bar — claim-completeness — not just the
fixed item, so a delivered fix removes one cap but may leave others and the score may legitimately
not move.

The bar: a 10/10 demo is claim-complete — every claim the page makes is computed from that run
rather than asserted, every verdict states only what the protocol actually learned, and every
important browser state is tested rather than merely visited. No demo in the fleet has reached 10.

Read-only assessment. Nothing in any demo repo was modified.

| demo | HEAD | prior | current | did the fix deliver? | what still caps it |
|---|---|--:|--:|---|---|
| mpcith-sign | c66fa13 | 7 | **8** | **Yes, fully.** Exhibit 2b is now a real cheating prover. Each attempt builds a forged transcript, Fiat-Shamir derives the challenge from the real Merkle roots, and the demo's own `verify()` judges it — rejections quote the verifier's own reason, e.g. "Local MPC output mismatch in round 3, party 0". Crucially the tally is no longer a Bernoulli stand-in: driven at four parameter settings × 100 attempts each it tracks theory from measurement — N=2/τ=1 → 54% and 44% accepted (theory 50%), N=3/τ=1 → 37% (33.3%), N=2/τ=2 → 21% (25%), N=4/τ=1 → 24% (25%), and N=4/τ=4 → 0/100 accepted (0.39%). Forgeries really are accepted when the challenge happens to hide the corrupted party, and really are rejected otherwise. 22 vitest tests (was 19), all green. | The other two items from the prior list are untouched: no learner-mounted tamper against the real Fiat-Shamir or PERK signature (Exhibit 3's "Modify Message" recomputes the challenge, it does not let the learner break a signature), and no nonlinear round, so the honestly-disclosed linear special case is still the whole scope. e2e remains a11y-only (`a11y.spec.ts`, `a11y-interactive.spec.ts`) — the new forgery tally, the accept and reject branches, and every other verdict are unasserted in the browser, for a 1328-line UI. A one-attempt run also reports only a tally; the accepted forgery itself is never shown to the learner. |
| pairing-gate | fe373e6 | 7 | **8** | **Yes.** Driven live: sign → "Flip One Bit" → verify. The SIGNATURE block now re-renders as "Signature — ALTERED (48 bytes compressed G₁)" with the changed nibble `<mark>`-highlighted against the pre-tamper value, so the σ on screen is the σ being verified. The failing verdict now carries two `mark.diff-mark` elements — one per side — showing genuinely different nibbles (`0` vs `1`) in a byte-aligned window centred on the first difference, each prefixed "…first 272 bytes identical…" rather than presenting the window as the start. The two G_T strings are visibly different where before they were byte-identical for the whole displayed prefix. The negate fallback's note is honest ("The signature was replaced with its negation (−σ), a different valid point"). 5/5 Playwright pass, including three new `e2e/claims.spec.ts` regressions that assert the altered render, the two highlighted-and-differing nibbles, and the clean path staying unmarked. | Still **no unit test suite** — `package.json` defines `dev`/`build`/`preview`/`test:a11y` and nothing else, so there are no KATs, no bilinearity assertions and no rogue-key/PoP regression for a demo whose entire claim is real pairing arithmetic; the three new tests are browser claims-checks for this one fix. The tamper still almost always falls through to `σ.negate()` rather than a real bit flip, and the page states *that* 272 bytes are identical without saying *why* (the Fp12 conjugate). Sections A2–A4, D1, D3–D4 and E remain static prose. The full-576-byte reveal is now rendered only on the matching branch, so on mismatch the learner cannot inspect the whole value. |
| pq-tls-handshake | 1af14c1 | 7 | **7** | **Yes, but it was a copy fix.** Driven live through the full step-through: the derived-secret facts now read "Hybrid shared secret: 64 bytes (32 ML-KEM + 32 X25519, in that draft-mandated order)" and Exhibit 2 reads "Final shared secret = ML-KEM_secret \|\| X25519_secret — the ML-KEM share comes first for X25519MLKEM768, and an implementation that concatenates in name order will not interoperate", so the page now names the interop hazard instead of demonstrating it. Neither reversed string survives anywhere in the rendered text. The new `e2e/claims.spec.ts` does better than assert the words: it cross-checks the displayed hybrid capsule's leading hex against the ML-KEM component and its trailing hex against X25519, so flipping `concatBytes` fails it. 12/12 phase checks and 4/4 Playwright pass. | The other and larger problem the prior score named is untouched: **the demo still never fails at anything.** A live text scan of the fully-stepped page matches no occurrence of tamper / downgrade / corrupt / mismatch / failure anywhere; Exhibit 2 is still five static Secure/Broken table rows, and the learner's entire verb set is Step / Auto-play / Reset. There is no corrupted ML-KEM ciphertext, no substituted server share, no 0x001d downgrade — the secrets-agree indicator can only ever print "✓ match". That alone holds it at 7 on this fleet's calibration. The Exhibit 6 adoption figure is now dated ("As of mid-September 2025") but still not computed or linked. |
| hqc-timing | 1fb975b | 7 | **7** | **NO — the fix does not reach the browser.** The recalibration is real in `src/data.ts` (Borderline noise 6→**50**, Too noisy noise 12→**120**), but `#noise` is `<input type="range" min="0" max="12">` and `applyPreset` assigns `noise.value = String(p.noise)`, so **the browser silently clamps both to 12** and `run()` reads `parseFloat(noise.value)`. Driven live: clicking "Borderline" leaves the slider reading **noise=12**, and 5/5 fresh-secret runs printed "Key recovered · 32 of 32 bits recovered · 100%". Clicking "Too noisy" also lands on **noise=12**, giving 32/32, 32/32, 32/32, 32/32, 31/32 — still "Key recovered". Noise 12 is precisely the value the commit message identifies as the broken setting. Both presets still advertise outcomes they cannot produce, exactly as before the fix. Worse, the 30 vitest tests **pass** because `engine.test.ts` calls the engine directly with the `PRESETS` constants and never goes through the DOM, so the suite now certifies a behavior the page is structurally incapable of reaching, and the calibration comments in `data.ts` ("averages 26 of 32", "averages 16.3") describe runs no learner can trigger. One-line repair: raise the slider `max` (and rescale the label) so 50 and 120 are representable — or clamp the presets to what the control can express. | Everything the prior 7 named still stands: the two failure presets are unreachable, the distinguisher/classifier contradiction is unresolved (a run the panel calls "consistent with zero" still recovers everything), and e2e is axe-only so no preset outcome is asserted in the browser — which is exactly why the clamp went unnoticed. "Defense holds" does work correctly and is genuinely measured (11–19 of 32, "no better than chance"). |
| harvest-timeline | 6990470 | 7 | **7** | **Mostly — but it introduced a smaller version of the same defect.** The standing "Every year of delay increases the exposure window" caption is gone, a real "Window Past CRQC" column was added, and the headline is now derived from the rendered rows. I swept all 5 organizations × 4 scenarios: two of the three branches are exactly right, e.g. Mid-Size Bank / Aggressive prints "every at-risk asset is already exposed at zero delay, so those columns cannot climb any further — what grows is the window: waiting 10 years finishes 13 years past a CRQC instead of 3" over a table reading 100%, 100%, 100%, 100%, 100% and +3/+4/+5/+8/+13 yr. **But the third branch prints a claim the table contradicts on 3 of the 20 combinations.** Government Intelligence Agency / Ultra-pessimistic renders 620.0 TB and **100% exposed on every one of the five rows** under the headline "migration beats a CRQC at every delay shown, so **no row is exposed** and no window opens"; Small Medical Clinic / Ultra-pessimistic does the same at 2.0 TB / 11%, and Tech Startup / Pessimistic at 0.5 TB / 4%. The cause is that exposure is a per-asset Mosca test (per-asset shelf life) while `missesWindow` compares the org's single `typicalMigrationYears` against the CRQC year, so an asset can be exposed while the migration still "beats" the CRQC. The new `e2e/claims.spec.ts` cannot catch this: it recomputes `exposureGrows`/`windowGrows` from the table and then asserts the headline *contains the string that branch emits* — for branch 3 it asserts `toContain('no row is exposed')`, i.e. it checks the copy matches the logic, not that the copy matches reality. 90 vitest + 4 Playwright pass. | The branch-3 falsehood above (cheapest fix: derive that sentence from `dataRows.every(r => r.exposedDataTB === 0)`, not from the two "grows" flags, and give the tautological assertion a real predicate). Unchanged from the prior score: **no cryptographic mechanism is computed anywhere** — every parameter is a literature lookup table, so nothing on this page can fail — and the heavy overlap with `harvest-vault` is unresolved. |
| hqc-timing-break | 8b246db | 8 | **9** | **Yes.** The exact contradiction the prior score docked a point for is gone. Driven live over 8 rerolls of each of the four presets plus 45 more of the constant-time one, the verdict and the number always agree: "Noisy co-tenant" now prints "6/8 bits (75%), **no better than** the ~4 bits guessing alone would get" where it used to print "Defense held — the channel is silent" beside the same 75%; the constant-time preset prints "Defense held — recovery is 6/8 bits (75%), **consistent with** the ~4 bits guessing alone would get" — measured, honest, and stated as a comparison to chance rather than as silence. Its recovery over 45 constant-time rerolls was 2–6 of 8 (mean ≈ 4.2), i.e. genuinely chance-level. The optimized presets still show real reachable partial recovery (5/8, 6/8, 7/8, 8/8). 30 vitest tests pass, including the chance-level / full-recovery / empty-result pins on the new `beatsGuessing`. | e2e is **still axe-only** (`e2e/a11y.spec.ts` alone) — the four preset outcomes and the majority-vs-LLR disagreement, this demo's best teaching moment, are asserted nowhere in the browser; that is the single largest remaining item. The new "Defense FAILED" branch fires at 2σ, so on a truly constant-time run it is a ~3.5%-per-run false alarm that would assert "A working constant-time decoder cannot produce this" about pure chance — I did not observe it in 45 rerolls, so a learner will effectively never see it either way. Presets remain launcher-driven; the learner tunes and reads rather than parameterizing an attack. Toy k=8 recovery width means single-run statistics are inherently coarse. |
| nonce-guard | 239f855 | 8 | **8** | **Yes, and it is correct — but it is an accessibility-honesty fix, not a pedagogy change.** `integrityOutcome` is now derived from `atk.recovered && atk.forgeryAccepted` and from the solver's catch path, so the aria-live text and the visible badges are produced by the same flags. Driven across four input shapes: with reuse on (default, 1-byte, 300-byte and identical messages) the announcement says "the GHASH authentication key H was recovered exactly and a forged tag was accepted by real AES-GCM" and the badges beside it read H RECOVERED EXACTLY / FORGERY ACCEPTED / INTEGRITY BROKEN — agreeing; with unique nonces the announcement reads "Nonces are unique, so no attack is possible against either scheme" against a single NO ATTACK badge. The SIV clause also tracks the identical-plaintext branch correctly. 22 vitest + 6 Playwright pass, including a new regression that pins announcement to badges. | The corrected failure branches are, in practice, **unreachable from the UI**: Level 2 runs `runForbiddenAttack` on two fixed 16-byte probes that do not depend on the learner's messages, so `recovered`/`forgeryAccepted` were true on every run I could produce and the out-of-domain catch never fired. The fix is right, but nothing the learner can do exercises it. The prior score's substantive gap is unchanged: **Level 2 still does not act on the learner's own messages** — now well disclosed ("Not derived from your Message 1 or Message 2"), which is why it holds at 8 rather than rising. The break is also still one button rather than a learner-parameterized attack. |
| scloud-vault | b0298ea | 8 | **9** | **Yes.** Swept the noise slider across eleven values and every batch verdict now tracks its own printed rate: σ≤600 → 100/100 "All decoded correctly — noise is within the BW₃₂ correction radius"; σ=700 → 99/100 "Mostly decoded (99.0%) — noise is at the edge"; σ=800 → 89/100 same band; σ=900/1000/1100 → 68/50/30 "Near the boundary … close to a coin flip"; σ=1400 → 5/100 "**Mostly failed** (only 5.0% decoded) — noise is past the correction radius for all but the luckiest words." The case the prior score called simply false (7/100 printing "near the boundary") is gone, and the new `e2e/claims.spec.ts` sweeps the range and fails if a verdict disagrees with its numbers. 41 vitest + 6 Playwright pass. This was the one remaining asserted claim on the page; with it computed, the demo is claim-complete as far as I could drive it, which moves it to 9 (low end of the band). | The 0.2–0.8 "near the boundary … close to a coin flip" band is wide — 22/100 gets the coin-flip wording, which is a mild stretch though nothing like the old 7/100 case; splitting it would tighten the claim. Structurally: the FO transform's tamper path (`#encaps-tamper`) is still a single scripted button rather than a learner-chosen corruption, and outside Exhibit 3 the learner tunes presets rather than mounting an attack — there is no adversary they parameterize. Toy parameters throughout (disclosed accurately since `301a92a`). |
| isogeny-gate | 793b51d | 8 | **8** | **Yes — but it repaired the gate, not the page.** CI is green: 64/64 vitest and 10/10 Playwright, run twice. Both halves check out under independent scrutiny. The stale unit test now pins the *computed* verdict, and the browser renders exactly what it pins — Exhibit 1 prints "✓ ⟨K⟩ has 5 points — the 4 affine ones drawn here, plus O — and **all 5 evaluate to O under φ (checked)**" alongside "φ(P+Q) = (4, 0) = φ(P)+φ(Q) — compared just now, not assumed". For the axe shim I checked the diagnosis rather than trusting it: I ran a light-theme axe scan **without** the motion shim, waiting 2.5s for the 0.3s transition to finish, and got **0 violations** — so the failure really was a mid-blend read and the shim is not masking a palette problem. No rendered behavior changed, so the pedagogy score cannot move on this commit. | The two gaps `reverify-2` named are untouched. Toy GF(419) parameters throughout. Several panels are still **reveal/animate rather than learner-driven** — the control inventory is "Animate the map φ" / "Replay" / "Animate the key exchange" / "Brute-force Alice's secret" plus the walk's step-and-reset buttons; there is no input anywhere on the page, so the learner cannot choose a secret, an ℓ, or a prime, and cannot parameterize the attack. Exhibit 2's walk (step 5-isogeny / 7-isogeny / replay in both orders) is the one genuinely learner-driven exhibit. |
| lattice-gentle | fca3ad7 | 9 | **9** | **Yes — but note `fca3ad7` *is* the HEAD at which slice-3 already scored this a 9**, so this commit cannot move the score; it was scored in. The fix itself is real and verified live. Driving toy-Dilithium's "Verify against a tampered message" across seven pinned seeds: seed 32 reproduces the collision branch and now renders "⚠ **SIGNATURE ACCEPTED — a toy-scale forgery**: with n = τ = 4 the challenge is just 4 sign bits, so a tampered message re-derives the same challenge about 1 time in 16. ML-DSA's challenge space (τ = 39–60 of 256 coefficients) makes this chance negligible", with the aria-live region saying the same thing, where it used to print a plain "SIGNATURE ACCEPTED". Seeds 1–5 and 7 all give "✗ recomputed challenge differs — w₁′ ≠ w₁ / SIGNATURE REJECTED — the real verifier fails closed". The tamper caption now reads "**should** now disagree (though with only 16 toy challenges, it collides about 1 time in 16)" instead of "must now disagree". 58/58 vitest and 13/13 Playwright pass. | The three items slice-3 listed still stand, with one partly closed. Open: the **LWE/SIS panels are still pick-a-preset** ("Solution 1: s =", "wrong guess", "The cheat") rather than a real search or a small LLL/BKZ the learner runs; and there is still **no non-toy anchor** — no single ML-KEM-768 round trip via a library, so the jump from n=4 to the standard remains tabulated. Partly closed: the e2e drive now does assert the KEM implicit-rejection, the DECRYPTION FAILED state, and both Dilithium tamper verdicts — but it does so inside `a11y.spec.ts`'s scan prologue rather than in a dedicated functional spec, so those assertions read as scaffolding for the axe scan rather than as the behavioral gate. |
| dkg-gate | c3e845a | 9 | **9** | **Yes — but as with lattice-gentle, `c3e845a` *is* the HEAD slice-2 scored 9 at** (slice-2 says outright "the HEAD commit is that honesty fix"), so the score was already assigned with this landed. All three parts verified live. The "Secure against whom, for what?" panel renders and does exactly what it claims: it separates t (reconstruction threshold) from f (corruption bound) up front, then bounds each property individually — correctness "holds for any number of cheating dealers … but only under the synchronous rounds and reliable broadcast this tab simulates"; secrecy "f ≤ t−1 … and secrecy is computational (discrete log)"; uniformity "fails against a rushing adversary with even one corrupted dealer"; availability "f ≤ n−t"; and it concedes both that one tab playing all parties makes equivocation "impossible by construction here, not defended against" and that Exhibit 3 "models rather than runs" the GJKR fix. The bias batch banner reads "the adversary hit its target nibble 13/20 times (**independence heuristic** ≈ 64%)" — no longer "theory". 96/96 vitest, 5/5 Playwright including the new reflow gate at 320/360/400px. | Both items slice-2 listed remain. **e2e is still a11y + reflow only** — the ceremony abort (t = n with a doubling-down cheater) and the t−1 reconstruction mismatch exist in the UI and are covered by unit tests, but no browser test asserts either state. And **Exhibit 3 is still a disclosed model** of the commit-then-reveal fix rather than a second full ceremony the learner runs — now honestly labelled in the threat panel, which is why it reads as a bounded gap rather than a claim defect. |
| quantum-vault-kpqc | 4e1fe7b | 8 | **8** | **Yes, and the diagnosis is correct — but it is a test-harness fix; no rendered behavior changed.** I checked the claim rather than taking it: toggling to dark, waiting 4s for the 150ms `color` transition to finish, and running axe **without** the motion shim gives **0 violations**, with `#btn-export-vault` / `#btn-clear-vault` / `#btn-reset` all settling at `rgb(207,199,182)` — matching the commit's "about 11:1 on #15130e". So the palette really was never the problem, no rule was suppressed, and the endpoint colours are still scanned. 61/61 vitest, build clean. Full Playwright: 12/12 when `vault.spec.ts` runs serially — on my first parallel run one test (`seals a new secret into an empty box`) timed out at 30s waiting for `#retrieve-result`, which is PBKDF2-600k + WASM contention under two workers, not a defect, but the suite is **flaky under parallelism** on a loaded machine and that is worth pinning (raise the timeout or force `workers: 1` for that file). Verified the pipeline still really works: opening box 06 with `fortress` + `bastion` recovers "Launch code: ALPHA-7749-ZULU · 2 of 3 passwords correct — threshold met". | Everything slice-4 listed is untouched, because this commit touched only `e2e/a11y.spec.ts`. The panel that carries the demo's motivating claim — why a quantum computer cannot break layer 2 — is still a **static 2-D dot sketch** asserting intractability it never shows; "What if we'd used RSA here?" and "What SMAUG-T gives us" are still alternate prose rather than a runnable toy-RSA factorization; the tamper is still transient (a tampered container opens normally on the next attempt), which quietly softens "any tampering is detected before it opens"; and the key-comparison grid truncation flagged previously is unaddressed. |

## Summary

| result | demos |
|---|---|
| fix delivered **and** moved the score | `mpcith-sign` 7→8 · `pairing-gate` 7→8 · `hqc-timing-break` 8→9 · `scloud-vault` 8→9 |
| fix delivered, score correctly unchanged | `pq-tls-handshake` 7→7 · `nonce-guard` 8→8 · `isogeny-gate` 8→8 · `lattice-gentle` 9→9 · `dkg-gate` 9→9 · `quantum-vault-kpqc` 8→8 |
| fix delivered but re-introduced a defect | `harvest-timeline` 7→7 |
| **fix did not reach the browser** | `hqc-timing` 7→7 |

Three things worth the coordinator's attention:

1. **`hqc-timing` is the one outright failure.** The preset recalibration (noise 6→50, 12→120)
   is clamped away by `<input type="range" max="12">`, so both "failure" presets still run at
   noise 12 and still recover 32/32. Its 30 unit tests pass because they bypass the DOM, so the
   suite now certifies behavior the page cannot produce. One-line fix.

2. **Two of the twelve "fixes" were already at HEAD when the prior score was assigned.**
   `lattice-gentle` (`fca3ad7`) and `dkg-gate` (`c3e845a`) were scored 9 *at those commits* in
   slice-3 and slice-2 respectively. Both fixes verify out, but neither could ever have moved a
   score. If the fix ledger is being used to measure lift, these two rows should be dropped.

3. **Two regression tests are tautological or blind.** `harvest-timeline`'s new
   `claims.spec.ts` recomputes the branch condition and then asserts the headline *contains the
   string that branch emits*, so it cannot catch branch 3 printing "no row is exposed" over a
   100%-exposed table. `hqc-timing`'s `engine.test.ts` asserts against `PRESETS` constants the
   UI never applies. A claims test has to assert against reality, not against the code path that
   produced the copy.

Three of the twelve fixes were **honesty or harness fixes that changed nothing the learner sees**
(`isogeny-gate`, `quantum-vault-kpqc`, and the aria-live half of `nonce-guard`). All three are
correct and two of them I re-derived independently rather than trusting the commit message — in
both `isogeny-gate` and `quantum-vault-kpqc` the "axe read colours mid-transition" diagnosis
holds up: scanning at rest without the motion shim gives zero violations in both repos, so no
palette problem is being papered over.

## Addendum — `harvest-timeline` moved again during this audit

While I was scoring, a second commit landed on `crypto-lab-harvest-timeline`: **`829b04c`
"Add Exhibit 6: run the migration instead of projecting it"** (18:02, ~8 minutes after I drove
`6990470`). The row above is scored at the assigned fix commit `6990470`; this addendum records
where the demo actually stands at `829b04c`, because the new commit closes the larger of the two
caps I named.

| demo | HEAD | prior | current | did the fix deliver? | what still caps it |
|---|---|--:|--:|---|---|
| harvest-timeline | 829b04c | 7 | **8** | **Yes — `829b04c` closes the "nothing here is cryptographic" cap.** Exhibit 6 is real and I drove both branches. Migrate first, then trigger the CRQC: "3 archived record(s) re-keyed to AES-256-GCM under a key that never touched RSA. The 2 already-captured session(s) were not reachable" → "**CRQC complete: 2 of 5 record(s) read**", with the three archive rows reading NOT READ and — critically — explaining *why* as a measured outcome: "No RSA wrapper left to break. Tried a key derived from the recovered private exponent; **AES-GCM rejected it**." Skip the migration and the same button gives "**CRQC complete: 5 of 5**", every row "Factored the modulus, recovered d, unwrapped the RSA-KEM secret, decrypted." The modulus, the stored ciphertext previews and the read counts all change per run and are labelled "every byte below was produced in this tab". That is a real mechanism, a real learner-caused divergence, and a failure branch that is a rejection rather than an assertion — exactly what the prior score said the demo could not do. 104 vitest (up from 90) and 8 Playwright including three new `rekey.spec.ts` behavioral tests. | The **Exhibit 4 branch-3 falsehood is unchanged at this HEAD** — I re-swept all 20 combinations and Government Intelligence Agency / Ultra-pessimistic still renders 620.0 TB and 100% exposed on all five rows under "no row is exposed and no window opens", as do Small Medical Clinic / Ultra-pessimistic and Tech Startup / Pessimistic; `claims.spec.ts` is still tautological. Exhibits 1–5 remain actuarial lookups. The 64-bit modulus is toy (disclosed in-panel). The overlap with `harvest-vault` is now *worse*, not better, since only this demo has a mechanism. Fixing the Exhibit 4 sentence is the cheap remaining step toward 9. |
