# Crypto Lab audit corpus — MPC & THRESHOLD

Generated 2026-11-08T20:20:28.593Z from 4 lab record(s).

Every finding must cite **commit_sha + lab slug + field**. A field printed as
`MISSING` was not found by the generator; it is not a claim that the lab lacks it.

---
## Shamir vs FROST

- **slug**: `crypto-lab-shamir-vs-frost`
- **repo**: https://github.com/systemslibrarian/crypto-lab-shamir-vs-frost
- **live**: https://systemslibrarian.github.io/crypto-lab-shamir-vs-frost/
- **commit_sha**: `df7522815b0fad17216c7ba131f1bfa09774aa1e` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: #7b5ea7
- **MISSING FIELDS**: claims, mutations, verification, limitations

**Name (H1)**: Shamir vs FROST  — _read from src/main.ts_

**Subtitle**: Secret Sharing · Threshold Signatures  — _read from src/main.ts_

**Description**: Run both schemes side-by-side and watch the key badges diverge: Shamir reassembles the private key in memory to use it, while FROST signs without ever assembling it on any machine.  — _read from src/main.ts_

**Why it matters**: The instant a key is reconstructed, that machine becomes a single point of total compromise. Threshold signing removes that window entirely — the whole reason it now guards custody wallets, root CAs, and validator keys.  — _read from src/main.ts_

**Card copy**: Compare Shamir secret sharing against FROST signatures side by side — watch Shamir reassemble the key in memory while FROST signs without it ever existing. Real GF(256) and Ed25519. No backend.

**Chips**: Shamir SSS · FROST · Ed25519 · GF(256)

**Implements**: Ed25519 `src/frost/verify.ts:14`, FROST `src/frost/round2.ts:84`, HMAC `src/ui/shamir-panel.ts:542`, SHA-256 `src/ui/shamir-panel.ts:542`, SHA-512 `src/frost/keygen.ts:14`, Shamir secret sharing `src/frost/field.ts:80`

**Attacks shown**: Key recovery `src/ui/decision-guide.ts:22`, Nonce reuse `src/ui/adaptive-research.ts:17`

**Comment-only (named in code comments, not executed)**: AES `src/shamir/gf256.ts:1`, Dilithium `src/ui/decision-guide.ts:2`, Kyber `src/ui/decision-guide.ts:2`, Pedersen commitment `src/frost/keygen.ts:2`, Schnorr `src/frost/verify.ts:7`

**References**: Schnorr, X25519

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `CRYPTO 2025` — first seen src/ui/adaptive-research.ts:11 (1×)
- `eprint.iacr.org/2025/1061` — first seen README.md:99 (2×)
- `eprint.iacr.org/2026/2126` — first seen README.md:99 (2×)
- `eprint.iacr.org/2026/2203` — first seen README.md:99 (2×)
- `eprint.iacr.org/2026/2554` — first seen README.md:99 (2×)
- `FIPS 203` — first seen README.md:91 (1×)
- `RFC 8032` — first seen README.md:72 (3×)
- `RFC 9591` — first seen README.md:5 (11×)

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Threshold Lab — Shamir vs FROST

## What It Is

Threshold Lab is a side-by-side interactive browser demo comparing Shamir's Secret Sharing (SSS) and FROST threshold signatures (FROST-Ed25519-SHA512, following RFC 9591 but not a conformant implementation of it — see [Deviations from RFC 9591](#deviations-from-rfc-9591)). Shamir SSS splits a secret into _n_ shares using polynomial interpolation over GF(256), requiring any _k_ shares to reconstruct the original — but reconstruction assembles the full secret in memory before it can be used. FROST (Flexible Round-Optimized Schnorr Threshold) distributes an Ed25519 signing key across _n_ participants so that any _k_ can co-sign a message in two rounds _without the private key ever existing on any single machine_. The demo uses real cryptographic primitives: hand-rolled GF(256) Shamir, real two-round FROST signing over the Ed25519 scalar field via `@noble/curves`, and SubtleCrypto HMAC-SHA256 — no simulation, no backend. The FROST signing is real arithmetic producing a real Ed25519 signature, but it is a teaching implementation with documented simplifications, not a drop-in RFC 9591 library.

The demo is built to teach both mechanisms, not just assert them:

- **Shamir "why exactly _k_?" interpolation view.** As you select shares, a live view fans out infinitely many degree-(_k_−1) curves through _k_−1 points (the secret at _x_=0 could be anything → perfect secrecy), then snaps to the single curve that fits once you reach _k_ points (the secret is pinned down). The curves are real polynomials evaluated over the reals — an honest illustration of the Lagrange-interpolation theorem that governs the GF(256) implementation, kept separate from the actual share bytes shown alongside.
- **FROST aggregation view.** On Sign, each selected participant emits a partial-signature chip _z_i_ computed from only their own share, and a running sum accumulates them into the single 64-byte aggregate — making "_k_ partials add up, no share ever meets another, the key is never assembled" visible rather than a black-box "valid" badge.
- **Inline glossary.** First uses of _threshold (k of n)_, _nonce_, _commitment_, _hiding nonce_, _Lagrange coefficient_, _binding factor_, _partial signature_, and _DKG_ carry dotted-underline tooltips (hover/focus/tap) so the deeper layers don't assume vocabulary the top-level story hasn't introduced.
- **Progressive disclosure.** The interactive head-to-head comes first; the full seven-dimension comparison table follows it, collapsed to the three load-bearing rows with a "show all dimensions" expander — the summary you read _after_ building intuition, not the opening wall of jargon.

## When to Use It

- **Seed phrase / key escrow backup (use Shamir):** When you need to recover a static secret — a BIP-39 mnemonic, an encryption key, a root credential — and recovery is the goal, not ongoing signing. Shamir is simple and offline-friendly; the reconstruction window is the accepted trade-off.
- **Threshold signing without key assembly (use FROST):** When multiple parties must authorize transactions or signatures and the private key must never exist on any single machine. Ideal for hot wallets, distributed signing services, and HSM replacement.
- **Teaching the distinction between "split and reassemble" vs "compute without assembling" (use this demo):** Shamir and FROST are frequently conflated; this side-by-side walkthrough makes the architectural difference visceral.
- **Risk scenario modeling:** Use the interactive compromise cards to reason about what an adversary gains if a share is stolen before vs during reconstruction, or if a FROST participant is compromised mid-signing.
- **Do NOT use Shamir for ongoing signing:** If you need to sign frequently, the repeated reconstruction window is an unacceptable attack surface. Use FROST or a hardware key instead.

## Deviations from RFC 9591

The FROST panel runs genuine two-round threshold Schnorr arithmetic and emits a signature that
verifies as a standard Ed25519 signature. It is nonetheless a **teaching implementation, not a
conformant RFC 9591 (FROST-Ed25519-SHA512-v1) one.** Two documented simplifications:

- **The binding factor is simplified.** `src/frost/round2.ts` computes
  `ρ_i = H(i ‖ encoded_commitments ‖ message) mod l` with a bare SHA-512. RFC 9591 derives
  binding factors through its `H1` domain-separated hash, which prefixes a ciphersuite
  ContextString and hashes the message digest rather than the raw message. The code comment says
  so; this README previously did not. Binding factors from this demo will not match a conformant
  implementation, so it does not interoperate with one.
- **Keys come from a trusted dealer, not a DKG.** `src/frost/keygen.ts` generates the group secret
  in one place and splits it, so the key does exist on one machine at setup time. The
  *never-reconstructed* property the demo teaches holds for **signing**, which is the point being
  made — but a production deployment would use distributed key generation so no single machine
  ever holds the whole key at any moment.

Both are deliberate: they keep the mechanism legible. Neither is safe to carry into production
code. Use a maintained RFC 9591 implementation for anything real.

## Live Demo

[https://systemslibrarian.github.io/crypto-lab-shamir-vs-frost/](https://systemslibrarian.github.io/crypto-lab-shamir-vs-frost/)

Walk through both protocols side-by-side using the same logical key material. On the Shamir panel, set _n_ (total shares) and _k_ (threshold), split a secret, then select shares one at a time and watch the interpolation view go from a fan of undetermined curves (below _k_) to a single locked curve that reveals the secret (at _k_) — the "Private key in memory" badge flips to amber the moment the secret is assembled. On the FROST panel, distribute shares, generate Round 1 commitments, select _k_ participants, and sign — the partial signatures animate into one aggregate while the "Key never reconstructed" badge stays green throughout. Three interactive risk scenarios show what an attacker gains at each stage of each protocol.

**The failure paths are runnable, not described.** Both panels deliberately leave the sub-threshold button enabled, because disabling it would hide the property the page argues for:

- **Sign with _k_−1 participants anyway.** The identical Round 2 code produces a well-formed 64-byte Ed25519 signature — the arithmetic never complains — and `ed25519.verify()` against the group public key returns false. Add the missing signer and the same path verifies. _k_ is not a policy check; it is the number of points needed to interpolate the group secret at _x_=0.
- **Reconstruct Shamir below _k_ anyway.** Lagrange interpolation always returns bytes. The panel prints exactly what came back and compares it byte-for-byte with the secret that was split: no match, and nothing in the returned bytes says so. That indistinguishability *is* the perfect-secrecy claim.
- **Compromise a participant for real.** The attacker is handed a participant's genuine secret share, generates their own nonces, runs Round 2, and the resulting signature goes to the same verifier — which rejects it. The risk card then has an honest _k_-quorum (including the compromised participant) sign the same message and shows that verifier returning true. Both verdicts are computed in the browser.


## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-shamir-vs-frost
cd crypto-lab-shamir-vs-frost
npm install
npm run dev
`​``

To run the test suite (GF256 arithmetic, Shamir round-trips, FROST signing and verification,
sub-threshold signing and the solo-forgery attempt):

`​``bash
npm test
`​``

The suite includes the pure-Ed25519 signature vector in RFC 8032 §7.1 and
malformed-input rejection controls. Native WebCrypto independently verifies a
real threshold aggregate and rejects an aggregate with a corrupted partial
signature, alongside the lab's Noble-backed verifier. These checks do not make
the simplified binding-factor construction RFC 9591 conformant.

The browser gate runs the WCAG A/AA scan **and** functional assertions on the exhibits —
the key badges, the partial-sum aggregation, and the real Ed25519 verification result on both
the success and the failure path:

`​``bash
npx playwright install chromium
npm run test:a11y
`​``

No environment variables required. Everything runs in the browser with no backend.

## Part of the Crypto-Lab Suite

One of 170+ live browser demos at [crypto-lab.systemslibrarian.dev](https://crypto-lab.systemslibrarian.dev/) — spanning Atbash (600 BCE) through NIST FIPS 203/204/205 (2024).

---

*"Whether you eat or drink, or whatever you do, do all to the glory of God." — 1 Corinthians 10:31*

## Adaptive-corruption research context

The live demo includes an **Adaptive corruption** section with dated primary sources, the `T=t+1` notation conversion, baseline and large-roster examples, and explicit proof/attack/executable-demo boundaries. A valid signature or failed single-share forgery is not an adaptive-security proof. See [the 2025 proof](https://eprint.iacr.org/2025/1061), [the September 2026 attack preprint](https://eprint.iacr.org/2026/2126), [the contextualization preprint](https://eprint.iacr.org/2026/2203), and [Bacho's October 2026 follow-up](https://eprint.iacr.org/2026/2554) (approved 20 October; preprint). The follow-up reports a concrete LDVR attack with 488 signers and 173 corruptions for canonical Curve25519 evaluation points. Separately, it measures a successful subset search with 228 signers and 114 corruptions when evaluation points are adversarially chosen. The latter measurement is not an end-to-end compromise of this browser demo. This addition does not change the signing engine or nonce/binding controls.

```

</details>

---

## Reshare Circle

- **slug**: `crypto-lab-reshare-circle`
- **repo**: https://github.com/systemslibrarian/crypto-lab-reshare-circle
- **live**: https://systemslibrarian.github.io/crypto-lab-reshare-circle/
- **commit_sha**: `2d19faedc772662272cbaf86301b7bdee0884de6` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: #C2410C
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Reshare Circle  — _read from index.html_

**Subtitle**: Proactive secret sharing · epoch resharing  — _read from index.html_

**Description**: Runs the real HJKY’95 refresh — every party deals a Feldman-verified zero-constant polynomial — so you can inspect the refreshed sharing while the secret and its public key stay byte-identical, then mix epochs and verify the result against the public key.  — _read from index.html_

**Why it matters**: A threshold key can live for decades, and an attacker doesn’t need t shares at once — one custodian this year, another the next, until the quorum is quietly theirs. Proactive resharing resets that clock every epoch, so partial shares from different epochs cannot be pooled, provided old shares are securely erased.  — _read from index.html_

**Card copy**: Refresh threshold shares into a new epoch: every old share becomes garbage, the public key never changes, and the secret is never reconstructed along the way.

**Chips**: Shamir · Feldman VSS · HJKY 1995 · Mobile Adversary

**Implements**: Feldman VSS `src/reuse/vss.ts:228`, Pedersen commitment `src/reuse/vss.ts:261`, Shamir secret sharing `src/reuse/vss.ts:370`

**Attacks shown**: Discrete log `src/ui/intro.ts:24`

**Comment-only (named in code comments, not executed)**: AES `src/reuse/shamir-math.ts:105`, Diffie-Hellman `src/reuse/shamir-math.ts:89`, ElGamal `src/reuse/shamir-math.ts:89`

**References**: FROST, ML-DSA

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `CRYPTO 1995` — first seen README.md:9 (2×)
- `doi.org/10.1007/3-540-44750-4_27` — first seen README.md:9 (1×)
- `RFC 3526` — first seen README.md:16 (11×)

**README — What Can Go Wrong**:

```text
- **No resharing at all** — the mobile adversary's slow collection stays valid forever; three thefts years apart equal one clean quorum (exhibit 3).
- **Old shares not erased** — the epoch turn is cosmetic: the attacker's epoch-1 loot still lies on the epoch-1 polynomial, and enough of it reconstructs.
- **A dealer smuggles a nonzero constant term** — the secret silently shifts and the committee loses its own key (sabotage, not theft). Feldman's D₀ = 1 check exists precisely for this (exhibit 5).
- **A tampered sub-share** — caught receiver-by-receiver by the Feldman check; the demo's tests pin this down per-index.
- **≥ t compromises within a single epoch** — outside the model; no refresh schedule saves you.
- **Trusting the interpolation output** — Lagrange always answers, confidently, even on garbage input. The only honest signal is the separate public-key check (exhibits 3 and 4).
```

**Claims tested** (e2e/claims.spec.ts, 21 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:73
    - :73 `toBeEnabled` expected `{ timeout: 180000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:85
    - :85 `toBeEnabled` expected `{ timeout: 180000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:140
    - :140 `toBeVisible` expected `{ timeout: 120000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:144
    - :144 `toEqual` expected `[]` _(expression)_
- `the epoch turn keeps the secret and Y that the page itself reconstructed` — e2e/claims.spec.ts:151
    - :152 `toContainText` expected _no expected value_ _(none)_
    - :161 `toMatch` expected `SECRET_HEX` _(expression)_
    - :162 `toMatch` expected `SECRET_HEX` _(expression)_
    - :165 `toBe` expected `true` _(expression)_
    - :166 `toBe` expected `true` _(expression)_
    - :170 `toHaveCount` expected `2` _(literal)_
    - :171 `toHaveClass` expected `/chip-ok/` _(regex)_
    - :172 `toContainText` expected `'Byte-identical'` _(literal)_
    - :173 `toHaveClass` expected `/chip-ok/` _(regex)_
    - :174 `toContainText` expected `'Identical (compared in full)'` _(literal)_
    - :189 `toHaveLength` expected `5` _(literal)_
    - :192 `toMatch` expected `/^[ABCDE]$/` _(regex)_
    - :193 `toMatch` expected `/^(true|false)$/` _(regex)_
    - :194 `toBe` expected _no expected value_ _(none)_
    - :203 `toEqual` expected `rows.map((r) => r.cells[2])` _(expression)_
    - :204 `toContainText` expected `'Epoch 2'` _(literal)_
    - :212 `toEqual` expected `rows.map((r) => r.cells[2])` _(expression)_
- `the round-verified counters are the sum of the dealing matrix ticks` — e2e/claims.spec.ts:215
    - :220 `toHaveLength` expected `3` _(literal)_
    - :224 `toHaveCount` expected `5` _(literal)_
    - :234 `toBe` expected `claimed[0][0]` _(expression)_
    - :235 `toEqual` expected `[5, 5]` _(expression)_
    - :236 `toBe` expected `'1 (identity)'` _(literal)_
    - :241 `toHaveLength` expected `25` _(literal)_
    - :242 `toBe` expected `claimed[1][0]` _(expression)_
    - :243 `toEqual` expected `[25, 25]` _(expression)_
    - :244 `toEqual` expected `[5, 5]` _(expression)_
- `a second epoch turn compares against the first, with no epoch-1 residue` — e2e/claims.spec.ts:247
    - :261 `toEqual` expected `[` _(expression)_
    - :275 `toEqual` expected `firstNew` _(expression)_
    - :276 `toBe` expected `row[1]` _(expression)_
    - :280 `toBe` expected `recPrev` _(expression)_
- `the small-field table is arithmetically self-consistent at every step` — e2e/claims.spec.ts:287
    - :288 `toBeDisabled` expected _no expected value_ _(none)_
    - :289 `toBeEnabled` expected _no expected value_ _(none)_
    - :290 `toContainText` expected `'Step 1 of 4'` _(literal)_
    - :291 `toHaveLength` expected `1` _(literal)_
    - :294 `toContainText` expected `'Step 4 of 4'` _(literal)_
    - :295 `toBeDisabled` expected _no expected value_ _(none)_
    - :296 `toBeEnabled` expected _no expected value_ _(none)_
    - :299 `toHaveLength` expected `5` _(literal)_
    - :305 `toBe` expected `String(secret)` _(expression)_
    - :307 `toEqual` expected `fAt.map(String)` _(expression)_
    - :312 `expect` expected _no expected value_ _(none)_
    - :313 `toBe` expected `'0'` _(literal)_
    - :314 `toEqual` expected `[1n, 2n, 3n].map((x) => '+${(k * x) % SMALL_Q}')` _(expression)_
    - :317 `toHaveLength` expected `3` _(literal)_
    - :322 `toBe` expected `String(secret)` _(expression)_
    - :323 `toEqual` expected _no expected value_ _(none)_
    - :331 `toHaveLength` expected `3` _(literal)_
    - :333 `toBe` expected `interpolateTwo(1n, newAt(1n), 2n, newAt(2n))` _(expression)_
    - :334 `toBe` expected `interpolateTwo(2n, fAt[1], 3n, fAt[2])` _(expression)_
    - :335 `toBe` expected `interpolateTwo(1n, fAt[0], 2n, newAt(2n))` _(expression)_
    - :338 `toBe` expected `secret` _(expression)_
    - :339 `toBe` expected `secret` _(expression)_
    - :340 `toBe` expected `secret` _(expression)_
    - :341 `expect` expected _no expected value_ _(none)_
    - :346 `expect` expected _no expected value_ _(none)_
    - :347 `expect` expected _no expected value_ _(none)_
    - :348 `expect` expected _no expected value_ _(none)_
    - :349 `expect` expected _no expected value_ _(none)_
- `re-rolling replaces every number and leaves nothing from the old instance` — e2e/claims.spec.ts:352
    - :363 `toHaveLength` expected `5` _(literal)_
    - :364 `toBe` expected `labelBefore` _(expression)_
    - :374 `toEqual` expected `[1n, 2n, 3n].map((x) => String(newAt(x)))` _(expression)_
    - :378 `toBe` expected `secret` _(expression)_
    - :379 `toBe` expected `interpolateTwo(1n, (secret + slope) % SMALL_Q, 2n, newAt(2n))` _(expression)_
    - :380 `toBe` expected `secret` _(expression)_
- `the default campaign breaks the threshold without resharing and dies with it` — e2e/claims.spec.ts:387
    - :392 `toEqual` expected `['0:1', '1:3', '2:5']` _(expression)_
    - :398 `toContainText` expected `'Thefts: A@1 · B@3 · C@5'` _(literal)_
    - :399 `toHaveCount` expected `5` _(literal)_
    - :400 `toHaveCount` expected `planned.length` _(expression)_
    - :401 `toContainText` expected `'loot (3 shares, t = 3)'` _(literal)_
    - :405 `toHaveCount` expected `2` _(literal)_
    - :406 `toHaveClass` expected `/chip-neutral/` _(regex)_
    - :407 `toContainText` expected `'g^v = Y — MATCH'` _(literal)_
    - :408 `toHaveClass` expected `/chip-alarm/` _(regex)_
    - :409 `toContainText` expected `'BREACH'` _(literal)_
    - :410 `expect` expected _no expected value_ _(none)_
    - :413 `toContainText` expected `'Not run yet.'` _(literal)_
    - :417 `toContainText` expected `'Thefts: A@1 · B@3 · C@5'` _(literal)_
    - :419 `toContainText` expected `'g^v ≠ Y — NO MATCH'` _(literal)_
    - :420 `toHaveClass` expected `/chip-ok/` _(regex)_
    - :421 `toContainText` expected `'HELD — the thefts span epochs'` _(literal)_
    - :422 `toContainText` expected `'The loot spans epochs 1, 3, 5'` _(literal)_
    - :423 `expect` expected _no expected value_ _(none)_
    - :426 `toHaveCount` expected `planned.length` _(expression)_
    - :427 `toContainText` expected `'BREACH'` _(literal)_
- `three thefts inside one epoch beat resharing, and the demo says so` — e2e/claims.spec.ts:430
    - :436 `toContainText` expected `'Thefts: A@2 · B@2 · C@2'` _(literal)_
    - :438 `toContainText` expected `'g^v = Y — MATCH'` _(literal)_
    - :439 `toHaveClass` expected `/chip-alarm/` _(regex)_
    - :441 `toContainText` expected `'BREACH — 3 thefts landed inside epoch 2'` _(literal)_
    - :442 `toContainText` expected `'It cannot beat a quorum assembled within one epoch'` _(literal)_
- `below-threshold and repeat-custodian campaigns are HELD, with the reason named` — e2e/claims.spec.ts:445
    - :452 `toHaveCount` expected `2` _(literal)_
    - :453 `toContainText` expected `'NO MATCH'` _(literal)_
    - :454 `toHaveClass` expected `/chip-ok/` _(regex)_
    - :455 `toContainText` expected _no expected value_ _(none)_
    - :463 `toHaveCount` expected `5` _(literal)_
    - :464 `toContainText` expected `'The simulator chooses the strongest coherent attempt'` _(literal)_
    - :465 `toContainText` expected `'a custodian can only be fed in once'` _(literal)_
    - :466 `toContainText` expected _no expected value_ _(none)_
    - :471 `toBe` expected `1` _(literal)_
- `an empty theft plan is refused and leaves both worlds unrun` — e2e/claims.spec.ts:474
    - :480 `toContainText` expected `'Not run yet.'` _(literal)_
    - :481 `toContainText` expected `'Not run yet.'` _(literal)_
- `a same-epoch quorum reproduces exactly the secret panel 1 printed` — e2e/claims.spec.ts:488
    - :491 `toMatch` expected `SECRET_HEX` _(expression)_
    - :502 `toContainText` expected `'Interpolation output: ${expected}'` _(expression)_
    - :505 `toContainText` expected `'g^v = Y — MATCH'` _(literal)_
    - :506 `toHaveClass` expected `/chip-ok/` _(regex)_
    - :507 `toContainText` expected _no expected value_ _(none)_
- `every break-it failure path is reached and names its cause` — e2e/claims.spec.ts:512
    - :520 `toContainText` expected `'Pick at least two shares — one point determines nothing.'` _(literal)_
    - :521 `toHaveCount` expected `0` _(literal)_
    - :522 `toBe` expected `'Nothing to interpolate yet.'` _(literal)_
    - :527 `toContainText` expected `'Interpolation refused before it starts: A is selected twice.'` _(literal)_
    - :528 `toContainText` expected `'Lagrange divides by (xᵢ − xⱼ) — zero here'` _(literal)_
    - :529 `toBe` expected `'Refused: duplicate x-coordinate.'` _(literal)_
    - :535 `toContainText` expected `'g^v ≠ Y — NO MATCH'` _(literal)_
    - :536 `toContainText` expected `'REJECT, NO ALARM'` _(literal)_
    - :537 `toContainText` expected `'You mixed epochs 1 and 2.'` _(literal)_
    - :543 `toContainText` expected `'g^v ≠ Y — NO MATCH'` _(literal)_
    - :544 `toContainText` expected `'HELD — 2 shares are below the threshold of 3'` _(literal)_
    - :545 `toContainText` expected `'Below the threshold, interpolation still answers'` _(literal)_
- `a break-it verdict never outlives the selection it was computed for` — e2e/claims.spec.ts:548
    - :555 `toContainText` expected `'RECOVERED, BY DESIGN'` _(literal)_
    - :560 `expect` expected _no expected value_ _(none)_
    - :561 `toBe` expected _no expected value_ _(none)_
    - :564 `toBeEnabled` expected _no expected value_ _(none)_
    - :571 `toContainText` expected `'g^v = Y — MATCH'` _(literal)_
    - :577 `expect` expected _no expected value_ _(none)_
    - :578 `expect` expected _no expected value_ _(none)_
    - :582 `toContainText` expected `'NO MATCH'` _(literal)_
    - :583 `toContainText` expected `'REJECT, NO ALARM'` _(literal)_
- `an honest round passes all five dealings with no alarm anywhere` — e2e/claims.spec.ts:590
    - :599 `toHaveLength` expected `5` _(literal)_
    - :601 `expect` expected _no expected value_ _(none)_
    - :602 `toBe` expected `'1 (identity)'` _(literal)_
    - :603 `toBe` expected `'✓ pass'` _(literal)_
    - :604 `toBe` expected `'5/5 ✓'` _(literal)_
    - :607 `toHaveCount` expected `0` _(literal)_
    - :608 `toContainText` expected `'HELD — an honest round'` _(literal)_
    - :609 `toContainText` expected `'SILENT SECRET CHANGE'` _(literal)_
    - :610 `toBe` expected `'All dealings verified clean.'` _(literal)_
- `a nonzero constant term is caught only by D0 = 1, and its cost is computed` — e2e/claims.spec.ts:613
    - :624 `toHaveLength` expected `1` _(literal)_
    - :625 `toBe` expected `'C'` _(literal)_
    - :630 `toBe` expected `'5/5 ✓'` _(literal)_
    - :632 `toBe` expected `'1 (identity)'` _(literal)_
    - :633 `toBe` expected `'✗ FAIL — nonzero constant term'` _(literal)_
    - :635 `toBe` expected `'1 (identity)'` _(literal)_
    - :636 `toBe` expected `'✓ pass'` _(literal)_
    - :642 `toContainText` expected `'commitment check FAILED'` _(literal)_
    - :643 `toHaveClass` expected `/chip-ok/` _(regex)_
    - :644 `toContainText` expected `'HELD — C’s dealing was rejected'` _(literal)_
    - :645 `toContainText` expected `'MATCH ✓'` _(literal)_
    - :646 `toContainText` expected `'byte-identical ✓'` _(literal)_
    - :651 `toMatch` expected `SECRET_HEX` _(expression)_
    - :652 `toMatch` expected `SECRET_HEX` _(expression)_
    - :657 `toBe` expected `stated` _(expression)_
    - :658 `toBe` expected `7n` _(expression)_
    - :659 `toContainText` expected `'SILENT SECRET CHANGE'` _(literal)_
- `turning the cheat off retracts the forged-world block` — e2e/claims.spec.ts:662
    - :665 `toContainText` expected `'SILENT SECRET CHANGE'` _(literal)_
    - :670 `toContainText` expected `'SILENT SECRET CHANGE'` _(literal)_
    - :671 `toHaveCount` expected `0` _(literal)_
    - :672 `toHaveCount` expected `0` _(literal)_
    - :673 `toHaveCount` expected `0` _(literal)_
- `redistribution moves the same secret to a 4-of-7 committee and raises the bar` — e2e/claims.spec.ts:680
    - :687 `toEqual` expected `[[3, 3], [21, 21]]` _(expression)_
    - :689 `toBe` expected `counts[0][1] * cards.length` _(expression)_
    - :692 `toHaveLength` expected `7` _(literal)_
    - :693 `expect` expected _no expected value_ _(none)_
    - :697 `toMatch` expected `SECRET_HEX` _(expression)_
    - :698 `toBe` expected `oldSecret` _(expression)_
    - :700 `toHaveClass` expected `/chip-ok/` _(regex)_
    - :701 `toContainText` expected `'Byte-identical'` _(literal)_
    - :702 `toHaveClass` expected `/chip-ok/` _(regex)_
    - :703 `toContainText` expected `'Public key unchanged'` _(literal)_
    - :706 `toContainText` expected `'g^v ≠ Y — NO MATCH: three shares are no longer a quorum'` _(literal)_
    - :707 `expect` expected _no expected value_ _(none)_
- `the same 256-bit secret is the one every exhibit reports` — e2e/claims.spec.ts:710
    - :724 `toMatch` expected `SECRET_HEX` _(expression)_
    - :725 `toBe` expected `1` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Reshare Circle — crypto-lab

[![GitHub Pages](https://img.shields.io/badge/demo-live-brightgreen)](https://systemslibrarian.github.io/crypto-lab-reshare-circle/)

> Threshold shares refreshed into a new epoch — the public key unchanged, with no protocol-level reconstruction and no pooling partial shares across epochs.

## What It Is

An interactive browser demo of **proactive secret sharing** — the HJKY share-refresh protocol (Herzberg, Jarecki, Krawczyk, Yung, [*"Proactive Secret Sharing, or: How to Cope with Perpetual Leakage"*](https://doi.org/10.1007/3-540-44750-4_27), CRYPTO 1995) plus share redistribution to a new committee.

The problem it teaches: a *t*-of-*n* threshold scheme defends a moment in time, but keys live for years. A **mobile adversary** doesn't need *t* break-ins at once — one custodian this year, another next year, and the quorum is quietly theirs. Proactive resharing resets that clock: on a schedule, every party deals a random polynomial with **zero constant term**, sub-shares are exchanged and Feldman-verified, and each party adds what it received to its share. The sharing is re-randomized while the secret f(0) — and its public key Y = g^s — provably cannot move. Each individual share is overwhelmingly likely, but not mathematically guaranteed, to have a different numeric value because the aggregate update can evaluate to zero at a particular point.

The primitives are real and **consumed from sibling labs, not reimplemented**:

- **Shamir secret sharing over Z_q** — polynomial evaluation, Lagrange interpolation, rejection-sampled randomness — copied verbatim from [crypto-lab-shamir-gate](https://github.com/systemslibrarian/crypto-lab-shamir-gate) (`src/reuse/shamir-math.ts`).
- **RFC 3526 group 14** (2048-bit safe prime, order-q subgroup, g = 4) and **Feldman VSS commitments/verification** — copied verbatim from [crypto-lab-vss-gate](https://github.com/systemslibrarian/crypto-lab-vss-gate) (`src/reuse/vss.ts`, with `export` added to three originally-private helpers).
- The **HJKY resharing layer** on top (`src/reshare/reshare.ts`) is this lab's own hand-rolled, inspectable teaching code.

**What's real vs simulated:** all field and group arithmetic, all dealings, all Feldman checks, and all audit-view reconstructions run genuinely in your browser (BigInt, `crypto.getRandomValues`). The refresh protocol itself never reconstructs the secret, but this teaching page deliberately does so in tab memory to compare epochs. What's simulated is the *world around* the committee: all five parties live in one browser tab, so private channels, broadcast, epoch clocks and erasure are trivially honest. Panel 2's step-through additionally runs the identical equations over a small labelled field, GF(1019), purely so the numbers fit on screen.

**What it does NOT prove:** that proactive resharing survives a real network (no asynchrony, no Byzantine agreement, no complaint rounds are modeled); that erasure happens (the guarantee collapses if old shares aren't destroyed); or that a breach reaching *t* shares *within one epoch* can be undone — it can't. Feldman commitments reveal g^(a_k), so share secrecy here is computational (discrete log), not information-theoretic.

**Not production crypto — a teaching demo.** Key material is generated per visit and lives only in tab memory.

## Exhibits

1. **Turn the epoch** — the headline. One click runs a full verified HJKY refresh in the real 2048-bit group: 5 zero-commitment checks (D₀ = 1), 25 Feldman sub-share checks, then a side-by-side audit showing which share values changed while the reconstructed secret is byte-identical and the public key never moved. The full dealing matrix is one `<details>` away.
2. **The whole trick** — a 4-step animated walkthrough of *why* a polynomial pinned to zero at x = 0 moves the displayed shares but not the secret, over the labelled small field GF(1019) (2-of-3, re-rollable numbers). An honest plot draws the share points, the update polynomial visibly pinned to the origin, every displayed point's +Δ(x) jump with x = 0 unmoved, and finally the mixed-epoch chord landing on deterministic garbage; the table beside it carries the same numbers.
3. **The mobile adversary** — plan the theft campaign yourself in a custodian × epoch grid (default: A@1, B@3, C@5), then run five epochs with and without resharing. Without: the loot interpolates to the private scalar and **g^v = Y says MATCH — rendered as BREACH**, because the verdict and the math are separate indicators. With: cross-epoch interpolation is checked against Y and, absent a same-epoch quorum, is overwhelmingly likely not to match. The simulator prioritizes any complete same-epoch quorum — so putting all three thefts inside one epoch defeats resharing, and the demo says so honestly instead of pretending otherwise.
4. **Break it yourself** — a checkbox grid of every share from every epoch this page has produced. Pick any three, hit reconstruct: real Lagrange, real public-key check, no guard rails. Mixed epochs are expected not to match Y; a same-epoch quorum recovers by design; duplicate custodians fail closed with the division-by-zero explanation.
5. **The dealer who lies** — make party C deal δ(0) = 7 instead of 0. Its sub-shares all pass the Feldman check (they honestly match the committed polynomial!) and only the D₀ = 1 check catches the lie. The "if nobody checked" counterfactual is computed, not asserted: the secret shifts by exactly +7 and the public key silently becomes Y·g⁷ — the forged-but-accepted ALARM state.
6. **Rotate the committee** — redistribute 3-of-5 into 4-of-7: a quorum of three old custodians deal their *shares* (never the secret) into fresh degree-3 polynomials; the new seven verify each D₀ against the old public commitments and combine with public Lagrange weights. Same secret, same Y, new people, new threshold.

## When to Use It

- **Use proactive resharing** when a threshold secret must outlive the assumption that any fixed set of share-holders stays honest and uncompromised — long-lived custody keys, root CAs, foundation cold keys, validator withdrawal keys.
- **Use redistribution** when operators join, leave, or the threshold itself must change without a key ceremony that reassembles the secret.
- **Do NOT use this code** for real custody: it is a single-tab teaching demo with no network, no erasure enforcement, no Byzantine fault handling, and no side-channel hardening. Use audited MPC/threshold libraries and their operational playbooks.
- Do NOT reach for resharing to fix a breach that already collected *t* same-epoch shares — nothing can; the key is gone. Resharing is prevention, not revocation.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-reshare-circle](https://systemslibrarian.github.io/crypto-lab-reshare-circle/)**

Advance epochs and watch the compare table; run the mobile adversary both ways; mix epochs in the break-it grid; make a dealer cheat and watch the commitment check catch it; rotate the committee to 4-of-7.

## What Can Go Wrong

- **No resharing at all** — the mobile adversary's slow collection stays valid forever; three thefts years apart equal one clean quorum (exhibit 3).
- **Old shares not erased** — the epoch turn is cosmetic: the attacker's epoch-1 loot still lies on the epoch-1 polynomial, and enough of it reconstructs.
- **A dealer smuggles a nonzero constant term** — the secret silently shifts and the committee loses its own key (sabotage, not theft). Feldman's D₀ = 1 check exists precisely for this (exhibit 5).
- **A tampered sub-share** — caught receiver-by-receiver by the Feldman check; the demo's tests pin this down per-index.
- **≥ t compromises within a single epoch** — outside the model; no refresh schedule saves you.
- **Trusting the interpolation output** — Lagrange always answers, confidently, even on garbage input. The only honest signal is the separate public-key check (exhibits 3 and 4).

## Where the Mechanism Fits

- **Long-lived threshold secrets** fit the original HJKY mobile-adversary model when parties can refresh within defined periods and securely erase previous shares.
- **Committee changes** can use redistribution to move from an old authorized quorum to a new committee and threshold without changing the public key (exhibit 6).
- **Production deployments need more than this algebra**: authenticated private channels, consistent broadcast, complaint and exclusion rules, durable epoch agreement, secure erasure, side-channel defenses, and a protocol-specific security proof. This lab does not claim that any named custody or wallet product uses this exact construction.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-reshare-circle.git
cd crypto-lab-reshare-circle
npm install
npm run dev        # dev server
npm test           # 44 unit tests incl. KATs (Vitest)
npm run build      # typecheck + production build
npm run test:a11y  # browser behavior + axe-core WCAG 2.1 A/AA gate (Playwright)
`​``

## Related Demos

- [shamir-gate](https://systemslibrarian.github.io/crypto-lab-shamir-gate/) — the Shamir math this lab consumes, and the below-threshold "confidently wrong" lesson.
- [vss-gate](https://systemslibrarian.github.io/crypto-lab-vss-gate/) — Feldman and Pedersen commitments, consumed here as the verifier.
- [gg20-wallet](https://systemslibrarian.github.io/crypto-lab-gg20-wallet/) / [threshold-decrypt](https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/) — distributed key generation, the trusted-dealer assumption removed.
- [frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) / [shamir-vs-frost](https://systemslibrarian.github.io/crypto-lab-shamir-vs-frost/) / [threshold-mldsa](https://systemslibrarian.github.io/crypto-lab-threshold-mldsa/) — *using* a shared secret without reconstructing it.

## Build & Verify

- **44 unit tests, all passing** (`npm test`): `src/reuse/reuse.test.ts` (11) pins the consumed modules with KATs — Shamir vectors from shamir-gate's own suite, RFC 3526 group-14 vectors (2048-bit safe prime, Fermat checks, subgroup order) from vss-gate's — and `src/reshare/reshare.test.ts` (33) covers every-subset round-trips, refresh invariants, exact wire shapes and threshold degree, zero-update rejection, the valid single-share collision case, a fully hand-computed reshare KAT over GF(1019), exact cheat consequences (+c and Y·g^c), fail-closed malformed/duplicate/non-canonical inputs, membership change, and the mobile adversary in every honesty-critical regime.
- **Workflow policy has 7 executable controls** (`npm run test:workflow-controls`): repository code gets read-only permissions, publishing authority stays in no-checkout jobs, pull requests retain no Pages bundle, Node 22/24/26 all run unit/build controls, browser tests gate publishing and dependency merges, main deploys cannot be cancelled midway, and only gated patch/minor Dependabot updates can auto-merge.
- **Browser behavior and accessibility are gated in CI**: `npm run test:a11y` scans the production build with axe-core (WCAG 2.1 A/AA) after driving every exhibit, and the GitHub Pages deploy is blocked on failure.

## Performance

The demo runs real 2048-bit modular exponentiation in BigInt: a fully verified epoch turn is ~35 group exponentiations plus 25 verification checks and takes a few seconds on commodity hardware. That cost is the honest price of "no simulated math" and is narrated in the UI status lines.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Icy DVRF

- **slug**: `crypto-lab-icy-dvrf`
- **repo**: https://github.com/systemslibrarian/crypto-lab-icy-dvrf
- **live**: https://systemslibrarian.github.io/crypto-lab-icy-dvrf/
- **commit_sha**: `4795aef753eca870aff0aeca050302b5d6ca6273` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: MPC & THRESHOLD | RANDOMNESS  ·  **level**: advanced  ·  **--accent**: #4fd0e0
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: Icy DVRF  — _read from index.html_

**Subtitle**: Distributed VRF · FROST · eprint 2026/969  — _read from index.html_

**Description**: Runs an Icy-DVRF-inspired t-of-n verifiable random function over ristretto255, live — you deal shares, publish FROST-style nonce commitments offline, then step the two online rounds that fold into one constant-size, publicly checkable random output.  — _read from index.html_

**Why it matters**: Lotteries, validator elections, and blockchain beacons fail the moment one insider can nudge "random". A distributed VRF makes the dice roll a group act — no minority can bias it, and anyone on earth can verify it.  — _read from index.html_

**Card copy**: A t-of-n distributed VRF: partial evaluations proven with Chaum-Pedersen DLEQ under one shared challenge, aggregating to a constant-size 128-byte proof whether three parties contribute or three hundred.

**Chips**: DVRF · Chaum-Pedersen DLEQ · ristretto255 · FROST Nonces

**Implements**: Hash-to-curve `src/dvrf/group.ts:60`, ristretto255 `src/dvrf/group.ts:13`, SHA-512 `src/dvrf/group.ts:77`, Shamir secret sharing `src/dvrf/protocol.ts:50`

**Attacks shown**: Nonce reuse `README.md:80`

**Comment-only (named in code comments, not executed)**: EC point arithmetic `src/dvrf/group.ts:64`, FROST `src/dvrf/group.ts:6`, Pedersen commitment `src/dvrf/dleq.ts:2`

**References**: BLS12-381, Ed25519, FROST, Pairing, Pedersen commitment

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `eprint 2026/969` — first seen README.md:6 (4×)
- `eprint.iacr.org/2026/969` — first seen README.md:6 (1×)
- `RFC 9380` — first seen src/dvrf/group.ts:59 (1×)
- `RFC 9496` — first seen README.md:22 (6×)
- `rfc9496` — first seen README.md:22 (3×)

**Stated limitations (page)**:

- _(scope-note, index.html)_ ⚠ Demo simplification: a trusted dealer briefly holds the whole secret. Real deployments run a distributed key generation ceremony so no one ever does — DKG internals are out of scope here (see the VSS demo linked in the footer).
- _(honesty, index.html)_ What's real here — and what this page does not prove Real: every group operation (ristretto255 via @noble/curves, pinned to RFC 9496 known-answer tests), the Shamir sharing, the binding factors, the DLEQ proofs, the aggregation, and every verification shown — all execute live in your browser. Simulated: the network. All "parties" are objects in one browser tab, and the key ceremony uses a trusted dealer instead of a DKG. Keys and nonces are per-session, in memory only. Simplified: the protocol follows the structure of Icy-DVRF (eprint 2026/969) — FROST-style preprocessing, shared-challenge DLEQ, constant-size aggregated proof — but is this demo's own instantiation over ristretto255, not the paper's EVM-targeted parameterization, and equivalence to the paper has not been established. Every hashed byte, encoding, and deliberate deviation is documented in the construction map, and frozen transcript vectors pin the instantiation in CI. None of it is constant-time. Scope of "no bias": what the exhibits prove is fixed-input uniqueness — for one key and one message, no alternative β can ever verify. They also show what uniqueness does not give you: a coalition that withholds round 2 can learn β and censor it (selective abort). A real beacon preserves the no-steering claim only with a retry rule that keeps the message fixed and replaces the withholder — never by rolling a fresh candidate output. Not proven: security against a real adversary. A cheater in this tab is scripted; a real 

**README — What Can Go Wrong**:

```text
- **Nonce reuse** — a preprocessed pair is one-time; the code hard-refuses a second spend (as FROST
  deployments must, or the key leaks).
- **Nonce substitution** — a party that picks a fresh nonce after seeing the message can still send
  it, but no substituted nonce can produce a proof that verifies against its published (Dᵢ, Eᵢ)
  commitment, and the key equation names the party.
- **Corrupt partials** — an invented Γᵢ breaks the input equation; the evaluation aborts with no
  output rather than emitting something unverifiable.
- **Selective abort** — after round 1, everyone (including a withholder) can compute β; refusing
  round 2 censors publication. No alternative β exists, but a surrounding beacon that changes the
  message or rolls a fresh candidate on retry converts censorship into bias — the retry rule matters.
  In a *mixed* cast, where someone also corrupts a partial, the round-1 aggregate contains a partial
  that verification rejects — so it is not an output at all. The exhibit scores that case against the
  partials that would actually have verified: if they still reach t it recomputes β over just those
  (Lagrange weights re-derived for that subset), and if they do not it says plainly that the cast
  determined nothing publishable, rather than presenting a poisoned aggregate as "the β the
  withholder knew".
- **Too few parties** — below t the protocol refuses outright. Cheaters plus absentees reaching
  n − t + 1 can *halt* the beacon (liveness), but can never bias a published output for a fixed
  message (safety).
- **Trusted dealer** — the demo's dealer momentarily knows everything; real systems must use a DKG so
  no one ever does.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-icy-dvrf

## What It Is

A browser-based educational demo of a **t-of-n distributed verifiable random function (DVRF)**
inspired by **Icy-DVRF** (Ağırtaş, Özer, Saygı, Yayla, [eprint 2026/969](https://eprint.iacr.org/2026/969)):
partial VRF evaluations proven with **Chaum–Pedersen DLEQ proofs** under one shared Fiat–Shamir
challenge, with **FROST-style preprocessed nonce commitments** so the online phase is two broadcast
rounds and the aggregated proof is **constant-size** — 128 bytes whether 3 parties contributed or 300.
This is the demo's *own instantiation* over ristretto255, not a conformant implementation of the
paper; equivalence has not been established, and every hashed byte, encoding, and deliberate
deviation is documented in [docs/CONSTRUCTION.md](docs/CONSTRUCTION.md) and pinned by frozen
transcript vectors in CI.

The security story it teaches, as four **separate** properties: *unpredictability* (before the
evaluation, nobody knows β), *fixed-input uniqueness* (for one group key and one message, no other β
can ever verify — so no t−1 coalition can steer the value), *public verifiability* (anyone checks
two DLEQ equations against the group key alone), and *liveness* — the one property cheaters can
attack: a coalition can learn β and then censor its publication (selective abort), which is why real
beacons must keep the message fixed on retry.

Everything cryptographic runs live in the page over **ristretto255** ([RFC 9496](https://www.rfc-editor.org/rfc/rfc9496)),
with the group arithmetic from [@noble/curves](https://github.com/paulmillr/noble-curves) pinned to the
RFC's known-answer vectors, and the protocol layer (Shamir, binding factors, DLEQ, aggregation,
envelope) hand-rolled in small, tested TypeScript modules. **Not production crypto** — a teaching
demo: one browser tab plays every party, a trusted dealer stands in for a DKG, and nothing is
constant-time.

## Exhibits

1. **Key ceremony** — deal a fresh secret into n Shamir shares with threshold t (n ≤ 7); see the group
   key PK and each party's verification share. The trusted dealer is labelled as the demo
   simplification it is, and changing the sliders afterwards flags the ceremony as stale instead of
   silently lying.
2. **Offline preprocessing** — each party publishes one-time nonce commitments (Dᵢ, Eᵢ) *before any
   message exists*, in numbered batches with a visible **queued → spent** lifecycle: a consumed batch
   stays on screen as evidence, so every binding factor and proof traces back to commitments you can
   still see.
3. **Two online rounds** — step the real evaluation: hash-to-curve, round 1 (partials Γᵢ = xᵢ·P plus
   input-base nonces), one shared challenge with Lagrange weights, round 2 (responses zᵢ), per-party
   DLEQ checks, aggregation to β = H(Γ). Upstream controls lock while a walk is on screen, so nothing
   visible can contradict the transcript. A **round ladder** alongside compares pairing-based DVRFs
   (1 round, linear-size work), interactive Chaum–Pedersen DVRFs (3 rounds), and the preprocessed
   2-round path — the demo's central "aha".
4. **Public verification** — check the constant-size proof (Γ, R_B, R_P, z) with nothing but the group
   key: two DLEQ equations reported independently, plus β = H(Γ). A compute-both-sides table compares
   the threshold β byte-for-byte against the dealer's direct sk·P evaluation; a subset swap shows two
   committees producing the identical output; an **export** produces a canonical JSON proof envelope;
   and a **verifier workbench** — sharing no state with the other exhibits — strictly parses any
   pasted envelope (exact fields, canonical encodings) before running the equations, so "anyone can
   check it" is demonstrated, not asserted.
5. **Break it yourself** — script a cast: corrupt a partial (fails the DLEQ *input* equation), swap a
   nonce after seeing the message (fails the *key* equation — the substitution can be attempted, it
   just can't verify against the precommitted slot), **withhold round 2** (learn β, then censor it —
   the selective-abort limit of "no bias"), or go absent (tolerated at ≥ t responders, refused below —
   fail closed, never "best effort"). Rerun with an honest threshold and watch the byte-identical β
   appear: cheating can delay or censor the beacon, never steer it.

## When to Use It

- To understand why "trust our random number" is fixable — how VRF proofs make randomness auditable.
- To see what FROST-style preprocessing actually buys: which round disappears, and why the pinned
  nonce commitment is also what defeats post-message nonce substitution.
- To learn the exact boundary of threshold "no bias": uniqueness (unbeatable) vs. liveness
  (attackable by selective abort) — and the retry rule that keeps beacons honest.
- **Do NOT use it** as a randomness beacon, as a reference implementation of eprint 2026/969, or as a
  source of key material — the dealer holds the whole secret and the code is optimized for
  inspectability, not side-channel resistance.

## Live Demo

**<https://systemslibrarian.github.io/crypto-lab-icy-dvrf/>**

Deal shares, publish a preprocessing batch, step the two online rounds for any message, export the
proof and verify it in the workbench (or another machine), then make parties cheat and watch the
math name them.

## What Can Go Wrong

- **Nonce reuse** — a preprocessed pair is one-time; the code hard-refuses a second spend (as FROST
  deployments must, or the key leaks).
- **Nonce substitution** — a party that picks a fresh nonce after seeing the message can still send
  it, but no substituted nonce can produce a proof that verifies against its published (Dᵢ, Eᵢ)
  commitment, and the key equation names the party.
- **Corrupt partials** — an invented Γᵢ breaks the input equation; the evaluation aborts with no
  output rather than emitting something unverifiable.
- **Selective abort** — after round 1, everyone (including a withholder) can compute β; refusing
  round 2 censors publication. No alternative β exists, but a surrounding beacon that changes the
  message or rolls a fresh candidate on retry converts censorship into bias — the retry rule matters.
  In a *mixed* cast, where someone also corrupts a partial, the round-1 aggregate contains a partial
  that verification rejects — so it is not an output at all. The exhibit scores that case against the
  partials that would actually have verified: if they still reach t it recomputes β over just those
  (Lagrange weights re-derived for that subset), and if they do not it says plainly that the cast
  determined nothing publishable, rather than presenting a poisoned aggregate as "the β the
  withholder knew".
- **Too few parties** — below t the protocol refuses outright. Cheaters plus absentees reaching
  n − t + 1 can *halt* the beacon (liveness), but can never bias a published output for a fixed
  message (safety).
- **Trusted dealer** — the demo's dealer momentarily knows everything; real systems must use a DKG so
  no one ever does.

## Real-World Usage

Distributed randomness beacons power validator and leader elections (Algorand-style sortition,
drand/League of Entropy), on-chain lotteries and gaming (Chainlink VRF is single-party VRF; DVRFs like
GLOW and DDH-DVRF decentralize the trust), and committee sampling in consensus protocols. Icy-DVRF's
stated contribution is FROST-style preprocessing that cuts DVRFwCP's added communication from O(n²t)
to O(t) while keeping proofs constant-size — at the cost, its abstract says, of one extra *off-chain*
round relative to DDH-DVRF and GLOW-DVRF. (Its on-chain verifier is not pairing-free: the paper
benchmarks 88,803 gas on Sepolia using the EIP-2537 BLS12-381 precompiles, 43% below the pairing-based
constructions it compares against.) The constant proof size and the low online round count are the
properties this demo makes visible; the gas and curve figures are the paper's, not this demo's.

## How to Run Locally

`​``bash
npm ci
npm run dev        # dev server
npm test           # 89 Vitest tests incl. 52 RFC 9496 KATs + frozen transcript vectors
npm run build      # typecheck + production build
npm run test:a11y  # Playwright: axe WCAG 2.1 A/AA gate (both themes) + UI regression suite (build first)
`​``

Requires Node ≥ 22 (declared in `engines`).

## Related Demos

- [crypto-lab-vrf-gate](https://systemslibrarian.github.io/crypto-lab-vrf-gate/) — the single-party VRF this page distributes
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — FROST threshold *signing*, where the preprocessing trick comes from
- [crypto-lab-shamir-gate](https://systemslibrarian.github.io/crypto-lab-shamir-gate/) — Shamir secret sharing on its own
- [crypto-lab-vss-gate](https://systemslibrarian.github.io/crypto-lab-vss-gate/) — verifiable sharing, the road toward the DKG this demo leaves out

## Build & Verify

- **89 unit tests** (Vitest, colocated in `src/`): Shamir round-trips and Lagrange identities, DLEQ
  accept/reject per equation, full-protocol tests (threshold output ≡ direct evaluation, subset
  independence, tamper rejection for every proof component, cheater blame, selective abort with
  learned-output equality, nonce single-use, zero-scalar rejection, below-threshold refusal, 2-of-2
  through 4-of-7 shapes), and strict envelope parsing (tamper/malformed/non-canonical rejection with
  the field named).
- **52 spec KATs** from RFC 9496 in `src/dvrf/rfc9496.test.ts`: 16 generator multiples, 29 invalid
  encodings rejected, 7 element-derivation vectors.
- **Frozen transcript vectors** (`src/dvrf/golden.test.ts`): a deterministic 3-of-5 evaluation's
  every value — dealer key, challenge, β, proof, byte-exact envelope — pinned so no hashed byte of
  the construction can change silently. Construction map: [docs/CONSTRUCTION.md](docs/CONSTRUCTION.md).
- **8 UI regression tests** (`e2e/ui.spec.ts`): control locking during walks, spent-batch
  traceability, stale-settings flagging, effective-cast honesty, fail-closed refusal, selective-abort
  equality, cross-context envelope verification with tamper rejection, and no horizontal overflow at
  390/320 px in the longest completed states.
- **Accessibility gate**: `e2e/a11y.spec.ts` drives every exhibit into its post-interaction state
  (including workbench, selective-abort, and abort/blame paths) and asserts **zero axe-core WCAG 2.1
  A/AA violations in both themes** against the production build; the Pages deploy is blocked if it
  fails.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Proof Tally

- **slug**: `crypto-lab-proof-tally`
- **repo**: https://github.com/systemslibrarian/crypto-lab-proof-tally
- **live**: https://systemslibrarian.github.io/crypto-lab-proof-tally/
- **commit_sha**: `77b3bb490f2bbd1cfd81302265cb7e828349d58c` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `e1aaa597efeba9ce1962413e9b0e6533193ee469`
- **read_from**: working tree (clean)
- **category**: MPC & THRESHOLD | PRIVACY | ZERO-KNOWLEDGE  ·  **level**: advanced  ·  **--accent**: #7be495
- **MISSING FIELDS**: verification

**Name (H1)**: Proof Tally  — _read from index.html_

**Subtitle**: Verifiable aggregation · Prio3 · VDAF  — _read from index.html_

**Description**: Split a salary into two shares, verify it without exposing the input, then compare an exact total with a bounded distributed-noise release.  — _read from index.html_

**Why it matters**: With a verification key hidden from clients, Prio3 rejects a malformed report while keeping its measurement split between servers. This single-process demo exposes a fixed test key and teaches the arithmetic, not that deployment boundary.  — _read from index.html_

**Card copy**: Prio3 lets two aggregators reject a malformed report without reading it. Separate lessons compare exact-total differencing with one bounded participant-noised release, then compute exact observable transcripts for selective aborts, conditioned publication, capped retries, and an independent-abort control.

**Chips**: Prio3 · Fully Linear PCP · Field64 · Discrete Laplace · Abort / Retry

**Implements**: Laplace mechanism `src/distributed/noise.ts:95`, NTT `src/field/field64.ts:95`, SHA-3 `src/xof/turboshake.ts:1`, SHAKE `src/xof/turboshake.ts:33`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: MD5 `tools/verdict-kill.mjs:15`, PQXDH `tools/verdict-kill.mjs:77`

**References**: Gaussian mechanism, MD5, SHA-256

**Standards body**: NIST

**Implementation**: local TypeScript Field64/Prio3 and exact BigInt DP model; @noble TurboSHAKE128

**Spec citations, exactly as written**:

- `doi.org/10.6028/NIST.SP.800-226` — first seen README.md:180 (1×)
- `draft-irtf-cfrg-vdaf-22` — first seen README.md:6 (5×)
- `ePrint 2026/2059` — first seen README.md:181 (3×)
- `eprint.iacr.org/2019/188` — first seen README.md:175 (1×)
- `eprint.iacr.org/2026/2059` — first seen README.md:181 (2×)
- `NIST SP 800-226` — first seen README.md:180 (1×)
- `RFC 9861` — first seen README.md:173 (1×)
- `rfc9861` — first seen README.md:173 (1×)

**README — What Can Go Wrong**:

```text
- An out-of-range or malformed report is rejected when the combined verifier is nonzero.
- A changed proof share fails the gadget-consistency check.
- A real deployment must keep the verification key secret from clients and commit to it before
  processing reports. This single-process lab deliberately does neither.
- A replayed report still passes preparation - its proofs are still correct, and the VDAF keeps no
  memory of reports it has seen - so the aggregate would count it twice. Replay is refused outside
  the VDAF; this lab's `NonceRegistry` rejects a 16-byte nonce it has already admitted.
- If both aggregators collude, they can reconstruct each input.
- A well-formed lie remains valid because the proof checks structure, not external truth.
- An aggregate over one report reveals that report unless a separate privacy mechanism is applied.
- Exact full-cohort and fixed-size replacement totals disclose the replaced bounded contribution by
  subtraction; input-share secrecy does not change that output fact.
- The exact-disclosure control and distributed-noise control are alternative teaching worlds. Once
  an exact overlapping total has been released, adding noise to a later answer cannot restore the
  privacy that the exact releases already lost.
- Each selectable participant scenario is likewise a separate counterfactual teaching world. The
  page retires the prior view when a control changes; its outputs must not be combined as repeated
  answers about the fixed synthetic payroll. A real deployment must compose every answer over
  overlapping records.
- The distributed lesson clamps each salary to `$0..$250,000`, floors it to `$5,000` units, and uses
  fixed-size replace-one sensitivity `50`. Changing the record unit or adjacency changes the
  calibration.
- Each honest included client activates a full `Lap_Z(50)` draw with probability `9/10`. Exactly six
  honest clients make the no-activation event `10^-6`; at least six make it at most `10^-6`, five
  make it `10^-5`, and zero make the bound vacuous. Accepted reports do not prove which clients are
  honest.
- A sampled magnitude of `4096` is allowed. A magnitude above `4096`, an incomplete cohort, a
  duplicate, or a rejected report aborts the batch without releasing a total. The UI abandons the
  batch after a cap failure and never resamples that draw; the low-level report builder itself is not
  a durable attempt ledger. The output-magnitude cap adds the analytic total-variation coupling
  bound `(1 + exp(epsilon)) * eta` to delta, where
  `eta = n * 2*exp(-B/50)/(exp(1/50)+1)`. The separately displayed decimal is explicitly a
  binary64 approximation to that expression; the exact rejection
  sampler itself has unbounded but almost-surely terminating runtime and no hidden attempt ceiling.
- The shift by `4096` lets `Prio3Sum(8242)` prove only the combined input is in range. It does not
  prove a truthful salary, correct clipping, a valid value/noise decomposition, an activation coin,
  or independent random sampling. Corrupt clients can submit valid false values or fixed noise and
  destroy utility.
- The common Prio3 context binds the batch identifier, full ordered roster, and fixed mechanism, but
  a report carries no authenticated sender-to-slot credential. `participantId` and `integrity` are
  wrapper metadata in this counterfactual harness; the latter is explicitly omniscient and neither
  is attested by Prio3. Production intake must authenticate one sender to one committed roster slot
  before invoking the release policy.
- Corrupt submissions must be fixed before the adversary can learn the honest clients' hidden
  activation bits or noise. An adversary allowed to observe that noise and then choose a canceling
  valid input is outside this privacy argument; a real protocol must enforce the required commit and
  message ordering.
- Both aggregators colluding reconstruct each shifted client contribution. Aggregate-view privacy
  requires at least one honest aggre
```

**Claims tested** (e2e/claims.spec.ts, 21 test(s)):

- `the displayed verifier shares add to the displayed combined verifier` — e2e/claims.spec.ts:100
    - :106 `toBe` expected `combined` _(expression)_
- `the sharded envelopes render the measurement and both input shares` — e2e/claims.spec.ts:114
    - :121 `toBe` expected `helper` _(expression)_
    - :122 `expect` expected _no expected value_ _(none)_
    - :130 `toHaveLength` expected `3` _(literal)_
    - :131 `toBe` expected `helperText` _(expression)_
- `the tally is independently recomputable from accepted values` — e2e/claims.spec.ts:134
    - :144 `toBe` expected `submitted` _(expression)_
    - :145 `toBe` expected `values.length` _(expression)_
    - :146 `toBe` expected `12` _(literal)_
- `the range rejection is outside the displayed bit width` — e2e/claims.spec.ts:152
    - :158 `expect` expected _no expected value_ _(none)_
    - :160 `toContainText` expected `'${value.toLocaleString('en-US')} ≥ 2^${bits}'` _(expression)_
    - :161 `toContainText` expected `'combined verifier nonzero'` _(literal)_
- `the KAT counter agrees with the rendered matching rows` — e2e/claims.spec.ts:164
    - :168 `toHaveCount` expected `count` _(expression)_
    - :169 `toHaveCount` expected `0` _(literal)_
- `changing an input retires a verdict while a no-op preserves it` — e2e/claims.spec.ts:173
    - :177 `toHaveCount` expected `1` _(literal)_
    - :179 `toHaveCount` expected `1` _(literal)_
    - :180 `toContainText` expected `'retired'` _(literal)_
    - :182 `toHaveCount` expected `0` _(literal)_
    - :183 `toContainText` expected `'retired'` _(literal)_
- `hidden panels remain unpainted until their real tabs are selected` — e2e/claims.spec.ts:186
    - :187 `toBeHidden` expected _no expected value_ _(none)_
    - :188 `toBeHidden` expected _no expected value_ _(none)_
    - :189 `toBeHidden` expected _no expected value_ _(none)_
    - :191 `toBeVisible` expected _no expected value_ _(none)_
    - :192 `toBeHidden` expected _no expected value_ _(none)_
    - :194 `toBeVisible` expected _no expected value_ _(none)_
    - :195 `toBeHidden` expected _no expected value_ _(none)_
- `exact equal-size Prio3 releases disclose the zero-replaced contribution` — e2e/claims.spec.ts:198
    - :213 `toBe` expected `independentlyClipped` _(expression)_
    - :214 `toBe` expected `disclosed` _(expression)_
    - :215 `toBe` expected `independentlyClipped / grid` _(expression)_
- `the distributed release is independently recomputable from every rendered contribution` — e2e/claims.spec.ts:224
    - :242 `toHaveLength` expected `12` _(literal)_
    - :243 `toEqual` expected `raw.map((value) => value < clampMinimum ? clampMinimum : value > clampMaximum ? clampMaximum : value)` _(expression)_
    - :244 `toEqual` expected `clipped.map((value) => value / grid)` _(expression)_
    - :245 `toEqual` expected `quantized.map((value, index) => value + noise[index] + cap)` _(expression)_
    - :246 `toBe` expected `true` _(expression)_
    - :256 `toHaveLength` expected `integrity.length` _(expression)_
    - :258 `expect` expected _no expected value_ _(none)_
    - :259 `toBe` expected `'not-applicable'` _(literal)_
    - :279 `toHaveCount` expected `0` _(literal)_
    - :280 `toHaveCount` expected `0` _(literal)_
    - :281 `toContainText` expected `'No exact total'` _(literal)_
- `the displayed distributed privacy accounting follows the declared parameters` — e2e/claims.spec.ts:284
    - :302 `toBe` expected `sensitivity / epsilon` _(expression)_
    - :315 `toContainText` expected `'${money(clampMinimum)} to ${money(clampMaximum)}'` _(expression)_
    - :316 `toContainText` expected `'${money(grid)} units'` _(expression)_
    - :317 `toContainText` expected `'sensitivity is ${sensitivity} units'` _(expression)_
    - :318 `toContainText` expected `'ε = ${epsilon}'` _(expression)_
    - :319 `toContainText` expected `'scale-${declaredScale}'` _(expression)_
    - :320 `toContainText` expected `'probability ${betaNumerator}/${betaDenominator}'` _(expression)_
    - :321 `toContainText` expected `'At least ${minimumHonest} honest clients'` _(expression)_
    - :322 `toContainText` expected `'${advertisedNumerator.toLocaleString('en-US')} / ${advertisedDenominator.toLocaleString('en-US')}'` _(expression)_
- `corruption, dropout, collusion and output-cap failures release no aggregate` — e2e/claims.spec.ts:335
    - :343 `toHaveCount` expected `0` _(literal)_
    - :348 `toHaveCount` expected `0` _(literal)_
    - :353 `toHaveCount` expected `0` _(literal)_
    - :358 `toHaveCount` expected `0` _(literal)_
    - :364 `toHaveCount` expected `0` _(literal)_
- `one committed distributed batch cannot release twice and scenario changes retire it` — e2e/claims.spec.ts:367
    - :372 `toBeDisabled` expected _no expected value_ _(none)_
    - :376 `toHaveCount` expected `0` _(literal)_
    - :379 `expect` expected _no expected value_ _(none)_
    - :380 `toBeDisabled` expected _no expected value_ _(none)_
    - :381 `toBeEnabled` expected _no expected value_ _(none)_
    - :382 `toContainText` expected `'separate teaching world'` _(literal)_
    - :383 `toContainText` expected `'outputs must not be combined'` _(literal)_
    - :386 `toBeDisabled` expected _no expected value_ _(none)_
- `a well-formed lie passes every check and still changes the truth` — e2e/claims.spec.ts:390
    - :398 `toBe` expected `sealed.length` _(expression)_
    - :399 `expect` expected _no expected value_ _(none)_
    - :402 `toBe` expected `truth` _(expression)_
    - :410 `toContainText` expected `'cannot check that a report is true'` _(literal)_
- `one accepted report exposes itself through the aggregate` — e2e/claims.spec.ts:413
    - :418 `toBe` expected `input` _(expression)_
    - :422 `toContainText` expected `'does not provide differential privacy'` _(literal)_
- `a replayed report re-verifies and only the intake registry stops it` — e2e/claims.spec.ts:425
    - :429 `toHaveAttribute` expected `'data-first-admitted', 'true'` _(expression)_
    - :430 `toHaveAttribute` expected `'data-vdaf-replay-accepted', 'true'` _(expression)_
    - :431 `toHaveAttribute` expected `'data-guard-admitted', 'false'` _(expression)_
    - :442 `toHaveLength` expected `2` _(literal)_
    - :444 `toHaveLength` expected `2` _(literal)_
    - :446 `toBe` expected `total` _(expression)_
    - :447 `toBe` expected `contributions.reduce((sum, value) => sum + value, 0n)` _(expression)_
- `the preparation verdict follows the displayed combined verifier` — e2e/claims.spec.ts:461
- `the tally match word follows the two displayed totals` — e2e/claims.spec.ts:470
- `a flipped proof share fails the gadget-consistency check` — e2e/claims.spec.ts:479
    - :483 `toHaveAttribute` expected `'data-tamper-cause', 'gadget consistency failed'` _(expression)_
- `colluding aggregators reconstruct the input that was sharded` — e2e/claims.spec.ts:487
    - :493 `toBe` expected `input` _(expression)_
    - :498 `toBe` expected `shareB` _(expression)_
- `the KAT summary word follows the rendered rows` — e2e/claims.spec.ts:504
    - :507 `expect` expected _no expected value_ _(none)_
- `the exact abort ledger separates observers and recomputes every probability` — e2e/claims.spec.ts:514
    - :538 `toBe` expected `3` _(literal)_
    - :595 `toHaveCount` expected `2 * cap + 1` _(expression)_
    - :603 `toEqual` expected `{ d0: one, d1: one }` _(expression)_
    - :607 `toHaveCount` expected `0` _(literal)_
    - :608 `toHaveCount` expected `1` _(literal)_
    - :609 `toContainText` expected `'complete observable transcript'` _(literal)_
    - :610 `toContainText` expected `'not public'` _(literal)_
    - :612 `toContainText` expected `'not an attacker view'` _(literal)_

**Mutation records** (2 file(s)):

- `e2e/verdict-mutations.json` (24703 bytes)
- `tools/verdict-mutation.mjs` (1818 bytes)

<details><summary>Full README</summary>

```markdown
# Proof Tally

## What It Is

Proof Tally is an interactive implementation of `Prio3Count` and `Prio3Sum` from
[`draft-irtf-cfrg-vdaf-22`](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-vdaf-22),
published 14 August 2026. A client splits each measurement and its fully linear proof between two
aggregators. Neither aggregator receives the measurement, but together their verifier shares reject
a malformed report before it enters the aggregate.

The teaching implementation uses the draft's Field64 arithmetic and TurboSHAKE128 XOF with domain
byte `D=1`. Its deterministic tests are pinned to CFRG reference commit
[`e1d1e1c3854a34589c0c2d9b899a48533cac9004`](https://github.com/cfrg/draft-irtf-cfrg-vdaf/tree/e1d1e1c3854a34589c0c2d9b899a48533cac9004),
tagged `draft-irtf-cfrg-vdaf-22`.

A separate distributed differential-privacy lesson composes real `Prio3Sum` reports with bounded,
participant-contributed discrete-Laplace noise. It clamps and quantizes every record before
aggregation, fixes replace-one adjacency and sensitivity, samples with the exact integer-only
Canonne-Kamath-Steinke algorithms, and releases at most once from an all-or-nothing committed
cohort. This is a Shi-inspired teaching composition, not an implementation of Shi et al.'s private
stream aggregation system, DAP, or shuffle DP.

A second, separately labeled lesson studies abort observability using the outcome-leakage model in
Meisingseth's *On Aborts in Differential Privacy*. It does not modify or attack the Prio3 route. An
exact sensitivity-one additive mechanism on two neighboring datasets uses
`Pr[Z=z] = 1/(3*2^|z|)`, then compares a public `ABORT`, success-conditioned publication, a visibly
capped retry transcript, and an abort coin independent of the candidate. Every probability and
likelihood ratio is reduced with `BigInt` rational arithmetic; this path performs no sampling.

This is not production crypto. It is browser-based teaching code, is not constant-time, and does not
implement DAP transport or persistence. All three roles share one browser process, where the fixed
demonstration verification key is visible to client code; this does not reproduce the draft's
verification-key secrecy or secure-channel assumptions.

## Exhibits

1. **One report, two envelopes** - enter a Count or bounded Sum measurement, shard it, inspect each
	aggregator's separate inputs, combine verifier shares, and add the accepted output shares.
2. **Synthetic payroll** - run twelve reports and compare the protocol aggregate with an independently
	computed plain sum.
3. **Break it yourself** - inject a four-billion-unit value into a 24-bit circuit, flip a proof-share
	field element, replay a report, or collude both aggregators. The replay submits one report twice:
	preparation runs on the duplicate and accepts it again, and the nonce registry outside the VDAF is
	what refuses it.
4. **Valid and false** - submit a correctly proven salary of zero when the sealed truth is nonzero.
	Every Prio3 check passes and the aggregate is still false.
5. **One-report disclosure** - demonstrate that private input shares do not make a one-person aggregate
	differentially private.
6. **Exact-release differencing** - run two real, equal-size twelve-slot `Prio3Sum` queries with one
	bounded slot replaced by zero, and recover that slot by subtracting the exact totals.
7. **Distributed-noise release** - clamp salaries to `$0..$250,000`, floor them to `$5,000` units,
	contribute independently activated exact discrete-Laplace noise inside the reports, and expose only
	the one noisy aggregate to the collector.
8. **Abort and retry observer model** - compare one ordinary release, one outcome-dependent abort
	with `ABORT` in the full output, publication conditioned on success, a complete capped-three retry
	transcript, and a feedback-disabled independent-abort control.
9. **Pinned evidence** - run three browser-visible checks against the official Count and Sum vectors.

## When to Use It

Use a VDAF when multiple non-colluding aggregators need an aggregate over privately submitted,
well-formed measurements. Prio3 is useful for bounded sums, counters, and related telemetry where a
malformed report must not poison the result.

Use the distributed lesson to study how output privacy needs an independently specified adjacency,
sensitivity, sampler, honest-contributor threshold, dropout rule, privacy ledger, and collector
view in addition to secure aggregation. Its deliberately small cohort and large visible error make
the privacy-utility tradeoff inspectable rather than deployment-ready.

Use the abort model to study why the complete observable transcript and the identity of the party
that sees a candidate must be specified before assigning a privacy claim. It is a bounded exact
example, not a claim that every abort is unsafe or that it reproduces an abort attack on Prio3.

Do not use this lab as a deployment library. Do not use Prio3 alone when the output also needs
differential privacy, when both aggregators may collude, or when authenticity and truthfulness of the
underlying measurement are required.

## Live Demo

[Open Proof Tally on GitHub Pages](https://systemslibrarian.github.io/crypto-lab-proof-tally/).

The page runs entirely in the browser. It creates fresh report randomness, prepares real verifier
shares, and combines accepted output shares without a backend.

## What Can Go Wrong

- An out-of-range or malformed report is rejected when the combined verifier is nonzero.
- A changed proof share fails the gadget-consistency check.
- A real deployment must keep the verification key secret from clients and commit to it before
  processing reports. This single-process lab deliberately does neither.
- A replayed report still passes preparation - its proofs are still correct, and the VDAF keeps no
  memory of reports it has seen - so the aggregate would count it twice. Replay is refused outside
  the VDAF; this lab's `NonceRegistry` rejects a 16-byte nonce it has already admitted.
- If both aggregators collude, they can reconstruct each input.
- A well-formed lie remains valid because the proof checks structure, not external truth.
- An aggregate over one report reveals that report unless a separate privacy mechanism is applied.
- Exact full-cohort and fixed-size replacement totals disclose the replaced bounded contribution by
  subtraction; input-share secrecy does not change that output fact.
- The exact-disclosure control and distributed-noise control are alternative teaching worlds. Once
  an exact overlapping total has been released, adding noise to a later answer cannot restore the
  privacy that the exact releases already lost.
- Each selectable participant scenario is likewise a separate counterfactual teaching world. The
  page retires the prior view when a control changes; its outputs must not be combined as repeated
  answers about the fixed synthetic payroll. A real deployment must compose every answer over
  overlapping records.
- The distributed lesson clamps each salary to `$0..$250,000`, floors it to `$5,000` units, and uses
  fixed-size replace-one sensitivity `50`. Changing the record unit or adjacency changes the
  calibration.
- Each honest included client activates a full `Lap_Z(50)` draw with probability `9/10`. Exactly six
  honest clients make the no-activation event `10^-6`; at least six make it at most `10^-6`, five
  make it `10^-5`, and zero make the bound vacuous. Accepted reports do not prove which clients are
  honest.
- A sampled magnitude of `4096` is allowed. A magnitude above `4096`, an incomplete cohort, a
  duplicate, or a rejected report aborts the batch without releasing a total. The UI abandons the
  batch after a cap failure and never resamples that draw; the low-level report builder itself is not
  a durable attempt ledger. The output-magnitude cap adds the analytic total-variation coupling
  bound `(1 + exp(epsilon)) * eta` to delta, where
  `eta = n * 2*exp(-B/50)/(exp(1/50)+1)`. The separately displayed decimal is explicitly a
  binary64 approximation to that expression; the exact rejection
  sampler itself has unbounded but almost-surely terminating runtime and no hidden attempt ceiling.
- The shift by `4096` lets `Prio3Sum(8242)` prove only the combined input is in range. It does not
  prove a truthful salary, correct clipping, a valid value/noise decomposition, an activation coin,
  or independent random sampling. Corrupt clients can submit valid false values or fixed noise and
  destroy utility.
- The common Prio3 context binds the batch identifier, full ordered roster, and fixed mechanism, but
  a report carries no authenticated sender-to-slot credential. `participantId` and `integrity` are
  wrapper metadata in this counterfactual harness; the latter is explicitly omniscient and neither
  is attested by Prio3. Production intake must authenticate one sender to one committed roster slot
  before invoking the release policy.
- Corrupt submissions must be fixed before the adversary can learn the honest clients' hidden
  activation bits or noise. An adversary allowed to observe that noise and then choose a canceling
  valid input is outside this privacy argument; a real protocol must enforce the required commit and
  message ordering.
- Both aggregators colluding reconstruct each shifted client contribution. Aggregate-view privacy
  requires at least one honest aggregator that does not collude, enforcement of the common committed
  cohort and one-release ledger, and no later disclosure of the honest noise. Fewer than six honest
  noise contributors invalidate the advertised activation-failure term `delta <= 10^-6`, though an
  `h`-specific weaker term may remain; the displayed total also adds the cap-coupling term.
- A committed batch has one release. Releasing it again, changing subsets, or answering overlapping
  exact queries needs explicit composition accounting; a nonce registry alone does not stop
  differencing. The browser ledger is volatile teaching state: a reload resets it, and the lab does
  not implement durable, atomic, multi-worker enforcement.
- In the separate abort model, `f(D0)=0`, `f(D1)=1`, and the ordinary additive mechanism is tight
  pure `ln(2)`-DP. If an outcome-only aborter suppresses candidates at or below `-1`, one attempt
  remains tight at ratio `2` when public `ABORT` is part of the output. That entire output is
  postprocessing of one private candidate, so the existence of an abort does not itself break DP.
- Conditioning one attempt on publication—equivalently, reporting eventual success under unbounded
  fresh retries—produces a different distribution. Its tight ratio is
  `5/2`; if the original ratio `2` is retained, the exact necessary additive term is `delta=1/10`.
  The complete capped-three public transcript records every visible abort and retry and is tight at
  ratio `8`, consistent with ordinary three-fold sequential composition. These are direct exact
  calculations for this bounded-retry teaching model, not a claim of the paper's general bounds.
  The noise itself has infinite integer support; the complete table groups that support into event
  classes on which the likelihood ratio is constant.
- The feedback-disabled control uses a fresh independent abort coin on every attempt, independent of
  the hidden candidate. Its
  complete capped transcript remains tight at ratio `2`, because visible retry count is independent
  of the dataset and only one published candidate carries dataset-dependent information. The public
  analyst never receives rejected candidate values; the outcome aborter sees one before deciding;
  the two-neighbor ledger is an explicitly omniscient teaching view.
- Zero accepted reports have no defined aggregate and are refused.

## Real-World Usage

Prio introduced private, robust aggregate statistics at scale. VDAFs generalize that construction for
systems such as Distributed Aggregation Protocol deployments. Proof Tally deliberately omits DAP's
HTTP transport and task orchestration so the report, proof, verifier, and aggregation mechanics stay
inspectable.

Primary references:

- [Verifiable Distributed Aggregation Functions, draft-22](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-vdaf-22)
- [KangarooTwelve and TurboSHAKE, RFC 9861](https://www.rfc-editor.org/rfc/rfc9861.html)
- [Prio: Private, Robust, and Scalable Computation of Aggregate Statistics](https://www.usenix.org/conference/nsdi17/technical-sessions/presentation/corrigan-gibbs)
- [Zero-Knowledge Proofs on Secret-Shared Data via Fully Linear PCPs](https://eprint.iacr.org/2019/188)
- [Distributed Aggregation Protocol](https://datatracker.ietf.org/doc/html/draft-ietf-ppm-dap)
- [Privacy-Preserving Aggregation of Time-Series Data](https://www.ndss-symposium.org/wp-content/uploads/2017/09/shi.pdf)
- [The Discrete Gaussian for Differential Privacy](https://arxiv.org/abs/2004.00010) - its Algorithms
  1 and 2 provide the exact Bernoulli and discrete-Laplace sampler used here
- [NIST SP 800-226, Guidelines for Evaluating Differential Privacy Guarantees](https://doi.org/10.6028/NIST.SP.800-226)
- [On Aborts in Differential Privacy, ePrint 2026/2059](https://eprint.iacr.org/2026/2059), received
  16 September and approved 18 September 2026. This lesson uses the aborting-mechanism and leakage
  definitions in §3
  (Definitions 5–7, PDF pp. 10–11), the single-aborter accounting in §3.1 (Lemma 1 and Theorem 1,
  pp. 11–12), and the success-conditioned conversion in §4.3 (Theorem 5, pp. 17–18). The paper's
  attacker model is abstract; it does not analyze this lab's Prio3 construction. The capped retry
  transcript and independent-feedback control here are explicit finite adaptations, derived and
  tested directly rather than presented as reproductions of a paper theorem.

## How to Run Locally

Requires Node.js 22 or later.

`​``bash
npm ci
npm run dev
`​``

For the production build:

`​``bash
npm run build
npm run preview -- --port 4686
`​``

## Related Demos

- [Silent Tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) - private aggregation vocabulary
- [DP Noise](https://systemslibrarian.github.io/crypto-lab-dp-noise/) - privacy for released aggregates
- [Jevil](https://systemslibrarian.github.io/crypto-lab-jevil/) - Goldilocks field arithmetic

## Build & Verify

`​``bash
npm test
npm run build
npx playwright install chromium
npm run test:a11y
npm run test:verdicts
npm run test:kills     # slow; replays all 70 recorded mutations
`​``

The suite currently contains 170 Vitest tests. It includes the official
`XofTurboShake128`, `Prio3Count_0`, and `Prio3Sum_0` known-answer fixtures, exact serialized verifier
shares, malformed-input rejection, proof-share tampering, aggregation, Field64 boundaries, the
replay behaviour: that preparation accepts a replayed report a second time, that the unrefused replay
doubles the aggregate, and that the registry admits a nonce exactly once - and the marker
registry described below, plus strict 16-byte report-nonce handling and input snapshotting. Sixty
focused S04 tests cover exact integer sampling, both cap endpoints, cap abort without retry,
clamp/quantization and wrap bounds, exact differencing, real `Prio3Sum(8242)` preparation, signed
post-unshard decoding, all-or-nothing delivery, corrupt/honest thresholds, one-release state, and
canonical binding of the batch, ordered cohort and every fixed mechanism parameter.

Thirteen focused abort-model tests cover reduced rational arithmetic, the exact two-sided geometric
PMF and tails, both neighboring shifts, transcript normalization, a deliberately incomplete
distribution, one-attempt postprocessing, success conditioning, all capped-three event classes,
the independent-feedback control, observer boundaries, smaller caps, and rejected cap inputs.

The Playwright gate contains 35 tests. Two drive every reachable exhibit at desktop and 380px with
reduced motion, axe WCAG 2.1 A/AA, independent text-contrast and control-boundary oracles, and reflow
checks. Five state-integrity tests also cover keyboard navigation across all four tabs, retirement
of a distributed collector view when its scenario changes, and retirement of the exact abort ledger
when its attempt cap changes. Twenty-one claims tests independently
recompute the displayed verifier sum, payroll aggregate,
range boundary, KAT count and summary word, retirement behavior, the sharded envelopes, the replayed
tally summed over its rendered contributions, the preparation verdict against the displayed combined
verifier, the tally match word against the two displayed totals, the gadget-consistency refusal, the
colluded reconstruction, both negative claims, exact-release differencing, every distributed input
transformation, the noisy aggregate, and both additive delta terms. They also prove that corruption,
dropout, collusion, cap overflow and a repeated batch release produce no aggregate. The abort-model
claim test independently rebuilds all displayed rational probabilities and tight ratios, sums both
capped transcript distributions to one, checks the attempt count and threshold, and proves that
rejected candidates do not enter the public analyst view. Seven
verdict-coverage tests, and one assertion that runs after all of them, are described below.

## Every Verdict and Every Measurement Is Computed, Marked, and Mutated

Nothing this page prints as an outcome is a fixed string, and nothing it prints as a number is
unchecked. Each rendered verdict branches on a value the page computed and carries a `data-verdict`
marker; each rendered measurement carries a `data-claim` marker and the `data-value` behind the words.

Verdicts (22): `preparation` · `tally-match` · `range-attack` · `tamper-attack` · `replay-vdaf` ·
`replay-intake` · `collusion` · `valid-lie` · `valid-lie-row` · `single-report` · `kat-summary` ·
`kat-row` · `dp-exact-disclosure` · `dp-prio-accepted` · `dp-release` · `dp-threshold-refusal` ·
`dp-dropout-refusal` · `dp-repeat-refusal` · `dp-collusion-refusal` · `dp-cap-refusal` ·
`abort-conditioned-bound` · `abort-view-boundary`

Measurements (48): `report-measurement` · `leader-share` · `helper-share` · `verifier-a` ·
`verifier-b` · `combined-verifier` · `submitted-count` · `accepted-count` · `rejected-count` ·
`protocol-aggregate` · `plain-sum` · `collusion-share-a` · `collusion-share-b` · `lie-row-reported` ·
`lie-row-sealed` · `lie-aggregate` · `lie-truth` · `single-input` · `single-aggregate` · `kat-count` ·
`replay-contribution` · `replay-total` · `replay-tally-before` · `dp-exact-full` ·
`dp-exact-neighbor` · `dp-disclosed-contribution` · `dp-exact-raw-dollars` ·
`dp-exact-clipped-dollars` · `dp-row-raw-dollars` · `dp-row-clipped-dollars` ·
`dp-row-quantized-units` · `dp-row-activation` · `dp-row-noise-units` · `dp-row-shifted-input` ·
`dp-accepted-count` ·
`dp-participant-count` · `dp-honest-count` · `dp-protocol-noisy-units` ·
`dp-noisy-release-dollars` · `dp-exact-sum` · `dp-total-noise` · `dp-delta-activation` ·
`dp-delta-cap` · `dp-delta-total` · `abort-threshold` · `abort-retry-cap` ·
`abort-probability` · `abort-ratio`

Coverage is derived by walking the rendered page, not from a list kept by hand. `driveEveryState()`
visits **every option of every control that changes what renders** - both measurement types, the
measurement input unchanged, changed and empty, all four tabs, both fixture buttons, all three
attack buttons, all seven distributed scenarios, exact differencing, successful and repeated
release, all three abort-model retry caps, and both collusion switches in both positions - each control on its own rather than the
cross-product. It is not a test; it is the denominator the rules below are applied to, so a state it
never reaches is outside all of them. The tab list's arrow keys and the limits/trace `<details>`
controls are skipped on purpose: they change visibility but introduce no new rendered markup.

`e2e/verdicts.spec.ts` drives that walk, and it and the teardown that runs after every test
fail when:

- a rendered marker of **either** family has no recorded mutation in `e2e/verdict-mutations.json`, or
  a recorded mutation names a marker the page no longer renders;
- verdict wording or verdict styling is rendered **outside** a marker - the shape a raw banner takes
  when someone adds one later. The spec injects exactly that banner, with and without the house
  styling, and fails if the audit does not catch it;
- a **measurement** is rendered outside a marker in any result region: digit-plus-unit text, or a
  bare number. A number carries none of the signals the banner rules look for, and is the easier
  mistake to make. The spec injects one of those too;
- a recorded mutation's killing assertion **did not run**. `expectVerdict()` / `expectClaim()`
  assert a marker's text **and** its state (`data-result` plus the class that paints it) in one
  call, so a mutation that flips the sentence while the pass styling stays cannot be recorded as a
  kill. `valid-lie-row`'s recorded mutation is exactly that shape: it flips only the paint, leaves
  the word `VALID` standing, and is killed on the class.

  **That last rule used to be a substring scan over the spec's source, and a scan enforces a
  mention, not an execution.** With the call commented out, `expectVerdict(page, 'tamper-attack'`
  still appeared in `claims.spec.ts`, the rule stayed green, and the page shipped
  `ADMITTED WITH A FLIPPED PROOF SHARE`, painted alarm, for a report whose proof share had been
  changed — with the recorded kill and the coverage test that polices it both green. A call in dead
  code and a call in a neighbouring test read the same way to a scan.

  So the helpers now write down the `(spec file, test title, marker)` triple they are entered with,
  into a run-scoped sink under `.verdict-run/` that `globalSetup` empties and stamps first, and
  `globalTeardown` requires every recorded mutation's triple to be in it. Playwright runs spec files
  in separate worker processes, so nothing inside a test could see this; the teardown is where the
  whole run's record exists, it is guaranteed to run last, and a throw there fails the run.

A verdict record also pins the state its marker paints on a healthy page, and the check compares
that pin to the state the killing test **handed** the helper. That catches the other half of the
same defect: a call that runs but was fed values read off the page in the same test. Such a call
asserts whatever the page says and therefore passes under every mutation — but its expectation moves
with the page, and a moving expectation no longer matches the pin.

**What that still does not reach, and what closes it.** A measurement has no state to pin. Its
expected value is derived per run, and writing one into the registry would put back exactly the
literal a derived oracle exists to remove. On an unmutated page a tautological `expectClaim()` is
observationally identical to a correct one, so no rule read on a green run can separate them. Only a
differential can, and that is `npm run test:kills` (`tools/verdict-kill.mjs`): it re-establishes the
baseline, then applies each of the 70 recorded mutations in turn and requires the test that record
names to go **red**. A survivor means the record is not evidence, whatever the source says and
whatever ran. It is slow — one rebuild and one gate run per record — so it is not part of the per-PR
gate; since 2026-10-27 it runs in full every Monday and on demand through
`.github/workflows/verdict-kill.yml` (`workflow_dispatch`), which fails on any survivor and uploads
the verdict-by-verdict log as the `verdict-kill-report` artifact. Before that it was a command only:
S04 delivery ran it once through a temporary PR-only workflow, which was removed
after its evidence was recorded. [Hosted run 40123033025](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40123033025)
reported `baseline green, 27 specs` and then `64/64 killed, 0 survived, 0 neither` for the reviewed
tree. PR-06 replayed its six new abort/retry records through the same isolated runner before its
temporary workflow was removed. [Hosted run 40203649860](https://github.com/systemslibrarian/crypto-lab-proof-tally/actions/runs/40203649860)
reported `baseline green, 28 specs` and then `6/6 killed, 0 survived, 0 neither`. Run it locally
after touching any oracle in `e2e/claims.spec.ts`. Delivery requires a green
unmutated baseline and every one of the 70 mutations killed in the same replay session.

Where a total is summed over a list, the oracle sums the rendered list rather than multiplying one
entry by a count - the payroll tally, the valid-lie ledger, and the replay tally all derive their
expected total that way.

**A number rendered inside a verdict is still a measurement.** The replay verdict's own sentence
quotes two money figures, and they escaped all three rules at once: the stray-number scan skips them
because they are already inside a marker, they carried no marker of their own, and the verdict's
assertion reads its heading and its state rather than its detail. Corrupting both by `+999` left the
whole gate green. They are now marked — `replay-tally-before` for the figure the tally moves from,
and `replay-total` reused for the figure it moves to, since that is the same claim the ledger states
— and `expectClaim()` holds both `replay-total` nodes to the one derived total.

Each of the seventy markers has a §4.1c mutation recorded with the recipe that produces it:

`​``bash
node tools/verdict-mutation.mjs list
node tools/verdict-mutation.mjs apply <marker>    # forces that one verdict to the wrong answer
CI=1 npx playwright test                          # the named test must fail on its own assertion
node tools/verdict-mutation.mjs restore <marker>

node tools/verdict-kill.mjs verify                # or all of them, checked automatically
node tools/verdict-kill.mjs verify <marker>…
`​``

`CI=1` matters: it turns off `reuseExistingServer`, so the suite cannot be served an unmutated
checkout by a server left running from an earlier pass.

The `verdict-coverage` job in `.github/workflows/deploy.yml` runs this gate as its own required
check, and `deploy` declares `needs: [build, verdict-coverage]`, so an uncovered verdict or
measurement cannot reach the live site even on a direct push to `main`.

**One thing this gate cannot decide, and what the page says because of it.** The replay exhibit
submits the same report twice, so its two contributions are equal by construction and summing them
is observationally identical to doubling one. A page rewritten to multiply the first contribution by
the contribution count passes every test here, and was run to confirm it. What the summed oracle
does buy is that no literal `2` remains in the spec, the per-submission contributions are rendered
and counted, and a page that aggregates only the first submission is killed (`replay-total`).

So the sentence beside that number claims scope and not arithmetic. It reads *Across the submissions
preparation accepted, the tally holds …*; it used to read *Summed over …*, and that word was the one
thing in it no test here could back. The rule it is an instance of: **if the page cannot show the
difference, it cannot claim it.** Making the claim provable means rendering a case where the sum and
the product differ — unequal contributions, or a third submission — which changes what the exhibit
teaches and is a deliberate design decision rather than a harness fix.

## Performance

Prio3Sum proof work grows with the configured bit width. This lab uses a 24-bit payroll bound so each
interaction remains immediate while still exercising the real circuit, polynomial, XOF, and verifier
paths. The distributed lesson's stronger six-honest activation bound deliberately adds noise whose
scale is large relative to a twelve-person payroll; the page reports the observed error and makes no
production utility or performance claim.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---
