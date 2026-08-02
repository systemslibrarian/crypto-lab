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
