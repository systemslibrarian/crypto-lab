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
