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

## Scores

| demo | HEAD | score | justification |
|---|---|--:|---|
| `dead-sea-cipher` | 72d8bea | **8** | All four headline attacks are genuinely computed: the Caesar Break It ran real chi-squared over all 26 shifts and recovered the live shift I set (7), the Kasiski panel factors real repeated-trigram gaps, the OTP key-reuse grid shows a real byte-for-byte C1⊕C2 = P1⊕P2 equality over live random keys, and the GCM tamper verdict comes from an actual WebCrypto decrypt failure, not a flag. Docked because the "Peek Inside GCM" exhibit is a static schematic (role="img") whose tamper "propagation" is a choreographed setTimeout animation — GHASH is never computed anywhere in the page — and the e2e suite asserts only axe a11y, so no attack state is browser-tested (34 vitest unit tests do assert the cipher/attack math). |
| `diffie-hellman-mitm` | 34dc9a4 | **9** | Close to the claim-complete pattern: the BSGS break recovered the exact secret exponent I typed (a=9) and the page states it re-computed g^x mod p and compared it against A before printing that line — the claim self-verifies in-page. The MITM runs real BigInt math with learner-set m1/m2, the interception exhibit encrypts under the two real derived session keys (live AES-GCM iv/ct shown), the toy-modulus key-collision edge case is honestly caught and explained (ui.ts:568), and the signed-exchange verdicts read res.verified/res.accepted from a real WebCrypto P-256 ECDSA verify over a domain-separated transcript that binds both shares. 21 engine tests pass. Held off 10 because e2e is axe-only (no attack state browser-asserted) and the BSGS cost table/bars are static prose rather than measured. |
| `dkg-gate` | c3e845a | **9** | Real ristretto255 Pedersen DKG with computed verdicts throughout: the threshold exhibit prints reconstructed·G and ceremony PK as two live byte-identical hex strings (and a genuinely different pair at t−1, which I drove), the bias exhibit enumerates real 2^k subset sums and steered the key to my chosen nibble under naive commitments while the GJKR mode honestly missed, and the ×20 batch counts wins from 20 fresh ceremonies against an expectation the page correctly labels "independence heuristic", not theory (the HEAD commit is that honesty fix). 96 vitest tests cover field/poly/VSS/DKG/bias. Held off 10: e2e is a11y+reflow only, and Exhibit 3 is a disclosed model of the attack rather than a second full commit-then-reveal ceremony. |
| `downgrade-wire` | 7017e9d | **9** | The strongest test discipline in the slice: strip.spec.ts e2e-asserts the important states (COMPLETED-yet-ALARM, Finished-MAC-mismatch abort, DEFENSE HELD, both compare cards, deep-link autoplay) — exactly the "tested not visited" bar. The DEFENSE_HELD verdict is a real byte-compare of two independently derived Finished MACs over the two transcript views (RFC 8446 schedule, KAT-pinned to the RFC 8448 trace), real X25519+ML-KEM-768 shares actually travel the modelled wire, and the fail-open exhibit teaches the subtle truth that attempt 2 is validly bound because the client really did offer less. Held off 10: the unbound-mode ALARM is an omniscient-narrator judgment from listsEqual rather than anything an endpoint computed (deliberate and disclosed), and the sentinel/history panels are partly checkbox-driven prose. |
| `e91` | cbc5c1b | **8** | The statistical honesty is the best part: the secure/compromised/inconclusive verdict is computed from a 95% CI on the sampled |S| (not a threshold on the point estimate), CI widths genuinely widen when I cut rounds to 1000, Eve's run landed at S≈1.43 — the intercept-resend theoretical √2 — and the correlation table shows real per-cell n/SE from the run. It also teaches the right ambiguity: misalignment/noise reduce S for benign reasons and the page says \|S\| alone cannot name the culprit. Docked to 8 because it is a disclosed classical simulation of textbook QM (calibration: quantum-entropy = 8), the learner's only verb is choosing a scenario chip and Run — nothing is mounted or forged by hand — and e2e is axe-only (28 node engine tests cover the math). |

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
