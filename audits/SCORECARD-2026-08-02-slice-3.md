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

## What would raise it

### hybrid-guide
- Use real X25519 (WebCrypto) and a real ML-KEM (as sibling demos do) so the component secrets the combiner binds are actual KEM outputs rather than `randomBytes(32)`.
- Make the break-a-half exhibit compute a consequence: e.g. after "quantum breaks X25519," actually hand the attacker the classical secret and show a brute-force over the remaining space succeed/fail at toy sizes, instead of a checkbox-driven headline.
- Add behavioral Playwright assertions (attack collision, combiner-switch key change) — currently only the a11y scan drives the page.
