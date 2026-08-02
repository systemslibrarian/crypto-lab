
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
