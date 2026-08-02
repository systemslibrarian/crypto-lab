
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
