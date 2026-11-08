# Crypto Lab audit corpus — SIGNATURES

Generated 2026-11-08T20:20:28.593Z from 25 lab record(s).

Every finding must cite **commit_sha + lab slug + field**. A field printed as
`MISSING` was not found by the generator; it is not a claim that the lab lacks it.

---
## Subliminal Channels

- **slug**: `crypto-lab-subliminal-channels`
- **repo**: https://github.com/systemslibrarian/crypto-lab-subliminal-channels
- **live**: https://systemslibrarian.github.io/crypto-lab-subliminal-channels/
- **commit_sha**: `e1992ebb9f4314ebcb569c1be84d7077edaf75ff` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `51b92531a2f9bb96629302bdc7ea90a6aec28d70`
- **read_from**: working tree (clean)
- **category**: SIGNATURES | STEGANOGRAPHY  ·  **level**: advanced  ·  **--accent**: #C8A6FB
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Subliminal Channels  — _read from index.html_

**Subtitle**: ECDSA P-256 · RFC 6979  — _read from index.html_

**Description**: Sign the same document in different valid ways and read the additional symbol carried in a signature.  — _read from index.html_

**Why it matters**: A normal ECDSA verifier checks mathematical validity, not whether a signer chose one valid signature from many to encode an extra bit. Deterministic signing closes this particular choice channel, not every covert channel.  — _read from index.html_

**Card copy**: Encode one extra bit by selecting a valid P-256 ECDSA signature. Independently verify it with WebCrypto, then compare deterministic signatures and message tampering.

**Chips**: ECDSA · P-256 · RFC 6979 · Subliminal Signaling

**Implements**: ECDSA `src/ecdsa/channel.ts:14`, P-256 `src/ecdsa/channel.ts:3`, SHA-256 `src/ecdsa/channel.ts:14`

**Attacks shown**: _none derived_

**References**: Schnorr

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 186-5` — first seen README.md:33 (2×)
- `RFC 6979` — first seen README.md:14 (10×)
- `rfc6979` — first seen src/main.ts:5 (1×)

**README — What Can Go Wrong**:

```text
This is an overtly documented, one-bit selection channel for teaching, **not encryption** and not a production covert-messaging design. Knowledge of the encoding rule reveals the symbol. Deterministic signing removes this particular random-signature choice, not all potential communication channels.
```

**Claims tested** (e2e/claims.spec.ts, 2 test(s)):

- `real P256 signature conveys a chosen bit with both independent signature checks` — e2e/claims.spec.ts:2
    - :4 `toContainText` expected `'BOTH VERIFIERS'` _(literal)_
    - :5 `toContainText` expected `'1 — read from r'` _(literal)_
    - :6 `toContainText` expected `'ADDITIONAL SIGNAL PRESENT'` _(literal)_
    - :7 `toHaveText` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :8 `toContainText` expected `'altered message rejected'` _(literal)_
    - :9 `toContainText` expected `'Not verified'` _(literal)_
    - :10 `toContainText` expected `'DETERMINISTIC OUTPUT'` _(literal)_
    - :11 `toHaveAttribute` expected `'data-tone','safe'` _(expression)_
    - :13 `toContainText` expected `'Previous verdict retired'` _(literal)_
    - :14 `toHaveText` expected `'Not verified'` _(literal)_
    - :15 `toHaveText` expected `'Not verified'` _(literal)_
    - :16 `toHaveText` expected `'—'` _(literal)_
    - :17 `toBeDisabled` expected _no expected value_ _(none)_
- `superseded signing cannot restore evidence after document or key changes` — e2e/claims.spec.ts:20
    - :28 `toBeEnabled` expected `{timeout:30_000}` _(expression)_
    - :29 `toContainText` expected `'Previous verdict retired'` _(literal)_
    - :30 `toHaveText` expected `'Not verified'` _(literal)_
    - :31 `toHaveText` expected `'Not verified'` _(literal)_
    - :32 `toHaveText` expected `'—'` _(literal)_
    - :38 `toBeEnabled` expected `{timeout:30_000}` _(expression)_
    - :39 `toContainText` expected `'Fresh synthetic signing key'` _(literal)_
    - :40 `toHaveText` expected `'Not verified'` _(literal)_
    - :41 `toHaveText` expected `'Not verified'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Subliminal Channels

**Status:** working interactive teaching implementation with automated checks. Passing CI or successful publication is not a formal security audit. GitHub Pages publication includes an explicit source-SHA check against served bytes.

## What It Is

A browser-only ECDSA P-256/SHA-256 signature experiment. A signer can select among independently valid signatures for the same synthetic document and encode one additional agreed-upon bit in the low bit of the real ECDSA `r` value. Signatures are verified using both Noble Curves and native WebCrypto; keys and messages stay local.

## Exhibits

1. **Encode a symbol:** choose 0 or 1; use fresh extra entropy to create real P-256 signatures until one encodes the selected bit, with a bounded attempt budget.
2. **Ordinary verification:** independently check the selected signature through a separate browser API and display actual IEEE P1363 `r` and `s` fields.
3. **Discover the extra signal:** read the agreed bit back from signature bytes even though standard verification does not inspect it.
4. **Deterministic comparison:** sign the identical message twice under RFC 6979 and compare byte-identical outputs, removing this particular choice channel.
5. **Tamper:** alter the message and require ordinary verification to fail, without claiming that a mathematically valid signature is free of covert signals.

## When to Use It

A digital signature authenticates a message, but its validity check alone cannot establish whether the signer deliberately chose one of several valid encodings to convey extra information.

**Do not use:** This code with real keys, credentials, signatures, records or adversaries. The experiment isolates one mechanism; it is not a deployable cryptographic service.

## Live Demo

[Open Subliminal Channels](https://systemslibrarian.github.io/crypto-lab-subliminal-channels/). Publication is performed through GitHub Actions. The deploy job checks that the page serves the exact source commit before reporting a successful deployment. If this check fails, the public site must be treated as **unverified** even if an earlier artifact was published.

## What Can Go Wrong

This is an overtly documented, one-bit selection channel for teaching, **not encryption** and not a production covert-messaging design. Knowledge of the encoding rule reveals the symbol. Deterministic signing removes this particular random-signature choice, not all potential communication channels.

## Real-World Usage

RFC 6979 (deterministic ECDSA); FIPS 186-5 (digital signatures). Related: [ECDSA Forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/), [Schnorr Forge](https://systemslibrarian.github.io/crypto-lab-schnorr-forge/).

## How to Run Locally

Install with `npm ci`, run `npm test`, `npm run build`, and `npm run test:a11y` before using `npm run dev`. Browser tests serve a freshly rebuilt production artifact. Do not skip the accessibility or correctness gate.

## Related Demos

RFC 6979 (deterministic ECDSA); FIPS 186-5 (digital signatures). Related: [ECDSA Forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/), [Schnorr Forge](https://systemslibrarian.github.io/crypto-lab-schnorr-forge/).

## Build & Verify

The suite includes the RFC 6979 P-256/SHA-256 `sample` known-answer vector (including the normalized low-s value), deterministic repeatability, independent WebCrypto verification, chosen-bit encoding, invalid bit rejection, strict 64-byte signature encoding and altered-message rejection. Changing the message, selected bit or synthetic key retires completed evidence, and a superseded signing operation cannot restore it. Playwright verifies the actual browser output and mobile accessibility.

CI runs Vitest and Playwright, checks the production build, and refuses deployment on failures. After the Pages publish step, a fresh HTTP GET must return `deployment.json` identifying the exact `GITHUB_SHA` and GitHub repository, and a second GET must return HTML containing the app mount. The hosted source SHA is **deployed build identity evidence**, not a cryptographic security proof. Full negative-claim and mutation-test compliance remains subject to independent review.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## SM2 Forge

- **slug**: `crypto-lab-sm2-forge`
- **repo**: https://github.com/systemslibrarian/crypto-lab-sm2-forge
- **live**: https://systemslibrarian.github.io/crypto-lab-sm2-forge/
- **commit_sha**: `9f6b39c4998082b407bd2729f64920798140f630` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | ATTACKS  ·  **level**: intermediate  ·  **--accent**: #35d6bb
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: SM2 Forge  — _read from src/ui/app.ts_

**Subtitle**: GB/T 32918 · GM/T 0003 · RFC 8998  — _read from src/ui/app.ts_

**Description**: Run real SM2 signatures and encryption, inspect the identity prefix, and decode both ciphertext byte orders.  — _read from src/ui/app.ts_

**Why it matters**: Adopting a national crypto suite is not a curve swap. SM2 signatures bind an identity, and two valid ciphertext serializations can still break interoperability.  — _read from src/ui/app.ts_

**Card copy**: Sign and encrypt under GB/T 32918 SM2, read the identity digest that precedes every signature, compare both deployed ciphertext orders, then recover a key from a reused nonce.

**Chips**: SM2 · SM3 · Nonce Reuse · RFC 8998

**Implements**: SM2 `src/sm2/sm2.ts:113`, SM3 `src/sm2/sm2.ts:1`

**Attacks shown**: Key recovery `README.md:5`, Nonce reuse `src/attack/nonce-reuse.ts:4`, Side-channel (unspecified) `README.md:51`

**References**: EC point arithmetic, ECDSA, P-256, P-384, Schnorr, TLS 1.3

**Standards body**: ISO

**Implementation**: @noble

**Spec citations, exactly as written**:

- `RFC 8998` — first seen README.md:3 (7×)

**README — What Can Go Wrong**:

```text
- **Identity mismatch** — a signer and verifier that use different IDs compute different Z_A values and verification fails.
- **Serialization mismatch** — `C1C3C2` bytes fed to a `C1C2C3` decoder fail the SM3 integrity check even though both layouts are valid conventions.
- **Nonce reuse** — two signatures over different messages under one `k` expose `d`; the recovered scalar re-derives the victim public key exactly.
- **Malformed C1** — decryption rejects a point that is not on curveSM2 before deriving a shared point.
- **Invalid private key** — SM2 excludes `d = n - 1` because `(1 + d)` would not be invertible modulo `n`.
```

**Claims tested** (e2e/claims.spec.ts, 10 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:6
    - :6 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:7
    - :7 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:14
    - :14 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
- `the displayed ENTL equals the displayed UTF-8 identity bit length` — e2e/claims.spec.ts:18
    - :27 `toBe` expected `independentlyCountedBits` _(expression)_
    - :28 `toHaveText` expected _no expected value_ _(none)_
- `one signature accepts only when the verifier rebuilds the same Z_A` — e2e/claims.spec.ts:33
    - :39 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :41 `toHaveAttribute` expected `'data-state', 'fail'` _(expression)_
    - :42 `toContainText` expected `'different Z_A'` _(literal)_
    - :43 `toContainText` expected `'different Z_A'` _(literal)_
    - :46 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :47 `toBeVisible` expected _no expected value_ _(none)_
    - :51 `toBeHidden` expected _no expected value_ _(none)_
    - :52 `toContainText` expected `'retired'` _(literal)_
    - :55 `toBe` expected `signerDigest` _(expression)_
    - :56 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
- `re-selecting the same values does not retire a fresh signature` — e2e/claims.spec.ts:59
    - :65 `toBeVisible` expected _no expected value_ _(none)_
    - :66 `toBeHidden` expected _no expected value_ _(none)_
    - :67 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
- `both ciphertext layouts succeed, but a cross-order decoder names the mismatch` — e2e/claims.spec.ts:70
    - :74 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :75 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :78 `toHaveAttribute` expected `'data-state', 'fail'` _(expression)_
    - :79 `toContainText` expected `'ORDER MISMATCH'` _(literal)_
    - :82 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :83 `toBeVisible` expected _no expected value_ _(none)_
    - :84 `toContainText` expected _no expected value_ _(none)_
- `nonce-reuse fixture has two accepted signatures and an exposed key` — e2e/claims.spec.ts:89
    - :93 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :94 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :95 `toHaveAttribute` expected `'data-state', 'alarm'` _(expression)_
    - :96 `toContainText` expected `'re-derives the victim public key byte-for-byte'` _(literal)_
    - :97 `toBeVisible` expected _no expected value_ _(none)_
    - :98 `toContainText` expected _no expected value_ _(none)_
- `identical messages do not pretend to provide two recovery equations` — e2e/claims.spec.ts:103
    - :109 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :110 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :111 `toHaveAttribute` expected `'data-state', 'fail'` _(expression)_
    - :112 `toContainText` expected `'Identical signatures'` _(literal)_
- `hidden panes remain hidden and the page has one banner landmark` — e2e/claims.spec.ts:115
    - :117 `toHaveCount` expected `1` _(literal)_
    - :118 `toBeHidden` expected _no expected value_ _(none)_
    - :119 `toBeHidden` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# SM2 Forge

**GB/T 32918 · GM/T 0003 · RFC 8998**

A browser-only lab for SM2 signatures and public-key encryption. It builds the required curve, exposes the identity digest that precedes every signature, compares both deployed ciphertext byte orders, and demonstrates private-key recovery when a signer reuses one nonce.

> **Not production cryptography — a teaching demo.** Secret values are deliberately inspectable, JavaScript does not promise constant-time execution, and nothing is persisted or sent to a backend.

## What It Is

SM2 is a family of elliptic-curve algorithms standardized in China. This lab hand-rolls the inspectable signing, verification, encryption, decryption, Z_A digest, and nonce-recovery equations over the fixed curveSM2 parameters using `@noble/curves`; SM3 comes from `@li0ard/sm3`.

The signature's distinguishing step is:

`​``text
Z_A = SM3(ENTL_A || ID_A || a || b || Gx || Gy || xA || yA)
e   = SM3(Z_A || message)
`​``

The security target is correct SM2 signatures and authenticated SM2 ciphertexts under strict point validation. It does not implement SM2 key exchange, SM4, SM3 internals, or a TLS handshake, and conformance tests do not make this code suitable for protecting real keys.

## Exhibits

1. **The Curve** — Load RFC 8998's curveSM2 parameters and run the GM/T 0003.5 / GB/T 32918.5 Annex A signature and Annex C encryption fixtures byte-for-byte before later panes unlock.
2. **The Signature** — Edit the signer ID, watch ENTL and all eight Z_A inputs assemble, sign a message, then verify with either the same ID or the RFC default `1234567812345678`.
3. **The Ciphertext + The Break** — Regroup one ciphertext as standard `C1C3C2` or earlier-draft `C1C2C3`, execute matching and mismatched decoders, then enter the isolated broken path where two valid signatures reuse one nonce and reveal the private key.

## When to Use It

- Use the lab to understand SM2 migrations, identity configuration, byte-order interoperability, and signing-nonce failures.
- Use an audited SM2 implementation that fixes the ID and serialization contract explicitly in production.
- Do **not** use this teaching implementation for production keys, certificates, TLS, or regulated deployments.
- Do **not** treat a valid signature as evidence that its nonce generator was safe.

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-sm2-forge/**

Run the published vectors, change the signing identity, cross the two ciphertext layouts, and recover the demonstration key entirely in the browser.

## What Can Go Wrong

- **Identity mismatch** — a signer and verifier that use different IDs compute different Z_A values and verification fails.
- **Serialization mismatch** — `C1C3C2` bytes fed to a `C1C2C3` decoder fail the SM3 integrity check even though both layouts are valid conventions.
- **Nonce reuse** — two signatures over different messages under one `k` expose `d`; the recovered scalar re-derives the victim public key exactly.
- **Malformed C1** — decryption rejects a point that is not on curveSM2 before deriving a shared point.
- **Invalid private key** — SM2 excludes `d = n - 1` because `(1 + d)` would not be invertible modulo `n`.

### OpenSSL deployment advisory — 29 September 2026

The [OpenSSL advisory](https://openssl-library.org/news/secadv/20260929.txt) discloses three implementation side channels relevant to SM2:

- **CVE-2026-54872:** generic EC scalar multiplication leaks nonce information through signing time on platforms using the generic SM2 path. The leak is small and requires many measurements; OpenSSL's dedicated NIST P-256, P-384 and P-521 paths are unaffected by this CVE.
- **CVE-2026-54875:** optimized SM2 scalar multiplication on ARM64/AArch64 and RISC-V leaks through timing/cache access, involving the signing nonce or the decryption private scalar. It affects OpenSSL 4.0, 3.6, 3.5 and 3.4 on those platforms; 3.0, 1.1.1 and 1.0.2 are unaffected by this particular CVE.
- **CVE-2026-77696:** variable-time arithmetic in SM2 signing leaks secret information across platforms. It affects OpenSSL 4.0, 3.6, 3.5, 3.4, 3.0 and 1.1.1; 1.0.2 is unaffected by this particular CVE.

These are attack-model-conditional implementation vulnerabilities, not a break of curveSM2. Observable signing times may, over many signatures, enable lattice/HNP private-key recovery; the advisory does not establish universal practical exploitation. Affected deployments should follow its branch-specific upgrades: 4.0.3, 3.6.5, 3.5.9 or 3.4.8; older supported branches have separate premium-support fixes listed there. OpenSSL 3.1, 3.2 and 3.3 are out of support and were not analysed.

This browser lab uses `@noble/curves` and JavaScript arithmetic, not OpenSSL. Its nonce-reuse demonstration does not measure timing/cache leakage or reproduce these CVEs; passing functional vectors does not establish constant-time execution.

## Real-World Usage

RFC 8998 defines the informational ShangMi TLS 1.3 profile: `TLS_SM4_GCM_SM3` (`0x00C6`), `TLS_SM4_CCM_SM3` (`0x00C7`), `sm2sig_sm3` (`0x0708`), and `curveSM2` (group `41`). Its certificate-signature default ID is the ASCII string `1234567812345678`; other SM2 contexts can use different IDs and must agree on them.

## How to Run Locally

`​``bash
npm install
npm run dev
npm test
npm run build
npm run test:e2e
npm run test:a11y
`​``

The Vite development URL is `http://localhost:5173/crypto-lab-sm2-forge/` when that port is free. Playwright builds and serves the production bundle on fleet-unique port `4607`.

## Related Demos

- [ECDSA Forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) — compare another nonce-sensitive elliptic-curve signature.
- [Schnorr Forge](https://systemslibrarian.github.io/crypto-lab-schnorr-forge/) — compare linear signing and its nonce-reuse recovery.
- [TLS Handshake](https://systemslibrarian.github.io/crypto-lab-tls-handshake/) — place RFC 8998's identifiers in TLS context.
- [World Hashes](https://systemslibrarian.github.io/crypto-lab-world-hashes/) — inspect hash functions; this lab uses SM3 without dissecting it.

## Build & Verify

- **12 unit tests** under `src/**/*.test.ts` cover curve construction, ENTL/Z_A, signing, verification, both ciphertext orders, malformed C1 rejection, and nonce-reuse recovery.
- **2 published KAT fixtures** in [`src/sm2/fixtures.ts`](src/sm2/fixtures.ts) reproduce OpenSSL's executable pins of GM/T 0003.5 / GB/T 32918.5 Annex A and Annex C.
- Every signature and encryption path is cross-checked with `@li0ard/sm2`; `sm-crypto` independently verifies the default ID and both cipher-mode serializations.
- **7 rendered claims tests** in [`e2e/claims.spec.ts`](e2e/claims.spec.ts) check the page's verdicts, retirement behavior, ENTL computation, order mismatch, and both negative-claim fixtures.
- **2 full accessibility drives** in [`e2e/a11y.spec.ts`](e2e/a11y.spec.ts) scan desktop and 380px states with axe, arithmetic text contrast, non-text contrast, keyboard reachability, focus visibility, and reflow checks.

## Performance

All arithmetic runs client-side with no network calls after the static assets load. The current production bundle is approximately 19 kB gzip JavaScript and 4 kB gzip CSS.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*
```

</details>

---

## FROST Threshold

- **slug**: `crypto-lab-frost-threshold`
- **repo**: https://github.com/systemslibrarian/crypto-lab-frost-threshold
- **live**: https://systemslibrarian.github.io/crypto-lab-frost-threshold/
- **commit_sha**: `5f48b8fde266ba47f2337f3147dee3ae842d8213` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `54aed592301e6de78c71cb11ce6a380eff9bc9ab`
- **read_from**: working tree (clean)
- **category**: SIGNATURES | PROTOCOLS | MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: #06b6d4
- **MISSING FIELDS**: verification

**Name (H1)**: FROST  — _read from src/main.ts_

**Subtitle**: t-of-n Threshold Schnorr &middot; Ed25519 &middot; RFC 9591  — _read from src/main.ts_

**Description**: Run FROST live in your browser: generate one shared group key, pick any threshold subset, and watch its members jointly produce a single ordinary Ed25519 Schnorr signature over two rounds.  — _read from src/main.ts_

**Why it matters**: No single person ever holds the whole key, so one compromised or coerced signer cannot forge a signature or lose the funds. The output is an ordinary signature verifiers already accept — no special multisig support needed.  — _read from src/main.ts_

**Card copy**: A browser-based FROST (RFC 9591) walkthrough where any qualified signer subset can produce one standard Ed25519 signature without key reassembly.

**Chips**: FROST (RFC 9591) · Ed25519 · Nonce Commitments · VSS Commitments

**Implements**: BLS signatures `src/ats/bls-ats.ts:224`, BLS12-381 `src/ats/bls-ats.ts:20`, Ed25519 `src/exhibits/attacks.ts:31`, FROST `crate/src/round2.rs:54`, Hash-to-curve `src/ats/bls-ats.ts:163`, Pairing `src/ats/bls-ats.ts:205`, SHA-512 `src/exhibits/attacks.ts:75`, Shamir secret sharing `src/exhibits/attacks.ts:105`, Sum-check `src/exhibits/aggregate-flow.ts:157`

**Attacks shown**: Key recovery `src/exhibits/round1.ts:60`, Nonce reuse `src/exhibits/attacks-view.ts:2`, Side-channel (unspecified) `THREAT_MODEL.md:47`

**Comment-only (named in code comments, not executed)**: Schnorr `src/ui/state.ts:204`

**References**: ECDSA, Feldman VSS, ML-DSA, Pedersen commitment, SHA-256, Schnorr, X25519, secp256k1

**Standards body**: IETF, NIST

**Implementation**: Rust FROST crate / WASM

**Spec citations, exactly as written**:

- `CRYPTO 2025` — first seen src/exhibits/adaptive-research.ts:7 (1×)
- `draft-irtf-cfrg-bls-signature-07` — first seen README.md:41 (3×)
- `eprint.iacr.org/2025/1061` — first seen README.md:101 (2×)
- `eprint.iacr.org/2026/2126` — first seen README.md:101 (2×)
- `eprint.iacr.org/2026/2203` — first seen README.md:101 (2×)
- `eprint.iacr.org/2026/2554` — first seen README.md:101 (2×)
- `RFC 8032` — first seen src/exhibits/attacks.ts:3 (2×)
- `RFC 9380` — first seen README.md:41 (2×)
- `RFC 9591` — first seen README.md:4 (14×)
- `rfc9380` — first seen README.md:41 (1×)

**README — What Can Go Wrong**:

```text
The "Nonce attack and binding consistency" section contains a live nonce-reuse attack and a separate binding-equation experiment on a small 2-of-3 group. Both use actual `@noble/curves` Ed25519 verification; that verifies the signature equation rather than every internal protocol or security property.

- **Nonce reuse across signing attempts.** Reusing a per-signature nonce, or producing two signatures from the same Round 1 commitment, can leak signing-share secrets — the same class of failure that breaks single-party Schnorr/Ed25519. *Live:* reuse the Round-1 nonces across three sessions and the exhibit solves a 3×3 linear system per signer, recovers the exact group secret, forges an arbitrary message, and the real Ed25519 verifier accepts it. With fresh nonces (the control) the forgery is rejected.
- **Binding-term consistency.** The separate TypeScript experiment signs with the RFC 9591 binding transcript, retains the exact honest response sum `z`, and replaces only the group commitment `R` with an unweighted commitment sum. The original signature verifies and the mismatched equation fails. A separate, consistently defined `ρ = 1` honest-signing control still verifies. This is **not a concurrent Drijvers/ROS forgery demonstration**, and honest acceptance does not establish that unbound protocol's security. Published Appendix E.1 tests check the binding inputs, factors, response shares and final signature; Ed25519 acceptance alone does not prove transcript conformance. The main Rust/WASM signing path remains separate.
- **Trusted-dealer key generation is a single point of trust.** This demo uses a trusted dealer; a real deployment usually wants a distributed key generation so no one party ever sees the full key.
- **A signer bitmap identifies keys, not necessarily their human holders.** The accountable BLS fixture verifies and traces `{2, 4, 5}`, yet the trusted dealer can produce those shares itself because it generated and retained every α_i. The panel therefore reports `VERIFIED AND TRACED — AND FRAMED BY THE DEALER` rather than treating tracing as proof of human participation.
- **Same-message BLS aggregation needs a rogue-key defence.** The accountable construction uses the proof-of-possession ciphersuite from [`draft-irtf-cfrg-bls-signature-07` §§3.3 and 4.2.3](https://datatracker.ietf.org/doc/draft-irtf-cfrg-bls-signature/07/) and rejects any key whose `PopVerify` fails. Its deliberately broken no-PoP control shows a cancellation key making the raw aggregate pairing pass while naming honest keys. The BLS signature scheme source is an IRTF Internet-Draft, not an RFC; [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380) specifies only hash-to-curve.
- **Wrong threshold or insufficient shares.** Supplying fewer than t shares cannot produce a valid signature; mismatched participant sets or indices yield aggregation that fails verification.
- **Weak randomness for nonces.** Predictable Round 1 nonces undermine the whole scheme, since Schnorr security rests on unique, unpredictable nonces.
```

**Claims tested** (e2e/claims.spec.ts, 15 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:18
    - :18 `toHaveAttribute` expected `'data-result', 'pass', {` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:26
    - :26 `toHaveCount` expected `5, { timeout: 20_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:31
    - :31 `toHaveCount` expected `3, { timeout: 20_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:33
    - :33 `toHaveCount` expected `4, { timeout: 20_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:35
    - :35 `toBeVisible` expected `{ timeout: 20_000 }` _(expression)_
- `accountable signature verifies only against keys named by J` — e2e/claims.spec.ts:43
    - :54 `toEqual` expected `quorum` _(expression)_
    - :55 `toHaveLength` expected `threshold` _(expression)_
    - :56 `toContainText` expected `setText(decoded)` _(expression)_
    - :61 `toEqual` expected `quorum` _(expression)_
    - :62 `toContainText` expected `'page state only'` _(literal)_
    - :63 `toContainText` expected `'Signer set inside signature'` _(literal)_
    - :64 `toContainText` expected `'none — it cannot be recovered'` _(literal)_
    - :67 `toMatch` expected `/^[0-9a-f]{128}$/` _(regex)_
    - :73 `toBe` expected `true` _(expression)_
    - :76 `toBe` expected `n` _(expression)_
    - :77 `toBe` expected `n` _(expression)_
    - :79 `toBe` expected `threshold` _(expression)_
    - :80 `toBe` expected `threshold` _(expression)_
    - :83 `toHaveCount` expected `threshold` _(expression)_
    - :86 `toMatch` expected `/pk \(96 B\)/` _(regex)_
    - :87 `toMatch` expected `/PoP \(48 B\) — verified/` _(regex)_
    - :88 `toMatch` expected `/σ\d+ \(48 B\) — verified/` _(regex)_
    - :95 `toBe` expected `frostBytes` _(expression)_
    - :96 `toBe` expected `sigmaBytes` _(expression)_
    - :97 `toBe` expected `bitmapBytes` _(expression)_
    - :98 `toBe` expected `sigmaBytes + bitmapBytes` _(expression)_
    - :99 `toBe` expected `threshold * frostBytes` _(expression)_
    - :102 `toContainText` expected `'drand quicknet is private threshold BLS'` _(literal)_
    - :103 `toContainText` expected `'not an ATS example'` _(literal)_
    - :104 `toHaveAttribute` expected `'href', /draft-irtf-cfrg-bls-signature\/07/` _(expression)_
    - :105 `toContainText` expected `'A bank may need accountability'` _(literal)_
    - :106 `toContainText` expected `'certificate authority may prefer privacy'` _(literal)_
- `threshold policy rejects a valid t-minus-one BLS sum` — e2e/claims.spec.ts:109
    - :113 `toHaveAttribute` expected `'data-result', 'pass'` _(expression)_
    - :114 `toContainText` expected `'WRONG'` _(literal)_
    - :115 `toContainText` expected `'valid 2-key BLS sum rejected'` _(literal)_
- `combiner blames exactly the corrupted share` — e2e/claims.spec.ts:118
    - :122 `toHaveAttribute` expected `'data-result', 'pass'` _(expression)_
    - :126 `expect` expected _no expected value_ _(none)_
    - :127 `toBe` expected `corrupted` _(expression)_
- `tracer decodes edited J rather than page quorum` — e2e/claims.spec.ts:130
    - :135 `toHaveAttribute` expected `'data-result', 'pass'` _(expression)_
    - :139 `toBe` expected `pageQuorum` _(expression)_
    - :140 `toHaveText` expected `setText(decoded)` _(expression)_
    - :141 `toBe` expected _no expected value_ _(none)_
- `bitmap labels are one-based and match encoded bits` — e2e/claims.spec.ts:146
    - :152 `toHaveCount` expected `n` _(expression)_
    - :155 `toBe` expected `index + 1` _(expression)_
    - :156 `toBe` expected `decoded.includes(index + 1) ? '1' : '0'` _(expression)_
- `all three ordinary framing strategies reject` — e2e/claims.spec.ts:160
    - :165 `toHaveAttribute` expected `'data-result', 'pass'` _(expression)_
    - :166 `toContainText` expected `'REJECTED'` _(literal)_
- `proof of possession rejects rogue cancellation key` — e2e/claims.spec.ts:170
    - :172 `toContainText` expected `'BROKEN NO-PoP CONTROL ACCEPTED'` _(literal)_
    - :174 `toHaveAttribute` expected `'data-result', 'pass'` _(expression)_
    - :175 `toContainText` expected `'PoP REGISTRATION REJECTED THE ROGUE KEY'` _(literal)_
    - :176 `toContainText` expected `'frame honest signers into a quorum they never joined'` _(literal)_
- `ATS evidence retires on a changed threshold but not a no-op` — e2e/claims.spec.ts:179
    - :186 `toHaveText` expected `signature` _(expression)_
    - :187 `toHaveCount` expected `0` _(literal)_
    - :191 `toHaveCount` expected `0` _(literal)_
    - :192 `toContainText` expected `'threshold changed'` _(literal)_
    - :199 `toEqual` expected `[]` _(expression)_
- `dealer framing fixture is green and still disproves holder attribution` — e2e/claims.spec.ts:202
    - :205 `toBeVisible` expected `{ timeout: 20_000 }` _(expression)_
    - :207 `toHaveAttribute` expected `'data-result', 'pass'` _(expression)_
    - :209 `toHaveText` expected _no expected value_ _(none)_
    - :212 `toContainText` expected _no expected value_ _(none)_
    - :215 `toContainText` expected _no expected value_ _(none)_
- `accountable signing follows a changed selected quorum after private signing` — e2e/claims.spec.ts:220
    - :223 `toHaveAttribute` expected `'data-signers','1,2,3'` _(expression)_
    - :226 `toBeVisible` expected _no expected value_ _(none)_
    - :228 `toHaveAttribute` expected `'data-signers','1,2,4'` _(expression)_
    - :230 `toHaveAttribute` expected `'data-signers','1,2,3'` _(expression)_

**Mutation records** (3 file(s)):

- `e2e/verdict-mutations.json` (3729 bytes)
- `scripts/mutation-report.mjs` (3664 bytes)
- `scripts/run-mutations.mjs` (6238 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-frost-threshold

## What It Is
This demo implements FROST RFC 9591 threshold signing over Ed25519 with Schnorr-style signature shares, using Rust compiled to WASM in the browser. It walks through trusted-dealer key generation, Round 1 nonce commitments, Round 2 signature shares, and final aggregation into a standard Ed25519 signature. The protocol solves single-key concentration risk by requiring any threshold subset of participants to sign without reconstructing one private key. Beside that signer-set-private FROST result, Exhibit 7 implements [Boneh–Shoup accountable threshold BLS](https://toc.cryptobook.us/book.pdf): a proof-of-possession-registered signer bitmap and one BLS12-381 aggregate signature let the verifier recover and check the exact signing-key set. This is an asymmetric threshold-signature security model.

## When to Use It
This demo is educational (see the threat model below), but conceptually FROST fits when:
- One account or service key should require multi-party approval — threshold signing removes single-custodian control.
- A team needs distributed key custody — any t-of-n subset produces one normal, verifier-facing Ed25519 signature.
- Signer availability must survive partial outages — signatures still work if enough participants are online.
- It is a poor fit when one signer must act instantly without coordination, since FROST signing is interactive across rounds.
- Do NOT use this implementation in production — it is an educational WASM demo, not an audited threshold-signing library.

## Live Demo
**[systemslibrarian.github.io/crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/)**

You can set participant count n and threshold t, generate shares, run Round 1 and Round 2, and aggregate the signature for verification. The interface also includes message input and a simulate-failure control to demonstrate invalid aggregation when insufficient shares are provided.

Exhibit 7 sends the same quorum through an accountable BLS construction, then lets you edit its signer bitmap, try three absent-signer framing strategies, corrupt a share, attempt a rogue cancellation key, and run the trusted-dealer framing fixture in which every cryptographic check remains green.

The numbered exhibits are:

1. **Key Generation** — trusted-dealer FROST shares and the Shamir polynomial.
2. **Participant Selection** — choose any threshold-sized quorum.
3. **Round 1** — hiding and binding nonce commitments.
4. **Round 2** — one signature share from each selected participant.
5. **Aggregation & Verification** — one standard Ed25519 signature.
6. **Any Subset Works** — distinct quorum runs, one invariant group key.
7. **Who signed? Private versus accountable** — private FROST beside proof-of-possession-registered BLS ATS, including its framing and trusted-dealer limits.

Several steps now include diagrams of the mechanism, not just hex: an interactive Shamir polynomial plot in Key Generation (toggle *t−1 shares* → the secret stays undetermined, vs *t shares* → the curve locks in and f(0) = the key); a hiding-vs-binding two-cell explainer in Round 1; an aggregation flow that shows the signature shares — each already carrying the live Lagrange coefficient its signer applied in Round 2, recomputed from the actual signer set — being *added* into one signature, with secret shares routed to a locked box that never feeds the aggregator, plus an in-page check that re-sums the shares mod the group order and compares the result against the `s` half of the signature the aggregator returned; and an "any subset" comparison that puts the *invariant group public key* side by side under two different signatures so you can see it is byte-for-byte identical.

## What Can Go Wrong

The "Nonce attack and binding consistency" section contains a live nonce-reuse attack and a separate binding-equation experiment on a small 2-of-3 group. Both use actual `@noble/curves` Ed25519 verification; that verifies the signature equation rather than every internal protocol or security property.

- **Nonce reuse across signing attempts.** Reusing a per-signature nonce, or producing two signatures from the same Round 1 commitment, can leak signing-share secrets — the same class of failure that breaks single-party Schnorr/Ed25519. *Live:* reuse the Round-1 nonces across three sessions and the exhibit solves a 3×3 linear system per signer, recovers the exact group secret, forges an arbitrary message, and the real Ed25519 verifier accepts it. With fresh nonces (the control) the forgery is rejected.
- **Binding-term consistency.** The separate TypeScript experiment signs with the RFC 9591 binding transcript, retains the exact honest response sum `z`, and replaces only the group commitment `R` with an unweighted commitment sum. The original signature verifies and the mismatched equation fails. A separate, consistently defined `ρ = 1` honest-signing control still verifies. This is **not a concurrent Drijvers/ROS forgery demonstration**, and honest acceptance does not establish that unbound protocol's security. Published Appendix E.1 tests check the binding inputs, factors, response shares and final signature; Ed25519 acceptance alone does not prove transcript conformance. The main Rust/WASM signing path remains separate.
- **Trusted-dealer key generation is a single point of trust.** This demo uses a trusted dealer; a real deployment usually wants a distributed key generation so no one party ever sees the full key.
- **A signer bitmap identifies keys, not necessarily their human holders.** The accountable BLS fixture verifies and traces `{2, 4, 5}`, yet the trusted dealer can produce those shares itself because it generated and retained every α_i. The panel therefore reports `VERIFIED AND TRACED — AND FRAMED BY THE DEALER` rather than treating tracing as proof of human participation.
- **Same-message BLS aggregation needs a rogue-key defence.** The accountable construction uses the proof-of-possession ciphersuite from [`draft-irtf-cfrg-bls-signature-07` §§3.3 and 4.2.3](https://datatracker.ietf.org/doc/draft-irtf-cfrg-bls-signature/07/) and rejects any key whose `PopVerify` fails. Its deliberately broken no-PoP control shows a cancellation key making the raw aggregate pairing pass while naming honest keys. The BLS signature scheme source is an IRTF Internet-Draft, not an RFC; [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380) specifies only hash-to-curve.
- **Wrong threshold or insufficient shares.** Supplying fewer than t shares cannot produce a valid signature; mismatched participant sets or indices yield aggregation that fails verification.
- **Weak randomness for nonces.** Predictable Round 1 nonces undermine the whole scheme, since Schnorr security rests on unique, unpredictable nonces.

## Real-World Usage
- **RFC 9591** standardizes FROST, giving interoperable two-round threshold Schnorr signing for implementers.
- **Cryptocurrency custody and wallets** use threshold Schnorr so that spending requires a t-of-n quorum rather than one exposed private key.
- **Bitcoin Taproot / BIP-340 Schnorr** makes FROST-style threshold signatures attractive because the aggregate output is an ordinary on-chain Schnorr signature with no special script.
- **Reference implementations** such as the Zcash Foundation's `frost` crates provide audited libraries that production systems build on.
- **Distributed code/release signing** can require multiple maintainers to jointly produce one verifier-facing signature without a shared key file.

## How to Run Locally
`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-frost-threshold
cd crypto-lab-frost-threshold
npm install
npm run dev
`​``

No environment variables are required for local development.

## Related Demos
- [crypto-lab-gg20-wallet](https://systemslibrarian.github.io/crypto-lab-gg20-wallet/) — threshold ECDSA, the harder secp256k1 cousin of threshold Schnorr.
- [crypto-lab-threshold-mldsa](https://systemslibrarian.github.io/crypto-lab-threshold-mldsa/) — distributed post-quantum signing with threshold ML-DSA.
- [crypto-lab-vss-gate](https://systemslibrarian.github.io/crypto-lab-vss-gate/) — Feldman/Pedersen verifiable secret sharing, the keygen layer under FROST.
- [crypto-lab-shamir-gate](https://systemslibrarian.github.io/crypto-lab-shamir-gate/) — Shamir secret sharing and Lagrange interpolation fundamentals.
- [crypto-lab-ed25519-forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) — the single-party Ed25519 signature FROST aggregates into.
- [crypto-lab-pulse-chain](https://systemslibrarian.github.io/crypto-lab-pulse-chain/) — private threshold BLS whose quorums produce one byte-identical group signature with no signer bitmap.
- [crypto-lab-musig-gate](https://systemslibrarian.github.io/crypto-lab-musig-gate/) — multisignature indistinguishability and the need to retain signer records elsewhere.
- [crypto-lab-pairing-gate](https://systemslibrarian.github.io/crypto-lab-pairing-gate/) — pairing equations, rogue keys, and proof-of-possession registration.
- [crypto-lab-shamir-vs-frost](https://systemslibrarian.github.io/crypto-lab-shamir-vs-frost/) — reconstructing a shared secret versus producing a threshold signature without reconstructing it.

## What It Teaches
The demo walks the protocol end to end and proves five things with live values you generate yourself:
- **The key is shared, never whole — as a property of the PROTOCOL, which is what this page demonstrates.** Key generation splits one Ed25519 key with Verifiable Secret Sharing. In FROST no participant, and crucially no aggregator, ever holds the full signing key: aggregation runs on *public verifying shares*, and the code enforces that secrets never reach it.

  **What this page does not demonstrate is isolation, and it cannot.** `frost_keygen` is a trusted dealer running in your browser, and it returns every participant's secret share to the one page you are reading — see `KeygenOutput.shares` in `crate/src/keygen.rs`, where each share carries its `secret` as hex. That page therefore holds enough material to reconstruct the key at any moment, whatever the protocol says, and the only reason it does not is that it chooses not to. A real deployment has each share generated and held somewhere the others cannot reach, which is the point of distributed key generation (see Limitations).

  So the signature is real and the roles are real; the boundaries between participants are drawn, not enforced. The cross-verification against `ed25519-dalek` establishes that the signature is correct, and tests nothing about isolation.
- **Any *t* signers suffice, with no special roles.** Pick any threshold-sized subset; which signers you choose is irrelevant.
- **A share is not a signature.** Round 2 yields 32-byte partial shares that are useless alone; only aggregation produces a real signature. Two 32-byte shares are *summed into one 32-byte scalar s* (not concatenated); the final 64-byte signature is the pair (R, s).
- **The result is indistinguishable from solo signing.** The output is an ordinary 64-byte Ed25519 signature that any standard verifier accepts. (The test suite cross-verifies it with the independent `ed25519-dalek` library.)
- **Privacy and accountability are different signature outputs.** FROST produces one private 64-byte signature from which the quorum cannot be recovered. The adjacent Boneh–Shoup §22.2.6 construction produces `(J, σ)`: a signer bitmap plus one 48-byte BLS12-381 G1 aggregate, verified against exactly the proof-of-possession-registered G2 keys named by `J`. That makes the signing-key set traceable, at the cost of privacy and bitmap bytes, but the trusted-dealer fixture proves it does not establish which human holders participated. The primitive gate pins one drand quicknet round as a **private, non-accountable** BLS known answer (one vector from drand's published API); no published ATS known-answer vector is claimed.

A progress tracker, per-step "why it matters" callouts, in-step diagrams (Shamir polynomial plot, hiding-vs-binding cells, Lagrange aggregation flow, invariant-key comparison), and a closing recap reinforce each idea.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Publishing and build requirements

Use Node24 and run `npm ci`, `cargo test --manifest-path crate/Cargo.toml`, and `npm run wasm` before TypeScript checks or the site build. The generated `pkg` module is a prerequisite; a missing module is not a failing protocol test. Tailwind4 styling requires Safari16.4+, Chrome111+ or Firefox128+.

`npm run deploy` requests the existing gated `deploy.yml` workflow for remote `main`; it does not upload local files. A queued request is not proof of deployment. Confirm the workflow and public site separately. The main Rust/WASM implementation is unchanged by the exhibit and CSS repairs; this build does not establish reproducibility of a previously distributed WASM binary.

## Adaptive-corruption research context

The live demo includes an **Adaptive corruption** section with dated primary sources, the `T=t+1` notation conversion, baseline and large-roster examples, and explicit proof/attack/executable-demo boundaries. A valid signature or failed single-share forgery is not an adaptive-security proof. See [the 2025 proof](https://eprint.iacr.org/2025/1061), [the September 2026 attack preprint](https://eprint.iacr.org/2026/2126), [the contextualization preprint](https://eprint.iacr.org/2026/2203), and [Bacho's October 2026 follow-up](https://eprint.iacr.org/2026/2554) (approved 20 October; preprint). The follow-up reports a concrete LDVR attack with 488 signers and 173 corruptions for canonical Curve25519 evaluation points. Separately, it measures a successful subset search with 228 signers and 114 corruptions when evaluation points are adversarially chosen. The latter measurement is not an end-to-end compromise of this browser demo. This addition does not change the signing engine or nonce/binding controls.

### Accountable quorum correction

Accountable signing now uses the current complete participant selection before falling
back to the last FROST quorum. The private card continues to show the quorum that produced
its recorded signature. Changing signers therefore retires the ATS result and the next
ATS signature follows the new selection. The POP signature and proof domains, required
PopVerify registration, and quicknet BASIC-suite contrast are preserved. The deployment
gate also replays the mutation ledger with structured owning-test assertion checks.

```

</details>

---

## SPHINCS+ Ledger

- **slug**: `crypto-lab-sphincs-ledger`
- **repo**: https://github.com/systemslibrarian/crypto-lab-sphincs-ledger
- **live**: https://systemslibrarian.github.io/crypto-lab-sphincs-ledger/
- **commit_sha**: `d117eeb92ab0effbf806724c52a602da0bb6fc35` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | HASHING & KDFS  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, mutations, verification

**Name (H1)**: SLH-DSA / SPHINCS+  — _read from demos/sphincs-ledger/index.html_

**Subtitle**: Hash-based signatures · NIST FIPS 205  — _read from demos/sphincs-ledger/index.html_

**Description**: Generate a stateless post-quantum keypair, sign a message, and walk the SHA-256 Merkle trees, WOTS+ chains, FORS forests, and XMSS hypertree that build the signature.  — _read from demos/sphincs-ledger/index.html_

**Why it matters**: A quantum computer breaks RSA and ECC, but SLH-DSA rests only on standard hash-function properties — preimage/second-preimage resistance and pseudorandomness, not even collision resistance — with no algebraic assumptions. That conservative foundation makes it a long-horizon anchor for firmware and code signing.  — _read from demos/sphincs-ledger/index.html_

**Card copy**: Stateless hash-based signatures (SLH-DSA) in the browser. Explore hash-based mathematical assumptions and why implementations must also protect against secret leakage.

**Chips**: SLH-DSA · FIPS 205 · SPHINCS+ · SHA-256 · WOTS+

**Implements**: Merkle tree `demos/sphincs-ledger/src/crypto/merkle.ts:15`, SHA-256 `demos/sphincs-ledger/src/crypto/fors.ts:58`, SLH-DSA `demos/sphincs-ledger/src/crypto/params.ts:17`, SPHINCS+ `demos/sphincs-ledger/src/crypto/params.ts:18`, Winternitz `demos/sphincs-ledger/src/crypto/params.ts:65`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: SHA-512 `demos/sphincs-ledger/src/crypto/fors.ts:55`, SHAKE `demos/sphincs-ledger/src/crypto/params.ts:36`, XMSS `demos/sphincs-ledger/src/crypto/merkle.ts:3`

**References**: Dilithium, ECDSA, Ed25519, Falcon, Grover's algorithm, HAETAE, LMS, LWE, ML-DSA, ML-KEM, NTRU, RSA, SHA-3, SHA-512, SHAKE, Shor's algorithm, X3DH, XMSS

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `ePrint 2026/2584` — first seen README.md:27 (1×)
- `ePrint 2026/2753` — first seen README.md:28 (1×)
- `eprint.iacr.org/2026/2584` — first seen README.md:27 (2×)
- `eprint.iacr.org/2026/2753` — first seen README.md:28 (2×)
- `FIPS 180-4` — first seen demos/sphincs-ledger/src/crypto/hash.ts:2 (1×)
- `FIPS 204` — first seen README.md:51 (1×)
- `FIPS 205` — first seen README.md:5 (33×)
- `NIST SP 800-208` — first seen README.md:49 (1×)
- `NIST SP 800-230` — first seen demos/sphincs-ledger/index.html:537 (1×)
- `RFC 8017` — first seen demos/sphincs-ledger/src/crypto/fors.ts:53 (1×)
- `SP 800-230` — first seen README.md:76 (1×)

**README — What Can Go Wrong**:

```text
- **Very large signatures** — SLH-DSA signatures are far larger than RSA, Ed25519, or ML-DSA; dropping them into bandwidth- or latency-sensitive protocols can break those protocols.
- **Slow signing** — the conservative hash-based construction makes signature generation comparatively expensive, a poor fit for high-throughput signing.
- **Parameter-set tradeoffs** — the "fast" vs "small" SLH-DSA variants trade signature size against speed; choosing the wrong profile for the workload hurts either bandwidth or latency.
- **Mathematical assumptions are hash-based** — SLH-DSA has no number-theoretic assumption, but its implementation must also protect secret values against leakage. Use the standardized parameter sets and a reviewed implementation.
- **Power leakage can bypass mathematical hardness** — [*SHAKEing SLH-DSA with Non-profiled SCAs*, ePrint 2026/2584](https://eprint.iacr.org/2026/2584), received 21 October and approved 24 October 2026, is a **preprint; attack-model-conditional**. The authors report non-profiled correlation power analysis recovering a full secret seed in SLH-DSA-SHAKE experiments on a 32-bit microcontroller, enabling forgery. This requires physical power measurements; it is not a mathematical break of SLH-DSA or SHAKE. This browser demo implements SHA-2 variants only, does not reproduce the power experiment, and is not shown vulnerable by that result. The visible **Security Basis** tab explains this distinction.
- **SHA-2 power leakage is also an implementation concern** — [*Correlation Power Analysis on SHA-2-Based SLH-DSA*, ePrint 2026/2753](https://eprint.iacr.org/2026/2753), published 4 November 2026, is a preprint reporting conditional, stage-wise recovery on a measured STM32F303 Cortex-M4. The authors used 5,000 traces per seed in their tested conditions. Reported recovery rates assume preceding secret values were supplied at each stage; they are not end-to-end full-seed recovery rates. The browser demo does not reproduce that physical attack and is not shown vulnerable by it. The visible **Security Basis** tab links both studies separately.
- **Misreading the educational tabs** — the Merkle-tree and WOTS+ views are simplified pedagogical primitives, not the full SLH-DSA hypertree; only the SLH-DSA path is the real signing scheme.
```

**Claims tested** (demos/sphincs-ledger/e2e/claims.spec.ts, 6 test(s)):

- `security tab scopes the SLH-DSA power-analysis result to its implementation model` — demos/sphincs-ledger/e2e/claims.spec.ts:3
    - :7 `toBeVisible` expected _no expected value_ _(none)_
    - :8 `toContainText` expected `'preprint; attack-model-conditional'` _(literal)_
    - :9 `toContainText` expected `'24 October 2026'` _(literal)_
    - :10 `toContainText` expected `'SLH-DSA-SHAKE'` _(literal)_
    - :11 `toContainText` expected `'physical power measurements'` _(literal)_
    - :12 `toContainText` expected `'This demo uses SHA-2 variants only'` _(literal)_
    - :13 `toContainText` expected `'does not establish that the browser engine is vulnerable'` _(literal)_
    - :14 `toBeVisible` expected _no expected value_ _(none)_
    - :15 `toContainText` expected `'all six SHA-2 parameter'` _(literal)_
    - :16 `toContainText` expected `'conditional stage results'` _(literal)_
    - :17 `toContainText` expected `'not as an end-to-end full-seed recovery rate'` _(literal)_
    - :18 `toContainText` expected `'physical power measurements'` _(literal)_
    - :19 `toBeVisible` expected _no expected value_ _(none)_
- `schematics and checksum-free chain demo state their actual evidence boundary` — demos/sphincs-ledger/e2e/claims.spec.ts:22
    - :24 `toContainText` expected `'illustrative leaf-to-root path'` _(literal)_
    - :28 `toContainText` expected `'not a complete WOTS+ signature forgery'` _(literal)_
    - :29 `toHaveAttribute` expected `'max', '15'` _(expression)_
    - :35 `toContainText` expected `'CANNOT FORGE'` _(literal)_
    - :36 `toContainText` expected `'VALID FORGERY'` _(literal)_
- `complete WOTS+ states its reduced scale next to the forgery it offers` — demos/sphincs-ledger/e2e/claims.spec.ts:39
    - :44 `toContainText` expected `'deliberately shrunk WOTS+'` _(literal)_
    - :45 `toContainText` expected `'24-bit digest'` _(literal)_
    - :46 `toContainText` expected `'128-bit'` _(literal)_
    - :48 `toHaveText` expected `'8'` _(literal)_
    - :49 `toHaveText` expected `'35'` _(literal)_
    - :50 `toHaveText` expected `'6'` _(literal)_
    - :51 `toHaveText` expected `'2'` _(literal)_
- `one signature: the forgery search genuinely FAILS and names the checksum` — demos/sphincs-ledger/e2e/claims.spec.ts:54
    - :64 `toContainText` expected `'Honest signature verifies:'` _(literal)_
    - :65 `toContainText` expected `'VALID'` _(literal)_
    - :67 `toBeHidden` expected _no expected value_ _(none)_
    - :73 `toContainText` expected `'FORGERY FAILED', { timeout: 60_000 }` _(expression)_
    - :74 `toContainText` expected `'FORGERY SUCCEEDED'` _(literal)_
    - :75 `toContainText` expected `'20,000 candidate messages'` _(literal)_
    - :76 `toContainText` expected `'Chains still out of reach'` _(literal)_
    - :77 `toContainText` expected `'Where the checksum did the work'` _(literal)_
    - :86 `expect` expected _no expected value_ _(none)_
    - :89 `toBe` expected `20000` _(literal)_
    - :92 `expect` expected _no expected value_ _(none)_
    - :95 `expect` expected _no expected value_ _(none)_
    - :96 `toBe` expected `clearedN` _(expression)_
    - :99 `toBe` expected `clearedN` _(expression)_
    - :104 `expect` expected _no expected value_ _(none)_
    - :109 `toHaveLength` expected `8` _(literal)_
    - :114 `expect` expected _no expected value_ _(none)_
    - :116 `expect` expected _no expected value_ _(none)_
    - :117 `toBe` expected `floorDigits[Number(idx)]` _(expression)_
- `two signatures on one key: the forgery SUCCEEDS and the page runs the verifier` — demos/sphincs-ledger/e2e/claims.spec.ts:121
    - :130 `toContainText` expected `'observed under this key: 1'` _(literal)_
    - :135 `toContainText` expected `'observed under this key: 2'` _(literal)_
    - :136 `toBeVisible` expected _no expected value_ _(none)_
    - :137 `toContainText` expected `'KEY REUSE'` _(literal)_
    - :143 `toContainText` expected `'FORGERY SUCCEEDED', { timeout: 60_000 }` _(expression)_
    - :144 `toContainText` expected `'wotsPlusVerify() against the honest public key returned: true'` _(literal)_
    - :145 `toContainText` expected `'Signer ever approved it: no'` _(literal)_
    - :146 `toContainText` expected `'checksum was genuinely satisfied'` _(literal)_
    - :148 `toContainText` expected `'DIGEST COLLISION'` _(literal)_
    - :156 `expect` expected _no expected value_ _(none)_
    - :157 `expect` expected _no expected value_ _(none)_
    - :160 `toHaveLength` expected `8` _(literal)_
    - :161 `toHaveLength` expected `8` _(literal)_
    - :162 `expect` expected _no expected value_ _(none)_
    - :165 `expect` expected _no expected value_ _(none)_
- `ledger tampering reports the real verifier result` — demos/sphincs-ledger/e2e/claims.spec.ts:168
    - :172 `toBeEnabled` expected `{ timeout: 60_000 }` _(expression)_
    - :175 `toContainText` expected `'ran SPHINCS+ verify()'` _(literal)_
    - :176 `toContainText` expected `'returned false'` _(literal)_
    - :177 `toHaveText` expected `'INVALID MESSAGE SIGNATURE'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-sphincs-ledger

## What It Is

This project is a browser demo of SLH-DSA (SPHINCS+), with supporting SHA-256 Merkle tree and WOTS+ visualizations that make the signing flow easier to inspect. SLH-DSA solves the digital-signature problem: a signer produces a public verifiable proof that a message came from the holder of the private key and was not modified. The scheme is an asymmetric, hash-based, post-quantum signature system standardized in NIST FIPS 205. In this demo, the security story is presented honestly: the production signing path is SLH-DSA, while the Merkle tree and WOTS+ tabs are educational views of the primitives beneath it.

## When to Use It

- Use it for long-lived software releases or archive signatures when conservative post-quantum assurances matter more than compact signatures.
- Use it for offline or low-frequency signing workflows because SLH-DSA trades very large signatures for a hash-only security foundation.
- Use it for teaching or internal reviews when you need to show how SHA-256 Merkle trees, WOTS+, and SLH-DSA fit together in one place.
- Do not use it for bandwidth-sensitive or latency-sensitive protocols because the signature sizes in the implemented parameter sets are much larger than RSA, Ed25519, or ML-DSA.
- Do not use it as a production signing implementation — it is a teaching demo for SLH-DSA and its underlying primitives, not an audited library.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-sphincs-ledger](https://systemslibrarian.github.io/crypto-lab-sphincs-ledger/)**

The demo lets you generate keys, sign messages, verify signatures, inspect a SHA-256 Merkle tree authentication path, experiment with a WOTS+ chain reveal, and collect independently signed message bytes. The collection is not an append-only authenticated ledger: author/time are unsigned, order and completeness are unprotected, and a fresh self-supplied key does not establish the typed author's identity. The reference tab demonstrates metadata edits, reordering, removal and replacement with a new key/signature alongside real changed-message rejection. Reloaded signatures remain unverified until the verifier runs. The main controls are the Parameter set selector, Message to sign textarea, Number of leaves selector, Message nibble input, and Chain index input.

## What Can Go Wrong

- **Very large signatures** — SLH-DSA signatures are far larger than RSA, Ed25519, or ML-DSA; dropping them into bandwidth- or latency-sensitive protocols can break those protocols.
- **Slow signing** — the conservative hash-based construction makes signature generation comparatively expensive, a poor fit for high-throughput signing.
- **Parameter-set tradeoffs** — the "fast" vs "small" SLH-DSA variants trade signature size against speed; choosing the wrong profile for the workload hurts either bandwidth or latency.
- **Mathematical assumptions are hash-based** — SLH-DSA has no number-theoretic assumption, but its implementation must also protect secret values against leakage. Use the standardized parameter sets and a reviewed implementation.
- **Power leakage can bypass mathematical hardness** — [*SHAKEing SLH-DSA with Non-profiled SCAs*, ePrint 2026/2584](https://eprint.iacr.org/2026/2584), received 21 October and approved 24 October 2026, is a **preprint; attack-model-conditional**. The authors report non-profiled correlation power analysis recovering a full secret seed in SLH-DSA-SHAKE experiments on a 32-bit microcontroller, enabling forgery. This requires physical power measurements; it is not a mathematical break of SLH-DSA or SHAKE. This browser demo implements SHA-2 variants only, does not reproduce the power experiment, and is not shown vulnerable by that result. The visible **Security Basis** tab explains this distinction.
- **SHA-2 power leakage is also an implementation concern** — [*Correlation Power Analysis on SHA-2-Based SLH-DSA*, ePrint 2026/2753](https://eprint.iacr.org/2026/2753), published 4 November 2026, is a preprint reporting conditional, stage-wise recovery on a measured STM32F303 Cortex-M4. The authors used 5,000 traces per seed in their tested conditions. Reported recovery rates assume preceding secret values were supplied at each stage; they are not end-to-end full-seed recovery rates. The browser demo does not reproduce that physical attack and is not shown vulnerable by it. The visible **Security Basis** tab links both studies separately.
- **Misreading the educational tabs** — the Merkle-tree and WOTS+ views are simplified pedagogical primitives, not the full SLH-DSA hypertree; only the SLH-DSA path is the real signing scheme.

## Real-World Usage

- **Long-lived software and firmware signing** — conservative post-quantum assurance for artifacts that must remain verifiable for decades.
- **NIST FIPS 205** — SLH-DSA is the standardized stateless hash-based signature, recommended where a non-lattice PQ signature is wanted as a hedge.
- **Code, release, and archive signing** — offline, low-frequency signing where large signatures are acceptable in exchange for hash-only security.
- **Root-of-trust and PKI hedges** — hash-based signatures back trust anchors that are hard to rotate and need quantum-resistant longevity.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-sphincs-ledger
cd crypto-lab-sphincs-ledger/demos/sphincs-ledger
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-lms-ledger](https://systemslibrarian.github.io/crypto-lab-lms-ledger/) — LMS/HSS with W-OTS+, the stateful hash-based signature family (NIST SP 800-208).
- [crypto-lab-lms-xmss](https://systemslibrarian.github.io/crypto-lab-lms-xmss/) — LMS and LM-OTS internals, contrasting stateful trees with SLH-DSA's stateless design.
- [crypto-lab-dilithium-seal](https://systemslibrarian.github.io/crypto-lab-dilithium-seal/) — ML-DSA (FIPS 204), the lattice PQ signature with far smaller signatures.
- [crypto-lab-falcon-seal](https://systemslibrarian.github.io/crypto-lab-falcon-seal/) — Falcon (FN-DSA), the compact NTRU-lattice PQ signature.
- [crypto-lab-merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) — SHA-256 Merkle trees and inclusion proofs, the structure underpinning hash-based signatures.

## Project Layout

The demo source lives under `demos/sphincs-ledger/` in the repository, so after
cloning, run the dev server from that subdirectory:

`​``bash
cd crypto-lab-sphincs-ledger/demos/sphincs-ledger
npm install
npm run dev
`​``

No environment variables are required.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Limited-use SLH-DSA draft

The live demo includes a dated [SP 800-230 initial-public-draft reference](https://csrc.nist.gov/pubs/sp/800/230/ipd) (13 April 2026), with its 2²⁴-signature per-key limit and explicit non-final, non-general-purpose scope. SPHINCS Ledger provides a workload budget model, not a durable signing counter; PQ Chooser keeps the draft variants unranked and outside measured exports. Existing FIPS 205 executable parameter sets remain the ones these labs sign and measure.

```

</details>

---

## Ed25519 Forge

- **slug**: `crypto-lab-ed25519-forge`
- **repo**: https://github.com/systemslibrarian/crypto-lab-ed25519-forge
- **live**: https://systemslibrarian.github.io/crypto-lab-ed25519-forge/
- **commit_sha**: `c77da8decdd634a77fe6254ddc06d703756b9330` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES  ·  **level**: beginner  ·  **--accent**: #ae3f22
- **MISSING FIELDS**: claims, verification

**Name (H1)**: Ed25519 Forge  — _read from index.html_

**Subtitle**: EdDSA · Curve25519 · RFC 8032  — _read from index.html_

**Description**: Make a pair of keys, sign a note, then change one character and watch the check fail — then go deeper, into signing that is identical every time and the edge cases a verifier has to screen for.  — _read from index.html_

**Why it matters**: A signature is what lets anyone check that a message came from you and has not been altered since. Most schemes need a fresh random number for every signature, and one slip gives away the private key — that is how the PlayStation 3 was broken. Ed25519 removes that particular risk by design.  — _read from index.html_

**Card copy**: Keypair generation, signing, and signature verification — deterministic nonces, tamper detection, the ZIP215 cofactor pitfall, and 64-byte compact signatures.

**Chips**: Ed25519 · EdDSA · Deterministic Nonces · ZIP215 · Cofactor

**Implements**: EC point arithmetic `src/forge.ts:63`, ECDSA `src/ecdsa-ui.ts:53`, Ed25519 `src/ecdsa.ts:192`, P-256 `src/ecdsa.ts:25`, SHA-256 `src/ecdsa.ts:52`

**Attacks shown**: Discrete log `README.md:5`, Nonce reuse `src/ecdsa-ui.ts:7`, Signature malleability `README.md:27`

**Comment-only (named in code comments, not executed)**: SHA-512 `src/forge.ts:51`

**References**: BLS signatures, Diffie-Hellman, Ed448, EdDSA, FROST, RSA, SHA-512, TLS 1.3, X25519, X3DH, secp256k1

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 186-5` — first seen README.md:29 (4×)
- `RFC 6979` — first seen src/ecdsa.ts:49 (1×)
- `RFC 8032` — first seen README.md:24 (10×)
- `RFC 9591` — first seen README.md:70 (1×)
- `RFC 9846` — first seen README.md:52 (1×)

**README — What Can Go Wrong**:

```text
- **Cross-library verification disagreement (pre-ZIP215)** — Before ZIP215 standardized Ed25519 verification behavior, different implementations could return conflicting valid/invalid results for the same signature due to inconsistent cofactor handling and small-subgroup point checks. Monero was affected by this ambiguity.
- **Verification divergence from cofactor=8** — The Ed25519 group has cofactor 8, so eight low-order ("torsion") points sit alongside the prime-order subgroup real keys live in. Note which way the causality runs, because it is commonly stated backwards: *cofactored* (ZIP-215) verification, which checks `[8]·(R + [k]·A − [S]·B) == 0`, is the **permissive** one — the factor of 8 annihilates a small-order `A`, so it accepts a "signature" no secret key ever produced. Strict RFC 8032 / FIPS 186-5 verification is what **rejects**, because it screens small-order public keys. Cofactor-aware verification does not prevent this; it is the reason the bytes are accepted. The live exhibit runs both verifiers on identical bytes and shows the split verdict.
- **What this is not** — this divergence is not a forgery against a legitimate key. It needs an attacker-chosen small-order or mixed-order *public key*; against a normal prime-order key the trick fails, and the demo includes that control. The damage is consensus and identity: two conforming implementations disagree about whether the same signature is valid, which breaks any system that treats "verified" as a single global fact or treats signatures as unique identifiers.
- **Clamping errors in custom implementations** — Ed25519 private key processing requires specific bit manipulation (clearing low bits, setting a high bit) of the SHA-512 hash of the seed. Incorrect clamping produces keys that may work locally but fail interoperability or leak information about the scalar.
- **Confusing Ed25519 seed vs. expanded private key** — The 32-byte seed is hashed to produce the 64-byte expanded key; using the raw seed where the expanded key is expected (or vice versa) is a common implementation bug that produces invalid signatures silently.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records** (2 file(s)):

- `audits/mutation-observations.json` (3423 bytes)
- `tools/mutations.mjs` (6454 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-ed25519-forge

## What It Is

Ed25519 Forge is an interactive browser demo of Ed25519 keypair generation, message signing, and signature verification using the `@noble/curves` library. Ed25519 is an Edwards-curve Digital Signature Algorithm providing 128-bit security equivalent, operating on the twisted Edwards form of Curve25519 over a ~255-bit prime field. It solves the problem of producing compact, deterministic digital signatures: the nonce is derived from the private key and message rather than from a random number generator, eliminating the class of key-exposure failures caused by nonce reuse or weak RNG. The security model assumes the hardness of the elliptic curve discrete logarithm problem on Curve25519.

## When to Use It

- **SSH authentication keys** — Ed25519 has been supported by OpenSSH since 6.5 (2014) and is the `ssh-keygen` default since 9.5 (2023), offering short keys (32-byte public) and fast operations compared to RSA.
- **Protocol message signing with compact signatures** — At 64 bytes per signature with no DER overhead, Ed25519 is well-suited for bandwidth- or storage-constrained protocols like TLS 1.3.
- **Systems requiring deterministic signature output** — Because the nonce is derived from key + message, the same inputs always produce the same signature, simplifying testing and eliminating RNG-dependent failure modes.
- **High-throughput verification workloads** — Ed25519 verification is roughly 2x faster than P-256 ECDSA in practice, making it a strong choice for systems verifying many signatures.
- **Do NOT use Ed25519 for key agreement or encryption** — Ed25519 is a signature scheme; for Diffie-Hellman key exchange on the same curve family, use X25519 instead.
- Do NOT treat this as production code — it is a browser teaching demo, not a hardened signing library.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-ed25519-forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/)**

The demo lets you generate an Ed25519 keypair, sign an arbitrary text message, and verify the resulting 64-byte signature. You can also tamper a single bit in the signature (byte index 32, XOR 0x01) and re-verify to observe deterministic failure. All hex displays are uppercase with 4-byte grouping; the private key is truncated to first/last 8 hex characters. The signature is shown split into its two colored halves — **R** (bytes 0–31, the commitment point) and **S** (bytes 32–63, the scalar response) — the same coloring reused in the cofactor exhibit so the `R = [S]·B` forgery is legible.

### Exhibits

1. **Key Forge with animated scalar multiplication** — the 32-byte private key is a seed, not the multiplication scalar. The animation interprets the pruned SHA-512 head as the unreduced little-endian integer from RFC 8032 section 5.1.5. It walks the leading bit plus the next 12 bits through real doubles and additions. A distinct **summary** frame reports how many arithmetic operations were displayed and how many remain skipped, then jumps to the exact public key. This jump is not an `add G` and is not counted as one. Noble's separately reduced scalar gives the same public key but a different bit sequence; it is used only to calculate the summary endpoint. Plot coordinates are approximate, not a signing-library execution trace or constant-time claim. The full 254-bit continuation reaches the public key without a jump; regressions independently hash/prune RFC TEST 2 and check every labelled point against its group operation.
2. **Sign with a determinism demonstrator** — sign a message, then hit **Sign Again**: the two signatures are shown side by side with an **IDENTICAL — same key + same message always yields the same signature** verdict in green. Edit one character of the message and re-sign to watch the signature change completely (**CHANGED**). This makes Ed25519's headline deterministic-nonce property observable, not merely asserted.
3. **Verify with one-click failure presets** — beyond the single-bit tamper, **Different public key** and **Modified message** buttons pre-fill a real failing scenario and produce **INVALID**, so the learner explores the failure surface without hand-editing hex.
4. **Live cofactor / ZIP215 malleability** — the standout exhibit (below), now scaffolded with plain-language framing and an inline glossary for *torsion point*, *cofactor 8*, and the verification equation.

The **Pitfalls & ZIP215** tab includes a live cofactor-malleability exhibit. It takes one of the eight low-order (torsion) points as a "public key" and hands the verifier a 64-byte "signature" that no secret key ever produced. Because a small-order key vanishes from the *cofactored* verification equation `[8]·(R + [k]·A − [S]·B) == 0`, the demo's default verifier (`@noble/curves`, ZIP215 / consensus-critical) **accepts** it, while strict RFC 8032 / FIPS 186-5 verification (`{ zip215: false }`) **rejects** the identical bytes. This is the exact cross-library ambiguity that affected Monero and motivated [ZIP-0215](https://zips.z.cash/zip-0215). All of this is real, not simulated — the two verdicts are computed live from `@noble/curves`.

### Tests

The crypto is covered by a Vitest suite (`npm test`, wired into the deploy gate):

- **RFC 8032 §7.1 Known-Answer Tests** — fixed seed → public key → signature triples (TEST 1/2/3), verifying `@noble/curves` reproduces the reference vectors byte-for-byte.
- **Round-trip and forgery rejection** — sign/verify, wrong-message rejection, wrong-key rejection, single-bit tamper rejection, and determinism.
- **Cofactor / small-subgroup malleability** — the ZIP215-vs-strict divergence above is asserted for every torsion point, with a control showing the trick fails against a normal prime-order key.

## What Can Go Wrong

- **Cross-library verification disagreement (pre-ZIP215)** — Before ZIP215 standardized Ed25519 verification behavior, different implementations could return conflicting valid/invalid results for the same signature due to inconsistent cofactor handling and small-subgroup point checks. Monero was affected by this ambiguity.
- **Verification divergence from cofactor=8** — The Ed25519 group has cofactor 8, so eight low-order ("torsion") points sit alongside the prime-order subgroup real keys live in. Note which way the causality runs, because it is commonly stated backwards: *cofactored* (ZIP-215) verification, which checks `[8]·(R + [k]·A − [S]·B) == 0`, is the **permissive** one — the factor of 8 annihilates a small-order `A`, so it accepts a "signature" no secret key ever produced. Strict RFC 8032 / FIPS 186-5 verification is what **rejects**, because it screens small-order public keys. Cofactor-aware verification does not prevent this; it is the reason the bytes are accepted. The live exhibit runs both verifiers on identical bytes and shows the split verdict.
- **What this is not** — this divergence is not a forgery against a legitimate key. It needs an attacker-chosen small-order or mixed-order *public key*; against a normal prime-order key the trick fails, and the demo includes that control. The damage is consensus and identity: two conforming implementations disagree about whether the same signature is valid, which breaks any system that treats "verified" as a single global fact or treats signatures as unique identifiers.
- **Clamping errors in custom implementations** — Ed25519 private key processing requires specific bit manipulation (clearing low bits, setting a high bit) of the SHA-512 hash of the seed. Incorrect clamping produces keys that may work locally but fail interoperability or leak information about the scalar.
- **Confusing Ed25519 seed vs. expanded private key** — The 32-byte seed is hashed to produce the 64-byte expanded key; using the raw seed where the expanded key is expected (or vice versa) is a common implementation bug that produces invalid signatures silently.

## Real-World Usage

- **OpenSSH** — Ed25519 has been supported since OpenSSH 6.5 (2014) and is the `ssh-keygen` default since 9.5 (2023), used for both user authentication and host keys.
- **Signal Protocol** — Signal uses Ed25519 (via XEdDSA) for identity keys and signed prekeys in the X3DH key agreement protocol.
- **Zcash** — Ed25519 signatures appear in the Zcash consensus rules, which is why ZIP-215 had to pin down exactly which signatures every implementation must accept.
- **TLS 1.3** — Ed25519 is a named signature scheme (ed25519 in RFC 9846) for certificate verification and handshake authentication.
- **age encryption tool** — age's native recipients and identities are **X25519**, not Ed25519. As a convenience feature age also accepts `ssh-ed25519` (and `ssh-rsa`) SSH public keys as recipients, which is an interoperability path for existing SSH infrastructure rather than age's own key format.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-ed25519-forge
cd crypto-lab-ed25519-forge
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-ecdsa-forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) — the older ECDSA scheme whose nonce-reuse failures Ed25519 avoids by design.
- [crypto-lab-curve-lens](https://systemslibrarian.github.io/crypto-lab-curve-lens/) — the elliptic-curve group law and Curve25519 arithmetic underneath Ed25519.
- [crypto-lab-curve448](https://systemslibrarian.github.io/crypto-lab-curve448/) — the higher-security Ed448 sibling (RFC 8032).
- [crypto-lab-rsa-forge](https://systemslibrarian.github.io/crypto-lab-rsa-forge/) — the RSA signature family Ed25519 is often compared against.
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — threshold Ed25519 signing (FROST, RFC 9591).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## LMS Ledger

- **slug**: `crypto-lab-lms-ledger`
- **repo**: https://github.com/systemslibrarian/crypto-lab-lms-ledger
- **live**: https://systemslibrarian.github.io/crypto-lab-lms-ledger/
- **commit_sha**: `0c3f7aefeb59ec1e305a8fe9ea90964c64624907` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | HASHING & KDFS  ·  **level**: intermediate  ·  **--accent**: #3ddc84
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: LMS Ledger  — _read from src/main.ts_

**Subtitle**: LMS/HSS &middot; NIST SP 800-208 &middot; RFC 8554  — _read from src/main.ts_

**Description**: Build an LMS Merkle tree of one-time LM-OTS keys and sign message by message, watching the nextIndex state advance so each leaf is spent exactly once.  — _read from src/main.ts_

**Why it matters**: Stateful hash-based signatures resist quantum attacks, but their security hinges on never reusing a leaf. Lose the state and reuse one key, and an attacker recovers hidden hash-chain values to forge signatures on messages you never signed.  — _read from src/main.ts_

**Card copy**: LMS/HSS stateful hash-based signatures (NIST SP 800-208) — LM-OTS key state grid, one-time key reuse attack with real forgery demo, and CNSA 2.0 firmware signing context.

**Chips**: LMS · HSS · LM-OTS · NIST SP 800-208

**Implements**: LMS `src/lms.ts:268`, SHA-256 `src/lms.ts:70`, Winternitz `src/lms.ts:229`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Merkle tree `src/lms.ts:4`

**References**: Dilithium, Dragonfly, ECDSA, Ed25519, Falcon, Lamport, ML-DSA, Merkle tree, NTRU, RSA, SHAKE, SLH-DSA, SPHINCS+, XMSS

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `ePrint 2026/2624` — first seen README.md:87 (1×)
- `ePrint 2026/2635` — first seen README.md:88 (1×)
- `eprint.iacr.org/2026/2624` — first seen README.md:87 (2×)
- `eprint.iacr.org/2026/2635` — first seen README.md:88 (2×)
- `FIPS 204` — first seen README.md:74 (2×)
- `FIPS 205` — first seen README.md:35 (5×)
- `NIST SP 800-208` — first seen README.md:5 (10×)
- `RFC 8032` — first seen src/main.ts:234 (1×)
- `RFC 8554` — first seen README.md:5 (34×)
- `rfc8554` — first seen README.md:7 (4×)
- `SP 800-208` — first seen src/main.ts:234 (4×)

**README — What Can Go Wrong**:

```text
- **State rollback:** restoring a backup overwrites `nextIndex` with a smaller value, causing leaf reuse. Hardware counters that cannot be decremented are the correct mitigation.
- **Concurrent signing:** two processes reading the same `nextIndex` simultaneously use the same leaf. State must be updated atomically — database transactions or file locks are required.
- **Tree exhaustion without a successor:** when `nextIndex` reaches `2^h`, the tree is exhausted and new signatures cannot be produced. HSS mitigates this by pre-generating successor trees.
- **Leaf reuse enabling forgery:** reusing any leaf leaks LM-OTS chain values at multiple depths and compromises the tree. The number of reuses needed to forge an *arbitrary* message depends on the Winternitz parameter (a few reuses at w=8; roughly eight at the demo's w=4); a real deployment must reuse a leaf *zero* times, so a single rollback or clone already breaks the guarantee.
- **Parameter set confusion:** mixing LMS and LMOTS parameter identifiers produces signatures that appear valid but are computed incorrectly. Always serialize parameter identifiers with signatures per RFC 8554.
```

**Claims tested** (e2e/claims.spec.ts, 1 test(s)):

- `signature-size claims are derived from the material the verifier consumes` — e2e/claims.spec.ts:3
    - :6 `toContainText` expected _no expected value_ _(none)_
    - :9 `toContainText` expected _no expected value_ _(none)_
    - :15 `toContainText` expected `'2336 bytes'` _(literal)_
    - :16 `toContainText` expected `'32-byte C randomizer + 67×32 OTS + 5×32 auth path'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-lms-ledger

## What It Is

crypto-lab-lms-ledger teaches the Leighton-Micali Signature scheme (LMS) and its hierarchical variant (HSS), documented in NIST SP 800-208 and RFC 8554, using real hash-chain and Merkle operations with the HSS adaptations described below. LMS is a stateful hash-based signature scheme built on LM-OTS (Winternitz) one-time signatures organized into a Merkle tree. Each leaf in the tree is a one-time keypair — reusing a leaf leaks chain values at multiple depths, and after enough reuses an attacker can forge signatures under the same public key. The state (which leaf to use next) must be maintained persistently and protected against rollback. LMS avoids number-theoretic hardness assumptions and is designed for post-quantum use. RFC 8554 §9 explains the role of the per-signature randomizer `C`; this does not make second-preimage resistance alone a complete concrete security argument for every hash construction, message distribution or aggregate-use budget. See the research qualifications below.

The LMS/HSS here is a real implementation, not a mock: signing and verification run the RFC 8554 hash-chain, Winternitz checksum, Merkle node numbering, and per-signature randomizer `C`. The LM-OTS core is validated byte-for-byte against **RFC 8554 Appendix F Test Case 1** (`test/rfc8554-vectors.test.ts`), and the HSS demo computes two-level signing and actual child-tree rollover — each signature is checked against the lab's own custom transcript. That is not a full RFC/NIST conformance or interoperability result.

Implementation: Vite + TypeScript, vanilla CSS, no runtime npm packages (crypto via `crypto.subtle`). Interactive parameters: LMS-SHA256-M32-H5 + LMOTS-SHA256-N32-W4 (n=32 bytes, h=5 tree height, w=4 Winternitz, p=67 chain elements). The interactive HSS demo (Section D) runs a live two-level instance sized h1=3, h2=3 (8 × 8 = 64 signatures) so roll-over and exhaustion are observable in seconds; production deployments size h1/h2 for the device lifetime (see below).

## HSS teaching adaptation and verification scope

The root signs a **60-byte custom child-key message**: the tree-slot index,
16-byte identifier, 32-byte root and raw four-byte height/Winternitz values.
RFC 8554 sections 5.3 and 6 instead sign the **56-byte serialized LMS child
public key**: LMS typecode, LM-OTS typecode, identifier and root. This lab retains
its custom transcript even when h=5 and w=4; it does not export interoperable HSS
wire formats. The interactive h1=h2=3 trees are also outside the RFC's parameter
sets. Both are **non-interoperable teaching adaptations**, not NIST conformance.

Real hashing, message signing, altered-message rejection and rollover are
implemented. `test/hss-transcript-scope.test.ts` independently verifies that the
root signature accepts the custom transcript and rejects RFC framing at supported
h=5/w=4. The Appendix F known-answer test validates LM-OTS recovery only; it does
not validate the complete hierarchy, serialization or persistent-state safety.
Use a conforming, audited implementation for deployment; this in-memory teaching
state is not a production signing service. Primary reference:
[RFC 8554 sections 5.3 and 6](https://www.rfc-editor.org/rfc/rfc8554.html#section-5.3).

## When to Use It

- Use LMS/HSS for firmware and software signing when post-quantum security is required and state management is operationally feasible — an HSM with a hardware counter handles state correctly.
- Use HSS with multiple levels when a single LMS tree's capacity (2^h signatures) is insufficient — L=2 with h1=10, h2=10 provides over 1 million signatures (the same two-level construction the demo runs at h1=h2=3).
- Do not use LMS in contexts where state cannot be reliably protected — concurrent signers, backup/restore scenarios, and factory-reset devices all risk catastrophic key reuse.
- Do not use LMS for general-purpose signatures in protocols that require stateless operation — use SPHINCS+ (FIPS 205) instead.
- Do not confuse exhausting the key (using all 2^h leaves) with key compromise — exhaustion is handled gracefully by activating the next HSS tree; reuse is unrecoverable.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-lms-ledger](https://systemslibrarian.github.io/crypto-lab-lms-ledger/)**

Generate a 32-leaf LMS tree, sign messages one at a time, and watch the key state grid update after each signature. Enable "Force Key Reuse" to see the reuse attack in action — each reuse leaks another LM-OTS signature and lowers the attacker's reachable "floor" per chain. Once enough signatures have leaked (around eight at this w=4 parameter set), the demo grinds the randomizer `C` and constructs a forged signature for an arbitrary message that verifies against the real tree root. Section D runs a live two-level HSS, signing and verifying real messages and rolling over to a fresh leaf tree when the current one fills.

## What Can Go Wrong

- **State rollback:** restoring a backup overwrites `nextIndex` with a smaller value, causing leaf reuse. Hardware counters that cannot be decremented are the correct mitigation.
- **Concurrent signing:** two processes reading the same `nextIndex` simultaneously use the same leaf. State must be updated atomically — database transactions or file locks are required.
- **Tree exhaustion without a successor:** when `nextIndex` reaches `2^h`, the tree is exhausted and new signatures cannot be produced. HSS mitigates this by pre-generating successor trees.
- **Leaf reuse enabling forgery:** reusing any leaf leaks LM-OTS chain values at multiple depths and compromises the tree. The number of reuses needed to forge an *arbitrary* message depends on the Winternitz parameter (a few reuses at w=8; roughly eight at the demo's w=4); a real deployment must reuse a leaf *zero* times, so a single rollback or clone already breaks the guarantee.
- **Parameter set confusion:** mixing LMS and LMOTS parameter identifiers produces signatures that appear valid but are computed incorrectly. Always serialize parameter identifiers with signatures per RFC 8554.

## Real-World Usage

- **CNSA 2.0** (NSA, September 2022): designates LMS and XMSS as the required post-quantum signature schemes for software and firmware signing in national security systems, with compliance deadlines from 2025.
- **NIST SP 800-208**: the authoritative standard for LMS and HSS, specifying parameter sets, serialization formats, and state management requirements.
- **UEFI Secure Boot (post-quantum transition)**: LMS is a candidate for next-generation UEFI firmware signing as the industry transitions away from RSA and ECDSA.
- **OpenSSL and Bouncy Castle**: both libraries have implemented LMS/HSS, enabling use in Java and C applications for code signing pipelines.
- **RFC 8554**: the IETF informational RFC documenting the LMS and HSS scheme that NIST SP 800-208 standardizes.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-lms-ledger
cd crypto-lab-lms-ledger
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-lms-xmss](https://systemslibrarian.github.io/crypto-lab-lms-xmss/) — sibling demo of LMS/HSS with a live index-reuse forgery.
- [crypto-lab-sphincs-ledger](https://systemslibrarian.github.io/crypto-lab-sphincs-ledger/) — stateless hash-based signatures (FIPS 205).
- [crypto-lab-merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) — Merkle tree construction and inclusion proofs.
- [crypto-lab-dilithium-seal](https://systemslibrarian.github.io/crypto-lab-dilithium-seal/) — ML-DSA lattice-based signatures (FIPS 204).
- [crypto-lab-falcon-seal](https://systemslibrarian.github.io/crypto-lab-falcon-seal/) — NTRU lattice signatures.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Hash construction and aggregate-use research

Reliable state is necessary but not sufficient. Deployment choices must identify the exact hash variant and parameter set, message length and accepted format, aggregate signature counts across keys, and the resulting hash-block/hash-call budgets, alongside randomizer generation, domain separation and implementation quality.

- Guo, Cheng, Preneel and Wang, *Provable Security of SHA-256-Based LMS Revisited in the Ideal-Cipher Model*, [ePrint 2026/2624](https://eprint.iacr.org/2026/2624), sections 1.1–1.2: classical ideal-cipher-model bounds depend on aggregate internal-block and hash-call work.
- Strenzke, *A Kelsey–Kohno Attack Variant against SHA-2 Message Digests in HSS/LMS and XMSS*, [ePrint 2026/2635](https://eprint.iacr.org/2026/2635), sections 1.5 and 4: multi-key pooling, message length/format and extremely large resource budgets matter. These attacks exclude SHAKE256 parameter sets; that exclusion is not a general security proof.

These October 2026 preprints are theoretical and attack-model-conditional. They do not establish a practical break, a quantum security bound, or standards withdrawal. They are distinct from this lab's demonstrated leaf-reuse forgery.

```

</details>

---

## Pairing Gate

- **slug**: `crypto-lab-pairing-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-pairing-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-pairing-gate/
- **commit_sha**: `674ba04ace2fff0629a26f72c617decfee24e969` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES  ·  **level**: advanced  ·  **--accent**: #f59e0b
- **MISSING FIELDS**: verification

**Name (H1)**: Pairing Gate  — _read from src/main.ts_

**Subtitle**: BLS Signatures · BLS12-381  — _read from src/main.ts_

**Description**: Generate keypairs, sign and verify with real pairing arithmetic, then watch n signatures aggregate into one whose final equation has two pairing terms after linear-time point addition.  — _read from src/main.ts_

**Why it matters**: Aggregate BLS signatures compress many validator votes into one constant-size signature. The final same-message equation has two pairing terms, while collecting and adding n keys and signatures still costs O(n). That same bilinearity enables the rogue-key attack and its proof-of-possession defense.  — _read from src/main.ts_

**Card copy**: BLS12-381 bilinear pairing — BLS signature sign/verify with real @noble/curves arithmetic, signature aggregation visualizer (up to 100 signers → 1 proof), and rogue key attack demo. Powers Ethereum 2.0 and Zcash.

**Chips**: BLS12-381 · BLS Signatures · Signature Aggregation · Rogue Key Attack

**Implements**: BLS signatures `src/main.ts:23`, BLS12-381 `src/main.ts:23`, Pairing `src/main.ts:127`

**Attacks shown**: Discrete log `src/main.ts:245`

**Comment-only (named in code comments, not executed)**: EC point arithmetic `src/main.ts:1136`

**References**: Boneh-Franklin IBE, Diffie-Hellman, EC point arithmetic, ECDSA, Ed25519, EdDSA, FROST, Groth16, Grover's algorithm, Hash-to-curve, P-256, RSA, SHA-256, Schnorr, Shor's algorithm

**Standards body**: IETF

**Implementation**: @noble

**Spec citations, exactly as written**:

- `draft-irtf-cfrg-bls-signature-07` — first seen README.md:58 (1×)
- `RFC 9380` — first seen README.md:34 (3×)
- `rfc9380` — first seen README.md:55 (1×)

**README — What Can Go Wrong**:

```text
- **Rogue key attack:** without Proof of Possession, an attacker who registers a maliciously computed public key can forge an aggregate signature that passes verification using only their own private key.
- **Subgroup membership checks:** points presented as G1 or G2 elements must be checked for subgroup membership before use — skipping this check can allow small-subgroup attacks.
- **Domain separation and mixed messages:** protocols must use the ciphersuite's exact domain-separation tags. Same-message aggregation has a two-term final equation after O(n) additions; distinct-message aggregate verification requires a term per message.
- **Implementation bugs in hash-to-curve:** RFC 9380 specifies the hash-to-curve procedure; non-compliant implementations produce points that may not match across libraries.
- **Post-quantum exposure:** BLS12-381 has no quantum resistance. Once a CRQC exists, any deployed key becomes forgeable and previously recorded signatures lose non-repudiation; migrating to a post-quantum signature scheme is the only mitigation.
```

**Claims tested** (e2e/claims.spec.ts, 6 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:17
    - :17 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:20
    - :20 `toBeEnabled` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:22
    - :22 `toBeVisible` expected _no expected value_ _(none)_
- `tampering shows the altered signature, not the original` — e2e/claims.spec.ts:26
    - :28 `toBeVisible` expected _no expected value_ _(none)_
    - :30 `toBeEnabled` expected _no expected value_ _(none)_
    - :34 `toBeVisible` expected _no expected value_ _(none)_
    - :36 `expect` expected _no expected value_ _(none)_
    - :41 `toBe` expected `before` _(expression)_
    - :42 `toContainText` expected `'ALTERED'` _(literal)_
- `a failed verification actually highlights where the G_T values differ` — e2e/claims.spec.ts:45
    - :49 `toBeVisible` expected _no expected value_ _(none)_
    - :52 `toBeVisible` expected _no expected value_ _(none)_
    - :53 `toContainText` expected `'different G_T element'` _(literal)_
    - :58 `toHaveCount` expected `1` _(literal)_
    - :59 `toHaveCount` expected `1` _(literal)_
    - :64 `toBe` expected `''` _(literal)_
    - :65 `toBe` expected `r` _(expression)_
    - :71 `toBe` expected `rightText` _(expression)_
- `an untampered signature still verifies and claims no difference` — e2e/claims.spec.ts:74
    - :76 `toBeVisible` expected _no expected value_ _(none)_
    - :78 `toBeEnabled` expected _no expected value_ _(none)_
    - :82 `toBeVisible` expected _no expected value_ _(none)_
    - :83 `toContainText` expected `'same'` _(literal)_
    - :84 `toHaveCount` expected `0` _(literal)_

**Mutation records** (2 file(s)):

- `mutation-evidence.json` (12713 bytes)
- `scripts/claim-mutations.mjs` (7560 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-pairing-gate

## What It Is

crypto-lab-pairing-gate implements the minimal-signature-size Proof-of-Possession BLS ciphersuite over BLS12-381, with 48-byte G1 signatures and 96-byte G2 public keys. A bilinear pairing `e: G1 × G2 → GT` satisfies `e(aP, bQ) = e(P, Q)^(ab)` and makes the signature verification equation possible. For same-message aggregation, collecting n signatures and public keys takes O(n) point additions; the resulting constant-size aggregate has a final verification equation with two pairing terms. The original BLS construction proves signature security from a computational Diffie-Hellman variant in a random-oracle model, while the current CFRG specification remains an Internet-Draft. BLS12-381 is a type-3 pairing, so G1 and G2 are distinct and are not interchangeable even though separately specified ciphersuites can reverse their roles. It targets roughly 128-bit classical security and has no post-quantum security because Shor's algorithm breaks the underlying discrete-log problem.

## When to Use It

- Use BLS signatures when you need to aggregate many signatures on the same message into one — consensus protocols, threshold schemes, and multi-party attestations.
- Use BLS12-381 specifically when your application requires pairing-based ZK-SNARK verification (Groth16) alongside signature operations.
- Do not use BLS when signature verification speed is critical for a single signer — Ed25519 is significantly faster for individual signatures.
- Do not use naive BLS aggregation without Proof of Possession or equivalent rogue key protection — the rogue key attack allows an attacker to forge aggregate signatures.
- Do not use BLS for post-quantum security — BLS12-381 has no post-quantum security. Shor's algorithm recovers the private key from any public key in polynomial time on a cryptographically relevant quantum computer (CRQC).
- Do NOT use this implementation in production — it is a browser teaching demo; use a vetted BLS library (e.g. blst) for real deployments.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-pairing-gate](https://systemslibrarian.github.io/crypto-lab-pairing-gate/)**

Generate BLS keypairs, sign messages, and verify signatures using real BLS12-381 arithmetic via `@noble/curves`. The exhibits, in order:

1. **Bilinearity playground** — two scalar sliders `a` and `b`. Watch four different-looking computations `e(aP, bQ)`, `e(P, Q)^ab`, `e(abP, Q)`, and `e(P, abQ)` all land on the *same* G_T element, computed live, with a full 576-byte reveal so the equality is airtight rather than a matching prefix. This is the load-bearing property the rest of the demo rests on, made draggable.
2. **What is a pairing** — the three groups (G₁/G₂/G_T), the three defining properties, and a "gory details" expandable covering the field tower, embedding degree, and Ate pairing for readers who want the machinery.
3. **Sign / verify** — generate a keypair, sign an arbitrary message, and verify the pairing equation `e(σ, G₂) = e(H, PK)` by showing both sides as full byte strings that literally match (with a full 576-byte reveal and a byte-count match indicator). A plain-language *hash-to-curve* aside explains how a message becomes a point on the curve. Tamper with the signature to watch the check fail, first differing nibble highlighted.
4. **Aggregation** — a signer-count slider (2–100) generates all keypairs and signatures, then a mechanism diagram shows the O(n) point-addition sums σ_agg and PK_agg before the final two-term pairing equation. Changing the count or message retires in-flight work so an old result cannot regain authority.
5. **Rogue-key attack & defenses** — a live naive-aggregation forgery, then a proof under the CFRG draft's distinct `BLS_POP_…` domain rejects the rogue key, plus message augmentation and hash-to-scalar defenses.
6. **Where pairings appear** — production deployments (Ethereum, Zcash, DFINITY, Filecoin) and a size comparison table, with a note explaining the short-signature variant tradeoff (48-byte signatures in G₁, 96-byte keys in G₂).

## What Can Go Wrong

- **Rogue key attack:** without Proof of Possession, an attacker who registers a maliciously computed public key can forge an aggregate signature that passes verification using only their own private key.
- **Subgroup membership checks:** points presented as G1 or G2 elements must be checked for subgroup membership before use — skipping this check can allow small-subgroup attacks.
- **Domain separation and mixed messages:** protocols must use the ciphersuite's exact domain-separation tags. Same-message aggregation has a two-term final equation after O(n) additions; distinct-message aggregate verification requires a term per message.
- **Implementation bugs in hash-to-curve:** RFC 9380 specifies the hash-to-curve procedure; non-compliant implementations produce points that may not match across libraries.
- **Post-quantum exposure:** BLS12-381 has no quantum resistance. Once a CRQC exists, any deployed key becomes forgeable and previously recorded signatures lose non-repudiation; migrating to a post-quantum signature scheme is the only mitigation.

## Real-World Usage

- **Ethereum proof-of-stake consensus:** validators are assigned to committees and each active validator attests once per epoch. Ethereum uses 48-byte G1 public keys and 96-byte G2 signatures, the opposite orientation from this demo; its deposit signature covers a domain-separated `DepositMessage`, not the CFRG draft's `PopProve(PK)` input.
- **Zcash Sapling:** BLS12-381 was designed for Zcash's Groth16 zk-SNARK verifier, where pairing equations check proof validity.
- **Internet Computer (DFINITY):** uses BLS threshold signatures for chain-key cryptography, enabling deterministic randomness beacons and cross-subnet message authentication.
- **Filecoin:** aggregates miner message signatures using BLS to reduce on-chain transaction size.
- **Ethereum EIP-2537:** adds BLS12-381 precompiles to the EVM, enabling smart contracts to verify BLS signatures and pairings on-chain.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-pairing-gate
cd crypto-lab-pairing-gate
npm ci
npm run dev
`​``

`npm test` checks the BLS12-381 G1 hash-to-curve coordinates against
[RFC 9380 Appendix J.9.1](https://www.rfc-editor.org/rfc/rfc9380.html#appendix-J.9.1)
using that vector's stated suite and DST. It also checks the exact, distinct
signature and proof-of-possession domains from
[draft-irtf-cfrg-bls-signature-07](https://datatracker.ietf.org/doc/draft-irtf-cfrg-bls-signature/),
the pairing identity, aggregate verification, rogue-key rejection, input bounds,
and stale-operation retirement. CI additionally enforces workflow policy,
mutation evidence, the production build, and browser accessibility and behavior.

## Related Demos

- [crypto-lab-ibe-gate](https://systemslibrarian.github.io/crypto-lab-ibe-gate/) — Boneh-Franklin identity-based encryption over the same BLS12-381 pairing.
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — threshold signatures (FROST over Ed25519).
- [crypto-lab-ed25519-forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) — Ed25519 EdDSA, the fast single-signer alternative to BLS.
- [crypto-lab-zk-proof-lab](https://systemslibrarian.github.io/crypto-lab-zk-proof-lab/) — Groth16 and Schnorr ZK proofs.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Blind Sign

- **slug**: `crypto-lab-blind-sign`
- **repo**: https://github.com/systemslibrarian/crypto-lab-blind-sign
- **live**: https://systemslibrarian.github.io/crypto-lab-blind-sign/
- **commit_sha**: `ffe4ce8ace05ad4417ce606048d7b0632c071d57` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | PRIVACY  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, mutations, verification

**Name (H1)**: Blind Signatures  — _read from index.html_

**Subtitle**: Chaum blinding · RFC 9474 blind RSA · Schnorr blind  — _read from index.html_

**Description**: Blind, sign, unblind, and verify across RSA and elliptic-curve schemes to obtain a valid signature the signer never sees in the clear.  — _read from index.html_

**Why it matters**: Blinding helps keep issuance unlinkable to later use, while signature checks reject altered tokens. Those checks alone do not prove security against every forgery attack. The signer authorizes what it cannot read.  — _read from index.html_

**Card copy**: Chaum RSA blind signatures and Schnorr EC blind signatures — anonymous e-cash, private voting, and unlinkability proofs. The signer signs without seeing the message.

**Chips**: Chaum RSA · Schnorr EC · e-Cash · Unlinkability

**Implements**: Ed25519 `src/ecblind.ts:1`, RSA `src/blind.ts:39`, RSA-PSS `src/rfc9474.ts:83`, Schnorr `src/main.ts:1199`, SHA-256 `src/blind.ts:265`, SHA-384 `src/rfc9474.ts:53`, SHA-512 `src/ecblind.ts:117`

**Attacks shown**: Discrete log `src/main.ts:481`, Signature malleability `src/main.ts:290`

**References**: BBS+, BLS signatures, EC point arithmetic, EdDSA, Pairing, Privacy Pass, RSA-OAEP, ristretto255

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `ePrint 2026/2131` — first seen README.md:24 (3×)
- `ePrint 2026/2276` — first seen README.md:32 (2×)
- `eprint.iacr.org/2020/945` — first seen src/main.ts:435 (2×)
- `eprint.iacr.org/2026/2131` — first seen README.md:24 (3×)
- `eprint.iacr.org/2026/2276` — first seen README.md:32 (2×)
- `EUROCRYPT 2021` — first seen src/main.ts:436 (2×)
- `RFC 8017` — first seen src/rfc9474.ts:52 (2×)
- `RFC 9474` — first seen README.md:4 (26×)
- `RFC8032` — first seen src/ecblind-vector.ts:2 (2×)
- `rfc9474` — first seen index.html:164 (41×)

**README — What Can Go Wrong**:

```text
- Blinding factor reuse: reusing the same `r` across requests can create correlation across blinded messages and erode unlinkability.
- Invalid blinding factor math: if `gcd(r, n) != 1`, unblinding fails and careless recovery logic can leak protocol state or cause signature rejection loops.
- Weak challenge binding in Schnorr blind signatures: if the challenge hash is not bound to commitment, public key, and message together, signature malleability or forgery avenues appear.
- Unsafely signing arbitrary blinded payloads: issuers that do not enforce issuance policy can become signature or token laundering oracles.
- Temporary raw-RSA oracle access: even a policy-compliant blind-RSA issuer signs blinded inputs that can be used for the 2026 delayed-target forgery attack; PSS on the final message does not eliminate this separate attack model.
- Broken double-spend controls in e-cash deployments: if serial uniqueness tracking is missing or inconsistent, the same blind-signed coin can be redeemed multiple times.
```

**Claims tested** (e2e/claims.spec.ts, 15 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:39
    - :39 `expect` expected _no expected value_ _(none)_
- `toy mode: every printed integer is re-derivable from the published toy key, and the two ways of computing s agree` — e2e/claims.spec.ts:54
    - :61 `toBeEnabled` expected _no expected value_ _(none)_
    - :64 `expect` expected _no expected value_ _(none)_
    - :67 `toBeEnabled` expected _no expected value_ _(none)_
    - :69 `toBeEnabled` expected _no expected value_ _(none)_
    - :71 `toHaveText` expected `'VALID'` _(literal)_
    - :78 `expect` expected _no expected value_ _(none)_
    - :82 `toBe` expected `61n * 53n` _(expression)_
    - :84 `toBe` expected `1n` _(expression)_
    - :100 `expect` expected _no expected value_ _(none)_
    - :101 `expect` expected _no expected value_ _(none)_
    - :102 `expect` expected _no expected value_ _(none)_
    - :103 `expect` expected _no expected value_ _(none)_
    - :104 `toBe` expected `1n` _(expression)_
    - :107 `toBe` expected `modPow(r, e, n)` _(expression)_
    - :108 `toBe` expected `(m * re_) % n` _(expression)_
    - :109 `toBe` expected `1n` _(expression)_
    - :110 `expect` expected _no expected value_ _(none)_
    - :111 `expect` expected _no expected value_ _(none)_
    - :112 `toBe` expected `modPow(blinded, d, n)` _(expression)_
    - :113 `toBe` expected `(sPrime * rInv) % n` _(expression)_
    - :114 `toBe` expected `modPow(s, e, n)` _(expression)_
    - :115 `toBe` expected `m` _(expression)_
    - :119 `toBe` expected `modPow(m, d, n)` _(expression)_
    - :120 `toBe` expected `direct` _(expression)_
    - :121 `expect` expected _no expected value_ _(none)_
    - :122 `toMatch` expected `/equals m \(\d+\)\?\s+→\s+true/` _(regex)_
    - :123 `toBe` expected `m.toString()` _(expression)_
    - :127 `toBe` expected `blinded` _(expression)_
    - :128 `toBe` expected `n` _(expression)_
    - :130 `toEqual` expected `new Set([blinded.toString()])` _(expression)_
    - :133 `toEqual` expected _no expected value_ _(none)_
    - :137 `toHaveText` expected `'Verify complete — signature is valid.'` _(literal)_
- `toy mode: tampering adds one to s, the verifier lands somewhere else, and the verdict is REJECTED` — e2e/claims.spec.ts:140
    - :146 `toBeEnabled` expected _no expected value_ _(none)_
    - :150 `toHaveText` expected `'VALID'` _(literal)_
    - :153 `toHaveText` expected `'REJECTED'` _(literal)_
    - :157 `expect` expected _no expected value_ _(none)_
    - :167 `toBe` expected `(s + 1n) % n` _(expression)_
    - :168 `toBe` expected `modPow(forged, e, n)` _(expression)_
    - :170 `toBe` expected `m` _(expression)_
    - :171 `toBe` expected `m` _(expression)_
    - :172 `toMatch` expected `/verify: \(s\+1\)\^e mod n[^\n]*→\s+false/` _(regex)_
    - :173 `toHaveText` expected _no expected value_ _(none)_
- `real mode: the signer only ever holds blinded values, and the recovered signature verifies` — e2e/claims.spec.ts:182
    - :187 `toBeChecked` expected _no expected value_ _(none)_
    - :190 `toBeEnabled` expected `{ timeout: 60000 }` _(expression)_
    - :196 `toBe` expected `3` _(literal)_
    - :201 `toBe` expected _no expected value_ _(none)_
    - :204 `expect` expected _no expected value_ _(none)_
    - :205 `expect` expected _no expected value_ _(none)_
    - :208 `toBeEnabled` expected _no expected value_ _(none)_
    - :215 `toBe` expected `mPrimeDisp` _(expression)_
    - :216 `expect` expected _no expected value_ _(none)_
    - :217 `expect` expected _no expected value_ _(none)_
    - :220 `toBeEnabled` expected _no expected value_ _(none)_
    - :224 `toBe` expected `sPrimeDisp` _(expression)_
    - :226 `expect` expected _no expected value_ _(none)_
    - :229 `toHaveText` expected `'VALID'` _(literal)_
    - :231 `toMatch` expected `/verify: s\^e mod n == m\s+→\s+true/` _(regex)_
    - :232 `toHaveText` expected `'Verify complete — signature is valid.'` _(literal)_
    - :236 `toHaveText` expected `'REJECTED'` _(literal)_
    - :243 `toBe` expected `sDisp.slice(0, 14)` _(expression)_
    - :244 `toBe` expected `BigInt('0x${sDisp.slice(-12)}') + 1n` _(expression)_
    - :245 `toMatch` expected `/verify: \(s\+1\)\^e mod n == m\s+→\s+false/` _(regex)_
    - :246 `toHaveText` expected _no expected value_ _(none)_
- `the envelope walks idle → wrapped → stamped → unwrapped, and the step buttons unlock in order` — e2e/claims.spec.ts:251
    - :259 `toHaveAttribute` expected `'data-stage', 'idle'` _(expression)_
    - :261 `toBeDisabled` expected _no expected value_ _(none)_
    - :265 `toBeEnabled` expected _no expected value_ _(none)_
    - :267 `toBeDisabled` expected _no expected value_ _(none)_
    - :270 `toBeEnabled` expected _no expected value_ _(none)_
    - :272 `toBeDisabled` expected _no expected value_ _(none)_
    - :275 `toBeEnabled` expected _no expected value_ _(none)_
    - :277 `toBeDisabled` expected _no expected value_ _(none)_
    - :280 `toBeEnabled` expected _no expected value_ _(none)_
    - :281 `toEqual` expected `['wrapped', 'stamped', 'unwrapped']` _(expression)_
    - :285 `toHaveAttribute` expected `'data-stage', 'idle'` _(expression)_
    - :286 `toHaveText` expected `''` _(literal)_
    - :287 `toHaveText` expected `'Click 1 · Blind to start.'` _(literal)_
    - :288 `toHaveText` expected `'Signer has not received a blinded request yet.'` _(literal)_
    - :290 `toBeDisabled` expected _no expected value_ _(none)_
    - :300 `toBeEnabled` expected `{ timeout: 60000 }` _(expression)_
    - :302 `toBeEnabled` expected _no expected value_ _(none)_
    - :304 `toBeEnabled` expected `{ timeout: 60000 }` _(expression)_
- `security boundary: blind RSA explains the 2026 raw-oracle attack in the RFC and comparison exhibits` — e2e/claims.spec.ts:307
    - :311 `toBeVisible` expected _no expected value_ _(none)_
    - :312 `toContainText` expected `'1024-bit'` _(literal)_
    - :313 `toContainText` expected `'extrapolations, not demonstrated forgeries'` _(literal)_
    - :314 `toBeVisible` expected _no expected value_ _(none)_
    - :318 `toContainText` expected `'delayed-target attack'` _(literal)_
    - :319 `toHaveText` expected `/^Yes/` _(regex)_
- `RFC 9474 randomized: the browser natively accepts the finalized signature, and the issuer saw none of the padding` — e2e/claims.spec.ts:322
    - :330 `toBeEnabled` expected `{ timeout: 60000 }` _(expression)_
    - :333 `expect` expected _no expected value_ _(none)_
    - :336 `toBeEnabled` expected _no expected value_ _(none)_
    - :338 `toBeEnabled` expected `{ timeout: 60000 }` _(expression)_
    - :340 `toHaveText` expected `'VALID'` _(literal)_
    - :341 `toHaveText` expected `'Finalized — natively verified valid.'` _(literal)_
    - :346 `toBe` expected `'RSABSSA-SHA384-PSS-Randomized'` _(literal)_
    - :349 `toBe` expected `'48'` _(literal)_
    - :361 `toMatch` expected `/native crypto\.subtle\.verify \(RSA-PSS\) → true/` _(regex)_
    - :364 `toBe` expected _no expected value_ _(none)_
    - :368 `expect` expected _no expected value_ _(none)_
    - :378 `expect` expected _no expected value_ _(none)_
    - :381 `toBe` expected `blindSig` _(expression)_
- `RFC 9474: the tamper flips exactly one bit of the real signature and the native verifier rejects it` — e2e/claims.spec.ts:384
    - :391 `toHaveText` expected `'VALID'` _(literal)_
    - :400 `toHaveText` expected `'REJECTED', { timeout: 30000 }` _(expression)_
    - :409 `toBe` expected `finalSig.slice(0, -1)` _(expression)_
    - :410 `toBe` expected `parseInt(finalSig.slice(-1), 16) ^ 1` _(expression)_
    - :411 `toMatch` expected `/native crypto\.subtle\.verify → false/` _(regex)_
    - :412 `expect` expected _no expected value_ _(none)_
    - :413 `toHaveText` expected `'Tampered signature rejected by the native verifier.'` _(literal)_
- `RFC 9474 deterministic: no prefix, zero-length salt, still natively valid — and switching variant resets the run` — e2e/claims.spec.ts:416
    - :423 `toHaveText` expected `'VALID'` _(literal)_
    - :427 `toHaveText` expected `''` _(literal)_
    - :428 `toHaveText` expected _no expected value_ _(none)_
    - :432 `toBeDisabled` expected _no expected value_ _(none)_
    - :436 `toHaveText` expected `'VALID'` _(literal)_
    - :438 `toBe` expected `'RSABSSA-SHA384-PSSZERO-Deterministic'` _(literal)_
    - :439 `toMatch` expected `/^prefix\s+= \(none — deterministic\)/m` _(regex)_
    - :440 `toBe` expected `'0'` _(literal)_
    - :441 `toMatch` expected `/^salt \(0-byte\)\s+= \(empty\)/m` _(regex)_
    - :442 `toMatch` expected `/native crypto\.subtle\.verify \(RSA-PSS\) → true/` _(regex)_
- `e-cash: the merchant runs two independent checks — a double spend fails on freshness while the signature is still valid` — e2e/claims.spec.ts:449
    - :457 `toBeEnabled` expected `{ timeout: 60000 }` _(expression)_
    - :462 `toHaveText` expected _no expected value_ _(none)_
    - :465 `toHaveText` expected `''` _(literal)_
    - :468 `toHaveText` expected `'ACCEPTED'` _(literal)_
    - :470 `expect` expected _no expected value_ _(none)_
    - :471 `toMatch` expected `/signature valid\?\s+true\s+\(bank's key authorizes it\)/` _(regex)_
    - :472 `toMatch` expected `/serial unseen\?\s+true\s+\(no double spend\)/` _(regex)_
    - :473 `toHaveText` expected `'Merchant accepted the coin.'` _(literal)_
    - :476 `toHaveText` expected `'DOUBLE SPEND'` _(literal)_
    - :478 `expect` expected _no expected value_ _(none)_
    - :480 `toMatch` expected `/signature valid\?\s+true\s+\(still a genuine coin!\)/` _(regex)_
    - :481 `toMatch` expected `/serial unseen\?\s+false\s+\(already in the spent registry\)/` _(regex)_
    - :482 `toHaveText` expected _no expected value_ _(none)_
    - :488 `toHaveText` expected `'REJECTED'` _(literal)_
    - :491 `toBe` expected `serial` _(expression)_
    - :492 `toMatch` expected `/signature valid\?\s+false\s+\(no bank key → cannot forge\)/` _(regex)_
    - :493 `expect` expected _no expected value_ _(none)_
    - :494 `toHaveText` expected `'Forged coin rejected — signature does not verify.'` _(literal)_
    - :500 `toContainText` expected `serial, { timeout: 60000 }` _(expression)_
    - :502 `toBe` expected `serial` _(expression)_
    - :503 `toHaveText` expected `''` _(literal)_
    - :505 `toHaveText` expected `'ACCEPTED'` _(literal)_
    - :507 `expect` expected _no expected value_ _(none)_
    - :508 `toMatch` expected `/signature valid\?\s+true\s+\(bank's key authorizes it\)/` _(regex)_
    - :509 `toMatch` expected `/serial unseen\?\s+true\s+\(no double spend\)/` _(regex)_
- `voting: the chosen option is what gets counted, one token votes once, and a forged token is rejected` — e2e/claims.spec.ts:516
    - :524 `toBeEnabled` expected `{ timeout: 60000 }` _(expression)_
    - :529 `toHaveText` expected `'COUNTED'` _(literal)_
    - :531 `toHaveText` expected `'Anonymous vote for Option B accepted.'` _(literal)_
    - :533 `expect` expected _no expected value_ _(none)_
    - :534 `toMatch` expected `/token signature valid\?\s+true\s+\(eligible voter\)/` _(regex)_
    - :535 `toMatch` expected `/token unused\?\s+true\s+\(one person, one vote\)/` _(regex)_
    - :539 `toHaveText` expected `'ALREADY VOTED'` _(literal)_
    - :540 `toHaveText` expected `'Vote rejected: token already used.'` _(literal)_
    - :543 `toMatch` expected `/token signature valid\?\s+true/` _(regex)_
    - :544 `toMatch` expected `/token unused\?\s+false/` _(regex)_
    - :547 `toHaveText` expected `'REJECTED'` _(literal)_
    - :550 `toBe` expected `token` _(expression)_
    - :551 `toMatch` expected `/token signature valid\?\s+false\s+\(no authority key → cannot forge\)/` _(regex)_
    - :552 `expect` expected _no expected value_ _(none)_
    - :553 `toHaveText` expected _no expected value_ _(none)_
- `credentials: the same signature that validates over18 fails on over21 — the signature is bound to the exact claim` — e2e/claims.spec.ts:562
    - :570 `toBeEnabled` expected `{ timeout: 60000 }` _(expression)_
    - :573 `toHaveText` expected `'VALID'` _(literal)_
    - :575 `expect` expected _no expected value_ _(none)_
    - :576 `toMatch` expected `/issuer signature valid\?\s+true/` _(regex)_
    - :577 `toHaveText` expected `'Verifier accepted the claim.'` _(literal)_
    - :580 `toHaveText` expected `'REJECTED'` _(literal)_
    - :584 `expect` expected _no expected value_ _(none)_
    - :585 `toMatch` expected `/issuer signature valid\?\s+false\s+\(signature is bound to the signed claim\)/` _(regex)_
    - :586 `expect` expected _no expected value_ _(none)_
    - :587 `toHaveText` expected _no expected value_ _(none)_
- `blind Schnorr: the curve equation verifies, and adding one to the scalar breaks it` — e2e/claims.spec.ts:596
    - :601 `toHaveText` expected `'VALID', { timeout: 30000 }` _(expression)_
    - :602 `toHaveText` expected _no expected value_ _(none)_
    - :608 `expect` expected _no expected value_ _(none)_
    - :610 `toMatch` expected `/verify: s·G == R' \+ c·P\s+→\s+true/` _(regex)_
    - :621 `toBe` expected `beta` _(expression)_
    - :622 `toBe` expected `r0` _(expression)_
    - :623 `toBe` expected `c` _(expression)_
    - :624 `toBe` expected `s0` _(expression)_
    - :625 `expect` expected _no expected value_ _(none)_
    - :628 `toHaveText` expected `'REJECTED'` _(literal)_
    - :633 `toBe` expected `s.slice(0, 12)` _(expression)_
    - :634 `toBe` expected `BigInt('0x${s.slice(-12)}') + 1n` _(expression)_
    - :635 `toMatch` expected `/verify: \(s\+1\)·G == R' \+ c·P\s+→\s+false/` _(regex)_
    - :636 `expect` expected _no expected value_ _(none)_
    - :637 `toHaveText` expected `'Tampered Schnorr signature rejected.'` _(literal)_
- `comparison: both engines really run, the table cells agree with the log, and the timings are measured` — e2e/claims.spec.ts:644
    - :651 `toHaveText` expected `'—'` _(literal)_
    - :652 `toHaveText` expected `'—'` _(literal)_
    - :655 `toHaveText` expected `'valid', { timeout: 60000 }` _(expression)_
    - :656 `toHaveText` expected `'valid'` _(literal)_
    - :661 `toMatch` expected `/^\d+\.\d{2} ms$/` _(regex)_
    - :662 `toMatch` expected `/^\d+\.\d{2} ms$/` _(regex)_
    - :663 `expect` expected _no expected value_ _(none)_
    - :664 `expect` expected _no expected value_ _(none)_
    - :669 `toBe` expected `'true'` _(literal)_
    - :670 `toBe` expected `'true'` _(literal)_
- `all seven exhibits are reachable, exactly one at a time, by click and by arrow key` — e2e/claims.spec.ts:677
    - :680 `toHaveCount` expected `7` _(literal)_
    - :683 `toEqual` expected `['protocol', 'rfc9474', 'cash', 'voting', 'credentials', 'schnorr', 'compare']` _(expression)_
    - :687 `toHaveClass` expected `/\bactive\b/` _(regex)_
    - :689 `toBe` expected `1` _(literal)_
    - :690 `toBe` expected `1` _(literal)_
    - :691 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :693 `toBe` expected `1` _(literal)_
    - :698 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :700 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :702 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :704 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-blind-sign

## What It Is
This browser lab demonstrates blind signature workflows across three engines: a textbook RSA blind signature (`BigInt` modular arithmetic for blinding/unblinding), the standardized **RFC 9474 blind RSA** construction (full EMSA-PSS encoding with SHA-384, finalized signatures verified by the browser's native `crypto.subtle.verify`), and a Schnorr blind signature flow over `Ed25519`. The demo walks the full blind, sign, unblind, and verify lifecycle one real step at a time, with concrete transcripts for requester and signer views, an explicit "why blinding works" derivation, an optional small-numbers mode that runs the same primitives over a readable toy RSA key so learners can watch the blinding factor cancel, and an envelope animation of the blind/stamp/unblind mechanism. It also includes applied exhibits for Chaum-style e-cash, anonymous voting tokens, and anonymous attribute credentials in which the merchant, ballot box, and verifier each perform a genuine signature check against the issuer's persistent public key. Blind signatures solve the problem of obtaining a valid signature on a message without revealing the message to the signer at issuance time. The code shows issuance unlinkability and concrete signature-verification checks; rejecting the demonstrated tampering does not establish security against every forgery attack.

The RFC 9474 engine is checked **byte-for-byte against the official Appendix A test vectors** for both the `RSABSSA-SHA384-PSS-Randomized` and `RSABSSA-SHA384-PSSZERO-Deterministic` variants. (Note: RFC 9474 §4.2 writes `EMSA-PSS-ENCODE(msg, bit_len(n))`, but the official vectors and the `RSASSA-PSS-VERIFY` it invokes require `emBits = bit_len(n) - 1`, which is what this implementation uses.)

## When to Use It
- Use blind signatures for e-cash issuance when a bank must authorize spendable tokens without learning which token a user will later spend.
- Use blind-signed voting tokens when an authority must enforce one-person-one-token while staying unable to link token issuance to a specific ballot.
- Use blind-signed eligibility credentials when an issuer should attest claims like `over18=true` without seeing future verifier presentation context.
- Use blind signatures for anti-abuse access tokens when services need issuer-approved tokens but want separation between issuer logs and redemption logs.
- Do not use blind signatures when accountability and signer-side auditability of exact signed content are mandatory, because the signer intentionally does not see the final message.
- Do NOT treat this as production code — it is a teaching demo and the textbook RSA/Schnorr engines are written for clarity, not for hardened or constant-time deployment.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-blind-sign](https://systemslibrarian.github.io/crypto-lab-blind-sign/)**

The protocol exhibit runs blind → sign → unblind → verify **one real step at a time**: each button executes its own modular arithmetic, the signer view only ever holds blinded values, and a *Tamper & re-verify* action flips one bit of the signature to show verification rejecting it. To build intuition it layers three teaching aids on top of the real math: a **"Why does blinding work?"** callout that walks the homomorphic identity `Sign(m·r^e) = m^d·r` explicitly and shows the blinding factor cancelling under `r^-1`; a **"Small numbers" mode** that runs the identical primitives over a genuine toy RSA key (`n = 61·53 = 3233`, `e = 17`, `d = 2753`) so every value — `m`, `r`, `m·r^e`, `s'`, `s` — is a short integer you can read in full and watch `r` cancel by hand; and an **envelope animation** in which the blinding factor `r` (shown as a colored envelope) seals `m`, the signer applies a `^d` stamp, and the same envelope peels away to reveal the recovered signature. A **"New to RSA?"** disclosure defines `n`, `e`, `d`, and the sign/verify exponentiations before the transcript equations appear. The applied exhibits are cryptographically real, not mocked — the e-cash merchant, ballot box, and credential verifier each call `verifySignature` against the issuer's persistent public key. Every exhibit includes a negative case: altered coins and ballot tokens fail the signature check, a re-spent coin fails the freshness check (no double spend), and an altered credential claim fails because the signature is bound to the exact attribute. The RFC 9474 exhibit adds a **"Why the extra padding?"** note bridging the textbook model to EMSA-PSS with a one-line gloss on SHA-384, MGF1, salt, and the message prefix, followed by the 2026 delayed-target RSA attack model. A dedicated Schnorr-blind (Ed25519) exhibit walks the elliptic-curve variant with its α/β blinding scalars — mapped back to RSA's single `r` as "same idea, different group" — and the RSA vs EC panel reports measured timings for both engines.

## Blind RSA and the 2026 delayed-target attack

[Shea et al., IACR ePrint 2026/2131](https://eprint.iacr.org/2026/2131) demonstrated that temporary access to a raw RSA signing oracle can enable later offline forgery without factoring the public modulus or recovering its private key. Their **1024-bit** experiment used `2^32` oracle queries and 1,380 CPU core-years. Blind RSA exposes the issuer's raw operation on client-chosen blinded integers even though RFC 9474 uses PSS encoding for the finished signature. The authors extrapolate lower security margins for larger keys; they did **not** demonstrate a 2048- or 4096-bit forgery.

This is a delayed-target RSA setting, distinct from the one-more-RSA assumption used in the RFC 9474 proof. The paper does not invalidate that proof, but the proof does not by itself quantify this separate oracle-assisted threat. Ordinary padded RSA-PSS signing without a raw signing oracle is outside the attack model. For an interactive explanation, see [RSA Forge](https://systemslibrarian.github.io/crypto-lab-rsa-forge/#oracle-without-factoring); this lab shows the issuance primitive, not the full-scale attack. The authors suggest shorter issuer-key epochs, larger keys, and eventually protocols with suitable zero-knowledge proofs or post-quantum replacements; these are deployment considerations, not changes to this educational implementation.

## Blind Schnorr concurrency and new research

Exhibit 6 implements the textbook, one-commitment blind Schnorr protocol over Ed25519. It remains vulnerable to ROS attacks under concurrent issuance; the comparison table describes this implementation, not every blind Schnorr variant. Limiting concurrency is not a general production-security guarantee.

[Fuchsbauer, Regen and Sulyok, ePrint 2026/2276](https://eprint.iacr.org/2026/2276) (preprint, September 30, 2026) introduce Schnorr² and Okamoto-Schnorr² with conditional proofs of concurrent one-more unforgeability in the algebraic group and random oracle models. Schnorr² assumes algebraic one-more discrete-logarithm hardness; Okamoto-Schnorr² assumes discrete-logarithm hardness. These different protocols use two signer commitments and a nonlinear response. **Neither variant is implemented here.** This research does not repair the textbook protocol or establish a new standard.

## What Can Go Wrong
- Blinding factor reuse: reusing the same `r` across requests can create correlation across blinded messages and erode unlinkability.
- Invalid blinding factor math: if `gcd(r, n) != 1`, unblinding fails and careless recovery logic can leak protocol state or cause signature rejection loops.
- Weak challenge binding in Schnorr blind signatures: if the challenge hash is not bound to commitment, public key, and message together, signature malleability or forgery avenues appear.
- Unsafely signing arbitrary blinded payloads: issuers that do not enforce issuance policy can become signature or token laundering oracles.
- Temporary raw-RSA oracle access: even a policy-compliant blind-RSA issuer signs blinded inputs that can be used for the 2026 delayed-target forgery attack; PSS on the final message does not eliminate this separate attack model.
- Broken double-spend controls in e-cash deployments: if serial uniqueness tracking is missing or inconsistent, the same blind-signed coin can be redeemed multiple times.

## Real-World Usage
- GNU Taler: uses Chaumian blind signatures so exchanges issue digital cash without learning which specific coins customers later spend.
- Cashu: implements Chaumian e-cash mints where blinded outputs are signed by the mint and later redeemed with payer privacy.
- Privacy Pass (blind RSA deployments): uses RFC 9474 blinded token issuance so anti-bot issuers can sign tokens without seeing the final redeemable token value.
- Apple Private Access Tokens: uses the Privacy Pass / RFC 9474 model with blinded token issuance to separate attestation issuance from redemption identity.
- RFC 9474 (RSA Blind Signatures): the IETF standard implemented in the "RFC 9474 Blind RSA" exhibit, defining the EMSA-PSS-based blind RSA variants used above.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-blind-sign
cd crypto-lab-blind-sign
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-ring-sign](https://systemslibrarian.github.io/crypto-lab-ring-sign/) — another privacy-preserving signature, providing signer anonymity and unlinkability via ring signatures.
- [crypto-lab-rsa-forge](https://systemslibrarian.github.io/crypto-lab-rsa-forge/) — the RSA primitive (OAEP/PSS/PKCS#1) underlying the RSA blind signature construction.
- [crypto-lab-ed25519-forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) — the EdDSA/Schnorr signature scheme that the Schnorr-blind exhibit builds on.
- [crypto-lab-pairing-gate](https://systemslibrarian.github.io/crypto-lab-pairing-gate/) — BLS signatures, another advanced signature primitive with aggregation.
- [crypto-lab-psi-gate](https://systemslibrarian.github.io/crypto-lab-psi-gate/) — privacy-preserving protocol over ristretto255 in the same unlinkability family.

## Tests

Use a supported Node runtime (Node24 is used by CI) and `npm ci` for the locked Noble curves/hashes v2 graph. The custom blind-Schnorr verifier accepts canonical scalars and prime-order points with a nonidentity signer key, contains malformed-input/arithmetic failures, and has an independently derived fixed-transcript control. These checks do not repair the concurrent ROS limitation described above.
- `npm test` — run the Vitest suite ( textbook RSA and Schnorr correctness/unblinding/tamper-rejection, the toy small-numbers blind signature over a genuine RSA key (`e·d ≡ 1 mod φ(n)`, `s == m^d`), the modular-arithmetic helpers, and RFC 9474 byte-exact conformance against the official Appendix A vectors plus native WebCrypto round-trips for both variants)
- `npm run test:a11y` — run the Playwright suite against the production build ( zero axe-core WCAG 2.1 A/AA violations in both themes, plus a **claims suite** (`e2e/claims.spec.ts`) asserting each exhibit's headline verdict against values the page itself computed. The small-numbers exhibit publishes its whole key, so every integer it prints — `r^e`, `m·r^e`, `(m')^d`, `r^-1`, `s'·r^-1`, `s^e` — is re-derived independently and checked, including that the unblinded `s` equals the separately computed `m^d`; the real 2048-bit exhibit is checked for the property it teaches, that the signer's panel holds the blinded message and never the message representative, the blinding factor or the final signature; both tamper actions are checked to be genuine plus-one / one-bit edits of the real signature that the verifier then rejects; the RFC 9474 exhibit is checked to be accepted by the browser's own `crypto.subtle.verify` and rejected after a one-bit flip, in both variants; and the e-cash, voting and credential exhibits are checked to fail on the *right* one of their two independent checks — a double spend on freshness while the signature is still valid, a forged coin on the signature before freshness is reached, and an upgraded claim on a signature bound to the exact attribute)
- `npm run build` — type-check and produce the production bundle

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## PKI Chain

- **slug**: `crypto-lab-pki-chain`
- **repo**: https://github.com/systemslibrarian/crypto-lab-pki-chain
- **live**: https://systemslibrarian.github.io/crypto-lab-pki-chain/
- **commit_sha**: `7d0c0dc4f266fdbc30cd8bb454b839e0b963445f` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `03ebe5d5098eb1d2e4442704c7b647dea1555612`
- **read_from**: working tree (clean)
- **category**: SIGNATURES | PROTOCOLS  ·  **level**: advanced  ·  **--accent**: #df8b2f
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: PKI Chain  — _read from src/main.ts_

**Subtitle**: Certificate Chain Trust &middot; X.509 / RFC 5280 semantics  — _read from src/main.ts_

**Description**: Walk a Root → Intermediate → Leaf chain link-by-link, tampering, revoking, and compromising CAs while live crypto.subtle  — _read from src/main.ts_

**Why it matters**: Publicly trusted HTTPS depends on correct certificate issuance as well as strong cryptography. A stolen CA key or hijacked domain-validation path can put a valid certificate in an attacker&rsquo;s hands. See the real-world example  — _read from src/main.ts_

**Card copy**: Model certificate-chain trust, CA compromise, signed revocation evidence and stale OCSP responses under fail-open versus strict policy. Check Certificate Transparency proofs and compare reference ML-DSA sizes.

**Chips**: X.509 · Certificate Transparency · CA Compromise · ML-DSA Sizes Only

**Implements**: ECDSA `src/ct.ts:324`, Merkle tree `src/ct.ts:156`, P-256 `src/ct.ts:359`, SHA-256 `src/ct.ts:110`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: ML-DSA `src/main.ts:180`

**References**: Dilithium, Kerberos, ML-DSA, Shor's algorithm

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 204` — first seen README.md:27 (6×)
- `RFC 5280` — first seen README.md:86 (9×)
- `RFC 6960` — first seen README.md:29 (7×)
- `RFC 6962` — first seen README.md:26 (19×)
- `RFC 8446` — first seen README.md:53 (1×)
- `RFC 8555` — first seen README.md:62 (1×)
- `RFC 9525` — first seen README.md:53 (1×)
- `rfc5280` — first seen README.md:86 (1×)
- `rfc6960` — first seen README.md:55 (2×)
- `rfc8446` — first seen README.md:53 (1×)
- `rfc9525` — first seen README.md:53 (1×)

**README — What Can Go Wrong**:

```text
- **Trust anchor mismatch** — different operating systems and browsers ship different root CA bundles; a certificate trusted by Chrome may be rejected by an embedded application that pins its own trust store.
- **CA compromise blast radius** — key theft does not invalidate existing signatures or reveal descendant private keys. Policy can distrust an issuer’s subtree, but an unconstrained still-trusted issuer can also mint accepted impersonations of names served by a sibling. Signed name constraints must be enforced by the client. This lab implements a DNS-only subset, not complete X.509 path validation.
- **CRL and OCSP freshness** — signed status is only useful when it is current and from an authorized source. A valid signature on an old status does not establish current status. This lab demonstrates the difference with a directly issuer-signed JSON OCSP toy; it does not parse or authenticate CRL files.
- **CT log split-view attack** — without verifying consistency proofs between two tree states, a misbehaving log can show different views to different monitors, hiding a fraudulent certificate from detection.
- **Signature algorithm confusion** — ECDSA P-256 signatures are tied to the `SHA-256` hash; using a different hash parameter at verification time silently fails rather than throwing in some WebCrypto implementations.
```

**Claims tested** (e2e/claims.spec.ts, 21 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:40
    - :40 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:54
    - :54 `toBeVisible` expected _no expected value_ _(none)_
- `the normal chain visibly checks intermediate dates along with root and leaf` — e2e/claims.spec.ts:57
    - :61 `toBe` expected `true` _(expression)_
    - :86 `expect` expected _no expected value_ _(none)_
    - :94 `expect` expected _no expected value_ _(none)_
    - :95 `expect` expected _no expected value_ _(none)_
    - :96 `toHaveClass` expected `/\bunknown\b/` _(regex)_
    - :98 `toBe` expected `'Overall: PASS — all ${rendered.length} checks passed.'` _(expression)_
    - :99 `toHaveClass` expected `/\bpass\b/` _(regex)_
    - :102 `expect` expected _no expected value_ _(none)_
    - :103 `toHaveClass` expected `/\bfail\b/` _(regex)_
    - :104 `toBe` expected `rendered.length` _(expression)_
    - :134 `toHaveLength` expected `3` _(literal)_
    - :137 `expect` expected _no expected value_ _(none)_
    - :139 `expect` expected _no expected value_ _(none)_
    - :150 `expect` expected _no expected value_ _(none)_
    - :157 `toHaveText` expected _no expected value_ _(none)_
- `the well-formed chain distinguishes valid signatures from absent revocation evidence` — e2e/claims.spec.ts:164
    - :169 `toBe` expected `true` _(expression)_
    - :171 `toBe` expected `'missing'` _(literal)_
    - :172 `toHaveClass` expected `/\bunknown\b/` _(regex)_
    - :185 `expect` expected _no expected value_ _(none)_
    - :187 `toHaveClass` expected `/trust-flow-on/` _(regex)_
- `tampering the ${node} certificate genuinely fails its signature, by name` — e2e/claims.spec.ts:207
    - :218 `expect` expected _no expected value_ _(none)_
    - :219 `toEqual` expected `TAMPER_CASCADE[node].slice().sort()` _(expression)_
    - :222 `expect` expected _no expected value_ _(none)_
    - :229 `expect` expected _no expected value_ _(none)_
    - :231 `toHaveClass` expected `/fail/` _(regex)_
    - :232 `toHaveClass` expected `/flipped/` _(regex)_
    - :236 `toBeVisible` expected _no expected value_ _(none)_
    - :237 `toHaveClass` expected `/fail/` _(regex)_
    - :238 `toContainText` expected `'flipped to FAIL'` _(literal)_
    - :239 `toHaveAttribute` expected `'href', '#step-${node}'` _(expression)_
    - :240 `toHaveText` expected `SIG_STEP[node]` _(expression)_
    - :242 `toHaveCount` expected `1` _(literal)_
    - :250 `toBe` expected `true` _(expression)_
    - :251 `toHaveCount` expected `0` _(literal)_
- `CRL revocation genuinely fails the chain and names the revocation check` — e2e/claims.spec.ts:255
    - :263 `toEqual` expected `['CRL revocation check']` _(expression)_
    - :267 `toBe` expected `true` _(expression)_
    - :269 `expect` expected _no expected value_ _(none)_
    - :273 `toBe` expected `true` _(expression)_
- `OCSP revocation genuinely fails the chain and names the revocation check` — e2e/claims.spec.ts:276
    - :283 `toEqual` expected `['OCSP revocation check']` _(expression)_
    - :284 `toContainText` expected `'revoked'` _(literal)_
    - :288 `toBe` expected `true` _(expression)_
- `signed OCSP evidence stays distinct from the fail-open or strict policy choice` — e2e/claims.spec.ts:291
    - :295 `toBe` expected `'missing'` _(literal)_
    - :296 `toEqual` expected `['Revocation evidence policy']` _(expression)_
    - :300 `toBe` expected `true` _(expression)_
    - :301 `toBe` expected `'good'` _(literal)_
    - :302 `toContainText` expected `'ACCEPTED'` _(literal)_
    - :306 `toBe` expected `'stale'` _(literal)_
    - :307 `toEqual` expected `['Revocation evidence policy']` _(expression)_
    - :308 `toContainText` expected `'Leaf=stale'` _(literal)_
    - :312 `toBe` expected `'unauthorized'` _(literal)_
    - :313 `toEqual` expected `['OCSP revocation check', 'Revocation evidence policy']` _(expression)_
    - :317 `toBe` expected `false` _(expression)_
    - :318 `toBe` expected `'unauthorized'` _(literal)_
    - :319 `toContainText` expected `'FAIL'` _(literal)_
    - :323 `toBe` expected `true` _(expression)_
    - :324 `toBe` expected `'stale'` _(literal)_
    - :325 `toContainText` expected `'fail-open policy'` _(literal)_
    - :326 `toContainText` expected `'RFC 6960'` _(literal)_
- `an unknown trust anchor rejects an otherwise perfect chain` — e2e/claims.spec.ts:329
    - :334 `toEqual` expected `['Trust anchor check']` _(expression)_
    - :337 `toBe` expected `true` _(expression)_
    - :344 `toBe` expected `true` _(expression)_
- `revocation and tamper stack without either verdict swallowing the other` — e2e/claims.spec.ts:348
    - :358 `toEqual` expected `['CRL revocation check', 'Leaf signature', 'Trust anchor check'].sort()` _(expression)_
    - :361 `expect` expected _no expected value_ _(none)_
- `CA compromise drops trust down the subtree while the signatures stay valid` — e2e/claims.spec.ts:368
    - :375 `toEqual` expected `[false, true, true]` _(expression)_
    - :377 `toBe` expected `true` _(expression)_
    - :378 `toContainText` expected `'signature still verifies'` _(literal)_
    - :383 `toEqual` expected `[true, true, true]` _(expression)_
    - :384 `toBe` expected `true` _(expression)_
    - :388 `toBe` expected `true` _(expression)_
- `regression: Exhibit 4 must not claim a tampered signature verifies` — e2e/claims.spec.ts:391
    - :401 `toBe` expected `false` _(expression)_
    - :405 `expect` expected _no expected value_ _(none)_
    - :408 `expect` expected _no expected value_ _(none)_
    - :411 `expect` expected _no expected value_ _(none)_
    - :412 `expect` expected _no expected value_ _(none)_
- `Exhibit 4 reads honestly in all four tamper x compromise states` — e2e/claims.spec.ts:422
    - :437 `toMatch` expected _no expected value_ _(none)_
    - :441 `toMatch` expected _no expected value_ _(none)_
    - :449 `toBe` expected _no expected value_ _(none)_
    - :452 `toContainText` expected `'all signatures verify and all links are trusted'` _(literal)_
    - :453 `toHaveClass` expected `/is-compromise/` _(regex)_
    - :459 `expect` expected _no expected value_ _(none)_
    - :460 `toBe` expected _no expected value_ _(none)_
    - :463 `toContainText` expected `'No CA is compromised'` _(literal)_
    - :464 `toContainText` expected `'signature fails'` _(literal)_
    - :470 `expect` expected _no expected value_ _(none)_
    - :471 `toEqual` expected `[false, true, true]` _(expression)_
    - :472 `toContainText` expected `'Both failure modes are running at once'` _(literal)_
    - :478 `toBe` expected `true` _(expression)_
    - :479 `toEqual` expected `[false, true, true]` _(expression)_
    - :480 `toContainText` expected `'every signature still verifies'` _(literal)_
    - :481 `toHaveClass` expected `/is-compromise/` _(regex)_
- `regression: no tamper x compromise combination lets the panels contradict` — e2e/claims.spec.ts:491
    - :501 `expect` expected _no expected value_ _(none)_
    - :510 `expect` expected _no expected value_ _(none)_
    - :520 `toBe` expected `true` _(expression)_
- `regression: Reset lab is reachable after any change, and restores everything` — e2e/claims.spec.ts:525
    - :533 `toBeDisabled` expected _no expected value_ _(none)_
    - :536 `toBeEnabled` expected _no expected value_ _(none)_
    - :538 `toContainText` expected `'Log size: 0'` _(literal)_
    - :539 `toBeDisabled` expected _no expected value_ _(none)_
    - :542 `toBeEnabled` expected _no expected value_ _(none)_
    - :544 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :547 `toBeEnabled` expected _no expected value_ _(none)_
    - :549 `toHaveAttribute` expected _no expected value_ _(none)_
    - :564 `toBeEnabled` expected _no expected value_ _(none)_
    - :567 `toBe` expected `true` _(expression)_
    - :568 `toContainText` expected `'Log size: 0'` _(literal)_
    - :569 `toBeChecked` expected _no expected value_ _(none)_
    - :570 `toBeChecked` expected _no expected value_ _(none)_
    - :571 `toHaveValue` expected `'none'` _(literal)_
    - :572 `toHaveValue` expected `'allow-unknown'` _(literal)_
    - :573 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :574 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :575 `toContainText` expected `'No suspicious issuance observed'` _(literal)_
    - :576 `toBeDisabled` expected _no expected value_ _(none)_
- `inclusion proofs are O(log n) and rebuild exactly the stored root` — e2e/claims.spec.ts:581
    - :584 `toContainText` expected `'Log size: 4'` _(literal)_
    - :587 `toHaveCount` expected `4` _(literal)_
    - :594 `toHaveCount` expected `1` _(literal)_
    - :595 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :597 `toBe` expected `2` _(literal)_
    - :600 `toContainText` expected `'(${siblings} total)'` _(expression)_
    - :604 `toHaveLength` expected `2` _(literal)_
    - :605 `toBe` expected `hashes[1]` _(expression)_
    - :606 `toHaveText` expected `'='` _(literal)_
    - :607 `toHaveClass` expected `/pass/` _(regex)_
    - :608 `toContainText` expected _no expected value_ _(none)_
    - :611 `toContainText` expected `'leaf ${i} is provably in the log'` _(expression)_
    - :616 `expect` expected _no expected value_ _(none)_
- `consistency proofs verify, and misissuance retires them` — e2e/claims.spec.ts:619
    - :625 `toContainText` expected `'old=2 → new=3'` _(literal)_
    - :626 `toContainText` expected `'verify=true'` _(literal)_
    - :627 `toHaveText` expected `'true'` _(literal)_
    - :633 `toContainText` expected `'Log size: 4'` _(literal)_
    - :634 `toHaveText` expected `'Consistency proof: Not generated.'` _(literal)_
    - :635 `toHaveCount` expected `0` _(literal)_
    - :639 `toHaveClass` expected `/fail/` _(regex)_
    - :640 `toContainText` expected `'CN=Compromised DigiNotar CA'` _(literal)_
- `CT controls unlock as the log grows rather than staying dead` — e2e/claims.spec.ts:643
    - :645 `toBeDisabled` expected _no expected value_ _(none)_
    - :646 `toBeDisabled` expected _no expected value_ _(none)_
    - :649 `toBeEnabled` expected _no expected value_ _(none)_
    - :650 `toBeDisabled` expected _no expected value_ _(none)_
    - :653 `toBeEnabled` expected _no expected value_ _(none)_
    - :657 `toBeDisabled` expected _no expected value_ _(none)_
    - :658 `toBeDisabled` expected _no expected value_ _(none)_
- `the PQ bars are drawn to the scale they claim, from the live signature` — e2e/claims.spec.ts:663
    - :680 `toHaveLength` expected `3` _(literal)_
    - :684 `expect` expected _no expected value_ _(none)_
    - :686 `toBe` expected _no expected value_ _(none)_
    - :691 `toBe` expected _no expected value_ _(none)_
    - :698 `toBe` expected _no expected value_ _(none)_
    - :702 `toBe` expected `100` _(literal)_
    - :706 `toHaveText` expected `'ML-DSA-44'` _(literal)_
    - :707 `toContainText` expected `'FIPS 204 reference'` _(literal)_
    - :709 `toHaveText` expected `'ECDSA P-256'` _(literal)_
    - :710 `toContainText` expected `'measured live'` _(literal)_
- `no element carrying the hidden attribute is actually rendered` — e2e/claims.spec.ts:715
    - :735 `toEqual` expected `[]` _(expression)_
- `sibling key integrity differs from identity impersonation` — e2e/claims.spec.ts:739
    - :744 `toContainText` expected `'Root-signed name constraint: REJECTS'` _(literal)_
    - :745 `toContainText` expected `'Forged leaf signature: VERIFIED'` _(literal)_
    - :746 `toContainText` expected `'B’s legitimate identity: ACCEPTED'` _(literal)_
    - :748 `toContainText` expected `'Previous results retired'` _(literal)_
    - :749 `toHaveCount` expected `0` _(literal)_
    - :751 `toContainText` expected `'Attacker identity: ACCEPTED — IMPERSONATION'` _(literal)_
    - :752 `toContainText` expected `'Chain checks: PASS'` _(literal)_
    - :753 `toHaveCount` expected `1` _(literal)_
    - :754 `toContainText` expected `'An intact sibling key does not prevent impersonation'` _(literal)_
    - :756 `toHaveText` expected `'Not run.'` _(literal)_
    - :757 `toHaveValue` expected `'constrained'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-pki-chain

## What It Is

This browser-native lab demonstrates Public Key Infrastructure (PKI) certificate chain trust using real WebCrypto ECDSA P-256 signatures. A Root CA signs an Intermediate CA certificate, which in turn signs a Leaf certificate; every signature is verified in-browser using `crypto.subtle`. The demo also covers Certificate Transparency (CT) — an append-only Merkle log where certificates are submitted and inclusion proofs are generated and verified using SHA-256. The security model is hierarchical trust: all authenticity flows from one trusted root anchor, and any forged or revoked link invalidates all descendants.

## When to Use It

- **Learning TLS certificate chain validation** — the demo shows how browsers verify each link before trusting a server's identity.
- **Auditing a custom certificate validator** — the tamper and revocation controls expose exactly which checks a validator must pass.
- **Understanding CT monitoring** — useful when building a certificate log monitor or implementing CT client-side verification.
- **Studying CA compromise blast radius** — the intermediate and root compromise scenarios separate valid signatures, policy distrust, stolen keys, and identities an attacker can impersonate.
- When you need peer-to-peer trust without a central authority, prefer web-of-trust or decentralized PKI (e.g., DANE); hierarchical PKI is the wrong model for that.
- Do NOT treat this as a production PKI or certificate validator — it is a browser teaching demo, not a hardened CA or TLS stack.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-pki-chain](https://systemslibrarian.github.io/crypto-lab-pki-chain/)**

The demo provides six interactive exhibits:

1. **The Chain** — inspect the Root → Intermediate → Leaf certificates; selecting a link plays a short **sign / verify** flow showing the issuer's *private* key signing the subject's fields and the issuer's *public* key verifying, making the sign-with-private / verify-with-public asymmetry concrete.
2. **Chain Validation** — real WebCrypto verification of every link. The **Tamper / Repair** buttons toggle a single signed field so you can flip a link between PASS and FAIL; a **cause → effect** panel shows the exact bytes appended to the signed payload and anchor-links to the specific validation step those bytes broke. Revocation evidence is shown separately from the relying-party decision: missing, unknown, and stale results are never green evidence even when the selected fail-open policy accepts the chain. A supplied response with an invalid signer is rejected under either policy. Choose strict policy to require current authenticated good evidence for both non-root certificates.
3. **Trust Stores** — the same cryptographically valid chain accepted or rejected depending on Browser / OS / Application trust roots.
4. **CA Compromise** — mark a CA as compromised and watch its subtree fall. A per-link contrast table shows that **signatures still verify** (the math is untouched) while the affected links are **distrusted by policy** — the opposite of the tamper case, where a signature genuinely fails. A second experiment builds two sibling intermediates and actually signs a certificate for B’s hostname with A’s stolen key. Both the legitimate B path and the forged A path validate without a name constraint; a root-signed DNS constraint on A blocks the forgery while preserving legitimate issuance. See [architecture details](docs/sibling-compromise.md).
5. **Certificate Transparency** — submit certificates to a simulated append-only log and see the **actual RFC 6962 Merkle tree drawn as a node diagram**. Clicking a leaf (or *Inclusion Proof*) highlights the target leaf, lights up exactly the `log₂(n)` audit-path sibling hashes needed to rebuild the root, dims the rest, and shows the recomputed root next to the log's stored root so `verify=true` reads as *these two hashes match*. Consistency proofs and misissuance monitoring run on the same live log.
6. **PQ Migration** — compare classical P-256, ML-DSA, and hybrid post-quantum signature footprints drawn to scale, with each bar tagged **measured** (computed live from this lab's chain) or **reference** (FIPS 204 spec value).

A **Reset lab** button restores every scenario to its defaults, and **CRL** / **OCSP** checkboxes simulate leaf revocation. Exhibit 2 also compares no response, current issuer-signed good responses, an authentic but stale leaf response, and a response signed by the wrong key. The signatures cover fixed-order JSON using WebCrypto ECDSA P-256; these are not RFC 6960 DER messages or a production OCSP client. The response scenario covers both leaf and intermediate certificates; the CRL and revoked status checkboxes remain unsigned teaching inputs. The default fail-open choice illustrates acceptance without positive evidence, not verified non-revocation.

The Merkle log is implemented to RFC 6962 exactly — leaves prefixed with `0x00`, interior nodes with `0x01`, and trees split at the largest power of two with no lone-node duplication — so inclusion and consistency proofs are the same compact `O(log n)` artifacts a real CT log produces, not a recomputation over the whole log.

## What Can Go Wrong

- **Trust anchor mismatch** — different operating systems and browsers ship different root CA bundles; a certificate trusted by Chrome may be rejected by an embedded application that pins its own trust store.
- **CA compromise blast radius** — key theft does not invalidate existing signatures or reveal descendant private keys. Policy can distrust an issuer’s subtree, but an unconstrained still-trusted issuer can also mint accepted impersonations of names served by a sibling. Signed name constraints must be enforced by the client. This lab implements a DNS-only subset, not complete X.509 path validation.
- **CRL and OCSP freshness** — signed status is only useful when it is current and from an authorized source. A valid signature on an old status does not establish current status. This lab demonstrates the difference with a directly issuer-signed JSON OCSP toy; it does not parse or authenticate CRL files.
- **CT log split-view attack** — without verifying consistency proofs between two tree states, a misbehaving log can show different views to different monitors, hiding a fraudulent certificate from detection.
- **Signature algorithm confusion** — ECDSA P-256 signatures are tied to the `SHA-256` hash; using a different hash parameter at verification time silently fails rather than throwing in some WebCrypto implementations.

## Real-World Usage

### Certificate issuance: where trust can fail

The [case study near the top of the live lab](https://systemslibrarian.github.io/crypto-lab-pki-chain/#certificate-issuance) connects certificate validation to unauthorized issuance. A client must validate the requested hostname and certificate path, and the server must prove possession of the matching private key. If an attacker obtains an accepted certificate for the target hostname and controls its matching key, intercepted or redirected connections can authenticate the attacker even though the legitimate server's key remains secret.

On October 6, 2026, Google reported that hijacks of the `.gh`, `.sl`, and `.as` registries enabled unauthorized certificates for domains belonging to Google and other organizations. Its report did not attribute the incident to compromised Google systems or wrongdoing by the issuing CAs. The case illustrates how compromised domain-control evidence can undermine otherwise valid signatures. CT monitoring can expose unexpected issuance; revocation and client-side blocking are separate response mechanisms. The lab's stolen-CA-key experiment illustrates a different route to impersonation; it does not reproduce these registry hijacks.

Sources:

- [Dan Goodin, Ars Technica: Hackers obtain counterfeit TLS certificates for Google and other large services (October 6, 2026)](https://arstechnica.com/security/2026/10/hackers-obtain-counterfeit-tls-certificates-for-google-and-other-large-services/).
- [Chrome Secure Web and Networking Team: Chrome's Response to Recent ccTLD Registry Hijacks (October 6, 2026)](https://blog.google/security/chromes-response-to-recent-cctld-registry-hijacks/) — primary incident report.
- [RFC 8446 §4.4.3](https://www.rfc-editor.org/rfc/rfc8446.html#section-4.4.3) — TLS proof of private-key possession; [RFC 9525 §6](https://www.rfc-editor.org/rfc/rfc9525.html#section-6) — service-identity verification.
- [How CT works](https://certificate.transparency.dev/howctworks/) — public logs and monitoring.
- [RFC 6960 §§2.2, 2.4 and 4.2.2.1–4.2.2.2 (June 2013)](https://www.rfc-editor.org/rfc/rfc6960) — OCSP good/revoked/unknown, authorized responders and response freshness. A signed response from the direct issuer is one permitted authority case; the lab does not model delegated responder certificate authorization.

### Where these mechanisms are used

- **Let's Encrypt** — issues certificates using ECDSA P-256 chains and submits every certificate to at least two CT logs as required by the CA/Browser Forum Baseline Requirements.
- **Google Chrome** — has enforced CT inclusion for all publicly trusted TLS certificates since April 2018; connections to sites with certificates not logged in a trusted CT log are rejected.
- **Apple platforms** — Safari and iOS enforce CT policy requiring certificates to include SCTs from at least two approved logs before the TLS handshake is accepted.
- **ACME protocol (RFC 8555)** — the automated certificate issuance protocol used by Let's Encrypt and other CAs encodes the Root → Intermediate → Leaf chain model directly in its order and finalization flow.
- **Mozilla NSS / Firefox** — maintains an independent root CA trust store (distinct from the OS store), demonstrating exactly the trust-store divergence shown in Exhibit 3.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-pki-chain
cd crypto-lab-pki-chain
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) — SHA-256 Merkle trees and inclusion proofs, the data structure behind Certificate Transparency.
- [crypto-lab-web-of-trust](https://systemslibrarian.github.io/crypto-lab-web-of-trust/) — the decentralized PGP trust-graph alternative to hierarchical CA trust.
- [crypto-lab-dilithium-seal](https://systemslibrarian.github.io/crypto-lab-dilithium-seal/) — ML-DSA signatures, the post-quantum option compared against P-256 in this chain.
- [crypto-lab-pq-rotation](https://systemslibrarian.github.io/crypto-lab-pq-rotation/) — hybrid X.509 certificates and the operational PKI migration to post-quantum signatures.
- [crypto-lab-kerberos](https://systemslibrarian.github.io/crypto-lab-kerberos/) — an alternative authentication model based on a trusted ticket-granting authority rather than certificate chains.

## Tests

A cryptography lab should prove its own crypto, so the math is covered by an executable test suite (`src/pki.test.ts`, `src/ct.test.ts`) that runs in CI before every deploy:

- **Chain validation** — a well-formed chain with the default fail-open policy is accepted but its missing revocation evidence is marked inconclusive; tampering any signed field breaks that link's signature; an unknown trust anchor is rejected.
- **Intermediate validity** — genuinely root-signed expired and not-yet-valid intermediates fail the core validator while their signatures and the root/leaf dates still pass. Inclusive `notBefore`/`notAfter` boundaries and a currently valid intermediate pass; a reversed interval fails. All three certificates use one validation instant, with an explicit intermediate date step ([RFC 5280 §6.1.3(a)(2)](https://www.rfc-editor.org/rfc/rfc5280.html#section-6.1.3)). This remains the lab's simplified JSON certificate model, not a complete RFC 5280 implementation.
- **Narrow-screen validation** — normal and tampered states fit 320px, 380px and desktop viewports. The signature/trust table retains its columns in a focusable horizontal scroll region; scope identifiers can wrap instead of widening the page.
- **Revocation** — CRL and OCSP revocation each reject the chain. Tests separate missing evidence, unsigned toy good status, current issuer-signed good, signed-but-stale good, and a wrong signer under fail-open and strict policies. Browser checks confirm the learner sees evidence status and policy verdict separately.
- **CA compromise** — root compromise distrusts the whole subtree; intermediate compromise spares the root.
- **RFC 6962 Merkle proofs** — inclusion and consistency proofs verify for every leaf and every `old < new` size up to eight, stay `O(log n)` in size, and are rejected when any root or proof node is corrupted.
- **Drawable tree fidelity** — the tree rendered in Exhibit 5 recomputes to the same root as the log, and the sibling hashes it highlights on the audit path are exactly the RFC 6962 proof hashes — so the visualization can never light up a fabricated path.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*


## Publishing requests

`npm run deploy` requests the existing `pages.yml` workflow at `main`.
The workflow retains its full type, unit, build and browser gates. A successful
request is not evidence of publication; inspect the run and actual public site.
Failed requests retain their nonzero exit status.

```

</details>

---

## Ring Sign

- **slug**: `crypto-lab-ring-sign`
- **repo**: https://github.com/systemslibrarian/crypto-lab-ring-sign
- **live**: https://systemslibrarian.github.io/crypto-lab-ring-sign/
- **commit_sha**: `e0d69f090f86b599637f6a141cd4c941f5a8eabb` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | PRIVACY  ·  **level**: intermediate  ·  **--accent**: #5ce0b6
- **MISSING FIELDS**: mutations

**Name (H1)**: Ring Signatures  — _read from src/main.ts_

**Subtitle**: LSAG · key-image linkable · vs. group signatures  — _read from src/main.ts_

**Description**: Sign a message as one of several ring members and watch the verifier confirm the signature closes without learning which member signed — then reuse a key to expose the linkable key image and contrast it with an openable group signature.  — _read from src/main.ts_

**Why it matters**: Ring signatures give Monero-style spend privacy: membership is provable, the signer stays hidden. Key images stop double-spends without breaking anonymity, and group signatures show the opposite trade — anonymity a manager can revoke.  — _read from src/main.ts_

**Card copy**: LSAG ring signatures — key image linkability, double-spend detection, group signatures with manager opening, and Monero transaction privacy. Sign as one-of-many without revealing which.

**Chips**: LSAG · Key Image · Group Signatures · Monero

**Implements**: ECDSA `src/group.ts:52`, Ed25519 `src/ring.ts:431`, Hash-to-curve `src/ring.ts:168`, P-256 `src/group.ts:89`, SHA-256 `src/group.ts:53`, SHA-512 `src/ring.ts:146`

**Attacks shown**: _none derived_

**References**: BBS+, BLS signatures, Bulletproofs, Direct Anonymous Attestation, EC point arithmetic, EdDSA, FROST, Pairing, Shamir secret sharing

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `ASIACRYPT 2001` — first seen src/main.ts:1100 (1×)
- `ePrint 2004/027` — first seen src/main.ts:1101 (1×)
- `ePrint 2019/654` — first seen src/main.ts:1102 (1×)
- `eprint.iacr.org/2004/027` — first seen src/main.ts:1101 (1×)
- `eprint.iacr.org/2019/654` — first seen src/main.ts:1102 (1×)
- `RFC 9380` — first seen src/ring.ts:162 (1×)

**Stated limitations (page)**:

- _(caveat, src/main.ts)_ Teaching honesty: this exhibit sends each member's P-256 public key in the clear inside every signature, so two signatures from the same member are trivially linkable and only the credential-to-identity mapping is hidden. A production scheme (e.g. BBS+ / randomizable credentials) hides the member key itself, making even repeat signatures unlinkable to everyone but the manager. Read this as a model of the accountability property, not of full unlinkability.
- _(caveat, src/main.ts)_ Careful with the word "unconditional". LSAG's signer ambiguity is computational, not information-theoretic: the proof reduces to the DDH assumption on the curve in the random-oracle model. An adversary with unbounded computing power, or a break in DDH on edwards25519, could identify the signer. Some ring signatures really are unconditional — the original Rivest-Shamir-Tauman construction is unconditionally signer-ambiguous. LSAG trades that away to buy linkability: the key image is a deterministic function of the signer's secret, so signer ambiguity can only be computational. "No opener exists" and "anonymity holds against any adversary" are different claims; only the first is true here.

**README — What Can Go Wrong**:

```text
- Reused signer secret in multiple ring spends: the key image repeats, which breaks unlinkability for that signer and exposes a double-spend attempt.
- Invalid challenge-chain arithmetic: if any challenge or response is computed against the wrong ring member ordering, verification fails because the chain no longer closes at `c0`.
- Weak or malformed curve points: accepting small-order or non-torsion-free points can break security assumptions for Edwards-curve signature verification.
- Mis-bound group credentials: if the verifier does not ensure the presented member public key matches the manager-issued credential, a forged identity binding can slip through.
- Oversold anonymity set: a large nominal ring does not guarantee strong privacy if decoy selection is poor or the application leaks metadata outside the signature itself.
```

**Claims tested** (e2e/claims.spec.ts, 21 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:73
    - :73 `toBeVisible` expected `{ timeout: 20_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:78
    - :78 `toHaveCount` expected `size` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:120
    - :120 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:121
    - :121 `toHaveCount` expected `0` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:125
    - :125 `toEqual` expected `[]` _(expression)_
- `a fresh signature closes its own chain, and the badge follows the chain` — e2e/claims.spec.ts:128
    - :129 `toHaveText` expected `'Verification: no signature yet'` _(literal)_
    - :130 `toHaveCount` expected `0` _(literal)_
    - :138 `expect` expected _no expected value_ _(none)_
    - :139 `toMatch` expected `CHAIN_VALUE` _(expression)_
    - :140 `toBe` expected `chain[0]` _(expression)_
    - :142 `toHaveText` expected `/chain closed: c.* == c0/` _(regex)_
    - :143 `toHaveClass` expected `/chain-badge-ok/` _(regex)_
    - :144 `toHaveText` expected `'Verification: valid ring signature'` _(literal)_
    - :148 `toHaveCount` expected `1` _(literal)_
    - :149 `toHaveClass` expected `/ring-edge-closed/` _(regex)_
    - :150 `toHaveClass` expected `/ring-edge-broken/` _(regex)_
    - :153 `toMatch` expected `KEY_IMAGE` _(expression)_
- `every ring-size counter agrees with every other, at three sizes` — e2e/claims.spec.ts:156
    - :163 `toHaveCount` expected `size` _(expression)_
    - :164 `toHaveCount` expected `size` _(expression)_
    - :165 `toHaveCount` expected `size` _(expression)_
    - :166 `toHaveCount` expected `size` _(expression)_
    - :167 `toHaveCount` expected `size` _(expression)_
    - :168 `toHaveLength` expected `size + 1` _(expression)_
    - :172 `toHaveText` expected `String(size)` _(expression)_
    - :173 `toHaveAttribute` expected `'aria-valuenow', String(size)` _(expression)_
    - :174 `expect` expected _no expected value_ _(none)_
    - :180 `toEqual` expected _no expected value_ _(none)_
- `the verifier sees a valid signature that names no signer` — e2e/claims.spec.ts:186
    - :190 `toHaveText` expected `'Verification: valid ring signature'` _(literal)_
    - :193 `toBe` expected `-1` _(literal)_
    - :194 `toBe` expected `-1` _(literal)_
    - :195 `toHaveCount` expected `0` _(literal)_
    - :196 `toHaveText` expected _no expected value_ _(none)_
    - :204 `toHaveLength` expected `5` _(literal)_
    - :206 `toMatch` expected `/^s\d+$/` _(regex)_
    - :207 `toMatch` expected `RESPONSE_VALUE` _(expression)_
    - :208 `toBe` expected `false` _(expression)_
    - :213 `expect` expected _no expected value_ _(none)_
    - :218 `toEqual` expected `['ring', 'c0Hex', 'responsesHex', 'keyImageHex', 'message']` _(expression)_
    - :219 `expect` expected _no expected value_ _(none)_
    - :224 `toBe` expected `3` _(literal)_
    - :225 `toBe` expected `3` _(literal)_
    - :226 `toHaveCount` expected `1` _(literal)_
    - :227 `toHaveCount` expected `1` _(literal)_
    - :228 `toContainText` expected `'The secret closed s3'` _(literal)_
- `the verifier's view withholds every disclosure, not just the ring highlight` — e2e/claims.spec.ts:231
    - :237 `toBe` expected `2` _(literal)_
    - :240 `toHaveText` expected _no expected value_ _(none)_
    - :248 `toBe` expected `-1` _(literal)_
    - :249 `toBe` expected `-1` _(literal)_
    - :250 `toHaveCount` expected `0` _(literal)_
    - :251 `toContainText` expected `'s2'` _(literal)_
    - :252 `expect` expected _no expected value_ _(none)_
    - :255 `toBeDisabled` expected _no expected value_ _(none)_
    - :256 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :257 `toContainText` expected `'A verifier holds no such control'` _(literal)_
    - :261 `toBeEnabled` expected _no expected value_ _(none)_
    - :262 `toBe` expected `2` _(literal)_
    - :263 `toBe` expected `2` _(literal)_
- `the revealed slot follows the signature on screen, not the signer dropdown` — e2e/claims.spec.ts:266
    - :272 `toBe` expected `3` _(literal)_
    - :279 `toBe` expected `3` _(literal)_
    - :280 `toBe` expected `node` _(expression)_
    - :281 `toHaveCount` expected `1` _(literal)_
    - :282 `toHaveCount` expected `1` _(literal)_
    - :283 `toContainText` expected `'The secret closed s3'` _(literal)_
- `flipping one response byte breaks the chain and the page names the cause` — e2e/claims.spec.ts:286
    - :293 `toBeVisible` expected _no expected value_ _(none)_
    - :296 `toHaveLength` expected `clean.length` _(expression)_
    - :299 `toBe` expected `clean[0]` _(expression)_
    - :300 `toBe` expected `false` _(expression)_
    - :301 `toBe` expected `broken[0]` _(expression)_
    - :304 `toHaveText` expected `/chain broken: c.* ≠ c0/` _(regex)_
    - :305 `toHaveClass` expected `/chain-badge-fail/` _(regex)_
    - :306 `toHaveClass` expected `/ring-edge-broken/` _(regex)_
    - :307 `toHaveClass` expected `/ring-edge-closed/` _(regex)_
    - :312 `expect` expected _no expected value_ _(none)_
    - :313 `expect` expected _no expected value_ _(none)_
    - :314 `expect` expected _no expected value_ _(none)_
    - :315 `expect` expected _no expected value_ _(none)_
- `verifying against a modified message is rejected, and the page names the cause` — e2e/claims.spec.ts:318
    - :325 `toBeVisible` expected _no expected value_ _(none)_
    - :330 `toBe` expected `clean[0]` _(expression)_
    - :331 `toBe` expected `false` _(expression)_
    - :332 `toBe` expected `broken[0]` _(expression)_
    - :334 `toHaveText` expected `/chain broken: c.* ≠ c0/` _(regex)_
    - :335 `toHaveClass` expected `/chain-badge-fail/` _(regex)_
    - :336 `toHaveClass` expected `/ring-edge-broken/` _(regex)_
    - :339 `expect` expected _no expected value_ _(none)_
    - :340 `expect` expected _no expected value_ _(none)_
    - :341 `expect` expected _no expected value_ _(none)_
    - :342 `expect` expected _no expected value_ _(none)_
- `changing the ring retracts the verdict` — e2e/claims.spec.ts:345
    - :348 `toBeVisible` expected _no expected value_ _(none)_
    - :353 `toHaveText` expected `'Verification: no signature yet'` _(literal)_
    - :354 `toHaveCount` expected `0` _(literal)_
    - :355 `toHaveCount` expected `0` _(literal)_
    - :356 `toHaveCount` expected `0` _(literal)_
    - :357 `toHaveCount` expected `0` _(literal)_
    - :358 `toHaveCount` expected `0` _(literal)_
    - :359 `expect` expected _no expected value_ _(none)_
- `editing the message retracts the verdict` — e2e/claims.spec.ts:362
    - :365 `toHaveCount` expected `1` _(literal)_
    - :371 `toHaveText` expected `'Verification: no signature yet'` _(literal)_
    - :372 `toHaveCount` expected `0` _(literal)_
    - :373 `toHaveCount` expected `0` _(literal)_
    - :374 `toHaveCount` expected `0` _(literal)_
    - :375 `toHaveCount` expected `0` _(literal)_
    - :376 `expect` expected _no expected value_ _(none)_
    - :381 `toBe` expected `chain[0]` _(expression)_
    - :382 `toHaveText` expected `'Verification: valid ring signature'` _(literal)_
- `editing during the challenge walk cancels every late continuation` — e2e/claims.spec.ts:385
    - :387 `toBeDisabled` expected _no expected value_ _(none)_
    - :391 `toHaveCount` expected `6` _(literal)_
    - :394 `toBeEnabled` expected _no expected value_ _(none)_
    - :395 `toHaveText` expected `'Verification: no signature yet'` _(literal)_
    - :398 `toHaveText` expected `'Verification: no signature yet'` _(literal)_
    - :399 `toHaveCount` expected `0` _(literal)_
    - :400 `toHaveCount` expected `0` _(literal)_
    - :401 `toHaveCount` expected `0` _(literal)_
- `the ledger rejects the repeat key image and accepts distinct ones` — e2e/claims.spec.ts:404
    - :407 `toHaveCount` expected `2` _(literal)_
    - :410 `toHaveLength` expected `2` _(literal)_
    - :411 `toMatch` expected `KEY_IMAGE` _(expression)_
    - :416 `toBe` expected `true` _(expression)_
    - :417 `expect` expected _no expected value_ _(none)_
    - :420 `toHaveClass` expected `/ledger-ok/` _(regex)_
    - :421 `toContainText` expected `'accepted (new key image)'` _(literal)_
    - :422 `toHaveClass` expected `/ledger-reject/` _(regex)_
    - :423 `toContainText` expected `'REJECTED double-spend (image already spent)'` _(literal)_
    - :424 `toContainText` expected `'The rejected line proves'` _(literal)_
    - :431 `expect` expected _no expected value_ _(none)_
    - :435 `toHaveCount` expected `0` _(literal)_
    - :436 `toBeDisabled` expected _no expected value_ _(none)_
    - :437 `expect` expected _no expected value_ _(none)_
    - :438 `expect` expected _no expected value_ _(none)_
    - :445 `toHaveCount` expected `2` _(literal)_
    - :448 `toBe` expected `distinct[1].trim()` _(expression)_
    - :449 `expect` expected _no expected value_ _(none)_
    - :450 `toHaveCount` expected `0` _(literal)_
    - :451 `toHaveCount` expected `2` _(literal)_
    - :452 `toContainText` expected `'Every submission was accepted'` _(literal)_
- `ledger messages are inert text, and a new ring retires the old ledger` — e2e/claims.spec.ts:455
    - :459 `toHaveCount` expected `2` _(literal)_
    - :461 `toHaveText` expected `payload` _(expression)_
    - :462 `toHaveCount` expected `0` _(literal)_
    - :463 `toHaveAttribute` expected `'data-xss', 'executed'` _(expression)_
    - :466 `toHaveCount` expected `0` _(literal)_
    - :467 `toBeDisabled` expected _no expected value_ _(none)_
    - :468 `toHaveText` expected `'Key image A: pending'` _(literal)_
- `the timing sweep charts exactly the samples it claims to have fitted` — e2e/claims.spec.ts:471
    - :472 `toHaveCount` expected `0` _(literal)_
    - :475 `toHaveCount` expected `10, { timeout: 120_000 }` _(expression)_
    - :476 `toBeEnabled` expected _no expected value_ _(none)_
    - :477 `toBeVisible` expected _no expected value_ _(none)_
    - :481 `toBe` expected `10` _(literal)_
    - :484 `toHaveCount` expected `samples` _(expression)_
    - :485 `toHaveCount` expected `samples` _(expression)_
    - :488 `toHaveLength` expected `samples` _(expression)_
    - :493 `toBe` expected `'2'` _(literal)_
    - :494 `toBe` expected `'11'` _(literal)_
    - :506 `toBe` expected `signR2 >= 0.9 && verifyR2 >= 0.9` _(expression)_
    - :508 `expect` expected _no expected value_ _(none)_
    - :514 `expect` expected _no expected value_ _(none)_
    - :515 `expect` expected _no expected value_ _(none)_
    - :516 `expect` expected _no expected value_ _(none)_
- `the group readout counts the signatures it was actually given, and only the manager names the signer` — e2e/claims.spec.ts:519
    - :522 `toBeDisabled` expected _no expected value_ _(none)_
    - :523 `toHaveText` expected `'Verifier result: no signature yet'` _(literal)_
    - :524 `toHaveText` expected `'Manager open result: not opened yet'` _(literal)_
    - :529 `expect` expected _no expected value_ _(none)_
    - :539 `toHaveText` expected _no expected value_ _(none)_
    - :542 `toEqual` expected `{ total: 1, distinct: 1, linked: 1 }` _(expression)_
    - :546 `toEqual` expected `{ total: 2, distinct: 1, linked: 2 }` _(expression)_
    - :547 `toContainText` expected _no expected value_ _(none)_
    - :555 `toEqual` expected `{ total: 3, distinct: 2, linked: 1 }` _(expression)_
    - :558 `expect` expected _no expected value_ _(none)_
    - :559 `toHaveText` expected `'Manager open result: not opened yet'` _(literal)_
    - :564 `toHaveText` expected `'Manager open result: ${members[2]}'` _(expression)_
- `changing a group-signature subject retires the current evidence but preserves history` — e2e/claims.spec.ts:567
    - :571 `toHaveText` expected _no expected value_ _(none)_
    - :575 `toHaveText` expected `'Manager open result: not opened yet'` _(literal)_
    - :578 `toHaveText` expected `'Verifier result: no signature yet'` _(literal)_
    - :579 `toHaveText` expected `'Signer identity to verifier: no signature yet'` _(literal)_
    - :580 `toHaveText` expected `'Manager open result: not opened yet'` _(literal)_
    - :581 `toBeDisabled` expected _no expected value_ _(none)_
    - :584 `toContainText` expected `'Signatures collected in this session: 2'` _(literal)_
    - :586 `toHaveText` expected `'Verifier result: no signature yet'` _(literal)_
    - :587 `toHaveText` expected `'Signer identity to verifier: no signature yet'` _(literal)_
    - :588 `toBeDisabled` expected _no expected value_ _(none)_
- `a quoted message cannot break out of the input it is rendered back into` — e2e/claims.spec.ts:591
    - :609 `toHaveCount` expected `0` _(literal)_
    - :611 `toHaveCount` expected `0` _(literal)_
    - :612 `toHaveAttribute` expected `'data-xss', 'executed'` _(expression)_
    - :615 `toHaveValue` expected `payload` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

**verification/ manifest** (1 file(s)):

- `verification/manifest.yaml` (3454 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-ring-sign

## What It Is
This demo compares two anonymous-authentication models: LSAG-style ring signatures and manager-issued group signatures. In the code, ring members are built from WebCrypto Ed25519 keys and verified with real Ed25519 curve arithmetic, while the group-signature exhibit uses P-256 ECDSA credentials issued by a manager. The problem being illustrated is how to prove membership in a set without publicly revealing which specific member acted. The security model differs by primitive: ring signatures provide signer ambiguity with linkability through key images, while the group flow adds manager-controlled opening for accountability.

## When to Use It
- Use it to explain ring signatures in privacy-preserving payments, because the LSAG flow shows how one valid signer is hidden among decoys while still producing a verifiable signature.
- Use it to demonstrate key-image-based double-spend detection, because the same signer secret yields the same linkable key image across repeated spends.
- Use it to compare anonymous authorization models, because the group-signature exhibit shows what changes when a manager can issue credentials and later open a signature.
- Use it to discuss anonymity-set tradeoffs, because the ring-size timing exhibit makes the privacy-versus-cost relationship visible with real measurements.
- Do NOT use it as a production wallet or enterprise group-signature implementation, because the group exhibit is a teaching model built from manager-issued P-256 credentials rather than a standardized deployable group-signature scheme.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-ring-sign](https://systemslibrarian.github.io/crypto-lab-ring-sign/)**

A plain-language preamble grounds the four words a newcomer meets first — *ring*, *decoy*, *challenge chain*, *key image* — with a passed-note-around-a-circle-of-suspects analogy before any control appears. The page then lets users choose ring size, select a hidden signer, and generate LSAG signatures. The challenge chain is animated as an actual loop: edges between ring nodes light one at a time as each `c_i` is computed, and when the walk returns it snaps a connector back to node 0 with a "chain closed: c_n == c0 ✓" badge — and on tamper that closing edge is drawn broken and red because the walk lands on a value that no longer equals `c0`. A "your view / verifier's view" toggle makes the signer highlight explicit as privileged information the verifier never has, and a "reveal the closed slot" control lets learners try (and fail) to pick the secret-computed response out of the identical-looking grid. A "try to break it" control corrupts a response or the message and shows verification reject it. Exhibit 2 drives a mock network ledger that accepts each new key image once and visibly rejects the repeat spend, dramatizing double-spend detection without ever revealing which ring member signed. A timing sweep renders a real line/scatter plot — ring size on the x-axis, milliseconds on the y-axis, both series overlaid against a dashed linear reference — so the O(n) privacy-versus-cost growth is legible. Each exhibit carries a collapsible "how it works" explainer. The group-signature section issues credentials, signs anonymously, and opens through the manager flow, with an explicit note about which anonymity property the teaching model does and does not provide.

## What Can Go Wrong
- Reused signer secret in multiple ring spends: the key image repeats, which breaks unlinkability for that signer and exposes a double-spend attempt.
- Invalid challenge-chain arithmetic: if any challenge or response is computed against the wrong ring member ordering, verification fails because the chain no longer closes at `c0`.
- Weak or malformed curve points: accepting small-order or non-torsion-free points can break security assumptions for Edwards-curve signature verification.
- Mis-bound group credentials: if the verifier does not ensure the presented member public key matches the manager-issued credential, a forged identity binding can slip through.
- Oversold anonymity set: a large nominal ring does not guarantee strong privacy if decoy selection is poor or the application leaks metadata outside the signature itself.

## Real-World Usage
- Monero: uses linkable ring signatures (today CLSAG, historically LSAG-family constructions) to hide the real input among decoys while still detecting double spends.
- MobileCoin: uses ring-signature-based transaction privacy to hide which member of an input set authorized a spend.
- Intel EPID: uses a group-signature system so devices can attest membership anonymously while allowing issuer-controlled revocation and management.
- TPM Direct Anonymous Attestation: uses a group-signature-style attestation model so a TPM can prove valid membership without revealing a unique device identity to every verifier.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-ring-sign
cd crypto-lab-ring-sign
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-blind-sign](https://systemslibrarian.github.io/crypto-lab-blind-sign/) — blind signatures and unlinkability, a neighboring privacy-preserving signature primitive.
- [crypto-lab-ed25519-forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) — the Ed25519/EdDSA signatures and cofactor details the LSAG ring is built from.
- [crypto-lab-pairing-gate](https://systemslibrarian.github.io/crypto-lab-pairing-gate/) — BLS signature aggregation, another way to combine signers into one signature.
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — FROST threshold Ed25519 signing, group-authorized signatures with a different trust model.
- [crypto-lab-bulletproofs](https://systemslibrarian.github.io/crypto-lab-bulletproofs/) — range proofs as used alongside ring signatures in Monero-style confidential transactions.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## ECDSA Forge

- **slug**: `crypto-lab-ecdsa-forge`
- **repo**: https://github.com/systemslibrarian/crypto-lab-ecdsa-forge
- **live**: https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/
- **commit_sha**: `9c450c7ac773a7a51087d657a0d27b935514edb7` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | ATTACKS  ·  **level**: intermediate  ·  **--accent**: var(--pub)
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: ECDSA Forge  — _read from src/main.ts_

**Subtitle**: Elliptic-Curve Signatures · secp256k1 / P-256 · RFC 6979  — _read from src/main.ts_

**Description**: Generate keys, sign a message, and watch a reused nonce k across two signatures algebraically recover the private key — then swap in RFC 6979 deterministic nonces as the fix.  — _read from src/main.ts_

**Why it matters**: ECDSA authenticates TLS certificates, Bitcoin and Ethereum transactions, SSH keys, and passkeys. A single repeated nonce — from a weak RNG or a bug — has drained real wallets and cracked consoles. Correct deterministic nonce derivation avoids dependence on fresh randomness for each signature. Bugs, faults, and side channels still matter.  — _read from src/main.ts_

**Card copy**: ECDSA on secp256k1 and P-256 with sign/verify workflows, RFC 6979 deterministic nonces, and the classic nonce-reuse private-key recovery attack.

**Chips**: ECDSA · secp256k1 · RFC 6979 · Nonce Reuse

**Implements**: EC point arithmetic `src/ecdsa.ts:218`, ECDSA `src/attack.ts:13`, HMAC `src/rfc6979.ts:72`, P-256 `src/ecdsa.ts:2`, secp256k1 `src/ecdsa.ts:1`, SHA-256 `src/rfc6979.ts:67`

**Attacks shown**: Discrete log `src/content.ts:40`, Key recovery `README.md:5`, Lattice reduction `README.md:45`, Nonce reuse `src/attack.ts:36`, Side-channel (unspecified) `src/main.ts:292`, Signature malleability `src/main.ts:505`

**References**: Ed25519, RSA, RSA-PSS, WebAuthn

**Standards body**: IETF, NIST, SECG

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 186-5` — first seen README.md:19 (4×)
- `fips186-5` — first seen src/content.ts:85 (1×)
- `RFC 6979` — first seen README.md:5 (29×)
- `rfc6979` — first seen README.md:57 (4×)

**README — What Can Go Wrong**:

```text
- This demo uses @noble/curves for scalar multiplication and curve arithmetic. Production systems also need comprehensive side-channel controls and hardened key management.
- The nonce reuse attack here is real. Under one key, reusing nonce k for distinct message hashes permits private key recovery when the required differences are invertible. Identical deterministic signatures do not provide those distinct equations.
- Browser JavaScript timing is noisy and can leak execution patterns; timing and fault attacks are out of scope but relevant in real signing oracles.
- Ed25519 also derives its signing nonce deterministically. If an implementation bug or fault forces the same secret nonce under one key across distinct challenges, the signing scalar can still be recovered. Determinism is not immunity to actual nonce reuse.
- ECDSA signatures are malleable: both (r, s) and (r, n-s) can verify unless low-S normalization is enforced by protocol rules.
```

**Claims tested** (e2e/claims.spec.ts, 11 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:167
    - :167 `toHaveClass` expected `/exposed/` _(regex)_
- `Exhibit 1: a signature verifies, a tampered message does not` — e2e/claims.spec.ts:194
    - :198 `toHaveText` expected `'Generate a keypair to begin.'` _(literal)_
    - :199 `toHaveText` expected `'not generated'` _(literal)_
    - :200 `toHaveText` expected `'none'` _(literal)_
    - :204 `toHaveText` expected `'Sign something first.'` _(literal)_
    - :205 `toHaveClass` expected `/bad/` _(regex)_
    - :209 `toHaveText` expected `'Generate a keypair first.'` _(literal)_
    - :210 `toHaveClass` expected `/bad/` _(regex)_
    - :212 `toHaveText` expected `'Generate a keypair first.'` _(literal)_
    - :215 `toHaveText` expected `'Keypair generated on secp256k1.'` _(literal)_
    - :217 `toHaveText` expected `/^[0-9a-f]{12}\.\.\.[0-9a-f]{12} \(33 bytes\)$/` _(regex)_
    - :220 `toHaveText` expected _no expected value_ _(none)_
    - :223 `toHaveText` expected `'Signature generated with random nonce.'` _(literal)_
    - :226 `toHaveText` expected `'✓ VALID signature'` _(literal)_
    - :227 `toHaveClass` expected `/ok/` _(regex)_
    - :232 `toHaveText` expected `'✗ INVALID signature'` _(literal)_
    - :233 `toHaveClass` expected `/bad/` _(regex)_
    - :239 `toHaveText` expected `'✓ VALID signature'` _(literal)_
- `Exhibit 1: RFC 6979 signing is reproducible, and switching curve resets state` — e2e/claims.spec.ts:242
    - :251 `toHaveText` expected `'Signature generated with RFC 6979 deterministic nonce.'` _(literal)_
    - :254 `toHaveText` expected `'✓ VALID signature'` _(literal)_
    - :258 `toHaveText` expected `first!` _(expression)_
    - :263 `toHaveText` expected `first!` _(expression)_
    - :265 `toHaveText` expected `'✓ VALID signature'` _(literal)_
    - :269 `toHaveText` expected `'Curve switched to p256. Generate a fresh keypair.'` _(literal)_
    - :270 `toHaveText` expected `'not generated'` _(literal)_
    - :271 `toHaveText` expected `'none'` _(literal)_
    - :273 `toHaveText` expected `'Sign something first.'` _(literal)_
    - :277 `toHaveText` expected `/\(33 bytes\)$/` _(regex)_
    - :280 `toHaveText` expected `'✓ VALID signature'` _(literal)_
- `Exhibit 2: 18 plotted points + the point at infinity = the claimed order 19` — e2e/claims.spec.ts:287
    - :293 `toHaveCount` expected `18` _(literal)_
    - :294 `toContainText` expected `'The 18 dots are the affine points'` _(literal)_
    - :295 `toContainText` expected `'n = 19'` _(literal)_
    - :303 `expect` expected _no expected value_ _(none)_
    - :304 `toBe` expected `k` _(expression)_
    - :307 `toBe` expected `'${m![2]},${m![3]}'` _(expression)_
    - :309 `toHaveCount` expected `1` _(literal)_
    - :314 `toBe` expected `18` _(literal)_
    - :325 `expect` expected _no expected value_ _(none)_
    - :327 `toBe` expected `18` _(literal)_
    - :328 `toBe` expected `18` _(literal)_
    - :329 `toBe` expected `19` _(literal)_
    - :332 `toEqual` expected `{ x: 5, y: 16 }` _(expression)_
    - :333 `toBe` expected `P_TOY` _(expression)_
- `Exhibit 2: the real-curve panel reports the point it draws, for chords and tangents` — e2e/claims.spec.ts:336
    - :340 `toContainText` expected `'P + Q = (');` _(expression)_
    - :344 `toContainText` expected `'Doubling: 2P = (');` _(expression)_
    - :346 `toBe` expected `chord` _(expression)_
    - :347 `toHaveAttribute` expected `'aria-label', /Doubling P/` _(expression)_
    - :351 `toHaveText` expected `tangent` _(expression)_
    - :353 `toHaveAttribute` expected `'aria-label', /Adding P and Q/` _(expression)_
- `Exhibit 3: nonce reuse recovers the victim key on ${curve}` — e2e/claims.spec.ts:361
    - :363 `toHaveClass` expected `/censored/` _(regex)_
    - :364 `toHaveText` expected `'Waiting...'` _(literal)_
    - :368 `toBe` expected `n` _(expression)_
    - :372 `toBe` expected `run.dVictim` _(expression)_
    - :373 `expect` expected _no expected value_ _(none)_
    - :374 `toContainText` expected `"This equals Alice's real private key."` _(literal)_
    - :380 `toBe` expected `run.k` _(expression)_
    - :381 `toBe` expected `run.dVictim` _(expression)_
    - :384 `toBe` expected `run.r` _(expression)_
    - :388 `toHaveLength` expected `66` _(literal)_
    - :389 `toBe` expected `'${pub.slice(0, 18)}...${pub.slice(-18)}'` _(expression)_
    - :393 `toBe` expected `true` _(expression)_
    - :394 `toBe` expected `true` _(expression)_
    - :396 `toBe` expected `false` _(expression)_
    - :399 `toBe` expected `await hashToScalar('Transfer $10 to Bob', n)` _(expression)_
    - :400 `toBe` expected `await hashToScalar('Transfer $20 to Charlie', n)` _(expression)_
    - :401 `toBe` expected `run.e2` _(expression)_
    - :404 `toBe` expected `run.dRecovered.toString(16).padStart(64, '0')` _(expression)_
    - :407 `toContainText` expected `'share the same r = ${shortHex(run.r)}'` _(expression)_
    - :408 `toContainText` expected `'r=${shortHex(run.r)}'` _(expression)_
    - :409 `toContainText` expected `'s1=${shortHex(run.s1)}'` _(expression)_
    - :410 `toContainText` expected `'s2=${shortHex(run.s2)}'` _(expression)_
    - :411 `toContainText` expected `shortHex(run.k, 16)` _(expression)_
    - :412 `toContainText` expected `shortHex(run.dRecovered, 16)` _(expression)_
    - :415 `toContainText` expected `'TRUE — forgery accepted.'` _(literal)_
    - :416 `toContainText` expected `'Transfer $1,000,000 to Eve'` _(literal)_
- `Exhibit 3: two runs use fresh victims — the demo is not replaying one canned key` — e2e/claims.spec.ts:420
    - :426 `toBe` expected `first.dVictim` _(expression)_
    - :427 `toBe` expected `first.r` _(expression)_
    - :429 `toBe` expected `first.e1` _(expression)_
    - :430 `toBe` expected `second.dVictim` _(expression)_
- `Toy attack: every displayed integer is correct, and the recovered key is the real key` — e2e/claims.spec.ts:469
    - :483 `toHaveCount` expected `1` _(literal)_
    - :488 `toBe` expected `d` _(expression)_
    - :489 `toEqual` expected `tmul(d)` _(expression)_
    - :494 `toBe` expected `r` _(expression)_
    - :495 `toBe` expected `r` _(expression)_
    - :496 `toBe` expected `tmod(kInv * tmod(e1 + r * d, N_TOY), N_TOY)` _(expression)_
    - :497 `toBe` expected `tmod(kInv * tmod(e2 + r * d, N_TOY), N_TOY)` _(expression)_
    - :498 `toContainText` expected `'same r! nonce reused'` _(literal)_
    - :501 `toBe` expected `true` _(expression)_
    - :502 `toBe` expected `true` _(expression)_
    - :503 `toBe` expected `true` _(expression)_
    - :504 `toBe` expected `true` _(expression)_
    - :509 `toBe` expected `kRec` _(expression)_
    - :510 `toBe` expected `k` _(expression)_
    - :511 `toBe` expected `dRec` _(expression)_
    - :512 `toBe` expected `d` _(expression)_
    - :513 `expect` expected _no expected value_ _(none)_
    - :517 `toBe` expected `d` _(expression)_
    - :518 `toBe` expected `k` _(expression)_
    - :519 `toBe` expected `tmod(e1 + e2 + 3, N_TOY)` _(expression)_
    - :520 `toBe` expected `true` _(expression)_
    - :521 `toBe` expected `true` _(expression)_
    - :523 `toBe` expected `false` _(expression)_
- `Toy attack: every failure path is reachable and says why` — e2e/claims.spec.ts:527
    - :533 `toHaveText` expected _no expected value_ _(none)_
    - :536 `toHaveCount` expected `0` _(literal)_
    - :539 `toBe` expected `0` _(literal)_
    - :541 `toHaveText` expected _no expected value_ _(none)_
    - :547 `toBe` expected `0` _(literal)_
    - :549 `toHaveText` expected _no expected value_ _(none)_
    - :552 `toHaveCount` expected `0` _(literal)_
    - :556 `toContainText` expected `'The secret is fully exposed.'` _(literal)_
    - :557 `toHaveCount` expected `0` _(literal)_
- `Exhibit 4: deterministic nonces reproduce one message and differ for the sampled second message` — e2e/claims.spec.ts:564
    - :572 `toHaveCount` expected `1` _(literal)_
    - :574 `toHaveCount` expected `0` _(literal)_
    - :575 `toHaveCount` expected `0` _(literal)_
    - :576 `toHaveText` expected `'No test run yet.'` _(literal)_
    - :586 `toHaveCount` expected `1` _(literal)_
    - :588 `toHaveCount` expected `2` _(literal)_
    - :590 `toBe` expected `det[1]` _(expression)_
    - :591 `toMatch` expected `/^k=[0-9a-f]{12}\.\.\.[0-9a-f]{12}, r=/` _(regex)_
    - :597 `toHaveCount` expected `3` _(literal)_
    - :599 `toBe` expected `rOf(detAfter[1])` _(expression)_
    - :603 `toHaveCount` expected `1` _(literal)_
    - :605 `toHaveCount` expected `2` _(literal)_
    - :607 `toBe` expected `rOf(rnd[1])` _(expression)_
    - :612 `toBe` expected `totalClicks` _(expression)_
    - :613 `toBe` expected `3` _(literal)_
    - :614 `toBe` expected `2` _(literal)_
    - :618 `toHaveCount` expected `0` _(literal)_
    - :619 `toHaveCount` expected `0` _(literal)_
- `Exhibit 4: the nonce-reuse attack fails against RFC 6979 and says why` — e2e/claims.spec.ts:622
    - :625 `toHaveText` expected `'No test run yet.'` _(literal)_
    - :628 `toContainText` expected `'Recovery refused in this run'` _(literal)_
    - :629 `toContainText` expected `'the two deterministic signatures have r1 ≠ r2'` _(literal)_
    - :630 `toContainText` expected `'there is no shared nonce for this attack to exploit'` _(literal)_
    - :631 `toHaveClass` expected `/ok/` _(regex)_
    - :633 `toContainText` expected `'Unexpected result'` _(literal)_
    - :636 `toContainText` expected `'n=${shortHex(orderOf('secp256k1'), 14)}'` _(expression)_
    - :641 `toContainText` expected `'Recovery refused in this run'` _(literal)_
    - :642 `toContainText` expected `'n=${shortHex(orderOf('p256'), 14)}'` _(expression)_
    - :643 `toHaveClass` expected `/ok/` _(regex)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-ecdsa-forge

## What It Is

Browser-based ECDSA (Elliptic Curve Digital Signature Algorithm) demo with full protocol implementation on secp256k1 (Bitcoin, Ethereum) and P-256 (NIST, TLS). Uses @noble/curves for audited field arithmetic; all ECDSA protocol logic is implemented from scratch in this repository. Demonstrates the critical nonce reuse vulnerability that compromised the Sony PS3, Android Bitcoin wallets, and numerous other systems by performing real private key recovery from two signatures sharing a nonce. Shows RFC 6979 deterministic nonces as mitigation, verified against RFC 6979 Appendix A.2.5.

## When to Use It

- Understand why TLS certificates, Bitcoin transactions, and SSH/JWT verification rely on ECDSA.
- Teach PS3 nonce reuse and Android wallet RNG failures with real math, not simulation.
- Learn RFC 6979 deterministic nonce derivation and reproducible ECDSA signing behavior.
- Compare legacy ECDSA pitfalls to safer modern signature defaults like Ed25519.
- Not for production signing libraries; use @noble/curves or platform-native APIs in production.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-ecdsa-forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/)**

The demo visualizes ECDSA on both a hand-checkable toy curve and real 256-bit keys: point addition (chord-and-tangent) and the `k·G` walk that makes the discrete-log gap tangible, a transparent two-equations / two-unknowns nonce-reuse attack that recovers a private key live with an explicit recovered-equals-victim proof, and RFC 6979 deterministic nonces shown as the mitigation. Every term is defined and every claim is cited to FIPS 186-5, SEC 1/2, RFC 6979, and the PS3 disclosure.

## What Can Go Wrong

- This demo uses @noble/curves for scalar multiplication and curve arithmetic. Production systems also need comprehensive side-channel controls and hardened key management.
- The nonce reuse attack here is real. Under one key, reusing nonce k for distinct message hashes permits private key recovery when the required differences are invertible. Identical deterministic signatures do not provide those distinct equations.
- Browser JavaScript timing is noisy and can leak execution patterns; timing and fault attacks are out of scope but relevant in real signing oracles.
- Ed25519 also derives its signing nonce deterministically. If an implementation bug or fault forces the same secret nonce under one key across distinct challenges, the signing scalar can still be recovered. Determinism is not immunity to actual nonce reuse.
- ECDSA signatures are malleable: both (r, s) and (r, n-s) can verify unless low-S normalization is enforced by protocol rules.

## Real-World Usage

ECDSA is standardized in NIST FIPS 186-5 and SEC 2. It underpins TLS 1.2/1.3 certificates, Bitcoin, Ethereum, SSH ECDSA keys, secure boot chains, JWT ES256 tokens, and WebAuthn/passkeys. Global verification volume is massive (roughly 10^9+ checks daily). RFC 6979 (Pornin, 2013) deterministic nonces are now standard in mature ECDSA deployments to avoid relying on fresh per-signature randomness; they do not eliminate implementation bugs, faults, or side channels.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-ecdsa-forge
cd crypto-lab-ecdsa-forge
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-ed25519-forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) — the safer modern default, with deterministic nonces by construction.
- [crypto-lab-nonce-lattice](https://systemslibrarian.github.io/crypto-lab-nonce-lattice/) — recovers ECDSA keys from biased nonces via the hidden number problem and LLL.
- [crypto-lab-rsa-forge](https://systemslibrarian.github.io/crypto-lab-rsa-forge/) — the other classic signature family (RSA, PSS, PKCS#1) and its pitfalls.
- [crypto-lab-bitcoin-wallet](https://systemslibrarian.github.io/crypto-lab-bitcoin-wallet/) — secp256k1 keys in the BIP-32/39 wallet ecosystem ECDSA signs for.
- [crypto-lab-jwt-forge](https://systemslibrarian.github.io/crypto-lab-jwt-forge/) — JWT/JWS attacks including ES256 and key-confusion failures.

## Development

- Install: `npm install`
- Build: `npm run build`
- Unit tests (Vitest): `npm test`
  - `test/ecdsa.test.ts` — real 256-bit sign/verify round-trips, forgery rejection, and the modular-arithmetic helpers, on both secp256k1 and P-256.
  - `test/attack.test.ts` — nonce-reuse key recovery equals the victim key exactly, the forged signature verifies under the victim public key, and recovery correctly refuses when nonces differ.
  - `test/rfc6979.test.ts` — deterministic-nonce reproducibility plus the RFC 6979 Appendix A.2.5 known-answer vector.
  - `test/toycurve.test.ts` — hand-checkable toy-curve group structure, ECDSA, and exhaustive nonce-reuse recovery across all `(d, k, e1, e2)`.
- Browser gate (Playwright): `npm run test:a11y` — runs both `e2e/` suites against the production build (builds are gated on this in CI).
  - `e2e/a11y.spec.ts` — axe-core WCAG A/AA scan in both themes, every `<details>` expanded.
  - `e2e/claims.spec.ts` — the page's load-bearing claims, asserted against the rendered DOM: the recovered private key equals the victim key *and* derives the published public key, the captured signatures verify, the toy panel's integers are re-derived independently, every failure path (no key, no signature, tampered message, identical hashes, degenerate nonce, RFC 6979) is reached and explains itself, and the 18 plotted toy points plus 𝒪 account for the claimed order n = 19.

## Teaching Features

- **Curve geometry, visualized** — point addition over the reals (chord-and-tangent, plus doubling) and the same group as a finite field of points, with the `k·G` walk that makes the discrete-log gap tangible.
- **Transparent nonce-reuse attack** — the two-equations / two-unknowns derivation, an interactive toy curve (`y² = x³ + 2x + 2 mod 17`, 18 affine points, prime group order 19) where every value is a hand-checkable small integer, and the same attack run live on real 256-bit keys with full values and an explicit recovered-equals-victim proof. On the toy curve the panel runs the actual verification equation on both captured signatures and on a fresh signature minted with the recovered key, so "the secret is exposed" is shown rather than asserted.
- **Glossary & primary sources** — every term defined, every claim cited to FIPS 186-5, SEC 1/2, RFC 6979, and the PS3 disclosure.
- **Accessible & responsive** — skip link, ARIA landmarks/live regions, keyboard-navigable, reduced-motion support, and a mobile layout down to small screens.

## License

Educational demo repository.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Schnorr Forge

- **slug**: `crypto-lab-schnorr-forge`
- **repo**: https://github.com/systemslibrarian/crypto-lab-schnorr-forge
- **live**: https://systemslibrarian.github.io/crypto-lab-schnorr-forge/
- **commit_sha**: `dfce63d724ba5208e184aa7f6663b846fa517911` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | ATTACKS  ·  **level**: intermediate  ·  **--accent**: #e0993b
- **MISSING FIELDS**: spec_citations, mutations, verification

**Name (H1)**: Schnorr Forge  — _read from index.html_

**Subtitle**: Schnorr Signatures · BIP-340  — _read from index.html_

**Description**: Generate a key, sign a message, and verify it with real BIP-340 arithmetic — then step through the equation s = k + e·x  — _read from index.html_

**Why it matters**: Schnorr is the signature ECDSA wishes it were: one clean, linear equation. That linearity is exactly what lets many signers combine into one signature — and the exact reason a single reused nonce hands the private key to anyone with two signatures.  — _read from index.html_

**Card copy**: Real BIP-340 Schnorr on secp256k1 with sign/verify, the step-by-step signing equation, nonce-reuse private-key recovery, and the linearity behind multisig and threshold signing.

**Chips**: BIP-340 · secp256k1 · Nonce Reuse · Aggregation

**Implements**: Schnorr `src/ui/attackPanel.ts:2`, secp256k1 `src/schnorr/field.ts:10`, SHA-256 `src/schnorr/bip340.ts:46`

**Attacks shown**: Key recovery `src/ui/attackPanel.ts:100`, Nonce reuse `src/ui/attackPanel.ts:100`, Signature malleability `README.md:54`

**Comment-only (named in code comments, not executed)**: EC point arithmetic `src/schnorr/field.ts:4`, FROST `src/schnorr/aggregate.ts:19`, Shamir secret sharing `src/schnorr/bip340.ts:50`

**References**: EC point arithmetic, ECDSA, FROST, Schnorr identification, Shamir secret sharing

**Standards body**: NIST, SECG

**Implementation**: @noble

**README — What Can Go Wrong**:

```text
- **Nonce reuse** — two signatures under one key with the same `k` leak the private key by subtraction (Exhibit 4). The same root cause sank the Sony PlayStation 3 signing key (2010) and has drained Bitcoin wallets — those were ECDSA, where the recovery algebra differs in detail, but the fatal ingredient is identical: one `k` used twice.
- **Predictable / low-entropy nonces** — a nonce an attacker can guess or bias is as fatal as reuse; BIP-340 derives it deterministically from the message and key for this reason.
- **Malleability / malformed inputs** — BIP-340 fixes strict encodings; the verifier rejects non-canonical `R`/`s`, off-curve points, and out-of-range scalars (Exhibit 5).
- **Naive key aggregation** — simply adding public keys and nonces (Exhibit 6's teaser) is insecure against rogue-key and Wagner attacks; MuSig2 and FROST exist to fix that.
```

**Claims tested** (e2e/claims.spec.ts, 7 test(s)):

- `displayed claims` — e2e/claims.spec.ts:20
- `the arrival verdict says the signature is VALID` — e2e/claims.spec.ts:21
    - :25 `toContainText` expected `'VALID'` _(literal)_
- `the message box arrives holding this lab\` — e2e/claims.spec.ts:28
    - :30 `toHaveValue` expected _no expected value_ _(none)_
- `the pressed input-mode segment is labelled UTF-8 text` — e2e/claims.spec.ts:35
    - :40 `expect` expected _no expected value_ _(none)_
- `signing canonicalizes the visible key and input edits retire its evidence` — e2e/claims.spec.ts:45
    - :48 `toContainText` expected `'VALID'` _(literal)_
    - :51 `toContainText` expected `'Inputs changed'` _(literal)_
    - :52 `toHaveCount` expected `0` _(literal)_
    - :57 `toBeVisible` expected _no expected value_ _(none)_
    - :59 `toHaveCount` expected `0` _(literal)_
    - :60 `toHaveValue` expected _no expected value_ _(none)_
    - :63 `toContainText` expected `'VALID'` _(literal)_
- `the Verify Workbench retires a verdict as soon as an artifact changes` — e2e/claims.spec.ts:66
    - :70 `toContainText` expected `'VALID'` _(literal)_
    - :73 `toContainText` expected `'inputs changed'` _(literal)_
    - :74 `toHaveCount` expected `0` _(literal)_
- `nonce-reuse and aggregation evidence retires with its message` — e2e/claims.spec.ts:77
    - :82 `toContainText` expected `'EQUALS'` _(literal)_
    - :84 `toContainText` expected `'Messages changed'` _(literal)_
    - :85 `toHaveCount` expected `0` _(literal)_
    - :89 `toContainText` expected `'accepts'` _(literal)_
    - :91 `toContainText` expected `'message changed'` _(literal)_
    - :92 `toHaveCount` expected `0` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Schnorr Forge

**Schnorr Signatures · BIP-340 · secp256k1**

An interactive, browser-only lab for BIP-340 Schnorr signatures. Generate a key, sign a message, and verify it with real elliptic-curve arithmetic — then step through the signing equation, reuse a nonce to watch the private key fall out by algebra, and see how two signatures add into one.

> **Not production cryptography — a teaching demo.** Keys are generated per-session in memory and never stored or transmitted. There is no backend. For real signing, use the audited [`@noble/curves`](https://github.com/paulmillr/noble-curves) `schnorr` implementation — which this demo cross-checks against byte-for-byte.

## What It Is

Schnorr is the signature ECDSA wishes it were: one clean, **linear** equation.

`​``
sign:    s = k + e·x            e = tagged-hash(R.x ‖ P.x ‖ m)
verify:  s·G = R + e·P          R = k·G,  P = x·G
`​``

- **x** private key · **P = x·G** public key (x-only, 32 bytes in BIP-340)
- **k** one-time secret nonce · **R = k·G** the public commitment
- **e** the Fiat–Shamir challenge · **s** the response

The primitives are **BIP-340 Schnorr over secp256k1** (x-only public keys, tagged hashes, 64-byte signatures) with BIP-340 deterministic nonce derivation. Group arithmetic comes from `@noble/curves`; **the BIP-340 layer itself — tagged hashes, the commit/challenge/respond equation, x-only/even-y encoding, and verification — is hand-rolled** in [`src/schnorr/bip340.ts`](src/schnorr/bip340.ts) so every intermediate value is inspectable. The **security model** is standard EUF-CMA signatures: unforgeable without the private key, provided the nonce is never reused.

That last clause is the whole drama of this lab. Schnorr's linearity is exactly what makes multisig and threshold signing possible — and exactly what turns one reused nonce into total key compromise.

## Exhibits

1. **Sign & Verify** — Pick or randomize a key, supply a message as **UTF-8 text or exact hex bytes**, choose deterministic or randomized (hedged) nonce derivation, and sign. See the three moves (commit `R`, challenge `e`, respond `s`), the 64-byte signature, and a **compute-both-sides** verification that shows `s·G` and `R + e·P` byte-for-byte. A "Break it" button flips one message byte and watches the real verifier reject it, an optional **BIP-340 details** disclosure exposes the even-y/parity normalization on real intermediates, and copy/export/shareable-verify-link actions handle only public artifacts (private key copy is separately marked).
2. **Verify Workbench** — Paste an x-only public key, signature, and message (UTF-8 or hex) from **any** BIP-340 implementation — no private key needed — and watch the explicit five-stage pipeline decide: parse & lengths → range checks → lift points → recompute challenge → compare `s·G` against `R + e·P`. Curated presets cover a valid signature and the malformed rejections (off-curve key, out-of-range scalar, changed message, wrong length).
3. **The Equation** — A user-driven, step-at-a-time walk through commit → challenge → respond → verify, ending in the algebra `s·G = (k + e·x)·G = R + e·P`. Motion is tied to your clicks; nothing loops on its own.
4. **Nonce Reuse → Key Recovery** — The break-it centerpiece. A deliberately faulty signer reuses one nonce across two messages; the panel then runs the actual recovery `x = (s₁ − s₂)·(e₁ − e₂)⁻¹ mod n` and shows the recovered key **equals** the real secret. Isolated and clearly marked broken — never the default path.
5. **BIP-340 Test Vectors** — All 19 official vectors run through the same hand-rolled `verify()`, including the malformed cases that must be **rejected** (point off the curve, out-of-range scalars, negated values). Each row expands to its full artifacts and the exact failing stage, and can be sent to the Verify Workbench. Green means our verdict matched the spec.
6. **Why Linearity Matters** — Two independent signers produce responses `s₁`, `s₂` that literally add into one combined signature the ordinary verifier accepts against the summed key — the seed of Schnorr multisig, pointing to MuSig2 and FROST.

Several exhibits end with an optional **quick check** — a one-question prediction with an immediate explanation — targeting a common misconception. The lab stays fully usable whether or not you answer them.

## When to Use It

- **Use** Schnorr/BIP-340 when you want short, linear, aggregatable signatures — Bitcoin Taproot, multisig, threshold signing.
- **Use** deterministic (or hedged) nonce derivation **always** — never a bare RNG for the nonce.
- **Do NOT** roll your own signer for production from this code. It is optimized for transparency, not constant-time safety. Use `@noble/curves`, `libsecp256k1`, or an equivalent audited library.
- **Do NOT** ever reuse a nonce, derive it from anything an attacker can force to repeat, or truncate its entropy. Exhibit 4 shows exactly why.

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-schnorr-forge/**

Sign a message, flip a byte and watch verification fail, force a nonce reuse and recover a key, and combine two signers into one signature — all in the browser, no install.

## What Can Go Wrong

- **Nonce reuse** — two signatures under one key with the same `k` leak the private key by subtraction (Exhibit 4). The same root cause sank the Sony PlayStation 3 signing key (2010) and has drained Bitcoin wallets — those were ECDSA, where the recovery algebra differs in detail, but the fatal ingredient is identical: one `k` used twice.
- **Predictable / low-entropy nonces** — a nonce an attacker can guess or bias is as fatal as reuse; BIP-340 derives it deterministically from the message and key for this reason.
- **Malleability / malformed inputs** — BIP-340 fixes strict encodings; the verifier rejects non-canonical `R`/`s`, off-curve points, and out-of-range scalars (Exhibit 5).
- **Naive key aggregation** — simply adding public keys and nonces (Exhibit 6's teaser) is insecure against rogue-key and Wagner attacks; MuSig2 and FROST exist to fix that.

## Real-World Usage

BIP-340 Schnorr is deployed in **Bitcoin Taproot** (activated 2021) for single-key and multisig spending, and underpins **MuSig2** key aggregation and **FROST** threshold signing. The same commit-challenge-respond structure is the Schnorr identification protocol behind much of the zero-knowledge and threshold-signature literature.

## Threat Model & Scope

What "not production crypto" concretely means here:

- **Secrets are deliberately on screen.** The lab renders private keys and nonces so you can watch the arithmetic. Browser extensions, injected scripts, and devtools can read anything the page holds.
- **No timing guarantees.** JavaScript cannot promise constant-time execution and cannot reliably zeroize secrets from memory. This code is optimized for transparency, not side-channel resistance.
- **Conformance ≠ audit.** The hand-rolled BIP-340 layer is **specification-conformant and differentially tested** against `@noble/curves` (which is independently audited) and the official vectors — but it has not itself received an independent security audit.
- **Provenance.** Test vectors are the 19 official rows from [`bitcoin/bips` `bip-0340/test-vectors.csv`](https://github.com/bitcoin/bips/blob/master/bip-0340/test-vectors.csv); the differential oracle is `@noble/curves` v2. Group arithmetic (point mul/add, field sqrt, scalar inverse) is Noble's; tagged hashes, the sign/verify equation, x-only/even-y encoding, nonce-reuse recovery, and the textbook aggregation teaser are hand-rolled. The aggregation panel is intentionally **textbook full-point Schnorr**, not BIP-340.

Bottom line: great for learning exactly what BIP-340 signs and why a signature passes or fails; never for protecting real funds.

## How to Run Locally

`​``bash
npm install
npm run dev          # http://localhost:5173/crypto-lab-schnorr-forge/
npm run build        # typecheck + production build to dist/
npm test             # unit tests incl. BIP-340 KATs
npm run test:maintenance # publishing and evidence-lifecycle controls
npm run size-budget  # compressed-bundle budget (build first)
npm run test:a11y    # WCAG 2.1 AA axe gate, both themes (build first)
npm run test:e2e     # functional flows on Chromium + a mobile viewport
npm run test:e2e:all # full matrix: Chromium, Firefox, WebKit, mobile
`​``

## Related Demos

- [crypto-lab-musig-gate](https://systemslibrarian.github.io/crypto-lab-musig-gate/) — the two-round MuSig2 nonce ceremony that makes key aggregation safe.
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — threshold Schnorr (FROST): t-of-n signers, one signature.
- [crypto-lab-blind-sign](https://systemslibrarian.github.io/crypto-lab-blind-sign/) — blind Schnorr, where the signer never sees the message.
- [crypto-lab-ecdsa-forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) — ECDSA over the same curve, and why its non-linear response makes all of the above hard.
- [crypto-lab-bitcoin-script](https://systemslibrarian.github.io/crypto-lab-bitcoin-script/) — Taproot script paths and transaction construction on top of these signatures.

## Build & Verify

- **69 unit tests** (Vitest, colocated `src/**/*.test.ts`), run in CI on every push and before every merge.
- **28 BIP-340 spec KAT assertions** — [`src/schnorr/vectors.ts`](src/schnorr/vectors.ts) holds all 19 official test vectors; [`src/schnorr/vectors.test.ts`](src/schnorr/vectors.test.ts) checks verification against every row **and** reproduces the exact expected signature for the 8 signing vectors. Our signatures are additionally cross-checked byte-for-byte against `@noble/curves` schnorr in a **differential sweep across 40 keys/messages/aux/lengths** ([`src/schnorr/bip340.test.ts`](src/schnorr/bip340.test.ts)), and every verifier rejection branch and pipeline stage is named in a test.
- **Strict parsing & boundaries** — [`src/schnorr/field.test.ts`](src/schnorr/field.test.ts) proves malformed hex fails closed (no partial parse) and exercises scalar/coordinate boundaries (`0`, `1`, `n-1`, `p`).
- **Attack correctness** — [`src/schnorr/attack.test.ts`](src/schnorr/attack.test.ts) proves nonce-reuse recovery returns the exact private key across many keys, and fails closed when nonces differ or messages coincide.
- **Accessibility gate** — `@axe-core/playwright` scans the production build for **zero** WCAG 2.1 A/AA violations in **both** themes ([`e2e/a11y.spec.ts`](e2e/a11y.spec.ts)).
- **Functional flows** — role-based end-to-end scenarios ([`e2e/flows.spec.ts`](e2e/flows.spec.ts)) run on **Chromium, Firefox, WebKit, and a mobile viewport**: sign/verify, tamper-rejects, workbench presets, vector hand-off, aggregation, keyboard tab roving, skip navigation, no-overflow geometry, and 44px touch targets.
- **Gated CI and deployment** — one workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) runs maintenance controls, typecheck, unit tests, build, the size budget, the a11y/claims gate, and cross-browser flows **before merge**. Pull requests receive no Pages write credentials and publish no artifact; `main` stamps the exact source revision, deploys only after the same gate, and verifies the served revision.

## Performance

All arithmetic runs in the browser in a few milliseconds per operation. There is no backend and no network I/O after the initial static load. A CI **compressed-size budget** ([`scripts/size-budget.mjs`](scripts/size-budget.mjs)) holds the bundle to ≤ 35 kB gzip JS and ≤ 10 kB gzip CSS (currently ~27 kB / ~3 kB).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## LMS/XMSS

- **slug**: `crypto-lab-lms-xmss`
- **repo**: https://github.com/systemslibrarian/crypto-lab-lms-xmss
- **live**: https://systemslibrarian.github.io/crypto-lab-lms-xmss/
- **commit_sha**: `b91f48bbcea09e62191d603c18653cc31e06bc42` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | HASHING & KDFS  ·  **level**: intermediate  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, mutations, verification

**Name (H1)**: LMS + HSS Vault  — _read from src/main.ts_

**Subtitle**: Stateful Hash-Based Signatures · RFC 8554  — _read from src/main.ts_

**Description**: Generate an LMS Merkle key, sign firmware, then reuse one LM-OTS index and watch a real forgery succeed against the genuine public key.  — _read from src/main.ts_

**Why it matters**: Each LM-OTS index is one-time-use: reuse it once and an attacker who sees only the signatures can forge new messages the real key accepts. These schemes guard firmware and boot chains, where a broken index is a compromised device.  — _read from src/main.ts_

**Card copy**: State-managed hash-based signatures with LM-OTS, Merkle trees, and hierarchical composition, showing where LMS, HSS, and XMSS fit in practice.

**Chips**: LMS · LM-OTS · HSS · NIST SP 800-208

**Implements**: LMS `src/forge.ts:51`, SHA-256 `src/lmots.ts:22`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Merkle tree `src/forge.ts:68`, Winternitz `src/forge.ts:10`

**References**: Dilithium, Falcon, ML-DSA, Merkle tree, NTRU, SHAKE, SLH-DSA, SPHINCS+, Winternitz, XMSS

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `ePrint 2026/2624` — first seen README.md:117 (1×)
- `ePrint 2026/2635` — first seen README.md:118 (1×)
- `eprint.iacr.org/2026/2624` — first seen README.md:117 (2×)
- `eprint.iacr.org/2026/2635` — first seen README.md:118 (2×)
- `FIPS 204` — first seen README.md:83 (1×)
- `FIPS 205` — first seen README.md:80 (1×)
- `NIST SP 800-208` — first seen README.md:5 (3×)
- `RFC 8554` — first seen README.md:5 (31×)
- `rfc8554` — first seen src/gates/phase2.ts:9 (5×)

**README — What Can Go Wrong**:

```text
- State reuse destroys security: signing two different messages with the same LMS/LM-OTS index can leak enough structure to enable forgery.
- Key exhaustion is real: `H=10` means exactly 1024 signatures for one LMS tree.
- HSS delays exhaustion, it does not remove it: eventually root-tree slots run out too.
- Browser storage is not an HSM: this demo persists used indexes in localStorage for teaching, not for high-assurance key custody.
- Key generation cost is non-trivial in pure TypeScript/Web Crypto for large trees.
```

**Claims tested** (e2e/claims.spec.ts, 1 test(s)):

- `invalid q overrides preserve state and rollback burns a visible live leaf` — e2e/claims.spec.ts:3
    - :7 `toHaveText` expected `'Ready', { timeout: 60_000 }` _(expression)_
    - :10 `toContainText` expected `'0'` _(literal)_
    - :13 `toContainText` expected `'State was not changed'` _(literal)_
    - :14 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :15 `toContainText` expected `'0'` _(literal)_
    - :18 `toContainText` expected _no expected value_ _(none)_
    - :24 `toHaveAttribute` expected `'aria-label', '0: leaf 0, used'` _(expression)_
    - :25 `toContainText` expected `'1'` _(literal)_
    - :26 `toContainText` expected _no expected value_ _(none)_
    - :30 `toContainText` expected `'not a sampled message'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-lms-xmss

## What It Is

Browser-based educational demo of Leighton-Micali Signatures (LMS) and the Hierarchical Signature System (HSS), following RFC 8554 and NIST SP 800-208 using SHA-256.

This project demonstrates stateful hash-based signatures in the browser:

- LM-OTS (Winternitz one-time signatures), parameter set `LMOTS_SHA256_N32_W8`
- LMS Merkle signatures, parameter set `LMS_SHA256_M32_H10` (1024 signatures per tree)
- Two-level HSS hierarchy (root `H=5`, leaf `H=10`) for 32,768 total signatures

All hashing uses Web Crypto `subtle.digest('SHA-256', ...)`.

The UI is built as seven exhibits focused on the key operational fact most demos skip: LMS is stateful, and index reuse is catastrophic. Exhibit 5 doesn't just assert this — it mounts a **live, working forgery**: reuse one one-time-signature index a handful of times and an attacker, using only the leaked signatures, forges a brand-new message that the genuine public key accepts.

The exhibits build the picture bottom-up so the forgery lands as understanding, not spectacle:

1. **Merkle Tree of OTS Keys** — generate `LMS_SHA256_M32_H10` (1024 leaves) and inspect each leaf's state.
2. **Signing Consumes State** — sign a message, watch `q` (the leaf index) advance and localStorage enforce single use.
3. **Inside One OTS — the Winternitz Chain** — draw the one-way hash chains a leaf is made of; sign message A, then see that a different message B needs a *shallower* depth an attacker can't reach from one signature. This is the prerequisite the forgery weaponizes.
4. **Authentication Path Walk** — a real slice of the same Merkle tree, climbing sibling-by-sibling from the signed leaf up to the root `T[1]`.
5. **Index Reuse → Live Forgery** — dial how many times the signer reused one index and watch the attacker's per-position reachable depth drop until a chosen malicious message is forgeable and the genuine public key accepts it.
6. **HSS Hierarchy** — a two-level tree signing 32,768 messages total.
7. **When Stateful Signatures Win** — where LMS/XMSS is the right tool and where it is not.

Every symbol (`I`, `q`, `T[1]`, LM-OTS, depth) is glossed inline at the top of the page so a newcomer to RFC 8554 notation can follow along, while the real per-position depth vectors and honest reach caveats keep it worthwhile for a professional.

## When to Use It

Use this demo when you need to:

- Teach the difference between stateful hash-based signatures (LMS/XMSS) and stateless schemes (SLH-DSA)
- Show why LMS can have tighter signature sizes than stateless hash-based alternatives
- Demonstrate Merkle-authentication-path verification step by step
- Explain why production LMS deployments require strict state governance (HSM counters, ceremonies, locks)
- Do NOT use this code as production signing infrastructure — it is intentionally educational and browser-first.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-lms-xmss](https://systemslibrarian.github.io/crypto-lab-lms-xmss/)**

Walk the seven exhibits: generate LM-OTS and LMS keys, see the one-way Winternitz chains inside a single leaf, step through Merkle-authentication-path verification, build the two-level HSS hierarchy, and — in Exhibit 5 — deliberately reuse an index to watch a working forgery be constructed from the leaked signatures and accepted by the genuine public key.

## What Can Go Wrong

- State reuse destroys security: signing two different messages with the same LMS/LM-OTS index can leak enough structure to enable forgery.
- Key exhaustion is real: `H=10` means exactly 1024 signatures for one LMS tree.
- HSS delays exhaustion, it does not remove it: eventually root-tree slots run out too.
- Browser storage is not an HSM: this demo persists used indexes in localStorage for teaching, not for high-assurance key custody.
- Key generation cost is non-trivial in pure TypeScript/Web Crypto for large trees.

## Real-World Usage

LMS/XMSS were deployed in real firmware and platform trust chains before the latest lattice standards were finalized:

- Cisco firmware-signing paths
- AWS Nitro-related signing and attestation paths
- TPM 2.0 optional support tracks
- HSM and long-term-signature ecosystems where auditable state is feasible

Why teams still pick LMS in those niches:

- Security is hash-based, with construction-specific assumptions and aggregate-use limits (see the research note below)
- Signature sizes are practical for many firmware and boot-chain contexts
- Operational model matches bounded-signature workflows with strong process controls

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-lms-xmss
cd crypto-lab-lms-xmss
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-lms-ledger](https://systemslibrarian.github.io/crypto-lab-lms-ledger/) — sibling LMS/HSS demo focused on key-state management.
- [crypto-lab-sphincs-ledger](https://systemslibrarian.github.io/crypto-lab-sphincs-ledger/) — stateless hash-based signatures (FIPS 205).
- [crypto-lab-merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) — Merkle tree construction and inclusion proofs.
- [crypto-lab-falcon-seal](https://systemslibrarian.github.io/crypto-lab-falcon-seal/) — NTRU lattice signatures for contrast.
- [crypto-lab-dilithium-seal](https://systemslibrarian.github.io/crypto-lab-dilithium-seal/) — ML-DSA lattice-based signatures (FIPS 204).

## How the Forgery Works

Winternitz hash chains are one-way: a chain value at depth `d` can be advanced to any depth `≥ d`, but never reversed. A single LM-OTS signature reveals, for each of the 34 positions, the chain value at the depth that message required. Reuse the same index across `k` messages and the attacker learns each position's value at the *lowest* depth seen across all of them. The checksum that normally blocks single-signature forgery is overcome by grinding the signature randomizer `C` until a chosen message's required depths all sit at or above the known depths — then each position is rebuilt by chaining forward. The result reconstructs the real public key and verifies. See `src/forge.ts`; the attack is exercised end-to-end in `src/gates/phase4.ts`.

## Tests

The crypto is validated against RFC 8554 test vectors and the reuse-forgery is proven end-to-end. CI (`.github/workflows/deploy.yml`) runs the type-check and the full gate suite on every push and pull request, and the GitHub Pages deploy is gated on the same checks.

`​``bash
npm test          # type-check is separate; this runs all four gates
npm run typecheck
`​``

Individual phase gates:

`​``bash
npm run gate:phase1   # LM-OTS primitives + RFC 8554 Appendix F vector
npm run gate:phase2   # LMS Merkle sign/verify + index-reuse refusal
npm run gate:phase3   # HSS hierarchy, rollover, tamper rejection
npm run gate:phase4   # live index-reuse forgery is accepted by the real key
`​``

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Hash construction and aggregate-use research

Reliable state is necessary but not sufficient. Deployment choices must identify the exact hash variant and parameter set, message length and accepted format, aggregate signature counts across keys, and the resulting hash-block/hash-call budgets, alongside randomizer generation, domain separation and implementation quality.

- Guo, Cheng, Preneel and Wang, *Provable Security of SHA-256-Based LMS Revisited in the Ideal-Cipher Model*, [ePrint 2026/2624](https://eprint.iacr.org/2026/2624), sections 1.1–1.2: classical ideal-cipher-model bounds depend on aggregate internal-block and hash-call work.
- Strenzke, *A Kelsey–Kohno Attack Variant against SHA-2 Message Digests in HSS/LMS and XMSS*, [ePrint 2026/2635](https://eprint.iacr.org/2026/2635), sections 1.5 and 4: multi-key pooling, message length/format and extremely large resource budgets matter. These attacks exclude SHAKE256 parameter sets; that exclusion is not a general security proof.

These October 2026 preprints are theoretical and attack-model-conditional. They do not establish a practical break, a quantum security bound, or standards withdrawal. They are distinct from this lab's demonstrated leaf-reuse forgery.

```

</details>

---

## Jevil

- **slug**: `crypto-lab-jevil`
- **repo**: https://github.com/systemslibrarian/crypto-lab-jevil
- **live**: https://systemslibrarian.github.io/crypto-lab-jevil/
- **commit_sha**: `75f32e69c7ff5f6de03116ad99d39bd945443680` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | HASHING & KDFS  ·  **level**: intermediate  ·  **--accent**: #e8413a
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Jevil  — _read from src/main.ts_

**Subtitle**: Few-time signature · degree-D polynomial secret · Goldilocks field  — _read from src/main.ts_

**Description**: Sign messages that reveal evaluations of a secret degree-D polynomial, then watch anyone Lagrange-interpolate the whole secret key the instant the distinct revealed points reach D+1.  — _read from src/main.ts_

**Why it matters**: Few-time schemes are supposed to degrade gracefully. Jevil instead fails off a cliff. In the paper's full construction and recommended parameters, signatures through n*  — _read from src/main.ts_

**Card copy**: A hash-based few-time signature scheme over the Goldilocks field using Lagrange interpolation — bounded-use signing with reusable verification keys.

**Chips**: Jevil · Hash-Based · Goldilocks Field · Lagrange Interpolation

**Implements**: SHAKE `src/hash.ts:34`

**Attacks shown**: Brute force `KNOWN-GAPS.md:18`

**Comment-only (named in code comments, not executed)**: SLH-DSA `src/compare.ts:4`

**References**: Dilithium, Kyber, LMS, ML-DSA, ML-KEM, Merkle tree, Poseidon, RSA, RSA-OAEP, RSA-PSS, SHA-3, SLH-DSA, SPHINCS+, STARK, Shamir secret sharing, XMSS

**Standards body**: NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `ePrint 2026/1103` — first seen src/jevil.ts:3 (1×)
- `FIPS 204` — first seen README.md:123 (1×)
- `FIPS 205` — first seen README.md:103 (1×)
- `NIST SP 800-208` — first seen README.md:120 (1×)

**Stated limitations (page)**:

- _(scope-note, src/main.ts)_ &#9432; Scope. &ldquo;Underdetermined&rdquo; is a statement about the evaluation equations, not about this demo's whole public key. The key also publishes a binding fingerprint of the coefficients and derives them deterministically from a seed, so an adversary with unbounded computing power can enumerate seeds and test them against that fingerprint. Say algebraically underdetermined below the cliff, computationally protected by the commitment and hash assumptions, and catastrophically recovered at D+1.

**README — What Can Go Wrong**:

```text
- **Exceeding the budget is total, not partial.** Once the distinct revealed points reach `D+1`, anyone Lagrange-interpolates the entire secret key — there is no "slightly weaker" zone.
- **No graceful degradation.** Unlike soft-failing HORS/FORS, a few-time scheme with this cliff geometry has nothing between "safe" and "fully recovered."
- **Misconfigured `K` and `D` blow the cap early.** The larger `K` is relative to `D`, the fewer signatures it takes to accumulate `D+1` distinct points, so a bad parameter choice exhausts the budget faster than expected.
- **Without the commitment binding, the cliff can be dodged.** A malicious signer using an uncommitted higher-degree key escapes recovery; this repo shows that geometry but does not implement the full zk-WHIR commitment that prevents it (see `KNOWN-GAPS.md`).
- **"Few" must actually be enforced.** Reusing one key across contexts, or losing track of the count, can quietly cross the threshold and leak the key.
```

**Claims tested** (e2e/claims.spec.ts, 12 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:30
    - :30 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:61
    - :61 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:74
    - :74 `toHaveClass` expected `/hidden/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:78
    - :78 `toHaveClass` expected `/hidden/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:112
    - :112 `toMatch` expected `/^jevil-transcript-jv-[0-9a-f]+\.json$/` _(regex)_
- `the number of polynomials still fitting is |F|^(D+1-m), recomputed` — e2e/claims.spec.ts:128
    - :139 `expect` expected _no expected value_ _(none)_
    - :140 `toBe` expected `p.D` _(expression)_
    - :145 `toBe` expected `1` _(literal)_
    - :147 `toBe` expected `expectedBits(1)` _(expression)_
    - :151 `toHaveText` expected `'1 / ${fresh.needed}'` _(expression)_
    - :153 `expect` expected _no expected value_ _(none)_
    - :156 `toBe` expected `expectedBits(mid.distinct)` _(expression)_
    - :157 `expect` expected _no expected value_ _(none)_
    - :161 `toMatch` expected `/Exactly 2\^/` _(regex)_
    - :162 `toMatch` expected `/Secret recovered/i` _(regex)_
- `the cliff fires at n*+1 and recovers exactly the published number of coefficients` — e2e/claims.spec.ts:165
    - :171 `toBe` expected `(p.nStar + 1) * p.K` _(expression)_
    - :172 `toBe` expected `p.M - 1` _(expression)_
    - :173 `toBe` expected `2 * p.M` _(expression)_
    - :174 `toBe` expected `p.nStar + 1` _(expression)_
    - :177 `toBe` expected `p.D + 1` _(expression)_
    - :178 `toBe` expected `1` _(literal)_
    - :179 `toMatch` expected `/Algebraically underdetermined/i` _(regex)_
    - :180 `toHaveClass` expected `/hidden/` _(regex)_
    - :183 `toBe` expected `p.nCliff` _(expression)_
    - :186 `expect` expected _no expected value_ _(none)_
    - :187 `toBe` expected `1 + p.K * signatures` _(expression)_
    - :191 `expect` expected _no expected value_ _(none)_
    - :192 `expect` expected _no expected value_ _(none)_
    - :193 `toBe` expected `p.M` _(expression)_
    - :194 `toBe` expected `0` _(literal)_
    - :197 `toBe` expected _no expected value_ _(none)_
    - :200 `toBe` expected `String(hit.needed)` _(expression)_
    - :201 `expect` expected _no expected value_ _(none)_
- `a malicious signer escapes the cliff, and the page says why with its own numbers` — e2e/claims.spec.ts:208
    - :216 `expect` expected _no expected value_ _(none)_
    - :217 `toBe` expected `0` _(literal)_
    - :220 `expect` expected _no expected value_ _(none)_
    - :221 `expect` expected _no expected value_ _(none)_
    - :222 `expect` expected _no expected value_ _(none)_
    - :225 `expect` expected _no expected value_ _(none)_
    - :226 `expect` expected _no expected value_ _(none)_
    - :227 `expect` expected _no expected value_ _(none)_
    - :231 `expect` expected _no expected value_ _(none)_
    - :232 `expect` expected _no expected value_ _(none)_
    - :236 `expect` expected _no expected value_ _(none)_
    - :237 `toMatch` expected `/Not verified/i` _(regex)_
- `exporting below the cliff is refused, quoting the shortfall the meter shows` — e2e/claims.spec.ts:240
    - :246 `expect` expected _no expected value_ _(none)_
    - :249 `expect` expected _no expected value_ _(none)_
    - :250 `expect` expected _no expected value_ _(none)_
    - :251 `expect` expected _no expected value_ _(none)_
- `the export verdict retires when the ledger advances past it` — e2e/claims.spec.ts:256
    - :262 `expect` expected _no expected value_ _(none)_
    - :268 `expect` expected _no expected value_ _(none)_
    - :271 `expect` expected _no expected value_ _(none)_
    - :272 `expect` expected _no expected value_ _(none)_
    - :273 `expect` expected _no expected value_ _(none)_
    - :274 `expect` expected _no expected value_ _(none)_
    - :279 `expect` expected _no expected value_ _(none)_
    - :280 `expect` expected _no expected value_ _(none)_
    - :287 `expect` expected _no expected value_ _(none)_
    - :288 `expect` expected _no expected value_ _(none)_
    - :292 `toBe` expected `''` _(literal)_
- `changing a selector without pressing Generate is flagged, not silently ignored` — e2e/claims.spec.ts:297
    - :302 `expect` expected _no expected value_ _(none)_
    - :311 `toHaveClass` expected `/hidden/` _(regex)_
    - :314 `expect` expected _no expected value_ _(none)_
    - :316 `expect` expected _no expected value_ _(none)_
    - :317 `expect` expected _no expected value_ _(none)_
    - :318 `expect` expected _no expected value_ _(none)_
    - :319 `expect` expected _no expected value_ _(none)_
    - :322 `toEqual` expected `applied` _(expression)_
    - :335 `toHaveClass` expected `/hidden/` _(regex)_
    - :341 `toBe` expected `7` _(literal)_
    - :342 `toBe` expected `4` _(literal)_
    - :343 `toBe` expected `8 * 4` _(expression)_
    - :344 `toHaveClass` expected `/hidden/` _(regex)_
    - :345 `toMatch` expected `/Algebraically underdetermined/i` _(regex)_
- `the grind stops at the cliff but nothing is left permanently dead` — e2e/claims.spec.ts:350
    - :356 `toBeDisabled` expected _no expected value_ _(none)_
    - :357 `toBe` expected `'true'` _(literal)_
    - :363 `toMatch` expected `/\+\d+ distinct/` _(regex)_
    - :364 `expect` expected _no expected value_ _(none)_
    - :365 `expect` expected _no expected value_ _(none)_
    - :367 `toBe` expected `atCliff.needed` _(expression)_
    - :371 `toBeEnabled` expected _no expected value_ _(none)_
    - :372 `toBe` expected `1` _(literal)_
    - :373 `toBeEnabled` expected _no expected value_ _(none)_
    - :374 `toBeEnabled` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-jevil

## What It Is

**Jevil** is a *few-time signature* (FTS) scheme — a digital signature whose key
is only safe to use a fixed number of times, `n*`. Its secret key is the
coefficient vector of a random degree-`D` polynomial `f` over the 64-bit
Goldilocks field; each signature reveals `K` hash-derived evaluations of `f`
(the HORS "hash to obtain a random subset" idea), and the public key ships one
free out-of-domain evaluation. The problem it solves is *enforcing a hard signing
cap*: unlike HORS-family schemes (FORS in SLH-DSA) that degrade softly, Jevil
fails off a **cliff** — the moment the distinct revealed points cross `D+1`,
anyone can Lagrange-interpolate the whole secret key in `O(D²)` field operations.
It is **post-quantum** (hash-based, no number-theoretic hardness) and
**transparent** (no trusted setup); it is *not* an encryption scheme and, as
realized in this repo, it demonstrates the cliff *geometry* rather than the full
commitment-bound scheme (see [`KNOWN-GAPS.md`](./KNOWN-GAPS.md)).

## Where the Idea Could Fit

Jevil is a **recent preprint**, not a standardized or broadly audited production
signature scheme, and this repo omits its load-bearing zk-WHIR commitment. Read
the following as *proposed* applications of the cliff idea, not as deployment
advice.

- **Firmware vendors capping signed releases per key** — the budget `n*` is the
  security property; exceeding it must be undeniable, which the cliff guarantees.
- **Per-tenure attestation budgets** — an authority allowed to attest exactly
  `n*` times leaks its key if it tries an `(n*+1)`-th, making over-attestation
  self-punishing.
- **Ephemeral session signers** — a short-lived signer with a built-in,
  self-enforcing usage limit needs no external counter to be trusted.
- **Audit-budgeted credentials** — where the *signer*, not the verifier, should
  bear the cost of breaking the cap; oversigning fails loudly and against the
  signer.
- **Do NOT use it** for anything needing many signatures from one key — reach
  for a standard scheme like ML-DSA (Dilithium) or SLH-DSA (SPHINCS+) instead;
  Jevil's whole point is that signature `n*+1` is catastrophic, not merely
  weaker, and this repo is a teaching demo of the cliff geometry.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-jevil](https://systemslibrarian.github.io/crypto-lab-jevil/)**

Generate a key, then either **Sign (honest)** a message or **Grind toward
cliff** — the adversarial mode that packs the public ledger with disjoint
points as fast as possible. Watch the distinct-point meter climb and, the
instant it reaches `D+1`, see the secret key reconstructed live from public data
with an exact-match check. Below the cliff the page states, exactly, how many
degree-`D` polynomials still fit the revealed evaluations — `|F|^(D+1−m)`, which
is a large finite number, not "infinitely many"; this is a finite field. Note the
scope: that statement is about the *evaluation equations*. The public key also
publishes a binding fingerprint of the coefficients, so an adversary with
unbounded computing power can enumerate seeds and test them against it. See
[`KNOWN-GAPS.md`](./KNOWN-GAPS.md). This is a *signature* demo (no encrypt/decrypt); the
controls are the budget `n*`, the positions-per-signature `K`, the **field**
(legible base field or the paper's `F(q₀⁴) ≈ 2²⁵⁶` tower), and the **signer**
(honest, or a malicious uncommitted higher-degree key that escapes the cliff —
showing what the zk-WHIR commitment prevents).

**Auditable, not just convincing.** Use **Export public recovery transcript** to
download a JSON file containing *only public data* — params, the OOD pair, the
deduplicated revealed points, and a binding fingerprint of the key (no secret).
Anyone can then reconstruct the key from that file alone:

`​``bash
# internal consistency only — the fingerprint compared against is IN the file
npm run verify path/to/jevil-transcript.json

# anchored — the fingerprint comes from the key panel, not from the file
npm run verify path/to/jevil-transcript.json --expected-fingerprint <64 hex>
`​``

**These two results say different things, and the CLI labels them differently.**

- `~ INTERNALLY CONSISTENT` means the supplied points interpolate to a key whose
  hash equals the fingerprint stored *in that same file*. It proves the recovery
  is a computation, not a stored answer. It does **not** prove the file belongs
  to any particular key: a transcript exported from a completely different key
  passes identically, which this repo's own test suite demonstrates.
- `✓ VERIFIED against the expected public key` requires `--expected-fingerprint`
  from an independent source, and is the only result that speaks to provenance.

A malicious/over-degree transcript, a tampered point, or any of seventeen
malformed-field cases is refused with a structured code (`BAD_PARAMS`,
`BAD_OOD`, `FINGERPRINT_MISMATCH`, `ANCHOR_MISMATCH`, …).

The file is a **recovery** transcript, not a signature ledger: it shows that the
included public points suffice to reconstruct the key. It does not record which
messages were signed, how many signing operations produced the points, or which
points belonged to which signature.

## What Can Go Wrong

- **Exceeding the budget is total, not partial.** Once the distinct revealed points reach `D+1`, anyone Lagrange-interpolates the entire secret key — there is no "slightly weaker" zone.
- **No graceful degradation.** Unlike soft-failing HORS/FORS, a few-time scheme with this cliff geometry has nothing between "safe" and "fully recovered."
- **Misconfigured `K` and `D` blow the cap early.** The larger `K` is relative to `D`, the fewer signatures it takes to accumulate `D+1` distinct points, so a bad parameter choice exhausts the budget faster than expected.
- **Without the commitment binding, the cliff can be dodged.** A malicious signer using an uncommitted higher-degree key escapes recovery; this repo shows that geometry but does not implement the full zk-WHIR commitment that prevents it (see `KNOWN-GAPS.md`).
- **"Few" must actually be enforced.** Reusing one key across contexts, or losing track of the count, can quietly cross the threshold and leak the key.

## Real-World Usage

- Few-time and one-time hash-based signatures — HORS, and the FORS layer inside SLH-DSA/SPHINCS+ (FIPS 205) — are deployed where post-quantum, setup-free signatures are needed.
- Hash-based signatures rest only on the security of hash functions, with no number-theoretic assumption for a quantum computer to break, which is why they anchor conservative PQ signature standards.
- Hard signing-cap semantics map to real needs: firmware-release budgets, attestation limits, and ephemeral signers that must self-enforce a usage count.
- The Goldilocks field (`2⁶⁴ − 2³² + 1`) used here is common in modern hash-based and STARK-friendly constructions because its arithmetic is fast.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-jevil
cd crypto-lab-jevil
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-sphincs-ledger](https://systemslibrarian.github.io/crypto-lab-sphincs-ledger/) — SLH-DSA (SPHINCS+), the stateless hash-based signature whose FORS layer Jevil echoes.
- [crypto-lab-lms-ledger](https://systemslibrarian.github.io/crypto-lab-lms-ledger/) — LMS/HSS with W-OTS+, stateful hash-based signatures (NIST SP 800-208).
- [crypto-lab-lms-xmss](https://systemslibrarian.github.io/crypto-lab-lms-xmss/) — LMS and XMSS one-time-signature trees side by side.
- [crypto-lab-mpcith-sign](https://systemslibrarian.github.io/crypto-lab-mpcith-sign/) — MPC-in-the-Head signatures, another hash/symmetric-only PQ approach.
- [crypto-lab-dilithium-seal](https://systemslibrarian.github.io/crypto-lab-dilithium-seal/) — ML-DSA (FIPS 204), the many-time PQ signature to reach for instead.

## Testing

`​``bash
npm test          # crypto-core faithfulness proof (both fields + malicious mode)
npm run test:e2e  # browser regression suite: the page's numbers vs each other
npm run test:a11y # Playwright: WCAG 2.1 AA (axe-core) + the functional claims gate
npm run build     # produce the static site
`​``

`test:a11y` runs everything in `e2e/`: the axe scan in both themes, and
`e2e/claims.spec.ts`, which pins the states a single-run harness never reaches —
an export verdict left describing a ledger that has since advanced, and key
selectors moved without pressing **Generate key**.

CI runs the core test, the build, and the e2e suite on every push
(`.github/workflows/verify.yml`) and deploys to GitHub Pages
(`deploy.yml`).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Web of Trust

- **slug**: `crypto-lab-web-of-trust`
- **repo**: https://github.com/systemslibrarian/crypto-lab-web-of-trust
- **live**: https://systemslibrarian.github.io/crypto-lab-web-of-trust/
- **commit_sha**: `37b2609756acf112335193c66ae41582be7a5897` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | KEY EXCHANGE | PROTOCOLS  ·  **level**: intermediate  ·  **--accent**: #0b7fab
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Web of Trust  — _read from src/ui.ts_

**Subtitle**: PGP/OpenPGP · GnuPG trust model · Ed25519/ECDSA  — _read from src/ui.ts_

**Description**: Build a keyring of ${signingAlgoName()}  — _read from src/ui.ts_

**Why it matters**: Authentication with no central CA that could mint a certificate for any name — validity is a graph you build. That resilience is also its risk: one over-trusted introducer, or a signature flood, can reshape whom you believe.  — _read from src/ui.ts_

**Card copy**: Verify real certifications, set local owner trust, and deliver a signed revocation separately to two public observers. Reject a forged record and compare stale and updated verdicts.

**Chips**: PGP · OpenPGP · GnuPG · Key Signing · Trust Graph

**Implements**: ECDSA `src/engine.ts:33`, Ed25519 `src/engine.ts:24`, P-256 `src/engine.ts:33`, SHA-256 `src/engine.ts:34`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: SHA-1 `src/engine.ts:113`

**References**: Merkle tree, SHA-1

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 4880` — first seen README.md:5 (12×)
- `RFC 7638` — first seen README.md:5 (4×)
- `RFC 8037` — first seen README.md:5 (3×)
- `RFC 9580` — first seen src/data.ts:125 (4×)
- `rfc4880` — first seen src/ui.ts:163 (1×)
- `rfc7638` — first seen README.md:5 (2×)
- `rfc8037` — first seen README.md:5 (2×)
- `rfc9580` — first seen src/observer-ui.ts:23 (2×)

**README — What Can Go Wrong**:

```text
- A single over-trusted introducer becomes a chokepoint: marking the wrong identity "fully trusted" can validate every key it has signed, including malicious ones.
- The bootstrap problem: a brand-new key nobody has certified has no path to validity, which is why key-signing parties and trusted introducers matter.
- Web of Trust does not scale to trusting strangers — the model breaks down at web scale, which is precisely why TLS adopted hierarchical PKI instead.
- Forged certifications are caught only because signatures are verified cryptographically; trust policy alone never makes a bad signature valid.
- Keyserver and distribution risks are real: the SKS keyserver certificate-flooding incident showed how unauthenticated certification attachment can be abused; revocation and key hygiene remain hard in practice.
- Comparing a truncated key identifier is not comparing a key: RFC 4880 §12.2 defines a V4 fingerprint as the full 160-bit (20-byte) SHA-1 of the public-key packet and the Key ID as merely its low-order 64 bits, while noting that Key IDs can collide. The Evil 32 project demonstrated this at scale in 2014, finding a colliding 32-bit key ID for every key in the Web of Trust strong set. The identifiers this demo displays are deliberately truncated to 8 bytes and labelled as such in the UI, so the shortcut is visible rather than implied; the signature payloads never use those display IDs and bind the full 32-byte JWK thumbprint instead.
```

**Claims tested** (e2e/claims.spec.ts, 22 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:186
    - :186 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:239
    - :239 `toHaveText` expected `want` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:244
    - :244 `toContainText` expected `'why is ${name}'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:250
    - :250 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:256
    - :256 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:264
    - :264 `toContainText` expected `/Generated \d+ keypairs/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:265
    - :265 `toBeVisible` expected _no expected value_ _(none)_
- `baseline verdicts match a trust walk re-derived from the page inputs` — e2e/claims.spec.ts:268
    - :274 `toEqual` expected `[` _(expression)_
    - :285 `toHaveCount` expected `7` _(literal)_
    - :286 `toHaveCount` expected `2` _(literal)_
    - :289 `toEqual` expected `{ marginals: 3, maxDepth: 5 }` _(expression)_
    - :293 `expect` expected _no expected value_ _(none)_
    - :294 `expect` expected _no expected value_ _(none)_
- `the marginal quorum in Frank's verdict matches the certifications on file` — e2e/claims.spec.ts:299
    - :312 `toEqual` expected `['Bob', 'Carol', 'Dave']` _(expression)_
    - :316 `toBe` expected `marginalSigners.length` _(expression)_
    - :317 `toBe` expected `s.policy.marginals` _(expression)_
    - :318 `expect` expected _no expected value_ _(none)_
    - :320 `toBe` expected `'2'` _(literal)_
    - :324 `expect` expected _no expected value_ _(none)_
    - :325 `toBe` expected `s.policy.marginals` _(expression)_
    - :326 `expect` expected _no expected value_ _(none)_
    - :330 `toHaveCount` expected `marginalSigners.length * 2` _(expression)_
    - :332 `toHaveCount` expected `0` _(literal)_
- `keyring, graph and status counters all report the same network` — e2e/claims.spec.ts:335
    - :337 `toBe` expected `s.names.length` _(expression)_
    - :338 `expect` expected _no expected value_ _(none)_
    - :339 `expect` expected _no expected value_ _(none)_
    - :342 `toBe` expected `s.names.length` _(expression)_
    - :343 `toBe` expected `s.certs.length` _(expression)_
    - :344 `toBe` expected `9` _(literal)_
    - :352 `expect` expected _no expected value_ _(none)_
    - :354 `toBe` expected _no expected value_ _(none)_
    - :357 `toBe` expected _no expected value_ _(none)_
- `breaking the quorum invalidates Frank, and lowering it brings him back` — e2e/claims.spec.ts:364
    - :372 `expect` expected _no expected value_ _(none)_
    - :373 `toMatch` expected `/Carol → Frank: counts 1 toward the marginal quorum of 3/` _(regex)_
    - :374 `toMatch` expected `/Dave → Frank: counts 1 toward the marginal quorum of 3/` _(regex)_
    - :381 `toContainText` expected `'need 2'` _(literal)_
    - :385 `toBe` expected _no expected value_ _(none)_
- `a forged certification never validates its subject, whatever the trust settings say` — e2e/claims.spec.ts:390
    - :394 `toBe` expected `'full'` _(literal)_
    - :397 `toContainText` expected `'Forged certification rejected'` _(literal)_
    - :398 `toContainText` expected `'signature failed to verify'` _(literal)_
    - :399 `toHaveCount` expected `1` _(literal)_
    - :408 `expect` expected _no expected value_ _(none)_
    - :409 `expect` expected _no expected value_ _(none)_
    - :415 `toContainText` expected `'forged — signature will NOT verify'` _(literal)_
- `the orphan key has no path at all, and the page says so` — e2e/claims.spec.ts:419
    - :421 `toContainText` expected _no expected value_ _(none)_
    - :427 `expect` expected _no expected value_ _(none)_
    - :428 `expect` expected _no expected value_ _(none)_
- `the inspector shows the exact bytes that were signed` — e2e/claims.spec.ts:431
    - :445 `toBeVisible` expected _no expected value_ _(none)_
    - :455 `expect` expected _no expected value_ _(none)_
    - :456 `toBe` expected `subject` _(expression)_
    - :459 `toMatch` expected `/^[0-9a-f]{16}$/` _(regex)_
    - :460 `toBe` expected `fingerprints[subject]` _(expression)_
    - :461 `toBe` expected `fingerprints[subject]` _(expression)_
    - :462 `expect` expected _no expected value_ _(none)_
    - :466 `toBe` expected `new TextEncoder().encode(expectedPayload).length` _(expression)_
    - :475 `toBe` expected `expectedHex` _(expression)_
    - :476 `toBe` expected `payloadLen * 2` _(expression)_
    - :480 `toBe` expected `64` _(literal)_
    - :485 `toBe` expected `sigLen * 2` _(expression)_
- `an older asynchronous computation cannot overwrite the latest policy` — e2e/claims.spec.ts:489
    - :567 `toHaveValue` expected `'1'` _(literal)_
- `over-trusting one introducer validates the key only they signed` — e2e/claims.spec.ts:573
    - :576 `toBe` expected `'none'` _(literal)_
    - :577 `expect` expected _no expected value_ _(none)_
    - :580 `toContainText` expected `'Eve is now fully trusted'` _(literal)_
    - :582 `toContainText` expected `'Signed by fully-trusted Eve'` _(literal)_
    - :586 `toBe` expected `'full'` _(literal)_
    - :588 `toBe` expected `Number(rowByName(after, 'Eve').depth) + 1` _(expression)_
- `cutting maxDepth to 1 drops exactly the keys further than one hop away` — e2e/claims.spec.ts:592
    - :597 `toEqual` expected `['Eve', 'Frank']` _(expression)_
    - :600 `toContainText` expected `'maxDepth = 1'` _(literal)_
    - :601 `toHaveValue` expected `'1'` _(literal)_
    - :607 `expect` expected _no expected value_ _(none)_
    - :611 `toContainText` expected `name` _(expression)_
    - :617 `toMatch` expected `/would need depth 2 — beyond your maxDepth of 1/` _(regex)_
- `revoking one certification drops that edge and nothing else` — e2e/claims.spec.ts:620
    - :623 `expect` expected _no expected value_ _(none)_
    - :626 `toContainText` expected `'retracted their certification of Eve'` _(literal)_
    - :627 `toHaveCount` expected `1` _(literal)_
    - :635 `expect` expected _no expected value_ _(none)_
    - :636 `expect` expected _no expected value_ _(none)_
- `revoking a key retires it and stops its signatures counting` — e2e/claims.spec.ts:639
    - :644 `toContainText` expected `'Bob self-revoked their key'` _(literal)_
    - :645 `toHaveCount` expected `1` _(literal)_
    - :649 `toContainText` expected `'a revoked key is not to be used'` _(literal)_
    - :657 `expect` expected _no expected value_ _(none)_
    - :658 `expect` expected _no expected value_ _(none)_
    - :666 `expect` expected _no expected value_ _(none)_
    - :667 `expect` expected _no expected value_ _(none)_
    - :668 `expect` expected _no expected value_ _(none)_
- `an SKS-style flood of real signatures changes no verdict` — e2e/claims.spec.ts:671
    - :676 `toHaveCount` expected `before.names.length + 50, {` _(expression)_
    - :679 `toContainText` expected `'STAYS INVALID'` _(literal)_
    - :683 `toBe` expected `50` _(literal)_
    - :686 `toBe` expected `flooders.length` _(expression)_
    - :687 `toBe` expected `true` _(expression)_
    - :689 `toBe` expected `false` _(expression)_
    - :690 `toBe` expected _no expected value_ _(none)_
    - :695 `toEqual` expected `verdictsBefore` _(expression)_
    - :699 `toHaveCount` expected `1` _(literal)_
    - :700 `expect` expected _no expected value_ _(none)_
    - :701 `toContainText` expected _no expected value_ _(none)_
    - :706 `toBe` expected `flooders.length` _(expression)_
    - :707 `expect` expected _no expected value_ _(none)_
    - :708 `expect` expected _no expected value_ _(none)_
- `the custom certification control is live: signing a stranger validates them` — e2e/claims.spec.ts:711
    - :720 `toHaveText` expected `"You signed Stranger's key."` _(literal)_
    - :723 `toContainText` expected `'Signed by fully-trusted You'` _(literal)_
    - :727 `toBe` expected `before.certs.length + 1` _(expression)_
    - :728 `toBe` expected `before.graphLinks + 1` _(expression)_
    - :729 `toBe` expected `'1'` _(literal)_
- `reset restores the baseline network after a scenario has mutated it` — e2e/claims.spec.ts:732
    - :737 `toContainText` expected `'Baseline restored'` _(literal)_
    - :738 `toHaveCount` expected `7` _(literal)_
    - :741 `toBe` expected `'none'` _(literal)_
    - :742 `toEqual` expected `{ marginals: 3, maxDepth: 5 }` _(expression)_
    - :743 `toBe` expected `9` _(literal)_
    - :744 `toBe` expected `false` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-web-of-trust

## What It Is

An interactive model of the PGP/OpenPGP **Web of Trust** using real signatures via the Web Crypto API. Identities sign each other's keys (certifications) with Ed25519 — and the engine automatically falls back to ECDSA P-256 on runtimes that lack Ed25519 — and then the GnuPG-style trust computation decides which keys are VALID from your point of view, based on owner-trust (full / marginal / none), a marginals-needed quorum, and a maximum trust depth. Only certifications whose signatures actually verify cryptographically are counted, and each signed payload binds the subject's name to the full SHA-256 JWK thumbprint defined by [RFC 7638](https://www.rfc-editor.org/rfc/rfc7638.html) (using the Ed25519 OKP members defined by [RFC 8037 §2](https://www.rfc-editor.org/rfc/rfc8037.html#section-2)). The point is to make a decentralized trust model concrete: deciding which public keys are real **without** a central authority, by walking a graph of signatures through people you have chosen to trust. Every primitive — keypair generation, signing, signature verification, and the trust walk — is real TypeScript running in the browser. What is deliberately **not** modelled is the OpenPGP packet / armor format: certifications here are plain JSON, not RFC 4880 binary packets. This is a faithful model of the trust logic, not a re-implementation of GnuPG's wire format.

## When to Use It

- **Understanding GPG / PGP trust** — make owner-trust, key validity, marginals-needed, and trust depth concrete by watching them change live.
- **Contrasting decentralized vs hierarchical trust** — read alongside the sibling [`crypto-lab-pki-chain`](https://systemslibrarian.github.io/crypto-lab-pki-chain/) demo, which walks the CA / PKI model in the opposite direction.
- **Teaching owner-trust vs validity** — these are different things, and the distinction is the most common GnuPG stumbling block.
- **Reasoning about key-signing parties** — see why the bootstrap matters and what a single over-trusted introducer does to your trust frontier.
- **Do NOT use this for production key management** — Web of Trust does not scale to trusting strangers at web scale; that is exactly why TLS uses hierarchical PKI instead. This toy model is for learning, not for managing real keys. For real OpenPGP use GnuPG (`gpg`), Sequoia-PGP, or a vetted library.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-web-of-trust](https://systemslibrarian.github.io/crypto-lab-web-of-trust/)**

The page walks through six sections, and the sample network builds itself on page load. **The keyring** generates a small social graph of real keypairs in your browser (You, Alice, Bob, Carol, Dave, Eve, Frank, Heretic, Stranger) and the certifications between them; you can add your own certifications, inspect the exact signed bytes behind any of them, and revoke keys or individual certifications. **Your trust settings** let you assign owner-trust (full / marginal / none) to each non-you identity and adjust the policy — `marginalsNeeded` (default 3) and `maxDepth` (default 5) — matching GnuPG's defaults. **Compute web of trust** shows every key with a valid / invalid badge, the depth it was validated at, and the reason — and clicking any node in the trust graph (or any key name in the table) traces the exact chain of introducers behind that verdict, or names the rule that stopped each dead certification from counting. **Break trust** runs five scenarios with a guided tour: a forged certification (the bogus signature fails to verify and the target stays invalid — the crypto enforces this, not policy), an orphan key nobody trusted has signed, an over-trusted introducer that suddenly validates a downstream key, a depth cutoff that drops distant keys, and an SKS-style flood of 50 real-but-untrusted signatures that changes nothing cryptographically. The remaining sections compare Web of Trust to hierarchical PKI and explain where the model is actually deployed today (GnuPG, key-signing parties, Linux distribution signing, the SKS keyserver flooding incident, sigstore-style attestations).

## What Can Go Wrong

- A single over-trusted introducer becomes a chokepoint: marking the wrong identity "fully trusted" can validate every key it has signed, including malicious ones.
- The bootstrap problem: a brand-new key nobody has certified has no path to validity, which is why key-signing parties and trusted introducers matter.
- Web of Trust does not scale to trusting strangers — the model breaks down at web scale, which is precisely why TLS adopted hierarchical PKI instead.
- Forged certifications are caught only because signatures are verified cryptographically; trust policy alone never makes a bad signature valid.
- Keyserver and distribution risks are real: the SKS keyserver certificate-flooding incident showed how unauthenticated certification attachment can be abused; revocation and key hygiene remain hard in practice.
- Comparing a truncated key identifier is not comparing a key: RFC 4880 §12.2 defines a V4 fingerprint as the full 160-bit (20-byte) SHA-1 of the public-key packet and the Key ID as merely its low-order 64 bits, while noting that Key IDs can collide. The Evil 32 project demonstrated this at scale in 2014, finding a colliding 32-bit key ID for every key in the Web of Trust strong set. The identifiers this demo displays are deliberately truncated to 8 bytes and labelled as such in the UI, so the shortcut is visible rather than implied; the signature payloads never use those display IDs and bind the full 32-byte JWK thumbprint instead.

## Real-World Usage

- GnuPG (`gpg`) and Sequoia-PGP implement the OpenPGP Web of Trust for email and file signing/encryption.
- Key-signing parties and trusted-introducer setups bootstrap validity within communities and organizations.
- Linux distributions sign packages and releases with PGP keys, with trust rooted in maintainer keys.
- The SKS keyserver network historically distributed OpenPGP certifications (and exposed the flooding-attack weakness).
- Modern attestation systems such as sigstore echo the same web-of-attestation idea in a different form.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-web-of-trust
cd crypto-lab-web-of-trust
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-pki-chain](https://systemslibrarian.github.io/crypto-lab-pki-chain/) — the hierarchical CA/PKI trust model, the direct contrast to Web of Trust.
- [crypto-lab-ed25519-forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) — the Ed25519 signatures that back each certification here.
- [crypto-lab-ssh-handshake](https://systemslibrarian.github.io/crypto-lab-ssh-handshake/) — trust-on-first-use, another decentralized key-trust model.
- [crypto-lab-merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) — Merkle inclusion proofs and Certificate Transparency, the auditability layer for PKI.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Independent public observers

The “Same signatures. Different received records” section snapshots two public keyrings, issues a genuine signed revocation and delivers it separately. A corrupted signature is rejected before storage; key revocations must be self-signed in this model. Owner trust stays local. The experiment shows received records, last accepted event and computed reasons. It neither contacts a keyserver nor implements OpenPGP packets, reason codes or designated revokers. Revocation does not erase existing copies.

Unit coverage checks delayed delivery, copy isolation, forged signatures, wrong-owner signatures and independent owner trust. The browser regression exercises the corresponding visible states. Sources are credited in the rendered section by title and printed page.

```

</details>

---

## Bitcoin Script

- **slug**: `crypto-lab-bitcoin-script`
- **repo**: https://github.com/systemslibrarian/crypto-lab-bitcoin-script
- **live**: https://systemslibrarian.github.io/crypto-lab-bitcoin-script/
- **commit_sha**: `5f3d0177701287e817c87e3ab93c63954389c40d` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES  ·  **level**: intermediate  ·  **--accent**: #f7931a
- **MISSING FIELDS**: spec_citations, mutations, verification

**Name (H1)**: Bitcoin Script  — _read from src/ui.ts_

**Subtitle**: Stack machine · P2PKH · secp256k1/ECDSA  — _read from src/ui.ts_

**Description**: Build a real P2PKH lock, sign a transaction, then step OP_DUP · OP_HASH160 · OP_EQUALVERIFY · OP_CHECKSIG on one shared stack to watch the script decide whether a spend is authorized.  — _read from src/ui.ts_

**Why it matters**: Every bitcoin is guarded by this tiny program — it is the actual mechanism that releases coins. Seeing how the wrong key, a forged signature, or a tampered transaction gets rejected is what connects ECDSA math to real on-chain security.  — _read from src/ui.ts_

**Card copy**: Step a real P2PKH spend through the Script stack machine — valid, wrong-key, forged-signature, and tampered scenarios, with real secp256k1 and HASH160. No backend.

**Chips**: secp256k1 · P2PKH · ECDSA · Stack Machine

**Implements**: ECDSA `src/engine.ts:301`, HMAC `src/engine.ts:21`, secp256k1 `src/engine.ts:301`, SHA-256 `src/engine.ts:59`

**Attacks shown**: Signature malleability `src/scenario.ts:239`

**References**: EC point arithmetic, Ed25519, Merkle tree, Schnorr

**Standards body**: IETF, NIST, SECG

**Implementation**: @noble

**README — What Can Go Wrong**:

```text
- **A browser is not a vault:** keys generated in a web tab can be exposed by malicious extensions, cross-site scripting, or clipboard sniffers — never put real funds behind a browser-generated key.
- **Script reveals the public key on spend:** P2PKH hides the key behind a hash until spending, but once spent the key is public; reusing addresses then erodes privacy and (theoretically) quantum resistance.
- **Signatures only commit to what the sighash covers:** the "tampered transaction" scenario shows that changing a signed field breaks the signature — but the flip side is that *un*signed fields (e.g. legacy malleability of the scriptSig) historically caused real bugs.
- **Historical foot-guns are real:** `OP_CHECKMULTISIG`'s off-by-one stack pop and an early value-overflow bug are reminders that even a deliberately small language is not bug-free.
- **This is not consensus-complete:** a real node enforces dozens of additional rules (script size limits, standardness, low-S/strict-DER policy, sequence/locktime semantics) that this teaching model does not.
```

**Claims tested** (e2e/claims.spec.ts, 40 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:71
    - :71 `toBe` expected `0x30` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:72
    - :72 `toBe` expected `b.length - 2` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:74
    - :74 `toBe` expected `0x02` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:78
    - :78 `toBe` expected `0x02` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:81
    - :81 `toBe` expected `b.length` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:95
    - :95 `toHaveCount` expected `SCENARIOS.length` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:104
    - :104 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:245
    - :245 `toBeVisible` expected _no expected value_ _(none)_
- `verdicts` — e2e/claims.spec.ts:256
- `"${title}" ends where it says it will` — e2e/claims.spec.ts:258
    - :265 `toMatch` expected `/should (ACCEPT|REJECT)/` _(regex)_
    - :271 `toMatch` expected `/Script (ACCEPTED — spend is authorized|REJECTED — spend refused)/` _(regex)_
    - :274 `toBe` expected _no expected value_ _(none)_
    - :277 `toBe` expected `title === 'Valid spend'` _(expression)_
    - :281 `toHaveClass` expected `/verdict-accept/` _(regex)_
    - :284 `toEqual` expected `['TRUE']` _(expression)_
    - :286 `toHaveClass` expected `/verdict-reject/` _(regex)_
    - :288 `toContainText` expected `'This rejection is the system working correctly'` _(literal)_
    - :290 `toMatch` expected _no expected value_ _(none)_
    - :295 `expect` expected _no expected value_ _(none)_
- `no verdict is shown until execution actually finishes` — e2e/claims.spec.ts:299
    - :302 `expect` expected _no expected value_ _(none)_
    - :305 `expect` expected _no expected value_ _(none)_
    - :308 `toContainText` expected `'ACCEPTED'` _(literal)_
    - :312 `expect` expected _no expected value_ _(none)_
- `comparison matrix` — e2e/claims.spec.ts:320
- `every row agrees with the run it summarizes` — e2e/claims.spec.ts:321
    - :324 `toEqual` expected `[...SCENARIOS]` _(expression)_
    - :332 `toBe` expected _no expected value_ _(none)_
    - :339 `toBe` expected `true` _(expression)_
    - :340 `toBe` expected `'verify-pass'` _(literal)_
    - :342 `toBe` expected `false` _(expression)_
    - :343 `expect` expected _no expected value_ _(none)_
    - :345 `expect` expected _no expected value_ _(none)_
    - :354 `toBe` expected _no expected value_ _(none)_
    - :359 `toBe` expected `row.scenario === 'Valid spend' ? '✓' : '✗'` _(expression)_
- `only the wrong key is attributed to the attacker` — e2e/claims.spec.ts:363
    - :367 `toBe` expected `row.scenario === 'Wrong public key' ? "attacker's" : "owner's"` _(expression)_
    - :368 `expect` expected _no expected value_ _(none)_
- `stack machine` — e2e/claims.spec.ts:377
- `the popped/pushed diff accounts for every change in stack height` — e2e/claims.spec.ts:378
    - :383 `expect` expected _no expected value_ _(none)_
    - :389 `toBe` expected `i` _(expression)_
    - :391 `expect` expected _no expected value_ _(none)_
    - :396 `toBe` expected _no expected value_ _(none)_
- `P2PKH executes the opcodes in the documented order` — e2e/claims.spec.ts:405
    - :408 `toHaveText` expected `[` _(expression)_
    - :418 `toHaveCount` expected `1` _(literal)_
    - :423 `toBe` expected `2` _(literal)_
    - :437 `toBe` expected `step.token` _(expression)_
    - :438 `toEqual` expected `step.stack` _(expression)_
- `the wrong key never reaches the signature check` — e2e/claims.spec.ts:442
    - :447 `toHaveCount` expected `7` _(literal)_
    - :448 `toBe` expected `6` _(literal)_
    - :455 `expect` expected _no expected value_ _(none)_
    - :456 `toBe` expected `'OP_EQUALVERIFY'` _(literal)_
    - :458 `toBe` expected `'abort'` _(literal)_
    - :459 `expect` expected _no expected value_ _(none)_
    - :460 `toBeDisabled` expected _no expected value_ _(none)_
- `the token rail tracks the cursor and can drive it` — e2e/claims.spec.ts:463
    - :466 `toHaveCount` expected `0` _(literal)_
    - :467 `toHaveCount` expected `0` _(literal)_
    - :471 `toHaveCount` expected `i` _(expression)_
    - :472 `toHaveCount` expected `1` _(literal)_
    - :473 `toBe` expected `(await stepView(page)).token` _(expression)_
    - :478 `toBe` expected `'4'` _(literal)_
    - :479 `toBe` expected `'OP_HASH160'` _(literal)_
    - :480 `toHaveCount` expected `4` _(literal)_
- `the controls bound the cursor at both ends` — e2e/claims.spec.ts:483
    - :486 `toBeDisabled` expected _no expected value_ _(none)_
    - :487 `toBeEnabled` expected _no expected value_ _(none)_
    - :490 `toBeDisabled` expected _no expected value_ _(none)_
    - :491 `toBeEnabled` expected _no expected value_ _(none)_
    - :494 `toBe` expected `String(total - 1)` _(expression)_
    - :495 `toBeEnabled` expected _no expected value_ _(none)_
    - :498 `toBe` expected `'0'` _(literal)_
    - :499 `toBeDisabled` expected _no expected value_ _(none)_
    - :500 `toHaveText` expected `'stack is empty — press Step ▶'` _(literal)_
    - :501 `expect` expected _no expected value_ _(none)_
- `auto-run walks to the verdict on its own and then stops` — e2e/claims.spec.ts:504
    - :509 `toBeVisible` expected _no expected value_ _(none)_
    - :510 `toContainText` expected `'ACCEPTED', { timeout: 15_000 }` _(expression)_
    - :512 `toBeVisible` expected _no expected value_ _(none)_
    - :513 `toBe` expected `String(await stepCount(page))` _(expression)_
- `HASH160 pipeline` — e2e/claims.spec.ts:521
- `the pubKeyHash is the same 20 bytes everywhere the page prints it` — e2e/claims.spec.ts:522
    - :528 `toMatch` expected `/^[0-9a-f]{40}$/` _(regex)_
    - :533 `toBe` expected `pubKeyHash` _(expression)_
    - :536 `toEqual` expected `[pubKeyHash, pubKeyHash]` _(expression)_
    - :537 `toContainText` expected _no expected value_ _(none)_
    - :544 `toBe` expected `'76a914${pubKeyHash}88ac'` _(expression)_
    - :548 `toBe` expected `'76a914${pubKeyHash}88ac'` _(expression)_
- `the address is Base58Check(0x00 || pubKeyHash), verified independently` — e2e/claims.spec.ts:551
    - :554 `toBe` expected `base58check('00' + keys['pubKeyHash'])` _(expression)_
    - :555 `toBe` expected `true` _(expression)_
- `privkey = 1 reproduces the textbook key, hash and address` — e2e/claims.spec.ts:558
    - :567 `toBe` expected `G_HASH160` _(expression)_
    - :568 `toBe` expected `G_ADDRESS` _(expression)_
    - :569 `toBe` expected `base58check('00' + G_HASH160)` _(expression)_
    - :571 `toBe` expected `true` _(expression)_
    - :572 `toBe` expected `true` _(expression)_
    - :576 `toContainText` expected `'ACCEPTED'` _(literal)_
- `the swapped unlock hashes the signature, and says so` — e2e/claims.spec.ts:579
    - :585 `expect` expected _no expected value_ _(none)_
    - :594 `toHaveText` expected `'<pubKey>'` _(literal)_
    - :595 `toHaveText` expected `'<sig>'` _(literal)_
    - :601 `toMatch` expected `/^signature on top of stack \(\d+ bytes\)$/` _(regex)_
    - :603 `toBe` expected `bytes` _(expression)_
    - :606 `toBe` expected `compare[1]` _(expression)_
    - :607 `toContainText` expected _no expected value_ _(none)_
- `sighash inspector` — e2e/claims.spec.ts:617
- `the preimage is the fields concatenated and the sighash is its double SHA-256` — e2e/claims.spec.ts:618
    - :623 `toEqual` expected `[` _(expression)_
    - :632 `toBe` expected `segs.map((s) => s.bytes).join('')` _(expression)_
    - :634 `toBe` expected `sha256dHex(preimage)` _(expression)_
    - :637 `toBe` expected `'01000000'` _(literal)_
    - :638 `toBe` expected `1n` _(expression)_
    - :639 `toBe` expected `0xffffffffn` _(expression)_
    - :640 `toBe` expected `0n` _(expression)_
    - :645 `toBe` expected `segs.find((s) => s.label === 'subscript')!.bytes.length / 2` _(expression)_
    - :646 `toBe` expected _no expected value_ _(none)_
    - :651 `toHaveCount` expected `0` _(literal)_
- `the output value segment matches the amount the tx panel shows` — e2e/claims.spec.ts:654
    - :662 `toBe` expected `sats` _(expression)_
    - :665 `toBe` expected `(Number(sats) / 1e8).toLocaleString('en-US', { maximumFractionDigits: 8 })` _(expression)_
- `tampering changes exactly one field, and exactly one sighash` — e2e/claims.spec.ts:668
    - :677 `expect` expected _no expected value_ _(none)_
    - :686 `toHaveLength` expected `1` _(literal)_
    - :687 `toBe` expected `'output value'` _(literal)_
    - :688 `expect` expected _no expected value_ _(none)_
    - :689 `toBe` expected `100_000_000n` _(expression)_
    - :690 `toBe` expected `50_000n` _(expression)_
    - :694 `toBe` expected `segs.map((s) => s.bytes).join('')` _(expression)_
    - :695 `toBe` expected `sha256dHex(fields['preimage (verifier)'])` _(expression)_
    - :697 `toBe` expected `originalSighash` _(expression)_
    - :700 `expect` expected _no expected value_ _(none)_
    - :701 `expect` expected _no expected value_ _(none)_
    - :702 `expect` expected _no expected value_ _(none)_
    - :705 `toContainText` expected `'⚠ edited after signing'` _(literal)_
- `signature decoder` — e2e/claims.spec.ts:713
- `the decoded r and s really are the DER it displays` — e2e/claims.spec.ts:714
    - :725 `toBe` expected `true` _(expression)_
    - :726 `toBe` expected `true` _(expression)_
    - :727 `toBe` expected `true` _(expression)_
    - :728 `toBe` expected `true` _(expression)_
    - :731 `toBe` expected `true` _(expression)_
    - :732 `toHaveText` expected `'✓ low-S (BIP-146)'` _(literal)_
    - :733 `toHaveText` expected `'✓ SIGHASH_ALL'` _(literal)_
    - :734 `toHaveText` expected `'✓ verifies under policy'` _(literal)_
    - :735 `toHaveCount` expected `0` _(literal)_
- `the high-S signature is the same signature with s replaced by n − s` — e2e/claims.spec.ts:738
    - :754 `toBe` expected `low.r` _(expression)_
    - :755 `toBe` expected `CURVE_N` _(expression)_
    - :756 `toBe` expected `true` _(expression)_
    - :758 `toHaveText` expected _no expected value_ _(none)_
    - :761 `toHaveText` expected `'✗ rejected by policy'` _(literal)_
    - :763 `toContainText` expected _no expected value_ _(none)_
    - :767 `toContainText` expected `'REJECTED'` _(literal)_
- `malformed DER fails closed, with a parse error instead of an exception` — e2e/claims.spec.ts:770
    - :779 `expect` expected _no expected value_ _(none)_
    - :780 `toContainText` expected `'BIP-66 strict DER'` _(literal)_
    - :781 `toHaveText` expected `'✗ OP_CHECKSIG → FALSE'` _(literal)_
    - :783 `expect` expected _no expected value_ _(none)_
    - :784 `expect` expected _no expected value_ _(none)_
    - :787 `toContainText` expected `'REJECTED'` _(literal)_
    - :788 `toEqual` expected `[]` _(expression)_
- `the decoder agrees with OP_CHECKSIG on every scenario` — e2e/claims.spec.ts:791
    - :805 `toBe` expected `accepted` _(expression)_
    - :807 `toBe` expected `false` _(expression)_
- `advanced inputs` — e2e/claims.spec.ts:818
- `bad inputs are refused with a reason, and nothing changes` — e2e/claims.spec.ts:819
    - :837 `toHaveText` expected `message` _(expression)_
    - :839 `toEqual` expected `before` _(expression)_
    - :847 `toHaveText` expected `''` _(literal)_
    - :848 `toBe` expected `before['pubKeyHash']` _(expression)_
- `a custom output value flows through the tx, the sighash and the verdict` — e2e/claims.spec.ts:851
    - :862 `toContainText` expected `'123,456 sat (0.00123456 BTC)'` _(literal)_
    - :865 `toBe` expected `123_456n` _(expression)_
    - :868 `toBe` expected `segs.map((s) => s.bytes).join('')` _(expression)_
    - :869 `toBe` expected `sha256dHex(fields['preimage (verifier)'])` _(expression)_
    - :870 `toBe` expected `originalSighash` _(expression)_
    - :874 `toContainText` expected `'ACCEPTED'` _(literal)_
- `new keys really are new, and the spend still verifies` — e2e/claims.spec.ts:877
    - :883 `toBe` expected `before['private key']` _(expression)_
    - :884 `toBe` expected `before['public key']` _(expression)_
    - :885 `toBe` expected `before['pubKeyHash']` _(expression)_
    - :886 `toBe` expected `base58check('00' + after['pubKeyHash'])` _(expression)_
    - :889 `toContainText` expected `'ACCEPTED'` _(literal)_
    - :892 `toBe` expected `'76a914${after['pubKeyHash']}88ac'` _(expression)_
- `the boot self-test runs and passes, with no page errors` — e2e/claims.spec.ts:900
    - :913 `expect` expected _no expected value_ _(none)_
    - :916 `expect` expected _no expected value_ _(none)_
    - :917 `toBe` expected `found[2]` _(expression)_
    - :918 `toBe` expected `G_HASH160` _(expression)_
    - :919 `expect` expected _no expected value_ _(none)_
    - :920 `toEqual` expected `[]` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-bitcoin-script

## What It Is

An interactive model of **Bitcoin Script** — the tiny, stack-based language that defines who is allowed to spend each bitcoin — using **real cryptography in the browser**. The page composes [`@noble/secp256k1`](https://github.com/paulmillr/noble-secp256k1) and [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) libraries to build a genuine **Pay-to-Public-Key-Hash (P2PKH)** spend end to end: a secp256k1 key pair, a HASH160 (SHA-256 → RIPEMD-160) commitment in the locking script, a real **legacy SIGHASH_ALL** preimage over a concrete one-input/one-output transaction, an **ECDSA** signature (low-S, DER-encoded) in the unlocking script, and a hand-rolled stack interpreter that executes `OP_DUP · OP_HASH160 · OP_EQUALVERIFY · OP_CHECKSIG` one step at a time. Nothing is faked: the signature math, the hashes, and the sighash are all the real thing, validated at boot against the textbook privkey = 1 key whose HASH160 is `751e76e8199196d454941c45d1b3a323f1433bd6` (address `1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH`). Keys are generated per session in memory and never persisted — this is **for education only**.

The lockfile selects `@noble/secp256k1` 3.2.0 and `@noble/hashes` 2.4.0. The secp256k1 publisher [states that the current rewrite has not been independently audited](https://github.com/paulmillr/noble-secp256k1/blob/04c95fb63085e862a14616ce5b86549fea56191c/README.md#security); its v1 audit does not establish an audit of this locked version. Signing and verification use `prehash: false` because the lab already computes the Bitcoin double-SHA256 digest. Compact 64-byte SDK signatures pass through the existing Bitcoin DER wrapper and SIGHASH_ALL byte. Regression tests independently verify those signatures with Node/OpenSSL and reject the extra-hash case.

## When to Use It

- **Connecting digital signatures to how Bitcoin actually works** — students who have seen ECDSA in isolation can watch a signature get *checked by a script* to release funds, closing the gap between "I understand signatures" and "I understand spending conditions".
- **Teaching the stack machine concretely** — step through a real P2PKH script and see each opcode push and pop a shared stack, rather than reading the opcodes as abstract names.
- **Showing why bad spends are rejected** — flip between a valid spend, a wrong public key, a forged signature, and a tampered transaction, and see exactly *where* and *why* each invalid attempt fails.
- **Motivating the move to Taproot** — the page frames P2PK → P2PKH → P2TR so the trade-offs (key exposure, size, privacy) are visible.
- **Do NOT treat this as a wallet, a node, or a consensus implementation.** It models the single-signature P2PKH path for teaching; it does not validate full transactions, enforce every consensus rule, or handle multisig/timelocks/Taproot key tweaks.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-bitcoin-script](https://systemslibrarian.github.io/crypto-lab-bitcoin-script/)**

A coin is locked to an owner's `pubKeyHash`. Pick one of four spend scenarios — **Valid spend**, **Wrong public key**, **Forged signature**, or **Tampered transaction** — and the page assembles the matching `scriptSig` (unlock) and `scriptPubKey` (lock), signs (or mis-signs) a real transaction, and shows the resulting stack program. Then **Step ▶** (or **Auto-run**) walks the execution: the token strip highlights the current opcode while the stack grows and shrinks beside a plain-language description of each step, ending in an **ACCEPT** or **REJECT** verdict. Three of the four scenarios reject — and each rejection is the security model working: the wrong key aborts at `OP_EQUALVERIFY` before the signature is even checked, while the forged signature and the tampered transaction both fail at `OP_CHECKSIG`. **⟳ New keys** regenerates the key pair; the page is dark throughout.

## What Can Go Wrong

- **A browser is not a vault:** keys generated in a web tab can be exposed by malicious extensions, cross-site scripting, or clipboard sniffers — never put real funds behind a browser-generated key.
- **Script reveals the public key on spend:** P2PKH hides the key behind a hash until spending, but once spent the key is public; reusing addresses then erodes privacy and (theoretically) quantum resistance.
- **Signatures only commit to what the sighash covers:** the "tampered transaction" scenario shows that changing a signed field breaks the signature — but the flip side is that *un*signed fields (e.g. legacy malleability of the scriptSig) historically caused real bugs.
- **Historical foot-guns are real:** `OP_CHECKMULTISIG`'s off-by-one stack pop and an early value-overflow bug are reminders that even a deliberately small language is not bug-free.
- **This is not consensus-complete:** a real node enforces dozens of additional rules (script size limits, standardness, low-S/strict-DER policy, sequence/locktime semantics) that this teaching model does not.

## Real-World Usage

- P2PKH (`OP_DUP OP_HASH160 <hash> OP_EQUALVERIFY OP_CHECKSIG`) secured the majority of historical Bitcoin transactions and is still widely seen on-chain.
- secp256k1 ECDSA with DER-encoded signatures and a SIGHASH byte is the exact signature format that appears inside real Bitcoin `scriptSig`/witness data.
- The same stack machine scales to richer conditions: multisig (`OP_CHECKMULTISIG`), timelocks (`OP_CHECKLOCKTIMEVERIFY` / `OP_CHECKSEQUENCEVERIFY`), and Lightning Network HTLCs.
- Taproot (P2TR) replaces this pattern for new outputs with Schnorr signatures and key aggregation, improving privacy and efficiency for the common cooperative case.

## How to Run Locally

Use Node.js 24, matching the application CI runtime.

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-bitcoin-script
cd crypto-lab-bitcoin-script
npm install
npm run dev
`​``

No environment variables, no API keys, no servers — everything runs client-side. The build bundles `@noble/secp256k1` and `@noble/hashes` into a single static JS file deployed straight to GitHub Pages, with no remote services and no telemetry. Additional scripts: `npm run build` (tsc + production build to `dist/`), `npm run preview` (serve the built `dist/` locally), and `npm test` (Vitest: engine known-answers, a jsdom run that drives the real stepper, and an axe-core WCAG 2 A/AA gate).

For browser verification, run `npx playwright install chromium`, then `npm run test:browser` and `npm run test:a11y`. The smoke suite uses installed Windows Edge when available and the installed Playwright Chromium on other systems. `CRYPTO_LAB_BROWSER_PATH` can select an existing browser executable for verification; it is not required by the application. Both browser suites gate the Pages deployment.

## Related Demos

- [crypto-lab-bitcoin-wallet](https://systemslibrarian.github.io/crypto-lab-bitcoin-wallet/) — keys → P2PKH/P2WPKH addresses, BIP-39 mnemonics, and BIP-32 HD derivation: where the keys this script checks come from.
- [crypto-lab-ecdsa-forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) — secp256k1 ECDSA signing, RFC-6979 nonces, and nonce-reuse key recovery up close.
- [crypto-lab-ec-point-arithmetic](https://systemslibrarian.github.io/crypto-lab-ec-point-arithmetic/) — point addition and scalar multiplication, the group law under the curve.
- [crypto-lab-hash-zoo](https://systemslibrarian.github.io/crypto-lab-hash-zoo/) — the hash families (SHA-256, RIPEMD-160) behind HASH160 and the sighash.
- [crypto-lab-ed25519-forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) — a different signature scheme, for contrast with ECDSA.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Chain of Trust

- **slug**: `crypto-lab-chain-of-trust`
- **repo**: https://github.com/systemslibrarian/crypto-lab-chain-of-trust
- **live**: https://systemslibrarian.github.io/crypto-lab-chain-of-trust/
- **commit_sha**: `1328416c0b621c3a3f9a8d56afbd799643d2e8ca` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | PROTOCOLS  ·  **level**: beginner  ·  **--accent**: #15803d
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Chain of Trust  — _read from index.html_

**Subtitle**: X.509 path building & validation · RFC 5280  — _read from index.html_

**Description**: Builds a real ECDSA P-256 certificate hierarchy in your browser and puts you in the validator's seat: assemble chains, run the RFC 5280 checklist, and watch valid signatures get rejected.  — _read from index.html_

**Why it matters**: Every TLS connection stands on this checklist — and its famous failures (CA:FALSE accepted, expired cross-signs, builders that never backtrack) were bugs in constraint checking, not broken math. Knowing why a valid signature can still mean REJECT is knowing how the web's PKI actually holds.  — _read from index.html_

**Card copy**: X.509 path building vs RFC 5280 validation on a real cross-signed ECDSA hierarchy — build chains yourself, watch a naive builder fail a valid leaf, and see valid signatures rejected.

**Chips**: X.509 · RFC 5280 · ECDSA P-256 · nameConstraints

**Implements**: ECDSA `src/pki/certgen.ts:77`, P-256 `src/pki/certgen.ts:20`, SHA-256 `src/pki/certgen.ts:77`

**Attacks shown**: _none derived_

**Standards body**: NIST

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `FIPS 180-4` — first seen README.md:138 (1×)
- `FIPS 186-4` — first seen README.md:12 (1×)
- `RFC 4158` — first seen README.md:38 (3×)
- `RFC 5280` — first seen README.md:1 (47×)
- `RFC 6125` — first seen README.md:9 (10×)
- `RFC 6979` — first seen README.md:138 (1×)
- `RFC 9525` — first seen README.md:9 (8×)

**Stated limitations (page)**:

- _(scope-note, index.html)_ Honest scope — what's real here, what isn't Real: every certificate is real DER, generated fresh in your browser each session, signed with real ECDSA P-256 (WebCrypto) via @peculiar/x509. Every signature verdict shown is a real WebCrypto verification. The RFC 5280 §6 checks (basicConstraints, pathLen, keyUsage, nameConstraints, EKU, validity, trust anchoring) and RFC 6125/9525 hostname matching are implemented in inspectable TypeScript in this repo. Fixture: revocation statuses are local, hard-coded inputs. This lab performs no CRL or OCSP network fetch — the teaching point is that revocation is an input to validation, not a property of the signature. Not proven: this is a teaching subset of RFC 5280 §6, not a production validator — no policy mapping, no IP/email name constraints, no ASN.1 hardening. Keys live in memory for this session only. Not production crypto — a teaching demo.

**README — What Can Go Wrong**:

```text
Each is a stage in the puzzle; each shipped somewhere as a real bug:

- **Skipping basicConstraints** — any website's key becomes a CA (iOS CVE-2011-0228 class).
- **Not backtracking during path building** — "no valid chain" for leaves with valid chains
  (OpenSSL 1.0.2 / DST Root X3, September 2021).
- **CN fallback** — accepting a certificate for a host its SAN never named.
- **Ignoring nameConstraints, pathLen, or keyUsage** — delegated authority silently escapes the
  territory or depth it was granted.
- **Failing open on revocation** — accepting certificates their issuer has disowned.
- **Trusting the presented "root"** — a self-signed certificate is real cryptography and empty
  authority.
```

**Claims tested** (e2e/claims.spec.ts, 19 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:17
    - :17 `toContainText` expected `'ready', { timeout: 30_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:18
    - :18 `toBeVisible` expected _no expected value_ _(none)_
- `the naive builder fails a leaf that has a valid path, and says why` — e2e/claims.spec.ts:61
    - :64 `toBeVisible` expected `{ timeout: 30_000 }` _(expression)_
    - :69 `expect` expected _no expected value_ _(none)_
    - :70 `expect` expected _no expected value_ _(none)_
    - :71 `expect` expected _no expected value_ _(none)_
    - :72 `expect` expected _no expected value_ _(none)_
    - :73 `toHaveLength` expected `1` _(literal)_
    - :79 `expect` expected _no expected value_ _(none)_
    - :80 `expect` expected _no expected value_ _(none)_
    - :84 `expect` expected _no expected value_ _(none)_
    - :85 `expect` expected _no expected value_ _(none)_
    - :86 `expect` expected _no expected value_ _(none)_
    - :89 `expect` expected _no expected value_ _(none)_
    - :90 `expect` expected _no expected value_ _(none)_
    - :91 `expect` expected _no expected value_ _(none)_
    - :92 `expect` expected _no expected value_ _(none)_
    - :96 `toEqual` expected `{` _(expression)_
    - :103 `toHaveCount` expected `2` _(literal)_
    - :104 `toHaveCount` expected `0` _(literal)_
- `the backtracking builder recovers, and its counter matches its own log` — e2e/claims.spec.ts:107
    - :110 `toBeVisible` expected `{ timeout: 30_000 }` _(expression)_
    - :114 `expect` expected _no expected value_ _(none)_
    - :115 `expect` expected _no expected value_ _(none)_
    - :116 `expect` expected _no expected value_ _(none)_
    - :117 `expect` expected _no expected value_ _(none)_
    - :118 `expect` expected _no expected value_ _(none)_
    - :119 `expect` expected _no expected value_ _(none)_
    - :122 `expect` expected _no expected value_ _(none)_
    - :123 `expect` expected _no expected value_ _(none)_
    - :124 `expect` expected _no expected value_ _(none)_
    - :129 `toBe` expected `tags.filter((t) => t === 'VALIDATE').length` _(expression)_
    - :130 `toBe` expected `2` _(literal)_
    - :132 `toEqual` expected `{` _(expression)_
- `both builders see identical cryptography — only the search differs` — e2e/claims.spec.ts:141
    - :144 `toBeVisible` expected `{ timeout: 30_000 }` _(expression)_
    - :148 `toBeVisible` expected `{ timeout: 30_000 }` _(expression)_
    - :154 `toEqual` expected `naive.slice(0, naive.length - 1)` _(expression)_
    - :155 `expect` expected _no expected value_ _(none)_
    - :160 `toHaveText` expected `'Verdict: REJECT ✗'` _(literal)_
    - :161 `toContainText` expected `'Fails: nameConstraints (territory).'` _(literal)_
- `the same bytes get four different verdicts from four trust stores, with the signature facts frozen` — e2e/claims.spec.ts:166
    - :178 `toBeVisible` expected _no expected value_ _(none)_
    - :179 `toContainText` expected `'Fails: nameConstraints (territory).'` _(literal)_
    - :180 `toHaveText` expected `'Verdict: ACCEPT ✓'` _(literal)_
    - :181 `toContainText` expected `'Every check passes under this store.'` _(literal)_
    - :182 `toHaveText` expected `FACT` _(expression)_
    - :183 `toHaveText` expected `FACT` _(expression)_
    - :187 `toContainText` expected `'Trust anchor'` _(literal)_
    - :188 `toBeVisible` expected _no expected value_ _(none)_
    - :189 `toBeVisible` expected _no expected value_ _(none)_
    - :190 `toHaveText` expected `FACT` _(expression)_
    - :195 `toHaveText` expected `'Verdict: REJECT ✗'` _(literal)_
    - :196 `toContainText` expected `'Trust anchor'` _(literal)_
    - :197 `toHaveText` expected `FACT` _(expression)_
    - :201 `toBeVisible` expected _no expected value_ _(none)_
    - :202 `toBeVisible` expected _no expected value_ _(none)_
    - :203 `toContainText` expected `'Trust anchor'` _(literal)_
    - :204 `toContainText` expected `'Trust anchor'` _(literal)_
    - :205 `toHaveText` expected `FACT` _(expression)_
    - :206 `toHaveText` expected `FACT` _(expression)_
    - :211 `toHaveText` expected `'Verdict: ACCEPT ✓'` _(literal)_
- `all ten stages: the intended path is graded correct, and every REJECT has flawless signatures` — e2e/claims.spec.ts:247
    - :251 `toHaveCount` expected `10` _(literal)_
    - :266 `toContainText` expected `'✓ Correct.'` _(literal)_
    - :267 `toContainText` expected `'Signature: valid ✓'` _(literal)_
    - :268 `expect` expected _no expected value_ _(none)_
    - :277 `toContainText` expected `'the cryptography is flawless'` _(literal)_
    - :281 `toEqual` expected `stage.fails` _(expression)_
    - :283 `toBe` expected `stage.verdict === 'REJECT'` _(expression)_
    - :286 `toContainText` expected `'Lesson:'` _(literal)_
    - :287 `toHaveClass` expected `/stage-solved/` _(regex)_
    - :288 `toHaveText` expected _no expected value_ _(none)_
    - :294 `toHaveCount` expected `10` _(literal)_
    - :295 `toHaveText` expected `'Solved 10 of 10 stages.'` _(literal)_
    - :299 `toHaveText` expected `'Solved 0 of 10 stages.'` _(literal)_
    - :300 `toHaveCount` expected `0` _(literal)_
- `accepting a chain the validator rejects raises the alarm and names exactly the failed checks` — e2e/claims.spec.ts:303
    - :311 `toContainText` expected `'You accepted a chain the RFC 5280 validator rejects'` _(literal)_
    - :313 `toContainText` expected `'every signature in your chain is genuinely valid'` _(literal)_
    - :314 `toContainText` expected `'Signature: valid ✓'` _(literal)_
    - :315 `toHaveText` expected `'Verdict: REJECT ✗'` _(literal)_
    - :320 `toEqual` expected `await failedChecks(box)` _(expression)_
    - :321 `toEqual` expected `['basicConstraints (CA authority)', 'keyUsage (keyCertSign)']` _(expression)_
    - :324 `toHaveText` expected `'Solved 0 of 10 stages.'` _(literal)_
    - :325 `toHaveCount` expected `0` _(literal)_
- `right verdict for the wrong reason is not a pass` — e2e/claims.spec.ts:328
    - :337 `toContainText` expected `'Right verdict, wrong reason:'` _(literal)_
    - :338 `toContainText` expected `'you blamed "Hostname (SAN does not match the host)"'` _(literal)_
    - :339 `toContainText` expected `'what actually fails is: basicConstraints (CA authority); keyUsage (keyCertSign)'` _(literal)_
    - :340 `toHaveText` expected `'Solved 0 of 10 stages.'` _(literal)_
    - :345 `toContainText` expected `'pick the failing check from the list'` _(literal)_
    - :346 `toHaveText` expected `'Solved 0 of 10 stages.'` _(literal)_
    - :351 `toContainText` expected `'✓ Correct.'` _(literal)_
    - :352 `toHaveText` expected `'Solved 1 of 10 stages.'` _(literal)_
- `rejecting a valid chain is graded as too strict, not as correct` — e2e/claims.spec.ts:355
    - :363 `toContainText` expected `'Too strict:'` _(literal)_
    - :364 `toContainText` expected `'the validator accepts this path — every check passes'` _(literal)_
    - :365 `toHaveText` expected `'Verdict: ACCEPT ✓'` _(literal)_
    - :366 `toEqual` expected `[]` _(expression)_
    - :367 `toHaveText` expected `'Solved 0 of 10 stages.'` _(literal)_
- `an incomplete path is graded as built, and does not credit the stage` — e2e/claims.spec.ts:370
    - :379 `toContainText` expected `'You were graded on the path exactly as you built it'` _(literal)_
    - :381 `expect` expected _no expected value_ _(none)_
    - :382 `toHaveText` expected `'Solved 0 of 10 stages.'` _(literal)_
- `every failed check links to the certificate field that decided it` — e2e/claims.spec.ts:385
    - :394 `toHaveText` expected _no expected value_ _(none)_
    - :398 `toHaveCount` expected `1` _(literal)_
    - :399 `toContainText` expected `'basicConstraints'` _(literal)_
    - :400 `toContainText` expected `'CA:FALSE'` _(literal)_
    - :408 `toContainText` expected `'subjectAltName'` _(literal)_
    - :409 `toContainText` expected `'www.example.test'` _(literal)_
- `the inspector holds all 19 certificates and decodes the fields the stages turn on` — e2e/claims.spec.ts:414
    - :417 `toHaveCount` expected `19` _(literal)_
    - :424 `toHaveText` expected `name` _(expression)_
    - :429 `expect` expected _no expected value_ _(none)_
    - :432 `expect` expected _no expected value_ _(none)_
    - :435 `expect` expected _no expected value_ _(none)_
    - :436 `expect` expected _no expected value_ _(none)_
    - :439 `expect` expected _no expected value_ _(none)_
    - :442 `toBe` expected `'shop.example.test'` _(literal)_
    - :443 `expect` expected _no expected value_ _(none)_
    - :446 `expect` expected _no expected value_ _(none)_
    - :447 `expect` expected _no expected value_ _(none)_
- `cross-signing is visible in the bytes: one key, two certificates` — e2e/claims.spec.ts:450
    - :454 `toHaveText` expected `'www.example.test (leaf)'` _(literal)_
    - :463 `toHaveLength` expected `2` _(literal)_
    - :464 `expect` expected _no expected value_ _(none)_
    - :465 `expect` expected _no expected value_ _(none)_
    - :466 `expect` expected _no expected value_ _(none)_
- `the DER dump contains exactly as many bytes as its header claims` — e2e/claims.spec.ts:469
    - :474 `toHaveText` expected `name` _(expression)_
    - :478 `toHaveLength` expected `claimed` _(expression)_
    - :479 `toMatch` expected `/^[0-9a-f]{2}( [0-9a-f]{2})*$/` _(regex)_
    - :481 `toBe` expected `'30'` _(literal)_
- `imported chains fail closed on unparseable input` — e2e/claims.spec.ts:487
    - :492 `toContainText` expected `'Input rejected (fail closed)'` _(literal)_
    - :493 `toContainText` expected `'no "-----BEGIN CERTIFICATE-----" blocks found'` _(literal)_
    - :494 `toHaveCount` expected `0` _(literal)_
    - :501 `toContainText` expected `'Input rejected (fail closed)'` _(literal)_
- `the lab's own chain imports to UNKNOWN — never a clean ACCEPT` — e2e/claims.spec.ts:504
    - :509 `toHaveLength` expected `2` _(literal)_
    - :510 `expect` expected _no expected value_ _(none)_
    - :513 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :516 `toContainText` expected `'Signature: valid ✓'` _(literal)_
    - :517 `toHaveText` expected `'Verdict: UNKNOWN — revocation not evaluated'` _(literal)_
    - :518 `toHaveCount` expected `0` _(literal)_
    - :521 `toEqual` expected `[]` _(expression)_
    - :522 `toHaveCount` expected `1` _(literal)_
    - :523 `toHaveCount` expected `1` _(literal)_
    - :524 `toContainText` expected `'no CRL/OCSP fetch'` _(literal)_
- `flipping one base64 character breaks the signature check, exactly as the README promises` — e2e/claims.spec.ts:527
    - :538 `toBe` expected `pem` _(expression)_
    - :542 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :547 `toHaveText` expected `'Signature: INVALID ✗ (a link fails real ECDSA verification)'` _(literal)_
    - :548 `toHaveText` expected `'Verdict: REJECT ✗'` _(literal)_
    - :550 `toBe` expected `true` _(expression)_
    - :551 `toContainText` expected `'does NOT verify'` _(literal)_
    - :553 `toContainText` expected `'No valid path found'` _(literal)_
- `an imported chain is judged for the host and purpose you name, not the one it was made for` — e2e/claims.spec.ts:556
    - :566 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :567 `toContainText` expected `'Signature: valid ✓'` _(literal)_
    - :568 `toHaveText` expected `'Verdict: REJECT ✗'` _(literal)_
    - :569 `toContainText` expected `'No valid path found'` _(literal)_
    - :570 `toEqual` expected `[` _(expression)_
    - :579 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :580 `toContainText` expected `'Signature: valid ✓'` _(literal)_
    - :581 `toEqual` expected `['Trust anchor', 'extendedKeyUsage (clientAuth)']` _(expression)_
    - :586 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :587 `toBeVisible` expected _no expected value_ _(none)_
    - :588 `toEqual` expected `[]` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Chain of Trust — X.509 path building & validation (RFC 5280)

A real X.509 hierarchy the learner must validate by hand, showing that **finding a chain and
validating a chain are two different problems — and only one of them is about signatures**.

## What It Is

An interactive, browser-only demo of **X.509 certification path building and path validation**
(RFC 5280 §6, with RFC 6125/RFC 9525 server identity). On load it generates a fresh PKI in your
browser — two roots, a **cross-signed issuing CA** (one key, two certificates), and a branch of
deliberately defective intermediates and leaves — 19 certificates of real DER, each carrying a real
**ECDSA P-256** (FIPS 186-4) signature made through WebCrypto via
[`@peculiar/x509`](https://github.com/PeculiarVentures/x509). The RFC 5280 checks
(basicConstraints, pathLenConstraint, keyUsage, nameConstraints, EKU, validity, trust anchoring),
the hostname matcher, and both path builders are hand-rolled, inspectable TypeScript in
`src/pki/`.

The concept it teaches: **a valid signature on a certificate means someone signed it. It says
nothing about whether that someone was allowed to.** Path building is search; path validation is a
checklist of constraints that have nothing to do with cryptography — and the checklist is where
the bugs live. Throughout the UI the cryptographic result and the security verdict are rendered as
two separate indicators; `Signature: valid ✓ / Verdict: REJECT ✗` is the whole lab in one line.

Security model honesty: revocation statuses are **local fixtures** (no CRL/OCSP network fetch —
deliberately, since the point is that revocation is an *input* to validation). This is a teaching
subset of RFC 5280 §6 — no policy mapping, no IP/email name constraints, no ASN.1 hardening.
Imported chains therefore receive `UNKNOWN`, rather than `ACCEPT`, when every evaluated check
passes but revocation was not evaluated.
**Not production crypto — a teaching demo.**

## Exhibits

1. **Building a path ≠ validating it** — the headline mechanism. A cross-signed diamond:
   `leaf → cross-sign A → Root X` is cryptographically flawless but fails nameConstraints;
   `leaf → cross-sign B → Root Y` is valid. Run the **naive builder** (commits to the first
   signature-valid issuer, no backtracking) and watch it report *no valid chain* for a leaf that
   has one — the bug class that made OpenSSL 1.0.2 clients reject valid Let's Encrypt chains when
   DST Root X3 expired in September 2021. Then run the **backtracking builder** (RFC 4158 style)
   on the same bytes and watch it recover. Every step in the animation is a real ECDSA
   verification or a real validator run.
2. **You are the validator** — puzzle mode, ten stages, learner-triggered one at a time. Each
   stage hands you a leaf, a bag of intermediates, and a trust store; you assemble the path and
   rule ACCEPT or REJECT (naming the failing check). Grading runs the real RFC 5280 §6
   implementation on the exact path you built and tells you which check you missed. Every stage
   carries a hint that points where to look without naming the check (a test enforces that),
   every failed check links straight to its evidence — the exact certificate fields, highlighted
   in the inspector — and a plain-language glossary sits where the jargon first bites. The trap
   ladder: valid baseline · basicConstraints CA:FALSE (the classic — signature fine, authority
   absent, cf. iOS CVE-2011-0228) · pathLenConstraint exceeded · expired intermediate under a
   fresh leaf · hostname vs SAN vs deprecated CN fallback · nameConstraints subtree violation ·
   EKU mismatch (clientAuth cert validated for serverAuth) · keyUsage lacking keyCertSign ·
   revoked intermediate (fixture status) · self-signed leaf presented as its own root. In every
   REJECT stage the signature chain is fully valid — that is the lab's thesis, and it is pinned by
   a test.
3. **Same chain, different trust store** — both cross-sign paths re-validated live under every
   combination of trusted roots. The bytes and ECDSA results never change; the verdicts do.
   Trust is configuration, not mathematics.
4. **Certificate inspector** — every certificate in the lab: parsed fields, decoded extensions
   (where all the authority lives), full DER hex, and a live signature verdict against every
   candidate issuer key.
5. **Bring your own chain** — paste any real PEM chain plus the anchors you choose to trust, and
   run the same builder and validator against it, entirely in the tab (nothing is uploaded or
   fetched). Revocation for imported chains is reported honestly as NOT EVALUATED, never as a
   clean pass. A one-click example loads the lab's own chain as editable PEM — flip one base64
   character and watch the signature check fail.

## When to Use It

- To learn or teach why X.509 validation is a *checklist*, not a signature check — before reading
  RFC 5280 §6 itself.
- To understand real incidents: CA:FALSE acceptance bugs, the DST Root X3 expiry, cross-signing
  and why "which chain did you build?" changes the answer.
- To build intuition for why trust stores — pure configuration — decide what the same mathematics
  means.
- **Do NOT use it** as a validation library, as a reference implementation for production path
  validation, or as evidence that a particular client behaves a particular way. The validator here
  is a teaching subset; production validators handle policy constraints, name forms, and encodings
  this lab deliberately omits.

## Live Demo

**<https://systemslibrarian.github.io/crypto-lab-chain-of-trust/>**

Run both builders on the cross-signed diamond, play the ten validator stages (try accepting the
CA:FALSE chain and read the alarm), flip roots in and out of the trust store, and read the DER of
anything you don't believe.

## What Can Go Wrong

Each is a stage in the puzzle; each shipped somewhere as a real bug:

- **Skipping basicConstraints** — any website's key becomes a CA (iOS CVE-2011-0228 class).
- **Not backtracking during path building** — "no valid chain" for leaves with valid chains
  (OpenSSL 1.0.2 / DST Root X3, September 2021).
- **CN fallback** — accepting a certificate for a host its SAN never named.
- **Ignoring nameConstraints, pathLen, or keyUsage** — delegated authority silently escapes the
  territory or depth it was granted.
- **Failing open on revocation** — accepting certificates their issuer has disowned.
- **Trusting the presented "root"** — a self-signed certificate is real cryptography and empty
  authority.

## Real-World Usage

Every TLS client runs this algorithm on every connection: browsers (Chrome's verifier, Apple's,
Mozilla NSS), OpenSSL/BoringSSL/rustls, and OS trust stores. Cross-signing is how new roots
bootstrap (ISRG Root X1 via DST Root X3); nameConstraints scope enterprise and government CAs;
EKU and keyUsage separation is CA/Browser Forum baseline policy. The failures this lab stages are
drawn from that history, with the honest caveat that each real incident had its own specific
failing check.

## How to Run Locally

`​``bash
npm install
npm run dev        # serves on http://localhost:5173
npm test           # 77 unit tests incl. 6 KATs
npm run build      # typecheck + production build
npm run test:a11y  # axe-core WCAG 2.1 A/AA gate, both themes (build first)
`​``

Requires Node 20+ (WebCrypto). No backend; keys are generated per session in memory and never
persisted.

## Related Demos

- [crypto-lab-tls-handshake](https://systemslibrarian.github.io/crypto-lab-tls-handshake/) — the
  protocol these certificates arrive inside.
- [crypto-lab-pki-chain](https://systemslibrarian.github.io/crypto-lab-pki-chain/) — PKI chains
  with Certificate Transparency, the public-log answer to mis-issuance.
- [crypto-lab-web-of-trust](https://systemslibrarian.github.io/crypto-lab-web-of-trust/) — the
  decentralized alternative to hierarchical trust.
- [crypto-lab-ecdsa-forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) — the
  signature primitive itself, and how it fails.

## Build & Verify

- **77 Vitest tests** (`npm test`), including **6 known-answer tests** in `src/pki/kat.test.ts`:
  2 SHA-256 KATs (FIPS 180-4) and 4 ECDSA P-256 verification KATs (RFC 6979 §A.2.5 vectors — two
  accept, two must-reject), all through the same WebCrypto the demo uses.
- Behavioral tests pin the validator against **every stage of the trap ladder** (verdict, failing
  check, and the signature-chain fact independently), the naive-vs-backtracking builder outcomes,
  hostname matching, nameConstraints subtree semantics, PEM import round-trips, and invariants:
  any failed check forces REJECT, the builder never revisits a certificate, and empty/duplicate
  paths fail closed.
- **Rendered claims are gated too** (`e2e/claims.spec.ts`): the production build is driven in
  Chromium and every verdict on screen is re-derived. All ten stages are played to a correct
  ruling with exactly the intended checks failing and the signature fact still reading
  `valid ✓`; the alarm's "check you missed" must list precisely the `✗ FAIL` rows beneath it;
  "Candidate paths validated: N" must equal the number of validator runs in the step log; the
  trust-store matrix must change all four verdicts while the signature chips stay byte-identical;
  the DER dump must hold exactly as many bytes as its own header claims; and flipping one base64
  character of an imported chain must fail the signature check, not a policy check.
- Extending the lab? Read [docs/MAINTAINERS.md](docs/MAINTAINERS.md) — validator check order,
  stage-authoring rules, and why the fact/verdict split is non-negotiable.
- **Accessibility is gated in CI**: `npm run test:a11y` scans the production build with
  axe-core (WCAG 2.1 A/AA) in **both** themes plus a 390px mobile viewport — after driving the
  live demo into its alarm states — and the GitHub Pages deploy in
  `.github/workflows/deploy.yml` is blocked if it fails.

## Performance

PKI generation (19 ECDSA P-256 keypairs + certificates) takes well under a second in a modern
browser; every validator run is a handful of WebCrypto verifications and completes in
milliseconds.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Signed Bytes

- **slug**: `crypto-lab-signed-bytes`
- **repo**: https://github.com/systemslibrarian/crypto-lab-signed-bytes
- **live**: https://systemslibrarian.github.io/crypto-lab-signed-bytes/
- **commit_sha**: `66f20c42dec1f3e72bdd52a23deb2f14661e4e0a` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `e670ce5d81040511185b8f43bb9205505d59e8cc`
- **read_from**: working tree (clean)
- **category**: SIGNATURES | ATTACKS  ·  **level**: beginner  ·  **--accent**: #c2410c
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: Signed Bytes  — _read from index.html_

**Subtitle**: Canonicalization · JCS RFC 8785 · Ed25519 RFC 8032  — _read from index.html_

**Description**: Runs real Ed25519 signatures over JSON byte strings so you can watch two documents that mean the same thing verify differently — and one validly-signed document mean two different things.  — _read from index.html_

**Why it matters**: Every signed API request, webhook, and software manifest is a byte string that some parser turns back into meaning. Real systems have been broken not by forged signatures but by the gap between the bytes that were signed and the meaning a downstream parser recovered.  — _read from index.html_

**Card copy**: Real Ed25519 over JSON — a signature binds an exact byte string, never the parsed meaning. Break key order, Unicode, and duplicate keys, then watch JCS canonicalization fix some and refuse others.

**Chips**: Ed25519 · JCS RFC 8785 · Parser Differential · Unicode NFC

**Implements**: Ed25519 `src/crypto/ed25519.ts:16`, SHA-256 `src/core/hash.ts:6`, SHA-512 `src/crypto/ed25519.ts:17`

**Attacks shown**: Signature malleability `README.md:67`

**References**: WebAuthn

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `FIPS 186-5` — first seen src/crypto/ed25519.ts:13 (1×)
- `RFC 7493` — first seen README.md:29 (6×)
- `RFC 7515` — first seen README.md:49 (1×)
- `RFC 8032` — first seen README.md:5 (9×)
- `RFC 8259` — first seen README.md:5 (10×)
- `RFC 8785` — first seen README.md:5 (25×)
- `RFC 8949` — first seen README.md:27 (4×)

**README — What Can Go Wrong**:

```text
- **Fail-closed friction (Stages 1, 2, 4)** — any re-encoding between signing and verifying breaks verification: not an integrity failure, but an availability/interop failure that pushes teams toward dangerous "fixes."
- **Normalization after signing (Stage 2)** — a transport layer that "cleans up" Unicode is indistinguishable from tampering to the verifier. Normalization is only safe as an explicit contract applied on both sides *before* the signature.
- **Parser differentials (Stage 3)** — the signature can be perfectly valid while the verifier and the application recover different meanings. No cryptographic check catches this; only a parser policy (reject duplicates, parse once) does.
- **Semantic loss in numbers (Stage 4)** — `1.0000000000000001` and `1` are different JSON texts but the *same* float64; distinctions your protocol cares about can be destroyed before any signature is involved. (Distinct float64s always stay distinct under JCS.)
- **Boundary complacency (Stage 5)** — signing a canonical form means whitespace, key order, and number spelling become unauthenticated byte surfaces. Harmless to a JSON application, but any consumer that assigns meaning to raw bytes (content hashes, audit logs, dedup) now disagrees with your verifier.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-signed-bytes

## What It Is

**Signed Bytes** is an interactive browser demo of Ed25519 signatures (RFC 8032, via `@noble/ed25519` with strict `zip215: false` verification) over JSON documents, built to teach one idea: **you cannot sign an object — you sign a representation.** Every layer that re-encodes a message between signing and verifying (key reordering, Unicode normalization, number re-serialization, duplicate-key parsing) is an opportunity for the bytes to change while the meaning doesn't, or for the meaning to change while the bytes don't. The demo pairs the signature with the JSON Canonicalization Scheme (JCS, RFC 8785) — implemented by hand so every rule is inspectable — plus a hand-rolled strict RFC 8259 parser with a configurable duplicate-key policy, the browser's real UTS #15 NFC/NFD normalizer, and SHA-256 digests for the byte-diff views.

The UI's core contract is **verdict separation**: the raw cryptographic result ("Signature: valid/invalid") and the security verdict ("OK / FAIL-CLOSED / ALARM") are separate, independently computed indicators. Color tracks system integrity, never the boolean — the centerpiece stage shows a *genuinely valid* signature next to a *red ALARM*, because two conforming parsers recover two different meanings from the same signed bytes.

Everything cryptographic is real and runs in the browser; keys are generated per page load and never persisted. **This is a teaching demo, not production crypto.** It does not prove anything about key management, transport security, or the security of Ed25519 itself.

## Exhibits

1. **One document, two byte strings** — a button-driven step-through of the headline mechanism: a producer signs an invoice's exact UTF-8 bytes, a well-meaning gateway re-serializes it in transit, and the real verifier rejects it. Hex diff and diverging SHA-256 digests are computed live at each step.
2. **Byte-diff sandbox** — two editable JSON documents; see parsed-meaning equality, an alignment-aware UTF-8 hex diff (an inserted byte highlights itself, not everything after it), SHA-256 divergence, and a sign-left/verify-right run against the real primitive.
3. **Stage 1: key order** — sign `{"a":1,"b":2}`, verify `{"b":2,"a":1}`; watch it fail closed, then watch JCS repair it.
4. **Stage 2: Unicode** — precomposed é (U+00E9) vs e + combining acute (U+0301): identical rendering, different bytes, code-point strips, three modes (no normalization / NFC before signing repairs it / normalization *after* signing breaks a genuine signature). JCS explicitly does **not** fix this — RFC 8785 never alters code points.
5. **Stage 3: duplicate keys (the centerpiece)** — craft `{"role":"user","role":"admin"}`; the signature over the exact bytes stays valid throughout, the verifier's first-wins parser authorizes `"user"`, the application's last-wins parser acts on `"admin"`: valid signature, red ALARM. With JCS the document is *rejected at parse time* (I-JSON) — canonicalization refuses the ambiguity rather than resolving it.
6. **Stage 4: number spellings** — `1`, `1.0`, `1e0`, `1.0000000000000001` (plus your own): every spelling is a different byte string, every one parses to exactly the same float64, and only the round-trip-stable spelling keeps its signature. Expert notes cover what JCS numbers do and don't preserve.
7. **Stage 5: the signature boundary** — a drawn receive pipeline (wire bytes → parse → NFC normalize → JCS serialize) with a draggable slider that moves the signature tap between its four stages. Flip on in-transit re-encodings and watch the real verifier's tolerance grow monotonically as the boundary moves — then read the full 4×4 tolerance matrix, every cell of which is a live sign/verify run. What the signature no longer notices is attacker-writable without detection; what it still notices breaks for every honest middlebox too.
8. **The tally** — a scoreboard computed by actually re-running every stage with JCS on: it fixes key order and number form; it does not fix Unicode composition; it refuses duplicate keys instead of canonicalizing them.

A global **JCS toggle** re-runs every stage live with RFC 8785 canonicalization applied before signing and before verifying.

## When to Use It

- **Teaching signing pipelines** — why "sign the JSON" is underspecified until you say *which bytes*.
- **Motivating canonicalization** — JCS/RFC 8785 (or deterministic CBOR, RFC 8949 §4.2) as the fix for serializer-side divergence, with honest limits.
- **Explaining parser-differential attacks** — the duplicate-key stage is a minimal, real reproduction of the validate-with-one-parser/consume-with-another bug class.
- **Arguing for I-JSON (RFC 7493)** — reject duplicate keys everywhere, parse once, pass parsed values.
- **Do NOT use this to sign anything real** — keys are throwaway, there is no key management, and the code is optimized for inspectability, not for constant-time or side-channel hardening beyond what `@noble/ed25519` provides.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-signed-bytes](https://systemslibrarian.github.io/crypto-lab-signed-bytes/)**

Step through the mechanism, break each stage yourself against the real verifier, craft a duplicate-key document and watch a valid signature coexist with a red ALARM, then flip the JCS toggle and see exactly which failures canonicalization repairs.

## What Can Go Wrong

- **Fail-closed friction (Stages 1, 2, 4)** — any re-encoding between signing and verifying breaks verification: not an integrity failure, but an availability/interop failure that pushes teams toward dangerous "fixes."
- **Normalization after signing (Stage 2)** — a transport layer that "cleans up" Unicode is indistinguishable from tampering to the verifier. Normalization is only safe as an explicit contract applied on both sides *before* the signature.
- **Parser differentials (Stage 3)** — the signature can be perfectly valid while the verifier and the application recover different meanings. No cryptographic check catches this; only a parser policy (reject duplicates, parse once) does.
- **Semantic loss in numbers (Stage 4)** — `1.0000000000000001` and `1` are different JSON texts but the *same* float64; distinctions your protocol cares about can be destroyed before any signature is involved. (Distinct float64s always stay distinct under JCS.)
- **Boundary complacency (Stage 5)** — signing a canonical form means whitespace, key order, and number spelling become unauthenticated byte surfaces. Harmless to a JSON application, but any consumer that assigns meaning to raw bytes (content hashes, audit logs, dedup) now disagrees with your verifier.

## Real-World Usage

- **JCS (RFC 8785)** is used where JSON must be signed in place: JSON Web Proofs work, verifiable credentials (`RsaSignature2018`-era canonicalization debates), and several ledger/attestation formats.
- **JWS (RFC 7515)** sidesteps canonicalization by signing base64url-encoded bytes — the payload never gets re-encoded; that design choice is exactly this lab's lesson applied. See the sibling [JWT Forge](https://systemslibrarian.github.io/crypto-lab-jwt-forge/) demo.
- **Deterministic CBOR (RFC 8949 §4.2) / COSE** is the binary-format answer used in WebAuthn attestation and ISO mDL — named here as the alternative, deliberately not implemented.
- **Duplicate-key parser differentials** recur in real advisories wherever one component validates raw bytes and another re-parses them (OAuth/OIDC payload handling, policy documents, package manifests).

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-signed-bytes.git
cd crypto-lab-signed-bytes
npm install
npm run dev        # Vite dev server
npm test           # Vitest unit + KAT suite
npm run build      # typecheck + production build
npm run test:a11y  # axe-core WCAG 2.1 AA gate (both themes), needs the build
`​``

## Related Demos

- [Ed25519 Forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) — the curve itself: keygen, determinism, cofactor/ZIP215 verifier malleability.
- [JWT Forge](https://systemslibrarian.github.io/crypto-lab-jwt-forge/) — token signing and algorithm-confusion failures.
- [Hash Zoo](https://systemslibrarian.github.io/crypto-lab-hash-zoo/) — the digests underneath the byte-diff views.

## Build & Verify

`npm run ci` runs the entire local quality bar in one command: typecheck → unit tests → production build → browser suite.

- **Vitest unit tests**, all executed in CI before deploy, including:
  - **RFC 8032 §7.1 known-answer tests** — 4 vectors (TEST 1, 2, 3, SHA(abc)): seed → public key, deterministic signature bytes, and verification (12 test cases).
  - **RFC 8785 known-answer tests** — all 24 Appendix B number-serialization samples (IEEE-754 bits → canonical text) plus NaN/Infinity and lone-surrogate rejection (values and property names); the §3.2.2 sample document canonicalized byte-for-byte; the §3.2.3 Unicode key-sorting example (UTF-16 code-unit order, emoji-before-U+FB33 included).
  - Hand-rolled parser: strict-grammar rejection suite and all three duplicate-key policies.
  - Stage logic: every verdict in the UI (fail-closed, repaired-by-JCS, the valid-signature ALARM) is asserted against the real primitives, and the entire Stage 5 tolerance matrix — all 16 boundary×mutation cells plus its monotonicity — is tested.
  - **Property tests** (seeded, reproducible): canonicalization is a fixed point and parse-stable over 600 generated documents; `serializeNumber` recovers the exact double from 2,000 random bit patterns (the shortest-round-trip property behind RFC 8785 Appendix B); random canonical documents sign/verify and any single flipped byte fails.
- **Browser behavior tests** (`e2e/behavior.spec.ts`) drive the built page the way a learner does — clicks and keyboard — and assert the headline teaching outcomes in the rendered UI: the walkthrough's fail-closed ending, what the JCS toggle does and does not repair, the valid-signature ALARM with both parser views, the keyboard-dragged boundary flip, the complete 16-cell matrix, and the measured scoreboard.
- **Accessibility gate**: `@axe-core/playwright` scans the production build in **both** themes for WCAG 2.1 A/AA; violations block the GitHub Pages deploy (`.github/workflows/deploy.yml`).
- Hand-rolled teaching parts: `src/jcs/canonicalize.ts` (RFC 8785) and `src/json/parse.ts` (RFC 8259 + duplicate policies). Library crypto: `@noble/ed25519` + `@noble/hashes` — the signature scheme is not the lesson here, the bytes it binds are.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*


The JCS serializer rejects lone Unicode surrogates before any signing, including
nested string values and object property names. Valid surrogate pairs and the
intended NFC/NFD distinction are preserved. The JSON parser and NFC pipeline
also preserve `__proto__`, `constructor`, and `toString` as ordinary own data
members, with the same first/last/reject duplicate policies; none silently
disappears before canonicalization. If two distinct object keys collide after
NFC normalization, the pipeline rejects the document rather than choosing a
value. These are serialization/correctness guards, not evidence of an Ed25519
forgery. Noble Ed25519 v3 uses the synchronous SHA-512 provider and strict
`zip215: false` verification; RFC 8032 signature bytes remain pinned.

```

</details>

---

## Credential Veil

- **slug**: `crypto-lab-credential-veil`
- **repo**: https://github.com/systemslibrarian/crypto-lab-credential-veil
- **live**: https://systemslibrarian.github.io/crypto-lab-credential-veil/
- **commit_sha**: `389e0eaa6c6f80dd07f1491fca366db965e59104` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `cc1d404a0386306cc354c5b503485079d3102a2e`
- **read_from**: working tree (clean)
- **category**: SIGNATURES | PRIVACY | ZERO-KNOWLEDGE  ·  **level**: advanced  ·  **--accent**: #7e22ce
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Credential Veil  — _read from index.html_

**Subtitle**: Anonymous credentials · BBS selective disclosure  — _read from index.html_

**Description**: Signs one six-field credential with BBS over BLS12-381, then lets you reveal any subset of fields — or just prove you're over 18 — while the verifier checks a proof that never contains the signature or the hidden fields.  — _read from index.html_

**Why it matters**: Every time you show an ID to prove one thing, you leak everything on it — and the signature itself is a perfect tracking beacon that links your visits together. BBS lets an issuer sign once while the holder proves exactly what's needed, differently every time.  — _read from index.html_

**Card copy**: BBS selective disclosure over BLS12-381, checked against draft-14 vectors. Reveal chosen fields, compare presentation linkability, and explore a custom over-18 proof.

**Chips**: BBS · Selective Disclosure · Unlinkability · Range Proof

**Implements**: BBS signatures `src/bbs/bbs.ts:151`, BLS12-381 `src/bbs/ciphersuite.ts:152`, Ed25519 `src/baseline/ed25519.ts:29`, Hash-to-curve `src/bbs/generators.ts:18`, Pairing `src/bbs/ciphersuite.ts:152`, Pedersen commitment `src/predicate/ageProof.ts:127`, SHA-256 `src/bbs/ciphersuite.ts:91`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Bulletproofs `src/predicate/ageProof.ts:20`, EC point arithmetic `src/bbs/ciphersuite.ts:120`, Fiat-Shamir `src/predicate/ageProof.ts:6`, Schnorr `src/predicate/ageProof.ts:9`, Sigma protocol `src/predicate/ageProof.ts:11`

**References**: BBS+, Bulletproofs, EC point arithmetic, Private information retrieval, RSA, SHAKE, Schnorr, Schnorr identification, Shamir secret sharing, Sigma protocol

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `ASIACRYPT 2025` — first seen README.md:128 (2×)
- `draft-14-sha256-20` — first seen README.md:132 (1×)
- `draft-irtf-cfrg-bbs-signatures-12` — first seen src/bbs/ciphersuite.ts:2 (1×)
- `draft-irtf-cfrg-bbs-signatures-13` — first seen src/bbs/bbs.ts:2 (1×)
- `draft-irtf-cfrg-bbs-signatures-14` — first seen README.md:13 (5×)
- `eprint.iacr.org/2025/1093` — first seen README.md:128 (2×)
- `eprint.iacr.org/2025/1973` — first seen README.md:128 (2×)
- `EUROCRYPT 2026` — first seen README.md:128 (2×)

**Stated limitations (page)**:

- _(scope-note, index.html)_ Honest scope: this is a teaching demo, not production crypto. The BBS signatures, proofs, pairings, Ed25519 baseline and the custom age range-proof on this page are all real and run in your browser. The BBS core is checked against publisher fixtures; the custom age proof has separate teaching tests. The credential data, issuer, and wallet are stage props: keys live only in this tab's memory. What this page does not prove: that a real deployment is private. Identifying disclosures, distinctive headers or issuer keys, revocation handles, and network metadata can still enable tracking, including by colluding issuers and verifiers.
- _(scope-note, index.html)_ The tradeoff, stated plainly: showing the verifier your index (#17) at every presentation restores exactly the correlation handle the BBS proof removed. Cryptographic accumulators can prove "my bit is 0" in zero knowledge, repairing this — that machinery is out of scope here and the tension is not solved by the status list you just used.
- _(scope-note, index.html)_ On the name: this lab implements the scheme in draft-irtf-cfrg-bbs-signatures, which the draft calls plain BBS — its signature is the pair (A, e). BBS+ is a distinct scheme: the Au–Susilo–Mu variant (Constant-Size Dynamic k-TAA, SCN 2006), whose signature carries an extra blinding scalar, (A, e, s). The two are often conflated; this page means the former throughout.

**README — What Can Go Wrong**:

```text
- **Reveal something identifying and unlinkability is gone** — cryptographic unlinkability cannot survive revealing your name at two verifiers.
- **The header/presentation-header carry context** — a unique presentation header chosen by a verifier is itself a tag; the draft discusses this tradeoff.
- **Revocation checks can re-link presentations** — any stable checkable handle (status-list index) is a correlation handle. ZK accumulator membership repairs this at real cost.
- **Collusion using identifying context** — standard BBS proof values remain protected against colluding issuers and verifiers. But those parties can match revealed identifiers, distinctive headers or per-holder issuer keys against issuance records. Protecting the proof value does not hide those accompanying values.
- **Bad randomness in proof generation** — BBS proof security leans on fresh uniform scalars per presentation; a repeated blinding scalar can leak hidden messages.
```

**Claims tested** (e2e/claims.spec.ts, 7 test(s)):

- `the current BBS baseline and its limits are visible with immutable source links` — e2e/claims.spec.ts:5
    - :8 `toBeVisible` expected _no expected value_ _(none)_
    - :9 `toContainText` expected `'BBS SHA-256 baseline'` _(literal)_
    - :10 `toContainText` expected `'work in progress'` _(literal)_
    - :11 `toContainText` expected `'do not validate this lab’s custom age proof'` _(literal)_
    - :12 `toHaveAttribute` expected `'href', provenance.reference.url` _(expression)_
    - :13 `toHaveAttribute` expected `'href',` _(expression)_
    - :15 `toBe` expected `false` _(expression)_
    - :17 `toBeVisible` expected _no expected value_ _(none)_
    - :18 `toContainText` expected `'zero signed messages'` _(literal)_
    - :19 `toContainText` expected `'still binds the issuer key and header'` _(literal)_
    - :20 `toContainText` expected `'not a final standard'` _(literal)_
    - :21 `toHaveAttribute` expected `'href', 'https://datatracker.ietf.org/doc/draft-irtf-cfrg-bbs-signatures/14/'` _(expression)_
    - :118 `toBeVisible` expected `{` _(expression)_
    - :126 `toBeEnabled` expected `{ timeout: 120_000 }` _(expression)_
    - :127 `toContainText` expected `'Ready.'` _(literal)_
    - :134 `expect` expected _no expected value_ _(none)_
- `exhibit 1 hands over every field and a reusable signature, and says so` — e2e/claims.spec.ts:148
    - :152 `toHaveCount` expected `FIELD_COUNT` _(expression)_
    - :153 `toHaveCount` expected `FIELD_COUNT` _(expression)_
    - :156 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :160 `toHaveLength` expected `FIELD_COUNT` _(expression)_
    - :162 `expect` expected _no expected value_ _(none)_
    - :166 `toMatch` expected `/^[0-9a-f]{128}$/` _(regex)_
    - :167 `toHaveAttribute` expected _no expected value_ _(none)_
    - :173 `toContainText` expected _no expected value_ _(none)_
    - :177 `toHaveClass` expected `/indicator-alarm/` _(regex)_
    - :178 `toContainText` expected `'PRIVACY BROKEN'` _(literal)_
    - :179 `toContainText` expected `'all six fields plus a reusable signature'` _(literal)_
    - :180 `toContainText` expected _no expected value_ _(none)_
- `exhibit 2 reveals exactly what was checked, and never the signature` — e2e/claims.spec.ts:187
    - :198 `toHaveLength` expected `keys.length` _(expression)_
    - :200 `expect` expected _no expected value_ _(none)_
    - :207 `toBe` expected `FIELD_COUNT - keys.length` _(expression)_
    - :211 `toBe` expected `keys.length` _(expression)_
    - :212 `expect` expected _no expected value_ _(none)_
    - :218 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :219 `toBe` expected `declared` _(expression)_
    - :222 `expect` expected _no expected value_ _(none)_
    - :223 `expect` expected _no expected value_ _(none)_
    - :224 `expect` expected _no expected value_ _(none)_
    - :231 `expect` expected _no expected value_ _(none)_
    - :235 `toContainText` expected `'BBS proof verifies: true'` _(literal)_
    - :236 `toHaveClass` expected `/indicator-ok/` _(regex)_
    - :237 `toContainText` expected `'ACCEPT'` _(literal)_
    - :241 `toBeChecked` expected _no expected value_ _(none)_
    - :252 `toContainText` expected _no expected value_ _(none)_
    - :255 `toHaveCount` expected `0` _(literal)_
    - :256 `toContainText` expected `'The other ${FIELD_COUNT} fields: absent'` _(expression)_
    - :257 `toHaveClass` expected `/indicator-ok/` _(regex)_
    - :259 `toBeDisabled` expected _no expected value_ _(none)_
    - :260 `toHaveText` expected `'Nothing revealed — no disclosed value to lie about'` _(literal)_
- `exhibit 2 steps through the real artifacts, then rejects a tampered value` — e2e/claims.spec.ts:263
    - :273 `toHaveCount` expected `i + 1, { timeout: 120_000 }` _(expression)_
    - :275 `toBe` expected `'Next step (${i + 2} of 4)'` _(expression)_
    - :276 `toBe` expected `'Step through the mechanism (again)'` _(literal)_
    - :279 `toHaveCount` expected `1` _(literal)_
    - :286 `expect` expected _no expected value_ _(none)_
    - :288 `expect` expected _no expected value_ _(none)_
    - :289 `toBe` expected `true` _(expression)_
    - :292 `expect` expected _no expected value_ _(none)_
    - :293 `toBe` expected `FIELD_COUNT - 1` _(expression)_
    - :294 `toBe` expected `1` _(literal)_
    - :298 `expect` expected _no expected value_ _(none)_
    - :299 `toBe` expected `true` _(expression)_
    - :300 `toBe` expected `step3?.[1]` _(expression)_
    - :301 `expect` expected _no expected value_ _(none)_
    - :304 `expect` expected _no expected value_ _(none)_
    - :308 `toBeVisible` expected _no expected value_ _(none)_
    - :311 `toBeEnabled` expected _no expected value_ _(none)_
    - :313 `expect` expected _no expected value_ _(none)_
    - :314 `toBe` expected `CRED_VALUES.class` _(expression)_
    - :318 `toContainText` expected _no expected value_ _(none)_
    - :322 `toHaveClass` expected `/indicator-ok/` _(regex)_
    - :323 `toContainText` expected `'REJECT'` _(literal)_
    - :324 `toContainText` expected `'you changed a revealed value (class) after proving'` _(literal)_
    - :325 `toContainText` expected `'FORGERY ACCEPTED'` _(literal)_
    - :329 `toContainText` expected `'BBS proof verifies: true.'` _(literal)_
    - :330 `toContainText` expected _no expected value_ _(none)_
- `exhibit 3 measures the overlap it claims, both ways round` — e2e/claims.spec.ts:337
    - :344 `toHaveLength` expected `3` _(literal)_
    - :346 `toBe` expected `3` _(literal)_
    - :347 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :350 `expect` expected _no expected value_ _(none)_
    - :354 `toBe` expected `sharedWindowTotal(bbsHexes)` _(expression)_
    - :355 `toBe` expected `0` _(literal)_
    - :357 `toHaveCount` expected `0` _(literal)_
    - :361 `toBe` expected `1` _(literal)_
    - :362 `expect` expected _no expected value_ _(none)_
    - :364 `toHaveClass` expected `/indicator-warn/` _(regex)_
    - :365 `toContainText` expected `'NO SHARED 8-BYTE RUNS OBSERVED'` _(literal)_
    - :366 `toContainText` expected `'does not prove or disprove unlinkability'` _(literal)_
    - :367 `toContainText` expected `'Class = ${CRED_VALUES.class}'` _(expression)_
    - :368 `toContainText` expected _no expected value_ _(none)_
    - :374 `toBeVisible` expected `{ timeout: 120_000 }` _(expression)_
    - :379 `toHaveLength` expected `3` _(literal)_
    - :380 `toBe` expected `1` _(literal)_
    - :383 `expect` expected _no expected value_ _(none)_
    - :385 `toBe` expected `sharedWindowTotal(edHexes)` _(expression)_
    - :386 `expect` expected _no expected value_ _(none)_
    - :387 `expect` expected _no expected value_ _(none)_
    - :389 `toBe` expected `100` _(literal)_
    - :390 `toHaveCount` expected `3` _(literal)_
    - :393 `toHaveClass` expected `/indicator-alarm/` _(regex)_
    - :394 `toContainText` expected `'LINKABLE'` _(literal)_
    - :396 `toBe` expected _no expected value_ _(none)_
- `exhibit 4 proves the predicate, refuses to lie, and rejects the forgery` — e2e/claims.spec.ts:403
    - :410 `toContainText` expected _no expected value_ _(none)_
    - :414 `toHaveClass` expected `/indicator-ok/` _(regex)_
    - :415 `toContainText` expected `'learned exactly one bit'` _(literal)_
    - :421 `expect` expected _no expected value_ _(none)_
    - :422 `toBe` expected `stated` _(expression)_
    - :423 `toBe` expected `new Date().getUTCFullYear() - 18` _(expression)_
    - :429 `expect` expected _no expected value_ _(none)_
    - :430 `expect` expected _no expected value_ _(none)_
    - :431 `expect` expected _no expected value_ _(none)_
    - :432 `expect` expected _no expected value_ _(none)_
    - :435 `toMatch` expected `/^[0-9a-f]{96}$/` _(regex)_
    - :437 `expect` expected _no expected value_ _(none)_
    - :441 `toContainText` expected `'RangeError', { timeout: 300_000 }` _(expression)_
    - :442 `toContainText` expected _no expected value_ _(none)_
    - :446 `toHaveClass` expected `/indicator-ok/` _(regex)_
    - :447 `toContainText` expected `'NO PROOF EXISTS'` _(literal)_
    - :448 `toContainText` expected `'The prover should have refused'` _(literal)_
    - :452 `toBeVisible` expected `{ timeout: 300_000 }` _(expression)_
    - :456 `toContainText` expected _no expected value_ _(none)_
    - :459 `toContainText` expected _no expected value_ _(none)_
    - :463 `toHaveClass` expected `/indicator-ok/` _(regex)_
    - :464 `toContainText` expected `'REJECT'` _(literal)_
    - :465 `toContainText` expected `'FORGERY ACCEPTED'` _(literal)_
    - :468 `expect` expected _no expected value_ _(none)_
- `exhibit 5 binds the status index and reads its verdict off the published bit` — e2e/claims.spec.ts:473
    - :486 `toBeVisible` expected _no expected value_ _(none)_
    - :491 `toHaveLength` expected `STATUS_LIST_SIZE` _(expression)_
    - :492 `toHaveLength` expected `1` _(literal)_
    - :493 `toHaveLength` expected `STATUS_LIST_SIZE - 1` _(expression)_
    - :494 `toBe` expected `'1'` _(literal)_
    - :495 `toHaveCount` expected `1` _(literal)_
    - :496 `toHaveClass` expected `/bit-revoked/` _(regex)_
    - :497 `toHaveAttribute` expected _no expected value_ _(none)_
    - :501 `toContainText` expected _no expected value_ _(none)_
    - :504 `toHaveText` expected `'Reinstate credential #${CRED_INDEX}'` _(expression)_
    - :511 `expect` expected _no expected value_ _(none)_
    - :512 `expect` expected _no expected value_ _(none)_
    - :514 `toBe` expected `CRED_INDEX` _(expression)_
    - :515 `expect` expected _no expected value_ _(none)_
    - :517 `expect` expected _no expected value_ _(none)_
    - :518 `toHaveClass` expected `/bit-checked/` _(regex)_
    - :519 `toHaveCount` expected `1` _(literal)_
    - :522 `toHaveClass` expected `/indicator-alarm/` _(regex)_
    - :523 `toContainText` expected `'REJECT — proof valid, credential revoked'` _(literal)_
    - :524 `toContainText` expected `'The verdict came from bit #${CRED_INDEX}'` _(expression)_
    - :528 `toContainText` expected _no expected value_ _(none)_
    - :531 `toHaveText` expected `'Revoke credential #${CRED_INDEX}'` _(expression)_
    - :536 `toHaveLength` expected `0` _(literal)_
    - :537 `toBe` expected `'0'` _(literal)_
    - :540 `expect` expected _no expected value_ _(none)_
    - :541 `expect` expected _no expected value_ _(none)_
    - :544 `toHaveClass` expected `/indicator-warn/` _(regex)_
    - :545 `toContainText` expected `'ACCEPT, at a price'` _(literal)_
    - :546 `toContainText` expected `'the verifier now holds your stable index'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Credential Veil — crypto-lab

Anonymous credentials with **BBS selective disclosure** over BLS12-381, in the browser. Prove you're over 18 from a signed credential containing your birth date — without showing the birth date, without showing the signature, and without the verifier being able to link this presentation to the last one.

## What It Is

A signed credential (a JWT, a mobile driver's license) is an **all-or-nothing artifact**: to prove one field, you hand over the whole document plus the signature that binds it — and that signature is a stable byte string that links every place you show it. BBS signatures (Boneh–Boyen–Shacham lineage, modernized by Camenisch–Drijvers–Lehmann, specified in the evolving **CFRG BBS Internet-Draft**) break that: the issuer signs N messages once; the holder proves knowledge of that signature while revealing only the k messages they choose, in a freshly randomized presentation each time.

**On the name:** this lab implements the CFRG draft's scheme, which the draft calls plain **BBS** — its signature is the pair `(A, e)`. **BBS+** is a distinct scheme: the Au–Susilo–Mu variant (*Constant-Size Dynamic k-TAA*, SCN 2006), whose signature carries an extra blinding scalar, `(A, e, s)`. The two are often conflated; this repo means the former throughout.

**What's real:** the BBS implementation on this page is hand-rolled to the draft's pseudocode (ciphersuite **BLS12-381-SHA-256**) on top of `@noble/curves` for the BLS12-381 pairing arithmetic, and passes the official fixture KATs — signing, verification, proof generation and proof verification. The Ed25519 baseline, the Pedersen-commitment age range proof, and the status-list bitstring are also real and run live.

**Current BBS baseline:** [draft-14, 29 October 2026](https://www.ietf.org/archive/id/draft-irtf-cfrg-bbs-signatures-14.txt),
with all 30 fixture files matched byte for byte to [publisher commit 434522c](https://github.com/decentralized-identity/bbs-signature/tree/434522cf17ad970707080a62ce5ac19bcdb82acd).
The SHA-256 BBS core is reviewed and tested against this numbered reference,
including publisher intermediate traces and malformed-input controls.
See the [baseline review](docs/bbs-baseline-review.md) and [source pins](docs/spec-provenance.md).
This remains a draft and does not validate the custom age-proof composition.

**30 October 2026 correction:** draft-14 removes draft-13’s incorrect rejection of
zero signed messages. The BBS core now accepts an empty message list while still
binding the issuer key and header. That differs from one empty-valued message or
revealing no fields from a populated credential. The six-field demo is unchanged;
regression tests cover all three cases and tampered headers, keys and encodings.

**What's simulated:** the credential itself (issuer, wallet, fields) is a stage prop; keys are generated per session and live only in tab memory.

**Privacy scope:** standard BBS protects the proof value even when the issuer and verifiers collude. That does not establish privacy for a whole deployment: identifying disclosures, distinctive headers or issuer keys, revocation handles, and network metadata can still enable tracking. [Draft-14 §§3.3.7 and 5 (29 October 2026)](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-bbs-signatures-14#section-3.3.7) clarify this boundary. The declared SHA-256 BBS core is now checked against draft-14; the baseline review records the version comparison and input-domain change. The standard guarantee does not validate this lab's custom age-proof composition. **Not production crypto — a teaching demo.** The implementation is not constant-time and has seen no side-channel review.

One deliberate encoding deviation, for honesty: five credential fields are mapped to scalars exactly as the draft's signatures interface does (`messages_to_scalars`); the **DOB field is signed as its integer day count** so the age range proof can do arithmetic on it. The draft's core operations take scalars directly, so this stays within the core; only that one field's message-to-scalar mapping is custom. The age proof extends the draft's Fiat–Shamir challenge with the Pedersen-link and range-proof transcript (a standard sigma-protocol AND composition) — that extension is this lab's, not the draft's.

## Exhibits

1. **The problem: all-or-nothing disclosure** — prove "over 18" with an Ed25519-signed credential and watch the verifier receive all six fields plus a reusable signature. Signature valid; privacy verdict: broken. The two indicators disagree on purpose.
2. **Selective disclosure (the headline)** — check exactly the fields to reveal; step through issuer-signs-once → holder-chooses → re-randomize-and-prove → verifier-checks-a-pairing, with the real artifacts at every step. The hidden fields aren't redacted on the verifier's side — they're *absent*, and the signature never appears. Then **break it yourself**: tamper a revealed value after proving and hand it to the real verifier.
3. **Randomized presentations** — present the same credential three times; the page counts and highlights shared 8-byte runs and reports repeated disclosed values. Flip to Ed25519 to see the identical signature, three times. The byte comparison illustrates randomization; it cannot prove unlinkability or diagnose a privacy failure from a matching run.
4. **Age ≥ 18 predicate** — a bit-decomposition range proof over a Pedersen commitment, challenge-linked into the BBS proof so the committed value *is* the signed DOB. The verifier learns one bit. Try it honestly with a 2010 birth date (no proof exists), then force a forgery and watch the real verifier separate "genuine signature" from "impossible transcript".
5. **Revocation, the honest tension** — a real status-list bitstring. Revoke bit #17, check it as the verifier, and read the price: the index is a stable correlation handle that undoes the unlinkability you just saw. Stated, not solved.
6. **What hides what, from whom** — BBS vs blind signatures (signer-blind at issuance, still all-or-nothing at showing) vs ring signatures (hides *who*, not *what*) vs plain JWT/mDL.

## When to Use It

- Teaching or learning what "anonymous credentials" and "selective disclosure" actually mean at the algebra level.
- Understanding why W3C Verifiable Credentials / ISO mDoc communities are adopting BBS for privacy-preserving presentation.
- Seeing why revocation is the hard open edge of credential privacy.
- **Do NOT use** this code to build a production wallet or issuer: it is a demo — no constant-time discipline, no key management, no protocol hardening, no audit.

## Live Demo

<https://systemslibrarian.github.io/crypto-lab-credential-veil/> — issue the credential, reveal any subset of the six fields, present three times and diff the bytes, prove age ≥ 18 without a birth date, then revoke and feel the tension.

## What Can Go Wrong

- **Reveal something identifying and unlinkability is gone** — cryptographic unlinkability cannot survive revealing your name at two verifiers.
- **The header/presentation-header carry context** — a unique presentation header chosen by a verifier is itself a tag; the draft discusses this tradeoff.
- **Revocation checks can re-link presentations** — any stable checkable handle (status-list index) is a correlation handle. ZK accumulator membership repairs this at real cost.
- **Collusion using identifying context** — standard BBS proof values remain protected against colluding issuers and verifiers. But those parties can match revealed identifiers, distinctive headers or per-holder issuer keys against issuance records. Protecting the proof value does not hide those accompanying values.
- **Bad randomness in proof generation** — BBS proof security leans on fresh uniform scalars per presentation; a repeated blinding scalar can leak hidden messages.

## Real-World Usage

- **draft-irtf-cfrg-bbs-signatures-14** (CFRG) — the work-in-progress reference for this lab's declared SHA-256 BBS baseline, with versioned publisher test vectors.
- **W3C Verifiable Credentials / Data Integrity BBS cryptosuites** — selective-disclosure VC presentations.
- **ISO mDL / mdoc privacy work** and government digital-identity pilots evaluating BBS for unlinkable age/attribute proofs.
- Lineage: CL signatures → Idemix (IBM), U-Prove (Microsoft), Hyperledger AnonCreds — the same problem, earlier algebra.

## How to Run Locally

`​``bash
npm ci
npm run dev        # local dev server
npm test           # unit tests incl. official spec KATs + adversarial suite
npm run build      # typecheck + production build
npm run test:a11y  # axe WCAG 2.1 A/AA gate — Chromium/Firefox/WebKit/mobile, dark theme (port 4620)
npm run bench      # reproducible performance numbers (see docs/benchmarks.md)
`​``

Requires Node 20.19+; CI uses Node 22.

## Related Demos

- [crypto-lab-pairing-gate](https://systemslibrarian.github.io/crypto-lab-pairing-gate/) — the BLS12-381 pairing this lab consumes as a primitive.
- [crypto-lab-blind-sign](https://systemslibrarian.github.io/crypto-lab-blind-sign/) — blind at *issuance* (the signer can't see), where BBS is blind at *showing* (the verifier can't see).
- [crypto-lab-bulletproofs](https://systemslibrarian.github.io/crypto-lab-bulletproofs/) — the logarithmic-size range proof; this lab uses the inspectable O(n) bit decomposition instead.
- [crypto-lab-ring-sign](https://systemslibrarian.github.io/crypto-lab-ring-sign/) — anonymity among a set of signers, not selective disclosure of attributes.

## Build & Verify

- **102 unit tests** (Vitest), colocated in `src/`, executed by the CI gate before deploy —
  including a property-based/adversarial suite (`src/credential/adversarial.test.ts`)
  that byte-flips, truncates, and re-targets valid proofs and requires every mutation to
  fail closed.
- Six primitive compatibility controls cover BLS pairing cancellation and identity rejection, point encoding/scalar boundaries, and actual Ed25519 baseline signatures checked independently with native WebCrypto.
- **25 official spec KATs** from the draft-irtf-cfrg-bbs-signatures fixtures (BLS12-381-SHA-256): 10 signature, 15 proof — plus keypair, hash-to-scalar, 10 message-to-scalar cases, the full generator set (P1, Q1, H1–H10), and the mocked-RNG vectors, in `src/bbs/fixtures/`.
- **Accessibility gate:** `@axe-core/playwright` scans the production build in the configured **dark theme** at 1280px and 380px after driving every exhibit to its post-interaction state; zero WCAG 2.1 A/AA violations required for deploy (`.github/workflows/deploy.yml`). Light-theme verification is not established by this gate.
- **Browser matrix:** the a11y/interaction drive runs on Chromium, Firefox, WebKit, and
  a mobile (Pixel-7) project — four projects, dark-theme scans, serialized because
  parallel pairing math can starve a browser renderer.

## Reviewing the cryptography

Start with [docs/design-note.md](docs/design-note.md) — it states exactly what each
proof proves, separates standard BBS from this lab's extensions (the DOB scalar
encoding and the challenge-linked age predicate), and lists the known limitations.
Companions: [docs/threat-model.md](docs/threat-model.md) (who is protected from whom,
and what is out of scope) and [docs/spec-provenance.md](docs/spec-provenance.md) (which
draft text, which fixtures, which library versions). Security reports: see
[SECURITY.md](SECURITY.md). License: [MIT](LICENSE).

## Performance

All proof work runs in a **Web Worker** with `@noble/curves` (pure JS, no WASM), so the
page never freezes; the age-proof buttons stream coarse progress ("committing 15 bits…",
"checking the pairing…") and a cancel button hard-stops the worker mid-proof. A
selective-disclosure proof takes ~100 ms; prove-plus-verify for the age predicate is
~1.5 s of real group operations and a pairing. Reproducible numbers, proof sizes, and
methodology: [docs/benchmarks.md](docs/benchmarks.md) (`npm run bench`). Nothing is
precomputed or faked to hide the cost.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Issuance, presentation and research assumptions (12 October 2026)

[On the Concrete Security of BBS/BBS+ Signatures](https://eprint.iacr.org/2025/1093), received 11 June 2025, revised 22 October 2025 (ASIACRYPT 2025), gives q-signature key-recovery attacks comparable to Θ(q)-DL, about O(sqrt(p/q)) for suitable q. Here q concerns issuer-signature exposure, not the number of randomized credential presentations. [Tight Security for BBS Signatures](https://eprint.iacr.org/2025/1973), received 22 October 2025, revised 20 February 2026 (EUROCRYPT 2026), gives a tight q-SDH reduction for once-per-message issuance, covering deterministic signing; its multiple-randomized-signatures-on-one-message result is an algebraic proof-tightness limitation, not an exploit.

This lab derives CoreSign’s e deterministically from the signing key, signed tuple and domain. Repeating the same issuance yields the same signature artifact; changing a signed field or header changes its context. Presenting the existing credential generates fresh proof randomness without issuing a new signature. The live three-presentation exhibit demonstrates that distinction. These theorems do not prove this custom DOB/age composition or browser side-channel safety.

The active baseline is now [draft-14-sha256-20261030](docs/spec-provenance.md): numbered draft-14 plus an immutable publisher fixture/tooling snapshot, source review and executed vector/boundary tests. Existing fixture bytes are unchanged. The original editor-draft/download revision remains unknown and is retained as a brief historical note; it is no longer the active reference.

```

</details>

---

## MuSig Gate

- **slug**: `crypto-lab-musig-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-musig-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-musig-gate/
- **commit_sha**: `66d139d875c927ece0f801e8c96bc29a3a2f5ff6` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `eb96e11f1ddffbb892f9faf068f39347880985fe`
- **read_from**: working tree (clean)
- **category**: SIGNATURES | PROTOCOLS | MPC & THRESHOLD  ·  **level**: intermediate  ·  **--accent**: #d67a4a
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: MuSig Gate  — _read from index.html_

**Subtitle**: MuSig2 · BIP-327  — _read from index.html_

**Description**: Step through the real two-round MuSig2 protocol — n public keys collapsing into one, n nonce pairs into one nonce, n partial signatures into one — then watch a plain BIP-340 verifier accept the result, and try to break both the key and nonce aggregation yourself.  — _read from index.html_

**Why it matters**: A multisig wallet normally announces itself: more keys, more signatures, more fees, and a public record of exactly how your group is organised. MuSig2 makes an n-of-n group indistinguishable from one person. The two things that make it safe — key-aggregation coefficients and a second nonce — are each the fix for an attack that broke a real, plausible-looking predecessor.  — _read from index.html_

**Card copy**: n signers aggregate their public keys into one key and their nonces into one nonce, yielding a single Schnorr signature indistinguishable from a lone signer's — plus three live forgeries BIP-327 defeats.

**Chips**: MuSig2 · BIP-327 · secp256k1 · Wagner & ROS

**Implements**: EC point arithmetic `src/musig/toycurve.ts:53`, Schnorr `src/musig/bip340.ts:14`, secp256k1 `src/musig/field.ts:16`, SHA-256 `src/musig/field.ts:176`

**Attacks shown**: Discrete log `src/ui/roguePanel.ts:65`, Key recovery `README.md:104`, Nonce reuse `README.md:104`, Side-channel (unspecified) `src/ui/sessionPanel.ts:963`, Timing side-channel `src/ui/vectorsPanel.ts:131`

**Comment-only (named in code comments, not executed)**: FROST `src/musig/session.ts:344`, Pairing `src/musig/sign.ts:311`

**References**: BLS signatures, FROST, Pairing

**Standards body**: NIST, SECG

**Implementation**: @noble

**Spec citations, exactly as written**:

- `eprint.iacr.org/2018/417` — first seen README.md:103 (1×)
- `eprint.iacr.org/2020/945` — first seen README.md:103 (1×)

**README — What Can Go Wrong**:

```text
- **Rogue keys.** Aggregating by plain summation lets the last signer to publish own the group key outright. Demonstrated end to end in exhibit 3; prevented by the key-aggregation coefficients.
- **A single nonce per signer.** Makes the aggregate nonce, and therefore the challenge, a value the last signer chooses — and that is enough to forge. Exhibit 4 runs both known routes for real: **Wagner's generalised-birthday algorithm** ([Drijvers et al., IEEE S&P 2019](https://eprint.iacr.org/2018/417)) over four sessions at reduced challenge width, and the polynomial-time **ROS attack** ([Benhamouda et al., 2020](https://eprint.iacr.org/2020/945)) over 256 sessions at the real 256-bit width with no reduction whatsoever. Each is then re-run against two nonces and fails.
- **Nonce reuse.** Signing two different messages with the same secret nonce reveals the private key. `sign()` here zeroes the secret nonce as it consumes it, so a second call fails loudly instead of leaking. The key-recovery algebra itself is demonstrated in [crypto-lab-schnorr-forge](https://systemslibrarian.github.io/crypto-lab-schnorr-forge/).
- **Key-list order.** `KeyAgg` is order-dependent — the same keys in a different order give a different aggregate key, and a group that disagrees on order derives different keys and cannot sign. BIP-327 defines `KeySort` for exactly this; the toggle in exhibit 1 makes the difference visible.
- **Malformed contributions.** Keys off the curve, keys with `x ≥ p`, nonces with a bad prefix byte, partial signatures `≥ n`, aggregate nonces that are not points. All fail closed, and all name the offending party — the spec insists a bad contribution be attributable, not merely fatal.
- **Legitimate degenerate cases.** An aggregate nonce half can cancel to the point at infinity (serialized as 33 zero bytes), and `R_1 + b·R_2` can itself be infinity, which the spec handles with a defined `R = G` fallback. Both are implemented and covered by vectors rather than crashed on.
- **A missing signer.** n-of-n means the absent signer's `e·a_i·d_i` term is simply not in `Σ s_i`, so verification fails. This is a property, not a bug — but it is a real operational risk if you wanted a quorum.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# MuSig Gate

**MuSig2 · BIP-327** — n signers aggregate their public keys into one key and their nonces into one nonce, producing a single Schnorr signature indistinguishable from a lone signer's.

## What It Is

An interactive, browser-only lab for **MuSig2** as standardized in **[BIP-327](https://github.com/bitcoin/bips/blob/master/bip-0327.mediawiki)**, over **secp256k1**, producing signatures verifiable by a plain **[BIP-340](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki)** Schnorr verifier.

The problem it solves: an n-of-n multisig wallet normally has to publish n public keys and collect n signatures. That is expensive to store and verify, and it leaks the group's structure to anyone reading the chain. MuSig2 replaces all of it with **one key and one signature** — while remaining an interactive protocol in which every signer's secret key stays with that signer.

The exact primitives, all hand-rolled in `src/musig/` so every intermediate value is inspectable:

- **Key aggregation** — `Q = Σ a_i·P_i`, where `a_i = H("KeyAgg coefficient", L ‖ P_i)` and `L = H("KeyAgg list", P_1 ‖ … ‖ P_u)`. The coefficients are what defeat the rogue-key attack.
- **Two-round nonces** — each signer commits **two** nonces; halves aggregate independently and combine as `R = R_1 + b·R_2` with `b = H("MuSig/noncecoef", aggnonce ‖ Q ‖ m)`. The second nonce is what defeats the Wagner/ROS attacks on single-nonce two-round schemes.
- **Partial signatures** — `s_i = k_i1 + b·k_i2 + e·a_i·d_i (mod n)`, each independently verifiable so a bad contribution is **attributable** to a signer.
- **Aggregation** — `Σ s_i`, yielding `R.x ‖ s`: an ordinary 64-byte BIP-340 signature under the 32-byte aggregate key.

Group arithmetic (point add/multiply, field square root, scalar inversion) comes from **[@noble/curves](https://github.com/paulmillr/noble-curves)** — audited, and deliberately not the teaching subject. BIP-327 itself is implemented here.

Two things are deliberately run at reduced scale, each labelled as such in the page, because the honest alternative was to describe them in prose:

- **A drawable group.** `y² = x³ + 7` over **F_127** — the secp256k1 equation, same group law, 127 elements instead of 2^256 — so key aggregation can be *plotted* as real points and real additions. This is not the smooth textbook curve, which is the equation over the reals and a different object from the finite group cryptography happens in.
- **A truncated challenge**, for Wagner's k-list forgery only. That attack needs a birthday search, so the challenge hash is cut to 21–30 bits. The algorithm is unmodified and the forgery genuinely verifies; at the real 256-bit width the same k-tree needs on the order of 2^85 operations.

The **ROS forgery reduces nothing at all** — full 256-bit challenge, real curve, no search — so if you only look at one attack here, look at that one.

Every finished signature is checked twice: once by a hand-rolled BIP-340 verifier that reports its stage pipeline, and once by `@noble/curves`' own `schnorr.verify`. The two must agree, and a disagreement is surfaced as a failure rather than swallowed.

**Security model.** Honest-but-curious is not the threat model here: two exhibits hand the learner real adversarial capabilities — including two working signature forgeries — and let them use them. Secret keys and nonces are generated per session with WebCrypto, live only in tab memory, and are never persisted or transmitted. There is no backend.

**Not production crypto — a teaching demo.** The arithmetic is real and matches the specification's own test vectors, but it uses ordinary JavaScript `BigInt` and is **not constant-time**. It does nothing to solve the hardest operational problem in MuSig2, which is guaranteeing a secret nonce is used at most once across process restarts. For real signing, use an audited implementation such as [libsecp256k1](https://github.com/bitcoin-core/secp256k1).

## How it teaches

The five exhibits are not peers — they are one argument, and the interface now says so.

A **guided tour** runs ten stops across the tabs, in the order the ideas depend on each other: the promise → predict → run it → break naive key aggregation → repair it → *see* the repair drawn → break naive nonce aggregation → repair it → back to the promise → prove you can transfer it. Each stop shows its position, says what to do, and its Continue button moves to the next relevant state even when that means changing tabs and putting a panel into a particular state first. The tabs still work exactly as before for free exploration and deep links; the tour is an overlay, not a replacement.

Three questions are asked **before** the experiment that answers them, not after — which is the difference between testing whether you read something and testing whether you understood it. A prediction is recorded and deliberately *not* graded at that moment; the experiment runs, and a debrief elsewhere on the page reports whether you were right and why.

The default path ends at the one-nonce/two-nonce comparison, which is all that is needed to understand why MuSig2 commits two nonces. The Wagner and ROS forgeries are research-grade evidence and sit behind an **Advanced** disclosure, led by a table comparing the two routes — present for anyone who wants them, not an obstacle for everyone else.

The sixth stop exists because the tour previously showed coefficients defeating the rogue-key attack — the attacker missing round after round — without ever showing what a coefficient *does* to a key. That is the difference between "it works" and "I know why", and the drawable F_127 group is the one place on the page where the answer is a picture rather than more hex. It was also the one teaching exhibit no stop reached, which showed up as a hole in the lesson map below.

Any stop can be linked to directly: `#step-6` opens the lesson on stop 6, the address bar follows along as you go — via `replaceState`, so ten Continues do not become ten back-button entries — and the bar carries a **Link to this step** button, because being able to send someone "read step 6" is most of what makes a guided lesson usable by a third party. The alternative instruction, "press Continue five times", is the kind that quietly does not get followed.

While the tour runs, the **tab strip becomes the lesson map**: exhibits whose stops are behind you are marked done — in a word as well as a colour, so the state survives greyscale and reaches a screen reader — and the marks clear when you leave, because outside the lesson there is no order to be ahead or behind of. The BIP-327 Vectors tab sits behind a divider rather than in the run of chapters: no tour stop lands there, because it is implementation evidence and not the fifth idea.

The glossary stays collapsed, but each of the six session stages now shows **the one term it is the first to require** beside itself — `Coefficient` at the stage that introduces `a_i`, `Nonce` at the stage that commits two of them — so a newcomer never has to scroll back and search a ten-entry list to finish the sentence they are reading. Both come from the same array, so a definition cannot drift from the one shown inline.

Every intermediate value is still on the page, but hex is **abbreviated by default** and one control beside the tabs switches the whole page to full bytes — flipped once rather than expanded value by value, and remembered for the rest of the visit. Hovering any value shows it in full without touching the switch, and the two values you would plausibly paste into another tool — the aggregate key and the finished signature — carry a copy button. Nothing is ever actually hidden; the page just does not open with forty lines of hex in front of the idea it is teaching.

Each panel closes by saying what it established and what question that creates, and the lab ends with an **exit check**: two scenarios not seen anywhere else on the page, plus a threat-to-defence matching exercise whose four rows include *"one of the n signers disappears → nothing in MuSig2 defends against this"*. That row matters as much as the wins — the most dangerous misconception this lab could leave behind is that MuSig2 is generic threshold multisig.

## Exhibits

1. **Signing Session** — one real MuSig2 session, stepped through six stages. A collapse diagram shows n public keys becoming 1, n nonce pairs becoming 1 nonce, and n partial signatures becoming 1 signature, with every coefficient, challenge and scalar shown at the stage that computes it. Choose 2–5 signers, type the message, toggle BIP-327 KeySort and watch the aggregate key move. Each signer's partial is checked in the group as well as the scalar field — `s_i·G` against `(R_i1 + b·R_i2)^± + e·a_i·g′·P_i`, compared byte-for-byte — and the secret scalars can be revealed so the equation is checkable by hand. The final stage hands the 64 bytes to a plain BIP-340 verifier. Break-it controls corrupt a single bit of one partial signature (the aggregator names the culprit) and attempt to sign with one signer absent (MuSig2 is n-of-n). A collapsed glossary introduces every term the page uses.

   The tab closes with **"One of these was signed by a group. Which one?"** — the headline claim put as a question rather than a statement. Two signatures over the same message sit side by side: one is this session's aggregate, the other comes from `@noble/curves`' ordinary single-signer `schnorr.sign`, and which slot is which is a WebCrypto coin flip. Guess, then reveal, then compare the two on every observable property — all of which read *identical*. It is equally clear about the limit: this hides the group from whoever reads the finished signature, not from a participant or a network observer.
2. **Key Aggregation** — the coefficients in the foreground. `L`, the second-key shortcut, every `a_i`, and an independently recomputed `Σ a_i·P_i` compared byte-for-byte against `Q`. Reverse the key order, apply KeySort, or make every key identical to exercise the all-keys-equal sentinel, and see the naive `Σ P_i` aggregate side by side with the BIP-327 one.

   The tab closes by **drawing it**: all 126 affine points of `y² = x³ + 7` over F_127, with each input key marked, an arrow to where its coefficient sent it, and a path stepping through the running totals to `Q` — alongside the naive `Σ P_i` path landing somewhere else entirely. Real points, real additions, and a text alternative carrying the same facts.
3. **Rogue Key Attack** — the break that killed naive multisig, run for real. Under naive aggregation the attacker publishes `P_rogue = t·G − ΣP_honest`, signs alone, and **the genuine BIP-340 verifier accepts** — shown as an alarm, not a success. The identical attack against BIP-327 runs the attacker's fixed-point search round by round and misses every time. A third control lets you supply your own rogue key and target secret and submit them to either rule.
4. **Why Two Nonces** — pick a target aggregate nonce. Against one nonce per signer, the attacker hits it *exactly*, first try, with one subtraction — and therefore chooses the challenge. Against BIP-327's two nonces, the same move misses every round, with the real `b` derived from the bytes the attacker just published.

   Then it goes further and **actually forges signatures — twice, by two different routes**:

   - **Wagner's k-list attack.** Four concurrent sessions, a generalised-birthday search over four lists, and out comes a valid signature on a message the honest signer never saw. Only the challenge width is reduced (~420 ms at 27 bits).
   - **The ROS attack**, at the **full 256-bit width with nothing reduced**. 256 concurrent sessions, two candidate challenges computed offline per session, and the bit pattern falls out of a single modular subtraction — no search anywhere. **256 sessions in, 257 signatures out**, in about half a second. This is what the attack actually costs in reality.

   Both use real secp256k1 with hash-derived key-aggregation coefficients, so the key setup is provably *not* the flaw, and a signing oracle that throws on nonce reuse, so a nonce-reuse key leak cannot be masquerading as the attack. Running each against two nonces shows exactly why it dies: Wagner's k-tree needs a fixed target, ROS needs a constant right-hand side, and with two nonces both are functions of the very values being solved for.
5. **BIP-327 Vectors** — all **56** official BIP-327 known-answer cases from all seven vector files, executed in the browser on load, each expandable to expected-vs-actual. Includes the specification's malformed-input cases, which must be *rejected* for the right reason.

   Fifty-six green rows are evidence, not a lesson, so **three cases are pulled to the front** — the ones that change how you would write an implementation rather than merely confirming arithmetic: a public key that is not a curve point, where rejecting is not enough because the report has to name the signer; a partial signature at or above the group order, where the obvious shortcut of reducing mod `n` quietly costs you that identifiable abort; and a nonce half that cancels to the point at infinity, where the correct behaviour is *not* to reject but to serialize 33 zero bytes and carry on — and any signer moving last can force exactly that. They are looked up by vector group and index, so a reworded vector file surfaces as a visible missing case rather than silently dropping one.

## When to Use It

Use MuSig2 when:

- **Every** listed signer must sign, and you want the on-chain result to look like a single signer — smaller, cheaper, and private about the group's structure.
- You are building Bitcoin Taproot spends (BIP-340/341) and want a key-path spend for a group.
- Signers can run two communication rounds and each keep custody of their own key.

Do **NOT** use MuSig2 when:

- **You need a t-of-n quorum.** MuSig2 is n-of-n; every signer is mandatory. Losing one key means losing the funds. Use FROST — see [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/).
- **You need a public audit trail of who signed.** The whole point is that the signer set is unrecoverable from the signature. Record it elsewhere, out of band.
- **You cannot guarantee single use of a secret nonce.** A signer that replays a nonce across two different messages leaks its private key by elementary algebra. If a signer's storage can roll back, use the deterministic-signing variant or don't use a two-round scheme.
- **You cannot bound how many signing sessions run concurrently.** Concurrency is what both forgeries in exhibit 4 feed on. MuSig2's two nonces are what make concurrent sessions safe; a single-nonce scheme with unbounded concurrency is broken outright.
- **You need non-interactive aggregation** across parties who never talk. That is a different primitive — see [crypto-lab-pairing-gate](https://systemslibrarian.github.io/crypto-lab-pairing-gate/) for BLS.

## Live Demo

**<https://systemslibrarian.github.io/crypto-lab-musig-gate/>**

In the browser you can: step a real 2-to-5-signer session from fresh keys to one 64-byte signature; watch the key, nonce and signature collapses happen one stage at a time; verify the aggregate signature with a plain BIP-340 verifier and an independent library verifier; try to pick the group's signature out of a blind pair against a lone signer's and discover you cannot; corrupt one partial signature and see the culprit named; attempt to sign with a signer missing; mount a rogue-key attack that a real verifier accepts, then watch the same attack fail against BIP-327; steer a single-nonce aggregate onto a chosen target and watch the two-nonce version refuse; and run all 56 BIP-327 vectors live.

Deep links: `#session`, `#keyagg`, `#rogue`, `#nonce`, `#vectors`.

## What Can Go Wrong

- **Rogue keys.** Aggregating by plain summation lets the last signer to publish own the group key outright. Demonstrated end to end in exhibit 3; prevented by the key-aggregation coefficients.
- **A single nonce per signer.** Makes the aggregate nonce, and therefore the challenge, a value the last signer chooses — and that is enough to forge. Exhibit 4 runs both known routes for real: **Wagner's generalised-birthday algorithm** ([Drijvers et al., IEEE S&P 2019](https://eprint.iacr.org/2018/417)) over four sessions at reduced challenge width, and the polynomial-time **ROS attack** ([Benhamouda et al., 2020](https://eprint.iacr.org/2020/945)) over 256 sessions at the real 256-bit width with no reduction whatsoever. Each is then re-run against two nonces and fails.
- **Nonce reuse.** Signing two different messages with the same secret nonce reveals the private key. `sign()` here zeroes the secret nonce as it consumes it, so a second call fails loudly instead of leaking. The key-recovery algebra itself is demonstrated in [crypto-lab-schnorr-forge](https://systemslibrarian.github.io/crypto-lab-schnorr-forge/).
- **Key-list order.** `KeyAgg` is order-dependent — the same keys in a different order give a different aggregate key, and a group that disagrees on order derives different keys and cannot sign. BIP-327 defines `KeySort` for exactly this; the toggle in exhibit 1 makes the difference visible.
- **Malformed contributions.** Keys off the curve, keys with `x ≥ p`, nonces with a bad prefix byte, partial signatures `≥ n`, aggregate nonces that are not points. All fail closed, and all name the offending party — the spec insists a bad contribution be attributable, not merely fatal.
- **Legitimate degenerate cases.** An aggregate nonce half can cancel to the point at infinity (serialized as 33 zero bytes), and `R_1 + b·R_2` can itself be infinity, which the spec handles with a defined `R = G` fallback. Both are implemented and covered by vectors rather than crashed on.
- **A missing signer.** n-of-n means the absent signer's `e·a_i·d_i` term is simply not in `Σ s_i`, so verification fails. This is a property, not a bug — but it is a real operational risk if you wanted a quorum.

## Real-World Usage

- **Bitcoin Taproot (BIP-340/341/342).** MuSig2 is the standard way for a group to produce a key-path Taproot spend that is indistinguishable from a single-signer spend. BIP-327 exists to make independent wallet implementations interoperate.
- **Wallet and custody software.** Implemented in `libsecp256k1`'s `musig` module, and in wallets and coordination libraries built on it.
- **Lightning and channel constructions**, where reducing multi-party signatures to one signature reduces on-chain footprint.
- **Cross-organisation signing** where the participants specifically do not want the number of approvers visible on a public ledger.

BIP-327 supersedes the original MuSig2 paper's parameterisation for Bitcoin use and pins the exact hash tags, encodings and tweaking rules — which is why this lab tests against its vectors rather than against a paper.

## How to Run Locally

`​``bash
npm ci
npm run dev        # http://localhost:5173/crypto-lab-musig-gate/
npm test           # 261 unit tests, including the 56 BIP-327 spec KATs
npm run bench      # the protocol with no DOM, for the performance table
npm run perf       # the browser figures, against the production build
npm run build      # tsc --noEmit && vite build
npm run preview    # serve the production build (the a11y gate serves it on port 4276)
npm run test:a11y  # what CI gates on: axe (both themes) + flows on Chromium desktop & mobile
npm run test:axe   # just the axe accessibility gate
npm run test:e2e   # just the Chromium flows
npm run test:e2e:all  # every engine: Chromium, mobile viewport, Firefox, WebKit
`​``

Requires Node 22+. `npm run test:a11y` needs the Playwright Chromium browser once (`npx playwright install chromium`); `npm run test:e2e:all` additionally needs `firefox webkit`.

## Related Demos

- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) — MuSig2 is n-of-n; **the quorum case IS frost-threshold**. If you need t-of-n, you need FROST, not this.
- [crypto-lab-schnorr-forge](https://systemslibrarian.github.io/crypto-lab-schnorr-forge/) — plain BIP-340 Schnorr keygen, signing and the nonce-reuse key-recovery attack. This lab builds on it and does not re-teach it.
- [crypto-lab-dkg-gate](https://systemslibrarian.github.io/crypto-lab-dkg-gate/) — distributed key generation. Here each signer generates its own key independently; no DKG is involved.
- [crypto-lab-pairing-gate](https://systemslibrarian.github.io/crypto-lab-pairing-gate/) — BLS signature aggregation. A different primitive over pairing-friendly curves, with different trade-offs.
- [crypto-lab-bitcoin-script](https://systemslibrarian.github.io/crypto-lab-bitcoin-script/) — Taproot transaction assembly and spending paths. Key tweaking is implemented here for spec-vector coverage but is not an exhibit.

## Build & Verify

**261 unit tests (Vitest), including 56 official BIP-327 known-answer cases** — 30 that must be accepted, 26 that must be rejected — plus **274 end-to-end tests (Playwright)** across four browser engines. All pass (six clipboard checks run on Chromium only, which is the engine Playwright grants clipboard permission for here, and are skipped elsewhere rather than silently asserted).

Spec vectors, verbatim from [bitcoin/bips · bip-0327/vectors](https://github.com/bitcoin/bips/tree/master/bip-0327/vectors):

| File | Cases | Covers |
| --- | --- | --- |
| `src/musig/vectors/key_agg_vectors.json` | 9 | key aggregation, order dependence, all-identical keys, malformed keys, bad tweaks |
| `src/musig/vectors/nonce_gen_vectors.json` | 4 | the two-nonce derivation, with/without secret-key hardening, absent vs. empty message |
| `src/musig/vectors/nonce_agg_vectors.json` | 5 | independent half summation, infinity encoding, malformed nonces |
| `src/musig/vectors/sign_verify_vectors.json` | 18 | partial signatures byte-for-byte, wrong signer, negated signature, out-of-range scalar |
| `src/musig/vectors/tweak_vectors.json` | 6 | plain and x-only tweaks applied to the aggregate key |
| `src/musig/vectors/det_sign_vectors.json` | 9 | deterministic signing for the last signer |
| `src/musig/vectors/sig_agg_vectors.json` | 5 | partial signatures → one 64-byte signature **that a plain BIP-340 verifier accepts** |

The same runners (`src/musig/vectors.ts`) drive both the Vitest suite and exhibit 5's live table, so a green table in the browser and a green CI run are the same claim.

**End-to-end (Playwright):** 68 functional flows across **four engines** — Chromium desktop, a Pixel 5 viewport, Firefox and WebKit — assert what the unit suite structurally cannot — that each exhibit renders its result rather than throwing, that alarm-versus-pass semantics actually reach the DOM (a successful forgery must render as `.verdict-alarm`, never `.verdict-pass`), that stepping reveals more of the *same* session rather than resampling it, that the blind pair really is indistinguishable, that a corrupted partial marks exactly one signer, that a malformed rogue key is refused before signing, that there is exactly one `<h1>` and one banner landmark, that arrow keys move between tabs, that the scripture line appears verbatim exactly once, and that nothing overflows horizontally at 320px. The Wagner forgery has its own flows: it must render as `.verdict-alarm`, `Σ e_j` must match `e*` exactly, and the two-nonce attempt must produce a distinct target for every probe. The teaching layer is tested too: the tour must walk all ten stops, reach every teaching exhibit and never select the evidence tab, survive a reload mid-lesson, and reach a stop whose anchor only exists once a panel is in a particular state; a prediction must be recorded *without* being graded, with the verdict arriving only in the debrief; the advanced forgeries must be collapsed by default; and the exit check must reject MuSig2-as-shown for a 2-of-3 requirement. The byte-display switch has its own flows: every hex value must start abbreviated with its full bytes still in the DOM, one click must expand all of them, the choice must survive a reload, and a panel rendered *after* the switch must come up full — which is the part a subscribe-on-render implementation gets wrong. The three featured vector cases are asserted by their actual expected values, so a reworded vector file fails the suite rather than quietly dropping a case. The scaffolding is tested for drift: each stage's inline term must be one the glossary actually defines. Deep links are tested for the ordering bug they invite — the tour rewrites the hash whenever it renders, and it renders while mounting, so an incoming `#step-9` must survive a lesson resumed from storage at a different stop — plus clamping, nonsense hashes, and that `replaceState` keeps the back button clean. Failure is tested as a first-class case: with `crypto.getRandomValues` made to throw — a real condition on an insecure origin, where every panel generates keys the moment it renders — the exhibit must explain itself rather than going blank, and the failure must stay contained to that one tab. And the lesson map must mark a finished exhibit, say so in the accessible name rather than in colour alone, and clear itself on exit. Every flow also asserts zero uncaught page errors and zero console errors.

Two workflows, for one reason: `deploy.yml` must stay byte-for-byte identical across the fleet and it installs only Chromium, so Firefox and WebKit cannot run inside it. `.github/workflows/e2e.yml` installs all three engines and runs the full matrix on every push and pull request, while `deploy.yml`'s gate step runs axe plus the Chromium flows. The Chromium projects therefore run in both places, deliberately.

The unit suite also gates *cost*: `cost.test.ts` counts every scalar multiplication a session performs and asserts the exact total, plus the shape of its growth — equal successive differences per signer, which is what rules out an O(u²) loop reappearing. It would have caught both of the inefficiencies described under Performance on the day they landed.

Beyond the KATs, the unit suite covers: full 2-, 3-, 4- and 5-signer round trips verified by two independent verifiers; the algebraic identity `s_i = k_i1 + b·k_i2 + e·a_i·d_i` checked per signer; `Σ s_i` equal to the signature's `s`; secnonce consumption (a second `sign()` throws); refusal to sign with a mismatched key, an out-of-range key, or for a key list the signer is not in; rejection of a negated partial, a wrong-signer partial, and an out-of-range partial; single-bit tamper detection with correct attribution; the n-of-n boundary; the infinity-fallback and empty-message edge cases; the naive rogue-key attack **succeeding**; the BIP-327 rogue-key attack **failing**; single-nonce target-hitting **succeeding**; and two-nonce target-hitting **failing**. The two forgery modules are tested on the unusual requirement that an attack must *succeed*: the forged signature verifies, the honest signer provably never saw the forged message, no nonce was reused (its oracle throws on reuse, so a nonce-reuse key leak cannot be masquerading as the k-sum), and `Σ e_j = e*` over the integers rather than merely modulo 2^bits — plus soundness of the k-tree itself, which must return `null` rather than an inexact answer. ROS is held to the same bar at full width, and additionally to costing exactly one scalar multiplication per session plus one — evidence there is no hidden search term. The drawable group is tested on the group axioms (closure, associativity, inverses, identity), its stated order of 127, and that its generator enumerates all 127 elements — if any of those failed, the picture would be a lie. The lone-signer comparison is tested both ways: indistinguishable in shape for 2–5 signers, and *not* interchangeable in substance (neither signature verifies under the other's key), with the coin flip shown to reach both slots.

**Accessibility gate:** `@axe-core/playwright` scans the production build for WCAG 2.1 A/AA violations in **both** themes, driving all five exhibits into their post-interaction states first — every step revealed, both attacks run in both modes, the malformed-input rejection path, the tamper and missing-signer failures, the byte-display switch flipped to full width so the wider layout is scanned too, the tour restarted and advanced far enough that the tab strip's completed-exhibit state is in the DOM, and every disclosure and learner check opened. Zero violations required.

Two things a scanner cannot catch are covered by their own tests. Pressing **Continue** changes the selected tab, scrolls elsewhere and sometimes puts a panel into a new state — visually obvious, silent to a screen reader — so each stop is announced through a live region that stays in the DOM permanently, since one inserted at the moment its text changes is not reliably read. And `@media (prefers-reduced-motion)` sets `scroll-behavior: auto`, but a `behavior` argument to `scrollIntoView` overrides the stylesheet: measured, **all three engines animated straight through the preference** until the JS asked matchMedia itself. That regression test asserts the scroll position is already final on the first animation frame, with a paired test proving the animated case still animates — a wall-clock budget passed against the unfixed code and was worthless.

Colour choices are checked rather than eyeballed: every text/background pair in `src/style.css` was contrast-computed against AA, verdict tints are explicit colours rather than `color-mix()` so their ratios are verifiable, muted text lowers lightness instead of using `opacity`, and state is always icon + word + colour so it survives greyscale and deuteranopia.

`.github/workflows/deploy.yml` runs unit tests → build (typecheck included) → the full Playwright suite (axe gate *and* functional flows), and only then deploys, so a broken build, a functional regression, or an accessibility regression never ships.

## Performance

Everything runs client-side with JavaScript `BigInt` arithmetic, so scalar multiplication dominates everything else. Both halves of this table are reproducible — `npm run perf` for the browser figures and `npm run bench` for the no-DOM ones — because a published performance number is worth what its methodology is worth.

Measured on an Apple M5 (10 cores), Chromium, against the production build served by `vite preview`: median of 11 runs on a fresh page each time, two discarded as warm-up, timing the synchronous work between the click and the result. `npm run perf` refuses to report if the machine is under load, which is not pedantry — a first attempt at these numbers, taken while the test suites were running, spread a single row across 121–245 ms.

| Operation | Time | Spread over runs |
| --- | ---: | ---: |
| Full 2-signer session + complete panel render | **~18 ms** | 17.9–18.9 ms |
| Full 3-signer session + complete panel render | **~23 ms** | 23.2–23.9 ms |
| Full 5-signer session + complete panel render | **~34 ms** | 33.3–34.1 ms |
| All 56 BIP-327 vectors + table render | **~182 ms** | 181–184 ms |
| Rogue-key attack: forge, then 6 fixed-point rounds | **~2.3 ms** | 2.3–2.5 ms |
| The drawable group: 126 points + aggregation + plot | **~0.4 ms** | 0.4–0.5 ms |
| Wagner forgery, 24-bit challenge | **~194 ms** | 187–196 ms |
| Wagner forgery, 27-bit challenge | **~419 ms** | 400–482 ms |
| Wagner forgery, 30-bit challenge | **~944 ms** | 925–975 ms |
| **ROS forgery, full 256-bit challenge, 256 sessions** | **~187 ms** | 185–189 ms |

The four forgery rows are the ones you need trust for least: **the page times itself and prints the figure**, and the harness simply reads what a visitor would see. Their spread is wider because Wagner runs a birthday search — a stochastic algorithm genuinely takes a different length of time each run, and a row whose min and max sit close together would be the suspicious one.

The same protocol with no DOM at all (`npm run bench`, Vitest, mean of 10+): **34 ms for 2 signers, 47 ms for 3, 77 ms for 5.** Higher than the browser column, which is measured on Chromium's V8 rather than Node's.

A session costs **17 scalar multiplications per signer plus 4** — 89 for five signers — counted exactly, not estimated: `src/musig/cost.test.ts` mocks the one primitive every module reaches the curve through and asserts the total. That test is the real performance guard. A wall-clock ceiling is the obvious choice and the wrong one, because CI runners vary by more than the regression you are trying to catch; an operation count is identical on every machine and strictly more sensitive.

Sub-quarter-second is well inside "feels instant" for a click, which is why exhibit 5 runs the entire vector suite on every page load rather than shipping a cached result.

Measuring found two real problems, which is the argument for measuring at all.

The first was dead work: every partial signature had both sides of its group equation computed twice — once when the record was built, then again after the tamper path could have replaced the scalar — and the second result overwrote the first every time.

The second was worse and older, and only showed up once the work was being *counted* rather than timed. A session's derived values (`Q`, `b`, `R`, `e`) were re-derived inside every per-signer call, and deriving them re-runs the whole key aggregation — one scalar multiplication per signer. So signing and verifying `u` partials cost `O(u²)`: **4u² + 22u + 5**, or 215 multiplications for five signers where 89 suffice. The session is now derived once and passed down; the public, spec-shaped `partialSigVerify` still derives its own context exactly as BIP-327 describes, for callers who have only the wire data.

Together: a 5-signer session went from **117 ms to 34 ms** in the browser and **319 ms to 77 ms** with no DOM, and the whole 56-case vector suite from 215 ms to 182 ms. Nothing about what is computed changed — only how many times.

None of this arithmetic is constant-time and **no timing property should be inferred from these numbers** — they describe interactive responsiveness, not side-channel resistance.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Token Tell

- **slug**: `crypto-lab-token-tell`
- **repo**: https://github.com/systemslibrarian/crypto-lab-token-tell
- **live**: https://systemslibrarian.github.io/crypto-lab-token-tell/
- **commit_sha**: `7179348497c4060237390a07783c6bbedabdec90` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | STEGANOGRAPHY  ·  **level**: intermediate  ·  **--accent**: #b6a4ff
- **MISSING FIELDS**: mutations

**Name (H1)**: Token Tell  — _read from index.html_

**Subtitle**: SynthID-Text · C2PA · watermark vs. signature  — _read from index.html_

**Description**: Runs the real keyed g-value detector over watermarked text, then signs the same words with ECDSA P-256, so you can watch one kind of evidence vanish when the key changes and the other stay binary when a byte does.  — _read from index.html_

**Why it matters**: Schools, courts and newsrooms are being sold "AI detectors" that promise to tell them what a machine wrote. A watermark detector answers a much narrower question, and knowing which question was answered is the difference between evidence and an accusation.  — _read from index.html_

**Card copy**: Runs the real SynthID-Text keyed detector over watermarked text, then signs the same words with ECDSA P-256: change only the key and the statistical evidence vanishes; change one byte and verification fails outright.

**Chips**: SynthID-Text · Tournament Sampling · ECDSA P-256 · C2PA Manifest

**Implements**: ECDSA `src/c2pa/sign.ts:25`, P-256 `src/c2pa/sign.ts:25`, SHA-256 `src/c2pa/manifest.ts:97`

**Attacks shown**: Brute force `verification/claims.mjs:867`

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `10.1038/s41586-024-08025-4,` — first seen src/ui/reference.ts:225 (1×)
- `10.1080/01621459.1927.10502953.` — first seen src/ui/reference.ts:327 (1×)
- `10.1093/oxfordjournals.aje.a112510.` — first seen src/ui/reference.ts:321 (1×)
- `10.1155/S1110865702000525;` — first seen src/ui/reference.ts:315 (1×)
- `10.18653/v1/2025.emnlp-main.1567.` — first seen src/ui/reference.ts:273 (1×)
- `10.62056/ahmpdkp10.` — first seen src/ui/reference.ts:267 (1×)
- `arXiv:2509.21057` — first seen src/ui/reference.ts:279 (1×)
- `arXiv:2605.29434` — first seen src/ui/reference.ts:285 (1×)
- `doi.org/10.1080/01621459.1927.10502953` — first seen verification/claims.mjs:143 (2×)
- `doi.org/10.1093/oxfordjournals.aje.a112510` — first seen verification/claims.mjs:153 (2×)
- `doi.org/10.1155/S1110865702000525` — first seen src/ui/reference.ts:316 (1×)

**Stated limitations (page)**:

- _(caveat, tools/make-social-image.mjs)_ A watermark is not a signature. This is evidence about one watermark key. It does not establish authorship and does not prove that text is AI-generated.

**README — What Can Go Wrong**:

```text
- **Reading a score as an accusation.** A positive score is evidence about a watermark
  configuration. It says nothing about who wrote the text, whether it is true, or whether
  some other model produced it.
- **Reading a negative as exoneration.** Unmarked text, another vendor's mark, and a
  thoroughly rewritten marked text all look the same to this detector.
- **Assuming a configuration is a key.** Two published implementations of this scheme,
  given the same keys and text, do not read each other's marks. The lab measures it.
- **Trusting a threshold from elsewhere.** Every threshold here was measured on this
  configuration, this model and a corpus of 48 texts per class. None generalises.
- **Taking a signature for a fact-check.** Act VI signs a false statement with a real key,
  and it verifies.
- **Mistaking the short route for the whole argument.** Demo is a presentation order over
  the same evidence, not a lighter claim. The panels it hides are where the numbers are
  checked, and the demo says so on the page and offers the way through.
```

**Claims tested** (e2e/claims.spec.ts, 22 test(s)):

- `the Hero scores the committed sample to the reference value` — e2e/claims.spec.ts:87
    - :91 `toBeCloseTo` expected `REFERENCE.watermarkedScore, 4` _(expression)_
    - :101 `toBe` expected `REFERENCE.watermarkedGSum` _(expression)_
    - :102 `toBeCloseTo` expected `Number(score), 4` _(expression)_
- `the position counts sum to the whole` — e2e/claims.spec.ts:105
    - :120 `toBe` expected `candidates` _(expression)_
    - :121 `toBe` expected `tokens - 4` _(expression)_
    - :122 `toBe` expected `scored * depth` _(expression)_
    - :124 `toBe` expected `REFERENCE.watermarkedCandidates` _(expression)_
    - :125 `toBe` expected `REFERENCE.watermarkedScored` _(expression)_
    - :126 `toBe` expected `REFERENCE.depth` _(expression)_
- `the same bytes under a wrong key lose the evidence, and the control never had it` — e2e/claims.spec.ts:129
    - :140 `toBeCloseTo` expected `REFERENCE.watermarkedScore, 4` _(expression)_
    - :141 `toBeCloseTo` expected `REFERENCE.controlScore, 4` _(expression)_
    - :143 `expect` expected _no expected value_ _(none)_
    - :145 `expect` expected _no expected value_ _(none)_
    - :151 `toContainText` expected `'Evidence for this key'` _(literal)_
    - :152 `toContainText` expected `'No evidence for this key'` _(literal)_
    - :153 `toContainText` expected `'No evidence for this key'` _(literal)_
    - :154 `expect` expected _no expected value_ _(none)_
- `the three Hero inputs hash as the page says they do` — e2e/claims.spec.ts:158
    - :161 `toHaveCount` expected `3` _(literal)_
    - :165 `toBe` expected `values[1]` _(expression)_
    - :166 `toBe` expected `values[2]` _(expression)_
    - :167 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :172 `expect` expected _no expected value_ _(none)_
    - :174 `expect` expected _no expected value_ _(none)_
- `the summary cards kept the whole calculation trail rather than dropping it` — e2e/claims.spec.ts:178
    - :184 `toHaveCount` expected `0` _(literal)_
    - :188 `toHaveCount` expected `1` _(literal)_
    - :190 `expect` expected _no expected value_ _(none)_
    - :194 `toContainText` expected `'Threshold source:'` _(literal)_
    - :195 `toContainText` expected `'unwatermarked texts'` _(literal)_
    - :202 `toHaveCount` expected `1` _(literal)_
    - :204 `toEqual` expected `CALCULATION_TERMS` _(expression)_
- `the detector retires a verdict when the text changes, and a no-op does not` — e2e/claims.spec.ts:207
    - :212 `toBeVisible` expected _no expected value_ _(none)_
    - :217 `toHaveCount` expected `0` _(literal)_
    - :218 `toBeVisible` expected _no expected value_ _(none)_
    - :222 `toHaveCount` expected `1` _(literal)_
    - :223 `toContainText` expected `'retired'` _(literal)_
    - :224 `toHaveCount` expected `0` _(literal)_
    - :228 `toHaveCount` expected `0` _(literal)_
    - :229 `toBeVisible` expected _no expected value_ _(none)_
- `a short text is refused a score rather than given a meaningless one` — e2e/claims.spec.ts:232
    - :237 `toContainText` expected `'No score'` _(literal)_
    - :238 `toBe` expected `'n/a'` _(literal)_
- `the two constructions disagree on the same bytes and the same keys` — e2e/claims.spec.ts:241
    - :247 `toBeVisible` expected _no expected value_ _(none)_
    - :248 `toHaveCount` expected `1` _(literal)_
    - :249 `toBe` expected `'identical bytes in both rows'` _(literal)_
    - :250 `toBe` expected `'identical in both rows'` _(literal)_
    - :256 `toBe` expected `2` _(literal)_
    - :258 `toBeCloseTo` expected `REFERENCE.watermarkedScore, 3` _(expression)_
    - :259 `expect` expected _no expected value_ _(none)_
- `the cross-implementation panel is hidden by the short route, not deleted from it` — e2e/claims.spec.ts:262
    - :270 `toHaveCount` expected `1` _(literal)_
    - :271 `toBeHidden` expected _no expected value_ _(none)_
    - :272 `toBe` expected `'identical bytes in both rows'` _(literal)_
    - :273 `toHaveCount` expected `0` _(literal)_
    - :274 `toHaveCount` expected `0` _(literal)_
- `the attack sweep reports every run, including any that survive` — e2e/claims.spec.ts:277
    - :281 `toContainText` expected `'Sweep complete', {` _(expression)_
    - :286 `toBeCloseTo` expected `REFERENCE.watermarkedScore, 3` _(expression)_
    - :295 `toHaveCount` expected `5 * (1 + 5 + 5)` _(expression)_
    - :300 `toBeCloseTo` expected `Number(cells[5]) - baseline, 3` _(expression)_
- `the pinned paraphrase result is reported as measured, not as expected` — e2e/claims.spec.ts:303
    - :312 `toHaveCount` expected `7` _(literal)_
    - :319 `toBeCloseTo` expected `after - before, 3` _(expression)_
    - :323 `toBe` expected `after >= threshold ? 'above threshold' : 'below threshold'` _(expression)_
- `signing, tampering and stripping report three different outcomes` — e2e/claims.spec.ts:326
    - :332 `toContainText` expected `'Verification passed'` _(literal)_
    - :334 `toBe` expected `'yes'` _(literal)_
    - :335 `toBe` expected `'yes'` _(literal)_
    - :339 `toContainText` expected `'Verification failed'` _(literal)_
    - :341 `toBe` expected `'yes'` _(literal)_
    - :342 `toBe` expected `'no'` _(literal)_
    - :346 `toContainText` expected `'No manifest'` _(literal)_
    - :347 `toBe` expected `'no'` _(literal)_
    - :371 `toHaveText` expected `expected` _(expression)_
- `a plainly false statement verifies, and the page says what that means` — e2e/claims.spec.ts:374
    - :378 `toContainText` expected `'Verification passed'` _(literal)_
    - :380 `toContainText` expected `'does not prove that the claim'` _(literal)_
    - :381 `expect` expected _no expected value_ _(none)_
    - :386 `toHaveText` expected _no expected value_ _(none)_
- `the comparison table carries all eleven rows and marks the load-bearing one` — e2e/claims.spec.ts:392
    - :396 `toHaveCount` expected `11` _(literal)_
    - :401 `toHaveText` expected `'WHO CAN VERIFY?'` _(literal)_
    - :402 `toHaveCount` expected `1` _(literal)_
    - :403 `expect` expected _no expected value_ _(none)_
- `the compact comparison agrees, row for row, with the eleven-row table it summarises` — e2e/claims.spec.ts:407
    - :438 `toBe` expected `4` _(literal)_
    - :439 `toBe` expected `11` _(literal)_
    - :443 `toBe` expected `'WHO CAN VERIFY?'` _(literal)_
    - :444 `toBe` expected `true` _(expression)_
    - :448 `expect` expected _no expected value_ _(none)_
    - :449 `toBe` expected `3` _(literal)_
    - :450 `toBe` expected `3` _(literal)_
    - :451 `expect` expected _no expected value_ _(none)_
    - :460 `toContainText` expected `'This is the row the rest of the table follows from.'` _(literal)_
    - :461 `expect` expected _no expected value_ _(none)_
- `stripping and regeneration are shown as different failures` — e2e/claims.spec.ts:465
    - :476 `toBeVisible` expected _no expected value_ _(none)_
    - :477 `toBeVisible` expected _no expected value_ _(none)_
    - :480 `toContainText` expected `'Asset digest before and after'` _(literal)_
    - :481 `toBeVisible` expected _no expected value_ _(none)_
    - :485 `toBeCloseTo` expected `REFERENCE.watermarkedScore, 3` _(expression)_
    - :489 `toContainText` expected _no expected value_ _(none)_
    - :492 `toHaveText` expected _no expected value_ _(none)_
- `the population estimate is what its own printed inputs imply` — e2e/claims.spec.ts:506
    - :510 `toContainText` expected `'Done.'` _(literal)_
    - :530 `toBeCloseTo` expected `rate, 1` _(expression)_
    - :540 `expect` expected _no expected value_ _(none)_
    - :547 `expect` expected _no expected value_ _(none)_
    - :548 `expect` expected _no expected value_ _(none)_
    - :549 `expect` expected _no expected value_ _(none)_
    - :558 `toBe` expected `documents` _(expression)_
    - :559 `toBe` expected `flagged` _(expression)_
    - :560 `toBe` expected `Math.round((held / 100) * documents)` _(expression)_
    - :561 `expect` expected _no expected value_ _(none)_
    - :568 `expect` expected _no expected value_ _(none)_
    - :571 `expect` expected _no expected value_ _(none)_
    - :574 `toBe` expected `documents` _(expression)_
    - :575 `toBe` expected `flagged` _(expression)_
    - :581 `toContainText` expected `'50.0%'` _(literal)_
    - :583 `expect` expected _no expected value_ _(none)_
- `a reset offers itself only when there is something to reset` — e2e/claims.spec.ts:599
    - :612 `expect` expected _no expected value_ _(none)_
    - :617 `expect` expected _no expected value_ _(none)_
    - :618 `toContainText` expected `'first'` _(literal)_
    - :621 `toContainText` expected `'Done.', { timeout: 60_000 }` _(expression)_
    - :622 `expect` expected _no expected value_ _(none)_
    - :626 `expect` expected _no expected value_ _(none)_
    - :633 `expect` expected _no expected value_ _(none)_
- `the social preview prints the three scores this page computes` — e2e/claims.spec.ts:638
    - :648 `toBe` expected `3` _(literal)_
    - :649 `expect` expected _no expected value_ _(none)_
    - :650 `expect` expected _no expected value_ _(none)_
- `a deep link opens the exact scenario it advertises` — e2e/claims.spec.ts:654
    - :659 `expect` expected _no expected value_ _(none)_
    - :661 `toBeHidden` expected _no expected value_ _(none)_
    - :662 `toContainText` expected `'Verification passed'` _(literal)_
    - :667 `toContainText` expected `'Verification failed'` _(literal)_
    - :668 `toBe` expected `'no'` _(literal)_
    - :669 `expect` expected _no expected value_ _(none)_
    - :674 `toHaveValue` expected `'mid_entropy'` _(literal)_
    - :680 `toHaveValue` expected `'high_entropy'` _(literal)_
    - :681 `expect` expected _no expected value_ _(none)_
- `a deep link to a sample loads that sample, and a link to nothing is dropped` — e2e/claims.spec.ts:685
    - :691 `toHaveValue` expected `'back-translation'` _(literal)_
    - :693 `toBe` expected `shipped` _(expression)_
    - :694 `expect` expected _no expected value_ _(none)_
    - :696 `toHaveCount` expected `1` _(literal)_
    - :702 `toHaveValue` expected `''` _(literal)_
    - :703 `toBe` expected `shipped` _(expression)_
    - :704 `expect` expected _no expected value_ _(none)_
- `no element is hidden by the cascade while the code believes it is hidden` — e2e/claims.spec.ts:727
    - :740 `toHaveCount` expected `0` _(literal)_
    - :741 `toEqual` expected `[]` _(expression)_
    - :744 `toHaveCount` expected `0` _(literal)_
    - :745 `toEqual` expected `[]` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

**verification/ manifest** (14 file(s)):

- `verification/claims.mjs` (67856 bytes)
- `verification/manifest.yaml` (75698 bytes)
- `verification/README.md` (4600 bytes)
- `verification/schema.json` (13409 bytes)
- `verification/tools/build-manifest.mjs` (9150 bytes)
- `verification/tools/check-computations.mjs` (7068 bytes)
- `verification/tools/validate-manifest.mjs` (16839 bytes)
- `verification/vectors/canonicalization.json` (1300 bytes)
- `verification/vectors/README.md` (520 bytes)
- `verification/verifier/c2pa.mjs` (4065 bytes)
- `verification/verifier/int64.mjs` (3391 bytes)
- `verification/verifier/tokenizer.mjs` (4346 bytes)
- `verification/verifier/verify.mjs` (19079 bytes)
- `verification/verifier/watermark.mjs` (5537 bytes)

<details><summary>Full README</summary>

```markdown
# Token Tell

**A watermark is not a signature. SynthID-Text does not detect AI text — it detects text
generated by a model carrying your key.**

More precisely: the detector runs a statistical test for evidence associated with a
particular watermark configuration and key. It does not establish authorship and does not
prove that text is AI-generated.

## What It Is

A browser lab that runs the real SynthID-Text detection path over real watermarked text,
and then signs the same words with ECDSA P-256 over a C2PA-shaped manifest, so the two
kinds of evidence can be compared side by side rather than described.

The watermark half implements the keyed g-value construction from
`google-deepmind/synthid-text` at commit `addb4a1`: a 64-bit linear congruential hash
seeded by a SHA-256 initialization vector over the key list, twelve rounds of re-hashing
per g-value, repeated-context masking, and the mean g-score from the Nature paper's
equation (1) with its exact Binomial null. It also implements the *different* g-value
construction shipped in `transformers` 5.15.1, because the two do not agree — and showing
that they do not is one of the things this lab is for.

The signature half is real ECDSA P-256 through WebCrypto over a manifest carrying
assertions, a claim binding them by hash, and a hard binding over the asset bytes.

Not production crypto — a teaching demo. The keys are published in this repository (they
are the reference implementation's own defaults), the scoring statistic is the plain mean
rather than the learned Bayesian detector both reference implementations ship, and the
C2PA panel is C2PA-*shaped* rather than conformant: no JUMBF, no COSE, no certificate
chains, no trust lists. Every one of those limits is stated on the page as well as here.

## Two Routes Through One Page

A segmented control in the header, under the title, chooses how much of the lab is on
screen. Beside it sit the two other controls a presenter needs: **Copy link**, and a reset
for the whole page.

- **Demo** — the 90-second route, and what a first-time visitor is given: the hero
  experiment, the two signing acts, a four-question comparison, and a panel that branches
  into the rest. Five chapters.
- **Full lab** — Acts I to VIII in order plus the reference section: tournament sampling,
  the detector opened up, entropy, the attack sweeps, the wrong-key sweep, the one-bit key
  mutation, the cross-implementation comparison, the eleven-row comparison table, the
  population estimate over a mixed corpus, and the limitations, maths, vectors and
  sources. Ten chapters.

The depth is a display decision over one page, not a second copy of it. Elements only an
auditor needs carry `data-depth="lab"`, the few compact restatements written for the short
route carry `data-depth="demo"`, and everything shared carries neither; Demo applies the
`hidden` attribute to the first set and nothing else. Every act mounts and computes at
both depths, and the smoke suite asserts mounting and visibility separately, so a second,
shorter render path — the one change that would make the page dishonest, because only one
of the two copies would be the code under test — would fail it.

Stated plainly, because it is what the short route costs: **Demo hides most of the page.**
Six of the ten sections are hidden, along with three panels inside the hero — the
wrong-key sweep, the one-bit key mutation and the cross-implementation comparison — and
Act VII's stripping-versus-regeneration experiment. At a laptop width the short route is
7,458 px of document against the full lab's 26,334; on a phone, 12,837 against 46,439.
All four are `document.documentElement.scrollHeight`, read off the production build at
1052 and 390 CSS pixels wide in headless Chromium — exact rather than rounded, because two
of them were once rounded to fifty and printed beside two that were not, and specific to
that renderer: the same build with different fonts installed measures a few percent
apart.

Three ways back to all of it: the **Full lab** segment; `?mode=lab` in the address; or the
"Choose the depth" panel that closes the short route, whose five questions each open the
full lab at the act that answers them.

No qualification is dropped, but two are deferred rather than shown. The
cross-implementation divergence and the full limitation list live in the reference
section, which the short route does not paint: measured on the rendered page,
`transformers` appears 0 times in Demo against 8 in Full lab, and `Bayesian` 0 against 2.
The short route's scope panel names both and links to them. What is on screen at both
depths is the C2PA-shaped-not-conformant panel, the caveats printed on the face of each
result card, Act VI's signed falsehood and every provenance tag.

The depth is remembered in `localStorage` under `token-tell:mode`, and a `?mode=` in the
address outranks the stored preference, so a link handed to someone else opens at the
depth it names rather than at whatever they last looked at.

Within a panel there is a third, smaller fold: the **reasoning behind a result travels
behind a summary**. Most panels stated a claim, showed a measurement, and then spent two
or three paragraphs on why the measurement looks the way it does — which is what an
unconvinced reader comes back for, and what everyone else has to scroll past to reach the
next experiment. Twelve of those now sit behind a named summary (*Why one bit costs
everything here*, *How these columns are computed, and why neither mean-g reads 0.500*),
built eagerly so the text is still in the document, still searchable and still readable by
the claims suite. Two rules keep it from becoming a way to hide the awkward half: a caveat
never folds — anything naming what a result does not prove, what was simplified, or which
corpus a number belongs to stays on the face of the panel — and the summary says what is
behind it, so the closed state is enough to decide whether you need it.

Where it does not pay, it is not done. The Hero's date corrections are the only foldable
paragraph the short route shows, and behind a summary that page measured 60 px TALLER at a
laptop width and 158 px taller on a phone — a summary row, its border and its margins cost
about what the paragraph did — so they stay in the open, where a correction on the first
panel a visitor meets belongs. The folding is worth 559 px of the full lab at a laptop
width and 1,216 px on a phone.

A sticky chapter control lists the beats of the current depth and marks the one on screen:
a single row of chapters on a desktop, and below 640 px a compact selector with previous
and next controls, because the nine stacked chips it replaced were 322 px of navigation
displacing the thing being navigated to.

## Exhibits

The short route shows exhibits 1, 6, 7 and 8 — the first without its sweeps, the eighth
compressed to four of its eleven questions. Full lab shows all nine whole and in order,
plus the reference section: the limitations, the maths, the test vectors and the sources.

1. **Same text, different key.** Opening with where a mark can go — a wire figure in a
   1280s paper mould, an inaudible code in Hembrooke's 1954 Muzak patent, and the word
   choices here — because each move puts the mark further inside the thing being marked
   and the last one runs out of substrate. Then one watermarked passage, three runs of
   one detector: the configured key, a wrong key on byte-identical input, and an
   unwatermarked control. Each is a result card — verdict, mean, threshold, exact p-value,
   one sentence saying what changed — with the rest of the audit trail behind
   **Show calculation**. Then the same experiment across up to 300 random keys, with the
   measured spread shown beside the spread the exact null predicts. A one-bit key
   mutation, and the same bytes read by the other published implementation.
2. **The hidden choice.** Tournament sampling over a pinned GPT-2 distribution. Up to
   eight layers draw the literal bracket over 2^m candidates; above that the view becomes
   layered, and the page says plainly that neither the browser nor any real implementation
   instantiates 2^30 candidates. Repeated-context masking shown firing on real text.
3. **Find the signal.** The detector opened up — tokenize, slide the context window,
   compute g-values, mask, average, compare against a null — on any text you paste. With
   the two components this lab refuses to ship without: what a score does not prove, and
   why this lab cannot check Gemini.
4. **The watermark needs choices.** Two real pinned distributions, high and low entropy,
   with the evidence each leaves per token measured rather than asserted. Then the corpus
   result that explains why detection plateaus below 100%.
5. **Attack it.** Truncation, deletion and replacement swept live at five strengths with
   every individual run listed; back-translation and paraphrase pinned from real models,
   with the exact revisions and parameters that produced them.
6. **Sign the same text.** Sign, flip one byte, strip the manifest — three different
   outcomes, no threshold anywhere.
7. **A signature can sign a lie.** A plainly false statement, signed with a real key, and
   verified.
8. **What each mechanism proves.** The symmetric-secret / asymmetric-public distinction,
   an eleven-row comparison whose second row is load-bearing — four of those eleven
   questions on the short route, selected out of the same data rather than restated —
   including the row on which way the evidence points, and stripping versus regeneration
   measured side by side.
9. **Measure a population.** The answer to "so what is it for?". The 96 pinned texts are
   cut into 768 forty-token documents; a third of them calibrate a threshold and its two
   error rates, and the rest are mixed at a fraction the estimator never sees. What comes back is an estimated
   marked fraction with a 95% interval that closes as the corpus grows — while the
   individual verdicts underneath it, counted on the same documents at the same moment,
   stay exactly as weak as Act II said they were.

## Live Demo

<https://systemslibrarian.github.io/crypto-lab-token-tell/>

It opens on the short route. Press **Run the proof**, then sign the same words, flip a
byte, strip the manifest, sign a false statement and watch it verify. Switch to **Full
lab** to paste your own text into the detector, run the wrong-key sweep, drag the
tournament depth from 1 to 30 and sweep the attacks. Every number on the page is computed
in the browser as you use it.

## The 90-Second Demo

The short route is built around this script. Each beat ends with a consequence line the
page prints itself, so the closing comparison is earned rather than asserted.

**0:00 — Run the proof.** The button sits in the first screen. One watermarked passage is
scored three times: under the configured key, under a wrong key given byte-identical
input, and once on unwatermarked text. The digests above the cards are what makes the
first two runs the same experiment.
→ *Changed only the secret → the watermark verdict disappeared.*

**0:25 — Sign the same bytes.** Act V signs on arrival; flip one byte, then strip the
manifest, then reset.
→ *Signed these exact bytes → integrity verification passed.*
→ *Changed one byte → integrity verification failed.*
→ *Removed the manifest → there was nothing left to verify.*

**0:55 — Sign something false.** Act VI signs a plainly false statement with a real key,
and the signature verifies.
→ *Signed a lie → integrity passed; truth remained unanswered.*

**1:15 — The comparison.** Four questions rather than ten, led by **WHO CAN VERIFY?**:
who can verify, whether the evidence is statistical or binary, whether it survives
manifest removal, and whether it proves the content is true.
→ *Asked who can verify → only the issuer can check a watermark; anyone can check a
signature.*

**1:40 — Choose the depth.** Five branches, each of which switches to Full lab and lands
on the act that answers it: how the hidden token choice works (Act I), how to read the
detector (Act II), how robust it is (Acts III and IV), what it is good for (Act VIII), and
whether the claims can be verified (the reference section).

## Deep Links

Five things are written into the address with `replaceState`: the depth, the section on
screen — whether it was reached through the chapter control, through a deep link, or by
scrolling to it — the sample loaded into the detector, Act I's scenario, and whether Act V
is tampered or stripped. Four are not: the scroll position within a section, a re-drawn
tournament bracket, a slider position, and the mechanism column Act VII has in focus. So
the address is a working link to the beat on screen and to the state of every experiment
named below, and it does not claim to restore anything else. **Copy link** copies exactly
that; if the browser refuses the clipboard — it is unavailable outside a secure context —
the link is rendered as selected text to copy by hand rather than failing silently.

| Parameter | Values | Effect |
| --- | --- | --- |
| `mode` | `demo`, `lab` | The depth. Absent: the stored preference, or Demo on a first visit. |
| `sample` | `watermarked`, `control`, `watermarked_alt`, `back-translation`, `paraphrase` | Opens Act II's detector on that pinned text, already scored. |
| `scenario` | `high_entropy`, `low_entropy`, `mid_entropy` | Opens Act I's tournament on that pinned distribution. |
| `sign` | `tampered`, `stripped` | Opens Act V with the hard binding broken, or with the manifest removed, instead of signed and intact. |

The anchors are `#hero-experiment`, `#act-1` through `#act-8`, `#reference`, and
`#branch-depth` for the panel that closes the short route. A section the current depth
hides cannot be reached by anchor alone, so a link into Acts I to IV, Act VIII or the
reference section needs `mode=lab` beside it; the branch links inside the page switch the depth for
you. Every anchor lands its heading clear of both sticky bars, which the visual suite
checks at four widths rather than trusting a scroll margin.

A value the page does not hold — a sample it has no text for, a scenario it has no
distribution for — is dropped from the address rather than left lying beside a different
experiment. `sign` is honoured on a cold load only and cleared afterwards, so the global
reset returns Act V to signed and intact.

A worked example, ready to paste:

`​``
https://systemslibrarian.github.io/crypto-lab-token-tell/?mode=lab&sample=paraphrase#act-2
`​``

That opens the full lab with the detector already showing the pinned paraphrase attack,
scored against the threshold measured here, scrolled to Act II. For the short route,
`?mode=demo&sign=tampered#act-5` opens on the signing act with the hard binding already
broken — the state to have on screen before an audience arrives, rather than one a
presenter has to reach live.

## Presenter Reliability

The lab is deterministic, and a demo can still be derailed by an act left tampered or by a
machine that will not sign. Each of the following is a rendering that exists and is
tested, not an intention:

- **Reset without reloading.** Every mutable experiment carries its own reset — *Reset the
  sweep*, *Reset the tournament*, *Reset the detector*, *Reset the recomputation*, *Reset
  the corpus scoring*, *Reset the attacks*, *Reset act* in Acts V and VI, *Reset and
  re-run both* in Act VII, *Reset the estimate* in Act VIII — and the icon in the header rebuilds all of them at once and
  says so through a live region. A reload would also discard the depth, the anchor and the
  scroll position the audience is looking at, which is why nothing on the page needs one.
- **Mutation controls stay off until there is something to mutate.** Act V's flip, strip
  and re-verify controls are disabled until a manifest exists, with the reason stated
  beside them rather than left to be inferred from a grey button. The five resets whose
  panels render nothing until a button is pressed follow the same rule: off until the run
  produces something, and off again the moment they have put it back — which is what makes
  the press perceptible when the output it cleared was below the fold. Offered enabled,
  they answered a press by doing nothing and saying nothing, which is indistinguishable
  from a broken control.
- **Busy is a word, not a spinner.** Every asynchronous run marks its region `aria-busy`
  and prints what it is doing — `Signing with ECDSA P-256…`, `Scored 140 of 300 wrong
  keys.` — because a spinner is invisible to a screen reader and to a contrast oracle
  alike, and because it is the long runs that need explaining.
- **A failure is answered on the page.** If WebCrypto or a long calculation throws, the
  panel replaces its half-written output with what went wrong and a **Try again** that
  clears the notice before retrying, and the controls come back enabled. The case this
  exists for is real: `crypto.subtle` is undefined outside a secure context, so a lab
  opened over plain HTTP on a conference network loses the signing half — and it says so
  instead of leaving a dead button beside a blank panel. The detector half is independent
  of WebCrypto and keeps working.
- **Reduced motion.** The hero's staged reveal is a sequence over results that were
  already computed, never the source of them. Under `prefers-reduced-motion: reduce` all
  three cards are final the moment the button is pressed, and nothing on the page animates.

## When to Use It

- Use it to explain why a watermark detector's answer is narrower than "was this written
  by AI", because the page shows the evidence disappearing when only the key changes.
- Use it to show the difference between statistical and binary evidence, because both are
  running on the same words on the same page.
- Use it to teach why provenance systems want signatures *and* watermarks, because the
  failure modes are demonstrated rather than argued.
- Do **not** use it to check whether any real product watermarked a piece of text: it
  reads the keys published here and nothing else, and it is a demo app that does not
  provide hardened operational controls.

## What Can Go Wrong

- **Reading a score as an accusation.** A positive score is evidence about a watermark
  configuration. It says nothing about who wrote the text, whether it is true, or whether
  some other model produced it.
- **Reading a negative as exoneration.** Unmarked text, another vendor's mark, and a
  thoroughly rewritten marked text all look the same to this detector.
- **Assuming a configuration is a key.** Two published implementations of this scheme,
  given the same keys and text, do not read each other's marks. The lab measures it.
- **Trusting a threshold from elsewhere.** Every threshold here was measured on this
  configuration, this model and a corpus of 48 texts per class. None generalises.
- **Taking a signature for a fact-check.** Act VI signs a false statement with a real key,
  and it verifies.
- **Mistaking the short route for the whole argument.** Demo is a presentation order over
  the same evidence, not a lighter claim. The panels it hides are where the numbers are
  checked, and the demo says so on the page and offers the way through.

## Real-World Usage

SynthID-Text is deployed by Google and open-sourced for others to run on their own models.
Its detection requires the watermarking key: the paper states that scoring "only requires
access to the tokenized text, the watermarking key k and the random seed generator", and
Google's own guidance tells issuers that each watermarking configuration "should be stored
securely and privately, otherwise your watermark may be trivially replicable by others".
That is what makes verification issuer-only.

C2PA runs the other way round: the private key signs, and anyone with the certificate
chain can check. That difference is the subject of the last act.

## How to Run Locally

`​``
npm install
npm run dev
`​``

The dev server serves under the deployed base path, so the app is at
<http://localhost:5173/crypto-lab-token-tell/> rather than at the origin root.

To reproduce the pinned data (needs Python, torch and the pinned model revisions):

`​``
python tools/capture_sampling_table.py
python tools/export_tokenizer.py
python tools/generate_texts.py
python tools/capture_distributions.py
python tools/capture_corpora.py
python tools/capture_attacks.py
python tools/make_test_vectors.py --construction deepmind
python tools/make_test_vectors.py --construction transformers
`​``

Those scripts need two virtualenvs, because the two implementations pin incompatible
dependency sets — which is itself part of the divergence this lab documents:

`​``
pip install -r tools/requirements-deepmind.txt      # everything except the two below
pip install -r tools/requirements-transformers.txt  # capture_sampling_table.py and
                                                    # make_test_vectors.py --construction transformers
`​``

## Related Demos

- [crypto-lab-signed-bytes](https://systemslibrarian.github.io/crypto-lab-signed-bytes/) —
  what exactly a signature covers, and how canonicalization decides it.
- [crypto-lab-j-uniward](https://systemslibrarian.github.io/crypto-lab-j-uniward/) —
  steganography in images, where the payload really is hidden in the content.
- [crypto-lab-chain-of-trust](https://systemslibrarian.github.io/crypto-lab-chain-of-trust/) —
  the certificate machinery C2PA's trust model rests on.

## Build & Verify

`​``
npm test              # 230 unit tests, including differential vectors from both references
npm run verify        # the independent verifier: 112 checks, sharing no module with the lab
npm run verify:manifest
npm run verify:computations   # every computable claim evaluated in its own declared language
npm run test:a11y     # all five browser suites, 63 tests, against the production build
`​``

`npm run test:a11y` builds the site and serves the build with `vite preview` before it
starts, so what passes there is what ships. The five suites can be run one at a time:

`​``
npx playwright test e2e/a11y.spec.ts     # axe WCAG 2.1 A/AA plus further oracles; slow
npx playwright test e2e/claims.spec.ts   # 22 tests that re-derive what the page says
npx playwright test e2e/offline.spec.ts  # the precache under host rules, not preview's
npx playwright test e2e/smoke.spec.ts    # every act mounts and computes at either depth
npx playwright test e2e/visual.spec.ts   # 34 geometry tests at four viewports; ~80 s
`​``

The unit suite is differential, not self-referential: every expectation for the hash, the
g-values, the masks and the scores came out of Python — either
`google-deepmind/synthid-text @ addb4a1` or `transformers` 5.15.1 — and is committed under
`src/data/pinned/`. The tokenizer is held to vectors from the Hugging Face tokenizer at
the pinned revision, and the derived vocabulary is checked against the real vocabulary's
SHA-256.

`verification/` holds a claim manifest generated from `verification/claims.mjs`, and an
independent verifier that re-derives everything with its own arithmetic — 32-bit limb
pairs where the lab uses BigInt, its own BPE implementation, its own canonical JSON — so
that agreement between them is evidence rather than a shared bug. Both the validator and
the verifier have been mutation-tested: corrupting a snippet or a committed hash makes
each of them fail, naming the finding.

[`docs/MATH.md`](docs/MATH.md) carries the derivations, every divergence between the paper
and the two implementations, and the seven open questions this build could not close.
[`verification/manifest.yaml`](verification/manifest.yaml) is the machine-readable copy of
the same claims, and [`verification/README.md`](verification/README.md) explains why the
verifier is written the way it is.

## Link Preview and Icons

`​``
npm run make:social
`​``

That regenerates five committed files in `public/`: `og.png` (1200x630), `icon.svg`, and
`icon-180.png`, `icon-192.png` and `icon-512.png` rasterised from it.

The preview card is the experiment, not a picture of it. Every figure on it — the three
mean g-scores, the 1% false-positive threshold, and the SHA-256 that runs 1 and 2 share —
is read out of `src/data/pinned/` at generation time, and the verdicts are derived by
comparing each score against the threshold rather than typed in. If a pinned value is
missing the script stops and names the path it wanted; if a score ever fell on the wrong
side of the threshold it stops rather than draw "Evidence" over a score that is not
evidence. A social card is read without the page, so it is the easiest place in a project
to state something the project cannot support.

The icons replace an emoji data URI. An emoji is drawn by whichever font the reader's
platform supplies, so the mark changed shape between a phone, a laptop and a projector;
the replacement is rectangles in the lab's own accent pair, with no font dependency and
enough weight to survive 16px. The card and the PNGs are committed rather than built in
CI, because text is rasterised by the host's font stack: the same pinned inputs always
give the same image, but not the same bytes on a different machine.

Every asset path is relative (`./`), including in
[`public/manifest.webmanifest`](public/manifest.webmanifest) — the site deploys under a
GitHub Pages project subpath, where a root-absolute path 404s.

### The Visual Contract

The defect that produced [`e2e/visual.spec.ts`](e2e/visual.spec.ts) passed every gate this
repository had. Every act mounted, every statistic re-derived, axe reported nothing, and
the claims suite agreed with each number on the page — while the three figures the hero
exists to compare rendered one character per line at an ordinary laptop width. The DOM was
correct; only the geometry was wrong.

So this suite asserts geometry and driven state, numerically, at 390 × 844, 768 × 1024,
1052 × 923 and 1440 × 900, at both depths. It checks that:

- the page opens at the top and never scrolls sideways, including with the comparison in
  each of its shapes and with a question expanded;
- **Run the proof** is inside the first screen at every width, below the sticky bars, and
  is not covered by anything — hit-tested, because arithmetic can agree while something
  floats over the button;
- the first screen holds no blank band wider than 96 px, and no more than 40 px of nothing
  where the hero's two halves meet once the layout is a column;
- the chapter control stays under 56 px tall and paints exactly one of its two shapes;
- no value in a result card, promoted or inside its opened calculation trail, is narrower
  than eight characters of its own font, runs to more than two lines, or wraps at fewer
  than four characters a line;
- switching depth does not resize the result cards, so both depths are the same rendering;
- every chapter jump and every cold deep link lands its heading below the sticky bars and
  on screen, with the heading's own centre hit-testing to the heading;
- signed, tampered, stripped and reset each render, and keyboard focus paints a ring;
- the busy state disables every control and says so in words, with the real signature
  slowed to a second and a half rather than faked;
- a browser with no `crypto.subtle` gets a recovery and a working detector, with no
  console error;
- reduced motion shows three distinct final figures with no wait of any kind and nothing
  animating, and the same press with motion allowed does stage content.

**It does not compare screenshots against a stored baseline, and that is deliberate.** It
takes focused screenshots — the hero summary, the signing act in each of its states, the
comparison at both depths, the focus ring — and attaches them to the report for a person
to look at:

`​``
npx playwright test e2e/visual.spec.ts --reporter=html && npx playwright show-report
`​``

This repository is developed on macOS and gated on ubuntu-latest, and a pixel baseline
across those two font stacks fails on hinting, fallback faces and subpixel rounding rather
than on the defect it was written to catch. A suite that fails for the wrong reason is
worse than none, because the first thing it teaches its reader is to re-record the
baseline. Every threshold above is therefore either relative to something the page itself
supplies — the character advance of the value's own font, the measured height of the
sticky bars, the viewport in use — or a distance the layout's own spacing rules fix, so
the same numbers hold on a runner with other fonts. Nothing here checks whether the page
is handsome; it checks that no result is clipped, vertical, overlapping or hidden.

## Performance

The bundle is large for a lab of this kind — around 840 kB, 335 kB gzipped — and almost
all of it is data rather than code: the GPT-2 merge list the tokenizer is rebuilt from,
and the two committed corpora that let the page recompute its own thresholds in the
browser instead of asking you to trust them. That trade was made deliberately in favour of
being checkable.

Detection at the reference implementation's default depth of 30 costs about 390 hash steps
per scored position, so a 320-token passage scores in a few milliseconds. The wrong-key
sweep re-walks the sequence once per key and is chunked with a progress readout for that
reason; the corpus passes score 48 texts each and take a second or two.

Nothing on the page blocks on the network, and the built site works offline after the
first visit. A navigation prefers the network, so a returning visitor picks up a new
deploy on the first load that reaches one, and falls back to the precached shell after
three seconds. The deadline is there because a network that accepts a connection and then
never answers — which is what a captive portal or a hotel access point does — never
rejects, and a `catch` alone would leave the reader on a blank page for as long as the
browser's own timeout with a complete copy of the lab cached beside them. Losing that race
costs one deploy of freshness and nothing else: the shell and its content-hashed assets
come out of the same cache, so the pair is always coherent, and the worker that fetched
the new deploy in the background takes over on the next navigation. The precache itself is
fetched with `cache: 'reload'` for a related reason: GitHub Pages sends a ten-minute
`cache-control` on the document, so a return visit inside that window would otherwise
store the previous deploy's shell next to this deploy's script. The worker is registered
in production builds only, so the dev server never serves yesterday's bundle back to
whoever is working on the page.

That first sentence was false on every deploy since the worker was added, and it is worth
saying how. The build copies `public/.nojekyll` into the output, the worker precaches
everything the build wrote, GitHub Pages refuses any path whose segment begins with a dot,
and `Cache.addAll` rejects the whole batch on a single non-ok response — so a zero-byte
marker file nothing ever requests discarded the install and the registration with it,
leaving a named cache holding zero entries on the live origin. `vite preview` answers that
same URL with a 200, which is exactly why every local check and the whole browser suite
went green over a worker that could not install where it ships. The precache now drops
dotted paths, `public/.nojekyll` stays on disk because it still guards a branch-based
deploy, and [`e2e/offline.spec.ts`](e2e/offline.spec.ts) asserts the property over the
generated list and then drives a real install and a real offline navigation through a
stand-in that applies the host's rule — because no test served by the local server could
ever have seen it.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## SM9 Forge

- **slug**: `crypto-lab-sm9-forge`
- **repo**: https://github.com/systemslibrarian/crypto-lab-sm9-forge
- **live**: https://systemslibrarian.github.io/crypto-lab-sm9-forge/
- **commit_sha**: `35ac4a6cd38f6827b962f37c2d69af8255115c02` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | ENCRYPTION  ·  **level**: advanced  ·  **--accent**: #ffb84d
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: SM9 Forge  — _read from index.html_

**Subtitle**: GM/T 0044 · GB/T 38635 · ISO/IEC 14888-3 · ISO/IEC 18033-5  — _read from index.html_

**Description**: Extracts an identity key by inverting in the exponent, then runs SM9's signature, key exchange and encryption against the standard's own worked examples.  — _read from index.html_

**Why it matters**: When your name is your public key, somebody has to mint the private one. SM9 gives that authority two master keys rather than one, so it can both read your mail and sign in your name — and the arithmetic that makes this convenient also means a passing signature check proves the two sides agreed, not that either followed the standard.  — _read from index.html_

**Card copy**: Extract an identity key by inverting in the exponent rather than hashing to a curve, run SM9’s signature, key exchange and encryption against the standard’s own worked examples, and see why two implementations agreeing doesn’t prove either followed the spec.

**Chips**: SM9 · Identity-Based · R-ate Pairing · BN256 · Key Escrow · Nonce Reuse

**Implements**: EC point arithmetic `src/attack/nonce-reuse.ts:92`, Pairing `src/sm9/encrypt.ts:223`, SM9 `src/sm9/pairing.ts:57`

**Attacks shown**: Discrete log `src/main.ts:54`, Nonce reuse `src/ui/pane5-break.ts:44`

**Comment-only (named in code comments, not executed)**: BLS signatures `src/main.ts:21`, BLS12-381 `src/main.ts:21`, DSA `src/attack/nonce-reuse.ts:60`, ECDSA `src/attack/nonce-reuse.ts:14`, MD5 `src/sm9/params.ts:9`, One-time pad `src/sm9/encrypt.ts:86`, SM4 `src/sm9/encrypt.ts:517`

**References**: BLS signatures, BLS12-381, Boneh-Franklin IBE, DSA, ECDSA, Hash-to-curve, MD5, One-time pad, SHA-256, SM4

**Standards body**: ISO

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `ePrint 2016/1102` — first seen README.md:311 (2×)
- `eprint.iacr.org/2016/1102` — first seen README.md:311 (1×)
- `ISO/IEC 14888-3` — first seen README.md:3 (5×)
- `ISO/IEC 18033-5` — first seen README.md:3 (3×)

**Stated limitations (page)**:

- _(scope-note, index.html)_ Not production cryptography — a teaching demo. Everything runs in your browser; nothing is stored and nothing leaves the page.

**README — What Can Go Wrong**:

```text
**A passing check does not pin which identity-to-scalar map produced the key.**
This is the lab's headline finding, and it needs stating precisely because the loose
version of it is false. SM9 verification *does* check the identity binding:
`h1 = H1(ID‖hid, N)` feeds `P = [h1]P2 + Ppub-s`, and a key for another identity, a
key extracted at a different `hid`, or a key extracted under a non-standard H1 are all
refused at `HASH-MISMATCH`.

What the equation does not pin is *which* map both sides used. Extraction sets
`t1 = H1 + ks` and `t2 = ks · t1⁻¹`, so `t1 · t2 = ks` for any H1 whatsoever, and
verification computes `u = e(S, P) = e(P1, P2)^(l·ks)` — **H1 cancels, provided both
sides use the same one.** So a KGC and a verifier that agree on a non-standard
identity hash interoperate perfectly, and their green check says nothing about
conformance to SM9. Pane 3 runs exactly that: the same identity and the same `hid`,
with one extra domain byte in front of H1 on *both* sides, and the page's own
unmodified verifier accepts — while the row beneath shows SM9's real verifier refusing
the same key.

**Conformance is not self-certifying, and the fleet has a real instance of it.** The
same structure runs through key exchange, where `g1`, `g2` and `g3` are
`hid`-independent because `t3` cancels inside `e(R_A, de_B)`, so `hid` reaches the
session key only through the KDF input. That is not a hypothetical: GmSSL and the
standard's own Annex B disagree about `hid` for key exchange, each is internally
consistent, and each produces passing checks against itself. Pane 5 runs both.

**The KEM has no integrity check, and public key encryption does.** GM/T 0044.4
clause 6.2.1 is: check `C` is in G1, pair, KDF, output — with an error only if `K' = 0`.
Decapsulating with a different user key therefore yields a *different key silently*,
not a failure. Encryption fails closed at the MAC, clause 7.2.1 step B4. The page shows
the two outcomes side by side because the difference is the lesson.

**One reused nonce is fatal, and what it costs is a point.** Two signatures over
different messages under one `r` give `S1 − S2 = [h2 − h1]ds_A`, so
`ds_A = [(h2 − h1)⁻¹](S1 − S2)`. The `r` cancels — an attacker never needs it. What
comes back is the private key **point** in G1 and no scalar at all, because an SM9
private key *is* a group element. [SM2 Forge](https://systemslibrarian.github.io/crypto-lab-sm2-forge/)
makes the same mistake and recovers a scalar `d`; the difference is not the attack, it
is what a private key is.

**`hid = 0x02` and `hid = 0x03` do not interoperate.** GM/T 0044.5 Annex B declares
`0x03` and reaches `SK = 68b20d30…`; GmSSL, `emmansun/gmsm` and Bouncy
Castle use `0x02` for key exchange and reach `SK = c5c13a8f…`. Both are internally
consistent. The normative text pins no value at all — clause 5.3 says only that the
KGC "selects a one-byte identifier hid and makes it public".

**Two lines of Annex B are misprinted, in the Chinese original as well as the English.**
Inside an otherwise-`0x03` example, two lines print the `hid` byte as `02`. They are
typos, established three ways: the H1 digest printed beside each is byte-identical to
the `0x03` digest printed in key extraction; `H1("Bob"‖0x02)` appears nowhere in the
document; and taking the bytes literally makes the two sides **disagree**, while the
annex itself prints `SK_A == SK_B`. Transcribing those lines literally will not
reproduce `R_A`. **This does not establish why GmSSL chose `0x02`** — that is an
inference nobody has confirmed, and GmSSL documents no reason.
```

**Claims tested** (e2e/claims.spec.ts, 66 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:68
    - :68 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:90
    - :90 `toHaveClass` expected `new RegExp('\\bstatus-${kind}\\b')` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:91
    - :91 `toHaveText` expected `GLYPH[kind]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:94
    - :94 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:95
    - :95 `toMatch` expected `word` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:102
    - :102 `toHaveClass` expected `new RegExp('\\bverdict-${kind}\\b')` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:103
    - :103 `toHaveText` expected `GLYPH[kind]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:105
    - :105 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:106
    - :106 `toMatch` expected `textMatch` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:132
    - :132 `toBe` expected `true` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:133
    - :133 `toBe` expected `computed === published` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:151
    - :151 `toHaveCount` expected `1` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:164
    - :164 `toHaveClass` expected `/is-filled/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:172
    - :172 `toHaveAttribute` expected `'open', ''` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:178
    - :178 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:188
    - :188 `expect` expected _no expected value_ _(none)_
- `pane 1 — the BN256 parameters` — e2e/claims.spec.ts:196
- `q, N and the trace re-derive from the rendered t by the formulas printed beside them` — e2e/claims.spec.ts:197
    - :211 `toBe` expected `36n * t4 + 36n * t3 + 24n * t2 + 6n * t + 1n` _(expression)_
    - :212 `toBe` expected `36n * t4 + 36n * t3 + 18n * t2 + 6n * t + 1n` _(expression)_
    - :213 `toBe` expected `6n * t2 + 1n` _(expression)_
    - :219 `toBe` expected `1n` _(expression)_
    - :220 `toBe` expected `q + 1n - trace` _(expression)_
- `P1 satisfies the curve equation the page prints, and every coordinate is in F_q` — e2e/claims.spec.ts:223
    - :234 `toBe` expected `mod(x * x * x + b, q)` _(expression)_
    - :244 `toHaveLength` expected `6` _(literal)_
    - :246 `toBe` expected `true` _(expression)_
    - :272 `toBe` expected `true` _(expression)_
    - :297 `toHaveCount` expected `1` _(literal)_
    - :300 `toBe` expected `1` _(literal)_
    - :301 `toBe` expected `false` _(expression)_
- `pane 1 — the SM3 layer` — e2e/claims.spec.ts:309
- `the headline counts are the table\` — e2e/claims.spec.ts:310
    - :313 `expect` expected _no expected value_ _(none)_
    - :320 `toBe` expected `rows.length` _(expression)_
    - :321 `toBe` expected `rows.filter((row) => row.passed).length` _(expression)_
    - :322 `toBe` expected `rows.filter((row) => !row.passed).length` _(expression)_
    - :323 `toBe` expected `total` _(expression)_
    - :336 `toBe` expected `generatedRows.length` _(expression)_
    - :337 `toBe` expected `publishedRows.length` _(expression)_
    - :338 `toBe` expected `generatedRows.filter((row) => row.passed).length` _(expression)_
    - :339 `toBe` expected `publishedRows.filter((row) => row.passed).length` _(expression)_
    - :340 `toBe` expected `total` _(expression)_
    - :341 `toBe` expected `passed` _(expression)_
    - :345 `toMatch` expected `/GM\/T 0044\.5 Annex [A-D]/` _(regex)_
    - :348 `toBe` expected `'0 pairings'` _(literal)_
- `each row\` — e2e/claims.spec.ts:351
    - :362 `expect` expected _no expected value_ _(none)_
    - :366 `expect` expected _no expected value_ _(none)_
- `the prose about the untested multi-block path matches the table it describes` — e2e/claims.spec.ts:371
    - :384 `toBe` expected `Math.min(...annexH1.map((row) => row.zBytes))` _(expression)_
    - :385 `toBe` expected `Math.max(...annexH1.map((row) => row.zBytes))` _(expression)_
    - :389 `toBe` expected `annexH1.length` _(expression)_
    - :390 `toBe` expected `annexH1.filter((row) => row.blocks === 1).length` _(expression)_
    - :394 `toBe` expected `generatedH1.length` _(expression)_
    - :395 `toBe` expected `generatedH1.filter((row) => row.blocks > 1).length` _(expression)_
    - :399 `toBe` expected `annexTotal` _(expression)_
    - :400 `expect` expected _no expected value_ _(none)_
- `pane 2 — extraction and the inversion` — e2e/claims.spec.ts:408
- `the headline identity t1 · t2 = ks is re-derived from the values on screen` — e2e/claims.spec.ts:409
    - :422 `toBe` expected `mod(h1 + master, n)` _(expression)_
    - :423 `toBe` expected `1n` _(expression)_
    - :424 `toBe` expected `mod(master * t1Inverse, n)` _(expression)_
    - :428 `toBe` expected `mod(master, n)` _(expression)_
- `every annex badge agrees with the two values printed beside it` — e2e/claims.spec.ts:436
    - :440 `expect` expected _no expected value_ _(none)_
    - :453 `expect` expected _no expected value_ _(none)_
    - :454 `toBe` expected `await text(page, 'p2-step-h1')` _(expression)_
    - :455 `toMatch` expected `/GM\/T 0044\.5 Annex A/` _(regex)_
- `the t1 = 0 branch is reachable, names its outcome, and issues nothing` — e2e/claims.spec.ts:458
    - :462 `toHaveCount` expected `1` _(literal)_
    - :472 `toBe` expected `0n` _(expression)_
    - :473 `toBe` expected `0n` _(expression)_
    - :476 `toMatch` expected `/null — there is no inverse/` _(regex)_
    - :477 `toBe` expected `await text(page, 'p2-rekey-t1')` _(expression)_
    - :480 `toBe` expected `'MASTER-KEY-REGENERATION-REQUIRED'` _(literal)_
    - :484 `toBeVisible` expected _no expected value_ _(none)_
    - :485 `toMatch` expected `/REGENERATE the master/` _(regex)_
- `retirement of stale verdicts` — e2e/claims.spec.ts:493
- `changing the identity retires every verdict about the old one` — e2e/claims.spec.ts:494
    - :499 `toHaveCount` expected `1` _(literal)_
    - :513 `toHaveCount` expected `0` _(literal)_
    - :514 `toHaveCount` expected `0` _(literal)_
    - :515 `toHaveCount` expected `0` _(literal)_
    - :516 `toHaveCount` expected `0` _(literal)_
    - :520 `toBeVisible` expected _no expected value_ _(none)_
    - :521 `toMatch` expected `/Nothing pinned to compare against/` _(regex)_
    - :526 `toMatch` expected `/^416c696365/` _(regex)_
- `re-typing the same identity does NOT retire a fresh verdict` — e2e/claims.spec.ts:529
    - :548 `toHaveCount` expected `1` _(literal)_
    - :549 `toBe` expected `headline` _(expression)_
    - :550 `toBe` expected `forcedMaster` _(expression)_
    - :551 `toHaveCount` expected `1` _(literal)_
    - :552 `toHaveCount` expected `0` _(literal)_
    - :561 `toHaveCount` expected `0` _(literal)_
    - :562 `toBeVisible` expected _no expected value_ _(none)_
- `pane 3 (a) — sign and verify` — e2e/claims.spec.ts:570
- `Annex A reproduces, and l = (r − h) mod N re-derives from the rendered values` — e2e/claims.spec.ts:571
    - :574 `toHaveCount` expected `1` _(literal)_
    - :582 `toBe` expected `mod(r - h, n)` _(expression)_
    - :583 `toBe` expected `0n` _(expression)_
    - :584 `toBe` expected `true` _(expression)_
    - :589 `toBe` expected `'04'` _(literal)_
    - :590 `toHaveLength` expected `2 + 64 + 64` _(expression)_
    - :591 `toHaveLength` expected `64` _(literal)_
- `a fresh nonce changes the signature and not the verdict, and differing is marked INFO` — e2e/claims.spec.ts:601
    - :604 `toHaveCount` expected `1` _(literal)_
    - :611 `toHaveCount` expected `1` _(literal)_
    - :617 `toBe` expected `pinnedR` _(expression)_
    - :618 `toBe` expected `pinnedH` _(expression)_
    - :619 `toBe` expected `pinnedS` _(expression)_
    - :631 `toBe` expected `pinnedH` _(expression)_
- `every must-reject case names its failure code and clause step, and the prose count matches the table` — e2e/claims.spec.ts:634
    - :638 `toHaveCount` expected `1` _(literal)_
    - :642 `expect` expected _no expected value_ _(none)_
    - :651 `expect` expected _no expected value_ _(none)_
    - :652 `toMatch` expected `/^S[1-6] — /` _(regex)_
    - :653 `toBe` expected `true` _(expression)_
    - :654 `toMatch` expected `/refused/` _(regex)_
    - :660 `toBe` expected `seen` _(expression)_
    - :664 `toBe` expected `rows.length` _(expression)_
    - :672 `expect` expected _no expected value_ _(none)_
    - :679 `toBe` expected `rows.length` _(expression)_
    - :680 `toBe` expected `steps.filter((step) => step.startsWith('S6')).length` _(expression)_
    - :684 `toMatch` expected `/\(S2\)/` _(regex)_
    - :685 `toMatch` expected `/\(S1\)/` _(regex)_
    - :686 `toHaveLength` expected `1` _(literal)_
    - :687 `toHaveLength` expected `1` _(literal)_
    - :688 `toBe` expected `rows.length` _(expression)_
- `pane 3 (a) — the wrong-H1 negative-claim fixture` — e2e/claims.spec.ts:696
- `the round trip is green under a hash that is not SM9\` — e2e/claims.spec.ts:697
    - :702 `toHaveCount` expected `0` _(literal)_
    - :705 `toHaveCount` expected `1` _(literal)_
    - :709 `toBe` expected `await text(page, 'p3a-wrongh1-h1-real')` _(expression)_
    - :710 `toBe` expected `await text(page, 'p3a-wrongh1-honest-dsa')` _(expression)_
    - :718 `toMatch` expected `/verify\(\) returned accepted: true/` _(regex)_
    - :741 `toEqual` expected `['p3a-wrongh1-keys-differ', 'p3a-wrongh1-realverifier']` _(expression)_
    - :750 `toBeVisible` expected _no expected value_ _(none)_
    - :751 `toHaveCount` expected `1` _(literal)_
    - :752 `toHaveClass` expected `/note-alarm/` _(regex)_
    - :755 `toMatch` expected `/does NOT prove that H1, the identity encoding, or hid is/` _(regex)_
    - :756 `toMatch` expected `/H1 CANCELS/` _(regex)_
    - :757 `toMatch` expected `/provided BOTH sides use the same one/` _(regex)_
    - :762 `toMatch` expected `/does NOT mean identity goes unchecked/i` _(regex)_
    - :763 `toMatch` expected `/refused at HASH-MISMATCH/` _(regex)_
    - :764 `toMatch` expected `/a key for another identity and a key extracted at a different hid/` _(regex)_
    - :768 `toMatch` expected `/Only a value somebody else printed/` _(regex)_
- `pane 3 (b) — key exchange` — e2e/claims.spec.ts:776
- `both sides reach one session key, and every annex badge agrees with its cells` — e2e/claims.spec.ts:777
    - :781 `toHaveCount` expected `1` _(literal)_
    - :788 `toBe` expected `skB` _(expression)_
    - :789 `toHaveLength` expected `32` _(literal)_
    - :799 `toBe` expected `await text(page, 'p3b-g1-a-formula')` _(expression)_
    - :800 `toBe` expected `await text(page, 'p3b-g2-a-formula')` _(expression)_
    - :810 `toHaveLength` expected `tag83.length` _(expression)_
    - :811 `toBe` expected `tag83` _(expression)_
    - :812 `toMatch` expected `/0x82 for B's tag and 0x83 for A's/` _(regex)_
- `pane 3 (c) — KEM and public key encryption` — e2e/claims.spec.ts:823
- `the ciphertext is exactly C1 ‖ C3 ‖ C2, and the plaintext is the message the page printed` — e2e/claims.spec.ts:824
    - :828 `toHaveCount` expected `1` _(literal)_
    - :835 `expect` expected _no expected value_ _(none)_
    - :845 `toBe` expected `whole` _(expression)_
    - :846 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :849 `toBe` expected `messageAscii` _(expression)_
    - :850 `toBe` expected `Number(messageBits)` _(expression)_
    - :851 `toBe` expected `messageAscii` _(expression)_
    - :854 `expect` expected _no expected value_ _(none)_
    - :863 `toBe` expected `(await text(page, 'p3c-a-plaintext')).length` _(expression)_
    - :865 `toBe` expected `true` _(expression)_
    - :866 `toBe` expected `0` _(literal)_
    - :867 `toBe` expected `padded.length` _(expression)_
- `the KEM diverges silently where public key encryption names a cause` — e2e/claims.spec.ts:870
    - :874 `toHaveCount` expected `1` _(literal)_
    - :876 `toHaveCount` expected `1` _(literal)_
    - :884 `toBe` expected `k` _(expression)_
    - :890 `toBe` expected `k` _(expression)_
    - :891 `toHaveLength` expected `k.length` _(expression)_
    - :893 `toMatch` expected `/refused/` _(regex)_
    - :896 `toMatch` expected `/produced a DIFFERENT key/` _(regex)_
    - :906 `expect` expected _no expected value_ _(none)_
    - :907 `toBe` expected `'B4'` _(literal)_
    - :908 `toBe` expected `'MAC_MISMATCH'` _(literal)_
    - :917 `toBe` expected `true` _(expression)_
    - :918 `toHaveLength` expected `2` _(literal)_
    - :919 `toBe` expected `kemOutcome` _(expression)_
    - :920 `toMatch` expected `/tamper with a KEM ciphertext and you get a key/` _(regex)_
    - :921 `toMatch` expected `/no integrity check of any kind/` _(regex)_
- `pane 4 — the KGC\` — e2e/claims.spec.ts:929
- `the recovered plaintext is re-derived from the message field, not echoed from it` — e2e/claims.spec.ts:930
    - :939 `toHaveCount` expected `1` _(literal)_
    - :945 `toBe` expected `expected` _(expression)_
    - :946 `toBe` expected `message` _(expression)_
    - :952 `expect` expected _no expected value_ _(none)_
    - :953 `expect` expected _no expected value_ _(none)_
    - :962 `toBe` expected `true` _(expression)_
    - :963 `toBe` expected `true` _(expression)_
    - :966 `toMatch` expected `/came out of/` _(regex)_
- `the KGC signs as another identity, and that is rendered as an ALARM and not a success` — e2e/claims.spec.ts:969
    - :972 `toHaveCount` expected `1` _(literal)_
    - :978 `toBe` expected `h` _(expression)_
    - :980 `toMatch` expected `/^04[0-9a-f]{128}$/` _(regex)_
    - :981 `toBe` expected `await at(page, 'p4-identity').inputValue()` _(expression)_
    - :989 `toHaveCount` expected `0` _(literal)_
    - :990 `toHaveCount` expected `0` _(literal)_
    - :994 `toMatch` expected `/Nothing here is a forgery in the cryptographic sense/` _(regex)_
    - :995 `toMatch` expected `/The signature is genuine/` _(regex)_
    - :996 `toMatch` expected `/no verifier anywhere can tell the difference/` _(regex)_
- `retirement of editable exhibit evidence` — e2e/claims.spec.ts:1004
- `changing either KGC input retires both powers and the completed step` — e2e/claims.spec.ts:1005
    - :1013 `toHaveCount` expected `1` _(literal)_
    - :1015 `toHaveCount` expected `1` _(literal)_
    - :1022 `toHaveCount` expected `0` _(literal)_
    - :1023 `toHaveCount` expected `0` _(literal)_
    - :1026 `toHaveAttribute` expected `'data-state', 'locked'` _(expression)_
- `changing any nonce-reuse message retires the recovery and forgery` — e2e/claims.spec.ts:1031
    - :1040 `toHaveCount` expected `1` _(literal)_
    - :1047 `toHaveCount` expected `0` _(literal)_
    - :1048 `expect` expected _no expected value_ _(none)_
    - :1049 `expect` expected _no expected value_ _(none)_
- `pane 5 (a) — the reused nonce` — e2e/claims.spec.ts:1059
- `the forged signature is accepted, and the acceptance is rendered as an ALARM` — e2e/claims.spec.ts:1060
    - :1063 `toHaveCount` expected `1` _(literal)_
    - :1070 `toBe` expected `h2` _(expression)_
    - :1076 `toBe` expected `'two-signatures-reused-nonce'` _(literal)_
    - :1078 `toBe` expected `h1` _(expression)_
    - :1079 `toBe` expected `h2` _(expression)_
    - :1080 `toMatch` expected `/^04[0-9a-f]{128}$/` _(regex)_
    - :1089 `toBe` expected `true` _(expression)_
    - :1090 `toMatch` expected `/there is none\. The result type has no field for one/` _(regex)_
    - :1097 `toHaveCount` expected `0` _(literal)_
- `the singular system is refused by name, and nothing key-shaped comes back` — e2e/claims.spec.ts:1100
    - :1103 `toHaveCount` expected `1` _(literal)_
    - :1108 `toBe` expected `h2` _(expression)_
    - :1113 `toBe` expected `'IDENTICAL-HASHES-NO-SECOND-EQUATION'` _(literal)_
    - :1114 `toMatch` expected `/has no inverse mod N/` _(regex)_
    - :1119 `toHaveCount` expected `0` _(literal)_
    - :1120 `toHaveCount` expected `0` _(literal)_
- `pane 5 (b) — the hid divergence` — e2e/claims.spec.ts:1128
- `both session keys are rendered, they DIFFER, each is labelled by source, and neither is an error` — e2e/claims.spec.ts:1129
    - :1133 `toHaveCount` expected `1` _(literal)_
    - :1138 `toBe` expected `sk02` _(expression)_
    - :1139 `toHaveLength` expected `sk02.length` _(expression)_
    - :1146 `expect` expected _no expected value_ _(none)_
    - :1147 `expect` expected _no expected value_ _(none)_
    - :1148 `toBe` expected `source02` _(expression)_
    - :1149 `toMatch` expected `/^yes/` _(regex)_
    - :1150 `toMatch` expected `/^no/` _(regex)_
    - :1161 `toHaveCount` expected `0` _(literal)_
    - :1162 `toHaveCount` expected `0` _(literal)_
    - :1163 `toHaveCount` expected `0` _(literal)_
    - :1165 `toMatch` expected `/Neither of those is wrong, and neither is rendered red/` _(regex)_
    - :1168 `toMatch` expected `/does not claim the misprint caused/` _(regex)_
- `the group elements are byte-identical across the two hid values, and only R_A moves` — e2e/claims.spec.ts:1171
    - :1175 `toHaveCount` expected `1` _(literal)_
    - :1181 `toBe` expected `g102` _(expression)_
    - :1182 `expect` expected _no expected value_ _(none)_
    - :1190 `toBe` expected `ra02` _(expression)_
    - :1192 `toMatch` expected `/t3 is gone/` _(regex)_
- `the misprint diagnosis is settled against the annex\` — e2e/claims.spec.ts:1195
    - :1199 `toHaveCount` expected `1` _(literal)_
    - :1202 `expect` expected _no expected value_ _(none)_
    - :1203 `toBe` expected `0` _(literal)_
    - :1217 `toHaveLength` expected `correctedBytes.length` _(expression)_
    - :1218 `toBe` expected `correctedBytes.slice(0, -2)` _(expression)_
    - :1219 `toBe` expected `correctedBytes.slice(-2)` _(expression)_
    - :1223 `toBe` expected `h1OfCorrected` _(expression)_
- `the literal reading does not complete, and that is rendered INFO rather than a failure` — e2e/claims.spec.ts:1232
    - :1236 `toHaveCount` expected `1` _(literal)_
    - :1242 `toBe` expected `literalB` _(expression)_
    - :1247 `toBe` expected `literalA` _(expression)_
    - :1248 `toBe` expected `literalB` _(expression)_
    - :1252 `toBe` expected `published` _(expression)_
    - :1257 `toHaveCount` expected `0` _(literal)_
- `the security level is published as a range, both figures attributed, neither averaged` — e2e/claims.spec.ts:1265
    - :1270 `toBe` expected `bd` _(expression)_
    - :1275 `expect` expected _no expected value_ _(none)_
    - :1281 `expect` expected _no expected value_ _(none)_
    - :1282 `toMatch` expected `/Read it as a range/` _(regex)_
    - :1283 `toMatch` expected `/does not\s+transfer to BN256/` _(regex)_
- `every SM3 vector badge agrees with the two values printed beside it` — e2e/claims.spec.ts:1297
    - :1300 `toBeVisible` expected _no expected value_ _(none)_
    - :1303 `expect` expected _no expected value_ _(none)_
    - :1317 `toBe` expected _no expected value_ _(none)_
    - :1320 `toMatch` expected `/status-ok/` _(regex)_
    - :1325 `expect` expected _no expected value_ _(none)_
    - :1335 `toBe` expected `agreeing` _(expression)_
- `pane 1 runs a deliberately wrong vector and reports it as a mismatch` — e2e/claims.spec.ts:1345
    - :1349 `toBeVisible` expected _no expected value_ _(none)_
    - :1350 `toHaveClass` expected `/status-ok/` _(regex)_
    - :1351 `toContainText` expected `/correctly reported as a mismatch/i` _(regex)_
    - :1356 `toBe` expected `total` _(expression)_
- `the guided lab` — e2e/claims.spec.ts:1363
- `nothing is computed before the reader causes it, and the symbolic path is still on screen` — e2e/claims.spec.ts:1364
    - :1370 `toContainText` expected `'pending'` _(literal)_
    - :1371 `toHaveCount` expected `1` _(literal)_
    - :1372 `toHaveCount` expected `0` _(literal)_
    - :1373 `toHaveCount` expected `0` _(literal)_
    - :1374 `toHaveCount` expected `0` _(literal)_
    - :1379 `toBe` expected `'—'` _(literal)_
    - :1385 `toHaveCount` expected `1` _(literal)_
    - :1387 `toMatch` expected `/INVERT MOD N|invert mod N/i` _(regex)_
- `step 2 unlocks on step 1 succeeding, not on its button being pressed, and the unlock is announced` — e2e/claims.spec.ts:1390
    - :1394 `toBeVisible` expected _no expected value_ _(none)_
    - :1395 `toBeVisible` expected _no expected value_ _(none)_
    - :1398 `toBeVisible` expected _no expected value_ _(none)_
    - :1402 `toHaveText` expected `/^0 failed$/` _(regex)_
    - :1406 `toContainText` expected `/Step 2, extract an identity key/` _(regex)_
    - :1413 `expect` expected _no expected value_ _(none)_
    - :1414 `toBeVisible` expected _no expected value_ _(none)_
- `resetting a step clears it and relocks every step after it` — e2e/claims.spec.ts:1417
    - :1420 `toBeVisible` expected _no expected value_ _(none)_
    - :1430 `toBeVisible` expected _no expected value_ _(none)_
    - :1436 `toContainText` expected `'pending'` _(literal)_
    - :1437 `toHaveCount` expected `0` _(literal)_
    - :1440 `toHaveCount` expected `0` _(literal)_
    - :1441 `toHaveCount` expected `0` _(literal)_
    - :1442 `toBe` expected `'—'` _(literal)_
- `Full evidence unlocks every step, and the rail stops saying locked` — e2e/claims.spec.ts:1445
    - :1447 `toBeVisible` expected _no expected value_ _(none)_
    - :1452 `toBeVisible` expected _no expected value_ _(none)_
    - :1455 `toMatch` expected `/locked/` _(regex)_
    - :1457 `toBeVisible` expected _no expected value_ _(none)_
    - :1458 `toBeVisible` expected _no expected value_ _(none)_
- `the run transcript is read off the rendered page, and agrees with it` — e2e/claims.spec.ts:1461
    - :1464 `toHaveCount` expected `1` _(literal)_
    - :1477 `expect` expected _no expected value_ _(none)_
    - :1483 `toBe` expected `await text(page, 'p2-step-t2')` _(expression)_
    - :1486 `toBe` expected `'ok'` _(literal)_
    - :1487 `toBe` expected `await expectVerdict(page, 'p2-extract-verdict', 'ok')` _(expression)_
    - :1489 `toBe` expected `'Alice'` _(literal)_
    - :1491 `expect` expected _no expected value_ _(none)_
- `the decisive experiment changes exactly three of its five answers, and names which` — e2e/claims.spec.ts:1495
    - :1522 `toBe` expected `alteredT2` _(expression)_
- `the evidence limits are in the page, not only in the README` — e2e/claims.spec.ts:1526
    - :1530 `toMatch` expected `/Fp12 pairing values rest on one engine/` _(regex)_
    - :1531 `toMatch` expected `/No constant-time property is claimed or tested/` _(regex)_
    - :1532 `toMatch` expected `/GB\/T 41389-2022 has not been read/` _(regex)_
    - :1533 `toMatch` expected `/paywalled/` _(regex)_
    - :1536 `toMatch` expected `/SM9EncMasterPrivateKeyParameters\.java/` _(regex)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# SM9 Forge

**GM/T 0044 · GB/T 38635 · ISO/IEC 14888-3 · ISO/IEC 18033-5**

SM9 identity-based key extraction, digital signature, key exchange and public key
encryption, run in the browser against the worked examples printed in the standard
itself.

**Live demo:** https://systemslibrarian.github.io/crypto-lab-sm9-forge/

---

## What It Is

SM9 is China's identity-based cryptography standard: your identity string *is* your
public key, and an authority called the KGC mints the matching private key. This lab
implements the whole family — key extraction, the digital signature algorithm
(GM/T 0044.2), the key exchange protocol (GM/T 0044.3), and the key encapsulation
mechanism and public key encryption (GM/T 0044.4) — over the 256-bit Barreto-Naehrig
curve and R-ate pairing of GM/T 0044.5 clause 3.1.

The thing worth coming for is **how the private key is made**. Boneh-Franklin IBE, the
scheme most people meet first, hashes an identity *to a curve point* and multiplies it
by the master secret. SM9 hashes the identity *to a scalar*, adds the master secret,
and **inverts** — `t1 = H1(ID‖hid, N) + ks`, `t2 = ks · t1⁻¹`, `ds_A = [t2]P1`. No
hash-to-curve appears anywhere in SM9 key extraction. That one structural difference
pays for itself twice over: SM9 carries **two** master key pairs in mirrored pairing
groups, so the authority can both read your mail and sign in your name; and the
inversion makes the identity hash **cancel** out of the verification equation, so a
passing check proves that extraction and verification agreed on a map, not that either
of them used SM9's.

**Security model.** Every private key in SM9 is derivable by the KGC from the identity
alone, by design. There is no forward secrecy against the KGC and no way to opt out:
the same two lines of clause 5.3 that define extraction define the escrow. Pane 4
demonstrates both halves of that rather than describing them.

**Not production cryptography — a teaching demo.** Everything runs in your browser.
Key material is per-session and in memory; nothing is persisted and nothing leaves the
page.

## Exhibits

1. **Parameters, and the SM3 layer** — the BN256 curve constants read from
   GM/T 0044.5 clause 3.1, with `cid = 0x12` and `eid = 0x04` decoded into words, then
   H1, H2 and the KDF reproduced against the standard's own printed sub-values **with
   no pairing running**. A deliberately wrong negative control runs beside them and
   must be reported as a mismatch.
2. **Extraction — the inversion** — the headline. The five lines of the relation are
   painted before anything is computed and fill one operation at a time when you press
   Extract. A two-state control then asks the same five questions under SM9's own H1 and
   under an altered identity map: the key differs, the annex's pinned intermediates stop
   matching and the real verifier refuses — while the cancellation identity still holds
   and a verifier using the same altered map still accepts. Boneh-Franklin's
   multiplication is drawn beside it for contrast, the two master key pairs are shown in
   their mirrored groups, and a control drives the `t1 = 0` branch the standard defines
   and almost nothing ever reaches.
3. **The three protocols** — sign/verify against Annex A, key exchange against
   Annex B, and KEM/encryption against Annexes C and D, each beside its pinned vector
   with a byte-equality badge. Signing with the annex's pinned nonce is
   byte-reproducible; a fresh nonce changes the signature and still verifies.
4. **What the KGC can do** — escrow as two separate powers: with `ke` it derives any
   identity's decryption key and reads the message, and with `ks` it derives any
   identity's signing key and produces a signature this page's own verifier accepts.
5. **The break, and the divergence** — a reused nonce recovers the private key and
   forges with it, and Annex B runs at both `hid` values from one master key, reaching
   two different session keys that are labelled by source rather than ranked.

## How the Lab Is Sequenced

The five exhibits are **five gated steps**, not five panels on a page. A step unlocks
when the step before it has produced a real result — not when its button was pressed,
which is a different claim — so the SM3 layer is reproduced before a key is extracted,
and a key exists before any protocol runs on it. Completed steps collapse to the one
line they earned, with a control to reopen them, and a sticky rail carries anchors
(`#step-sm3`, `#step-extract`, `#step-protocols`, `#step-kgc`, `#step-break`) so a
presenter can jump to an act without scrolling through the audit trail.

Nothing is computed that the visitor did not cause. The page used to open with pane 1
saying *pending — not yet run* directly above pane 2 saying *ds_A issued*: the headline
act had already happened and nobody had pressed anything.

**Guided** is the default. **Full evidence** unlocks and expands everything at once and
is one control away at the top — progressive disclosure that cannot be switched off is
just material hidden from the people most likely to check it. Neither view persists:
progress lives in memory and a reload is a full reset, deliberately, because a restored
half-run would be restoring verdicts about inputs the reader can no longer see.

**Copy run transcript** exports the run as JSON — inputs, verdicts, status words,
source labels and computed values — read off the rendered page rather than assembled
beside it, so it cannot disagree with what the page claimed.

### The five-minute path

1. **Run the SM3 checks.** Published vectors reproduced, the negative control reported
   as a mismatch, and zero pairings.
2. **Extract Alice.** Watch `ID‖hid → h1 → t1 → t1⁻¹ → t2 → ds_A` fill one operation at
   a time.
3. **Switch the identity map to an altered H1.** Same five questions; three answers
   change and two do not, and the two that hold are exactly what a round trip can check
   about itself.
4. **Run the KGC's two powers.** It reads a message encrypted to an identity it does
   not hold, and signs as that identity.
5. **Reuse a nonce.** Recover the private key point and forge a third message through
   the real verifier, then meet the `hid` divergence beside it.

## When to Use It

- Use it to see **why an identity-based private key is not a hashed point**, because
  the inversion is visible as its own step and the Boneh-Franklin comparison is drawn
  beside it.
- Use it to understand **what key escrow actually buys an authority**, because both
  powers run live against derived keys rather than being asserted in prose.
- Use it to learn **what a passing signature check does and does not establish**,
  because the page reaches a state where every self-check is green and the identity
  binding is still wrong.
- Do **not** use it for anything real — it is a demo app and does not provide hardened
  operational controls. No constant-time guarantees are claimed or tested, key
  material lives in ordinary JavaScript memory, and the nonce-reuse path exists
  precisely to break the scheme.

## What Can Go Wrong

**A passing check does not pin which identity-to-scalar map produced the key.**
This is the lab's headline finding, and it needs stating precisely because the loose
version of it is false. SM9 verification *does* check the identity binding:
`h1 = H1(ID‖hid, N)` feeds `P = [h1]P2 + Ppub-s`, and a key for another identity, a
key extracted at a different `hid`, or a key extracted under a non-standard H1 are all
refused at `HASH-MISMATCH`.

What the equation does not pin is *which* map both sides used. Extraction sets
`t1 = H1 + ks` and `t2 = ks · t1⁻¹`, so `t1 · t2 = ks` for any H1 whatsoever, and
verification computes `u = e(S, P) = e(P1, P2)^(l·ks)` — **H1 cancels, provided both
sides use the same one.** So a KGC and a verifier that agree on a non-standard
identity hash interoperate perfectly, and their green check says nothing about
conformance to SM9. Pane 3 runs exactly that: the same identity and the same `hid`,
with one extra domain byte in front of H1 on *both* sides, and the page's own
unmodified verifier accepts — while the row beneath shows SM9's real verifier refusing
the same key.

**Conformance is not self-certifying, and the fleet has a real instance of it.** The
same structure runs through key exchange, where `g1`, `g2` and `g3` are
`hid`-independent because `t3` cancels inside `e(R_A, de_B)`, so `hid` reaches the
session key only through the KDF input. That is not a hypothetical: GmSSL and the
standard's own Annex B disagree about `hid` for key exchange, each is internally
consistent, and each produces passing checks against itself. Pane 5 runs both.

**The KEM has no integrity check, and public key encryption does.** GM/T 0044.4
clause 6.2.1 is: check `C` is in G1, pair, KDF, output — with an error only if `K' = 0`.
Decapsulating with a different user key therefore yields a *different key silently*,
not a failure. Encryption fails closed at the MAC, clause 7.2.1 step B4. The page shows
the two outcomes side by side because the difference is the lesson.

**One reused nonce is fatal, and what it costs is a point.** Two signatures over
different messages under one `r` give `S1 − S2 = [h2 − h1]ds_A`, so
`ds_A = [(h2 − h1)⁻¹](S1 − S2)`. The `r` cancels — an attacker never needs it. What
comes back is the private key **point** in G1 and no scalar at all, because an SM9
private key *is* a group element. [SM2 Forge](https://systemslibrarian.github.io/crypto-lab-sm2-forge/)
makes the same mistake and recovers a scalar `d`; the difference is not the attack, it
is what a private key is.

**`hid = 0x02` and `hid = 0x03` do not interoperate.** GM/T 0044.5 Annex B declares
`0x03` and reaches `SK = 68b20d30…`; GmSSL, `emmansun/gmsm` and Bouncy
Castle use `0x02` for key exchange and reach `SK = c5c13a8f…`. Both are internally
consistent. The normative text pins no value at all — clause 5.3 says only that the
KGC "selects a one-byte identifier hid and makes it public".

**Two lines of Annex B are misprinted, in the Chinese original as well as the English.**
Inside an otherwise-`0x03` example, two lines print the `hid` byte as `02`. They are
typos, established three ways: the H1 digest printed beside each is byte-identical to
the `0x03` digest printed in key extraction; `H1("Bob"‖0x02)` appears nowhere in the
document; and taking the bytes literally makes the two sides **disagree**, while the
annex itself prints `SK_A == SK_B`. Transcribing those lines literally will not
reproduce `R_A`. **This does not establish why GmSSL chose `0x02`** — that is an
inference nobody has confirmed, and GmSSL documents no reason.

## Real-World Usage

SM9 is standardised domestically as GM/T 0044-2016 (five parts) and GB/T 38635-2020
(two parts), both in force in different standards systems. Internationally, its
signature is **ISO/IEC 14888-3:2018 clause 7.4, under the name "Chinese IBS"**, and its
key encapsulation is **ISO/IEC 18033-5:2015/Amd 1:2021, "Amendment 1: SM9 mechanism"**,
clause 9.4.

## How to Run Locally

`​``
npm ci
npm run dev
`​``

`npm test` runs the unit suite, the known-answer tests and the CSP hash guard.
`npm run test:oracle` runs the independent cross-check. `npm run test:e2e` runs the
claims suite, `npm run test:a11y` the accessibility gate and `npm run test:geometry`
the visual-quality gate; all three need `npx playwright install chromium` first.

The browser gates build first and serve the production build on **port 4711**, which is
this lab's own rather than Vite's default 4173. That is not a preference: several labs
in this fleet kept the default, and `reuseExistingServer` then hands the suites whatever
is already answering on it — a cold run here was silently judged against
`crypto-lab-glass-box` until the port was changed. All three places that name it
(`use.baseURL`, `webServer.command`, `webServer.url`) live in `playwright.config.ts`.

## Related Demos

- [SM2 Forge](https://systemslibrarian.github.io/crypto-lab-sm2-forge/) — the other
  ShangMi public-key standard, and the nonce-reuse contrast: there the recovered key
  is a scalar.
- [IBE Gate](https://systemslibrarian.github.io/crypto-lab-ibe-gate/) — Boneh-Franklin
  identity-based encryption, the multiplication this lab's extraction is contrasted
  against.
- [Pairing Gate](https://systemslibrarian.github.io/crypto-lab-pairing-gate/) — what a
  bilinear pairing is, on BLS12-381. This lab assumes it.

## Build & Verify

The production type-check uses the native TypeScript 7 compiler. The SM3 and
SM4 packages currently declare TypeScript 5 JavaScript-API peers, so that API
stays installed side-by-side; `npm run check:typescript` guards both identities
and strict native-compiler rejection controls without bypassing peer validation.

**419 unit tests, 37 rendered-verdict claims tests, a 26-test independent cross-check
and a 5-test geometry gate.** The accessibility gate scans the production build at
1280px and 380px across 20 driven states each — the guided path a visitor actually
walks, including the locked, collapsed and Full-evidence renderings — and blocks the
deploy on any WCAG 2.1 A/AA violation.

**The geometry gate is the one axe cannot run.** It measures the landing page's height,
where the first meaningful action sits in the viewport, the hero's stacked gap at phone
width, and the painted size of every text run. It exists because the two pane-2 SVG
diagrams passed the accessibility gate while rendering their labels at roughly five CSS
pixels on a phone: the contrast oracle measured them correctly, and contrast is not
legibility. Both diagrams are HTML now, and the rule that caught them is a test.

**Known-answer tests.** Every figure comes from GM/T 0044.5, fetched directly from
gmbz.org.cn (`md5 40cee7ca9ab2b885dee2158b2d4a12cc`) and pinned in
`src/sm9/fixtures/`. Annex A signature 47/47 including all eight must-reject cases,
Annex B key exchange 37/37, Annex C KEM 25/25, Annex D encryption 53/53 across both
modes, failure direction 15/15. The BN256 constants are not merely transcribed: their
test re-derives `q`, `N` and the trace from `t` using the standard's own polynomials.

**The independent cross-check shares no code path with the runtime** — GmSSL C's own
pinned vectors from `tests/sm9test.c`, plus OpenSSL's SM3 through `node:crypto` driving
the same H1/H2/KDF constructions. It is not decorative: writing it caught a mis-derived
assertion, where `hex_fn_nsub` turned out to be the reverse subtraction `y − x` rather
than `N − x`.

**A multi-block H1 case had to be generated.** Every H1 input in the entire standard is
an identity plus one `hid` byte — 4 to 6 bytes — so H1 never crosses a 64-byte SM3
block anywhere in the annexes. H2 and the KDF are already multi-block there (404, 451
and 1288 bytes). The generated cases run at 49, 50, 60, 62, 119 and 200 bytes and are
cross-checked three ways.

**The pairing engine is vendored, and was verified before use.**
`src/vendor/gmssl-sm9.js` is GmSSL-JS's `js/sm9.js`, Apache-2.0, with its notice
preserved. The single change is at the end of the file: the bare `pairing_test()` call
was removed and the function exported instead, because upstream's self-check only
`console.log`s a boolean and exits 0 whether it passes or fails. It was driven through
65 of GmSSL C's own `hex_*` vectors plus 24 consistency checks covering the branches
that have no C vector.

### Limits of that verification, stated rather than implied

- **The Fp12 pairing values rest on one engine.** Three implementations agree on every
  non-pairing value, but `g`, `w`, `u` and `w'` are the *standard's printed values
  agreeing with GmSSL-JS*, not two independent pairing engines agreeing. No second
  browser-capable SM9 pairing implementation exists to close this.
- **No constant-time claim is made or tested.** This is ordinary JavaScript with BigInt
  arithmetic; it is not hardened against timing analysis and nothing here measures that.
- **`GB/T 41389-2022` has not been read** by anyone who worked on this lab. It is
  reportedly where the `hid = 1` / `hid = 3` convention is actually pinned, which makes
  it the most load-bearing document for the `hid` question, and it is cited here as
  unread rather than summarised second-hand.
- **ISO/IEC 14888-3:2018's clause 7.4 body is paywalled.** The mechanism is named
  "Chinese IBS" in the publicly readable front matter, which never uses the string
  "SM9"; that the body matches GM/T 0044.2 step for step is not verified here.
- **The `hid = 0x02` attributions were read, not inherited.** GmSSL, `emmansun/gmsm`
  and Bouncy Castle were each checked in source. Bouncy Castle declares
  `HID_EXCHANGE = (byte)0x02` in
  `core/src/main/java/org/bouncycastle/crypto/params/SM9EncMasterPrivateKeyParameters.java`,
  and its own comment there attributes the value to the Chinese edition of the
  GM/T 0044.5-2016 Annex B worked example, noting the official English edition of the
  same annex chose `0x03`. **That last attribution is Bouncy Castle's claim about the
  two editions, quoted rather than confirmed here** — this lab has not compared the two
  editions itself, and says so on the page.

### A note on npm packages claiming SM9

**`@lryncloud/crypto` is not SM9, and should not be used.** Its G1 and G2 elements are
bare scalars, its "pairing" multiplies two scalars mod `n`, GT is a single integer, and
its signature is `s = d·h mod n` — while it pins the genuine SM9 `q`, `n`, `P1` and
`hid` bytes so the parameter file looks authentic. It hashes domain-separation strings
such as `"SM9-H1-SIGN"` in place of H1's `0x01`-prefixed two-block counter chain. At the
time of writing no vetted browser-capable SM9 package exists on npm: `@li0ard/sm9` does
not exist, and `gmssl-node` is a native addon that cannot run in a browser and exposes
no way to load a pinned master key.

## Performance

One R-ate pairing measures **median 12.92 ms, p95 17.64 ms** in Node on an Apple M5
(n = 50, warmed). In the browser it is roughly **4-5 ms in Chromium and 18-22 ms in
Firefox**. Verification costs two pairings and is comfortable everywhere; key exchange
costs several. These are measurements of one machine and one build, not a benchmark of
SM9.

## Security level

Post-exTNFS estimates for a BN curve with a 256-bit prime differ between published
sources, and both are quoted here rather than averaged or picked between:
Menezes, Sarkar and Singh give *"a conservative estimate … is 110 bits"*
([ePrint 2016/1102](https://eprint.iacr.org/2016/1102), Remark 6); Barbulescu and
Duquesne, arguing the former is not precise enough, give *"in fact 100 bits"*. Neither
is this lab's own measurement.

## License

MIT — see [LICENSE](LICENSE).

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Adaptor Gate

- **slug**: `crypto-lab-adaptor-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-adaptor-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-adaptor-gate/
- **commit_sha**: `37262214e4b75379441480c99560bff9c2d4732f` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `4d952e88e58b53a515bcb3fd29105d6c092fb019`
- **read_from**: git archive HEAD (1 dirty path(s))
- **category**: SIGNATURES | PROTOCOLS  ·  **level**: advanced  ·  **--accent**: #ff6b7f
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Adaptor Gate  — _read from index.html_

**Subtitle**: BIP-340 Schnorr adaptor signatures · secp256k1  — _read from index.html_

**Description**: Add a secret to a pre-signature the real BIP-340 verifier rejects, and subtract the two signatures to read that secret straight back out.  — _read from index.html_

**Why it matters**: Cross-chain swaps and Lightning's PTLCs both rest on that leak being unavoidable. So a pre-signature pointing at the wrong secret costs real money, and nothing but checking it will tell you.  — _read from index.html_

**Card copy**: One click turns a pre-signature the real BIP-340 verifier rejects into a valid signature, then subtracts the two to read the secret back out — the fact that atomic swaps and PTLC routing are both built on.

**Chips**: BIP-340 · secp256k1 · Atomic Swap · PTLC

**Implements**: Schnorr `src/crypto/attacks.ts:8`, secp256k1 `src/crypto/adaptor.ts:156`, SHA-256 `src/crypto/vectors.ts:23`

**Attacks shown**: Discrete log `src/ui/honesty.ts:109`, Key recovery `src/ui/honesty.ts:50`, Nonce reuse `src/crypto/attacks.ts:65`

**Comment-only (named in code comments, not executed)**: EC point arithmetic `src/crypto/secp.ts:81`

**References**: EC point arithmetic, ECDSA, FROST

**Standards body**: NIST, SECG

**Implementation**: @noble

**Spec citations, exactly as written**:

- `ASIACRYPT 2021` — first seen README.md:36 (2×)
- `ePrint 2020/476` — first seen src/ui/honesty.ts:208 (1×)
- `ePrint 2024/1809` — first seen src/ui/honesty.ts:218 (1×)
- `EUROCRYPT 2024` — first seen README.md:37 (3×)

**README — What it does NOT prove**:

```text
- A pre-signature does not reveal `t`. What it *does* do is pin **which** `t` would
  complete it — a commitment to the secret, not a leak of it.
- **A correct extraction does not mean a swap was safe.** Extraction can return exactly
  the right secret while the counterparty's pre-signature committed to a different point,
  and no check on the page raises a failure code for that — there is no code to raise. The
  absence of one *is* the exhibit. Only pre-verifying against the `T` the payment names
  detects it. Exhibit 2 drives that state and shows every check passing while the funds
  are gone.
- Per-hop decorrelation is an algebraic property of the identifiers only. It does not make
  a routed payment private: amounts, timing and topology all still correlate and none are
  modeled.
- Passing this lab's fixtures establishes no conformance. There are no official adaptor
  vectors to conform to.
```

**README — What Can Go Wrong**:

```text
- **The parity of `R + T` fixes a sign, and getting it wrong is the classic adaptor bug.**
  `s = ŝ + t` when `R + T` has even y and `s = ŝ − t` when it has odd y. Both branches are
  exercised by pinned fixtures; a lab that only ever hits the even branch fails its claims.
- **`R` and `T` both travel x-only**, so both denote the even-y point and both the nonce
  scalar and the adaptor scalar must be normalised to match. Skipping the normalisation on
  `R` produces a pre-signature that pre-verifies against the negation of the point it was
  built from — caught here by a test during the build.
- **A nonce that does not bind `T`** lets two pre-signatures on one message share `R`, and
  the key falls out. Note the precision: nonce reuse alone is not sufficient. The two
  challenges must also differ, which means the two `T` must differ; reuse under a single `T`
  yields `e₁ = e₂` and recovers nothing.
- **Recovery is two equations, not one.** When both `R + T` parities agree the nonce
  cancels in the difference; when they differ it cancels in the **sum**. A recovery
  implementing only the difference branch silently fails on half its inputs.
- **A wrong-`T` pre-signature is not malformed.** It pre-verifies perfectly against the
  point it was actually built for. Nothing detects it except pre-verifying against the `T`
  the payment names.
- **A right answer reached by a wrong causal chain is still wrong.** The PTLC exhibit
  originally computed every hop secret up front and settled each hop with its own
  precomputed value while displaying the extracted one beside it. Every number matched, the
  screen said settlement propagates backward, and a test proved the derivation *could* work
  — but the state transition took a shortcut, so corrupting a downstream signature would not
  have stopped an upstream hop. It is fixed structurally rather than by comment: settlement
  has access to exactly one secret and can complete a hop with nothing else. The tests that
  distinguish the two are the wrong-blinding cases, because only a fault that makes the
  derived value differ from the precomputed one can tell them apart.
- **The library has a fail-open precondition at the identity point.** `Point.ZERO.toBytes()`
  throws, but `Point.ZERO.x` returns `0n` and `hasEvenY()` returns `true`, both silently.
  A layer that reads `x(R+T)` or its parity straight off the library would compute a
  well-formed-looking challenge over `x = 0` for the degenerate case. This lab puts one
  chokepoint in front of the library that refuses the identity, and a test asserts the raw
  calls giving those wrong answers beside the chokepoint refusing them.
```

**Claims tested** (e2e/claims.spec.ts, 56 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:32
    - :32 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:75
    - :75 `toBe` expected `''` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:79
    - :79 `toBe` expected `true` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:80
    - :80 `toBe` expected `true` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:82
    - :82 `toBe` expected `full` _(expression)_
- `The Relation — the headline claim` — e2e/claims.spec.ts:119
- `the difference printed on screen really is s minus s-hat, re-derived independently` — e2e/claims.spec.ts:120
    - :125 `toHaveCount` expected `1` _(literal)_
    - :139 `toBe` expected `trueT` _(expression)_
    - :150 `toBe` expected `trueT` _(expression)_
    - :158 `toBe` expected `trueT` _(expression)_
- `the completed signature verifies, and the page says so by computation` — e2e/claims.spec.ts:164
    - :168 `toHaveCount` expected `1` _(literal)_
    - :170 `toHaveCount` expected `1` _(literal)_
- `a wrong t turns the headline claim red and the signature is refused` — e2e/claims.spec.ts:176
    - :180 `toHaveCount` expected `1` _(literal)_
    - :181 `toHaveCount` expected `0` _(literal)_
    - :182 `expect` expected _no expected value_ _(none)_
    - :185 `expect` expected _no expected value_ _(none)_
    - :189 `expect` expected _no expected value_ _(none)_
- `RETIREMENT: changing an input clears the completed signature entirely` — e2e/claims.spec.ts:194
    - :197 `toHaveCount` expected `1` _(literal)_
    - :202 `toHaveCount` expected `0` _(literal)_
    - :203 `toHaveCount` expected `1` _(literal)_
    - :206 `toHaveCount` expected `2` _(literal)_
    - :207 `toContainText` expected `'Subtract, and the secret falls out'` _(literal)_
- `NO-OP GUARD: re-locking with the same inputs does not destroy a fresh verdict` — e2e/claims.spec.ts:210
    - :216 `toHaveCount` expected `1` _(literal)_
    - :221 `toBe` expected `before` _(expression)_
    - :222 `toHaveCount` expected `0` _(literal)_
    - :225 `toHaveCount` expected `2` _(literal)_
- `Vectors and fixtures — counts must agree with the rows` — e2e/claims.spec.ts:229
- `the summary counter agrees with the rows it counts` — e2e/claims.spec.ts:230
    - :237 `toBe` expected `rowCount` _(expression)_
    - :256 `toBe` expected `rowCount` _(expression)_
    - :259 `expect` expected _no expected value_ _(none)_
    - :260 `expect` expected _no expected value_ _(none)_
    - :263 `toBe` expected `!same` _(expression)_
    - :267 `toBe` expected `rowCount` _(expression)_
    - :269 `toBe` expected `agree` _(expression)_
- `PARTS SUM TO WHOLE: the three vector classes account for every row` — e2e/claims.spec.ts:274
    - :286 `toBe` expected `total` _(expression)_
    - :289 `expect` expected _no expected value_ _(none)_
    - :290 `expect` expected _no expected value_ _(none)_
    - :291 `expect` expected _no expected value_ _(none)_
    - :292 `expect` expected _no expected value_ _(none)_
- `exactly one row reaches a fourth challenge-hash block, and it is the 100-byte one` — e2e/claims.spec.ts:298
    - :314 `toBe` expected `Math.ceil((128 + d.msgBytes + 9) / 64)` _(expression)_
    - :317 `toBe` expected `1` _(literal)_
    - :318 `toBe` expected `100` _(literal)_
    - :319 `toBe` expected `3` _(literal)_
- `the deliberately wrong fixture row is rendered and reported as FAILING` — e2e/claims.spec.ts:322
    - :327 `toHaveCount` expected `1` _(literal)_
    - :328 `toHaveCount` expected `1` _(literal)_
    - :329 `toContainText` expected `'MISMATCH'` _(literal)_
    - :338 `toBe` expected `firstRowCols` _(expression)_
- `BOTH values are printed on every row, not only where they differ` — e2e/claims.spec.ts:344
    - :349 `expect` expected _no expected value_ _(none)_
    - :353 `expect` expected _no expected value_ _(none)_
    - :354 `expect` expected _no expected value_ _(none)_
    - :359 `toBe` expected `wrongComputed` _(expression)_
- `PARTS SUM TO WHOLE: passing plus deliberately-failing equals all fixture rows` — e2e/claims.spec.ts:362
    - :375 `toBe` expected `total` _(expression)_
- `Swap — atomicity and the wrong-T loss` — e2e/claims.spec.ts:379
- `the honest run pays both sides and the order is visible` — e2e/claims.spec.ts:380
    - :385 `toHaveCount` expected `1` _(literal)_
    - :387 `toHaveCount` expected `1` _(literal)_
    - :388 `toHaveCount` expected `0` _(literal)_
    - :393 `expect` expected _no expected value_ _(none)_
    - :394 `expect` expected _no expected value_ _(none)_
- `Bob's claim is not computable before Alice publishes` — e2e/claims.spec.ts:397
    - :401 `expect` expected _no expected value_ _(none)_
- `NEGATIVE CLAIM: every check passes and Bob still loses the funds` — e2e/claims.spec.ts:408
    - :420 `expect` expected _no expected value_ _(none)_
    - :423 `expect` expected _no expected value_ _(none)_
    - :426 `expect` expected _no expected value_ _(none)_
    - :431 `expect` expected _no expected value_ _(none)_
    - :438 `toBeVisible` expected _no expected value_ _(none)_
    - :439 `toContainText` expected `'What this does NOT prove'` _(literal)_
    - :440 `toContainText` expected `'Extraction working does not mean the swap is safe'` _(literal)_
    - :441 `toContainText` expected `'there is no failure code for that'` _(literal)_
    - :443 `toBe` expected `false` _(expression)_
- `SCOPED: skipping the check alone is NOT the loss` — e2e/claims.spec.ts:449
    - :456 `toHaveCount` expected `0` _(literal)_
    - :457 `expect` expected _no expected value_ _(none)_
- `SCOPED: cheating alone is caught and nobody pays` — e2e/claims.spec.ts:462
    - :467 `expect` expected _no expected value_ _(none)_
    - :470 `toHaveCount` expected `0` _(literal)_
- `PTLC — decorrelation is measured, not drawn` — e2e/claims.spec.ts:474
- `the counters agree with the rendered strips` — e2e/claims.spec.ts:475
    - :480 `toBe` expected `3` _(literal)_
    - :481 `toBe` expected `3` _(literal)_
    - :487 `toBe` expected `3` _(literal)_
    - :488 `toBe` expected `1` _(literal)_
    - :489 `expect` expected _no expected value_ _(none)_
    - :494 `expect` expected _no expected value_ _(none)_
- `settlement runs backward and every hop extraction matches` — e2e/claims.spec.ts:501
    - :507 `expect` expected _no expected value_ _(none)_
    - :508 `expect` expected _no expected value_ _(none)_
    - :510 `toHaveCount` expected `0` _(literal)_
- `Break It — the attack is real and the default is safe` — e2e/claims.spec.ts:516
- `the shipped default does NOT reuse a nonce` — e2e/claims.spec.ts:517
    - :520 `toBeChecked` expected _no expected value_ _(none)_
    - :524 `toBe` expected `r2` _(expression)_
    - :525 `toHaveCount` expected `1` _(literal)_
    - :526 `expect` expected _no expected value_ _(none)_
- `the naive nonce really does share R, and the key is recovered` — e2e/claims.spec.ts:534
    - :540 `toBe` expected `r2` _(expression)_
    - :541 `expect` expected _no expected value_ _(none)_
    - :544 `expect` expected _no expected value_ _(none)_
    - :548 `toContainText` expected `'transfer everything to the attacker'` _(literal)_
- `SCOPED: a reused nonce under ONE T is still not recoverable` — e2e/claims.spec.ts:551
    - :560 `toBe` expected `r2` _(expression)_
    - :561 `toHaveCount` expected `1` _(literal)_
    - :563 `expect` expected _no expected value_ _(none)_
    - :566 `toHaveCount` expected `0` _(literal)_
- `a wrong-T pre-signature is well-formed and still rejected against the real T` — e2e/claims.spec.ts:569
    - :577 `toBe` expected `fake` _(expression)_
    - :578 `expect` expected _no expected value_ _(none)_
    - :581 `expect` expected _no expected value_ _(none)_
- `Honesty — the scoping the page claims is present and specific` — e2e/claims.spec.ts:587
- `real / modeled / not built are all populated` — e2e/claims.spec.ts:588
    - :592 `expect` expected _no expected value_ _(none)_
    - :597 `toContainText` expected `/not production/i` _(regex)_
    - :598 `toContainText` expected `/teaching demo/i` _(regex)_
- `the negative claims are scoped to this construction, not to the field` — e2e/claims.spec.ts:601
    - :604 `toContainText` expected `'pin WHICH t would complete it'` _(literal)_
    - :605 `toContainText` expected _no expected value_ _(none)_
    - :608 `toContainText` expected _no expected value_ _(none)_
- `the fixtures are never called official` — e2e/claims.spec.ts:613
    - :616 `toContainText` expected `'NOT official test vectors'` _(literal)_
    - :622 `toMatch` expected `/these (are|fixtures are) (the )?official/i` _(regex)_
    - :623 `toMatch` expected `/official (adaptor )?(test )?vectors (are|for) (this|these|adaptor)/i` _(regex)_
    - :624 `toMatch` expected `/no standards body publishes/i` _(regex)_
    - :626 `toContainText` expected `'BIP-340 official test vectors'` _(literal)_
- `Page-level honesty checks` — e2e/claims.spec.ts:630
- `exactly one h1, one banner, and the scripture footer verbatim` — e2e/claims.spec.ts:631
    - :633 `toHaveCount` expected `1` _(literal)_
    - :634 `toHaveCount` expected `1` _(literal)_
    - :635 `toContainText` expected _no expected value_ _(none)_
- `the hero three roles say three different things` — e2e/claims.spec.ts:640
    - :645 `toBe` expected `desc` _(expression)_
    - :646 `toBe` expected `why` _(expression)_
    - :647 `expect` expected _no expected value_ _(none)_
    - :648 `expect` expected _no expected value_ _(none)_
    - :649 `expect` expected _no expected value_ _(none)_
    - :654 `expect` expected _no expected value_ _(none)_
- `the [hidden] probe: hidden panels are really not rendered` — e2e/claims.spec.ts:657
    - :666 `toBe` expected `false` _(expression)_
- `the assigned --accent is on :root, and the fallback still paints without it` — e2e/claims.spec.ts:670
    - :681 `toBe` expected `'#ff6b7f'` _(literal)_
    - :690 `toBe` expected `'rgba(0, 0, 0, 0)'` _(literal)_
    - :691 `toBe` expected `''` _(literal)_
    - :695 `toBe` expected `'rgba(0, 0, 0, 0)'` _(literal)_
    - :696 `toBe` expected `''` _(literal)_
- `the independent in-page secp256k1 agrees with the bundle on T = t*G` — e2e/claims.spec.ts:699
    - :720 `toBe` expected `'identity'` _(literal)_
    - :722 `toBe` expected `TxFull` _(expression)_
    - :724 `toBe` expected `true` _(expression)_
- `the independent secp256k1 re-derives the whole pre-signature equation` — e2e/claims.spec.ts:727
    - :761 `toBe` expected `true` _(expression)_
    - :762 `toBe` expected `false` _(expression)_
- `PTLC — causality is on screen, not just in prose` — e2e/claims.spec.ts:766
- `settlement starts at the LAST hop and cannot advance until it succeeds` — e2e/claims.spec.ts:767
    - :771 `toHaveCount` expected `0` _(literal)_
    - :775 `toHaveCount` expected `1` _(literal)_
    - :776 `toContainText` expected `'hop 3'` _(literal)_
- `corrupting a hop BLOCKS every hop upstream and none downstream` — e2e/claims.spec.ts:779
    - :791 `toMatch` expected `/settled/` _(regex)_
    - :793 `toMatch` expected `/BLOCKED/` _(regex)_
    - :794 `toMatch` expected `/BLOCKED/` _(regex)_
    - :795 `toContainText` expected `'chain is broken'` _(literal)_
    - :797 `toContainText` expected `'no usable secret arrived from downstream'` _(literal)_
- `a WRONG BLINDING stalls upstream even though signature and extraction are correct` — e2e/claims.spec.ts:800
    - :815 `toContainText` expected `'settled'` _(literal)_
    - :816 `toHaveCount` expected `1` _(literal)_
    - :818 `toContainText` expected `'BLOCKED'` _(literal)_
    - :819 `toContainText` expected `'BLOCKED'` _(literal)_
    - :820 `toContainText` expected `'chain is broken'` _(literal)_
    - :822 `toContainText` expected `'not valid under this hop payer key'` _(literal)_
- `corrupting the FIRST hop stalls nothing else — the break is directional` — e2e/claims.spec.ts:825
    - :831 `toHaveCount` expected `1` _(literal)_
- `Time to the insight` — e2e/claims.spec.ts:835
- `one action reaches s - s-hat = t` — e2e/claims.spec.ts:836
    - :838 `toHaveCount` expected `0` _(literal)_
    - :840 `toHaveCount` expected `1` _(literal)_
    - :841 `expect` expected _no expected value_ _(none)_
- `the primary action is inside the first 390x844 viewport` — e2e/claims.spec.ts:846
    - :853 `expect` expected _no expected value_ _(none)_
    - :855 `toBe` expected `0` _(literal)_
- `raw hex is optional detail, not the opening experience` — e2e/claims.spec.ts:858
    - :862 `toMatch` expected `/[0-9a-f]{64}/` _(regex)_
    - :864 `toHaveCount` expected `0` _(literal)_
    - :865 `toBeVisible` expected _no expected value_ _(none)_
- `URL state survives refresh and Back` — e2e/claims.spec.ts:869
- `the active exhibit and its failure mode are linkable` — e2e/claims.spec.ts:870
    - :876 `expect` expected _no expected value_ _(none)_
    - :877 `expect` expected _no expected value_ _(none)_
    - :878 `expect` expected _no expected value_ _(none)_
    - :882 `toBeVisible` expected _no expected value_ _(none)_
    - :883 `toBeChecked` expected _no expected value_ _(none)_
    - :884 `toBeChecked` expected _no expected value_ _(none)_
    - :888 `toBeVisible` expected _no expected value_ _(none)_
- `Back returns to the previous exhibit` — e2e/claims.spec.ts:891
    - :894 `toBeVisible` expected _no expected value_ _(none)_
    - :896 `toBeVisible` expected _no expected value_ _(none)_
- `Reset all returns the page to its documented safe state` — e2e/claims.spec.ts:899
    - :903 `toBeVisible` expected _no expected value_ _(none)_
    - :905 `toBeVisible` expected _no expected value_ _(none)_
    - :906 `toBe` expected `'#e=relation'` _(literal)_
    - :909 `toBeChecked` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Adaptor Gate

**BIP-340 Schnorr adaptor signatures · secp256k1**

A pre-signature that becomes a real Schnorr signature only when a secret is added — and
completing it hands that secret to whoever held the pre-signature.

**[Live demo](https://systemslibrarian.github.io/crypto-lab-adaptor-gate/)**

---

## What It Is

An adaptor signature is a signature with a piece missing. A signer produces a
**pre-signature** that is provably bound to a public point `T`, and it is *not* a valid
signature — BIP-340's own verifier rejects it. Whoever knows the secret `t` behind that
point (`T = t·G`) can add `t` and turn it into a signature the real verifier accepts.

The one fact this lab exists to teach is what follows from that. For a pre-signature `ŝ`
and its completed signature `s` on the same nonce commitment:

`​``
s − ŝ ≡ ±t  (mod n),   where T = t·G
`​``

with the sign fixed by the parity of `R + T`. So completing the signature and publishing
the secret are **the same act**. Atomic swaps and PTLCs are applications of that single
fact rather than separate topics, and both are built here on top of the same four
functions.

**The exact primitives.** BIP-340 Schnorr over secp256k1 — tagged-hash challenge, x-only
keys, the even-y nonce rule — via `@noble/curves` 2.4.0. The adaptor layer
(`preSign`, `preVerify`, `adapt`, `extract`) is this lab's own code written on top of the
library's point and scalar operations, and the signature it finally produces is verified
by the **library's unmodified BIP-340 `verify`**, never by this lab. The construction is
the one formalized in Aumayr et al. (ASIACRYPT 2021) and re-proved under strengthened
definitions in Gerhart et al. (EUROCRYPT 2024).

**The security model.** Security of an honest pre-signature rests on the discrete
logarithm problem in the random-oracle model. The threat model shown in-page: the signer
is honest but may reuse nonces; the counterparty may send malformed or wrong-`T`
pre-signatures; the modeled ledgers are assumed honest and live.

**Not production crypto — a teaching demo.** Keys come from values typed into a text box,
nothing is constant-time, nothing is persisted, and no part of this should be used to move
anything of value.

### What is real, and what is modeled

| | |
|---|---|
| **Real** | secp256k1 arithmetic and BIP-340 tagged hashing, checked against BIP-340's own 19 published vectors *before* any lab code was built on the library. |
| **Real** | The adaptor layer itself, and the final signature verified by the library's unmodified `verify`. |
| **Real** | Nonce-reuse key recovery, run against this lab's own `preSign`, proved by signing a fresh message the library then accepts. |
| **Modeled** | The ledgers — deterministic state machines whose spend condition is "a valid BIP-340 signature under key `P` over this message". The signature check is real; there is no chain, script, mempool or fee. A real deployment would lock coins in a 2-of-2 joint key with a timelocked refund (see MuSig Gate); this lab models the lock so the adaptor arithmetic stays in view. |
| **Modeled** | Timelocks — a step counter enabling a refund path, not a consensus mechanism. |
| **Modeled** | PTLC routing — three hops, real pre-signatures, no channel state, fees, network or onion routing. |
| **Not built** | ECDSA adaptors (a different, more involved construction), MuSig2 adaptors, any multi-party signing, any network or real chain data, post-quantum adaptor constructions. |

### What it does NOT prove

- A pre-signature does not reveal `t`. What it *does* do is pin **which** `t` would
  complete it — a commitment to the secret, not a leak of it.
- **A correct extraction does not mean a swap was safe.** Extraction can return exactly
  the right secret while the counterparty's pre-signature committed to a different point,
  and no check on the page raises a failure code for that — there is no code to raise. The
  absence of one *is* the exhibit. Only pre-verifying against the `T` the payment names
  detects it. Exhibit 2 drives that state and shows every check passing while the funds
  are gone.
- Per-hop decorrelation is an algebraic property of the identifiers only. It does not make
  a routed payment private: amounts, timing and topology all still correlate and none are
  modeled.
- Passing this lab's fixtures establishes no conformance. There are no official adaptor
  vectors to conform to.

## Exhibits

1. **The Relation** — the headline, reachable in **one action**. Press *Run the relation*
   and four computed stages appear: lock a secret behind a point; pre-sign against it and
   watch BIP-340 `verify` reject the pre-signature while pre-verification accepts it; add
   `t` and get a signature the library accepts; subtract the two and read `t` back out. The
   mechanism is drawn as the dominant object, and the subtraction wears `t`'s colour only
   when the computed equality holds — **press *Try a wrong t* and it goes red**, which is
   what makes the green state evidence rather than decoration. Every raw value lives behind
   *Inspect exact values*; you can also step the four stages one at a time.
2. **Cross-Ledger Swap** — two modeled ledgers, advanced **one transition at a time**,
   because the order is the lesson and an exhibit that prints its ending hides what produced
   it. Actor lanes show who knows `t`, who holds which pre-signature, and what each ledger
   has published at that moment. Alice completes Bob's pre-signature and publishes; Bob
   reads those bytes *off ledger B* and extracts `t`; Bob claims on ledger A. Two toggles:
   Bob skips pre-verification, and Alice pre-signs against a different `T`. Each alone is
   harmless; together they are a total loss, with every check Bob ran still reporting success.
3. **PTLC vs HTLC** — three hops, both strips computed from one run: three distinct adaptor
   points against one repeated hash. Settlement is **causal**, not narrated — it starts at
   the last hop, and each hop can only be completed with the secret its payee *derived* from
   the hop below it (extracted value plus its own blinding). Two break controls: corrupt a
   hop's published signature, or hand a payee the wrong blinding scalar. Both stall every
   hop upstream and leave those downstream untouched, and they fail for different reasons —
   the second is the sharper one, because that hop's signature is valid and its extraction
   is exactly right, and the hop above it still cannot settle.
4. **Break It** — the naive-nonce toggle makes two pre-signatures on one message share a
   nonce; the key falls out and a forged signature on a fresh message is accepted by the
   library. A second toggle shows the edge case where the nonce *is* reused and the key is
   still not recoverable.
5. **Vectors & Fixtures** — BIP-340's 19 official vectors run live, and this lab's pinned
   adaptor fixtures. Every row prints the computed value beside the expected one whether or
   not they match, and **one fixture row is wrong on purpose** and reports failure.
6. **What This Is & Isn't** — real / modeled / not built, the threat model, the negative
   claims, and the sources.

## When to Use It

- Use it to see why completing an adaptor signature and publishing a secret are the same
  act, because the subtraction runs on screen against the real `t` rather than being
  asserted.
- Use it to understand atomic swaps without a chain in the way, because the ledgers are
  reduced to the one rule that matters and the ordering is driven rather than drawn.
- Use it to see why pre-verification is not optional, because the loss it prevents is
  reachable through two checkboxes and every other check still reports success.
- Use it to see how PTLCs decorrelate a route, because both the point strip and the hash
  strip are derived from the same payment in the same run.
- **Do NOT use it** to move funds, to generate keys, or as a reference implementation of
  adaptor signatures. It is a teaching demo, it is not constant-time, and its ledgers are
  models.

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-adaptor-gate/**

The active exhibit and the important failure modes live in the URL, so a link restores
exactly what you were looking at and survives refresh and Back. A presenter path:

| | |
|---|---|
| the relation | [`#e=relation&stage=4`](https://systemslibrarian.github.io/crypto-lab-adaptor-gate/#e=relation&stage=4) |
| the headline falsified | [`#e=relation&stage=4&t=wrong`](https://systemslibrarian.github.io/crypto-lab-adaptor-gate/#e=relation&stage=4&t=wrong) |
| an honest swap | [`#e=swap&sc=7`](https://systemslibrarian.github.io/crypto-lab-adaptor-gate/#e=swap&sc=7) |
| the swap loss | [`#e=swap&cheat=1&skip=1&sc=7`](https://systemslibrarian.github.io/crypto-lab-adaptor-gate/#e=swap&cheat=1&skip=1&sc=7) |
| PTLC, chain broken | [`#e=ptlc&corrupt=2&hops=3`](https://systemslibrarian.github.io/crypto-lab-adaptor-gate/#e=ptlc&corrupt=2&hops=3) |
| PTLC, wrong blinding | [`#e=ptlc&blind=3&hops=3`](https://systemslibrarian.github.io/crypto-lab-adaptor-gate/#e=ptlc&blind=3&hops=3) |
| nonce reuse | [`#e=break&naive=1`](https://systemslibrarian.github.io/crypto-lab-adaptor-gate/#e=break&naive=1) |

Inputs are deterministic, so two people opening the same link see the same proof.

Pre-sign a message and watch the real verifier refuse the pre-signature; complete it with a
wrong `t` and watch the headline badge go red and the verifier refuse the result; complete
it with the real one and read the secret back out; run the swap honestly and then break it
two ways; compare per-hop PTLC points against a repeated HTLC hash; recover a private key
from two pre-signatures that reused a nonce and see the forged signature accepted; and read
all 19 BIP-340 vectors and the fixture table, including the row that fails on purpose.

## What Can Go Wrong

- **The parity of `R + T` fixes a sign, and getting it wrong is the classic adaptor bug.**
  `s = ŝ + t` when `R + T` has even y and `s = ŝ − t` when it has odd y. Both branches are
  exercised by pinned fixtures; a lab that only ever hits the even branch fails its claims.
- **`R` and `T` both travel x-only**, so both denote the even-y point and both the nonce
  scalar and the adaptor scalar must be normalised to match. Skipping the normalisation on
  `R` produces a pre-signature that pre-verifies against the negation of the point it was
  built from — caught here by a test during the build.
- **A nonce that does not bind `T`** lets two pre-signatures on one message share `R`, and
  the key falls out. Note the precision: nonce reuse alone is not sufficient. The two
  challenges must also differ, which means the two `T` must differ; reuse under a single `T`
  yields `e₁ = e₂` and recovers nothing.
- **Recovery is two equations, not one.** When both `R + T` parities agree the nonce
  cancels in the difference; when they differ it cancels in the **sum**. A recovery
  implementing only the difference branch silently fails on half its inputs.
- **A wrong-`T` pre-signature is not malformed.** It pre-verifies perfectly against the
  point it was actually built for. Nothing detects it except pre-verifying against the `T`
  the payment names.
- **A right answer reached by a wrong causal chain is still wrong.** The PTLC exhibit
  originally computed every hop secret up front and settled each hop with its own
  precomputed value while displaying the extracted one beside it. Every number matched, the
  screen said settlement propagates backward, and a test proved the derivation *could* work
  — but the state transition took a shortcut, so corrupting a downstream signature would not
  have stopped an upstream hop. It is fixed structurally rather than by comment: settlement
  has access to exactly one secret and can complete a hop with nothing else. The tests that
  distinguish the two are the wrong-blinding cases, because only a fault that makes the
  derived value differ from the precomputed one can tell them apart.
- **The library has a fail-open precondition at the identity point.** `Point.ZERO.toBytes()`
  throws, but `Point.ZERO.x` returns `0n` and `hasEvenY()` returns `true`, both silently.
  A layer that reads `x(R+T)` or its parity straight off the library would compute a
  well-formed-looking challenge over `x = 0` for the degenerate case. This lab puts one
  chokepoint in front of the library that refuses the identity, and a test asserts the raw
  calls giving those wrong answers beside the chokepoint refusing them.

## Real-World Usage

Adaptor signatures are the basis of **scriptless scripts**: conditions enforced by
signature algebra rather than by on-chain script. In practice that means cross-chain
atomic swaps, where one party's claim publishes the secret the other needs, and
**PTLCs** — the point-based replacement for Lightning's HTLCs, which removes the shared
payment hash that makes every hop on a route linkable. The construction is also used for
discreet log contracts and for atomic multi-path payments. Bitcoin's Taproot activation
(BIP-340 Schnorr) is what made the single-signer form practical on-chain; the joint-key
lock a real deployment would use is MuSig2 territory.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-adaptor-gate.git
cd crypto-lab-adaptor-gate
npm install
npm run dev
`​``

No environment variables are required. To run the browser gates you also need the
Playwright browsers: `npx playwright install --with-deps chromium firefox webkit`.

## Related Demos

- [crypto-lab-schnorr-forge](https://systemslibrarian.github.io/crypto-lab-schnorr-forge/) —
  BIP-340 Schnorr itself. **Start here if `s = k + e·d` is unfamiliar**; this lab assumes it.
- [crypto-lab-musig-gate](https://systemslibrarian.github.io/crypto-lab-musig-gate/) — the
  2-of-2 joint key this lab models as a single-key lock.
- [crypto-lab-frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) —
  threshold signing, the t-of-n direction.
- [crypto-lab-bitcoin-script](https://systemslibrarian.github.io/crypto-lab-bitcoin-script/) —
  the scripted spending conditions scriptless scripts replace.
- [crypto-lab-bitcoin-wallet](https://systemslibrarian.github.io/crypto-lab-bitcoin-wallet/) —
  keys and addresses.

## Build & Verify

`​``bash
npm run build       # tsc --noEmit && vite build
npm test            # 127 unit tests across 8 files (Vitest)
npm run test:a11y   # 116 browser tests: axe WCAG gate, claims, visual snapshots,
                    # and functional flows in 4 browsers
`​``

**Unit tests — 127, all passing.**

| suite | what it pins |
|---|---|
| `src/crypto/bip340-kat.test.ts` | **The library gate.** All 19 rows of BIP-340's `test-vectors.csv`: verify results on all 19, byte-exact deterministic signatures on the 8 signable rows. Also pins the vector file's own sha256 and re-measures its shape. |
| `src/crypto/secp.test.ts` | The chokepoint, including the raw library calls giving fail-open answers at the identity where the chokepoint throws. |
| `src/crypto/adaptor.test.ts` | Invariants 1–8 and every edge case, over fixtures covering all four `P`/`R+T` parity combinations. |
| `src/crypto/adaptor-independent.test.ts` | **The independent re-derivation.** A self-contained affine BigInt secp256k1 — its own modular inverse, point addition, ladder, `lift_x` and tagged hash — that imports neither `adaptor.ts` nor the library's `Point`, and agrees on every intermediate value. |
| `src/crypto/attacks.test.ts` | Nonce-reuse recovery on both algebraic branches, with a test proving the sum branch is load-bearing. |
| `src/crypto/swap.test.ts` | Swap atomicity, the ledger's real signature checks, and the wrong-`T` loss. |
| `src/ci-pins.test.ts` | That CI's Playwright container tag still matches the installed `@playwright/test`, and that the preview port is a single literal all three config sites read. |
| `src/crypto/ptlc.test.ts` | Per-hop decorrelation, and the **causality** of settlement: that each hop consumes the value extracted from the hop below it, and that corrupting a signature or a blinding stalls every hop upstream while leaving those downstream untouched. |

**KAT files.** `src/vectors/bip340-test-vectors.csv`, vendored byte-for-byte from
`bip-0340/test-vectors.csv` in `bitcoin/bips` with its provenance, sha256 and measured
shape recorded in `src/vectors/PROVENANCE.md`. There are **no official single-signer
Schnorr adaptor vectors** — neither BIP-327 nor secp256k1-zkp publishes any — so this
lab's adaptor fixtures in `src/crypto/fixtures.ts` are self-derived, are never labelled
official, and are guarded by the independent re-derivation above.

**Browser gates — 116 tests.**

- `e2e/a11y.spec.ts` — the axe-core WCAG 2.1 A/AA gate, run against the **production
  build** at desktop and 380px. Zero violations and zero `incomplete` findings; contrast is
  additionally computed arithmetically, and the non-text (1.4.11) baseline is **empty**,
  measured for this lab rather than inherited.
- `e2e/claims.spec.ts` — 41 claims that the page tells the truth: cross-checks between
  surfaces, parts-sum-to-whole over the vector classes and fixture rows, and independent
  re-derivations evaluated in the browser with arithmetic sharing no code with the bundle.
  Includes the negative-claim fixture (every check green, funds gone, the limitation on
  screen), the PTLC causality claims, the URL-state round trip, and the measured assertion
  that the first meaningful action falls inside a 390x844 viewport.
- `e2e/flows.spec.ts` — functional walkthroughs of every exhibit in Chromium, Firefox,
  WebKit and a mobile viewport.
- `e2e/visual.spec.ts` — 13 focused snapshots, baselined for **both** macOS and Linux so
  the gate runs locally and in CI rather than only where it was authored. CI runs the
  browser gate **inside the Playwright container**, because the bare `ubuntu-latest` runner
  does not render text identically to the image the baselines came from — comparing across
  the two failed all 13 on the first run, and re-baselining against the runner would have
  tied them to an image that changes underneath. Deliberately
  narrow: the opening states, the mechanism in each of its three readings, the three swap
  outcomes, the two nonce modes, and PTLC settlement at its first, final and broken
  transitions. The giant vector tables are not snapshotted — the claims suite already
  checks them value by value. Tolerance is tight for a measured reason: at the usual 1%
  a semantic colour swap moved fewer pixels than the allowance and every snapshot still
  passed, so it was tightened until that mutation fails.

Every rendered verdict has a matching source mutation recorded in `e2e/claims.spec.ts`,
and each was run: the mutation was applied, the build confirmed to still succeed, the
bundle hash confirmed to move, and the owning claim confirmed to fail.

The CI workflow gates the Pages deploy on **all** of it — `npm test`, the build, then the
full Playwright run — so a broken proof, a broken claim or an accessibility regression
blocks a publish.

## Performance

Everything runs in the browser on a single 256-bit curve; the whole unit suite takes about
two seconds, and the heaviest page operation is the fixture table, which performs five
full pre-sign/adapt/extract round trips plus 19 vector verifications on render. The opening
exhibit does one pre-signature at mount and nothing else until you press a button.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Vector Gate

- **slug**: `crypto-lab-vector-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-vector-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-vector-gate/
- **commit_sha**: `c08c4f2381ed72ed393bc085b41b7ce5511c488b` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | ATTACKS  ·  **level**: intermediate  ·  **--accent**: #b5c6ff
- **MISSING FIELDS**: why_it_matters, verification

**Name (H1)**: Vector Gate  — _read from src/main.ts_

**Subtitle**: Ed25519 · RFC 8032 §5.1.7 · Wycheproof  — _read from src/main.ts_

**Description**: Turn off one required check and watch this verifier accept a signature nobody ever signed — then build ${MAX_K} more of them yourself, and find out why a passing test suite never noticed.  — _read from src/main.ts_

**Why it matters**: _MISSING_

**Card copy**: Switch off Ed25519's required scalar-range check and watch the verifier accept a signature nobody signed, while all five RFC vectors still pass — then ask what passing them proved.

**Chips**: Ed25519 · RFC 8032 · Wycheproof Case · Evidence Scope

**Implements**: Ed25519 `src/crypto/ed25519.ts:74`, SHA-512 `src/crypto/ed25519.ts:85`

**Attacks shown**: Chosen-ciphertext attack `src/main.ts:150`, Signature malleability `docs/source-lock.md:23`

**References**: AEGIS-256, ECDSA, Kyber, ML-KEM, SHA-256

**Standards body**: IETF, NIST

**Implementation**: TypeScript BigInt / WebCrypto

**Spec citations, exactly as written**:

- `FIPS 140-3` — first seen README.md:44 (6×)
- `RFC 8032` — first seen README.md:7 (13×)
- `rfc8032` — first seen README.md:76 (3×)

**Stated limitations (page)**:

- _(limitation, src/main.ts)_ This educational exhibit is not ACVTS or an accredited NVLAP laboratory. It issues no NIST algorithm validation or CAVP certificate, and no CMVP or FIPS 140-3 module certificate. It is not production crypto.

**README — What Can Go Wrong**:

```text
Omitting S < L preserves the group equation for this S + L case. Matching positive vectors does not exercise that rejection rule. Wrong-message and decode errors remain separate causes; the range diagnostic is not claimed tested when parsing failed. No constant-time or complete-verifier assurance is claimed.
```

**Claims tested** (e2e/claims.spec.ts, 13 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:4
    - :4 `toHaveAttribute` expected `'data-range','omitted'` _(expression)_
- `green vectors coexist with hostile acceptance and the visible negative claim` — e2e/claims.spec.ts:6
    - :9 `toHaveAttribute` expected `'data-matched',String(count)` _(expression)_
    - :10 `toHaveText` expected `Array(count).fill('✓ RFC vector matched')` _(expression)_
    - :12 `toHaveText` expected `'PASS'` _(literal)_
    - :13 `toHaveAttribute` expected `'data-outcome','ACCEPT'` _(expression)_
    - :14 `toContainText` expected `'NOT ENFORCED'` _(literal)_
    - :15 `toBeVisible` expected _no expected value_ _(none)_
    - :16 `toContainText` expected `'does not establish rejection of noncanonical signatures'` _(literal)_
- `single-predicate repair changes the computed decision, preserves identical hostile bytes and both controls` — e2e/claims.spec.ts:18
    - :21 `toHaveAttribute` expected `'data-outcome','ACCEPT'` _(expression)_
    - :22 `toHaveText` expected `'Group equation mismatch'` _(literal)_
    - :23 `toHaveAttribute` expected `'data-range','enforced'` _(expression)_
    - :25 `toHaveAttribute` expected `'data-outcome','REJECT'` _(expression)_
    - :26 `toHaveText` expected `'S >= L'` _(literal)_
    - :27 `toHaveText` expected `'PASS'` _(literal)_
    - :28 `toBe` expected `before` _(expression)_
    - :32 `toHaveCount` expected `0` _(literal)_
    - :35 `toEqual` expected `['ACCEPT','REJECT','REJECT']` _(expression)_
    - :43 `toEqual` expected `['pass','pass','pass']` _(expression)_
    - :45 `toHaveAttribute` expected `'data-range','omitted'` _(expression)_
    - :46 `toHaveAttribute` expected `'data-outcome','ACCEPT'` _(expression)_
    - :49 `toEqual` expected `['pass','pass','alarm']` _(expression)_
- `on-screen scalars and equation sides independently support the mechanism` — e2e/claims.spec.ts:52
    - :60 `toBe` expected `2n**252n+27742317777372353535851937790883648493n` _(expression)_
    - :61 `toBe` expected `delta` _(expression)_
    - :62 `toBe` expected `delta.toString()` _(expression)_
    - :63 `toBe` expected `hostile.slice(0,64)` _(expression)_
    - :64 `toBe` expected `await page.locator('#left-hostile-live').innerText()` _(expression)_
    - :65 `toBe` expected `await page.locator('#right-hostile-live').innerText()` _(expression)_
    - :68 `toBe` expected `true` _(expression)_
    - :69 `toBe` expected `false` _(expression)_
- `evidence cards remain parallel, scoped and separate from validation certificates` — e2e/claims.spec.ts:71
    - :72 `toHaveCount` expected `5` _(literal)_
    - :73 `toHaveText` expected `['OBJECT','WHO / WHAT DEFINES IT','WHAT THIS EVIDENCE ESTABLISHES','WHAT IT DOES NOT ESTABLISH']` _(expression)_
    - :74 `toContainText` expected `'issues no NIST algorithm validation or CAVP certificate'` _(literal)_
    - :75 `toContainText` expected `/Implementation secure|NIST compliant|Fully validated|Wycheproof.clean|Wycheproof certified/` _(regex)_
- `theme is pinned before paint and running the experiment has no external requests` — e2e/claims.spec.ts:77
    - :80 `toHaveAttribute` expected `'data-theme','dark'` _(expression)_
    - :81 `toHaveCount` expected `0` _(literal)_
- `changing the predicate retires all earlier computed verdicts until the new computation finishes` — e2e/claims.spec.ts:83
    - :94 `toHaveAttribute` expected `'aria-busy','true'` _(expression)_
    - :95 `toContainText` expected `'Previous results retired'` _(literal)_
    - :96 `toHaveCount` expected `0` _(literal)_
    - :97 `toHaveText` expected `'Waiting for computation'` _(literal)_
    - :98 `toHaveText` expected `'Waiting for computation'` _(literal)_
    - :100 `toHaveText` expected `'…'` _(literal)_
    - :102 `toHaveAttribute` expected `'data-range','enforced'` _(expression)_
    - :103 `toHaveAttribute` expected `'aria-busy','false'` _(expression)_
    - :104 `toHaveAttribute` expected `'data-outcome','REJECT'` _(expression)_
- `reselecting broken mode preserves fresh evidence without rerunning the verifier` — e2e/claims.spec.ts:106
    - :118 `toBeHidden` expected _no expected value_ _(none)_
    - :120 `toBe` expected `0` _(literal)_
    - :121 `toHaveAttribute` expected `'data-ready','true'` _(expression)_
    - :122 `toHaveAttribute` expected `'data-matched','5'` _(expression)_
- `the forge stepper produces a family of forgeries, counted from the bytes not stated` — e2e/claims.spec.ts:125
    - :135 `toHaveAttribute` expected `'data-max-k',expected.toString()` _(expression)_
    - :136 `toContainText` expected `'${expected} values of k above zero'` _(expression)_
    - :140 `toHaveAttribute` expected `'data-outcome','ACCEPT'` _(expression)_
    - :144 `toHaveAttribute` expected `'data-range','enforced'` _(expression)_
    - :145 `toHaveAttribute` expected `'data-outcome','REJECT'` _(expression)_
    - :146 `toHaveText` expected `'S >= L'` _(literal)_
- `byte surgery names which rule rejected, and the causes stay distinct` — e2e/claims.spec.ts:149
    - :160 `toHaveAttribute` expected `'data-rule',rule` _(expression)_
    - :164 `toBe` expected `cases.length` _(expression)_
- `the Exhibit 01 prediction is returned to and scored once the hostile case is accepted` — e2e/claims.spec.ts:167
    - :171 `toBeHidden` expected _no expected value_ _(none)_
    - :173 `toHaveAttribute` expected `'data-range','omitted'` _(expression)_
    - :174 `toBeVisible` expected _no expected value_ _(none)_
    - :175 `toHaveAttribute` expected `'data-correct','false'` _(expression)_
    - :176 `toContainText` expected `'Not supported by this evidence'` _(literal)_
    - :177 `toContainText` expected `'only'` _(literal)_
- `the prediction verdict renders its chosen label as text, not as markup` — e2e/claims.spec.ts:180
    - :198 `toBeVisible` expected _no expected value_ _(none)_
    - :199 `toHaveCount` expected `0` _(literal)_
    - :200 `toHaveCount` expected `0` _(literal)_
    - :201 `toContainText` expected `'onerror'` _(literal)_
    - :202 `toHaveTitle` expected `/^(?!xss$).*/` _(regex)_
    - :204 `toHaveText` expected `'Your prediction, now that the evidence is in'` _(literal)_
    - :205 `toContainText` expected `'Not supported by this evidence'` _(literal)_
- `the scope exercise scores the learner against the reference answer` — e2e/claims.spec.ts:208
    - :210 `toBeHidden` expected _no expected value_ _(none)_
    - :215 `toHaveAttribute` expected `'data-score','2'` _(expression)_
    - :216 `toHaveAttribute` expected `'data-correct','true'` _(expression)_
    - :217 `toHaveAttribute` expected `'data-correct','false'` _(expression)_
    - :218 `toBeVisible` expected _no expected value_ _(none)_

**Mutation records** (2 file(s)):

- `audits/mutation-observations.json` (48075 bytes)
- `tools/mutations.mjs` (6301 bytes)

<details><summary>Full README</summary>

```markdown
# Vector Gate

## What It Is

Vector Gate is a browser-only Ed25519 lab about **a verifier that accepts a signature nobody signed.**

Ed25519 verification has two jobs: check the equation, and check that the scalar `S` is smaller than the group order `L` (RFC 8032 §5.1.7). Leave the second one out and the verifier still satisfies every published test vector — and still accepts a pinned Wycheproof forgery built by adding `L` to a genuine signature's `S`. You switch that check off yourself, watch the forgery go through, build the whole family of them, and switch it back on to watch the same bytes be rejected.

The closing exhibit is the question that follows: the five RFC vectors passed the whole time, so what did passing them establish? That is where conformance cases, adversarial cases, CAVP algorithm validation and CMVP module validation are separated — as parallel claims about different objects, not a ladder.

The equation and hash are real: an inspectable TypeScript verifier performs extended-coordinate Edwards arithmetic and WebCrypto SHA-512. Fixtures are public and pinned. This is variable-time educational code, not production crypto. The page is not a NIST service or accredited laboratory and issues no algorithm/module validation certificate.

## Exhibits

The switch that breaks the verifier is in the first screen, above every exhibit; reaching broken mode still takes one deliberate click.

1. **The published tests all pass — either way** runs five RFC §7.1 verification vectors, asks what matching them establishes, and records your prediction.
2. **The case those tests never asked about** judges a genuine signature, a message-corruption control and the forgery under whichever setting the switch is in, in one panel that is rerun rather than copied. Your prediction from Exhibit 01 is returned to and scored once the hostile signature has actually been accepted.
3. **Why the forgery satisfies the equation** shows the computed challenge from both signatures, both scalars, L, and both sides of the equation as live values.
4. **Forge it yourself** adds k·L to S and re-verifies under the same switch. The page computes how many values of k keep the scalar inside 32 bytes, so the result is a family of forgeries rather than one fixture.
5. **Byte surgery** alters any byte of the canonical signature and reports which rule turned the result down — decode, scalar range, or group equation — with the causes kept distinct.
6. **What Did the Green Result Prove?** asks you to assign each piece of evidence you produced to the kind of claim it supports, then reveals the reference answer and the five parallel evidence scopes: specification, named case, adversarial case, algorithm validation and module validation.

### What this lab deliberately does not contain

It focuses on the scope of conformance and validation evidence. It contains no ZIP215 experiment, ECDSA experiment, full Wycheproof suite browser, validation service, certificate generator, compliance checker, second AEAD/PQC experiment, or security score. Related fleet exhibits cover those: [Ed25519 Forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) owns the ZIP215/cofactor comparison, and [Corrupted Oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/) and [DRBG Arena](https://systemslibrarian.github.io/crypto-lab-drbg-arena/) address generator evidence.

## When to Use It

Use it to show that a verifier can pass its whole test suite and still accept forgeries, to make the `0 ≤ S < L` requirement concrete, and then to separate scoped test evidence from algorithm and module validation. Do not use it to verify production signatures, assess overall application security, or claim certification.

## Live Demo

[Open Vector Gate](https://systemslibrarian.github.io/crypto-lab-vector-gate/)

Published on 3 October 2026. The live page runs all five RFC verification cases and lets you enter the deliberately broken experiment, then restore the scalar-range rule.

## What Can Go Wrong

Omitting S < L preserves the group equation for this S + L case. Matching positive vectors does not exercise that rejection rule. Wrong-message and decode errors remain separate causes; the range diagnostic is not claimed tested when parsing failed. No constant-time or complete-verifier assurance is claimed.

## Real-World Usage

Conformance fixtures, adversarial cases and formal validation contribute evidence with defined scopes. CAVP algorithm validation and CMVP/FIPS 140-3 module validation concern different objects. This exhibit does not reproduce either program. See [primary-source lock](docs/source-lock.md).

## How to Run Locally

Requires Node 22 or newer supported Node, and npm.

`​``sh
npm ci
npm run dev
`​``

Open the Vite URL at `/crypto-lab-vector-gate/`. The lab makes no external requests to run the experiment.

## Related Demos

[Ed25519 Forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) teaches the ZIP215/cofactor comparison; [Corrupted Oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/) and [DRBG Arena](https://systemslibrarian.github.io/crypto-lab-drbg-arena/) address generator evidence. [AEGIS Gate](https://systemslibrarian.github.io/crypto-lab-aegis-gate/) and [Air Stream](https://systemslibrarian.github.io/crypto-lab-air-stream/) expose named vectors. [Export Grade](https://systemslibrarian.github.io/crypto-lab-export-grade/) studies a weak construction. [Kyber Vault](https://systemslibrarian.github.io/crypto-lab-kyber-vault/) and [KEM Trap](https://systemslibrarian.github.io/crypto-lab-kem-trap/) distinguish primitive behavior and caller composition.

## Build & Verify

`​``sh
npm test
npm run test:coverage
npm run build
npx playwright install --with-deps chromium
npm run test:a11y
npm run test:mutations
`​``

34 unit tests pass; five RFC verification KATs run in both modes. Verifier coverage: 98.33% lines, 98.09% statements, 97.77% branches, 100% functions. All 10 production-browser tests pass: seven claim/interaction checks and three WCAG gates at 1280, 380 and 320 pixels, with axe, text contrast, non-text contrast and keyboard operation. These local checks used Chromium 153.0.8010.0. The [GitHub verification and deployment workflow](https://github.com/systemslibrarian/crypto-lab-vector-gate/actions/runs/37119790415) also passed these gates and published the site on 3 October 2026. The live page and both scalar-enforcement modes were checked after deployment.

The source-mutation script checks baseline success, unique patch application, successful build, changed production bundle, named owning-test failure and restored bundle hash. All eight source mutations were detected: scalar enforcement, equation computation, visible negative claim, text contrast, stale-result retirement and same-mode handling. `npm run test:mutations -- --unit-only` runs only the unit mutations. Observations are generated by the script, never typed manually. Set `CHROMIUM_PATH` to use an existing compatible Chromium executable when the standard Playwright download is unavailable.

Fixtures live in `fixtures/rfc8032.json`, `fixtures/wycheproof-pair.json`, and `fixtures/experiment.json`. Upstream Wycheproof data and Apache notices are preserved. The two independent oracle versions and results are frozen in `fixtures/oracle-transcript.json`.

## Performance

The public-fixture verifier uses variable-time BigInt arithmetic for inspectability. Runtime is not a side-channel, throughput or production-suitability claim. No secrets are entered or generated.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Research review extension 31 October 2026

R20261031-08: The evidence-scope lesson names the version 2 Jasmin ML-KEM compiler-preservation theorem, its safety/memory conditions and trust base. It explicitly excludes cache/speculation claims and any transfer to this browser, noble JavaScript or WASM.

```

</details>

---

## Signature Gate

- **slug**: `crypto-lab-confirmer-signatures`
- **repo**: https://github.com/systemslibrarian/crypto-lab-confirmer-signatures
- **live**: https://systemslibrarian.github.io/crypto-lab-confirmer-signatures/
- **commit_sha**: `db6695e0f136507572dcc10e652bff83ea357383` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: SIGNATURES | ZERO-KNOWLEDGE | PROTOCOLS  ·  **level**: advanced  ·  **--accent**: #83c5f7
- **MISSING FIELDS**: why_it_matters, claims, verification, limitations

**Name (H1)**: Signature Gate  — _read from prototype/entry.html_

**Subtitle**: Ordinary P-256 ECDSA · WebCrypto · SHA-256  — _read from prototype/index.html_

**Description**: Try the problem first: Alice signs a fictional agreement. Bob checks it. Then he forwards the same evidence to Dave, who can check it too. Change the agreement and see both reject it.  — _read from prototype/index.html_

**Why it matters**: _MISSING_

**Card copy**: Challenge real BLS12-381 confirmation proofs, then compare a one-message designated-verifier proof that either the branch witness or its verifier can make with a public equation check. The lesson remains a research preview, not a security proof of the complete confirmer scheme.

**Chips**: BLS12-381 · Designated-Verifier Proof · Challenge Timing · Research Preview

**Implements**: BLS signatures `research/real-pairing/core.mjs:136`, BLS12-381 `research/real-pairing/core.mjs:106`, ECDSA `prototype/crypto.mjs:9`, Hash-to-curve `research/real-pairing/core.mjs:81`, P-256 `prototype/crypto.mjs:10`, Pairing `research/real-pairing/core.mjs:89`, SHA-256 `research/real-pairing/core.mjs:74`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: ElGamal `research/dcs-uv-symbolic.mjs:4`, Fiat-Shamir `research/real-pairing/designated-verifier.mjs:316`, Pedersen commitment `research/issued-envelope-toy.mjs:4`, Schnorr `research/real-pairing/designated-verifier.mjs:42`, Schnorr identification `research/real-pairing/designated-verifier.mjs:42`, Shamir secret sharing `research/issued-envelope-toy.mjs:8`

**References**: EC point arithmetic, ElGamal, Pedersen commitment, Schnorr, Schnorr identification, Shamir secret sharing, Sigma protocol, Sign-then-Encrypt

**Standards body**: IETF, NIST

**Implementation**: WebCrypto / @noble/curves / local research protocols

**Spec citations, exactly as written**:

- `10.1007/3-540-68339-9_13` — first seen research/real-pairing/designated-verifier.mjs:6 (1×)
- `doi.org/10.1007/3-540-68339-9_13` — first seen README.md:15 (1×)
- `doi.org/10.1016/j.tcs.2015.12.025` — first seen research/real-pairing/index.html:12 (1×)
- `eprint.iacr.org/2011/182` — first seen research/real-pairing/index.html:12 (2×)
- `RFC 6979` — first seen prototype/index.html:100 (2×)
- `RFC 9380` — first seen research/real-pairing/core.mjs:5 (1×)
- `rfc6979` — first seen prototype/index.html:100 (1×)

**Claims tested**: _MISSING — no claims suite found_

**Mutation records** (1 file(s)):

- `scripts/dv-mutations.mjs` (9014 bytes)

<details><summary>Full README</summary>

```markdown
# Confirmer Signatures — Crypto Lab (Research Gate)

**Current research status (2026-10-18):** The [real BLS12-381 workbench](https://systemslibrarian.github.io/crypto-lab-confirmer-signatures/real/) computes issuance, signer/confirmer confirmation, and a candidate affirmative inequality proof. The [candidate correction argument](research/real-pairing/DISAVOWAL-PROOF.md) now gives completeness, two-special-soundness and special honest-verifier zero knowledge for the specified prime-order protocol, supported by executable witness extraction. These are local research results, not an independently verified correction of the complete published DCS scheme. Full DCS security remains unestablished. The owner authorized a separate **Advanced · Research Preview** catalog card on 2026-10-18; that listing does not certify the complete scheme.

**Catalog entry:** **Signature Gate** is an Advanced research-preview demo under Public-Key & Signatures. The [project entry URL](https://systemslibrarian.github.io/crypto-lab-confirmer-signatures/) opens the real-pairing workbench; the earlier [ordinary-signature comparison](https://systemslibrarian.github.io/crypto-lab-confirmer-signatures/ordinary.html) and symbolic model remain available.

**The visitor now becomes Bob:** The real-pairing workbench has a four-step guided story, explicit commitment → challenge → answer controls, an altered-claim experiment, and Eve’s passing recording beside its rejection under a different challenge. Explore mode opens all experiments; the evidence view provides public transcript downloads and the [review packet](research/real-pairing/REVIEW-PACKET.md).

**Reproducible verification:** A [separate Python/py_ecc verifier](research/real-pairing/reference/) checks the same public transcripts using a different cryptographic library. CI reproduces fixed vectors, checks polynomial identities and 100,972 small-field extraction cases, tests tampering and verifies actual browser exports. This is not independent expert review or a machine-checked full security proof.

**Kernel-checked mathematics:** The [Lean 4 proof project](research/real-pairing/formal/) proves completeness, explicit witness extraction and OR two-special-soundness in a field model, including the crucial nonzero denominator. It also proves the exact joint honest-branch sampling distribution. Fourteen declarations pass a restricted axiom gate; Pages publication now requires that proof check on the same commit. Concrete BLS12-381/code refinement, the full OR distribution and full DCS security games remain outside the formalization.

**Security repair:** Proof work exposed a vacuous subgroup check: reducing the group-order exponent to zero let an order-two element support a false denial of a valid signature for even challenges. The verifier now uses raw subgroup exponentiation and validates group membership. The new regression reproduces that attack and requires rejection. This is why passing honest examples alone was insufficient.

**Designated-verifier proofs (A-D-09):** The real-pairing workbench now has a fifth chapter implementing the non-interactive designated-verifier proof of [Jakobsson, Sako and Impagliazzo, EUROCRYPT '96, LNCS 1070, pp. 143–154](https://doi.org/10.1007/3-540-68339-9_13), §5. The same verifier accepts a proof made by the signer or confirmer with the branch witness **and** a proof the visitor forges with the secret behind their own verifier key. From the transcript alone, an outsider therefore cannot establish statement truth or proof origin; the visitor can even produce an accepting proof of a statement Alice never signed. A separate publicly verifiable Fiat–Shamir proof of the same relation supplies the transferability contrast, and neither verifier accepts the other's proofs. Any reader can recompute that public proof's equations, but this lab supplies no proof-of-knowledge or soundness theorem for it. The two designated-proof origins are shown to be **exactly** interchangeable on a true statement through the bijection that maps prover randomness to simulator randomness, checked by reproducing proofs byte for byte rather than by sampling. A separate py_ecc implementation recomputes every equation, and eight source mutations are each killed by their own named test in CI. Scope, the random-oracle model, and all six deviations from the printed construction are recorded in [DESIGNATED-VERIFIER.md](research/real-pairing/DESIGNATED-VERIFIER.md). This is Definition 1, not the Appendix's strong designated verifier, and it changes nothing about the open full-DCS obligations.

**Reading the history below:** Earlier symbolic and 2016-oriented experiments remain available, but they are separate constructions. Current real-pairing claims and remaining obligations are recorded in the [security ledger](research/real-pairing/SECURITY-MODEL.md).

**New source-specific research, kept separate from the 2016 construction:** [XIA2013-UNIFIED-CONFIRMATION.md](research/XIA2013-UNIFIED-CONFIRMATION.md) documents the signed-ElGamal/BLS-shaped issuing algebra and both interactive OR-confirmation diagrams from Xia's 2013 Chapter 5. The [working browser workbench](https://systemslibrarian.github.io/crypto-lab-confirmer-signatures/symbolic/) computes each value, samples Bob's challenge after the prover commits, and verifies public equations, including altered-message failures. It uses **exponent-visible symbolic groups (not a real pairing)**, so its keys are openly recoverable and it proves no zero knowledge or non-transferability. The printed affirmative disavowal diagrams contain an apparent non-identity inconsistency requiring source review; **the symbolic path is not a secure disavowal implementation; the separate real-pairing candidate and its proof argument are linked above**. This symbolic research does not complete the 2016 DCS; the catalog card describes the separately scoped real-pairing research preview.

**New live challenge:** The [symbolic workbench](https://systemslibrarian.github.io/crypto-lab-confirmer-signatures/symbolic/) now has a **“Can Eve fool Bob?”** experiment. The visitor predicts the outcome, makes Eve fabricate a false proof after choosing the challenge, inspects the independent five-equation check, then forces a different verifier challenge and watches it reject. [Source-backed explanation](research/CHALLENGE-ORDER-ATTACK.md). The symbolic proof arithmetic is genuine, but the model deliberately exposes its discrete logs and **cannot be presented as a secure DCS**.

**Mathematical research gate:** An exhaustive check of all **1,018 nonzero toy keys** now demonstrates that the *literal text-extracted* disavowal factor in Xia 2013 Figures 5.3–5.4 is always the identity despite a non-identity requirement. Typeset thesis Figures 5.3–5.4 have now been visually checked and contain the same contradiction; author/erratum reconciliation remains open. [Disavowal figure audit](research/DISAVOWAL-FIGURE-AUDIT.md). Real pairing groups and the local inequality proof are now implemented separately. Full malicious/concurrent-verifier zero knowledge and DCS non-transferability remain unestablished.

**Visitor experience: _Signature Gate — Become the verifier._** Alice signs a fictional agreement, Carol or Alice answers Bob’s challenge, and Eve demonstrates how an equation-valid recording can be fabricated. The workbench separates signature validity, affirmative inequality evidence, challenge timing and the truth of a signed statement. Full controlled-verification security remains a research obligation.

**Working parts of the actual protocol research:** The [issuing experiment](research/issued-envelope-toy.mjs) now constructs a Pedersen-style commitment, signs that commitment using real WebCrypto ECDSA, encrypts its opening separately for signer and confirmer, and checks a partial initial π0 equality proof. The [toy issuer-to-confirmer protocol](research/toy-confirmation-session.mjs) then has either signer or confirmer independently decrypt the opening and engage a public-only verifier in a genuine three-message, seven-equation arithmetic exchange. Its verdict is explicitly **TOY_EQUATIONS_HOLD, not DCS confirmed**. All operations run; their security parameters are intentionally broken. The [source/negative-claim matrix](research/END-TO-END-TOY.md) documents exactly what is still required for real confirmation, affirmative disavowal, soundness and non-transferability.

**Research progress:** Fubiao Xia's [2013 doctoral thesis](https://etheses.bham.ac.uk/4579/1/Xia13PhD.pdf), a closely related full-verification DCS construction by a coauthor of the 2016 paper, supplies explicit labeled-encryption, confirmation and disavowal formulas. We have implemented and locally tested the **intentionally insecure n=253 Camenisch–Shoup-style labeled encryption arithmetic** in [research/cs-paillier.mjs](research/cs-paillier.mjs). The new [research-only π0 equality subproof](research/pi0-equality.mjs) implements the displayed Fiat–Shamir response/recomputation relation from thesis §6.5.2 over the same trivially factorable toy group. Its independent tests also demonstrate that the subrelation alone **does not bind a message commitment ψ or verify the complete ciphertext label/tag**. See [research/PI0-RELATION.md](research/PI0-RELATION.md) and [research/THESIS-EQUATIONS.md](research/THESIS-EQUATIONS.md) for exact formulas and blockers. The new [toy π1 witness-relation checker](research/pi1-relation.mjs) evaluates seven separate source-defined arithmetic equations, plus independently checks a labeled decrypt; its arguments **include the private witness** and therefore it is **not a proof**, interactive confirmation, or DCS. See [research/PI1-WITNESS-RELATION.md](research/PI1-WITNESS-RELATION.md) for the exact boundaries. The [four-branch research-only disavowal inspector](research/disavow-branches.mjs) evaluates the four invalidity predicates outlined in Camenisch–Shoup §7.3, including the important difference between a malformed ciphertext and an affirmative invalidity proof. It is handed the decryption key and does **not** generate an interactive OR proof, exact interval proof, or non-transferable transcript. The [primary-source analysis](research/DISAVOWAL-BRANCHES.md) documents why those are required. Original research suites covered **49 tests** (9 ECDSA baseline, 8 labeled-encryption, 12 toy π0, 9 toy π1 witness relations, 11 disavowal diagnostics). The current integrated issuer/protocol and security-regression suites now execute **132 Node research tests**, plus **36 real-pairing tests**, with separate actual Chromium desktop/mobile flow tests; see GitHub Actions for the checked count. **This is not a DCS implementation or a complete cryptographic π0 proof.**

**New arithmetic milestone:** [research/pi1-interactive-toy.mjs](research/pi1-interactive-toy.mjs) implements a thesis-derived three-move *toy* π1/π2 relation: seven equations checked by a public-only verifier after a fresh two-bit challenge. [The limitation report](research/PI1-TRANSCRIPT.md) explicitly demonstrates why accepting those equations is **not a designated-confirmer signature verification**, including a zero-challenge counterexample and replay. The source's strict range condition, a concurrent-ZK compiler, a full issuance certificate, and affirmative disavowal remain unimplemented. **The visitor-facing Chapter 02 stays locked.**

**New negative control:** the demonstrator's tiny encryption generator has order only 5, so a different label can alias under the same modular exponent despite changing the hash. The research tests intentionally show the verifier accepting that toy relation under an altered label. This is why we cannot claim production-strength label binding or a sound designated confirmer proof.

**Two-challenge research finding:** [pi1-special-soundness.mjs](research/pi1-special-soundness.mjs) demonstrates that reusing the SAME proof commitment with different verifier challenges lets an observer recover the toy decryption key exponents and hidden opening from the public response differences. [Documented negative controls](research/PI1-SPECIAL-SOUNDNESS.md) include fresh-mask behavior, challenge validation and misleading zero-challenge acceptance. This teaches a genuine algebraic failure mode but is NOT evidence of a completed DCS protocol. None of this research Node code is included in the ordinary-signature web preview.

This repository records the development brief and the cryptographic selection gate for a proposed interactive lab on designated confirmer signatures. Genuine confirmation **and disavowal** protocols must come from a reviewed, published construction and pass independent mathematical checks. A normal signature hidden by encryption is not automatically a designated confirmer signature.

- **[Chapter 01 — ordinary signature research preview](https://systemslibrarian.github.io/crypto-lab-confirmer-signatures/ordinary.html)** — a separately gated Pages preview of ONLY the P-256/SHA-256 public-signature comparison, Bob/Dave verification, and tamper experiment. It is **not** a designated confirmer signature. The deployment checks a live source-SHA marker; if GitHub Pages has not been enabled or if deployment fails, use the [GitHub source](prototype/) and check the [workflow](.github/workflows/research-preview-pages.yml). Tests: `node --test tests/baseline.test.mjs`, plus GitHub Actions desktop/mobile browser checks.
- [`PRODUCT-VISION.md`](PRODUCT-VISION.md) — intended visitor journey, educational outcome, interaction flow, and go/no-go criterion.
- [`SCHEME-NOTES.md`](SCHEME-NOTES.md) — the five-part issued-object inventory confirmed in both the 2013 thesis and the detailed 2016 paper. Complete 2016 proof equations, security assumptions and disavowal remain unverified.
- [`research/SOURCE-RECONCILIATION.md`](research/SOURCE-RECONCILIATION.md) — explains why the final 2016 paper does include π0 despite an abbreviated introduction, and what mathematical-security discrepancies remain unresolved.
- [`brief.md`](brief.md) — required full build and teaching brief.
- [`RESEARCH-GATE.md`](RESEARCH-GATE.md) — scheme-selection prerequisites, literature and acceptance criteria.
- [Crypto Lab master template](https://github.com/systemslibrarian/crypto-lab/blob/main/audits/_MASTER-TEMPLATE.md) — binding Build → Teach → Look → Accessibility → README → Deploy standard, to apply after research passes.

**Non-goals for this stage:** claiming designated-confirmer signature correctness, presenting simulated proofs as genuine, deploying *unfinished DCS* as a complete lab, or presenting its research-preview card as approval of the complete scheme. Publishing the explicitly scoped ordinary-signature, symbolic and real-pairing **research previews** is permitted and is not evidence that the full DCS research gate passed.

---

*One of the proposed exhibits for the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---
