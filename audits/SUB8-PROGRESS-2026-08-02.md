
## Sub-8 improvement pass — 2026-08-02 (agent 1 of 5)

All three verified by the coordinator: HEAD matches, nothing unpushed, working trees clean,
gates re-run independently.

- **paillier-gate** 7 -> clears 8 (`688e6c9`). Built the malleability attack the README
  named: ballots carry HMAC-SHA256 tags, the attacker multiplies an encrypted boost into
  another voter's ciphertext using the public key alone (enforced by `forgeBallot()`'s
  signature), and the Encrypt-then-MAC toggle re-derives the tag and drops the forgery.
  Added real Pollard rho (Brent) factoring in a worker under a step budget — 64-bit N
  splits and rebuilds lambda, 192-bit exhausts the budget and prints the steps and
  milliseconds actually burned. Decryption is now stepped on the live ciphertext.
  Scenarios A and B differentiated (confidentiality vs integrity). tsc, 60 unit tests,
  extended `verify`, build, 9 Playwright. An existing a11y spec pinned the old election
  copy and was updated deliberately.
- **padding-oracle** 7 -> clears 8 (`6787f0d`, `f93e5b3`). Added the oracle-mode toggle
  (leaky / silent / Encrypt-then-MAC) so the SAME `recoverBlock()` runs against all three;
  silent still does the real decrypt and padding check but answers constantly, EtM verifies
  a real HMAC before decrypting. Failure is genuine: 256 probes exhausted, 0 of 16 bytes.
  Panel 3 target is learner-typed; Panel 1 is a predict-then-check exercise. New blocking
  `e2e/attack.spec.ts`. Also found and fixed a real a11y defect: `.btn--attack` used
  `--color-invalid` at 4.07:1 on `--color-bg-3`, failing axe once an enabled attack button
  sat on a panel surface — token fixed, nothing suppressed.
- **shamir-vs-frost** 7 -> clears 8 (`3870f61`). `soloForgeAttempt()` hands the attacker a
  real secret share and their own nonces; every `verified` field is `ed25519.verify()`'s
  answer on real 64 bytes. Sign-below-k and reconstruct-below-k are both enabled and show
  what actually came back. Risk scenario 3 runs instead of describing. New blocking
  `e2e/exhibits.spec.ts`. Coordinator mutation check: inverting `verifySignature` fails
  5 of 8 browser tests, so the assertions have teeth.

## Post-fix re-score — the audit that caught a bad fix (2026-08-02)

Twelve repos fixed earlier today were re-scored by driving the pages, not reading diffs.
Results: `hqc-timing-break` 8->9, `scloud-vault` 8->9, `mpcith-sign` 7->8, `pairing-gate`
7->8; six held; and one outright failure.

**`hqc-timing`: the fix never reached the browser.** The recalibration set Borderline to
noise 50 and "Too noisy" to noise 120, but `#noise` was `max="12"`, so applyPreset wrote a
value the browser clamped straight back to 12 — the exact value the recalibration existed
to move away from. Driven live, both presets still recovered 32/32. The 30 unit tests
passed because they call the engine with the PRESETS constants and never touch the DOM, so
the suite certified behaviour the page could not reach. Repaired in `77d804c`: slider
ranges now come from a shared `CONTROL_RANGES` constant the markup renders from, a unit
test asserts every preset fits its control (restoring max 12 fails it), and a browser spec
drives the chips, checks the applied values are unclamped, and re-runs "Too noisy" over six
fresh secrets.

**`harvest-timeline`: my fix re-introduced a smaller version of the same defect.** The
headline fell through to "no row is exposed" whenever exposure did not GROW — including
when exposure is already total, so 3 of 20 combinations printed it over a table reading
620 TB / 100% on every row. Worse, the regression could not catch it: it recomputed the
same branch condition and asserted the headline matched that branch, agreeing with the bug
by construction. Fixed in `eba1a70` with a saturated-exposure branch and a test that checks
each claim against the table independently.

Two lessons recorded for the fleet: a unit test that bypasses the DOM can certify behaviour
the page cannot reach; and a regression that mirrors the source's own branch logic proves
nothing.

## Sub-8 improvement pass — agents 4 and 5

- **zk-proof-lab** 7 -> ~8.5 (`d612acb`). Built an Extractor Bench: a real bounded preimage
  search over the published commitments recovers 0 of 5 at the real 16-byte nonce after
  199,998 hashes (reporting the fraction of keyspace covered), while the identical attacker
  recovers all 5 in 768 hashes against an 8-bit nonce — only the nonce space differs. A
  transcript extractor converges on the 18 proper colourings, never one. Also fixed a real
  a11y defect: light-theme `--err` was 4.48:1, under the AA floor, never exercised because
  no test had driven that path in light theme.
- **hawk** 7 -> ~8.5 (`850945b`). Built a sampler-gap bench putting the discrete-Gaussian
  coset sampler on a real signing path and measuring both against the live key: the
  Gaussian moves four of five structural properties and leaves forgeability untouched,
  because the row it does not move is additivity mod 2 — the lesson computed rather than
  asserted. The agent also corrected its own claim that Int32 polyMul "silently wraps"
  after measuring worst-case headroom. Bundle grew 96->108 kB, flagged rather than
  silently budgeted.
- **harvest-vault** 7 -> ~8/9 (`13c5f64`). Closes "implements no cryptography at all": real
  DH in a 24-bit safe-prime group, HKDF -> AES-256-GCM, a wiretap copy holding only what a
  passive observer sees, and a real Ring-LWE KEM for the upgrade leg. Pre-upgrade captures
  come back byte-identical; post-upgrade ones fail because AES-GCM rejects a key derived
  from half the material — not because the attacker gave up.
- **blind-oracle** 7 -> clears 8 (`0cb0561`). Option 1 (client-side evaluation) proved
  impossible: Zama's browser TFHE-rs build exposes keygen/encrypt/decrypt and no evaluation
  ops at all. Took Option 2 properly — degraded mode, a mocked-server e2e that must notice
  a wrong sum, and a real DGHV multiply bench where the third multiplication genuinely
  breaks correctness. Also fixed COOP/COEP on preview, without which boot dead-ended at the
  SharedArrayBuffer check, which is why nothing past boot had ever been tested.

**Catalog decision awaiting the maintainer:** harvest-vault and harvest-timeline share
Mosca's inequality. Neither was merged or deleted. After this work they are complementary
(Vault: in-flight capture is unfixable; Timeline: at-rest re-keying is fixable). The agent
recommends keeping both cards and tightening the two `project-copy` lines in `index.html`
to name that split — deliberately not done, since editing index.html triggers the
README/corpus/concept regeneration workflow.

## 8 -> 9 pass: hybrid playgrounds and named missing exhibits (2026-08-02)

All eight verified by the coordinator: HEADs match, nothing unpushed, trees clean. The
hybrid-pqc mutation claim was re-run independently and reproduced exactly (inverting
`verify()` in `attemptForgery` fails 12 tests).

**The four hybrid-* playgrounds** — every security headline was a truth table over
checkboxes; each is now the outcome of a real attempt at full parameters.
- `hybrid-guide` (`16795c3`): the attacker gets only the broken halves' secrets plus the
  public transcript, derives candidate keys through the real combiner, and the AES-GCM tag
  is the only oracle. "Secure" now means attempts failed AND there was entropy to guess.
- `hybrid-pqc` (`789ce9b`): six badges, the forgery line, the anatomy rows and all 12
  survival-matrix cells were an if-chain over flags. Now 12 real recoveries and 12 real
  forgeries, each cell carrying its receipts. The old flag logic survives as a *prediction*
  with a test asserting the computed cells reproduce it.
- `hybrid-sign` (`cb1023d`): the forged message was a hard-coded constant with an empty
  context; it now forges over the learner's actual message and context, so the ctx binding
  is exercised, and re-signs honestly each run to prove a rejection is the forgery failing
  rather than the harness.
- `hybrid-wire` (`be3135a`): `evaluateResilience(bool, bool)` was a pure truth table;
  reconstruction now runs the real combiner and tries to open a record.

**Four named missing exhibits built** — each page named something it never let the learner
cause.
- `iron-letter` (`0809a45`): active MITM — Eve substitutes her key, the two 32-byte secrets
  are byte-compared, her AES-GCM open really recovers the plaintext, and the ECDSA
  authentication step is computed on unauthenticated runs (labelled as the check Alice
  skipped) and acted on when enabled, with a control proving the check can pass.
- `key-exchange` (`694d6ad`): Eve decrypts, rewrites, re-encrypts, and Bob's tag verifies;
  authenticated variant aborts. Honest scale note: the DH value is sub-5-bit, so Eve's
  advantage is the substitution, not key size.
- `nonce-collision` (`9e1d7ed`): the "why" panel was CSS; it now recovers the mask from each
  tag separately and byte-compares the recomputed relation against this run's values.
- `model-breach` (`1e23782`): the "the browser never runs this algorithm" column now runs
  it — real differential over AESL, DDT-solved S-boxes, the paper's Theorem 1 enumeration,
  and a verified reproduction of beta. The agent honestly flags this as the least certain
  of the four to clear 9, since two panels remain prose.

Residual honesty item the agent deliberately did NOT paper over: in all four hybrids, the
*event* of an algorithm being broken is still modelled by handing the attacker the genuine
secret. Every page says so; what changed is that everything downstream is now run.

## Slice 7 (the 10 repos an accounting error had skipped) and its two serious findings

Scores: dp-noise 9, frodo-vault 8, kyber-vault 8, ntru-classic 8, pake-gate 7->8,
protocol-compose 8, spdz-forge 9, time-trust 9, and two new lows the coordinator fixed:

- **`lll-break` 6 -> fixed (`8908211`).** The verdict was
  `ok && recoverMethod === 'short-vector'` and never consulted the exact-match comparison
  computed fourteen lines below it. `ok` is a sigma-scaled residual check, so above roughly
  sigma 5 an arbitrary short vector passes and the page printed "SUCCESS - secret read off a
  reduced short vector" over a vector unrelated to the secret, then labelled that vector
  "close". Reproduced in 4 of 4 configurations. The demo's own Challenge 5 steers learners
  into exactly that regime and promises a FAILED verdict they never saw. The confidence
  meter compounded it, reading 100% whenever the norm gap was at or under 1 — precisely
  where an unrelated short vector appears. SUCCESS now requires the byte comparison; the
  actual secret is printed beside the recovered one; a browser regression sweeps sigma 5, 7,
  9, 10 and fails if SUCCESS ever appears without EXACT MATCH.
- **`time-lock-puzzle` 6 -> fixed (`55ee200`).** The calibration loop's accumulated value
  was dead after the timed loop, so the bundler removed the squarings it existed to measure:
  14.5 BILLION squarings/sec in the built page against the Solve tab's own 640 thousand, and
  every t from 1e6 to 1e10 rendering "<1s" — in a demo whose whole subject is elapsed time.
  A module-level sink was NOT enough (nothing imported it, so tree-shaking removed the
  writes and the rate stayed at 14.5 billion); a property on globalThis fixed it. Measured
  in the built page: ~4 million/sec, a 3,600x correction landing in the same range as the
  Solve counter.

Method note worth keeping: on these repos the browser tests serve `dist/`, so a mutation
check that breaks `tsc` silently proves nothing — the build fails, the old bundle is served,
and the tests pass. This bit twice today. Always confirm the build succeeded during a
mutation, and prefer type-safe mutations.

## Remaining batches (all verified pushed, trees clean)

- **Missing exhibits A** — `aes-modes` (`a969ee1`, GCM forbidden attack: recovers H, forges,
  and real WebCrypto AES-GCM accepts it), `ed25519-forge` (`13dc870`, live P-256 nonce-reuse
  key recovery as the missing contrast), `frost-threshold` (`3347689`, both named attacks
  live, one ending in acceptance and one in real-verifier rejection), `format-ward`
  (`f277adf`, honest small-domain codebook recovery; the Beyne 2^23 attack is cited and
  computed as infeasible rather than faked — the agent also verified no cheap exact
  structural distinguisher exists).
- **pq-families / merkle-vault / lwe-hints** — `e6a5987`, `39574ba`, `a7f7874`. Found and
  fixed two real bugs along the way: pq-families' "bad basis" preset had determinant zero (a
  line, not a lattice) so reduction drove it to the zero vector, which the new trace would
  have announced as a shortest non-zero vector; and lwe-hints' first KS implementation
  mishandled ties, inflating D and rejecting good Gaussians 45-85% of the time. Also a
  counterpart note in `merkle-proofs` (`a422d7c`).
- **syndrome-drain / threshold-mldsa / world-hashes** — `195caf3`, `b11a309`, `dacc135`.
  threshold-mldsa is the biggest jump: a real module-SIS threshold signature where the share
  lives in a closure and the sum is never formed, with a structural test proving it.

**Catalog decisions still awaiting the maintainer:** the harvest-vault/harvest-timeline
split; the merkle-vault/merkle-proofs overlap (the agent calls it the single highest-value
consolidation in the portfolio); and a copy pass over the pq-families, merkle-vault and
lwe-hints cards plus corpus entries, which now understate all three.
