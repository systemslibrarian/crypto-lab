# Re-verification pass — 2026-08-02 — slice: reverify-1

Re-verifying recovered scores from `SCORECARD-2026-08-01.md` against fetched current source.
Assigned demos (15): aegis-gate, babel-hash, bike-vault, bulletproofs, card-trick,
chain-of-trust, collision-vault, corrupted-oracle, dilithium-reject, dilithium-seal,
drbg-arena, entropy-collapse, envelope-kms, falcon-seal, frozen-heart.

| demo | HEAD | prior | current | what changed |
|---|---|--:|--:|---|
| aegis-gate | 793d614 | 9 | 9 | Prior 9 stands. Post-scoring commit 793d614 additionally fixed the one asserted claim left (benchmark verdict now computed from the run's measured throughputs, with an honest interpreted-vs-native caveat). Verified live: encrypt/decrypt round-trip, tamper rejection with recomputed-tag display, 4-stage state-machine stepper, AES round opened stage-by-stage, 87/87 unit tests incl. draft vectors; zero console errors. |

- aegis-gate remaining gaps: nonce-reuse recovery exhibit still requires the learner to run it to see where recovery stops being real (fine); 10 would require the family-comparison tables (static prose tables) to be tied to computation, which is arguably out of scope.

