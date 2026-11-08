# Crypto Lab audit corpus — ZERO-KNOWLEDGE

Generated 2026-11-08T20:20:28.593Z from 7 lab record(s).

Every finding must cite **commit_sha + lab slug + field**. A field printed as
`MISSING` was not found by the generator; it is not a claim that the lab lacks it.

---
## ZK Proof Lab

- **slug**: `crypto-lab-zk-proof-lab`
- **repo**: https://github.com/systemslibrarian/crypto-lab-zk-proof-lab
- **live**: https://systemslibrarian.github.io/crypto-lab-zk-proof-lab/
- **commit_sha**: `009f08a57281a141b9ee6a9d689bd24156442c5b` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ZERO-KNOWLEDGE  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, verification

**Name (H1)**: ZK Proof Lab  — _read from index.html_

**Subtitle**: Zero-Knowledge Proofs · Interactive · Fiat-Shamir · SNARK · Sum-Check  — _read from index.html_

**Description**: Walk interactive proofs (Ali Baba cave, graph 3-coloring, Schnorr, Okamoto, and GQ) through commit-challenge-response, then collapse them into non-interactive Fiat-Shamir and SNARK-shaped pipelines with real in-browser hashing and modular arithmetic.  — _read from index.html_

**Why it matters**: Zero-knowledge proofs let you prove a fact is true without exposing the secret behind it — the backbone of private payments, rollup scaling, and password-free identity. Soundness is everything: a broken proof lets anyone convince a verifier of a lie.  — _read from index.html_

**Card copy**: Eight exhibits from Ali Baba cave to exact interactive proofs: real Schnorr/Okamoto/GQ arithmetic, SHA-256 commitments, replayable transcripts, and an executable sum-check with a bounded two-layer GKR walk. Exhibit 08 is interactive verifiable computation, not zero knowledge or a SNARK.

**Chips**: Schnorr · SHA-256 Commitments · Fiat-Shamir · zk-SNARK · Sum-check · GKR

**Implements**: Fiat-Shamir `js/fiat-shamir.js:181`, GKR `js/gkr.js:207`, Miller–Rabin `js/field.js:39`, RSA `js/sigma.js:334`, RSA-PSS `js/sigma.js:335`, Schnorr `js/schnorr.js:46`, SHA-256 `js/shared.js:358`, Sum-check `js/sumcheck.js:89`

**Attacks shown**: Brute force `js/extractor.js:169`, Discrete log `README.md:42`, Key recovery `README.md:87`, Nonce reuse `README.md:87`

**Comment-only (named in code comments, not executed)**: Babai rounding `js/sumcheck.js:5`, SHAKE `js/shared.js:413`, Shamir secret sharing `js/sigma.js:428`

**References**: Babai rounding, Bulletproofs, Diffie-Hellman, FRI, Fujisaki-Okamoto transform, Groth16, Halo2, PLONK, Pedersen commitment, STARK, Schnorr identification, Shamir secret sharing, Sigma protocol, secp256k1

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `10.1145/1374376.1374396;` — first seen README.md:66 (1×)
- `10.1145/146585.146605.` — first seen README.md:65 (1×)
- `CRYPTO ’89` — first seen exhibits/sigma-family.html:274 (1×)
- `CRYPTO ’92` — first seen exhibits/sigma-family.html:60 (2×)
- `CRYPTO 1989` — first seen exhibits/cave.html:49 (1×)
- `Crypto 6553` — first seen js/sigma.js:375 (1×)
- `doi.org/10.1007/3-540-45961-8_11` — first seen exhibits/sigma-family.html:61 (1×)
- `doi.org/10.1007/3-540-48071-4_3` — first seen exhibits/sigma-family.html:60 (1×)
- `doi.org/10.1145/1374376.1374396` — first seen exhibits/sumcheck-gkr.html:59 (1×)
- `doi.org/10.1145/146585.146605` — first seen exhibits/sumcheck-gkr.html:58 (1×)
- `EUROCRYPT ’88` — first seen exhibits/sigma-family.html:61 (2×)
- `RFC 3526` — first seen README.md:5 (7×)
- `RFC 8235` — first seen README.md:44 (2×)
- `rfc3526` — first seen exhibits/sigma-family.html:59 (10×)
- `rfc8235` — first seen README.md:44 (2×)

**Stated limitations (page)**:

- _(honesty, index.html)_ Cryptographic honesty: the modular-arithmetic checks and Web Crypto primitives in Exhibits 02, 03, 04, 05, 07 and 08 are real. Exhibit 07 runs exact BigInt arithmetic over a published 2048-bit group and a fresh WebCrypto RSA modulus; Exhibit 08 runs the sum-check interactive proof and a bounded GKR layer walk in exact prime-field arithmetic, and is neither zero-knowledge nor a SNARK; Exhibits 01 and 06 are clearly-labelled conceptual models.
- _(honesty, exhibits/cave.html)_ Cryptographic honesty: this exhibit is a conceptual thought experiment to teach the shape of zero-knowledge proofs. It does not claim production-grade cryptographic parameters.
- _(honesty, exhibits/commit-reveal.html)_ Cryptographic honesty: SHA-256 is computed by the browser Web Crypto API. This scenario uses educational-scale values for clarity and speed, not a complete production auction protocol.
- _(honesty, exhibits/fiat-shamir.html)_ Cryptographic honesty: challenge generation is real SHA-256 over transcript inputs and verification is real modular arithmetic. Parameters are intentionally small for readability.
- _(honesty, exhibits/graph-coloring.html)_ Cryptographic honesty: each region is committed with a real SHA-256(color ‖ nonce) digest, and on reveal the opening is re-hashed and checked against the published commitment. The challenge-reveal logic and soundness amplification ((5/6)k) of ZK graph coloring are preserved faithfully. The zero-knowledge property is exhibited rather than asserted: the extractor bench at the bottom of this page runs two real attacks — a bounded SHA-256 preimage search against the published digests, and a full enumeration of the colourings the transcript leaves possible — and prints only what they returned. The graph and colour palette are small for a legible walkthrough, not for deployment security.
- _(honesty, exhibits/scenario-presets.html)_ Preset contract: each URL captures seed + behavior mode + optional auto-run. Same URL means same flow, making debugging and demos repeatable.
- _(honesty, exhibits/schnorr.html)_ Cryptographic honesty: the verification equation and modular arithmetic are real. Parameters are deliberately tiny for human-readable walkthroughs and animation speed, not for deployment security.
- _(honesty, exhibits/sigma-family.html)_ Cryptographic honesty: Okamoto and GQ use exact BigInt equations at 2048 bits, with SHA-256 deriving h from the seed shown below. The p = 47 witness-independence census is explicitly a complete toy model. This is inspectable teaching code, not a constant-time production library.
- _(honesty, exhibits/snark.html)_ Cryptographic honesty: this exhibit teaches the architecture of zk-SNARK systems (setup/proving/verification and public/private split). It is intentionally not a real SNARK implementation or security parameterization. Two pieces are genuinely computed and re-checked by the verifier rather than asserted: the arithmetic relation y = w² + 3w + 7, and a real SHA-256 digest binding the public input to the proof envelope — which is why the tamper preset is rejected on the numbers. Everything else here — trusted setup, proving key, succinctness — is narrated, not performed.
- _(honesty, exhibits/sumcheck-gkr.html)_ Cryptographic honesty: every value below comes from exact BigInt modular arithmetic in the prime field you select. The verifier checks a degree bound and a recurrence in every round and draws each challenge only after that round's message is fixed. The tiny-field census is a complete enumeration for teaching, not a security parameter. This is inspectable teaching code for an interactive proof: it is not zero-knowledge, not a SNARK, and not a constant-time library.
- _(honesty, exhibits/transcript-lab.html)_ How to use, and what is real: load the latest transcript from an exhibit or paste JSON manually, then compare transcript semantics and verifier outcomes side by side. For Fiat-Shamir transcripts this page does not take the recorded challenge on trust — it re-derives it with a real SHA-256 digest over the transcript's own (R, y, message) and reports match or mismatch. The remaining rows are field-level comparison of the JSON, not verification: this is a teaching inspector for proof traces, not a proof checker.

**README — What Can Go Wrong**:

```text
- Reusing Schnorr nonces (`r`) can leak the secret (`x`) from two transcripts, which breaks the core secrecy guarantee of identification proofs.
- Using small or weak group parameters makes discrete-log attacks practical, so a verifier equation that passes in the toy demo would not imply real-world security.
- Omitting transcript/domain separation details in Fiat-Shamir challenge derivation can enable replay or malleability across contexts, undermining non-interactive soundness assumptions.
- The Fiat-Shamir exhibit deliberately reduces its SHA-256 digest to a challenge in `1..50`. With `?seed=3`, the original and altered messages have different full digests but the same challenge `26`, and verification passes. This is a toy challenge-domain collision, not a SHA-256 collision. All verdict text follows the actual equation and shows original/altered challenges; an unavailable hash produces no tamper verdict. Copy/Replay preserve the original proof. See [RFC 8235 §2.3](https://www.rfc-editor.org/rfc/rfc8235.html#section-2.3) for production-sized challenge and context requirements; this small-parameter exhibit is not an RFC-conforming implementation.
- Reusing or biasing commit-reveal nonces weakens hiding and can leak bid information before reveal, defeating fairness of the commit phase.
- Failing to enforce reveal windows in commit-reveal protocols allows strategic non-reveal (griefing), which is a protocol-level failure even when hash checks are correct.
- Reusing an Okamoto or GQ commitment across two different challenges exposes the representation or RSA root; the rewind panels compute that extraction rather than merely warning about it.
- Choosing a tiny GQ exponent also creates a tiny challenge space. The deliberately broken e = 3 mode shows a prover with only public y passing about one time in three; e = 65537 is the default.
- A sum-check verifier that drops the per-round degree bound can be beaten by a full-field interpolant of degree at most p − 1 that agrees with the honest message everywhere but one point. The exhibit prints its actual degree and shows it rejected on degree only when that degree exceeds the statement's public X1 bound; when the public bound already permits it, the page labels the example as not a degree-bound violation and reports its actual acceptance count. The mutation suite kills a verifier that stops enforcing a genuinely exceeded bound.
- A sum-check verifier's challenges must be drawn after the round's message is fixed. The exhibit's deterministic teaching seed exists so runs replay, and the page labels it as not cryptographically secure verifier randomness: a prover who knows the seed knows every challenge in advance.
- Static transcript replay rechecks structure and arithmetic but carries no timestamps, so it cannot prove that a recorded challenge was historically sampled after its message or was unpredictable. Those properties come from the live phase guard and fresh-random mode, respectively.
- Fields of 13, 7 or 5 elements make the soundness arithmetic readable, not meaningful. The census counts the constructed lie polynomial's actual roots rather than assuming every degree is attained, and the page caps probability bounds at 1 and marks raw union sums at least 1 as vacuous.
- The wrong-output and altered-line controls are probabilistic soundness examples, not guaranteed rejection scripts: a wrong output can survive at a root of its difference polynomial, and q(t) + t(t − 1) is unchanged when the verifier's line challenge is 0 or 1.
```

**Claims tested** (e2e/claims.spec.ts, 48 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:50
    - :50 `toBe` expected `true` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:57
    - :57 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:107
    - :107 `toBe` expected `1n` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:113
    - :113 `toMatch` expected `/^-?\d+$/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:188
    - :188 `toBe` expected `modpow(G, run.x, P)` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:189
    - :189 `toBe` expected `modpow(G, run.r, P)` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:190
    - :190 `toBe` expected `modpow(G, run.s, P)` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:191
    - :191 `toBe` expected `(run.R * modpow(run.y, run.c, P)) % P` _(expression)_
- `Schnorr identification` — e2e/claims.spec.ts:195
    - :198 `toBeEnabled` expected _no expected value_ _(none)_
- `an honest run satisfies the verifier equation the page prints` — e2e/claims.spec.ts:201
    - :203 `toContainText` expected `'VERIFIED', { timeout: 15_000 }` _(expression)_
    - :208 `toBe` expected `(run.r + run.c * run.x) % ORDER` _(expression)_
    - :209 `toBe` expected `true` _(expression)_
    - :210 `toBe` expected `run.rhs` _(expression)_
    - :211 `expect` expected _no expected value_ _(none)_
    - :214 `toHaveText` expected `confidencePct(1, 1 / 50)` _(expression)_
    - :216 `toHaveText` expected `confidencePct(2, 1 / 50), { timeout: 15_000 }` _(expression)_
    - :223 `toEqual` expected `['R', 'c', 's', 'lhs', 'rhs', 'verified']` _(expression)_
    - :224 `expect` expected _no expected value_ _(none)_
    - :225 `toBe` expected `true` _(expression)_
- `the secret selector recomputes the public key for every option` — e2e/claims.spec.ts:228
    - :232 `expect` expected _no expected value_ _(none)_
    - :236 `toHaveText` expected `option` _(expression)_
    - :237 `toHaveText` expected `option` _(expression)_
    - :239 `toHaveText` expected `String(modpow(G, x, P))` _(expression)_
- `a cheating prover is rejected and the log says the equation failed` — e2e/claims.spec.ts:243
    - :245 `toContainText` expected `'VERIFIED', { timeout: 15_000 }` _(expression)_
    - :254 `toContainText` expected `/VERIFIED|FAILED/, { timeout: 15_000 }` _(expression)_
    - :258 `expect` expected _no expected value_ _(none)_
    - :261 `expect` expected _no expected value_ _(none)_
    - :262 `expect` expected _no expected value_ _(none)_
    - :264 `toBe` expected `true` _(expression)_
    - :267 `toBe` expected `true` _(expression)_
    - :270 `toHaveText` expected `honestPct` _(expression)_
- `leaking the nonce recovers the private key from the transcript` — e2e/claims.spec.ts:273
    - :275 `toContainText` expected `'VERIFIED', { timeout: 15_000 }` _(expression)_
    - :279 `toBeVisible` expected _no expected value_ _(none)_
    - :284 `expect` expected _no expected value_ _(none)_
    - :286 `expect` expected _no expected value_ _(none)_
    - :290 `expect` expected _no expected value_ _(none)_
    - :293 `toBe` expected `residue` _(expression)_
    - :296 `toBe` expected `true` _(expression)_
- `stepping through the protocol reaches the same verified equation` — e2e/claims.spec.ts:299
    - :304 `toBe` expected `step >= 4 ? 'Step ▷ (restart)' : 'Step ▷ (${step}/4)'` _(expression)_
    - :306 `toBeVisible` expected _no expected value_ _(none)_
    - :308 `toBe` expected `(run.r + run.c * run.x) % ORDER` _(expression)_
    - :309 `toBe` expected `true` _(expression)_
    - :310 `expect` expected _no expected value_ _(none)_
    - :312 `toHaveLength` expected `4` _(literal)_
- `Beyond Schnorr: computed claims` — e2e/claims.spec.ts:320
    - :323 `toBeEnabled` expected `{ timeout: 20_000 }` _(expression)_
- `the RFC group, deterministic h, and Okamoto verifier equation are independently recomputed` — e2e/claims.spec.ts:326
    - :330 `toEqual` expected `[` _(expression)_
    - :345 `toBe` expected `RFC3526_GROUP14_P` _(expression)_
    - :346 `toBe` expected `(p - 1n) / 2n` _(expression)_
    - :347 `toHaveLength` expected `2048` _(literal)_
    - :348 `toBe` expected `4n` _(expression)_
    - :349 `toBe` expected `1n` _(expression)_
    - :350 `toBe` expected `independentH(seed, p)` _(expression)_
    - :351 `toBe` expected `1n` _(expression)_
    - :352 `toBe` expected `1n` _(expression)_
    - :355 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :365 `toBe` expected `lhs` _(expression)_
    - :366 `toBe` expected `rhs` _(expression)_
    - :367 `toBe` expected `rhs` _(expression)_
    - :368 `toBe` expected `1n` _(expression)_
    - :369 `toBe` expected `1n` _(expression)_
    - :370 `toContainText` expected `'PROOF ACCEPTED'` _(literal)_
- `Okamoto rewind and both witness-independence experiments expose their complete arithmetic` — e2e/claims.spec.ts:373
    - :376 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :387 `toHaveAttribute` expected `'data-state', 'alarm'` _(expression)_
    - :394 `toBe` expected `c` _(expression)_
    - :396 `toBe` expected `mod((zAlpha - zAlpha2) * invDelta, q)` _(expression)_
    - :397 `toBe` expected `mod((zBeta - zBeta2) * invDelta, q)` _(expression)_
    - :398 `toBe` expected `modpow(g, alphaHat, p) * modpow(h, betaHat, p) % p` _(expression)_
    - :399 `toBe` expected `u` _(expression)_
    - :400 `toContainText` expected `'protocol working as designed: special soundness'` _(literal)_
    - :403 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :406 `toHaveLength` expected `23 * 23 * 23` _(expression)_
    - :407 `toHaveLength` expected `23 * 23 * 23` _(expression)_
    - :408 `toBe` expected _no expected value_ _(none)_
    - :411 `toBe` expected `23 * 23` _(expression)_
    - :412 `toBe` expected `23` _(literal)_
    - :413 `toBe` expected `23 * 23 * 23` _(expression)_
    - :414 `toBe` expected `23 * 23 * 23` _(expression)_
    - :418 `toBe` expected `fixedB` _(expression)_
    - :419 `toContainText` expected `'fixed-nonce control is unequal'` _(literal)_
    - :422 `toHaveAttribute` expected `'data-state', 'pending'` _(expression)_
    - :426 `toHaveLength` expected `23 * 23` _(expression)_
    - :427 `toBe` expected _no expected value_ _(none)_
    - :430 `toBe` expected `1` _(literal)_
    - :431 `toBe` expected `23 * 23` _(expression)_
    - :434 `toBe` expected `mod((5n - 9n) * inverseBig(8n - 7n, 23n), 23n)` _(expression)_
    - :435 `toBe` expected `modpow(4n, dlog, 47n)` _(expression)_
    - :436 `toBe` expected `9n` _(expression)_
    - :437 `toBe` expected `await textOf(page, '#toy-second-rhs')` _(expression)_
    - :438 `toContainText` expected _no expected value_ _(none)_
- `GQ verification, Shamir extraction, 65537 counter, and retirement all follow printed values` — e2e/claims.spec.ts:443
    - :446 `toHaveAttribute` expected `'data-state', 'pass', { timeout: 120_000 }` _(expression)_
    - :455 `toBe` expected `65537n` _(expression)_
    - :456 `toHaveLength` expected `2048` _(literal)_
    - :457 `toBe` expected `1n` _(expression)_
    - :458 `toBe` expected `1n` _(expression)_
    - :459 `toBe` expected `1n` _(expression)_
    - :460 `toBe` expected `modpow(xZ, e, N)` _(expression)_
    - :461 `toBe` expected `yT * modpow(y, c, N) % N` _(expression)_
    - :462 `toBe` expected `shownRhs` _(expression)_
    - :465 `toHaveAttribute` expected `'data-state', 'alarm'` _(expression)_
    - :472 `toBe` expected `c - c2` _(expression)_
    - :473 `toBe` expected `1n` _(expression)_
    - :474 `toBe` expected `modpow(root, e, N)` _(expression)_
    - :475 `toBe` expected `y` _(expression)_
    - :478 `toHaveAttribute` expected `'data-state', 'busy', { timeout: 120_000 }` _(expression)_
    - :479 `toBe` expected `1000` _(literal)_
    - :481 `expect` expected _no expected value_ _(none)_
    - :482 `expect` expected _no expected value_ _(none)_
    - :483 `toContainText` expected `'${acceptances} of 1,000'` _(expression)_
    - :484 `toContainText` expected `'1,000/65,537'` _(literal)_
    - :489 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :490 `toBe` expected `before` _(expression)_
    - :493 `toBeVisible` expected _no expected value_ _(none)_
    - :494 `toHaveAttribute` expected `'data-state', 'pending'` _(expression)_
    - :495 `toHaveAttribute` expected `'data-state', 'pending'` _(expression)_
    - :496 `toHaveAttribute` expected `'data-state', 'pending'` _(expression)_
    - :497 `toHaveAttribute` expected `'data-value', ''` _(expression)_
    - :498 `toContainText` expected `'every prior GQ verdict were retired'` _(literal)_
    - :500 `toBeHidden` expected _no expected value_ _(none)_
- `the e=3 evidence fixture accepts a well-formed proof from a prover with no root` — e2e/claims.spec.ts:503
    - :506 `toBeVisible` expected _no expected value_ _(none)_
    - :508 `toHaveAttribute` expected `'data-state', 'pass', { timeout: 180_000 }` _(expression)_
    - :510 `toHaveAttribute` expected `'data-state', 'alarm'` _(expression)_
    - :512 `toHaveAttribute` expected `'data-state', 'alarm', { timeout: 120_000 }` _(expression)_
    - :523 `toBe` expected `3n` _(expression)_
    - :524 `expect` expected _no expected value_ _(none)_
    - :525 `toBe` expected `1` _(literal)_
    - :526 `expect` expected _no expected value_ _(none)_
    - :527 `expect` expected _no expected value_ _(none)_
    - :528 `toBe` expected `guessed` _(expression)_
    - :529 `toBe` expected `1n` _(expression)_
    - :530 `toBe` expected `1n` _(expression)_
    - :531 `toBe` expected `1n` _(expression)_
    - :532 `toBe` expected `modpow(xZ, e, N)` _(expression)_
    - :533 `toBe` expected `yT * modpow(y, challenge, N) % N` _(expression)_
    - :534 `toBe` expected `rhs` _(expression)_
    - :535 `toHaveText` expected _no expected value_ _(none)_
    - :538 `toHaveText` expected _no expected value_ _(none)_
    - :541 `toContainText` expected _no expected value_ _(none)_
    - :544 `expect` expected _no expected value_ _(none)_
- `Fiat-Shamir` — e2e/claims.spec.ts:554
    - :557 `toBeEnabled` expected _no expected value_ _(none)_
- `the challenge really is the hash of the transcript` — e2e/claims.spec.ts:560
    - :562 `toContainText` expected `'VERIFIED', { timeout: 15_000 }` _(expression)_
    - :576 `toBe` expected `true` _(expression)_
    - :577 `toBe` expected `BigInt((parseInt(digest.slice(0, 8), 16) % 50) + 1)` _(expression)_
    - :580 `toBe` expected `modpow(G, s, P)` _(expression)_
    - :581 `toBe` expected `(R * modpow(y, c, P)) % P` _(expression)_
    - :582 `toBe` expected `rhs` _(expression)_
    - :585 `toBe` expected `true` _(expression)_
- `a fixed noncolliding tampered message breaks verification, and the numbers show why` — e2e/claims.spec.ts:588
    - :595 `toContainText` expected `'VERIFIED', { timeout: 15_000 }` _(expression)_
    - :602 `toBe` expected `46n` _(expression)_
    - :603 `toBe` expected `32n` _(expression)_
    - :604 `toBe` expected `originalC` _(expression)_
    - :607 `toContainText` expected `'Tamper detected', { timeout: 15_000 }` _(expression)_
    - :618 `toBe` expected `modpow(G, s, P)` _(expression)_
    - :619 `toBe` expected `expectedRhs` _(expression)_
    - :620 `toBe` expected `originalRhs` _(expression)_
    - :621 `toBe` expected `rhs` _(expression)_
    - :624 `expect` expected _no expected value_ _(none)_
- `Hash commit-reveal` — e2e/claims.spec.ts:636
    - :639 `toBeEnabled` expected _no expected value_ _(none)_
- `the published commitments really are SHA-256 of the revealed bids` — e2e/claims.spec.ts:642
    - :644 `toHaveText` expected `/^[0-9a-f]{64}$/, { timeout: 15_000 }` _(expression)_
    - :645 `toHaveText` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :651 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :652 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :653 `toBe` expected `nonceB` _(expression)_
    - :655 `toHaveText` expected `'*** (hidden)'` _(literal)_
    - :656 `toHaveText` expected `'*** (hidden)'` _(literal)_
    - :659 `toContainText` expected `'matches commitment', { timeout: 15_000 }` _(expression)_
    - :660 `toContainText` expected `'matches commitment'` _(literal)_
    - :666 `toBe` expected `hashA` _(expression)_
    - :667 `toBe` expected `hashB` _(expression)_
    - :672 `expect` expected _no expected value_ _(none)_
    - :674 `expect` expected _no expected value_ _(none)_
    - :675 `expect` expected _no expected value_ _(none)_
- `changing a bid after committing is caught by the published digest` — e2e/claims.spec.ts:679
    - :681 `toHaveText` expected `/^[0-9a-f]{64}$/, { timeout: 15_000 }` _(expression)_
    - :686 `toContainText` expected `'CAUGHT', { timeout: 15_000 }` _(expression)_
    - :692 `toBe` expected `fakeHash` _(expression)_
    - :695 `toBe` expected `publishedHash` _(expression)_
    - :696 `expect` expected _no expected value_ _(none)_
    - :699 `expect` expected _no expected value_ _(none)_
    - :700 `expect` expected _no expected value_ _(none)_
    - :701 `expect` expected _no expected value_ _(none)_
    - :711 `toBeEnabled` expected `{ timeout: 30_000 }` _(expression)_
- `Ali Baba cave` — e2e/claims.spec.ts:714
- `each honest round halves the probability a cheater survives` — e2e/claims.spec.ts:715
    - :718 `toHaveText` expected `'0'` _(literal)_
    - :719 `toHaveText` expected `'100%'` _(literal)_
    - :723 `toContainText` expected `'Exited correct side'` _(literal)_
    - :725 `toHaveText` expected `String(round)` _(expression)_
    - :726 `toHaveText` expected `cheatPct(round, 0.5, 4)` _(expression)_
    - :727 `toHaveText` expected `confidencePct(round, 0.5)` _(expression)_
    - :729 `toBe` expected `true` _(expression)_
- `a bluffing prover is caught, and a caught round never counts` — e2e/claims.spec.ts:733
    - :737 `toBeChecked` expected _no expected value_ _(none)_
    - :740 `toContainText` expected `'CAUGHT bluffing'` _(literal)_
    - :742 `toHaveText` expected `'0'` _(literal)_
    - :743 `toHaveText` expected `'100%'` _(literal)_
    - :744 `toHaveText` expected `'0.00%'` _(literal)_
    - :745 `toBe` expected _no expected value_ _(none)_
    - :753 `toContainText` expected `'Exited correct side'` _(literal)_
    - :754 `toHaveText` expected `'1'` _(literal)_
    - :755 `toHaveText` expected `cheatPct(1, 0.5, 4)` _(expression)_
    - :765 `toBe` expected `i + 1` _(expression)_
    - :766 `toHaveText` expected `String(passes)` _(expression)_
    - :768 `toHaveText` expected _no expected value_ _(none)_
    - :787 `toBeEnabled` expected _no expected value_ _(none)_
    - :789 `toBeEnabled` expected _no expected value_ _(none)_
- `Graph 3-coloring` — e2e/claims.spec.ts:801
    - :804 `toBeEnabled` expected _no expected value_ _(none)_
- `each accepted round tightens the (5/6)^n soundness bound` — e2e/claims.spec.ts:807
    - :808 `toHaveText` expected `'0'` _(literal)_
    - :809 `toHaveText` expected `'100%'` _(literal)_
    - :813 `toHaveText` expected `String(round)` _(expression)_
    - :814 `toHaveText` expected `cheatPct(round, 5 / 6, 2)` _(expression)_
    - :815 `toHaveText` expected `confidencePct(round, 5 / 6)` _(expression)_
    - :819 `expect` expected _no expected value_ _(none)_
    - :820 `expect` expected _no expected value_ _(none)_
    - :824 `toBe` expected `right` _(expression)_
    - :829 `toHaveLength` expected `NODES` _(expression)_
    - :830 `toMatch` expected `/^[0-9a-f]{8}…$/` _(regex)_
    - :831 `toBe` expected `NODES` _(expression)_
- `openings altered after commitment are rejected and do not count` — e2e/claims.spec.ts:834
    - :837 `toHaveText` expected `'2'` _(literal)_
    - :842 `toBeEnabled` expected _no expected value_ _(none)_
    - :844 `toContainText` expected `'Tamper injected'` _(literal)_
    - :846 `toBeEnabled` expected _no expected value_ _(none)_
    - :851 `expect` expected _no expected value_ _(none)_
    - :858 `toHaveText` expected `'2'` _(literal)_
    - :859 `toHaveText` expected `soundnessBefore` _(expression)_
    - :860 `toHaveText` expected `confidenceBefore` _(expression)_
    - :861 `toBe` expected `cheatPct(2, 5 / 6, 2)` _(expression)_
    - :865 `toContainText` expected `'accepted round'` _(literal)_
    - :867 `toBe` expected `2` _(literal)_
- `the transcript extractor measures what the transcript leaks` — e2e/claims.spec.ts:870
    - :872 `toHaveText` expected `String(ALL_COLORINGS)` _(expression)_
    - :873 `toHaveText` expected _no expected value_ _(none)_
    - :879 `toHaveText` expected `/of 243/` _(regex)_
    - :882 `expect` expected _no expected value_ _(none)_
    - :883 `expect` expected _no expected value_ _(none)_
    - :885 `toHaveText` expected `'${(100 / afterThree).toFixed(2)}%'` _(expression)_
    - :888 `toBe` expected `3` _(literal)_
    - :889 `expect` expected _no expected value_ _(none)_
    - :890 `expect` expected _no expected value_ _(none)_
    - :891 `expect` expected _no expected value_ _(none)_
    - :897 `toContainText` expected `'After 8 accepted round'` _(literal)_
    - :899 `expect` expected _no expected value_ _(none)_
    - :900 `expect` expected _no expected value_ _(none)_
    - :901 `toHaveText` expected `'${(100 / afterEight).toFixed(2)}%'` _(expression)_
- `the brute-force attack recovers nothing at 16 bytes and everything at 1` — e2e/claims.spec.ts:904
    - :911 `toHaveText` expected `'—', { timeout: 90_000 }` _(expression)_
    - :912 `toHaveText` expected `'—'` _(literal)_
    - :920 `toBeCloseTo` expected `1, 2` _(expression)_
    - :921 `expect` expected _no expected value_ _(none)_
    - :922 `toHaveText` expected `'0 of ${NODES}'` _(expression)_
    - :925 `toBeCloseTo` expected `0.5, 2` _(expression)_
    - :926 `toBeCloseTo` expected `1, 1` _(expression)_
    - :932 `toBe` expected `3 * 256` _(expression)_
    - :933 `toBe` expected `weakKeyspace / 2` _(expression)_
    - :934 `toHaveText` expected `'${NODES} of ${NODES}'` _(expression)_
    - :944 `expect` expected _no expected value_ _(none)_
    - :945 `expect` expected _no expected value_ _(none)_
    - :947 `expect` expected _no expected value_ _(none)_
    - :950 `expect` expected _no expected value_ _(none)_
    - :951 `expect` expected _no expected value_ _(none)_
    - :954 `toBe` expected `true` _(expression)_
    - :955 `toBe` expected `true` _(expression)_
    - :961 `toBe` expected `RELABELINGS` _(expression)_
    - :962 `expect` expected _no expected value_ _(none)_
    - :963 `toHaveText` expected `'${(100 / RELABELINGS).toFixed(2)}%'` _(expression)_
    - :1067 `toBe` expected `row.polynomial.length - 1` _(expression)_
    - :1068 `toBe` expected `degrees[row.round - 1]` _(expression)_
    - :1069 `expect` expected _no expected value_ _(none)_
    - :1070 `toBe` expected `(horner(row.polynomial, 0n, p) + horner(row.polynomial, 1n, p)) % p` _(expression)_
    - :1071 `toBe` expected `expected` _(expression)_
    - :1072 `toBe` expected `expected` _(expression)_
    - :1073 `toBe` expected `true` _(expression)_
    - :1075 `toBe` expected `honestPartial(terms, challenges, t, variables, p)` _(expression)_
    - :1076 `expect` expected _no expected value_ _(none)_
- `Sum-check and GKR: computed claims` — e2e/claims.spec.ts:1083
    - :1086 `toHaveText` expected `'12'` _(literal)_
- `the printed hypercube sum, the honest transcript and the final evaluation are all recomputed from g` — e2e/claims.spec.ts:1089
    - :1091 `toEqual` expected `['sumcheck-intro', 'sumcheck-statement', 'sum-derivation', 'census-scope', 'gkr-statement', 'gkr-scope']` _(expression)_
    - :1092 `toContainText` expected `'not cryptographically secure'` _(literal)_
    - :1098 `toBe` expected `2147483647n` _(expression)_
    - :1099 `toBe` expected `3` _(literal)_
    - :1100 `toEqual` expected `[3, 1, 1]` _(expression)_
    - :1102 `toBe` expected `12n` _(expression)_
    - :1103 `toBe` expected `12n` _(expression)_
    - :1104 `toBe` expected `'9/${p}'` _(expression)_
    - :1107 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :1109 `toBe` expected `12n` _(expression)_
    - :1111 `toHaveLength` expected `3` _(literal)_
    - :1112 `toEqual` expected `[1n, 2n, 0n, 8n]` _(expression)_
    - :1115 `toEqual` expected `challenges` _(expression)_
    - :1116 `toBe` expected `lastValue` _(expression)_
    - :1117 `toBe` expected `evalTerms(terms, challenges, p)` _(expression)_
    - :1118 `toBe` expected `evalTerms(terms, challenges, p)` _(expression)_
    - :1119 `toContainText` expected `'✓ ACCEPTED'` _(literal)_
- `each refused prover is rejected for the reason the numbers show` — e2e/claims.spec.ts:1122
    - :1128 `toHaveAttribute` expected `'data-state', 'fail'` _(expression)_
    - :1129 `toHaveText` expected `'✗ REJECTED — round 1: s1(0) + s1(1) = 12 but the verifier expected 13 (the claimed sum).'` _(literal)_
    - :1130 `toBe` expected `1` _(literal)_
    - :1131 `toContainText` expected `'never drawn'` _(literal)_
    - :1135 `toHaveAttribute` expected `'data-state', 'fail'` _(expression)_
    - :1137 `toHaveLength` expected `3` _(literal)_
    - :1138 `toBe` expected `true` _(expression)_
    - :1142 `toBe` expected `evaluated` _(expression)_
    - :1143 `toHaveText` expected `'✗ REJECTED — final check: s3(r3) = ${lastValue} but the direct evaluation g(r) = ${evaluated}.'` _(expression)_
    - :1144 `toBe` expected `evaluated` _(expression)_
    - :1148 `toHaveAttribute` expected `'data-state', 'fail'` _(expression)_
    - :1150 `toHaveLength` expected `2` _(literal)_
    - :1153 `toBe` expected `(expectedAtRound2 + 2n) % p` _(expression)_
    - :1154 `toHaveText` expected `'✗ REJECTED — round 2: s2(0) + s2(1) = ${partial[1].sumAt01} but the verifier expected ${expectedAtRound2} (s1(r1)).'` _(expression)_
    - :1158 `toHaveAttribute` expected `'data-state', 'fail'` _(expression)_
    - :1159 `toHaveText` expected `'✗ REJECTED — round 2: the message has degree 3 but the degree bound for X2 is 1.'` _(literal)_
    - :1161 `toHaveLength` expected `4` _(literal)_
    - :1162 `toBe` expected `horner(overDegree[0].polynomial, overDegree[0].challenge!, p)` _(expression)_
- `transcript replay accepts the recorded run and fails closed on every damaged variant` — e2e/claims.spec.ts:1165
    - :1166 `toBeVisible` expected _no expected value_ _(none)_
    - :1167 `toHaveText` expected `'Delete a message but retain its challenge'` _(literal)_
    - :1169 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :1171 `toBe` expected `'sum-check'` _(literal)_
    - :1172 `toHaveLength` expected `3` _(literal)_
    - :1173 `toEqual` expected `[1, 2, 3]` _(expression)_
    - :1175 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :1176 `toContainText` expected `'3 rounds re-checked'` _(literal)_
    - :1189 `toHaveAttribute` expected `'data-state', 'fail'` _(expression)_
    - :1190 `toContainText` expected `'✗ REPLAY REFUSED'` _(literal)_
    - :1191 `toContainText` expected `reason` _(expression)_
    - :1197 `toContainText` expected `'malformed transcript: invalid JSON'` _(literal)_
- `the tiny-field census counts match an independent closed form and the printed bound` — e2e/claims.spec.ts:1200
    - :1203 `toHaveAttribute` expected `'data-value', '2,1'` _(expression)_
    - :1204 `toHaveAttribute` expected `'data-value', '4/13'` _(expression)_
    - :1205 `toBeEnabled` expected _no expected value_ _(none)_
    - :1207 `toHaveAttribute` expected `'data-state', 'pass', { timeout: 60_000 }` _(expression)_
    - :1211 `toBe` expected `37` _(literal)_
    - :1212 `toBe` expected `52` _(literal)_
    - :1213 `toBe` expected `total` _(expression)_
    - :1214 `toBe` expected `total` _(expression)_
    - :1215 `toBe` expected `closedForm` _(expression)_
    - :1216 `toBe` expected `total - closedForm` _(expression)_
    - :1217 `toBe` expected `0` _(literal)_
    - :1218 `toBe` expected `0` _(literal)_
    - :1219 `toBe` expected `0` _(literal)_
    - :1220 `toBe` expected `total` _(expression)_
    - :1221 `toContainText` expected `'carried lie ${closedForm} accepted (= ${closedForm}, within the bound's ${boundCount})'` _(expression)_
    - :1222 `toContainText` expected `'degree 12, agrees with the honest s1 on 12 of 13 points'` _(literal)_
    - :1226 `toHaveText` expected `'✗ REJECTED — round 1: the message has degree 12 but the degree bound for X1 is 2.'` _(literal)_
- `the advertised F5 census uses three actual roots and does not mislabel a permitted full-field degree-4 interpolant` — e2e/claims.spec.ts:1229
    - :1231 `toHaveAttribute` expected `'data-value', '3,1,1'` _(expression)_
    - :1233 `toHaveAttribute` expected `'data-state', 'pass', { timeout: 60_000 }` _(expression)_
    - :1234 `toHaveText` expected `'93'` _(literal)_
    - :1235 `toHaveText` expected `'32'` _(literal)_
    - :1236 `toContainText` expected `'constructed root counts are [3, 1, 1]'` _(literal)_
    - :1240 `toHaveAttribute` expected `'data-value', '4'` _(expression)_
    - :1242 `toHaveAttribute` expected `'data-state', 'pass', { timeout: 60_000 }` _(expression)_
    - :1243 `toHaveText` expected `'4'` _(literal)_
    - :1244 `toHaveText` expected `'0'` _(literal)_
    - :1245 `toContainText` expected `'degree 4 is within the public X1 bound 4'` _(literal)_
    - :1246 `toContainText` expected `'not a degree-bound violation'` _(literal)_
    - :1248 `toContainText` expected `'can pass when r1 ≠ 0'` _(literal)_
- `soundness displays state the randomness assumptions and cap vacuous GKR union sums` — e2e/claims.spec.ts:1251
    - :1252 `toHaveAttribute` expected `'data-assumptions', 'seeded'` _(expression)_
    - :1253 `toContainText` expected `'theorem not applicable to predictable seeded challenges'` _(literal)_
    - :1254 `toHaveAttribute` expected `'data-assumptions', 'seeded'` _(expression)_
    - :1255 `toContainText` expected `'probability guarantee does not apply in seeded mode'` _(literal)_
    - :1258 `toHaveAttribute` expected `'data-value', '21/13'` _(expression)_
    - :1259 `toHaveAttribute` expected `'data-probability-bound', '1'` _(expression)_
    - :1260 `toContainText` expected `'probability bound is only ≤ 1 and is vacuous'` _(literal)_
    - :1262 `toHaveAttribute` expected `'data-assumptions', 'fresh'` _(expression)_
    - :1263 `toContainText` expected `'probability bound is only ≤ 1 and is vacuous'` _(literal)_
- `the GKR walk is recomputed by hand: gate values, wiring extensions, line endpoints and the terminal MLE` — e2e/claims.spec.ts:1266
    - :1269 `toEqual` expected `[3n, 2n, 3n, 1n]` _(expression)_
    - :1272 `toHaveText` expected `String(layer1[gate])` _(expression)_
    - :1273 `toHaveText` expected `String(layer0[gate])` _(expression)_
    - :1274 `toHaveText` expected `'add_0 = {(1,2,3)} · mult_0 = {(0,0,1)} · add_1 = {(0,0,1), (2,2,3)} · mult_1 = {(1,1,2), (3,0,3)}'` _(literal)_
    - :1275 `toHaveAttribute` expected `'data-value', '21/${p}'` _(expression)_
    - :1278 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :1281 `toEqual` expected `layer0` _(expression)_
    - :1283 `toHaveLength` expected `1` _(literal)_
    - :1285 `toBe` expected `(layer0[0] * ((1n - r0[0] + p) % p) + layer0[1] * r0[0]) % p` _(expression)_
    - :1292 `toEqual` expected `point` _(expression)_
    - :1293 `toBe` expected `claim` _(expression)_
    - :1295 `toHaveLength` expected `4` _(literal)_
    - :1298 `toBe` expected `2` _(literal)_
    - :1299 `expect` expected _no expected value_ _(none)_
    - :1300 `toBe` expected `true` _(expression)_
    - :1301 `toBe` expected `(horner(row.polynomial, 0n, p) + horner(row.polynomial, 1n, p)) % p` _(expression)_
    - :1302 `toBe` expected `expected` _(expression)_
    - :1308 `toEqual` expected `rounds.map((row) => row.challenge!)` _(expression)_
    - :1310 `toBe` expected `'${q.length - 1}/2'` _(expression)_
    - :1311 `expect` expected _no expected value_ _(none)_
    - :1313 `toBe` expected `horner(q, 0n, p)` _(expression)_
    - :1314 `toBe` expected `horner(q, 1n, p)` _(expression)_
    - :1316 `toBe` expected `mle2(tables[layer + 1], bStar, p)` _(expression)_
    - :1317 `toBe` expected `mle2(tables[layer + 1], cStar, p)` _(expression)_
    - :1320 `toBe` expected `wiringTilde('add_${layer}', point, bStar, cStar, p)` _(expression)_
    - :1321 `toBe` expected `wiringTilde('mult_${layer}', point, bStar, cStar, p)` _(expression)_
    - :1323 `toBe` expected `(addTilde * ((q0 + q1) % p) + multTilde * (q0 * q1 % p)) % p` _(expression)_
    - :1324 `toBe` expected `expected` _(expression)_
    - :1325 `toBe` expected `expected` _(expression)_
    - :1326 `toBe` expected `'true'` _(literal)_
    - :1330 `toEqual` expected `bStar.map((value, index) => (value + rStar * ((cStar[index] - value + p) % p)) % p)` _(expression)_
    - :1331 `toBe` expected `horner(q, rStar, p)` _(expression)_
    - :1332 `toBe` expected `mle2(tables[layer + 1], nextPoint, p)` _(expression)_
    - :1333 `toHaveAttribute` expected `'data-ok', 'true'` _(expression)_
    - :1338 `toEqual` expected `point` _(expression)_
    - :1339 `toBe` expected `claim` _(expression)_
    - :1340 `toBe` expected `mle2(inputs, point, p)` _(expression)_
    - :1341 `toBe` expected `claim` _(expression)_
    - :1342 `toBe` expected `'true'` _(literal)_
    - :1343 `toContainText` expected `'✓ ACCEPTED — terminal check'` _(literal)_
    - :1344 `toContainText` expected `'Not executed: the log-space-uniformity machinery, the sublinear verifier, Fiat–Shamir, or any general theorem'` _(literal)_
- `the named seeded GKR run rejects each cheating strategy at the stage the verdict names` — e2e/claims.spec.ts:1347
    - :1359 `toHaveAttribute` expected `'data-state', 'pending'` _(expression)_
    - :1361 `toHaveAttribute` expected `'data-state', 'fail'` _(expression)_
    - :1363 `toMatch` expected `pattern` _(expression)_
    - :1369 `toEqual` expected `[30n, 7n]` _(expression)_
    - :1370 `toHaveAttribute` expected `'data-ok', 'true'` _(expression)_
    - :1375 `toBe` expected `mle2([3n, 2n, 3n, 1n], bigList(terminal[0]), p)` _(expression)_
    - :1376 `toBe` expected `BigInt(terminal[1])` _(expression)_
    - :1377 `toBe` expected `'false'` _(literal)_
    - :1379 `toContainText` expected `'survives only if r0 hits'` _(literal)_
    - :1381 `toContainText` expected `'If r* is 0 or 1'` _(literal)_
    - :1383 `toContainText` expected `'a sampled root event can hide the changed gate and accept'` _(literal)_
    - :1385 `toContainText` expected `'a root event can make them equal and accept'` _(literal)_
- `zero line polynomials are displayed with degree minus infinity, not their padded array length` — e2e/claims.spec.ts:1388
    - :1392 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :1395 `toContainText` expected `'−∞ (zero polynomial)'` _(literal)_
- `changing the field, the randomness or the inputs retires every stale result` — e2e/claims.spec.ts:1399
    - :1403 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :1404 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :1405 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :1408 `toHaveText` expected `'101'` _(literal)_
    - :1409 `toHaveAttribute` expected `'data-state', 'pending'` _(expression)_
    - :1410 `toHaveCount` expected `0` _(literal)_
    - :1411 `toHaveValue` expected `''` _(literal)_
    - :1412 `toHaveAttribute` expected `'data-state', 'pending'` _(expression)_
    - :1413 `toHaveAttribute` expected `'data-state', 'pending'` _(expression)_
    - :1414 `toHaveCount` expected `0` _(literal)_
    - :1415 `toContainText` expected `'the previous transcript was retired'` _(literal)_
    - :1418 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :1420 `toHaveAttribute` expected `'data-state', 'pending'` _(expression)_
    - :1421 `toContainText` expected `'fresh verifier randomness'` _(literal)_
    - :1424 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :1427 `toHaveAttribute` expected `'data-state', 'pending'` _(expression)_
    - :1428 `toHaveText` expected `'8'` _(literal)_
    - :1431 `toContainText` expected `'Circuit inputs must be non-negative integers'` _(literal)_
    - :1432 `toHaveText` expected `'8'` _(literal)_
- `an invalid polynomial cannot leave a newly selected field paired with old visible evidence` — e2e/claims.spec.ts:1435
    - :1437 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
    - :1442 `toContainText` expected `'Polynomial not applied'` _(literal)_
    - :1445 `toContainText` expected `'The previous field and statement stay in force'` _(literal)_
    - :1446 `toHaveValue` expected `oldField` _(expression)_
    - :1447 `toHaveText` expected `oldField` _(expression)_
    - :1448 `toHaveText` expected `oldSum` _(expression)_
    - :1449 `toHaveAttribute` expected `'data-state', 'pass'` _(expression)_
- `values from outside the source render as text` — e2e/claims.spec.ts:1457
- `a seed in the URL cannot inject markup into the commit panel` — e2e/claims.spec.ts:1460
    - :1465 `toContainText` expected `'Both commitments published'` _(literal)_
    - :1468 `toContainText` expected `'Seeded run: ${PAYLOAD}'` _(expression)_
    - :1469 `toHaveCount` expected `0` _(literal)_
    - :1470 `toHaveCount` expected `0` _(literal)_
    - :1471 `toHaveTitle` expected `'xss'` _(literal)_
- `a pasted transcript cannot inject markup into the comparison` — e2e/claims.spec.ts:1474
    - :1485 `toContainText` expected `'Protocol:'` _(literal)_
    - :1488 `toBeVisible` expected _no expected value_ _(none)_
    - :1489 `toHaveCount` expected `0` _(literal)_
    - :1490 `toHaveCount` expected `0` _(literal)_
    - :1491 `toContainText` expected `'img src=x onerror='` _(literal)_
    - :1492 `toHaveTitle` expected `'xss'` _(literal)_

**Mutation records** (4 file(s)):

- `e2e/sigma-mutations.spec.ts` (2875 bytes)
- `e2e/sumcheck-mutations.spec.ts` (7403 bytes)
- `scripts/mutation-report.mjs` (3664 bytes)
- `scripts/mutations.mjs` (9759 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-zk-proof-lab

## What It Is

ZK Proof Lab is an interactive educational demo for zero-knowledge proof workflows. Six of the eight exhibits use cryptographically real primitives in the browser: the `Graph 3-Coloring ZKP` commits every region with real Web Crypto SHA-256; `Schnorr Identification`, `Fiat-Shamir`, and `Beyond Schnorr` run exact modular arithmetic; `Hash Commit-Reveal` uses real SHA-256 commitments; and `Sum-Check and GKR` executes the sum-check interactive proof and a bounded GKR layer walk in exact prime-field arithmetic. `Beyond Schnorr` adds Okamoto representation proofs in the RFC 3526 2048-bit group and GQ RSA-root proofs over fresh 2048-bit WebCrypto moduli, alongside a clearly labelled p = 47 exhaustive model. `Sum-Check and GKR` is an interactive-proof and verifiable-computation lesson, not a zero-knowledge one: it says so on the page, and it is not a SNARK. The remaining two exhibits (`Ali Baba Cave`, `zk-SNARK intuition`) are clearly-labelled conceptual models. The lab addresses proving knowledge or correctness without disclosing the secret witness. It is teaching code, not an audited or constant-time cryptographic library.

The zero-knowledge property itself is exhibited rather than asserted. The Graph 3-Coloring page carries an **extractor bench** that lets you attack the hiding claim and watch what the attack actually returns. Attack 1 is a bounded brute-force preimage search that hashes ~200,000 candidate `(colour, nonce)` openings with real Web Crypto SHA-256 against the digests the page just published; it recovers nothing, and reports the fraction of the keyspace that budget covered (~2e-34) alongside the average cost of a real break (~5e38 hashes), so the failure reads as a measurement of scale rather than a claim. The identical attacker function is then re-run against the same colours committed under a deliberately weakened 8-bit nonce, where it recovers every opening in 768 hashes — the only variable is the nonce space. Attack 2 is the extractor a verifier could run offline: given only the challenged edges and the opened colour pairs, it enumerates all 3^5 = 243 colourings and keeps every one no round rules out. Because the palette is re-permuted each round, the candidate set converges on the 18 proper colourings of this graph — which is exactly the statement being proved — and never on a single one, while folding in the broken commitments from Attack 1 collapses it to 6.

There are no published known-answer vectors for the interactive Okamoto or GQ protocols. Their tests instead pin the exact RFC 3526 group-14 prime, independently establish that p and q = (p − 1)/2 are prime, recompute the deterministic h derivation, and verify every protocol and extraction equation with independent arithmetic.

## Exhibits

1. **Ali Baba Cave** — conceptual proof-of-knowledge intuition.
2. **Graph 3-Coloring ZKP** — real SHA-256 commitments plus two extractor attacks.
3. **Schnorr Identification Protocol** — real modular verification and nonce-leak recovery over readable parameters.
4. **Hash Commit-Reveal** — real Web Crypto SHA-256 binding and tamper detection.
5. **Fiat-Shamir (Non-Interactive)** — a hash-derived challenge with an explicit toy-domain collision.
6. **zk-SNARK Intuition** — a clearly labelled conceptual proving pipeline.
7. **Beyond Schnorr: representations and RSA roots** — real 2048-bit Okamoto and GQ proofs, two rewind extractors, exhaustive witness independence at toy size, and a deliberately broken e = 3 GQ challenge space.
8. **Sum-Check and GKR** — the sum-check protocol executed round by round over a selectable prime field (default p = 2^31 − 1) for an explicit low-degree polynomial on {0,1}^v, with every prover polynomial shown, the degree bound and recurrence enforced in every round, each challenge drawn only after its message, and a direct final evaluation; wrong-sum, inconsistent-round, excessive-degree, false-final-evaluation, malformed-transcript and tiny-field exhaustive controls; then the same checked primitive reused for one bounded GKR layer walk over a fixed two-layer add/mult circuit whose wiring, gate values and terminal multilinear-extension evaluation are recomputed independently.

## When to Use It

- Use it for onboarding engineers to zero-knowledge protocol flow because the exhibits show the full transcript lifecycle (commitment, challenge, response, verification) with inspectable values.
- Use it in interviews or classroom demos when you need concrete Schnorr and commit-reveal mechanics in a browser, since the implementation uses real BigInt modular arithmetic and Web Crypto SHA-256.
- Use it to teach *why* a protocol is zero-knowledge rather than to assert that it is, because the graph-coloring extractor bench runs two real attacks against the page's own digests and transcript and prints only what they returned.
- Use it for replayable protocol walkthroughs when deterministic scenarios matter, because the scenario preset and transcript lab pages let teams compare runs and reason about verifier outcomes.
- Use it to explain why Fiat-Shamir removes interactivity, because the dedicated exhibit derives the challenge from hashing transcript inputs and verifies the resulting non-interactive proof.
- Use it to compare Sigma protocols beyond Schnorr: Okamoto proves knowledge of a representation, GQ proves knowledge of an RSA root, and both reveal their witness under a same-commitment rewind.
- Use it to teach how a verifier checks a sum over 2^v points, or a circuit's evaluation, with one evaluation of its own, because the sum-check exhibit prints every round polynomial, every recurrence, every challenge and the soundness calculation from the run, and the GKR act reduces an output claim layer by layer down to the public inputs. The probability guarantees are labelled as requiring fresh, independent, uniformly sampled verifier challenges that remain unpredictable until the owning prover message is fixed; deterministic seeded mode is replayable but does not satisfy that assumption.
- Do NOT use it for production security decisions, because the project explicitly uses toy parameters and small-scale models (and two clearly-labelled conceptual exhibits, cave and snark intuition) rather than deployment-grade cryptographic hardening.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-zk-proof-lab](https://systemslibrarian.github.io/crypto-lab-zk-proof-lab/)**

The demo lets users run eight exhibits, execute protocol rounds, simulate cheating behavior, and inspect verification outcomes and logs. It includes real `Run Protocol`, `Simulate Cheat`, `Submit Bids`, `Reveal Bids`, rewind, replay, and reset controls, plus explicit toy-vs-real parameter boundaries. The project does not provide encryption/decryption flows; it focuses on identification proofs, commitment verification, and transcript-based verification.

## What Can Go Wrong

- Reusing Schnorr nonces (`r`) can leak the secret (`x`) from two transcripts, which breaks the core secrecy guarantee of identification proofs.
- Using small or weak group parameters makes discrete-log attacks practical, so a verifier equation that passes in the toy demo would not imply real-world security.
- Omitting transcript/domain separation details in Fiat-Shamir challenge derivation can enable replay or malleability across contexts, undermining non-interactive soundness assumptions.
- The Fiat-Shamir exhibit deliberately reduces its SHA-256 digest to a challenge in `1..50`. With `?seed=3`, the original and altered messages have different full digests but the same challenge `26`, and verification passes. This is a toy challenge-domain collision, not a SHA-256 collision. All verdict text follows the actual equation and shows original/altered challenges; an unavailable hash produces no tamper verdict. Copy/Replay preserve the original proof. See [RFC 8235 §2.3](https://www.rfc-editor.org/rfc/rfc8235.html#section-2.3) for production-sized challenge and context requirements; this small-parameter exhibit is not an RFC-conforming implementation.
- Reusing or biasing commit-reveal nonces weakens hiding and can leak bid information before reveal, defeating fairness of the commit phase.
- Failing to enforce reveal windows in commit-reveal protocols allows strategic non-reveal (griefing), which is a protocol-level failure even when hash checks are correct.
- Reusing an Okamoto or GQ commitment across two different challenges exposes the representation or RSA root; the rewind panels compute that extraction rather than merely warning about it.
- Choosing a tiny GQ exponent also creates a tiny challenge space. The deliberately broken e = 3 mode shows a prover with only public y passing about one time in three; e = 65537 is the default.
- A sum-check verifier that drops the per-round degree bound can be beaten by a full-field interpolant of degree at most p − 1 that agrees with the honest message everywhere but one point. The exhibit prints its actual degree and shows it rejected on degree only when that degree exceeds the statement's public X1 bound; when the public bound already permits it, the page labels the example as not a degree-bound violation and reports its actual acceptance count. The mutation suite kills a verifier that stops enforcing a genuinely exceeded bound.
- A sum-check verifier's challenges must be drawn after the round's message is fixed. The exhibit's deterministic teaching seed exists so runs replay, and the page labels it as not cryptographically secure verifier randomness: a prover who knows the seed knows every challenge in advance.
- Static transcript replay rechecks structure and arithmetic but carries no timestamps, so it cannot prove that a recorded challenge was historically sampled after its message or was unpredictable. Those properties come from the live phase guard and fresh-random mode, respectively.
- Fields of 13, 7 or 5 elements make the soundness arithmetic readable, not meaningful. The census counts the constructed lie polynomial's actual roots rather than assuming every degree is attained, and the page caps probability bounds at 1 and marks raw union sums at least 1 as vacuous.
- The wrong-output and altered-line controls are probabilistic soundness examples, not guaranteed rejection scripts: a wrong output can survive at a root of its difference polynomial, and q(t) + t(t − 1) is unchanged when the verifier's line challenge is 0 or 1.

## Real-World Usage

- Bitcoin Taproot (BIP340): uses Schnorr signatures over secp256k1 for key-path spends and signature aggregation-friendly design.
- MuSig2 and related multisignature constructions: build threshold/co-signing workflows on Schnorr-style signing equations and nonce commitments.
- Zcash Sapling/Orchard proving systems: use Fiat-Shamir style transcripts to make zk proofs non-interactive in the random-oracle model.
- PLONK-family proving systems (including Halo2-style transcript designs): derive verifier challenges via Fiat-Shamir hashing of commitments and transcript state.
- Commit-reveal workflows in blockchain applications (sealed-bid auctions, name-registration schemes): use hash commitments first and delayed reveal to prevent premature disclosure and last-moment changes.

## Sources for Exhibit 08

- Lund, C., Fortnow, L., Karloff, H., Nisan, N. “Algebraic Methods for Interactive Proof Systems.” J. ACM 39(4):859–868, October 1992. doi:10.1145/146585.146605. Read in the author-hosted version (10 pages): §3 “The Protocol” (Theorem 1, Lemma 3, Lemma 4 — two distinct degree-≤r polynomials agree on at most r points, so a random a catches a wrong one with probability ≥ 1 − r/p — and the formal Expand/Shrink protocol with its N³/p bound) and §4 “Extensions” (Babai's O(N)-round Lagrange-basis shrink, and the note that Babai–Fortnow and Shamir arithmetize formulas and use “a protocol similar to that of Section 3” to count satisfying assignments). The paper states the technique for the permanent; the one-variable-per-round sum over {0,1}^v executed by the exhibit is that applied form.
- Goldwasser, S., Kalai, Y. T., Rothblum, G. N. “Delegating Computation: Interactive Proofs for Muggles.” STOC 2008, doi:10.1145/1374376.1374396; full version ECCC TR17-108, revision 1 (24 December 2017), 70 pages. Read: §2.5 “Interactive Sum-Check Protocol” (Figure 2, the protocol as executed in Act A, and Lemma 2.5 with soundness m·d/|F| and its proof); §3.1 (layered circuit of fan-in 2, add_i/mult_i as equations (4) and (5), the low-degree extensions Ṽ_i); §3.2 (the i'th phase — the sum-check over the wiring identity, the prover supplying Ṽ_i(ω₁), Ṽ_i(ω₂), and the line reduction steps 1–4 — and the final verification against the input's extension); §3.3 (soundness 7mdδ/|F|). GKR sum over H^m for an extension field H of GF(2) with low-degree extensions of degree δ and a β̃ factor; the exhibit takes H = {0,1} and the multilinear extensions, and reduces two claims to one on the line with ℓ(0) = b*, ℓ(1) = c* rather than GKR's fixed t₁, t₂. Both adaptations are stated on the page.
- Thaler, J. *Proofs, Arguments, and Zero-Knowledge*, manuscript dated 18 July 2023, consulted for notation and as the source of the worked example: §3.5 (Fact 3.5, Lemma 3.6 — the multilinear Lagrange basis, equations 3.1–3.2 — and Lemma 3.7), §4.1 (the sum-check description, Proposition 4.1 with error vd/|F|, and the worked example g = 2X₁³ + X₁X₃ + X₂X₃ with H = 12, s₁ = 8X₁³ + 2X₁ + 1, s₂ = 34 + X₂ at r₁ = 2, s₃ = 16 + 5X₃ at r₂ = 3, which the unit tests reproduce exactly), §4.6.4 (Lemma 4.7, equations 4.17–4.18, Remark 4.4 on the multilinear simplification, and Figure 4.13, the self-contained description Act B follows). This is a secondary source; the protocol is attributed to the two papers above.

The tests reproduce Thaler's published sum-check worked example. For the lab-specific bounded GKR circuit, they independently recompute the hypercube sum, every round polynomial, every multilinear extension and every wiring predicate; the tiny-field census compares the verifier's counts with a separately derived root-count formula.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-zk-proof-lab
cd crypto-lab-zk-proof-lab
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-zk-arena](https://systemslibrarian.github.io/crypto-lab-zk-arena/) — side-by-side comparison of zk-SNARK and zk-STARK proof-system tradeoffs.
- [crypto-lab-snark-arena](https://systemslibrarian.github.io/crypto-lab-snark-arena/) — compares zk-SNARK constructions (Groth16, PLONK) and their trusted setup.
- [crypto-lab-stark-tower](https://systemslibrarian.github.io/crypto-lab-stark-tower/) — transparent, post-quantum zk-STARKs built on AIR constraints and FRI.
- [crypto-lab-commit-gate](https://systemslibrarian.github.io/crypto-lab-commit-gate/) — hash and Pedersen commitments demonstrating the binding and hiding properties.
- [crypto-lab-bulletproofs](https://systemslibrarian.github.io/crypto-lab-bulletproofs/) — short range proofs with no trusted setup via the inner-product argument.
- [crypto-lab-schnorr-forge](https://systemslibrarian.github.io/crypto-lab-schnorr-forge/) — same-commitment nonce reuse turned into Schnorr key recovery.
- [crypto-lab-threshold-decrypt](https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/) — Chaum–Pedersen proofs for threshold partial decryptions.
- [crypto-lab-credential-veil](https://systemslibrarian.github.io/crypto-lab-credential-veil/) — a Chaum–Pedersen OR proof inside a hidden age predicate.
- [crypto-lab-rsa-forge](https://systemslibrarian.github.io/crypto-lab-rsa-forge/) — interactive RSA failure modes and attacks.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

### GQ input verification correction

The prover now rejects inputs outside the canonical unit range before computing a
transcript. Rewinding preserves named membership errors and reports a nontrivial gcd
as a discovered factor, rather than hiding it behind a generic transcript rejection.
Retiring a result also disables its copy controls. The deploy gate replays all fifteen
source mutations — six for Exhibit 07 and nine for Exhibit 08 — with structured reports;
crashes, missing tests, and setup failures cannot count as kills.

```

</details>

---

## STARK Tower

- **slug**: `crypto-lab-stark-tower`
- **repo**: https://github.com/systemslibrarian/crypto-lab-stark-tower
- **live**: https://systemslibrarian.github.io/crypto-lab-stark-tower/
- **commit_sha**: `9f5b58e40fa8a17ca25abcdc8523f7a6c7af840f` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ZERO-KNOWLEDGE  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, verification

**Name (H1)**: STARK Tower  — _read from index.html_

**Subtitle**: zk-STARK · AIR + FRI · Post-Quantum  — _read from index.html_

**Description**: Run a real (if small) STARK in your browser — build a trace polynomial and AIR constraints, commit with a SHA-256 Merkle tree, and inspect every check that accepts the honest proof and rejects the supplied tampered fixture.  — _read from index.html_

**Why it matters**: STARKs need no trusted setup. Their commitments are hash based, while FRI contributes information-theoretic proximity errors and the non-interactive Fiat-Shamir/BCS step is analyzed in a random-oracle model. Their post-quantum security is therefore conjectured  — _read from index.html_

**Card copy**: Run a toy STARK prover and verifier over a fixed field, then use a separate ledger to distinguish exact FRI arithmetic, conditional query terms, heuristics, empirical outcomes, and still-missing end-to-end soundness terms.

**Chips**: zk-STARK · AIR Constraints · FRI · Soundness Ledger

**Implements**: Fiat-Shamir `src/stark.ts:421`, FRI `src/stark.ts:754`, Merkle tree `src/merkle.ts:72`, SHA-256 `src/merkle.ts:55`, STARK `src/stark.ts:189`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: NTT `src/field.ts:6`, Pairing `src/merkle.ts:3`, Reed-Solomon `src/soundness.ts:7`

**References**: BLAKE3, Bulletproofs, Groth16, NTT, PLONK, Pairing, Schnorr, Shor's algorithm

**Standards body**: NIST

**Implementation**: local TypeScript finite-field, Merkle, FRI and STARK teaching implementation / WebCrypto SHA-256

**Spec citations, exactly as written**:

- `doi.org/10.4230/LIPIcs.ICALP.2018.14` — first seen index.html:156 (1×)
- `ePrint 2025/1993` — first seen README.md:93 (2×)
- `ePrint 2025/2197` — first seen README.md:92 (1×)
- `ePrint 2026/1367` — first seen README.md:91 (3×)
- `eprint.iacr.org/2018/046` — first seen index.html:155 (1×)
- `eprint.iacr.org/2025/1993` — first seen README.md:93 (2×)
- `eprint.iacr.org/2025/2197` — first seen README.md:92 (2×)
- `eprint.iacr.org/2026/1367` — first seen README.md:91 (2×)

**README — What Can Go Wrong**:

```text
- **Large proofs** — STARK proofs run ~45–200 KB versus 128 bytes for Groth16, a real cost wherever bandwidth or storage is tight.
- **Expensive on-chain verification** — STARK verification is far costlier than Groth16 (~50 ms vs ~1 ms), so tight gas budgets can make it impractical.
- **Query arithmetic is not protocol soundness** — at rate `ρ=1/8` and eight queries, `−log₂(ρ⁸)=24` is exact arithmetic for a capacity-level sampling model. It is displayed as a **heuristic query term**, never as FRI or STARK security. The unique-decoding-radius query-only reference is about 6.64 bits only when both the actual distance and `θ` reach `(1−ρ)/2`. If the actual distance is at least the Johnson radius and `θ` approaches `1−√ρ` from below, the query-only value approaches 12 bits as a strict limit. Neither includes fold-round MCA errors or surrounding protocol terms.
- **The complete bounds are not established here** — applying CL146 requires the actual initial-word distance `δ`, a tradeoff `θ`, and every fold's MCA error. An end-to-end non-interactive STARK analysis must additionally justify AIR/composition algebraic errors, Merkle/hash binding and Fiat-Shamir/BCS loss. The executable ledger leaves both results `NOT ESTABLISHED` rather than treating missing terms as zero.
- **Field choice matters** — FRI needs a field with high 2-adicity (here `3·2³⁰+1`); a field like `2³¹−1` with 2-adicity 1 cannot support honest power-of-two evaluation domains or real folding.
- **Toy simplifications** — short traces and Lagrange interpolation (instead of NTT) keep the demo legible but are not how a production STARK scales; the ZK property here is shown empirically, not via a full simulator proof.
```

**Claims tested** (e2e/claims.spec.ts, 28 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:35
    - :35 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:47
    - :47 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:110
    - :110 `toHaveText` expected `'Folding…', { timeout: 30_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:113
    - :113 `toContainText` expected `/FINAL-CODE MEMBERSHIP/, { timeout: 30_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:114
    - :114 `toHaveText` expected `'Folding…'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:120
    - :120 `toBeVisible` expected _no expected value_ _(none)_
- `AIR: the rendered trace is the Fibonacci sequence, and its residuals are recomputed from it` — e2e/claims.spec.ts:125
    - :129 `toHaveLength` expected `Number(n)` _(expression)_
    - :130 `toEqual` expected `fibTrace(Number(n))` _(expression)_
    - :131 `toBe` expected `'boundary'` _(literal)_
    - :132 `toBe` expected `'boundary'` _(literal)_
    - :133 `toBe` expected `true` _(expression)_
    - :138 `toHaveLength` expected `Number(n) - 2` _(expression)_
    - :140 `toBe` expected `fmod(rows[r.i + 2].value - rows[r.i + 1].value - rows[r.i].value)` _(expression)_
    - :141 `toBe` expected `0n` _(expression)_
    - :142 `toBe` expected `false` _(expression)_
    - :146 `expect` expected _no expected value_ _(none)_
    - :147 `expect` expected _no expected value_ _(none)_
    - :148 `toHaveClass` expected `/status-ok/` _(regex)_
- `AIR: tampering one row makes exactly the residuals that touch it nonzero` — e2e/claims.spec.ts:152
    - :161 `toEqual` expected `[row]` _(expression)_
    - :162 `toBe` expected `fmod(honest[row] + 1n)` _(expression)_
    - :163 `toBe` expected `honest[r.i]` _(expression)_
    - :170 `toEqual` expected `expectViolated` _(expression)_
    - :171 `expect` expected _no expected value_ _(none)_
    - :173 `toBe` expected `fmod(rows[r.i + 2].value - rows[r.i + 1].value - rows[r.i].value)` _(expression)_
    - :174 `toBe` expected `r.value !== 0n` _(expression)_
    - :177 `toHaveClass` expected `/status-bad/` _(regex)_
    - :178 `toContainText` expected `'VIOLATED'` _(literal)_
    - :182 `toHaveClass` expected `/status-ok/` _(regex)_
    - :183 `toBe` expected `true` _(expression)_
- `quotient: the honest trace divides cleanly and Q has the degree the flow claims` — e2e/claims.spec.ts:201
    - :211 `expect` expected _no expected value_ _(none)_
    - :215 `toBe` expected `size - 2` _(expression)_
    - :216 `toBe` expected `size - 2` _(expression)_
    - :217 `toBe` expected `degC` _(expression)_
    - :218 `toBe` expected `degC - degZ` _(expression)_
    - :219 `toBe` expected `degQ` _(expression)_
    - :222 `toBe` expected `size - 2` _(expression)_
    - :223 `expect` expected _no expected value_ _(none)_
    - :224 `expect` expected _no expected value_ _(none)_
    - :225 `expect` expected _no expected value_ _(none)_
    - :226 `toHaveClass` expected `/status-ok/` _(regex)_
    - :227 `expect` expected _no expected value_ _(none)_
- `quotient: every sampled point satisfies Q(x)*Z(x) = C(x) in the field` — e2e/claims.spec.ts:231
    - :235 `expect` expected _no expected value_ _(none)_
    - :237 `toBe` expected `0n` _(expression)_
    - :238 `toBe` expected `fmod(s.c)` _(expression)_
    - :239 `expect` expected _no expected value_ _(none)_
    - :240 `expect` expected _no expected value_ _(none)_
- `quotient: tampering makes the division dirty and the degree explode` — e2e/claims.spec.ts:245
    - :254 `expect` expected _no expected value_ _(none)_
    - :257 `expect` expected _no expected value_ _(none)_
    - :258 `expect` expected _no expected value_ _(none)_
    - :259 `toBe` expected `remDeg` _(expression)_
    - :260 `toBe` expected `remDeg` _(expression)_
    - :262 `expect` expected _no expected value_ _(none)_
    - :263 `expect` expected _no expected value_ _(none)_
    - :264 `toBe` expected `degQ` _(expression)_
    - :265 `toBe` expected `degQ` _(expression)_
    - :266 `expect` expected _no expected value_ _(none)_
    - :267 `expect` expected _no expected value_ _(none)_
    - :268 `toHaveClass` expected `/status-bad/` _(regex)_
    - :269 `toContainText` expected `'nonzero remainder'` _(literal)_
    - :273 `expect` expected _no expected value_ _(none)_
    - :274 `toHaveClass` expected `/status-ok/` _(regex)_
- `FRI: the honest fixture reaches the eight-value final code on the printed schedule` — e2e/claims.spec.ts:279
    - :288 `toBe` expected `domain` _(expression)_
    - :290 `toBe` expected `table[r - 1].size / 2` _(expression)_
    - :291 `expect` expected _no expected value_ _(none)_
    - :293 `toBe` expected `8` _(literal)_
    - :294 `toEqual` expected `table.map((_, i) => i)` _(expression)_
    - :296 `expect` expected _no expected value_ _(none)_
    - :297 `expect` expected _no expected value_ _(none)_
    - :299 `expect` expected _no expected value_ _(none)_
    - :300 `toBe` expected `0` _(literal)_
    - :301 `toHaveClass` expected `/verdict-ok/` _(regex)_
    - :302 `toContainText` expected `'honest trace'` _(literal)_
    - :308 `toBe` expected `table.length - 1` _(expression)_
    - :309 `toBe` expected `domain` _(expression)_
    - :310 `toBe` expected `domain >> folds` _(expression)_
    - :313 `toBe` expected `queries * pathHashesPerQuery * 32` _(expression)_
    - :314 `expect` expected _no expected value_ _(none)_
    - :318 `toBe` expected `table.reduce((acc, r) => acc + r.size, 0)` _(expression)_
- `FRI: the fixed tampered trace fails final-code membership, and the diagram marks it` — e2e/claims.spec.ts:322
    - :327 `expect` expected _no expected value_ _(none)_
    - :328 `expect` expected _no expected value_ _(none)_
    - :329 `toHaveClass` expected `/verdict-bad/` _(regex)_
    - :330 `toContainText` expected `'TAMPERED trace'` _(literal)_
    - :331 `toContainText` expected `'Exhibit 02'` _(literal)_
    - :335 `expect` expected _no expected value_ _(none)_
    - :337 `expect` expected _no expected value_ _(none)_
    - :338 `toBe` expected `last.size` _(expression)_
    - :342 `expect` expected _no expected value_ _(none)_
- `FRI: the abstract-polynomial source accepts low degree and rejects an injected term` — e2e/claims.spec.ts:345
    - :347 `toBeVisible` expected _no expected value_ _(none)_
    - :348 `toBeHidden` expected _no expected value_ _(none)_
    - :354 `expect` expected _no expected value_ _(none)_
    - :356 `toBe` expected `Number(degree)` _(expression)_
    - :357 `toBe` expected `0` _(literal)_
    - :362 `expect` expected _no expected value_ _(none)_
    - :363 `toContainText` expected `'deliberately high-degree fixture'` _(literal)_
    - :364 `expect` expected _no expected value_ _(none)_
    - :368 `toBeVisible` expected _no expected value_ _(none)_
    - :369 `expect` expected _no expected value_ _(none)_
- `FRI: a superseded fold cannot repaint evidence for older controls` — e2e/claims.spec.ts:372
    - :373 `toHaveText` expected `'Folding…', { timeout: 30_000 }` _(expression)_
    - :381 `toContainText` expected `'honest trace', { timeout: 30_000 }` _(expression)_
    - :382 `toBe` expected `8 * 8` _(expression)_
    - :384 `toBe` expected `8 * 8` _(expression)_
- `proof size: the benchmark table matches the chart and the size ordering the README claims` — e2e/claims.spec.ts:389
    - :393 `expect` expected _no expected value_ _(none)_
    - :397 `toBe` expected `128` _(literal)_
    - :398 `toBe` expected `400` _(literal)_
    - :401 `expect` expected _no expected value_ _(none)_
    - :402 `expect` expected _no expected value_ _(none)_
    - :403 `expect` expected _no expected value_ _(none)_
    - :410 `toEqual` expected `rows.map((r) => r[0])` _(expression)_
    - :411 `toEqual` expected `bytes` _(expression)_
- `proof size: this demo measures its own proof, and JSON transport is bigger than the binary count` — e2e/claims.spec.ts:414
    - :416 `toContainText` expected `'compact binary model', { timeout: 30_000 }` _(expression)_
    - :419 `toBe` expected `16` _(literal)_
    - :420 `toBe` expected `8` _(literal)_
    - :421 `toBe` expected `8` _(literal)_
    - :424 `expect` expected _no expected value_ _(none)_
    - :425 `expect` expected _no expected value_ _(none)_
    - :426 `expect` expected _no expected value_ _(none)_
- `query-model calculator: arithmetic, classifications and authentication bytes stay consistent` — e2e/claims.spec.ts:429
    - :435 `toHaveText` expected `String(blowup)` _(expression)_
    - :436 `toHaveText` expected `String(queries)` _(expression)_
    - :439 `toBe` expected `queries * rateLog` _(expression)_
    - :443 `toBeCloseTo` expected `queries * Math.log10(blowup), 1` _(expression)_
    - :451 `toBe` expected `Number(((queries * pathHashesPerQuery * 32) / 1024).toFixed(1))` _(expression)_
    - :455 `expect` expected _no expected value_ _(none)_
    - :456 `toBe` expected `bits` _(expression)_
    - :457 `expect` expected _no expected value_ _(none)_
    - :458 `expect` expected _no expected value_ _(none)_
    - :459 `expect` expected _no expected value_ _(none)_
    - :463 `toHaveLength` expected `5` _(literal)_
    - :464 `toEqual` expected `['Capacity model', '${bits} bits', 'heuristic query arithmetic']` _(expression)_
    - :465 `expect` expected _no expected value_ _(none)_
    - :466 `expect` expected _no expected value_ _(none)_
    - :467 `toBe` expected `'NOT ESTABLISHED'` _(literal)_
    - :468 `toBe` expected `'NOT ESTABLISHED'` _(literal)_
- `query-model calculator: toy parameters keep 24 heuristic and all stronger claims unestablished` — e2e/claims.spec.ts:472
    - :475 `toHaveText` expected `'24'` _(literal)_
    - :476 `toBeCloseTo` expected `Math.log10(8 ** 8), 1` _(expression)_
    - :480 `expect` expected _no expected value_ _(none)_
    - :481 `toBeCloseTo` expected `Math.log10(8 ** 8), 1` _(expression)_
    - :482 `expect` expected _no expected value_ _(none)_
    - :483 `expect` expected _no expected value_ _(none)_
    - :488 `toBe` expected `'24 bits'` _(literal)_
    - :489 `toBeCloseTo` expected `6.64, 2` _(expression)_
    - :490 `toBe` expected `'< 12 bits'` _(literal)_
    - :491 `expect` expected _no expected value_ _(none)_
    - :492 `expect` expected _no expected value_ _(none)_
    - :500 `toContainText` expected `mode === 'corrupt' ? 'TAMPERED' : 'The proof is', { timeout: 60_000 }` _(expression)_
    - :507 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
- `prove: the succinctness counters are internally consistent` — e2e/claims.spec.ts:535
    - :539 `toBe` expected `16` _(literal)_
    - :540 `toBe` expected `s.traceLen * 8` _(expression)_
    - :541 `expect` expected _no expected value_ _(none)_
    - :542 `expect` expected _no expected value_ _(none)_
    - :543 `expect` expected _no expected value_ _(none)_
    - :544 `toBe` expected `Math.round((s.unique / s.lde) * 100)` _(expression)_
    - :545 `toBe` expected `8 * Math.log2(s.traceLen) * 2` _(expression)_
    - :549 `toBe` expected `s.unique + s.fri` _(expression)_
    - :550 `toBe` expected `24` _(literal)_
    - :551 `toBe` expected `numAfter(status, 'The proof is')` _(expression)_
    - :555 `expect` expected _no expected value_ _(none)_
    - :556 `toBeCloseTo` expected `jsonBytes / proofBytes, 1` _(expression)_
    - :557 `expect` expected _no expected value_ _(none)_
    - :558 `expect` expected _no expected value_ _(none)_
    - :559 `expect` expected _no expected value_ _(none)_
    - :560 `toHaveLength` expected `2` _(literal)_
- `prove: the query inspector index chain is the one the protocol dictates` — e2e/claims.spec.ts:563
    - :571 `expect` expected _no expected value_ _(none)_
    - :572 `expect` expected _no expected value_ _(none)_
    - :577 `toHaveLength` expected `3` _(literal)_
    - :578 `toEqual` expected `[` _(expression)_
    - :582 `toBe` expected `Math.log2(L)` _(expression)_
    - :583 `expect` expected _no expected value_ _(none)_
    - :590 `toHaveLength` expected `Math.log2(s.traceLen)` _(expression)_
    - :594 `toBe` expected `carry % half` _(expression)_
    - :595 `toBe` expected `(carry % half) + half` _(expression)_
    - :598 `expect` expected _no expected value_ _(none)_
- `verify: an honest proof passes every check and is ACCEPTED` — e2e/claims.spec.ts:601
    - :605 `expect` expected _no expected value_ _(none)_
    - :606 `toEqual` expected `[]` _(expression)_
    - :607 `expect` expected _no expected value_ _(none)_
    - :608 `expect` expected _no expected value_ _(none)_
    - :609 `expect` expected _no expected value_ _(none)_
    - :610 `toHaveClass` expected `/verdict-ok/` _(regex)_
    - :611 `toHaveCount` expected `0` _(literal)_
- `verify: the fixed corrupted fixture fails final-code membership, with no recomputation` — e2e/claims.spec.ts:614
    - :616 `expect` expected _no expected value_ _(none)_
    - :617 `toBe` expected `8` _(literal)_
    - :618 `expect` expected _no expected value_ _(none)_
    - :619 `expect` expected _no expected value_ _(none)_
    - :622 `expect` expected _no expected value_ _(none)_
    - :623 `toHaveClass` expected `/verdict-bad/` _(regex)_
    - :627 `toEqual` expected `['FRI final-code membership (8 evaluations, degree < 1)']` _(expression)_
    - :629 `toBe` expected `true` _(expression)_
    - :630 `toBe` expected `true` _(expression)_
    - :633 `expect` expected _no expected value_ _(none)_
    - :634 `expect` expected _no expected value_ _(none)_
    - :635 `expect` expected _no expected value_ _(none)_
    - :636 `expect` expected _no expected value_ _(none)_
    - :640 `expect` expected _no expected value_ _(none)_
- `verify: zero-knowledge mode masks the trace and the masked proof still verifies` — e2e/claims.spec.ts:643
    - :649 `expect` expected _no expected value_ _(none)_
    - :652 `toBe` expected `plain.traceLen` _(expression)_
    - :653 `expect` expected _no expected value_ _(none)_
    - :654 `toBe` expected `0` _(literal)_
    - :655 `expect` expected _no expected value_ _(none)_
    - :658 `toEqual` expected `[]` _(expression)_
    - :659 `expect` expected _no expected value_ _(none)_
- `verify: pressing Verify with no proof says so instead of claiming anything` — e2e/claims.spec.ts:662
    - :664 `toHaveText` expected `'Generate a proof first.'` _(literal)_
    - :665 `toHaveCount` expected `0` _(literal)_
- `prove: changed inputs retire completed and in-flight proof evidence` — e2e/claims.spec.ts:668
    - :673 `toHaveText` expected `'Inputs changed. Generate a new proof for the current settings.'` _(literal)_
    - :674 `expect` expected _no expected value_ _(none)_
    - :675 `expect` expected _no expected value_ _(none)_
    - :676 `toContainText` expected `'No proof generated for the current settings.'` _(literal)_
    - :678 `toHaveText` expected `'Generate a proof first.'` _(literal)_
    - :689 `toContainText` expected `'Proof generated for n=8', { timeout: 60_000 }` _(expression)_
    - :690 `toBe` expected `8` _(literal)_
    - :692 `toContainText` expected `'Proof generated for n=8'` _(literal)_
    - :693 `toBe` expected `8` _(literal)_
- `zk: a masked opening changes on every reveal while the secret stays fixed` — e2e/claims.spec.ts:698
    - :703 `expect` expected _no expected value_ _(none)_
    - :708 `toBe` expected `secret` _(expression)_
    - :711 `toBe` expected `6` _(literal)_
    - :712 `toContainText` expected `'unchanged'` _(literal)_
    - :715 `toBe` expected `6` _(literal)_
    - :716 `expect` expected _no expected value_ _(none)_
    - :718 `expect` expected _no expected value_ _(none)_
- `zk: masked openings match the witness-free simulator and never leak the true value` — e2e/claims.spec.ts:721
    - :724 `toContainText` expected `'fresh-randomness runs', { timeout: 30_000 }` _(expression)_
    - :730 `toHaveLength` expected `4` _(literal)_
    - :734 `expect` expected _no expected value_ _(none)_
    - :735 `expect` expected _no expected value_ _(none)_
    - :736 `toBe` expected `trials` _(expression)_
    - :738 `toBe` expected `0` _(literal)_
    - :739 `toHaveClass` expected `/status-ok/` _(regex)_
    - :740 `expect` expected _no expected value_ _(none)_
    - :744 `toBe` expected `Number(/max gap ([\d.]+)%/.exec(note)![1])` _(expression)_
    - :745 `expect` expected _no expected value_ _(none)_
    - :746 `expect` expected _no expected value_ _(none)_
    - :750 `toBe` expected `16` _(literal)_
    - :751 `toBe` expected `buckets` _(expression)_
    - :752 `toBe` expected `buckets` _(expression)_

**Mutation records** (1 file(s)):

- `scripts/mutations.mjs` (4573 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-stark-tower

## What It Is

STARK Tower is an **honest, working** browser demonstration of zk-STARKs (Scalable Transparent ARguments of Knowledge; Ben-Sasson et al., 2018) — the post-quantum alternative to pairing-based SNARKs. STARKs require no trusted setup and scale quasi-linearly. Their commitments rely on hash security, FRI contributes information-theoretic proximity errors, and the non-interactive Fiat-Shamir/BCS step is analyzed in a random-oracle model; their post-quantum security is therefore conjectured, not proved. They express computation as an Arithmetic Intermediate Representation (AIR) of polynomial constraints and use FRI (Fast Reed–Solomon IOP) as a transparent low-degree test. The cost is larger proofs (~45–200 KB vs 128 bytes for Groth16).

What makes this demo different from a hand-wave: **the verifier rejects the supplied tampered fixtures without re-running the computation.** It checks authenticated openings, composition consistency, membership in the final degree-`<1` code and sampled FRI fold relations. Tampering one trace cell makes the generated constraint quotient fail polynomial division; for the transcript-derived challenges in this run, its eight final evaluations do not agree and verification rejects. A dedicated **quotient exhibit** makes that causal path visible with exact field arithmetic. This is empirical evidence for the generated fixtures, not a universal soundness experiment.

## When to Use It

- ✅ When a trusted setup ceremony is not feasible or acceptable
- ✅ When post-quantum security is required for long-term proof validity
- ✅ For large-scale computations where STARK proving time beats SNARKs
- ✅ When proving general RISC-V or VM execution (Risc Zero, Miden VM)
- ✅ Off-chain integrity proofs where proof size is not a constraint
- ❌ On-chain verification under tight gas limits — STARK verification is far more expensive than Groth16 (~50 ms vs ~1 ms)
- ❌ When proof size is critical — 45–200 KB vs 128 bytes for Groth16
- ❌ For small circuits where SNARK setup cost is acceptable — Groth16 is faster and smaller
- ❌ As a production proving system — this is a toy-parameter teaching demo with short traces and Lagrange interpolation instead of an NTT; it does not establish a numeric end-to-end soundness bound

## Live Demo

**[systemslibrarian.github.io/crypto-lab-stark-tower](https://systemslibrarian.github.io/crypto-lab-stark-tower/)**

The demo presents an orientation comparing STARKs and SNARKs; an interactive AIR exhibit with a single-column Fibonacci trace where tampering a row makes a residual nonzero; a **quotient exhibit** that divides `C(x)` by `Z(x)` on that same trace; a FRI exhibit with even/odd coset folding and per-layer SHA-256 Merkle roots; a proof-size benchmark with a query-model/error ledger; a full prove-and-verify exhibit with independently visible checks; a zero-knowledge masking mode; and a production survey. Generate an honest proof, inspect all eight final evaluations, verify it, then build the fixed tampered fixture and observe its actual rejection without a trace recomputation.

## What Can Go Wrong

- **Large proofs** — STARK proofs run ~45–200 KB versus 128 bytes for Groth16, a real cost wherever bandwidth or storage is tight.
- **Expensive on-chain verification** — STARK verification is far costlier than Groth16 (~50 ms vs ~1 ms), so tight gas budgets can make it impractical.
- **Query arithmetic is not protocol soundness** — at rate `ρ=1/8` and eight queries, `−log₂(ρ⁸)=24` is exact arithmetic for a capacity-level sampling model. It is displayed as a **heuristic query term**, never as FRI or STARK security. The unique-decoding-radius query-only reference is about 6.64 bits only when both the actual distance and `θ` reach `(1−ρ)/2`. If the actual distance is at least the Johnson radius and `θ` approaches `1−√ρ` from below, the query-only value approaches 12 bits as a strict limit. Neither includes fold-round MCA errors or surrounding protocol terms.
- **The complete bounds are not established here** — applying CL146 requires the actual initial-word distance `δ`, a tradeoff `θ`, and every fold's MCA error. An end-to-end non-interactive STARK analysis must additionally justify AIR/composition algebraic errors, Merkle/hash binding and Fiat-Shamir/BCS loss. The executable ledger leaves both results `NOT ESTABLISHED` rather than treating missing terms as zero.
- **Field choice matters** — FRI needs a field with high 2-adicity (here `3·2³⁰+1`); a field like `2³¹−1` with 2-adicity 1 cannot support honest power-of-two evaluation domains or real folding.
- **Toy simplifications** — short traces and Lagrange interpolation (instead of NTT) keep the demo legible but are not how a production STARK scales; the ZK property here is shown empirically, not via a full simulator proof.

## Real-World Usage

- **StarkNet and StarkEx** — StarkWare's L2s use STARK proofs to scale Ethereum with validity proofs.
- **Risc Zero** — a general-purpose zkVM proving RISC-V execution with STARKs.
- **Polygon Miden** — a STARK-based zk-rollup and virtual machine.
- **Transparent, post-quantum proof systems** — STARKs are chosen where a trusted setup is unacceptable and long-term quantum resistance matters.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-stark-tower
cd crypto-lab-stark-tower
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-snark-arena](https://systemslibrarian.github.io/crypto-lab-snark-arena/) — Groth16 and PLONK, the pairing-based SNARKs STARKs are contrasted against.
- [crypto-lab-zk-arena](https://systemslibrarian.github.io/crypto-lab-zk-arena/) — side-by-side comparison of zk-SNARK and zk-STARK proof systems.
- [crypto-lab-bulletproofs](https://systemslibrarian.github.io/crypto-lab-bulletproofs/) — transparent-setup range proofs via inner-product arguments.
- [crypto-lab-mpcith-sign](https://systemslibrarian.github.io/crypto-lab-mpcith-sign/) — MPC-in-the-Head, a post-quantum signature built from zero-knowledge proofs.
- [crypto-lab-zk-proof-lab](https://systemslibrarian.github.io/crypto-lab-zk-proof-lab/) — Schnorr commitments and Fiat-Shamir, the foundations of non-interactive proofs.

## Why the STARK-101 Field

Arithmetic is over `p = 3·2^30 + 1 = 3221225473`, the field from StarkWare's STARK-101 tutorial. This is deliberate: a Mersenne prime like `2^31 − 1` has 2-adicity 1 (no power-of-two subgroup), so you *cannot* build honest NTT-style evaluation domains or real FRI folding in it. `3·2^30 + 1` has `2^30 | (p − 1)`, giving the 2-adic structure a faithful STARK needs.

## The Exhibits

1. **Orientation** — STARK vs SNARK comparison table (setup, assumptions, post-quantum posture, size).
2. **AIR** — interactive single-column Fibonacci trace; check constraints; tamper a row and watch a residual become nonzero.
2·5. **Quotient (the missing middle step)** — takes the same trace, forms the constraint polynomial `C(x) = f(w²x) − f(wx) − f(x)`, and divides it by the vanishing polynomial `Z(x)` with exact field arithmetic. Honest ⇒ zero remainder and a low-degree quotient `Q`; the fixed tampered fixture ⇒ nonzero remainder and `Q`'s degree explodes toward the domain size. This is the interactive converter from "constraint violated" to "not low degree"; Exhibit 3 then computes that fixture's actual FRI outcome.
3. **FRI** — real even/odd coset folding (`f(x), f(−x) → f′(x²)`) with SHA-256 Merkle roots per layer, plus an **SVG visualization** of the domain halving. The final code has degree below one and eight evaluations; agreement of all eight is one acceptance condition. The fixed honest and tampered fixtures show their actual outcomes without generalizing one run into a probability claim.
4. **Proof size and query models** — benchmark table, the demo's own toy proof size measured live, and an interactive ledger. It classifies capacity arithmetic as heuristic, unique-radius and Johnson values as conditional query-only references, and leaves incomplete FRI/end-to-end bounds not established. Its separate byte estimate counts only FRI authentication hashes along the actual shrinking paths.
5. **Prove & verify** — the implemented toy protocol end to end. Generate a proof, inspect a query's decommitment and all verifier checks, then **Corrupt trace** and observe this generated fixture fail final-code membership without trace recomputation. Includes a **zero-knowledge mode** toggle and masking experiments. A disclosure panel states what a production STARK still adds.
6. **In production** — StarkNet, StarkEx, Risc Zero, Polygon Miden.

## Architecture

| File | Responsibility |
| --- | --- |
| `src/field.ts` | `F_p` arithmetic, roots of unity, Lagrange interpolation, polynomial eval/degree, exact polynomial division |
| `src/merkle.ts` | SHA-256 Merkle commitments, openings, verification |
| `src/stark.ts` | AIR, prover, verifier, real FRI; plus `airAnalysis` / `quotientAnalysis` / `friDemo` / `friFromTrace` for the exhibits |
| `src/soundness.ts` | Pure, fail-closed FRI query references and error ledger |
| `src/main.ts` | DOM wiring only (no cryptography) |

### What is real vs simplified

- **Real:** the field, polynomial interpolation, SHA-256 Merkle commitments, even/odd FRI folding, Fiat-Shamir challenges, query decommitments, final-code membership, sampled fold checks, **per-constraint degree adjustment** (`αᵢ + βᵢ·x^(D−dᵢ)`), and an **optional zero-knowledge masking** mode (`f′ = f + (xᴺ−1)·r`) whose witness-hiding is demonstrated empirically.
- **Simplified for clarity (clearly labeled in-app):** toy parameters (short traces, blowup 8, 8 queries), Lagrange interpolation instead of NTT, and no claimed numeric FRI or end-to-end soundness bound. The ZK property is shown empirically, not via a full-transcript simulator proof.

## Soundness Sources and Limits

- **CL042:** *SoK: Hash-Based Polynomial Commitments and Low-Degree Tests: From FRI to Basefold, STIR, and WHIR*, [ePrint 2026/1367](https://eprint.iacr.org/2026/1367), current 27-page ePrint version retrieved 2026-10-25. Sections 2.1–2.5 define rate, distance and decoding radii; Sections 4.1–4.3 cover FRI, DEEP-FRI and proximity gaps; Sections 5.4–5.5 distinguish conjectures, IOP soundness and non-interactive security; Section 7 records remaining small-field questions.
- **CL145:** *Small-field hash-based SNARGs are less sound than conjectured*, [ePrint 2025/2197](https://eprint.iacr.org/2025/2197), revision 2 dated 2026-04-09. Sections 3–4 explain the list-size-dependent attack. Its concrete example uses a sextic extension over a 31-bit base field, rate 1/2 and much larger parameters. This lab uses one prime field directly at rate 1/8, so the paper is context for cautious labels—not a demonstrated attack on this implementation.
- **CL146:** *A Simplified Round-by-round Soundness Proof of FRI*, [ePrint 2025/1993](https://eprint.iacr.org/2025/1993), v4 dated 2026-08-25 (current ePrint revision posted 2026-09-25). Lemma 2.4 bounds the cited Reed–Solomon MCA term only for `θ < 1−√ρ`; Sections 3.1–3.2 distinguish IOP, round-by-round and BCS requirements; Construction 4.4 fixes the FRI model; Theorem 5.2 gives every fold error plus query error `(1−min{θ,δ})^t`; Section 5.4 discusses the resulting parameters and limits.

## Testing

`​``bash
npm test           # crypto self-test + jsdom UI smoke test
npm run typecheck  # tsc --noEmit
`​``

`npm test` asserts that honest proofs are accepted, the fixed tampered fixtures are rejected through their observed final-code failure (not recomputation), flipped Merkle leaves are rejected, public protocol parameters and malformed scalar encodings fail closed, structurally malformed proofs fail closed, the soundness ledger validates inputs and refuses incomplete bounds, stale interactive evidence is retired, and every exhibit behaves correctly in a headless DOM. `npm run test:mutations` verifies that the gates catch removed heuristic labels, the wrong query formula, omitted fold-error completeness and final-membership-only acceptance.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## SNARK Arena

- **slug**: `crypto-lab-snark-arena`
- **repo**: https://github.com/systemslibrarian/crypto-lab-snark-arena
- **live**: https://systemslibrarian.github.io/crypto-lab-snark-arena/
- **commit_sha**: `77d09cd90b02a35cd78654deb8a65fb325913368` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ZERO-KNOWLEDGE  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, verification

**Name (H1)**: SNARK Arena  — _read from index.html_

**Subtitle**: zk-SNARKs · Groth16 & PLONK  — _read from index.html_

**Description**: Drive R1CS circuits and witnesses through both proving systems, run a real in-browser trusted-setup ceremony, and watch a leaked toxic-waste τ forge a proof.  — _read from index.html_

**Why it matters**: SNARKs secure Zcash, zkEVM rollups, and private identity — billions of dollars of value ride on soundness. If a ceremony's secret τ is ever leaked, anyone can mint proofs of false statements and the whole system silently breaks.  — _read from index.html_

**Card copy**: Generate and verify real BN254 Groth16 proofs, then compare a deliberately weak XOR relation with an in-circuit bit-constrained repair that rejects the same non-binary assignment. Separate toy-field panels demonstrate powers of tau and an accepted KZG opening forged with retained toxic waste; PLONK remains comparison-only.

**Chips**: Groth16 · R1CS · Constraint Gap · Trusted Setup · vs. PLONK

**Implements**: Groth16 `src/ui/realproof.ts:92`, KZG commitment `src/crypto/setup.ts:116`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Pairing `src/crypto/setup.ts:3`

**References**: BLS12-381, Bulletproofs, Fiat-Shamir, Halo2, PLONK, Pairing, SHA-256, STARK, Schnorr, Shor's algorithm

**Standards body**: _none_

**Implementation**: snarkjs Groth16 over compiled Circom WASM/BN254; local TypeScript toy-field arithmetic

**Spec citations, exactly as written**:

- `ePrint 2019/953` — first seen index.html:376 (1×)
- `ePrint 2023/1161` — first seen README.md:117 (1×)
- `ePrint 2025/2120` — first seen README.md:103 (2×)
- `eprint.iacr.org/2016/260` — first seen index.html:170 (1×)
- `eprint.iacr.org/2019/953` — first seen index.html:171 (1×)
- `eprint.iacr.org/2023/1161` — first seen README.md:117 (1×)
- `eprint.iacr.org/2025/2120` — first seen README.md:103 (3×)
- `EUROCRYPT 2016` — first seen README.md:5 (2×)

**README — What Can Go Wrong**:

```text
- **Private input is not necessarily confidential.** The live proof panel publishes `out = x³ + x + 5`. All 21 slider values 0–20 have distinct outputs below field wraparound, so `out=35` identifies `x=3` without inspecting the proof. The toy playground likewise has only `x=3` in its 0–9 slider range, while its full field still has the documented three roots. This example teaches proof mechanics, not witness confidentiality; zero knowledge cannot undo information already implied by public inputs. This is separate from the unverified setup provenance described below.

- **Trusted-setup toxic waste** — anyone who retains the secret `τ` from the setup ceremony can forge proofs for false statements; the powers-of-tau and KZG-forgery exhibits demonstrate exactly this.
- **Single-party setup** — trust rests entirely on that participant's honest generation and secret destruction. Multi-party setup distributes that trust: at least one honest participant must destroy their contribution. Participant count alone does not prove destruction or soundness.
- **Not post-quantum** — Groth16 and PLONK rest on pairing-based assumptions and fall to a quantum adversary; use STARKs where long-term quantum resistance is required.
- **Under-constrained relations** — proof validity establishes only the relation actually encoded. The constraint-gap case study makes this concrete: a weak relation accepts a genuine, unmodified Groth16 proof for public inputs `(2,2)` and output `−4 mod r`, even though the intended Boolean-XOR computation rejects non-bits. The repair is `a(a−1)=0` and `b(b−1)=0` inside the circuit, followed by circuit-specific artifact regeneration; a browser input check is not a proof-relation repair.
- **Toy-field intuition** — the interactive panels use small fields so values verify by hand, and there is more than one: the R1CS circuit playground runs over `F₈₁₉₁` (2¹³ − 1), while the powers-of-tau ceremony and KZG-forgery exhibits use `F₁₇`. Both are toy and both are labeled in-app; real deployments need 254-bit curves, and the demo's proof-size/timing figures in Exhibits 02–04 are labeled illustrative.
```

**Claims tested** (e2e/claims.spec.ts, 30 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:94
    - :94 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:131
    - :131 `toBeVisible` expected _no expected value_ _(none)_
- `playground: the default witness vector is the one the circuit actually computes` — e2e/claims.spec.ts:136
    - :138 `toHaveValue` expected `'3'` _(literal)_
    - :139 `toHaveText` expected `'3'` _(literal)_
    - :141 `toEqual` expected `{ '1': 1, x: 3, out: PUBLIC_OUT, v1: w.v1, v2: w.v2 }` _(expression)_
    - :144 `toHaveClass` expected `/pv-ok/` _(regex)_
    - :146 `expect` expected _no expected value_ _(none)_
    - :147 `toBe` expected `PUBLIC_OUT` _(expression)_
    - :148 `toBe` expected `3` _(literal)_
- `playground: every constraint row prints arithmetic that is true in F_8191` — e2e/claims.spec.ts:151
    - :153 `toEqual` expected `['C1', 'C2', 'C3']` _(expression)_
    - :155 `toBe` expected `true` _(expression)_
    - :158 `toBe` expected `c` _(expression)_
- `playground: only the satisfying x is accepted, and rejects quote the value the circuit computed` — e2e/claims.spec.ts:162
    - :168 `toHaveText` expected `String(x)` _(expression)_
    - :172 `toHaveClass` expected `/pv-ok/` _(regex)_
    - :173 `expect` expected _no expected value_ _(none)_
    - :177 `toHaveClass` expected `/pv-bad/` _(regex)_
    - :178 `expect` expected _no expected value_ _(none)_
    - :180 `toBe` expected `witnessFor(x).computedOut` _(expression)_
    - :182 `expect` expected _no expected value_ _(none)_
    - :183 `toBe` expected `PUBLIC_OUT` _(expression)_
    - :185 `toEqual` expected `['C3']` _(expression)_
- `playground: the roots sentence reports the field, not the integers` — e2e/claims.spec.ts:189
    - :191 `expect` expected _no expected value_ _(none)_
    - :194 `toBe` expected `roots.length` _(expression)_
    - :195 `expect` expected _no expected value_ _(none)_
    - :196 `expect` expected _no expected value_ _(none)_
    - :197 `toEqual` expected `[3]` _(expression)_
- `playground: forging the v2 wire is caught by a multiplication gate` — e2e/claims.spec.ts:200
    - :204 `toBe` expected `witnessFor(3).v2` _(expression)_
    - :205 `toHaveText` expected `'v2'` _(literal)_
    - :208 `toHaveClass` expected `/pv-bad/` _(regex)_
    - :210 `expect` expected _no expected value_ _(none)_
    - :211 `toBe` expected `cells.v2` _(expression)_
    - :212 `expect` expected _no expected value_ _(none)_
    - :213 `expect` expected _no expected value_ _(none)_
    - :216 `toBe` expected `true` _(expression)_
    - :217 `toBe` expected `false` _(expression)_
    - :220 `toBe` expected `product` _(expression)_
    - :221 `toBe` expected `claimed` _(expression)_
    - :222 `toBe` expected `cells.v2` _(expression)_
    - :224 `toContainText` expected `'forged'` _(literal)_
- `playground: leaving cheat mode restores the valid witness` — e2e/claims.spec.ts:227
    - :229 `toHaveClass` expected `/pv-bad/` _(regex)_
    - :231 `toHaveClass` expected `/pv-ok/` _(regex)_
    - :232 `toBe` expected `witnessFor(3).v2` _(expression)_
    - :233 `toHaveCount` expected `0` _(literal)_
    - :246 `expect` expected _no expected value_ _(none)_
    - :252 `toHaveText` expected `String(x)` _(expression)_
    - :255 `toContainText` expected `'Proof generated in', { timeout: 120_000 }` _(expression)_
- `real proof: the public output the proof commits to is x^3 + x + 5` — e2e/claims.spec.ts:259
    - :263 `toBe` expected `Number(expected)` _(expression)_
    - :264 `toHaveClass` expected `/cb-ok/` _(regex)_
    - :265 `expect` expected _no expected value_ _(none)_
    - :266 `expect` expected _no expected value_ _(none)_
- `real proof: the reported size is counted from the proof object and matches the figure Exhibit 02 quotes` — e2e/claims.spec.ts:270
    - :275 `toBe` expected `bytes` _(expression)_
    - :276 `toBe` expected `32` _(literal)_
    - :277 `toBe` expected `256` _(literal)_
    - :280 `expect` expected _no expected value_ _(none)_
- `real proof: groth16.verify returns true for the honest proof` — e2e/claims.spec.ts:283
    - :289 `toContainText` expected `'groth16.verify', { timeout: 60_000 }` _(expression)_
    - :292 `expect` expected _no expected value_ _(none)_
    - :293 `toHaveClass` expected `/cb-ok/` _(regex)_
    - :294 `toHaveClass` expected `/pv-ok/` _(regex)_
    - :295 `toBe` expected `trueOut` _(expression)_
    - :296 `expect` expected _no expected value_ _(none)_
- `real proof: a tampered public output is rejected, and the panel states why` — e2e/claims.spec.ts:299
    - :305 `toContainText` expected `'groth16.verify', { timeout: 60_000 }` _(expression)_
    - :308 `expect` expected _no expected value_ _(none)_
    - :309 `expect` expected _no expected value_ _(none)_
    - :310 `toHaveClass` expected `/cb-bad/` _(regex)_
    - :311 `toHaveClass` expected `/pv-bad/` _(regex)_
    - :315 `toBe` expected `trueOut` _(expression)_
    - :316 `toBe` expected `trueOut + 1` _(expression)_
    - :317 `expect` expected _no expected value_ _(none)_
    - :318 `expect` expected _no expected value_ _(none)_
    - :319 `expect` expected _no expected value_ _(none)_
- `real proof: setup trust stays unverified without inferring a leak from published entropy` — e2e/claims.spec.ts:322
    - :324 `expect` expected _no expected value_ _(none)_
    - :325 `expect` expected _no expected value_ _(none)_
    - :326 `expect` expected _no expected value_ _(none)_
    - :327 `expect` expected _no expected value_ _(none)_
    - :328 `expect` expected _no expected value_ _(none)_
    - :329 `expect` expected _no expected value_ _(none)_
    - :330 `expect` expected _no expected value_ _(none)_
    - :332 `expect` expected _no expected value_ _(none)_
    - :333 `expect` expected _no expected value_ _(none)_
    - :334 `expect` expected _no expected value_ _(none)_
    - :335 `expect` expected _no expected value_ _(none)_
- `constraint-gap lesson exposes its exact paper mapping, adaptation, and circuit repair` — e2e/claims.spec.ts:340
    - :343 `expect` expected _no expected value_ _(none)_
    - :344 `expect` expected _no expected value_ _(none)_
    - :345 `expect` expected _no expected value_ _(none)_
    - :346 `expect` expected _no expected value_ _(none)_
    - :347 `expect` expected _no expected value_ _(none)_
    - :348 `expect` expected _no expected value_ _(none)_
    - :349 `expect` expected _no expected value_ _(none)_
    - :350 `expect` expected _no expected value_ _(none)_
    - :352 `toHaveCount` expected `1` _(literal)_
    - :361 `expect` expected _no expected value_ _(none)_
    - :362 `expect` expected _no expected value_ _(none)_
    - :363 `expect` expected _no expected value_ _(none)_
    - :364 `expect` expected _no expected value_ _(none)_
    - :365 `expect` expected _no expected value_ _(none)_
    - :373 `toHaveText` expected `/^(Secure|Compromised):/, { timeout: 20_000 }` _(expression)_
- `ceremony visualizer: the headline verdict agrees with the participant states it drew` — e2e/claims.spec.ts:377
    - :378 `toContainText` expected `'at least one participant'` _(literal)_
    - :384 `toBe` expected `5` _(literal)_
    - :387 `expect` expected _no expected value_ _(none)_
    - :389 `toBe` expected `deleted` _(expression)_
    - :390 `toBe` expected `5` _(literal)_
    - :391 `expect` expected _no expected value_ _(none)_
    - :393 `toBe` expected `0` _(literal)_
    - :394 `expect` expected _no expected value_ _(none)_
    - :395 `expect` expected _no expected value_ _(none)_
- `ceremony visualizer: both outcomes are reachable, with the draw pinned` — e2e/claims.spec.ts:400
    - :405 `expect` expected _no expected value_ _(none)_
    - :406 `toHaveCount` expected `0` _(literal)_
    - :408 `toBe` expected `powMod(15, 5, SCALAR_R)` _(expression)_
    - :414 `expect` expected _no expected value_ _(none)_
    - :415 `toHaveCount` expected `5` _(literal)_
    - :416 `toEqual` expected `[5, 5]` _(expression)_
    - :429 `toContainText` expected `'Combined secret', { timeout: 20_000 }` _(expression)_
    - :430 `expect` expected _no expected value_ _(none)_
    - :440 `toHaveLength` expected `5` _(literal)_
    - :442 `expect` expected _no expected value_ _(none)_
    - :443 `expect` expected _no expected value_ _(none)_
    - :448 `expect` expected _no expected value_ _(none)_
    - :449 `toEqual` expected `contributions` _(expression)_
    - :450 `toBe` expected `SCALAR_R` _(expression)_
    - :453 `toBe` expected `expectedTau` _(expression)_
    - :456 `toBe` expected `enc(expectedTau)` _(expression)_
    - :457 `toBe` expected `ENC_P` _(expression)_
    - :464 `toEqual` expected `contributions.map((c) => (acc = m(acc * c, SCALAR_R)))` _(expression)_
- `powers-of-tau: the combined secret is the product of the contributions, and g^tau matches` — e2e/claims.spec.ts:468
    - :473 `toHaveClass` expected `/pv-ok/` _(regex)_
    - :474 `expect` expected _no expected value_ _(none)_
    - :476 `expect` expected _no expected value_ _(none)_
    - :477 `expect` expected _no expected value_ _(none)_
    - :478 `toBe` expected `tau` _(expression)_
    - :479 `expect` expected _no expected value_ _(none)_
- `powers-of-tau: with nobody deleting, the ceremony is compromised and prints the recoverable tau` — e2e/claims.spec.ts:482
    - :490 `toHaveClass` expected `/pv-bad/` _(regex)_
    - :491 `expect` expected _no expected value_ _(none)_
    - :492 `expect` expected _no expected value_ _(none)_
    - :493 `toBe` expected `tau` _(expression)_
    - :494 `toHaveCount` expected `0` _(literal)_
    - :495 `toHaveCount` expected `5` _(literal)_
- `powers-of-tau: one honest deleter out of five is enough` — e2e/claims.spec.ts:498
    - :506 `toHaveClass` expected `/pv-ok/` _(regex)_
    - :507 `expect` expected _no expected value_ _(none)_
    - :508 `expect` expected _no expected value_ _(none)_
    - :509 `toHaveCount` expected `1` _(literal)_
- `powers-of-tau: randomized contributions still satisfy the same product identity` — e2e/claims.spec.ts:512
    - :515 `expect` expected _no expected value_ _(none)_
    - :516 `toHaveLength` expected `before.length` _(expression)_
- `powers-of-tau: deletion controls lock while running and edits retire old evidence` — e2e/claims.spec.ts:522
    - :525 `toBeDisabled` expected _no expected value_ _(none)_
    - :526 `toContainText` expected `'Combined secret', { timeout: 20_000 }` _(expression)_
    - :527 `toBeEnabled` expected _no expected value_ _(none)_
    - :530 `expect` expected _no expected value_ _(none)_
    - :531 `expect` expected _no expected value_ _(none)_
    - :532 `toHaveText` expected `[` _(expression)_
    - :548 `expect` expected _no expected value_ _(none)_
- `KZG: the published facts are the real evaluation and the real commitment` — e2e/claims.spec.ts:571
    - :573 `expect` expected _no expected value_ _(none)_
    - :574 `toBe` expected `f.yTrue` _(expression)_
    - :575 `toBe` expected `enc(polyEvalF17(f.poly, f.tau))` _(expression)_
    - :576 `toHaveText` expected `/x/` _(regex)_
- `KZG: an honest opening divides exactly and the verifier equation balances` — e2e/claims.spec.ts:579
    - :583 `toContainText` expected `'Honest opening'` _(literal)_
    - :589 `toBe` expected `0` _(literal)_
    - :590 `toBe` expected `remainder` _(expression)_
    - :595 `toEqual` expected `[qTau, enc(qTau)]` _(expression)_
    - :599 `toBe` expected `rhs` _(expression)_
    - :600 `toEqual` expected `[lhs, rhs]` _(expression)_
    - :602 `toHaveClass` expected `/cb-ok/` _(regex)_
    - :603 `toHaveClass` expected `/pv-ok/` _(regex)_
    - :604 `expect` expected _no expected value_ _(none)_
    - :605 `expect` expected _no expected value_ _(none)_
    - :607 `expect` expected _no expected value_ _(none)_
- `KZG: an honest prover cannot open to a lie — the quotient leaves a remainder` — e2e/claims.spec.ts:610
    - :613 `toContainText` expected `'Honest route'` _(literal)_
    - :617 `toBe` expected `f.yTrue` _(expression)_
    - :618 `toBe` expected `f.yTrue` _(expression)_
    - :623 `toBe` expected `0` _(literal)_
    - :624 `toBe` expected `remainder` _(expression)_
    - :625 `expect` expected _no expected value_ _(none)_
    - :626 `expect` expected _no expected value_ _(none)_
- `KZG: a leaked tau forges an accepted opening, and the panel calls soundness broken` — e2e/claims.spec.ts:629
    - :633 `toContainText` expected `'Attacker route'` _(literal)_
    - :641 `toEqual` expected `[forgedExp, enc(forgedExp)]` _(expression)_
    - :645 `toBe` expected `rhs` _(expression)_
    - :646 `toEqual` expected `[lhs, rhs]` _(expression)_
    - :648 `toHaveClass` expected `/cb-bad/` _(regex)_
    - :649 `toHaveClass` expected `/pv-bad/` _(regex)_
    - :650 `expect` expected _no expected value_ _(none)_
    - :651 `expect` expected _no expected value_ _(none)_
    - :652 `expect` expected _no expected value_ _(none)_
- `quoted proof sizes agree across Exhibits 02, 03, 04 and the comparison table` — e2e/claims.spec.ts:657
    - :664 `toBe` expected `128` _(literal)_
    - :665 `toBe` expected `448` _(literal)_
    - :666 `expect` expected _no expected value_ _(none)_
    - :668 `expect` expected _no expected value_ _(none)_
    - :669 `expect` expected _no expected value_ _(none)_
    - :672 `expect` expected _no expected value_ _(none)_
    - :673 `expect` expected _no expected value_ _(none)_
    - :674 `expect` expected _no expected value_ _(none)_
- `the simulated panels declare that they compute nothing, and carry no verify affordance` — e2e/claims.spec.ts:677
    - :680 `expect` expected _no expected value_ _(none)_
    - :681 `expect` expected _no expected value_ _(none)_
    - :684 `toHaveCount` expected `1` _(literal)_
    - :685 `toHaveCount` expected `1` _(literal)_
    - :690 `toBe` expected `await page.locator('#head-groth16').innerText()` _(expression)_
    - :691 `toBe` expected `await page.locator('#head-plonk').innerText()` _(expression)_
    - :692 `toMatch` expected `/^[0-9a-f]{32}\.\.\.[0-9a-f]{32}$/` _(regex)_
    - :693 `toMatch` expected `/^[0-9a-f]{48}\.\.\.[0-9a-f]{48}$/` _(regex)_
    - :694 `expect` expected _no expected value_ _(none)_
- `quiz: the tally counts first-try correctness, and the page marks the right answer` — e2e/claims.spec.ts:699
    - :701 `expect` expected _no expected value_ _(none)_
    - :708 `toBeVisible` expected _no expected value_ _(none)_
    - :710 `toHaveCount` expected `1` _(literal)_
    - :716 `toHaveClass` expected `chosenWasRight ? /qx-ok/ : /qx-bad/` _(expression)_
    - :717 `expect` expected _no expected value_ _(none)_
    - :721 `toBe` expected `q + 1` _(expression)_
    - :722 `toBe` expected `expectedCorrect` _(expression)_
    - :727 `expect` expected _no expected value_ _(none)_
    - :728 `toEqual` expected `[expectedCorrect, total]` _(expression)_
- `quiz: a correct first answer is credited` — e2e/claims.spec.ts:731
    - :735 `expect` expected _no expected value_ _(none)_
    - :739 `toHaveClass` expected `/qx-ok/` _(regex)_
    - :741 `toBe` expected `1` _(literal)_
    - :742 `toBe` expected `1` _(literal)_
- `quiz: an answered question locks, so the tally cannot be inflated by re-clicking` — e2e/claims.spec.ts:745
    - :751 `toBeDisabled` expected _no expected value_ _(none)_
    - :754 `toBe` expected `before` _(expression)_

**Mutation records** (1 file(s)):

- `scripts/mutations.mjs` (5077 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-snark-arena

## What It Is

SNARK Arena demonstrates the two most deployed zk-SNARK proving systems: Groth16 (Groth, EUROCRYPT 2016) and PLONK (Gabizon et al., 2019). Both are succinct non-interactive arguments of knowledge: under their security assumptions, they prove knowledge of a witness satisfying a circuit without disclosing additional information beyond the public statement, in small proofs. That statement can itself reveal the witness. Groth16 produces 128-byte proofs on BN254 with per-circuit trusted setup — that is the compressed encoding; the same three group elements are 256 bytes uncompressed, which is what snarkjs writes and what the live-proof panel reports. PLONK produces approximately 400-byte proofs with a universal trusted setup reusable across circuits. Both rely on pairing-based assumptions and are not post-quantum secure.

## When to Use It

- ✅ Groth16: fixed circuits requiring minimal proof size and fastest verification, such as Zcash and Semaphore-style deployments where proof bytes matter.
- ✅ PLONK: circuits that evolve or where avoiding a new per-circuit ceremony is important, such as Aztec and Polygon zkEVM style workflows.
- ✅ Halo2 (PLONK variant): when recursive proof composition or no trusted setup is needed — but "no trusted setup" is a property of the IPA backend that upstream (Zcash) halo2 uses, not of halo2 as such. The PSE fork swaps IPA for KZG for cheaper L1 verification, and KZG needs a ceremony.
- ❌ Neither Groth16 nor PLONK is post-quantum secure; use STARK systems for long-term quantum resistance targets.
- ❌ A single-party setup requires trusting that one participant generated and destroyed the setup secrets correctly. A verified multi-party ceremony reduces that trust to at least one honest participant; these demo artifacts have no authenticated ceremony evidence.
- ❌ Do not treat this as production proving infrastructure — it is a teaching demo, and the interactive panels use toy fields — `F₈₁₉₁` in the R1CS playground, `F₁₇` in the ceremony and KZG exhibits (real systems use 254-bit curves and audited libraries).

## Live Demo

**[systemslibrarian.github.io/crypto-lab-snark-arena](https://systemslibrarian.github.io/crypto-lab-snark-arena/)**

Six numbered exhibits, a focused constraint-gap case study, a glossary, and a self-check quiz walk from what a zk-SNARK is — with an interactive R1CS circuit playground — through Groth16 and PLONK, a head-to-head comparison, the trusted-setup problem in depth (a live powers-of-tau ceremony and a KZG forgery demo), and production deployments. A featured panel generates and verifies a genuine Groth16 proof entirely in your browser with snarkjs: produce it, verify it (`true`), then tamper with the public output and watch the pairing check reject it (`false`). The case study also generates an unmodified proof for a deliberately weak XOR relation, shows the explicit `(a,b,out)=(2,2,−4 mod r)` assignment that relation accepts, and runs the same assignment against a repaired circuit whose in-circuit bit constraints reject it. No server, no simulation.

## What Can Go Wrong

- **Private input is not necessarily confidential.** The live proof panel publishes `out = x³ + x + 5`. All 21 slider values 0–20 have distinct outputs below field wraparound, so `out=35` identifies `x=3` without inspecting the proof. The toy playground likewise has only `x=3` in its 0–9 slider range, while its full field still has the documented three roots. This example teaches proof mechanics, not witness confidentiality; zero knowledge cannot undo information already implied by public inputs. This is separate from the unverified setup provenance described below.

- **Trusted-setup toxic waste** — anyone who retains the secret `τ` from the setup ceremony can forge proofs for false statements; the powers-of-tau and KZG-forgery exhibits demonstrate exactly this.
- **Single-party setup** — trust rests entirely on that participant's honest generation and secret destruction. Multi-party setup distributes that trust: at least one honest participant must destroy their contribution. Participant count alone does not prove destruction or soundness.
- **Not post-quantum** — Groth16 and PLONK rest on pairing-based assumptions and fall to a quantum adversary; use STARKs where long-term quantum resistance is required.
- **Under-constrained relations** — proof validity establishes only the relation actually encoded. The constraint-gap case study makes this concrete: a weak relation accepts a genuine, unmodified Groth16 proof for public inputs `(2,2)` and output `−4 mod r`, even though the intended Boolean-XOR computation rejects non-bits. The repair is `a(a−1)=0` and `b(b−1)=0` inside the circuit, followed by circuit-specific artifact regeneration; a browser input check is not a proof-relation repair.
- **Toy-field intuition** — the interactive panels use small fields so values verify by hand, and there is more than one: the R1CS circuit playground runs over `F₈₁₉₁` (2¹³ − 1), while the powers-of-tau ceremony and KZG-forgery exhibits use `F₁₇`. Both are toy and both are labeled in-app; real deployments need 254-bit curves, and the demo's proof-size/timing figures in Exhibits 02–04 are labeled illustrative.

## Real-World Usage

- **Zcash** — Groth16 proofs authorize shielded transactions without revealing sender, receiver, or amount.
- **zkEVM rollups** — Polygon zkEVM and Aztec use PLONK-family systems to prove correct execution off-chain.
- **Identity / anti-Sybil** — WorldID and Semaphore use Groth16 proofs for private set membership and one-person-one-action guarantees.
- **zkLogin** — proves a valid OAuth login without revealing identity, using a SNARK over the JWT.
- **General zk-rollups** — succinct, constant-size proofs let a chain verify a whole batch of transactions in milliseconds.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-snark-arena
cd crypto-lab-snark-arena
npm install
npm run dev      # dev server
npm test         # crypto-core unit tests (Vitest)
npm run build && npm run test:a11y   # production build + WCAG a11y gate
`​``

## Related Demos

- [crypto-lab-stark-tower](https://systemslibrarian.github.io/crypto-lab-stark-tower/) — zk-STARKs, the transparent, post-quantum alternative to pairing-based SNARKs.
- [crypto-lab-zk-arena](https://systemslibrarian.github.io/crypto-lab-zk-arena/) — side-by-side comparison of zk-SNARK and zk-STARK proof systems.
- [crypto-lab-bulletproofs](https://systemslibrarian.github.io/crypto-lab-bulletproofs/) — short range proofs and inner-product arguments with no trusted setup.
- [crypto-lab-zk-proof-lab](https://systemslibrarian.github.io/crypto-lab-zk-proof-lab/) — Schnorr commitments and the Fiat-Shamir transform that underpins non-interactive proofs.
- [crypto-lab-mpcith-sign](https://systemslibrarian.github.io/crypto-lab-mpcith-sign/) — MPC-in-the-Head, a post-quantum signature built from zero-knowledge proofs.

## The Exhibits

1. **What a zk-SNARK is** — plus an **interactive R1CS circuit playground**: drag the secret `x`, watch the witness vector and the three constraints `(A·s)(B·s) = (C·s)` for `x³ + x + 5 = 35` recompute live over a real field, and try to cheat to see a multiplication gate catch a forged wire.
   - **★ Real proof (featured)** — a genuine **Groth16 proof generated and verified entirely in your browser** with snarkjs, on the same circuit. Generate it, verify it (`true`), then tamper with the public output and watch the pairing check reject it (`false`). No server, no simulation.
   - **★ Constraint gap (paper-bounded case study)** — two real Circom/Groth16 relations separate intended witness computation from verifier constraints. The weak relation proves the explicit phantom output from Kolozyan et al.; the repaired relation rejects that same assignment while preserving all four legitimate XOR rows. Ordinary proof-byte tampering is shown separately.
2. **Groth16** with per-circuit trusted setup and a ceremony visualizer.
3. **PLONK** with a universal SRS and circuit flexibility.
4. **Head-to-head** comparison on the same circuit, with a decision tree.
5. **The trusted-setup problem in depth** — a **live powers-of-tau ceremony** showing the combined secret `τ = τ₁·τ₂·…·τₙ` as a running product (toggle who deletes their toxic waste), and a **live KZG forgery demo** proving that an honest prover cannot open a commitment to a lie, while an attacker who keeps `τ` can.
6. **Production deployments** in Zcash, Polygon zkEVM, WorldID/Semaphore, and zkLogin.

## Real math, not mock-ups

The interactive panels run genuine finite-field arithmetic in the browser (`src/crypto/`): the R1CS witness check, modular inverse/exponentiation, polynomial division, the powers-of-tau SRS, KZG commit/open/verify, and the weak/repaired XOR relation over the BN254 scalar field. The R1CS playground uses the toy field `F₈₁₉₁`; the ceremony and KZG exhibits use `F₁₇` with a group of order 17 encoded mod 103, so every value is small enough to verify by hand. Real systems use the same constructions on 254-bit curves. The cryptographic core has no UI dependencies and is unit-tested in isolation: `npm test` runs 51 Vitest cases (`src/crypto/*.test.ts`) — field KATs and homomorphism/Fermat properties, the powers-of-tau product and SRS encodings, KZG commit/open/verify round-trips, verify-rejects-a-lie, the leaked-`τ` forgery, R1CS witness checks, and independent XOR-domain/residue/public-signal checks.

**On the verify step specifically:** a real KZG verifier checks the bilinear pairing `e(C·g⁻ʸ, g) = e(π, g^(τ−z))` over the group elements `C` and `π` alone, never touching `τ`. This demo has no pairing on its toy group, so `kzgVerify` tests the *same* algebraic relation the pairing enforces — the exponent equality `f(τ)−y = q(τ)(τ−z)` — by reading the exponents directly (including `τ`). It faithfully models *what* the pairing verifies, not *how*; that scope limit is now stated in-app at the verify step (via `PAIRING_NOTE`), not only in code comments.

The **Real proof** and **Constraint gap** panels go one step further and run the *production* stack — `snarkjs.groth16.fullProve` / `verify` on circom-compiled circuits and real trusted-setup proving keys — entirely client-side. For the gap lesson, the repository gate independently binds each shipped XOR proving key to its freshly rebuilt R1CS and shared phase-2 PTAU, exports and compares the verification key, and exercises the valid and phantom assignments. The Groth16/PLONK proof-size and timing figures in Exhibits 02–04 remain illustrative (labeled "simulated") and follow snarkjs benchmark conventions.

## Real SNARKs on GitHub Pages

A real SNARK needs no server: proving and verifying are pure client-side computation. The circuit artifacts are generated once and shipped as static files in `public/zk/` (witness-generator WASM, proving key, verification key, plus the XOR lesson's phase-2 PTAU), with snarkjs vendored in `public/vendor/`. The only real constraint is that GitHub Pages can't send the COOP/COEP headers needed for multi-threaded WASM, so proving runs single-threaded — fine for small-to-medium circuits; large circuits (hundreds-of-MB proving keys) hit the 100 MB per-file limit.

**On the trust in those artifacts.** The cubic recipe below documents a local two-phase snarkjs setup with one contribution in each phase and published entropy strings. Those strings alone do not establish public toxic waste: [snarkjs mixes fresh random bytes with the supplied entropy](https://github.com/iden3/snarkjs/blob/9a8f1c0083d18b9b5e18f526cfd729e7259423be/src/misc.js). The XOR regeneration helper likewise creates single-party teaching keys. The original setup execution records, contribution transcripts and secret destruction are not authenticated. The page performs genuine Groth16 proving and verification, but passing examples do not certify setup soundness. These are demo-only keys with **unverified ceremony provenance**, not production trust material. The featured panels and trust banners state the same limit.

All three witness generators have a separate [repeatable source-to-shipped-artifact check](docs/cubic-provenance.md): `python3 scripts/verify-cubic-wasm.py`. It builds authenticated pinned Circom source and compiles each captured circuit twice, requiring both results to match the shipped WASM. For the two XOR circuits it additionally verifies the shared PTAU, proves that each zkey is bound to the rebuilt R1CS/PTAU, compares the verification key exported from that zkey, and executes positive and negative proof controls. It does not certify toxic-waste destruction, reproduce the vendored snarkjs bundle from its source, or authenticate the original setup ceremony.

To regenerate the artifacts (requires the [circom](https://github.com/iden3/circom) compiler):

`​``bash
circom public/zk/cubic.circom --r1cs --wasm -p bn128 -o build
npx snarkjs powersoftau new bn128 8 pot.ptau
npx snarkjs powersoftau contribute pot.ptau pot1.ptau -e="random"
npx snarkjs powersoftau prepare phase2 pot1.ptau potf.ptau
npx snarkjs groth16 setup build/cubic.r1cs potf.ptau zk0.zkey
npx snarkjs zkey contribute zk0.zkey public/zk/cubic_final.zkey -e="random2"
npx snarkjs zkey export verificationkey public/zk/cubic_final.zkey public/zk/verification_key.json
# copy build/cubic_js/cubic.wasm -> public/zk/cubic.wasm

# Regenerate both XOR circuits plus a fresh demo-only setup using the exact
# vendored snarkjs bundle (this replaces the XOR WASM/PTAU/zkey/vkey files):
node scripts/build-xor-artifacts.mjs --circom /path/to/circom --out public/zk --circuit all
`​``

The constraint-gap example is a bounded adaptation of Kolozyan et al., [*Language-Agnostic Detection of Computation-Constraint Inconsistencies in ZKP Programs via Value Inference*](https://eprint.iacr.org/2025/2120), ePrint 2025/2120, revision 7 (11 April 2026), especially §§2.1–2.3 and §3.2.3. The paper's §3.2.3 XOR example supplies the computation/constraint mismatch and explicit `a=b=2` phantom output; this lab adapts it into two small public-input Circom/Groth16 relations. It does not implement CCC-Check, reproduce the §5 evaluation, or generalize beyond the concrete lesson; §7's limitations remain applicable.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Research review extension 31 October 2026

R20261031-09: A hypothetical semantic-outcome exercise distinguishes wrong-result acceptance, honest valid-execution rejection, ineffective mutations and malformed-proof rejection. It does not generate new proofs or reproduce Arguzz. The existing real weak-XOR and repaired-relation controls remain intact.

### Ceremony evidence exercise

The advanced ceremony panel checks final power-vector consistency, every retained update and its final endpoint, and inclusion of an exact retained contribution receipt. Cases cover a consistent replacement SRS, missing transcript, corrupted intermediate update and omitted contribution. It uses disclosed exponents in F_17, not pairings or proofs of knowledge, and cannot establish secrecy, receipt authenticity or erasure. A linear scan locates a bad toy link; no paper speedup or batching algorithm is implemented. [Baghery, Mertens and Sedaghat, ePrint 2023/1161](https://eprint.iacr.org/2023/1161), pp. 4–6 and §5, motivates the distinction; its updatable-SRS protocols are not transplanted into Groth16.

```

</details>

---

## Bulletproofs

- **slug**: `crypto-lab-bulletproofs`
- **repo**: https://github.com/systemslibrarian/crypto-lab-bulletproofs
- **live**: https://systemslibrarian.github.io/crypto-lab-bulletproofs/
- **commit_sha**: `48ae5e4d1f8adc3cf5c641ee700b56e73b0812f7` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ZERO-KNOWLEDGE  ·  **level**: advanced  ·  **--accent**: #4a9eff
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Bulletproofs  — _read from src/app.ts_

**Subtitle**: Zero-knowledge range proof · no trusted setup · ristretto255  — _read from src/app.ts_

**Description**: Commit a secret value, generate a short range proof that it lies in [0, 2⁶⁴)  — _read from src/app.ts_

**Why it matters**: Confidential transactions and audits need to prove an amount is valid without revealing it. Bulletproofs do this with tiny proofs and no trusted setup, so there is no toxic waste and nothing to trust but the math.  — _read from src/app.ts_

**Card copy**: ZK range proofs using Bulletproofs on ristretto255 — 64-bit Pedersen commitments, aggregate proofs over multiple ranges, the inner-product argument, and a tamper-rejection demo.

**Chips**: Bulletproofs · ristretto255 · Range Proofs · Inner-Product Argument

**Implements**: Bulletproofs `src/app.ts:760`, EC point arithmetic `src/crypto/ristretto.ts:66`, Pedersen commitment `src/app.ts:16`, ristretto255 `src/crypto/ristretto.ts:53`, Schnorr `src/app.ts:764`, SHA-512 `src/crypto/ristretto.ts:55`

**Attacks shown**: Replay attack `src/app.ts:983`

**Comment-only (named in code comments, not executed)**: Ed25519 `src/crypto/ristretto.ts:3`, Fiat-Shamir `src/crypto/transcript.ts:2`, Hash-to-curve `src/crypto/ristretto.ts:48`, Shamir secret sharing `src/app.ts:944`

**References**: BLS12-381, Ed25519, Fiat-Shamir, Groth16, PLONK, STARK, Shamir secret sharing

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `RFC 9380` — first seen src/crypto/ristretto.ts:50 (1×)
- `RFC 9496` — first seen src/crypto/ristretto.ts:35 (3×)

**README — What Can Go Wrong**:

```text
- A range proof only proves the committed value lies in range; it says nothing about *which* value or its meaning. Application logic must still bind the commitment to the right amount/account, or a valid proof can authorize the wrong thing.
- Verification is linear (O(n)) and aggregation cost grows with `log(range × count)`; verifying many proofs one at a time is slow, so batch verification is usually required at scale.
- Fiat-Shamir soundness depends on hashing the full transcript. A challenge not bound to every public input (generators, commitment, prior messages) opens the proof to forgery.
- Implementations are not automatically constant-time; leaking the blinding factor or a scalar through timing can compromise the hiding of the committed value.
- Weak or reused randomness for the blinders breaks the hiding and zero-knowledge properties.
```

**Claims tested** (e2e/claims.spec.ts, 15 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:34
    - :34 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:46
    - :46 `toContainText` expected `'Range proof generated in', {` _(expression)_
- `the bit grid counts the committed value it is drawn from` — e2e/claims.spec.ts:54
    - :59 `toHaveCount` expected `64` _(literal)_
    - :60 `toHaveCount` expected `24` _(literal)_
    - :61 `toContainText` expected `'always'` _(literal)_
    - :62 `toContainText` expected `'[0, 2⁶⁴` _(expression)_
    - :75 `toHaveText` expected `pretty` _(expression)_
    - :76 `toContainText` expected `'Committed value: ${pretty}'` _(expression)_
    - :79 `toBe` expected `'${expected} / 64 set'` _(expression)_
    - :80 `toHaveCount` expected `expected` _(expression)_
    - :81 `toHaveAttribute` expected _no expected value_ _(none)_
- `every surface reports the same measured proof size` — e2e/claims.spec.ts:91
    - :100 `toHaveCount` expected `events` _(expression)_
    - :105 `toBe` expected `statusBytes` _(expression)_
    - :106 `toBe` expected `Math.log2(64)` _(expression)_
    - :115 `toBe` expected `5` _(literal)_
    - :116 `expect` expected _no expected value_ _(none)_
    - :123 `toBe` expected `2 * rounds` _(expression)_
    - :124 `toBe` expected `ipaPoints * POINT` _(expression)_
    - :125 `toBe` expected `2 * SCALAR` _(expression)_
    - :130 `toBe` expected _no expected value_ _(none)_
    - :134 `toBe` expected `2 * 64 * SCALAR` _(expression)_
    - :135 `expect` expected _no expected value_ _(none)_
    - :143 `toBe` expected `rounds` _(expression)_
    - :146 `toBe` expected `'${size}→${size / 2}'` _(expression)_
    - :149 `toBe` expected `1` _(literal)_
    - :154 `toBe` expected `introBytes` _(expression)_
    - :155 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :157 `toBe` expected `POINT` _(expression)_
    - :158 `toHaveText` expected _no expected value_ _(none)_
    - :162 `toContainText` expected `'${introBytes} B'` _(expression)_
- `both verifiers accept and the live equation balances` — e2e/claims.spec.ts:168
    - :170 `toHaveText` expected `'No verification has been run yet.'` _(literal)_
    - :183 `toEqual` expected `['Commit', 'Prove', 'Verify', 'Explore']` _(expression)_
    - :184 `toBe` expected `true` _(expression)_
    - :185 `toBe` expected `false` _(expression)_
    - :186 `toBe` expected `true` _(expression)_
    - :192 `expect` expected _no expected value_ _(none)_
    - :193 `expect` expected _no expected value_ _(none)_
    - :195 `expect` expected _no expected value_ _(none)_
    - :199 `toBe` expected `true` _(expression)_
    - :200 `toHaveClass` expected `/\bok\b/` _(regex)_
    - :203 `toContainText` expected `'✓ reference verifier accepted'` _(literal)_
    - :204 `toHaveClass` expected `/success/` _(regex)_
    - :206 `expect` expected _no expected value_ _(none)_
    - :207 `toContainText` expected `'reference verifier accepted'` _(literal)_
    - :209 `expect` expected _no expected value_ _(none)_
    - :212 `toContainText` expected `'✓ single-MSM verifier accepted'` _(literal)_
    - :213 `toHaveClass` expected `/success/` _(regex)_
    - :216 `toBe` expected `true` _(expression)_
- `the bits-to-inner-product bridge uses the real bits of the committed value` — e2e/claims.spec.ts:222
    - :232 `toBe` expected `8` _(literal)_
    - :235 `toBe` expected _no expected value_ _(none)_
    - :240 `expect` expected _no expected value_ _(none)_
    - :241 `expect` expected _no expected value_ _(none)_
    - :242 `toHaveCount` expected `3` _(literal)_
    - :246 `toEqual` expected `[8, 8, 8]` _(expression)_
- `cheating with ${label} is rejected as a binding failure` — e2e/claims.spec.ts:256
    - :259 `toContainText` expected `'binding', { timeout: 30_000 }` _(expression)_
    - :264 `expect` expected _no expected value_ _(none)_
    - :265 `expect` expected _no expected value_ _(none)_
    - :266 `expect` expected _no expected value_ _(none)_
    - :267 `expect` expected _no expected value_ _(none)_
    - :268 `toBe` expected `v` _(expression)_
    - :274 `toBe` expected `2` _(literal)_
    - :275 `toBe` expected `hexes[1]` _(expression)_
    - :277 `expect` expected _no expected value_ _(none)_
    - :280 `toHaveClass` expected `/\bok\b/` _(regex)_
    - :281 `toContainText` expected `'✓'` _(literal)_
    - :282 `toContainText` expected `'UNEXPECTEDLY'` _(literal)_
    - :283 `expect` expected _no expected value_ _(none)_
    - :284 `toContainText` expected `'verifier rejected'` _(literal)_
- `flipping one bit of t-hat is rejected by both verifiers` — e2e/claims.spec.ts:291
    - :295 `toContainText` expected `'No proof yet.'` _(literal)_
    - :300 `expect` expected _no expected value_ _(none)_
    - :301 `toMatch` expected `/Reference verifier: ✓ rejected/` _(regex)_
    - :302 `toMatch` expected `/Single-MSM verifier: ✓ rejected/` _(regex)_
    - :303 `expect` expected _no expected value_ _(none)_
    - :304 `expect` expected _no expected value_ _(none)_
    - :308 `toContainText` expected `'✓ reference verifier accepted'` _(literal)_
- `replaying a proof against another commitment is rejected` — e2e/claims.spec.ts:314
    - :317 `toContainText` expected `'No proof yet.'` _(literal)_
    - :326 `expect` expected _no expected value_ _(none)_
    - :328 `expect` expected _no expected value_ _(none)_
    - :333 `toHaveClass` expected `/\bok\b/` _(regex)_
    - :334 `expect` expected _no expected value_ _(none)_
    - :335 `expect` expected _no expected value_ _(none)_
    - :336 `toContainText` expected `'Replay attack rejected'` _(literal)_
- `exported proof re-verifies, and corrupted bytes never do` — e2e/claims.spec.ts:342
    - :351 `toContainText` expected `'✓ Verifier accepted'` _(literal)_
    - :380 `toMatch` expected `expected` _(expression)_
    - :381 `expect` expected _no expected value_ _(none)_
    - :389 `toContainText` expected `'✓ Verifier accepted'` _(literal)_
- `the aggregation estimate matches the real aggregated proof it predicts` — e2e/claims.spec.ts:397
    - :409 `toHaveText` expected `String(count)` _(expression)_
    - :418 `toBe` expected `singleBytes * count` _(expression)_
    - :419 `toBe` expected `batched - aggregated` _(expression)_
    - :420 `expect` expected _no expected value_ _(none)_
    - :421 `toBe` expected `64 * count * 64` _(expression)_
    - :430 `toEqual` expected `[batched, aggregated, naive]` _(expression)_
    - :432 `toBe` expected `100` _(literal)_
    - :433 `expect` expected _no expected value_ _(none)_
    - :437 `toContainText` expected `'Batch size used:', {` _(expression)_
    - :446 `toBe` expected `count` _(expression)_
    - :447 `toBe` expected `aggregated` _(expression)_
    - :448 `toBe` expected `singleBytes * m` _(expression)_
    - :449 `toBe` expected `runBatched - realBytes` _(expression)_
    - :451 `toMatch` expected `/Reference verifier: [\d.]+ ms — ✓ accepted/` _(regex)_
    - :452 `toMatch` expected `/Single-MSM verifier: [\d.]+ ms — ✓ accepted/` _(regex)_
    - :453 `expect` expected _no expected value_ _(none)_
- `a non-power-of-two batch size snaps down, and the panel describes it correctly` — e2e/claims.spec.ts:460
    - :467 `toContainText` expected `'Batch size used:', {` _(expression)_
    - :473 `toBe` expected `4` _(literal)_
    - :474 `toBe` expected `true` _(expression)_
    - :475 `expect` expected _no expected value_ _(none)_
    - :476 `expect` expected _no expected value_ _(none)_
    - :477 `expect` expected _no expected value_ _(none)_
    - :480 `expect` expected _no expected value_ _(none)_
- `benchmark sizes grow by exactly one IPA round pair per doubling` — e2e/claims.spec.ts:486
    - :497 `toBeVisible` expected `{ timeout: 150_000 }` _(expression)_
    - :498 `toBeEnabled` expected `{ timeout: 150_000 }` _(expression)_
    - :505 `toEqual` expected `[` _(expression)_
    - :515 `toBe` expected `singleBytes` _(expression)_
    - :517 `toBe` expected `size(0)` _(expression)_
    - :519 `toBe` expected `2 * POINT` _(expression)_
    - :520 `toBe` expected `2 * POINT` _(expression)_
    - :521 `toBe` expected `2 * POINT` _(expression)_
    - :523 `expect` expected _no expected value_ _(none)_
    - :524 `toBe` expected `5376` _(literal)_
    - :525 `toBe` expected `864` _(literal)_
    - :529 `expect` expected _no expected value_ _(none)_
- `the same seed reproduces the commitment and the proof bit-for-bit` — e2e/claims.spec.ts:536
    - :539 `toContainText` expected `'crypto.getRandomValues'` _(literal)_
    - :544 `toContainText` expected `'seed = ${seed}'` _(expression)_
    - :555 `toBe` expected `a.commitment` _(expression)_
    - :556 `toBe` expected `a.proof` _(expression)_
    - :559 `toBe` expected `a.commitment` _(expression)_
    - :562 `toContainText` expected `'crypto.getRandomValues'` _(literal)_
    - :564 `toContainText` expected `'Generate a proof first.'` _(literal)_
- `changing the value tears down the stale proof and its exhibits` — e2e/claims.spec.ts:570
    - :574 `toContainText` expected `'✓ reference verifier accepted'` _(literal)_
    - :576 `expect` expected _no expected value_ _(none)_
    - :580 `toHaveText` expected `'No verification has been run yet.'` _(literal)_
    - :581 `toHaveText` expected `'No proof has been generated yet.'` _(literal)_
    - :582 `toContainText` expected `'Generate a proof'` _(literal)_
    - :583 `toContainText` expected `'Generate a proof'` _(literal)_
    - :584 `toContainText` expected `'Generate a proof'` _(literal)_
    - :585 `toHaveCount` expected `0` _(literal)_
    - :588 `toBe` expected `''` _(literal)_
    - :589 `toBe` expected `''` _(literal)_
    - :597 `toBe` expected `false` _(expression)_
    - :598 `toBe` expected `true` _(expression)_
    - :599 `toBe` expected `false` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-bulletproofs

## What It Is

Bulletproofs are short non-interactive zero-knowledge proofs that a committed value lies in a given range, with no trusted setup and proof size logarithmic in the range. They reduce to an inner-product argument over ristretto255. The security model is computational under the discrete log assumption; soundness is via Fiat-Shamir in the random oracle model.

## When to Use It

- **Confidential transactions** where you need to prove amounts are non-negative without revealing them — size beats naive OR-proofs by orders of magnitude.
- **Any protocol needing range proofs without a trusted setup ceremony** — unlike Groth16, there is no toxic waste.
- **Aggregated multi-value proofs** where the log-size benefit compounds — dozens of values in a single sub-kilobyte proof.
- **Do NOT use** when you need constant-size proofs — a Groth16 proof is three group elements regardless of circuit size, which is 192 bytes on BLS12-381 and 128 bytes on BN254 (compressed); Bulletproofs grow with `log(range × count)`.
- **Do NOT use** when verifier time matters more than prover time — verification is O(n), not sublinear.
- **Do NOT use in production** — this is a from-scratch teaching implementation; it has not been audited, makes no constant-time guarantees, and must not be used to protect real assets.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-bulletproofs](https://systemslibrarian.github.io/crypto-lab-bulletproofs/)**

Users can commit a 64-bit value, generate a live range proof over ristretto255, verify it, inspect the Fiat-Shamir challenges and per-component proof sizes, run a *batched* multi-value flow, compare its size against the theoretical aggregated Bulletproof, and watch the cheat mode get rejected when the committed value is outside the legal range.

The demo is built as a guided journey — a live **Commit → Prove → Verify → Explore** stepper tracks where you are — and layers its explanation so both a first-time visitor and a working cryptographer get something. The **"What the Verifier Checks"** panel ramps from a plain-English claim, to "the value is the sum of its bits times powers of two", down to the two full verifier equations behind a *Show the algebra* toggle, with each symbol (`T₁`, `T₂`, `τₓ`, `μ`, `δ(y,z)`, `t̂`) carrying a hover gloss. A **"From bits to one inner product"** panel bridges the bit-grid to the folding view by deriving the real vectors `l = a_L − z·1ⁿ` and `r` from your value's live bits and challenges, making explicit *why* 64 bit-constraints collapse into a single inner product. The folding view then **animates** the log₂(64) = 6 rounds shrinking round by round.

### Scope notes

- The single-value range proof is the full Bünz et al. 2018 Protocol 2 with the `H' = y^{-i} H` basis change and a transcript-bound IPA.
- A **true aggregated Bulletproof** (Protocol 2 §4.3) is implemented for power-of-two batch sizes — one log-size proof for *m* values, e.g. 864 B for m=8 vs 5376 B batched.
- A **single-MSM batch verifier** is implemented alongside the reference verifier for both the single-value and the aggregated proof, and exposed in the UI as a second "Verify" button.
- Proofs can be **exported and re-verified** from hex bytes, demonstrating that Bulletproofs are non-interactive.
- A **deterministic seed mode** swaps in a SHA-512 counter PRNG so blinders and proofs are reproducible bit-for-bit (teaching/testing only).
- A **manual tampering panel** flips a bit in `t̂` and shows both verifiers reject.
- The **cheat panel** narrates its own logic: it shows side-by-side the commitment to your out-of-range value versus the commitment the prover could actually prove (`v mod 2⁶⁴`), with the differing hex nibbles highlighted, so the rejection reads as a binding failure rather than "the prover just refuses big numbers".
- The **bit-grid** marks which bits the 24-bit slider can reach versus the full 64-bit proof range, with a caption noting the proof always covers `[0, 2⁶⁴)`.
- A **benchmark panel** measures prove and verify times for the single-value proof and aggregates at *m* = 1, 2, 4, 8.
- All proof sizes shown for the single-value flow are measured from the actual serialized proof bytes, not from a formula.

## What Can Go Wrong

- A range proof only proves the committed value lies in range; it says nothing about *which* value or its meaning. Application logic must still bind the commitment to the right amount/account, or a valid proof can authorize the wrong thing.
- Verification is linear (O(n)) and aggregation cost grows with `log(range × count)`; verifying many proofs one at a time is slow, so batch verification is usually required at scale.
- Fiat-Shamir soundness depends on hashing the full transcript. A challenge not bound to every public input (generators, commitment, prior messages) opens the proof to forgery.
- Implementations are not automatically constant-time; leaking the blinding factor or a scalar through timing can compromise the hiding of the committed value.
- Weak or reused randomness for the blinders breaks the hiding and zero-knowledge properties.

## Real-World Usage

- Monero uses Bulletproofs (and Bulletproofs+) for confidential-transaction range proofs, hiding transaction amounts while proving they are non-negative.
- Mimblewimble-style chains such as Grin and Beam use range proofs without a trusted setup to keep amounts confidential.
- Proof-of-reserves and confidential-asset systems use range proofs to show balances are within valid bounds without disclosing the actual figures.
- More generally, any setting that must prove a hidden value lies in a valid range (ages, balances, limits) without revealing it is a candidate for Bulletproof range proofs.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-bulletproofs
cd crypto-lab-bulletproofs
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-snark-arena](https://systemslibrarian.github.io/crypto-lab-snark-arena/) — Groth16/PLONK zk-SNARKs, the constant-size proofs Bulletproofs are contrasted against.
- [crypto-lab-stark-tower](https://systemslibrarian.github.io/crypto-lab-stark-tower/) — zk-STARKs, another transparent (no trusted setup) proof system.
- [crypto-lab-zk-arena](https://systemslibrarian.github.io/crypto-lab-zk-arena/) — side-by-side comparison of SNARK and STARK proof systems.
- [crypto-lab-zk-proof-lab](https://systemslibrarian.github.io/crypto-lab-zk-proof-lab/) — Schnorr commitments and Fiat-Shamir, the building blocks behind these proofs.
- [crypto-lab-commit-gate](https://systemslibrarian.github.io/crypto-lab-commit-gate/) — Pedersen commitments, the hiding commitment scheme a range proof is built over.

## Testing

`​``bash
npm test         # crypto suite + serialization + aggregate + batch-verifier + headless UI smoke test
npm run build    # production build (type-checks, then bundles)
`​``

CI runs on every push and pull request: see [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
Its `build` job runs `npm test`, `npm run build` and the Chromium accessibility gate, and
both the Pages deploy and the Dependabot auto-merge name that job in `needs:`.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## ZK Arena

- **slug**: `crypto-lab-zk-arena`
- **repo**: https://github.com/systemslibrarian/crypto-lab-zk-arena
- **live**: https://systemslibrarian.github.io/crypto-lab-zk-arena/
- **commit_sha**: `44c494a4c0f7f5666aa4313490f5c346042b54f6` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ZERO-KNOWLEDGE  ·  **level**: advanced  ·  **--accent**: #0a6f96
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: zk-Arena  — _read from src/ui.ts_

**Subtitle**: zk-SNARK vs zk-STARK · Schnorr Σ-protocol  — _read from src/ui.ts_

**Description**: Put the two dominant succinct proof families head to head across proof size, trusted setup, post-quantum security, and prover cost, then run a live Schnorr sigma-protocol that shows how zero-knowledge actually works.  — _read from src/ui.ts_

**Why it matters**: SNARKs and STARKs sit behind rollups and private ledgers, and the choice locks in real costs: a trusted-setup ceremony you must trust forever, on-chain fees that scale with proof size, and whether your system survives a future quantum adversary.  — _read from src/ui.ts_

**Card copy**: A side-by-side comparison playground for zk-SNARK and zk-STARK proof systems — setup phases, proving overhead, verification cost, and the tradeoff space between Groth16, PLONK, and STARKs.

**Chips**: zk-SNARK · zk-STARK compared · Proof Systems · Comparison

**Implements**: Baby-step giant-step `src/pohlig.ts:71`, Fiat-Shamir `src/schnorr.ts:113`, Pohlig–Hellman `src/pohlig.ts:118`, Schnorr `src/ui.ts:1046`, SHA-256 `src/schnorr.ts:121`

**Attacks shown**: Discrete log `src/groups.ts:130`, Factoring `src/ui.ts:758`

**Comment-only (named in code comments, not executed)**: FRI `src/data.ts:3`, Groth16 `src/data.ts:3`, Pedersen commitment `src/trustedsetup.ts:5`, PLONK `src/data.ts:3`, Schnorr identification `src/schnorr.ts:1`, secp256k1 `src/groups.ts:51`, Sigma protocol `src/schnorr.ts:111`

**References**: Bulletproofs, FRI, Groth16, Halo2, Merkle tree, PLONK, Pairing, Pedersen commitment, STARK, Schnorr identification, Shamir secret sharing, Sigma protocol, secp256k1

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `ePrint 2019/1021` — first seen src/data.ts:95 (1×)
- `ePrint 2023/1503` — first seen src/data.ts:40 (1×)
- `eprint.iacr.org/2023/1503` — first seen README.md:122 (2×)
- `NIST SP 800-57` — first seen src/groups.ts:130 (1×)
- `RFC 3526` — first seen scripts/check-bundle-size.mjs:20 (6×)
- `RFC 7919` — first seen src/groups.ts:91 (1×)

**Stated limitations (page)**:

- _(caveat, src/ui.ts)_ Say that precisely. The simulator above picks c itself, so what it establishes is honest-verifier zero knowledge: the transcript leaks nothing to a verifier who draws c at random, as the protocol says to. It does not cover a malicious verifier who chooses c adaptively after seeing t — that needs a stronger argument (rewinding, or a coin-flipping / commit-to-c step), which this exhibit does not show. Fiat–Shamir sidesteps the issue by deriving c from a hash of t, leaving no verifier to misbehave.
- _(caveat, src/ui.ts)_ And zero knowledge is a statement about the transcript, not about the public key. Under the toy parameter set the key itself already gives up about 19 bits of x before the protocol starts — the "Extract the secret" lab at the top of this panel demonstrates exactly that, live. Under the safe parameter set the same lab comes back empty. The transcript argument above is unchanged either way; what changes is whether the public key was leaking to begin with.

**README — What Can Go Wrong**:

```text
- **Assuming a trusted setup is harmless** — if the setup ceremony's secret ("toxic waste") is not destroyed, an attacker can forge proofs; this is the central risk many SNARKs carry and STARKs avoid.
- **Deploying a pairing-based SNARK for long-lived security** — elliptic-curve and pairing assumptions fall to a sufficiently large quantum computer, so harvest-now-decrypt-later concerns apply.
- **Posting large STARK proofs on-chain naively** — proof size drives calldata cost; STARKs are often wrapped in a small SNARK precisely to make on-chain verification cheap.
- **Confusing "transparent" with "zero-knowledge"** — STARK transparency refers to needing no trusted setup; zero-knowledge is a separate, optional property.
- **Reading one benchmark as universal** — prover and verifier times are highly circuit-dependent; a result on one workload may reverse on another.
- **Running a sigma protocol in a group whose order is not prime** — the two live exhibits do exactly that, deliberately and with the fact stated on the page. They use `g = 5` with exponents mod `p − 1` where `p` is the secp256k1 field prime, and `p − 1 = 2 · 3 · 7 · 13441 · q′` is composite. Pohlig–Hellman then recovers `x` modulo each small factor — about 19 bits — from the public key alone. Prime-order groups are a precondition of the security proof, not a stylistic preference.
- **Reading zero-knowledge as unconditional** — the simulator argument shown in the Schnorr panel establishes *honest-verifier* zero knowledge. A verifier who picks the challenge adaptively after seeing the commitment is outside what that argument covers.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-zk-arena

[![Deploy to GitHub Pages](https://github.com/systemslibrarian/crypto-lab-zk-arena/actions/workflows/deploy.yml/badge.svg)](https://github.com/systemslibrarian/crypto-lab-zk-arena/actions/workflows/deploy.yml)
[![Live demo](https://img.shields.io/badge/live-demo-0a6f96)](https://systemslibrarian.github.io/crypto-lab-zk-arena/)
[![No deps](https://img.shields.io/badge/runtime%20deps-0-c68b1a)](./package.json)
[![Lighthouse: Performance 97](https://img.shields.io/badge/Lighthouse-Performance%2097-1e6f3a)](#audited)
[![Lighthouse: A11y 100](https://img.shields.io/badge/Lighthouse-A11y%20100-1e6f3a)](#audited)
[![Lighthouse: BP 100](https://img.shields.io/badge/Lighthouse-Best%20Practices%20100-1e6f3a)](#audited)
[![Lighthouse: SEO 100](https://img.shields.io/badge/Lighthouse-SEO%20100-1e6f3a)](#audited)

## What It Is

A head-to-head comparison of the two leading families of succinct zero-knowledge proof systems: zk-SNARKs and zk-STARKs. Both let a prover convince a verifier that a statement is true without revealing the secret behind it, and both verify far faster than re-running the computation — but they make opposite engineering tradeoffs. The lab opens with a plain-language primer that defines the four load-bearing terms (proof size, prover, verifier, trusted setup) before any comparison begins, then puts the two families side by side across the dimensions that actually drive a design decision (proof size, verifier and prover cost, trusted setup, post-quantum security, cryptographic assumptions, tooling maturity, and on-chain footprint). Two hands-on exhibits make the abstractions concrete: a runnable Schnorr sigma-protocol that shows what zero-knowledge and soundness actually feel like (with an honest-vs-forged toggle), and a real trusted-setup ceremony where keeping the "toxic waste" lets you forge an accepting proof of a false statement — the SNARK backdoor made experiential. An interactive recommender then weights the tradeoffs against your specific use case. The goal is not to crown a winner — neither is strictly better — but to make the tradeoff space legible, with a clear on-ramp for a newcomer and enough depth for a specialist.

## Exhibits

1. **Primer — "What even is a SNARK or a STARK?"** — plainly defines proof size, prover, verifier, and trusted setup, plus a numbered "start here" reading path so a newcomer never lands mid-page in the deep end.
2. **The Arena** — click any of eight comparison dimensions to see both families' values, who it favours, and why; full keyboard tablist navigation.
3. **Proof Sizes, To Scale** — both proofs drawn dot-for-dot at one shared byte scale, with an explicit ratio caption ("showing X KB of a Y KB proof… the SNARK is these N dots") so the size gap is unmistakable.
4. **Run a Zero-Knowledge Proof** — a live, in-browser Schnorr identification protocol (interactive and Fiat–Shamir modes) with an honest-vs-forged toggle that flips soundness on demand. Framed honestly: this teaches the *idea*, not SNARK succinctness, and the panel opens with a toy-parameter disclosure naming the composite group order and the ~19 bits of the secret it leaks.
5. **Break a Trusted Setup** — a real Pedersen-commitment ceremony; destroy the toxic waste τ and a false claim is rejected, keep it and the same commitment forges an accepted opening to a value it never held. Carries the same toy-parameter disclosure, since it runs in the same group.
6. **Pick Your Use Case** — a weighted recommender whose answers are shareable via the URL.
7. **Real Systems, Milestones, and What They Share** — Groth16, PLONK, Halo2, FRI-based STARKs, Plonky2, a short history, and common ground, with first-use glossary popovers for FRI, Merkle paths, pairings, IPA, and recursion.

## When to Use It

- **Choosing a proof system for a project** — answer the recommender's questions to see which family your priorities favour.
- **Teaching zero-knowledge tradeoffs** — show concretely why "which is better, SNARK or STARK?" has no universal answer.
- **Explaining post-quantum implications** — see why pairing-based SNARKs break under quantum attack while hash-based STARKs plausibly survive.
- **Understanding trusted setup** — clarify what a setup ceremony is, why it is a risk, and which systems avoid it.
- **Do NOT treat the figures as exact** — they are representative orders of magnitude; real numbers depend heavily on circuit, curve, field, and parameters.
- **Do NOT** use the recommender as a substitute for a real security review — it is a teaching demo, not production guidance.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-zk-arena](https://systemslibrarian.github.io/crypto-lab-zk-arena/)**

The Arena lets you click any comparison dimension to see both systems' values side by side, which one it favours, and a one-line explanation. The Pick Your Use Case recommender asks about quantum security, trusted setup tolerance, proof-size sensitivity, computation scale, and ecosystem maturity, then renders a weighted SNARK-vs-STARK recommendation bar. Below that, cards cover real systems (Groth16, PLONK, Halo2, FRI-based STARKs, Plonky2) showing how the labels blur in practice, and a Common Ground section covers what both systems share — including the subtlety that a STARK is not always zero-knowledge.

## What Can Go Wrong

- **Assuming a trusted setup is harmless** — if the setup ceremony's secret ("toxic waste") is not destroyed, an attacker can forge proofs; this is the central risk many SNARKs carry and STARKs avoid.
- **Deploying a pairing-based SNARK for long-lived security** — elliptic-curve and pairing assumptions fall to a sufficiently large quantum computer, so harvest-now-decrypt-later concerns apply.
- **Posting large STARK proofs on-chain naively** — proof size drives calldata cost; STARKs are often wrapped in a small SNARK precisely to make on-chain verification cheap.
- **Confusing "transparent" with "zero-knowledge"** — STARK transparency refers to needing no trusted setup; zero-knowledge is a separate, optional property.
- **Reading one benchmark as universal** — prover and verifier times are highly circuit-dependent; a result on one workload may reverse on another.
- **Running a sigma protocol in a group whose order is not prime** — the two live exhibits do exactly that, deliberately and with the fact stated on the page. They use `g = 5` with exponents mod `p − 1` where `p` is the secp256k1 field prime, and `p − 1 = 2 · 3 · 7 · 13441 · q′` is composite. Pohlig–Hellman then recovers `x` modulo each small factor — about 19 bits — from the public key alone. Prime-order groups are a precondition of the security proof, not a stylistic preference.
- **Reading zero-knowledge as unconditional** — the simulator argument shown in the Schnorr panel establishes *honest-verifier* zero knowledge. A verifier who picks the challenge adaptively after seeing the commitment is outside what that argument covers.

## Real-World Usage

- **Zcash** — pioneered production zk-SNARKs for shielded transactions, including multi-party trusted setup ceremonies to reduce toxic-waste risk.
- **Ethereum L2 rollups** — both SNARK-based and STARK-based validity rollups compress many transactions into a single succinct proof verified on-chain.
- **STARK-based scaling** — FRI-based systems and recursive variants like Plonky2 target high-throughput proving for large computations.
- **PLONK and universal setups** — widely adopted because one universal setup can be reused across many circuits, easing the per-circuit ceremony burden of earlier SNARKs.
- **Post-quantum roadmaps** — STARKs are frequently cited as the zero-knowledge option most likely to remain secure in a post-quantum world.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-zk-arena
cd crypto-lab-zk-arena
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-snark-arena](https://systemslibrarian.github.io/crypto-lab-snark-arena/) — compares zk-SNARK constructions (Groth16, PLONK) and their trusted-setup tradeoffs.
- [crypto-lab-stark-tower](https://systemslibrarian.github.io/crypto-lab-stark-tower/) — transparent, post-quantum zk-STARKs built on AIR constraints and FRI.
- [crypto-lab-bulletproofs](https://systemslibrarian.github.io/crypto-lab-bulletproofs/) — short range proofs with no trusted setup via the inner-product argument.
- [crypto-lab-zk-proof-lab](https://systemslibrarian.github.io/crypto-lab-zk-proof-lab/) — interactive Schnorr, commit-reveal, and Fiat-Shamir protocol walkthroughs.
- [crypto-lab-commit-gate](https://systemslibrarian.github.io/crypto-lab-commit-gate/) — hash and Pedersen commitments demonstrating binding and hiding.

## Tech

Vite + TypeScript, zero runtime dependencies. The comparison corpus and recommender weights live in `src/data.ts`; the arena and quiz UI are plain DOM in `src/ui.ts`. The two live-crypto exhibits are real, spec-accurate, and unit-tested: the Schnorr sigma-protocol in `src/schnorr.ts` and the trusted-setup Pedersen-commitment ceremony (with the toxic-waste equivocation) in `src/trustedsetup.ts`. Dark mode throughout.

`​``bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build locally
`​``

Deployed automatically to GitHub Pages from `main` via `.github/workflows/deploy.yml`. Every push is gated on:
unit tests → `tsc && vite build` → bundle-size budget (20 KB JS gz / 8 KB CSS gz) → Playwright E2E + axe-core a11y on Chromium → deploy.

<a id="audited"></a>
## Audited

Run locally against the preview build:

| Tool | Result |
|---|---|
| **Lighthouse Performance** | **97** (median of 3, throttled, headless) |
| **Lighthouse Accessibility** | **100** |
| **Lighthouse Best Practices** | **100** |
| **Lighthouse SEO** | **100** |
| **axe-core** (Chromium, Firefox, WebKit) | 0 violations across 49 passes per engine |
| **Vitest** | 25 / 25 passing |
| **Playwright E2E** | 16 / 16 passing |

## Accessibility

- **`axe-core` clean** across Chromium, Firefox, and WebKit — 0 violations, 49 passes per engine on WCAG 2.1 A/AA + best-practice rules.
- WCAG-AA contrast verified by computed-style sampling in both themes (5.5:1 – 18.1:1 on critical text); high-visibility focus rings.
- Semantic landmarks (`<main>`, `<header role="banner">`, `<footer role="contentinfo">`) and a working skip link.
- The dimension explorer is a proper `tablist`/`tabpanel` with arrow-key / Home / End navigation.
- The recommender is a series of `radiogroup` fieldsets with arrow-key selection and `aria-checked` state.
- Honours `prefers-reduced-motion` and `prefers-color-scheme`. 44 px+ touch targets throughout.
- Print-friendly: `@media print` rules collapse the page into a clean black-on-white teaching handout (nav, buttons, and overlays hidden; outbound link URLs expanded inline).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Research scope review — November 2026

CL3071: Performance rankings depend on workload, backend, curve/field, security target and machine. Prover and verifier dimensions have no universal winner; circuit-size quiz choices give equal family weights. Percentages are heuristic preference weights, not speedups or probabilities. Source: https://eprint.iacr.org/2023/1503 (pp. 13–21).

```

</details>

---

## Frozen Heart

- **slug**: `crypto-lab-frozen-heart`
- **repo**: https://github.com/systemslibrarian/crypto-lab-frozen-heart
- **live**: https://systemslibrarian.github.io/crypto-lab-frozen-heart/
- **commit_sha**: `33b2fa8a0f1bdad92e496bca16c91017fbae8721` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ZERO-KNOWLEDGE | ATTACKS  ·  **level**: advanced  ·  **--accent**: #be123c
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Frozen Heart  — _read from src/main.ts_

**Subtitle**: Weak Fiat-Shamir · transcript binding in NIZKs  — _read from src/main.ts_

**Description**: Runs a real hand-rolled Schnorr proof over ristretto255, turns it non-interactive with Fiat-Shamir, then lets you drop one value from the challenge hash and forge a proof the real verifier accepts.  — _read from src/main.ts_

**Why it matters**: In 2022 the same one-line mistake — a Fiat-Shamir hash missing part of the transcript — let attackers forge proofs across independent production systems. The proof math was correct; the hash input was one value short.  — _read from src/main.ts_

**Card copy**: Forge a Schnorr zero-knowledge proof the real verifier accepts — because the Fiat-Shamir challenge hash left one transcript field out of its input.

**Chips**: Fiat-Shamir · Schnorr · ristretto255 · NIZK

**Implements**: Fiat-Shamir `src/schnorr/fiatshamir.ts:45`, ristretto255 `src/schnorr/group.ts:77`, Schnorr `src/schnorr/verify.ts:49`, SHA-512 `src/schnorr/group.ts:115`

**Attacks shown**: Discrete log `src/main.ts:258`

**Comment-only (named in code comments, not executed)**: EC point arithmetic `src/schnorr/group.ts:48`, Pairing `src/schnorr/verdict.ts:14`, Schnorr identification `src/schnorr/types.ts:18`, Sigma protocol `src/schnorr/group.ts:9`, X25519 `src/schnorr/group.ts:2`

**References**: Bulletproofs, EC point arithmetic, Ed25519, EdDSA, FROST, Groth16, PLONK, STARK, Schnorr identification, Shamir secret sharing, Sigma protocol

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `ASIACRYPT 2012` — first seen src/main.ts:1141 (1×)
- `RFC 9496` — first seen README.md:18 (5×)
- `rfc9496` — first seen src/main.ts:1145 (1×)

**README — What Can Go Wrong**:

```text
The lab *is* the "what can go wrong," reproduced honestly:

- **Drop the commitment `R` from the hash → universal forgery.** The challenge is fixed
  before `R` exists, so a forger picks `s` and solves `R = [s]G − [c]pk`, producing a proof
  that verifies for any target key. This is the Frozen Heart pattern.
- **Drop the message `m` → replay.** The proof of knowledge is still sound, but nothing binds
  it to a context; an honest proof replays verbatim under a different message.
- **Drop the public key `pk` → unbound statements.** No fixed-target forgery, but a proof
  is not tied to any particular key: a witness-free `(key, proof)` pair can be minted, so a
  verifying proof says nothing about a pre-existing identity.
- **Precision matters.** A forgery here is authentication-only. Claiming it recovers the
  secret key or breaks discrete log would be false — and the lab is careful never to.
```

**Claims tested** (e2e/claims.spec.ts, 22 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:36
    - :36 `toHaveAttribute` expected `'data-app-ready', 'true'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:47
    - :47 `toHaveText` expected `label` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:52
    - :52 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:57
    - :57 `toBeVisible` expected _no expected value_ _(none)_
- `drop R: the real verifier ACCEPTS the forgery and the security verdict alarms` — e2e/claims.spec.ts:76
    - :79 `toHaveText` expected `'c = H(G, pk, m)'` _(literal)_
    - :85 `toHaveText` expected `/Equation HOLDS/` _(regex)_
    - :86 `toHaveClass` expected `/is-holds/` _(regex)_
    - :87 `toHaveText` expected `/ALARM/` _(regex)_
    - :88 `toHaveClass` expected `/is-alarm/` _(regex)_
    - :90 `toHaveClass` expected `/\balarm\b/` _(regex)_
    - :91 `toHaveClass` expected `/\bgood\b/` _(regex)_
    - :93 `toHaveText` expected _no expected value_ _(none)_
    - :96 `toHaveText` expected _no expected value_ _(none)_
    - :100 `toHaveClass` expected `/alarm/` _(regex)_
    - :101 `toHaveText` expected `'forgeable'` _(literal)_
    - :102 `toHaveText` expected `/solve R = \[s\]G − \[c\]pk/` _(regex)_
- `the forged proof is real algebra against the advertised target key` — e2e/claims.spec.ts:105
    - :110 `toMatch` expected `/^[0-9a-f]{12}$/` _(regex)_
    - :119 `toHaveCount` expected `3` _(literal)_
    - :130 `toBe` expected `true` _(expression)_
    - :139 `toBe` expected `expectedC` _(expression)_
- `forgery under "${label}" is REJECTED, and the page says why` — e2e/claims.spec.ts:154
    - :157 `toHaveText` expected `formula` _(expression)_
    - :161 `toHaveText` expected `/Equation FAILS/` _(regex)_
    - :162 `toHaveClass` expected `/is-fails/` _(regex)_
    - :163 `toHaveText` expected `/HELD/` _(regex)_
    - :164 `toHaveClass` expected `/\bheld\b/` _(regex)_
    - :165 `toHaveText` expected _no expected value_ _(none)_
    - :169 `toHaveText` expected _no expected value_ _(none)_
    - :173 `toHaveCount` expected `0` _(literal)_
    - :174 `toHaveText` expected `'sound'` _(literal)_
- `an honest prover holds under every preset — the forgery is what changes, not the protocol` — e2e/claims.spec.ts:178
    - :186 `toHaveText` expected `/Equation HOLDS/` _(regex)_
    - :187 `toHaveText` expected `/SOUND/` _(regex)_
    - :188 `toHaveClass` expected `/\bgood\b/` _(regex)_
- `custom toggles reach the same failure as the preset: unchecking R alone forges` — e2e/claims.spec.ts:192
    - :198 `toHaveText` expected `'c = H(G, pk, m)'` _(literal)_
    - :200 `toHaveText` expected `/ALARM/` _(regex)_
    - :204 `toHaveText` expected `STRONG_FORMULA` _(expression)_
    - :205 `toHaveText` expected `/Run an attempt/` _(regex)_
    - :207 `toHaveText` expected `/HELD/` _(regex)_
- `the empty transcript c = H() is forgeable too, and the derivation names it correctly` — e2e/claims.spec.ts:210
    - :216 `toHaveText` expected `'c = H()'` _(literal)_
    - :218 `toHaveText` expected `/ALARM/` _(regex)_
    - :221 `toHaveText` expected `'c = H()'` _(literal)_
- `the derivation formula tracks the fields actually hashed, not a fixed string` — e2e/claims.spec.ts:224
    - :231 `toHaveText` expected `'c = H(pk, m)'` _(literal)_
    - :233 `toHaveText` expected `'c = H(pk, m)'` _(literal)_
- `editing the message discards the stale result rather than showing it under a new transcript` — e2e/claims.spec.ts:236
    - :242 `toHaveText` expected `/ALARM/` _(regex)_
    - :245 `toHaveText` expected `/Run an attempt/` _(regex)_
    - :246 `toHaveCount` expected `0` _(literal)_
    - :265 `toHaveLength` expected `3` _(literal)_
    - :268 `expect` expected _no expected value_ _(none)_
- `every severity chip is exactly the function of the three readings printed beside it` — e2e/claims.spec.ts:281
    - :286 `toHaveCount` expected `5` _(literal)_
    - :305 `toBe` expected `severityFrom(r)` _(expression)_
    - :306 `toBe` expected `labelFor[r.sev]` _(expression)_
    - :309 `toHaveText` expected _no expected value_ _(none)_
    - :312 `toHaveClass` expected `r.forged ? /is-alarm/ : /is-held/` _(expression)_
    - :316 `toHaveClass` expected `hit ? /is-alarm/ : /is-held/` _(expression)_
    - :322 `toBe` expected `1` _(literal)_
    - :323 `toHaveLength` expected `1` _(literal)_
    - :325 `toHaveText` expected _no expected value_ _(none)_
    - :329 `toEqual` expected `new Set(['sound', 'context-loss', 'unbound', 'fatal'])` _(expression)_
- `the ladder drops each field exactly once — the rungs partition the strong transcript` — e2e/claims.spec.ts:332
    - :338 `toHaveLength` expected `1` _(literal)_
    - :339 `expect` expected _no expected value_ _(none)_
    - :347 `toHaveLength` expected `3` _(literal)_
    - :349 `toHaveLength` expected `1` _(literal)_
    - :353 `toEqual` expected `[...all].sort()` _(expression)_
- `the drop-message rung demonstrates the replay its own chip measured` — e2e/claims.spec.ts:356
    - :360 `toBe` expected `true` _(expression)_
    - :361 `toBe` expected `'context-loss'` _(literal)_
    - :367 `toHaveText` expected `/accepted/` _(regex)_
    - :368 `toHaveClass` expected `/is-holds/` _(regex)_
    - :370 `toHaveText` expected `/pay Mallory 5000/` _(regex)_
    - :371 `toHaveText` expected `/ALSO accepted — replayed/` _(regex)_
    - :372 `toHaveClass` expected `/is-alarm/` _(regex)_
- `the drop-pk rung mints an unbound key+proof yet still cannot forge the victim key` — e2e/claims.spec.ts:375
    - :381 `toBe` expected `true` _(expression)_
    - :382 `toBe` expected `false` _(expression)_
    - :383 `toBe` expected `'unbound'` _(literal)_
    - :388 `toHaveText` expected `/accepted — not bound to any identity/` _(regex)_
    - :389 `toHaveClass` expected `/is-alarm/` _(regex)_
    - :391 `toHaveText` expected `/still safe — cannot forge a chosen key/` _(regex)_
    - :392 `toHaveClass` expected `/is-held/` _(regex)_
- `the one-field comparison is measured: strong holds, weak is forged` — e2e/claims.spec.ts:399
    - :402 `toHaveCount` expected `2` _(literal)_
    - :405 `toHaveClass` expected `/good/` _(regex)_
    - :406 `toHaveText` expected `STRONG_FORMULA` _(expression)_
    - :407 `toHaveText` expected `/verifier REJECTS/` _(regex)_
    - :409 `toHaveClass` expected `/is-held/` _(regex)_
    - :412 `toHaveClass` expected `/alarm/` _(regex)_
    - :413 `toHaveText` expected `'c = H(G, pk, m)'` _(literal)_
    - :414 `toHaveText` expected `/verifier ACCEPTS/` _(regex)_
    - :415 `toHaveClass` expected `/is-alarm/` _(regex)_
    - :417 `toHaveText` expected `'− R'` _(literal)_
    - :431 `toBeDisabled` expected _no expected value_ _(none)_
- `stepped ${mode} proof: the verdict matches the two sides the page printed` — e2e/claims.spec.ts:435
    - :442 `toHaveText` expected `/c = H\(G, pk, R, m\)/` _(regex)_
    - :444 `toHaveAttribute` expected _no expected value_ _(none)_
    - :452 `toHaveLength` expected `2` _(literal)_
    - :453 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :457 `toBe` expected `true` _(expression)_
    - :458 `toHaveText` expected _no expected value_ _(none)_
    - :461 `toHaveClass` expected `identical ? /match/ : /nomatch/` _(expression)_
    - :464 `toHaveText` expected _no expected value_ _(none)_
    - :467 `toHaveText` expected `/SOUND/` _(regex)_
    - :468 `toHaveClass` expected `/\bgood\b/` _(regex)_
- `Reset returns the stepper to Ready and clears the verdict` — e2e/claims.spec.ts:472
    - :476 `toHaveCount` expected `1` _(literal)_
    - :478 `toHaveText` expected `'Ready'` _(literal)_
    - :479 `toHaveCount` expected `0` _(literal)_
    - :480 `toBeEnabled` expected _no expected value_ _(none)_
- `the hero CTA drives the whole exploit and lands on ALARM` — e2e/claims.spec.ts:487
    - :492 `toHaveText` expected `/Step 1 of 4/` _(regex)_
    - :493 `toHaveText` expected `/Step 2 of 4/, { timeout: 20_000 }` _(expression)_
    - :495 `toHaveText` expected `/HELD/` _(regex)_
    - :496 `toHaveText` expected `/Step 3 of 4/, { timeout: 20_000 }` _(expression)_
    - :497 `toHaveText` expected `/Step 4 of 4/, { timeout: 20_000 }` _(expression)_
    - :499 `toHaveText` expected `'c = H(G, pk, m)'` _(literal)_
    - :500 `toHaveText` expected `/Equation HOLDS/` _(regex)_
    - :501 `toHaveText` expected `/ALARM/` _(regex)_
- `the transcript policy round-trips through the URL` — e2e/claims.spec.ts:504
    - :509 `toHaveText` expected `'c = H(G, R, m)'` _(literal)_
    - :511 `expect` expected _no expected value_ _(none)_
    - :516 `toHaveAttribute` expected `'data-app-ready', 'true'` _(expression)_
    - :517 `toHaveText` expected `'c = H(G, R, m)'` _(literal)_
    - :518 `toHaveValue` expected `'shared state check'` _(literal)_
    - :519 `toHaveText` expected `'Drop pk'` _(literal)_
- `the page scopes the forgery as authentication-only, not key recovery` — e2e/claims.spec.ts:527
    - :530 `toHaveText` expected `/not.{0,20}recover that key/s` _(regex)_
    - :531 `toHaveText` expected `/not.{0,20}break the discrete-log problem/s` _(regex)_
    - :532 `toHaveText` expected `/authentication forgery, not key recovery/` _(regex)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Frozen Heart

**Weak Fiat-Shamir · transcript binding in NIZKs**

A zero-knowledge proof forged for a statement its author cannot prove — because the
challenge hash omitted one value it should have covered. The proof system is correct; the
hash input was one field short. Built as a live, hand-rolled Schnorr proof over
ristretto255 that you can break yourself against the real verifier.

> **Not production cryptography — a teaching demo.** Everything runs in your browser; keys
> and nonces live only in memory for the session and are never persisted or transmitted.

---

## What It Is

A **Schnorr proof of knowledge** of a discrete logarithm, made non-interactive with the
**Fiat-Shamir transform**, over the **ristretto255** prime-order group (RFC 9496). The
prover convinces a verifier it knows the secret key `x` behind a public key `pk = [x]G`,
without revealing `x`.

Fiat-Shamir replaces the verifier's random challenge with a hash of the transcript. It is
sound **only if that hash covers the whole transcript** — every public input and, crucially,
the prover's commitment `R`. Leave `R` out and the prover, not the hash, effectively
chooses the challenge, which enables a genuine algebraic forgery.

- **The primitives are real.** Point arithmetic and canonical encoding come from the
  audited [`@noble/curves`](https://github.com/paulmillr/noble-curves) library; the Schnorr
  prover, verifier, Fiat-Shamir challenge, and the forgeries are hand-rolled here so the
  internals are inspectable (`src/schnorr/`).
- **The forgery is real.** It is a byte-exact algebraic construction — pick the response
  `s`, then solve `R = [s]G − [c]pk` — run against the same verifier an honest proof faces.
  No simulation, no warning banner standing in for a broken check.
- **Security model.** A forged proof is an **authentication forgery**: the verifier is made
  to believe you hold a key you do not. It does **not** recover the secret key, does **not**
  break the discrete-log problem, and decrypts nothing.

## Exhibits

1. **The transform, stepped** — a real Schnorr proof walked through Commit → Challenge →
   Respond → Verify, with a toggle between the interactive protocol (a live verifier throws
   a random challenge) and the non-interactive Fiat-Shamir version (a hash plays the
   verifier). Shows the exact substitution and why the ordering — commit `R` *before* the
   challenge — is what keeps it honest.
2. **What is "the transcript"?** — toggle which of `{G, pk, R, m}` the challenge hash
   covers; the formula `c = H(...)` updates live.
3. **Break it yourself** — forge a proof for a target public key **whose secret you do not
   have** (the forge code is only ever handed the public key). Two **independent**
   indicators are rendered side by side: the raw *cryptographic result* (did the equation
   balance?) and the *security verdict* (SOUND / HELD / ALARM). Under weak Fiat-Shamir you
   see "Equation HOLDS ✓" next to "ALARM ⚠" — a forged proof that verifies is never green.
4. **The omission ladder** — drop each field in turn and see the verdict the *real verifier*
   returns: only dropping the commitment `R` is fatal; dropping the message enables replay;
   dropping the public key leaves proofs unbound to any identity; dropping the generator is
   harmless in one fixed group. Each rung's severity is *derived* from three measurements
   taken live against the real verifier — a fixed-target forgery attempt, a witness-free
   key-and-proof minting attempt, and a replay of one honest proof under a second message —
   and all three readings are shown next to the chip. The severity is never switched on the
   rung's name, so if the algebra underneath changed the chip would change with it. The
   italic line under each rung is commentary, and is labelled as such.
5. **Frozen Heart (2022)** — the Trail of Bits disclosures that hit independent
   implementations of Girault's proof of knowledge, Bulletproofs, and PlonK with the *same*
   root cause, plus a one-panel note on the random-oracle model.

## When to Use It

- **Use it** to build intuition for why "hash the transcript" must mean *the entire*
  transcript, and to see the difference between a fatal omission and a merely sloppy one.
- **Use it** to explain the Frozen Heart bug class to engineers reviewing a Fiat-Shamir
  implementation.
- **Do NOT use it** as a cryptographic library. This is a teaching build: it favours
  transparency over constant-time discipline and side-channel resistance, and it is not
  audited for production. For real Schnorr signatures use a vetted library and a specified
  scheme (e.g. Ed25519 / BIP-340).

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-frozen-heart/**

Step the transform, toggle the transcript fields, and forge a proof the real verifier
accepts — then watch the security verdict alarm even though the equation balances.

## What Can Go Wrong

The lab *is* the "what can go wrong," reproduced honestly:

- **Drop the commitment `R` from the hash → universal forgery.** The challenge is fixed
  before `R` exists, so a forger picks `s` and solves `R = [s]G − [c]pk`, producing a proof
  that verifies for any target key. This is the Frozen Heart pattern.
- **Drop the message `m` → replay.** The proof of knowledge is still sound, but nothing binds
  it to a context; an honest proof replays verbatim under a different message.
- **Drop the public key `pk` → unbound statements.** No fixed-target forgery, but a proof
  is not tied to any particular key: a witness-free `(key, proof)` pair can be minted, so a
  verifying proof says nothing about a pre-existing identity.
- **Precision matters.** A forgery here is authentication-only. Claiming it recovers the
  secret key or breaks discrete log would be false — and the lab is careful never to.

## Real-World Usage

The **Frozen Heart** vulnerabilities (Trail of Bits, 2022) were exactly this bug, found
independently across unrelated codebases: Girault's Schnorr-style proof of knowledge (in
threshold-signature libraries), Bulletproofs range proofs, and PlonK zk-SNARKs. Each spec
said "hash the transcript"; each implementer decided for themselves what that included, and
some left a value out. The fix in every case was to fold every public input and every
commitment into the Fiat-Shamir challenge. Impact varied by construction, and every issue
was responsibly disclosed and patched — this lab reproduces the *class* of bug on the
minimal Schnorr vehicle, not any specific product's exploit.

## How to Run Locally

`​``bash
npm install
npm run dev        # http://localhost:5173/crypto-lab-frozen-heart/
npm test           # unit tests: KATs, round-trips, forgeries, the omission ladder
npm run build      # type-check + production build to dist/
npm run test:e2e   # browser gate: functional claims + axe-core WCAG 2.1 A/AA, both themes
npm run test:a11y  # just the accessibility half of that gate
`​``

## Related Demos

Every one of these Fiat-Shamirs something, and so rests on the transcript-binding
assumption this lab pokes at:

- [zk-proof-lab](https://systemslibrarian.github.io/crypto-lab-zk-proof-lab/) — a
  zero-knowledge on-ramp
- [ec-point-arithmetic](https://systemslibrarian.github.io/crypto-lab-ec-point-arithmetic/)
  — the group underneath
- [bulletproofs](https://systemslibrarian.github.io/crypto-lab-bulletproofs/)
- [snark-arena](https://systemslibrarian.github.io/crypto-lab-snark-arena/)
- [stark-tower](https://systemslibrarian.github.io/crypto-lab-stark-tower/)
- [zk-arena](https://systemslibrarian.github.io/crypto-lab-zk-arena/)
- [mpcith-sign](https://systemslibrarian.github.io/crypto-lab-mpcith-sign/)
- [frost-threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) —
  nonce commitments

## Build & Verify

- **52 unit tests** (Vitest), all passing, including **18 known-answer tests**:
  - **16 RFC 9496 ristretto255 vectors** — the canonical encodings of `[0]B`…`[15]B`,
    verifying the group layer is the real ristretto255 bit-for-bit
    (`src/schnorr/group.test.ts`).
  - **2 NIST SHA-512 vectors** — `SHA-512("")` and `SHA-512("abc")`.
- **Group migration controls** retain identity decoding, reject malformed byte lengths,
  preserve scalar reduction across the group order, and pin the little-endian
  SHA-512-to-scalar transcript pipeline against an independently derived value.
- **Correctness** — honest proofs verify (100 randomized round-trips); the verifier rejects
  every tampered response, commitment, message, and wrong key, and rejects out-of-range
  responses fail-closed (`src/schnorr/schnorr.test.ts`).
- **Attack tests** — the weak-Fiat-Shamir forgery is *accepted* by the real verifier across
  50 random targets; the strong transform *rejects* all 50; the omission ladder confirms
  exactly one rung (drop `R`) yields a verifying fixed-target forgery
  (`src/schnorr/forge.test.ts`).
- **22 browser claims tests** (Playwright, `e2e/claims.spec.ts`) — the rendered page is
  driven for real and its verdicts are asserted, not assumed: the forged proof is accepted
  under `drop R` and rejected under every other preset (each with the reason it gives); the
  forgery's own printed `s`, `c`, `R` are fed back through the repo's group code to
  recover the target key and re-derive the challenge, proving the derivation shown is the
  arithmetic performed; every omission-ladder severity chip is recomputed from the three
  measurements printed beside it; and the stepped transform's verdict is checked against
  the two hex sides the page itself rendered.
- **Accessibility** — `@axe-core/playwright` scans the production build for zero WCAG 2.1
  A/AA violations in **both** themes; the GitHub Pages deploy is blocked on any failure.

Run everything: `npm test && npm run build && npm run test:e2e`.

### Public deployment verification

The Pages workflow now distinguishes its local build gate, deployment, and actual
public verification. After successful deployment it checks every published file
against hashes captured from that build, with the checked-out commit and exact
lockfile recorded separately. It then runs the original full 24-test suite on the
deployment URL, without a local server, changed assertions or longer time budgets.
The current suite covers dark desktop and 380px layouts; it does not test light mode.
Missing, failed, skipped, flaky or incomplete reports fail the public verification
job. A successful Pages job alone does not establish successful public verification.

Run the gate's fixture controls with
`node --test tools/verify-public-deployment.test.mjs`. For an independent live run,
set `PUBLIC_DEPLOYMENT_URL=https://systemslibrarian.github.io/crypto-lab-frozen-heart/`
and use `npx playwright test --config playwright.public.config.ts`. This produces
`public-browser-results.json`; the workflow additionally compares discovered test
membership and immutable build evidence before reporting success.

## Performance

All operations are single ristretto255 scalar multiplications and one SHA-512 — sub-
millisecond each; the UI recomputes proofs and the full omission ladder synchronously on
every interaction with no perceptible delay.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Polynomial Forge

- **slug**: `crypto-lab-polynomial-forge`
- **repo**: https://github.com/systemslibrarian/crypto-lab-polynomial-forge
- **live**: https://systemslibrarian.github.io/crypto-lab-polynomial-forge/
- **commit_sha**: `5e0cc9a9517114df2cc2587f1830d0bdb176d590` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: ZERO-KNOWLEDGE  ·  **level**: advanced  ·  **--accent**: #9f88ff
- **MISSING FIELDS**: verification

**Name (H1)**: Polynomial Forge  — _read from src/ui/intro.ts_

**Subtitle**: KZG · IPA · FRI · BLS12-381  — _read from src/ui/intro.ts_

**Description**: Commits one polynomial three ways, steps the division that makes an opening proof exist, then runs a powers-of-tau ceremony whose transcript verifies perfectly while every contributor keeps their toxic waste.  — _read from src/ui/intro.ts_

**Why it matters**: Every modern proof system - the ones securing rollups holding billions - rests on a polynomial commitment. The fastest of the three needs a ceremony nobody can audit for the one thing that matters, and the check that catches the other failure here is the one protocols forget to run.  — _read from src/ui/intro.ts_

**Card copy**: Commit with KZG, IPA and FRI; explore missing degree checks and toxic setup. Construct two false KZG openings that pass a premature batch challenge, then bind the proofs into the transcript.

**Chips**: KZG · IPA · FRI · Degree Bound

**Implements**: BLS12-381 `src/crypto/bls.ts:15`, FRI `src/crypto/fri.ts:83`, Hash-to-curve `src/crypto/bls.ts:171`, KZG commitment `src/crypto/compare.ts:108`, Merkle tree `src/crypto/compare.ts:30`, Pairing `src/crypto/bls.ts:83`, SHA-256 `src/crypto/kzg.ts:115`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Bulletproofs `src/crypto/ipa.ts:4`, EC point arithmetic `src/crypto/bls.ts:31`, Fiat-Shamir `src/crypto/fr.ts:81`, Grover's algorithm `src/crypto/merkle.ts:6`, NTT `src/crypto/compare.ts:13`, PLONK `src/crypto/batch.ts:3`, Reed-Solomon `src/crypto/degree-attack.ts:5`, Shor's algorithm `src/crypto/merkle.ts:9`, STARK `src/crypto/fri.ts:4`

**References**: BLS signatures, Bulletproofs, EC point arithmetic, Fiat-Shamir, Grover's algorithm, Halo2, NTT, PLONK, Pedersen commitment, Reed-Solomon, STARK, Shor's algorithm

**Standards body**: IETF, NIST

**Implementation**: @noble BLS12-381 group operations and pairings / local KZG, IPA and FRI teaching implementations

**Spec citations, exactly as written**:

- `ePrint 2024/398` — first seen src/crypto/batch.ts:1 (1×)
- `eprint.iacr.org/2024/398` — first seen README.md:239 (2×)

**README — What Can Go Wrong**:

```text
This is the threat model, and most of it is on the page rather than in this file.

**A ceremony transcript cannot prove erasure (NEG-2).** Every check a powers-of-tau transcript
supports is a statement about published points: that a contribution is well-formed, that the
contributor knew their factor, that the finished SRS is powers of one τ. Erasure is a statement
about a value that is by construction not published, and about an event in the physical world.
Exhibit 4 runs the identical audit over an honest ceremony and a fully dishonest one and the output
is byte-for-byte the same. The mitigation is not a better check — it is more participants, so that
"at least one was honest and careful" becomes a cheap assumption. It is still an assumption about
people.

**Knowing τ destroys binding entirely, for everyone.** With τ known, the verification equation
stops being a test and becomes an equation you can solve: `π = (τ − z)⁻¹ · (C − [y]₁)` satisfies it
for any `y`. Read that right-hand side carefully — it is one subtraction and one scalar
multiplication on points the forger already has. It never extracts `p(τ)` from `C`, so it never
solves a discrete log, so **the forger does not need to know the committed polynomial at all**. A
commitment somebody else made, to data the forger has never seen, can be opened to any value at any
point. Exhibit 4 does exactly that, and `ceremony.test.ts` pins it with a test that forges against a
commitment whose polynomial is generated inside a closure and never handed to the forging code.

**A commitment binds a polynomial, not a statement about it (NEG-1).** Nothing in the KZG
verification equation mentions degree. A verifier that checks only openings has checked that the
committed polynomial passes through the constrained points and nothing else, and
`p(X) + Z(X)·h(X)` passes through exactly the same points for any `h`. Exhibit 5 is that attack.
**It does not break evaluation binding** — the cheating witness is a different polynomial with a
different commitment, and neither commitment opens to two values at one point. What is false is the
protocol's low-degree claim, one layer above. The mitigation is the shifted-commitment check, and
the reason it works is that the cheating prover cannot produce the input — which is exactly why it
has to be run.

**Fiat-Shamir binds only what it absorbs.** Both the IPA and FRI on this page are public-coin
protocols made non-interactive by hashing the transcript. Absorbing too little is the Frozen Heart
class of bug — see [Frozen Heart](https://systemslibrarian.github.io/crypto-lab-frozen-heart/).
`src/crypto/transcript.ts` length-prefixes every item so no two message sequences can collide.

**Structural checks before algebra.** A non-canonical scalar (a 32-byte value at or above `r`) or a
point on the curve but outside the prime-order subgroup that reached a pairing would be checking a
different statement than the one asked. The parser refuses both, and reports `MALFORMED_PROOF`
rather than a false `PAIRING_FAIL`.

**Failure codes.** `PAIRING_FAIL` · `POINT_MISMATCH` · `SETUP_MISMATCH` · `MALFORMED_PROOF` ·
`DEGREE_EXCEEDED`. Every one is reachable from the page, and `e2e/claims.spec.ts` asserts that the
set the page documents is exactly the set it can emit. `DEGREE_UNENFORCED` is deliberately **not**
a failure code: it is a standing banner about the verifier's configuration, because rendering the
omission as a rejection would misrepresent what a real verifier experiences, which is silence.

---
```

**Claims tested** (e2e/claims.spec.ts, 31 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:74
    - :74 `toHaveAttribute` expected `'data-app-ready', 'true'` _(expression)_
- `Act 1 — the commitment` — e2e/claims.spec.ts:113
- `the size table is arithmetically consistent with the controls it describes` — e2e/claims.spec.ts:114
    - :124 `expect` expected _no expected value_ _(none)_
    - :129 `toBe` expected `coefCount * 32` _(expression)_
    - :133 `toBe` expected `48` _(literal)_
    - :137 `toBeCloseTo` expected `polyBytes / commitBytes, 1` _(expression)_
    - :142 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :143 `toBe` expected `commitBytes * 2` _(expression)_
    - :145 `toEqual` expected `[]` _(expression)_
- `the commitment tracks the polynomial and is deterministic` — e2e/claims.spec.ts:148
    - :158 `toBe` expected `before` _(expression)_
    - :163 `toBe` expected `before` _(expression)_
    - :164 `toEqual` expected `[]` _(expression)_
- `Act 2 — the headline mechanism` — e2e/claims.spec.ts:168
- `every cell of the division tableau is what an independent division gives` — e2e/claims.spec.ts:169
    - :178 `toBe` expected `c.length` _(expression)_
    - :201 `expect` expected _no expected value_ _(none)_
    - :204 `expect` expected _no expected value_ _(none)_
    - :213 `toBe` expected `6` _(literal)_
    - :214 `expect` expected _no expected value_ _(none)_
    - :215 `expect` expected _no expected value_ _(none)_
    - :236 `toBe` expected `rhs` _(expression)_
    - :239 `toEqual` expected `[]` _(expression)_
- `remainder + claimed y = p(z), by two independent routes` — e2e/claims.spec.ts:242
    - :256 `toBe` expected `frEval(c, z)` _(expression)_
    - :258 `toBe` expected `trueY` _(expression)_
    - :260 `toBe` expected `BigInt(claimed)` _(expression)_
    - :262 `toEqual` expected `[]` _(expression)_
- `the verdict matches whether the value was actually true` — e2e/claims.spec.ts:265
    - :279 `toHaveAttribute` expected `'data-kind', 'ok'` _(expression)_
    - :280 `toContainText` expected `'ACCEPTED'` _(literal)_
    - :282 `toHaveAttribute` expected `'data-kind', 'rejected'` _(expression)_
    - :283 `toContainText` expected `'PAIRING_FAIL'` _(literal)_
    - :286 `toEqual` expected `[]` _(expression)_
- `every failure code is reachable, and the page names the real cause` — e2e/claims.spec.ts:290
- `all five codes are emitted by the paths that should emit them` — e2e/claims.spec.ts:291
    - :297 `toContainText` expected `'PAIRING_FAIL'` _(literal)_
    - :302 `toBe` expected `0n` _(expression)_
    - :303 `expect` expected _no expected value_ _(none)_
    - :308 `toContainText` expected `'POINT_MISMATCH'` _(literal)_
    - :310 `expect` expected _no expected value_ _(none)_
    - :315 `toContainText` expected `'SETUP_MISMATCH'` _(literal)_
    - :319 `toBe` expected `detail['that SRS']` _(expression)_
    - :324 `toContainText` expected `'MALFORMED_PROOF'` _(literal)_
    - :326 `expect` expected _no expected value_ _(none)_
    - :340 `expect` expected _no expected value_ _(none)_
    - :341 `toContainText` expected `'DEGREE_EXCEEDED'` _(literal)_
    - :351 `toEqual` expected `seen` _(expression)_
    - :352 `toBe` expected `5` _(literal)_
    - :354 `toEqual` expected `[]` _(expression)_
- `DEGREE_UNENFORCED is shown as a standing banner and never as a failure` — e2e/claims.spec.ts:357
    - :362 `toBeVisible` expected _no expected value_ _(none)_
    - :365 `toHaveAttribute` expected `'data-kind', 'alarm'` _(expression)_
    - :366 `toContainText` expected `'DEGREE_UNENFORCED'` _(literal)_
    - :368 `toContainText` expected `'no failure code'` _(literal)_
    - :372 `toBeHidden` expected _no expected value_ _(none)_
    - :374 `toContainText` expected `'DEGREE_EXCEEDED'` _(literal)_
    - :375 `toHaveAttribute` expected `'data-kind', 'ok'` _(expression)_
    - :376 `toEqual` expected `[]` _(expression)_
- `NEG-2 — well-formedness is verifiable, erasure is not` — e2e/claims.spec.ts:380
- `the transcript audit of a fully toxic ceremony is identical to an honest one` — e2e/claims.spec.ts:381
    - :387 `toContainText` expected `'TRANSCRIPT VERIFIES'` _(literal)_
    - :392 `toContainText` expected `'TRANSCRIPT VERIFIES'` _(literal)_
    - :400 `toEqual` expected `honest` _(expression)_
    - :401 `toEqual` expected `honestVerdict` _(expression)_
    - :402 `toEqual` expected `[]` _(expression)_
- `the audited check count matches the rows it counts and the roster it audits` — e2e/claims.spec.ts:405
    - :411 `toContainText` expected `'TRANSCRIPT VERIFIES'` _(literal)_
    - :416 `toBe` expected `auditRows.length` _(expression)_
    - :422 `toBe` expected `Number(count) * 6 + 4` _(expression)_
    - :424 `toBe` expected `Number(count)` _(expression)_
    - :426 `toEqual` expected `[]` _(expression)_
- `the recovered trapdoor is the product of the factors the page printed` — e2e/claims.spec.ts:429
    - :447 `toBe` expected `3` _(literal)_
    - :449 `expect` expected _no expected value_ _(none)_
    - :450 `expect` expected _no expected value_ _(none)_
    - :454 `toBe` expected `product` _(expression)_
    - :458 `expect` expected _no expected value_ _(none)_
    - :459 `toEqual` expected `[]` _(expression)_
- `a forged opening is accepted for a value the test knows is false` — e2e/claims.spec.ts:462
    - :476 `toHaveAttribute` expected `'data-kind', 'alarm'` _(expression)_
    - :477 `toContainText` expected `'ACCEPTED'` _(literal)_
    - :481 `toBe` expected `truth` _(expression)_
    - :482 `toBe` expected `lie` _(expression)_
    - :485 `toBe` expected `truth` _(expression)_
    - :488 `toContainText` expected `'TRANSCRIPT VERIFIES'` _(literal)_
    - :496 `toContainText` expected `'Well-formedness is verifiable; erasure is not.'` _(literal)_
    - :497 `toHaveAttribute` expected `'data-kind', 'alarm'` _(expression)_
    - :498 `toHaveAttribute` expected `'data-kind', 'ok'` _(expression)_
    - :499 `toEqual` expected `[]` _(expression)_
- `one erased factor is enough: there is nothing to forge from` — e2e/claims.spec.ts:502
    - :509 `toContainText` expected `'FORGERY IMPOSSIBLE'` _(literal)_
    - :511 `toHaveAttribute` expected `'data-kind', 'ok'` _(expression)_
    - :514 `expect` expected _no expected value_ _(none)_
    - :515 `toEqual` expected `[]` _(expression)_
- `NEG-1 — a commitment binds a polynomial, not a statement about it` — e2e/claims.spec.ts:519
- `every opening of an over-degree witness is accepted, with no code to report` — e2e/claims.spec.ts:520
    - :527 `expect` expected _no expected value_ _(none)_
    - :531 `toBe` expected `row[2]` _(expression)_
    - :532 `expect` expected _no expected value_ _(none)_
    - :534 `toHaveAttribute` expected `'data-kind', 'alarm'` _(expression)_
    - :535 `toContainText` expected `'no failure code'` _(literal)_
    - :536 `toEqual` expected `[]` _(expression)_
- `evaluation binding is intact — and the page checks that rather than claiming it` — e2e/claims.spec.ts:539
    - :555 `expect` expected _no expected value_ _(none)_
    - :558 `expect` expected _no expected value_ _(none)_
    - :561 `expect` expected _no expected value_ _(none)_
    - :567 `expect` expected _no expected value_ _(none)_
    - :568 `expect` expected _no expected value_ _(none)_
    - :571 `toContainText` expected _no expected value_ _(none)_
    - :578 `toHaveAttribute` expected `'data-kind', 'alarm'` _(expression)_
    - :581 `toContainText` expected `'binds a polynomial, not a statement about it'` _(literal)_
    - :582 `toContainText` expected `'no failure code available'` _(literal)_
    - :583 `toEqual` expected `[]` _(expression)_
- `the two witnesses agree exactly where the protocol looks and nowhere else` — e2e/claims.spec.ts:586
    - :602 `expect` expected _no expected value_ _(none)_
    - :606 `expect` expected _no expected value_ _(none)_
    - :607 `expect` expected _no expected value_ _(none)_
    - :610 `toBe` expected `r[3]` _(expression)_
    - :611 `expect` expected _no expected value_ _(none)_
    - :614 `toBe` expected `r[3]` _(expression)_
    - :615 `expect` expected _no expected value_ _(none)_
    - :624 `expect` expected _no expected value_ _(none)_
    - :625 `toBe` expected `c[2]` _(expression)_
    - :627 `toEqual` expected `[]` _(expression)_
- `Act 6 — the comparison reports what it measured` — e2e/claims.spec.ts:631
- `the size ratios agree with the proof sizes in the table` — e2e/claims.spec.ts:632
    - :635 `toContainText` expected `'ALL THREE VERIFIED'` _(literal)_
    - :648 `expect` expected _no expected value_ _(none)_
    - :649 `expect` expected _no expected value_ _(none)_
    - :650 `expect` expected _no expected value_ _(none)_
    - :652 `expect` expected _no expected value_ _(none)_
    - :653 `expect` expected _no expected value_ _(none)_
    - :660 `toBe` expected `2 * Math.log2(padded) * 48 + 3 * 32` _(expression)_
    - :662 `toBe` expected `2 * 32 + 48` _(expression)_
    - :667 `toBe` expected `'constant'` _(literal)_
    - :668 `toBe` expected `'logarithmic'` _(literal)_
    - :669 `toBe` expected `'polylogarithmic'` _(literal)_
    - :670 `expect` expected _no expected value_ _(none)_
    - :671 `expect` expected _no expected value_ _(none)_
    - :674 `expect` expected _no expected value_ _(none)_
    - :675 `expect` expected _no expected value_ _(none)_
    - :676 `expect` expected _no expected value_ _(none)_
    - :678 `expect` expected _no expected value_ _(none)_
    - :680 `toEqual` expected `[]` _(expression)_
- `the FRI soundness figure follows from the parameters printed beside it` — e2e/claims.spec.ts:683
    - :696 `toBe` expected `Math.round(queries * Math.log2(blowup))` _(expression)_
    - :698 `expect` expected _no expected value_ _(none)_
    - :699 `expect` expected _no expected value_ _(none)_
    - :703 `expect` expected _no expected value_ _(none)_
    - :705 `expect` expected _no expected value_ _(none)_
    - :706 `toEqual` expected `[]` _(expression)_
- `verdicts retire when their inputs move, and only then` — e2e/claims.spec.ts:710
- `changing the polynomial retires a fresh verdict and says why` — e2e/claims.spec.ts:711
    - :714 `toHaveAttribute` expected `'data-kind', 'ok'` _(expression)_
    - :716 `toBeVisible` expected _no expected value_ _(none)_
    - :720 `toHaveAttribute` expected `'data-kind', 'idle'` _(expression)_
    - :721 `toContainText` expected `'RETIRED'` _(literal)_
    - :723 `toContainText` expected `'the polynomial changed'` _(literal)_
    - :726 `toHaveCount` expected `0` _(literal)_
    - :727 `toEqual` expected `[]` _(expression)_
- `re-running the ceremony retires the downstream forgery verdict` — e2e/claims.spec.ts:730
    - :735 `toHaveAttribute` expected `'data-kind', 'alarm'` _(expression)_
    - :738 `toHaveAttribute` expected `'data-kind', 'idle'` _(expression)_
    - :739 `toContainText` expected `'RETIRED'` _(literal)_
    - :740 `toEqual` expected `[]` _(expression)_
- `NO-OP GUARD: re-selecting a value already selected does not retire anything` — e2e/claims.spec.ts:743
    - :748 `toHaveAttribute` expected `'data-kind', 'ok'` _(expression)_
    - :757 `toHaveAttribute` expected `'data-kind', 'ok'` _(expression)_
    - :758 `toContainText` expected `'ACCEPTED'` _(literal)_
    - :763 `toHaveAttribute` expected `'data-kind', 'idle'` _(expression)_
    - :764 `toEqual` expected `[]` _(expression)_
- `nothing hidden is painted, and nothing painted is hidden` — e2e/claims.spec.ts:768
- `the [hidden] cascade trap` — e2e/claims.spec.ts:769
    - :779 `toEqual` expected `[]` _(expression)_
    - :784 `toBeVisible` expected _no expected value_ _(none)_
    - :786 `toBeHidden` expected _no expected value_ _(none)_
    - :788 `toBeVisible` expected _no expected value_ _(none)_
    - :789 `toEqual` expected `[]` _(expression)_
- `the honest-scoping claims the page makes about itself are on the page` — e2e/claims.spec.ts:792
    - :798 `expect` expected _no expected value_ _(none)_
    - :799 `expect` expected _no expected value_ _(none)_
    - :800 `expect` expected _no expected value_ _(none)_
    - :801 `expect` expected _no expected value_ _(none)_
    - :808 `toContainText` expected `'Well-formedness is verifiable; erasure is not.'` _(literal)_
    - :812 `toContainText` expected `'binds a polynomial, not a statement about it'` _(literal)_
    - :813 `toEqual` expected `[]` _(expression)_

**Mutation records** (1 file(s)):

- `tools/check-batch-mutations.mjs` (2581 bytes)

<details><summary>Full README</summary>

```markdown
# Polynomial Forge

**KZG · IPA · FRI · Polynomial Commitment Schemes · BLS12-381**

A browser demo of the commitment layer underneath modern zero-knowledge proof systems. It commits
one polynomial three ways, steps the division that makes an opening proof exist at all, runs a real
multi-party powers-of-tau ceremony, and then shows two failures that leave every cryptographic check
green: a ceremony whose transcript verifies perfectly while every contributor keeps their toxic
waste, and a degree bound nobody enforced.

> **Not production cryptography — a teaching demo.**

**[Open the live demo →](https://systemslibrarian.github.io/crypto-lab-polynomial-forge/)**

---

## What It Is

Three polynomial commitment schemes, all committing to the same polynomial over `Fr`, the scalar
field of BLS12-381:

| Scheme | Powers | Setup | Proof | Verify | Post-quantum |
|---|---|---|---|---|---|
| **KZG** (Kate–Zaverucha–Goldberg, 2010) | PLONK-style systems | trusted, universal | constant | constant — one pairing equation | no |
| **IPA** (inner-product argument; Bootle et al. 2016, Bünz et al. 2018) | Bulletproofs / Halo-style systems | transparent | logarithmic | linear | no |
| **FRI** (Ben-Sasson et al. 2018) | STARK-style systems | transparent | polylogarithmic | polylogarithmic | yes |

**The problem.** A proof about a computation gets turned into a handful of claims about
polynomials. Somebody has to make those claims short and checkable without handing over the
polynomial. That is what a polynomial commitment does, and it is why changing the commitment scheme
gives you a different proof system with the same logic — which is exactly what Halo (IPA under a
PLONK-shaped protocol) and the STARK family (FRI) are.

**The exact primitives.**

- **KZG on BLS12-381.** Commit `C = [p(τ)]₁ = Σ cᵢ·[τⁱ]₁`. Open at `z` with the quotient
  `q(X) = (p(X) − y)/(X − z)` and `π = [q(τ)]₁`. Verify `e(C − [y]₁, [1]₂) = e(π, [τ − z]₂)`.
  Degree bounds are enforced — when you switch them on — by the standard shifted-commitment check
  `e(C_shift, [1]₂) = e(C, [τ^(D−d)]₂)`.
- **Powers of tau**, multi-party, with Bowe–Gabizon–Miers proofs of knowledge
  (`e(s, [r]h) = e([r]s, h)`) and full geometric-series consistency
  (`e([τʲ]₁, [1]₂) = e([τʲ⁻¹]₁, [τ]₂)` for every `j`).
- **IPA** in the Bulletproofs/Halo form: generators from hash-to-curve on a public tag, `log₂(n)`
  folding rounds, `2·log₂(n)` group elements plus one scalar.
- **FRI** with a DEEP quotient, a coset evaluation domain, SHA-256 Merkle commitments over
  value pairs, and Fiat-Shamir challenges.

**Security model.** All three are implemented in their **binding, non-hiding** form. Hiding
variants add blinding terms; hiding is not what this page is about and is named as out of scope
rather than left to be assumed. Randomness comes from the browser CSPRNG. Nothing is persisted and
there is no backend.

**Not production cryptography.** Real deployments batch openings across many polynomials, work in
Lagrange basis, use a fixed ceremony output, and run FRI with an NTT and a field-tuned hash. This
lab is coefficient-basis, single-opening, and written to be read. The FRI parameters are chosen so
the page responds instantly, and the soundness figure it prints is labelled a heuristic because
that is what it is.

**Where the crypto comes from.** BLS12-381 group and pairing arithmetic is `@noble/curves`
(audited, dependency-free, and what the rest of this fleet uses); SHA-256 is `@noble/hashes`. The
pairing is not the teaching subject here — [Pairing Gate](https://systemslibrarian.github.io/crypto-lab-pairing-gate/)
takes it apart — so it comes from a library rather than being hand-rolled. **Everything above the
group operations is hand-rolled in `src/crypto/` and meant to be inspected**: the polynomial
division, the commitment and verification algebra, the degree-bound check, the ceremony and its
pairing checks, both attacks, the inner-product argument, and FRI.

---

## Exhibits

1. **Commit.** Edit the coefficients and watch the polynomial's own size grow while the commitment
   stays at 48 bytes. Both sizes are measured, not asserted, and the commitment is a real
   multi-scalar multiplication against the ceremony's reference string.
2. **Open and verify — the mechanism.** The synthetic-division tableau for `(p(X) − y) ÷ (X − z)`,
   steppable row by row, with the remainder cell in plain sight. Change the claimed value and the
   remainder stops being zero in front of you; press verify and the real pairing agrees. Four
   tamper buttons then break a genuine proof four specific ways, one per failure code.
3. **The ceremony.** A real multi-party powers-of-tau run: each participant draws a factor,
   rescales every power in the exponent, and publishes a proof of knowledge. The transcript audit is
   a table of real pairing equations computed from the public record alone.
4. **Toxic waste (Attack 1).** Set every participant to keep their factor. The audit stays green,
   row for row, word for word. Then multiply the factors, recover τ, and forge an opening for any
   value you like — which the same verifier from Exhibit 2 accepts.
5. **The degree bound nobody checked (Attack 2).** An over-degree witness that hits every
   constraint point. Every KZG opening verifies, no failure code is available, and a standing
   `DEGREE_UNENFORCED` banner says so. Switch enforcement on and the same witness is refused with
   `DEGREE_EXCEEDED`.
6. **Three schemes, one polynomial.** All three measured in your browser on the same polynomial at
   the same opening point: setup type, commitment size, proof size, verifier cost, and
   post-quantum status.
7. **Why Groth16 is not on the list.** The contrast between a monolithic SNARK with a
   circuit-specific structured reference string and a polynomial-IOP-plus-commitment design.

---

## When to Use It

**Use a polynomial commitment when** you need to prove statements about large amounts of data
succinctly — rollup validity proofs, verifiable computation, data-availability sampling (this is
what EIP-4844 blob commitments are), vector commitments, and verifiable secret sharing.

**Choose KZG when** proof size and verifier cost dominate and a universal ceremony is acceptable —
one ceremony serves every circuit up to its degree bound. **Choose IPA when** you cannot accept a
trusted setup and can afford linear verification. **Choose FRI when** you need post-quantum
security or want no setup at all, and can afford proofs measured in tens of kilobytes.

**Do NOT use this code for anything.** It is a teaching implementation: single-opening,
coefficient-basis, non-hiding, with FRI parameters chosen for page responsiveness rather than for a
security target. For real work use `c-kzg-4844`, `arkworks`, `halo2`, or `winterfell`.

**Do NOT use KZG at all** if you cannot point at a specific ceremony and say who ran it and why you
believe at least one participant destroyed their contribution. Exhibit 4 exists because that
sentence is the entire security argument, and no transcript can supply it for you.

---

## Live Demo

**<https://systemslibrarian.github.io/crypto-lab-polynomial-forge/>**

You can: edit a polynomial and watch its commitment stay 48 bytes; step a synthetic division and
see why the remainder has to be zero; type a wrong value and have the real pairing reject it; break
a real proof four ways and see a different failure code for each; run a powers-of-tau ceremony with
one to six participants at three different degrees; make every participant dishonest and watch the
audit stay green; recover the trapdoor and forge an accepted proof of something false; run an
over-degree witness past a verifier that never checks degree; and measure all three schemes against
each other.

---

## What Can Go Wrong

This is the threat model, and most of it is on the page rather than in this file.

**A ceremony transcript cannot prove erasure (NEG-2).** Every check a powers-of-tau transcript
supports is a statement about published points: that a contribution is well-formed, that the
contributor knew their factor, that the finished SRS is powers of one τ. Erasure is a statement
about a value that is by construction not published, and about an event in the physical world.
Exhibit 4 runs the identical audit over an honest ceremony and a fully dishonest one and the output
is byte-for-byte the same. The mitigation is not a better check — it is more participants, so that
"at least one was honest and careful" becomes a cheap assumption. It is still an assumption about
people.

**Knowing τ destroys binding entirely, for everyone.** With τ known, the verification equation
stops being a test and becomes an equation you can solve: `π = (τ − z)⁻¹ · (C − [y]₁)` satisfies it
for any `y`. Read that right-hand side carefully — it is one subtraction and one scalar
multiplication on points the forger already has. It never extracts `p(τ)` from `C`, so it never
solves a discrete log, so **the forger does not need to know the committed polynomial at all**. A
commitment somebody else made, to data the forger has never seen, can be opened to any value at any
point. Exhibit 4 does exactly that, and `ceremony.test.ts` pins it with a test that forges against a
commitment whose polynomial is generated inside a closure and never handed to the forging code.

**A commitment binds a polynomial, not a statement about it (NEG-1).** Nothing in the KZG
verification equation mentions degree. A verifier that checks only openings has checked that the
committed polynomial passes through the constrained points and nothing else, and
`p(X) + Z(X)·h(X)` passes through exactly the same points for any `h`. Exhibit 5 is that attack.
**It does not break evaluation binding** — the cheating witness is a different polynomial with a
different commitment, and neither commitment opens to two values at one point. What is false is the
protocol's low-degree claim, one layer above. The mitigation is the shifted-commitment check, and
the reason it works is that the cheating prover cannot produce the input — which is exactly why it
has to be run.

**Fiat-Shamir binds only what it absorbs.** Both the IPA and FRI on this page are public-coin
protocols made non-interactive by hashing the transcript. Absorbing too little is the Frozen Heart
class of bug — see [Frozen Heart](https://systemslibrarian.github.io/crypto-lab-frozen-heart/).
`src/crypto/transcript.ts` length-prefixes every item so no two message sequences can collide.

**Structural checks before algebra.** A non-canonical scalar (a 32-byte value at or above `r`) or a
point on the curve but outside the prime-order subgroup that reached a pairing would be checking a
different statement than the one asked. The parser refuses both, and reports `MALFORMED_PROOF`
rather than a false `PAIRING_FAIL`.

**Failure codes.** `PAIRING_FAIL` · `POINT_MISMATCH` · `SETUP_MISMATCH` · `MALFORMED_PROOF` ·
`DEGREE_EXCEEDED`. Every one is reachable from the page, and `e2e/claims.spec.ts` asserts that the
set the page documents is exactly the set it can emit. `DEGREE_UNENFORCED` is deliberately **not**
a failure code: it is a standing banner about the verifier's configuration, because rendering the
omission as a rejection would misrepresent what a real verifier experiences, which is silence.

---

## Real-World Usage

- **EIP-4844 (Ethereum, 2024).** Blob commitments are KZG on BLS12-381, over a setup produced by a
  ceremony with more than 140,000 participants. This lab's KZG verification is pinned against all
  122 published `verify_kzg_proof` vectors from that specification, and against the mainnet
  ceremony output itself.
- **PLONK and its descendants** (Halo2, Plonky, Aztec, zkSync, Scroll) use KZG or IPA as the
  commitment under a polynomial IOP. Swapping the commitment is how Halo removed the trusted setup.
- **STARKs** (StarkWare, Polygon Miden, RISC Zero, Winterfell) use FRI, which is why they are
  post-quantum and why their proofs are measured in tens or hundreds of kilobytes.
- **Verkle trees**, proposed for Ethereum state, are built from polynomial commitments rather than
  hashes precisely because the commitment is constant-size regardless of arity.

---

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-polynomial-forge.git
cd crypto-lab-polynomial-forge
npm install
npm run dev          # http://localhost:5173/crypto-lab-polynomial-forge/
`​``

`​``bash
npm test             # the unit and KAT suite
npm run build        # tsc --noEmit && vite build
npx playwright install chromium
npm run test:a11y    # the WCAG 2.1 AA gate, against the production build
npm run test:claims  # the claims suite: does the page tell the truth
`​``

---

## Related Demos

- **[Pairing Gate](https://systemslibrarian.github.io/crypto-lab-pairing-gate/)** — the BLS12-381
  pairing itself, taken apart. This lab uses it; that one explains it.
- **[Bulletproofs](https://systemslibrarian.github.io/crypto-lab-bulletproofs/)** — the
  inner-product argument in its more famous job, proving ranges.
- **[STARK Tower](https://systemslibrarian.github.io/crypto-lab-stark-tower/)** — FRI as the engine
  of a STARK rather than as a standalone commitment.
- **[SNARK Arena](https://systemslibrarian.github.io/crypto-lab-snark-arena/)** — Groth16 end to
  end, which is the system Exhibit 7 contrasts against.
- **[Frozen Heart](https://systemslibrarian.github.io/crypto-lab-frozen-heart/)** — what happens
  when a Fiat-Shamir transcript absorbs too little.
- **[Commit Gate](https://systemslibrarian.github.io/crypto-lab-commit-gate/)** — commitment
  schemes at their simplest, hiding and binding on a single value.
- **[Context Ward](https://systemslibrarian.github.io/crypto-lab-context-ward/)** — the same shape
  as Exhibit 4 in a different setting: every check green, the system owned anyway.

---

## Build & Verify

Vite + TypeScript, static, no backend. `npm test` runs **311 unit tests** across 12 files.

**Last-challenge batch exhibit.** The separate two-opening example implements the
linear system in [The Last Challenge Attack on Fiat-Shamir in KZG-based SNARKs](https://eprint.iacr.org/2024/398),
§4.1 equation (11), PDF page 10. It uses the current ceremony's public SRS with
`p(X) = 3 + 2X + X²`. Honest mode is the default. Attack mode changes both
values and solves for two proof points *after* the premature challenge: each
individual opening fails, but the weighted BLS12-381 pairing passes. The
proof-bound control hashes both witnesses before deriving its challenge and
rejects these same false openings. The attack never receives the setup secret.
This isolates the KZG batch mechanism; it does not implement the full PLONK
exploit or prove security of every repaired protocol.

Nine unit cases cover three independent setups, both solved group equations,
honest acceptance, individual rejection, proof-bound rejection, transcript
sensitivity, and malformed metadata. Browser assertions check displayed values
and verdicts, two point choices, and retirement after control or ceremony changes.
All four added rendering states are scanned at 1280px, 380px, and 280px.

**Known-answer tests.** `src/crypto/__vectors__/eip4844.json` pins the Ethereum EIP-4844 trusted
setup prefix and all **122 published `verify_kzg_proof` vectors**, recorded with the repository,
commit SHA, and URLs they were fetched from. `src/crypto/kat.test.ts` runs them, and it pins two
independent things:

1. **That the fixture is genuine.** The pinned G1 monomial powers are checked against the pinned G2
   powers by pairing — `e([τʲ]₁, [1]₂) = e([τʲ⁻¹]₁, [τ]₂)` for every power — so a transcription
   error cannot pass. That is a test of the data, before any test of the code.
2. **That this lab's verifier agrees with the reference implementation** on all 122 cases,
   including the tri-state distinction between `invalid` (well-formed, wrong) and `error`
   (malformed input, which must be refused before any algebra).

Then the lab's own commit/open/verify runs end to end against the mainnet SRS, so a bug anywhere in
the pipeline shows up as a failed pairing against Ethereum's ceremony rather than against our own.

**The accessibility gate.** `npm run test:a11y` scans the *production build* served by
`vite preview` for zero WCAG 2.1 A/AA violations, across every state the lab teaches, at desktop
and 380px width. It asserts axe's `incomplete` bucket as well as `violations`, computes contrast
arithmetically over composited surfaces, measures non-text (1.4.11) contrast against a ratchet
baseline that is currently empty, and checks reflow (1.4.10), which axe has no rule for at all. The
GitHub Pages deploy is blocked if any of it fails.

**The claims suite.** `npm run test:claims` checks that the page tells the truth: the division
tableau re-derived cell by cell from the inputs on screen, `remainder + y = p(z)`, the recovered
trapdoor recomputed as the product of the factors the page listed, the two negative claims asserted
as fixtures, every failure code reached through its own path, verdict retirement, and a no-op guard
that a re-selection does not retire a fresh result.

---

## Performance

Measured in-browser and reported on the page rather than quoted here, because the numbers are
whatever your machine does. The shapes are stable: a KZG proof is 112 bytes and verifies with one
two-pairing check; an IPA proof over 16 coefficients is 480 bytes and verifies with an n-sized
multi-scalar multiplication; a FRI proof at blowup 8 with 20 queries is about 22 KB and verifies in
polylogarithmic time. The ceremony costs one scalar multiplication per power per participant and
one pairing per power to audit, which is why the degree-128 option takes a few seconds and says so.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---
