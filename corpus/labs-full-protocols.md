# Crypto Lab audit corpus — PROTOCOLS

Generated 2026-11-08T20:20:28.593Z from 27 lab record(s).

Every finding must cite **commit_sha + lab slug + field**. A field printed as
`MISSING` was not found by the generator; it is not a claim that the lab lacks it.

---
## VSS Gate

- **slug**: `crypto-lab-vss-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-vss-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-vss-gate/
- **commit_sha**: `64df6b327e908a8177fa603bf1b91d017d6cbe28` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `1dc740c69843b1074eba8b6ce080dc2eb4e28d6f`
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: hsl(33 98% 62%)
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: VSS Gate  — _read from src/main.ts_

**Subtitle**: Feldman & Pedersen VSS · Verifiable Secret Sharing  — _read from src/main.ts_

**Description**: Watch a cheating dealer poison Shamir shares undetected, then add Feldman and Pedersen commitments so every participant can verify their share before trusting it.  — _read from src/main.ts_

**Why it matters**: Plain Shamir sharing assumes an honest dealer — a malicious one can silently hand out bad shares that only fail at reconstruction. VSS lets each holder catch the fraud immediately, and Pedersen even hides the secret from the commitments themselves.  — _read from src/main.ts_

**Card copy**: Feldman VSS and Pedersen VSS — verifiable secret sharing with live cheating dealer detection, commitment verification, and the layer beneath FROST and threshold wallets.

**Chips**: Feldman VSS · Pedersen VSS · Commitment Verification · Cheating Detection

**Implements**: Feldman VSS `src/main.ts:1388`, Pedersen commitment `src/main.ts:1410`, Shamir secret sharing `src/main.ts:695`

**Attacks shown**: Discrete log `src/main.ts:844`, Side-channel (unspecified) `src/main.ts:1110`

**References**: BLS signatures, ECDSA, FROST, Hash-to-curve

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `CRYPTO 1991` — first seen README.md:5 (4×)
- `RFC 3526` — first seen README.md:138 (4×)

**README — What Can Go Wrong**:

```text
- With plain Shamir, a malicious dealer can hand out inconsistent shares that pass naive reconstruction but corrupt the recovered secret — the exact gap VSS closes.
- Feldman commitments publish `C_j = g^{a_j} mod p`, which verifies shares but leaks information about the polynomial coefficients; it is not hiding.
- Pedersen's *binding* — not its hiding — is what rests on the second generator `h` having an unknown discrete log relative to `g`. Hiding is information-theoretic and holds unconditionally: for every candidate secret there is randomness producing the same commitment, whether or not anyone knows `log_g(h)`. Knowing `log_g(h)` does not reveal the secret; it lets the dealer *find* those alternate openings and so equivocate, which is exactly what breaks binding. This demo derives `h` deterministically from `g`, so `log_g(h)` is knowable from the source and its Pedersen binding is broken by construction — that is what makes the "What secret could this be?" panel able to compute the alternate openings it shows.
- A weak or predictable source of randomness for the polynomial coefficients destroys secrecy without breaking a single verification check — Feldman and Pedersen verify the dealer's arithmetic, not the dealer's entropy, so every badge stays green while an attacker recovers the secret from fewer than `t` shares. This lab therefore samples coefficients from `crypto.getRandomValues` only, with no `Math.random()` fallback: if Web Crypto is unavailable it halts and says why rather than degrading silently.
- BigInt arithmetic in JavaScript is not constant-time, so an implementation like this leaks via side channels and must not handle real secrets.
- Using a generator that does not span the prime-order subgroup, or mismatched participant indices, makes the verification equations and Lagrange reconstruction fail.
```

**Claims tested** (e2e/claims.spec.ts, 30 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:29
    - :29 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:56
    - :56 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:57
    - :57 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:100
    - :100 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:106
    - :106 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:118
    - :118 `toBe` expected _no expected value_ _(none)_
- `every Feldman badge is the comparison of the two operands printed beside it` — e2e/claims.spec.ts:126
    - :134 `toHaveLength` expected `4` _(literal)_
- `the tampered share fails, and only on the participant the controls name` — e2e/claims.spec.ts:138
    - :151 `toEqual` expected `['P${victim}']` _(expression)_
    - :155 `expect` expected _no expected value_ _(none)_
    - :156 `expect` expected _no expected value_ _(none)_
    - :161 `expect` expected _no expected value_ _(none)_
- `with an honest dealer every share verifies and nothing claims a catch` — e2e/claims.spec.ts:165
    - :175 `toBe` expected `true` _(expression)_
    - :176 `toBe` expected `true` _(expression)_
    - :179 `expect` expected _no expected value_ _(none)_
    - :180 `expect` expected _no expected value_ _(none)_
    - :183 `expect` expected _no expected value_ _(none)_
    - :186 `expect` expected _no expected value_ _(none)_
- `the table has one row per participant and one commitment per threshold` — e2e/claims.spec.ts:189
    - :201 `toEqual` expected `['P1', 'P2', 'P3', 'P4', 'P5', 'P6']` _(expression)_
    - :208 `toEqual` expected `[` _(expression)_
    - :213 `toBe` expected `6` _(literal)_
- `every Pedersen badge is the comparison of the operands printed beside it` — e2e/claims.spec.ts:218
    - :227 `toEqual` expected `['P2']` _(expression)_
    - :230 `expect` expected _no expected value_ _(none)_
    - :231 `expect` expected _no expected value_ _(none)_
- `blinding does not stop the tamper being caught, at any victim` — e2e/claims.spec.ts:234
    - :242 `toEqual` expected `[` _(expression)_
- `honest Pedersen shares all verify` — e2e/claims.spec.ts:248
    - :255 `toBe` expected `true` _(expression)_
    - :256 `expect` expected _no expected value_ _(none)_
- `the decomposition panel recomputes correctly from its own printed numbers` — e2e/claims.spec.ts:261
    - :272 `expect` expected _no expected value_ _(none)_
    - :280 `toBe` expected `modPow(SMALL_G, y, SMALL_P)` _(expression)_
    - :284 `expect` expected _no expected value_ _(none)_
    - :290 `expect` expected _no expected value_ _(none)_
    - :292 `toBe` expected `modPow(commitment, exponent, SMALL_P)` _(expression)_
    - :295 `toBe` expected `running` _(expression)_
    - :299 `toBe` expected `running` _(expression)_
    - :304 `expect` expected _no expected value_ _(none)_
    - :306 `expect` expected _no expected value_ _(none)_
- `the decomposition panel splits exactly when the share is tampered` — e2e/claims.spec.ts:310
    - :320 `expect` expected _no expected value_ _(none)_
    - :323 `expect` expected _no expected value_ _(none)_
    - :324 `toBe` expected `'≠'` _(literal)_
    - :329 `expect` expected _no expected value_ _(none)_
    - :330 `toBe` expected `'='` _(literal)_
- `the homomorphism panel lands on g^f(i), verified against its own factors` — e2e/claims.spec.ts:333
    - :348 `toBe` expected `modPow(SMALL_G, coefficient, SMALL_P)` _(expression)_
    - :358 `toBe` expected `product` _(expression)_
    - :363 `toBe` expected `product` _(expression)_
    - :364 `expect` expected _no expected value_ _(none)_
- `every equivocation row really opens the one published commitment` — e2e/claims.spec.ts:367
    - :383 `expect` expected _no expected value_ _(none)_
    - :394 `toBe` expected `published` _(expression)_
    - :395 `toBe` expected `published` _(expression)_
    - :400 `toBe` expected `secrets.length` _(expression)_
    - :401 `toBe` expected `1` _(literal)_
    - :403 `expect` expected _no expected value_ _(none)_
    - :407 `expect` expected _no expected value_ _(none)_
    - :408 `expect` expected _no expected value_ _(none)_
- `Shamir reconstruction misses under a cheating dealer and matches without one` — e2e/claims.spec.ts:413
    - :423 `toBe` expected `want` _(expression)_
    - :424 `expect` expected _no expected value_ _(none)_
    - :429 `toBe` expected `want` _(expression)_
    - :430 `expect` expected _no expected value_ _(none)_
- `the tampered Shamir share is the one the selector names` — e2e/claims.spec.ts:433
    - :447 `toEqual` expected `[2, 3]` _(expression)_
- `deterministic mode reproduces a run, and the seed changes it` — e2e/claims.spec.ts:452
    - :459 `toEqual` expected `first` _(expression)_
    - :463 `toEqual` expected `first` _(expression)_
    - :466 `toBe` expected `true` _(expression)_
- `turning determinism off makes successive runs differ` — e2e/claims.spec.ts:469
    - :474 `toBeDisabled` expected _no expected value_ _(none)_
    - :478 `toEqual` expected `first` _(expression)_
    - :481 `toBe` expected `true` _(expression)_
- `Pedersen commitments repeat under a fixed seed and move without one` — e2e/claims.spec.ts:484
    - :503 `toEqual` expected `new Set(['same'])` _(expression)_
    - :508 `toEqual` expected `new Set(['changed'])` _(expression)_
- `the comparison says which run it is reporting on` — e2e/claims.spec.ts:513
    - :519 `toBeChecked` expected _no expected value_ _(none)_
    - :520 `expect` expected _no expected value_ _(none)_
    - :523 `toBeVisible` expected _no expected value_ _(none)_
    - :526 `toHaveLength` expected `2` _(literal)_
    - :527 `toBe` expected `true` _(expression)_
    - :530 `expect` expected _no expected value_ _(none)_
    - :531 `expect` expected _no expected value_ _(none)_
- `changing any control retires the Feldman table it was not computed under` — e2e/claims.spec.ts:549
    - :558 `toBeVisible` expected _no expected value_ _(none)_
    - :562 `expect` expected _no expected value_ _(none)_
    - :566 `expect` expected _no expected value_ _(none)_
    - :569 `expect` expected _no expected value_ _(none)_
- `changing any control retires the Pedersen table and the comparison` — e2e/claims.spec.ts:573
    - :583 `toBeVisible` expected _no expected value_ _(none)_
    - :587 `expect` expected _no expected value_ _(none)_
    - :591 `expect` expected _no expected value_ _(none)_
- `advanced mode reveals internals without invalidating the run` — e2e/claims.spec.ts:598
    - :604 `expect` expected _no expected value_ _(none)_
    - :611 `toEqual` expected `before` _(expression)_
    - :613 `expect` expected _no expected value_ _(none)_
- `a secret that is not an integer is named, not silently replaced` — e2e/claims.spec.ts:620
    - :627 `expect` expected _no expected value_ _(none)_
    - :631 `toHaveClass` expected `/warning/` _(regex)_
    - :632 `expect` expected _no expected value_ _(none)_
    - :633 `expect` expected _no expected value_ _(none)_
    - :634 `expect` expected _no expected value_ _(none)_
    - :643 `toBe` expected `1n` _(expression)_
    - :646 `toHaveClass` expected `/warning/` _(regex)_
    - :647 `expect` expected _no expected value_ _(none)_
- `the lab halts with an explanation when there is no secure RNG` — e2e/claims.spec.ts:650
    - :658 `toBeVisible` expected _no expected value_ _(none)_
    - :665 `toBeVisible` expected _no expected value_ _(none)_
    - :666 `toHaveAttribute` expected `'role', 'alert'` _(expression)_
    - :668 `expect` expected _no expected value_ _(none)_
    - :669 `expect` expected _no expected value_ _(none)_
    - :671 `expect` expected _no expected value_ _(none)_
- `nothing carrying the hidden attribute is still painted` — e2e/claims.spec.ts:676
    - :682 `toBeVisible` expected _no expected value_ _(none)_
    - :692 `toEqual` expected `[]` _(expression)_
- `the page never claims this Pedersen instance is production-safe` — e2e/claims.spec.ts:695
    - :703 `toBe` expected `true` _(expression)_
    - :704 `expect` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-vss-gate

## What It Is

An educational cryptography lab demonstrating **Feldman VSS (FOCS 1987)** and **Pedersen VSS (CRYPTO 1991)** — the two foundational constructions that add verifiability to Shamir's Secret Sharing.

An interactive, browser-based lab that teaches:

- Why Shamir SSS alone fails when the dealer is malicious
- How Feldman commitments let participants verify shares immediately
- How Pedersen adds information-theoretic hiding with blinded commitments
- What setup assumptions each protocol requires

The lab includes a guided four-step flow (Break Shamir → Feldman Fix → Pedersen Upgrade → Compare), an interactive curve visualization that draws shares as points on the secret polynomial (and shows a tampered share jumping off the curve), pass/fail verification badges, beginner/advanced mode toggle, deterministic reproducibility, and a full test suite. Because a 2048-bit integer is unreadable, the verification mechanism is also mirrored over a tiny illustrative prime field (`p = 2039`) so you can watch the check succeed or fail digit by digit — the same algebra, small enough to read.

## Exhibits

1. **Break Shamir** — a malicious dealer flips one share; reconstruction is silently poisoned because plain Shamir carries no proof of polynomial consistency.
2. **The picture** — every participant is a point on one degree-`(t−1)` polynomial (secret at `x = 0`); a tampered share visibly lifts off the curve.
3. **Feldman Fix** — publishes commitments `C_j = g^{a_j}` and verifies `g^{y_i} = ∏ C_j^{i^j}`. Reveal panels: **Watch the check work** decomposes the equation term by term in the readable field (LHS `g^y` vs the RHS product, with the mismatching tail highlighted when a share is tampered), and **Why the equation is even true** walks the homomorphism `g^{a+b} = g^a·g^b` in three stages, showing how recombined commitments land exactly on `g^{f(i)}`.
4. **Pedersen Upgrade** — blinded commitments `C_j = g^{f_j}·h^{r_j}`. A **What secret could this be?** panel opens one published commitment to several different secrets, each with its own randomness but the identical commitment — information-theoretic hiding, demonstrated rather than asserted.
5. **Side-by-side comparison** — Feldman vs Pedersen on hiding, binding, setup assumption, and share size.
6. **Threat model, crypto parameters, and learning path** — attacker capabilities, group choices, and where VSS leads (DKG, threshold signatures, MPC).

## When to Use It

- Use it to teach the dealer-cheating problem, because it shows that Shamir shares alone carry no proof of polynomial consistency.
- Use it to compare Feldman and Pedersen side by side, because the four-step flow makes the no-extra-setup / coefficient-leak tradeoff concrete.
- Use it to explain VSS as the verification layer beneath DKG and threshold signatures, because every serious threshold deployment relies on it.
- Do NOT use it for real key management — it is a teaching demo: not audited, not constant-time, and the Pedersen generator `h` is derived with a knowable discrete log.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-vss-gate](https://systemslibrarian.github.io/crypto-lab-vss-gate/)**

The lab runs a guided four-step flow — Break Shamir → Feldman Fix → Pedersen Upgrade → Compare — that first shows a malicious dealer slipping a bad share past plain Shamir, then watches Feldman commitments catch it, then upgrades to Pedersen for information-theoretic hiding, and finally contrasts the two. A live curve visualization makes the geometry concrete: every participant is a point on a single degree-`(t−1)` polynomial whose value at `x = 0` is the secret, and tampering with a share visibly lifts its point off the curve. Pass/fail verification badges, a beginner/advanced mode toggle, and deterministic reproducibility let you change shares and watch verification accept or reject them live.

## What Can Go Wrong

- With plain Shamir, a malicious dealer can hand out inconsistent shares that pass naive reconstruction but corrupt the recovered secret — the exact gap VSS closes.
- Feldman commitments publish `C_j = g^{a_j} mod p`, which verifies shares but leaks information about the polynomial coefficients; it is not hiding.
- Pedersen's *binding* — not its hiding — is what rests on the second generator `h` having an unknown discrete log relative to `g`. Hiding is information-theoretic and holds unconditionally: for every candidate secret there is randomness producing the same commitment, whether or not anyone knows `log_g(h)`. Knowing `log_g(h)` does not reveal the secret; it lets the dealer *find* those alternate openings and so equivocate, which is exactly what breaks binding. This demo derives `h` deterministically from `g`, so `log_g(h)` is knowable from the source and its Pedersen binding is broken by construction — that is what makes the "What secret could this be?" panel able to compute the alternate openings it shows.
- A weak or predictable source of randomness for the polynomial coefficients destroys secrecy without breaking a single verification check — Feldman and Pedersen verify the dealer's arithmetic, not the dealer's entropy, so every badge stays green while an attacker recovers the secret from fewer than `t` shares. This lab therefore samples coefficients from `crypto.getRandomValues` only, with no `Math.random()` fallback: if Web Crypto is unavailable it halts and says why rather than degrading silently.
- BigInt arithmetic in JavaScript is not constant-time, so an implementation like this leaks via side channels and must not handle real secrets.
- Using a generator that does not span the prime-order subgroup, or mismatched participant indices, makes the verification equations and Lagrange reconstruction fail.

## Real-World Usage

- Verifiable secret sharing is the integrity layer beneath Distributed Key Generation (DKG) in threshold systems.
- Threshold signature protocols such as FROST and GG20 rely on VSS-style checks during key generation.
- Modern threshold-ECDSA libraries (for example DKLS23-based implementations) use verifiable sharing to detect cheating dealers.
- Institutional threshold wallets and custody systems use VSS so no single dealer can compromise the shared key.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-vss-gate
cd crypto-lab-vss-gate
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-shamir-gate](https://systemslibrarian.github.io/crypto-lab-shamir-gate/) — plain Shamir secret sharing, the scheme VSS adds verifiability to.
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — FROST threshold signatures, which use VSS commitments during key generation.
- [crypto-lab-gg20-wallet](https://systemslibrarian.github.io/crypto-lab-gg20-wallet/) — threshold-ECDSA distributed key generation built on verifiable sharing.
- [crypto-lab-threshold-decrypt](https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/) — `t-of-n` threshold decryption that depends on a verifiable DKG.
- [crypto-lab-silent-tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) — Shamir-based secure aggregation, another application of secret sharing.

## What This Project Is NOT

- **Not production-ready.** This code has not been audited and is not suitable for real key management.
- **Not constant-time.** BigInt arithmetic in JavaScript is not side-channel resistant.
- **Not a secure Pedersen implementation.** The second generator `h` is derived deterministically from `g`, meaning `log_g(h)` is knowable. A real deployment must choose `h` so no one knows this discrete log. See the warning below.

> **⚠️ Demo Integrity Note**
>
> This demo illustrates Pedersen verification mechanics.
> In a real system, the generator `h` must be chosen so that no one knows its discrete log relative to `g`.
> This implementation derives `h` deterministically for demonstration purposes only and is **NOT secure for production use**.

## Why This Matters

VSS is a foundational building block in modern threshold cryptography:

`​``
Shamir Secret Sharing
        ↓
Verifiable Secret Sharing (Feldman / Pedersen)
        ↓
Distributed Key Generation (DKG)
        ↓
Threshold Signatures (FROST, etc.)
        ↓
Secure MPC Systems
`​``

Every serious threshold deployment — FROST, GG20, DKLS23, threshold wallets — relies on VSS integrity checks. Understanding Feldman and Pedersen explains the verification layer behind all of them.

## Learning Goals

After completing the four-step guided lab, you should understand:

1. **The dealer cheating problem**: Shamir shares alone carry no proof of polynomial consistency.
2. **Commitment-based verification**: Feldman publishes `C_j = g^{a_j} mod p` so participants verify `g^{y_i} = ∏ C_j^{x_i^j}`.
3. **Pedersen's stronger hiding**: Dual commitments `C_j = g^{a_j} · h^{r_j}` yield information-theoretic hiding, trading Feldman's perfect binding for binding that is only computational — and that is what the trusted setup for `h` buys back.
4. **Feldman vs Pedersen tradeoffs**: Feldman requires no extra setup but leaks coefficient information. Pedersen hides coefficients but requires independent `h`.

## Test Suite

`​``bash
npm test             # unit tests (vitest), single run
npm run test:watch   # watch mode
npm run test:browser # Playwright: 24 claims tests + 2 axe scans
`​``

Unit tests cover:
- Feldman valid shares pass / tampered share fails
- Pedersen valid shares pass / tampered share fails
- Lagrange reconstruction returns original secret
- Deterministic polynomial generation is stable
- Subgroup generator validation (G^Q = 1, H^Q = 1)
- Readable small-field instance: safe-prime/subgroup checks, Feldman decomposition product equals RHS, tampered share fails, homomorphism recombination lands on `g^{f(i)}`, and Pedersen equivocation yields one commitment from many secrets

`e2e/claims.spec.ts` covers what the *page* claims, driving the real UI in headless Chromium. It asserts no fixed cryptographic values — every expectation is one page-computed value checked against another, or a small-field number recomputed from the page's own printed operands. In particular: each verification badge must equal the comparison of the LHS and RHS printed beside it; each `C_j^(i^j)` and running product in the "Watch the check work" chain must be the modular arithmetic it says it is; the homomorphism panel's recombination must land on the `g^{f(i)}` it prints; and every equivocation row's `(s, r)` must genuinely open the one published commitment. It also drives the failure paths (tampered share at every victim, non-integer secret, no secure RNG) and asserts that no verification table outlives the controls that produced it. Both suites, plus the axe-core WCAG A/AA scan in both themes, run in CI before every deploy.

## Crypto Parameter Choices

In random mode, rejection sampling draws polynomial coefficients and every Pedersen
blinder (including `r0`) uniformly from the whole scalar field `[0, q)`. Zero is
valid, including as the highest-degree coefficient; nonzero restrictions belong
to group generators, not these scalars. Perfect-hiding statements assume this
full-field randomness. The seeded deterministic walkthrough is reproducible and
explicitly **not for secrecy**. The known-log `h` binding limitation remains separate.

| Parameter | Value | Reason |
|-----------|-------|--------|
| `p` | RFC 3526 Group 14 (2048-bit safe prime) | Prime field with clean algebraic structure and inverses |
| `q = (p-1)/2` | Large prime | Prime-order subgroup for stable exponent arithmetic |
| `g = 4` | Subgroup generator (2² mod p) | Spans the full order-q subgroup |
| `h` | Derived from `g` deterministically | **Demo only.** Real systems need `h` with unknown `log_g(h)` |

## Protocol References

- **Feldman, P.** "A Practical Scheme for Non-interactive Verifiable Secret Sharing." *FOCS 1987.*
- **Pedersen, T. P.** "Non-Interactive and Information-Theoretic Secure Verifiable Secret Sharing." *CRYPTO 1991.*

## GitHub Pages Setup

Deploys automatically via GitHub Actions using [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

Required one-time setting: `Settings → Pages → Source → GitHub Actions`.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## DKG Gate

- **slug**: `crypto-lab-dkg-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-dkg-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-dkg-gate/
- **commit_sha**: `154eea80374ae0d9952c813b4e3de7eeffda4963` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: #4a9dd6
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: DKG Gate  — _read from index.html_

**Subtitle**: Pedersen DKG · Gennaro et al. 1999  — _read from index.html_

**Description**: Runs a real dealerless key-generation ceremony — n parties Feldman-deal to each other, complaints throw out cheaters, and the sharings sum into one t-of-n key — then lets you cheat as a dealer and bias the key the way GJKR showed.  — _read from index.html_

**Why it matters**: Every threshold wallet, validator set, and MPC signer assumes key shares that already exist — but a dealer who hands them out is a single point of total compromise. DKG is how shares come to exist with nobody to trust, and getting it subtly wrong lets an attacker steer the "jointly random" key.  — _read from index.html_

**Card copy**: Pedersen/GJKR dealerless key generation — n parties Feldman-deal to each other, public complaints disqualify cheating dealers, and the sharings sum into one t-of-n key nobody ever held. Includes the rushing-adversary bias attack and its fix.

**Chips**: Pedersen DKG · GJKR 1999 · Feldman VSS · ristretto255

**Implements**: Feldman VSS `src/dkg/dkg.ts:32`, Hash-to-curve `src/dkg/group.ts:29`, Pedersen commitment `src/dkg/pedersen.ts:29`, ristretto255 `src/dkg/group.ts:13`, SHA-512 `src/dkg/testutil.ts:12`

**Attacks shown**: Discrete log `README.md:53`

**Comment-only (named in code comments, not executed)**: EC point arithmetic `src/dkg/group.ts:47`, Shamir secret sharing `src/dkg/poly.ts:2`

**References**: EC point arithmetic, ECDSA, Ed25519, FROST, Schnorr, Shamir secret sharing

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `RFC 9380` — first seen src/dkg/group.ts:25 (1×)
- `RFC 9496` — first seen README.md:19 (4×)
- `rfc9496` — first seen README.md:84 (2×)

**README — What Can Go Wrong**:

```text
- **A malicious dealer** deals shares inconsistent with its commitments. Caught by the public complaint round; the same equation every honest party can run decides the outcome, so honesty is not a matter of trust. (Exhibit 1.)
- **A rushing adversary** biases the joint key by choosing which of its own dealers survive to `QUAL` after seeing all contributions. This is the real flaw in naive Pedersen DKG, and the reason GJKR exists. (Exhibit 3.)
- **Too many disqualifications** leave fewer than `t` honest dealers. The protocol **aborts with no key** rather than emitting a weak one.
- **Reconstructing the secret** onto one machine — which this demo does in Exhibit 2 as an X-ray — is exactly what threshold *use* protocols avoid; doing it in production would defeat the entire point.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# DKG Gate

**Pedersen DKG · Gennaro–Jarecki–Krawczyk–Rabin (GJKR), 1999**

A dealerless distributed key generation you can run, break, and bias in the browser. `n` parties jointly produce one public key and a `t`-of-`n` secret sharing of the matching private key — with no trusted dealer, and with nobody ever holding the whole secret. Then you get to cheat as a dealer and watch the protocol catch you, and mount the specific attack GJKR wrote their paper to close.

**Live demo → https://systemslibrarian.github.io/crypto-lab-dkg-gate/**

## What It Is

Threshold cryptography always begins with the same hand-wave: *"assume the parties already hold shares of a secret key."* **DKG is how those shares come to exist without anyone being trusted to deal them.**

The primitives, exactly:

- **Pedersen's DKG** (a.k.a. Joint-Feldman): every party runs a **Feldman VSS** as a dealer toward all the others, and the `n` independent sharings are summed coefficient-wise into one joint sharing. The group public key is `PK = Σ A₀` over the qualified dealers; each party's long-term share is the sum of the shares it received.
- **Feldman VSS** is the per-dealer commitment layer: the dealer broadcasts `A_j = a_j·G` ("the polynomial in the exponent") so any share `s` is publicly checkable via `s·G = Σ_j iʲ·A_j`. Provable cheating, not trusted honesty.
- **The GJKR fix.** Naive Pedersen DKG is *biasable*: a rushing adversary who controls `k` dealers sees every contribution before choosing which of its own dealers to sacrifice to the complaint round, and that choice steers the "random" key among `2ᵏ` values. GJKR's fix is **commit-then-reveal** with *hiding* **Pedersen commitments** `C_j = a_j·G + b_j·H` — the qualified set is fixed while every contribution is still information-theoretically hidden.

Group arithmetic is **ristretto255** (RFC 9496) via [`@noble/curves`](https://github.com/paulmillr/noble-curves); every field, polynomial, VSS, complaint, and attack is hand-rolled in `src/dkg/` so the mechanism is inspectable.

**Not production crypto — a teaching demo.** One browser tab plays all `n` parties, so the "private channels" between them are deliberately visible; a real deployment runs one party per machine over authenticated broadcast. The math is real; the isolation is simulated on purpose, and labelled where it is.

## Exhibits

1. **The ceremony (with break-it cheating)** — step Pedersen's DKG round by round for your choice of `n` and `t`: round 1 (every party deals), round 2 (everyone verifies against public commitments), complaints & reveals, the qualified set, and key assembly. The share-delivery matrix shows every dealt share; the assembly panel shows `PK` built as a live sum of contributions. Arm one dealer to send a corrupted share and watch the victim raise a public **complaint**: the dealer either **doubles down** (its reveal fails the same public check → disqualified, entire contribution discarded) or **backs down** (reveals the correct share → stays qualified, victim adopts it). With `t = n`, one disqualification drops `QUAL` below `t` and the ceremony **aborts with no key** — fail closed.
2. **Prove the threshold** — pick any subset of the real final shares, Lagrange-reconstruct, and **compare `reconstructed·G` against the ceremony's `PK` byte for byte.** `t` shares regenerate the key; `t−1` land on a wrong secret — shown, not asserted.
3. **Bias the key — the GJKR attack & fix** — run the real rushing-adversary attack against naive commitments: all `2ᵏ` candidate keys are enumerated as genuine subset sums, and the adversary steers the final key to a target. Flip on the GJKR hiding commitments and the same lever produces only blind `1/16` luck. A ×20 batch counts the empirical success rate against theory.

**A note on scope.** The runnable ceremony (Exhibit 1) is **Pedersen's DKG / Joint-Feldman** — every party deals a Feldman VSS and the sharings sum into one key, with public complaints and fail-closed qualification. Exhibit 3 then **models the specific attack GJKR (1999) closes and its fix**: it uses real hiding Pedersen commitments and real subset-sum key math to show why a rushing adversary can bias the naive key and why commit-then-reveal removes the information to aim with. It is a faithful model of the bias and the fix, **not** a second full commit-then-reveal ceremony with a separate Feldman-extraction phase — the insight is the teaching target, and it is exact.

## When to Use It

- **Use DKG** whenever a threshold system needs a key that no single party is trusted to have generated: threshold wallets, validator/consensus keys, distributed randomness beacons, MPC signing setups.
- **Do NOT use a hand-rolled DKG in production**, and do not use *this* one anywhere real. Use an audited implementation of a well-specified variant (e.g. FROST's DKG, or a GJKR implementation) with authenticated channels and the security model your deployment actually faces.
- **Do NOT reach for DKG when a trusted dealer is acceptable** — if one party may generate and split the key, plain [Shamir](https://systemslibrarian.github.io/crypto-lab-shamir-gate/) or [VSS](https://systemslibrarian.github.io/crypto-lab-vss-gate/) is simpler.

## Live Demo

At the [live site](https://systemslibrarian.github.io/crypto-lab-dkg-gate/) you can choose `n`, `t`, and a cheating configuration; step the ceremony or run it all at once; reconstruct the secret from any share subset; and run the biasing attack with and without the fix. Everything computes in-browser on real ristretto255 points — no backend, no persistence.

## What Can Go Wrong

- **A malicious dealer** deals shares inconsistent with its commitments. Caught by the public complaint round; the same equation every honest party can run decides the outcome, so honesty is not a matter of trust. (Exhibit 1.)
- **A rushing adversary** biases the joint key by choosing which of its own dealers survive to `QUAL` after seeing all contributions. This is the real flaw in naive Pedersen DKG, and the reason GJKR exists. (Exhibit 3.)
- **Too many disqualifications** leave fewer than `t` honest dealers. The protocol **aborts with no key** rather than emitting a weak one.
- **Reconstructing the secret** onto one machine — which this demo does in Exhibit 2 as an X-ray — is exactly what threshold *use* protocols avoid; doing it in production would defeat the entire point.

## Threat Model, Property by Property

Two different numbers govern the claims: `t` is the **reconstruction threshold** (`t` shares rebuild the secret, `t−1` do not); `f` is **how many parties the adversary corrupts**. They are not the same quantity, and each property has its own bound on `f`:

- **Correctness & agreement** (all finishers agree on `QUAL` and `PK`): any number of cheating dealers, because complaints are decided by a public equation — but only under the synchronous rounds and reliable broadcast this demo simulates in one tab. Implemented and tested.
- **Secrecy of the group secret**: a coalition of `f ≤ t−1` share holders cannot reconstruct (Shamir's bound); secrecy is computational (discrete log) because Feldman commitments publish each dealer's `A₀ = a₀·G`. Exhibit 2's reconstruction X-ray deliberately violates it on screen, and says so.
- **Output uniformity**: fails against a rushing adversary with even one corrupted dealer in the naive flow (Exhibit 3's attack); restored by GJKR commit-then-reveal, which Exhibit 3 models.
- **Availability** (finishing; later `t`-of-`n` use): needs `≥ t` qualified dealers and later `≥ t` responsive holders, so tolerates `f ≤ n−t` withholding or crashed parties. Message loss is otherwise unmodeled.
- **Channels**: authenticated private dealer-to-holder channels and reliable synchronous broadcast are assumed; one tab playing all parties makes equivocation impossible by construction here, not defended against.
- **Corruption model**: static, fixed before the run. Rushing appears only in Exhibit 3; adaptive corruption and denial of service are unmodeled.

## Real-World Usage

DKG underpins production threshold systems: FROST and GG20 threshold signatures (custody, multi-party wallets), distributed validator keys in proof-of-stake, DKG-based randomness beacons (e.g. drand-style), and MPC key-management services. The Pedersen/GJKR line is the classical synchronous, honest-majority foundation those build on.

## How to Run Locally

`​``bash
npm install
npm run dev        # serve at the Vite dev URL
npm test           # Vitest unit tests + spec KATs
npm run build      # typecheck (tsc --noEmit) + production build
npm run test:a11y  # axe-core WCAG gate on the production build (needs: npx playwright install chromium)
`​``

## Related Demos

- [crypto-lab-vss-gate](https://systemslibrarian.github.io/crypto-lab-vss-gate/) — one dealer, verifiable secret sharing; the layer this demo composes `n` times.
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — threshold Schnorr signing that *consumes* DKG shares.
- [crypto-lab-threshold-decrypt](https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/) — threshold decryption over shared keys.
- [crypto-lab-reshare-circle](https://systemslibrarian.github.io/crypto-lab-reshare-circle/) — proactive share refresh, the "re-deal to heal compromise" step.
- [crypto-lab-gg20-wallet](https://systemslibrarian.github.io/crypto-lab-gg20-wallet/) — an ECDSA threshold wallet end to end.

## Build & Verify

- **96 unit tests** (Vitest), colocated as `src/dkg/*.test.ts`, run in CI before every deploy.
- **52 spec KATs** from **RFC 9496** (ristretto255): 16 generator multiples, 29 rejected invalid encodings, 7 one-way-map vectors — in `src/dkg/rfc9496.test.ts`. The scalar field constant `L` is pinned to the library's group order in `src/dkg/field.test.ts`.
- Correctness suites prove: every honest share verifies and every bad one is rejected (`feldman.test.ts`, `pedersen.test.ts`); any `t` final shares reconstruct `PK` while `t−1` do not (`dkg.test.ts`); a doubling-down cheater is disqualified and a backing-down one is absorbed; `|QUAL| < t` aborts fail-closed; and the rushing-adversary bias is real against naive commitments and neutralized under the GJKR fix (`bias.test.ts`).
- **Accessibility gate:** `@axe-core/playwright` scans the production build for zero WCAG 2.1 A/AA violations in **both** themes, driving every exhibit into its post-interaction state first. The GitHub Pages deploy is blocked on any regression.

## Performance

Everything is a handful of ristretto255 scalar multiplications per interaction — imperceptible in-browser. The bias exhibit enumerates `2ᵏ` (≤ 32) subset sums per run; the ×20 batch is still instant.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Garbled Gate

- **slug**: `crypto-lab-garbled-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-garbled-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-garbled-gate/
- **commit_sha**: `265415623355e3149e06ba8a59400b26bc790526` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: #7c8aff
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Garbled Gate  — _read from src/main.ts_

**Subtitle**: Yao's Garbled Circuits · secure two-party computation  — _read from src/main.ts_

**Description**: Watch one AND gate get garbled, one padlock row unlock via oblivious transfer, and a whole comparator decide who's richer — without either party revealing a bit.  — _read from src/main.ts_

**Why it matters**: Garbled circuits let mutually distrustful parties compute on private data — auctions, medical stats, key management — with no trusted referee. The evaluator learns only the answer, never the other side's inputs.  — _read from src/main.ts_

**Card copy**: Yao’s Garbled Circuits — gate-by-gate garbling, oblivious transfer for input wires, and the Millionaire’s Problem solved end-to-end. The foundational two-party MPC protocol.

**Chips**: Garbled Circuits · Oblivious Transfer · Free XOR · Two-Party MPC

**Implements**: AES `src/yao.ts:236`, AES-GCM `src/yao.ts:240`, Ed25519 `src/yao.ts:1`, Garbled circuits `src/main.ts:17`, SHA-256 `src/yao.ts:255`

**Attacks shown**: _none derived_

**References**: ECDSA, FROST, Oblivious transfer, Private information retrieval, Private set intersection, Schnorr, Shamir secret sharing, X25519, ristretto255

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `EUROCRYPT 2015` — first seen src/main.ts:488 (1×)

**README — What Can Go Wrong**:

```text
- **Reusing a garbled circuit.** A garbled circuit is single-use; evaluating two input sets under the same wire labels leaks information, so each evaluation needs fresh garbling.
- **Semi-honest assumption broken.** A malicious garbler can garble the wrong function or feed inconsistent labels; defending against this needs cut-and-choose or authenticated garbling, with real overhead.
- **Weak or broken Oblivious Transfer.** OT is what stops the evaluator from learning both input labels; a flawed OT undermines the entire privacy guarantee.
- **Selective-failure attacks.** If the garbler can make evaluation succeed or fail depending on the evaluator's private input, the abort itself leaks a bit — a known pitfall that careful protocol design must close.
- **Insufficient wire-label entropy / encryption misuse.** Predictable labels or reused AES keys/nonces in the gate encryption can let an evaluator decrypt rows it should not, collapsing the security of point-and-permute.
```

**Claims tested** (e2e/claims.spec.ts, 23 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:33
    - :33 `toHaveAttribute` expected `'aria-busy', 'true'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:34
    - :34 `toBeEnabled` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:58
    - :58 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:69
    - :69 `toBeEnabled` expected `{ timeout: 30000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:70
    - :70 `toContainText` expected `'Evaluating: 0 /'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:78
    - :78 `toContainText` expected `'Gate ${i}/${gateCount}'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:109
    - :109 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:112
    - :112 `toEqual` expected `[]` _(expression)_
- `all six exhibits plus the honest-implementation notes render` — e2e/claims.spec.ts:117
    - :119 `toBeVisible` expected _no expected value_ _(none)_
    - :121 `toBeVisible` expected _no expected value_ _(none)_
    - :122 `toBeVisible` expected _no expected value_ _(none)_
    - :125 `toEqual` expected `['#ex1', '#ex2', '#ex3', '#ex4', '#ex5', '#ex6']` _(expression)_
    - :128 `toContainText` expected `'Cofactor 8'` _(literal)_
    - :129 `toContainText` expected `'semi-honest'` _(literal)_
    - :130 `toContainText` expected `'Free XOR'` _(literal)_
- `Exhibit 1: the verdict matches the quantised inputs the page reports` — e2e/claims.spec.ts:135
    - :146 `toHaveText` expected `'$${alice}M'` _(expression)_
    - :147 `toHaveText` expected `'$${bob}M'` _(expression)_
    - :151 `toContainText` expected `'Alice ${alice} →'` _(expression)_
    - :152 `toContainText` expected `'Bob ${bob} →'` _(expression)_
    - :158 `expect` expected _no expected value_ _(none)_
    - :161 `expect` expected _no expected value_ _(none)_
    - :162 `expect` expected _no expected value_ _(none)_
    - :163 `expect` expected _no expected value_ _(none)_
    - :164 `expect` expected _no expected value_ _(none)_
    - :165 `toHaveText` expected `expectedVerdict(a3, b3)` _(expression)_
- `Exhibit 2: point-and-permute opens exactly the slot the colour bits name, for all four inputs` — e2e/claims.spec.ts:171
    - :177 `toHaveCount` expected `4` _(literal)_
    - :180 `toEqual` expected `['slot 0', 'slot 1', 'slot 2', 'slot 3']` _(expression)_
    - :193 `toContainText` expected `'A${a}'` _(expression)_
    - :194 `toContainText` expected `'B${b}'` _(expression)_
    - :198 `expect` expected _no expected value_ _(none)_
    - :201 `toBe` expected `(c0 << 1) | c1` _(expression)_
    - :205 `expect` expected _no expected value_ _(none)_
    - :206 `toBe` expected `a & b` _(expression)_
    - :210 `toHaveCount` expected `1` _(literal)_
    - :211 `toHaveText` expected `'slot ${slot}'` _(expression)_
    - :212 `toHaveText` expected `'${c0}${c1}'` _(expression)_
    - :213 `toContainText` expected `'colour bits match → Bob opens this one'` _(literal)_
    - :214 `toHaveCount` expected `3` _(literal)_
- `Exhibit 2: before the mapping is revealed the output label stays opaque` — e2e/claims.spec.ts:218
    - :225 `toContainText` expected `'opaque'` _(literal)_
    - :226 `toContainText` expected `"Bob can't read the bit yet"` _(literal)_
    - :227 `toMatch` expected `/output bit \d/` _(regex)_
    - :229 `toHaveCount` expected `0` _(literal)_
    - :233 `toContainText` expected `'output bit 1'` _(literal)_
    - :234 `toHaveCount` expected `1` _(literal)_
- `Exhibit 2 failure path: trial-decrypting all four rows rejects three of them, and says why` — e2e/claims.spec.ts:237
    - :248 `toBeVisible` expected _no expected value_ _(none)_
    - :250 `toHaveCount` expected `4` _(literal)_
    - :251 `toHaveCount` expected `1` _(literal)_
    - :252 `toHaveCount` expected `3` _(literal)_
    - :253 `toContainText` expected `'opens ✓'` _(literal)_
    - :255 `toContainText` expected `'GCM rejects ✗'` _(literal)_
    - :259 `toBe` expected `true` _(expression)_
    - :262 `toHaveCount` expected `3` _(literal)_
    - :264 `toContainText` expected `'wrong key — GCM rejects'` _(literal)_
    - :266 `toHaveCount` expected `1` _(literal)_
    - :267 `toContainText` expected `'GCM tag verified → opens'` _(literal)_
    - :268 `toContainText` expected `'exactly one authenticates'` _(literal)_
- `Exhibit 2: re-garbling mints fresh labels and re-locks every row` — e2e/claims.spec.ts:271
    - :277 `toHaveCount` expected `1` _(literal)_
    - :280 `toHaveCount` expected `0` _(literal)_
    - :281 `toHaveCount` expected `4` _(literal)_
    - :282 `toContainText` expected `'Garbled.'` _(literal)_
    - :284 `toHaveLength` expected `6` _(literal)_
    - :285 `toEqual` expected `firstLabels` _(expression)_
- `Exhibit 3: exactly one OT box opens; the other says why it stays sealed` — e2e/claims.spec.ts:290
    - :298 `toHaveClass` expected `/ot-box-open/` _(regex)_
    - :299 `toHaveClass` expected `/ot-box-open/` _(regex)_
    - :300 `toHaveCount` expected `1` _(literal)_
    - :301 `toContainText` expected `"stays sealed — Bob can't derive this key"` _(literal)_
    - :305 `toContainText` expected `'folds in his choice ${choice}'` _(expression)_
    - :308 `expect` expected _no expected value_ _(none)_
    - :309 `toBe` expected `choice` _(expression)_
    - :310 `toContainText` expected `recovered![2]` _(expression)_
    - :311 `expect` expected _no expected value_ _(none)_
    - :312 `expect` expected _no expected value_ _(none)_
- `Exhibit 4: the meter, the checklist and the efficiency line agree with each other` — e2e/claims.spec.ts:318
    - :331 `toBe` expected `gates` _(expression)_
    - :332 `expect` expected _no expected value_ _(none)_
    - :333 `expect` expected _no expected value_ _(none)_
    - :336 `expect` expected _no expected value_ _(none)_
    - :337 `toBe` expected `0` _(literal)_
    - :340 `toBe` expected `Math.round(xor * 4 * avgRow)` _(expression)_
    - :346 `expect` expected _no expected value_ _(none)_
    - :347 `expect` expected _no expected value_ _(none)_
    - :348 `toBe` expected `5` _(literal)_
    - :349 `toBe` expected `3` _(literal)_
    - :350 `toBe` expected `ots` _(expression)_
    - :351 `expect` expected _no expected value_ _(none)_
    - :352 `expect` expected _no expected value_ _(none)_
    - :356 `expect` expected _no expected value_ _(none)_
    - :357 `expect` expected _no expected value_ _(none)_
    - :358 `expect` expected _no expected value_ _(none)_
- `Exhibit 4: the verdict matches the output bits the circuit itself computed` — e2e/claims.spec.ts:361
    - :375 `expect` expected _no expected value_ _(none)_
    - :376 `expect` expected _no expected value_ _(none)_
    - :377 `toBe` expected `alice > bob ? '1' : '0'` _(expression)_
    - :378 `toBe` expected `alice === bob ? '1' : '0'` _(expression)_
    - :382 `toHaveText` expected `verdictFromWires` _(expression)_
    - :383 `toHaveText` expected `expectedVerdict(alice, bob)` _(expression)_
    - :385 `toContainText` expected `'Alice never saw Bob's ${bob}'` _(expression)_
    - :386 `toContainText` expected `'Bob never saw Alice's ${alice}'` _(expression)_
    - :387 `toContainText` expected `'Evaluated all ${gates} gates'` _(expression)_
- `Exhibit 4: the verdict stays hidden until the final gate` — e2e/claims.spec.ts:392
    - :398 `toContainText` expected `'Evaluation in progress'` _(literal)_
    - :399 `toHaveCount` expected `0` _(literal)_
    - :400 `toBeDisabled` expected _no expected value_ _(none)_
    - :404 `toContainText` expected `'Gate ${i}/${gates}'` _(expression)_
    - :405 `toHaveCount` expected `0` _(literal)_
    - :407 `toHaveAttribute` expected _no expected value_ _(none)_
    - :412 `toBeEnabled` expected _no expected value_ _(none)_
    - :414 `toHaveText` expected `'Alice is richer'` _(literal)_
    - :415 `toBeDisabled` expected _no expected value_ _(none)_
- `Exhibit 4: every gate narrates its own logic, and the free/garbled split matches the meter` — e2e/claims.spec.ts:418
    - :430 `toHaveLength` expected `gates` _(expression)_
    - :437 `expect` expected _no expected value_ _(none)_
    - :438 `toBe` expected `gates` _(expression)_
    - :442 `expect` expected _no expected value_ _(none)_
    - :444 `toBe` expected `type` _(expression)_
    - :447 `toBe` expected `expectedOut` _(expression)_
    - :451 `expect` expected _no expected value_ _(none)_
    - :452 `expect` expected _no expected value_ _(none)_
    - :453 `expect` expected _no expected value_ _(none)_
    - :457 `expect` expected _no expected value_ _(none)_
    - :459 `expect` expected _no expected value_ _(none)_
    - :460 `expect` expected _no expected value_ _(none)_
    - :461 `expect` expected _no expected value_ _(none)_
    - :471 `toBe` expected `bit` _(expression)_
    - :477 `toBe` expected `xor` _(expression)_
    - :478 `toBe` expected `andOr` _(expression)_
    - :479 `toBe` expected `gates` _(expression)_
    - :484 `toBe` expected `bit` _(expression)_
- `Exhibit 4: auto-play runs to the end and hands the live region back` — e2e/claims.spec.ts:488
    - :494 `toHaveText` expected `'Pause'` _(literal)_
    - :496 `toHaveAttribute` expected `'aria-live', 'off'` _(expression)_
    - :498 `toHaveText` expected `'Bob is richer', { timeout: 60000 }` _(expression)_
    - :499 `toContainText` expected `'Gate ${gates}/${gates}'` _(expression)_
    - :500 `toHaveText` expected `'Auto-play', { timeout: 10000 }` _(expression)_
    - :501 `toHaveAttribute` expected `'aria-live', 'polite'` _(expression)_
    - :502 `toBeDisabled` expected _no expected value_ _(none)_
- `Exhibit 4: Back, arrow keys and Reset walk the evaluation backwards` — e2e/claims.spec.ts:505
    - :512 `toContainText` expected `'Gate 2/${gates}'` _(expression)_
    - :514 `toContainText` expected `'Gate 1/${gates}'` _(expression)_
    - :519 `toContainText` expected `'Gate 2/${gates}'` _(expression)_
    - :522 `toContainText` expected `'No gates evaluated yet'` _(literal)_
    - :523 `toBeDisabled` expected _no expected value_ _(none)_
    - :524 `toHaveCount` expected `0` _(literal)_
    - :528 `toHaveCount` expected `1` _(literal)_
    - :530 `toContainText` expected `'No gates evaluated yet'` _(literal)_
    - :531 `toContainText` expected `'Evaluating: 0 / ${gates} gates'` _(expression)_
    - :532 `toContainText` expected `'Evaluation in progress'` _(literal)_
    - :533 `toHaveCount` expected `0` _(literal)_
- `Exhibit 5: reusing one gate leaks Alice’s bit, and the reasoning matches the labels` — e2e/claims.spec.ts:538
    - :547 `toHaveCount` expected `1` _(literal)_
    - :551 `expect` expected _no expected value_ _(none)_
    - :561 `toHaveLength` expected `2` _(literal)_
    - :562 `toBe` expected `slots[1][0]` _(expression)_
    - :566 `toBe` expected `true` _(expression)_
    - :567 `toBe` expected `slots[0][1] === slots[1][1]` _(expression)_
    - :569 `toHaveText` expected `'a = ${identical ? 0 : 1}'` _(expression)_
    - :570 `toBe` expected `aliceBit` _(expression)_
    - :571 `toContainText` expected `'correct ✓'` _(literal)_
    - :572 `expect` expected _no expected value_ _(none)_
    - :573 `expect` expected _no expected value_ _(none)_
- `the self-check quizzes explain wrong answers and mark the right one` — e2e/claims.spec.ts:579
    - :584 `toHaveCount` expected `3` _(literal)_
    - :586 `expect` expected _no expected value_ _(none)_
    - :592 `toContainText` expected `chosenWrong ? 'Not quite.' : 'Correct.'` _(expression)_
    - :594 `toHaveCount` expected `1` _(literal)_
    - :595 `toHaveCount` expected `chosenWrong ? 1 : 0` _(expression)_
    - :597 `expect` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-garbled-gate

## What It Is

Garbled Gate demonstrates Yao's Garbled Circuits (Yao, FOCS 1986) - the foundational protocol for general-purpose secure two-party computation. A garbled circuit allows two parties to jointly evaluate any boolean function on their private inputs without either party learning the other's input. The garbler encrypts each gate's truth table under random wire labels; the evaluator decrypts gate by gate, learning only the output. Input wire labels are exchanged using Oblivious Transfer, ensuring neither party learns more than the protocol output. The canonical application is Yao's Millionaire's Problem: who is richer, without revealing actual wealth.

## When to Use It

- Two-party computation of any boolean function with semi-honest security
- Private set intersection, private comparison, secure auctions
- As the Boolean component in mixed-protocol MPC (ABY-style)
- When constant-round communication is required (GC evaluates in 2 rounds)
- Not practical for very large circuits (millions of gates) without significant optimization and hardware acceleration
- Provides only semi-honest security by default - malicious security requires cut-and-choose or authenticated garbling (significant overhead)
- Multi-party settings (>2 parties) require GMW or SPDZ extensions
- Do NOT use this as a production MPC library — it is a teaching demo that documents where it simplifies for clarity.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-garbled-gate](https://systemslibrarian.github.io/crypto-lab-garbled-gate/)**

Six interactive exhibits, built to be *watched*, not just read:

1. **The Millionaire's Problem** — the motivating scenario, with a one-click private comparison and a self-check.
2. **Anatomy of one garbled gate** — a visual AND gate with colour-coded 128-bit wire-label chips and four *padlock* rows. Step garble → pick inputs → evaluate → reveal, and watch **point-and-permute** open exactly one row. A "Why only one row?" view trial-decrypts all four so you see three GCM rejections and one success.
3. **Oblivious Transfer** — real Chou–Orlandi OT in the ed25519 group; one box opens, the other stays sealed, and Alice can't tell which.
4. **The full protocol, gate by gate** — a layered SVG comparator circuit you step through gate by gate (buttons or ←/→ arrow keys), with per-gate narration of *how* each gate opens, a **God-view** toggle that reveals the secret bit on every wire (the view Bob never has), and a live meter of garbled bytes / OTs / Free-XOR savings.
5. **Security & cost** — semi-honest model, Free XOR / row reduction / Half Gates, a comparison against secret-sharing MPC and FHE, and a **live label-reuse attack**: reuse one garbled gate and watch Bob extract Alice's secret bit with two honest decryptions.
6. **In production** — PSI, secure ML inference, sealed-bid auctions, threshold signatures, plus the MPC family tree.

Every exhibit runs **real cryptography** in the browser (WebCrypto AES-128-GCM, `@noble/curves` ed25519, genuine Free-XOR with a global Δ). An **Honest implementation notes** section documents exactly where the demo simplifies for teaching.

## What Can Go Wrong

- **Reusing a garbled circuit.** A garbled circuit is single-use; evaluating two input sets under the same wire labels leaks information, so each evaluation needs fresh garbling.
- **Semi-honest assumption broken.** A malicious garbler can garble the wrong function or feed inconsistent labels; defending against this needs cut-and-choose or authenticated garbling, with real overhead.
- **Weak or broken Oblivious Transfer.** OT is what stops the evaluator from learning both input labels; a flawed OT undermines the entire privacy guarantee.
- **Selective-failure attacks.** If the garbler can make evaluation succeed or fail depending on the evaluator's private input, the abort itself leaks a bit — a known pitfall that careful protocol design must close.
- **Insufficient wire-label entropy / encryption misuse.** Predictable labels or reused AES keys/nonces in the gate encryption can let an evaluator decrypt rows it should not, collapsing the security of point-and-permute.

## Real-World Usage

- **Private set intersection and contact discovery** use secure two-party computation so parties learn only the intersection, not each other's full sets.
- **Sealed-bid and secure auctions** compute the winner/price without revealing losing bids.
- **Privacy-preserving machine-learning inference** lets a client and a model owner jointly evaluate a model without exposing inputs or weights.
- **Real MPC deployments** such as the Boston wage-equity study used secure computation to aggregate sensitive salary data across employers without sharing raw figures.
- **MPC toolkits** like EMP-toolkit, ABY, and related frameworks implement garbled circuits (with Free-XOR, Half Gates, and OT extension) for research and production use.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-garbled-gate
cd crypto-lab-garbled-gate
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-ot-gate](https://systemslibrarian.github.io/crypto-lab-ot-gate/) — Chou-Orlandi Oblivious Transfer, the primitive that exchanges input labels here.
- [crypto-lab-gg20-wallet](https://systemslibrarian.github.io/crypto-lab-gg20-wallet/) — threshold ECDSA, MPC applied to signing.
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — threshold Schnorr signing, another MPC protocol.
- [crypto-lab-shamir-gate](https://systemslibrarian.github.io/crypto-lab-shamir-gate/) — secret sharing, the alternative MPC foundation compared in Exhibit 5.
- [crypto-lab-psi-gate](https://systemslibrarian.github.io/crypto-lab-psi-gate/) — private set intersection, a headline garbled-circuit application.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Silent Tally

- **slug**: `crypto-lab-silent-tally`
- **repo**: https://github.com/systemslibrarian/crypto-lab-silent-tally
- **live**: https://systemslibrarian.github.io/crypto-lab-silent-tally/
- **commit_sha**: `34993e9e47000d1c2a9f0783a4a5c8fe6696db53` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, spec_citations, mutations, verification

**Name (H1)**: Silent Tally  — _read from index.html_

**Subtitle**: Secure MPC · Shamir Secret Sharing · t=3-of-5 threshold  — _read from index.html_

**Description**: Five hospitals split each private enrollment count into Shamir shares, add the shares locally, and Lagrange-interpolate only the combined trial total — no individual count ever leaves its owner.  — _read from index.html_

**Why it matters**: Institutions must pool sensitive data — patient counts, salaries, votes — without a trusted aggregator that could leak or abuse it. Additively-homomorphic secret sharing lets a group learn the sum while every input stays hidden, even if attackers collude below the threshold.  — _read from index.html_

**Card copy**: Five hospitals compute a combined enrollment total without revealing any individual counts, demonstrating additive-homomorphic MPC in the browser.

**Chips**: Shamir SSS · GF(2⁶¹−1) · Lagrange Interpolation · Additive Homomorphism

**Implements**: Shamir secret sharing `src/lib.rs:123`

**Attacks shown**: Brute force `src-ts/exhibits/exhibit6.ts:274`

**References**: Ed25519, ElGamal, FROST, Feldman VSS, Paillier, Pedersen commitment

**Standards body**: _none_

**Implementation**: Rust/WASM

**README — What Can Go Wrong**:

```text
- Collusion of $t$ or more parties reconstructs any secret — the threshold is only
  as strong as the assumption that fewer than $t$ participants cooperate.
- The privacy guarantee is information-theoretic only for the sharing model; this
  demo simulates all five parties in one browser tab and implements no secure
  channels, authentication, or malicious-party defenses.
- It assumes semi-honest parties — a malicious participant can submit inconsistent
  or out-of-range shares to corrupt the tally undetected, since there is no
  verifiable secret sharing here.
- Weak randomness breaks privacy — polynomial coefficients must come from a CSPRNG
  (`getrandom`), never `Math.random`, or the shares can leak the secret.
- Field-range limits — all arithmetic is mod $p = 2^{61}-1$; inputs or totals that
  exceed the field wrap around, so values must stay within range.
```

**Claims tested** (e2e/claims.spec.ts, 15 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:33
    - :33 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:49
    - :49 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:64
    - :64 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:84
    - :84 `toHaveCount` expected `0` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:90
    - :90 `toHaveText` expected `'Exhibit 2 of 6'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:99
    - :99 `toHaveText` expected `'Exhibit ${n} of 6'` _(expression)_
- `navigation: the walkthrough is gated on locking every input, and ends at exhibit 6` — e2e/claims.spec.ts:121
    - :124 `toHaveText` expected `'Exhibit 1 of 6'` _(literal)_
    - :125 `toBeDisabled` expected _no expected value_ _(none)_
    - :126 `toBeEnabled` expected _no expected value_ _(none)_
    - :129 `toHaveAttribute` expected `'href', '#main-content'` _(expression)_
    - :130 `toHaveAttribute` expected `'tabindex', '-1'` _(expression)_
    - :133 `expect` expected _no expected value_ _(none)_
    - :136 `toHaveText` expected `'Exhibit 2 of 6'` _(literal)_
    - :137 `toBeEnabled` expected _no expected value_ _(none)_
    - :139 `toBeDisabled` expected _no expected value_ _(none)_
    - :140 `expect` expected _no expected value_ _(none)_
    - :141 `expect` expected _no expected value_ _(none)_
    - :144 `toBe` expected `2` _(literal)_
    - :148 `expect` expected _no expected value_ _(none)_
    - :149 `toBeDisabled` expected `{ timeout: 1000 }` _(expression)_
    - :150 `toBeDisabled` expected _no expected value_ _(none)_
    - :151 `toHaveText` expected `'✓ Locked In'` _(literal)_
    - :153 `expect` expected _no expected value_ _(none)_
    - :154 `toBeEnabled` expected _no expected value_ _(none)_
    - :157 `expect` expected _no expected value_ _(none)_
    - :158 `expect` expected _no expected value_ _(none)_
    - :162 `toHaveText` expected `'Exhibit ${n} of 6'` _(expression)_
    - :164 `toBeDisabled` expected _no expected value_ _(none)_
    - :166 `toBe` expected `6` _(literal)_
    - :169 `toHaveText` expected `'Exhibit 5 of 6'` _(literal)_
- `exhibit 2: an out-of-range enrollment is refused, named, and cannot be locked` — e2e/claims.spec.ts:172
    - :176 `toHaveText` expected `'Exhibit 2 of 6'` _(literal)_
    - :180 `toBeVisible` expected _no expected value_ _(none)_
    - :181 `toBe` expected `'Enter an integer between 1 and 9,999'` _(literal)_
    - :184 `toBe` expected _no expected value_ _(none)_
    - :188 `toBeEnabled` expected _no expected value_ _(none)_
    - :189 `toHaveText` expected `'Lock In'` _(literal)_
    - :190 `expect` expected _no expected value_ _(none)_
    - :191 `toBeDisabled` expected _no expected value_ _(none)_
    - :196 `toBeHidden` expected _no expected value_ _(none)_
    - :198 `toBeDisabled` expected _no expected value_ _(none)_
    - :199 `expect` expected _no expected value_ _(none)_
- `exhibit 3: the drawable toy sharing really is f(x) = 8 + 2x + x² over GF(97)` — e2e/claims.spec.ts:206
    - :212 `expect` expected _no expected value_ _(none)_
    - :213 `expect` expected _no expected value_ _(none)_
    - :214 `expect` expected _no expected value_ _(none)_
    - :224 `toEqual` expected `expected` _(expression)_
    - :226 `expect` expected _no expected value_ _(none)_
    - :227 `expect` expected _no expected value_ _(none)_
    - :230 `expect` expected _no expected value_ _(none)_
- `exhibit 4: the 5×5 matrix is complete and its diagonal is the self-held share` — e2e/claims.spec.ts:233
    - :239 `toHaveCount` expected `N_PARTIES` _(expression)_
    - :241 `toHaveLength` expected `N_PARTIES` _(expression)_
    - :242 `toHaveLength` expected `N_PARTIES` _(expression)_
    - :246 `toBe` expected `true` _(expression)_
    - :247 `toBe` expected `N_PARTIES * N_PARTIES` _(expression)_
    - :257 `toEqual` expected `[0, 1, 2, 3, 4]` _(expression)_
    - :260 `expect` expected _no expected value_ _(none)_
- `exhibit 5: each local sum is the share-matrix column it claims to sum` — e2e/claims.spec.ts:267
    - :271 `toHaveText` expected `'Exhibit 5 of 6'` _(literal)_
    - :278 `toHaveLength` expected `N_PARTIES` _(expression)_
    - :281 `toBe` expected `true` _(expression)_
    - :285 `toHaveLength` expected `N_PARTIES` _(expression)_
    - :287 `toEqual` expected `matrix.map((row) => row[j]!)` _(expression)_
    - :295 `expect` expected _no expected value_ _(none)_
    - :298 `toBe` expected `N_PARTIES` _(expression)_
    - :303 `toHaveAttribute` expected _no expected value_ _(none)_
    - :307 `toHaveCount` expected `1` _(literal)_
    - :311 `expect` expected _no expected value_ _(none)_
    - :314 `toBe` expected `'f${sender}(${party})'` _(expression)_
    - :315 `toBe` expected _no expected value_ _(none)_
    - :319 `toBe` expected `'T${party} (mod p)'` _(expression)_
    - :320 `toBe` expected `headline[party - 1]` _(expression)_
    - :322 `expect` expected _no expected value_ _(none)_
- `exhibit 5: the reconstructed total is the enrollments actually entered, from any 3 parties` — e2e/claims.spec.ts:328
    - :337 `expect` expected _no expected value_ _(none)_
    - :338 `toBe` expected `expectedTotal` _(expression)_
    - :339 `expect` expected _no expected value_ _(none)_
    - :346 `toEqual` expected `counts` _(expression)_
    - :347 `toBe` expected `expectedTotal` _(expression)_
    - :348 `toBe` expected `expectedTotal` _(expression)_
    - :349 `expect` expected _no expected value_ _(none)_
    - :350 `expect` expected _no expected value_ _(none)_
    - :354 `expect` expected _no expected value_ _(none)_
    - :356 `toBe` expected `expectedTotal` _(expression)_
    - :375 `expect` expected _no expected value_ _(none)_
    - :378 `expect` expected _no expected value_ _(none)_
    - :379 `toBe` expected _no expected value_ _(none)_
    - :382 `expect` expected _no expected value_ _(none)_
- `exhibit 5: fewer than three local sums leaves the total undetermined, and says why` — e2e/claims.spec.ts:386
    - :400 `expect` expected _no expected value_ _(none)_
    - :401 `expect` expected _no expected value_ _(none)_
    - :402 `expect` expected _no expected value_ _(none)_
    - :406 `expect` expected _no expected value_ _(none)_
    - :407 `expect` expected _no expected value_ _(none)_
    - :408 `expect` expected _no expected value_ _(none)_
    - :412 `expect` expected _no expected value_ _(none)_
    - :413 `expect` expected _no expected value_ _(none)_
    - :414 `expect` expected _no expected value_ _(none)_
    - :415 `expect` expected _no expected value_ _(none)_
    - :420 `expect` expected _no expected value_ _(none)_
    - :424 `expect` expected _no expected value_ _(none)_
    - :425 `expect` expected _no expected value_ _(none)_
    - :426 `expect` expected _no expected value_ _(none)_
    - :457 `toBe` expected `true` _(expression)_
- `exhibit 6: the coalition crosses from candidates to reconstruction at the threshold` — e2e/claims.spec.ts:463
    - :471 `toHaveText` expected `'Exhibit 6 of 6'` _(literal)_
    - :473 `expect` expected _no expected value_ _(none)_
    - :476 `toHaveCount` expected `0` _(literal)_
    - :480 `toHaveCount` expected `size` _(expression)_
    - :483 `toEqual` expected `[...Array(size)].map((_, i) => i + 1)` _(expression)_
    - :485 `toBe` expected `size + 1` _(expression)_
    - :486 `toBe` expected `counts[attack.victim - 1]` _(expression)_
    - :488 `toEqual` expected _no expected value_ _(none)_
    - :495 `toBe` expected `true` _(expression)_
    - :496 `toBe` expected `attack.realCount` _(expression)_
    - :497 `expect` expected _no expected value_ _(none)_
    - :500 `expect` expected _no expected value_ _(none)_
    - :505 `toBe` expected `false` _(expression)_
    - :507 `expect` expected _no expected value_ _(none)_
    - :508 `expect` expected _no expected value_ _(none)_
    - :509 `expect` expected _no expected value_ _(none)_
    - :510 `expect` expected _no expected value_ _(none)_
    - :511 `expect` expected _no expected value_ _(none)_
    - :519 `toHaveAttribute` expected `'aria-disabled', 'true'` _(expression)_
    - :520 `toContainText` expected `'The victim'` _(literal)_
    - :522 `toHaveCount` expected `4` _(literal)_
    - :523 `toBe` expected `5` _(literal)_
    - :529 `toEqual` expected `[1, 2]` _(expression)_
    - :530 `toBe` expected `false` _(expression)_
    - :532 `expect` expected _no expected value_ _(none)_
    - :533 `expect` expected _no expected value_ _(none)_
    - :534 `expect` expected _no expected value_ _(none)_
- `exhibit 6: the coalition never sees a defaulted count — edited inputs flow through` — e2e/claims.spec.ts:537
    - :543 `toEqual` expected `DEFAULT_COUNTS` _(expression)_
    - :557 `toBe` expected `victim` _(expression)_
    - :558 `toBe` expected `counts[victim - 1]` _(expression)_
    - :559 `toBe` expected `true` _(expression)_
    - :560 `toBe` expected `counts[victim - 1]` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-silent-tally

## What It Is

silent-tally is a browser demo of **Multi-Party Computation (MPC)** for secure
summation, built on **Shamir Secret Sharing**, **GF(p) arithmetic** over the
Mersenne prime $p = 2^{61}-1$, **additive homomorphism**, and **Lagrange
interpolation**.

It solves a concrete problem: computing a combined clinical-trial enrollment
total across five hospitals **without disclosing any hospital's private input**.
The protocol is threshold MPC with $t = 3,\ n = 5$ — fewer than three shares
cannot reconstruct a secret. The privacy guarantee demonstrated here is
**information-theoretic** for the underlying sharing model: with fewer than $t$
shares, every possible secret is equally consistent with what an attacker holds.

## When to Use It

- When multiple organizations must publish an aggregate but cannot reveal
  individual inputs — additive homomorphism computes the sum directly from shares.
- When you need **threshold trust** rather than a single trusted server —
  reconstruction requires at least $t$ participants to cooperate.
- For **education or prototyping** that needs concrete Shamir and Lagrange
  mechanics in the browser, with real share generation and interpolation on view.
- **Not** for production-critical deployments without an external audit — this is
  a demo implementation, not an audited system.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-silent-tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/)**

The demo walks through six exhibits — from why a central aggregator fails,
through private input, secret sharing, the share-distribution matrix, and
homomorphic computation, to a coalition attack. You can edit each hospital's
enrollment value, step through the protocol with the on-screen buttons or the
**← / →** arrow keys, and watch the total get reconstructed without any
individual input ever being revealed.

## What Can Go Wrong

- Collusion of $t$ or more parties reconstructs any secret — the threshold is only
  as strong as the assumption that fewer than $t$ participants cooperate.
- The privacy guarantee is information-theoretic only for the sharing model; this
  demo simulates all five parties in one browser tab and implements no secure
  channels, authentication, or malicious-party defenses.
- It assumes semi-honest parties — a malicious participant can submit inconsistent
  or out-of-range shares to corrupt the tally undetected, since there is no
  verifiable secret sharing here.
- Weak randomness breaks privacy — polynomial coefficients must come from a CSPRNG
  (`getrandom`), never `Math.random`, or the shares can leak the secret.
- Field-range limits — all arithmetic is mod $p = 2^{61}-1$; inputs or totals that
  exceed the field wrap around, so values must stay within range.

## Real-World Usage

- Privacy-preserving aggregate statistics — combining counts or totals across
  organizations (clinical trials, salary surveys, ad measurement) without revealing
  any single party's input.
- Shamir Secret Sharing for key management — splitting master keys, HSM backups,
  and root-of-trust material into $t$-of-$n$ shares.
- Threshold custody — distributing control of high-value secrets (cryptocurrency
  keys, signing keys) so no single holder can act alone.
- MPC frameworks — additive secret sharing is a core building block in production
  secure-computation systems for joint analytics.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-silent-tally
cd crypto-lab-silent-tally
npm install
npm run dev
npm test           # GF(p) / Shamir unit tests
npm run test:e2e   # Playwright: functional claims + WCAG 2.1 AA gate
`​``

`npm run test:e2e` (and `test:a11y`, the same run) builds first and serves the
production bundle, so what is driven is what ships.

**Functional browser gate:** `e2e/claims.spec.ts` walks all six exhibits and asserts the
numbers each one puts on screen — checked against each other, not against constants. The
reconstructed total must equal the enrollments actually entered, and the cross-check panel
must add them up the same way; every party's local sum expansion must be exactly the
share-matrix column it claims to be summing, and the homomorphism walk-through must show
that same column and land on that same $T_k$; every 3-subset of local sums must reconstruct
the identical total, while two must leave it undetermined and four must be called
redundant; and the coalition boundary must follow the information available — below
$t = 3$ its low-degree interpolation is only one indistinguishable candidate even if
it happens to equal the secret, while at or above $t$ it must reconstruct to the digit,
for the counts the learner entered rather than the seeded ones. Every failure path is
asserted to reach its state *and* name its cause:
out-of-range enrollments that cannot be locked, the gated Next button, the sub-threshold
reconstruction, and the coalition cap that keeps the victim outside. Uncaught page
exceptions fail the run.

## Related Demos

- [crypto-lab-shamir-gate](https://systemslibrarian.github.io/crypto-lab-shamir-gate/) — Shamir Secret Sharing and Lagrange interpolation over GF(p), the sharing scheme at the heart of this demo.
- [crypto-lab-vss-gate](https://systemslibrarian.github.io/crypto-lab-vss-gate/) — Feldman/Pedersen verifiable secret sharing, which catches the cheating shares silent-tally cannot.
- [crypto-lab-paillier-gate](https://systemslibrarian.github.io/crypto-lab-paillier-gate/) — Paillier additive homomorphic encryption for private aggregation and voting.
- [crypto-lab-threshold-decrypt](https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/) — $t$-of-$n$ threshold ElGamal decryption with NIZK proofs.
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — FROST threshold Ed25519 signing built on verifiable secret sharing.

## How the Protocol Works

Each hospital $i$ holds a secret $s_i$ and builds a random polynomial

$$f_i(x) = s_i + a_{i,1}x + a_{i,2}x^2 \pmod p, \qquad f_i(0) = s_i$$

It distributes shares $f_i(1), \dots, f_i(5)$ — one to each party. Because Shamir
sharing is **additively homomorphic**, each party $j$ can locally sum the shares
it received:

$$T_j = \sum_i f_i(j)$$

The set $\{T_1, \dots, T_5\}$ is itself a valid Shamir sharing of
$\sum_i s_i$, because polynomial evaluation is linear:
$(f_1 + \dots + f_5)(j) = T_j$ and $(f_1 + \dots + f_5)(0) = \sum_i s_i$.
Exhibit 5 makes this concrete — it lines up the five summed shares at any
$x = k$ against the summed secrets, so you can *see* that $T_k$ is a share of the
total rather than take it on faith. Any $t = 3$ of those local sums reconstruct
the grand total via Lagrange interpolation at $x = 0$ — and **nothing else** is
ever revealed. A live 3-of-5 chooser lets you confirm every valid subset yields
the same total, while any 2 leave it undetermined.

With only $t - 1 = 2$ shares, the secret is information-theoretically hidden: for
*every* candidate $f(0)$ in $\mathrm{GF}(p)$ there is exactly one degree-2
polynomial through those two points, so all $p = 2^{61}-1$ secrets stay equally
likely. Exhibit 6 draws a sample of these curves for real.

Because the live shares are ~19-digit elements of $\mathrm{GF}(2^{61}-1)$ that
plot as meaningless noise on a linear axis, Exhibit 3 illustrates the *shape* of
a degree-2 sharing over a toy prime $p = 97$ (secret $s = 8$,
$f(x) = 8 + 2x + x^2$), where the five share points sit exactly on a visible
parabola with $f(0)$ marked. This is the identical Shamir math shrunk for
drawing — the running protocol still operates over $2^{61}-1$, and the toy
illustration is unit-tested for correctness (`src-ts/toyfield.test.ts`).

## Architecture

`​``
┌─────────────────────────┐      ┌──────────────────────────────┐
│  Rust core (src/lib.rs)  │      │  TypeScript UI (src-ts/)       │
│  • GF(2^61-1) arithmetic │ wasm │  • main.ts  — shell / nav      │
│  • Shamir share gen      ├─────▶│  • exhibits/ — six exhibits    │
│  • Lagrange interpolate  │      │  • field.ts — pure-TS mirror   │
│  → compiled with         │      │  • Tailwind CSS, Vite bundler  │
│    wasm-pack             │      └──────────────────────────────┘
└─────────────────────────┘
`​``

The field math lives in two deliberately mirrored places:

- **`src/lib.rs`** — the Rust/WASM core the app runs in production.
- **`src-ts/field.ts`** — a pure-TypeScript reference, used by the UI for derived
  display values and **unit-tested in Node** with shared test vectors so the two
  implementations can't silently drift.

**Tech stack:** Rust + `wasm-bindgen` · `getrandom` (CSPRNG) · TypeScript · Vite
· Tailwind CSS v4 · Vitest · GitHub Actions → GitHub Pages.

## Exhibits

| # | Exhibit | What it shows |
|---|---------|---------------|
| 1 | The Problem | Why a central aggregator fails, and what MPC offers instead |
| 2 | Private Input | Each hospital locks in its enrollment count locally |
| 3 | Secret Sharing | Each secret split via a random degree-2 polynomial over GF(p); a field wrap-around primer and an honest toy-field (p=97) parabola show what a real degree-2 sharing looks like |
| 4 | Distribution | The 5×5 share matrix — who sends what to whom |
| 5 | Computation & Reconstruction | Additive homomorphism made visible (adding shares at x=k *is* evaluating the summed polynomial), plus a 3-of-5 chooser proving every valid subset reconstructs the same total — and 2 cannot |
| 6 | Coalition Attack | Build a coalition of 1–4 hospitals and Lagrange-interpolate their *actual* shares of a victim's polynomial. Below t = 3 the result is labeled as one candidate among a field of equally consistent secrets (and alternatives are drawn as real polynomials); at t = 3 it reconstructs the victim's count to the digit. |

## Testing

All checks below run in CI and gate every deploy:

`​``bash
cargo fmt --check                          # Rust formatting
cargo clippy --all-targets -- -D warnings  # Rust lints
cargo test                                 # Rust core (field, Shamir, Lagrange)
npx tsc --noEmit                           # TypeScript typecheck
npm test                                   # Vitest (pure-TS field reference)
`​``

The Rust and TypeScript suites share test vectors — including all $\binom{5}{3}$
reconstruction subsets, additive homomorphism, edge-case secrets, and a
constructive proof that two shares reveal nothing.

Building the WASM core needs the Rust toolchain and `wasm-pack`
(`cargo install wasm-pack`); run `npm run wasm` to build the Rust core into
`pkg/` after Rust changes. No environment variables are required.

## Security Notes

- Polynomial coefficients come from a **cryptographically secure RNG**
  (`getrandom`), not `Math.random`. Sampling keeps 61 random bits and rejects
  the value $p$, giving every field element the same probability; reducing an
  arbitrary 64-bit draw modulo $p$ would introduce a small bias.
- The privacy guarantee is **information-theoretic for the sharing model** — but
  this demo simulates all five parties in one browser tab and does **not**
  implement secure channels, authentication, or malicious-party defenses.
- It is an educational artifact. **Do not** use it to protect real data without a
  proper, audited implementation.

## License

[MIT](./LICENSE) © 2026 Paul Clark

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Publishing requests

`npm run deploy` requests the existing `deploy.yml` workflow at `main`.
The workflow retains Rust, WASM, TypeScript, unit, production-build and browser gates.
A successful request is not evidence of successful publication; inspect the run
and actual public application separately. Failed requests retain their nonzero status.

```

</details>

---

## Shamir Gate

- **slug**: `crypto-lab-shamir-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-shamir-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-shamir-gate/
- **commit_sha**: `e2b504861b06e7829c2e8a38206a297beb611765` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, verification

**Name (H1)**: Shamir Gate  — _read from demos/shamir-gate/src/main.ts_

**Subtitle**: Shamir's Secret Sharing · t-of-n · GF(p) · Lagrange  — _read from demos/shamir-gate/src/main.ts_

**Description**: Split a secret into n shares as points on a degree-(t−1) polynomial over GF(p), then watch t of them reconstruct it via Lagrange interpolation while fewer stay locked.  — _read from demos/shamir-gate/src/main.ts_

**Why it matters**: No single keyholder can leak or lose the secret, and any t trustees can recover it. That trade-off underpins crypto-wallet custody, root-key escrow, and quorum access controls where fewer than t shares reveal nothing at all.  — _read from demos/shamir-gate/src/main.ts_

**Card copy**: Split a secret into shares using Shamir's Secret Sharing and reconstruct with any qualified threshold subset. Polynomial interpolation made tangible.

**Chips**: Shamir SSS · Lagrange Interpolation · GF(p)

**Implements**: AES `demos/shamir-gate/src/crypto.ts:55`, AES-GCM `demos/shamir-gate/src/crypto.ts:72`, Shamir secret sharing `demos/shamir-gate/index.html:118`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Diffie-Hellman `demos/shamir-gate/src/math.ts:83`, ElGamal `demos/shamir-gate/src/math.ts:83`

**References**: DES, Ed25519, FROST, Feldman VSS, Fiat-Shamir, ML-DSA, Pedersen commitment, RC4, RSA, Schnorr

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `doi.org/10.1007/BFb0053419` — first seen demos/shamir-gate/src/visual-ui.ts:413 (1×)
- `EUROCRYPT 1994` — first seen demos/shamir-gate/src/visual-ui.ts:413 (1×)
- `FIPS 197` — first seen demos/shamir-gate/src/main.ts:1442 (1×)
- `NIST SP 800-38D` — first seen demos/shamir-gate/src/main.ts:1444 (1×)
- `RFC 9591` — first seen demos/shamir-gate/src/main.ts:1406 (2×)

**Stated limitations (page)**:

- _(disclaimer, demos/shamir-gate/src/main.ts)_ Not a custody product. This demo implements the math of Shamir Secret Sharing and uses real browser cryptography for AES-GCM. It is not a complete key-custody system. Production systems also need authenticated share formats, identity, audit logs, secure storage, key ceremonies, backups, verifiable shares (VSS), and incident procedures.
- _(limitation, demos/shamir-gate/src/visual-ui.ts)_ Bounded teaching model. This is binary 2-of-2 visual secret sharing, not general k-of-n, grayscale, color, or progressive visual cryptography. It provides confidentiality for one correctly generated share under fresh per-pixel masks, but no authenticity. It assumes exact alignment and does not model printing, opacity, scaling, rotation, dot gain, display gamma, or registration error. The two shares together reveal the image by design. The browser retains the source and both shares, so it is not an operational share-distribution system.

**README — What Can Go Wrong**:

```text
- **Duplicate or reused share coordinates** — every share must sit at a distinct, non-zero evaluation point `x`; reusing an `x` (or leaking the secret's point `x=0`) breaks reconstruction or the secret outright.
- **Wrong field** — a non-prime modulus, or a field smaller than the secret, voids the information-theoretic guarantee; arithmetic must be exact over GF(p), never floating point.
- **No verifiability in plain Shamir** — a malicious dealer can hand out inconsistent shares and a shareholder can submit a forged one, with no way for honest parties to detect it. That is exactly what Verifiable Secret Sharing (Feldman/Pedersen VSS) adds.
- **The reconstruction point is a single point of compromise** — the full secret briefly exists in one place when shares are combined; that host/moment must be protected.
- **Weak coefficient randomness** — the polynomial's non-constant coefficients must be uniformly random in the field; predictable coefficients leak information about the secret.
- **Visual-mask reuse or misalignment** — reusing one four-subpixel mask leaks
  cross-pixel relations, while real transparencies also require exact physical
  registration. The browser model provides confidentiality, not authenticity
  or a model of printing and optical channels.
```

**Claims tested** (demos/shamir-gate/e2e/claims.spec.ts, 16 test(s)):

- `(assertions outside a test block)` — demos/shamir-gate/e2e/claims.spec.ts:29
    - :29 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — demos/shamir-gate/e2e/claims.spec.ts:87
    - :87 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — demos/shamir-gate/e2e/claims.spec.ts:99
    - :99 `toHaveLength` expected `3` _(literal)_
- `(assertions outside a test block)` — demos/shamir-gate/e2e/claims.spec.ts:108
    - :108 `toBe` expected `'${digits}x'` _(expression)_
- `(assertions outside a test block)` — demos/shamir-gate/e2e/claims.spec.ts:109
    - :109 `toBe` expected `'${digits}x^${i}'` _(expression)_
- `gate: the published polynomial passes through the shares it listed, and t of them recover the secret` — demos/shamir-gate/e2e/claims.spec.ts:128
    - :134 `toBeVisible` expected _no expected value_ _(none)_
    - :145 `toBe` expected `t - 1` _(expression)_
    - :146 `toHaveLength` expected `t` _(expression)_
    - :149 `toBe` expected `secret` _(expression)_
    - :150 `expect` expected _no expected value_ _(none)_
    - :153 `toBe` expected `actualDegree` _(expression)_
    - :158 `toHaveLength` expected `n` _(expression)_
    - :161 `toBe` expected `p` _(expression)_
    - :162 `toBe` expected `BigInt(i + 1)` _(expression)_
    - :163 `toBe` expected `evalPoly(coeffs, s.x, p)` _(expression)_
    - :167 `toBe` expected `secret` _(expression)_
    - :168 `toBe` expected `secret` _(expression)_
    - :173 `toHaveClass` expected `/success/` _(regex)_
    - :174 `toBe` expected _no expected value_ _(none)_
    - :179 `toHaveText` expected `'🔓 UNLOCKED'` _(literal)_
    - :180 `toHaveClass` expected `/unlocked/` _(regex)_
    - :181 `toBe` expected `'Shares collected: ${t} / ${t} needed'` _(expression)_
    - :182 `toHaveAttribute` expected `'aria-label', 'Vault unlocked'` _(expression)_
    - :183 `toHaveCount` expected `n` _(expression)_
    - :184 `toHaveCount` expected `t` _(expression)_
- `gate: below the threshold the page prints the value Lagrange really gives, and calls it wrong` — demos/shamir-gate/e2e/claims.spec.ts:187
    - :193 `toBeVisible` expected _no expected value_ _(none)_
    - :205 `toHaveClass` expected `/error/` _(regex)_
    - :207 `expect` expected _no expected value_ _(none)_
    - :208 `expect` expected _no expected value_ _(none)_
    - :209 `expect` expected _no expected value_ _(none)_
    - :214 `toBe` expected `lagrangeAt0(subset, subset[0]!.p)` _(expression)_
    - :215 `toBe` expected `secret` _(expression)_
    - :218 `toHaveText` expected `'🔒 LOCKED'` _(literal)_
    - :219 `toBe` expected `'Shares collected: ${t - 1} / ${t} needed'` _(expression)_
    - :220 `toHaveAttribute` expected _no expected value_ _(none)_
    - :224 `toHaveCount` expected `t - 1` _(expression)_
- `gate: a rejected share set names the fault and takes the vault back down` — demos/shamir-gate/e2e/claims.spec.ts:227
    - :235 `toBeVisible` expected _no expected value_ _(none)_
    - :263 `toHaveText` expected `'🔓 UNLOCKED'` _(literal)_
    - :268 `toHaveClass` expected `/error/` _(regex)_
    - :269 `toBe` expected `c.expected` _(expression)_
    - :270 `toHaveText` expected `'🔒 LOCKED'` _(literal)_
    - :271 `toBe` expected `'Shares collected: 0 / ${t} needed'` _(expression)_
    - :272 `toHaveCount` expected `0` _(literal)_
- `polynomial: the points table, the canvas label and the Lagrange stepper all agree` — demos/shamir-gate/e2e/claims.spec.ts:280
    - :286 `toBeVisible` expected _no expected value_ _(none)_
    - :295 `toHaveLength` expected `n + 1` _(expression)_
    - :296 `toEqual` expected `['Secret', '0', '42', 'hidden']` _(expression)_
    - :299 `toBe` expected `BigInt(i + 1)` _(expression)_
    - :303 `toBe` expected `42n` _(expression)_
    - :305 `toBe` expected `points[i]!.y` _(expression)_
    - :317 `toHaveCount` expected `n` _(expression)_
    - :318 `toBe` expected `1` _(literal)_
    - :319 `toBe` expected _no expected value_ _(none)_
    - :322 `expect` expected _no expected value_ _(none)_
    - :323 `expect` expected _no expected value_ _(none)_
    - :324 `toHaveCount` expected `1` _(literal)_
    - :328 `toBe` expected `t` _(expression)_
    - :329 `toBe` expected _no expected value_ _(none)_
    - :332 `expect` expected _no expected value_ _(none)_
    - :333 `toHaveCount` expected `t` _(expression)_
    - :338 `expect` expected _no expected value_ _(none)_
    - :345 `expect` expected _no expected value_ _(none)_
    - :347 `toBe` expected `t + 2` _(expression)_
    - :348 `toBeVisible` expected _no expected value_ _(none)_
    - :349 `toHaveCount` expected `t + 2` _(expression)_
    - :352 `expect` expected _no expected value_ _(none)_
    - :353 `toMatch` expected `/f\(0\) = .* = 42 ✓/` _(regex)_
    - :354 `expect` expected _no expected value_ _(none)_
    - :357 `toHaveCount` expected `1` _(literal)_
- `polynomial: a secret outside the field is refused and the bound is named` — demos/shamir-gate/e2e/claims.spec.ts:360
    - :367 `toHaveClass` expected `/error/` _(regex)_
    - :368 `toBe` expected _no expected value_ _(none)_
    - :372 `toBeHidden` expected _no expected value_ _(none)_
    - :373 `toHaveCount` expected `0` _(literal)_
    - :377 `toHaveClass` expected `/error/` _(regex)_
    - :378 `toBe` expected `'Secret must be a non-negative integer.'` _(literal)_
    - :379 `toBeHidden` expected _no expected value_ _(none)_
    - :386 `toBeVisible` expected _no expected value_ _(none)_
    - :387 `expect` expected _no expected value_ _(none)_
- `security proof: every candidate polynomial really does pass through both observed shares` — demos/shamir-gate/e2e/claims.spec.ts:394
    - :403 `toHaveLength` expected `3` _(literal)_
    - :411 `toBe` expected `secret` _(expression)_
    - :413 `expect` expected _no expected value_ _(none)_
    - :414 `expect` expected _no expected value_ _(none)_
    - :415 `expect` expected _no expected value_ _(none)_
    - :416 `toBe` expected `75n` _(expression)_
    - :417 `toBe` expected `140n` _(expression)_
    - :421 `toBe` expected `3` _(literal)_
- `security proof: the lab counts only the candidates it actually verified` — demos/shamir-gate/e2e/claims.spec.ts:424
    - :429 `toBe` expected _no expected value_ _(none)_
    - :440 `toHaveClass` expected `/success/` _(regex)_
    - :441 `expect` expected _no expected value_ _(none)_
    - :445 `toBe` expected `123n` _(expression)_
    - :446 `toBe` expected `75n` _(expression)_
    - :447 `toBe` expected `140n` _(expression)_
    - :448 `expect` expected _no expected value_ _(none)_
    - :449 `expect` expected _no expected value_ _(none)_
    - :454 `toHaveClass` expected `/success/` _(regex)_
    - :458 `toBe` expected `0n` _(expression)_
    - :459 `toBe` expected `75n` _(expression)_
    - :460 `toBe` expected `140n` _(expression)_
    - :461 `expect` expected _no expected value_ _(none)_
    - :462 `expect` expected _no expected value_ _(none)_
    - :463 `expect` expected _no expected value_ _(none)_
    - :467 `toHaveClass` expected `/error/` _(regex)_
    - :468 `toBe` expected `'Enter a candidate secret in [0, 256].'` _(literal)_
    - :469 `expect` expected _no expected value_ _(none)_
    - :473 `toBe` expected _no expected value_ _(none)_
- `aes vault: the shares reconstruct the key it displayed, and t of them decrypt the message` — demos/shamir-gate/e2e/claims.spec.ts:488
    - :494 `toBeVisible` expected _no expected value_ _(none)_
    - :500 `toHaveLength` expected `n` _(expression)_
    - :504 `toBe` expected `BigInt(i + 1)` _(expression)_
    - :505 `toBe` expected `p` _(expression)_
    - :508 `expect` expected _no expected value_ _(none)_
    - :514 `toBe` expected `'${keyHex.slice(0, 16)}…${keyHex.slice(48)}'` _(expression)_
    - :515 `toBe` expected `keyInt` _(expression)_
    - :520 `toHaveLength` expected `24` _(literal)_
    - :523 `toBe` expected `2 * ('launch at dawn'.length + 16)` _(expression)_
    - :527 `toHaveClass` expected `/success/` _(regex)_
    - :528 `toBe` expected `'✓ Decrypted: "launch at dawn"'` _(literal)_
- `aes vault: every failure path names its cause and returns no plaintext` — demos/shamir-gate/e2e/claims.spec.ts:531
    - :535 `toBeVisible` expected _no expected value_ _(none)_
    - :543 `toHaveClass` expected `/error/` _(regex)_
    - :546 `expect` expected _no expected value_ _(none)_
    - :547 `expect` expected _no expected value_ _(none)_
    - :552 `toBe` expected _no expected value_ _(none)_
    - :557 `toBe` expected _no expected value_ _(none)_
    - :562 `expect` expected _no expected value_ _(none)_
    - :574 `expect` expected _no expected value_ _(none)_
    - :575 `expect` expected _no expected value_ _(none)_
    - :576 `toMatch` expected `/Decryption failed:\s*$/` _(regex)_
- `failure lab: all eight scenarios fire, classify into the stated taxonomy, and explain` — demos/shamir-gate/e2e/claims.spec.ts:583
    - :588 `toHaveCount` expected `8` _(literal)_
    - :604 `toHaveText` expected `label` _(expression)_
    - :606 `toBeVisible` expected _no expected value_ _(none)_
    - :607 `toHaveText` expected `category` _(expression)_
    - :609 `toMatch` expected `detail` _(expression)_
    - :612 `expect` expected _no expected value_ _(none)_
    - :613 `expect` expected _no expected value_ _(none)_
    - :618 `toEqual` expected `[` _(expression)_
    - :629 `toBe` expected `42n` _(expression)_
    - :632 `toBe` expected `42n` _(expression)_
- `lesson: eight steps walk forward and back, and the checkpoints score the prediction` — demos/shamir-gate/e2e/claims.spec.ts:639
    - :648 `toBe` expected `'step 1 of 8'` _(literal)_
    - :649 `toBeDisabled` expected _no expected value_ _(none)_
    - :653 `toBe` expected `'step 2 of 8'` _(literal)_
    - :655 `toHaveCount` expected `3` _(literal)_
    - :656 `toBeHidden` expected _no expected value_ _(none)_
    - :658 `toBeVisible` expected _no expected value_ _(none)_
    - :659 `expect` expected _no expected value_ _(none)_
    - :660 `expect` expected _no expected value_ _(none)_
    - :661 `toHaveCount` expected `1` _(literal)_
    - :662 `toHaveCount` expected `1` _(literal)_
    - :664 `toBeDisabled` expected _no expected value_ _(none)_
    - :668 `toBe` expected `'step ${step} of 8'` _(expression)_
    - :670 `toHaveCount` expected `0` _(literal)_
    - :671 `toBeVisible` expected _no expected value_ _(none)_
    - :675 `expect` expected _no expected value_ _(none)_
    - :676 `expect` expected _no expected value_ _(none)_
    - :677 `expect` expected _no expected value_ _(none)_
    - :680 `toBe` expected `'step 1 of 8'` _(literal)_
    - :681 `toBeDisabled` expected _no expected value_ _(none)_
    - :686 `expect` expected _no expected value_ _(none)_
    - :688 `toBe` expected `'step 1 of 8'` _(literal)_

**Mutation records** (1 file(s)):

- `demos/shamir-gate/scripts/visual-mutations.mjs` (12862 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-shamir-gate

## What It Is

Browser-based Shamir's Secret Sharing demo covering the complete protocol:
polynomial construction over GF(p), Lagrange interpolation with step-by-step
visualization, information-theoretic security proof (t-1 shares reveal zero
information), AES-256-GCM encryption with split key, and real-world deployments
in HSMs, FROST threshold signatures, and CA key ceremonies.

All arithmetic uses BigInt over a prime field. No floating point approximations.
The polynomial visualization shows what under-threshold shares actually mean —
multiple valid polynomials consistent with the same shares, each reaching a
different secret — making the security guarantee tangible rather than abstract.
An independent ninth exhibit implements Naor and Shamir's binary 2-of-2 visual
construction: it expands each source pixel into four subpixels, enumerates the
exact one-share distributions, reconstructs by physical Boolean OR, and keeps a
digital XOR comparison separate from transparency stacking.

## When to Use It

- Distributing a secret across multiple custodians with a threshold requirement.
- Understanding why FROST, MPC, and HSM key ceremonies work.
- Teaching the difference between computational security (RSA, AES) and
  information-theoretic security (Shamir — secure even against infinite compute).
- Splitting an AES-256 key across administrators for high-assurance systems.
- Teaching exact 2-of-2 visual secret sharing, pixel expansion, contrast, and
  why fresh per-pixel masks matter.
- Do NOT use this as production key-management software — it is a teaching demo, not a hardened secret-sharing library or HSM.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-shamir-gate](https://systemslibrarian.github.io/crypto-lab-shamir-gate/)**

Build a `t`-of-`n` split over a prime field, watch the polynomial and Lagrange interpolation reconstruct the secret from any `t` shares, and see why `t-1` shares reveal nothing — the visualizer shows multiple polynomials consistent with the same under-threshold shares, each pointing to a different secret. A worked example also splits an AES-256 key and re-encrypts once enough shares are combined.

## What Can Go Wrong

- **Duplicate or reused share coordinates** — every share must sit at a distinct, non-zero evaluation point `x`; reusing an `x` (or leaking the secret's point `x=0`) breaks reconstruction or the secret outright.
- **Wrong field** — a non-prime modulus, or a field smaller than the secret, voids the information-theoretic guarantee; arithmetic must be exact over GF(p), never floating point.
- **No verifiability in plain Shamir** — a malicious dealer can hand out inconsistent shares and a shareholder can submit a forged one, with no way for honest parties to detect it. That is exactly what Verifiable Secret Sharing (Feldman/Pedersen VSS) adds.
- **The reconstruction point is a single point of compromise** — the full secret briefly exists in one place when shares are combined; that host/moment must be protected.
- **Weak coefficient randomness** — the polynomial's non-constant coefficients must be uniformly random in the field; predictable coefficients leak information about the secret.
- **Visual-mask reuse or misalignment** — reusing one four-subpixel mask leaks
  cross-pixel relations, while real transparencies also require exact physical
  registration. The browser model provides confidentiality, not authenticity
  or a model of printing and optical channels.

## Real-World Usage

- **HSM and CA root-key ceremonies** — `M`-of-`N` custodians hold shares of a master/root key (e.g., the DNSSEC root KSK ceremony).
- **Threshold signatures and MPC wallets** — FROST, GG20, and custody platforms split signing keys so no single party can sign alone.
- **HashiCorp Vault unseal keys** — Vault uses Shamir to split its master key across operators by default.
- **Key escrow, backup, and recovery** — high-assurance systems shard a secret so recovery needs a quorum, not any one administrator.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-shamir-gate
cd crypto-lab-shamir-gate/demos/shamir-gate
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-vss-gate](https://systemslibrarian.github.io/crypto-lab-vss-gate/) — Verifiable Secret Sharing (Feldman), which adds the cheating-detection Shamir lacks.
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — FROST threshold Schnorr signatures built on secret-shared keys.
- [crypto-lab-threshold-decrypt](https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/) — threshold decryption where a quorum cooperates to open a ciphertext.
- [crypto-lab-silent-tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) — secret-sharing applied to private aggregation/voting.
- [crypto-lab-threshold-mldsa](https://systemslibrarian.github.io/crypto-lab-threshold-mldsa/) — distributed post-quantum signing from shared key material.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## OT Gate

- **slug**: `crypto-lab-ot-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-ot-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-ot-gate/
- **commit_sha**: `1c99bf0a31ee7c64c8277ca86f3fbda5978bf12a` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: #7c8aff
- **MISSING FIELDS**: verification

**Name (H1)**: OT Gate  — _read from src/main.ts_

**Subtitle**: 1-of-2 Oblivious Transfer · Simplest OT (Chou–Orlandi) · Curve25519  — _read from src/main.ts_

**Description**: Run the Chou–Orlandi OT protocol end to end — watch the sender and receiver exchange curve points so the receiver unlocks exactly one of two messages while neither side learns the other's secret.  — _read from src/main.ts_

**Why it matters**: Oblivious transfer is complete for secure two-party computation: with it alone you can build private set intersection, secure auctions, and password checks that leak nothing. Get OT right and the whole MPC stack stands on solid ground.  — _read from src/main.ts_

**Card copy**: Explore 1-of-2 private choice with real Edwards25519 arithmetic and AES-GCM, then connect it to all-or-nothing disclosure. A teaching version of Chou–Orlandi with explicit KDF and validation limits.

**Chips**: Simplest OT · Chou-Orlandi 2015 · Edwards25519 · AES-256-GCM

**Implements**: AES `src/ext/prf.ts:9`, AES-CTR `src/ext/prf.ts:27`, AES-GCM `src/ot.ts:133`, Ed25519 `src/ext/base.ts:10`, Oblivious transfer `src/andos.ts:2`, SHA-256 `src/ext/base.ts:78`

**Attacks shown**: Ciphertext malleability `README.md:55`, Discrete log `src/main.ts:156`, Known-plaintext attack `src/ext/corrupt-receiver.ts:165`

**Comment-only (named in code comments, not executed)**: EC point arithmetic `src/ot.ts:9`, Montgomery ladder `src/ot.ts:8`, One-time pad `src/ext/iknp.ts:272`, X25519 `src/ot.ts:8`

**References**: Diffie-Hellman, EC point arithmetic, FROST, Garbled circuits, LWE, Private information retrieval, Private set intersection, Shamir secret sharing, Shor's algorithm, X25519

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `CRYPTO ’86` — first seen README.md:19 (2×)
- `doi.org/10.1007/3-540-47721-7_17` — first seen README.md:19 (2×)
- `eprint.iacr.org/2015/267` — first seen src/andos.ts:2 (1×)
- `eprint.iacr.org/2016/505` — first seen README.md:63 (1×)
- `NIST SP 800-38A` — first seen README.md:108 (1×)

**README — What Can Go Wrong**:

```text
- **Malicious sender substituting A:** a malicious sender can send a specially crafted A (e.g., a low-order point outside the prime-order subgroup) so that `B = rG + bA` carries a torsion component that depends only on `b` — revealing the receiver's choice. The Simplest OT is secure against a semi-honest sender but requires a subgroup/torsion check on A for malicious security. (Sending `A` = the identity is a different failure: it makes `k₀` and `k₁` collapse to the same value, handing the receiver *both* messages.)
- **Malicious receiver sending invalid B:** a malicious receiver can send B values outside the curve's prime-order subgroup, potentially extracting information about both messages. Subgroup membership checks on B are required for malicious security.
- **Simplified key derivation:** this demo derives keys as `H(a·B)` / `H(r·A)` — the shared point alone. The real protocol salts the hash with the transcript: Chou-Orlandi define `H : (G × G) × G → {0,1}^κ` and compute `k_j = H_(A,B)(a·B − j·aA)`, receiver side `k_R = H_(A,B)(r·A)`. That salt keeps the random oracle local to the session; without it a man-in-the-middle can relay A, forward `B' = A + B` to the sender, and shift the ciphertexts so the receiver decrypts the *wrong* message (paper, "Non-Malleability in Practice"). Treat the demo's KDF as a teaching simplification, not the scheme.
- **Reusing the receiver's scalar r:** the *sender's* key A = aG is meant to be reused — Chou-Orlandi run setup once and amortize A over all m transfers, which is exactly where the protocol's speed comes from (2 + 3m exponentiations for m OTs). What must be fresh per transfer is the receiver's scalar r: reuse it and two transfers produce the identical B and the identical key, linking the two choices and repeating key material. Reusing A safely also depends on the transcript-salted KDF above.
- **Side-channel on choice encoding:** the receiver's B computation differs based on b — implementations must ensure the two code paths take equal time and access the same memory to prevent timing and cache-based choice leakage.
- **Missing post-quantum security:** Curve25519-based OT is broken by quantum computers. Lattice-based OT (e.g., from LWE) is an active research area without mature standardization.
- **Semi-honest OT extension:** the extension assumes the receiver follows the protocol. The broken mode sends the malformed first 128 rows from Boneh–Shoup equation 23.23; with the explicitly labelled known-plaintext assumption, those probes recover the sender's secret `r`, after which both messages in every later transfer open. A malicious-secure extension needs an additional consistency check.
```

**Claims tested** (e2e/claims.spec.ts, 31 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:37
    - :37 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:51
    - :51 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:52
    - :52 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:66
    - :66 `toBeEnabled` expected `{ timeout: 15_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:69
    - :69 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:70
    - :70 `toHaveText` expected `'Reset & Re-initialize'` _(literal)_
- `b=${b}: the receiver's key is the sender's k${b} and unlocks exactly M${b}` — e2e/claims.spec.ts:76
    - :91 `toBe` expected `k1` _(expression)_
    - :92 `toBe` expected `b === 0 ? k0 : k1` _(expression)_
    - :93 `toBe` expected `b === 0 ? k1 : k0` _(expression)_
    - :94 `toHaveLength` expected `64` _(literal)_
    - :97 `toContainText` expected _no expected value_ _(none)_
    - :101 `expect` expected _no expected value_ _(none)_
    - :106 `expect` expected _no expected value_ _(none)_
    - :110 `toContainText` expected _no expected value_ _(none)_
    - :115 `expect` expected _no expected value_ _(none)_
    - :118 `toHaveCount` expected `4` _(literal)_
    - :119 `toHaveCount` expected `0` _(literal)_
    - :120 `toHaveClass` expected `/complete/` _(regex)_
    - :121 `toContainText` expected `'the receiver read M${b}'` _(expression)_
    - :123 `toContainText` expected _no expected value_ _(none)_
    - :126 `toContainText` expected `'mismatch'` _(literal)_
- `the two independent routes to the shared point land on the same point` — e2e/claims.spec.ts:130
    - :135 `toBeVisible` expected _no expected value_ _(none)_
    - :138 `toHaveText` expected `'a · (B − A)'` _(literal)_
    - :139 `toHaveText` expected `'r · A'` _(literal)_
    - :140 `toContainText` expected `'B = A + rG'` _(literal)_
    - :141 `toContainText` expected `'b = 1'` _(literal)_
    - :151 `toBe` expected `senderFrag` _(expression)_
    - :152 `toBe` expected `senderFrag` _(expression)_
    - :153 `toHaveClass` expected `/match/` _(regex)_
    - :154 `toHaveClass` expected `/nomatch/` _(regex)_
    - :155 `toHaveText` expected `'✓ same point'` _(literal)_
    - :160 `toHaveText` expected `frag(kb)` _(expression)_
    - :162 `toHaveText` expected `frag(k0)` _(expression)_
    - :163 `toBe` expected `frag(k0)` _(expression)_
    - :164 `toContainText` expected `"Receiver's k"` _(literal)_
    - :165 `toContainText` expected `"the sender's OTHER key"` _(literal)_
- `nothing labelled "never transmitted" reaches the other side` — e2e/claims.spec.ts:168
    - :177 `toBe` expected `r` _(expression)_
    - :178 `toBe` expected `B` _(expression)_
    - :185 `expect` expected _no expected value_ _(none)_
    - :186 `expect` expected _no expected value_ _(none)_
    - :187 `expect` expected _no expected value_ _(none)_
    - :188 `expect` expected _no expected value_ _(none)_
    - :192 `toHaveCount` expected `3` _(literal)_
    - :193 `toHaveText` expected `'A → Receiver'` _(literal)_
    - :194 `toHaveText` expected `'B → Sender'` _(literal)_
    - :195 `toHaveText` expected `'(E₀, E₁) → Receiver'` _(literal)_
    - :196 `toBe` expected _no expected value_ _(none)_
    - :199 `toBe` expected _no expected value_ _(none)_
    - :206 `expect` expected _no expected value_ _(none)_
    - :207 `toBe` expected `true` _(expression)_
- `the privacy audit does not downgrade the choice-hiding claim the page makes elsewhere` — e2e/claims.spec.ts:210
    - :220 `expect` expected _no expected value_ _(none)_
    - :221 `toMatch` expected _no expected value_ _(none)_
    - :224 `toMatch` expected `/perfectly indistinguishable|identical distributions|unconditional/i` _(regex)_
    - :227 `toMatch` expected `/CDH|computational Diffie-Hellman/i` _(regex)_
    - :230 `toContainText` expected `'perfectly indistinguishable'` _(literal)_
    - :231 `toContainText` expected `'hidden from the sender unconditionally'` _(literal)_
- `an empty message is refused by name and no protocol runs` — e2e/claims.spec.ts:234
    - :236 `toBeDisabled` expected _no expected value_ _(none)_
    - :237 `toBeHidden` expected _no expected value_ _(none)_
    - :241 `toBeVisible` expected _no expected value_ _(none)_
    - :242 `toContainText` expected `'Message M₀ can’t be empty'` _(literal)_
    - :243 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :244 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :245 `toHaveCount` expected `0` _(literal)_
    - :246 `expect` expected _no expected value_ _(none)_
    - :247 `toBeDisabled` expected _no expected value_ _(none)_
    - :252 `toContainText` expected `'Message M₁ can’t be empty'` _(literal)_
    - :253 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :254 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :255 `toHaveCount` expected `0` _(literal)_
    - :260 `toBeHidden` expected _no expected value_ _(none)_
    - :261 `toBeEnabled` expected `{ timeout: 15_000 }` _(expression)_
- `emptying a message after setup blocks encryption instead of encrypting nothing` — e2e/claims.spec.ts:264
    - :269 `toBeEnabled` expected `{ timeout: 15_000 }` _(expression)_
    - :275 `toContainText` expected `'Message M₁ can’t be empty'` _(literal)_
    - :276 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :277 `expect` expected _no expected value_ _(none)_
    - :278 `toBeHidden` expected _no expected value_ _(none)_
    - :279 `toBeHidden` expected _no expected value_ _(none)_
    - :281 `toHaveCount` expected `1` _(literal)_
- `re-initializing clears the finished run rather than leaving it on screen` — e2e/claims.spec.ts:284
    - :290 `toBeVisible` expected _no expected value_ _(none)_
    - :293 `toBeEnabled` expected `{ timeout: 15_000 }` _(expression)_
    - :296 `expect` expected _no expected value_ _(none)_
    - :297 `toBeHidden` expected _no expected value_ _(none)_
    - :298 `toBeHidden` expected _no expected value_ _(none)_
    - :299 `toHaveCount` expected `1` _(literal)_
    - :300 `toHaveText` expected `'Initialize Sender'` _(literal)_
    - :304 `toBe` expected `firstA` _(expression)_
    - :309 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :310 `toContainText` expected _no expected value_ _(none)_
- `message and choice controls cannot drift away from in-flight or completed evidence` — e2e/claims.spec.ts:315
    - :320 `toBeEnabled` expected `{ timeout: 15_000 }` _(expression)_
    - :325 `toBeDisabled` expected _no expected value_ _(none)_
    - :327 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :328 `toContainText` expected `'Decrypted M1: ${M1}'` _(expression)_
    - :329 `toHaveValue` expected `M1` _(expression)_
    - :330 `toBeChecked` expected _no expected value_ _(none)_
    - :332 `toBeDisabled` expected _no expected value_ _(none)_
    - :336 `toBeEnabled` expected `{ timeout: 15_000 }` _(expression)_
    - :337 `expect` expected _no expected value_ _(none)_
    - :338 `toBeHidden` expected _no expected value_ _(none)_
    - :340 `toBeEnabled` expected _no expected value_ _(none)_
- `every copy button names its own block in plain words, with no markup` — e2e/claims.spec.ts:344
    - :347 `toBeEnabled` expected `{ timeout: 15_000 }` _(expression)_
    - :350 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :360 `toEqual` expected `[` _(expression)_
    - :372 `toMatch` expected `/[<>]/` _(regex)_
- `the correctness check reports the run it actually performed` — e2e/claims.spec.ts:377
    - :380 `toBeVisible` expected `{` _(expression)_
    - :385 `toHaveClass` expected `/ok/` _(regex)_
    - :386 `toHaveClass` expected `/fail/` _(regex)_
    - :387 `toContainText` expected `'All checks passed'` _(literal)_
    - :390 `toHaveCount` expected `2` _(literal)_
    - :391 `toHaveCount` expected `2` _(literal)_
    - :392 `toHaveCount` expected `0` _(literal)_
    - :393 `toHaveCount` expected `4` _(literal)_
    - :394 `toHaveCount` expected `4` _(literal)_
    - :395 `toHaveCount` expected `0` _(literal)_
    - :398 `toContainText` expected `'Choice b=0'` _(literal)_
    - :399 `toContainText` expected _no expected value_ _(none)_
    - :402 `toContainText` expected `'Choice b=1'` _(literal)_
    - :403 `toContainText` expected _no expected value_ _(none)_
    - :408 `expect` expected _no expected value_ _(none)_
    - :409 `expect` expected _no expected value_ _(none)_
    - :410 `toBeEnabled` expected _no expected value_ _(none)_
- `the choice-hiding match scoreboard is the sum of its own rounds` — e2e/claims.spec.ts:415
    - :419 `toHaveText` expected `'0'` _(literal)_
    - :420 `toHaveText` expected `'0'` _(literal)_
    - :421 `toHaveText` expected `'—'` _(literal)_
    - :422 `toBeHidden` expected _no expected value_ _(none)_
    - :427 `toHaveCount` expected `3` _(literal)_
    - :429 `toHaveCount` expected `0` _(literal)_
    - :430 `toBeDisabled` expected _no expected value_ _(none)_
    - :431 `toContainText` expected `'Round ${round}'` _(expression)_
    - :436 `toHaveCount` expected `1` _(literal)_
    - :437 `toHaveCount` expected `2` _(literal)_
    - :438 `toHaveCount` expected `3` _(literal)_
    - :446 `toHaveClass` expected `correct ? /\bok\b/ : /\bfail\b/` _(expression)_
    - :451 `expect` expected _no expected value_ _(none)_
    - :452 `expect` expected _no expected value_ _(none)_
    - :456 `toHaveCount` expected `correct ? 0 : 1` _(expression)_
    - :460 `toHaveText` expected `String(round)` _(expression)_
    - :461 `toHaveText` expected `String(hits)` _(expression)_
    - :463 `toHaveText` expected `'${pct}%'` _(expression)_
    - :464 `expect` expected _no expected value_ _(none)_
    - :472 `toMatch` expected `/%$/` _(regex)_
    - :473 `toBeCloseTo` expected _no expected value_ _(none)_
    - :478 `toBeVisible` expected _no expected value_ _(none)_
    - :482 `toHaveText` expected `'Match complete'` _(literal)_
    - :483 `toBeDisabled` expected _no expected value_ _(none)_
    - :484 `toContainText` expected `'Match over: ${hits}/10'` _(expression)_
    - :488 `toHaveText` expected `'0'` _(literal)_
    - :489 `toHaveText` expected `'0'` _(literal)_
    - :490 `toHaveText` expected `'—'` _(literal)_
    - :491 `expect` expected _no expected value_ _(none)_
    - :492 `toHaveText` expected `'Deal a round'` _(literal)_
    - :493 `toBeEnabled` expected _no expected value_ _(none)_
- `the 1000-round simulation reports the rate its own hit count implies` — e2e/claims.spec.ts:496
    - :500 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :504 `expect` expected _no expected value_ _(none)_
    - :507 `toBe` expected `1000` _(literal)_
    - :510 `toBe` expected _no expected value_ _(none)_
    - :516 `expect` expected _no expected value_ _(none)_
    - :517 `expect` expected _no expected value_ _(none)_
    - :523 `toMatch` expected `/%$/` _(regex)_
    - :524 `toBeCloseTo` expected _no expected value_ _(none)_
    - :529 `toBeEnabled` expected _no expected value_ _(none)_
    - :530 `toContainText` expected `'guessed ${hits} of ${rounds} correctly'` _(expression)_
    - :541 `toBeDisabled` expected _no expected value_ _(none)_
    - :542 `toContainText` expected `'cannot proceed'` _(literal)_
    - :544 `toHaveText` expected `'128', { timeout: 30_000 }` _(expression)_
    - :545 `toBeEnabled` expected _no expected value_ _(none)_
    - :550 `toHaveCount` expected `16` _(literal)_
    - :562 `toBeEnabled` expected `{ timeout: 60_000 }` _(expression)_
    - :564 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
- `OT extension printed correctness is derived from every produced transfer` — e2e/claims.spec.ts:567
    - :575 `toBe` expected `1_000` _(expression)_
    - :576 `toBe` expected `n` _(expression)_
    - :577 `toBe` expected `n` _(expression)_
    - :578 `toHaveClass` expected `/success/` _(regex)_
    - :579 `toContainText` expected `'ALL 1,000 CHOSEN MESSAGES RECOVERED'` _(literal)_
    - :580 `toHaveClass` expected `/success/` _(regex)_
- `sender q row uses r AND p, preserving the book identity` — e2e/claims.spec.ts:583
    - :588 `toMatch` expected `/^[01]{128}$/` _(regex)_
    - :590 `toHaveCount` expected `256, { timeout: 60_000 }` _(expression)_
    - :598 `expect` expected _no expected value_ _(none)_
    - :602 `toBe` expected `choice === 2 ? 1 : 0` _(expression)_
    - :603 `toBe` expected _no expected value_ _(none)_
- `hash branch domain separation keeps both receiver choices correct` — e2e/claims.spec.ts:610
    - :614 `toHaveText` expected `'1,000'` _(literal)_
    - :615 `toHaveClass` expected `/success/` _(regex)_
- `rendered transpose keeps all 128 base coordinates aligned` — e2e/claims.spec.ts:618
    - :622 `toHaveText` expected `'1,000'` _(literal)_
    - :623 `toHaveClass` expected `/success/` _(regex)_
    - :624 `toHaveText` expected `'1,000'` _(literal)_
    - :625 `toHaveClass` expected `/success/` _(regex)_
- `displayed OT-extension measurements are recomputed from printed inputs` — e2e/claims.spec.ts:628
    - :641 `toBe` expected `128` _(literal)_
    - :642 `toHaveCount` expected `baseCount` _(expression)_
    - :643 `toBe` expected `n * 16` _(expression)_
    - :644 `toBe` expected `n * 3` _(expression)_
    - :645 `toBeCloseTo` expected _no expected value_ _(none)_
    - :649 `expect` expected _no expected value_ _(none)_
    - :650 `expect` expected _no expected value_ _(none)_
- `corrupt receiver fixture keeps chosen checks green while recovering r and both later messages` — e2e/claims.spec.ts:653
    - :660 `toBeVisible` expected _no expected value_ _(none)_
    - :661 `toHaveText` expected _no expected value_ _(none)_
    - :668 `toBe` expected `senderR` _(expression)_
    - :669 `toBe` expected `n` _(expression)_
    - :670 `toBe` expected `n - 128` _(expression)_
    - :671 `toHaveText` expected _no expected value_ _(none)_
    - :674 `toHaveClass` expected `/alarm/` _(regex)_
    - :675 `toHaveClass` expected `/success/` _(regex)_
    - :676 `toContainText` expected `'128 / 128'` _(literal)_
    - :677 `toContainText` expected _no expected value_ _(none)_
- `changing N retires a verdict while re-selecting the same N is a no-op` — e2e/claims.spec.ts:682
    - :689 `toHaveText` expected `verdict ?? ''` _(expression)_
    - :692 `toBeHidden` expected _no expected value_ _(none)_
    - :693 `toContainText` expected `'verdict retired'` _(literal)_
    - :694 `toBeDisabled` expected _no expected value_ _(none)_
- `fresh base setup retires the prior extension verdict by name` — e2e/claims.spec.ts:697
    - :701 `toBeHidden` expected _no expected value_ _(none)_
    - :702 `toContainText` expected `'previous extension verdict was retired', {` _(expression)_
    - :705 `toHaveText` expected `'128'` _(literal)_
- `cancelling a 100,000-transfer run clears partial counters and leaves no stale success` — e2e/claims.spec.ts:708
    - :714 `toBeVisible` expected _no expected value_ _(none)_
    - :716 `toContainText` expected `'Cancelled'` _(literal)_
    - :717 `toBeHidden` expected _no expected value_ _(none)_
    - :718 `toHaveText` expected `'—'` _(literal)_
    - :719 `toBeDisabled` expected _no expected value_ _(none)_
- `repeated extension runs use new PRF positions under the same base setup` — e2e/claims.spec.ts:722
    - :730 `expect` expected _no expected value_ _(none)_
    - :731 `toBe` expected `secret` _(expression)_
    - :735 `toBe` expected `firstMatrix.map((cell) => cell[2]).join('')` _(expression)_
    - :736 `toHaveText` expected `'1,000'` _(literal)_
- `the repeated-run hash is independently derived from its displayed global index and row` — e2e/claims.spec.ts:739
    - :747 `expect` expected _no expected value_ _(none)_
    - :748 `toHaveLength` expected `16` _(literal)_
    - :753 `toBe` expected `expected` _(expression)_
    - :754 `toBe` expected `expected` _(expression)_
- `malicious probe choices are fixed and match the rows the page computes` — e2e/claims.spec.ts:757
    - :761 `toBeDisabled` expected _no expected value_ _(none)_
    - :762 `toHaveText` expected `'1'` _(literal)_
    - :767 `toHaveText` expected `'128'` _(literal)_
    - :768 `toHaveText` expected `Array(16).fill('1')` _(expression)_
    - :770 `toBeEnabled` expected `{ timeout: 60_000 }` _(expression)_
    - :772 `toEqual` expected `Array(16).fill('s=1')` _(expression)_
- `returning from malicious mode discards the compromised base setup before an honest run` — e2e/claims.spec.ts:775
    - :780 `toHaveText` expected `'872'` _(literal)_
    - :781 `toBeDisabled` expected _no expected value_ _(none)_
    - :783 `toBeHidden` expected _no expected value_ _(none)_
    - :784 `toHaveText` expected `'—'` _(literal)_
    - :785 `expect` expected _no expected value_ _(none)_
    - :786 `toBeDisabled` expected _no expected value_ _(none)_
    - :787 `toContainText` expected `'fresh base setup'` _(literal)_
    - :789 `toHaveText` expected `'128'` _(literal)_
    - :790 `toBe` expected `oldSecret` _(expression)_
    - :792 `toHaveClass` expected `/success/` _(regex)_
    - :793 `toHaveText` expected `'1,000'` _(literal)_

**Mutation records** (3 file(s)):

- `scripts/mutation-extension.mjs` (7418 bytes)
- `scripts/mutation-report.mjs` (2716 bytes)
- `scripts/mutation-report.test.mjs` (3580 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-ot-gate

## What It Is

crypto-lab-ot-gate implements 1-of-2 Oblivious Transfer using the Simplest OT protocol (Chou-Orlandi 2015) over Curve25519. A sender holds two messages M0 and M1. A receiver selects one message using a choice bit b ∈ {0,1} and receives M_b, while the sender learns nothing about b and the receiver learns nothing about M_{1-b}. The protocol uses one round of Edwards25519 Diffie-Hellman exchange followed by AES-256-GCM encryption of both messages under keys derived from the shared secrets. The two halves of the security argument are not symmetric: the sender learns nothing about the choice bit *unconditionally* (with r uniform, B is a uniform curve point either way — Chou-Orlandi, Lemma 1), while the receiver's inability to derive the other key rests on the **computational** Diffie-Hellman (CDH) assumption on Curve25519, in the random oracle model. OT is complete for two-party computation — any function computable securely by two parties can be built from OT as the sole primitive.

The lab now also runs IKNP-style OT extension as presented in [Boneh–Shoup v0.6 §23.7](https://crypto.stanford.edu/~dabo/cryptobook/BonehShoup_0_6.pdf) on top of its Chou–Orlandi base OTs: 128 reversed-role public-key OTs become N measured transfers using AES-128-CTR, SHA-256, and XOR. This construction is semi-honest only; the deliberately broken mode reproduces the book's corrupt-receiver attack.

Each batch reserves fresh, block-aligned AES stream positions and global
one-based hash indices under its base setup. Cancelled batches consume their
reserved positions too. The page prints the range and exposes the first full
hash input and output for inspection. Malicious mode fixes the probe choices at
1 and consumes the base setup; returning to honest mode requires 128 fresh base
OTs. The message-masking API accepts 1–32 bytes per message, bounded by its
SHA-256 pad (the page uses 16 bytes).

## All-or-nothing disclosure connection

[Section E](https://systemslibrarian.github.io/crypto-lab-ot-gate/#andos) links this two-message private-choice experiment to Brassard, Crépeau and Robert’s [All-or-Nothing Disclosure of Secrets](https://doi.org/10.1007/3-540-47721-7_17) (CRYPTO ’86; proceedings 1987). The historical goal is private selection of one of a sender’s secrets while protecting the others. It is distinct from an all-or-nothing transform and from mutual fair exchange.

Choose one of two fictional archive capsules. The existing `runFullOT` computes fresh Edwards25519 values and AES-GCM ciphertexts; the selected message decrypts and the receiver’s key is also tried against the unselected ciphertext. The UI permits one selection per teaching session, with explicit reset. Reset creates a fresh transfer and can reveal another message; this is not an enforced payment or lifetime-access policy.

This extension does not implement the original ANDOS construction or general 1-out-of-n OT. It retains the existing simplified KDF and validation limits below. Authentication rejection under one supplied key is an execution check, not a proof against all adversaries. Both parties and all secrets remain observable to the local simulator.

See the [Applied Cryptography reading path](https://crypto-lab.systemslibrarian.dev/learn/applied-cryptography/) and [Fair Exchange Workshop](https://crypto-lab.systemslibrarian.dev/learn/fair-exchange/) for the related but different exchange goal.

## When to Use It

- Use OT as the base primitive when building MPC protocols that evaluate arbitrary boolean or arithmetic circuits — OT extension generates the required volume of OTs efficiently.
- Use an OT-extension-based private set intersection protocol when two parties need to find common elements without revealing their full sets — efficient PSI research includes this construction family.
- Do not use base OT (without extension) when millions of OTs are required — the elliptic curve cost is prohibitive. Use IKNP OT extension instead.
- Do not use this protocol in post-quantum threat models — discrete log on Curve25519, and with it CDH, is broken by Shor's algorithm. Post-quantum OT from lattice assumptions exists but is not standardized.
- Do not use OT alone when the computation involves more than two parties — use full MPC frameworks like SPDZ or ABY.
- Do NOT use this code in production — it is a browser teaching demo; build on a vetted MPC/OT library for real systems.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-ot-gate](https://systemslibrarian.github.io/crypto-lab-ot-gate/)**

Enter two messages as the sender and select your choice as the receiver. The demo executes the full Simplest OT protocol with real Edwards25519 Diffie-Hellman values and AES-256-GCM encryption. The privacy audit panels show exactly what each party sees, confirming that the sender cannot determine the receiver's choice and the receiver cannot decrypt the unchosen message.

Four teaching visuals sit on top of the real protocol (they never fake a value):

1. **Key-reconciliation panel** — after the receiver decrypts, the demo shows the two *independent* routes to the shared secret side by side: the receiver's `r·A` and the sender's `a·B` (or `a·(B−A)` when b=1). Both are computed from real curve math and shown landing on the *same* point `arG` (highlighted green), while the sender's other key lands elsewhere (red) — making the commutativity the whole protocol rests on visible instead of algebraic.
2. **Color-coded value chips** — the sender's `k₀`/`k₁` and the receiver's derived key carry matching green/red chips so "which key equals which" reads as a diagram rather than a wall of hex.
3. **Choice-hiding match** — the visualizer is a 10-round game with a running accuracy tally against the dashed 1-in-3 baseline, plus a "let the computer guess 1000×" button that runs 1000 real challenges and plots the measured ~33% hit rate. The inability to beat random is not a computational assumption here but a fact about the distribution — A + r·G with fresh uniform r *is* a uniform curve point — which is why choice hiding holds against an unbounded sender.
4. **OT extension, run** — perform 128 real Chou–Orlandi base OTs, expand 1,000, 10,000, or 100,000 transfers, inspect a 16×16 matrix window, and verify every chosen and wrong-message result. The comparison uses this run's measured timings. Turning on the visibly broken equation-23.23 mode recovers the sender's real 128-bit secret and opens both messages in every later transfer.

First-use micro-glosses (scalar, base point G, `a·P`, `H`, why B hides b) are inlined so a newcomer to elliptic-curve crypto has an on-ramp without cluttering the narrative for those who already know.

## What Can Go Wrong

- **Malicious sender substituting A:** a malicious sender can send a specially crafted A (e.g., a low-order point outside the prime-order subgroup) so that `B = rG + bA` carries a torsion component that depends only on `b` — revealing the receiver's choice. The Simplest OT is secure against a semi-honest sender but requires a subgroup/torsion check on A for malicious security. (Sending `A` = the identity is a different failure: it makes `k₀` and `k₁` collapse to the same value, handing the receiver *both* messages.)
- **Malicious receiver sending invalid B:** a malicious receiver can send B values outside the curve's prime-order subgroup, potentially extracting information about both messages. Subgroup membership checks on B are required for malicious security.
- **Simplified key derivation:** this demo derives keys as `H(a·B)` / `H(r·A)` — the shared point alone. The real protocol salts the hash with the transcript: Chou-Orlandi define `H : (G × G) × G → {0,1}^κ` and compute `k_j = H_(A,B)(a·B − j·aA)`, receiver side `k_R = H_(A,B)(r·A)`. That salt keeps the random oracle local to the session; without it a man-in-the-middle can relay A, forward `B' = A + B` to the sender, and shift the ciphertexts so the receiver decrypts the *wrong* message (paper, "Non-Malleability in Practice"). Treat the demo's KDF as a teaching simplification, not the scheme.
- **Reusing the receiver's scalar r:** the *sender's* key A = aG is meant to be reused — Chou-Orlandi run setup once and amortize A over all m transfers, which is exactly where the protocol's speed comes from (2 + 3m exponentiations for m OTs). What must be fresh per transfer is the receiver's scalar r: reuse it and two transfers produce the identical B and the identical key, linking the two choices and repeating key material. Reusing A safely also depends on the transcript-salted KDF above.
- **Side-channel on choice encoding:** the receiver's B computation differs based on b — implementations must ensure the two code paths take equal time and access the same memory to prevent timing and cache-based choice leakage.
- **Missing post-quantum security:** Curve25519-based OT is broken by quantum computers. Lattice-based OT (e.g., from LWE) is an active research area without mature standardization.
- **Semi-honest OT extension:** the extension assumes the receiver follows the protocol. The broken mode sends the malformed first 128 rows from Boneh–Shoup equation 23.23; with the explicitly labelled known-plaintext assumption, those probes recover the sender's secret `r`, after which both messages in every later transfer open. A malicious-secure extension needs an additional consistency check.

## Real-World Usage

- **[MASCOT](https://eprint.iacr.org/2016/505) / SPDZ-style MPC:** MASCOT uses OT-based preprocessing to generate authenticated multiplication material for a SPDZ-style online phase. OT is one preprocessing route, not a property of every protocol bearing the SPDZ name.
- **Private set intersection:** high-performance PSI research includes OT-extension constructions. [Google's published private intersection-sum work](https://research.google/pubs/private-intersection-sum-protocols-with-applications-to-attributing-aggregate-ad-conversions/) says its deployed ad-conversion protocol used Diffie–Hellman double masking and evaluated random-OT alternatives; [Meta's published PSI work](https://engineering.fb.com/2023/08/08/security/how-meta-is-improving-password-security-and-preserving-privacy/) includes private password lookup. Those deployments demonstrate PSI applications, not deployment of this lab's exact IKNP construction.
- **[IRTF Prio3 / VDAF](https://datatracker.ietf.org/doc/draft-irtf-cfrg-vdaf/) (`draft-irtf-cfrg-vdaf`, still an Internet-Draft, not an RFC):** uses a related secret-sharing and MPC approach for aggregate telemetry without revealing individual measurements.
- **[EMP-toolkit](https://github.com/emp-toolkit/emp-ot):** open-source MPC research software with concrete base-OT and IKNP-style OT-extension implementations.

## Testing

The OT correctness and privacy claims are verified headlessly, not just by the
in-app "correctness" button. `npm test` runs a Vitest suite (`src/ot.test.ts`)
against the real protocol code in `src/ot.ts`:

- **Correctness:** for both choice bits, the receiver recovers exactly M_b, over
  a fixed check and 25 random sessions. Exact rejection sampling is exercised at
  the field-order boundary, and the normally rare receiver scalar `r = 0` is
  forced for both choices to verify full-subgroup coverage and matching keys.
- **Receiver privacy:** the receiver's key fails to decrypt M_{1-b} (AES-256-GCM
  authentication rejects), and the receiver key equals the *chosen* sender key
  but never the other.
- **Key-derivation identity:** H(r·A) = H(a·B) when b=0 and H(a·(B−A)) when b=1,
  recomputed independently from public transcript values plus the sender scalar.
- **Sender privacy structure:** B(b=0) and B(b=1) are both valid, distinct curve
  points and the sender's encryption never branches on b.
- **DDH visualizer:** produces three distinct valid curve points and an unbiased
  CSPRNG-selected index; the 1000× auto-simulation's random strategy is verified
  to land near the 1-in-3 baseline over real challenges (never a trivial 0 or 1).
- **Key reconciliation:** the receiver's `r·A` and the sender's `a·B` /
  `a·(B−A)` are asserted byte-identical (the point both parties reach), the
  reconciled key equals the receiver's actual protocol key, and the unchosen key
  differs — the same identity the teaching panel visualizes.

`src/ext/ext.test.ts` checks the executable extension itself: two random
N=1,000 runs and one N=100,000 run; the row-wise `q` identity; transpose
round-trip; the complete toy n=4 sender-view distribution; exact recovery of
the sender's `r` and both later messages in the corrupt-receiver fixture; and
the 128 transcript-salted base-OT key identities.

`src/ext/reuse.test.ts` covers consecutive, concurrent and cancelled batches,
caller-owned choice buffers mutated during awaited work, retired compromised
setups, message-size boundaries and truncated buffers. It
compares repeated-run AES expansion and global-index SHA-256 pads with independent
Node crypto calculations. The browser claims suite checks those fresh ranges,
independently recomputes the displayed full hash, verifies fixed probe choices,
and requires a fresh setup after malicious mode.

Two published primitive KATs are pinned: one four-block AES-128-CTR vector from
[NIST SP 800-38A §F.5.1](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38a.pdf)
(64 bytes, longer than one AES block), and one 1,304-bit SHA-256 long-message
vector from NIST's [CAVP byte-oriented SHA test set](https://csrc.nist.gov/Projects/cryptographic-algorithm-validation-program/Secure-Hashing)
(163 bytes, longer than one SHA-256 block). There are no standardized IKNP
known-answer vectors, so protocol correctness is tested through its algebraic
identities and end-to-end computed outputs rather than credited to NIST.

`​``bash
npm test          # Vitest crypto tests + mutation-report rejection fixtures
npm run test:workflow # executable least-privilege and fail-closed CI policy
npm run test:a11y # Playwright claims + WCAG A/AA gate (dark theme, desktop/320px)
npm run test:mutations # Clean committed tree required; ten replayable source mutations
`​``

CI runs exact-lock installs, high-severity audits, unit tests, workflow controls
and production builds on Node 22, 24 and 26. The browser/accessibility suite and
mutation gate must also pass before the aggregate `build` context succeeds or a
non-PR run receives Pages deployment authority. Each mutation must compile,
change the JavaScript bundle, fail its exact owning assertion with retries
disabled, then restore the original bundle hash and a green owning test. Missing
tests, browser/startup failures, signals and runner errors are rejected. Node
regression fixtures exercise those rejections; any nonzero exit alone is
insufficient.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-ot-gate
cd crypto-lab-ot-gate
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-garbled-gate](https://systemslibrarian.github.io/crypto-lab-garbled-gate/) — garbled circuits, which use oblivious transfer to deliver input labels.
- [crypto-lab-silent-tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) — Shamir-based MPC secure sum.
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — threshold signatures.
- [crypto-lab-oblivious-shelf](https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/) — IT-PIR for library query privacy.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## GG20 Wallet

- **slug**: `crypto-lab-gg20-wallet`
- **repo**: https://github.com/systemslibrarian/crypto-lab-gg20-wallet
- **live**: https://systemslibrarian.github.io/crypto-lab-gg20-wallet/
- **commit_sha**: `96c3f9140b30106c756032f5f87b2b0782cfeb83` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: hsl(195 89% 54%)
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: GG20 Wallet  — _read from src/main.ts_

**Subtitle**: Threshold ECDSA · 2-of-n MPC · secp256k1  — _read from src/main.ts_

**Description**: Run a faithful 2-of-2 GG20 signer that produces one standard secp256k1 signature via real Paillier encryption and MtA share conversion — the full private key is never reconstructed.  — _read from src/main.ts_

**Why it matters**: Most major assets still ride on secp256k1/ECDSA, so institutional custody depends on threshold ECDSA that never assembles the key. Production MtA requires the full proof and parameter-validation stack.  — _read from src/main.ts_

**Card copy**: GG20 threshold ECDSA — Paillier encryption, distributed key generation, and joint signing without any party holding the full private key. The protocol behind Fireblocks and Coinbase MPC.

**Chips**: GG20 · Paillier · secp256k1 · Distributed Key Generation

**Implements**: EC point arithmetic `src/gg20.ts:342`, Paillier `src/gg20.ts:219`, secp256k1 `src/gg20.ts:7`, SHA-256 `src/gg20.ts:347`

**Attacks shown**: Discrete log `src/main.ts:302`, Nonce reuse `README.md:58`

**Comment-only (named in code comments, not executed)**: ECDSA `src/gg20.ts:1`, Miller–Rabin `src/gg20.ts:166`, Shamir secret sharing `src/gg20.ts:554`

**References**: ECDSA, FROST, Feldman VSS, ML-DSA, Miller–Rabin, Pairing, Pedersen commitment, RSA, Schnorr, Shamir secret sharing

**Standards body**: NIST, SECG

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `ePrint 2019/114` — first seen src/main.ts:616 (1×)
- `ePrint 2020/540` — first seen src/main.ts:512 (2×)
- `eprint.iacr.org/2019/114` — first seen README.md:75 (4×)
- `eprint.iacr.org/2020/540` — first seen src/main.ts:615 (1×)
- `eprint.iacr.org/2021/1621` — first seen README.md:75 (3×)
- `RFC 9591` — first seen src/main.ts:398 (2×)

**Stated limitations (page)**:

- _(honesty, src/main.ts)_ What's real / what's simplified Real: ${real}
- _(honesty, src/main.ts)_ Symbols key — tap any term to expand its plain-language meaning ${GLOSSARY.map( (g) => `${esc(g.sym)}${esc(g.name)}. ${esc(g.gloss)}

**README — What Can Go Wrong**:

```text
- **Omitting the zero-knowledge range proofs.** Several production GG18/GG20 libraries shipped without the required range/consistency proofs and were shown to leak or fully extract private key shares — the proofs are mandatory, not optional.
- **MtA wraparound / out-of-range inputs.** If a party feeds out-of-range values into the multiplicative-to-additive conversion, it can bias the result; the range proof exists specifically to reject this.
- **Weak Paillier parameters.** Too-small or improperly generated Paillier moduli (or a missing Paillier–Blum modulus proof) break the homomorphic step the protocol relies on.
- **Nonce / randomness failures.** As with all ECDSA, predictable or reused nonce contributions can expose key material; the threshold setting adds more places for randomness to go wrong.
- **Mishandling abort and blame.** Identifiable abort only helps if the implementation actually runs the type-5/7 blame phase; silently retrying after a malicious abort can mask an active attacker.
```

**Claims tested** (e2e/claims.spec.ts, 22 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:39
    - :39 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:50
    - :50 `toBeEnabled` expected `{ timeout: 120_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:52
    - :52 `toBeEnabled` expected `{ timeout: 120_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:54
    - :54 `toContainText` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:57
    - :57 `toBeEnabled` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:64
    - :64 `toContainText` expected `'Pending', { timeout: 120_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:65
    - :65 `toContainText` expected `'Pending'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:71
    - :71 `toBeEnabled` expected `{ timeout: 120_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:72
    - :72 `toBeEnabled` expected _no expected value_ _(none)_
- `Exhibit 2 computes the two homomorphic identities, not just their labels` — e2e/claims.spec.ts:84
    - :87 `toBeDisabled` expected _no expected value_ _(none)_
    - :88 `toBeDisabled` expected _no expected value_ _(none)_
    - :92 `toContainText` expected `/Public n: 0x[0-9a-f]+/` _(regex)_
    - :93 `toBeEnabled` expected _no expected value_ _(none)_
    - :100 `toBe` expected `10n` _(expression)_
    - :102 `toBe` expected `20n` _(expression)_
- `Exhibit 3 gates signing until commitments are opened, then publishes X = X₁ + X₂` — e2e/claims.spec.ts:107
    - :110 `toContainText` expected _no expected value_ _(none)_
    - :113 `toBeDisabled` expected _no expected value_ _(none)_
    - :114 `toBeDisabled` expected _no expected value_ _(none)_
    - :115 `toBeDisabled` expected _no expected value_ _(none)_
    - :116 `toBeDisabled` expected _no expected value_ _(none)_
    - :117 `toBeDisabled` expected _no expected value_ _(none)_
    - :118 `toBeDisabled` expected _no expected value_ _(none)_
    - :119 `toContainText` expected _no expected value_ _(none)_
    - :124 `toBeEnabled` expected `{ timeout: 120_000 }` _(expression)_
    - :126 `toBeEnabled` expected `{ timeout: 120_000 }` _(expression)_
    - :128 `toContainText` expected `'X₁ + X₂: —'` _(literal)_
    - :129 `toBeDisabled` expected _no expected value_ _(none)_
    - :141 `toMatch` expected `/^0[23][0-9a-f]+$/` _(regex)_
    - :142 `toMatch` expected `/^0[23][0-9a-f]+$/` _(regex)_
    - :143 `toBe` expected `shareX('P2 X₂')` _(expression)_
    - :144 `toMatch` expected `/^0[23][0-9a-f]+$/` _(regex)_
    - :145 `toBe` expected `shareX('P1 X₁')` _(expression)_
    - :146 `toBe` expected `shareX('P2 X₂')` _(expression)_
    - :149 `toMatch` expected _no expected value_ _(none)_
    - :152 `toContainText` expected _no expected value_ _(none)_
    - :155 `toBeEnabled` expected _no expected value_ _(none)_
- `the MtA step-through reveals a real conversion whose shares sum back to a·b` — e2e/claims.spec.ts:160
    - :163 `toBeDisabled` expected _no expected value_ _(none)_
    - :164 `toBeDisabled` expected _no expected value_ _(none)_
    - :165 `toContainText` expected `'Press Load an MtA example'` _(literal)_
    - :169 `toHaveAttribute` expected `'aria-label', /step 1 of 5/` _(expression)_
    - :171 `toHaveCount` expected `0` _(literal)_
    - :172 `toHaveCount` expected `0` _(literal)_
    - :173 `toHaveCount` expected `0` _(literal)_
    - :176 `toContainText` expected `'Enc(a) = 0x'` _(literal)_
    - :178 `toHaveCount` expected `1` _(literal)_
    - :180 `toHaveCount` expected `2` _(literal)_
    - :181 `toHaveCount` expected `0` _(literal)_
    - :195 `toBe` expected `a * b + blind` _(expression)_
    - :196 `toBe` expected `(ORDER - blind) % ORDER` _(expression)_
    - :197 `toBe` expected `(alpha + beta) % ORDER` _(expression)_
    - :198 `toBe` expected `(a * b) % ORDER` _(expression)_
    - :199 `toBe` expected `product` _(expression)_
    - :200 `expect` expected _no expected value_ _(none)_
    - :201 `expect` expected _no expected value_ _(none)_
    - :202 `toHaveClass` expected `/ok/` _(regex)_
    - :203 `toContainText` expected _no expected value_ _(none)_
    - :206 `toBeDisabled` expected _no expected value_ _(none)_
    - :209 `toHaveCount` expected `0` _(literal)_
    - :210 `toHaveCount` expected `0` _(literal)_
- `an honest run passes Phase 5 against the real G and the wallet key it printed` — e2e/claims.spec.ts:215
    - :225 `toContainText` expected `'Pending — run signing above'` _(literal)_
    - :229 `toHaveCount` expected `2` _(literal)_
    - :235 `expect` expected _no expected value_ _(none)_
    - :236 `toBe` expected `true` _(expression)_
    - :239 `expect` expected _no expected value_ _(none)_
    - :240 `toBe` expected `true` _(expression)_
    - :242 `toContainText` expected `'Σ kᵢ·R'` _(literal)_
    - :243 `toContainText` expected `'✓ holds'` _(literal)_
    - :244 `toHaveClass` expected `/ok/` _(regex)_
    - :245 `toContainText` expected `'Σ σᵢ·R'` _(literal)_
    - :246 `toContainText` expected `'✓ holds'` _(literal)_
    - :247 `toHaveClass` expected `/ok/` _(regex)_
    - :248 `toContainText` expected _no expected value_ _(none)_
    - :251 `toHaveClass` expected `/ok/` _(regex)_
    - :254 `toContainText` expected `'✓ valid standard ECDSA signature'` _(literal)_
    - :255 `toHaveCount` expected `0` _(literal)_
    - :260 `toContainText` expected `'→ true ✓'` _(literal)_
    - :261 `toHaveClass` expected `/ok/` _(regex)_
- `the signature the party diagram outputs is stitched from the values above it` — e2e/claims.spec.ts:264
    - :274 `toMatch` expected `/^0[23][0-9a-f]{20}$/` _(regex)_
    - :275 `toMatch` expected `/^0x[0-9a-f]+$/` _(regex)_
    - :276 `toMatch` expected `/^[0-9a-f]{40}$/` _(regex)_
    - :281 `toBe` expected `true` _(expression)_
    - :282 `toBe` expected `xDigits.replace(/^0+/, '').slice(0, 16)` _(expression)_
    - :286 `toHaveText` expected `'held by P1 — never sent'` _(literal)_
    - :287 `toHaveText` expected `'held by P2 — never sent'` _(literal)_
    - :288 `expect` expected _no expected value_ _(none)_
    - :291 `expect` expected _no expected value_ _(none)_
    - :294 `expect` expected _no expected value_ _(none)_
- `the 25-signature self-test reports a whole that equals the sum of its parts` — e2e/claims.spec.ts:299
    - :305 `toBeVisible` expected `{ timeout: 150_000 }` _(expression)_
    - :310 `toBe` expected `25` _(literal)_
    - :311 `toBe` expected `total` _(expression)_
    - :312 `toHaveClass` expected `/ok/` _(regex)_
    - :313 `toContainText` expected `'random signatures verified'` _(literal)_
    - :314 `toBeEnabled` expected _no expected value_ _(none)_
- `malicious Party 2 aborts in Phase 5, says why, and the verdict follows the math` — e2e/claims.spec.ts:319
    - :337 `toBe` expected `false` _(expression)_
    - :338 `toBe` expected `false` _(expression)_
    - :341 `toContainText` expected `'✗ FAILS'` _(literal)_
    - :342 `toHaveClass` expected `/danger/` _(regex)_
    - :344 `toContainText` expected _no expected value_ _(none)_
    - :347 `toHaveClass` expected `/danger/` _(regex)_
    - :351 `toHaveCount` expected `1` _(literal)_
    - :352 `toContainText` expected `'Identifiable abort'` _(literal)_
    - :353 `toContainText` expected `'Σ kᵢ·R ≠ G'` _(literal)_
    - :354 `toContainText` expected `'the revealed Γ does not match the γ used in MtA'` _(literal)_
    - :355 `toContainText` expected `'Σ σᵢ·R ≠ X'` _(literal)_
    - :356 `toContainText` expected `'This is detection, not attribution'` _(literal)_
    - :359 `toContainText` expected `'✗ invalid'` _(literal)_
    - :362 `toContainText` expected `'→ false ✗'` _(literal)_
    - :363 `toHaveClass` expected `/danger/` _(regex)_
    - :368 `toHaveCount` expected `0` _(literal)_
    - :369 `toContainText` expected `'✓ both identities hold'` _(literal)_
    - :370 `toContainText` expected `'✓ valid standard ECDSA signature'` _(literal)_
    - :372 `toBe` expected `true` _(expression)_
- `re-verifying against an edited message reports false — and is styled as a failure` — e2e/claims.spec.ts:375
    - :384 `toContainText` expected `'→ true ✓'` _(literal)_
    - :388 `toContainText` expected `'→ false ✗'` _(literal)_
    - :389 `toHaveClass` expected `/danger/` _(regex)_
    - :390 `toHaveClass` expected `/ok/` _(regex)_
- `regenerating a party invalidates the signature and re-gates signing` — e2e/claims.spec.ts:393
    - :396 `toContainText` expected `'✓ valid'` _(literal)_
    - :399 `toBeEnabled` expected `{ timeout: 120_000 }` _(expression)_
    - :400 `toContainText` expected `'Pending — run signing above'` _(literal)_
    - :401 `toContainText` expected `'Pending'` _(literal)_
    - :402 `toBeDisabled` expected _no expected value_ _(none)_
    - :403 `toBeDisabled` expected _no expected value_ _(none)_
    - :404 `toContainText` expected `'X₁ + X₂: —'` _(literal)_
- `an honest range proof passes all four checks and the verdict is their conjunction` — e2e/claims.spec.ts:409
    - :412 `toBeDisabled` expected _no expected value_ _(none)_
    - :413 `toBeDisabled` expected _no expected value_ _(none)_
    - :415 `toContainText` expected `/Paillier n: 0x[0-9a-f]+/` _(regex)_
    - :416 `toContainText` expected `/Aux Ñ: 0x[0-9a-f]+/` _(regex)_
    - :420 `toBeVisible` expected `{ timeout: 120_000 }` _(expression)_
    - :423 `toContainText` expected `'✓ pass'` _(literal)_
    - :424 `toHaveClass` expected `/ok/` _(regex)_
    - :426 `toContainText` expected `'✓ accepted'` _(literal)_
    - :427 `toContainText` expected `'This does not certify the exact plaintext interval [0, q` _(expression)_
    - :428 `toHaveClass` expected `/ok/` _(regex)_
    - :435 `toBe` expected `RANGE_BOUND_BITS` _(expression)_
    - :436 `toBe` expected `768` _(literal)_
    - :437 `expect` expected _no expected value_ _(none)_
    - :438 `toContainText` expected `'a valid share < q (256 bits)'` _(literal)_
- `an out-of-range prover (m ≈ N) is rejected by the range bound alone` — e2e/claims.spec.ts:441
    - :445 `toBeVisible` expected `{ timeout: 120_000 }` _(expression)_
    - :449 `toContainText` expected `'✗ FAIL'` _(literal)_
    - :450 `toHaveClass` expected `/danger/` _(regex)_
    - :452 `toContainText` expected `'✓ pass'` _(literal)_
    - :453 `toHaveClass` expected `/ok/` _(regex)_
    - :455 `toContainText` expected `'✗ rejected'` _(literal)_
    - :456 `toContainText` expected `'rejected by the RANGE BOUND ALONE'` _(literal)_
    - :457 `toHaveClass` expected `/danger/` _(regex)_
    - :464 `toBe` expected `RANGE_BOUND_BITS` _(expression)_
    - :465 `expect` expected _no expected value_ _(none)_
    - :467 `toBe` expected `s1Bits` _(expression)_
    - :468 `toBe` expected `boundBits` _(expression)_
    - :473 `expect` expected _no expected value_ _(none)_
    - :474 `expect` expected _no expected value_ _(none)_
    - :475 `expect` expected _no expected value_ _(none)_
    - :477 `toContainText` expected `'acceptance does not prove the exact plaintext interval'` _(literal)_
    - :478 `toContainText` expected `'particular negative control'` _(literal)_
- `both provers run side by side: honest accepted, malicious rejected, same setup` — e2e/claims.spec.ts:481
    - :486 `toBeVisible` expected `{ timeout: 120_000 }` _(expression)_
    - :488 `toBeVisible` expected `{ timeout: 120_000 }` _(expression)_
    - :490 `toContainText` expected `'✓ accepted'` _(literal)_
    - :491 `toContainText` expected `'✗ rejected'` _(literal)_
    - :492 `toContainText` expected `'✓ pass'` _(literal)_
    - :493 `toContainText` expected `'✗ FAIL'` _(literal)_
    - :497 `toContainText` expected `'✓ pass'` _(literal)_
    - :498 `toContainText` expected `'✓ pass'` _(literal)_
- `Exhibit 7's \` — e2e/claims.spec.ts:504
    - :509 `toContainText` expected `'✓ implemented (Exhibit 4)'` _(literal)_
    - :510 `toContainText` expected `'✓ implemented (Exhibit 6)'` _(literal)_
    - :511 `toContainText` expected `'○ assumed honest'` _(literal)_
    - :512 `toContainText` expected `'○ described'` _(literal)_
    - :513 `toContainText` expected `'○ described'` _(literal)_
    - :518 `toContainText` expected `'✓ both identities hold'` _(literal)_
    - :521 `toContainText` expected `'✓ accepted', { timeout: 120_000 }` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-gg20-wallet

## What It Is

GG20 Wallet demonstrates the GG20 threshold ECDSA protocol (Gennaro & Goldfeder, 2020) — the cryptographic foundation of institutional MPC custody used by Fireblocks, Coinbase MPC, and ZenGo. Threshold ECDSA allows t-of-n parties to jointly produce a standard ECDSA signature without any party ever holding the full private key. GG20 is significantly more complex than threshold Schnorr (FROST) because ECDSA's nonlinear nonce computation requires Paillier homomorphic encryption for joint computation. The protocol provides security against malicious adversaries with identifiable abort.

This is a **faithful, runnable** 2-of-2 implementation — not a mock-up. It performs real secp256k1 arithmetic (`@noble/curves`), real Paillier homomorphic encryption (1024-bit modulus), real **MtA** (multiplicative-to-additive) share conversion, the two **Phase-5 consistency checks** (`Σ kᵢ·R = G` and `Σ σᵢ·R = X`) that abort a deviating round before any `sᵢ` is released, and a real **zero-knowledge range proof** (the GG18/Lindell Σ-protocol) that demonstrably rejects the out-of-range value behind the MtA wraparound attack. The full private key `x = x₁ + x₂` and the full nonce `k = k₁ + k₂` are **never reconstructed** at any point: each party computes its own `sᵢ` locally and the signature is `s = s₁ + s₂`, verifiable as an ordinary secp256k1 signature. The core (`src/gg20.ts`) is covered by a 19-test suite (`npm test`) proving 25 random end-to-end signatures verify, MtA yields correct additive shares (including the step-through diagram's `mtaTrace` intermediates: α+β = a·b, and the homomorphic reply really decrypts to a·b+β′), the Phase-5 identities hold on honest runs and break under a cheating party, and the range proof accepts honest values while rejecting the selected near-N example and tampered proofs. Scaled down for the browser: Paillier key size, the Paillier–Blum modulus proof, the MtA discrete-log binding, and the ZK proofs that make the Phase-5 abort *attributable* rather than merely detected (all documented in Exhibit 7). The protocol logic is the genuine article.

**On the abort verdict specifically:** it is derived from the two Phase-5 point identities computed over that run's own values, not from knowing whether the "malicious Party 2" toggle was set. Flip the toggle and the identities are what change; the banner follows them. A test asserts the Phase-5 verdict and the final signature verification never disagree, so neither can quietly stand in for the other.

## When to Use It

- Institutional crypto custody requiring no single point of key compromise
- Signing on secp256k1 chains (Bitcoin, Ethereum) without key assembly
- Consumer wallets with device + server 2-of-2 signing
- Any ECDSA application requiring threshold signing without on-chain multisig
- New protocols where Schnorr is available — use FROST instead (simpler, faster, no Paillier requirement)
- Non-secp256k1 curves where ECDSA is not required
- Applications where on-chain multisig is acceptable (simpler to implement, though reveals threshold policy)
- Do NOT use this for real custody — it is a scaled-down educational 2-of-2 demo, not an audited MPC custody system.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-gg20-wallet](https://systemslibrarian.github.io/crypto-lab-gg20-wallet/)**

A "Start here" 30-second guided path opens the page (with an inline **symbols key** glossing every Greek/algebraic term), followed by eight exhibits: why ECDSA threshold is harder than Schnorr threshold, Paillier homomorphic encryption as the core MPC primitive, GG20 distributed key generation with hash-commit-then-reveal, **faithful** threshold signing via MtA over Paillier — now with a **step-through MtA diagram** (a real, unit-tested conversion showing how a secret product a·b becomes two harmless additive shares α+β) and a **two-column party diagram** that places each signing value in the column of the party that holds it (so "no party holds the full key" is spatially obvious), plus a "malicious Party 2" toggle, a **Phase-5 panel** showing both consistency identities evaluated against the run's own values, and a 25-signature self-test — then security analysis, a **runnable zero-knowledge range proof** that catches the out-of-range/wraparound attack live (with all four verifier checks reported individually so you can see that only the range bound rejects the cheater), a walkthrough of the full identifiable-abort stack (what's implemented vs. described), and real-world deployments in Fireblocks, Coinbase MPC, ZenGo, and PayPal/Curv. Symbols are glossed inline throughout, and each exhibit includes a "What's real / what's simplified" disclosure.

## What Can Go Wrong

- **Omitting the zero-knowledge range proofs.** Several production GG18/GG20 libraries shipped without the required range/consistency proofs and were shown to leak or fully extract private key shares — the proofs are mandatory, not optional.
- **MtA wraparound / out-of-range inputs.** If a party feeds out-of-range values into the multiplicative-to-additive conversion, it can bias the result; the range proof exists specifically to reject this.
- **Weak Paillier parameters.** Too-small or improperly generated Paillier moduli (or a missing Paillier–Blum modulus proof) break the homomorphic step the protocol relies on.
- **Nonce / randomness failures.** As with all ECDSA, predictable or reused nonce contributions can expose key material; the threshold setting adds more places for randomness to go wrong.
- **Mishandling abort and blame.** Identifiable abort only helps if the implementation actually runs the type-5/7 blame phase; silently retrying after a malicious abort can mask an active attacker.

## Real-World Usage

- **Institutional MPC custody** — Fireblocks, Coinbase MPC, and ZenGo use threshold ECDSA so no operator ever holds a full signing key.
- **Consumer and enterprise wallets** split signing across a user device and a server in a 2-of-2 arrangement, removing a single device as a single point of compromise.
- **Exchange and treasury signing** on Bitcoin and Ethereum uses threshold ECDSA to avoid revealing the signing quorum on-chain (unlike script multisig).
- **secp256k1 blockchains generally** benefit because the output is an ordinary ECDSA signature, so no chain-side changes are needed.
- **PayPal/Curv and similar platforms** brought MPC-based key management into mainstream financial custody.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-gg20-wallet
cd crypto-lab-gg20-wallet
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — threshold Schnorr (FROST), the simpler alternative when Schnorr is available.
- [crypto-lab-paillier-gate](https://systemslibrarian.github.io/crypto-lab-paillier-gate/) — Paillier additive homomorphic encryption, the core MPC primitive in GG20.
- [crypto-lab-vss-gate](https://systemslibrarian.github.io/crypto-lab-vss-gate/) — verifiable secret sharing used in distributed key generation.
- [crypto-lab-ecdsa-forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) — single-party ECDSA and nonce-reuse attacks for contrast.
- [crypto-lab-threshold-mldsa](https://systemslibrarian.github.io/crypto-lab-threshold-mldsa/) — threshold signing in the post-quantum setting.

## Architecture

- `src/gg20.ts` — the DOM-free cryptographic core: Paillier (Miller–Rabin keygen, encrypt/decrypt), MtA share conversion, GG20 DKG and signing. This is the single source of truth, imported by both the UI and the tests.
- `src/main.ts` — the UI: rendering, state, and event wiring only.
- `test/gg20.test.ts` — Node built-in test runner suite exercising the same module the browser runs.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

### Range-proof acceptance boundary

Honest inputs use `m ∈ [0,q)`. The implemented verifier checks `0 ≤ s1 ≤ q³`, challenge consistency and two equations; it does **not** certify that exact plaintext interval. The regression suite constructs an accepted transcript with `m=q`. Wider extraction claims require the assumptions of the [December 17, 2021 GG18 revision](https://eprint.iacr.org/2019/114), not merely the response check. [Alpha-Rays (December 14, 2021)](https://eprint.iacr.org/2021/1621) motivates careful proof/setup boundaries. Scaled-down auxiliary parameters and unwired signing-path proofs do not inherit a production security theorem.

```

</details>

---

## Commit Gate

- **slug**: `crypto-lab-commit-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-commit-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-commit-gate/
- **commit_sha**: `468c06b85e1671518a4acd4b2cf2fbdfc1b325dc` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | ZERO-KNOWLEDGE  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, mutations, verification

**Name (H1)**: Commitment Schemes  — _read from src/main.ts_

**Subtitle**: Commit · Open · Verify — hiding + binding  — _read from src/main.ts_

**Description**: Build live SHA-256 hash and Pedersen commitments, publish them, then try to cheat the open to feel where binding and hiding hold or break.  — _read from src/main.ts_

**Why it matters**: Commitments underpin sealed-bid auctions, coin flips, and zero-knowledge proofs — anywhere you must lock in a value before revealing it. A broken scheme lets a cheater change their answer after seeing yours, or leak the secret early.  — _read from src/main.ts_

**Card copy**: Compare hash and Pedersen commitments, verify openings and homomorphic addition, then test a sealed-bid auction and a coin flip where a participant selectively withholds an opening.

**Chips**: Hash Commitment · Pedersen · Binding & Hiding · Homomorphic

**Implements**: EC point arithmetic `src/pedersen.ts:52`, P-256 `src/pedersen.ts:138`, Pedersen commitment `src/pedersen.ts:219`, SHA-256 `src/hashcommit.ts:46`

**Attacks shown**: Birthday bound `src/main.ts:371`, Dictionary attack `src/hashcommit.ts:134`, Discrete log `src/main.ts:431`

**Comment-only (named in code comments, not executed)**: Hash-to-curve `src/pedersen.ts:161`

**References**: Bulletproofs, FROST, Feldman VSS, Fiat-Shamir, Hash-to-curve, KZG commitment, Oblivious transfer, One-time pad, Schnorr, ristretto255

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 9380` — first seen README.md:27 (4×)
- `rfc9380` — first seen README.md:27 (3×)

**README — What Can Go Wrong**:

```text
- Reusing or exposing the blinding factor r breaks hiding, because anyone with r can recompute and test candidate messages.
- Using SHA-256(m) without blinding for predictable inputs enables offline dictionary recovery, because the commitment is deterministic over m alone.
- Biased or weak randomness for r can leak structure across commitments, because repeated or low-entropy blinders make linkage and guessing easier.
- The Pedersen blinder is sampled by rejection from all scalars modulo the P-256 order, including zero; reducing random bytes modulo the order introduces bias. Explicit zero blinding is valid mathematically but not hiding for a fixed chosen commitment.
- Treating Pedersen binding as unconditional is a usage mistake, because binding depends on the discrete-log hardness assumption in the selected group setup.
- Calling H "not a multiple of G" is incorrect in this prime-order group. The mathematical multiple exists; its scalar relation must be unknown and hard to compute. Alternate openings exist mathematically, but computing a second opening for a different message is the binding challenge.
- A commitment cannot compel an opening. A selective abort after seeing the other party's choice can bias completed coin flips if the parties simply repeat until a favorable result.
- This implementation's try-and-increment generator derivation is for teaching; [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380.html) does not recommend that mapping for production because of side-channel concerns. Use reviewed suites and protocols instead.
- Invalid or inconsistent curve arithmetic in Pedersen implementations can produce incorrect verification outcomes, because commitment equations rely on exact group operations.
```

**Claims tested** (e2e/claims.spec.ts, 12 test(s)):

- `Exhibit 1 seals a commitment and renders the same C everywhere it appears` — e2e/claims.spec.ts:62
    - :69 `toHaveClass` expected `/sealed/` _(regex)_
    - :70 `toHaveClass` expected `/opened/` _(regex)_
    - :74 `toContainText` expected `'Sealed.'` _(literal)_
    - :76 `toBe` expected `'Sealed. Commitment published to Bob.'` _(literal)_
    - :77 `toHaveAttribute` expected `'data-kind', 'info'` _(expression)_
    - :81 `toBe` expected `message` _(expression)_
    - :83 `toMatch` expected `/^[0-9a-f]{40}…$/` _(regex)_
    - :84 `toMatch` expected `/^[0-9a-f]{40}…$/` _(regex)_
    - :85 `toBe` expected `rows['Blinding r']` _(expression)_
    - :89 `toBe` expected `rows['Published C']` _(expression)_
    - :97 `toBe` expected `rows['Blinding r']` _(expression)_
- `Exhibit 1 accepts an honest opening and recomputes the published C` — e2e/claims.spec.ts:100
    - :105 `toContainText` expected `'Sealed.'` _(literal)_
    - :110 `toContainText` expected `'accepts'` _(literal)_
    - :113 `toBe` expected `'Bob accepts the opening.'` _(literal)_
    - :114 `toHaveAttribute` expected `'data-kind', 'ok'` _(expression)_
    - :115 `expect` expected _no expected value_ _(none)_
    - :118 `toBe` expected `revealed` _(expression)_
    - :120 `toBe` expected `publishedC` _(expression)_
    - :122 `toHaveClass` expected `/opened/` _(regex)_
- `Exhibit 1 rejects an opening to a different message, and says why` — e2e/claims.spec.ts:125
    - :131 `toContainText` expected `'Sealed.'` _(literal)_
    - :135 `toContainText` expected `'rejects'` _(literal)_
    - :138 `toBe` expected `'Bob rejects — cheating detected.'` _(literal)_
    - :139 `toHaveAttribute` expected `'data-kind', 'fail'` _(expression)_
    - :143 `expect` expected _no expected value_ _(none)_
    - :144 `expect` expected _no expected value_ _(none)_
    - :145 `expect` expected _no expected value_ _(none)_
    - :148 `toBe` expected `'42'` _(literal)_
    - :149 `toBe` expected `'99'` _(literal)_
    - :154 `toHaveAttribute` expected `'data-kind', 'ok'` _(expression)_
    - :155 `toBe` expected `'Bob accepts the opening.'` _(literal)_
- `Exhibit 2 tallies every batch consistently across headline, row and meter` — e2e/claims.spec.ts:168
    - :178 `expect` expected _no expected value_ _(none)_
    - :180 `toHaveCount` expected `0` _(literal)_
    - :183 `toContainText` expected `'tried so far', { timeout: 90_000 }` _(expression)_
    - :196 `toBe` expected `batch` _(expression)_
    - :197 `toBe` expected `first.row` _(expression)_
    - :198 `toBe` expected `first.row` _(expression)_
    - :199 `toBe` expected `'0'` _(literal)_
    - :200 `toHaveAttribute` expected `'data-kind', 'info'` _(expression)_
    - :204 `toBe` expected `expectedFraction(first.row)` _(expression)_
    - :207 `toContainText` expected `'${(batch * 2).toLocaleString()} tried so far', {` _(expression)_
    - :212 `toBe` expected `first.row + batch` _(expression)_
    - :213 `toBe` expected `second.row` _(expression)_
    - :214 `toBe` expected `second.row` _(expression)_
    - :215 `toBe` expected `'0'` _(literal)_
    - :218 `toBe` expected `expectedFraction(second.row)` _(expression)_
    - :221 `expect` expected _no expected value_ _(none)_
    - :223 `expect` expected _no expected value_ _(none)_
    - :228 `expect` expected _no expected value_ _(none)_
    - :235 `expect` expected _no expected value_ _(none)_
    - :236 `expect` expected _no expected value_ _(none)_
- `Exhibit 3 bias bars, |Δ| row and verdict all describe the same sample` — e2e/claims.spec.ts:241
    - :247 `toBeVisible` expected `{ timeout: 90_000 }` _(expression)_
    - :248 `toContainText` expected `'fresh commitments each', { timeout: 90_000 }` _(expression)_
    - :253 `expect` expected _no expected value_ _(none)_
    - :263 `toHaveLength` expected `2` _(literal)_
    - :264 `expect` expected _no expected value_ _(none)_
    - :265 `expect` expected _no expected value_ _(none)_
    - :267 `toMatch` expected `/^\d{1,3}\.\d%$/` _(regex)_
    - :270 `toMatch` expected `/^[\d.]+%$/` _(regex)_
    - :271 `toBe` expected `Number.parseFloat(bar.value)` _(expression)_
    - :280 `toBe` expected `bars[0].value` _(expression)_
    - :281 `toBe` expected `bars[1].value` _(expression)_
    - :282 `expect` expected _no expected value_ _(none)_
    - :283 `expect` expected _no expected value_ _(none)_
    - :284 `expect` expected _no expected value_ _(none)_
    - :285 `expect` expected _no expected value_ _(none)_
    - :290 `toBe` expected `Math.abs(zeroCount - oneCount)` _(expression)_
    - :291 `expect` expected _no expected value_ _(none)_
    - :294 `expect` expected _no expected value_ _(none)_
    - :295 `expect` expected _no expected value_ _(none)_
    - :303 `toBe` expected `'ok'` _(literal)_
    - :304 `toBe` expected `'These one-bit samples look similar.'` _(literal)_
    - :306 `toBe` expected `'info'` _(literal)_
    - :307 `toBe` expected `'Sampling noise this run; rerun for a tighter result.'` _(literal)_
    - :311 `expect` expected _no expected value_ _(none)_
    - :314 `toMatch` expected `/^[0-9a-f]{40}…$/` _(regex)_
    - :315 `toMatch` expected `/^[0-9a-f]{40}…$/` _(regex)_
    - :316 `toBe` expected `rows['A sample C(1)']` _(expression)_
- `Exhibit 3 distinguishes computational hash hiding from perfect Pedersen hiding` — e2e/claims.spec.ts:319
    - :326 `toHaveCount` expected `0` _(literal)_
    - :328 `toBeVisible` expected `{ timeout: 90_000 }` _(expression)_
    - :335 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :336 `toHaveClass` expected `/is-broken/` _(regex)_
    - :337 `toHaveClass` expected `/badge-safe/` _(regex)_
    - :338 `toContainText` expected `'Against a real (bounded) attacker: safe'` _(literal)_
    - :339 `toContainText` expected `'perfectly hidden'` _(literal)_
    - :340 `toContainText` expected `'Computational hiding'` _(literal)_
    - :341 `toContainText` expected `'Information-theoretic hiding'` _(literal)_
    - :346 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :347 `toHaveClass` expected `/is-broken/` _(regex)_
    - :348 `toHaveClass` expected `/badge-broken/` _(regex)_
    - :349 `toContainText` expected _no expected value_ _(none)_
    - :353 `toHaveClass` expected `/is-broken/` _(regex)_
    - :354 `toHaveClass` expected `/badge-safe/` _(regex)_
    - :355 `toContainText` expected _no expected value_ _(none)_
    - :358 `toContainText` expected _no expected value_ _(none)_
    - :363 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :364 `toHaveClass` expected `/is-broken/` _(regex)_
- `Exhibit 3 unblinded commitment is really SHA-256(m) and is deterministic` — e2e/claims.spec.ts:367
    - :376 `toContainText` expected `'Build the unblinded commitment first.'` _(literal)_
    - :380 `toContainText` expected `'Unblinded commitment built'` _(literal)_
    - :384 `toBe` expected `'${sha256Hex(secret).slice(0, 40)}…'` _(expression)_
    - :388 `toContainText` expected `'Unblinded commitment built'` _(literal)_
    - :389 `toBe` expected `shown` _(expression)_
- `Exhibit 3 dictionary attack recovers the secret and counts its guesses` — e2e/claims.spec.ts:392
    - :399 `toContainText` expected `'Unblinded commitment built'` _(literal)_
    - :401 `toContainText` expected `'Secret recovered'` _(literal)_
    - :403 `toBe` expected `'Secret recovered: "${secret}".'` _(expression)_
    - :404 `toHaveAttribute` expected `'data-kind', 'fail'` _(expression)_
    - :409 `expect` expected _no expected value_ _(none)_
    - :411 `expect` expected _no expected value_ _(none)_
    - :413 `expect` expected _no expected value_ _(none)_
    - :414 `expect` expected _no expected value_ _(none)_
    - :419 `toContainText` expected `'Unblinded commitment built'` _(literal)_
    - :421 `toContainText` expected `'Not in this dictionary'` _(literal)_
    - :423 `toBe` expected `'Not in this dictionary — but still not hiding.'` _(literal)_
    - :425 `expect` expected _no expected value_ _(none)_
    - :426 `expect` expected _no expected value_ _(none)_
- `Exhibit 4 opens a Pedersen commitment to the message the user typed` — e2e/claims.spec.ts:431
    - :437 `toContainText` expected `'prime-order curve'` _(literal)_
    - :438 `toContainText` expected _no expected value_ _(none)_
    - :444 `toContainText` expected `'point checks out'` _(literal)_
    - :446 `toBe` expected `'Opened m₁ = 12 and the point checks out.'` _(literal)_
    - :447 `toHaveAttribute` expected `'data-kind', 'ok'` _(expression)_
    - :448 `expect` expected _no expected value_ _(none)_
    - :451 `toBe` expected `'12'` _(literal)_
    - :452 `toMatch` expected `/^\([0-9a-f]+/);` _(expression)_
    - :457 `toContainText` expected `'Opened m₁ = 7'` _(literal)_
    - :459 `toBe` expected `'7'` _(literal)_
- `Exhibit 4 adds commitments and both computations land on one point` — e2e/claims.spec.ts:462
    - :472 `toContainText` expected `'= ${expectedSum}.'` _(expression)_
    - :475 `toHaveAttribute` expected `'data-kind', 'ok'` _(expression)_
    - :480 `expect` expected _no expected value_ _(none)_
    - :481 `toBe` expected `m1` _(expression)_
    - :482 `toBe` expected `m2` _(expression)_
    - :483 `toBe` expected `Number(parts?.[1]) + Number(parts?.[2])` _(expression)_
    - :486 `toBe` expected `expectedSum` _(expression)_
    - :490 `toBe` expected `rows['C(m₁+m₂) point']` _(expression)_
    - :491 `toMatch` expected `/^\([0-9a-f]+/);` _(expression)_
    - :496 `toBeVisible` expected _no expected value_ _(none)_
    - :498 `expect` expected _no expected value_ _(none)_
    - :499 `expect` expected _no expected value_ _(none)_
    - :500 `expect` expected _no expected value_ _(none)_
    - :501 `expect` expected _no expected value_ _(none)_
    - :522 `toBe` expected `lines['hv-c1'].x2` _(expression)_
    - :523 `toBe` expected `lines['hv-c1'].y2` _(expression)_
    - :524 `toBe` expected `lines['hv-c1'].x1` _(expression)_
    - :525 `toBe` expected `lines['hv-c1'].y1` _(expression)_
    - :526 `toBe` expected `lines['hv-c2'].x2` _(expression)_
    - :527 `toBe` expected `lines['hv-c2'].y2` _(expression)_
    - :529 `toBe` expected `lines['hv-sum'].x1` _(expression)_
- `Exhibit 5 seals every bid, then reveals the true winner` — e2e/claims.spec.ts:550
    - :557 `toContainText` expected `'Publish commitments first.'` _(literal)_
    - :564 `toContainText` expected `'sealed before reveal'` _(literal)_
    - :568 `toBe` expected `Object.keys(bids).length` _(expression)_
    - :570 `toHaveLength` expected `bidderCount` _(expression)_
    - :573 `toBe` expected `'🔒 sealed'` _(literal)_
    - :579 `toBe` expected `bidderCount` _(expression)_
    - :582 `toContainText` expected `'Winner:'` _(literal)_
    - :587 `toBe` expected `bids[row.bidder.toLowerCase()]` _(expression)_
    - :593 `toHaveAttribute` expected `'data-kind', 'ok'` _(expression)_
    - :594 `toBe` expected `'Winner: ${best.bidder} with a bid of ${best.bid}.'` _(expression)_
    - :595 `toBe` expected `Number(best.bid)` _(expression)_
    - :596 `expect` expected _no expected value_ _(none)_
- `Exhibit 5 records selective abort, rejects a changed opening, and verifies both outcomes` — e2e/claims.spec.ts:605
    - :611 `toContainText` expected `'Abort'` _(literal)_
    - :613 `toBeDisabled` expected _no expected value_ _(none)_
    - :616 `toContainText` expected `'aborted round'` _(literal)_
    - :617 `toContainText` expected `'aborted = 1'` _(literal)_
    - :618 `toContainText` expected `'result 0 = 0'` _(literal)_
    - :625 `toContainText` expected `'Verified opening: 1 ⊕ 1 = 0.'` _(literal)_
    - :626 `toContainText` expected `'result 0 = 1'` _(literal)_
    - :633 `toContainText` expected `'Changed opening rejected.'` _(literal)_
    - :634 `toContainText` expected `'rejected openings = 1'` _(literal)_
    - :641 `toContainText` expected `'Verified opening: 0 ⊕ 1 = 1.'` _(literal)_
    - :642 `toContainText` expected `'result 1 = 1'` _(literal)_
    - :643 `toContainText` expected `'RFC 9380'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-commit-gate

## What It Is
crypto-lab-commit-gate is a browser demo of SHA-256 hash commitments and Pedersen commitments over P-256. It teaches commit/open, computational binding, and hiding through live checks. A one-bit sample illustrates a test for leakage, but cannot prove hiding. Its attacker toggle contrasts a salted hash commitment's computational protection with the perfect hiding of Pedersen commitments when the blinding scalar is uniform. The demo derives the second generator H from a public hash label; because P-256 has prime order, H is mathematically a multiple of G, but the discrete-log relation is assumed hard to find. A diagram illustrates addition of commitments. The auction and coin-flip exercises also show a protocol limit: binding prevents a changed opening, but does not force a participant to reveal.

## When to Use It
- Use commitment schemes in commit-then-reveal protocols such as sealed-bid auctions, because each party can lock a value before learning others' inputs; specify deadlines and rules for a party who withholds an opening.
- Use Pedersen commitments in MPC and ZKP constructions when additive homomorphism is needed, because commitments can be combined and opened as sums.
- Use hash commitments when setup simplicity and broad platform support are priorities, because SHA-256 commitments only require hashing and randomness.
- Do not use unblinded commitments like SHA-256(m) for low-entropy messages, because dictionary attacks can recover the committed value.
- Do NOT use this as production code — it is a teaching demo of the commitment mechanics, not a hardened or audited library.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-commit-gate](https://systemslibrarian.github.io/crypto-lab-commit-gate/)**

The demo walks through six exhibits. The commit/open exhibit lets you **reveal a different message than you sealed and watch verification reject it**. The binding exhibit tries alternate openings and puts its bounded search in context with the ≈ 2¹²⁸ birthday bound for finding *some* SHA-256 collision. The hiding exhibit compares a salted hash commitment with a broken unblinded construction and states the limits of its one-bit sampling experiment. The Pedersen exhibit adds commitments over live P-256 arithmetic and draws their sum. In Exhibit 5, the auction verifies each bid opening but explicitly acknowledges non-reveal; the coin-flip exercise makes Bob commit a bit before Alice chooses hers, then tests honest opening, a rejected changed opening, and selective withholding. A four-case table shows that opening only on result 0 aborts two of four uniformly chosen bit pairs; the display records aborts separately from completed flips. Unit and browser tests cover these outcomes.

## What Can Go Wrong
- Reusing or exposing the blinding factor r breaks hiding, because anyone with r can recompute and test candidate messages.
- Using SHA-256(m) without blinding for predictable inputs enables offline dictionary recovery, because the commitment is deterministic over m alone.
- Biased or weak randomness for r can leak structure across commitments, because repeated or low-entropy blinders make linkage and guessing easier.
- The Pedersen blinder is sampled by rejection from all scalars modulo the P-256 order, including zero; reducing random bytes modulo the order introduces bias. Explicit zero blinding is valid mathematically but not hiding for a fixed chosen commitment.
- Treating Pedersen binding as unconditional is a usage mistake, because binding depends on the discrete-log hardness assumption in the selected group setup.
- Calling H "not a multiple of G" is incorrect in this prime-order group. The mathematical multiple exists; its scalar relation must be unknown and hard to compute. Alternate openings exist mathematically, but computing a second opening for a different message is the binding challenge.
- A commitment cannot compel an opening. A selective abort after seeing the other party's choice can bias completed coin flips if the parties simply repeat until a favorable result.
- This implementation's try-and-increment generator derivation is for teaching; [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380.html) does not recommend that mapping for production because of side-channel concerns. Use reviewed suites and protocols instead.
- Invalid or inconsistent curve arithmetic in Pedersen implementations can produce incorrect verification outcomes, because commitment equations rely on exact group operations.

## Sources

- Dan Boneh and Victor Shoup, [*A Graduate Course in Applied Cryptography*, version 0.6 (2023), §3.12](https://crypto.stanford.edu/~dabo/cryptobook/) — commitment-based coin flipping and aborts.
- [RFC 9380, *Hashing to Elliptic Curves* (August 2023)](https://www.rfc-editor.org/rfc/rfc9380.html) — production mapping and rejection of try-and-increment methods.
- H. Lochbihler et al., [*On the Formalisation of Σ-Protocols and Commitment Schemes* (2019)](https://arxiv.org/abs/1705.05897) — perfect hiding and computational binding of Pedersen commitments.

## Real-World Usage
- Zcash Sapling uses Pedersen commitments on Jubjub for its note commitments; Orchard replaced those with Sinsemilla commitments on Pallas, which is friendlier to Halo 2 lookups. Both still use homomorphic Pedersen commitments for the value commitments that let a circuit balance a transaction.
- Monero uses Pedersen commitments in RingCT and Bulletproof-based range proofs to hide transaction amounts with additive consistency checks.
- Ethereum-style commit-reveal workflows (for example ENS reveal phases and many on-chain games) use hash commitments to lock choices before reveal.
- Threshold signature systems and DKG stacks (including FROST-family workflows) use nonce or share commitments to prevent adaptive tampering across rounds.
- Modern SNARK systems use polynomial commitments (for example KZG-style commitments in proving systems) to bind polynomials while enabling succinct verification.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-commit-gate
cd crypto-lab-commit-gate
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-bulletproofs](https://systemslibrarian.github.io/crypto-lab-bulletproofs/) — range proofs built directly on Pedersen commitments over ristretto255.
- [crypto-lab-vss-gate](https://systemslibrarian.github.io/crypto-lab-vss-gate/) — Feldman and Pedersen verifiable secret sharing, which use commitments to detect cheating.
- [crypto-lab-zk-proof-lab](https://systemslibrarian.github.io/crypto-lab-zk-proof-lab/) — Schnorr commitments and Fiat-Shamir, commitments inside an interactive proof.
- [crypto-lab-snark-arena](https://systemslibrarian.github.io/crypto-lab-snark-arena/) — zk-SNARKs whose proving systems rely on polynomial commitments.
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — FROST threshold signing, which uses nonce and VSS commitments across rounds.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Threshold Decrypt

- **slug**: `crypto-lab-threshold-decrypt`
- **repo**: https://github.com/systemslibrarian/crypto-lab-threshold-decrypt
- **live**: https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/
- **commit_sha**: `a4ae3917728d19eb9a3d62196646c78251c972f2` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, verification

**Name (H1)**: Threshold Decryption  — _read from src/main.ts_

**Subtitle**: t-of-n · P-256 ElGamal · Shamir/Feldman · NIZK partials  — _read from src/main.ts_

**Description**: Run distributed key generation, then watch any t of n parties jointly decrypt by Lagrange-combining their NIZK-verified partial decryptions.  — _read from src/main.ts_

**Why it matters**: No single party ever holds the decryption key, so no lone insider or stolen laptop can read the data. Requiring a quorum removes single points of failure while any t-1 colluding parties still learn nothing.  — _read from src/main.ts_

**Card copy**: ElGamal over P-256 — distributed key generation, verifiable partial decryptions with NIZK proofs, and t-of-n combination without any party holding the full private key.

**Chips**: ElGamal · P-256 · NIZK Proofs · t-of-n

**Implements**: AES `src/elgamal.ts:119`, AES-GCM `src/elgamal.ts:140`, ElGamal `src/main.ts:12`, P-256 `src/election.ts:3`, Pedersen commitment `src/election.ts:4`, SHA-256 `src/elgamal.ts:98`, Shamir secret sharing `src/main.ts:324`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: EC point arithmetic `src/elgamal.ts:208`, Fiat-Shamir `src/elgamal.ts:224`

**References**: FROST, Feldman VSS, Fiat-Shamir, HMAC, Paillier, Sum-check

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `asiacrypt2012` — first seen src/electionPanel.ts:38 (1×)

**README — What Can Go Wrong**:

```text
- A ballot box that sums without checking validity proofs can count a dishonest voter's encrypted 2 or −1, even when every threshold partial verifies. A MAC from that same voter cannot prove the value is a permitted vote.
- A Fiat–Shamir proof must bind the whole statement and election context. This exhibit hashes the domain tag, election id, voter index, generator, group public key, ciphertext and all four commitments.
- A valid ballot can still be a receipt for sale: revealing its randomness lets a third party check the vote publicly. This teaching system does not implement receipt-freeness, eligibility or a complete election protocol.
- Invalid share verification flow: if implementations skip `verifyPartialDecryption`, malformed or malicious partial decryptions can be accepted and break recovery correctness.
- Wrong threshold configuration: setting `t` too low weakens compromise resistance, while setting it too high can make decryption unavailable during normal outages.
- Inconsistent participant indexing: Lagrange interpolation depends on exact party identifiers, so index mismatch across parties yields failed reconstruction.
- Partial participation assumptions: workflows that expect all parties online can deadlock if fewer than `t` parties are available at decryption time.
- Key share leakage concentration: if enough private shares leak across systems to meet `t`, confidentiality is lost even if each individual leak seemed limited.
```

**Claims tested** (e2e/claims.spec.ts, 24 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:96
    - :96 `toContainText` expected `'0 selected'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:103
    - :103 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:108
    - :108 `toBeEnabled` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:110
    - :110 `toHaveCount` expected `scheme.n` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:116
    - :116 `toBeVisible` expected _no expected value_ _(none)_
- `Exhibit 0: t revealed points pin one curve, and caption, plot label and ARIA agree on the secret` — e2e/claims.spec.ts:123
    - :127 `toHaveCount` expected `n` _(expression)_
    - :130 `toHaveCount` expected `t` _(expression)_
    - :131 `toHaveCount` expected `t` _(expression)_
    - :134 `expect` expected _no expected value_ _(none)_
    - :135 `expect` expected _no expected value_ _(none)_
    - :141 `expect` expected _no expected value_ _(none)_
    - :143 `toBe` expected `captionSecret` _(expression)_
    - :144 `toBe` expected `captionSecret` _(expression)_
    - :146 `toHaveCount` expected `1` _(literal)_
    - :147 `toHaveCount` expected `0` _(literal)_
- `Exhibit 0: one point short leaves the secret free — no pinned secret, a fan of distinct curves` — e2e/claims.spec.ts:150
    - :156 `toHaveCount` expected `t - 1` _(expression)_
    - :157 `toHaveCount` expected `t - 1` _(expression)_
    - :160 `expect` expected _no expected value_ _(none)_
    - :161 `expect` expected _no expected value_ _(none)_
    - :164 `expect` expected _no expected value_ _(none)_
    - :165 `toHaveCount` expected `0` _(literal)_
    - :166 `toHaveCount` expected `0` _(literal)_
    - :167 `expect` expected _no expected value_ _(none)_
- `Exhibit 0: the plot tracks the configured scheme when the party count changes` — e2e/claims.spec.ts:172
    - :174 `toHaveCount` expected `before.n` _(expression)_
    - :181 `toBe` expected `before.n + 1` _(expression)_
    - :182 `toHaveCount` expected `after.n` _(expression)_
    - :183 `toHaveCount` expected `after.n` _(expression)_
    - :184 `toHaveText` expected `'Reveal exactly ${after.t}'` _(expression)_
    - :185 `toHaveText` expected `'Reveal ${after.t - 1} (one short)'` _(expression)_
- `Exhibit 1: DKG publishes exactly one public share per party and a single group key` — e2e/claims.spec.ts:192
    - :194 `toBeVisible` expected _no expected value_ _(none)_
    - :197 `toBeVisible` expected _no expected value_ _(none)_
    - :201 `toHaveCount` expected `n` _(expression)_
    - :202 `toHaveCount` expected `n` _(expression)_
    - :204 `toHaveText` expected `'P${id}'` _(expression)_
    - :205 `toContainText` expected `'P${id} · '` _(expression)_
    - :210 `toMatch` expected `/^[0-9a-f]{18}…[0-9a-f]{18}$/` _(regex)_
    - :212 `toHaveClass` expected `/done/` _(regex)_
- `Exhibit 1: changing the threshold after key generation discards the stale pipeline` — e2e/claims.spec.ts:215
    - :218 `toBeVisible` expected _no expected value_ _(none)_
    - :220 `toBeEnabled` expected _no expected value_ _(none)_
    - :227 `toBe` expected `before.t + 1` _(expression)_
    - :229 `toHaveCount` expected `0` _(literal)_
    - :230 `toBeVisible` expected _no expected value_ _(none)_
    - :231 `toBeVisible` expected _no expected value_ _(none)_
    - :232 `toBeDisabled` expected _no expected value_ _(none)_
    - :233 `toHaveClass` expected `/done/` _(regex)_
- `Exhibit 2: solo decryption fails and names the reason and the quorum it needs` — e2e/claims.spec.ts:240
    - :243 `toBeVisible` expected _no expected value_ _(none)_
    - :245 `toBeEnabled` expected _no expected value_ _(none)_
    - :248 `toBeVisible` expected _no expected value_ _(none)_
    - :249 `toBeVisible` expected _no expected value_ _(none)_
    - :253 `toBeVisible` expected _no expected value_ _(none)_
    - :255 `expect` expected _no expected value_ _(none)_
    - :256 `expect` expected _no expected value_ _(none)_
    - :257 `expect` expected _no expected value_ _(none)_
    - :259 `expect` expected _no expected value_ _(none)_
- `Exhibit 2: editing the message retires its ciphertext and every downstream verdict` — e2e/claims.spec.ts:262
    - :265 `toBeVisible` expected _no expected value_ _(none)_
    - :268 `toContainText` expected `'Plaintext recovered'` _(literal)_
    - :272 `toHaveValue` expected `'second message'` _(literal)_
    - :273 `toBeVisible` expected _no expected value_ _(none)_
    - :274 `toContainText` expected `'every result derived from it were retired'` _(literal)_
    - :275 `toHaveCount` expected `0` _(literal)_
    - :276 `toHaveCount` expected `0` _(literal)_
    - :277 `toHaveCount` expected `0` _(literal)_
    - :278 `toBeDisabled` expected _no expected value_ _(none)_
    - :279 `toBeEnabled` expected _no expected value_ _(none)_
- `Exhibit 2: a late encryption result cannot repaint evidence after the message changes` — e2e/claims.spec.ts:282
    - :311 `toBeVisible` expected _no expected value_ _(none)_
    - :326 `toContainText` expected `'previous ciphertext'` _(literal)_
    - :341 `toHaveValue` expected `'message changed while encryption was pending'` _(literal)_
    - :342 `toBeVisible` expected _no expected value_ _(none)_
    - :343 `toHaveCount` expected `0` _(literal)_
    - :344 `toContainText` expected `'every result derived from it were retired'` _(literal)_
    - :345 `toBeEnabled` expected _no expected value_ _(none)_
- `Exhibit 3: every honest partial verifies, and all three equations hold for each` — e2e/claims.spec.ts:352
    - :356 `toHaveCount` expected `n` _(expression)_
    - :357 `toHaveCount` expected `0` _(literal)_
    - :358 `toBeVisible` expected _no expected value_ _(none)_
    - :360 `toHaveCount` expected `n` _(expression)_
    - :361 `toHaveCount` expected `n` _(expression)_
    - :362 `toHaveCount` expected `n * 3` _(expression)_
    - :363 `toHaveCount` expected `0` _(literal)_
    - :364 `toContainText` expected `'accepted'` _(literal)_
- `Exhibit 3: an injected cheat is NOT called rejected until the verifier has run` — e2e/claims.spec.ts:367
    - :370 `toHaveCount` expected `n` _(expression)_
    - :374 `toHaveCount` expected `n` _(expression)_
    - :375 `toHaveCount` expected `0` _(literal)_
    - :376 `toHaveCount` expected `0` _(literal)_
    - :377 `toHaveCount` expected `0` _(literal)_
    - :378 `toBeVisible` expected _no expected value_ _(none)_
- `Exhibit 3: the cheat breaks exactly the equations that contain d` — e2e/claims.spec.ts:381
    - :384 `toHaveCount` expected `n` _(expression)_
    - :389 `toHaveCount` expected `1` _(literal)_
    - :390 `toHaveCount` expected `n - 1` _(expression)_
    - :391 `toHaveCount` expected `1` _(literal)_
    - :392 `toHaveCount` expected `n - 1` _(expression)_
    - :395 `toContainText` expected `'Party ${cheatId}: rejected'` _(expression)_
    - :396 `toBeVisible` expected _no expected value_ _(none)_
    - :401 `toHaveCount` expected `3` _(literal)_
    - :402 `toHaveClass` expected `/\bno\b/` _(regex)_
    - :403 `toContainText` expected `'c = H(transcript)'` _(literal)_
    - :404 `toHaveClass` expected `/\bok\b/` _(regex)_
    - :405 `toContainText` expected `'g^s = a1 · y^c'` _(literal)_
    - :406 `toHaveClass` expected `/\bno\b/` _(regex)_
    - :407 `toContainText` expected `'c1^s = a2 · d^c'` _(literal)_
    - :410 `toHaveCount` expected `0` _(literal)_
    - :411 `toHaveCount` expected `(n - 1) * 3` _(expression)_
- `Exhibit 4: the quorum meter agrees with the number of chips actually selected` — e2e/claims.spec.ts:418
    - :424 `toHaveCount` expected `k` _(expression)_
    - :427 `toHaveText` expected `expected` _(expression)_
    - :430 `toHaveAttribute` expected `'aria-valuemax', String(t)` _(expression)_
    - :431 `toHaveAttribute` expected `'aria-valuenow', String(Math.min(k, t))` _(expression)_
    - :434 `toBe` expected `'${Math.min(100, Math.round((k / t) * 100))}%'` _(expression)_
    - :435 `toBe` expected `k >= t ? 1 : 0` _(expression)_
- `Exhibit 4: a below-threshold set fails, says why, and shows one free variable per missing share` — e2e/claims.spec.ts:439
    - :450 `toHaveText` expected `'${picked} selected · need ${t}'` _(expression)_
    - :453 `toBeVisible` expected _no expected value_ _(none)_
    - :454 `toHaveClass` expected `/\bbad\b/` _(regex)_
    - :456 `expect` expected _no expected value_ _(none)_
    - :457 `expect` expected _no expected value_ _(none)_
    - :458 `expect` expected _no expected value_ _(none)_
    - :459 `expect` expected _no expected value_ _(none)_
    - :461 `expect` expected _no expected value_ _(none)_
    - :465 `toBeVisible` expected _no expected value_ _(none)_
    - :466 `toHaveCount` expected `t` _(expression)_
    - :467 `toHaveCount` expected `t - picked` _(expression)_
    - :468 `toHaveCount` expected `picked` _(expression)_
    - :469 `toHaveClass` expected `/done/` _(regex)_
- `Exhibit 4: a set containing a rejected partial is refused before any combination` — e2e/claims.spec.ts:472
    - :476 `toHaveCount` expected `n` _(expression)_
    - :489 `toContainText` expected `'${t} selected · need ${t}'` _(expression)_
    - :492 `toBeVisible` expected _no expected value_ _(none)_
    - :493 `toHaveClass` expected `/\bbad\b/` _(regex)_
    - :495 `expect` expected _no expected value_ _(none)_
    - :496 `expect` expected _no expected value_ _(none)_
    - :497 `expect` expected _no expected value_ _(none)_
    - :498 `expect` expected _no expected value_ _(none)_
    - :500 `toHaveCount` expected `0` _(literal)_
    - :501 `expect` expected _no expected value_ _(none)_
- `Exhibit 4: auto-select routes around a rejected partial only after verification` — e2e/claims.spec.ts:504
    - :506 `toHaveText` expected `'Auto-select ${t}'` _(expression)_
    - :512 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :515 `toHaveCount` expected `1` _(literal)_
    - :516 `toHaveText` expected `'Auto-select ${t} verified'` _(expression)_
    - :520 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :521 `toHaveCount` expected `t` _(expression)_
    - :522 `toContainText` expected `'${t} selected · need ${t} · ${n - 1} proven valid · quorum met'` _(expression)_
- `Exhibit 4: t valid partials recover exactly the message that was encrypted` — e2e/claims.spec.ts:525
    - :530 `toHaveCount` expected `t` _(expression)_
    - :533 `toBeVisible` expected _no expected value_ _(none)_
    - :534 `toHaveClass` expected `/\bgood\b/` _(regex)_
    - :536 `expect` expected _no expected value_ _(none)_
    - :537 `expect` expected _no expected value_ _(none)_
    - :538 `expect` expected _no expected value_ _(none)_
    - :541 `toHaveCount` expected `4` _(literal)_
    - :542 `toHaveCount` expected `4` _(literal)_
- `Exhibit 4: the Lagrange weights on screen are the real coefficients for the selected ids` — e2e/claims.spec.ts:545
    - :552 `toBeVisible` expected _no expected value_ _(none)_
    - :555 `toHaveCount` expected `t` _(expression)_
    - :565 `toEqual` expected `[...selected].sort((a, b) => a - b)` _(expression)_
    - :571 `toBe` expected `expected` _(expression)_
    - :575 `toBe` expected `t` _(expression)_
    - :576 `toHaveText` expected `/^[0-9a-f]{10}…[0-9a-f]{10}$/` _(regex)_
    - :577 `toContainText` expected `'AES-GCM key'` _(literal)_
- `Exhibit 5: the compromise verdict flips exactly at the threshold` — e2e/claims.spec.ts:584
    - :594 `toHaveValue` expected `String(t - 1)` _(expression)_
    - :595 `toHaveClass` expected `/\bgood\b/` _(regex)_
    - :596 `toHaveText` expected _no expected value_ _(none)_
    - :599 `toContainText` expected _no expected value_ _(none)_
    - :605 `toHaveValue` expected `String(t)` _(expression)_
    - :606 `toHaveClass` expected `/\bbad\b/` _(regex)_
    - :607 `toHaveText` expected _no expected value_ _(none)_
    - :610 `toContainText` expected _no expected value_ _(none)_
- `Exhibit 5: the trusted-dealer contrast states the problem DKG solves` — e2e/claims.spec.ts:615
    - :619 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :620 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :621 `toHaveClass` expected `/\bbad\b/` _(regex)_
    - :622 `toContainText` expected `'The single point of failure just moved to the dealer.'` _(literal)_
    - :625 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :626 `toHaveClass` expected `/\bgood\b/` _(regex)_
    - :627 `toContainText` expected `'every party is its own dealer'` _(literal)_

**Mutation records** (2 file(s)):

- `mutation-evidence.json` (31105 bytes)
- `scripts/check-extension-mutations.mjs` (5766 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-threshold-decrypt

## What It Is
This demo shows threshold decryption where a ciphertext encrypted with `encryptToGroupPublicKey` can only be opened when enough participants cooperate. Keys are generated with `runDistributedKeyGeneration`, which produces Shamir-style secret shares so no single party holds the full decryption secret. Each party creates a partial decrypt with `createPartialDecryptionWithProof`, and **Attempt recovery** runs `checkPartialDecryption` over every partial and refuses to combine if any selected one fails — proof checking is enforced on the recovery path, not merely offered as a separate button. Recovery happens with `thresholdDecryptCiphertext`, which requires a `t-of-n` quorum and demonstrates removal of a single decryption point of failure.

The demo opens with an interactive **"why t points pin a secret"** exhibit — a live Shamir polynomial you can probe by revealing share dots to *see* that exactly `t` points fix one curve (and its secret at `x=0`) while any `t-1` leave the secret free. That geometric idea is the heart of secret sharing; the panels below then run the real P-256 machinery on top of it. Heavy terms (Feldman-VSS, DKG, Chaum-Pedersen, NIZK) each carry an inline one-sentence plain-language gloss, so the vocabulary is taught rather than assumed.

**Exhibit 6 — Election Tally** adds exponential ElGamal ballots on the same DKG key: seven voters encrypt 0 or 1, the ballot box adds ciphertexts, and a quorum opens only the total. Every ballot carries a disjunctive Chaum–Pedersen proof; the default box verifies its four equations and challenge sum before including it. Disabling proof checking exposes plausible but wrong totals from votes of 2 or −1. A public receipt demonstrates the remaining limitation: valid ballots and correct tallying do not provide receipt-freeness.

## When to Use It
- Use this when decryption authority must be shared across operators, because one compromised operator alone cannot decrypt.
- Use this for quorum-based key custody, because the scheme enforces a configurable `t-of-n` threshold before plaintext recovery.
- Use this when you need cryptographic validation of each participant step, because partial decryptions include Chaum-Pedersen NIZK proofs.
- Use this when one process must decrypt immediately without coordination, threshold decryption is the wrong fit, because it requires collecting enough cooperating parties.
- Do NOT treat this as production decryption infrastructure — it is a teaching demo, not an audited library.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-threshold-decrypt](https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/)**

Start with **Exhibit 0**, the polynomial explorer: toggle share dots on and off and watch `t` points collapse the fan of candidate curves down to one (pinning the secret) while `t-1` leave a spread of equally-valid secrets. Then adjust party count and the threshold slider, and — before trusting the DKG — flip the **trusted-dealer vs. DKG** contrast to see what problem distributed key generation actually solves (a lone dealer who splits the key still held the whole key). Run distributed key generation, encrypt a message, then generate each party's partial decryption and verify its Chaum-Pedersen NIZK proof: the verifier shows all **three equalities** it checks with a ✓/✗ on each, so when you inject a cheating partial — a party that keeps its proof bytes but submits a different `d` — you see exactly which equation the forgery breaks, and why. `d` appears in only one of the two equations, so `c1^s = a2·d^c` fails while `g^s = a1·y^c` still holds: the response really does open the party's public key, it just does not open the `d` that was handed over, and binding those two bases together is precisely the job of a Chaum-Pedersen proof. The Fiat-Shamir challenge check fails alongside it, because `d` is hashed into the transcript. In the combination step you pick a cooperating set against a live quorum meter and attempt recovery — `t` valid partials reconstruct the plaintext while `t-1` (or any set containing a rejected partial) fails. A final security panel models how many compromised parties it takes to break confidentiality for the configured `t-of-n`.

In Exhibit 6, cast the votes, tally the encrypted ballots, and open the total with the selected quorum; then try an over-vote with proof checking off and on, replay a ballot at another voter index, or reveal one voter's randomness to check a transferable receipt.

## What Can Go Wrong
- A ballot box that sums without checking validity proofs can count a dishonest voter's encrypted 2 or −1, even when every threshold partial verifies. A MAC from that same voter cannot prove the value is a permitted vote.
- A Fiat–Shamir proof must bind the whole statement and election context. This exhibit hashes the domain tag, election id, voter index, generator, group public key, ciphertext and all four commitments.
- A valid ballot can still be a receipt for sale: revealing its randomness lets a third party check the vote publicly. This teaching system does not implement receipt-freeness, eligibility or a complete election protocol.
- Invalid share verification flow: if implementations skip `verifyPartialDecryption`, malformed or malicious partial decryptions can be accepted and break recovery correctness.
- Wrong threshold configuration: setting `t` too low weakens compromise resistance, while setting it too high can make decryption unavailable during normal outages.
- Inconsistent participant indexing: Lagrange interpolation depends on exact party identifiers, so index mismatch across parties yields failed reconstruction.
- Partial participation assumptions: workflows that expect all parties online can deadlock if fewer than `t` parties are available at decryption time.
- Key share leakage concentration: if enough private shares leak across systems to meet `t`, confidentiality is lost even if each individual leak seemed limited.

## Real-World Usage
- HashiCorp Vault (Shamir unseal): Vault uses threshold key shares for unsealing so one administrator cannot unseal alone.
- AWS CloudHSM key ceremonies: multi-operator controls use quorum-style procedures so critical key actions require cooperating custodians.
- GPG split-key operational workflows: teams split decryption authority across custodians for controlled emergency access.
- Threshold wallet and custody platforms: institutional crypto custody systems use threshold key shares to remove single-key escrow risk.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-threshold-decrypt
cd crypto-lab-threshold-decrypt
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-shamir-gate](https://systemslibrarian.github.io/crypto-lab-shamir-gate/) — the Shamir secret sharing this threshold scheme is built on.
- [crypto-lab-vss-gate](https://systemslibrarian.github.io/crypto-lab-vss-gate/) — verifiable secret sharing, the dealer-integrity layer under distributed key generation.
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — the signing counterpart: `t-of-n` threshold signatures instead of decryption.
- [crypto-lab-paillier-gate](https://systemslibrarian.github.io/crypto-lab-paillier-gate/) — a single-key election tally with a MAC against outsider tampering; Exhibit 6 here addresses dishonest voters using validity proofs and a quorum.
- [crypto-lab-elgamal-plain](https://systemslibrarian.github.io/crypto-lab-elgamal-plain/) — the base ElGamal scheme this demo runs in threshold form.

- [crypto-lab-frozen-heart](https://systemslibrarian.github.io/crypto-lab-frozen-heart/) — why omitting the statement from a Fiat–Shamir transcript breaks its security claim.

## Verification
The cryptographic core is covered by a Vitest suite (`npm test`) that exercises the ElGamal/AES-GCM round trip, Chaum-Pedersen proof acceptance and rejection (including the per-equation breakdown behind Exhibit 3), Shamir/Lagrange reconstruction, Feldman-VSS key generation, and the full `t`-of-`n` decryption path — plus a happy-dom UI smoke test of the demo wiring. The Exhibit 0 polynomial visualization runs the same Shamir construction over small integers and is separately tested to confirm `t` points reconstruct the exact secret while fewer admit distinct secrets. The same suite runs in CI on every push before deployment, alongside a strict axe-core WCAG 2.1 AA gate in the shipped dark theme.

The election extension adds an independent verifier built directly from Noble P-256 points and Node SHA-256, twenty randomized seven-voter elections, all-zero/infinity and out-of-range cases, replay rejection, and public receipt checks. Browser tests independently verify every displayed ballot, all aggregate partial proofs, Lagrange combination, bounded search and the receipt equations. They also cover stale asynchronous results, key and input retirement, and no-op edits. Accessibility drives the entire old and new workflow at desktop/380px and the election at 320px.

`npm run test:mutations` builds six concrete mutations, requires a named browser assertion failure against the exact served bundle with zero retries, and restores byte-identical source/build output followed by a green owning test. See `mutation-evidence.json` and `extension-handoff.md`.

`​``bash
npm install
npm test        # run the test suite
npm run dev     # serve the demo locally
npm run build   # type-check and produce the production bundle
`​``

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Kerberos v5

- **slug**: `crypto-lab-kerberos`
- **repo**: https://github.com/systemslibrarian/crypto-lab-kerberos
- **live**: https://systemslibrarian.github.io/crypto-lab-kerberos/
- **commit_sha**: `c631f5b150c763dd807fc6552a8d8c7501236a38` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | ATTACKS  ·  **level**: intermediate  ·  **--accent**: var(--teal)
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Kerberos  — _read from src/app.ts_

**Subtitle**: Needham-Schroeder \u2192 Lowe fix \u2192 Kerberos v5 \u00b7 RFC 4120  — _read from src/app.ts_

**Description**: Step through the arc from Needham-Schroeder (1978) and Lowe\u2019s man-in-the-middle fix (1995) to Kerberos v5, watching a KDC issue AES-256 tickets while replays and clock skew get rejected in real WebCrypto.  — _read from src/app.ts_

**Why it matters**: Every domain login and single sign-on trusts a third party you never see. A subtle protocol flaw lets one attacker impersonate anyone \u2014 which is why Lowe\u2019s fix and Kerberos\u2019 replay and clock-skew defenses exist.  — _read from src/app.ts_

**Card copy**: RFC 4120 Kerberos v5 — Needham-Schroeder origins, Lowe attack, full AS/TGS/AP exchange flow, AES-256-CTS-HMAC-SHA1-96 ticket encryption, and clock-skew replay defense.

**Chips**: RFC 4120 · Needham-Schroeder · Lowe Attack · AES-256-CTS

**Implements**: AES `src/crypto/cts.ts:21`, AES-CBC `src/crypto/simplified-profile.ts:80`, HMAC `src/crypto/etype-aes256.ts:49`, Kerberos `src/app.ts:140`, PBKDF2 `src/crypto/pbkdf2-string2key.ts:10`, RSA `src/attacks/lowe-attack.ts:26`, RSA-OAEP `src/attacks/lowe-attack.ts:26`, SHA-1 `src/crypto/pbkdf2-string2key.ts:10`, SHA-256 `src/protocols/needham-schroeder.ts:34`

**Attacks shown**: Man-in-the-middle `src/app.ts:26`

**References**: WebAuthn

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 3961` — first seen README.md:42 (6×)
- `RFC 3962` — first seen README.md:5 (13×)
- `RFC 4120` — first seen README.md:5 (16×)
- `rfc3962` — first seen README.md:94 (1×)

**README — What Can Go Wrong**:

```text
- **Clock skew** - if a client drifts beyond the KDC's tolerance (commonly around 5 minutes), authentication fails outright because timestamps anchor the replay and expiry defenses.
- **KDC compromise** - the KDC is a single point of trust; theft of the krbtgt key lets an attacker mint arbitrary tickets ("golden ticket") for any principal.
- **Replay without a working replay cache** - captured authenticators can be replayed within their lifetime if the service does not retain and check them.
- **Weak principal passwords** - service and account keys derived from weak passwords are exposed to offline cracking of pre-auth data and service tickets (Kerberoasting-style attacks).
- **Ticket theft** - possession of a ticket is sufficient to use it; stolen ticket material can be reused (pass-the-ticket) until it expires.
```

**Claims tested** (e2e/claims.spec.ts, 18 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:40
    - :40 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:73
    - :73 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:91
    - :91 `toHaveClass` expected `new RegExp('scenario-${key}(\\s|$)')` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:92
    - :92 `toContainText` expected `LABELS[key]!, { timeout: HEAVY }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:94
    - :94 `toBeVisible` expected `{ timeout: HEAVY }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:99
    - :99 `toBeVisible` expected `{ timeout: HEAVY }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:100
    - :100 `toHaveCount` expected `0, { timeout: HEAVY }` _(expression)_
- `the self-check runs real vectors and every one of them passes` — e2e/claims.spec.ts:107
    - :112 `toHaveCount` expected `4, { timeout: HEAVY }` _(expression)_
    - :115 `toHaveCount` expected `0` _(literal)_
    - :116 `toBe` expected `4` _(literal)_
    - :128 `toBe` expected `row.ok ? '✓' : '✗'` _(expression)_
    - :132 `toBe` expected `'matches 55a6ac74…'` _(literal)_
    - :134 `toMatch` expected `/^\d+ bytes → ok$/` _(regex)_
    - :135 `toBe` expected `'rejected forged ciphertext'` _(literal)_
    - :137 `toBe` expected `'6 messages → ok'` _(literal)_
- `the honest Needham-Schroeder run carries its nonces through unchanged` — e2e/claims.spec.ts:144
    - :149 `toHaveCount` expected `3` _(literal)_
    - :154 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :155 `toBe` expected `na1` _(expression)_
    - :156 `toBe` expected `'Alice'` _(literal)_
    - :159 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :160 `toBe` expected `na1` _(expression)_
    - :161 `toBe` expected `nb2` _(expression)_
    - :164 `toBe` expected `true` _(expression)_
    - :165 `expect` expected _no expected value_ _(none)_
    - :168 `toContainText` expected `'does not name Bob inside this message'` _(literal)_
    - :171 `toBeHidden` expected _no expected value_ _(none)_
- `the Lowe relay reaches Bob without ever changing the sealed nonce` — e2e/claims.spec.ts:174
    - :179 `toHaveCount` expected `6` _(literal)_
    - :184 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :185 `toBe` expected `na` _(expression)_
    - :188 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :189 `toBe` expected `nb` _(expression)_
    - :201 `expect` expected _no expected value_ _(none)_
    - :204 `toBe` expected `seal.from === '_pkM' ? '🔓' : '🔒'` _(expression)_
    - :205 `toBe` expected `seal.to` _(expression)_
    - :210 `toBe` expected `false` _(expression)_
    - :211 `expect` expected _no expected value_ _(none)_
    - :213 `expect` expected _no expected value_ _(none)_
    - :214 `toBe` expected `'Mallory'` _(literal)_
    - :215 `toBe` expected `'Alice'` _(literal)_
    - :216 `toBe` expected `believed![2]` _(expression)_
- `the same relay against Lowe’s fix dies two messages early, and honest use survives` — e2e/claims.spec.ts:219
    - :229 `toBe` expected `4` _(literal)_
    - :230 `toBe` expected `2` _(literal)_
    - :233 `toBe` expected `'Bob'` _(literal)_
    - :234 `toBe` expected `'Bob'` _(literal)_
    - :236 `toBe` expected `na` _(expression)_
    - :239 `toHaveLength` expected `2` _(literal)_
    - :242 `toBe` expected `true` _(expression)_
    - :243 `expect` expected _no expected value_ _(none)_
    - :244 `expect` expected _no expected value_ _(none)_
    - :245 `expect` expected _no expected value_ _(none)_
    - :250 `toContainText` expected `['Alice', 'Mallory', 'Bob']` _(expression)_
    - :251 `toBe` expected `true` _(expression)_
    - :252 `expect` expected _no expected value_ _(none)_
    - :253 `expect` expected _no expected value_ _(none)_
- `the Kerberos flow’s six messages echo each other’s nonce, ctime and cusec` — e2e/claims.spec.ts:260
    - :265 `toHaveCount` expected `6` _(literal)_
    - :269 `toBe` expected `nonce` _(expression)_
    - :270 `expect` expected _no expected value_ _(none)_
    - :274 `toBe` expected `'2 (PA-ENC-TIMESTAMP)'` _(literal)_
    - :275 `toMatch` expected `/^[0-9a-f]{64}… \(\d+ bytes\)$/` _(regex)_
    - :276 `toBe` expected `'true'` _(literal)_
    - :277 `toBe` expected `'krbtgt/LAB.EXAMPLE'` _(literal)_
    - :278 `toBe` expected `'18'` _(literal)_
    - :281 `toBe` expected `'http/web.lab.example'` _(literal)_
    - :282 `toBe` expected `'18'` _(literal)_
    - :288 `toBe` expected `ctime` _(expression)_
    - :289 `toBe` expected `cusec` _(expression)_
    - :290 `toBe` expected `'alice'` _(literal)_
    - :291 `toBe` expected `'1'` _(literal)_
    - :294 `toBe` expected `true` _(expression)_
    - :295 `expect` expected _no expected value_ _(none)_
- `both tickets are consistent with the exchanges that minted them` — e2e/claims.spec.ts:298
    - :302 `toHaveCount` expected `2` _(literal)_
    - :311 `toBe` expected `'LAB.EXAMPLE'` _(literal)_
    - :312 `toBe` expected `'alice'` _(literal)_
    - :313 `toBe` expected `'18 (aes256-cts-hmac-sha1-96)'` _(literal)_
    - :314 `toBe` expected `'1'` _(literal)_
    - :316 `toMatch` expected `/^[0-9a-f]{32}… \(32 bytes\)$/` _(regex)_
    - :321 `expect` expected _no expected value_ _(none)_
    - :322 `toBe` expected `start` _(expression)_
    - :325 `expect` expected _no expected value_ _(none)_
    - :327 `expect` expected _no expected value_ _(none)_
    - :335 `toBe` expected `32` _(literal)_
    - :336 `expect` expected _no expected value_ _(none)_
    - :337 `toBe` expected `12` _(literal)_
    - :341 `toBe` expected `'krbtgt/LAB.EXAMPLE'` _(literal)_
    - :342 `toBe` expected `'http/web.lab.example'` _(literal)_
    - :347 `toBe` expected `toSecond(Number(await chip(page, 1, 'endtime')))` _(expression)_
    - :348 `toBe` expected `toSecond(Number(await chip(page, 3, 'endtime')))` _(expression)_
    - :352 `expect` expected _no expected value_ _(none)_
    - :353 `toBe` expected `tgt.get('session key')` _(expression)_
    - :357 `expect` expected _no expected value_ _(none)_
    - :358 `expect` expected _no expected value_ _(none)_
    - :359 `expect` expected _no expected value_ _(none)_
    - :360 `expect` expected _no expected value_ _(none)_
- `the replay button re-submits real bytes and is refused on the tuple it published` — e2e/claims.spec.ts:367
    - :373 `toBeVisible` expected _no expected value_ _(none)_
    - :379 `expect` expected _no expected value_ _(none)_
    - :380 `toBe` expected `1` _(literal)_
    - :387 `toBeVisible` expected `{ timeout: HEAVY }` _(expression)_
    - :390 `toHaveClass` expected `/(^|\s)bad(\s|$)/` _(regex)_
    - :391 `toHaveText` expected `'rejected: replay cache hit'` _(literal)_
    - :393 `expect` expected _no expected value_ _(none)_
    - :394 `expect` expected _no expected value_ _(none)_
    - :395 `expect` expected _no expected value_ _(none)_
    - :399 `toHaveText` expected `'rejected: replay cache hit'` _(literal)_
- `the skew badge and the AP verdict agree about the ±5 minute boundary` — e2e/claims.spec.ts:406
    - :413 `toBeVisible` expected _no expected value_ _(none)_
    - :425 `toHaveText` expected `'${offset > 0 ? '+' : ''}${offset} min'` _(expression)_
    - :429 `toHaveClass` expected `new RegExp('(^|\\s)${tolerated ? 'ok' : 'bad'}(\\s|$)')` _(expression)_
    - :430 `toHaveText` expected _no expected value_ _(none)_
    - :434 `toBeVisible` expected `{ timeout: HEAVY }` _(expression)_
    - :440 `expect` expected _no expected value_ _(none)_
    - :442 `expect` expected _no expected value_ _(none)_
    - :446 `toBeHidden` expected _no expected value_ _(none)_
- `every defense card’s glyph matches the live result printed under it` — e2e/claims.spec.ts:455
    - :470 `toHaveLength` expected `9` _(literal)_
    - :471 `toHaveText` expected `[` _(expression)_
    - :483 `toBe` expected `c.ok ? '✓' : '✗'` _(expression)_
    - :484 `toBe` expected `c.ok ? 'Defended' : 'Not defended'` _(expression)_
    - :485 `toBe` expected `c.ok ? 'Defended:' : 'Not defended:'` _(expression)_
    - :486 `expect` expected _no expected value_ _(none)_
    - :492 `toBe` expected `cards.length` _(expression)_
    - :493 `toHaveLength` expected `3` _(literal)_
    - :497 `expect` expected _no expected value_ _(none)_
    - :503 `toBe` expected `true` _(expression)_
    - :504 `toBe` expected `'fresh authenticator'` _(literal)_
    - :506 `toBe` expected `true` _(expression)_
    - :507 `toBe` expected `'replay cache hit'` _(literal)_
    - :510 `toBe` expected `'clock skew exceeded'` _(literal)_
    - :511 `toBe` expected `'ticket expired for client clock'` _(literal)_
    - :515 `toBe` expected `false` _(expression)_
    - :516 `toBe` expected `'ticket still valid for attacker use'` _(literal)_
    - :522 `toBe` expected `false` _(expression)_
    - :523 `toBe` expected `'AS-REP issued without PA-DATA, enc-part cracked offline after 3 guesses → "Summer2024!"'` _(literal)_
    - :528 `toBe` expected `true` _(expression)_
    - :529 `expect` expected _no expected value_ _(none)_
    - :533 `toBe` expected `false` _(expression)_
    - :534 `toBe` expected `'NS: Bob accepted forged run as Alice = true'` _(literal)_
    - :537 `toBe` expected `true` _(expression)_
    - :538 `expect` expected _no expected value_ _(none)_
    - :539 `expect` expected _no expected value_ _(none)_
    - :541 `toEqual` expected `[lowe.label, ptt.label, roast.label].sort()` _(expression)_
- `the threat panel and the flow report the same Lowe outcomes` — e2e/claims.spec.ts:544
    - :551 `expect` expected _no expected value_ _(none)_
    - :560 `expect` expected _no expected value_ _(none)_
- `the timeline drives the scenario select, and each era renders its own panels` — e2e/claims.spec.ts:567
    - :574 `toEqual` expected `['ns', 'lowe-attack', 'lowe-fix', 'kerberos']` _(expression)_
    - :578 `toHaveValue` expected `key` _(expression)_
    - :579 `toHaveClass` expected `new RegExp('scenario-${key}(\\s|$)')` _(expression)_
    - :580 `toBeVisible` expected `{ timeout: HEAVY }` _(expression)_
    - :585 `toBeVisible` expected `{ timeout: HEAVY }` _(expression)_
    - :586 `toBeHidden` expected _no expected value_ _(none)_
    - :592 `toContainText` expected `'What this demo is, and is not'` _(literal)_
    - :593 `toContainText` expected `'The cryptography below the protocol is real and vector-checked'` _(literal)_
    - :595 `toContainText` expected `'What this deliberately does NOT model'` _(literal)_
    - :596 `toContainText` expected `'ASN.1/DER'` _(literal)_
    - :597 `toContainText` expected `'One realm, no cross-realm'` _(literal)_
    - :598 `toContainText` expected `'No PAC'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-kerberos

## What It Is

Kerberos (RFC 4120) is a trusted-third-party authentication protocol descended from MIT's 1988 Athena project. This demo walks the 47-year arc: Needham-Schroeder (1978) -> the Lowe attack (1995) -> Kerberos v5 with AES-256-CTS-HMAC-SHA1 (RFC 3962). The security model assumes a trusted Key Distribution Center (KDC) and synchronized clocks across all principals.

## When to Use It

- Enterprise single sign-on with a central identity authority - what Active Directory and FreeIPA actually run on.
- Environments where every client can reach the KDC but not every service can reach every identity provider - the TGT caches authenticated sessions.
- Cross-realm trust with explicit delegation - a structured answer to the "one federation to rule them all" problem.
- Do NOT use Kerberos when clients can't sync to within 5 minutes of the KDC - skew failures are unforgiving.
- Do NOT use Kerberos-only for internet-scale authentication - token-based protocols (OIDC, OAuth) compose better with HTTP.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-kerberos](https://systemslibrarian.github.io/crypto-lab-kerberos/)**

Users can step through the original Needham-Schroeder flow, watch the Lowe attack succeed against it, then apply Lowe's fix and watch **the same relay re-run against the patched protocol** — Mallory is still on the wire, Bob still answers, and Alice aborts at message 2 on the identity mismatch. From there, run the full Kerberos v5 AS/TGS/AP flow with real AES-256-CTS-HMAC-SHA1 encrypted tickets, pre-authentication, and a replay button that re-submits the captured AP-REQ bytes verbatim. The clock can be skewed live to watch replay and expiration defenses fire.

The lab is built as a clickable historical timeline where each era exists because the previous one broke: attack found → one-line fix → redesign. Teaching aids layered on top for a first-time reader:

1. **Timeline + message flow** — pick an era (Needham-Schroeder 1978, Lowe attack 1995, Lowe fix, Kerberos v5) and watch its swimlane play out message by message.
2. **Lowe re-seal capsule** — when Mallory relays a message, an on-screen capsule shows the outer public-key envelope changing (`_pkM` → `_pkB`) while the sealed inner secret stays untouched, making "relay without decrypting" visible.
3. **Crypto-changed signpost** — an anchored banner fires the moment you enter the Kerberos scenario, naming the shift from per-party public keys to a trusted KDC with symmetric session keys.
4. **Three-exchange orientation card** — a "why three round-trips" primer (AS / TGS / AP) shown before the six-message flow, so the complexity is sequenced, not dumped.
5. **Grouped threat model** — the attack outcomes are grouped by the defense that stops them (replay / clock skew / ticket expiry / key theft / the pre-Kerberos flaw), each an expandable card with "what an attacker tries" vs "what stops them", and hoverable definitions for terms like Kerberoasting, pass-the-ticket, and AS-REP roasting.
6. **Self-teaching clock slider** — the ±5-minute tolerance is marked on the track with a live "within tolerance / SKEW" badge, so the skew defense is discoverable by dragging rather than only after a failure.
7. **In-app scope panel** — an on-screen statement of what the demo models faithfully, what it deliberately omits (ASN.1/DER, cross-realm, the PAC), and where exactness is compressed, so the limits are visible without reading the source.

Every outcome shown is computed live in the browser against the real cryptography; none of the teaching layer fakes a result. Concretely, that means:

- The **Lowe fix** scenario runs Mallory's relay against the fixed protocol and reports whether Alice aborted — it is not an attacker-free run relabelled as a defense.
- **Replay last AP-REQ** re-submits the captured authenticator ciphertext to the service, which decrypts it and verifies its HMAC-SHA1-96 before refusing it on freshness. It is not a cache lookup.
- The **ticket-expiry** card is fed a genuinely expired ticket, and **AS-REP roasting** is demonstrated by issuing an AS-REP for a pre-auth-disabled account and cracking its `enc-part` from a dictionary in the browser — every pass/fail glyph in the threat panel comes from a value one of these runs returned.
- **Pre-authentication** (PA-ENC-TIMESTAMP, key usage 1) is implemented and verified by the KDC, so the `pre-authent` ticket flag in the inspector is earned rather than decorative — and the roastable account is the exhibit for what happens without it.

## Scope and Limitations

The same statement is shown in the app itself, in the **What this demo is, and is not** panel.

- **The cryptography is real; the encoding is not.** aes256-cts-hmac-sha1-96, the RFC 3961 DK/DR derivation, PBKDF2 × 4096, and the RFC 4120 key usage numbers are implemented as specified. But ticket bodies, authenticators, and everything shown under "Raw bytes" are **JSON** that is then encrypted — RFC 4120 puts ASN.1/DER on the wire.
- **One realm.** No cross-realm referrals, no inter-realm krbtgt, no trust hierarchy.
- **No PAC.** The Active Directory authorization-data blob and its signatures are absent, so nothing here shows how Kerberos carries authorization rather than authentication.
- **Pre-authentication is PA-ENC-TIMESTAMP only.** No PKINIT, no FAST armoring, no hardware or OTP pre-auth types. The AS exchange is modelled on the KDC clock, so the clock slider demonstrates skew at the AP exchange; a real KDC would also reject a skewed AS-REQ with `KDC_ERR_PREAUTH_FAILED`.
- **No network, no ccache.** No port 88, no DNS SRV discovery, no on-disk credential cache — the `klist -e` inspector is a rendering. One etype (18), one kvno, no negotiation or key rotation.
- The 1978/1995 scenarios use **RSA-OAEP** because that is what the browser offers; Needham-Schroeder predates OAEP, and the relay property the attack turns on is unaffected by the padding.

## What Can Go Wrong

- **Clock skew** - if a client drifts beyond the KDC's tolerance (commonly around 5 minutes), authentication fails outright because timestamps anchor the replay and expiry defenses.
- **KDC compromise** - the KDC is a single point of trust; theft of the krbtgt key lets an attacker mint arbitrary tickets ("golden ticket") for any principal.
- **Replay without a working replay cache** - captured authenticators can be replayed within their lifetime if the service does not retain and check them.
- **Weak principal passwords** - service and account keys derived from weak passwords are exposed to offline cracking of pre-auth data and service tickets (Kerberoasting-style attacks).
- **Ticket theft** - possession of a ticket is sufficient to use it; stolen ticket material can be reused (pass-the-ticket) until it expires.

## Real-World Usage

- **Microsoft Active Directory** uses Kerberos v5 as its primary domain authentication protocol.
- **MIT Kerberos** and **Heimdal** are the reference open-source implementations.
- **FreeIPA / Red Hat IdM** builds enterprise identity management on a Kerberos KDC.
- **Hadoop, NFSv4, and other services** authenticate via Kerberos through GSSAPI/SPNEGO.
- **Standards** - RFC 4120 specifies Kerberos v5; RFC 3962 adds the AES-CTS-HMAC-SHA1 encryption types used here.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-kerberos
cd crypto-lab-kerberos
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-pki-chain](https://systemslibrarian.github.io/crypto-lab-pki-chain/) — X.509 certificate trust, the other pillar of enterprise authentication.
- [crypto-lab-webauthn](https://systemslibrarian.github.io/crypto-lab-webauthn/) — FIDO2 passkeys, the token-based path Kerberos does not cover.
- [crypto-lab-ssh-handshake](https://systemslibrarian.github.io/crypto-lab-ssh-handshake/) — host authentication and key exchange over SSH.
- [crypto-lab-opaque-gate](https://systemslibrarian.github.io/crypto-lab-opaque-gate/) — password-authenticated key exchange without a trusted KDC.
- [crypto-lab-web-of-trust](https://systemslibrarian.github.io/crypto-lab-web-of-trust/) — decentralized trust as a contrast to Kerberos's central authority.

## Why You Can Trust the Crypto

The cryptography is not a simulation, and it is not merely self-consistent — it
is validated against the **published RFC known-answer vectors**:

- **n-fold** — every vector in RFC 3961 §A.1 (`test/nfold.test.ts`).
- **string-to-key** (PBKDF2 → n-fold → DR/DK) — the RFC 3962 §B sample
  vectors, including the high-iteration, block-size-boundary, and non-ASCII
  (g-clef) cases (`test/string2key.test.ts`).
- **PBKDF2-HMAC-SHA1** — cross-checked against Node's OpenSSL-backed
  implementation, an entirely independent code path.
- **AES-256 block cipher** — the FIPS-197 known-answer vector (`test/cts.test.ts`).
- **AES-CBC-CTS** — all six [RFC 3962 Appendix B](https://www.rfc-editor.org/rfc/rfc3962.html#appendix-B)
  ciphertext vectors, checked independently for encryption and decryption,
  including the final-two-block swap for aligned 32-, 48-, and 64-byte inputs
  (`test/cts.test.ts`).
- **Protocol behaviour** — the Lowe attack succeeds against Needham-Schroeder
  and the *same relay* is blocked by the one-line fix (both directions are
  asserted, so the test fails if either regresses); a captured AP-REQ
  re-submitted byte-for-byte still decrypts and HMAC-verifies but is refused on
  freshness; pre-authentication gates the AS-REP and the `pre-authent` flag; and
  the Kerberos clock-skew / replay / expiry defenses each fire
  (`test/protocols.test.ts`).

The same RFC 3962 §B string-to-key vector also runs live in the browser on every
page load (the **Self-check** panel), so visitors can watch the in-browser
derivation reproduce the published key. CI (`.github/workflows/deploy.yml`) runs the
type-checker and the full suite on every push and pull request, and the Pages deploy
names that job in `needs:`, so a failure ships nothing.

You can run the same checks locally:

`​``bash
npm run check    # type-check + full test suite
`​``

## Landing Page Card

- Category: Authentication Protocols
- Chips: Kerberos (RFC 4120) · Needham-Schroeder · Lowe Attack · AES-CTS-HMAC-SHA1
- One-line description: "The 47-year arc from Needham-Schroeder 1978 through the Lowe attack 1995 to Kerberos v5 - real AES-256-CTS-HMAC-SHA1 tickets, replay cache, clock skew, and the protocol Active Directory still runs on."

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## MLS Group

- **slug**: `crypto-lab-mls-group`
- **repo**: https://github.com/systemslibrarian/crypto-lab-mls-group
- **live**: https://systemslibrarian.github.io/crypto-lab-mls-group/
- **commit_sha**: `4231be7ec70d96be911c3dcd16ad2ccd9ea57b93` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `c199bb8ab7d368235d878c88b0997c192346fa12`
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | KEY EXCHANGE  ·  **level**: advanced  ·  **--accent**: #4ec6b6
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: MLS Group  — _read from src/app.ts_

**Subtitle**: TreeKEM · Key Schedule · RFC 9420  — _read from src/app.ts_

**Description**: Add, remove, and update members in a live end-to-end encrypted group and watch TreeKEM re-key one root-to-leaf path while the epoch key schedule derives a fresh shared secret each epoch.  — _read from src/app.ts_

**Why it matters**: MLS secures group chats for billions of users at scale. Its tree keeps re-keying cheap at O(log n), so one leaked device is contained: past messages stay secret and future epochs heal after compromise.  — _read from src/app.ts_

**Card copy**: An RFC 9420-inspired teaching subset for TreeKEM, epoch keys, member changes, and group messages, plus a conceptual comparison of proposed PQ MLS suites. The live flow remains classical and omits signatures, authenticated framing, and confirmation tags; it does not provide full MLS security guarantees.

**Chips**: MLS Teaching Subset · TreeKEM · Epoch Key Schedule · Group Epochs

**Implements**: AES `src/crypto/hpke.ts:32`, AES-GCM `src/crypto/hpke.ts:32`, Diffie-Hellman `src/crypto/hpke.ts:48`, ECDSA `src/group/application-consistency.ts:42`, HKDF `src/crypto/hkdf.ts:11`, HPKE `src/crypto/hpke.ts:65`, MLS `src/app.ts:473`, P-256 `src/group/application-consistency.ts:42`, SHA-256 `src/crypto/ciphersuite.ts:36`, X25519 `src/crypto/hpke.ts:1`, X3DH `src/app.ts:471`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: DHKEM `src/crypto/hpke.ts:11`

**References**: ChaCha20, ChaCha20-Poly1305, DHKEM, Double Ratchet, EC point arithmetic, Ed25519, Kerberos, ML-DSA, ML-KEM, Noise protocol, Pairing, Poly1305, SHA-384

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `draft-ietf-mls-pq-ciphersuites-06` — first seen README.md:37 (4×)
- `RFC 9180` — first seen src/app.ts:172 (9×)
- `RFC 9420` — first seen README.md:5 (21×)
- `rfc9420` — first seen README.md:37 (2×)

**README — What Can Go Wrong**:

```text
- Untrusted delivery service: MLS relies on an external delivery service to order and fan out handshake messages; if it drops, reorders, or withholds commits, members can desynchronize epochs and fail to converge on the shared group secret.
- Unauthenticated KeyPackages: adding a member from a forged or stale KeyPackage can let an attacker join or be impersonated — KeyPackages must be signature-verified and checked for freshness.
- Missed commits and state loss: a member that fails to process a commit cannot derive the new epoch secret and is locked out until it replays the commit/welcome chain in order.
- Post-compromise security is not automatic: a leaked leaf key keeps decrypting group traffic until the affected member performs an Update commit, so healing depends on members actually rotating.
- Metadata exposure: MLS protects message content, but the delivery service still observes group membership, size, and message timing.
```

**Claims tested** (e2e/claims.spec.ts, 14 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:25
    - :25 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:45
    - :45 `toContainText` expected `'Epoch'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:61
    - :61 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:85
    - :85 `toHaveCount` expected `0` _(literal)_
- `progressive disclosure: the internals stay gated until revealed` — e2e/claims.spec.ts:90
    - :94 `toBe` expected `0` _(literal)_
    - :95 `toEqual` expected `['Alice', 'Bob', 'Charlie']` _(expression)_
    - :96 `toBe` expected `start.members.length` _(expression)_
    - :99 `toHaveCount` expected `GATED_PANELS.length` _(expression)_
    - :101 `expect` expected _no expected value_ _(none)_
    - :104 `toHaveCount` expected `0` _(literal)_
    - :109 `toHaveCount` expected `1` _(literal)_
    - :112 `toHaveCount` expected `0` _(literal)_
- `PQ MLS draft comparison distinguishes confidentiality from authentication without switching live crypto` — e2e/claims.spec.ts:115
    - :121 `toContainText` expected `'Conceptual comparison only'` _(literal)_
    - :122 `toContainText` expected `'Internet-Draft dated 21 July 2026'` _(literal)_
    - :123 `toContainText` expected `'This lab omits credential signatures'` _(literal)_
    - :124 `toContainText` expected `'MLS_128_DHKEMX25519_AES128GCM_SHA256_Ed25519'` _(literal)_
    - :127 `toContainText` expected `'MLS_128_MLKEM768X25519_AES128GCM_SHA256_Ed25519'` _(literal)_
    - :128 `toContainText` expected `'Classical only'` _(literal)_
    - :129 `toContainText` expected `'not full post-quantum security'` _(literal)_
    - :132 `toContainText` expected `'MLS_128_MLKEM768X25519_CHACHA20POLY1305_SHA384_MLDSA44'` _(literal)_
    - :133 `toContainText` expected `'ML-DSA-44 (post-quantum)'` _(literal)_
    - :134 `toContainText` expected `'Designed for post-quantum authentication'` _(literal)_
    - :135 `toHaveAttribute` expected `'href', /draft-ietf-mls-pq-ciphersuites-06/` _(expression)_
    - :137 `toEqual` expected `before` _(expression)_
    - :138 `toContainText` expected `'MLS_128_DHKEMX25519_AES128GCM_SHA256_Ed25519'` _(literal)_
- `lifecycle: add, update and remove each advance the epoch the narration claims` — e2e/claims.spec.ts:141
    - :149 `toHaveText` expected `'Members (${before.count + 1})'` _(expression)_
    - :152 `toBe` expected `before.epoch + 1` _(expression)_
    - :153 `toEqual` expected `[...before.members, 'Dave']` _(expression)_
    - :156 `expect` expected _no expected value_ _(none)_
    - :158 `expect` expected _no expected value_ _(none)_
    - :159 `toBe` expected `'6'` _(literal)_
    - :164 `toHaveText` expected `String(before.epoch + 1)` _(expression)_
    - :166 `toEqual` expected `before.members` _(expression)_
    - :169 `expect` expected _no expected value_ _(none)_
    - :170 `expect` expected _no expected value_ _(none)_
    - :175 `expect` expected _no expected value_ _(none)_
    - :179 `expect` expected _no expected value_ _(none)_
    - :180 `toMatch` expected `/COMMIT/` _(regex)_
    - :185 `toHaveText` expected `'Members (${before.count - 1})'` _(expression)_
    - :187 `toBe` expected `before.epoch + 1` _(expression)_
    - :188 `toEqual` expected `before.members.filter((name) => name !== 'Bob')` _(expression)_
    - :191 `expect` expected _no expected value_ _(none)_
    - :192 `expect` expected _no expected value_ _(none)_
    - :193 `expect` expected _no expected value_ _(none)_
    - :196 `toHaveCount` expected `0` _(literal)_
    - :198 `toHaveCount` expected `1` _(literal)_
- `convergence: every member derives one root secret, and it is this epoch commit_secret` — e2e/claims.spec.ts:202
    - :210 `toHaveText` expected `'1'` _(literal)_
    - :217 `toContainText` expected `'independently derived the same root secret'` _(literal)_
    - :221 `toHaveCount` expected `state.count` _(expression)_
    - :227 `expect` expected _no expected value_ _(none)_
    - :229 `toBe` expected `true` _(expression)_
    - :231 `toBe` expected `'✓ yes'` _(literal)_
    - :234 `toBe` expected `1` _(literal)_
    - :238 `expect` expected _no expected value_ _(none)_
    - :239 `expect` expected _no expected value_ _(none)_
    - :240 `expect` expected _no expected value_ _(none)_
    - :241 `expect` expected _no expected value_ _(none)_
    - :242 `expect` expected _no expected value_ _(none)_
    - :246 `toBe` expected `shared` _(expression)_
- `forward secrecy: after the epoch advances the captured key cannot be re-derived` — e2e/claims.spec.ts:249
    - :257 `toContainText` expected `'captured in epoch'` _(literal)_
    - :265 `toBe` expected `(await banner(page)).epoch` _(expression)_
    - :268 `toContainText` expected `'same derivation, now in epoch'` _(literal)_
    - :271 `toBe` expected `capturedEpoch + 1` _(expression)_
    - :275 `toBe` expected `now.epoch` _(expression)_
    - :277 `toBe` expected `capturedKey` _(expression)_
    - :278 `expect` expected _no expected value_ _(none)_
    - :279 `expect` expected _no expected value_ _(none)_
    - :281 `expect` expected _no expected value_ _(none)_
    - :285 `toContainText` expected `'captured in epoch'` _(literal)_
    - :286 `toHaveCount` expected `1` _(literal)_
- `post-compromise security: the exposed secret is still live until the Update, then is not` — e2e/claims.spec.ts:289
    - :296 `toContainText` expected `'no compromise recorded'` _(literal)_
    - :299 `toContainText` expected `'EXPOSED TO ATTACKER'` _(literal)_
    - :306 `toBe` expected `pre` _(expression)_
    - :307 `expect` expected _no expected value_ _(none)_
    - :308 `expect` expected _no expected value_ _(none)_
    - :312 `toHaveText` expected `String(before.epoch + 1)` _(expression)_
    - :313 `toContainText` expected `'Attacker locked out'` _(literal)_
    - :316 `toBe` expected `pre` _(expression)_
    - :318 `toBe` expected `pre` _(expression)_
    - :319 `expect` expected _no expected value_ _(none)_
    - :320 `expect` expected _no expected value_ _(none)_
    - :324 `expect` expected _no expected value_ _(none)_
    - :325 `expect` expected _no expected value_ _(none)_
    - :326 `expect` expected _no expected value_ _(none)_
- `access control: only a current member can open a message sent after the removal` — e2e/claims.spec.ts:329
    - :337 `toContainText` expected `'No one has been removed yet'` _(literal)_
    - :338 `expect` expected _no expected value_ _(none)_
    - :343 `toContainText` expected `'Bob'` _(literal)_
    - :345 `expect` expected _no expected value_ _(none)_
    - :348 `toContainText` expected `'[ciphertext]'` _(literal)_
    - :352 `toBe` expected `state.epoch` _(expression)_
    - :353 `expect` expected _no expected value_ _(none)_
    - :357 `expect` expected _no expected value_ _(none)_
    - :358 `toBe` expected `'Meet at the safe house at 21:00.'` _(literal)_
    - :361 `expect` expected _no expected value_ _(none)_
    - :362 `expect` expected _no expected value_ _(none)_
- `send: the transcript records the epoch, generation and ciphertext size of the real message` — e2e/claims.spec.ts:367
    - :375 `toContainText` expected `'APPLICATION'` _(literal)_
    - :380 `toBe` expected `state.epoch` _(expression)_
    - :381 `toBe` expected `1` _(literal)_
    - :382 `toBe` expected `'Alice'` _(literal)_
    - :383 `toBe` expected `'0'` _(literal)_
    - :384 `expect` expected _no expected value_ _(none)_
    - :388 `toHaveLength` expected `32` _(literal)_
    - :390 `toBe` expected `message.length + 16` _(expression)_
    - :395 `toContainText` expected `'second'` _(literal)_
    - :397 `toBe` expected `state.epoch` _(expression)_
    - :399 `expect` expected _no expected value_ _(none)_
- `tree inspector: selecting a leaf names exactly the nodes that member can derive` — e2e/claims.spec.ts:404
    - :411 `toContainText` expected `'Alice · leaf 0'` _(literal)_
    - :417 `expect` expected _no expected value_ _(none)_
    - :418 `expect` expected _no expected value_ _(none)_
    - :419 `toMatch` expected `/HPKE public key: [0-9a-f]{16}…/` _(regex)_
    - :423 `toBe` expected `0` _(literal)_
    - :424 `toHaveCount` expected `1` _(literal)_
    - :429 `toContainText` expected `'Alice · leaf 0'` _(literal)_
    - :433 `toContainText` expected `'node ${derivable[0]}'` _(expression)_
- `guided tour: the nine steps run the whole lifecycle and leave everything revealed` — e2e/claims.spec.ts:436
    - :454 `toHaveCount` expected `1` _(literal)_
    - :460 `toHaveText` expected _no expected value_ _(none)_
    - :463 `toHaveText` expected `titles[step]!` _(expression)_
    - :468 `toHaveText` expected `titles[step + 1]!` _(expression)_
    - :471 `expect` expected _no expected value_ _(none)_
    - :478 `toHaveCount` expected `0` _(literal)_
    - :479 `toHaveCount` expected `0` _(literal)_
    - :482 `toBe` expected `4` _(literal)_
    - :483 `toEqual` expected `['Alice', 'Bob', 'Charlie']` _(expression)_
    - :486 `toContainText` expected _no expected value_ _(none)_
    - :489 `toContainText` expected `'locked out ✓'` _(literal)_
    - :490 `toContainText` expected `'Attacker locked out ✓'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-mls-group

## What It Is

This project is a browser-first teaching subset of Messaging Layer Security (MLS) and TreeKEM mechanics from RFC 9420. It uses real TreeKEM, X25519, HKDF, and AES-GCM operations, but it is not a complete RFC 9420 implementation: Ed25519 credential signatures, authenticated handshake framing, and confirmation-tag construction/verification are omitted, so commits and application messages in the model are unsigned. The model focuses on large groups where pairwise approaches become expensive.

## When to Use It

- Use it for team chat systems with larger memberships where updates must scale beyond pairwise session fanout.
- Use it for enterprise or community messaging with frequent add, remove, and update operations.
- Use it when asynchronous group delivery is needed and members may be offline during commits.
- Use it when Double Ratchet pairwise meshes become operationally heavy in large channels.
- Do not use MLS for strictly 1:1 conversations where Double Ratchet is lighter and simpler.
- Do not use MLS without a delivery service capable of reliable asynchronous fan-out.
- Do NOT treat this as production code — it is a teaching demo that visualizes the MLS/TreeKEM flow, not a hardened messaging stack.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-mls-group](https://systemslibrarian.github.io/crypto-lab-mls-group/)**

In the live demo, members have names (Alice, Bob, Charlie, …) mapped to their leaf indices, so the ratchet tree stays readable as you add and remove people. Every action is narrated in plain English ("what just happened") alongside the full protocol transcript, and a status banner always shows the current epoch and membership. **Progressive disclosure:** on first load you meet just the tree, the member controls, and the narration — the proof and internals panels stay behind labeled teasers and unlock as the guided tour reaches each concept (or all at once via **Show all panels**). New here? Click **Start guided tour** for a step-by-step walk through the whole group lifecycle. You can:

- Take the **guided tour**: add → send → update → converge → remove → locked-out → heal, each step running real commits and revealing the panel it explains.
- Add/remove members and watch the ratchet tree re-key, with the committer's direct path animating up the tree, small "sealed packet" icons flying to each copath leaf (the encrypt-to-copath step), and the epoch number rolling over.
- **Click any tree node to inspect it**: a member leaf highlights exactly the keys that person can derive (their direct path) and dims the subtrees they are blind to; a parent node shows which members share it ("Derivable by: Alice, Bob") and its HPKE public key.
- See the **TreeKEM Convergence** proof: every member independently derives the *same* root secret (the committer by ratcheting, the rest by HPKE-decrypting one path secret) — and the demo shows that shared secret **is** the live epoch's `commit_secret`, matching the Key Schedule panel's `commit_secret` chip byte-for-byte.
- Send application messages encrypted with real per-message AES-128-GCM keys from each sender's ratchet.
- Read the key schedule as a derivation diagram (init_secret + commit_secret → joiner → epoch → per-epoch secrets) with live byte values, the two secrets this demo actually uses shown up front and the other seven grouped (with one-word purposes) behind a disclosure.
- Step through a **Forward Secrecy** walkthrough: capture a message key, advance the epoch, and see the same derivation produce a different key — the old one is gone.
- Step through a **Post-Compromise Security** walkthrough: mark a member compromised, then have them commit an Update to lock the attacker out.
- Watch **Access Control** in action: the group sends a real message and a removed member fails to decrypt it while a current member succeeds.
- Run one-click scenario presets (add, remove, PCS recovery, churn drill), each performing real cryptographic commits.
- Open the optional **Post-Quantum MLS Draft** panel. Select the classical suite modeled here, a proposed ML-KEM-768 + X25519 suite with Ed25519 signatures, or a proposed hybrid suite with ML-DSA-44 signatures. The panel separately labels the intended confidentiality and authentication properties. Its selection is an explanation only: the live group still uses classical X25519, HKDF-SHA256, and AES-128-GCM, and this lab omits even the classical signature layer.

### Post-quantum MLS context

[RFC 9420 §17.1](https://www.rfc-editor.org/rfc/rfc9420#section-17.1) includes the classical `MLS_128_DHKEMX25519_AES128GCM_SHA256_Ed25519` ciphersuite. The IETF MLS working group's [*ML-KEM and Hybrid Cipher Suites for Messaging Layer Security*, draft-06 §§3.1, 4](https://datatracker.ietf.org/doc/html/draft-ietf-mls-pq-ciphersuites-06#section-3.1), published **21 July 2026**, proposes additional suites. Its first eight proposed suites use a post-quantum or hybrid KEM with a classical signature, targeting post-quantum confidentiality while leaving authentication classical. Its final three use ML-DSA signatures as well. It remains an **Internet-Draft, not a final RFC**. The comparison is a reading exercise, not a PQ MLS implementation, interoperability test, performance measurement, or a claim that this unsigned teaching model inherits RFC 9420's complete security properties.

## What Can Go Wrong

- Untrusted delivery service: MLS relies on an external delivery service to order and fan out handshake messages; if it drops, reorders, or withholds commits, members can desynchronize epochs and fail to converge on the shared group secret.
- Unauthenticated KeyPackages: adding a member from a forged or stale KeyPackage can let an attacker join or be impersonated — KeyPackages must be signature-verified and checked for freshness.
- Missed commits and state loss: a member that fails to process a commit cannot derive the new epoch secret and is locked out until it replays the commit/welcome chain in order.
- Post-compromise security is not automatic: a leaked leaf key keeps decrypting group traffic until the affected member performs an Update commit, so healing depends on members actually rotating.
- Metadata exposure: MLS protects message content, but the delivery service still observes group membership, size, and message timing.

## Real-World Usage

- RFC 9420: MLS is the IETF standard for scalable end-to-end encrypted group messaging, defining TreeKEM, the epoch key schedule, and the handshake message formats.
- IETF MIMI working group: MLS is the basis for the More Instant Messaging Interoperability effort aimed at cross-provider encrypted messaging.
- OpenMLS: an open-source Rust implementation of RFC 9420 used in research and product integrations.
- mlspp: Cisco's C++ MLS implementation, developed alongside the standard and used in conferencing/messaging work.
- Messaging platforms: the protocol was designed with large-group E2EE deployment in mind and has been adopted/evaluated by messaging vendors moving beyond pairwise Double Ratchet.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-mls-group
cd crypto-lab-mls-group
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-ratchet-wire](https://systemslibrarian.github.io/crypto-lab-ratchet-wire/) — the pairwise Double Ratchet that MLS scales past for groups.
- [crypto-lab-x3dh-wire](https://systemslibrarian.github.io/crypto-lab-x3dh-wire/) — X3DH asynchronous key agreement from the Signal stack.
- [crypto-lab-noise-pipe](https://systemslibrarian.github.io/crypto-lab-noise-pipe/) — Noise handshake patterns for authenticated secure channels.
- [crypto-lab-hybrid-wire](https://systemslibrarian.github.io/crypto-lab-hybrid-wire/) — hybrid X25519 + ML-KEM key exchange for transport.
- [crypto-lab-kerberos](https://systemslibrarian.github.io/crypto-lab-kerberos/) — a classic ticket-based key distribution protocol.

## Testing

Run the test suite (TreeKEM convergence, tree arithmetic, key schedule, forward secrecy, and removed-member lockout) with:

`​``bash
npm test
npm run test:a11y   # browser gate (Playwright): on-screen claims + WCAG A/AA
`​``

`e2e/claims.spec.ts` drives the real page and checks every headline against the
page's own numbers: each narration's "epoch A → B" against the status banner,
the convergence table against the Key Schedule panel's `commit_secret` chip, the
forward-secrecy verdict against the two message keys it printed, PCS healing
against the exposed and the current epoch secret, and the removed member's
lockout against the plaintext a current member read from that same ciphertext.
The nine-step guided tour is walked end to end, asserting that exactly the four
committing steps advance the epoch.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Research review extension 31 October 2026

R20261031-03: Application histories are retained per recipient. A separate AES-GCM/ECDSA teaching transport contrasts authentic malicious-member poll equivocation with honest edit reconciliation, missing/altered edit sets and malformed ciphertext. Key equality never establishes application consistency. The main unsigned MLS teaching model and its TreeKEM convergence behavior are preserved.

```

</details>

---

## WebAuthn

- **slug**: `crypto-lab-webauthn`
- **repo**: https://github.com/systemslibrarian/crypto-lab-webauthn
- **live**: https://systemslibrarian.github.io/crypto-lab-webauthn/
- **commit_sha**: `4204f2d63b3ddb38837cdf7a32f3d36a266cfa1a` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `a7e21138d26498c034c460d57ab045162034e92e`
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | KEY EXCHANGE  ·  **level**: beginner  ·  **--accent**: #b58cff
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: WebAuthn  — _read from src/ui.ts_

**Subtitle**: Readable simulator first · real browser API below  — _read from src/ui.ts_

**Description**: Start with an inspectable WebAuthn security-logic simulation using real ECDSA P-256 signatures but simplified JSON encoding, then fire phishing, replay, and clone attacks and watch the relevant relying-party check reject each one. The real navigator.credentials ceremony is a separate section below.  — _read from src/ui.ts_

**Why it matters**: Passwords are shared secrets a fake login page can capture and replay. A passkey signs the origin the browser actually saw, so a credential stolen on a phishing site is worthless anywhere else — killing the most common account-takeover attack.  — _read from src/ui.ts_

**Card copy**: Passwordless authentication via FIDO2 / WebAuthn — assertion verification, origin binding, signature counters, and the journey from passwords to passkeys.

**Chips**: WebAuthn · FIDO2 · Passkeys · Assertion

**Implements**: ECDSA `src/engine.ts:17`, P-256 `src/engine.ts:17`, SHA-256 `src/engine.ts:46`, WebAuthn `src/live.ts:310`

**Attacks shown**: _none derived_

**References**: Ed25519, Kerberos

**Standards body**: NIST, W3C

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 180-4` — first seen README.md:52 (1×)

**README — What Can Go Wrong**:

```text
- Skipping the origin or RP ID check defeats phishing resistance — a look-alike origin must be rejected, which is the whole point of WebAuthn.
- Failing to validate a fresh, server-issued challenge allows a captured assertion to be replayed.
- Ignoring the signature counter misses cloned-authenticator detection.
- Trusting client-supplied values (origin, challenge) instead of comparing them against server-side expectations breaks the entire model.
- Hand-rolling CBOR/COSE and attestation parsing is error-prone; production verifiers should use vetted libraries (this demo deliberately models only the security logic, not the wire format).
```

**Claims tested** (e2e/claims.spec.ts, 2 test(s)):

- `the hero distinguishes the simulator from the real browser ceremony below` — e2e/claims.spec.ts:3
    - :7 `toHaveText` expected _no expected value_ _(none)_
    - :10 `toContainText` expected _no expected value_ _(none)_
    - :13 `toContainText` expected _no expected value_ _(none)_
    - :16 `toContainText` expected `'Run a real WebAuthn ceremony'` _(literal)_
    - :18 `toContainText` expected `'Everything above uses a simulated authenticator'` _(literal)_
    - :19 `toContainText` expected `'calls the actual browser WebAuthn API'` _(literal)_
- `clone signs its stale counter and preserves authenticated policy at width ${width}` — e2e/claims.spec.ts:23
    - :27 `toContainText` expected `'Stored credential'` _(literal)_
    - :29 `toHaveText` expected `'Authenticated'` _(literal)_
    - :33 `toHaveText` expected `'Rejected'` _(literal)_
    - :34 `toHaveCount` expected `1` _(literal)_
    - :35 `toHaveCount` expected `1` _(literal)_
    - :36 `toHaveText` expected `'Counter increasing'` _(literal)_
    - :37 `toHaveText` expected _no expected value_ _(none)_
    - :41 `toHaveText` expected `/^[0-9a-f]{64}\|5\|1$/` _(regex)_
    - :42 `toBeVisible` expected _no expected value_ _(none)_
    - :43 `toContainText` expected `'not extraction of a hardware passkey'` _(literal)_
    - :45 `toBe` expected `false` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-webauthn

## What It Is

A faithful model of the WebAuthn / FIDO2 passkey ceremony using **real ECDSA P-256 signatures** via the browser's Web Crypto API. A simulated authenticator generates a credential keypair bound to a relying party (RP), keeps the private key inside itself, and produces signed assertions on demand. A simulated server registers the public credential and verifies each assertion against five contextual checks: a fresh challenge, the origin the browser actually saw, the RP ID hash, the ECDSA signature itself, and a monotonic counter for clone detection. The same engine then drives four attacks — a phishing site, a replayed assertion, a wrong-relying-party request, and a cloned authenticator — so you can watch the specific check each attack trips on. This is **not** the full CBOR/COSE/attestation wire format; it models the *security-relevant logic* of WebAuthn — the parts you'd review in a relying-party verifier — without the byte-level encoding work that production libraries already do.

## When to Use It

- **Teaching how passkeys actually log you in** — show the registration vs. authentication ceremonies without hand-waving over the math, because the page is doing real ECDSA P-256.
- **Explaining *why* WebAuthn is phishing-resistant** — the "Phishing site" control signs with a look-alike origin and watches the server's Origin check reject it. That's the whole anti-phishing property, made visible.
- **Auditing or building a relying-party verifier** — the five checks (challenge, origin, RP ID hash, signature, counter) are the same five your verifier has to run; here they are with passing/failing detail per row.
- **Comparing passwords vs. passkeys in front of a non-cryptographer audience** — there is a shared-secret table you can point at, plus a working demo of "no secret on the server".
- **Reference: in production, use these** — the platform `navigator.credentials.create` / `.get` APIs and a vetted server library (SimpleWebAuthn, py_webauthn, webauthn4j, fido2-net-lib). Use real attestation when you need it. This page is for learning.
- **Do NOT use this demo's JSON authData / clientData encoding for anything** — it stands in for CBOR-encoded WebAuthn structures so the security logic is readable. The cryptography is real; the encoding is not.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-webauthn](https://systemslibrarian.github.io/crypto-lab-webauthn/)**

The page is built around a single register-then-authenticate flow followed by four attacks. **Create passkey** generates a fresh ECDSA P-256 keypair on the simulated authenticator and registers the public half with the simulated server. **Authenticate** issues a new challenge, signs `(challenge ‖ origin ‖ rpIdHash ‖ flags ‖ counter)`, and prints every server-side check with a pass/fail badge plus the verifier context (expectedChallenge, expectedOrigin, expectedRpId). The **Break it** controls re-run the ceremony four ways: **Phishing site** signs with `https://examp1e-login.com` while the server still expects `https://example.com` — the Origin check fails. **Replay** captures a valid assertion, verifies it once successfully, then verifies the same assertion against a fresh challenge — the Challenge check fails. **Wrong relying party** asks the authenticator for an assertion for `evil.com` — the authenticator itself refuses, and the server never sees a signature. **Cloned authenticator** uses an assumed copy of the simulator credential with a stale local counter; that copy genuinely signs its own count for a fresh challenge, and the Counter check fails. This assumes possession of the same private credential, not hardware key extraction. A copy without previous accepted counter history, or one with an increasing counter, cannot be identified from the counter alone. A reset baseline button always restores a clean authentication so you can try the next attack.

Below the simulator, **Try it with a real passkey** calls the actual `navigator.credentials.create` / `.get`. It decodes the CBOR `attestationObject`, parses the binary `authData`, converts the COSE EC2 key to a JWK, converts the ASN.1 DER signature to raw `r‖s`, and then re-runs the same relying-party checks the simulator teaches — ceremony type, challenge, origin, RP ID hash, credential ID, ECDSA signature, and the UP flag — printing each one with its own pass/fail. The verdict badge is the AND of those checks, not the signature alone. Two boundaries are stated in the panel rather than papered over: the demo requests `attestation: 'none'`, so the AAGUID comes back zeroed and no authenticator model can be identified or trusted; and where an authenticator always reports `signCount = 0` (permitted by the spec, and typical of synced passkeys) the counter row says clone detection *cannot run* rather than reporting a pass. Token-binding, extension-output, and attestation-trust validation from WebAuthn §7.2 are not performed, and the panel says so.

## What Can Go Wrong

- Skipping the origin or RP ID check defeats phishing resistance — a look-alike origin must be rejected, which is the whole point of WebAuthn.
- Failing to validate a fresh, server-issued challenge allows a captured assertion to be replayed.
- Ignoring the signature counter misses cloned-authenticator detection.
- Trusting client-supplied values (origin, challenge) instead of comparing them against server-side expectations breaks the entire model.
- Hand-rolling CBOR/COSE and attestation parsing is error-prone; production verifiers should use vetted libraries (this demo deliberately models only the security logic, not the wire format).

## Real-World Usage

- Passkeys and FIDO2/WebAuthn power passwordless, phishing-resistant login across major browsers and platforms (Apple, Google, Microsoft).
- Hardware security keys (such as YubiKeys) use the same ceremony as a second factor in enterprise and consumer accounts.
- Relying-party web apps implement these checks via libraries like SimpleWebAuthn, py_webauthn, webauthn4j, and fido2-net-lib.
- "No shared secret on the server" reduces the blast radius of a database breach compared with stored passwords.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-webauthn
cd crypto-lab-webauthn
npm install
npm run dev
`​``

## Tests

The security-critical engine has a fast, isolated unit suite (`test/engine.test.ts`, run with `npm test` via Vitest) that asserts the pure ceremony logic directly — no browser required:

- **Known-answer tests**: a NIST CAVP FIPS 180-4 SHA-256 byte vector routed through the ceremony's production hash helper, the SHA-256 RP-ID digest, and a frozen ECDSA P-256 verification vector, so a change in the underlying primitives is caught immediately.
- **Happy path**: register → authenticate → verify passes all five checks, the stored credential carries only a public JWK (no private scalar `d`), and the counter increases per assertion.
- **The four attacks**: phishing trips Origin, replay trips Challenge, a wrong-RP request is refused by the authenticator, and a clone trips Counter — each on exactly the right check.
- **Signed-data binding**: the simulator parses the readable `rpIdHash|flags|signCount` encoding once, requires a canonical hash/flags byte/uint32 count, and drives RP, counter, UP/UV policy and accepted state from those signed fields. Inconsistent unsigned display duplicates are explicitly rejected; they never override the authenticated values. A genuinely signed stale count fails the counter policy while retaining a valid signature. Changing signed bytes breaks the signature, while changing only duplicate metadata fails consistency. Malformed but genuinely signed encodings remain invalid assertions.
- **Forgery rejection**: a flipped signature bit, a forged origin, and a substituted public key all fail signature verification; strict counter monotonicity rejects equal counts.
- **UP/UV policy** and **discoverable-credential** lookup gates.

A second suite (`test/live.test.ts`) covers the real-WebAuthn path in `src/live.ts` without needing an authenticator attached, by constructing the wire bytes directly: `authData` is built to the §6.1 layout and parsed back, asserting the rpIdHash, the big-endian `signCount`, each flag bit position (UP=0, UV=2, BE=3, BS=4, AT=6, ED=7), and that the AAGUID is read out of *attested credential data* rather than an attestation statement; the DER→raw conversion is asserted to left-pad short integers and strip DER's high-bit sign byte; COSE→JWK is asserted to refuse a non-EC2 key rather than emit a bogus one; and each relying-party check is falsified one at a time — a stale challenge, a look-alike origin, and a `webauthn.create` response replayed as a login each trip *exactly* the corresponding row and leave the others passing.

The live suite also calls the actual `getLiveAssertion()` orchestrator through a controlled credential-provider stub with genuinely signed ECDSA wire bytes. Rejected challenge/origin/type/RP-hash/credential-ID/signature/UP or malformed-client-data checks leave the stored counter unchanged, so a rejected high count cannot poison a later valid assertion. Equal/decreasing counts stay rejected, all-zero unsupported counters remain explicitly unavailable for clone detection, and truncated/cancelled/null responses preserve state. Counter persistence happens only after complete acceptance, following [WebAuthn assertion verification state-update ordering](https://www.w3.org/TR/webauthn-3/#sctn-verifying-assertion). These are reproducible fixtures, not hardware/passkey-ceremony or attestation-trust verification.

The build (`npm run build`), a WCAG A/AA accessibility gate (`npm run test:a11y`, axe-core, configured dark desktop/380px states), and a real-browser end-to-end walkthrough (`npm run test:e2e`) round out the checks.

## Related Demos

- [crypto-lab-ssh-handshake](https://systemslibrarian.github.io/crypto-lab-ssh-handshake/) — public-key authentication with Ed25519 and trust-on-first-use.
- [crypto-lab-opaque-gate](https://systemslibrarian.github.io/crypto-lab-opaque-gate/) — password-authenticated key exchange that also keeps no server-side secret.
- [crypto-lab-kerberos](https://systemslibrarian.github.io/crypto-lab-kerberos/) — a deployed authentication protocol and the attacks against it.
- [crypto-lab-pki-chain](https://systemslibrarian.github.io/crypto-lab-pki-chain/) — X.509 certificates and the trust chain behind web identity.
- [crypto-lab-ecdsa-forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) — the ECDSA P-256 signatures that WebAuthn assertions rely on.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## WebAuthn Level 3 backup-state consistency

The real-response path checks the allowed BE/BS combinations during registration and assertion verification, following the [25 August 2026 W3C Recommendation](https://www.w3.org/TR/2026/REC-webauthn-3-20260825/) (§7.1 step 17, §7.2 step 18). BE=0/BS=1 is rejected even when the assertion’s ECDSA signature verifies. Rejected responses do not replace an accepted credential or advance its counter/backup state. BE=1 permits legitimate BS transitions; this demo does not apply a backup-based business policy or infer an assurance level from these flags. It remains a teaching verifier without attestation validation.

```

</details>

---

## Blind Hello

- **slug**: `crypto-lab-blind-hello`
- **repo**: https://github.com/systemslibrarian/crypto-lab-blind-hello
- **live**: https://systemslibrarian.github.io/crypto-lab-blind-hello/
- **commit_sha**: `45be8e2a918b1d40ce2ba11c834816c8faf0128c` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `5f480eb3b6fd639c747b4b76bfa17a2373823bd3`
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | PRIVACY  ·  **level**: beginner  ·  **--accent**: #4338CA
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Blind Hello  — _read from index.html_

**Subtitle**: TLS Encrypted Client Hello · RFC 8744 · draft-ietf-tls-esni  — _read from index.html_

**Description**: Builds real TLS 1.3 ClientHellos, seals the inner one with real HPKE, and puts both on a modeled wire so you can watch exactly which bytes a network observer reads — with and without ECH.  — _read from index.html_

**Why it matters**: TLS 1.3 encrypts your traffic — then announces who you're talking to, in cleartext, in the first packet. That one field is what ISPs log and censors filter on. ECH closes the last window, which is exactly why several networks fight it.  — _read from index.html_

**Card copy**: TLS 1.3 encrypts everything except the hostname it announces first — seal the ClientHello with real HPKE and see exactly what ECH hides, what it can't, and why it needs encrypted DNS.

**Chips**: TLS 1.3 · ECH · HPKE · SNI

**Implements**: DHKEM `src/ech/hub.ts:22`, Encrypted Client Hello `src/ech/ech.ts:44`, HPKE `src/ech/ech.ts:196`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: AES `src/ech/hub.ts:4`, ChaCha20 `src/ech/clienthello.ts:24`, ChaCha20-Poly1305 `src/ech/clienthello.ts:24`, HKDF `src/ech/hub.ts:3`, Poly1305 `src/ech/clienthello.ts:24`, SHA-256 `src/ech/clienthello.ts:24`, SHA-384 `src/ech/clienthello.ts:24`, TLS 1.3 `src/ech/clienthello.ts:2`, X25519 `src/ech/ech.ts:151`

**References**: AES, ChaCha20, ChaCha20-Poly1305, HKDF, Poly1305, SHA-256, TLS 1.3, X25519

**Standards body**: IETF

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `RFC 6066` — first seen src/ech/clienthello.ts:43 (1×)
- `RFC 7301` — first seen src/ech/clienthello.ts:51 (1×)
- `RFC 7858` — first seen src/ui/deployment.ts:46 (1×)
- `RFC 8484` — first seen src/ui/deployment.ts:46 (1×)
- `RFC 8744` — first seen README.md:7 (2×)
- `RFC 9180` — first seen README.md:7 (9×)
- `RFC 9460` — first seen README.md:19 (6×)
- `RFC 9846` — first seen README.md:7 (3×)
- `RFC 9849` — first seen README.md:7 (8×)
- `rfc9849` — first seen README.md:7 (8×)

**README — What Can Go Wrong**:

```text
- **Plaintext DNS next to ECH** — the lookup for the ECH key announces the name ECH exists to hide. The protection is spent before TLS starts.
- **Stale ECHConfig** — DNS caches outlive key rotations; RFC 9849 describes trial decryption plus authenticated retry_configs. This lab models the authentication step; it does not implement the outer TLS handshake.
- **Tampered ECHConfig** — sealing to a corrupted key is a denial of ECH, not a disclosure: the decryption fails closed and the name stays inside the ciphertext.
- **Networks that block ECH** — dropping traffic can deny availability. After ECH rejection, [RFC 9849 §6.1.6](https://www.rfc-editor.org/rfc/rfc9849.html#section-6.1.6) requires public-name authentication of the outer handshake; authentication or handshake failure must fail and must not be treated as a secure signal to disable ECH. After successful authentication and handshake completion, the rejected connection is aborted before application data. Supported retry_configs guide a new ECH attempt. If no retry config has a supported version, the server omits the ECH extension in EncryptedExtensions, or an earlier TLS version was negotiated, the authenticated result can securely disable ECH and guide a new connection without it.
- **Unauthenticated DNS configuration** — an attacker can strip or substitute ECH configurations before an ECH attempt ([§10.2](https://www.rfc-editor.org/rfc/rfc9849.html#section-10.2)); this differs from dropping an attempted ECH connection.
- **Enterprise policy** — managed clients may disable ECH under implementation-specific policy ([§8.2](https://www.rfc-editor.org/rfc/rfc9849.html#section-8.2)). This is protocol guidance, not a browser-product fallback test.
- **A dedicated IP** — ECH hides *which* site behind a shared provider; an IP hosting one site identifies itself.
- **A substituted config** — ECH's privacy is only as trustworthy as the channel that delivered the ECHConfig. An attacker who can forge that channel (plaintext DNS) hands the client their own key and reads the destination with valid cryptography. Exhibit 5 runs this live.
```

**Claims tested** (e2e/claims.spec.ts, 5 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:17
    - :17 `toBeVisible` expected _no expected value_ _(none)_
- `the observer verdict names the destination it was actually computed for` — e2e/claims.spec.ts:20
    - :31 `toContainText` expected `chosen, { timeout: 30_000 }` _(expression)_
- `changing the destination retires an observer verdict computed for the old one` — e2e/claims.spec.ts:34
    - :41 `toContainText` expected `first, { timeout: 30_000 }` _(expression)_
    - :46 `expect` expected _no expected value_ _(none)_
    - :51 `toContainText` expected `/retired/i, { timeout: 10_000 }` _(expression)_
    - :56 `toBeVisible` expected _no expected value_ _(none)_
- `a destination that has not changed does not retire a fresh verdict` — e2e/claims.spec.ts:59
    - :67 `toContainText` expected `current, { timeout: 30_000 }` _(expression)_
    - :71 `toContainText` expected `/retired/i` _(regex)_
- `rotating the server key retires the substitution result it invalidates` — e2e/claims.spec.ts:74
    - :82 `toContainText` expected `/honest server/i, { timeout: 30_000 }` _(expression)_
    - :93 `toContainText` expected `/retired/i, { timeout: 10_000 }` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Blind Hello — TLS Encrypted Client Hello (ECH)

**The ClientHello SNI field encrypted under HPKE — showing that TLS protected everything except the one field that says who you're talking to.**

## What It Is

TLS 1.3 (RFC 9846) encrypts the server's certificate and every byte after the handshake — and then announces the destination hostname in cleartext, in the SNI field of the very first packet. Encrypted Client Hello ([RFC 9849, March 2026](https://www.rfc-editor.org/rfc/rfc9849.html); problem statement in RFC 8744) is HPKE (RFC 9180) applied to that one field: the client builds a second, secret ClientHello naming the real destination, seals it to the server's published key, and ships it inside a decoy ClientHello that names only the provider's public hostname.

The lesson: a protocol can be cryptographically flawless and still leak the metadata that actually matters. Both indicators are rendered separately throughout this demo — "the crypto is valid" and "your hostname leaked" are shown side by side, because both are true at once.

This lab is the first consumer of the fleet's HPKE hub: every seal and open runs the implementation from [crypto-lab-hpke-envelope](https://github.com/systemslibrarian/crypto-lab-hpke-envelope), imported as source and KAT-verified from this repo's own test suite. Nothing cryptographic is reimplemented here.

**Not production crypto — a teaching demo.** No packets leave the page; the wire and the DNS transaction are labelled models around real cryptographic operations.

## Exhibits

1. **The observer panel** (the headline): pick a destination, put two genuinely-built ClientHellos on the wire — plain and ECH — and watch the **same** observer parse both in stepped reveal (bytes → what it read → verdict), so you see the one field diverge. Without ECH the hostname is literally legible in the hex dump's ASCII column; with ECH the observer gets the decoy name and an opaque HPKE payload. The observer also honestly reports what ECH does **not** hide: destination IP, ALPN, ECH's own presence, config_id, payload length. (The reveal collapses to instant under `prefers-reduced-motion`.)
2. **Inner and outer**: step through the construction — inner ClientHello, the emptied-and-padded `EncodedClientHelloInner`, the HPKE seal with `info = "tls ech" ‖ 0x00 ‖ ECHConfig`, and the outer-with-zeroed-payload that is the AAD. The splice step is **computed, not asserted**: it diffs the AAD against the final wire byte-for-byte and shows every differing byte falls inside the payload slot (zero outside). Then run the swap attack: rewrite the outer around the stolen ciphertext and watch the real AEAD open fail.
3. **The bootstrap problem** (the honest centerpiece): the ECH key arrives via the DNS HTTPS record (real RFC 9460 RDATA encoding shown). Run the lookup over plaintext DNS and the observer reads your destination before TLS ever starts; switch to encrypted DNS (modeled, labelled) to close the leak. The circularity is named in-page: ECH requires DoH/DoT to mean anything.
4. **Break it yourself**: flip one bit of the ECHConfig public key, or use a stale key after the server rotates — the server's real HPKE decryption fails, fail-closed, and the retry_configs recovery path completes a successful second attempt.
5. **Whose key did you encrypt to?**: the config-authenticity attack. An active attacker substitutes their own ECHConfig (same public name, same config_id, their key); the client seals to it and **the attacker really decrypts and reads your destination** — valid cryptography, wrong recipient, rendered as ALARM not success. A delivery-channel table then shows why plaintext DNS is forgeable but retry_configs (inside the public name's certificate-authenticated TLS) is not.
6. **GREASE**: a client with no ECHConfig sends a fake ECH extension; a field-for-field comparison (computed from the parsed bytes, not asserted) shows the observer has no bit to select on. If only ECH users sent ECH, ECH would be a selector.
7. **Deployment honesty**: RFC 9849 status, deployment examples, blocking versus authenticated retry/disablement and enterprise policy, and precisely what this demo does and does not prove.

## When to Use It

- To understand why "TLS is encrypted" and "your ISP knows every site you visit" were both true for two decades.
- To see the AAD-binding pattern — authenticate the envelope, encrypt the letter — in a deployed protocol.
- To understand why encrypted DNS and ECH only work as a pair.
- **Do NOT use it** as an ECH implementation, to assess your own network's ECH behavior, or as evidence that ECH defeats active adversaries or traffic analysis — it demonstrates a passive observer of the first packet, nothing more.

## Live Demo

<https://systemslibrarian.github.io/crypto-lab-blind-hello/> — pick a destination, send both ClientHellos, read the wire like an observer, break the config, and compare a GREASE client against the real thing.

## What Can Go Wrong

- **Plaintext DNS next to ECH** — the lookup for the ECH key announces the name ECH exists to hide. The protection is spent before TLS starts.
- **Stale ECHConfig** — DNS caches outlive key rotations; RFC 9849 describes trial decryption plus authenticated retry_configs. This lab models the authentication step; it does not implement the outer TLS handshake.
- **Tampered ECHConfig** — sealing to a corrupted key is a denial of ECH, not a disclosure: the decryption fails closed and the name stays inside the ciphertext.
- **Networks that block ECH** — dropping traffic can deny availability. After ECH rejection, [RFC 9849 §6.1.6](https://www.rfc-editor.org/rfc/rfc9849.html#section-6.1.6) requires public-name authentication of the outer handshake; authentication or handshake failure must fail and must not be treated as a secure signal to disable ECH. After successful authentication and handshake completion, the rejected connection is aborted before application data. Supported retry_configs guide a new ECH attempt. If no retry config has a supported version, the server omits the ECH extension in EncryptedExtensions, or an earlier TLS version was negotiated, the authenticated result can securely disable ECH and guide a new connection without it.
- **Unauthenticated DNS configuration** — an attacker can strip or substitute ECH configurations before an ECH attempt ([§10.2](https://www.rfc-editor.org/rfc/rfc9849.html#section-10.2)); this differs from dropping an attempted ECH connection.
- **Enterprise policy** — managed clients may disable ECH under implementation-specific policy ([§8.2](https://www.rfc-editor.org/rfc/rfc9849.html#section-8.2)). This is protocol guidance, not a browser-product fallback test.
- **A dedicated IP** — ECH hides *which* site behind a shared provider; an IP hosting one site identifies itself.
- **A substituted config** — ECH's privacy is only as trustworthy as the channel that delivered the ECHConfig. An attacker who can forge that channel (plaintext DNS) hands the client their own key and reads the destination with valid cryptography. Exhibit 5 runs this live.

## Real-World Usage

Cloudflare enables ECH across free zones; Firefox 118+ supports it when DoH is on; Chrome 117+ rolled it out alongside its secure-DNS support. China's national firewall has blocked ESNI/ECH-bearing TLS since 2020, and Russian authorities have moved to restrict hostname-hiding TLS extensions — ECH's deployment story is inseparable from the interests of the networks it blinds.

## How to Run Locally

This lab **consumes the HPKE hub as a sibling checkout** — clone both repos side by side:

`​``
git clone https://github.com/systemslibrarian/crypto-lab-hpke-envelope
git clone https://github.com/systemslibrarian/crypto-lab-blind-hello
cd crypto-lab-hpke-envelope && npm ci && cd ..
cd crypto-lab-blind-hello && npm ci
npm run dev        # serve
npm test           # unit tests + KATs (48)
npm run build      # typecheck + production build
npm run test:a11y  # WCAG 2.1 AA gate, 2 themes x 2 viewports (requires: npx playwright install chromium)
`​``

## Related Demos

- [crypto-lab-hpke-envelope](https://systemslibrarian.github.io/crypto-lab-hpke-envelope/) — the HPKE implementation this lab imports, with every internal stage exposed.
- [crypto-lab-tls-handshake](https://systemslibrarian.github.io/crypto-lab-tls-handshake/) / [crypto-lab-pq-tls-handshake](https://systemslibrarian.github.io/crypto-lab-pq-tls-handshake/) — the handshake that follows the ClientHello.
- [crypto-lab-blind-relay](https://systemslibrarian.github.io/crypto-lab-blind-relay/) — OHTTP: hiding metadata from the server rather than the network.
- [crypto-lab-downgrade-wire](https://systemslibrarian.github.io/crypto-lab-downgrade-wire/) — what "the client retries without the protection" costs, as a genre.

## Build & Verify

- **48 unit tests** (Vitest), all passing, including **known-answer tests from RFC 9180 Appendix A run through the consumed hub**: the two Base-mode vectors this lab's suite uses — A.1.1 (DHKEM(X25519, HKDF-SHA256), HKDF-SHA256, AES-128-GCM) and A.2.1 (ChaCha20-Poly1305) — covering key derivation, encapsulation/decapsulation, the full key schedule, all 10 vector encryptions with nonce sequencing, and all 6 exporter values. The ECH layer has no external ECH known-answer vectors in this suite; the ECH layer is verified by round-trip against the real HPKE, strict-parser fail-closed tests, AAD-binding/tamper tests, padding-equalization tests, and GREASE indistinguishability checks — and this README says so rather than inventing vectors.
- **Accessibility gate**: the production build is driven the way a visitor drives it — both ClientHellos observed, the destination changed so stale verdicts retire, the outer swapped, the lookup run over plaintext DNS and then DoH, the config tampered and recovered, the server key rotated, the substituted-config attack run, GREASE compared — and **scanned after every single step**, in both themes at 1280px and 380px. Nothing is injected into the page: reduced motion is asked for and asserted, so the lab's own `prefers-reduced-motion` block is exercised rather than bypassed. `violations` is not the whole oracle — the gate also fails on axe's `incomplete` bucket, on an arithmetic composite-aware contrast measurement (opacity and `color-mix()` included), on any scrolling region with no keyboard route, on any horizontal document overflow, and on any visible text left at `opacity: 0`. The Pages deploy is blocked on failure.
- **Deploy**: GitHub Actions checks out this repo and the hub side by side, runs typecheck → tests → build → a11y gate → Pages.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Key Mirror

- **slug**: `crypto-lab-key-mirror`
- **repo**: https://github.com/systemslibrarian/crypto-lab-key-mirror
- **live**: https://systemslibrarian.github.io/crypto-lab-key-mirror/
- **commit_sha**: `71c9568f2a148af3c8e53940c85027a68a8ecdde` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `fa3a9f0a49f60f3deb8fe221327d49e00a7ad8fc`
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | HASHING & KDFS  ·  **level**: intermediate  ·  **--accent**: #0F766E
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Key Mirror  — _read from index.html_

**Subtitle**: Key Transparency · append-only authenticated map · IETF KEYTRANS  — _read from index.html_

**Description**: Runs a real key directory that lies — it hands Alice a substituted key for Bob while showing Carol the truth — then builds the Merkle log, consistency proofs, and gossip that turn the lie into evidence.  — _read from index.html_

**Why it matters**: Every end-to-end-encrypted app fetches your contact's public key from a server you must trust. If that server equivocates, perfect encryption delivers your words straight to an attacker. Key transparency is how deployed messengers make that lie detectable — and provable.  — _read from index.html_

**Card copy**: A key directory that lies to one user and tells the truth to another — then the append-only Merkle log, consistency proofs, and gossip that make the lie detectable.

**Chips**: Merkle Tree · VRF · Ed25519 · KEYTRANS

**Implements**: AES `src/e2ee/box.ts:63`, AES-GCM `src/e2ee/box.ts:63`, Diffie-Hellman `src/e2ee/box.ts:30`, Ed25519 `src/directory/client.ts:35`, HKDF `src/e2ee/box.ts:40`, Merkle tree `src/merkle/tree.ts:38`, SHA-256 `src/core/sha256.ts:3`, SHA-512 `src/vrf/ecvrf.ts:27`, X25519 `src/e2ee/box.ts:31`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Argon2 `src/merkle/ct-fixture.ts:6`, ECDH `src/e2ee/box.ts:2`, ECDSA `src/merkle/ct-fixture.ts:19`

**References**: Argon2, ECDH, Hash-to-curve, MLS, X3DH

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 180-4` — first seen README.md:79 (1×)
- `RFC 5869` — first seen src/e2ee/box.ts:3 (1×)
- `RFC 6962` — first seen README.md:13 (18×)
- `RFC 7748` — first seen README.md:16 (3×)
- `RFC 8032` — first seen src/vrf/ecvrf.ts:25 (3×)
- `RFC 9162` — first seen README.md:13 (6×)
- `RFC 9381` — first seen README.md:15 (15×)
- `RFC8032` — first seen src/vrf/ecvrf.ts:70 (3×)

**README — What Can Go Wrong**:

```text
- **Equivocation below the gossip layer is undetectable by design** — that is the lab's thesis, demonstrated with passing proofs, not asserted.
- **Gossip only detects lies between compared views**: if Alice never compares heads with anyone, her fork lives on. Coverage, not cleverness, is the guarantee.
- **Detection is retroactive.** Messages sent to the substituted key before detection are compromised, permanently.
- **Monitoring requires participation**: a key planted under Bob's name is only found if Bob (or his devices, or a delegated monitor) actually audits.
- **Trust on first use remains**: a client's first accepted tree head anchors everything after it.
```

**Claims tested** (e2e/claims.spec.ts, 22 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:28
    - :28 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:36
    - :36 `toHaveCount` expected `opts.malicious ? 1 : 0` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:39
    - :39 `toHaveCount` expected `opts.malicious ? 7 : 5` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:45
    - :45 `toBeDisabled` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:46
    - :46 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:53
    - :53 `expect` expected _no expected value_ _(none)_
- `exhibit 1 — honest directory: one ledger, one key, CONSISTENT verdict` — e2e/claims.spec.ts:59
    - :61 `toHaveText` expected `'Key Mirror'` _(literal)_
    - :65 `toHaveCount` expected `1` _(literal)_
    - :66 `toHaveText` expected `'The directory’s ledger (one for everyone)'` _(literal)_
    - :67 `toHaveCount` expected `0` _(literal)_
    - :70 `toBe` expected `await keyFromLog(page, 'Carol’s view')` _(expression)_
    - :72 `toContainText` expected _no expected value_ _(none)_
    - :75 `toContainText` expected `'INTERCEPTED'` _(literal)_
- `exhibit 1 — malicious directory: two ledgers, two roots, two answers, INTERCEPTED verdict` — e2e/claims.spec.ts:78
    - :85 `toHaveCount` expected `2` _(literal)_
    - :87 `toHaveLength` expected `2` _(literal)_
    - :88 `toBe` expected `roots[1]` _(expression)_
    - :93 `toHaveCount` expected `1` _(literal)_
    - :94 `toContainText` expected `'Mallory’s key'` _(literal)_
    - :99 `toBe` expected `lieKey` _(expression)_
    - :100 `toBe` expected `carolKey` _(expression)_
    - :106 `toBe` expected `honestBobKey` _(expression)_
    - :108 `toContainText` expected _no expected value_ _(none)_
    - :112 `toContainText` expected _no expected value_ _(none)_
    - :116 `toContainText` expected _no expected value_ _(none)_
- `exhibit 1 — crypto counters are internally consistent (${malicious ? 'malicious' : 'honest'})` — e2e/claims.spec.ts:122
    - :131 `expect` expected _no expected value_ _(none)_
    - :137 `toBe` expected `validLines` _(expression)_
    - :142 `toBe` expected `malicious ? 3 : 2` _(expression)_
    - :143 `toBe` expected `seals + tags` _(expression)_
- `exhibit 1 — bit-flip in transit is caught by the tag (${malicious ? 'malicious' : 'honest'})` — e2e/claims.spec.ts:148
    - :157 `expect` expected _no expected value_ _(none)_
    - :161 `toBe` expected `1` _(literal)_
    - :162 `expect` expected _no expected value_ _(none)_
    - :164 `toBe` expected `malicious ? 'Mallory' : 'Bob'` _(expression)_
    - :165 `expect` expected _no expected value_ _(none)_
    - :168 `toContainText` expected _no expected value_ _(none)_
    - :171 `toContainText` expected `'INTERCEPTED, UNDETECTED'` _(literal)_
    - :174 `toContainText` expected `'decryption REJECTED'` _(literal)_
    - :175 `toBeVisible` expected _no expected value_ _(none)_
    - :185 `expect` expected _no expected value_ _(none)_
    - :192 `toBe` expected `real.length` _(expression)_
    - :193 `toBe` expected `ok.length` _(expression)_
- `exhibit 2 — layers 0-3: every crypto check passes and the lie survives all of them` — e2e/claims.spec.ts:197
    - :204 `toContainText` expected _no expected value_ _(none)_
    - :210 `toBe` expected `total` _(expression)_
    - :212 `toBe` expected `[0, 1, 3, 4][layer] * 2` _(expression)_
    - :216 `expect` expected _no expected value_ _(none)_
- `exhibit 2 — layer 4 gossip proves equivocation from two validly signed heads` — e2e/claims.spec.ts:220
    - :228 `toHaveLength` expected `2` _(literal)_
    - :230 `expect` expected _no expected value_ _(none)_
    - :233 `toBe` expected `epochs[1]` _(expression)_
    - :235 `expect` expected _no expected value_ _(none)_
    - :237 `toContainText` expected _no expected value_ _(none)_
    - :240 `toContainText` expected _no expected value_ _(none)_
    - :245 `toBe` expected `total` _(expression)_
- `exhibit 2 — honest directory: no equivocation at any layer` — e2e/claims.spec.ts:248
    - :255 `toContainText` expected `'Roots match — one history, no equivocation this epoch'` _(literal)_
    - :257 `toContainText` expected `'CONSISTENT — both users got the same key'` _(literal)_
    - :259 `toContainText` expected `'LIE UNDETECTED'` _(literal)_
    - :262 `toBe` expected `0` _(literal)_
- `exhibit 2 — an anchored client sees consistency PASS across the fork` — e2e/claims.spec.ts:266
    - :272 `toContainText` expected `'Alice: size'` _(literal)_
    - :278 `toContainText` expected `'Consistency PASSED across the fork — and still missed the lie'` _(literal)_
    - :279 `expect` expected _no expected value_ _(none)_
    - :283 `toBe` expected `total` _(expression)_
    - :284 `toContainText` expected `'LIE UNDETECTED at layer 3'` _(literal)_
- `exhibit 3 — honest append reconstructs both roots byte-for-byte` — e2e/claims.spec.ts:289
    - :292 `toBeEnabled` expected _no expected value_ _(none)_
    - :297 `toHaveCount` expected `nodes` _(expression)_
    - :299 `toContainText` expected `'APPEND PROVEN — the new tree contains the old tree unchanged'` _(literal)_
    - :300 `toBeVisible` expected _no expected value_ _(none)_
    - :301 `toBeVisible` expected _no expected value_ _(none)_
    - :303 `toBe` expected `0` _(literal)_
    - :304 `toBe` expected `0` _(literal)_
- `exhibit 3 — forked history fails closed, and says which root did not match` — e2e/claims.spec.ts:307
    - :310 `toBeEnabled` expected _no expected value_ _(none)_
    - :314 `toHaveCount` expected `nodes` _(expression)_
    - :316 `toContainText` expected `'FORK EXPOSED — no consistency proof can connect two histories'` _(literal)_
    - :317 `toBeVisible` expected _no expected value_ _(none)_
    - :319 `toContainText` expected _no expected value_ _(none)_
    - :323 `expect` expected _no expected value_ _(none)_
- `exhibit 3 — stepping one row at a time reaches the same verdict` — e2e/claims.spec.ts:326
    - :329 `toBeEnabled` expected _no expected value_ _(none)_
    - :331 `expect` expected _no expected value_ _(none)_
    - :333 `toBeDisabled` expected _no expected value_ _(none)_
    - :334 `toContainText` expected `'APPEND PROVEN'` _(literal)_
- `exhibit 4 — the tree slot the page shows is the one its own beta implies` — e2e/claims.spec.ts:339
    - :349 `toMatch` expected `/^[0-9a-f]{128}$/` _(regex)_
    - :350 `toMatch` expected `/^[0-9a-f]{160}$/` _(regex)_
    - :355 `toBe` expected `expected` _(expression)_
    - :357 `toContainText` expected `'valid'` _(literal)_
    - :358 `toContainText` expected `'INVALID'` _(literal)_
- `exhibit 4 — the observer list counts and sorts what it claims` — e2e/claims.spec.ts:361
    - :365 `toBe` expected `baseline` _(expression)_
    - :371 `toBe` expected `baseline + 1` _(expression)_
    - :373 `toHaveLength` expected `after` _(expression)_
    - :376 `toHaveCount` expected `1` _(literal)_
    - :377 `toContainText` expected `'the label you just derived'` _(literal)_
    - :381 `toEqual` expected `[...labels].sort()` _(expression)_
    - :386 `toBe` expected `baseline` _(expression)_
- `exhibit 4 — one flipped bit in the proof is rejected` — e2e/claims.spec.ts:389
    - :391 `toBeDisabled` expected _no expected value_ _(none)_
    - :393 `toBeEnabled` expected _no expected value_ _(none)_
    - :396 `toContainText` expected _no expected value_ _(none)_
    - :399 `toContainText` expected _no expected value_ _(none)_
    - :402 `toBeVisible` expected _no expected value_ _(none)_
- `exhibit 5 — honest log: Bob’s audit is CLEAN and every entry proves inclusion` — e2e/claims.spec.ts:407
    - :414 `toHaveCount` expected `claimed` _(expression)_
    - :415 `toHaveCount` expected `0` _(literal)_
    - :418 `toHaveLength` expected `claimed` _(expression)_
    - :419 `expect` expected _no expected value_ _(none)_
    - :421 `toContainText` expected `'CLEAN — every key in Bob’s history is one Bob registered'` _(literal)_
- `exhibit 5 — malicious log: the planted key is found, with its inclusion proof` — e2e/claims.spec.ts:424
    - :431 `toHaveCount` expected `claimed` _(expression)_
    - :435 `expect` expected _no expected value_ _(none)_
    - :438 `expect` expected _no expected value_ _(none)_
    - :439 `toBe` expected `planted` _(expression)_
    - :441 `toBe` expected `await panel.locator('.checklist li:not(.check-fail)').count()` _(expression)_
    - :443 `toContainText` expected `'I NEVER generated this key'` _(literal)_
    - :445 `toContainText` expected `'verifies ✓'` _(literal)_
    - :446 `toContainText` expected _no expected value_ _(none)_
    - :449 `toContainText` expected `'Detection, not prevention'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Key Mirror

**Key Transparency · append-only authenticated map · IETF KEYTRANS**

A key directory that can lie to one user and tell the truth to another, and the append-only Merkle structure plus gossip that makes the lie detectable.

## What It Is

Every end-to-end-encrypted system has a server that hands out public keys. The encryption (here: X25519 ECDH → HKDF-SHA-256 → AES-256-GCM) answers *"can anyone else read this?"* — it cannot answer *"whose key did I encrypt to?"* If the server **equivocates** — shows Alice a substituted key for Bob while showing Carol the real one — the encryption is perfect and the security is zero.

This demo runs that attack first, against real crypto, then rebuilds the defense one layer at a time:

- **RFC 6962 Merkle tree** (hand-rolled, inspectable): leaf/node hashing, audit paths, consistency proofs, and the independent RFC 9162 verifiers — pinned to the canonical Certificate Transparency reference-tree vectors.
- **ed25519 signed tree heads and signed bindings** (@noble/curves).
- **ECVRF-EDWARDS25519-SHA512-TAI** (RFC 9381, hand-rolled over @noble/curves point arithmetic) for label privacy — pinned to all three Appendix B.3 vectors.
- **X25519 + HKDF + AES-GCM** sealed box (RFC 7748 KAT) as the E2EE layer the attack rides on.

Security model: the **directory server is the adversary**. Clients verify everything a client can verify alone (signatures, inclusion, consistency); detection of equivocation additionally requires comparing notes across users (gossip) and self-monitoring. Transparency is **detection, not prevention** — the demo says so in-page, because the attacker really does read the messages sent before detection.

**Not production crypto — a teaching demo.** Key material is generated per page load and lives only in memory; nothing leaves the browser.

## Exhibits

1. **The lie** — flip the directory to malicious and step through Alice's lookup, her AES-GCM-sealed message landing on Mallory's key, the re-encrypted forward Bob never questions, and Carol getting the truth. Cryptographic results and the security verdict are rendered separately: every tag verifies *and* the verdict is alarm.
2. **The defense, layer by layer** — run the same attack at layers 0–4: bare trust, signed responses, inclusion proofs, consistency proofs, gossip. Layers 0–3 pass every genuine check while the lie stands; layer 4 produces two validly signed heads for the same epoch with different roots — transferable proof of equivocation.
3. **Consistency proofs, byte by byte** — step the real RFC 9162 verifier through an honest append (proof verifies) and a forked history (reconstruction mismatches, shown per-byte).
4. **Label privacy** — real ECVRF maps username → tree slot: verifiable to the user holding the proof, opaque to observers; flip one bit of the proof and the verifier rejects.
5. **Monitoring** — Bob audits his own published history and finds the planted key, inclusion proof attached: the attacker had to leave a receipt.

## When to Use It

- Teaching why E2EE messengers (WhatsApp key transparency, iMessage Contact Key Verification, Signal's planned KT) need a transparency layer at all.
- Explaining the difference between *authentication* (layer 1), *membership* (layer 2), *append-only history* (layer 3), and *global consistency* (layer 4) — and why each one alone is insufficient.
- Showing what CONIKS/Parakeet/KEYTRANS-lineage systems actually detect, and what they don't.
- **Do NOT use it** as a key-transparency implementation, as a KEYTRANS wire-format reference, or as evidence that any specific deployed system is secure. The Merkle log here is a flat binding log, not KEYTRANS's VRF-addressed prefix tree.

## Live Demo

<https://systemslibrarian.github.io/crypto-lab-key-mirror/> — flip the malicious toggle, run the interception, climb the defense ladder, step the failing fork proof, derive and tamper with a VRF label, and audit Bob's history.

## What Can Go Wrong

- **Equivocation below the gossip layer is undetectable by design** — that is the lab's thesis, demonstrated with passing proofs, not asserted.
- **Gossip only detects lies between compared views**: if Alice never compares heads with anyone, her fork lives on. Coverage, not cleverness, is the guarantee.
- **Detection is retroactive.** Messages sent to the substituted key before detection are compromised, permanently.
- **Monitoring requires participation**: a key planted under Bob's name is only found if Bob (or his devices, or a delegated monitor) actually audits.
- **Trust on first use remains**: a client's first accepted tree head anchors everything after it.

## Real-World Usage

- **WhatsApp** ships key transparency built on its auditable key directory (Parakeet lineage).
- **Apple iMessage** Contact Key Verification has devices automatically cross-check the key directory.
- **IETF KEYTRANS WG** is standardizing the authenticated-map construction this demo teaches the trust story of.
- **Certificate Transparency** (RFC 6962/9162) is the same machinery pointed at X.509 certificates — CT logs certificates for domain names, KT logs public keys for user identities.

## How to Run Locally

`​``bash
npm install
npm run dev        # local dev server
npm test           # 61 unit tests incl. spec KATs and input-boundary controls
npm run build      # typecheck + production build
npm run test:a11y  # axe WCAG 2.1 A/AA gate, dark desktop/380px (needs: npx playwright install chromium)
`​``

Requires Node 20.19+; CI uses Node 22.

## Related Demos

- [vrf-gate](https://systemslibrarian.github.io/crypto-lab-vrf-gate/) — the full ECVRF construction this lab links to for depth
- [merkle-proofs](https://systemslibrarian.github.io/crypto-lab-merkle-proofs/) / [merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) / [pki-chain](https://systemslibrarian.github.io/crypto-lab-pki-chain/) — Merkle trees and Certificate Transparency
- [x3dh-wire](https://systemslibrarian.github.io/crypto-lab-x3dh-wire/) / [ratchet-wire](https://systemslibrarian.github.io/crypto-lab-ratchet-wire/) / [mls-group](https://systemslibrarian.github.io/crypto-lab-mls-group/) — the messaging protocols whose key directories KT audits

## Build & Verify

- **Vitest regression coverage**, including:
  - RFC 6962 Merkle KATs — the CT reference tree: empty-tree hash, all 8 incremental roots, 5 audit-path vectors, 4 consistency-proof vectors (`src/merkle/kat.test.ts`);
  - RFC 9381 Appendix B.3 ECVRF KATs — Examples 16–18 in full (pi, beta, H, and the try-and-increment counter), prove and verify (`src/vrf/ecvrf.test.ts`);
  - RFC 7748 §6.1 X25519 KAT and FIPS 180-4 SHA-256 KATs;
  - strict noncanonical Edwards encoding and exact subgroup-order boundaries, malformed/low-order X25519 rejection and unchanged seed bytes; actual directory signatures independently verified with native WebCrypto, including changed-message and cross-domain rejection;
  - fail-closed rejection tests for every verifier, an attack test proving layers 0–3 pass while views diverge, gossip detection, and monitor findings;
  - the UI stepper's traced verifier pinned to the real verifier (`src/merkle/trace.test.ts`).
  - a historical Google CT inclusion proof at tree size 2,807,499,968 (pinned root, not a fresh service/signature check), independent recursive BigInt proof controls through `Number.MAX_SAFE_INTEGER`, large consistency proofs, and malformed/unsafe input rejection (`src/merkle/large-proofs.test.ts`).

The reusable Number-based inclusion and consistency APIs, and the traced verifier, accept only safe integer sizes and indices (up to `Number.MAX_SAFE_INTEGER`, 2^53−1). Larger RFC uint64 sizes require a different BigInt API; they are rejected here rather than rounded or truncated. Hashes must be 32 bytes and proof containers must be readable arrays, including rejection of sparse or malformed entries.
- **Accessibility gate**: `@axe-core/playwright` scans the production build in the configured **dark** theme at desktop and 380px, with every exhibit driven to its richest (alarm) state; zero WCAG 2.1 A/AA violations required, enforced in CI before deploy.

## Performance

In-page proofs are over toy-sized logs (≤ 33 leaves); the offline verifier regression suite also covers large counters without allocating billions of leaves. ECVRF proving is a few curve multiplications; these tests do not measure production-scale log throughput.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## SPDZ Forge

- **slug**: `crypto-lab-spdz-forge`
- **repo**: https://github.com/systemslibrarian/crypto-lab-spdz-forge
- **live**: https://systemslibrarian.github.io/crypto-lab-spdz-forge/
- **commit_sha**: `f7c017f1c86f26ab63e14f0e179bbcc79df6ce57` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: #b45309
- **MISSING FIELDS**: claims, verification

**Name (H1)**: SPDZ Forge  — _read from index.html_

**Subtitle**: Malicious-secure arithmetic MPC · Beaver triples · MACs  — _read from index.html_

**Description**: Three parties multiply secret-shared numbers they cannot see — and when you, playing one of them, lie about your share, the arithmetic itself catches it.  — _read from index.html_

**Why it matters**: Hospitals, banks, and ad platforms already run joint computations on data none of them will show the others. Semi-honest MPC only computes correctly if everyone behaves; malicious-secure MPC tells you when they didn't — the difference between a statistic you can publish and one a single liar silently poisoned.  — _read from index.html_

**Card copy**: Run authenticated sharing, Beaver multiplication, and tamper checks. Explore a bounded Off-Key selective-failure fixture and a separate synthetic Z₁₇ trace showing why a delayed check can expose a dependent hash before abort.

**Chips**: SPDZ · Beaver Triples · SPDZ MACs · Dishonest Majority · Selective Failure

**Implements**: SHA-256 `src/spdz/cavp-sha256-vectors.ts:37`

**Attacks shown**: Selective failure `src/ui/panels/offkey.ts:128`

**References**: Garbled circuits, Oblivious transfer, One-time pad, Shamir secret sharing

**Standards body**: NIST

**Implementation**: local TypeScript BigInt field arithmetic / WebCrypto SHA-256 commitments

**Spec citations, exactly as written**:

- `10.1007/3-540-46766-1_34` — first seen README.md:86 (2×)
- `CRYPTO 1991` — first seen README.md:86 (1×)
- `CRYPTO 2012` — first seen README.md:85 (1×)
- `ePrint 2026/2533` — first seen README.md:48 (2×)
- `eprint.iacr.org/2011/535` — first seen README.md:85 (2×)
- `eprint.iacr.org/2016/505` — first seen README.md:87 (2×)
- `eprint.iacr.org/2017/1230` — first seen README.md:88 (2×)
- `eprint.iacr.org/2026/2533` — first seen README.md:48 (4×)
- `EUROCRYPT 2018` — first seen README.md:88 (1×)
- `EUROCRYPT 2026` — first seen README.md:21 (3×)

**README — What Can Go Wrong**:

```text
- **Triple reuse** — the "d leaks nothing" argument requires a to be uniform *and single-use*; the break-it panel shows the wire leaking x − x′ the moment that's violated.
- **Skipping the MAC check** — the semi-honest column is exactly SPDZ without it: a single bad share silently corrupts the output for everyone.
- **Trusting the dealer** — in this demo the dealer is honest by fiat; a malicious dealer could deal c ≠ a·b or leak α. Real SPDZ replaces the dealer with heavy cryptography (SHE + ZK proofs, or OT à la MASCOT).
- **Mixing authentication contexts** — a check can still detect incorrect arithmetic while its success/failure leaks a private predicate. Preserve the preprocessing protocol's key-binding state across every batch, thread and restart whose material may be combined; plaintext key shares alone do not provide that binding.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records** (1 file(s)):

- `scripts/mutations.mjs` (4641 bytes)

<details><summary>Full README</summary>

```markdown
# SPDZ Forge

**Malicious-secure arithmetic MPC · Beaver triples · MACs**

Three parties multiply secret-shared numbers they cannot see, and when one of them lies about their share, the arithmetic itself catches it. A bounded research extension also shows why that correctness check can become a privacy oracle if an implementation mixes values authenticated under different reconstructed MAC keys.

## What It Is

An interactive, browser-only demo of **SPDZ** (Damgård–Pastro–Smart–Zakarias, 2012): additive secret sharing over the prime field **F_p with p = 2⁶¹ − 1** (the Mersenne field real frameworks like MP-SPDZ use), **Beaver multiplication triples** with a strict offline/online split, and **information-theoretic MACs** — every share carries a share of α·x under a global MAC key α that no party holds.

The problem it teaches: Shamir- and Yao-style MPC assumes the parties follow the protocol (**semi-honest** security). SPDZ doesn't. In the **malicious** model, even with a **dishonest majority** (all but one party corrupted), a party who submits a wrong share produces a MAC that doesn't check — and the honest parties **abort** rather than accept a wrong answer. Semi-honest MPC computes correctly if everyone behaves. Malicious-secure MPC tells you when they didn't.

All arithmetic on the page is genuine field arithmetic in BigInt, with shares drawn from the platform CSPRNG. **This is a teaching demo, not production crypto**: the three "parties" run in one browser tab, and triples/shares come from a trusted dealer (see *What's real vs modeled* below).

## Exhibits

1. **Addition is free** — shares of x plus shares of y are shares of x + y, computed locally with zero communication. Establishes the baseline multiplication then breaks.
2. **The Beaver triple** (headline #1) — a stepped animation of one real multiplication: fetch a preprocessed (a, b, c = a·b), open d = x − a and e = y − b **as authenticated (MAC-checked) openings**, combine locally via c + d·b + e·a + d·e. **Break it yourself, twice:** (a) reuse the spent triple for a second multiplication and watch the public wire leak x − x′ (with a fresh triple, the same difference is one-time-pad noise); (b) lie during the d opening and see why opening authentication is load-bearing — parties who skip it compute z′ = xy + δy carrying a *perfectly valid MAC*, while SPDZ aborts at the opening itself.
3. **The MAC check** (headline #2) — you play the malicious party P₁: edit your shares, then open the *same tampered shares* in both protocols side by side. Semi-honest: the wrong answer is **accepted** and rendered as **ALARM**. SPDZ: the MAC check fails, the parties **abort**, and the abort is rendered as the system *working*. **Both** shares are editable — the value share *and* the MAC share γ(x)₁ — because the abort message names the winning move ("shift your MAC share by α·Δ") and the panel prints α in the clear. Set the MAC shift to α·Δ and Σσᵢ lands on exactly zero: a forged value carrying a valid MAC, accepted in silence. That is the guarantee stated precisely rather than broken — the check is worth exactly as much as α is secret, and you can only compute α·Δ here because this tab plays the dealer. An advanced break-it attacks the check itself: send your check share σ *last* and cancel the sum — it works against an unordered check (the 1/p bound is simply false there) and dies against the commit-then-open transcript (real SHA-256 commitments over random nonces). Cryptographic result and security verdict are separate indicators throughout.
4. **Off-Key: when abort leaks a secret** — a bounded three-party trusted-dealer adaptation of Keller, Navot and Tyagi's attack. The same request runs against (a) a key-bound α context, where the check residue is Δ(g−d) and d is already public, and (b) an inconsistent context with the input under α and multiplication mask/check under β=α+Δ, where the residue becomes Δ(g−y). The original unmasked check recovers y; a fresh-nonzero-μ masked check reveals only whether y=g, which identifies y in the explicitly promised one-bit fixture. A private affine output, an ordinary wrong-share control, and a same-context repair keep privacy leakage distinct from correctness detection.
5. **When an abort comes too late (adjacent MPC family)** — a separate bounded Z₁₇ trace illustrates [Brüggemann and Schneider, *When Trying to Catch Cheaters Breaks the MPC*, EUROCRYPT 2026](https://encrypto.de/papers/BS26.pdf), §3.3. Choose a hidden bit, inject +1 in a first-gate message, then compare immediate verification, delayed separate hashes, and a joint delayed verdict. The attacker knows a masked value and two mask shares. A dependent SHA-256 hash over synthetic message fields permits a 17-candidate search for the missing share, and hence the bit, even though a later check aborts. This is an isolated information-flow adaptation, **not** the Trident/Fantastic Four/Quad protocol or SPDZ's MAC check. The joint row depicts the verdict boundary described in §3.5; it does not implement the paper's secure joint-check functionality or prove security of any deployment.
6. **Offline vs online** — a live triple bank that every multiplication on the page genuinely drains, with preprocessing to refill it. The two-phase split is why SPDZ is deployable.
7. **Three hospitals compute a variance** — a real MPC computation that needs multiplication (Σv²), which addition-only MPC like the sibling [silent-tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) cannot do. Opens only the aggregate M = n·Σv² − (Σv)² under a MAC check; a lying hospital triggers an abort.

## When to Use It

- To see why "the parties follow the protocol" is a real assumption with a real price, and what removing it costs.
- To understand Beaver triples: why multiplication needs preprocessing, why the openings d and e are safe, and why a triple is single-use.
- To learn what "abort" does and does not give you.
- **Do NOT use it** to run actual multi-party computations: there is one browser tab, one memory space, and a trusted dealer. Nothing here protects real secrets.

## Live Demo

**<https://systemslibrarian.github.io/crypto-lab-spdz-forge/>**

Share and add secrets, step through a Beaver multiplication, reuse a triple to cause a genuine leak, tamper with your own share and watch semi-honest MPC swallow the lie while SPDZ aborts, compare bound and inconsistent MAC-key contexts, drain and refill the triple bank, and run a three-hospital variance.

## What's Real vs Modeled

**Real:** all field arithmetic (BigInt over p = 2⁶¹ − 1, uniform rejection sampling from `crypto.getRandomValues`); additive sharing; MAC shares and the check σᵢ = γ(y)ᵢ − αᵢ·y, Σσᵢ = 0; Beaver's identity; **authenticated openings for every opened value, including the intermediate d and e** (a lie in an opening produces an authenticated wrong product, so a final check alone cannot catch it — there is a regression test proving this); the commit-then-open ordering of the check-share exchange (real SHA-256 over random nonces); the triple-reuse leak; the σ-last-sender cancellation; the Off-Key residuals derived from actual authenticated shares; the abort logic. The tampering interactions run against the real verifier — no outcome is scripted.

**Modeled (stated in-page):** triples and shares come from a **trusted dealer** — the SHE/MASCOT offline phase is not built; opened values are checked individually rather than batched by random linear combination (the paper draws batch coefficients after the opened values are fixed); all parties share one tab, so the commitment round models *message ordering*, not a real network, and network adversaries (scheduling, replay) are out of scope. The Off-Key extension adapts the paper's two-party attack to this lab's three-party shares and one unbatched blind opening (λ=1). It computes z=μ·residual directly and samples μ from Fₚ*; the paper samples uniformly from Fₚ, so μ=0 gives a 1/p false-zero event that this bounded exact-predicate fixture removes. It does not implement the distributed multiplication triple that hides μ, the full private-affine MPC circuit, persistence, cross-process state, or any evaluated framework.

**What it does NOT prove:** SPDZ **detects that** someone cheated — it does not compute the correct answer despite cheating, and it does not identify **who** cheated (that stronger property, *identifiable abort*, is a different protocol and is not built here). A cheater whose messages are fixed before reveals passes the MAC check with probability exactly 1/p ≈ 4.3×10⁻¹⁹ — overwhelming, not absolute; without that ordering the bound does not hold at all, which the lab demonstrates rather than hides.

### MAC-key consistency and the bounded Off-Key extension — October 25, 2026

[Keller, Navot and Tyagi, *Off-Key: Inconsistent MAC Keys Compromise Privacy in SPDZ-Family MPC*, ePrint 2026/2533](https://eprint.iacr.org/2026/2533) is a **preprint with demonstrated, attack-model-conditional results**. All shares and preprocessing used together must be authenticated under the same reconstructed global MAC key. Individual parties' additive key shares normally differ; that is not the bug. The bug is mixing material under α with material under β=α+Δ. The authors report privacy attacks against evaluated implementations that violated this requirement across batches, threads or process runs: depending on the MAC check, a corrupt party can recover a shared secret or test guesses through selective failure. This does not break SPDZ's theoretical guarantees or establish that every current version of those frameworks is vulnerable.

The main lab already uses one in-memory key (`src/ui/state.ts`) for inputs and all triple-bank refills. The research extension deliberately isolates a second context and executes the paper's core blind-opening equations over the lab's real shares. Its same-context control computes Δ(g−d); its inconsistent context computes Δ(g−y). The attacker request is built without y or honest state, while a separately labeled omniscient view independently checks the deductions. With the original unmasked check the visible residue recovers y. With the bounded masked check, a fresh non-zero μ preserves only zero/non-zero; one query tests y=g, and the explicit bit promise makes that enough to infer y. For a general field secret, one failed guess only rules out that guess.

This remains a **three-party trusted-dealer algebraic adaptation**, not a framework reproduction. It does not implement the paper's two-party preprocessing protocols, distributed masked multiplication, batching coefficients, persistent key bindings, threads, restarts, or network behavior. The same-context comparison models the restored assumption by producing the blind mask under α; it is protocol state, not a client-side validation rule. A real fix preserves and reuses the preprocessing protocol's key-binding state and discards affected state after abort, as described in §5.

**Source record:** reviewed the CL079 manuscript copy created 2026-10-17, SHA-256 `578bda70467f3d658c0011a08c419c37d0f5a987d0e580705c9770c24d5ab0f3`, specifically §§3, 3.2, 4.1–4.5, 5 and 5.1. The paper itself, rather than its abstract, supplies the residual identities, attacker observations, private affine example, and key-binding mitigation used here.

### Threat-model matrix

| Property | This lab | Full SPDZ-family deployment |
| --- | --- | --- |
| Field / share / MAC algebra | Implemented (BigInt, CSPRNG) | Implemented |
| Corruption threshold | The SPDZ theorem allows up to n−1 corruptions; this page executes one designated cheater at a time | Up to n−1, per family variant and setup |
| Input protocol | Trusted dealer shares inputs | Authenticated input procedure |
| Triple generation | Trusted dealer | SHE- or OT-based preprocessing with sacrifice checks |
| Opening authentication | Implemented for every opening, incl. d and e | Required |
| MAC-key consistency | Main path: one in-memory key. Isolated research fixture: deliberate α/β mismatch plus a same-context control | Preserve key-binding state across all values and preprocessing used together |
| MAC-check ordering | Commit-then-open (SHA-256); single tab models the network order | Network protocol with commitments |
| Batched checking | Single-value checks (pedagogical case) | Random linear combination, amortized |
| Network, scheduling, replay | Not modeled (one browser tab) | Required |
| Fairness / guaranteed output | Not provided — abort only | Generally abort, not guaranteed output |
| Identifiable abort | Not provided (named, not built) | Separate stronger variants |

## What Can Go Wrong

- **Triple reuse** — the "d leaks nothing" argument requires a to be uniform *and single-use*; the break-it panel shows the wire leaking x − x′ the moment that's violated.
- **Skipping the MAC check** — the semi-honest column is exactly SPDZ without it: a single bad share silently corrupts the output for everyone.
- **Trusting the dealer** — in this demo the dealer is honest by fiat; a malicious dealer could deal c ≠ a·b or leak α. Real SPDZ replaces the dealer with heavy cryptography (SHE + ZK proofs, or OT à la MASCOT).
- **Mixing authentication contexts** — a check can still detect incorrect arithmetic while its success/failure leaks a private predicate. Preserve the preprocessing protocol's key-binding state across every batch, thread and restart whose material may be combined; plaintext key shares alone do not provide that binding.

## Real-World Usage

SPDZ-family protocols are implemented in research and production-grade frameworks — [MP-SPDZ](https://github.com/data61/MP-SPDZ) (whose Mersenne61 backend uses this exact field) and [SCALE-MAMBA](https://github.com/KULeuven-COSIC/SCALE-MAMBA) implement them directly — and the offline/online architecture (bank expensive input-independent material, keep the input-dependent phase cheap) is the standard shape of maliciously secure arithmetic MPC in settings where participants are competitors and semi-honest trust is not on the table. No throughput numbers are quoted here on purpose: performance claims are meaningless without hardware, network, security parameters, party count, and preprocessing backend, so consult the papers below for benchmarks in context.

## References

- Damgård, Pastro, Smart, Zakarias — [Multiparty Computation from Somewhat Homomorphic Encryption](https://eprint.iacr.org/2011/535) (CRYPTO 2012). The SPDZ protocol: information-theoretic MACs, offline/online split, active security with up to n−1 corruptions.
- Beaver — [Efficient Multiparty Protocols Using Circuit Randomization](https://link.springer.com/chapter/10.1007/3-540-46766-1_34) (CRYPTO 1991). The multiplication triple.
- Keller, Orsini, Scholl — [MASCOT](https://eprint.iacr.org/2016/505) (CCS 2016). OT-based triple generation (named in-page, not built).
- Keller, Pastro, Rotaru — [Overdrive](https://eprint.iacr.org/2017/1230) (EUROCRYPT 2018). Faster SHE-based preprocessing (named in-page, not built).
- [MP-SPDZ](https://github.com/data61/MP-SPDZ) — corroborating implementation: its `MAC_Check` performs the commit-then-open, batched check this lab teaches the single-value case of.
- Keller, Navot, Tyagi — [Off-Key: Inconsistent MAC Keys Compromise Privacy in SPDZ-Family MPC](https://eprint.iacr.org/2026/2533) (2026 preprint). The inconsistent-key residuals, selective-failure attack, private affine example, and key-binding mitigation adapted in the research extension.

Original SPDZ (2012) is distinguished throughout from later SPDZ-family work — MASCOT and Overdrive are separate constructions, named where relevant and explicitly out of scope.

## How to Run Locally

`​``bash
npm ci
npm run dev        # Vite dev server
npm test           # Vitest unit tests + KATs
npm run build      # typecheck + production build
npm run test:a11y  # behavior + dark-theme WCAG 2.1 AA gate at desktop/380px (port 4352)
npm run test:mutations # replay three focused Off-Key mutations; each owning test must fail
`​``

## Related Demos

- [crypto-lab-silent-tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) — the semi-honest, addition-only predecessor.
- [crypto-lab-shamir-gate](https://systemslibrarian.github.io/crypto-lab-shamir-gate/) — polynomial secret sharing, honest majority.
- [crypto-lab-garbled-gate](https://systemslibrarian.github.io/crypto-lab-garbled-gate/) — Yao's two-party boolean circuits.
- [crypto-lab-ot-gate](https://systemslibrarian.github.io/crypto-lab-ot-gate/) — oblivious transfer.

## Build & Verify

- **76 Vitest unit tests** across 8 files (`src/**/*.test.ts`), covering field arithmetic, share/open round trips, MAC accept/reject for every party and delta, the exact identity the MAC panel reports (Σσᵢ = macΔ − α·Δ, so only the precise forgery passes and a MAC-only edit still aborts), Beaver correctness on typical/boundary/randomized operands, single-use enforcement, the triple-reuse leak, the semi-honest vulnerable path *exhibiting* the flaw, the y = 0 case where the opening lie is absorbed and the product stays correct (SPDZ aborts anyway), the session-key consistency control, and the variance circuit incl. fail-closed edge cases — plus the adversarial message boundaries: tampered d and e openings abort; a regression test proves a final-only check would miss the opening attack (z′ = xy + δy verifies); the σ-last-sender cancellation succeeds against the unordered check and fails against commit-then-open; equivocation after commitment is caught; commitments are binding on value and nonce. Eleven Off-Key tests independently verify both residual formulas, same-context/non-leakage controls, unmasked recovery, masked bit inference, the private affine view, ordinary corruption, all bit/guess combinations, and fail-closed input bounds.
- **16 known-answer assertions** in `src/spdz/kats.test.ts`. SPDZ is a paper, not an RFC — it publishes no test vectors — so the KATs are (a) closed-form Mersenne-61 field identities derived independently on paper, and (b) fixed-randomness protocol vectors with every share, MAC, and transcript value hand-computed from the SPDZ equations and pinned as literals.
- **16 functional browser tests** (`e2e/behavior.spec.ts`) assert the real arithmetic, abort semantics, the no-attribution rule for aborts, triple-bank accounting, fail-closed behavior, Off-Key attacker/teaching view separation, matching and rejected selective-failure guesses, the same-context repair, and evidence retirement after editable controls change against the production build.
- **3 focused mutations** (`scripts/mutations.mjs`) remove the β-authenticated attack mask, move the repaired mask into β, or omit Δ·g from the attack request. Each named owning test must turn red, and the script restores the source byte-for-byte and reruns the clean control.
- **Accessibility gate:** `@axe-core/playwright` scans the dark-only production build at desktop and 380px widths, scanning the ALARM/ABORT variants *while they are rendered* and then the accepted variants that replace them; zero WCAG 2.1 A/AA violations required. Pull requests run the same gate (`ci.yml`); the GitHub Pages deploy is blocked if unit tests, the typechecked build, or the browser gate fail.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Ablation Wire

- **slug**: `crypto-lab-ablation-wire`
- **repo**: https://github.com/systemslibrarian/crypto-lab-ablation-wire
- **live**: https://systemslibrarian.github.io/crypto-lab-ablation-wire/
- **commit_sha**: `81ddddc6b71c42f49304b64f6b4da3435c522b1c` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | ATTACKS | POST-QUANTUM  ·  **level**: intermediate  ·  **--accent**: #4c7bb8
- **MISSING FIELDS**: subtitle, description, why_it_matters, claims, mutations, verification, limitations

**Name (H1)**: Layer ablation console  — _read from web/index.html_

**Subtitle**: _MISSING_

**Description**: _MISSING_

**Why it matters**: _MISSING_

**Card copy**: The 1942 Navajo code-talker stack rebuilt on modern primitives, with every layer independently switchable — turn one off and discover which was actually load-bearing.

**Chips**: X-Wing KEM · AES-256-GCM · Transcript Binding · Rust/WASM

**Implements**: AES-GCM `codetalker-core/src/aead.rs:5`, ChaCha20-Poly1305 `codetalker-core/src/aead.rs:6`, Ed25519 `codetalker-core/src/identity.rs:172`, HKDF `codetalker-core/src/kdf.rs:4`, ML-DSA `codetalker-core/src/identity.rs:221`, ML-KEM `codetalker-core/src/kem.rs:253`, SHA-256 `codetalker-core/src/kdf.rs:5`, X25519 `codetalker-core/src/kem.rs:97`

**Attacks shown**: Discrete log `TEACHING.md:243`, Known-plaintext attack `README.md:311`, Man-in-the-middle `web/index.html:2493`, Nonce reuse `web/index.html:1344`

**References**: AES, ChaCha20, DHKEM, Diffie-Hellman, Double Ratchet, EC point arithmetic, Pairing, Poly1305, SHA-3, SHAKE

**Standards body**: IETF, NIST

**Implementation**: Rust crates / WASM

**Spec citations, exactly as written**:

- `FIPS 203` — first seen README.md:258 (2×)
- `FIPS 204` — first seen README.md:178 (3×)
- `RFC 5869` — first seen README.md:251 (1×)
- `RFC 7748` — first seen README.md:252 (1×)
- `RFC 8032` — first seen README.md:177 (2×)
- `RFC 8439` — first seen README.md:256 (1×)
- `RFC 9180` — first seen README.md:177 (1×)

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Ablation Wire

The codetalker stack — the 1942 Navajo code-talker stack rebuilt on modern
primitives, with every layer independently switchable. The internal crates are
`codetalker-core` and `codetalker-wasm`, and they keep those names.

The point is not to build a secure channel. It is to let a reader turn layers
off and discover which one was actually load-bearing.

**It teaches people to ask what each protection contributes, and to test what happens when it disappears.**

## The claim this crate tests

| 1942 | here | module |
|---|---|---|
| pre-shared codebook | X-Wing KEM → HKDF-SHA256, two-party handshake | `kem`, `handshake`, `kdf` |
| homophonic substitution (A = ant / apple / axe) | AES-256-GCM or ChaCha20-Poly1305 | `aead` |
| rare unwritten language over open radio | padding + framing | `transport` |
| *(absent in 1942)* | peer authentication, transcript-bound | `identity`, `transcript` |
| *(absent in 1942)* | symmetric ratchet | `ratchet` |

Popular retellings credit the third layer. The historical record does not.
Joe Kieyoomia was a fluent Navajo speaker in Japanese custody, made to listen to
intercepts; he recognised his own language and could not read a word of it,
because the codebook was doing the work. See [SOURCES.md](SOURCES.md).

`tests/ablation.rs` encodes that as an assertion:
`kieyoomia_linguist_without_codebook_recovers_nothing`.

## The guided lab

The console opens on a five-experiment sequence rather than on thirty-two layer
combinations and no order to take them in. Each experiment states a starting
state, asks for a prediction, moves one named control, and then explains what
changed and which adversary it defeated or let in.

| # | experiment | change | result | concept |
|---|---|---|---|---|
| 1 | The fluent speaker | give the adversary a fluent speaker | metadata only, unchanged | recognising the language is not holding the codebook |
| 2 | Obscurity on its own | that same adversary, key agreement and AEAD off | full plaintext | a transformed wire is not a confidential one |
| 3 | A valid signature from the wrong peer | peer authentication off | delivered to the attacker | encryption without a pinned identity stops nobody active |
| 4 | One keystream, twice | ratchet already off, repeat the nonce | message 2 from a crib for message 1 | a repeated nonce bites only when the key repeats too |
| 5 | The ratchet earns its place | leave the nonce repeating, ratchet back on | metadata only | nonce uniqueness is a per-key requirement |

The sequence chains deliberately. Experiment 2 keeps the adversary experiment 1
handed a speaker to, so the reader watches the *same* adversary who got nothing a
moment ago read everything — which is a different lesson from watching a fresh
adversary succeed.

All of it lives in `lab.rs` rather than in the page, and that is the point. Every
experiment declares the outcome it expects before and after its change, and
`tests/ablation.rs` runs each one through the real channel and compares. A lesson
authored in HTML could promise a result the crate does not produce and nothing
would notice — in a demo whose whole argument is that the numbers come from the
crate, that would be the one panel on the screen that was merely asserted. The
same tests pin the switches each step names against the actual difference between
its two configurations, and require every prediction offered to be the right
answer somewhere.

The seven presets in the bar are the same data and are asserted the same way.
Any configuration is a link: the address bar carries the switches, the backend,
the AEAD suite, both messages and — in guided mode — the experiment and whether
its result is showing, so `#m=g&s=3&st=r` opens experiment 3 at its debrief.

## Teaching with it

[TEACHING.md](TEACHING.md) is the instructor package: three delivery formats (10,
30 and 60 minutes), learning objectives, the expected outcome for every preset, a
misconceptions table with the diagnostic question for each one, a no-spoilers
student worksheet with an observation sheet, a separate answer key, discussion
prompts on the limits of the analogy and on the historical framing, and a rubric
that grades the causal explanation rather than whether the learner found a switch
combination.

Two of its tables are asserted rather than written: the preset outcomes are
checked against `lab::SCENARIOS`, and every experiment and challenge is checked
to appear at all. A teaching guide that quietly disagrees with the demo is worse
than none, because the person it misleads is standing in front of a room.

The lab ends with two **transfer challenges** — a goal with no walkthrough,
scored by the crate condition by condition as the reader works. The second one
turns on a notion of *minimality* that is computed rather than asserted: every
switch left on has to be one whose removal changes the verdict. It is the
question that separates a learner who found a configuration that works from one
who understood why each part of it is there.

## Concepts at the point of use

Every switch carries a caption on one schema — what the layer's **job** is, which
**adversary** it answers, what its absence concretely **means**, the **1942**
analogue *and where that analogue stops*, and the **modern** protocol comparison.
Each one ends in a "show me" button that puts the console into the configuration
that demonstrates it.

That button is why the captions live in `explain.rs` and not in the page. A
caption declares the verdict its demonstration produces, and `tests/ablation.rs`
runs it. Two of those assertions are the ones worth having: the transport and
ratchet captions both claim their layer's absence moves *no* verdict, and a test
holds them to it — if either ever started changing the recovery, the captions
would be wrong and the demo would be teaching that every layer announces itself.
The ratchet caption is pinned harder still, because it is the one most likely to
overclaim: a test requires it to deny post-compromise security in as many words
and to distinguish itself from Signal's Double Ratchet.

The layers are deliberately **not** presented as a ladder. Transport
obfuscation, confidentiality, authentication, forward secrecy and post-quantum
resistance are not interchangeable quantities with one of them strongest, and a
reader who leaves believing they are ranked has learned something false from a
demo that switches them on and off in a single column.

Alongside them: a twelve-term glossary, reachable inline on hover *or keyboard
focus* — `:focus` and not `:focus-visible`, so a touch tap works too; a hexdump
legend where focusing a key isolates that field's bytes and says what the field
is for; and the handshake drawn as the sequence that actually ran, which redraws
the far end as the attacker when peer authentication is off. The transcript hash,
root key and per-frame message keys are still there, collapsed behind "inspect
internals" — they are evidence worth keeping and 64 hex characters apiece
competing with the lesson for a novice's attention.

## The handshake is real

`handshake` runs two parties exchanging two messages. Neither function generates
both keypairs — a single `agree()` playing both roles would be a simulation of a
handshake, and this crate's whole claim is that it does not simulate.

`​``text
Responder                                    Initiator
  (id_sk, id_pk) long-term
  (kem_sk, kem_pk) ephemeral
  sig = Sign(id_sk, H(transcript))
       -- ResponderHello{id_pk, kem_pk, sig} -->
                                  verify sig over H(transcript), pin id_pk
                                  (ss, ct) = Encap(kem_pk)
       <-------- InitiatorReply{ct} ----------
  ss = Decap(kem_sk, ct)

  root = HKDF(ss, "handshake" || H(full transcript))
`​``

Responder-authenticated, initiator-anonymous — the shape of TLS with server-only
certificates. The transcript hash is signed *and* bound into every AEAD as
associated data, so a frame lifted from another session fails its tag check.

## Layout

`​``
codetalker-core/
  src/kem.rs         every third-party KEM binding, isolated to one file
  src/handshake.rs   two-party handshake, transcript-bound
  src/identity.rs    Ed25519 peer authentication
  src/transcript.rs  length-prefixed transcript hashing
  src/ratchet.rs     symmetric ratchet (not a Double Ratchet -- see below)
  src/kdf.rs         HKDF-SHA256
  src/aead.rs        AES-256-GCM / ChaCha20-Poly1305
  src/transport.rs   L3 -- deliberately weak, see module docs
  src/session.rs     the ablation harness
  src/threat.rs      which adversary each configuration survives, with reasons
  src/lab.rs         the guided sequence and the presets, as data
  src/explain.rs     the captions: what each layer is for, and the glossary
TEACHING.md          instructor guide, student worksheet, answer key
  tests/kat.rs       published known-answer vectors
  tests/ablation.rs  one test per claim the demo makes in prose
  tests/properties.rs proptest coverage of the untrusted parser
fuzz/                cargo-fuzz targets: transport::deobfuscate, identity::verify
.github/checks/      the page driven in a real browser, in CI: console.mjs, a11y.mjs
                     plus links.mjs, and og.mjs which regenerates the social card
codetalker-wasm/     wasm-bindgen surface
web/index.html       the ablation console
web/pkg/             wasm-pack output, generated, not committed
.github/check-artifact.sh   the Pages artifact resolves without reaching outside itself
`​``

## Features

| feature | KEM | signatures | notes |
|---|---|---|---|
| `classical` (default) | DHKEM(X25519), RFC 9180 §4.1 | Ed25519, RFC 8032 | not post-quantum; the pre-PQ baseline |
| `pq` | X-Wing (X25519 + ML-KEM-768) | ML-DSA-65, FIPS 204 | post-quantum on **both** halves |

Both halves matters. A hybrid KEM protects confidentiality against a future
quantum adversary — traffic recorded today stays sealed. It does nothing for
authentication, which is a *live* property: a forgery has to happen during the
handshake, not in twenty years. So `pq` with an Ed25519 signature would not be
wrong against adversary A4, but it would invite a reader to assume more than it
delivers. `Handshake::is_fully_pq()` reports the two separately, and the demo
shows them as separate badges rather than one undifferentiated "PQ".

The announced suite is absorbed into the transcript *before* it is signed, so
rewriting that one field to force a downgrade changes the hash and the
signature stops verifying. Algorithm agility without that binding is a
downgrade oracle, not a feature.

`libcrux` was chosen over RustCrypto's `ml-kem` deliberately. The latter ships
with an explicit warning that it has never been independently audited. libcrux
has no independent audit of its PQ implementations either, but the maintainers
have formally verified them using hax and F*, and it is the implementation
shipping in Firefox.

## Build

`​``sh
cargo test                                   # classical
cargo test --features pq                     # hybrid X-Wing
cargo deny check                             # supply chain
cargo +nightly fuzz run deobfuscate          # the framing parser
cargo +nightly fuzz run identity_verify --features pq   # the signature verifier
wasm-pack build codetalker-wasm --target web --release --out-dir ../web/pkg
.github/check-artifact.sh                    # the Pages artifact resolves
node .github/checks/console.mjs              # drive the page in headless Chrome
node .github/checks/a11y.mjs                 # contrast, keyboard, zoom, screen reader
node .github/checks/links.mjs                # every internal link in the docs resolves
cargo llvm-cov -p codetalker-core --no-default-features --features classical,pq \
  --summary-only                             # coverage; CI floors this at 80%
`​``

Note the `--out-dir`. The deploy publishes `web/`, so that is where the module
has to land; building into the default `codetalker-wasm/pkg` produces a module
the demo cannot reach. CI uses the same flag for the same reason.

The wasm build carries **two majors of `getrandom`**, and both are load-bearing.
0.2 backs `rand_core` 0.6's `OsRng`, the single entropy source everything funnels
through. 0.4 arrives with RustCrypto 0.11 — `crypto-common` 0.2 depends on it
unconditionally — and refuses to compile for `wasm32-unknown-unknown` without its
`wasm_js` feature, which cannot be requested from a transitive position. Hence the
aliased direct dependency in `codetalker-wasm/Cargo.toml` that exists only to
enable it. If a wasm build ever fails with "the wasm32/64-unknown-unknown are not
supported by default", that dependency is what went missing.

MSRV is 1.87 with `pq` enabled. It was 1.85, set because libcrux uses edition
2024, and moved on 2026-10-29 to take the fix for RUSTSEC-2026-0385: `ctutils`
0.4.2 generates masks and compares `u128` values in non-constant time, and the
only patched release, 0.4.4, requires rustc 1.87. Cargo refuses the upgrade
under the old floor rather than silently taking it, so the floor had to move
for the advisory to be cleared at all. The default feature set still builds on
considerably older toolchains.

`vendor/libcrux-platform-0.0.4` stays, and the reason is now measured rather
than assumed. That patch wraps three CPUID intrinsics in `unsafe` blocks, and
the note beside it read as though 1.85 were what demanded them. Removing it on
1.87 was tried in #26 and the MSRV job returned the same `E0133: call to unsafe
function __cpuid is unsafe and requires unsafe function or block`. The
intrinsics are unsafe to call in any modern rustc, so the patch is not a 1.85
artefact and raising the floor does not retire it. It can only go when upstream
ships a fixed release; 0.0.4 is still the newest on crates.io.

## Known-answer tests

Verified on every CI run, transcribed from the specifications rather than
generated by this crate:

- RFC 5869 test cases 1, 2 and 3 (HKDF-SHA256), PRK and OKM
- **RFC 7748 §5.2 and §6.1 (X25519)** — scalar multiplication and the published
  Diffie-Hellman exchange
- **RFC 8032 §7.1 (Ed25519)** — signatures reproduced byte for byte, and the
  published signatures verified
- RFC 8439 §2.8.2 (ChaCha20-Poly1305)
- NIST GCM test cases 13 and 14 (AES-256-GCM)
- **FIPS 203 (ML-KEM-768)** — 35 ACVP decapsulation vectors
- **FIPS 204 (ML-DSA-65)** — ACVP signature verification, valid *and*
  deliberately invalid cases, because a verifier that accepts everything passes
  a positive-only KAT perfectly
- Exhaustive single-bit tamper rejection across both AEAD suites

The X25519 and Ed25519 vectors close what was the widest gap in this file. The
crate's claim is "real primitives, no simulated math", and until they were
added the two primitives doing the actual key agreement and authentication in
the default build had no published-vector coverage at all — only the symmetric
ones did.

NIST ACVP vectors are **not** vendored; `.github/fetch-vectors.sh` retrieves
them and CI runs it. `tests/kat.rs` **fails loudly** when a file is absent
rather than skipping, because a silently skipped known-answer test reads as a
pass — and it also asserts a minimum number of vectors consumed, because a file
that parses but matches nothing reads as a pass too.

Note the file names in that script. ACVP publishes `prompt.json` (inputs, no
answers) alongside `internalProjection.json` (the answers). CI used to fetch
the former, so even once the file existed there was nothing in it to check
against.

## Honest limitations

**`transport` is deliberately trivial.** It pads and frames; it is not obfs4 and
does not try to be. A convincing obfuscator would undermine the thesis by making
the channel look safe when the layers beneath it are off. Do not lift this
module for anything.

**This is a symmetric ratchet, not a Double Ratchet.** There is no DH ratchet,
so it provides forward secrecy but *not* post-compromise security. Naming it
honestly matters more than naming it impressively.

**Constant-time behaviour does not survive WASM.** The browser JIT makes no
timing guarantees regardless of what this source says. A WASM build is
functionally real and side-channel-wise it is not. Adversary A5 in
[THREAT_MODEL.md](THREAT_MODEL.md) is explicitly out of scope.

**Secret independence is checked at the Rust source boundary, not in emitted
machine code.** The blocking `check-secret-independence` job uses a narrowly
vendored portable ML-KEM/X-Wing path to retain `libcrux-secrets` types through
randomness, private keys, shared secrets, hashing, serialization, composition,
and implicit rejection. Equivalence tests cover ML-KEM-512/768/1024 and X-Wing;
negative compiler controls require secret-dependent branches, indices, and raw
hash boundaries to be rejected. See
[the patch provenance and exact boundary](docs/secret-independence-patch.md).

This establishes that the checked Rust path obeys the configured type-level
information-flow discipline. It does not establish constant-time machine code,
audit the compiler, or change the WASM timing limitation above.

**The two-time-pad recovery is bounded by the crib.** `session::two_time_pad`
recovers exactly as far as the known plaintext reaches, and the test asserts
that bound rather than choosing convenient equal-length messages to hide it.
The demo shows the same bound, rendering the bytes the attack does not reach.

**A repeated nonce is only fatal when the key repeats too.** `nonce_reuse`
pins the nonce, but with the ratchet on every message is sealed under a fresh
key, so the keystreams never coincide and XORing the ciphertexts yields noise.
The harness used to score `nonce_reuse` alone as `KeystreamReuse`, promising a
recovery the arithmetic cannot deliver; it now requires `nonce_reuse &&
!ratchet`. `nonce_reuse_with_a_ratchet_yields_no_pad_at_all` holds that line.
This is the ratchet earning its place rather than decorating the stack.

**Switching key agreement off substitutes the KEM.** `session::establish`
ignores the selected backend when `key_agreement` is false and builds on
`StaticKem` instead, and `adversary` re-derives the message key from that fixed
secret rather than reading it off the frame. Scoring the attack with a key the
attacker was handed would be the simulation this crate exists to avoid.

**A valid signature is not an identity.** Without a pinned peer key, an
attacker's correctly-signed hello verifies fine. Pass `expected_identity`.

### The page is checked by running it

`.github/checks/` drives the built page in headless Chrome on every push:
`console.mjs` walks the whole guided lab, both transfer challenges, every
preset, every caption's "show me", link restoration in both modes and all 384
reachable configurations; `a11y.mjs` audits contrast over every text-bearing
element in both themes, operates the lab with no pointer, and checks 640/390/320
CSS px, the reduced-motion fallback and the screen-reader path.

This exists because the first manual pass of those checks found three defects and
**two of them had already shipped**: white on the accent measured 2.56:1 in the
dark theme on the primary action button, and the muted ink was hairline sub-AA in
both. The crate's tests could not see them and `check-artifact.sh` reads the page
without running it. A check that runs when someone remembers to run it is a check
that finds things once.

No Playwright, no Puppeteer. The harness serves `web/` itself and speaks CDP over
Node's global `WebSocket`; a repository that verifies its linter against a
recorded SHA has no business pulling a browser-automation dependency tree to test
one static page.

### One mistake, checked instead of remembered

Two sibling `<span>`s authored as separate fields are inline by default, so they
render as one word: `reply { ct }encapsulates a fresh shared secret`. It happened
twice here — in the handshake sequence and again, three commits later, in the
social card — both times from the same assumption, and both times it was caught
by someone looking at a render rather than by anything checking.

`RUN_TOGETHER` in the check harness looks for the signature: the last line of one
element's text ending exactly where the next element's first line begins, with no
whitespace authored between them. It measures the *text* through a `Range` rather
than the boxes, so a table cell whose padding separates the words is separated.
It runs over seven console states in `a11y.mjs`, and the card generator refuses
to write a PNG that trips it.

Where abutting is the intent — the byte grid, and the recovered plaintext running
into the blocks that mark where the crib ran out — the markup says so with
`data-joined="why"`. The reason belongs next to the thing it explains rather than
in a list of exceptions inside the checker.

## Verification status

Measured on rustc 1.97.1, aarch64-apple-darwin.

| | status |
|---|---|
| `default` (classical) | clean build, 0 warnings, **81/81 tests passing** |
| `--no-default-features --features pq` | **90/90** — the pure post-quantum build, including typed-path equivalence |
| `--no-default-features --features classical,pq` | **93/93**, both suites present, including typed-path equivalence |
| MSRV, rustc 1.87 | builds `classical,pq` clean |
| FIPS 203 vectors | 35 ML-KEM-768 decapsulation vectors verified |
| FIPS 204 vectors | ML-DSA-65 signature verification, valid and invalid cases |
| `cargo clippy --all-targets` | clean on every feature combination, and on `wasm32` |
| `cargo deny --all-features check` | advisories, bans, licenses, sources — all ok |
| Secret independence | blocking typed build, ML-KEM/X-Wing equivalence and implicit-rejection tests, plus positive/negative compiler controls |
| `cargo audit` | no vulnerabilities; one unmaintained transitive crate, below |
| `wasm-pack build` | 700 KB module, driven end to end across every ablation |
| Threat matrix | A1–A5 computed in `threat.rs`; every row of THREAT_MODEL.md asserted in `tests/ablation.rs` |
| Guided lab | 5 experiments and 7 presets in `lab.rs`; every declared outcome run through the real channel in `tests/ablation.rs` |
| Layer captions | 6 panels in `explain.rs`, each carrying the configuration that demonstrates it; every "show me" asserted to produce the verdict its caption claims |
| Transfer challenges | 2 goals in `lab.rs`, scored by the crate; each asserted solvable by its own solution *and* asserted to reject the near miss a reader would actually make |
| Teaching guide | [TEACHING.md](TEACHING.md)'s preset table asserted against `lab::SCENARIOS`; every experiment and challenge asserted present |
| Accessibility | **17 checks, in CI on every push** — WCAG AA contrast over every text-bearing element in both themes, the guided flow operable without a pointer, no horizontal scroll at 640/390/320 CSS px, a structured equivalent to the hexdump, every control named, and no two fields rendering as one word |
| Console, in a browser | **88 checks, in CI on every push** — the full five-experiment run, prediction scoring, link restore, every preset, reset, every caption's "show me", the glossary, both handshake pictures, the hexdump keys, the four-beat indicator, the what-moved report, both transfer challenges scored condition by condition, and every one of 134 configurations round-tripped through its own link |
| Deployed demo | **384 configurations driven on the published artifact** — every backend × both suites × all 64 layer combinations, none throwing, no console errors |
| `check-artifact.sh` | every relative reference resolves inside `web/` |
| Documentation links | every relative path, self-referential Pages URL and own-repo blob URL in all 9 documents resolves, checked in CI |
| `cargo fuzz deobfuscate` | 45,027,157 executions, no crashes |
| `cargo fuzz identity_verify` | 577,993 classical + 608,145 with `pq`, no crashes |
| Scheduled fuzzing | nightly, 20 min per target, against a corpus cached between runs — demonstrated: the second run restored 169 seeds and libFuzzer reported them |
| Line coverage | **83.22%** (82.15% region, 75.23% function), floored at 80% in CI |
| Build provenance | the published wasm module is signed; `gh attestation verify` checks it |
| Module size | 750 kB, budgeted at 900 kB by `check-artifact.sh` |
| Actions pinned | every workflow action pinned to a commit SHA, Dependabot moves them |
| `forbid(unsafe_code)` | enforced by the compiler, not asserted in prose |
| RustCrypto 0.11 / dalek 3.0 | migrated; every published vector still reproduces byte for byte |

`cargo audit` reports `proc-macro-error2` as unmaintained (RUSTSEC-2026-0173).
It arrives through `hax-lib-macros` — part of the formal-verification toolchain
that is the reason for choosing libcrux in the first place — and is a
build-time proc-macro that contributes no code to the compiled artifact. Noted
rather than silenced, because the point of running the tool is to read what it
says.

Six things worth knowing about how this got here, because they were all
invisible until something actually ran:

**`--features pq` had never compiled.** `libcrux-kem` takes its RNG through
`rand_core` 0.10's `CryptoRng`; this crate is on 0.6, and the two traits are
unrelated. The old note blamed an outdated toolchain, which was wrong — a
current toolchain fails identically. `kem::os_rng` bridges the two. It was
`kem::libcrux_rng` until x25519-dalek 3.0 moved to `rand_core` 0.10 as well,
at which point the classical KEM needed the identical bridge and the name
stopped describing it.

**The ML-KEM known-answer test verified nothing.** It checked that a file
existed. Worse, CI fetched ACVP's `prompt.json`, which contains inputs and no
expected answers, so there was nothing in the file to check against even in
principle. It now parses `internalProjection.json` and compares real shared
secrets, and fails if it consumes fewer than 30 vectors — a KAT that silently
matches nothing is the same silent pass the loud panic exists to prevent.

**`cargo fuzz` could not have run.** `fuzz/` lived at `codetalker-core/fuzz/`
while both CI and this README invoked it from the repository root, where
cargo-fuzz looks for `./fuzz`. It has been moved to the root and declares its
own `[workspace]`.

**The published page had broken links, and the job meant to catch that was
looking elsewhere.** Pages serves `web/` as the site root, so the footer's
`../README.md` resolved above it and 404ed — while resolving fine in a local
editor preview, which is why it survived. A relative `./README.md` would have
been worse: `web/` has its own README about the directory, so the link would
have silently served the wrong document rather than failing. No favicon was
declared either, leaving a 404 in the console of a page whose argument is that
nothing on it is faked. Meanwhile the `wasm` job built into
`codetalker-wasm/pkg` while `deploy` built into `web/pkg`, so the job
responsible for the browser artifact was validating a build that lands where
the site never reads from. `check-artifact.sh` now resolves every relative
reference against `web/` and both jobs use the same `--out-dir`.

**The fuzzer was documented as covering the only untrusted parser, and there
were two.** `deobfuscate.rs` opened by describing itself that way. But
`handshake::initiate` hands `identity::verify` three slices lifted straight off
the wire -- the claimed identity key, the transcript hash, and the signature --
and they reach `VerifyingKey::from_bytes`, `MLDSA65VerificationKey::new` and
libcrux's ML-DSA verifier. That is the larger surface and the more critical one,
and nothing was fuzzing it. `identity_verify.rs` now does, in two modes: wholly
arbitrary slices, and a genuine key/message/signature triple with one field
mutated in place so lengths stay valid and the verifier reaches its arithmetic
rather than bailing at a length check.

Writing it reproduced the same failure in miniature. The target guarded its
Ed25519 arm with `#[cfg(feature = "classical")]`, but `feature` in a fuzz target
resolves against the *fuzz* crate, which had no such feature -- so the arm
compiled, ran, and did nothing. Only `unexpected_cfgs` caught it. The fuzz crate
now mirrors codetalker-core's feature names so the gate means what it reads as
meaning.

**The fuzzing depth was a sentence, not a fact.** `ci.yml` carried the comment
"Short run on every PR; the corpus grows via scheduled long runs" — and no
scheduled workflow existed anywhere in the repository. `/fuzz/corpus` is
gitignored besides, so nothing persisted between runs even in principle. Every
invocation started from an empty corpus and ran for sixty seconds. The figure in
the table above reads as accumulated depth and was nothing of the kind.

Coverage-guided fuzzing without an accumulating corpus is close to random
testing: the whole mechanism is that inputs reaching new edges get saved and
mutated further. So the sentence was made true rather than deleted —
`fuzz.yml` runs nightly, twenty minutes per target, restoring and saving the
corpus through a rolling cache key and minimising it with `cargo fuzz cmin`
before each save so it does not grow into replay. A fixed cache key would have
been the same bug in a new place: restored once, then frozen.

Demonstrated rather than assumed, by dispatching it twice: the first run started
from nothing and saved, the second restored that cache and entered with 169
seeds, with libFuzzer confirming `seed corpus: files: 169`. A workflow that has
never run is the same category of claim as the sentence it replaced.

## Documents

- [THREAT_MODEL.md](THREAT_MODEL.md) — adversaries A1–A5, and which configurations survive each
- [SECURITY.md](SECURITY.md) — why not to deploy this, and what does count as a vulnerability
- [SOURCES.md](SOURCES.md) — historical citations and specifications implemented

```

</details>

---

## Accumulator

- **slug**: `crypto-lab-accumulator`
- **repo**: https://github.com/systemslibrarian/crypto-lab-accumulator
- **live**: https://systemslibrarian.github.io/crypto-lab-accumulator/
- **commit_sha**: `0bca21375c5dcf41cdca6ed41ae3d2bbae09cecb` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `69ed29c312903d091b16cfd801bff8f365cf273b`
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | PRIVACY  ·  **level**: advanced  ·  **--accent**: #0ea5e9
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: Accumulator  — _read from index.html_

**Subtitle**: RSA accumulator · dynamic membership · non-membership proofs  — _read from index.html_

**Description**: Prove a certificate is not  — _read from index.html_

**Why it matters**: Your browser needs one answer about one certificate, and a revocation list makes it download all of them. An accumulator replies with one fixed-size witness — 72 bytes at this page's toy parameters, a few hundred in production.  — _read from index.html_

**Card copy**: One fixed-size digest commits to a growing set. Prove a certificate is in it — or, the hard part, that it is not — with a short witness, then forge one with the trapdoor.

**Chips**: RSA Accumulator · Non-Membership Proofs · Strong RSA · Certificate Revocation

**Implements**: Merkle tree `src/merkle/merkle.ts:53`, SHA-256 `src/core/hashToPrime.ts:58`

**Attacks shown**: Factoring `src/ui/forge.ts:200`

**Comment-only (named in code comments, not executed)**: Miller–Rabin `src/core/primes.ts:6`, RSA `src/accumulator/accumulator.ts:2`

**References**: BBS+, Miller–Rabin, Pairing, RSA, Shor's algorithm

**Standards body**: NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `CRYPTO 2002` — first seen README.md:20 (3×)
- `CRYPTO 2019` — first seen README.md:145 (2×)
- `doi.org/10.6028/NIST.FIPS.180-4` — first seen src/ui/dom.ts:335 (1×)
- `eprint.iacr.org/2018/1188` — first seen src/ui/dom.ts:323 (1×)
- `EUROCRYPT 1993` — first seen README.md:15 (3×)
- `EUROCRYPT 1997` — first seen README.md:17 (2×)
- `FIPS 180-4` — first seen README.md:179 (2×)
- `fips180` — first seen src/ui/dom.ts:331 (2×)
- `RFC 6962` — first seen README.md:69 (8×)
- `rfc6962` — first seen src/ui/compare.ts:490 (4×)

**README — What Can Go Wrong**:

```text
- **A composite representative forges membership.** If an element can be represented by `e₁·e₂` for
  two real members, the honest verifier accepts it — the equation `w^e = A` is satisfied by any
  divisor of the exponent product. Primality of the representatives is the defence, and it lives in
  the element map, not in the verifier. Runnable in the forgery panel.
- **The trapdoor forges everything.** Knowing `p` and `q` means knowing the group order, which means
  being able to take `e`-th roots at will. There is no coding discipline that repairs this; the
  parameters have to be generated so that nobody holds them.
- **A collision in hash-to-prime is a forgery.** At the 64 bits used here that is roughly 2³² work.
  Real deployments use around 256-bit representatives.
- **A stale witness is a rejected witness.** Every add and every delete breaks every outstanding
  witness. The update rules repair them from public data, but somebody has to actually run them.
- **A witness says nothing about freshness.** It proves a statement about *a* digest, not about the
  current one. The digest still needs a signature and a validity window, exactly as a CRL does.
- **Witnesses are not zero-knowledge.** A membership witness is a function of every other member of
  the set.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Accumulator

**RSA accumulator · dynamic membership · non-membership proofs**

A cryptographic accumulator commits an entire set to one fixed-size number and lets anyone prove
that an element is in it — or, crucially, that an element is **not** in it — with a short witness.
This demo builds a real RSA accumulator in the browser, produces and verifies both kinds of proof,
keeps witnesses alive across additions and deletions, tries to forge them, and measures the whole
thing against a real Merkle tree.

## What It Is

The construction is the RSA accumulator lineage, implemented rather than described:

- **Benaloh–de Mare (EUROCRYPT 1993)** — the original: `A = g^(e₁·e₂·…·eₙ) mod N`, where a
  membership witness is the same product with your own factor omitted.
- **Baric–Pfitzmann (EUROCRYPT 1997)** — collision-freeness requires the accumulated values to be
  **primes**, so elements are mapped through a hash-to-prime function. The demo shows what breaks
  without it.
- **Camenisch–Lysyanskaya (CRYPTO 2002)** — the dynamic accumulator: adding and deleting elements,
  and the public rules for repairing an outstanding witness after either.
- **Li–Li–Xue (ACNS 2007)** — the *universal* accumulator: a non-membership witness `(a, d)` derived
  from the Bézout identity `a·u + b·x = 1`, verified as `A^a · d^x ≡ g (mod N)`.

**Security model.** Soundness rests on the **Strong RSA assumption** *and* on nobody knowing the
factorisation of `N`. This page knows the factorisation, because this page generated it — and the
forgery panel demonstrates precisely what that buys an attacker. Elements are represented by 64-bit
primes and the modulus is 512 bits. Both are chosen so every operation finishes instantly in a tab.

**This is not production cryptography.** It is a teaching demo. The mathematics is real and
unsimplified; the parameters are a toy and the trapdoor is printed on the page on purpose.

## Exhibits

**Start with the guided demo.** It is four beats, about ninety seconds, and it drives the same
shared state and the same accumulator functions every panel below uses — there is no parallel
simulation. Beats are re-entered by replay rather than undo, so Back, Restart and the
`?tour=revocation&step=N` deep link are all one deterministic code path.

0. **Guided demo** — build a revocation set and watch the digest change without growing; fetch and
   verify a proof that a certificate is *not* revoked; revoke it and watch the cached proof turn
   stale; then forge one with the trapdoor and watch the same verifier accept it. A persistent
   set → digest → proof stage carries the state throughout, with each proof stamped with the digest
   version it was minted against.

Then the full lab, reachable from the sticky exhibit navigator (every section keeps a plain `#id`
anchor, so any of them can be linked from a class or a slide):

1. **What is an accumulator?** — a plain-language on-ramp with no maths, plus a glossary of every
   term the page later uses.
2. **The point: revocation without the list** — the byte costs of a full CRL, an OCSP response and
   a witness, side by side, and the full fetch → revoke → reject cycle.
3. **The exponent grows. The digest does not.** — the headline mechanism, stepped one real modular
   exponentiation at a time, with two meters diverging: the product of the primes climbing without
   bound while the digest stays pinned at 64 bytes. A scale test accumulates up to 1,000 extra
   elements for real and reports the measured sizes.
4. **Membership proof** — build `w = g^(u/e)`, then compute `w^e mod N` and compare it against the
   digest hex digit by hex digit. Includes the fail-closed case: asking for a witness for a
   non-member, and seeing that `u/e` is simply not an integer.
5. **Non-membership proof** — the Bézout identity shown as an identity (the actual `a` and `b`),
   then reduced and hidden in the exponent, then verified. Ask about an element that *is* in the
   set and watch the proof become impossible rather than merely fail.
6. **A living set — and the witnesses that go stale** — two witnesses are held on your behalf, go
   stale on every change, and are repaired by the published update rules using public data only.
   Deletion is run both ways — recompute over the set, and the one-exponentiation trapdoor
   shortcut — and the results compared.
7. **Accumulator vs Merkle tree** — describe your deployment (modulus, representative size, set
   size, whether a trusted setup is available, how many witness holders and how much churn) and get
   a plain recommendation, backed by a measured table against a real RFC 6962 sorted-leaf tree and
   a scaling chart with the crossover points marked.
8. **Forge a proof** — predict which of ten attacks the verifier will accept, *then* reveal. Eight
   fail on the arithmetic. One succeeds because the element map was bypassed. One succeeds because
   the trapdoor exists, and cannot be made to fail.
9. **The parameters — and who holds the keys to them** — the modulus, generator and both safe
   primes, plus a real in-browser safe-prime search with a live candidate counter.
10. **What is real here, and what is not** — the honest-scoping panel, with sources.

## When to Use It

**Use an accumulator when** the set is large and changing, the question you need answered is about
one element at a time, and — above all — when you need **non-membership**: revocation checks,
allow/deny lists, stateless blockchain clients proving a UTXO was never spent, anonymous credential
systems proving a credential is not revoked.

**Do NOT use one when** any of these hold:

- **You cannot run a trusted setup.** An RSA accumulator whose modulus was generated by one party is
  forgeable by that party, full stop. Use a Merkle tree, or class groups, or an MPC ceremony.
- **You need post-quantum security.** Shor's algorithm factors `N` and the accumulator falls with
  it. A hash-based Merkle tree does not.
- **Witness holders cannot be kept up to date.** Every change invalidates every outstanding witness.
  If your clients cannot be reached to update them, the logarithmic refetch of a Merkle path is a
  far simpler operational story.
- **The set is small.** At realistic parameters the accumulator's proofs only become smaller than a
  Merkle tree's somewhere past a few thousand elements. The comparison panel plots where.

## Live Demo

**<https://systemslibrarian.github.io/crypto-lab-accumulator/>**

The guided demo is the first thing on the page and the first control is on screen without
scrolling, on desktop and on a 390px phone. Jump straight to any beat with
`?tour=revocation&step=3`, or to any exhibit with its anchor (`#compare`, `#forge`, …). A
persistent **Reset demo** control in the navigator restores the deterministic starting set,
parameters and digest from anywhere on the page, so the story can be rehearsed and repeated
without hunting for the set editor.

Beyond the tour you can step the accumulation one exponentiation at a time, build and verify both
kinds of witness, watch cached proofs go stale and repair them, predict and then run ten forgery
attempts against the real verifier, get a deployment recommendation from measured proof sizes and
witness-update bandwidth, and generate a fresh modulus by searching for safe primes in your own
browser.

## What Can Go Wrong

- **A composite representative forges membership.** If an element can be represented by `e₁·e₂` for
  two real members, the honest verifier accepts it — the equation `w^e = A` is satisfied by any
  divisor of the exponent product. Primality of the representatives is the defence, and it lives in
  the element map, not in the verifier. Runnable in the forgery panel.
- **The trapdoor forges everything.** Knowing `p` and `q` means knowing the group order, which means
  being able to take `e`-th roots at will. There is no coding discipline that repairs this; the
  parameters have to be generated so that nobody holds them.
- **A collision in hash-to-prime is a forgery.** At the 64 bits used here that is roughly 2³² work.
  Real deployments use around 256-bit representatives.
- **A stale witness is a rejected witness.** Every add and every delete breaks every outstanding
  witness. The update rules repair them from public data, but somebody has to actually run them.
- **A witness says nothing about freshness.** It proves a statement about *a* digest, not about the
  current one. The digest still needs a signature and a validity window, exactly as a CRL does.
- **Witnesses are not zero-knowledge.** A membership witness is a function of every other member of
  the set.

## Real-World Usage

Accumulators are the cryptographic answer to revocation, and they show up wherever a short proof
about a large changing set is needed: anonymous credential systems (Idemix and the Camenisch–
Lysyanskaya credential family use accumulator-based revocation), stateless blockchain clients, and
research designs for certificate revocation.

Deployed certificate revocation today, it should be said, mostly uses something else: CRLite
compresses the entire revocation set into a filter cascade that ships with the browser, and
short-lived certificates sidestep revocation altogether. The accumulator remains the cleanest
cryptographic answer to the problem rather than the most widely deployed one — largely because of
the trusted setup this demo makes you look at.

The active research direction is batching: **Boneh–Bünz–Fisch (CRYPTO 2019)** showed how to batch
witness updates and aggregate proofs, and moved the construction into **class groups of imaginary
quadratic fields**, where there is no trapdoor to lose because the group order is not efficiently
computable by anyone.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-accumulator.git
cd crypto-lab-accumulator
npm install
npm run dev            # http://localhost:5173/crypto-lab-accumulator/
`​``

Other scripts:

`​``bash
npm test               # unit tests + known-answer tests
npm run build          # typecheck, then production build into dist/
npm run preview        # serve the production build on port 4295
npm run test:a11y      # full browser gate: axe WCAG 2.1 A/AA + the functional flow
npm run test:flow      # just the functional flow, for a faster loop
`​``

## Related Demos

- [crypto-lab-key-mirror](https://systemslibrarian.github.io/crypto-lab-key-mirror/) — Merkle logs
  and consistency proofs doing the *membership* job at scale, in key transparency.
- [crypto-lab-credential-veil](https://systemslibrarian.github.io/crypto-lab-credential-veil/) —
  BBS+ selective disclosure and status-list revocation, the credential side of the same problem.

## Build & Verify

- **116 unit tests** across 8 files, all colocated in `src/` as `*.test.ts`.
- **53 known-answer vectors** in `src/fixtures/kat.json`, covering SHA-256 (FIPS 180-4 published
  digests), modular exponentiation, extended Euclid, hash-to-prime, and a full end-to-end
  accumulator instance with its membership and non-membership witnesses.

  There is no RFC and no NIST vector suite for RSA accumulators, so claiming "spec KATs" would be
  dishonest. Instead every vector was produced by an **independent CPython implementation**
  (`hashlib` plus CPython's bignum `pow`/`math.gcd`) and is re-derived byte for byte by the
  TypeScript at test time. The primality tests are additionally gated on published adversarial
  inputs: 10 Carmichael numbers and 8 strong pseudoprimes to base 2, all of which must be rejected.
- **Adversarial tests** in `src/accumulator/adversarial.test.ts` cover every attack the forgery
  panel offers — including the two that succeed, which are asserted to succeed.
- **A 12-step random churn test** carries one membership and one non-membership witness through
  interleaved adds and deletes, re-verifying both after every single step.
- **Replay-determinism and digest-history tests** in `src/ui/state.test.ts` protect the guided
  path: reset must restore a byte-identical digest, and a held witness must stay valid against the
  digest it was minted for while failing against the current one. Collapsing those two into one
  answer is the operational mistake accumulators invite, so it is tested.
- **15 browser tests** in `e2e/`, all run by `npm run test:a11y` and all gating the deploy:
  - **3 axe scans** for zero WCAG 2.1 A/AA violations — dark, light, and a 390px viewport — each
    driven through both the healthy states (proofs verifying, forgeries rejected) and the failure
    states (stale witnesses, a revoked certificate, an accepted forgery), because an unscanned
    state is an ungated state.
  - **12 functional tests** that protect the golden flow for its *meaning* rather than incidentally
    as axe setup: the four beats against the real verifier, replay determinism, the deep link,
    public witness repair, the attack reveal, the recommendation changing when no trusted setup is
    available, explicit layout assertions (first action on screen at 1440×900 and at 390×844, no
    horizontal overflow at 320, 390, 768 or 1440 px), and a **size-honesty gate**: no readout that
    would change at production parameters may ship without the `TOY` marker, and every panel that
    reports a size must state what it would be in production.

  Screenshots are written to `test-results/shots/` as artefacts rather than compared against golden
  images: font rasterisation differs between a local macOS run and the Linux CI runner, and a
  pixel-diff gate that cries wolf every commit is worse than none. The layout assertions above are
  the part that must hold.

`​``bash
npm test && npm run build && npm run test:a11y
`​``

## Performance

All timings on the shipped 512-bit modulus with 64-bit representatives, measured in-page:

| Operation | Cost |
|---|---|
| Verify a membership witness | ~9 µs (one modular exponentiation) |
| Verify a non-membership witness | ~18 µs (two exponentiations and a multiply) |
| Add an element | one exponentiation on the digest |
| Delete an element | `n` exponentiations, or one with the trapdoor |
| Accumulate 1,000 elements from scratch | ~1 s, dominated by hash-to-prime |
| Generate a fresh 512-bit modulus | typically 0.1–3 s; safe primes are rare |

A realistic 3072-bit modulus is roughly two hundred times slower per exponentiation, which is why
the shipped parameters are a toy. The panel that generates parameters in your browser lets you feel
the real cost of the safe-prime search.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Card Trick

- **slug**: `crypto-lab-card-trick`
- **repo**: https://github.com/systemslibrarian/crypto-lab-card-trick
- **live**: https://systemslibrarian.github.io/crypto-lab-card-trick/
- **commit_sha**: `de5ef16e3e257968a5f56b9a9042e03d9774006b` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `484e3bb8e325f8de80394703d4f930411be006a7`
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: #ef4444
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: Card Trick  — _read from index.html_

**Subtitle**: Five-card protocol · information-theoretic MPC · den Boer 1989  — _read from index.html_

**Description**: Cut five face-down cards and reveal only the AND of two secret bits.  — _read from index.html_

**Why it matters**: Most cryptography bets that attacks are too expensive. Here every possible secret looks identical — so computing power buys nothing.  — _read from index.html_

**Card copy**: den Boer's five-card trick — two players compute the AND of their secret bits from a shuffle alone, with security no amount of computing power can buy through.

**Chips**: den Boer 1989 · Five-Card Trick · Information-Theoretic · Two-Party AND

**Implements**: Five-card trick `src/cards/protocol.ts:2`

**Attacks shown**: Brute force `src/ui/comparePanel.ts:216`

**Comment-only (named in code comments, not executed)**: Garbled circuits `src/ui/comparePanel.ts:11`

**References**: Garbled circuits, Grover's algorithm, Oblivious transfer, One-time pad, Private set intersection, SHA-1, Shamir secret sharing

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `ASIACRYPT 2012` — first seen README.md:148 (4×)
- `eprint.iacr.org/2018/951` — first seen README.md:151 (2×)
- `EUROCRYPT 1989` — first seen index.html:18 (1×)

**README — What Can Go Wrong**:

```text
| Failure | What happens | Where you can see it |
| --- | --- | --- |
| **The cut is not uniform** | Alice's two layouts sit three cut positions apart, so the rows Bob sees are the cut distribution and the cut distribution rotated by three. They match only when the distribution is invariant under rotation by 3 — and 3 generates Z5, so only the uniform cut qualifies. | *Break it*, every preset |
| **The cut is random but lopsided** | "Random" is not the requirement. A dealer who cuts by 0 or 1, each half the time, puts Alice's 0 on two rows and her 1 on two entirely different rows: disjoint supports, one look, 100%. | *Break it*, “Lazy dealer” |
| **The cut is nearly uniform** | Not nearly secure. Covering four of the five depths evenly still lifts Bob to 62.5%. The failure is not gradual in the way a security parameter is. | *Break it*, “Almost uniform” |
| **A player peeks at a face-down card** | Total break, and the protocol has no defence at all. Its only assumption is that identical backs are indistinguishable; a peek is that assumption failing, not an attack on the maths. | Stated in-page; deliberately not modelled |
| **A player miscommits** | Encoding the wrong bit changes the answer without changing anything an observer could detect. Correctness here assumes honest placement — this is an honest-but-curious protocol, not a malicious-secure one. | Stated in-page |
| **Confusing the output with a leak** | Bob holding 1 learns Alice's bit from the answer alone. Reporting that as a protocol leak is the standard way this gets explained badly, and it would make every AND protocol look broken. | *Privacy*, the two Bob cards |

---
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Card Trick

**Five-card protocol · information-theoretic MPC · den Boer 1989**

Two players compute the AND of their secret bits using five physical playing cards — no
electronics, no computational assumptions, security from shuffle indistinguishability
alone.

---

## What It Is

An interactive implementation of **den Boer's five-card trick** (EUROCRYPT '89), a two-party
secure multi-party computation protocol for a single AND gate. Alice holds a secret bit
`a`, Bob holds a secret bit `b`, and between them they learn `a AND b` — and nothing else.

The whole protocol is a layout, a cut, and a predicate:

`​``
encoding      ♠♥ = 1        ♥♠ = 0
layout        [ E(a) ] [ ♥ ] [ E(¬b) ]
cut           rotate the five-card ring by a secret, uniform s ∈ Z5
read-off      the two ♠ are cyclically adjacent  ⟺  a AND b = 1
`​``

**The security model is what makes this worth building.** Nearly every other demo in the
Crypto Lab is *computationally* secure: safe because breaking it would take more
arithmetic than exists. This one is **information-theoretically** secure. The three input
pairs that produce an answer of 0 all start from rows that are rotations of one another,
so a uniform cut spreads all three over exactly the same five revealed rows at exactly the
same rate. The distributions an attacker would compare are **equal**, so no amount of
computing power, no future algorithm and no quantum computer helps — there is no quantity
for work to buy.

The state space is ten rows and five cuts, which is small enough to enumerate. Every
probability on the page is therefore a finished sum rather than a Monte Carlo estimate,
and the zeros are enumerated zeros rather than rounded ones.

**What is real:** the protocol logic, the read-off, the orbit partition, the
indistinguishability table, the posteriors, the total-variation distances, the mutual
information in bits, and the unbiased cut sampler (rejection sampling on the platform
CSPRNG, so `byte % 5` bias never enters).

**What is simulated:** the shuffle. A browser cannot cut a physical deck. "Cut at random"
draws from `crypto.getRandomValues`, and — unlike a real dealer — the page knows the answer
it drew. The exhibit says so on screen and offers a switch that stops printing it.

**What this does NOT prove:** that a shuffle in your hands is uniform; that neither player
peeked while the cards were face down; that nobody marked a back; that both players
actually encoded the bits they claimed. Those are physical assumptions the protocol
*makes* rather than defends. **Not production cryptography** — a teaching demo of a
protocol that computes one gate for two people at the same table.

---

## Exhibits

The five exhibits are one argument, and the tab strip reads as its lesson path:
**perform it → prove it is correct → prove it is private → break the assumption →
compare the models.** A *Guided mode* control walks them in order; it is off by
default and puts your hands on the first control rather than merely selecting a tab.

1. **Perform** — the first screen *is* the trick. Two bit controls, five cards, one
   button. Reveal them, then change the cut with the cards still face up and watch the
   row move under an answer that does not. Directly below, **every cut at once**: five
   visibly different rows, one unmoved answer. The full six-step walkthrough — the
   encoding, each commitment, the dealer's heart, the cut drawn as two rings, the
   read-off — sits behind *Explain each step*, along with the glossary, the scoping
   caveats and the "play it honestly" switch that stops the page printing the cut depth.
2. **Correctness** — the permutation-group argument as a *transformation*. One row in
   the middle, five cut buttons, and two buckets that fill as you apply them; every
   result lands back in the group it started in, and you find that out by trying to make
   it not happen. The finished ten-row enumeration is behind *Show all 10 rows*, and the
   complete 4 × 5 table is recomputed live and diffed against hand-written vectors.
3. **Privacy** — the reading rule first: pick a revealed row, and see how often each of
   the three secrets that could explain it produces it. Scrub through all five and the
   three numbers stay locked at 20%. Then the full probability matrix, the pairwise
   total-variation distances, Bob's two situations kept carefully apart, and a posterior
   explorer.
4. **Break it** — the break-it-yourself exhibit, staged. First *does Bob win?* — a
   persistent uniform-dealer column beside your own. Then *which rows became the
   evidence*: the actual card rows, each labelled with what it tells an attacker, and the
   ones only one of Alice's bits can produce marked as proof. Mutual information, the
   bystander and the full table are one disclosure away, as is the derivation of why
   uniform is the *only* answer. Then **play Bob** against the computed ceiling.
5. **Compare** — attacker advantage against work spent, with the card line flat at an
   enumerated zero and the circuit line a generic κ-bit bound labelled as an
   illustration rather than a measurement. Closes with three conclusions that each point
   back at something you did on the page, an applied transfer question, where the
   research went next, and the Cipher Museum's Solitaire cipher as a contrast.

---

## When to Use It

**Use the five-card trick when** you want to demonstrate what "information-theoretically
secure" means to somebody who has only ever met computational security — it is the
shortest path from "safe because it would take too long" to "safe because there is nothing
there". It is also a genuine research object: card-based cryptography is an active field,
and this protocol is its origin point.

**Do NOT use it** for anything real. It computes one AND gate, for exactly two people, who
must be in the same room, with a deck of cards and a dealer both of them trust to cut
uniformly. It composes into nothing: the reveal destroys the commitments, so you cannot
feed the output into another gate. If you need secure computation, you need a garbled
circuit or a secret-sharing protocol — see [Related Demos](#related-demos).

**Do NOT conclude** that information-theoretic security is strictly better than
computational security. It is strictly *stronger as an assumption* and, here, bought with
a protocol that computes one bit and needs a trusted human. The trade is real in both
directions.

---

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-card-trick/**

You can:

- Set Alice's and Bob's secret bits and step through the deal, the cut and the reveal.
- Choose the cut yourself, or draw one uniformly, and confirm the answer never moves.
- Read the exact probability of every revealed row for every pair of secrets, and check
  that the three answer-0 rows are identical.
- Make the dealer sloppy and watch the guarantee collapse — including the case where the
  cut is random and useless.
- Play Bob: guess Alice's bit from the table, round after round, against a ceiling of 50%.
- Compare the whole thing with a garbled circuit as the attacker's budget grows.

---

## What Can Go Wrong

| Failure | What happens | Where you can see it |
| --- | --- | --- |
| **The cut is not uniform** | Alice's two layouts sit three cut positions apart, so the rows Bob sees are the cut distribution and the cut distribution rotated by three. They match only when the distribution is invariant under rotation by 3 — and 3 generates Z5, so only the uniform cut qualifies. | *Break it*, every preset |
| **The cut is random but lopsided** | "Random" is not the requirement. A dealer who cuts by 0 or 1, each half the time, puts Alice's 0 on two rows and her 1 on two entirely different rows: disjoint supports, one look, 100%. | *Break it*, “Lazy dealer” |
| **The cut is nearly uniform** | Not nearly secure. Covering four of the five depths evenly still lifts Bob to 62.5%. The failure is not gradual in the way a security parameter is. | *Break it*, “Almost uniform” |
| **A player peeks at a face-down card** | Total break, and the protocol has no defence at all. Its only assumption is that identical backs are indistinguishable; a peek is that assumption failing, not an attack on the maths. | Stated in-page; deliberately not modelled |
| **A player miscommits** | Encoding the wrong bit changes the answer without changing anything an observer could detect. Correctness here assumes honest placement — this is an honest-but-curious protocol, not a malicious-secure one. | Stated in-page |
| **Confusing the output with a leak** | Bob holding 1 learns Alice's bit from the answer alone. Reporting that as a protocol leak is the standard way this gets explained badly, and it would make every AND protocol look broken. | *Privacy*, the two Bob cards |

---

## Real-World Usage

Card-based cryptography is a small but live research area. den Boer's 1989 construction
started it; Mizuki, Kumamoto and Sone's four-card AND (ASIACRYPT 2012) reduced the deck, at
the cost of two shuffles instead of one — a random bisection cut of the row, then a random
cut of the middle pair; Alexander Koch's [*The Landscape of Optimal Card-based
Protocols*](https://eprint.iacr.org/2018/951) collects the card-minimal protocols, the
shuffle restrictions they need, and the lower bounds on how few cards a gate can need. The
practical uses are education, unplugged-computing outreach, and
low-tech settings where a physical procedure is more trustworthy to its participants than a
computer they cannot inspect.

The idea it teaches is not niche at all. Information-theoretic security is the security
model of the one-time pad, of Shamir secret sharing below its threshold, and of the privacy
guarantees inside several MPC protocols. Those systems are secure for the same reason this
one is: an adversary is comparing distributions that are equal, so the question of how much
computation they have never arises.

---

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-card-trick.git
cd crypto-lab-card-trick
npm install
npm run dev        # http://localhost:5173/crypto-lab-card-trick/
`​``

`​``bash
npm test           # unit tests, incl. the protocol KATs
npm run build      # typecheck + production build
npm run test:a11y  # WCAG 2.1 A/AA gate (2 themes x 2 viewports) + Chromium flows
npm run test:e2e:all   # every flow across Chromium, Firefox and WebKit
`​``

---

## Related Demos

- [crypto-lab-garbled-gate](https://systemslibrarian.github.io/crypto-lab-garbled-gate/) —
  the same job done computationally: an encrypted truth table, gate by gate.
- [crypto-lab-ot-gate](https://systemslibrarian.github.io/crypto-lab-ot-gate/) — oblivious
  transfer, the piece a garbled circuit needs to hand over the right wire label.
- [crypto-lab-otp-vault](https://systemslibrarian.github.io/crypto-lab-otp-vault/) — the
  other information-theoretically secure primitive, and the other one with an awkward key.
- [crypto-lab-shamir-gate](https://systemslibrarian.github.io/crypto-lab-shamir-gate/) —
  secret sharing, where below the threshold the shares are again *equally* consistent with
  every secret.
- [Cipher Museum: Solitaire](https://ciphermuseum.com/ciphers/solitaire.html) — a deck of
  cards used the other way round, as a hand cipher. Computationally secure, and with
  measurable biases found since.

---

## Build & Verify

**138 unit tests** (Vitest), all passing:

| File | Tests | What it checks |
| --- | --- | --- |
| `src/cards/protocol.test.ts` | 26 | Encoding is one-to-one and uses the same two cards for both bits; the cut is a Z5 action; adjacency survives every cut; the protocol computes AND for all 4 × 5 cases; the three answer-0 pairs reach identical row sets. |
| `src/cards/vectors.test.ts` | 32 | The **KATs** — all 20 rows of the protocol table plus the orbit and leakage vectors. |
| `src/cards/analysis.test.ts` | 45 | Reveal distributions, total variation, the closed form TV(w, w∘τ³), leakage in bits, posteriors, the observer's advantage, and the row-by-row evidence view — including 200 randomised distributions checking that only the uniform cut leaks nothing, and a check that the evidence rows sum back to exactly the headline advantage. |
| `src/cards/necklace.test.ts` | 15 | The orbit partition: two blocks of five, closed under the cut, constant output within a block. |
| `src/cards/shuffle.test.ts` | 20 | Rejection sampling discards the six biasing bytes; the weighted sampler never returns an unweighted depth and never silently falls back to "no cut". |

**Known-answer tests.** den Boer's protocol is physical, so no vector file exists to
download. `src/cards/vectors.ts` is the honest equivalent: the **entire** input/output
table — four input pairs × five cut depths = **20 known answers** — hand-written from the
paper's construction, importing nothing from the implementation, plus the two orbits and
four hand-derived leakage figures. The *Why It Works* exhibit re-runs that comparison in
the browser and shows the result.

**60 end-to-end flow tests** (Playwright, Chromium desktop + a mobile viewport in the
deploy gate; Firefox and WebKit in a separate workflow) assert that each exhibit renders
its result, that the leak/no-leak semantics reach the DOM, and that no exhibit scrolls the
page sideways at 320px or at 200% zoom. One of them is a layout guard with teeth: **a
complete card row and the reveal button must sit inside the first 844px of a 390px-wide
screen.** An early version of this page put the first card 2688px down — more than three
phone screens below the hero — and no amount of correctness made up for it.

**Accessibility gate.** The production build is driven the way a visitor drives it — the
guided tour started and exited, the stage cut and revealed with every bit combination and
every cut depth, the walkthrough opened by its summary and walked, the orbit applied from
both starting groups, every dealer preset plus a hand-built distribution, both answers of
the guessing game, the chart moved across its crossover at every security parameter, and
every exit question and the matching task answered wrong and then right — and **scanned
after every single step**, in both themes at 1280px and 380px. Tabs are switched (including
by ArrowRight on the tablist), never un-hidden; disclosures are opened by their summaries;
and nothing is injected into the page, so the lab's own `prefers-reduced-motion` block is
exercised rather than bypassed. `violations` is not the whole oracle — the gate also fails
on axe's `incomplete` bucket, on an arithmetic composite-aware contrast measurement that
covers the SVG chart's own glyphs (they live inside a `role="img"`, where axe's contrast
rule never looks), on text-control border contrast (WCAG 1.4.11), on any scrolling region
with no keyboard route, on any horizontal document overflow, and on any visible text left
at `opacity: 0`. The GitHub Pages deploy is blocked if it fails. State is never
carried by colour alone — every verdict is icon + word + colour, every card shows its pip
glyph and an off-screen suit name, and the comparison chart's two series differ in dash
pattern and carry direct labels as well as hue.

**Numerical presentation.** The protocol states, the ten rows and the twenty known
answers are discrete and exact. The probabilities and information figures on screen are
IEEE-754 floating point, and the page treats magnitudes below 1e-12 as zero so display
noise never reads as a leak. That tolerance is a presentation detail — it is not a
security parameter, and the protocol has none.

**Performance.** Nothing here is expensive: the state space is 10 rows × 5 cuts, so every
table, posterior and leakage figure is an exact enumeration computed in well under a
millisecond. There is no sampling anywhere on the page except the guessing game's dealt
rounds, which are single draws from the CSPRNG.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## DNSSEC Chain

- **slug**: `crypto-lab-dnssec-chain`
- **repo**: https://github.com/systemslibrarian/crypto-lab-dnssec-chain
- **live**: https://systemslibrarian.github.io/crypto-lab-dnssec-chain/
- **commit_sha**: `cd37833dfe1ebfb30711086556f36b79208cae73` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `538cf12fe26bb61b9f7fbef2c13a66de18fbbaab`
- **read_from**: working tree (clean)
- **category**: PROTOCOLS  ·  **level**: beginner  ·  **--accent**: #9f88ff
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: DNSSEC Chain  — _read from src/ui/app.ts_

**Subtitle**: Authenticated denial · RFC 4034 · RFC 5155  — _read from src/ui/app.ts_

**Description**: Validates a real chain from the IANA root trust anchor to a signed answer, then turns NSEC’s proof that a name does not exist into a complete list of the names that do.  — _read from src/ui/app.ts_

**Why it matters**: DNS decides where your traffic goes before any certificate is checked. DNSSEC is the second trust hierarchy that answers for it — and the proofs it uses to say “no” were what let anyone read a private zone out of a public nameserver.  — _read from src/ui/app.ts_

**Card copy**: The PKI that has to sign statements about names which do not exist. Validate a real captured chain from the IANA anchor, then walk an NSEC3 zone the denial proofs gave away.

**Chips**: DNSSEC · NSEC3 · RRSIG · Zone Walking

**Implements**: ECDSA `src/dnssec/crypto.ts:221`, Ed25519 `src/dnssec/crypto.ts:244`, Ed448 `src/vectors/rfc.ts:88`, P-256 `src/dnssec/crypto.ts:160`, RSA `src/dnssec/crypto.ts:78`, SHA-1 `src/dnssec/crypto.ts:51`, SHA-256 `src/dnssec/crypto.ts:53`, SHA-384 `src/dnssec/crypto.ts:55`

**Attacks shown**: Dictionary attack `src/ui/panels/nsec3.ts:143`

**Comment-only (named in code comments, not executed)**: EdDSA `src/dnssec/crypto.ts:104`, MD5 `src/dnssec/keytag.ts:34`, P-384 `src/ui/panels/break.ts:18`

**References**: Encrypted Client Hello, Kerberos, MD5, Merkle tree, P-384, RSA-OAEP, SAML 2.0, SHA-512

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 1035` — first seen README.md:172 (3×)
- `RFC 2606` — first seen src/ui/app.ts:99 (2×)
- `RFC 3110` — first seen src/dnssec/crypto.ts:21 (3×)
- `RFC 3597` — first seen src/dns/rdata.ts:453 (4×)
- `RFC 3755` — first seen src/dns/rdata.ts:217 (1×)
- `RFC 4033` — first seen README.md:28 (6×)
- `RFC 4034` — first seen README.md:19 (37×)
- `RFC 4035` — first seen README.md:24 (22×)
- `RFC 4470` — first seen README.md:27 (7×)
- `RFC 4648` — first seen src/dns/codec.ts:5 (2×)
- `RFC 5011` — first seen README.md:121 (1×)
- `RFC 5155` — first seen README.md:25 (18×)
- `RFC 5737` — first seen src/ui/app.ts:99 (1×)
- `RFC 6605` — first seen README.md:48 (5×)
- `RFC 6781` — first seen README.md:29 (1×)
- `RFC 6840` — first seen README.md:23 (12×)
- `RFC 6895` — first seen src/attack/walk.ts:31 (1×)
- `RFC 6944` — first seen src/dnssec/keytag.ts:38 (1×)
- `RFC 7129` — first seen README.md:39 (3×)
- `RFC 8080` — first seen README.md:41 (5×)
- `RFC 8901` — first seen README.md:39 (1×)
- `RFC 9276` — first seen README.md:39 (6×)
- `RFC 9849` — first seen README.md:159 (2×)

**README — What Can Go Wrong**:

```text
The failure modes this lab reproduces, and what each one actually is in the wild:

| Failure | What happened | Real-world cause |
| --- | --- | --- |
| `DS_MISMATCH` | The parent's fingerprint does not hash to the key the child served | A key was rolled and the DS at the registrar was not updated. The most common way a real domain goes dark. |
| `RRSIG_EXPIRED` | The signature's expiration is behind the validator's clock | A re-signing job stopped running, or a zone was frozen. Nothing is wrong with the maths. |
| `RRSIG_NOT_YET_VALID` | The inception is ahead of the validator's clock | Usually the *validator's* clock, not the zone's. A device with no working time source cannot validate DNSSEC at all. |
| `KEYTAG_MISMATCH` | No key in the zone claims to be the signer | A DS pointing at a removed key, or a resolver holding a cached DS from before a KSK roll. |
| `SIGNER_NAME_MISMATCH` | A neighbouring zone signed these records | Rejecting this is what stops any zone speaking for any other. |
| `SIGNATURE_INVALID` | The bytes offered are not the bytes signed | An on-path attacker rewriting an answer — the only entry here that is genuinely an attack rather than an operational mistake. |
| `NSEC_PROOF_INVALID` | The denial does not span the name it claims to deny | A validator that skipped the interval check would accept a forged NXDOMAIN built from any valid NSEC in the zone. |
| `ALG_UNSUPPORTED` | This validator cannot judge a real algorithm | Reported separately, and deliberately: reporting it as a forgery blames the zone for the validator's gap. |
| `INSECURE` | The parent proved there is no DS | **Not a failure.** The chain ended legitimately. |

Three that are subtler, and are called out in the page rather than smoothed over:

- **Opt-Out weakens what a covering NSEC3 proves.** With the flag set, an unsigned delegation may sit inside a covered gap with no record of its own. That is what keeps `.com`'s NSEC3 chain proportional to the number of *signed* domains — and it means a covering record proves less than it appears to.
- **Online signing trades one risk for another.** Minimally covering denial removes the enumeration problem by putting a private key on an internet-facing server and making every denial a signature operation. That is the property offline signing existed to avoid, and it makes a query-flood into a signature-flood.
- **The wildcard half of an NXDOMAIN proof is not optional.** A denial that shows only a covering NSEC, without also showing that no wildcard could have answered, lets an attacker turn a real wildcard answer into a forged NXDOMAIN. This lab checks both halves and shows both.

---
```

**Claims tested** (e2e/claims.spec.ts, 24 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:34
    - :34 `toHaveAttribute` expected `'data-status', 'SECURE'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:39
    - :39 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:43
    - :43 `toHaveAttribute` expected `attribute, 'pending'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:53
    - :53 `toHaveAttribute` expected `'data-state', 'complete'` _(expression)_
- `the walk transcript links up: every row starts where the previous one pointed` — e2e/claims.spec.ts:58
    - :64 `toHaveAttribute` expected `'data-complete', 'true'` _(expression)_
    - :69 `expect` expected _no expected value_ _(none)_
    - :79 `toBe` expected _no expected value_ _(none)_
    - :85 `toBe` expected `parsed[0]?.discovered` _(expression)_
    - :86 `toBe` expected `'demo.example.'` _(literal)_
    - :90 `toBe` expected `names.length` _(expression)_
    - :95 `toBe` expected `parsed.length` _(expression)_
    - :96 `toBe` expected `parsed.length` _(expression)_
    - :100 `expect` expected _no expected value_ _(none)_
    - :101 `expect` expected _no expected value_ _(none)_
- `unguessable names are recovered by the walk exactly as completely` — e2e/claims.spec.ts:104
    - :108 `toHaveAttribute` expected `'data-found', '0'` _(expression)_
    - :110 `toHaveAttribute` expected `'data-complete', 'true'` _(expression)_
    - :115 `expect` expected _no expected value_ _(none)_
- `the digest the page computes equals the digest IANA publishes` — e2e/claims.spec.ts:120
    - :128 `expect` expected _no expected value_ _(none)_
    - :138 `toHaveLength` expected `2` _(literal)_
    - :143 `toBe` expected `parentPublished` _(expression)_
    - :145 `expect` expected _no expected value_ _(none)_
    - :146 `toHaveCount` expected `1` _(literal)_
- `the per-run octet counts add up to the total the signature check reports` — e2e/claims.spec.ts:151
    - :162 `expect` expected _no expected value_ _(none)_
    - :171 `expect` expected _no expected value_ _(none)_
    - :172 `toBe` expected `stated` _(expression)_
    - :177 `toBe` expected `lengths.length - 1` _(expression)_
- `each break produces the failure the page said it would` — e2e/claims.spec.ts:182
    - :188 `expect` expected _no expected value_ _(none)_
    - :200 `toBe` expected `expected` _(expression)_
    - :203 `toHaveCount` expected `0` _(literal)_
    - :204 `toHaveAttribute` expected `'data-status', 'SECURE'` _(expression)_
    - :209 `toBe` expected `expected` _(expression)_
    - :213 `toMatch` expected `/RFC \d{4}/` _(regex)_
- `an unsupported algorithm is INDETERMINATE, never a forgery` — e2e/claims.spec.ts:218
    - :226 `toHaveAttribute` expected `'data-failure', 'ALG_UNSUPPORTED'` _(expression)_
    - :227 `toHaveAttribute` expected `'data-status', 'INDETERMINATE'` _(expression)_
    - :229 `toContainText` expected `'SIGNATURE_INVALID'` _(literal)_
- `INSECURE carries no failure code; the same delegation without a proof is BOGUS` — e2e/claims.spec.ts:234
    - :242 `toHaveAttribute` expected `'data-status', 'INSECURE'` _(expression)_
    - :243 `toHaveCount` expected `0` _(literal)_
    - :244 `toHaveCount` expected `0` _(literal)_
    - :249 `toHaveAttribute` expected `'data-status', 'INSECURE'` _(expression)_
    - :250 `toHaveCount` expected `0` _(literal)_
    - :258 `toHaveAttribute` expected `'data-status', 'BOGUS'` _(expression)_
    - :259 `toHaveCount` expected `0` _(literal)_
- `the recovery rate, the chips and the hash count all agree` — e2e/claims.spec.ts:264
    - :280 `toBe` expected `rate` _(expression)_
    - :285 `toBe` expected `rate` _(expression)_
    - :290 `toHaveCount` expected `recovered` _(expression)_
    - :291 `toHaveCount` expected `zoneNames - recovered` _(expression)_
    - :294 `toBe` expected `candidates * (iterations + 1)` _(expression)_
    - :298 `expect` expected _no expected value_ _(none)_
    - :299 `expect` expected _no expected value_ _(none)_
    - :303 `expect` expected _no expected value_ _(none)_
    - :304 `toMatch` expected `/\.demo\.example\.$/` _(regex)_
- `adding 150 iterations changes the cost and not the recovered set` — e2e/claims.spec.ts:307
    - :316 `toHaveAttribute` expected `'data-iterations', '150'` _(expression)_
    - :321 `toEqual` expected `[...before].sort()` _(expression)_
    - :323 `toBe` expected `hashesBefore * 151` _(expression)_
- `high-entropy labels recover nothing, and the page says why` — e2e/claims.spec.ts:326
    - :332 `toHaveAttribute` expected `'data-rate', '0'` _(expression)_
    - :333 `toHaveCount` expected `0` _(literal)_
    - :335 `toContainText` expected `'a statement about the names, not about NSEC3'` _(literal)_
- `the page states the NSEC3 claim in the direction that is true` — e2e/claims.spec.ts:338
    - :345 `toContainText` expected `'replaces trivial walking with an offline guessing problem'` _(literal)_
    - :346 `toContainText` expected `'Predictable labels remain recoverable despite added iterations'` _(literal)_
    - :349 `expect` expected _no expected value_ _(none)_
    - :350 `expect` expected _no expected value_ _(none)_
- `changing the clock retires the previous verdict and names the new instant` — e2e/claims.spec.ts:355
    - :363 `expect` expected _no expected value_ _(none)_
    - :364 `toHaveAttribute` expected `'data-status', 'SECURE'` _(expression)_
    - :365 `toHaveCount` expected `0` _(literal)_
    - :371 `toHaveAttribute` expected `'data-status', 'BOGUS'` _(expression)_
    - :372 `toHaveCount` expected `0` _(literal)_
    - :375 `toBe` expected `firstStamp` _(expression)_
    - :376 `expect` expected _no expected value_ _(none)_
    - :377 `toContainText` expected `'RRSIG_EXPIRED'` _(literal)_
- `re-selecting the same clock does not change a fresh verdict` — e2e/claims.spec.ts:380
    - :386 `toBe` expected `before` _(expression)_
    - :387 `toHaveAttribute` expected `'data-status', 'SECURE'` _(expression)_
    - :388 `toHaveCount` expected `0` _(literal)_
- `a hidden tabpanel really is hidden, and really is empty` — e2e/claims.spec.ts:393
    - :403 `toEqual` expected `[]` _(expression)_
    - :408 `expect` expected _no expected value_ _(none)_
- `NEG-1: the page claims no confidentiality, and its own capture is the evidence` — e2e/claims.spec.ts:414
    - :421 `toContainText` expected `'never confidentiality'` _(literal)_
    - :422 `toContainText` expected `'travel in the clear'` _(literal)_
    - :432 `expect` expected _no expected value_ _(none)_
    - :433 `expect` expected _no expected value_ _(none)_
    - :435 `toMatch` expected `/\bIN\s+A\s+\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/` _(regex)_
    - :437 `expect` expected _no expected value_ _(none)_
    - :441 `expect` expected _no expected value_ _(none)_
    - :442 `expect` expected _no expected value_ _(none)_
- `the ECH cross-link is stated as a protection, not as a dependency` — e2e/claims.spec.ts:445
    - :448 `toContainText` expected `'It is not.'` _(literal)_
    - :449 `toContainText` expected `'without requiring any verifiable authenticity or provenance'` _(literal)_
    - :450 `toContainText` expected `'an available protection for the ECHConfig, not the source of its authenticity'` _(literal)_
    - :453 `expect` expected _no expected value_ _(none)_
    - :454 `expect` expected _no expected value_ _(none)_
- `every rollover stage stays SECURE, and the key counts are what the stage means` — e2e/claims.spec.ts:459
    - :475 `toHaveAttribute` expected `'data-status', 'SECURE'` _(expression)_
    - :476 `toHaveAttribute` expected `'data-keys', keys` _(expression)_
    - :477 `toHaveAttribute` expected `'data-signatures', signatures` _(expression)_
    - :482 `toHaveCount` expected `Number(keys)` _(expression)_
    - :485 `toHaveCount` expected `1` _(literal)_
    - :495 `toHaveAttribute` expected `'data-status', 'BOGUS'` _(expression)_
- `the synthesized denial is shown as a trade, with its citations checked` — e2e/claims.spec.ts:500
    - :503 `toHaveAttribute` expected `'data-style', 'synthesized'` _(expression)_
    - :505 `toHaveAttribute` expected `'data-rcode', 'NOERROR'` _(expression)_
    - :507 `toHaveAttribute` expected `'data-nxproof', 'false'` _(expression)_
    - :510 `toContainText` expected `'private key lives on a machine that answers the internet'` _(literal)_
    - :514 `toHaveCount` expected `1` _(literal)_
    - :515 `toHaveCount` expected `1` _(literal)_
    - :518 `expect` expected _no expected value_ _(none)_
- `the page says what it is not` — e2e/claims.spec.ts:525
    - :528 `toContainText` expected `'Not production crypto'` _(literal)_
    - :529 `toContainText` expected `'teaching demo'` _(literal)_
    - :530 `toContainText` expected `'pinned capture'` _(literal)_
    - :531 `toContainText` expected `'What it does NOT prove'` _(literal)_
    - :533 `toContainText` expected `'private keys are published in the repository on purpose'` _(literal)_
- `the separate dated root rollover validates with KSK-2024` — e2e/claims.spec.ts:536
    - :540 `toHaveAttribute` expected `'data-status', 'SECURE'` _(expression)_
    - :541 `toHaveAttribute` expected `'data-signer', '38696'` _(expression)_
    - :542 `expect` expected _no expected value_ _(none)_
    - :544 `toContainText` expected `'root-only capture'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# DNSSEC Chain

Authenticated denial of existence, and the trust hierarchy it hangs off — in the browser, with real cryptography and a real captured chain.

**Live demo:** https://systemslibrarian.github.io/crypto-lab-dnssec-chain/

---

## What It Is

A browser demo of DNSSEC validation, built around the mechanism that makes DNSSEC unlike any other PKI: **it has to sign statements about names that do not exist.**

DNS is a second trust hierarchy, entirely separate from the X.509 world your browser uses for TLS. It shares no keys, no certificate authorities and no revocation machinery with it. Its root of trust is a small set of key fingerprints published by IANA and compiled into resolvers, and from there every zone vouches for its child by publishing a hash of the child's key. This lab validates that hierarchy for real, and then shows what its denial proofs give away.

**The exact primitives.**

| Piece | What it is | Where it is specified |
| --- | --- | --- |
| `DNSKEY` | A zone's public key, with a flags field distinguishing key-signing from zone-signing keys | RFC 4034 §2 |
| Key tag | A 16-bit checksum over the DNSKEY RDATA — a lookup hint, never an authenticator | RFC 4034 Appendix B, as corrected by [Errata 4552](https://www.rfc-editor.org/errata/eid4552) |
| `DS` | The parent's fingerprint of the child's key: `H(child apex ‖ DNSKEY RDATA)` | RFC 4034 §5.1.4 |
| `RRSIG` | A signature over `RRSIG_RDATA ‖ RR(1) ‖ RR(2) …` in canonical form | RFC 4034 §3.1.8.1, §6 |
| Canonical form | Down-cased owner names and the ORIGINAL TTL (§6.2, as corrected by RFC 6840 §5.1); RDATA sorted as unsigned octets (§6.3) | RFC 4034 §6.2, §6.3 |
| `NSEC` | Proof a name is absent, by naming the next name that is present | RFC 4034 §4, RFC 4035 §5.4 |
| `NSEC3` | The same chain over SHA-1 hashes of the names, with a salt and an iteration count | RFC 5155 |
| Opt-Out | An NSEC3 flag letting a signer skip unsigned delegations entirely | RFC 5155 §6 |
| Minimally covering NSEC | Denial synthesized per query, with an online signing key | RFC 4470 (Standards Track) |
| Validator outcomes | Secure · Insecure · Bogus · Indeterminate | RFC 4033 §5, RFC 4035 §5 |
| Rollover | Pre-publish and double-signature key replacement | RFC 6781 §4.1.1.1, §4.1.1.2 |

**The algorithms.** RSASHA256 (8) and ECDSAP256SHA256 (13) are verified with WebCrypto; ED25519 (15) with [`@noble/curves`](https://github.com/paulmillr/noble-curves). Algorithm 8 is implemented because **the DNS root signs with it** — without it, the pinned real-world chain could not be validated from its own trust anchor, and the lab would be teaching against a chain it had quietly replaced. Every other real DNSSEC algorithm is reported as `ALG_UNSUPPORTED` — a statement about this validator, never a forgery accusation. Ed25519 comes from a library rather than WebCrypto because WebCrypto's Ed25519 support arrived late and is still not present in every browser a learner might open this page in.

**The security model.** DNSSEC gives you **origin authentication and data integrity** for DNS records, and nothing else. It does not encrypt anything, it does not tell you whether an answer is the one you wanted, and it does not vouch for the honesty of the zone operator. A `SECURE` verdict here means exactly: *these records verified under these keys at this instant, along an unbroken chain from a configured anchor.*

**Not production crypto — a teaching demo.** The cryptography is genuine and the known-answer tests are the specifications' own, but nothing here is a resolver. There is no caching, no network, no transport security, no query minimisation, and no attempt at the operational hardening a real validator needs.

**Prior art and correct citations.** Three of the citations most often attached to this subject are wrong, and this lab names them rather than repeating them:

- **RFC 8901 is not a reference for enumeration defences.** It specifies multi-signer DNSSEC models — running one zone across several DNS providers — and touches enumeration only in two passing sentences that point elsewhere for the definitions. The correct anchors are **RFC 5155** (NSEC3, normative; §12.1.1 is its own account of dictionary attacks), **RFC 4470** (minimally covering NSEC and on-line signing, Standards Track, April 2006), **RFC 7129** (authenticated denial of existence; Informational, Independent Submission, February 2014 — its Appendix B is where "NSEC3 white lies" is defined) and **RFC 9276** (BCP 236, August 2022, the NSEC3 parameter guidance).
- **"NSEC black lies" has no RFC.** The NODATA-style synthesized denial the sixth exhibit captures is specified only in an Internet-Draft, `draft-valsorda-dnsop-black-lies`. The published anchor for the technique it derives from is RFC 4470.
- **RFC 8080's published Section 6 does not verify.** Its Ed25519 examples print `RRSIG MX 3 3600 …` with the algorithm field missing, and the accompanying signatures do not check out. This repository uses the text from **Verified Errata 4935** (Tom Thorogood, verified 2017-02-16) instead; the correction is flagged at the top of `src/vectors/rfc.ts`. Taking the published text at face value would have produced a test that "proved" the Ed25519 path by failing to parse it.

---

## Exhibits

1. **Build the chain** — the pinned real-world chain, root zone → `.com` → `cloudflare.com` → an A record, each link checked on its own. The trust anchors are IANA's published root KSK fingerprints; the digest the page computes from the DNSKEY records the root actually served is shown beside the digest IANA publishes. A clock control moves the validation instant forward and backward, because DNSSEC validity is wall-clock and a bad clock is a real outage.
2. **Break each link** — nine states against a hierarchy signed in the page, with real keys. Each break is made by **signing something wrong and re-signing the zone**, not by corrupting bytes, so a stale DS fingerprint reports `DS_MISMATCH` rather than a generic signature failure. The unsupported-algorithm case is not synthesized at all: it runs RFC 6605's own ECDSA P-384 example, a real and valid signature this lab does not implement.
3. **No DS: insecure** — `.com`'s real answer for `google.com`, an unsigned domain, resting on an Opt-Out NSEC3. The chain reaches `.com`, verifies, and correctly **ends**. Beside it, the same delegation with the proof removed as well, which is `BOGUS`. The distinction is routinely got backwards and it is not a nuance: `INSECURE` is a normal answer a resolver returns, `BOGUS` is a `SERVFAIL`.
4. **Walk the zone** — the headline mechanism. Each button press sends one ordinary query for a type nothing in the zone has, gets back one genuinely valid signed denial, and reads the next existing name out of it. Repeat and the zone falls out; the ring closes when the chain wraps back to the apex, which is the proof nothing was missed. Switch the zone to twelve-random-character labels and the walk recovers them exactly as completely — the record *names* them. A second control offers a valid NSEC as proof for a name it does not cover, and watches the validator reject it.
5. **NSEC3 guessing** — the same attack run twice on the same construction, varying only whether the names are guessable. Reports a **recovery rate against a stated candidate list** rather than a verdict. Controls for iterations (0–150) and salt let you check RFC 9276's claim yourself: the recovered set is identical at 150 iterations, for 151× the work.
6. **Denial on demand** — the captured Cloudflare answer for a name that does not exist, which is `NOERROR` with an NSEC whose next owner is the queried name with a single NUL octet prepended: RFC 4470's increment function applied to the query. Nothing to walk to — at the price of a signing key on an internet-facing server.
7. **Key rollover** — pre-publish and double-signature, every intermediate state validated, plus the failure that actually takes domains offline: a resolver's cached DS outliving the key it points at.

---

## When to Use It

**Use DNSSEC when** you need the *origin* of DNS data authenticated: to make DANE/TLSA records meaningful, to stop cache-poisoning and off-path spoofing, to let a resolver reject forged answers rather than trust whoever replied first, or to publish anything (SSHFP, OPENPGPKEY, a DS for a child) whose whole value depends on it not having been substituted.

**Use NSEC3 when** you are signing offline and can tolerate an offline guessing problem in place of a trivial walk — and follow RFC 9276: `1 0 0 -`, meaning SHA-1, no extra iterations, no salt. Anything more costs your own servers far more than it costs an attacker.

**Use minimally covering denial (RFC 4470) when** enumeration genuinely matters and you can accept an online signing key and a signature per denial.

**Do NOT use DNSSEC for confidentiality.** It provides none. Queries and answers travel in the clear whether or not they validate — that is what DNS-over-HTTPS, DNS-over-TLS and DNS-over-QUIC are for, and they are orthogonal mechanisms solving a different problem.

**Do NOT rely on NSEC3 to hide internal hostnames.** Publishing `vpn-admin.internal.example.com` in a signed zone and assuming the hashing conceals it is the mistake this lab's fifth exhibit exists to make concrete. Hashes are handed out on request, the parameters come with them, and predictable labels fall to an ordinary wordlist.

**Do NOT read `INSECURE` as an attack.** Most of the DNS is unsigned. Treating a correctly-proved unsigned delegation as a failure trains people to ignore the real ones.

---

## Live Demo

https://systemslibrarian.github.io/crypto-lab-dnssec-chain/

Everything runs in your browser. There is no backend, nothing is sent anywhere, and no DNS query is made at run time — the real-world chain is a capture committed to this repository. Things you can do:

- Validate the real root → `.com` → `cloudflare.com` chain and open each link's actual compared bytes.
- Move the validation clock past every expiration and watch the chain go `BOGUS` with a named cause.
- Break a delegation eight different ways and watch the validator name each cause specifically — seven distinct codes, because two of the eight are genuinely the same failure arrived at from opposite ends (a DS pointing at a key the child never had, and a child that stopped using the key the DS points at).
- Enumerate a signed zone one query at a time, from its denial proofs alone.
- Run a dictionary attack against the same zone's NSEC3 hashes, twice, and compare the recovery rates.

---

## What Can Go Wrong

The failure modes this lab reproduces, and what each one actually is in the wild:

| Failure | What happened | Real-world cause |
| --- | --- | --- |
| `DS_MISMATCH` | The parent's fingerprint does not hash to the key the child served | A key was rolled and the DS at the registrar was not updated. The most common way a real domain goes dark. |
| `RRSIG_EXPIRED` | The signature's expiration is behind the validator's clock | A re-signing job stopped running, or a zone was frozen. Nothing is wrong with the maths. |
| `RRSIG_NOT_YET_VALID` | The inception is ahead of the validator's clock | Usually the *validator's* clock, not the zone's. A device with no working time source cannot validate DNSSEC at all. |
| `KEYTAG_MISMATCH` | No key in the zone claims to be the signer | A DS pointing at a removed key, or a resolver holding a cached DS from before a KSK roll. |
| `SIGNER_NAME_MISMATCH` | A neighbouring zone signed these records | Rejecting this is what stops any zone speaking for any other. |
| `SIGNATURE_INVALID` | The bytes offered are not the bytes signed | An on-path attacker rewriting an answer — the only entry here that is genuinely an attack rather than an operational mistake. |
| `NSEC_PROOF_INVALID` | The denial does not span the name it claims to deny | A validator that skipped the interval check would accept a forged NXDOMAIN built from any valid NSEC in the zone. |
| `ALG_UNSUPPORTED` | This validator cannot judge a real algorithm | Reported separately, and deliberately: reporting it as a forgery blames the zone for the validator's gap. |
| `INSECURE` | The parent proved there is no DS | **Not a failure.** The chain ended legitimately. |

Three that are subtler, and are called out in the page rather than smoothed over:

- **Opt-Out weakens what a covering NSEC3 proves.** With the flag set, an unsigned delegation may sit inside a covered gap with no record of its own. That is what keeps `.com`'s NSEC3 chain proportional to the number of *signed* domains — and it means a covering record proves less than it appears to.
- **Online signing trades one risk for another.** Minimally covering denial removes the enumeration problem by putting a private key on an internet-facing server and making every denial a signature operation. That is the property offline signing existed to avoid, and it makes a query-flood into a signature-flood.
- **The wildcard half of an NXDOMAIN proof is not optional.** A denial that shows only a covering NSEC, without also showing that no wildcard could have answered, lets an attacker turn a real wildcard answer into a forged NXDOMAIN. This lab checks both halves and shows both.

---

## Real-World Usage

The root zone has been signed since July 2010. `.com` and `.net` are signed and, since Verisign's migration, sign with ECDSA P-256 (algorithm 13) — you can read both facts straight off the capture in `src/vectors/pinned-chain.txt`. Sweden's `.se` was the first signed TLD (2005); most ccTLDs and all new gTLDs are signed today. Second-level adoption is far patchier, which is exactly why `INSECURE` is the normal outcome rather than an exceptional one.

The techniques this lab shows are all deployed:

- **Zone walking** is why NSEC3 exists at all; RFC 7129 §3.4 describes it as defeating attempts to administratively block zone transfers.
- **NSEC3 with Opt-Out** is what the large TLDs use, for the reason above.
- **Minimally covering denial** is deployed at scale by Cloudflare — the capture in this repository is a real one — and is why a nonexistent name under `cloudflare.com` answers `NOERROR` rather than `NXDOMAIN`.
- **RFC 9276's guidance** (zero iterations, no salt) came out of measurements showing that high iteration counts were a denial-of-service vector against the servers using them, with no meaningful gain against enumeration.
- **KSK rollover** was performed on the root itself in October 2018, moving from KSK-2010 to KSK-2017 — an operation planned over years precisely because of the cached-DS problem the seventh exhibit reproduces. [IANA’s status](https://www.iana.org/dnssec/files), checked 12 October 2026, records the **11 October 2026 rollover to KSK-2024 (tag 38696)**. KSK-2017 (20326) no longer signs but remains a valid trust anchor in post-publication. Revocation is scheduled for 11 January 2027 and removal for 22 March 2027; follow resolver-vendor/RFC 5011 update guidance. Both published anchors remain configured here. The historical full chain is preserved; the rollover panel separately validates a root-only Google Public DNS capture dated 12 October 2026, with a genuine KSK-2024 signature, at its own capture instant. Resolver AD is not used as cryptographic evidence. Validation tries all matched anchor/DS keys and signatures; a key-tag collision alone never establishes trust.

---

## How to Run Locally

`​``bash
npm install
npm run dev        # http://localhost:5173/crypto-lab-dnssec-chain/
`​``

`​``bash
npm test           # unit + known-answer tests (Vitest)
npm run build      # typecheck (src and e2e) + production build
npm run test:a11y  # axe WCAG 2.1 A/AA gate against the production build
npm run test:claims # the page-tells-the-truth suite
`​``

The Playwright suites need a browser once:

`​``bash
npx playwright install chromium
`​``

To re-take the real-world capture (it is committed, and the lab validates it at the instant it was taken, so this is never necessary — only useful if you want a fresher one):

`​``bash
npm run capture    # scripts/capture-chain.sh -> src/vectors/pinned-chain.txt
`​``

---

## Related Demos

- **[PKI Chain](https://systemslibrarian.github.io/crypto-lab-pki-chain/)** — the *other* trust hierarchy. X.509 certificate chains, trust stores and Certificate Transparency. Reading the two side by side is the point: same idea, entirely disjoint infrastructure, and DNSSEC's hierarchy is the one that answers first.
- **[Chain of Trust](https://systemslibrarian.github.io/crypto-lab-chain-of-trust/)** — the general shape of delegated trust, without the DNS specifics.
- **[Time Trust](https://systemslibrarian.github.io/crypto-lab-time-trust/)** — why a wrong clock is a security failure. `RRSIG_NOT_YET_VALID` in the second exhibit is that lab's thesis with a DNS accent.
- **[Merkle Proofs](https://systemslibrarian.github.io/crypto-lab-merkle-proofs/)** and **[Accumulator](https://systemslibrarian.github.io/crypto-lab-accumulator/)** — the other ways to prove *non*-membership. An accumulator answers "not in the set" with a constant-size proof; NSEC answers it by naming the neighbours, and that difference is the whole of the fourth exhibit.
- **[Blind Hello](https://systemslibrarian.github.io/crypto-lab-blind-hello/)** — Encrypted ClientHello. The honest cross-link, stated on this page too: RFC 9849 §10.2 specifies that ECH delivers its configuration through SVCB/HTTPS records *without requiring any verifiable authenticity or provenance information*, and names DNSSEC and encrypted DNS transport as two separate defences against DNS tampering. DNSSEC is an available protection for the ECHConfig, **not** the source of ECH's authenticity — that comes from the TLS certificate for the configuration's public name.

---

## Build & Verify

**132 unit tests pass** (Vitest), across six files. The ones that decide whether anything else means something:

- `src/dnssec/kat.test.ts` — **38 known-answer tests against the specifications.** Key tags from RFC 4034 §5.4 (60485), RFC 6605 (55648, 10771), RFC 8080 (3613, 35217, 9713) and RFC 5155 Appendix A (40430, 12708). DS digests in SHA-1, SHA-256 and SHA-384 from those same sections. All twelve hashed owner names from RFC 5155 Appendix A, plus coverage and wrap-around against three NSEC3 records from that same appendix. And the three that exercise the whole canonicalisation pipeline at once: **RFC 6605 §6.1's ECDSA P-256 signature and both of RFC 8080 §6.1's Ed25519 signatures verify** over signed data this repository assembles from scratch — one wrong TTL, one label left uppercase or one RDATA out of order and none of them would.
- `src/dnssec/realworld.test.ts` — **Tests against the pinned captures.** The full root → `.com` → `cloudflare.com` chain validates from IANA's anchors, across two signing algorithms; the key tags and DS digests this repository computes from the root's served DNSKEY records reproduce the digests IANA publishes; `.com`'s real Opt-Out proof for `google.com` reaches `INSECURE`; and Cloudflare's synthesized denial is checked to be what it claims to be.
- `src/dnssec/downgrade.test.ts` — **18 tests that attack the CLASSIFICATION rather than the cryptography.** None of them forges a signature; each tries to make the validator reach a weaker verdict than the evidence supports. Two unrelated Ed25519 keys with a deliberately collided key tag (found in 406 tries — a tag is a 16-bit checksum) are published side by side and the DNSKEY set is signed with the wrong one; a denial from one zone is offered for a name in another; a child's own apex record is offered as proof that its delegation is unsigned; an unsigned no-DS proof is offered to end a chain at `INSECURE`. Every one is rejected, and the reason is checked.
- `src/zone/demo.test.ts` — 24 tests over a hierarchy signed in-process: every RRset it signs is verified back cryptographically (including the whole NSEC chain), a wildcard answer is signed and re-verified through the Labels reconstruction, every named failure, both `INSECURE` shapes, both denial styles, and all four rollover stages.
- `src/attack/attack.test.ts` — 13 tests pinning the two enumeration results, including that 150 extra NSEC3 iterations recover *exactly the same set* for 151× the hashing.
- `src/dns/name.test.ts` — 20 tests on names and character-strings, including the canonical-order example printed in RFC 4034 §6.1 and the `\DDD` escape rule from RFC 1035 §5.1.

**Vector files.** `src/vectors/rfc.ts` (RFC 4034 §5.4, RFC 5155 Appendix A, RFC 6605 §6.1–6.2, RFC 8080 §6.1–6.2 with errata 4935 applied, plus IANA's root anchors), `src/vectors/pinned-chain.txt` (the historical `dig` capture, verbatim), `src/vectors/root-rollover-2026.txt` (dated root-only resolver capture with provenance), `src/vectors/root-anchors.xml` (as fetched from `data.iana.org`), `src/vectors/demo-keys.ts` (published teaching keys).

**The accessibility gate.** `npm run build && npm run test:a11y` must pass with zero violations. It scans the *production build* served by `vite preview`, driving the real controls through about fifty states — every panel, every break, every rollover stage, the walk at zero/one/complete, the dictionary run on both label sets, every disclosure, three hover states and two focus rings — at 1280px and again at 380px. It asserts axe's `incomplete` bucket as well as its `violations` array, computes contrast arithmetically over composited backdrops (including `aria-hidden` text, which both axe and the default walk skip), measures WCAG 1.4.11 non-text contrast per border side against a ratchet baseline that is **empty**, and checks reflow, keyboard-reachable scrollers and focusable-but-invisible controls — none of which axe has a rule for. It found **three real defects** in its first three runs — an `aria-label` on a role-less `<pre>` (which axe files under `incomplete`, where a violations-only gate never looks), an explicit `role="list"` on a list that can render empty, and a WCAG 1.4.10 reflow failure at 380px caused by a missing `box-sizing` reset. All three are fixed in the source; the baseline is empty.

It has also been mutation-checked itself, which is the only way to know a gate is looking: degrading `--text-dim` from 10.7:1 to 1.9:1 makes it fail with **153 named findings across the drive** — each giving the measured ratio, the required ratio, the element, the composited foreground and background, and the text — while the build still succeeds and the bundle hash changes. A gate that stayed green there would be worth nothing.

**The claims suite.** `npm run test:claims` checks that the page tells the truth: the walk transcript is re-linked from the rendered text alone, the digest the page computes is compared against the digest IANA publishes, the signed-octet runs are summed and checked against the total the signature line states, every break is checked to produce the failure its own description promised, and the two negative claims — no confidentiality, and no ECH dependency — are checked against evidence the page itself supplies.

**Mutation-checked.** A green suite is not evidence until it has been watched failing. Eleven one-line inversions were applied to `src/`, one at a time — the key tag's alternating shift; the canonical RDATA sort reversed; the NSEC3 iteration count off by one; the NSEC wrap interval's `||` turned into `&&`; the bailiwick guard removed from each of the two provers where it is the only thing standing in the way; the DS-to-signer binding put back to comparing tags; the NSEC3 no-DS SOA condition dropped; the no-DS signature check skipped; `checkDenial` reading the zone file instead of the response; and the unsupported-DS-algorithm branch disabled. Every one produced a **successful build with a changed bundle hash** (a mutation that breaks `tsc` proves nothing — the suite would run against the last good bundle) and a **failing test**, and the hash returned to its pre-mutation value on restore.

Two of those started green, which is the point of doing it: the NSEC wrap branch and the bailiwick guards had no test that reached them. Both now have one — a name sorting past the end of the zone, which only the wrapping record can cover, and a foreign zone's record that matches the query perfectly and must still be refused.

---

## Performance

Signing the in-page hierarchy takes roughly 100–300 ms — three zones, around thirty RRsets, real ECDSA P-256 and Ed25519 signatures over each. The zone walk is one local query per name and completes instantly. The NSEC3 dictionary run is the only long operation: 1,329 candidates at 0 iterations is about 1,300 SHA-1 invocations and finishes in a frame; at 150 iterations it is roughly 200,000, which is why it runs in slices with the progress reported honestly rather than behind a spinner. Production bundle: 166 kB, 60 kB gzipped.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Attestation Gate

- **slug**: `crypto-lab-attestation-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-attestation-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-attestation-gate/
- **commit_sha**: `76636179c5a36832e3c80c24bd99a8f6b3cb372a` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | PRIVACY  ·  **level**: advanced  ·  **--accent**: #ffb84d
- **MISSING FIELDS**: verification

**Name (H1)**: Attestation Gate  — _read from src/ui/app.ts_

**Subtitle**: Remote attestation · RFC 9334 · TPM 2.0 Quote · Direct Anonymous Attestation  — _read from src/ui/app.ts_

**Description**: Extends a real measured boot into PCRs, signs a byte-exact TPMS_ATTEST over them, and  — _read from src/ui/app.ts_

**Why it matters**: Cloud providers, enterprise networks and confidential-computing platforms all gate access  — _read from src/ui/app.ts_

**Card copy**: Build and appraise measured-boot quotes, replace the stable key name with computed DAA membership, then execute PCR-bound sealing, authorized recovery, tamper refusal, fixedTPM seed compromise, and post-release exposure.

**Chips**: TPM 2.0 · RATS · Direct Anonymous Attestation · Controlled Linkability · TPM Sealed Storage

**Implements**: AES `src/acts/sealing.ts:94`, AES-CFB `src/tpm/credential.ts:121`, BBS+ `src/daa/protocol.ts:271`, BLS12-381 `src/daa/groups.ts:14`, Direct Anonymous Attestation `src/daa/protocol.ts:384`, ECDH `src/tpm/credential.ts:87`, ECDSA `src/tpm/key.ts:511`, Fiat-Shamir `src/daa/protocol.ts:214`, Hash-to-curve `src/daa/groups.ts:39`, HMAC `src/core/hmac.ts:15`, P-256 `src/acts/sealing.ts:62`, Pairing `src/daa/groups.ts:177`, Schnorr identification `src/daa/protocol.ts:259`, SHA-256 `src/core/hmac.ts:15`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Diffie-Hellman `src/daa/protocol.ts:5`, Schnorr `src/daa/groups.ts:146`

**References**: Merkle tree, RSA, SHA-1, SHA-384, SHA-512

**Standards body**: IETF, NIST

**Implementation**: @noble/curves BLS12-381/P-256 and @noble/ciphers AES-CFB / local SHA-256, HMAC, Fiat-Shamir/Schnorr-identification proofs, CDL Pi_DAA+, byte-accurate TPM object/policy and RATS teaching implementations

**Spec citations, exactly as written**:

- `ePrint 2016/663` — first seen README.md:22 (3×)
- `eprint.iacr.org/2016/663` — first seen README.md:234 (1×)
- `FIPS 180-4` — first seen README.md:18 (6×)
- `FIPS 186-4` — first seen README.md:21 (1×)
- `FIPS 198-1` — first seen src/core/hmac.ts:2 (1×)
- `NIST SP 800-38A` — first seen README.md:300 (1×)
- `RFC 10013` — first seen README.md:29 (18×)
- `RFC 2104` — first seen src/core/hmac.ts:2 (2×)
- `RFC 4231` — first seen README.md:296 (2×)
- `RFC 6979` — first seen README.md:21 (6×)
- `RFC 7049` — first seen src/core/cbor.ts:16 (1×)
- `RFC 8392` — first seen src/eat/claims.ts:44 (1×)
- `RFC 8949` — first seen README.md:30 (6×)
- `RFC 9334` — first seen README.md:27 (7×)
- `RFC 9380` — first seen README.md:23 (3×)
- `RFC 9393` — first seen src/eat/measured-component.ts:81 (1×)
- `RFC 9711` — first seen README.md:28 (11×)
- `RFC 9741` — first seen src/eat/measured-component.ts:127 (1×)
- `rfc9380` — first seen README.md:237 (1×)
- `SP 800-108` — first seen src/core/hmac.ts:5 (2×)
- `SP 800-56A` — first seen src/tpm/kdf.ts:19 (1×)

**README — What Can Go Wrong**:

```text
**The measurement is a scope, not a guarantee.** A quote says nothing whatever about a PCR whose
selection bit is clear, and nothing about anything that was never measured into a PCR at all.
Exhibit 5 is that failure, performed. The correct mitigation is to widen the measured set (runtime
measurement) and to state the scope of what a given quote covers, not to describe attestation as
proving more than it does.

**The trust anchors are an input.** Evidence never establishes who to trust. A quote signed under an
attacker-controlled CA verifies completely clean, and there is nothing in the bytes that could
reveal it. Whatever process puts a CA into a verifier's trusted list is the real strength of the
system. Exhibit 6's last branch is the fixture.

**Key extraction removes the only real defence against quote forgery.** The `TPM_GENERATED_VALUE`
rule is enforced by the TPM refusing to sign, not by anything a verifier inspects. Once the
attestation key's private half is outside the TPM, plain ECDSA has no opinion about what it is
signing. This is what `fixedTPM` is for.

**A verifier-side magic check is a backstop, not the mechanism.** `tpm2_checkquote` stopped comparing
the magic field in 4.1-rc0 and was not fixed until 5.5.1 / 5.6.1 / 5.7 (CVE-2024-29038); its sibling
CVE-2024-29039 is the same shape, with the `TPML_PCR_SELECTION` in a supplied PCR file never compared
against the one inside the signed structure. Both are checks a verifier must perform because nothing
about the bytes performs them for it.

**An uncertified attestation key produces no error at all.** There is no TPM response code and no
protocol signal for "nobody proved this key is in a TPM". TCG has to phrase the countermeasure as a
normative MUST on the relying party — check for the `tcg-cap-verifiedTPMRestricted` policy OID
2.23.133.11.1.3 — precisely because the absence is silent. CVE-2021-3406 is that check missing in
production: a registrar's omissions invalidated the chain of trust from the endorsement certificate
to every agent attestation.

**The endorsement key is not the attestation key.** The EK cannot sign quotes — the standard
templates have `sign` CLEAR, and asking returns `TPM_RC_KEY`. But an attacker holding the EK private
key can complete a CA's credential-activation challenge in software and have a hostile key certified
as TPM-resident. Same end state, different mechanism.

**A replayed quote is a genuine quote.** Signatures do not expire. Freshness comes from the relying
party's nonce inside the signed bytes, and from nowhere else.

**A sealed secret is released, and then it is somewhere else.** Sealing enforces a condition at
the moment of release and has no further say. Exhibit 8's last case passes every TPM check,
returns `TPM_RC_SUCCESS`, and is then read out of the platform's memory by something running in
the state the policy approved. The policy was satisfied, not defeated; what is exposed is the
material already released, and the sealed object on disk is unchanged and still requires the
policy.

**A PCR policy is brittle, and the cure has a cost the specification states.** TPM 2.0 Part 1
§16.7.11 names the problem — a firmware update changes the PCRs and the sealed value becomes
unrecoverable — and gives `TPM2_PolicyAuthorize` as the answer. That command resets `policyDigest`
and replaces it with a digest over the AUTHORITY'S NAME and a purpose string, so the recovery
branch says "a state this authority approved" rather than "this state". The authority's signature
is then the entire security of that branch. Exhibit 8 shows both halves: four cases fail the
recovery route (wrong key, wrong purpose, wrong state, no signature) and one succeeds.
The bounded browser model retains only the owner hierarchy proof and therefore rejects tickets
that name any other hierarchy; a real TPM selects the proof named by the ticket inside the TPM.

**A policy over PCRs is not secure boot, rollback prevention, or anti-hammering.** Nothing in a
PCR policy v
```

**Claims tested** (e2e/claims.spec.ts, 51 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:38
    - :38 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:43
    - :43 `toHaveText` expected `'Step 0 / 6'` _(literal)_
- `every extension the page prints really is SHA-256(old || measurement)` — e2e/claims.spec.ts:48
    - :52 `toHaveText` expected `'Step ${step} / 6'` _(expression)_
    - :61 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :62 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :63 `toBe` expected `before + measurement` _(expression)_
    - :66 `toBe` expected `after` _(expression)_
    - :68 `toBeDisabled` expected _no expected value_ _(none)_
- `the register strip ends on the values the stepper printed` — e2e/claims.spec.ts:71
    - :76 `toHaveText` expected `'Step ${step} / 6'` _(expression)_
    - :79 `expect` expected _no expected value_ _(none)_
    - :84 `toHaveCount` expected `4` _(literal)_
    - :88 `toBe` expected `finalPerPcr.get(pcr)` _(expression)_
- `the boot chain has exactly as many stages as the stepper counts` — e2e/claims.spec.ts:92
    - :94 `toBe` expected `'Step 0 / ${stages}'` _(expression)_
    - :96 `toBe` expected `'Step 1 / ${stages}'` _(expression)_
- `the byte map accounts for every byte of the signed structure, in order` — e2e/claims.spec.ts:101
    - :104 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :109 `expect` expected _no expected value_ _(none)_
    - :119 `toBe` expected `expectedOffset` _(expression)_
    - :120 `toBe` expected `Number(length)` _(expression)_
    - :121 `toBe` expected `hex` _(expression)_
    - :125 `toBe` expected `attest` _(expression)_
    - :126 `toBe` expected `attest.length` _(expression)_
- `the signed structure begins with the magic value the byte map names` — e2e/claims.spec.ts:129
    - :134 `toBe` expected `attest.slice(0, 8)` _(expression)_
    - :135 `expect` expected _no expected value_ _(none)_
    - :136 `toBe` expected `'ff544347'` _(literal)_
- `extraData inside the signed bytes is the nonce the relying party printed` — e2e/claims.spec.ts:139
    - :143 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :146 `expect` expected _no expected value_ _(none)_
    - :151 `toBe` expected `nonce` _(expression)_
    - :152 `expect` expected _no expected value_ _(none)_
- `the composite digest is SHA-256 over the registers the page listed` — e2e/claims.spec.ts:155
    - :158 `toHaveCount` expected `4` _(literal)_
    - :162 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :171 `toBe` expected `digest` _(expression)_
- `the ${which} run is rejected, reports ${code}, and names the cause` — e2e/claims.spec.ts:183
    - :186 `toHaveText` expected `'REJECTED'` _(literal)_
    - :191 `toHaveCount` expected `0` _(literal)_
    - :193 `toEqual` expected `new Set([code])` _(expression)_
    - :194 `toHaveText` expected `cause` _(expression)_
    - :196 `toHaveText` expected `code` _(expression)_
    - :199 `toHaveCount` expected `0` _(literal)_
- `a replayed quote keeps a valid signature — only freshness fails` — e2e/claims.spec.ts:203
    - :208 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :210 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
- `the wrong machine has perfect registers and is still rejected` — e2e/claims.spec.ts:213
    - :216 `toHaveCount` expected `0` _(literal)_
    - :217 `toHaveCount` expected `4` _(literal)_
    - :218 `toHaveText` expected `'REJECTED'` _(literal)_
- `the tampered run names the stage that diverged, not just the register` — e2e/claims.spec.ts:221
    - :224 `toHaveCount` expected `1` _(literal)_
    - :226 `expect` expected _no expected value_ _(none)_
    - :228 `toHaveCount` expected `1` _(literal)_
    - :229 `toContainText` expected `'Boot loader'` _(literal)_
    - :230 `toContainText` expected `'measured into PCR 4'` _(literal)_
- `editing the input retires the stale verdict and says so` — e2e/claims.spec.ts:235
    - :237 `toHaveText` expected `'REJECTED'` _(literal)_
    - :238 `toHaveText` expected `'PCR_MISMATCH'` _(literal)_
    - :243 `toHaveText` expected `'ATTESTED'` _(literal)_
    - :244 `toHaveCount` expected `1` _(literal)_
    - :245 `toHaveCount` expected `0` _(literal)_
    - :246 `toHaveCount` expected `0` _(literal)_
    - :248 `toContainText` expected _no expected value_ _(none)_
- `re-selecting the same scenario does not retire a fresh verdict` — e2e/claims.spec.ts:253
    - :258 `toHaveText` expected `'REJECTED'` _(literal)_
    - :259 `toBe` expected `before` _(expression)_
    - :260 `toHaveText` expected `'NONCE_STALE'` _(literal)_
- `a hidden tabpanel is really hidden, and really unrendered` — e2e/claims.spec.ts:265
    - :270 `toHaveAttribute` expected `'hidden', ''` _(expression)_
    - :271 `toBe` expected `false` _(expression)_
    - :272 `expect` expected _no expected value_ _(none)_
    - :275 `toBe` expected `true` _(expression)_
    - :276 `expect` expected _no expected value_ _(none)_
    - :277 `toHaveAttribute` expected `'hidden', ''` _(expression)_
    - :278 `toBe` expected `false` _(expression)_
- `NEG-1: the quote verifies with every check passing while the machine is compromised` — e2e/claims.spec.ts:283
    - :295 `toHaveText` expected `'ATTESTED'` _(literal)_
    - :301 `toHaveText` expected `'ATTESTED — AND COMPROMISED'` _(literal)_
    - :305 `toHaveCount` expected `0` _(literal)_
    - :306 `toHaveCount` expected `0` _(literal)_
    - :307 `toHaveCount` expected `0` _(literal)_
    - :308 `toHaveCount` expected `0` _(literal)_
    - :313 `toBe` expected `registersBefore[i]` _(expression)_
    - :315 `toBe` expected `digestBefore` _(expression)_
    - :322 `expect` expected _no expected value_ _(none)_
- `THREAT-1: a hostile trust anchor produces a completely clean appraisal` — e2e/claims.spec.ts:327
    - :332 `toHaveText` expected _no expected value_ _(none)_
    - :336 `toHaveCount` expected `0` _(literal)_
    - :337 `toHaveCount` expected `0` _(literal)_
    - :338 `toHaveCount` expected `0` _(literal)_
    - :339 `toHaveCount` expected `0` _(literal)_
    - :345 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :346 `toContainText` expected `'Attacker-Operated CA'` _(literal)_
- `the same evidence is rejected the moment the anchor list is honest` — e2e/claims.spec.ts:349
    - :357 `toHaveText` expected `'REJECTED'` _(literal)_
    - :358 `toHaveText` expected `'AK_NOT_CERTIFIED'` _(literal)_
- `7b unchecked: the only NOT RUN row in the lab, and a clean pass` — e2e/claims.spec.ts:361
    - :365 `toHaveCount` expected `1` _(literal)_
    - :366 `toContainText` expected `'NOT RUN'` _(literal)_
    - :367 `toContainText` expected `'does not check AK certification'` _(literal)_
    - :368 `toHaveCount` expected `0` _(literal)_
    - :369 `toHaveText` expected _no expected value_ _(none)_
- `the stable AK repeats while the DAA-shaped statement carries an empty signer Name` — e2e/claims.spec.ts:381
    - :387 `toMatch` expected `/^[0-9a-f]{68}$/` _(regex)_
    - :388 `toBe` expected `first` _(expression)_
    - :389 `toHaveAttribute` expected `'data-daa-row', 'stable-ak'` _(expression)_
    - :390 `toContainText` expected _no expected value_ _(none)_
    - :393 `toContainText` expected _no expected value_ _(none)_
    - :400 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :402 `toBe` expected `true` _(expression)_
    - :403 `expect` expected _no expected value_ _(none)_
    - :404 `toBe` expected `digest` _(expression)_
- `the displayed randomized issuer relation satisfies the pairing equation independently` — e2e/claims.spec.ts:407
    - :423 `toBe` expected `true` _(expression)_
    - :424 `toHaveCount` expected _no expected value_ _(none)_
- `basename Link outcomes agree with the four current-run pseudonyms` — e2e/claims.spec.ts:429
    - :437 `toMatch` expected `/^[0-9a-f]{96}$/` _(regex)_
    - :439 `toBe` expected `serviceA1` _(expression)_
    - :440 `toBe` expected `serviceA1` _(expression)_
    - :441 `toBe` expected `serviceA1` _(expression)_
    - :442 `toHaveText` expected _no expected value_ _(none)_
    - :445 `expect` expected _no expected value_ _(none)_
    - :448 `expect` expected _no expected value_ _(none)_
- `credential, issuer epoch, re-Join, and exact rogue-list state drive the shown verdicts` — e2e/claims.spec.ts:453
    - :457 `toHaveText` expected _no expected value_ _(none)_
    - :461 `toHaveText` expected `'PASS'` _(literal)_
    - :462 `toHaveText` expected `'FAIL'` _(literal)_
    - :465 `toHaveText` expected _no expected value_ _(none)_
    - :469 `toHaveText` expected _no expected value_ _(none)_
    - :473 `toHaveText` expected `'REVOKED'` _(literal)_
    - :477 `toHaveAttribute` expected `'data-state', 'fail'` _(expression)_
    - :478 `toContainText` expected `'listed-secret equals nym'` _(literal)_
- `the DAA panel keeps its construction and security boundaries visible` — e2e/claims.spec.ts:481
    - :483 `toContainText` expected `'Camenisch–Drijvers–Lehmann'` _(literal)_
    - :484 `toContainText` expected `'authenticated Join channel'` _(literal)_
    - :485 `toContainText` expected `'does not implement unique-TPM admission'` _(literal)_
    - :486 `toContainText` expected `'variable-time'` _(literal)_
    - :487 `toContainText` expected `'not side-channel-hardened'` _(literal)_
    - :488 `toContainText` expected `'Anonymous provenance is not runtime integrity'` _(literal)_
    - :489 `toContainText` expected `'only after gsk becomes known'` _(literal)_
- `a restricted key refuses the forgery; clearing one bit makes it sign` — e2e/claims.spec.ts:494
    - :496 `toContainText` expected `'REFUSED — TPM_RC_TICKET'` _(literal)_
    - :499 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :503 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :504 `toHaveText` expected `'SIGNED'` _(literal)_
    - :511 `toBe` expected `0x00010000n` _(expression)_
- `the crafted structure the TPM refused really is a well-formed quote` — e2e/claims.spec.ts:514
    - :517 `toBe` expected `true` _(expression)_
    - :522 `toBe` expected `genuine.length` _(expression)_
    - :523 `toBe` expected `genuine.slice(0, 12)` _(expression)_
- `every code a scenario emits has a row in the failure-code reference` — e2e/claims.spec.ts:528
    - :533 `expect` expected _no expected value_ _(none)_
    - :534 `expect` expected _no expected value_ _(none)_
    - :550 `expect` expected _no expected value_ _(none)_
    - :551 `expect` expected _no expected value_ _(none)_
- `exactly one h1, one banner, and the scripture footer last` — e2e/claims.spec.ts:556
    - :557 `toHaveCount` expected `1` _(literal)_
    - :558 `toHaveCount` expected `1` _(literal)_
    - :560 `toHaveCount` expected `1` _(literal)_
    - :561 `toContainText` expected `'1 Corinthians 10:31'` _(literal)_
    - :562 `expect` expected _no expected value_ _(none)_
- `the page carries no theme toggle and pins dark before paint` — e2e/claims.spec.ts:572
    - :573 `toHaveAttribute` expected `'data-theme', 'dark'` _(expression)_
    - :574 `expect` expected _no expected value_ _(none)_
    - :577 `toBe` expected `'dark'` _(literal)_
- `no horizontal overflow at the tested viewport` — e2e/claims.spec.ts:580
    - :585 `expect` expected _no expected value_ _(none)_
- `the tablist supports roving arrow-key navigation` — e2e/claims.spec.ts:588
    - :592 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :594 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :596 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
- `primary controls meet the 24px WCAG 2.5.8 minimum on coarse pointers` — e2e/claims.spec.ts:599
    - :603 `expect` expected _no expected value_ _(none)_
    - :604 `expect` expected _no expected value_ _(none)_
    - :615 `toContainText` expected `'NOT RUN'` _(literal)_
    - :620 `toContainText` expected `'NOT RUN'` _(literal)_
    - :622 `toContainText` expected `'NOT RUN'` _(literal)_
    - :627 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
- `every policy assertion the page prints really is SHA-256(old || assertion)` — e2e/claims.spec.ts:631
    - :646 `expect` expected _no expected value_ _(none)_
    - :653 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :654 `toBe` expected `digests.length` _(expression)_
    - :655 `expect` expected _no expected value_ _(none)_
    - :661 `toBe` expected _no expected value_ _(none)_
    - :666 `toBe` expected `true` _(expression)_
    - :672 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :674 `toBe` expected `digest` _(expression)_
    - :678 `expect` expected _no expected value_ _(none)_
    - :687 `expect` expected _no expected value_ _(none)_
    - :690 `expect` expected _no expected value_ _(none)_
- `the two-hash PolicyUpdate is shown as two hashes, not collapsed into one` — e2e/claims.spec.ts:693
    - :704 `toHaveCount` expected `1` _(literal)_
    - :705 `toHaveAttribute` expected `'data-seal-resets', 'true'` _(expression)_
    - :708 `toHaveLength` expected `2` _(literal)_
    - :711 `toBe` expected `'0'.repeat(64)` _(expression)_
    - :712 `toBe` expected `'0000016a'` _(literal)_
    - :713 `toBe` expected `70` _(literal)_
    - :715 `toBe` expected `true` _(expression)_
    - :717 `toBe` expected _no expected value_ _(none)_
    - :720 `toBe` expected `digests[1].trim()` _(expression)_
- `the policy a branch reaches is the digest the OR list then consumes` — e2e/claims.spec.ts:723
    - :743 `toBe` expected `'0'.repeat(64) + '00000171' + branchA + branchB` _(expression)_
    - :751 `toBe` expected `finalAfter` _(expression)_
    - :752 `toBe` expected `finalAfter` _(expression)_
- `the sealed object’s byte map tiles the structure its Name is a digest of` — e2e/claims.spec.ts:755
    - :766 `toBe` expected `8` _(literal)_
    - :774 `toBe` expected `expectedOffset` _(expression)_
    - :775 `toBe` expected `Number(length)` _(expression)_
    - :783 `toBe` expected `'000b${sha256Hex(joined)}'` _(expression)_
    - :785 `toBe` expected `'0008'` _(literal)_
    - :786 `toHaveText` expected `'TPM_ALG_KEYEDHASH'` _(literal)_
- `the composite digest the run prints is SHA-256 over the registers it listed` — e2e/claims.spec.ts:789
    - :795 `toHaveCount` expected `4` _(literal)_
    - :799 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :802 `toBe` expected `await sealHex(page, 'current-digest')` _(expression)_
- `a matching state releases, and the digests on screen agree that it matched` — e2e/claims.spec.ts:805
    - :810 `toHaveText` expected `'RELEASED'` _(literal)_
    - :811 `toBe` expected `await sealHex(page, 'sealed-digest')` _(expression)_
    - :812 `toBe` expected `await sealHex(page, 'auth-policy')` _(expression)_
    - :813 `toHaveCount` expected `0` _(literal)_
    - :814 `toHaveCount` expected `0` _(literal)_
- `the firmware-change refusal is computed from the registers, not asserted` — e2e/claims.spec.ts:817
    - :822 `toHaveText` expected `'REFUSED'` _(literal)_
    - :826 `toBe` expected `await sealHex(page, 'sealed-digest')` _(expression)_
    - :828 `toHaveCount` expected `1` _(literal)_
    - :829 `toHaveText` expected `'PCR 0'` _(literal)_
    - :834 `toHaveCount` expected `0` _(literal)_
    - :835 `toContainText` expected `'TPM_RC_VALUE'` _(literal)_
    - :836 `toHaveText` expected _no expected value_ _(none)_
- `every response code a sealed-storage case emits has a row in its reference table` — e2e/claims.spec.ts:841
    - :850 `expect` expected _no expected value_ _(none)_
    - :853 `expect` expected _no expected value_ _(none)_
    - :862 `toBe` expected `true` _(expression)_
- `an authorized recovery releases through the other branch, with the same authPolicy` — e2e/claims.spec.ts:867
    - :875 `toHaveText` expected `'RELEASED'` _(literal)_
    - :878 `toBe` expected `authPolicyA` _(expression)_
    - :880 `toBe` expected `await sealHex(page, 'sealed-digest')` _(expression)_
    - :890 `toEqual` expected `[` _(expression)_
- `an unapproved recovery is refused, and says the approval is missing` — e2e/claims.spec.ts:898
    - :901 `toHaveText` expected `'REFUSED'` _(literal)_
    - :903 `toHaveCount` expected `1` _(literal)_
    - :904 `expect` expected _no expected value_ _(none)_
    - :908 `expect` expected _no expected value_ _(none)_
- `tampering with the public metadata fails before anything is decrypted` — e2e/claims.spec.ts:913
    - :916 `toHaveText` expected _no expected value_ _(none)_
    - :921 `toHaveCount` expected _no expected value_ _(none)_
    - :924 `toHaveCount` expected `1` _(literal)_
- `a forged replacement loads after the fixedTPM parent seed is extracted` — e2e/claims.spec.ts:927
    - :930 `toHaveText` expected `'RELEASED'` _(literal)_
    - :932 `expect` expected _no expected value_ _(none)_
    - :933 `expect` expected _no expected value_ _(none)_
    - :934 `toContainText` expected _no expected value_ _(none)_
    - :937 `toContainText` expected _no expected value_ _(none)_
    - :946 `toContainText` expected `'seedValue'` _(literal)_
- `the post-release case passes every TPM check and still shows the alarm` — e2e/claims.spec.ts:949
    - :952 `toHaveText` expected _no expected value_ _(none)_
    - :955 `toHaveAttribute` expected _no expected value_ _(none)_
    - :960 `toHaveCount` expected `0` _(literal)_
    - :964 `toHaveCount` expected `1` _(literal)_
    - :965 `toContainText` expected `'After release'` _(literal)_
    - :967 `expect` expected _no expected value_ _(none)_
    - :972 `toContainText` expected _no expected value_ _(none)_
- `the sealed object’s public unique is a digest over the secret, not the secret` — e2e/claims.spec.ts:977
    - :988 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :998 `toBe` expected `unique` _(expression)_
    - :1000 `toBe` expected `unique` _(expression)_
    - :1001 `expect` expected _no expected value_ _(none)_
- `changing the measured value retires the sealed-storage verdict and says so` — e2e/claims.spec.ts:1004
    - :1009 `toHaveText` expected `'RELEASED'` _(literal)_
    - :1012 `toHaveText` expected `'NOT RUN'` _(literal)_
    - :1013 `toContainText` expected _no expected value_ _(none)_
    - :1017 `toHaveCount` expected `0` _(literal)_
    - :1018 `toHaveCount` expected `0` _(literal)_
    - :1022 `toHaveText` expected `'REFUSED'` _(literal)_
    - :1023 `toBe` expected `await sealHex(page, 'sealed-digest')` _(expression)_
- `selecting a different case retires the verdict before it is re-run` — e2e/claims.spec.ts:1026
    - :1030 `toHaveText` expected `'NOT RUN'` _(literal)_
    - :1031 `toContainText` expected _no expected value_ _(none)_
    - :1034 `toHaveAttribute` expected _no expected value_ _(none)_
    - :1038 `toHaveAttribute` expected _no expected value_ _(none)_
- `the sealed-storage act keeps its non-claims visible` — e2e/claims.spec.ts:1044
    - :1054 `toContainText` expected `phrase` _(expression)_
    - :1061 `toContainText` expected `'NOT pinned to a published test vector'` _(literal)_
    - :1067 `toContainText` expected `'DEPRECATED in Version 185'` _(literal)_
- `the sealed-storage act is operable by keyboard alone` — e2e/claims.spec.ts:1070
    - :1076 `toHaveText` expected `'Step 0 / 6'` _(literal)_
    - :1079 `expect` expected _no expected value_ _(none)_
    - :1087 `expect` expected _no expected value_ _(none)_
    - :1090 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :1091 `expect` expected _no expected value_ _(none)_
    - :1092 `expect` expected _no expected value_ _(none)_
    - :1099 `expect` expected _no expected value_ _(none)_
    - :1101 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :1102 `toHaveText` expected `'NOT RUN'` _(literal)_
    - :1110 `expect` expected _no expected value_ _(none)_
    - :1112 `toContainText` expected _no expected value_ _(none)_
    - :1120 `expect` expected _no expected value_ _(none)_
    - :1122 `toHaveText` expected `'REFUSED'` _(literal)_
    - :1123 `toHaveText` expected _no expected value_ _(none)_
    - :1134 `toHaveAttribute` expected `'open', ''` _(expression)_

**Mutation records** (1 file(s)):

- `scripts/mutations.mjs` (18454 bytes)

<details><summary>Full README</summary>

```markdown
# Attestation Gate

Browser demo: measured boot into PCRs, a real TPMS_ATTEST quote, and a verifier with reference values — then execute something outside the measured set after the final boot measurement and watch every check pass. It also compares that stable attestation identity with a bounded, executable Direct Anonymous Attestation membership proof, and seals a synthetic secret to a PCR policy the TPM model enforces locally. A boot quote proves what was measured, not what is running — and a sealed secret is released to a machine whose registers match, which is the same limit arriving from the other direction.

**Live demo:** https://systemslibrarian.github.io/crypto-lab-attestation-gate/

---

## What It Is

A working model of remote attestation, built from the actual specifications rather than from an
analogy to them.

**The primitives, exactly.**

| Piece | Standard | What this repo does |
|---|---|---|
| PCR extension | TPM 2.0 Library Part 1, "PCR Operations" | Hand-rolled `PCR_new := H(PCR_old ‖ measurement)` over a hand-rolled SHA-256 (FIPS 180-4), so the exact 64-byte preimage can be shown |
| `TPMS_ATTEST` | TPM 2.0 Library Part 2, `TPMS_ATTEST` / `TPMS_QUOTE_INFO` / `TPML_PCR_SELECTION` | Hand-rolled marshaller with a per-field byte map, plus a strict fail-closed parser |
| Restricted signing | TPM 2.0 Part 1 §11.4.6.1, §25.1.3; Part 3 §15.4, §17.6, §20.2 | `TicketIsSafe()`, the NULL validation ticket, and `TPM_RC_TICKET` on `TPM2_Sign` |
| Quote signature | ECDSA on NIST P-256 (FIPS 186-4) | `@noble/curves`, deterministic per RFC 6979 so every byte on the page is reproducible |
| Anonymous membership | Camenisch–Drijvers–Lehmann `Pi_DAA+`, full version of IACR ePrint 2016/663 §5.1 | Zero-application-attribute Setup, Join proof, BBS+ credential, randomized Sign/Verify, basename Link, and private-key rogue-list check over BLS12-381 |
| Hash to curve | RFC 9380 | Separate DAA-specific BLS12-381 G1 domain-separation tags for the public generators and basename map |
| Credential activation | TPM 2.0 Part 3 §12.6–12.7; TCG EK Credential Profile | Real ECDH on P-256, real `KDFa`/`KDFe`, real AES-128-CFB, real HMAC-SHA-256 |
| Enhanced authorization | TPM 2.0 Part 3 §5.6, §23.2.3, §23.6, §23.7, §23.11, §23.16 | `TPM2_PolicyPCR`, `TPM2_PolicyOR`, `TPM2_PolicyCommandCode` and `TPM2_PolicyAuthorize`, transcribed from the reference implementation's own hashing order, with `PolicyUpdate` pinned to the published TCG EK Credential Profile `authPolicy` constant |
| Sealed data objects | TPM 2.0 Part 1 §19.4, §19.5, §24.3.3, §24.5.3.2; Part 2 §12.2.4, §12.3.2.4, §12.3.7; Part 3 §12.1, §12.2, §12.7 (Version 185 numbering); 1.83 Part 4 `PrivateToSensitive`, `UnwrapOuter`, `ObjectLoad`, and `CryptValidateKeys` reference code | A `TPM_ALG_KEYEDHASH` `TPMT_PUBLIC`, `unique := H(obfuscate ‖ secret)`, and a private blob built by `KDFa`/AES-128-CFB/outer HMAC over `symIv ‖ encSensitive ‖ Name`; the load model preserves the fixedTPM-parent validation shortcut |
| Attestation architecture | **RFC 9334** — RATS Architecture (Informational, January 2023) | Attester → Evidence → Verifier → Attestation Result → Relying Party, with Endorsements and Reference Values as separate inputs |
| Evidence format | **RFC 9711** — Entity Attestation Token (Standards Track, April 2025) | A real claims-set, integer-keyed in CBOR and name-keyed in JSON |
| Measurement encoding | **RFC 10013** — EAT Measured Component (Standards Track, July 2026) | The `measured-component` data item, both serializations |
| CBOR | **RFC 8949** | Hand-rolled deterministic encoder (§4.2.1 core deterministic encoding) |

**The maths, in one paragraph.** A PCR is a register whose only write operation is
`PCR ← H(PCR ‖ d)`. The old value is an input, so the sequence of measurements is welded in order:
landing on a chosen final value would mean finding `d` with `H(PCR ‖ d) = target`, a second-preimage
problem. A quote is an ECDSA signature over `H(m)` where `m` is a marshalled `TPMS_ATTEST` beginning
`FF 54 43 47`, and the only thing that structure says about the registers is one composite digest,
`H(PCR_a ‖ PCR_b ‖ …)` over the selected set in ascending index order. Individual register values
reach the verifier separately, in an unsigned event log, and are trustworthy only because replaying
that log has to reproduce the composite digest inside the signature. The page shows every one of
those steps with its inputs.

The anonymous path uses the same additive/multiplicative translation throughout: the paper's
`g^x h^y` is `x·g + y·h` in the elliptic-curve code. The issuer issues
`A = (e+x)^−1·(g1 + s·h0 + gsk·h1)`. Signing randomizes that credential and proves the three
relations from CDL §5.1; verification separately checks `e(A′, w) = e(A-bar, g2)` and reconstructs
the Fiat–Shamir commitments. Under one basename, `nym = gsk·H1(basename)` is stable and Link can
compare two valid proofs. Across different basenames Link is undefined; unequal pseudonyms in one
run are not, by themselves, a proof that ancillary metadata is unlinkable.

**The security model.** The attester is untrusted; the TPM inside it is trusted to the extent that
its keys never leave it. The verifier is trusted by the relying party. The verifier's trust anchors
are supplied out of band and are never established by Evidence. Nothing here defends against a
compromised verifier, and nothing here defends against physical attack on a TPM.

For the DAA panel, CDL assumes an authenticated Join channel and an issuer admission rule. This
repo verifies the nonce-bound proof of `gsk`; it does not implement unique-TPM admission inside the
DAA module. The existing endorsement-key/credential-activation exhibit models that prerequisite as
an enrollment adapter, not as part of CDL's algebra. The paper's Theorem 1 additionally relies on
DDH, the JOC qSDH assumption, random oracles, static corruptions, online-extractable proofs, and
idealized hybrid functionalities. This browser run does not prove those assumptions and does not
claim UC security.

**Not production cryptography.** This is a teaching demo. It runs entirely in your browser, with no
backend, no network calls and nothing persisted. There is no TPM anywhere near it — a TPM is
hardware, and this page models one in software, so every protection that comes from a key
physically never leaving a chip is described here rather than enforced. That applies most sharply
to the sealed-storage act: the storage parent's `seedValue` is a value in the page's own memory,
and in hardware it never leaves the chip. No command buffer, session HMAC, parameter encryption or
transport is built, so nothing here is wire interoperable even where the structures are byte-exact,
and no `TPM2_*` command is executed or transmitted anywhere.
The BLS12-381 choice is a Type-3 algebraic teaching instantiation, not the paper's benchmark curve,
not a TPM 2.0 or ISO ECDAA wire profile, and not interoperable with hardware commands. Fixture
values are reproducible: proof nonces are secret-keyed with HMAC-SHA-256 and bind the complete
framed context so reusing an external fixture seed does not repeat Schnorr proof randomness. The
JavaScript bigint/group operations remain variable-time and are not side-channel-hardened secret
handling. All fixture seeds ship in the source; “secret” describes the protocol role, not secrecy
enforced against someone inspecting the browser bundle.

## Exhibits

1. **Measured Boot** — step the chain firmware → EV_SEPARATOR → boot loader → kernel command line →
   kernel → initrd, one extension at a time, with the exact 64 bytes hashed shown as two tinted
   halves. Edit any measured value and watch which registers move and which do not. Includes the
   reset-authority table, because "you can never rewind a PCR" is false as a general claim about
   TPMs and true only for PCR 0–15.
2. **Quote & Verify** — the relying party issues a nonce, the attester returns a signed
   `TPMS_ATTEST`, and the verifier appraises it. Every check is shown, passing ones included. Behind
   disclosures: the whole structure field by field, and the same Evidence as an EAT in CBOR and
   JSON.
3. **The Magic Value** — hand a restricted attestation key a byte-perfect `TPMS_ATTEST` built
   outside the TPM and watch `TPM2_Sign` answer `TPM_RC_TICKET`. Clear one attribute bit and watch
   the same forgery become both signable and verifiable. The verifier-side magic check is shown as
   the backstop it is.
4. **Break It** — change one byte of the boot loader (`PCR_MISMATCH`, with the diverged register and
   the named stage); replay yesterday's genuine quote (`NONCE_STALE`, with a perfect signature); let
   a different machine with identical PCRs answer (`TRUST_ANCHOR_UNKNOWN`).
5. **Time of Use** — a clean boot, a clean quote, a clean appraisal, and then something outside the
   measured set runs. Every register is byte-identical afterwards. Verdict:
   **ATTESTED — AND COMPROMISED.**
6. **Whose Signature** — a stolen attestation key signing statements it wrote itself; a software key
   at a CA that never proved TPM residency, with the relying party checking and then not checking; a
   real `TPM2_MakeCredential` / `TPM2_ActivateCredential` run completed **in software** with a stolen
   endorsement key; and the hostile-trust-anchor fixture that appraises completely clean.
7. **Anonymous Membership** — compare two stable-AK quotes with an empty-`qualifiedSigner`
   DAA-shaped attestation statement; execute issuer Setup, Join proof, credential issuance,
   randomized Sign/Verify and basename Link; then change the credential, issuer epoch, re-Join
   state, and private-key rogue list and recompute acceptance. The existing PCR/runtime limitation
   remains visible: anonymous provenance is not runtime integrity.
8. **Sealed Storage** — seal a synthetic secret to PCRs 0, 4, 8 and 9 under a policy that is an
   OR of the sealed state and an explicitly authorized recovery route. Unseal in the matching
   state; change the firmware and watch `TPM2_PolicyPCR` refuse from the actual composite digest;
   assert the wrong PCR selection; tamper with the public metadata or the ciphertext and watch
   `TPM2_Load` refuse before it decrypts anything; attempt recovery with the wrong authority, the
   wrong purpose, the wrong state and no signature at all; extract the modelled fixedTPM storage
   parent's seed and watch an authenticated replacement blob load (the original secret remains
   hidden); then recover correctly and watch the same `authPolicy` accept a state it was never
   sealed to. The last case releases the secret and
   then compromises the machine, which is a statement about what was already handed over rather
   than about the policy.

## When to Use It

Use remote attestation when a relying party must make a decision about a machine it does not
administer, and the machine's own assertions about itself are worthless. Network access control,
confidential computing, fleet compliance, and key release conditional on platform state are all real
and load-bearing uses.

**Do NOT use a static measured-boot quote as evidence that a machine is currently safe to talk to.**
It is evidence about a set of measurements at the time they were taken. Exhibit 5 is a complete,
honest, passing attestation of a compromised machine. If runtime state matters, you need runtime
measurement (Linux IMA extends PCR 10 for the lifetime of the system), and you need to quote the
register it uses.

Two more do-nots, both of which have real CVEs behind them: do not treat the `TPM_GENERATED_VALUE`
prefix as an authenticity marker a verifier can rely on, and do not accept an attestation key
without checking that a CA proved its TPM residency.

Use DAA-style membership when a verifier needs proof that an issuer approved a platform but does
not need one universal attestation-key identifier. Choose basenames deliberately: reuse gives the
verifier linkability inside that scope, while a fresh one-use basename avoids that deliberate
pseudonym reuse. Do not describe different-basename pseudonyms as universally unlinkable, and do
not claim this browser adaptation is a TPM deployment profile.

## Live Demo

https://systemslibrarian.github.io/crypto-lab-attestation-gate/

Step the boot chain and edit a measured value to see one register move. Open the byte map in
Quote & Verify and read a real `TPMS_ATTEST` field by field. Then go to Time of Use, press the
button, and read the check rows.

## What Can Go Wrong

**The measurement is a scope, not a guarantee.** A quote says nothing whatever about a PCR whose
selection bit is clear, and nothing about anything that was never measured into a PCR at all.
Exhibit 5 is that failure, performed. The correct mitigation is to widen the measured set (runtime
measurement) and to state the scope of what a given quote covers, not to describe attestation as
proving more than it does.

**The trust anchors are an input.** Evidence never establishes who to trust. A quote signed under an
attacker-controlled CA verifies completely clean, and there is nothing in the bytes that could
reveal it. Whatever process puts a CA into a verifier's trusted list is the real strength of the
system. Exhibit 6's last branch is the fixture.

**Key extraction removes the only real defence against quote forgery.** The `TPM_GENERATED_VALUE`
rule is enforced by the TPM refusing to sign, not by anything a verifier inspects. Once the
attestation key's private half is outside the TPM, plain ECDSA has no opinion about what it is
signing. This is what `fixedTPM` is for.

**A verifier-side magic check is a backstop, not the mechanism.** `tpm2_checkquote` stopped comparing
the magic field in 4.1-rc0 and was not fixed until 5.5.1 / 5.6.1 / 5.7 (CVE-2024-29038); its sibling
CVE-2024-29039 is the same shape, with the `TPML_PCR_SELECTION` in a supplied PCR file never compared
against the one inside the signed structure. Both are checks a verifier must perform because nothing
about the bytes performs them for it.

**An uncertified attestation key produces no error at all.** There is no TPM response code and no
protocol signal for "nobody proved this key is in a TPM". TCG has to phrase the countermeasure as a
normative MUST on the relying party — check for the `tcg-cap-verifiedTPMRestricted` policy OID
2.23.133.11.1.3 — precisely because the absence is silent. CVE-2021-3406 is that check missing in
production: a registrar's omissions invalidated the chain of trust from the endorsement certificate
to every agent attestation.

**The endorsement key is not the attestation key.** The EK cannot sign quotes — the standard
templates have `sign` CLEAR, and asking returns `TPM_RC_KEY`. But an attacker holding the EK private
key can complete a CA's credential-activation challenge in software and have a hostile key certified
as TPM-resident. Same end state, different mechanism.

**A replayed quote is a genuine quote.** Signatures do not expire. Freshness comes from the relying
party's nonce inside the signed bytes, and from nowhere else.

**A sealed secret is released, and then it is somewhere else.** Sealing enforces a condition at
the moment of release and has no further say. Exhibit 8's last case passes every TPM check,
returns `TPM_RC_SUCCESS`, and is then read out of the platform's memory by something running in
the state the policy approved. The policy was satisfied, not defeated; what is exposed is the
material already released, and the sealed object on disk is unchanged and still requires the
policy.

**A PCR policy is brittle, and the cure has a cost the specification states.** TPM 2.0 Part 1
§16.7.11 names the problem — a firmware update changes the PCRs and the sealed value becomes
unrecoverable — and gives `TPM2_PolicyAuthorize` as the answer. That command resets `policyDigest`
and replaces it with a digest over the AUTHORITY'S NAME and a purpose string, so the recovery
branch says "a state this authority approved" rather than "this state". The authority's signature
is then the entire security of that branch. Exhibit 8 shows both halves: four cases fail the
recovery route (wrong key, wrong purpose, wrong state, no signature) and one succeeds.
The bounded browser model retains only the owner hierarchy proof and therefore rejects tickets
that name any other hierarchy; a real TPM selects the proof named by the ticket inside the TPM.

**A policy over PCRs is not secure boot, rollback prevention, or anti-hammering.** Nothing in a
PCR policy verifies a signature on firmware; nothing stops an old sealed blob being paired with an
old measured state unless a second assertion such as `TPM2_PolicyNV` says so; and a `noDA` object
has no lockout at all. Exhibit 8 states all three as non-claims rather than leaving them to be
inferred.

**`fixedTPM` is a confinement premise, not an extra MAC.** The TPM reference `ObjectLoad` path
skips `CryptValidateKeys` for a child under a `fixedTPM` parent because it assumes that this TPM
created the blob or validated it during import. If the storage parent's protection seed is
extracted, an attacker can make the outer HMAC for a substitute sensitive area; the fixed-parent
load accepts it. Exhibit 8 executes that consequence and distinguishes it from the non-fixed-parent
path, where the same public/sensitive mismatch returns `TPM_RC_BINDING`. The original sealed value
is not disclosed by this substitution, but the integrity of what a valid policy releases is lost.

**DAA revocation is not one generic feature.** This lesson implements CDL's private-key rogue-list
check only. It can revoke a platform after its `gsk` is known; an unrelated listed secret must not
reject it. Publishing `gsk` also lets verifiers calculate that revoked platform's pseudonym for
every known basename, sacrificing its privacy. This is not credential-serial revocation, and the
optional signature-revocation construction is deliberately out of scope.

**Issuer rotation is trust policy, not retroactive erasure.** An epoch-1 credential fails when
checked under the epoch-2 key, but remains valid wherever the epoch-1 key is still trusted. A member
must re-Join to obtain an epoch-2 credential.

## DAA Sources and Exact Scope

- [Camenisch, Drijvers, and Lehmann, full version, IACR ePrint 2016/663](https://eprint.iacr.org/2016/663.pdf),
  especially §§4–6 and the construction in §5.1. The lab specializes it to zero application
  attributes while retaining the `h1/gsk` platform-secret term.
- [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380.html), especially §§2.2.3, 2.2.5, 3.1, and
  8.8.1, for hash-to-curve and domain separation.
- Wesemeyer, Newton, Treharne, Chen, Sasse, and Whitefield,
  ["Formal Analysis and Implementation of a TPM 2.0-based Direct Anonymous Attestation Scheme"](https://ethz.ch/content/dam/ethz/special-interest/infk/inst-infsec/information-security-group-dam/research/publications/pub2020/eccdaaimp-asiaccs20.pdf),
  Appendix A.2 and §§3.5–3.7, for the TPM-facing empty-`qualifiedSigner`, Quote integration, and
  EK-bound Join context. It informs the adapter and statement shape; it is not mixed into the CDL
  cryptographic core.

Omitted features are explicit: `bsn = bottom`, application attributes, signature-based revocation,
TPM command execution, hardware confinement, UC security, and post-quantum security.

## Real-World Usage

TPM-based measured boot and attestation are deployed at scale. Windows uses PCR-bound sealing for
BitLocker and reports measured-boot state through Device Health Attestation. Linux fleets use
[Keylime](https://keylime.dev/) for continuous attestation, and `tpm2-tools` for the underlying
operations. Cloud providers expose vTPM attestation for confidential VMs. The IETF RATS working
group standardised the roles and the evidence formats used here. Every failure code in this demo
carries the name a real implementation would give the same condition.

## How to Run Locally

`​``
npm install
npm run dev          # vite dev server
npm test             # the unit and known-answer suites
npm run build        # typecheck, then a production build
npm run test:a11y    # the axe WCAG 2.1 A/AA gate against the built site
npm run test:e2e     # the claims suite
npm run mutations    # named DAA and sealed-storage source mutations; baseline must pass first
`​``

Playwright needs a browser once: `npx playwright install chromium`.

## Related Demos

- [Context Ward](https://systemslibrarian.github.io/crypto-lab-context-ward/) — the exhibit this one
  answers. It shows every integrity check passing honestly while an agent is compromised anyway, and
  states that role separation assumes a trusted host. This is the answer to that open question, and
  the demonstration that the answer is narrower than it sounds.
- [Signed Bytes](https://systemslibrarian.github.io/crypto-lab-signed-bytes/) — a signature binds an
  exact byte string, never the meaning a parser assigns it. Exhibit 3 is the same principle applied
  at the signing oracle instead of at the parser.
- [Chain of Trust](https://systemslibrarian.github.io/crypto-lab-chain-of-trust/) — what it takes for
  a certificate chain to mean something, which is the layer the trust anchors in Exhibit 6 sit on.
- [Model Breach](https://systemslibrarian.github.io/crypto-lab-model-breach/) — assumptions drifting
  from deployment, which is the general form of NEG-1.
- [Merkle Vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) — the other major use
  of hash accumulation, for comparison with a PCR's linear chain.

## Build & Verify

Standard primitive implementations are pinned to published vectors where those vectors apply. The
custom BLS12-381 DAA adaptation is pinned to deterministic regression vectors and independently
checked protocol equations.

| Suite | What it checks |
|---|---|
| `src/core/sha256.test.ts` | FIPS 180-4 vectors, plus agreement with `@noble/hashes` on every length across four block boundaries and on a 1 MiB message |
| `src/core/hmac.test.ts` | RFC 4231 HMAC-SHA-256 test cases |
| `src/core/cbor.test.ts` | RFC 8949 Appendix A, the specification's own encoding table |
| `src/tpm/marshal.test.ts` | A **real captured `tpm2_quote` blob**, parsed field by field and re-marshalled to the identical 116 bytes; its `pcrDigest` recomputed from the ten published PCR values; a **real Windows Hello `TPM_ST_ATTEST_CERTIFY`** header; the spec's own `pcrSelect` bitmap examples |
| `src/tpm/key.test.ts` | RFC 6979 §A.2.5 ECDSA P-256 vectors; the EK template's `authPolicy` derived from scratch and compared to the published constant; the restricted-signing rule in both directions |
| `src/tpm/credential.test.ts` | NIST SP 800-38A CFB128-AES128 vectors; KDFa and KDFe re-derived by hand; the full activation path, including the software one |
| `src/eat/measured-component.test.ts` | RFC 10013's own worked examples, including the base64url strings the RFC prints in Figure 4 |
| `src/boot/stages.test.ts` | The published EV_SEPARATOR digest constants |
| `src/rats/verify.test.ts` | Every failure path, the two negative-claim fixtures, and the failure-code table |
| `src/daa/protocol.test.ts` | CDL equations, Join/credential/signature negatives, canonical points/scalars, basename Link, rogue-list semantics, issuer rotation, deterministic vectors, and proof-randomness/credential-interpolation extraction regressions |
| `src/daa/attestation.test.ts` | Empty anonymous `qualifiedSigner`, byte-level statement vector, PCR/nonce binding, and credential/issuer/revocation lesson outcomes |
| `src/tpm/policy.test.ts` | The published TCG EK Credential Profile `authPolicy` re-derived from scratch through `policyUpdate`; Part 2's own worked response-code composition (`0x080 + 0x004 + 0x140 = 0x1c4`); both published `pcrSelect` bitmap examples inside a full `TPML_PCR_SELECTION`; every policy equation recomputed by a second implementation using `@noble/hashes`; every refusal path of `TPM2_PolicyPCR`, `TPM2_PolicyOR`, `TPM2_PolicyCommandCode`, `TPM2_PolicyAuthorize` and the Part 3 §5.6 authorization checks |
| `src/tpm/seal.test.ts` | The sealed `TPMT_PUBLIC` tiled field by field and its Name re-derived; `unique := H(obfuscate ‖ secret)` and the bare-digest version it is not; `KDFa` STORAGE/INTEGRITY re-derived independently; the sensitive area recovered with `@noble/ciphers` rather than this module's wrapping; fixedTPM-parent validation skipping compared with the non-fixed-parent `TPM_RC_BINDING` path; unsupported `nameAlg` returned as `TPM_RC_HASH` rather than an exception; and the remaining response-code paths reached by their own causes |
| `src/acts/sealing.test.ts` | All fifteen named scenarios run to a verdict; the eight required controls asserted as outcomes; the policy proven to bind the selection, the expected digest, the authority and the purpose; branch B proven independent of the state; and every response code the scenarios emit proven to have a row in the act's own reference table |
| `e2e/claims.spec.ts` | Does the page tell the truth — every printed extension re-derived with OpenSSL's SHA-256, the byte map tiled against the blob it describes, each failure path naming its actual cause, DAA statement hash and pairing recomputed independently, verdict retirement, the NEG-1 / THREAT-1 fixtures, and every policy-digest hash stage on the sealed-storage page re-derived with OpenSSL including both halves of the two-hash `PolicyUpdate` |
| `e2e/a11y.spec.ts` | Zero axe WCAG 2.1 A/AA violations across every driven state, at desktop and 380px, with arithmetic contrast and non-text contrast oracles axe does not have |

The GitHub Pages deploy runs all of it and is blocked if any of it fails.

## Performance

Everything runs synchronously in the main thread. The original measured-boot, quote, and appraisal
path remains small. The lazily rendered DAA panel adds several BLS12-381 pairings and is a bounded
teaching transcript, not a throughput or hardware-performance benchmark. It runs only when the
Anonymous Membership tab is first opened; no timing result is presented as a security claim.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Distance Bounding

- **slug**: `crypto-lab-distance-bounding`
- **repo**: https://github.com/systemslibrarian/crypto-lab-distance-bounding
- **live**: https://systemslibrarian.github.io/crypto-lab-distance-bounding/
- **commit_sha**: `4458307b57a02da4362cee5b799f20bdade03fd4` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `56d9958cd800ac7577c03d2ba65734b8a44d2c12`
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | ATTACKS  ·  **level**: advanced  ·  **--accent**: #35d6bb
- **MISSING FIELDS**: subtitle, description, why_it_matters, verification, limitations

**Name (H1)**: Distance bounding: why authentication is not proximity  — _read from src/ui/app.ts_

**Subtitle**: _MISSING_

**Description**: _MISSING_

**Why it matters**: _MISSING_

**Card copy**: Run the verifier-nonce Hancke–Kuhn rapid-bit protocol with exact timing and probability arithmetic, then contrast ordinary relays, mafia pre-asking, distance fraud, channel noise, and broken assumptions.

**Chips**: Hancke–Kuhn · Distance Bounding · Mafia Fraud · Exact Probabilities

**Implements**: HMAC `src/db/sha256.ts:113`, SHA-256 `src/db/sha256.ts:40`

**Attacks shown**: _none derived_

**Standards body**: IETF, NIST

**Implementation**: local TypeScript HMAC-SHA-256, Hancke–Kuhn protocol, exact rational timing/probability and attack-event teaching models

**Spec citations, exactly as written**:

- `10.1007/3-540-48285-7_30.pdf` — first seen README.md:218 (2×)
- `FIPS 180-4` — first seen README.md:57 (3×)
- `RFC 2104` — first seen src/db/sha256.ts:112 (1×)
- `RFC 4231` — first seen README.md:57 (2×)

**Claims tested** (e2e/claims.spec.ts, 20 test(s)):

- `the displayed threshold equals an independently computed 2R/v + delta_lb` — e2e/claims.spec.ts:125
    - :149 `toBe` expected `reduce(num, den)` _(expression)_
    - :150 `toBe` expected `expected` _(expression)_
- `the pinned boundary accepts T = 22 and rejects T = 23` — e2e/claims.spec.ts:154
    - :171 `toBe` expected `"22"` _(literal)_
    - :173 `toBe` expected `true` _(expression)_
    - :174 `toBe` expected `true` _(expression)_
    - :175 `toBe` expected `"0"` _(literal)_
    - :180 `toBe` expected `true` _(expression)_
    - :181 `toBe` expected `true` _(expression)_
    - :182 `toBe` expected `"8"` _(literal)_
    - :183 `toContainText` expected _no expected value_ _(none)_
- `an online relay returns every correct bit and is refused on timing alone` — e2e/claims.spec.ts:188
    - :199 `toHaveLength` expected `8` _(literal)_
    - :201 `toBe` expected `true` _(expression)_
    - :202 `toBe` expected `true` _(expression)_
    - :204 `toBe` expected `true` _(expression)_
    - :205 `toBe` expected `"0"` _(literal)_
    - :206 `toBe` expected `"8"` _(literal)_
    - :207 `toContainText` expected _no expected value_ _(none)_
    - :212 `toBe` expected `"68"` _(literal)_
- `a late round cannot spend the content-error allowance` — e2e/claims.spec.ts:215
    - :228 `toBe` expected `"0"` _(literal)_
    - :229 `toBe` expected `"8"` _(literal)_
    - :230 `toContainText` expected _no expected value_ _(none)_
    - :233 `toContainText` expected _no expected value_ _(none)_
- `disabling the timing check lets the identical relay through` — e2e/claims.spec.ts:239
    - :250 `toContainText` expected _no expected value_ _(none)_
    - :256 `toContainText` expected _no expected value_ _(none)_
    - :259 `toContainText` expected _no expected value_ _(none)_
- `an ordinary authenticated exchange relays and proves no proximity` — e2e/claims.spec.ts:264
    - :269 `expect` expected _no expected value_ _(none)_
    - :274 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :275 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :276 `toBe` expected `"REJECTED"` _(literal)_
    - :277 `toBe` expected `"not run"` _(literal)_
    - :278 `toBe` expected `"not run"` _(literal)_
    - :279 `toHaveCount` expected `0` _(literal)_
    - :280 `toContainText` expected _no expected value_ _(none)_
- `the mafia pre-ask probability matches an independent exact computation` — e2e/claims.spec.ts:285
    - :302 `toBe` expected _no expected value_ _(none)_
    - :306 `toBe` expected `blind(Number(rounds), Number(tolerated))` _(expression)_
    - :311 `toBe` expected _no expected value_ _(none)_
    - :316 `toBe` expected _no expected value_ _(none)_
    - :319 `toBe` expected `"9/256"` _(literal)_
- `a partial pre-ask uses the convolution, not the pure mafia figure` — e2e/claims.spec.ts:322
    - :339 `toBe` expected _no expected value_ _(none)_
    - :346 `toBe` expected _no expected value_ _(none)_
- `distance fraud is conditioned on the realized register distance` — e2e/claims.spec.ts:351
    - :361 `toBe` expected `true` _(expression)_
    - :362 `expect` expected _no expected value_ _(none)_
    - :363 `expect` expected _no expected value_ _(none)_
    - :366 `toBe` expected `distanceFraud(h, 1)` _(expression)_
    - :367 `expect` expected _no expected value_ _(none)_
    - :375 `expect` expected _no expected value_ _(none)_
    - :387 `toBe` expected `""` _(literal)_
    - :388 `toBeVisible` expected _no expected value_ _(none)_
- `the distance-fraud gain equals v(delta_lb - delta_actual)/2` — e2e/claims.spec.ts:391
    - :407 `toContainText` expected `"1"` _(literal)_
    - :408 `toContainText` expected _no expected value_ _(none)_
    - :412 `toBe` expected `"0"` _(literal)_
    - :413 `toBe` expected _no expected value_ _(none)_
    - :417 `toContainText` expected _no expected value_ _(none)_
- `predictable challenges withdraw the 3/4 figure and succeed with certainty` — e2e/claims.spec.ts:422
    - :433 `toBe` expected `"0"` _(literal)_
    - :434 `toContainText` expected _no expected value_ _(none)_
    - :437 `toBe` expected `"1"` _(literal)_
    - :438 `toContainText` expected _no expected value_ _(none)_
- `predictable challenges leave rounds outside a partial pre-ask blind` — e2e/claims.spec.ts:443
    - :454 `toBe` expected _no expected value_ _(none)_
    - :457 `toBe` expected _no expected value_ _(none)_
    - :460 `toContainText` expected _no expected value_ _(none)_
- `predictable challenges make the distance-fraud key holder certain` — e2e/claims.spec.ts:465
    - :475 `toBe` expected `"0"` _(literal)_
    - :476 `toBe` expected `"1"` _(literal)_
    - :477 `toHaveCount` expected `0` _(literal)_
    - :478 `toContainText` expected _no expected value_ _(none)_
- `a reused nonce withdraws the independent-attempts formula` — e2e/claims.spec.ts:483
    - :488 `toContainText` expected _no expected value_ _(none)_
    - :492 `toBe` expected `"a1a1a1a1a1a1a1a1"` _(literal)_
- `honest noise reports exact acceptance and false rejection` — e2e/claims.spec.ts:495
    - :505 `toBe` expected _no expected value_ _(none)_
    - :508 `toBe` expected _no expected value_ _(none)_
    - :514 `toBe` expected `16777216n` _(expression)_
    - :522 `toBe` expected `"8/27"` _(literal)_
    - :523 `toBe` expected `"19/27"` _(literal)_
- `repeated fresh-nonce attempts compound, and a reused nonce withholds them` — e2e/claims.spec.ts:526
    - :545 `expect` expected _no expected value_ _(none)_
    - :549 `toHaveCount` expected `0` _(literal)_
    - :550 `toContainText` expected _no expected value_ _(none)_
- `changing any input retires the transcript and the verdict` — e2e/claims.spec.ts:555
    - :560 `toHaveCount` expected `1` _(literal)_
    - :571 `toHaveCount` expected `1` _(literal)_
    - :573 `toHaveCount` expected `1` _(literal)_
    - :574 `toHaveCount` expected `0` _(literal)_
    - :575 `toContainText` expected `"Inputs changed"` _(literal)_
    - :580 `toHaveCount` expected `1` _(literal)_
    - :582 `toHaveCount` expected `1` _(literal)_
- `a browser clock cannot change the modeled verdict` — e2e/claims.spec.ts:585
    - :596 `toHaveCount` expected `1` _(literal)_
    - :609 `toBe` expected `first` _(expression)_
    - :617 `toBe` expected `first` _(expression)_
- `the visible limits and primary sources do not overstate the model` — e2e/claims.spec.ts:620
    - :624 `toContainText` expected `"not ranging hardware"` _(literal)_
    - :625 `toContainText` expected `"does not establish physical location"` _(literal)_
    - :626 `toContainText` expected _no expected value_ _(none)_
    - :629 `toContainText` expected `"fresh unpredictable verifier nonce"` _(literal)_
    - :630 `toContainText` expected `"prover-chosen nonce"` _(literal)_
    - :631 `toContainText` expected `"multipath"` _(literal)_
    - :632 `toContainText` expected `"Early-detect and late-commit"` _(literal)_
    - :633 `toContainText` expected `"Terrorist fraud"` _(literal)_
    - :634 `toContainText` expected _no expected value_ _(none)_
    - :637 `toContainText` expected _no expected value_ _(none)_
    - :642 `toContainText` expected `"Hancke"` _(literal)_
    - :643 `toContainText` expected `"SecureComm 2005"` _(literal)_
    - :644 `toContainText` expected `"Brands"` _(literal)_
    - :645 `toContainText` expected `"Clulow"` _(literal)_
    - :646 `toContainText` expected `"Avoine"` _(literal)_
    - :647 `toContainText` expected `"Kara"` _(literal)_
    - :648 `toContainText` expected `"Singelée"` _(literal)_
- `distance fraud is never described as a relay or as mafia fraud` — e2e/claims.spec.ts:651
    - :657 `toContainText` expected `"legitimate key holder"` _(literal)_
    - :658 `toContainText` expected `"NOT mafia fraud"` _(literal)_
    - :659 `toContainText` expected `"no relay and no third party"` _(literal)_
    - :660 `toContainText` expected `"retains both propagation legs"` _(literal)_
    - :661 `toContainText` expected _no expected value_ _(none)_

**Mutation records** (1 file(s)):

- `scripts/claim-mutations.mjs` (19659 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-distance-bounding

Executable distance-bounding and relay-attack teaching lab with deterministic timing models.

## What It Is

A browser-only lesson in the gap between **authentication** and **proximity**. A
verifier can confirm it is talking to the right key holder and still have no
idea where that key holder is. Hancke and Kuhn's 2005 protocol closes that gap
by timing a rapid single-bit exchange, so the round trip itself bounds the
distance.

The lab runs the original one-nonce, verifier-nonce protocol on **exact BigInt
rational arithmetic**, computes every attack probability as an exact fraction,
and drives six actor views: an honest prover, an ordinary HMAC-SHA-256
challenge-response that relays successfully, a Hancke-Kuhn online relay, mafia
fraud by pre-asking, distance fraud by a dishonest distant key holder, and an honest
prover on a noisy channel. Four broken controls are available as switches:
nonce reuse, predictable challenges, disabled timing, and an invalid
processing-delay lower bound.

## The protocol profile

Hancke and Kuhn 2005, §3.1, p. 69, with no variation:

`​``
V -> P : N_V                                     fresh, unpredictable, never reused
both   : R0 || R1 := h(K, N_V)                   two n-bit registers
for i = 1..n:
  V -> P : C_i in {0,1}                          unpredictable challenge bit
  P -> V : R_i^{C_i} in {0,1}                    immediate, from a 2-bit lookup
`​``

The paper's optional **prover-nonce** variant, where the registers come from
`h(K, N_V, N_P)` so neither nonce need be unpredictable, is **not implemented**.
It is named on the page, and the response-table grinding a prover-chosen nonce
would allow is listed among the limitations.

### The declared PRF instantiation

The paper does **not** mandate a primitive or a wire format. §3.2 says only that
`h` "may in a typical implementation be some form of secure (i.e. one-way and
collision-resistant) hash function", and that for larger `n` the registers may
come from "a secure pseudo random-bit generator seeded from the output of h".

This lab declares one instantiation and says so in the UI:

`​``
seed    = HMAC-SHA-256(K, DOMAIN || len(N_V) || N_V || len(n))
block_j = HMAC-SHA-256(seed, DOMAIN_EXPAND || be32(j))
R0 || R1 = first 2n bits of block_0 || block_1 || ...
`​``

Bits are taken most significant first within each byte; the first `n` are `R0`
and the next `n` are `R1`. SHA-256 and HMAC are hand-rolled so the model stays
synchronous and exactly replayable, and both are pinned against published
vectors: FIPS 180-4 Appendix B for SHA-256, RFC 4231 for HMAC, plus an
independent cross-check against Node's own implementation across every padding
boundary.

## Timing, in exact arithmetic

Grounded in Hancke and Kuhn §2, p. 68, equations (1) and (2), where `c` is the
propagation speed, `t_p` the one-way propagation time, `t_m` the measured round
trip and `t_d` the processing delay at the remote device:

`​``
(1)  d   = c (t_m - t_d) / 2
(2)  t_m = 2 t_p + t_d
`​``

Written here with `v` for the speed, `T` for the measured round trip and a
**trusted lower bound** `delta_lb` wherever the verifier must stand in for the
unknown `t_d`:

`​``
T_i   = tau_out + delta_P + tau_return
T_i   = 2D/v + delta_P                  symmetric direct path
Theta = 2R/v + delta_lb                 accept iff T_i <= Theta
D_hat = v (T_i - delta_lb) / 2          the displayed upper bound
`​``

**Units are abstract and declared by the scenario**: `v` is distance units per
time unit, `R` is distance units, every delay is time units. The default
profile uses `v = 1`, and the boundary is pinned by test: at `v = 1`, `R = 10`,
`delta_lb = 2` the threshold is exactly `22`, `T = 22` is accepted and `T = 23`
is rejected, with no rounding either side.

`D_hat` is a true upper bound **only while the prover cannot answer faster than
`delta_lb`**. If it can, the verifier subtracts delay that never happened and
the prover appears nearer than it is. That failure has its own executable
negative control, and the exact gain is `v (delta_lb - delta_actual) / 2`.

The distance-fraud actor commits to a response before it sees the challenge,
then begins the return transmission after challenge arrival. The model retains
both propagation legs and removes only the assumed processing delay. It does
not model a radio transmission scheduled before challenge arrival or the
physical synchronization needed for one.

**No browser or machine clock reaches a verdict.** `Date.now`,
`performance.now`, animation duration and real network latency are read nowhere
in the model; a unit test scans the model's own source to prove it, with a
positive control so the scan cannot pass by being broken, and a browser test
freezes and then skews both page clocks and requires the rendered transcript to
be byte-identical.

## Timing and content are checked separately

A late or missing answer is a **timing failure** and can never be absorbed by
the content-error allowance `x`. Any late round rejects the session even when
`x > 0`. Letting a late answer spend that allowance would turn a distance bound
back into an ordinary authentication exchange with extra steps, which is the
confusion the whole lab exists to undo.

## Exact probabilities

All computed as BigInt fractions; decimals appear beside them, never instead of
them. Hancke and Kuhn §3.4, p. 70 writes its two sums in terms of `k`, the
minimum number of correct responses; these are the same statements with
`x = n - k` tolerated errors.

| Quantity                       | Formula                                                      |
| ------------------------------ | ------------------------------------------------------------ |
| Mafia pre-ask                  | `4^-n * sum_{e=0..x} C(n,e) 3^(n-e)`                         |
| Blind responder                | `2^-n * sum_{e=0..x} C(n,e)`                                 |
| Partial pre-ask, `g` pre-asked | exact convolution over the two error counts                  |
| Distance fraud                 | `2^-h * sum_{e=0..min(x,h)} C(h,e)`, on the **realized** `h` |
| Honest false rejection         | `sum_{e=x+1..n} C(n,e) eps^e (1-eps)^(n-e)`                  |
| `q` fresh-nonce attempts       | `1 - (1-P)^q`                                                |

Pinned fixtures, each checked against exhaustive enumeration through `n = 8`:

| Case                                       | Exact value         |
| ------------------------------------------ | ------------------- |
| Mafia `n=8, x=0`                           | `6561/65536`        |
| Mafia `n=8, x=1`                           | `24057/65536`       |
| Blind `n=8, x=1`                           | `9/256`             |
| Partial pre-ask `n=8, g=4, x=0`            | `81/4096`           |
| Distance fraud `h=5, x=1`                  | `3/16`              |
| Honest `n=8, x=1, eps=1/8` acceptance      | `12353145/16777216` |
| Honest `n=8, x=1, eps=1/8` false rejection | `4424071/16777216`  |

Distance fraud is reported on the **realized** register distance
`h = HammingDistance(R0, R1)` for the session in front of you, with the ideal
ensemble average over `h ~ Binomial(n, 1/2)` shown beside it and never instead
of it. An average cannot tell a learner whether this session is the weak one.

`1 - (1-P)^q` is **refused** when the nonce is reused: the attempts are not
independent, and the function takes that independence as an explicit argument
rather than assuming it.

The independent-noise sampler realizes the displayed rational `eps` exactly:
it rejection-samples a uniform integer in `0..d-1` for reduced `eps = n/d` and
flips on exactly `n` outcomes. It does not silently replace `eps` by
`floor(eps * 2^k) / 2^k`. To keep an editable browser input bounded, `d` may be
at most `2^32`.

## The attacker knowledge boundary

The relay and mafia actors receive a `ProverOracle` — one function answering one
challenge in one round — and nothing else. They never receive the key, the
registers or the verifier's expected bits, there is no module-level state
holding any of those, and a unit test reads the attack module's own source to
confirm it imports no register derivation. A further test runs the complete
mafia attack against an oracle built from a key the attack code never sees.

The ordinary-authentication contrast separately computes
`HMAC-SHA-256(K, domain || challenge)`. Its relay receives only the challenge
oracle, returns the genuine tag, and has no key. A changed-tag negative control
fails authentication. This is a bounded comparison transcript, not a complete
deployed authentication protocol.

**Distance fraud is kept separate on purpose.** A distance-fraud actor _is_ the
legitimate key holder behaving dishonestly at a distance. It is not a relay,
there is no third party, and calling it mafia fraud — which several informal
accounts do — misdescribes both the attacker and the defence.

## What this lab does not do

- It is an **arithmetic and event simulator**, not ranging hardware, and it
  contains no radio.
- It **does not establish physical location** and **does not measure nanosecond
  radio propagation**.
- The exact probabilities assume ideal independent PRF output bits, a fresh
  unpredictable verifier nonce, and unpredictable challenges. Where an
  experiment breaks one of those, the page retires the inapplicable formula and
  prints only a newly justified exact case, if one exists.
- A **prover-chosen nonce** may allow response-table grinding. Named, not
  modelled.
- Real jitter, multipath, non-line-of-sight propagation, interference,
  correlated or bursty errors and radio capture effects are **not modelled**.
  The noise model flips each response bit independently, which real channels do
  not.
- The distance-fraud timing model keeps both propagation legs, begins the return
  trip after challenge arrival, and omits only processing delay. Scheduled
  pre-transmission and physical synchronization attacks are outside it.
- **Early-detect and late-commit** behaviour depends on physical-layer symbol
  timing and sits outside the executable core (Clulow et al. 2006).
- **Terrorist fraud**, collusion, localisation and production parameter
  selection are out of scope.
- **Brands-Chaum is referenced for comparison only** and is not implemented.
- Looking random is not evidence of pseudorandomness. The lab runs no
  statistical test that could be mistaken for a proof.

## Primary sources

Read rather than summarised; the sections used are listed on the page itself.

- **G. P. Hancke and M. G. Kuhn, "An RFID Distance Bounding Protocol",
  SecureComm 2005, Athens, 5-9 September 2005, pp. 67-73, IEEE Computer Society
  Press, ISBN 0-7695-2369-2.**
  [PDF](https://www.cl.cam.ac.uk/~mgk25/sc2005-distance.pdf). §2 p. 68
  equations (1) and (2); §3.1 p. 69 the protocol, the 3/4 per-round bound and
  the prover-nonce variant; §3.2 p. 70 the function `h` and its parameters;
  §3.4 p. 70 the false-accept and false-reject sums.
- **S. Brands and D. Chaum, "Distance-Bounding Protocols", EUROCRYPT '93, LNCS
  765, pp. 344-359.**
  [PDF](https://link.springer.com/content/pdf/10.1007/3-540-48285-7_30.pdf).
  Comparison only.
- **J. Clulow, G. P. Hancke, M. G. Kuhn and T. Moore, "So Near and Yet So Far:
  Distance-Bounding Attacks in Wireless Networks", ESAS 2006.**
  [PDF](https://www.cl.cam.ac.uk/~mgk25/esas2006-distance.pdf). Early-detect
  and late-commit, named and left outside the executable core.
- **G. Avoine, M. A. Bingöl, S. Kardaş, C. Lauradoux and B. Martin, "A Framework
  for Analyzing RFID Distance Bounding Protocols", Journal of Computer
  Security, 2010.**
  [PDF](https://sites.uclouvain.be/security/download/papers/AvoineBKLM-2010-jcs.pdf).
  The adversary vocabulary, including the separation of mafia fraud from
  distance fraud.
- **O. Kara, S. Kardaş, M. A. Bingöl and G. Avoine, "Optimal Security Limits of
  RFID Distance Bounding Protocols".**
  [PDF](https://research.sabanciuniv.edu/id/eprint/15328/1/optimal.pdf).
  Security limits for bitwise fast-phase protocols with no final signature,
  the class this protocol belongs to.
- **D. Singelée and B. Preneel, "Distance Bounding in Noisy Environments".**
  [PDF](https://cosicdatabase.esat.kuleuven.be/backend/publications/files/conferencepaper/919).
  Tolerating channel errors without handing the attacker the allowance.

## Build and verify

Node 22, 24 or 26 and newer:

`​``sh
npm ci
npm run ci              # format, typecheck, lint, coverage, build
npx playwright install chromium
npm run test:claims     # browser claims, recomputed independently
npm run test:a11y       # axe, contrast and reflow, pinned dark palette
npm run test:mutations  # clean-baseline source mutations
`​``

Coverage thresholds for `src/db/**` are statements 95, branches 90, functions
95 and lines 95; the suite runs above all four. The browser claim tests
recompute the threshold, the round trips, the register distance and every
displayed probability with arithmetic written inside the test file, so a figure
is checked against an independent computation rather than against the code that
produced it. Fifteen source mutations must each build, move the bundle bytes,
fail one **named** owning assertion as an ordinary test failure, restore byte
for byte, rebuild to the baseline digest and pass again.

### Theming

The lab follows the fleet contract: one dark theme is pinned in the root HTML,
with no toggle and no stored or operating-system preference that can change it.
The accessibility gate scans that same pinned palette under both dark and light
OS preferences so a stray media-query branch cannot escape.

---

_One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite._

_"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31_

```

</details>

---

## Split Point

- **slug**: `crypto-lab-split-point`
- **repo**: https://github.com/systemslibrarian/crypto-lab-split-point
- **live**: https://systemslibrarian.github.io/crypto-lab-split-point/
- **commit_sha**: `323627d35b0e9600533391cdbbe3ab0e51601f19` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `4c5084a5701013d6463e189a3855de873f7f7e96`
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: #4cc9f0
- **MISSING FIELDS**: verification

**Name (H1)**: Split Point  — _read from index.html_

**Subtitle**: Function secret sharing · DPF · 2-server PIR  — _read from index.html_

**Description**: Watch two random-looking key trees unfold level by level, XOR their leaves into a single lit point, and use that point to pull one book off a 65,536-book shelf with a query smaller than one page.  — _read from index.html_

**Why it matters**: Two-server PIR was already private; it was also a query as long as the whole catalog. Function secret sharing makes “which record did you read?” hideable at the size of real collections, and underpins modern private-measurement systems.  — _read from index.html_

**Card copy**: Secret-share a function, not a value: two DPF keys each evaluate to shares of one-at-α, zero everywhere else. Two non-colluding servers fold 65,536 records and neither learns which one you read.

**Chips**: DPF · 2-Server PIR · AES-128-CTR · FSS

**Implements**: AES `src/dpf/prg.ts:1`, Private information retrieval `src/ui/app.ts:9`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: AES-CTR `src/dpf/prg.ts:27`

**Standards body**: NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `doi.org/10.1007/978-3-642-55220-5_26` — first seen README.md:45 (2×)
- `doi.org/10.1007/978-3-662-46803-6_20` — first seen README.md:46 (2×)
- `doi.org/10.1109/SFCS.1995.492461` — first seen README.md:48 (2×)
- `eprint.iacr.org/2018/707` — first seen README.md:47 (2×)
- `EUROCRYPT 2014` — first seen README.md:45 (2×)
- `EUROCRYPT 2015` — first seen README.md:46 (2×)

**README — What Can Go Wrong**:

```text
- **Server collusion:** either key alone hides α — the page measures this as the lit count of one expanded share — and both keys together reconstruct the point function and reveal it.
- **Malicious answers:** a server can corrupt the record without triggering a protocol failure. The page’s `shelf[α]` comparison is an external teaching oracle, not a PIR authentication mechanism, and it reports the corrupted byte count from the run that produced it.
- **Malformed inputs:** out-of-domain α, invalid in-memory or serialized key fields, a shelf with the wrong shape, and mismatched server-answer lengths are rejected with named causes rather than coerced into a different key.
- **Implementation leakage:** this inspectable TypeScript does not claim constant-time execution or side-channel resistance.
- **Work remains linear:** compact queries do not make the server scan sublinear; both servers evaluate the entire shelf.
```

**Claims tested** (e2e/claims.spec.ts, 12 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:8
    - :8 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:21
    - :21 `toHaveAttribute` expected `'data-value', /^\d+$/` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:23
    - :23 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
- `honest PIR output equals the indexed shelf record` — e2e/claims.spec.ts:41
    - :45 `toBeVisible` expected _no expected value_ _(none)_
    - :47 `toBeHidden` expected _no expected value_ _(none)_
    - :48 `expect` expected _no expected value_ _(none)_
    - :49 `expect` expected _no expected value_ _(none)_
    - :52 `toBe` expected `41337` _(literal)_
    - :53 `toBe` expected `expected` _(expression)_
- `each server view verdict reports its own measured fold, not a fixed line` — e2e/claims.spec.ts:65
    - :71 `toBeVisible` expected _no expected value_ _(none)_
    - :88 `expect` expected _no expected value_ _(none)_
    - :89 `expect` expected _no expected value_ _(none)_
    - :90 `expect` expected _no expected value_ _(none)_
    - :91 `expect` expected _no expected value_ _(none)_
    - :92 `toBe` expected `1` _(literal)_
- `the collusion state verdict follows the live trust boundary` — e2e/claims.spec.ts:100
    - :105 `toBeVisible` expected _no expected value_ _(none)_
    - :110 `toHaveCount` expected `2` _(literal)_
- `rendered leaf shares XOR to one point at the displayed alpha` — e2e/claims.spec.ts:113
    - :130 `toHaveLength` expected `1` _(literal)_
    - :131 `toBe` expected `1` _(literal)_
    - :132 `toEqual` expected `reconstruction.map(String)` _(expression)_
    - :133 `toBe` expected `reconstruction.indexOf(1)` _(expression)_
- `key-size claims are measured per level across every domain the page offers` — e2e/claims.spec.ts:147
    - :151 `expect` expected _no expected value_ _(none)_
    - :165 `toBe` expected `1` _(literal)_
    - :167 `toBe` expected _no expected value_ _(none)_
    - :177 `toBe` expected `totals.get(domainBits)` _(expression)_
    - :180 `toBe` expected `domainBits` _(expression)_
    - :184 `expect` expected _no expected value_ _(none)_
    - :188 `toBe` expected `domainBits` _(expression)_
    - :191 `expect` expected _no expected value_ _(none)_
    - :197 `toBe` expected _no expected value_ _(none)_
    - :205 `toBe` expected `domainSize` _(expression)_
    - :216 `toEqual` expected `[` _(expression)_
- `changing alpha retires stale output while a no-op does not` — e2e/claims.spec.ts:230
    - :234 `toBeHidden` expected _no expected value_ _(none)_
    - :236 `toContainText` expected `'Previous reconstruction for α = 11 retired'` _(literal)_
    - :239 `toHaveText` expected `'4'` _(literal)_
    - :241 `toBe` expected `0` _(literal)_
- `tampering violates integrity while every privacy verdict remains green` — e2e/claims.spec.ts:244
    - :249 `toHaveCount` expected `3` _(literal)_
    - :250 `toBeChecked` expected _no expected value_ _(none)_
    - :251 `toHaveCount` expected `0` _(literal)_
    - :254 `toBe` expected `expected` _(expression)_
- `the negative claim reports the run that exercised it` — e2e/claims.spec.ts:265
    - :270 `toBeVisible` expected _no expected value_ _(none)_
    - :284 `toBe` expected `actual` _(expression)_
    - :285 `expect` expected _no expected value_ _(none)_
    - :286 `expect` expected _no expected value_ _(none)_
- `the negative claim says it was not exercised when nothing was tampered with` — e2e/claims.spec.ts:289
    - :297 `toBeVisible` expected _no expected value_ _(none)_
    - :302 `toContainText` expected `'no answer was altered'` _(literal)_

**Mutation records** (2 file(s)):

- `e2e/verdict-mutations.json` (16602 bytes)
- `scripts/mutation.mjs` (15480 bytes)

<details><summary>Full README</summary>

```markdown
# Split Point

## What It Is

Split Point is an interactive implementation of the two-party distributed point function (DPF) from Boyle, Gilboa, and Ishai and its application to two-server XOR private information retrieval (PIR). A client splits the function “return 1 only at index α” into two compact keys. Each server expands one key over the public shelf, folds the selected record shares, and returns one answer; XORing the answers recovers `shelf[α]` without either non-colluding server receiving α.

The teaching implementation supports domains from $2^4$ through $2^{16}$. Its pseudorandom generator uses real AES-128-CTR from the audited `@noble/ciphers` library. The synchronous library API keeps every tree step inspectable in the browser; it is not simulated math. This is not production cryptography: the TypeScript favors inspection over side-channel resistance, has not received a security audit, and keeps ephemeral keys only in browser memory.

## Exhibits

1. **Tree Microscope** — step two real DPF evaluations level by level, inspect their seed/control state, and XOR the leaf rows into one lit point at α. The headline verdict reports the index the two shares actually reconstruct, read back from `EvalAll`, not the index the slider asked for.
2. **Private Shelf** — generate two fresh keys, have two independent server functions scan 65,536 deterministic 16-byte records, and compare the reconstructed record with `shelf[α]`. Each server tile reports its own party, its key length, and how many of the 65,536 records its share actually selected into the fold.
3. **Query Scale** — compare one measured serialized DPF key with the full-domain Chor XOR query and verify that the displayed key parts sum to the measured total.
4. **Collusion** — deliberately give both keys to one server and watch α become visible inside that server’s view. With collusion off, the page states the one-key case as a count: how many leaves the single expanded share lights, which is what “no distinguished target” means.
5. **Tampering** — flip one bit in a server answer. Every privacy condition still passes, but the client retrieves the wrong record because this PIR does not authenticate answers. The page names the damage from that run: how many bytes of the record differ, and that reconstruction raised nothing.

Every verdict the page renders carries a `data-verdict` marker and turns on a value the page computed, and every number it renders **in a result region** carries a `data-claim` marker with the measurement behind the words in `data-value`. One figure sits outside that rule on purpose: the elapsed time in `#fetch-status`, which reports how long this device took rather than anything the protocol determines, and which `verdict-scan.ts` excludes by scanning result regions rather than status prose. The scope is written into the checker, not assumed. None of the marked claims is a fixed string, and the key-size meter states the parts it measured for the domain actually selected, not the default one.

## When to Use It

Use a DPF when two non-colluding parties need compact additive or XOR shares of a point function, including two-server PIR and some private measurement protocols. The construction trades communication for server work: each server still evaluates over the full domain.

Do **not** use this demo as a cryptographic library or deploy this exact PIR where servers may collude. Do not use it when malicious servers must be detected; this construction provides query privacy, not answer integrity. It also does not implement multi-point, interval, comparison, incremental, verifiable, batched, single-server, or three-party FSS/PIR.

## Live Demo

[Open Split Point on GitHub Pages](https://systemslibrarian.github.io/crypto-lab-split-point/).

Move α and regenerate the two trees, step backward through their expansion, fetch a record from the full 65,536-record shelf, compare key sizes, and turn on the collusion or tamper fixtures.

## What Can Go Wrong

- **Server collusion:** either key alone hides α — the page measures this as the lit count of one expanded share — and both keys together reconstruct the point function and reveal it.
- **Malicious answers:** a server can corrupt the record without triggering a protocol failure. The page’s `shelf[α]` comparison is an external teaching oracle, not a PIR authentication mechanism, and it reports the corrupted byte count from the run that produced it.
- **Malformed inputs:** out-of-domain α, invalid in-memory or serialized key fields, a shelf with the wrong shape, and mismatched server-answer lengths are rejected with named causes rather than coerced into a different key.
- **Implementation leakage:** this inspectable TypeScript does not claim constant-time execution or side-channel resistance.
- **Work remains linear:** compact queries do not make the server scan sublinear; both servers evaluate the entire shelf.

## Real-World Usage

Distributed point functions are a compact foundation for two-server PIR and function secret sharing. The line of work starts with Gilboa and Ishai’s DPF formulation and PIR application, continues through Boyle, Gilboa, and Ishai’s FSS constructions and improved early-termination DPF, and appears as a building block in private telemetry and measurement systems. The VDAF draft’s incremental DPF is a different construction and is not implemented here.

Primary sources:

- [Gilboa & Ishai, “Distributed Point Functions and Their Applications,” EUROCRYPT 2014](https://doi.org/10.1007/978-3-642-55220-5_26)
- [Boyle, Gilboa & Ishai, “Function Secret Sharing,” EUROCRYPT 2015](https://doi.org/10.1007/978-3-662-46803-6_20)
- [Boyle, Gilboa & Ishai, “Function Secret Sharing: Improvements and Extensions”](https://eprint.iacr.org/2018/707)
- [Chor, Goldreich, Kushilevitz & Sudan, “Private Information Retrieval,” FOCS 1995](https://doi.org/10.1109/SFCS.1995.492461)

## How to Run Locally

Requires Node.js 20 or newer.

`​``bash
npm install
npm run dev
`​``

Vite prints the local development URL. To exercise the production artifact and all gates:

`​``bash
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:a11y
`​``

## Related Demos

- [Shelf Oracle](https://systemslibrarian.github.io/crypto-lab-shelf-oracle/) — the single-server PIR boundary this lab deliberately does not cross.
- [Oblivious Shelf](https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/) — private shelf access and the full-length XOR-query baseline.
- [Patron Shield](https://systemslibrarian.github.io/crypto-lab-patron-shield/) — privacy vocabulary around a reader and a catalog.

## Build & Verify

The repository has **55 cryptographic and browser checks**: 30 Vitest unit/property tests and 25 Playwright browser tests, plus five build-enforced maintenance controls. Unit tests cover every supported domain size with a rejection-sampled α that is uniform for any bound rather than only for the divisors of its draw width, independent point-vector reconstruction, single-point versus full-domain evaluation, strict serialization, rejection of malformed in-memory keys, server API isolation, progressive and synchronous PIR reconstruction, the measured fold count each server's own share produces, the single-key view, record widths beyond one AES block, malformed inputs, collusion, and answer tampering. Browser tests also prove completed and in-flight PIR evidence is retired when any controlling input changes. Current measured core coverage is 96.66% statements, 98.26% lines, 98.03% functions, and 93.33% branches.

There are **0 published known-answer tests** for this exact randomized BGI tree-DPF variant: a search of the primary paper and appendices found proofs and algorithms but no fixed seed/key/output vectors. No vectors were invented. Correctness instead uses randomized properties at every supported domain size plus an independent naive point vector compared leaf by leaf.

The Playwright suite builds before serving and checks the production bundle on the fleet-unique port `4698`. It includes rendered mathematical claims, honest/tampered/colluding flows, retirement and no-op behavior, `[hidden]` containment, desktop/mobile reflow, axe WCAG 2.1 A/AA, arithmetic text contrast, and per-side non-text control contrast.

A separate **verdict coverage** gate walks the page through every state that can render an outcome and derives coverage from the DOM rather than from a list. The walk visits every option of every control that changes what renders — each control on its own, never the cross-product — because that walk is the denominator both coverage rules and both stray scans enumerate over: anything reachable only at a setting it never visits is outside the set they judge.

It fails when a `data-verdict` verdict or a `data-claim` measurement has no mutation recorded in `e2e/verdict-mutations.json`, when a registered mutation names a marker the page never renders, when a marker renders without a status or without a numeric value, and when verdict wording, verdict styling or a rendered measurement appears outside a marker — the raw banner, or the stray number, a careless builder adds later. It injects both and asserts the scans catch them, so neither scan can pass by being blind.

Every recorded mutation must also be killed through `expectVerdict`/`expectClaim`, and that is asserted over the run rather than over the spec's source. Those helpers assert a marker's words, its machine-readable state or value, and its painted plate in one call — the plate **derived** from the asserted outcome, never supplied beside it, because a reader is never shown an alarm outcome on the success plate. Text alone is not an assertion of state: a mutation that pinned the record verdict's plate green while its words read RETRIEVED — AND WRONG used to pass the whole suite.

Each helper appends the `(spec, test, marker)` triple of every call it executes to a run-scoped ledger, cleared once per run, and `e2e/verdict-ledger.spec.ts` reads those back and fails when a record's triple is not among them. It is its own Playwright project with `dependencies:` on the specs that write the ledger, because Playwright runs tests in separate worker processes and a module-level set cannot aggregate across them. `npm run test:verdicts` runs that project, and its dependency with it.

The rule this replaces was a regex over spec source naming a FILE, and a regex over source cannot tell a live assertion from one commented out, from one in an unrelated test elsewhere in the same file, or from one handed the page's own values. All three shipped a live mutation green here. Each record therefore also declares the outcome and one text fragment its killing assertion must require, which is what an expectation lifted out of the marker it judges fails against: on an unmutated tree a tautological expectation and an honest one are the same values, so only something decided before the run can separate them.

Each entry in that file names a mutation that has been applied and watched to turn its own assertion red, with the unmutated baseline passing in the same run.

That gate is its own job in `deploy.yml` and a required check on `main`, and both `deploy` and `dependabot-auto-merge` declare `needs: [build, verdict-coverage]`, so nothing ships past it. GitHub Pages deploys only after the unit, build, browser, and verdict-coverage gates pass.

## Performance

At $N = 65{,}536$, one serialized key is 290 bytes in this teaching encoding:

$$
17 + 17\log_2 N + 1 = 290\text{ bytes}
$$

The Chor XOR baseline sends $N$ bits, or 8,192 bytes. DPF communication grows as $O(\lambda \log N)$ while each server’s `EvalAll` and shelf fold remain $O(N)$. Exact browser timing depends on the device and is reported after every fetch rather than presented as a benchmark.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Fold Gate

- **slug**: `crypto-lab-fold-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-fold-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-fold-gate/
- **commit_sha**: `7c7ec5124e9bf9cfbf7a21691d332d91af836aec` (the commit these bytes were read from)
- **clone is 4 commit(s) behind** `origin/main` `989d754061245cb85d914da74a7f65f20b9724fe`
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | ZERO-KNOWLEDGE  ·  **level**: advanced  ·  **--accent**: #5e7ce2
- **MISSING FIELDS**: verification

**Name (H1)**: Fold Gate  — _read from src/ui/app.ts_

**Subtitle**: Folding schemes · Nova NIFS · relaxed R1CS  — _read from src/ui/app.ts_

**Description**: Slide two instance cards into one, expose the cross term between them, fold up to sixty-four steps, and open one final witness.  — _read from src/ui/app.ts_

**Why it matters**: Folding lets recursive proof systems advance a virtual machine one step at a time while retaining one compact instance. The ordering of one transcript hash is what prevents the prover from choosing the correction after seeing the challenge.  — _read from src/ui/app.ts_

**Card copy**: Combining two satisfying R1CS instances leaves a computable cross term; relax the system with a slack scalar and an error vector to absorb it, and one folded instance stands in for all of them.

**Chips**: Nova NIFS · Relaxed R1CS · Pedersen Commitment · ristretto255

**Implements**: Hash-to-curve `src/commit/pedersen.ts:10`, Pedersen commitment `src/attack/r-first.ts:1`, ristretto255 `src/commit/pedersen.ts:1`, SHA-512 `src/nifs/transcript.ts:26`

**Attacks shown**: _none derived_

**References**: EC point arithmetic, Ed25519, Fiat-Shamir, STARK, Shamir secret sharing

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `CRYPTO 1991` — first seen README.md:142 (2×)
- `CRYPTO 2022` — first seen README.md:140 (2×)
- `doi.org/10.1007/3-540-46766-1_9` — first seen README.md:142 (2×)
- `doi.org/10.1007/978-3-540-92600-6_1` — first seen README.md:141 (2×)
- `eprint.iacr.org/2021/370` — first seen README.md:5 (3×)
- `RFC 9380` — first seen README.md:9 (6×)
- `rfc9380` — first seen README.md:143 (4×)

**README — What Can Go Wrong**:

```text
- Revealing the Fiat-Shamir challenge before committing $T$ lets a dishonest prover solve backward for a correction that hides an unsatisfying step.
- Changing $W'$ after folding breaks both the witness commitment and the relaxed constraints.
- Changing $Com(T)$ after deriving $r$ changes the transcript challenge and is rejected.
- A zero challenge is rejected and re-derived under a domain-separated retry byte.
- Instances with $u = 0$, malformed vectors, and mismatched witness sizes fail closed.
- The UI caps histories at 64 steps; that cap is a teaching and responsiveness choice, not a cryptographic bound.
```

**Claims tested** (e2e/claims.spec.ts, 6 test(s)):

- `the rendered instances are the R1CS this lab describes` — e2e/claims.spec.ts:42
- `rendered T exactly matches the cross term, and r follows from it` — e2e/claims.spec.ts:60
- `the folded instance is the linear combination the page claims` — e2e/claims.spec.ts:79
- `the final opening reproduces the accumulated commitments` — e2e/claims.spec.ts:104
    - :112 `toContainText` expected `'FOLDED 2 → 1, VALID'` _(literal)_
- `each attack path names the real cause and the broken mode forges` — e2e/claims.spec.ts:132
    - :134 `toContainText` expected `'the relaxed constraints and the witness commitment disagree'` _(literal)_
    - :137 `toContainText` expected `'recomputed challenge no longer matches'` _(literal)_
    - :140 `toContainText` expected `'unsatisfying'` _(literal)_
- `[hidden] states do not paint` — e2e/claims.spec.ts:147
    - :149 `toBe` expected `0` _(literal)_

**Mutation records** (2 file(s)):

- `e2e/verdict-mutations.ts` (52328 bytes)
- `scripts/mutation.mjs` (17581 bytes)

<details><summary>Full README</summary>

```markdown
# Fold Gate

An inspectable browser lab for Nova's non-interactive folding scheme, relaxed R1CS, and homomorphic Pedersen commitments over ristretto255.

[Live demo](https://systemslibrarian.github.io/crypto-lab-fold-gate/) · [Nova paper](https://eprint.iacr.org/2021/370) · [MIT license](LICENSE)

## What It Is

Fold Gate shows why a random linear combination of two satisfying quadratic constraint systems is not generally satisfying, then computes the exact cross term that Nova's relaxed R1CS absorbs. It implements a two-row R1CS for $y = x^3 + 3$, Nova's NIFS cross term, SHA-512 Fiat-Shamir transcripts, and homomorphic Pedersen vector commitments over ristretto255 using generators derived by RFC 9380 hash-to-group.

The arithmetic and group operations are real. The lab deliberately uses one curve instead of Nova's curve cycle and opens the final folded witness instead of proving it recursively. It is not production crypto, an audited prover, a recursive SNARK, or a zero-knowledge system.

## Exhibits

1. **Fold walkthrough** starts with two satisfying R1CS instances, demonstrates the failed plain combination, reveals $T$, derives $r$, and shows $E' = E_1 + rT + r^2E_2$ restoring satisfaction.
2. **Verifier lane** exposes only $u$, public inputs, and commitments to $E$, $W$, and $T$. Private witness and error vectors do not cross the NIFS verifier boundary.
3. **Multi-step fold** executes and folds 2, 4, 8, 16, 32, or 64 real $x^3 + 3$ steps, measuring the verifier's group-operation cost at each individual fold and reporting the measured per-fold figure, whether it stayed constant across the chain, and what the whole chain cost.
4. **Final opening** recomputes the folded residual and re-derives $Com(W')$ and $Com(E')$ from the values it prints, against the commitments the verifier accumulated with `foldPublic` and never saw a witness for. Because those printed values alone reopen both commitments, nothing is withheld: this NIFS alone is neither zero-knowledge nor a succinct final proof.
5. **Break it yourself** catches witness tampering and post-transcript $T$ tampering, then demonstrates a successful forgery when a broken verifier reveals $r$ before $T$ is committed.
6. **Inspectable internals** publish the matrices, witness layout, transcript order, generator DST, edge-case policy, and extension boundaries.

## When to Use It

Use this lab to learn relaxed R1CS folding, review the algebra behind Nova NIFS, or test an explanation of commitment-first Fiat-Shamir ordering. It is also a compact reference for separating public verifier inputs from the witness opened by a final check.

Do **not** use this code to prove production computations, benchmark production provers, claim zero knowledge, or replace a recursive verifier circuit and compressing SNARK.

## Live Demo

Open [Fold Gate on GitHub Pages](https://systemslibrarian.github.io/crypto-lab-fold-gate/). Step through the failed plain fold, run up to 64 folds, open the result, and launch each tampering mode against the real implementation.

## What Can Go Wrong

- Revealing the Fiat-Shamir challenge before committing $T$ lets a dishonest prover solve backward for a correction that hides an unsatisfying step.
- Changing $W'$ after folding breaks both the witness commitment and the relaxed constraints.
- Changing $Com(T)$ after deriving $r$ changes the transcript challenge and is rejected.
- A zero challenge is rejected and re-derived under a domain-separated retry byte.
- Instances with $u = 0$, malformed vectors, and mismatched witness sizes fail closed.
- The UI caps histories at 64 steps; that cap is a teaching and responsiveness choice, not a cryptographic bound.

## Real-World Usage

Folding schemes are a foundation for incrementally verifiable computation and recursive proof systems. Nova combines a folding scheme with an augmented step circuit and later compression; production descendants and related systems add curve-cycle engineering, recursive verification, zero knowledge, and efficient final proofs. This lab isolates the NIFS mechanism rather than claiming those surrounding properties.

## How to Run Locally

Requires Node.js 22 or newer.

`​``bash
npm ci
npm run dev
`​``

Vite prints the local URL. For the exact production bundle:

`​``bash
npm run build
npm run preview
`​``

## Related Demos

- [SNARK Arena](https://systemslibrarian.github.io/crypto-lab-snark-arena/) for proof-system tradeoffs and final compression context.
- [Polynomial Forge](https://systemslibrarian.github.io/crypto-lab-polynomial-forge/) for polynomial commitment mechanics.
- [STARK Tower](https://systemslibrarian.github.io/crypto-lab-stark-tower/) for a contrasting transparent proof architecture.

## Build & Verify

`​``bash
npm test               # 18 unit/property tests
npm run test:coverage  # V8 statement/branch/function/line coverage
npm run build          # strict TypeScript + Vite production build
npm run test:a11y      # 17 production-browser verdict, claims, and accessibility tests
`​``

The 18 unit tests cover exact cross-term absorption, 64 deterministic field samples, repeated folds, malformed vectors, commitment homomorphism, generator derivation, transcript binding, verifier isolation, final opening, tampering, the challenge-first forgery, and the verifier cost instrumentation. Coverage is gated at 95% statements/lines, 85% branches, and 85% functions across the cryptographic modules. The 19 Playwright tests independently recompute displayed R1CS claims with `BigInt`, compare the rendered folded error commitment against a re-commitment of the opened values, count the real `foldPublic` group operations with a stand-in written for the test alone, exercise verdict retirement and its no-op guard, check real UI states with axe, compute text and control contrast, and check mobile overflow.

**KAT count: 0.** The supplied Nova construction does not publish a standardized NIFS known-answer vector for this toy R1CS. The lab does not invent one; it uses algebraic property tests, independent browser re-derivation, and deterministic RFC 9380 generator checks instead.

The accessibility gate runs against `vite preview` on the committed unique port `4695`. It is a real-state gate with reduced-motion emulation, axe A/AA plus incomplete-result rejection, arithmetic contrast oracles, and a `[hidden]` paint probe.

## Every Rendered Verdict And Every Rendered Number Is Computed, And Proved So

Each outcome this lab paints carries a `data-verdict` marker and each measurement carries a
`data-claim` marker, and every one of them branches on a value the page computed — nothing is
printed unconditionally. `e2e/verdict-mutations.ts` records, per marker of either family, the
mutation that makes it go red, the verbatim passing baseline from the unmutated run, and the
verbatim failure. `e2e/verdicts.spec.ts` derives coverage from the rendered page rather than from
any list, and fails if a marker has no recorded mutation, if a recorded mutation names a marker
that no longer renders, or if verdict words, verdict styling, or a bare rendered number are
painted in a result region outside any marker. That job — `verdict-coverage` — is a required check
and `deploy` depends on it, so it blocks a direct push to `main` as well as a pull request.

Five things make that a real gate rather than a shape:

- **A marker's words, its `data-result` and its styling are ONE claim**, asserted together by
  `expectVerdict()` in `e2e/markers.ts` (or `expectClaim()` for a measurement), so a mutation that
  flips the sentence while the marker keeps saying pass in every way a reader can see is a build
  failure, not a recorded kill.
- **The record is held against what RAN, not against what the spec says.** Both helpers append the
  `(test title, marker)` pair they are executing to a run-scoped sink, cleared in `globalSetup`,
  and `e2e/coverage-replay.spec.ts` — a second Playwright project that `dependencies:` on the
  first, so the ordering is declared rather than incidental — fails unless every recorded
  mutation's pair turns up in it. This replaced a scan of the spec's source text, which a comment,
  a branch that never runs, and a call belonging to another test all satisfied: under the first of
  those, a live flip of the chain verdict's `data-result` shipped green, the page reading
  `FOLDED 8 → 1, VALID` while its machine-readable result said `fail`. The source scan is still
  run, because it names a mistyped marker id at the line it was typed, but nothing rests on it.
- **A marker's oracle may not be the marker.** An assertion handed the marker's own rendered value
  executes, names the right helper, and passes on every page including a mutated one — so neither
  rule above can see it. `oracleDependenceFailures()` in `e2e/coverage-rules.ts` follows each local
  variable back to where it was assigned and fails a record whose expectation traces to a read of
  its own marker. It is per marker rather than per test, which is what lets this lab's deliberate
  cross-derivations stand: `r`'s oracle is built from the rendered `plain-residual` and
  `plain-residual`'s from the rendered `r`, and each opened vector predicts the other's challenge.
- **A number is a claim too, and an easier one to ship unchecked**, because a number does not look
  like a claim. Marking the measurements found four numbers the page painted with nothing behind
  them, one of which — the FINAL OPEN meter — was a hand-written `1 W + 1 E` that disagreed with
  the page's own opened length of one W and two E.
- **The walk is the denominator.** `driveEveryState` visits every option of every control that
  changes what renders — all six step counts, not just the default — each control on its own
  rather than the cross-product. A marker that renders only at 64 steps is outside the set the
  coverage rules judge unless the walk reaches it, however carefully those rules are written.

Two things this replaced are worth naming. The chain, final-opening and three attack verdicts used
to be fixed strings: forcing `finalCheck` to return `valid: false` left every browser test green
and the page still read "FOLDED 8 → 1, VALID". And the final check compared `commit(W')` against a
commitment derived from that same `W'`, so its commitment half could not fail; the verifier now
accumulates $Com(W')$ and $Com(E')$ homomorphically through the chain and the final check compares
against those.

## Performance

The verifier performs **six** ristretto255 group operations per fold in this teaching construction — three scalar multiplications and three point additions — measured by running the real `foldPublic` over instrumented points, not asserted by a constant. Earlier versions of this file said five; that figure was hard-coded and wrong, and the page now renders the measurement.

Per-fold cost is what stays constant. Total verifier work is not: this lab builds the NIFS only, so the verifier performs every fold itself, and folding eight steps means seven folds — 42 group operations — plus one final check. Collapsing a whole chain into a single verifier step is IVC's property, which needs the augmented recursive circuit this lab deliberately does not build. The final check commits and opens one step-width witness plus the error vector; that cost does not grow with the number of folded steps, but it is not a succinct proof. No comparison with production Nova implementations is claimed.

## References

- Kothapalli, Setty, and Tzialla, [Nova: Recursive Zero-Knowledge Arguments from Folding Schemes](https://eprint.iacr.org/2021/370), CRYPTO 2022.
- Valiant, [Incrementally Verifiable Computation or Proofs of Knowledge Imply Time/Space Efficiency](https://doi.org/10.1007/978-3-540-92600-6_1), TCC 2008.
- Pedersen, [Non-Interactive and Information-Theoretic Secure Verifiable Secret Sharing](https://doi.org/10.1007/3-540-46766-1_9), CRYPTO 1991.
- [RFC 9380: Hashing to Elliptic Curves](https://www.rfc-editor.org/rfc/rfc9380).

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*
```

</details>

---

## HTTPS Padlock

- **slug**: `crypto-lab-https-padlock`
- **repo**: https://github.com/systemslibrarian/crypto-lab-https-padlock
- **live**: https://systemslibrarian.github.io/crypto-lab-https-padlock/
- **commit_sha**: `6fbb4eefd7f9649ceb275dbce3c412c2e1c4171d` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | SIGNATURES  ·  **level**: beginner  ·  **--accent**: #ffb84d
- **MISSING FIELDS**: verification

**Name (H1)**: HTTPS Padlock  — _read from index.html_

**Subtitle**: X.509 · TLS 1.3 · what the padlock means  — _read from index.html_

**Description**: Parses the certificate a real site presented, walks the chain to a root that was trusted before you arrived, and lets you break each check in turn — then shows you a flawless certificate for a name that is not your bank.  — _read from index.html_

**Why it matters**: Almost everyone has been told the padlock means a site is safe. It does not say that, and it never did. Knowing exactly where its promises stop is the difference between reading a certificate and trusting a logo.  — _read from index.html_

**Card copy**: Takes apart a certificate a real site presented, lets you break each of its four checks in turn, then shows a flawless certificate for a lookalike domain that passes every one. Reads captured certificates; it never connects to a site.

**Chips**: X.509 · ECDSA P-256 · RFC 5280 Subset · ClientHello Bytes Only

**Implements**: ECDSA `src/pki/path.ts:86`, X25519 `src/tls/clienthello.ts:282`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: P-256 `src/tls/clienthello.ts:190`, P-384 `src/tls/clienthello.ts:193`, RSA `src/pki/assess.ts:58`, RSA-PSS `src/tls/clienthello.ts:191`, SHA-256 `src/pki/parse.ts:112`, SHA-384 `src/tls/clienthello.ts:193`, SHA-512 `src/tls/clienthello.ts:195`, TLS 1.3 `src/pki/assess.ts:59`

**References**: ChaCha20, ChaCha20-Poly1305, ECDH, Encrypted Client Hello, P-256, P-384, Poly1305, RSA, SHA-256, SHA-384, TLS 1.3

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 2606` — first seen scripts/mint-toy-pki.mjs:100 (1×)
- `RFC 5280` — first seen README.md:23 (7×)
- `RFC 6066` — first seen README.md:24 (4×)
- `RFC 6125` — first seen README.md:24 (6×)
- `RFC 8446` — first seen README.md:24 (10×)

**README — What Can Go Wrong**:

```text
- **Reading the padlock as a safety badge.** It is a statement about a connection and a name.
  The attacker exhibit exists because this is the single most common and most costly
  misreading, and it is a misreading of a *correct* result.
- **Expecting a domain-validated certificate to identify a company.** It attests control of a
  name. `CN=github.com` carries no organization field at all, and its issuing CA has `DV` in
  its own name.
- **Assuming the hostname is private.** It is in the clear in the first packet, in this
  example — Encrypted ClientHello is the extension that hides it, and this message does not
  use one. [Blind Hello](https://systemslibrarian.github.io/crypto-lab-blind-hello/) is the lab
  for that fix.
- **Assuming the best cryptography was negotiated.** Negotiation happens before anyone has
  authenticated — though TLS 1.3 *does* check afterwards that the conversation was not
  altered, so this is not a free downgrade. What a padlock still does not tell you is which
  option was chosen.
  [Downgrade Wire](https://systemslibrarian.github.io/crypto-lab-downgrade-wire/) goes into it.
- **Trusting a chain because it validates.** Validation is a statement about signatures, names
  and dates. The lab's own store contains a toy root precisely so you can watch a perfect
  validation of a certificate you should not trust.
- **Confusing the lab's clock with yours.** The lab pins its own instant, stated on the page,
  so the expiry lesson cannot rot into an accident.
```

**Claims tested** (e2e/claims.spec.ts, 61 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:33
    - :33 `toHaveCount` expected `1` _(literal)_
- `the headline verdict` — e2e/claims.spec.ts:45
- `the padlock verdict reports the computed outcome, not a canned banner` — e2e/claims.spec.ts:46
    - :54 `toHaveCount` expected `4` _(literal)_
    - :55 `toHaveCount` expected `0` _(literal)_
- `the chain-length claim equals the boxes the page actually drew` — e2e/claims.spec.ts:58
- `signatures-checked sums to the number of links drawn` — e2e/claims.spec.ts:69
    - :74 `toBe` expected `'${links} of ${links}'` _(expression)_
- `promise 1, the key` — e2e/claims.spec.ts:78
- `the key check reports the curve the certificate actually carries` — e2e/claims.spec.ts:79
    - :88 `expect` expected _no expected value_ _(none)_
    - :92 `expect` expected _no expected value_ _(none)_
    - :99 `expect` expected _no expected value_ _(none)_
    - :101 `expect` expected _no expected value_ _(none)_
- `promise 2, the name check, re-derived independently` — e2e/claims.spec.ts:110
- `the page's name verdict agrees with an independent match of "${address}"` — e2e/claims.spec.ts:131
    - :140 `expect` expected _no expected value_ _(none)_
- `URL authority controls the name verdict and ClientHello: ${address}` — e2e/claims.spec.ts:150
    - :155 `toHaveAttribute` expected `'data-result', 'fail'` _(expression)_
    - :158 `toHaveAttribute` expected `'data-result', 'pass'` _(expression)_
- `pasted URL badges preserve their complete text without page overflow at ${width}px` — e2e/claims.spec.ts:170
    - :180 `toHaveAttribute` expected `'data-result', expected === 'pass' ? 'fail' : 'pass'` _(expression)_
    - :182 `toHaveAttribute` expected `'data-result', expected` _(expression)_
    - :184 `toBeVisible` expected _no expected value_ _(none)_
    - :185 `toContainText` expected `address` _(expression)_
    - :187 `expect` expected _no expected value_ _(none)_
- `a failing name check names the actual cause` — e2e/claims.spec.ts:192
- `promise 4, expiry, re-derived from the dates on screen` — e2e/claims.spec.ts:202
- `the time verdict agrees with an independent date comparison` — e2e/claims.spec.ts:203
    - :213 `expect` expected _no expected value_ _(none)_
- `an expired certificate says so, with the signatures still good` — e2e/claims.spec.ts:220
    - :228 `toHaveCount` expected `0` _(literal)_
- `promise 3, vouching` — e2e/claims.spec.ts:232
- `one flipped bit turns the vouching verdict red and names why` — e2e/claims.spec.ts:233
- `the root is reported as coming from the device, not the server` — e2e/claims.spec.ts:246
    - :251 `expect` expected _no expected value_ _(none)_
    - :254 `toHaveCount` expected `1` _(literal)_
- `a self-signed leaf is rejected and the page says it signed itself` — e2e/claims.spec.ts:260
- `the negative claim: a valid certificate does not establish the operator` — e2e/claims.spec.ts:280
- `1. the fixture is reachable through the UI` — e2e/claims.spec.ts:281
    - :284 `toBeChecked` expected _no expected value_ _(none)_
    - :285 `toHaveValue` expected `'login.yourbank-security.example'` _(literal)_
- `2. every verdict the page renders in that state reports success` — e2e/claims.spec.ts:288
    - :296 `toHaveCount` expected `4` _(literal)_
    - :297 `toHaveCount` expected `4` _(literal)_
    - :300 `expect` expected _no expected value_ _(none)_
    - :301 `toHaveCount` expected `links` _(expression)_
- `3. the limitation is on screen in that state, as the lab\` — e2e/claims.spec.ts:309
    - :320 `expect` expected _no expected value_ _(none)_
    - :328 `toBeVisible` expected _no expected value_ _(none)_
    - :329 `toBe` expected `true` _(expression)_
- `the claim holds on the real chain too, where nothing is wrong at all` — e2e/claims.spec.ts:332
    - :334 `toHaveCount` expected `4` _(literal)_
    - :339 `expect` expected _no expected value_ _(none)_
- `the other three non-promises are shown, not asserted` — e2e/claims.spec.ts:344
- `honesty is not established, and says so with every check passing` — e2e/claims.spec.ts:345
    - :352 `toBe` expected `'yes'` _(literal)_
- `the hostname is readable in the bytes the page printed` — e2e/claims.spec.ts:355
    - :367 `toBe` expected `true` _(expression)_
    - :373 `toBe` expected `address` _(expression)_
    - :381 `expect` expected _no expected value_ _(none)_
    - :382 `toBe` expected `trueOffset` _(expression)_
- `the cipher list is unauthenticated NOW and checked later, both stated` — e2e/claims.spec.ts:391
    - :397 `expect` expected _no expected value_ _(none)_
    - :404 `expect` expected _no expected value_ _(none)_
    - :406 `expect` expected _no expected value_ _(none)_
- `the page never contradicts itself` — e2e/claims.spec.ts:411
- `no passing-everything sentence survives: ${breakage.name}` — e2e/claims.spec.ts:436
    - :444 `toBeVisible` expected _no expected value_ _(none)_
    - :446 `expect` expected _no expected value_ _(none)_
    - :449 `toHaveAttribute` expected `'data-result', 'fail'` _(expression)_
    - :452 `expect` expected _no expected value_ _(none)_
    - :455 `expect` expected _no expected value_ _(none)_
- `with nothing broken, the passing sentence IS shown` — e2e/claims.spec.ts:468
    - :473 `expect` expected _no expected value_ _(none)_
- `what the reader types is treated as an address` — e2e/claims.spec.ts:482
- `a pasted URL matches, and only its host reaches the first message` — e2e/claims.spec.ts:483
    - :489 `toHaveAttribute` expected `'data-result', 'pass'` _(expression)_
    - :493 `expect` expected _no expected value_ _(none)_
    - :494 `expect` expected _no expected value_ _(none)_
    - :495 `expect` expected _no expected value_ _(none)_
- `the page keeps its own copy honest` — e2e/claims.spec.ts:499
- `the intro leads with plain language and no hex above it` — e2e/claims.spec.ts:500
    - :509 `toBe` expected `'intro'` _(literal)_
    - :511 `toMatch` expected `/[0-9a-f]{2}( [0-9a-f]{2}){3}/` _(regex)_
- `changing an input fully replaces the verdict, leaving nothing stale` — e2e/claims.spec.ts:514
    - :520 `expect` expected _no expected value_ _(none)_
    - :525 `expect` expected _no expected value_ _(none)_
    - :526 `expect` expected _no expected value_ _(none)_
    - :527 `toHaveCount` expected `1` _(literal)_
- `re-selecting the SAME site does not disturb a fresh verdict` — e2e/claims.spec.ts:530
    - :536 `toHaveAttribute` expected `'data-result', 'pass'` _(expression)_
    - :537 `toBe` expected `before` _(expression)_
- `nothing is hidden-but-painted, and no [hidden] cascade trap exists` — e2e/claims.spec.ts:540
    - :553 `toBe` expected `0` _(literal)_
    - :557 `toBe` expected `false` _(expression)_
- `the five-step lesson` — e2e/claims.spec.ts:570
- `arrives on step 1 of 5 with the real chain and every check passing` — e2e/claims.spec.ts:571
    - :577 `toBeChecked` expected _no expected value_ _(none)_
    - :578 `toHaveCount` expected `4` _(literal)_
- `each check leads with a plain state, not a paragraph` — e2e/claims.spec.ts:581
    - :586 `expect` expected _no expected value_ _(none)_
- `a failing check shows its cause WITHOUT being asked to` — e2e/claims.spec.ts:590
    - :597 `toBeVisible` expected _no expected value_ _(none)_
    - :598 `toContainText` expected `'evil.example'` _(literal)_
    - :600 `toBe` expected `true` _(expression)_
- `the causal summary names what changed AND what did not` — e2e/claims.spec.ts:603
- `the expiry step shows the dates failing and the signatures holding` — e2e/claims.spec.ts:614
    - :620 `toHaveAttribute` expected `'data-result', 'fail'` _(expression)_
    - :625 `toHaveCount` expected `0` _(literal)_
- `a prediction is scored against the option the reader picked` — e2e/claims.spec.ts:628
- `every step resets to its own baseline, inheriting nothing` — e2e/claims.spec.ts:637
    - :642 `toHaveAttribute` expected `'data-result', 'fail'` _(expression)_
    - :645 `toHaveAttribute` expected `'data-result', 'pass'` _(expression)_
    - :646 `toHaveAttribute` expected `'data-result', 'pass'` _(expression)_
- `the lookalike step cannot inherit a tampered signature` — e2e/claims.spec.ts:649
    - :656 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :658 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :659 `toHaveCount` expected `4` _(literal)_
- `state badges say what the reader has left switched on` — e2e/claims.spec.ts:663
    - :665 `toHaveText` expected `['NOTHING CHANGED YET']` _(expression)_
    - :668 `toHaveCount` expected `1` _(literal)_
- `the closing check` — e2e/claims.spec.ts:672
- `three questions appear only after the lesson is finished` — e2e/claims.spec.ts:678
    - :680 `toHaveCount` expected `0` _(literal)_
    - :682 `toHaveCount` expected `9` _(literal)_
- `a wrong answer is explained and offers the experiment again` — e2e/claims.spec.ts:686
    - :691 `expect` expected _no expected value_ _(none)_
    - :694 `toBeVisible` expected _no expected value_ _(none)_
- `a right answer is scored right, and the count is computed` — e2e/claims.spec.ts:699
- `nothing is unlocked or awarded for clicking through` — e2e/claims.spec.ts:709
    - :717 `toMatch` expected `/complete|congratulations|well done|badge|certificate of/i` _(regex)_
- `the reader keeps their place` — e2e/claims.spec.ts:721
- `focus stays on the control that was activated` — e2e/claims.spec.ts:722
    - :730 `toBe` expected `id` _(expression)_
- `focus survives a scenario change` — e2e/claims.spec.ts:734
    - :739 `toBe` expected `'site-self-signed'` _(literal)_
- `an open disclosure survives an edit, and the caret keeps its place` — e2e/claims.spec.ts:742
    - :746 `expect` expected _no expected value_ _(none)_
    - :752 `expect` expected _no expected value_ _(none)_
    - :753 `toBe` expected `'address-input'` _(literal)_
- `definitions open by keyboard, not by hover` — e2e/claims.spec.ts:756
    - :759 `toHaveAttribute` expected `'aria-expanded', 'false'` _(expression)_
    - :764 `toHaveAttribute` expected `'aria-expanded', 'true'` _(expression)_
    - :766 `toBeVisible` expected _no expected value_ _(none)_
- `a pasted URL and other input work the reader should not have to do` — e2e/claims.spec.ts:770
- `date presets come from the certificate, not from a hardcoded list` — e2e/claims.spec.ts:771
    - :777 `toHaveValue` expected `'2026-11-30'` _(literal)_
    - :778 `toHaveAttribute` expected `'data-result', 'fail'` _(expression)_
    - :784 `toHaveValue` expected `'2026-11-30'` _(literal)_
- `hints and errors are tied to their inputs` — e2e/claims.spec.ts:787
    - :792 `expect` expected _no expected value_ _(none)_
    - :794 `toHaveCount` expected `1` _(literal)_

**Mutation records** (2 file(s)):

- `e2e/mutation-evidence.json` (11423 bytes)
- `e2e/verdict-mutations.json` (16913 bytes)

<details><summary>Full README</summary>

```markdown
# HTTPS Padlock

**X.509 · TLS 1.3 · what the padlock means**

Parses the real certificate a site presents, walks the chain to a root that was trusted before
you arrived, and separates the four things the padlock proves from the four it does not.

**[Open the live demo](https://systemslibrarian.github.io/crypto-lab-https-padlock/)**

---

## What It Is

Almost everyone has been told the padlock means a site is safe. It does not say that, and it
never did. This lab is the one place in the Crypto Lab suite that answers the newcomer's
question — *what does the padlock mean?* — and then sends them on.

It parses real X.509 certificates in the browser with
[`@peculiar/x509`](https://github.com/PeculiarVentures/x509), verifies every signature in the
chain with **WebCrypto**, and encodes a real TLS 1.3 `ClientHello` byte for byte so you can
find the hostname in it yourself.

- **Primitives and specs.** RFC 5280 (X.509 path validation, a stated teaching subset),
  RFC 8446 (TLS 1.3 `ClientHello`), RFC 6066 (server_name / SNI), RFC 6125 (name matching).
  Signatures are real ECDSA over P-256 and P-384, verified in `SubtleCrypto`.
- **The security model.** The lab reads certificates that were already captured. It makes no
  network connection and runs no handshake, so it never claims to have *observed* encryption.
  What it does claim about the certificate's key is narrow and correct: in TLS 1.3 that key
  checks the server's handshake signature, and it is **not** the key your traffic is encrypted
  to — that was RSA key transport, which TLS 1.3 removed. Trust terminates in a list of roots
  that is **this lab's own copy**, not your device's; the lab cannot read or change what your
  machine trusts, and says so on the page.
- **Not production crypto.** This is a teaching demo. Its path validation deliberately omits
  revocation, name constraints, policy constraints and path length, so a chain this page
  accepts is **not** thereby a chain a browser would accept.

### What is real, and what is not

| Real | Not real, or not here |
|---|---|
| The `github.com` chain, captured from the public internet on 2026-10-04 | Any live network connection or TLS handshake |
| Two roots lifted from a real macOS system trust store | Your device's actual trust list — this is the lab's committed copy of one, plus an extra toy root |
| Every signature check, in WebCrypto, over real DER | Revocation (OCSP/CRL), name constraints, policy constraints, path length |
| The toy hierarchy: real P-256 keys, real signatures over real TBS bytes | The toy root's *trustworthiness* — no real device carries it; the lab adds it on purpose |
| The `ClientHello`: correct lengths, a real X25519 public key, and the four extensions RFC 8446 §9.2 requires | Sending that message, or using the key — the private half is discarded unused |

The certificates and their provenance are documented in [`certs/PROVENANCE.md`](certs/PROVENANCE.md),
including the command each was captured with.

The address input accepts ASCII DNS hosts and `scheme://authority` URLs, with
userinfo interpreted only inside the authority. An `@` in a path, query or
fragment does not change the hostname. This is a bounded teaching parser, not
the complete WHATWG URL implementation. A mismatched-address badge preserves
the pasted string and wraps long fragments or query values without widening
the page, including at the 320px reflow floor.

## Exhibits

The **guided lesson is the default**: five steps, one question and one action each, with an
optional prediction before the action and a known baseline reset at every step. Everything it
does, it does by driving the same four controls **Explore freely** exposes — so nothing in the
lesson is a simulation of the lab.

1. **The five steps.** What the padlock checks · the name has to match · dates matter and
   nothing else moves · somebody has to vouch · a perfect certificate for the wrong site. Each
   ends in one sentence worth remembering.
2. **The padlock.** One verdict, computed from the four checks below. It reads `PADLOCK SHOWN`,
   `NO PADLOCK`, or — for the attacker certificate — `PADLOCK SHOWN — AND NOT WHO YOU THINK`.
3. **The chain walk.** Leaf, intermediate, root, drawn as boxes with the verdict on each
   signature between them. The last box is marked as the one the **server never sent** — it
   came from the trusted list, and nothing in the chain vouches for it. On a real device that
   list ships with the operating system or browser; this lab carries its own copy.
4. **The four promises**, each leading with a plain state — `Key loads`, `Matches`,
   `Signature verifies`, `In date` — and the explanation one click behind it. A usable key,
   imported by WebCrypto with what it is actually for spelled out; the name matching under
   RFC 6125 after the host is extracted from whatever you typed; somebody vouching; and not
   expired. When one fails, the cause is shown **without** being asked for.
5. **Break it yourself.** Type an address the certificate is not for. Move the date past the
   expiry. Flip one bit of the signature. Each failure is produced by the real validator, and
   the page names the actual cause.
6. **The four non-promises.** Not that the site is honest; not that the company is who it says;
   not that the hostname was private; not that the strongest cryptography was used. Each is
   *demonstrated* rather than asserted.
7. **The first message your browser sends.** A real TLS 1.3 `ClientHello`, in hex, with the
   hostname highlighted where it sits in the clear.
8. **Look closer.** The chain walk, the `ClientHello` bytes and the RFC scope, one disclosure
   each. An open one survives a recomputation, so reading the chain while editing the address
   does not keep closing it.
9. **What stuck.** Three questions about what you just did, after the last step. Each wrong
   answer is explained at once and offers the experiment that settles it. Nothing is scored and
   nothing is unlocked — a test asserts the page awards nothing for clicking through. Then the
   practical takeaways, a note that browsers no longer all draw a padlock, and **one**
   recommended next lab.

## When to Use It

- **Use it** to answer "what does the padlock mean?" for someone who has never seen a
  certificate, and to show why a valid padlock on a lookalike domain is not a contradiction.
- **Use it** to show the difference between a name being verified and an organization being
  verified.
- **Do NOT use it** as a certificate validator. It implements a teaching subset of RFC 5280 and
  will accept chains a browser rejects. Use a real TLS stack.
- **Do NOT use it** to learn path building — cross-signing, name constraints, path length. That
  is [Chain of Trust](https://systemslibrarian.github.io/crypto-lab-chain-of-trust/), which is
  a deliberately narrower and deeper question.

## Live Demo

**<https://systemslibrarian.github.io/crypto-lab-https-padlock/>**

Choose a site, then try to break each promise in turn: retype the address, drag the date past
29 November 2026, flip a bit of the signature. Then select
`login.yourbank-security.example` and watch every check pass.

## What Can Go Wrong

- **Reading the padlock as a safety badge.** It is a statement about a connection and a name.
  The attacker exhibit exists because this is the single most common and most costly
  misreading, and it is a misreading of a *correct* result.
- **Expecting a domain-validated certificate to identify a company.** It attests control of a
  name. `CN=github.com` carries no organization field at all, and its issuing CA has `DV` in
  its own name.
- **Assuming the hostname is private.** It is in the clear in the first packet, in this
  example — Encrypted ClientHello is the extension that hides it, and this message does not
  use one. [Blind Hello](https://systemslibrarian.github.io/crypto-lab-blind-hello/) is the lab
  for that fix.
- **Assuming the best cryptography was negotiated.** Negotiation happens before anyone has
  authenticated — though TLS 1.3 *does* check afterwards that the conversation was not
  altered, so this is not a free downgrade. What a padlock still does not tell you is which
  option was chosen.
  [Downgrade Wire](https://systemslibrarian.github.io/crypto-lab-downgrade-wire/) goes into it.
- **Trusting a chain because it validates.** Validation is a statement about signatures, names
  and dates. The lab's own store contains a toy root precisely so you can watch a perfect
  validation of a certificate you should not trust.
- **Confusing the lab's clock with yours.** The lab pins its own instant, stated on the page,
  so the expiry lesson cannot rot into an accident.

## Real-World Usage

Every browser, every HTTPS client and every TLS library performs the four checks this lab
shows, on every connection. The shape of the `github.com` chain here — a leaf, a
domain-validated issuing CA, and a cross-signed root whose own issuer arrives from the device
rather than the wire — is the ordinary modern case, not an edge case. Certificate
transparency, HSTS, CAA records and DANE all exist because of the gaps this lab's second half
is about.

## How to Run Locally

`​``sh
npm install
npm run dev          # http://localhost:5173/crypto-lab-https-padlock/
`​``

Other scripts:

`​``sh
npm test             # unit and known-answer tests
npm run build        # typecheck both projects, then build
npm run test:a11y    # the axe WCAG gate at 1280 / 390 / 320
npm run test:verdicts   # the claims suite and the verdict-coverage rule
npm run test:mutation   # prove the tests bite (see below)
npm run mint:toy     # re-mint the toy hierarchy (rotates its keys)
`​``

## Related Demos

- **[Chain of Trust](https://systemslibrarian.github.io/crypto-lab-chain-of-trust/)** — path
  building versus RFC 5280 path validation, including every constraint this lab omits.
- **[TLS Handshake](https://systemslibrarian.github.io/crypto-lab-tls-handshake/)** — the
  handshake itself, which this lab takes for granted.
- **[Blind Hello](https://systemslibrarian.github.io/crypto-lab-blind-hello/)** — encrypting
  the hostname this lab shows in the clear.
- **[Downgrade Wire](https://systemslibrarian.github.io/crypto-lab-downgrade-wire/)** —
  stripping the unauthenticated negotiation.
- **[DNSSEC Chain](https://systemslibrarian.github.io/crypto-lab-dnssec-chain/)** — a separate
  trust system answering a different question.

## Build & Verify

**57 unit tests** (Vitest), all passing, across six files:

| File | What it proves |
|---|---|
| `src/pki/kat.test.ts` | **13 known-answer tests.** Every vendored chain parses to the subject, issuer, serial, validity window, SANs and SHA-256 fingerprint that `openssl x509` reports. The expected values are literals read out of the certificates *before* this lab could parse them. |
| `src/pki/hostname.test.ts` | RFC 6125 matching: exact names, wildcards standing for exactly one label, the ignored Common Name, host extraction from a pasted URL the way a browser does it, and fail-closed behaviour on anything that is not a plain DNS name. |
| `src/pki/path.test.ts` | The correct path accepts the good chain and **rejects every bad one** — missing intermediate, one-byte signature alteration, expired, self-signed leaf, a root the device does not hold, and a parent not permitted to sign. |
| `src/pki/assess.test.ts` | Every verdict the page renders, computed: which checks fail for which breakage, that promise 1 reports a key WebCrypto actually **imported** rather than a parsed field, and that the attacker fixture renders **ALARM** rather than a green success. |
| `src/tls/clienthello.test.ts` | The `ClientHello` encoder, checked by an **independent structural walk** of the TLS message that shares no arithmetic with the encoder's own offsets, plus a check that all five required extensions are present and that the browser path really produces an X25519 key. |
| `src/tls/span.test.ts` | The declared position of the hostname against a byte search, at every length from 1 to 200 — including the n=97 case where the name's own length prefix encodes as the letter `a` and a naive search lands one byte early. |

**The accessibility gate** (`npm run test:a11y`) scans the *production build* in Chromium for
zero WCAG 2.1 A/AA violations, at **1280, 390 and 320 px**, across every state the lab teaches
— all five lesson steps, each failure, the alarm, the closing check answered both ways, every
disclosure open, and four focus rings. It also asserts the interaction properties axe has no
rule for: **focus stays on the control that was activated** through nine separate actions, an
open disclosure **survives a recomputation**, and a definition **opens from the keyboard**.
It is not an axe wrapper: it also asserts axe's `incomplete` bucket, computes contrast
arithmetically over every text node (including `aria-hidden` content axe skips), measures
non-text contrast against a ratchet baseline, and checks reflow, which axe has no rule for.
The deploy is blocked if it fails.

**The claims suite** (`npm run test:verdicts`) checks the page tells the truth: **51 claims
tests plus 4 coverage rules**. The three biggest claims are **re-derived independently** in the
test rather than recomputed the way the source computes them — RFC 6125 matching is implemented
a second time in the spec, expiry is recomputed from the dates printed on screen, and the
hostname's position in the `ClientHello` is found by searching the page's own printed bytes
(anchored on the name's length prefix, because at length 97 that prefix encodes as the letter
`a` and a naive search lands one byte early).

It also sweeps for **self-contradiction**. The page shipped a real one: with the date past
expiry the headline read `NO PADLOCK` while the honesty card still said "Every check above
passed", because the every-check-passed value ignored expiry. Nothing caught it, since that row
was only ever asserted in the state where every check really does pass. The suite now drives
all six breakages and asserts no passing-everything sentence survives any of them — and the
other side of the ratchet, that the sentence *is* shown when nothing is broken.

**Mutation discipline.** `npm run test:mutation` applies **20 recorded mutations** covering
**25 marker assertions** — one per verdict the lab renders, including the lesson's prediction
scoring, the closing check's scoring, the step counter and the causal summary, plus one that
re-introduces the self-contradiction above so the fix is itself pinned — in an isolated
`git archive`
tree, and judges each against four rules: the owning test passed unmutated in the same run,
the patch actually changed the file, the run served the mutated code (the bundle hash must
move *and* the failure must not match a build error or a dead server), and a patch that does
not compile is `DOES NOT BUILD` rather than a kill. The results in
[`e2e/mutation-evidence.json`](e2e/mutation-evidence.json) are written by the runner, not by
hand. Separately, `e2e/global-teardown.ts` fails the suite if any recorded kill never actually
executed, so an unperformed record cannot sit in the registry looking performed — and when a
copy edit legitimately moves a recorded claim, `npm run sync:kills` copies the new string out
of a passing run's own sink instead of having someone retype what they believe the run did. It
refuses to guess where the choice is a judgement.

**The negative claim.** *A valid certificate does not establish who operates the name it was
issued for.* Its evidence fixture is the attacker chain: a reachable state where every check
reports success and the named property is violated anyway. The claims suite asserts the
fixture is reachable, that every rendered verdict in it reports success, and that the
limitation is on screen in that state as the lab's own check returning `not established`.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## TESLA Broadcast

- **slug**: `crypto-lab-tesla-broadcast`
- **repo**: https://github.com/systemslibrarian/crypto-lab-tesla-broadcast
- **live**: https://systemslibrarian.github.io/crypto-lab-tesla-broadcast/
- **commit_sha**: `1d54266175d5513e30bbe8deeeb95719770b4771` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `8e10265e56f237a80dc0c08b733794888d473b52`
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | HASHING & KDFS  ·  **level**: intermediate  ·  **--accent**: #69c9ff
- **MISSING FIELDS**: verification

**Name (H1)**: TESLA Broadcast  — _read from index.html_

**Subtitle**: Timed broadcast authentication · RFC 4082  — _read from index.html_

**Description**: Build a one-way key chain and see how delayed disclosure lets receivers verify HMAC-authenticated broadcasts.  — _read from index.html_

**Why it matters**: A receiver must know that a key was still secret when a packet arrived. A wrong clock bound makes a valid tag compatible with a forged message.  — _read from index.html_

**Card copy**: Authenticate a broadcast with a one-way HMAC key chain and delayed disclosure: forge a shared-key MAC, verify a later key after dropped packets, then spoof past a receiver whose clock bound is wrong.

**Chips**: HMAC-SHA-256 · One-Way Key Chain · Ed25519 · RFC 4082

**Implements**: Ed25519 `src/crypto/anchor.ts:1`, HMAC `src/crypto/hmac.ts:4`, SHA-256 `src/crypto/sha256.ts:1`

**Attacks shown**: _none derived_

**References**: AES, CMAC, SHA-3

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 4082` — first seen README.md:5 (7×)
- `RFC 4231` — first seen README.md:52 (2×)
- `RFC 8032` — first seen README.md:52 (1×)
- `rfc4082` — first seen README.md:60 (2×)
- `rfc4231` — first seen src/main.ts:19 (1×)

**README — What Can Go Wrong**:

```text
If the receiver assumes a lag smaller than its true lag, a packet forged after disclosure passes the safety test, key-chain verification and real MAC verification. The valid tag does not prove authorship to a third party after disclosure.
```

**Claims tested** (e2e/claims.spec.ts, 3 test(s)):

- `the displayed clock inequality and actual HMAC explain both forged verdicts` — e2e/claims.spec.ts:8
    - :10 `toContainText` expected `'REJECTED'` _(literal)_
    - :11 `toContainText` expected `'Retired'` _(literal)_
    - :12 `toContainText` expected `'AUTHENTICATED'` _(literal)_
    - :14 `expect` expected _no expected value_ _(none)_
    - :17 `toBe` expected `Number(local)` _(expression)_
    - :18 `toBe` expected `Number(x)` _(expression)_
    - :19 `expect` expected _no expected value_ _(none)_
    - :20 `expect` expected _no expected value_ _(none)_
    - :22 `toBe` expected `wire![1]` _(expression)_
    - :23 `expect` expected _no expected value_ _(none)_
    - :24 `toContainText` expected `'REJECTED'` _(literal)_
- `the disclosed chain and receiver-created tags rederive independently` — e2e/claims.spec.ts:26
    - :31 `expect` expected _no expected value_ _(none)_
    - :32 `toBe` expected `parts![3]` _(expression)_
    - :36 `expect` expected _no expected value_ _(none)_
    - :38 `toBe` expected `keys![3]` _(expression)_
    - :41 `expect` expected _no expected value_ _(none)_
    - :43 `expect` expected _no expected value_ _(none)_
    - :45 `toBe` expected `wire![2]` _(expression)_
- `lost disclosures release real buffered packets, while a wide bound discards them` — e2e/claims.spec.ts:47
    - :52 `toContainText` expected `'K₄ released 4 waiting packet(s)'` _(literal)_
    - :54 `expect` expected _no expected value_ _(none)_
    - :55 `expect` expected _no expected value_ _(none)_
    - :57 `expect` expected _no expected value_ _(none)_
    - :60 `toBe` expected `keys![3]` _(expression)_
    - :65 `toContainText` expected `'Retired'` _(literal)_
    - :67 `toContainText` expected `'unsafe genuine packets: 4'` _(literal)_
    - :68 `toContainText` expected `'Authenticated intervals: none'` _(literal)_

**Mutation records** (2 file(s)):

- `scripts/mutations.json` (1007 bytes)
- `scripts/mutations.mjs` (2596 bytes)

<details><summary>Full README</summary>

```markdown
# TESLA Broadcast

## What It Is

Implements an RFC 4082-style one-way HMAC-SHA-256 key chain, distinct MAC keys, an Ed25519-signed anchor, receiver safety check, and delayed-key broadcast authentication. Simulated sender and receiver clocks make the timing assumption inspectable. Not production crypto — a teaching demo. All material is generated in memory; this static site has no account, backend or key storage.

## Exhibits

1. Forge a shared-key MAC as one of its receivers.
2. Build a signed chain and verify a later disclosed key after dropped intermediate packets.
3. Set the true receiver clock lag and its assumed upper bound; spoof a packet after key disclosure and watch the real checks in order.
4. Calculate radio airtime and run 10,000 random truncated-tag guesses.
5. Read the sourced Galileo OSNMA adaptation note, with no OSNMA parsing or conformance claim.

## When to Use It

Use this to study the exact mechanism and its failure boundary. Do not use the toy implementation, keys or protocols in a deployed security system.

## Live Demo

[Open TESLA Broadcast](https://systemslibrarian.github.io/crypto-lab-tesla-broadcast/) to drive the exhibits. The build uses Vite's `/crypto-lab-tesla-broadcast/` base for GitHub Pages.

## What Can Go Wrong

If the receiver assumes a lag smaller than its true lag, a packet forged after disclosure passes the safety test, key-chain verification and real MAC verification. The valid tag does not prove authorship to a third party after disclosure.

## Real-World Usage

Galileo OSNMA adapts TESLA, but this code does not implement its formats, authentication messages or receiver rules. Sender and receiver clocks and the network are simulated; signatures, MACs and hashes are real.

## How to Run Locally

`​``sh
npm ci
npm run dev
`​``

## Related Demos

[Time Trust](https://github.com/systemslibrarian/crypto-lab-time-trust) · [Pulse Chain](https://github.com/systemslibrarian/crypto-lab-pulse-chain) · [MAC Race](https://github.com/systemslibrarian/crypto-lab-mac-race) · [Signed Bytes](https://github.com/systemslibrarian/crypto-lab-signed-bytes)

## Build & Verify

`​``sh
npm test
npm run build
npx playwright install chromium
npm run test:a11y
npm run test:mutations
`​``

8 unit tests including RFC 4231 HMAC, NIST SHA-256 and RFC 8032 Ed25519 vectors, plus a grid of timing-bound attack outcomes and rejection ordering. The RFC defines protocol logic rather than publishing a TESLA KAT. The replayable mutation harness contains 4 concrete source patches. Each run first passes its named baseline test, requires a non-empty diff, a successful build and changed JavaScript bundle hash, then requires the owning test to fail and restores the original hash. The Playwright suite scans reachable desktop and mobile states for WCAG 2.1 A/AA issues and independently rederives displayed claims. GitHub Actions runs unit tests, production build and browser gate before deploying; it also gates Dependabot pull requests, groups minor/patch npm updates and dispatches a deploy after an automated merge.

## Performance

All runs are local to the browser. Work figures shown in the page are either actual counted operations or explicitly labelled mathematical estimates/extrapolations. Workers keep long searches cancellable where used. No speed number is a claim about a production deployment.

## Sources

- [RFC 4082 §§2.2, 3.2–3.5](https://www.rfc-editor.org/rfc/rfc4082)
- [Boneh–Shoup v0.6 §14.7](https://toc.cryptobook.us/)
- [Galileo OSNMA Receiver Guidelines 1.3](https://www.euspa.europa.eu/sites/default/files/2024-03/Galileo_OSNMA_Receiver_Guidelines_v1.3.pdf)

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Hostile Paths

- **slug**: `crypto-lab-hostile-paths`
- **repo**: https://github.com/systemslibrarian/crypto-lab-hostile-paths
- **live**: https://systemslibrarian.github.io/crypto-lab-hostile-paths/
- **commit_sha**: `56f34b0b0fee5005cc6657f6175f8bd8bc360059` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | MPC & THRESHOLD | PRIVACY  ·  **level**: advanced  ·  **--accent**: #63e6d3
- **MISSING FIELDS**: subtitle, description, why_it_matters, verification, limitations

**Name (H1)**: Hostile Paths  — _read from src/ui/app.ts_

**Subtitle**: _MISSING_

**Description**: _MISSING_

**Why it matters**: _MISSING_

**Card copy**: Send one field symbol over independently modeled hostile paths: compare naive Shamir interpolation with Welch–Berlekamp correction, vary observation, modification and loss, and compute exact one-round and interactive topology boundaries.

**Chips**: Shamir Sharing · Reed-Solomon · Welch–Berlekamp · PSMT

**Implements**: Reed-Solomon `src/psmt/decoder.ts:37`, Shamir secret sharing `src/psmt/protocol.ts:131`

**Attacks shown**: _none derived_

**Standards body**: _none_

**Implementation**: local TypeScript GF(257), Shamir-style polynomial sharing, Welch-Berlekamp decoding and independent subset decoding

**Spec citations, exactly as written**:

- `10.1145/138027.138036` — first seen README.md:185 (1×)
- `10.1145/359168.359176` — first seen README.md:199 (1×)
- `arXiv:1608.01909` — first seen README.md:194 (1×)
- `arXiv:2610.06312v1` — first seen src/psmt/public-helper.ts:2 (1×)
- `doi.org/10.1145/138027.138036` — first seen README.md:185 (2×)
- `doi.org/10.1145/359168.359176` — first seen README.md:199 (2×)

**Claims tested** (e2e/claims.spec.ts, 12 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:8
    - :8 `toContainText` expected `"independently checked"` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:18
    - :18 `toHaveText` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:21
    - :21 `toContainText` expected `"independently checked"` _(literal)_
- `default transcript is a real degree-one word and both decoders recover` — e2e/claims.spec.ts:24
    - :28 `toHaveCount` expected `4` _(literal)_
    - :39 `toBe` expected `42` _(literal)_
    - :41 `toBe` expected _no expected value_ _(none)_
    - :45 `toBe` expected `"modify"` _(literal)_
    - :46 `toBe` expected `mod(sent[0]! + 1)` _(expression)_
    - :47 `toBe` expected `"honest"` _(literal)_
    - :48 `toHaveText` expected `"257"` _(literal)_
    - :49 `toHaveText` expected `"1"` _(literal)_
    - :50 `toContainText` expected `"wrong"` _(literal)_
    - :51 `toHaveText` expected `"recovered 42"` _(literal)_
    - :52 `toHaveText` expected `"recovered 42"` _(literal)_
    - :53 `toHaveText` expected `"2·1 + 0 = 2"` _(literal)_
    - :54 `toHaveText` expected `"n − (t+1) = 2"` _(literal)_
    - :55 `expect` expected _no expected value_ _(none)_
- `changed inputs retire old evidence before a fresh run` — e2e/claims.spec.ts:60
    - :63 `toHaveText` expected `"recovered 42"` _(literal)_
    - :65 `toContainText` expected _no expected value_ _(none)_
    - :68 `toContainText` expected _no expected value_ _(none)_
    - :72 `toHaveText` expected `"recovered 77"` _(literal)_
    - :73 `toHaveText` expected `"recovered 77"` _(literal)_
- `mixed error and erasure satisfy the exact t=2 correction inequality` — e2e/claims.spec.ts:76
    - :85 `toHaveCount` expected `7` _(literal)_
    - :86 `toHaveText` expected `"recovered 200"` _(literal)_
    - :87 `toHaveText` expected `"recovered 200"` _(literal)_
    - :88 `toHaveText` expected `"2·1 + 1 = 3"` _(literal)_
    - :89 `toHaveText` expected `"n − (t+1) = 4"` _(literal)_
    - :90 `toHaveText` expected `"257"` _(literal)_
- `three one-way paths expose ambiguity and withdraw the guarantee` — e2e/claims.spec.ts:93
    - :98 `toHaveText` expected `"4"` _(literal)_
    - :99 `toContainText` expected _no expected value_ _(none)_
    - :102 `toContainText` expected `"REFUSED"` _(literal)_
    - :103 `expect` expected _no expected value_ _(none)_
    - :116 `toEqual` expected `[` _(expression)_
- `two-round feedback shows the 2t+1 theorem boundary but executes no fake protocol` — e2e/claims.spec.ts:123
    - :129 `toHaveText` expected `"3"` _(literal)_
    - :130 `toContainText` expected _no expected value_ _(none)_
    - :134 `toContainText` expected _no expected value_ _(none)_
    - :137 `toHaveCount` expected `0` _(literal)_
    - :138 `toContainText` expected `"different construction"` _(literal)_
- `one-round feedback is rejected as an invalid round model` — e2e/claims.spec.ts:141
    - :145 `toContainText` expected _no expected value_ _(none)_
    - :148 `toContainText` expected _no expected value_ _(none)_
- `more than t observations reveal the exact secret and withdraw privacy` — e2e/claims.spec.ts:153
    - :159 `toHaveText` expected `"1"` _(literal)_
    - :160 `toHaveText` expected `"1"` _(literal)_
    - :161 `toContainText` expected _no expected value_ _(none)_
    - :164 `toHaveText` expected `"recovered 42"` _(literal)_
    - :165 `expect` expected _no expected value_ _(none)_
- `invalid action totals release no stale protocol result` — e2e/claims.spec.ts:170
    - :177 `toContainText` expected `"path actions exceed"` _(literal)_
    - :178 `toBeVisible` expected _no expected value_ _(none)_
    - :179 `toHaveCount` expected `0` _(literal)_
- `source and limitation claims remain explicit` — e2e/claims.spec.ts:182
    - :183 `expect` expected _no expected value_ _(none)_
    - :188 `expect` expected _no expected value_ _(none)_
    - :191 `expect` expected _no expected value_ _(none)_
    - :194 `expect` expected _no expected value_ _(none)_

**Mutation records** (1 file(s)):

- `scripts/claim-mutations.mjs` (8032 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-hostile-paths

Executable one-round perfectly secure message transmission (PSMT) lesson over
modeled hostile paths.

## What It Is

A browser-only lesson in sending one field symbol without a pre-shared key when
a computationally unbounded Byzantine adversary controls whole communication
paths. The selected construction combines Shamir-style polynomial privacy with
Reed–Solomon error correction, so the receiver can correct altered path values
without being told which paths lied. It separately models observation,
modification, and recognized message loss. A naive receiver that interpolates
the first `t+1` values runs beside a Welch–Berlekamp decoder and an independent
subset decoder. The page also computes round/topology possibility boundaries
without claiming that a one-round decoder implements an interactive protocol.

## Selected model

The executable protocol has:

- one synchronous sender-to-receiver transmission round;
- `n` independently labeled, private and authenticated channels;
- honest sender and receiver endpoints;
- one static, computationally unbounded adversary controlling a fixed set of
  paths for the whole run;
- GF(257), with message symbols restricted to `0..255` and `256` retained as a
  field element for masks and shares;
- recognized missing deliveries as erasures, while changed values remain
  unlabeled errors.

“Private and authenticated channel” is a model assumption. The adversary reads
and replaces traffic on a controlled path, but cannot read an honest path or
inject a value under another honest path's label. The browser does not create
independent networks or authenticate routers.

## The executable one-round construction

For one message `m` and adversary budget `t`, the sender samples `t` independent
uniform field elements and forms

`​``text
f(x) = m + a1*x + ... + at*x^t  over GF(257).
`​``

Path `i` carries `f(i)`. The lab permits `1 <= t <= 4` and `n <= 16`, so all
evaluation points are nonzero and distinct in GF(257). Browser randomness uses
`crypto.getRandomValues` and rejection-samples the single `Uint16` value 65535;
the remaining 65535 values split exactly into 255 preimages for each field
element. The deterministic generator exported by the model is an explicit test
seam and is never used by the learner run.

Fitzi et al. write the evaluation locations as successive powers of a field
generator. This bounded adaptation uses the equally valid distinct nonzero
locations `1..n`; Reed–Solomon distance and the Shamir privacy argument depend
on distinct locations, not on that particular enumeration. It is not a wire
format or an interoperability claim.

This is the single-symbol `n = 3t+1` boundary form of Fitzi, Franklin, Garay and
Harsha's one-round construction. Their more general scheme for `n > 3t` puts
`n-3t` message symbols in low polynomial coefficients and reaches the optimal
transmission rate. This lab instead keeps one message symbol and treats any
paths above `3t+1` as additional redundancy. It therefore does not claim the
paper's optimal multi-symbol rate.

### Privacy

Any `v <= t` evaluations leave every one of the 257 possible messages with the
same number `257^(t-v)` of compatible coefficient vectors. The learner-visible
census establishes this directly: for every candidate secret it solves the
corresponding affine linear system over GF(257), checks consistency and rank,
and reports the number of completions. It does not infer privacy because the UI
hides a value.

Modification and loss do not reduce what a controlled path saw: the adversary
learns the original share before replacing or dropping it. When more than `t`
distinct path values are exposed, the page recomputes the candidate set and
withdraws the privacy claim.

### Reliability

The degree-`t` evaluation word is a Reed–Solomon code of dimension `t+1` and
minimum distance `n-t`. For `b` unlabeled changed values and `e` labeled
erasures, unique decoding is guaranteed when

`​``text
2b + e <= n - (t + 1).
`​``

At `n >= 3t+1`, every mix on at most `t` controlled paths meets the inequality:
the worst case `b=t, e=0` gives `2t <= n-t-1`. The main decoder executes the
Welch–Berlekamp equations. A separately written reference decoder interpolates
every `t+1`-point subset, counts agreement, applies the error/erasure bound and
requires exactly one candidate. The learner receives a message only if the
algebraic decoder finds a unique result; the teaching view then compares it to
the reference decoder and retained ground truth.

The naive comparison uses the same shares but interpolates the first `t+1`
delivered values. One early changed share can make it release the wrong secret.
Using all shares with error correction is precisely the missing protocol work;
secret sharing alone does not supply active robustness.

## Rounds, feedback, and exact thresholds

Dolev, Dwork, Waarts and Yung established these boundaries for the stated
parallel-path PSMT model:

- with one sender-to-receiver round, PSMT is possible exactly when
  `n >= 3t+1`;
- with two or more transmission rounds and two-way channels, PSMT is possible
  exactly when `n >= 2t+1`.

A transmission round has one direction, so “one round with feedback” is an
invalid setting. Two forward-only phases do not supply receiver-to-sender
feedback and retain the one-way threshold.

The page uses these results as an applicability planner. It does **not** execute
the two-round construction. Spini and Zémor's concrete interactive protocol has
the receiver send random MDS codewords first; the sender computes and reliably
communicates a pseudo-basis, syndromes, and masked secrets. Those steps are not
equivalent to toggling feedback around this decoder.

### Executable `2t+1` counterexample

For `t=1`, three one-way paths are insufficient. The page computes two degree-1
codewords:

`​``text
f(x) = 10 + 20x -> [30, 50, 70]
g(x) = 11 + 19x -> [30, 49, 68]
received          -> [30, 50, 68]
`​``

The received word is Hamming distance one from each codeword. Either could have
been sent while the adversary changed one path, so a one-round receiver cannot
choose reliably. This is a concrete ambiguity, not an empirical decoding
failure or a scenario label.

## Independent learner-visible checks

The browser claims suite does not import the protocol model. It reads the
rendered path values, reconstructs the default degree-one polynomial with its
own modular arithmetic, checks every sender value, checks the modified path,
and verifies the displayed message, privacy census and error/erasure inequality.
It also drives:

- one error at the exact `n=3t+1` boundary;
- a mixed error/erasure case for `t=2`;
- the `n=2t+1` one-round refusal and fixed ambiguity witness;
- two-round feedback applicability with explicit non-execution;
- more than `t` observations and the resulting privacy loss;
- stale-evidence retirement and rejected input states.

Unit tests cover field arithmetic, interpolation, Gaussian elimination,
polynomial division, both decoders, randomness boundaries, privacy completion
counts, topology classification, and failure cases. Source mutations must
start from a passing baseline, make the owning named test fail normally,
restore the exact source bytes, rebuild to the original digest and pass again.

## Scope and limits

- Browser paths are a symbolic topology, not physically independent networks.
- The model assumes synchrony, private/authenticated path labels, honest
  endpoints and a static path adversary. It does not cover mobile corruption,
  asynchronous delay, path overlap, routing discovery or compromised
  endpoints.
- A loss is a recognized erasure. An attacker that can replace a lost path with
  an apparently valid value creates an error instead and spends twice the
  decoding budget.
- Perfect privacy is information-theoretic only inside the stated field,
  randomness and view model. Browser execution and JavaScript memory are not a
  protected implementation environment.
- GF(257), one-symbol messages and `t <= 4` are teaching bounds, not packet or
  deployment parameters. JavaScript arithmetic here is not constant-time.
- A successful run beyond the stated bound is not a security theorem. The page
  keeps actual outcome, algebraic decodability, declared adversary budget and
  universal PSMT guarantee separate.
- The lab implements neither the full Fitzi et al. multi-symbol optimal-rate
  profile nor Spini–Zémor's two-round pseudo-basis protocol.

## Primary sources

- D. Dolev, C. Dwork, O. Waarts and M. Yung, “Perfectly Secure Message
  Transmission,” _Journal of the ACM_ 40(1), 1993, pp. 17–47,
  [DOI 10.1145/138027.138036](https://doi.org/10.1145/138027.138036). Definitions,
  perfect privacy/reliability, and the one-round `3t+1` and interactive `2t+1`
  possibility boundaries.
- M. Fitzi, M. Franklin, J. Garay and S. Harsha Vardhan, “Towards Optimal and
  Efficient Perfectly Secure Message Transmission,” TCC 2007,
  [§3 and Figure 2](https://harsha-simhadri.org/pubs/tcc07-FFGH.pdf). The
  explicit one-round Reed–Solomon construction, degree `n-2t-1`, `n-3t`
  message coefficients, `t` random coefficients, and Welch–Berlekamp decoding.
- G. Spini and G. Zémor, “Perfectly Secure Message Transmission in Two Rounds,”
  TCC 2016-B / [arXiv:1608.01909](https://arxiv.org/abs/1608.01909). §1 defines
  rounds and restates the exact boundaries; §3 gives the MDS/Shamir equivalence
  and privacy lemma; §4 gives the first pseudo-basis protocol.
- A. Shamir, “How to Share a Secret,” _Communications of the ACM_ 22(11), 1979,
  pp. 612–613,
  [DOI 10.1145/359168.359176](https://doi.org/10.1145/359168.359176).

## Build and verify

Node 22, 24, 26 or newer:

`​``sh
npm ci
npm run ci
npx playwright install chromium
npm run test:claims
npm run test:a11y
npm run test:mutations
`​``

Coverage thresholds for `src/psmt/**` are statements 95, branches 90,
functions 95 and lines 95. The Pages workflow deploys only after static, unit,
coverage, build, dependency, learner-claim, accessibility/reflow and mutation
gates pass.

---

_One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite._

_“So whether you eat or drink or whatever you do, do it all for the glory of
God.” — 1 Corinthians 10:31_

## Research review extension 31 October 2026

R20261031-13: A separately labeled broken polynomial-CRT construction enumerates all 16 coalitions over all 625 dealer choices in F5. All public helpers are part of the view. Single-member reconstruction is checked by a separate algebraic derivation for every dealer choice. This is not a repair or break of the existing PSMT or Shamir demonstrations.

```

</details>

---

## SAML Binding

- **slug**: `crypto-lab-saml-binding`
- **repo**: https://github.com/systemslibrarian/crypto-lab-saml-binding
- **live**: https://systemslibrarian.github.io/crypto-lab-saml-binding/
- **commit_sha**: `9c7a967fe9f7ed839889df93130e9ae24365d2ad` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `a3863c5c09384e36ff99ecf1c8b534eacf3f5ae8`
- **read_from**: working tree (clean)
- **category**: PROTOCOLS | SIGNATURES | ATTACKS  ·  **level**: advanced  ·  **--accent**: #5ad1c8
- **MISSING FIELDS**: subtitle, description, why_it_matters, verification, limitations

**Name (H1)**: SAML Binding  — _read from src/main.ts_

**Subtitle**: _MISSING_

**Description**: _MISSING_

**Why it matters**: _MISSING_

**Card copy**: Sign a synthetic SAML response, then watch a genuine XML signature verify while a vulnerable consumer authorizes from the wrong assertion. Compare bound-element verification, profile checks, replay state, and negative controls.

**Chips**: SAML 2.0 Subset · XML Signature · Signature Wrapping · Element Binding

**Implements**: RSA `src/saml/keys.ts:31`, SAML 2.0 `src/saml/build.ts:84`, SHA-256 `src/saml/keys.ts:33`, XML Signature `src/saml/sign.ts:42`

**Attacks shown**: XML signature wrapping `src/saml/attacks.ts:116`

**Comment-only (named in code comments, not executed)**: SHA-1 `src/saml/profile.ts:44`

**References**: SHA-1, WebAuthn

**Standards body**: IETF, NIST, OASIS, W3C

**Implementation**: xmldsigjs XML Signature / WebCrypto RSA-2048 and SHA-256 / local TypeScript bounded SAML profile, element-binding and replay-state teaching implementation

**Spec citations, exactly as written**:

- `10.1007/978-3-030-71522-9_906`` — first seen README.md:187 (1×)
- `RFC 2606` — first seen README.md:38 (2×)

**Claims tested** (e2e/claims.spec.ts, 11 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:111
    - :111 `expect` expected _no expected value_ _(none)_
- `the honest baseline authorizes the subject its own document names` — e2e/claims.spec.ts:115
    - :120 `toHaveLength` expected `1` _(literal)_
    - :121 `toBe` expected `1` _(literal)_
    - :125 `expect` expected _no expected value_ _(none)_
    - :126 `expect` expected _no expected value_ _(none)_
    - :129 `toBe` expected `'#${rendered.assertions[0]!.id}'` _(expression)_
- `the wrapped document really carries two assertions, nested as the page says` — e2e/claims.spec.ts:132
    - :139 `toHaveLength` expected `2` _(literal)_
    - :142 `toBe` expected `1` _(literal)_
    - :143 `expect` expected _no expected value_ _(none)_
    - :144 `toBe` expected `rendered.assertions[1]!.subject` _(expression)_
    - :152 `toBe` expected `rendered.assertions[0]!.id` _(expression)_
    - :153 `toBe` expected `rendered.assertions[0]!.subject` _(expression)_
    - :154 `toBe` expected `'1'` _(literal)_
- `the signature covers the deeper assertion, and the page says which` — e2e/claims.spec.ts:157
    - :164 `toBe` expected `'#${signedId}'` _(expression)_
    - :167 `expect` expected _no expected value_ _(none)_
    - :169 `expect` expected _no expected value_ _(none)_
- `the digest the page displays is the digest in the document` — e2e/claims.spec.ts:172
    - :177 `expect` expected _no expected value_ _(none)_
    - :182 `expect` expected _no expected value_ _(none)_
    - :183 `expect` expected _no expected value_ _(none)_
    - :187 `toBe` expected `true` _(expression)_
    - :188 `toBe` expected `true` _(expression)_
    - :189 `expect` expected _no expected value_ _(none)_
- `the vulnerable consumer authorizes the attacker and the repaired one refuses` — e2e/claims.spec.ts:192
    - :202 `toHaveCount` expected `2` _(literal)_
    - :206 `expect` expected _no expected value_ _(none)_
    - :207 `expect` expected _no expected value_ _(none)_
    - :208 `expect` expected _no expected value_ _(none)_
    - :210 `expect` expected _no expected value_ _(none)_
    - :211 `expect` expected _no expected value_ _(none)_
    - :212 `expect` expected _no expected value_ _(none)_
    - :213 `expect` expected _no expected value_ _(none)_
    - :222 `toBe` expected `0` _(literal)_
- `every negative control behaves the way the page predicts` — e2e/claims.spec.ts:225
    - :231 `toBe` expected `23` _(literal)_
    - :234 `expect` expected _no expected value_ _(none)_
    - :235 `expect` expected _no expected value_ _(none)_
    - :236 `expect` expected _no expected value_ _(none)_
    - :237 `expect` expected _no expected value_ _(none)_
    - :238 `expect` expected _no expected value_ _(none)_
    - :239 `expect` expected _no expected value_ _(none)_
    - :242 `toEqual` expected `[]` _(expression)_
    - :246 `expect` expected _no expected value_ _(none)_
    - :247 `expect` expected _no expected value_ _(none)_
- `signature tampering and signature wrapping are separate rows with separate layers` — e2e/claims.spec.ts:250
    - :268 `toBe` expected `'signature'` _(literal)_
    - :269 `expect` expected _no expected value_ _(none)_
    - :270 `expect` expected _no expected value_ _(none)_
    - :272 `toBe` expected `'binding'` _(literal)_
    - :273 `toMatch` expected `/^authorized/` _(regex)_
    - :274 `expect` expected _no expected value_ _(none)_
- `running one scenario retires the other panel` — e2e/claims.spec.ts:277
    - :280 `toBeVisible` expected _no expected value_ _(none)_
    - :283 `toContainText` expected `'Retired'` _(literal)_
    - :284 `expect` expected _no expected value_ _(none)_
    - :287 `toContainText` expected `'Retired'` _(literal)_
    - :288 `expect` expected _no expected value_ _(none)_
- `key material is generated on this run and shown as such` — e2e/claims.spec.ts:291
    - :293 `toHaveText` expected `'not generated yet'` _(literal)_
    - :298 `toMatch` expected `/^RSA-2048, SPKI SHA-256 [0-9a-f]{8}…[0-9a-f]{8}$/` _(regex)_
    - :299 `toMatch` expected `/^RSA-2048, SPKI SHA-256 [0-9a-f]{8}…[0-9a-f]{8}$/` _(regex)_
    - :300 `toBe` expected `attacker` _(expression)_
- `the page keeps its profile name, its synthetic warning and its omissions visible` — e2e/claims.spec.ts:303
    - :311 `expect` expected _no expected value_ _(none)_
    - :312 `expect` expected _no expected value_ _(none)_
    - :313 `expect` expected _no expected value_ _(none)_
    - :314 `expect` expected _no expected value_ _(none)_
    - :315 `expect` expected _no expected value_ _(none)_
    - :316 `expect` expected _no expected value_ _(none)_
    - :317 `expect` expected _no expected value_ _(none)_
    - :318 `expect` expected _no expected value_ _(none)_
    - :319 `expect` expected _no expected value_ _(none)_
    - :320 `expect` expected _no expected value_ _(none)_
    - :322 `expect` expected _no expected value_ _(none)_
    - :323 `expect` expected _no expected value_ _(none)_
    - :324 `expect` expected _no expected value_ _(none)_
    - :325 `expect` expected _no expected value_ _(none)_
    - :326 `expect` expected _no expected value_ _(none)_

**Mutation records** (1 file(s)):

- `scripts/mutations.mjs` (12838 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-saml-binding

## What It Is

A browser-based teaching lab about the gap between verifying an XML signature and
authorizing from the object that signature actually covered. It builds a synthetic
SAML 2.0 Web Browser SSO response, signs the assertion with an RSA-2048 key generated
in the page by Web Crypto, and feeds the same bytes to two service providers that
differ at one load-bearing interface boundary: one asks a signature library a yes/no question and then
asks the document, separately, which assertion to use, while the other takes the
element verification returned and never queries again. On an honest response they
agree. On an XML Signature Wrapping document — where the original, still-signed
assertion is moved into a forged one and nothing cryptographic is touched — the
signature still verifies, every implemented check passes on the attacker's selected
assertion, and the first consumer authorizes an administrator account that no identity
provider ever asserted. The hostile document is not claimed to be conforming identity-
provider output; it is an adversarial input that isolates a consumer-side binding bug.
Nothing here contacts a real identity provider, processes a real identity, or is a
production SAML stack.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-saml-binding](https://systemslibrarian.github.io/crypto-lab-saml-binding/)**

## The profile, named

This lab implements **`S12-WBSSO-POST-SYNTH/1`**: a synthetic, bounded subset of the
SAML V2.0 Web Browser SSO Profile (`saml-profiles-2.0-os` §4.1) over the HTTP POST
binding (`saml-bindings-2.0-os` §3.5), identity provider to service provider only.

That name is a label this lab invented for a subset this lab defined. **It is not an
OASIS profile identifier, it is registered nowhere, and nothing that must interoperate
with a real deployment should be built from it.**

Everything is local and synthetic: no network request leaves the page, the identity
provider / service provider / attacker are three modules in one browser tab, key
material is generated per run and never stored or sent, and both identities are
fixtures on the RFC 2606 reserved `.invalid` domain.

### The enforced subset

For each field and shape listed below, anything outside the accepted value is refused by a
named rule. Unsupported algorithms and reference shapes stop before cryptography; position
rules are evaluated after verification. This is not a complete XML Schema or SAML profile
validator, and unlisted Core requirements are not silently claimed.

| Field | Accepted | Source |
|---|---|---|
| Signature placement | enveloped, inside `saml:Assertion`, immediately after `saml:Issuer` | SAMLCore 5.4.1 |
| `SignatureMethod` | `…xmldsig-more#rsa-sha256`, RSA-2048 | XMLDSIG 1.1 6.4.2 |
| `DigestMethod` | `…xmlenc#sha256` | XMLDSIG 1.1 6.2.2 |
| `CanonicalizationMethod` | `…xml-exc-c14n#`, in `SignedInfo` and as a transform | SAMLCore 5.4.3 |
| `Transforms` | exactly enveloped-signature then exclusive-c14n, in that order | SAMLCore 5.4.4 |
| `Reference` | exactly one, `URI="#id"`, same-document, resolving to exactly one element | SAMLCore 5.4.2 |
| Verified node | a `saml:Assertion` that is a **direct child** of the `samlp:Response` | W3C XMLDSIG Best Practice 14 |
| Document root | `samlp:Response` | SAMLProf 4.1.4.2; W3C XMLDSIG Best Practice 14 |
| `KeyInfo` | ignored; the key is the service provider's pinned trust anchor | SAMLCore 5.4.5 |

At L3, the Response Destination and Response-level `InResponseTo` are checked against local
service-provider state, one complete bearer `SubjectConfirmation` candidate must pass, and
this one-relied-upon-assertion subset requires the selected assertion to carry an
`AuthnStatement`. It accepts four-digit UTC SAML instants in
`YYYY-MM-DDThh:mm:ss[.fraction]Z` form. Fields from separate confirmation candidates are
never combined. Errata 05 E26 states the authentication-statement rule over the set of
bearer assertions; requiring it on the one selected assertion is this lab's bounded,
stricter adaptation.

**One cryptographic policy choice relative to SAML Core 5.4.1 is deliberate.** That section says processors
SHOULD support `rsa-sha1`. SHA-1 is not collision resistant and is unfit for
signatures, so this lab implements `rsa-sha256` from XML Signature 1.1 instead and
supports no SHA-1 algorithm at all. Other bounded adaptations and omissions are named
where they occur rather than being treated as full profile conformance.

## Four questions a single boolean hides

XML Signature 1.1 §3.2 splits core validation into reference validation and signature
validation. A library does both and returns one value. This lab answers four questions
separately, on every run, and every negative control names which one it failed.

| Layer | Question | Established by |
|---|---|---|
| **L1 signature** | Is `SignatureValue` valid over the canonical `SignedInfo`, under the trusted key? | the dependency, plus a bounded Web Crypto recomputation that shares the parser and canonicalizer |
| **L2 binding** | Which single element does the one `Reference` resolve to, is that unambiguous, and **is it the element the application is about to read?** | the digest half by the dependency; the rest by the application |
| **L3 profile** | Response correlation and status, audience, recipient, an authentication statement, one complete bearer-confirmation tuple, validity windows and single use — on the L2 element and local SP state | SAMLProf 4.1.4.2/3/5 as amended by Errata 05 E26; SAMLCore 1.3.3/2.5.1.2/2.5.1.4/3.2.2 |
| **L4 authorization** | Which principal, and which role? | the application |

### What the library establishes, and what it cannot

`xmldsigjs` performs exclusive canonicalization, applies the enveloped-signature
transform, resolves the same-document reference, digests and verifies the RSA
signature over `SignedInfo`. It also, on its own, refuses a document carrying two
elements with the same ID — checked here rather than assumed, and stated because it
is a real thing the dependency does.

What it returns is a **boolean**. It does not tell the application which element it
validated. Whether the element the application then reads is that element is a
question no signature library answers for you, and it is the one this lab is about.

## What the comparison shows

| Scenario | Signature | Vulnerable consumer | Repaired consumer |
|---|---|---|---|
| Honest signed response | verifies | authorizes `alice`, `reader` | authorizes `alice`, `reader` |
| **XML Signature Wrapping** — original moved into the forged assertion's `saml:Advice` | **verifies** | **authorizes `admin`, `administrator`** | refuses at L2, `verified-node-wrong-position` |
| **Unsigned assertion placed first** — original left exactly where it was | **verifies** | **authorizes `admin`, `administrator`** | authorizes `alice`, `reader` — the right answer, not a refusal |

The third row is why the repair is the element binding and not the position rule: the
verified node is in the right position there, and only a consumer that never asks the
document a second time gets it right.

Both malicious rows are adversarial documents, not conforming IdP output. In particular,
the sibling-assertion document does not satisfy the POST profile's rule that every relied-
upon assertion be signature-protected. The row tests a narrower and important property:
authorization stays bound to the assertion that was actually verified.

**Signature-byte tampering is a different row on purpose.** It breaks the cryptography
and both consumers catch it at L1. Wrapping breaks nothing cryptographic at all. A lab
that presented the first as the wrapping lesson would teach the opposite of the lesson.

## Threat model and limitations

**The attacker holds no key.** The only powers used are "observe one valid response"
and "edit XML" — the weak adversary of Somorovsky et al. Every malicious document here
starts from a response the synthetic identity provider really signed.

**Not implemented, and claimed about in no way:**

- **Metadata exchange** (`[SAMLMeta]`). The trust anchor is one pinned raw public key
  set in code, not a parsed, signed metadata document.
- **Identity provider discovery** and the scoping machinery around it.
- **Single Logout** (SAMLProf §4.4) and session management. `SessionIndex` rides in the
  fixtures; no session is established, enforced or terminated.
- **Name identifier management and the federation lifecycle** — persistent pseudonyms,
  account linking, defederation.
- **Real trust-anchor administration.** No X.509 chain building, path validation or
  revocation, and `ds:KeyInfo` is ignored entirely. Certificate chains are
  [PKI Chain](https://systemslibrarian.github.io/crypto-lab-pki-chain/)'s subject.
- **XML Encryption.** No `EncryptedAssertion`. SAMLSec §6.1.2 notes encryption would not
  stop replay anyway.
- **Production XML-parser hardening.** Parsing uses `@xmldom/xmldom`'s defaults. No
  claim is made about entity expansion, external entities, or schema-validation and
  round-tripping differences between parsers — and that last class is itself a known
  source of wrapping variants. Required Core attributes and constructs outside the
  explicitly listed checks are generated by the fixtures but are not comprehensively
  validated.
- **Full multi-assertion profile conformance.** The attack documents are hostile inputs,
  not conforming IdP output. This bounded consumer does not use E26's same-principal and
  every-relied-upon-assertion protection rules as its binding repair; a production
  consumer must enforce those rules as well.
- **The other wrapping permutations.** Somorovsky et al. Figure 7 enumerates twelve
  two-level permutations alone; this lab executes two, plus related reference defects.
- **Other bindings and profiles** — no HTTP Redirect binding and its query-string
  signatures, no Artifact binding, no SOAP or ECP, no SAML 1.1.

**Specifically not claimed:** that any named SAML library or deployment is vulnerable —
the only consumer broken here is one this lab wrote in order to break it; that the
repair shown defeats every wrapping permutation; or that passing these checks would make
a real service provider secure.

## Primary sources

Exact versions and the sections read are in
[`docs/design-and-sources.md`](docs/design-and-sources.md).

- OASIS, *Assertions and Protocols for the OASIS SAML V2.0* (`saml-core-2.0-os`), OASIS
  Standard, 15 March 2005 — §2.5.1.2, §2.5.1.4, §5.1–5.3, §5.4.1–5.4.5.
- OASIS, *Profiles for the OASIS SAML V2.0* (`saml-profiles-2.0-os`), OASIS Standard,
  15 March 2005 — §4.1.4.2, §4.1.4.3, §4.1.4.5, §4.1.5.
- OASIS, *Bindings for the OASIS SAML V2.0* (`saml-bindings-2.0-os`), OASIS Standard,
  15 March 2005 — §3.5.
- OASIS, *Security and Privacy Considerations for the OASIS SAML V2.0*
  (`saml-sec-consider-2.0-os`), OASIS Standard, 15 March 2005 — §6.1.2, §6.4.1–6.4.6.
- OASIS, *SAML Version 2.0 Errata 05*, OASIS Approved Errata, 01 May 2012 — item E26.
- W3C, *XML Signature Syntax and Processing Version 1.1*, Recommendation 11 April 2013 —
  §3.2, §3.2.1, §3.2.2, §4.4.3.
- W3C, *Exclusive XML Canonicalization Version 1.0*, Recommendation 18 July 2002.
- W3C, *XML Signature Best Practices*, Working Group Note 11 April 2013 — Best Practice
  14, which the repaired consumer implements.
- J. Somorovsky, A. Mayer, J. Schwenk, M. Kampmann, M. Jensen, "On Breaking SAML: Be
  Whoever You Want to Be", 21st USENIX Security Symposium, 2012 — §3.4, §4.3, §7.5–7.6,
  §8.
- M. McIntosh, P. Austel, "XML signature element wrapping attacks and countermeasures",
  Workshop on Secure Web Services, 2005 — the origin of the attack class, cited for
  attribution. **Not obtained in full**; no claim here rests on its text.
- F. Biennier, "Web Single Sign On and SAML", *Encyclopedia of Cryptography, Security
  and Privacy*, Springer Nature Switzerland, 2025, original pp. 6803–6814, DOI
  `10.1007/978-3-030-71522-9_906` — the entry this lab answers. Read in full for
  framing: it names the four standardized SAML elements and walks the browser SSO
  exchange, and it contains no XML Signature detail, so no technical decision below
  rests on it.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-saml-binding
cd crypto-lab-saml-binding
npm ci
npm run dev
`​``

## Testing

`​``bash
npm run typecheck      # tsc --noEmit over src, tests, e2e and the configs
npm test               # vitest run (88 tests, 7 files)
npm run test:mutation  # clean baseline, 26 named mutations, byte-for-byte restore
npm run build          # tsc --noEmit && vite build
npm run test:a11y      # playwright: claims, WCAG A/AA, forced colors, 320/380/1280 reflow
`​``

What the suites assert, beyond "it runs":

- **Canonicalization against the specification, not against itself.** The expected
  canonical octets for eight fixed documents are written out by hand from Exclusive XML
  Canonicalization 1.0 §3 and Canonical XML 1.0 — the visibly-utilized rule, namespace
  and attribute ordering, empty-element form, and the different escaping rules for text
  and for attribute values. Every digest claim in this lab rests on those bytes, so they
  are checked against the specification rather than captured from a run.
- **Two cross-checking verification paths, with the shared machinery named.** The lab
  reapplies the enveloped transform, recomputes the reference digest, and verifies
  `SignatureValue` through Web Crypto without calling `SignedXml.Verify`. It shares the
  dependency's XML parser and exclusive canonicalizer, so this is not described as an
  end-to-end independent implementation; the hand-derived vectors above check that shared
  canonicalizer against the specification.
- **The wrapping premise.** Four things are asserted separately, so this cannot quietly
  become a tampering demo: the malicious document's signature really verifies, the moved
  assertion is byte-identical in canonical form, the vulnerable consumer authorizes the
  attacker's subject, and the repaired consumer refuses by name at L2.
- **Boundaries, not just the obvious cases.** Validity windows are tested one second
  either side of the allowed clock skew in both directions.
- **Profile boundaries and state.** Multiple bearer confirmations are tested both with a
  later valid tuple and with two partial tuples that must never be combined. Malformed
  SAML instants and a missing `AuthnStatement` are refused. A rejected assertion —
  including one under a bad Response Destination, Response correlation, or Status — must not burn its ID, and
  one service provider's consumed set must not leak into another's.
- **Browser claims that recompute, with no parser at all.** The rendered SAML document is
  re-read in the test by a token scanner that walks the serialized bytes and tracks
  element nesting directly — it uses neither the lab's XML parser nor the browser's, so it
  shares no machinery with the implementation. The `DigestValue` is base64-decoded there,
  and the page's displayed digests, reference URI, assertion census, control count and
  authorization outcome are all checked against that independent read rather than against
  the page's own sentences.
- **The mutation gate** asserts a clean baseline first, runs 26 named mutations each
  against one named owning test, allows no retries and no skips, refuses a mutation whose
  anchor no longer applies, verifies byte-for-byte restoration by hash, and re-runs the
  clean baseline afterwards.

## Stack

Vite · TypeScript strict · `@xmldom/xmldom` · `xmldsigjs` · Web Crypto API · Vitest ·
Playwright · axe-core · GitHub Pages

CI runs clean-install, dependency audit, type-check, unit, mutation and build gates on
Node 22/24/26, then the browser claim and accessibility gates, then CodeQL. Every action
is pinned to an immutable commit SHA. Only the no-checkout deploy job receives
Pages/OIDC authority, and both artifact packaging and deployment require the `main` ref.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

```

</details>

---
