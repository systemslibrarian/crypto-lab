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
