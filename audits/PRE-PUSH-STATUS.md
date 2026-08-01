# Pre-push status — unpushed commit batch

Measured 2026-08-01. Verification only; nothing was pushed, committed, or amended.

Scope: all 176 `crypto-lab-*` repos under `/Users/gmcas/repos/`. Each was
`git fetch`ed first, then measured with `git rev-list --count @{u}..HEAD`.
**33 repos have exactly one unpushed commit. All 33 are 0 behind their upstream**
(`git rev-list --count HEAD..@{u}` = 0 everywhere), so every push is a
fast-forward and no merge is pending.

## Verdict

**32 of 33 are safe to push. 1 carries a pre-existing flaky test.**

Every one of the 33 passed `npm ci`, its test suite, and its build on the first
run. Because a dozen of these commits explicitly touch statistical or randomized
thresholds, the full test suite was run **three times** in each repo to look for
flakes. That third pass is what turned up the one finding below.

---

## NOT clean to push

### crypto-lab-simon-period — flaky test, ~16% failure rate

Commit `e0ff1b6` "Stop claiming an off-orthogonal outcome that cannot happen,
and stop 'predicting' the block already spent on a classical query".

Tests and build pass, but `src/crypto/targets.test.ts` fails intermittently:

```
 FAIL  src/crypto/targets.test.ts > KAT — Kuwakado & Morii 2012: Even-Mansour's period
       is the whitening key > a wrong period does not yield the key — the exploit fails closed
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/crypto/targets.test.ts:85:33
     83|     const t = await makeEvenMansourTarget(5);
     84|     const wrong = (t.truePeriod! ^ 0b00001) & 31;
     85|     expect(t.exploit(wrong).ok).toBe(false);
       |                                 ^

 Test Files  1 failed | 6 passed (7)
      Tests  1 failed | 77 passed (78)
```

Observed rate at HEAD, across repeated runs: 8/40, then 2/25, plus 1 of the 3
full-suite passes — roughly **1 run in 6**.

**This flake is pre-existing, not introduced by the unpushed commit.** The test
already exists verbatim at `HEAD~1`, and an isolated checkout of `HEAD~1`
(`git archive HEAD~1` into a scratch dir, fresh `npm ci`) fails at **8/40** —
statistically identical to HEAD's rate. The commit did modify
`makeEvenMansourTarget().exploit()`, but only to steer the challenge block off
block 0; it did not change the failure rate.

Root cause: `exploit()` validates a guessed period by predicting a **single**
ciphertext block and comparing. At n = 5 the block space is 32 wide, so a wrong
period can coincidentally predict correctly and the exploit reports `ok: true`.
The test asserts a one-shot probabilistic check always fails closed, which it
cannot. The fix is in the test's premise (or in `exploit()` checking more than
one block), not in this commit.

**Recommendation:** pushing is not *wrong* here — the commit is no worse than
what is already deployed — but expect roughly a 1-in-6 chance CI red-lights this
repo and the deploy no-ops. Either re-run CI on failure, or fix the flake in a
follow-up commit before pushing. Nothing about the commit's own content is
broken.

---

## Full results

All 33 repos: `npm ci` clean, tests pass, build passes. `test` is the script
name unless noted. Repos with a separate `typecheck` script had it run as well
(marked in the last column); for the rest, `typecheck` is already folded into
`build` via `tsc` / `tsc --noEmit`.

| Repo | Ahead | Commit | Subject | Test | Build | Scripts used |
|---|---|---|---|---|---|---|
| crypto-lab-bb84 | 1 | f0dde0c | Make step 6 actually test key agreement, and stop overstating the key | PASS (12) | PASS | `test`, `build` |
| crypto-lab-biham-lens | 1 | 2bd5293 | Fix the noise floor and three historical misattributions | PASS (21) | PASS | `typecheck`, `test`, `build` |
| crypto-lab-bitcoin-wallet | 1 | 41ce5a7 | Fix undecodable QR codes, unconditional "checksum broken" claim, prefix-only vectors | PASS (36) | PASS | `test`, `build` |
| crypto-lab-broken-trust | 1 | f85c8d7 | Quote the run's real score and outcome in the snippet, and render it again | PASS (41) | PASS | `test`, `build` |
| crypto-lab-card-trick | 1 | c11d4d3 | Fix falsifiable claims: MKS12 shuffle, Koch citation, GC cost, mirror case | PASS (138) | PASS | `test`, `build` |
| crypto-lab-collision-vault | 1 | 875c8dd | Cite MD5 vectors RFC 1321 actually lists, and measure where states diverge | PASS (77) | PASS | `test`, `build` |
| crypto-lab-curve-lens | 1 | 9114139 | Report the ECDLP search's own answer, not the secret the page kept | PASS (57) | PASS | `test`, `build` |
| crypto-lab-diffie-hellman-mitm | 1 | 017dbac | Fix falsifiable claims in the discrete-log cost figures and protocol notes | PASS (21) | PASS | `test`, `build` |
| crypto-lab-entropy-collapse | 1 | ae958f0 | Show the collapse callout only on runs that collapsed | PASS (34) | PASS | `test`, `build` |
| crypto-lab-fhe-arena | 1 | 8540586 | Describe BFV as scale-invariant, and decrypt instead of asserting correct | PASS (14) | PASS | `test`, `build` |
| crypto-lab-gg20-wallet | 1 | 1478e42 | Implement the Phase-5 checks so the abort verdict comes from the math | PASS (19) | PASS | `typecheck`, `test`, `build` |
| crypto-lab-hawk | 1 | ed7659e | Derive the norm-forgery offset from the key, and fix two flaky thresholds | PASS (4 phases) | PASS | `test` (chains `verify:phase1..4`), `build` |
| crypto-lab-hqc-timing | 1 | c7d1bec | Measure whether a run leaked instead of reading the constant-time flag | PASS (26) | PASS | `test`, `build` |
| crypto-lab-ibe-gate | 1 | 2f5fe1d | Fix false decryption verdicts, name the Type-3 deviation, correct citations | PASS (21) | PASS | `test`, `build` |
| crypto-lab-isogeny-atlas | 1 | c267ea2 | Stop the CGL walk dead-ending, and report bits consumed and forced steps | PASS (58) | PASS | `typecheck`, `test`, `build` |
| crypto-lab-kdf-arena | 1 | 72d9fc0 | Derive the memory-gap captions from the run instead of hardcoding them | PASS (19) | PASS | `test`, `build` |
| crypto-lab-kyberslash | 1 | b1a22cc | Show the fix pq-crystals shipped, and correct the disclosure timeline | PASS (29) | PASS | `test`, `build` |
| crypto-lab-nonce-lattice | 1 | a0e4cba | Make the known-good presets actually recover, and size the LLL cap to the basis | PASS (26) | PASS | `typecheck`, `test`, `build` |
| crypto-lab-opaque-gate | 1 | efa02f5 | Run the breach attacks for real, and fix the RFC 9807 section references | PASS (12) | PASS | `test`, `build` |
| crypto-lab-padding-oracle | 1 | 6974d5e | Check the recovered plaintext, and fix four citations and two mechanisms | PASS (7) | PASS | `test` (`node --test`), `build` |
| crypto-lab-patron-shield | 1 | 4973da9 | Drive the correctness badge and the cancellation grid from the run | PASS (22) | PASS | `test`, `build` |
| crypto-lab-pq-families | 1 | bfa4f31 | Add an exact shortest-vector routine the bounded search cannot miss | PASS (53) | PASS | `test`, `build` |
| crypto-lab-ratchet-wire | 1 | 90367a8 | Derive the break-in recovery verdict, and fix four spec section refs | PASS (60) | PASS | **`test:run`**, `build` |
| crypto-lab-rsa-forge | 1 | eebfc23 | Prove the Bleichenbacher result by re-encrypting before calling it recovered | PASS (43) | PASS | `test`, `build` |
| **crypto-lab-simon-period** | 1 | e0ff1b6 | Stop claiming an off-orthogonal outcome that cannot happen … | **FLAKY (78, ~1 run in 6 fails)** | PASS | `test`, `build` |
| crypto-lab-spdz-forge | 1 | f194a6d | Derive the Beaver break-it verdict from the computation, not from a constant | PASS (58) | PASS | `test`, `build` |
| crypto-lab-stream-ward | 1 | 6f06d75 | Point the chained-construction header comment at the KAT file that exists | PASS (81) | PASS | `test`, `build` |
| crypto-lab-threshold-decrypt | 1 | 16ba9cc | Verify every partial's NIZK on the recovery path, as the README claimed | PASS (38) | PASS | `test`, `build` |
| crypto-lab-threshold-mldsa | 1 | 33d0918 | Replace invented round counts and hardcoded key bytes with real values | PASS (26) | PASS | `test`, `build` |
| crypto-lab-timing-sidechannel | 1 | 4e664e3 | Disclose the two construction choices the recovery depends on | PASS (31) | PASS | `test`, `build` |
| crypto-lab-vrf-gate | 1 | 62ced3d | Fix claims the VRF/VDF page made that its own code did not support | PASS (4 checks) | PASS | **`check`** (no `test` script), `build` |
| crypto-lab-web-of-trust | 1 | 1d5cfa8 | Never treat a revoked key as valid, whoever else certified it | PASS (24) | PASS | `test`, `build` |
| crypto-lab-zk-arena | 1 | cddd8c7 | Add a safe parameter set, and show the toy group leaking via Pohlig-Hellman | PASS (81) | PASS | `test`, `build` |

Test counts are assertions passed, taken from the run output. `hawk` and
`vrf-gate` print phase verdicts rather than a count.

## Script-name irregularities confirmed

Read from each `package.json` rather than assumed:

- **crypto-lab-vrf-gate** — no `test` script at all. Used `check`, which chains
  `check:phase1`, `check:phase2`, `check:phase3`, `check:rfc9381`. All four
  passed, including the RFC 9381 known-answer test
  (ECVRF-P256-SHA256-TAI, Example 10).
- **crypto-lab-ratchet-wire** — `test` is bare `vitest` (watch mode, would hang).
  Used `test:run`.
- **crypto-lab-hawk** — `test` chains four `tsx` verify scripts, no test-runner
  count. All four phases printed "verification passed".
- **crypto-lab-padding-oracle** — `test` is bare `node --test`; discovered and
  ran 7 tests.
- Nested `package.json` locations confirmed by search, not assumption:
  - `crypto-lab-biham-lens/demos/biham-lens/`
  - `crypto-lab-collision-vault/demos/collision-vault/`
  - `crypto-lab-ratchet-wire/ratchet-wire/`
  - The other 30 are at repo root. No repo had more than one non-`node_modules`
    `package.json`.

## What was not run, and why

- **`test:a11y` was not run** in any repo, as instructed. It needs Playwright
  browsers and is CI's job. This is the one CI stage this audit does not cover —
  an a11y regression would still surface only in CI.
- **`typecheck` as a standalone script** exists in only 4 repos
  (`biham-lens`, `gg20-wallet`, `isogeny-atlas`, `nonce-lattice`) and passed in
  all 4. In the other 29 CI's `typecheck` step either does not exist or is
  covered by the `tsc` invocation inside `build`, which passed.
- **`lint`** was not run (`collision-vault`, `curve-lens`, `timing-sidechannel`
  have one); it is not in the stated CI chain.
- Nothing was blocked or unmeasurable. All 33 repos completed every stage
  attempted.

## Working-tree state after the audit

All 33 repos are still exactly 1 ahead, 0 behind, with clean tracked trees. Two
repos hold pre-existing **untracked** scratch files that this audit did not
create (timestamped before it ran) and that a push will not carry:

- `crypto-lab-hqc-timing/chatgpt.md`, `crypto-lab-hqc-timing/gem.md`
- `crypto-lab-spdz-forge/chat.md`

Worth deciding whether they belong in `.gitignore` or should be deleted, but
they are not a push blocker.

## Method notes

- `git fetch` was run in all 176 repos before any counting, so ahead/behind is
  measured against fresh remote-tracking refs.
- `npm ci` was run in every repo first — `node_modules/.bin` was empty
  fleet-wide. All 33 installed cleanly off the npm cache in about a second each.
- macOS has no `timeout` binary, so each command ran under a small Perl wrapper
  that forks into its own process group and kills the group after 600s.
  **No command ever hit the timeout** — no hangs, so no watch-mode script was
  accidentally selected.
- Test suites were run three times per repo specifically to surface flakes.
  Runs 1 and 3 were clean across all 33; run 2 caught `simon-period`.
