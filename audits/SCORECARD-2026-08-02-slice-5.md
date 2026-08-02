# Crypto Lab — gold-standard pedagogy scoring, 2026-08-02, slice 5

Scored by a single agent against the 2026-08-01 recovered scorecard's calibration (no 10s;
9 = exceptional, learner-driven, zero falsifiable claims found). Read-only pass: no demo
repo was modified. Scoring method per demo: fetch + HEAD noted, `npm ci`, README + source
read, `npm run build`, built output served via `vite preview`, page driven with Playwright
chromium (main exhibits + failure/tamper paths), test suite skimmed.

Repos in this slice (HEAD at scoring time):

| repo | HEAD |
|---|---|
| shor | e4146a3 |
| signed-bytes | c36ea47 |
| simon-period | 9c8413a |
| stego-suite | 927cfb2 |
| stream-ward | 3eec4bc |
| syndrome-drain | 06d7279 |
| syndrome-hints | bee3409 |
| threshold-decrypt | 92f5d3b |
| threshold-mldsa | 751ddb5 |
| timing-oracle | 675ccca |
| timing-sidechannel | e6315e2 |
| traitor-trace | 6d5b179 |
| vdf | fb54d03 |
| vigenere-break | 858b405 |
| vss-gate | 6fb7754 |
| world-ciphers | 1779dc0 |

## Scores

| demo | HEAD | score | justification |
|---|---|:--:|---|
| shor | e4146a3 | 9 | The engine is honest end-to-end: the quantum measurement is sampled from the full r-peak QFT distribution and everything downstream runs on the r recovered by continued fractions, never the classically known one — unhelpful peaks genuinely force resamples and base retries. Driven live: the "why r factors N" explainer substitutes the actual run's a=208, r=870, gcd results; the phasor wheels compute Σe^iφ from live phases and choose "add"/"cancel" from the computed magnitude, with learner-retunable on-peak/sampled/off-peak frequencies. Every quantum step is labelled "(classically simulated)". Tests assert invariants (a^r ≡ 1 for every reported CF step, 75-run stress at the hard N values). Held off 10: the RSA Impact panel's complexity numbers are a static (sourced) table, and the learner observes/retunes rather than breaks anything. |

| signed-bytes | c36ea47 | 9 | The verdict-separation architecture is real: "Signature: VALID" and "Verdict: ALARM" are independently computed (raw noble Ed25519 boolean vs canonical-form meaning comparison across first-wins/last-wins parsers), and I watched the centerpiece produce exactly that pair live from the signed dup-key bytes. The Stage 5 tolerance matrix is 16 genuine sign/verify runs (verified cells flip correctly as the boundary slider moves), the JCS toggle re-runs every stage and the dup-key case is genuinely refused at parse. 132 passing tests assert all three verdict states including 'alarm', plus JCS property tests. No falsifiable claim found in the driven session. Off 10 only because the opening walkthrough is guided rather than learner-authored and meaning-equality is definitionally last-wins rather than surfaced as a choice. |

| simon-period | 9c8413a | 9 | An exact statevector simulation rather than a sampled output distribution, and it uses that honesty: the Even-Mansour verdict derives k₂ from one classical query and checks the predicted block against the real cipher (the panel says the full 32-block sweep is the page checking itself, not part of the attack), and the CBC-MAC target forges a tag on a never-queried message the real MAC accepts. The control target correctly reports "rank reached n, that is a proof, not a timeout," and candidates are verified against f over the whole domain before being reported. The query race prints measured means from 40 real trials per width and the page volunteers that the gap "looks modest here" at n=4-6 — a demo grading its own headline down. 78 tests assert exact amplitude identities, half-cancellation to machine zero, and the extra-collision case. Off 10: two of the four listed breaks (Feistel, slide) are cited only, and the interference grid needs a measurement before it does anything. |

| stego-suite | 927cfb2 | 8 | Unusually honest for a stego demo: the Westfeld-Pfitzmann statistic is real (incomplete-gamma Q, degrees of freedom counted from the pairs the carrier actually populates, with the code commenting on why hard-coding 127 would false-positive a limited-palette cover), the chi plot's dof caption is generated from the dof used, and the adaptive-vs-sequential comparison reads its verdict off the two computed pEmbed values through four branches instead of asserting adaptive wins. The detectability curve is a real measured sweep that shows 10%/50% payloads evading and only 100% detected — the demo publishing its own detector's blind spot. LSB and DCT round-trips both extract correctly on live pixels. Held at 8: exhibits 4 and 5 are self-labelled "inspired"/"educational simplification" rather than F5 or WOW, exhibit 6 is prose, and at 39 tests the UI-level dependency-hint and detection-verdict states are asserted only indirectly. |

| stream-ward | 3eec4bc | 9 | Every accept and reject on the page is the genuine hand-written verifier's answer, and I confirmed all six cells: chained rejects truncate/reorder/drop with specific codes (TRUNCATED_STREAM, SEGMENT_AUTH_FAILED with a per-segment explanation naming the sequence number and chain state), naive accepts all three silently and shows the corrupted settlement ledger with the moved and missing lines called out. The scorecard is filled from what the verifier actually reported ("6 of 6 run", nothing pre-written) and the page carries an explicit REAL HERE / MODELLED HERE split. 81 tests, including "rejects a swap of ANY two distinct frames, not just the demo default" and "rejects truncation at EVERY length" — the generalization the demo's single button cannot show. Off 10 for exactly the thing the page admits: exhibit 1's memory ceiling is a model of tracked allocations, not a measured footprint, and the three attacks are fixed presets in the browser. |

| syndrome-drain | 06d7279 | 7 | Exceptionally honest about being a model — "runs no attack, no decoding, no DOOM execution, no random numbers," an inline "idealized √D model" badge on every derived number, and both a computed crossover marker and the paper's full-ISD marker plotted per scheme with an `agree` flag computed rather than asserted. The [7,4] Hamming primer is real GF(2) arithmetic: I flipped bits and the row-by-row H·e parities, the syndrome, and the weight-2 collision partner all recomputed correctly, including the honest "the code says a single flip at position 5" when the true error was weight 2. But the headline exhibit is a curve you drag a slider along; the drain is arithmetic on published constants, nothing is ever decoded, and the √M panel is a deterministic scatter illustrating the bargain rather than measuring it. Only 23 tests for an 803-line UI. |

| syndrome-hints | bee3409 | 9 | The attack genuinely runs: pressing Run executes 15 real Prange/Stern decodes on distinct seeds and reports median work with a p10-p90 spread, median permutations and a "✓ verified" that comes from checking the recovered e — at 0 hints I measured 20.0 bits / 1,450 permutations, at 10 of 11 hints 11.1 bits / 3 permutations. The chart overlays measured dots on modelled curves and says which is which. The scope discipline is the best in this slice: a README table splits the three hint channels into implemented / modelled / cited-only, an in-page ADAPTED badge admits the slider leaks the informative coordinates so "≈ w hints" is this model's best case, and the approximate-hint panel states outright that its discount is "modelled, not executed." Tests include adversarial cases — a contradictory hint never yields solved-but-unverified, and a test asserting the bound does NOT separate the real Level-1 parameter sets. Off 10 because the second hint channel is unexecuted and the attacked instances are n=64 toys, not a real KEM. |

| threshold-decrypt | 92f5d3b | 8 | Real P-256 ElGamal with DKG, Feldman shares and Chaum-Pedersen partials, and the standout is the verifier's per-equation attribution: after injecting the cheating partial I watched P1 fail exactly the two equations the prose predicts (challenge and c1^s = a2·d^c) while g^s = a1·y^c still held, with the narrative explaining why d appears in only one. Recovery genuinely re-runs `checkPartialDecryption` over every selected partial and names the rejected ones rather than trusting the earlier badge, and the code comments show the "unverified vs rejected" distinction was made deliberately so no verdict is printed before it is computed. Held at 8: the cheat is a single canned button (the learner picks neither the cheater nor the modification), exhibit 5's compromise panel is a modelled statement rather than a mounted collusion, and 38 tests is thin for a five-exhibit page — the UI tests assert rendering and locking but not the reject-then-refuse-to-combine path. |

| threshold-mldsa | 751ddb5 | 7 | The honesty is best-in-slice and structural rather than footnoted: the sign button returns "Signature is valid — but this build combined the key to make it. Custody achieved; key-non-reconstruction NOT achieved," with two separate verdict cards and a sentence stating both describe the same run. Disabling the phone produces a real single-share attempt the unmodified FIPS 204 verifier really rejects, the additive share combiner operates on live bytes of the genuine ML-DSA-65 key, and tests explicitly guard against regressions ("carries NO fabricated MPC byte counts", "benchmark reports only measured wall-clock time"). It stops at 7 for the reason it states itself: the thing in the title is not implemented. The round walkthrough is choreography on toy mod-97 polynomials that does not produce the emitted signature, so the learner never sees a threshold signature made, only split custody plus a research table. |

| timing-oracle | 675ccca | 8 | The verdict layer is the model other timing demos should copy: every panel computes a relative gap from live `performance.now()` samples and prints either "Leak detected" with the measured percentage or "Signal below noise this run" with why — and in my headless run it did both honestly (string compare 67% leak, HMAC slope leak, RSA and cache both correctly inconclusive rather than claiming a win the timer could not resolve). The deterministic mechanism animations are exact instruction counts, not the clock: 20 vs 25 byte checks with the bail-out named, and 5 multiplies for 5 one-bits with a test asserting the naive multiply count equals the Hamming weight. Caveats about JS not being constant-time at engine level are inline, not footnoted. Held at 8: the learner measures and compares but never mounts the recovery — no panel walks the oracle to extract the secret byte by byte, which is the payoff a timing-oracle demo owes. |

| timing-sidechannel | e6315e2 | 9 | The learner mounts the real recovery and it works: on the operation-count channel the attack extracted a random 12-character secret ("pwquycgxz1m-") the attack code never sees, position by position, printing a computed 6.2σ separation and the byte counts behind it; retargeted at the constant-time comparator the same attack collapses to chance and says so. On the live `performance.now()` channel in headless chromium it honestly returned "Partial recovery — 0/12 ... timer noise derailed the rest this run. The leak is real," which is the correct verdict rather than a claimed win. Two disclosures stand out: that a bare early-exit compare does not leak its last byte and this oracle appends a sentinel to make it do so, and that the timed comparators wrap each byte in a mixing loop to clear the coarse timer. Tests assert full recovery, recovery under sub-signal noise, failure against constant-time, and that full recovery reads as an alarm rather than a success. Off 10 because the headline result is reliably reachable only on the modelled channel. |

| traitor-trace | 6d5b179 | 9 | The strongest demo in this slice. Revoking #7+#12 recomputes a real SD cover (2 wraps vs CS 6 vs naive 14, "0 keys reissued"), all sixteen decoders run genuine AES-GCM against the real ciphertext, and the tracer binary-searches with visible dud/real probe vectors — six probes named #12 and the page then cross-checks its own accusation against ground truth ("CORRECT — you did copy #12's keys"). Crypto result and security verdict are separate everywhere: the pirate box shows "AES-GCM ✓ opened" beside "✗ BREACH". Best of all it demonstrates its own limit rather than describing it — the evasive coalition run blamed 9 different subscribers over 25 seeded traces and reported "FALSE ACCUSATION — 16 of 25 runs blamed a subscriber whose keys are NOT in the box," reproducible from a seed link, with a box's-eye panel showing the entry asymmetry that makes probe detection possible and why a lone box has nothing to compare. e2e specs assert the header numbers, the breach-accuse-die sequence and the histogram's seed reproducibility. Off 10 only because what the full NNL procedure does about the coalition case is told, not run. |

| vdf | fb54d03 | 8 | Everything cryptographic is live and the cost claim is arithmetic on real counters: 2,048 sequential squarings vs 377 mod-N verify operations, printed as "≈ 5× cheaper" — an honest small number at toy T rather than a borrowed asymptotic. Both tamper buttons flip a real bit and the Wesolowski identity genuinely fails ("π^ℓ · x^r ≡ y failed — Rejected"), and the trapdoor path is isolated in its own module, never wired into eval or verify, and produces byte-identical y with no delay, making the unknown-order assumption concrete. Docked to 8 for one exhibit that is exactly the fleet's banned pattern: "Try 4 parallel workers" is four CSS lanes animating to the same width with a hardcoded note that the step count is unchanged — the load-bearing claim (parallelism cannot shorten the chain) is the one thing on the page asserted rather than computed. 11 tests is thin, with no coverage of the tamper or trapdoor UI states. |

| vigenere-break | 858b405 | 9 | Every number is measured from the ciphertext in front of you and the failure paths are the best part. The full break recovered LEMON and the Declaration text, with the "Cipher broken" verdict derived from computed English-quality signals (word-hit 57%, bigrams 94%, IoC 0.0747, combined 98%). Forcing the wrong key length L=7 produced NLEKNLU, gibberish plaintext, and an honest "Not English yet — one or more columns are off" at 14% combined; a 12-letter ciphertext produced "No repeated substrings of length ≥ 3 — Kasiski yields nothing here" and "No period produces an English-like IoC ... inconclusive." The Kasiski panel even warns that factors 2 and 3 divide every spacing so they always score highest — a demo arguing against its own strongest-looking evidence. 72 tests. Off 10: the corpus and scoring are English-only by construction, and autokey/running-key variants are named as future work rather than shown to resist this attack. |

| vss-gate | 6fb7754 | 8 | The verification is real and legible at two scales at once: the 2048-bit table prints per-participant LHS `g^y` against RHS `∏C_j^(i^j)` and only P2's row fails when the cheating dealer is on, while the mirrored p=2039 panel shows the same check digit by digit (1998 ≠ 1519, with the prose naming that P2's share was bumped to 27 when the committed curve forces f(2)=26). Pedersen's hiding is demonstrated rather than asserted — one published commitment opened to several different secrets, each with its own r — and the page volunteers that its `h` is derived from `g` so `log_g(h)` may be known. Held at 8 because the interactive surface is narrower than the honesty: three fixed Run buttons, tamper limited to a +1 flip on a chosen participant, and the comparison step is a static table. 30 tests cover the crypto module well but a 1,457-line main.ts has no unit or e2e behavior coverage beyond the a11y sweep. |

| world-ciphers | 1779dc0 | 8 | The page opens by proving itself: 7/7 official vectors (RFC 3713, RFC 5794, GB/T 32907-2016, GOST R 34.12-2015) encrypted live in the browser and byte-compared, re-runnable, and gating `npm test`. Avalanche is genuinely measured and learner-driven across cipher and bit — I got "63 of 128 ciphertext bits changed (49.2%)" with the flipped cells highlighted. The SM4 exhibit animates the real 32-round pipeline over the live state you just encrypted and labels the one non-claim honestly ("the stage highlighting is illustrative timing, not a claim about gate-level latency"), and the ECB penguin is a real client-side image encryption, not a stock picture. Held at 8 because nothing adversarial ever happens: the only failure shown is a mode failure (ECB structure leak), no cipher is attacked or distinguished, the Kuznyechik S-box controversy that motivates the whole comparison is prose and citations, and 15 tests cover the vectors but none of the eight exhibits' states. |

## What would raise it

### shor
- Make the RSA Impact bars computed from the live L → qubit/gate formulas rather than a prose-anchored static table.
- Add a break-it interaction: let the learner force a bad base (a with gcd>1, or one with odd r) and watch the retry logic reject it, rather than waiting for chance.
- Surface the off-peak phasor cancel state by default once per run so the contrast is guaranteed seen.

### signed-bytes
- Let the learner pick the sandbox's meaning-equality parser policy (first-wins vs last-wins) instead of fixing last-wins, making the parser-differential explorable in the sandbox too.
- Make the guided walkthrough's gateway re-serialization editable so the learner authors the in-transit mutation.

### simon-period
- Implement one of the two cited-only breaks (3-round Feistel distinguisher is the cheaper) so the "what this breaks" list is fully live.
- Let the learner hand-enter a candidate period and watch the whole-domain verifier reject it, making the Las Vegas caveat learner-driven rather than narrated.
- Pre-populate the interference grid on load so the cancellation exhibit is not gated behind pressing Measure.

### stego-suite
- Add a second, stronger detector (RS or SPA) so the adaptive-vs-sequential contrast has a test that can actually separate them — right now the page's own verdict is "the crude global test is blind here."
- Implement quantized-DCT embedding through an actual JPEG re-encode so exhibit 4's "a change JPEG keeps" claim is demonstrated rather than stated.
- Assert the detection verdict strings and the dependency-hint states in the test suite, not just the numeric statistic.

### stream-ward
- Let the learner choose which segments to swap/drop/truncate-at in the browser, so the "ANY two frames" generality the tests prove is reachable from the page.
- Measure something real for exhibit 1 (e.g. `performance.memory` or an actual large-Blob decrypt) even at a small scale, so the memory story is not the page's one modelled claim.

### syndrome-drain
- Run an actual toy DOOM: give the learner M syndromes of a small random code, let them run a real list-matching search, and plot measured work against M so the √M discount is measured rather than illustrated.
- Extend the Hamming primer into a decode-one-out-of-many mini-exhibit — the same seven-bit code with M targets — bridging the concrete half to the asymptotic half.
- Grow the test suite past the model functions to cover the chart/meter/verdict rendering states.

### syndrome-hints
- Execute the approximate/subblock-weight channel too (even at toy size) so the second panel stops being the page's one modelled claim.
- Offer a non-informative leakage mode (hints on random coordinates, not just support) so the learner can watch the "≈ w hints" bound degrade and see why the ADAPTED badge is there.
- Push one run to a parameter set large enough that the exponential wall is felt as wall-clock time, not just as a plotted exponent.

### threshold-decrypt
- Let the learner choose which party cheats and how (alter d, alter s, replay another party's proof) so the three-equation panel becomes an explorable truth table rather than one scripted outcome.
- Make exhibit 5 mount the collusion it describes: hand t-1 shares to the learner and show the recovered secret still ranging over the whole group.
- Add a UI test for the path where a rejected partial is selected and recovery refuses by name.

### threshold-mldsa
- Implement one real never-combine path end to end, even at toy lattice parameters with a custom verifier, so the ideal animation becomes an executed protocol rather than a played sequence.
- Failing that, make the toy walkthrough emit a toy signature a toy verifier checks — the learner would then have caused an actual threshold signature at some scale.
- Let the learner corrupt one party's z-share and watch the norm check reject it, adding a break-it path to the choreography.

### timing-oracle
- Add a "recover the secret" button that drives the vulnerable comparator byte by byte off its own measurements and prints the recovered string — the payoff the four measurement panels currently set up but never deliver.
- Give the RSA and cache panels a sample-count knob so a learner can push past the inconclusive verdict rather than only reading it.

### timing-sidechannel
- Make the live-timer channel reach full recovery on a default modern browser (SharedArrayBuffer clock, or batching enough repetitions per candidate), so the marquee result does not depend on the modelled channel.
- Correct the per-position explanation's "(expected when the target is constant-time)" parenthetical, which fires on low confidence even when the target is the vulnerable comparator and the real cause is timer coarseness.
- Add an e2e assertion that a full-recovery run renders as an alarm, matching the unit test that already checks it.

### traitor-trace
- Implement the full NNL tracing procedure (subset-splitting on the failed subset) so the exhibit that ends in false accusations can be followed by the fix actually running.
- Let the learner set the evasive box's coin bias and watch the false-accusation rate move, turning the histogram from one scripted parameterization into an explorable curve.

### vdf
- Make the parallelism exhibit real: actually spawn 4 Web Workers, let them try to split the chain, and print their measured wall-clock time next to the single-threaded one. Right now the page's central "no shortcut" claim is the only uncomputed thing on it.
- Add a T slider large enough that the eval-vs-verify gap is felt, and show the ratio growing with T.
- Test the tamper-reject and trapdoor-match paths, not just the happy-path proof round-trip.

### vigenere-break
- Add a running-key/autokey mode the same workbench visibly fails against, so the "why a long non-repeating key wins" lesson is demonstrated rather than deferred to the OTP demo.
- Offer a second plaintext language with its own frequency table, making the "frequency analysis assumes a known language" caveat something the learner can trip.

### vss-gate
- Turn the demo-integrity note into an exhibit: since `log_g(h)` is knowable here, let the learner use it to forge a Pedersen opening and watch binding actually break. That is a real attack the current build is one function away from.
- Let the learner type the tampered share value (or tamper a commitment instead of a share) rather than only toggling a fixed flip.
- Add behavior e2e specs asserting the verified/failed row states — the crypto module is well tested, the page is not.

### world-ciphers
- Give the learner something to break: a round-reduced variant of one cipher with a mountable distinguisher, so "more rounds = larger security margin" is demonstrated rather than tabulated.
- Make the Kuznyechik S-box controversy concrete — show the Biryukov-Perrin-Udovenko decomposition acting on the real S-box next to a random one, instead of citing the papers.
- Assert exhibit states (avalanche percentage bounds, ECB block repetition, SM4 round count) in the test suite.
