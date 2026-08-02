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

