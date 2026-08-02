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

## Scores

| demo | HEAD | score | justification |
|---|---|--:|---|
| `dead-sea-cipher` | 72d8bea | **8** | All four headline attacks are genuinely computed: the Caesar Break It ran real chi-squared over all 26 shifts and recovered the live shift I set (7), the Kasiski panel factors real repeated-trigram gaps, the OTP key-reuse grid shows a real byte-for-byte C1⊕C2 = P1⊕P2 equality over live random keys, and the GCM tamper verdict comes from an actual WebCrypto decrypt failure, not a flag. Docked because the "Peek Inside GCM" exhibit is a static schematic (role="img") whose tamper "propagation" is a choreographed setTimeout animation — GHASH is never computed anywhere in the page — and the e2e suite asserts only axe a11y, so no attack state is browser-tested (34 vitest unit tests do assert the cipher/attack math). |

| `diffie-hellman-mitm` | 34dc9a4 | **9** | Close to the claim-complete pattern: the BSGS break recovered the exact secret exponent I typed (a=9) and the page states it re-computed g^x mod p and compared it against A before printing that line — the claim self-verifies in-page. The MITM runs real BigInt math with learner-set m1/m2, the interception exhibit encrypts under the two real derived session keys (live AES-GCM iv/ct shown), the toy-modulus key-collision edge case is honestly caught and explained (ui.ts:568), and the signed-exchange verdicts read res.verified/res.accepted from a real WebCrypto P-256 ECDSA verify over a domain-separated transcript that binds both shares. 21 engine tests pass. Held off 10 because e2e is axe-only (no attack state browser-asserted) and the BSGS cost table/bars are static prose rather than measured. |

- Compute a real (even toy-parameter) GHASH over the displayed ciphertext bytes so the "one flipped byte changes the entire GHASH output" claim is shown, not narrated by a timed animation.
- Add e2e assertions for the attack verdict states (Caesar winner shift, OTP equality row, tampered-verify failure) instead of a11y-only Playwright.
- Let the learner pick the tamper position/bit rather than always flipping bit 0 of byte 0.

### diffie-hellman-mitm — what would raise it

- E2e-assert the four verdict states (exchange agree, break recovery, MITM key split, signed-tamper abort) — currently only axe runs in Playwright.
- Measure the BSGS step counts live per preset instead of the static ~sqrt(p) table (the break already reports its own op count, so the table could be fed from runs).

