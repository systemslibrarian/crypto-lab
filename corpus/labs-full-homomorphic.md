# Crypto Lab audit corpus — HOMOMORPHIC

Generated 2026-11-08T20:20:28.593Z from 4 lab record(s).

Every finding must cite **commit_sha + lab slug + field**. A field printed as
`MISSING` was not found by the generator; it is not a claim that the lab lacks it.

---
## Blind Oracle

- **slug**: `crypto-lab-blind-oracle`
- **repo**: https://github.com/systemslibrarian/crypto-lab-blind-oracle
- **live**: https://systemslibrarian.github.io/crypto-lab-blind-oracle/
- **commit_sha**: `bbbeffb37a3755db16db26873bc950c98024f4e3` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HOMOMORPHIC  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, claims, mutations, verification

**Name (H1)**: Blind Oracle  — _read from index.html_

**Subtitle**: FHE · TFHE-rs · programmable bootstrapping  — _read from index.html_

**Description**: Encrypt two numbers in your browser, let an untrusted Oracle add the ciphertexts it can never read, then decrypt the sum locally.  — _read from index.html_

**Why it matters**: Fully homomorphic encryption lets a server crunch data it is never allowed to see. That unlocks private cloud analytics on medical, financial, and genomic records — outsourcing computation without ever surrendering the plaintext or the key.  — _read from index.html_

**Card copy**: A server adds encrypted values with TFHE-rs while the decryption key stays in your browser. See why a client must keep decryption-error feedback private.

**Chips**: FHE · TFHE-rs · Rust · Encrypted Compute

**Implements**: TFHE `src/clientFhe.ts:51`

**Attacks shown**: Key recovery `README.md:50`, Side-channel (unspecified) `README.md:58`

**Comment-only (named in code comments, not executed)**: LWE `src/main.ts:468`

**References**: BFV, BGV, CKKS, ElGamal, Paillier

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `ePrint 2022/1563` — first seen README.md:50 (1×)
- `ePrint 2025/867` — first seen README.md:50 (1×)
- `eprint.iacr.org/2022/1563` — first seen README.md:50 (2×)
- `eprint.iacr.org/2025/867` — first seen README.md:50 (2×)

**README — What Can Go Wrong**:

```text
- **Performance overhead:** FHE ciphertexts are large and bootstrapping is slow, so throughput and latency are far worse than plaintext computation.
- **Limited operations:** practical FHE supports a constrained set of operations and bit-widths (here, addition over `FheUint8`); arbitrary programs are expensive or infeasible.
- **No result integrity:** homomorphic evaluation hides inputs but does not by itself prove the server computed the right function — a malicious server could return a wrong-but-valid ciphertext.
- **Malicious-server feedback oracle:** a server can alter returned ciphertexts and learn from a client that reports decryption errors. Chaturvedi et al. demonstrated full key recovery against TFHE/FHEW under repeated client feedback, which does not demonstrate a break of this demo. Blind Oracle compares the result in the browser and sends neither the plaintext nor its match/mismatch verdict back to the server. This closes that feedback path in the demonstrated flow, but does not establish side-channel resistance on the client. See the [original attack (ePrint 2022/1563)](https://eprint.iacr.org/2022/1563) and the [2025 survey (ePrint 2025/867)](https://eprint.iacr.org/2025/867).
- **Metadata still leaks:** request timing, ciphertext sizes, and access patterns remain visible to the server even though plaintext does not.
- **Client-side key management:** security depends entirely on the client key never leaking — lose it and the data is unrecoverable, expose it and confidentiality is gone.
- **The Oracle is a free-tier service and can be unavailable.** The demo handles that explicitly (degraded mode) rather than pretending otherwise, but the headline add genuinely does require it.
- **The local bench is a teaching model, not secure encryption.** Its 48-bit DGHV-inspired modulus is trivially breakable. The unsigned no-wrap interval applies to this local model, not to TFHE's parameters or security.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-blind-oracle

## What It Is

Blind Oracle is a browser-to-server demonstration of **Fully Homomorphic Encryption** using [TFHE-rs](https://github.com/zama-ai/tfhe-rs) and programmable bootstrapping (PBS) over encrypted `FheUint8` values. An `FheUint8` is radix-decomposed into shortint blocks and each block operation runs a PBS; _gate_ bootstrapping is the term for TFHE's boolean API, which this demo does not use. The client encrypts two inputs, the server performs homomorphic addition, and the client decrypts the encrypted result locally. This solves the problem of outsourcing computation while keeping plaintext hidden from the compute provider. The security model is asymmetric homomorphic encryption (public evaluation key on the server, secret decryption key kept client-side), with post-quantum lattice-based foundations through TFHE.

### Why one step runs off-device

Every crypto-lab demo is browser-only, and this one is the exception in exactly one place: the homomorphic **add** runs on a small remote service. That is not a shortcut. Zama's browser (WASM) build of TFHE-rs exposes key generation, encryption, decryption and serialization — and no evaluation operations at all: there is no `add`, `mul` or any other homomorphic method on `FheUint8` in the bundled `tfhe.d.ts`, and `set_server_key` has nothing to apply. The evaluation therefore has to happen where the TFHE-rs evaluation API exists. That split is also, conveniently, the real FHE deployment shape: a client that holds the secret key, and a compute provider that holds only an evaluation key.

Two things follow, and the demo now does both:

- **A remote dependency must degrade, not dead-end.** If the Oracle is asleep, redeployed, or gone for good, the page offers _Continue without the Oracle_ and keeps everything local working — key generation, encryption, the ciphertext inspector, and the local multiply bench — with a banner naming exactly which one step is unavailable.
- **A multiplication that is only described is not demonstrated.** The **local multiply bench** performs real homomorphic multiplications in the tab, on a second (deliberately tiny) scheme, and lets you keep going until the noise budget runs out.

### The local multiply bench

`src/toyFhe.ts` implements a DGHV-inspired (van Dijk–Gentry–Halevi–Vaikuntanathan, 2010) unsigned, base-256 teaching model: `Enc(m) = m + 256r + qp`, `Dec(c) = (c mod p) mod 256`. Addition adds the tracked noise term; multiplication multiplies it. The decoder reduces into `[0,p)`, so the exact first no-wrap interval is `0 ≤ noise < p`, including the entire interval between `p/2` and `p`. The table displays bit lengths, while the verdict checks exact integers; equal bit lengths alone do not establish whether noise is below `p`. With the default parameters, hundreds of additions stay inside this interval while the **third** multiplication crosses it. Each step reports actual decryption against the expected plaintext byte.

**Toy scale, stated on the page and here:** the original paper's security analysis does not apply to this tiny 48-bit adaptation. This is not secure encryption and must never be used as such. [DGHV 2010, §2](https://www.uvm.edu/~cvincen1/files/teaching/pcmi/DGHV2010.pdf) defines centered residues in `(-p/2,p/2]`; its `p/2` bound belongs to that decoder, not this unsigned byte model. At `noise = p` the first wrap changes the decoded byte. Beyond the no-wrap interval, particular wrap counts can preserve the byte (for example, 256 wraps because `p` is odd), but an observed match does not restore a general correctness guarantee. The bench demonstrates local noise growth and wrapping; it does not reproduce TFHE's parameters or implement programmable bootstrapping.

Verification includes fixed-key controls at `floor(p/2)`, `p-1`, `p`, `p+1`, negative noise and a matching byte after 256 wraps. A production-browser control runs the actual bench with scoped toy randomness after real TFHE key generation: 128 additions and two multiplications reach noise `129 × 8192³` between `p/2` and `p`; the next multiplication wraps and decodes to a demonstrably different byte. The backend compute endpoint is mocked in browser CI, so those controls do not establish remote-service availability or correct remote evaluation.

Beyond showing that the server's evaluation key cannot decrypt, the demo now makes the _mechanism_ visible: a side-by-side **plaintext world vs ciphertext world** panel runs both computations at once so the homomorphic correspondence `Enc(a) ⊞ Enc(b) → decrypt = a + b` is shown rather than asserted; **value-dependent ciphertext fingerprints** plus a **Re-encrypt same values** control demonstrate that TFHE encryption is probabilistic (same number, different ciphertext, still-correct sum); a **schematic wire** animates the actual payloads (`ct_a`, `ct_b`, `serverKey`, `ct_result`) crossing the trust boundary while the secret key stays pinned client-side; and a short **gate-bootstrapping / noise-budget** explainer plus an honest cost framing replace the earlier "unlimited computation depth" over-claim.

## When to Use It

- FHE is the right technique when arithmetic on sensitive values has to run on a server you do not trust with the plaintext, because with TFHE-rs the server computes directly on ciphertexts and only the key holder can decrypt the result.
- It suits privacy-preserving analytics, because the inputs sent to the server and the results it returns stay encrypted end to end.
- It suits multi-tenant compute where the provider should evaluate but never read, because the server key enables evaluation but not plaintext recovery.
- The Oracle behind this demo is for demonstration only and should never receive real sensitive values.
- Do not use it for low-latency, high-throughput production paths where plaintext processing is acceptable because bootstrapping and large ciphertexts add substantial performance overhead.
- Do NOT treat this as a production cryptographic service — it is a teaching demo with no authentication, rate limiting, or key rotation.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-blind-oracle](https://systemslibrarian.github.io/crypto-lab-blind-oracle/)**

Watch a server add two encrypted numbers: it holds an evaluation key that cannot decrypt, while your browser holds the decryption key and keeps the result verdict local. Enter two secret values in the 0–255 range, encrypt and transmit them, and trigger homomorphic addition on the oracle. The UI shows ciphertext previews with value-dependent fingerprints, a schematic of the payloads crossing the wire, the parallel plaintext-vs-ciphertext tracks that fill in as you compute, a gate-bootstrapping/noise explainer, response time (the price of one homomorphic add), the oracle log, and a modal showing exactly what the oracle received — without plaintext access. Below that, the **local multiply bench** does real homomorphic multiplications in your browser with no oracle at all, until the noise budget runs out. Controls: **SECRET VALUE A**, **SECRET VALUE B**, **ENCRYPT & TRANSMIT**, **RE-ENCRYPT SAME VALUES** (fresh randomness, different ciphertext), **COMPUTE (FHE ADD)**, **MULTIPLY — WHY SLOWER?** (explains the operation/cost tradeoff, and links to the local bench that performs one), **WHAT THE ORACLE SAW**, and **RESET**.

> First load generates an FHE key pair in your browser (~10–15s) — a boot overlay shows progress. On the free-tier backend, the oracle may also take a moment to wake from cold start.

Backend API source: <https://github.com/systemslibrarian/blind-oracle-api>

## What Can Go Wrong

- **Performance overhead:** FHE ciphertexts are large and bootstrapping is slow, so throughput and latency are far worse than plaintext computation.
- **Limited operations:** practical FHE supports a constrained set of operations and bit-widths (here, addition over `FheUint8`); arbitrary programs are expensive or infeasible.
- **No result integrity:** homomorphic evaluation hides inputs but does not by itself prove the server computed the right function — a malicious server could return a wrong-but-valid ciphertext.
- **Malicious-server feedback oracle:** a server can alter returned ciphertexts and learn from a client that reports decryption errors. Chaturvedi et al. demonstrated full key recovery against TFHE/FHEW under repeated client feedback, which does not demonstrate a break of this demo. Blind Oracle compares the result in the browser and sends neither the plaintext nor its match/mismatch verdict back to the server. This closes that feedback path in the demonstrated flow, but does not establish side-channel resistance on the client. See the [original attack (ePrint 2022/1563)](https://eprint.iacr.org/2022/1563) and the [2025 survey (ePrint 2025/867)](https://eprint.iacr.org/2025/867).
- **Metadata still leaks:** request timing, ciphertext sizes, and access patterns remain visible to the server even though plaintext does not.
- **Client-side key management:** security depends entirely on the client key never leaking — lose it and the data is unrecoverable, expose it and confidentiality is gone.
- **The Oracle is a free-tier service and can be unavailable.** The demo handles that explicitly (degraded mode) rather than pretending otherwise, but the headline add genuinely does require it.
- **The local bench is a teaching model, not secure encryption.** Its 48-bit DGHV-inspired modulus is trivially breakable. The unsigned no-wrap interval applies to this local model, not to TFHE's parameters or security.

## Real-World Usage

- FHE targets privacy-preserving cloud computation, where a provider processes ciphertext without a decryption key; application-level feedback and side channels still require separate controls.
- Use cases include encrypted machine-learning inference and private analytics over sensitive records.
- Private database and set queries can be served without revealing the query or contents to the server.
- TFHE-rs (Zama) is an actively developed library bringing FHE to practical experimentation, though real deployments remain early and specialized.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-blind-oracle
cd crypto-lab-blind-oracle
npm install
npm run dev
`​``

In development, `/api` is proxied to the hosted backend via Vite (see `vite.config.ts`), so the demo works out of the box. To point at a different backend, set `VITE_API_URL` (for example in `.env.development`). TFHE-rs requires `SharedArrayBuffer`, which needs a cross-origin-isolated context; the bundled `coi-serviceworker` sets the required COOP/COEP headers automatically on GitHub Pages and `vite dev`.

## Related Demos

- [crypto-lab-ckks-lab](https://systemslibrarian.github.io/crypto-lab-ckks-lab/) — CKKS approximate FHE for encrypted inference.
- [crypto-lab-fhe-arena](https://systemslibrarian.github.io/crypto-lab-fhe-arena/) — BGV/BFV with noise budget and SIMD batching.
- [crypto-lab-paillier-gate](https://systemslibrarian.github.io/crypto-lab-paillier-gate/) — additively homomorphic encryption for private aggregation.
- [crypto-lab-elgamal-plain](https://systemslibrarian.github.io/crypto-lab-elgamal-plain/) — ElGamal homomorphism and re-randomization.

## How It Works

`​``
┌──────────────────────────┐         encrypted wire          ┌──────────────────────────┐
│        YOUR BROWSER       │   ── ct_a, ct_b, serverKey ──▶  │       THE BLIND ORACLE     │
│                          │                                  │                          │
│  client key (secret) ◀── never leaves the browser          │  server key (evaluation)  │
│  encrypt a, b → ct       │                                  │  ct_result = ct_a ⊞ ct_b  │
│  decrypt ct_result → sum │   ◀──────── ct_result ───────    │  plaintext never accessed │
└──────────────────────────┘                                  └──────────────────────────┘
`​``

1. **Key generation** — the browser builds a TFHE config and generates a client key (secret) plus a compressed server key (evaluation only).
2. **Encrypt** — values `a` and `b` are encrypted to `FheUint8` ciphertexts; only ciphertext (and the public server key) crosses the wire.
3. **Compute** — the server runs `ct_a + ct_b` homomorphically with a programmable bootstrap on every block operation, and returns `ct_result`.
4. **Decrypt** — the browser decrypts `ct_result` with the client key. The server never sees a plaintext.

### Source layout

| File                  | Responsibility                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/main.ts`         | UI wiring, app state transitions, boot overlay, event handlers                                                                                                |
| `src/clientFhe.ts`    | TFHE-rs WASM: key generation, encryption, decryption                                                                                                          |
| `src/toyFhe.ts`       | Toy DGHV scheme powering the local multiply bench: encrypt/add/multiply/decrypt plus exact noise-budget tracking (unit-tested)                                |
| `src/apiClient.ts`    | Typed fetch client for the oracle, with timeouts and error taxonomy                                                                                           |
| `src/encoding.ts`     | Pure base64/hex helpers, FheUint8 range validation, and a non-cryptographic ciphertext fingerprint used only to render value-dependent swatches (unit-tested) |
| `src/stateMachine.ts` | Minimal observable state machine driving the UI (unit-tested)                                                                                                 |
| `src/animations.ts`   | Canvas "wire" effect and count-up, both reduced-motion aware                                                                                                  |
| `src/oracleLog.ts`    | Append-only activity log rendering                                                                                                                            |

## Scripts

| Script                 | What it does                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server                                                                          |
| `npm run build`        | Type-check and build for production                                                                |
| `npm run preview`      | Serve the production build locally                                                                 |
| `npm test`             | Run the Vitest unit suite                                                                          |
| `npm run test:watch`   | Run tests in watch mode                                                                            |
| `npm run typecheck`    | Type-check without emitting                                                                        |
| `npm run format`       | Format the codebase with Prettier                                                                  |
| `npm run format:check` | Verify formatting (used in CI)                                                                     |
| `npm run test:a11y`    | Playwright: axe WCAG A/AA scans plus the functional Oracle, degraded-mode and multiply-bench specs |
| `npm run deploy`       | Request the existing gated main-branch publishing workflow                                         |

## Security Notes

- **The client key never leaves the browser.** Only the _compressed server key_ (an evaluation key that cannot decrypt) and ciphertexts are transmitted.
- **Original plaintext values are never sent.** They are held in memory client-side purely so the UI can confirm the decrypted sum.
- **The local comparison is not sent back.** Neither a decryption error nor the match/mismatch verdict is reported to the Oracle. A production client must preserve this boundary when handling malicious results.
- The client asserts the oracle's `plaintextAccessed === false` policy flag on every response and surfaces an error otherwise.
- This is a teaching demo. It does not implement authentication, rate limiting, or key rotation, and should not be treated as a production cryptographic service.

## Tech Stack

TypeScript · Vite · [TFHE-rs](https://github.com/zama-ai/tfhe-rs) (Zama) WebAssembly · Vitest · Prettier · GitHub Actions · GitHub Pages.

## License

[MIT](./LICENSE)

---

_Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite._

_"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31_

```

</details>

---

## CKKS Lab

- **slug**: `crypto-lab-ckks-lab`
- **repo**: https://github.com/systemslibrarian/crypto-lab-ckks-lab
- **live**: https://systemslibrarian.github.io/crypto-lab-ckks-lab/
- **commit_sha**: `aa9d453b0913c0987670388713625e2783d89d60` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HOMOMORPHIC  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, mutations, verification

**Name (H1)**: CKKS  — _read from src/main.ts_

**Subtitle**: FHE · approximate real-number arithmetic  — _read from src/main.ts_

**Description**: Encrypt real-number vectors, then homomorphically add, multiply, rescale, and run a 2-layer neural network on the ciphertexts — decrypting only the final approximate result.  — _read from src/main.ts_

**Why it matters**: CKKS is the practical path to encrypted ML inference: a cloud can score private medical, financial, or genomic data without ever decrypting it. Its bounded approximation is what makes real-valued FHE fast enough to ship.  — _read from src/main.ts_

**Card copy**: Run bounded CKKS teaching operations for approximate arithmetic, inference, and rescaling; compare FHE schemes and explore a conceptual client-feedback privacy boundary.

**Chips**: CKKS · RLWE · Approximate FHE · Encrypted Inference

**Implements**: CKKS `src/toyCkks.ts:209`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Cheon attack `src/toyCkks.ts:64`, NTT `src/toyCkks.ts:37`, Ring-LWE `src/main.ts:933`

**References**: BFV, BGV, Cheon attack, ElGamal, LWE, NTT, Paillier, Private information retrieval, Ring-LWE, TFHE

**Standards body**: _none_

**Implementation**: local symmetric approximate-RLWE teaching engine

**Spec citations, exactly as written**:

- `ASIACRYPT 2017` — first seen README.md:5 (3×)
- `ePrint 2026/2490` — first seen README.md:74 (2×)
- `eprint.iacr.org/2016/421` — first seen src/main.ts:793 (2×)
- `eprint.iacr.org/2026/2490` — first seen README.md:74 (2×)
- `EUROCRYPT 2021` — first seen src/main.ts:443 (2×)

**Stated limitations (page)**:

- _(disclaimer, src/main.ts)_ ⚠ This is an educational toy implementation with n=8. 128-bit security is set by the (n, log q) pair — the HE Standard permits n=4096 only up to log q ≤ 109 — so production CKKS uses n ≥ 8192 to afford a real modulus chain. Do not use this code for any real cryptographic purpose.

**README — What Can Go Wrong**:

```text
- CKKS is *approximate*: every ciphertext carries noise, so results are never exact. Using it where an exact answer is required (financial totals, equality checks, cryptographic values) silently yields wrong results.
- Each homomorphic multiplication consumes a level in the modulus chain; running out of levels without bootstrapping corrupts the result, so the multiplicative depth must be planned in advance.
- Scale and rescaling management is error-prone: forgetting to rescale, or combining ciphertexts at mismatched scales, produces meaningless plaintext on decryption.
- Parameter choice (ring degree, modulus chain, scale) sets both the security level and the available compute budget — too small a ring or too large a modulus can break the underlying RLWE security.
- Approximate-decryption leakage (the IND-CPA^D class of attacks): handing raw decrypted CKKS results to an untrusted party can leak information about the secret key unless the decryption output is noise-flooded.

- **Validity-response leakage:** [Bian et al., ePrint 2026/2490 (15 October 2026)](https://eprint.iacr.org/2026/2490) report key recovery in CKKS deployments combining public coefficient-to-slot (C2S) evaluation keys with an observable client one-bit validity response. Their attack is conditional on this deployment surface and does not break RLWE or CKKS IND-CPA security. Keeping raw decrypted values private alone does not address this separate feedback channel; protocols must assess what client reactions reveal to an untrusted evaluator. This symmetric toy engine has no public encryption key or C2S evaluation layer and does not reproduce the attack. Noise flooding for approximate-decryption leakage is not established here as a remedy for this reaction attack.

  The deployment caveat now includes a **conceptual feedback interaction**: select a hidden ternary coefficient, make the public-key and C2S capabilities available or unavailable, choose whether the client's validity bit is visible, and try abstract support/positive-sign probes. With all preconditions present, each modeled response filters the attacker's candidate set; keeping it private removes that particular observation. The decisions reflect the paper's two-phase support/sign logic, but the panel constructs no CKKS query, proves no noise bound, and makes no key-recovery or security claim about this toy engine. The learner-only audit is separate from the attacker view.
```

**Claims tested** (e2e/claims.spec.ts, 15 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:26
    - :26 `expect` expected _no expected value_ _(none)_
- `exhibit 1: the round trip returns the number, and reports its own approximation gap` — e2e/claims.spec.ts:36
    - :43 `expect` expected _no expected value_ _(none)_
    - :44 `expect` expected _no expected value_ _(none)_
    - :50 `expect` expected _no expected value_ _(none)_
    - :51 `expect` expected _no expected value_ _(none)_
    - :52 `expect` expected _no expected value_ _(none)_
    - :53 `expect` expected _no expected value_ _(none)_
    - :59 `expect` expected _no expected value_ _(none)_
    - :64 `toHaveText` expected `'Enter a single real number (e.g. 3.14).'` _(literal)_
    - :65 `toHaveCount` expected `0` _(literal)_
- `exhibit 2: the encoding visualizer adds up — noisy = encoded + delta, and the caption bounds it` — e2e/claims.spec.ts:70
    - :81 `toEqual` expected `['s0=1.5', 's1=2.7', 's2=3.2', 's3=0.8']` _(expression)_
    - :82 `toHaveLength` expected `8` _(literal)_
    - :83 `toHaveLength` expected `8` _(literal)_
    - :84 `toHaveLength` expected `8` _(literal)_
    - :88 `toBe` expected `noisy[i]! - coeffs[i]!` _(expression)_
    - :92 `toHaveCount` expected `changed` _(expression)_
    - :93 `expect` expected _no expected value_ _(none)_
    - :99 `toBe` expected `Math.max(...delta.map(Math.abs))` _(expression)_
    - :100 `expect` expected _no expected value_ _(none)_
    - :101 `expect` expected _no expected value_ _(none)_
    - :105 `expect` expected _no expected value_ _(none)_
    - :106 `expect` expected _no expected value_ _(none)_
- `exhibit 2: adding ciphertexts adds the slots, and the SIMD lanes match the decryption` — e2e/claims.spec.ts:109
    - :124 `toHaveLength` expected `4` _(literal)_
    - :125 `toBeCloseTo` expected `a[i]! + b[i]!, 6` _(expression)_
    - :128 `expect` expected _no expected value_ _(none)_
    - :130 `toEqual` expected `expected` _(expression)_
    - :135 `toHaveLength` expected `4` _(literal)_
    - :137 `expect` expected _no expected value_ _(none)_
    - :138 `toBe` expected `0` _(literal)_
    - :144 `toHaveLength` expected `4` _(literal)_
    - :149 `expect` expected _no expected value_ _(none)_
    - :150 `expect` expected _no expected value_ _(none)_
    - :151 `expect` expected _no expected value_ _(none)_
    - :153 `toBe` expected `Number(actual[i]!.toFixed(4))` _(expression)_
- `exhibit 2: nudging one ciphertext coefficient really moves the decrypted slot` — e2e/claims.spec.ts:157
    - :176 `expect` expected _no expected value_ _(none)_
    - :179 `toBe` expected `Number(actual[slot]!.toFixed(4))` _(expression)_
    - :180 `toBe` expected `before` _(expression)_
    - :181 `expect` expected _no expected value_ _(none)_
    - :182 `expect` expected _no expected value_ _(none)_
    - :185 `toContainText` expected `'(tampered)'` _(literal)_
- `exhibit 2: the two ciphertext views tell the same truth in different clothes` — e2e/claims.spec.ts:188
    - :199 `toHaveLength` expected `8` _(literal)_
    - :200 `toHaveLength` expected `8` _(literal)_
    - :201 `toHaveLength` expected `8` _(literal)_
    - :202 `toHaveLength` expected `8` _(literal)_
    - :207 `expect` expected _no expected value_ _(none)_
    - :212 `expect` expected _no expected value_ _(none)_
    - :213 `expect` expected _no expected value_ _(none)_
    - :215 `expect` expected _no expected value_ _(none)_
    - :219 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :220 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :222 `expect` expected _no expected value_ _(none)_
    - :225 `toHaveLength` expected `8` _(literal)_
    - :227 `expect` expected _no expected value_ _(none)_
- `exhibit 2: every step refuses to run before its prerequisite` — e2e/claims.spec.ts:230
    - :233 `toHaveText` expected `'Encrypt A and B first.'` _(literal)_
    - :235 `toHaveText` expected `'Add ciphertexts first.'` _(literal)_
    - :237 `toHaveText` expected `'Add both ciphertexts first, then tamper.'` _(literal)_
    - :241 `toHaveText` expected `'Encrypt A and B first.'` _(literal)_
- `exhibit 3: the multiply → relinearize → rescale pipeline moves scale, degree and level together` — e2e/claims.spec.ts:246
    - :259 `toHaveText` expected `'2^10 (Δ)'` _(literal)_
    - :260 `toHaveText` expected `'3'` _(literal)_
    - :261 `toHaveText` expected `'3 mult'` _(literal)_
    - :262 `toHaveText` expected `'Fresh ciphertext'` _(literal)_
    - :266 `toEqual` expected `['L32^50', 'L22^40', 'L12^30', 'L02^20']` _(expression)_
    - :267 `toEqual` expected `['L32^50']` _(expression)_
    - :268 `toHaveLength` expected `0` _(literal)_
    - :269 `toHaveClass` expected `/show/` _(regex)_
    - :270 `toHaveAttribute` expected `'style', 'width: 50%;'` _(expression)_
    - :274 `toHaveText` expected `'2^20 (Δ²)'` _(literal)_
    - :275 `toHaveText` expected `'Multiplied → Δ², degree 2 (c0,c1,c2)'` _(literal)_
    - :276 `toHaveClass` expected `/show/` _(regex)_
    - :277 `toHaveAttribute` expected `'style', 'width: 100%;'` _(expression)_
    - :279 `toHaveText` expected `'Relinearized → back to (c0,c1); rescale needed', { timeout: 5000 }` _(expression)_
    - :280 `toHaveClass` expected `/show/` _(regex)_
    - :281 `toHaveText` expected `'2^20 (Δ²)'` _(literal)_
    - :282 `toHaveText` expected `'3'` _(literal)_
    - :286 `toHaveText` expected `'2^10 (Δ)'` _(literal)_
    - :287 `toHaveText` expected `'2'` _(literal)_
    - :288 `toHaveText` expected `'2 mult'` _(literal)_
    - :289 `toContainText` expected `'drop modulus L3 from the chain'` _(literal)_
    - :290 `toContainText` expected `'Level 3 → 2'` _(literal)_
    - :294 `toEqual` expected `['L22^40']` _(expression)_
    - :295 `toEqual` expected `['L32^50']` _(expression)_
    - :302 `toEqual` expected `[3, 8.1]` _(expression)_
    - :304 `expect` expected _no expected value_ _(none)_
- `exhibit 3: the modulus chain drains one level per rescale, and the steps enforce their order` — e2e/claims.spec.ts:308
    - :311 `toHaveText` expected `'Encrypt A and B first.'` _(literal)_
    - :313 `toHaveText` expected `'Run multiply first.'` _(literal)_
    - :315 `toHaveText` expected `'Run multiply then rescale first.'` _(literal)_
    - :319 `toHaveText` expected _no expected value_ _(none)_
    - :326 `toHaveText` expected `expectedLevel` _(expression)_
    - :330 `toHaveText` expected `'0'` _(literal)_
    - :332 `toHaveText` expected `'exhausted'` _(literal)_
    - :333 `toHaveText` expected `'Modulus exhausted — bootstrap to continue'` _(literal)_
    - :334 `toHaveClass` expected `/is-exhausted/` _(regex)_
    - :338 `toHaveLength` expected `3` _(literal)_
    - :339 `toEqual` expected `['L02^20']` _(expression)_
- `exhibit 4: the encrypted forward pass agrees with the plaintext one` — e2e/claims.spec.ts:344
    - :355 `toHaveClass` expected `/enc/` _(regex)_
    - :356 `toContainText` expected `'The plaintext values never leave the client'` _(literal)_
    - :359 `toContainText` expected `'every operation below ran on ciphertext'` _(literal)_
    - :361 `toHaveText` expected `'🔒'` _(literal)_
    - :371 `toBe` expected `plainOut` _(expression)_
    - :372 `toBe` expected `plainCls` _(expression)_
    - :373 `toBe` expected `refCls` _(expression)_
    - :374 `expect` expected _no expected value_ _(none)_
    - :375 `toBe` expected `ref` _(expression)_
    - :377 `toBe` expected `dec > 0.5 ? 1 : 0` _(expression)_
    - :379 `toHaveText` expected `dec.toFixed(2)` _(expression)_
- `exhibit 4: the activation gap on the curve matches the activation table` — e2e/claims.spec.ts:382
    - :391 `toHaveLength` expected `6` _(literal)_
    - :394 `toBe` expected `Math.max(0, x!)` _(expression)_
    - :395 `expect` expected _no expected value_ _(none)_
    - :404 `toBeCloseTo` expected `0.5, 4` _(expression)_
    - :410 `toHaveLength` expected `2` _(literal)_
    - :414 `expect` expected _no expected value_ _(none)_
    - :417 `toHaveCount` expected `2` _(literal)_
    - :418 `toHaveCount` expected `2` _(literal)_
- `exhibit 4: inference refuses to run out of order, and changing an input resets it` — e2e/claims.spec.ts:421
    - :425 `toHaveText` expected `'Encrypt inputs first.'` _(literal)_
    - :427 `toHaveText` expected `'Run encrypted inference first.'` _(literal)_
    - :431 `toHaveText` expected `''` _(literal)_
    - :436 `toHaveText` expected `'0.7'` _(literal)_
    - :437 `toHaveText` expected `''` _(literal)_
    - :438 `toHaveCount` expected `0` _(literal)_
    - :439 `toHaveCount` expected `0` _(literal)_
- `exhibit 5: the precision meter is computed from the real decrypt error` — e2e/claims.spec.ts:444
    - :461 `toBeCloseTo` expected `Math.PI, 12` _(expression)_
    - :462 `expect` expected _no expected value_ _(none)_
    - :466 `toBe` expected `14` _(literal)_
    - :467 `toBe` expected `m.digits` _(expression)_
    - :468 `toBe` expected `0` _(literal)_
    - :470 `toBe` expected `(Math.abs(back - pi) / Math.abs(pi)).toExponential(1)` _(expression)_
    - :472 `toBe` expected `Math.floor(-Math.log10(Math.abs(back - pi) / Math.abs(pi)))` _(expression)_
    - :473 `toBe` expected `m.digits >= 8 ? 'good' : m.digits >= 4 ? 'warn' : 'bad'` _(expression)_
    - :479 `toBeCloseTo` expected `pi + 0.125, 10` _(expression)_
    - :480 `toBe` expected `3` _(literal)_
    - :481 `expect` expected _no expected value_ _(none)_
    - :483 `toBe` expected `1` _(literal)_
    - :484 `toBe` expected `m.digits` _(expression)_
- `exhibit 5: the depth budget is a wall — the demo refuses rather than printing garbage` — e2e/claims.spec.ts:487
    - :495 `expect` expected _no expected value_ _(none)_
    - :498 `toBe` expected `'3'` _(literal)_
    - :503 `toBe` expected `true` _(expression)_
    - :504 `expect` expected _no expected value_ _(none)_
    - :505 `expect` expected _no expected value_ _(none)_
    - :506 `expect` expected _no expected value_ _(none)_
    - :507 `expect` expected _no expected value_ _(none)_
    - :509 `toBe` expected `3` _(literal)_
    - :510 `toBe` expected `'3'` _(literal)_
    - :515 `expect` expected _no expected value_ _(none)_
    - :516 `expect` expected _no expected value_ _(none)_
    - :517 `toBe` expected `'0'` _(literal)_
    - :519 `expect` expected _no expected value_ _(none)_
- `exhibit 5: precision really degrades as operations accumulate` — e2e/claims.spec.ts:522
    - :537 `toBe` expected `Math.max(0, Math.min(14, Math.floor(-Math.log10(rel))))` _(expression)_
    - :540 `toBe` expected `3` _(literal)_
    - :542 `expect` expected _no expected value_ _(none)_
    - :543 `toBe` expected `endDigits` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-ckks-lab

## What It Is

CKKS Lab demonstrates CKKS (Cheon-Kim-Kim-Song, ASIACRYPT 2017) — the Fully Homomorphic Encryption scheme for approximate arithmetic on real numbers. Unlike BGV/BFV which produce exact integer results, CKKS deliberately introduces small approximation errors to enable efficient floating-point arithmetic on encrypted data. A CKKS ciphertext encodes a vector of real numbers (n/2 slots for polynomial degree n) and supports vectorized addition and multiplication directly on ciphertexts. CKKS is the FHE scheme behind encrypted machine learning inference — the ability to evaluate a neural network on encrypted input without the server ever seeing the plaintext data.

The demo is built for a newcomer to follow start-to-finish: it opens with a one-click "encrypt 3.14, get 3.1401 back" round-trip, then makes the scheme's hardest idea — the canonical embedding — watchable by showing 4 real slot values flow into 8 integer polynomial coefficients and then pick up the tiny RLWE noise term. Ciphertexts render as legible centered "signal + noise" coefficients (with a raw-hex toggle), and you can corrupt a single coefficient and watch a decrypted slot drift, proving the encryption is real by interaction rather than by prose. Advanced material (the FHE decision panel, the RLWE foundation, scheme comparisons) is tucked behind "go deeper" reveals so it never blocks the first hands-on success.

## When to Use It

- ✅ Encrypted neural network inference on private user data
- ✅ Encrypted statistics (mean, variance, dot products) on real-valued data
- ✅ Logistic regression and linear model scoring on encrypted inputs
- ✅ Privacy-preserving genomics (continuous-valued statistical tests)
- ❌ Exact integer arithmetic — use BGV or BFV instead
- ❌ Arbitrary boolean logic — use TFHE instead
- ❌ Applications requiring exact results (financial, cryptographic) — CKKS approximation error will silently produce wrong answers
- ❌ Real-time inference on large models — CKKS is significantly slower than plaintext computation (seconds to minutes for production models)
- Do NOT use this implementation in production — it is a teaching demo built to make the mechanics visible, not a hardened or audited FHE library.

## Is the crypto real?

Yes — this is a genuine (toy-parameter) CKKS engine, not a plaintext mock:

- Ciphertexts are real RLWE polynomial pairs `(c0, c1)` in `Z_q[x]/(x^n + 1)`, held as exact `BigInt` coefficients.
- Encoding/decoding uses the actual CKKS canonical embedding (the special complex FFT over the primitive 2n-th roots of `x^n + 1`), which is a ring homomorphism — so homomorphic multiplication is true slot-wise multiplication.
- `add`, `multiply` (tensor product + gadget-decomposition relinearization) and `rescale` all operate on the ciphertext polynomials.
- **Decryption computes `c0 + c1·s (mod q)` and decodes the recovered polynomial.** No displayed "decrypted result" is ever read from a plaintext cache. Corrupting a ciphertext coefficient changes the decrypted output, and decrypting under the wrong secret key yields garbage — both are pinned by unit tests in `test/toyCkks.test.ts`.
- The encrypted neural-network exhibit runs the entire forward pass (weighted sums, a quadratic polynomial activation whose `x²` term is a real ciphertext multiply, and the output layer) on ciphertexts; only the final result is decrypted, client-side.

Two simplifications are worth naming. Encryption is **symmetric** — `encryptVector` builds `c0 = m - a·s + e` straight from the secret key, and there is no public key in the code; deployed CKKS publishes an RLWE encryption of zero as a public key so that anyone can encrypt. And the modulus chain is powers of two (`2^50 … 2^20`), not the NTT-friendly primes an RNS implementation would use; nothing here depends on `q` being prime, since all arithmetic is plain `BigInt` modular reduction.

The one thing that is deliberately **not** real is security: `n = 8` is far too small to hide anything. Security is set by the (ring degree, ciphertext modulus) *pair*, not by `n` alone — the [Homomorphic Encryption Standard](https://homomorphicencryption.org/standard/) v1.1 (Albrecht et al., 2018) reaches 128-bit classical security at `n = 4096` only for `log q ≤ 109` (ternary secret), rising to `log q ≤ 218` at `n = 8192`. Since a useful CKKS modulus chain needs far more than 109 bits, `n ≥ 8192` is the practical rule of thumb here, not an absolute floor. Toy timings shown in the UI are illustrative, not measured benchmarks.

## Tests

`​``bash
npm test        # vitest crypto unit tests (round-trip, add/multiply/rescale, tamper-detection, wrong-key, encrypted NN)
npm run test:a11y   # Playwright: rendered-claims gate + axe WCAG gate (dark + light)
`​``

`e2e/claims.spec.ts` drives the production build in Chromium and re-derives what the six
exhibits print. The encoding visualizer's three rows must satisfy `noisy = encoded + delta`
coefficient by coefficient, with the caption's ±bound equal to the largest delta shown; the
SIMD lanes must quote the same decrypted values the summary above them prints; nudging
coefficient 0 of `c0` by +2Δ must move the decrypted slot by exactly +2, starting from the
value the previous decryption reported; scale, degree, level and the modulus-chain chips must
move together through multiply → relinearize → rescale; the encrypted network's class must
equal the plaintext network's; and the precision meter's lit segments must equal its own digit
count, itself equal to the base-10 magnitude of the real decrypt error. Every "run this before
that" refusal and the level-0 depth wall are driven to their stated end states.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-ckks-lab](https://systemslibrarian.github.io/crypto-lab-ckks-lab/)**

Six exhibits:

1. **Encrypt a number, compute on it, get it back** — a one-click encrypt→decrypt round-trip that shows the deliberate approximation gap up front; the "why approximate," FHE-family, and RLWE detail sit in collapsible "go deeper" panels.
2. **Encode, encrypt, add, decrypt** — an encoding visualizer watches 4 real slots become 8 integer polynomial coefficients (the canonical embedding) and then gain the RLWE noise term; each ciphertext is shown four ways — the ideal encoded signal, the `c0 + c1·s` polynomial decryption actually recovers, and the two stored halves `c0`/`c1`, whose coefficients are spread across the whole of (−q/2, q/2] and reveal nothing on their own (raw-hex toggle available). A click can corrupt a coefficient and drift a decrypted slot, and all four SIMD lanes update together under one "one ciphertext" bracket.
3. **Homomorphic multiplication and rescaling** — a staged multiply → relinearize → rescale pipeline: the scale bar doubles to Δ² then halves back, the `(c0,c1,c2)` degree-2 ciphertext collapses back to `(c0,c1)`, and the modulus chain drops a prime with the current level highlighted (depth-left = level number = multiplications remaining).
4. **Encrypted neural network inference** — a 2-layer network runs end-to-end on encrypted inputs, with the ReLU-vs-polynomial-activation gap plotted as an overlaid curve and each hidden pre-activation marked so the approximation cost is tied to the encrypted-vs-plaintext output difference.
5. **Precision, scale, and error accumulation** — a segmented precision meter whose lit segments are computed from the *actual* decrypt error, degrading live as you add and multiply. The toy chain's three multiply+rescale cycles are a hard wall, not a fade: at level 0 the demo refuses a further multiply and explains that the product would wrap modulo q rather than merely lose precision.
6. **The FHE trilogy** — the full TFHE + BGV/BFV + CKKS comparison with a decision tree and library guide.

## What Can Go Wrong

- CKKS is *approximate*: every ciphertext carries noise, so results are never exact. Using it where an exact answer is required (financial totals, equality checks, cryptographic values) silently yields wrong results.
- Each homomorphic multiplication consumes a level in the modulus chain; running out of levels without bootstrapping corrupts the result, so the multiplicative depth must be planned in advance.
- Scale and rescaling management is error-prone: forgetting to rescale, or combining ciphertexts at mismatched scales, produces meaningless plaintext on decryption.
- Parameter choice (ring degree, modulus chain, scale) sets both the security level and the available compute budget — too small a ring or too large a modulus can break the underlying RLWE security.
- Approximate-decryption leakage (the IND-CPA^D class of attacks): handing raw decrypted CKKS results to an untrusted party can leak information about the secret key unless the decryption output is noise-flooded.

- **Validity-response leakage:** [Bian et al., ePrint 2026/2490 (15 October 2026)](https://eprint.iacr.org/2026/2490) report key recovery in CKKS deployments combining public coefficient-to-slot (C2S) evaluation keys with an observable client one-bit validity response. Their attack is conditional on this deployment surface and does not break RLWE or CKKS IND-CPA security. Keeping raw decrypted values private alone does not address this separate feedback channel; protocols must assess what client reactions reveal to an untrusted evaluator. This symmetric toy engine has no public encryption key or C2S evaluation layer and does not reproduce the attack. Noise flooding for approximate-decryption leakage is not established here as a remedy for this reaction attack.

  The deployment caveat now includes a **conceptual feedback interaction**: select a hidden ternary coefficient, make the public-key and C2S capabilities available or unavailable, choose whether the client's validity bit is visible, and try abstract support/positive-sign probes. With all preconditions present, each modeled response filters the attacker's candidate set; keeping it private removes that particular observation. The decisions reflect the paper's two-phase support/sign logic, but the panel constructs no CKKS query, proves no noise bound, and makes no key-recovery or security claim about this toy engine. The learner-only audit is separate from the attacker view.

## Real-World Usage

- Privacy-preserving machine-learning inference, where a model runs on encrypted user inputs without the server seeing the plaintext (the canonical CKKS use case).
- Encrypted analytics and statistics on real-valued data (means, variances, dot products) for outsourced or multi-party computation.
- Privacy-preserving genomics and medical computation, where continuous-valued statistical tests run over encrypted records.
- Implemented in major FHE libraries such as Microsoft SEAL, OpenFHE, HEAAN, and Lattigo, which expose CKKS for production research and deployment.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-ckks-lab
cd crypto-lab-ckks-lab
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-fhe-arena](https://systemslibrarian.github.io/crypto-lab-fhe-arena/) — BGV/BFV exact-integer FHE, the sibling schemes CKKS is compared against.
- [crypto-lab-blind-oracle](https://systemslibrarian.github.io/crypto-lab-blind-oracle/) — TFHE boolean/programmable-bootstrapping FHE, the third member of the FHE trilogy.
- [crypto-lab-paillier-gate](https://systemslibrarian.github.io/crypto-lab-paillier-gate/) — additively homomorphic encryption, a simpler partial-HE primitive.
- [crypto-lab-elgamal-plain](https://systemslibrarian.github.io/crypto-lab-elgamal-plain/) — multiplicatively homomorphic ElGamal with re-randomization.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## FHE Arena

- **slug**: `crypto-lab-fhe-arena`
- **repo**: https://github.com/systemslibrarian/crypto-lab-fhe-arena
- **live**: https://systemslibrarian.github.io/crypto-lab-fhe-arena/
- **commit_sha**: `ce998f6855858ba657fcd7959db1f7618d0d073d` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `62246aaee25ea692d3175354233fa81ebd2bbc11`
- **read_from**: working tree (clean)
- **category**: HOMOMORPHIC  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, mutations, verification

**Name (H1)**: FHE Arena  — _read from src/main.ts_

**Subtitle**: Integer FHE · BFV scheme  — _read from src/main.ts_

**Description**: Encrypt integers, add and multiply them on a blind server, then decrypt via Δ·m + e and watch the noise budget shrink until decryption fails.  — _read from src/main.ts_

**Why it matters**: Homomorphic encryption lets a server compute on data it can never read — the promise behind private cloud, medical, and financial analytics. The noise budget is what makes or breaks it: overflow it and the answer is silently lost.  — _read from src/main.ts_

**Card copy**: Explore toy BFV integer homomorphic encryption with addition, multiplication, a noise-budget visualizer, relinearization, and polynomial-coefficient packing. BGV and production SIMD batching are discussed, not implemented.

**Chips**: Toy BFV · RLWE · Noise Budget · Coefficient Packing

**Implements**: BFV `src/toyFhe.ts:132`

**Attacks shown**: Chosen-plaintext attack `src/main.ts:150`, Ciphertext malleability `README.md:44`

**References**: BGV, CKKS, ElGamal, NTT, Paillier, Private information retrieval, Ring-LWE, TFHE

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `ePrint 2026/2546` — first seen README.md:39 (1×)
- `eprint.iacr.org/2026/2546` — first seen README.md:39 (2×)

**README — What Can Go Wrong**:

```text
- **Decryption-feedback research — 20 October 2026.** Ordinary encryption security (IND-CPA), correct decryption, and security when an adversary learns computation results (IND-CPA-D) are different guarantees. Choe, Kang and Stehlé report attacks on particular BFV/BGV configurations using heuristic correctness assumptions, with experiments in OpenFHE and HElib. Crafted operations can exceed heuristic noise bounds; two attacks recover keys, while a third breaks indistinguishability. Parameter tables and noise estimates alone do not establish security in this feedback model. This browser lab does not reproduce those attacks or establish that its implementation is vulnerable. [Choe, Kang and Stehlé, *New IND-CPA-D Attacks on BFV and BGV*, ePrint 2026/2546](https://eprint.iacr.org/2026/2546), received 19 October and revised 20 October 2026; accepted to ACM CCS 2026. **Demonstrated results; attack-model-conditional.**

- **Noise budget exhaustion.** Every homomorphic operation grows ciphertext noise; exceed the budget and decryption silently returns garbage. Multiplicative depth must be planned before the circuit is built.
- **Wrong scheme for the data.** BGV/BFV are integer schemes. Forcing real-valued or approximate workloads onto them gives poor results — CKKS exists for that, with its own approximation caveats.
- **Insecure parameter selection.** Polynomial degree and modulus must follow the Homomorphic Encryption Standard; ad-hoc parameters can drop below the claimed security level or fail to support the intended depth.
- **No integrity by default.** FHE ciphertexts are malleable by design (that is the whole point), so a malicious server can tamper with results unless you add separate verification. IND-CPA security does not imply CCA security.
- **Bootstrapping cost and timing.** Bootstrapping refreshes noise but is expensive and must run before overflow, not after; treating it as free or as a recovery step after corruption does not work.
```

**Claims tested** (e2e/claims.spec.ts, 26 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:51
    - :51 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:66
    - :66 `toHaveAttribute` expected `'aria-valuenow', String(budget.pct)` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:67
    - :67 `toHaveAttribute` expected `'data-health', budget.health` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:71
    - :71 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:73
    - :73 `toBe` expected `true` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:74
    - :74 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:75
    - :75 `toBe` expected `Number(exactBits.toFixed(1))` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:76
    - :76 `toBe` expected `expectedHealth(exactBits)` _(expression)_
- `exhibit 2 headline verdict is computed from the typed inputs, not canned` — e2e/claims.spec.ts:124
    - :137 `expect` expected _no expected value_ _(none)_
    - :138 `expect` expected _no expected value_ _(none)_
    - :142 `toBe` expected `a` _(expression)_
    - :143 `toBe` expected `b` _(expression)_
    - :146 `toBe` expected `expected` _(expression)_
    - :147 `toBe` expected `expected` _(expression)_
    - :148 `toHaveText` expected `/matches plaintext/` _(regex)_
- `exhibit 2 reveals a Δ·m + e equation whose parts sum to the recovered value` — e2e/claims.spec.ts:152
    - :155 `toBeHidden` expected _no expected value_ _(none)_
    - :157 `toBeVisible` expected _no expected value_ _(none)_
    - :167 `expect` expected _no expected value_ _(none)_
    - :181 `toBe` expected `Math.floor(q / t)` _(expression)_
    - :182 `toBe` expected `Math.floor(delta / 2)` _(expression)_
    - :184 `toBe` expected `(a + b) % t` _(expression)_
    - :186 `toBe` expected `centerLift(m * delta, q)` _(expression)_
    - :188 `toBe` expected `0` _(literal)_
    - :190 `expect` expected _no expected value_ _(none)_
    - :192 `toBe` expected `recovered` _(expression)_
    - :193 `toBe` expected `delta` _(expression)_
    - :194 `toBe` expected `t` _(expression)_
    - :198 `toBe` expected `(((Math.round(recovered / delta) % t) + t) % t)` _(expression)_
    - :200 `toBe` expected `m` _(expression)_
    - :201 `expect` expected _no expected value_ _(none)_
    - :202 `expect` expected _no expected value_ _(none)_
- `exhibit 2 add is measured as cheap: the meter loses under 3 bits` — e2e/claims.spec.ts:205
    - :210 `toBe` expected `100` _(literal)_
    - :211 `toBe` expected `'healthy'` _(literal)_
    - :216 `expect` expected _no expected value_ _(none)_
    - :217 `expect` expected _no expected value_ _(none)_
    - :218 `toBe` expected `'healthy'` _(literal)_
    - :220 `expect` expected _no expected value_ _(none)_
- `exhibit 2 refuses out-of-order steps and says which step is missing` — e2e/claims.spec.ts:223
    - :225 `toBe` expected `'Encrypt both A and B first.'` _(literal)_
    - :226 `toHaveText` expected `'awaiting…'` _(literal)_
    - :229 `toBe` expected `'Add the ciphertexts first.'` _(literal)_
    - :230 `toBeHidden` expected _no expected value_ _(none)_
    - :235 `toBe` expected `'Encrypt both A and B first.'` _(literal)_
    - :236 `toBeHidden` expected _no expected value_ _(none)_
- `randomized encryption demo: two encryptions of one value differ yet both decrypt to it` — e2e/claims.spec.ts:239
    - :245 `toMatch` expected `/^c0:/` _(regex)_
    - :246 `toMatch` expected `/^c0:/` _(regex)_
    - :247 `toBe` expected `second` _(expression)_
    - :250 `expect` expected _no expected value_ _(none)_
    - :251 `expect` expected _no expected value_ _(none)_
    - :254 `toEqual` expected `[11, 11]` _(expression)_
    - :255 `toHaveText` expected `/matches plaintext/` _(regex)_
- `exhibit 3 measures add as cheap and multiply as expensive` — e2e/claims.spec.ts:260
    - :263 `toBe` expected `100` _(literal)_
    - :274 `expect` expected _no expected value_ _(none)_
    - :275 `expect` expected _no expected value_ _(none)_
    - :276 `expect` expected _no expected value_ _(none)_
    - :277 `toBe` expected `'Sequence: add → mul'` _(literal)_
- `exhibit 3 table, meter and chart all report the same measurements` — e2e/claims.spec.ts:280
    - :289 `toEqual` expected `['add', 'add', 'mul']` _(expression)_
    - :290 `toHaveLength` expected `ops.length + 1` _(expression)_
    - :291 `toBe` expected `i` _(expression)_
    - :292 `expect` expected _no expected value_ _(none)_
    - :300 `expect` expected _no expected value_ _(none)_
    - :302 `toBe` expected `row.bits > 0` _(expression)_
    - :307 `expect` expected _no expected value_ _(none)_
    - :308 `expect` expected _no expected value_ _(none)_
    - :313 `toBeCloseTo` expected `rows[rows.length - 1].bits, 1` _(expression)_
    - :317 `toHaveLength` expected `rows.length` _(expression)_
    - :319 `expect` expected _no expected value_ _(none)_
    - :320 `expect` expected _no expected value_ _(none)_
    - :321 `expect` expected _no expected value_ _(none)_
    - :324 `expect` expected _no expected value_ _(none)_
    - :325 `expect` expected _no expected value_ _(none)_
    - :327 `toHaveCount` expected `1` _(literal)_
    - :328 `toHaveCount` expected `1` _(literal)_
- `"multiply until it breaks" reaches 0 bits and explains the failure` — e2e/claims.spec.ts:331
    - :335 `toHaveText` expected `/Noise budget: 0\.0 bits/, { timeout: 60_000 }` _(expression)_
    - :336 `toBeEnabled` expected `{ timeout: 60_000 }` _(expression)_
    - :339 `toBe` expected `0` _(literal)_
    - :340 `toBe` expected `0` _(literal)_
    - :341 `toBe` expected `'critical'` _(literal)_
    - :344 `expect` expected _no expected value_ _(none)_
    - :346 `expect` expected _no expected value_ _(none)_
    - :347 `toBe` expected `0` _(literal)_
    - :348 `toBe` expected `false` _(expression)_
    - :351 `toBe` expected `true` _(expression)_
    - :352 `expect` expected _no expected value_ _(none)_
    - :355 `toMatch` expected `/^Decrypt output: \d+ \(expected \d+\)/` _(regex)_
    - :356 `expect` expected _no expected value_ _(none)_
    - :357 `expect` expected _no expected value_ _(none)_
    - :360 `toMatch` expected `/the noise overflowed and the result is garbage|correctness is no longer guaranteed/` _(regex)_
- `bootstrap restores an exhausted budget to full and decryption works again` — e2e/claims.spec.ts:363
    - :365 `toBeEnabled` expected `{ timeout: 60_000 }` _(expression)_
    - :367 `toBe` expected `0` _(literal)_
    - :372 `toBe` expected `100` _(literal)_
    - :373 `toBe` expected `'healthy'` _(literal)_
    - :374 `expect` expected _no expected value_ _(none)_
    - :377 `toHaveLength` expected `rowsBefore.length + 1` _(expression)_
    - :378 `expect` expected _no expected value_ _(none)_
    - :379 `toBe` expected `true` _(expression)_
    - :380 `toMatch` expected `/→ bootstrap$/` _(regex)_
    - :384 `expect` expected _no expected value_ _(none)_
    - :386 `expect` expected _no expected value_ _(none)_
    - :387 `toBe` expected `values![2]` _(expression)_
- `reset returns exhibit 3 to a single fresh, correct ciphertext` — e2e/claims.spec.ts:390
    - :395 `toBe` expected `'Sequence: fresh'` _(literal)_
    - :397 `toHaveLength` expected `1` _(literal)_
    - :398 `toBe` expected `0` _(literal)_
    - :399 `toBe` expected `true` _(expression)_
    - :401 `toBe` expected `100` _(literal)_
    - :403 `toBe` expected `'Decrypt output: 3 (expected 3) — ✓ correct, budget intact.'` _(literal)_
    - :404 `toHaveLength` expected `1` _(literal)_
- `exhibit 4 walks the ciphertext from 2 to 3 to 2 components and verifies the product` — e2e/claims.spec.ts:409
    - :416 `expect` expected _no expected value_ _(none)_
    - :417 `toHaveLength` expected `2` _(literal)_
    - :419 `toBe` expected `100` _(literal)_
    - :422 `expect` expected _no expected value_ _(none)_
    - :424 `toHaveLength` expected `3` _(literal)_
    - :425 `toMatch` expected `/^c2:/` _(regex)_
    - :427 `expect` expected _no expected value_ _(none)_
    - :430 `expect` expected _no expected value_ _(none)_
    - :431 `toHaveLength` expected `2` _(literal)_
    - :434 `expect` expected _no expected value_ _(none)_
    - :440 `expect` expected _no expected value_ _(none)_
    - :441 `expect` expected _no expected value_ _(none)_
    - :443 `toBe` expected `a` _(expression)_
    - :444 `toBe` expected `b` _(expression)_
    - :445 `toBe` expected `(a * b) % t` _(expression)_
    - :446 `toBe` expected `(a * b) % t` _(expression)_
    - :447 `expect` expected _no expected value_ _(none)_
    - :448 `toHaveText` expected `/matches plaintext/` _(regex)_
- `exhibit 4 refuses every out-of-order step with the step that is missing` — e2e/claims.spec.ts:451
    - :453 `toBe` expected `'Encrypt A and B first.'` _(literal)_
    - :455 `toBe` expected `'Run multiply first.'` _(literal)_
    - :457 `toBe` expected _no expected value_ _(none)_
    - :460 `toHaveText` expected `'awaiting…'` _(literal)_
    - :467 `toBe` expected `'Already relinearized — 2 components. Decrypt to check the result.'` _(literal)_
    - :472 `toBe` expected _no expected value_ _(none)_
- `batched add is slot-wise and the slot count matches the values printed` — e2e/claims.spec.ts:477
    - :488 `toBe` expected _no expected value_ _(none)_
    - :493 `expect` expected _no expected value_ _(none)_
    - :498 `expect` expected _no expected value_ _(none)_
    - :501 `toEqual` expected `va.map((x, i) => (x + vb[i]) % 17)` _(expression)_
    - :504 `toBe` expected `values.length` _(expression)_
    - :505 `expect` expected _no expected value_ _(none)_
- `batching refuses empty input and out-of-order steps` — e2e/claims.spec.ts:509
    - :511 `toBe` expected `'Encrypt both batches first.'` _(literal)_
    - :513 `toBe` expected `'Add the batches first.'` _(literal)_
    - :517 `toBe` expected `'Enter at least one integer (0–16) in each batch first.'` _(literal)_
    - :522 `toBe` expected `'Enter at least one integer (0–16) in each batch first.'` _(literal)_
    - :531 `toBe` expected `'Add the batches first.'` _(literal)_
- `the timing statistic is a real measurement of a correct operation` — e2e/claims.spec.ts:536
    - :540 `expect` expected _no expected value_ _(none)_
    - :541 `expect` expected _no expected value_ _(none)_
    - :542 `expect` expected _no expected value_ _(none)_
    - :543 `toBe` expected `100` _(literal)_
    - :546 `toBe` expected `(9 + 7) % 17` _(expression)_
- `parameter explorer: every stop is internally consistent and monotone` — e2e/claims.spec.ts:549
    - :552 `toBe` expected `5` _(literal)_
    - :569 `toBe` expected `Math.max(0, Math.floor((logQ - 30) / 25))` _(expression)_
    - :570 `expect` expected _no expected value_ _(none)_
    - :573 `toBe` expected `'n = ${n}, max log2 q = ${logQ} bits, about ${depth} multiplication levels, ${speed}'` _(expression)_
    - :576 `expect` expected _no expected value_ _(none)_
    - :577 `expect` expected _no expected value_ _(none)_
    - :578 `expect` expected _no expected value_ _(none)_
    - :579 `toBe` expected `prevN * 2` _(expression)_
- `the encrypted tally equals the ballots on screen, before and after edits` — e2e/claims.spec.ts:608
    - :611 `toBe` expected `10` _(literal)_
    - :612 `toBe` expected `before.total` _(expression)_
    - :615 `toBe` expected _no expected value_ _(none)_
    - :621 `expect` expected _no expected value_ _(none)_
    - :623 `expect` expected _no expected value_ _(none)_
    - :626 `expect` expected _no expected value_ _(none)_
    - :627 `toBe` expected `expectedHealth(Number(measured![1]))` _(expression)_
    - :628 `toBe` expected `'healthy'` _(literal)_
    - :634 `expect` expected _no expected value_ _(none)_
    - :635 `toBe` expected `before.yes` _(expression)_
    - :636 `toBe` expected `before.total` _(expression)_
    - :637 `toBe` expected `before.yes` _(expression)_
    - :638 `expect` expected _no expected value_ _(none)_
    - :639 `toHaveText` expected `/matches plaintext/` _(regex)_
    - :645 `toBe` expected `after.total` _(expression)_
    - :646 `toBe` expected `before.yes` _(expression)_
    - :652 `toBe` expected `after.yes` _(expression)_
    - :653 `toBe` expected `after.yes` _(expression)_
    - :654 `toHaveText` expected `/matches plaintext/` _(regex)_
- `editing a ballot invalidates the encrypted state instead of tallying stale ciphertexts` — e2e/claims.spec.ts:657
    - :659 `toBe` expected `'Encrypt the ballots first.'` _(literal)_
    - :661 `toBe` expected `'Tally the ciphertexts first.'` _(literal)_
    - :667 `toBe` expected `'Ballots changed — encrypt again to tally.'` _(literal)_
    - :669 `toBe` expected `'Tally the ciphertexts first.'` _(literal)_
    - :671 `toBe` expected `'Encrypt the ballots first.'` _(literal)_
    - :676 `toBe` expected `'Tally the ciphertexts first.'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-fhe-arena

## What It Is

FHE Arena runs a live toy of **BFV** (Fan-Vercauteren, 2012) — one of the two most widely deployed integer Fully Homomorphic Encryption schemes — and **compares** it against its close relative **BGV** (Brakerski-Gentry-Vaikuntanathan, 2012) in the tables and prose. Only BFV is implemented as a runnable engine here; BGV is discussed for contrast, not executed. Both schemes encrypt integers and support addition and multiplication directly on ciphertexts, allowing a server to compute on encrypted data without ever decrypting it. The central challenge is the noise budget: every operation adds noise to the ciphertext, and when noise exceeds a threshold, decryption fails. BGV manages this via **modulus switching**, dropping to a smaller modulus level by level to keep relative noise in check; BFV instead is **scale-invariant** — the plaintext rides in the high-order bits (Δ = ⌊q/t⌋) and the scaling factor holds the noise-to-modulus ratio steady, so no per-level modulus switching is required. *Rescaling* is CKKS's technique, and it manages the plaintext **scale**, not noise alone. This demo is the integer FHE companion to Blind Oracle (TFHE bit-level FHE).

> **Honesty note.** The live engine is a *toy* BFV over real negacyclic ring arithmetic at insecure parameters (n=64, t=17, q=65537). It samples randomness with `Math.random()` (not cryptographically secure) and does **not** implement production BFV *SIMD batching*: values are packed into polynomial **coefficient** slots, so batched **addition** is genuinely slot-wise, but multiplication is a negacyclic convolution that mixes slots — unlike real CRT/NTT-slot SIMD. BGV is not a second live engine. Everything the demo *computes* (encrypt/decrypt, add, multiply→relinearize→rescale, noise budgets, the vote tally) is real and unit-tested; nothing is faked.

## When to Use It

- BFV: encrypted integer arithmetic, simple-to-moderate computation depth, most accessible starting point (Microsoft SEAL default)
- BGV: deeper computation requiring more multiplication levels, statistical workloads on encrypted integers
- Both: encrypted database queries, private genomics, encrypted voting tallying, private machine learning inference on integer data
- Neither is suitable for encrypted floating-point / approximate arithmetic — use CKKS for that (see crypto-lab-ckks-lab)
- Neither supports unlimited computation depth without bootstrapping (expensive — plan your circuit depth carefully)
- Not yet practical for real-time applications without GPU acceleration (2024 state of the art for deep circuits)
- Do NOT use this for real encrypted workloads — it runs toy parameters for teaching, not production FHE security.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-fhe-arena](https://systemslibrarian.github.io/crypto-lab-fhe-arena/)**

Every number in the demo is computed by a real (toy-parameter) BFV engine over genuine negacyclic ring arithmetic — nothing is faked. The lab is built to *teach*, so the hidden machinery is made visible:

- **The decryption equation, live.** Exhibit 2 opens up exactly what the secret key recovers: `c0 + c1·s = Δ·m + e`. You see the clean signal `Δ·m`, the actual recovered value, and the noise `e` — so "noise" stops being abstract.
- **Noise budget in bits.** Every meter reports the budget in *bits* (like Microsoft SEAL's `invariant_noise_budget`), color-coded healthy → low → fails, alongside a visual bar.
- **Measured, not asserted.** Exhibit 3 logs the *real measured* noise and budget after each operation and plots it on a live chart — addition steps glide flat, each multiplication drops a cliff. A "multiply until it breaks" button animates the collapse to the decryption-failure floor.
- **Honest about failure.** When the budget is exhausted the demo shows the *actual* (corrupted) decryption and explains that the budget is a guarantee over the whole ciphertext — a single slot may coincidentally survive while the rest is garbage. Nothing is faked to look broken.
- **Randomized encryption, shown.** Encrypt the same value twice and compare distinct ciphertexts that both decrypt correctly. This demonstrates randomization, not IND-CPA security: differing ciphertexts alone do not establish indistinguishability, and this insecure toy provides no such guarantee.
- **Bootstrapping, shown.** Exhaust the budget, then press *Bootstrap* and watch it snap back to full — with an honest note that real bootstrapping refreshes noise homomorphically (without the key) and must run *before* overflow, not after.
- **The parameter tradeoff, hands-on.** A slider over the real Homomorphic Encryption Standard (128-bit security) shows how a larger degree `n` buys a larger modulus `q` → more multiplicative depth → but slower operations.
- **A live private computation.** Cast ten secret Yes/No ballots, encrypt them, homomorphically sum the ciphertexts, and decrypt *only the tally* — the headline FHE application, verifiable end to end, with no individual vote ever revealed.
- **Verification badges.** Encrypted results are checked against plaintext arithmetic with ✓/✗ badges, so the homomorphic payoff is unmissable.

Six exhibits: the core idea (compute on locked boxes, with a client/server trust diagram); encrypt-add-decrypt with the live `Δ·m + e` reveal and a randomized-encryption demo; the noise-budget visualizer with a live chart, animated "multiply until it breaks", and a bootstrapping refresh; multiplication, relinearization (2→3→2 ciphertext components) and coefficient packing (batched add); a BGV vs BFV vs TFHE comparison table, decision tree, and interactive parameter explorer; and real-world FHE deployments capped by a live encrypted vote tally.

## What Can Go Wrong

- **Decryption-feedback research — 20 October 2026.** Ordinary encryption security (IND-CPA), correct decryption, and security when an adversary learns computation results (IND-CPA-D) are different guarantees. Choe, Kang and Stehlé report attacks on particular BFV/BGV configurations using heuristic correctness assumptions, with experiments in OpenFHE and HElib. Crafted operations can exceed heuristic noise bounds; two attacks recover keys, while a third breaks indistinguishability. Parameter tables and noise estimates alone do not establish security in this feedback model. This browser lab does not reproduce those attacks or establish that its implementation is vulnerable. [Choe, Kang and Stehlé, *New IND-CPA-D Attacks on BFV and BGV*, ePrint 2026/2546](https://eprint.iacr.org/2026/2546), received 19 October and revised 20 October 2026; accepted to ACM CCS 2026. **Demonstrated results; attack-model-conditional.**

- **Noise budget exhaustion.** Every homomorphic operation grows ciphertext noise; exceed the budget and decryption silently returns garbage. Multiplicative depth must be planned before the circuit is built.
- **Wrong scheme for the data.** BGV/BFV are integer schemes. Forcing real-valued or approximate workloads onto them gives poor results — CKKS exists for that, with its own approximation caveats.
- **Insecure parameter selection.** Polynomial degree and modulus must follow the Homomorphic Encryption Standard; ad-hoc parameters can drop below the claimed security level or fail to support the intended depth.
- **No integrity by default.** FHE ciphertexts are malleable by design (that is the whole point), so a malicious server can tamper with results unless you add separate verification. IND-CPA security does not imply CCA security.
- **Bootstrapping cost and timing.** Bootstrapping refreshes noise but is expensive and must run before overflow, not after; treating it as free or as a recovery step after corruption does not work.

## Real-World Usage

- **Private machine learning inference.** Encrypted prediction services let a model run on a client's encrypted inputs without seeing the data, a primary commercial driver for FHE.
- **Encrypted database and analytics queries.** Servers compute sums, counts, and statistics over encrypted records, relevant to regulated medical and financial data.
- **Private genomics.** Encrypted comparison of genomic data is a long-standing FHE research and deployment target where data sensitivity is extreme.
- **Secure voting and aggregation.** Homomorphic summation lets only the final tally be decrypted while individual contributions stay encrypted.
- **Production libraries.** Microsoft SEAL, OpenFHE, HElib, and PALISADE implement BGV/BFV/CKKS and are used in research and industry FHE deployments.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-fhe-arena
cd crypto-lab-fhe-arena
npm install
npm run dev
`​``

## Tests

`​``bash
npm test          # vitest: toy-BFV crypto unit tests (round-trip, add, multiply→relinearize→rescale, noise budget, vote tally)
npm run test:a11y # Playwright: browser claim assertions (e2e/claims.spec.ts) + axe-core WCAG A/AA gate (e2e/a11y.spec.ts, both themes)
`​``

`npm test` runs the crypto unit tests in `src/toyFhe.test.ts` and does **not** collect the Playwright specs in `e2e/`. The tests assert the claims the demo makes on screen: encrypt/decrypt round-trips for every plaintext, homomorphic add and multiply match plaintext arithmetic mod *t*, relinearization shrinks 3→2 components without changing the value, the noise budget is a real measurement (multiply consumes far more than add and eventually reaches 0 bits), encryption is randomized (this is not an IND-CPA security test), and the encrypted vote tally returns the true sum.

`e2e/claims.spec.ts` re-checks those claims in a real browser, against the rendered page: the decryption verdict is recomputed from the integers the test types in (so no baked-in string can pass), the `Δ·m + e` reveal must be internally consistent (Δ = ⌊q/t⌋, signal + noise = what the key recovers, and the decoded answer must be what rounding that recovered value actually yields), the measured-noise column must agree with the budget-in-bits column and with the chart tooltips, the vote tally must equal the Yes chips visible on screen, and every "encrypt this first" / budget-exhausted / stale-ballot path must both reach its failure state and say why.

## Related Demos

- [crypto-lab-blind-oracle](https://systemslibrarian.github.io/crypto-lab-blind-oracle/) — TFHE bit-level FHE, the companion scheme to this integer FHE lab.
- [crypto-lab-ckks-lab](https://systemslibrarian.github.io/crypto-lab-ckks-lab/) — CKKS approximate FHE for encrypted real-valued / inference workloads.
- [crypto-lab-paillier-gate](https://systemslibrarian.github.io/crypto-lab-paillier-gate/) — Paillier additive homomorphic encryption for private aggregation.
- [crypto-lab-elgamal-plain](https://systemslibrarian.github.io/crypto-lab-elgamal-plain/) — ElGamal homomorphism and re-randomization.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*


```

</details>

---

## Paillier Gate

- **slug**: `crypto-lab-paillier-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-paillier-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-paillier-gate/
- **commit_sha**: `4158ea2b8f51f91e469a938ff34df1d818f6f018` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HOMOMORPHIC | MPC & THRESHOLD  ·  **level**: advanced  ·  **--accent**: #56d5c3
- **MISSING FIELDS**: claims, verification

**Name (H1)**: Paillier  — _read from src/main.ts_

**Subtitle**: Additively Homomorphic · Public-Key Encryption  — _read from src/main.ts_

**Description**: Generate a keypair, encrypt separate numbers, then add and scale those ciphertexts so decrypting only the combined result reveals the final sum.  — _read from src/main.ts_

**Why it matters**: Paillier can let a separate aggregator combine ciphertexts without opening individual inputs. This single-page lesson intentionally holds learner inputs and the private key so it can verify the arithmetic; it models separated roles rather than creating that confidentiality boundary itself.  — _read from src/main.ts_

**Card copy**: Paillier's additive homomorphic cryptosystem with encrypt/decrypt, tallying without decryption, and direct links to voting systems and GG20 threshold ECDSA.

**Chips**: Paillier · Additive HE · Private Voting · Aggregation

**Implements**: HMAC `src/ballots.ts:67`, Paillier `src/aggregation.ts:1`, SHA-256 `src/ballots.ts:67`

**Attacks shown**: Ciphertext malleability `src/main.ts:1395`, Discrete log `src/main.ts:154`, Factoring `src/factor.worker.ts:50`, Side-channel (unspecified) `README.md:36`

**Comment-only (named in code comments, not executed)**: BIKE `src/ballots.ts:60`, SHA-1 `src/ballots.ts:61`

**References**: BFV, BGV, EC point arithmetic, ECDSA, ElGamal, Shamir secret sharing

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 4231` — first seen src/ballots.ts:58 (10×)
- `rfc4231` — first seen tests/rfc4231-vectors.ts:4 (2×)

**README — What Can Go Wrong**:

```text
- The implementation uses small educational key sizes and does not constant-time its modular arithmetic, so its modular exponentiation can leak secrets through timing or other side channels.
- Reusing or omitting the fresh randomness `r` in `c = gᵐ · rᴺ mod N²` makes encryption deterministic and breaks semantic security.
- Additive homomorphism is also malleability: anyone holding a ciphertext can add to it or rescale it, so Paillier alone provides no integrity and needs separate authentication.
- Plaintexts must stay below the modulus `N`; an encrypted sum that overflows `N` wraps around modulo `N` and decrypts to the wrong value.
- Weak prime generation for `p` and `q`, or too small a modulus, lets an attacker factor `N` and recover the private key.
- A MAC over this demo's voter identifier and ciphertext does not establish voter eligibility, prove that a plaintext is 0 or 1, prevent replay across election contexts, distribute decryption trust, or provide availability and public auditability.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records** (2 file(s)):

- `mutation-evidence.json` (9676 bytes)
- `scripts/claim-mutations.mjs` (7300 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-paillier-gate

## What It Is

crypto-lab-paillier-gate is a browser demo of the Paillier probabilistic, additively homomorphic cryptosystem implemented in TypeScript with BigInt arithmetic. In a protocol that separates data owners, the ciphertext aggregator, and authorized key holders, Paillier can combine encrypted values before an authorized party decrypts the final modular total. This single-page lesson intentionally sees the learner's inputs and owns the private key so it can verify every result; it models those separated roles rather than providing that confidentiality boundary itself. It demonstrates key generation, encryption, decryption, rerandomization, encrypted addition, and their limits, but it is not an audited production cryptography library.

## When to Use It

- Use it to study privacy-preserving summation designs with separated roles, because Paillier supports addition directly on ciphertexts.
- Use it for binary vote tally demonstrations, because 0/1 ballots can stay encrypted during collection and only the final tally needs to be decrypted.
- Use it for weighted scoring or aggregation experiments, because the demo supports scalar multiplication and weighted sums over encrypted values.
- Do not use it as a production browser encryption stack, because it is a demo app and does not provide hardened operational controls.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-paillier-gate](https://systemslibrarian.github.io/crypto-lab-paillier-gate/)**

The demo lets you generate a Paillier keypair, encrypt and decrypt messages, compute an encrypted sum, and run private aggregation and encrypted election tally scenarios in the browser. It explicitly supports both encrypt and decrypt flows, along with a key-size selector for generation and text controls for plaintexts, counts, weights, and votes.

To make the homomorphic "magic" observable rather than asserted, the demo also includes:

- A **homomorphic-addition ledger** in Step 3 that shows the full `Enc(A)`, `Enc(B)`, and product ciphertexts with a literal `× (mod N²)` operator and a `decrypt →` arrow to `A + B`, plus an inline callout proving the product is *not* the integer sum of the two ciphertexts — the page decrypts that integer sum too and prints the wrong value it yields, so ciphertext multiplication being the operation that maps to plaintext addition is demonstrated, not claimed.
- A **ciphertext hand-off**: encrypt a value in Step 2 and send that exact ciphertext into Step 3 so you combine data you personally encrypted, instead of the demo re-encrypting behind the scenes.
- A **"same message, different ciphertext"** stack (an *Encrypt again* button) that illustrates Paillier's probabilistic randomness: identical plaintexts yield visibly different ciphertexts. Each row is decrypted with the private key as it is added and captioned with that decryption. This observation does not prove semantic security; the original Paillier result establishes that property under the decisional composite residuosity assumption.
- A **re-randomize** control that folds a fresh `rᴺ` factor into an existing ciphertext using only the public key — the ciphertext changes completely, the plaintext does not, and the new row's caption is the real decryption of the refreshed ciphertext.
- An **interactive modulus-overflow preset** that forces an encrypted sum past `N` so you can watch decryption silently wrap to the wrong value, with a callout explaining the plaintext-space bound.
- A **factoring attack on the key you just generated**: a real Pollard rho (Brent's variant) runs in a worker against `N` under a fixed 12,000,000-step budget. On a 64-bit modulus it splits `N` in a few hundred thousand modular squarings, rebuilds `λ = lcm(p−1, q−1)` from the recovered primes, checks that against the private `λ` the keygen worker produced, and decrypts your Step 2 ciphertext with the key it just derived. At larger sizes the same routine exhausts its budget and says so, printing the steps and milliseconds it actually burned. "Bigger is harder to factor" becomes a measurement rather than a caption on the bit-length selector.
- A **stepped decryption**: press once per operation to walk `c → u = c^λ mod N² → L(u) = (u−1)/N → m = L(u)·μ mod N` on the live ciphertext, with the final step cross-checked against what `decrypt()` returns for the same input.
- A **malleability attack on a sealed ballot** (Scenario B). The attacker encrypts a boost under the *public* key, multiplies it into another voter's ciphertext, and the tally decrypts that much higher. A toggle turns on a domain-separated HMAC-SHA256 over the voter identifier and ciphertext; the ballot box verifies it with Web Crypto and rejects both the forged record and duplicate voter identifiers. This blocks the demonstrated outsider rewrite, but it is not a complete election protocol.
- **Plain-language glosses** on the `N`, `g`, and `λ` metric cards and a collapsible *What's happening under the hood* panel carrying the key-generation and encryption math onto the page.

The two scenarios make deliberately different arguments. Scenario A models the arithmetic used by a confidential aggregation protocol: it runs both the plain sum `∏ Enc(xᵢ)` and the weighted sum `∏ Enc(xᵢ)^wᵢ`, printing each row's `Enc(x)^w` contribution and checking the decrypted modular totals against the learner-visible inputs. The page itself is not confidential because it owns both those inputs and the private key. Scenario B is integrity: the same algebra, turned against the voter.

## What Can Go Wrong

- The implementation uses small educational key sizes and does not constant-time its modular arithmetic, so its modular exponentiation can leak secrets through timing or other side channels.
- Reusing or omitting the fresh randomness `r` in `c = gᵐ · rᴺ mod N²` makes encryption deterministic and breaks semantic security.
- Additive homomorphism is also malleability: anyone holding a ciphertext can add to it or rescale it, so Paillier alone provides no integrity and needs separate authentication.
- Plaintexts must stay below the modulus `N`; an encrypted sum that overflows `N` wraps around modulo `N` and decrypts to the wrong value.
- Weak prime generation for `p` and `q`, or too small a modulus, lets an attacker factor `N` and recover the private key.
- A MAC over this demo's voter identifier and ciphertext does not establish voter eligibility, prove that a plaintext is 0 or 1, prevent replay across election contexts, distribute decryption trust, or provide availability and public auditability.

## Real-World Usage

- Some privacy-preserving e-voting constructions use threshold Paillier with eligibility, validity-proof, replay, audit and availability mechanisms so authorized key holders open only an aggregate rather than individual ballots.
- Threshold ECDSA protocols such as GG18 use Paillier-based multiplication-to-addition subprotocols during distributed signing; the lab demonstrates the underlying additive operation, not a threshold-ECDSA implementation.
- Federated learning and private analytics use additively homomorphic encryption to aggregate model updates or statistics without exposing individual contributions.
- Privacy-preserving advertising and data-aggregation pipelines use Paillier-style additive HE to compute encrypted sums across mutually distrusting parties.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-paillier-gate
cd crypto-lab-paillier-gate
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-elgamal-plain](https://systemslibrarian.github.io/crypto-lab-elgamal-plain/) — ElGamal homomorphism and ciphertext re-randomization.
- [crypto-lab-fhe-arena](https://systemslibrarian.github.io/crypto-lab-fhe-arena/) — BGV/BFV fully homomorphic encryption with SIMD batching.
- [crypto-lab-threshold-decrypt](https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/#election) — a quorum opens the election total, with a 0-or-1 proof against dishonest voters. This lab instead uses one decryption key and a MAC against an outsider rewriting an honest ballot; that MAC cannot establish the voter's plaintext is a permitted vote.
- [crypto-lab-silent-tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) — Shamir-based secure sum, an MPC alternative to HE aggregation.

## How It Works

Paillier is built on the decisional composite residuosity assumption. The [original EUROCRYPT '99 paper](https://www.cs.tau.ac.il/~fiat/crypt07/papers/Pai99pai.pdf) proves Scheme 1 semantically secure if and only if that assumption holds; observing randomized samples in this demo illustrates the construction but is not that proof. Key generation picks two primes `p` and `q`, forms the modulus `N = p · q`, and uses the generator `g = N + 1`. A plaintext `m` is encrypted as `c = gᵐ · rᴺ mod N²` with fresh randomness `r`, so the same message yields a different ciphertext every time. Decryption recovers `m` with the private values `λ = lcm(p−1, q−1)` and `μ = λ⁻¹ mod N` via `m = L(c^λ mod N²) · μ mod N`, where `L(x) = (x − 1) / N`.

The scheme is **additively homomorphic**: multiplying two ciphertexts modulo `N²` decrypts to the sum of their plaintexts, and raising a ciphertext to a scalar power decrypts to the scaled plaintext. Those two facts are what make the encrypted aggregation and election-tally scenarios possible.

All arithmetic uses native `BigInt`, randomness comes from the Web Crypto API (`crypto.getRandomValues`), and key generation runs in a Web Worker so the UI stays responsive during prime search.

## Testing and Verification

`​``bash
npm test         # Vitest unit suite (number theory, Paillier core, factoring, ballots, scenarios)
npm run verify   # End-to-end verification gate, including a 2048-bit round-trip,
                 # the 64-bit factoring break, and the ballot forgery with and without MAC
npm run check    # Typecheck + tests + verify (the full local gate)
npm run test:a11y # Playwright: WCAG A/AA scan plus functional gates on every exhibit
`​``

The Playwright suite is not only an accessibility scan: `e2e/exhibits.spec.ts` drives the real page and
asserts the computed outcome of each exhibit, including the paths where an attack is supposed to fail —
the 192-bit factoring run that must give up, and the forged ballot that Encrypt-then-MAC must reject.

Every push and pull request runs the typecheck, build, unit tests, and verification gate in GitHub Actions; the GitHub Pages deploy only runs after that gate passes.

## Accessibility and Mobile

The UI targets WCAG 2.1 AA and works down to small phone widths: a skip-to-content link, keyboard-visible focus rings, `aria-live` result regions and a labelled progress bar, AA-contrast text and controls in both light and dark themes, 44px touch targets, a 16px input-font floor to prevent iOS focus-zoom, `prefers-reduced-motion` support, and a fluid grid that reflows from four columns down to one.

## Tech Stack

TypeScript, Vite, and a Web Worker for key generation — no cryptography dependencies; the Paillier implementation is self-contained. Tested with Vitest and deployed as a static site to GitHub Pages.

## Security Notes

This is an educational demo, **not** an audited production cryptography library. It intentionally offers small key sizes for fast in-browser generation, does not constant-time its modular arithmetic, and is not hardened against side-channel attacks. Do not use it to protect real data.

## License

Released under the [MIT License](LICENSE).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---
