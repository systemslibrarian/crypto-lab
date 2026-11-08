# Crypto Lab audit corpus — RANDOMNESS

Generated 2026-11-08T20:20:28.593Z from 9 lab record(s).

Every finding must cite **commit_sha + lab slug + field**. A field printed as
`MISSING` was not found by the generator; it is not a claim that the lab lacks it.

---
## DRBG Arena

- **slug**: `crypto-lab-drbg-arena`
- **repo**: https://github.com/systemslibrarian/crypto-lab-drbg-arena
- **live**: https://systemslibrarian.github.io/crypto-lab-drbg-arena/
- **commit_sha**: `f0a2012659b500fd6c7cf9d578ce6013df501a96` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: RANDOMNESS  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, claims, mutations, verification

**Name (H1)**: DRBG Arena  — _read from src/main.ts_

**Subtitle**: HMAC · CTR · Hash_DRBG · NIST SP 800-90A  — _read from src/main.ts_

**Description**: Seed each of the three NIST-approved DRBGs and watch a high-entropy seed expand through the seed → state → output → reseed lifecycle into a deterministic pseudorandom stream.  — _read from src/main.ts_

**Why it matters**: Keys, nonces, and IVs are only as safe as the generator behind them. A DRBG must stay unpredictable even if its state leaks, and passing statistical tests proves nothing — Dual_EC looked random too.  — _read from src/main.ts_

**Card copy**: Explore HMAC_DRBG, CTR_DRBG, and Hash_DRBG state and reseeding. Compare statistical tests, including a signed monobit exercise, and distinguish plausible output from seed freshness and credited entropy.

**Chips**: HMAC_DRBG · CTR_DRBG · Hash_DRBG · NIST SP 800-90A

**Implements**: AES `src/crypto/utils.ts:56`, AES-CBC `src/crypto/utils.ts:62`, CTR-DRBG `src/crypto/ctr-drbg.ts:25`, HMAC `src/crypto/hmac-drbg.ts:20`, HMAC-DRBG `src/crypto/hmac-drbg.ts:20`, SHA-256 `src/crypto/utils.ts:38`, SHA-512 `src/crypto/utils.ts:43`

**Attacks shown**: Discrete log `src/ui/exhibit5.ts:177`

**Comment-only (named in code comments, not executed)**: AES-CTR `src/crypto/ctr-no-update.ts:18`, SHA-384 `src/crypto/hash-drbg.ts:27`

**References**: Argon2, ECDSA, HKDF, PBKDF2, scrypt

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `eprint.iacr.org/2016/863` — first seen src/ui/signed-monobit.ts:21 (1×)
- `FIPS 140-2` — first seen README.md:10 (5×)
- `NIST SP 800-22` — first seen README.md:27 (4×)
- `NIST SP 800-22 Rev. 1a` — first seen README.md:37 (2×)
- `NIST SP 800-90A` — first seen README.md:5 (6×)
- `NIST SP 800-90A Rev 1` — first seen src/crypto/ctr-drbg.ts:2 (4×)
- `RFC 6979` — first seen src/ui/exhibit2.ts:182 (1×)
- `SP 800-22` — first seen src/stats/nist-tests.ts:66 (8×)
- `SP 800-90A` — first seen README.md:34 (26×)
- `SP 800-90A Rev. 1` — first seen README.md:110 (3×)
- `SP 800-90A Rev.1` — first seen src/crypto/hash-drbg.ts:172 (1×)
- `SP 800-90C` — first seen README.md:104 (7×)

**README — What Can Go Wrong**:

```text
- **Insufficient entropy at seeding.** A DRBG is only as strong as its seed; seeding from a low-entropy or predictable source makes all output predictable regardless of the algorithm.
- **No reseeding or prediction resistance.** Generating indefinitely from one seed without reseeding means a future state compromise can expose subsequent output; SP 800-90A defines reseed limits for a reason.
- **State compromise and backtracking.** If the internal state leaks, an implementation without proper backtracking resistance can let an attacker reconstruct previously generated values.
- **Choosing a non-CSPRNG.** Using `Math.random()` or other statistical (non-cryptographic) generators for keys, nonces, or IVs defeats the entire scheme.
- **Trusting statistical tests for security.** A fixed or public seed can produce statistically plausible output. Repeating it reproduces the stream and its test scores; these tests do not establish seed freshness, secrecy, unpredictability, or absence of a backdoor. [NIST SP 800-22 Rev. 1a (2010)](https://csrc.nist.gov/pubs/sp/800/22/r1/upd1/final) explicitly says statistical testing cannot replace cryptanalysis. Exhibit 5’s Dual_EC row remains an OS-randomness stand-in, not an implementation of Dual_EC.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-drbg-arena

## What It Is

DRBG Arena demonstrates the three NIST SP 800-90A approved Deterministic Random Bit Generators: HMAC_DRBG, CTR_DRBG, and Hash_DRBG. Each construction takes entropy from a true random source and produces a cryptographically secure pseudorandom output stream. This demo is the correct-case companion to [Corrupted Oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/), which shows what happens when a DRBG is intentionally backdoored (Dual_EC_DRBG). The security model is symmetric: all output is deterministically derived from the seed, computationally indistinguishable from true randomness, and resistant to backtracking and prediction attacks.

## When to Use It

- HMAC_DRBG — general-purpose secure random generation in most applications.
- CTR_DRBG — FIPS 140-2/3 required environments, or when AES-NI is available.
- Hash_DRBG — constrained environments needing the simplest correct implementation.
- Never use `Math.random()` for cryptographic key or nonce generation.
- Never use Dual_EC_DRBG under any circumstances (see Corrupted Oracle).
- Do not seed any DRBG with low-entropy sources (timestamps, PIDs, counters).
- Do NOT treat this as production code — it is a teaching demo, not a hardened RNG library.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-drbg-arena](https://systemslibrarian.github.io/crypto-lab-drbg-arena/)**

Six exhibits plus a live conformance check:

1. **DRBG fundamentals and security properties** — what a DRBG is, the three constructions, backtracking vs prediction resistance, and the seed → state → output → reseed data flow.
2. **HMAC_DRBG** — an animated *state-update* visualizer that shows the old V flowing through the one-way `HMAC(K, V)` box to fork out both the output stream and a fresh (K, V), making backtracking resistance mechanical rather than asserted; a **determinism panel** that stacks and diff-highlights "Same Seed Again" (identical stream) against a one-click "Flip 1 Seed Digit" avalanche (the entire stream changes), with the reference row always naming what it is a baseline of; all three seed inputs — entropy, nonce, personalization — shown, because the output is a function of all of them and a hidden one makes "same seed, same stream" untestable from what is on screen; plus inline glossary terms for seed, entropy, nonce, and personalization string.
3. **CTR_DRBG** — AES-256 construction with a same-entropy side-by-side against HMAC_DRBG, an inline `seedlen` glossary explaining why AES-256 needs 48 bytes (256-bit key + 128-bit block), a **timed comparison** that runs 40 instantiate+generate rounds of each on your press and prints which one was faster here — with an explicit note that per-call browser overhead is not the same measurement as native AES-NI throughput — and an **under-seeding disclosure**: type two hex digits and the panel states that the instantiation carries 8 bits of entropy rather than 384, instead of zero-padding it silently.
4. **Hash_DRBG** — full three-way comparison table.
5. **Statistical output quality** — simplified NIST SP 800-22 tests run live on all three implementations, a Shannon-entropy chart whose caption quotes the run's own measured range and explains why 1,024 bytes cannot reach the 8.00 bits/byte ceiling, and a **randomness pixel grid** contrasting real DRBG output against the *low* byte of an LCG, whose period is exactly the grid width so every row comes out identical. Under each grid: the measured row-to-row correlation and how many of the four tests that exact stream passed. Then a Dual_EC_DRBG comparison — with an on-screen disclosure that the row uses OS randomness as a stand-in — showing that clean-looking output proves nothing about a hidden trapdoor. Every verdict on the page is the tally of what the run returned; nothing is announced in advance.

6. **Steal the state** — the page's strongest claim, made falsifiable. Exhibit 2 says in prose that an attacker who steals the internal state cannot reconstruct earlier output. Here you mount the theft. Two generators are seeded from the *same* entropy: the approved HMAC_DRBG, and **CTR-no-update** — the approved CTR_DRBG with exactly one line deleted, the `CTR_DRBG_Update` call after Generate. Both emit three 32-byte rounds; the state is stolen after round 2, exfiltrated as hex and rebuilt on the attacker's side; four attacks then run from those bytes alone, each scored byte-for-byte against what really happened. CTR-no-update's counter steps backwards and returns **32/32 bytes of both earlier rounds**; HMAC_DRBG returns nothing above the chance rate. The defective generator is the point: it is the positive control that proves the experiment can *see* a broken past, so "HMAC_DRBG gave up nothing" is a measurement rather than a restatement. The third row shows both generators handing over the *next* round exactly — prediction resistance is a separate property — and the fourth shows a reseed from fresh entropy locking both attackers out. Every verdict is a pure function of the match count and never sees which generator produced the attempt.

## What Can Go Wrong

- **Insufficient entropy at seeding.** A DRBG is only as strong as its seed; seeding from a low-entropy or predictable source makes all output predictable regardless of the algorithm.
- **No reseeding or prediction resistance.** Generating indefinitely from one seed without reseeding means a future state compromise can expose subsequent output; SP 800-90A defines reseed limits for a reason.
- **State compromise and backtracking.** If the internal state leaks, an implementation without proper backtracking resistance can let an attacker reconstruct previously generated values.
- **Choosing a non-CSPRNG.** Using `Math.random()` or other statistical (non-cryptographic) generators for keys, nonces, or IVs defeats the entire scheme.
- **Trusting statistical tests for security.** A fixed or public seed can produce statistically plausible output. Repeating it reproduces the stream and its test scores; these tests do not establish seed freshness, secrecy, unpredictability, or absence of a backdoor. [NIST SP 800-22 Rev. 1a (2010)](https://csrc.nist.gov/pubs/sp/800/22/r1/upd1/final) explicitly says statistical testing cannot replace cryptanalysis. Exhibit 5’s Dual_EC row remains an OS-randomness stand-in, not an implementation of Dual_EC.

## Real-World Usage

- **TLS and crypto libraries.** OpenSSL and many cryptographic libraries ship SP 800-90A DRBGs (commonly CTR_DRBG with AES) as their default secure random source.
- **Operating system RNGs.** OS entropy facilities feed CSPRNGs that follow the same seed-and-expand design these DRBGs formalize.
- **FIPS 140-2/3 modules.** Validated cryptographic modules are required to use SP 800-90A approved DRBGs, with CTR_DRBG common in FIPS-constrained environments.
- **HSMs and secure elements.** Hardware security modules combine a hardware entropy source with an approved DRBG to produce keys and nonces.
- **Protocol nonce/IV generation.** Secure generation of nonces, IVs, and ephemeral keys across TLS, IPsec, and similar protocols depends on a correctly seeded DRBG.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-drbg-arena
cd crypto-lab-drbg-arena
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-corrupted-oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/) — the backdoored counterpart, showing Dual_EC_DRBG's hidden trapdoor.
- [crypto-lab-vrf-gate](https://systemslibrarian.github.io/crypto-lab-vrf-gate/) — verifiable random functions and VDFs for public, provable randomness.
- [crypto-lab-phantom-vault](https://systemslibrarian.github.io/crypto-lab-phantom-vault/) — PBKDF2 and HMAC-DRBG with rejection sampling in a key-derivation context.
- [crypto-lab-kdf-arena](https://systemslibrarian.github.io/crypto-lab-kdf-arena/) — HKDF, PBKDF2, scrypt, and Argon2id key-derivation comparison.

## Correctness Is Verified, Not Asserted

A DRBG demo is only worth learning from if its output is provably conformant. All three constructions are tested **byte-for-byte against the official NIST CAVP known-answer vectors** (DRBG Validation System):

| Algorithm | Vector | Status |
|-----------|--------|--------|
| HMAC_DRBG | SHA-256, no prediction resistance | exact match |
| CTR_DRBG  | AES-256 (no df), no prediction resistance | exact match |
| Hash_DRBG | SHA-256, no prediction resistance | exact match (both Generate calls) |

The same vectors run three ways: in CI on every commit (`npm test`), as a **live self-check in your browser** on page load (the "Live Conformance Check" panel), and as the values displayed in that panel — one source of truth in [`src/crypto/self-check.ts`](src/crypto/self-check.ts), no drift. The GitHub Pages deploy is gated on the test job: if a vector ever fails to match, the site does not ship.

`​``bash
npm test        # NIST CAVP known-answer tests + property tests + exhibit-claim tests
npm run test:a11y   # axe WCAG A/AA gate + Playwright behaviour gates on the exhibits
`​``

The CAVP vectors gate the cryptography. A second class of gate covers what the *page* says
about it, because every defect found in the last review was a claim the primitives underneath
had no opinion on. `src/stats/nist-tests.test.ts` pins the broken-generator grid to its
measured properties (the low-byte LCG's row correlation is 1.0 and it fails all four tests;
the high byte it used to paint has correlation ~0.002 and passes all four), and pins the
~7.81 bits/byte a perfect 1,024-byte sample averages, which is the number the entropy caption
now explains rather than rounding to 8.00. `e2e/exhibits.spec.ts` drives the page: flip a seed
digit then press Same Seed Again and the determinism verdict must still read zero differences;
under-seed CTR_DRBG and the panel must say how many bits it really has; press Compare and the
speed row must contain a measured millisecond figure; and Exhibit 6's four attacks are pinned
from a fixed seed on **both** sides — the control must surrender 32/32 past bytes and
HMAC_DRBG must surrender no more than 3, because a blind experiment would pass the second
assertion while failing the first. `src/crypto/compromise.test.ts` additionally pins the
verdict function to the match counts alone and pins `summarize` to refuse a pass when the
control also looks safe ("inconclusive, not a pass").

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## System construction bridge

The live demo now links the [SP 800-90C final](https://csrc.nist.gov/pubs/sp/800/90/c/final) construction classes to source health, conditioning and fresh-input dependencies. DRBG Arena’s class chooser is a source-request model, not a validated RBG or a replacement for the existing compromise experiments.

## Input routing lesson and attribution

“Which input earns entropy credit?” separates a hypothetical validated source from unvalidated extra bytes. Change freshness, health, validation status, and routing to see whether the modeled reseed has its required 256 credited bits. The live comparison uses the existing Hash_DRBG with real optional `additional_input` in reseeding (§10.1.1.3), demonstrating that an input can change output while receiving zero credited entropy. Every byte in this comparison is a fixed public placeholder, so the numerical source credit is explicitly hypothetical. The panel is neither a source assessment nor an RBG3 implementation.

**Credit:** Joshua E. Hill, *[(Current) Limitations on SP 800-90C External Conditioners and How to Overcome (Some of) Them](https://www.untruth.org/~josh/sp80090b/N20b%20HillJ%20Get_entropy_bitstring%20Restrictions%2020260422.pdf)*, ICMC N20b, version 20260422, slides 2–8, informs the input-routing lesson. The interaction and implementation are original Crypto Lab work. Hill’s later RBGC proposal and discussion of draft CMVP interpretation guidance are not presented as adopted requirements or implemented by this panel. No Hill review or endorsement is implied. Normative references: [SP 800-90C final (2025), §3.1](https://csrc.nist.gov/pubs/sp/800/90/c/final) and [SP 800-90A Rev. 1, §10.1.1.3](https://csrc.nist.gov/pubs/sp/800/90/a/r1/final).

## Research review extension 31 October 2026

R20261031-02: Exhibit 5 now compares signed and absolute monobit statistics, folded P and signed Q values. An exact finite binomial census supplies expected bin masses for either normal-approximation or inclusive exact tails. Block length and block count are independent controls; ties and sparse expected occupancies are explicit. This is a diagnostic experiment, without a randomness certificate or a simulated rejection-rate claim.

```

</details>

---

## VRF Gate

- **slug**: `crypto-lab-vrf-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-vrf-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-vrf-gate/
- **commit_sha**: `b7c473e1bbe6ee390e5a17d32105afd9806f0b09` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: RANDOMNESS  ·  **level**: advanced  ·  **--accent**: var(--cyan)
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: VRF + VDF  — _read from src/main.ts_

**Subtitle**: ECVRF · RFC 9381 · Wesolowski VDF  — _read from src/main.ts_

**Description**: Compute and publicly verify a keyed VRF output, run a sequential time-lock VDF, then chain both into a live RANDAO + VDF randomness beacon you can watch resist withholding.  — _read from src/main.ts_

**Why it matters**: Blockchains pick leaders and lotteries from public randomness, so any predictable or grindable bias is money on the table. VRFs make randomness unforgeable; VDFs delay it past the point where an attacker can preview and rig the outcome.  — _read from src/main.ts_

**Card copy**: ECVRF prove/verify, Wesolowski VDF repeated squaring, and a RANDAO-plus-VDF beacon simulation that shows how verifiable randomness resists last-reveal manipulation.

**Chips**: ECVRF P-256 · Wesolowski VDF · RANDAO · RFC 9381

**Implements**: EC point arithmetic `src/utils/p256.ts:63`, ECDH `src/ecvrf.ts:272`, HMAC `src/ecvrf.ts:92`, Miller–Rabin `src/vdf.ts:77`, P-256 `src/ecvrf.ts:272`, SHA-256 `src/beacon.ts:23`

**Attacks shown**: Factoring `src/main.ts:588`

**Comment-only (named in code comments, not executed)**: Fiat-Shamir `src/main.ts:62`, RSA `src/vdf.ts:26`

**References**: ECDSA, Hash-to-curve, RSA, Shamir secret sharing, Shor's algorithm

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 186-4` — first seen src/main.ts:778 (3×)
- `NIST SP 800-90A` — first seen README.md:48 (1×)
- `RFC 6979` — first seen README.md:7 (8×)
- `RFC 9381` — first seen README.md:7 (25×)
- `RFC6979` — first seen src/ecvrf.ts:170 (2×)
- `rfc9381` — first seen README.md:7 (2×)

**README — What Can Go Wrong**:

```text
- A VRF needs a unique, secret-derived nonce; a biased or reused nonce in the `s = k + c·x` response can leak the secret key, the same class of failure that breaks ECDSA.
- Hash-to-curve must be implemented carefully (try-and-increment, correct ciphersuite tag); a flawed mapping can bias outputs or break verifier interoperability.
- The toy Wesolowski VDF offers no delay guarantee whatsoever, and the reason is the factorisation rather than the size: `N` is the product of two famous published primes, so `λ(N)` is public and the whole sequential computation collapses to one modular exponentiation. A production VDF needs a modulus whose order nobody knows — a 2048-bit RSA modulus from a trusted ceremony, or a class group.
- VDF security assumes inherently sequential computation; specialized or parallel hardware can shrink the intended delay below the protocol's assumptions.
- In commit-reveal beacons the last participant to reveal can choose to withhold and bias the result — the "last-revealer" problem a VDF is meant to neutralize.
```

**Claims tested** (e2e/claims.spec.ts, 41 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:28
    - :28 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:35
    - :35 `toHaveText` expected `'—'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:36
    - :36 `toHaveText` expected `'loading...'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:37
    - :37 `toHaveText` expected `'—'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:38
    - :38 `toContainText` expected `'run 1:'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:78
    - :78 `toContainText` expected `'α = "${alpha}"'` _(expression)_
- `the proof, the beta and the "see the math" panel all describe one run` — e2e/claims.spec.ts:100
    - :116 `toBe` expected `beta` _(expression)_
    - :117 `toBe` expected `proof.gamma` _(expression)_
    - :118 `toBe` expected `proof.c` _(expression)_
    - :119 `toBe` expected `proof.s` _(expression)_
    - :122 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :123 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :124 `toMatch` expected `/^0[23][0-9a-f]{64}$/` _(regex)_
    - :125 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :128 `toMatch` expected `/valid point found at counter \d+/` _(regex)_
- `the verifier pane is handed exactly what the producer computed` — e2e/claims.spec.ts:131
    - :138 `toBe` expected `await value(page, '#vrf-alpha')` _(expression)_
    - :139 `toBe` expected `await text(page, '#vrf-beta')` _(expression)_
    - :140 `toBe` expected `await text(page, '#vrf-proof')` _(expression)_
- `the same alpha recomputes to byte-identical beta and proof` — e2e/claims.spec.ts:143
    - :153 `toBe` expected `first.beta` _(expression)_
    - :156 `toBe` expected `other` _(expression)_
    - :157 `toHaveText` expected `'—'` _(literal)_
- `the uniqueness card compares all 32 bytes and re-verifies each proof` — e2e/claims.spec.ts:160
    - :169 `toContainText` expected `'run 5:'` _(literal)_
    - :173 `toHaveLength` expected `5` _(literal)_
    - :175 `toEqual` expected `new Set([shortHex(beta)])` _(expression)_
    - :177 `expect` expected _no expected value_ _(none)_
    - :178 `expect` expected _no expected value_ _(none)_
    - :179 `expect` expected _no expected value_ _(none)_
    - :180 `expect` expected _no expected value_ _(none)_
- `the pseudorandomness card reports a byte difference the page can be held to` — e2e/claims.spec.ts:183
    - :192 `toBe` expected `alpha` _(expression)_
    - :197 `toHaveLength` expected `2` _(literal)_
    - :198 `toBe` expected `shortHex(betaForAlpha)` _(expression)_
    - :202 `toBe` expected `32` _(literal)_
    - :208 `toBe` expected `shortHex(betaForAlphaPrime)` _(expression)_
    - :209 `toBe` expected `claimed` _(expression)_
    - :212 `expect` expected _no expected value_ _(none)_
- `an alpha-prime identical to alpha is called determinism, not pseudorandomness` — e2e/claims.spec.ts:215
    - :225 `toContainText` expected `'α′ is identical to α'` _(literal)_
    - :229 `toBe` expected `shorts[1]` _(expression)_
    - :230 `toMatch` expected `/β bytes differ/` _(regex)_
- `a genuine proof verifies, and the verdict claims only what was checked` — e2e/claims.spec.ts:235
    - :242 `toHaveAttribute` expected `'data-tone', 'neutral'` _(expression)_
    - :244 `toHaveAttribute` expected `'data-tone', 'good'` _(expression)_
    - :247 `expect` expected _no expected value_ _(none)_
    - :250 `toMatch` expected `/\brandom\b/i` _(regex)_
    - :251 `toMatch` expected `/unpredictab/i` _(regex)_
- `a tampered beta is rejected` — e2e/claims.spec.ts:254
    - :260 `toHaveAttribute` expected `'data-tone', 'bad'` _(expression)_
    - :261 `expect` expected _no expected value_ _(none)_
- `the right proof against the wrong input is rejected` — e2e/claims.spec.ts:264
    - :272 `toBe` expected `beta` _(expression)_
    - :273 `toBe` expected `proof` _(expression)_
    - :276 `toHaveAttribute` expected `'data-tone', 'bad'` _(expression)_
- `a tampered proof scalar is rejected` — e2e/claims.spec.ts:279
    - :293 `toHaveAttribute` expected `'data-tone', 'bad'` _(expression)_
    - :294 `expect` expected _no expected value_ _(none)_
- `a malformed proof is refused as unparseable, not as a failed verification` — e2e/claims.spec.ts:297
    - :306 `toHaveAttribute` expected `'data-tone', 'bad'` _(expression)_
    - :307 `expect` expected _no expected value_ _(none)_
    - :313 `toHaveAttribute` expected `'data-tone', 'bad'` _(expression)_
    - :314 `expect` expected _no expected value_ _(none)_
- `tampering with beta retires the verdict instead of leaving it endorsing the tamper` — e2e/claims.spec.ts:319
    - :327 `toHaveAttribute` expected `'data-tone', 'good'` _(expression)_
    - :331 `toBe` expected `verified` _(expression)_
    - :334 `toHaveAttribute` expected `'data-tone', 'neutral'` _(expression)_
    - :335 `expect` expected _no expected value_ _(none)_
- `editing any verifier field retires a standing verdict` — e2e/claims.spec.ts:338
    - :345 `toHaveAttribute` expected `'data-tone', 'good'` _(expression)_
    - :348 `toHaveAttribute` expected `'data-tone', 'neutral'` _(expression)_
    - :349 `expect` expected _no expected value_ _(none)_
- `editing alpha retires the producer readouts it no longer describes` — e2e/claims.spec.ts:353
    - :360 `toContainText` expected `'run 5:'` _(literal)_
    - :364 `toHaveText` expected `'—'` _(literal)_
    - :365 `toHaveText` expected `'—'` _(literal)_
    - :366 `toHaveText` expected `'—'` _(literal)_
    - :367 `toHaveText` expected `'—'` _(literal)_
    - :368 `toContainText` expected `'run 1:'` _(literal)_
    - :369 `expect` expected _no expected value_ _(none)_
    - :373 `toHaveText` expected `'—'` _(literal)_
    - :374 `expect` expected _no expected value_ _(none)_
- `an in-flight VRF computation cannot repaint results after alpha changes` — e2e/claims.spec.ts:377
    - :390 `toHaveText` expected `'—'` _(literal)_
    - :391 `toHaveText` expected `'—'` _(literal)_
    - :392 `expect` expected _no expected value_ _(none)_
- `an in-flight VRF verification cannot endorse fields edited during the check` — e2e/claims.spec.ts:395
    - :409 `toHaveAttribute` expected `'data-tone', 'neutral'` _(expression)_
    - :410 `expect` expected _no expected value_ _(none)_
- `recomputing for a new alpha retires a uniqueness verdict run over the old one` — e2e/claims.spec.ts:413
    - :420 `toContainText` expected `'run 5:'` _(literal)_
    - :425 `toBe` expected `staleRuns` _(expression)_
    - :426 `expect` expected _no expected value_ _(none)_
    - :430 `toContainText` expected `'run 5:'` _(literal)_
    - :431 `expect` expected _no expected value_ _(none)_
- `editing alpha-prime retires the comparison it was not part of` — e2e/claims.spec.ts:436
    - :439 `toMatch` expected `/β bytes differ|identical/` _(regex)_
    - :444 `toContainText` expected `'block-1848'` _(literal)_
- `evaluation runs exactly the number of squarings the slider advertises` — e2e/claims.spec.ts:449
    - :458 `toHaveText` expected `'—', { timeout: 60_000 }` _(expression)_
    - :460 `toBe` expected `advertised` _(expression)_
    - :461 `toBe` expected `'100%'` _(literal)_
    - :462 `toHaveAttribute` expected `'aria-valuenow', '100'` _(expression)_
    - :463 `toBe` expected `'2^${Math.log2(advertised)}'` _(expression)_
    - :466 `toBe` expected `advertised` _(expression)_
- `the Wesolowski identity verifies, and the check names the T it was built for` — e2e/claims.spec.ts:469
    - :477 `toHaveText` expected `'—', { timeout: 60_000 }` _(expression)_
    - :481 `toHaveAttribute` expected `'data-tone', 'good'` _(expression)_
    - :484 `expect` expected _no expected value_ _(none)_
    - :485 `expect` expected _no expected value_ _(none)_
    - :486 `toHaveText` expected `'Verify a proof to populate r.'` _(literal)_
    - :493 `toBeCloseTo` expected `chainMs / verifyMs, 0` _(expression)_
    - :495 `expect` expected _no expected value_ _(none)_
- `verifying before evaluating refuses instead of reporting a result` — e2e/claims.spec.ts:498
    - :505 `toHaveText` expected `'—'` _(literal)_
    - :507 `toHaveAttribute` expected `'data-tone', 'bad'` _(expression)_
    - :508 `expect` expected _no expected value_ _(none)_
    - :509 `toHaveText` expected `'Verify a proof to populate r.'` _(literal)_
- `the lambda shortcut lands on the identical y the squaring chain produced` — e2e/claims.spec.ts:512
    - :520 `toHaveText` expected `'—', { timeout: 60_000 }` _(expression)_
    - :525 `toContainText` expected `'Byte-identical', {` _(expression)_
    - :532 `toBe` expected `chainY` _(expression)_
    - :533 `expect` expected _no expected value_ _(none)_
    - :534 `toHaveText` expected _no expected value_ _(none)_
    - :540 `expect` expected _no expected value_ _(none)_
- `the shortcut states the equality whichever button is pressed first` — e2e/claims.spec.ts:543
    - :551 `toContainText` expected `'Press “Evaluate VDF”', {` _(expression)_
    - :559 `toHaveText` expected `'—', { timeout: 60_000 }` _(expression)_
    - :562 `toContainText` expected `'Byte-identical'` _(literal)_
    - :563 `toBe` expected `skipY` _(expression)_
- `moving T retires the proof bundle built for the old T` — e2e/claims.spec.ts:566
    - :571 `toHaveText` expected `'—', { timeout: 60_000 }` _(expression)_
    - :573 `toHaveAttribute` expected `'data-tone', 'good'` _(expression)_
    - :577 `toHaveText` expected `'—'` _(literal)_
    - :578 `toHaveText` expected `'—'` _(literal)_
    - :579 `toHaveText` expected `'—'` _(literal)_
    - :580 `toHaveText` expected `'Verify a proof to populate r.'` _(literal)_
    - :581 `toHaveAttribute` expected `'data-tone', 'neutral'` _(expression)_
    - :582 `expect` expected _no expected value_ _(none)_
    - :583 `expect` expected _no expected value_ _(none)_
    - :584 `toHaveText` expected _no expected value_ _(none)_
    - :591 `toHaveText` expected `'—', { timeout: 60_000 }` _(expression)_
    - :592 `toBe` expected `8192` _(literal)_
    - :594 `toHaveAttribute` expected `'data-tone', 'good'` _(expression)_
    - :595 `expect` expected _no expected value_ _(none)_
- `changing VDF controls during evaluation cannot publish the retired result` — e2e/claims.spec.ts:598
    - :607 `toBeEnabled` expected `{ timeout: 60_000 }` _(expression)_
    - :609 `toHaveText` expected `'—'` _(literal)_
    - :610 `toHaveText` expected `'—'` _(literal)_
    - :611 `toHaveAttribute` expected `'aria-valuenow', '0'` _(expression)_
    - :612 `expect` expected _no expected value_ _(none)_
- `changing x retires the proof bundle and the g it was derived from` — e2e/claims.spec.ts:615
    - :624 `toHaveText` expected `'—', { timeout: 60_000 }` _(expression)_
    - :627 `toHaveText` expected `'—'` _(literal)_
    - :628 `toHaveText` expected `g` _(expression)_
    - :629 `toHaveText` expected `'—'` _(literal)_
- `a non-hex x takes down g rather than leaving the previous one under it` — e2e/claims.spec.ts:632
    - :640 `toBe` expected `'—'` _(literal)_
    - :643 `toHaveText` expected `'—'` _(literal)_
    - :644 `toHaveAttribute` expected `'data-tone', 'bad'` _(expression)_
    - :645 `expect` expected _no expected value_ _(none)_
    - :649 `toContainText` expected `'not valid hex'` _(literal)_
    - :650 `toHaveText` expected `'—'` _(literal)_
    - :654 `toHaveText` expected `'—'` _(literal)_
- `the real-world projection says whether its rate was measured or assumed` — e2e/claims.spec.ts:657
    - :665 `expect` expected _no expected value_ _(none)_
    - :668 `toHaveText` expected `'—', { timeout: 60_000 }` _(expression)_
    - :671 `expect` expected _no expected value_ _(none)_
    - :672 `expect` expected _no expected value_ _(none)_
    - :678 `toBe` expected `squarings` _(expression)_
    - :684 `expect` expected _no expected value_ _(none)_
    - :685 `expect` expected _no expected value_ _(none)_
- `a withholding round verifies only the proofs that were actually published` — e2e/claims.spec.ts:690
    - :698 `toBeChecked` expected _no expected value_ _(none)_
    - :701 `toContainText` expected `'Beacon verification', {` _(expression)_
    - :708 `toHaveLength` expected `validators` _(expression)_
    - :709 `toHaveLength` expected `1` _(literal)_
    - :710 `toBe` expected `'malicious'` _(literal)_
    - :715 `toBe` expected `validators` _(expression)_
    - :717 `toBe` expected `validators - 1` _(expression)_
    - :718 `toBe` expected `total` _(expression)_
    - :720 `expect` expected _no expected value_ _(none)_
    - :721 `expect` expected _no expected value_ _(none)_
    - :722 `expect` expected _no expected value_ _(none)_
    - :723 `expect` expected _no expected value_ _(none)_
    - :724 `expect` expected _no expected value_ _(none)_
    - :729 `expect` expected _no expected value_ _(none)_
    - :730 `expect` expected _no expected value_ _(none)_
    - :731 `toBe` expected `honest` _(expression)_
    - :734 `expect` expected _no expected value_ _(none)_
    - :735 `expect` expected _no expected value_ _(none)_
- `an honest round verifies every proof and says the delay was still zero` — e2e/claims.spec.ts:738
    - :748 `toContainText` expected `'Beacon verification', {` _(expression)_
    - :753 `toHaveLength` expected `6` _(literal)_
    - :754 `expect` expected _no expected value_ _(none)_
    - :755 `expect` expected _no expected value_ _(none)_
    - :756 `expect` expected _no expected value_ _(none)_
    - :757 `expect` expected _no expected value_ _(none)_
    - :758 `expect` expected _no expected value_ _(none)_
    - :761 `expect` expected _no expected value_ _(none)_
    - :762 `expect` expected _no expected value_ _(none)_
- `the beacon VDF runs the delay its own slider names` — e2e/claims.spec.ts:765
    - :770 `toBe` expected `'2^12 squarings'` _(literal)_
    - :772 `toContainText` expected `'Beacon verification', {` _(expression)_
    - :776 `toBe` expected `4096` _(literal)_
    - :777 `expect` expected _no expected value_ _(none)_
    - :778 `toHaveAttribute` expected `'aria-valuenow', '100'` _(expression)_
- `changing the beacon controls retires the round that was run under the old ones` — e2e/claims.spec.ts:781
    - :795 `toContainText` expected `'Beacon verification', {` _(expression)_
    - :798 `expect` expected _no expected value_ _(none)_
    - :803 `expect` expected _no expected value_ _(none)_
    - :804 `expect` expected _no expected value_ _(none)_
    - :805 `expect` expected _no expected value_ _(none)_
    - :806 `expect` expected _no expected value_ _(none)_
    - :807 `toHaveAttribute` expected `'aria-valuenow', '0'` _(expression)_
- `changing beacon controls during a round prevents stale completion from repainting` — e2e/claims.spec.ts:811
    - :864 `expect` expected _no expected value_ _(none)_
    - :865 `expect` expected _no expected value_ _(none)_
    - :866 `expect` expected _no expected value_ _(none)_
    - :867 `toHaveAttribute` expected `'aria-valuenow', '0'` _(expression)_
    - :868 `toBeEnabled` expected _no expected value_ _(none)_
- `nothing carrying the hidden attribute is still painted` — e2e/claims.spec.ts:873
    - :884 `toEqual` expected `[]` _(expression)_
- `the page never sells the toy VDF as providing a delay` — e2e/claims.spec.ts:887
    - :891 `toContainText` expected _no expected value_ _(none)_
    - :895 `expect` expected _no expected value_ _(none)_
    - :896 `expect` expected _no expected value_ _(none)_
    - :897 `expect` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-vrf-gate

## What It Is

This demo combines ECVRF-P256-SHA256 and a Wesolowski VDF over an RSA-style group to show how public randomness can be both verifiable and delayed. The VRF side solves the problem of proving that a deterministic pseudorandom output came from one specific public key and input without exposing the secret key. The VDF side solves the problem of forcing a sequential delay before the final randomness can be known while keeping verification much cheaper than evaluation. The security model is asymmetric and publicly verifiable, uses WebCrypto plus exact BigInt arithmetic, and is not post-quantum secure.

The VRF is **byte-exact RFC 9381** (ciphersuite ECVRF-P256-SHA256-TAI): try-and-increment hash-to-curve, an RFC 6979 deterministic nonce, the `s = k + c·x` response, and SEC1 compressed points. A known-answer test (`npm run check:rfc9381`) reproduces the standard's official Appendix B.1 test vector — H, k, U, V, π, and β all match — and runs in CI before every deploy, so the outputs here would be accepted by any conforming verifier. The VDF is an intentionally broken "toy" Wesolowski construction, and the page says so where you run it. The construction is genuine, but its modulus is `N = p · n` — the NIST P-256 field prime times the P-256 curve order, both public constants. A VDF derives its delay entirely from nobody knowing how N factors; here everybody does, so anyone can reduce the exponent mod `λ(N) = lcm(p − 1, n − 1)` and reproduce the output with a single modular exponentiation, for any T. The delay is not short, it is zero. Production VDFs need a modulus of unknown order — an RSA modulus from a ceremony where no participant learns the factors, or a class group. Each exhibit has a layered **"See the math"** panel that exposes these intermediate values live.

## When to Use It

- Use it to teach validator selection or randomness beacons in proof-of-stake systems. The demo shows why a VRF gives unique verifiable contributions while a VDF delays strategic prediction.
- Use it to compare deterministic public-key randomness against plain hashing. The VRF exhibit shows that the same key and input always yield the same verifiable output, which a plain hash cannot restrict to one producer.
- Use it to explain last-reveal bias in commit-reveal protocols. The beacon simulation shows how withholding changes the RANDAO branch and why the VDF turns that into a blind choice.
- Use it to inspect VDF proof-verification structure and the shape of the evaluate/verify asymmetry. The exhibit exposes the delay slider, progress bar, and verification path directly in the browser — but read the timings as illustration only, since this modulus provides no real sequential work.
- Do NOT use it as a production cryptography library. The implementation is educational, the VDF modulus has publicly known factors and therefore enforces no delay at all, and nothing here is post-quantum-secure or hardened for deployment.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-vrf-gate](https://systemslibrarian.github.io/crypto-lab-vrf-gate/)**

In the browser you can generate and verify VRF outputs, run the VDF with a live delay progress bar, and simulate a RANDAO-style beacon round with optional malicious withholding. The demo exposes the VRF input field, the VDF delay slider, the validator-count slider, and the malicious-validator toggle so the user can change parameters and observe the proof flow directly. There is no encrypt/decrypt path in this demo because the code is about verifiable randomness and delay, not confidentiality.

## What Can Go Wrong

- A VRF needs a unique, secret-derived nonce; a biased or reused nonce in the `s = k + c·x` response can leak the secret key, the same class of failure that breaks ECDSA.
- Hash-to-curve must be implemented carefully (try-and-increment, correct ciphersuite tag); a flawed mapping can bias outputs or break verifier interoperability.
- The toy Wesolowski VDF offers no delay guarantee whatsoever, and the reason is the factorisation rather than the size: `N` is the product of two famous published primes, so `λ(N)` is public and the whole sequential computation collapses to one modular exponentiation. A production VDF needs a modulus whose order nobody knows — a 2048-bit RSA modulus from a trusted ceremony, or a class group.
- VDF security assumes inherently sequential computation; specialized or parallel hardware can shrink the intended delay below the protocol's assumptions.
- In commit-reveal beacons the last participant to reveal can choose to withhold and bias the result — the "last-revealer" problem a VDF is meant to neutralize.

## Real-World Usage

- Proof-of-stake leader and committee selection: protocols such as Algorand and Cardano's Ouroboros Praos use VRFs to pick block proposers verifiably and unpredictably.
- On-chain randomness services: Chainlink VRF supplies smart contracts with publicly verifiable random values for games, NFTs, and sampling.
- Ethereum's beacon chain uses RANDAO commit-reveal randomness, with VDFs long studied as a way to remove the last-revealer bias.
- Verifiable delay functions are also explored for timestamping, proof-of-replication, and other applications needing publicly checkable elapsed time.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-vrf-gate
cd crypto-lab-vrf-gate
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-drbg-arena](https://systemslibrarian.github.io/crypto-lab-drbg-arena/) — deterministic random bit generators, the NIST SP 800-90A side of randomness.
- [crypto-lab-corrupted-oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/) — what happens when a random number generator is backdoored or biased.
- [crypto-lab-commit-gate](https://systemslibrarian.github.io/crypto-lab-commit-gate/) — the commitment schemes behind commit-reveal randomness beacons.

## Verification

`​``bash
npm run check        # phase logic checks + RFC 9381 known-answer test
npm run e2e          # headless Chromium: drives the real UI + axe accessibility scan
npm run test:browser # Playwright: 31 claims tests + 2 axe scans
`​``

`npm run check` proves the VRF reproduces the RFC 9381 Appendix B.1 vector, and covers the two rejections the UI has no button for — a proof checked against a different public key, and a modified VDF output. `npm run e2e` builds the app, boots it in headless Chromium, exercises VRF compute/verify/tamper and VDF evaluate/verify, asserts no console errors and no horizontal overflow at a 360px viewport, and runs an [axe-core](https://github.com/dequelabs/axe-core) accessibility scan (WCAG 2.0/2.1 A + AA) — currently zero violations.

`npm run test:browser` runs the claims suite in `e2e/claims.spec.ts` alongside those axe scans. It asserts no fixed cryptographic values: every expectation is one page-computed value checked against another — the "See the math" panel against the proof JSON, the five uniqueness runs against β, the reported β-byte distance against two β the page printed, the λ shortcut's y against the squaring chain's y, the verification cost ratio against the two timings it quotes, and the beacon's verified-proof count against its validator count. It also drives each failure path (tampered β, wrong α, tampered π, unparseable proof, verifying before evaluating, non-hex x) and asserts that no verdict survives an edit to the input that produced it. All three commands run in CI before every deploy.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## VDF

- **slug**: `crypto-lab-vdf`
- **repo**: https://github.com/systemslibrarian/crypto-lab-vdf
- **live**: https://systemslibrarian.github.io/crypto-lab-vdf/
- **commit_sha**: `d2594f946418a9070e31a8cd0900e37c7fe344f4` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: RANDOMNESS  ·  **level**: advanced  ·  **--accent**: #a78bfa
- **MISSING FIELDS**: mutations, verification, limitations

**Name (H1)**: VDF  — _read from src/ui/app.ts_

**Subtitle**: Verifiable Delay Function · Wesolowski proof  — _read from src/ui/app.ts_

**Description**: Evaluate a VDF by repeated modular squaring, watch the sequential work accrue, then verify the short Wesolowski proof almost instantly — and try to cheat with the trapdoor.  — _read from src/ui/app.ts_

**Why it matters**: VDFs give the internet a clock nobody can fast-forward: under the repeated-squaring assumption no number of parallel machines shortens the chain, though faster hardware still makes each individual step quicker. That makes them a building block of hard-to-bias randomness beacons, fair leader election, and front-running-resistant systems.  — _read from src/ui/app.ts_

**Card copy**: Repeated modular squaring in an RSA group with a Wesolowski short proof — watch sequential work accrue one squaring at a time, confirm parallel workers don't help, then verify instantly and reveal the trapdoor.

**Chips**: VDF · Wesolowski · Modular Squaring · Randomness Beacon

**Implements**: SHA-256 `src/vdf/wesolowski.ts:53`

**Attacks shown**: Factoring `src/ui/app.ts:161`

**Comment-only (named in code comments, not executed)**: Miller–Rabin `src/vdf/wesolowski.ts:27`, RSA `src/vdf/group.ts:1`, Shamir secret sharing `src/vdf/types.ts:7`

**References**: RSA, Shamir secret sharing

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `EUROCRYPT 2019` — first seen src/vdf/wesolowski.ts:1 (1×)
- `FIPS 203` — first seen README.md:81 (1×)

**Claims tested** (e2e/claims.spec.ts, 18 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:26
    - :26 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:32
    - :32 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:45
    - :45 `toHaveCount` expected `1, { timeout: 120_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:80
    - :80 `toContainText` expected `/Verified|Rejected/u, { timeout: 60_000 }` _(expression)_
- `an evaluation reports the same step count the difficulty control asked for` — e2e/claims.spec.ts:87
    - :91 `toHaveAttribute` expected _no expected value_ _(none)_
    - :96 `toContainText` expected `'Done — ${steps.toLocaleString()} sequential squarings'` _(expression)_
    - :97 `toHaveAttribute` expected `'aria-valuenow', '100'` _(expression)_
    - :103 `toBe` expected `true` _(expression)_
    - :105 `toBe` expected `'42'` _(literal)_
    - :106 `toBe` expected `true` _(expression)_
- `the proof caption states the measured prover cost, in both regimes` — e2e/claims.spec.ts:117
    - :124 `toHaveAttribute` expected `'data-prove-ops', '0'` _(expression)_
    - :125 `toContainText` expected `'cost no group operations'` _(literal)_
    - :126 `toBe` expected `'1'` _(literal)_
    - :133 `expect` expected _no expected value_ _(none)_
    - :134 `expect` expected _no expected value_ _(none)_
    - :135 `toContainText` expected `'${proveOps.toLocaleString()} more mod-N operations'` _(expression)_
    - :136 `toContainText` expected `'computed once by the evaluator'` _(literal)_
- `the cost tiles state the direction their own two numbers show, at every difficulty` — e2e/claims.spec.ts:154
    - :164 `toContainText` expected `'Verified'` _(literal)_
    - :167 `toHaveCount` expected `3` _(literal)_
    - :172 `toBe` expected `steps` _(expression)_
    - :173 `toContainText` expected `evalOps.toLocaleString()` _(expression)_
    - :174 `expect` expected _no expected value_ _(none)_
    - :182 `toBe` expected `true` _(expression)_
    - :184 `expect` expected _no expected value_ _(none)_
    - :190 `expect` expected _no expected value_ _(none)_
    - :191 `expect` expected _no expected value_ _(none)_
    - :198 `toBe` expected `!saysCheaper` _(expression)_
    - :204 `toBe` expected `5` _(literal)_
    - :207 `expect` expected _no expected value_ _(none)_
- `tampering with y is rejected, names the cause, and recovers on reset` — e2e/claims.spec.ts:213
    - :217 `toContainText` expected `'Verified'` _(literal)_
    - :222 `toContainText` expected `'Inputs changed'` _(literal)_
    - :223 `toContainText` expected `'Verified'` _(literal)_
    - :226 `toBe` expected `honestY` _(expression)_
    - :227 `expect` expected _no expected value_ _(none)_
    - :231 `toContainText` expected `'(tampered)'` _(literal)_
    - :235 `toContainText` expected `'Rejected'` _(literal)_
    - :236 `toContainText` expected `'identity π^ℓ · x^r ≡ y failed'` _(literal)_
    - :237 `toContainText` expected `'altered'` _(literal)_
    - :238 `toContainText` expected `'Verified'` _(literal)_
    - :242 `toContainText` expected `'Inputs changed'` _(literal)_
    - :243 `toBe` expected `honestY` _(expression)_
    - :245 `toContainText` expected `'Verified'` _(literal)_
- `tampering with the proof π is rejected and names the cause` — e2e/claims.spec.ts:248
    - :252 `expect` expected _no expected value_ _(none)_
    - :257 `toBe` expected `honestPi` _(expression)_
    - :258 `toContainText` expected `'(tampered)'` _(literal)_
    - :260 `toContainText` expected `'(tampered)'` _(literal)_
    - :263 `toContainText` expected `'Rejected'` _(literal)_
    - :264 `toContainText` expected `'identity π^ℓ · x^r ≡ y failed'` _(literal)_
- `a run rejected before the identity check prints no cost comparison` — e2e/claims.spec.ts:277
    - :280 `expect` expected _no expected value_ _(none)_
    - :284 `toBe` expected `'0'` _(literal)_
    - :288 `toContainText` expected `'Rejected'` _(literal)_
    - :289 `toContainText` expected `'non-canonical encoding'` _(literal)_
    - :292 `toBe` expected `0` _(literal)_
    - :293 `toContainText` expected `'no comparison'` _(literal)_
    - :294 `toContainText` expected `'cheaper'` _(literal)_
    - :295 `toContainText` expected `'Nothing was measured on this run'` _(literal)_
- `the parallel-workers exhibit computes its own conclusion` — e2e/claims.spec.ts:298
    - :319 `toBeVisible` expected _no expected value_ _(none)_
    - :324 `expect` expected _no expected value_ _(none)_
    - :326 `toHaveLength` expected `4` _(literal)_
    - :327 `toBe` expected `steps` _(expression)_
    - :328 `expect` expected _no expected value_ _(none)_
    - :329 `expect` expected _no expected value_ _(none)_
    - :332 `toBe` expected `honestY` _(expression)_
    - :337 `toMatch` expected `/^\d+$/u` _(regex)_
    - :338 `toBe` expected `honestY` _(expression)_
    - :339 `toContainText` expected `'a different number'` _(literal)_
    - :340 `expect` expected _no expected value_ _(none)_
    - :347 `toContainText` expected `'no Web Worker was created and nothing was timed'` _(literal)_
    - :348 `toContainText` expected `'dependency-chain depth, not measured wall-clock time'` _(literal)_
    - :349 `expect` expected _no expected value_ _(none)_
    - :353 `toContainText` expected `'wall clock each'` _(literal)_
    - :356 `toBe` expected `counterBefore` _(expression)_
    - :357 `toBe` expected `honestY` _(expression)_
- `the trapdoor headline states the speed its own two op counts show` — e2e/claims.spec.ts:372
    - :384 `toBe` expected `honestY` _(expression)_
    - :389 `toBe` expected `2 ** exponent` _(expression)_
    - :390 `expect` expected _no expected value_ _(none)_
    - :392 `toContainText` expected `honestOps.toLocaleString()` _(expression)_
    - :393 `toContainText` expected `trapdoorOps.toLocaleString()` _(expression)_
    - :398 `toBe` expected `true` _(expression)_
    - :399 `expect` expected _no expected value_ _(none)_
    - :409 `expect` expected _no expected value_ _(none)_
- `regression: editing an input retires the result it was computed from` — e2e/claims.spec.ts:415
    - :419 `toContainText` expected `'Verified'` _(literal)_
    - :424 `toContainText` expected `'Input changed'` _(literal)_
    - :425 `toContainText` expected `'Verified'` _(literal)_
    - :426 `expect` expected _no expected value_ _(none)_
    - :427 `toBeDisabled` expected _no expected value_ _(none)_
    - :428 `toContainText` expected `'Input changed'` _(literal)_
    - :433 `toBeEnabled` expected _no expected value_ _(none)_
    - :436 `expect` expected _no expected value_ _(none)_
    - :444 `expect` expected _no expected value_ _(none)_
    - :445 `toBeDisabled` expected _no expected value_ _(none)_
    - :446 `expect` expected _no expected value_ _(none)_
    - :454 `toBe` expected `'43'` _(literal)_
    - :455 `toBeEnabled` expected _no expected value_ _(none)_
    - :457 `toContainText` expected `'Verified'` _(literal)_
- `regression: changing an input mid-evaluation retires the run that is still going` — e2e/claims.spec.ts:469
    - :481 `expect` expected _no expected value_ _(none)_
    - :491 `expect` expected _no expected value_ _(none)_
    - :492 `toBeDisabled` expected _no expected value_ _(none)_
    - :493 `toContainText` expected `'Input changed'` _(literal)_
    - :494 `toBe` expected `'43'` _(literal)_
    - :495 `toHaveCount` expected `0` _(literal)_
    - :499 `toBe` expected `'43'` _(literal)_
    - :501 `toContainText` expected `'Verified'` _(literal)_
- `regression: tampering while verification hashes retires the verdict and leaves Verify usable` — e2e/claims.spec.ts:504
    - :521 `toContainText` expected `'Inputs changed'` _(literal)_
    - :530 `toContainText` expected `'Inputs changed'` _(literal)_
    - :531 `toContainText` expected `'Verified'` _(literal)_
    - :532 `toBeEnabled` expected _no expected value_ _(none)_
    - :536 `toContainText` expected `/Rejected/, { timeout: 30_000 }` _(expression)_
    - :537 `toContainText` expected `'the output or proof was altered'` _(literal)_
- `regression: changing an input while verification hashes cannot resurrect an old verdict` — e2e/claims.spec.ts:540
    - :556 `toContainText` expected `'Input changed'` _(literal)_
    - :564 `toContainText` expected `'Input changed'` _(literal)_
    - :565 `toContainText` expected `'Verified'` _(literal)_
    - :566 `toBeDisabled` expected _no expected value_ _(none)_
    - :567 `expect` expected _no expected value_ _(none)_
- `regression: non-numeric input is refused with a visible, announced error` — e2e/claims.spec.ts:570
    - :577 `toBeHidden` expected _no expected value_ _(none)_
    - :581 `toBeVisible` expected _no expected value_ _(none)_
    - :582 `toContainText` expected `'Enter a whole number'` _(literal)_
    - :583 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :585 `expect` expected _no expected value_ _(none)_
    - :586 `toBeDisabled` expected _no expected value_ _(none)_
    - :591 `toBeHidden` expected _no expected value_ _(none)_
    - :592 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :593 `toBe` expected `'7'` _(literal)_
- `regression: no element carrying the hidden attribute is still rendered` — e2e/claims.spec.ts:596
    - :609 `toEqual` expected `[]` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Verifiable Delay Functions

## What It Is

This demo implements a **Verifiable Delay Function (VDF)**: a function whose evaluation
requires a prescribed amount of *sequential* work that no amount of parallelism can shorten,
yet whose result comes with a short proof anyone can check almost instantly. It is built from
**repeated modular squaring** — computing `y = x^(2^T) mod N` in an RSA group of unknown
order — paired with the **Wesolowski short proof** (a Fiat–Shamir prime challenge derived
with WebCrypto SHA-256). The security model is a public-coin, no-secret one: there is no
shared key, and verification needs nothing private — its hardness rests on the assumption
that the factorization of `N` (and hence the group's order) is unknown. In this demo that
assumption is deliberately *not* met: `P` and `Q` ship in the public page bundle so the
trapdoor exhibit can use them, and the honest evaluator and verifier are honest by
construction — their code never reads the factors — not because the factors are secret. The
modulus here is a deliberately small 512-bit toy value so thousands of squarings run visibly
in the browser; it is for teaching, not for protecting anything real. The Wesolowski proof is
tiny but not free to make: this simple prover performs a second exponentiation of roughly
another `T` group operations to generate `π` (the page measures and prints that cost), where
production provers generate it far more efficiently.

## When to Use It

- **Decentralized randomness beacons** — applied to input many parties generated together,
  the delay blunts grinding and last-revealer advantage; unbiasability still needs the
  surrounding commit-and-combine protocol.
- **Blockchain leader election / consensus** — helps derive the next proposer from a seed no
  participant could predict in time to bias, with a proof every node verifies cheaply — one
  component inside a larger protocol of seed generation, eligibility rules and consensus.
- **Fair lotteries and sealed-bid auctions** — commit first, then reveal a verifiably-delayed
  outcome that was fixed before anyone could react to it.
- **Anti front-running in decentralized systems** — enforce a mandatory, publicly-checkable
  delay before transactions are ordered or revealed.
- **When NOT to use it:** to keep a secret or send a message into the future — that is a
  *time-lock puzzle*, which has the delay but no fast public proof. A VDF's point is public
  verifiability, not confidentiality; if you only need privacy, you do not need a VDF.

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-vdf/**

Choose an input `x` and a difficulty `T` (the number of sequential squaring steps), then watch
the exact squaring count advance — including a control that *simulates* splitting the same `x`
and `T` across four "workers" (real arithmetic, one thread, no Web Workers and no timing):
chained, they still spend every one of the T squarings and reproduce `y` exactly; started
together, their critical path is a quarter as deep and they land on a *different* number,
which is why the shortcut is not one. The Verify panel then checks the short proof at a cost
that does not grow with `T`, and prints that cost against the evaluation's — including at the
low difficulties where the verifier's fixed cost is the *larger* of the two, which is exactly
the point: the gap opens only once `T` outgrows it. Tamper buttons flip a bit of the output or
proof so you can see verification fail-closed. A clearly-labeled "reveal the trapdoor" section
shows how knowing `N`'s secret factors turns the delay from linear in `T` into a constant —
exactly what a VDF assumes no one can do. There is no encryption/decryption here; the
operation is evaluate-and-verify.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-vdf
cd crypto-lab-vdf
npm install
npm run dev
`​``

No environment variables are required. Run `npm test` for the cryptographic test suite, and
`npm run test:e2e` for the browser suites: `e2e/a11y.spec.ts` (WCAG A/AA in both themes) and
`e2e/claims.spec.ts`, which drives the built page and checks every on-screen claim against
values the page computed — the step count the difficulty control asked for, the eval/verify
cost tiles stating the direction their own two numbers show at five difficulties spanning
both regimes, the trapdoor headline stating the speed its own two op counts show at both ends
of the slider, both tamper paths reaching a rejection that names its cause, a pre-check
rejection printing no cost comparison at all, the four-worker exhibit's own arithmetic and its
zero Web Worker constructions, and every result retiring when its input changes — including
mid-run. Both claims suites are deployment gates. Any
uncaught page exception fails the run.

## Part of the Crypto-Lab Suite

> One of 170+ live browser demos at
> [systemslibrarian.github.io/crypto-lab](https://systemslibrarian.github.io/crypto-lab/)
> — spanning Atbash (600 BCE) through NIST FIPS 203/204/205 (2024).

---

*"Whether you eat or drink, or whatever you do, do all to the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Entropy Collapse

- **slug**: `crypto-lab-entropy-collapse`
- **repo**: https://github.com/systemslibrarian/crypto-lab-entropy-collapse
- **live**: https://systemslibrarian.github.io/crypto-lab-entropy-collapse/
- **commit_sha**: `54bb85a5844a096471c3b0c79ac4e1c780644752` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `895cc6c2504688c88cdaafd07f2aa221b5e0fd23`
- **read_from**: working tree (clean)
- **category**: RANDOMNESS | ATTACKS  ·  **level**: intermediate  ·  **--accent**: #a16207
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Entropy Collapse  — _read from src/ui/intro.ts_

**Subtitle**: Seed provenance & RNG state duplication · NIST SP 800-90B  — _read from src/ui/intro.ts_

**Description**: Snapshot one machine’s real HMAC_DRBG, restore it onto two, and watch both emit identical  — _read from src/ui/intro.ts_

**Why it matters**: A correct generator is a deterministic function of its seed. When a VM is cloned, a process  — _read from src/ui/intro.ts_

**Card copy**: Restore two copies of a VM snapshot and watch an honest, standards-conformant HMAC_DRBG emit identical session keys from both — the seed, not the generator, is the whole game.

**Chips**: HMAC_DRBG · Seed Provenance · VM Cloning · Nonce Reuse

**Implements**: HMAC `src/crypto/hmac.ts:6`, HMAC-DRBG `src/crypto/hmac_drbg.ts:27`, SHA-256 `src/crypto/hmac.ts:6`

**Attacks shown**: Brute force `src/ui/entropyPanel.ts:108`, Nonce reuse `src/ui/clonePanel.ts:302`

**References**: DSA, ECDSA, RSA

**Standards body**: IETF, NIST

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `FIPS 180-4` — first seen README.md:14 (4×)
- `FIPS 198-1` — first seen README.md:15 (2×)
- `NIST SP 800-90A` — first seen README.md:3 (3×)
- `NIST SP 800-90A Rev. 1` — first seen README.md:15 (2×)
- `NIST SP 800-90B` — first seen src/ui/intro.ts:12 (1×)
- `RFC 2104` — first seen README.md:15 (2×)
- `RFC 4231` — first seen README.md:114 (2×)
- `SP 800-22` — first seen README.md:101 (3×)
- `SP 800-90A` — first seen README.md:18 (12×)
- `SP 800-90C` — first seen README.md:149 (2×)

**README — What Can Go Wrong**:

```text
The whole demo is a catalogue of what goes wrong when the seed is not unique or not
unpredictable: cloned VM images, forked processes without post-fork reseed, boot-time
entropy holes, and reseeds whose entropy source silently fails. In every case the DRBG is
correct and the system is broken — which is the entire lesson.
```

**Claims tested** (e2e/claims.spec.ts, 16 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:43
    - :43 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:66
    - :66 `toBe` expected `b.length` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:74
    - :74 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:91
    - :91 `toBeVisible` expected _no expected value_ _(none)_
- `clone: both restored servers emit byte-identical output, and the verdict is that tally` — e2e/claims.spec.ts:96
    - :105 `toHaveText` expected `'Server A'` _(literal)_
    - :106 `toHaveText` expected `'Server B'` _(literal)_
    - :109 `toContainText` expected `'Internal state (K, V): IDENTICAL'` _(literal)_
    - :110 `toHaveText` expected `'≡ identical to A'` _(literal)_
    - :111 `toHaveAttribute` expected `'data-tone', 'alarm'` _(expression)_
    - :112 `toHaveCount` expected `0` _(literal)_
    - :115 `toHaveCount` expected `CLONE_SCRIPT.length, { timeout: 30_000 }` _(expression)_
    - :116 `toHaveCount` expected `CLONE_SCRIPT.length` _(expression)_
    - :123 `toBe` expected `spec.label` _(expression)_
    - :124 `toBe` expected `spec.label` _(expression)_
    - :125 `toBe` expected `spec.bytes * 2` _(expression)_
    - :126 `toBe` expected `spec.bytes * 2` _(expression)_
    - :129 `toBe` expected _no expected value_ _(none)_
    - :133 `toBe` expected `CLONE_SCRIPT.length` _(expression)_
    - :138 `toBe` expected `identical` _(expression)_
    - :139 `toBe` expected `rowsA.length` _(expression)_
    - :140 `toContainText` expected `'IDENTICAL'` _(literal)_
    - :141 `toContainText` expected `'the streams never diverge'` _(literal)_
    - :144 `toContainText` expected `'HMAC_DRBG operating correctly'` _(literal)_
    - :146 `toHaveAttribute` expected `'data-state', 'collapsed'` _(expression)_
    - :147 `toContainText` expected `'INTEGRITY COLLAPSED'` _(literal)_
    - :148 `toContainText` expected `'share every nonce and every key'` _(literal)_
    - :152 `toHaveCount` expected `1` _(literal)_
    - :153 `toContainText` expected `'confidentiality is already gone'` _(literal)_
    - :154 `toContainText` expected `'the ECDSA signing key falls out'` _(literal)_
    - :155 `toBeVisible` expected _no expected value_ _(none)_
    - :159 `toBe` expected `await kv(serverB)` _(expression)_
    - :160 `expect` expected _no expected value_ _(none)_
- `clone: fresh entropy on Server B diverges every field and flips the verdict` — e2e/claims.spec.ts:163
    - :173 `toContainText` expected `'Internal state now DIFFERS'` _(literal)_
    - :174 `toHaveText` expected `'≠ differs from A'` _(literal)_
    - :175 `toHaveAttribute` expected `'data-tone', 'ok'` _(expression)_
    - :176 `toHaveCount` expected `CLONE_SCRIPT.length, { timeout: 30_000 }` _(expression)_
    - :182 `toBe` expected `0` _(literal)_
    - :186 `toBe` expected `matches` _(expression)_
    - :187 `toBe` expected `rowsA.length` _(expression)_
    - :188 `toContainText` expected `'DIVERGE'` _(literal)_
    - :191 `toHaveAttribute` expected `'data-state', 'intact'` _(expression)_
    - :192 `toContainText` expected `'INTEGRITY RESTORED'` _(literal)_
    - :194 `toHaveCount` expected `0` _(literal)_
- `clone: restoring after a finished run re-arms Step and Auto-run` — e2e/claims.spec.ts:197
    - :208 `toHaveCount` expected `CLONE_SCRIPT.length, { timeout: 30_000 }` _(expression)_
    - :209 `toBeDisabled` expected _no expected value_ _(none)_
    - :212 `toContainText` expected `'press Step'` _(literal)_
    - :213 `toBeEnabled` expected _no expected value_ _(none)_
    - :214 `toBeEnabled` expected _no expected value_ _(none)_
    - :215 `toHaveCount` expected `0` _(literal)_
    - :218 `toHaveCount` expected `1` _(literal)_
- `fork: the un-reseeded child reproduces the parent byte for byte, the reseeded child does not` — e2e/claims.spec.ts:223
    - :232 `toHaveText` expected `'Parent process'` _(literal)_
    - :233 `toHaveText` expected `'Child — no reseed'` _(literal)_
    - :234 `toHaveText` expected `'Child — reseeded'` _(literal)_
    - :237 `toHaveCount` expected `2, { timeout: 30_000 }` _(expression)_
    - :240 `toHaveText` expected `'≡ identical to parent'` _(literal)_
    - :241 `toHaveAttribute` expected `'data-tone', 'alarm'` _(expression)_
    - :242 `toHaveText` expected `'≠ differs'` _(literal)_
    - :243 `toHaveAttribute` expected `'data-tone', 'ok'` _(expression)_
    - :248 `toEqual` expected `['Next nonce (public)', 'Next key (secret)']` _(expression)_
    - :249 `toEqual` expected `[16, 32]` _(expression)_
    - :257 `toHaveCount` expected `2` _(literal)_
    - :261 `toBe` expected `actual` _(expression)_
    - :262 `toBe` expected `rows[i].hex.length / 2` _(expression)_
    - :264 `toBe` expected `rowsP[i].hex` _(expression)_
    - :265 `toBe` expected `rows[i].hex.length / 2` _(expression)_
    - :266 `toHaveAttribute` expected `'data-tone', 'alarm'` _(expression)_
    - :267 `toContainText` expected `'the parent’s secret, byte for byte'` _(literal)_
    - :269 `toBe` expected `rowsP[i].hex` _(expression)_
    - :271 `expect` expected _no expected value_ _(none)_
    - :272 `toHaveAttribute` expected `'data-tone', 'ok'` _(expression)_
    - :278 `toContainText` expected `'Inherited child vs parent: IDENTICAL'` _(literal)_
    - :279 `toContainText` expected `'reseeded child vs parent: DIFFERENT'` _(literal)_
    - :281 `toHaveAttribute` expected `'data-state', 'collapsed'` _(expression)_
    - :282 `toContainText` expected `'CHILD SECRET PREDICTABLE'` _(literal)_
    - :283 `toContainText` expected `'DRBG correct in every process'` _(literal)_
- `fork: forking again after a finished run re-arms Step and Run fork` — e2e/claims.spec.ts:286
    - :296 `toHaveCount` expected `2, { timeout: 30_000 }` _(expression)_
    - :297 `toBeDisabled` expected _no expected value_ _(none)_
    - :300 `toContainText` expected `'Step to compare their output'` _(literal)_
    - :301 `toBeEnabled` expected _no expected value_ _(none)_
    - :302 `toBeEnabled` expected _no expected value_ _(none)_
    - :303 `toHaveCount` expected `0` _(literal)_
    - :306 `toHaveCount` expected `1` _(literal)_
    - :319 `toHaveCount` expected `2` _(literal)_
- `reseed: a no-op reseed keeps the attacker in lockstep while the counter still reads healthy` — e2e/claims.spec.ts:343
    - :352 `toHaveLength` expected `4` _(literal)_
    - :353 `toHaveLength` expected `4` _(literal)_
    - :355 `toEqual` expected `run.serverCells.slice(0, 2)` _(expression)_
    - :357 `toEqual` expected `run.serverCells.slice(2)` _(expression)_
    - :362 `toBe` expected `actualHits` _(expression)_
    - :363 `toBe` expected `2 + run.postMatches` _(expression)_
    - :364 `toBe` expected `2` _(literal)_
    - :365 `toHaveCount` expected `4` _(literal)_
    - :366 `toHaveCount` expected `0` _(literal)_
    - :367 `toContainText` expected `'attacker predicted'` _(literal)_
    - :370 `toContainText` expected `'STILL MATCHES'` _(literal)_
    - :371 `toContainText` expected `'nothing unpredictable went in'` _(literal)_
    - :373 `toHaveAttribute` expected `'data-state', 'collapsed'` _(expression)_
    - :374 `toContainText` expected `'STILL PREDICTABLE'` _(literal)_
    - :375 `toContainText` expected `'Reseed executed, counter reset'` _(literal)_
    - :378 `toBe` expected `3` _(literal)_
    - :379 `toContainText` expected `'fresh / healthy'` _(literal)_
- `reseed: a proper reseed diverges the attacker — with an identical health counter` — e2e/claims.spec.ts:382
    - :396 `toEqual` expected `proper.serverCells.slice(0, 2)` _(expression)_
    - :398 `toBe` expected `proper.serverCells[2]` _(expression)_
    - :399 `toBe` expected `proper.serverCells[3]` _(expression)_
    - :400 `toBe` expected `0` _(literal)_
    - :401 `toBe` expected `2 + proper.postMatches` _(expression)_
    - :402 `toHaveCount` expected `2` _(literal)_
    - :403 `toHaveCount` expected `2` _(literal)_
    - :404 `toContainText` expected `'attacker lost track'` _(literal)_
    - :407 `toContainText` expected `'DIVERGES'` _(literal)_
    - :409 `toHaveAttribute` expected `'data-state', 'intact'` _(expression)_
    - :410 `toContainText` expected `'FORWARD SECRECY RESTORED'` _(literal)_
    - :413 `toBe` expected `noop.counter` _(expression)_
    - :414 `toContainText` expected `'fresh / healthy'` _(literal)_
- `entropy: every slider stop is internally consistent and gates live enumeration at 2^16` — e2e/claims.spec.ts:419
    - :427 `toHaveAttribute` expected `'max', String(STOPS.length - 1)` _(expression)_
    - :435 `expect` expected _no expected value_ _(none)_
    - :438 `toBe` expected `2 ** stop.bits` _(expression)_
    - :442 `toBe` expected `'width:${Math.max(2, Math.round((stop.bits / 256) * 100))}%'` _(expression)_
    - :445 `toBeEnabled` expected `{ enabled: enumerable }` _(expression)_
    - :448 `expect` expected _no expected value_ _(none)_
    - :449 `expect` expected _no expected value_ _(none)_
    - :451 `toHaveCount` expected `0` _(literal)_
    - :452 `toContainText` expected `'getrandom()'` _(literal)_
    - :453 `expect` expected _no expected value_ _(none)_
    - :455 `toHaveCount` expected `1` _(literal)_
    - :457 `expect` expected _no expected value_ _(none)_
    - :458 `toBe` expected `2 ** stop.bits` _(expression)_
    - :460 `expect` expected _no expected value_ _(none)_
    - :461 `expect` expected _no expected value_ _(none)_
    - :466 `expect` expected _no expected value_ _(none)_
- `entropy: brute force recovers the real seed — SHA-256 of the material the page published` — e2e/claims.spec.ts:472
    - :483 `toHaveText` expected `'52:54:00:12:34:56'` _(literal)_
    - :491 `toBe` expected `MAC_HEX + u32be(bootSec) + u16be(pid)` _(expression)_
    - :492 `toHaveLength` expected `32` _(literal)_
    - :495 `toBeVisible` expected `{ timeout: 90_000 }` _(expression)_
    - :498 `toContainText` expected _no expected value_ _(none)_
    - :506 `toBe` expected `createHash('sha256').update(Buffer.from(material, 'hex')).digest('hex')` _(expression)_
    - :507 `toHaveLength` expected `64` _(literal)_
    - :508 `toBe` expected `seedHex` _(expression)_
    - :509 `toBe` expected `nonce` _(expression)_
    - :511 `toHaveCount` expected `0` _(literal)_
    - :517 `toBe` expected `secretIndex + 1` _(expression)_
    - :518 `expect` expected _no expected value_ _(none)_
    - :519 `expect` expected _no expected value_ _(none)_
    - :523 `toBe` expected `guesses` _(expression)_
    - :524 `toBe` expected `2 ** 14` _(expression)_
    - :525 `toHaveAttribute` expected `'style', 'width: 100%;'` _(expression)_
    - :528 `toHaveAttribute` expected `'data-state', 'collapsed'` _(expression)_
    - :529 `toContainText` expected `'KEY RECOVERED'` _(literal)_
    - :530 `toContainText` expected `'DRBG reproduced bit-for-bit'` _(literal)_
- `entropy: a new victim machine is genuinely a new machine, and 2^31 stays un-run` — e2e/claims.spec.ts:533
    - :541 `toBeDisabled` expected _no expected value_ _(none)_
    - :551 `toBe` expected `4` _(literal)_
    - :552 `toBe` expected `MAC_HEX` _(expression)_
- `tour: the guided tour drives the real panels and lands its closing line` — e2e/claims.spec.ts:557
    - :561 `toBeHidden` expected _no expected value_ _(none)_
    - :564 `toBeVisible` expected _no expected value_ _(none)_
    - :565 `toHaveCount` expected `4` _(literal)_
    - :566 `toContainText` expected `'Chapter 1 — Clone'` _(literal)_
    - :568 `toHaveCount` expected `0, {` _(expression)_
    - :575 `toContainText` expected `chapter, { timeout: 30_000 }` _(expression)_
    - :578 `toContainText` expected _no expected value_ _(none)_
    - :582 `toBeHidden` expected _no expected value_ _(none)_
    - :585 `toBeHidden` expected _no expected value_ _(none)_
- `page: the five chapters the README promises are present and deep-linkable` — e2e/claims.spec.ts:588
    - :600 `toHaveText` expected `kicker` _(expression)_
    - :601 `toHaveCount` expected `1` _(literal)_
    - :604 `toHaveCount` expected `chapters.length` _(expression)_
    - :608 `toContainText` expected `'CVE-2008-0166'` _(literal)_
    - :609 `toContainText` expected `'32,768'` _(literal)_
    - :610 `toContainText` expected `'13 May 2008'` _(literal)_
    - :611 `toContainText` expected `'0.75% of TLS certificates'` _(literal)_
    - :612 `toContainText` expected `'0.50% of TLS hosts'` _(literal)_
    - :613 `toContainText` expected `'0.03% of SSH hosts'` _(literal)_
    - :614 `toContainText` expected `'1.03% of SSH hosts'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Entropy Collapse

**Seed provenance & RNG state duplication · NIST SP 800-90A / 90B / 90C**

A browser demo about the failure mode where the cryptography is flawless and the system
is compromised anyway. It runs a real, standards-conformant **HMAC_DRBG** (NIST SP
800-90A) and never modifies it. Everything alarming comes from the *seed*: duplicate it
and two machines become one; starve it and its entire output becomes guessable.

> The generator did nothing wrong. Nobody attacked it.

## What It Is

- **Primitives (real, hand-rolled, inspectable):** SHA-256 (FIPS 180-4), HMAC-SHA256
  (FIPS 198-1 / RFC 2104), and **HMAC_DRBG** (NIST SP 800-90A Rev. 1, §10.1.2) with
  SHA-256. These are checked against **NIST CAVP and RFC known-answer vectors** — see
  _Build & Verify_.
- **The problem:** SP 800-90A's guarantees are *conditional on the entropy input*. A DRBG
  is a deterministic function of its seed. If two machines share a seed (VM clone, forked
  process, low-entropy boot), they share every nonce and every key they will ever produce.
- **Security model:** a teaching demo, **not production crypto**. All key material is
  generated per session, in memory, and never stored or transmitted. The recoveries you
  run are genuine brute force against the real generator — they are only feasible because
  the *seed space* is modelled as small, never because a primitive is weak.
- **Verdict separation:** every panel shows two independent indicators — the
  **cryptographic result** (the DRBG is correct) and the **security verdict** (the system
  is compromised). Color tracks system integrity, so a byte-identical "match" renders as an
  **alarm**, never as green success.

## Exhibits

1. **Clone the machine, clone every secret** *(the headline)* — snapshot one DRBG's state,
   restore it onto Server A and Server B, and watch every nonce and key come out
   byte-identical. Separates the two consequences precisely: the shared **session key**
   ends confidentiality outright, while the shared **nonce** lets an attacker recover the
   ECDSA **signing (authentication) key** by algebra on two signatures — handed off to the
   sibling [ecdsa-forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/), not
   rebuilt here.
2. **Starve the seed, enumerate the key** *(break-it-yourself)* — a slider drops the seed's
   entropy from a 256-bit CSPRNG down to a headless boot; the search space collapses from
   2^256 to something enumerable; below 2^16 you brute-force the seed **live** against the
   real DRBG and recover the session key it kept secret.
3. **fork() safety** — a parent seeds, forks, and the child that forgets to reseed emits the
   parent's next output exactly; the child that reseeds does not.
4. **The reseed that wasn't** — a silent no-op reseed resets the reseed counter to look
   healthy while an attacker keeps predicting the output, because no fresh entropy went in.
5. **This already happened** — the Debian OpenSSL PRNG (CVE-2008-0166) and the 2012 "Mining
   Your Ps and Qs" survey, stated with exact numbers.

## When to Use It

- **Use it** to teach why entropy/seed provenance is a first-class security property, and
  why "the RNG passed its statistical tests" proves nothing about seed uniqueness.
- **Do NOT use it** as a source of randomness, a production DRBG, or evidence that any
  specific deployment is safe. It is a teaching model; the VM snapshot and boot-entropy
  pieces are explicitly labelled as models.

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-entropy-collapse/** (deployed from
`main` via GitHub Pages). You can: run the clone and watch both streams stay identical,
diverge Server B with fresh entropy, drag the entropy slider and brute-force a real seed,
fork a process, and toggle a proper vs. no-op reseed — each with its own crypto-result and
security-verdict indicators.

## What Can Go Wrong

The whole demo is a catalogue of what goes wrong when the seed is not unique or not
unpredictable: cloned VM images, forked processes without post-fork reseed, boot-time
entropy holes, and reseeds whose entropy source silently fails. In every case the DRBG is
correct and the system is broken — which is the entire lesson.

## Real-World Usage

- **Debian OpenSSL, 2006–2008 (CVE-2008-0166):** a Debian patch left essentially only the
  process ID seeding the PRNG. With Linux's default max PID of 32,768, at most **32,767**
  distinct keys were possible per architecture/key-size. Keys generated from September 2006
  to 13 May 2008 were affected.
- **"Mining Your Ps and Qs" (Heninger, Durumeric, Wustrow, Halderman, USENIX Security
  2012):** **0.75%** of TLS certificates shared keys from insufficient entropy; the authors
  computed private **RSA** keys for **0.50%** of TLS hosts (GCD of shared moduli) and
  **0.03%** of SSH hosts, and private **DSA** keys for **1.03%** of SSH hosts (repeated
  signature nonces). Root cause: a boot-time entropy hole, overwhelmingly on headless/
  embedded devices.

## How to Run Locally

`​``bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests + KATs
npm run build      # type-check + production bundle
npm run test:a11y  # browser gates against the built site: functional claims + axe WCAG A/AA
`​``

## Related Demos

- [ecdsa-forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) — nonce reuse
  and nonce collision recovering ECDSA signing keys (the downstream of the clone panel).
- [drbg-arena](https://systemslibrarian.github.io/crypto-lab-drbg-arena/) — DRBG internals
  and the SP 800-22 statistical suite (out of scope here).
- [corrupted-oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/) — a
  *deliberately sabotaged* generator (malice, where this lab is accident).
- [Time Trust](https://systemslibrarian.github.io/crypto-lab-time-trust/) — an
  unauthenticated clock feeding an authenticated check: the same shape as an unauthenticated
  seed.

## Build & Verify

- **34 unit tests (Vitest), all passing**, including:
  - **8 NIST CAVP HMAC_DRBG (SHA-256) known-answer vectors** — all four
    personalization × additional-input option groups, each with reseed
    (`src/crypto/nist_drbg_vectors.ts`, run by `src/crypto/hmac_drbg.test.ts`).
  - **4 SHA-256 KATs** (FIPS 180-4) and **4 HMAC-SHA256 KATs** (RFC 4231).
  - Behavioural invariants: deterministic-in-seed, clone byte-equality, fork inheritance,
    no-op-reseed predictability, and live seed recovery against the real DRBG.
- **Functional browser gate (12 Playwright specs, `e2e/claims.spec.ts`):** drives the built
  page in Chromium and asserts what it claims — that both restored servers log byte-identical
  output and that the "N of M IDENTICAL" tally is that comparison; that Server B's fresh
  entropy diverges every field; that each fork child's "N of M bytes match" tally equals the
  hex printed beside it; that a no-op reseed keeps the attacker in lockstep while the health
  counter reads exactly as fresh as a proper reseed's; that every slider stop's keyspace,
  meter and sweep-time agree at the quoted 10,000 candidates/second; and that the seed the
  brute force recovers is **SHA-256 of the boot material the page published**, found at the
  guess index its own boot-time/PID readout implies.
- **Accessibility gate:** `@axe-core/playwright` scans the production build for zero WCAG
  2.1 A/AA violations in **both** themes; the GitHub Pages deploy is blocked if either
  browser gate fails.

`​``bash
npm test && npm run build && npm run test:a11y
`​``

## Performance

Seed enumeration runs the real DRBG per candidate at roughly 10,000 candidates/second in a
browser, chunked so the UI stays responsive. Live recovery is capped at a 2^16 search space
(a few seconds); larger spaces report their projected time and are deliberately left un-run
to show where safety begins.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## System construction bridge

The live demo now links the [SP 800-90C final](https://csrc.nist.gov/pubs/sp/800/90/c/final) construction classes to source health, conditioning and fresh-input dependencies. DRBG Arena’s class chooser is a source-request model, not a validated RBG or a replacement for the existing compromise experiments.

```

</details>

---

## Quantum Entropy

- **slug**: `crypto-lab-quantum-entropy`
- **repo**: https://github.com/systemslibrarian/crypto-lab-quantum-entropy
- **live**: https://systemslibrarian.github.io/crypto-lab-quantum-entropy/
- **commit_sha**: `accf96e011cbbfbbd549fe023e639efa3cb45222` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: RANDOMNESS  ·  **level**: advanced  ·  **--accent**: #6154dc
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Quantum Entropy  — _read from index.html_

**Subtitle**: QRNG · min-entropy · randomness extraction  — _read from index.html_

**Description**: Runs a modeled beam-splitter source into real entropy measurements, real von Neumann debiasing, and a real Toeplitz extractor, so you can watch “unpredictable by physics” become “bounded close to uniform under an explicit source model.”  — _read from index.html_

**Why it matters**: “Quantum” on an RNG spec sheet does not make its output a key — raw quantum bits arrive biased, correlated, and partly predictable by whoever built the device. Every key you trust was distilled from messier randomness by exactly the accounting shown here, and if the min-entropy arithmetic is wrong, the space an attacker must search collapses without any output-facing test noticing.  — _read from index.html_

**Card copy**: Model a beam-splitter QRNG, account for min-entropy, extract with Toeplitz hashing, and explore health-test failures. Compare conditional application-specific KDF bounds with explicit assumptions and corrected converse limits.

**Chips**: QRNG · Min-Entropy · Toeplitz Extractor · SP 800-90B

**Implements**: Toeplitz extractor `src/entropy/toeplitz.ts:21`, von Neumann extractor `src/entropy/vonneumann.ts:15`

**Attacks shown**: _none derived_

**References**: BB84, E91, HKDF, One-time pad, Pairing

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `eprint.iacr.org/2013/708` — first seen README.md:104 (2×)
- `NIST SP 800-90B` — first seen README.md:7 (7×)
- `NIST SP 800-90C` — first seen index.html:206 (1×)
- `SP 800-22` — first seen README.md:48 (3×)
- `SP 800-90B` — first seen README.md:23 (18×)
- `SP 800-90C` — first seen README.md:7 (4×)
- `SP800-90B` — first seen README.md:100 (2×)

**README — What Can Go Wrong**:

```text
- **Trusting the Shannon number.** A 53/47 source is "99.7% random" by Shannon and only 0.9159 bits/bit by min-entropy. Provision a 256-bit key by the wrong number and you overstate the attacker's work by 20+ bits.
- **Debiasing without de-correlating.** Von Neumann output passes frequency tests on *any* stationary source — including one whose bits a predictor guesses 80% of the time. (A debiased-but-correlated stream also passes many SP 800-22 statistical tests; that suite lives in drbg-arena.)
- **Measuring your own input and calling it a bound.** An empirical bias or an in-sample predictor score is a diagnostic, not a min-entropy guarantee for the input distribution. The extraction budget must come from a validated model or assessment — here, the exact most-likely-path bound of the configured model.
- **Extracting more than you have.** Exceeding the entropy budget rapidly weakens the Leftover Hash Lemma guarantee: under this lab's convention, ε = ½·√(2^(m−k)) is 0.5 at m = k, about 0.7071 at m = k + 1, and 1 at m = k + 2. The upper bound becomes mathematically vacuous at m ≥ k + 2; a bound below 1 can still miss a cryptographic target by an enormous margin. The lab's accept/warn thresholds are teaching policy, not the vacuity boundary. The theorem requires a uniform seed independent of the source; no output-facing test establishes those assumptions.
- **Claiming more entropy than the device has.** Health-test cutoffs derive from the claim; claim H = 1 for a 53/47 device and the APT false-alarms ~1,000× its nominal 2⁻²⁰ rate. Commissioning ties the claim to the model bound, and degradation below the claim is flagged instead of silently reinterpreted.
- **Confusing health tests with entropy estimation.** RCT/APT detect death and gross degradation. A manufacturer-keyed PRNG can pass both while remaining predictable to its manufacturer.
```

**Claims tested** (e2e/claims.spec.ts, 26 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:148
    - :148 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:194
    - :194 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:204
    - :204 `toBe` expected `total` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:228
    - :228 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:230
    - :230 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:234
    - :234 `toEqual` expected `[]` _(expression)_
- `the detector counts partition the emitted photons, and the diagram agrees` — e2e/claims.spec.ts:241
    - :251 `toBe` expected `STREAM_LEN` _(expression)_
    - :252 `toBe` expected `total` _(expression)_
    - :255 `toBe` expected `pct(ones / total)` _(expression)_
    - :256 `toBe` expected _no expected value_ _(none)_
    - :263 `toBeCloseTo` expected `100, 1` _(expression)_
    - :264 `toBe` expected `pct(ones / total)` _(expression)_
    - :270 `toMatch` expected `/^[01]{1024}$/` _(regex)_
    - :271 `toBe` expected `total` _(expression)_
- `re-emitting redraws the stream and every panel follows it` — e2e/claims.spec.ts:274
    - :281 `toBe` expected `before.total` _(expression)_
    - :283 `toBe` expected `beforeStream` _(expression)_
    - :287 `toBe` expected `pct(after.p)` _(expression)_
- `both entropy numbers are recomputed from the bias the page measured` — e2e/claims.spec.ts:294
    - :300 `toBe` expected `pct(p)` _(expression)_
    - :301 `toBe` expected `'${fmt(hSh)} bits/bit'` _(expression)_
    - :302 `toBe` expected `'${fmt(hMin)} bits/bit'` _(expression)_
    - :306 `toBe` expected `pct(Math.max(p, 1 - p))` _(expression)_
    - :307 `toBeCloseTo` expected `Math.max(p, 1 - p), 12` _(expression)_
    - :310 `expect` expected _no expected value_ _(none)_
    - :314 `toBe` expected `pct(hSh)` _(expression)_
    - :315 `expect` expected _no expected value_ _(none)_
    - :317 `toBe` expected `'“${pct(hSh, 2)} random!”'` _(expression)_
    - :320 `expect` expected _no expected value_ _(none)_
    - :321 `expect` expected _no expected value_ _(none)_
- `the headline tracks the live measurement after the bias changes` — e2e/claims.spec.ts:324
    - :331 `expect` expected _no expected value_ _(none)_
    - :336 `toBe` expected `pct(hSh)` _(expression)_
    - :337 `toBe` expected `first` _(expression)_
    - :339 `toBe` expected `'“${pct(hSh, 2)} random!”'` _(expression)_
    - :343 `toBe` expected `'2^${fmt(k, 1)}'` _(expression)_
    - :344 `expect` expected _no expected value_ _(none)_
- `the chargeable figure is the model bound, and panels 2 and 4 quote the same k` — e2e/claims.spec.ts:347
    - :356 `toBe` expected `'2^${fmt(k, 1)}'` _(expression)_
    - :357 `toBe` expected `'${fmt(k, 1)} bits'` _(expression)_
    - :358 `expect` expected _no expected value_ _(none)_
    - :363 `expect` expected _no expected value_ _(none)_
    - :364 `expect` expected _no expected value_ _(none)_
- `von Neumann conserves pairs: bits kept + discarded pairs = pairs read` — e2e/claims.spec.ts:371
    - :380 `toBe` expected `total / 2` _(expression)_
    - :383 `toBe` expected `pct(kept / total)` _(expression)_
    - :384 `toBe` expected `'expected ≈ p(1−p) = ${pct(p * (1 - p))}'` _(expression)_
    - :385 `expect` expected _no expected value_ _(none)_
    - :386 `expect` expected _no expected value_ _(none)_
    - :391 `expect` expected _no expected value_ _(none)_
    - :398 `toBe` expected _no expected value_ _(none)_
    - :401 `expect` expected _no expected value_ _(none)_
- `the step animation and its running tally describe the same pairs` — e2e/claims.spec.ts:404
    - :406 `toHaveCount` expected `24` _(literal)_
    - :407 `expect` expected _no expected value_ _(none)_
    - :425 `expect` expected _no expected value_ _(none)_
    - :429 `expect` expected _no expected value_ _(none)_
    - :430 `toBe` expected `'✕'` _(literal)_
    - :433 `expect` expected _no expected value_ _(none)_
    - :434 `toBe` expected `b1 === '0' ? '0' : '1'` _(expression)_
    - :438 `expect` expected _no expected value_ _(none)_
    - :439 `expect` expected _no expected value_ _(none)_
    - :444 `expect` expected _no expected value_ _(none)_
    - :447 `toBe` expected `STEPS` _(expression)_
    - :451 `expect` expected _no expected value_ _(none)_
    - :452 `toHaveCount` expected `0` _(literal)_
    - :453 `toHaveCount` expected `0` _(literal)_
- `a streaky source passes the bias check while the dependence verdict rejects` — e2e/claims.spec.ts:456
    - :464 `toBe` expected `'80'` _(literal)_
    - :465 `toBe` expected `'80%'` _(literal)_
    - :479 `toMatch` expected `/^✓ PASS — /` _(regex)_
    - :480 `expect` expected _no expected value_ _(none)_
    - :481 `toMatch` expected `/^✕ dependence detected — predictor guesses [\d.]+% of output bits$/` _(regex)_
    - :482 `expect` expected _no expected value_ _(none)_
    - :484 `expect` expected _no expected value_ _(none)_
    - :486 `expect` expected _no expected value_ _(none)_
    - :492 `expect` expected _no expected value_ _(none)_
    - :494 `expect` expected _no expected value_ _(none)_
    - :498 `toBe` expected `'0'` _(literal)_
    - :499 `toBe` expected `'0%'` _(literal)_
    - :501 `toMatch` expected `/^✓ no first-order dependence detected/` _(regex)_
    - :502 `expect` expected _no expected value_ _(none)_
- `the entropy budget, its bar and the LHL receipt are one consistent ledger` — e2e/claims.spec.ts:509
    - :517 `toBe` expected `String(m)` _(expression)_
    - :518 `toBe` expected `String(m)` _(expression)_
    - :519 `toBe` expected `'${fmt(k, 1)} bits'` _(expression)_
    - :522 `toBe` expected `'${fmt(k - m, 1)} bits'` _(expression)_
    - :523 `toBe` expected `sci(lhlEpsilon(k, m))` _(expression)_
    - :527 `expect` expected _no expected value_ _(none)_
    - :528 `expect` expected _no expected value_ _(none)_
    - :529 `expect` expected _no expected value_ _(none)_
    - :530 `expect` expected _no expected value_ _(none)_
- `the accept / warn / reject policy lines land on the right side of ε` — e2e/claims.spec.ts:534
    - :543 `expect` expected _no expected value_ _(none)_
    - :544 `toBe` expected `'✓ ε ≤ ${sci(eps)} — below this lab’s 2⁻³² accept line'` _(expression)_
    - :546 `expect` expected _no expected value_ _(none)_
    - :547 `toBe` expected `'⚠ ε ≤ ${sci(eps)} — thin margin under this lab’s policy'` _(expression)_
    - :549 `expect` expected _no expected value_ _(none)_
    - :550 `toBe` expected _no expected value_ _(none)_
    - :556 `expect` expected _no expected value_ _(none)_
- `overdrawing the budget is refused, and the overdraft is named` — e2e/claims.spec.ts:561
    - :567 `expect` expected _no expected value_ _(none)_
    - :568 `toBe` expected `'≥ 1 (vacuous)'` _(literal)_
    - :569 `expect` expected _no expected value_ _(none)_
    - :572 `expect` expected _no expected value_ _(none)_
    - :577 `toBe` expected `'${m} bits output ✓'` _(expression)_
    - :578 `expect` expected _no expected value_ _(none)_
    - :579 `toBe` expected `'✕ REJECT — the bound is vacuous'` _(literal)_
    - :580 `expect` expected _no expected value_ _(none)_
- `extraction emits exactly m bits and row 0 reproduces the first of them` — e2e/claims.spec.ts:583
    - :591 `expect` expected _no expected value_ _(none)_
    - :592 `toHaveLength` expected `m / 4` _(expression)_
    - :593 `expect` expected _no expected value_ _(none)_
    - :602 `expect` expected _no expected value_ _(none)_
    - :604 `toBe` expected `Number(parity)` _(expression)_
    - :605 `toBe` expected `bit` _(expression)_
    - :606 `toBe` expected `Number(bit)` _(expression)_
    - :607 `expect` expected _no expected value_ _(none)_
    - :610 `toHaveCount` expected `Math.min(12, m) * 28` _(expression)_
- `a new stream retracts the previous extraction instead of leaving it standing` — e2e/claims.spec.ts:614
    - :618 `expect` expected _no expected value_ _(none)_
    - :619 `toBe` expected `'128 bits output ✓'` _(literal)_
    - :625 `toBe` expected `'(stream changed — press “Draw fresh seed & extract”)'` _(literal)_
    - :626 `toBe` expected `''` _(literal)_
    - :627 `toHaveCount` expected `0` _(literal)_
    - :629 `toBe` expected `'—'` _(literal)_
    - :630 `expect` expected _no expected value_ _(none)_
- `the health cutoffs are the commissioned claim run through the SP 800-90B formulas` — e2e/claims.spec.ts:637
    - :648 `toBe` expected `Math.floor((k / BLOCK_LEN) * 1000) / 1000` _(expression)_
    - :649 `toBe` expected `Number(fmt(k / BLOCK_LEN, 3))` _(expression)_
    - :650 `expect` expected _no expected value_ _(none)_
    - :651 `expect` expected _no expected value_ _(none)_
    - :654 `toBe` expected `'C = ${rctCutoff(claimed)}'` _(expression)_
    - :655 `toBe` expected `'1 + ⌈20 / ${fmt(claimed, 3)}⌉'` _(expression)_
    - :656 `toBe` expected `'${APT_WINDOW} / ${aptCutoff(claimed)}'` _(expression)_
    - :660 `toHaveLength` expected `3` _(literal)_
    - :662 `expect` expected _no expected value_ _(none)_
    - :663 `expect` expected _no expected value_ _(none)_
    - :664 `toBe` expected `rctCutoff(claimed)` _(expression)_
    - :667 `expect` expected _no expected value_ _(none)_
    - :668 `expect` expected _no expected value_ _(none)_
    - :669 `toBe` expected `aptCutoff(claimed)` _(expression)_
    - :672 `toBe` expected `STREAM_LEN` _(expression)_
    - :673 `toBe` expected `samples / APT_WINDOW` _(expression)_
    - :675 `expect` expected _no expected value_ _(none)_
    - :676 `expect` expected _no expected value_ _(none)_
- `monitor state accumulates across emissions rather than restarting` — e2e/claims.spec.ts:679
    - :684 `toBe` expected `STREAM_LEN` _(expression)_
    - :689 `toBe` expected `i * STREAM_LEN` _(expression)_
    - :690 `toBe` expected `(i * STREAM_LEN) / APT_WINDOW` _(expression)_
- `a stuck detector fails both tests, latches, and blocks the extractor` — e2e/claims.spec.ts:694
    - :705 `toBe` expected `0` _(literal)_
    - :706 `toBe` expected `STREAM_LEN` _(expression)_
    - :707 `toBe` expected `'100.0%'` _(literal)_
    - :708 `expect` expected _no expected value_ _(none)_
    - :709 `toBe` expected `'100% — stuck!'` _(literal)_
    - :710 `toBe` expected `'0% — silent'` _(literal)_
    - :713 `expect` expected _no expected value_ _(none)_
    - :718 `expect` expected _no expected value_ _(none)_
    - :719 `toBe` expected `rctCutoff(claimed)` _(expression)_
    - :720 `expect` expected _no expected value_ _(none)_
    - :721 `expect` expected _no expected value_ _(none)_
    - :722 `expect` expected _no expected value_ _(none)_
    - :725 `expect` expected _no expected value_ _(none)_
    - :726 `toBe` expected `aptCutoff(claimed)` _(expression)_
    - :727 `expect` expected _no expected value_ _(none)_
    - :728 `expect` expected _no expected value_ _(none)_
    - :732 `toBe` expected `'0.000 bit/sample'` _(literal)_
    - :733 `expect` expected _no expected value_ _(none)_
    - :736 `toBe` expected `'✕ ALARM LATCHED — extractor input blocked'` _(literal)_
    - :737 `toBeDisabled` expected _no expected value_ _(none)_
    - :738 `expect` expected _no expected value_ _(none)_
- `a dead source is charged zero entropy by every panel that reports on it` — e2e/claims.spec.ts:741
    - :746 `toBe` expected `'0.0000 bits/bit'` _(literal)_
    - :747 `toBe` expected `'0.0000 bits/bit'` _(literal)_
    - :748 `toBe` expected `'100.0%'` _(literal)_
    - :749 `toBe` expected `'1 guess'` _(literal)_
    - :756 `expect` expected _no expected value_ _(none)_
    - :757 `toBe` expected `'⚠ dependence detected — model rate 0.0000 bits/bit'` _(literal)_
    - :758 `expect` expected _no expected value_ _(none)_
    - :762 `toBe` expected `0` _(literal)_
    - :763 `toBe` expected `STREAM_LEN / 2` _(expression)_
    - :764 `toBe` expected `'(no pairs survived)'` _(literal)_
    - :766 `toBe` expected `'✕ no output — equal pairs only'` _(literal)_
    - :767 `toBe` expected `'✕ REJECT — source is dead'` _(literal)_
    - :768 `expect` expected _no expected value_ _(none)_
    - :769 `expect` expected _no expected value_ _(none)_
    - :773 `toBe` expected `'0.0 bits'` _(literal)_
    - :774 `toBe` expected `'≥ 1 (vacuous)'` _(literal)_
    - :775 `toBe` expected `'✕ REJECT — the bound is vacuous'` _(literal)_
- `recommissioning a dead source is refused, and says why` — e2e/claims.spec.ts:778
    - :784 `toBe` expected _no expected value_ _(none)_
    - :789 `toBe` expected `pick(before, 'Claimed H').value` _(expression)_
    - :790 `toBe` expected `pick(before, 'RCT cutoff').value` _(expression)_
    - :791 `toBe` expected `pick(before, 'APT window').value` _(expression)_
    - :792 `toBe` expected _no expected value_ _(none)_
    - :795 `toBeDisabled` expected _no expected value_ _(none)_
- `the latch clears only after BOTH repair and recommissioning` — e2e/claims.spec.ts:798
    - :800 `toBeDisabled` expected _no expected value_ _(none)_
    - :806 `expect` expected _no expected value_ _(none)_
    - :807 `toBe` expected _no expected value_ _(none)_
    - :810 `toBeDisabled` expected _no expected value_ _(none)_
    - :811 `expect` expected _no expected value_ _(none)_
    - :818 `toHaveLength` expected `3` _(literal)_
    - :819 `toMatch` expected `/^✓ PASS/` _(regex)_
    - :820 `toMatch` expected `/^✓ PASS/` _(regex)_
    - :821 `toBe` expected `''` _(literal)_
    - :822 `toBe` expected `''` _(literal)_
    - :823 `toBeEnabled` expected _no expected value_ _(none)_
    - :825 `toBe` expected `STREAM_LEN` _(expression)_
    - :828 `expect` expected _no expected value_ _(none)_
- `the source panel toggle and the health panel both drive the one stuck flag` — e2e/claims.spec.ts:831
    - :835 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :836 `toHaveText` expected `'Stick detector B (failure)'` _(literal)_
    - :843 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :844 `toHaveText` expected `'Un-stick detector B'` _(literal)_
    - :848 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :849 `toHaveText` expected `'Stick detector B (failure)'` _(literal)_
    - :851 `expect` expected _no expected value_ _(none)_
    - :852 `expect` expected _no expected value_ _(none)_
    - :856 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :858 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :859 `toHaveText` expected `'Stick detector B (failure)'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Quantum Entropy — crypto-lab

**QRNG · min-entropy · randomness extraction.** A *modeled* biased beam-splitter QRNG — the bits come from the browser CSPRNG, not from photons — feeding real entropy accounting and a real extractor that turns a partially predictable stream into fewer bits with an explicit statistical-distance bound.

## What It Is

An interactive, browser-only demo of the front half of a randomness stack: a **modeled beam-splitter QRNG** feeding **real entropy measurements** (Shannon entropy vs min-entropy, `H∞ = −log₂ max p`), **real von Neumann debiasing**, a **real Toeplitz-matrix randomness extractor** (2-universal hashing over GF(2), with Leftover Hash Lemma accounting), and **continuous health tests illustrating the RCT and APT defined by NIST SP 800-90B §4.4** — stateful monitors whose run/window state survives emission boundaries, whose cutoffs derive from a commissioned entropy claim, and whose alarms latch and block the extractor until an explicit recommissioning action. The whole pipeline is placed in the SP 800-90C architecture: entropy source → health tests → conditioning → DRBG seed → DRBG.

**Two lanes, kept separate on purpose.** Every number used for cryptographic accounting (the extraction budget k, the health-test claim, the attacker-work figure) comes from the **configured source model** — for this repeat-or-fresh Markov model, the exact probability of its most likely 256-bit path, computed by dynamic program and verified against exhaustive enumeration in tests. Statistics measured on the emitted sample (bias p̂, predictor accuracy) are displayed as **observed diagnostics** and are never promoted into a guarantee — measuring your own input and calling it a bound is the classic accounting sin this lab exists to teach.

The concept it teaches: a quantum source is unpredictable by physics, not by assumption — **and it is still not usable as a key**. Raw quantum output is biased, correlated, and partially known to whoever built the hardware. Min-entropy measures what's actually there; an extractor converts it into fewer bits whose distribution is bounded close to uniform. The gap between "unpredictable" and "uniform" is where QRNG marketing lives and where the real engineering happens.

**What's real vs modeled:** the photon source is a labeled **model** (the browser CSPRNG plays the role of the quantum process, so the imperfections — detector mismatch, afterpulsing correlation, a stuck detector — are learner-controllable). Everything downstream of the raw bit stream is real math running on those actual bits: the entropy measurements, the debiaser, the GF(2) matrix–vector multiply, the LHL arithmetic, and the 800-90B tests with their spec-derived cutoffs.

**Security model & honesty:** no real quantum hardware, no device-independent certification, and no claim that passing anything here certifies entropy. This demo does **not** prove any generated bits are random — it shows the *accounting* by which real systems bound what an attacker faces. Not production crypto — a teaching demo. All bit material is per-session, in memory only.

## Exhibits

1. **The source** — a modeled beam-splitter QRNG, drawn as a live diagram (photon → half-silvered mirror → detectors A/B with click percentages), with learner-controlled detector mismatch (bias), afterpulsing (lag-1 correlation), and a stick-the-detector failure switch. Emits 4,096-bit raw streams.
2. **Shannon vs min-entropy** — both computed live off the same stream, plotted as curves with a marker at the measured bias. At 53/47: Shannon H = 0.9974 bits/bit (the marketing number) vs H∞ = 0.9159 bits/bit (what one optimal guess faces). Slide the bias: Shannon barely moves; min-entropy falls off a cliff. When you add correlation, the panel switches to the measured first-order predictor, because bias alone no longer bounds the attacker. A live stat translates the gap into stakes: what a naive 256-bit key cut from these bits actually costs to guess, vs what Shannon math would claim.
3. **Von Neumann debiasing** — step-through animation of real pairs (01→0, 10→1, 00/11→discard), output becoming exactly unbiased, throughput collapsing to ~p(1−p). Then the honest limit, caused by you: make the source streaky and the **bias check still passes while the security verdict rejects** — a first-order predictor guesses most output bits. Von Neumann fixes bias, not correlation.
4. **Toeplitz extraction** — a real m×256 Toeplitz matrix from a fresh CSPRNG seed, real GF(2) matrix–vector multiply, with the Leftover Hash Lemma receipt under one convention throughout: ε(k,m) = ½·√(2^(m−k)), solved exactly as m ≤ k + 2 − 2·log₂(1/ε). The budget k is the model's block min-entropy, drawn live in an entropy-budget bar (k available of 256 raw, m demanded, margin or overdraft shaded). Crank m past k and watch the guarantee evaporate — the output still *looks* perfectly random, which is exactly why the accounting, not the appearance, is the verdict. The accept/warn lines (2⁻³²/2⁻¹⁰) are labeled as this lab's teaching policy, not part of the theorem.
5. **Continuous health tests (SP 800-90B §4.4 RCT + APT)** — cutoffs derive from a *commissioned* per-sample entropy claim (0.915 bit/sample for the default 53/47 device — claiming H = 1 for it would false-alarm the APT roughly a thousand times too often, a mistake an earlier version of this lab made and now teaches). Monitor state persists across emissions, runs and windows straddle chunk boundaries correctly, and an alarm **latches**: the extractor refuses input until you repair the source and explicitly recommission. Stick a detector: bits keep flowing while the boundary slams shut — a dead source outputs a beautiful constant.
6. **The architecture** — where this sits in SP 800-90C, which stages the sibling demos own, and the one construction that doesn't require trusting the manufacturer (device-independent, Bell-certified randomness — named, linked to e91's CHSH exhibit, deliberately not built).

### High entropy rate versus uniformity

Exhibit 4 includes a separate 1,000-bit distribution model: vary a public zero prefix of length d while the remaining bits are independent and fair. It calculates min-entropy 1,000−d, entropy rate, and total variation distance 1−2⁻ᵈ. At d=10, the rate is 99% but distance from uniform is 1023/1024. An exhaustive small-distribution test checks the calculation and both endpoints. This is not a physical-source certificate, quantum implementation, or change to the existing 256-bit extractor.

Related research: Jain, Mutreja and Roberts, [Certified Randomness with Optimal Rate](https://arxiv.org/abs/2609.38945), 30 September 2026 (preprint, quantum random oracle model). The example illustrates a distinction between guarantees; it does not reproduce or refute the paper. Secrecy also depends on adversary information: published beacon output is not a secret OTP.

## When to Use It

- To understand why "quantum RNG" on a spec sheet is the *start* of a security argument, not the end of one.
- To see the difference between Shannon entropy and min-entropy on the same data, and why NIST SP 800-90B counts only the latter.
- To learn what a randomness extractor actually buys and what it costs (a seed, and output length as a security parameter).
- **Do NOT use it** to generate key material, to evaluate a real entropy source (a real SP 800-90B assessment involves far more than the two measures shown), or as an implementation reference for production conditioning.

## Live Demo

**<https://systemslibrarian.github.io/crypto-lab-quantum-entropy/>**

Emit photons from an imperfect device, watch the two entropy numbers diverge, step von Neumann pairs, break the debiaser with correlation, extract with a real Toeplitz matrix and overdraw the entropy budget, and trip the 800-90B health tests with a stuck detector.

## What Can Go Wrong

- **Trusting the Shannon number.** A 53/47 source is "99.7% random" by Shannon and only 0.9159 bits/bit by min-entropy. Provision a 256-bit key by the wrong number and you overstate the attacker's work by 20+ bits.
- **Debiasing without de-correlating.** Von Neumann output passes frequency tests on *any* stationary source — including one whose bits a predictor guesses 80% of the time. (A debiased-but-correlated stream also passes many SP 800-22 statistical tests; that suite lives in drbg-arena.)
- **Measuring your own input and calling it a bound.** An empirical bias or an in-sample predictor score is a diagnostic, not a min-entropy guarantee for the input distribution. The extraction budget must come from a validated model or assessment — here, the exact most-likely-path bound of the configured model.
- **Extracting more than you have.** Exceeding the entropy budget rapidly weakens the Leftover Hash Lemma guarantee: under this lab's convention, ε = ½·√(2^(m−k)) is 0.5 at m = k, about 0.7071 at m = k + 1, and 1 at m = k + 2. The upper bound becomes mathematically vacuous at m ≥ k + 2; a bound below 1 can still miss a cryptographic target by an enormous margin. The lab's accept/warn thresholds are teaching policy, not the vacuity boundary. The theorem requires a uniform seed independent of the source; no output-facing test establishes those assumptions.
- **Claiming more entropy than the device has.** Health-test cutoffs derive from the claim; claim H = 1 for a 53/47 device and the APT false-alarms ~1,000× its nominal 2⁻²⁰ rate. Commissioning ties the claim to the model bound, and degradation below the claim is flagged instead of silently reinterpreted.
- **Confusing health tests with entropy estimation.** RCT/APT detect death and gross degradation. A manufacturer-keyed PRNG can pass both while remaining predictable to its manufacturer.

## Real-World Usage

The discipline shown here — characterize a physical source's min-entropy, run continuous health tests, condition the raw output, then seed a deterministic generator — is the shape mandated by NIST SP 800-90B/90C for validated entropy sources, and variants of it appear across real systems: commercial QRNG products publish min-entropy claims and run continuous tests; Toeplitz hashing is a standard conditioning step in quantum-key-distribution post-processing; OS randomness pools and hardware sources (e.g. `/dev/random`'s input pool, RDSEED's conditioning stage) apply the same estimate → test → condition pattern in their own architectures. The architectures, parameters, and assurance claims differ per system — this lab teaches the shared accounting, not any one product's design.

## How to Run Locally

`​``bash
npm ci
npm run dev        # Vite dev server
npm test           # Vitest unit tests, formula/procedure KATs and exhaustive oracles
npm run build      # typecheck + production build
npm run test:a11y  # axe WCAG 2.1 A/AA gate (both themes) + health-gate + responsive checks, port 4337
`​``

## Related Demos

- [crypto-lab-drbg-arena](https://systemslibrarian.github.io/crypto-lab-drbg-arena/) — what happens *after* the seed (and the SP 800-22 suite).
- [crypto-lab-entropy-collapse](https://systemslibrarian.github.io/crypto-lab-entropy-collapse/) — a *shared* seed; this lab is a *weak* one.
- [crypto-lab-corrupted-oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/) — what happens when the DRBG itself is rigged.
- [crypto-lab-bb84](https://systemslibrarian.github.io/crypto-lab-bb84/) / [crypto-lab-e91](https://systemslibrarian.github.io/crypto-lab-e91/) — quantum measurement for key *agreement*; e91's CHSH exhibit underlies device-independent randomness.

## Build & Verify

- **Unit tests** (Vitest, colocated `src/**/*.test.ts`); the current CI run records the test count and outcome.
- **8 formula/procedure known-answer tests:** Shannon/min-entropy at p = 0.53 (0.9974 / 0.9159), p = 0.5 and p = 0.75; von Neumann's 1951 pairing procedure; a hand-computed 4×4 Toeplitz GF(2) vector; SP 800-90B RCT cutoffs (the publication's worked example H = 2 → C = 11, and H = 1 → C = 21); the binary APT cutoff (W = 1024, α = 2⁻²⁰ → C = 589).
- **Oracle and invariant tests:** the block min-entropy dynamic program proven equal to exhaustive enumeration over all sequences for n ≤ 10 across a bias/persistence grid, with its i.i.d. (n·H∞) and stuck (k = 0) reductions; RCT/APT monitors alarm at identical lifetime positions under every tested chunk split, including a cross-boundary run that per-chunk batch evaluation provably misses; alarms latch against healthy data; the LHL output-length solve honors its target ε and fails it at m+1; GF(2) linearity; exhaustive 2-universality at m = n = 3; exact debiasing; ~p(1−p) throughput; the debiaser-passes-bias-while-predictable failure; and fail-closed domain validation on the mathematical API.
- **Browser gate:** `npm run build && npm run test:a11y` — zero axe-core WCAG 2.1 A/AA violations in **both** themes against the production build with every panel driven into its post-interaction states (including latched-alarm states); a semantic check that the latched health alarm disables extraction until repair + recommission; and no horizontal overflow at 320, 390, and 768 px. Enforced in CI before deploy.

## Performance

Everything runs in-browser on 4,096-bit streams. The heaviest operation is a 256-row GF(2) Toeplitz matrix–vector multiply (~65k bit operations) plus a 511-bit seed draw — small enough that no workers or backend are involved.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## System construction bridge

The live demo now links the [SP 800-90C final](https://csrc.nist.gov/pubs/sp/800/90/c/final) construction classes to source health, conditioning and fresh-input dependencies. DRBG Arena’s class chooser is a source-request model, not a validated RBG or a replacement for the existing compromise experiments.

## Health-test workshop and attribution

The “source has failed” workshop compares bias, repeat dependence, a stuck detector, and predictable alternation. Adjust the APT window and alarm count or the RCT run cutoff; compare early false alarms, eligible detections, missed failures, and detection delays over 64 reproducible public-seed trials. The separate commissioned monitor and extractor gate keep their existing settings. Small simulations cannot establish rare-event rates: the panel separately calculates the binary IID APT probability, including its random reference and initial count. Exhaustive short-sequence enumeration checks that calculation.

**Credit:** Joshua E. Hill, *[The SP 800-90B Approved Health Tests and Their Cutoffs](https://www.untruth.org/~josh/sp80090b/N23A%20HillJ%20The%20SP800-90B%20Approved%20Health%20Tests%20and%20Their%20Cutoffs.pdf)*, ICMC, version 20240919, especially slides 2–8 and 13–17, informs the lesson on failure-specific power, threshold selection, and window/delay tradeoffs. Crypto Lab wrote the experiment, models, probability calculations, and tests; no slide graphics, code, or numerical tables were copied. Hill has not reviewed or endorsed this lab. Normative test definitions remain [NIST SP 800-90B §4.4](https://csrc.nist.gov/pubs/sp/800/90/b/final); alternate settings in the workshop are educational, not validated configurations.

## Restricted KDF bounds calculator

[Open the calculator](https://systemslibrarian.github.io/crypto-lab-quantum-entropy/#kdf-calculator). Compare the 128-bit and 138-bit source examples from Dodis, Pietrzak and Wichs, [Key Derivation Without Entropy Waste](https://eprint.iacr.org/2013/708) (6 February 2014), Corollaries 4.3 and 4.5. For integer baseline exponents b = 6…256, the lesson exposes source length, assumed min-entropy, output length, application game, public seed and hash-family requirements. Unsupported inputs clear the result and explain the limitation.

These are conditional sufficient application-failure bounds for an illustrative model, not entropy estimates, HKDF guarantees, generated keys, or device security certificates. The direct forward argument does not require a converse. The separate unrestricted deterministic converse in Lemma 3.6 is false as written: an exact counterexample exposes a whole-outcome acceptance-budget issue. The [resolution and proofs](https://github.com/systemslibrarian/crypto-lab/blob/main/docs/kdf-converse-resolution-2026-11-04.md) give the corrected floor-adjusted statement, recover the original ratio for integer-aligned budgets, and distinguish the stronger randomized-test premise. The calculator explains this beside the result; its supported formulas are unchanged.

Unit tests independently check the underlying tail inequalities with exact integer arithmetic at every supported exponent; browser tests exercise both examples, refusal states, the corrected-converse explanation, direct links and accessibility in the supported dark theme. The proof correction is a project derivation, not an author-issued erratum or a certification of every result in the paper.

```

</details>

---

## Noise to Numbers

- **slug**: `crypto-lab-noise-to-numbers`
- **repo**: https://github.com/systemslibrarian/crypto-lab-noise-to-numbers
- **live**: https://systemslibrarian.github.io/crypto-lab-noise-to-numbers/
- **commit_sha**: `727fa987cf1a4900057938d867d9922f249a4526` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `a2c0be26a8492c5dcab32e46fa9b3f62c92cf63f`
- **read_from**: working tree (clean)
- **category**: RANDOMNESS  ·  **level**: advanced  ·  **--accent**: #ff7043
- **MISSING FIELDS**: verification

**Name (H1)**: Noise to Numbers  — _read from index.html_

**Subtitle**: NIST SP 800-90B · entropy assessment  — _read from index.html_

**Description**: Follow physical noise from the circuit to the cryptographic byte — step the modular-multiplication loop, measure a sample, read each min-entropy estimator and its assumptions, break the stream, and watch conditioning stretch bytes without ever adding entropy.  — _read from index.html_

**Why it matters**: Keys are only as unguessable as the noise behind them, and the industry has shipped guessable ones more than once. Debian’s 2008 OpenSSL patch (DSA-1571-1) left the generator seeded by little more than a process id, and the 2012 Mining Your Ps and Qs  — _read from index.html_

**Card copy**: Compare pinned entropy assessments and source-model limits, then compute exact XOR bias for correlated binary Markov chains. See why balanced individual bits need not give unbiased parity.

**Chips**: SP 800-90B · Min-Entropy · Keccak-f[1600] · Modelled Noise Source

**Implements**: Keccak `src/entropy/keccak.ts:49`, SHA-256 `src/entropy/counter-hash.ts:85`, SHA-3 `src/entropy/keccak.ts:227`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: One-time pad `src/ui/padPanel.ts:2`, SHAKE `src/entropy/keccak.ts:8`

**References**: CTR-DRBG, DSA, HMAC-DRBG, MD5, One-time pad, Toeplitz extractor, von Neumann extractor

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `ePrint 2026/2417` — first seen src/entropy/parity.ts:2 (1×)
- `eprint.iacr.org/2026/2417` — first seen README.md:249 (1×)
- `FIPS 140-3` — first seen README.md:175 (1×)
- `FIPS 202` — first seen README.md:46 (6×)
- `NIST SP 800-90B` — first seen README.md:3 (8×)
- `SP 800-22` — first seen README.md:236 (2×)
- `SP 800-90B` — first seen README.md:15 (27×)
- `SP 800-90C` — first seen README.md:329 (2×)
- `SP800-90B` — first seen README.md:54 (7×)

**Stated limitations (page)**:

- _(honesty, index.html)_ What this lab does not establish

**README — What Can Go Wrong**:

```text
Each of these is a reachable state in the lab, not a hypothetical.

- **A file below the sample minimum.** SP 800-90B §3.1.1 asks for 1,000,000
  samples. The tool *refuses* — exits non-zero and writes an error — and the lab
  shows that refusal rather than a smaller number. `exploratory-short` exists to
  make this visible.
- **Packed bits read as byte samples.** A 1,000,000-sample packed file is
  125,000 bytes. Hand it to the tool as byte samples and you assess 125,000
  samples, not 1,000,000 — one eighth as many, and below the minimum. The
  encoding block in every manifest entry records both forms, both checksums,
  and the exact conversion.
- **The wrong `bits_per_symbol`.** Re-read a fixture at the wrong width in Act 2
  and the lab withdraws its recorded figure, because the figure was measured for
  a different reading of those bytes.
- **An estimate on conditioned output.** It looks excellent whatever went in,
  because a good hash produces uniform-looking bytes from anything. Act 5 shows
  the same source crossing the lab's "high" line purely by being conditioned.
- **A fault that raises the number.** Act 4, measured. A rising figure is not
  evidence that nothing is wrong.
- **An all-zero file.** `all-zero` meets the sample minimum and is still
  refused, for a different reason than a short one: an alphabet of one symbol.
  The lab shows both refusals, because they are different findings.
- **An empty file, a cancelled run, a file over the cap.** Each has its own
  named state; none is silently treated as "zero entropy", which is a different
  claim from "no evidence".

---
```

**Claims tested** (e2e/claims.spec.ts, 24 test(s)):

- `two-tool evidence stays separate from the selected upload and exposes assumptions` — e2e/claims.spec.ts:8
    - :11 `toContainText` expected `'10/10 estimators agree'` _(literal)_
    - :14 `toContainText` expected `counter.overall[0].toFixed(9)` _(expression)_
    - :15 `toContainText` expected `counter.inputSha256` _(expression)_
    - :18 `toContainText` expected `'Not independent'` _(literal)_
    - :20 `expect` expected _no expected value_ _(none)_
    - :22 `toContainText` expected `'IID can be biased'` _(literal)_
    - :23 `toContainText` expected `'Joshua E. Hill'` _(literal)_
    - :120 `toHaveText` expected `'Noise to Numbers'` _(literal)_
    - :121 `toHaveCount` expected `0` _(literal)_
    - :126 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :132 `toBeVisible` expected `{ timeout: 90_000 }` _(expression)_
    - :133 `toBeHidden` expected _no expected value_ _(none)_
- `the manifest the page renders is the manifest on disk, and it validates` — e2e/claims.spec.ts:147
    - :154 `toHaveCount` expected `0` _(literal)_
    - :172 `toBeCloseTo` expected `expected, 9` _(expression)_
    - :173 `toBeCloseTo` expected `minLit, 9` _(expression)_
    - :175 `toBeCloseTo` expected _no expected value_ _(none)_
    - :181 `toBeCloseTo` expected `minBits, 9` _(expression)_
    - :189 `toBe` expected `true` _(expression)_
    - :190 `expect` expected _no expected value_ _(none)_
- `every displayed figure belongs to the file being viewed (invariant I1)` — e2e/claims.spec.ts:197
    - :203 `toBe` expected `f.encoding.convertedSha256` _(expression)_
    - :211 `toBe` expected _no expected value_ _(none)_
    - :220 `toHaveText` expected _no expected value_ _(none)_
    - :223 `toHaveText` expected _no expected value_ _(none)_
- `Act 3 prints the recorded figures, with units, and the estimator table agrees with them` — e2e/claims.spec.ts:232
    - :249 `toBeCloseTo` expected `o.hAssessed!, 6` _(expression)_
    - :250 `toBeCloseTo` expected `o.assessedBitsPerBit!, 6` _(expression)_
    - :253 `toBeCloseTo` expected `perSample / width, 6` _(expression)_
    - :254 `toContainText` expected _no expected value_ _(none)_
    - :257 `toContainText` expected _no expected value_ _(none)_
    - :265 `toBe` expected `10` _(literal)_
    - :266 `toBeCloseTo` expected `perSample, 6` _(expression)_
    - :269 `toHaveCount` expected `10` _(literal)_
    - :271 `toHaveCount` expected `1` _(literal)_
    - :274 `toContainText` expected _no expected value_ _(none)_
- `the page never says bare "entropy" where it means min-entropy` — e2e/claims.spec.ts:279
    - :285 `toMatch` expected `/min-entropy/` _(regex)_
- `a below-minimum file shows the tool’s own refusal and NO figure (I6)` — e2e/claims.spec.ts:293
    - :301 `expect` expected _no expected value_ _(none)_
    - :302 `toBe` expected `0` _(literal)_
    - :314 `toHaveText` expected _no expected value_ _(none)_
    - :317 `toContainText` expected `'1,000,000'` _(literal)_
    - :321 `toHaveCount` expected `0` _(literal)_
    - :322 `toHaveCount` expected `0` _(literal)_
    - :323 `toHaveCount` expected `0` _(literal)_
- `a modified file retires the recorded figure and says so (I1)` — e2e/claims.spec.ts:326
    - :333 `toBeVisible` expected _no expected value_ _(none)_
    - :341 `toBeVisible` expected `{ timeout: 90_000 }` _(expression)_
    - :345 `toHaveCount` expected `0` _(literal)_
    - :352 `toBeVisible` expected _no expected value_ _(none)_
    - :358 `toBeVisible` expected `{ timeout: 90_000 }` _(expression)_
    - :360 `toHaveText` expected `before` _(expression)_
    - :361 `toHaveCount` expected `0` _(literal)_
- `partial coverage tracks the assessment’s own flag (I2)` — e2e/claims.spec.ts:364
    - :377 `toBe` expected `declined` _(expression)_
    - :382 `toBe` expected `false` _(expression)_
    - :383 `toHaveCount` expected `0` _(literal)_
    - :385 `toHaveCount` expected `0` _(literal)_
    - :393 `toHaveLength` expected `0` _(literal)_
- `the empty file is refused, and is not reported as zero entropy` — e2e/claims.spec.ts:396
    - :407 `toBeVisible` expected _no expected value_ _(none)_
    - :408 `toContainText` expected _no expected value_ _(none)_
    - :411 `toHaveCount` expected `0` _(literal)_
- `provenance is badged on every fixture, and never by colour alone (I3)` — e2e/claims.spec.ts:418
    - :434 `toContainText` expected `'Simulated'` _(literal)_
    - :435 `toHaveCount` expected `1` _(literal)_
    - :443 `toBeVisible` expected _no expected value_ _(none)_
    - :444 `toContainText` expected `'Deterministic'` _(literal)_
    - :446 `toHaveCount` expected `0` _(literal)_
    - :449 `toBe` expected `simulatedText` _(expression)_
- `public fixtures are marked never a secret (I4)` — e2e/claims.spec.ts:452
    - :456 `toBe` expected `true` _(expression)_
- `descriptive statistics are labelled as such and match an independent recomputation` — e2e/claims.spec.ts:471
    - :505 `toBeCloseTo` expected `balance, 5` _(expression)_
    - :517 `toBeCloseTo` expected `r1, 4` _(expression)_
    - :521 `expect` expected _no expected value_ _(none)_
- `the fault table’s movements are the arithmetic of its own two endpoints` — e2e/claims.spec.ts:528
    - :537 `expect` expected _no expected value_ _(none)_
    - :544 `expect` expected _no expected value_ _(none)_
    - :545 `expect` expected _no expected value_ _(none)_
    - :547 `toHaveAttribute` expected `'data-direction', dir` _(expression)_
    - :549 `expect` expected _no expected value_ _(none)_
    - :556 `expect` expected _no expected value_ _(none)_
    - :557 `toHaveText` expected _no expected value_ _(none)_
    - :560 `toHaveText` expected _no expected value_ _(none)_
    - :563 `toBeVisible` expected _no expected value_ _(none)_
- `the headline experiment reports the measured figures against the pinned threshold` — e2e/claims.spec.ts:576
    - :592 `toBeCloseTo` expected `ch, 6` _(expression)_
    - :593 `toBeCloseTo` expected `rn, 6` _(expression)_
    - :605 `expect` expected _no expected value_ _(none)_
    - :606 `expect` expected _no expected value_ _(none)_
    - :607 `expect` expected _no expected value_ _(none)_
    - :611 `toContainText` expected `'FULLY PREDICTABLE'` _(literal)_
    - :612 `toContainText` expected `(shownCh / shownRn).toFixed(2)` _(expression)_
- `the published stream regenerates byte-for-byte in the browser` — e2e/claims.spec.ts:615
    - :619 `toBeVisible` expected _no expected value_ _(none)_
    - :634 `expect` expected _no expected value_ _(none)_
    - :635 `expect` expected _no expected value_ _(none)_
    - :638 `toBe` expected `block0` _(expression)_
    - :639 `toBe` expected `block1` _(expression)_
- `the conditioning ledger multiplies the bytes and never the entropy (I5)` — e2e/claims.spec.ts:642
    - :658 `toHaveText` expected `String(m)` _(expression)_
    - :673 `toBe` expected `a.out * 64` _(expression)_
    - :674 `toBe` expected `256` _(literal)_
    - :677 `toBeCloseTo` expected `a.ent, 1` _(expression)_
    - :679 `toBeCloseTo` expected `64, 0` _(expression)_
    - :680 `expect` expected _no expected value_ _(none)_
- `conditioning raises the reported figure without changing the source` — e2e/claims.spec.ts:685
    - :692 `expect` expected _no expected value_ _(none)_
    - :695 `expect` expected _no expected value_ _(none)_
    - :701 `expect` expected _no expected value_ _(none)_
    - :702 `expect` expected _no expected value_ _(none)_
    - :703 `expect` expected _no expected value_ _(none)_
    - :704 `toContainText` expected _no expected value_ _(none)_
- `the lab names the patched build rather than claiming NIST’s reference implementation` — e2e/claims.spec.ts:713
    - :721 `toHaveText` expected _no expected value_ _(none)_
    - :724 `toContainText` expected _no expected value_ _(none)_
    - :727 `toBe` expected `true` _(expression)_
- `negative claim: passing statistical tests does not prove unpredictability` — e2e/claims.spec.ts:743
    - :761 `expect` expected _no expected value_ _(none)_
    - :762 `expect` expected _no expected value_ _(none)_
    - :765 `expect` expected _no expected value_ _(none)_
    - :775 `expect` expected _no expected value_ _(none)_
    - :777 `toHaveCount` expected `0` _(literal)_
    - :778 `toHaveCount` expected `0` _(literal)_
    - :779 `toHaveCount` expected `0` _(literal)_
    - :786 `toContainText` expected _no expected value_ _(none)_
    - :789 `toContainText` expected _no expected value_ _(none)_
- `negative claim: every honesty line is on screen, scoped as written` — e2e/claims.spec.ts:802
    - :813 `toHaveCount` expected `expected.length` _(expression)_
    - :816 `toBeVisible` expected _no expected value_ _(none)_
    - :818 `expect` expected _no expected value_ _(none)_
    - :823 `toBeVisible` expected _no expected value_ _(none)_
    - :824 `toBe` expected _no expected value_ _(none)_
- `negative claim: conditioned output is not evidence about the source` — e2e/claims.spec.ts:829
    - :842 `expect` expected _no expected value_ _(none)_
    - :848 `expect` expected _no expected value_ _(none)_
    - :849 `toHaveCount` expected `0` _(literal)_
    - :853 `toBeVisible` expected _no expected value_ _(none)_
    - :854 `expect` expected _no expected value_ _(none)_
- `negative claim: a public pad gives zero secrecy` — e2e/claims.spec.ts:861
    - :868 `toContainText` expected `'DECRYPTED'` _(literal)_
    - :869 `toContainText` expected _no expected value_ _(none)_
    - :874 `toContainText` expected `'NO SECRET WAS USED'` _(literal)_
    - :875 `expect` expected _no expected value_ _(none)_
- `nothing the page believes is hidden is actually painting` — e2e/claims.spec.ts:884
    - :892 `toBeVisible` expected `{ timeout: 90_000 }` _(expression)_
    - :898 `toEqual` expected `[]` _(expression)_
- `every mutation in the ledger names a real anchor that occurs exactly once` — e2e/claims.spec.ts:901
    - :907 `expect` expected _no expected value_ _(none)_
    - :911 `toBe` expected `1` _(literal)_
    - :912 `toBe` expected _no expected value_ _(none)_
    - :918 `toBe` expected `MUTATIONS.length` _(expression)_

**Mutation records** (2 file(s)):

- `e2e/mutations.ts` (8376 bytes)
- `scripts/check-parity-mutations.mjs` (2607 bytes)

<details><summary>Full README</summary>

```markdown
# Noise to Numbers — crypto-lab

**NIST SP 800-90B · entropy assessment.** Follow physical noise from the circuit
to the cryptographic byte — and see what evidence does and does not support
trusting it.

**Live demo:** https://systemslibrarian.github.io/crypto-lab-noise-to-numbers/

---

## What It Is

An interactive, browser-only lab about **entropy assessment**: the business of
establishing how much unpredictability a source actually has, which is what
NIST **SP 800-90B** exists to specify. It studies one real design — the
**Infinite Noise** modular entropy multiplier — through a software model of its
circuit, and runs the **real NIST assessment tool** over documented fixtures.

The concept it teaches: **entropy is a property of a source model, not of a byte
string.** Statistical randomness is not unpredictability, and conditioning
concentrates entropy but never creates it.

The lab demonstrates that rather than asserting it. A stream whose entire
construction is published here — SHA-256 over a little-endian counter, starting
at zero — was assessed at **0.919220 bits of min-entropy per bit**. The modelled
physical noise source was assessed at **0.372625**. The stream anyone can
regenerate from four lines of description scored **2.47 times higher** than the
one driven by thermal noise. Nobody decided those numbers in advance; they are
what the tool reported, and the page shows you how to reproduce them.

**Primitives and specs.** NIST SP 800-90B (non-IID track, ten estimators,
§3.1.1's 1,000,000-sample minimum, §3.1.5 conditioning, §4.4 health tests named
for contrast); Keccak-f[1600] as the Infinite Noise driver uses it; SHA-256;
the one-time pad.

**Not production crypto — a teaching demo.** It is **not** NIST certification,
validation or approval; not ESV and not CMVP. No device is claimed fit for
production key generation. There is no server: your files never leave the
browser.

### What is real, what is modelled, and what is pinned

| | |
|---|---|
| **Real** | Every min-entropy figure. Each comes from a pinned native run of `ea_non_iid` on one exact file, recorded with that file's SHA-256, the exact command, the tool commit and the platform. |
| **Real** | The Keccak-f[1600] permutation, hand-rolled in `src/entropy/keccak.ts` and checked against the FIPS 202 SHA3-256 digests built from the same permutation. |
| **Real** | The driver's sponge construction, the counter-hash stream, the packing arithmetic, every descriptive statistic, and the one-time-pad XOR. |
| **Modelled** | The noise source. `src/entropy/inm-model.ts` is a software model of the vendor's own `updateA()` loop with bell-shaped noise injected (Irwin-Hall, so that fixture generation is bit-reproducible across engines — see `src/entropy/prng.ts`). It is **not hardware** and not a capture from hardware, and it is badged "Simulated" everywhere it appears. |
| **Pinned, not computed here** | Nothing is assessed in your browser. The browser computes **descriptive statistics only** — bit balance, run lengths, lag-k autocorrelation, repeated-block search — each labelled "descriptive — not an SP 800-90B estimator". |

### The one thing to know about the tool

The figures come from a **patched build**, not NIST's unmodified reference
implementation: `systemslibrarian/SP800-90B_EntropyAssessment`, a fork of
upstream `87c104d0ed4cbc96103e7b8b38d6f2c7e0a6b289`. Every divergence is listed
with its reason, its upstream issue and its validation in
[SPIKE.md §9](SPIKE.md). The page says so on every reproduction block, because
"assessed with NIST's reference implementation" would not be true.

---

## Exhibits

1. **Meet the Source** — step the modular-multiplication loop yourself and watch
   the state fold across the threshold and emit a bit. Sets the vendor's
   *theoretical design rate* (log₂(1.82) = 0.863938 bits per bit) beside the
   *measured* estimate for the modelled stream (0.372625), and keeps them
   apart.
2. **Inspect Raw Samples** — descriptive statistics in a Web Worker, with
   progress, cancellation and a size cap. Load a shipped fixture or your own
   file; re-read the same bytes at a different symbol width and watch the
   recorded assessment be withdrawn.
3. **Assess Min-Entropy** — all ten non-IID estimators individually, each with
   its own figure, its own unit and its own stated assumption; the binding one
   highlighted; and the combination rule shown rather than asserted. Warnings
   and failures are first-class: the sub-minimum fixture shows the tool's own
   refusal, verbatim, and no figure at all.
4. **Break the Stream** — five predefined fault fixtures against the clean one,
   each with its own pinned run. The table records which estimators moved and
   which did not, as measured. **Three of the five broken streams report a
   higher figure than the clean one** — not because the faults went unnoticed,
   but because the reported figure is a minimum and the binding estimator
   improved on the broken file.
5. **Follow Conditioning** — the headline experiment, then the driver's Keccak
   sponge with its output multiplier under your control. Two bars to the same
   scale: raising the multiplier grows the output bar and leaves the entropy bar
   exactly where it is.
6. **One-Time Pad** — encrypt with a pad published in this repository, then
   decrypt it without being told any secret. Plus the length condition and the
   two-time-pad leak. Deliberately brief: for the pad itself, see
   [crypto-lab-otp-vault](https://systemslibrarian.github.io/crypto-lab-otp-vault/).

---

## When to Use It

- **To learn why a passing statistics check is not evidence of
  unpredictability** — this is the lab's central demonstration, with measured
  numbers rather than a warning box.
- **To understand what an SP 800-90B estimate actually claims** — which model,
  which assumptions, which units, and why the minimum is taken.
- **To see an entropy budget done as arithmetic** rather than asserted.
- **Do NOT use it to evaluate a device.** It assesses a *model* of a circuit on
  *simulated* data. It tells you about the model.
- **Do NOT use it as a certification aid.** It is not ESV, not CMVP, and the
  tool it runs is a patched build.
- **Do NOT use anything it ships as key material.** Every fixture is published
  here and badged "never a secret".

---

## Live Demo

https://systemslibrarian.github.io/crypto-lab-noise-to-numbers/

You can: step the circuit; analyse any of ten fixtures or your own file; read
every estimator's figure and assumption; compare five faults against the clean
stream; regenerate the "random-looking" counter-hash stream live in your
browser from its published construction; drive the conditioning ledger; and
decrypt a message using a pad this repository prints.

And you can **reproduce every figure the page shows**, with the commands the
page gives you.

---

## What Can Go Wrong

Each of these is a reachable state in the lab, not a hypothetical.

- **A file below the sample minimum.** SP 800-90B §3.1.1 asks for 1,000,000
  samples. The tool *refuses* — exits non-zero and writes an error — and the lab
  shows that refusal rather than a smaller number. `exploratory-short` exists to
  make this visible.
- **Packed bits read as byte samples.** A 1,000,000-sample packed file is
  125,000 bytes. Hand it to the tool as byte samples and you assess 125,000
  samples, not 1,000,000 — one eighth as many, and below the minimum. The
  encoding block in every manifest entry records both forms, both checksums,
  and the exact conversion.
- **The wrong `bits_per_symbol`.** Re-read a fixture at the wrong width in Act 2
  and the lab withdraws its recorded figure, because the figure was measured for
  a different reading of those bytes.
- **An estimate on conditioned output.** It looks excellent whatever went in,
  because a good hash produces uniform-looking bytes from anything. Act 5 shows
  the same source crossing the lab's "high" line purely by being conditioned.
- **A fault that raises the number.** Act 4, measured. A rising figure is not
  evidence that nothing is wrong.
- **An all-zero file.** `all-zero` meets the sample minimum and is still
  refused, for a different reason than a short one: an alphabet of one symbol.
  The lab shows both refusals, because they are different findings.
- **An empty file, a cancelled run, a file over the cap.** Each has its own
  named state; none is silently treated as "zero entropy", which is a different
  claim from "no evidence".

---

## Real-World Usage

Entropy assessment is not academic. Two incidents motivate the whole subject,
and both are cited on the page:

- **Debian's OpenSSL PRNG, 2008 (DSA-1571-1).** A patch removed the lines that
  stirred uninitialised memory into the pool, leaving the generator seeded by
  little more than a process id. Every key generated on an affected system for
  two years came from a space small enough to enumerate.
- **"Mining Your Ps and Qs", USENIX Security 2012.** Heninger, Durumeric,
  Wustrow and Halderman scanned the public internet and computed the private
  keys of **0.50% of TLS hosts**, from primes shared because devices generated
  keys before they had any entropy.

In both cases the output looked fine. That is the point of assessing the
*source* rather than the bytes.

SP 800-90B itself is the basis of NIST's Entropy Source Validation (ESV)
programme, which is a prerequisite for FIPS 140-3 validation of anything that
generates keys.

---

## How to Run Locally

`​``sh
npm install
npm run dev          # http://localhost:5173/crypto-lab-noise-to-numbers/
`​``

Other scripts:

`​``sh
npm test             # the unit and correctness suite (113 tests)
npm run build        # type-check and build
npm run test:claims  # the claims suite, against the production build
npm run test:a11y    # the WCAG 2.1 A/AA gate, against the production build
`​``

### Reproducing the lab's figures

Every figure the page shows can be re-measured. The page gives you the exact
commands per fixture; the shape is:

`​``sh
# 1. build the pinned assessment tool (full recipe in SPIKE.md)
git clone https://github.com/systemslibrarian/SP800-90B_EntropyAssessment
cd SP800-90B_EntropyAssessment && git checkout <the commit the page shows>
brew install libomp libdivsufsort jsoncpp openssl@3   # or the apt equivalents
cd cpp && make non_iid

# 2. convert the shipped fixture to the one-sample-per-byte form the tool reads
node scripts/unpack-bits.ts fixtures/inm-clean.bin 1000000 msb-first inm-clean.samples.bin
#    the result must hash to the convertedSha256 the page prints

# 3. run the assessment
./ea_non_iid -i -a -vv -o report.json inm-clean.samples.bin 1
`​``

### Regenerating the fixtures and the manifest

`​``sh
npm run fixtures:gen      # rebuild every fixture from its generator
npm run fixtures:assess   # rebuild AND re-measure, rewriting fixtures/manifest.json
npm run fixtures:verify   # regenerate and re-measure, failing on any disagreement
`​``

`fixtures/manifest.json` is **generated**. Nothing in it is typed by hand.

---

## Related Demos

- [crypto-lab-quantum-entropy](https://systemslibrarian.github.io/crypto-lab-quantum-entropy/)
  — the other half of the stack: a modelled QRNG, min-entropy accounting,
  von Neumann debiasing, a Toeplitz extractor, and the SP 800-90B §4.4 health
  tests. Where this lab *assesses a file*, that one *runs the pipeline*.
- [crypto-lab-drbg-arena](https://systemslibrarian.github.io/crypto-lab-drbg-arena/)
  — what happens after the entropy source: HMAC_DRBG, CTR_DRBG and Hash_DRBG,
  with live SP 800-22 statistical tests. The contrast with this lab is the
  point: SP 800-22 tests a *bit string*, SP 800-90B assesses a *source*.
- [crypto-lab-entropy-collapse](https://systemslibrarian.github.io/crypto-lab-entropy-collapse/)
  — the failure mode where the generator is flawless and the *seed* is not.
- [crypto-lab-otp-vault](https://systemslibrarian.github.io/crypto-lab-otp-vault/)
  — the one-time pad and the two-time-pad attack in full.

---

## Build & Verify

**Exact Markov parity lesson.** The conditioning tab also executes the signed
transition-kernel formula from Skorski and Mittmann, [Unpredictability from
Parity](https://eprint.iacr.org/2026/2417), Theorem III.1, Corollary III.7 and
Theorem III.11. Integer-fraction arithmetic computes blocks up to 16 bits for
independent, repeating and alternating binary sources. The visitor chooses the
initial law and block length, compares exact parity with the product-of-marginals
shortcut, and sees odd/even rebounds, single-bit guessing probability and the
first-order bound. The initial bit is excluded from the XOR. This is a separate
analytic model, not a measurement of the source fixtures or a hardware entropy
certificate. Eight new unit cases use exhaustive path enumeration as an independent
oracle; browser checks own the displayed arithmetic and negative boundary.
Run `node scripts/check-parity-mutations.mjs` to break the signed kernel, distance
calculation and scope statement one at a time, require successful builds and
assertion failures, and restore the exact baseline bundle. Existing mutation
and fixture-assessment gates remain in place.

**123 unit tests** (Vitest), **25 claims tests** and **2 accessibility scans**
(Playwright), plus an independent fixture-verification job.

| Check | What it establishes |
|---|---|
| **Known-answer tests** | The hand-rolled Keccak-f[1600] is checked by building SHA3-256 from it and comparing against the FIPS 202 digests for the empty string, `abc` and the 56-byte vector — *and* against Node's own `crypto.createHash('sha3-256')` across ten message lengths spanning the rate boundary. Two independent oracles: a memorised constant could be misremembered, and agreement with Node alone proves only that two things agree. |
| **Vendor-transcription tests** | `inm-model.test.ts` pins the parts of the vendor's `updateA()` that are easy to "tidy" into something else — the second noise application on the zero branch, the clamp at the top of the call — and measures the correlation the vendor's README warns about. |
| **Determinism KAT** (`prng.test.ts`) | Pins the exact generator stream, asserts every noise draw is an exact multiple of 2⁻²⁴, and fails if `prng.ts` ever reaches for `Math.log`/`sin`/`cos`/`exp`/`pow` again. It exists because this repository shipped a real reproducibility bug: Box-Muller noise made the fixtures engine-dependent, and the eight-million-sample conditioned fixture regenerated to different bytes on Linux than on the machine that measured it. See below. |
| **Manifest validation** | `validateManifest()` fails closed on a figure attributed to a file whose hash does not match, an assessed value that is not the combination of its own estimators, a full run recorded against a below-minimum file, or an unflagged partial run. The page renders the failure instead of the lab. |
| **Claims suite** (`e2e/claims.spec.ts`) | Every displayed figure matches its manifest entry; the descriptive statistics are **independently recomputed** from the fixture's own bytes by a different route; the counter-hash stream is regenerated with Node's crypto and compared against both the page's WebCrypto output and the shipped file; the fault table's movements are re-derived from their own two endpoints; and the headline threshold is read out of the source. |
| **Negative claims** (§4.1d) | Each line of the honesty panel is a tested claim with an evidence fixture: a reachable state where every check the page performs reports success *and* the named property is violated anyway. |
| **Mutation ledger** (`e2e/mutations.ts`, `scripts/mutate.mjs`) | 12 mutations recorded as concrete patches — file, a once-only anchor, its replacement, the owning test and the marker. A kill requires the owning test to have passed unmutated, the patch to have changed the file, the bundle hash to have moved, and the build to have succeeded. **12 of 12 kill.** A run in which a ledger entry's check never executed **fails**. Two entries are owned by unit tests rather than the browser suite, because the branches they cover are unreachable through any fixture this lab can ship — which the mutation run is what established. |
| **Independent fixture check** (`.github/workflows/fixtures.yml`) | Builds the pinned NIST tool from source, checks it against upstream's own pinned figure non-vacuously, regenerates every fixture from its generator, reruns every recorded command, and fails on any disagreement — every estimator, both branch minima, the exit status and the error message. This checks fixture *generation*, not just table-vs-fixture agreement. |
| **Accessibility gate** | `@axe-core/playwright`, WCAG 2.1 A/AA, over the production build at desktop and 380px, driving every state the lab renders — including the refusals, the "assessment not run" state and the pad failure, which is where this lab's most important sentences live. Zero violations, zero unexplained `incomplete` results, arithmetic contrast over every text node including `aria-hidden` ones, a measured non-text-contrast oracle with an **empty** baseline, and reflow. |

### What the gates actually caught

None of these were hypothetical, and all were fixed in the source rather than
suppressed.

- **The a11y gate** found three defects while being wired: a `[hidden]`
  progress bar that kept painting because a class rule outranked the UA's
  `[hidden]` rule, an `aria-label` on a role-less `<p>` (which axe reports only
  in its `incomplete` bucket, so a violations-only gate never sees it), and
  control boundaries at 2.30–2.51:1 against a 3:1 requirement.
- **The mutation run** found that the partial-coverage branch is unreachable
  through any shipped fixture, and that deleting the "assessment not run" guard
  does not compile and so was never a kill. Both ledger entries were moved to
  checks that genuinely bite rather than left reading as passes.
- **The independent fixture check** found two things the other gates could not.
  First, the pinned NIST tool **did not build on Linux at all** — `ULONG_MAX`
  used without `<climits>`, which macOS's libc++ supplies transitively and
  GCC's libstdc++ does not — so the repository's own reproduction instructions
  were unusable for most readers. Second, and worse, **the fixtures were not
  reproducible**: the generator drew noise with Box-Muller, whose `Math.log`,
  `Math.sin` and `Math.cos` ECMAScript explicitly leaves
  implementation-approximated. The modular-multiplication map is chaotic by
  design, so one differing ulp diverged every sample after it, and the
  eight-million-sample conditioned fixture regenerated to completely different
  bytes on the CI runner. Noise is now drawn by Irwin-Hall, which uses only
  exactly-specified arithmetic, and `prng.test.ts` pins the stream so it cannot
  drift again silently.

That last one is the reason this job exists. Every other check in the table
would have passed a lab whose central claim — regenerate this file and get
these numbers — was false.

---

## Performance

| | |
|---|---|
| Page weight | ~110 kB JS (29 kB gzipped), ~11 kB CSS |
| Fixtures | 10 files, 2.8 MB total, fetched on demand |
| Descriptive analysis | 1,000,000 samples in a Web Worker, with progress and cancellation; 16 MB input cap |
| Native assessment (not in the browser) | 0.21–0.27 s at 1 bit/sample, 5.1–5.5 s at 8 bits/sample; 19.9 MB and 325 MB peak RSS respectively — see [SPIKE.md](SPIKE.md) |

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## System construction bridge

The live demo now links the [SP 800-90C final](https://csrc.nist.gov/pubs/sp/800/90/c/final) construction classes to source health, conditioning and fresh-input dependencies. DRBG Arena’s class chooser is a source-request model, not a validated RBG or a replacement for the existing compromise experiments.

## Two-tool evidence, repeated runs, and attribution

Act 3 now includes a separate “Same bytes, two assessment tools” panel. Seven published one-bit inputs (six simulated circuit seeds and the first million bits of the public counter-hash fixture) are each assessed by the pinned NIST fork and **Theseus, by Joshua E. Hill / KeyPair Consulting**. All 140 estimator values are taken from actual native-tool reports. `public/comparison/results.json` records source commits, binary and input SHA-256 hashes, commands, platform, and output-log hashes. Input files and original reports are downloadable. The existing fixture manifest and its historical results are preserved.

The repeated-run range illustrates variability under one fixed software model. It is not a confidence interval, hardware assessment, or entropy-source validation. Agreement between tools is a cross-check, not a correctness proof. The interactive IID exercise separates bias, dependence, changing distributions, and a known deterministic sequence.

**Source credit:**

- Joshua E. Hill, *[The IID Assumption and YOU!](https://www.untruth.org/~josh/sp80090b/The%20IID%20Assumption%20and%20YOU%20D14.pdf)*, ICMC 2019, version D14, especially slides 4–9: informs the IID exercise.
- Joshua E. Hill, *[SP 800-90B Refinements: Validation Process, Estimator Confidence Intervals, and Assessment Stability](https://www.untruth.org/~josh/sp80090b/90B%20Extravaganza%2020200921.pdf)*, ICMC 2020, version 20200921, slides 14–26: motivates examining repeated-run variation and confidence assumptions. The six-run exercise does not implement his proposed bootstrap procedure or establish its confidence level.
- [Theseus](https://github.com/KeyPair-Consulting/Theseus), Joshua E. Hill / KeyPair Consulting: second native assessment implementation. Its source and binaries are not redistributed in this lab. Follow its own BSD-3-Clause notices when obtaining or modifying it.
- [NIST SP 800-90B](https://csrc.nist.gov/pubs/sp/800/90/b/final): normative source, including its linked errata. Hill’s analyses and proposals remain separately identified.

The fixtures, comparison harness, interaction, and explanations are original Crypto Lab work. No Hill slide images or numerical tables were copied; attribution does not imply his review or endorsement.

### Reproduce the comparison

Use Node 22.18+ (native TypeScript stripping), GCC, OpenMP, and the development packages `libdivsufsort-dev libjsoncpp-dev libssl-dev libbz2-dev`. Check out both tools at the exact commits listed in `public/comparison/results.json`, then:

`​``sh
make -C ../entropy-fork/cpp non_iid
make -C ../theseus/src non-iid-main
npm run comparison:verify -- --fork ../entropy-fork --theseus ../theseus
`​``

The verifier regenerates all seven inputs, checks their SHA-256 hashes, reruns both tools, requires all ten estimators, and compares every figure to the recorded value with an absolute tolerance of 1e-9 bits/sample. Binary hashes describe the recorded build; rebuilt binaries may differ across compilers. Recording a new result is an explicit `comparison:record` operation, never an automatic repair of failed evidence. The dedicated comparison workflow runs this check on pushes and pull requests. Every input is public, simulated or deterministic, and **never key material**.

```

</details>

---

## Pulse Chain

- **slug**: `crypto-lab-pulse-chain`
- **repo**: https://github.com/systemslibrarian/crypto-lab-pulse-chain
- **live**: https://systemslibrarian.github.io/crypto-lab-pulse-chain/
- **commit_sha**: `e3292f131b7c7b299261d3c66f156e6a4bcc541b` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `ca41cf24c43c6a4ac6b8ff287991b2981a1672d2`
- **read_from**: working tree (clean)
- **category**: RANDOMNESS | SIGNATURES  ·  **level**: advanced  ·  **--accent**: #4fb3e8
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Pulse Chain  — _read from index.html_

**Subtitle**: NIST Beacon 2.0 · NISTIR 8213 · drand threshold BLS  — _read from index.html_

**Description**: Verify a real NIST beacon pulse until every check passes, then see the one thing those checks cannot prove — whether the operator knew the number first — and how drand’s threshold signatures change who you have to trust.  — _read from index.html_

**Why it matters**: Election audits, lotteries and blockchain committees lean on public randomness, and a beacon whose operator can peek or steer turns a fair draw into a chosen one. Knowing which guarantees are checkable, and which rest on trusting the operator, is the difference between using a beacon and believing one.  — _read from index.html_

**Card copy**: Recompute real NIST Beacon 2.0 pulses byte by byte, walk their SHA-512 hash chain and skiplist, verify drand rounds with a BLS12-381 pairing, and see what no check proves: whether the operator knew first.

**Chips**: NIST Beacon 2.0 · drand · BLS12-381 · SHA-512

**Implements**: BLS signatures `src/drand/verify.ts:25`, BLS12-381 `src/drand/verify.ts:25`, Hash-to-curve `src/drand/verify.ts:85`, Pairing `src/drand/verify.ts:86`, RSA `src/core/der.ts:114`, SHA-256 `src/drand/verify.ts:48`, SHA-512 `src/nist/verify.ts:61`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Pedersen commitment `src/drand/verify.ts:11`

**References**: Pedersen commitment, Schnorr

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 180-4` — first seen README.md:103 (1×)
- `RFC 8017` — first seen src/nist/verify.ts:60 (1×)
- `RFC 9380` — first seen README.md:103 (5×)
- `rfc9380` — first seen README.md:14 (7×)

**README — What Can Go Wrong**:

```text
- **Trusting the spec text over the deployment.** A verifier written from NISTIR 8213's prose (8-byte lengths, `uint64` external status, PEM-hashed `certificateId`) rejects every real pulse. This lab only found the deployed layout by testing variants against published values.
- **Hash chain mistaken for authenticity.** Anyone can extend or re-hash a chain. Only the signature binds a pulse to NIST, and since the 2026-09-03 rotation it cannot be checked against the certificate the pulses name.
- **Skiplist without self-hashes.** Algorithm 6 checks only the links between entries. A path whose pulses do not each hash to their own `outputValue` proves nothing, so the lab checks both.
- **Operator foreknowledge.** NIST's engine holds each value before release. The precommitment stops it changing its mind after committing; it does not stop it choosing what to commit, or skipping a pulse.
- **Mixing drand schemes.** Using the wrong DST, group, or chained/unchained message format makes valid rounds fail, or makes a verifier accept a round under the wrong chain. Act 5 and the unit tests exercise each.
- **v2 drand responses omit `randomness`.** Deriving it as `SHA-256(signature)` is correct, but there is then nothing published to compare against. This lab keeps the v1 value for that comparison.
- **Threshold collusion.** If at least t drand members collude they can compute rounds early; uniqueness still holds, unpredictability does not.
```

**Claims tested** (e2e/claims.spec.ts, 40 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:72
    - :72 `toHaveAttribute` expected `'data-ready', 'true'` _(expression)_
- `Act 1 — the recomputed outputValue` — e2e/claims.spec.ts:82
- `both printed values equal an independent SHA-512 of the newest pulse` — e2e/claims.spec.ts:83
    - :88 `toBe` expected `p.outputValue` _(expression)_
    - :89 `toBe` expected `p.outputValue` _(expression)_
    - :90 `toBe` expected `independent` _(expression)_
    - :91 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
- `the byte map’s offsets sum to the signed length an independent serializer produces` — e2e/claims.spec.ts:94
    - :99 `toHaveLength` expected `19` _(literal)_
    - :104 `expect` expected _no expected value_ _(none)_
    - :105 `toBe` expected `signedBytes(p).length` _(expression)_
    - :107 `toHaveLength` expected `8` _(literal)_
- `the 8-byte draft layout fails with OUTPUT_MISMATCH and widens every prefix` — e2e/claims.spec.ts:110
    - :112 `toHaveAttribute` expected `'data-code', 'OUTPUT_MISMATCH'` _(expression)_
    - :113 `toContainText` expected `'8-byte length prefixes'` _(literal)_
    - :117 `toHaveLength` expected `16` _(literal)_
    - :119 `toBe` expected `NIST.recent.at(-1).outputValue` _(expression)_
- `one flipped bit is named as the cause, and flipping back restores the match` — e2e/claims.spec.ts:122
    - :125 `toHaveAttribute` expected `'data-verdict', 'fail'` _(expression)_
    - :126 `toContainText` expected `'One flipped bit'` _(literal)_
    - :129 `toBe` expected `nistOutput(p)` _(expression)_
    - :131 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
- `Act 2 — rewriting history` — e2e/claims.spec.ts:135
- `arrival: every row passes, independently re-derived` — e2e/claims.spec.ts:136
    - :137 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :140 `toBe` expected `run[i - 1].outputValue` _(expression)_
    - :141 `toBe` expected `run[i - 1].precommitmentValue` _(expression)_
    - :143 `toHaveCount` expected `run.length` _(expression)_
- `a rewrite is caught by exactly the three checks the page names` — e2e/claims.spec.ts:146
    - :150 `toContainText` expected `'REWRITE DETECTED'` _(literal)_
    - :151 `toContainText` expected `'3 independent checks'` _(literal)_
    - :153 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :154 `toHaveAttribute` expected `'data-code', 'SIG_INVALID'` _(expression)_
    - :155 `toHaveAttribute` expected `'data-code', 'PRECOMMIT_MISMATCH'` _(expression)_
    - :157 `toHaveAttribute` expected `'data-code', 'LINK_BROKEN'` _(expression)_
    - :162 `toBe` expected `false` _(expression)_
    - :163 `toBe` expected `true` _(expression)_
    - :165 `toHaveCount` expected `4` _(literal)_
- `retirement: a different target undoes the rewrite and says so` — e2e/claims.spec.ts:168
    - :170 `toContainText` expected `'REWRITE DETECTED'` _(literal)_
    - :172 `toContainText` expected `'INTACT'` _(literal)_
    - :173 `toContainText` expected `'previous rewrite was undone'` _(literal)_
- `no-op guard: re-selecting the same target keeps the rewrite` — e2e/claims.spec.ts:176
    - :179 `toContainText` expected `'REWRITE DETECTED'` _(literal)_
    - :181 `toContainText` expected `'REWRITE DETECTED'` _(literal)_
    - :182 `toContainText` expected `'undone'` _(literal)_
- `Act 3 — skiplist` — e2e/claims.spec.ts:186
- `the stat equals the rows, and every hop is independently carried by a link` — e2e/claims.spec.ts:187
    - :190 `toContainText` expected `String(n)` _(expression)_
    - :192 `toBe` expected `path.length` _(expression)_
    - :195 `expect` expected _no expected value_ _(none)_
    - :197 `toContainText` expected _no expected value_ _(none)_
    - :200 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
- `dropping a pulse breaks the path at the hop it names` — e2e/claims.spec.ts:203
    - :206 `toHaveAttribute` expected `'data-code', 'SKIPLIST_BROKEN'` _(expression)_
    - :207 `toContainText` expected `'from #${path[9].pulseIndex} to #${path[11].pulseIndex}'` _(expression)_
    - :208 `expect` expected _no expected value_ _(none)_
    - :210 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
- `Act 4 — the negative claim (§4.1d)` — e2e/claims.spec.ts:214
- `pulse #1925733: every check passes, and the page says what that does not show` — e2e/claims.spec.ts:215
    - :217 `toBeChecked` expected _no expected value_ _(none)_
    - :219 `toBeVisible` expected _no expected value_ _(none)_
    - :222 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :224 `toHaveCount` expected `0` _(literal)_
    - :228 `toBe` expected `p.certificateId` _(expression)_
    - :229 `toBe` expected `true` _(expression)_
    - :231 `toHaveText` expected `/VERIFIED — AND KNOWN TO THE OPERATOR FIRST/` _(regex)_
    - :232 `toHaveAttribute` expected `'data-verdict', 'warn'` _(expression)_
    - :234 `toBeVisible` expected _no expected value_ _(none)_
    - :235 `toContainText` expected `'does not show this value was unpredictable to NIST'` _(literal)_
    - :238 `toBe` expected `prev.precommitmentValue` _(expression)_
    - :239 `toContainText` expected `'pulse #${prev.pulseIndex}'` _(expression)_
- `the newest pulse: hashes pass, origin fails with SIG_SIZE_MISMATCH, and no negative-claim fixture` — e2e/claims.spec.ts:242
    - :244 `toContainText` expected `'ORIGIN CANNOT BE CHECKED'` _(literal)_
    - :245 `toHaveAttribute` expected `'data-code', 'SIG_SIZE_MISMATCH'` _(expression)_
    - :246 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :247 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :248 `toHaveCount` expected `0` _(literal)_
    - :252 `toBe` expected `4096` _(literal)_
    - :253 `toBe` expected `2048` _(literal)_
    - :254 `toContainText` expected `'4096-bit signature'` _(literal)_
    - :255 `toContainText` expected `'2048-bit key'` _(literal)_
- `the rotation pulse names both status flags` — e2e/claims.spec.ts:258
    - :260 `toContainText` expected `'statusCode 6'` _(literal)_
    - :261 `toContainText` expected `'gap'` _(literal)_
    - :262 `toContainText` expected `'certificateId changed'` _(literal)_
- `Act 5 — drand` — e2e/claims.spec.ts:266
- `VALID ROUND agrees with an independent pairing check, and randomness with SHA-256` — e2e/claims.spec.ts:267
    - :269 `toContainText` expected `'Round ${r.round.toLocaleString('en-US')}'` _(expression)_
    - :274 `toBe` expected `true` _(expression)_
    - :275 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :276 `toBe` expected `r.v1Randomness` _(expression)_
    - :277 `toContainText` expected `r.v1Randomness` _(expression)_
    - :278 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
- `a wrong round and a wrong previous signature are each rejected with PAIRING_MISMATCH` — e2e/claims.spec.ts:281
    - :284 `toHaveAttribute` expected `'data-code', 'PAIRING_MISMATCH'` _(expression)_
    - :285 `toHaveCount` expected `0` _(literal)_
    - :288 `toHaveAttribute` expected `'data-code', 'PAIRING_MISMATCH'` _(expression)_
- `round 1 is anchored at the genesis seed the chain info publishes` — e2e/claims.spec.ts:291
    - :293 `toContainText` expected `'ANCHORED AT GENESIS'` _(literal)_
    - :294 `toBe` expected `DRAND.default.info.genesis_seed` _(expression)_
- `quicknet verifies unchained, and the chained-only control is disabled` — e2e/claims.spec.ts:297
    - :299 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :300 `toBeDisabled` expected _no expected value_ _(none)_
    - :301 `toHaveCount` expected `0` _(literal)_
- `Act 6 — threshold uniqueness` — e2e/claims.spec.ts:305
- `the page’s group signature verifies independently under the page’s group key` — e2e/claims.spec.ts:306
    - :307 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :313 `toBe` expected `true` _(expression)_
- `two different quorums print the same signature, and the summary counts one distinct value` — e2e/claims.spec.ts:316
    - :319 `toHaveCount` expected `3` _(literal)_
    - :321 `toContainText` expected `'signers {3, 4, 5}'` _(literal)_
    - :322 `toBe` expected `first` _(expression)_
    - :324 `toHaveLength` expected `2` _(literal)_
    - :325 `toBe` expected `1` _(literal)_
    - :327 `toHaveAttribute` expected `'data-distinct', '1'` _(expression)_
    - :328 `toHaveAttribute` expected `'data-valid', '2'` _(expression)_
    - :329 `toContainText` expected `'1 distinct value'` _(literal)_
- `below threshold is rejected and names the threshold` — e2e/claims.spec.ts:332
    - :335 `toHaveAttribute` expected `'data-verdict', 'fail'` _(expression)_
    - :336 `toContainText` expected `'below the threshold of 3'` _(literal)_
- `retirement: changing the signer set clears the old verdict and says so` — e2e/claims.spec.ts:339
    - :340 `toHaveCount` expected `1` _(literal)_
    - :342 `toHaveCount` expected `0` _(literal)_
    - :343 `toContainText` expected `'has been cleared'` _(literal)_
- `The four properties` — e2e/claims.spec.ts:347
- `the NIST verifiability cell reflects the Act 4 signature result, not prose` — e2e/claims.spec.ts:348
    - :350 `toHaveAttribute` expected `'data-level', 'partial'` _(expression)_
    - :353 `toContainText` expected `sigText` _(expression)_
- `the NIST liveness cell’s gap equals the fixture timestamps` — e2e/claims.spec.ts:356
    - :358 `toContainText` expected `'${gap} missing pulses'` _(expression)_
- `[hidden] probe: nothing marked hidden is painted` — e2e/claims.spec.ts:362
    - :364 `toBe` expected `0` _(literal)_
- `Guided experiment` — e2e/claims.spec.ts:367
    - :371 `toBeVisible` expected _no expected value_ _(none)_
- `ships unstarted, and step 1 verifies pulse #1925733 on all five checks` — e2e/claims.spec.ts:374
    - :375 `toHaveCount` expected `0` _(literal)_
    - :378 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :380 `toHaveText` expected `/VERIFIED/` _(regex)_
    - :383 `toContainText` expected `'#${p.pulseIndex}'` _(expression)_
    - :385 `toBe` expected `true` _(expression)_
- `step 2: one flipped bit fails exactly the three checks that cover it` — e2e/claims.spec.ts:388
    - :393 `toHaveAttribute` expected `'data-code', 'OUTPUT_MISMATCH'` _(expression)_
    - :394 `toHaveAttribute` expected `'data-code', 'PRECOMMIT_MISMATCH'` _(expression)_
    - :395 `toHaveAttribute` expected `'data-code', 'SIG_INVALID'` _(expression)_
    - :396 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :397 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :398 `toContainText` expected `'3 of 5 checks fail'` _(literal)_
    - :402 `toBe` expected `NIST.preRotation.at(-2).precommitmentValue` _(expression)_
- `step 3 (negative claim): everything passes, and the page says NIST knew first` — e2e/claims.spec.ts:405
    - :412 `toBeVisible` expected _no expected value_ _(none)_
    - :415 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :417 `toHaveCount` expected `0` _(literal)_
    - :418 `toHaveAttribute` expected `'data-verdict', 'warn'` _(expression)_
    - :420 `toContainText` expected `'NIST already knew the secret value'` _(literal)_
    - :421 `toHaveText` expected `'Nothing failed. That is the lesson.'` _(literal)_
    - :424 `toContainText` expected `'${prev.timeStamp.slice(11, 16)} UTC'` _(expression)_
    - :425 `toContainText` expected `'${p.timeStamp.slice(11, 16)} UTC'` _(expression)_
    - :426 `toBe` expected `prev.precommitmentValue` _(expression)_
- `step 4: two quorums print one signature; two operators print none` — e2e/claims.spec.ts:429
    - :439 `toContainText` expected `'2 OF 3'` _(literal)_
    - :440 `toHaveCount` expected `0` _(literal)_
    - :446 `toHaveLength` expected `2` _(literal)_
    - :447 `toBe` expected `1` _(literal)_
    - :448 `toContainText` expected `'2 different quorums, one signature'` _(literal)_
    - :449 `toContainText` expected `'Neither proves that the publisher didn’t know the value first.'` _(literal)_
- `Live deployment finding` — e2e/claims.spec.ts:453
- `every row but the signature passes, and the wording stays narrow` — e2e/claims.spec.ts:454
    - :457 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :459 `toHaveAttribute` expected `'data-code', 'SIG_SIZE_MISMATCH'` _(expression)_
    - :460 `toContainText` expected `'Observed: ${NIST.rotation.timeStamp.slice(0, 10)}'` _(expression)_
    - :461 `toContainText` expected `'Rechecked: ${NIST.fetchedAt.slice(0, 10)}'` _(expression)_
    - :464 `toContainText` expected `'signature is ${Buffer.from(p.signatureValue, 'hex').length * 8} bits'` _(expression)_
    - :465 `toContainText` expected `'${cert.publicKey.asymmetricKeyDetails?.modulusLength} bits'` _(expression)_
    - :467 `toContainText` expected `'Origin cannot be verified against the certificate the pulse names'` _(literal)_
    - :468 `toContainText` expected `'not a claim that the beacon is compromised'` _(literal)_
- `the tamper row closes the comparison with both beacons holding` — e2e/claims.spec.ts:471
    - :473 `toHaveAttribute` expected `'data-level', 'holds'` _(expression)_
    - :475 `toHaveAttribute` expected `'href', '#finding'` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Pulse Chain

**NIST Beacon 2.0 · NISTIR 8213 · drand threshold BLS**

Recompute real NIST Randomness Beacon pulses byte by byte, walk their SHA-512 hash chain and skiplist, verify real drand League of Entropy rounds with a BLS12-381 pairing, and find the one thing no check can tell you: whether the operator knew the number first.

> Not production crypto — a teaching demo. To consume a beacon, use the operator's maintained client and pin its keys.

## What It Is

A randomness beacon publishes a fresh random value on a schedule for anyone to use: audit sampling, lotteries, committee selection. This lab verifies two that are in service, using their own published outputs, pinned in the repository:

- **NIST Randomness Beacon 2.0** (chain 2, one pulse per minute), specified by NISTIR 8213 (Draft, May 2019). Each pulse's `outputValue` is SHA-512 over a byte serialization of nineteen fields plus an RSA PKCS #1 v1.5 / SHA-512 signature. Pulses link to the previous pulse and to the first pulse of the hour, day, month and year, and each pulse publishes `precommitmentValue = SHA-512(next localRandomValue)`.
- **drand** (League of Entropy): the `default` chain (`pedersen-bls-chained`: public key on G1, signatures on G2, message `SHA-256(previous_signature ‖ uint64_be(round))`) and `quicknet` (`bls-unchained-g1-rfc9380`: signatures on G1, message `SHA-256(uint64_be(round))`). Randomness is `SHA-256(signature)`. The group key is threshold-shared, so no single member can sign a round.

**Security model.** A beacon is judged on four properties: unpredictability, uniqueness (bias resistance), public verifiability and liveness. Verification can establish integrity (nothing changed after publication) and origin (the key holder signed it). It cannot establish how the key holder chose the value. For NIST that matters directly: the engine holds each `localRandomValue` a full pulse before revealing it.

**What this lab measured, rather than assumed.** It tested every serialization variant against 56 real pulses:

| Question | NISTIR 8213 draft text | What `beacon.nist.gov` computes |
|---|---|---|
| Length prefix of strings and hashes | 8-byte `uint64` (eq. 4) | **4 bytes** |
| `external.statusCode` | `uint64` (Algorithm 2, line 11) | **4 bytes** |
| `outputValue` preimage | signature serialized with its length | **raw 512-byte signature, no prefix** |
| `certificateId` | hash of the PEM file (§4.8.2) | **SHA-512 of the certificate's DER bytes** |

The draft-text reading reproduces **none** of the 56 pulses. `src/nist/nist.test.ts` pins each row as a regression test.

**A dated finding (captured 2026-10-01).** NIST rotated its signing certificate at pulse 1925734 (2026-09-03 21:08 UTC). That pulse self-reports `statusCode 6` (a gap plus a certificate change) after 10 missing pulses. Every pulse since then carries a 4096-bit signature, while the certificate its `certificateId` names (`CN=engine.beacon.nist.gov`, valid 2026-09-03 to 2027-03-20) has a 2048-bit key. Those signatures cannot be verified against the certificate they name, though every hash, link and precommitment still checks. Pulse 1925733, the last under the previous 4096-bit certificate, verifies completely. `scripts/live-check.mjs` re-asks the live service weekly and fails if this changes.

**Real vs simulated.** Every pulse, certificate and round is real and unmodified, and every check is real cryptography: SHA-512 and SHA-256 from `@noble/hashes`; RSA through WebCrypto plus a hand-rolled `s^e mod n` recovery so the padding can be shown; BLS12-381 hash-to-curve and pairings from `@noble/curves`. Act 6's threshold beacon is real BLS arithmetic with simulated signers and a **trusted dealer**. drand itself uses distributed key generation.

**What it does not prove.** It does not show that NIST did not know or choose a value, or that fewer than the threshold of drand members colluded. It does not validate the certificate's own signature or its chain to a CA, NIST's hardware or entropy sources, drand's key ceremony, or the `external.value` field, which is all zeros in every pinned pulse.

## Exhibits

0. **Guided experiment (about 90 seconds).** The newcomer's route, above the acts: *Can a random number be cryptographically verified — and still not be fair?* Verify pulse 1925733 on five real checks, flip one bit and watch the three checks that cover it fail, restore it to reach the climax ("Verified — but NIST already knew the secret value. Nothing failed. That is the lesson."), then pick operators for a 3-of-5 threshold signer and see two different quorums print one signature while two operators print none. "Want to see what actually happened?" opens the shares, Lagrange coefficients and pairing check. It ends with four sentences: a signature proves who published; a hash chain proves history wasn't rewritten; neither proves the publisher didn't know first; a threshold changes who must be trusted without removing trust.
1. **Recompute a NIST pulse.** A byte map of the nineteen serialized fields with offsets and length prefixes, and the published vs recomputed `outputValue` compared digit by digit. Break it two ways: switch to the draft's 8-byte prefixes, or flip one bit of `localRandomValue`.
2. **Walk the chain, then rewrite history.** Eight consecutive signed pulses with four independent checks per row (self-hash, previous link, precommitment, RSA signature). Rewrite one pulse the way a forger without NIST's key would: change it and re-hash it. Three different checks catch it.
3. **Skip from a month ago to now.** A 33-pulse skiplist (NISTIR 8213 Algorithm 6) from pulse 1925733 to 1965616, spanning 39,884 pulses, mostly by `day` links. Remove any pulse and the path breaks at exactly that hop.
4. **Who vouches for the pulse?** Certificate ID, RSA signature (opened by hand to its `00 01 FF…FF 00 ‖ DigestInfo ‖ H` block), precommitment. Pulse 1925733 passes everything and is the negative-claim exhibit: **VERIFIED — AND KNOWN TO THE OPERATOR FIRST**. Post-rotation pulses show the signature/key size mismatch.
5. **Verify a drand round.** The message bytes, hash-to-curve with the right DST, both sides of the pairing equation compared, randomness against the value drand's v1 API published, and chain continuity back to the genesis seed. Break it by claiming the next round or substituting a wrong previous signature.
6. **Why a threshold makes the output unique.** A 3-of-5 BLS beacon. Choose which signers respond, combine partials by Lagrange interpolation in the exponent, and see every quorum produce the same signature while two signers produce nothing valid.
- **Live deployment finding.** A card beside Act 4 that recomputes the 2026-09-03 rotation finding from the newest pinned pulse: hash, link, precommitment and named certificate pass, and signature verification fails (4096-bit signature, 2048-bit modulus). It is worded narrowly: origin cannot be verified against the certificate the pulse names, which is not a claim that the beacon is compromised.
7. **What you can and cannot check, side by side.** Tamper evidence plus the four properties, NIST vs drand, as the closing summary. Cells that depend on a check are computed from that check, and each links to the experiment that shows it.

## When to Use It

- To learn what a public randomness beacon's outputs can and cannot prove, before relying on one.
- To check your own NIST Beacon 2.0 verifier against real pulses: 4-byte prefixes, 4-byte `external.statusCode`, raw signature in the output hash, DER for `certificateId`.
- To compare a single-operator beacon with a threshold beacon property by property.
- **Do NOT** use this code to consume a beacon in production. It has no network client, no key pinning or rotation handling, and no certificate-chain validation.
- **Do NOT** treat a verified NIST pulse as unpredictable to NIST, or as fit for any use where the operator is an adversary (Act 4).

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-pulse-chain/**

Recompute and tamper with real pulses, verify and break drand rounds, operate a toy threshold beacon, and compare the two beacons on four properties. The page makes no network requests; all data is pinned.

## What Can Go Wrong

- **Trusting the spec text over the deployment.** A verifier written from NISTIR 8213's prose (8-byte lengths, `uint64` external status, PEM-hashed `certificateId`) rejects every real pulse. This lab only found the deployed layout by testing variants against published values.
- **Hash chain mistaken for authenticity.** Anyone can extend or re-hash a chain. Only the signature binds a pulse to NIST, and since the 2026-09-03 rotation it cannot be checked against the certificate the pulses name.
- **Skiplist without self-hashes.** Algorithm 6 checks only the links between entries. A path whose pulses do not each hash to their own `outputValue` proves nothing, so the lab checks both.
- **Operator foreknowledge.** NIST's engine holds each value before release. The precommitment stops it changing its mind after committing; it does not stop it choosing what to commit, or skipping a pulse.
- **Mixing drand schemes.** Using the wrong DST, group, or chained/unchained message format makes valid rounds fail, or makes a verifier accept a round under the wrong chain. Act 5 and the unit tests exercise each.
- **v2 drand responses omit `randomness`.** Deriving it as `SHA-256(signature)` is correct, but there is then nothing published to compare against. This lab keeps the v1 value for that comparison.
- **Threshold collusion.** If at least t drand members collude they can compute rounds early; uniqueness still holds, unpredictability does not.

## Real-World Usage

- **NIST Randomness Beacon** (`beacon.nist.gov`), Version 2.0 Beta, described in NISTIR 8213 (Draft); used for public demonstrations of verifiable randomness and as one input in combined-beacon designs.
- **drand / League of Entropy** (`api.drand.sh`): `default` since 2020, `quicknet` since 2023. Used for timelock encryption (tlock), leader election, and on-chain randomness.

## How to Run Locally

`​``sh
npm ci
npm run dev          # http://localhost:5173/crypto-lab-pulse-chain/
npm test             # Vitest: unit tests and KATs
npm run build        # both typechecks, then vite build
npx playwright install chromium   # never --with-deps
npm run test:a11y    # every Playwright spec: WCAG gate + claims suite
npm run mutate       # mutation runner (slow; ~10 min)
node scripts/live-check.mjs       # ask the live beacons whether the pinned facts still hold
`​``

The Playwright preview runs on port **4717**. If your machine's pre-installed Chromium differs from the pinned Playwright build, set `PW_CHROMIUM=/path/to/chrome`; CI never sets it.

## Related Demos

- [crypto-lab-beacon-lock](https://systemslibrarian.github.io/crypto-lab-beacon-lock/): timelock encryption to a future drand quicknet round.
- [crypto-lab-icy-dvrf](https://systemslibrarian.github.io/crypto-lab-icy-dvrf/): the same four-property split for a distributed VRF.
- [crypto-lab-dkg-gate](https://systemslibrarian.github.io/crypto-lab-dkg-gate/): distributed key generation, which replaces Act 6's trusted dealer.
- [crypto-lab-vrf-gate](https://systemslibrarian.github.io/crypto-lab-vrf-gate/): verifiable random functions.

## Build & Verify

| Suite | Count | What it checks |
|---|---|---|
| Vitest (`npm test`) | **52 tests** | 56 real NIST pulses under both layouts, 2 certificates, RSA verify and recovery, hash chain, precommitment, skiplist; 13 real drand rounds by pairing and randomness; threshold toy; byte and DER helpers |
| Spec KATs | 7 vectors | RFC 9380 Appendix J.9.1 hash-to-G1 (5), FIPS 180-4 SHA-512 and SHA-256 "abc" (2), in `src/fixtures/kat.json` |
| Claims suite (`e2e/claims.spec.ts`) | **30 tests** | Headline values re-derived in Node by an independent route; every failure code reached through its control; retirement and a no-op guard; the §4.1d negative claim |
| a11y gate (`e2e/a11y.spec.ts`) | 2 tests (1280px and 380px), 31 scanned states each | axe WCAG 2.1 A/AA (violations and incomplete), arithmetic text contrast, non-text contrast (empty baseline), reflow at 380px, keyboard-reachable scrollers, no invisible focus targets |
| Mutation runner (`npm run mutate`) | **16 mutations, 16 killed** | Concrete patches with owning tests; a kill requires the owner to pass unmutated in the same run, the patch to apply, the bundle hash to move, and the mutant to build |

Fixtures: `src/fixtures/nist.json` (captured from `beacon.nist.gov` on 2026-10-01), `src/fixtures/drand.json` (captured from `api.drand.sh` on 2026-10-01, with each round's v1 `randomness`), `src/fixtures/kat.json`. Nothing in them is computed by the lab.

The e2e directory has its own `tsconfig.e2e.json`. The gate files are copied from `crypto-lab-schnorr-forge`, which is written without `noUncheckedIndexedAccess`, and the lab's own source keeps that stricter setting. `npm run build` typechecks both.

CI (`.github/workflows/`): `deploy.yml` runs unit tests and builds on supported Node 22/24, then every Playwright spec before deploying, and gates and auto-merges non-major grouped Dependabot bumps. Major bumps stay open for human review. `mutation.yml` runs the mutation runner on changes to `src/`, `e2e/` or the runner itself. `live-check.yml` runs the drift check weekly.

## Performance

A BLS12-381 pairing in pure JavaScript takes tens of milliseconds, and Act 5 computes two per verification. Act 6 deals five G2 key shares and verifies each partial on demand. RSA verification goes through WebCrypto and is asynchronous, so Acts 2 and 4 render when their verifications resolve. The page marks `#exhibits[data-ready]` once all of them have.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Good Randomness

- **slug**: `crypto-lab-good-randomness`
- **repo**: https://github.com/systemslibrarian/crypto-lab-good-randomness
- **live**: https://systemslibrarian.github.io/crypto-lab-good-randomness/
- **commit_sha**: `41d4bdb0ca7b3601ee000a4fa07975531020df65` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `24a6c99951f99b30624c80653a34d40830a630ab`
- **read_from**: working tree (clean)
- **category**: RANDOMNESS  ·  **level**: beginner  ·  **--accent**: #9f88ff
- **MISSING FIELDS**: verification

**Name (H1)**: Good Randomness  — _read from index.html_

**Subtitle**: CSPRNG · seeds · why a guessable key is no key  — _read from index.html_

**Description**: See why looking random is not enough. Compare a key generated by the browser with one generated from a four-digit PIN. Both pass the same checks. Try all 10,000 PINs to recover the predictable key.  — _read from index.html_

**Why it matters**: Every secret you have rests on a number nobody can guess. Real TLS and SSH hosts have shipped keys that were guessable anyway, with nothing wrong in the cryptography and nothing visibly wrong in the keys.  — _read from index.html_

**Card copy**: Two 32-byte keys pass the same look-random checks — one from the browser&rsquo;s generator, one from a ChaCha20 stream started at a four-digit PIN. Then the second is rebuilt by counting to ten thousand, while every check still reports success.

**Chips**: ChaCha20 · CSPRNG · Seed Recovery · WebCrypto

**Implements**: AES `src/crypto/cipher.ts:29`, AES-GCM `src/crypto/cipher.ts:38`, ChaCha20 `src/crypto/chacha20.ts:86`, SHA-256 `src/crypto/seeded.ts:66`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: TLS 1.3 `src/crypto/chacha20.ts:15`

**References**: MD5, TLS 1.3

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 8439` — first seen README.md:17 (14×)

**README — What it does NOT prove**:

```text
The lab declares one **negative claim**, and demonstrates it rather than disclaiming it:

> Passing those four checks establishes nothing about whether a generator can be predicted.
> ChaCha20's output looks like this whether its key came from the operating system or from a
> four-digit PIN, and this page has just rebuilt one of the two from a number a stranger can
> count to.

It is scoped to the construction on the page — these four checks, this generator — and not to the
field. "No test of output can detect a weak seed" would be a stronger claim than this page
demonstrates.

Step 3's exhaustive search reaches a state where **every check the page performs reports success
and the key is recovered anyway**: all eight check rows in Step 2 read PASS, the decryption
works, the pinned RFC 8439 cases agree, and the verdict reads `PASSED EVERY CHECK — AND FULLY
RECOVERED`. There is no failure code to show, because there is no check there that could fail.
The absence of a code is the exhibit.

Three more things the lab is explicit about in-page:

- **A 256-bit key is not 256 bits of security.** Length is a ceiling on how many values are
  possible; it says nothing about how many the process could actually produce. Here: ten
  thousand.
- **Hashing a guessable seed buys nothing.** Source B's key *is* the SHA-256 of a PIN. Ten
  thousand inputs give ten thousand outputs; a slower hash makes ten thousand tries take longer
  and does not make them fewer.
- **The checks are real and they do work.** A separate panel runs the same four over a counter
  and watches two of them catch it — which is what makes their silence beside Source B
  informative rather than merely unhelpful. It also shows that an obviously broken generator
  still *passed* two of the four.
```

**README — What Can Go Wrong**:

```text
- **Seeding from the clock.** The failure this lab models most directly. If an attacker can
  narrow the moment to a day, that is 86 million milliseconds — fewer tries than a six-character
  password, against a key that is still 256 bits long.
- **Seeding from a PID, a counter, or a serial number.** Same shape, usually a smaller space.
- **Hashing the seed and calling it fixed.** Addressed in-page, because it is the most common
  objection: a hash spreads a value out, it does not create choices that were never there.
- **Falling back to `Math.random()` when WebCrypto is unavailable.** The exact defect this lab
  warns about, so `src/crypto/real.ts` throws rather than falling back, and the page reports the
  environment as unavailable instead of quietly carrying on.
- **Trusting a statistical test battery as evidence of a good seed.** It is evidence about
  output. A guessable seed is a property of the process.
- **A result that outlived its inputs.** Not a cryptographic failure, but the quiet way a demo
  starts lying: every verdict here records what it was computed from and is replaced by a
  retirement notice when that changes. One door the comparison cannot watch is a search still
  running while the keys are remade — a basis captured *after* the inputs moved is
  indistinguishable from one that never moved — so Step 2's button is held inert for the
  duration rather than the comparison being made cleverer.
- **A result reported for an experiment that never ran.** This page shipped with exactly that,
  and it is worth recording rather than quietly fixing. Recovering Source B set one flag, Step 2
  read that flag for *both* columns, and Source A was immediately stamped "ten thousand guesses
  found nothing here" with no Source A search having happened. A claims test even required that
  label — a test pinning the bug, which is the failure §4.1b names. Each column now carries its
  own result, a column with no result says `Not searched yet`, and `M8` restores the defect to
  keep the fix honest. In a lab whose whole argument is that a check which has not looked must
  not read like a check that looked and found nothing, it was the worst defect available.
- **Two machines with the same starting state.** Out of scope here and the subject of **Entropy
  Collapse**; this lab is the one that establishes why it matters.
```

**Claims tested** (e2e/claims.spec.ts, 53 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:142
    - :142 `toHaveAttribute` expected `'aria-valuenow', '10000'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:149
    - :149 `expect` expected _no expected value_ _(none)_
- `what the page says on arrival` — e2e/claims.spec.ts:153
- `the recipe box arrives holding a word, not an empty string` — e2e/claims.spec.ts:154
    - :160 `toHaveValue` expected `'monday'` _(literal)_
- `every number the prose quotes comes from the code, not from the sentence` — e2e/claims.spec.ts:163
    - :171 `expect` expected _no expected value_ _(none)_
    - :172 `toBe` expected `1` _(literal)_
    - :173 `toBe` expected `'10,000'` _(literal)_
    - :176 `toBe` expected `1` _(literal)_
    - :177 `toBe` expected `'4'` _(literal)_
    - :181 `toBe` expected `Number(spaces[0]!.replace(/,/g, ''))` _(expression)_
    - :185 `toHaveCount` expected `claimed` _(expression)_
- `the on-ramp says what is real and names the one thing that is deliberate` — e2e/claims.spec.ts:188
    - :196 `expect` expected _no expected value_ _(none)_
    - :197 `expect` expected _no expected value_ _(none)_
    - :198 `expect` expected _no expected value_ _(none)_
    - :200 `toMatch` expected `/four-digit PIN/` _(regex)_
    - :201 `toMatch` expected `/nonce is fixed at zero/` _(regex)_
    - :203 `expect` expected _no expected value_ _(none)_
- `nothing has been computed except the pinned cases` — e2e/claims.spec.ts:206
    - :209 `toBe` expected `'absent'` _(literal)_
    - :212 `toBeVisible` expected _no expected value_ _(none)_
- `Step 1: the dice, and what the second roll proves` — e2e/claims.spec.ts:216
- `the real dice are dice, and the bytes account for themselves` — e2e/claims.spec.ts:217
    - :221 `toBeVisible` expected _no expected value_ _(none)_
    - :224 `toHaveLength` expected `5` _(literal)_
    - :225 `expect` expected _no expected value_ _(none)_
    - :226 `expect` expected _no expected value_ _(none)_
    - :233 `expect` expected _no expected value_ _(none)_
    - :234 `toBe` expected `faces.length` _(expression)_
    - :237 `expect` expected _no expected value_ _(none)_
- `the same recipe gives the same dice, and the page compares them for you` — e2e/claims.spec.ts:240
    - :246 `toBeVisible` expected _no expected value_ _(none)_
    - :248 `toHaveCount` expected `0` _(literal)_
    - :252 `toBeVisible` expected _no expected value_ _(none)_
    - :253 `toHaveAttribute` expected `'data-tone', 'pass'` _(expression)_
    - :259 `toHaveLength` expected `5` _(literal)_
    - :260 `toEqual` expected `first` _(expression)_
    - :262 `expect` expected _no expected value_ _(none)_
    - :264 `expect` expected _no expected value_ _(none)_
    - :269 `expect` expected _no expected value_ _(none)_
- `a different recipe gives different dice` — e2e/claims.spec.ts:274
    - :284 `toEqual` expected `monday` _(expression)_
    - :286 `toContainText` expected `'tuesday'` _(literal)_
- `an empty recipe is refused, and the page names the cause` — e2e/claims.spec.ts:289
    - :295 `toHaveAttribute` expected `'data-tone', 'fail'` _(expression)_
    - :296 `toHaveText` expected `'NOTHING TO START FROM'` _(literal)_
    - :299 `toContainText` expected `'nothing here to be deterministic about'` _(literal)_
    - :301 `toHaveCount` expected `0` _(literal)_
- `Step 2: two keys, and the panel that must not give the game away` — e2e/claims.spec.ts:305
- `both columns pass all four checks, and each count matches its own rows` — e2e/claims.spec.ts:306
    - :322 `toBe` expected `4` _(literal)_
    - :323 `toBe` expected `4` _(literal)_
    - :324 `toHaveText` expected `'${passed} of ${total} checks passed'` _(expression)_
    - :327 `toMatch` expected `/\d/` _(regex)_
    - :333 `toBe` expected `'BOTH PASSED ALL 4 CHECKS'` _(literal)_
    - :338 `toHaveLength` expected `2` _(literal)_
    - :339 `toHaveLength` expected `64` _(literal)_
    - :340 `toBe` expected `tight(keys[0]!)` _(expression)_
- `the two columns are IDENTICAL in everything but their labels` — e2e/claims.spec.ts:343
    - :358 `toEqual` expected `shape[0]!.rowClasses` _(expression)_
    - :359 `toEqual` expected `shape[0]!.states` _(expression)_
    - :360 `toBe` expected `shape[0]!.colClass` _(expression)_
    - :361 `toBe` expected `0` _(literal)_
    - :362 `toBe` expected `0` _(literal)_
- `the panel carries NO verdict tone until Step 3 resolves it` — e2e/claims.spec.ts:365
    - :372 `toHaveAttribute` expected `'data-tone', 'neutral'` _(expression)_
    - :373 `toHaveCount` expected `0` _(literal)_
    - :374 `toHaveCount` expected `0` _(literal)_
    - :375 `toHaveCount` expected `0` _(literal)_
    - :377 `toContainText` expected `'Looking random is not evidence of anything'` _(literal)_
    - :382 `toHaveAttribute` expected `'data-tone', 'alarm'` _(expression)_
    - :383 `toHaveCount` expected `2` _(literal)_
    - :387 `toContainText` expected `pin` _(expression)_
    - :389 `toContainText` expected `'put there by Step 3, not by the checks'` _(literal)_
- `Source A is never reported as searched until it has been` — e2e/claims.spec.ts:406
    - :413 `toHaveText` expected `'Not searched yet'` _(literal)_
    - :414 `toContainText` expected `'found nothing'` _(literal)_
    - :416 `toHaveCount` expected `0` _(literal)_
    - :418 `expect` expected _no expected value_ _(none)_
    - :419 `expect` expected _no expected value_ _(none)_
    - :424 `toContainText` expected `'10,000 guesses found nothing here'` _(literal)_
- `the other order is just as truthful: Source A first` — e2e/claims.spec.ts:427
    - :436 `toContainText` expected _no expected value_ _(none)_
    - :439 `toHaveText` expected _no expected value_ _(none)_
    - :444 `toHaveAttribute` expected `'data-tone', 'neutral'` _(expression)_
    - :445 `toContainText` expected `'SOURCE A HELD — AND THAT SETTLES NOTHING'` _(literal)_
    - :448 `toHaveAttribute` expected `'data-tone', 'alarm'` _(expression)_
    - :449 `toContainText` expected _no expected value_ _(none)_
- `both results are retired together when the keys change` — e2e/claims.spec.ts:454
    - :460 `toHaveCount` expected `2` _(literal)_
    - :465 `toHaveCount` expected `0` _(literal)_
    - :466 `toHaveAttribute` expected _no expected value_ _(none)_
- `the obviously bad generator is caught, and the page counts what it still passed` — e2e/claims.spec.ts:472
    - :479 `toBeVisible` expected _no expected value_ _(none)_
    - :482 `toHaveAttribute` expected `'data-tone', 'held'` _(expression)_
    - :492 `toBe` expected `4` _(literal)_
    - :493 `expect` expected _no expected value_ _(none)_
    - :494 `toBe` expected `total` _(expression)_
    - :495 `toHaveText` expected _no expected value_ _(none)_
    - :498 `toContainText` expected `'still PASSED ${passing} of the ${total}'` _(expression)_
    - :513 `toHaveClass` expected `/check-row-bad/` _(regex)_
    - :514 `toHaveText` expected _no expected value_ _(none)_
    - :519 `toContainText` expected `'A check passing has never meant very much'` _(literal)_
- `the one-in-two guess names Source B either way, and refuses to congratulate` — e2e/claims.spec.ts:522
    - :530 `toHaveClass` expected `/pill-bad/` _(regex)_
    - :531 `toContainText` expected `'Source B is the seeded one'` _(literal)_
    - :532 `toContainText` expected `'Real keys arrive without headings'` _(literal)_
    - :535 `toHaveClass` expected `/pill-ok/` _(regex)_
    - :540 `toContainText` expected `'You read the label, not the bytes'` _(literal)_
    - :541 `toContainText` expected `'this was not a blind test'` _(literal)_
    - :542 `toContainText` expected `'one-in-two'` _(literal)_
- `Step 3: the recovery, checked by an independent route` — e2e/claims.spec.ts:546
- `the gate note names what is missing, and the controls are really inert` — e2e/claims.spec.ts:547
    - :554 `toContainText` expected `'Make the two keys in Step 2'` _(literal)_
    - :556 `toBeDisabled` expected _no expected value_ _(none)_
    - :559 `toBeHidden` expected _no expected value_ _(none)_
    - :561 `toBeEnabled` expected _no expected value_ _(none)_
- `exactly one of the four candidate PINs opens the message` — e2e/claims.spec.ts:565
    - :572 `toHaveLength` expected `4` _(literal)_
    - :579 `toBeVisible` expected _no expected value_ _(none)_
    - :585 `toHaveLength` expected `1` _(literal)_
    - :586 `toHaveLength` expected `3` _(literal)_
- `a wrong guess establishes NOTHING, and the page says so` — e2e/claims.spec.ts:589
    - :602 `toBeVisible` expected _no expected value_ _(none)_
    - :608 `expect` expected _no expected value_ _(none)_
    - :612 `toHaveAttribute` expected `'data-tone', 'neutral'` _(expression)_
    - :613 `toHaveText` expected `'REJECTED'` _(literal)_
    - :614 `toContainText` expected `'${missed} was not it'` _(expression)_
    - :615 `toContainText` expected `'not that the key is sound'` _(literal)_
    - :616 `toContainText` expected `'You have ruled out one number'` _(literal)_
    - :619 `toContainText` expected `'own integrity check'` _(literal)_
    - :620 `toContainText` expected `'Nothing compared it with the real key'` _(literal)_
    - :622 `toHaveCount` expected `0` _(literal)_
- `the recovered key is real: rebuilt and the message opened by OpenSSL` — e2e/claims.spec.ts:625
    - :632 `toMatch` expected `/^\d{4}$/` _(regex)_
    - :654 `toBe` expected `keyHex` _(expression)_
    - :658 `toBe` expected `plaintext` _(expression)_
    - :665 `toBe` expected `seededKeyOnScreen` _(expression)_
    - :668 `toHaveText` expected _no expected value_ _(none)_
    - :671 `toHaveAttribute` expected `'data-tone', 'alarm'` _(expression)_
- `the recovery reports its cost honestly: the try it hit on AND the whole space` — e2e/claims.spec.ts:674
    - :688 `toBe` expected `Number(pin) + 1` _(expression)_
    - :693 `toHaveAttribute` expected `'aria-valuemax', '10000'` _(expression)_
    - :694 `toHaveAttribute` expected `'aria-valuenow', '10000'` _(expression)_
    - :695 `toHaveText` expected `'10,000 of 10,000 tried'` _(literal)_
    - :696 `expect` expected _no expected value_ _(none)_
    - :699 `expect` expected _no expected value_ _(none)_
    - :710 `expect` expected _no expected value_ _(none)_
    - :711 `expect` expected _no expected value_ _(none)_
    - :712 `expect` expected _no expected value_ _(none)_
    - :714 `expect` expected _no expected value_ _(none)_
    - :715 `expect` expected _no expected value_ _(none)_
- `the same search against the real key finds nothing, and proves it did the work` — e2e/claims.spec.ts:718
    - :726 `toBeVisible` expected _no expected value_ _(none)_
    - :729 `toHaveAttribute` expected `'data-tone', 'held'` _(expression)_
    - :730 `toHaveText` expected `'NOTHING TO FIND'` _(literal)_
    - :735 `expect` expected _no expected value_ _(none)_
    - :736 `toHaveAttribute` expected `'aria-valuenow', '10000'` _(expression)_
    - :739 `expect` expected _no expected value_ _(none)_
    - :740 `expect` expected _no expected value_ _(none)_
    - :742 `toHaveCount` expected `0` _(literal)_
- `the negative claim: looking random establishes nothing` — e2e/claims.spec.ts:767
- `every check passes, and the key is recovered anyway` — e2e/claims.spec.ts:768
    - :776 `toBeVisible` expected _no expected value_ _(none)_
    - :782 `toHaveCount` expected `0` _(literal)_
    - :783 `toHaveCount` expected `0` _(literal)_
    - :800 `toHaveCount` expected `4` _(literal)_
    - :801 `toHaveCount` expected `4` _(literal)_
    - :802 `toHaveCount` expected `0` _(literal)_
    - :805 `toHaveCount` expected `4` _(literal)_
    - :807 `toHaveAttribute` expected `'data-tone', 'pass'` _(expression)_
    - :810 `expect` expected _no expected value_ _(none)_
    - :815 `toBeVisible` expected _no expected value_ _(none)_
    - :816 `toContainText` expected `'establishes nothing about whether a generator can be predicted'` _(literal)_
    - :817 `toContainText` expected `'four-digit PIN'` _(literal)_
    - :818 `expect` expected _no expected value_ _(none)_
    - :827 `toContainText` expected `'no error code to show you here'` _(literal)_
    - :828 `toContainText` expected `'Nothing failed'` _(literal)_
- `the recap states the limit as a rule, not only as this one result` — e2e/claims.spec.ts:831
    - :837 `toHaveCount` expected `4` _(literal)_
    - :840 `toHaveLength` expected `3` _(literal)_
    - :841 `expect` expected _no expected value_ _(none)_
    - :844 `toContainText` expected `'The output looks random'` _(literal)_
    - :845 `toContainText` expected `'how many keys could have been produced'` _(literal)_
- `a result always describes inputs that are still on screen` — e2e/claims.spec.ts:849
- `making the keys again supersedes everything downstream` — e2e/claims.spec.ts:850
    - :858 `toBe` expected `'fresh'` _(literal)_
    - :859 `toBe` expected `'fresh'` _(literal)_
    - :866 `toBe` expected `'stale'` _(literal)_
    - :867 `toBe` expected `'stale'` _(literal)_
    - :868 `toContainText` expected `'OUT OF DATE'` _(literal)_
    - :870 `toContainText` expected `'Search again'` _(literal)_
    - :874 `toBe` expected `'fresh'` _(literal)_
- `changing the recipe retires the roll it was about` — e2e/claims.spec.ts:877
    - :881 `toBe` expected `'fresh'` _(literal)_
    - :884 `toBe` expected `'stale'` _(literal)_
    - :886 `toContainText` expected _no expected value_ _(none)_
- `re-entering the SAME recipe does not retire a fresh result` — e2e/claims.spec.ts:891
    - :895 `toBe` expected `'fresh'` _(literal)_
    - :899 `toBe` expected `'fresh'` _(literal)_
    - :906 `toBe` expected `'fresh'` _(literal)_
- `nothing can move the ground under a running search` — e2e/claims.spec.ts:909
    - :921 `toHaveAttribute` expected `'aria-busy', 'true'` _(expression)_
    - :923 `toBeDisabled` expected _no expected value_ _(none)_
    - :930 `toHaveAttribute` expected `'aria-busy', 'true'` _(expression)_
    - :932 `toBeEnabled` expected _no expected value_ _(none)_
- `the finish link waits for BOTH halves of Step 3` — e2e/claims.spec.ts:936
    - :943 `toHaveCount` expected `0` _(literal)_
    - :946 `toBeVisible` expected _no expected value_ _(none)_
- `a [hidden] element really is not rendered` — e2e/claims.spec.ts:949
    - :960 `toEqual` expected `[]` _(expression)_
- `what one attempt looks like` — e2e/claims.spec.ts:964
- `the attacker is shown what it was handed BEFORE it runs` — e2e/claims.spec.ts:965
    - :968 `toHaveCount` expected `0` _(literal)_
    - :973 `toBeVisible` expected _no expected value_ _(none)_
    - :975 `toBeVisible` expected _no expected value_ _(none)_
    - :976 `toContainText` expected `'no key, no PIN, no message'` _(literal)_
- `a rejected guess shows the key it really built` — e2e/claims.spec.ts:979
    - :990 `toBeVisible` expected _no expected value_ _(none)_
    - :996 `expect` expected _no expected value_ _(none)_
    - :1004 `toHaveLength` expected `64` _(literal)_
    - :1009 `toBe` expected `built` _(expression)_
    - :1015 `toBe` expected `real` _(expression)_
- `the comparison that is the remedy` — e2e/claims.spec.ts:1019
- `names the decision row, and scopes what the null result proves` — e2e/claims.spec.ts:1020
    - :1031 `toHaveCount` expected `5` _(literal)_
    - :1040 `toHaveLength` expected `2` _(literal)_
    - :1041 `toBe` expected `cells[1]` _(expression)_
    - :1044 `toBe` expected `started[1]` _(expression)_
    - :1046 `toContainText` expected `'keep the encryption, change where the key starts'` _(literal)_
    - :1051 `toContainText` expected `'Only one row describes a decision'` _(literal)_
    - :1052 `toContainText` expected `'One row differs'` _(literal)_
    - :1059 `toBe` expected `2` _(literal)_
    - :1063 `toContainText` expected _no expected value_ _(none)_
- `the comparison is not drawn before both halves exist` — e2e/claims.spec.ts:1068
    - :1077 `toHaveCount` expected `0` _(literal)_
- `the pinned cases, and what they are allowed to claim` — e2e/claims.spec.ts:1081
- `the headline counts its own rows, and separates published from derived` — e2e/claims.spec.ts:1082
    - :1096 `toBe` expected `rows` _(expression)_
    - :1097 `toBe` expected `ok` _(expression)_
    - :1098 `toBe` expected `Number(total)` _(expression)_
    - :1099 `toHaveAttribute` expected `'data-tone', 'pass'` _(expression)_
    - :1105 `toBe` expected `rows` _(expression)_
    - :1106 `expect` expected _no expected value_ _(none)_
    - :1107 `toContainText` expected `'${published} of the ${rows} are published vectors'` _(expression)_
    - :1108 `toContainText` expected `'The other ${derived} are this lab’s own'` _(expression)_
- `the must-differ half exists, and says what it is for` — e2e/claims.spec.ts:1111
    - :1118 `expect` expected _no expected value_ _(none)_
    - :1119 `expect` expected _no expected value_ _(none)_
    - :1120 `toContainText` expected _no expected value_ _(none)_
- `the source is RFC 8439, and the page admits the transcription was checked` — e2e/claims.spec.ts:1125
    - :1130 `expect` expected _no expected value_ _(none)_
    - :1131 `toHaveAttribute` expected _no expected value_ _(none)_
    - :1138 `expect` expected _no expected value_ _(none)_
    - :1139 `expect` expected _no expected value_ _(none)_
- `the vocabulary this lab deliberately does not use` — e2e/claims.spec.ts:1151
- `counts tries, and never quotes entropy or a test battery` — e2e/claims.spec.ts:1152
    - :1175 `expect` expected _no expected value_ _(none)_
    - :1178 `expect` expected _no expected value_ _(none)_
    - :1179 `expect` expected _no expected value_ _(none)_
- `does not teach that determinism is the defect` — e2e/claims.spec.ts:1182
    - :1190 `expect` expected _no expected value_ _(none)_
    - :1191 `expect` expected _no expected value_ _(none)_
    - :1195 `toContainText` expected _no expected value_ _(none)_
- `never claims that hashing a guessable seed helps` — e2e/claims.spec.ts:1200
    - :1209 `expect` expected _no expected value_ _(none)_
    - :1212 `expect` expected _no expected value_ _(none)_
    - :1217 `expect` expected _no expected value_ _(none)_
    - :1218 `expect` expected _no expected value_ _(none)_
    - :1219 `expect` expected _no expected value_ _(none)_
    - :1224 `expect` expected _no expected value_ _(none)_
    - :1225 `expect` expected _no expected value_ _(none)_
    - :1228 `expect` expected _no expected value_ _(none)_
    - :1229 `expect` expected _no expected value_ _(none)_
- `the real-world line is scoped to what really happened` — e2e/claims.spec.ts:1232
    - :1237 `expect` expected _no expected value_ _(none)_
    - :1238 `expect` expected _no expected value_ _(none)_
    - :1240 `expect` expected _no expected value_ _(none)_

**Mutation records** (1 file(s)):

- `mutations/mutations.json` (21713 bytes)

<details><summary>Full README</summary>

```markdown
# Good Randomness

A key is only a secret because nobody can guess it. This lab draws one 32-byte key from the
browser's own CSPRNG (**`crypto.getRandomValues`**) and another from a real **ChaCha20** stream
started at a four-digit PIN, runs the same look-random checks over both — all four pass, on both
— and then recovers the second key by trying all 10,000 possible PINs.

**Live demo:** <https://systemslibrarian.github.io/crypto-lab-good-randomness/>

---

## What It Is

A beginner's on-ramp to the thing every later lab assumes you already accept: that the step where
a key is generated is not a formality.

The exact primitives are **ChaCha20** (RFC 8439 §2.3, 20 rounds, 256-bit key, 96-bit nonce,
32-bit counter) hand-rolled in `src/crypto/chacha20.ts`; **`crypto.getRandomValues`** (Web
Cryptography API) as the real source; **SHA-256** and **AES-256-GCM** through the browser's own
`crypto.subtle`. The cipher is hand-rolled rather than imported because it is the teaching
subject, and a reader has to be able to open the file and see that nothing is pretending.

**The problem it addresses.** A generator that starts from a guessable seed produces guessable
keys, and nothing about the output looks wrong. Not to the eye, not to a check of the bytes, not
to a statistical battery. The failure is invisible in exactly the place people look for it.

**The security model.** Everything is per-session and in memory. No backend, no network calls, no
storage — the only thing this page writes to `localStorage` is the theme pin. Reloading destroys
both keys and the PIN behind one of them.

**Not production crypto — a teaching demo.** Two things here are deliberately not what a working
system would do, and the page says both in its own words rather than only here:

- the predictable generator's seed is a **four-digit PIN**, so the recovery finishes in under a
  second in front of you;
- its **nonce is fixed at zero**, so one seed means one keystream and the recovery is possible at
  all. A random nonce would close that particular hole and leave the lesson untouched — the key
  would still be ten thousand guesses wide — so the page does not offer it as the remedy.

The remedy it does name is the real one: get the starting point from the operating system.

### What it does NOT prove

The lab declares one **negative claim**, and demonstrates it rather than disclaiming it:

> Passing those four checks establishes nothing about whether a generator can be predicted.
> ChaCha20's output looks like this whether its key came from the operating system or from a
> four-digit PIN, and this page has just rebuilt one of the two from a number a stranger can
> count to.

It is scoped to the construction on the page — these four checks, this generator — and not to the
field. "No test of output can detect a weak seed" would be a stronger claim than this page
demonstrates.

Step 3's exhaustive search reaches a state where **every check the page performs reports success
and the key is recovered anyway**: all eight check rows in Step 2 read PASS, the decryption
works, the pinned RFC 8439 cases agree, and the verdict reads `PASSED EVERY CHECK — AND FULLY
RECOVERED`. There is no failure code to show, because there is no check there that could fail.
The absence of a code is the exhibit.

Three more things the lab is explicit about in-page:

- **A 256-bit key is not 256 bits of security.** Length is a ceiling on how many values are
  possible; it says nothing about how many the process could actually produce. Here: ten
  thousand.
- **Hashing a guessable seed buys nothing.** Source B's key *is* the SHA-256 of a PIN. Ten
  thousand inputs give ten thousand outputs; a slower hash makes ten thousand tries take longer
  and does not make them fewer.
- **The checks are real and they do work.** A separate panel runs the same four over a counter
  and watches two of them catch it — which is what makes their silence beside Source B
  informative rather than merely unhelpful. It also shows that an obviously broken generator
  still *passed* two of the four.

## Exhibits

1. **Step 1 — Dice, then a computer.** Five dice from `crypto.getRandomValues`, with the byte
   accounting printed beside them: how many bytes were drawn and how many were discarded to keep
   every face equally likely. (`byte % 6` is biased — 256 is not a multiple of 6 — so bytes at or
   above 252 are thrown away and the page says so.) Then the same five dice from a *recipe*: type
   a word, press the button twice, get the identical roll. No definition of "seed" anywhere; the
   repeat is the definition.
2. **Step 2 — Two keys, and no way to tell them apart.** Both 32 bytes, side by side in identical
   unmarked boxes, with four plain-language checks run over each: not all the same, not just
   counting, no value more than three times in a row, not lopsided. Every row prints what it
   *measured*, not just a verdict. Both columns pass all four. **The panel carries no colour at
   all** until Step 3 resolves it.
3. **Step 2a — Do those checks do anything?** The same four, run over a counter. Two of them
   catch it and name the pattern.
4. **Step 2b — Which one is guessable?** A one-in-two guess, and the page says it is one in two
   whichever way you answer.
5. **Step 3 — Your guess first.** The seeded generator started at one of four candidate PINs,
   shown on the page. Pick one. A hit rebuilds the key and opens the message; a miss is painted
   *neutral*, because ruling out one number establishes nothing.
6. **Step 3a — Now stop guessing.** All ten thousand PINs, counted out loud against a live
   progress bar. It reports both the try it hit on *and* the cost of the whole space, because a
   PIN of 0000 would otherwise be found on try 1 and the headline would undersell the point by
   four orders of magnitude.
7. **Step 3b — The same search against the real key.** Identical code, identical ten thousand
   candidates, identical work — and nothing found, because Source A did not come from that small
   list of starting points. The page also checks that the message still opens under the key that
   sealed it, so the failure is demonstrably the search's and not the cipher's, and it says
   plainly that *this* attack found nothing rather than that none could.
8. **The repair, as a comparison.** Finishing both halves draws a five-row table: same cipher,
   same key length, same four checks passed — and one row that differs, which is where the key
   started. Keep the encryption, change the starting point. It is not drawn until both
   experiments have actually run.
9. **The repaint.** The moment a recovery succeeds, Step 2 re-renders and marks the column it
   recovered. The thing you could not read becomes readable only after something else told you
   the answer. That is the page's central mechanism, and it cannot be undone without a reload.
   **Each column reports only its own experiment**: the one that has not been searched says
   `Not searched yet`, in words and a hueless mark, and the panel is truthful in whichever order
   the two searches are run.
10. **The recap.** Four observations about a generator, each with what it establishes and what it
    does not, plus four applied questions — the last of which exists to say that determinism is
    not the defect.
11. **The pinned cases.** Ten known-answer checks run in your browser on arrival — see Build &
    Verify.

## When to Use It

- Use it as the first thing someone meets about key generation, because it answers "why does the
  seed matter" by letting them take a key rather than by asserting it.
- Use it to settle the 256-bit confusion, because the lab makes "length is not strength" a
  measurement rather than a slogan.
- Use it to retire "but our RNG passes its statistical tests", because the output on this page
  would pass any battery you ran at it and its key took ten thousand tries.
- Use it before **Entropy Collapse**, which is the same failure at the scale of real machines.
- **Do NOT use it** as a guide to building anything. The fixed nonce and the four-digit seed are
  there to make a lesson visible in one second, and a system built that way is broken.

## Live Demo

<https://systemslibrarian.github.io/crypto-lab-good-randomness/>

Roll five dice, then roll five more from a word you type — twice, and get the same five. Make two
keys and try to tell them apart from the bytes; you cannot, and neither can the four checks. Pick
one of four PINs and see whether you get lucky. Then let the page try all ten thousand, watch the
counter run, and read the message that comes out. Run the same search against the other key and
watch it find nothing. Everything runs in your browser; nothing is sent anywhere.

## What Can Go Wrong

- **Seeding from the clock.** The failure this lab models most directly. If an attacker can
  narrow the moment to a day, that is 86 million milliseconds — fewer tries than a six-character
  password, against a key that is still 256 bits long.
- **Seeding from a PID, a counter, or a serial number.** Same shape, usually a smaller space.
- **Hashing the seed and calling it fixed.** Addressed in-page, because it is the most common
  objection: a hash spreads a value out, it does not create choices that were never there.
- **Falling back to `Math.random()` when WebCrypto is unavailable.** The exact defect this lab
  warns about, so `src/crypto/real.ts` throws rather than falling back, and the page reports the
  environment as unavailable instead of quietly carrying on.
- **Trusting a statistical test battery as evidence of a good seed.** It is evidence about
  output. A guessable seed is a property of the process.
- **A result that outlived its inputs.** Not a cryptographic failure, but the quiet way a demo
  starts lying: every verdict here records what it was computed from and is replaced by a
  retirement notice when that changes. One door the comparison cannot watch is a search still
  running while the keys are remade — a basis captured *after* the inputs moved is
  indistinguishable from one that never moved — so Step 2's button is held inert for the
  duration rather than the comparison being made cleverer.
- **A result reported for an experiment that never ran.** This page shipped with exactly that,
  and it is worth recording rather than quietly fixing. Recovering Source B set one flag, Step 2
  read that flag for *both* columns, and Source A was immediately stamped "ten thousand guesses
  found nothing here" with no Source A search having happened. A claims test even required that
  label — a test pinning the bug, which is the failure §4.1b names. Each column now carries its
  own result, a column with no result says `Not searched yet`, and `M8` restores the defect to
  keep the fix honest. In a lab whose whole argument is that a check which has not looked must
  not read like a check that looked and found nothing, it was the worst defect available.
- **Two machines with the same starting state.** Out of scope here and the subject of **Entropy
  Collapse**; this lab is the one that establishes why it matters.

## Real-World Usage

ChaCha20 is the stream cipher in TLS 1.3 and WireGuard; `crypto.getRandomValues` is what your
browser uses for its own key generation, sitting on the operating system's generator, which is
seeded from physical events the machine measured.

Real TLS and SSH hosts have shipped duplicate and guessable keys, with no flaw in the
cryptography and nothing visibly wrong in the keys themselves — the generators simply had too
little to start from. The page states that once, in the recap, and hands off to
[Entropy Collapse](https://systemslibrarian.github.io/crypto-lab-entropy-collapse/) rather than
claiming to demonstrate it here.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-good-randomness.git
cd crypto-lab-good-randomness
npm install
npm run dev
`​``

No environment variables are required. `npm run build` re-derives the pinned vectors with an independent
implementation, typechecks, and builds — in that order, so a bad vector cannot reach a bundle;
`npm test` runs the unit suite; `npm run test:a11y` and `npm run test:claims` run the two browser
suites against the production build.

## Build & Verify

**68 unit tests** (8 files) + **41 claims tests** + **3 accessibility drives** + **10 pinned
vectors re-derived by an independent implementation on every build** + **10 mutations, all
killed**.

**Correctness, in three independent layers.**

- `src/crypto/chacha20.test.ts` runs the **published RFC 8439 vectors** — §2.3.2, §2.4.2 and the
  five Appendix A.1 block vectors — plus three cases this lab derives itself, each taking the
  §2.3.2 case and changing exactly one input so the answer *must* change. That half has the
  teeth: an implementation ignoring its nonce reproduces four of the five Appendix A.1 vectors,
  because their nonces are all zero.
- `src/crypto/recover.test.ts` is the one the build brief calls the real test. From the sealed
  message alone — no key, no seed, no plaintext — it recovers the seed, rebuilds the key, opens
  the message, and then runs **the same search against a `crypto.getRandomValues` key in the same
  test** and gets nothing. A build where the search was broken fails the first half; a build
  where the cipher opened anything fails the second.
- `src/crypto/real.test.ts` asserts the real source **structurally and never statistically** — 32
  bytes, drawn from `crypto.getRandomValues` (observed with a spy, so a silent fall-back to
  `Math.random()` fails), a different answer each call. A test that asserted the randomness of a
  random source would be flaky by construction, and saying so is part of what the lab teaches.

**On the pinned vectors, and a transcription that was wrong.** The RFC 8439 cases in
`src/crypto/vectors.json` were transcribed by hand, and **one of them was wrong** — the tail of
Appendix A.1 vector 4, from offset 44 onward. A unit test comparing this lab's cipher against a
bad vector reports a failure and cannot say which side is at fault. So `scripts/check-vectors.mjs`
re-derives every committed value with **Node's OpenSSL ChaCha20**, an implementation sharing not
one line with this repository. It is the first thing `npm run build` does, so every build and
every browser suite runs it, and CI *also* runs it as its own named step before the typecheck —
which is not redundant: as a named step it fails saying `Pinned vectors` rather than failing
inside a step called `Build`. A failure there means the *data* is wrong; a failure in the unit
suite means the *lab* is, and that split is what caught the bad transcription.
The script pins its own oracle first: OpenSSL's `chacha20` takes a 16-byte IV (a little-endian
counter followed by the nonce) where the RFC states a separate counter word, so it checks the
§2.3.2 case and exits with a distinct code if its own packing is wrong, rather than reporting ten
transcription errors.

**The claims suite** (`e2e/claims.spec.ts`, 41 tests) checks what the page *says*. The strongest
is an independent re-derivation: with the PIN, the nonce and the ciphertext all on screen, the
test rebuilds the key with **OpenSSL's ChaCha20** and opens the message with **OpenSSL's
AES-256-GCM**, through `node:crypto`. A build whose hand-rolled cipher was wrong in a
self-consistent way would pass every other test here and fails that one. It also asserts what the
brief rules *out*: the page carries no entropy figure, no min-entropy, no test-battery name.

**The accessibility gate.** `@axe-core/playwright` scans the production build for zero WCAG 2.1
A/AA violations at **1280, 390 and 320 px**, and the Pages deploy is blocked if it fails. The
oracle engines in `e2e/contrast.ts` and `e2e/nontext.ts` are the reference implementation the
build standard names, carried across code-identical — including its per-side `paintedSides`
border measurement — with every passage that describes a page rewritten for this one.

**One inherited claim was checked rather than copied, and it was false here.** The reference
`contrast.ts` opens by saying axe cannot resolve a `color-mix()` backdrop, so a violations-only
gate measures almost nothing. Driven to the state carrying the most `color-mix()` surfaces on this
page, `axe.incomplete` came back **empty** — no ids, no nodes — and a degraded `--held-text` was
then reported by axe as a `color-contrast` *violation*, eleven nodes, not as an undecided one.
axe-core 4.12 resolves these fills. The arithmetic walk is kept as a second independent
implementation, which is worth having for its own reasons — two oracles agreeing beats one, and
axe's willingness to resolve a backdrop is a property of an axe version a bump can change — and
`contrast.ts`, `gate.ts` and `nontext-baseline.ts` now say that instead of the inherited sentence.

**The gate found one real defect**, fixed in `src/style.css` with the measurement beside it: an
operable control on a **tinted** surface. The copy button inside each key column sits on
`--surface-2` until Step 3 marks the columns, at which point the background becomes a
`color-mix()` of a tone and that surface. At the `--control-border` the reference stylesheet
carries, `#626d7a` — which clears the plain surface by three hundredths, 3.03:1 — that tint took
it under, and the gate named `button.btn.btn-quiet.copy-btn` at 2.62:1 and 2.57:1 at all three
widths. The token is now `#727e8c`: 3.27:1 against the worse of those backdrops, 3.85:1 against
the plain surface. Raising the token was the right fix rather than reducing the tint, because the
tint is what Step 3 uses to say which column it recovered.

Both oracles were then **proved live** rather than inferred from a green run, because an empty
finding set is also what an oracle that never ran produces — which is the whole reason the build
standard requires this step:

| Oracle | Degradation | Build | CSS hash | Reported |
|---|---|---|---|---|
| `nontext.ts` | `--control-border` → `#2b3440` | succeeded | `fa261d50de5e6` → `3bda675adfd69` | `textarea#recipe` and `button#check-broken.btn` at 1.37:1, eight `button.check-opt` at 1.27:1, against a required 3:1 |
| `contrast.ts` | `--held-text` → `#4a6c8f` | succeeded | `fa261d50de5e6` → `e4461fc5eb8f1` | `2.65:1 (needs 4.5:1) span.verdict-headline — fg rgb(74, 108, 143) on rgb(32, 42, 54)`, where that backdrop is the composited `color-mix()` result |

Both returned to `fa261d50de5e6` on restore, which is the hash `md5 dist/assets/*.css` prints on
`main` today — so the record is checkable rather than merely recorded. Both proofs are re-run
whenever the stylesheet changes; a record pointing at a hash nobody can reproduce would be worse
than no record.

**The mutation ledger — proof the tests bite.** A green suite is not evidence until you have
watched it fail. `mutations/mutations.json` records each mutation as a **concrete patch** — a
file, an anchor that must occur exactly once, and its replacement — and `npm run mutations`
applies them one at a time, enforcing all four kill rules: the owning test **passed unmutated in
the same run**; the patch **changed the file**; the run **served the mutated code** (the bundle
hash moved, *and* the red run is not a build or server failure); and a patch that does not compile
is **DOES NOT BUILD** and is never a kill.

`mutations/LEDGER.md` and `LEDGER.json` are written by the runner. **Every `observed` line in them
was written by the run that produced it, never typed.**

| Mutation | Verdict | Outcome |
|---|---|---|
| the recovery claims success without decrypting | `recovered` | KILLED |
| the recovery claims failure after a real decryption | `recovered` | KILLED |
| a look-random check is hard-wired to pass | `visible-pattern` | KILLED |
| the seeded generator is quietly swapped for the CSPRNG | `recovered` | KILLED |
| the negative-claim text is deleted | `recovered` | KILLED |
| a check inside the negative-claim fixture is broken | `recovered` | KILLED |
| the real-key panel searches the seeded ciphertext | `no-seed` | KILLED |
| Source A borrows Source B's result | `look-random` | KILLED |
| the comparison is drawn before both halves exist | `no-seed` | KILLED |
| a rejected guess discloses the wrong key | `guess` | KILLED |

The first four are the ones the build brief names. The next two are what §4.1d requires of any
negative claim: delete the claim text and the assertion that it is on screen must fail; break a
check inside the fixture and the assertion that everything is green must fail. A negative-claim
test that survives both is decorative.

The seventh is the one wiring defect on this page that would be genuinely dangerous: the real-key
panel pointed at the wrong ciphertext, so the page reports that a key from
`crypto.getRandomValues` fell to a four-digit PIN — the exact opposite of what the lab teaches, in
the lab's own voice. No unit test can see it, because nothing cryptographic is wrong.

**One verdict has no mutation of its own, and the ledger says why rather than leaving the gap
unexplained.** Step 1's determinism verdict is the first claim the lab makes, so it was the
obvious eighth entry. It was tried: replacing the comparison with `const identical = true` built
cleanly and the owning test **passed**, because on a correct build the two rolls really are
identical and the page renders exactly what it renders now. That is §4.1c's "the branch may be
unreachable" case — evidence about the source rather than about the tests. The build in which
that verdict could lie is one whose generator is not deterministic, and M4 is that build: driven
under it, Step 1 renders `THE DICE CHANGED` in the alarm tone, confirmed by running it. The
verdict is covered by the mutation that can actually reach it, and an eighth entry that could
only ever be recorded as SURVIVED would make the kill count worse evidence, not better.

The ledger is **enforced, not archived**. Each claims test records the (test, marker) pair it
actually asserted, and an `afterAll` in that spec fails any full claims run in which a recorded
kill's own test ran without asserting the marker the record names — so a kill can only stay
recorded while the assertion that produced it still exists. That enforcement was itself proved by
corrupting one record's marker and re-running: the suite failed naming
`M3-look-random-check-hardwired-to-pass` **while every test passed**, which is the right
subject for a false record. Restored, the suite is green again.

## Performance

The whole ten-thousand-candidate search is 10,000 SHA-256 digests, 10,000 ChaCha20 blocks and
10,000 AES-GCM attempts. **The page prints the figure it measured, on the machine it ran on, and
that is the only number to trust** — the spread is wide. Headless Chromium on the development
machine reports around a quarter of a second; a reviewer running it elsewhere measured 13.2
seconds for the same sweep. Both are honest, neither is a promise, and the lesson survives either
way — arguably landing harder at thirteen seconds, because that is still the whole space.

## Pending central assignment

Three values ship as marked placeholders because the catalog pins them centrally, and `brief.md`
defers all three:

- **`--accent`** is the fallback the build standard documents, `#35d6bb`, set in `src/style.css`
  and commented as a placeholder. The shared top bar reads it.
- **The favicon emoji** is a die, in `index.html`.
- **The category** is not set anywhere in this repository; it belongs on the catalog card.

Also owed to the catalog, and not done from here: the card itself, the
`tools/playwright-ports.json` pin for port **4213**, and the `tools/dispatch-census.json` row —
`dispatch-sync check` reports this lab as `UNPINNED-LAB` until that row exists.

## Related Demos

- [Entropy Collapse](https://systemslibrarian.github.io/crypto-lab-entropy-collapse/) — the same
  failure on real machines: restore one DRBG state onto two and watch both emit identical secrets.
- [Corrupted Oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/) — a
  generator sabotaged on purpose, beside two honest ones.
- [DRBG Arena](https://systemslibrarian.github.io/crypto-lab-drbg-arena/) — how the approved
  generators are actually built, seed through reseed.
- [Noise to Numbers](https://systemslibrarian.github.io/crypto-lab-noise-to-numbers/) — where the
  first unguessable bits come from, and how a physical source is assessed.
- [Locks and Keys](https://systemslibrarian.github.io/crypto-lab-locks-and-keys/) — what the keys
  are then used for.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Prime Witness

- **slug**: `crypto-lab-prime-witness`
- **repo**: https://github.com/systemslibrarian/crypto-lab-prime-witness
- **live**: https://systemslibrarian.github.io/crypto-lab-prime-witness/
- **commit_sha**: `8b65d6dd1b5e1518e622c69db158c1ac0c211bb8` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `ee471f97ee88b2bfe51202fb1360094ca93a1693`
- **read_from**: working tree (clean)
- **category**: RANDOMNESS | ATTACKS  ·  **level**: intermediate  ·  **--accent**: #93dbb4
- **MISSING FIELDS**: verification

**Name (H1)**: '+escape(title)+'  — _read from src/ui/ui.ts_

**Subtitle**: '+escape(subtitle)+'  — _read from src/ui/ui.ts_

**Description**: '+escape(intro)+'  — _read from src/ui/ui.ts_

**Why it matters**: '+escape(why)+'  — _read from src/ui/ui.ts_

**Card copy**: Count Miller–Rabin lying bases, test fixed-base lists, and measure probable-prime generation. Then build and independently check a recursive proof for a small prime.

**Chips**: Miller–Rabin · Fermat Test · Prime Certificates · Prime Generation

**Implements**: Fermat primality test `src/primality/fermat.ts:2`, Miller–Rabin `src/primality/millerRabin.ts:11`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: RSA `src/gen/fips186.ts:9`

**References**: RSA

**Standards body**: _none_

**Implementation**: local BigInt primality engines

**Spec citations, exactly as written**:

- `eprint.iacr.org/2018/749` — first seen README.md:44 (2×)
- `FIPS 186-5` — first seen README.md:20 (6×)
- `fips186` — first seen src/main.ts:4 (2×)
- `RFC 3526` — first seen README.md:73 (1×)

**README — What Can Go Wrong**:

```text
- A fixed list used beyond its proven strict bound accepts known composites. The list and bound are pinned together in tests.
- Fermat accepts every coprime base for a Carmichael number.
- An exhausted Miller–Rabin chain can prove compositeness without producing a factor.
- Random-candidate posterior error estimates in FIPS Table B.1 are **not** the adversarial fixed-composite 4^-t bound.
- A certificate can turn a small probable-prime claim into a proof, provided its factorization and recursive subproofs are actually checked. The generator's trial division is not used by the verifier. See Pratt's [original paper](https://boole.stanford.edu/pub/SucCert.pdf) and the [Archive of Formal Proofs entry (2013; revised 2024)](https://isa-afp.org/entries/Pratt_Certificate.html); this browser implementation is not formally verified.
- The stronger φ(n)/4 strong-liar bound excludes 9; the all-base quarter bound has a different denominator.
- BigInt is not constant-time. The browser RNG is not established as a FIPS-validated DRBG. No secrets are persisted.
- Workers are terminated on cancellation; changed inputs retire old verdicts. In degraded worker-unavailable mode, bounded computation can occupy the main thread.
```

**Claims tested** (e2e/claims.spec.ts, 8 test(s)):

- `editable certificate is independently checked and tampering retires proof` — e2e/claims.spec.ts:3
    - :6 `toContainText` expected `'PROVEN PRIME'` _(literal)_
    - :8 `toBe` expected `'97'` _(literal)_
    - :9 `toBe` expected `96n` _(expression)_
    - :12 `toHaveCount` expected `0` _(literal)_
    - :14 `toContainText` expected `'Input refused'` _(literal)_
    - :17 `toContainText` expected `'composite input'` _(literal)_
- `chain squares and recovered factor independently agree` — e2e/claims.spec.ts:19
- `exhausted chain stops after s values` — e2e/claims.spec.ts:20
- `Fermat negative claim and exact liar fractions` — e2e/claims.spec.ts:21
- `fixed list accepts a factored composite and states the limitation` — e2e/claims.spec.ts:22
- `density mean matches rows and estimate retains ln2` — e2e/claims.spec.ts:23
- `probable-prime verdict is hedged and FIPS profile is accurately scoped` — e2e/claims.spec.ts:24
- `input refusal, tabs and no-op retirement` — e2e/claims.spec.ts:25

**Mutation records** (2 file(s)):

- `scripts/mutations.json` (1423 bytes)
- `scripts/mutations.mjs` (2275 bytes)

<details><summary>Full README</summary>

```markdown
# Prime Witness

Fermat · Miller–Rabin · Carmichael numbers

## What It Is

Prime Witness is an interactive, browser-only study of probabilistic primality testing. Its BigInt arithmetic is real: follow Miller–Rabin's square chain, extract and independently check a factor, count all lying bases in small examples, and defeat fixed-base testing with published composites.

This is not production cryptography. Miller–Rabin passing a random sample means **probably prime**, not a certificate. Deterministic tests can prove primality; the introductory wording in `brief.md` is corrected accordingly. The generator follows the sieve-plus-Miller–Rabin testing shape, not the complete FIPS RSA prime-generation procedure.

Built to the [Crypto Lab master standard](https://github.com/systemslibrarian/crypto-lab/blob/main/audits/_MASTER-TEMPLATE.md). The original brief travels with the source. General UI/contrast machinery derives from the MIT-licensed Crypto Lab siblings by Paul Clark.

## Exhibits

1. **Witness stepper:** the 561/base-2 chain, a nontrivial square root, and its factor; also start-at-1, reach-minus-1, and exhausted-chain outcomes.
2. **Count the liars:** exhaustive Fermat and strong-liar counts, Korselt's criterion, and explicit denominators, including the exception n = 9.
3. **Defeat fixed bases:** the published 4-, 12-, and 13-base pseudoprimes, their multiplied-back factors, and a fresh recorded sample of random bases.
4. **Prime density:** 16–2048-bit candidates, counts and timings, a per-run histogram, and the labelled prime-number-theorem estimate.
5. **Liar census:** exact counts for odd composites through a selectable cap of 2,001; larger individual presets include 8,911.
6. **1024-bit generation:** five rounds from FIPS 186-5 Table B.1 (the 2^-112 random-generation target), with the limits of that statement on screen.
7. **Prove a small prime:** generate an editable recursive Lucas–Pratt certificate for p ≤ 1,000,000 and check it independently. The verifier proves every factor of p−1 recursively and checks the full-order modular witness; corrupting the factor tree or witness makes verification fail. This toy range uses trial division during generation. It is separate from the 1024-bit probable-prime generator and does not certify that generator's output.

## When to Use It

Use this to teach what a probable-prime test establishes, why randomness in base selection matters, and how witnesses differ from certificates. Do **not** use its generated values for real keys or infer FIPS compliance from its table reference.

## Live Demo

Target: [Prime Witness](https://systemslibrarian.github.io/crypto-lab-prime-witness/). The Actions workflow publishes only after correctness, browser claims, accessibility, and mutation gates pass.

## What Can Go Wrong

- A fixed list used beyond its proven strict bound accepts known composites. The list and bound are pinned together in tests.
- Fermat accepts every coprime base for a Carmichael number.
- An exhausted Miller–Rabin chain can prove compositeness without producing a factor.
- Random-candidate posterior error estimates in FIPS Table B.1 are **not** the adversarial fixed-composite 4^-t bound.
- A certificate can turn a small probable-prime claim into a proof, provided its factorization and recursive subproofs are actually checked. The generator's trial division is not used by the verifier. See Pratt's [original paper](https://boole.stanford.edu/pub/SucCert.pdf) and the [Archive of Formal Proofs entry (2013; revised 2024)](https://isa-afp.org/entries/Pratt_Certificate.html); this browser implementation is not formally verified.
- The stronger φ(n)/4 strong-liar bound excludes 9; the all-base quarter bound has a different denominator.
- BigInt is not constant-time. The browser RNG is not established as a FIPS-validated DRBG. No secrets are persisted.
- Workers are terminated on cancellation; changed inputs retire old verdicts. In degraded worker-unavailable mode, bounded computation can occupy the main thread.

## Real-World Usage

Primality tests support RSA keys and many finite-field constructions. The 2018 paper [Prime and Prejudice](https://eprint.iacr.org/2018/749) studies adversarial parameters and historical library configurations; it is not a statement that current releases retain those defects.

Primary references: [HAC Chapter 4](https://cacr.uwaterloo.ca/hac/about/chap4.pdf), [Sorenson–Webster](https://arxiv.org/abs/1509.00864), [FIPS 186-5](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-5.pdf) B.3.1 / Table B.1 / C.1, and Katz–Lindell third edition §9.2. Sequence identifiers and attribution are in `src/data/sequences.ts`.

## How to Run Locally

Requires Node 22 or newer.

`​``sh
npm ci
npm run dev
`​``

## Related Demos

[Factor Forge](https://systemslibrarian.github.io/crypto-lab-factor-forge/), [Residue Gate](https://systemslibrarian.github.io/crypto-lab-residue-gate/), [Educational RSA](https://systemslibrarian.github.io/crypto-lab-rsa-educational/), [Accumulator](https://systemslibrarian.github.io/crypto-lab-accumulator/), [VDF](https://systemslibrarian.github.io/crypto-lab-vdf/).

The source overlap review found generation/verifier uses of Miller–Rabin rather than this teaching experiment. Reviewed sibling commits match those pinned in the brief; the 12-base / 13-base-bound discrepancy in VDF's comment is not copied here or described as an exploit.

## Build & Verify

`​``sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:mutations
`​``

Initial local correctness run: **34 tests passed**, including independent small-number enumeration, published pseudoprimes, exact liar counts, large Mersenne-prime and RFC 3526 fixtures, and module-boundary checks. No coverage percentage is claimed. `e2e/claims.spec.ts` independently rederives displayed values; `e2e/gate.ts` checks structure only and runs the fleet's composite-aware contrast and non-text checks. Seven scripted mutations require a passing baseline, changed built bytes, a named failure, immediate restoration, and a passing restored test.

Accessibility scans the production build at 1280 and 320 pixels through real controls, including failure states. Browser QA runs in CI when no supported local browser-control surface is available. A local unit/build pass alone is not publication evidence.

Dependency grouping, gated Dependabot auto-merge, pull-request checks, and `workflow_dispatch` are configured. The deployment follows the same gate after a Dependabot merge.

## Performance

Timings are measured where the lab runs. Large prime generation has a 60-second per-run safety cap and a candidate cap; stopping produces no prime claim. The exhaustive census has its own explicit toy cap. No measured point is extrapolated to a real-world attack.

The Crypto Lab catalog integration records this lab’s concept, level, source evidence and fleet automation. Playwright port 4228 is unique across all 223 registered configurations; strictPort is enforced and existing servers are never reused.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---
