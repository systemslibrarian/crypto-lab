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

## Per-demo notes

### ablation-wire (9)
- What would raise it: mount A3/A5 as real recorded-then-attacked runs instead of a flag-assessed matrix (A2/MITM already is real); derive at least the matrix's confidentiality column from the actual transmit result rather than `Layers` flags.
