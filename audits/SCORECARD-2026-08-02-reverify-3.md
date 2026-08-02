# Re-verify pass 3 — 2026-08-02

Re-verification of recovered 2026-08-01 scores against fetched current source.
Assigned demos (15): noise-pipe, nonce-guard, oblivious-shelf, oram-vault, ot-gate,
otp-vault, patron-shield, phantom-vault, pki-chain, poly1305-mac, psi-gate,
quantum-entropy, ratchet-wire, ring-sign, scloud-vault.

Method per demo: `git fetch origin`, read commits since the scoring session, `npm ci`,
check whether the prior justification's named defect still exists in current source,
`npm run build`, serve `dist/`, drive with Playwright chromium.

| demo | HEAD | prior | current | what changed |
|---|---|--:|--:|---|
| noise-pipe | b696d6e | 7 | 8 | 175f67b fixed the named defect: Break-it badges now distinguish held / succeeded / not-applicable / could-not-run instead of rendering every `ok:false` as "Attack succeeded". |
| nonce-guard | 2db23b3 | 8 | 8 | 4ac4e9c converted the Level 2 misattribution from an implied claim into an explicit disclosure; structure unchanged. |
| oram-vault | 2dbff17 | 7 | 8 | e16f2e2 closed the named defect: the chi-square verdict is now computed by `analyzePathUniformity()` with three reachable branches, and two other asserted claims (a fabricated stash bound, "three unrelated paths") were replaced with observed counts. |
| ot-gate | 35c2688 | 8 | 8 | Prior score stands. 3fcceb4 corrected a teaching error the prior score did not catch (choice-hiding was attributed to DDH; it is unconditional) and disclosed the omitted transcript salt. Both HIGH fixes verified still live. |
| otp-vault | fdc3282 | 9 | 9 | Prior score stands. 6cec71f fixed a usability defect in the centerpiece exhibit (crib pins were destroyed on every keystroke); verified live that a pinned crib now survives editing. No falsifiable claims found. |
| patron-shield | db2037f | 8 | 9 | 4973da9 closed the named defect: the correctness badge now reads `result.isCorrect` and names the wrong string on failure, and the cancellation grid derives survival from set membership rather than from `idx === targetIndex`. |
| phantom-vault | 9672507 | 8 | 8 | 61a4752 closed the named sample-size defect — the bias charts now enumerate all 256 byte values exactly instead of binning one run's small sample. The prior's other complaint (nothing to break) still stands, so the 8 holds. |
| pki-chain | 948a95d | 7 | 8 | 635cb58 closed the named defect: the hero no longer claims the X.509 wire format, an encoding note sits under the inspector, and a new in-app Scope section names what the JSON model cannot teach (parsing-differential bugs, absent extensions, non-canonical fingerprints). |
| poly1305-mac | 6d24d15 | 9 | 9 | Score stands, but only because 6d24d15 fixed a severe defect that was live when the 9 was assigned: the two-pair recovery returned a wrong `r` for close message pairs up to 99% of the time, then printed "Forgery did not verify". Recovery now enumerates candidates and reports ambiguity instead of guessing. |
| psi-gate | 98b3c5e | 7 | 9 | 2dc378a fixed five falsifiable claims, including both the prior named ones: `assertValidPoints` now actually runs on every point received (the certificate was for validation nothing called), and the flatness exhibit no longer bins two RFC 9496-constrained bytes that made it routinely print its own failure branch. |
| quantum-entropy | b4028ad | 8 | 9 | 5f776d7 made the panel headline track the live measurement instead of a hardcoded 99.7%, and b4028ad stopped the README calling the modeled source real quantum. Re-audit found the demo well past its thin prior justification: learner-driven sliders collapse attacker work from 2^234.5 to 2^11.7, and over-extraction produces a computed REJECT. |
| ratchet-wire | 90367a8 | 8 | 8 | Prior score stands. 90367a8 closed an unnamed defect (the break-in recovery verdict now reads whether the root key actually rotated, and the aria announcement is gated on the same flag) and corrected four wrong Signal-spec section refs. The prior's named gap — the compromise story stops short of a decrypt — is unchanged. |
| ring-sign | cf0ff1b | 7 | 9 | 7f719ce + 53ed872 fixed six asserted claims including the prior's named one: spend B now has its own signer selector so the "Reuse detected: no" branch is reachable, the chain-closed badge is derived from the recomputed chain AND-ed with verifyLsag(), and the timing exhibit reports a measured OLS fit instead of asserting linearity. |
| scloud-vault | ff21806 | 8 | 8 | Prior score stands. 301a92a removed three invented percentage meters from the review-scrutiny cards (100/45/18% presented as measurements) and corrected the demo's description of its own KEM — it implements full n×32 matrix LWE, not the "single-vector simplification" the README, params.ts and the keygen callout all claimed. |
| oblivious-shelf | 47b43a0 | 7 | 8 | All three named defects fixed by c9b9fe7 + 47b43a0: the anonymity set is now computed candidate-by-candidate, the target highlight is gone from both server-view panels, the hero says "one bit ... its checked-out flag", and Section A's diagrams track the learner's selection. |

## Per-demo notes

### noise-pipe — 7 -> 8 (HEAD b696d6e)

Prior justification: "Broadest and most KAT-anchored implementation in the cluster; the
walkthrough is a scrubbable replay and one attack card teaches the inverse of what its code
does."

The inverted attack card is fixed. `175f67b` added an explicit `AttackOutcome`
(`held` | `succeeded` | `n/a` | `error`) to `FailureResult` and set it at every return site in
the six simulators, with four distinct badges and neutral (non-verdict) styling for the
non-security outcomes. Confirmed live against the built page:

- rs-swap on XX -> "— Not applicable to this pattern" (previously rendered as "Attack succeeded")
- rs-swap on IKpsk2 -> "Attack failed — defense held", with real `realResponderRS` bytes
- bit-flip on XX -> "defense held", with real ciphertext/tampered-ciphertext hex
- nonce reuse -> "Attack succeeded", with two real ciphertexts
- replay on NN -> "Attack succeeded"
- PSK mismatch on a pattern without a PSK -> "Not applicable"

`7b6635b` additionally rewrote 159 lines of `src/patterns.ts` teaching content.

Remaining gaps (what would raise it):
- The walkthrough is still a step-through of a handshake computed once at pattern selection —
  real crypto, but a replay rather than a per-step computation. The new predict-before-step
  prompts partly compensate.
- Break-it attacks are one-click buttons; the learner cannot parameterize an attack.
- `#predict-box` renders only its heading at some steps (no prompt text), so the active-retrieval
  scaffold silently drops out.

### nonce-guard — 8 -> 8 (HEAD 2db23b3)

Prior justification: "Break-before-theory reordering fixed the on-ramp; H recovery plus a
forgery real AES-GCM accepts. Level 2 runs on internal probes, not the learner's messages."

The named defect is unchanged structurally — `runForbiddenAttack()` still runs on two fixed
16-byte probes rather than the learner's messages — but `4ac4e9c` stopped it from reading as a
claim about the learner's own traffic. The heading is now "Level 2 — Separate chosen-probe
demonstration" and the panel leads with "**Not derived from your Message 1 or Message 2.**"
The same commit relabelled the Level 1 readout from "DECODED (PRINTABLE)" to "ASCII PREVIEW OF
XOR BYTES (NOT DECODED PLAINTEXT)" with a paragraph explaining that recovering a plaintext needs
extra information. Verified live: with reuse on, H is recovered exactly and a forged tag is
accepted by real AES-GCM; with reuse off, both columns report "NO ATTACK — nonces are unique".
Honesty improved without the pedagogy changing, so the 8 holds.

Remaining gaps (what would raise it):
- `src/main.ts:287` — the aria-live `announce()` asserts "the GHASH authentication key H was
  recovered exactly, and a forged tag was accepted by real AES-GCM" as a fixed string, while the
  visible badges next to it are correctly gated on `atk.recovered` / `atk.forgeryAccepted`. A
  screen-reader user receives a verdict that never reads the flag the code computes.
- Level 2 still does not act on the learner's own messages.
- The default Message 1 / Message 2 share a long prefix, so the headline `P₁ ⊕ P₂` renders as
  nearly all `·` — the strongest exhibit on the page opens looking empty.

### oblivious-shelf — 7 -> 8 (HEAD 47b43a0)

Prior justification: "Half the page is static prose; the 'record' it retrieves is one bit already
on screen; panels labelled 'Server A's view' highlight the exact index the text says a server
cannot see."

Two commits closed all three. `47b43a0` made `renderXorChain`'s target argument optional and
omits it for anything drawn as a server's view, and added `consistentTargets()` in `pir.ts`,
which for each candidate index reconstructs the subset the patron must have drawn, re-runs that
server's side, and requires the observed view back. `c9b9fe7` made the Step 7 recovery verdict a
real comparison against `db[i]` (`pirQuery` now returns `directBit` and `correct`), and corrected
the false PIR-complexity and PATRIOT Act claims in Sections C and D1. Driven live on book #3:

- Step 8 prints "Candidate targets consistent with that view, checked one by one: 16 of 16" for
  both servers — a computed count, and the tests pin it as falsifiable (an impossible view drops
  every candidate).
- Zero `.xor-term--target` / `.set-el--target` highlights in any of the eight walkthrough steps.
- Step 7 reads "Checked: matches db[3] = 1 read directly from the database", then states that the
  title, author and call number come from `catalog.ts` in the browser and were never requested.
- Hero now reads "Fetch one bit of a library catalog record — its checked-out flag".
- Section A diagrams read "wants book #3" / "Query S△{3}" after selecting #3 (was a hardcoded 9).

24/24 vitest pass, build clean, no page errors.

Remaining gaps (what would raise it):
- The "half the page is static prose" half of the prior verdict is untouched: 4 interactive
  controls on the whole page, and the catalog cards plus one Run button are the entire input
  surface.
- No failure or adversary path. The learner never makes the protocol break, and cannot collude
  the two servers to watch the anonymity set collapse to 1 — which is the natural counterpart to
  the 16-of-16 exhibit the page now computes, and what `patron-shield` has and this does not.

### oram-vault — 7 -> 8 (HEAD 2dbff17)

Prior justification: "A genuine Path ORAM computing a real chi-square from real access traces —
then printing 'Distribution looks uniform' unconditionally next to it."

`e16f2e2` extracted the verdict into `src/analysis.ts:analyzePathUniformity()`, which returns
`consistent: boolean | null` and a verdict that names its own limits. Driven live on Exhibit 4:

- After 20 accesses (expected 1.3/leaf): "Verdict: Inconclusive: need ≥5 expected/leaf — run 80+
  accesses total." χ² = 13.60 was well under the critical value, so the old code would have
  printed a pass here off an invalid test.
- After 100 accesses (expected 6.3/leaf): χ² = 22.56, "This run is consistent with uniform paths
  (fail to reject H₀ at α=0.05)" — a claim scoped to the run, not to Path ORAM.
- All three branches (null / true / false) are pinned in `tests/analysis.test.ts`; 31/31 pass.

The same commit removed two further asserted claims the prior audit did not name: the Stash Peak
stat printed `peak / Z*(L+1) ✓` against a bound that is not the O(log N) guarantee (now just
"Observed Stash Peak"), and the medical-scenario replay hardcoded "three unrelated paths" where
it now reports the distinct-path count actually observed ("3 distinct this run. Collisions are
possible").

Remaining gaps (what would raise it):
- The "deviates from uniform" branch is only reachable by chance (~5% of runs), so most learners
  never see the test fail. A deliberately-broken-ORAM toggle (fixed leaf, or remap disabled) that
  drives χ² through the critical value on demand would make the statistic falsifiable in the UI
  rather than only in the test file.
- Nothing on the page lets the learner break the hiding property; the leakage the caveats list
  (access count, timing, stash overflow) is described in prose but never exhibited.

### ot-gate — 8 -> 8 (HEAD 35c2688)

Prior justification: "Both HIGH fixes from the prior review landed: two independent routes to the
shared point are computed and byte-compared, and the DDH game has a real 1000-round tally."

Both named strengths verified still live. Driving the page with b=1: the "Why the two keys line
up" panel prints the receiver's `r·A` and the sender's `a·(B−A)` as the same truncated point
`598ffad5dc…` with a computed "✓ same point" and shows k0 landing elsewhere
(`6353017000…`); "Verify Correctness" runs both b=0 and b=1 and reports that each chosen message
decrypted and the unchosen one did not; the auto-play tally reported "Computer guessed 331 of
1000 correctly, about 33.1 percent" — measured, not asserted. 14/14 vitest pass.

More important is a defect the prior score missed and `3fcceb4` fixed after it: the page taught
that B = rG vs B = A+rG are "computationally indistinguishable under DDH" and that C3's
"what breaks if DDH is broken" would expose the receiver's choice. Both are wrong — r is a fresh
uniform scalar, so the two distributions are identical (Chou-Orlandi Lemma 1, unbounded sender
still at 1/n), and it is CDH protecting the *sender* whose failure lets a receiver derive both
keys. C2 is now "Choice-Hiding Visualizer", C3 is rewritten in the correct direction, and a new
note discloses that the demo drops Chou-Orlandi's transcript-salted hash and names the MITM
(pass A through, hand the sender B′ = A+B, rotate the ciphertexts) that omission enables.

Remaining gaps (what would raise it):
- Nothing on the page lets the learner succeed at an attack. The one adversarial exhibit is a
  game the learner is supposed to lose, and correctly does.
- The B′ = A+B man-in-the-middle is now honestly described in prose but is not runnable; making
  it a toggle that unlocks the wrong message would be the missing break-it exhibit and the
  strongest argument for a 9.

### otp-vault — 9 -> 9 (HEAD fdc3282)

Prior justification: "Prior score holds. The perfect-secrecy panel is the copyable pattern for
the whole fleet."

Still true, and confirmed from source and live. `perfectSecrecyPanel.ts` fixes one real ciphertext
under a real random key, discards the key, then for any learner-typed target derives
k = c ⊕ p and re-decrypts to check `c ⊕ k === p` — the claim is recomputed per keystroke, and the
wrong-length branch prints "Your target is 5 bytes; it must be exactly 14 bytes to be a
candidate" rather than a silent failure. Every crib-drag readout is likewise computed: the
"✓ All 4 revealed bytes are printable" line reads `hit.allPrintable`, and the candidate ranking
buttons print `Math.round(h.printableRatio * 100)` from `rankByPrintability(dragCrib(...))`, with
a genuine "No offset reveals mostly-printable text for this crib" empty branch.

`6cec71f` (landed after the score) fixed a defect in the demo's centerpiece: `refresh()` cleared
all pins and was called from `update()` on every keystroke into the P1/P2 textareas, so a learner
who pinned "the " and then edited a message silently lost their entire reconstruction. `refresh()`
now takes `{ keepPins }` and replays surviving pins. Verified live: pinned `"the " → P1 @ 0`
persists across a subsequent edit. 46/46 vitest pass.

Remaining gaps (what would raise it):
- Three separate crib workbenches (two-time-pad, keystream-reuse, import) repeat the same
  interaction; the third adds little beyond bring-your-own-ciphertext.
- The perfect-secrecy ciphertext is fixed at panel construction, so the learner cannot re-roll it
  and see the argument hold for a different C without a page reload.

### patron-shield — 8 -> 9 (HEAD db2037f)

Prior justification: "Still the best-structured PIR teaching sequence with a genuinely computed
collusion break — docked one point for a 'Correct' badge that never reads the correctness flag it
computes."

That is exactly the one point, and `4973da9` closed it. `src/main.ts:311-325` now branches on
`result.isCorrect` and, on failure, prints `⚠ Reconstruction FAILED — r₁ ⊕ r₂ gave "<actual>",
expected "<title>"` in the danger colour instead of unhiding a success badge. The same commit
fixed a second, unnamed instance of the same fault: `renderCancellation` decided which record
survives with `idx === targetIndex` — from the answer, not from the masks — so a malformed query
pair would still have drawn a clean survivor sitting on the requested record. `visualizer.ts:179`
now computes `survives = in1 !== in2` off set membership, with a comment recording why.

`db2037f` additionally fixed a 32-bit packing boundary (`lowBitsMask`, now tested at 0/8/31/32
and throwing above 32) and corrected two display claims that did not match the live protocol
(the catalog toggle read "Showing 8 of 8" while showing 4; the PIR mask placeholder showed 8 hex
digits for a 2-digit mask). Verified live end-to-end on book #5: mask/response animation, computed
cancellation grid (`db[5] · ● ✓ keeps` / `db[7] ● ● ✕ cancels`), correct title reconstructed, and
the collusion button producing the real break. 24/24 vitest pass.

Remaining gaps (what would raise it):
- The failure branch of the correctness badge is unreachable through the UI — the protocol always
  succeeds. A "corrupt one server's response" toggle would make the newly-honest badge
  demonstrably falsifiable rather than only correct in principle.
- The naive-vs-PIR comparison panel is a static side-by-side; the naive query string is rendered,
  not sent through anything.

### phantom-vault — 8 -> 8 (HEAD 9672507)

Prior justification: "Entropy cap and modulo-bias panels now live and computed; nothing to break,
and the bias exhibit's sample is too small for the contrast it promises."

The sample-size half is fixed. `61a4752` changed `tallies()` in `src/ui/distribution.ts` from
iterating the run's sampled bytes to iterating `value = 0..255`, so both histograms are now the
exact mapping over the complete input domain rather than an inference from a noisy sample. The
copy was rewritten to match ("Both charts enumerate all 256 possible byte values ... Their shape
is exact rather than an inference from this run's small random sample"), and the live readout is
now a precise statement: "Each highlighted low position receives 3 of 256 possible byte values;
every other position receives 2." The run's actual sample is retained only as an explicitly
labelled run note.

Everything else checks out as computed. Driven live (note the app deliberately clears the
passphrase after each derive, so each run must retype it):

- same inputs twice -> identical password (`MMs#>?3T,gnPq*5oZps$`)
- version 1 -> 2 -> different password (`N>mvnq7GpX^K=g$)$[jE`)
- service change -> different password (`o;EoM+F>o)6Iq:pxb<en`)
- entropy cap genuinely switches which side binds: strong passphrase gives "Effective entropy
  129.5 bits / Format ceiling 129.5 / Master passphrase 164.7 — the output format is the limiting
  factor"; the `password123` preset gives "Effective 56.9 / ceiling 414.4 / passphrase 56.9 —
  your master passphrase, not the charset, is the limit here". Both branches reachable by typing.

Node test suite passes (0 fail).

Remaining gaps (what would raise it):
- The prior's other complaint is untouched: there is no adversary anywhere. Nothing recovers a
  password, and the modulo-bias panel shows the biased map without ever letting a learner exploit
  the bias to narrow a search.
- The "Prove It" panel's four-row table did not populate within 12s of clicking Run Proof in my
  run (all four Password cells stayed em-dashes); worth a look, though the same three claims are
  independently verifiable by hand as above.

### pki-chain — 7 -> 8 (HEAD 948a95d)

Prior justification: "An excellent RFC 6962 CT exhibit bolted onto 'certificates' that are JSON
objects, under a hero bar reading X.509 / RFC 5280."

`635cb58` addressed exactly that mismatch, and did it by dropping the claim rather than by
hand-waving. Confirmed live:

- Hero now reads "X.509 / RFC 5280 *semantics*, JSON standing in for DER · CT (RFC 6962)" and
  links to a new `#scope` section.
- Directly under the certificate inspector: "**Encoding note:** these are not real X.509
  certificates. A certificate here is a JavaScript object, and the bytes that get signed are its
  `JSON.stringify` serialization — there is no ASN.1 or DER anywhere in this lab."
- The new Scope section's "what the JSON encoding leaves out" card names the pedagogical cost
  precisely: no parsing-differential bugs (null-byte-in-CN, BER/DER length ambiguity, length-field
  overflow, the OpenSSL name-constraints/punycode overflows), no DER-canonical fingerprints, and
  no `basicConstraints`/`keyUsage`/`SAN`/name constraints — so the CA/leaf distinction here is
  merely positional.

The underlying lab holds up. Every validation line is computed and every failure path is real:
clean -> `Overall: PASS`; CRL toggle -> `Overall: FAIL` with "A certificate serial appears in a
CRL"; Tamper Leaf -> `Overall: FAIL` with "Leaf signature is invalid". The CT exhibit produces a
real Merkle inclusion path, a consistency proof reporting `old=1 → new=2, path=1 hash,
verify=true`, and a misissuance monitor naming the out-of-policy issuer. 17/17 vitest pass.

Remaining gaps (what would raise it):
- The honesty fix is prose; the lab still cannot exhibit the attack class it now correctly says
  it omits. A single DER-parsing exhibit (even one hand-built certificate with an ambiguous
  length) would convert the Scope card's best paragraph into something the learner can run.
- OCSP status reads `leaf=unknown, intermediate=unknown` on a clean run, which is a weaker
  starting state than the CRL path and makes the OCSP toggle the less legible of the two.

### poly1305-mac — 9 -> 9 (HEAD 6d24d15)

Prior justification: "The learner types a message the sender never signed and the real key accepts
their forged tag — recovered by genuine algebra, not brute force."

That claim is true now. It was substantially false when the 9 was assigned. `6d24d15` documents
the defect with measurements: the candidate filter tested only the clamp mask over the low 16
bytes, but candidates come back reduced mod 2¹³⁰−5, so `r + k·2¹²⁸` has identical low bytes and
passed; the second-tag check is near-vacuous for close messages because neighbouring-Δ candidates
differ by `2¹²⁸·(c₁−c₂)⁻¹` and multiplying that by `(c₁−c₂)` is zero mod 2¹²⁸. Measured wrong-key
rate: 1985/2000 for `"A"`/`"B"`, 1540/2000 for `"abc"`/`"abd"` — the demo displayed the wrong r as
the stolen secret and then printed "Forgery did not verify" under a comment saying that should
never happen. The fix rejects candidates at or above 2¹²⁴ and enumerates all survivors instead of
returning the first, forging only when exactly one survives.

Driven live across four message pairs, all four branches behave correctly:

- `"Hello Alice"` / `"Goodbye Bob"` -> r and s recovered, "VALID — forged tag accepted by the real
  key", tag `95E487310940C424D999B2F66378D85F`
- `"A"` / `"B"` -> uniquely recovered this run, forgery VALID
- `"abc"` / `"abd"` -> "Key not pinned down — 4 candidates fit", no forgery, no r displayed
- `"same"` / `"same"` -> "Need two different messages"

The three verify scenarios return VALID / INVALID / INVALID from real constant-time comparison,
and the stepper prints the real clamped r and field arithmetic. 18/18 vitest pass, including new
cases pinning that a `r + k·2¹²⁸` candidate is rejected and that underdetermined pairs are
reported as ambiguous.

Remaining gaps (what would raise it):
- The ambiguity branch is the most interesting thing on the page and is currently a one-line
  status; showing the surviving candidates and letting the learner see that each reproduces both
  captured tags would turn a refusal into a lesson.
- Both reuse messages must be single-block; the multi-block case (where the polynomial has degree
  > 1) is out of scope and not signposted at the input.

### psi-gate — 7 -> 9 (HEAD 98b3c5e)

Prior justification: "Corrected down from a filed 8. Its DDH exhibit should fail its own test, and
its input-validation certificate is for validation that never runs."

`2dc378a` is the largest single remediation in my slice and closes both, plus three more:

1. **Validation certificate made true, not weakened.** `isValidPoint` was reachable only from
   `attacks.ts` and the tests; neither `psi.ts` nor `oprf-psi.ts` called it, so the identity
   encoding the probe reported as rejected would have been decoded and multiplied on the real
   path, collapsing every Y_i to O — exactly what the probe's own warning text described.
   `assertValidPoints` now runs on X_i in `bobRound2`, Y_i and Z_j in `aliceRound3`, the query in
   `oprfBobRound2` and the evaluation in `oprfAliceRound3`, throwing a typed `InvalidPointError`.
   The probe table now has two columns — `isValidPoint` and `psi.ts bobRound2` — and says "Only
   the second column is evidence about the protocol". Verified live: all four encodings show
   "✓ rejected by validation" in the protocol column. The random-bytes probe is correctly flagged
   `mustBeRejected: false` because ~1 in 16 random strings really is a valid encoding.
2. **Flatness exhibit was biased by construction.** The worker binned all 32 bytes as uniform
   draws, but byte 0 is always even and byte 31 never reaches 0x80 (RFC 9496), adding ~310 of
   systematic χ² to ~255 of noise at n=5000. Bytes 1–30 now carry the test; bytes 0 and 31 are
   charted separately with their constraints **measured per run** ("Byte 0 odd (should be 0): 0 of
   5,000"). Live: χ² = 266.45 inside the α=0.05 band, "Consistent with uniform — cannot reject H₀".
3. **The χ² ladder tested an α it did not report** — the 0.05 band sat strictly inside the 0.01
   band, making the middle branch unreachable. Replaced with exact χ²(255) quantiles, ordered
   strictest-first.
4. **Exhibit 3's alignment grid was a different execution** from the result above it; both now
   read one trace.
5. **"Simulate Scalar Reuse" ran fresh scalars, not the reused α** it was about. Live now:
   "Both sessions above were executed with the reused α shown to the panel", 2 of 3 byte-identical
   X_i shown in hex, and the wire value correctly renamed from Y_i to X_i (Bob draws a fresh β
   each session, so Y_i is not linkable).

Exhibit 1's two columns are now labelled "omniscient view" with the sentence "That is the lab's
omniscient view, not any participant's". 40/40 vitest pass.

Remaining gaps (what would raise it):
- The built page logs a CSP violation for an inline script whose sha256 is not in the meta-tag
  `script-src` list; the page still renders, but the hash list is stale.
- Attacks 1, 2 and 5 are still one-click scripted simulations; only scalar reuse and the injection
  probe let the learner see the mechanism in bytes.

### quantum-entropy — 8 -> 9 (HEAD b4028ad)

Prior justification: "Honest that it is a classical simulation, and says so where the learner
stands." That was recorded by the thin pre-batch pass and understates the demo considerably.

`5f776d7` fixed the one falsifiable claim on the page: the panel h2 read `Shannon says "99.7%
random."` as a string literal, true only at the default 53/47 device — at 70% detector mismatch
the heading still said 99.7% while the statistic three lines below read 0.8813 bits/bit. The
numeral now renders from the same live `hSh`. Verified: 53% -> "99.8%", 70% -> "87.6%",
70%+correlation -> "90.5%", each agreeing with the stat grid beneath it. `b4028ad` fixed the
README tagline that called the modeled beam-splitter "a real quantum source" while every other
surface in the repo said otherwise.

What the re-audit found beyond the prior note — all learner-driven and all computed:

- The stat grid recomputes bias, Shannon H, min-entropy H∞, single-guess success, and naive
  256-bit attacker work per slider move: 2^234.5 at default, 2^131.7 at 70% bias, 2^11.7 with
  correlation added.
- Adding correlation switches the verdict branch entirely: "dependence detected — model rate
  0.0458 bits/bit. First-order diagnostic: a predictor guesses 95.5% of this sample's bits, so
  bias alone no longer describes the source."
- The Toeplitz panel is a real break-it. Demanding m = 256 from k = 234.5 gives "✕ REJECT — the
  bound is vacuous ... The output below still looks perfectly random — that is exactly why the
  accounting, not the appearance, is the verdict." Producing output is explicitly separated from
  being secure ("128 bits produced — the GF(2) multiply always runs fine").
- The extract button is gated on a latched health alarm from panel 5: "A real conditioner never
  accepts material from an alarmed source — repair and recommission first."
- Observed-sample figures are labelled "DIAGNOSTICS ONLY ... never part of the budget", and the
  2⁻³²/2⁻¹⁰ accept lines are labelled "this lab's teaching policy, not part of the theorem".

47/47 vitest pass.

Remaining gaps (what would raise it):
- The photon source is `crypto.getRandomValues` behind a model; honestly labelled everywhere now,
  but no exhibit shows what a genuinely quantum source would change.
- The five panels are independent controls rather than a single narrative; nothing sequences the
  learner from "spec sheet says 99.8%" to "your key has 11.7 bits" without them finding it.

### ratchet-wire — 8 -> 8 (HEAD 90367a8, nested package at `ratchet-wire/`)

Prior justification: "Real Double Ratchet the learner drives with two learner-parameterized
failures; the compromise story stops one decrypt() short of a break."

The named gap is unchanged, so the 8 holds. What did land is `90367a8`, which fixed a defect the
prior score did not name: the break-in recovery panel printed "New root (safe)" and announced
"the attacker is locked out" purely because the button had been pressed. It now computes
`rotated = newRoot !== this.recoverySnapshotRoot` and, when false, prints "New root (UNCHANGED —
no DH ratchet fired) ... but the root key did not move, so nothing was recovered. This is a bug,
not a lesson." The aria-live announcement is gated on the same flag — worth noting because
`nonce-guard` has the opposite pattern (computed badge, fixed announcement). The same commit
corrected four Signal-spec citations that pointed at §3.3 "Initialization" for KDF_RK and
DHRatchet, with the renumbering history (§5.2 -> §7.2 after the Sparse PQ / Triple Ratchet
sections were inserted) recorded in the source comments.

Verified live: compromise -> snapshot root `00AFE098…`; Alice sends with a new DH key; Bob
receives -> new root `C464EFF6…`, "Bob's DH ratchet count: 2", decrypted "Recovered traffic 🔒".
The MITM demo aborts X3DH with a real signature failure. The forward-secrecy panel genuinely
derives the exposed message keys from the stolen chain key and prints their hex (MK[3]
`FACC9420ED97AE46`, MK[4] `DFA2566DDEF2204C`, MK[5] `827CE9822874FA22`) while marking m0–m2
"safe — cannot derive (one-way KDF, chain key gone)". 60/60 vitest pass.

Remaining gaps (what would raise it):
- Still one decrypt short. The attacker derives the right message keys and the page shows them,
  but no ciphertext is ever opened with a stolen key, so the learner reads a hex string where they
  could be reading a plaintext they were not supposed to see.
- The break-in recovery is a fixed three-button sequence; the learner cannot choose when Alice
  ratchets or attempt the recovery from a state where it should fail, so the newly-honest
  "UNCHANGED" branch is unreachable through the UI.

### ring-sign — 7 -> 9 (HEAD cf0ff1b)

Prior justification: "Real LSAG with a genuine tamper path and animated challenge chain — but the
linkability exhibit's 'not linked' branch is unreachable code."

`7f719ce` fixed that and two more; `53ed872` fixed three others. All verified live:

- **The named defect.** `runExhibit2` signed both spends with `state.signerIndex`, so
  `detectKeyImageReuse` could only return true. Spend B now has its own signer selector. Driven:
  B=M1 against A=M2 -> "Reuse detected: **no** — the two key images differ, so the ledger accepted
  both (computed by comparing the images above; spend A signed by M2, spend B by M1)"; B=M2 ->
  "Reuse detected: **yes** — the two key images are equal, so one secret signed both", with the
  ledger showing "✗ REJECTED double-spend".
- **Chain-closed badge was set unconditionally** by the animation. Now
  `chainActuallyCloses(state.ex1Chain) && state.ex1Verified`. Driven: honest run -> "chain closed:
  cₙ == c0 ✓"; after "Flip one byte of a response" -> "chain broken: cₙ ≠ c0 ✗" with the real
  differing endpoints (c0=0a9f4f5… vs cₙ=…), and the tamper line "Flipped one byte of s0 →
  rejected".
- **Exhibit 3 asserted linearity**, including in its aria-label. Now an OLS fit over the samples:
  "sign ≈ 0.983 ms per extra ring member (R² = 0.990), verify ≈ 1.17 ms (R² = 0.995) ... The fit
  above is measured, not assumed", with a "your run was noisy" branch when the fit is weak.
- **Exhibit 4's "Signer identity to verifier: hidden" was a fixed string** while `group.ts` ships
  a stable `credentialId` and the member public key in the clear. New `linkageFromWire()` derives
  the pseudonym from the collected signatures alone. Live after three signings by one member:
  "3 across 1 distinct signer; 3 of them share this pseudonym, linked by the fields credentialId,
  issuedPayload, managerSignatureHex, memberPublicJwk, which were byte-identical across every one
  of them. Any verifier can do that grouping; no manager needed."
- **The response grid was built from the prover's `LsagSignature`**, including `signerIndex`. New
  `toVerifierView()` strips it; a test pins that `verifyLsag` succeeds on a view with a falsified
  `signerIndex` because it never reads one.

35/35 vitest pass.

Remaining gaps (what would raise it):
- After a tamper, the Exhibit 1 status block reads "chain broken: cₙ ≠ c0 ✗" immediately above
  "**Verification:** valid ring signature". Both are true of different objects (the tampered chain
  vs. the original signature) but they share one `aria-live` region with nothing distinguishing
  them; the tamper's own "rejected" line is further down the page.
- The tamper buttons rerun a side verification rather than replacing the session's signature, so
  the learner cannot carry a broken signature forward into Exhibit 2.

### scloud-vault — 8 -> 8 (HEAD ff21806)

Prior justification: "A real hand-rolled Scloud+ and the best on-ramp in the cluster; Exhibit 3's
correction-radius crossing is a true break-it exhibit."

Both halves confirmed. Exhibit 3 driven across three noise regimes is genuinely measured, not
staged: σ=100 -> 100/100 and "All decoded correctly — noise is within BW₃₂ correction radius";
σ=600 -> 99/100; σ=1400 -> 7/100, with the single-trial view showing the message decoding as 10
(01010) when 13 (01101) was sent and "✗ FAILURE — noise exceeded correction radius".

`301a92a` fixed two claims the prior score did not name:

- The review-scrutiny cards rendered `meter()` bars at hardcoded 100% / 45% / 18% widths under
  labels like "Years of public analysis" and "Independent cryptanalysis papers" — invented
  quantities styled as measurements of a research literature. Replaced by six `reviewFact()` rows
  carrying sourced statements ("NIST PQC: 2016–2024", "3 public rounds + FIPS 203", "published in
  2024", "individual IETF draft"). Verified live: 0 meter elements, 6 fact rows.
- The README, `params.ts` and the keygen callout all described the in-browser KEM as a
  "single-vector simplification". It is not — `B` and `S` are n×32 matrices. All three now say so,
  and the live callout reads "This demo's public key is 28832 bytes; the real Scloud+-128 public
  key is 7,200 bytes (paper Table 6) ... it uses a full 600×32 matrix B, a simplified 32-column
  message geometry, and demo packing/coding" — note the demo key is *larger* than spec, which the
  old "scaled down" framing would have made incoherent.

41/41 vitest pass; a new `e2e/claims.spec.ts` pins both fixes.

Remaining gaps (what would raise it):
- `src/exhibits/exhibit3.ts:108-112` — the 100-trial verdict is a three-way branch on 100% / 0% /
  everything else, so both 99/100 and 7/100 print "⚠ Partial failure — noise is near the boundary
  of the correction radius." At 7% success the noise is far past the boundary, and the sentence is
  simply false. This is the one remaining asserted claim I found on the page and the cheapest fix
  on this list.
- The FO transform's tamper path (`#encaps-tamper`) is a single scripted button rather than a
  learner-chosen corruption.
