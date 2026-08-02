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
| lattice-gentle | fca3ad7 |
| lwe-hints | 1429cef |
| matsui-line | 4ea59a6 |
| merkle-proofs | b67c381 |
| merkle-vault | 9c3ea37 |

Distribution: 7 × 2, 8 × 6, 9 × 11. No 10s. Median 9, mean 8.5 — higher than the
2026-08-01 recovered set (mean ~7.7), which is a property of this slice rather than
grade inflation: it is heavy on recently-rebuilt labs (`lattice-fault` Exhibit 4,
`iron-letter`'s two-party rework, `lattice-gentle`'s guided shell) and on demos whose
subject is an attack, which forces a computed consequence. Three anchors from the prior
rubric's 5-cluster appear here — `iron-letter` and `lattice-fault` are now 8, and
`lattice-gentle` is 9; in each case the criticised artifacts are gone from the source,
so those 5s are stale rather than wrong at the time.

Read against the recovered scorecard's own reference points: `matsui-line`, `kem-trap`,
`merkle-proofs` and `jevil` sit with `card-trick` / `spdz-forge` at the top of the 9 band
(no falsifiable claim found), while `hybrid-guide`, `hybrid-wire` and `hybrid-pqc` sit
where `patron-shield` does — real crypto with one headline indicator selected by a flag
rather than computed.

## Scores

| demo | HEAD | score | justification |
|---|---|:--:|---|
| hybrid-guide | 004680f | 8 | The headline re-encapsulation attack is genuinely computed and was verified live: under the naive combiner two transcripts derive byte-identical keys, under the bound combiner they differ, both from fresh randomness per click; the performance tab measures real timings and the KAT suite pins the construction. Docked because the demo's namesake "break a half" playground is toggle arithmetic — the verdict text and the 512/256/0-bit entropy bar are selected by checkbox state, not computed from any crypto — and the component "X25519/ML-KEM-768" secrets are random bytes (candidly disclosed, but the learner never touches a real KEM). E2E is a11y-only; behavioral states live solely in unit tests. |

| hybrid-pqc | fa9319a | 8 | Real X25519/ML-KEM-768/Ed25519/ML-DSA-65 via noble; verified live that when both threat switches fall, each column's "Attacker reconstructed the session key" hex is byte-identical to the real session key — the attacker model grants genuine component secrets and reruns the real combiner, so the hedge (single break yields null) is real code, not a caption. Timings are measured (median of 5), and the honest scope line ("only the *event* of a break is simulated") is prominent. Docked because the signature half asserts its headline — "a forged signature passes" is printed from the threat flags without ever producing a forged signature for the real verifier to accept — and the compromise statuses themselves are flag lookups. E2E is a11y-only. |

| hybrid-sign | e2f7cb2 | 8 | Real draft-16 LAMPS composite (Ed25519 + ML-DSA-65 via noble) with the M-prime construction pinned by unit KATs; every scenario verdict is the literal output of `compositeVerify` on a genuinely constructed forged signature — verified live: single-break scenarios show the intact component rejecting (REJECT with the correct catcher named from computed `caughtBy`), double break shows the composite honestly accepting the forgery as residual risk, and tamper buttons flip real signature bytes and re-verify. No falsifiable claim found. Held at 8 because every attack is a canned scenario button over a fixed forged message — the learner watches rather than mounts — and the page is a single narrow exhibit with a11y-only e2e. |

| hybrid-wire | a2482aa | 8 | Real end-to-end pipeline verified live: X25519 (WebCrypto) + ML-KEM-768 handshake completes with byte-compared matching session keys, AES-256-GCM chat round-trips, and "Tamper with session" flips a real ML-KEM ciphertext byte, re-runs real decapsulation (implicit rejection diverges Bob's key), and subsequent decryptions genuinely fail authentication. Benchmark runs 50 live iterations. The threat tab's verdict ("Session still safe/compromised") is a flag-driven pure function, but it honestly defines "broken" and reveals the broken wire's real secret bytes while masking the survivor — showing rather than asserting the half-unknown HKDF input. Docked for the flag-selected resilience verdict, no attacker-side key reconstruction to byte-compare (as hybrid-pqc does), and a11y-only e2e over 18 unit tests. |

| ibe-gate | ba74aca | 9 | Real Boneh-Franklin BasicIdent over BLS12-381 with every exhibit verdict computed and verified live: the bilinearity test derives both sides from fresh random scalars and byte-compares all 576 GT bytes; a learner-typed message encrypts to a learner-typed unenrolled identity and round-trips; the wrong-key path decrypts to genuine garbage; and the escrow exhibit derives d_ID from s and prints what the derived key actually returned "not an echo of what you typed" — even flagging the honest 32-byte message-space truncation. The Type-3 asymmetric-pairing deviation from the paper is documented in-page down to which assumption changes. Off 10 because the attacks remain guided buttons (issue/refuse/collude picks a narrative frame around the computed decryptions), and browser states are covered by unit tests but the e2e layer is a11y-only. |

| icy-dvrf | 24dbcdc | 9 | The 2026-07-20 audit's five blockers have demonstrably landed: construction identity is pinned (docs/CONSTRUCTION.md + frozen golden transcript vectors), uniqueness/liveness/selective-abort are separated and each shown, and the verifier workbench strictly parses a pasted export with independent state — verified live: a real envelope verifies, a one-nibble beta tamper fails with exactly "β = H(Γ) FAILS" while both DLEQ equations still pass. Withhold-only cast's "the β the withholder already knew" is byte-identical to the honest rerun (checked), corrupt-partial cast aborts with per-equation blame naming the right party. One edge overstatement found: in a mixed corrupt+withhold cast, the "β the withholder already knew" is computed over a cast containing a corrupted partial that could never have verified, so that number is not any publishable output. A11y-only e2e keeps browser states unasserted. |

| iron-letter | 25dba13 | 8 | The prior 5 no longer stands — commit a7a30a9 rebuilt the demo around observable asymmetry, and it holds up live: the ECDH convergence panel really derives both halves (ephemeral-priv x Bob-pub and Bob-priv x ephemeral-pub) and byte-compares them ("✓ Both sides derived the SAME 32 bytes" reads a computed `secretsMatch`); "Try opening with Eve's WRONG key" runs the real decryption and catches the real AES-GCM/OAEP failure, with an honest report-it branch if the impossible ever succeeded; boot runs a KAT self-check; benchmark timings are measured. E2E smoke asserts the round trip and the error path, not just a11y. Docked because nothing beyond the wrong-key failure ever breaks — the MITM key-substitution and nonce-reuse hazards its own What-Can-Go-Wrong lists are never mountable, and the exhibits are seal/open round trips. |

| iron-serpent | f2e73d0 | 9 | Spec-faithful throughout: the WASM Serpent engine and a second, independently hand-rolled introspectable Serpent are both pinned to the official AES-submission vectors (22 KAT-anchored unit tests), and the round visualizer steps real 32-round state from learner input. Verified live: the tamper lab's bit-flips produce genuine HMAC rejections (verify-then-decrypt is itself unit-asserted), and the nonce-reuse exhibit computes CT1 XOR CT2 and PT1 XOR PT2 from two real same-nonce encryptions and shows them byte-identical — the catastrophe demonstrated, not narrated. The security-margin exhibit carries the fleet's most careful honesty framing ("not a countdown to being broken"). Off 10: tamper flips a fixed byte rather than a learner-chosen one, the reuse exhibit stops short of letting the learner mount the crib attack it describes, and behavioral e2e coverage is thin. |

| j-uniward | 03b91e9 | 9 | The most technically ambitious demo in this slice and it checks out: the closed-form UNIWARD cost is pinned against a brute-force reference to 1e-9 including image edges (test run: 15/15 pass), embedding is a real STC h=12 Viterbi over a keyed permutation, the full embed-download-extract round trip runs a real JPEG codec, and wrong-key rejection is a real HMAC failure. Driven live: a learner-typed message embeds, and the three-way LSB/F5/J-UNIWARD comparison computes per-method exposure (10%/4%... at equal payload) with J-UNIWARD genuinely winning; the "placement proxy — not a detector" framing is stated at point of use. Off 10: detectability labels rest on the placement heuristic rather than any real steganalyzer, and e2e only covers a11y/contrast, so the browser flows are visited, not asserted. |

| jevil | 7af2f2b | 9 | The cliff is implemented for real and proven live: honest signing revisits hash-derived positions (so the learner sees a signer outlive n*), the adversarial grind packs fresh points and fires at exactly n*+1, and panel 04 reconstructs the secret from public data with a row-by-row recovered-vs-true coefficient table ("EXACT MATCH — all 12 coefficients"), computed each run over either the base Goldilocks field or the paper's real degree-4 tower. The load-bearing omission (no zk-WHIR commitment) is not just disclosed in KNOWN-GAPS.md — malicious mode demonstrates what its absence allows, and the test suite asserts both the escape and the D+1+boost recovery. Uniquely in this slice, scripts/e2e.test.mjs asserts the load-bearing browser states (grind, duplicates, malicious escape, export/verify round trip), not just a11y. Off 10: the "recoverer has become the signer" payoff is prose — the learner never forges with the recovered key — and the plot honestly admits its curve shapes are illustration. |

| kem-trap | 3447b30 | 9 | Teaches caller-side KEM failure semantics with unusual discipline, and it all held up under live driving: flipping a real ciphertext bit drives SAFE→REJECT (via a computed confirmation-MAC failure) and BROKEN→ALARM (keyed on the real implicit-rejection secret K-bar); length corruption shows rc=-1 ignored and the session keyed on resident buffer bytes; the Bob/Carol provenance panel computes the MAC verifying for Bob and failing for Carol — "shown, not asserted" is literally true. The FO branch is reconstructed from the reference's own math surfaces and KAT-checked byte-for-byte against the real decapsulate; crypto-result and security-verdict indicators are kept separate so forged-but-accepted renders as ALARM. E2E smoke asserts the three verdict states, the resident-bytes case, and permalink restore. Off 10: the oracle surface is exposed but never exploited (no CCA key-recovery), and the timing channel is control-flow-modeled, not measured — both disclosed. |

| key-exchange | fc0c51c | 8 | Five-generation survey where every playground computes: the "Break it" button really brute-forces the toy discrete log and prints Alice's exponent; the MitM panel has learner-editable p/g/a/b and Mallory exponents; real ML-KEM-768 runs with a forge check that flips a real ciphertext bit and reports implicit rejection; and the Module-LWE panel genuinely runs Gaussian elimination both ways — noise off recovers s exactly, noise on lands on a computed wrong non-short vector with an honest explanation. Even the quantum-cost table carries a caveat that its two sources are not directly comparable. Smoke script asserts behavioral states (attack recovers, DH/ECDH agreement). Held at 8: it is a long survey with substantial curated-table content, the Shor exhibit is a classical stand-in (labelled), and the learner triggers demonstrations rather than mounting an attack with anything at stake. |

| kyberslash | b1a22cc | 9 | A genuine adaptive attack, not a lookup: the secret only enters inside the modelled device, the attacker sees cycle counts, derives its threshold from the public platform model, and reconstructs coefficients from which step boundaries were crossed — driven live, 768/768 recovered in 18,432 queries, and the "Recovered key matches secret · 100%" pill is a real element-by-element comparison against the true key (`value === truth`), not a completion flag. Switching to the patched Barrett path recovers 0 bits. The honesty is best-in-slice: the README and the on-screen band figures state exactly which numbers are the paper's measurements, which base cost is invented, and that the secret is collapsed to {−1,0,+1} rather than η1=2's real range. Off 10 because the timing itself is a deterministic model, not measurement (unavoidable in a browser, and labelled), the key is a reduced teaching toy, and e2e is a11y-only. |

| lattice-fault | e6c7139 | 8 | The prior 5-cluster anchor is stale. Exhibit 4 (rebuilt in 01b0821) is the standout: it injects a real loop-abort into a real FIPS 204 ExpandMask, checks the faulty signature against the standard's own ‖z‖∞ line-23 bound, inverts c in the real ring, builds a Kannan embedding and runs real LLL — recovering 256/256 s₁ coefficients in 127 ms, printed against the actual secret, with a what's-real/what's-reduced box naming ℓ=1 vs ℓ=4 and the unevaluated ‖r₀‖ check. Exhibits 1-3 are honest models: CPA correlation over simulated traces (with a caveat refusing the "one point reveals the coefficient" reading), a rejection-fault recovery that discloses its fixed-scale c·s₁ shortcut, and a divide-cycle histogram that explains why it refuses `performance.now()`. Held at 8 because three of four exhibits are simulations rather than real primitives, and e2e is a11y-only. |

| lattice-gentle | fca3ad7 | 9 | The 2026-07-20 audit's five blockers have all been addressed and the fix is visible in the source, not just the changelog. GS-01 in particular: the opening thesis now says outright that the standardized schemes never hand honest users a secret good basis and that the secret is a short vector inside noisy modular equations, with the basis picture demoted to "a geometric lens" and MLWE/MSIS named as the exact problems; commit 2527fd9 and fca3ad7 pin those corrections with tests. The page is a gated guided shell (exhibits reveal in sequence, closing with a five-question exit check). Everything I drove computed: toy-Kyber decrypts with a measured ‖E‖∞=10 against the live q/4 ceiling, ciphertext tamper produces real FIPS 203-style implicit rejection ("receiver holds the fallback key"), and toy-Dilithium signs through real Fiat–Shamir aborts (per-attempt bounds printed) then rejects a tampered z with "recomputed challenge differs — w₁′ ≠ w₁". Off 10: it stays at the notes' toy parameters by design (candidly boxed), the LWE/SIS panels are pick-a-preset rather than open attack, and e2e coverage is thin against 58 unit tests. |

| lwe-hints | 1429cef | 7 | Exceptionally honest and well-sourced for what it is, and that is the ceiling: it says outright in README, model.ts and the UI that it "runs NO attack" — no lattice reduction, no side channel, no randomness — and every displayed number carries an explicit `paper` / `model` / `model-derived` provenance tag plus a heuristic·GAA badge. The fitted C=2 is derived from the paper's own anchor and shown reproducing all four Table 1 rows, with the PDF committed and transcribed. Driven live the estimator recomputes correctly across (n,h) and the "why h·log₂h not h" interactive genuinely collapses ambiguous candidate positions as locating hints are added — the one place a mechanism is shown rather than tabulated. But this is a calculator over two closed-form laws: nothing cryptographic executes, nothing can be broken, and the threat calculator's Safe/Manageable/Dangerous verdict is arithmetic thresholding. 35 unit tests pin the model; browser states are unasserted. |

| matsui-line | 4ea59a6 | 9 | The strongest demo in this slice and the closest thing here to claim-complete. Every verdict I triggered was computed from live counters and stated only what the run learned: the successful break names the winning candidate and its exact margin ("beat the loudest wrong guess by 19/1024"); the starve preset reports the real key's counter losing to a specific impostor and says "more traffic may still fix this one"; the add-a-round preset distinguishes that from a ceiling ("every one of the 256 possible plaintexts is already in the count, so this is the ceiling, not a run of bad luck"). Exhibit 6 refuses to draw the formula's curve — it runs 300 complete attacks in a worker and reports measured 3/35/72/85/97% against the formula's 84–100%, then explains the ranking-vs-leaning gap rather than hiding it. The linear hull effect is measured across ten keys, showing the lemma's prediction and reality parting company. 85 unit tests. Off 10 only because the browser states are unasserted in e2e and the target is a toy SPN by design. |

| merkle-proofs | b67c381 | 9 | Broad and uniformly computed. Everything I drove was real: leaf-tamper and proof-bit-flip both flip to REJECTED against a recomputed root; the domain-separation toggle genuinely makes the second-preimage forgery succeed with it off ("a 64-byte value that was never a leaf just proved its own inclusion") and fail with it on; the Bitcoin odd-node rule reproduces the CVE-2012-2459 root collision with both roots printed and identical; consistency proofs catch rewrite/delete/reorder with old and new roots shown. The standout is the trust-model exhibit, which stages the misconception most demos assert away — a prover-supplied root verifies and the panel says so ("VERIFIES — AND PROVES NOTHING ... self-consistent, security-free"). It then verifies a real pinned CT entry at index 1,234,567,890 of a 2.8-billion-cert log with 32 hashes, and a one-bit certificate tamper rejects it. Scope caveats (pinned STH, no ECDSA check, Bitcoin's differing construction) are stated at point of use. Off 10: 69 unit tests but a11y-only e2e, and the CT signed-tree-head is pinned rather than fetched/verified. |

| merkle-vault | 9c3ea37 | 7 | Correct and honest, but it is the smaller sibling of merkle-proofs and covers a fraction of the same ground. What it does, it does properly: the walk-the-proof mode prints each real `H(0x01 ‖ L ‖ R)` step, the recomputed and committed roots are shown side by side with a byte-for-byte verdict that flips to "❌ The two roots differ" after a tamper (and the panel correctly attributes it to "the leaf or a sibling"), and the CVE-2012-2459 panel computes both conventions' roots live, showing the Bitcoin collision and the RFC 6962 divergence. Docked because there is exactly one attack (tamper a leaf), the second-preimage/domain-separation vulnerability its own README calls "a real structural vulnerability" is described but never made mountable, and 23 unit tests sit behind an a11y-only e2e. Its overlap with merkle-proofs (which does all of this plus consistency proofs, the trust-model misconception, and a real CT entry) is the main thing capping it. |

## What would raise it

### hybrid-guide
- Use real X25519 (WebCrypto) and a real ML-KEM (as sibling demos do) so the component secrets the combiner binds are actual KEM outputs rather than `randomBytes(32)`.
- Make the break-a-half exhibit compute a consequence: e.g. after "quantum breaks X25519," actually hand the attacker the classical secret and show a brute-force over the remaining space succeed/fail at toy sizes, instead of a checkbox-driven headline.
- Add behavioral Playwright assertions (attack collision, combiner-switch key change) — currently only the a11y scan drives the page.

### hybrid-pqc
- Give the signature half the same treatment as the KEM half: when both families are "broken," actually mint a forged composite signature and have the real verifier accept it, instead of printing "a forged signature passes" from the threat flags.
- Derive the per-column `secure`/`hedge-holding`/`broken` status from `attackerRecoversKey` returning non-null, so one code path produces both the badge and the hex.
- Add behavioral e2e asserting recovered-key-equals-session-key per column; today only axe drives the page.

### hybrid-sign
- Let the learner author the forgery: an editable forged message plus a per-component "attacker can forge this one" toggle, so the scenario buttons become learner-mounted rather than three canned presets.
- Expose the M-prime construction interactively (edit ctx, watch the representative and both component signatures change) rather than only in the README and unit tests.
- Add a second exhibit — the demo is a single narrow bench, which is what keeps a technically clean lab at 8.

### hybrid-wire
- Compute the threat tab's verdict the way hybrid-pqc does: attempt the HKDF reconstruction from the attacker's known inputs and show it failing, rather than returning a canned `ResilienceVerdict` from two booleans.
- Let the learner choose the tampered byte (and try tampering the X25519 half) instead of a fixed `ciphertext[0] ^= 0x01`.
- Add behavioral e2e for the handshake/tamper/threat states; 18 unit tests currently carry all of it.

### ibe-gate
- Let the learner mount the escrow: type any identity and have the PKG panel decrypt a ciphertext the learner created in Exhibit 2, closing the loop between the two exhibits.
- Make the time-limited exhibit's "refuse" branch produce a real failed decryption attempt rather than narrating that no key was issued.
- Add behavioral e2e (bilinearity byte-equality, wrong-key garbage, escrow recovery) to match the strength of the unit suite.

### icy-dvrf
- Fix the mixed-cast edge: when a corrupted partial is present, the withholder's "β you already knew" is computed over a cast that could never have verified — either recompute it over the honest subset or label it as not-a-publishable-output.
- Let the learner tamper the exported envelope in-page (a byte picker) instead of relying on hand-editing before paste.
- Assert the load-bearing browser states (cheat casts, blame table, workbench accept/reject) in e2e rather than only axe.

### iron-letter
- Make the MITM key-substitution hazard mountable: let a relay swap Bob's public key in the share-URL/QR flow and show Alice sealing to the attacker.
- Add a nonce/IV-reuse exhibit — the README names it as the first thing that can go wrong and nothing on the page demonstrates it.
- Show the RSA-OAEP envelope's internals (wrapped AES key) the way the ECDH convergence panel shows ECIES, so the two tabs teach at the same depth.

### iron-serpent
- Let the learner pick which byte/bit to flip in the tamper lab, and offer a "MAC skipped" mode so the encrypt-then-MAC ordering lesson can be felt, not just read.
- Finish the nonce-reuse exhibit: give the learner a crib box and let them peel PT1 and PT2 out of the XOR the page already computes.
- Add behavioral e2e for round trip, tamper rejection, and the reuse XOR equality.

### j-uniward
- Run at least one real steganalysis feature set (even a small SPAM/CC-JRM subset) so "Resistant/Detectable" is a detector's output rather than a placement heuristic.
- Let the learner choose an embedding key and a cover image and then attack their own stego image, rather than comparing three methods the page drives.
- Add behavioral e2e over the embed/extract/wrong-key paths; the 15-test node suite covers the core but no browser state is asserted.

### jevil
- Close the loop: after recovery, let the learner sign a new message with the recovered key and have the real verifier accept it — the page says "the recoverer has become the signer" without demonstrating it.
- Replace the illustrative curve shapes in the cliff plot with real evaluations of the candidate polynomials, so the "many fit, then one" picture is computed like everything else.
- Add the zk-WHIR-style degree commitment (or a hash-based stand-in) so malicious mode can be shown being stopped, not just being possible.

### kem-trap
- Exploit the oracle it exposes: even a reduced-parameter chosen-ciphertext loop that recovers a few key bits would turn Exhibit 4 from a surface into an attack.
- Measure the timing channel (or drive it from a modelled cycle count as kyberslash does) instead of representing it as a code path.
- Let the learner choose the flipped bit/byte and the corruption shape rather than picking from three preset mutations.

### key-exchange
- Give the MitM playground a computed consequence — encrypt a message under each half-session and show Mallory reading it — rather than displaying the two shared secrets.
- Let the learner attack the ECDH toy curve the way they can attack the DH group (a brute-force ECDLP button), so the second generation breaks too.
- Trim or tab the survey content; the page's best material (DH break, MLWE noise toggle) sits inside a very long scroll.

### kyberslash
- Support the paper's û-multiplier so the full η1=2 secret range is separated, rather than collapsing to {−1,0,+1}.
- Let the learner set the probe positions and measurement count and watch the recovery degrade, instead of running a fixed 18,432-query campaign.
- Assert the recovery/patched states in e2e; the unit suite covers the oracle but no browser state is pinned.

### lattice-fault
- Bring Exhibit 2 up to Exhibit 4's standard: form c·s₁ as a real product in Z_q[x]/(x²⁵⁶+1) instead of the disclosed fixed-scale shortcut.
- Let Exhibit 4 run the remaining ℓ=4 polynomials so a full ML-DSA-44 s₁ is recovered rather than one polynomial's worth.
- Add behavioral e2e for the four exhibits' verdicts, especially the constant-time timing collapse which renders asynchronously.

### lattice-gentle
- Make the LWE/SIS panels open: let the learner search for a short solution (or run a small BKZ/LLL) instead of choosing among precomputed solution buttons.
- Add one non-toy anchor — even a single ML-KEM-768 round trip via a library — so the jump from n=4 to the standard is shown rather than tabulated.
- Extend e2e beyond the guided-shell smoke to assert the KEM implicit-rejection and Dilithium tamper verdicts.

### lwe-hints
- Instantiate one small concrete LWE instance and actually recover its sparse secret from generated hints, so the O(h log h) claim is demonstrated at least once rather than only estimated.
- Show the GAA doing work: sample hint vectors and plot the empirical distribution against the Gaussian assumption, making the heuristic badge an observation rather than a disclaimer.
- Let the learner supply their own leakage trace/rate profile and see the threshold move, instead of three preset scenarios.

### matsui-line
- Add e2e assertions for the cockpit verdicts and the four presets — the reasoning is impeccable and entirely unguarded at the browser level.
- Let the learner choose an approximation mask by hand (not just auto/strongest/bad) and see the search agree or disagree with them.
- Extend Algorithm 2 to a second subkey nibble so the "four bits are now public" ending becomes a full key recovery.

### merkle-vault
- Make the second-preimage attack mountable (a domain-separation toggle like merkle-proofs has) — the README calls it a real structural vulnerability but the page only describes it.
- Add a consistency/append-only proof, the one Merkle idea the demo names in "When to Use It" and never shows.
- Either differentiate it from merkle-proofs or fold it in; as it stands the sibling demo supersedes it on every axis.

### merkle-proofs
- Fetch and verify the CT log's signed tree head (including the ECDSA signature) rather than pinning it, closing the one gap the page itself names.
- Let the learner drive the tampering (choose the byte/leaf) in the consistency and CT exhibits, as they can in the inclusion exhibit.
- Add behavioral e2e over the eight exhibits' verdicts; 69 unit tests currently carry a page with far more reachable states than that.
