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

## What would raise it

### shor
- Make the RSA Impact bars computed from the live L → qubit/gate formulas rather than a prose-anchored static table.
- Add a break-it interaction: let the learner force a bad base (a with gcd>1, or one with odd r) and watch the retry logic reject it, rather than waiting for chance.
- Surface the off-peak phasor cancel state by default once per run so the contrast is guaranteed seen.

### signed-bytes
- Let the learner pick the sandbox's meaning-equality parser policy (first-wins vs last-wins) instead of fixing last-wins, making the parser-differential explorable in the sandbox too.
- Make the guided walkthrough's gateway re-serialization editable so the learner authors the in-transit mutation.
