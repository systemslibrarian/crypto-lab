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
| lattice-gentle | f3ef9d9 |
| lwe-hints | 1429cef |
| matsui-line | 4ea59a6 |
| merkle-proofs | b67c381 |
| merkle-vault | 9c3ea37 |

## Scores

| demo | HEAD | score | justification |
|---|---|:--:|---|
| hybrid-guide | 004680f | 8 | The headline re-encapsulation attack is genuinely computed and was verified live: under the naive combiner two transcripts derive byte-identical keys, under the bound combiner they differ, both from fresh randomness per click; the performance tab measures real timings and the KAT suite pins the construction. Docked because the demo's namesake "break a half" playground is toggle arithmetic — the verdict text and the 512/256/0-bit entropy bar are selected by checkbox state, not computed from any crypto — and the component "X25519/ML-KEM-768" secrets are random bytes (candidly disclosed, but the learner never touches a real KEM). E2E is a11y-only; behavioral states live solely in unit tests. |

| hybrid-pqc | fa9319a | 8 | Real X25519/ML-KEM-768/Ed25519/ML-DSA-65 via noble; verified live that when both threat switches fall, each column's "Attacker reconstructed the session key" hex is byte-identical to the real session key — the attacker model grants genuine component secrets and reruns the real combiner, so the hedge (single break yields null) is real code, not a caption. Timings are measured (median of 5), and the honest scope line ("only the *event* of a break is simulated") is prominent. Docked because the signature half asserts its headline — "a forged signature passes" is printed from the threat flags without ever producing a forged signature for the real verifier to accept — and the compromise statuses themselves are flag lookups. E2E is a11y-only. |

| hybrid-sign | e2f7cb2 | 8 | Real draft-16 LAMPS composite (Ed25519 + ML-DSA-65 via noble) with the M-prime construction pinned by unit KATs; every scenario verdict is the literal output of `compositeVerify` on a genuinely constructed forged signature — verified live: single-break scenarios show the intact component rejecting (REJECT with the correct catcher named from computed `caughtBy`), double break shows the composite honestly accepting the forgery as residual risk, and tamper buttons flip real signature bytes and re-verify. No falsifiable claim found. Held at 8 because every attack is a canned scenario button over a fixed forged message — the learner watches rather than mounts — and the page is a single narrow exhibit with a11y-only e2e. |

| hybrid-wire | a2482aa | 8 | Real end-to-end pipeline verified live: X25519 (WebCrypto) + ML-KEM-768 handshake completes with byte-compared matching session keys, AES-256-GCM chat round-trips, and "Tamper with session" flips a real ML-KEM ciphertext byte, re-runs real decapsulation (implicit rejection diverges Bob's key), and subsequent decryptions genuinely fail authentication. Benchmark runs 50 live iterations. The threat tab's verdict ("Session still safe/compromised") is a flag-driven pure function, but it honestly defines "broken" and reveals the broken wire's real secret bytes while masking the survivor — showing rather than asserting the half-unknown HKDF input. Docked for the flag-selected resilience verdict, no attacker-side key reconstruction to byte-compare (as hybrid-pqc does), and a11y-only e2e over 18 unit tests. |

| ibe-gate | ba74aca | 9 | Real Boneh-Franklin BasicIdent over BLS12-381 with every exhibit verdict computed and verified live: the bilinearity test derives both sides from fresh random scalars and byte-compares all 576 GT bytes; a learner-typed message encrypts to a learner-typed unenrolled identity and round-trips; the wrong-key path decrypts to genuine garbage; and the escrow exhibit derives d_ID from s and prints what the derived key actually returned "not an echo of what you typed" — even flagging the honest 32-byte message-space truncation. The Type-3 asymmetric-pairing deviation from the paper is documented in-page down to which assumption changes. Off 10 because the attacks remain guided buttons (issue/refuse/collude picks a narrative frame around the computed decryptions), and browser states are covered by unit tests but the e2e layer is a11y-only. |

## What would raise it

### hybrid-guide
- Use real X25519 (WebCrypto) and a real ML-KEM (as sibling demos do) so the component secrets the combiner binds are actual KEM outputs rather than `randomBytes(32)`.
- Make the break-a-half exhibit compute a consequence: e.g. after "quantum breaks X25519," actually hand the attacker the classical secret and show a brute-force over the remaining space succeed/fail at toy sizes, instead of a checkbox-driven headline.
- Add behavioral Playwright assertions (attack collision, combiner-switch key change) — currently only the a11y scan drives the page.
