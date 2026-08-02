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
