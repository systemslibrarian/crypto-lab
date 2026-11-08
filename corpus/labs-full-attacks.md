# Crypto Lab audit corpus — ATTACKS

Generated 2026-11-08T20:20:28.593Z from 34 lab record(s).

Every finding must cite **commit_sha + lab slug + field**. A field printed as
`MISSING` was not found by the generator; it is not a claim that the lab lacks it.

---
## Compression Leak

- **slug**: `crypto-lab-compression-leak`
- **repo**: https://github.com/systemslibrarian/crypto-lab-compression-leak
- **live**: https://systemslibrarian.github.io/crypto-lab-compression-leak/
- **commit_sha**: `75e48be238026c3500956c7b41c0dc550441fcde` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `b078bac5652c64ff2bfb4c5a0848952b79f76814`
- **read_from**: working tree (clean)
- **category**: ATTACKS | ENCRYPTION  ·  **level**: intermediate  ·  **--accent**: #F2C078
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Compression Leak  — _read from index.html_

**Subtitle**: BREACH · gzip · AES-GCM  — _read from index.html_

**Description**: Compress and encrypt synthetic responses and discover what ciphertext length reveals.  — _read from index.html_

**Why it matters**: Compressing private data together with attacker-controlled text can make the encrypted response length depend on secret matches. Authentication still succeeds: the leaked information comes from length, not broken AES.  — _read from index.html_

**Card copy**: Compress a secret beside an attacker-controlled guess, then encrypt with AES-GCM. Measure real ciphertext lengths and test why separating compression contexts changes the leak.

**Chips**: AES-256-GCM · gzip · BREACH Pattern · Length Oracle

**Implements**: AES `src/crypto/oracle.ts:20`, AES-GCM `src/crypto/oracle.ts:20`

**Attacks shown**: _none derived_

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `NIST SP 800-38D` — first seen README.md:33 (2×)
- `RFC 1952` — first seen README.md:33 (2×)
- `SP 800-38D` — first seen README.md:45 (1×)

**README — What Can Go Wrong**:

```text
The experiment models the data-dependent size signal, not a production BREACH exploit. A tie among compressed sizes is inconclusive, and even perfect size equality across four probes is not a general length-hiding security proof.
```

**Claims tested** (e2e/claims.spec.ts, 3 test(s)):

- `real compressed ciphertext lengths leak information even when AES-GCM checks pass` — e2e/claims.spec.ts:2
    - :3 `toBeEnabled` expected _no expected value_ _(none)_
    - :4 `toContainText` expected `'LENGTH INFORMATION LEAKS'` _(literal)_
    - :5 `toHaveCount` expected `4` _(literal)_
    - :6 `toContainText` expected `'authenticated successfully'` _(literal)_
    - :7 `toContainText` expected `'LENGTH INFORMATION LEAKS'` _(literal)_
    - :8 `toContainText` expected `'DUSK-FOX-7'` _(literal)_
    - :9 `toHaveCount` expected `0` _(literal)_
    - :10 `toContainText` expected `'NO DISTINGUISHING LENGTH HERE'` _(literal)_
    - :11 `toContainText` expected `'NO DISTINGUISHING LENGTH HERE'` _(literal)_
- `one genuine measurement cannot be reported as proof of length secrecy` — e2e/claims.spec.ts:13
    - :14 `toBeEnabled` expected _no expected value_ _(none)_
    - :16 `toContainText` expected `'ONE SAMPLE'` _(literal)_
    - :17 `toContainText` expected `'NO DISTINGUISHING LENGTH HERE'` _(literal)_
    - :18 `toContainText` expected `'authenticated successfully'` _(literal)_
    - :19 `toContainText` expected `'An outside observer learns only lengths'` _(literal)_
- `invalid guess fails closed, never paints a successful stale verdict` — e2e/claims.spec.ts:21
    - :22 `toBeEnabled` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Compression Leak

**Status:** working interactive teaching implementation with automated checks. Passing CI or successful publication is not a formal security audit. GitHub Pages publication includes an explicit source-SHA check against served bytes.

## What It Is

A browser-only length-oracle experiment: build a synthetic response containing a fictional private token and an attacker-controlled reflected guess. Run native gzip, then real WebCrypto AES-256-GCM, and measure the *encrypted* byte length. All contents and keys stay local. No network attack is performed.

## Exhibits

1. **Shared dictionary:** compress secret and reflection together, encrypt, authenticate, and compare four equal-length guesses to observe match-dependent size.
2. **Independent dictionaries:** compress secret and reflected input separately, showing how this specific cross-string signal disappears in the controlled fixture.
3. **No compression:** compare equivalent input lengths and see why this removes this particular compression signal, but not ciphertext-length leakage in general.
4. **One measurement:** demonstrate that a single sample does not prove secrecy or let an observer confidently identify a token.
5. **Fail closed:** malformed guesses and unsupported compression modes produce errors, not deceptively successful results.

## When to Use It

Correct encryption and authentication do not conceal message length. Compressing an attacker-controlled guess beside a secret may leak information, as in BREACH and related compression-oracle attacks.

**Do not use:** This code with real keys, credentials, signatures, records or adversaries. The experiment isolates one mechanism; it is not a deployable cryptographic service.

## Live Demo

[Open Compression Leak](https://systemslibrarian.github.io/crypto-lab-compression-leak/). Publication is performed through GitHub Actions. The deploy job checks that the page serves the exact source commit before reporting a successful deployment. If this check fails, the public site must be treated as **unverified** even if an earlier artifact was published.

## What Can Go Wrong

The experiment models the data-dependent size signal, not a production BREACH exploit. A tie among compressed sizes is inconclusive, and even perfect size equality across four probes is not a general length-hiding security proof.

## Real-World Usage

[BREACH](https://breachattack.com/); NIST SP 800-38D (AES-GCM); gzip/DEFLATE (RFC 1952/1951). Related: [AES Modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/), [Protocol Composition](https://systemslibrarian.github.io/crypto-lab-protocol-compose/), [Order Leak](https://systemslibrarian.github.io/crypto-lab-order-leak/).

## How to Run Locally

Install with `npm ci`, run `npm test`, `npm run build`, and `npm run test:a11y` before using `npm run dev`. Browser tests serve a freshly rebuilt production artifact. Do not skip the accessibility or correctness gate.

## Related Demos

[BREACH](https://breachattack.com/); NIST SP 800-38D (AES-GCM); gzip/DEFLATE (RFC 1952/1951). Related: [AES Modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/), [Protocol Composition](https://systemslibrarian.github.io/crypto-lab-protocol-compose/), [Order Leak](https://systemslibrarian.github.io/crypto-lab-order-leak/).

## Build & Verify

The suite checks real gzip bytes, two official NIST AES-256-GCM known-answer cases for SP 800-38D -- Example #1's tag over an empty plaintext, and Example #2's ciphertext and tag asserted separately over 64 bytes, ciphertext size including the 16-byte tag, genuine decrypt-and-authenticate, secret-dependent size measurements, defenses in this fixture, malformed guesses and unsupported modes. Browser tests exercise the rendered leak and mitigations.

CI runs Vitest and Playwright, checks the production build, and refuses deployment on failures. After the Pages publish step, a fresh HTTP GET must return `deployment.json` identifying the exact `GITHUB_SHA` and GitHub repository, and a second GET must return HTML containing the app mount. The hosted source SHA is **deployed build identity evidence**, not a cryptographic security proof. Full negative-claim and mutation-test compliance remains subject to independent review.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Corrupted Oracle

- **slug**: `crypto-lab-corrupted-oracle`
- **repo**: https://github.com/systemslibrarian/crypto-lab-corrupted-oracle
- **live**: https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/
- **commit_sha**: `c40dbc33e27f620290b4d1ac53091542c69b687f` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS | RANDOMNESS  ·  **level**: advanced  ·  **--accent**: var(--green-clean)
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Corrupted Oracle  — _read from src/ui/panels.ts_

**Subtitle**: Dual_EC-style model · Historical NIST trapdoor  — _read from src/ui/panels.ts_

**Description**: Compare HMAC-DRBG and ChaCha20-DRBG with a simplified Dual_EC-style generator. Trigger its real elliptic-curve trapdoor to recover the model's internal state from its output and predict your next click.  — _read from src/ui/panels.ts_

**Why it matters**: A backdoored generator can pass statistical checks yet remain predictable to the holder of the trapdoor in Q. Passing a sample's tests cannot establish security; the construction and its constants also need review.  — _read from src/ui/panels.ts_

**Card copy**: A live Dual_EC_DRBG backdoor demo showing state recovery and future-output prediction while standard statistical tests still appear clean.

**Chips**: Dual_EC_DRBG · HMAC-DRBG · ChaCha20-DRBG · P-256

**Implements**: ChaCha20 `src/algorithms/chacha20-drbg.ts:58`, EC point arithmetic `src/algorithms/dual-ec-drbg.ts:106`, HMAC `src/algorithms/hmac-drbg.ts:18`, HMAC-DRBG `src/algorithms/hmac-drbg.ts:54`, P-256 `src/algorithms/dual-ec-drbg.ts:29`, SHA-256 `src/algorithms/chacha20-drbg.ts:151`

**Attacks shown**: Brute force `src/ui/attack-theater.ts:75`, Discrete log `src/ui/attack-theater.ts:44`

**References**: CTR-DRBG, P-384, RSA

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 186-4` — first seen src/algorithms/dual-ec-drbg.ts:27 (1×)
- `NIST SP 800-22` — first seen README.md:22 (2×)
- `NIST SP 800-22 Rev 1a` — first seen src/stats/nist-tests.ts:2 (1×)
- `NIST SP 800-90A` — first seen README.md:5 (5×)
- `NIST SP 800-90A Rev 1` — first seen src/algorithms/hmac-drbg.ts:3 (2×)
- `NIST SP800-90` — first seen src/ui/panels.ts:815 (2×)
- `RFC 8439` — first seen README.md:5 (6×)
- `SP 800-22` — first seen README.md:22 (3×)
- `SP 800-90A` — first seen README.md:5 (10×)
- `SP 800-90A Rev. 1` — first seen README.md:17 (3×)

**README — What Can Go Wrong**:

```text
- Trusting a generator because one sample passes statistical tests: the Dual_EC-style model can pass these four checks yet remain predictable to the trapdoor holder. This is not the full SP 800-22 battery or a certification of security.
- Adopting unverifiable "magic constants": when generator constants cannot be independently re-derived, a standards body or vendor can embed a trapdoor that users can never detect from the output alone.
- DRBG state compromise without reseeding: an attacker who recovers internal state can predict all future output until the generator is reseeded with fresh entropy.
- Insufficient entropy at seed time: a DRBG is only as strong as its seed, so low-entropy or predictable seeding makes the output guessable regardless of the algorithm.
- Output-truncation assumptions: Dual\_EC's relatively small truncation left enough bits in each block to make state recovery cheap for the trapdoor holder.
```

**Claims tested** (e2e/claims.spec.ts, 10 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:71
    - :71 `toHaveCount` expected `3` _(literal)_
- `renders three generators, only one of which is armed with an attack` — e2e/claims.spec.ts:86
    - :91 `toContainText` expected `ALGO_NAMES[i]` _(expression)_
    - :93 `toContainText` expected `'COMPROMISED'` _(literal)_
    - :95 `toHaveCount` expected `1` _(literal)_
    - :96 `toHaveCount` expected `0` _(literal)_
    - :97 `toHaveCount` expected `0` _(literal)_
    - :102 `toHaveText` expected `'—'` _(literal)_
    - :107 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :111 `toBe` expected `32` _(literal)_
    - :112 `toBe` expected `32` _(literal)_
    - :113 `toBe` expected `30` _(literal)_
    - :116 `toHaveClass` expected `/corrupted/` _(regex)_
    - :117 `toHaveClass` expected `/corrupted/` _(regex)_
    - :118 `toHaveClass` expected `/corrupted/` _(regex)_
- `each heatmap is a function of the bytes printed above it, and of nothing else` — e2e/claims.spec.ts:121
    - :129 `toBeVisible` expected _no expected value_ _(none)_
    - :141 `toBe` expected `cells` _(expression)_
    - :143 `toBe` expected `(hex.length / 2) * 8` _(expression)_
    - :144 `toBe` expected `0` _(literal)_
    - :146 `toBe` expected `popcount(hex.slice(0, cells / 4))` _(expression)_
    - :153 `expect` expected _no expected value_ _(none)_
    - :154 `toBe` expected `ALGO_NAMES[i]` _(expression)_
    - :155 `toBe` expected `cells` _(expression)_
    - :156 `toBe` expected `lit` _(expression)_
    - :157 `toBe` expected `((lit / cells) * 100).toFixed(1)` _(expression)_
    - :159 `expect` expected _no expected value_ _(none)_
    - :171 `toBe` expected `litColours[HMAC]` _(expression)_
    - :172 `toBe` expected `litColours[HMAC]` _(expression)_
- `reseed_counter counts the Generate clicks and resets on reseed` — e2e/claims.spec.ts:175
    - :185 `toHaveText` expected `'—'` _(literal)_
    - :188 `expect` expected _no expected value_ _(none)_
    - :197 `toHaveText` expected `/reseed_counter: 1 \(reseeded\)/` _(regex)_
    - :237 `toBeVisible` expected `{ timeout: 120_000 }` _(expression)_
- `every statistical verdict agrees with its own p-value` — e2e/claims.spec.ts:240
    - :247 `toContainText` expected `'then run statistical tests'` _(literal)_
    - :251 `toEqual` expected `['Test', ...ALGO_NAMES]` _(expression)_
    - :254 `toEqual` expected `[` _(expression)_
    - :261 `toHaveLength` expected `4` _(literal)_
    - :264 `toHaveLength` expected `3` _(literal)_
    - :266 `toMatch` expected `/^(✅|❌)$/` _(regex)_
    - :267 `toBe` expected `true` _(expression)_
    - :268 `expect` expected _no expected value_ _(none)_
    - :269 `expect` expected _no expected value_ _(none)_
    - :272 `toBe` expected `cell.p > 0.01` _(expression)_
- `statistical results remain measured observations; repeating unchanged state does not draw a new sample` — e2e/claims.spec.ts:277
    - :284 `toContainText` expected `'a random sample can fail'` _(literal)_
    - :285 `toContainText` expected `'does not certify security'` _(literal)_
    - :288 `toHaveLength` expected `4` _(literal)_
    - :289 `toHaveLength` expected `12` _(literal)_
    - :291 `toMatch` expected `/^(✅|❌)$/` _(regex)_
    - :292 `toBe` expected `true` _(expression)_
    - :293 `toBe` expected `cell.p > 0.01` _(expression)_
    - :298 `toEqual` expected `first` _(expression)_
    - :299 `toBeVisible` expected _no expected value_ _(none)_
- `the KAT modal tally is the number of vectors that actually passed` — e2e/claims.spec.ts:304
    - :310 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :314 `expect` expected _no expected value_ _(none)_
    - :323 `toHaveLength` expected `claimedTotal` _(expression)_
    - :324 `toBe` expected `claimedPassed` _(expression)_
    - :325 `toBe` expected `claimedTotal` _(expression)_
    - :328 `toMatch` expected `/^CAVS-SHA256-PR-False-Count\d$/` _(regex)_
    - :329 `toBe` expected `'✅ PASS'` _(literal)_
    - :331 `toBe` expected `row[3]` _(expression)_
    - :332 `toMatch` expected `/^[0-9a-f]{16}\.\.\.$/` _(regex)_
    - :335 `expect` expected _no expected value_ _(none)_
    - :336 `toContainText` expected `'NIST CAVS 14.3 HMAC_DRBG(SHA-256)'` _(literal)_
    - :339 `toHaveCount` expected `0` _(literal)_
- `ABOUT proves the trapdoor live: d·Q renders as the same point as P` — e2e/claims.spec.ts:344
    - :350 `toBeVisible` expected _no expected value_ _(none)_
    - :356 `expect` expected _no expected value_ _(none)_
    - :357 `expect` expected _no expected value_ _(none)_
    - :358 `expect` expected _no expected value_ _(none)_
    - :362 `toBe` expected `pX` _(expression)_
    - :363 `expect` expected _no expected value_ _(none)_
    - :364 `expect` expected _no expected value_ _(none)_
    - :366 `toBe` expected `pX` _(expression)_
    - :369 `toHaveCount` expected `0` _(literal)_
- `no prediction is claimed before the attack has been run` — e2e/claims.spec.ts:374
    - :378 `toHaveText` expected `'—'` _(literal)_
    - :380 `toBeHidden` expected _no expected value_ _(none)_
    - :381 `toBeHidden` expected _no expected value_ _(none)_
- `the attack recovers state from the blocks you generated and predicts your next click` — e2e/claims.spec.ts:384
    - :394 `toHaveText` expected `'—'` _(literal)_
    - :399 `toBe` expected `blockA` _(expression)_
    - :403 `toBeVisible` expected _no expected value_ _(none)_
    - :404 `toContainText` expected `'STATE RECOVERED', { timeout: 240_000 }` _(expression)_
    - :408 `toBe` expected `blockA` _(expression)_
    - :409 `toBe` expected `blockB` _(expression)_
    - :411 `expect` expected _no expected value_ _(none)_
    - :412 `expect` expected _no expected value_ _(none)_
    - :416 `expect` expected _no expected value_ _(none)_
    - :418 `expect` expected _no expected value_ _(none)_
    - :419 `expect` expected _no expected value_ _(none)_
    - :420 `toMatch` expected `/STATE RECOVERED: s = 0x[0-9a-f]+/` _(regex)_
    - :424 `toHaveAttribute` expected `'aria-valuenow', '100'` _(expression)_
    - :425 `toBe` expected `'100%'` _(literal)_
    - :428 `toHaveCount` expected `11, { timeout: 120_000 }` _(expression)_
    - :434 `toHaveLength` expected `10` _(literal)_
    - :436 `toMatch` expected `/^[0-9a-f]{20}\.\.\.$/` _(regex)_
    - :438 `toBe` expected `predicted === actual` _(expression)_
    - :439 `toBe` expected `'✅'` _(literal)_
    - :444 `toContainText` expected `'YOUR MOVE', { timeout: 60_000 }` _(expression)_
    - :447 `expect` expected _no expected value_ _(none)_
    - :450 `toBe` expected `rows.length` _(expression)_
    - :451 `toBe` expected `rows.filter((r) => r[2] === '✅').length` _(expression)_
    - :452 `toBe` expected `matched === total` _(expression)_
    - :453 `toBe` expected `'TOTAL COMPROMISE'` _(literal)_
    - :457 `expect` expected _no expected value_ _(none)_
    - :458 `toBe` expected `2` _(literal)_
    - :459 `toBe` expected `Number(bits?.[1]) * 240` _(expression)_
    - :465 `expect` expected _no expected value_ _(none)_
    - :466 `toBe` expected `timingRate` _(expression)_
    - :471 `expect` expected _no expected value_ _(none)_
    - :472 `toBeVisible` expected _no expected value_ _(none)_
    - :473 `toContainText` expected _no expected value_ _(none)_
    - :477 `toBe` expected `'${(predictedNext ?? '').slice(0, 20)}...'` _(expression)_
    - :480 `toBe` expected `predictedNext` _(expression)_
    - :486 `toBe` expected `predictedNext` _(expression)_
    - :487 `toContainText` expected _no expected value_ _(none)_
    - :491 `expect` expected _no expected value_ _(none)_
    - :492 `toBe` expected `'${(nextPredicted ?? '').slice(0, 20)}...'` _(expression)_
    - :497 `toHaveText` expected `/reseed_counter: 1 \(reseeded\)/` _(regex)_
    - :498 `toBeHidden` expected _no expected value_ _(none)_
    - :504 `toBeHidden` expected _no expected value_ _(none)_
    - :505 `expect` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-corrupted-oracle

## What It Is

Corrupted Oracle compares **HMAC-DRBG** (NIST SP 800-90A §10.1.2) and **ChaCha20-DRBG** (RFC 8439-based) with a **simplified Dual_EC-style educational model**. The model uses real P-256 elliptic curve arithmetic and a live trapdoor attack inspired by the historical Dual_EC_DRBG construction. It is not an implementation of the complete January 2012 SP 800-90A §10.3.1 lifecycle. It shows why passing statistical tests does not establish unpredictability: knowledge of the secret relationship between P and Q can recover the model's internal state and predict subsequent output until reseeding.

## Model Scope

The page states these limits above the generator controls and in **ABOUT**:

- A 240-bit Generate click keeps the output-round state. The model omits the extra `s = x(s·P)` at the end of each request in [archived January 2012 SP 800-90A §10.3.1.4 step 14](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-90a.pdf#page=76). A second request therefore differs from the historical standard's recurrence.
- The counter starts/resets at 1 and counts requests. The historical process increments per output block (step 10). No reseed interval is enforced; `reseedRequired` is always false.
- Instantiation uses `SHA-256(entropy) mod (n-1) + 1`; reseeding uses `(oldScalar + SHA-256(entropy)) mod (n-1) + 1`. These are not the standard's `Hash_df` constructions. Nonce, personalization and additional input are ignored.
- All `securityStrength` values use P-256. The field does not select another curve or establish 192/256-bit security. Requests trim to `ceil(bits/8)` bytes; the UI requests exactly 240 bits.
- The demo Q is `e·P` for a known scalar. Published NIST Q is shown only as a reference. Recovery follows this model's continuous output rounds; full-standard request-boundary accounting is not implemented.

Dual_EC_DRBG was removed in [SP 800-90A Rev. 1 (June 2015)](https://csrc.nist.gov/pubs/sp/800/90/a/r1/final). Do not use this educational model in production or copy it as a conforming DRBG.

## When to Use It

- **Teaching the Dual\_EC\_DRBG backdoor** — the demo runs real EC math in the browser so students can see state recovery happen live, not just read about it.
- **Demonstrating why statistical tests are insufficient** — backdoored output can pass the four illustrated SP 800-22 tests (Frequency, Block Frequency, Runs, Longest Run). Individual random samples can also fail. Passing tests does not establish unpredictability or exclude a trapdoor; see [NIST SP 800-22's testing limits](https://csrc.nist.gov/pubs/sp/800/22/r1/upd1/final).
- **Comparing DRBG constructions side by side** — HMAC-DRBG, ChaCha20-DRBG, and the Dual_EC-style model generate output in parallel so you can compare their measured samples and different security properties.
- **Illustrating supply-chain trust in cryptographic standards** — the demo makes concrete what it means for a standards body to publish compromised constants.
- **Do not use any code from this project in production** — the Dual\_EC\_DRBG implementation is intentionally backdoored for educational purposes and the demo DRBGs are not hardened for real-world use.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-corrupted-oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/)**

Generate random output from all three DRBGs, run NIST SP 800-22 statistical tests against each, and trigger the Dual\_EC\_DRBG backdoor attack to watch the attacker brute-force 2¹⁶ candidates, recover internal state from **two** consecutive intercepted blocks, and predict your next Generate click before you make it. You can reseed any generator and view bit heatmaps comparing output from all three algorithms — the heatmaps are painted in one colour for all three, because tinting the backdoored one red would draw a difference the bytes do not contain. The closing verdict is the tally of how many predictions actually matched, so a failed recovery reads as a failure. The curve arithmetic is real NIST P-256 with the real generator P; NIST's published Q is replaced by a demo point `Q = e·P` whose scalar we chose, since the attack needs the trapdoor — the page states this above the panels, and shows the unused real Q under **ABOUT**.

## What Can Go Wrong

- Trusting a generator because one sample passes statistical tests: the Dual_EC-style model can pass these four checks yet remain predictable to the trapdoor holder. This is not the full SP 800-22 battery or a certification of security.
- Adopting unverifiable "magic constants": when generator constants cannot be independently re-derived, a standards body or vendor can embed a trapdoor that users can never detect from the output alone.
- DRBG state compromise without reseeding: an attacker who recovers internal state can predict all future output until the generator is reseeded with fresh entropy.
- Insufficient entropy at seed time: a DRBG is only as strong as its seed, so low-entropy or predictable seeding makes the output guessable regardless of the algorithm.
- Output-truncation assumptions: Dual\_EC's relatively small truncation left enough bits in each block to make state recovery cheap for the trapdoor holder.

## Real-World Usage

- HMAC-DRBG, Hash-DRBG, and CTR-DRBG (NIST SP 800-90A) are the standard DRBGs used in TLS libraries, operating-system RNGs, and FIPS-validated cryptographic modules.
- ChaCha20-based generators back the Linux `getrandom()` / `/dev/urandom` CSPRNG, BSD `arc4random`, and the RNGs of many language runtimes.
- Dual\_EC\_DRBG was a published NIST standard that shipped in products such as RSA BSAFE and Juniper ScreenOS before being withdrawn over the backdoor concerns this demo reconstructs — a real cautionary tale in standards trust.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-corrupted-oracle
cd crypto-lab-corrupted-oracle
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-drbg-arena](https://systemslibrarian.github.io/crypto-lab-drbg-arena/) — HMAC_DRBG, CTR_DRBG, and Hash_DRBG (NIST SP 800-90A) compared head to head.
- [crypto-lab-vrf-gate](https://systemslibrarian.github.io/crypto-lab-vrf-gate/) — verifiable random functions and VDFs, randomness you can prove rather than trust.
- [crypto-lab-phantom-vault](https://systemslibrarian.github.io/crypto-lab-phantom-vault/) — HMAC-DRBG with rejection sampling in an applied key-derivation setting.
- [crypto-lab-chacha20-stream](https://systemslibrarian.github.io/crypto-lab-chacha20-stream/) — the ChaCha20 keystream that the ChaCha20-DRBG in this demo is built on.

## Verifying the Cryptography

Don't take the demo's word for it — the math is checked by an automated test suite:

`​``bash
npm test
`​``

Use Node 22.13 or later (CI uses Node 22). The independent Node controls erase
TypeScript types in an isolated temporary directory; they add no dependency or
browser debug interface. `npm run build` checks types and builds the site;
`npm run test:a11y -- --retries=0` runs all configured functional and accessibility
browser checks, including desktop/mobile model disclosures.

The suite verifies, against authoritative sources:

- **HMAC-DRBG** reproduces every NIST CAVS 14.3 `HMAC_DRBG(SHA-256)` known-answer vector.
- **ChaCha20** reproduces the RFC 8439 §2.3.2 keystream test vector.
- **P-256** arithmetic is correct: the generator has the right order (`n·G = ∞`), and both the standard generator P and the published constant Q lie on the curve.
- **The trapdoor holds**: `d·Q = P`, where `d = e⁻¹ mod n` and `Q = e·P` — this is the relationship that turns intercepted output back into internal state.
- **The end-to-end attack** recovers the generator's state from two output blocks and predicts its future output exactly.
- **Independent request-boundary controls** use Node/OpenSSL `prime256v1`, not the lab's arithmetic or attacker. They reproduce scalar 12345's output-round state and the historical standard's different final state, compare subsequent requests, and check multi-block counters and simplified seeding/reseeding. These tests document the model's limits; they do not assert NIST conformance.
- **The statistical tests have a working failing tail.** Block Frequency's p-value is checked against the closed-form χ² upper tail at 8 df (χ² = 15.5 → p = 0.05012205) and against an all-zero input, which must fail. It previously returned p = 1.000000 → PASS for that input, because the incomplete-gamma series was truncated at 200 terms and could not reach the tail; the tail is now evaluated by continued fraction.
- **Sample outcomes are retained rather than retried until green.** Fixed predictable synthetic fixtures cover a passing battery and a failing Runs result. Browser checks compare every measured badge with its p-value and confirm that Run Tests on unchanged state repeats the same sample: it samples copies so it cannot consume the learner's next-click prediction. Use Generate or Reseed to change the sampled state.
- **The bit heatmap is a function of the bytes only.** Identical bytes render identical markup whichever generator supplied them, and the grid is sized to the data rather than zero-padded to a fixed 16×16 (which gave the 30-byte Dual_EC block a permanent all-dark bottom row).
- **The attack verdict is the match tally.** "TOTAL COMPROMISE" appears only when every prediction compared equal; a mismatch prints the measured count and says the recovery did not fully succeed.

A note on speed: the backdoor search is genuinely cheap — in optimized native code it finishes in well under a second. This project runs the same elliptic-curve math from scratch in the browser with plain `BigInt` (written for clarity, not speed), so the live attack takes tens of seconds and you can watch every candidate fall in real time. The cost to an attacker who holds the secret is trivial either way.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Misty Lens

- **slug**: `crypto-lab-misty-lens`
- **repo**: https://github.com/systemslibrarian/crypto-lab-misty-lens
- **live**: https://systemslibrarian.github.io/crypto-lab-misty-lens/
- **commit_sha**: `38f94664a3bbc133cde9ac0bfd44ceb7a5e34ae0` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `2848053d45242edd8cd1de8afadf5232bd9ccce5`
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: advanced  ·  **--accent**: #9f88ff
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Misty Lens  — _read from index.html_

**Subtitle**: MISTY1 &middot; KASUMI &middot; Related-Key  — _read from index.html_

**Description**: Run MISTY1 and KASUMI side by side, inspect the parts changed for cellular hardware, and execute the seven-round distinguisher those changes enabled.  — _read from index.html_

**Why it matters**: A security argument belongs to one exact design, not to its name or round count. Simplifying a proven structure can silently remove the assumptions that made its bound hold.  — _read from index.html_

**Card copy**: Run MISTY1 and KASUMI side by side, map the design changes between them, and execute the seven-round related-key sandwich distinguisher in the page.

**Chips**: MISTY1 · KASUMI · Related-Key · Feistel

**Implements**: KASUMI `src/kasumi/fi.ts:3`, MISTY1 `src/misty1/fi.ts:3`

**Attacks shown**: Boomerang attack `src/ui/attackPane.ts:30`, Chosen-plaintext attack `src/ui/attackPane.ts:133`, Differential cryptanalysis `README.md:11`, Key recovery `src/ui/attackPane.ts:128`, Linear cryptanalysis `README.md:62`

**References**: Shamir secret sharing

**Standards body**: ETSI, ISO

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `CRYPTO 2010` — first seen README.md:19 (4×)
- `CRYPTO 2015` — first seen README.md:21 (3×)
- `doi.org/10.1007/978-3-642-14623-7_21` — first seen src/ui/attackPane.ts:141 (1×)
- `doi.org/10.1007/978-3-662-47989-6_20` — first seen src/ui/attackPane.ts:142 (1×)
- `RFC 2994` — first seen README.md:17 (11×)
- `rfc2994` — first seen src/ui/attackPane.ts:139 (1×)

**Stated limitations (page)**:

- _(honesty, src/ui/attackPane.ts)_ ! KASUMI: broken in the related-key model — NOT a live GSM-call break.
- _(caveat, src/ui/diffPane.ts)_ No single edited box is "the bug." The attack uses an alignment of the linear key schedule, changed inner functions, and round placement. The MISTY1 proof covers the original whole design, not any eight-round descendant.

**README — What Can Go Wrong**:

```text
- **Confusing equal dimensions with equal security** — both designs have eight rounds, 64-bit blocks, and 128-bit keys, but the MISTY1 bounds do not transfer to KASUMI.
- **Overclaiming the attack** — the full result uses four related keys and adaptive chosen data; a passive GSM listener does not receive that capability.
- **Mistaking the browser exhibit for full recovery** — this lab executes the seven-round distinguisher. It reports, but does not run, the full eight-round key-recovery work.
- **Using educational implementations operationally** — the code prioritizes transparency and is not constant-time or independently audited.
```

**Claims tested** (e2e/claims.spec.ts, 5 test(s)):

- `both cipher claims are backed by their rendered known answers` — e2e/claims.spec.ts:11
    - :12 `toHaveText` expected `/2\/2 KATs match/` _(regex)_
    - :13 `toHaveText` expected `/4\/4 KATs match/` _(regex)_
    - :17 `toBe` expected `'8b1da5f56ab3d07c'` _(literal)_
    - :18 `toBe` expected `'17ff0f37f134045d'` _(literal)_
    - :19 `toBe` expected `kasumi` _(expression)_
    - :22 `toHaveText` expected `misty ?? ''` _(expression)_
- `the displayed quartet difference is independently recomputed` — e2e/claims.spec.ts:25
    - :32 `toBe` expected `xorHex(plaintextC, plaintextD)` _(expression)_
    - :33 `toBe` expected `'0000000000100000'` _(literal)_
    - :34 `toHaveAttribute` expected `'data-matches', 'true'` _(expression)_
    - :35 `toHaveAttribute` expected `'data-matches', 'false'` _(expression)_
    - :39 `toHaveText` expected `'Pc xor Pd = 0000000000100000'` _(literal)_
    - :40 `expect` expected _no expected value_ _(none)_
    - :41 `toBe` expected `before` _(expression)_
- `an invalid key relation fails closed and retires the result` — e2e/claims.spec.ts:44
    - :46 `toBeVisible` expected _no expected value_ _(none)_
    - :49 `toContainText` expected `'No distinguisher verdict was produced'` _(literal)_
    - :50 `toBeHidden` expected _no expected value_ _(none)_
    - :51 `toBeHidden` expected _no expected value_ _(none)_
    - :54 `expect` expected _no expected value_ _(none)_
    - :55 `toBeVisible` expected _no expected value_ _(none)_
- `the related-key limitation stays visible with the successful fixture` — e2e/claims.spec.ts:58
    - :60 `toContainText` expected `'MATCH: distinguisher present'` _(literal)_
    - :61 `toBeVisible` expected _no expected value_ _(none)_
    - :62 `toContainText` expected `'Deployed A5/3 does not expose that related-key oracle'` _(literal)_
    - :63 `toContainText` expected `'NOT a live GSM-call break'` _(literal)_
- `hidden tabpanels stay hidden until their real tabs are selected` — e2e/claims.spec.ts:66
    - :67 `toBeHidden` expected _no expected value_ _(none)_
    - :68 `toBeHidden` expected _no expected value_ _(none)_
    - :70 `toBeHidden` expected _no expected value_ _(none)_
    - :71 `toBeVisible` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Misty Lens

**MISTY1 · KASUMI · Related-Key**

A browser-only lab that runs real MISTY1 and KASUMI side by side, maps the design changes between them, and executes the seven-round related-key sandwich distinguisher from Dunkelman, Keller, and Shamir.

> **Not production cryptography — a teaching demo.** The ciphers are hand-rolled for inspection and conformance-tested against their specifications. The browser executes the reduced-round distinguisher, not the full key-recovery attack.

## What It Is

MISTY1 is a 64-bit block cipher with a 128-bit key, designed with provable lower bounds against linear and differential cryptanalysis. KASUMI is the modified MISTY1 design standardized for 3G cellular systems. Its simpler linear key schedule, altered FI, and changed FL placement made hardware implementation easier, but also enabled a practical-time attack in the related-key model.

The security model matters: the 2010 attack requires access to encryptions and decryptions under four keys whose differences are chosen by the attacker. Deployed A5/3 does not expose that oracle, so this is a result about KASUMI's design margin, not a method for decrypting live GSM calls.

## Exhibits

1. **The Two Ciphers** — Encrypt or decrypt one 64-bit block under one 128-bit key with both real implementations. Runtime badges execute 2 RFC 2994 MISTY1 vectors and 4 TS 35.203 KASUMI vectors, including the 50-iteration set.
2. **The Diff** — Inspect aligned MISTY1 and KASUMI structures. Selecting the key schedule, FI, or FL highlights both versions and explains what changed and how it contributes to the lost security argument.
3. **The Attack** — Run the CRYPTO 2010 adaptive quartet over rounds 1–7 with four related keys. KASUMI produces the predicted difference while the MISTY1 control does not. Breaking one bit of the key relation rejects the input and retires the verdict.
4. **Honesty panel** — Keeps the successful distinguisher beside the limitation: related keys are required, and this is not a live-call break.
5. **Later result** — Records Todo's CRYPTO 2015 integral attack on full MISTY1 as a theoretical result requiring nearly the full codebook.

## When to Use It

- Use it to study how small structural edits can invalidate a proof tied to an exact cipher design.
- Use it to inspect FI, FO, FL, key expansion, and Feistel round ordering against real outputs.
- Use it to teach related-key and sandwich/boomerang attacks without claiming a deployed-network exploit.
- Do **not** use this code to protect data or implement A5/3, GEA3, f8, or f9 in production.

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-misty-lens/**

Compare a shared block, select each changed component, and run a right quartet entirely in the browser.

## What Can Go Wrong

- **Confusing equal dimensions with equal security** — both designs have eight rounds, 64-bit blocks, and 128-bit keys, but the MISTY1 bounds do not transfer to KASUMI.
- **Overclaiming the attack** — the full result uses four related keys and adaptive chosen data; a passive GSM listener does not receive that capability.
- **Mistaking the browser exhibit for full recovery** — this lab executes the seven-round distinguisher. It reports, but does not run, the full eight-round key-recovery work.
- **Using educational implementations operationally** — the code prioritizes transparency and is not constant-time or independently audited.

## Real-World Usage

KASUMI was used by A5/3 for GSM confidentiality, GEA3 for GPRS confidentiality, and the f8/f9 confidentiality and integrity algorithms in UMTS. The lab implements the KASUMI block cipher itself, not those surrounding modes or a radio interception system.

## How to Run Locally

`​``bash
npm install
npm run dev
npm test
npm run build
npx playwright install chromium
npm run test:a11y
`​``

The Vite development URL includes the project base path: `http://localhost:5173/crypto-lab-misty-lens/` when that port is available.

## Related Demos

- [Matsui Line](https://systemslibrarian.github.io/crypto-lab-matsui-line/) — linear cryptanalysis, one of the attacks MISTY1 was designed to bound.
- [Biham Lens](https://systemslibrarian.github.io/crypto-lab-biham-lens/) — differential cryptanalysis, the other half of that design goal.

## Build & Verify

- **16 unit tests** exercise both cipher directions, strict input boundaries, all 6 specification KAT fixtures, runtime KAT summaries, the exact four-key relation, and four live right-quartet fixtures.
- [`src/misty1/vectors.ts`](src/misty1/vectors.ts) pins both ECB blocks from RFC 2994 Appendix A.
- [`src/kasumi/vectors.ts`](src/kasumi/vectors.ts) pins the four core-cipher sets from 3GPP TS 35.203.
- [`e2e/claims.spec.ts`](e2e/claims.spec.ts) independently recomputes the displayed quartet difference, tests retirement on an invalid relation, and requires the negative claim beside a successful fixture.
- [`e2e/a11y.spec.ts`](e2e/a11y.spec.ts) drives every meaningful state at desktop and 380px through axe WCAG 2.1 A/AA plus measured text, non-text, focus, scrolling, and reflow checks.

## Performance

Single-block encryption and the pinned seven-round quartet complete synchronously in the browser. The reported full attack costs roughly 2^26 total data, 2^32 time, and 2^30 bytes of memory; those costs are cited, not executed here.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*
```

</details>

---

## Export Grade

- **slug**: `crypto-lab-export-grade`
- **repo**: https://github.com/systemslibrarian/crypto-lab-export-grade
- **live**: https://systemslibrarian.github.io/crypto-lab-export-grade/
- **commit_sha**: `4f927bea1bf51afc2cd11b5f1429498844279e5d` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `2df0966283b539e452c7c3891f10e897f196b815`
- **read_from**: working tree (clean)
- **category**: ATTACKS | ENCRYPTION  ·  **level**: intermediate  ·  **--accent**: #ff6b7f
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Export Grade  — _read from index.html_

**Subtitle**: TETRA · TEA1 · Key Reduction  — _read from index.html_

**Description**: Run real TEA1, watch its 80-bit key collapse into a 32-bit register, then recover that effective key against the same cipher.  — _read from index.html_

**Why it matters**: A cipher can accept an 80-bit key and still provide only 32 bits of resistance. The label survives; the entropy does not.  — _read from index.html_

**Card copy**: Run real TETRA TEA1, trace its 80-bit key into a 32-bit working register, recover that register in a browser-sized window, then extrapolate the rate your own browser measured out to 2^80 and 2^128 and set it beside the published attacks on full-round AES.

**Chips**: TEA1 · TETRA · Key Reduction · Brute Force · Cost Extrapolation · vs. AES

**Implements**: TEA1 `src/tea1/core.ts:93`

**Attacks shown**: Boomerang attack `src/data/attacks.ts:85`, Brute force `src/data/attacks.ts:337`, Chosen-ciphertext attack `src/data/attacks.ts:106`, Key recovery `src/data/attacks.ts:53`, Known-plaintext attack `src/data/attacks.ts:162`, Nonce reuse `index.html:509`, Padding oracle `index.html:509`, Side-channel (unspecified) `index.html:509`, Timing side-channel `index.html:509`

**Comment-only (named in code comments, not executed)**: Serpent `src/data/attacks.ts:10`

**References**: AES, DES, Grover's algorithm, Serpent

**Standards body**: ETSI

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `ASIACRYPT 2009` — first seen src/data/attacks.ts:68 (1×)
- `ASIACRYPT 2011` — first seen src/data/attacks.ts:50 (1×)
- `CRYPTO 2009` — first seen src/data/attacks.ts:77 (1×)
- `ePrint 2009/241` — first seen src/data/attacks.ts:77 (1×)
- `ePrint 2009/317` — first seen src/data/attacks.ts:68 (1×)
- `ePrint 2011/449` — first seen src/data/attacks.ts:50 (1×)
- `ePrint 2014/932` — first seen src/data/attacks.ts:59 (1×)
- `ePrint 2022/845` — first seen src/data/attacks.ts:86 (1×)
- `eprint.iacr.org/2009/241` — first seen index.html:520 (2×)
- `eprint.iacr.org/2009/317` — first seen index.html:519 (2×)
- `eprint.iacr.org/2011/449` — first seen index.html:517 (2×)
- `eprint.iacr.org/2014/932` — first seen index.html:518 (2×)
- `eprint.iacr.org/2022/845` — first seen index.html:521 (2×)

**Stated limitations (page)**:

- _(caveat, index.html)_ Record status checked 22 September 2026: the central 2025 CVE entries remain reserved, so these mappings are attributed to the researchers.

**README — What Can Go Wrong**:

```text
- An 80-bit input label does not provide 80-bit resistance when initialization compresses the key to 32 bits.
- A short known-keystream sample can create false positives, so the lab requires at least four bytes and verifies every recovered candidate byte-for-byte.
- An all-zero known-plaintext fixture can obscure what is plaintext, ciphertext, and keystream, so the UI rejects it.
- A browser cannot honestly claim to sweep all $2^{32}$ candidates interactively; the page labels its $2^{16}$ window and reports the exact number tested.
- A stale recovery is not evidence for changed inputs; changing the key, frame, or known plaintext retires the verdict.
- A rate measured once, in one browser, on one machine is not a cost model; Exhibit 5 labels every projected figure an extrapolation and refuses to render any of them until the learner's own run has produced a rate.
- A scale-up multiplier is an assumption, not a measurement, so Exhibit 5 makes all three editable, prints the one in force, and labels a multiplier past $10^{21}$ absurd instead of quietly computing it.
- A timer too coarse for a fast run makes a rate a lower bound, and a device below one candidate per second makes it a floor; both states say so rather than presenting a derived number as measured.
- "Broken" in a paper and "broken" on a radio are different events: the best published single-key attack on full AES is 2.49 bits faster than brute force, which is a result and not a threat.
- An attack model is part of the result, so every row names it; the related-key figures far below the brute-force line assume keys related by attacker-chosen differences, which a protocol does not hand out.
- Reduced-round cryptanalysis is a different measurement from full-round key recovery, so this lab plots only the latter and defers the round-count view to Iron Serpent.
```

**Claims tested** (e2e/claims.spec.ts, 24 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:11
    - :11 `toHaveCount` expected `10` _(literal)_
- `page keystream equals the external TEA1 known-answer fixture` — e2e/claims.spec.ts:18
    - :19 `toEqual` expected `[` _(expression)_
    - :22 `toHaveAttribute` expected `'data-kat', 'pass'` _(expression)_
- `the displayed 80-to-32 claim is computed from rendered byte widths` — e2e/claims.spec.ts:25
    - :33 `toBe` expected `10` _(literal)_
    - :34 `toBe` expected `4` _(literal)_
    - :35 `toBe` expected `inputGroups * 8` _(expression)_
    - :36 `toBe` expected `registerGroups * 8` _(expression)_
    - :37 `toHaveText` expected `String(inputBits)` _(expression)_
    - :38 `toHaveText` expected `String(registerBits)` _(expression)_
    - :39 `toHaveText` expected `'0xc24e273b'` _(literal)_
- `known plaintext derives the shown keystream and the worker recovers the reduction output` — e2e/claims.spec.ts:42
    - :50 `toEqual` expected `displayedKeystream` _(expression)_
    - :53 `toBeVisible` expected `{ timeout: 30_000 }` _(expression)_
    - :54 `toHaveText` expected `reducedRegister` _(expression)_
    - :55 `toHaveText` expected _no expected value_ _(none)_
    - :58 `toHaveAttribute` expected `'data-check', 'pass'` _(expression)_
- `KAT success and 32-bit limitation coexist as OK-AND-BROKEN` — e2e/claims.spec.ts:61
    - :63 `toHaveAttribute` expected `'data-kat', 'pass'` _(expression)_
    - :64 `toHaveAttribute` expected `'data-claim', 'ok-and-broken'` _(expression)_
    - :65 `toContainText` expected _no expected value_ _(none)_
- `invalid and too-short fixtures fail with the actual cause` — e2e/claims.spec.ts:70
    - :73 `toContainText` expected `'exactly 10 bytes'` _(literal)_
    - :80 `toContainText` expected `'nonzero known plaintext'` _(literal)_
    - :83 `toContainText` expected `'between 4 and 8 bytes'` _(literal)_
- `hidden panels stay hidden until their real tabs are selected` — e2e/claims.spec.ts:86
    - :87 `toHaveAttribute` expected `'hidden', ''` _(expression)_
    - :88 `expect` expected _no expected value_ _(none)_
    - :90 `toHaveAttribute` expected `'hidden', ''` _(expression)_
    - :91 `expect` expected _no expected value_ _(none)_
    - :92 `toHaveAttribute` expected `'hidden', ''` _(expression)_
- `a no-op preserves a recovery while a changed input retires it` — e2e/claims.spec.ts:95
    - :98 `toBeVisible` expected `{ timeout: 30_000 }` _(expression)_
    - :101 `toBeVisible` expected _no expected value_ _(none)_
    - :102 `toBeHidden` expected _no expected value_ _(none)_
    - :105 `toBeHidden` expected _no expected value_ _(none)_
    - :106 `toContainText` expected `'retired because an input changed'` _(literal)_
- `worker cancellation produces no stale recovery verdict` — e2e/claims.spec.ts:109
    - :118 `toHaveText` expected `'0 / 65,536 tested'` _(literal)_
    - :119 `toBeHidden` expected _no expected value_ _(none)_
    - :121 `toContainText` expected `'cancelled cleanly', {` _(expression)_
    - :124 `toBeHidden` expected _no expected value_ _(none)_
    - :125 `toBeDisabled` expected _no expected value_ _(none)_
- `tablist supports roving keyboard navigation` — e2e/claims.spec.ts:128
    - :132 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :134 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :136 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :145 `toBeVisible` expected `{ timeout: 30_000 }` _(expression)_
    - :147 `toBeVisible` expected _no expected value_ _(none)_
- `the wall stays inert until the learner has measured a rate` — e2e/claims.spec.ts:154
    - :156 `toBeVisible` expected _no expected value_ _(none)_
    - :157 `toHaveAttribute` expected `'data-rate', 'absent'` _(expression)_
    - :158 `toBeHidden` expected _no expected value_ _(none)_
    - :159 `toHaveCount` expected `0` _(literal)_
    - :160 `toHaveAttribute` expected `'data-claim', 'pending'` _(expression)_
    - :162 `toHaveText` expected `'0'` _(literal)_
- `the displayed rate is the Exhibit 3 count divided by the Exhibit 3 time` — e2e/claims.spec.ts:165
    - :175 `expect` expected _no expected value_ _(none)_
    - :179 `expect` expected _no expected value_ _(none)_
    - :180 `expect` expected _no expected value_ _(none)_
    - :187 `toBe` expected `reported` _(expression)_
- `every extrapolated row equals keyspace divided by the page’s own rate` — e2e/claims.spec.ts:190
    - :195 `expect` expected _no expected value_ _(none)_
    - :199 `toHaveCount` expected `1` _(literal)_
    - :209 `toBe` expected `'${(years / 10 ** exponent).toFixed(1)} × 10^${exponent} years'` _(expression)_
    - :211 `expect` expected _no expected value_ _(none)_
    - :216 `toBeCloseTo` expected `(bits / 256) * 100, 3` _(expression)_
    - :227 `expect` expected _no expected value_ _(none)_
- `a scale-up multiplier divides the rendered cost by exactly that multiplier` — e2e/claims.spec.ts:231
    - :242 `toHaveValue` expected `'1000000000'` _(literal)_
    - :245 `expect` expected _no expected value_ _(none)_
    - :246 `expect` expected _no expected value_ _(none)_
    - :250 `expect` expected _no expected value_ _(none)_
    - :251 `expect` expected _no expected value_ _(none)_
    - :256 `toBeCloseTo` expected `Math.log2(31_557_600 * rate * 1e9), 1` _(expression)_
- `an absurd multiplier is rendered and labelled absurd, not refused` — e2e/claims.spec.ts:259
    - :263 `toBeVisible` expected _no expected value_ _(none)_
    - :264 `toContainText` expected `'ABSURD ASSUMPTION'` _(literal)_
    - :266 `toHaveAttribute` expected `'data-claim', 'wall'` _(expression)_
    - :267 `toHaveCount` expected `0` _(literal)_
    - :270 `toBeHidden` expected _no expected value_ _(none)_
- `the wall verdict names the register, the label, and 128 bits from one rate` — e2e/claims.spec.ts:273
    - :280 `expect` expected _no expected value_ _(none)_
    - :281 `expect` expected _no expected value_ _(none)_
    - :285 `toMatch` expected `/really tested [\d,]+ candidates in /` _(regex)_
    - :286 `expect` expected _no expected value_ _(none)_
    - :290 `expect` expected _no expected value_ _(none)_
    - :291 `expect` expected _no expected value_ _(none)_
    - :292 `expect` expected _no expected value_ _(none)_
    - :293 `toMatch` expected `/128 would take .+ × 10\^\d+ years/` _(regex)_
- `every plotted attack matches its row in the sourced table` — e2e/claims.spec.ts:298
    - :304 `expect` expected _no expected value_ _(none)_
    - :305 `toHaveCount` expected `count` _(expression)_
    - :311 `toHaveCount` expected `1` _(literal)_
    - :316 `toBeCloseTo` expected `rowBits, 2` _(expression)_
    - :320 `toBeCloseTo` expected `(rowBits / 256) * 100, 2` _(expression)_
- `every attack row carries a citation, a model, a goal, data and memory` — e2e/claims.spec.ts:324
    - :331 `toContainText` expected `/Single-key|Related-key/` _(regex)_
    - :332 `toContainText` expected `/rounds/` _(regex)_
    - :333 `toContainText` expected `/2\^/` _(regex)_
    - :334 `expect` expected _no expected value_ _(none)_
    - :335 `toContainText` expected `/2\^/` _(regex)_
    - :338 `toHaveAttribute` expected `'href', /^https:\/\/eprint\.iacr\.org\//` _(expression)_
    - :339 `toContainText` expected `/Table|Section|Abstract/` _(regex)_
- `every plotted attack sits under the brute-force line of its own group` — e2e/claims.spec.ts:343
    - :348 `toHaveCount` expected `1` _(literal)_
    - :349 `toHaveAttribute` expected `'data-bits', '${keyBits}.00'` _(expression)_
    - :353 `expect` expected _no expected value_ _(none)_
    - :356 `expect` expected _no expected value_ _(none)_
- `ACADEMICALLY BROKEN and practically secure are asserted together` — e2e/claims.spec.ts:361
    - :364 `toHaveAttribute` expected _no expected value_ _(none)_
    - :374 `expect` expected _no expected value_ _(none)_
    - :381 `expect` expected _no expected value_ _(none)_
    - :387 `toBeVisible` expected _no expected value_ _(none)_
    - :388 `toContainText` expected `'says nothing about any implementation'` _(literal)_
    - :391 `expect` expected _no expected value_ _(none)_
    - :392 `expect` expected _no expected value_ _(none)_
    - :393 `expect` expected _no expected value_ _(none)_
    - :408 `toBeCloseTo` expected `best, 1` _(expression)_
    - :409 `expect` expected _no expected value_ _(none)_
- `the TEA1-versus-AES contrast is computed from the learner’s own rate` — e2e/claims.spec.ts:412
    - :417 `toHaveText` expected `'—'` _(literal)_
    - :418 `toBeVisible` expected _no expected value_ _(none)_
    - :424 `toHaveText` expected `'—'` _(literal)_
    - :425 `toBeHidden` expected _no expected value_ _(none)_
    - :432 `expect` expected _no expected value_ _(none)_
    - :434 `toHaveText` expected _no expected value_ _(none)_
- `the security-margin view is deferred to Iron Serpent, not restated here` — e2e/claims.spec.ts:439
    - :444 `toContainText` expected `'Full-round key recovery only'` _(literal)_
    - :445 `toHaveAttribute` expected _no expected value_ _(none)_
    - :449 `toHaveAttribute` expected _no expected value_ _(none)_
    - :453 `toContainText` expected `'says nothing about any implementation'` _(literal)_
    - :454 `toContainText` expected `'nothing here transfers TEA1'` _(literal)_
- `the wall prints its extrapolations and its limits in the same state` — e2e/claims.spec.ts:457
    - :463 `toHaveAttribute` expected `'data-claim', 'wall'` _(expression)_
    - :464 `toBeHidden` expected _no expected value_ _(none)_
    - :465 `expect` expected _no expected value_ _(none)_
    - :466 `expect` expected _no expected value_ _(none)_
    - :471 `toBeVisible` expected _no expected value_ _(none)_
    - :472 `toContainText` expected `'one browser on one machine'` _(literal)_
    - :473 `toContainText` expected `'order-of-magnitude illustrations, not predictions'` _(literal)_
    - :474 `toContainText` expected `'Classical search only'` _(literal)_
    - :475 `toHaveAttribute` expected _no expected value_ _(none)_
    - :479 `toContainText` expected `'candidates/second'` _(literal)_
- `an unusable multiplier falls back to the measured rate and says so` — e2e/claims.spec.ts:482
    - :488 `toContainText` expected _no expected value_ _(none)_
    - :491 `toContainText` expected `'the measured rate, unscaled'` _(literal)_
    - :494 `toHaveText` expected _no expected value_ _(none)_
    - :497 `expect` expected _no expected value_ _(none)_
    - :500 `toContainText` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Export Grade

## What It Is

Export Grade is a browser lab for the TEA1 air-interface stream cipher used by TETRA. It runs a TypeScript port of Midnight Blue's reverse-engineered TEA1, verifies it against the upstream known-answer tests, exposes the function that reduces a ten-byte key to one 32-bit register, and searches a labeled browser-sized part of that effective space. It then takes the rate that search measured on the learner's own machine and extrapolates it across larger keyspaces, and sets that cost beside the published cryptanalysis of full-round AES.

The cryptography and search are real. For tractability, the page selects the $2^{16}$ window containing its local fixture's register; it does not search all $2^{32}$ candidates. The page uses local fixtures rather than intercepted traffic. This is not production cryptography or an operational TETRA tool.

## Exhibits

1. **The Cipher** - enter an 80-bit key and frame number, run real TEA1, and compare the default result with the upstream KAT.
2. **The Reduction** - execute all ten rounds of `tea1_init_key_register`, inspect every S-box input and output, and watch 80 rendered input bits become a computed 32-bit register.
3. **The Break** - derive known keystream bytes from plaintext and ciphertext, search a $2^{16}$ window in a Web Worker, and independently verify the recovered register against the same TEA1 core.
4. **The Record** - compare TCCA's Wassenaar export-compliance explanation with Midnight Blue's intentional-weakness characterization, then follow the 2023 and 2025 disclosure record.
5. **The Wall** - read the candidates-per-second your own Exhibit 3 run measured, with the division visible, and extrapolate that one rate to $2^{32}$, $2^{40}$, $2^{56}$, $2^{80}$, $2^{128}$, and $2^{256}$ on a log2 scale. A scale-up control carries three editable multipliers, each labeled as your assumption rather than a fact, and the chart marks the keyspace your own machine clears in one second and in one year. Nothing renders until you have run Exhibit 3.
6. **Paper vs Practice** - thirteen published key-recovery attacks on *full-round* AES, each figure read from the cited paper's own summary table, plotted as log2 time against the $2^{128}$, $2^{192}$, and $2^{256}$ brute-force lines with data and memory beside it. The biclique results sit a couple of bits under the line; the related-key results sit far below it and require an attacker model no protocol supplies.

## When to Use It

Use this lab to teach effective key strength, inspectable key schedules, known-answer testing, how export policy can become cryptographic structure, or the difference between an attack that is faster than brute force and an attack anyone can finish.

Do **not** use it to assess a deployed network, intercept radio traffic, infer that AES shares TEA1's weakness, treat the browser's $2^{16}$ run as a completed $2^{32}$ search, or quote Exhibit 5's extrapolations as predictions of what real hardware costs.

## Live Demo

[Open Export Grade](https://systemslibrarian.github.io/crypto-lab-export-grade/).

Generate a TEA1 keystream, step through the complete key load, and recover the resulting working register without sending data to a backend.

## What Can Go Wrong

- An 80-bit input label does not provide 80-bit resistance when initialization compresses the key to 32 bits.
- A short known-keystream sample can create false positives, so the lab requires at least four bytes and verifies every recovered candidate byte-for-byte.
- An all-zero known-plaintext fixture can obscure what is plaintext, ciphertext, and keystream, so the UI rejects it.
- A browser cannot honestly claim to sweep all $2^{32}$ candidates interactively; the page labels its $2^{16}$ window and reports the exact number tested.
- A stale recovery is not evidence for changed inputs; changing the key, frame, or known plaintext retires the verdict.
- A rate measured once, in one browser, on one machine is not a cost model; Exhibit 5 labels every projected figure an extrapolation and refuses to render any of them until the learner's own run has produced a rate.
- A scale-up multiplier is an assumption, not a measurement, so Exhibit 5 makes all three editable, prints the one in force, and labels a multiplier past $10^{21}$ absurd instead of quietly computing it.
- A timer too coarse for a fast run makes a rate a lower bound, and a device below one candidate per second makes it a floor; both states say so rather than presenting a derived number as measured.
- "Broken" in a paper and "broken" on a radio are different events: the best published single-key attack on full AES is 2.49 bits faster than brute force, which is a result and not a threat.
- An attack model is part of the result, so every row names it; the related-key figures far below the brute-force line assume keys related by attacker-chosen differences, which a protocol does not hand out.
- Reduced-round cryptanalysis is a different measurement from full-round key recovery, so this lab plots only the latter and defers the round-count view to Iron Serpent.

## Real-World Usage

TETRA was standardized by ETSI in 1995 and is used in more than 100 countries for police, military, emergency-service, transport, industrial, and critical-infrastructure communications. TEA1 is one TETRA air-interface cipher. TCCA states that its effective key was reduced to 32 bits for Wassenaar export compliance; Midnight Blue calls the intentional reduction a backdoor.

The 2023 TETRA:BURST work by Carlo Meijer, Wouter Bokslag, and Jos Wetzels maps the TEA1 reduction to CVE-2022-24402 and the unauthenticated network-time keystream-reuse issue to CVE-2022-24401. Their 2025 2TETRA:2BURST work reports an E2EE algorithm-ID-135 variant with AES-128 traffic-key entropy reduced to 56 bits, associated by the researchers with CVE-2025-52941. As checked on 22 September 2026, the central 2025 CVE records remain reserved, so the page attributes those mappings rather than presenting them as finalized CVE descriptions.

## How to Run Locally

`​``bash
npm install
npm run dev
`​``

Vite serves the project under `/crypto-lab-export-grade/`. No backend or persistent storage is used.

## Related Demos

- [Corrupted Oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/) - Dual_EC_DRBG and a different form of deliberate cryptographic weakness.
- [Iron Serpent](https://systemslibrarian.github.io/crypto-lab-iron-serpent/) - the round-count security-margin view of Serpent and AES. Exhibit 6 links out to it rather than restating it.
- [Grover](https://systemslibrarian.github.io/crypto-lab-grover/) - quantum search, which changes the exponent Exhibit 5 holds fixed. Exhibit 5 is classical only and does not model it.
- [AES Modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/) and [Blind Oracle](https://systemslibrarian.github.io/crypto-lab-blind-oracle/) - the implementation and mode failures that break real systems whose block cipher is untouched.
- [Crypto Lab catalog](https://crypto-lab.systemslibrarian.dev/) - the full browser-demo collection.

## Build & Verify

`​``bash
npm test
npm run test:coverage
npm run build
npm run test:a11y
`​``

The suite contains **58 tests**: 33 Vitest unit tests and 25 Playwright browser tests. The unit suite pins both TEA1 vectors from Midnight Blue's `tests.c`, the rate and extrapolation arithmetic including its floors and its refusal to invent a rate, and the sourced attack table's citations and exponents, which it also cross-checks against the counts this README states in prose. The browser claims suite cross-checks the rendered KAT, computed 80-to-32 reduction, real worker recovery, cancellation, hidden panels, stale-verdict retirement, the measured rate re-derived from the two numbers the page prints, every extrapolated row recomputed from the page's own rate, the scale-up multiplier read back off the rendered durations, the absurd-multiplier label, and every plotted attack matched against its table row. The accessibility gate scans reachable desktop and 380px states - including Exhibit 5 inert, Exhibit 5 measured, each scale-up tier, and the attack table - with axe WCAG A/AA rules plus arithmetic text contrast, non-text contrast, reflow, focus, motion, and keyboard-scroller checks.

Measured unit coverage: **98.06% statements**, **95.38% branches**, **100% functions**, and **98.54% lines**.

Every row in `src/data/attacks.ts` was read from the primary paper's own summary table, and the file records which table. The claims suite fails if a row loses its citation or if a plotted bar stops matching its row.

The TEA1-derived files retain Midnight Blue's copyright and Apache-2.0 notice. See [NOTICE](NOTICE) and [THIRD_PARTY_LICENSES/Apache-2.0.txt](THIRD_PARTY_LICENSES/Apache-2.0.txt). The rest of the lab is MIT licensed.

## Performance

The default target sits 10,044 candidates into its $2^{16}$ window and completed in about 0.9 seconds on the development machine. Runtime varies by browser and hardware. Search work runs in a Web Worker, reports progress, and supports cancellation without leaving a stale verdict.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*
```

</details>

---

## Model Breach

- **slug**: `crypto-lab-model-breach`
- **repo**: https://github.com/systemslibrarian/crypto-lab-model-breach
- **live**: https://systemslibrarian.github.io/crypto-lab-model-breach/
- **commit_sha**: `eea1dcf28f36c0463f35d46f0355591a7b897cb1` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: intermediate  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, claims, mutations, verification

**Name (H1)**: Model Breach  — _read from src/main.ts_

**Subtitle**: Threat models as contracts · HiAE case study  — _read from src/main.ts_

**Description**: Explore how an attack’s oracle assumptions change its claimed cost. The live toy exhibit illustrates Hu’s algebraic analysis; the research comparison separates it from Bille–Tischhauser’s stronger 2026 result.  — _read from src/main.ts_

**Why it matters**: A security proof is a contract with fine print: "secure" only means secure against the stated adversary. Miss the model boundary and you can deploy a provably-broken scheme while believing the headline bit-count.  — _read from src/main.ts_

**Card copy**: A HiAE threat-model case study showing candidate enumeration, MITM state recovery, and guess-and-determine attacks when assumptions drift from deployment reality.

**Chips**: Threat Modeling · Candidate Enumeration · MITM Recovery · Guess-and-Determine

**Implements**: Toy HiAE `src/hiae.ts:50`

**Attacks shown**: Brute force `README.md:129`, Key recovery `src/main.ts:91`, Man-in-the-middle `README.md:46`

**Comment-only (named in code comments, not executed)**: AES `src/differential.ts:17`

**References**: AEGIS-256, AES, Ascon

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `ePrint 2025/1180` — first seen README.md:139 (2×)
- `ePrint 2025/1203` — first seen README.md:16 (8×)
- `ePrint 2025/1235` — first seen README.md:21 (2×)
- `ePrint 2025/377` — first seen README.md:11 (2×)
- `eprint.iacr.org/2025/1180` — first seen README.md:139 (2×)
- `eprint.iacr.org/2025/1203` — first seen README.md:17 (4×)
- `eprint.iacr.org/2025/1235` — first seen src/main.ts:194 (2×)

**Stated limitations (page)**:

- _(disclaimer, src/main.ts)_ \u26A0 WHAT JUST RAN \u2014 AND WHAT DID NOT The recovered key above is genuinely computed: the attack observed the encryption oracle\u2019s keystream, then searched the disclosed reduced toy keyspace (2${TOY_SEED_BITS} seeds) for the one key that reproduces it, and confirmed it by getting the decryption oracle to accept a forgery signed with that key. No ground-truth key was read.

**README — What Can Go Wrong**:

```text
- **The threat model mismatch:** This attack requires both an encryption oracle
  AND a decryption oracle that accepts 2^128 forgery attempts. If your deployment
  cannot expose a decryption oracle to adversaries, that specific attack model
  does not apply; this alone does not prove HiAE’s 256-bit claim or settle other security goals.
- **Toy scale vs full scale:** The live recovery brute-forces a *disclosed
  toy keyspace of the learner's chosen width, up to 2^16,* against real oracle output (the differential-step panel is
  the paper's own technique, but at one-AESL-call scale) — this is what makes an
  end-to-end, honestly-verified key recovery browser-runnable. It is not the
  full algebraic attack: recovering a full random 256-bit key is 2^130 data /
  2^209 time (ePrint 2025/1203) and is annotated, never executed. The paper's
  AESL differential machinery (Theorem 1 enumeration, the MITM key equation)
  is implemented, unit-tested, and now runnable in-browser one step at a time —
  but the reduced keyspace, not that machinery, is what the end-to-end key
  recovery drives.
- **The distinct, stronger result:** [Bille & Tischhauser, ePrint 2025/1180](https://eprint.iacr.org/2025/1180), ToSC 2026, revised 16 June 2026, report full key recovery with 2^128 data and at most 2^129 time in a nonce-respecting setting with decryption queries. They also give a query/success trade-off with total cost divided by success probability at most 2^129. This is not Hu’s 2^209-time / 2^130-data result. Both full-size costs remain infeasible; the reduced-seed browser search reproduces neither. The visible comparison keeps source version, success and oracle access separate.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-model-breach

*When the Contract Breaks.*

## What It Is

A live case study in the most important and most misunderstood idea in
applied cryptography: security claims are contracts, and the threat model
is the fine print.

HiAE (ePrint 2025/377) is a real AEAD scheme achieving 340 Gbps on x86
and 180 Gbps on ARM — the fastest cross-platform AEAD ever published.
It claims 256-bit security against key-recovery attacks in the
nonce-respecting setting. The designers restrict that claim to their stated model.

This demo uses the algebraic attack from ePrint 2025/1203 (Xichao Hu,
June 2025 — https://eprint.iacr.org/2025/1203.pdf) as a live illustration
of what happens when an adversary operates outside the assumed boundaries:
under a stronger model where the attacker can submit unlimited forgeries
to the decryption oracle, Hu reports about 2^209 time and 2^130 data. The HiAE designers
responded in ePrint 2025/1235, maintaining their claims are intact under
the original model. These are attributed claims under different models, not an adjudication of deployment safety.

Implements real AESL (one AES round, zero round key, verified against the
FIPS-197 round vector), a structurally correct toy-scale HiAE, and a live
key-recovery attack that is **genuinely computed from oracle output**:

1. **Observe** — one encryption-oracle query leaks the keystream block
   `AESL(S0 ⊕ S2)` of the target's post-init state (`ct ⊕ pt`).
2. **Guess-and-determine** — the attack searches an *honestly disclosed reduced
   toy keyspace* (a public function of a seed, up to 16 bits) for the one key
   whose derived keystream reproduces what was observed. The width of that
   keyspace and the seed itself are both the learner's to set, and every run
   records what it cost — candidates tested and search time — in a table.
3. **Forge** — it builds a ciphertext+tag with the recovered key and, *if the
   selected deployment exposes a decryption oracle*, confirms the **oracle
   accepts it** (and rejects a random-tag forgery). Under Scenario A or C the
   attack is handed no oracle at all, so this phase is blocked and the run ends
   with a key that is recovered and unconfirmable — the standard model enforced
   rather than described.

The recovered key is checked byte-for-byte against the instance and is never
read from oracle metadata. **The reduced keyspace is the toy** — recovering a
full random 256-bit HiAE key is the 2^209-time / 2^130-data result of ePrint
2025/1203, which is annotated, never executed in-browser. The AESL differential math the paper uses (Theorem 1 candidate enumeration,
the MITM key equation) is no longer library-only: a **differential-step panel**
runs it in the browser and *measures* it. Press it and the page plants a state
pair differing by α, reads the real output difference β = AESL(x) ⊕ AESL(x ⊕ α),
solves each active S-box from the AES difference distribution table, and reports
the collapse it produced — 2^32 possibilities over the four active bytes knowing
α alone, typically 2^4–2^8 knowing β too, a measured ~2^24–2^28 cut — then runs
the Theorem 1 enumeration, prints how many candidate pairs it actually checked,
and verifies the state it returns both reproduces β and equals the planted one.
The DDT census beside it is counted on load, not quoted: 65,280 solutions over
65,280 difference pairs, i.e. exactly one surviving input per active S-box on
average, with just over half the pairs impossible outright. What remains
annotated rather than executed is *chaining* that step across the full 2048-bit
state, which is where 2^209 comes from — and the panel says so on the page.
No backends, no mocks, no recordings.

The recovery is shown as what it actually is — an **algebraic equation check**,
not a brute-force count. The captured keystream `A(S0 ⊕ S2)` is treated as a
constraint: candidate keys are re-derived live and lit up **byte-by-byte** where
they satisfy the equation, so wrong keys visibly fail on mismatched bytes and the
recovered key satisfies all sixteen. A companion panel isolates *why the oracle
matters* — the same candidate is unconfirmable in the ciphertext-only world and
confirmed by a real decryption-oracle **accept** in the extended world — and a
closing accept/reject contrast shows the forgery going through as the concrete
meaning of "the contract broke." Panel A opens with a plain-language gloss of the
four assumed terms (AEAD, nonce, nonce-respecting, decryption oracle), and its
state grid animates the real update path `S15 ← A(S0 ⊕ S1) ⊕ A(S13) ⊕ X` on Run
Attack rather than pulsing on a disconnected timer.

For a newcomer, the mechanism is now made concrete before the argument leans on it.
An always-visible **"what is a keystream leak?"** micro-explainer encrypts a block
of zeros live and shows three byte rows — zero plaintext, ciphertext, and the
derived keystream — so the learner *sees* that `ct` of zeros literally **is** the
keystream block `A(S0 ⊕ S2)`, and why a single query leaks a testable constraint.
Once an instance exists those rows show *its* leak — the exact block phase 1
captures — rather than an unrelated fixed key. A **method-honesty callout** states
plainly that the browser's exhaustive seed search and the paper's 2^209
meet-in-the-middle differential attack are *different techniques* — not one method
at two sizes — so nobody leaves thinking the real attack is just this search scaled
up. The oracle bridge runs a real computation on **both** sides of the same
candidate list: the standard-model side computes, for each candidate key, the
plaintext that key implies for the intercepted ciphertext, and finds every one of
them consistent — 0 of 5 eliminated, a counted dead end rather than a spinner —
while the extended-model side submits the same candidates as forgeries and the
oracle eliminates four and confirms one. The state
grid narrates itself with a per-cell caption tying each highlighted block back to
the leak, and the threat-model gap is drawn as **log-scale magnitude bars**
(2^256 vs 2^209, ≈ 2^47 easier) instead of a decorative gradient.

## When to Use It

- You need to teach the difference between a security claim and absolute safety.
- You are evaluating an AEAD for a deployment and need to reason about your actual adversary model, not just the scheme's stated security level.
- You want to understand why "no known attack" always has an asterisk.
- You are building systems that expose decryption as a service and need to understand the implications.
- Do NOT treat this as production code or a definitive verdict on HiAE — it is a teaching demo running toy-scale parameters to illustrate a threat-model argument.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-model-breach](https://systemslibrarian.github.io/crypto-lab-model-breach/)**

The demo implements real AESL (one AES round with a zero round key) and a structurally correct toy-scale HiAE, then runs a live attack that actually recovers the key of a toy instance from oracle output — observe the keystream, search the disclosed reduced keyspace for the matching key, and get the decryption oracle to accept a forgery signed with it. The recovered key is verified against the instance. This makes the threat-model point concrete: the forgery step only works because the decryption oracle is exposed, which is outside HiAE's stated model — this does not establish security of the full scheme under its original claim.

## Research update — 1 November 2026

[HiAE draft-07, §§6.1 and 6.3](https://datatracker.ietf.org/doc/draft-pham-cfrg-hiae/07/)
acknowledges a statistical attack requiring an impractically large amount of known
plaintext and ciphertext to distinguish HiAE output from random data. This result
does not establish key recovery or message forgery. It is an **individual
Internet-Draft, not a final standard**. Key recovery, forgery and statistical
distinguishability are separate goals; the draft’s claims retain their stated
assumptions. This browser’s reduced-keyspace demonstration does not reproduce
the statistical attack.

The dated source note is visible in **The Academic Record**, under **Research
update — 1 November 2026**, and linked from **The Security Contract**. Reviewed
and incorporated on 2 November 2026.

## What Can Go Wrong

- **The threat model mismatch:** This attack requires both an encryption oracle
  AND a decryption oracle that accepts 2^128 forgery attempts. If your deployment
  cannot expose a decryption oracle to adversaries, that specific attack model
  does not apply; this alone does not prove HiAE’s 256-bit claim or settle other security goals.
- **Toy scale vs full scale:** The live recovery brute-forces a *disclosed
  toy keyspace of the learner's chosen width, up to 2^16,* against real oracle output (the differential-step panel is
  the paper's own technique, but at one-AESL-call scale) — this is what makes an
  end-to-end, honestly-verified key recovery browser-runnable. It is not the
  full algebraic attack: recovering a full random 256-bit key is 2^130 data /
  2^209 time (ePrint 2025/1203) and is annotated, never executed. The paper's
  AESL differential machinery (Theorem 1 enumeration, the MITM key equation)
  is implemented, unit-tested, and now runnable in-browser one step at a time —
  but the reduced keyspace, not that machinery, is what the end-to-end key
  recovery drives.
- **The distinct, stronger result:** [Bille & Tischhauser, ePrint 2025/1180](https://eprint.iacr.org/2025/1180), ToSC 2026, revised 16 June 2026, report full key recovery with 2^128 data and at most 2^129 time in a nonce-respecting setting with decryption queries. They also give a query/success trade-off with total cost divided by success probability at most 2^129. This is not Hu’s 2^209-time / 2^130-data result. Both full-size costs remain infeasible; the reduced-seed browser search reproduces neither. The visible comparison keeps source version, success and oracle access separate.

## Real-World Usage

- The same extended-oracle attack framework was applied to AEGIS first, then Rocca, now HiAE — the pattern suggests any AES-round-function-based AEAD with insufficient key mixing at initialization/finalization may share this structural property.
- If you are designing a new AEAD, your security analysis should explicitly address the extended decryption oracle model even if you choose to exclude it from your formal claims.
- HiAE is described in the individual Internet-Draft draft-pham-cfrg-hiae, not a final standard; deployment decisions should account for whether the target environment (e.g. 6G or GPU/NPU interconnect) can expose decryption oracles to adversaries capable of 2^128 queries.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-model-breach
cd crypto-lab-model-breach
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-nonce-guard](https://systemslibrarian.github.io/crypto-lab-nonce-guard/) — how AEAD guarantees collapse outside their nonce assumptions.
- [crypto-lab-aes-modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/) — AES modes and authenticated encryption fundamentals.
- [crypto-lab-ascon](https://systemslibrarian.github.io/crypto-lab-ascon/) — a standardized lightweight AEAD for comparison.
- [crypto-lab-aegis-gate](https://systemslibrarian.github.io/crypto-lab-aegis-gate/) — AEGIS, the AES-round-function AEAD this attack family first targeted.
- [crypto-lab-protocol-compose](https://systemslibrarian.github.io/crypto-lab-protocol-compose/) — how composition and threat-model choices break real protocols.

## Stack

Vite + TypeScript strict + vanilla CSS. GitHub Pages. No backends.
No external crypto libraries — the AES round function (AESL) and the toy HiAE
are hand-implemented in `src/` and unit-tested with `vitest` (FIPS-197 round
vector, AEAD round-trip, forgery rejection, and a black-box end-to-end recovery
that would fail if the key were ever read from oracle metadata). WebCrypto
supplies randomness only (the secret toy seed and forgery-probe tags).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Biham Lens

- **slug**: `crypto-lab-biham-lens`
- **repo**: https://github.com/systemslibrarian/crypto-lab-biham-lens
- **live**: https://systemslibrarian.github.io/crypto-lab-biham-lens/
- **commit_sha**: `ad43089a665aae91be2a1604d2e93d63c1b936b0` (the commit these bytes were read from)
- **read_from**: git archive HEAD (1 dirty path(s))
- **category**: ATTACKS  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, verification

**Name (H1)**: biham-lens  — _read from index.html_

**Subtitle**: Differential Cryptanalysis · From toy SPN to FEAL-4  — _read from index.html_

**Description**: Trace XOR differences through a toy cipher, recover its last-round subkey, then carry the same idea to published FEAL-4 and test equivalent key material on unseen ciphertexts.  — _read from index.html_

**Why it matters**: The FEAL-4 experiment uses 20 chosen plaintexts to recover material that decrypts new blocks. Its weak round difference shows why key size alone does not protect a cipher.  — _read from index.html_

**Card copy**: Compare public differential estimates with instructor-only trails on a toy SPN, track distinct pairs, and recover a last-round subkey. Then verify equivalent FEAL-4 round keys against fresh blocks without recovering its master key.

**Chips**: Differential Cryptanalysis · SPN · DDT · Chosen-Plaintext

**Implements**: PRESENT `src/crypto/present/present.ts:21`, Toy SPN `src/crypto/spn.ts:95`

**Attacks shown**: Brute force `README.md:15`, Chosen-plaintext attack `src/feal-tab.ts:16`, Differential cryptanalysis `src/main.ts:1086`, Impossible differential `src/main.ts:787`, Key recovery `README.md:24`, Known-plaintext attack `brief-extension-present.md:117`

**Comment-only (named in code comments, not executed)**: DES `src/crypto/attack.ts:5`, Shamir secret sharing `src/crypto/attack.ts:6`

**References**: AES, AES-CBC, ChaCha20, DES, Enigma, MD5, RSA, SHA-1, Serpent, Shamir secret sharing, Simon, Speck, Vigenere cipher

**Standards body**: ISO

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `CHES 2007` — first seen README.md:89 (6×)
- `ches2007` — first seen README.md:89 (2×)
- `doi.org/10.1007/BF00190801` — first seen README.md:30 (2×)
- `eprint.iacr.org/2025/437` — first seen README.md:109 (2×)
- `EUROCRYPT 2025` — first seen README.md:109 (2×)
- `FIPS 197` — first seen index.html:652 (1×)
- `ISO/IEC 29192-2` — first seen src/present-tab.ts:30 (1×)
- `RFC 8439` — first seen index.html:673 (1×)

**README — What Can Go Wrong**:

```text
Real failure modes and pitfalls in differential cryptanalysis and its defense:

- **Weak S-box selection**: DES's S-boxes were hardened against differential attacks by their IBM designers in the 1970s, under an NSA requirement that the reasoning stay classified; many S-box designs without this care exhibit high-probability differentials, allowing attacks with fewer than 500 pairs. The largest DDT entry across DES's 6→4-bit S-boxes is 16 out of 64 (a differential probability of 1/4); the toy 4-bit S-box in this demo peaks at 8 out of 16 (1/2), while the PRESENT S-box it can be swapped for peaks at 4 out of 16 (1/4), the best a 4-bit permutation can do.
- **Insufficient rounds**: Diffusion and additional active S-boxes can lower characteristic probabilities and raise data requirements; there is no universal per-round cost law. Serpent's 32 rounds were chosen for a substantial security margin, not a proof of immunity. See [the designers' proposal](https://www.cl.cam.ac.uk/archive/rja14/Papers/serpent.pdf).
- **Biased round key schedule**: If the round subkeys are derived deterministically from a master key with low entropy or poor diffusion, recovering one subkey may leak information about others, amplifying the attack. Independent-round differential estimates assume independent subkeys; this toy uses a rotating, dependent schedule, so its fixed-key observations can differ.
- **Implementation padding and oracle feedback**: If the target cipher implementation returns detailed error information (e.g., "decryption failed at S-box stage 2"), an attacker can narrow the search before the cryptanalysis step, reducing pairs needed further. Constant-time implementations resist such leakage.
- **Statistical correlation in pair collection**: If the ciphertext pairs are not collected uniformly at random (e.g., due to a biased pseudorandom number generator), the observed differential bias may be distorted, leading to incorrect key recovery or spurious high-ranking candidates.
```

**Claims tested** (e2e/claims.spec.ts, 43 test(s)):

- `FEAL-4` — e2e/claims.spec.ts:4
- `computed trace, 20 oracle queries, and verified equivalent-key verdict` — e2e/claims.spec.ts:5
    - :10 `toBe` expected `'02000000'` _(literal)_
    - :11 `toHaveText` expected `'00000000'` _(literal)_
    - :12 `toContainText` expected `'Computed round 2 f output Δ = ${computed}'` _(expression)_
    - :13 `toContainText` expected `'D88C4EF31769F53E'` _(literal)_
    - :15 `toHaveText` expected `'20 chosen plaintexts queried'` _(literal)_
    - :16 `toContainText` expected `'Every A pair computed round 2 f Δ = 02000000'` _(literal)_
    - :18 `toHaveCount` expected `10` _(literal)_
    - :20 `toBe` expected `'A'` _(literal)_
    - :21 `toBe` expected `0x8080000080800000n` _(expression)_
    - :23 `toBe` expected `'B'` _(literal)_
    - :24 `toBe` expected `0x0000000200000002n` _(expression)_
    - :25 `toBeHidden` expected _no expected value_ _(none)_
    - :27 `toContainText` expected `'64/64 fresh ciphertexts checked', { timeout: 120_000 }` _(expression)_
    - :28 `toHaveText` expected `'decrypts unseen ciphertext'` _(literal)_
    - :29 `toHaveText` expected `'Equivalent key, not the 64-bit master key'` _(literal)_
    - :30 `toContainText` expected `'20 attack queries + 64 later verification queries'` _(literal)_
    - :33 `toHaveText` expected `freshPlain` _(expression)_
    - :35 `expect` expected _no expected value_ _(none)_
    - :38 `toContainText` expected `'Ciphertext: ${freshCipher}'` _(expression)_
    - :39 `toHaveText` expected `'decrypts unseen ciphertext'` _(literal)_
    - :40 `toHaveCount` expected `4` _(literal)_
    - :42 `expect` expected _no expected value_ _(none)_
    - :46 `expect` expected _no expected value_ _(none)_
    - :49 `toBe` expected `full` _(expression)_
    - :50 `expect` expected _no expected value_ _(none)_
- `invalid input and changed collection settings clear stale state` — e2e/claims.spec.ts:53
    - :58 `toContainText` expected `'Use exactly 16 hex digits'` _(literal)_
    - :59 `expect` expected _no expected value_ _(none)_
    - :62 `toContainText` expected `'20 chosen plaintexts'` _(literal)_
    - :64 `toBeDisabled` expected _no expected value_ _(none)_
    - :65 `toContainText` expected `'0 chosen plaintexts'` _(literal)_
    - :66 `toBeHidden` expected _no expected value_ _(none)_
    - :67 `toBeHidden` expected _no expected value_ _(none)_
    - :69 `toContainText` expected `'18 chosen plaintexts'` _(literal)_
    - :71 `toBeDisabled` expected _no expected value_ _(none)_
    - :72 `expect` expected _no expected value_ _(none)_
- `cancel clears progress and marks retained counters incomplete` — e2e/claims.spec.ts:75
    - :81 `toContainText` expected `'Attack cancelled'` _(literal)_
    - :82 `expect` expected _no expected value_ _(none)_
    - :83 `toBeHidden` expected _no expected value_ _(none)_
    - :84 `toContainText` expected `'incomplete'` _(literal)_
- `a wrong fresh ciphertext rejects the recovered candidates` — e2e/claims.spec.ts:87
    - :102 `toHaveText` expected `'rejected: wrong on fresh ciphertext', { timeout: 120_000 }` _(expression)_
    - :103 `toContainText` expected `'0 equivalent keys verified'` _(literal)_
    - :104 `toHaveText` expected `'Equivalent key, not the 64-bit master key'` _(literal)_
    - :105 `toBeHidden` expected _no expected value_ _(none)_
    - :106 `expect` expected _no expected value_ _(none)_
    - :131 `toContainText` expected `'Attacker view: public S-box and permutation only'` _(literal)_
    - :136 `toHaveClass` expected `/active/` _(regex)_
    - :144 `toMatch` expected `K4_FROM_PAGE` _(expression)_
    - :151 `toContainText` expected `'Seed reset to 0x12345678'` _(literal)_
    - :156 `expect` expected _no expected value_ _(none)_
    - :204 `toHaveLength` expected `256` _(literal)_
    - :213 `toBe` expected `shown` _(expression)_
    - :214 `expect` expected _no expected value_ _(none)_
- `differential trace` — e2e/claims.spec.ts:244
- `every XOR-with-key stage leaves the difference untouched` — e2e/claims.spec.ts:245
    - :250 `expect` expected _no expected value_ _(none)_
    - :254 `toHaveLength` expected `5` _(literal)_
    - :260 `toBe` expected `rows[i - 1].diff` _(expression)_
    - :261 `toBe` expected `'✓ Δ preserved (XOR rule)'` _(literal)_
- `S-box stages are the only place the difference is allowed to change` — e2e/claims.spec.ts:265
    - :272 `toBe` expected _no expected value_ _(none)_
    - :276 `expect` expected _no expected value_ _(none)_
    - :282 `expect` expected _no expected value_ _(none)_
- `permutation relocates active bits without adding or removing any` — e2e/claims.spec.ts:285
    - :291 `toHaveLength` expected `3` _(literal)_
    - :298 `toBe` expected `before` _(expression)_
    - :303 `toBe` expected `before` _(expression)_
    - :304 `toBe` expected `after` _(expression)_
- `the trace opens on the plaintext difference the attack tab reports` — e2e/claims.spec.ts:308
    - :315 `toBe` expected `plainDiff` _(expression)_
    - :316 `toBe` expected `'input'` _(literal)_
    - :323 `toBe` expected `0xff` _(expression)_
    - :324 `toBe` expected `8` _(literal)_
    - :325 `toHaveText` expected `'0xFF'` _(literal)_
    - :326 `toHaveValue` expected `'0F'` _(literal)_
    - :327 `toHaveValue` expected `'F0'` _(literal)_
- `the stage counter matches how much of the pipeline is actually revealed` — e2e/claims.spec.ts:330
    - :334 `toBe` expected `13` _(literal)_
    - :338 `toBe` expected `expectedVisible - 1` _(expression)_
    - :339 `toBe` expected `total - 1` _(expression)_
    - :340 `toBe` expected `expectedVisible` _(expression)_
    - :341 `toBe` expected `total` _(expression)_
    - :343 `toHaveLength` expected `expectedVisible` _(expression)_
    - :347 `expect` expected _no expected value_ _(none)_
- `S-box analysis` — e2e/claims.spec.ts:373
- `the DDT is a real distribution: every row accounts for all 16 inputs` — e2e/claims.spec.ts:374
    - :380 `toBe` expected `16` _(literal)_
    - :381 `toBe` expected `0` _(literal)_
    - :384 `toBe` expected `16` _(literal)_
    - :385 `toBe` expected `true` _(expression)_
- `the strength verdict matches the peak of the table it is drawn from` — e2e/claims.spec.ts:388
    - :396 `toBe` expected `8` _(literal)_
    - :399 `toBe` expected `weakPeak.value` _(expression)_
    - :400 `toContainText` expected `'Weak'` _(literal)_
    - :401 `toContainText` expected _no expected value_ _(none)_
    - :404 `toHaveAttribute` expected `'aria-checked', 'true'` _(expression)_
    - :405 `toHaveAttribute` expected `'aria-checked', 'false'` _(expression)_
    - :412 `toBe` expected `4` _(literal)_
    - :413 `toBe` expected `strongPeak.value` _(expression)_
    - :414 `toContainText` expected `'Strong'` _(literal)_
    - :415 `toContainText` expected _no expected value_ _(none)_
    - :418 `toHaveAttribute` expected `'aria-checked', 'true'` _(expression)_
    - :419 `toHaveText` expected `'Strong (PRESENT)'` _(literal)_
    - :422 `toBe` expected `JSON.stringify(weakDDT)` _(expression)_
- `clicking a cell reports that cell own count and count/16 as a percentage` — e2e/claims.spec.ts:425
    - :433 `toBeVisible` expected _no expected value_ _(none)_
    - :434 `toHaveText` expected `'0x${peak.row.toString(16).toUpperCase()}'` _(expression)_
    - :435 `toHaveText` expected `'0x${peak.col.toString(16).toUpperCase()}'` _(expression)_
    - :436 `toHaveText` expected `String(peak.value)` _(expression)_
    - :439 `toHaveText` expected `pct` _(expression)_
    - :440 `toContainText` expected `'Exploitable'` _(literal)_
    - :441 `toContainText` expected `pct` _(expression)_
    - :442 `toBeVisible` expected _no expected value_ _(none)_
    - :447 `toContainText` expected `'Δ=0x0'` _(literal)_
    - :448 `toContainText` expected _no expected value_ _(none)_
    - :457 `expect` expected _no expected value_ _(none)_
    - :459 `toHaveText` expected `'0'` _(literal)_
    - :460 `toHaveText` expected `'0.0%'` _(literal)_
    - :461 `toHaveText` expected _no expected value_ _(none)_
    - :464 `toBeHidden` expected _no expected value_ _(none)_
    - :468 `toHaveText` expected `'16'` _(literal)_
    - :469 `toHaveText` expected `'100.0%'` _(literal)_
    - :470 `toHaveText` expected `'Trivial case (zero input difference).'` _(literal)_
    - :471 `toBeHidden` expected _no expected value_ _(none)_
    - :478 `expect` expected _no expected value_ _(none)_
    - :480 `toHaveText` expected _no expected value_ _(none)_
- `"use this differential" hands the clicked cell to the attack unchanged` — e2e/claims.spec.ts:485
    - :493 `toHaveClass` expected `/active/` _(regex)_
    - :495 `toHaveValue` expected `'00'` _(literal)_
    - :496 `toHaveValue` expected `hex2(peak.row)` _(expression)_
    - :497 `toHaveValue` expected `hex2(peak.col)` _(expression)_
    - :499 `toHaveText` expected `'0x${hex2(peak.row)}'` _(expression)_
    - :500 `toContainText` expected _no expected value_ _(none)_
- `live attack` — e2e/claims.spec.ts:510
- `a successful run names the key the page itself reveals` — e2e/claims.spec.ts:511
    - :518 `toContainText` expected `'500 sampled pairs;'` _(literal)_
    - :521 `toBeVisible` expected _no expected value_ _(none)_
    - :522 `toBeVisible` expected _no expected value_ _(none)_
    - :523 `toBeHidden` expected _no expected value_ _(none)_
    - :524 `toContainText` expected `'Top candidate matches instructor key'` _(literal)_
    - :528 `toHaveText` expected `k4` _(expression)_
    - :529 `toHaveText` expected `k4` _(expression)_
    - :530 `toHaveText` expected `k4` _(expression)_
    - :531 `toContainText` expected `'Top candidate: ${k4}.'` _(expression)_
    - :532 `toHaveText` expected `'1'` _(literal)_
    - :539 `expect` expected _no expected value_ _(none)_
    - :540 `expect` expected _no expected value_ _(none)_
    - :541 `expect` expected _no expected value_ _(none)_
- `the operation counters agree with the pair count and with each other` — e2e/claims.spec.ts:544
    - :553 `toBe` expected `pairs * 256 * 2` _(expression)_
    - :560 `expect` expected _no expected value_ _(none)_
    - :563 `toBe` expected `product` _(expression)_
    - :564 `toBe` expected `pairs` _(expression)_
    - :565 `toBe` expected `opCount` _(expression)_
    - :568 `expect` expected _no expected value_ _(none)_
    - :576 `toBe` expected `500` _(literal)_
    - :581 `toBe` expected `1600` _(literal)_
- `the pair counter separates repeated samples from distinct data` — e2e/claims.spec.ts:584
    - :588 `toContainText` expected `'0 sampled pairs;'` _(literal)_
    - :590 `toContainText` expected `'100 sampled pairs;'` _(literal)_
    - :592 `toContainText` expected `'1100 sampled pairs;'` _(literal)_
    - :594 `toContainText` expected `'0 sampled pairs;'` _(literal)_
    - :595 `toBeHidden` expected _no expected value_ _(none)_
- `the same seed reproduces the same attack` — e2e/claims.spec.ts:598
    - :616 `toEqual` expected `first` _(expression)_
- `exact instructor differential sums contributing trails and labels assistance` — e2e/claims.spec.ts:619
    - :622 `expect` expected _no expected value_ _(none)_
    - :623 `expect` expected _no expected value_ _(none)_
    - :626 `expect` expected _no expected value_ _(none)_
    - :628 `toHaveValue` expected `peak` _(expression)_
    - :629 `toHaveAttribute` expected `'title', /sums all intermediate trails/` _(expression)_
    - :631 `toContainText` expected `'not the exact probability for the victim key'` _(literal)_
- `running with no pairs refuses rather than inventing a verdict` — e2e/claims.spec.ts:634
    - :638 `toHaveText` expected `'Please collect some pairs first.'` _(literal)_
    - :639 `toBeHidden` expected _no expected value_ _(none)_
    - :640 `toBeHidden` expected _no expected value_ _(none)_
- `an impossible target Δ fails loudly and explains why` — e2e/claims.spec.ts:643
    - :655 `toBeVisible` expected _no expected value_ _(none)_
    - :656 `toBeHidden` expected _no expected value_ _(none)_
    - :657 `toContainText` expected `"The bias didn't separate from noise"` _(literal)_
    - :658 `toHaveText` expected `'0'` _(literal)_
    - :661 `toBe` expected `k4` _(expression)_
    - :663 `expect` expected _no expected value_ _(none)_
    - :665 `toBe` expected _no expected value_ _(none)_
    - :668 `expect` expected _no expected value_ _(none)_
    - :669 `expect` expected _no expected value_ _(none)_
    - :670 `expect` expected _no expected value_ _(none)_
- `too few pairs fails, and the same differential succeeds once given enough` — e2e/claims.spec.ts:673
    - :681 `toBeVisible` expected _no expected value_ _(none)_
    - :682 `toBeHidden` expected _no expected value_ _(none)_
    - :683 `toBe` expected `k4` _(expression)_
    - :684 `expect` expected _no expected value_ _(none)_
    - :685 `toContainText` expected `'you need more pairs'` _(literal)_
    - :692 `toBeVisible` expected _no expected value_ _(none)_
    - :693 `toBeHidden` expected _no expected value_ _(none)_
    - :694 `toHaveText` expected `k4` _(expression)_
    - :695 `toHaveText` expected `'1'` _(literal)_
- `the pair-count sweep reports a rank per size and lands on rank 1 at the top` — e2e/claims.spec.ts:698
    - :705 `toMatch` expected `/^Sweep complete\. Ranks: /` _(regex)_
    - :710 `toEqual` expected `[50, 100, 200, 500, 1000, 2000]` _(expression)_
    - :712 `expect` expected _no expected value_ _(none)_
    - :713 `expect` expected _no expected value_ _(none)_
    - :716 `toBe` expected `1` _(literal)_
    - :717 `toBeVisible` expected _no expected value_ _(none)_
- `changing the chosen difference throws away pairs collected for the old one` — e2e/claims.spec.ts:720
    - :726 `toBeVisible` expected _no expected value_ _(none)_
    - :729 `toHaveText` expected `'0x07'` _(literal)_
    - :730 `toContainText` expected _no expected value_ _(none)_
    - :733 `toBeHidden` expected _no expected value_ _(none)_
- `S-box changes retire evidence and report the observed rank without a universal recovery claim` — e2e/claims.spec.ts:736
    - :740 `toHaveText` expected `'Weak (toy)'` _(literal)_
    - :741 `toHaveText` expected `'0x5A69'` _(literal)_
    - :747 `toHaveText` expected `'Strong (PRESENT)'` _(literal)_
    - :748 `toContainText` expected _no expected value_ _(none)_
    - :751 `toBeHidden` expected _no expected value_ _(none)_
    - :752 `toContainText` expected `'S-box swapped to "strong"'` _(literal)_
    - :753 `toHaveText` expected `'••'` _(literal)_
    - :765 `expect` expected _no expected value_ _(none)_
    - :767 `toBeVisible` expected _no expected value_ _(none)_
    - :768 `toContainText` expected `'distinct unordered pairs'` _(literal)_
- `DES comparison uses the independently enumerated nontrivial DDT maximum` — e2e/claims.spec.ts:785
    - :788 `toHaveLength` expected `64` _(literal)_
    - :793 `toBe` expected `64` _(literal)_
    - :800 `toHaveText` expected `'${maximum} / ${desRows[0].length}'` _(expression)_
- `PRESENT` — e2e/claims.spec.ts:803
    - :812 `toHaveAttribute` expected `'data-verdict', 'recovered', {` _(expression)_
- `PRESENT rendered trace matches independent published permutation reference` — e2e/claims.spec.ts:816
    - :831 `toContainText` expected `'ciphertext ${expected}'` _(expression)_
    - :832 `toHaveCount` expected `31` _(literal)_
    - :835 `toContainText` expected `'5579C1387B228445'` _(literal)_
    - :837 `toContainText` expected _no expected value_ _(none)_
- `PRESENT bad ${field} length fails closed` — e2e/claims.spec.ts:845
    - :849 `toContainText` expected `'exactly ${n}'` _(expression)_
    - :850 `expect` expected _no expected value_ _(none)_
- `PRESENT printed keys and DDT recompute independently` — e2e/claims.spec.ts:852
    - :859 `toEqual` expected `expected` _(expression)_
    - :861 `toContainText` expected `'K2 ${expected[1]}'` _(expression)_
    - :869 `toBe` expected `4` _(literal)_
    - :870 `toHaveCount` expected `7` _(literal)_
    - :872 `toHaveValue` expected `expected[31]` _(expression)_
- `PRESENT negative claim retains passing checks and alarm despite full recovery` — e2e/claims.spec.ts:874
    - :879 `toHaveCount` expected `8` _(literal)_
    - :880 `toHaveCount` expected `8` _(literal)_
    - :882 `toHaveCount` expected `8, {` _(expression)_
    - :885 `toHaveClass` expected `'present-alarm'` _(literal)_
    - :886 `toContainText` expected _no expected value_ _(none)_
    - :889 `toContainText` expected _no expected value_ _(none)_
    - :892 `toContainText` expected _no expected value_ _(none)_
    - :896 `toHaveCount` expected `1` _(literal)_
    - :897 `toHaveAttribute` expected `'data-key', key.toUpperCase()` _(expression)_
    - :898 `toHaveValue` expected `referenceKeys(key)[31]` _(expression)_
- `PRESENT cancelled unwind marks counters incomplete` — e2e/claims.spec.ts:904
    - :907 `toContainText` expected `'running', { timeout: 120_000 }` _(expression)_
    - :909 `toContainText` expected `'incomplete', {` _(expression)_
    - :912 `toHaveCount` expected `0` _(literal)_
    - :913 `toHaveAttribute` expected `'data-verdict'` _(literal)_
    - :916 `toHaveText` expected `progress` _(expression)_
    - :917 `toHaveCount` expected `0` _(literal)_
    - :918 `toHaveAttribute` expected `'data-verdict'` _(literal)_
- `PRESENT mismatched K32 yields zero survivors` — e2e/claims.spec.ts:921
    - :926 `toHaveAttribute` expected `'data-verdict', 'none', {` _(expression)_
    - :929 `toHaveClass` expected `'present-info'` _(literal)_
    - :930 `toContainText` expected _no expected value_ _(none)_
    - :933 `toContainText` expected _no expected value_ _(none)_
    - :937 `toHaveCount` expected `0` _(literal)_
- `PRESENT leaving the tab mid-run terminates the Worker` — e2e/claims.spec.ts:940
    - :943 `toContainText` expected `'running', { timeout: 120_000 }` _(expression)_
    - :946 `toContainText` expected `'Left PRESENT', {` _(expression)_
    - :949 `toContainText` expected `'incomplete', {` _(expression)_
    - :954 `toHaveText` expected `progress` _(expression)_
    - :955 `toHaveCount` expected `0` _(literal)_
    - :956 `toHaveAttribute` expected `'data-verdict'` _(literal)_
- `PRESENT key change retires a completed recovery` — e2e/claims.spec.ts:959
    - :965 `toHaveAttribute` expected `'data-verdict'` _(literal)_
    - :966 `toHaveClass` expected `/present-alarm/` _(regex)_
    - :967 `toHaveCount` expected `0` _(literal)_
    - :968 `expect` expected _no expected value_ _(none)_
    - :969 `expect` expected _no expected value_ _(none)_
    - :970 `toContainText` expected `'retired'` _(literal)_
- `PRESENT re-entering the same key is a no-op` — e2e/claims.spec.ts:973
    - :981 `toHaveAttribute` expected `'data-verdict', 'recovered', {` _(expression)_
    - :984 `toHaveText` expected `verdict` _(expression)_
    - :985 `toHaveCount` expected `1` _(literal)_
    - :986 `toHaveText` expected `survivor` _(expression)_
    - :987 `toHaveAttribute` expected `'data-key', key!` _(expression)_
    - :988 `toHaveText` expected `pair` _(expression)_
- `PRESENT bad K32 length fails closed` — e2e/claims.spec.ts:991
    - :995 `toContainText` expected `'exactly 16', { timeout: 120_000 }` _(expression)_
    - :996 `toHaveCount` expected `0` _(literal)_
    - :997 `toHaveAttribute` expected `'data-verdict'` _(literal)_
- `PRESENT invariant 3 Worker receives only K32 and the known pair` — e2e/claims.spec.ts:1000
    - :1029 `toHaveLength` expected `1` _(literal)_
    - :1031 `toEqual` expected `['k32', 'pair']` _(expression)_
    - :1032 `toEqual` expected `['plaintext', 'ciphertext']` _(expression)_
    - :1033 `toBe` expected `false` _(expression)_
- `PRESENT highlighted wires map S-box 1 with bit 63 on the left` — e2e/claims.spec.ts:1037
    - :1041 `toHaveAttribute` expected `'aria-label', /bit 63 on the left and bit 0 on the right/` _(expression)_
    - :1042 `toContainText` expected `'input bit (before pLayer)'` _(literal)_
    - :1043 `toContainText` expected `'output bit (after pLayer)'` _(literal)_
    - :1044 `toEqual` expected `[` _(expression)_
    - :1060 `toHaveLength` expected `4` _(literal)_
    - :1061 `toEqual` expected `[` _(expression)_
    - :1067 `expect` expected _no expected value_ _(none)_
- `PRESENT all four printed Appendix I vectors recompute independently` — e2e/claims.spec.ts:1070
    - :1073 `toHaveCount` expected `4` _(literal)_
    - :1080 `expect` expected _no expected value_ _(none)_
    - :1084 `toBe` expected `expected` _(expression)_
    - :1085 `toBe` expected `plaintext` _(expression)_
    - :1086 `toBe` expected `referenceDecrypt(BigInt('0x' + ciphertext), key)` _(expression)_
    - :1087 `toBe` expected _no expected value_ _(none)_
    - :1090 `toHaveAttribute` expected `'data-verdict', 'pass'` _(expression)_
    - :1091 `toContainText` expected `'✓ matches CHES 2007 Appendix I'` _(literal)_
    - :1093 `toEqual` expected `[` _(expression)_

**Mutation records** (3 file(s)):

- `mutation-evidence-present.json` (18279 bytes)
- `scripts/check-present-mutations.mjs` (9637 bytes)
- `src/crypto/permutation.ts` (1939 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-biham-lens

## What It Is

**Differential cryptanalysis** is a chosen-plaintext attack on block ciphers that exploits how plaintext differences propagate through encryption to recover key material. Co-invented by Eli Biham and Adi Shamir in 1990, it fundamentally transformed cryptography by proving that large key sizes and block sizes alone do not guarantee security — the underlying mathematical structure must be carefully designed. The first two panels demonstrate a statistical attack on a simplified 4-round SPN. The FEAL-4 panel applies round peeling to a published cipher with a probability-1 differential.

The toy’s strong S-box is PRESENT’s S-box; the PRESENT tab runs the full PRESENT-80 cipher and its reversible key schedule.

## When to Use It

Differential cryptanalysis is relevant as a cryptanalytic tool in these scenarios:

- **Red-team cipher evaluation**: When assessing the strength of a new block cipher design, differential cryptanalysis is one of the first attacks to attempt; success indicates weak S-box selection or insufficient rounds. DES fell to this attack on 8 rounds out of 16.
- **Historical cipher analysis**: When reverse-engineering or analyzing older ciphers (pre-1990 designs) lacking differential resistance, this attack can break much of the cipher's strength faster than brute force.
- **Threshold security analysis**: When you have chosen-plaintext oracle access, a differential attack can beat exhaustive search by tens of bits — full 16-round DES falls to 2^47 chosen plaintexts against a 2^56 key space. (Do not read the toy cipher here as evidence of that: its 500–1000 pairs are compared against a 16-bit key space, where brute force wins outright. The demo exists to make the *mechanism* visible, not the saving.)
- **Academic cryptanalysis**: For understanding how AES and Serpent use S-boxes and diffusion, while ARX designs such as ChaCha use addition, rotation and XOR. Each design needs its own differential analysis.
- **When NOT to use this demonstration as evidence of a break**: the displayed chosen-plaintext attack needs its stated oracle access and differential. Strong S-boxes and additional rounds can raise attack cost, but neither an S-box bound nor a generic round-count threshold proves immunity. Feasibility requires analysis of the complete cipher and attack model.
- **Do NOT treat the toy 4-round SPN here as a real cipher**: it is a teaching demo built to make the attack visible, not production-strength cryptography.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-biham-lens](https://systemslibrarian.github.io/crypto-lab-biham-lens/)**

The interactive browser demo lets you collect ciphertext pairs from a toy 4-round SPN cipher and run a real last-round key recovery attack. You choose plaintext differences, collect ~500 ciphertext pairs corresponding to those differences, and the demo analyzes the statistical bias in the resulting pairs to recover the last round's 8-bit subkey. The demo includes visualizations of how differences propagate through S-box substitution and bit permutation, interactive exploration of the Difference Distribution Table (DDT), and a historical timeline of the attack's discovery and impact.

### FEAL-4 extension

The **3 · FEAL-4** tab encrypts 64-bit blocks with FEAL-4's published 64-bit key schedule, traces a chosen difference through its four Feistel rounds, and attacks an encryption oracle in a Web Worker. The default 6 A pairs and 4 B pairs query **20 chosen plaintexts**; an expandable table shows every plaintext pair and oracle reply. A funnel shows surviving partial keys as rounds 4, 3, 2, and 1 are peeled. Every full candidate is then tested against **64 fresh ciphertexts** that were generated after recovery. The verdict shows one fresh plaintext, its ciphertext, and decryption with an equivalent key. These 64 verification queries are separate from the 20 attack queries.

The result is **equivalent round-key and whitening material**, sufficient to decrypt unseen blocks. It is **not the 64-bit master key**: the attack never uses or inverts the key schedule. The FEAL engine is separate from the toy SPN engine because the latter ranks 256 subkeys by statistical bias, while FEAL filters a 32-bit effective round-key space by exact differences. Cipher output is cross-checked against [CrypTool 2's FEAL implementation](https://github.com/CrypToolProject/CrypTool-2/blob/main/CrypPlugins/FEAL/FEAL_Algorithms.cs). [Murphy's 1990 paper](https://doi.org/10.1007/BF00190801) describes master-key recovery with at most 20 chosen plaintexts; this panel uses a classroom round-peeling variant.

### PRESENT extension

The **PRESENT** tab runs all 31 rounds, all 32 round keys, the published S-box and bit permutation, and inverse decryption. Six acts enumerate the DDT and Walsh table, draw the 64 wires, step the register, trace encryption, distinguish observed differences from the cited five-round theorem, and recover the master key from **already known K32** plus one pair by searching all 65,536 suffixes in a cancellable Worker. The Worker receives no master key.

Theorem 1 is cited, not proved by the observed trace. Condition 4 as printed is not asserted: the computed single-bit Walsh entries include zero. Passing the design checks does not hide the master key from a holder of K32. This is a key-schedule consequence, not an attack obtaining the round key. PRESENT-128 is not implemented.

## What Can Go Wrong

Real failure modes and pitfalls in differential cryptanalysis and its defense:

- **Weak S-box selection**: DES's S-boxes were hardened against differential attacks by their IBM designers in the 1970s, under an NSA requirement that the reasoning stay classified; many S-box designs without this care exhibit high-probability differentials, allowing attacks with fewer than 500 pairs. The largest DDT entry across DES's 6→4-bit S-boxes is 16 out of 64 (a differential probability of 1/4); the toy 4-bit S-box in this demo peaks at 8 out of 16 (1/2), while the PRESENT S-box it can be swapped for peaks at 4 out of 16 (1/4), the best a 4-bit permutation can do.
- **Insufficient rounds**: Diffusion and additional active S-boxes can lower characteristic probabilities and raise data requirements; there is no universal per-round cost law. Serpent's 32 rounds were chosen for a substantial security margin, not a proof of immunity. See [the designers' proposal](https://www.cl.cam.ac.uk/archive/rja14/Papers/serpent.pdf).
- **Biased round key schedule**: If the round subkeys are derived deterministically from a master key with low entropy or poor diffusion, recovering one subkey may leak information about others, amplifying the attack. Independent-round differential estimates assume independent subkeys; this toy uses a rotating, dependent schedule, so its fixed-key observations can differ.
- **Implementation padding and oracle feedback**: If the target cipher implementation returns detailed error information (e.g., "decryption failed at S-box stage 2"), an attacker can narrow the search before the cryptanalysis step, reducing pairs needed further. Constant-time implementations resist such leakage.
- **Statistical correlation in pair collection**: If the ciphertext pairs are not collected uniformly at random (e.g., due to a biased pseudorandom number generator), the observed differential bias may be distorted, leading to incorrect key recovery or spurious high-ranking candidates.

## Real-World Usage

Systems and standards that must resist differential cryptanalysis or use concepts derived from it:

- **DES (1977)**: The IBM team that designed DES already knew differential cryptanalysis — internally, the "T attack" — and chose the S-boxes to resist it, with the NSA requiring that the criterion stay classified. Don Coppersmith, who did that S-box work, said so publicly in 1994 (*IBM Journal of Research and Development* 38(3)), four years after Biham and Shamir's independent rediscovery. Modern software implementations are still used for legacy compatibility, making them targets for differential attacks on reduced-round variants.
- **SERPENT cipher (1998)**: Co-designed by Ross Anderson, Eli Biham and Lars Knudsen, Serpent uses 32 rounds and S-boxes with a maximum DDT entry of 4 — roughly twice the rounds its designers argued were needed to put differential and linear attacks out of reach. That margin is a design argument rather than a proof of immunity, which is exactly the point: nobody can prove a cipher secure, so you buy rounds. It lost the AES competition to Rijndael but remains a reference design for differential-resistant ciphers.
- **Advanced Encryption Standard (AES / Rijndael, 2001)**: The winning AES design includes a strong S-box with minimal DDT entries (max 4) and one MixColumns layer per ordinary round and none in the final round. The wide-trail argument bounds individual trails under its assumptions; a differential sums trails, and a trail bound alone does not prove full-cipher security.
- **SPECK and SIMON (NSA, 2013)**: These lightweight block-cipher families are studied using differential cryptanalysis. Neither uses a lookup-table S-box: SPECK uses addition, rotation and XOR; SIMON uses AND, rotation and XOR. Their round functions require analysis specific to those operations.
- **NIST Post-Quantum Cryptography Standards (2022–present)**: While primarily focused on lattice and code-based systems, standardization bodies explicitly evaluate lattice-based and permutation-based candidates for resistance to known attacks including differential-like statistical analysis, extending the lessons of differential cryptanalysis to the post-quantum era.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-biham-lens
cd crypto-lab-biham-lens
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-iron-serpent](https://systemslibrarian.github.io/crypto-lab-iron-serpent/) — the Serpent cipher, co-designed by Biham for differential resistance.
- [crypto-lab-padding-oracle](https://systemslibrarian.github.io/crypto-lab-padding-oracle/) — a different chosen-ciphertext attack on AES-CBC.
- [crypto-lab-collision-vault](https://systemslibrarian.github.io/crypto-lab-collision-vault/) — collision attacks on MD5 and SHA-1.
- [crypto-lab-vigenere-break](https://systemslibrarian.github.io/crypto-lab-vigenere-break/) — classical statistical cryptanalysis of the Vigenère cipher.
- [crypto-lab-enigma-forge](https://systemslibrarian.github.io/crypto-lab-enigma-forge/) — Enigma and the Bombe, a historical cryptanalysis story.

## Build & Verify

Verified on this revision: **38 unit tests passed, 0 failed, 0 skipped** (`node --import tsx --test`); **43 browser tests passed, 0 failed, 0 skipped, 0 flaky**, with `--retries=0`. The build also passes both publishing-command tests. The act-6 negative-claim test records Worker seconds as an annotation, not a performance gate.

`​``bash
npm ci
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:a11y -- --retries=0
node scripts/check-present-mutations.mjs
`​``

PRESENT uses [Bogdanov et al., CHES 2007](https://crypto.orange-labs.fr/papers/ches2007-450.pdf), §3, §4.3, §5.1, Appendix I. Published plaintext / key / ciphertext vectors:

| Plaintext | Key | Ciphertext |
|---|---|---|
| 0000000000000000 | 00000000000000000000 | 5579C1387B228445 |
| 0000000000000000 | FFFFFFFFFFFFFFFFFFFF | E72C46C0F5945049 |
| FFFFFFFFFFFFFFFF | 00000000000000000000 | A112FFC72F68417B |
| FFFFFFFFFFFFFFFF | FFFFFFFFFFFFFFFFFFFF | 3333DCD3213210D2 |

Labelled independent cross-checks (not published vectors): `0123456789ABCDEF / 00112233445566778899 → 1A6D783F0C184F4D`; `FEDCBA9876543210 / 0123456789ABCDEF0123 → CB7D344F360DE3B1`. The tests also check every permutation position, all byte-table inputs, every key-register reversal, exhaustive S-box facts, and three complete searches whose real suffixes are in the upper half. Browser tests recompute the cipher using a separate table-driven implementation, test fail-closed paths, and scan every act at desktop and 320px. Existing SPN and FEAL gates remain in place. Mutation evidence records builds, assertion kills, restored hashes and restored passing tests.


---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Reduced-round ChaCha context

The live demo links [EUROCRYPT 2025 bit-puncturing research](https://eprint.iacr.org/2025/437), labels reduced-round results and paper estimates, and distinguishes them from full ChaCha20 and from the attacks these labs actually execute. No reduced-round cipher replaces normal encryption.

## Differential model and data scope

The default attacker preprocessing uses only the public S-box and permutation, with independent uniform round-input assumptions. It does not access victim-key intermediate states. The separately selected instructor-assisted mode enumerates all 256 inputs under the actual key and shows one contributing three-round trail alongside the endpoint count. Nonzero input differences give 128 distinct unordered pairs; repeated samples are counted separately from distinct data. The displayed true-key rank is instructor evaluation, not information given to preprocessing or key ranking.

Source: Eli Biham and Adi Shamir, *Differential Cryptanalysis of the Data Encryption Standard* (1993; authors’ 7 December 2009 rendering), §§3.3–3.4, printed pp. 22–30 / supplied PDF pp. 28–36. Independent-round assumptions do not hold automatically for this toy's rotating key schedule.

```

</details>

---

## Padding Oracle

- **slug**: `crypto-lab-padding-oracle`
- **repo**: https://github.com/systemslibrarian/crypto-lab-padding-oracle
- **live**: https://systemslibrarian.github.io/crypto-lab-padding-oracle/
- **commit_sha**: `757cbbc0e9c970794021121d5874e9d27033841a` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: intermediate  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, claims, verification

**Name (H1)**: Padding Oracle  — _read from index.html_

**Subtitle**: AES-CBC · PKCS#7 · Vaudenay 2002  — _read from index.html_

**Description**: Recover AES-CBC plaintext byte by byte when a matching valid/invalid padding oracle is exposed — no key recovery required — then watch authenticated decryption shut the oracle down.  — _read from index.html_

**Why it matters**: Padding oracles have affected deployed systems including TLS and ASP.NET. They show why ciphertext must be authenticated before padded CBC is decrypted, and why AEAD is the default for new designs.  — _read from index.html_

**Card copy**: Full Vaudenay 2002 chosen-ciphertext attack with real AES-CBC, byte-by-byte plaintext recovery, and coverage of ASP.NET, Lucky Thirteen, and POODLE.

**Chips**: AES-CBC · PKCS#7 · Vaudenay 2002 · POODLE

**Implements**: AES `src/oracle.ts:96`, AES-CBC `src/oracle.ts:96`, AES-GCM `src/ui.ts:982`, HMAC `src/oracle.ts:82`, SHA-256 `src/oracle.ts:116`

**Attacks shown**: Chosen-ciphertext attack `src/exploits.ts:50`, Chosen-plaintext attack `src/exploits.ts:167`, IV reuse `src/exploits.ts:180`, Known-plaintext attack `src/exploits.ts:172`, Man-in-the-middle `src/exploits.ts:139`, Nonce reuse `README.md:72`, Padding oracle `index.html:41`, Side-channel (unspecified) `README.md:46`, Timing side-channel `src/exploits.ts:102`

**References**: AES-CCM, AES-SIV, ChaCha20, ChaCha20-Poly1305, IPsec ESP, Poly1305, SHA-1, TLS 1.3

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `EUROCRYPT 2002` — first seen README.md:77 (4×)
- `eurocrypt2002` — first seen README.md:77 (3×)
- `RFC 8446` — first seen README.md:53 (4×)
- `RFC 9846` — first seen README.md:53 (7×)
- `rfc9846` — first seen README.md:83 (2×)

**Stated limitations (page)**:

- _(caveat, index.html)_ Requires: Constant-time MAC comparison. Timing differences in comparison can still leak information.
- _(caveat, index.html)_ Limitation: This reduces one timing signal but is not a complete fix. Later MAC processing, error paths, or downstream behavior can still reveal padding. Lucky Thirteen shows that very small timing differences matter.

**README — What Can Go Wrong**:

```text
- **Distinguishable error responses** — any reliably different response after padding validation can supply the one-bit oracle; this is what broke ASP.NET (MS10-070 / CVE-2010-3332). A particular HTTP status-code pair is not required.
- **Timing side-channels in padding validation** — even constant-time padding checks can leak information through MAC computation length differences, as demonstrated by Lucky Thirteen against TLS CBC cipher suites.
- **Ignored padding bytes in SSL 3.0** — SSL 3.0 only validates the last padding byte, allowing POODLE to recover one plaintext byte per ~256 requests without a traditional padding oracle.
- **Predictable IVs in TLS 1.0** — reusing the last ciphertext block as the next record's IV (BEAST) enables a related chosen-plaintext attack against CBC, even without a padding oracle.
- **Processing unauthenticated CBC** — verify integrity over the IV, ciphertext, and relevant context before attempting padded CBC decryption. Prefer a reviewed AEAD construction such as AES-GCM or ChaCha20-Poly1305 for new designs.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records** (2 file(s)):

- `mutation-evidence.json` (8718 bytes)
- `scripts/claim-mutations.mjs` (6544 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-padding-oracle

## What It Is

`crypto-lab-padding-oracle` is a browser-based interactive demonstration of the **CBC padding oracle attack** (Vaudenay 2002) — a chosen-ciphertext attack that recovers CBC ciphertext accepted under the oracle's key without recovering that key, using only observable padding validity. All cryptographic operations use the browser's native WebCrypto API: real AES-128-CBC encryption with PKCS#7 padding, real AES-256-GCM for the AEAD defense demo, and real padding validation on queries that reach CBC decryption; the Encrypt-then-MAC server rejects modified ciphertext before that check. The attack exploits CBC combined with observable padding behavior, not a weakness in AES itself.

## When to Use It

- **Teaching the Vaudenay 2002 attack** — the demo walks through byte-by-byte recovery, full-block recovery, and multi-block decryption with live oracle query counts, making the O(256 × 16 × n) complexity tangible.
- **Auditing legacy CBC implementations** — understanding how a padding oracle arises (HTTP error codes, TLS alerts, timing differences) is essential before assessing whether a system is vulnerable.
- **Comparing CBC defenses** — Panel 6 runs the same attack against leaky CBC, uniform-response CBC, and Encrypt-then-MAC, then demonstrates AES-256-GCM tamper rejection.
- **Security training and CTF preparation** — the interactive byte-grid visualizer and speed controls make the attack mechanics concrete for hands-on learners.
- Do NOT use this as a production encryption library — it is a teaching demo; the oracle and key live in the same browser context; there is no network oracle, no real confidentiality boundary, and no key management.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-padding-oracle](https://systemslibrarian.github.io/crypto-lab-padding-oracle/)**

The demo has six tabbed panels. Panels 2–4 let you encrypt bounded learner-provided plaintext with a random AES-128-CBC key, then run the padding oracle attack at adjustable speeds (slow/medium/fast) while watching byte-by-byte recovery on an interactive grid. The full-ciphertext panel caps input at 128 UTF-8 bytes so a browser exercise cannot turn into an unbounded WebCrypto workload. Panel 6 lets you encrypt with AES-256-GCM, tamper with the ciphertext, and see authenticated decryption reject without returning plaintext.

Four parts of the page are exercises rather than statements:

- **Panel 1 — craft the last padding byte.** Set up a ciphertext whose final block decrypts to a full padding block, choose what its last decrypted byte becomes (the page XORs the difference into `C[n−1][15]`, exactly as the attack does), and commit to *valid* or *invalid* before the real WebCrypto oracle answers. Your running score is kept.
- **Panel 3 — you pick the target block.** The plaintext to recover is typed by the learner, with a live byte count, instead of being fixed in the source.
- **Panel 6 — the same attack against three servers.** The identical `recoverBlock()` runs against a leaky server, a server that performs the same padding check but answers identically whatever it found, and an Encrypt-then-MAC server. The leaky one gives up its plaintext; against the other two the attack genuinely fails — it exhausts all 256 probes for a byte and stops. The table reports oracle queries, how many reached the padding check, and how many died at MAC verification, so "this defense works" is a counter rather than a caption.
- **Panels 3 and 4 — graded recovery.** Both compare the recovered bytes against the plaintext the session actually encrypted and print a byte-for-byte match badge (or a mismatch), rather than echoing the input back.

## Testing

`​``bash
npm test          # node --test: the attack engine, plus the three server modes
npm run type-check
npm run test:a11y # Playwright: WCAG A/AA scan and the functional exhibit gates
npm run test:workflow
npm run test:mutations
`​``

`e2e/attack.spec.ts` drives the shipped page: recovered plaintext and the byte-for-byte badges,
the oracle query counters, the AES-GCM rejection (and that the protected message never appears),
the learner padding predictions, and the defense bench — including the two servers the attack must
fail against.

## What Can Go Wrong

- **Distinguishable error responses** — any reliably different response after padding validation can supply the one-bit oracle; this is what broke ASP.NET (MS10-070 / CVE-2010-3332). A particular HTTP status-code pair is not required.
- **Timing side-channels in padding validation** — even constant-time padding checks can leak information through MAC computation length differences, as demonstrated by Lucky Thirteen against TLS CBC cipher suites.
- **Ignored padding bytes in SSL 3.0** — SSL 3.0 only validates the last padding byte, allowing POODLE to recover one plaintext byte per ~256 requests without a traditional padding oracle.
- **Predictable IVs in TLS 1.0** — reusing the last ciphertext block as the next record's IV (BEAST) enables a related chosen-plaintext attack against CBC, even without a padding oracle.
- **Processing unauthenticated CBC** — verify integrity over the IV, ciphertext, and relevant context before attempting padded CBC decryption. Prefer a reviewed AEAD construction such as AES-GCM or ChaCha20-Poly1305 for new designs.

## Real-World Usage

- **TLS 1.0–1.2** — these versions supported CBC suites. The current TLS 1.3 specification, RFC 9846 (2026), obsoletes RFC 8446 and defines no CBC suites.
- **ASP.NET encrypted data** — MS10-070 documented padding-dependent error information that could disclose encrypted data such as ViewState and enable tampering. Microsoft's update added authentication to encrypted ASP.NET data.
- **IPsec ESP** — the Encapsulating Security Payload protocol supports AES-CBC mode for VPN tunnels; implementations must use Encrypt-then-MAC to avoid padding oracles.
- **OpenSSL / GnuTLS / NSS** — all three major TLS libraries required patches for Lucky Thirteen timing side-channels in their CBC padding validation paths.
- **PKCS#7 / CMS (S/MIME)** — the Cryptographic Message Syntax uses CBC with PKCS#7 padding for email encryption; Efail (2018) demonstrated related plaintext exfiltration against S/MIME implementations.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-padding-oracle
cd crypto-lab-padding-oracle
npm ci
npm run dev
`​``

## Related Demos

- [crypto-lab-aes-modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/) — CBC, CTR, and GCM modes with a padding-oracle panel included.
- [crypto-lab-timing-oracle](https://systemslibrarian.github.io/crypto-lab-timing-oracle/) — timing-attack oracles, companion to Lucky Thirteen.
- [crypto-lab-nonce-guard](https://systemslibrarian.github.io/crypto-lab-nonce-guard/) — AES-GCM nonce reuse and the AES-GCM-SIV defense.
- [crypto-lab-shadow-vault](https://systemslibrarian.github.io/crypto-lab-shadow-vault/) — ChaCha20-Poly1305 AEAD in depth.

## Citations

- **Vaudenay, S. (2002).** Security Flaws Induced by CBC Padding — Applications to SSL, IPSEC, WTLS. *EUROCRYPT 2002, LNCS 2332, pp. 534-545.* [PDF](https://www.iacr.org/archive/eurocrypt2002/23320530/cbc02_e02d.pdf)
- **Al Fardan, N.J. & Paterson, K.G. (2013).** Lucky Thirteen: Breaking the TLS and DTLS Record Protocols. *IEEE S&P 2013.* [PDF](https://www.isg.rhul.ac.uk/tls/TLStiming.pdf)
- **Möller, B., Duong, T., & Kotowicz, K. (2014).** This POODLE Bites: Exploiting the SSL 3.0 Fallback. *Google Security Research.* [PDF](https://openssl-library.org/files/ssl-poodle.pdf)
- **Duong, T. & Rizzo, J. (2011).** Here Come The ⊕ Ninjas. *Ekoparty 2011.*
- **Microsoft (2010).** [MS10-070: Vulnerability in ASP.NET Could Allow Information Disclosure](https://learn.microsoft.com/en-us/security-updates/SecurityBulletins/2010/ms10-070).
- **Microsoft.** [Timing vulnerabilities with CBC-mode symmetric decryption using padding](https://learn.microsoft.com/en-us/dotnet/standard/security/vulnerabilities-cbc-mode).
- **Rescorla, E. (2026).** [TLS 1.3, RFC 9846](https://www.rfc-editor.org/info/rfc9846/) (obsoletes RFC 8446).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Timing Oracle

- **slug**: `crypto-lab-timing-oracle`
- **repo**: https://github.com/systemslibrarian/crypto-lab-timing-oracle
- **live**: https://systemslibrarian.github.io/crypto-lab-timing-oracle/
- **commit_sha**: `6cb88e47b2fae14a0a703d4519899fce9b9d971e` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `d647ed2d1ca70d77425bd39fe9f204e4bf60705f`
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: advanced  ·  **--accent**: #007a6b
- **MISSING FIELDS**: spec_citations, mutations, verification

**Name (H1)**: Timing Oracle  — _read from src/ui.ts_

**Subtitle**: Timing side-channels · Constant-time defenses  — _read from src/ui.ts_

**Description**: Runs vulnerable vs constant-time string comparison, HMAC verification, RSA exponentiation, and cache access in your browser and measures whether a secret-dependent timing signal is detectable.  — _read from src/ui.ts_

**Why it matters**: Choosing the right algorithm is not enough: timing leaks have broken RSA, AES, HMAC, and TLS in shipped systems. When execution time depends on secret data, an attacker who measures it can recover keys and MACs, which is why constant-time code is mandatory in crypto.  — _read from src/ui.ts_

**Card copy**: String comparison leakage, HMAC verification timing, RSA private key bit leakage, and cache-timing attacks with real performance.now() measurements.

**Chips**: Timing Attack · HMAC · RSA · Cache-Timing

**Implements**: HMAC `src/hmac.ts:60`, Montgomery ladder `src/rsa.ts:64`, RSA `src/rsa.ts:156`, RSA-PSS `src/rsa.ts:183`, SHA-256 `src/hmac.ts:70`

**Attacks shown**: Cache timing `src/cache.ts:12`, Fault injection `README.md:51`, Key recovery `README.md:25`, Padding oracle `README.md:48`, Side-channel (unspecified) `src/ui.ts:146`, Timing side-channel `src/animate.ts:269`

**References**: AES, AES-GCM, Argon2, Diffie-Hellman, HQC, ML-KEM, bcrypt, scrypt

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Stated limitations (page)**:

- _(caveat, src/ui.ts)_ Honest caveat: the "constant-time" JS here has a uniform instruction schedule, but JavaScript is not truly constant-time at the engine level — JIT, GC, and branch prediction can still add data-dependent variation. In production, use a vetted native primitive.
- _(caveat, src/ui.ts)_ Note: the L1–DRAM ladder above is a fixed reference diagram of typical hardware latencies, not values measured in your browser. The measured result is the cached-vs-uncached chart; browsers cannot expose real cache-line timing to JavaScript.
- _(caveat, src/ui.ts)_ Caveat for this demo: the constant-time code here fixes the instruction schedule (no secret-dependent branch, loop, or memory access), which is the property being taught — but a managed runtime like JavaScript is not guaranteed constant-time end-to-end. Real deployments rely on audited native primitives (libsodium, BoringSSL) and, where possible, hardware instructions.

**README — What Can Go Wrong**:

```text
- Naive `==`/`memcmp`-style comparison of secrets, MACs, or tokens returns early on the first mismatched byte, leaking how much of a guess is correct one character at a time.
- Secret-dependent branches and table lookups (square-and-multiply exponentiation, S-box accesses) create data-dependent timing that statistical sampling can amplify into key recovery.
- A "no leak" result in a coarse-timer environment is not a safety proof — a more precise timer, a co-resident attacker, or more samples can resolve a signal this run could not.
- Cache-timing depends on the memory hierarchy and can leak across process and tenant boundaries, so even "constant-time" source can be undermined by the CPU and compiler.
- Source-level constant-time discipline does not guarantee engine-level constant time: a JIT, GC, bounds checks, or string interning can reintroduce data-dependent timing the language cannot control.
```

**Claims tested** (e2e/claims.spec.ts, 24 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:32
    - :32 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:38
    - :38 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:39
    - :39 `toBeEnabled` expected `{ timeout: 90_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:40
    - :40 `toHaveAttribute` expected `'aria-busy', 'true'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:47
    - :47 `toBeEnabled` expected `{ timeout: 90_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:49
    - :49 `toHaveAttribute` expected `'aria-busy', 'true', { timeout: 90_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:50
    - :50 `toBeEnabled` expected `{ timeout: 90_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:58
    - :58 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:76
    - :76 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:78
    - :78 `toBe` expected `true` _(expression)_
- `panel 1 mechanism counts the exact characters the compare loop inspects` — e2e/claims.spec.ts:113
    - :130 `toBe` expected `8` _(literal)_
    - :131 `toBe` expected `4` _(literal)_
    - :132 `toBe` expected `1` _(literal)_
    - :134 `toBe` expected `cells.length` _(expression)_
    - :135 `toBe` expected `3` _(literal)_
    - :140 `toBe` expected `matched + mismatched` _(expression)_
    - :142 `toBe` expected `cells.length` _(expression)_
    - :145 `expect` expected _no expected value_ _(none)_
    - :146 `expect` expected _no expected value_ _(none)_
    - :147 `expect` expected _no expected value_ _(none)_
    - :153 `expect` expected _no expected value_ _(none)_
    - :158 `expect` expected _no expected value_ _(none)_
    - :159 `toBe` expected `'8'` _(literal)_
- `panel 1 mechanism reports zero checks when the length gate fires` — e2e/claims.spec.ts:162
    - :183 `expect` expected _no expected value_ _(none)_
    - :184 `expect` expected _no expected value_ _(none)_
    - :190 `toBe` expected `0` _(literal)_
    - :194 `toBe` expected `cells.length` _(expression)_
    - :197 `expect` expected _no expected value_ _(none)_
    - :198 `expect` expected _no expected value_ _(none)_
    - :199 `expect` expected _no expected value_ _(none)_
    - :201 `expect` expected _no expected value_ _(none)_
    - :205 `expect` expected _no expected value_ _(none)_
- `panel 1 verdict follows the timing gap the same panel reported` — e2e/claims.spec.ts:211
    - :224 `expect` expected _no expected value_ _(none)_
    - :230 `expect` expected _no expected value_ _(none)_
    - :231 `expect` expected _no expected value_ _(none)_
    - :236 `toMatch` expected _no expected value_ _(none)_
    - :239 `toMatch` expected _no expected value_ _(none)_
    - :247 `toMatch` expected `/stayed flat/iu` _(regex)_
    - :248 `expect` expected _no expected value_ _(none)_
    - :254 `expect` expected _no expected value_ _(none)_
    - :255 `expect` expected _no expected value_ _(none)_
    - :256 `expect` expected _no expected value_ _(none)_
    - :259 `expect` expected _no expected value_ _(none)_
    - :272 `expect` expected _no expected value_ _(none)_
    - :273 `expect` expected _no expected value_ _(none)_
    - :274 `expect` expected _no expected value_ _(none)_
    - :278 `expect` expected _no expected value_ _(none)_
    - :280 `toBe` expected `0` _(literal)_
    - :281 `toBe` expected `25` _(literal)_
    - :282 `toEqual` expected `prefixes` _(expression)_
- `panel 2 shows the real HMAC of the message and a verdict its own numbers support` — e2e/claims.spec.ts:285
    - :308 `expect` expected _no expected value_ _(none)_
    - :311 `toEqual` expected `[0, 4, 8, 12, 16]` _(expression)_
    - :318 `expect` expected _no expected value_ _(none)_
    - :319 `expect` expected _no expected value_ _(none)_
    - :324 `expect` expected _no expected value_ _(none)_
    - :325 `expect` expected _no expected value_ _(none)_
    - :326 `expect` expected _no expected value_ _(none)_
    - :328 `expect` expected _no expected value_ _(none)_
- `panel 3 multiply counts equal the exponent Hamming weight the page rendered` — e2e/claims.spec.ts:335
    - :342 `expect` expected _no expected value_ _(none)_
    - :343 `toBe` expected `true` _(expression)_
    - :347 `toBe` expected `bits.length` _(expression)_
    - :353 `toBe` expected `'${bits.length} squares · ${ones} multiplies'` _(expression)_
    - :354 `toBe` expected `'${bits.length} squares · ${bits.length} multiplies'` _(expression)_
    - :357 `toBe` expected `RSA_WINDOW_BITS` _(expression)_
    - :360 `expect` expected _no expected value_ _(none)_
    - :361 `expect` expected _no expected value_ _(none)_
    - :366 `expect` expected _no expected value_ _(none)_
    - :370 `toEqual` expected `[` _(expression)_
    - :379 `expect` expected _no expected value_ _(none)_
    - :380 `expect` expected _no expected value_ _(none)_
    - :386 `expect` expected _no expected value_ _(none)_
    - :388 `expect` expected _no expected value_ _(none)_
    - :389 `expect` expected _no expected value_ _(none)_
    - :391 `expect` expected _no expected value_ _(none)_
- `panel 3 ladder tally does not move across freshly generated keys` — e2e/claims.spec.ts:398
    - :424 `expect` expected _no expected value_ _(none)_
    - :430 `toBe` expected `1` _(literal)_
    - :431 `toBe` expected `RSA_WINDOW_BITS` _(expression)_
    - :432 `expect` expected _no expected value_ _(none)_
    - :436 `toBe` expected `'${RSA_WINDOW_BITS} squares · ${RSA_WINDOW_BITS} multiplies'` _(expression)_
    - :439 `expect` expected _no expected value_ _(none)_
- `panel 4 cache verdict is recomputed from the cached/uncached means it published` — e2e/claims.spec.ts:442
    - :449 `toEqual` expected `['Cached', 'Uncached']` _(expression)_
    - :452 `expect` expected _no expected value_ _(none)_
    - :453 `expect` expected _no expected value_ _(none)_
    - :456 `expect` expected _no expected value_ _(none)_
    - :457 `expect` expected _no expected value_ _(none)_
    - :464 `expect` expected _no expected value_ _(none)_
    - :474 `expect` expected _no expected value_ _(none)_
    - :478 `expect` expected _no expected value_ _(none)_
    - :480 `expect` expected _no expected value_ _(none)_
    - :488 `toBe` expected `'~1 ns'` _(literal)_
    - :489 `toBe` expected `'~80 ns'` _(literal)_
    - :491 `toBe` expected `'~1 ns'` _(literal)_
    - :492 `toBe` expected `'~80 ns'` _(literal)_
- `regression: a verdict never outlives the inputs it was measured from` — e2e/claims.spec.ts:495
    - :500 `toMatch` expected `/Timing signal observed this run|Both paths drifted this run|Signal below noise/u` _(regex)_
    - :501 `toBe` expected `1` _(literal)_
    - :506 `toContainText` expected `'Inputs changed'` _(literal)_
    - :510 `toContainText` expected `measured!.split('.')[0]!.replace(/^[⚠✓•]\s*/u, '').trim()` _(expression)_
    - :511 `expect` expected _no expected value_ _(none)_
    - :512 `toBe` expected `0` _(literal)_
    - :516 `toContainText` expected `/Timing signal observed this run|Both paths drifted this run|Signal below noise/u` _(regex)_
    - :517 `toBe` expected `1` _(literal)_
    - :523 `toContainText` expected `'Inputs changed'` _(literal)_
    - :524 `expect` expected _no expected value_ _(none)_
    - :526 `toContainText` expected `'Inputs changed'` _(literal)_
    - :529 `toContainText` expected `newMac.slice(0, 16)` _(expression)_
- `regression: a verdict does not outlive inputs changed while the run is still in flight` — e2e/claims.spec.ts:532
    - :542 `expect` expected _no expected value_ _(none)_
    - :574 `toBeEnabled` expected `{ timeout: 90_000 }` _(expression)_
    - :577 `toContainText` expected `'Inputs changed'` _(literal)_
    - :578 `expect` expected _no expected value_ _(none)_
    - :579 `toBe` expected `0` _(literal)_
    - :580 `toBe` expected `NEW` _(expression)_
    - :585 `expect` expected _no expected value_ _(none)_
    - :586 `toContainText` expected `'Inputs changed'` _(literal)_
    - :590 `toContainText` expected `newMac.slice(0, 16)` _(expression)_
- `regression: malformed MAC hex reaches the failure state and names the cause` — e2e/claims.spec.ts:593
    - :602 `toContainText` expected `'hex'` _(literal)_
    - :603 `toContainText` expected `'Run failed'` _(literal)_
    - :604 `toContainText` expected `'hex'` _(literal)_
    - :605 `toContainText` expected `'HMAC timing run failed'` _(literal)_
    - :606 `toBe` expected `0` _(literal)_
    - :611 `toContainText` expected `'even length'` _(literal)_
    - :616 `expect` expected _no expected value_ _(none)_
    - :617 `toContainText` expected `'Run failed'` _(literal)_
    - :618 `toBe` expected `1` _(literal)_
- `an RSA benchmark failure is reported with its cause and leaves the control usable` — e2e/claims.spec.ts:621
    - :635 `toContainText` expected `'RSA run failed'` _(literal)_
    - :636 `toContainText` expected `'injected WebCrypto keygen failure'` _(literal)_
    - :637 `toContainText` expected `'injected WebCrypto keygen failure'` _(literal)_
    - :638 `toBe` expected `0` _(literal)_
    - :641 `toBeEnabled` expected _no expected value_ _(none)_
    - :643 `toContainText` expected `'RSA run failed'` _(literal)_
- `the modeled overlay is drawn, labelled as modeled, and changes no measurement` — e2e/claims.spec.ts:651
    - :673 `toBeChecked` expected _no expected value_ _(none)_
    - :678 `expect` expected _no expected value_ _(none)_
    - :680 `expect` expected _no expected value_ _(none)_
    - :681 `expect` expected _no expected value_ _(none)_
    - :691 `expect` expected _no expected value_ _(none)_
    - :694 `toBeChecked` expected _no expected value_ _(none)_
    - :698 `toBe` expected `before.chart` _(expression)_
    - :702 `toBe` expected `before.summary` _(expression)_
    - :703 `toBe` expected `before.verdict` _(expression)_
    - :704 `toEqual` expected `before.table` _(expression)_
    - :705 `toBe` expected `before.hist` _(expression)_
    - :709 `toBe` expected `before.chart` _(expression)_
    - :710 `toBe` expected `before.summary` _(expression)_
    - :711 `toEqual` expected `before.table` _(expression)_
- `replaying a mechanism animation re-runs it without moving the counts it reports` — e2e/claims.spec.ts:714
    - :729 `toBeVisible` expected _no expected value_ _(none)_
    - :732 `expect` expected _no expected value_ _(none)_
    - :743 `toBeEnabled` expected `{ timeout: 30_000 }` _(expression)_
- `only one panel is ever being timed at once` — e2e/claims.spec.ts:747
    - :777 `toBeVisible` expected _no expected value_ _(none)_
    - :786 `toBeEnabled` expected _no expected value_ _(none)_
    - :788 `expect` expected _no expected value_ _(none)_
    - :789 `toEqual` expected `ids.slice().sort()` _(expression)_
    - :790 `toBe` expected `1` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-timing-oracle

## What It Is

`crypto-lab-timing-oracle` is a browser demo of timing side-channel behavior in string comparison, WebCrypto HMAC-SHA-256 verification, toy RSA arithmetic, and cache-sensitive memory access patterns. It shows vulnerable and constant-time implementations side by side using live browser timing measurements. The core cryptographic primitives in this demo are HMAC-SHA-256 and RSA, while the timing panels illustrate how implementation choices can leak secret-dependent information. HMAC is a symmetric primitive and RSA is an asymmetric primitive, and both are evaluated here under a side-channel threat model where attackers observe timing differences.

## When to Use It

- Use it to teach why constant-time comparison is required for MAC and secret checks, because it makes timing leakage visible with repeatable measurements.
- Use it in secure coding workshops for HMAC and RSA implementations, because it pairs vulnerable and defensive patterns in one place.
- Use it when validating threat modeling assumptions for browser-adjacent crypto code, because it demonstrates how timing observations can still reveal patterns even with reduced timer precision.
- Do NOT use it as a production cryptography library, because it is an educational demo with intentionally vulnerable code paths.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-timing-oracle](https://systemslibrarian.github.io/crypto-lab-timing-oracle/)**

The demo lets you run timing experiments for string comparison, HMAC verification, RSA exponentiation behavior, and cache access timing. You can change controls such as target secret string, attacker guess string, message, and forged MAC hex, then trigger benchmark runs to compare vulnerable versus constant-time outcomes. Iteration counts and experiment parameters are built into each panel button action rather than exposed as free-form inputs. Each panel turns its raw measurements into a plain-language verdict (for example "Timing signal observed this run" or "Signal below noise this run"), scoped to the sample count and machine that produced it rather than asserting the secret is recoverable, renders a chart with a legend and labelled axes, and exposes the underlying numbers in a collapsible data table for screen readers and copy-paste. Benchmarks run after first paint with a visible "Running…" state so the page stays responsive, and charts redraw on resize without re-measuring.

To build intuition independently of noisy browser timers, two panels also include a **deterministic mechanism animation** driven by exact instruction counts (not the clock). Panel 1 steps the vulnerable compare loop byte by byte against your current guess — lighting matched bytes green, stopping visibly at the first mismatch, and showing a running byte-check counter that is lower for the vulnerable path (secret-dependent) than for the constant-time path (always the full length). Panel 3 renders the generated private exponent as a row of bits and animates square-and-multiply performing an extra multiply only on the 1-bits (so its multiply count equals the Hamming weight — the leak) versus the Montgomery ladder doing one square and one multiply on every bit — which is literally what the benchmarked `modPowMontgomeryLadder` does, via a branchless conditional swap, so the animated schedule and the timed routine are the same algorithm. Panel 1 leads with a time-vs-correct-prefix-length line chart (with an optional "modeled, not measured" ideal-signal overlay for when the live timer is too coarse to resolve the leak) and demotes the distribution histogram to the collapsible data section. Every chart carries a plain-language "what am I looking at" caption, and the cache-latency ladder and constant-time panels are annotated inline to say which numbers are measured versus which are a fixed reference.

## What Can Go Wrong

- Naive `==`/`memcmp`-style comparison of secrets, MACs, or tokens returns early on the first mismatched byte, leaking how much of a guess is correct one character at a time.
- Secret-dependent branches and table lookups (square-and-multiply exponentiation, S-box accesses) create data-dependent timing that statistical sampling can amplify into key recovery.
- A "no leak" result in a coarse-timer environment is not a safety proof — a more precise timer, a co-resident attacker, or more samples can resolve a signal this run could not.
- Cache-timing depends on the memory hierarchy and can leak across process and tenant boundaries, so even "constant-time" source can be undermined by the CPU and compiler.
- Source-level constant-time discipline does not guarantee engine-level constant time: a JIT, GC, bounds checks, or string interning can reintroduce data-dependent timing the language cannot control.

## Real-World Usage

- Constant-time comparison (`crypto.timingSafeEqual`, `hmac.compare`, `sodium_memcmp`) is the standard defense for verifying MACs, password hashes, and bearer tokens.
- RSA implementations apply blinding to defend against timing recovery of the private exponent, a class of attack documented by Kocher.
- TLS stacks were hardened against MAC/padding timing oracles such as Lucky 13 by equalizing processing time across valid and invalid records.
- Constant-time programming is a baseline requirement in vetted libraries (libsodium, BoringSSL, the `@noble` family) and in formally verified code such as HACL*.
- Cloud and multi-tenant environments treat cache-timing as a real cross-tenant threat, which is part of why browsers coarsened high-resolution timers after Spectre.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-timing-oracle
cd crypto-lab-timing-oracle
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-padding-oracle](https://systemslibrarian.github.io/crypto-lab-padding-oracle/) — another decryption-via-oracle side channel, exploiting CBC/PKCS#7 padding feedback.
- [crypto-lab-kyberslash](https://systemslibrarian.github.io/crypto-lab-kyberslash/) — a real timing attack on ML-KEM via non-constant-time division.
- [crypto-lab-hqc-timing](https://systemslibrarian.github.io/crypto-lab-hqc-timing/) — a decoder timing oracle against the HQC post-quantum KEM.
- [crypto-lab-lattice-fault](https://systemslibrarian.github.io/crypto-lab-lattice-fault/) — fault injection against lattice schemes, a sibling implementation-attack class.
- [crypto-lab-nonce-guard](https://systemslibrarian.github.io/crypto-lab-nonce-guard/) — how nonce misuse, another implementation pitfall, breaks AES-GCM.

## Caveats and Limitations

This is a teaching tool, and two of its mechanisms are illustrative rather than literal. Read these before drawing conclusions from the numbers:

- **The "constant-time" comparators are not guaranteed constant-time at the engine level.** They are written without secret-dependent branches or early exits, which is the correct *source-level* discipline. But JavaScript engines (JIT, bounds checks, string interning, garbage collection) can still introduce data-dependent timing that the language does not let you control. Real constant-time guarantees require a lower-level language and careful compiler/CPU consideration. Treat the constant-time panels as demonstrating the right *pattern*, not a hardened implementation.
- **The L1/L2/L3/DRAM nanosecond figures in the cache panel are fixed illustrative constants, not measurements.** They depict the shape of the memory hierarchy. The *cached vs. uncached* histogram beside them is measured live; the per-level latency table is a static reference diagram, written once into the markup and never rewritten by a benchmark run.

More broadly: browser timers are intentionally coarsened after Spectre mitigations, so a "Signal below noise this run" verdict means this environment could not resolve the leak — not that the underlying code is safe. The vulnerable patterns shown here have leaked real keys in production with precise timers and statistical analysis. The RSA panel uses a deliberately tiny "toy" key for speed and is not a real key size.

## Verification

`​``bash
npm test           # unit + DOM integration and maintenance error-path controls
npm run build      # type-check (tsc) and produce a production build in dist/
npm run test:e2e   # build, serve dist/, and drive it in Chromium (claims + a11y)
`​``

The crypto primitives (constant-time comparison, hex parsing, the timing-leak verdicts, and the statistics helpers) are covered by unit tests, and a happy-dom integration test boots the full UI headless. Tests run in CI before every GitHub Pages deploy. No environment variables are required.

`npm run test:e2e` runs two browser suites against the built bundle: `e2e/a11y.spec.ts` (WCAG A/AA across every state the lab renders, at desktop and 380px, in the one theme it ships) and `e2e/claims.spec.ts`, which checks that what the page says matches what it measured. Each panel's verdict is recomputed from the numbers that panel itself rendered — never compared against a fixed sentence — the mechanism counters are checked for internal consistency (inspected + skipped bytes = secret length; naive multiplies = the exponent's Hamming weight), the displayed MAC is re-derived independently with WebCrypto, and every failure path (malformed MAC hex, a fault-injected WebCrypto failure) must both reach its failure state and name its cause. Any uncaught page exception fails the run.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*


## Lighthouse quality and publishing

Use Node 22.19+ or Node 24+ and install Chromium with
`npx playwright install chromium`. `npm run quality` builds the application
with a root base and runs Lighthouse 13 three times. The unchanged
`lighthouserc.json` requires accessibility 1.0 and warns below 0.9 for
performance, SEO, and best practices. Each current audit must be readable,
fresh, and complete; runtime errors, missing reports, wrong pages, and failed
audits fail the command. Reports and a passed/failed manifest are retained in
a new `.lighthouseci/audit-*` directory and uploaded by CI even on failure.
Previous reports cannot replace missing current evidence.

`npm run deploy` requests the existing gated `deploy.yml` workflow at `main`.
Unit tests, the production build, and the complete claims/accessibility browser
suite still gate publishing. Lighthouse remains a PR/auto-merge gate with its
existing warning policy. A successful request is not successful deployment;
inspect the workflow and the public application separately. A rejected request
retains its failing exit status.

```

</details>

---

## Nonce Guard

- **slug**: `crypto-lab-nonce-guard`
- **repo**: https://github.com/systemslibrarian/crypto-lab-nonce-guard
- **live**: https://systemslibrarian.github.io/crypto-lab-nonce-guard/
- **commit_sha**: `1cbd17d6fbb2c7337ea116b1fe018d4133b63ea5` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: intermediate  ·  **--accent**: #60a5fa
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Nonce Guard  — _read from index.html_

**Subtitle**: AES-GCM · AES-GCM-SIV · nonce misuse (AEAD)  — _read from index.html_

**Description**: Reuse a (key, nonce) pair and watch AES-GCM leak the plaintext XOR, recover its GHASH key via Joux's forbidden attack, and forge tags — while AES-GCM-SIV degrades gracefully.  — _read from index.html_

**Why it matters**: Nonce reuse isn't hypothetical: production HTTPS servers have shipped it, handing attackers full plaintext recovery and tag forgery. A misuse-resistant AEAD can limit this damage, subject to its construction assumptions and usage bounds.  — _read from index.html_

**Card copy**: AES-GCM vs AES-GCM-SIV comparison — live nonce reuse attack showing keystream XOR recovery and GHASH key extraction, synthetic IV construction, and misuse-resistance comparison. RFC 8452.

**Chips**: AES-GCM · AES-GCM-SIV · RFC 8452 · Synthetic IV

**Implements**: AES `src/crypto.ts:28`, AES-GCM `src/crypto.ts:28`, AES-SIV `src/crypto.ts:48`, Diffie-Hellman `src/gf128poly.ts:177`, GHASH `src/crypto.ts:300`

**Attacks shown**: Birthday bound `README.md:46`, Factoring `src/main.ts:243`, Key recovery `src/main.ts:233`, Known-plaintext attack `src/crypto.ts:212`, Nonce reuse `src/crypto.ts:183`, Padding oracle `README.md:74`

**Comment-only (named in code comments, not executed)**: AES-CTR `src/crypto.ts:101`

**References**: AES-CTR, Ascon, ChaCha20, ChaCha20-Poly1305, HMAC, Poly1305, SHA-256, SHA-384, TLS 1.3

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 140-2` — first seen index.html:458 (1×)
- `NIST SP 800-38D` — first seen README.md:8 (6×)
- `RFC 5116` — first seen index.html:170 (1×)
- `RFC 8452` — first seen README.md:8 (13×)
- `RFC 9001` — first seen README.md:54 (1×)
- `RFC 9846` — first seen README.md:53 (1×)

**Stated limitations (page)**:

- _(limitation, index.html)_ Bounded misuse resistance — repeating identical key, nonce, AAD, and plaintext repeats the encrypted result; length remains visible. This demo does not measure a security bound or attempt a SIV forgery. RFC 8452 recommends random nonces rather than intentional reuse. Not FIPS-approved — cannot use in FIPS 140-2/3 contexts No online encryption — must have full plaintext before starting (not suitable for streaming) Two passes over the data — the tag must be computed before encryption can begin, so throughput can approach half that of single-pass AES-GCM on long messages, though hardware-optimized (AES-NI + PCLMULQDQ) implementations narrow the gap Not yet widely deployed — operational experience is thin compared to AES-GCM

**README — What Can Go Wrong**:

```text
- **Nonce reuse in AES-GCM:** reusing any (key, nonce) pair allows an attacker with two ciphertexts to recover `P1 ⊕ P2` and, via Joux's "forbidden attack," solve a polynomial equation over GF(2¹²⁸) for candidate GHASH keys H — enabling tag forgery under that nonce.
- **Random nonce collision:** with randomly generated 96-bit nonces, NIST SP 800-38D §8.3 caps AES-GCM at 2³² invocations per key — the limit that holds the probability of a repeated IV at or below the 2⁻³² bound required by §8, and deliberately far stricter than the ~2⁴⁸ birthday bound of a 96-bit space. Rotate keys well before this limit.
- **Missing AAD binding:** failing to include the correct Additional Authenticated Data allows an attacker to swap AAD contexts (e.g., replay an old ciphertext in a new session).
- **AES-GCM-SIV equality leakage:** repeating the same key, nonce, AAD, and plaintext reproduces the tag and ciphertext. This lab uses empty AAD. Ciphertext lengths remain visible, and a few observed results do not establish the construction's security bounds.
- **Truncated tags:** AES-GCM allows tags shorter than 128 bits. Tags below 96 bits are vulnerable to forgery by online guessing. Always use 128-bit tags.
```

**Claims tested** (e2e/claims.spec.ts, 6 test(s)):

- `attack output accurately distinguishes XOR bytes from decoded plaintext` — e2e/claims.spec.ts:27
    - :33 `toContainText` expected `'Recovered P₁ ⊕ P₂'` _(literal)_
    - :34 `toContainText` expected `'ASCII PREVIEW OF XOR BYTES (NOT DECODED PLAINTEXT)'` _(literal)_
    - :35 `toContainText` expected `'It is not either plaintext'` _(literal)_
    - :36 `toContainText` expected `'DECODED (PRINTABLE)'` _(literal)_
- `Level 1 turns the XOR into a recovered Message 2 and checks it byte-for-byte` — e2e/claims.spec.ts:39
    - :47 `toContainText` expected `'APPLYING THAT EXTRA INFORMATION'` _(literal)_
    - :49 `toBe` expected `m2` _(expression)_
    - :50 `toContainText` expected `'MESSAGE 2 RECOVERED IN FULL'` _(literal)_
    - :55 `toContainText` expected `'MESSAGE 2 PARTIALLY RECOVERED'` _(literal)_
    - :56 `toContainText` expected `'MESSAGE 2 RECOVERED IN FULL'` _(literal)_
    - :57 `toBe` expected `'a much lon'` _(literal)_
- `Level 2 recovers the real GHASH key from the learner-supplied messages` — e2e/claims.spec.ts:60
    - :71 `expect` expected _no expected value_ _(none)_
    - :76 `toContainText` expected `'Computed from your Message 1 and Message 2'` _(literal)_
    - :77 `toContainText` expected `'Not derived from your Message 1 or Message 2'` _(literal)_
    - :78 `toContainText` expected `'two fixed 16-byte probes'` _(literal)_
    - :81 `toContainText` expected `'KEY EQUATION SOLVED'` _(literal)_
    - :82 `toContainText` expected `'Degree'` _(literal)_
    - :88 `toHaveLength` expected `32` _(literal)_
    - :89 `toBe` expected `truth` _(expression)_
    - :91 `toContainText` expected `'H RECOVERED EXACTLY'` _(literal)_
    - :92 `toContainText` expected `'FORGERY ACCEPTED'` _(literal)_
    - :93 `toContainText` expected `'INTEGRITY BROKEN'` _(literal)_
    - :95 `toContainText` expected `'WHAT THE RECEIVER DECRYPTS FROM THE FORGED BLOB'` _(literal)_
    - :96 `expect` expected _no expected value_ _(none)_
- `Level 2 declines honestly when two identical messages carry no information` — e2e/claims.spec.ts:101
    - :109 `toContainText` expected `'NO KEY RECOVERED — the two ciphertexts are identical'` _(literal)_
    - :110 `toContainText` expected `'0 = 0'` _(literal)_
    - :111 `toContainText` expected `'H RECOVERED EXACTLY'` _(literal)_
    - :112 `toContainText` expected `'FORGERY ACCEPTED'` _(literal)_
    - :113 `toContainText` expected `'INTEGRITY BROKEN'` _(literal)_
    - :114 `toContainText` expected `'Level 2 recovered nothing'` _(literal)_
    - :115 `toContainText` expected `'recovered exactly'` _(literal)_
- `Level 2 declines, rather than faking, past its stated root-search budget` — e2e/claims.spec.ts:118
    - :127 `toContainText` expected `'NOT RUN — a message is longer than 512 bytes'` _(literal)_
    - :128 `toContainText` expected `'not a limit of Joux'` _(literal)_
    - :129 `toContainText` expected `'H RECOVERED EXACTLY'` _(literal)_
    - :130 `toContainText` expected `'INTEGRITY BROKEN'` _(literal)_
    - :131 `toContainText` expected `'declined to run'` _(literal)_
    - :135 `toContainText` expected `'H RECOVERED EXACTLY'` _(literal)_
    - :136 `toContainText` expected `'INTEGRITY BROKEN'` _(literal)_
- `the screen-reader announcement claims the integrity break only when the badges do` — e2e/claims.spec.ts:139
    - :148 `expect` expected _no expected value_ _(none)_
    - :154 `toContainText` expected `'H RECOVERED EXACTLY'` _(literal)_
    - :155 `toContainText` expected `'FORGERY ACCEPTED'` _(literal)_
    - :156 `toContainText` expected `'recovered exactly'` _(literal)_
    - :157 `toContainText` expected `'forged tag was accepted'` _(literal)_
    - :159 `toContainText` expected `'H was recovered exactly'` _(literal)_
    - :166 `toBeChecked` expected _no expected value_ _(none)_
    - :169 `toContainText` expected `'nonce-reuse attacks on this page do not apply'` _(literal)_
    - :170 `toContainText` expected `'recovered exactly'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-nonce-guard

[![crypto-lab portfolio](https://img.shields.io/badge/crypto--lab-portfolio-blue?style=flat-square)](https://systemslibrarian.github.io/crypto-lab/)
[![Deploy to GitHub Pages](https://github.com/systemslibrarian/crypto-lab-nonce-guard/actions/workflows/pages.yml/badge.svg)](https://github.com/systemslibrarian/crypto-lab-nonce-guard/actions/workflows/pages.yml)

## What It Is

crypto-lab-nonce-guard is a browser-based comparison of AES-GCM (NIST SP 800-38D) and AES-GCM-SIV (RFC 8452) focused on nonce misuse resistance. Both are authenticated encryption schemes producing a ciphertext and authentication tag. AES-GCM requires strict nonce uniqueness — reusing a nonce allows an attacker to recover the XOR of two plaintexts and algebraically recover the GHASH authentication key, enabling tag forgery. AES-GCM-SIV derives a synthetic IV from the plaintext, associated data, key, and nonce. It provides nonce misuse resistance under RFC 8452's security assumptions and usage bounds, rather than GCM's catastrophic reuse behavior. Repeating identical full inputs reproduces the tag, IV, keystream, and ciphertext; ciphertext length and this equality remain visible. The security model is symmetric AEAD with a 256-bit key.

## When to Use It

- **Use AES-GCM when nonce uniqueness is strictly guaranteed** (sequential counter, single encryptor) and FIPS compliance is required — it is faster and universally supported.
- **Use AES-GCM-SIV in distributed systems** where multiple encryptors may accidentally generate the same nonce, accepting the two-pass throughput cost (approaching ~2× on long messages) and the loss of FIPS approval.
- **Use AES-GCM-SIV for key wrapping and key storage** where the same key encrypts many short messages and nonce coordination is operationally difficult.
- **Do not use AES-GCM-SIV for streaming encryption** — it requires buffering the full plaintext before starting.
- **Do not use either scheme for password hashing** — they are not memory-hard and provide no protection against offline brute force of short secrets.
- **Do NOT treat this as production code** — it is a teaching demo that deliberately performs nonce-reuse attacks to illustrate the failure modes.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-nonce-guard](https://systemslibrarian.github.io/crypto-lab-nonce-guard/)**

Enter two messages and toggle nonce reuse on. Click "Encrypt Both" to encrypt under both AES-GCM and AES-GCM-SIV with the same key and nonce. Click "Run Attack" to execute both failure levels against AES-GCM:

- **Level 1 (confidentiality):** the XOR recovery attack exposes `P1 ⊕ P2` directly from the two ciphertexts.
- **Level 2 (integrity):** Joux's forbidden attack is actually carried out **on your own two messages**. The solver sees only `C1, T1, C2, T2`, builds the key equation `GHASH_H(C1) ⊕ GHASH_H(C2) ⊕ (T1 ⊕ T2) = 0` — a degree-`n+1` polynomial in the unknown `H` over GF(2¹²⁸), one term per 16-byte block plus the length block — and **factors it**: gcd with `x^(2¹²⁸) − x` to isolate the roots in the field, then characteristic-2 Cantor–Zassenhaus trace splitting to separate them. Each candidate root is then used to forge a tag, and the real AES-GCM decryptor decides which one was the key. The recovered `H` is shown next to the true `H = AES-256(key, 0¹²⁸)` so you can see they match exactly, and the forged blob's decryption is printed to show the receiver really opens the attacker's chosen payload.
  - Two honest limits, both reachable by typing: two **identical** messages make the equation `0 = 0` and nothing is learned; a message over **512 bytes** is declined because the in-browser root search is quadratic in the degree. The cap is this page's runtime budget, not a limit of the attack.

The AES-GCM-SIV comparison uses empty associated data (AAD). With the same key and nonce, repeating the same plaintext therefore repeats the complete encrypted result. This equality is the additional leakage associated with nonce repetition under the construction's assumptions and bounds; ordinary ciphertext-length leakage also remains. This experiment does not establish a general forgery bound, and nonce uniqueness remains the recommended policy.

The page is ordered so you **break the scheme before you meet the math**: click first, then read why it happened. Every "why it cancels" step is shown as a two-stage animation (watch the shared keystream/mask fade out), never asserted as prose.

## Exhibits

1. **A — What is a Nonce?** The one rule (unique per key), the 96-bit nonce shown as 12 live hex bytes, and an on-ramp that sends you to break it before any theory.
2. **B — See It Break (Live Attack Demo).** Encrypt two messages under both schemes with a reused nonce, then run the attack. Level 1 recovers `P1 ⊕ P2`; Level 2 recovers `H` and forges a tag the real AES-GCM decryptor accepts, with recovered `H` shown next to the independently computed ground truth. An attacker-capability box frames what you started with (two ciphertexts + tags) versus what you now hold (the auth key).
3. **C — Why It Breaks.** The algebra behind what you just witnessed, with two **cancellation animations**: Level 1 shows the shared keystream fading out of `C1 ⊕ C2` to leave `P1 ⊕ P2`; Level 2 shows the shared mask fading out of `tag1 ⊕ tag2` to leave a pure equation in `H`. Heavy terms (GHASH, mask, GF(2¹²⁸)) get a one-line intuition gloss. An honest note states the two scope limits of the in-browser solver: the known-plaintext assumption behind the forged ciphertext, and the 512-byte cap on the root search.
4. **D — SIV: Misuse Resistance and Its Limits.** The RFC 8452 synthetic-IV construction, why the direct GCM tag-cancellation equation does not transfer to AES-encrypted POLYVAL outputs, and an **interactive tag-as-IV panel**: type a message and compare plaintext → SIV tag → derived AES-CTR IV → first ciphertext block. A "send the same message twice" vs "change one byte" toggle illustrates deterministic equality for repeated full inputs.
5. **E — When to Use Which.** Side-by-side comparison table, three decision scenarios, and an honest list of AES-GCM-SIV's limitations (no FIPS approval, no online encryption, two passes).

The field arithmetic, GHASH, key-recovery, and forgery are covered by unit tests (`npm test`): the GF(2¹²⁸) implementation is cross-checked against `@noble/ciphers`' GHASH, and the attack tests assert `H` is recovered exactly and that a forged tag is accepted by the real primitive while a random tag is rejected.

## What Can Go Wrong

- **Nonce reuse in AES-GCM:** reusing any (key, nonce) pair allows an attacker with two ciphertexts to recover `P1 ⊕ P2` and, via Joux's "forbidden attack," solve a polynomial equation over GF(2¹²⁸) for candidate GHASH keys H — enabling tag forgery under that nonce.
- **Random nonce collision:** with randomly generated 96-bit nonces, NIST SP 800-38D §8.3 caps AES-GCM at 2³² invocations per key — the limit that holds the probability of a repeated IV at or below the 2⁻³² bound required by §8, and deliberately far stricter than the ~2⁴⁸ birthday bound of a 96-bit space. Rotate keys well before this limit.
- **Missing AAD binding:** failing to include the correct Additional Authenticated Data allows an attacker to swap AAD contexts (e.g., replay an old ciphertext in a new session).
- **AES-GCM-SIV equality leakage:** repeating the same key, nonce, AAD, and plaintext reproduces the tag and ciphertext. This lab uses empty AAD. Ciphertext lengths remain visible, and a few observed results do not establish the construction's security bounds.
- **Truncated tags:** AES-GCM allows tags shorter than 128 bits. Tags below 96 bits are vulnerable to forgery by online guessing. Always use 128-bit tags.

## Real-World Usage

- **TLS 1.3 (RFC 9846 §9.1):** AES-128-GCM (`TLS_AES_128_GCM_SHA256`) is the mandatory-to-implement cipher suite and AES-256-GCM (`TLS_AES_256_GCM_SHA384`) is SHOULD-implement, with nonce derived from a counter XORed with a per-record mask to guarantee uniqueness.
- **QUIC (RFC 9001):** uses AES-GCM with packet number as nonce; Google's QUIC experiments evaluated AES-GCM-SIV for contexts where packet number coordination was complex.
- **Google Tink:** offers AES-GCM-SIV (`AES128_GCM_SIV`, `AES256_GCM_SIV`) as a supported AEAD key type, documenting its nonce-misuse resistance and additional equality leakage, subject to security bounds; ordinary length leakage remains. It is also one of the accepted DEK types for KMS envelope encryption, though Tink recommends `AES128_GCM` for most uses.
- **WireGuard:** uses ChaCha20-Poly1305 rather than AES-GCM, partly to avoid nonce management complexity on devices without AES-NI.
- **AWS Encryption SDK:** uses AES-GCM with a message ID as part of the nonce, combined with a key commitment scheme to prevent multi-key attacks.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-nonce-guard
cd crypto-lab-nonce-guard
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-aes-modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/) — ECB, CBC, CTR, and GCM modes side by side.
- [crypto-lab-chacha20-stream](https://systemslibrarian.github.io/crypto-lab-chacha20-stream/) — ARX stream cipher with its own nonce-reuse demo.
- [crypto-lab-mac-race](https://systemslibrarian.github.io/crypto-lab-mac-race/) — HMAC, Poly1305, and GHASH authentication compared.
- [crypto-lab-ascon](https://systemslibrarian.github.io/crypto-lab-ascon/) — standardized lightweight AEAD for constrained devices.
- [crypto-lab-padding-oracle](https://systemslibrarian.github.io/crypto-lab-padding-oracle/) — another AEAD/mode misuse attack (CBC padding oracle).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Wider-block proposal

The live demo now distinguishes the [1 June 2026 wGCM consultation](https://csrc.nist.gov/pubs/sp/800/38/d/r1/2prd) from finalized GCM and AES key-size selection. It does not implement wGCM.

```

</details>

---

## Protocol Compose

- **slug**: `crypto-lab-protocol-compose`
- **repo**: https://github.com/systemslibrarian/crypto-lab-protocol-compose
- **live**: https://systemslibrarian.github.io/crypto-lab-protocol-compose/
- **commit_sha**: `dead58d69a8baedb2fc39b62810166649acbfa60` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: intermediate  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, verification

**Name (H1)**: Protocol Composition  — _read from src/main.ts_

**Subtitle**: MtE · EtM · E&M · AEAD  — _read from src/main.ts_

**Description**: Seal messages under each way of combining AES-CBC, HMAC-SHA-256, and AES-GCM, then watch padding-oracle, timing, and CRIME attacks break the unsafe orderings.  — _read from src/main.ts_

**Why it matters**: Every primitive here is individually secure, yet the wrong composition order sank real systems — padding oracles, Lucky Thirteen, and CRIME all exploited it. Getting the order right is what modern TLS spent a decade fixing.  — _read from src/main.ts_

**Card copy**: MAC-then-Encrypt vs Encrypt-then-MAC, padding oracle attack, CRIME, and the composition failures that drove TLS 1.3. Safe primitives composed unsafely break everything.

**Chips**: MAC-then-Encrypt · Encrypt-then-MAC · CRIME · TLS 1.3 context

**Implements**: AES `src/compose.ts:47`, AES-CBC `src/compose.ts:47`, AES-GCM `src/compose.ts:57`, ECDH `src/signcrypt.ts:25`, Ed25519 `src/signcrypt.ts:26`, HKDF `src/signcrypt.ts:34`, HMAC `src/compose.ts:95`, P-256 `src/signcrypt.ts:25`, SHA-256 `src/compose.ts:52`, Sign-then-Encrypt `src/signcrypt-panel.ts:3`

**Attacks shown**: Chosen-ciphertext attack `src/signcrypt-panel.ts:22`, Chosen-plaintext attack `src/attacks.ts:159`, Length extension `src/main.ts:384`, Nonce reuse `README.md:22`, Padding oracle `src/attacks.ts:21`, Side-channel (unspecified) `README.md:33`, Timing side-channel `src/attacks.ts:167`

**Comment-only (named in code comments, not executed)**: HPKE `src/signcrypt.ts:33`

**References**: CMAC, ChaCha20, ChaCha20-Poly1305, EdDSA, GHASH, HPKE, Poly1305, TLS 1.3

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `eprint.iacr.org/2002/046` — first seen src/signcrypt-panel.ts:23 (1×)
- `EUROCRYPT 2002` — first seen src/signcrypt-panel.ts:23 (1×)
- `RFC 8032` — first seen src/signcrypt-panel.ts:22 (2×)
- `rfc8032` — first seen src/signcrypt-panel.ts:23 (1×)

**Stated limitations (page)**:

- _(caveat, src/main.ts)_ Not invincible — it moves the footgun. AEAD removes the composition seam, but AES-GCM keeps one of its own: reuse a nonce with the same key and confidentiality and integrity collapse. Safe composition still needs a nonce discipline. See crypto-lab-nonce-guard (opens in new tab).

**README — What Can Go Wrong**:

```text
- Signature stripping in the naïve encrypt-then-sign protocol shown: bind and check the encrypted sender against the claimed sender.
- Surreptitious forwarding in the naïve sign-then-encrypt protocol shown: sign the intended recipient and check it after decryption.

The public-key exhibit assumes trusted bindings between identities and public keys. Signature verification checks bytes against a key; it does not establish human authorship by itself. Neither composition order is inherently broken: the complete protocol and identity bindings matter.

- MtE padding oracle exposure: decryption happens before MAC verification, so padding validity can become an oracle that leaks plaintext bytes.
- E&M plaintext-correlation leak: MACing plaintext separately exposes a reusable authenticator that can reveal message equality across sessions.
- TLS CBC timing side-channel (Lucky Thirteen): small processing differences during CBC record handling leak information about plaintext and padding validity.
- TLS 1.0 BEAST-era CBC composition weakness: CBC record chaining and composition details enabled practical chosen-plaintext attacks.
- Implementation pitfall in verification order: checking authenticity after decryption recreates oracle surfaces even if AES and HMAC are individually correct.
- AEAD nonce reuse: switching to AES-GCM removes the composition seam but adds one of its own — repeating a nonce under the same key collapses both confidentiality and integrity (see the linked nonce-guard demo).
```

**Claims tested** (e2e/claims.spec.ts, 38 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:45
    - :45 `toMatch` expected `/^\d+$/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:76
    - :76 `toHaveLength` expected `2` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:79
    - :79 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:80
    - :80 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:119
    - :119 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:120
    - :120 `toBeEnabled` expected `{ timeout: 120_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:133
    - :133 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:137
    - :137 `toEqual` expected `[]` _(expression)_
- `every card equality verdict follows the two hexes printed above it` — e2e/claims.spec.ts:144
    - :145 `toContainText` expected `'A and B differ'` _(literal)_
    - :151 `toBe` expected `row.b` _(expression)_
    - :152 `toBe` expected `false` _(expression)_
    - :153 `expect` expected _no expected value_ _(none)_
    - :154 `expect` expected _no expected value_ _(none)_
    - :157 `toBe` expected `'ciphertext'` _(literal)_
    - :159 `toBe` expected `'tag'` _(literal)_
- `identical messages leak through E&M alone, and the badge names the leak` — e2e/claims.spec.ts:163
    - :165 `toContainText` expected `'A and B are identical'` _(literal)_
    - :166 `toBe` expected `await page.locator('#ex1-a').inputValue()` _(expression)_
    - :171 `toBe` expected `eam.b` _(expression)_
    - :172 `toBe` expected `true` _(expression)_
    - :173 `expect` expected _no expected value_ _(none)_
    - :174 `expect` expected _no expected value_ _(none)_
    - :175 `expect` expected _no expected value_ _(none)_
    - :180 `toBe` expected `row.b` _(expression)_
    - :181 `toBe` expected `false` _(expression)_
    - :182 `expect` expected _no expected value_ _(none)_
- `editing a message retracts the seal instead of leaving a stale verdict` — e2e/claims.spec.ts:186
    - :191 `toContainText` expected `'A and B are identical'` _(literal)_
    - :194 `toContainText` expected `'Messages changed'` _(literal)_
    - :196 `expect` expected _no expected value_ _(none)_
    - :201 `toContainText` expected `'A and B differ'` _(literal)_
    - :203 `toBe` expected `eam.b` _(expression)_
    - :204 `toBe` expected `false` _(expression)_
- `editing while Exhibit 1 WebCrypto is in flight cannot resurrect retired cards` — e2e/claims.spec.ts:207
    - :217 `toBeDisabled` expected _no expected value_ _(none)_
    - :219 `toBeEnabled` expected _no expected value_ _(none)_
    - :220 `toContainText` expected `'Messages changed'` _(literal)_
    - :222 `expect` expected _no expected value_ _(none)_
- `padding oracle (reduced motion)` — e2e/claims.spec.ts:233
    - :239 `expect` expected _no expected value_ _(none)_
- `MtE hands back exactly the message that was typed, and the counts add up` — e2e/claims.spec.ts:245
    - :254 `toHaveClass` expected `/verdict-danger/` _(regex)_
    - :255 `toContainText` expected `'MtE broken'` _(literal)_
    - :256 `toBe` expected `secret` _(expression)_
    - :263 `toBe` expected `queries` _(expression)_
    - :264 `expect` expected _no expected value_ _(none)_
    - :265 `expect` expected _no expected value_ _(none)_
    - :271 `toBe` expected `total` _(expression)_
    - :272 `expect` expected _no expected value_ _(none)_
    - :273 `toHaveCount` expected `0` _(literal)_
    - :277 `toHaveClass` expected `/mech-idle/` _(regex)_
    - :278 `toHaveCount` expected `16` _(literal)_
    - :279 `toHaveCount` expected `16` _(literal)_
    - :280 `toHaveCount` expected `0` _(literal)_
    - :282 `toBe` expected `secret.slice(0, 16)` _(expression)_
- `EtM rejects the tamper at the MAC, leaking nothing to query` — e2e/claims.spec.ts:285
    - :289 `toHaveClass` expected `/verdict-safe/` _(regex)_
    - :290 `toContainText` expected `'EtM safe'` _(literal)_
    - :292 `toContainText` expected `'checked first'` _(literal)_
    - :293 `toContainText` expected `'rejected at the MAC'` _(literal)_
    - :294 `toContainText` expected `'0 bytes leaked'` _(literal)_
    - :295 `toBe` expected `0` _(literal)_
    - :296 `toContainText` expected `'oracle queries possible'` _(literal)_
    - :299 `toHaveClass` expected `/mech-idle/` _(regex)_
    - :300 `toHaveCount` expected `0` _(literal)_
    - :301 `toHaveCount` expected `16` _(literal)_
- `an empty message is refused without claiming a break` — e2e/claims.spec.ts:304
    - :308 `toHaveText` expected `'Enter a message before running the attack.'` _(literal)_
    - :309 `toHaveClass` expected `/verdict-/` _(regex)_
    - :310 `expect` expected _no expected value_ _(none)_
    - :311 `expect` expected _no expected value_ _(none)_
- `changing the configuration retracts the previous oracle verdict` — e2e/claims.spec.ts:314
    - :320 `toHaveClass` expected `/verdict-danger/` _(regex)_
    - :323 `expect` expected _no expected value_ _(none)_
    - :324 `toHaveClass` expected `/verdict-/` _(regex)_
    - :325 `expect` expected _no expected value_ _(none)_
    - :326 `toHaveText` expected `'Press “Run the attack” to begin.'` _(literal)_
    - :327 `toHaveClass` expected `/mech-idle/` _(regex)_
    - :328 `toHaveCount` expected `0` _(literal)_
    - :333 `toHaveClass` expected `/verdict-danger/` _(regex)_
    - :335 `expect` expected _no expected value_ _(none)_
    - :336 `toContainText` expected `'recovered message'` _(literal)_
    - :337 `toHaveClass` expected `/mech-idle/` _(regex)_
    - :341 `toBe` expected `'pay=carol;amt=1'` _(literal)_
- `the mechanism diagram sweeps the attacked byte while the attack runs` — e2e/claims.spec.ts:345
    - :364 `toContainText` expected `'MtE broken', { timeout: 120_000 }` _(expression)_
    - :365 `toHaveCount` expected `0` _(literal)_
    - :366 `toHaveCount` expected `16` _(literal)_
    - :368 `toBe` expected `true` _(expression)_
- `editing while the padding-oracle seal is in flight retires the pending result` — e2e/claims.spec.ts:371
    - :385 `toBeEnabled` expected `{ timeout: 30_000 }` _(expression)_
    - :386 `expect` expected _no expected value_ _(none)_
    - :387 `toHaveText` expected `'Press “Run the attack” to begin.'` _(literal)_
    - :388 `expect` expected _no expected value_ _(none)_
    - :389 `toHaveClass` expected `/mech-idle/` _(regex)_
- `timing side-channel (reduced motion)` — e2e/claims.spec.ts:396
    - :402 `expect` expected _no expected value_ _(none)_
- `the naive compare gives up the whole tag, and the bars are the leak` — e2e/claims.spec.ts:408
    - :409 `toMatch` expected `/^(?:·· ){7}··$/` _(regex)_
    - :411 `toContainText` expected `'Naive compare broken', { timeout: 60_000 }` _(expression)_
    - :412 `toHaveClass` expected `/verdict-danger/` _(regex)_
    - :415 `toHaveLength` expected `8` _(literal)_
    - :419 `toMatch` expected `/^[0-9a-f]{2}$/` _(regex)_
    - :420 `toBe` expected `total` _(expression)_
    - :422 `expect` expected _no expected value_ _(none)_
    - :423 `expect` expected _no expected value_ _(none)_
    - :425 `toBe` expected `Math.round((cell.ran / total) * 100)` _(expression)_
    - :428 `expect` expected _no expected value_ _(none)_
    - :431 `toBe` expected `total` _(expression)_
    - :435 `toBe` expected `total * TAG_BYTE_VALUES` _(expression)_
    - :436 `toBe` expected `queries` _(expression)_
- `the constant-time compare recovers nothing and proves it by revealing the tag` — e2e/claims.spec.ts:439
    - :442 `toContainText` expected `'Fixed-work model holds', { timeout: 60_000 }` _(expression)_
    - :443 `toHaveClass` expected `/verdict-safe/` _(regex)_
    - :444 `toContainText` expected `'recovers nothing'` _(literal)_
    - :447 `toMatch` expected `/^[0-9a-f]{16}$/` _(regex)_
    - :450 `toHaveLength` expected `8` _(literal)_
    - :453 `toBe` expected `cells.length` _(expression)_
    - :454 `toBe` expected `100` _(literal)_
    - :457 `toBe` expected `revealed` _(expression)_
    - :459 `toBe` expected `cells.length * TAG_BYTE_VALUES` _(expression)_
- `switching comparison mode retracts the verdict and draws a fresh tag` — e2e/claims.spec.ts:462
    - :464 `toContainText` expected `'Naive compare broken', { timeout: 60_000 }` _(expression)_
    - :467 `expect` expected _no expected value_ _(none)_
    - :468 `toHaveClass` expected `/verdict-/` _(regex)_
    - :469 `expect` expected _no expected value_ _(none)_
    - :470 `expect` expected _no expected value_ _(none)_
    - :474 `toContainText` expected `'Fixed-work model holds', { timeout: 60_000 }` _(expression)_
- `switching mode during the timing animation cannot repaint a retired verdict` — e2e/claims.spec.ts:478
    - :480 `toContainText` expected `'comparison-work oracle'` _(literal)_
    - :482 `toBeEnabled` expected `{ timeout: 30_000 }` _(expression)_
    - :483 `expect` expected _no expected value_ _(none)_
    - :484 `expect` expected _no expected value_ _(none)_
    - :485 `expect` expected _no expected value_ _(none)_
- `CRIME length leak (reduced motion)` — e2e/claims.spec.ts:492
    - :498 `expect` expected _no expected value_ _(none)_
- `the session secret falls out of the compressed length alone` — e2e/claims.spec.ts:504
    - :506 `toMatch` expected `/^[a-z0-9]{8}$/` _(regex)_
    - :509 `toContainText` expected `/recovered|stalled/, { timeout: 120_000 }` _(expression)_
    - :512 `toHaveLength` expected `secret.length` _(expression)_
    - :515 `toBe` expected `secret` _(expression)_
    - :516 `toBe` expected `guessed` _(expression)_
    - :520 `toBe` expected `secret.length * CRIME_ALPHABET_SIZE` _(expression)_
    - :523 `toHaveClass` expected `/verdict-danger/` _(regex)_
    - :524 `toContainText` expected `'Full secret recovered'` _(literal)_
    - :525 `toBe` expected `queries` _(expression)_
    - :528 `toMatch` expected `/^\d+ bytes$/` _(regex)_
    - :529 `expect` expected _no expected value_ _(none)_
    - :530 `toHaveCount` expected `0` _(literal)_
    - :534 `toHaveClass` expected `/verdict-danger/` _(regex)_
    - :535 `toContainText` expected `'stalled on compression noise'` _(literal)_
- `New secret draws a different secret and clears the previous recovery` — e2e/claims.spec.ts:539
    - :542 `toContainText` expected `/recovered|stalled/, { timeout: 120_000 }` _(expression)_
    - :543 `toBeEnabled` expected _no expected value_ _(none)_
    - :546 `toBe` expected `first` _(expression)_
    - :547 `expect` expected _no expected value_ _(none)_
    - :548 `expect` expected _no expected value_ _(none)_
    - :549 `expect` expected _no expected value_ _(none)_
    - :550 `expect` expected _no expected value_ _(none)_
    - :552 `toHaveCount` expected `0` _(literal)_
- `the TLS walkthrough steps danger -> warn -> safe, dot matching badge` — e2e/claims.spec.ts:560
    - :562 `toHaveCount` expected `3` _(literal)_
    - :563 `toHaveCount` expected `1` _(literal)_
    - :564 `toHaveCount` expected `1` _(literal)_
    - :565 `toHaveCount` expected `1` _(literal)_
    - :571 `toBe` expected `step` _(expression)_
    - :574 `toHaveClass` expected `new RegExp('badge-${safety}')` _(expression)_
    - :577 `toMatch` expected `/^TLS /` _(regex)_
    - :579 `toContainText` expected `field` _(expression)_
    - :583 `toEqual` expected `['danger', 'warn', 'safe']` _(expression)_
    - :585 `toHaveClass` expected `/tls-dot-active/` _(regex)_
    - :587 `toHaveClass` expected `/tls-dot-active/` _(regex)_
- `play advances the walkthrough and pause actually stops it` — e2e/claims.spec.ts:590
    - :595 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :596 `toHaveText` expected `'Pause walkthrough'` _(literal)_
    - :598 `toHaveAttribute` expected `'aria-live', 'off'` _(expression)_
    - :602 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :603 `toHaveText` expected `'Play walkthrough'` _(literal)_
    - :604 `toHaveAttribute` expected `'aria-live', 'polite'` _(expression)_
    - :607 `toBe` expected `paused` _(expression)_
- `the checklist reaches every verdict it can give, naming the cause` — e2e/claims.spec.ts:614
    - :637 `toHaveClass` expected `new RegExp('badge-${scenario.kind}')` _(expression)_
    - :638 `toContainText` expected `scenario.verdict` _(expression)_
    - :639 `toHaveText` expected `scenario.cause` _(expression)_
    - :648 `toHaveClass` expected `/badge-safe/` _(regex)_
- `the configuration round-trips through the URL hash` — e2e/claims.spec.ts:656
    - :666 `toBe` expected `'transfer=1&to=dana'` _(literal)_
    - :667 `toBe` expected `'etm'` _(literal)_
    - :668 `toBe` expected `'shared=link'` _(literal)_
    - :669 `toBe` expected `'ct'` _(literal)_
    - :670 `toBe` expected `'eam'` _(literal)_
    - :671 `toBe` expected `'no'` _(literal)_
    - :678 `toBeVisible` expected _no expected value_ _(none)_
    - :679 `toBe` expected `'transfer=1&to=dana'` _(literal)_
    - :680 `toBe` expected `'etm'` _(literal)_
    - :681 `toBe` expected `'shared=link'` _(literal)_
    - :682 `toBe` expected `'ct'` _(literal)_
    - :683 `toBe` expected `'eam'` _(literal)_
    - :685 `toHaveClass` expected `/badge-danger/` _(regex)_
    - :686 `toContainText` expected `'Encrypt-and-MAC'` _(literal)_
    - :697 `toBe` expected `true` _(expression)_
    - :698 `toBe` expected `expected` _(expression)_
- `Exhibit 7: strip is misattributed even though Node verifies every primitive` — e2e/claims.spec.ts:702
    - :705 `toEqual` expected `[true,true,true]` _(expression)_
    - :706 `toBe` expected `'Ada'` _(literal)_
    - :707 `toHaveClass` expected `/badge-danger/` _(regex)_
    - :708 `toContainText` expected `'SIGNATURE VALID, DECRYPTED — AND MISATTRIBUTED'` _(literal)_
    - :709 `toContainText` expected `'Ravi believes: ${r.signer} wrote this'` _(expression)_
    - :710 `toContainText` expected `r.message` _(expression)_
- `Exhibit 7: forwarded negative fixture passes every primitive but establishes no recipient` — e2e/claims.spec.ts:713
    - :716 `toEqual` expected `[true,true,true]` _(expression)_
    - :717 `toBe` expected `'Rita'` _(literal)_
    - :718 `toHaveClass` expected `/badge-danger/` _(regex)_
    - :719 `toContainText` expected `'SIGNATURE VALID, DECRYPTED — AND FORWARDED'` _(literal)_
    - :720 `toContainText` expected `'${r.trace.receiver} believes: ${r.signer} wrote this to ${r.trace.receiver}'` _(expression)_
    - :721 `toHaveText` expected `'A valid signature inside a correctly decrypted message does not establish who the sender meant it for.'` _(literal)_
    - :722 `toBeVisible` expected _no expected value_ _(none)_
- `Exhibit 7: bound identities reject strip and forward for independently decrypted causes` — e2e/claims.spec.ts:725
    - :728 `toEqual` expected `[true,true,false]` _(expression)_
    - :729 `toContainText` expected `'inner sender ${r.innerSender}, outer sender ${r.trace.packet.sender}'` _(expression)_
    - :730 `toHaveClass` expected `/badge-safe/` _(regex)_
    - :732 `toEqual` expected `[true,true,false]` _(expression)_
    - :733 `toContainText` expected `'signed for ${r.recipient}, received by ${r.trace.receiver}'` _(expression)_
    - :734 `toContainText` expected `'REJECTED'` _(literal)_
- `Exhibit 7: GCM byte flips and noncanonical S plus L fail real independent checks` — e2e/claims.spec.ts:737
    - :746 `toBe` expected `false` _(expression)_
    - :749 `toBe` expected `false` _(expression)_
    - :751 `toBe` expected `false` _(expression)_
- `Exhibit 7: edits retire results; identical selection and input preserve them; empty refuses` — e2e/claims.spec.ts:755
    - :758 `toHaveText` expected `before` _(expression)_
    - :759 `toContainText` expected `'retired'` _(literal)_
    - :760 `toBeDisabled` expected _no expected value_ _(none)_
    - :761 `toContainText` expected `'Empty message'` _(literal)_
- `Exhibit 7: delayed signatures cannot resurrect an edited verdict` — e2e/claims.spec.ts:764
    - :767 `toContainText` expected `'retired'` _(literal)_
- `Exhibit 7: unsupported Ed25519 refuses without fallback` — e2e/claims.spec.ts:770
    - :772 `toContainText` expected `'no fallback'` _(literal)_

**Mutation records** (2 file(s)):

- `mutation-evidence.json` (34354 bytes)
- `scripts/check-signcrypt-mutations.mjs` (4927 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-protocol-compose

## What It Is

crypto-lab-protocol-compose is a browser demo of protocol composition safety using AES-CBC, HMAC with SHA-256, and AES-256-GCM through the WebCrypto API. It compares MAC-then-Encrypt, Encrypt-then-MAC, Encrypt-and-MAC, and AEAD under one interactive interface. The project shows that composition order changes what an attacker can observe and exploit, even when each primitive is secure in isolation. The security model is symmetric-key authenticated messaging where attackers can tamper with transmitted ciphertexts and observe verifier behavior.

Exhibit 7 extends the composition question to signatures and public-key encryption (ECDH P-256 ECIES + Ed25519, WebCrypto).

## When to Use It

- Use it when reviewing legacy AES-CBC + HMAC designs, because the demo shows exactly how MtE requires decryption before MAC validation.
- Use it for architecture decisions between EtM and AEAD, because the exhibits compare pre-decryption authentication versus decrypt-first workflows.
- Use it in secure coding training, because the padding oracle runner demonstrates real bytewise recovery against MtE ciphertext.
- Use it to evaluate protocol migration plans, because the TLS walkthrough maps CBC-era composition risk to TLS 1.3 AEAD-only design.
- Use it to catch common composition mistakes, because the checklist scores unsafe ordering choices such as MtE and E&M.
- Do NOT use it as a production messaging or transport security library — it is a teaching demo, not a hardened protocol stack.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-protocol-compose](https://systemslibrarian.github.io/crypto-lab-protocol-compose/)**

The demo lets you encrypt a live message across composition modes and inspect resulting ciphertext/tag outputs. You can seal two messages side by side to surface the Encrypt-and-MAC equality leak, execute the padding oracle runner — whose live CBC mechanism diagram lights up the attacker-controlled byte and flips the matching plaintext byte green in step with the recovery — recover a real truncated HMAC tag through a deterministic comparison-work oracle that models a naive comparison's timing leak, watch the CRIME length-leak recover a session secret from its two reflected request lines, step through the TLS evolution walkthrough, and compute risk with the protocol safety checklist. Newcomer on-ramp: jargon terms (MAC, IV/nonce, AEAD, padding oracle) carry a one-line plain-language gloss on hover/focus, a "four orders as a spectrum" map frames each attack before you run it, and the AEAD exhibit is honest that AEAD only *moves* the footgun to nonce reuse. The cryptographic exhibits use real WebCrypto operations; the timing chart deliberately counts comparisons instead of claiming noisy JavaScript wall-clock measurements, while the timeline and checklist are explanatory controls. The current configuration is encoded in the URL so a specific setup can be shared as a link.

## What Can Go Wrong

- Signature stripping in the naïve encrypt-then-sign protocol shown: bind and check the encrypted sender against the claimed sender.
- Surreptitious forwarding in the naïve sign-then-encrypt protocol shown: sign the intended recipient and check it after decryption.

The public-key exhibit assumes trusted bindings between identities and public keys. Signature verification checks bytes against a key; it does not establish human authorship by itself. Neither composition order is inherently broken: the complete protocol and identity bindings matter.

- MtE padding oracle exposure: decryption happens before MAC verification, so padding validity can become an oracle that leaks plaintext bytes.
- E&M plaintext-correlation leak: MACing plaintext separately exposes a reusable authenticator that can reveal message equality across sessions.
- TLS CBC timing side-channel (Lucky Thirteen): small processing differences during CBC record handling leak information about plaintext and padding validity.
- TLS 1.0 BEAST-era CBC composition weakness: CBC record chaining and composition details enabled practical chosen-plaintext attacks.
- Implementation pitfall in verification order: checking authenticity after decryption recreates oracle surfaces even if AES and HMAC are individually correct.
- AEAD nonce reuse: switching to AES-GCM removes the composition seam but adds one of its own — repeating a nonce under the same key collapses both confidentiality and integrity (see the linked nonce-guard demo).

## Real-World Usage

- TLS 1.0: chained each CBC record's IV from the previous record, creating the predictable-IV condition exploited by BEAST.
- TLS 1.1/1.2 CBC suites: use explicit IVs, which remove that TLS 1.0 condition, but retain decrypt-first MtE timing risk such as Lucky Thirteen.
- TLS 1.3: removed CBC record protection and mandates AEAD, demonstrating safer composition by design.
- SSH: its original binary packet format MACs the sequence number plus the unencrypted packet before encryption. Exhibit 1's equality leak is a deliberately simplified E&M model, not a wire-faithful SSH transcript.
- BEAST and Lucky Thirteen case studies: concrete attacks that showed protocol composition, not primitive choice alone, determines security outcomes.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-protocol-compose
cd crypto-lab-protocol-compose
npm install
npm run dev
`​``

## Related Demos
- [Iron Letter](https://systemslibrarian.github.io/crypto-lab-iron-letter/) — the ECIES pattern used in Exhibit 7.
- [HPKE Envelope](https://systemslibrarian.github.io/crypto-lab-hpke-envelope/) — modern context binding.
- [Vector Gate](https://systemslibrarian.github.io/crypto-lab-vector-gate/) — signature acceptance boundaries.
- [crypto-lab-padding-oracle](https://systemslibrarian.github.io/crypto-lab-padding-oracle/) — the Vaudenay AES-CBC PKCS#7 padding oracle that MAC-then-Encrypt exposes.
- [crypto-lab-aes-modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/) — AES-GCM and CBC modes, the building blocks composed here.
- [crypto-lab-nonce-guard](https://systemslibrarian.github.io/crypto-lab-nonce-guard/) — AES-GCM nonce-reuse pitfalls in the AEAD that replaces CBC composition.
- [crypto-lab-timing-oracle](https://systemslibrarian.github.io/crypto-lab-timing-oracle/) — the timing side-channels behind Lucky Thirteen and HMAC comparison leaks.
- [crypto-lab-mac-race](https://systemslibrarian.github.io/crypto-lab-mac-race/) — HMAC, CMAC, Poly1305, and GHASH, the authenticators these compositions rely on.

## Development

Exhibit 7 verification and catalog handoff: [extension-handoff.md](extension-handoff.md).
Its visible negative fixture shows why a correctly decrypted, valid signature
does not establish its intended recipient.


- `npm run dev` — local dev server.
- `npm run build` — type-check and produce the production bundle.
- `npm test` — Vitest suite covering the live crypto: composition round-trips, tamper rejection, byte-for-byte padding-oracle recovery, the E&M equality leak, CRIME compression recovery, comparison-work modeling of a timing leak and its fixed-work defense, and measured WCAG AA contrast for every color token in both themes.
- `npm run test:mutations` — six concrete Exhibit 7 source mutations with build/served-byte/restoration checks.
- `npm run test:a11y` — real-browser accessibility audit (Playwright + axe-core, WCAG 2.0/2.1 A + AA) run against the production build on the dark-only page. Run `npm run build` first.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Nonce Lattice

- **slug**: `crypto-lab-nonce-lattice`
- **repo**: https://github.com/systemslibrarian/crypto-lab-nonce-lattice
- **live**: https://systemslibrarian.github.io/crypto-lab-nonce-lattice/
- **commit_sha**: `98685cd00b5e16043defaa8f02213f6266672cba` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `53975bc18c6676421efa81ce33b8ed28118848d3`
- **read_from**: working tree (clean)
- **category**: ATTACKS | SIGNATURES  ·  **level**: advanced  ·  **--accent**: #7dd3fc
- **MISSING FIELDS**: claims, mutations

**Name (H1)**: Nonce Lattice  — _read from src/app.ts_

**Subtitle**: ECDSA · Hidden Number Problem · LLL  — _read from src/app.ts_

**Description**: Signs messages with biased or reused ECDSA nonces, then rebuilds those signatures as a lattice and runs LLL to recover the signer's private key in your browser.  — _read from src/app.ts_

**Why it matters**: A single leaked bit of nonce randomness can hand an attacker your signing key. This exact flaw drained real Bitcoin wallets and cracked the PlayStation 3, so every ECDSA implementation must nail its nonces.  — _read from src/app.ts_

**Card copy**: ECDSA nonce-bias lattice attack on secp256k1 and P-256 — Hidden Number Problem construction, in-browser LLL reduction, and byte-for-byte private-key recovery from biased nonces.

**Chips**: ECDSA · Hidden Number Problem · LLL Reduction · secp256k1

**Implements**: Babai rounding `src/lattice/babai.ts:37`, ECDSA `src/analysis.ts:4`, HMAC `src/crypto/biased-nonce.ts:27`, P-256 `src/analysis.ts:6`, secp256k1 `src/curves/secp256k1.ts:8`, SHA-256 `src/crypto/biased-nonce.ts:27`

**Attacks shown**: Key recovery `src/app.ts:202`, Lattice reduction `src/app.ts:144`, Nonce reuse `src/app.ts:130`, Side-channel (unspecified) `src/app.ts:133`, Timing side-channel `src/app.ts:270`

**References**: EC point arithmetic, Kyber, LWE, ML-KEM, P-384

**Standards body**: IETF, NIST, SECG

**Implementation**: @noble

**Spec citations, exactly as written**:

- `doi.org/10.1023/A:1025436905711` — first seen src/data/case-studies.ts:72 (1×)
- `FIPS 140-2` — first seen src/app.ts:271 (1×)
- `RFC 6979` — first seen README.md:12 (11×)
- `rfc6979` — first seen README.md:72 (17×)

**README — What Can Go Wrong**:

```text
- **Nonce reuse:** signing two different messages with the same nonce k leaks the private key directly through simple algebra — the classic failure behind the 2010 Sony PlayStation 3 code-signing key recovery.
- **Biased or partially known nonces:** even a few leaked or biased high/low bits per signature, gathered across enough signatures, let an attacker recover the key by solving the Hidden Number Problem with LLL/BKZ lattice reduction.
- **Weak randomness:** a low-entropy or broken PRNG produces predictable nonces and collapses ECDSA security; RFC 6979 deterministic nonces remove the RNG from the nonce-generation trust path, but do not by themselves stop timing or other implementation leakage.
- **Side-channel leakage of nonce bits:** cache or timing leaks from the scalar multiplication can expose exactly the partial-nonce information this lattice attack consumes.
- **Insufficient samples:** success depends on the number and quality of signatures, the leak model, the nonce draws, and the reduction. The on-screen `bits × signatures = 256` line is a useful first-order guide, not a hard boundary; the measured sweep shows a probabilistic ramp around it. Because this demo caps the sample count at 32 (browser-speed LLL), it needs much more leakage per signature than the asymptotic Nguyen–Shparlinski ECDSA result, which requires about `√(log₂ n)` known consecutive bits under its stated assumptions and a number of signatures at most linear in `log n`. Practical attacks use their own leakage distributions and sample counts; Minerva, for example, reports 2,100 signatures for its smart-card demonstration.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

**verification/ manifest** (1 file(s)):

- `verification/solve_hnp.py` (3172 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-nonce-lattice

## What It Is

A browser-based educational demo of ECDSA nonce leakage and lattice-based key recovery. Shows how partial nonce leakage or reuse can be exploited using the Hidden Number Problem and LLL/Babai lattice reduction. For classroom and self-study use only.

It is built for progressive disclosure. A newcomer meets the one governing equation first, then follows a **guided four-step walkthrough** (Sign → Build HNP → Reduce → Extract) that gates the deep panels behind step tabs mirroring the attack pipeline, so the hard lattice matrices come only after the intuition. Along the way: a live feasibility gauge that compares this demo's small signature budget with the asymptotic Nguyen–Shparlinski result of about `√(log₂ n)` known consecutive nonce bits under that paper's assumptions, a worked row-construction that turns one real signature into one lattice row, a **2-D geometric projection** where you watch the skewed starting basis snap into short, near-orthogonal reduced vectors with the key-carrying vector highlighted, a byte-for-byte key-recovery grid, and — for the nonce-reuse case — a fully worked two-signature derivation with the real numbers. The Lattice View still surfaces the single conceptual leap for deeper readers by outlining the winning short vector and showing that its secret coordinate divided by the scaling bound *is* the private key (`secretCoordinate / B mod n = d`). Historical case studies and the timeline sit behind a collapsed History section at the end.

## Exhibits

1. **The one equation** — the always-visible ECDSA congruence `s = k⁻¹(h + r·d) mod n` recast as `r·d − s·k + h ≡ 0 (mod n)`, the on-ramp the whole attack turns on.
2. **Configuration + presets** — pick curve, leak mode (MSB / LSB / fixed-prefix / reused-nonce / RFC 6979), leak size, and signature count; one-click scenario presets.
3. **Feasibility gauge** — plots your live config against a simple `bits × signatures = curve bits` guide and this demo's hand-calibrated numerical boundary. The first line is a starting heuristic, not an impossibility theorem; the caption distinguishes both model curves from the asymptotic Nguyen–Shparlinski result.
4. **Measured boundary** — the two curves above are a model, so **Measure this column** goes and checks them. For the current signature count it runs three complete end-to-end attacks (fresh key, fresh signatures, real LLL, byte-for-byte validation) at each of six leak sizes around the bit-count guide, prints the observed recovery rate per rung, and states where the measurement and the drawn curve disagree. Measured columns accumulate as dots over the modelled curves. Where it cannot honestly measure — a leak mode with no bits axis, a signature count too slow to sweep in a tab, or a centered ladder that lies past the 32-bit control — it declines and gives the reason instead of drawing a boundary it did not run.
5. **Guided walkthrough (Sign → Build HNP → Reduce → Extract)** — step tabs that reveal the deep panels in the pipeline's order.
6. **Signature log** — the captured `r, s, h`, digests, and leaked-nonce metadata that feed the attack.
7. **Row construction** — one real signature becoming one lattice row, with the modulus rows and the bound/scaling column labeled.
8. **2-D lattice projection** — an animated slice showing the starting basis vectors reduce into short, near-orthogonal ones, with the key-carrying vector highlighted along the `= d·B` axis.
9. **Lattice View + key bridge** — the before/after basis matrices and the equation `secretCoordinate / B mod n = d` reading the key out of the short vector.
10. **Recovery panel** — byte-for-byte comparison of the recovered key against the signer's key, verified against `Q = dG`.
11. **Nonce-reuse derivation** — the two-line PS3-style algebra (`k`, then `d`) with the real numbers, no lattice needed.
12. **History & context** — real-world case studies (PS3, Android, Minerva, TPM-FAIL, OpenSSL 2026), the historical timeline, and related labs.

**Warning:** This is an educational tool. It does not break real-world cryptosystems. See `docs/limitations.md` and `SECURITY.md`.

## When to Use It

- To understand ECDSA nonce leakage attacks.
- To demonstrate lattice-based recovery in a safe, reproducible setting.
- For teaching, labs, and cryptography exercises.
- Do NOT use it against real keys or systems. Note what makes it safe: the curves here are the real standardized ones (secp256k1, P-256) at full size, and the signatures really verify. What is artificial is that the signer deliberately hands the attacker known nonce bits. A correctly implemented signer leaks none of them, and this demo has no way to obtain them from one that does not.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-nonce-lattice](https://systemslibrarian.github.io/crypto-lab-nonce-lattice/)**

The demo lets you generate ECDSA signatures with deliberately leaked or biased nonce bits, then assembles the Hidden Number Problem lattice and runs LLL/Babai reduction to recover the private key. Adjust the leaked-bits and signature-count controls and the feasibility gauge marks your configuration against the bit-count guide and this demo's numerical boundary; the measured sweep then runs real attacks to show where recovery actually starts failing. On a successful run the Lattice View outlines the winning short vector and reads the key straight out of it, and a byte grid shows every reconstructed byte of the private key. This makes the relationship between leakage and attack feasibility concrete rather than asserted.

## What Can Go Wrong

- **Nonce reuse:** signing two different messages with the same nonce k leaks the private key directly through simple algebra — the classic failure behind the 2010 Sony PlayStation 3 code-signing key recovery.
- **Biased or partially known nonces:** even a few leaked or biased high/low bits per signature, gathered across enough signatures, let an attacker recover the key by solving the Hidden Number Problem with LLL/BKZ lattice reduction.
- **Weak randomness:** a low-entropy or broken PRNG produces predictable nonces and collapses ECDSA security; RFC 6979 deterministic nonces remove the RNG from the nonce-generation trust path, but do not by themselves stop timing or other implementation leakage.
- **Side-channel leakage of nonce bits:** cache or timing leaks from the scalar multiplication can expose exactly the partial-nonce information this lattice attack consumes.
- **Insufficient samples:** success depends on the number and quality of signatures, the leak model, the nonce draws, and the reduction. The on-screen `bits × signatures = 256` line is a useful first-order guide, not a hard boundary; the measured sweep shows a probabilistic ramp around it. Because this demo caps the sample count at 32 (browser-speed LLL), it needs much more leakage per signature than the asymptotic Nguyen–Shparlinski ECDSA result, which requires about `√(log₂ n)` known consecutive bits under its stated assumptions and a number of signatures at most linear in `log n`. Practical attacks use their own leakage distributions and sample counts; Minerva, for example, reports 2,100 signatures for its smart-card demonstration.

## Real-World Usage

- **Sony PlayStation 3 (2010):** the console's ECDSA code-signing key was recovered because the same nonce was reused across signatures.
- **Android Bitcoin wallets (2013):** weaknesses in Android's secure-random-number component put affected wallet keys and ECDSA signatures at risk, prompting wallet updates and key rotation.
- **Minerva (2019):** timing side channels leaking the nonce bit-length enabled Hidden Number Problem / lattice key recovery against several ECDSA implementations.
- **TPM-Fail (2019):** nonce timing leakage in TPM firmware allowed ECDSA private-key recovery via lattice methods.
- **OpenSSL advisory (29 September 2026):** [CVE-2026-54872](https://openssl-library.org/news/secadv/20260929.txt) discloses a small signing-time nonce leak in generic EC scalar multiplication, affecting Brainpool and other generic prime curves and SM2 on its generic path. Many timing measurements may enable lattice/HNP key recovery; the advisory does not establish universal practical exploitation. OpenSSL's dedicated P-256, P-384 and P-521 implementations are unaffected by this CVE. This lab uses different implementations and deliberately supplied nonce bits: it does not measure timing or reproduce the OpenSSL vulnerability. Follow the advisory's branch-specific upgrade guidance for affected deployments.
- **RFC 6979 deterministic ECDSA:** standardized in part to eliminate the RNG-driven nonce failures this attack class exploits.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-nonce-lattice
cd crypto-lab-nonce-lattice
npm install
npm run dev
`​``

## Recovery checks

`npm test` runs the seeded MSB-leak transcript through both the app's recovery
path and `verification/solve_hnp.py`, a separate Python HNP lattice solver.
The test compares their recovered scalars with the signing key and public key.
The fixture is generated locally; it is not a published attack-output vector.
The HNP context is [Nguyen and Shparlinski's partial-nonce work](https://www.di.ens.fr/~pnguyen/pub_NgSh02.htm).
The existing [RFC 6979](https://www.rfc-editor.org/rfc/rfc6979.html) mode is a
negative control with no nonce bits supplied to the attack. This is a property of the
configured experiment, not a guarantee that deterministic signing prevents leakage.
[RFC 6979 §4](https://www.rfc-editor.org/rfc/rfc6979.html#section-4) warns that
determinism can assist some side-channel attacks; implementations still need defenses.

`npm run build` also runs seven executable workflow-policy controls before
TypeScript and the production build. CI exercises the unit/build path on Node
22, 24, and 26, then runs the full Chromium behavior and WCAG gate separately.
Publishing authority is confined to no-checkout jobs, pull requests retain no
Pages bundle, main deployments cannot be cancelled midway, and only gated
patch/minor Dependabot updates may auto-merge.

## Related Demos

- [crypto-lab-ecdsa-forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) — ECDSA nonce reuse and RFC 6979 deterministic nonces.
- [crypto-lab-lll-break](https://systemslibrarian.github.io/crypto-lab-lll-break/) — LLL/BKZ lattice reduction on toy LWE.
- [crypto-lab-lwe-hints](https://systemslibrarian.github.io/crypto-lab-lwe-hints/) — recovering lattice secrets from approximate hints.
- [crypto-lab-nonce-guard](https://systemslibrarian.github.io/crypto-lab-nonce-guard/) — nonce misuse on the symmetric (AEAD) side.
- [crypto-lab-timing-oracle](https://systemslibrarian.github.io/crypto-lab-timing-oracle/) — the timing side channels that leak nonce bits.

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 systemslibrarian.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## JWT Forge

- **slug**: `crypto-lab-jwt-forge`
- **repo**: https://github.com/systemslibrarian/crypto-lab-jwt-forge
- **live**: https://systemslibrarian.github.io/crypto-lab-jwt-forge/
- **commit_sha**: `2f60e5329f04b43aaa5b2e3a82b9ec326338aaf5` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS | SIGNATURES  ·  **level**: beginner  ·  **--accent**: #e0a23b
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: JWT Forge  — _read from src/ui/app.ts_

**Subtitle**: JWS/JWT · alg:none · RS/HS confusion  — _read from src/ui/app.ts_

**Description**: Decode a token, swap its alg  — _read from src/ui/app.ts_

**Why it matters**: A verifier that trusts the token's own header to pick the algorithm or key can be tricked into accepting forged JWTs — bypassing authentication entirely. These are among the most-exploited bugs in real auth stacks.  — _read from src/ui/app.ts_

**Card copy**: Paste or generate a JWT, tamper with claims, and swap algorithms to watch alg:none and HS/RS key-confusion attacks succeed against a vulnerable verifier and fail against a correct one.

**Chips**: JWT · JWS · alg:none · HS/RS Key Confusion

**Implements**: ECDSA `src/jwt/keys.ts:58`, HMAC `src/jwt/sign.ts:66`, P-256 `src/jwt/keys.ts:58`, RSA `src/jwt/keys.ts:46`, SHA-256 `src/jwt/keys.ts:41`

**Attacks shown**: Brute force `README.md:54`, Nonce reuse `README.md:74`, Padding oracle `README.md:78`, Timing side-channel `README.md:77`

**Comment-only (named in code comments, not executed)**: Ed25519 `src/jwt/types.ts:16`, ML-DSA `src/jwt/types.ts:16`

**References**: Ed25519, RSA-OAEP, RSA-PSS

**Standards body**: IETF, NIST

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `draft-ietf-jose-deprecate-none-rsa15-08` — first seen README.md:46 (2×)
- `RFC 4648` — first seen src/jwt/base64url.ts:2 (1×)
- `RFC 7515` — first seen README.md:8 (6×)
- `RFC 7519` — first seen README.md:8 (3×)

**README — What Can Go Wrong**:

```text
- Trusting the token's own `alg` header lets an attacker set `alg:none` and strip the signature entirely.
- HS/RS key confusion: a verifier that handles all algorithms in one path can be tricked into verifying an HS256 token using the RSA *public* key as the HMAC secret, letting anyone forge tokens.
- Treating a signed JWT as confidential — JWS signs but does not encrypt, so the base64url payload is readable by anyone who holds the token.
- A valid signature is not authorization — skipping expiry, audience, or issuer claim checks lets stale or misdirected tokens through. This demo checks present `exp`/`nbf`/`iat` values as finite NumericDate numbers (fractional seconds permitted), requires `now < exp` and `now >= nbf` with zero leeway, and reports signature and claim validity separately. It applies no token-age policy to `iat`; audience and issuer authorization remain application policy outside this time-claim helper.
- Weak or shared HS256 secrets can be brute-forced offline once a single token is captured.
```

**Claims tested** (e2e/claims.spec.ts, 28 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:55
    - :55 `toHaveCount` expected `1` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:79
    - :79 `toBe` expected `total` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:80
    - :80 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:81
    - :81 `expect` expected _no expected value_ _(none)_
- `genuine RS256 token: the headline matches the token the page actually rendered` — e2e/claims.spec.ts:90
    - :97 `toBe` expected `'RS256'` _(literal)_
    - :98 `toBe` expected `''` _(literal)_
    - :99 `toBe` expected `String(header.alg)` _(expression)_
    - :100 `expect` expected _no expected value_ _(none)_
    - :102 `toHaveText` expected `/Valid signature — all checks passed/` _(regex)_
    - :103 `toHaveClass` expected `/valid/` _(regex)_
    - :104 `toBe` expected `'✓ valid'` _(literal)_
    - :105 `toBe` expected `'✓ valid'` _(literal)_
    - :106 `toHaveText` expected _no expected value_ _(none)_
    - :112 `toBe` expected `0` _(literal)_
    - :113 `toBe` expected `t.total` _(expression)_
    - :114 `toBe` expected `0` _(literal)_
    - :117 `toBe` expected `false` _(expression)_
    - :118 `toBe` expected `'number'` _(literal)_
- `alg:none SUCCEEDS against the vulnerable verifier, and the page says why` — e2e/claims.spec.ts:123
    - :126 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :131 `toBe` expected `'none'` _(literal)_
    - :132 `toBe` expected `''` _(literal)_
    - :133 `toBe` expected `true` _(expression)_
    - :134 `toBe` expected `'admin'` _(literal)_
    - :136 `toHaveClass` expected `/forged/` _(regex)_
    - :137 `toBe` expected `String(header.alg)` _(expression)_
    - :138 `expect` expected _no expected value_ _(none)_
    - :140 `expect` expected _no expected value_ _(none)_
    - :141 `toHaveText` expected _no expected value_ _(none)_
    - :147 `toHaveText` expected `/alg:none — causal chain/` _(regex)_
    - :148 `toHaveText` expected `/no signature is verified/` _(regex)_
    - :149 `toContainText` expected `'requires "none" to be on an explicit allowlist'` _(literal)_
    - :152 `toBe` expected `1` _(literal)_
    - :153 `toContainText` expected _no expected value_ _(none)_
- `alg:none is REFUSED by the correct verifier, naming the invariant that caught it` — e2e/claims.spec.ts:158
    - :161 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :165 `toHaveText` expected `/REJECTED AS EXPECTED/` _(regex)_
    - :168 `toBe` expected `forged` _(expression)_
    - :169 `expect` expected _no expected value_ _(none)_
    - :170 `toBe` expected _no expected value_ _(none)_
    - :173 `toHaveText` expected _no expected value_ _(none)_
    - :176 `expect` expected _no expected value_ _(none)_
    - :179 `toBe` expected `1` _(literal)_
    - :180 `toContainText` expected `'Claimed alg in allowlist?'` _(literal)_
- `an explicitly allowlisted alg:none token is never reported as a valid signature` — e2e/claims.spec.ts:183
    - :186 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :188 `toHaveText` expected `/REJECTED AS EXPECTED/` _(regex)_
    - :192 `toHaveText` expected `/ACCEPTED UNSECURED — NO SIGNATURE WAS CHECKED/` _(regex)_
    - :193 `toHaveText` expected `/Valid signature/` _(regex)_
    - :194 `expect` expected _no expected value_ _(none)_
    - :195 `toHaveClass` expected `/forged/` _(regex)_
    - :196 `toHaveText` expected `/NO signature was checked/` _(regex)_
- `key confusion SUCCEEDS against the vulnerable verifier using the public key as the secret` — e2e/claims.spec.ts:201
    - :205 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :209 `toBe` expected `'HS256'` _(literal)_
    - :210 `toBe` expected `''` _(literal)_
    - :211 `toBe` expected `true` _(expression)_
    - :213 `toBe` expected `String(header.alg)` _(expression)_
    - :214 `toBe` expected `'✓ valid'` _(literal)_
    - :215 `toHaveText` expected _no expected value_ _(none)_
    - :220 `toHaveText` expected `/RS\/HS key confusion — causal chain/` _(regex)_
    - :221 `toContainText` expected `'BEGIN PUBLIC KEY'` _(literal)_
    - :222 `toContainText` expected `'type-incompatible with the HMAC path'` _(literal)_
    - :225 `toBe` expected `1` _(literal)_
    - :226 `toContainText` expected `'RS/HS confusion'` _(literal)_
- `key confusion is REFUSED by the correct verifier, and both verdicts show side by side` — e2e/claims.spec.ts:229
    - :233 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :237 `toHaveText` expected `/REJECTED AS EXPECTED/` _(regex)_
    - :238 `toBe` expected `forged` _(expression)_
    - :239 `toBe` expected _no expected value_ _(none)_
    - :246 `toBe` expected `forged` _(expression)_
    - :249 `toHaveCount` expected `2` _(literal)_
    - :252 `toHaveText` expected `/Correct verifier/` _(regex)_
    - :253 `toHaveText` expected `/Vulnerable verifier/` _(regex)_
    - :255 `toHaveText` expected `/REJECTED AS EXPECTED/` _(regex)_
    - :256 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :257 `expect` expected _no expected value_ _(none)_
    - :258 `toBe` expected `'✓ valid'` _(literal)_
    - :261 `toBe` expected `await statusValue(vulnerable, 'Claimed alg')` _(expression)_
    - :262 `toBe` expected `String(decodeToken(forged).header.alg)` _(expression)_
    - :265 `toHaveText` expected _no expected value_ _(none)_
- `key confusion fails when the verifier does not hold the key the attacker MACed with` — e2e/claims.spec.ts:273
    - :277 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :282 `toHaveText` expected `/Rejected|REJECTED AS EXPECTED/` _(regex)_
    - :283 `toBe` expected `'⚠ invalid'` _(literal)_
    - :284 `toHaveText` expected `/signature did not verify/` _(regex)_
    - :287 `toHaveText` expected _no expected value_ _(none)_
    - :290 `toBe` expected `'⚠ invalid'` _(literal)_
- `silent tamper is refused by BOTH verifiers — the control that proves the point` — e2e/claims.spec.ts:295
    - :300 `toHaveText` expected `/REJECTED AS EXPECTED/` _(regex)_
    - :305 `toBe` expected `true` _(expression)_
    - :306 `toBe` expected `before.sig` _(expression)_
    - :309 `expect` expected _no expected value_ _(none)_
    - :310 `toBe` expected `'⚠ invalid'` _(literal)_
    - :311 `expect` expected _no expected value_ _(none)_
    - :312 `toHaveText` expected `/It does NOT pass/` _(regex)_
    - :315 `toHaveText` expected _no expected value_ _(none)_
    - :318 `toHaveText` expected `/REJECTED AS EXPECTED/` _(regex)_
    - :319 `expect` expected _no expected value_ _(none)_
    - :320 `toBe` expected `'⚠ invalid'` _(literal)_
    - :326 `toHaveText` expected `/REJECTED AS EXPECTED/` _(regex)_
    - :327 `toHaveText` expected `/REJECTED AS EXPECTED/` _(regex)_
    - :328 `toBe` expected `'⚠ invalid'` _(literal)_
    - :329 `toBe` expected `'⚠ invalid'` _(literal)_
    - :330 `toHaveText` expected _no expected value_ _(none)_
- `hand-edited claims with the old signature are rejected, and the edit is visible in the diff` — e2e/claims.spec.ts:335
    - :341 `toBe` expected `false` _(expression)_
    - :346 `toHaveText` expected `/REJECTED AS EXPECTED/` _(regex)_
    - :347 `toBe` expected `'⚠ invalid'` _(literal)_
    - :348 `toHaveText` expected `/manual tamper — causal chain/` _(regex)_
    - :351 `toBe` expected `decodeToken(genuine).sig` _(expression)_
    - :352 `toBe` expected `true` _(expression)_
- `the diff table lists exactly the fields that actually differ` — e2e/claims.spec.ts:357
    - :361 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :372 `toBe` expected `total` _(expression)_
    - :391 `toEqual` expected `[...expected].sort()` _(expression)_
    - :392 `toBe` expected `expected.size` _(expression)_
    - :395 `toBe` expected `true` _(expression)_
    - :396 `toBe` expected `true` _(expression)_
    - :397 `toContainText` expected `'"none"'` _(literal)_
- `an empty allowlist accepts nothing — and the vulnerable verifier bypasses it under a different headline` — e2e/claims.spec.ts:402
    - :404 `toHaveText` expected `/Valid signature — all checks passed/` _(regex)_
    - :408 `toHaveText` expected _no expected value_ _(none)_
    - :411 `toHaveText` expected `/^✓ Rejected$/` _(regex)_
    - :412 `toBe` expected _no expected value_ _(none)_
    - :415 `toBe` expected `'—'` _(literal)_
    - :417 `toBe` expected `1` _(literal)_
    - :418 `toBe` expected `1` _(literal)_
    - :423 `toHaveText` expected `/ACCEPTED OUTSIDE THE POLICY ALLOWLIST/` _(regex)_
    - :424 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :425 `toBe` expected `'✓ valid'` _(literal)_
    - :426 `toHaveText` expected _no expected value_ _(none)_
    - :429 `toContainText` expected _no expected value_ _(none)_
- `the correct verifier refuses to improvise when it holds no key for the token alg` — e2e/claims.spec.ts:434
    - :438 `toHaveText` expected _no expected value_ _(none)_
    - :441 `toBe` expected _no expected value_ _(none)_
    - :444 `expect` expected _no expected value_ _(none)_
    - :445 `toContainText` expected _no expected value_ _(none)_
- `re-signing as ${alg} verifies cleanly once the policy allows ${alg} and holds the ${keyKind}` — e2e/claims.spec.ts:456
    - :464 `toHaveText` expected _no expected value_ _(none)_
    - :470 `toHaveText` expected `/Valid signature — all checks passed/` _(regex)_
    - :473 `toBe` expected `alg` _(expression)_
    - :474 `toBe` expected `alg` _(expression)_
    - :475 `toBe` expected `'✓ valid'` _(literal)_
    - :476 `toContainText` expected _no expected value_ _(none)_
    - :480 `toBe` expected `0` _(literal)_
    - :481 `toBe` expected `0` _(literal)_
- `an expired token reports a VALID signature and INVALID claims, with numbers that agree` — e2e/claims.spec.ts:485
    - :494 `toHaveText` expected `/signature is valid but token expired/` _(regex)_
    - :496 `toBe` expected `'✓ valid'` _(literal)_
    - :497 `toBe` expected `'⚠ invalid'` _(literal)_
    - :501 `expect` expected _no expected value_ _(none)_
    - :503 `toBe` expected `pastExp` _(expression)_
    - :504 `expect` expected _no expected value_ _(none)_
    - :506 `toBe` expected `pastExp` _(expression)_
    - :508 `toContainText` expected `'Claims (exp/nbf) valid?'` _(literal)_
- `exact expiry and malformed NumericDate reject after real signing without conflating signature status` — e2e/claims.spec.ts:513
    - :523 `toContainText` expected _no expected value_ _(none)_
    - :526 `toBe` expected `'✓ valid'` _(literal)_
    - :527 `toBe` expected `'⚠ invalid'` _(literal)_
    - :529 `toEqual` expected `(timeClaims as Record<string, unknown>)[name]` _(expression)_
- `the token editor fails closed on bad JSON and on an unsignable alg` — e2e/claims.spec.ts:533
    - :541 `toHaveText` expected `/Header or payload is not valid JSON/` _(regex)_
    - :542 `toBe` expected `before` _(expression)_
    - :547 `toHaveText` expected _no expected value_ _(none)_
    - :550 `toBe` expected `before` _(expression)_
- `a malformed pasted token is rejected at parse time, before any verification` — e2e/claims.spec.ts:553
    - :560 `toHaveText` expected _no expected value_ _(none)_
    - :563 `toBe` expected _no expected value_ _(none)_
    - :566 `expect` expected _no expected value_ _(none)_
    - :567 `expect` expected _no expected value_ _(none)_
    - :571 `toContainText` expected `'This token cannot be decoded'` _(literal)_
- `the guided tour walks all 7 steps, and each step lands on the verdict it promises` — e2e/claims.spec.ts:576
    - :585 `toHaveText` expected `/step 1 of \d+/` _(regex)_
    - :587 `toBe` expected `promised` _(expression)_
    - :588 `toBe` expected `total` _(expression)_
    - :598 `toBe` expected `expected.length + 1` _(expression)_
    - :601 `toHaveText` expected `new RegExp('step ${i} of ${total}')` _(expression)_
    - :604 `toBe` expected `total` _(expression)_
    - :605 `toBe` expected `1` _(literal)_
    - :606 `toBe` expected `i - 1` _(expression)_
    - :608 `toBeDisabled` expected _no expected value_ _(none)_
    - :609 `toBeEnabled` expected _no expected value_ _(none)_
    - :612 `toHaveText` expected `expected[i - 1]` _(expression)_
    - :618 `toHaveCount` expected `2` _(literal)_
    - :619 `toHaveText` expected `/REJECTED AS EXPECTED/` _(regex)_
    - :620 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :626 `toHaveText` expected `/Finish/` _(regex)_
    - :628 `toBeVisible` expected _no expected value_ _(none)_
- `the vulnerable verifier is labelled as broken wherever it is selected` — e2e/claims.spec.ts:633
    - :635 `toHaveClass` expected `/\bon\b/` _(regex)_
    - :636 `toContainText` expected _no expected value_ _(none)_
    - :641 `toHaveClass` expected `/\bon\b/` _(regex)_
    - :642 `toContainText` expected `'DELIBERATELY BROKEN'` _(literal)_
    - :643 `toContainText` expected _no expected value_ _(none)_
    - :646 `expect` expected _no expected value_ _(none)_
- `three scripted attacks are offered, and each one changes the token` — e2e/claims.spec.ts:649
    - :652 `toHaveCount` expected `3` _(literal)_
    - :658 `toBeVisible` expected _no expected value_ _(none)_
    - :660 `toBe` expected `genuine` _(expression)_
    - :663 `toHaveText` expected `/Valid signature — all checks passed/` _(regex)_
    - :664 `toBe` expected `genuine` _(expression)_
    - :666 `toBe` expected `4` _(literal)_
- `a shared scenario link reproduces the attack in a session with different keys` — e2e/claims.spec.ts:669
    - :674 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :681 `expect` expected _no expected value_ _(none)_
    - :682 `toBe` expected `link` _(expression)_
    - :688 `toHaveCount` expected `2` _(literal)_
    - :689 `toHaveText` expected `/REJECTED AS EXPECTED/` _(regex)_
    - :690 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :694 `toBe` expected `forgedHere` _(expression)_
    - :695 `toBe` expected `'HS256'` _(literal)_
    - :696 `toBe` expected `true` _(expression)_
- `the copied summary says the same thing the result panel says` — e2e/claims.spec.ts:700
    - :704 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :711 `expect` expected _no expected value_ _(none)_
    - :712 `expect` expected _no expected value_ _(none)_
    - :713 `expect` expected _no expected value_ _(none)_
    - :714 `expect` expected _no expected value_ _(none)_
    - :715 `expect` expected _no expected value_ _(none)_
    - :716 `expect` expected _no expected value_ _(none)_
    - :717 `expect` expected _no expected value_ _(none)_
- `privacy request boundary distinguishes own resources from external destinations` — e2e/claims.spec.ts:727
    - :732 `toBe` expected `true` _(expression)_
    - :741 `toBe` expected `false` _(expression)_
- `nothing leaves the page: no third-party requests, no persisted key material` — e2e/claims.spec.ts:746
    - :748 `expect` expected _no expected value_ _(none)_
    - :759 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :761 `toHaveText` expected `/FORGED TOKEN ACCEPTED/` _(regex)_
    - :763 `toEqual` expected `[]` _(expression)_
    - :768 `toEqual` expected `[]` _(expression)_
    - :769 `toEqual` expected `[]` _(expression)_
    - :770 `toContainText` expected `'never persisted'` _(literal)_
    - :771 `toContainText` expected `'Not a JWE'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-jwt-forge

## What It Is

JWT Forge is a browser playground for **JWS signature verification** — the integrity layer
under JSON Web Tokens. It signs and verifies tokens with real WebCrypto primitives:
**HMAC-SHA256 (HS256)**, **RSASSA-PKCS1-v1_5 (RS256)**, **ECDSA P-256 (ES256)**, and the
unsecured **`none`** algorithm, following RFC 7515 (JWS) and RFC 7519 (JWT). The signature
proves a token's **integrity and origin** — it is *not* encryption, so the contents stay
readable by anyone. The security model is mixed: HS256 is symmetric (one shared secret),
while RS256 and ES256 are asymmetric (a private key signs, a public key verifies). The demo
exists to make two classic structural verification bugs — `alg:none` and HS/RS key
confusion — concrete, by running the same forged token against a *correct* verifier and a
deliberately *vulnerable* one.

> **Scope.** Not production crypto — a teaching demo. The signature operations are real, but the lab deliberately includes vulnerable verification paths and does not implement a complete authentication or authorization system. Use invented data and a maintained, reviewed JWT library for deployments.

## When to Use It

- **Stateless service-to-service auth** — a resource server can verify a JWS token's origin
  and integrity from a key alone, with no session lookup, because the signature binds the
  claims to the issuer.
- **Asymmetric signing (RS256 / ES256) when verifiers must not be able to mint tokens** —
  only the issuer holds the private key; everyone else holds the public key and can verify
  but never forge.
- **Symmetric signing (HS256) inside a single trust domain** — when the same party issues
  and verifies and can safely share a secret, HMAC is fast and simple.
- **ES256 over RS256 when size and speed matter** — P-256 signatures are far smaller and
  faster to produce than 2048-bit RSA, which helps on constrained or high-volume paths.
- **When NOT to use it:** never reach for JWS to *hide* data — it signs, it does not encrypt
  (use JWE for confidentiality). And never accept `alg:none`, or let the token's own header
  choose the verification algorithm — that is exactly the flaw this demo exploits.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-jwt-forge](https://systemslibrarian.github.io/crypto-lab-jwt-forge/)**

Decode and inspect a token, mutate its header and claims, swap its algorithm, and launch
three scripted attacks (`alg:none`, RS/HS key confusion, and a silent-tamper control). A
**verifier-policy** panel lets you set the accepted-algorithm allowlist, choose which key the
verifier holds, and flip between a **Correct** and a **Vulnerable** verifier — with a
side-by-side comparison, a step-by-step decision trace, a guided tour, and shareable scenario
links. This demo verifies **signatures only**; it does not encrypt or decrypt anything, and
all keys are generated in your browser per session and never leave the page.

**JOSE status (November 6, 2026):** The IESG [approved draft-ietf-jose-deprecate-none-rsa15](https://datatracker.ietf.org/doc/draft-ietf-jose-deprecate-none-rsa15/), which is awaiting RFC publication. [Draft-08 §5](https://datatracker.ietf.org/doc/html/draft-ietf-jose-deprecate-none-rsa15-08#section-5) calls for JWS `none` to be disabled by default; any necessary exception must be limited to specific objects or operations, not a global setting. The `none` checkbox here is a teaching control and cannot express such a scoped exception. The draft also addresses JWE `RSA1_5` encryption, which this JWS-only lab does not implement; it does not deprecate RS256 signatures. The forged-token exercise remains intentionally available.

## What Can Go Wrong

- Trusting the token's own `alg` header lets an attacker set `alg:none` and strip the signature entirely.
- HS/RS key confusion: a verifier that handles all algorithms in one path can be tricked into verifying an HS256 token using the RSA *public* key as the HMAC secret, letting anyone forge tokens.
- Treating a signed JWT as confidential — JWS signs but does not encrypt, so the base64url payload is readable by anyone who holds the token.
- A valid signature is not authorization — skipping expiry, audience, or issuer claim checks lets stale or misdirected tokens through. This demo checks present `exp`/`nbf`/`iat` values as finite NumericDate numbers (fractional seconds permitted), requires `now < exp` and `now >= nbf` with zero leeway, and reports signature and claim validity separately. It applies no token-age policy to `iat`; audience and issuer authorization remain application policy outside this time-claim helper.
- Weak or shared HS256 secrets can be brute-forced offline once a single token is captured.

## Real-World Usage

- Bearer tokens for stateless API and service-to-service authentication (OAuth 2.0 and OpenID Connect ID tokens).
- Session and access tokens in single-page apps and mobile clients.
- Asymmetric signing (RS256/ES256) where one identity provider mints tokens and many resource servers verify them with the public key.
- The `alg:none` and key-confusion bugs are a real, repeatedly rediscovered class of vulnerability in JWT libraries and deployments.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-jwt-forge
cd crypto-lab-jwt-forge
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-ecdsa-forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) — the ES256 signature scheme and how nonce reuse forges it.
- [crypto-lab-rsa-forge](https://systemslibrarian.github.io/crypto-lab-rsa-forge/) — the RS256 primitive with its OAEP/PSS/PKCS#1 attacks.
- [crypto-lab-ed25519-forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) — a modern signature scheme and the verification subtleties that bite implementers.
- [crypto-lab-timing-oracle](https://systemslibrarian.github.io/crypto-lab-timing-oracle/) — why HMAC and signature checks must be constant-time.
- [crypto-lab-padding-oracle](https://systemslibrarian.github.io/crypto-lab-padding-oracle/) — another structural verification bug exploited a byte at a time.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## LWE Hints

- **slug**: `crypto-lab-lwe-hints`
- **repo**: https://github.com/systemslibrarian/crypto-lab-lwe-hints
- **live**: https://systemslibrarian.github.io/crypto-lab-lwe-hints/
- **commit_sha**: `6df76edc455f3af373e57f75096b2bb972f0dd85` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `b5cf04313c21a7984e8d212751ac8cbb854951c4`
- **read_from**: working tree (clean)
- **category**: ATTACKS | POST-QUANTUM  ·  **level**: advanced  ·  **--accent**: #5cc8ff
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: LWE Hints  — _read from index.html_

**Subtitle**: sparse-ternary LWE · ePrint 2026/1081  — _read from index.html_

**Description**: Estimate how many side-channel hints recover a sparse-ternary LWE secret, comparing the new O(h·log₂h) hint budget against the prior ≈n/2 baseline across the paper's (n, h) regimes.  — _read from index.html_

**Why it matters**: Recovery cost scales with a secret's Hamming weight, not its dimension. Sparse-secret FHE deployments with any leakage path are far more exposed than an O(n) threshold suggests — raising h and masking leakage becomes part of the threat model.  — _read from index.html_

**Card copy**: Counts how many leakage hints collapse an LWE lattice problem on sparse ternary secrets, then recovers a toy secret from real hints and tests the Gaussian assumption against sampled data. ePrint 2026/1081.

**Chips**: LWE · Sparse Ternary Secrets · Approximate Hints · Lattice

**Implements**: LWE `src/attack.ts:103`

**Attacks shown**: Side-channel (unspecified) `src/main.ts:539`

**Comment-only (named in code comments, not executed)**: Kyber `src/attack.ts:30`

**References**: BFV, BGV, CKKS, Dilithium, FrodoKEM, Kyber, ML-DSA, ML-KEM, NTT

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `ePrint 2026/1081` — first seen README.md:5 (8×)
- `eprint.iacr.org/2026/1081` — first seen README.md:9 (3×)
- `FIPS 203` — first seen README.md:139 (1×)
- `FIPS 204` — first seen README.md:139 (1×)

**README — What Can Go Wrong**:

```text
- **Low Hamming weight is a double edge** — choosing very small `h` for FHE efficiency is exactly what makes the secret cheap to recover once hints leak; the `O(h·log₂h)` budget shrinks as `h` shrinks.
- **Approximate vs perfect hints differ** — hints carrying error are weaker per-hint than perfect hints, so a deployment can reach "enough" leakage faster or slower than a naive count implies.
- **The result rests on the GAA** — the `O(h·log₂h)` law is empirical under the Gaussian Approximation Assumption; outside the regimes the paper validates, the estimate may not hold.
- **Hint budget met ≠ key recovered** — crossing the estimator's threshold is necessary, not sufficient; recovery at the paper's parameters still requires lattice reduction, which this tool deliberately does not do. The toy-parameter exhibit is the one place a recovery is completed, and it gets there with perfect hints and linear algebra rather than by meeting the estimator's budget.
- **Old margins over-estimate safety** — assuming the prior `O(n)` (`≈ n/2`) threshold over-states how much leakage a sparse-secret deployment can tolerate.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-lwe-hints

## What It Is

An educational estimator of how many side-channel **hints** are needed to recover a **sparse-ternary LWE secret** — under the `O(h·log₂h)` law of ePrint 2026/1081 versus the prior `O(n)` threshold — plus **one concrete instance where the recovery is actually carried out**, at toy parameters, so the structural claim underneath the law is demonstrated instead of only asserted.

This demo teaches one result from Hhan, Hong, Kim, Lee, and Lee, *"From Perfect
to Approximate Hints: Efficient LWE Secret Recovery Leveraging Low Hamming
Weight"* ([IACR ePrint 2026/1081](https://eprint.iacr.org/2026/1081)).

LWE (Learning With Errors) underpins lattice post-quantum crypto and FHE. For
efficiency, FHE often uses **sparse ternary secrets**: `s ∈ {−1, 0, +1}ⁿ` with
only `h` nonzero entries (`h ≪ n`). A side channel can leak **hints** — linear
equations about `s`:

- **perfect hint:** `l = ⟨v, s⟩`
- **approximate hint:** `l = ⟨v, s⟩ + e` (small error `e`)

**The result.** Prior work needed `≈ n/2` perfect/modular hints (an `O(n)`
threshold). This paper shows — empirically, under the **Gaussian Approximation
Assumption (GAA)** — that only `O(h·log₂h)` hints suffice. For the FHE anchor
`(n, h) = (2¹⁵, 32)` that is **320 hints instead of 16,384 — a ~50× drop.**

The demo *computes* these counts with plain arithmetic
(`C·h·log₂h` vs `n/2`, with `C = 2` derived from the paper's anchor). The estimator
is deterministic and paper-scale: no lattice reduction, no side channel, no network,
same input ⇒ same output. Every number is auditable in [`src/model.ts`](src/model.ts)
and [`PAPER-NOTES.md`](PAPER-NOTES.md).

**And then one exhibit stops estimating and runs.** [`src/attack.ts`](src/attack.ts)
generates a genuine LWE instance — `A·s + e = b (mod q)` with `q = 3329`, a sparse
ternary `s`, errors in `[−2, 2]` — and recovers `s` from perfect hints
`l = ⟨v, s⟩ mod q`, reading only the hints. Adaptive binary splitting locates the
support; Gaussian elimination over GF(q) solves for the values; the recovered vector
is then checked twice, against the planted secret coordinate by coordinate and
against the LWE samples themselves (`max |b − A·ŝ| ≤ 2`, while a different
weight-`h` secret leaves residuals near `q/2`). At `n = 512, h = 8` it finishes in
roughly 60 hints against a prior threshold of 256, and a built-in sweep shows the
cost climbing with `h` while `n/2` does not move at all.

**This is not a re-run of the paper.** That method handles *approximate* hints, leans
on the GAA, and finishes with lattice reduction; its hint count is a different number
and neither validates the other. The parameters here are toys — `n` in the hundreds
and a 12-bit modulus, labelled as such on the page. What the exhibit demonstrates on
a real instance is the structure both share: locating *which* coordinates are nonzero
is the expensive part, it costs on the order of `h·log₂(n/h)`, and the total therefore
scales with `h` and the log of the dimension rather than with `n`.

> ✅ **Verification.** The paper (`2026-1081.pdf`) is committed, and `C = 2`
> reproduces **every row of Table 1** — all four Hamming weights
> `h ∈ {32, 64, 128, 192} → {320, 768, 1792, 2913}` and the prior `n/2` baseline
> across `n ∈ {2¹⁴, 2¹⁵, 2¹⁶}`. Full transcription in `PAPER-NOTES.md`; remaining
> assumptions in the in-app **Known Gaps** panel and `BUILD-NOTES.md`.

## Exhibits

The page is a guided path from "what is even leaking?" to "why is the cost
`h·log₂h` and not just `h`?":

1. **TL;DR + guided collapse** — the headline (`320` vs `16,384`) and a one-click
   sweep that drops `h` and watches the new threshold collapse.
2. **Live readout** — `(n, h)` → hint counts and the reduction factor.
3. **Interactive chart** — the new `C·h·log₂h` curve vs the prior `n/2` baseline,
   with the reduction factor drawn as the annotated vertical **gap** between the
   two lines, and a plain-language note on *why* the prior baseline was `n/2`.
4. **How it works** — a collapsible **"What is LWE?" primer** (the noisy system
   `A·s + e = b` a hint augments), the sparse-secret strip reworked to make
   `h ≪ n` legible as *"in a window this size you'd expect ~0 nonzeros,"* and a
   fixed, hand-checkable worked hint (perfect vs approximate on the *same*
   instance).
5. **Finding positions: `log₂n` search cost** — three independent binary
   searches for `h = 3` nonzeros among `n = 16`. Each button press advances one
   round: one locating hint per target, not one shared hint. The worst case is
   `⌈log₂n⌉ = 4` per position, or 12 independent hints overall. This illustrates
   position-search overhead; it does not derive the paper's `h·log₂h` law.
   The separate adaptive group-testing exhibit reports its own prediction
   `h·⌈log₂(n/h)⌉ + h`, including value hints; neither toy cost is the paper
   estimator `2h·log₂h`.
6. **Run it: recover a real secret from real hints** — the previous exhibit's
   intuition, carried out on an actual LWE instance. Choose `n`, `h`, and a seed;
   the page plants a sparse ternary secret, publishes hints, locates the support by
   adaptive binary splitting, solves for the values over GF(3329), and reports
   whether the recovered vector equals the planted one and whether it explains the
   LWE samples — alongside a control secret that does not. A sweep over
   `h = 2 … 32` puts the measured cost next to the flat `n/2` baseline. Toy
   parameters, said so on the page.
7. **The GAA, measured** — the `heuristic · GAA` badge, turned into an observation.
   A perfect hint against a weight-`h` sparse secret is a sum of `h` independent
   symmetric terms, so the assumption predicts mean 0 and spread `√(h·24)` from `h`
   alone. The page samples 4,000 hints, histograms them against *that* Gaussian (not
   one refitted to the sample), and reports a continuity-corrected Kolmogorov–Smirnov
   statistic against its 5% critical value. Not rejected at `h = 32, 64, 128, 192`;
   decisively rejected at `h = 1` and `h = 2` — the assumption is weakest exactly
   where FHE parameter choices push.
8. **Where hints come from** + **threat-scenario calculator** — real leakage
   channels (DPA / cache / EM) and a Safe / Manageable / Dangerous verdict, with
   the leak-rate knob annotated with realistic anchors. Below it, **paste your own
   leakage profile**: one number per period, newline- or comma-separated, with
   `label:` prefixes and `#` comments, and the page finds the period at which the
   running total crosses `C·h·log₂h` for the selected regime. Bad lines are reported
   against their line number rather than silently counted as zero, and moving the
   `h` slider moves the line your profile has to cross. The three scenarios are now
   starting points that fill the box, not the only options.
9. **Self-check, misconceptions, parameters & sources, known gaps** — honesty
   framing, including exactly where the toy-parameter recovery stops and the
   paper's method begins.

## When to Use It

- To understand **why sparse secrets are a liability** under side-channel leakage.
- To estimate, for a given `(n, h)` and a leakage rate, **whether a deployment
  accumulates enough hints** to cross the new-method threshold.
- As a teaching aid for the difference between **perfect** and **approximate**
  hints and between `O(n)` and `O(h log h)` scaling.
- Do NOT treat this as a cryptanalysis tool or a security assessment of any concrete
  system — it is an educational estimator, and "recoverable" here means only that
  *the paper's hint budget is met*, nothing more.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-lwe-hints](https://systemslibrarian.github.io/crypto-lab-lwe-hints/)**

State is deep-linkable via the query string, e.g.
`?h=32&nexp=15` reproduces the paper anchor. Adjust `(n, h)` and the leakage
assumptions to watch the `O(h·log₂h)` hint budget move against the prior `n/2`
baseline, with every figure computed by the auditable `src/model.ts`.

## What Can Go Wrong

- **Low Hamming weight is a double edge** — choosing very small `h` for FHE efficiency is exactly what makes the secret cheap to recover once hints leak; the `O(h·log₂h)` budget shrinks as `h` shrinks.
- **Approximate vs perfect hints differ** — hints carrying error are weaker per-hint than perfect hints, so a deployment can reach "enough" leakage faster or slower than a naive count implies.
- **The result rests on the GAA** — the `O(h·log₂h)` law is empirical under the Gaussian Approximation Assumption; outside the regimes the paper validates, the estimate may not hold.
- **Hint budget met ≠ key recovered** — crossing the estimator's threshold is necessary, not sufficient; recovery at the paper's parameters still requires lattice reduction, which this tool deliberately does not do. The toy-parameter exhibit is the one place a recovery is completed, and it gets there with perfect hints and linear algebra rather than by meeting the estimator's budget.
- **Old margins over-estimate safety** — assuming the prior `O(n)` (`≈ n/2`) threshold over-states how much leakage a sparse-secret deployment can tolerate.

## Real-World Usage

- **Sparse ternary secrets** are standard in FHE libraries (HElib, Microsoft SEAL, OpenFHE) for CKKS/BFV/BGV performance.
- **LWE and Module-LWE** underpin lattice post-quantum standards such as ML-KEM (FIPS 203) and ML-DSA (FIPS 204).
- **Side-channel leakage of linear hints** about a secret is a documented threat model against lattice implementations.
- **The modeled result** is from Hhan, Hong, Kim, Lee & Lee (IACR ePrint 2026/1081), which informs how conservatively to choose Hamming weight.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-lwe-hints
cd crypto-lab-lwe-hints
npm install
npm run dev
`​``

Requires Node 20+. No runtime dependencies. Additional scripts:

`​``bash
npm test          # vitest: paper-anchor invariants, the real recovery, the GAA
                  #         measurement, and the leakage-profile parser
npm run build     # tsc --noEmit + production build into dist/
npm run preview   # preview the production build
npm run test:a11y # Playwright: axe WCAG A/AA gate in both themes, plus
                  #             e2e/demo.spec.ts behavioural gate
`​``

`e2e/demo.spec.ts` asserts the computed outcome and the failure path of each live
exhibit: the recovery matches the planted secret and explains the LWE samples while a
control secret does not, the hint accounting adds up and beats `n/2`, the sweep is
monotone in `h` while the baseline is flat, the KS statistic agrees with its own
verdict and rejects `h = 1`, and the profile parser reports unreadable lines instead
of counting them as zero.

## Related Demos

- [crypto-lab-lll-break](https://systemslibrarian.github.io/crypto-lab-lll-break/) — LLL/BKZ lattice reduction on toy LWE, the attack this estimator stops short of.
- [crypto-lab-syndrome-drain](https://systemslibrarian.github.io/crypto-lab-syndrome-drain/) — sibling single-result estimator in the same house style.
- [crypto-lab-lattice-fault](https://systemslibrarian.github.io/crypto-lab-lattice-fault/) — physical side channels that produce the kind of leakage modeled here.
- [crypto-lab-frodo-vault](https://systemslibrarian.github.io/crypto-lab-frodo-vault/) — plain-LWE KEM that grounds the LWE intuition.
- [crypto-lab-scloud-vault](https://systemslibrarian.github.io/crypto-lab-scloud-vault/) — an LWE KEM that also uses ternary secrets.

## About the Suite

This is one of the **crypto-lab** demos — small, auditable, single-result
educational tools in a shared house style (Vite + TypeScript, a pure
deterministic `src/model.ts`, pinned tests, progressive-disclosure UI, dark
default, honesty badges).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Syndrome Drain

- **slug**: `crypto-lab-syndrome-drain`
- **repo**: https://github.com/systemslibrarian/crypto-lab-syndrome-drain
- **live**: https://systemslibrarian.github.io/crypto-lab-syndrome-drain/
- **commit_sha**: `99874ba70d1a3903adf99783a2ea8ca99682400b` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS | POST-QUANTUM  ·  **level**: advanced  ·  **--accent**: #58a6ff
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: Syndrome Drain  — _read from index.html_

**Subtitle**: Code-based KEMs · DOOM · IACR ePrint 2026/517  — _read from index.html_

**Description**: Drag the reuse count D and watch each KEM's ISD/DOOM work estimate drain toward the 143-bit NIST Level-1 floor — computed live from published Level-1 parameters — then run a real decode-one-out-of-many search at toy scale and measure the √M discount yourself.  — _read from index.html_

**Why it matters**: Reusing one public key across many sessions never errors — handshakes still succeed — yet the modeled multi-instance decoding margin erodes. Firmware, cached server keys and static prekeys can cross the ISD/DOOM model's Level-1 reference line unless you rotate on session volume.  — _read from index.html_

**Card copy**: How code-based KEMs erode below NIST Level 1 when one public key derives many session keys — run a toy decode-one-of-many search and watch the measured work fall as √D, then compute when to rotate keys.

**Chips**: DOOM · Syndrome Decoding · vs. Code-Based KEMs · May & Sá Diogo 2026

**Implements**: N/A

**Attacks shown**: Cache timing `README.md:91`, Key recovery `FIX-NOTES.md:39`, Timing side-channel `README.md:90`

**Comment-only (named in code comments, not executed)**: BIKE `src/doom.ts:36`, Classic McEliece `src/doom.ts:36`, Hamming code `src/main.ts:501`, HQC `src/doom.ts:36`, Information-set decoding `src/main.ts:204`, Pairing `src/model.ts:209`

**References**: BCH, BIKE, Classic McEliece, HPKE, HQC, Hamming code, Information-set decoding, Kyber, ML-KEM, Pairing, Reed-Muller, Reed-Solomon

**Standards body**: _none_

**Implementation**: N/A (model or attack)

**Spec citations, exactly as written**:

- `Crypto 2011` — first seen README.md:142 (1×)
- `ePrint 2026/1984` — first seen README.md:34 (1×)
- `ePrint 2026/517` — first seen README.md:6 (8×)
- `eprint.iacr.org/2026/1984` — first seen README.md:34 (3×)
- `eprint.iacr.org/2026/517` — first seen README.md:6 (3×)
- `EUROCRYPT 2022` — first seen README.md:143 (1×)

**README — What Can Go Wrong**:

```text
- **Reusing one public key across many sessions** — the ISD/DOOM work estimate drains by ½·log₂(D) bits; high-volume reuse can push that model below its 143‑bit reference floor.
- **BIKE reuses are worse** — its quasi-cyclic structure donates ≈ n syndromes per session (≈ n·D total), so BIKE‑1 crosses the floor far sooner (~D = 2¹¹) than HQC or McEliece.
- **No rotation schedule** — without rotating keys on a cadence tied to session volume, accumulated syndromes reduce the modeled ISD/DOOM work factor. Rotation does not mitigate structural key recovery.
- **Conflating the idealized √D model with reality** — for mceliece3488‑64 the simple √D law (~2^16.4) and the paper's full‑ISD table (2²¹) disagree, because McEliece's real ISD slope (~0.39) is shallower than the ½ the law assumes; trusting one number blindly misstates the margin.
- **Assuming all PQ KEMs degrade equally** — this effect is specific to code-based syndrome decoding; structured-lattice KEMs like ML-KEM are not hit the same way.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-syndrome-drain

## What It Is

Syndrome Drain is an educational visualizer for the result in
[May & Sá Diogo, IACR ePrint 2026/517](https://eprint.iacr.org/2026/517) —
**Multi-Instance Security Degradation of Code-Based KEMs**. Code-based KEMs rest on
**syndrome decoding**. *Decoding One Out of Many* (DOOM, Sendrier) says that
holding `M` syndromes for the same key lets you decode one of them about **√M
faster** — a saving of ½·log₂(M) bits in the modeled ISD/DOOM attack. When a single public key is reused to
derive **D** session keys, an attacker assembles many syndromes at once: **≈ n·D**
for BIKE (its quasi-cyclic ring donates `n` per session), and **≈ D** for HQC and
Classic McEliece. The modeled ISD/DOOM work factor therefore *drains* with D. For NIST
Level‑1 parameters it falls below the 143‑bit reference floor at roughly **D = 2¹¹
(BIKE‑1)**, **2²¹ (mceliece3488‑64)**, and **2³⁴ (HQC‑1)** in the source paper's full-ISD tables — so **public keys should
be rotated on a schedule tied to session volume for this attack model.** This lab **computes** an ISD/DOOM
work estimate from published NIST Level‑1 parameters and the paper's √D degradation
law — **no attack is run against those parameters**, and none could be. Alongside
that it **runs a real DOOM search at deliberately toy scale**: a random binary code
with a 20‑bit syndrome space, genuine planted weight‑6 errors, and an honest
two‑list match against M targets at once, counting every syndrome computation it
performs. The −½ slope it reports is a least‑squares fit to those measured counts,
so the ½‑bit‑per‑doubling law is something you *measure* on this page rather than
something the page asserts. Every published-parameter number on screen is real
arithmetic you can audit in
[`src/model.ts`](src/model.ts) and [`PAPER-NOTES.md`](PAPER-NOTES.md). To keep the
core vocabulary concrete rather than assumed, the page first lets you *build* a
syndrome by hand on a real **[7,4] Hamming code** (`s = H·e` over GF(2), with a
live collision showing why decoding must find the *lowest‑weight* error), then
visualizes *why* holding **M** syndromes cheapens the search by ≈ **√M** — the
ISD list‑matching tradeoff the whole result rests on. Built with Vite + TypeScript, no
backend.

**Separate structural research:** [Weis, ePrint 2026/1984 (preprint, revised September 25, 2026)](https://eprint.iacr.org/2026/1984) estimates Classic McEliece key recovery below generic ISD costs across five candidate parameter sets under stated heuristics and memory accounting. Only a toy-sized key recovery was completed; no practical production break was demonstrated. This is a different attack path that can matter even at `D = 1`: neither the chart nor key rotation addresses it. The calculator is **ISD/DOOM-only**, not an overall security verdict.

**Deployment guidance (October 1, 2026):** [BSI](https://www.bsi.bund.de/DE/Service-Navi/Presse/Alle-Meldungen-News/Meldungen/2026/Classic-McEliece_261001.html) advises against using Classic McEliece in new developments or when planning new cryptographic applications. BSI states that its recommended parameter sets are not currently subject to a practical attack. This is deployment guidance following structural cryptanalysis, not an ISO withdrawal or a change to NIST’s 2025 decision. Earlier TR-02102-1 recommendations were limited to hybrid use.

## When to Use It

- Use it to understand **multi-instance ISD/DOOM degradation** — how reusing one code-based KEM public key across many sessions lowers that attack model's work factor.
- Use it to plan **rotation against multi-instance ISD/DOOM** — the calculator turns a session rate into a cadence for this attack model, not a full security guarantee.
- Use it to see **why BIKE drains faster** than HQC or Classic McEliece (the `n·D` vs `D` syndrome-count mechanism), and why ML-KEM/Kyber is not hit the same way.
- Use it to **measure the √M discount yourself** — the toy-DOOM lab runs a real two-list syndrome search against M targets and fits the slope to its own counters, and starving its budget makes it refuse to claim a slope at all.
- Do NOT read the on-screen per-scheme numbers as overall bit-security or a break of production code-based KEMs. No attack is run against production parameters; the toy DOOM search carries no security. A structural key attack is outside this model even when `D = 1`.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-syndrome-drain](https://systemslibrarian.github.io/crypto-lab-syndrome-drain/)**

The page is layered for progressive disclosure, walking a newcomer from a concrete picture up to the operational takeaway:

1. **See it** — an interactive **ISD/DOOM erosion chart** (slider for D, preset jump buttons for each crossover, three live curves, the red floor line, both modeled and paper‑stated crossover markers, a model-specific margin meter, and a live readout table), preceded by a **TL;DR** card.
2. **What is a syndrome?** — a hands‑on primer on a real **[7,4] Hamming code**: flip error bits and watch the parity‑check matrix multiply `H·e = s` into a 3‑bit syndrome, then see **two different error patterns collide on the same syndrome** — so decoding means "find the *lowest‑weight* error," the hard problem the KEMs stand on. (All arithmetic is real coding theory in [`src/model.ts`](src/model.ts), tested.)
3. **Why √M?** — a visual for the DOOM bargain: **M target syndromes as dots**, a single "sweep" of attacker work that scores a hit whenever it overlaps *any* target, so more targets means more hits per unit work — hence ≈ **√M** less work to land one, a **−½·log₂(M)** discount. The panel ties its M back to the chart's current D. (This one panel is a drawn cartoon, and says so.)
4. **Run it yourself** — the **toy-DOOM lab**. Press *Run the sweep* and the page builds a random `n = 96`, `r = 20` code, plants real weight‑6 errors, and runs an honest two‑list search against M = 1, 2, 4, … targets, re‑verifying every recovered error against `H` before counting it solved. It plots the **measured** syndrome computations (falling as 1/√M) against the **measured** table lookups (rising as √M) and fits the slope; landing inside ±0.2 of −0.5 is reported as agreement, and anything else is reported as disagreement. *Starve it* caps the budget so searches genuinely fail — and the verdict then refuses to fit a slope at all rather than quietly reporting a number it did not earn. Step 2's primer carries a matching miniature: the same [7,4] code with M targets, scanned for real and checked against the exact expectation `129 / (16·M + 1)`.
5. **Understand it** — the **DOOM mechanism** explainer with live syndrome counts (BIKE's `n·D` vs `D`), with inline glosses for load‑bearing jargon (syndrome, parity‑check matrix, ISD, MMT, quasi‑cyclic ring).
6. **Act on it** — an **ISD/DOOM rotation calculator** with realistic traffic‑scenario presets; it cannot guarantee security against structural attacks.

Below the spine sit a **Common misconceptions** FAQ (including why ML‑KEM/Kyber isn't hit the same way), a **Parameters & sources** drill‑down where every number cites the paper plus a copy‑pasteable **"verify it yourself"** block, and an honest **Known Gaps** panel. Every model‑derived number carries an inline **"idealized √D model"** badge, and the chart plots two crossover markers per scheme (a filled dot for the model, a hollow diamond for the paper's full‑ISD table) so the model‑vs‑reality distinction is native to the UI. You can deep‑link a specific reuse count with `?d=` (log₂ of D), e.g. `…/?d=21`.

## What Can Go Wrong

- **Reusing one public key across many sessions** — the ISD/DOOM work estimate drains by ½·log₂(D) bits; high-volume reuse can push that model below its 143‑bit reference floor.
- **BIKE reuses are worse** — its quasi-cyclic structure donates ≈ n syndromes per session (≈ n·D total), so BIKE‑1 crosses the floor far sooner (~D = 2¹¹) than HQC or McEliece.
- **No rotation schedule** — without rotating keys on a cadence tied to session volume, accumulated syndromes reduce the modeled ISD/DOOM work factor. Rotation does not mitigate structural key recovery.
- **Conflating the idealized √D model with reality** — for mceliece3488‑64 the simple √D law (~2^16.4) and the paper's full‑ISD table (2²¹) disagree, because McEliece's real ISD slope (~0.39) is shallower than the ½ the law assumes; trusting one number blindly misstates the margin.
- **Assuming all PQ KEMs degrade equally** — this effect is specific to code-based syndrome decoding; structured-lattice KEMs like ML-KEM are not hit the same way.

## Real-World Usage

- **Code-based KEMs in PQC** — BIKE, HQC, and Classic McEliece are the code-based candidates from the NIST post-quantum process; HQC was selected for standardization.
- **Key-rotation policy** — the result argues directly for rotating code-based KEM public keys on a schedule tied to how many sessions each key derives.
- **Historical long-term deployment rationale** — Classic McEliece was favored for its long history of analysis; BSI’s October 1, 2026 notice now advises against choosing it for new applications. The ISD/DOOM rotation model does not override that guidance or address structural key recovery.
- **Hybrid post-quantum key exchange** — code-based KEMs are deployed alongside classical exchanges so security holds if either component survives.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-syndrome-drain
cd crypto-lab-syndrome-drain
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-mceliece-gate](https://systemslibrarian.github.io/crypto-lab-mceliece-gate/) — Classic McEliece with Goppa codes, one of the KEMs whose multi-instance margin is modeled here.
- [crypto-lab-hqc-vault](https://systemslibrarian.github.io/crypto-lab-hqc-vault/) — HQC, the Reed-Muller/Reed-Solomon code-based KEM selected by NIST.
- [crypto-lab-bike-vault](https://systemslibrarian.github.io/crypto-lab-bike-vault/) — BIKE, the QC-MDPC KEM whose quasi-cyclic structure makes its drain fastest.
- [crypto-lab-hqc-timing](https://systemslibrarian.github.io/crypto-lab-hqc-timing/) — an HQC BCH-decoder timing oracle and the case for constant-time decoding.
- [crypto-lab-hqc-timing-break](https://systemslibrarian.github.io/crypto-lab-hqc-timing-break/) — a cache-timing soft-ISD attack on HQC, another angle on code-based KEM security.

## The model (honest by construction)

`effectiveSecurityBits(D) = T₁ − ½·log₂(D)` is named for the source paper's model; it is an **ISD/DOOM-only** estimate anchored on each scheme's published
single‑instance MMT bit complexity `T₁` (the attacker's best variant, pure‑time
metric). The `n·D` vs `D` syndrome counts are shown as the *mechanism*; because
`n` is a constant it is a fixed offset already folded into `T₁`, so it is not
applied twice (doing so would break the published 2³⁴ crossover — see
[`src/model.test-notes.md`](src/model.test-notes.md)).

`crossoverD()` computes each crossover from the model **and** cross‑checks it
against the paper's full‑ISD tables. They agree for HQC and BIKE; for
**mceliece3488‑64 they differ** (modeled ≈2^16.4 vs paper 2²¹, because McEliece's
real ISD slope ≈0.39 is shallower than the ½ the law assumes). The demo shows
**both** and flags the gap rather than silently trusting one.

## Develop

`​``bash
npm test         # vitest — guards the model against regression
npm run build    # tsc --noEmit && vite build  →  dist/
npm run preview  # serve the production build
`​``

No runtime dependencies; TypeScript + Vite only. The pure computation core
([`src/model.ts`](src/model.ts)) has no DOM access and is deterministic — same
input, same output, no `Math.random`, no `Date`, no network. Its invariants
(D=1 ⇒ T₁, crossover ordering, the model‑vs‑paper agreement flags, no `n·D`
double‑counting, D<1 throws) are pinned by [`src/model.test.ts`](src/model.test.ts)
and run in CI ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

## Deploy

Pushes to `main` build and publish to **GitHub Pages** via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The Vite `base`
is `/crypto-lab-syndrome-drain/` to match the repo path.

## Accessibility & mobile

Built mobile‑first and to WCAG AA intent: semantic landmarks, a skip link,
keyboard‑operable controls with a visible focus ring, `aria-live` readouts and a
full screen‑reader text description of the chart, generous touch targets,
`prefers-reduced-motion` and `prefers-contrast` support, and tables that reflow
into cards on narrow screens. Dark is the default theme; the toggle persists to
`localStorage`.

## Sources

- Alexander May & Gabriel Sá Diogo, *Multi-Instance Security Degradation of
  Code-Based KEMs*, IACR ePrint **2026/517**.
- N. Sendrier, *Decoding One Out of Many*, PQCrypto 2011 (DOOM).
- Esser, May, Zweydinger, *McEliece needs a break*, EUROCRYPT 2022 (MMT‑DOOM).
- Official Level‑1 parameter sets: HQC‑1, BIKE‑1, mceliece3488‑64.

Transcribed values and per‑number citations live in
[`PAPER-NOTES.md`](PAPER-NOTES.md).

## Disclaimer

*Educational use. Numbers are computed from published parameters; this is
asymptotic multi-instance degradation, not a break of syndrome decoding.
Per-instance hardness is intact. No warranties — verify before relying.*

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Broken Trust

- **slug**: `crypto-lab-broken-trust`
- **repo**: https://github.com/systemslibrarian/crypto-lab-broken-trust
- **live**: https://systemslibrarian.github.io/crypto-lab-broken-trust/
- **commit_sha**: `4f8501ea88c99e590a22c3c8d1cb82dab5d6e208` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS | POST-QUANTUM  ·  **level**: advanced  ·  **--accent**: #5cc8ff
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Broken Trust  — _read from index.html_

**Subtitle**: ML-DSA (Dilithium) · Leakage-Assisted Subkey Recovery · ePrint 2026/472  — _read from index.html_

**Description**: Watch one leaked bit of per-signature masking randomness turn each signature into a scoring relation, then descend that key-free score by multi-tier hill-climbing until the true subkey emerges — no lattice reduction.  — _read from index.html_

**Why it matters**: ML-DSA's rejection sampling is supposed to make signatures leak nothing about the key. A single leaked randomness bit per signature voids that guarantee — and this needs 37–68× fewer leaks than prior work, surviving 45% noise.  — _read from index.html_

**Card copy**: Leak one bit of ML-DSA's per-signature masking randomness and the secret subkey becomes the bottom of a hill you can roll down — no lattice reduction. Watch a toy version descend beside real-scale numbers from ePrint 2026/472.

**Chips**: vs. ML-DSA · Bit Leakage · Hill-Climbing · Toy-Scale Only

**Implements**: N/A

**Attacks shown**: Brute force `src/main.ts:1462`, Fault injection `src/main.ts:1471`, Key recovery `src/paperData.ts:195`, Lattice reduction `index.html:632`, Side-channel (unspecified) `src/main.ts:1469`

**References**: Dilithium, Ed25519, Fiat-Shamir, LWE, ML-DSA, ML-KEM, RSA

**Standards body**: _none_

**Implementation**: N/A (model or attack)

**Spec citations, exactly as written**:

- `ePrint 2025/820` — first seen src/paperData.ts:202 (1×)
- `ePrint 2026/2091` — first seen README.md:95 (1×)
- `ePrint 2026/472` — first seen README.md:8 (11×)
- `eprint.iacr.org/2026/2091` — first seen README.md:95 (1×)
- `eprint.iacr.org/2026/472` — first seen README.md:14 (5×)
- `FIPS 204` — first seen README.md:16 (7×)

**README — What Can Go Wrong**:

```text
- Leaking even a single bit of the per-signature masking randomness — for example through a side channel — turns each signature into an informative relation on a secret subkey, and the rejection-sampling independence that protects ML-DSA in the clean case no longer holds.
- Because a candidate subkey can be scored using only the leaked relations (zero at the true key, no lattice reduction required), any implementation that leaks must assume the secret sits at a findable global minimum.
- The recovery tolerates substantial noise on the leaked bits (the cited paper still succeeds at ~45% noise), so an implementation that is only "mostly" constant-time or partially leaky is not safe.
- Mistaking the toy engine's qualitative dynamics for real-scale cost: the in-browser run recovers a dimension-8 key the demo generated itself, not a real ML-DSA key, and the paper's relation counts and reduction factors are the load-bearing numbers.
- [ElGhamrawy et al., ePrint 2026/2091 (September 22, 2026)](https://eprint.iacr.org/2026/2091) present a separate leakage-assisted ILWE analysis of ML-DSA signing with a noise-free signature-count estimate. It is not this lab's one-bit masking-randomness experiment, and its signature counts must not be substituted for this toy's relation count or the earlier paper's estimates. Both need leaked information; neither shows a generic break of ML-DSA from public signatures alone.
```

**Claims tested** (e2e/claims.spec.ts, 49 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:110
    - :110 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:125
    - :125 `toBe` expected `s.truth.length` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:126
    - :126 `toBe` expected `s.truth.length` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:129
    - :129 `toBe` expected `correct` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:130
    - :130 `toBe` expected `linf` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:131
    - :131 `toBe` expected `correct` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:132
    - :132 `toBe` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:135
    - :135 `toBe` expected `num(s.score)` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:136
    - :136 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:143
    - :143 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:146
    - :146 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:148
    - :148 `toBe` expected `recovered` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:151
    - :151 `toBe` expected `num(s.score) === 0` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:154
    - :154 `toBe` expected `exact` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:157
    - :157 `toBe` expected `expected` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:162
    - :162 `toBe` expected `6` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:166
    - :166 `toBe` expected `s.truth.length` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:174
    - :174 `toBe` expected `dot(s.cand)` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:175
    - :175 `toBe` expected `dot(s.truth)` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:176
    - :176 `toBe` expected `candDot >= tau ? 1 : 0` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:177
    - :177 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:181
    - :181 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:182
    - :182 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:183
    - :183 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:185
    - :185 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:186
    - :186 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:187
    - :187 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:194
    - :194 `toBe` expected `s.contrastLeak.length` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:195
    - :195 `toBe` expected `true` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:196
    - :196 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:197
    - :197 `toBe` expected `'true key'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:203
    - :203 `toMatch` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:206
    - :206 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:207
    - :207 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:210
    - :210 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:213
    - :213 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:214
    - :214 `expect` expected _no expected value_ _(none)_
- `clean descent recovers the key and every surface agrees` — e2e/claims.spec.ts:255
    - :260 `toBe` expected `'1'` _(literal)_
    - :261 `toBe` expected `'4,000'` _(literal)_
    - :262 `toBe` expected `'0%'` _(literal)_
    - :266 `toBe` expected `note.total` _(expression)_
    - :267 `toBe` expected `0` _(literal)_
    - :268 `toBe` expected `'recovered ✓'` _(literal)_
    - :274 `toBe` expected `0` _(literal)_
    - :275 `expect` expected _no expected value_ _(none)_
    - :279 `toBe` expected `3` _(literal)_
    - :280 `expect` expected _no expected value_ _(none)_
    - :281 `expect` expected _no expected value_ _(none)_
    - :282 `expect` expected _no expected value_ _(none)_
- `landscape, contrast and snippet report the same true-key score (${label})` — e2e/claims.spec.ts:294
    - :302 `toBe` expected `s.truth[0]` _(expression)_
    - :303 `toBe` expected `s.truth[1]` _(expression)_
    - :306 `toBe` expected _no expected value_ _(none)_
    - :312 `expect` expected _no expected value_ _(none)_
    - :313 `toBe` expected _no expected value_ _(none)_
    - :320 `expect` expected _no expected value_ _(none)_
    - :323 `expect` expected _no expected value_ _(none)_
    - :324 `expect` expected _no expected value_ _(none)_
    - :326 `expect` expected _no expected value_ _(none)_
    - :328 `expect` expected _no expected value_ _(none)_
    - :329 `expect` expected _no expected value_ _(none)_
- `scarce leaks stall the descent, and the page explains why` — e2e/claims.spec.ts:337
    - :340 `toBe` expected `'600'` _(literal)_
    - :343 `toBe` expected `'stalled'` _(literal)_
    - :344 `expect` expected _no expected value_ _(none)_
    - :345 `expect` expected _no expected value_ _(none)_
    - :346 `expect` expected _no expected value_ _(none)_
    - :348 `expect` expected _no expected value_ _(none)_
    - :353 `toHaveClass` expected `/incorrect/` _(regex)_
    - :354 `toContainText` expected `'actually no'` _(literal)_
    - :355 `toContainText` expected `'too few relations to pin the key'` _(literal)_
    - :358 `toHaveText` expected `'stalled', { timeout: 15_000 }` _(expression)_
- `past the noise ceiling the key is lost, and the exhibits admit it` — e2e/claims.spec.ts:364
    - :367 `toBe` expected `'45%'` _(literal)_
    - :370 `toBe` expected `'stalled'` _(literal)_
    - :371 `expect` expected _no expected value_ _(none)_
    - :372 `expect` expected _no expected value_ _(none)_
    - :382 `toHaveClass` expected `/incorrect/` _(regex)_
    - :383 `toContainText` expected `'under noise the score'` _(literal)_
    - :384 `toHaveText` expected `'stalled', { timeout: 15_000 }` _(expression)_
- `a noisy-but-successful run is never reported as stalled` — e2e/claims.spec.ts:392
    - :397 `toBe` expected `note.total` _(expression)_
    - :398 `expect` expected _no expected value_ _(none)_
    - :399 `toBe` expected `'recovered (noisy)'` _(literal)_
    - :405 `toHaveText` expected `'recovered (noisy)', { timeout: 20_000 }` _(expression)_
    - :406 `toHaveText` expected `'recovered (noisy)'` _(literal)_
    - :408 `toHaveText` expected `'✓ Key recovered'` _(literal)_
- `stepping through the trajectory is monotone non-increasing down to 0` — e2e/claims.spec.ts:414
    - :418 `expect` expected _no expected value_ _(none)_
    - :425 `toBe` expected `k` _(expression)_
    - :426 `toBe` expected `num(s.score)` _(expression)_
    - :431 `expect` expected _no expected value_ _(none)_
    - :435 `expect` expected _no expected value_ _(none)_
    - :436 `toBe` expected `0` _(literal)_
    - :437 `toBe` expected `num(settled.score)` _(expression)_
- `the relation microscope agrees with its own vectors` — e2e/claims.spec.ts:444
    - :449 `toBe` expected `false` _(expression)_
    - :454 `toBe` expected `trueDot >= tau ? 1 : 0` _(expression)_
    - :461 `toBe` expected `true` _(expression)_
    - :462 `expect` expected _no expected value_ _(none)_
    - :463 `toHaveText` expected `/relation #\d+ of 600/` _(regex)_
- `clicking a heatmap cell starts the climb there and still recovers` — e2e/claims.spec.ts:470
    - :473 `toBe` expected `'recovered ✓'` _(literal)_
    - :497 `toHaveText` expected `'recovered ✓', { timeout: 20_000 }` _(expression)_
    - :505 `toBe` expected `0` _(literal)_
    - :506 `toBe` expected `-3` _(literal)_
    - :507 `toBe` expected `-3` _(literal)_
- `trials panel is internally consistent (${label})` — e2e/claims.spec.ts:517
    - :521 `toBeVisible` expected `{ timeout: 30_000 }` _(expression)_
    - :522 `toHaveText` expected `'', { timeout: 30_000 }` _(expression)_
    - :534 `expect` expected _no expected value_ _(none)_
    - :539 `toBe` expected `Number(out.selected)` _(expression)_
    - :540 `expect` expected _no expected value_ _(none)_
    - :542 `expect` expected _no expected value_ _(none)_
    - :544 `expect` expected _no expected value_ _(none)_
    - :545 `expect` expected _no expected value_ _(none)_
    - :548 `expect` expected _no expected value_ _(none)_
    - :549 `expect` expected _no expected value_ _(none)_
    - :550 `toMatch` expected `/median ≈ \d+/` _(regex)_
    - :552 `toBe` expected `0` _(literal)_
    - :553 `expect` expected _no expected value_ _(none)_
- `paper-scale figures agree across every surface that prints them` — e2e/claims.spec.ts:562
    - :567 `toBe` expected `3` _(literal)_
    - :579 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :611 `expect` expected _no expected value_ _(none)_
    - :613 `expect` expected _no expected value_ _(none)_
    - :621 `toHaveText` expected _no expected value_ _(none)_
    - :624 `toHaveText` expected _no expected value_ _(none)_
    - :630 `toBe` expected `12` _(literal)_
    - :633 `toHaveText` expected _no expected value_ _(none)_
    - :636 `toHaveText` expected _no expected value_ _(none)_
    - :639 `toContainText` expected _no expected value_ _(none)_
    - :646 `expect` expected _no expected value_ _(none)_
    - :647 `expect` expected _no expected value_ _(none)_
- `the toy noise ceiling in the chart caption matches the overlay` — e2e/claims.spec.ts:653
    - :657 `expect` expected _no expected value_ _(none)_
    - :659 `toHaveText` expected `'≈ ${ceiling}% (this toy's own)'` _(expression)_
    - :661 `expect` expected _no expected value_ _(none)_
    - :662 `expect` expected _no expected value_ _(none)_
    - :663 `expect` expected _no expected value_ _(none)_
    - :664 `toHaveText` expected `'45%'` _(literal)_
    - :667 `toHaveText` expected `/\(this toy's own\)|> grid max/` _(regex)_
- `each teaching preset lands in a self-consistent state` — e2e/claims.spec.ts:673
    - :677 `toBe` expected `4` _(literal)_
    - :683 `toHaveText` expected `/recovered ✓|recovered \(noisy\)|stalled/, {` _(expression)_
    - :690 `toBe` expected `s.status` _(expression)_
    - :691 `toHaveClass` expected `/active/` _(regex)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-broken-trust

## What It Is

> Leak **one bit** of ML-DSA's per-signature masking randomness and the secret
> subkey becomes the **bottom of a hill you can roll down** — no lattice
> reduction. This demo lets you *watch* a toy version descend, next to the
> real-scale numbers from IACR ePrint 2026/472. It runs **no attack** on real
> ML-DSA.

An **educational reconstruction** of Carsten Schubert, Niklas Julius Müller,
Jean-Pierre Seifert, and Marian Margraf, *"Descent into Broken Trust: Uncovering
ML-DSA Subkeys with Scarce Leakage and Local Optimization"*
([IACR ePrint 2026/472](https://eprint.iacr.org/2026/472)).

The primitive is **ML-DSA / CRYSTALS-Dilithium** (FIPS 204), the primary NIST
post-quantum signature standard. ML-DSA uses **rejection sampling** so released
signatures are statistically independent of the secret key — that independence is
the defense. The attack line (Liu et al., Damm et al.) shows the defense collapses
once an attacker learns **even one bit of the per-signature masking randomness**:
each leaked bit becomes an **informative relation** on a secret subkey. The paper
then (1) builds a **verification routine** that scores a candidate subkey using
*only* those relations — zero exactly at the true key, no lattice reduction — and
(2) descends that score with a **multi-tier hill-climbing optimizer**. It recovers
subkeys from **5,000–35,000 relations** (a **37–68× reduction** over prior work)
and still succeeds at **~45% leaked-bit noise**.

This repo is a **hybrid**:

- A **live, in-browser toy engine** (`src/model.ts`) — dimension-8, integer
  coefficients — that you can actually watch descend: the violation score falling
  tier by tier to zero, with relation-count and noise sliders. It recovers a toy
  key **the demo generated itself**, purely to make the *dynamics* visible.
- A **paper-data overlay** (`src/paperData.ts`) that replays the paper's measured
  real-scale results so the toy is shown to be a faithful miniature, not a cartoon.

It is **leakage-assisted subkey recovery via local optimization** — a
**leakage + optimization** result, **not a fault-injection attack**, and **not** an
attack tool. No real ML-DSA key, no real signatures, no captured side channel. The
honesty bridge is explicit throughout: every **toy · illustrative** number is
badged distinctly from every **paper-measured** number.

> ℹ️ **Provenance.** The paper figures are transcribed from the **full text**
> (Tables 1–4) into [`src/paperData.ts`](src/paperData.ts) and pinned by tests — the
> exact per-set, per-leakage-index relation counts (Table 2 → the 5,000–35,000 band),
> the 37.0/42.8/68.5× reductions (Table 3), and the noisy-setting results (Table 4).
> The IACR PDF is Cloudflare-gated and is **not redistributed in this repo**; see
> `PAPER-NOTES.md` for the full transcription and `BUILD-NOTES.md` for the details.

### What you can explore

- **Guided tour** that walks the three-act story (Independence → Leakage → Optimization)
  and drives the demo for you — auto-offered on first visit, or `?tour=1`.
- **Live descent visualizer** — relation-count, noise, and seed sliders, play/step/reset,
  shaded tier bands, a **coefficient lock-in** animation, and an optional alternate-run overlay.
- **Interactive score-landscape heatmap** — *click a cell (or press “New start”) to start the
  climb anywhere*, hover for the exact score, with a colorblind-safe **viridis** scale + legend
  and the descent path drawn as a rolling particle.
- **Relation microscope** (one leaked relation as a concrete object) and a **no-leakage vs.
  leakage** contrast.
- **Run-N-trials** — success rate + a steps-to-recover histogram (the toy's own mirror of the
  paper's 10/10 methodology).
- **Paper-scale replay tabs** and **visualized results** — a log-scale reduction bar chart and a
  Table 2 heatmap grid — plus an **Implications & Defenses** section and an explicit
  **toy ↔ paper mapping**.
- **Deep-linkable state** with a **Copy link** button, keyboard + screen-reader
  support, colorblind-safe palettes, and `prefers-reduced-motion` support throughout.

## When to Use It

- To build intuition for **why one leaked masking bit is catastrophic** even though
  rejection sampling hides the key in the clean case.
- To *see* the core idea — **the secret sits at the global minimum of a score you
  can evaluate without the key** — as a descending curve, not just prose.
- As a teaching aid for **local optimization / hill-climbing cryptanalysis** and for
  the distinction between a demo's qualitative dynamics and a paper's quantitative
  scale.
- Do NOT treat it as a security assessment or attack tool: it assesses no real system, recovers **no** real key, and is a teaching demo, not production code.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-broken-trust](https://systemslibrarian.github.io/crypto-lab-broken-trust/)**

First-time visitors are offered a short **guided tour** (or start it anytime from the
TL;DR, or via `?tour=1`). State is deep-linkable via the query string, e.g.
`?seed=1&rels=4000&noise=0` reproduces a clean descent; raise `noise` past the toy's
ceiling to watch it stall. The **Copy link** button grabs the URL for the current state.

## What Can Go Wrong

- Leaking even a single bit of the per-signature masking randomness — for example through a side channel — turns each signature into an informative relation on a secret subkey, and the rejection-sampling independence that protects ML-DSA in the clean case no longer holds.
- Because a candidate subkey can be scored using only the leaked relations (zero at the true key, no lattice reduction required), any implementation that leaks must assume the secret sits at a findable global minimum.
- The recovery tolerates substantial noise on the leaked bits (the cited paper still succeeds at ~45% noise), so an implementation that is only "mostly" constant-time or partially leaky is not safe.
- Mistaking the toy engine's qualitative dynamics for real-scale cost: the in-browser run recovers a dimension-8 key the demo generated itself, not a real ML-DSA key, and the paper's relation counts and reduction factors are the load-bearing numbers.
- [ElGhamrawy et al., ePrint 2026/2091 (September 22, 2026)](https://eprint.iacr.org/2026/2091) present a separate leakage-assisted ILWE analysis of ML-DSA signing with a noise-free signature-count estimate. It is not this lab's one-bit masking-randomness experiment, and its signature counts must not be substituted for this toy's relation count or the earlier paper's estimates. Both need leaked information; neither shows a generic break of ML-DSA from public signatures alone.

## Real-World Usage

- ML-DSA (FIPS 204) is the primary NIST post-quantum digital signature standard, intended for code signing, firmware updates, certificates, and protocol authentication.
- It is being integrated into TLS, PKI, and software-supply-chain trust as a post-quantum replacement for (or hybrid alongside) classical signatures like Ed25519 and RSA.
- The masking-randomness side-channel concern this demo illustrates is exactly why constant-time, leakage-resistant implementations are emphasized for deployed ML-DSA and lattice signatures generally.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-broken-trust
cd crypto-lab-broken-trust
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-dilithium-seal](https://systemslibrarian.github.io/crypto-lab-dilithium-seal/) — the ML-DSA / FIPS 204 signature scheme this demo attacks, shown in normal operation.
- [crypto-lab-dilithium-reject](https://systemslibrarian.github.io/crypto-lab-dilithium-reject/) — ML-DSA rejection sampling, the very defense whose leakage this demo exploits.
- [crypto-lab-lattice-fault](https://systemslibrarian.github.io/crypto-lab-lattice-fault/) — fault injection against ML-KEM/ML-DSA, a sibling lattice-cryptanalysis demo.
- [crypto-lab-lwe-hints](https://systemslibrarian.github.io/crypto-lab-lwe-hints/) — recovering lattice secrets from partial hints, the same "scarce-leakage" theme.
- [crypto-lab-syndrome-drain](https://systemslibrarian.github.io/crypto-lab-syndrome-drain/) — another post-quantum cryptanalysis demo in the suite's attacks family.

## Build & Test

`​``bash
npm test        # run the pinned toy invariants + paper-transcription guards
npm run build   # production build into dist/
npm run preview # preview the production build
`​``

Requires Node 20+. No runtime dependencies.

## Part of the Crypto-Lab Suite

This is one of the **crypto-lab** demos — small, auditable, single-result
educational tools in a shared house style (Vite + TypeScript, a pure deterministic
`src/model.ts`, pinned tests, progressive-disclosure UI, dark default, honesty
badges). It is a sibling of `crypto-lab-lwe-hints`, `crypto-lab-syndrome-drain`,
and others in the suite.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Timing Side-Channel

- **slug**: `crypto-lab-timing-sidechannel`
- **repo**: https://github.com/systemslibrarian/crypto-lab-timing-sidechannel
- **live**: https://systemslibrarian.github.io/crypto-lab-timing-sidechannel/
- **commit_sha**: `f65f2fccb0271bc6c0f08ec2e9ba612d42460e82` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: advanced  ·  **--accent**: #b45309
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Timing Side-Channel  — _read from src/ui.ts_

**Subtitle**: Side-Channel Attack · Constant-Time Comparison  — _read from src/ui.ts_

**Description**: Recover a hidden secret one byte at a time from an early-exit comparison using live performance.now()  — _read from src/ui.ts_

**Why it matters**: Non-constant-time comparison of secrets, MACs, and tokens has broken real production systems. Execution time alone can leak a secret with no crash, error, or access to it — which is why constant-time equality is a security requirement, not an optimization.  — _read from src/ui.ts_

**Card copy**: Recover a hidden secret one byte at a time from an early-exit comparison, then watch a constant-time compare flatten the leak. Real performance.now() measurements. No backend.

**Chips**: Timing Attack · Constant-Time · Side-Channel · Secret Compare

**Implements**: N/A

**Attacks shown**: Brute force `src/ui.ts:216`, Fault injection `src/timing/attack.ts:39`, Padding oracle `src/ui.ts:338`, Side-channel (unspecified) `src/ui.ts:119`, Timing side-channel `src/ui.ts:119`

**References**: AES, Diffie-Hellman, HMAC, HQC, RSA

**Standards body**: _none_

**Implementation**: N/A (model or attack)

**Spec citations, exactly as written**:

- `FIPS 203` — first seen README.md:88 (1×)

**Stated limitations (page)**:

- _(caveat, src/ui.ts)_ Honesty note. The “constant-time” comparator here is the correct source-level pattern, not an engine-level guarantee — a JS JIT can still leak. Browser timers are deliberately coarsened post-Spectre, so the live channel is noisier than native code; the idealised channel shows the same leak without that noise. The per-byte cost is amplified by real repeated work so the genuine early-exit effect clears timer granularity — it is amplified, never faked.

**Claims tested** (e2e/claims.spec.ts, 18 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:41
    - :41 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:42
    - :42 `toBeEnabled` expected `{ timeout }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:61
    - :61 `toBeVisible` expected _no expected value_ _(none)_
- `the page starts with nothing revealed and nothing recovered` — e2e/claims.spec.ts:66
    - :67 `expect` expected _no expected value_ _(none)_
    - :68 `expect` expected _no expected value_ _(none)_
    - :69 `toHaveCount` expected `SECRET_LENGTH` _(expression)_
    - :70 `toHaveCount` expected `0` _(literal)_
    - :71 `toContainText` expected `'A ${SECRET_LENGTH}-character secret is loaded and hidden'` _(expression)_
    - :72 `toHaveAttribute` expected `'aria-valuenow', '0'` _(expression)_
- `measuring both implementations reports the matching prefix it actually has` — e2e/claims.spec.ts:75
    - :79 `expect` expected _no expected value_ _(none)_
    - :85 `toBe` expected `5` _(literal)_
    - :86 `toBe` expected `SWEEP_SECRET.length` _(expression)_
    - :94 `toBe` expected `true` _(expression)_
    - :95 `toBe` expected `true` _(expression)_
    - :102 `toHaveClass` expected `/verdict--leak/` _(regex)_
    - :103 `expect` expected _no expected value_ _(none)_
    - :105 `toHaveClass` expected `/verdict--inconclusive/` _(regex)_
    - :106 `expect` expected _no expected value_ _(none)_
- `editing the guess to match in full is reported as a full-width prefix` — e2e/claims.spec.ts:110
    - :113 `toContainText` expected _no expected value_ _(none)_
- `a guess that matches nothing is reported as a zero-length prefix` — e2e/claims.spec.ts:118
    - :121 `toContainText` expected `'Matching prefix: 0/${SWEEP_SECRET.length} chars'` _(expression)_
- `the sweep’s timer-free "bytes examined" column is exactly the early-exit control flow` — e2e/claims.spec.ts:124
    - :126 `expect` expected _no expected value_ _(none)_
    - :130 `toHaveLength` expected `SWEEP_SECRET.length + 1` _(expression)_
    - :133 `toBe` expected `matched` _(expression)_
    - :138 `toBe` expected `expected` _(expression)_
    - :144 `expect` expected _no expected value_ _(none)_
    - :146 `toBe` expected `examined[examined.length - 2]` _(expression)_
- `the sweep summary quotes the same endpoints its own table holds` — e2e/claims.spec.ts:149
    - :151 `expect` expected _no expected value_ _(none)_
    - :161 `expect` expected _no expected value_ _(none)_
    - :163 `toBeCloseTo` expected `first, 4` _(expression)_
    - :164 `toBeCloseTo` expected `last, 4` _(expression)_
    - :165 `toBe` expected `SWEEP_SECRET.length` _(expression)_
    - :167 `toBeCloseTo` expected `last - first, 3` _(expression)_
- `against the vulnerable comparator the idealised channel recovers the whole secret` — e2e/claims.spec.ts:172
    - :178 `toHaveLength` expected `SECRET_LENGTH` _(expression)_
    - :179 `toBe` expected `actual` _(expression)_
    - :182 `toBe` expected `SECRET_LENGTH` _(expression)_
    - :183 `toHaveCount` expected `SECRET_LENGTH` _(expression)_
    - :184 `toHaveCount` expected `0` _(literal)_
    - :187 `toHaveClass` expected `/verdict--leak/` _(regex)_
    - :188 `toContainText` expected `'Secret fully recovered'` _(literal)_
    - :189 `toContainText` expected `'All ${SECRET_LENGTH} characters were extracted'` _(expression)_
    - :190 `toContainText` expected `'idealised operation-count channel'` _(literal)_
    - :194 `toBe` expected `recovered` _(expression)_
    - :195 `toHaveAttribute` expected `'aria-valuenow', '100'` _(expression)_
- `the final character is recovered too — the trailing-sentinel claim the README makes` — e2e/claims.spec.ts:198
    - :204 `toBe` expected `actual[SECRET_LENGTH - 1]` _(expression)_
    - :205 `toContainText` expected `'known trailing delimiter'` _(literal)_
- `the per-position table spells out the same secret the verdict claims` — e2e/claims.spec.ts:208
    - :214 `toHaveLength` expected `SECRET_LENGTH` _(expression)_
    - :217 `toEqual` expected `[...Array(SECRET_LENGTH)].map((_, i) => i + 1)` _(expression)_
    - :218 `toBe` expected `recovered` _(expression)_
    - :224 `expect` expected _no expected value_ _(none)_
    - :227 `toBe` expected `measurements[measurements.length - 1]` _(expression)_
- `against the constant-time comparator the same attack fails, and says the defense held` — e2e/claims.spec.ts:230
    - :238 `toBe` expected `actual` _(expression)_
    - :239 `expect` expected _no expected value_ _(none)_
    - :243 `toHaveCount` expected `score` _(expression)_
    - :244 `toHaveCount` expected `SECRET_LENGTH - score` _(expression)_
    - :247 `toBe` expected `score` _(expression)_
    - :250 `toHaveClass` expected `/verdict--inconclusive/` _(regex)_
    - :251 `toContainText` expected `'No full recovery observed — insufficient evidence'` _(literal)_
    - :252 `toContainText` expected `'${score}/${SECRET_LENGTH} characters match in this run'` _(expression)_
    - :253 `toContainText` expected `'ideal constant-work model assigns equal counted cost'` _(literal)_
    - :257 `toBeVisible` expected _no expected value_ _(none)_
- `the live verdict reports recovery or insufficient evidence` — e2e/claims.spec.ts:260
    - :268 `toHaveCount` expected `score` _(expression)_
    - :274 `toHaveClass` expected `/verdict--leak/` _(regex)_
    - :275 `toBe` expected `actual` _(expression)_
    - :276 `toContainText` expected `'Secret fully recovered'` _(literal)_
    - :277 `toContainText` expected `'live performance.now() timing alone'` _(literal)_
    - :279 `toHaveClass` expected `/verdict--inconclusive/` _(regex)_
    - :280 `toContainText` expected `'${score}/${SECRET_LENGTH} characters match in this run'` _(expression)_
    - :281 `toContainText` expected `'does not establish measured leakage'` _(literal)_
- `the four-mode board wins only where the implementation leaks` — e2e/claims.spec.ts:287
    - :296 `toBeVisible` expected `{ timeout: 30_000 }` _(expression)_
    - :297 `toHaveCount` expected `4` _(literal)_
    - :298 `toHaveCount` expected `0, { timeout: 240_000 }` _(expression)_
    - :301 `toEqual` expected `[` _(expression)_
    - :310 `toHaveLength` expected `SECRET_LENGTH` _(expression)_
    - :314 `toBe` expected `matches` _(expression)_
    - :319 `expect` expected _no expected value_ _(none)_
    - :320 `toBe` expected `actual` _(expression)_
    - :321 `expect` expected _no expected value_ _(none)_
    - :323 `expect` expected _no expected value_ _(none)_
    - :324 `toBe` expected `actual` _(expression)_
    - :325 `expect` expected _no expected value_ _(none)_
    - :328 `expect` expected _no expected value_ _(none)_
- `New secret clears every result and installs a genuinely different secret` — e2e/claims.spec.ts:333
    - :339 `expect` expected _no expected value_ _(none)_
    - :340 `expect` expected _no expected value_ _(none)_
    - :341 `expect` expected _no expected value_ _(none)_
    - :342 `expect` expected _no expected value_ _(none)_
    - :343 `toHaveCount` expected `0` _(literal)_
    - :344 `toHaveAttribute` expected `'aria-valuenow', '0'` _(expression)_
    - :348 `toHaveLength` expected `SECRET_LENGTH` _(expression)_
    - :349 `toBe` expected `first` _(expression)_
    - :351 `toBe` expected `SECRET_LENGTH` _(expression)_
- `switching target or channel discards the previous verdict instead of leaving it stale` — e2e/claims.spec.ts:354
    - :357 `toContainText` expected `'Secret fully recovered'` _(literal)_
    - :360 `expect` expected _no expected value_ _(none)_
    - :361 `expect` expected _no expected value_ _(none)_
    - :362 `toHaveCount` expected `0` _(literal)_
- `the honesty caveats the README leans on are on the page, not only in the docs` — e2e/claims.spec.ts:367
    - :368 `toContainText` expected `'no access to the secret'` _(literal)_
    - :369 `toContainText` expected `'trailing delimiter'` _(literal)_
    - :370 `toContainText` expected `'amplified, never faked'` _(literal)_
    - :371 `toHaveCount` expected `1` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-timing-sidechannel

## What It Is

`crypto-lab-timing-sidechannel` is a browser demo of a timing side-channel attack
against a non-constant-time secret comparison. It pairs a **vulnerable** comparison
that returns on the first mismatched byte with a **constant-time** comparison that
always examines the full width, and then lets you act as the attacker: a random
secret is generated in memory, hidden from the attack code, and recovered one
character at a time using nothing but measured execution time. The cryptographic
subject is constant-time comparison itself — the building block used to verify MACs,
password hashes, and tokens — under a side-channel threat model where the attacker
observes timing rather than output. It is an educational demonstration, not a
production library.

## When to Use It

- Use it to teach *why* constant-time comparison is mandatory for secrets, because it
  turns an abstract warning into a secret you watch get extracted from timing alone.
- Use it in secure-coding workshops alongside `crypto-lab-timing-oracle`, because this
  lab goes deep on the attacker's statistical recovery while that one tours where
  leaks live across several primitives.
- Use it to motivate code review rules against `==`/`memcmp` on secrets, because the
  early-exit pattern it attacks is exactly the one those rules forbid.
- Do NOT use it as a constant-time library, because the "constant-time" comparator
  here is the correct source-level pattern, not an engine-level guarantee in a JS JIT.
- Do NOT read a noisy "partial recovery" run as proof of safety, because the same leak
  recovers in full with more measurements or a precise timer.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-timing-sidechannel](https://systemslibrarian.github.io/crypto-lab-timing-sidechannel/)**

Generate a fresh hidden secret, choose the target (vulnerable or constant-time) and
the timing channel (live `performance.now()` or an idealised noise-free operation
count), then launch the attack and watch each character resolve in an animated bar
chart as the recovered string fills in — with a per-position "why this character won"
explanation. Section 2 lets you measure both implementations against your own demo
secret and guess, and sweep every matching-prefix length to plot the rising
vulnerable curve against the flat constant-time line. A one-click "run all four
modes" board proves the same secret is recovered only when the implementation leaks,
and that the idealised channel matches the live one in shape. Controls include the
target implementation, the timing channel, the number of measurements per byte, and a
"New secret" button. There is no encrypt/decrypt — the demo is about how a comparison
leaks, not about a cipher.

## Key lifecycle walkthrough

After “Why constant-time is hard,” a four-stage prediction/reveal exercise follows private-key decoding/import, the primitive, encoding/export, and error handling. It distinguishes repeated observations of the same fixed encoded length from disclosure of additional secret bits.

Source: Billy Bob Brumley, [SoK: The Constant Time Model](https://www.usenix.org/conference/woot26/presentation/brumley), WOOT 2026 (August). The paper’s key-loading result motivates the boundary; the walkthrough is conceptual, not an implementation of its attack or evidence of key recovery or a browser vulnerability.

## How the Demo Is Constructed

Two choices shape what "recovered from timing alone" means here, and the page states
both:

- **Per-byte work is amplified, not faked.** Each comparator runs a small real mixing
  loop per byte examined, so examining one byte costs enough to clear a post-Spectre
  browser timer when looped. The leak comes entirely from *how many* bytes each
  comparator examines; the amplification only lifts that difference above the clock's
  resolution. The sweep table's "bytes examined" column is derived from the control
  flow with no timer at all, so you can check the timed curve against the noise-free
  count.
- **A trailing delimiter makes the last byte leak.** A bare early-exit compare does not
  leak its final character — right or wrong, it stops at the full width. The oracle
  appends a fixed sentinel to the secret and to every guess, the way real framed and
  length-prefixed formats do, so the correct final character has one more matching byte
  to extend into. Without it the attack recovers all but the last character.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-timing-sidechannel
cd crypto-lab-timing-sidechannel
npm install
npm run dev
`​``

There are no environment variables. `npm test` runs the Vitest suite (comparison
primitives, the recovery engine against deterministic oracles, statistics, and a
happy-dom + axe UI integration test); `npm run build` type-checks and produces `dist/`.

## Part of the Crypto-Lab Suite

> One of 170+ live browser demos at
> [systemslibrarian.github.io/crypto-lab](https://systemslibrarian.github.io/crypto-lab/)
> — spanning Atbash (600 BCE) through NIST FIPS 203/204/205 (2024).

---

*"Whether you eat or drink, or whatever you do, do all to the glory of God." — 1 Corinthians 10:31*

## Publishing

`npm run deploy` requests the existing `deploy.yml` workflow for the current remote `main`. That workflow runs this lab's verification gates before publishing its Pages artifact. A successful request means the run was queued; check the workflow and public site separately to confirm publication. GitHub CLI authentication and workflow-dispatch access are required. Local `dist` files are not uploaded by this command.

```

</details>

---

## Time Trust

- **slug**: `crypto-lab-time-trust`
- **repo**: https://github.com/systemslibrarian/crypto-lab-time-trust
- **live**: https://systemslibrarian.github.io/crypto-lab-time-trust/
- **commit_sha**: `1b568a02743579d4e5b7b5e99ddeb7e29023ffc8` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS | PROTOCOLS  ·  **level**: beginner  ·  **--accent**: #0891b2
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Time Trust  — _read from index.html_

**Subtitle**: Clock-dependent security · RFC 5280 · RFC 7519 · RFC 6238  — _read from index.html_

**Description**: One clock slider drives real signature and MAC verification across six panels, so you can watch a mathematically valid result attached to a wrong security decision — because the clock lied.  — _read from index.html_

**Why it matters**: Certificates, tokens, and one-time codes all silently trust the clock — an input no signature can authenticate. An attacker who controls time (NTP spoofing, a hypervisor, a root shell) turns "expired" back into "valid" without breaking any cryptography at all.  — _read from index.html_

**Card copy**: Real Ed25519, HMAC, and X.509 verification driven by one movable clock — drag NOW and watch certificates, JWTs, TOTP codes, and replay caches change their verdicts about bytes that never change.

**Chips**: Ed25519 · X.509 · JWT · TOTP

**Implements**: Ed25519 `src/crypto/ed25519.ts:7`, HMAC `src/crypto/hmac.ts:10`, HOTP `src/otp/hotp.ts:28`, TOTP `src/otp/totp.ts:14`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Kerberos `src/replay/replay.ts:2`, SHA-1 `src/ui/totpPanel.ts:4`, SHA-256 `src/jwt/jwt.ts:2`

**References**: Kerberos, SHA-1, SHA-256, SHA-512

**Standards body**: IETF

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 2104` — first seen README.md:20 (2×)
- `RFC 2202` — first seen README.md:83 (1×)
- `RFC 4120` — first seen README.md:35 (7×)
- `RFC 4226` — first seen README.md:21 (7×)
- `RFC 4231` — first seen README.md:82 (3×)
- `RFC 4648` — first seen src/core/bytes.ts:38 (1×)
- `RFC 5280` — first seen README.md:3 (9×)
- `RFC 6238` — first seen README.md:3 (19×)
- `RFC 7515` — first seen README.md:86 (2×)
- `RFC 7519` — first seen README.md:3 (12×)
- `RFC 8032` — first seen README.md:19 (4×)

**Stated limitations (page)**:

- _(scope-note, index.html)_ Not production crypto — a teaching demo. Keys and secrets are generated fresh in your browser each visit and never leave it. What this does not prove: that any specific real system is vulnerable, or that better cryptography would fix it — the whole point is that it wouldn't.
- _(scope-note, index.html)_ What this isn't: full path validation. There is exactly one self-signed certificate and only its validity dates are checked — chain building, name constraints, and revocation are the job of the sibling Chain of Trust demo.
- _(scope-note, index.html)_ This demo is not an NTP or Roughtime implementation — those are named and linked, not built. The takeaway is diagnostic: better timekeeping narrows the honest-drift failures and hardens against network spoofing, but the moment time becomes attacker-chosen, the failure is architectural, not cryptographic.

**README — What Can Go Wrong**:

```text
These are the failures the lab *demonstrates*, each against the real primitive:

- **Rolled-back clock resurrects expired credentials.** An attacker who sets the verifier's clock (NTP spoofing, hypervisor control, a root shell) turns "expired" into "valid" — the MAC/signature never stopped being valid, so nothing flags it.
- **Skew splits a distributed system's mind.** The same token is accepted and rejected simultaneously by machines that disagree about the time; a "revoke in 5 minutes" happens at different real moments on every node.
- **Widening the skew tolerance widens the replay window.** The band that absorbs clock drift is the same band an intercepted code or request can be replayed within.
- **Per-server replay caches don't compose.** A request one server has already seen replays cleanly through another that never saw it and whose clock still calls it fresh.

**Precision note (what is and isn't claimed).** The consequences above are about **bypassing time-based acceptance** — using still-valid authenticators outside their intended window. This lab does **not** show, and time manipulation does not grant: recovery of any signing key, recovery of the HMAC/TOTP secret, or forging a signature over new content. Attacking the *math* (the "flip a bit" toggle) is caught instantly; the clock attacks are dangerous precisely because they require no such forgery.
```

**Claims tested** (e2e/claims.spec.ts, 26 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:25
    - :25 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:31
    - :31 `toHaveText` expected `''` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:32
    - :32 `toContainText` expected `'accept band'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:33
    - :33 `toContainText` expected `'Verdict:'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:34
    - :34 `toContainText` expected `'Verdict:'` _(literal)_
- `the clock readout, the slider and every panel agree about "now"` — e2e/claims.spec.ts:73
    - :85 `toBe` expected `nowMs` _(expression)_
    - :90 `toBe` expected `nowMs` _(expression)_
    - :92 `toBe` expected `nowMs` _(expression)_
- `certificate verdict follows the page-computed clock/notAfter comparison` — e2e/claims.spec.ts:98
    - :105 `expect` expected _no expected value_ _(none)_
    - :118 `expect` expected _no expected value_ _(none)_
    - :119 `toBe` expected `expected` _(expression)_
    - :121 `expect` expected _no expected value_ _(none)_
    - :123 `toMatch` expected `nowMs < notBefore ? /NOT YET VALID/ : /EXPIRED/` _(expression)_
    - :125 `expect` expected _no expected value_ _(none)_
- `parse and signature stages are byte-identical across clock positions; only the date compare moves` — e2e/claims.spec.ts:130
    - :140 `toBe` expected `p0` _(expression)_
    - :141 `toBe` expected `s0` _(expression)_
    - :142 `toBe` expected `d0` _(expression)_
    - :143 `expect` expected _no expected value_ _(none)_
    - :144 `expect` expected _no expected value_ _(none)_
- `flipping one signature bit fails the signature check and names it as the cause` — e2e/claims.spec.ts:147
    - :154 `toContainText` expected `'INVALID'` _(literal)_
    - :155 `toBe` expected `'REJECT'` _(literal)_
    - :157 `toContainText` expected `'Ed25519 signature'` _(literal)_
    - :159 `expect` expected _no expected value_ _(none)_
    - :160 `toContainText` expected `'tampered (1 bit flipped)'` _(literal)_
    - :164 `toContainText` expected `'INVALID'` _(literal)_
- `the verification counter never counts tampered runs as VALID ones` — e2e/claims.spec.ts:167
    - :175 `expect` expected _no expected value_ _(none)_
    - :176 `expect` expected _no expected value_ _(none)_
    - :178 `expect` expected _no expected value_ _(none)_
    - :184 `toContainText` expected `'tampered'` _(literal)_
    - :190 `toBe` expected `before + 1` _(expression)_
- `JWT split-brain: the headline and the two server cards report the same run` — e2e/claims.spec.ts:195
    - :200 `toContainText` expected `'SPLIT-BRAIN'` _(literal)_
    - :208 `toBe` expected `rsV` _(expression)_
    - :212 `expect` expected _no expected value_ _(none)_
    - :213 `toBe` expected `authV` _(expression)_
    - :214 `toBe` expected `rsV` _(expression)_
    - :217 `expect` expected _no expected value_ _(none)_
    - :218 `expect` expected _no expected value_ _(none)_
    - :222 `toMatch` expected `/skewed clock says (ACCEPT|REJECT)/` _(regex)_
    - :227 `toBe` expected `90` _(literal)_
- `JWT: the exp check names itself when it fails, and leeway closes the split` — e2e/claims.spec.ts:230
    - :235 `toContainText` expected `'SPLIT-BRAIN'` _(literal)_
    - :241 `toContainText` expected `'exp (RFC 7519 §4.1.4)'` _(literal)_
    - :242 `toContainText` expected `'FAIL'` _(literal)_
    - :247 `toContainText` expected `'Both servers agree'` _(literal)_
    - :250 `toBe` expected `agreed` _(expression)_
    - :251 `toBe` expected `agreed` _(expression)_
- `JWT: the split-brain control disables at zero skew and comes back` — e2e/claims.spec.ts:254
    - :258 `toBeEnabled` expected _no expected value_ _(none)_
    - :260 `toBeDisabled` expected _no expected value_ _(none)_
    - :261 `toContainText` expected `'with equal clocks the servers can never disagree'` _(literal)_
    - :263 `toBeEnabled` expected _no expected value_ _(none)_
- `TOTP acceptance band: the strip and the band summary count the same windows` — e2e/claims.spec.ts:268
    - :275 `expect` expected _no expected value_ _(none)_
    - :281 `toBe` expected `windows` _(expression)_
    - :282 `toBe` expected `2 * Number(tol) + 1` _(expression)_
    - :283 `toBe` expected `windows * 30` _(expression)_
    - :284 `toHaveClass` expected `/in-band/` _(regex)_
- `TOTP: a wrong code fails and says why` — e2e/claims.spec.ts:288
    - :294 `toContainText` expected `'no HOTP match in the checked band'` _(literal)_
    - :295 `toBe` expected `'REJECT'` _(literal)_
- `TOTP: with the RFC 6238 §5.2 used-code record ON, the replay is caught and named` — e2e/claims.spec.ts:298
    - :301 `toBeChecked` expected _no expected value_ _(none)_
    - :304 `toContainText` expected `'First use of this code inside the band'` _(literal)_
    - :307 `toContainText` expected `'Replay caught'` _(literal)_
    - :308 `toContainText` expected `'one-time-use record: ALREADY USED'` _(literal)_
    - :309 `toBe` expected `'REJECT'` _(literal)_
    - :311 `toContainText` expected `'HOTP match'` _(literal)_
- `TOTP: with the used-code record OFF, a real HMAC match lets the replay through and the page calls it WRONG` — e2e/claims.spec.ts:314
    - :320 `toContainText` expected `'HOTP match'` _(literal)_
    - :323 `toContainText` expected `'this exact code was already used once'` _(literal)_
    - :324 `toContainText` expected `'RFC 6238 §5.2'` _(literal)_
    - :325 `toBe` expected `'ACCEPT'` _(literal)_
    - :326 `toBeVisible` expected _no expected value_ _(none)_
- `a TOTP verdict does not outlive the verifier state it was computed from` — e2e/claims.spec.ts:329
    - :337 `toContainText` expected `'First use of this code inside the band'` _(literal)_
    - :344 `toBeVisible` expected _no expected value_ _(none)_
    - :346 `expect` expected _no expected value_ _(none)_
    - :347 `expect` expected _no expected value_ _(none)_
    - :348 `toContainText` expected `'T=${counter};'` _(expression)_
    - :353 `toContainText` expected `'Verdict:'` _(literal)_
    - :355 `toBeVisible` expected _no expected value_ _(none)_
- `signed URL: the client clock changes nothing, the server clock resurrects the dead link` — e2e/claims.spec.ts:360
    - :366 `toContainText` expected `'Verdict: REJECT'` _(literal)_
    - :369 `toContainText` expected `'not expired (server clock)'` _(literal)_
    - :373 `toContainText` expected `'still fresh'` _(literal)_
    - :374 `toBe` expected `expiredBlock` _(expression)_
    - :378 `toContainText` expected `'Verdict: ACCEPT'` _(literal)_
    - :379 `toContainText` expected `'Rolling the SERVER clock back resurrected it'` _(literal)_
    - :380 `toContainText` expected `'HMAC-SHA-256 over method + path + expires: VALID'` _(literal)_
    - :386 `expect` expected _no expected value_ _(none)_
    - :387 `expect` expected _no expected value_ _(none)_
    - :390 `expect` expected _no expected value_ _(none)_
    - :391 `expect` expected _no expected value_ _(none)_
- `replay across skewed clocks: three servers, three distinct reasons, status line agreeing with each` — e2e/claims.spec.ts:396
    - :400 `toContainText` expected `'T+4m'` _(literal)_
    - :406 `toContainText` expected `'Replay to server ${name}:'` _(expression)_
    - :411 `expect` expected _no expected value_ _(none)_
    - :415 `toBe` expected `'ACCEPT'` _(literal)_
    - :416 `expect` expected _no expected value_ _(none)_
    - :417 `toMatch` expected `/WRONG — this is a replay, \d+ s after the original/` _(regex)_
    - :420 `toBe` expected `'REJECT'` _(literal)_
    - :421 `expect` expected _no expected value_ _(none)_
    - :422 `expect` expected _no expected value_ _(none)_
    - :425 `toBe` expected `'REJECT'` _(literal)_
    - :426 `expect` expected _no expected value_ _(none)_
    - :430 `expect` expected _no expected value_ _(none)_
- `a server never reports an authenticator unseen while showing it in its own cache` — e2e/claims.spec.ts:434
    - :438 `toContainText` expected `'replay cache: 1 entr'` _(literal)_
    - :445 `toContainText` expected `'Verdict: REJECT'` _(literal)_
    - :447 `toMatch` expected `/replay cache: 1 entr/` _(regex)_
    - :448 `expect` expected _no expected value_ _(none)_
    - :449 `expect` expected _no expected value_ _(none)_
    - :452 `expect` expected _no expected value_ _(none)_
- `nodes: the verification counter matches the rows it summarises` — e2e/claims.spec.ts:457
    - :462 `toHaveCount` expected `3` _(literal)_
    - :473 `toBe` expected `before + 1 + (await rows.count())` _(expression)_
    - :475 `toBe` expected `after + 1 + (await rows.count())` _(expression)_
    - :479 `toHaveLength` expected `3` _(literal)_
    - :480 `toBe` expected `true` _(expression)_
    - :481 `toContainText` expected `'every single one VALID'` _(literal)_
    - :482 `toContainText` expected `'unexpected'` _(literal)_
- `nodes: each row verdict follows the local clock vs exp the row itself printed` — e2e/claims.spec.ts:485
    - :502 `toBe` expected `expected` _(expression)_
    - :505 `expect` expected _no expected value_ _(none)_
    - :507 `expect` expected _no expected value_ _(none)_
    - :510 `toContainText` expected `'token now disagrees across nodes'` _(literal)_
    - :513 `toBe` expected `3` _(literal)_
    - :514 `toBe` expected `verdicts.filter((v) => v === 'ACCEPT').length` _(expression)_
- `the guided tour advances and exits without leaving controls dead` — e2e/claims.spec.ts:519
    - :523 `toBeHidden` expected _no expected value_ _(none)_
    - :526 `toBeVisible` expected _no expected value_ _(none)_
    - :527 `toContainText` expected `'TOUR — STEP 1 OF 4'` _(literal)_
    - :530 `toContainText` expected `'TOUR — STEP 2 OF 4'` _(literal)_
    - :532 `toBeHidden` expected _no expected value_ _(none)_
    - :536 `toContainText` expected `'T+0s'` _(literal)_
    - :538 `toContainText` expected `'TOUR — STEP 1 OF 4'` _(literal)_
- `crossing a threshold is announced on the event rail` — e2e/claims.spec.ts:541
    - :545 `toContainText` expected `'crossed into "expired"'` _(literal)_
    - :547 `toContainText` expected `'crossed into "valid"'` _(literal)_
- `nothing carrying the hidden attribute is still painted` — e2e/claims.spec.ts:550
    - :558 `toEqual` expected `[]` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Time Trust

**Clock-dependent security · RFC 5280 · RFC 7519 · RFC 6238**

Real signature and MAC verification driven by a single movable clock, showing which security decisions silently depend on an input that cryptography cannot authenticate.

🔗 **Live demo:** https://systemslibrarian.github.io/crypto-lab-time-trust/

---

## What It Is

Every verification in this demo is mathematically correct. The certificate signature is valid, the JWT's HMAC checks, the TOTP code is a genuine RFC 6238 code — and the security decision can still be **wrong**, because the clock lied. The one idea this lab exists to teach:

> **Time is an unauthenticated input to authenticated systems.** A signature proves *who* signed a message and that it wasn't altered. It cannot prove what *"now"* is. Every check that compares a signed timestamp to a local clock inherits the trustworthiness of that clock — and the clock is not signed.

The primitives are real, run in your browser, and are validated against RFC known-answer tests:

- **Ed25519** (RFC 8032) via [`@noble/curves`](https://github.com/paulmillr/noble-curves) — certificate and distributed-token signatures.
- **HMAC-SHA-256/-SHA-1** (RFC 2104) via WebCrypto `SubtleCrypto` — JWT, signed URLs, replay authenticators, TOTP.
- **HOTP / TOTP** (RFC 4226 / RFC 6238) — hand-rolled dynamic truncation on top of real HMAC, because the truncation step is part of what the lab shows.
- **X.509 + DER** (RFC 5280 / X.690) — a hand-encoded, really-signed, strictly-parsed certificate so you can see the validity dates living *inside* the signed bytes.

**Security model.** There is no backend. All keys and secrets are generated fresh per page load, live only in memory, and never leave the browser. "Server clocks," "nodes," and "the network" are simulated — they are numbers you set. The cryptography is not simulated.

**Not production crypto — a teaching demo.** The point is deliberately narrow and deliberately uncomfortable: better cryptography does not fix any of the failures shown here, because none of them is a cryptographic failure.

## Exhibits

1. **The master clock.** One slider (plus step buttons and named "jump to" moments) is the entire control surface. A timeline shows the fixed validity windows and a movable NOW cursor; nothing cryptographic reacts to the drag — only *decisions* do.
2. **Certificate validity (RFC 5280 §4.1.2.5).** A real X.509 cert, verified step-by-step. Parsing and the Ed25519 signature check produce identical output at every clock position; only the final date comparison changes. Includes a "flip one signature bit" toggle so you can contrast attacking the math (caught instantly) with attacking the clock (never caught).
3. **JWT split-brain (RFC 7519 §4.1, HS256).** One token, two verifiers 90 seconds apart — simultaneously valid at the auth server and expired at the resource server. A leeway control shows the standard skew band-aid and exactly what it costs.
4. **TOTP acceptance window (RFC 6238).** A real code and a verifier whose ±W tolerance band you widen — watching the replay window open with it. Intercept a code and replay it: with the RFC 6238 §5.2 used-code record on, it's caught; off, a real HMAC match lets the replay through.
5. **Signed URL — whose clock? (HMAC expiry).** Roll the *client* clock back on an expired URL: nothing. Roll the *server* clock back: the dead URL works again, with no forgery. The verifier has no client-clock parameter, and that absence is the lesson.
6. **Replay cache across skewed clocks (RFC 4120 §3.2.3).** "Reject anything older than 5 minutes" on three servers with disagreeing clocks and per-server caches. A replay slips through the server whose slow clock still calls it fresh.
7. **Distributed nodes, one token (Ed25519).** One signed token, three independent node clocks. The accept/reject matrix shifts as you drag skews, while a counter proves the signature was verified valid every single time.
8. **Closing frame.** Which failures does NTP fix, which does Roughtime address, and which are unfixable by better timekeeping (the attacker who owns the clock source)?

## When to Use It

- **Use it** to build intuition for why "the signature is valid" and "accept this request" are different statements, and to explain time-skew incidents (expired-cert outages, replay windows, JWT clock-skew bugs) to newcomers.
- **Do NOT use it** as a cryptographic library, a certificate/JWT validator, or an NTP/Roughtime implementation. The DER and X.509 code implements only the minimal profile the demo needs and is not a general-purpose parser.

## Live Demo

At https://systemslibrarian.github.io/crypto-lab-time-trust/ you can drag one clock and watch six real verifiers change their decisions about bytes that never change; force a JWT split-brain; widen a TOTP band until a replay fits; resurrect an expired signed URL by rolling a server clock back; and replay a captured request through the one server whose clock still trusts it.

## What Can Go Wrong

These are the failures the lab *demonstrates*, each against the real primitive:

- **Rolled-back clock resurrects expired credentials.** An attacker who sets the verifier's clock (NTP spoofing, hypervisor control, a root shell) turns "expired" into "valid" — the MAC/signature never stopped being valid, so nothing flags it.
- **Skew splits a distributed system's mind.** The same token is accepted and rejected simultaneously by machines that disagree about the time; a "revoke in 5 minutes" happens at different real moments on every node.
- **Widening the skew tolerance widens the replay window.** The band that absorbs clock drift is the same band an intercepted code or request can be replayed within.
- **Per-server replay caches don't compose.** A request one server has already seen replays cleanly through another that never saw it and whose clock still calls it fresh.

**Precision note (what is and isn't claimed).** The consequences above are about **bypassing time-based acceptance** — using still-valid authenticators outside their intended window. This lab does **not** show, and time manipulation does not grant: recovery of any signing key, recovery of the HMAC/TOTP secret, or forging a signature over new content. Attacking the *math* (the "flip a bit" toggle) is caught instantly; the clock attacks are dangerous precisely because they require no such forgery.

## Real-World Usage

The clock is load-bearing in TLS certificate validity (RFC 5280), JWT/OAuth `exp`/`nbf` (RFC 7519), TOTP authenticators (RFC 6238), Kerberos authenticator freshness (RFC 4120), AWS S3 presigned URLs and CDN signed URLs, and signed-cookie/session expiry. Documented incidents in this family include mass outages from expired certificates, JWT clock-skew authentication bugs, and replay windows created by generous skew tolerances. NTP (drift between honest peers) and Roughtime (a cryptographically auditable time source over a hostile network) address parts of the problem; neither helps when the adversary owns the clock the verifier reads.

## How to Run Locally

`​``bash
npm install
npm run dev        # Vite dev server
npm test           # 99 unit tests (RFC KATs + verifiers)
npm run build      # typecheck + production build
npm run test:a11y  # axe-core WCAG 2.1 AA gate, both themes (needs: npx playwright install chromium)
`​``

## Related Demos

- **[Chain of Trust](https://crypto-lab.systemslibrarian.dev/)** — full X.509 path building, name constraints, and revocation. The certificate panel here checks *only* validity dates and links out to that demo for everything else.
- **[Crypto Lab suite](https://crypto-lab.systemslibrarian.dev/)** — browser demos of real cryptography.

## Build & Verify

- **99 unit tests** (Vitest), of which **42 are spec known-answer tests**:
  - Ed25519 — RFC 8032 §7.1 TEST 1–3 (`src/crypto/kats.test.ts`) ×3
  - HMAC-SHA-256 — RFC 4231 TC1–4, 6, 7 (`src/crypto/kats.test.ts`) ×6
  - HMAC-SHA-512 — RFC 4231 TC1–2 ×2, HMAC-SHA-1 — RFC 2202 TC1–2 ×2
  - HOTP — RFC 4226 Appendix D, counters 0–9 (`src/otp/otp.test.ts`) ×10
  - TOTP — RFC 6238 Appendix B, 6 times × 3 hashes (`src/otp/otp.test.ts`) ×18
  - JWS HS256 — RFC 7515 Appendix A.1 (`src/jwt/jwt.test.ts`) ×1
- The remaining tests cover DER round-trips and strict fail-closed parsing, the X.509 validity state machine (inclusive bounds), the JWT/URL/replay/token verifiers, the fail-closed decision combinator, and the specific "system fails, primitive holds" outcomes each panel demonstrates.
- **Accessibility gate:** `@axe-core/playwright` scans the production build for zero WCAG 2.1 A/AA violations in **both** themes (`e2e/a11y.spec.ts`); the GitHub Pages deploy is blocked if it fails.

## Performance

Everything runs client-side. Each clock change re-runs a handful of Ed25519/HMAC verifications — well under a millisecond of real work per panel — so dragging the slider updates all six panels smoothly. No idle or decorative animation; the only motion is the step-through verifier, tied to a button.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Nonce Collision

- **slug**: `crypto-lab-nonce-collision`
- **repo**: https://github.com/systemslibrarian/crypto-lab-nonce-collision
- **live**: https://systemslibrarian.github.io/crypto-lab-nonce-collision/
- **commit_sha**: `ce20e54553244996aab3acc667eb5b7c710f394e` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `d739922b5499959218e24ed80af20c65dcda9f0f`
- **read_from**: working tree (clean)
- **category**: ATTACKS | ENCRYPTION  ·  **level**: intermediate  ·  **--accent**: #b91c1c
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: Nonce Collision  — _read from index.html_

**Subtitle**: Mode-specific IV/nonce rules · NIST SP 800-38A/38D · RFC 8439  — _read from index.html_

**Description**: Reuse a counter block or nonce in AES-CTR, AES-GCM, and ChaCha20-Poly1305; reuse a CBC IV and then try a distinct but predictable one. Compare the different results against real encryption.  — _read from index.html_

**Why it matters**: Public IVs and nonces are easy to get wrong. Stream and AEAD modes need unique counters or nonces under a key. CBC needs an unpredictable IV when an attacker can choose plaintext. Here you can see each condition fail.  — _read from index.html_

**Card copy**: Compare nonce reuse in AES-CTR, AES-GCM and ChaCha20-Poly1305 with a separate AES-CBC predictable-IV chosen-plaintext exercise. Observe keystream reuse and authenticated-mode forgery under each stated condition.

**Chips**: AES-GCM · ChaCha20-Poly1305 · Forbidden Attack · Crib Dragging

**Implements**: AES `src/crypto/aes.ts:78`, AES-CBC `src/crypto/aes.ts:94`, AES-CTR `src/crypto/aes.ts:78`, AES-GCM `src/crypto/aes.ts:157`, ChaCha20 `src/crypto/chacha20.ts:44`, ChaCha20-Poly1305 `src/crypto/aead.ts:70`, GHASH `src/crypto/aes.ts:204`, Poly1305 `src/crypto/aead.ts:48`

**Attacks shown**: Birthday bound `README.md:29`, Chosen-plaintext attack `src/main.ts:391`, IV reuse `README.md:13`, Key recovery `src/crypto/aead.ts:96`, Nonce reuse `src/crypto/aes.ts:263`

**References**: AES-SIV

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `NIST IR 8459` — first seen README.md:54 (2×)
- `NIST SP 800-38A` — first seen README.md:3 (4×)
- `NIST SP 800-38D` — first seen README.md:16 (3×)
- `RFC 8439` — first seen README.md:3 (26×)
- `RFC 8452` — first seen README.md:30 (5×)
- `SP 800-38A` — first seen README.md:54 (9×)
- `SP 800-38D` — first seen README.md:29 (9×)

**Stated limitations (page)**:

- _(scope-note, index.html)_ TEACHING DEMO — NOT PRODUCTION Every cipher operation on this page is real: AES runs in your browser's WebCrypto engine; ChaCha20 and Poly1305 are hand-rolled to the RFC 8439 test vectors so their internals are inspectable. The attacks recover real keys from real ciphertexts and are accepted by the real verifiers. It is still a teaching demo — keys live only in memory for the session, and nothing here is hardened for production use.

**README — What Can Go Wrong**:

```text
The failures this lab *causes on purpose*:

- **Keystream reuse (CTR, ChaCha20).** `C₁ ⊕ C₂ = P₁ ⊕ P₂`; crib-dragging recovers plaintext. No integrity claim exists to lose.
- **GHASH authentication-key recovery (GCM).** Two ciphertexts under one nonce → the forbidden attack solves for `H = E_K(0¹²⁸)` → existential forgery. **Authentication-key recovery, not AES-key recovery.**
- **Poly1305 one-time-key recovery (ChaCha20-Poly1305).** The reused nonce fixes `(r, s)`; messages under it reveal `(r, s)` → forgery for that nonce. **The ChaCha20 key is not recovered.**
- **CBC IV reuse.** Reusing an IV makes CBC deterministic on shared prefixes: equal leading plaintext blocks produce equal leading ciphertext blocks. It is a pattern leak, not keystream collapse.
- **CBC predictable but distinct IVs.** If an attacker can choose a plaintext after seeing the next IV, the first plaintext block can compensate for the IV difference and yield the same first ciphertext block as a known encryption. This controlled chosen-plaintext result is not unknown-plaintext recovery or a padding-oracle attack. A new random IV drawn after plaintext commitment prevents this specific compensation, but CBC by itself does not authenticate messages.

NIST [SP 800-38A §5.3 and Appendix C](https://csrc.nist.gov/pubs/sp/800/38/a/final) specify CBC IV unpredictability and `C₁ = Eₖ(P₁ ⊕ IV)`. [NIST IR 8459 §4.1 (September 2024)](https://csrc.nist.gov/pubs/ir/8459/final) discusses predictable CBC IVs, including the historical BEAST attack context. The CBC review also draws on Khan and Cox, *Hacking Cryptography* (2025), §10.1.3; the linked NIST publications provide the public primary references.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Nonce Collision

**Mode-specific IV/nonce requirements · NIST SP 800-38A/38D · RFC 8439**

Reuse one nonce under one key across AES-CTR, AES-GCM, ChaCha20-Poly1305, and AES-CBC, and watch each construction break in its own way — recovering plaintext, forging tags, or leaking prefixes against the *real* primitives. The point of the lab is the precision: the consequence is construction-specific, and none of them fails gracefully.

> **Not production crypto — a teaching demo.** Every operation is real (AES via WebCrypto; ChaCha20 and Poly1305 hand-rolled to the RFC 8439 vectors), but keys live only in memory for the session and nothing here is hardened for production.

---

## What It Is

A nonce ("number used once") or initialization vector (IV) is a public input whose security requirement depends on the mode. AES-CTR must not repeat a counter block under one key; AES-GCM and ChaCha20-Poly1305 require nonce uniqueness under one key. AES-CBC requires an IV that an attacker cannot predict before choosing the plaintext. CBC IV reuse leaks shared-prefix equality, and a *different but predictable* IV can also enable a chosen-plaintext first-block comparison. The lab runs each construction against real encryption and reports the primitive's result separately from the security verdict.

- **AES-CTR / AES-CBC** — NIST SP 800-38A, run in your browser's WebCrypto engine.
- **AES-GCM** — NIST SP 800-38D, including the IV-uniqueness requirement.
- **ChaCha20-Poly1305** — RFC 8439, hand-rolled (the keystream and the Poly1305 polynomial MAC are the teaching subject, so they are inspectable, not hidden in a library).
- **GHASH & Poly1305** — the two polynomial MACs whose one-time secrets collapse under nonce reuse.

**Security model.** Attacks recover keys from *public* data only — ciphertexts and tags, never the key. The GHASH forbidden attack recovers the **authentication** subkey; the Poly1305 attack recovers the **one-time MAC key**. Neither recovers the AES/ChaCha **encryption** key — and the lab is built to keep that distinction exact.

## Exhibits

1. **The XOR reveal (crib-drag).** Encrypt two messages under one AES-CTR key and one nonce. Because a stream cipher XORs plaintext with a keystream fixed by (key, nonce), the two ciphertexts XOR to `P₁ ⊕ P₂` — the keystream cancels. Drag a guessed run of one message across it and the other message's bytes fall out, live, against real ciphertext. A hero "break a reused nonce now" button and a "show me a working crib" helper give the first payoff in one click.
2. **Reuse, four outcomes — one click.** Flip each construction from a fresh IV/nonce to a *reused* one (or hit **Run all**) and read **two independent indicators** per card — the cryptographic result and the security verdict. Colour tracks the verdict, so a forgery the verifier *accepts* renders as an ALARM, never a green success. Fresh CBC uses random, unpredictable IVs; a distinct CBC IV alone is insufficient.
3. **CBC predictable-IV experiment.** The first AES-CBC encryption reveals its IV and first ciphertext block. The page predicts a distinct counter IV for the next encryption and chooses a second first plaintext block `P₂ = P₁ ⊕ IV₁ ⊕ IV₂`. The real first ciphertext blocks match because AES receives the same input. In the control, the same second plaintext is committed *before* a fresh random IV is drawn, and its first ciphertext block differs. This illustrates a chosen-plaintext confidentiality failure under a predictable IV; it does not recover an unknown plaintext or key and does not test authentication.
4. **The "what broke?" scoreboard + consequence table.** A running tally updates as you run cards — Plaintext exposure, Forgery possible, Encryption key recovered — the last row staying *No* everywhere. The consequence table summarizes the reuse experiments separately from CBC's predictable-IV exhibit.
5. **Why the forgeries work.** Step through the single cancellation behind both authenticated breaks: XOR two same-nonce tags and the per-nonce secret (GCM's mask; Poly1305's `s`) cancels, exposing an equation in the key you want. The panel is **computed, not drawn**: pressing it encrypts (or MACs) two probes under a fresh key and one reused nonce, re-derives the shared pad from *each* tag independently, prints both, and checks them against each other — then recomputes `(C₁ ⊕ C₂)·H²` from the recovered H and compares it byte-for-byte with `tag₁ ⊕ tag₂` (and, for Poly1305, `tag₁ − tag₂` against `polyval₁ − polyval₂` mod 2¹²⁸). Press again and every number changes, because every number came from that run.
6. **Where nonces repeat.** Live birthday-bound math for random nonces (32/64/96-bit), the SP 800-38D 2³² random-IV ceiling, and the counter-rewind failure (VM snapshot / fork).
7. **The mitigation, in-frame.** A compact AES-GCM vs AES-GCM-SIV contrast (described from RFC 8452 — SIV is deliberately *not* implemented here) closes the loop before linking to [Nonce Guard](https://systemslibrarian.github.io/crypto-lab-nonce-guard/) for the live side-by-side.

## When to Use It

- **Use** to see how each mode's IV or nonce requirement changes the result: CTR/AEAD reuse, CBC reused-IV prefix leakage, and the separate CBC predictable-IV chosen-plaintext comparison.
- **Use** to see a real forbidden-attack GHASH-key recovery and a real Poly1305 one-time-key recovery end in a forgery the genuine verifier accepts.
- **Do NOT** use this code as a crypto library or take a passing encryption/decryption as a complete security guarantee. CTR and CBC provide no authentication here. The exhibits establish only their stated conditions; in particular, the new CBC exhibit requires the attacker to know the next IV before choosing the plaintext.

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-nonce-collision/**

Type two messages and crib-drag a secret out of the XOR; toggle reuse and watch AES-GCM and ChaCha20-Poly1305 accept forged tags while CBC reveals shared-prefix equality. Then run the separate CBC experiment to compare distinct predictable IVs with a random IV chosen only after plaintext commitment.

## What Can Go Wrong

The failures this lab *causes on purpose*:

- **Keystream reuse (CTR, ChaCha20).** `C₁ ⊕ C₂ = P₁ ⊕ P₂`; crib-dragging recovers plaintext. No integrity claim exists to lose.
- **GHASH authentication-key recovery (GCM).** Two ciphertexts under one nonce → the forbidden attack solves for `H = E_K(0¹²⁸)` → existential forgery. **Authentication-key recovery, not AES-key recovery.**
- **Poly1305 one-time-key recovery (ChaCha20-Poly1305).** The reused nonce fixes `(r, s)`; messages under it reveal `(r, s)` → forgery for that nonce. **The ChaCha20 key is not recovered.**
- **CBC IV reuse.** Reusing an IV makes CBC deterministic on shared prefixes: equal leading plaintext blocks produce equal leading ciphertext blocks. It is a pattern leak, not keystream collapse.
- **CBC predictable but distinct IVs.** If an attacker can choose a plaintext after seeing the next IV, the first plaintext block can compensate for the IV difference and yield the same first ciphertext block as a known encryption. This controlled chosen-plaintext result is not unknown-plaintext recovery or a padding-oracle attack. A new random IV drawn after plaintext commitment prevents this specific compensation, but CBC by itself does not authenticate messages.

NIST [SP 800-38A §5.3 and Appendix C](https://csrc.nist.gov/pubs/sp/800/38/a/final) specify CBC IV unpredictability and `C₁ = Eₖ(P₁ ⊕ IV)`. [NIST IR 8459 §4.1 (September 2024)](https://csrc.nist.gov/pubs/ir/8459/final) discusses predictable CBC IVs, including the historical BEAST attack context. The CBC review also draws on Khan and Cox, *Hacking Cryptography* (2025), §10.1.3; the linked NIST publications provide the public primary references.

## Real-World Usage

Nonce reuse is not hypothetical. A 2016 survey (Böck, Zauner, Devlin, et al.) found production HTTPS servers reusing AES-GCM nonces, exposed to exactly the forbidden attack. Counter-based nonces have rewound after VM snapshots and process forks, re-emitting values under a long-lived key. This is why SP 800-38D caps a single key at **2³² invocations** when 96-bit IVs are random, and why misuse-resistant designs such as **AES-GCM-SIV** (RFC 8452) exist — see the [Nonce Guard](https://systemslibrarian.github.io/crypto-lab-nonce-guard/) lab.

## How to Run Locally

`​``bash
npm install
npm run dev        # Vite dev server
npm run build      # type-check + production build to dist/
npm test           # Vitest unit + KAT suite
npm run test:a11y  # axe-core WCAG gate against the built site (needs: npx playwright install chromium)
`​``

## Related Demos

- [Nonce Guard](https://systemslibrarian.github.io/crypto-lab-nonce-guard/) — AES-GCM vs AES-GCM-SIV under nonce misuse (the mitigation this lab points to).
- [Padding Oracle](https://systemslibrarian.github.io/crypto-lab-padding-oracle/) — the CBC integrity break this lab deliberately skips.
- [ChaCha20 Stream](https://systemslibrarian.github.io/crypto-lab-chacha20-stream/) — the keystream on its own.
- [AES Modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/) — CTR, CBC, and friends side by side.
- [MAC Race](https://systemslibrarian.github.io/crypto-lab-mac-race/) — how message authentication is supposed to work.
- **Entropy Collapse** — how randomness and counters fail upstream of the nonce (in the [catalog](https://crypto-lab.systemslibrarian.dev/)).

## Build & Verify

The Vitest suite (`npm test`) includes these spec known-answer tests:

| Vector | Source | File |
| --- | --- | --- |
| ChaCha20 block function | RFC 8439 §2.3.2 | `src/crypto/chacha20.test.ts` |
| ChaCha20 encryption ("sunscreen") | RFC 8439 §2.4.2 | `src/crypto/chacha20.test.ts` |
| Poly1305 MAC | RFC 8439 §2.5.2 | `src/crypto/poly1305.test.ts` |
| Poly1305 key generation | RFC 8439 §2.6.2 | `src/crypto/poly1305.test.ts` |
| ChaCha20-Poly1305 AEAD | RFC 8439 §2.8.2 | `src/crypto/aead.test.ts` |
| GHASH field math | cross-checked vs an independent GHASH reference | `src/crypto/gf128.test.ts` |
| AES-256 `E_K(0¹²⁸)` (GHASH subkey `H`) | GCM spec (McGrew & Viega) Appendix B, Test Case 13 | `src/crypto/aes.test.ts` |

Beyond the KATs, the suite proves the attacks are real: the forbidden attack recovers `H` byte-for-byte over random keys and the forged blob is accepted by **WebCrypto's own** AES-GCM verifier; the Poly1305 recovery reproduces the true `(r, s)` and the forged tag is accepted by the real verifier; unique nonces provably do **not** recover either key.

The CBC predictable-IV test independently cross-checks the WebCrypto demonstration against Node's AES-CBC for the known `P₁ ⊕ IV₁ = P₂ ⊕ IV₂` relation, checks distinct IVs and plaintexts, and compares a third IV drawn after plaintext commitment. The browser regression test checks the rendered distinct-IV and random-control outcomes and public source links.

**Accessibility is gated in CI.** `@axe-core/playwright` scans the production build for zero WCAG 2.1 A/AA violations in **both** themes — driving the demo into its ALARM/LEAK states first — and the GitHub Pages deploy is blocked if it fails.

## Performance

Everything runs client-side with no backend. The GF(2¹²⁸) and Poly1305 solvers use native `BigInt`; each attack completes in well under a frame. AES uses hardware-accelerated WebCrypto.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Wider-block proposal

The live demo now distinguishes the [1 June 2026 wGCM consultation](https://csrc.nist.gov/pubs/sp/800/38/d/r1/2prd) from finalized GCM and AES key-size selection. It does not implement wGCM.

```

</details>

---

## Power Trace

- **slug**: `crypto-lab-power-trace`
- **repo**: https://github.com/systemslibrarian/crypto-lab-power-trace
- **live**: https://systemslibrarian.github.io/crypto-lab-power-trace/
- **commit_sha**: `4e542688b2241f55892329100b21c0fc1796a99f` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: advanced  ·  **--accent**: #ca8a04
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: Power Trace  — _read from src/ui/ui.ts_

**Subtitle**: SPA · DPA · CPA · masking countermeasures  — _read from src/ui/ui.ts_

**Description**: Correlate a Hamming-weight model against simulated traces from real AES-128 intermediate values, and watch one key-byte guess spike out of 256 as the trace count climbs.  — _read from src/ui/ui.ts_

**Why it matters**: Constant-time execution does not by itself prevent power or EM leakage. This teaching model assumes constant-time execution but data-dependent power; protecting real devices also requires appropriate side-channel countermeasures.  — _read from src/ui/ui.ts_

**Card copy**: Recover an AES-128 key byte from simulated power traces. Correlation and differential power analysis use real statistics on modeled leakage; the JavaScript AES is not constant-time. An idealized AES table cache-line observation leaves 16 candidates without measuring browser hardware leakage.

**Chips**: CPA · DPA · AES-128 · Hamming Weight

**Implements**: AES `src/aes/aes.ts:123`

**Attacks shown**: Key recovery `src/ui/ui.ts:305`, Known-plaintext attack `src/ui/cache.ts:59`, Power analysis `src/attack/dpa.ts:112`

**Comment-only (named in code comments, not executed)**: RSA `src/spa/modexp.ts:14`

**References**: ML-DSA, RSA

**Standards body**: NIST

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `CHES 2004` — first seen README.md:195 (1×)
- `CRYPTO 1999` — first seen README.md:194 (1×)
- `ePrint 2005/271` — first seen README.md:191 (1×)
- `ePrint 2026/2658` — first seen README.md:210 (2×)
- `eprint.iacr.org/2005/271` — first seen README.md:109 (3×)
- `eprint.iacr.org/2026/2658` — first seen README.md:210 (2×)
- `FIPS 140-3` — first seen README.md:127 (1×)

**README — What Can Go Wrong**:

```text
The honest scope, stated plainly:

- **The traces are simulated.** They come from the cipher's real intermediates plus Gaussian
  noise — not from an oscilloscope. Real silicon leaks a noisier, more complex function; the
  exact noise characteristics do **not** transfer.
- **The JavaScript AES is not a constant-time implementation.** It uses secret-dependent
  S-box lookups in the round function and key schedule, and a secret-dependent branch
  in the GF multiplication used by MixColumns. Passing AES known-answer tests checks
  functional output, not timing behavior. No timing measurements or hardware leakage
  assessment are provided; no practical timing exploit is asserted. See
  [BearSSL’s constant-time explanation](https://www.bearssl.org/constanttime.html)
  for why secret-dependent memory accesses and conditional jumps matter.
- **The cache-line observation is idealized.** It models an old-style 32-bit-entry T-table
  with 64-byte lines and perfect observation of a single lookup, not the one-byte S-box's
  actual JavaScript memory layout. The all-lines access pattern is a conceptual control,
  not production code or a claim that this toy makes AES constant-time. The original
  [AES cache-attack research](https://eprint.iacr.org/2005/271) and
  [NIST's AES implementation-security review (2022)](https://www.nist.gov/news-events/news/2022/12/announcement-proposal-update-fips-197-advanced-encryption-standard)
  describe why such channels deserve attention in real implementations.
- **What transfers:** the leakage model (power tracks Hamming weight), the statistics, and
  the trace-count economics. **What doesn't:** the physics of a particular device.
- **The recovered value is precisely** byte 0 of the AES-128 key. In AES-128 the first round
  key *is* the cipher key, so this is a real **encryption**-key byte — not a MAC or
  authentication key. The maths is intact; the leak is in the hardware model, not the
  algorithm.
- **Masking is only shown to kill first-order CPA.** It does **not** prove masking is secure:
  second-order attacks combine two sample points and can defeat it. That attack is named,
  not built.
- **Out of scope by design:** higher-order DPA, template attacks, real capture, and PQC
  power analysis.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Power Trace

**Recover an AES-128 key byte from simulated power traces.** A timing attack measures
how long the secret took; a power attack measures data-dependent electrical activity.
The teaching model assumes constant-time execution while allowing power to depend on
intermediate values: constant-time software can still leak through power or EM.
This assumption is about the model, not a guarantee about the JavaScript AES below.

> **Not production crypto — a teaching demo.** The AES-128 and the statistics are real; the
> power traces are **simulated** from the cipher's real intermediate values. See
> [What Can Go Wrong](#what-can-go-wrong) and the in-page honesty panel for exactly what is
> real, what is modelled, and what this does **not** prove.

## What It Is

An interactive walk through power side-channel analysis against a real, hand-rolled
**AES-128** (FIPS-197). The leakage target is the first-round `SubBytes` output,
`SBox(p ⊕ k)`; the leakage model is `power = HammingWeight(intermediate) + noise`. Every
attack is genuine:

- **Real AES-128** — S-box derived from first principles (multiplicative inverse in GF(2⁸)
  + the AES affine transform), real key schedule and round function, validated by FIPS-197
  known-answer tests.
- **Real Pearson correlation**, **real DPA difference-of-means**, and **real
  cross-correlation resynchronization**.
- **Simulated traces** — generated from the cipher's real intermediates plus Gaussian
  noise, not captured from silicon.
- **Separate simulated cache-line exhibit** — an ideal observer of a hypothetical
  4-byte-entry AES T-table (64-byte lines) sees one of 16 lines for a first-round
  lookup. This is an address model, not a measurement of this JavaScript AES.

**Security model:** this is a bench, not a device. No secrets are protected here; the AES
key is a fixed teaching value and everything runs in the browser with no backend. The point
is to show *why the class of attack works*, not to break any specific hardware.

## Exhibits

1. **Simple Power Analysis** — read a secret exponent off a *single* trace of
   square-and-multiply modular exponentiation. Squares are short, multiplies are long;
   square-then-multiply is a 1, a lone square is a 0. No statistics. The hook.
2. **Correlation Power Analysis (the headline)** — for each of the 256 guesses of key
   byte 0, predict `HW(SBox(p ⊕ k))` and correlate against the measured power. Drag the
   trace-count, noise, and **seed** sliders and watch the one correct byte spike out of the
   pack. The **cryptographic result** ("AES ran correctly") and the **security verdict**
   ("its key leaked") are shown as separate indicators — a correct cipher whose key leaked
   reads as ALARM, not green. **Freeze** a curve to compare parameter settings, **copy a
   permalink** that reopens the exact figure, or **export** the result as JSON / the 256
   correlations as CSV.
3. **The economics of noise** — raise the noise floor and watch the required trace count
   climb (roughly ∝ σ²). Attacks don't fail from noise; they just cost more traces.
4. **Trace misalignment** — jitter the traces and CPA collapses; cross-correlate to a
   reference, undo the shift, and it recovers. The cheapest real-world defense, and the
   easiest to defeat.
5. **DPA vs CPA** — Kocher–Jaffe–Jun's 1999 difference-of-means beside Brier–Clavier
   –Olivier's 2004 correlation, on the same measurements. DPA came first; CPA needs far
   fewer traces.
6. **Countermeasures** — Boolean masking (first-order), shuffling, and hiding/noise, each
   attacked with the identical CPA. Masking removes the first-order leak; shuffling and
   hiding only raise the price. The second-order attack that defeats masking is **named,
   not built.**
7. **Bring your own traces** — the same real CPA runs on any traces in a documented CSV
   format (plaintext byte + power samples per row). Download the example CSV or drop in your
   own capture (e.g. exported from ChipWhisperer). What transfers is stated plainly.
8. **Cache-line model (different channel)** — enter a known plaintext byte. An idealized
   secret-dependent 4-byte-entry T-table lookup in a hypothetical 64-byte cache line
   reveals one line, narrowing a single key byte to **16**, not one, possibilities.
   Compare the same byte against an all-lines, secret-independent *model control*:
   all **256** key bytes remain possible. Neither model runs actual T-table AES,
   measures browser timing, nor demonstrates full-key recovery. A real constant-time
   implementation requires more than this illustrative control.
9. **Honesty panel** — what is real, what is simulated, and what this does not prove.

## When to Use It

- **Do** use it to build intuition for why constant-time, bug-free code is not enough, and
  how trace-count economics drive real evaluations.
- **Do** use it to see the difference between a countermeasure that closes a channel and one
  that only raises the cost.
- **Do NOT** use it to conclude that any specific chip is (or isn't) vulnerable, to size a
  real attack, or as a source of trace-capture or DSP code — the traces here are modelled,
  not measured.

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-power-trace/**

Move the CPA sliders to watch the spike separate; press the countermeasure and misalignment
buttons to defend the chip, then defeat (or fail to defeat) the defense yourself. Every
button runs the real primitive against the real analysis.

## What Can Go Wrong

The honest scope, stated plainly:

- **The traces are simulated.** They come from the cipher's real intermediates plus Gaussian
  noise — not from an oscilloscope. Real silicon leaks a noisier, more complex function; the
  exact noise characteristics do **not** transfer.
- **The JavaScript AES is not a constant-time implementation.** It uses secret-dependent
  S-box lookups in the round function and key schedule, and a secret-dependent branch
  in the GF multiplication used by MixColumns. Passing AES known-answer tests checks
  functional output, not timing behavior. No timing measurements or hardware leakage
  assessment are provided; no practical timing exploit is asserted. See
  [BearSSL’s constant-time explanation](https://www.bearssl.org/constanttime.html)
  for why secret-dependent memory accesses and conditional jumps matter.
- **The cache-line observation is idealized.** It models an old-style 32-bit-entry T-table
  with 64-byte lines and perfect observation of a single lookup, not the one-byte S-box's
  actual JavaScript memory layout. The all-lines access pattern is a conceptual control,
  not production code or a claim that this toy makes AES constant-time. The original
  [AES cache-attack research](https://eprint.iacr.org/2005/271) and
  [NIST's AES implementation-security review (2022)](https://www.nist.gov/news-events/news/2022/12/announcement-proposal-update-fips-197-advanced-encryption-standard)
  describe why such channels deserve attention in real implementations.
- **What transfers:** the leakage model (power tracks Hamming weight), the statistics, and
  the trace-count economics. **What doesn't:** the physics of a particular device.
- **The recovered value is precisely** byte 0 of the AES-128 key. In AES-128 the first round
  key *is* the cipher key, so this is a real **encryption**-key byte — not a MAC or
  authentication key. The maths is intact; the leak is in the hardware model, not the
  algorithm.
- **Masking is only shown to kill first-order CPA.** It does **not** prove masking is secure:
  second-order attacks combine two sample points and can defeat it. That attack is named,
  not built.
- **Out of scope by design:** higher-order DPA, template attacks, real capture, and PQC
  power analysis.

## Real-World Usage

Power and EM side-channel analysis is a standard part of evaluating smart cards, TPMs,
HSMs, and IoT silicon (Common Criteria, EMVCo, FIPS 140-3 side-channel testing). The
open-source **ChipWhisperer** platform captures real traces and runs exactly this CPA
pipeline. Masking, shuffling, and hiding are the countermeasures deployed in real secure
elements — with the higher-order caveats this lab is careful to name.

## How to Run Locally

`​``bash
npm install
npm run dev        # http://localhost:5173/crypto-lab-power-trace/
npm test           # unit tests incl. FIPS-197 KATs
npm run build      # typecheck + production build
npm run test:a11y  # WCAG 2.1 AA gate (both themes) against the built preview
`​``

Local a11y preview runs on port **4288** (`npm run preview -- --port 4288 --strictPort`).

## Related Demos

- [crypto-lab-rsa-educational](https://systemslibrarian.github.io/crypto-lab-rsa-educational/)
  — the RSA arithmetic behind the SPA exhibit.
- [crypto-lab-timing-sidechannel](https://systemslibrarian.github.io/crypto-lab-timing-sidechannel/)
  — an early-exit secret-comparison timing attack, distinct from the cache-line model here.
- [crypto-lab-timing-oracle](https://systemslibrarian.github.io/crypto-lab-timing-oracle/)
  — a remote timing oracle.
- [crypto-lab-lattice-fault](https://systemslibrarian.github.io/crypto-lab-lattice-fault/)
  — fault injection and PQC/NTT leakage, a different physical channel.

## Build & Verify

- **Unit tests** (Vitest), colocated as `src/**/*.test.ts`, including the cache-line model,
  all passing.
- **Spec KATs:** 3 FIPS-197 AES-128 known-answer encryption vectors (`src/aes/aes.test.ts`),
  plus FIPS-197 S-box and key-expansion checks. The attack tests prove CPA recovers the key
  byte, DPA needs more traces than CPA, jitter collapses CPA and resync restores it, masking
  decorrelates the first-order leak, and SPA reads the exponent off the operation trace.
- **Behavior E2E** (`e2e/behavior.spec.ts`): Playwright drives the shipped UI to verify the
  teaching outcomes — CPA recovers `0x2B`, the verdict flips as trace count climbs, jitter
  blocks the attack and resync restores it, masking defeats first-order CPA, a permalink
  restores the exact figure, the example CSV round-trips through the real import pipeline and
  recovers `0x2B`, and the theme choice persists across reload.
- **Accessibility gate:** `@axe-core/playwright` scans the production build for zero WCAG
  2.1 A/AA violations in **both** themes, and blocks the GitHub Pages deploy on any failure.
- **CI on every PR** (`.github/workflows/ci.yml`) runs unit tests, the typechecked build, a
  **bundle-size budget** (`npm run size`), and the a11y + behavior gate before merge;
  `deploy.yml` runs the same on `main` and only then publishes.

## Performance

CPA over all 256 guesses at 5,000 traces runs in well under a second in the browser; the
headline sliders recompute on `requestAnimationFrame`. Trace sets are generated once per
`(noise, seed)` pair and cached. Everything is deterministic: the same seed, trace count, and
noise reproduce the exact figure, so README/appendix claims regenerate from documented
settings.

## References & Further Reading

Full derivations, the leakage model, and the exact formulas are in
[`docs/TECHNICAL.md`](docs/TECHNICAL.md). Primary sources:

- **BearSSL** — [*Constant-Time Crypto*](https://www.bearssl.org/constanttime.html),
  especially the execution model: secret-dependent memory accesses and conditional jumps.
- **FIPS-197** — *Advanced Encryption Standard (AES)*, NIST, 2001 (rev. 2023).
- **Osvik, Shamir & Tromer** — [*Cache attacks and Countermeasures: the Case of AES*](https://eprint.iacr.org/2005/271),
  ePrint 2005/271. Original demonstration of cache-state leakage from table-based AES.
- **NIST** — [AES review announcement (19 December 2022)](https://www.nist.gov/news-events/news/2022/12/announcement-proposal-update-fips-197-advanced-encryption-standard),
  implementation-security section, on the relevance of cache-timing attacks.
- **Kocher, Jaffe & Jun** — *Differential Power Analysis*, CRYPTO 1999.
- **Brier, Clavier & Olivier** — *Correlation Power Analysis with a Leakage Model*, CHES 2004.
- **Mangard, Oswald & Popp** — *Power Analysis Attacks*, Springer 2007.
- **ChipWhisperer** (NewAE) — the open-source platform that runs this pipeline on real hardware.

Contributing guidelines and the module architecture are in
[`CONTRIBUTING.md`](CONTRIBUTING.md).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Shuffling research update — 28 October 2026

Schupp et al., [Unshuffling Fisher-Yates, ePrint 2026/2658](https://eprint.iacr.org/2026/2658) (received 27 October, approved 28 October 2026), is a preprint reporting a physical power side-channel attack. Leakage from Fisher-Yates permutation generation reveals the shuffled execution order; combining it with shuffled ML-DSA-44 NTT leakage recovers the secret polynomial s1, directly or with remaining coefficients enumerated. A single trace concerns an individual shuffle; the full polynomial-recovery experiment uses multiple measurements. Protect permutation generation as well as the shuffled operations. This is not a mathematical break of ML-DSA.

Exhibit 6 includes a visible source note. Its simulated AES traces do not model permutation-generation leakage or reproduce these physical ML-DSA measurements.

```

</details>

---

## Protocol Checker

- **slug**: `crypto-lab-protocol-checker`
- **repo**: https://github.com/systemslibrarian/crypto-lab-protocol-checker
- **live**: https://systemslibrarian.github.io/crypto-lab-protocol-checker/
- **commit_sha**: `40644d0afc8ae2f1146cdc505216580ca577f4d1` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: advanced  ·  **--accent**: #2dd4bf
- **MISSING FIELDS**: spec_citations, mutations, verification

**Name (H1)**: Protocol Checker  — _read from src/ui.ts_

**Subtitle**: Dolev-Yao symbolic analysis · automated attack discovery  — _read from src/ui.ts_

**Description**: Hand a protocol you believe is correct to a symbolic model checker and watch it return the exact message sequence that breaks it — by searching, not by being told.  — _read from src/ui.ts_

**Why it matters**: You can only test a protocol against the attacks you thought of. Symbolic analysis searches the ones you did not — which is how Lowe found the Needham-Schroeder flaw in 1995, seventeen years after everyone had read it.  — _read from src/ui.ts_

**Card copy**: A Dolev-Yao symbolic model checker that rediscovers Lowe's attack on Needham-Schroeder live — found by searching, not by being told — then closes the seventeen-year-old flaw in one edit.

**Chips**: Dolev-Yao · Symbolic Model · Needham-Schroeder · Unification

**Implements**: N/A

**Attacks shown**: Man-in-the-middle `src/ui.ts:57`

**Comment-only (named in code comments, not executed)**: Kerberos `src/ui.ts:261`, Pairing `src/symbolic/terms.ts:5`

**References**: Diffie-Hellman, Kerberos, TLS 1.3

**Standards body**: _none_

**Implementation**: N/A (model or attack)

**README — What Can Go Wrong**:

```text
The model is an abstraction, and its limits are the point of the lab:

- **Perfect cryptography.** Encryption is opaque — no key recovery, no algebraic leakage, no side channels, no timing, no implementation bugs. Every attack in [timing-oracle](https://systemslibrarian.github.io/crypto-lab-timing-oracle/), [power-trace](https://systemslibrarian.github.io/crypto-lab-power-trace/), [kem-trap](https://systemslibrarian.github.io/crypto-lab-kem-trap/), and [padding-oracle](https://systemslibrarian.github.io/crypto-lab-padding-oracle/) is invisible to this checker.
- **Bounded search.** A finite number of sessions and states is explored; the bound is displayed. "No attack found" is always relative to it.
- **One equation only.** The single algebraic property modelled is `g^ab = g^ba` (a canonical unordered DH key). No XOR, no partial-DH unification, no broader equational theory.
- **Not provable security.** Symbolic analysis and computational (game-hopping) proofs are different disciplines; neither subsumes the other. CryptoVerif is the tool on the computational branch.
```

**Claims tested** (e2e/claims.spec.ts, 25 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:75
    - :75 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:95
    - :95 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:119
    - :119 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:127
    - :127 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:134
    - :134 `toContainText` expected `'attacker'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:144
    - :144 `toHaveClass` expected `/indicator--idle/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:151
    - :151 `toHaveClass` expected `/indicator--idle/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:167
    - :167 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:171
    - :171 `toEqual` expected `[]` _(expression)_
- `the idle checker claims nothing until it is run` — e2e/claims.spec.ts:174
    - :175 `toHaveClass` expected `/indicator--idle/` _(regex)_
    - :176 `toContainText` expected `'Not run yet'` _(literal)_
    - :177 `toContainText` expected `'Idle.'` _(literal)_
    - :178 `toHaveCount` expected `0` _(literal)_
    - :179 `toHaveCount` expected `0` _(literal)_
    - :180 `toHaveCount` expected `0` _(literal)_
    - :181 `toHaveCount` expected `0` _(literal)_
    - :185 `toHaveText` expected `'Protocol under test: Needham-Schroeder Public Key'` _(literal)_
    - :186 `toHaveCount` expected `3` _(literal)_
    - :187 `toHaveCount` expected `1` _(literal)_
    - :188 `toBeEnabled` expected _no expected value_ _(none)_
- `the attack verdict is the verdict the attacker-knowledge panel implies` — e2e/claims.spec.ts:191
    - :202 `toBe` expected `true` _(expression)_
    - :203 `toHaveText` expected `new RegExp(attackReached ? 'ATTACK FOUND' : 'No attack in bound')` _(expression)_
    - :204 `toHaveClass` expected `new RegExp(attackReached ? 'indicator--alarm' : 'indicator--ok')` _(expression)_
    - :208 `toHaveLength` expected `1` _(literal)_
    - :209 `toBe` expected `true` _(expression)_
    - :210 `toEqual` expected `[goal]` _(expression)_
    - :213 `toContainText` expected `'the attacker learns ${goal}'` _(expression)_
- `the leak is a decryption the attacker was entitled to do — the cipher never breaks` — e2e/claims.spec.ts:216
    - :225 `toContainText` expected `'Perfect — unbroken'` _(literal)_
    - :226 `toHaveClass` expected `/indicator--(alarm|ok)/` _(regex)_
    - :227 `toContainText` expected `'No key was recovered'` _(literal)_
    - :233 `toBe` expected `'DEC'` _(literal)_
    - :234 `toBe` expected `'given'` _(literal)_
    - :235 `expect` expected _no expected value_ _(none)_
    - :239 `expect` expected _no expected value_ _(none)_
    - :243 `toEqual` expected `['DEC', 'PUB', 'SPLIT', 'given', 'intercept']` _(expression)_
- `the trace is a relay: every message crosses the attacker and one ciphertext is forwarded verbatim` — e2e/claims.spec.ts:246
    - :251 `expect` expected _no expected value_ _(none)_
    - :257 `toBe` expected `true` _(expression)_
    - :258 `toBe` expected `r.to` _(expression)_
    - :267 `toHaveLength` expected `1` _(literal)_
    - :268 `toBe` expected `relays[0].next.to` _(expression)_
    - :274 `expect` expected _no expected value_ _(none)_
    - :279 `toBe` expected `first.body` _(expression)_
    - :280 `toBe` expected `attacker` _(expression)_
    - :281 `toBe` expected `rows[1].to` _(expression)_
    - :282 `toBe` expected `first.to` _(expression)_
    - :287 `toHaveLength` expected `rows.length` _(expression)_
    - :293 `toMatch` expected `expected` _(expression)_
- `the ladder mirrors the trace and names exactly who is deceived` — e2e/claims.spec.ts:297
    - :303 `toEqual` expected `rows` _(expression)_
    - :313 `toHaveLength` expected `3` _(literal)_
    - :316 `toBe` expected `attacker` _(expression)_
    - :317 `expect` expected _no expected value_ _(none)_
    - :318 `toEqual` expected `[]` _(expression)_
    - :321 `toHaveLength` expected `1` _(literal)_
    - :324 `toBe` expected `'actually ${attacker}'` _(expression)_
    - :327 `toHaveText` expected _no expected value_ _(none)_
    - :336 `expect` expected _no expected value_ _(none)_
    - :337 `toBe` expected `true` _(expression)_
    - :338 `toBe` expected _no expected value_ _(none)_
    - :347 `toBe` expected `2` _(literal)_
    - :350 `toBe` expected `withDeceived ? 'right' : 'left'` _(expression)_
- `stepping the trace reveals one message at a time and grows the knowledge set` — e2e/claims.spec.ts:354
    - :363 `toHaveText` expected `'message ${rows.length} of ${rows.length}'` _(expression)_
    - :364 `toBeDisabled` expected _no expected value_ _(none)_
    - :367 `toHaveText` expected `'start'` _(literal)_
    - :368 `toBeDisabled` expected _no expected value_ _(none)_
    - :369 `toHaveCount` expected `0` _(literal)_
    - :370 `toHaveCount` expected `0` _(literal)_
    - :375 `expect` expected _no expected value_ _(none)_
    - :376 `toEqual` expected `['PUB', 'given']` _(expression)_
    - :377 `toBe` expected `false` _(expression)_
    - :378 `toHaveText` expected `/Before any message/` _(regex)_
    - :382 `toHaveText` expected `'message ${i + 1} of ${rows.length}'` _(expression)_
    - :383 `toHaveCount` expected `i + 1` _(expression)_
    - :384 `toHaveCount` expected `i + 1` _(expression)_
    - :385 `toHaveCount` expected `1` _(literal)_
    - :386 `toHaveClass` expected `/current/` _(regex)_
    - :390 `expect` expected _no expected value_ _(none)_
    - :397 `toEqual` expected `atStart.map((f) => f.term).sort()` _(expression)_
    - :398 `toEqual` expected `[]` _(expression)_
    - :399 `toEqual` expected _no expected value_ _(none)_
    - :406 `toBe` expected `i === rows.length - 1` _(expression)_
    - :407 `toBe` expected `true` _(expression)_
    - :409 `toBeDisabled` expected _no expected value_ _(none)_
- `the search counters agree with the trace, the bound, and each other` — e2e/claims.spec.ts:412
    - :417 `expect` expected _no expected value_ _(none)_
    - :418 `expect` expected _no expected value_ _(none)_
    - :420 `toBe` expected `rows.length` _(expression)_
    - :422 `expect` expected _no expected value_ _(none)_
    - :423 `toContainText` expected `'found by enumeration'` _(literal)_
    - :426 `toEqual` expected `[` _(expression)_
    - :437 `toEqual` expected `c` _(expression)_
    - :438 `toEqual` expected `rows` _(expression)_
- `Lowe's fix retracts the verdict, and the re-run derives why the relay fails` — e2e/claims.spec.ts:441
    - :446 `toHaveClass` expected `/indicator--alarm/` _(regex)_
    - :450 `toHaveClass` expected `/indicator--idle/` _(regex)_
    - :451 `toContainText` expected `'Not run yet'` _(literal)_
    - :452 `toContainText` expected `'Idle.'` _(literal)_
    - :453 `toHaveCount` expected `0` _(literal)_
    - :454 `toHaveCount` expected `0` _(literal)_
    - :455 `toHaveCount` expected `0` _(literal)_
    - :456 `toHaveText` expected `'Protocol under test: Needham-Schroeder-Lowe'` _(literal)_
    - :458 `toHaveCount` expected `1` _(literal)_
    - :459 `toContainText` expected `'B}_pkA'` _(literal)_
    - :462 `toHaveClass` expected `/indicator--ok/` _(regex)_
    - :463 `toContainText` expected `'No attack in bound'` _(literal)_
    - :465 `toHaveCount` expected `0` _(literal)_
    - :466 `toHaveCount` expected `0` _(literal)_
    - :467 `toHaveCount` expected `0` _(literal)_
    - :468 `toContainText` expected `'No trace'` _(literal)_
    - :471 `expect` expected _no expected value_ _(none)_
    - :473 `expect` expected _no expected value_ _(none)_
    - :474 `toContainText` expected `'frontier emptied'` _(literal)_
    - :475 `toContainText` expected `'space fully exhausted'` _(literal)_
    - :477 `toContainText` expected `'within ${c.explored.toLocaleString('en-US')} states'` _(expression)_
    - :483 `expect` expected _no expected value_ _(none)_
    - :485 `expect` expected _no expected value_ _(none)_
    - :487 `expect` expected _no expected value_ _(none)_
    - :488 `toBe` expected `attacker` _(expression)_
    - :489 `toBe` expected `attacker` _(expression)_
    - :490 `expect` expected _no expected value_ _(none)_
    - :491 `expect` expected _no expected value_ _(none)_
    - :493 `expect` expected _no expected value_ _(none)_
- `switching protocols clears the verdict, the trace and the fix toggle` — e2e/claims.spec.ts:496
    - :499 `toBeVisible` expected _no expected value_ _(none)_
    - :502 `toHaveClass` expected `/indicator--idle/` _(regex)_
    - :503 `toHaveCount` expected `0` _(literal)_
    - :504 `toHaveCount` expected `0` _(literal)_
    - :505 `toHaveCount` expected `0` _(literal)_
    - :506 `toContainText` expected `'Idle.'` _(literal)_
    - :508 `toBeChecked` expected _no expected value_ _(none)_
    - :509 `toHaveText` expected `'Protocol under test: Naive Diffie-Hellman'` _(literal)_
- `naive Diffie-Hellman: the MITM verdict names the key the attacker owns` — e2e/claims.spec.ts:512
    - :522 `toBe` expected `true` _(expression)_
    - :523 `toHaveClass` expected `/indicator--alarm/` _(regex)_
    - :524 `toContainText` expected `'the attacker learns ${goal}'` _(expression)_
    - :525 `toContainText` expected `'Perfect — unbroken'` _(literal)_
    - :533 `expect` expected _no expected value_ _(none)_
    - :534 `toBe` expected `goal` _(expression)_
    - :537 `toHaveLength` expected `1` _(literal)_
    - :541 `expect` expected _no expected value_ _(none)_
    - :542 `toBe` expected `'given'` _(literal)_
    - :543 `toBe` expected `'DEC'` _(literal)_
    - :556 `toEqual` expected `[]` _(expression)_
    - :557 `toBe` expected `false` _(expression)_
    - :559 `toHaveLength` expected `1` _(literal)_
    - :560 `toBe` expected `'actually ${attacker}'` _(expression)_
    - :561 `toBe` expected `idle.name` _(expression)_
- `signed Diffie-Hellman: secure, and the obstacle is the signature it cannot forge` — e2e/claims.spec.ts:564
    - :568 `toHaveCount` expected `2` _(literal)_
    - :571 `toHaveClass` expected `/indicator--ok/` _(regex)_
    - :572 `toContainText` expected `'No attack in bound'` _(literal)_
    - :573 `toHaveCount` expected `0` _(literal)_
    - :574 `toHaveCount` expected `0` _(literal)_
    - :575 `toContainText` expected `'Perfect — unbroken'` _(literal)_
    - :578 `expect` expected _no expected value_ _(none)_
    - :579 `toContainText` expected `'frontier emptied'` _(literal)_
    - :583 `expect` expected _no expected value_ _(none)_
    - :587 `expect` expected _no expected value_ _(none)_
    - :588 `expect` expected _no expected value_ _(none)_
    - :589 `expect` expected _no expected value_ _(none)_
- `the Kerberos entry is link-only, and Run comes back to life when you leave it` — e2e/claims.spec.ts:592
    - :597 `toBeDisabled` expected _no expected value_ _(none)_
    - :598 `toHaveCount` expected `0` _(literal)_
    - :599 `toHaveCount` expected `0` _(literal)_
    - :600 `toContainText` expected `'links to the sibling demo'` _(literal)_
    - :602 `toHaveAttribute` expected `'href', 'https://systemslibrarian.github.io/crypto-lab-kerberos/'` _(expression)_
    - :603 `toHaveText` expected `/Open the Kerberos lab/` _(regex)_
    - :607 `toHaveCount` expected `0` _(literal)_
    - :611 `toBeEnabled` expected _no expected value_ _(none)_
    - :613 `toHaveClass` expected `/indicator--alarm/` _(regex)_
- `every library chip agrees with the verdict the checker produces live` — e2e/claims.spec.ts:616
    - :624 `toHaveLength` expected `5` _(literal)_
    - :626 `toHaveLength` expected `1` _(literal)_
    - :627 `toHaveLength` expected `4` _(literal)_
    - :638 `expect` expected _no expected value_ _(none)_
    - :644 `toBe` expected `found ? '✗ attack found' : '✓ no attack in bound'` _(expression)_
    - :645 `expect` expected _no expected value_ _(none)_
    - :646 `toHaveClass` expected `new RegExp(found ? 'indicator--alarm' : 'indicator--ok')` _(expression)_
    - :647 `toContainText` expected `found ? 'ATTACK FOUND' : 'No attack in bound'` _(expression)_
    - :648 `toBe` expected `found` _(expression)_
- `with the counter animation running` — e2e/claims.spec.ts:657
- `the counter lands on the true state count and then reveals the trace` — e2e/claims.spec.ts:665
    - :671 `toHaveCount` expected `1` _(literal)_
    - :672 `toHaveText` expected `/message (\d+) of \1$/` _(regex)_
    - :674 `expect` expected _no expected value_ _(none)_
    - :679 `toEqual` expected `settled` _(expression)_
    - :680 `toBe` expected `await page.locator('.trace li').count()` _(expression)_
- `a retracted verdict stays retracted when the abandoned run finishes animating` — e2e/claims.spec.ts:683
    - :686 `toHaveClass` expected `/indicator--idle/` _(regex)_
    - :691 `toHaveClass` expected `/indicator--idle/` _(regex)_
    - :692 `toHaveCount` expected `0` _(literal)_
    - :693 `toHaveCount` expected `0` _(literal)_
    - :694 `toContainText` expected `'Idle.'` _(literal)_
    - :700 `toHaveClass` expected `/indicator--idle/` _(regex)_
    - :702 `toHaveClass` expected `/indicator--idle/` _(regex)_
    - :703 `toHaveCount` expected `0` _(literal)_
    - :704 `toHaveText` expected `'Protocol under test: Naive Diffie-Hellman'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Protocol Checker

**Dolev-Yao symbolic analysis · automated attack discovery**

A protocol you believe is correct, handed to a symbolic model checker that returns the exact message sequence that breaks it — found by searching, not by being told.

> Not production crypto — a teaching demo. The symbolic engine and the attacks it finds are real, but the model is a deliberate abstraction. See **What Can Go Wrong** for exactly what it does and does not prove.

## What It Is

The **Dolev-Yao model** (1983) treats every message as a *term* — a tree of names, nonces, keys, pairs, and encryptions — and cryptography as *perfect*: an encryption `{m}_k` is an opaque box that opens only with the matching key. The attacker owns the network. It intercepts every message and can send anything it can assemble from what it has seen (forward, split apart, re-encrypt with keys it holds) — but it cannot guess a nonce or open a ciphertext addressed to someone else.

Under that model, a protocol is secure only if — across every interleaving of sessions and every message the attacker can compose — no secret ever reaches it. That is a reachability question over an unbounded state space, so we bound it and let a machine enumerate. This lab hand-rolls the whole engine so every part is inspectable:

- **`src/symbolic/terms.ts`** — the term algebra and the one modelled equation (`g^ab = g^ba`).
- **`src/symbolic/unify.ts`** — first-order unification with occurs-check (how a role matches an incoming message).
- **`src/symbolic/intruder.ts`** — the attacker: analysis (`DEC`, `SPLIT`) and synthesis (`PAIR`, `ENC`, `SIGN`, `DH`, `KDF`, `FWD`), each a named rule.
- **`src/symbolic/search.ts`** — the bounded reachability search (breadth-first, deterministic).

The headline result is **Lowe's 1995 attack on Needham-Schroeder Public Key**, rediscovered live: the machine is told the protocol and the goal, never the attack.

**Security model:** symbolic / perfect-cryptography, bounded sessions, in the ProVerif/Tamarin lineage — *not* a computational (provable-security) analysis. **Not production tooling.**

## Exhibits

1. **The checker.** Pick a protocol, press Run, and watch the real search either return an attack trace or exhaust the space. The explored-state counter is the true number of reachable states visited; the bound is shown.
2. **Verdict separation.** Two independent indicators. *Cryptographic primitive: perfect — unbroken* (the maths never breaks in this model) sits beside *Security verdict: ATTACK FOUND / no attack in bound*. A forged-but-accepted outcome reads as **alarm**, never green — colour tracks system integrity, not the raw return value.
3. **The Lowe attack, discovered live.** Load Needham-Schroeder Public Key, set the goal "can the attacker learn Nb?", and run. The trace comes back:

   `​``
   A → M : {Na, A}_pkM     A honestly starts a session with M
   M → B : {Na, A}_pkB     M replays it to B, impersonating A
   B → M : {Na, Nb}_pkA    B responds, believing it is A
   M → A : {Na, Nb}_pkA    M forwards it; A accepts, it is addressed to her
   A → M : {Nb}_pkM        A hands M the nonce
   `​``
4. **The two-session diagram.** The trace, redrawn as three lanes — honest initiator, attacker, honest responder — with each message tinted by which of the attacker's *two* sessions it belongs to. You watch M forward the same opaque ciphertext out of one session and into the other, and the deceived party's belief ("believes peer = A · actually M") is shown in alarm. Synced to the stepper.
5. **The fix, in one edit.** Tick *"Message 2 includes the responder's identity B"* — Lowe's 1995 repair — and re-run the identical search. No trace found; the verdict explains *why* the relay now fails. One field closes a seventeen-year-old flaw.
6. **The attacker-knowledge panel.** Step through the trace and watch the attacker's known-term set grow. Every term names the rule that derived it (`intercept`, `DEC`, `SPLIT`, …), and the leaked goal is flagged — so nothing here is magic; every deduction is auditable.
7. **Visible search work.** The status line reports the real numbers: reachable states explored, candidate attacker injections weighed, and interleaving depth — evidence the attack was *enumerated*, not scripted. An expandable note lays out the state, the transition relation, and the deduction rules for the curious.
8. **The protocol library.** Needham-Schroeder PK (attack), Needham-Schroeder-Lowe (secure in bound), Naive Diffie-Hellman (MITM found), Signed Diffie-Hellman (secure in bound), and a toy Kerberos entry that links to the sibling **crypto-lab-kerberos** lab rather than rebuilding it.
9. **The honesty panel.** Up top, not buried: this checker assumes perfect cryptography, so "no attack found" means only "no attack in this model, within this bound." It links the side-channel and implementation labs whose attacks it structurally cannot see.

## When to Use It

- To build intuition for **why symbolic analysis matters**: it searches the attack space you did not think of.
- To see the **precise distinction** between a protocol-logic flaw and a broken cipher — the cipher never breaks here.
- **Do NOT** use it to conclude a real protocol is secure. "No attack in bound" is not a proof, and the perfect-crypto abstraction hides entire attack classes (timing, padding, key recovery, implementation bugs). For those, see the linked labs.

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-protocol-checker/**

Run the Needham-Schroeder search, read the attack trace, step the knowledge panel to watch the attacker derive `Nb`, then tick the Lowe fix and re-run to watch the attack vanish. Switch to Diffie-Hellman and toggle signatures to see the same story for key exchange.

## What Can Go Wrong

The model is an abstraction, and its limits are the point of the lab:

- **Perfect cryptography.** Encryption is opaque — no key recovery, no algebraic leakage, no side channels, no timing, no implementation bugs. Every attack in [timing-oracle](https://systemslibrarian.github.io/crypto-lab-timing-oracle/), [power-trace](https://systemslibrarian.github.io/crypto-lab-power-trace/), [kem-trap](https://systemslibrarian.github.io/crypto-lab-kem-trap/), and [padding-oracle](https://systemslibrarian.github.io/crypto-lab-padding-oracle/) is invisible to this checker.
- **Bounded search.** A finite number of sessions and states is explored; the bound is displayed. "No attack found" is always relative to it.
- **One equation only.** The single algebraic property modelled is `g^ab = g^ba` (a canonical unordered DH key). No XOR, no partial-DH unification, no broader equational theory.
- **Not provable security.** Symbolic analysis and computational (game-hopping) proofs are different disciplines; neither subsumes the other. CryptoVerif is the tool on the computational branch.

## Real-World Usage

The Dolev-Yao model underpins the industrial protocol verifiers **ProVerif** and **Tamarin**, which have been used to analyse TLS 1.3, Signal, WireGuard, EMV, and 5G-AKA — repeatedly finding real flaws before deployment. Lowe's 1995 discovery, using the FDR model checker, is the founding example this lab reproduces. This demo is a miniature, hand-rolled engine in that lineage, built for transparency rather than scale.

## How to Run Locally

`​``bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest unit tests + spec KATs
npm run build      # typecheck + production build
npm run preview    # serve the production build on :4317
npm run test:a11y  # axe-core WCAG 2.1 AA gate, both themes (needs a build first)
`​``

## Related Demos

- [crypto-lab-diffie-hellman-mitm](https://systemslibrarian.github.io/crypto-lab-diffie-hellman-mitm/) — the DH man-in-the-middle, broken by hand; here a machine finds it.
- [crypto-lab-kerberos](https://systemslibrarian.github.io/crypto-lab-kerberos/) — carries a hand-built Lowe-style reflection panel.
- [crypto-lab-padding-oracle](https://systemslibrarian.github.io/crypto-lab-padding-oracle/) · [crypto-lab-timing-oracle](https://systemslibrarian.github.io/crypto-lab-timing-oracle/) — attacks this symbolic model structurally cannot see.

## Build & Verify

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for a one-page definition of the state transition system, the term algebra, and the attacker's deduction rules.

- **Unit, invariant & KAT tests: 52** (Vitest, colocated `src/**/*.test.ts`), run in CI before every deploy — including randomized property tests for unification soundness, analysis monotonicity, DH-key commutativity, search determinism, and bound-monotonicity, plus engine-derived repair-diagnostic checks.
- **Spec KATs: 4** — the published known answers, reproduced by *search*, not script (`src/symbolic/search.test.ts`):
  1. **Needham-Schroeder Public Key → Lowe's attack found**, matching the five-message prefix of Lowe's six-message interleaving, up to the point the attacker holds `Nb` (Lowe, 1995).
  2. **Needham-Schroeder-Lowe → no attack**, state space fully exhausted.
  3. **Naive Diffie-Hellman → MITM found** (the attacker learns the secret sent under the "shared" key).
  4. **Signed Diffie-Hellman → no attack**, a substituted share fails signature verification.
- **Accessibility gate:** `@axe-core/playwright` scans the production build for zero WCAG 2.1 A/AA violations in **both** themes, driving the full demo (attack, fix, DH, Kerberos link) so every dynamic region is scanned. The GitHub Pages deploy is blocked on any violation.

## Performance

The search is deterministic breadth-first over a small bounded scenario; every protocol resolves in a few thousand states and single-digit milliseconds. The explored-state counter animates the real count (respecting `prefers-reduced-motion`).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Syndrome Hints

- **slug**: `crypto-lab-syndrome-hints`
- **repo**: https://github.com/systemslibrarian/crypto-lab-syndrome-hints
- **live**: https://systemslibrarian.github.io/crypto-lab-syndrome-hints/
- **commit_sha**: `72d954dbc3133db0684e766d0b1284be1b941646` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS | POST-QUANTUM  ·  **level**: advanced  ·  **--accent**: #d98a2b
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: Syndrome Hints  — _read from index.html_

**Subtitle**: Hint-ISD · IACR ePrint 2026/341  — _read from index.html_

**Description**: Runs a real information-set-decoding attack on an F₂ syndrome-decoding instance and slides its work factor from exponential toward polynomial as leaked "hints" accumulate — you add the hints and watch the curve collapse.  — _read from index.html_

**Why it matters**: Code-based schemes like Classic McEliece and HQC bet their security on syndrome decoding being hard. A side channel that leaks coordinates of the secret error can turn that hard problem soft — and the whole budget is the error weight itself: reveal about w coordinates and the search collapses to polynomial time, whatever the code length.  — _read from index.html_

**Card copy**: Run Prange and Stern information-set decoding on toy syndrome instances, add leaked hints, and watch the modeled work factor fall. The cited McEliece and HQC weights have different roles and do not yield a real-scheme security ranking here.

**Chips**: Hint-ISD · Prange · Stern · Syndrome Decoding

**Implements**: Information-set decoding `src/sdp/isd.ts:86`, Stern decoding `src/sdp/stern.ts:196`

**Attacks shown**: Side-channel (unspecified) `src/main.ts:835`

**Comment-only (named in code comments, not executed)**: Classic McEliece `src/sdp/schemes.ts:2`, Hamming code `src/sdp/instance.ts:16`, HQC `src/sdp/schemes.ts:2`

**References**: Classic McEliece, HQC, Hamming code

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `Crypto 2008` — first seen src/main.ts:1028 (2×)
- `ePrint 2021/279` — first seen README.md:32 (6×)
- `ePrint 2026/341` — first seen README.md:3 (6×)
- `eprint.iacr.org/2021/279` — first seen README.md:32 (2×)
- `eprint.iacr.org/2026/341` — first seen README.md:34 (2×)
- `Eurocrypt ’21` — first seen src/main.ts:610 (2×)

**README — What Can Go Wrong**:

```text
- **Reading it as a break or a security proof.** This toy demonstrates
  *leakage-assisted* decoding, not a break or a security proof of Classic McEliece
  or HQC. With no hints, it returns to baseline decoding search. Preventing the
  modeled leakage addresses this channel; other attacks and implementation
  assumptions require separate analysis.
- **Over-trusting a single run.** One ISD run is a random draw around the expected
  work; the demo averages several so the measured dot sits near the curve, and it
  says so.
- **Confusing model with measurement.** The perfect-hint attack is executed; the
  work-factor curve and the approximate-hint discount are transparent **models**,
  labelled where shown.
- **Assuming faults always help maximally.** The slider leaks *informative*
  (support) coordinates; faults that hit zeros help less. The `≈ w` bound is the
  best case.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Syndrome Hints

**Hint-ISD · IACR ePrint 2026/341** — a browser demo that runs a *real*
information-set-decoding (ISD) attack on a syndrome-decoding instance over F₂ and
slides its work factor from **exponential (no hints)** toward **polynomial (enough
hints)** as leaked side-channel "hints" accumulate. You add the hints; the curve
collapses; the attack actually runs and verifies its answer.

> Not production crypto — a teaching demo. It attacks small but genuine F₂
> instances; it runs no real Classic McEliece or HQC key recovery.

## What It Is

Code-based post-quantum schemes (**Classic McEliece**, **HQC**) rest on the
**syndrome-decoding problem (SDP)**: given a public parity-check matrix `H` and a
syndrome `s = H·e`, recover the low-weight error vector `e`. With no side
information the best known attacks (the **ISD** family — Prange, Stern, MMT,
BJMM) cost exponential time.

The **Hint-ISD** result (D'Achille, Esser, Kraus, ePrint 2026/341) asks what
happens when the secret error partially leaks — through a **fault** or a **side
channel**. Each leaked hint turns the problem into **soft-decision decoding**, and
the work factor slides smoothly from exponential toward polynomial.

### Which hint channel this demo implements

There are two distinct hint channels in this literature, and this demo implements
one of them:

| Channel | What leaks | Source | Here? |
| --- | --- | --- | --- |
| **Known error locations** | the exact value of an error coordinate `e_i` — the attacker learns *where the error is* | Horlemann, Puchinger, Renner, Schamberger, Wachter-Zeh, *Information-Set Decoding with Hints*, [ePrint 2021/279](https://eprint.iacr.org/2021/279) | **implemented and executed** (the perfect-hint slider) |
| **Known subblock Hamming weights** | a noisy weight reading over a block of coordinates | same paper (template attacks) | **modelled** (the approximate-hint panel) |
| **Syndrome entries over the integers** | a fault suppresses the modular reduction, so the attacker reads integer-valued *syndrome* components — Hint-ISD's "perfect hints" | Cayrel et al., Eurocrypt '21, as described in [ePrint 2026/341](https://eprint.iacr.org/2026/341) | **cited as related work, not simulated** |

The third row is a genuinely different channel from the first: syndrome
components are not error positions, and this demo neither leaks nor models them.

> **Scope note (Adapted).** The slider leaks the *informative* (support)
> coordinates, so the "≈ w hints to polynomial" bound is this leakage model's
> best case rather than a verbatim restatement of Hint-ISD's general result.
> Treat that bound and the McEliece-vs-HQC panel as illustrations of the
> *mechanism*, not reproductions of the paper's quantitative results.

The best-known classical attacks form the **ISD family** — of which **Prange**
and **Stern** are implemented here as two selectable real solvers, while **MMT**
and **BJMM** are named as further refinements but are *not* implemented.

This demo makes that concrete:

- **Real crypto.** `src/sdp/` hand-rolls the F₂ linear algebra, builds genuine
  SDP instances (`H`, `s`, planted low-weight `e`), and runs **two real ISD
  solvers** — Prange (`src/sdp/isd.ts`) and Stern (`src/sdp/stern.ts`) — each of
  which recovers `e` and **verifies `H·e = s`**. Stern performs a genuine
  birthday/collision search over the information set, not a Prange loop renamed.
  The perfect-hint path is executed for both, not simulated.
- **Security model.** The attacker sees only `(H, s)` plus whatever hints you
  leak. Nothing is persisted; every instance is generated per session from a seed.
- **What it recovers.** The **error vector `e`** — *not* a decryption forgery or a
  full key. That distinction is stated throughout the UI.

## Exhibits

1. **Break it yourself** — a real **algorithm selector (Prange | Stern)** drives
   which genuine solver runs. Leak coordinates of the true error with the
   perfect-hint slider (the error vector is shown from the **attacker's view** —
   `?` for unknown, `🔓` for leaked — with an optional "show planted truth"), then
   press **Run**, **Run both**, or **Reset**. Each run is 15 seeded attacks; a
   **comparative results table** records the median work with a p10–p90 spread,
   the median permutations, and the `H·e = s` verification for every run.
2. **Watch it collapse** — the headline chart: **two real work-factor curves**
   (Prange and Stern) versus hint count. The vertical gap is the algorithm
   advantage; sliding right is the hint axis. Both fall to the polynomial floor
   once the support is known, with the **measured medians** of your runs overlaid
   as dots (and an accessible data table of every value).
3. **Inspect the instance** — the real `H` (`40×64`) and syndrome `s` you just
   attacked; an optional hand-decode exercise lets you flip a candidate `e` and
   watch `H·e` get compared, bit for bit, against `s`.
4. **Approximate hints (model)** — the soft-decision recasting of a noisy
   Hamming-weight leak, with a noise slider and the information-gain formula.
5. **McEliece vs HQC** — the error-weight *mechanism* on two toys: a lower-weight
   error reaches polynomial time after fewer informative support hints, and the
   code length does not enter this bound. Illustrative, not a scaled model of
   the real schemes. McEliece's quoted Level-1 injected error has weight `t=64`;
   the [HQC team's 12 October 2026 specification, Table 8](https://pqc-hqc.org/doc/hqc_specifications_2026_10_12.pdf)
   sets each HQC-1 sparse *secret vector* to `ω=67`, up from 66. Substitution
   into the toy rule produces 64 versus 67 hints, but these weights have
   different roles: HQC's decoder sees `x·r₂ − r₁·y + e`, not an error of weight
   67. The browser result is not a real-scheme security ranking.
6. **Reference** — the exact Prange and Stern work-factor formulas, the explicit
   hint-count-to-polynomial bound (`≈ w`), and the sources. See also
   [METHODOLOGY.md](METHODOLOGY.md) for the full claim → source → code → test → UI
   trace.

## When to Use It

- **Use it** to teach why code-based security depends on the *secrecy of the whole
  error*, and how fault/side-channel leakage — not a break of the math — degrades
  it; and to build intuition for why the error weight, not the code length, is
  what an error-location leak has to burn through.
- **Do NOT use it** as an attack tool or a security estimate for real parameters.
  The runnable instances are tiny by design; the real Level-1 numbers are quoted
  as facts, not reproduced.

## Live Demo

<https://systemslibrarian.github.io/crypto-lab-syndrome-hints/>

Drag the hint slider, run the real attack, and compare the measured red dot to the
modelled orange curve. The dark interface is covered by the AA accessibility
gate at both desktop and phone widths.

## What Can Go Wrong

- **Reading it as a break or a security proof.** This toy demonstrates
  *leakage-assisted* decoding, not a break or a security proof of Classic McEliece
  or HQC. With no hints, it returns to baseline decoding search. Preventing the
  modeled leakage addresses this channel; other attacks and implementation
  assumptions require separate analysis.
- **Over-trusting a single run.** One ISD run is a random draw around the expected
  work; the demo averages several so the measured dot sits near the curve, and it
  says so.
- **Confusing model with measurement.** The perfect-hint attack is executed; the
  work-factor curve and the approximate-hint discount are transparent **models**,
  labelled where shown.
- **Assuming faults always help maximally.** The slider leaks *informative*
  (support) coordinates; faults that hit zeros help less. The `≈ w` bound is the
  best case.

## Real-World Usage

The lineage is live cryptographic-engineering concern: fault attacks (Cayrel et
al., leaking syndrome entries over the integers) and template/power-analysis
attacks against code-based KEM implementations (leaking error locations and
subblock weights — the channel this demo runs) motivate constant-time decoders,
fault-detection, and masking. Hint-ISD quantifies
how much a given amount of leakage is worth to an attacker — directly relevant to
Classic McEliece and HQC as they move through standardisation.

## How to Run Locally

`​``bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest unit tests + spec KATs
npm run build      # tsc --noEmit && vite build
npm run test:a11y  # browser claims + axe-core WCAG gate, dark theme at two widths
`​``

## Related Demos

- [crypto-lab-syndrome-drain](https://systemslibrarian.github.io/crypto-lab-syndrome-drain/) — multi-instance (DOOM) degradation of code-based KEMs
- [crypto-lab-mceliece-gate](https://systemslibrarian.github.io/crypto-lab-mceliece-gate/) — Classic McEliece up close
- [crypto-lab-hqc-vault](https://systemslibrarian.github.io/crypto-lab-hqc-vault/) — HQC's quasi-cyclic structure
- [crypto-lab-lwe-hints](https://systemslibrarian.github.io/crypto-lab-lwe-hints/) — the lattice analogue: LWE with hints

## Build & Verify

- **Unit tests:** 62 Vitest tests across `src/sdp/*.test.ts`, run in CI before every
  deploy. This includes **16 spec known-answer tests** for the [7,4] Hamming code:
  9 syndrome KATs (`src/sdp/instance.test.ts`) — every single-bit error has syndrome
  equal to its position's binary value, plus zero-syndrome and XOR-linearity — and
  **7 Stern decoding KATs** (`src/sdp/stern.test.ts`), where Stern recovers each
  canonical single-bit error of the Hamming code.
- **Correctness embodied:** the Prange and Stern tests confirm each real attack
  recovers `e` with `H·e = s` verified, that full support leakage collapses the
  search to 0 iterations (polynomial), and that Stern's measured work is genuinely
  **lower than Prange's** on the same instance.
- **Cross-checked against ground truth:** `src/sdp/adversarial.test.ts` compares both
  solvers to **exhaustive minimum-weight decoding** on tiny instances, round-trips the
  hint reduction/reconstruction, checks fail-closed behaviour on contradictory hints,
  and **calibrates** the measured medians against the work model over a grid of
  Gilbert–Varshamov-bound instances (Prange within ~2 bits; Stern's model a mild
  conservative over-estimate).
- **Work-factor model:** `src/sdp/workfactor.test.ts` checks both curves are
  monotone in hints, hit the polynomial floor, and that Stern's model stays below
  Prange until both converge.
- **Behaviour gate:** `e2e/behavior.spec.ts` asserts the scientific contract in a
  real browser — the selected algorithm actually runs, results verify `H·e = s`, the
  two sliders stay in sync, Run both/Reset work, and there is no horizontal overflow
  at a 375 px phone width.
- **Implemented algorithms:** Prange and Stern only. MMT and BJMM are named as
  further ISD refinements but are not implemented.
- **Accessibility gate:** `@axe-core/playwright` scans the production build for zero
  WCAG 2.1 A/AA violations in the supported **dark** theme at desktop and phone
  widths; it drives every panel into its post-interaction state (both solvers,
  the run table, the attacker/planted views,
  all details) first. The GitHub Pages deploy is blocked on any violation.

## Performance

The instance is an honestly-labelled toy at the **Gilbert–Varshamov bound**
(`n = 64`, `k = 24`, `w = 11`) — the planted error is essentially the unique
low-weight solution, so the work model is faithful, and it is sized so Prange
visibly struggles where Stern does not. Both real solvers finish in a few
milliseconds on a desktop browser. All computation is in the browser — no
backend, no network calls.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Encrochat

- **slug**: `crypto-lab-encrochat`
- **repo**: https://github.com/systemslibrarian/crypto-lab-encrochat
- **live**: https://systemslibrarian.github.io/crypto-lab-encrochat/
- **commit_sha**: `777096d1ace8fcda6ec3576608c135aa998b76cd` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS | PROTOCOLS  ·  **level**: advanced  ·  **--accent**: #5a8f7b
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Encrochat  — _read from src/main.ts_

**Subtitle**: Endpoint Compromise · eprint 2026/1319  — _read from src/main.ts_

**Description**: Run a real (in-order) Signal-protocol Double Ratchet exchange, watch the wire stay opaque, then deploy an endpoint implant and see it read the plaintext the cryptography just protected perfectly.  — _read from src/main.ts_

**Why it matters**: In 2020, Encrochat  — _read from src/main.ts_

**Card copy**: A real Double Ratchet exchange with a genuinely opaque wire, then a modelled endpoint implant reads the plaintext anyway. The cryptography held; it did not matter.

**Chips**: Double Ratchet · X25519 · AES-256-GCM · Endpoint Implant

**Implements**: AES `src/crypto/primitives.ts:107`, AES-GCM `src/crypto/primitives.ts:107`, Diffie-Hellman `src/crypto/double-ratchet.ts:160`, Double Ratchet `src/crypto/double-ratchet.ts:177`, ECDSA `src/endpoint/architecture.ts:18`, HKDF `src/crypto/primitives.ts:85`, HMAC `src/crypto/primitives.ts:66`, P-256 `src/endpoint/architecture.ts:7`, SHA-256 `src/crypto/primitives.ts:66`, X25519 `src/crypto/x25519.ts:28`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: X3DH `src/crypto/double-ratchet.ts:19`

**References**: Ed25519, X3DH

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `eprint 2026/1319` — first seen README.md:3 (4×)
- `RFC 4231` — first seen README.md:21 (2×)
- `RFC 5869` — first seen README.md:20 (3×)
- `RFC 7748` — first seen README.md:19 (5×)

**README — What Can Go Wrong**:

```text
The lab is a catalogue of the failure it teaches:

- **Compromised endpoint → total loss of confidentiality.** Plaintext is read before
  encryption and after decryption; forward secrecy and a perfect cipher are irrelevant.
- **Concentrated trust → compromise scales.** Shared administrative access can give one compromise every signing authority. Separate operator names do not contain that compromise unless independently enforced permissions change. The exhibit requires both vendor and update-approval signatures; routing-server control alone cannot authorize installation in independent mode.
- **Misreading the guarantee.** "End-to-end encrypted" describes the channel. It says
  nothing about who controls the ends.
```

**Claims tested** (e2e/claims.spec.ts, 13 test(s)):

- `the wire's byte counters are internally consistent and match the plaintext` — e2e/claims.spec.ts:130
    - :143 `toBe` expected `HEADER_BYTES` _(expression)_
    - :144 `toBe` expected `TAG_BYTES` _(expression)_
    - :146 `toBe` expected `utf8Len` _(expression)_
    - :148 `toBe` expected `w.totalBytes` _(expression)_
    - :151 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :152 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :153 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :154 `toBe` expected `w.headerBytes * 2` _(expression)_
    - :155 `toBe` expected `w.bodyBytes * 2` _(expression)_
    - :156 `toBe` expected `w.tagBytes * 2` _(expression)_
    - :159 `expect` expected _no expected value_ _(none)_
- `the wire is opaque: plaintext never appears in the packet, and a repeated message never repeats its ciphertext` — e2e/claims.spec.ts:165
    - :175 `expect` expected _no expected value_ _(none)_
    - :178 `expect` expected _no expected value_ _(none)_
    - :187 `toBe` expected `first.bodyBytes` _(expression)_
    - :188 `toBe` expected `first.bodyHex` _(expression)_
    - :189 `toBe` expected `first.tagHex` _(expression)_
- `the ratchet strip turns once per message, with a distinct key each time, and matches the wire header` — e2e/claims.spec.ts:194
    - :216 `toBe` expected `await bubbleCount(page)` _(expression)_
    - :217 `toBe` expected `4` _(literal)_
    - :221 `toBe` expected `fps.length` _(expression)_
    - :222 `toMatch` expected `/^[0-9a-f]{6}$/` _(regex)_
    - :226 `toEqual` expected `["A", "A", "B", "A"]` _(expression)_
    - :227 `toMatch` expected `/DH step/` _(regex)_
    - :228 `toMatch` expected `/chain \+1/` _(regex)_
    - :229 `toMatch` expected `/msg 1$/` _(regex)_
    - :230 `toMatch` expected `/DH step/` _(regex)_
    - :234 `toMatch` expected `new RegExp('msg ${wires[i].n}$')` _(expression)_
    - :240 `toBe` expected `dhOf(wires[0])` _(expression)_
    - :241 `toBe` expected `dhOf(wires[1])` _(expression)_
    - :242 `toBe` expected `dhOf(wires[2])` _(expression)_
    - :244 `toBe` expected `2` _(literal)_
- `the encryption verdict counts the messages actually on screen` — e2e/claims.spec.ts:249
    - :253 `expect` expected _no expected value_ _(none)_
    - :254 `expect` expected _no expected value_ _(none)_
    - :255 `expect` expected _no expected value_ _(none)_
    - :256 `toBe` expected `"AWAITING EVIDENCE"` _(literal)_
    - :260 `expect` expected _no expected value_ _(none)_
    - :261 `toMatch` expected `/^1 of 1 message authenticated/` _(regex)_
    - :265 `toBe` expected `5` _(literal)_
    - :268 `expect` expected _no expected value_ _(none)_
    - :272 `expect` expected _no expected value_ _(none)_
    - :273 `toBe` expected `total` _(expression)_
    - :274 `toBe` expected `total` _(expression)_
    - :275 `expect` expected _no expected value_ _(none)_
    - :276 `toBe` expected `"SECURE UNDER THIS LAB'S ASSUMPTIONS"` _(literal)_
    - :277 `toMatch` expected `/Every delivered message authenticated/` _(regex)_
    - :278 `toHaveText` expected `""` _(literal)_
- `the two axes stay independent: an implant flips the system verdict while encryption stays sound` — e2e/claims.spec.ts:281
    - :287 `expect` expected _no expected value_ _(none)_
    - :288 `expect` expected _no expected value_ _(none)_
    - :292 `toHaveAttribute` expected `"aria-pressed", "true"` _(expression)_
    - :296 `expect` expected _no expected value_ _(none)_
    - :297 `expect` expected _no expected value_ _(none)_
    - :299 `expect` expected _no expected value_ _(none)_
    - :300 `expect` expected _no expected value_ _(none)_
    - :301 `expect` expected _no expected value_ _(none)_
    - :302 `toBe` expected `"SYSTEM COMPROMISED"` _(literal)_
    - :303 `toMatch` expected `/Encryption held; the endpoint did not/` _(regex)_
    - :304 `toMatch` expected `/never needed a key/i` _(regex)_
- `the banner never claims the encryption held before a single tag has verified` — e2e/claims.spec.ts:307
    - :316 `toBe` expected `0` _(literal)_
    - :318 `expect` expected _no expected value_ _(none)_
    - :319 `toBe` expected `"SYSTEM COMPROMISED"` _(literal)_
    - :320 `expect` expected _no expected value_ _(none)_
    - :321 `toMatch` expected `/encryption held/i` _(regex)_
    - :322 `toMatch` expected `/untested/i` _(regex)_
    - :327 `expect` expected _no expected value_ _(none)_
    - :328 `toMatch` expected `/Encryption held/` _(regex)_
- `the implant harvests plaintext at both ends while the wire is byte-for-byte unchanged` — e2e/claims.spec.ts:333
    - :341 `toBe` expected `0` _(literal)_
    - :350 `toBe` expected `cleanWire.headerBytes` _(expression)_
    - :351 `toBe` expected `cleanWire.bodyBytes` _(expression)_
    - :352 `toBe` expected `cleanWire.tagBytes` _(expression)_
    - :353 `toBe` expected `cleanWire.totalBytes` _(expression)_
    - :355 `toBe` expected `cleanWire.bodyHex` _(expression)_
    - :356 `expect` expected _no expected value_ _(none)_
    - :366 `toBe` expected `2` _(literal)_
    - :367 `toBe` expected `"alice · pre-encryption"` _(literal)_
    - :368 `toBe` expected `"bob · post-decryption"` _(literal)_
    - :369 `toEqual` expected `[payload, payload]` _(expression)_
    - :374 `toHaveAttribute` expected `"aria-pressed", "false"` _(expression)_
    - :375 `toBe` expected `0` _(literal)_
    - :377 `expect` expected _no expected value_ _(none)_
    - :378 `expect` expected _no expected value_ _(none)_
- `the keyless wiretap fails, says why, and leaves the session untouched` — e2e/claims.spec.ts:383
    - :388 `toBeDisabled` expected _no expected value_ _(none)_
    - :395 `toBeEnabled` expected _no expected value_ _(none)_
    - :401 `toContainText` expected `"Wiretap failed"` _(literal)_
    - :402 `toContainText` expected `"🔒"` _(literal)_
    - :404 `toContainText` expected `"AES-256-GCM authentication failed"` _(literal)_
    - :405 `toContainText` expected `"message key"` _(literal)_
    - :406 `toContainText` expected `"leaks only its length"` _(literal)_
    - :407 `toContainText` expected `"should never happen"` _(literal)_
    - :408 `toHaveText` expected `""` _(literal)_
    - :411 `toEqual` expected `before` _(expression)_
    - :412 `toEqual` expected `wireBefore` _(expression)_
- `the forged packet is rejected, the authentic one still decrypts, and the flipped byte lands in the ciphertext` — e2e/claims.spec.ts:415
    - :429 `expect` expected _no expected value_ _(none)_
    - :430 `expect` expected _no expected value_ _(none)_
    - :432 `toMatch` expected `/rejected the forged packet/i` _(regex)_
    - :433 `toMatch` expected `/rejection commits no state/i` _(regex)_
    - :434 `toMatch` expected `/authentic packet still decrypted/i` _(regex)_
    - :440 `toBe` expected `true` _(expression)_
    - :441 `expect` expected _no expected value_ _(none)_
    - :442 `expect` expected _no expected value_ _(none)_
    - :445 `toEqual` expected `before` _(expression)_
    - :446 `toHaveText` expected `""` _(literal)_
- `the scripted stepper runs exactly four messages, then stops` — e2e/claims.spec.ts:451
    - :454 `toBeEnabled` expected _no expected value_ _(none)_
    - :456 `toBe` expected `4` _(literal)_
    - :457 `toBeDisabled` expected _no expected value_ _(none)_
    - :463 `toEqual` expected `["Alice", "Alice", "Bob", "Alice"]` _(expression)_
    - :465 `toBe` expected `0` _(literal)_
- `an empty compose is a no-op, and reset returns the session to no-evidence` — e2e/claims.spec.ts:468
    - :474 `toBe` expected `0` _(literal)_
    - :475 `toHaveText` expected `""` _(literal)_
    - :479 `toBe` expected `3` _(literal)_
    - :484 `toBe` expected `0` _(literal)_
    - :485 `toBe` expected `0` _(literal)_
    - :486 `toBe` expected `0` _(literal)_
    - :487 `toHaveText` expected `""` _(literal)_
    - :488 `toBeVisible` expected _no expected value_ _(none)_
    - :489 `toBeDisabled` expected _no expected value_ _(none)_
    - :490 `toBeEnabled` expected _no expected value_ _(none)_
    - :493 `expect` expected _no expected value_ _(none)_
    - :494 `expect` expected _no expected value_ _(none)_
    - :495 `expect` expected _no expected value_ _(none)_
    - :496 `toBe` expected `"AWAITING EVIDENCE"` _(literal)_
    - :500 `toBe` expected `4` _(literal)_
- `reset keeps a deployed implant deployed, and the verdicts follow` — e2e/claims.spec.ts:503
    - :508 `toBe` expected `2` _(literal)_
    - :514 `toBe` expected `0` _(literal)_
    - :515 `toBe` expected `0` _(literal)_
    - :516 `toHaveAttribute` expected `"aria-pressed", "true"` _(expression)_
    - :518 `expect` expected _no expected value_ _(none)_
    - :519 `expect` expected _no expected value_ _(none)_
    - :520 `toBe` expected `"SYSTEM COMPROMISED"` _(literal)_
    - :521 `expect` expected _no expected value_ _(none)_
- `operator separation requires independent approvals, and cannot cure an implant` — e2e/claims.spec.ts:525
    - :531 `toContainText` expected `'Attacker update: BLOCKED'` _(literal)_
    - :532 `toContainText` expected `'plaintext not captured'` _(literal)_
    - :534 `toContainText` expected `'Previous results retired'` _(literal)_
    - :536 `toContainText` expected `'Attacker update: INSTALLED'` _(literal)_
    - :537 `toContainText` expected `'alice: plaintext CAPTURED; message tag VERIFIED'` _(literal)_
    - :538 `toContainText` expected `'bob: plaintext CAPTURED; message tag VERIFIED'` _(literal)_
    - :542 `toContainText` expected `'Attacker update: INSTALLED'` _(literal)_
    - :546 `toContainText` expected `'Attacker update: BLOCKED'` _(literal)_
    - :547 `toContainText` expected `'alice: plaintext CAPTURED; message tag VERIFIED'` _(literal)_
    - :548 `toContainText` expected `'bob: plaintext not captured'` _(literal)_
    - :549 `toContainText` expected `'Separating operators cannot remove an implant'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Encrochat

**Endpoint Compromise · eprint 2026/1319**

A browser lab that reconstructs how the Encrochat encrypted messenger was defeated
in 2020 — not by breaking its cryptography, but by compromising the endpoint. It
runs a **real (in-order) Signal-protocol Double Ratchet** exchange, shows that the
wire is genuinely opaque, then deploys a modelled endpoint implant that reads the
plaintext the cryptography just protected perfectly. The primitive held. It did not
matter.

> **This is a teaching demo, not production cryptography.** It runs real crypto and
> passes spec known-answer tests, but do not use it to protect real secrets.

## What It Is

The exact primitives running in your browser:

- **X25519** Diffie–Hellman (RFC 7748) — the ratchet's asymmetric step.
- **HKDF-SHA256** (RFC 5869) — the root-key KDF.
- **HMAC-SHA256** (RFC 4231) — the symmetric-chain KDF.
- **AES-256-GCM** — authenticated message encryption, header bound as associated data.
- The **Double Ratchet** itself (Perrin & Marlinspike, 2016) — hand-rolled and
  inspectable in `src/crypto/double-ratchet.ts`, because the ratchet is the subject.

The security model on display is the one the lab exists to teach: **end-to-end
encryption secures the channel between two endpoints, not the endpoints themselves.**
When code runs on the device, plaintext is readable before it is ever encrypted and
after it is decrypted — and no amount of sound cryptography changes that. Security is
a property of the whole system, not of one algorithm. Based on the public account in
Albrecht, Park, Specter & Stebila, *"A Real-World Law-Enforcement Hack: The Case of
Encrochat"* (eprint 2026/1319). **Not production crypto.**

## Exhibits

1. **A real Double Ratchet, and what the network sees** — send a scripted exchange or
   compose your own. The left pane is the plaintext conversation on the devices; the
   right pane is the exact AES-256-GCM bytes an on-path eavesdropper captures. A
   ratchet strip shows a fresh key per message and marks each DH step (`⟳`) versus a
   symmetric-only advance (`chain +1`).
2. **Break it yourself** — attempt a keyless wiretap of the captured packet (fails), or
   run an isolated real exchange, flip one ciphertext bit, and watch the recipient
   reject the forgery **while the authentic packet still decrypts**. Rejection commits
   no ratchet state: the wire has integrity, not just secrecy.
3. **The endpoint pivot** — deploy an implant on the devices and send a message. It
   never sees a key and never touches a ciphertext; it reads the plaintext the app
   already holds. The wire and the cipher are unchanged — the plaintext leaks anyway.
4. **Two verdicts, one that decides** — *Message encryption* and *Endpoint integrity*
   are independent axes, each derived from observed evidence (tag verifications and
   whether an implant is deployed), starting neutral rather than green. The system
   banner tracks the weakest link, so sound encryption on a compromised device reads
   as an alarm, not a success.
5. **When does one compromise reach every device?** — choose compromised vendor, update, identity, or routing authorities; compare shared administration, renamed operators, and independently pinned update approvals. Real P-256 signatures gate a modelled installation; AES-GCM probes and the existing passive implant show plaintext capture despite successful authentication tags. An existing implant on Alice survives operator separation. This is an illustrative counterfactual, not a historical update-protocol reconstruction. See [architecture details](docs/architecture-probe.md).

## When to Use It

- **Use it** to teach the difference between channel security and endpoint security;
  to show that "we use end-to-end encryption" is not the same claim as "your messages
  are safe"; and to see a correct Double Ratchet run and the wire it produces.
- **Do NOT** treat it as evidence that the Signal protocol or the Double Ratchet is
  weak — the entire point is that it was **not** broken. And do **not** use this code
  to secure anything real: it is a lab, not a messenger.

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-encrochat/**

Send messages and watch the wire stay opaque; try to tap or tamper with the wire and
watch it fail; then deploy the endpoint implant and watch the plaintext appear at the
device while the encryption verdict stays green and the system verdict flips to alarm.

## What Can Go Wrong

The lab is a catalogue of the failure it teaches:

- **Compromised endpoint → total loss of confidentiality.** Plaintext is read before
  encryption and after decryption; forward secrecy and a perfect cipher are irrelevant.
- **Concentrated trust → compromise scales.** Shared administrative access can give one compromise every signing authority. Separate operator names do not contain that compromise unless independently enforced permissions change. The exhibit requires both vendor and update-approval signatures; routing-server control alone cannot authorize installation in independent mode.
- **Misreading the guarantee.** "End-to-end encrypted" describes the channel. It says
  nothing about who controls the ends.

## Real-World Usage

The Double Ratchet shown here is the real thing — the same construction secures
Signal, WhatsApp, and Messenger's secret conversations. The lesson generalises well
past Encrochat: endpoint security (device integrity, supply chain, what runs on the
phone) bounds what any messaging cryptography can deliver. Threat-modelling that stops
at "is the crypto strong?" misses where real systems actually fail.

## How to Run Locally

`​``bash
npm install
npm run dev       # http://localhost:5173/crypto-lab-encrochat/
npm test            # unit tests + spec KATs
npm run build       # typecheck + production build
npm run test:e2e    # browser gate: functional claims + WCAG 2.1 AA, both themes
npm run test:a11y   # just the accessibility half
npm run test:claims # just the functional half
`​``

## Related Demos

- [cipher-museum](https://systemslibrarian.github.io/cipher-museum/) — real-world case studies of ciphers and how they fell.
- [crypto-lab-x3dh-wire](https://systemslibrarian.github.io/crypto-lab-x3dh-wire/) — the X3DH initial key agreement that seeds a Double Ratchet.
- [crypto-lab-ratchet-wire](https://systemslibrarian.github.io/crypto-lab-ratchet-wire/) — the Double Ratchet on the wire, step by step.

## Build & Verify

- **Unit tests** (Vitest), colocated as `src/**/*.test.ts`, run in CI before deploy.
- **8 spec known-answer tests** pin the primitives to their standards:
  - `src/crypto/primitives.test.ts` — HMAC-SHA256 (RFC 4231 ×2), HKDF-SHA256
    (RFC 5869 ×2), AES-256-GCM (NIST CAVP vector).
  - `src/crypto/x25519.test.ts` — X25519 (RFC 7748 §5.2 ×2) and the published
    Alice/Bob key agreement (RFC 7748 §6.1), plus malformed/low-order peer rejection.
- `src/crypto/double-ratchet.test.ts` covers round-trips across DH ratchet steps,
  on-wire opacity, forward secrecy, the canonical wire codec, and the **transactional
  receive** property: a forged packet is rejected and leaves the ratchet byte-for-byte
  unchanged, so the next authentic packet still decrypts.
- `src/session.test.ts` proves **fresh key material every session** — 500 sessions
  encrypt identical plaintext to 500 distinct packets (no repeated key/IV) — and that
  verdicts follow observed evidence (untested → sound → alarm).
- `src/endpoint/implant.test.ts` proves the thesis: encryption sound **and** endpoint
  compromised leaks plaintext, and the system verdict tracks integrity.
- **Functional browser gate:** `e2e/claims.spec.ts` drives the production build in
  Chromium and asserts the page's own output — the packet's byte segments summing to
  the total it announces (and the ciphertext length matching the UTF-8 plaintext), the
  ratchet strip's `⟳ DH step` / `chain +1` labels matching the DH key in the header
  that message actually carried, the encryption verdict's `N of M` counter equalling
  the messages on screen, both failure paths (keyless wiretap, forged packet) reaching
  their failure state *and* stating why, and the implant harvesting plaintext at both
  ends while the wire's byte counts are unchanged.
- **Accessibility gate:** `@axe-core/playwright` scans the production build for zero
  WCAG 2.1 A/AA violations in **both** themes; the GitHub Pages deploy is blocked on
  both browser gates.

## Performance

Everything runs client-side with no backend and ships as a small static bundle
(~13 kB gzipped JS). Each message is a handful of WebCrypto operations plus one
`@noble/curves` X25519 agreement, and all UI commands are serialized so the page
never blocks or races. Cold-load and per-message timings are not yet benchmarked in
CI, so no specific latency figure is claimed here.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*


```

</details>

---

## Matsui Line

- **slug**: `crypto-lab-matsui-line`
- **repo**: https://github.com/systemslibrarian/crypto-lab-matsui-line
- **live**: https://systemslibrarian.github.io/crypto-lab-matsui-line/
- **commit_sha**: `dfa64f92b5048b521a7327587209ba41d8e879fe` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: advanced  ·  **--accent**: #6366f1
- **MISSING FIELDS**: claims, verification

**Name (H1)**: Matsui Line  — _read from index.html_

**Subtitle**: Linear cryptanalysis · piling-up lemma · Matsui 1993  — _read from index.html_

**Description**: Watch sixteen key guesses compete on real evidence until the right one separates — the attack that broke DES, run on a cipher small enough to break in front of you.  — _read from index.html_

**Why it matters**: Linear cryptanalysis was the first attack to break full DES faster than brute force, and it needs no control over the input at all — only enough ordinary traffic. Every block cipher designed since is shaped by the need to survive it, which is why AES has the S-box it has.  — _read from index.html_

**Card copy**: Run linear and differential–linear attacks on a toy SPN: compare trails with key-dependent hulls, join a chosen-difference prefix to a parity suffix, rank a last-round whitening byte, and test a cancelling control.

**Chips**: Linear Cryptanalysis · LAT · Piling-Up Lemma · Known-Plaintext · Multiple Masks · Differential Cryptanalysis

**Implements**: Toy SPN `src/crypto/spn.ts:66`

**Attacks shown**: Chosen-plaintext attack `src/crypto/difflin.ts:310`, Differential cryptanalysis `src/crypto/difflin.ts:136`, Key recovery `src/crypto/attack.ts:159`, Known-plaintext attack `src/crypto/attack.ts:46`, Linear cryptanalysis `src/crypto/attack.ts:159`

**Comment-only (named in code comments, not executed)**: DES `src/crypto/spn.ts:16`

**References**: AES, ChaCha20, DES, Enigma, Serpent, Vigenere cipher

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `ASIACRYPT 2002` — first seen README.md:54 (4×)
- `CHES 2007` — first seen README.md:61 (4×)
- `doi.org/10.1007/3-540-36178-2_16` — first seen README.md:54 (2×)
- `doi.org/10.1007/3-540-48658-5_3` — first seen README.md:54 (2×)
- `ePrint 2016/088` — first seen README.md:94 (1×)
- `eprint.iacr.org/2010/025` — first seen README.md:54 (1×)
- `eprint.iacr.org/2016/088` — first seen README.md:52 (2×)
- `eprint.iacr.org/2025/437` — first seen README.md:122 (2×)
- `EUROCRYPT 1993` — first seen index.html:346 (1×)
- `EUROCRYPT 1994` — first seen index.html:362 (1×)
- `EUROCRYPT 2025` — first seen README.md:122 (2×)
- `FIPS 197` — first seen README.md:60 (1×)
- `RFC 8439` — first seen index.html:703 (1×)

**Stated limitations (page)**:

- _(honesty, index.html)_ 10 What this is, and what it does not prove Real The cipher is real code — every ciphertext here came out of it. The LAT is counted over all 16 inputs; nothing in it is asserted. The trail search is exhaustive over the 8-bit mask space, not a heuristic sample. The attack uses only plaintext/ciphertext pairs and its own guesses. It never reads the key. Every counter you watch move is a count that was performed, including the partial ones. Biases labelled "measured" come from running the cipher over its entire 256-plaintext codebook.

**README — What Can Go Wrong**:

```text
Real failure modes — in the attack, and in ciphers that must resist it.

- **Trusting the piling-up lemma as if it were a measurement.** The lemma assumes rounds are independent. Where several trails join the same pair of masks, they add or cancel depending on the key — the linear hull effect. This demo shows the predicted bias and the measured bias side by side; over three rounds they diverge badly, and for at least one key in ten the cancellation is total: the true bias is zero and the approximation is worthless against that key at any data volume.
- **Trusting the wrong-key randomisation hypothesis.** Algorithm 2 assumes a wrong guess produces an unbiased counter. On a small block it does not: exhaustive screening here finds approximations with a textbook-perfect 1/8 bias that still never name the key, because the correct candidate stays permanently tied with an impostor. A strong trail is a necessary but not sufficient condition for key recovery, and the demo screens every candidate against the real cipher rather than assuming.
- **Choosing an S-box on differential properties alone.** The two attacks are not the same attack. On this toy, the Heys S-box protects one nibble of the final subkey from every linear approximation we could find, while the PRESENT S-box — the stronger of the two against differentials — leaves both nibbles recoverable. Designers must clear both bars, plus several more.
- **Under-counting the data requirement.** The familiar 1/ε² figure describes one counter reading correctly. Algorithm 2 needs one counter to out-lean fifteen rivals, which costs substantially more; here the measured success rate lags the formula's prediction at every data size.
- **Confusing a trail with a whole approximation.** A fixed round-key XOR can change the sign of an individual trail's contribution but not its magnitude. A full linear approximation sums many trails with key-dependent signs, so their contributions can reinforce or cancel to zero. In this toy's three-round hull, input mask `0x01` and output mask `0x50` match 128/256 plaintexts for master key `0x0000` (zero bias), but 130/256 for key `0x1234` (bias 1/128). See [*On Linear Hulls and Trails* (2016)](https://eprint.iacr.org/2016/088) and Beyne and Rijmen, [*Linear Cryptanalysis* (2025), ch. 2](https://www.cambridge.org/core/books/linear-cryptanalysis/DFB9A56FA0EC663A9AC3D99F9D241461).
- **Treating repeated inputs as new evidence.** With an 8-bit block, repeated random traffic revisits plaintexts. Sampling distinct random plaintexts increases coverage but does not let the attacker choose them. For a fixed key and relation with match fraction *p*, the count variance for *N* distinct plaintexts is `N p(1−p) (256−N)/255`, versus `N p(1−p)` with replacement. At *N* = 256 the count has no sampling variance. The panel's Wilson intervals instead describe uncertainty in the observed success proportion over 60 random toy keys; they are neither per-key guarantees nor security proofs. See Beyne and Rijmen, [*Linear Cryptanalysis* (2025), ch. 4](https://www.cambridge.org/core/books/abs/linear-cryptanalysis/statistics-of-linear-cryptanalysis/4233F6B7EFEC3E49BDE1958049BAA16C).
- **Trusting the differential–linear heuristic off the designated path.** Langford and Hellman's original probability-one composition gives bias `2·ε²`; the published Biham–Dunkelman–Keller enhancement gives `2·p·ε²` by assuming pairs outside the prefix condition have random output parities. With `λin = 0x02`, every path in the chosen DDT row has the designated right-hand side, so signed path contributions reinforce: 9/64 becomes a path-aware 9/32, while the real key-dependent measurement is 1/4 or 5/16 because joining values within a path are not a uniform independent population. With `λin = 0x04`, evaluating every path against the attack's *fixed* designated-path equation gives contributions `[0, +1/2, 0, −1/2, 0]`; their weighted sum and the real full-codebook measurement are zero. The control's `λout =
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records** (4 file(s)):

- `mutation-evidence.json` (10355 bytes)
- `scripts/check-mutations.mjs` (13659 bytes)
- `scripts/claim-mutations.mjs` (7853 bytes)
- `src/crypto/permutation.ts` (1677 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-matsui-line

## What It Is

**Linear cryptanalysis** is a known-plaintext attack on block ciphers, published by Mitsuru Matsui in 1993 and used by him in 1994 for the first experimental break of full DES. It works by finding linear approximations — statements of the form "this XOR of plaintext bits equals that XOR of round-input bits" — that hold slightly more often than half the time because the cipher's S-boxes are not perfectly balanced. The **piling-up lemma** describes how those small biases compound across rounds, and **Matsui's Algorithm 2** turns the surviving bias into key bits: guess part of the final subkey, undo the last round under each guess, and see which guess makes the bias appear.

This demo implements the attack against the same toy 4-round SPN that [crypto-lab-biham-lens](https://systemslibrarian.github.io/crypto-lab-biham-lens/) attacks with differentials — 8-bit block, 16-bit key, a 4-bit S-box on each nibble, and a bit permutation for diffusion. Every ciphertext on the page comes out of that real cipher, every bias is counted rather than asserted, and the trail search is exhaustive over the 8-bit mask space rather than a heuristic.

**This is not production cryptography.** An 8-bit block has 256 plaintexts; the entire codebook fits in a browser tab, and the cipher is broken by definition. It exists so the attack is visible at a scale you can watch. Breaking it proves nothing about AES or DES — it demonstrates the mechanism that forced their designs.

The security model on display is deliberately generous to the attacker in one way and strict in another: they see plaintext/ciphertext pairs they did not choose (weaker access than differential cryptanalysis needs), and they never touch the key — the demo checks their answer against the real key only after the attack has finished.

## Exhibits

The page opens on the attack itself. Everything below it exists to explain the thing you just watched happen.

1. **Break the toy cipher** — the cockpit. A hidden four-bit subkey, sixteen counters, and a Run button. Press it and the pairs are counted in front of you: the counters move because the numbers moved, and a partial count is exactly what an attacker with that much traffic would have. The key stays hidden until the count finishes. Four one-click scenarios try to break the attack — **starve it** (16 pairs), **add a round** (the leak shrinks below the noise), **bad relation** (an approximation with provably zero bias), **reset**. Changing any control that affects the outcome retires the result rather than leaving it under settings that did not produce it. *Copy experiment link* pins the key and seed so a surprising result is reproducible by whoever you send it to.
2. **Why did that work?** — one connected chain from a single S-box's imbalance to one key candidate separating, each link showing the value your current settings actually produce, each link a link to the exhibit behind it.
3. **Inspect the cipher** — send a plaintext through and watch every intermediate state in binary. The state the attack aims at is marked.
4. **Inspect one S-box leak** — the full 16×16 linear approximation table. Each cell is a button; selecting one shows all 16 inputs with both sides of the approximation computed independently and compared, so the table's number is visibly the sum of that column rather than a claim. Cells the current trail rides on are ringed.
5. **Watch the bias compound** — step through the trail one round at a time and watch the piling-up lemma shrink the bias, in both its bias form (ε = 2ⁿ⁻¹ ∏ εᵢ) and its correlation form, plus what each extra round costs in traffic. A disclosure panel then measures the true bias by running the real cipher over all 256 plaintexts for ten different keys — which is where the **linear hull effect** shows up: over two rounds the lemma is exact (every key gives |ε| = 1/8 on the nose; only the sign moves), while over three rounds the measured bias scatters with the key. Take the strongest three-round trail the lemma can find (the *strongest, unverified* setting in exhibit 1) and its true bias ranges from 5/64 down to *exactly zero* across ten keys, while the prediction sits unmoved at 27/512.
6. **Look at more than one relation** — select one of three fixed toy keys and 16, 64 or all 256 distinct plaintexts. The lab counts two mask relations on the same traffic and displays all four joint outcomes. A third mask pair has no nonzero two-round trail and therefore zero full-codebook correlation for every key; a short sample can still look biased. This is a bounded observation, not a multidimensional key-recovery attack.
7. **How much traffic do you need?** — Matsui's inverse-square rule, with the sample count for a target success rate, next to the **measured** success rate of the attack run end to end over 60 random keys per data size. The original measurement remains 300 complete attacks. A second comparison runs the same attack on the same 60 toy keys under repeated draws and distinct random plaintexts at equal budgets (16–256 pairs). It shows the number of unique inputs, an interval for the measured across-key success fraction, and the finite-population variance factor for one relation. Both measurements run in a cancellable Web Worker.
8. **The pair-mate attack** — differential versus linear across seven properties, with the honest note about how far each reaches on a block this small.
9. **Weld the two attacks together** — a fixed differential–linear composition on the 3-round Heys-S-box form of the shared toy cipher. Chosen pairs with difference `0x0B` drive round 1, a biased parity reads round 2, and the join is the explicit state entering round 2. The aligned construction's output mask spans both nibbles, so it peels and ranks all 256 final-whitening-byte hypotheses by absolute bias. Its p-weighted Biham–Dunkelman–Keller heuristic is 9/64, its signed DDT-row estimate is 9/32, and the full-codebook measurement is 1/4 or 5/16 depending on the key; the page computes the current key's value rather than asserting one universal result. The control's p-weighted heuristic is 1/16, but paths evaluated against the attack's one fixed right-hand side contribute with opposite signs: the corrected path sum and full-codebook bias are both zero. A partial-budget run can still deviate through finite-sample noise. Because that control mask observes only the high nibble, it honestly ranks 16 high-nibble hypotheses rather than pretending to recover a byte. Fresh held-out pairs independently check the aligned winner. A deterministic 512-key measurement puts the true byte in the top equivalence class for 31.3%, 66.8%, 90.2%, 99.8% and 100% of keys at 16, 32, 64, 96 and 128 pairs; ties count only as partial recovery. The stride disperses this reproducible bounded sample across the key space but is not a random population estimate. The exhibit makes no claim that its selected masks are optimal for four rounds or that it attacks the full toy cipher.
10. **Limits** — what is real here and what this does not prove.

## When to Use It

- **Evaluating a new block cipher or S-box.** Computing the LAT and searching for multi-round trails is one of the first things a designer does; a maximum LAT entry that is too large is a disqualifying result.
- **Justifying round counts.** The inverse-square data requirement is what turns "one more round" into "four times the traffic", and it is the argument behind the round counts in AES, PRESENT, and Serpent.
- **Teaching why non-linearity matters.** The S-box is the only non-linear component; the attack is a demonstration of what happens to the parts of a cipher that are linear.
- **Analysing legacy or bespoke ciphers.** Ciphers designed before 1993, or designed without cryptanalytic review, frequently have exploitable linear approximations.
- **When NOT to use it:** do not reach for linear cryptanalysis against a modern standardised cipher and expect a result — AES, ChaCha20 and their peers were designed specifically to make the required data exceed the number of blocks the mode will ever encrypt. And **do NOT treat the toy SPN here as a cipher**: it is a teaching target, not cryptography.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-matsui-line](https://systemslibrarian.github.io/crypto-lab-matsui-line/)**

Press **Run Matsui's attack** and watch sixteen counters resolve on real traffic until one candidate separates — then find out it was the key. From there: take the data away and watch it stop working, add the fourth round and watch the ranking dissolve into noise, swap the S-box, invent your own masks, or press *Measure the real success rate* and get a curve produced by running the attack 300 times rather than by evaluating a formula.

Nothing is precomputed for show. Every counter that moves was counted, including the partial ones.

## What Can Go Wrong

Real failure modes — in the attack, and in ciphers that must resist it.

- **Trusting the piling-up lemma as if it were a measurement.** The lemma assumes rounds are independent. Where several trails join the same pair of masks, they add or cancel depending on the key — the linear hull effect. This demo shows the predicted bias and the measured bias side by side; over three rounds they diverge badly, and for at least one key in ten the cancellation is total: the true bias is zero and the approximation is worthless against that key at any data volume.
- **Trusting the wrong-key randomisation hypothesis.** Algorithm 2 assumes a wrong guess produces an unbiased counter. On a small block it does not: exhaustive screening here finds approximations with a textbook-perfect 1/8 bias that still never name the key, because the correct candidate stays permanently tied with an impostor. A strong trail is a necessary but not sufficient condition for key recovery, and the demo screens every candidate against the real cipher rather than assuming.
- **Choosing an S-box on differential properties alone.** The two attacks are not the same attack. On this toy, the Heys S-box protects one nibble of the final subkey from every linear approximation we could find, while the PRESENT S-box — the stronger of the two against differentials — leaves both nibbles recoverable. Designers must clear both bars, plus several more.
- **Under-counting the data requirement.** The familiar 1/ε² figure describes one counter reading correctly. Algorithm 2 needs one counter to out-lean fifteen rivals, which costs substantially more; here the measured success rate lags the formula's prediction at every data size.
- **Confusing a trail with a whole approximation.** A fixed round-key XOR can change the sign of an individual trail's contribution but not its magnitude. A full linear approximation sums many trails with key-dependent signs, so their contributions can reinforce or cancel to zero. In this toy's three-round hull, input mask `0x01` and output mask `0x50` match 128/256 plaintexts for master key `0x0000` (zero bias), but 130/256 for key `0x1234` (bias 1/128). See [*On Linear Hulls and Trails* (2016)](https://eprint.iacr.org/2016/088) and Beyne and Rijmen, [*Linear Cryptanalysis* (2025), ch. 2](https://www.cambridge.org/core/books/linear-cryptanalysis/DFB9A56FA0EC663A9AC3D99F9D241461).
- **Treating repeated inputs as new evidence.** With an 8-bit block, repeated random traffic revisits plaintexts. Sampling distinct random plaintexts increases coverage but does not let the attacker choose them. For a fixed key and relation with match fraction *p*, the count variance for *N* distinct plaintexts is `N p(1−p) (256−N)/255`, versus `N p(1−p)` with replacement. At *N* = 256 the count has no sampling variance. The panel's Wilson intervals instead describe uncertainty in the observed success proportion over 60 random toy keys; they are neither per-key guarantees nor security proofs. See Beyne and Rijmen, [*Linear Cryptanalysis* (2025), ch. 4](https://www.cambridge.org/core/books/abs/linear-cryptanalysis/statistics-of-linear-cryptanalysis/4233F6B7EFEC3E49BDE1958049BAA16C).
- **Trusting the differential–linear heuristic off the designated path.** Langford and Hellman's original probability-one composition gives bias `2·ε²`; the published Biham–Dunkelman–Keller enhancement gives `2·p·ε²` by assuming pairs outside the prefix condition have random output parities. With `λin = 0x02`, every path in the chosen DDT row has the designated right-hand side, so signed path contributions reinforce: 9/64 becomes a path-aware 9/32, while the real key-dependent measurement is 1/4 or 5/16 because joining values within a path are not a uniform independent population. With `λin = 0x04`, evaluating every path against the attack's *fixed* designated-path equation gives contributions `[0, +1/2, 0, −1/2, 0]`; their weighted sum and the real full-codebook measurement are zero. The control's `λout = 0xC0` sees only the high key nibble, so its no-signal experiment ranks 16 honest hypotheses and makes no byte-recovery claim. See Langford and Hellman, [*Differential–Linear Cryptanalysis* (CRYPTO '94)](https://doi.org/10.1007/3-540-48658-5_3), Biham, Dunkelman and Keller, [*Enhancing Differential-Linear Cryptanalysis* (ASIACRYPT 2002)](https://doi.org/10.1007/3-540-36178-2_16), and Lu, [*New Methodologies for Differential-Linear Cryptanalysis and Its Extensions* §3.1](https://eprint.iacr.org/2010/025).
- **Confusing a structural zero with a sample count.** The new two-mask panel distinguishes a pair with no nonzero trail (zero correlation over all 256 plaintexts for every key) from an ordinary relation that happens to cancel under one key or look balanced in a finite sample. It shows the four joint outcomes instead of assuming two mask counts are independent. This is a small window into [multiple linear cryptanalysis](https://www.cambridge.org/core/books/linear-cryptanalysis/multiple-linear-cryptanalysis/0E7438A0DE3F39BF647B0F2708756D40) and [zero-correlation analysis](https://www.cambridge.org/core/books/abs/linear-cryptanalysis/zerocorrelation-approximations/2720458FF754C2EBDF691CDFC0FAE59F), not either complete attack.

## Real-World Usage

- **DES (FIPS 46, 1977).** Matsui broke the full 16-round cipher with 2⁴³ known plaintexts and, in 1994, actually executed it — 50 days on 12 workstations, the first experimental break of DES. Linear cryptanalysis, unlike the differential attack the design had been secretly hardened against, was not anticipated by DES's designers.
- **AES / Rijndael (FIPS 197, 2001).** The AES S-box was chosen for a maximum linear correlation of 2⁻³, and the wide-trail design strategy bounds the number of active S-boxes per four rounds. Both exist to make linear approximations decay fast enough that no useful trail crosses ten rounds.
- **PRESENT (CHES 2007).** The S-box shipped in this demo. Bogdanov et al. selected it under explicit criteria including a maximum linear bias of 4/16, and the paper's security argument bounds the number of active S-boxes in any linear trail.
- **Serpent (AES finalist, 1998).** Co-designed by Eli Biham, of the pair-mate attack. Its 32 rounds were chosen to give a large margin against both differential and linear cryptanalysis simultaneously.
- **Cipher standardisation generally.** Since 1994, resistance to linear cryptanalysis has been a threshold requirement rather than a feature: a submission that cannot bound its best linear trail does not get evaluated further.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-matsui-line
cd crypto-lab-matsui-line
npm install
npm run dev
`​``

`npm test` runs the unit suite; `npm run build && npm run test:a11y` runs the production build through the browser and accessibility gate. `npm run test:mutations` proves the differential–linear claim tests reject fifteen targeted source mutations.

## Related Demos

- [crypto-lab-biham-lens](https://systemslibrarian.github.io/crypto-lab-biham-lens/) — differential cryptanalysis of the same toy SPN. The pair-mate attack, and the direct comparison this demo is built against.
- [crypto-lab-aes-modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/) — the cipher whose S-box was chosen to survive this attack.
- [crypto-lab-enigma-forge](https://systemslibrarian.github.io/crypto-lab-enigma-forge/) — statistical cryptanalysis a generation earlier.
- [crypto-lab-vigenere-break](https://systemslibrarian.github.io/crypto-lab-vigenere-break/) — bias-counting against a classical cipher.

## Build & Verify

**122 unit tests** (Vitest, colocated in `src/`), including these known-answer tests:

| KAT | Source | File |
| --- | --- | --- |
| Two published linear approximations of the Heys S-box (12/16 and 4/16) | Heys, *A Tutorial on Linear and Differential Cryptanalysis*, §3.2 | `src/crypto/lat.test.ts` |
| Maximum LAT entry 6/16 (Heys) and 4/16 (PRESENT) | Heys; Bogdanov et al., CHES 2007 | `src/crypto/lat.test.ts` |
| S-box tables | Heys tutorial; PRESENT spec, Table 1 | `src/crypto/sbox.test.ts` |
| Piling-up lemma worked example, total bias −1/32 | Heys tutorial | `src/crypto/trail.test.ts` |
| Algorithm success rates 84.1% / 92.1% / 97.7% / 99.8% at ¼, ½, 1, 2 × ε⁻² | Matsui, *Linear Cryptanalysis Method for DES Cipher*, §4 | `src/crypto/attack.test.ts` |
| Three-round hull: masks 0x01→0x50 match 128/256 vs 130/256 inputs under keys 0x0000 vs 0x1234 | exhaustive measurement of this toy; compare Ashur and Rijmen, ePrint 2016/088 | `src/crypto/trail.test.ts` |
| Two-mask joint outcomes and a no-trail pair with 128/256 matches across 256 sampled toy keys | Beyne and Rijmen, *Linear Cryptanalysis* (2025), chapters 6 and 8 | `src/crypto/advanced.test.ts` |
| Finite-population variance from independently enumerated hypergeometric subsets, distinct sampling, Wilson interval endpoints | Beyne and Rijmen, *Linear Cryptanalysis* (2025), ch. 4 | `src/crypto/attack.test.ts` |
| 96 cross-implementation cipher vectors reproducing crypto-lab-biham-lens's ciphertexts | generated from that repo's own implementation | `src/crypto/spn.test.ts` |
| Differential prefix DDT, signed fixed-RHS path sum, key-dependent full-codebook biases, 256-byte/16-nibble candidate boundaries, holdout vector and deterministic success curves | Langford and Hellman, CRYPTO '94; Biham, Dunkelman and Keller, ASIACRYPT 2002; independent exhaustive enumeration of this toy | `src/crypto/difflin.test.ts` |

Beyond the KATs, the suite pins the claims the demo makes on screen: that the attack recovers the subkey nibble for every key over the full codebook; that it fails on the four-round cipher; that the LAT satisfies Parseval's identity and the trail correlations match a brute-force count over the real round function; and — exhaustively, over all 3,208 candidate mask pairs — that none of them names the correct low nibble for every test key under the Heys S-box, which is why the UI reports that nibble as resistant rather than showing an unexplained failure.

**30 behaviour tests** (Playwright, `e2e/behaviour.spec.ts`) cover what axe cannot — the demo's story and its state machine. Each pins the key and sampling seed through the URL, so a failure means the narrative changed, not that a random draw went the other way. The differential–linear checks pin the join, fixed Heys/3-round boundary, heuristic stack, byte and nibble candidate spaces, aligned recovery, held-out verification, control cancellation, finite-sample control wording, tie ranks, stale rankings, URL persistence, keyboard focus across control rerenders and stale or in-flight success curves. Existing checks still cover the default attack, sampling, advanced relations, hidden-key lifecycle, copied links, keyboard reachability, reduced motion and horizontal reflow at 320, 390, 768 and 1440px.

**Accessibility is gated in CI.** `@axe-core/playwright` scans the dark-theme production build for WCAG 2.1 A/AA violations at wide and 380px viewports, after a spec drives every exhibit through its learner-visible states, including both differential–linear designs and the measured curve. Zero violations, or the deploy does not run. (This gate has already caught two real defects: a hover state that dropped white-on-indigo to 4.46:1, and a muted-on-tinted LAT cell.)

**Fifteen targeted mutations are gated in CI.** Each mutation first proves its named browser test is green on an exact baseline artifact, changes one security-critical line, requires an assertion failure with zero retries or skips, restores the source, then proves the artifact hash and owning test return to baseline. The exact per-mutant hashes, diffs and assertion failures are retained as the workflow's `differential-linear-mutation-evidence` artifact instead of committing evidence that would go stale after the next source change.

**Visual regression** (`npm run test:visual`) covers the cockpit after a successful break and after a failed one, in both themes. It is deliberately *not* part of the deploy gate: Playwright baselines are per-platform, and a macOS snapshot fails on the Linux runner for reasons unrelated to the change — a gate that cries wolf is a gate people learn to ignore.

## Performance

No backend; everything runs in the browser. The trail search composes a 256×256 correlation matrix (~17M multiply-compares per round), memoised per S-box; screening runs the attack over the full codebook for twelve keys per candidate. The attack itself precomputes the sixteen per-ciphertext parities once, so counting a batch stays cheap enough to run inside a frame without dropping the count. The original success-rate measurement runs 300 attacks; the optional sampling comparison runs 480. Both run in a Web Worker with real progress reporting and can be cancelled.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Reduced-round ChaCha context

The live demo links [EUROCRYPT 2025 bit-puncturing research](https://eprint.iacr.org/2025/437), labels reduced-round results and paper estimates, and distinguishes them from full ChaCha20 and from the attacks these labs actually execute. No reduced-round cipher replaces normal encryption.

```

</details>

---

## Context Ward

- **slug**: `crypto-lab-context-ward`
- **repo**: https://github.com/systemslibrarian/crypto-lab-context-ward
- **live**: https://systemslibrarian.github.io/crypto-lab-context-ward/
- **commit_sha**: `dc9495966268a343c97a157760d53e15bae7a093` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `19fd356c92a294db3ed959ed16a11fb93fb97cb3`
- **read_from**: working tree (clean)
- **category**: ATTACKS | PROTOCOLS  ·  **level**: intermediate  ·  **--accent**: #d9a441
- **MISSING FIELDS**: mutations

**Name (H1)**: Context Ward  — _read from src/ui/app.ts_

**Subtitle**: SHA-256 hash chain · HMAC-SHA-256 · Ed25519  — _read from src/ui/app.ts_

**Description**: Seals each segment of an agent’s context window into a hash chain with a  — _read from src/ui/app.ts_

**Why it matters**: Agents read tool output, error strings and their own saved notes as if all of it were  — _read from src/ui/app.ts_

**Card copy**: Seals an agent's context window into a SHA-256 hash chain with role-separated HMAC seals and Ed25519 tool attestations, then shows injected content passing every check while the agent is compromised anyway.

**Chips**: SHA-256 Chain · HMAC-SHA-256 · HKDF · Ed25519

**Implements**: Ed25519 `src/primitives.ts:43`, HKDF `src/primitives.ts:28`, HMAC `src/primitives.ts:16`, SHA-256 `src/primitives.ts:12`

**Attacks shown**: Side-channel (unspecified) `docs/THREAT-MODEL.md:109`

**Comment-only (named in code comments, not executed)**: Pairing `src/envelope.ts:87`

**References**: AES, Pairing, TLS 1.3

**Standards body**: IETF, NIST

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `arXiv:2405.20234` — first seen src/acts/index.ts:285 (1×)
- `arXiv:2506.02040` — first seen README.md:157 (3×)
- `arXiv:2602.10481` — first seen README.md:151 (1×)
- `FIPS 186-5` — first seen vendor/noble-ed25519/index.js:4 (1×)
- `RFC 8032` — first seen vendor/noble-ed25519/index.d.ts:156 (15×)
- `RFC8032` — first seen vendor/noble-ed25519/index.d.ts:111 (19×)

**README — What Can Go Wrong**:

```text
Failures the exhibit names specifically, each with its own tamper control:

| failure | means |
| --- | --- |
| `V_REJECTED` | unsupported protocol version, refused before any cryptography runs |
| `MALFORMED` | structurally invalid envelope |
| `SESSION_MISMATCH` | a segment from another conversation |
| `SEQ_GAP` | something dropped, duplicated or reordered |
| `CHAIN_BREAK` | the `prev` link disagrees with the recomputed `H_(n-1)` |
| `ROLE_MISMATCH` | sealed as one role, presented as another |
| `BAD_TAG` | the seal no longer covers this content |
| `BAD_SIGNATURE` | the tool attestation does not verify |
| `UNPINNED_TOOL` | signed by a key the agent never pinned |

And the failures it **cannot** name, because there is nothing structurally wrong
with them: hostile content in a correctly signed segment, a compromised host
minting its own seals, and a tool whose key is genuine and whose intent is not.

Implementation traps this repo hit and fixed, documented rather than quietly
patched:

* **`ROLE_MISMATCH` was unreachable.** `role` is covered by `leaf_n`, so
  relabelling moves the chain head as well as the seal key — probing the stored
  tag against the *current* head under other roles can never match. Naming a
  relabel requires recomputing the counterfactual leaf and chain step per
  candidate role. See `docs/MATH.md` §7.6 and `CLAIMS.yaml` `SEC-4`.
* **The HKDF salt is the raw 32 session bytes, not the hex string.** Getting this
  wrong leaves every leaf and chain hash correct while every tag differs.
* **Two CSS specificity bugs** caught by the accessibility gate: a link that was
  distinguishable by colour alone, and a pressed tamper button rendering salmon
  text on a gold fill at 1.9:1.
```

**Claims tested** (e2e/claims.spec.ts, 15 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:102
    - :102 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:109
    - :109 `toHaveText` expected `'ACT ${label}'` _(expression)_
- `the page tells the truth` — e2e/claims.spec.ts:114
- `the printed chain head re-derives from the page’s own raw transcript` — e2e/claims.spec.ts:115
    - :125 `expect` expected _no expected value_ _(none)_
    - :130 `toBe` expected `true` _(expression)_
- `the segment counter agrees with the rows it counts` — e2e/claims.spec.ts:134
    - :143 `toBe` expected `rendered` _(expression)_
    - :146 `toBe` expected `rendered` _(expression)_
- `the verdict agrees with the check rows beneath it` — e2e/claims.spec.ts:150
    - :163 `toBe` expected `'TAMPERING DETECTED'` _(literal)_
    - :165 `toBe` expected `'VERIFIED — AND COMPROMISED'` _(literal)_
    - :167 `toBe` expected `'VERIFIED'` _(literal)_
- `NEG-1 on screen: acts 2, 3, 4, 8a and 8b are fully green AND compromised` — e2e/claims.spec.ts:172
    - :182 `expect` expected _no expected value_ _(none)_
    - :184 `toMatch` expected `/FAIL$/` _(regex)_
    - :187 `expect` expected _no expected value_ _(none)_
    - :193 `expect` expected _no expected value_ _(none)_
    - :197 `toBe` expected `'ok'` _(literal)_
    - :198 `toBe` expected `true` _(expression)_
- `act 1 is the control: green and NOT compromised` — e2e/claims.spec.ts:202
    - :207 `toHaveAttribute` expected `'data-verdict', 'clean'` _(expression)_
    - :208 `toBe` expected `0` _(literal)_
    - :211 `toBe` expected `false` _(expression)_
- `every failure path names its actual cause, and matches the Python-verified manifest` — e2e/claims.spec.ts:214
    - :231 `toBeVisible` expected _no expected value_ _(none)_
    - :235 `expect` expected _no expected value_ _(none)_
    - :239 `expect` expected _no expected value_ _(none)_
    - :240 `toHaveAttribute` expected `'data-state', 'green'` _(expression)_
    - :242 `expect` expected _no expected value_ _(none)_
    - :243 `toHaveAttribute` expected `'data-state', 'caught'` _(expression)_
    - :245 `expect` expected _no expected value_ _(none)_
    - :251 `expect` expected _no expected value_ _(none)_
    - :257 `expect` expected _no expected value_ _(none)_
- `the scripted-transcript disclosure is printed verbatim and persistently` — e2e/claims.spec.ts:260
    - :267 `toHaveText` expected `SCRIPTED_TRANSCRIPT_DISCLOSURE` _(expression)_
    - :273 `toBeVisible` expected _no expected value_ _(none)_
    - :274 `toHaveText` expected `SCRIPTED_TRANSCRIPT_DISCLOSURE` _(expression)_
    - :277 `toBe` expected `0` _(literal)_
- `the three questions state plainly that one of them is unanswered` — e2e/claims.spec.ts:280
    - :285 `toHaveCount` expected `1` _(literal)_
    - :286 `toContainText` expected `'Should the model obey it?'` _(literal)_
    - :287 `toContainText` expected `'NOT ANSWERED'` _(literal)_
    - :288 `toHaveCount` expected `2` _(literal)_
- `switching act retires the tamper state rather than leaving it stale` — e2e/claims.spec.ts:291
    - :297 `toBeVisible` expected _no expected value_ _(none)_
    - :298 `toHaveAttribute` expected `'data-verdict', 'caught'` _(expression)_
    - :303 `toHaveCount` expected `0` _(literal)_
    - :304 `toHaveAttribute` expected `'data-verdict', 'clean'` _(expression)_
    - :305 `toHaveAttribute` expected _no expected value_ _(none)_
- `no-op guard: re-selecting the same act does not retire a fresh verdict` — e2e/claims.spec.ts:311
    - :320 `toHaveAttribute` expected `'data-verdict', 'alarm'` _(expression)_
    - :324 `toHaveText` expected `before ?? ''` _(expression)_
    - :325 `toHaveAttribute` expected `'data-verdict', 'alarm'` _(expression)_
- `[hidden] elements really are hidden` — e2e/claims.spec.ts:328
    - :336 `toBe` expected `0` _(literal)_
- `no network request leaves the page` — e2e/claims.spec.ts:339
    - :350 `toBeVisible` expected _no expected value_ _(none)_
    - :352 `toEqual` expected `[]` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

**verification/ manifest** (4 file(s)):

- `verification/CLAIMS.yaml` (21561 bytes)
- `verification/HARNESS.md` (6505 bytes)
- `verification/requirements.txt` (154 bytes)
- `verification/verify.py` (23306 bytes)

<details><summary>Full README</summary>

```markdown
# Context Ward

**Context injection + cryptographic context provenance.**

Context Ward uses cryptographic envelopes to explore which context-manipulation
failures can be detected structurally. It does not claim cryptography solves
prompt injection.

**Live demo:** <https://systemslibrarian.github.io/crypto-lab-context-ward/>

---

## What It Is

An agent's context window is a pile of text from wildly different sources — the
operator's instructions, tool output, runtime error strings, retrieved web
pages, notes the agent saved to itself last turn — flattened into one stream
with nothing marking where each piece came from.

This exhibit seals every segment of that stream into an authenticated structure
and then lets you attack it:

* a **SHA-256 hash chain** binding each segment to its position and history,
* a **role-separated HMAC-SHA-256 seal** derived per role through
  **HKDF-SHA-256**, so a segment cannot be relabelled after the fact,
* an **Ed25519 attestation** from each tool over the content it emitted, against
  a public key the agent pinned in advance.

All of it is real. SHA-256, HMAC and HKDF come from WebCrypto; Ed25519 comes
from a vendored, hash-pinned copy of `@noble/ed25519`. Nothing is hand-rolled
and nothing is simulated.

The exhibit exists to separate three questions that get conflated constantly:

| question | answered by | verdict |
| --- | --- | --- |
| Was this context altered? | hash chain, HMAC seal | **cryptography answers this** |
| Who supplied it? | Ed25519 tool attestation | **cryptography answers this** |
| Should the model obey it? | nothing here | **cryptography cannot answer this** |

**The agent is a deterministic scripted mock.** There is no model, no API key
field, and no network call — the page ships with `connect-src 'none'` in its
CSP, so the browser itself forbids one. The mock implements one stated trust
policy: content in an authoritative-role segment is treated as instruction.
Watching it comply is not a measurement of any real model's behaviour, and the
page says so persistently rather than in a footnote.

**Not production crypto — a teaching demo.** The session key and every tool key
are fixed constants committed to this public repository. They protect nothing.

## Exhibits

The demo runs as eight acts. Acts 2, 3, 4, 8a and 8b ship **fully green**: the
cryptography does not go red merely because the content is hostile, and
pretending otherwise would be the central dishonesty this exhibit is built to
avoid.

1. **Baseline** — a clean turn. Every check passes and nothing hostile happened.
2. **Injection via tool output** — a ticket contains instructions aimed at the
   agent. `ticket_db` returns it faithfully. `SOURCE: TOOL_RESULT`, all checks
   green, agent compromised. Tamper controls: relabel the role, edit the body
   after sealing — both go red.
3. **Injection via runtime result** — the payload rides in on a Python
   traceback. `SOURCE: RUNTIME`, the channel nobody sanitises.
4. **Injection via persisted state** — a scratchpad note restored across a turn
   boundary, re-read as the agent's own conclusion. `SOURCE: STATE`.
5. **Splice and replay** — **this is what the cryptography genuinely prevents.**
   A validly signed `tool_result` from an earlier session, spliced into this
   one, fails on `SESSION_MISMATCH` and `CHAIN_BREAK`. Its signature is real; it
   attests to a position in a different transcript.
6. **Provenance and integrity mechanisms** — what each primitive asserts, and
   a **compromised-host** control that derives `K_system` from `K_session` and
   mints a valid `system` tag. Every seal verifies. The one thing the attacker
   cannot do is re-sign the tool attestation.
7. **Chain and session binding** — reorder, drop, corrupt the `prev` link, claim
   protocol v2. Each produces its own named failure, never a generic "invalid".
8. **What the crypto does not buy you** — the climax, and reachable straight
   from the demo path.
   * **8a — honest tool, hostile payload.** `web_fetch` retrieves a poisoned
     page and signs exactly what it retrieved. The common case, and the one that
     generalises.
   * **8b — malicious or compromised tool.** The pinned key is doing its job
     perfectly; the thing holding it is hostile.

   Both land an all-green verification panel beside a compromised agent. The
   verdict badge reads **VERIFIED — AND COMPROMISED** in alarm colouring, not
   green, because a forged-but-accepted result is not a success.

Two depths throughout: **Demo** for the guided acts, **Full lab** for the
byte-level envelope inspector, the `enc()` breakdown showing the exact bytes
that get hashed, and the raw sealed transcript.

## When to Use It

Use this construction when you need to answer **integrity and provenance**
questions about an agent's context:

* proving a transcript was not edited after the fact, for audit or incident
  review;
* proving which tool produced a given piece of context;
* preventing content from one session being replayed into another;
* preventing a `tool_result` from being promoted to `system` in storage.

**Do NOT use it as a prompt-injection defence.** It is not one. Every act from
2 onward except 5 demonstrates content passing every check and compromising the
agent anyway. If you deploy authenticated context and conclude injection is
handled, you have made things worse by adding confidence without adding safety.

Also do not use it where you need **confidentiality** — envelopes are
authenticated, not encrypted — or where the **host itself** is in your threat
model. Role separation assumes a trusted host, and Act 6 shows what happens when
that assumption fails.

## What Can Go Wrong

Failures the exhibit names specifically, each with its own tamper control:

| failure | means |
| --- | --- |
| `V_REJECTED` | unsupported protocol version, refused before any cryptography runs |
| `MALFORMED` | structurally invalid envelope |
| `SESSION_MISMATCH` | a segment from another conversation |
| `SEQ_GAP` | something dropped, duplicated or reordered |
| `CHAIN_BREAK` | the `prev` link disagrees with the recomputed `H_(n-1)` |
| `ROLE_MISMATCH` | sealed as one role, presented as another |
| `BAD_TAG` | the seal no longer covers this content |
| `BAD_SIGNATURE` | the tool attestation does not verify |
| `UNPINNED_TOOL` | signed by a key the agent never pinned |

And the failures it **cannot** name, because there is nothing structurally wrong
with them: hostile content in a correctly signed segment, a compromised host
minting its own seals, and a tool whose key is genuine and whose intent is not.

Implementation traps this repo hit and fixed, documented rather than quietly
patched:

* **`ROLE_MISMATCH` was unreachable.** `role` is covered by `leaf_n`, so
  relabelling moves the chain head as well as the seal key — probing the stored
  tag against the *current* head under other roles can never match. Naming a
  relabel requires recomputing the counterfactual leaf and chain step per
  candidate role. See `docs/MATH.md` §7.6 and `CLAIMS.yaml` `SEC-4`.
* **The HKDF salt is the raw 32 session bytes, not the hex string.** Getting this
  wrong leaves every leaf and chain hash correct while every tag differs.
* **Two CSS specificity bugs** caught by the accessibility gate: a link that was
  distinguishable by colour alone, and a pressed tamper button rendering salmon
  text on a gold fill at 1.9:1.

## Real-World Usage

The provenance-and-integrity layer here is close to the *authenticated context*
primitive in **arXiv:2602.10481**, which formalises tamper-evident hash chains
over dynamic LLM inputs. That paper reports 100% detection across six attack
categories — for its **full layered system**, semantic validation included, not
for the hash chain alone. This exhibit implements only the chain, and Act 8 is a
demonstration of why the paper's other defences exist.

The attack surface is the one surveyed empirically in **arXiv:2506.02040** for
the MCP ecosystem: tool poisoning, puppet attacks, rug pulls, and exploitation
via malicious external resources. That fourth category is Act 8a exactly.

Three 2026 disclosures against shipping products make Act 8's argument outside a
scripted mock. Adversa's **cryptographic context injection** against Grok and
Gemini hides a payload in AES-256-GCM ciphertext that guardrails cannot read
because they inspect rather than execute; the model decrypts it in its own
sandbox and treats the plaintext as its own runtime output — Act 3, with real
models and reported zero-click exfiltration. **CoSnitch** (CVE-2026-24301) hides
injection in webpage metadata to poison Copilot's memory across sessions — Act
4, and pointedly *not* the cross-session replay Act 5 catches, because nothing
is moved between transcripts and every seal is legitimate. **SearchLeak**
(CVE-2026-42824) runs its exfiltration through streaming-render order and a
CSP-allowlisted egress path, neither of which any envelope touches. None of the
three would have been prevented by anything in this exhibit. That is why they
are cited.

Full citations are in `docs/PRIOR-ART.md` — the papers verified against their
arXiv abstract pages and cited for what they actually support, the field
incidents kept in their own section and labelled as the weaker evidence class
they are.

## How to Run Locally

`​``sh
npm install
npm run dev            # http://localhost:5173/crypto-lab-context-ward/
`​``

To run the independent verifier over the committed fixtures:

`​``sh
python3 -m pip install -r verification/requirements.txt
python3 verification/verify.py
`​``

## Related Demos

Other Crypto Lab exhibits in the ATTACKS category, and the hash/signature
primitives this one composes, are indexed at
<https://crypto-lab.systemslibrarian.dev/>.

## Build & Verify

`​``sh
npm test               # vendor integrity + claims check + 68 unit tests
npm run build          # tsc --noEmit && vite build
npm run test:a11y      # 22 Playwright specs: 10 accessibility, 12 claims
npm run verify:py      # 64 independent checks over 28 committed fixtures
npm run check:fixtures # regeneration must be a no-op on a clean tree
`​``

**68 unit tests** cover the encoding rules (including astral-plane characters and
rejected unpaired surrogates), leaf and chain construction, role separation
across all 36 ordered role pairs, session and sequence binding of Ed25519
attestations, and — for every one of the 17 tamper controls — that the verifier
produces the specific failure that control advertises.

**Test vectors** live in `fixtures/vectors/`. `encoding.json` pins the
cross-implementation edge cases: non-ASCII, astral-plane, composed versus
decomposed forms that must **not** be normalised together, and four unpaired
surrogates that must be rejected rather than silently replaced with U+FFFD.
`protocol.json` publishes every intermediate value — leaf, chain, per-role HKDF
keys, per-role tags, attestation — so a second implementation can localise a
mismatch instead of only observing that the final tag differs.

**`verification/verify.py` is a second implementation**, written from the prose
spec in `docs/MATH.md`. It imports nothing from `src/`, recomputes every value
rather than trusting any stored one, and shares no code path with the lab. It
was mutation-tested: salting HKDF with the hex string fails 31 checks,
normalising strings collapses the two normalisation vectors, dropping the
surrogate rejection fails all four reject-vectors, and disabling the version
gate changes the reported failure codes.

The TypeScript side was mutation-tested too. The sharpest result: dropping
`role` from `leaf_n` in `src/envelope.ts` failed one unit test **and 36 checks
in `verify.py`** — a change made only in the browser implementation produced an
immediate, loud disagreement with a verifier that had not changed. Both tables
are in `verification/HARNESS.md`.

**`verification/CLAIMS.yaml`** records 20 claims across five sections, each
anchored to a verbatim snippet of the code it describes. `npm run check:claims`
fails the build if an anchor drifts. Among them are two the exhibit would be
dishonest without:

* **`NEG-1`** — *authenticated context does not prevent semantic injection*,
  evidenced by six fixtures on which `verify.py` returns all-green while the
  scripted agent is compromised. `verify.py` prints them by name on every run
  **and fails if none exist**: the limitation is a verified claim, not a caveat.
* **`THREAT-1`** — *role separation assumes a trusted host*, evidenced by a
  fixture the compromised-host control produces that verifies completely clean.

**Accessibility is gated in CI.** WCAG 2.1 A/AA via `@axe-core/playwright`
against the production build, blocking the deploy. The gate emulates
reduced-motion before navigation rather than injecting `animation:none`, drives
the real controls instead of force-revealing hidden ones, runs the WCAG tag set
and the extra rules as separate analyses (chained, the second silently replaces
the first), asserts axe's `incomplete` bucket alongside `violations`, and
computes text and non-text contrast arithmetically so a colour axe declined to
judge is still judged.

**Documentation:** `docs/MATH.md` (the specification, including why the encoding
is length-prefixed concatenation rather than JSON canonicalisation),
`docs/THREAT-MODEL.md` (what is in scope and what is emphatically not), and
`docs/PRIOR-ART.md`.

## Performance

Everything runs in the browser and finishes in well under a frame. The heaviest
operation is Ed25519 keygen and signing for three mock tools at startup, a few
milliseconds in total; verification of a complete transcript is a handful of
SHA-256 and HMAC calls plus one signature check per signed segment. The
production bundle is roughly 46 kB of JavaScript and 12 kB of CSS before gzip.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Masked Core

- **slug**: `crypto-lab-masked-core`
- **repo**: https://github.com/systemslibrarian/crypto-lab-masked-core
- **live**: https://systemslibrarian.github.io/crypto-lab-masked-core/
- **commit_sha**: `71eee3f49079b7a1220dda1a9098faec3a4ae837` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: advanced  ·  **--accent**: #8ab4ff
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Masked Core  — _read from src/main.ts_

**Subtitle**: First-order Boolean masking · AES-128 · CPA  — _read from src/main.ts_

**Description**: Run correlation power analysis against a real AES-128, switch on first-order Boolean masking  — _read from src/main.ts_

**Why it matters**: Masking is the countermeasure smartcards, TPMs and secure elements are certified on, and it  — _read from src/main.ts_

**Card copy**: First-order Boolean masking flattens the CPA that Power Trace runs — so combine two samples instead of one and the key byte comes back. Masking is a price, not a wall, and this measures it.

**Chips**: Boolean Masking · Second-Order CPA · AES-128 · Centered Product

**Implements**: AES `src/attack/cpa.ts:23`

**Attacks shown**: Chosen-plaintext attack `src/attack/dpa.ts:24`, Power analysis `src/claims/bands.ts:150`, Side-channel (unspecified) `src/main.ts:60`, Timing side-channel `README.md:18`

**References**: HQC, Pairing

**Standards body**: NIST

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `CHES 2019` — first seen README.md:106 (2×)
- `doi.org/10.13154/tches.v2019.i3.202-232` — first seen README.md:106 (2×)
- `ePrint 2026/2509` — first seen README.md:168 (1×)
- `eprint.iacr.org/2026/2509` — first seen README.md:168 (1×)
- `FIPS197` — first seen src/aes/vectors.ts:12 (1×)
- `NIST SP 800-38A` — first seen README.md:33 (7×)
- `SP 800-38A` — first seen README.md:226 (5×)

**README — What Can Go Wrong**:

```text
The interesting failures here are not bugs in the cipher. They are the ways a correct
countermeasure stops protecting anything.

- **Higher-order observation.** This is the headline. First-order masking defeats
  first-order leakage analysis under the modelled assumptions, and does not protect against
  an attacker who can combine two samples. Act 3 proves exactly that sentence and nothing
  broader.
- **Broken randomness.** Act 4. Freeze the mask to a constant — an RNG that was never
  seeded, a mask computed once at boot, a test harness left in a shipping build — and the
  masked value becomes a deterministic function of the unmasked one. Every line of the
  countermeasure is still there and the ciphertext is still correct. **This is a separate
  lesson from Act 3**, and the lab deliberately keeps the two claims apart: it is a failure
  of randomness, not of masking.
- **The balanced-constant trap.** A frozen constant of Hamming weight 4 drives the
  Hamming-weight correlation to *exactly* zero. An attack that reports nothing looks
  identical to a countermeasure that is working. This is why the lab pins its fixture and
  leads Act 4 with a single-bit distinguisher, which recovers the key for *any* fixed
  constant.
- **Re-masking that transiently unmasks.** Writing `state ^ mask ^ mIn` left to right puts
  the unmasked byte in a register for one instruction. The scheme on paper is untouched and
  a first-order probe reads the secret straight off.
- **Glitches — and this is the one that matters most.** A masking scheme can be *proven*
  secure in the probing model and still leak at first order in real hardware, because a
  combinational glitch can transiently compute a function of both shares at once. The proof
  said no single wire depends on the secret; the glitch does not respect the boundary the
  proof drew. This is why **threshold implementations** exist. **No glitch is simulated
  here, and none is faked** — inventing a hardware model in order to "demonstrate" a glitch
  leak would be a made-up result dressed as evidence, so the boundary is named instead.
- **Also outside the model:** transitions (real registers leak the Hamming *distance*
  between successive values) and coupling between neighbouring wires, either of which can
  recombine shares the probing model treats as separate; imperfect randomness short of a
  frozen mask; and masking orders above one.

- **A negative leakage test is not a security guarantee.** [Buschkowski, Höher and Güneysu, *Sparse Secrets, Dense Problems*, ePrint 2026/2509 (17 October 2026; preprint)](https://eprint.iacr.org/2026/2509) report a profiled horizontal attack on a masked HQC FPGA multiplier. With 200 traces it locates secret nonzero positions within ±8 places, despite TVLA (test-vector leakage assessment) detecting no leakage after 10 million traces. This approximate position recovery does not establish complete key recovery or a mathematical break of HQC. The authors also add hiding countermeasures. The Scope tab links this example to the model's limitations: it requires profiled hardware measurements, while this AES lab uses simulated traces and does not implement HQC, reproduce the FPGA attack, or establish hardware resistance.
```

**Claims tested** (e2e/claims.spec.ts, 47 test(s)):

- `exact distribution lesson exposes the blind summaries and preserves its controls` — e2e/claims.spec.ts:33
    - :36 `toHaveCount` expected `5` _(literal)_
    - :37 `toContainText` expected `'75.000%'` _(literal)_
    - :38 `toContainText` expected `'50.000%'` _(literal)_
    - :39 `toContainText` expected `'Matching summary, different distributions'` _(literal)_
    - :40 `toContainText` expected `'distance = 1.000000'` _(literal)_
    - :43 `toContainText` expected `'Matching summary'` _(literal)_
    - :46 `toContainText` expected `'A = 44, B = 41'` _(literal)_
    - :47 `toContainText` expected `'This summary distinguishes'` _(literal)_
    - :49 `toHaveCount` expected `13` _(literal)_
    - :50 `toContainText` expected `'distance = 1.000000'` _(literal)_
    - :52 `toContainText` expected `'Same-distribution control'` _(literal)_
    - :53 `toEqual` expected `await page.locator('#moments-b li').allTextContents()` _(expression)_
    - :55 `toHaveValue` expected `'1'` _(literal)_
    - :56 `toHaveValue` expected `'0'` _(literal)_
    - :57 `toHaveValue` expected `'1'` _(literal)_
    - :58 `toContainText` expected `'Matching summary'` _(literal)_
    - :63 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :98 `expect` expected _no expected value_ _(none)_
    - :104 `toHaveText` expected `'Masked Core'` _(literal)_
- `the page renders what it claims to render` — e2e/claims.spec.ts:107
- `one h1, one main, one banner, the skip target and the scripture line` — e2e/claims.spec.ts:108
    - :109 `toHaveCount` expected `1` _(literal)_
    - :110 `toHaveCount` expected `1` _(literal)_
    - :111 `toHaveCount` expected `1` _(literal)_
    - :112 `toHaveAttribute` expected `'href', '#app'` _(expression)_
    - :113 `toHaveAttribute` expected `'data-theme', 'dark'` _(expression)_
    - :114 `toHaveText` expected _no expected value_ _(none)_
    - :117 `toHaveCount` expected `6` _(literal)_
- `the leakage model is stated persistently, not only in the Scope tab` — e2e/claims.spec.ts:120
    - :124 `toBeVisible` expected _no expected value_ _(none)_
    - :125 `toContainText` expected `'Hamming weight'` _(literal)_
    - :126 `toContainText` expected `'not modelled here'` _(literal)_
    - :127 `toContainText` expected `'Not production crypto'` _(literal)_
    - :128 `toBe` expected `true` _(expression)_
- `THE HIDDEN PROBE: an inactive tabpanel is hidden AND not painted` — e2e/claims.spec.ts:131
    - :140 `toEqual` expected `[]` _(expression)_
- `The split — the mechanism, cross-checked` — e2e/claims.spec.ts:144
- `the two printed shares XOR back to the printed secret` — e2e/claims.spec.ts:145
    - :153 `toBe` expected `secret ^ mask` _(expression)_
    - :154 `toBe` expected `secret` _(expression)_
- `the printed Hamming weights match a popcount of the printed bytes` — e2e/claims.spec.ts:157
    - :165 `toBe` expected `byte.toString(2).padStart(8, '0')` _(expression)_
    - :166 `toBe` expected `bits.split('').filter((c) => c === '1').length` _(expression)_
    - :167 `toBe` expected `HW[byte]` _(expression)_
- `the measured mean product equals -(1/2)(HW(v) - 4), re-derived here` — e2e/claims.spec.ts:170
    - :179 `toBeCloseTo` expected `-0.5 * (HW[secret] - 4), 4` _(expression)_
    - :180 `toContainText` expected `'Identical'` _(literal)_
- `the marginals do not move when the secret does, and the joint does` — e2e/claims.spec.ts:183
    - :194 `toContainText` expected `'0xff'` _(literal)_
    - :198 `toBe` expected `m0` _(expression)_
    - :199 `toBe` expected `j0` _(expression)_
    - :200 `toContainText` expected `'slope -1.000'` _(literal)_
- `a balanced secret makes the joint line flat, and the page says why` — e2e/claims.spec.ts:203
    - :207 `toContainText` expected `'slope 0.000'` _(literal)_
    - :208 `toContainText` expected `'exactly flat'` _(literal)_
    - :209 `toContainText` expected `'blind spot'` _(literal)_
    - :210 `toBe` expected `0` _(literal)_
- `Masked AES — the construction tells the truth` — e2e/claims.spec.ts:214
- `the unmasked output is the published ciphertext, and the masked state is not` — e2e/claims.spec.ts:215
    - :226 `expect` expected _no expected value_ _(none)_
    - :227 `toBe` expected `vector!.ciphertext` _(expression)_
    - :235 `toBe` expected `out` _(expression)_
    - :236 `toBe` expected `out` _(expression)_
- `the recomputed table row satisfies S'[x^mIn] = SBOX[x]^mOut, checked against SBOX here` — e2e/claims.spec.ts:239
    - :246 `toBe` expected `SBOX[x]` _(expression)_
    - :247 `toBe` expected `x ^ mIn` _(expression)_
    - :248 `toBe` expected `SBOX[x] ^ mOut` _(expression)_
    - :249 `toBe` expected `expected` _(expression)_
    - :250 `toContainText` expected `'Table property holds'` _(literal)_
- `every published vector passes, and the count in the verdict matches the rows` — e2e/claims.spec.ts:253
    - :260 `toBe` expected `rows` _(expression)_
    - :261 `toBe` expected `BLOCK_VECTORS.length` _(expression)_
    - :262 `toBe` expected `rows` _(expression)_
    - :263 `toBe` expected `rows * 2` _(expression)_
- `a frozen mask still produces the right ciphertext, and the page says that is not the tell` — e2e/claims.spec.ts:266
    - :271 `toBe` expected `BLOCK_VECTORS.find((v) => v.plaintext === pt)!.ciphertext` _(expression)_
    - :272 `toContainText` expected `'no longer protecting anything'` _(literal)_
    - :273 `toContainText` expected `'Correctness is not the tell'` _(literal)_
- `The bench — the acts, and what each verdict claims` — e2e/claims.spec.ts:277
- `Act 1 recovers the key, and the verdict agrees with the readout and the table` — e2e/claims.spec.ts:278
    - :283 `toBeVisible` expected _no expected value_ _(none)_
    - :290 `toBe` expected `real` _(expression)_
    - :291 `toBe` expected `'1 of 256'` _(literal)_
    - :293 `toBe` expected `'1'` _(literal)_
    - :294 `toBe` expected `real` _(expression)_
    - :298 `toBe` expected `parseInt(keyHex.slice(0, 2), 16)` _(expression)_
    - :304 `expect` expected _no expected value_ _(none)_
    - :305 `expect` expected _no expected value_ _(none)_
    - :307 `toEqual` expected `[claim.band[0], claim.band[1]]` _(expression)_
- `Act 2 does NOT recover it, and the page says blind rather than slow` — e2e/claims.spec.ts:310
    - :315 `toBeVisible` expected _no expected value_ _(none)_
    - :316 `expect` expected _no expected value_ _(none)_
    - :317 `expect` expected _no expected value_ _(none)_
    - :318 `expect` expected _no expected value_ _(none)_
    - :319 `expect` expected _no expected value_ _(none)_
    - :323 `expect` expected _no expected value_ _(none)_
- `Act 3 recovers it, with the NEGATIVE sign the combining identity predicts` — e2e/claims.spec.ts:328
    - :332 `toBeVisible` expected _no expected value_ _(none)_
    - :339 `expect` expected _no expected value_ _(none)_
    - :340 `expect` expected _no expected value_ _(none)_
    - :344 `expect` expected _no expected value_ _(none)_
    - :345 `expect` expected _no expected value_ _(none)_
- `the same attack on the WRONG mask sample fails — so the pair is doing the work` — e2e/claims.spec.ts:348
    - :354 `expect` expected _no expected value_ _(none)_
    - :355 `expect` expected _no expected value_ _(none)_
- `the cost ratio between Act 1 and Act 3, measured from the page, clears the floor` — e2e/claims.spec.ts:358
    - :369 `expect` expected _no expected value_ _(none)_
- `the bench fails closed, and names the cause` — e2e/claims.spec.ts:373
    - :378 `toBeVisible` expected _no expected value_ _(none)_
- `a malformed key: named cause, aria-invalid, and NO stale result left standing` — e2e/claims.spec.ts:381
    - :384 `toContainText` expected `FAILURES.keyNotHex` _(expression)_
    - :385 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :388 `toHaveCount` expected `0` _(literal)_
    - :389 `toBeHidden` expected _no expected value_ _(none)_
    - :390 `toBeHidden` expected _no expected value_ _(none)_
- `a key of the wrong length names a DIFFERENT cause than non-hex` — e2e/claims.spec.ts:393
    - :396 `toContainText` expected `FAILURES.keyWrongLength` _(expression)_
    - :397 `toBe` expected `FAILURES.keyNotHex` _(expression)_
- `a trace count below the floor and above the ceiling name different causes` — e2e/claims.spec.ts:400
    - :403 `toContainText` expected `FAILURES.traceCountTooLow` _(expression)_
    - :406 `toContainText` expected `FAILURES.traceCountTooHigh` _(expression)_
- `noise outside the modelled range is refused` — e2e/claims.spec.ts:409
    - :412 `toContainText` expected `FAILURES.noiseOutOfRange` _(expression)_
- `combining a sample with itself is refused, and says why that cannot work` — e2e/claims.spec.ts:415
    - :419 `toContainText` expected `FAILURES.samePairSamples` _(expression)_
- `controls that do not apply to the chosen attack are not on the page` — e2e/claims.spec.ts:422
    - :423 `toBeHidden` expected _no expected value_ _(none)_
    - :424 `toBeHidden` expected _no expected value_ _(none)_
    - :426 `toBeVisible` expected _no expected value_ _(none)_
    - :427 `toBeHidden` expected _no expected value_ _(none)_
- `Frozen mask — the pinned fixture and the trap` — e2e/claims.spec.ts:431
- `the default constant is the pinned one, and its prediction is re-derived here` — e2e/claims.spec.ts:444
    - :449 `toBe` expected `FROZEN_FIXTURE.pinned` _(expression)_
    - :455 `toBeCloseTo` expected `predicted, 6` _(expression)_
    - :460 `expect` expected _no expected value_ _(none)_
    - :461 `toContainText` expected `'Prediction matched'` _(literal)_
- `the predicted bench correlation is the product of the two other printed rows` — e2e/claims.spec.ts:464
    - :474 `toBeCloseTo` expected `measured / ratio, 3` _(expression)_
    - :475 `expect` expected _no expected value_ _(none)_
- `THE TRAP: a balanced constant silences the CPA while the bit attack still works` — e2e/claims.spec.ts:478
    - :481 `expect` expected _no expected value_ _(none)_
    - :484 `toBe` expected `0` _(literal)_
    - :489 `expect` expected _no expected value_ _(none)_
    - :490 `expect` expected _no expected value_ _(none)_
    - :493 `expect` expected _no expected value_ _(none)_
    - :494 `expect` expected _no expected value_ _(none)_
- `the control rows fail on BOTH attacks, so a failure means broken randomness` — e2e/claims.spec.ts:497
    - :502 `toHaveLength` expected `2` _(literal)_
    - :503 `expect` expected _no expected value_ _(none)_
- `RETIREMENT: changing the constant clears the stale verdict and says it was retired` — e2e/claims.spec.ts:506
    - :509 `toBeVisible` expected _no expected value_ _(none)_
    - :511 `toContainText` expected `'Retired'` _(literal)_
    - :512 `toHaveCount` expected `0` _(literal)_
    - :513 `toHaveCount` expected `0` _(literal)_
- `NO-OP GUARD: re-selecting the SAME constant does not retire a fresh verdict` — e2e/claims.spec.ts:516
    - :519 `toBeVisible` expected _no expected value_ _(none)_
    - :521 `toBeVisible` expected _no expected value_ _(none)_
    - :522 `toContainText` expected `'Retired'` _(literal)_
- `Cost — the recorded claims, and reproducing one` — e2e/claims.spec.ts:526
- `the printed table matches the recorded claim set exactly` — e2e/claims.spec.ts:527
    - :530 `toHaveLength` expected `DISCLOSURE_CLAIMS.length + NON_DISCLOSURE_CLAIMS.length` _(expression)_
    - :533 `expect` expected _no expected value_ _(none)_
    - :534 `expect` expected _no expected value_ _(none)_
    - :535 `expect` expected _no expected value_ _(none)_
    - :539 `expect` expected _no expected value_ _(none)_
    - :542 `expect` expected _no expected value_ _(none)_
- `the headline multiplier is the ratio of two numbers in its own table` — e2e/claims.spec.ts:548
    - :554 `toBe` expected `Math.round(second / first)` _(expression)_
    - :555 `expect` expected _no expected value_ _(none)_
    - :558 `expect` expected _no expected value_ _(none)_
    - :559 `expect` expected _no expected value_ _(none)_
- `reproducing a negative claim in the browser reaches the same answer` — e2e/claims.spec.ts:564
    - :574 `toContainText` expected `'Held'` _(literal)_
    - :575 `toContainText` expected `'no disclosure'` _(literal)_
- `RETIREMENT: changing the claim clears the previous reproduction` — e2e/claims.spec.ts:578
    - :588 `toContainText` expected `'Retired'` _(literal)_
- `Scope — the honesty the rest of the page depends on` — e2e/claims.spec.ts:592
- `names what is real, what is simulated, and what it does not prove` — e2e/claims.spec.ts:593
    - :596 `toContainText` expected `'Not production crypto'` _(literal)_
    - :597 `toContainText` expected `'Real'` _(literal)_
    - :598 `toContainText` expected `'Simulated'` _(literal)_
    - :599 `toContainText` expected `'What this page does NOT prove'` _(literal)_
    - :600 `toContainText` expected `'The power traces'` _(literal)_
- `the glitch note is present and explicitly NOT simulated` — e2e/claims.spec.ts:603
    - :606 `toContainText` expected `'glitch'` _(literal)_
    - :607 `toContainText` expected `'threshold implementations'` _(literal)_
    - :608 `toBeVisible` expected _no expected value_ _(none)_
    - :609 `toContainText` expected `'none is faked'` _(literal)_
- `the two failures are kept apart as separate claims` — e2e/claims.spec.ts:612
    - :616 `toContainText` expected `'failure of RANDOMNESS'` _(literal)_
    - :617 `toContainText` expected `'separate claim'` _(literal)_
    - :619 `toContainText` expected `'about randomness, not about masking'` _(literal)_
- `the within-encryption overclaim is explicitly disclaimed` — e2e/claims.spec.ts:622
    - :630 `toHaveAttribute` expected `'open', ''` _(expression)_
    - :631 `toContainText` expected `/WITHIN a single encryption/i` _(regex)_
    - :632 `toContainText` expected `'horizontal'` _(literal)_
    - :633 `toContainText` expected `'overclaim'` _(literal)_
- `the fixture printed on the Cost tab is the fixture the claims were recorded against` — e2e/claims.spec.ts:636
    - :639 `expect` expected _no expected value_ _(none)_
    - :640 `expect` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Masked Core

**Correlation power analysis pulls an AES-128 key byte out of a few hundred simulated
traces. First-order Boolean masking flattens the same attack to nothing. Then a
second-order combining function pulls the same byte back out.** Masking is a price, not a
wall — and this lab measures the price.

> **Not production crypto — a teaching demo.** The AES-128, the masking, and the statistics
> are real; the power traces are **simulated** from the real ciphers' real intermediate
> values. Everything runs in your browser with no backend, against a published test-vector
> key. See [What Can Go Wrong](#what-can-go-wrong) and the in-page Scope tab for exactly
> what is real, what is modelled, and what this does **not** prove.

## What It Is

An interactive bench for the countermeasure itself. The catalog already teaches defences in
several places — Nonce Guard's misuse resistance, Downgrade Wire's transcript binding,
Timing Side-Channel's constant-time compare, KEM Trap's key confirmation, Protocol Compose's
Encrypt-then-MAC. What it has not done before is make a countermeasure the object under
measurement and then break it.

The construction is **first-order Boolean masking of AES-128**. Every intermediate `x` is
carried as the pair `(x ^ m, m)` for a fresh random mask. AddRoundKey, ShiftRows and
MixColumns are GF(2)-linear, so a mask passes straight through them; the S-box is not, so
the implementation rebuilds a **masked S-box table** each round, `S'[a] = SBOX[a ^ mIn] ^ mOut`,
and the unmasked value never exists in any register.

Everything cryptographic is hand-rolled so it can be read:

- **AES-128 to FIPS-197** — the S-box is *derived* from the multiplicative inverse in
  GF(2⁸) plus the AES affine transform, not pasted in as a magic table, and the derivation
  is checked byte-for-byte against the published Figure 7. Real key schedule, real round
  function, validated against FIPS-197 Appendix B and C.1 and NIST SP 800-38A F.1.1.
- **Real masking** — table recomputation per round, with re-masking written so it cannot
  transiently unmask (the mask-domain delta is computed first, in its own named function).
  The masked cipher reproduces every published ciphertext across hundreds of mask draws.
- **Real statistics** — Pearson correlation (Brier–Clavier–Olivier 2004), the single-bit
  difference of means (Kocher–Jaffe–Jun 1999), and the centred-product second-order
  combination (Chari et al. 1999; Messerges 2000; analysed by Prouff–Rivain–Bévan 2009).
  The CPA and DPA machinery is carried over from this suite's
  [Power Trace](https://github.com/systemslibrarian/crypto-lab-power-trace) lab so the two
  benches are directly comparable.
- **Simulated traces** — generated from the real ciphers' real intermediates plus a
  Hamming-weight leakage term and Gaussian noise. Not captured from silicon.

**Security model.** The classical first-order probing model with a Hamming-weight leakage
function: power tracks the number of 1-bits in one register at a time, plus independent
Gaussian noise. That is the model in which first-order Boolean masking is provably secure,
and it is the model used by the AES trace bench. The Scope tab also includes a separate
exact four-share bit-distribution example with joint observation and discrete noise.
The AES model is an idealisation, stated
persistently on the page rather than buried — see [What Can Go Wrong](#what-can-go-wrong).

### The mathematics, in three identities

All three are verified **exhaustively** in the test suite — over all 256 masks, all 256
constants, all 8 bits — rather than sampled, and the in-page derivations are behind
disclosures so a newcomer can skip them and an expert can check them.

1. **Why one probe learns nothing.** `m -> v ^ m` is a bijection, so `{v ^ m}` is the whole
   byte space for every `v`. Both shares have identical marginal distributions whatever the
   secret is, so any statistic of one share alone carries zero information about `v`.
2. **Why two probes give it back.** Centre both leakages on 4 and multiply:
   `E[(HW(m) - 4)(HW(v ^ m) - 4)] = -(1/2)(HW(v) - 4)`. The centred product is an unbiased,
   exactly linear — and *negative* — estimator of `HW(v)`. Masking did not remove the
   secret; it moved it from the first moment to the second.
3. **What a frozen mask leaves behind.** With the mask pinned to a constant `c`,
   `rho(HW(v ^ c), HW(v)) = 1 - HW(c)/4` exactly. A low-weight constant leaves the
   correlation nearly intact; a **balanced** constant drives it to *zero*, so the attack
   reports nothing while the protection is entirely gone.

## Exhibits

1. **The split** — the headline mechanism, shown rather than asserted. Drag a secret byte
   across its whole range and watch the two shares' Hamming-weight distributions *not move*;
   watch the joint distribution tilt the instant the secret changes, with a slope of exactly
   `1 - HW(v)/4`. Both curves are computed over all 256 masks with no sampling, and the
   closed form is drawn on top of the measurement so they can be compared rather than
   believed.
2. **Masked AES** — the construction under measurement. The recomputed table with its
   defining property checked live across all 256 inputs; one masked encryption end to end,
   showing the masked state in memory beside the ciphertext it is not; and every published
   vector run through both implementations. Switch the mask source to frozen and the
   ciphertext stays perfectly correct — correctness is not the tell.
3. **The bench (Acts 1–3)** — one attack, three protections, three distinguishers, and a
   switch you can flip. *Act 1*: first-order CPA against plain AES-128 recovers key byte 0
   in a couple of hundred traces. *Act 2*: **the same attack**, with masking on, never
   converges however many traces you give it. *Act 3*: combine the mask register with the
   masked S-box output using the centred product and the key comes back — with the negative
   sign identity 2 predicts. Every control stays live afterwards, so you can pair the wrong
   samples, attack an idle cycle, or feed it a malformed key and watch it refuse.
4. **Frozen mask (Act 4)** — the countermeasure intact, the randomness gone. The default
   constant is *pinned* to `0x01` and its predicted correlation printed beside the measured
   one. Switch it to a balanced constant and the Hamming-weight attack falls silent while
   the single-bit attack on the same traces keeps recovering the key.
5. **Cost** — the recorded traces-to-disclosure band for every claim, the multiplier
   between orders, and a button that reproduces any claim in your browser on the same
   schedule the band was recorded against.
6. **Scope (Act 5)** — the leakage model stated plainly, the glitch note, and the list of
   things this page does not prove. An exact synthetic comparison lets you inspect two
   four-share Hamming-weight distributions with identical first three raw moments:
   `[1,0,6,0,1]/8` versus `[0,4,0,4,0]/8`. Their fourth moments differ (44 versus 41).
   Switch the statistic, add independent centered binomial noise, or use the identical-secret
   control. This observes a joint share sum, outside the one-register AES model, and is
   neither sampled TVLA nor hardware leakage or key recovery. It is motivated by
   [Moos, TCHES 2019, pp. 216–221](https://doi.org/10.13154/tches.v2019.i3.202-232).

## When to Use It

- **To understand why masking is deployed** — it is the countermeasure smartcards, TPMs and
  secure elements are certified on, and Act 3 shows precisely what it buys: a large,
  finite, measurable increase in the attacker's trace budget.
- **To understand why masking is hard to get right** — the re-masking ordering trap and the
  frozen-mask act are both failures that leave the countermeasure looking perfect in code
  review and in a correctness test.
- **To calibrate an intuition about attack orders** — a `d`-th order scheme needs an
  order-`(d+1)` attack, and this lab measures the 1-versus-2 step honestly.
- **Do NOT use this code in anything that protects a secret.** The AES here is a teaching
  implementation with data-dependent table lookups (a timing side channel of its own), the
  masks come from a seeded non-cryptographic PRNG, and the masking is first-order only with
  no glitch resistance. It is written to be read, not deployed.
- **Do NOT read the trace counts as hardware numbers.** They are the trace counts of this
  noise model. What transfers is the ratio between orders, and the fact that it is finite.

## Live Demo

**<https://systemslibrarian.github.io/crypto-lab-masked-core/>**

Run the three acts from the guided presets, then leave the script: raise the noise, move
the attacked sample, pair the mask register with the wrong partner, freeze the mask to a
balanced constant, and reproduce any recorded claim in your own browser.

## What Can Go Wrong

The interesting failures here are not bugs in the cipher. They are the ways a correct
countermeasure stops protecting anything.

- **Higher-order observation.** This is the headline. First-order masking defeats
  first-order leakage analysis under the modelled assumptions, and does not protect against
  an attacker who can combine two samples. Act 3 proves exactly that sentence and nothing
  broader.
- **Broken randomness.** Act 4. Freeze the mask to a constant — an RNG that was never
  seeded, a mask computed once at boot, a test harness left in a shipping build — and the
  masked value becomes a deterministic function of the unmasked one. Every line of the
  countermeasure is still there and the ciphertext is still correct. **This is a separate
  lesson from Act 3**, and the lab deliberately keeps the two claims apart: it is a failure
  of randomness, not of masking.
- **The balanced-constant trap.** A frozen constant of Hamming weight 4 drives the
  Hamming-weight correlation to *exactly* zero. An attack that reports nothing looks
  identical to a countermeasure that is working. This is why the lab pins its fixture and
  leads Act 4 with a single-bit distinguisher, which recovers the key for *any* fixed
  constant.
- **Re-masking that transiently unmasks.** Writing `state ^ mask ^ mIn` left to right puts
  the unmasked byte in a register for one instruction. The scheme on paper is untouched and
  a first-order probe reads the secret straight off.
- **Glitches — and this is the one that matters most.** A masking scheme can be *proven*
  secure in the probing model and still leak at first order in real hardware, because a
  combinational glitch can transiently compute a function of both shares at once. The proof
  said no single wire depends on the secret; the glitch does not respect the boundary the
  proof drew. This is why **threshold implementations** exist. **No glitch is simulated
  here, and none is faked** — inventing a hardware model in order to "demonstrate" a glitch
  leak would be a made-up result dressed as evidence, so the boundary is named instead.
- **Also outside the model:** transitions (real registers leak the Hamming *distance*
  between successive values) and coupling between neighbouring wires, either of which can
  recombine shares the probing model treats as separate; imperfect randomness short of a
  frozen mask; and masking orders above one.

- **A negative leakage test is not a security guarantee.** [Buschkowski, Höher and Güneysu, *Sparse Secrets, Dense Problems*, ePrint 2026/2509 (17 October 2026; preprint)](https://eprint.iacr.org/2026/2509) report a profiled horizontal attack on a masked HQC FPGA multiplier. With 200 traces it locates secret nonzero positions within ±8 places, despite TVLA (test-vector leakage assessment) detecting no leakage after 10 million traces. This approximate position recovery does not establish complete key recovery or a mathematical break of HQC. The authors also add hiding countermeasures. The Scope tab links this example to the model's limitations: it requires profiled hardware measurements, while this AES lab uses simulated traces and does not implement HQC, reproduce the FPGA attack, or establish hardware resistance.

## Real-World Usage

Boolean masking is the mainstream software countermeasure against differential power
analysis, and it is what smartcard, TPM and secure-element evaluations under Common
Criteria and EMVCo are largely arguing about. It is also why hardware people talk about
**threshold implementations** and **domain-oriented masking**: those exist because the
probing-model proof this lab measures does not survive contact with combinational glitches.

The second-order attack here is the standard published one. Chari, Jutla, Rao and Rohatgi
established the theory of higher-order attacks against secret-sharing countermeasures in
1999; Messerges introduced the practical combining functions in 2000; Prouff, Rivain and
Bévan gave the statistical analysis of the centred product in 2009, which is where the
`-(1/2)(HW(v) - 4)` identity on this page comes from. The trace-count blow-up between
orders is the whole reason masking is worth deploying despite being breakable — and the
whole reason it is not sufficient on its own.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-masked-core.git
cd crypto-lab-masked-core
npm install
npm run dev            # http://localhost:5173/crypto-lab-masked-core/
`​``

`​``bash
npm test               # unit suite: spec KATs, exhaustive identities, seeded band gate
npm run build          # typecheck + production build
npx playwright install chromium
npm run test:a11y      # the WCAG 2.1 AA gate, against the production build
npm run test:claims    # the claims suite: does the page tell the truth?
`​``

## Related Demos

- **[Power Trace](https://github.com/systemslibrarian/crypto-lab-power-trace)** — the
  unprotected side of this story, and the origin of the CPA/DPA machinery reused here.
  Start there if correlation power analysis is new to you.
- **[Timing Side-Channel](https://github.com/systemslibrarian/crypto-lab-timing-side-channel)**
  and **[Timing Oracle](https://github.com/systemslibrarian/crypto-lab-timing-oracle)** —
  the other classical channel, and a countermeasure (constant-time compare) taught as part
  of the fix rather than as the subject.
- **[Nonce Guard](https://github.com/systemslibrarian/crypto-lab-nonce-guard)** — another
  countermeasure under load, and another lab where the failure is about randomness rather
  than about the primitive.
- **[Entropy Collapse](https://github.com/systemslibrarian/crypto-lab-entropy-collapse)** —
  what else breaks when the random numbers stop being random.

## Build & Verify

Vite + TypeScript, no runtime dependencies, static to GitHub Pages.

**Unit suite — 139 tests across 11 files (`npm test`), all passing.**

| File | What it proves |
|---|---|
| `src/aes/aes.test.ts` | FIPS-197 KATs: the derived S-box against published Figure 7, round keys 1 and 10 from Appendix A.1, the Appendix B round-1 trace step by step, six single-block ciphertexts from Appendix B, C.1 and SP 800-38A F.1.1, and the linearity of MixColumns and ShiftRows measured rather than assumed |
| `src/mask/maskedAes.test.ts` | the masked cipher reproduces every published ciphertext across 64 mask draws each and 200 random blocks; the recomputed table's defining property across all 256 inputs; the round-1-only bench path produces identical probes to the full ten-round cipher |
| `src/mask/combining.test.ts` | the three identities, exhaustively — the marginals, the centred product (checked two independent ways), the frozen-mask correlation over all 256 constants, and the single-bit difference over all 256 constants × 8 bits |
| `src/claims/bands.test.ts` | the seeded traces-to-disclosure band gate, and the cost-ratio floor |
| `src/attack/*.test.ts` | the streaming accumulators against direct two-pass computations; the second-order prefix algebra against a naive re-implementation; the stability rule on a scripted rank sequence |
| `src/leakage/traces.test.ts` | the bench is deterministic, protections are a controlled experiment, and unmasking a noiseless masked trace reproduces the unprotected one exactly |

**Known-answer vector sources** are in `src/aes/vectors.ts`, copied from the standards
(FIPS-197 Figure 7, A.1, B, C.1; NIST SP 800-38A F.1.1) rather than generated by this code —
which is the only thing that makes them a test rather than a restatement.

**The statistical claims are gated deterministically.** Failing the build when "the
second-order attack stops working" would be flaky: a statistical attack near its disclosure
threshold varies run to run. Instead the PRNG seed and the checkpoint schedule are pinned
and each claim records a *band* the traces-to-disclosure must land in
(`src/claims/bands.ts`). Bands are wide enough that six different seeds all land inside
them and narrow enough that a broken model cannot. If this masked implementation suddenly
*resisted* second-order CPA in this model, the model would have broken — nothing about the
masking would have improved — and a band violation is what surfaces that.

**Accessibility is enforced, not aspirational.** `@axe-core/playwright` scans the
*production build* for zero WCAG 2.1 A/AA violations at 1280px and at 380px, across every
state the lab renders — including all four verdict tones, four different refusal paths, the
retired-verdict states, every disclosure, three hover states and three focus rings. The gate
also computes contrast arithmetically (axe declines to judge `color-mix()` fills, which is
what every verdict on this page is made of), asserts axe's `incomplete` bucket rather than
only `violations`, and carries a non-text-contrast oracle ratcheted against an empty
baseline. Both it and the claims suite block the Pages deploy.

## Performance

Everything runs in one browser tab with no worker. A 30,000-trace second-order attack —
generating the traces from the real masked cipher, accumulating five sums per key guess, and
reading the correlation at 25 checkpoints — takes well under a second on a laptop; the
120,000-trace claim reproduction takes a few seconds. Traces are streamed in 3,000-trace
chunks and never stored, so the page yields to the browser between chunks and memory is flat
regardless of the trace count.

The second-order attack's prefix algebra is what makes the convergence curve affordable.
Re-centring on each checkpoint's own means naively needs one pass per checkpoint; expanding
the centred product against the prefix means turns all of them into fixed combinations of
raw running sums, so the exact curve comes out of a single pass. `secondOrder.test.ts`
checks that against a direct two-pass implementation at six different prefix lengths rather
than taking the algebra on trust.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Hidden Bit

- **slug**: `crypto-lab-hidden-bit`
- **repo**: https://github.com/systemslibrarian/crypto-lab-hidden-bit
- **live**: https://systemslibrarian.github.io/crypto-lab-hidden-bit/
- **commit_sha**: `d7bbb30b05a610e42f7134b39ba2cd0cf23a6bc8` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `c33239427eb3a45babf55f1ab81af8919e5be771`
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: advanced  ·  **--accent**: #e4572e
- **MISSING FIELDS**: verification

**Name (H1)**: Hidden Bit  — _read from index.html_

**Subtitle**: Security games · Adjacent hybrids · Hard-core predicates  — _read from index.html_

**Description**: Run hidden-bit games over real primitives, account for each AES hybrid hop, and turn a stipulated inner-product predictor into an independently verified bounded preimage list.  — _read from index.html_

**Why it matters**: Every "provably secure" claim in this lab is a sentence about a game like this one. Knowing what the game can show — a break — and what it cannot — safety — is the difference between reading a security proof and being reassured by a histogram.  — _read from index.html_

**Card copy**: Test selected security games, trace an AES-based GGM tree, account for adjacent AES hybrids, run a bounded hard-core-predicate reconstruction, and compare target-before-key with key-first collision games. Each result states its attacker, assumptions and scope.

**Chips**: IND-CPA · EUF-CMA · PRP/PRF Switching · DDH Reduction · Multi-Key Toy · Adjacent Hybrids · Goldreich–Levin · Target Collision

**Implements**: AES `src/prf/ggm.ts:21`, AES-CBC `src/schemes/aes-modes.ts:37`, AES-CTR `src/schemes/aes-modes.ts:47`, AES-GCM `src/schemes/aes-modes.ts:59`, Diffie-Hellman `src/reduction/ddh.ts:87`, ECDSA `src/schemes/ecdsa.ts:10`, Ed25519 `src/schemes/ed25519.ts:3`, ElGamal `src/game/cca.ts:34`, Hash-to-curve `src/schemes/elgamal.ts:29`, P-256 `src/kats.ts:3`, ristretto255 `src/schemes/elgamal.ts:22`, RSA `src/game/cca.ts:84`, RSA-OAEP `src/game/cca.ts:84`, RSA-PSS `src/schemes/rsa-pss.ts:4`, secp256k1 `src/schemes/ecdsa.ts:1`, SHA-256 `src/ui/hybridProof.ts:148`

**Attacks shown**: Chosen-ciphertext attack `src/game/cca.ts:1`, Chosen-plaintext attack `src/game/challenger.ts:18`, Ciphertext malleability `README.md:47`, Signature malleability `README.md:49`

**References**: AES-ECB, AES-SIV, Goldwasser–Micali, ML-KEM, SHA-512, Simon

**Standards body**: IETF, NIST, SECG

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `10.1145/100216.100269` — first seen README.md:61 (1×)
- `10.1145/73007.73011` — first seen README.md:60 (1×)
- `CRYPTO 1991` — first seen README.md:218 (1×)
- `CRYPTO 1997` — first seen README.md:63 (1×)
- `CRYPTO 1998` — first seen README.md:219 (1×)
- `crypto1998` — first seen README.md:219 (1×)
- `doi.org/10.1007/3-540-46766-1_1` — first seen README.md:218 (1×)
- `doi.org/10.1007/978-3-030-71522-9_624` — first seen README.md:52 (1×)
- `doi.org/10.1016/0022-0000(84` — first seen README.md:217 (1×)
- `doi.org/10.1137/0217017` — first seen README.md:220 (1×)
- `eprint.iacr.org/1997/009` — first seen README.md:63 (1×)
- `eprint.iacr.org/2004/331` — first seen README.md:78 (2×)
- `eprint.iacr.org/2004/332` — first seen README.md:78 (2×)
- `eprint.iacr.org/2018/136` — first seen README.md:51 (1×)
- `EUROCRYPT 2006` — first seen README.md:221 (1×)
- `FIPS 197` — first seen README.md:13 (6×)
- `RFC 6979` — first seen README.md:115 (5×)
- `RFC 8032` — first seen README.md:115 (5×)
- `rfc6979` — first seen README.md:224 (1×)
- `rfc8032` — first seen README.md:224 (1×)

**README — What Can Go Wrong**:

```text
- **Deterministic encryption leaks equality.** Textbook RSA and AES-ECB let re-encryption identify the challenge exactly.
- **Predictable CBC IVs leak the first block.** Chaining the previous ciphertext tail into the next IV gives the BEAST-style adversary a chosen-plaintext equality test.
- **Malleable ciphertexts defeat the CCA game.** ElGamal permits a related ciphertext whose decryption reveals a related group element even though the exact challenge is refused.
- **Algebraic signatures invite forgeries.** Textbook RSA signatures preserve multiplication and blinding.
- **ECDSA has two valid $s$ values.** A plain verifier accepts $(r,n-s)$; canonical low-S verification removes that encoding malleability. [BIP-146](https://github.com/bitcoin/bips/blob/master/bip-0146.mediawiki) is a closed proposal that documents the rule and its relay-policy history, not a claim that this lab implements Bitcoin consensus.
- **Finite samples fluctuate.** Every advantage estimate carries a Wilson 95% interval; the switching chart uses a separately displayed conservative alarm tolerance.
- **Single-key claims need their own multi-key analysis.** The toy's $Q\epsilon$ ceiling is a union bound on its independent, publicly marked rare events. Real security definitions and reductions may have different resource accounting and tighter bounds. See Bellare, Boldyreva and Micali, [*Public-Key Encryption in a Multi-User Setting*](https://cseweb.ucsd.edu/~mihir/papers/musu.pdf), and Bose, Hoang and Tessaro, [*Revisiting AES-GCM-SIV: Multi-user Security, Faster Key Derivation, and Better Bounds*](https://eprint.iacr.org/2018/136).
- **Winning one order of play says nothing about the other.** Collision resistance hands the adversary the key before it picks anything; target collision resistance makes it commit the target first. On the planted toy, both the direct planted-pair strategy and the exhaustive scan win target-first for 2 of 256 keys and key-first for all 256; the committed target therefore survives 254 of 256 target-first keys. This fixed, length-preserving 8-to-8-bit model illustrates challenge order only. It is not a UOWHF construction, an asymptotic separation proof, or evidence about real hashes; see the exhibit's guard rails and the [UOWHF survey](https://doi.org/10.1007/978-3-030-71522-9_624).
- **A broken generator defeats the tree construction.** With $G(s)=s\parallel s$, all input paths have the same leaf state and bit. The AES-based generator is a length-doubling PRG candidate under the AES-128 PRP assumption; its one sample of distinct-looking branches is not a security proof.
- **Endpoint comparisons can hide an unjustified proof step.** The guided ledger permits only the canonical $H_0$-through-$H_5$ prefix and keeps the AES-PRP term symbolic. The displayed switching contribution counts distinct inputs and uses the 128-bit bound $q(q-1)/2^{129}$.
- **One-wayness does not hide every input predicate.** Conditional on $f$ being one-way, $(f(x),r)$ remains one-way as a function of $(x,r)$, but the input predicate $r_0$ is copied into its output. The eight-bit SHA-256 fixture is exhaustible, so it is not evidence that the fixture is one-way.
- **The reconstruction begins with a predictor premise.** The artificial predictor is stipulated for one fixed $x$, ignores $y$, and is wrong only at the all-zero $r$. Its bias is exhaustively audited; it is not learned, not a SHA-256 attack, and not evidence that a useful predictor exists. Goldreich–Levin concerns a one-way-function family indexed by a security parameter and a probabilistic polynomial-time predictor with non-negligible advantage, none of which an eight-bit run establishes.
```

**Claims tested** (e2e/claims.spec.ts, 19 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:81
    - :81 `toBeEnabled` expected `{ timeout: 30_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:82
    - :82 `toHaveText` expected `'Hidden Bit'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:105
    - :105 `toContainText` expected `'Fresh result', { timeout: 90_000 }` _(expression)_
- `headline advantage and ledger are independently consistent` — e2e/claims.spec.ts:112
    - :119 `toBe` expected `trials` _(expression)_
    - :120 `toBe` expected `20` _(literal)_
    - :121 `toBe` expected `0` _(literal)_
    - :122 `toBeCloseTo` expected `(2 * wins) / trials - 1, 12` _(expression)_
- `changing an input retires a result while a no-op does not` — e2e/claims.spec.ts:126
    - :130 `toBe` expected `freshText` _(expression)_
    - :132 `toContainText` expected `'retired'` _(literal)_
    - :133 `toHaveText` expected `'0'` _(literal)_
    - :134 `toContainText` expected `'READY FOR AN ADVERSARY'` _(literal)_
- `negative claim survives green KATs and two misleading flat lines` — e2e/claims.spec.ts:137
    - :140 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :147 `toContainText` expected _no expected value_ _(none)_
    - :150 `toHaveAttribute` expected `'data-done', 'true'` _(expression)_
    - :151 `toHaveAttribute` expected `'data-done', 'true'` _(expression)_
    - :154 `expect` expected _no expected value_ _(none)_
- `ECDSA values reconstruct the accepted high-S twin` — e2e/claims.spec.ts:157
    - :161 `toContainText` expected `'Fresh result'` _(literal)_
    - :169 `expect` expected _no expected value_ _(none)_
    - :172 `expect` expected _no expected value_ _(none)_
    - :185 `expect` expected _no expected value_ _(none)_
    - :186 `toBe` expected `SECP_N` _(expression)_
    - :187 `toBe` expected `n - s` _(expression)_
    - :188 `toBe` expected `r` _(expression)_
    - :189 `toBe` expected `malleatedS` _(expression)_
    - :190 `expect` expected _no expected value_ _(none)_
    - :199 `toBe` expected `true` _(expression)_
    - :205 `toContainText` expected `'VERIFIES — AND IS A NEW SIGNATURE ON A QUERIED MESSAGE'` _(literal)_
    - :211 `toBe` expected `true` _(expression)_
    - :219 `toHaveText` expected _no expected value_ _(none)_
    - :222 `toHaveText` expected _no expected value_ _(none)_
- `displayed textbook RSA forgeries verify on unqueried messages` — e2e/claims.spec.ts:228
    - :233 `toContainText` expected `'Fresh result'` _(literal)_
    - :242 `expect` expected _no expected value_ _(none)_
    - :243 `toBe` expected `message` _(expression)_
    - :244 `toHaveAttribute` expected `'data-tone', 'alarm'` _(expression)_
- `switching rows match the formula and stay under bound plus tolerance` — e2e/claims.spec.ts:248
    - :256 `toContainText` expected `'Fresh switching curve', {` _(expression)_
    - :260 `expect` expected _no expected value_ _(none)_
    - :272 `toBeCloseTo` expected `(q * (q - 1)) / (2 * 2 ** bits), 5` _(expression)_
    - :273 `expect` expected _no expected value_ _(none)_
- `GGM tree follows independent AES branches and exposes the repeated-seed failure` — e2e/claims.spec.ts:277
    - :279 `toBeVisible` expected _no expected value_ _(none)_
    - :280 `toHaveCount` expected `2` _(literal)_
    - :283 `expect` expected _no expected value_ _(none)_
    - :296 `toHaveText` expected `expected` _(expression)_
    - :297 `toHaveText` expected _no expected value_ _(none)_
    - :304 `toEqual` expected `Array(8).fill(hex)` _(expression)_
    - :308 `toBe` expected `hex` _(expression)_
    - :309 `toContainText` expected `'state 0x${newHex}'` _(expression)_
- `DDH wrapper reports the stated factor within its displayed interval` — e2e/claims.spec.ts:312
    - :316 `toContainText` expected `'Fresh reduction run', { timeout: 90_000 }` _(expression)_
    - :321 `toBeCloseTo` expected `a / 2, 2` _(expression)_
    - :322 `expect` expected _no expected value_ _(none)_
- `adjacent AES hybrids and executable oracle boundaries are independently checkable` — e2e/claims.spec.ts:325
    - :331 `toBe` expected `5` _(literal)_
    - :332 `expect` expected _no expected value_ _(none)_
    - :345 `toBe` expected `'48'` _(literal)_
    - :346 `toBe` expected `'H5'` _(literal)_
    - :348 `toBe` expected _no expected value_ _(none)_
    - :358 `toBe` expected `'true'` _(literal)_
    - :367 `toHaveText` expected `independentAes` _(expression)_
    - :370 `toHaveText` expected `'yes'` _(literal)_
    - :371 `toHaveText` expected `'yes'` _(literal)_
    - :372 `toHaveText` expected `'2'` _(literal)_
    - :373 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :375 `toHaveText` expected `'allowed after 2 draws'` _(literal)_
    - :376 `toHaveText` expected _no expected value_ _(none)_
- `exposed predicate and Goldreich-Levin reconstruction match independent arithmetic` — e2e/claims.spec.ts:381
    - :383 `toBeEnabled` expected _no expected value_ _(none)_
    - :387 `toBe` expected `'10011010'` _(literal)_
    - :388 `toBe` expected `publicR[0]` _(expression)_
    - :389 `toBe` expected `publicR[0]` _(expression)_
    - :390 `toBe` expected `'256 / 256'` _(literal)_
    - :397 `toBe` expected `independentImage` _(expression)_
    - :398 `toBe` expected `publicR[0]` _(expression)_
    - :401 `toContainText` expected `'Fresh uniform reconstruction run', {` _(expression)_
    - :412 `toBe` expected `independentImage` _(expression)_
    - :413 `toBe` expected `'${correct} / ${total}'` _(expression)_
    - :414 `toBe` expected `epsilon` _(expression)_
    - :415 `toBe` expected `advantage` _(expression)_
    - :416 `toBe` expected `advantage` _(expression)_
    - :417 `toBe` expected `String(ell)` _(expression)_
    - :418 `toBe` expected `String(subsets)` _(expression)_
    - :419 `toBe` expected `String(2 ** ell)` _(expression)_
    - :422 `toBe` expected `String(queriesPerAttempt)` _(expression)_
    - :423 `toBe` expected `String(attempts * queriesPerAttempt)` _(expression)_
    - :425 `toHaveLength` expected `ell` _(expression)_
    - :426 `toMatch` expected `/^[01]{8}$/` _(regex)_
    - :428 `expect` expected _no expected value_ _(none)_
    - :435 `toBe` expected `independentImage` _(expression)_
- `exact CCA challenge is refused and hidden panels stay unpainted` — e2e/claims.spec.ts:443
    - :447 `toContainText` expected `'Fresh CCA2 result'` _(literal)_
    - :449 `toBe` expected `0` _(literal)_
    - :454 `toContainText` expected `'Fresh CCA2 result'` _(literal)_
    - :456 `toHaveText` expected `'1.000'` _(literal)_
    - :463 `toEqual` expected `[]` _(expression)_
    - :465 `toMatch` expected `/\bsecure\b/i` _(regex)_
- `every exhibit retires stale output and switching refuses excessive work` — e2e/claims.spec.ts:468
    - :473 `toContainText` expected `'Fresh CCA2 result'` _(literal)_
    - :475 `toHaveText` expected `'0'` _(literal)_
    - :476 `toContainText` expected `'NOT QUERIED YET'` _(literal)_
    - :481 `toContainText` expected `'Fresh result'` _(literal)_
    - :483 `toContainText` expected `'Previous transcript retired'` _(literal)_
    - :484 `toBeHidden` expected _no expected value_ _(none)_
    - :491 `toContainText` expected `'Fresh switching curve'` _(literal)_
    - :493 `toContainText` expected `'Previous curve retired'` _(literal)_
    - :494 `expect` expected _no expected value_ _(none)_
    - :499 `toContainText` expected `'the cap is 2,000,000'` _(literal)_
    - :504 `toContainText` expected `'Fresh reduction run'` _(literal)_
    - :506 `toHaveText` expected `'0.000'` _(literal)_
    - :507 `toContainText` expected `'RESULT RETIRED'` _(literal)_
- `all vulnerable choices are labelled and never selected by default` — e2e/claims.spec.ts:510
    - :511 `toHaveValue` expected `'rsa-oaep'` _(literal)_
    - :513 `expect` expected _no expected value_ _(none)_
    - :514 `expect` expected _no expected value_ _(none)_
    - :515 `expect` expected _no expected value_ _(none)_
    - :517 `toHaveValue` expected `'rsa-oaep-cca'` _(literal)_
    - :519 `toHaveValue` expected `'rsa-pss'` _(literal)_
- `target-collision definitions distinguish the three notions and the signed pair` — e2e/claims.spec.ts:524
    - :527 `expect` expected _no expected value_ _(none)_
    - :528 `expect` expected _no expected value_ _(none)_
    - :529 `expect` expected _no expected value_ _(none)_
    - :530 `expect` expected _no expected value_ _(none)_
    - :531 `expect` expected _no expected value_ _(none)_
    - :533 `expect` expected _no expected value_ _(none)_
    - :534 `expect` expected _no expected value_ _(none)_
    - :538 `expect` expected _no expected value_ _(none)_
    - :539 `expect` expected _no expected value_ _(none)_
    - :543 `toBeVisible` expected _no expected value_ _(none)_
    - :545 `expect` expected _no expected value_ _(none)_
    - :546 `toContainText` expected `'key first, then both inputs'` _(literal)_
    - :547 `toContainText` expected `'uniformly sampled challenge'` _(literal)_
    - :548 `toContainText` expected `'target first, then the key, then the partner'` _(literal)_
    - :549 `toContainText` expected `'record every accepted or refused move that the selected strategy actually attempts'` _(literal)_
    - :554 `expect` expected _no expected value_ _(none)_
    - :555 `expect` expected _no expected value_ _(none)_
    - :556 `expect` expected _no expected value_ _(none)_
    - :557 `expect` expected _no expected value_ _(none)_
    - :563 `expect` expected _no expected value_ _(none)_
    - :564 `expect` expected _no expected value_ _(none)_
    - :565 `expect` expected _no expected value_ _(none)_
    - :566 `expect` expected _no expected value_ _(none)_
    - :567 `expect` expected _no expected value_ _(none)_
    - :568 `toContainText` expected `'No browser run of an 8-bit toy establishes or measures that'` _(literal)_
    - :574 `expect` expected _no expected value_ _(none)_
    - :575 `toHaveAttribute` expected _no expected value_ _(none)_
    - :579 `toHaveAttribute` expected _no expected value_ _(none)_
- `target-collision results retire when the configuration moves` — e2e/claims.spec.ts:585
    - :598 `expect` expected _no expected value_ _(none)_
    - :605 `toBe` expected `freshSample.text` _(expression)_
    - :606 `toContainText` expected `'uniform-key sample is unchanged'` _(literal)_
    - :617 `toContainText` expected `'Sample retired'` _(literal)_
    - :620 `toBe` expected `targetTranscript` _(expression)_
    - :621 `toBe` expected `collisionTranscript` _(expression)_
    - :622 `toContainText` expected `'game transcripts are unchanged'` _(literal)_
    - :625 `toContainText` expected `'retired'` _(literal)_
    - :628 `toContainText` expected `'Sample retired'` _(literal)_
- `target-collision sampler refuses budgets outside its teaching bound` — e2e/claims.spec.ts:638
    - :644 `toContainText` expected `'Trials must be an integer from 32 through 2,048'` _(literal)_
    - :646 `expect` expected _no expected value_ _(none)_

**Mutation records** (1 file(s)):

- `e2e/mutation-registry.ts` (2749 bytes)

<details><summary>Full README</summary>

```markdown
# Hidden Bit

## What It Is

Hidden Bit is a browser lab for the experiments behind IND-CPA, IND-CCA2, EUF-CMA, strong unforgeability, the PRP/PRF switching lemma, adjacent-hybrid proofs, hard-core predicates, and target collision resistance. It runs real AES-128 ECB/CBC/CTR/GCM, RSA-2048 textbook/OAEP/PSS, ristretto255 ElGamal, secp256k1 ECDSA, and Ed25519 operations. Its hidden-bit guessing exhibits measure each named adversary with the normalized definition

$$
\operatorname{Adv}(A)=2\frac{\text{wins}}{\text{trials}}-1.
$$

The target-collision exhibit is a search game with no hidden coin, so it reports the adversary's raw win probability $p$, not the normalized guessing advantage $2p-1$.

AES CBC/CTR/GCM and RSA OAEP/PSS use WebCrypto with SHA-256 where the RSA construction requires it. RSA keys are generated once as extractable JWK material, so the same $n$, $e$, and $d$ also drive the inspectable textbook-RSA arithmetic. ElGamal, ECDSA, Ed25519, and AES-ECB use the audited Noble packages; ristretto255's hash-to-group uses SHA-512. [`@noble/ciphers`](https://github.com/paulmillr/noble-ciphers) is used for ECB because WebCrypto deliberately does not expose that unauthenticated mode; the implementation is still checked against FIPS 197.

The switching game's ideal permutation and ideal function are faithfully lazy-sampled mathematical oracles. Its GGM tree uses real AES block evaluations and a deliberately insecure comparison generator; it is a construction lesson, not a sampled security game. A separate proof lesson walks five adjacent AES hybrids, contrasts an exposed input predicate with the Goldreich–Levin inner product, and runs a bounded Rackoff-style reconstruction whose candidates are independently rehashed. This is not production crypto: keys live only in browser memory, deliberately vulnerable choices are teaching fixtures, trial counts are finite, and the interface exposes values a production system would hide.

## Exhibits

1. **Hidden-bit IND-CPA game.** Pick RSA-OAEP, ristretto255 ElGamal, textbook RSA, or an AES mode; choose random guessing, re-encryption, or the chained-IV predictor; then run, stop, or step one real trial. The sealed coin, oracle transcript, trial tape, histogram, Wilson 95% interval, and complete ledger update together.
2. **Adaptive CCA2 oracle.** Submit a modified ElGamal or RSA-OAEP challenge. The oracle visibly refuses the exact challenge bytes. ElGamal's group-element malleation reaches advantage one; OAEP's decoder rejects the bit-flip tactic uniformly. The OAEP adversary then guesses, so a small run can show a positive 95% interval by chance; the page labels that result as a sample, not a break.
3. **Chosen-message signature oracle.** Produce multiplicative and blinding forgeries against textbook RSA, compare altered RSA-PSS and Ed25519 signatures, and compute ECDSA's $(r,n-s)$ twin. The same twin is checked by a plain verifier (`lowS: false`) and Noble's default low-S verifier, and each verifier's banner reports what that verifier actually returned — either can render the opposite outcome.
4. **PRP/PRF switching game and GGM tree.** Lazily sample an ideal $n$-bit permutation or function for selectable $8 \le n \le 20$. A collision-finding adversary is measured across growing $q$ and plotted against $q(q-1)/2^{n+1}$, with the expression also shown at $n=128$. Below the game, click paths in a three-level Goldreich–Goldwasser–Micali tree: $G(s)=\mathrm{AES}_s(0^{128})\parallel\mathrm{AES}_s(0^{127}1)$ produces two 128-bit child seeds; $G(s)=s\parallel s$ repeats every state and leaf bit. Selecting a path shows the full leaf state and its first bit; drawing a fresh seed updates both trees.
5. **Live reduction.** Wrap either public-oracle IND-CPA adversary inside a DDH distinguisher. The page measures both sides and checks the convention $\operatorname{Adv}(B)=\operatorname{Adv}(A)/2$ within a displayed combined sampling interval.
6. **Multi-key rare-signal toy.** Choose independent user instances, queries per user, and a per-query tagged reveal chance. A shared challenge bit becomes known if any signal appears; otherwise the adversary guesses. Run a sample game and compare the exact toy advantage $1-(1-\epsilon)^Q$ with the union ceiling $\min(1,Q\epsilon)$ for total opportunities $Q$. This is an abstract game, not AES, an IND-CPA experiment, or a claim that every real multi-user bound scales by $Q$. If a single-key bound already accounts for queries, do not count them again.
7. **Adjacent hybrids and a hard-core predicate.** Advance only from $H_i$ to $H_{i+1}$ while the ledger classifies exact rewrites, the symbolic AES-PRP assumption, and the switching bad event $q(q-1)/2^{129}$. Executable real-AES and lazy-oracle checks expose deterministic caching, clone safety, and forced-collision policy. Then inspect the conditional counterexample $F(x,r)=(f(x),r)$, where the input predicate $r_0$ is public, and run a bounded Goldreich–Levin reconstruction for $\langle x,r\rangle \bmod 2$. The decoder receives only the public image, access to an artificial biased-predictor oracle, and an independent preimage verifier; it never receives $x$.

8. **Target collisions and the order of play (S09).** One small keyed family, $H_s(x) = h(x \oplus s)$, is played as two state machines. Target-first, the adversary commits $x$ before the key exists and the machine refuses a second target, a target after the key, and a partner equal to $x$; key-first, the key is published before any input is chosen and choosing early is refused. The planted family ($h$ = identity except one colliding pair at $\{0x0F, 0xF0\}$) separates the orders by exhaustive count: with its fixed $0xF0$ target, plant-shift wins every key-first game and only 2 of 256 target-first games. Mask symmetry separately shows that the family-level target winnability is 2 of 256 keys for every fixed target. The nibble-fold control has fifteen partners everywhere, so the exhaustive scan wins both orders; the direct planted-pair strategies lose both, keeping selected-strategy outcomes separate from family winnability. A signed (key, digest) pair panel explains why hash-then-sign with a committed message makes the forger face exactly the target-collision order, and every exact-analysis chance is a complete count over the key space, with a separate bounded sampler bracketed by Wilson intervals.

The chained-IV CBC fixture is the lab's negative claim: random guessing and re-encryption can both flatten while all three KATs pass, yet the BEAST-style IV predictor still reaches advantage one. A near-zero measurement means those adversaries failed; it is not evidence of IND-CPA security.

## When to Use It

Use this lab to learn how game-based definitions constrain an oracle, how an advantage estimate is assembled, how a chosen-ciphertext or chosen-message attack crosses a definition boundary, what a reduction actually does with an adversary, and why a proof must account for every adjacent game change.

Do not use it to assess TLS, Signal, a deployed key-management system, or a protocol implementation. Do not treat a flat histogram, a small-domain reconstruction, or one successful random run as a proof. The lab covers neither proof assistants nor symbolic analysis, CCA1, NM-CPA, arbitrary visitor-authored adversaries, nor KEM definitions.

## Live Demo

[Open Hidden Bit on GitHub Pages](https://systemslibrarian.github.io/crypto-lab-hidden-bit/).

Everything runs locally in the browser. No key, message, trial result, or telemetry is sent to a backend.

## What Can Go Wrong

- **Deterministic encryption leaks equality.** Textbook RSA and AES-ECB let re-encryption identify the challenge exactly.
- **Predictable CBC IVs leak the first block.** Chaining the previous ciphertext tail into the next IV gives the BEAST-style adversary a chosen-plaintext equality test.
- **Malleable ciphertexts defeat the CCA game.** ElGamal permits a related ciphertext whose decryption reveals a related group element even though the exact challenge is refused.
- **Algebraic signatures invite forgeries.** Textbook RSA signatures preserve multiplication and blinding.
- **ECDSA has two valid $s$ values.** A plain verifier accepts $(r,n-s)$; canonical low-S verification removes that encoding malleability. [BIP-146](https://github.com/bitcoin/bips/blob/master/bip-0146.mediawiki) is a closed proposal that documents the rule and its relay-policy history, not a claim that this lab implements Bitcoin consensus.
- **Finite samples fluctuate.** Every advantage estimate carries a Wilson 95% interval; the switching chart uses a separately displayed conservative alarm tolerance.
- **Single-key claims need their own multi-key analysis.** The toy's $Q\epsilon$ ceiling is a union bound on its independent, publicly marked rare events. Real security definitions and reductions may have different resource accounting and tighter bounds. See Bellare, Boldyreva and Micali, [*Public-Key Encryption in a Multi-User Setting*](https://cseweb.ucsd.edu/~mihir/papers/musu.pdf), and Bose, Hoang and Tessaro, [*Revisiting AES-GCM-SIV: Multi-user Security, Faster Key Derivation, and Better Bounds*](https://eprint.iacr.org/2018/136).
- **Winning one order of play says nothing about the other.** Collision resistance hands the adversary the key before it picks anything; target collision resistance makes it commit the target first. On the planted toy, both the direct planted-pair strategy and the exhaustive scan win target-first for 2 of 256 keys and key-first for all 256; the committed target therefore survives 254 of 256 target-first keys. This fixed, length-preserving 8-to-8-bit model illustrates challenge order only. It is not a UOWHF construction, an asymptotic separation proof, or evidence about real hashes; see the exhibit's guard rails and the [UOWHF survey](https://doi.org/10.1007/978-3-030-71522-9_624).
- **A broken generator defeats the tree construction.** With $G(s)=s\parallel s$, all input paths have the same leaf state and bit. The AES-based generator is a length-doubling PRG candidate under the AES-128 PRP assumption; its one sample of distinct-looking branches is not a security proof.
- **Endpoint comparisons can hide an unjustified proof step.** The guided ledger permits only the canonical $H_0$-through-$H_5$ prefix and keeps the AES-PRP term symbolic. The displayed switching contribution counts distinct inputs and uses the 128-bit bound $q(q-1)/2^{129}$.
- **One-wayness does not hide every input predicate.** Conditional on $f$ being one-way, $(f(x),r)$ remains one-way as a function of $(x,r)$, but the input predicate $r_0$ is copied into its output. The eight-bit SHA-256 fixture is exhaustible, so it is not evidence that the fixture is one-way.
- **The reconstruction begins with a predictor premise.** The artificial predictor is stipulated for one fixed $x$, ignores $y$, and is wrong only at the all-zero $r$. Its bias is exhaustively audited; it is not learned, not a SHA-256 attack, and not evidence that a useful predictor exists. Goldreich–Levin concerns a one-way-function family indexed by a security parameter and a probabilistic polynomial-time predictor with non-negligible advantage, none of which an eight-bit run establishes.

### Target-collision sources and limits

- Moni Naor and Moti Yung, [_Universal One-Way Hash Functions and Their Cryptographic Applications_](https://dl.acm.org/doi/10.1145/73007.73011), STOC 1989, pp. 33–43.
- John Rompel, [_One-Way Functions are Necessary and Sufficient for Secure Signatures_](https://dl.acm.org/doi/10.1145/100216.100269), STOC 1990, pp. 387–394.
- Phillip Rogaway and Thomas Shrimpton, [_Cryptographic Hash-Function Basics_](https://www.iacr.org/archive/fse2004/30170373/30170373.pdf), FSE 2004, pp. 371–388.
- Mihir Bellare and Phillip Rogaway, [_Collision-Resistant Hashing: Towards Making UOWHFs Practical_](https://eprint.iacr.org/1997/009), CRYPTO 1997, pp. 470–484.

The signature lesson concerns an outsider who receives a message fixed before the per-message hash key is chosen, and the key must be signed with the digest. It does not establish non-repudiation against a malicious signer: a signer who chooses the key first may find a collision and later claim either message. The planted browser family is a finite order-game fixture only; its exhaustive counts do not establish computational security.

### GGM sources and limits

- Goldreich, Goldwasser, and Micali, [_How to Construct Random Functions_](https://www.wisdom.weizmann.ac.il/~/oded/ggm.html), *Journal of the ACM* 33(4), 1986 (author's paper page and final text).
- Katz and Lindell, [_Introduction to Modern Cryptography_, revised third edition](https://www.routledge.com/Introduction-to-Modern-Cryptography-Revised-Third-Edition/Katz-Lindell/p/book/9781032496795), 2025, §8.5.

The formal construction consumes one input bit per tree level; for a 128-bit input it needs 128 levels, whereas this page displays only three. Truncating a secure pseudorandom function's 128-bit output to its first bit preserves the computational indistinguishability property. The example's root is displayed, so visitors can compute every leaf; it does not demonstrate secret-key security. The AES primitive and theorem assumption do not make the deliberately repeated-seed branch secure.

### Hybrid and hard-core sources and limits

- Oded Goldreich and Leonid Levin, [_A Hard-Core Predicate for all One-Way Functions_](https://www.wisdom.weizmann.ac.il/~/oded/gl.html), STOC 1989.
- Oded Goldreich, [_Modern Cryptography, Probabilistic Proofs and Pseudorandomness_](https://www.wisdom.weizmann.ac.il/~oded/PDF/mcppp-v2.pdf), Appendix C.2.
- Mihir Bellare and Phillip Rogaway, [_The Security of Triple Encryption and a Framework for Code-Based Game-Playing Proofs_](https://eprint.iacr.org/2004/331), and Victor Shoup, [_Sequences of Games_](https://eprint.iacr.org/2004/332).
- Mike Rosulek, [_The Joy of Cryptography_, adjacent hybrids and the three-hop maneuver](https://joyofcryptography.com/provsec/#sec.three-hop).

The browser fixes $n=8$, caps the sample family and reconstruction work, and uses fresh uniform WebCrypto bits. The bounded decoder enumerates every $\sigma$ guess, takes coordinate-wise majorities, deduplicates the list, and verifies candidates by recomputing the public image. It may honestly miss; the page makes at most one fresh retry and reports both attempts and total predictor queries. Those caps and the retry are teaching controls, not theorem parameters or a claim about asymptotic success.

## Real-World Usage

Modern encryption APIs randomize ciphertexts and authenticate them because deterministic equality and malleability are directly exploitable. RSA-OAEP and RSA-PSS encode those protections around RSA; AES-GCM combines confidentiality with authentication; canonical low-S policies remove one ECDSA encoding ambiguity. Production protocol claims still require a complete protocol model, assumptions, implementation review, key lifecycle, and side-channel analysis beyond this page.

## How to Run Locally

Requires Node.js 22.12 or newer.

`​``bash
npm ci
npm run dev
`​``

Vite prints the local development URL. The production preview used by Playwright runs on the repository-specific port `4667`.

## Related Demos

- [RSA Forge](https://systemslibrarian.github.io/crypto-lab-rsa-forge/) focuses on RSA failure modes.
- [ECDSA Forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) focuses on signature misuse and recovery.
- [Protocol Checker](https://systemslibrarian.github.io/crypto-lab-protocol-checker/) covers protocol reasoning outside this lab's scope.
- [KEM Trap](https://systemslibrarian.github.io/crypto-lab-kem-trap/) covers ML-KEM security boundaries.

## Build & Verify

`​``bash
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:a11y
npm run test:mutations
`​``

The unit gate contains **148 tests** in 18 files. It includes **3 published known-answer cases**: FIPS 197 AES-128, RFC 6979 P-256 ECDSA, and RFC 8032 Ed25519. Coverage is measured over the cryptographic and game logic only — `src/game/`, `src/schemes/`, `src/adversaries/`, `src/prf/`, `src/proofs/`, `src/reduction/` and `src/kats.ts` — because that is the code whose correctness the claims rest on; the presentation layer (`src/ui/`, `src/main.ts`) is excluded from the measurement and is covered instead by the browser tests below. Over that scope the enforced baseline is 90% statements, 80% branches, 90% functions, and 90% lines; the latest local unit run measured 95.07%, 88.05%, 95.78%, and 97.13%, respectively.

The Playwright gate contains **51 browser tests** in 3 files: 16 truth and workflow claims (`e2e/claims.spec.ts`), including independent raw-RSA modular exponentiation, secp256k1 point arithmetic, AES-ECB, SHA-256, proof-parameter recomputation and target-collision arithmetic; 33 marker-coverage and marker-branching tests (`e2e/verdicts.spec.ts`); and 2 WCAG state walks (`e2e/a11y.spec.ts`). It builds before serving, drives real controls at desktop and 380 px, requires zero WCAG 2.1 A/AA violations, inspects axe's incomplete bucket, and independently checks text contrast, control-boundary contrast, reduced motion, reflow, focus targets, scroll regions, and hidden states.

### Every rendered verdict and every rendered number is mutation-covered

A verdict is real only when it can be forced false and something goes red. This
lab shipped one that could not.

Exhibit 03's two ECDSA verifier banners — `PLAIN VERIFIER: ACCEPTED` and
`LOW-S VERIFIER: REJECTED` — were **string literals**. The cryptography behind
them was entirely real, and their outcomes were genuinely computed: `forgery.ts`
called both verifiers and wrote their real results into the transcript. The
banners just never read them. Forcing the plain verifier to enforce low-S made
it reject the `(r, n - s)` twin — collapsing the whole point of the exhibit —
and the page still rendered `PLAIN VERIFIER: ACCEPTED`, in alarm red, beside its
own computed `plainVerifier: rejected`, with all ten claims tests green. Both
banners now branch on the verifiers' real return values, and either can render
the opposite outcome.

Coverage is derived by **walking the rendered page**, never from a list of
exhibits, because a list is a self-report:

- every rendered verdict carries a `data-verdict` marker and every rendered
  measurement carries a `data-claim` marker. Both families are judged on the
  same terms, because a number painted with no mutation behind it is exactly as
  unchecked as a verdict painted with none — and it is the easier mistake to
  make, since a number does not look like a claim;
- `npm run test:verdicts` fails on a marker of either family with no mutation in
  `mutations/registry.json`, and fails on verdict words, verdict styling **or a
  measurement** rendered outside a marker — with a test that injects a raw
  unmarked banner and a raw unmarked stat the way a careless builder would, so
  the check is known to be able to fail;
- a marker's text and its state are ONE claim. `expectVerdict` asserts the
  words, the `data-tone`/`data-state` value, and — by flipping the attribute in
  place and re-reading the computed painting — that the state is one the
  stylesheet actually paints. A recorded kill that does not go through that
  helper (or `readClaim`, for a measurement) fails the build: before this, the
  rule asked only that the spec *mentioned* the marker id, and a mention is not
  an assertion;
- **that rule is enforced at runtime, not by reading spec source.** Requiring
  the call as *text* was the same defect one level down, and it was defeated
  three ways across this fleet's verdict-gated labs: comment the call out and
  the text survives inside the comment; keep the call and feed it values read
  off the page in the same test; leave an unrelated call elsewhere in the file.
  So each helper now writes the `(test title, marker id)` pair it actually
  **executes** to a run-scoped sink under `test-results/`, cleared at the start
  of every run, and `e2e/global-teardown.ts` reads them back after the last test
  and fails the run when a recorded mutation's pair never appeared. Where the
  record pins `asserts`, the `(text, state)` the test passed must be the pair
  pinned at that POSITION — which is what refuses an expectation read off the
  page under test. Position rather than membership, because a killing test that
  walks two branches hands the helper two pairs, and under a mutation that
  merely *swaps* those branches a page-derived argument hands back the same two
  pairs in the opposite order: a set comparison sees nothing wrong and the
  escape survives. **The stated limit:** a `data-claim` oracle recomputes its
  expectation from the run — a Wilson interval, an exact collision probability —
  so there is no honest literal to pin for one, and a tautological *measurement*
  oracle is caught by the mutation sweep reporting a survivor rather than by the
  coverage rule;
- **a measured row is bound to its own run, not only to itself.** The switching
  table's oracle used to check each row's internal consistency — measured
  advantage against the Wilson estimate of that row's own wins and trials — which
  a row copied from another q satisfies by construction, because it is the same
  row. Replicating one measurement across the whole curve, with only `q` and the
  bound corrected, left the suite green while the page rendered identical rows
  under *"N q values, M trials each"*. Each row is now also compared with the
  birthday collision probability at ITS q, within that row's own rendered
  tolerance, and both of the caption's numbers are read back out of the caption
  and checked against the table. That mutation is recorded as
  `curve-replicates-one-measurement`;
- the walk that all of those rules enumerate over, `driveEveryState`, visits
  **every option of every control that changes what renders** — each control on
  its own, not the cross-product. Seven CPA schemes, three adversaries, five
  signature tactics, both CCA2 schemes, both reduction adversaries, both ends of
  n, the step and stop buttons, every refusal and every retirement, every
  adjacent hybrid prefix, executable oracle checks, a fresh reconstruction,
  both target-collision families, all three target-collision strategies, all
  four key modes, both order games, the explicit no-answer forfeit, the spray
  refusal, and fresh, retired and invalid sample states. A state the walk never
  reaches is outside the set the coverage rules judge, however carefully those
  rules are written;
- `npm run test:mutations` applies **52 recorded mutations across 44 markers**
  and requires a **kill** for each: the
  unmutated baseline passing in the same run, and the failure being that
  marker's own assertion rather than a build error, a blank page, a timeout, or
  the whole suite going red.

Every run sets `CI=1`, which turns off Playwright's `reuseExistingServer`, so no
stale server on this lab's pinned port `4667` can answer for an unmutated
checkout and turn a real kill into a survivor.

In CI, `verdict-coverage` is its own job and both `deploy` and the Dependabot
auto-merge take `needs:` on it, so the gate sits between every trigger — a direct
push to `main` included — and the Pages deployment.

## Performance

The default 200-trial games are intended to complete interactively on a current desktop browser. RSA-2048 key generation happens once per page session and is shared by textbook RSA, OAEP, and PSS. The 5,000-trial cap prevents accidental unbounded work. The hard-core lesson separately caps dimensions, subset XORs and reconstruction votes, then reports any retry work. Runtime still varies by browser, CPU, selected primitive, and query count.

## Primary Sources

- Shafi Goldwasser and Silvio Micali, [“Probabilistic Encryption”](https://doi.org/10.1016/0022-0000(84)90070-9), JCSS 28(2), 1984.
- Charles Rackoff and Daniel Simon, [“Non-Interactive Zero-Knowledge Proof of Knowledge and Chosen Ciphertext Attack”](https://doi.org/10.1007/3-540-46766-1_1), CRYPTO 1991.
- Mihir Bellare, Anand Desai, David Pointcheval, and Phillip Rogaway, [“Relations Among Notions of Security for Public-Key Encryption Schemes”](https://www.iacr.org/archive/crypto1998/14620526/14620526.pdf), CRYPTO 1998.
- Shafi Goldwasser, Silvio Micali, and Ronald Rivest, [“A Digital Signature Scheme Secure Against Adaptive Chosen-Message Attacks”](https://doi.org/10.1137/0217017), SIAM Journal on Computing 17(2), 1988.
- Mihir Bellare and Phillip Rogaway, [“The Security of Triple Encryption and a Framework for Code-Based Game-Playing Proofs”](https://eprint.iacr.org/2004/331), EUROCRYPT 2006.
- Victor Shoup, [“Sequences of Games: A Tool for Taming Complexity in Security Proofs”](https://eprint.iacr.org/2004/332), 2004.
- Oded Goldreich and Leonid Levin, [“A Hard-Core Predicate for all One-Way Functions”](https://www.wisdom.weizmann.ac.il/~/oded/gl.html), STOC 1989.
- [FIPS 197: Advanced Encryption Standard](https://csrc.nist.gov/pubs/fips/197/final), [RFC 6979](https://www.rfc-editor.org/rfc/rfc6979), and [RFC 8032](https://www.rfc-editor.org/rfc/rfc8032).

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Ghost Commit

- **slug**: `crypto-lab-ghost-commit`
- **repo**: https://github.com/systemslibrarian/crypto-lab-ghost-commit
- **live**: https://systemslibrarian.github.io/crypto-lab-ghost-commit/
- **commit_sha**: `d8ec1ff2c53400c406c7b1aa331dd92247b303a3` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `b8d16fa95839bba775becd6dcae18182c69f3f69`
- **read_from**: working tree (clean)
- **category**: ATTACKS | HASHING & KDFS  ·  **level**: beginner  ·  **--accent**: #9085e9
- **MISSING FIELDS**: spec_citations, claims, mutations, verification

**Name (H1)**: Ghost Commit  — _read from index.html_

**Subtitle**: Secret leakage in git history · SHA-1 / SHA-256 objects · Shannon entropy  — _read from index.html_

**Description**: Commit an API key, delete it two commits later, then walk the parent chain and watch the real blob hash that still holds it — while a hand-rolled entropy scanner scores every token in the repository.  — _read from index.html_

**Why it matters**: Leaked credentials in public repositories are among the most reliably exploited findings in security — scanners crawl new commits within minutes of a push. The instinct to fix it by deleting the line is the exact instinct that leaves the key working while everyone believes it is gone.  — _read from index.html_

**Card copy**: Commit an API key, delete it two commits later, and it keeps its name and its contents forever — git adds objects, it never edits them. Then an entropy scanner finds it in seconds.

**Chips**: Git Object Model · SHA-1 / SHA-256 · Shannon Entropy · Secret Scanning

**Implements**: SHA-1 `src/git/objects.ts:16`, SHA-256 `src/git/objects.ts:16`

**Attacks shown**: _none derived_

**References**: Merkle tree

**Standards body**: NIST

**Implementation**: WebCrypto

**README — What Can Go Wrong**:

```text
- **Mistaking a clean HEAD for a clean repository.** This is the demo's whole subject. The scanner in panel 2 reports honestly on the commits it was given, and no further.
- **Force-pushing and believing it worked.** Existing clones, forks, CI caches, and platform-side dangling objects all keep the commit. On GitHub an unreferenced commit stays fetchable by its SHA, and a fork makes it permanent.
- **Rewriting history as the remedy.** `git filter-repo` genuinely rewrites objects — and changes every commit id from that point forward, breaking every clone and every reference to those SHAs. It is hygiene after rotation, never a substitute for it.
- **Trusting entropy.** A git object id and a UUID both score at the top of the hex range and are harmless. An English sentence scores about 4.3 bits/char, within half a bit of the leaked API key. Prose escapes flagging only because the *tokenizer* never hands it to the entropy function — the threshold gets more credit than it deserves.
- **Tuning the threshold down.** Every point of extra recall arrives as UUID alerts, and a scanner developers have learned to ignore is worse than none.
- **Committing the key with a helpful variable name.** `ACMEPAY_API_KEY = "..."` matches the generic assignment rule on the name alone. That is the rule working as designed.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Ghost Commit

**Commit an API key, delete it two commits later, and watch it sit in git history forever — then watch an entropy scanner find it in seconds.**

[**▶ Live demo**](https://systemslibrarian.github.io/crypto-lab-ghost-commit/)

---

## What It Is

A browser demo of two things that are usually described and rarely shown: how git's object model makes a committed secret permanent, and how a secret scanner actually decides that a string looks like a credential.

**The primitives.** Git names every object by the hash of `<type> <byte-length>\0<content>` — SHA-1 in the default object format, SHA-256 in the newer one. This demo builds real blob, tree, and commit objects from those exact byte layouts and hashes them with WebCrypto. Every object id shown on the page is byte-identical to what the `git` binary produces for the same input, and the test suite proves it against ids generated by the real binary. On top of that sits a hand-rolled Shannon-entropy scanner (`H = −Σ p·log₂p`), charset classification, and a small set of pattern rules modelled on published gitleaks and Semgrep detections.

**The problem.** Git does not edit files; it adds objects. Removing a secret from a file writes a *new* blob and a *new* tree. The old blob keeps its name, keeps its contents, and stays reachable from the commit that introduced it. Deleting the file entirely does the same thing. Both operations feel like removal and are additions.

**The security model.** There is none to break here — nothing on this page is a confidentiality mechanism. The claim being demonstrated is a *durability* property of a content-addressed store, and the operational consequence: once a credential is pushed, the only action that changes an attacker's position is revoking it at the system that issued it.

**Not production crypto — a teaching demo.** No backend, no network, no persistence. The repository lives in memory for the length of the page. The leaked value uses the prefix `acmepay_live_`, which belongs to no real service — AcmePay is invented, so the key cannot authenticate anything. Use [gitleaks](https://github.com/gitleaks/gitleaks), [TruffleHog](https://github.com/trufflesecurity/trufflehog), or your platform's own secret scanning for real work.

**A note on the fictional vendor.** The first version of this demo used a real `sk_live_` prefix, and GitHub's push protection refused the push. That is the control working exactly as designed: a scanner cannot tell a teaching sample from a live credential, which is this demo's own thesis. Rather than allowlist the block or split the literal to slip past it, the sample moved to an invented vendor. The genuine Stripe, AWS, and GitHub patterns remain in `src/scan/rules.ts` as the real-world originals the demo rule is modelled on.

## Exhibits

1. **The repository.** A six-commit Python billing service you advance one commit at a time. Each step shows the real commit id, tree id, and parent, computed live. A selector switches the whole repository between git's SHA-1 and SHA-256 object formats — the bytes being hashed are identical, only the digest changes.
2. **The leak, and the two failed fixes.** You commit the key, ship an unrelated feature past it, replace the literal with `os.environ`, and finally `git rm` the file. The object count goes *up* at every step, including the deletions.
3. **HEAD scan versus history walk.** The same scanner run twice, side by side, differing only in which commits it is handed. HEAD reports clean; the parent-chain walk surfaces the credential with the real blob id and the commits that still reach it.
4. **The object store, laid bare.** Every object ever written, with the blobs holding the key marked — including the ones HEAD can no longer reach.
5. **Entropy as arithmetic.** Pick a string, or type your own, and the per-character sum is computed in front of you: count, probability, and each character's −p·log₂p contribution, adding to H. Nothing is asserted; the table *is* the formula.
6. **Where the threshold actually sits.** Labelled reference strings — the leaked key, a base64 blob, a JWT header, an English sentence, a git object id, a UUID, a repeated character — each scored against its own charset threshold, marked per row because hex and base64 do not share a ceiling.
7. **The format rules.** The gitleaks- and Semgrep-shaped patterns that run alongside entropy, with what each one keys on and why vendors now prefix their credentials deliberately.
8. **Delete versus rotate.** A rotate action that leaves the scan output *byte-for-byte identical* and changes only what the value can open, next to a table of five responses and what each actually does.

## When to Use It

**Use this to teach:** why "I removed the key in the next commit" is not a remediation; why content-addressed storage makes history durable; how entropy scanning really works and where it fails; why incident response for a leaked credential starts with rotation rather than with git.

**Use the underlying idea in production by:** running a secret scanner in CI over full history (not just the diff), adding a pre-commit hook so the push never happens, and treating any credential that reached a remote as compromised from that moment.

**Do NOT use this as a scanner.** The rule set here is five patterns chosen for readability; gitleaks ships hundreds. It walks one branch's parent chain and would miss a secret on another branch, in a stash, in a dangling object, or in a submodule. A clean result from this page means nothing about a real repository.

**Do NOT treat entropy as detection.** It measures distribution, not secrecy. Use it as a cheap prior behind pattern rules, never as the decision.

## Live Demo

<https://systemslibrarian.github.io/crypto-lab-ghost-commit/>

You can: advance the commit graph and watch real object ids appear; switch the whole repository between SHA-1 and SHA-256; scan HEAD and then walk the history and compare the two reports; inspect every object in the store; score any string you type against the real entropy function and the real rules; and rotate the credential to see exactly which parts of the picture change and which do not.

## What Can Go Wrong

- **Mistaking a clean HEAD for a clean repository.** This is the demo's whole subject. The scanner in panel 2 reports honestly on the commits it was given, and no further.
- **Force-pushing and believing it worked.** Existing clones, forks, CI caches, and platform-side dangling objects all keep the commit. On GitHub an unreferenced commit stays fetchable by its SHA, and a fork makes it permanent.
- **Rewriting history as the remedy.** `git filter-repo` genuinely rewrites objects — and changes every commit id from that point forward, breaking every clone and every reference to those SHAs. It is hygiene after rotation, never a substitute for it.
- **Trusting entropy.** A git object id and a UUID both score at the top of the hex range and are harmless. An English sentence scores about 4.3 bits/char, within half a bit of the leaked API key. Prose escapes flagging only because the *tokenizer* never hands it to the entropy function — the threshold gets more credit than it deserves.
- **Tuning the threshold down.** Every point of extra recall arrives as UUID alerts, and a scanner developers have learned to ignore is worse than none.
- **Committing the key with a helpful variable name.** `ACMEPAY_API_KEY = "..."` matches the generic assignment rule on the name alone. That is the rule working as designed.

## Real-World Usage

Git's object formats are specified in the git source tree (`Documentation/gitformat-*`); the SHA-256 object format landed in git 2.29 and remains opt-in per repository, since the two formats cannot be mixed. The entropy heuristic here is the one TruffleHog made standard: score maximal runs over the base64 and hex alphabets, flag past 4.5 and 3.0 bits/char respectively. The pattern rules mirror published detections — gitleaks' `stripe-access-token`, `aws-access-token`, and `private-key`, and the generic hardcoded-secret-assignment shape used by Semgrep. Vendor prefixes such as `sk_live_`, `AKIA`, and `ghp_` exist precisely so that scanners can match on them, which is why prefix rules now outperform entropy on the credentials that matter most.

## How to Run Locally

`​``bash
npm install
npm run dev          # http://localhost:5173
npm test             # 63 unit tests, including the git known-answer tests
npm run build        # typecheck + production build
npm run test:a11y    # WCAG 2.1 AA gate against the production build, both themes
`​``

Regenerating the known-answer fixture needs a local git ≥ 2.29 (for `--object-format=sha256`):

`​``bash
npm run kat:regen    # drives the real git binary; rewrites src/git/git-objects.kat.json
`​``

## Related Demos

- [crypto-lab-collision-vault](https://systemslibrarian.github.io/crypto-lab-collision-vault/) — SHA-1 collisions, and what they do and do not mean for git.
- [crypto-lab-envelope-kms](https://systemslibrarian.github.io/crypto-lab-envelope-kms/) — key rotation done properly, with DEK/KEK envelopes.
- [crypto-lab-entropy-collapse](https://systemslibrarian.github.io/crypto-lab-entropy-collapse/) — what happens when the randomness behind a key was never there.
- [crypto-lab-quantum-entropy](https://systemslibrarian.github.io/crypto-lab-quantum-entropy/) — min-entropy, the measure that actually bounds a guessing attacker.
- [crypto-lab-merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) — content-addressed, append-only structures and the proofs they support.

## Build & Verify

**63 unit tests** (Vitest), all passing, colocated in `src/`:

| File | Tests | Covers |
|---|---|---|
| `src/git/objects.test.ts` | 21 | Object hashing, tree ordering, hex helpers, the full scenario in both formats, the persistence invariant |
| `src/scan/entropy.test.ts` | 20 | Hand-checkable entropy values, charset classification, scoring, the prose-versus-key measurement |
| `src/scan/scanner.test.ts` | 22 | Tokenization, pattern rules, HEAD-versus-history behaviour |

**67 known-answer values, generated by the real git binary.** `src/git/git-objects.kat.json` is produced by `tools/gen-git-kat.ts`, which builds the demo's repository twice with actual `git` (SHA-1 and SHA-256 object formats) using the same file bytes, author, and fixed timestamps the page uses, then records what git computed: 12 commit ids, 12 tree ids, 38 blob-id assertions, and 5 canonical values (git's empty blob, empty tree, and the `hello world` blob). The browser code must reproduce all of them or the suite fails. The fixture records the git version that generated it.

**Accessibility is gated, not aspirational.** `npm run test:a11y` runs `@axe-core/playwright` against the *production* build in both themes and asserts zero WCAG 2.1 A/AA violations. The spec drives the demo to its end state first — every commit made, both scans run, the finding cards and reveal rendered, the key rotated, every reference string loaded, every disclosure opened — because an unscanned state is an ungated state. The GitHub Pages deploy runs the unit tests, the typechecked build, and this gate before it will publish.

Every color token was contrast-checked against the surface it sits on before it was written: body text ≥ 4.5:1, UI and graphical marks ≥ 3:1, in both themes. State is never carried by color alone — every status is an icon plus text plus color. Charts are real HTML tables with proportional bars, so the structure a screen reader reads and the picture a sighted reader sees come from the same markup.

## Performance

Everything runs synchronously in the browser. Building the six-commit repository is roughly thirty WebCrypto digests and completes in a few milliseconds; a full history scan reads about forty lines across eleven blobs. Switching the object format rebuilds the entire graph from scratch, which is still imperceptible. Nothing is cached — the ids are recomputed on every render, so a stale value cannot be displayed.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Glass Box

- **slug**: `crypto-lab-glass-box`
- **repo**: https://github.com/systemslibrarian/crypto-lab-glass-box
- **live**: https://systemslibrarian.github.io/crypto-lab-glass-box/
- **commit_sha**: `140c1bcdcf9e9a3ac1967f8b349c17c840f71fb1` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `1cf693c2817f32b13457bd7e8919c4d9918eceaf`
- **read_from**: working tree (clean)
- **category**: ATTACKS | ENCRYPTION  ·  **level**: advanced  ·  **--accent**: #67e8f9
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Glass Box  — _read from src/main.ts_

**Subtitle**: Chow et al. white-box AES · DCA (Bos et al. 2016) · BGE (2004)  — _read from src/main.ts_

**Description**: Builds a real Chow table-network AES-128 from a key you choose, has the program record its own table lookups, and runs differential computation analysis on that trace until the key comes back out.  — _read from src/main.ts_

**Why it matters**: Software that has to decrypt on hardware its owner controls — a streaming client, a payment app, a licence check — ships the key inside the binary. White-box cryptography is the attempt to make that survivable. Chow’s design is the one everything else is built on, and it is broken from two directions: a statistical attack that needs a few hundred execution traces, and an algebraic one that needs none at all.  — _read from src/main.ts_

**Card copy**: Chow-style white-box AES-128 built from your key as 2,032 encoded lookup tables, then attacked twice: differential computation analysis pulls the key from execution traces, and BGE step A1 strips the table encodings.

**Chips**: White-Box AES · Chow 2002 · DCA · BGE Attack

**Implements**: AES `src/aes/aes-ref.ts:162`, White-box AES `src/lab.worker.ts:64`

**Attacks shown**: BGE attack `src/lab.worker.ts:26`, Chosen-plaintext attack `src/ui/diagram.ts:87`, Collision attack `src/main.ts:1984`, Differential computation analysis `src/attack/dca.ts:407`, Differential fault analysis `src/main.ts:1984`, Power analysis `src/main.ts:1739`, Side-channel (unspecified) `README.md:60`, Timing side-channel `README.md:293`

**Comment-only (named in code comments, not executed)**: AES-ECB `src/lab.worker.ts:118`, Encrypted Client Hello `src/attack/bge.ts:4`

**References**: AES-CBC, DES, Encrypted Client Hello

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `CHES 2016` — first seen README.md:54 (11×)
- `CHES 2019` — first seen README.md:133 (5×)
- `ePrint 2013/104` — first seen README.md:264 (4×)
- `ePrint 2015/753` — first seen src/main.ts:1991 (1×)
- `EUROCRYPT 2003` — first seen src/attack/bge.ts:19 (1×)
- `FIPS 197` — first seen README.md:46 (24×)
- `FIPS PUB 197` — first seen src/main.ts:1995 (1×)
- `NIST SP 800-38A` — first seen README.md:324 (2×)

**README — What Can Go Wrong**:

```text
**The things this construction does not protect against, and the ones this page
gets wrong if you are not careful.**

- **A few hundred execution traces are enough.** Not a fault attack, not a timing
  attack, not a physical measurement — just a recording of what the program read
  and wrote, and a difference of means. On this generator, one target at 384
  traces recovers 12 to 16 bytes of 16; the two targets combined recover 14 to 16.
- **Compiling the external encodings into the program buys nothing.** If the
  encoder is in the binary, the attacker can get from a plaintext they chose to
  the value the AES core sees, so the first-round hypotheses stay valid. Act 5
  measures this: the program grows, the trace grows, and the attack recovers
  exactly the same sixteen bytes.
- **Holding the encodings outside the program stops THIS attack, and moves the
  problem.** Something out there now holds a secret and has to apply it to every
  block — another piece of software, on some machine, with a secret in it. And it
  does not make the key unextractable: BGE recovers it from the tables alone, and
  its published attack covers the external encodings Chow specifies.
- **The construction has no failure code.** It cannot tell that it is being
  traced, cannot refuse to run, and raises nothing while its key is being
  extracted. Every failure code this page can show belongs to the page's own input
  validation, and the scope card says so in the same table.
- **Even the attack's failures leak.** Bos et al. noticed that a prediction bit
  which does not leak usually ranks the true key byte *last* of the 256
  candidates rather than at random, because the correct guess is the one sitting
  at a difference of means of nearly zero while every wrong guess picks up
  spurious correlation with the known input. Act 4 rebuilds their table on your
  instance and lets you score by anomaly instead of by correlation: at 2,048
  traces that alone recovers all sixteen bytes on this generator. There is no
  setting here that produces no information.
- **A confident-looking answer can still be wrong.** The margin between a byte's
  best and second-best candidate is computed without the key, so it is the
  confidence an attacker really has — and on this generator every byte above a
  0.15 margin was correct in all fifty measured input-side runs (five instances,
  five configurations, two trace counts). That is a measurement, not a guarantee:
  in one remote-both output-side run, where the attack is at chance, a byte
  cleared that margin anyway and was wrong.
- **The attack is asymmetric, and this is a lab-original measurement rather than a
  figure from any paper.** Attacking the output side recovers only part of the
  last round key and does not complete. Chow's first-round tables are 8 -> 32, so a
  first-round key byte is exposed through eight encoded nibbles; his round-10
  tables are 8 -> 8, so a last-round key byte is exposed through two. Four times
  fewer places for a correlation to be. And inverting the AES-128 key schedule
  needs all sixteen bytes of k^10, so a partial recovery of it yields nothing.
- **What this page's trace is not.** Real DCA captures the same kind of data from
  a foreign binary with dynamic binary instrumentation — Intel PIN, Valgrind, a
  debugger — which a browser cannot run. This page records the output of every
  table lookup from the inside. That is a real software execution trace of a real
  table network; it is not a physical side channel, and it is not a capture of
  someone else's binary. One consequence is visible in Act 3: a real ADDRESS trace
  shows the round structure plainly, because table base addresses repeat, and a
  trace of encoded lookup outputs does not.

---
```

**Claims tested** (e2e/claims.spec.ts, 66 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:39
    - :39 `toHaveText` expected `'IT IS AES-128'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:86
    - :86 `toHaveText` expected `'IT IS AES-128'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:87
    - :87 `toContainText` expected `placementLabel(placement)` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:103
    - :103 `toContainText` expected `'recorded'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:117
    - :117 `toContainText` expected `'scored'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:118
    - :118 `toBeVisible` expected _no expected value_ _(none)_
- `Act 2: what the page says it built` — e2e/claims.spec.ts:144
- `parts sum to whole: every table type’s bytes add up to the program size` — e2e/claims.spec.ts:145
    - :151 `expect` expected _no expected value_ _(none)_
    - :161 `expect` expected _no expected value_ _(none)_
    - :166 `toBe` expected `tables` _(expression)_
    - :169 `expect` expected _no expected value_ _(none)_
- `the table counts are Chow’s, re-derived from the construction rather than read off` — e2e/claims.spec.ts:173
    - :187 `toBe` expected `9 * 4 * 4` _(expression)_
    - :188 `toBe` expected `9 * 4 * 4` _(expression)_
    - :189 `toBe` expected `9 * 4 * 2 * 3 * 8` _(expression)_
    - :190 `toBe` expected `16` _(literal)_
    - :191 `toBe` expected `9 * 4 * 4 * 2 + 9 * 4 * 48 + 16` _(expression)_
- `it really is AES: the FIPS vector on screen, and WebCrypto on 120 random blocks` — e2e/claims.spec.ts:194
    - :206 `toHaveText` expected `'IT IS AES-128'` _(literal)_
    - :209 `expect` expected _no expected value_ _(none)_
    - :210 `expect` expected _no expected value_ _(none)_
    - :211 `toBe` expected `match![2]` _(expression)_
    - :214 `toBe` expected `FIPS_C1_CIPHERTEXT` _(expression)_
    - :216 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :219 `expect` expected _no expected value_ _(none)_
- `the diagram says what the placement is, and never draws the key` — e2e/claims.spec.ts:222
    - :227 `expect` expected _no expected value_ _(none)_
    - :228 `expect` expected _no expected value_ _(none)_
    - :234 `expect` expected _no expected value_ _(none)_
    - :235 `expect` expected _no expected value_ _(none)_
- `a seeded instance is labelled not secret, and an unseeded one is not labelled reproducible` — e2e/claims.spec.ts:238
    - :244 `expect` expected _no expected value_ _(none)_
    - :247 `expect` expected _no expected value_ _(none)_
    - :248 `expect` expected _no expected value_ _(none)_
- `Act 3: the recording` — e2e/claims.spec.ts:252
- `parts sum to whole: the segment map adds up to the bits per trace` — e2e/claims.spec.ts:253
    - :266 `toBe` expected `expectedStart` _(expression)_
    - :270 `toBe` expected `bits` _(expression)_
- `the buffer was sized before it was allocated, and the sizes agree` — e2e/claims.spec.ts:273
    - :279 `toHaveLength` expected `2` _(literal)_
    - :282 `toBe` expected `allocated` _(expression)_
    - :289 `expect` expected _no expected value_ _(none)_
- `Act 4: what the attack claims` — e2e/claims.spec.ts:293
- `the score is what the two hex strings on screen actually agree on` — e2e/claims.spec.ts:294
    - :305 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :306 `toBe` expected `BASE_KEY` _(expression)_
    - :309 `toBe` expected `matching` _(expression)_
    - :311 `expect` expected _no expected value_ _(none)_
- `the sixteen cells say the same thing as the committed hex` — e2e/claims.spec.ts:314
    - :323 `toHaveCount` expected `16` _(literal)_
    - :328 `toBe` expected `recovered.slice(2 * i, 2 * i + 2)` _(expression)_
    - :330 `toBe` expected `isRight ? 'found' : 'missed'` _(expression)_
    - :333 `toBe` expected `found` _(expression)_
- `every margin is (peak − runner-up) / peak, recomputed from the detail table` — e2e/claims.spec.ts:336
    - :344 `toHaveCount` expected `16` _(literal)_
    - :350 `expect` expected _no expected value_ _(none)_
    - :351 `expect` expected _no expected value_ _(none)_
    - :352 `expect` expected _no expected value_ _(none)_
    - :357 `toBe` expected `margin` _(expression)_
- `the winning sample is inside the window the page says it scanned` — e2e/claims.spec.ts:361
    - :368 `toBe` expected `1792` _(literal)_
    - :374 `expect` expected _no expected value_ _(none)_
- `the canvas descriptions are rewritten from the data, not written once` — e2e/claims.spec.ts:378
    - :389 `toHaveAttribute` expected `'aria-label', new RegExp('key byte ${other}\\b')` _(expression)_
    - :391 `toBe` expected `before` _(expression)_
    - :393 `toBe` expected `after!.trim()` _(expression)_
- `Act 5: where the encodings live, measured` — e2e/claims.spec.ts:397
- `compiling the encodings in changes the program and not the recovery` — e2e/claims.spec.ts:398
    - :420 `expect` expected _no expected value_ _(none)_
    - :421 `expect` expected _no expected value_ _(none)_
    - :423 `toBe` expected `plainRecovered` _(expression)_
    - :424 `expect` expected _no expected value_ _(none)_
    - :426 `toHaveAttribute` expected `'data-comparison', 'identical'` _(expression)_
    - :427 `toContainText` expected `'THE ENCODING CHANGED NOTHING'` _(literal)_
- `a remote OUTPUT encoding leaves the input side wide open` — e2e/claims.spec.ts:430
    - :436 `expect` expected _no expected value_ _(none)_
- `a remote INPUT encoding closes the input side and leaves the output side partly open` — e2e/claims.spec.ts:439
    - :446 `expect` expected _no expected value_ _(none)_
    - :447 `toBeVisible` expected _no expected value_ _(none)_
    - :453 `expect` expected _no expected value_ _(none)_
    - :454 `expect` expected _no expected value_ _(none)_
    - :455 `toContainText` expected `'ROUND KEY PARTLY RECOVERED'` _(literal)_
    - :458 `expect` expected _no expected value_ _(none)_
    - :459 `expect` expected _no expected value_ _(none)_
- `the log row agrees with the verdict that produced it` — e2e/claims.spec.ts:462
    - :469 `toHaveAttribute` expected `'data-log-recovered', String(score)` _(expression)_
    - :470 `toContainText` expected `'${score} of 16'` _(expression)_
- `NEG-1 as an evidence fixture` — e2e/claims.spec.ts:484
    - :493 `toContainText` expected `'NO RECOVERY'` _(literal)_
    - :494 `toHaveAttribute` expected _no expected value_ _(none)_
- `1. the fixture is reachable, and 2. every check the page performs is green` — e2e/claims.spec.ts:500
    - :508 `toBe` expected `4` _(literal)_
    - :510 `toHaveAttribute` expected `'data-check', 'pass'` _(expression)_
    - :511 `toContainText` expected `'HELD'` _(literal)_
    - :514 `toHaveCount` expected `0` _(literal)_
    - :518 `expect` expected _no expected value_ _(none)_
    - :519 `expect` expected _no expected value_ _(none)_
    - :520 `expect` expected _no expected value_ _(none)_
    - :523 `toMatch` expected `/stripped all four output encodings/` _(regex)_
    - :524 `expect` expected _no expected value_ _(none)_
- `the absence of a failure code is rendered, not merely implied` — e2e/claims.spec.ts:527
    - :534 `expect` expected _no expected value_ _(none)_
    - :535 `expect` expected _no expected value_ _(none)_
    - :537 `expect` expected _no expected value_ _(none)_
    - :538 `expect` expected _no expected value_ _(none)_
    - :539 `expect` expected _no expected value_ _(none)_
- `3. the limitation is on screen in that state, visible and not behind a disclosure` — e2e/claims.spec.ts:542
    - :546 `toHaveCount` expected `0` _(literal)_
    - :550 `toHaveCount` expected `1` _(literal)_
    - :551 `toBeVisible` expected _no expected value_ _(none)_
    - :552 `toContainText` expected `NEG_1_OPENING` _(expression)_
    - :556 `toBe` expected `false` _(expression)_
    - :558 `toBe` expected `true` _(expression)_
    - :562 `toBe` expected `(await claim.locator('.neg-claim-text').innerText()).trim()` _(expression)_
- `the fixture says plainly that state 3 moves the problem rather than solving it` — e2e/claims.spec.ts:565
    - :569 `expect` expected _no expected value_ _(none)_
    - :570 `expect` expected _no expected value_ _(none)_
    - :572 `expect` expected _no expected value_ _(none)_
    - :573 `expect` expected _no expected value_ _(none)_
- `the claim retires with its fixture: change the placement and it is gone` — e2e/claims.spec.ts:576
    - :579 `toHaveCount` expected `1` _(literal)_
    - :582 `toHaveCount` expected `0` _(literal)_
    - :583 `toHaveCount` expected `1` _(literal)_
    - :586 `toHaveCount` expected `1` _(literal)_
- `Act 6: the algebraic attack` — e2e/claims.spec.ts:590
- `step A1 reports a group of order 256 and a spread that collapses to one` — e2e/claims.spec.ts:591
    - :595 `toHaveAttribute` expected `'data-bge-verdict', 'stripped'` _(expression)_
    - :597 `toHaveCount` expected `4` _(literal)_
    - :600 `toBe` expected `256` _(literal)_
    - :601 `expect` expected _no expected value_ _(none)_
    - :602 `toBe` expected `8` _(literal)_
    - :604 `expect` expected _no expected value_ _(none)_
    - :605 `expect` expected _no expected value_ _(none)_
    - :606 `expect` expected _no expected value_ _(none)_
    - :608 `toContainText` expected `'not one traced encryption'` _(literal)_
- `it does not claim to run the steps it does not run` — e2e/claims.spec.ts:611
    - :614 `toContainText` expected `'The steps after A1 are not implemented here'` _(literal)_
    - :615 `toContainText` expected `'nothing on this page pretends to'` _(literal)_
    - :618 `toContainText` expected `'one reaches a key and the other reaches the encodings'` _(literal)_
    - :619 `toContainText` expected `'2^30'` _(literal)_
    - :620 `toContainText` expected `'2^22'` _(literal)_
    - :621 `toContainText` expected `'Step A1 only'` _(literal)_
    - :624 `expect` expected _no expected value_ _(none)_
    - :625 `expect` expected _no expected value_ _(none)_
- `failure paths: the page names the actual cause` — e2e/claims.spec.ts:629
- `KEY_HEX_MALFORMED and KEY_LENGTH_INVALID` — e2e/claims.spec.ts:630
    - :634 `toContainText` expected `'KEY_HEX_MALFORMED'` _(literal)_
    - :635 `toContainText` expected `'hexadecimal'` _(literal)_
    - :636 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :640 `toContainText` expected `'KEY_LENGTH_INVALID'` _(literal)_
    - :641 `toContainText` expected `'8 digits'` _(literal)_
    - :642 `toContainText` expected `'4 bytes'` _(literal)_
    - :646 `expect` expected _no expected value_ _(none)_
    - :647 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
- `TRACE_COUNT_OUT_OF_RANGE, at both ends, with the range named` — e2e/claims.spec.ts:650
    - :655 `toContainText` expected `'TRACE_COUNT_OUT_OF_RANGE'` _(literal)_
    - :656 `toContainText` expected `'between 8 and 2048'` _(literal)_
    - :657 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :660 `expect` expected _no expected value_ _(none)_
- `TRACE_BUDGET_EXCEEDED, on the placement whose program is twice the size` — e2e/claims.spec.ts:663
    - :669 `expect` expected _no expected value_ _(none)_
    - :674 `toContainText` expected `'TRACE_BUDGET_EXCEEDED'` _(literal)_
    - :675 `toContainText` expected `'7 MB budget'` _(literal)_
    - :676 `toContainText` expected `'computed before anything is allocated'` _(literal)_
    - :677 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :681 `expect` expected _no expected value_ _(none)_
- `NO_PROGRAM_BUILT, after a build that failed` — e2e/claims.spec.ts:684
    - :688 `toContainText` expected `'KEY_HEX_MALFORMED'` _(literal)_
    - :692 `toContainText` expected `'NO_PROGRAM_BUILT'` _(literal)_
    - :694 `toContainText` expected `'NO_PROGRAM_BUILT'` _(literal)_
    - :695 `toContainText` expected `'reads its tables'` _(literal)_
- `NO_TRACES_RECORDED and NO_HYPOTHESIS_SELECTED` — e2e/claims.spec.ts:698
    - :701 `toContainText` expected `'NO_TRACES_RECORDED'` _(literal)_
    - :702 `toContainText` expected `'statistical attack'` _(literal)_
    - :708 `toContainText` expected `'NO_HYPOTHESIS_SELECTED'` _(literal)_
    - :709 `toContainText` expected `'nothing to correlate'` _(literal)_
- `every declared code is either raised here or named on the page` — e2e/claims.spec.ts:712
    - :730 `expect` expected _no expected value_ _(none)_
- `the guided route` — e2e/claims.spec.ts:744
- `one button per stage reaches a full recovery (${viewport.label})` — e2e/claims.spec.ts:749
    - :757 `expect` expected _no expected value_ _(none)_
    - :758 `expect` expected _no expected value_ _(none)_
    - :761 `toBe` expected `0` _(literal)_
    - :765 `toHaveAttribute` expected `'data-state', 'done'` _(expression)_
    - :766 `toHaveAttribute` expected `'data-state', 'active'` _(expression)_
    - :788 `toBe` expected `label` _(expression)_
    - :792 `toBe` expected `0` _(literal)_
    - :794 `toHaveAttribute` expected `'data-state', 'done'` _(expression)_
    - :796 `toContainText` expected `'You have run the whole route'` _(literal)_
    - :800 `expect` expected _no expected value_ _(none)_
    - :801 `toMatch` expected `/1[4-6] of 16/` _(regex)_
    - :802 `toHaveAttribute` expected `'data-bge-verdict', 'stripped'` _(expression)_
    - :809 `expect` expected _no expected value_ _(none)_
- `primary sources` — e2e/claims.spec.ts:819
- `the page cites the section each claim comes from` — e2e/claims.spec.ts:820
    - :827 `expect` expected _no expected value_ _(none)_
    - :828 `expect` expected _no expected value_ _(none)_
    - :829 `expect` expected _no expected value_ _(none)_
    - :830 `expect` expected _no expected value_ _(none)_
    - :831 `expect` expected _no expected value_ _(none)_
    - :832 `expect` expected _no expected value_ _(none)_
    - :833 `expect` expected _no expected value_ _(none)_
    - :840 `expect` expected _no expected value_ _(none)_
    - :841 `expect` expected _no expected value_ _(none)_
    - :842 `expect` expected _no expected value_ _(none)_
    - :843 `expect` expected _no expected value_ _(none)_
    - :846 `expect` expected _no expected value_ _(none)_
    - :847 `expect` expected _no expected value_ _(none)_
    - :848 `expect` expected _no expected value_ _(none)_
- `Act 4: reading the failures` — e2e/claims.spec.ts:859
- `the rank table is the true byte\u2019s rank, and the count of extremes matches the cells` — e2e/claims.spec.ts:860
    - :872 `toHaveCount` expected `16` _(literal)_
    - :877 `toHaveLength` expected `16` _(literal)_
    - :879 `expect` expected _no expected value_ _(none)_
    - :880 `expect` expected _no expected value_ _(none)_
    - :885 `toBe` expected `256` _(literal)_
    - :888 `expect` expected _no expected value_ _(none)_
    - :890 `expect` expected _no expected value_ _(none)_
- `the second distinguisher scores in its own units and says so` — e2e/claims.spec.ts:893
    - :909 `toBe` expected `truth` _(expression)_
    - :910 `toBe` expected `truth` _(expression)_
    - :916 `expect` expected _no expected value_ _(none)_
- `reproducible run links` — e2e/claims.spec.ts:920
- `a link carries a key the PAGE chose, and never one the reader typed` — e2e/claims.spec.ts:921
    - :930 `toContainText` expected `'NOT the key you typed'` _(literal)_
    - :931 `toContainText` expected `'should not put a reader'` _(literal)_
    - :938 `toContainText` expected `'The link carries the key'` _(literal)_
    - :939 `toContainText` expected `'not secret'` _(literal)_
- `a seed reproduces the RUN, not just the instance -- and no seed does not` — e2e/claims.spec.ts:942
    - :961 `toHaveLength` expected `16` _(literal)_
    - :962 `toEqual` expected `first` _(expression)_
    - :967 `toHaveLength` expected `16` _(literal)_
    - :968 `toEqual` expected `first` _(expression)_
- `opening a link reproduces the settings it carried` — e2e/claims.spec.ts:971
    - :975 `toHaveText` expected `'IT IS AES-128'` _(literal)_
    - :976 `toHaveValue` expected `'2b7e151628aed2a6abf7158809cf4f3c'` _(literal)_
    - :977 `toHaveValue` expected `'shared-seed'` _(literal)_
    - :978 `toHaveValue` expected `'compiled-in'` _(literal)_
    - :979 `toHaveValue` expected `'768'` _(literal)_
    - :980 `toBeChecked` expected _no expected value_ _(none)_
    - :981 `toBeChecked` expected _no expected value_ _(none)_
    - :982 `toHaveValue` expected `'3'` _(literal)_
    - :983 `toHaveValue` expected `'extremity'` _(literal)_
    - :984 `toContainText` expected `'NOT secret'` _(literal)_
- `a link full of nonsense is ignored rather than trusted` — e2e/claims.spec.ts:987
    - :989 `toHaveText` expected `'IT IS AES-128'` _(literal)_
    - :991 `toHaveValue` expected `'000102030405060708090a0b0c0d0e0f'` _(literal)_
    - :992 `toHaveValue` expected `'none'` _(literal)_
    - :993 `toHaveValue` expected `'384'` _(literal)_
    - :994 `toHaveValue` expected `'all'` _(literal)_
    - :995 `toHaveValue` expected `'peak'` _(literal)_
    - :996 `toHaveValue` expected `'input'` _(literal)_
- `the sweep` — e2e/claims.spec.ts:1000
- `measures all seven combinations and ends on the state the claim is about` — e2e/claims.spec.ts:1001
    - :1012 `toContainText` expected `'Measured all 7 combinations', { timeout: 420_000 }` _(expression)_
    - :1016 `toHaveCount` expected `7` _(literal)_
    - :1025 `expect` expected _no expected value_ _(none)_
    - :1031 `toHaveAttribute` expected `'data-comparison', 'identical'` _(expression)_
    - :1034 `toHaveAttribute` expected `'data-comparison', 'refuted'` _(expression)_
    - :1038 `toHaveValue` expected `'remote-both'` _(literal)_
    - :1039 `toContainText` expected `'NO RECOVERY'` _(literal)_
    - :1040 `toBeVisible` expected _no expected value_ _(none)_
    - :1041 `toHaveCount` expected `4` _(literal)_
- `retirement and the no-op guard` — e2e/claims.spec.ts:1045
- `rebuilding retires the trace and the attack, and says so` — e2e/claims.spec.ts:1046
    - :1051 `toBeVisible` expected _no expected value_ _(none)_
    - :1055 `toHaveCount` expected `0` _(literal)_
    - :1056 `toHaveCount` expected `0` _(literal)_
    - :1058 `toHaveAttribute` expected `'data-retired', 'trace'` _(expression)_
    - :1059 `toContainText` expected `'described a different program'` _(literal)_
    - :1060 `toHaveAttribute` expected `'data-retired', 'dca'` _(expression)_
    - :1061 `toContainText` expected `'a different key'` _(literal)_
- `re-selecting the SAME placement does not retire a fresh verdict` — e2e/claims.spec.ts:1064
    - :1073 `toHaveCount` expected `1` _(literal)_
    - :1074 `toBe` expected `before` _(expression)_
    - :1075 `toHaveCount` expected `0` _(literal)_
- `scope, persistence and hidden content` — e2e/claims.spec.ts:1079
- `the honest framing is on the page, in the words the template asks for` — e2e/claims.spec.ts:1080
    - :1085 `expect` expected _no expected value_ _(none)_
    - :1086 `expect` expected _no expected value_ _(none)_
    - :1089 `expect` expected _no expected value_ _(none)_
    - :1090 `expect` expected _no expected value_ _(none)_
    - :1091 `expect` expected _no expected value_ _(none)_
    - :1092 `expect` expected _no expected value_ _(none)_
    - :1093 `expect` expected _no expected value_ _(none)_
    - :1096 `expect` expected _no expected value_ _(none)_
    - :1097 `toMatch` expected `/4-bit vulnerable/i` _(regex)_
- `nothing but the theme is persisted, and the theme is dark` — e2e/claims.spec.ts:1100
    - :1103 `toEqual` expected `['theme']` _(expression)_
    - :1104 `toBe` expected `'dark'` _(literal)_
    - :1105 `toHaveAttribute` expected `'data-theme', 'dark'` _(expression)_
    - :1106 `toHaveCount` expected `0` _(literal)_
- `no element is [hidden] while it paints` — e2e/claims.spec.ts:1109
    - :1122 `toEqual` expected `[]` _(expression)_
- `nothing on the page renders the word "undefined" or "null"` — e2e/claims.spec.ts:1125
    - :1137 `toMatch` expected _no expected value_ _(none)_
    - :1140 `toMatch` expected `/\bNaN\b/` _(regex)_
    - :1141 `toMatch` expected `/\[object Object\]/` _(regex)_
- `the scripture footer is the last visible element, verbatim and once` — e2e/claims.spec.ts:1144
    - :1147 `toHaveCount` expected `1` _(literal)_
    - :1148 `toHaveText` expected _no expected value_ _(none)_
- `responsive: no horizontal overflow at phone width after a full run` — e2e/claims.spec.ts:1153
    - :1163 `expect` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Glass Box

**Chow-style white-box AES-128, built in your browser and attacked from two
directions: a statistical attack that takes the key out of a few hundred
execution traces, and an algebraic one that strips the encodings off the tables
without running the program at all.**

[Live demo](https://systemslibrarian.github.io/crypto-lab-glass-box/)

![256 candidate values for one key byte competing on the left, one standing well
clear of the dashed second-best line; on the right the same traces split by the
bit that candidate predicts, with one column of samples separating light from
dark and the two group means pulling apart beneath it.](public/og-image.png)

*Rendered from a live run by `npm run og`, not drawn — so the picture cannot
drift away from what the page does.*

---

## What It Is

White-box cryptography asks a question ordinary cryptography does not: can a
program keep a key secret from someone who owns the machine it runs on, can read
every byte of it, run it as often as they like on inputs they choose, and watch
every value it puts in memory? Software that has to decrypt on hardware its owner
controls — a streaming client, a payment app, a licence check — has to answer it
somehow, because it ships the key inside the binary.

Chow, Eisen, Johnson and van Oorschot answered it in 2002 (SAC 2002) with the
construction everything since is built on: **do not store the key at all**. Rewrite
AES as a network of lookup tables, build each table with the round key already
folded in, and scramble every value passing between tables with a secret random
bijection so no intermediate is a plain AES value either. This lab builds that,
for real, from a key you choose, and then attacks it from both directions the
literature takes.

**Be precise about what each one reaches.** Differential computation analysis, in
Act 4, recovers the key: all sixteen bytes, from a few hundred traces of the
program's own table lookups. The algebraic attack in Act 6 runs step A1 of BGE
and recovers the round's output ENCODINGS from the tables, with no traces at all
— which is the foundation the published attack builds on to reach the key, and
the reaching is not implemented here. Two attack families, two different things
recovered on this page, and the README says which is which because a demo that
blurs them is teaching the wrong thing.

**The primitives, exactly.** AES-128 as FIPS 197 defines it, with the S-box
assembled from the GF(2^8) multiplicative inverse and the section 5.1.1 affine map
rather than transcribed. Chow's table network at full size: T-boxes, Ty_i tables
for MixColumns, nibble XOR tables, random 4-bit internal encodings on every wire,
and the 8x8 and 32x32 GF(2) mixing bijections of his section 3.2 — 2,032 tables
and 724 KB for the plain form, 4,016 tables and 1.43 MB when the external
encodings are compiled in.
Differential computation analysis exactly as Bos, Hubain, Michiels and Teuwen
describe it (CHES 2016): a difference of means over a software execution trace,
with 4,096 hypotheses scored per attack. Step A1 of the Billet–Gilbert–Ech-Chatbi
algebraic attack (SAC 2004), run live on the tables.

**The security model.** The attacker holds the program. That is the whole model,
and it is the one white-box cryptography was invented for. Nothing is assumed
about the attacker's side channels, timing or fault capability, because they do
not need any: they can read the tables.

**Not production crypto.** It runs entirely in your browser with no backend, the
key lives for as long as the tab does and is never sent anywhere, and the whole
point of it is to be broken. Do not use it to protect anything.

### The mathematics, in one paragraph

Chow reorders the AES round so ShiftRows comes first, which lets a single
256-entry table hold "add this round key byte, then apply the S-box". MixColumns
is folded into the same lookup by composing it with Ty_i, which spreads one input
byte across all four bytes of a column; the four results are summed by a tree of
4-bit XOR tables, because a table XOR-ing two bytes would need 65,536 entries and
one XOR-ing two nibbles needs 256. The full derivation of the BGE step this lab
runs — why composing one round's tables makes every internal encoding cancel, and
why the resulting set of 256 permutations is a group isomorphic to (GF(2^8), XOR)
— is a progressive-disclosure panel inside Act 6, next to the computation that
performs it, rather than a separate document that could drift from the code.

---

## Exhibits

There is a guided route across the top of the page: one primary action, a rail
showing the five stages, and a next step chosen from what your last run actually
produced. It guides without gating — every act, control, derivation and caveat
below is on the page and reachable at all times, and the route never presses a
button for you, because causing the failure is the point.

1. **The white-box threat model.** Plain language, no hex: what the attacker can
   do, and why "do not store the key" is a structural claim rather than a
   difficulty claim.
2. **Build the glass box.** Enter or generate an AES-128 key. The page compiles it
   into the table network in your browser and then checks that network against
   WebCrypto — an independent AES — on random blocks, and against the FIPS 197
   Appendix C.1 vector, before telling you anything else. The table inventory and
   the program size are read off the arrays that were allocated. A diagram of one
   column draws encoded wires solid and un-encoded ones hollow, puts remote
   encodings outside the program boundary, and has no box holding the key.
3. **Make the program tell on itself.** Run N traced encryptions and record the
   output of every table lookup, in order, into a preallocated bit matrix. The
   buffer size is computed before it is allocated. The trace looks like noise,
   which is the honest result and the reason the next act is needed.
4. **Take the key out of the trace.** For each key byte and each of 256 candidate
   values, predict one bit of a first-round intermediate, split the traces by that
   prediction, and measure the difference in the averages. Two targets — the
   SubBytes output and the multiplicative inverse inside it — which can be
   combined. A sixteen-cell strip shows what was recovered, what was missed, and
   the margin between each byte's best and second-best candidate, computed without
   the key. And the mechanism itself, beside the result: the same traces split by
   the predicted bit, with the two group means drawn beneath as a pair of bars per
   sample. Under the value the attack chose, one pair pulls apart. Under a
   deliberately wrong value, every pair stays level.

   Underneath it, **Bos et al.'s Tables 1 and 2, rebuilt on your own instance**:
   the rank of the true byte under every target and prediction bit. Their
   observation is that a bit which does not leak usually ranks the true byte
   *last* rather than at random, and that this too can be used to recover the key.
   It reproduces here — about 90 per cent of cells sit at rank 1 or rank 256 where
   an even spread would give 0.8 per cent — and it is offered as a second
   distinguisher you can select and measure. It needs more traces than the
   ordinary reading, and the page says so.
5. **What actually stops it: where the encoding lives.** Five states, each
   measured rather than asserted, accumulating into a comparison table: no
   external encodings; encodings compiled into the program; and encodings applied
   remotely on both sides, on the input side only, and on the output side only.
6. **The algebraic route.** BGE step A1, run live on the tables you built, with no
   traces at all. It extracts a group of 256 permutations from the tables, verifies
   it is isomorphic to (GF(2^8), XOR), and reports each output encoding stripped to
   a GF(2)-affine map — checkable on screen without any secret, because a quantity
   that varied before the recovered map is applied is constant after it.
7. **What came after.** Lepoint et al. (SAC 2013) cutting BGE to 2^22, and
   Rivain–Wang (TCHES 2019) breaking encodings wider than 4 bits.

---

## When to Use It

Use it to understand why "the key is not in the binary" is a different claim from
"the key cannot be extracted from the binary", and what it costs to get from one
to the other. It is the right demo for anyone who has been told that a white-box
implementation makes a shipped key safe.

**Do NOT use it to protect anything**, and do not read any result here as a
statement about white-box schemes in general. Every measurement on this page is
about the construction this page builds and the papers it cites. In particular,
do not read Act 4 as "4-bit encodings leak, wider ones are safe" — Rivain and Wang
broke encodings wider than 4 bits, including a byte-encoded implementation that
plain DCA had failed on. Nibble width is why FIRST-ORDER difference of means works
on Chow's design; it is not the boundary of the attack family.

---

## Live Demo

<https://systemslibrarian.github.io/crypto-lab-glass-box/>

Type a key or press Generate, press Trace it, press Run the attack, and watch
fourteen or so of the sixteen key bytes come back. Then tick the second target and
run it again to get the rest. Then change where the external encodings live in Act
2 and see which of those changes does anything. Then run Act 6, which recovers the
encodings from the tables without running the program once.

---

## What Can Go Wrong

**The things this construction does not protect against, and the ones this page
gets wrong if you are not careful.**

- **A few hundred execution traces are enough.** Not a fault attack, not a timing
  attack, not a physical measurement — just a recording of what the program read
  and wrote, and a difference of means. On this generator, one target at 384
  traces recovers 12 to 16 bytes of 16; the two targets combined recover 14 to 16.
- **Compiling the external encodings into the program buys nothing.** If the
  encoder is in the binary, the attacker can get from a plaintext they chose to
  the value the AES core sees, so the first-round hypotheses stay valid. Act 5
  measures this: the program grows, the trace grows, and the attack recovers
  exactly the same sixteen bytes.
- **Holding the encodings outside the program stops THIS attack, and moves the
  problem.** Something out there now holds a secret and has to apply it to every
  block — another piece of software, on some machine, with a secret in it. And it
  does not make the key unextractable: BGE recovers it from the tables alone, and
  its published attack covers the external encodings Chow specifies.
- **The construction has no failure code.** It cannot tell that it is being
  traced, cannot refuse to run, and raises nothing while its key is being
  extracted. Every failure code this page can show belongs to the page's own input
  validation, and the scope card says so in the same table.
- **Even the attack's failures leak.** Bos et al. noticed that a prediction bit
  which does not leak usually ranks the true key byte *last* of the 256
  candidates rather than at random, because the correct guess is the one sitting
  at a difference of means of nearly zero while every wrong guess picks up
  spurious correlation with the known input. Act 4 rebuilds their table on your
  instance and lets you score by anomaly instead of by correlation: at 2,048
  traces that alone recovers all sixteen bytes on this generator. There is no
  setting here that produces no information.
- **A confident-looking answer can still be wrong.** The margin between a byte's
  best and second-best candidate is computed without the key, so it is the
  confidence an attacker really has — and on this generator every byte above a
  0.15 margin was correct in all fifty measured input-side runs (five instances,
  five configurations, two trace counts). That is a measurement, not a guarantee:
  in one remote-both output-side run, where the attack is at chance, a byte
  cleared that margin anyway and was wrong.
- **The attack is asymmetric, and this is a lab-original measurement rather than a
  figure from any paper.** Attacking the output side recovers only part of the
  last round key and does not complete. Chow's first-round tables are 8 -> 32, so a
  first-round key byte is exposed through eight encoded nibbles; his round-10
  tables are 8 -> 8, so a last-round key byte is exposed through two. Four times
  fewer places for a correlation to be. And inverting the AES-128 key schedule
  needs all sixteen bytes of k^10, so a partial recovery of it yields nothing.
- **What this page's trace is not.** Real DCA captures the same kind of data from
  a foreign binary with dynamic binary instrumentation — Intel PIN, Valgrind, a
  debugger — which a browser cannot run. This page records the output of every
  table lookup from the inside. That is a real software execution trace of a real
  table network; it is not a physical side channel, and it is not a capture of
  someone else's binary. One consequence is visible in Act 3: a real ADDRESS trace
  shows the round structure plainly, because table base addresses repeat, and a
  trace of encoded lookup outputs does not.

---

## Real-World Usage

White-box implementations of AES and of other primitives ship in DRM clients,
mobile payment applications (host card emulation), pay-TV, and software licensing.
The commercial ones add obfuscation, control-flow flattening, anti-debugging and
sometimes masking on top of a Chow-style core; those raise the cost of getting a
trace, and the published attacks assume you got one. The practical significance of
DCA is exactly that it needs so little: Bos et al. point out that it requires
almost no knowledge of the design under attack, which is why it reached
implementations whose internals were never published.

The WhibOx contest series and the SideChannelMarvels "Deadpool" collection of
public challenge binaries are where this line of work is exercised in the open.
Importing such a challenge's tables is an extension seam marked in this lab's
source and deliberately not built: it needs a licence check first.

---

## How to Run Locally

`​``bash
npm install
npm run dev          # serves the lab
npm test             # the unit and correctness suite
npm run build        # typecheck, then production build
npm run test:a11y    # WCAG 2.1 A/AA gate against the production build
npm run test:claims  # does the page tell the truth?
npm run og           # re-render the social preview card from a live run
`​``

`npm run test:a11y` and `npm run test:claims` build the site and serve it on port
4685 before running, so what they judge is what ships.

---

## Primary Sources, and What Was Checked Against Them

Every central historical claim on this page names the section it comes from, and
those sections were read rather than repeated. What was verified, and where:

| Claim | Verified in |
|---|---|
| The construction: T-boxes, Ty_i, nibble XOR tables, 8-bit encodings built from two 4-bit ones, 32-bit from eight | Muir, ePrint 2013/104, sections 3.2–3.5 and 4.1 |
| 144 8×8 mixing bijections (rounds 2–10) and 36 32×32 ones (rounds 1–9); none at the round-1 T-box inputs | Muir, section 4.2 |
| External encodings are G ∘ E_k ∘ F⁻¹ | Muir §4.3; Bos et al. §2 |
| DCA is scoped to "at most a single remotely handled external encoding" — and with both sides remote "the implementation is not a white-box implementation of a standard algorithm … but of a modified algorithm" | Bos et al., introduction and §2 |
| External encodings compiled into the binary made no difference, "since in both cases we have knowledge of the original plaintexts before any encoding is applied" | Bos et al. §5.4 |
| 15 of 16 bytes from the SubBytes target at 2,000 traces; 16 of 16 from the inverse target, at about 500; "combining both attacks, we could always recover the full key" | Bos et al. §5.4, Tables 1 and 2 |
| A non-leaking bit ranks the true byte 256th "rather than being at a random position", and this "can also be used to recover the key" | Bos et al. §5.4, under Tables 1 and 2 |
| The one challenge DCA could not break had encodings that were not in the binary — and was broken by an algebraic attack instead | Bos et al. §5.5 |
| External encodings as a countermeasure "move the problem": the adversary can often learn them from the surrounding framework | Bos et al. §6 |
| BGE's 2³⁰: about 2²⁴ per output encoding, 16 × 2²⁴ = 2²⁸ per round, three rounds < 2³⁰, recovering two round keys | Muir, section 5.1 |
| BGE step A1: the group of 256 bijections, its basis, and Q̃(ψ(g)) = g(00) | Muir, section 5.1 — and this lab's A1 implements exactly that |

One figure was not aimed for and corroborates the build anyway: Bos et al. record
832 kbits of first-round traces over 500 runs, which is 1,664 bits per trace.
This lab records 1,792 bits for its own first round — two independent
implementations of the same construction, recording the same round, within eight
per cent of each other.

---

## Related Demos

- [Power Trace](https://systemslibrarian.github.io/crypto-lab-power-trace/) —
  first-order DPA on a physical power measurement. Same distinguisher, different
  channel: DCA is that attack with a software execution trace in place of a
  current probe, which is the observation Bos et al. start from.
- [Masked Core](https://systemslibrarian.github.io/crypto-lab-masked-core/) —
  second-order CPA against a masking countermeasure. The countermeasure line this
  lab's Act 7 names as out of scope.
- [Timing Oracle](https://systemslibrarian.github.io/crypto-lab-timing-oracle/) —
  a side channel that needs no access to the binary at all, for contrast with a
  threat model that assumes total access.
- [AES Modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/) — AES
  itself, if the cipher rather than the implementation is the unfamiliar part.
- [Model Breach](https://systemslibrarian.github.io/crypto-lab-model-breach/) —
  what happens when a security model's assumptions drift from deployment. The
  white-box model is the extreme case: the attacker owns everything.

---

## Build & Verify

**171 tests, all executed, none skipped.**

- **121 unit tests** (Vitest, `src/**/*.test.ts`).
- **47 claims tests** (Playwright, `e2e/claims.spec.ts`) — checking that the page
  tells the truth, by comparing values the page itself printed and re-deriving its
  claims from what is on screen.
- **3 accessibility tests** (Playwright + `@axe-core/playwright`,
  `e2e/a11y.spec.ts`) — the WCAG 2.1 A/AA gate, driven through thirty-odd states
  at 1280, 380 and 280 CSS pixels.

**Known-answer tests, from the specifications:**

| KAT | Where |
|---|---|
| FIPS 197 section 4.2.1 `xtime`, and the section 4.2 product {57}.{83} = {c1} | `src/aes/gf.test.ts` |
| FIPS 197 Figure 7 S-box, row 0 and six named entries, checked against an S-box ASSEMBLED from the field inverse and the section 5.1.1 affine map | `src/aes/gf.test.ts` |
| FIPS 197 Appendix A.1 key expansion, w[4]..w[7] and w[40]..w[43] | `src/aes/aes-ref.test.ts` |
| FIPS 197 Appendix B cipher example, and Appendix C.1 | `src/aes/aes-ref.test.ts` |
| NIST SP 800-38A F.1.1 ECB-AES128, all four blocks | `src/aes/aes-ref.test.ts` |
| The same four vector sets again, through the TABLE NETWORK, in all five external-encoding placements | `src/wb/wb-run.test.ts` |
| WebCrypto cross-check: 300 random (key, block) pairs against the reference, and 20 keys x 5 blocks x 5 placements through the network | `src/aes/aes-ref.test.ts`, `src/wb/wb-run.test.ts` |
| WebCrypto cross-check through the shipped page: 120 random blocks across five placements | `e2e/claims.spec.ts` |

**What is verified beyond the KATs:**

- **Invariant I1** — the network is AES-128 in every encoding placement, checked
  against WebCrypto (the independent path) as well as this repo's reference.
- **Invariant I2** — the attack modules cannot import a secret. `src/attack/*` may
  not import `wb-gen.ts`, `remote-enc.ts`, `rng.ts`, `encoding.ts` or `wb-run.ts`;
  `src/attack/isolation.test.ts` reads their imports and enforces it, and proves
  the check bites on a fabricated import.
- **Invariant I3** — `runDca` returns a committed answer and takes no argument it
  could reach the key through; `judgeRecovery` is a separate call, and so is the
  rank table, which is read out of the committed scoring afterwards.
- **The rank-extremity observation reproduces** — about 90 per cent of (bit, key
  byte) pairs rank the true byte at 1 or 256 where an even spread would give 0.8
  per cent, and scoring by anomaly alone recovers all sixteen bytes at 2,048
  traces. The test also asserts the honest other half: at 384 traces it is
  measurably worse than the ordinary reading.
- **The guided route completes** — a Playwright journey presses nothing but the
  one button the page offers next, at 1440×900 and at 390×844, and asserts that
  the first such button is above the fold before it starts.
- **A run link round-trips** — the settings it carries are reapplied, a key the
  reader typed is not in it, and a link full of nonsense falls back to the
  shipped defaults rather than trusting any of it.
- **A seed reproduces the run, not just the instance** — two runs of the same
  seed agree on all sixteen confidence margins, and two runs with no seed do
  not. The seed pins the encodings, the mixing bijections AND the plaintexts
  the attack is given, because a link that reproduced the program but not the
  result would not be reproducing anything a reader cares about.
- **BGE step A1 is correct, not merely self-consistent** — the recovered map
  composed with the true encoding is verified to be GF(2)-affine over all 2^16
  pairs, on four rounds and four columns; and a one-swap perturbation of the
  recovered map is verified to fail that check.
- **The two DCA scorers agree exactly** — a masked-popcount scorer and an
  XOR-convolution scorer sharing no arithmetic, required to produce identical
  peaks, samples, bits and margins.
- **The acceptance thresholds are measured, and recorded with their seeds and
  trace counts** in `src/attack/dca.test.ts`. They are properties of this
  generator, not of Chow's construction, and not the figures from any paper. The
  paper's own figures are quoted as the paper's, in Act 5 and below.

**Reported by Bos, Hubain, Michiels and Teuwen (CHES 2016)** about the
implementations they attacked, not about this one: 15 of 16 bytes from one target
on one instance at 2,000 traces, 16 of 16 using the multiplicative-inverse target,
and the full key whenever the two were combined across the instances they tested.
Those are quoted from section 5.4 of the paper, verbatim on the page. Everything
this lab asserts on its own account, it measured.

**Accessibility gate.** `@axe-core/playwright` scans the production build for zero
WCAG 2.1 A/AA violations and zero unexplained `incomplete` results, alongside a
composite-aware arithmetic contrast walk, a non-text-contrast and generated-content
oracle ratcheted against an empty baseline, a keyboard-reachability check on every
scrolling region, and a reflow check at 380 and 280 CSS pixels. The deploy is
blocked if any of it fails.

---

## Performance

Measured on an Apple-silicon laptop. Everything below runs in a Web Worker, so
the page stays responsive and reports progress while it happens.

| Step | Cost |
|---|---|
| Build a plain program: 2,032 tables, 724 KB | ~110 ms |
| Build with the external encodings compiled in: 4,016 tables, 1.43 MB | ~215 ms |
| 384 traced encryptions, 16,256 samples recorded each | ~40 ms |
| DCA, one target, all eight prediction bits: 32,768 hypothesis evaluations | ~0.95 s |
| DCA, both targets combined: 65,536 hypothesis evaluations | ~2.1 s |
| BGE step A1: 65,536 column evaluations | ~60 ms |

Each build is followed by the WebCrypto comparison on eight random blocks, which
is what the page waits for before reporting anything.

The attack's cost is almost flat in the trace count, which is why 2,048 traces are
as interactive as 128: the scoring is an XOR-convolution over the 256 byte values
rather than a pass over the traces. The binding constraint is the trace buffer,
which is one bit per sample per trace — and how many samples a trace has depends
on how big the program is, so the same trace count costs twice as much with the
external encodings compiled in as without them. The page computes the size before
allocating anything and refuses over 7 MB by name, which the compiled-in
placement reaches first, at about 1,800 traces where the others reach 2,048.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Return Path

- **slug**: `crypto-lab-return-path`
- **repo**: https://github.com/systemslibrarian/crypto-lab-return-path
- **live**: https://systemslibrarian.github.io/crypto-lab-return-path/
- **commit_sha**: `204d4b2c09330acde57127794cbea89607303067` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: advanced  ·  **--accent**: #9f88ff
- **MISSING FIELDS**: verification

**Name (H1)**: Return Path  — _read from src/main.ts_

**Subtitle**: Impossible differentials · Boomerang (Wagner 1999) · BCT (Cid et al. 2018)  — _read from src/main.ts_

**Description**: Two ways to break a cipher no single difference can cross — and the substitution layer where the textbook estimate for one of them turns out to be wrong by a factor of 1600.  — _read from src/main.ts_

**Why it matters**: A cipher can be provably safe against the attack it was designed to resist and fall to the next one. COCONUT98 was built to defeat differential cryptanalysis and the boomerang took it anyway; Skipjack lost 31 of its 32 rounds to a difference that never happens.  — _read from src/main.ts_

**Card copy**: Impossible differentials and the boomerang attack on the same toy SPN as Biham Lens, with DDT and BCT tables computed live, an adaptive chosen-ciphertext oracle, and a one-way-impossible crossing every round trip closes.

**Chips**: Impossible Differential · Boomerang Attack · BCT · Toy SPN

**Implements**: Toy SPN `src/crypto/experiments.ts:23`

**Attacks shown**: Boomerang attack `src/crypto/failures.ts:40`, Brute force `src/ui/switchPanel.ts:420`, Chosen-ciphertext attack `src/ui/boomerangPanel.ts:278`, Chosen-plaintext attack `src/ui/boomerangPanel.ts:278`, Differential cryptanalysis `src/main.ts:44`, Impossible differential `src/main.ts:33`, Linear cryptanalysis `src/ui/cipherPanel.ts:134`

**Comment-only (named in code comments, not executed)**: DES `src/crypto/spn.ts:18`, Shamir secret sharing `src/crypto/tables.ts:4`, STARK `src/crypto/experiments.ts:105`

**References**: AES, DES, KASUMI, MISTY1, Shamir secret sharing

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `ASIACRYPT 2009` — first seen README.md:210 (3×)
- `CHES 2007` — first seen src/crypto/sbox.ts:13 (4×)
- `EUROCRYPT 1999` — first seen README.md:202 (3×)
- `EUROCRYPT 2018` — first seen README.md:36 (3×)

**README — What Can Go Wrong**:

```text
The failure modes this page is built around, each reachable in the UI and each
wired to a test:

- **A zero DDT entry does not bound the boomerang.** The lab's negative claim. A
  crossing that is flatly impossible one way can let the round trip through every
  time. Any argument that treats one-way impossibility as a bound on a quartet is
  wrong, and Act 5 is the counterexample.
- **`p²q²` is an estimate, and it misses twice here.** Once at the switch, where a
  trail reading charges for a crossing the round trip need not pay. Once across
  the two backward pairs, which the estimate multiplies as if independent and
  which on this cipher are not. The second is a property of this toy, measured
  and reported, not a general law.
- **A single trail is not the differential.** A trail-based estimate *understates*
  a differential — by a factor of ten at six rounds here — so a designer who
  counts trails can believe a cipher safer than it is.
- **A recovered subkey is not a recovered key.** The sieve returns 8 of the 16
  master-key bits. 256 master keys share the recovered byte.
- **An end-to-end rate cannot be attributed to one trail.** Hundreds of middle
  paths share any two end differences. Act 4 separates them with an instrument
  that reads the key (and says so); Act 5 avoids the problem entirely.
- **The impossible differential covers three rounds, not four.** On the full
  four-round cipher every output difference is reachable from every input
  difference. That is the measured result, not a gap in the search.
- **A one-layer switch can only help the boomerang.** `BCT ≥ DDT` pointwise,
  proven entry by entry in the tests. So Murphy's incompatibility, in the form
  where the real rate falls far *below* the estimate, needs a middle section
  wider than one substitution layer — which this page does not model and does not
  claim to.
- **Small blocks distort the boomerang.** Degenerate quartets, where the
  ciphertext shift happens to equal the pair's own difference, return for free.
  Negligible at 64 bits; percent-scale here. They are excluded and counted — and
  that exclusion moves the random baseline from `1/255` to **`1/253`**, which the
  page uses and the tests derive by enumerating every permutation of a smaller
  block.
- **Pooled intervals lie when the samples are clustered.** The 128 quartets one
  key contributes share its subkeys, so treating them as 128 independent trials
  reports an interval that is too narrow. Every interval here resamples keys.
- **A trail search does not find the best differential.** From four rounds on,
  the endpoint pair joined by the strongest trail is not the pair with the
  strongest differential. A tool that maximises one and reports the other is
  claiming more than it computed, which is why this lab names the two functions
  apart.
- **A trail probability is not a promise about your key.** Only 6 144 of the
  65 536 keys carry a quartet realising the shipped trail, and for one of the four
  cases **no key does**. The page reports which key it found and how many it tried.
```

**Claims tested** (e2e/claims.spec.ts, 51 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:36
    - :36 `toHaveCount` expected `1` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:45
    - :45 `toHaveLength` expected `16` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:54
    - :54 `toHaveLength` expected `8` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:98
    - :98 `toHaveLength` expected `8` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:106
    - :106 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:128
    - :128 `toHaveAttribute` expected `'data-run', '0'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:138
    - :138 `toHaveAttribute` expected `'data-run', before` _(expression)_
- `the switch rate on screen is what the page’s own S-box gives, re-derived here` — e2e/claims.spec.ts:143
    - :170 `toBe` expected `'${closed}/256'` _(expression)_
    - :174 `toBe` expected `closed` _(expression)_
    - :178 `expect` expected _no expected value_ _(none)_
- `the BCT and DDT cells the page shows equal an independent brute force` — e2e/claims.spec.ts:181
    - :188 `toHaveCount` expected `1` _(literal)_
    - :196 `toHaveCount` expected `16` _(literal)_
    - :199 `toHaveLength` expected `16` _(literal)_
    - :200 `toEqual` expected `derived[r]` _(expression)_
- `PARTS-SUM-TO-WHOLE: every DDT row the page prints sums to 16` — e2e/claims.spec.ts:205
    - :212 `toBe` expected `16` _(literal)_
- `the BCT cells the page marks are never below the DDT cells it marks` — e2e/claims.spec.ts:216
    - :229 `toHaveLength` expected `2` _(literal)_
    - :230 `toHaveLength` expected `2` _(literal)_
    - :232 `expect` expected _no expected value_ _(none)_
- `the permutation the page prints sends two bits of each nibble into each nibble` — e2e/claims.spec.ts:236
    - :243 `toHaveLength` expected `2` _(literal)_
    - :244 `toHaveLength` expected `2` _(literal)_
    - :245 `toBe` expected `8` _(literal)_
    - :247 `expect` expected _no expected value_ _(none)_
- `Act 1: the chart, the table and the verdict all report the same measurement` — e2e/claims.spec.ts:252
    - :266 `toBe` expected `rowMeasured` _(expression)_
    - :269 `expect` expected _no expected value_ _(none)_
    - :277 `toBeCloseTo` expected `p * 128, 1` _(expression)_
    - :281 `toBe` expected `256 * 128` _(expression)_
- `Act 1: the trail prediction really is worse than the differential prediction` — e2e/claims.spec.ts:284
    - :298 `expect` expected _no expected value_ _(none)_
    - :300 `toBeCloseTo` expected `0, 2` _(expression)_
    - :301 `expect` expected _no expected value_ _(none)_
    - :310 `toBeCloseTo` expected `Math.pow(2, measured - trail[5]), 0` _(expression)_
- `Act 2: the impossible list is exactly the differences absent from the reachable set` — e2e/claims.spec.ts:315
    - :330 `toBe` expected `ruledCount` _(expression)_
    - :337 `expect` expected _no expected value_ _(none)_
    - :345 `expect` expected _no expected value_ _(none)_
    - :346 `expect` expected _no expected value_ _(none)_
    - :347 `expect` expected _no expected value_ _(none)_
- `Act 2: the miss-in-the-middle overlap really is empty, as the page claims` — e2e/claims.spec.ts:350
    - :356 `toHaveLength` expected `2` _(literal)_
    - :360 `expect` expected _no expected value_ _(none)_
    - :362 `toBe` expected `forwardChips.length` _(expression)_
    - :364 `toHaveClass` expected `/mim-empty/` _(regex)_
    - :365 `toHaveText` expected `'No value appears in both lists'` _(literal)_
    - :367 `toHaveCount` expected `0` _(literal)_
    - :388 `toEqual` expected `reachable` _(expression)_
- `Act 2 FAILURE PATH: a zero input difference is refused and the cause is named` — e2e/claims.spec.ts:391
    - :398 `toHaveCount` expected `1` _(literal)_
    - :399 `toContainText` expected `'E_ALPHA_ZERO'` _(literal)_
    - :401 `toContainText` expected `'one plaintext encrypted twice'` _(literal)_
    - :402 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :404 `toHaveCount` expected `0` _(literal)_
- `Act 2 FAILURE PATH: a zero output difference names the collapsed quartet` — e2e/claims.spec.ts:407
    - :411 `toContainText` expected `'E_DELTA_ZERO'` _(literal)_
    - :412 `toContainText` expected _no expected value_ _(none)_
- `Act 2 FAILURE PATH: an unparseable byte is refused as a range error` — e2e/claims.spec.ts:417
    - :421 `toContainText` expected `'E_RANGE'` _(literal)_
    - :422 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
- `Act 2: a differential that IS possible is reported as possible, with a count` — e2e/claims.spec.ts:425
    - :434 `toContainText` expected `'POSSIBLE'` _(literal)_
    - :443 `expect` expected _no expected value_ _(none)_
    - :444 `expect` expected _no expected value_ _(none)_
- `RETIREMENT: changing an input retires the verdict and the page says so` — e2e/claims.spec.ts:451
    - :453 `toContainText` expected `'IMPOSSIBLE'` _(literal)_
    - :456 `toHaveCount` expected `0` _(literal)_
    - :459 `toHaveCount` expected `1` _(literal)_
    - :460 `toContainText` expected `'VERDICT RETIRED'` _(literal)_
    - :461 `toContainText` expected `'the output difference'` _(literal)_
- `RETIREMENT: changing the key count retires it too, naming the key count` — e2e/claims.spec.ts:464
    - :467 `toContainText` expected `'the key count'` _(literal)_
- `NO-OP GUARD: re-entering the same value must NOT retire a fresh verdict` — e2e/claims.spec.ts:470
    - :476 `toHaveCount` expected `0` _(literal)_
    - :477 `toHaveText` expected `before ?? ''` _(expression)_
- `Act 3: the survivor count matches the chips, and the true subkey is among them` — e2e/claims.spec.ts:482
    - :496 `toHaveCount` expected `left` _(expression)_
    - :508 `toBe` expected `lowByte` _(expression)_
    - :510 `expect` expected _no expected value_ _(none)_
- `Act 3: the I5 verdict is on screen and the elimination curve only falls` — e2e/claims.spec.ts:513
    - :515 `toContainText` expected _no expected value_ _(none)_
    - :519 `toHaveCount` expected `0` _(literal)_
    - :520 `toContainText` expected `'E_TRUE_KEY_ELIMINATED'` _(literal)_
- `Act 3 FAILURE PATH: a malformed master key is refused and named` — e2e/claims.spec.ts:523
    - :527 `toContainText` expected `'E_RANGE'` _(literal)_
    - :528 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
- `Act 3 FAILURE PATH: the weakest sieve reports running out of data, not a guess` — e2e/claims.spec.ts:531
    - :546 `toContainText` expected `'E_SIEVE_AMBIGUOUS'` _(literal)_
    - :548 `toContainText` expected `'the data ran out, not the method'` _(literal)_
    - :550 `toContainText` expected _no expected value_ _(none)_
    - :560 `expect` expected _no expected value_ _(none)_
- `Act 4: the measured rate, its interval and its counts are mutually consistent` — e2e/claims.spec.ts:565
    - :583 `toBeCloseTo` expected `rate, 5` _(expression)_
    - :594 `toBe` expected `keyCount * 128` _(expression)_
- `Act 4: the distinguisher claim is backed by non-overlapping intervals` — e2e/claims.spec.ts:597
    - :599 `toContainText` expected `'IT CAME BACK'` _(literal)_
    - :615 `expect` expected _no expected value_ _(none)_
    - :616 `expect` expected _no expected value_ _(none)_
    - :617 `expect` expected _no expected value_ _(none)_
- `Act 4: p2q2 is reported as wrong, and the page shows by how much` — e2e/claims.spec.ts:622
    - :625 `toContainText` expected `'p2q2 IS WRONG'` _(literal)_
    - :627 `toMatch` expected `/p = 0\.\d+/` _(regex)_
    - :628 `toMatch` expected `/q = 0\.\d+/` _(regex)_
    - :629 `expect` expected _no expected value_ _(none)_
- `Act 5: the case table agrees with an independent BCT derivation for every case` — e2e/claims.spec.ts:634
    - :645 `toBe` expected `4` _(literal)_
    - :657 `toBe` expected `'${ddt[bh][gh]}x${ddt[bl][gl]} /16'` _(expression)_
    - :658 `toBe` expected `'${bct[bh][gh]}x${bct[bl][gl]} /16'` _(expression)_
    - :660 `toBe` expected `'${bct[bh][gh] * bct[bl][gl]}/256'` _(expression)_
- `Act 5 FAILURE PATH: the incompatible switch refuses, and the walk says why` — e2e/claims.spec.ts:664
    - :673 `toHaveCount` expected `1` _(literal)_
    - :674 `toContainText` expected _no expected value_ _(none)_
    - :677 `toContainText` expected _no expected value_ _(none)_
    - :682 `toContainText` expected _no expected value_ _(none)_
    - :685 `toHaveCount` expected `0` _(literal)_
    - :692 `expect` expected _no expected value_ _(none)_
- `Act 5: the quartet walk replays a real quartet, checked leg by leg` — e2e/claims.spec.ts:695
    - :697 `toHaveCount` expected `8` _(literal)_
    - :702 `toHaveText` expected `'Step ${i} of 8.'` _(expression)_
    - :706 `toBe` expected `q.p1 ^ q.p2` _(expression)_
    - :708 `toBe` expected `q.c4 ^ q.c2` _(expression)_
    - :710 `toBe` expected `4` _(literal)_
    - :711 `toBe` expected `4` _(literal)_
- `nothing marked [hidden] is actually painted` — e2e/claims.spec.ts:716
    - :728 `toEqual` expected `[]` _(expression)_
- `NEG-1 assertion 1: the fixture is reachable through the UI` — e2e/claims.spec.ts:754
    - :756 `toHaveAttribute` expected `'data-case', 'ladder'` _(expression)_
    - :759 `toHaveText` expected `'Step ${i} of 8.'` _(expression)_
    - :761 `toBeDisabled` expected _no expected value_ _(none)_
    - :771 `toBe` expected `0` _(literal)_
    - :772 `toBe` expected `0` _(literal)_
    - :773 `toBe` expected `16` _(literal)_
    - :774 `toBe` expected `16` _(literal)_
- `NEG-1 assertion 2: in that state every check the page performs reports success` — e2e/claims.spec.ts:777
    - :783 `toHaveText` expected `'Step ${i} of 8.'` _(expression)_
    - :788 `toContainText` expected _no expected value_ _(none)_
    - :792 `toContainText` expected _no expected value_ _(none)_
    - :796 `toHaveCount` expected `1` _(literal)_
    - :798 `toHaveCount` expected `1` _(literal)_
    - :802 `toBe` expected `q.p1 ^ q.p2` _(expression)_
    - :804 `toHaveCount` expected `0` _(literal)_
    - :805 `toHaveCount` expected `0` _(literal)_
    - :806 `toHaveCount` expected `0` _(literal)_
    - :807 `toHaveCount` expected `0` _(literal)_
- `NEG-1 assertion 3: the limitation is visible in that state, not hidden away` — e2e/claims.spec.ts:810
    - :816 `toHaveText` expected `'Step ${i} of 8.'` _(expression)_
    - :819 `toHaveCount` expected `1` _(literal)_
    - :821 `toBeVisible` expected _no expected value_ _(none)_
    - :822 `toContainText` expected _no expected value_ _(none)_
    - :827 `expect` expected _no expected value_ _(none)_
    - :828 `expect` expected _no expected value_ _(none)_
    - :830 `toHaveCount` expected `8` _(literal)_
    - :833 `toHaveCount` expected `1` _(literal)_
    - :834 `toBeVisible` expected _no expected value_ _(none)_
    - :835 `toBe` expected `true` _(expression)_
- `NEG-2: a unique recovery says on screen that the master key is still secret` — e2e/claims.spec.ts:846
    - :855 `toHaveCount` expected `1` _(literal)_
    - :856 `toContainText` expected _no expected value_ _(none)_
    - :860 `expect` expected _no expected value_ _(none)_
    - :861 `expect` expected _no expected value_ _(none)_
    - :863 `toHaveCount` expected `0` _(literal)_
    - :864 `toBeVisible` expected _no expected value_ _(none)_
    - :870 `toHaveLength` expected `1` _(literal)_
    - :871 `expect` expected _no expected value_ _(none)_
- `the page says it is not production crypto, in the page` — e2e/claims.spec.ts:876
    - :878 `toContainText` expected `'Not production cryptography'` _(literal)_
    - :879 `toBeVisible` expected _no expected value_ _(none)_
    - :884 `toBe` expected `0` _(literal)_
    - :885 `toHaveCount` expected `0` _(literal)_
- `the attack model is stated before Act 4 runs (invariant I6)` — e2e/claims.spec.ts:888
    - :891 `toBeVisible` expected _no expected value_ _(none)_
    - :892 `toContainText` expected `'adaptive chosen-ciphertext'` _(literal)_
    - :900 `toBe` expected `1` _(literal)_
- `every measured rate on screen carries its sample size (invariant I2)` — e2e/claims.spec.ts:903
    - :906 `expect` expected _no expected value_ _(none)_
    - :909 `expect` expected _no expected value_ _(none)_
    - :912 `expect` expected _no expected value_ _(none)_
    - :915 `expect` expected _no expected value_ _(none)_
- `the scripture footer is the last visible element, verbatim and once` — e2e/claims.spec.ts:920
    - :923 `toHaveCount` expected `1` _(literal)_
    - :924 `toHaveText` expected _no expected value_ _(none)_
    - :931 `toBe` expected `true` _(expression)_
- `twenty rapid S-box toggles never leave one table’s numbers under the other’s label` — e2e/claims.spec.ts:952
    - :981 `toHaveAttribute` expected `'aria-busy', 'true', settled` _(expression)_
    - :982 `toHaveAttribute` expected `'aria-busy', 'true', settled` _(expression)_
    - :983 `toHaveAttribute` expected `'aria-busy', 'true', settled` _(expression)_
    - :987 `toEqual` expected `[` _(expression)_
    - :992 `toHaveCount` expected `4` _(literal)_
    - :998 `toBe` expected `'${expected}/256'` _(expression)_
    - :1006 `toBe` expected `'${bct[bh][gh]}/16 and ${bct[bl][gl]}/16'` _(expression)_
- `Act 5 drops an older quartet response even when both cases use the same split` — e2e/claims.spec.ts:1009
    - :1054 `toHaveAttribute` expected `'data-case', 'ladder'` _(expression)_
    - :1058 `toHaveAttribute` expected `'aria-busy', 'true'` _(expression)_
    - :1059 `toHaveAttribute` expected `'aria-busy', 'true'` _(expression)_
    - :1060 `toHaveText` expected _no expected value_ _(none)_
- `a panel is marked busy while it runs and settles afterwards` — e2e/claims.spec.ts:1065
    - :1076 `toHaveAttribute` expected `'aria-busy', 'true'` _(expression)_
    - :1077 `toHaveCount` expected `1` _(literal)_
- `pressing a run button does not steal focus from it` — e2e/claims.spec.ts:1080
    - :1088 `expect` expected _no expected value_ _(none)_
    - :1096 `toBe` expected `1` _(literal)_
- `each panel announces ONE sentence, not its whole contents` — e2e/claims.spec.ts:1099
    - :1106 `toHaveAttribute` expected `'role', 'status'` _(expression)_
    - :1107 `toHaveAttribute` expected `'aria-live', 'polite'` _(expression)_
    - :1109 `expect` expected _no expected value_ _(none)_
    - :1111 `expect` expected _no expected value_ _(none)_
    - :1115 `toHaveAttribute` expected `'role', 'region'` _(expression)_
    - :1116 `expect` expected _no expected value_ _(none)_
- `the share link round-trips every control` — e2e/claims.spec.ts:1120
    - :1126 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :1132 `toHaveCount` expected `1` _(literal)_
    - :1134 `expect` expected _no expected value_ _(none)_
    - :1135 `expect` expected _no expected value_ _(none)_
    - :1136 `expect` expected _no expected value_ _(none)_
    - :1137 `expect` expected _no expected value_ _(none)_
    - :1141 `toHaveValue` expected `'0x04'` _(literal)_
    - :1142 `toHaveValue` expected `'4'` _(literal)_
    - :1143 `toHaveValue` expected `'0xabcd'` _(literal)_
    - :1144 `toHaveAttribute` expected `'data-case', 'amplified'` _(expression)_
- `a share link cannot inject a value the controls do not offer` — e2e/claims.spec.ts:1147
    - :1153 `toHaveAttribute` expected `'data-run', '0'` _(expression)_
    - :1155 `toHaveValue` expected `'weak'` _(literal)_
    - :1156 `toHaveValue` expected `'3'` _(literal)_
    - :1157 `toHaveValue` expected `'256'` _(literal)_
    - :1158 `toHaveValue` expected `'4,10'` _(literal)_
    - :1159 `toHaveAttribute` expected `'data-case', 'ladder'` _(expression)_
- `Reset everything really restores every shipped default` — e2e/claims.spec.ts:1162
    - :1170 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :1176 `toHaveValue` expected `'weak'` _(literal)_
    - :1177 `toHaveValue` expected `'0x0a'` _(literal)_
    - :1178 `toHaveValue` expected `'0x01'` _(literal)_
    - :1179 `toHaveValue` expected `'256'` _(literal)_
    - :1180 `toHaveValue` expected `'256'` _(literal)_
    - :1181 `toHaveValue` expected `'512'` _(literal)_
    - :1182 `toHaveAttribute` expected `'data-case', 'ladder'` _(expression)_
    - :1184 `toContainText` expected `'IMPOSSIBLE'` _(literal)_
- `the run metadata says how long it took and which thread ran it` — e2e/claims.spec.ts:1187
    - :1190 `toContainText` expected `/\d+ ms/` _(regex)_
    - :1191 `toContainText` expected `/worker thread|main thread/` _(regex)_

**Mutation records** (1 file(s)):

- `src/crypto/permutation.ts` (1663 bytes)

<details><summary>Full README</summary>

```markdown
# Return Path

**Impossible differentials · Boomerang (Wagner 1999) · BCT (Cid et al. 2018)**

When no single differential survives enough rounds, split the cipher in half and
chain two short ones — or use a difference that can *never* happen.

**[Live demo →](https://systemslibrarian.github.io/crypto-lab-return-path/)**

---

## What It Is

A browser lab for the two second-generation differential techniques, run against
the **same toy SPN cipher** as [Biham Lens](https://github.com/systemslibrarian/crypto-lab-biham-lens)
and [Matsui Line](https://github.com/systemslibrarian/crypto-lab-matsui-line) — 8-bit
block, 16-bit key, four rounds of key-mix / 4-bit substitution / bit permutation.
The cipher is **reimplemented here and checked exhaustively against the sibling
lab's own function** — the S-box, permutation and key-schedule constants are
copied, and the tests transcribe biham-lens's `encrypt` longhand and compare
every plaintext against it. "Byte for byte" is the result, not the method, and
the difference matters: the agreement is a test, not a claim (see
**Build & Verify**).

Three primitives, all hand-rolled so the internals are inspectable:

- **The cipher** — `src/crypto/spn.ts`. The S-box and bit permutation of
  `crypto-lab-biham-lens`, its rotate-left-4 key schedule, and its round
  structure. The round count runs to six, past the published four, because on
  this cipher the interesting decay happens after round four.
- **The DDT** (difference distribution table) — Biham and Shamir's tool.
  `DDT[a][b]` counts the inputs that turn input difference `a` into output
  difference `b` through one S-box. A zero entry is the statement the impossible
  differential is built on.
- **The BCT** (Boomerang Connectivity Table) — Cid, Huang, Peyrin, Sasaki and
  Song, EUROCRYPT 2018. `BCT[a][b]` counts the inputs for which the boomerang's
  *round trip* through one S-box — in with difference `a`, shifted by `b`, back
  out — returns `a`. Both tables are computed from the S-box in the page.

**Security model.** Act 3 is a chosen-plaintext attack. Acts 4 and 5 need chosen
plaintexts *and* an **adaptive chosen-ciphertext oracle**: the second pair of
ciphertexts is chosen only after the first pair comes back. That is a strong
assumption, stated on screen before the boomerang runs, and it is why rectangle
attacks — which drop the decryption half — exist.

**Not production cryptography.** An 8-bit block holds 256 plaintexts and a
16-bit key 65 536 keys. This cipher is a teaching target built to be broken in
front of you. Nothing here is a statement about a cipher anyone deploys.

### The one result worth the visit

An impossible differential proves a difference can *never* cross three rounds.
The boomerang's switch has a crossing whose one-way table entry is **zero** — it
can never happen in one direction, for any key — and the round trip through that
same crossing closes for **all 256 middle states**. Impossibility in one
direction does not bound a quartet, and the page measures both halves of that
sentence rather than asserting either.

## Exhibits

The page opens on the result: a live teaser showing the two table entries side by
side — `0/16` one way, `16/16` on the round trip — with one action that lands you
in Act 5 with the quartet already stepping. A chapter navigator follows, then the
acts in order.

0. **The cipher you already broke.** The S-box, the bit permutation and the key
   schedule, shown the way the sibling labs show them. A disclosure notes the
   schedule's period of four, which Act 3 later exploits.
1. **One trail is not enough.** The best trail for 1…6 rounds, with three numbers
   per round: the single-trail prediction (a product of DDT entries), the
   differential's real probability (a sum over every trail), and the measured
   rate. The threshold where the expected right pairs in the whole codebook fall
   below one is marked on the chart itself. Two results: the single-trail
   prediction is out by a factor of ten at six rounds, and from four rounds on the
   best trail does not even point at the best differential — a different endpoint
   pair, found by exhausting all 65 025 of them.
2. **A difference that never happens.** A miss-in-the-middle diagram leads: the
   forward-reachable middle differences on one side, the backward-required ones on
   the other, and an explicitly empty intersection between them. Then type any two
   differences and press *Try to make it happen* — the page encrypts real pairs and
   counts, and *all 65 536 keys* checks it against every key the cipher has.
   Changing an input retires the verdict rather than leaving it to look like an
   answer to a question nobody asked.
3. **Eliminating keys with an event that cannot occur.** The three-round
   impossible differential aimed at the last round of the **full four-round
   cipher**. 256 candidates for the final mixing key fall as pairs arrive; the
   true subkey is never eliminated. Pick the weakest sieve and watch it honestly
   run out of data instead of guessing.
4. **The boomerang.** The quartet procedure against the real cipher, with the
   measured return rate set against `p²q²`, against the BCT-corrected estimate,
   and against the same procedure run on **real random permutations** — the null a
   distinguisher has to beat. Intervals are a cluster bootstrap over keys, with
   the narrower pooled interval shown beside them so the cost of assuming
   independence is visible. Degenerate quartets are excluded and counted, the
   per-key spread is drawn as a distribution, and a decomposition reports what
   share of the returns followed the stated trail.
5. **The switch, where the estimate breaks.** The headline exhibit, in two parts.
   A real quartet stepped through eight stages on a square whose corners never
   move — every value produced by the real cipher under a real key — stopping at
   the switch to show the one-way table entry of zero before the round trip closes
   anyway. Then the switch measured on its own over **all 256 middle states**: no
   sampling, no interval, exact. Four cases, of which the BCT explains all four and
   the trail reading gets three wrong. The split point is a control, so you can
   move the switch and watch `p`, `q` and the estimate move with it.
6. **Why anyone cares.** Skipjack, IDEA, COCONUT98, AES-192/256, and the
   Murphy → Cid et al. correction, with round counts checked and complexities
   deliberately not quoted.

Plus a permanent honesty panel, outside every disclosure.

### A note on the palette

The build brief proposed `#F472B6`. This lab ships `#9f88ff` instead, because the
catalog's `CLAUDE.md` fixes a four-colour accent rotation and requires
neighbouring cards to differ: Biham Lens and Matsui Line both use `#ff6b7f`, and
`#F472B6` reads as the same colour beside them. Violet is on-palette and distinct
from all three of this lab's nearest neighbours in the cryptanalysis section.

## When to Use It

Use it to teach why security against one attack is not security; to show the gap
between a trail and a differential; to introduce impossible differentials without
hand-waving the impossibility; and to make the BCT concrete for someone who has
read the definition and not felt it.

**Do NOT use this cipher, or this code, for anything.** An 8-bit block is not
encryption. Do not lift `src/crypto/spn.ts` into a project, do not treat the
sieve as a template for a real attack, and do not read any timing here as
constant-time — nothing in this lab attempts it.

## Live Demo

**<https://systemslibrarian.github.io/crypto-lab-return-path/>**

You can: change the substitution table and watch every measurement rerun; type
your own differences and try to make an impossible one happen; set the round
count in Acts 2 and 3; raise any run to the whole 65 536-key space; move the
boomerang's split point and watch p, q and the estimate move with it; step a real
quartet through the switch one stage at a time; pick a switch that can never
close and see the page refuse to show a quartet; weaken the sieve until it runs
out of data; and copy a link that reproduces any run exactly.

Every run prints its elapsed time and whether a Worker or the main-thread
fallback produced it.

## What Can Go Wrong

The failure modes this page is built around, each reachable in the UI and each
wired to a test:

- **A zero DDT entry does not bound the boomerang.** The lab's negative claim. A
  crossing that is flatly impossible one way can let the round trip through every
  time. Any argument that treats one-way impossibility as a bound on a quartet is
  wrong, and Act 5 is the counterexample.
- **`p²q²` is an estimate, and it misses twice here.** Once at the switch, where a
  trail reading charges for a crossing the round trip need not pay. Once across
  the two backward pairs, which the estimate multiplies as if independent and
  which on this cipher are not. The second is a property of this toy, measured
  and reported, not a general law.
- **A single trail is not the differential.** A trail-based estimate *understates*
  a differential — by a factor of ten at six rounds here — so a designer who
  counts trails can believe a cipher safer than it is.
- **A recovered subkey is not a recovered key.** The sieve returns 8 of the 16
  master-key bits. 256 master keys share the recovered byte.
- **An end-to-end rate cannot be attributed to one trail.** Hundreds of middle
  paths share any two end differences. Act 4 separates them with an instrument
  that reads the key (and says so); Act 5 avoids the problem entirely.
- **The impossible differential covers three rounds, not four.** On the full
  four-round cipher every output difference is reachable from every input
  difference. That is the measured result, not a gap in the search.
- **A one-layer switch can only help the boomerang.** `BCT ≥ DDT` pointwise,
  proven entry by entry in the tests. So Murphy's incompatibility, in the form
  where the real rate falls far *below* the estimate, needs a middle section
  wider than one substitution layer — which this page does not model and does not
  claim to.
- **Small blocks distort the boomerang.** Degenerate quartets, where the
  ciphertext shift happens to equal the pair's own difference, return for free.
  Negligible at 64 bits; percent-scale here. They are excluded and counted — and
  that exclusion moves the random baseline from `1/255` to **`1/253`**, which the
  page uses and the tests derive by enumerating every permutation of a smaller
  block.
- **Pooled intervals lie when the samples are clustered.** The 128 quartets one
  key contributes share its subkeys, so treating them as 128 independent trials
  reports an interval that is too narrow. Every interval here resamples keys.
- **A trail search does not find the best differential.** From four rounds on,
  the endpoint pair joined by the strongest trail is not the pair with the
  strongest differential. A tool that maximises one and reports the other is
  claiming more than it computed, which is why this lab names the two functions
  apart.
- **A trail probability is not a promise about your key.** Only 6 144 of the
  65 536 keys carry a quartet realising the shipped trail, and for one of the four
  cases **no key does**. The page reports which key it found and how many it tried.

## Real-World Usage

Round counts are from the primary papers. **Data and time complexities are
deliberately not quoted anywhere in this lab** — they were not verified against
the primary sources while it was written, and a confidently wrong exponent is
worse than no exponent.

- **Skipjack, 31 of 32 rounds.** Biham, Biryukov and Shamir broke Skipjack
  reduced to 31 rounds with a 24-round impossible differential (EUROCRYPT 1999) —
  at the time the best known attack on the cipher.
- **IDEA and Khufu.** The same authors named the technique "miss in the middle"
  and applied it to both (FSE 1999).
- **COCONUT98.** Wagner introduced the boomerang against a cipher designed to be
  provably secure against conventional differential cryptanalysis. It was. Two
  halves still got through.
- **AES-192 and AES-256, full round count.** Biryukov and Khovratovich's
  **related-key** boomerangs (ASIACRYPT 2009) reach both, and the switching
  techniques they introduced — the ladder switch and the S-box switch — are what
  this lab's first switch case is an instance of. Related-key is a far stronger
  model than the single-key one here, and these results do not threaten AES as
  deployed. This lab does not implement related-key boomerangs.
- **The correction.** Murphy (IEEE Trans. IT, 2011) showed independently chosen
  trails can be incompatible, so `p²q²` can be badly wrong. Cid, Huang, Peyrin,
  Sasaki and Song answered it with the BCT (EUROCRYPT 2018) — exact accounting for
  a one-layer switch, which is what Act 5 measures. The *problem* is Murphy's; the
  *tool* is Cid et al.'s.

Knudsen's DEAL report (1998) is an early, independent use of
impossible-differential reasoning. It is **not** the first: Biham had already used
related impossible-event reasoning on Ladder-DES, and zero DDT entries were long
known. Follow the history in Biham–Biryukov–Shamir 1999.

## How to Run Locally

`​``sh
git clone https://github.com/systemslibrarian/crypto-lab-return-path.git
cd crypto-lab-return-path
npm install
npm run dev          # http://localhost:5173/crypto-lab-return-path/
`​``

`​``sh
npm test             # 155 unit tests (Vitest)
npm run build        # tsc --noEmit && vite build
npx playwright install chromium
npm run test:a11y    # the axe WCAG 2.1 A/AA gate
npm run test:claims  # 50 claims tests + 7 entry-experience gates
`​``

`npx playwright install chromium` — never `--with-deps`. That apt step wedged 547
runs across this fleet, and the GitHub runner image already carries the libraries
Chromium needs.

## Related Demos

This is the third lab on one cipher, and the three are meant to be read in order.

- **[Biham Lens](https://systemslibrarian.github.io/crypto-lab-biham-lens/)** —
  differential cryptanalysis, and where this cipher is defined. Start here if
  "differential" is new; Act 1 assumes it.
- **[Matsui Line](https://systemslibrarian.github.io/crypto-lab-matsui-line/)** —
  linear cryptanalysis on the same cipher, and the piling-up lemma's prediction
  missing. The same shape of lesson as Act 1 here, in different mathematics.
- **[Misty Lens](https://systemslibrarian.github.io/crypto-lab-misty-lens/)** —
  the related-key *sandwich* distinguisher on MISTY1 and KASUMI: the boomerang's
  close relative, in the stronger attack model this lab does not enter.
- The rest of the suite: **[Crypto Lab](https://crypto-lab.systemslibrarian.dev/)**.

## Build & Verify

**155 unit tests (Vitest), all passing.** The checks that matter most:

| What | Where |
|---|---|
| The cipher agrees with `crypto-lab-biham-lens` on every plaintext — 1 024 keys with the textbook S-box, 256 with PRESENT — against a longhand transcription of that lab's own function | `src/crypto/spn.test.ts` |
| 16 pinned known-answer vectors, and the reference agreeing with all 16 | `src/crypto/spn.test.ts` |
| The round-key extension leaves rounds 0–4 untouched, for **all 65 536 master keys** | `src/crypto/spn.test.ts` |
| Only `K_R` is needed to sieve — checked against all 256 values of `K_{R-1}` | `src/crypto/spn.test.ts` |
| DDT and BCT recomputed by independent brute force, and the three BCT identities (first row and column `= 2ⁿ`, `BCT ≥ DDT` pointwise, entries even) | `src/crypto/tables.test.ts` |
| Reachability matches **exhaustive enumeration over all 65 536 keys**, in both directions — nothing achieved that was called impossible, and nothing called reachable that never occurs | `src/crypto/trails.test.ts` |
| The 3-round impossible differential rules out exactly the 30 single-active-nibble differences, with **zero occurrences in 8 388 608 pairs** | `src/crypto/trails.test.ts`, `experiments.test.ts` |
| There is no 4-round impossible differential, for any input difference, either S-box | `src/crypto/trails.test.ts` |
| Invariant I5: the sieve never eliminates the true subkey — 400 keys, fixed and random seeds | `src/crypto/experiments.test.ts` |
| The switch measured over all 256 middle states equals the BCT for **all 65 025 (β, γ) pairs** | `src/crypto/experiments.test.ts` |
| The boomerang beats a real random-permutation null with non-overlapping intervals, and `p²q²` overstates the measurement | `src/crypto/experiments.test.ts` |
| The random-permutation null is `1/(N−3)`, not `1/(N−1)` — derived by enumerating **all 24 and all 40 320 permutations** of a 4- and an 8-element block under the same exclusion rule | `src/crypto/experiments.test.ts` |
| Intervals resample keys, not quartets: the cluster bootstrap is wider than the pooled Wilson interval, and the distinguisher survives the correction at the shipped default | `src/crypto/experiments.test.ts` |
| `bestTrail` and `bestDifferential` each maximise what their name says, against an exhaustive sweep of all 65 025 endpoint pairs — and disagree from four rounds on | `src/crypto/trails.test.ts` |
| Latest-request-wins: out-of-order and twenty-deep responses authorise exactly one render, the newest, and a stale answer cannot clear the busy state | `src/ui/latest.test.ts` |

**The WCAG 2.1 A/AA gate** (`e2e/a11y.spec.ts`) drives the lab through every
state it teaches — all eight quartet steps, all four switch cases, every refusal
path, both S-boxes, every disclosure — and scans each at 1280px and 380px. It
asserts axe's `violations` **and** its `incomplete` bucket, computes contrast
arithmetically over composited surfaces, measures non-text contrast and generated
content against a ratcheted baseline (which is **empty**), and checks reflow,
scroller keyboard reach and focus visibility. Zero violations; the deploy is
blocked if that changes.

**The claims suite** (`e2e/claims.spec.ts`, 43 tests) checks the page tells the
truth: the DDT, the BCT, the switch rate and the miss-in-the-middle diagram's
forward set are all re-derived in the test from the S-box the page itself prints;
every failure path names its actual cause; a changed input retires its verdict
while re-entering the same value does not; and the negative claim's fixture is
reached through the UI, shown to be green in every check, and asserted to carry
its limitation on screen, outside every disclosure.

**The entry gate** (`e2e/entry.spec.ts`, 7 tests) enforces the things that make
the page enterable rather than merely correct: a real interaction inside the
first desktop viewport, the headline paradox complete within two phone screens,
both of its numbers on screen and matching the page's own S-box, the teaser's one
action landing on a stepped quartet, and a **ratcheted ceiling on arrival-state
copy** — 2 200 words, down from 3 181 before the reduction pass. The ceiling may
be lowered, never raised.

## Performance

Everything runs in a Web Worker, with a main-thread fallback so a Worker that
fails to load leaves a slow page rather than an empty one. Every panel shows its
elapsed time and which path produced it. On this machine: the arrival state
settles in well under a second; the full 65 536-key exhaustive run in Act 2 takes
about 3.5 seconds; Act 5's switch measurement is 256 operations and is instant.

Every run prints its sample size, and every measured rate carries a confidence
interval computed by resampling **keys** — the independent unit — rather than
quartets. Rapid changes cannot show one input's label beside another's evidence:
each panel issues a monotonic request ticket and drops any response that is no
longer the newest, including for the purpose of clearing its busy state.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## SAT Break

- **slug**: `crypto-lab-sat-break`
- **repo**: https://github.com/systemslibrarian/crypto-lab-sat-break
- **live**: https://systemslibrarian.github.io/crypto-lab-sat-break/
- **commit_sha**: `c17cf39b2e02fe896aa6f9c71eb2523fe25782d6` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `2c48102e06be98676ca17ecdf20c363813d70044`
- **read_from**: git archive HEAD (1 dirty path(s))
- **category**: ATTACKS  ·  **level**: advanced  ·  **--accent**: #6ed9e8
- **MISSING FIELDS**: verification

**Name (H1)**: SAT Break  — _read from src/main.ts_

**Subtitle**: Toy SPN · Boolean constraints · SAT key search  — _read from src/main.ts_

**Description**: Turn a small cipher into clauses, ask a real SAT solver for keys, and check what those keys actually explain.  — _read from src/main.ts_

**Why it matters**: A solver can find a key that fits every example you gave it. Whether that key is unique, works on unseen messages, or equals the original key takes separate evidence.  — _read from src/main.ts_

**Card copy**: Encode a toy cipher as Boolean clauses, recover consistent keys with a real SAT solver, and test how observations, withheld pairs, and equivalent keys limit the claim.

**Chips**: SAT · CNF · CaDiCaL · Toy SPN

**Implements**: Toy SPN `src/crypto/spn.ts:99`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: DES `src/crypto/spn.ts:18`

**References**: AES, SHA-256

**Standards body**: _none_

**Implementation**: WASM

**Spec citations, exactly as written**:

- `CHES 2007` — first seen src/crypto/sbox.ts:13 (2×)

**Stated limitations (page)**:

- _(limitation, src/main.ts)_ Every encryption check passes. The original key bits still have not been uniquely identified.

**README — What Can Go Wrong**:

```text
- A SAT model can fit the observed pairs and fail a withheld pair. That is insufficient evidence, not a solver defect.
- Passing sampled withheld checks is weaker than comparing all 256 plaintexts.
- A different one-round master key can implement the exact same function. Even a complete codebook match does not prove original bits.
- Reaching a cap, Stop, UNKNOWN, or timeout does not prove all keys have been found. Only a blocking query returning UNSAT or an explicitly identified exhaustive scan can establish completeness.
- A candidate that fails a direct observed-pair check signals an internal encoding, solver, or decoding problem; the page suppresses recovery claims in that state.
```

**Claims tested** (e2e/claims.spec.ts, 11 test(s)):

- `pinned CaDiCaL bridge loads, returns SAT/UNSAT, and accepts incremental clauses` — e2e/claims.spec.ts:3
    - :22 `toEqual` expected `{ empty: 10, freeBit: -1, sat: 10, model: 1, unsat: 20 }` _(expression)_
- `cipher map and clause inspector explain the actual gate constraints` — e2e/claims.spec.ts:25
    - :27 `toHaveCount` expected `5` _(literal)_
    - :28 `toContainText` expected `'Every pair shares the same 16-bit master key'` _(literal)_
    - :29 `toContainText` expected `'These input bits XOR to 0. You proposed output 0.'` _(literal)_
    - :30 `toContainText` expected `'Valid assignment. 4/4 actual clauses satisfied.'` _(literal)_
    - :32 `toContainText` expected `'These input bits XOR to 1. You proposed output 0.'` _(literal)_
    - :33 `toContainText` expected `'Invalid assignment.'` _(literal)_
    - :35 `toContainText` expected `'Valid assignment.'` _(literal)_
    - :40 `toContainText` expected `'The S-box maps input 0 to E. You proposed output E.'` _(literal)_
    - :41 `toContainText` expected `'Valid assignment.'` _(literal)_
    - :43 `toContainText` expected `'Invalid assignment.'` _(literal)_
    - :46 `toBeHidden` expected _no expected value_ _(none)_
    - :47 `toContainText` expected `'the observed ciphertext requires bit 0'` _(literal)_
    - :49 `toContainText` expected `'Invalid assignment.'` _(literal)_
    - :51 `toBeVisible` expected _no expected value_ _(none)_
    - :52 `toHaveValue` expected `'0'` _(literal)_
- `real WASM solver fits a public pair and the supplied wrong key fails withheld evidence` — e2e/claims.spec.ts:55
    - :57 `toBeVisible` expected _no expected value_ _(none)_
    - :58 `toHaveText` expected `'624'` _(literal)_
    - :60 `toContainText` expected `'At least 1 key found', { timeout: 45_000 }` _(expression)_
    - :63 `toContainText` expected `'is SAT', { timeout: 45_000 }` _(expression)_
    - :64 `toContainText` expected `'003F'` _(literal)_
    - :66 `toContainText` expected `'33'` _(literal)_
    - :67 `toContainText` expected `'26'` _(literal)_
    - :68 `toContainText` expected `'Fails'` _(literal)_
    - :69 `toContainText` expected `'Passes 8 withheld checks: no'` _(literal)_
    - :72 `toContainText` expected `'cannot fit these observed pairs (UNSAT)', { timeout: 45_000 }` _(expression)_
- `completed SAT sets match exhaustive keys for the fixture prefixes` — e2e/claims.spec.ts:75
    - :80 `toContainText` expected `/all \d+ consistent master keys? found|Solver error:/, { timeout: 60_000 }` _(expression)_
    - :81 `expect` expected _no expected value_ _(none)_
    - :83 `toContainText` expected `'Complete SAT set equals the exhaustive set: ${expected} identical key values.', { timeout: 60_000 }` _(expression)_
- `different one-round keys pass every encryption check without identifying original bits` — e2e/claims.spec.ts:87
    - :92 `toContainText` expected `'is SAT', { timeout: 45_000 }` _(expression)_
    - :93 `toContainText` expected `'original key bits still have not been uniquely identified'` _(literal)_
    - :94 `toContainText` expected `'Same complete encryption function (all 256 plaintexts): yes'` _(literal)_
    - :95 `toContainText` expected `'Different master-key bits from 1234'` _(literal)_
- `a capped or stopped enumeration never claims completeness` — e2e/claims.spec.ts:98
    - :101 `toContainText` expected `'enumeration incomplete', { timeout: 45_000 }` _(expression)_
    - :103 `toContainText` expected `'incomplete'` _(literal)_
    - :104 `toContainText` expected `'all keys'` _(literal)_
- `query changes retire results and DIMACS contains only public evidence` — e2e/claims.spec.ts:107
    - :114 `expect` expected _no expected value_ _(none)_
    - :115 `expect` expected _no expected value_ _(none)_
    - :117 `toHaveText` expected `'1', { timeout: 45_000 }` _(expression)_
    - :119 `toHaveText` expected `'0'` _(literal)_
    - :120 `toHaveText` expected `'1248'` _(literal)_
    - :123 `toHaveText` expected `'0'` _(literal)_
    - :125 `toHaveText` expected `'0'` _(literal)_
    - :126 `toHaveText` expected `'1872'` _(literal)_
- `one-to-six-round selected eight-pair SAT sets equal exhaustive sets` — e2e/claims.spec.ts:129
    - :136 `toContainText` expected `/consistent master keys? found/, { timeout: 60_000 }` _(expression)_
    - :138 `toHaveText` expected `'16'` _(literal)_
    - :140 `toEqual` expected `Array.from({ length: 16 }, (_, i) => '${i.toString(16).toUpperCase()}34'.padStart(4, '1')).sort()` _(expression)_
    - :143 `toContainText` expected `'Complete SAT set equals the exhaustive set:', { timeout: 60_000 }` _(expression)_
- `five-trial complete-set benchmark uses fresh SAT and exhaustive workers` — e2e/claims.spec.ts:147
    - :152 `toContainText` expected `'Five measured repetitions per method completed for complete-set task.', { timeout: 60_000 }` _(expression)_
    - :153 `toContainText` expected `'CaDiCaL WASM'` _(literal)_
    - :154 `toContainText` expected `'Exhaustive worker'` _(literal)_
    - :155 `toContainText` expected `'direct observed-pair verification of SAT candidates'` _(literal)_
    - :157 `toContainText` expected `'CNF encoding, once before trials'` _(literal)_
    - :158 `toContainText` expected `'SAT: model extraction'` _(literal)_
    - :159 `toContainText` expected `'Exhaustive: key scan loop'` _(literal)_
    - :161 `expect` expected _no expected value_ _(none)_
    - :162 `toContainText` expected `'Run this explicitly when ready.'` _(literal)_
- `Stop cancels an active benchmark and a fresh SAT run still works` — e2e/claims.spec.ts:165
    - :169 `toContainText` expected `/SAT (warmup|trial)/` _(regex)_
    - :171 `toContainText` expected `'Benchmark stopped; measurements incomplete.'` _(literal)_
    - :173 `toContainText` expected `'At least 1 key found', { timeout: 45_000 }` _(expression)_
- `stopping a benchmark preserves a proven complete SAT enumeration` — e2e/claims.spec.ts:176
    - :179 `toContainText` expected `'all 262 consistent master keys found', { timeout: 60_000 }` _(expression)_
    - :182 `toContainText` expected `/SAT (warmup|trial)/` _(regex)_
    - :184 `toContainText` expected `'Benchmark stopped; measurements incomplete.'` _(literal)_
    - :185 `toContainText` expected `'SAT enumeration remains complete: 262 consistent master keys.'` _(literal)_
    - :186 `toHaveText` expected `'262'` _(literal)_

**Mutation records** (3 file(s)):

- `docs/mutation-evidence.md` (958 bytes)
- `src/crypto/permutation.ts` (1663 bytes)
- `tools/mutation-check.mjs` (7978 bytes)

<details><summary>Full README</summary>

```markdown
# SAT Break

## What It Is

SAT Break is a browser lab for encoding an 8-bit, 16-bit-key teaching SPN as Boolean clauses and asking the real CaDiCaL CDCL solver for consistent master keys. The target reuses the Heys S-box and the fleet's four-round cipher from Biham Lens and Return Path, with Return Path's one-to-six-round extension. It is **not production cryptography**: the entire 65,536-key space can be scanned directly.

A satisfying assignment fits the observed plaintext/ciphertext pairs. It does not by itself establish that the key is unique, that it passes withheld checks, or that its bits equal the original key.

## Exhibits

1. **Meet the cipher.** Follow the short challenge and round-structure map, then choose a fixed four-round fixture, a one-round equivalent-key fixture, or a fresh random experiment. Inspect the public pairs and a separate visible-key round trace. Add up to eight distinct observations.
2. **Inspect the circuit.** Select an actual XOR, S-box, or final key-mixing gate. Change proposed bit values to see the gate's expected result and which clauses become false. Export the base public formula as DIMACS.
3. **Solve.** Find one key, find another, check a supplied key, or enumerate in batches of up to 512. The real WASM solver runs in a worker and the UI distinguishes SAT, UNSAT, incomplete, load failure, timeout, and cancellation.
4. **Verify.** Re-encrypt observed and withheld pairs directly, compare all 256 plaintexts for functional equivalence, reveal original key bits only when requested, and compare a completed SAT key set with an independent exhaustive scan.
5. **Measure.** Explicitly run five fresh measured repetitions after a warmup for either first match or complete candidate set, with identical public observations for SAT and exhaustive search. Inspect measured load, clause, solve, model, verification, and scan stages separately from the trial totals.

The four-round fixture uses original key `1234`: `00 → 0C` admits 262 keys, adding `3A → 33` leaves `1234` and `7615`, and adding `5C → C7` leaves `1234`. Supplied candidate `003F` fits the first pair but encrypts `3A` to `26`, which fails the withheld `33`. In the one-round fixture, `1034` and `1234` have different bits but identical outputs for all 256 plaintexts. The visible limitation remains: every encryption check can pass without identifying the original master-key bits.

## When to Use It

Use this lab to study bit-level constraint encoding, model verification, evidence growth, key enumeration, and the difference between function recovery and key identity. Do **not** use its timings or toy cipher to make a claim about attacking AES or about SAT generally outperforming exhaustive search.

## Live Demo

The deployed lab is [SAT Break](https://systemslibrarian.github.io/crypto-lab-sat-break/). The GitHub Actions gate builds, tests, and publishes it to GitHub Pages.

## What Can Go Wrong

- A SAT model can fit the observed pairs and fail a withheld pair. That is insufficient evidence, not a solver defect.
- Passing sampled withheld checks is weaker than comparing all 256 plaintexts.
- A different one-round master key can implement the exact same function. Even a complete codebook match does not prove original bits.
- Reaching a cap, Stop, UNKNOWN, or timeout does not prove all keys have been found. Only a blocking query returning UNSAT or an explicitly identified exhaustive scan can establish completeness.
- A candidate that fails a direct observed-pair check signals an internal encoding, solver, or decoding problem; the page suppresses recovery claims in that state.

## Real-World Usage

SAT encodings are used to analyze precisely specified constraints, including cryptographic problems. This lab shows the mechanics on a deliberately exhaustive teaching target. Its plain CNF build does not include native XOR constraints or Gaussian elimination, and it makes no performance prediction for larger ciphers. See the [CaDiCaL project](https://github.com/arminbiere/cadical) and [solver provenance](docs/solver-build.md).

## How to Run Locally

Use Node 22 or newer:

`​``sh
npm ci
npm run dev
`​``

The pinned WASM artifacts are checked in. To reproduce them with Emscripten, run `bash solver/build.sh`; see [solver provenance](docs/solver-build.md). For a production build, run `npm run build` then `npm run preview -- --port 4216 --strictPort` and visit `/crypto-lab-sat-break/` under the preview origin.

## Related Demos

- [Biham Lens](https://github.com/systemslibrarian/crypto-lab-biham-lens) attacks the four-round target with differential cryptanalysis.
- [Return Path](https://github.com/systemslibrarian/crypto-lab-return-path) supplies the one-to-six-round target semantics and studies impossible differentials and boomerangs.
- [Matsui Line](https://github.com/systemslibrarian/crypto-lab-matsui-line) studies linear cryptanalysis on a related toy SPN.
- [Feistel Forge](https://github.com/systemslibrarian/crypto-lab-feistel-forge) explores candidate keys and additional evidence on a different target.

## Build & Verify

`npm test` runs the cipher and CNF unit suite, including all 16 fixed four-round known-answer vectors, a separately written compatibility reference, gate truth tables, count formulas, and public-query isolation. `npm run test:claims` drives the real WASM adapter through the built page. `npm run test:a11y` runs axe and painted contrast checks at desktop and phone width through the actual teaching states. The deploy workflow blocks publication until all three suites and the build pass. The exact executed counts belong in the completion report, not a hard-coded promise here.

The source cipher files were copied with attribution from Return Path repository revision `544d941c94ee6dd394e34adf9bfc9eb7ab78748e`. Its `spn.ts` has Git blob `d3687258f9a5cf115425c16935bcbf697e0e3d54`. The catalog standard was read at revision `57e0d1dd3587762eb3f64444e81813aca1718fa4`. The overlap check found no SAT/CNF solver entry in the current local catalog and no such implementation in the plausible sibling sources inspected; this is a bounded check, not a claim that every lab was searched.

## Performance

Measurements are local to the selected browser, fixture, rounds, pair count, and task. The lab displays sample count and spread, including worker startup and direct SAT candidate verification in trial totals. CNF encoding is timed once when evidence changes and shown separately because it is excluded from trial totals. Stage medians are measured separately and need not add to the total median. Additional observations shrink the mathematical candidate set for a fixed experiment but do not guarantee faster solve time. No speedup ratio is shown when timing is below resolution.

MIT licensed. CaDiCaL retains its [upstream MIT notice](solver/LICENSE.cadical).

So whether you eat or drink or whatever you do, do it all for the glory of God. — 1 Corinthians 10:31

```

</details>

---

## RSA Small Roots

- **slug**: `crypto-lab-rsa-small-roots`
- **repo**: https://github.com/systemslibrarian/crypto-lab-rsa-small-roots
- **live**: https://systemslibrarian.github.io/crypto-lab-rsa-small-roots/
- **commit_sha**: `b7811d881b437b7c51a2bc98f1d5bc57cdb8fe3b` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ATTACKS  ·  **level**: advanced  ·  **--accent**: #c4a3ff
- **MISSING FIELDS**: why_it_matters, verification

**Name (H1)**: RSA Small Roots  — _read from index.html_

**Subtitle**: Coppersmith · Wiener · Exact arithmetic  — _read from index.html_

**Description**: Recover a structured message, a partly exposed factor, or a dangerously small private exponent, then inspect the exact public evidence.  — _read from index.html_

**Why it matters**: _MISSING_

**Card copy**: Recover textbook RSA secrets three ways: lattice small roots from a known message prefix, prime recovery from high bits, and Wiener's continued-fraction attack on a small private exponent, with exact public verification.

**Chips**: Textbook RSA · Coppersmith · Exact LLL · Wiener Attack

**Implements**: RSA `src/simulator/oracle.ts:23`, Wiener attack `src/wiener/attack.ts:50`

**Attacks shown**: Factoring `README.md:61`, Lattice reduction `src/attacks/public.ts:3`

**References**: GGH, ML-KEM, Miller–Rabin, RSA-OAEP, SHA-256, Schnorr, Shor's algorithm

**Standards body**: IETF

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `10.1007/978-3-642-02295-1_10` — first seen index.html:69 (1×)
- `doi.org/10.1007/BF01457454` — first seen index.html:69 (1×)
- `doi.org/10.1007/BFb0024458` — first seen index.html:69 (1×)
- `doi.org/10.1109/18.54902` — first seen index.html:69 (1×)
- `rfc8017` — first seen README.md:55 (2×)

**README — What Can Go Wrong**:

```text
- The message attacker needs N, e = 3, ciphertext, known prefix, and suffix width. It does not receive an arbitrary unknown message and recover it from ciphertext alone.
- The allowed message interval must fit entirely below N. The UTF-8 prefix is distinct from the arbitrary secret bitstring; fixed-width hex and binary are authoritative.
- The factor attacker needs an aligned hint of the larger prime. Balanced primes alone do not guarantee that both factors exceed √N. A candidate must directly divide N, satisfy the high-bit hint, and be the larger factor.
- A correct encryption/decryption round trip does not establish confidentiality. The default visible result is **DECRYPTS CORRECTLY — SUFFIX RECOVERED WITHOUT THE PRIVATE KEY**.
- No verified root found, cancellation, resource limit, invalid input, and integrity error are different states. None establishes security. A completed certified search missing a valid simulator target is an integrity defect.
- A failed certificate does not imply recovery is impossible. Asymptotic `N^(1/3)` and `N^(1/4)` are background scales, not finite guarantees for every preset.
- Wiener’s attack needs `d < N^(1/4)/3` for its guarantee. Failing above it is not safety: Boneh–Durfee (not run here) reaches `N^0.292`.
- Increasing e is not a general repair for textbook RSA’s missing secure encoding. This known-prefix/small-suffix model does not directly describe correctly implemented RSA-OAEP; see [PKCS #1 §7.1](https://www.rfc-editor.org/rfc/rfc8017.html#section-7.1).

The browser CSPRNG supplies fresh candidates and uniformly rejection-sampled witnesses. A small-prime sieve and 64 independent Miller–Rabin rounds establish probable primality, not a primality proof. Distinct primes have equal bit lengths; the requested modulus length is checked. Message keys have `gcd(3,φ(N)) = 1` and a checked simulator round trip. Keys and secrets remain in memory in the simulator worker. The Wiener attacker receives exactly `{ scenario, N, e }`; every allowlisted attack payload excludes factors, private exponents, secrets, simulator seeds, and oracle closures. This separation is a teaching boundary; it does not hide browser memory from the browser’s owner.

Limits: ≤1024-bit modulus, ≤12-dimensional lattice, 1–256 unknown bits at the lattice engine boundary (8–200 in its UI), Wiener d widths from 16 bits through half the selected modulus width, ≤11-degree reduced polynomial, 65,536-bit arithmetic guard, 100,000 counted work steps, and a trace of at most 600 events / 2 MiB of recorded ASCII operands. The default deadline is 15 seconds; the explicit extended preset is 60 seconds. A 1 ms diagnostic preset distinguishes an incomplete computation from a negative result. Key generation has a 30-second main-thread watchdog. Main-thread termination interrupts synchronous worker computations and stale run IDs cannot reinstate results.

Out of scope: Håstad implementation, Boneh–Durfee implementation, Blömer–May, arbitrary-exponent Coppersmith attacks, multivariate polynomials, known-LSB factoring, ROCA, BKZ, and an OAEP attack.
```

**Claims tested** (e2e/claims.spec.ts, 16 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:7
    - :7 `toBeEnabled` expected `{timeout:30000}` _(expression)_
- `message recovery is re-encrypted from displayed public inputs and defeats confidentiality despite the round trip` — e2e/claims.spec.ts:8
    - :10 `toBe` expected `512` _(literal)_
    - :11 `toHaveAttribute` expected `'data-value','true'` _(expression)_
    - :13 `toBe` expected `true` _(expression)_
    - :14 `toContainText` expected `'DECRYPTS CORRECTLY — SUFFIX RECOVERED WITHOUT THE PRIVATE KEY'` _(literal)_
    - :15 `toBeVisible` expected _no expected value_ _(none)_
    - :16 `toContainText` expected `'knows the prefix'` _(literal)_
    - :17 `toBe` expected `2+Number(k)/4` _(expression)_
- `factor recovery multiplies to displayed N and matches the promised high bits` — e2e/claims.spec.ts:19
    - :20 `toBeEnabled` expected _no expected value_ _(none)_
    - :22 `toBe` expected `N` _(expression)_
    - :23 `toBe` expected `await read(page,'recovered-x')` _(expression)_
- `finite sufficient prediction has the exact maximal integer and bit width` — e2e/claims.spec.ts:25
    - :28 `toBeEnabled` expected _no expected value_ _(none)_
    - :31 `toBe` expected `r*m+t` _(expression)_
    - :32 `toBe` expected `C` _(expression)_
    - :33 `toBe` expected `C*X**Q` _(expression)_
    - :34 `toHaveAttribute` expected `'data-value',String(C*X**Q<R)` _(expression)_
    - :35 `toBe` expected `true` _(expression)_
- `selected vector certificate is recomputed from actual displayed coefficients for both models` — e2e/claims.spec.ts:38
    - :41 `toBeEnabled` expected _no expected value_ _(none)_
    - :47 `toBe` expected `n` _(expression)_
    - :48 `toBe` expected `S` _(expression)_
    - :49 `toHaveAttribute` expected `'data-value',String(n*S<N**(factor?m:2n*m))` _(expression)_
    - :51 `toBe` expected `evaluation` _(expression)_
- `changing mathematical inputs retires a recovery immediately; selecting the same scenario is a no-op` — e2e/claims.spec.ts:55
    - :56 `toBeVisible` expected _no expected value_ _(none)_
    - :57 `toBeHidden` expected _no expected value_ _(none)_
    - :58 `toBeEnabled` expected _no expected value_ _(none)_
- `cancellation, reset, invalid input, and transcript export describe the actual state` — e2e/claims.spec.ts:60
    - :61 `toHaveAttribute` expected `'data-status','cancelled'` _(expression)_
    - :62 `toHaveAttribute` expected `'data-status','invalid-input'` _(expression)_
    - :63 `toBeEnabled` expected _no expected value_ _(none)_
    - :65 `toBe` expected `'verified-recovery'` _(literal)_
- `the actual attack worker payload is public-only, and delayed stale results cannot restore a verdict` — e2e/claims.spec.ts:67
    - :87 `toEqual` expected `['N','ciphertext','e','prefixValue','scenario','suffixBits']` _(expression)_
    - :88 `toBeHidden` expected _no expected value_ _(none)_
    - :91 `toBeHidden` expected _no expected value_ _(none)_
- `Wiener recovery, sufficient boundary, and RSA checks are recomputed from displayed integers` — e2e/claims.spec.ts:93
    - :96 `toBe` expected `expectedD` _(expression)_
    - :97 `toBe` expected `BigInt(2*N.toString(2).length)` _(expression)_
    - :98 `toBeVisible` expected `{timeout:30000}` _(expression)_
    - :99 `toHaveAttribute` expected `'data-value','true'` _(expression)_
    - :101 `toBe` expected `secret` _(expression)_
    - :103 `toBe` expected `ciphertext` _(expression)_
    - :104 `toHaveCount` expected `0` _(literal)_
- `Wiener reselect is a no-op and changing private-exponent width retires the result` — e2e/claims.spec.ts:106
    - :107 `toBeVisible` expected `{timeout:30000}` _(expression)_
    - :108 `toBeVisible` expected _no expected value_ _(none)_
    - :109 `toBeHidden` expected _no expected value_ _(none)_
- `Wiener attack worker receives only scenario, N, and e` — e2e/claims.spec.ts:111
    - :118 `toEqual` expected `['N','e','scenario']` _(expression)_
- `Wiener no-recovery evidence keeps the negative claim visible and never presents safety` — e2e/claims.spec.ts:120
    - :121 `toBeEnabled` expected `{timeout:30000}` _(expression)_
    - :122 `toHaveText` expected `'258 bits'` _(literal)_
    - :123 `toBeVisible` expected `{timeout:30000}` _(expression)_
    - :124 `toHaveAttribute` expected `'data-value','false'` _(expression)_
    - :125 `toHaveAttribute` expected `'data-outcome','not-recovered'` _(expression)_
    - :126 `toHaveText` expected `"Surviving Wiener's attack does not make a small private exponent safe."` _(literal)_
    - :128 `toBe` expected `N` _(expression)_
    - :129 `toHaveText` expected `'d^250 < N^73'` _(literal)_
    - :130 `toBe` expected `'rgb(38, 34, 23)'` _(literal)_
- `keyboard operation and 320px reflow keep all controls and inspectors reachable` — e2e/claims.spec.ts:132
    - :133 `expect` expected _no expected value_ _(none)_
    - :134 `toBeVisible` expected `{timeout:30000}` _(expression)_
    - :135 `toBe` expected `true` _(expression)_
- `resource limit remains an incomplete run and cannot be mistaken for a negative root verdict` — e2e/claims.spec.ts:137
    - :139 `toHaveAttribute` expected `'data-status','resource-limit'` _(expression)_
    - :140 `toContainText` expected `'not a completed root search'` _(literal)_
- `reduction stepper replays actual coefficient changes from the exported original basis` — e2e/claims.spec.ts:142
    - :147 `toBe` expected `true` _(expression)_
    - :157 `toBe` expected `before[column]` _(expression)_
    - :171 `toHaveAttribute` expected `'data-status','integrity-error'` _(expression)_
    - :172 `toHaveAttribute` expected `'data-value','false'` _(expression)_
    - :173 `toBeHidden` expected _no expected value_ _(none)_
    - :174 `toContainText` expected `worker==='attack'?'failed independent public verification':'simulator cross-check disagreed'` _(expression)_
    - :190 `toHaveAttribute` expected `'data-status','integrity-error'` _(expression)_
    - :191 `toBeHidden` expected _no expected value_ _(none)_
- `changing the budget during Wiener key generation leaves a usable challenge` — e2e/claims.spec.ts:193
    - :195 `toBeEnabled` expected `{timeout:30000}` _(expression)_

**Mutation records** (3 file(s)):

- `scripts/mutation-report.mjs` (3664 bytes)
- `scripts/mutations.mjs` (10138 bytes)
- `src/wiener/mutation-report.test.ts` (1010 bytes)

<details><summary>Full README</summary>

```markdown
# RSA Small Roots

Coppersmith · Howgrave-Graham · Exact LLL

## What It Is

An inspectable browser lab that recovers an unknown suffix of a known-prefix textbook RSA message with exponent 3, recovers the larger prime of an RSA modulus from its high bits, or applies Wiener’s continued-fraction attack to a dangerously short private exponent. A separate simulator generates each challenge; the attacker works from public information only. This is a teaching demo, not production crypto.

The mathematical engine uses BigInt integer arithmetic, fraction-free exact LLL, an independently recomputed rational Gram–Schmidt verifier, and complete bounded Sturm searches. It tracks an integer transformation U and checks `B_reduced = U B_original`, `det(U) = ±1`, reducedness, full rank, and determinant. Rounded displays never decide a verdict.

The Wiener scenario is deliberately separate from the lattice engine. Exact BigInt Euclid expands `e/N`; each convergent `k/d` must reconstruct an integral φ(N), a square discriminant, factors whose product is N, the inverse relation, and an RSA round trip. The sufficient guarantee is the exact inequality `81d⁴ < N`, not an observed cutoff.

For `r = degree(f)`, `n = rm+t`, and `X = 2^k`, basis rows are the coefficients of `g(Xz)`:

`​``text
N^(m-i) x^j f(x)^i  : i = 0,…,m-1; j = 0,…,r-1
x^j f(x)^m          : j = 0,…,t-1
D = N^[rm(m+1)/2] X^[n(n-1)/2]
`​``

Completed rows are never reduced modulo N. The sufficient prediction checks `C X^Q < N^E`, with `Q = n(n−1)`, `C = n^n 2^[n(n−1)/2]`, and `E = 2βmn−rm(m+1)`. It finds and checks the maximal integer X and the adjacent bit widths exactly. β is 1 for the message and 1/2 for the declared larger prime. Prediction, the actual norm certificate, and verified recovery are three separate claims.

For the original selected vector, `S = Σvℓ²`. The strict certificate is `nS < N^(2m)` for messages or `nS < N^m` for the factor hint. Divisibility and Cauchy–Schwarz then force `h(x₀) = 0` over the integers. The factor certificate is conditional on the public larger-prime promise until recovery. The first reduced vector is not necessarily shortest.

Integer-root extraction keeps the original h intact, makes a primitive square-free copy over the rationals, forms exact Sturm sequences, prunes bounded integer intervals using one-sided variations at half-integer endpoints, and evaluates every candidate exactly. It includes repeated roots, boundary roots, and noninteger real roots. It never scans all suffixes or reads the simulator’s secret to find a root.

## Exhibits

1. **The cube-root shortcut.** Exact cubing and exact integer cube roots show why a no-wrap ciphertext is vulnerable and why the default larger message needs another method. Håstad’s CRT broadcast attack is a separate lesson in RSA Forge.
2. **Recover a message suffix.** Choose a UTF-8 prefix and hidden bit width. The default uses a fresh 512-bit modulus, 64 hidden bits, and an 8-dimensional lattice with `(m,t) = (2,2)`. Even the known prefix wraps when cubed.
3. **Factor from high bits.** Reveal high bits of the larger of two distinct equal-bit-length probable primes. The default hides 80 bits and uses a 6-dimensional lattice with `(m,t) = (3,3)`.
4. **Follow the evidence.** Open public inputs, finite bounds, original and reduced matrices, U, actual row-operation traces, selected polynomials, integer-root records, or every continued-fraction convergent and its exact rejection reason. Export a JSON transcript containing exact decimal integers and public information.
5. **Widen the unknown.** Message widths create related messages and ciphertexts; factor widths keep the same target prime; Wiener widths generate fresh keys. Every input change retires old results immediately.
6. **Recover a small private exponent.** Generate 512-, 768-, or 1024-bit RSA keys with a chosen d width, watch exact convergents of e/N reconstruct the factors, and compare observed recovery with Wiener’s sufficient bound and the cited Boneh–Durfee range.

## When to Use It

Use it to understand the modular-to-integer step, inspect an exact LLL computation, experiment with RSA structure leakage, and distinguish a sufficient guarantee from an observed outcome. Use Lattice Gentle first if basis reduction is unfamiliar.

Do not use it to encrypt real data, assess an operational RSA key, prove security from a failed attack, or claim that arbitrary RSA ciphertexts can be decrypted.

## Live Demo

Deployment target: <https://systemslibrarian.github.io/crypto-lab-rsa-small-roots/>. The repository includes an Actions deployment gate; publication must be confirmed from served bytes. `npm run dev` provides the local demo. Everything runs locally in browser Web Workers.

## What Can Go Wrong

- The message attacker needs N, e = 3, ciphertext, known prefix, and suffix width. It does not receive an arbitrary unknown message and recover it from ciphertext alone.
- The allowed message interval must fit entirely below N. The UTF-8 prefix is distinct from the arbitrary secret bitstring; fixed-width hex and binary are authoritative.
- The factor attacker needs an aligned hint of the larger prime. Balanced primes alone do not guarantee that both factors exceed √N. A candidate must directly divide N, satisfy the high-bit hint, and be the larger factor.
- A correct encryption/decryption round trip does not establish confidentiality. The default visible result is **DECRYPTS CORRECTLY — SUFFIX RECOVERED WITHOUT THE PRIVATE KEY**.
- No verified root found, cancellation, resource limit, invalid input, and integrity error are different states. None establishes security. A completed certified search missing a valid simulator target is an integrity defect.
- A failed certificate does not imply recovery is impossible. Asymptotic `N^(1/3)` and `N^(1/4)` are background scales, not finite guarantees for every preset.
- Wiener’s attack needs `d < N^(1/4)/3` for its guarantee. Failing above it is not safety: Boneh–Durfee (not run here) reaches `N^0.292`.
- Increasing e is not a general repair for textbook RSA’s missing secure encoding. This known-prefix/small-suffix model does not directly describe correctly implemented RSA-OAEP; see [PKCS #1 §7.1](https://www.rfc-editor.org/rfc/rfc8017.html#section-7.1).

The browser CSPRNG supplies fresh candidates and uniformly rejection-sampled witnesses. A small-prime sieve and 64 independent Miller–Rabin rounds establish probable primality, not a primality proof. Distinct primes have equal bit lengths; the requested modulus length is checked. Message keys have `gcd(3,φ(N)) = 1` and a checked simulator round trip. Keys and secrets remain in memory in the simulator worker. The Wiener attacker receives exactly `{ scenario, N, e }`; every allowlisted attack payload excludes factors, private exponents, secrets, simulator seeds, and oracle closures. This separation is a teaching boundary; it does not hide browser memory from the browser’s owner.

Limits: ≤1024-bit modulus, ≤12-dimensional lattice, 1–256 unknown bits at the lattice engine boundary (8–200 in its UI), Wiener d widths from 16 bits through half the selected modulus width, ≤11-degree reduced polynomial, 65,536-bit arithmetic guard, 100,000 counted work steps, and a trace of at most 600 events / 2 MiB of recorded ASCII operands. The default deadline is 15 seconds; the explicit extended preset is 60 seconds. A 1 ms diagnostic preset distinguishes an incomplete computation from a negative result. Key generation has a 30-second main-thread watchdog. Main-thread termination interrupts synchronous worker computations and stale run IDs cannot reinstate results.

Out of scope: Håstad implementation, Boneh–Durfee implementation, Blömer–May, arbitrary-exponent Coppersmith attacks, multivariate polynomials, known-LSB factoring, ROCA, BKZ, and an OAEP attack.

## Real-World Usage

The exhibit explains why application structure and leaked factor bits can undermine raw RSA equations. It does not provide hardened cryptography or an OAEP implementation. Use reviewed encryption APIs and the protocol’s specified encoding in applications.

## How to Run Locally

`​``sh
npm ci
npm run dev
`​``

Open the printed URL under `/crypto-lab-rsa-small-roots/`. For the production build:

`​``sh
npm run build
npm run preview
`​``

## Related Demos

- [RSA Forge](https://systemslibrarian.github.io/crypto-lab-rsa-forge/): CRT broadcast and other RSA lessons.
- [Educational RSA](https://systemslibrarian.github.io/crypto-lab-rsa-educational/): key generation and textbook arithmetic.
- [Factor Forge](https://systemslibrarian.github.io/crypto-lab-factor-forge/): general factoring algorithms.
- [Lattice Gentle](https://systemslibrarian.github.io/crypto-lab-lattice-gentle/): an introduction to bases and LLL.
- [LLL Break](https://systemslibrarian.github.io/crypto-lab-lll-break/): other lattice attack experiments.

The source overlap check, inspected commit SHAs, integration handoff, and verification limits are recorded in [build notes](docs/build-notes.md).

## Build & Verify

`​``sh
npm test
npx playwright install chromium
npm run test:browser
npm run test:mutations
`​``

The local suites pass **63 unit/fixture tests** and **23 browser tests**, including zero accessibility violations in the driven desktop and 320px states. `npm test` builds first, then runs Vitest. `npm run test:browser` runs the complete accessibility and claims gate; `test:a11y` and `test:claims` run those portions independently. Browser tests exercise the production build on the dedicated strict port 4218. In addition to the lattice claims, they independently recompute Wiener’s strict integer boundary, p·q, the inverse relation, a random-message round trip, the public-only payload, result retirement, and the pinned negative claim. They exercise invalidation, cancellation, reset, export, keyboard access, 320px reflow, and injected integrity failures that must withdraw success and disable export. The WCAG gate uses axe plus painted text and per-side control contrast oracles adapted from Schnorr Forge under MIT, with no exemptions.

Published known-answer control: [SageMath’s root-4 example](https://doc.sagemath.org/html/en/reference/polynomial_rings/sage/rings/polynomial/polynomial_modn_dense_ntl.html), `N = 10001`, `f = x³ + 10x² + 5000x − 222`; this solver commits `X = 8, m = 2, t = 2`. It tests actual recovery through LLL and Sturm search.

Public offline inputs live in `src/fixtures/public.json`; ground truth is separate in `oracle.json`. The independent generator pins SageMath 10.8 with proved primes; its optional SymPy 1.14.0 backend reproduces identical inputs. The set has 18 transcripts: the existing 13 lattice records plus five generated 1024-bit Wiener cases on one key family (inside, boundary-width, just above, far above, and e = 65537 control). These five are generated observations, not published test vectors. `scripts/check-transcripts.py` checks reconstructed lattice evidence and independently recomputes every Wiener convergent; `scripts/cross-check.sage` uses Sage’s `continued_fraction(QQ(e)/N).convergents()` as a second implementation and also runs Sage’s native published small-roots control. SymPy and Sage are offline tools only.

`​``sh
sage -python scripts/generate-fixtures.py --backend sage
sage scripts/cross-check.sage
`​``

The Python transcript checker takes `.qa-artifacts/math/*.json` except `observations.json`. The verified Sage 10.8 container digest is `sha256:fb96c7fb10d672f3be0d088399db3aeac52650416d1bb71f74f26429ea35778f` from `sagemath/sagemath:10.8`; the reference runs use no network and a read-only project mount.

The concrete mutation script caught **30 of 30 compiling faults**, including nine Wiener-specific mutations, with passing baseline controls, nonempty source changes, changed bundle hashes, named failing tests, surgical restoration, matching restored hashes, and restored green tests. It records observations under `.qa-artifacts/mutations/`; unperformed runs and compile failures are not counted as kills.

## Performance

The desktop and 320px viewport runs used headless Chromium 156.0.8078.4 on macOS, 512-bit moduli, message `(k,m,t,n) = (64,2,2,8)` and factor `(80,3,3,6)`, with tracing enabled. In four fresh-key runs of each scenario, all recovered successfully: message reduction/search took 3.60–5.52 seconds, and factor reduction/search 0.28–0.44 seconds. These are local observations, not universal runtime guarantees or physical-phone measurements. Larger key sizes, dimensions, and CPU contention can reach the declared resource limit.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

### Wiener verification correction

The page independently reconstructs every convergent and candidate from the public key,
checks both directions of each exact-message RSA round trip, and checks revealed theorem
and bit-length labels before publishing a completed result or enabling export. The Wiener
sufficient bound assumes distinct, same-bit-length RSA primes. The attacker uses a fresh
WebCrypto random message for its public recovery check. Changing the budget during key
preparation starts a current challenge rather than stranding the generation request.

The independent Python checker requires a complete recorded ladder and matching row counts.
Source mutations are replayed in the deployment gate; only the named assertion can kill a
mutation, with passing baseline and restored controls. Browser coverage includes corrupted
Wiener ladders, theorem metadata, encryption samples, and missing reveal evidence.

```

</details>

---

## Next Number

- **slug**: `crypto-lab-next-number`
- **repo**: https://github.com/systemslibrarian/crypto-lab-next-number
- **live**: https://systemslibrarian.github.io/crypto-lab-next-number/
- **commit_sha**: `8da768340e7ccce14d3d830ab4b3c95bc89471dc` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `6a7bd5836b3958c8b6c7ad7cacff35f3941ccf91`
- **read_from**: working tree (clean)
- **category**: ATTACKS | RANDOMNESS  ·  **level**: advanced  ·  **--accent**: #50e1c5
- **MISSING FIELDS**: verification

**Name (H1)**: Next Number  — _read from index.html_

**Subtitle**: Next-bit unpredictability · LCG prediction · java.util.Random  — _read from index.html_

**Description**: Predict a generator’s future from observed outputs and test the same guess against ChaCha20.  — _read from index.html_

**Why it matters**: Simulation generators can look random while revealing future tokens. A cryptographic generator must resist prediction, not merely pass visual checks.  — _read from index.html_

**Card copy**: Predict a generator's next output: read a toy LCG off its own recurrence, recover Java's 48-bit state from two ints, then lift a 512-bit truncated LCG with lattice reduction.

**Chips**: LCG · java.util.Random · Lattice Reduction · ChaCha20

**Implements**: ChaCha20 `src/gen/chacha.ts:5`

**Attacks shown**: Lattice reduction `src/main.ts:16`

**References**: Blum–Blum–Shub

**Standards body**: IETF

**Implementation**: @noble

**Spec citations, exactly as written**:

- `NIST SP 800-22` — first seen src/main.ts:16 (1×)
- `RFC 8439` — first seen README.md:5 (7×)
- `rfc8439` — first seen README.md:62 (2×)

**README — What Can Go Wrong**:

```text
Java Random is not a cryptographic generator. Its output can look balanced while the published recurrence lets an adversary derive the next output. A measured half-win rate for this particular predictor against ChaCha20 is not a proof of security against all efficient predictors.
```

**Claims tested** (e2e/claims.spec.ts, 2 test(s)):

- `rendered Java state reproduces observed outputs and ten predictions` — e2e/claims.spec.ts:5
    - :8 `toContainText` expected `'state recovered',{timeout:30000}` _(expression)_
    - :10 `toBe` expected `second` _(expression)_
    - :12 `toBe` expected `first` _(expression)_
    - :14 `toEqual` expected `future` _(expression)_
    - :15 `toContainText` expected `'Retired'` _(literal)_
    - :17 `toContainText` expected `'Wilson 95%',{timeout:60000}` _(expression)_
    - :19 `expect` expected _no expected value_ _(none)_
    - :20 `toBeCloseTo` expected `Math.abs(Number(matched![1])/Number(matched![2])-.5),2` _(expression)_
    - :21 `expect` expected _no expected value_ _(none)_
- `512-bit lattice predictions reproduce the rendered independent continuation` — e2e/claims.spec.ts:23
    - :30 `toContainText` expected `'unique 512-bit state recovered'` _(literal)_
    - :33 `expect` expected _no expected value_ _(none)_
    - :35 `toBe` expected `r0` _(expression)_
    - :36 `toBe` expected `r1` _(expression)_
    - :38 `toEqual` expected `future` _(expression)_

**Mutation records** (2 file(s)):

- `scripts/mutations.json` (953 bytes)
- `scripts/mutations.mjs` (2596 bytes)

<details><summary>Full README</summary>

```markdown
# Next Number

## What It Is

Implements a four-digit toy LCG, Java SE 21 java.util.Random’s exact 48-bit recurrence, a 512-bit truncated LCG from Boneh–Shoup v0.6 §3.7.1, and an RFC 8439 ChaCha20 control. The 2-D lattice reduction and Java hidden-bit searches use exact BigInt arithmetic. Not production crypto — a teaching demo. All material is generated in memory; this static site has no account, backend or key storage.

## Exhibits

1. Guess the toy generator’s fourth output from its public recurrence.
2. Recover Java’s internal state from two consecutive nextInt values by checking all 2^16 hidden low bits; optionally search 2^22 low bits after a next(26) pair.
3. Recover a 512-bit LCG state from two truncated outputs with exact 2-D lattice reduction; measure 200 random multipliers.
4. Run the same next-bit predictor interface against toy, Java, lattice, and ChaCha20 and inspect the Wilson interval.
5. Observe simple frequency and run checks pass on a pinned Java seed even while the next outputs are predicted.

## When to Use It

Use this to study the exact mechanism and its failure boundary. Do not use the toy implementation, keys or protocols in a deployed security system.

## Live Demo

[Open Next Number](https://systemslibrarian.github.io/crypto-lab-next-number/) to drive the exhibits. The build uses Vite's `/crypto-lab-next-number/` base for GitHub Pages.

## What Can Go Wrong

Java Random is not a cryptographic generator. Its output can look balanced while the published recurrence lets an adversary derive the next output. A measured half-win rate for this particular predictor against ChaCha20 is not a proof of security against all efficient predictors.

## Real-World Usage

Java documents Random as unsuitable for cryptographic use and recommends SecureRandom. Browser V8’s Math.random uses xorshift128+, not Java’s LCG; neither should supply unpredictable security tokens.

## How to Run Locally

`​``sh
npm ci
npm run dev
`​``

## Related Demos

[Good Randomness](https://github.com/systemslibrarian/crypto-lab-good-randomness) · [Entropy Collapse](https://github.com/systemslibrarian/crypto-lab-entropy-collapse) · [DRBG Arena](https://github.com/systemslibrarian/crypto-lab-drbg-arena) · [ChaCha20 Stream](https://github.com/systemslibrarian/crypto-lab-chacha20-stream) · [Lattice Gentle](https://github.com/systemslibrarian/crypto-lab-lattice-gentle)

## Build & Verify

`​``sh
npm test
npm run build
npx playwright install chromium
npm run test:a11y
npm run test:mutations
`​``

9 unit tests with pinned OpenJDK 21 nextInt/nextDouble sequences, a Java state recovery, 40-bit lattice instances cross-checked against exhaustive enumeration, and RFC 8439 ChaCha20 block and two-block ciphertext output; browser claims rederive the displayed prediction. The replayable mutation harness contains 4 concrete source patches. Each run first passes its named baseline test, requires a non-empty diff, a successful build and changed JavaScript bundle hash, then requires the owning test to fail and restores the original hash. The Playwright suite scans reachable desktop and mobile states for WCAG 2.1 A/AA issues and independently rederives displayed claims. GitHub Actions runs unit tests, production build and browser gate before deploying; it also gates Dependabot pull requests, groups minor/patch npm updates and dispatches a deploy after an automated merge.

## Performance

All runs are local to the browser. Work figures shown in the page are either actual counted operations or explicitly labelled mathematical estimates/extrapolations. Workers keep long searches cancellable where used. No speed number is a claim about a production deployment.

## Sources

- [Boneh–Shoup v0.6 §§3.5–3.7.1](https://toc.cryptobook.us/)
- [Java SE 21 Random API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Random.html)
- [RFC 8439](https://www.rfc-editor.org/rfc/rfc8439)

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## DVD Scramble

- **slug**: `crypto-lab-dvd-scramble`
- **repo**: https://github.com/systemslibrarian/crypto-lab-dvd-scramble
- **live**: https://systemslibrarian.github.io/crypto-lab-dvd-scramble/
- **commit_sha**: `79f07904b99c9d83448613578ced5d87e88afc16` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `9ae0b2bc3655a102dede7859381d1153b74ea305`
- **read_from**: working tree (clean)
- **category**: ATTACKS | ENCRYPTION  ·  **level**: intermediate  ·  **--accent**: #ffce75
- **MISSING FIELDS**: spec_citations, verification

**Name (H1)**: DVD Scramble  — _read from index.html_

**Subtitle**: CSS stream cipher · two LFSRs and an adder  — _read from index.html_

**Description**: Step two real LFSRs, observe their carry, and recover the book’s 40-bit CSS variant from known keystream bytes.  — _read from index.html_

**Why it matters**: Adding two small registers did not make a strong 40-bit cipher. An invertible byte adder lets a guess of one register determine the other.  — _read from index.html_

**Card copy**: Break the two-LFSR Content Scrambling System: guess the smaller register, let algebra fix the rest, enumerate 65,536 seeds against known bytes, then verify the key on 32 unseen ones.

**Chips**: CSS · LFSR · Known-Plaintext · Key Recovery

**Implements**: N/A

**Attacks shown**: Brute force `src/main.ts:100`, Key recovery `README.md:51`

**References**: RC4

**Standards body**: _none_

**Implementation**: N/A (model or attack)

**README — What Can Go Wrong**:

```text
Three known bytes leave 65,536 candidates. With more known bytes, the generator’s invertible adder lets a six-byte transcript often identify the entire 40-bit seed. The recovered-key verdict is an alarm, not a victory for the cipher.
```

**Claims tested** (e2e/claims.spec.ts, 10 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:5
    - :5 `toBeEnabled` expected _no expected value_ _(none)_
- `rendered 40-bit recovery regenerates both the known and independent future bytes` — e2e/claims.spec.ts:7
    - :8 `toEqual` expected `stream(0xb25c,0x456a89,6)` _(expression)_
    - :9 `expect` expected _no expected value_ _(none)_
    - :10 `toEqual` expected `known` _(expression)_
    - :11 `toEqual` expected `all.slice(known.length)` _(expression)_
    - :12 `toBe` expected `65536` _(literal)_
    - :13 `toBe` expected `text` _(expression)_
    - :14 `toContainText` expected `'Retired'` _(literal)_
- `three public bytes stay undetermined even when private bytes would identify a key` — e2e/claims.spec.ts:16
    - :17 `expect` expected _no expected value_ _(none)_
- `displayed extrapolated days equal 2^40 divided by the displayed rate` — e2e/claims.spec.ts:19
    - :21 `expect` expected _no expected value_ _(none)_
- `carry propagates across an all-ones middle sum` — e2e/claims.spec.ts:23
    - :25 `toBe` expected `expected[i]` _(expression)_
- `impossible public bytes give zero survivors without a key claim` — e2e/claims.spec.ts:27
    - :28 `toBe` expected `0` _(literal)_
- `cancelled search keeps its partial counter and claims no key` — e2e/claims.spec.ts:30
    - :32 `expect` expected _no expected value_ _(none)_
- `survivor histogram counts actual public matches rather than a formula` — e2e/claims.spec.ts:34
    - :35 `toBeEnabled` expected `{timeout:30000}` _(expression)_
    - :37 `toEqual` expected `expected` _(expression)_
- `search worker receives exactly the public bytes and no private continuation` — e2e/claims.spec.ts:39
    - :41 `toEqual` expected `{bytes:known,msbFirst:false}` _(expression)_
- `manual unique candidate remains unverified without private bytes and short input refuses` — e2e/claims.spec.ts:43
    - :44 `expect` expected _no expected value_ _(none)_

**Mutation records** (3 file(s)):

- `scripts/mutation-report.mjs` (3664 bytes)
- `scripts/mutations.json` (4011 bytes)
- `scripts/mutations.mjs` (3434 bytes)

<details><summary>Full README</summary>

```markdown
# DVD Scramble

## What It Is

Implements the bit-serial, two-LFSR Content Scrambling System generator in Boneh–Shoup v0.6 §3.8. A 16-bit guess of one register algebraically determines the other 24-bit seed; the attack verifies known bytes and a separate 32-byte future. This is the book’s teaching variant, not a DVD player or the deployed CSS key hierarchy. Not production crypto — a teaching demo. All material is generated in memory; this static site has no account, backend or key storage.

## Exhibits

1. Clock the 17-bit and 25-bit registers and watch their bytes, carry and output.
2. Supply three to eight known bytes; a worker enumerates 65,536 smaller-register seeds and counts the actual survivors.
3. Independently verify the recovered key against 32 unseen output bytes.
4. Measure search throughput and extrapolate a 2^40 brute-force time, labelled as an extrapolation.

## When to Use It

Use this to study the exact mechanism and its failure boundary. Do not use the toy implementation, keys or protocols in a deployed security system.

## Live Demo

[Open DVD Scramble](https://systemslibrarian.github.io/crypto-lab-dvd-scramble/) to drive the exhibits. The build uses Vite's `/crypto-lab-dvd-scramble/` base for GitHub Pages.

## What Can Go Wrong

Three known bytes leave 65,536 candidates. With more known bytes, the generator’s invertible adder lets a six-byte transcript often identify the entire 40-bit seed. The recovered-key verdict is an alarm, not a victory for the cipher.

## Real-World Usage

CSS was a historical DVD scrambling system. This repository does not use, parse, or decrypt DVD content. The book’s variant differs from deployed CSS in forced-bit placement and discarded early bytes.

## How to Run Locally

`​``sh
npm ci
npm run dev
`​``

## Related Demos

[LFSR Forge](https://github.com/systemslibrarian/crypto-lab-lfsr-forge) · [Export Grade](https://github.com/systemslibrarian/crypto-lab-export-grade) · [WEP Crack](https://github.com/systemslibrarian/crypto-lab-wep-crack)

## Build & Verify

`​``sh
npm test
npm run build
npx playwright install chromium
npm run test:a11y
npm run test:mutations
`​``

13 executed unit cases; 1,000 independently generated keys × 256 bytes checked across two implementations, plus key recovery under both byte conventions. The book variant has no published KAT, so the test routes are independent re-derivations. The replayable mutation harness contains 13 concrete source patches. Each run first passes its named baseline test, requires a non-empty diff, a successful build and changed JavaScript bundle hash, then requires the owning test to fail and restores the original hash. The Playwright suite contains nine claims tests plus two accessibility state drives at 1280px and 320px. It scans reachable desktop and mobile states for WCAG 2.1 A/AA issues and independently rederives displayed claims. GitHub Actions runs unit tests, production build and browser gate before deploying; it also gates Dependabot pull requests, groups minor/patch npm updates and dispatches a deploy after an automated merge.

## Performance

All runs are local to the browser. Work figures shown in the page are either actual counted operations or explicitly labelled mathematical estimates/extrapolations. Workers keep long searches cancellable where used. No speed number is a claim about a production deployment.

## Sources

- [Boneh–Shoup v0.6 §3.8](https://toc.cryptobook.us/)

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Deviations from the brief

- **Full carry is intentional (DV-BE1).** [Boneh–Shoup v0.6 §3.8](https://crypto.stanford.edu/~dabo/cryptobook/BonehShoup_0_6.pdf) prints an update based on x+y alone, omitting incoming carry. At x+y=255 with incoming carry=1, it contradicts the same section's mod-2^24 identity. This lab uses `sum=x+y+carry; z=sum&255; carry=sum>>>8`, consistent with the full addition in [libdvdcss css.c](https://people.freebsd.org/~wpaul/7_2_RELEASE/mplayer/css.c). No GPL source code was copied. A deterministic counterexample (s1=0x434c, s2=0x9cbcf2), plus 10,000 fresh random keys, checks the identity; a concrete book-rule mutation must fail.
- **Exhaustive counts are honest.** The displayed search actually enumerates all 65,536 guesses to count ambiguity. It cannot stop at the hidden true key without an oracle. The brief's “fewer than 65,536” fixture and average 2^15 conflate exhaustive enumeration with externally verified early stopping. The 200-random-key test retains and verifies the true key, records actual work of 65,536 per search, and separately measures its retrospective position. One measured run gave a mean position of 33,921.54; this is not a count claimed by the attack. Six public bytes usually identify one key, but can leave multiple candidates.
- **Private bytes verify, never select.** The original UI filtered all public candidates against 32 hidden bytes and could falsely announce recovery from only three public bytes. Recovery now requires exactly one candidate *before* private verification. Ambiguous sets stay undetermined. Typed public bytes have no private continuation and never receive a recovered-secret verdict.
- **Mutation runner hardening.** The old text-search runner could accept timeouts as kills. The structured-report runner rejects infrastructure failures, retries and wrong-test failures; checks actual build and bundle changes; and reruns the restored baseline. The obsolete no-worker-message mutation was replaced by an observation-loss mutation that fails an owning assertion instead of hanging.

## Audit verification

`src/css/audit.test.ts` checks the 10,000-key identity, 200 independently generated six-byte samples, ambiguity, impossible bytes, cancellation and worker boundaries. The 200-key test logs its measured mean and ambiguity count on each run (`npx vitest run src/css/audit.test.ts --reporter=verbose`). `e2e/reference.ts` independently implements the bit recurrence and enumerates survivors; browser tests recompute displayed keys, future bytes, counters, rate arithmetic and histogram counts. The full accessibility machinery is adapted from the Schnorr reference; no known non-text failures are exempted.

Counts: `npx vitest list --json` lists declarations; `npm test` expands parameter rows to 13 cases. `npx playwright test --list` lists 11 browser tests. `scripts/mutations.json` contains 13 entries. No tests are skipped.

Mutation restoration hashes the JavaScript files listed by each fresh Vite build manifest. Unreferenced files left by browser artifact collection are excluded; baseline, mutant and restored builds still have to satisfy every assertion and hash check.

```

</details>

---

## Twist Trap

- **slug**: `crypto-lab-twist-trap`
- **repo**: https://github.com/systemslibrarian/crypto-lab-twist-trap
- **live**: https://systemslibrarian.github.io/crypto-lab-twist-trap/
- **commit_sha**: `fec51ca1577e03eefd3904e61d7fb89ba96a3b24` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `3e88f38feda813c000171681c960aa5f8e6993c6`
- **read_from**: working tree (clean)
- **category**: ATTACKS | KEY EXCHANGE  ·  **level**: advanced  ·  **--accent**: #b69bff
- **MISSING FIELDS**: verification

**Name (H1)**: Twist Trap  — _read from index.html_

**Subtitle**: Invalid-curve and twist attacks · RFC 7748  — _read from index.html_

**Description**: Send chosen points to an elliptic-curve key holder and observe which input checks prevent subgroup leakage.  — _read from index.html_

**Why it matters**: Static secret keys can leak through answers to points outside the intended group. Validation and cofactor handling serve distinct purposes.  — _read from index.html_

**Card copy**: Send points that are not on the curve: five twist queries and CRT recover a scalar once twist validation is off, and an order-four point leaks a bit until the scalar is clamped.

**Chips**: Montgomery Ladder · X25519 · Quadratic Twist · Invalid-Curve Attack · CRT

**Implements**: Baby-step giant-step `src/dlog/bsgs.ts:2`, X25519 `src/real/x25519.ts:7`

**Attacks shown**: Invalid curve attack `src/main.ts:18`

**Comment-only (named in code comments, not executed)**: EC point arithmetic `src/verify/verify.ts:4`, Montgomery ladder `src/curve/montgomery.ts:6`, Pairing `src/service/full.ts:14`

**References**: EC point arithmetic, Montgomery ladder, P-256, secp256k1

**Standards body**: IETF

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `RFC 7748` — first seen README.md:13 (8×)
- `rfc7748` — first seen README.md:61 (2×)

**README — What Can Go Wrong**:

```text
An on-curve check does not remove a small subgroup on the curve; an all-zero output check does not prevent larger-order twist leakage on this toy fixture. Skipping full point validation permits scalar multiplication on other b′ curves regardless of the intended curve’s twist security.
```

**Claims tested** (e2e/claims.spec.ts, 1 test(s)):

- `rendered twist residues and recovered scalar independently match the public x` — e2e/claims.spec.ts:16
    - :18 `toContainText` expected `'ALARM',{timeout:45000}` _(expression)_
    - :19 `toHaveLength` expected `5` _(literal)_
    - :22 `toBe` expected `answer` _(expression)_
    - :23 `expect` expected _no expected value_ _(none)_
    - :25 `toBe` expected `publicX` _(expression)_
    - :26 `toContainText` expected `'Retired'` _(literal)_
    - :27 `toContainText` expected `'ON THE CURVE — AND LEAKING'` _(literal)_

**Mutation records** (2 file(s)):

- `scripts/mutations.json` (829 bytes)
- `scripts/mutations.mjs` (2596 bytes)

<details><summary>Full README</summary>

```markdown
# Twist Trap

## What It Is

Implements a 61-bit toy Montgomery ladder and affine short-Weierstrass arithmetic. Two static chosen-point services demonstrate five-query quadratic-twist and invalid-curve secret recovery; both input-validation toggles default ON. A separate verifier checks a recovered scalar against Bob’s public key. Not production crypto — a teaching demo. All material is generated in memory; this static site has no account, backend or key storage.

## Exhibits

1. Test a chosen x coordinate for curve or twist membership and run the same x-only ladder.
2. Switch off twist validation, query five exact-order twist points, solve small logs and CRT sign choices, and independently match Bob’s public x.
3. Switch off full-coordinate validation, send five points from alternate b′ curves and recover the full scalar.
4. Send an on-curve order-four point that passes the curve check, then remove the leak by clamping to a multiple of four.
5. Compute twist orders from published real-curve p and n values, and run RFC 7748 X25519 vectors through the lab’s own ladder.

## When to Use It

Use this to study the exact mechanism and its failure boundary. Do not use the toy implementation, keys or protocols in a deployed security system.

## Live Demo

[Open Twist Trap](https://systemslibrarian.github.io/crypto-lab-twist-trap/) to drive the exhibits. The build uses Vite's `/crypto-lab-twist-trap/` base for GitHub Pages.

## What Can Go Wrong

An on-curve check does not remove a small subgroup on the curve; an all-zero output check does not prevent larger-order twist leakage on this toy fixture. Skipping full point validation permits scalar multiplication on other b′ curves regardless of the intended curve’s twist security.

## Real-World Usage

No real curve is attacked. The P-256, secp256k1 and Curve25519 table computes public group orders and divisibility; SafeCurves rho estimates are attributed estimates. Real attacks require a chosen-point service with a reused secret scalar.

## How to Run Locally

`​``sh
npm ci
npm run dev
`​``

## Related Demos

[Point Arithmetic](https://github.com/systemslibrarian/crypto-lab-point-arithmetic) · [Log Forge](https://github.com/systemslibrarian/crypto-lab-log-forge) · [Curve Lens](https://github.com/systemslibrarian/crypto-lab-curve-lens) · [Key Exchange](https://github.com/systemslibrarian/crypto-lab-key-exchange)

## Build & Verify

`​``sh
npm test
npm run build
npx playwright install chromium
npm run test:a11y
npm run test:mutations
`​``

8 unit tests prove toy group/factor facts, exact-order points, both end-to-end recovery paths, cofactor behavior, both RFC 7748 scalar vectors and the 1,000-iteration vector. The replayable mutation harness contains 4 concrete source patches. Each run first passes its named baseline test, requires a non-empty diff, a successful build and changed JavaScript bundle hash, then requires the owning test to fail and restores the original hash. The Playwright suite scans reachable desktop and mobile states for WCAG 2.1 A/AA issues and independently rederives displayed claims. GitHub Actions runs unit tests, production build and browser gate before deploying; it also gates Dependabot pull requests, groups minor/patch npm updates and dispatches a deploy after an automated merge.

## Performance

All runs are local to the browser. Work figures shown in the page are either actual counted operations or explicitly labelled mathematical estimates/extrapolations. Workers keep long searches cancellable where used. No speed number is a claim about a production deployment.

## Sources

- [Boneh–Shoup v0.6 §15.3.2](https://toc.cryptobook.us/)
- [RFC 7748](https://www.rfc-editor.org/rfc/rfc7748)
- [SEC 2 v2.0](https://www.secg.org/sec2-v2.pdf)
- [SafeCurves twist security](https://safecurves.cr.yp.to/twist.html)

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---
