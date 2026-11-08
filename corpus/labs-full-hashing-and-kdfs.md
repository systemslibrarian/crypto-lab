# Crypto Lab audit corpus — HASHING & KDFS

Generated 2026-11-08T20:20:28.593Z from 16 lab record(s).

Every finding must cite **commit_sha + lab slug + field**. A field printed as
`MISSING` was not found by the generator; it is not a claim that the lab lacks it.

---
## Phantom Vault

- **slug**: `crypto-lab-phantom-vault`
- **repo**: https://github.com/systemslibrarian/crypto-lab-phantom-vault
- **live**: https://systemslibrarian.github.io/crypto-lab-phantom-vault/
- **commit_sha**: `678c505db98d5324952e160400bb9f0e465a0a55` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `7f35ac6ea5c3f03af18267fa586591c9ff49486b`
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS  ·  **level**: advanced  ·  **--accent**: #3d8ef8
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Phantom Vault  — _read from src/main.ts_

**Subtitle**: Stateless password derivation · PBKDF2 → HMAC-DRBG → rejection sampling  — _read from src/main.ts_

**Description**: Regenerate a site-specific password on demand from a master passphrase plus context, watching PBKDF2 key-stretch, HMAC-DRBG, and rejection sampling build it step by step — with nothing stored.  — _read from src/main.ts_

**Why it matters**: No stored vault means no vault database to breach or sync — the risk moves to your master passphrase and the device deriving from it. Bump the version to rotate a leaked password, and context keeps each site independent — but effective strength is capped by that passphrase.  — _read from src/main.ts_

**Card copy**: Derive any password from a master passphrase using HMAC-DRBG. Nothing stored, nothing synced, nothing left behind to breach.

**Chips**: PBKDF2-SHA-256 · HMAC-DRBG · Rejection Sampling

**Implements**: HMAC `src/crypto/hmac-drbg.ts:36`, HMAC-DRBG `src/crypto/hmac-drbg.ts:53`, PBKDF2 `src/crypto/pbkdf2.ts:32`, SHA-256 `src/crypto/hmac-drbg.ts:42`

**Attacks shown**: Brute force `src/main.ts:140`, Dictionary attack `README.md:32`

**References**: Argon2, CTR-DRBG, HKDF, SHA-1, bcrypt, scrypt

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `NIST SP 800-132` — first seen README.md:45 (3×)
- `NIST SP 800-90A` — first seen README.md:63 (1×)
- `NIST SP 800-90A Rev 1` — first seen src/crypto/hmac-drbg.ts:51 (3×)
- `NIST SP 800-90A Rev.1` — first seen README.md:46 (4×)
- `RFC 8018` — first seen README.md:44 (1×)
- `SP 800-90A Rev.1` — first seen README.md:5 (6×)

**README — What Can Go Wrong**:

```text
- Master passphrase compromise cascades globally: if an attacker learns the passphrase, every derived credential can be regenerated.
- Weak or low-entropy passphrase selection: deterministic generation cannot compensate for guessable input material.
- Context collisions (`service`, `username`, `version`) across accounts: reused context produces identical outputs and defeats separation.
- Incorrect implementation of rejection sampling: modulo-biased mapping would skew distribution and reduce effective password strength.
- Operational misuse of versioning: failing to track version changes can lock users out after rotation.
```

**Claims tested** (e2e/claims.spec.ts, 15 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:13
    - :13 `toHaveValue` expected `before, { timeout: 60_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:14
    - :14 `toHaveAttribute` expected `'data-state', 'done'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:16
    - :16 `toHaveLength` expected `20` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:31
    - :31 `toHaveValue` expected `''` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:38
    - :38 `toHaveValue` expected `'', { timeout: 60_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:39
    - :39 `toHaveAttribute` expected `'data-state', 'done'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:41
    - :41 `toHaveLength` expected `20` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:47
    - :47 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
- `break-it panel recovers a weak passphrase and its pivot matches what the vault itself derives` — e2e/claims.spec.ts:50
    - :58 `toHaveValue` expected `''` _(literal)_
    - :59 `toContainText` expected `'Not the passphrase.'` _(literal)_
    - :66 `toContainText` expected _no expected value_ _(none)_
    - :69 `toHaveText` expected `'password123'` _(literal)_
    - :79 `expect` expected _no expected value_ _(none)_
    - :82 `expect` expected _no expected value_ _(none)_
    - :91 `expect` expected _no expected value_ _(none)_
    - :92 `expect` expected _no expected value_ _(none)_
    - :96 `expect` expected _no expected value_ _(none)_
    - :97 `toContainText` expected `'reachable-support upper bound'` _(literal)_
    - :98 `toContainText` expected `'cannot establish exact collision odds'` _(literal)_
    - :102 `toBe` expected `'github.com'` _(literal)_
    - :103 `toBe` expected `stolen` _(expression)_
    - :109 `toBe` expected `pivotPassword` _(expression)_
- `break-it panel genuinely fails outside the wordlist, and the same credential falls once the list contains it` — e2e/claims.spec.ts:112
    - :121 `toContainText` expected _no expected value_ _(none)_
    - :127 `toContainText` expected _no expected value_ _(none)_
    - :130 `toContainText` expected _no expected value_ _(none)_
    - :133 `toHaveCount` expected `0` _(literal)_
    - :134 `toHaveCount` expected `0` _(literal)_
    - :141 `toContainText` expected _no expected value_ _(none)_
    - :144 `toHaveText` expected `STRONG` _(expression)_
    - :145 `toHaveText` expected `stolen` _(expression)_
    - :157 `toBe` expected `stolen` _(expression)_
    - :160 `toBe` expected `pivotPassword` _(expression)_
- `modulo-bias panel uses exact byte-domain counts and labels run data as observation` — e2e/claims.spec.ts:163
    - :171 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :172 `toContainText` expected `'Exact 256-value mapping'` _(literal)_
    - :173 `toContainText` expected `'Run observation (not a statistical proof)'` _(literal)_
    - :174 `toContainText` expected `'deviation'` _(literal)_
    - :177 `toContainText` expected `/receives \d+ of 256/` _(regex)_
    - :178 `toContainText` expected `/receives exactly \d+ of \d+ accepted values/` _(regex)_
- `the strength readout never certifies a passphrase the Break-it panel recovers` — e2e/claims.spec.ts:191
    - :198 `toHaveValue` expected `'password123'` _(literal)_
    - :199 `toHaveValue` expected `'64'` _(literal)_
    - :203 `expect` expected _no expected value_ _(none)_
    - :204 `expect` expected _no expected value_ _(none)_
    - :209 `toHaveAttribute` expected `'data-state', 'done', {` _(expression)_
    - :219 `expect` expected _no expected value_ _(none)_
    - :221 `toBe` expected `'Strength: Weak'` _(literal)_
    - :223 `toMatch` expected _no expected value_ _(none)_
    - :227 `toMatch` expected `/^at most /` _(regex)_
    - :231 `expect` expected _no expected value_ _(none)_
    - :235 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :236 `toHaveText` expected `'password123'` _(literal)_
- `no live panel keeps describing the passphrase after the field is cleared` — e2e/claims.spec.ts:248
    - :257 `toContainText` expected `'composition ceiling'` _(literal)_
    - :258 `expect` expected _no expected value_ _(none)_
    - :261 `toHaveAttribute` expected `'data-state', 'done', {` _(expression)_
    - :266 `toHaveValue` expected `''` _(literal)_
    - :267 `toContainText` expected `'Type a master passphrase above'` _(literal)_
    - :268 `toContainText` expected `'composition ceiling'` _(literal)_
    - :269 `expect` expected _no expected value_ _(none)_
    - :273 `expect` expected _no expected value_ _(none)_
    - :280 `toHaveText` expected `'n/a'` _(literal)_
- `editing a derivation input retires every result it produced` — e2e/claims.spec.ts:294
    - :299 `expect` expected _no expected value_ _(none)_
    - :300 `toBeVisible` expected _no expected value_ _(none)_
    - :305 `toHaveValue` expected `''` _(literal)_
    - :306 `toContainText` expected `'Inputs changed'` _(literal)_
    - :307 `toHaveText` expected `'Strength: n/a'` _(literal)_
    - :308 `toHaveCount` expected `0` _(literal)_
    - :309 `toHaveCount` expected `0` _(literal)_
    - :310 `toHaveAttribute` expected `'data-state', 'ready'` _(expression)_
    - :311 `toContainText` expected `'Inputs changed'` _(literal)_
    - :315 `toHaveLength` expected `20` _(literal)_
    - :316 `expect` expected _no expected value_ _(none)_
- `an in-flight attack is discarded when a new derivation re-arms the panel` — e2e/claims.spec.ts:328
    - :339 `toContainText` expected `'Guess'` _(literal)_
    - :343 `toContainText` expected `'gitlab.example'` _(literal)_
    - :347 `toContainText` expected `'Attack superseded', {` _(expression)_
    - :350 `toHaveCount` expected `0` _(literal)_
    - :355 `toContainText` expected _no expected value_ _(none)_
    - :358 `toHaveText` expected `'password123'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-phantom-vault

## What It Is

Phantom Vault is a stateless password derivation demo that combines PBKDF2-SHA-256, HMAC-DRBG (SP 800-90A Rev.1 §10.1.2), and rejection sampling to deterministically produce service-specific passwords. It solves the problem of storing synced password vault data by regenerating credentials from a master passphrase plus context (`service`, `username`, and `version`). The model is symmetric and deterministic: whoever knows the same inputs can regenerate the same output. This is not asymmetric cryptography, zero-knowledge proof storage, or threshold key management, and it does not provide account recovery if the passphrase is lost.

## When to Use It

- You want deterministic per-service passwords without syncing a vault: the same inputs always reproduce the same password on any device.
- You need explicit rotation by version number: incrementing `version` gives a new output while old versions remain reproducible.
- You want an auditable educational pipeline: the UI exposes progress and DRBG state snapshots so each derivation stage is inspectable.
- You should not use it when users need recovery workflows: because no secrets are stored, forgotten master passphrases cannot be recovered.
- You should not use it where policy requires random one-time generated passwords per account: this design is deterministic by definition.
- Do NOT use it to protect real credentials — it is an educational demo, not a hardened password manager.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-phantom-vault](https://systemslibrarian.github.io/crypto-lab-phantom-vault/)**

The demo derives passwords in-browser from a master passphrase plus service context and selected charset rules. You can tune service, username, version, output length, and character class toggles (`lowercase`, `uppercase`, `digits`, `symbols`), then run derivation and inspect pipeline/proof output. The demo does not encrypt/decrypt stored payloads; it only derives deterministic passwords.

The strength readout reports an **entropy upper bound** as `min(master-passphrase composition ceiling, output-format ceiling, 256-bit PBKDF2 seed ceiling)`. It does not measure actual entropy. With public context fixed, the deterministic pipeline maps a 32-byte secret seed to one output: it cannot reach more than 2^256 passwords, even when the format admits more strings. A weak passphrase can impose a much lower limit.

All three terms are ceilings, and the readout says so. The passphrase figure is `length x log2(apparent character pool)` — a composition model assuming uniform selection, not a measurement of a human-chosen phrase's entropy. It cannot certify strength, so only the `Weak` band is stated as a verdict; every band above it is printed as `at most ...`. `password123` scores 56.9 bits here and the Break-it panel recovers it at guess 5 of the shipped 8-line wordlist.

Five interactive exhibits let you *feel* that lesson rather than just read it:

1. **The entropy cap.** A two-bar chart plots format capacity against an entropy upper bound, with a dashed line marking the lower of the composition model and the 256-bit seed limit. Neither bar measures actual entropy. Drag **Length** and toggle character classes: format capacity can climb beyond 256 bits, but the entropy upper bound cannot. A one-click **"Try a weak passphrase (`password123`)"** preset cranks every knob to maximum and shows the much lower composition ceiling holding firm.
2. **Seeing modulo bias.** Two side-by-side histograms enumerate the complete 256-value byte domain, contrasting naive `byte % N` mapping with rejection sampling. Because these are exact mapping counts rather than a small random sample, the favoured low positions and the equal accepted counts are guaranteed to appear correctly. A separate run note reports how many generated bytes happened to land in the rejected tail without treating that observation as statistical proof.
3. **The DRBG ratchet.** Each `Generate` call is shown stepping the internal state forward — `K,V (before) → HMAC → K,V (after)` — with a plain-language note that **K** is the current HMAC key and **V** the running value, making "reproducible yet non-repeating" tangible.
4. **Prove It.** The panel runs the real derivation several times with controlled input changes and tabulates the outputs with a pass/fail verdict, proving all three behavioral claims live: determinism (same inputs → same password), rotation (new `version` → new password), and context separation (different `service` → different password).
5. **Break It — crack the master passphrase.** Exhibit 1 asserts that a weak passphrase caps effective strength; this one makes that falsifiable. After a derivation the panel is handed exactly what an attacker who stole *one* derived password would hold — the password and the public context (service, username, version, length, charset), never the passphrase, which is cleared from the form first. It then runs an offline dictionary attack: every candidate goes through the *real* pipeline (PBKDF2 at the shipped iteration count, HMAC-DRBG, rejection sampling) and the output is compared to the stolen password. A hit reports the credential-consistent candidate, format capacity, and a reachable-support upper bound limited by the seed. For the 64-character, 89-symbol format with every class required, the valid-string count is about 414.446 bits; reachable support is at most 256 bits. Seed collisions and later mapping collisions are both possible. Format counting supplies no output distribution, exact collision odds, entropy measurement or proof that the candidate is the unique original passphrase. The cross-service password is a real computed prediction that needs independent confirmation. A miss reports an honest exhaustion rather than a claim of safety. The search is deliberately toy-scale (8 candidates, one tab, sequential); the measured rate describes this tab, not an estimate of a dedicated attacker's speed.

## What Can Go Wrong

- Master passphrase compromise cascades globally: if an attacker learns the passphrase, every derived credential can be regenerated.
- Weak or low-entropy passphrase selection: deterministic generation cannot compensate for guessable input material.
- Context collisions (`service`, `username`, `version`) across accounts: reused context produces identical outputs and defeats separation.
- Incorrect implementation of rejection sampling: modulo-biased mapping would skew distribution and reduce effective password strength.
- Operational misuse of versioning: failing to track version changes can lock users out after rotation.

## Real-World Usage

- PKCS #5 / RFC 8018 PBKDF2: defines PBKDF2 for password-based key derivation used broadly in application and credential protection workflows.
- NIST SP 800-132: recommends PBKDF2 for deriving cryptographic keys from passwords in federal guidance.
- NIST SP 800-90A Rev.1 HMAC-DRBG: standardizes the DRBG construction implemented by this project for deterministic pseudorandom byte generation.
- OpenSSL PKCS #8 encrypted private keys (`PBES2`): commonly uses PBKDF2 parameters when protecting private keys with passphrases.
- WPA2-PSK (`PBKDF2-HMAC-SHA1`): derives Wi-Fi pre-shared key material from passphrases using the PBKDF2 design family.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-phantom-vault
cd crypto-lab-phantom-vault
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-kdf-arena](https://systemslibrarian.github.io/crypto-lab-kdf-arena/) — compares HKDF, PBKDF2, scrypt, and Argon2id.
- [crypto-lab-bcrypt-forge](https://systemslibrarian.github.io/crypto-lab-bcrypt-forge/) — bcrypt password hashing and cost factors.
- [crypto-lab-drbg-arena](https://systemslibrarian.github.io/crypto-lab-drbg-arena/) — HMAC_DRBG, CTR_DRBG, and Hash_DRBG per NIST SP 800-90A.
- [crypto-lab-corrupted-oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/) — DRBG backdoor demonstration (Dual_EC_DRBG) and analysis lineage.
- [crypto-lab-quantum-vault-kpqc](https://systemslibrarian.github.io/crypto-lab-quantum-vault-kpqc/) — post-quantum-oriented vault exploration.

## Verifying Correctness

A deterministic crypto pipeline is only trustworthy if you can prove each stage is correct. This project ships that proof rather than asserting it in comments:

- **HMAC-DRBG known-answer test.** `src/crypto/hmac-drbg.test.ts` runs the official NIST CAVP HMAC_DRBG / SHA-256 vector (no-reseed, prediction-resistance-false). If the implementation deviates from SP 800-90A Rev.1 §10.1.2 by a single bit, this test fails.
- **Uniform-mapping test.** `npm run verify:uniformity` maps 100,000 random bytes through the rejection sampler and runs a chi-square goodness-of-fit test against the uniform distribution, comparing the statistic to the computed critical value (df = charset − 1, with a strict α = 1e-4 so the automated check is non-flaky while still catching genuine bias). This demonstrates that rejection sampling removes the modulo bias that `byte % N` would introduce.
- **Attack tests.** `src/attack/cracker.test.ts` drives the offline cracker against real derivations and pins both outcomes: a passphrase inside the wordlist is recovered at the right guess index and its cross-service pivot equals an independently derived password, while a passphrase outside the list exhausts and recovers nothing. It also checks that the *correct* passphrase under altered public context, and a truncated stolen password, both fail — so the match cannot be loosened into a membership or prefix test. Because the exhibit's real claim is not "the cracker works" but "the cracker only ever holds what an attacker holds", that claim is now tested directly: the stolen credential is asserted to carry no passphrase field, a spy on the derivation records that every guess run through the pipeline came from the wordlist and nowhere else (the one extra call being the pivot, which is allowed the passphrase only because the search just reproduced the stolen credential), and — the sharpest of them — a credential *deliberately contaminated* with the true passphrase, searched with a wordlist that does not contain it, must still recover nothing. An attack panel that quietly read the secret would pass every other test in this file and fail that one. `e2e/claims.spec.ts` repeats both paths in a browser and checks the panel's verdicts against values the vault's own deriver produces on screen: the pivot prediction on the success path, and on the failure path both the credential the search exhausted against and the pivot it goes on to predict once the wordlist contains the passphrase — proving the miss was about the wordlist and nothing else.
- **Pipeline property tests.** `src/derive/pipeline.test.ts` asserts the three behavioral claims the UI makes: determinism (same inputs → same password), rotation (a new `version` → a new password, old versions still reproducible), and context separation (changing `service`/`username` changes the output).
- **Capacity and seed controls.** `src/crypto/charset.test.ts` independently counts valid 64-character strings with exact BigInt dynamic programming, rather than reusing the floating-point inclusion-exclusion implementation. UI tests check that a large composition figure and format capacity above 256 cannot raise the seed ceiling. `e2e/seed-cap.spec.ts` derives and cracks a long output with the real worker/pipeline at desktop, 380px and 320px widths, checking the separate capacity/support disclosures and the absence of a uniqueness claim. These controls do not measure the seed distribution or establish full security.

Run everything with:

`​``bash
npm install
npm run check   # type-check (app + tests) + tests + uniformity
npm run build
npm run test:e2e # full browser, accessibility and teaching controls
`​``

## Data Sources

- NIST SP 800-90A Rev.1, HMAC-DRBG (§10.1.2)
- NIST SP 800-132, PBKDF2 recommendations
- NIST CAVP DRBGVS HMAC_DRBG/SHA-256 known-answer vectors (used in the test suite)
- OWASP Password Storage Cheat Sheet

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Babel Hash

- **slug**: `crypto-lab-babel-hash`
- **repo**: https://github.com/systemslibrarian/crypto-lab-babel-hash
- **live**: https://systemslibrarian.github.io/crypto-lab-babel-hash/
- **commit_sha**: `bbb6ae53e87acd550d69b3c2aef13515ae906584` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS  ·  **level**: intermediate  ·  **--accent**: #6ecfff
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: babel-hash  — _read from demos/babel-hash/src/main.ts_

**Subtitle**: SHA-256 · SHA3-256 · BLAKE3 · HMAC  — _read from demos/babel-hash/src/main.ts_

**Description**: Flip one input bit to watch the avalanche effect scramble a digest, then run a length-extension attack against bare SHA-256(secret ∥ msg)  — _read from demos/babel-hash/src/main.ts_

**Why it matters**: Using a raw Merkle–Damgård hash as a MAC lets attackers forge valid tags without the secret — a flaw that shipped in real APIs. Knowing which construction to reach for is the difference between an authenticated message and a spoofable one.  — _read from demos/babel-hash/src/main.ts_

**Card copy**: SHA-256, SHA3-256, and BLAKE3 side by side with live avalanche visualization, length extension attack demo, and HMAC defense.

**Chips**: SHA-256 · SHA3-256 · BLAKE3 · HMAC

**Implements**: BLAKE3 `demos/babel-hash/src/crypto/hash.ts:127`, HMAC `demos/babel-hash/src/crypto/hmac.ts:9`, SHA-256 `demos/babel-hash/src/crypto/length-extension.ts:61`, SHA-3 `demos/babel-hash/src/crypto/hash.ts:123`

**Attacks shown**: Brute force `demos/babel-hash/src/main.ts:827`, Length extension `demos/babel-hash/src/crypto/hmac.ts:7`, Timing side-channel `README.md:24`

**References**: Argon2, Double Ratchet, Grover's algorithm, HKDF, Keccak, MD5, Merkle tree, PBKDF2, SHA-1, SHA-512, SLH-DSA, SPHINCS+, Serpent, Shamir secret sharing, bcrypt, scrypt

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `eprint.iacr.org/2026/1120` — first seen README.md:115 (2×)
- `eprint.iacr.org/2026/232` — first seen README.md:115 (2×)
- `EUROCRYPT 2026` — first seen demos/babel-hash/src/main.ts:333 (1×)
- `FIPS 180-4` — first seen README.md:57 (3×)
- `FIPS 202` — first seen README.md:32 (4×)
- `RFC 2104` — first seen demos/babel-hash/src/crypto/hmac.ts:4 (1×)
- `rfc2104` — first seen demos/babel-hash/src/crypto/hmac.ts:4 (1×)

**README — What Can Go Wrong**:

```text
- **Length-extension:** raw SHA-256 (Merkle–Damgård) lets an attacker extend a digest without knowing the secret, so `hash(secret || message)` is not a safe MAC.
- **Wrong tool for passwords:** plain hashes are deliberately fast; password storage needs a slow KDF such as bcrypt, scrypt, or Argon2id.
- **Timing leaks:** comparing digests or MACs with a non-constant-time check can leak information byte by byte.
- **Over-truncation:** shortening a digest below the needed security level weakens collision and preimage resistance.
- **Hash is not authentication:** a bare hash only protects integrity when its full input is trusted; authenticating data needs a keyed construction like HMAC.
```

**Claims tested** (demos/babel-hash/e2e/claims.spec.ts, 21 test(s)):

- `(assertions outside a test block)` — demos/babel-hash/e2e/claims.spec.ts:63
    - :63 `toBe` expected `right.length` _(expression)_
- `(assertions outside a test block)` — demos/babel-hash/e2e/claims.spec.ts:83
    - :83 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — demos/babel-hash/e2e/claims.spec.ts:88
    - :88 `toHaveAttribute` expected `'aria-hidden', 'false'` _(expression)_
- `(assertions outside a test block)` — demos/babel-hash/e2e/claims.spec.ts:110
    - :110 `expect` expected _no expected value_ _(none)_
- `avalanche counter, percentage and bit grids all agree with the digests on screen` — demos/babel-hash/e2e/claims.spec.ts:156
    - :162 `toMatch` expected `HEX64` _(expression)_
    - :163 `toMatch` expected `HEX64` _(expression)_
    - :164 `toBe` expected `256` _(literal)_
    - :168 `toBe` expected `hammingDistance(view.originalDigest, view.modifiedDigest)` _(expression)_
    - :171 `toBe` expected `((view.changedBits / view.totalBits) * 100).toFixed(1)` _(expression)_
    - :176 `toBe` expected `sha256Hex(utf8(input))` _(expression)_
    - :177 `toBe` expected `sha256Hex(flipBit(input, 0))` _(expression)_
    - :182 `toHaveCount` expected `2` _(literal)_
    - :185 `toHaveCount` expected `256` _(literal)_
    - :186 `toHaveCount` expected `view.changedBits` _(expression)_
    - :187 `toHaveCount` expected `popcount(digest)` _(expression)_
    - :188 `toHaveCount` expected `256 - popcount(digest)` _(expression)_
- `the flip-position labels describe the bit the page actually flipped` — demos/babel-hash/e2e/claims.spec.ts:192
    - :198 `toHaveAttribute` expected `'max', String(inputBits - 1)` _(expression)_
    - :199 `toBe` expected _no expected value_ _(none)_
    - :204 `toContainText` expected `'Flip bit 11'` _(literal)_
    - :208 `toBe` expected `'Flip: 11 (byte 1, bit 4)'` _(literal)_
    - :209 `toBe` expected `sha256Hex(flipBit(input, 11))` _(expression)_
    - :210 `toBe` expected `hammingDistance(view.originalDigest, view.modifiedDigest)` _(expression)_
- `all three hash functions land near 50% diffusion, each consistent with its own digests` — demos/babel-hash/e2e/claims.spec.ts:213
    - :216 `toHaveCount` expected `3` _(literal)_
    - :225 `toMatch` expected `HEX64` _(expression)_
    - :226 `toMatch` expected `HEX64` _(expression)_
    - :227 `toBe` expected `hammingDistance(view.originalDigest, view.modifiedDigest)` _(expression)_
    - :228 `toBe` expected `((view.changedBits / 256) * 100).toFixed(1)` _(expression)_
    - :231 `expect` expected _no expected value_ _(none)_
    - :232 `expect` expected _no expected value_ _(none)_
    - :237 `toEqual` expected `['SHA-256', 'SHA3-256', 'BLAKE3']` _(expression)_
    - :239 `toBe` expected `6` _(literal)_
    - :243 `toBe` expected `sha256Hex(utf8(input))` _(expression)_
- `the accepted forgery really verifies under the secret the attacker never saw` — demos/babel-hash/e2e/claims.spec.ts:250
    - :255 `toHaveText` expected _no expected value_ _(none)_
    - :258 `toHaveCount` expected `0` _(literal)_
    - :266 `toMatch` expected `HEX64` _(expression)_
    - :267 `toBe` expected `sha256Hex(utf8(DEFAULT_SECRET), utf8(DEFAULT_MESSAGE))` _(expression)_
    - :275 `toBe` expected `gluePaddingBytes` _(expression)_
    - :279 `toBe` expected _no expected value_ _(none)_
    - :286 `toBe` expected `0` _(literal)_
    - :290 `toMatch` expected `HEX64` _(expression)_
    - :291 `toBe` expected `sha256Hex(utf8(DEFAULT_SECRET), hexToBuffer(forgedPayload))` _(expression)_
    - :296 `expect` expected _no expected value_ _(none)_
    - :297 `expect` expected _no expected value_ _(none)_
    - :298 `expect` expected _no expected value_ _(none)_
    - :299 `toBe` expected `utf8(DEFAULT_SECRET).length` _(expression)_
- `the demo computes SHA-256 two independent ways and they agree` — demos/babel-hash/e2e/claims.spec.ts:302
    - :316 `toContainText` expected _no expected value_ _(none)_
    - :321 `toBe` expected `serverMac` _(expression)_
- `a wrong secret-length guess reaches the rejected verdict and says why` — demos/babel-hash/e2e/claims.spec.ts:324
    - :329 `toHaveText` expected _no expected value_ _(none)_
    - :332 `toHaveCount` expected `0` _(literal)_
    - :338 `toBe` expected `sha256Hex(utf8(DEFAULT_SECRET), hexToBuffer(forgedPayload))` _(expression)_
    - :345 `toBe` expected `0` _(literal)_
    - :349 `toHaveText` expected _no expected value_ _(none)_
- `the length sweep finds exactly one accepted guess and names it correctly` — demos/babel-hash/e2e/claims.spec.ts:354
    - :360 `toHaveCount` expected `32` _(literal)_
    - :361 `toHaveCount` expected `1` _(literal)_
    - :362 `toHaveAttribute` expected _no expected value_ _(none)_
    - :368 `expect` expected _no expected value_ _(none)_
    - :375 `toBeVisible` expected _no expected value_ _(none)_
    - :377 `toBeVisible` expected _no expected value_ _(none)_
- `the sweep measures the secret in UTF-8 bytes, not UTF-16 characters` — demos/babel-hash/e2e/claims.spec.ts:380
    - :387 `toBe` expected `9` _(literal)_
    - :388 `toBe` expected `10` _(literal)_
    - :393 `toHaveCount` expected `1` _(literal)_
    - :394 `toHaveAttribute` expected `'data-sweep-guess', '10'` _(expression)_
    - :395 `expect` expected _no expected value_ _(none)_
    - :398 `expect` expected _no expected value_ _(none)_
- `a secret outside the swept range fails the sweep and explains the miss` — demos/babel-hash/e2e/claims.spec.ts:403
    - :409 `toBe` expected `34` _(literal)_
    - :414 `toHaveCount` expected `32` _(literal)_
    - :415 `toHaveCount` expected `0` _(literal)_
    - :416 `expect` expected _no expected value_ _(none)_
    - :419 `toBeVisible` expected _no expected value_ _(none)_
- `an empty secret fails the sweep and says the secret is empty` — demos/babel-hash/e2e/claims.spec.ts:422
    - :429 `toHaveCount` expected `0` _(literal)_
    - :430 `expect` expected _no expected value_ _(none)_
- `HMAC rejects the same extension trick and shows a real HMAC tag` — demos/babel-hash/e2e/claims.spec.ts:439
    - :443 `toHaveText` expected _no expected value_ _(none)_
    - :446 `toHaveCount` expected `0` _(literal)_
    - :452 `toBe` expected `hmacHex(DEFAULT_SECRET, DEFAULT_MESSAGE)` _(expression)_
    - :456 `toMatch` expected `HEX64` _(expression)_
    - :457 `toBe` expected `tag` _(expression)_
    - :458 `toBe` expected `hmacHex(DEFAULT_SECRET, '${DEFAULT_MESSAGE}${DEFAULT_EXTENSION}')` _(expression)_
- `the HMAC tab tracks the secret typed on the length-extension tab` — demos/babel-hash/e2e/claims.spec.ts:461
    - :467 `toHaveText` expected _no expected value_ _(none)_
    - :470 `toBeVisible` expected _no expected value_ _(none)_
- `an empty secret leaves the HMAC tab explained, not stuck computing` — demos/babel-hash/e2e/claims.spec.ts:473
    - :485 `toBeVisible` expected _no expected value_ _(none)_
    - :486 `toContainText` expected `'Computing HMAC view'` _(literal)_
    - :487 `toContainText` expected `'empty'` _(literal)_
    - :488 `toEqual` expected `[]` _(expression)_
    - :494 `toHaveText` expected _no expected value_ _(none)_
- `a shared link carrying an empty secret still explains the HMAC tab` — demos/babel-hash/e2e/claims.spec.ts:499
    - :505 `toBeVisible` expected _no expected value_ _(none)_
    - :506 `toContainText` expected `'Computing HMAC view'` _(literal)_
    - :507 `toContainText` expected `'2. Length extension'` _(literal)_
- `the 1 MB benchmark reports throughput consistent with the time it measured` — demos/babel-hash/e2e/claims.spec.ts:514
    - :519 `toContainText` expected `'Benchmark complete', {` _(expression)_
    - :524 `toHaveCount` expected `3` _(literal)_
    - :533 `expect` expected _no expected value_ _(none)_
    - :537 `expect` expected _no expected value_ _(none)_
    - :540 `toMatch` expected `/^[0-9a-f]{16}…$/u` _(regex)_
    - :545 `toEqual` expected `['SHA-256', 'SHA3-256', 'BLAKE3']` _(expression)_
    - :551 `toEqual` expected `bySpeed.map((row) => row.label)` _(expression)_
    - :556 `toBe` expected `3` _(literal)_
- `the avalanche distribution is internally consistent and agrees with a single flip` — demos/babel-hash/e2e/claims.spec.ts:563
    - :571 `toContainText` expected `'of ${trials - 1}'` _(expression)_
    - :575 `toBe` expected _no expected value_ _(none)_
    - :583 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :585 `toBe` expected _no expected value_ _(none)_
    - :596 `toBe` expected `trials` _(expression)_
    - :601 `expect` expected _no expected value_ _(none)_
    - :608 `toBe` expected `0` _(literal)_
    - :609 `toBe` expected `256` _(literal)_
    - :611 `toBe` expected `ranges[index - 1].hi + 1` _(expression)_
    - :612 `toBe` expected `256` _(literal)_
    - :618 `toHaveAttribute` expected `'style', /--bar-height: 100\.0%/u` _(expression)_
    - :629 `expect` expected _no expected value_ _(none)_
    - :630 `toBe` expected `128` _(literal)_
    - :631 `expect` expected _no expected value_ _(none)_
    - :632 `expect` expected _no expected value_ _(none)_
    - :635 `expect` expected _no expected value_ _(none)_
    - :636 `expect` expected _no expected value_ _(none)_
    - :641 `expect` expected _no expected value_ _(none)_
    - :642 `expect` expected _no expected value_ _(none)_
    - :646 `expect` expected _no expected value_ _(none)_
    - :647 `expect` expected _no expected value_ _(none)_
    - :653 `toBe` expected _no expected value_ _(none)_
- `an empty input refuses the distribution run and says there is nothing to flip` — demos/babel-hash/e2e/claims.spec.ts:658
    - :664 `toContainText` expected `'Flip bit 0 of 0'` _(literal)_
    - :667 `expect` expected _no expected value_ _(none)_
    - :669 `toHaveCount` expected `0` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-babel-hash

## What It Is

`crypto-lab-babel-hash` is the hash-functions entry in the `crypto-compare` portfolio. The browser demo lives in `demos/babel-hash/`.

## When to Use It

- Understanding three modern 256-bit hash functions side by side: SHA-256 (Merkle–Damgård), SHA3-256 (sponge/Keccak), and BLAKE3 (tree).
- Seeing the avalanche effect — how flipping one input bit changes roughly 50% of the output bits.
- Teaching the SHA-256 length-extension weakness and why HMAC-SHA256 fixes it.
- Do NOT use this as a production hashing library — it is a teaching demo, not a hardened implementation.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-babel-hash](https://systemslibrarian.github.io/crypto-lab-babel-hash/)**

The demo computes SHA-256, SHA3-256, and BLAKE3 over your input and visualizes the avalanche effect, then walks through a length-extension attack against SHA-256 and shows HMAC-SHA256 as the defense.

## What Can Go Wrong

- **Length-extension:** raw SHA-256 (Merkle–Damgård) lets an attacker extend a digest without knowing the secret, so `hash(secret || message)` is not a safe MAC.
- **Wrong tool for passwords:** plain hashes are deliberately fast; password storage needs a slow KDF such as bcrypt, scrypt, or Argon2id.
- **Timing leaks:** comparing digests or MACs with a non-constant-time check can leak information byte by byte.
- **Over-truncation:** shortening a digest below the needed security level weakens collision and preimage resistance.
- **Hash is not authentication:** a bare hash only protects integrity when its full input is trusted; authenticating data needs a keyed construction like HMAC.

## Real-World Usage

- SHA-256 underpins TLS certificate signatures and Bitcoin proof-of-work and addresses. Git is the near-miss: its object identifiers are still SHA-1 by default (hardened against SHAttered since Git 2.13), with SHA-256 available only as an opt-in, still-experimental repository format (`extensions.objectFormat = sha256`).
- HMAC-SHA256 authenticates API requests, signed cookies/JWTs, and TLS records.
- SHA3-256 is the NIST-standardized Keccak variant (FIPS 202, August 2015).
- Ethereum's `keccak256` is *not* SHA3-256: it is the original, pre-standardization Keccak-256, which pads with the `0x01` suffix instead of FIPS 202's `0x06` domain separator. Same permutation, different digests for the same input.
- BLAKE3 is used where high-throughput hashing matters, such as content-addressed storage and file-integrity tooling.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-babel-hash
cd crypto-lab-babel-hash/demos/babel-hash
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-hash-zoo](https://systemslibrarian.github.io/crypto-lab-hash-zoo/) — hash constructions: Merkle–Damgård vs sponge vs tree.
- [crypto-lab-merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) — SHA-256 Merkle trees and inclusion proofs.
- [crypto-lab-collision-vault](https://systemslibrarian.github.io/crypto-lab-collision-vault/) — MD5/SHA-1 collisions and why they broke.
- [crypto-lab-bcrypt-forge](https://systemslibrarian.github.io/crypto-lab-bcrypt-forge/) — password hashing with bcrypt.
- [crypto-lab-kdf-arena](https://systemslibrarian.github.io/crypto-lab-kdf-arena/) — HKDF, PBKDF2, scrypt, and Argon2id compared.

## Hash Functions catalog entry

| Field | Value |
|---|---|
| Algorithms | SHA-256 (FIPS 180-4), SHA3-256 (FIPS 202), BLAKE3 |
| Output size | 256 bits (32 bytes) for all three |
| Constructions | Merkle–Damgård (SHA-256), Sponge / Keccak (SHA3), Tree (BLAKE3) |
| Attack shown | Length extension attack against SHA-256 |
| Defense shown | HMAC-SHA256 |
| Key property | Avalanche effect — ~50% output bits change per input bit flip |

## Why this demo matters

Hash functions are the silent foundation under the rest of the portfolio:

- [`crypto-lab-sphincs-ledger`](https://github.com/systemslibrarian/crypto-lab-sphincs-ledger) — SPHINCS / SLH-DSA reduces to hash security assumptions.
- [`crypto-lab-ratchet-wire`](https://github.com/systemslibrarian/crypto-lab-ratchet-wire) — HKDF-SHA256 drives every Double Ratchet step.
- [`crypto-lab-iron-serpent`](https://github.com/systemslibrarian/crypto-lab-iron-serpent) — HMAC-SHA256 authenticates each ciphertext, which is why this demo shows HMAC instead of bare SHA-256.
- [`crypto-lab-dead-sea-cipher`](https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher) — authenticated encryption depends on strong integrity primitives in the same historical arc.

## Repository Layout

The browser demo source lives in `demos/babel-hash/`. To run it directly:

`​``bash
cd demos/babel-hash
npm install
npm run dev
`​``

See [`demos/babel-hash/README.md`](./demos/babel-hash/README.md) for the full walkthrough, references, and implementation notes.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Publishing a reviewed revision

The existing `.github/workflows/pages.yml` publishes GitHub Pages after lint,
type checking, unit tests, build and the full browser/claims/accessibility suite.
From an authenticated GitHub CLI, `npm run deploy` in `demos/babel-hash` requests
that workflow on the pushed, reviewed `main` branch. It does not upload local
files. A successful request means the run was queued; inspect its gates, Pages
deployment and live site before calling the revision published. The redundant
`gh-pages` publisher and its vulnerable `braces` dependency chain were removed.

Use Node 24 (at least 24.15) for the current jsdom runtime. CI installs the locked
dependency graph with `npm ci`. The locked native TypeScript 7 compiler runs
`tsc` for the build and CI type check. ESLint imports the TypeScript 6 JavaScript API through Microsoft's
[official side-by-side aliases](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-60):
`@typescript/native` is native 7.0.2, and `typescript` is the compatibility
wrapper 6.0.2 exposing the locked 6.0.3 API. `tsc6` is available for API-based
tools; it is not the build compiler. The Node ambient types required by the
included publish-request tests are explicit because TypeScript 7 no longer
includes all installed ambient packages by default. `npm run test:tooling`
checks both compiler identities, all 23 previously resolved lint scopes, and
real compiler/lint rejection controls without relaxing existing checks.

## Reduced-round research context

The live demo links [2026/232](https://eprint.iacr.org/2026/232) and [2026/1120](https://eprint.iacr.org/2026/1120), distinguishes reported reduced-round results from standard full-round SHA-2, and identifies the September result as a preprint. This lab does not verify the pair itself; the linked Collision Vault exhibit now provides that execution under explicit conventions.

The supplied 36-step SHA-256 Table 2 pair is now verified in [Collision Vault](https://systemslibrarian.github.io/crypto-lab-collision-vault/#sha2-pair-verifier), with exact IV/step/padding conventions, mutation controls and full SHA-256 contrast. This lab still computes its own full-round hashes and does not execute the paper attack.

```

</details>

---

## MAC Race

- **slug**: `crypto-lab-mac-race`
- **repo**: https://github.com/systemslibrarian/crypto-lab-mac-race
- **live**: https://systemslibrarian.github.io/crypto-lab-mac-race/
- **commit_sha**: `94deb501bf82bf76295db25a7b14b0d6410a655e` (the commit these bytes were read from)
- **read_from**: git archive HEAD (1 dirty path(s))
- **category**: HASHING & KDFS  ·  **level**: intermediate  ·  **--accent**: #19c37d
- **MISSING FIELDS**: verification

**Name (H1)**: MAC Race  — _read from src/ui.ts_

**Subtitle**: CRC-32 · HMAC · AES-CMAC · PMAC · Poly1305 · GHASH  — _read from src/ui.ts_

**Description**: Start with a checksum that catches noise but accepts a repaired forgery. Then build keyed tags and trigger the misuse modes — length extension, one-time-key reuse, nonce reuse, and timing leakage — that change their verdicts.  — _read from src/ui.ts_

**Why it matters**: A valid checksum only says the bytes match their public check value. A MAC asks whether the sender knew a secret. Length extension, nonce reuse, and timing leakage show how misuse can still break that promise.  — _read from src/ui.ts_

**Card copy**: Compare real HMAC, CMAC, exact Black–Rogaway PMAC, Poly1305, and GHASH computations with bounded length-extension, raw CBC-MAC forgery, timing-oracle, and one-time-key-reuse lessons.

**Chips**: HMAC · CMAC · PMAC · Poly1305

**Implements**: AES `src/cmac.ts:39`, AES-CBC `src/cmac.ts:74`, CMAC `src/cmac.ts:114`, CRC-32 `src/crc/crc32.ts:14`, GHASH `src/ghash.ts:97`, HMAC `src/crc/hmac-receiver.ts:2`, PMAC `src/pmac/pmac.ts:178`, Poly1305 `src/poly1305.ts:110`, SHA-256 `src/lengthext.ts:39`

**Attacks shown**: Brute force `src/poly1305.ts:142`, Length extension `src/lengthext.ts:111`, Timing side-channel `src/timing.ts:127`

**Comment-only (named in code comments, not executed)**: AES-GCM `src/ghash.ts:140`

**References**: AES-GCM, BLAKE3, ChaCha20, ChaCha20-Poly1305, MD5, SHA-1, SHA-3, SHA-512, Simon, TLS 1.3

**Standards body**: IEEE, IETF, NIST

**Implementation**: WebCrypto AES / local TypeScript CMAC, PMAC, Poly1305, GHASH, SHA-256, CRC and teaching attack implementations

**Spec citations, exactly as written**:

- `EUROCRYPT 2002` — first seen README.md:95 (1×)
- `FIPS 198-1` — first seen README.md:9 (2×)
- `NIST SP 800-38A` — first seen README.md:123 (1×)
- `NIST SP 800-38B` — first seen README.md:19 (4×)
- `NIST SP 800-38D` — first seen README.md:46 (4×)
- `RFC 4231` — first seen README.md:85 (1×)
- `RFC 4493` — first seen README.md:124 (3×)
- `RFC 8439` — first seen README.md:45 (8×)
- `rfc4493` — first seen src/cbcmac/panel.ts:26 (1×)
- `rfc8439` — first seen README.md:45 (2×)
- `SP 800-38A` — first seen README.md:128 (1×)
- `SP 800-38B` — first seen README.md:126 (1×)

**README — What Can Go Wrong**:

```text
- Raw CBC-MAC accepts a spliced longer message when lengths are unrestricted. An agreed-length receiver must share that restriction with its sender. The length-prepended and CMAC controls also test the recipe against their own oracles; they use separate keys, because exposing raw CBC-MAC under a CMAC key creates a different cross-protocol attack.
- Prefix-MAC length extension with bare SHA-256(secret || message): an attacker can forge a valid MAC for extended data without knowing the secret, which is demonstrated in the length-extension panel.
- Poly1305 one-time key reuse breaks message authenticity. The in-app demo narrows `r` to 16 bits for simple classroom brute force, not because full-size single-block reuse is intractable. For known single-block messages, reduction modulo 2^130−5 removes the large pre-reduction quotient, leaving a small number of tag-truncation carry candidates; an additional observation may be needed to distinguish them. Two tags do not universally identify one key, and arbitrary multi-block cases have different polynomial equations. The displayed forgery is checked by the real authenticator with the deliberately narrowed key. See [RFC 8439 §2.5](https://www.rfc-editor.org/rfc/rfc8439.html#section-2.5).
- Real GCM uses padded AAD/ciphertext, the mandatory length block and the nonce-derived mask `E_K(J0)` (NIST SP 800-38D algorithms 4/5). `H=E_K(0^128)` stays the same for a fixed key even across distinct nonces. With equal-length one-block ciphertexts, no AAD and full tags under one key/nonce, tag differences involve `H²`, not the toy's `H`. Local toy acceptance does not demonstrate a real GCM forgery.
- GHASH nonce reuse in GCM contexts: because GHASH is linear over GF(2^128), nonce reuse can expose relationships that permit forgery and broader AEAD failure.
- Non-constant-time MAC comparison: byte-by-byte early-exit checks leak timing information that helps attackers recover or validate tag bytes incrementally.
- CMAC implementation mistakes (subkey/padding/final-block handling): incorrect K1/K2 derivation or final block processing can produce incompatible or insecure tags.
- PMAC implementation mistakes can break interoperability or authenticity if the Gray-code offset recurrence, block position, 10* padding, or complete-final-block `L·x^-1` adjustment changes. This lab pins the 2002 construction rather than silently mixing in later PMAC refinements.
- A PMAC dependency span is not a runtime speedup claim. The model counts AES scheduling waves under a selected lane limit and excludes XOR, offset preparation, API overhead, hardware scheduling, and cached per-key setup.
- PMAC's post-quantum status depends on the oracle model. This lesson permits ordinary classical MAC queries. Kaplan, Leurent, Leverrier and Naya-Plasencia give a Simon-style forgery with quantum-superposition (Q2) oracle access, so the 2002 construction is not Q2-secure; this lab does not implement that stronger oracle. See [*Breaking Symmetric Cryptosystems Using Quantum Period Finding*](https://arxiv.org/abs/1602.05973).
```

**Claims tested** (e2e/claims.spec.ts, 29 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:26
    - :26 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:37
    - :37 `toBe` expected `digest` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:43
    - :43 `toHaveText` expected `'HMAC'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:58
    - :58 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:68
    - :68 `toHaveLength` expected `y.length` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:94
    - :94 `toBe` expected `bitwiseCrc(after)` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:95
    - :95 `toBe` expected `actual === sent` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:101
    - :101 `toHaveText` expected `expected` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:102
    - :102 `toHaveClass` expected _no expected value_ _(none)_
- `HMAC: the tag is the last step of its own derivation, and the server accepts only that tag` — e2e/claims.spec.ts:111
    - :117 `toContainText` expected `'HMAC-SHA-256 tag'` _(literal)_
    - :127 `toBe` expected `outer` _(expression)_
    - :128 `toBe` expected `inner` _(expression)_
    - :129 `toBe` expected `tag256` _(expression)_
    - :132 `toHaveValue` expected `tag256` _(expression)_
- `HMAC avalanche: each bit-diff grid counts the cells it drew, and ~half the tag bits flip` — e2e/claims.spec.ts:150
    - :155 `toContainText` expected `'HMAC-SHA-256 tag'` _(literal)_
    - :165 `toBe` expected `total` _(expression)_
    - :166 `toBe` expected `flipped` _(expression)_
    - :167 `toBe` expected `256` _(literal)_
    - :168 `toBeCloseTo` expected `(flipped / total) * 100, 1` _(expression)_
    - :172 `expect` expected _no expected value_ _(none)_
    - :173 `expect` expected _no expected value_ _(none)_
- `CMAC: the 10* padding and K1/K2 steps feed the tag the server accepts` — e2e/claims.spec.ts:181
    - :185 `toContainText` expected `'Final encrypt'` _(literal)_
    - :194 `toBe` expected `k2` _(expression)_
    - :199 `toBe` expected `'${messageHex}80'` _(expression)_
    - :200 `toBe` expected `xorHex(padded, k2)` _(expression)_
    - :202 `toHaveValue` expected `tag` _(expression)_
- `Poly1305: reusing the one-time key recovers r and the server accepts the forged tag` — e2e/claims.spec.ts:216
    - :223 `toHaveText` expected `'run the attack first'` _(literal)_
    - :224 `toHaveClass` expected `/verdict-idle/` _(regex)_
    - :229 `toHaveLength` expected `32` _(literal)_
    - :232 `toContainText` expected `'Solved r'` _(literal)_
    - :243 `toBe` expected `bits` _(expression)_
    - :244 `toBe` expected `16` _(literal)_
    - :245 `expect` expected _no expected value_ _(none)_
    - :249 `toBe` expected `tag2` _(expression)_
    - :250 `toBe` expected `tag1` _(expression)_
    - :251 `toBe` expected `tag2` _(expression)_
    - :254 `expect` expected _no expected value_ _(none)_
- `Raw GHASH toy: printed deltas match the XORs and the local product comparison verifies` — e2e/claims.spec.ts:263
    - :269 `toHaveText` expected `'run the attack first'` _(literal)_
    - :273 `toContainText` expected `'GHASH output'` _(literal)_
    - :277 `toBe` expected `y` _(expression)_
    - :281 `toContainText` expected `'Recovered H'` _(literal)_
    - :291 `toBe` expected `xorHex(c1[1], c2[1])` _(expression)_
    - :292 `toBe` expected `xorHex(c1[2], c2[2])` _(expression)_
    - :295 `expect` expected _no expected value_ _(none)_
    - :296 `expect` expected _no expected value_ _(none)_
    - :297 `toHaveLength` expected `32` _(literal)_
    - :302 `toHaveCount` expected `6` _(literal)_
    - :305 `toHaveCount` expected `128` _(literal)_
    - :306 `expect` expected _no expected value_ _(none)_
    - :323 `toHaveText` expected `String(guess)` _(expression)_
    - :325 `toContainText` expected `'Guessed secret length: ${guess}'` _(expression)_
    - :327 `toHaveText` expected `'forged — submit it'` _(literal)_
    - :330 `toHaveText` expected `'forged — submit it'` _(literal)_
- `length extension: exactly one secret-length guess forges a tag the broken server accepts, and HMAC rejects them all` — e2e/claims.spec.ts:335
    - :342 `toHaveText` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :345 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :348 `toBe` expected `hmacTag` _(expression)_
    - :354 `expect` expected _no expected value_ _(none)_
    - :360 `toBe` expected `'REJECTED'` _(literal)_
    - :362 `expect` expected _no expected value_ _(none)_
    - :365 `expect` expected _no expected value_ _(none)_
    - :367 `toBe` expected `'REJECTED'` _(literal)_
    - :368 `expect` expected _no expected value_ _(none)_
    - :369 `expect` expected _no expected value_ _(none)_
    - :375 `toHaveLength` expected `1` _(literal)_
    - :382 `toBe` expected `rawTag` _(expression)_
    - :385 `toBeVisible` expected _no expected value_ _(none)_
    - :386 `toHaveText` expected `'comment=10&uid=7'` _(literal)_
    - :387 `toHaveText` expected `'&admin=true'` _(literal)_
    - :388 `toContainText` expected `'guessed secret = ${high}B'` _(expression)_
- `length extension regression: a new forgery drops the previous servers verdicts` — e2e/claims.spec.ts:391
    - :396 `toHaveText` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :400 `expect` expected _no expected value_ _(none)_
    - :407 `toContainText` expected `'Guessed secret length: 9'` _(literal)_
    - :409 `expect` expected _no expected value_ _(none)_
    - :410 `expect` expected _no expected value_ _(none)_
    - :413 `toHaveText` expected `'REJECTED'` _(literal)_
    - :417 `expect` expected _no expected value_ _(none)_
    - :420 `expect` expected _no expected value_ _(none)_
- `timing table: the summary reports the spread of the rows printed above it` — e2e/claims.spec.ts:427
    - :431 `toHaveCount` expected `3` _(literal)_
    - :438 `toHaveLength` expected `3` _(literal)_
    - :439 `toMatch` expected `/Mismatch at/` _(regex)_
    - :450 `expect` expected _no expected value_ _(none)_
    - :451 `expect` expected _no expected value_ _(none)_
    - :455 `expect` expected _no expected value_ _(none)_
    - :460 `expect` expected _no expected value_ _(none)_
- `timing attack: byte-by-byte recovery matches the true tag using 256 oracle queries per byte` — e2e/claims.spec.ts:463
    - :471 `toContainText` expected `'True tag', { timeout: 60_000 }` _(expression)_
    - :481 `toHaveLength` expected `32` _(literal)_
    - :482 `toBe` expected `trueTag.slice(0, wanted * 2)` _(expression)_
    - :483 `toBe` expected `'.'.repeat(32 - wanted * 2)` _(expression)_
    - :486 `toBe` expected `wanted` _(expression)_
    - :487 `toBe` expected `'✅ YES'` _(literal)_
    - :490 `toBe` expected `256 * wanted` _(expression)_
    - :492 `toHaveText` expected _no expected value_ _(none)_
    - :495 `toHaveAttribute` expected `'style', /width:\s*100%/` _(expression)_
- `CRC catches noise, then the same receiver accepts a repaired forgery and any forced target` — e2e/claims.spec.ts:502
    - :504 `toHaveText` expected `bitwiseCrc([...new TextEncoder().encode('PAY $0010 TO ALICE')]).toString(16).padStart(8, '0')` _(expression)_
    - :509 `toBe` expected `flips` _(expression)_
    - :510 `toBe` expected `flips` _(expression)_
    - :514 `toBe` expected `sent` _(expression)_
    - :515 `toHaveText` expected `'✗ CORRUPTION CAUGHT'` _(literal)_
    - :516 `toBeVisible` expected _no expected value_ _(none)_
    - :520 `toBeDisabled` expected _no expected value_ _(none)_
    - :521 `toBeVisible` expected _no expected value_ _(none)_
    - :524 `toBe` expected `burst.sent` _(expression)_
    - :526 `expect` expected _no expected value_ _(none)_
    - :527 `expect` expected _no expected value_ _(none)_
    - :529 `toBe` expected `burstFlips` _(expression)_
    - :533 `toBe` expected `bitwiseCrc(naive.before)` _(expression)_
    - :534 `toBe` expected `naive.sent` _(expression)_
    - :535 `toHaveText` expected `'✗ REJECTED'` _(literal)_
    - :536 `toBeVisible` expected _no expected value_ _(none)_
    - :540 `toEqual` expected `naive.after` _(expression)_
    - :541 `toBe` expected `repaired.sent` _(expression)_
    - :542 `toHaveClass` expected `/verdict-alarm/` _(regex)_
    - :546 `toBe` expected `repaired.actual` _(expression)_
    - :547 `toBe` expected `repaired.actual` _(expression)_
    - :548 `toBe` expected `repaired.actual` _(expression)_
    - :551 `toHaveText` expected `'⚠ CRC VALID — AND FORGED'` _(literal)_
    - :554 `toBe` expected `forced.before.length + 4` _(expression)_
    - :555 `toEqual` expected `forced.before` _(expression)_
    - :556 `toBe` expected `0xa1b2c3d4` _(expression)_
    - :557 `toBe` expected `0xa1b2c3d4` _(expression)_
    - :558 `toHaveClass` expected `/verdict-alarm/` _(regex)_
    - :561 `toContainText` expected `'CRC-32 detects accidental corruption; it does not detect deliberate changes, because anyone can recompute it.'` _(literal)_
- `HMAC rejects the same forged bytes until the key-leak toggle is explicitly enabled` — e2e/claims.spec.ts:564
    - :566 `toBeChecked` expected _no expected value_ _(none)_
    - :567 `toBeDisabled` expected _no expected value_ _(none)_
    - :572 `toEqual` expected `crc.after` _(expression)_
    - :573 `toHaveText` expected `'✗ REJECTED'` _(literal)_
    - :574 `toHaveClass` expected `/verdict-reject/` _(regex)_
    - :575 `toContainText` expected `'Genuine original control: ACCEPTED'` _(literal)_
    - :576 `toBeVisible` expected _no expected value_ _(none)_
    - :578 `toBeEnabled` expected _no expected value_ _(none)_
    - :579 `toHaveText` expected `'⚠ CRC VALID — AND FORGED'` _(literal)_
    - :581 `toHaveText` expected `'✗ REJECTED'` _(literal)_
    - :583 `toBeDisabled` expected _no expected value_ _(none)_
    - :584 `toBeDisabled` expected _no expected value_ _(none)_
    - :585 `toHaveText` expected `'⚠ CRC VALID — AND FORGED'` _(literal)_
    - :586 `toContainText` expected `'With the leaked key'` _(literal)_
    - :588 `toHaveText` expected `'⚠ TAG VALID — AND FORGED'` _(literal)_
    - :589 `toHaveClass` expected `/verdict-alarm/` _(regex)_
    - :590 `toContainText` expected `'HMAC is only as strong as the secrecy of its key.'` _(literal)_
    - :592 `toBeChecked` expected _no expected value_ _(none)_
- `an in-flight HMAC result cannot restore a verdict after an edit or key rotation` — e2e/claims.spec.ts:595
    - :611 `toHaveText` expected `'inputs changed — run again'` _(literal)_
    - :612 `expect` expected _no expected value_ _(none)_
    - :617 `toHaveText` expected `'inputs changed — run again'` _(literal)_
    - :618 `expect` expected _no expected value_ _(none)_
- `checksum edits retire verdicts; identical input, invalid targets and length changes are handled` — e2e/claims.spec.ts:621
    - :625 `toHaveClass` expected `/verdict-alarm/` _(regex)_
    - :627 `toHaveClass` expected `/verdict-alarm/` _(regex)_
    - :629 `toHaveClass` expected `/verdict-alarm/` _(regex)_
    - :631 `toHaveText` expected `'inputs changed — run again'` _(literal)_
    - :632 `toHaveText` expected `'inputs changed — run again'` _(literal)_
    - :635 `toHaveText` expected `'inputs changed — run again'` _(literal)_
    - :638 `toHaveText` expected `'inputs changed — run again'` _(literal)_
    - :641 `toContainText` expected `'equal byte lengths'` _(literal)_
    - :642 `toHaveText` expected `'inputs changed — run again'` _(literal)_
    - :645 `toHaveText` expected `'Target CRC must be exactly 8 hex digits.'` _(literal)_
    - :647 `toHaveText` expected `'00000000'` _(literal)_
    - :649 `toContainText` expected `'Add message bytes'` _(literal)_
- `guided tour highlights the nine panels in pedagogical order` — e2e/claims.spec.ts:656
    - :664 `toHaveCount` expected `1` _(literal)_
    - :665 `toHaveAttribute` expected `'id', order[step]!` _(expression)_
    - :666 `toHaveText` expected `'Lesson ${step + 1} of ${order.length}'` _(expression)_
    - :667 `toHaveText` expected `new RegExp('^${step + 1}\\.')` _(expression)_
    - :673 `toHaveCount` expected `0` _(literal)_
    - :674 `toHaveText` expected `'Tour complete — explore freely'` _(literal)_
    - :675 `toBeHidden` expected _no expected value_ _(none)_
- `nothing marked hidden is painted` — e2e/claims.spec.ts:689
    - :693 `expect` expected _no expected value_ _(none)_
    - :707 `toEqual` expected `[]` _(expression)_
    - :713 `toBeEnabled` expected _no expected value_ _(none)_
- `CBC-MAC one-query splice is derived from public bytes and accepted with alarm semantics` — e2e/claims.spec.ts:715
    - :717 `toHaveValue` expected `'16'` _(literal)_
    - :718 `toBeEnabled` expected _no expected value_ _(none)_
    - :719 `toHaveText` expected `'✓ honest tag verified'` _(literal)_
    - :721 `toHaveText` expected `'1'` _(literal)_
    - :722 `toBeVisible` expected _no expected value_ _(none)_
    - :724 `toHaveText` expected `expected` _(expression)_
    - :725 `toHaveText` expected `tag` _(expression)_
    - :726 `toHaveText` expected `tag` _(expression)_
    - :727 `toHaveText` expected `'✕ ACCEPTED — FORGED'` _(literal)_
    - :728 `toHaveClass` expected `/verdict-alarm/` _(regex)_
    - :729 `toHaveText` expected `'Block alignment: PASS; tag equality: PASS.'` _(literal)_
    - :730 `toHaveText` expected `'TAG VALID — AND FORGED'` _(literal)_
    - :731 `toHaveText` expected `cbcNegative` _(expression)_
    - :732 `toBeVisible` expected _no expected value_ _(none)_
    - :734 `toHaveCount` expected `2` _(literal)_
    - :735 `toHaveText` expected `m` _(expression)_
    - :736 `toHaveText` expected `tag` _(expression)_
    - :737 `toHaveText` expected `m` _(expression)_
    - :738 `toHaveText` expected `tag` _(expression)_
    - :739 `toHaveText` expected `tag` _(expression)_
- `CBC-MAC fixes reject with the actual length or tag cause, including own-oracle recipes` — e2e/claims.spec.ts:742
    - :744 `toHaveText` expected `'✓ rejected — wrong length'` _(literal)_
    - :745 `toHaveClass` expected `/verdict-accept/` _(regex)_
    - :746 `toHaveText` expected `'00000000000000000000000000000020'` _(literal)_
    - :749 `toHaveText` expected `'✓ rejected — tag mismatch'` _(literal)_
    - :751 `toHaveText` expected `m + xorHex(m, ownTag)` _(expression)_
    - :752 `toHaveText` expected `ownTag` _(expression)_
    - :753 `toHaveText` expected `'✓ rejected — tag mismatch'` _(literal)_
    - :754 `toHaveClass` expected `/verdict-accept/` _(regex)_
    - :755 `toContainText` expected `'Honest tag verification: PASS'` _(literal)_
    - :758 `toHaveText` expected `'✕ ACCEPTED — FORGED'` _(literal)_
    - :759 `toHaveClass` expected `/verdict-alarm/` _(regex)_
    - :760 `toContainText` expected `'Agreement must constrain both ends'` _(literal)_
- `CBC-MAC general two-tag splice supports one and multiple blocks and real converging chains` — e2e/claims.spec.ts:763
    - :769 `toHaveText` expected `'2'` _(literal)_
    - :770 `toHaveText` expected `a + xorHex(b.slice(0, 32), tag) + b.slice(32)` _(expression)_
    - :771 `toHaveText` expected `target` _(expression)_
    - :772 `toHaveText` expected `'✕ ACCEPTED — FORGED'` _(literal)_
    - :775 `toHaveText` expected `a + xorHex(b.slice(0, 32), ownTag) + b.slice(32)` _(expression)_
    - :776 `toHaveText` expected `'✓ rejected — tag mismatch'` _(literal)_
    - :779 `toHaveCount` expected `(m!.length + other!.length) / 16` _(expression)_
    - :781 `toBe` expected `await rows.nth(i).locator('[data-cbc="honest-value"]').innerText()` _(expression)_
    - :783 `toHaveText` expected `target` _(expression)_
- `CBC-MAC validation, no-op preservation and edits or rotation retire all claims` — e2e/claims.spec.ts:787
    - :790 `toBeVisible` expected _no expected value_ _(none)_
    - :791 `toBeHidden` expected _no expected value_ _(none)_
    - :792 `toBeDisabled` expected _no expected value_ _(none)_
    - :793 `toHaveText` expected `'inputs changed — run again'` _(literal)_
    - :794 `toBe` expected `firstTag` _(expression)_
    - :796 `toContainText` expected `'NOT_BLOCK_ALIGNED: Received 5 bytes; next valid length is 16'` _(literal)_
    - :797 `toBeHidden` expected _no expected value_ _(none)_
    - :799 `toContainText` expected `'EMPTY_MESSAGE'` _(literal)_
    - :801 `toHaveText` expected `/^c3a9/` _(regex)_
    - :802 `toBeHidden` expected _no expected value_ _(none)_
    - :804 `toBeHidden` expected _no expected value_ _(none)_
- `CBC-MAC late AES completions cannot restore retired verdicts` — e2e/claims.spec.ts:807
    - :824 `toContainText` expected `'retired'` _(literal)_
    - :825 `toHaveCount` expected `0` _(literal)_
    - :826 `toBeDisabled` expected _no expected value_ _(none)_
    - :827 `toBeVisible` expected _no expected value_ _(none)_

**Mutation records** (4 file(s)):

- `cbcmac-mutation-evidence.json` (9164 bytes)
- `scripts/check-cbcmac-mutations.mjs` (4760 bytes)
- `scripts/check-crc-mutations.mjs` (3893 bytes)
- `scripts/check-pmac-mutations.mjs` (8391 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-mac-race

Primitives: CRC-32/ISO-HDLC · HMAC-SHA-256 · HMAC-SHA-512 · Raw CBC-MAC · AES-CMAC · PMAC (Black–Rogaway 2002) · Poly1305 · GHASH

## What It Is

crypto-lab-mac-race is a browser demo for CRC-32, HMAC-SHA-256, HMAC-SHA-512, raw CBC-MAC, AES-CMAC, the 2002 Black–Rogaway PMAC, and Poly1305, plus GHASH and attack panels that show where incorrect authentication constructions fail. CRC-32 is an unkeyed checksum for accidental corruption; the MACs use shared secret material to verify message integrity and origin authenticity. None of these mechanisms encrypt plaintext. The project shows how each construction behaves under correct and incorrect usage, including checksum repair, block-position and final-rule changes, nonce/key reuse, length extension on a vulnerable prefix-MAC pattern, and timing leakage from naive comparison.

A newcomer starts at a "What is a MAC?" intro card — a one-sentence framing plus a small animation of a message and secret key flowing into a fixed-size tag, and an attacker who alters the message getting rejected — so the mental model is grounded before any primitive appears. A guided tour then walks the panels in pedagogical order. Field-math mechanisms are shown as pictures, not just hex: the GHASH panel animates `T1 ⊕ T2 = (C1 ⊕ C2)·H` as stacked 128-bit bit-rows showing the shared `·H` factor remains after XOR; this raw-field toy omits GCM framing and its nonce mask, and the length-extension panel draws the forged message as labelled `[secret][message][glue padding][append]` segments with the secret greyed as unknown. First-use jargon (ipad/opad, Merkle-Damgard, clamped r, GF(2^128), FIPS 198-1) carries inline hover/focus definitions.

## Exhibits

The intro card defines a MAC and shows a message and key flowing into a tag. The guided tour covers nine lessons:

1. **Checksum vs MAC** — CRC-32 catches flipped bits and a naive tamper, then accepts a repaired checksum or four-byte forced target. HMAC-SHA-256 rejects the same changed message until the optional key-leak toggle is enabled.
2. **HMAC** (the safe default) — step-through of the ipad/opad nested construction, an avalanche bit-diff grid with a "why ~50% flip matters" security note, and a server verifier.
3. **Length-extension attack** — capture a `SHA-256(secret ∥ msg)` tag, forge an extended tag without the secret, and see a labelled diagram of the forged message layout; a side-by-side HMAC server rejects the same attack.
4. **Raw CBC-MAC — fixed length only** — get one or two real tags, construct a longer message without the key, then compare the vulnerable receiver with agreed-length, length-prepended and CMAC checks. The trace shows the exact chain cancellation that motivates CMAC.
5. **CMAC** — NIST SP 800-38B subkey (K1/K2) derivation and final-block handling, step-by-step.
6. **PMAC** — execute the exact byte-aligned, full-tag Black–Rogaway 2002 construction with AES-256, inspect its Gray-code offsets and independent AES inputs, mutate content/position/final-block treatment, and compare its AES dependency graph with CMAC. The scheduling view models AES calls; it is not a speed benchmark.
7. **Poly1305** (one-time only) — reuse the one-time key across two messages to recover `r` and forge a tag, with a disclosed teaching simplification of the search size (the algebra is real and runs live).
8. **GHASH** — ordinary computation includes the ciphertext length block with no AAD, but returns an unmasked hash, not a GCM tag. A separate raw single-block `T=C·H` toy visualizes fixed-H linearity. It has no nonce, length block or authentication mask and its verifier is not a real GCM endpoint.
9. **MAC comparison + timing attack** — a primitive comparison table and a byte-by-byte tag recovery driven by a non-constant-time compare, with an on-screen banner disclosing that the oracle reports match-length directly as an honest stand-in for averaged timing.

## When to Use It

- Use HMAC-SHA-256 or HMAC-SHA-512 for API request signing and token integrity because HMAC is designed to resist Merkle-Damgard length extension that breaks bare prefix-hash MACs.
- Use AES-CMAC in NIST/FIPS-oriented environments because it provides a standardized block-cipher-based MAC when AES primitives are already required.
- Use the PMAC lesson to study a parallelizable block-cipher MAC because its independently offset non-final AES calls expose a different dependency graph from CMAC; do not infer NIST standardization or deployment guidance from this historical construction.
- Use Poly1305 only as a one-time authenticator key schedule (typically ChaCha20-derived) because reusing its one-time key enables practical forgeries.
- Use GHASH only inside correctly implemented AES-GCM with strict nonce discipline because GHASH linearity makes nonce reuse catastrophic for integrity.
- Do not use this set of primitives as a substitute for public-key signatures when third-party verifiability is required because all listed MAC constructions are symmetric and require shared secrets.
- Do NOT use this as production code — it is a teaching demo that includes deliberately vulnerable constructions for illustration, not a hardened MAC library.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-mac-race](https://systemslibrarian.github.io/crypto-lab-mac-race/)**

The demo lets you run nine interactive panels: Checksum vs MAC, HMAC, Raw CBC-MAC, CMAC, PMAC, Poly1305, GHASH, a SHA-256 length-extension attack, and a timing-attack comparison for naive vs constant-time verification. You can edit messages and attack inputs, then recompute outputs to observe how checksums, tags, dependency schedules, and attack outcomes change. It does not provide encrypt/decrypt workflows; it is focused on message authentication behavior and misuse demonstrations.

## What Can Go Wrong

- Raw CBC-MAC accepts a spliced longer message when lengths are unrestricted. An agreed-length receiver must share that restriction with its sender. The length-prepended and CMAC controls also test the recipe against their own oracles; they use separate keys, because exposing raw CBC-MAC under a CMAC key creates a different cross-protocol attack.
- Prefix-MAC length extension with bare SHA-256(secret || message): an attacker can forge a valid MAC for extended data without knowing the secret, which is demonstrated in the length-extension panel.
- Poly1305 one-time key reuse breaks message authenticity. The in-app demo narrows `r` to 16 bits for simple classroom brute force, not because full-size single-block reuse is intractable. For known single-block messages, reduction modulo 2^130−5 removes the large pre-reduction quotient, leaving a small number of tag-truncation carry candidates; an additional observation may be needed to distinguish them. Two tags do not universally identify one key, and arbitrary multi-block cases have different polynomial equations. The displayed forgery is checked by the real authenticator with the deliberately narrowed key. See [RFC 8439 §2.5](https://www.rfc-editor.org/rfc/rfc8439.html#section-2.5).
- Real GCM uses padded AAD/ciphertext, the mandatory length block and the nonce-derived mask `E_K(J0)` (NIST SP 800-38D algorithms 4/5). `H=E_K(0^128)` stays the same for a fixed key even across distinct nonces. With equal-length one-block ciphertexts, no AAD and full tags under one key/nonce, tag differences involve `H²`, not the toy's `H`. Local toy acceptance does not demonstrate a real GCM forgery.
- GHASH nonce reuse in GCM contexts: because GHASH is linear over GF(2^128), nonce reuse can expose relationships that permit forgery and broader AEAD failure.
- Non-constant-time MAC comparison: byte-by-byte early-exit checks leak timing information that helps attackers recover or validate tag bytes incrementally.
- CMAC implementation mistakes (subkey/padding/final-block handling): incorrect K1/K2 derivation or final block processing can produce incompatible or insecure tags.
- PMAC implementation mistakes can break interoperability or authenticity if the Gray-code offset recurrence, block position, 10* padding, or complete-final-block `L·x^-1` adjustment changes. This lab pins the 2002 construction rather than silently mixing in later PMAC refinements.
- A PMAC dependency span is not a runtime speedup claim. The model counts AES scheduling waves under a selected lane limit and excludes XOR, offset preparation, API overhead, hardware scheduling, and cached per-key setup.
- PMAC's post-quantum status depends on the oracle model. This lesson permits ordinary classical MAC queries. Kaplan, Leurent, Leverrier and Naya-Plasencia give a Simon-style forgery with quantum-superposition (Q2) oracle access, so the 2002 construction is not Q2-secure; this lab does not implement that stronger oracle. See [*Breaking Symmetric Cryptosystems Using Quantum Period Finding*](https://arxiv.org/abs/1602.05973).

## Real-World Usage

- TLS 1.2 record protection and PRF: HMAC-based constructions are used for record authentication and key-derivation components in legacy TLS suites.
- AWS Signature Version 4: request authentication uses chained HMAC-SHA-256 derivations to bind credentials, date scope, and canonical request data.
- ChaCha20-Poly1305 in TLS 1.3 and QUIC: Poly1305 is used as the authenticator in the AEAD construction with per-record nonce/key derivation.
- AES-GCM in TLS/IPsec: GHASH is the authentication polynomial component inside GCM tag generation and verification.
- 3GPP LTE EIA2 integrity algorithm: AES-CMAC is used to authenticate signaling messages in mobile network protocols.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-mac-race
cd crypto-lab-mac-race
npm install
npm run dev
`​``

## Tests

Correctness is gated by a runnable unit suite (Vitest), not just the in-browser
self-tests:

`​``bash
npm test        # KAT / property / forgery-rejection unit tests
npx playwright install chromium firefox webkit
npm run test:a11y  # browser gate (Playwright): on-screen claims + axe-core WCAG A/AA
npm run test:mutations  # original eight CRC/HMAC faults, unchanged
npm run test:mutations:cbcmac  # six raw-CBC-MAC / CMAC faults
npm run test:mutations:pmac  # ten PMAC arithmetic / verifier / model / boundary faults
`​``

The suite covers CRC-32/ISO-HDLC check and residue vectors, fixed-seed checksum repairs and four-byte target forcing through the real receiver, RFC 4231 HMAC vectors, NIST SP 800-38B AES-CMAC, RFC 8439
Poly1305, GHASH GF(2^128) vectors and field laws, the from-scratch SHA-256
core cross-checked against WebCrypto, and bounded local demonstrations: the raw
GHASH toy recovers a live-derived `H` and checks another raw field product.
This is not AES-GCM acceptance; genuine WebCrypto GCM verification controls accept
a published tag and reject the toy product and unmasked GHASH output; the length-extension forgery is verified against a
full re-hash and rejected on a wrong length guess; the Poly1305 reuse forgery
must match the tag the real key produces. PMAC is checked against the authors'
published AES-128 and AES-256 vectors (including the 1,000-byte cases) and an
independent noble-AES/BigInt implementation across every byte length from 0 to
257. The implementation follows [Black and Rogaway, EUROCRYPT 2002, §§2–5](https://www.cs.ucdavis.edu/~rogaway/papers/pmac.pdf);
the author-hosted [AES-128](https://www.cs.ucdavis.edu/~rogaway/ocb/pmac128.txt)
and [AES-256](https://www.cs.ucdavis.edu/~rogaway/ocb/pmac256.txt) vector files
are the known-answer sources. The later 2004 refinements are not substituted.

`e2e/claims.spec.ts` gates the *page* on the same standard: it independently recomputes every displayed CRC from the displayed bytes, checks the affine equation and HMAC control, and drives the real
panels and re-derives each verdict from what the page printed — the HMAC tag
against its own step list, the bit-diff labels against the cells they drew, the
GHASH deltas against the ciphertexts and tags beside them, the timing summary
against the rows above it — and sweeps the attacker's whole 8..24-byte secret
length search space, asserting exactly one guess forges a tag the broken server
accepts while the HMAC server rejects every one. The browser gate scans the
dark-only page at desktop and phone widths in Chromium, and checks the core lesson in
Firefox and WebKit. The unit, browser, and mutation gates run in CI before
every Pages deploy.

`e2e/pmac.spec.ts` reads the run's disclosed public teaching keys and recomputes
every displayed PMAC and CMAC tag with noble AES and independent BigInt field
arithmetic. It checks every lane's block, offset, AES input and AES output, both
final-block rules, content and position mutations, dependency spans, result
retirement, delayed obsolete work, and the variant/standardization/performance
boundaries. Disclosing those random teaching keys makes the trace auditable; it
is not an attacker model or an authenticity deployment.

The raw-CBC-MAC extension adds 19 unit tests (85 total). The byte-level CMAC
API preserves the existing string/passphrase-to-AES-256 behavior and permits
exact AES-128/256 vectors through the original WebCrypto block path. Pins:

- NIST SP 800-38A F.1.1/F.1.5 first AES-128/256 ECB blocks.
- RFC 4493 §4: all four AES-128 CMAC examples (0, 16, **40**, 64 bytes) and both subkeys.
- NIST CSRC `AES_CMAC.pdf`: all four AES-256 examples (0, 16, **20**, 64 bytes).
  The 2016 SP 800-38B update moved its former Appendix D examples to CSRC;
  the old test comment is re-anchored to that actual file.
- A **derived** raw-CBC-MAC check: fold SP 800-38A F.2.1’s IV into its first
  plaintext block, then compare the zero-IV MAC with the published last CBC
  ciphertext. This is not a published CBC-MAC vector.

Independent noble AES/CMAC checks cover 100 random 1–8-block raw chains and
all message lengths 0–100. One- and two-query algebra is tested for 100 random
keys, including the own-CMAC-oracle control. Another independent regression
pins the shared-key cross-protocol caveat, so the comparison cannot silently
reintroduce it. Shipping crypto does not call noble.

Five browser claims reconstruct forged bytes from printed messages/tags, check
actual aligned chain convergence and every verdict cause/style, exercise the
negative claim, UTF-8, general splices, mismatched sender/receiver lengths,
no-op preservation, retirement and delayed AES completions. The tour has nine
steps. Accessibility walks include the new states at desktop, 380px and 320px.
`cbcmac-mutation-evidence.json` records actual patches, successful changed builds,
named zero-retry assertion failures, exact restoration and passing owning tests.
Browser mutation runs verify served-JavaScript identity. The original CRC
mutation runner is unchanged.

The PMAC extension adds 21 unit tests (106 total), five browser claim tests and
a ten-case zero-retry mutation gate. `pmac-mutation-evidence.json` records the
concrete patches, owning assertion failures, served-asset guard and exact clean
restoration. CI runs the original CRC/HMAC, raw-CBC-MAC/CMAC and PMAC mutation
gates before deployment.

## Related Demos

- [crypto-lab-poly1305-mac](https://systemslibrarian.github.io/crypto-lab-poly1305-mac/) — deep dive on the Poly1305 polynomial authenticator and its key-reuse attack.
- [crypto-lab-nonce-guard](https://systemslibrarian.github.io/crypto-lab-nonce-guard/) — shows how GHASH/AES-GCM fails under nonce reuse.
- [crypto-lab-babel-hash](https://systemslibrarian.github.io/crypto-lab-babel-hash/) — the SHA-2/SHA-3/BLAKE3 hash internals that HMAC is built on.
- [crypto-lab-hash-zoo](https://systemslibrarian.github.io/crypto-lab-hash-zoo/) — Merkle-Damgard construction behind length-extension.
- [crypto-lab-aes-modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/) — AEAD and block-cipher modes that consume these MACs.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## KDF Chain

- **slug**: `crypto-lab-kdf-chain`
- **repo**: https://github.com/systemslibrarian/crypto-lab-kdf-chain
- **live**: https://systemslibrarian.github.io/crypto-lab-kdf-chain/
- **commit_sha**: `d56759c9efa0e1fa1d25db478c43e467a6ce9e6e` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS  ·  **level**: beginner  ·  **--accent**: #58a6ff
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: KDF Chain  — _read from src/ui.ts_

**Subtitle**: HKDF · PBKDF2 · scrypt · Argon2id  — _read from src/ui.ts_

**Description**: Derive keys with four KDFs side by side — stretch a low-entropy password, expand a high-entropy secret, and fan one root out into many keys, with live timing and RFC test vectors.  — _read from src/ui.ts_

**Why it matters**: The wrong KDF is why leaked password databases still get cracked. Salt, memory-hardness, and domain separation decide how ruinously expensive an attacker’s offline guessing becomes.  — _read from src/ui.ts_

**Card copy**: HKDF, PBKDF2, scrypt, and Argon2id compared side by side with live parameter tuning, real timing measurements, and a KDF decision tree.

**Chips**: HKDF · PBKDF2 · scrypt · Argon2id

**Implements**: Argon2 `src/argon2.ts:26`, HKDF `src/hkdf.ts:14`, HMAC `src/pbkdf2.ts:105`, PBKDF2 `src/pbkdf2.ts:20`, scrypt `src/scrypt.ts:43`, SHA-256 `src/pbkdf2.ts:41`, SHA-512 `src/pbkdf2.ts:48`

**Attacks shown**: Side-channel (unspecified) `src/decision.ts:59`

**Comment-only (named in code comments, not executed)**: TLS 1.3 `src/chain.ts:4`

**References**: BLAKE2, ChaCha20, ChaCha20-Poly1305, Diffie-Hellman, Double Ratchet, MD5, Noise protocol, Poly1305, Salsa20, TLS 1.3, bcrypt

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 5869` — first seen README.md:5 (21×)
- `RFC 7914` — first seen README.md:5 (11×)
- `RFC 8018` — first seen README.md:5 (5×)
- `RFC 9106` — first seen README.md:5 (13×)
- `rfc9106` — first seen README.md:31 (3×)
- `SP 800-132` — first seen src/decision.ts:80 (1×)

**README — What Can Go Wrong**:

```text
- **Using HKDF for passwords** — HKDF assumes high-entropy input key material. Fed a low-entropy password, it provides no stretching, and an attacker can brute-force the output at near-hash speed.
- **Low PBKDF2 iteration count** — PBKDF2 is embarrassingly parallel; GPUs can test millions of passwords per second. Below 600,000 iterations (OWASP minimum for PBKDF2-HMAC-SHA-256), offline attacks become trivially cheap.
- **Omitting salt** — any KDF without a unique random salt maps identical passwords to identical outputs, enabling precomputed rainbow-table and multi-target attacks across an entire credential database.
- **Under-provisioning scrypt memory (low N)** — scrypt's security depends on requiring large sequential memory reads. If N is too low, the memory-hardness guarantee disappears and GPU/ASIC attacks become practical.
- **Overstating Argon2id protection** — [RFC 9106 §§1 and 4](https://www.rfc-editor.org/rfc/rfc9106.html#section-1) specify a first half-pass with data-independent memory access followed by data-dependent access. This balances different attack considerations; it does not certify this browser code or all implementations against every side channel. [OWASP's t=2, m=19456 KiB (19 MiB), p=1](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) is a minimum configuration, not a guarantee that offline attack hardware becomes uneconomical. Select memory and time costs for the application and threat model.
- **Reusing HKDF info strings across contexts** — HKDF derives cryptographically independent keys only when the info string differs. Reusing the same info for encryption and MAC keys destroys domain separation and can enable key-reuse attacks.
```

**Claims tested** (e2e/claims.spec.ts, 20 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:33
    - :33 `expect` expected _no expected value_ _(none)_
- `every RFC known-answer row passes, and each verdict matches its own bytes` — e2e/claims.spec.ts:56
    - :62 `toHaveCount` expected `5` _(literal)_
    - :63 `toHaveCount` expected `0` _(literal)_
    - :75 `expect` expected _no expected value_ _(none)_
    - :78 `toBe` expected `expectedHex` _(expression)_
    - :79 `expect` expected _no expected value_ _(none)_
    - :84 `expect` expected _no expected value_ _(none)_
    - :85 `expect` expected _no expected value_ _(none)_
    - :86 `expect` expected _no expected value_ _(none)_
    - :102 `toBe` expected `refTc1` _(expression)_
- `HKDF: OKM is exactly the T(i) blocks concatenated and truncated` — e2e/claims.spec.ts:109
    - :114 `toHaveText` expected `'—'` _(literal)_
    - :120 `toMatch` expected `HEX` _(expression)_
    - :121 `toHaveLength` expected `64` _(literal)_
    - :122 `toHaveLength` expected `160` _(literal)_
    - :126 `toHaveLength` expected `3` _(literal)_
    - :127 `toMatch` expected `HEX` _(expression)_
    - :128 `toBe` expected `okm` _(expression)_
    - :132 `toHaveCount` expected `3` _(literal)_
    - :134 `toBe` expected `true` _(expression)_
    - :135 `expect` expected _no expected value_ _(none)_
    - :136 `toMatch` expected `/Derived in [\d.]+ ms/` _(regex)_
    - :166 `toBe` expected `ref.prk` _(expression)_
    - :167 `toBe` expected `ref.okm` _(expression)_
    - :168 `toEqual` expected `ref.blocks` _(expression)_
- `HKDF: the info string binds the context — change it and the key changes` — e2e/claims.spec.ts:171
    - :179 `toHaveText` expected `'—'` _(literal)_
    - :187 `toBe` expected `b.okm` _(expression)_
    - :188 `toBe` expected `a2.okm` _(expression)_
    - :190 `toBe` expected `b.prk` _(expression)_
- `PBKDF2: the derived keys are WebCrypto PBKDF2, and SHA-512 differs from SHA-256` — e2e/claims.spec.ts:197
    - :202 `toHaveText` expected `'—'` _(literal)_
    - :206 `toHaveLength` expected `64` _(literal)_
    - :207 `toHaveLength` expected `64` _(literal)_
    - :208 `toBe` expected `sha512` _(expression)_
    - :223 `toBe` expected `ref.s256` _(expression)_
    - :224 `toBe` expected `ref.s512` _(expression)_
    - :225 `toMatch` expected `/SHA-256: [\d.]+ ms \| SHA-512: [\d.]+ ms/` _(regex)_
- `PBKDF2 chain visual: every link is HMAC of its predecessor and the XOR sums to T1` — e2e/claims.spec.ts:228
    - :237 `toHaveCount` expected `c` _(expression)_
    - :250 `toBe` expected `'U1'` _(literal)_
    - :251 `toBe` expected `'HMAC(pw, salt ‖ INT(1))'` _(literal)_
    - :253 `toBe` expected `'U${j}'` _(expression)_
    - :254 `toBe` expected `'HMAC(pw, U${j - 1})'` _(expression)_
    - :262 `toBe` expected `folded` _(expression)_
    - :288 `toBe` expected `true` _(expression)_
    - :290 `toBe` expected `true` _(expression)_
- `PBKDF2 chain visual equals WebCrypto PBKDF2 block 1 at the same iteration count` — e2e/claims.spec.ts:294
    - :300 `toHaveCount` expected `c` _(expression)_
    - :302 `expect` expected _no expected value_ _(none)_
    - :307 `toHaveText` expected `'—'` _(literal)_
    - :309 `toBe` expected `true` _(expression)_
- `PBKDF2 attacker cost is exactly 22 GH/s ÷ (2 × iterations) and collapses to ASICs` — e2e/claims.spec.ts:312
    - :319 `toContainText` expected `'guesses/sec'` _(literal)_
    - :321 `toBe` expected `Math.round(22e9 / (2 * iter))` _(expression)_
    - :322 `expect` expected _no expected value_ _(none)_
    - :323 `expect` expected _no expected value_ _(none)_
    - :324 `expect` expected _no expected value_ _(none)_
    - :325 `expect` expected _no expected value_ _(none)_
- `scrypt: the printed memory estimate is exactly 128·N·r bytes` — e2e/claims.spec.ts:333
    - :342 `toHaveText` expected `'—', { timeout: 60_000 }` _(expression)_
    - :344 `toHaveLength` expected `len * 2` _(expression)_
    - :347 `toBeCloseTo` expected `(128 * N * r) / (1024 * 1024), 2` _(expression)_
    - :351 `toBe` expected `Math.round(1e12 / (2 * 128 * r * N))` _(expression)_
    - :352 `expect` expected _no expected value_ _(none)_
    - :353 `expect` expected _no expected value_ _(none)_
- `scrypt: raising N raises both memory and time, in step` — e2e/claims.spec.ts:357
    - :361 `toHaveText` expected `'—', { timeout: 240_000 }` _(expression)_
    - :364 `toHaveLength` expected `3` _(literal)_
    - :368 `expect` expected _no expected value_ _(none)_
    - :371 `toEqual` expected `[14, 17, 20]` _(expression)_
    - :374 `toBeCloseTo` expected `(128 * 2 ** s.n * 8) / (1024 * 1024), 1` _(expression)_
    - :377 `expect` expected _no expected value_ _(none)_
    - :378 `expect` expected _no expected value_ _(none)_
- `Argon2id guidance cites its sources and scopes side-channel and parameter claims` — e2e/claims.spec.ts:385
    - :388 `toContainText` expected `'first half'` _(literal)_
    - :389 `toContainText` expected `'not a guarantee'` _(literal)_
    - :390 `toContainText` expected `'as a minimum'` _(literal)_
    - :391 `toHaveCount` expected `3` _(literal)_
    - :392 `expect` expected _no expected value_ _(none)_
    - :394 `expect` expected _no expected value_ _(none)_
    - :397 `toContainText` expected `'as a minimum'` _(literal)_
- `Argon2id: tag length and memory readout follow the parameters given` — e2e/claims.spec.ts:400
    - :409 `toHaveText` expected `'—', { timeout: 90_000 }` _(expression)_
    - :411 `toHaveLength` expected `len * 2` _(expression)_
    - :413 `toBeCloseTo` expected `m / 1024, 1` _(expression)_
    - :416 `toBe` expected `Math.round(1e12 / (t * m * 1024))` _(expression)_
    - :417 `expect` expected _no expected value_ _(none)_
    - :418 `expect` expected _no expected value_ _(none)_
- `salt panel: every verdict matches the bytes printed above it` — e2e/claims.spec.ts:426
    - :432 `toContainText` expected `'Identical:', { timeout: 90_000 }` _(expression)_
    - :435 `toBe` expected `d2` _(expression)_
    - :436 `expect` expected _no expected value_ _(none)_
    - :440 `toContainText` expected `'Identical:', { timeout: 90_000 }` _(expression)_
    - :444 `toHaveLength` expected `2` _(literal)_
    - :445 `toBe` expected `salts[1]` _(expression)_
    - :446 `toBe` expected `outs[1]` _(expression)_
    - :447 `expect` expected _no expected value_ _(none)_
    - :449 `expect` expected _no expected value_ _(none)_
    - :453 `toContainText` expected `'Identical:', { timeout: 90_000 }` _(expression)_
    - :456 `toHaveLength` expected `2` _(literal)_
    - :457 `toBe` expected `ctxKeys[1]` _(expression)_
    - :458 `expect` expected _no expected value_ _(none)_
    - :462 `toContainText` expected `'Identical:', { timeout: 90_000 }` _(expression)_
    - :465 `toHaveLength` expected `2` _(literal)_
    - :466 `toBe` expected `domKeys[1]` _(expression)_
    - :467 `expect` expected _no expected value_ _(none)_
    - :470 `toBe` expected `4` _(literal)_
- `KDF chain: every leaf is HKDF-Expand of the root it hangs from` — e2e/claims.spec.ts:477
    - :481 `toHaveCount` expected `5, { timeout: 120_000 }` _(expression)_
    - :494 `toHaveLength` expected `64` _(literal)_
    - :495 `toHaveLength` expected `3` _(literal)_
    - :496 `toBe` expected `3` _(literal)_
    - :501 `toEqual` expected `['encryption key', 'MAC key', 'vault storage key']` _(expression)_
    - :518 `toEqual` expected `ref` _(expression)_
    - :525 `expect` expected _no expected value_ _(none)_
    - :526 `expect` expected _no expected value_ _(none)_
    - :529 `expect` expected _no expected value_ _(none)_
- `KDF chain: changing one info string changes only that key` — e2e/claims.spec.ts:532
    - :538 `toHaveCount` expected `5, { timeout: 120_000 }` _(expression)_
    - :548 `toBe` expected `before[1]` _(expression)_
    - :549 `toBe` expected `before[2]` _(expression)_
    - :550 `toBe` expected `before[3]` _(expression)_
    - :551 `toBe` expected `before[4]` _(expression)_
    - :557 `toHaveCount` expected `4, { timeout: 120_000 }` _(expression)_
    - :558 `toContainText` expected `'(2 keys from one password)'` _(literal)_
- `cost comparison: bar widths are consistent with the milliseconds they report` — e2e/claims.spec.ts:565
    - :569 `toHaveCount` expected `4, { timeout: 180_000 }` _(expression)_
    - :580 `toEqual` expected `[` _(expression)_
    - :589 `toHaveLength` expected `1` _(literal)_
    - :590 `toBe` expected `max` _(expression)_
    - :594 `expect` expected _no expected value_ _(none)_
    - :602 `expect` expected _no expected value_ _(none)_
    - :611 `toBe` expected `Math.round(22e9 / 200_000)` _(expression)_
    - :612 `toBe` expected `Math.round(22e9 / 1_200_000)` _(expression)_
    - :615 `expect` expected _no expected value_ _(none)_
    - :616 `expect` expected _no expected value_ _(none)_
    - :617 `expect` expected _no expected value_ _(none)_
    - :618 `expect` expected _no expected value_ _(none)_
    - :619 `expect` expected _no expected value_ _(none)_
    - :620 `expect` expected _no expected value_ _(none)_
- `decision tree: every branch reaches its documented recommendation and says why` — e2e/claims.spec.ts:627
    - :645 `expect` expected _no expected value_ _(none)_
    - :646 `expect` expected _no expected value_ _(none)_
    - :647 `expect` expected _no expected value_ _(none)_
    - :648 `expect` expected _no expected value_ _(none)_
    - :654 `expect` expected _no expected value_ _(none)_
    - :655 `expect` expected _no expected value_ _(none)_
    - :656 `expect` expected _no expected value_ _(none)_
    - :657 `expect` expected _no expected value_ _(none)_
    - :662 `expect` expected _no expected value_ _(none)_
    - :663 `expect` expected _no expected value_ _(none)_
    - :664 `expect` expected _no expected value_ _(none)_
    - :665 `expect` expected _no expected value_ _(none)_
    - :669 `expect` expected _no expected value_ _(none)_
    - :670 `expect` expected _no expected value_ _(none)_
    - :671 `toBe` expected `multi.why` _(expression)_
- `comparison table renders real status chips, not serialised markup` — e2e/claims.spec.ts:674
    - :680 `toHaveCount` expected `4` _(literal)_
    - :685 `toEqual` expected `[` _(expression)_
    - :698 `toBe` expected `''` _(literal)_
    - :699 `expect` expected _no expected value_ _(none)_
    - :700 `expect` expected _no expected value_ _(none)_
    - :701 `expect` expected _no expected value_ _(none)_
    - :705 `toMatch` expected `/[<>]/` _(regex)_
- `memory grid: one cell per MiB, at every step of the slider, matching its own label` — e2e/claims.spec.ts:713
    - :718 `toBe` expected `4` _(literal)_
    - :725 `toHaveCount` expected `mib` _(expression)_
    - :732 `toHaveCount` expected `4, { timeout: 30_000 }` _(expression)_
    - :733 `toContainText` expected `'4 MiB'` _(literal)_
    - :734 `toContainText` expected `'Streaming 4 cells'` _(literal)_
    - :738 `toHaveCount` expected `48` _(literal)_
    - :739 `toHaveCount` expected `48` _(literal)_
- `README promises a reader can see: guided path, RFC citations, inline assumptions` — e2e/claims.spec.ts:742
    - :747 `toHaveCount` expected `6` _(literal)_
    - :754 `toBe` expected `true` _(expression)_
    - :755 `toEqual` expected `[` _(expression)_
    - :760 `toHaveCount` expected `10` _(literal)_
    - :763 `expect` expected _no expected value_ _(none)_
    - :769 `toHaveCount` expected `await page.locator('.attack-out').count()` _(expression)_
    - :770 `toHaveCount` expected `3` _(literal)_
    - :772 `expect` expected _no expected value_ _(none)_
    - :773 `expect` expected _no expected value_ _(none)_
    - :774 `expect` expected _no expected value_ _(none)_
    - :775 `expect` expected _no expected value_ _(none)_
    - :780 `toBe` expected `'Derive a key to estimate attacker cost.'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-kdf-chain

## What It Is

crypto-lab-kdf-chain is an interactive browser demo of four key derivation functions: HKDF (RFC 5869), PBKDF2 (RFC 8018), scrypt (RFC 7914), and Argon2id (RFC 9106). It shows what security problem each KDF solves, how their parameters affect cost, and why choosing the wrong one leads to real-world compromise. All four operate under a symmetric security model — they transform shared secrets or passwords into derived key material on top of a keyed hash. HKDF and PBKDF2 use HMAC-SHA-256 directly; scrypt wraps PBKDF2-HMAC-SHA-256 around a Salsa20/8-based mixing core; Argon2id is built on BLAKE2b (RFC 9106 §1), not HMAC-SHA-256. The demo is entirely client-side: HKDF and PBKDF2 use the WebCrypto API; scrypt and Argon2id use @noble/hashes.

## When to Use It

- **You need to teach or learn what KDFs actually do** — the demo derives real keys with real timing so you can see how iteration count, memory cost, and salt affect output and performance.
- **You are choosing between HKDF, PBKDF2, scrypt, and Argon2id** — the built-in decision tree walks through input entropy, multi-key derivation, and FIPS constraints to recommend the right KDF.
- **You want to demonstrate why salt matters** — the salt panel shows identical passwords producing identical output without salt and independent output with salt, making rainbow-table risk concrete.
- **You need to benchmark KDF cost in a specific browser** — PBKDF2 iteration benchmarks and scrypt N-value comparisons use real `performance.now()` timing on whatever hardware you run.
- Do not use this demo for production key derivation — it runs in a browser with no secure memory management, no constant-time guarantees, and user-supplied parameters that may be too weak.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-kdf-chain](https://systemslibrarian.github.io/crypto-lab-kdf-chain/)**

A **guided path** at the top walks newcomers through the demo in six ordered steps; experienced users can jump straight to any panel.

The demo has ten interactive panels. You can derive HKDF keys by entering IKM (the secret you start with), salt, info string, and output length — and watch a two-phase **extract→expand diagram** animate your real bytes flowing salt+IKM into an HMAC box that emits the PRK (a condensed random seed), then the PRK feeding a loop that concatenates T(i-1)‖info‖counter to build T(1), T(2), … so the mechanism is visible, not just the hex; derive PBKDF2 keys with configurable iterations and compare SHA-256 vs SHA-512 timing, with a live **iteration-chain visual** (U₁ → U₂ → … with a running XOR accumulator and a slider) that shows the U₁…Uₙ-XORed mechanism the standard defines — verified byte-for-byte against WebCrypto's own PBKDF2; tune scrypt N/r/p parameters and compare memory cost at different N values; derive Argon2id keys with adjustable time cost, memory cost, and parallelism; see a **memory-hardness visual** whose grid scales to the N (scrypt) / m (Argon2id) you choose and shows 48 GPU cores stalling on the single memory bus while the block fills; run the **KDF chain** (Argon2id → HKDF-Expand fan-out) that turns one password into multiple domain-separated keys; run a **cost comparison** that pushes one password through every KDF and renders both your derivation time and the attacker's projected offline crack time; run a decision tree that recommends a KDF based on your constraints; run salt and context-binding demonstrations that show rainbow-table vulnerability, salt protection, HKDF context binding, and domain separation; and run **RFC known-answer tests** that recompute published RFC 5869 and RFC 7914 vectors in your browser and check them byte-for-byte.

Every password-KDF panel also shows an **attacker-cost estimate**: pick a target password — from a reused/leaked-list password up to a strong random one — and see how long an offline search would take on one GPU, a 1,000-GPU farm, and a specialized ASIC. An expandable **"assumptions" note sits inline next to the numbers** (RTX 4090-class hardware, keyspace ÷ 2, ASIC ~5000× for compute-bound / ~5× for memory-bound), so the model's inputs are visible where the numbers are read. The figures use a simplified bandwidth model and illustrative ASIC multipliers. They are teaching estimates, not measured crack rates, universal hardware economics, or security proofs.

## What Can Go Wrong

- **Using HKDF for passwords** — HKDF assumes high-entropy input key material. Fed a low-entropy password, it provides no stretching, and an attacker can brute-force the output at near-hash speed.
- **Low PBKDF2 iteration count** — PBKDF2 is embarrassingly parallel; GPUs can test millions of passwords per second. Below 600,000 iterations (OWASP minimum for PBKDF2-HMAC-SHA-256), offline attacks become trivially cheap.
- **Omitting salt** — any KDF without a unique random salt maps identical passwords to identical outputs, enabling precomputed rainbow-table and multi-target attacks across an entire credential database.
- **Under-provisioning scrypt memory (low N)** — scrypt's security depends on requiring large sequential memory reads. If N is too low, the memory-hardness guarantee disappears and GPU/ASIC attacks become practical.
- **Overstating Argon2id protection** — [RFC 9106 §§1 and 4](https://www.rfc-editor.org/rfc/rfc9106.html#section-1) specify a first half-pass with data-independent memory access followed by data-dependent access. This balances different attack considerations; it does not certify this browser code or all implementations against every side channel. [OWASP's t=2, m=19456 KiB (19 MiB), p=1](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) is a minimum configuration, not a guarantee that offline attack hardware becomes uneconomical. Select memory and time costs for the application and threat model.
- **Reusing HKDF info strings across contexts** — HKDF derives cryptographically independent keys only when the info string differs. Reusing the same info for encryption and MAC keys destroys domain separation and can enable key-reuse attacks.

## Real-World Usage

- **TLS 1.3** — uses HKDF-Expand and HKDF-Extract (RFC 5869) as the key schedule to derive handshake and application traffic keys from the shared secret.
- **Signal Protocol** — uses HKDF with distinct info strings to derive root keys, chain keys, and message keys in the Double Ratchet, providing forward secrecy and domain separation.
- **WireGuard** — uses HKDF in its Noise IK handshake to extract and expand chaining keys and transport data keys from each Diffie-Hellman output.
- **1Password / Bitwarden** — use PBKDF2-HMAC-SHA-256 (or Argon2id in newer configurations) to stretch the user's master password into an encryption key for the vault.
- **Linux libsodium (pwhash)** — uses Argon2id as the default password hashing algorithm, with tunable time and memory cost, to protect stored credentials against GPU and ASIC attacks.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-kdf-chain
cd crypto-lab-kdf-chain
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-kdf-arena](https://systemslibrarian.github.io/crypto-lab-kdf-arena/) — sibling KDF benchmark that times HKDF/PBKDF2/scrypt/Argon2id side by side.
- [crypto-lab-shadow-vault](https://systemslibrarian.github.io/crypto-lab-shadow-vault/) — Argon2id plus ChaCha20-Poly1305 file encryption.
- [crypto-lab-ratchet-wire](https://systemslibrarian.github.io/crypto-lab-ratchet-wire/) — Double Ratchet that derives message keys with HKDF.
- [crypto-lab-mac-race](https://systemslibrarian.github.io/crypto-lab-mac-race/) — HMAC and other MACs, the PRF underneath these KDFs.
- [crypto-lab-bcrypt-forge](https://systemslibrarian.github.io/crypto-lab-bcrypt-forge/) — bcrypt cost-factor tuning, the other major password-hashing family.

## Building and Testing

For a production build:

`​``bash
npm run build
`​``

To run the test suite (RFC known-answer vectors, chain key-independence, and attacker-cost math) — requires Node ≥ 22.18 for native TypeScript:

`​``bash
npm test
`​``

For GitHub Pages deployment:

`​``bash
npm run deploy
`​``

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Hash Zoo

- **slug**: `crypto-lab-hash-zoo`
- **repo**: https://github.com/systemslibrarian/crypto-lab-hash-zoo
- **live**: https://systemslibrarian.github.io/crypto-lab-hash-zoo/
- **commit_sha**: `0eb14f0e3e0e742982b81fb7bc08d36bc4ace7f4` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS  ·  **level**: beginner  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, verification

**Name (H1)**: Hash Zoo  — _read from src/ui.ts_

**Subtitle**: SHA-256 · SHA3-256 · Keccak-256 · BLAKE3 · MD5 / SHA-1 (legacy)  — _read from src/ui.ts_

**Description**: Hashes the same message through Merkle-Damgard, sponge, and tree constructions side-by-side, then flips a single input bit so you can watch each design's avalanche scatter across the output.  — _read from src/ui.ts_

**Why it matters**: Hashes support file checks, signatures, and blockchains. Watch a one-bit input change spread across a digest, then try a length-extension attack. Avalanche illustrates diffusion; it does not prove collision resistance or authenticate a message.  — _read from src/ui.ts_

**Card copy**: SHA-256 vs SHA3-256 vs BLAKE3 internals — live avalanche analysis, Merkle-Damgård/sponge/tree construction diagrams, and timing benchmarks.

**Chips**: SHA-256 · SHA3-256 · BLAKE3 · Merkle-Damgård

**Implements**: AES `src/blockcipher/dm.ts:21`, BLAKE3 `src/hasher.ts:175`, Davies-Meyer `src/blockcipher/dm.ts:22`, Keccak `src/hasher.ts:172`, MD5 `src/hasher.ts:145`, SHA-1 `src/hasher.ts:146`, SHA-256 `src/hasher.ts:265`, SHA-3 `src/hasher.ts:169`

**Attacks shown**: Brute force `README.md:55`, Length extension `src/hasher.ts:240`, Side-channel (unspecified) `README.md:58`, Timing side-channel `README.md:58`

**References**: Argon2, CMAC, DES, GHASH, HKDF, HMAC, KMAC, Merkle tree, PBKDF2, Poly1305, SHA-512, TLS 1.3, scrypt

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `eprint.iacr.org/2026/1120` — first seen README.md:164 (2×)
- `eprint.iacr.org/2026/232` — first seen README.md:164 (2×)
- `EUROCRYPT 2005` — first seen README.md:144 (2×)
- `EUROCRYPT 2026` — first seen src/ui.ts:446 (1×)
- `FIPS 180-4` — first seen README.md:63 (4×)
- `FIPS 202` — first seen README.md:65 (2×)
- `NIST SP 800-38A` — first seen README.md:122 (3×)
- `RFC 6151` — first seen README.md:45 (2×)
- `rfc6151` — first seen README.md:45 (2×)

**README — What Can Go Wrong**:

```text
- **A block cipher without feed-forward is invertible.** A free-start adversary can choose a chaining input by one AES decryption. With XOR, that shortcut is not a general inversion method; the all-zero input is an explicitly shown exception.
- **Ambiguous padding.** Correct AES calls and correct compression steps cannot rescue zero-fill padding: a non-aligned message and the same message followed by a zero byte have identical padded bytes. The length-delimited default separates this pair.

- **Length extension on bare SHA-256.** Merkle-Damgård hashes expose their internal state as the final digest, allowing an attacker to append data and compute a valid hash without knowing the original message. For message authentication, use a specified keyed construction such as HMAC-SHA256, KMAC, or BLAKE3 keyed mode, and verify the tag before acting on the message. Switching to a plain unkeyed SHA-3 or BLAKE3 digest does not authenticate a sender; resistance to this length-extension attack alone does not establish MAC security.
- **Confusing hash speed with password safety.** SHA-256, SHA3-256, Keccak-256, and BLAKE3 are all fast hashes — unsuitable for password storage because an attacker can brute-force billions of guesses per second.
- **Assuming SHA-256 and SHA3-256 are interchangeable.** Despite both producing 256-bit output, their constructions differ fundamentally. Code expecting Merkle-Damgård padding semantics will break if swapped to a sponge hash.
- **Ignoring BLAKE3's tree structure in streaming contexts.** BLAKE3 digests depend on chunk boundaries; streaming implementations must track the tree state correctly or produce wrong hashes.
- **Timing side channels in comparison logic.** Comparing hash digests with early-exit equality checks can leak information about which bytes match; use constant-time comparison in security-critical code.
```

**Claims tested** (e2e/claims.spec.ts, 55 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:74
    - :74 `toHaveCount` expected `6` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:80
    - :80 `expect` expected _no expected value_ _(none)_
- `Section A: hash comparison` — e2e/claims.spec.ts:87
- `Keccak-256 matches independent UTF-8 and sponge-boundary fixtures on screen` — e2e/claims.spec.ts:88
    - :92 `toHaveText` expected `hex` _(expression)_
- `Keccak and SHA-3 stay distinct under their labels, copy controls and explanation` — e2e/claims.spec.ts:95
    - :100 `toHaveText` expected `nodeHash('sha3-256', 'abc')` _(expression)_
    - :101 `toHaveText` expected `'4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45'` _(literal)_
    - :103 `toBe` expected `'4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45'` _(literal)_
    - :105 `toContainText` expected `'not interchangeable names'` _(literal)_
    - :107 `toContainText` expected `'0x01'` _(literal)_
    - :108 `toContainText` expected `'0x06'` _(literal)_
    - :109 `toHaveAttribute` expected `'href', 'https://systemslibrarian.github.io/crypto-lab-collision-vault/'` _(expression)_
    - :110 `toContainText` expected `'MD5 and SHA-1'` _(literal)_
- `prints all six digests with their actual output sizes` — e2e/claims.spec.ts:113
    - :117 `toBe` expected `nodeHash('sha256', DEFAULT_MESSAGE)` _(expression)_
    - :118 `toBe` expected `nodeHash('sha3-256', DEFAULT_MESSAGE)` _(expression)_
    - :119 `toBe` expected `nodeHash('md5', DEFAULT_MESSAGE)` _(expression)_
    - :120 `toBe` expected `nodeHash('sha1', DEFAULT_MESSAGE)` _(expression)_
    - :121 `toHaveLength` expected `32` _(literal)_
    - :122 `toHaveLength` expected `40` _(literal)_
    - :126 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :128 `toHaveText` expected `[` _(expression)_
    - :138 `toBe` expected `6` _(literal)_
- `matches published vectors for the empty message and "abc", including BLAKE3` — e2e/claims.spec.ts:141
    - :146 `toBe` expected `nodeHash('sha256', '')` _(expression)_
    - :147 `toBe` expected `nodeHash('sha3-256', '')` _(expression)_
    - :148 `toBe` expected `'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'` _(literal)_
    - :149 `toBe` expected `BLAKE3_EMPTY` _(expression)_
    - :150 `toBe` expected `'d41d8cd98f00b204e9800998ecf8427e'` _(literal)_
    - :151 `toBe` expected `'da39a3ee5e6b4b0d3255bfef95601890afd80709'` _(literal)_
    - :155 `toBe` expected `nodeHash('sha256', 'abc')` _(expression)_
    - :156 `toBe` expected `nodeHash('sha3-256', 'abc')` _(expression)_
    - :157 `toBe` expected `'4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45'` _(literal)_
    - :158 `toBe` expected `BLAKE3_ABC` _(expression)_
    - :159 `toBe` expected `'900150983cd24fb0d6963f7d28e17f72'` _(literal)_
    - :160 `toBe` expected `'a9993e364706816aba3e25717850c26c9cd0d89d'` _(literal)_
- `is deterministic and fixed-size: same input same output, any size in, the specified digest size out` — e2e/claims.spec.ts:163
    - :169 `toEqual` expected `first` _(expression)_
    - :170 `toHaveText` expected `'Same input -> same output.'` _(literal)_
    - :177 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :178 `toHaveLength` expected `[64, 64, 64, 64, 32, 40][i]` _(expression)_
    - :180 `toBe` expected `nodeHash('sha256', message)` _(expression)_
    - :181 `toBe` expected `nodeHash('sha3-256', message)` _(expression)_
    - :182 `toBe` expected `nodeHash('md5', message)` _(expression)_
    - :183 `toBe` expected `nodeHash('sha1', message)` _(expression)_
- `one edited character changes all six digests` — e2e/claims.spec.ts:187
    - :192 `toBe` expected `before[i]` _(expression)_
    - :193 `toBe` expected `nodeHash('sha256', 'hash zoO')` _(expression)_
- `timing is hidden behind the toggle and reports real per-iteration numbers` — e2e/claims.spec.ts:196
    - :203 `toBeHidden` expected _no expected value_ _(none)_
    - :205 `toBeVisible` expected _no expected value_ _(none)_
    - :208 `toHaveCount` expected `6` _(literal)_
    - :209 `toHaveText` expected `['SHA-256', 'SHA3-256', 'Keccak-256', 'BLAKE3', 'MD5 (legacy)', 'SHA-1 (legacy)']` _(expression)_
    - :212 `toBe` expected `true` _(expression)_
    - :213 `expect` expected _no expected value_ _(none)_
    - :216 `expect` expected _no expected value_ _(none)_
    - :218 `toContainText` expected `'Indicative only'` _(literal)_
- `the copy button copies exactly the digest rendered beside it` — e2e/claims.spec.ts:221
    - :228 `toBe` expected `sha256` _(expression)_
    - :231 `toHaveText` expected `'Copied'` _(literal)_
    - :232 `toBe` expected `sha256` _(expression)_
    - :233 `toHaveText` expected `'Hash copied to clipboard'` _(literal)_
    - :234 `toHaveText` expected `'Copy', { timeout: 5000 }` _(expression)_
- `FAILURE PATH: a rejected clipboard write reports the failure` — e2e/claims.spec.ts:237
    - :246 `toHaveText` expected `'Failed'` _(literal)_
    - :247 `toHaveText` expected `'Copy failed'` _(literal)_
- `Intro: what is a hash` — e2e/claims.spec.ts:255
- `the live fingerprint is a real, abbreviated SHA-256 of the typed text` — e2e/claims.spec.ts:256
    - :261 `toHaveAttribute` expected `'title', full` _(expression)_
    - :263 `toHaveText` expected `'${full.slice(0, 12)}…${full.slice(-8)}'` _(expression)_
    - :281 `expect` expected _no expected value_ _(none)_
- `Section B: avalanche effect` — e2e/claims.spec.ts:290
- `every counter agrees with the grid, the heatmap and the meter it summarises` — e2e/claims.spec.ts:291
    - :296 `toHaveCount` expected `6` _(literal)_
    - :304 `toBe` expected `outputBits` _(expression)_
    - :305 `toHaveCount` expected `outputBits` _(expression)_
    - :307 `toHaveCount` expected `diffBits` _(expression)_
    - :308 `toHaveCount` expected `outputBits - diffBits` _(expression)_
    - :310 `toBeCloseTo` expected `(diffBits / outputBits) * 100, 1` _(expression)_
    - :316 `toHaveLength` expected `outputBits / 8` _(expression)_
    - :317 `toBe` expected `true` _(expression)_
    - :318 `toBe` expected `diffBits` _(expression)_
    - :321 `toHaveAttribute` expected _no expected value_ _(none)_
    - :330 `toBe` expected `'width:${percent.toFixed(1)}%'` _(expression)_
    - :333 `toHaveClass` expected `new RegExp('\\b${expected}\\b')` _(expression)_
    - :336 `toHaveAttribute` expected _no expected value_ _(none)_
- `the bit counts equal an independently computed avalanche` — e2e/claims.spec.ts:343
    - :364 `toBe` expected `expected[algo as keyof typeof expected]` _(expression)_
    - :367 `expect` expected _no expected value_ _(none)_
    - :368 `expect` expected _no expected value_ _(none)_
- `the announced result quotes the percentages actually rendered` — e2e/claims.spec.ts:372
    - :377 `toHaveText` expected _no expected value_ _(none)_
- `the input strip shows the message bits and highlights exactly the flipped one` — e2e/claims.spec.ts:382
    - :395 `toHaveCount` expected `bytes.length * 8` _(expression)_
    - :396 `toBe` expected `expectedBits` _(expression)_
    - :397 `toHaveAttribute` expected _no expected value_ _(none)_
    - :405 `toEqual` expected `[9]` _(expression)_
    - :409 `toHaveText` expected _no expected value_ _(none)_
    - :413 `toHaveText` expected `'bit 9 / ${bytes.length * 8 - 1}'` _(expression)_
- `moving the slider recomputes against the newly flipped bit` — e2e/claims.spec.ts:416
    - :422 `toHaveText` expected `'bit 123 / 343'` _(literal)_
    - :427 `toBe` expected `before.diffBits` _(expression)_
    - :428 `toHaveCount` expected `after.diffBits` _(expression)_
    - :429 `toBe` expected _no expected value_ _(none)_
- `counts UTF-8 bytes, not characters` — e2e/claims.spec.ts:437
    - :440 `toHaveText` expected `'bit 0 / 23'` _(literal)_
    - :441 `toHaveAttribute` expected _no expected value_ _(none)_
    - :445 `toHaveCount` expected `24` _(literal)_
- `a long message truncates the strip and names the window it is showing` — e2e/claims.spec.ts:448
    - :451 `toHaveCount` expected `512` _(literal)_
    - :453 `toHaveCount` expected `1` _(literal)_
    - :454 `toHaveAttribute` expected _no expected value_ _(none)_
- `the highlighted bit is the bit the label names, at every window position` — e2e/claims.spec.ts:476
    - :482 `toContainText` expected `'One bit is flipped (highlighted)'` _(literal)_
    - :486 `toHaveText` expected `'bit ${bit} / 799'` _(expression)_
    - :494 `toHaveLength` expected `1` _(literal)_
    - :503 `toBe` expected `bit` _(expression)_
    - :504 `toBe` expected `named` _(expression)_
    - :505 `expect` expected _no expected value_ _(none)_
    - :506 `expect` expected _no expected value_ _(none)_
    - :507 `toBe` expected `512` _(literal)_
- `FAILURE PATH: an empty message disables the flip controls and says why` — e2e/claims.spec.ts:511
    - :515 `toBeDisabled` expected _no expected value_ _(none)_
    - :516 `toHaveText` expected `'no message'` _(literal)_
    - :517 `toHaveText` expected `'Message: (empty)'` _(literal)_
    - :518 `toHaveText` expected _no expected value_ _(none)_
    - :521 `toHaveText` expected _no expected value_ _(none)_
    - :526 `toHaveText` expected _no expected value_ _(none)_
    - :529 `toHaveCount` expected `0` _(literal)_
- `Section B: every-bit sweep` — e2e/claims.spec.ts:537
- `rejects an unexpected algorithm value without treating DOM text as HTML` — e2e/claims.spec.ts:538
    - :540 `toBeVisible` expected _no expected value_ _(none)_
    - :548 `toHaveText` expected `'Choose a supported algorithm to run the sweep.'` _(literal)_
    - :549 `toHaveText` expected `'Choose a supported algorithm to run the sweep.'` _(literal)_
    - :550 `toHaveCount` expected `0` _(literal)_
    - :551 `expect` expected _no expected value_ _(none)_
- `the ${algo} sweep's buckets sum to the flips it reports` — e2e/claims.spec.ts:554
    - :562 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :567 `expect` expected _no expected value_ _(none)_
    - :571 `toBe` expected `utf8(message).length * 8` _(expression)_
    - :572 `expect` expected _no expected value_ _(none)_
    - :576 `toHaveCount` expected `20` _(literal)_
    - :580 `toBe` expected `true` _(expression)_
    - :581 `toBe` expected `flips` _(expression)_
    - :584 `expect` expected _no expected value_ _(none)_
    - :585 `expect` expected _no expected value_ _(none)_
    - :586 `expect` expected _no expected value_ _(none)_
    - :587 `expect` expected _no expected value_ _(none)_
    - :590 `expect` expected _no expected value_ _(none)_
    - :591 `expect` expected _no expected value_ _(none)_
    - :596 `expect` expected _no expected value_ _(none)_
    - :597 `expect` expected _no expected value_ _(none)_
    - :604 `toEqual` expected `[10]` _(expression)_
    - :607 `toHaveAttribute` expected _no expected value_ _(none)_
    - :617 `toHaveText` expected _no expected value_ _(none)_
- `the sweep says which bits it flipped: ${label}` — e2e/claims.spec.ts:646
    - :652 `toBeVisible` expected `{ timeout: 120_000 }` _(expression)_
    - :663 `toBe` expected `flips` _(expression)_
    - :666 `expect` expected _no expected value_ _(none)_
    - :667 `expect` expected _no expected value_ _(none)_
    - :674 `expect` expected _no expected value_ _(none)_
    - :676 `toBe` expected `totalBits` _(expression)_
    - :677 `expect` expected _no expected value_ _(none)_
    - :678 `toBe` expected `Math.ceil(totalBits / step)` _(expression)_
    - :679 `expect` expected _no expected value_ _(none)_
    - :681 `toHaveAttribute` expected _no expected value_ _(none)_
    - :686 `toContainText` expected _no expected value_ _(none)_
- `editing the message retires the previous sweep instead of restating it` — e2e/claims.spec.ts:705
    - :710 `toBeVisible` expected _no expected value_ _(none)_
    - :712 `expect` expected _no expected value_ _(none)_
    - :716 `toHaveCount` expected `0` _(literal)_
    - :717 `toHaveCount` expected `0` _(literal)_
    - :718 `toContainText` expected `'Run every-bit sweep'` _(literal)_
    - :722 `toContainText` expected `'Add a message above'` _(literal)_
    - :724 `toContainText` expected `'Add a message above'` _(literal)_
    - :725 `toHaveCount` expected `0` _(literal)_
    - :731 `toBeVisible` expected _no expected value_ _(none)_
    - :733 `toHaveCount` expected `0` _(literal)_
- `FAILURE PATH: sweeping an empty message refuses and says why (screen readers too)` — e2e/claims.spec.ts:736
    - :741 `toHaveText` expected `'Add a message above to run the sweep.'` _(literal)_
    - :742 `toHaveCount` expected `0` _(literal)_
    - :746 `toHaveText` expected _no expected value_ _(none)_
    - :766 `toHaveLength` expected `5` _(literal)_
- `Section C: length-extension forgery` — e2e/claims.spec.ts:777
- `the forged tag is a genuine SHA-256 of secret ‖ glue ‖ append` — e2e/claims.spec.ts:778
    - :785 `toBe` expected `nodeHash('sha256', secret)` _(expression)_
    - :786 `toBe` expected `utf8(secret).length` _(expression)_
    - :790 `toBe` expected `glue.toString('hex')` _(expression)_
    - :791 `toBe` expected `true` _(expression)_
    - :792 `toBe` expected `0` _(literal)_
    - :793 `toBe` expected _no expected value_ _(none)_
    - :798 `toBe` expected `append` _(expression)_
    - :803 `toBe` expected `f.verify` _(expression)_
    - :804 `toBe` expected `nodeHash('sha256', reconstructed)` _(expression)_
    - :807 `toBe` expected `f.publishedTag` _(expression)_
    - :808 `toBe` expected `nodeHash('sha256', secret + append)` _(expression)_
    - :810 `toContainText` expected `'✓ VERIFIED'` _(literal)_
    - :811 `toHaveCount` expected `0` _(literal)_
- `holds for secrets whose padding crosses a block boundary` — e2e/claims.spec.ts:814
- `secret of ${utf8(secret).length} bytes` — e2e/claims.spec.ts:816
    - :824 `toBe` expected `utf8(secret).length` _(expression)_
    - :825 `toBe` expected `glue.toString('hex')` _(expression)_
    - :831 `toBe` expected `nodeHash('sha256', reconstructed)` _(expression)_
    - :832 `toBe` expected `f.verify` _(expression)_
    - :833 `toContainText` expected `'✓ VERIFIED'` _(literal)_
    - :834 `toHaveText` expected _no expected value_ _(none)_
- `an empty append still forges a valid tag` — e2e/claims.spec.ts:841
    - :850 `toBe` expected `nodeHash('sha256', reconstructed)` _(expression)_
    - :851 `toBe` expected `f.verify` _(expression)_
- `FAILURE PATH: an empty secret refuses to forge and says why (screen readers too)` — e2e/claims.spec.ts:854
    - :859 `toHaveText` expected _no expected value_ _(none)_
    - :862 `toHaveCount` expected `0` _(literal)_
    - :866 `toHaveText` expected _no expected value_ _(none)_
- `editing the secret retires the previous forgery instead of misattributing it` — e2e/claims.spec.ts:884
    - :889 `toBe` expected `nodeHash('sha256', original)` _(expression)_
    - :893 `toHaveCount` expected `0` _(literal)_
    - :894 `toHaveCount` expected `0` _(literal)_
    - :895 `toContainText` expected `'Forge extended hash'` _(literal)_
    - :900 `toBe` expected `nodeHash('sha256', 'a much shorter key')` _(expression)_
    - :901 `toBe` expected `utf8('a much shorter key').length` _(expression)_
    - :905 `toHaveCount` expected `0` _(literal)_
    - :907 `toBe` expected `'&role=root'` _(literal)_
- `TAMPER PATH: attacker-controlled append is escaped, never executed` — e2e/claims.spec.ts:910
    - :916 `toBe` expected `payload` _(expression)_
    - :917 `toHaveCount` expected `0` _(literal)_
    - :918 `expect` expected _no expected value_ _(none)_
    - :927 `toBe` expected `nodeHash('sha256', reconstructed)` _(expression)_
- `Section C: construction claims` — e2e/claims.spec.ts:935
- `native parallel performance is distinguished from this single-threaded timing loop` — e2e/claims.spec.ts:936
    - :938 `toContainText` expected `'native parallel speed advantage'` _(literal)_
    - :939 `toContainText` expected `'single-threaded JavaScript'` _(literal)_
    - :940 `toContainText` expected `'native parallel speed advantage'` _(literal)_
    - :941 `toContainText` expected `'single-threaded'` _(literal)_
    - :943 `toContainText` expected `'not infer a universal speed ranking'` _(literal)_
    - :944 `toContainText` expected `'native parallel speed advantage'` _(literal)_
- `the sponge diagram divides its state in the ratio it prints` — e2e/claims.spec.ts:954
    - :971 `expect` expected _no expected value_ _(none)_
    - :972 `expect` expected _no expected value_ _(none)_
- `Padding info` — e2e/claims.spec.ts:980
- `shows the real SHA-256 padded block and a 1600-bit sponge split` — e2e/claims.spec.ts:981
    - :986 `toBeVisible` expected _no expected value_ _(none)_
    - :994 `toBe` expected `0` _(literal)_
    - :995 `toBe` expected `true` _(expression)_
    - :996 `toBe` expected `'80'` _(literal)_
    - :997 `toBe` expected `(BigInt(bytes.length) * 8n).toString(16).padStart(16, '0')` _(expression)_
    - :999 `toMatch` expected `/^0*$/` _(regex)_
    - :1005 `toBe` expected `1088` _(literal)_
    - :1006 `toBe` expected `512` _(literal)_
    - :1007 `toBe` expected `1600` _(literal)_
    - :1010 `toBeHidden` expected _no expected value_ _(none)_
- `the padded block of an empty message is one full 512-bit block` — e2e/claims.spec.ts:1013
    - :1018 `toBe` expected `'80'.padEnd(128, '0')` _(expression)_
    - :1019 `expect` expected _no expected value_ _(none)_
- `the block count in the heading is the number of blocks in the hex` — e2e/claims.spec.ts:1029
    - :1035 `toBe` expected `blocks` _(expression)_
    - :1036 `expect` expected _no expected value_ _(none)_
- `Info panel` — e2e/claims.spec.ts:1046
- `each tab reveals exactly its own panel, by click and by keyboard` — e2e/claims.spec.ts:1047
    - :1057 `toHaveCount` expected `1` _(literal)_
    - :1058 `toHaveAttribute` expected `'id', panel` _(expression)_
    - :1059 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :1060 `toHaveCount` expected `1` _(literal)_
    - :1065 `toHaveAttribute` expected `'id', 'panel-sponge'` _(expression)_
    - :1067 `toHaveAttribute` expected `'id', 'panel-choose'` _(expression)_
    - :1069 `toHaveAttribute` expected `'id', 'panel-md'` _(expression)_
    - :1071 `toHaveAttribute` expected `'id', 'panel-choose'` _(expression)_
- `the sponge panel states the rate/capacity split the padding modal computes` — e2e/claims.spec.ts:1074
    - :1079 `toContainText` expected `'1088'` _(literal)_
    - :1080 `toContainText` expected `'512'` _(literal)_
    - :1103 `toBe` expected `expected.padded` _(expression)_
    - :1104 `toBe` expected `expected.blocks[i][name]` _(expression)_
- `DM compression wires real AES through XOR and rejects malformed block inputs` — e2e/claims.spec.ts:1107
    - :1109 `toBe` expected `oracleAES(k,x)` _(expression)_
    - :1110 `toBe` expected `k` _(expression)_
    - :1111 `toContainText` expected `'received 18'` _(literal)_
    - :1112 `toContainText` expected `'position 3'` _(literal)_
- `DM free-start inverse attack recomputes both modes and the zero-input exception` — e2e/claims.spec.ts:1115
    - :1116 `toBeChecked` expected _no expected value_ _(none)_
    - :1120 `toBe` expected `oracleAES(k,target,true)` _(expression)_
    - :1122 `toContainText` expected `'BROKEN VARIANT'` _(literal)_
    - :1124 `toBe` expected `await dmValue(out,'target')` _(expression)_
    - :1125 `toBe` expected `'0'.repeat(32)` _(expression)_
- `DM fixed point is independently decrypted from zero and displayed neutrally` — e2e/claims.spec.ts:1128
    - :1130 `toBe` expected `oracleAES(k,'0'.repeat(32),true)` _(expression)_
- `DM padding chains every actual AES block and negative collision claim independently` — e2e/claims.spec.ts:1133
    - :1134 `toBeChecked` expected _no expected value_ _(none)_
    - :1138 `toBe` expected `a.digest` _(expression)_
    - :1140 `toEqual` expected `Array.from({length:16},(_,i)=>String(a.digest.slice(i*2,i*2+2)===b.digest.slice(i*2,i*2+2)))` _(expression)_
    - :1141 `toContainText` expected `'EVERY BLOCK CORRECT — AND COLLIDING'` _(literal)_
    - :1142 `toBe` expected `b.padded.slice(-32)` _(expression)_
    - :1143 `toContainText` expected `'block-aligned'` _(literal)_
- `DM chosen-IV repeated-block experiment independently verifies all six chains` — e2e/claims.spec.ts:1147
    - :1148 `toBe` expected `oracleAES(k,'0'.repeat(32),true)` _(expression)_
    - :1150 `toBe` expected `expected.digest` _(expression)_
    - :1151 `toBe` expected `padding==='zero-fill'?1:3` _(expression)_
- `DM empty and byte-budget refusals retire results and no-op input preserves them` — e2e/claims.spec.ts:1155
    - :1156 `toBe` expected `before` _(expression)_
    - :1157 `toHaveCount` expected `0` _(literal)_
    - :1158 `toContainText` expected `'Empty message'` _(literal)_
    - :1159 `toContainText` expected `'received 4098'` _(literal)_
- `legacy labels, clipboard and collision guidance stay attached to MD5 and SHA-1` — e2e/claims.spec.ts:1170
    - :1175 `toHaveText` expected `'Legacy · collision-broken'` _(literal)_
    - :1176 `toHaveText` expected `nodeHash(algo, 'abc')` _(expression)_
    - :1178 `toBe` expected `nodeHash(algo, 'abc')` _(expression)_
    - :1180 `toContainText` expected `'broken collision resistance'` _(literal)_
    - :1181 `toHaveAttribute` expected `'href', 'https://systemslibrarian.github.io/crypto-lab-collision-vault/'` _(expression)_
    - :1182 `toContainText` expected `'diffusion, not security'` _(literal)_
    - :1184 `toHaveCount` expected `2` _(literal)_

**Mutation records** (2 file(s)):

- `mutation-evidence.json` (16107 bytes)
- `scripts/check-dm-mutations.mjs` (4899 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-hash-zoo

## What It Is

Hash Zoo is an interactive side-by-side comparison of six hash functions: SHA-256 (Merkle-Damgård construction via `@noble/hashes/sha2`), SHA3-256 and original Keccak-256 (sponge constructions with different suffixes via `@noble/hashes/sha3`), BLAKE3 (binary tree hash via `@noble/hashes/blake3`), and legacy MD5 and SHA-1 (Merkle-Damgård via `@noble/hashes/legacy`). It opens with a plain-language "what is a hash?" on-ramp, then computes correctly sized digests (256 bits for the first four, 128 for MD5, 160 for SHA-1), visualizes the avalanche effect — how flipping a single input bit changes roughly half the output bits — showing the flipped input bit next to the output storm, and demonstrates the flagship structural difference between constructions by performing a **real, live SHA-256 length-extension forgery** in the browser. A same-message explanation distinguishes Keccak-256 from SHA3-256, including their suffix encodings and Ethereum compatibility, and links directly to Collision Vault for MD5/SHA-1 collisions. Timing across 100 iterations and SHA-256 padding / SHA-3 rate–capacity details are available as secondary, honestly-caveated views.

Section D adds an AES-128 Davies–Meyer teaching hash using `@noble/ciphers`, with free-start preimages, fixed points, and an ambiguous-padding collision. It preserves the existing full-round hash comparison and length-extension paths.

Every digest, forged tag, and avalanche count in Sections A–C is computed in-browser from the real `@noble/hashes` primitives — no hardcoded or faked output. The length-extension forgery is proven at runtime by recomputing SHA-256 over the reconstructed message from scratch and asserting equality.

## Exhibits

1. **Start here — What is a hash?** A one-input / one-output live example with the three defining rules (deterministic, fixed-size, one-way/unpredictable). Defines a hash before comparing hashes.
2. **Section A — Hash Comparison.** SHA-256, SHA3-256, Keccak-256, and BLAKE3 side-by-side: 256-bit digests, output size, internal state, and construction, with plain-language annotations. Indicative timing is tucked behind a "show timing" toggle (see the caveat below).
3. **Section B — Avalanche Effect.** Flip one input bit (shown highlighted in an input-bit strip) and watch ~50% of the 256 output bits flip. A per-byte heatmap encodes how many bits changed in each output byte (uniform diffusion), and a "flip every bit" sweep plots the distribution of output-diff percentages, showing ~50% is a statistical law, not one lucky result.
4. **Section C — Construction Comparison + length extension.** Merkle-Damgård, sponge, and tree diagrams, plus an interactive length-extension forgery: from a published SHA-256 tag and its length alone (never the secret bytes), append attacker data and produce a valid extended tag — then see it verified against a from-scratch recompute. Contrasts with the sponge's withheld capacity lane.
5. **Section D — A hash from a block cipher.** Wire a real AES block through feed-forward XOR, remove the wire to get a free-start preimage in one decryption, compute a fixed point, and compare zero-fill with length-delimited padding. Inspect every AES block of both message chains; a separate chosen-IV experiment repeats the fixed point. This 128-bit-state teaching hash is not for use.
6. **Info Panel.** Tabbed construction notes with inline jargon glossaries (IV, chaining value, rate/capacity, sponge, XOF, SIMD) and "Advanced" disclosures gating Davies-Meyer and Keccak-f[1600], plus guidance on choosing a hash function.

## When to Use It

- **Learning hash function internals.** The avalanche grid and construction diagrams make abstract concepts like sponge absorption and tree-parallel hashing concrete.
- **Comparing performance characteristics.** The timed hash table shows a rough, indicative feel for the relative cost of SHA-256, SHA3-256, Keccak-256, and BLAKE3 on identical input in the browser. It is *not* a benchmark — see the timing caveat below.
- **Understanding construction trade-offs.** Side-by-side architecture diagrams clarify why SHA-3 resists length extension while bare Merkle-Damgård does not.
- **Teaching or presenting cryptography.** The live controls (message textarea, bit-position slider) make this suitable for classroom or conference demos.
- **Not for password hashing.** None of these hash functions are memory-hard; use Argon2id or similar KDFs for password storage.
- Do NOT use this as a crypto library — it is a browser teaching demo for comparing hash constructions.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-hash-zoo](https://systemslibrarian.github.io/crypto-lab-hash-zoo/)**

Start with the "what is a hash?" box and type to watch a live fingerprint. Type or paste any message into the Section A textarea and click "Hash All Six" to see hex output and construction metadata for all six algorithms (timing lives behind the "show indicative timing" toggle). Use the bit-position slider in Section B to flip a single bit — the flipped input bit is highlighted in an input strip beside the avalanche grids (128, 160, or 256 cells) — then run the "flip every bit" sweep to see the ~50% distribution. In Section C, run the length-extension forgery to watch a valid extended SHA-256 tag appear from a published tag alone. Click "Padding info" to inspect the SHA-256 padded block and SHA-3 rate/capacity split.

## About the Timings (read before comparing speeds)

The "Time (avg µs)" row is an in-browser average over 100 iterations. It is deliberately labelled *indicative only*, both here and in the app, because single-digit-microsecond measurements taken with `performance.now()` in a JS engine are dominated by noise: JIT warmup, garbage-collection pauses, CPU frequency scaling, and background tab activity all move the numbers around. Do not read the ordering as a definitive speed ranking — on tiny inputs the measurements can approach clock granularity and be dominated by noise. BLAKE3's real speed advantage shows up on large inputs with SIMD and multithreading, which a single-threaded browser loop cannot exercise. For a real comparison, benchmark native builds (for example `b3sum` vs `openssl dgst`) on megabyte-scale inputs. The digests themselves are exact and verified against known-answer test vectors (see below).

## Keccak-256 versus SHA3-256

Both use Keccak-f[1600] with 24 rounds, a 1088-bit rate, a 512-bit capacity, and a 256-bit digest. SHA3-256 adds the SHA-3 domain-separation suffix before padding. For byte-aligned input, the combined suffix/padding encodings are `0x06` for SHA3-256 and `0x01` for original Keccak-256. They give different digests and must not be substituted for each other. The encodings are handled by the primitives; users should not append these bytes to the message themselves.

Enter `abc`, then clear the input, to compare both functions in Section A. Keccak-256 also participates in the avalanche cards, every-bit sweep, indicative timing, and copy controls. MD5 and SHA-1 now participate in all of those comparisons too, clearly labelled **legacy · collision-broken**. Their bit grids and percentages use the real digest lengths, not padded 256-bit outputs. A near-50% avalanche pattern measures diffusion, not security. [Collision Vault](https://systemslibrarian.github.io/crypto-lab-collision-vault/) demonstrates their broken collision resistance with published pairs. They are historical teaching examples, not choices for new signatures or adversarial integrity checks.

Legacy sources: [RFC 6151 (MD5 security)](https://www.rfc-editor.org/rfc/rfc6151) and [the first published SHA-1 collision](https://security.googleblog.com/2017/02/announcing-first-sha1-collision.html).

Sources: [Keccak Team specification summary](https://keccak.team/keccak_specs_summary.html) and [Ethereum's Merkle Patricia trie documentation](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/).

## What Can Go Wrong

- **A block cipher without feed-forward is invertible.** A free-start adversary can choose a chaining input by one AES decryption. With XOR, that shortcut is not a general inversion method; the all-zero input is an explicitly shown exception.
- **Ambiguous padding.** Correct AES calls and correct compression steps cannot rescue zero-fill padding: a non-aligned message and the same message followed by a zero byte have identical padded bytes. The length-delimited default separates this pair.

- **Length extension on bare SHA-256.** Merkle-Damgård hashes expose their internal state as the final digest, allowing an attacker to append data and compute a valid hash without knowing the original message. For message authentication, use a specified keyed construction such as HMAC-SHA256, KMAC, or BLAKE3 keyed mode, and verify the tag before acting on the message. Switching to a plain unkeyed SHA-3 or BLAKE3 digest does not authenticate a sender; resistance to this length-extension attack alone does not establish MAC security.
- **Confusing hash speed with password safety.** SHA-256, SHA3-256, Keccak-256, and BLAKE3 are all fast hashes — unsuitable for password storage because an attacker can brute-force billions of guesses per second.
- **Assuming SHA-256 and SHA3-256 are interchangeable.** Despite both producing 256-bit output, their constructions differ fundamentally. Code expecting Merkle-Damgård padding semantics will break if swapped to a sponge hash.
- **Ignoring BLAKE3's tree structure in streaming contexts.** BLAKE3 digests depend on chunk boundaries; streaming implementations must track the tree state correctly or produce wrong hashes.
- **Timing side channels in comparison logic.** Comparing hash digests with early-exit equality checks can leak information about which bytes match; use constant-time comparison in security-critical code.

## Real-World Usage

- **Bitcoin and cryptocurrency.** Bitcoin uses double-SHA-256 for block headers and transaction IDs, relying on Merkle-Damgård's collision resistance.
- **NIST standards and TLS.** SHA-256 is mandated in TLS 1.3 certificate signatures, DNSSEC, and many federal compliance frameworks (FIPS 180-4).
- **Ethereum 2.0 consensus.** The beacon chain uses SHA-256 for its Merkle tree commitments in the proof-of-stake protocol.
- **NIST SHA-3 standard (FIPS 202).** SHA3-256 is standardized as a structural alternative to SHA-2, adopted in protocols requiring sponge-based security guarantees.
- **BLAKE3 file integrity.** The `b3sum` tool and Bao verified streaming use BLAKE3 for fast, parallelizable file checksums and integrity verification.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-hash-zoo
cd crypto-lab-hash-zoo
npm install
npm run dev
`​``

## Tests

The hash wiring is covered by unit tests (Vitest) so a mislabelled or swapped algorithm cannot ship silently:

`​``bash
npm test        # known-answer vectors + property/round-trip tests
npm run test:e2e    # Playwright: rendered-claim gate + axe-core accessibility gate
`​``

`src/hasher.test.ts` asserts:

- **Known-answer vectors.** SHA-256, SHA3-256, and BLAKE3 digests of `""` and `"abc"` are checked against the published standard vectors (FIPS 180-4, FIPS 202, BLAKE3 reference). Swapping a source import (for example `sha3` → `sha256`) fails these tests immediately.
- **Keccak-256 independent vectors.** Ten fixed values in `src/fixtures/keccak-vectors.json`, computed with PyCryptodome 4.2.0 (`Crypto.Hash.keccak.new(digest_bits=256, data=message.encode("utf-8")).hexdigest()`), cover empty input, `abc`, the default message, Unicode, and 135/136/137/271/272/273-byte inputs around the 136-byte sponge rate. Both unit and browser tests check these values; a swapped SHA3-256 implementation fails them. Browser checks also verify the Keccak-labelled copy button and an independently computed avalanche count. PyCryptodome is an offline fixture source, not a runtime dependency.
- **Legacy MD5/SHA-1 accuracy.** Published empty/`abc` vectors, independent OpenSSL checks across UTF-8 and 55/56/63/64/65/119/120-byte padding boundaries, and exact independent bit maps and sweep percentages for every input bit. Browser tests check both output sizes, copy controls, legacy labels, and the collision link.
- **Distinctness.** The six algorithms produce different digests for the same input.
- **Avalanche ~50%.** Averaged over many single-bit input flips, each algorithm changes close to half of each algorithm's output bits (128, 160, or 256) (asserted within 42–58%). The every-bit distribution sweep is asserted the same way, with bucket counts summing to the number of flips.
- **Length-extension forgery is real.** `lengthExtend` resumes SHA-256 from a published digest, appends attacker data, and the test asserts the forged tag equals `SHA-256(secret ‖ glue ‖ append)` recomputed from scratch — for several secrets and an empty append — so the demo cannot ship a faked forgery. `sha256GluePadding` is checked for the `0x80` marker, block alignment, and big-endian length tail.
- **Pure-function correctness.** `popcount` over all 256 byte values, `flipBit` (exactly one bit changed, input not mutated, MSB-first, range/empty guards), `diffBitmap` (bit locations and counts), and `paddingInfo` (SHA-256 Merkle–Damgård `0x80` marker, 512-bit block alignment, big-endian length tail; SHA-3 rate+capacity = 1600).

The unit suite proves the *functions* are right; `e2e/claims.spec.ts` (Playwright, real Chromium
against the built bundle) proves the *page* is right, so a correct hasher rendered into a wrong
verdict cannot ship either. It asserts:

- **The digests on screen are the real digests.** SHA-256 and SHA3-256 are checked against Node's
  OpenSSL bindings — an oracle independent of `@noble` — and BLAKE3 against the published reference
  vectors, plus determinism, fixed per-algorithm output lengths for a 1-character and a 20,000-character message,
  and that one edited character moves all six.
- **Every counter is internally consistent.** For each avalanche card the `N/total bits (P%)` headline
  must equal the number of `changed` cells actually drawn, the 16, 20, or 32 per-byte heatmap values must sum
  back to `N`, the meter width must be `P`, and the exact `N` is cross-checked against a
  bit-difference computed in the test. The every-bit sweep's 20 histogram buckets must sum to the
  number of flips it claims to have run.
- **The forgery is a real forgery.** The forged tag must equal SHA-256 of `secret ‖ glue ‖ append`
  recomputed in the test — for the default secret, an empty append, and secret lengths that straddle
  the 56/64-byte padding boundary — and the glue padding is checked for its `0x80` marker, block
  alignment and big-endian length tail.
- **Every failure path reaches its failure state and says why.** Empty message (controls disabled,
  avalanche and sweep refuse with an explanation), empty secret (forgery refuses), a rejected
  clipboard write, and attacker-supplied HTML in the append field being escaped rather than executed.
  Each also asserts the live-region announcement matches what is on screen.

`npm test` runs only the Vitest unit suite; the Playwright suite in `e2e/` is excluded from it and
run separately via `npm run test:e2e` (`npm run test:a11y` is the same command, kept as an alias).

Section D adds 11 unit tests, including all four AES-128 ECB blocks
from NIST SP 800-38A F.1.1/F.1.2 in both directions and the complete 64-byte
example. There is no claimed published AES-based Davies–Meyer hash vector.
Randomized properties and both MD padding chains are checked against Node’s
independent OpenSSL AES; tests cover 1,025 padding lengths and the zero-input
feed-forward exception. `@types/node` is a development-only dependency for
those independent test oracles.

Six new browser claims independently recompute every displayed AES block,
compression, preimage, fixed point, hash pair and chosen-IV chain with OpenSSL.
The negative fixture has correct AES calls and equal digests alongside the
visible warning that a sound block cipher cannot fix ambiguous padding.
`npm run test:mutations:dm` exercises concrete source faults, changed bundle
hashes, named zero-retry failures and exact restored artifacts. The runner
refuses to count stale served scripts as mutation kills.

The new section is included in the complete accessibility walks, with an
additional 320px state walk. No header, theme, footer, existing hash primitive,
length-extension code or reduced-round research exhibit is changed.

Sources: [NIST SP 800-38A, Appendix F](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38a.pdf);
[FIPS 180-4 §6.2.2](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf);
Katz–Lindell, third edition, §6.2 Construction 6.3 and §7.3.1;
[Kelsey–Schneier, EUROCRYPT 2005](https://www.schneier.com/academic/archives/2005/01/second_preimages_on.html)
for expandable messages only (the long-message attack is not executed here).
The glossary now distinguishes SHA-256’s word-wise addition from this XOR.

## Related Demos

- [crypto-lab-babel-hash](https://systemslibrarian.github.io/crypto-lab-babel-hash/) — SHA-256, SHA3-256, BLAKE3, and HMAC in one comparison.
- [crypto-lab-merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) — Merkle trees and inclusion proofs built on SHA-256.
- [crypto-lab-collision-vault](https://systemslibrarian.github.io/crypto-lab-collision-vault/) — MD5/SHA-1 collisions and what breaks when collision resistance fails.
- [crypto-lab-mac-race](https://systemslibrarian.github.io/crypto-lab-mac-race/) — HMAC, CMAC, Poly1305, and GHASH message authentication.
- [crypto-lab-kdf-chain](https://systemslibrarian.github.io/crypto-lab-kdf-chain/) — HKDF, PBKDF2, scrypt, and Argon2id, the memory-hard KDFs hashes should not replace.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Reduced-round research context

The live demo links [2026/232](https://eprint.iacr.org/2026/232) and [2026/1120](https://eprint.iacr.org/2026/1120), distinguishes reported reduced-round results from standard full-round SHA-2, and identifies the September result as a preprint. This lab does not verify the pair itself; the linked Collision Vault exhibit now provides that execution under explicit conventions.

The supplied 36-step SHA-256 Table 2 pair is now verified in [Collision Vault](https://systemslibrarian.github.io/crypto-lab-collision-vault/#sha2-pair-verifier), with exact IV/step/padding conventions, mutation controls and full SHA-256 contrast. This lab still computes its own full-round hashes and does not execute the paper attack.

```

</details>

---

## World Hashes

- **slug**: `crypto-lab-world-hashes`
- **repo**: https://github.com/systemslibrarian/crypto-lab-world-hashes
- **live**: https://systemslibrarian.github.io/crypto-lab-world-hashes/
- **commit_sha**: `ea511bf568c7a07a4a724a57b561bec9562a3a23` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS  ·  **level**: beginner  ·  **--accent**: #6ecfff
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: World Hashes  — _read from src/main.ts_

**Subtitle**: SM3 · Streebog · Kupyna · Bash · LSH · SHA-256 · SHA-3  — _read from src/main.ts_

**Description**: Hash the same input with five national standards and the SHA anchors side by side, and watch the avalanche effect flip half the output bits from a one-bit change.  — _read from src/main.ts_

**Why it matters**: SHA-256 and SHA-3 dominate globally, yet China, Russia, Ukraine, Belarus, and South Korea mandate their own hashes for regulated systems. Knowing them is what lets you build, audit, or interoperate across sovereign compliance regimes.  — _read from src/main.ts_

**Card copy**: SM3 (China), Streebog (Russia), and Kupyna (Ukraine) alongside SHA-256 and SHA-3. Five-way simultaneous hashing, avalanche analysis, and cryptographic sovereignty context.

**Chips**: SM3 · Streebog · Kupyna · SHA-256

**Implements**: HMAC `src/length-extension.ts:507`, Kupyna `src/main.ts:248`, SHA-256 `src/length-extension.ts:70`, SHA-3 `src/main.ts:244`, SHA-512 `src/main.ts:243`, SM3 `src/length-extension.ts:118`, Streebog `src/main.ts:246`

**Attacks shown**: Birthday bound `src/collision-search.ts:180`, Brute force `src/main.ts:519`, Length extension `src/length-extension.ts:303`

**Comment-only (named in code comments, not executed)**: Pairing `src/bash.ts:84`

**References**: AES, BLAKE3, CMAC, Camellia, GHASH, Keccak, Kuznyechik, Merkle tree, Poly1305, SM2

**Standards body**: DSTU, IETF, ISO, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `FIPS 180-4` — first seen README.md:36 (14×)
- `FIPS 202` — first seen README.md:61 (8×)
- `ISO/IEC 10118-3` — first seen src/main.ts:761 (1×)
- `RFC 6986` — first seen src/hashes.ts:121 (2×)

**README — What Can Go Wrong**:

```text
- Using a narrow-pipe Merkle–Damgård hash (SM3, SHA-256) directly as a MAC is vulnerable to length-extension; wrap it in HMAC instead. Exhibit 5 runs that forgery live rather than describing it. The others avoid it for different reasons — Streebog through its length/checksum finalization, Kupyna and LSH through a wide state folded down before output, SHA-3 and Bash because a sponge never hands out its state at all — but HMAC remains the portable choice, and length-extension immunity is not on its own MAC security.
- Streebog and Kuznyechik share S-box transparency concerns, so deploying Streebog outside its compliance mandate inherits an unresolved design-trust question.
- Bash's risk today is ecosystem, not design: the npm implementation this lab started from fails 7 of the 11 vectors in the standard's own Annex A, and does so *silently* — it agrees with the standard on anything shorter than one sponge block. A conformance suite that only tests short messages will not catch it. Test against Annex A across a rate boundary before trusting any Bash implementation.
- LSH has the same shape of risk, one step further along: there is no JavaScript implementation of it at all (every npm package named `lsh` is locality-sensitive hashing, an unrelated technique), so this lab transcribes it from the specification. That makes *transcription* the failure mode rather than someone else's bug. [`src/lsh.ts`](src/lsh.ts) therefore separates its vectors by provenance and reports them as two numbers, not one: **independent** digests published by someone other than the implementation it was transcribed from (Korea's algorithm-validation vectors — read from [`RyuaNerin/go-krypto`](https://github.com/RyuaNerin/go-krypto) `lsh256/testcases_{224,256}_test.go` at commit `478a2e9a667e15f6fa42bc4457cf7e2e5798d6b7`, pinned by blob hash in [`src/lsh.ts`](src/lsh.ts) so the citation stays checkable after the repo moves — and the `"abc"` digest from Wikipedia), covering the empty message, exactly one block and past one block for both widths; and **cross-implementation** digests from Crypto++, whose own file header records that Crypto++ generated them. The second kind shows this lab and Crypto++ agree — not that either matches KS X 3262, which this lab has not read.
- Reaching for a national hash outside its regulatory requirement trades SHA-2/SHA-3 scrutiny and tooling for weaker ecosystem support with no security gain.
- Collision and second-preimage resistance are assumptions, not guarantees; truncating a digest or misusing it for password storage (no salt/KDF) undermines the intended security.
- Mismatched variants (e.g. confusing the 256-bit and 512-bit outputs, or differing byte/endianness conventions between standards) break interoperability between implementations.
```

**Claims tested** (e2e/claims.spec.ts, 6 test(s)):

- `Kupyna is presented as wide-pipe chaining and contrasted with the sponges` — e2e/claims.spec.ts:12
    - :19 `toContainText` expected `'wide-pipe Merkle–Damgård'` _(literal)_
    - :20 `toContainText` expected `'It is not a sponge'` _(literal)_
    - :21 `toContainText` expected `'SHA-3 and Bash are the sponges in this comparison'` _(literal)_
    - :22 `expect` expected _no expected value_ _(none)_
    - :28 `toContainText` expected `'SHA-3 and Bash are the two'` _(literal)_
    - :32 `toContainText` expected `'only sponge'` _(literal)_
- `Bash is hashed live, and its KAT row is sourced to the clause it comes from` — e2e/claims.spec.ts:35
    - :44 `toBe` expected `Number(total)` _(expression)_
    - :48 `toHaveCount` expected `Number(total)` _(expression)_
    - :49 `toHaveCount` expected `Number(passed)` _(expression)_
    - :50 `toHaveCount` expected `0` _(literal)_
    - :55 `toHaveCount` expected `1` _(literal)_
    - :56 `toContainText` expected `'STB 34.101.77 §A.3.1'` _(literal)_
    - :57 `toBeVisible` expected _no expected value_ _(none)_
    - :62 `toBeVisible` expected _no expected value_ _(none)_
    - :63 `toHaveCount` expected `0` _(literal)_
    - :66 `toBe` expected `Number(vectors)` _(expression)_
    - :68 `toBe` expected `12` _(literal)_
    - :73 `toHaveText` expected `/^[0-9a-f]{64}$/` _(regex)_
- `LSH is hashed live, and its hand-rolled maths is pinned to two sources` — e2e/claims.spec.ts:76
    - :87 `toHaveCount` expected `1` _(literal)_
    - :88 `toContainText` expected `'Wikipedia "LSH (hash function)" reference digest'` _(literal)_
    - :89 `toContainText` expected `'KS X 3262 not consulted directly'` _(literal)_
    - :90 `toBeVisible` expected _no expected value_ _(none)_
    - :97 `toBeVisible` expected _no expected value_ _(none)_
    - :98 `toHaveCount` expected `0` _(literal)_
    - :102 `expect` expected _no expected value_ _(none)_
    - :103 `expect` expected _no expected value_ _(none)_
    - :105 `toMatch` expected `/\d+\/\d+ published LSH vectors/` _(regex)_
    - :110 `toContainText` expected `'no npm implementation at all'` _(literal)_
    - :111 `toContainText` expected `'they are not worth the same', { ignoreCase: true }` _(expression)_
    - :112 `toContainText` expected `'a document this lab has not read'` _(literal)_
    - :116 `toBeVisible` expected _no expected value_ _(none)_
    - :117 `toContainText` expected `'testcases_{224,256}_test.go'` _(literal)_
    - :118 `toContainText` expected `/\b[0-9a-f]{7,40}\b/` _(regex)_
    - :119 `toContainText` expected `'corroborate rather than repeat each other'` _(literal)_
    - :124 `toHaveText` expected `/^[0-9a-f]{64}$/` _(regex)_
- `the Bash trust grade is for the algorithm, with the tooling defect kept on record` — e2e/claims.spec.ts:127
    - :136 `toBeVisible` expected _no expected value_ _(none)_
    - :140 `toBe` expected `'High'` _(literal)_
    - :147 `toHaveCount` expected `1` _(literal)_
    - :149 `toBe` expected `cellGrade` _(expression)_
    - :152 `toContainText` expected `'This grade is for the algorithm'` _(literal)_
    - :153 `toContainText` expected `'Tooling caveat, counted separately'` _(literal)_
    - :158 `toContainText` expected `'@li0ard/bash'` _(literal)_
    - :159 `toContainText` expected `'7 of the 11'` _(literal)_
    - :160 `toContainText` expected `'Annex A'` _(literal)_
    - :161 `toContainText` expected `'security level in bits with the digest length in bytes'` _(literal)_
    - :162 `toContainText` expected `'wrong rate'` _(literal)_
    - :163 `toContainText` expected `'XORs each block into the state where the standard overwrites'` _(literal)_
    - :164 `toContainText` expected `'src/bash.ts'` _(literal)_
    - :168 `toBeVisible` expected _no expected value_ _(none)_
    - :169 `toHaveCount` expected `0` _(literal)_
- `negative claim: Bash has no length-extension defence, and needs none` — e2e/claims.spec.ts:186
    - :191 `toHaveCount` expected `0` _(literal)_
    - :195 `toHaveAttribute` expected _no expected value_ _(none)_
    - :201 `toBeVisible` expected _no expected value_ _(none)_
    - :206 `toHaveCount` expected `6` _(literal)_
    - :207 `expect` expected _no expected value_ _(none)_
    - :210 `toHaveCount` expected `0` _(literal)_
    - :211 `toHaveCount` expected `0` _(literal)_
    - :214 `toHaveAttribute` expected _no expected value_ _(none)_
    - :221 `toBeVisible` expected _no expected value_ _(none)_
    - :222 `toHaveAttribute` expected `'data-negative-claim', 'no-countermeasure'` _(expression)_
    - :223 `toContainText` expected `'no length-extension countermeasure at all'` _(literal)_
    - :224 `toContainText` expected `'what that absence does not buy is authentication', {` _(expression)_
    - :227 `toContainText` expected `'no entry point'` _(literal)_
    - :238 `toBe` expected `immuneState - 256` _(expression)_
    - :239 `toBe` expected `forgeableState - 256` _(expression)_
    - :242 `toBe` expected `0` _(literal)_
    - :243 `expect` expected _no expected value_ _(none)_
    - :252 `toBe` expected `immuneWithheld` _(expression)_
    - :256 `toHaveAttribute` expected _no expected value_ _(none)_
- `the negative claim is retired when the inputs that produced it change` — e2e/claims.spec.ts:263
    - :267 `toBeVisible` expected _no expected value_ _(none)_
    - :271 `toHaveCount` expected `0` _(literal)_
    - :272 `toHaveCount` expected `0` _(literal)_
    - :276 `toBeVisible` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-world-hashes

## What It Is

World Hashes demonstrates five national cryptographic hash standards — SM3 (China, OSCCA, 2010), Streebog (Russia, FSB, 2012), Kupyna (Ukraine, 2014), Bash (Belarus, STB 34.101.77, 2016), and LSH (South Korea, KS X 3262, 2014) — alongside SHA-256 and SHA-3 as reference anchors. Each national hash was developed for cryptographic sovereignty: to reduce dependence on U.S.-designed primitives for government and regulated-industry use. The security model is collision-resistant one-way function: given a hash output, finding the input or a second input with the same hash must be computationally infeasible.

The page opens with a **ground-floor "what is a cryptographic hash?" panel** that defines the four properties — deterministic, fixed-length, one-way, collision-resistant — and demonstrates them live (type anything and watch the digest stay 256 bits while a single extra character scrambles it). Every construction term (Merkle–Damgård, sponge, wide-pipe, S-box, Miyaguchi–Preneel, Keccak-f[1600], length-extension) is glossed inline on hover/focus, and a "Constructions 101" note contrasts block-chaining (SM3, SHA-256, and the wide-pipe variants Streebog and Kupyna) against absorb-and-squeeze (SHA-3 and Bash) so a newcomer can follow the rest.

## When to Use It

- SM3: Required for Chinese PKI, Chinese TLS (TLCP), and products under Chinese Cryptography Law — pairs with SM2 signatures.
- Streebog-256/512: Required for Russian GOST R 34.11-2012 compliance — pairs with GOST elliptic curve signatures.
- Kupyna-256/512: Required for Ukrainian DSTU 7564:2014 compliance.
- Bash-256/384/512: Required for Belarusian STB 34.101.77 compliance.
- LSH-256-224/256: Required for Korean KS X 3262 compliance (the LSH-512 family is out of scope here).
- SHA-256: General-purpose default for all other use cases.
- SHA-3: Preferred for new protocol designs or when sponge security matters.
- Do not use Streebog outside Russian compliance requirements — shared S-box transparency concerns with Kuznyechik apply.
- Do NOT reach for Bash from npm without checking it against STB 34.101.77 Annex A yourself. The package this lab depends on, `@li0ard/bash`, ships a correct `bash-f` permutation wrapped in a sponge that miscomputes the rate; it fails 7 of the standard's 11 hash vectors, and agrees on every message shorter than one block — which is why its own suite is green. This lab therefore implements the sponge in [`src/bash.ts`](src/bash.ts) and pins all eleven vectors.
- Do not use any of these as a MAC without HMAC wrapping — Exhibit 5 forges a `H(secret ‖ message)` tag for SM3 and SHA-256 in front of you, and shows HMAC holding against the same attempt.
- Do NOT treat this as a production crypto library — it is a teaching demo for comparing national hash standards, not a hardened deployment.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-world-hashes](https://systemslibrarian.github.io/crypto-lab-world-hashes/)**

A ground-floor intro panel plus six exhibits:

0. **What is a cryptographic hash?** — the four properties in plain language, demonstrated live: type anything and watch the SHA-256 digest stay a fixed 256 bits while one extra character scrambles it; a collapsible explains one-wayness and collisions.
1. **SM3 (China)** with SHA-256 side-by-side, a labelled **Merkle–Damgård mechanism diagram** (message blocks chaining through a compression function to an exposed final state → length-extension), and a **user-driven avalanche** — click any character to flip it yourself and watch the digest re-scramble.
2. **Streebog (Russia)** with S-box controversy documentation and its wide-pipe MD construction glossed.
3. **Kupyna (Ukraine)** with geopolitical context and a **wide-pipe mechanism diagram** (blocks chained through a double-width state, truncated by a final output transformation → no length-extension). Kupyna is a Grøstl-style wide-pipe Merkle–Damgård hash, *not* a sponge.
4. **SHA-256 and SHA-3 as reference anchors** with seven-way simultaneous hashing (SHA-256, SHA-3-256, SM3, Streebog-256, Kupyna-256, Bash-256, LSH-256) and the **sponge mechanism diagram** (absorb into a wide rate/capacity state, squeeze out the digest, capacity never exposed → no length-extension). SHA-3 and **Bash (Belarus)** are the two sponges in the lab; everything else chains blocks.
5. **Break it** — the exhibits above *tell* you that narrow-pipe Merkle–Damgård hashes hand out their final chaining state, and that this exposes length-extension. This one lets you do it, and lets you fail at it:
   - **A real length-extension forgery.** A server authenticates with the naive `tag = H(secret ‖ message)` and publishes only the message and the tag. Given those plus a guess at the secret's *length*, the page appends a suffix of your choosing and produces a tag that matches, byte for byte, what the server computes for the extended message. It works against both SM3 and SHA-256. Guess the length wrong and the forgery visibly fails, and the verdict names why.
   - **Kept honest by a cross-check.** The attack needs a hash it can resume from an arbitrary state, which no library exposes, so [`src/length-extension.ts`](src/length-extension.ts) reimplements the SHA-256 and SM3 compression functions from FIPS 180-4 and GM/T 0004-2012. Those are cross-checked against the audited libraries the rest of the lab uses on every page load and on every test run — the forging routine is handed only the tag, the guessed length and the suffix, so "no secret required" is a fact about its signature rather than a claim in prose.
   - **The same attempt against the constructions that resist it.** SHA-3 and Bash (sponges), Kupyna and LSH (wide-pipe), Streebog (length + checksum finalization) and HMAC-SHA-256 all hold, and the table states for each *why the attack has no entry point at all*, alongside the measured result of the closest analogue an attacker without internal state could compute.
   - **A negative claim, backed by a fixture.** Bash carries **no** length-extension countermeasure — no length encoding, no checksum, no output transformation. Neither does SHA-256, which this same page forges. The table prints `none` in both places and puts the actual difference beside it as a measurement: how many state bits the published digest withholds (SHA-256: **0 of 256** — the digest *is* the chaining state; Bash: **1280 of 1536**). The page states plainly that a green row for Bash means the attack has no entry point, *not* that `H(secret ‖ message)` is a sound MAC. `e2e/claims.spec.ts` drives the page into that all-green state and asserts the limitation is visible in it.
   - **A real birthday collision search.** Truncate any of the eleven digests to 8–32 bits and watch a genuine search find two distinct inputs that agree on that prefix — rechecked, with the full digests shown differing. The measured hash count is compared against √(π/2·2ⁿ). Starve the budget and the verdict refuses to claim anything.
6. **Seven-way comparison table + decision tree**, with the **Trust-level column explicitly labelled editorial opinion** and each grade sourced in an expandable note (e.g. Streebog's caution cites Perrin, IACR ToSC 2019, on the shared S-box).

All hash outputs are real — no simulation. Every digest is produced in your browser by [`src/hashes.ts`](src/hashes.ts), the same module the test suite checks. Each exhibit shows a **visual avalanche diff** (changed hex nibbles highlighted, with bit-diffusion percentage against the ideal ~50%) and a live **input byte-length** readout. Nothing is sent to a server — all hashing is local.

## What Can Go Wrong

- Using a narrow-pipe Merkle–Damgård hash (SM3, SHA-256) directly as a MAC is vulnerable to length-extension; wrap it in HMAC instead. Exhibit 5 runs that forgery live rather than describing it. The others avoid it for different reasons — Streebog through its length/checksum finalization, Kupyna and LSH through a wide state folded down before output, SHA-3 and Bash because a sponge never hands out its state at all — but HMAC remains the portable choice, and length-extension immunity is not on its own MAC security.
- Streebog and Kuznyechik share S-box transparency concerns, so deploying Streebog outside its compliance mandate inherits an unresolved design-trust question.
- Bash's risk today is ecosystem, not design: the npm implementation this lab started from fails 7 of the 11 vectors in the standard's own Annex A, and does so *silently* — it agrees with the standard on anything shorter than one sponge block. A conformance suite that only tests short messages will not catch it. Test against Annex A across a rate boundary before trusting any Bash implementation.
- LSH has the same shape of risk, one step further along: there is no JavaScript implementation of it at all (every npm package named `lsh` is locality-sensitive hashing, an unrelated technique), so this lab transcribes it from the specification. That makes *transcription* the failure mode rather than someone else's bug. [`src/lsh.ts`](src/lsh.ts) therefore separates its vectors by provenance and reports them as two numbers, not one: **independent** digests published by someone other than the implementation it was transcribed from (Korea's algorithm-validation vectors — read from [`RyuaNerin/go-krypto`](https://github.com/RyuaNerin/go-krypto) `lsh256/testcases_{224,256}_test.go` at commit `478a2e9a667e15f6fa42bc4457cf7e2e5798d6b7`, pinned by blob hash in [`src/lsh.ts`](src/lsh.ts) so the citation stays checkable after the repo moves — and the `"abc"` digest from Wikipedia), covering the empty message, exactly one block and past one block for both widths; and **cross-implementation** digests from Crypto++, whose own file header records that Crypto++ generated them. The second kind shows this lab and Crypto++ agree — not that either matches KS X 3262, which this lab has not read.
- Reaching for a national hash outside its regulatory requirement trades SHA-2/SHA-3 scrutiny and tooling for weaker ecosystem support with no security gain.
- Collision and second-preimage resistance are assumptions, not guarantees; truncating a digest or misusing it for password storage (no salt/KDF) undermines the intended security.
- Mismatched variants (e.g. confusing the 256-bit and 512-bit outputs, or differing byte/endianness conventions between standards) break interoperability between implementations.

## Real-World Usage

- SM3 underpins Chinese PKI, Chinese TLS (TLCP), and products under Chinese Cryptography Law, paired with SM2 signatures.
- Streebog-256/512 is mandated for Russian GOST R 34.11-2012 compliance, paired with GOST elliptic-curve signatures.
- Kupyna-256/512 is required for Ukrainian DSTU 7564:2014 compliance.
- Bash-256/384/512 (STB 34.101.77) is Belarus's national hash, designed at the Research Institute for Applied Problems of Mathematics and Informatics, BSU, and used alongside the belt block cipher (STB 34.101.31) and bign signatures (STB 34.101.45).
- LSH-256-224/256 (KS X 3262) is South Korea's national hash, designed by Kim, Hong, Lee, Kim and Kwon and published by KISA for general-purpose software integrity. This lab implements the 32-bit LSH-256 family only; the 64-bit LSH-512 family is a separate construction and is not included.
- SHA-256 (FIPS 180-4) remains the general-purpose default across the internet, with SHA-3 (FIPS 202) preferred for new sponge-based designs.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-world-hashes
cd crypto-lab-world-hashes
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-world-ciphers](https://systemslibrarian.github.io/crypto-lab-world-ciphers/) — the encryption counterpart: Camellia, ARIA, SM4, and Kuznyechik national block ciphers.
- [crypto-lab-hash-zoo](https://systemslibrarian.github.io/crypto-lab-hash-zoo/) — SHA-256, SHA3-256, BLAKE3, and the Merkle–Damgård construction explained.
- [crypto-lab-babel-hash](https://systemslibrarian.github.io/crypto-lab-babel-hash/) — interactive SHA-256, SHA3-256, BLAKE3, and HMAC.
- [crypto-lab-mac-race](https://systemslibrarian.github.io/crypto-lab-mac-race/) — HMAC, CMAC, Poly1305, and GHASH: turning hashes into authenticators.
- [crypto-lab-merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) — Merkle trees and inclusion proofs built on a hash function.

## Verified Correctness

The hero shows a live self-test badge (e.g. `✓ 19/19 test vectors verified`). On every page load the app recomputes published **known-answer test vectors** and compares them byte-for-byte against published values. Where a vector appears in the algorithm's defining standard the table says so; the `"…lazy dog"` vectors are widely published reference values rather than standard vectors, and each entry carries its own provenance label in [`src/hashes.ts`](src/hashes.ts):

| Algorithm | Standard | Vectors |
| --- | --- | --- |
| SM3 | GM/T 0004-2012 | empty, `"abc"` |
| SHA-256 / SHA-512 | FIPS 180-4 | empty, `"abc"`, fox |
| SHA-3-256 / SHA-3-512 | FIPS 202 | empty, `"abc"` |
| Streebog-256 / -512 | GOST R 34.11-2012 | empty, fox |
| Kupyna-256 / -512 | DSTU 7564:2014 | empty, fox |
| Bash-256 | STB 34.101.77 §A.3.1 | empty |
| LSH-256 | Wikipedia "LSH (hash function)" reference digest — KS X 3262 not consulted | `"abc"` |

The same vectors run in CI via [Vitest](https://vitest.dev/) on every push, alongside a happy-dom render test that asserts the UI mounts and reports all vectors passing, and an [axe-core](https://github.com/dequelabs/axe-core) accessibility scan.

`​``bash
npm test         # known-answer + render + accessibility tests
npm run test:watch
npm run typecheck
`​``

## Accessibility

The lab is built to WCAG 2.1 AA: semantic landmarks and a skip link, the full ARIA tab pattern with arrow/Home/End keyboard navigation, visible focus rings, focus and caret preserved across re-renders, `scope`-annotated data tables, `prefers-reduced-motion` support, and a `<noscript>` fallback. Avalanche highlights carry three independent cues (colour, background, underline) so they never rely on colour alone, and colour contrast meets AA in both themes.

`npm test` runs an automated axe-core scan (WCAG 2 A/AA) against the rendered app in both themes on every push. Layout-dependent colour-contrast is verified separately, since a headless DOM has no rendering engine.

## GitHub Pages Setup

This project is configured for automatic Pages deploy from GitHub Actions.

1. Push this repo to GitHub on the `main` branch.
2. In GitHub: `Settings -> Pages -> Build and deployment`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main` (or run the `Deploy to GitHub Pages` workflow manually).

Manual deploy is also available:

`​``bash
npm run deploy
`​``

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## KDF Arena

- **slug**: `crypto-lab-kdf-arena`
- **repo**: https://github.com/systemslibrarian/crypto-lab-kdf-arena
- **live**: https://systemslibrarian.github.io/crypto-lab-kdf-arena/
- **commit_sha**: `04c4849c1dde48f88d21cc4325c52a89ea6011d3` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `c129f9b5f5e3af3f9f25ebc29313de297ade9293`
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS  ·  **level**: beginner  ·  **--accent**: #aa3bff
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: KDF Arena  — _read from src/main.ts_

**Subtitle**: KDFs · compute- vs memory-hardness  — _read from src/main.ts_

**Description**: Races PBKDF2, scrypt, Argon2id, and HKDF on the same password so you can time each derivation and watch compute-hard, memory-hard, and extract-and-expand designs behave differently.  — _read from src/main.ts_

**Why it matters**: Password storage needs both a suitable KDF and a sound record design. Memory-hard scrypt and Argon2id make full evaluations costly, but a leaked password or cheap hash can let an attacker bypass that work. HKDF has no password slow-down knob.  — _read from src/main.ts_

**Card copy**: Compare HKDF, PBKDF2, scrypt, and Argon2id timing and nominal memory. Run a synthetic password-record exercise to see how plaintext or a cheap hash can bypass an expensive derivation.

**Chips**: HKDF · PBKDF2 · scrypt · Argon2id

**Implements**: Argon2 `src/bench.ts:132`, HKDF `src/bench.ts:86`, PBKDF2 `src/bench.ts:101`, scrypt `src/bench.ts:114`, SHA-256 `src/record-design.ts:73`

**Attacks shown**: Brute force `README.md:58`

**References**: ChaCha20, ChaCha20-Poly1305, HMAC, HMAC-DRBG, Poly1305, SHA-1, TLS 1.3, bcrypt

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `ePrint 2026/018` — first seen README.md:39 (2×)
- `eprint.iacr.org/2026/018` — first seen README.md:39 (2×)
- `NIST SP 800-132` — first seen README.md:58 (3×)
- `RFC 5869` — first seen README.md:92 (1×)
- `RFC 7914` — first seen README.md:67 (5×)
- `RFC 9106` — first seen README.md:60 (7×)
- `RFC 9846` — first seen README.md:69 (1×)

**Stated limitations (page)**:

- _(caveat, src/ui.ts)_ (defined, not measured)

**README — What Can Go Wrong**:

```text
- **PBKDF2 iteration count too low** — using fewer than 600,000 SHA-256 iterations (OWASP Password Storage Cheat Sheet; NIST SP 800-132 only sets a floor of 1,000) makes offline brute-force feasible on modern GPUs.
- **scrypt N parameter too small** — if `128 * N * r` fits comfortably in GPU memory, scrypt loses its memory-hardness advantage over PBKDF2.
- **Argon2id memory set too low** — reducing the `memory` parameter shrinks the cost asymmetry between defender and attacker. RFC 9106's second recommended option is 64 MiB; OWASP's stated minimum for interactive logins is 19 MiB (m=19456, t=2, p=1).
- **Using HKDF to hash passwords** — HKDF has no cost parameter and completes in microseconds, offering zero brute-force resistance.
- **Salt reuse across users** — all four KDFs require a unique random salt per credential; reusing a salt enables precomputation (rainbow-table) attacks.
```

**Claims tested** (e2e/claims.spec.ts, 25 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:100
    - :100 `toBeVisible` expected `{ timeout }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:101
    - :101 `toHaveAttribute` expected `'aria-busy', 'false', { timeout }` _(expression)_
- `the arena benchmarks what it says it benchmarks` — e2e/claims.spec.ts:104
- `a default run reports four KDFs whose figures agree with their own parameters` — e2e/claims.spec.ts:107
    - :148 `toBe` expected `'true'` _(literal)_
    - :149 `expect` expected _no expected value_ _(none)_
    - :150 `toBe` expected `true` _(expression)_
    - :151 `toBe` expected `0` _(literal)_
    - :152 `toBe` expected `'false'` _(literal)_
    - :153 `toBe` expected `false` _(expression)_
    - :156 `expect` expected _no expected value_ _(none)_
    - :158 `toBeVisible` expected `{ timeout: 180_000 }` _(expression)_
    - :159 `toHaveAttribute` expected `'aria-busy', 'false'` _(expression)_
    - :160 `toBeEnabled` expected _no expected value_ _(none)_
    - :163 `toEqual` expected `[` _(expression)_
    - :172 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :173 `toBe` expected `32` _(literal)_
    - :174 `expect` expected _no expected value_ _(none)_
    - :177 `toBe` expected `4` _(literal)_
    - :182 `toBe` expected `1` _(literal)_
    - :183 `toBe` expected `1` _(literal)_
    - :184 `toBe` expected _no expected value_ _(none)_
    - :187 `toBe` expected `Number(argon2.params.memory)` _(expression)_
    - :191 `expect` expected _no expected value_ _(none)_
    - :192 `expect` expected _no expected value_ _(none)_
    - :195 `expect` expected _no expected value_ _(none)_
    - :196 `expect` expected _no expected value_ _(none)_
- `each card's attacker estimate is the model applied to that card's own time and memory` — e2e/claims.spec.ts:199
    - :218 `expect` expected _no expected value_ _(none)_
    - :219 `expect` expected _no expected value_ _(none)_
    - :224 `toBe` expected _no expected value_ _(none)_
- `the RAM-bound label follows the memory wall, not the algorithm name` — e2e/claims.spec.ts:230
    - :235 `toHaveText` expected _no expected value_ _(none)_
    - :243 `toHaveText` expected _no expected value_ _(none)_
- `the timing chart bars are the times on the cards` — e2e/claims.spec.ts:248
    - :263 `toEqual` expected `cards.map((c) => c.kdf)` _(expression)_
    - :265 `toBeCloseTo` expected `cards[i].timeMs, 1` _(expression)_
    - :266 `toBeCloseTo` expected `maxTime, 1` _(expression)_
    - :268 `toBeCloseTo` expected _no expected value_ _(none)_
    - :273 `toBeCloseTo` expected `100, 0` _(expression)_
- `memory-hardness is drawn to a true linear scale` — e2e/claims.spec.ts:277
- `the grids at the shipped defaults fill in proportion to real memory` — e2e/claims.spec.ts:280
    - :295 `toEqual` expected `cards.map((c) => c.kdf)` _(expression)_
    - :298 `toBe` expected `144` _(literal)_
    - :301 `toBe` expected _no expected value_ _(none)_
    - :308 `toBe` expected `144` _(literal)_
    - :309 `toBe` expected `72` _(literal)_
    - :310 `toBe` expected `1` _(literal)_
    - :311 `toBe` expected `1` _(literal)_
    - :312 `expect` expected _no expected value_ _(none)_
    - :313 `expect` expected _no expected value_ _(none)_
- `the caption quotes the ratio this run produced, and names the hungriest KDF` — e2e/claims.spec.ts:316
    - :333 `toContainText` expected `'Argon2id, the hungriest KDF'` _(literal)_
    - :334 `toContainText` expected `expected` _(expression)_
    - :335 `toContainText` expected `'16 MiB'` _(literal)_
    - :337 `toHaveAttribute` expected `'data-ratio', expected` _(expression)_
- `the memory chart opens on linear and the log toggle recomputes every bar` — e2e/claims.spec.ts:340
    - :357 `toHaveAttribute` expected `'data-scale', 'linear'` _(expression)_
    - :358 `toHaveAttribute` expected _no expected value_ _(none)_
    - :363 `toContainText` expected `'Linear scale'` _(literal)_
    - :364 `toContainText` expected `String(ratio)` _(expression)_
    - :368 `toBeCloseTo` expected `(mem[i] / maxMem) * 100, 1` _(expression)_
    - :372 `toHaveAttribute` expected `'data-scale', 'log'` _(expression)_
    - :373 `toHaveAttribute` expected _no expected value_ _(none)_
    - :377 `toHaveAttribute` expected _no expected value_ _(none)_
    - :383 `toBeCloseTo` expected `(Math.log10(mem[i]) / maxLog) * 100, 1` _(expression)_
    - :388 `expect` expected _no expected value_ _(none)_
    - :389 `expect` expected _no expected value_ _(none)_
    - :391 `toBeCloseTo` expected `100, 1` _(expression)_
    - :392 `toBeCloseTo` expected `100, 1` _(expression)_
    - :394 `toContainText` expected `'Log scale'` _(literal)_
    - :395 `toContainText` expected `'flattens'` _(literal)_
    - :396 `toContainText` expected `String(ratio)` _(expression)_
    - :399 `toEqual` expected `lin` _(expression)_
- `the RAM-wall rig is the attacker model, watched` — e2e/claims.spec.ts:403
- `lanes that fit plus lanes that idle equal the rig, at both branches` — e2e/claims.spec.ts:406
    - :421 `toContainText` expected `'RAM-bound'` _(literal)_
    - :422 `toContainText` expected `'only ${fit.toLocaleString('en-US')} of the rig’s'` _(expression)_
    - :423 `toContainText` expected _no expected value_ _(none)_
    - :432 `toBe` expected `fit` _(expression)_
    - :433 `toBe` expected `RIG_LANES` _(expression)_
    - :434 `toBe` expected `total` _(expression)_
    - :436 `toBe` expected _no expected value_ _(none)_
    - :439 `expect` expected _no expected value_ _(none)_
    - :446 `toContainText` expected `'Compute-bound'` _(literal)_
    - :447 `toContainText` expected `'all ${RIG_LANES.toLocaleString('en-US')} cores run'` _(expression)_
    - :448 `toBe` expected `120` _(literal)_
    - :449 `toBe` expected `0` _(literal)_
- `the rig slider really re-parameterises the next benchmark` — e2e/claims.spec.ts:452
    - :461 `toHaveText` expected `'4,096'` _(literal)_
    - :462 `toHaveValue` expected `'4096'` _(literal)_
    - :466 `toBe` expected `4096` _(literal)_
    - :467 `toBe` expected `4096` _(literal)_
- `failure and tamper paths` — e2e/claims.spec.ts:471
- `an invalid scrypt N fails loudly, says why, and is recoverable` — e2e/claims.spec.ts:474
    - :480 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :481 `toHaveAttribute` expected `'role', 'alert'` _(expression)_
    - :483 `toContainText` expected `/power of 2/i` _(regex)_
    - :484 `toContainText` expected `'N'` _(literal)_
    - :486 `toHaveCount` expected `0` _(literal)_
    - :487 `toHaveAttribute` expected `'aria-busy', 'false'` _(expression)_
    - :488 `toBeEnabled` expected _no expected value_ _(none)_
    - :493 `toHaveCount` expected `0` _(literal)_
    - :494 `toHaveCount` expected `4` _(literal)_
- `an empty password refuses to run and puts the cursor where the fix is` — e2e/claims.spec.ts:497
    - :501 `toBeVisible` expected _no expected value_ _(none)_
    - :502 `toHaveCount` expected `0` _(literal)_
    - :503 `toHaveAttribute` expected `'aria-busy', 'false'` _(expression)_
    - :504 `toBe` expected `'password-input'` _(literal)_
- `a blank cost field falls back to its default instead of deriving with zero cost` — e2e/claims.spec.ts:507
    - :519 `toBe` expected `600000` _(literal)_
    - :520 `toBe` expected `8` _(literal)_
    - :521 `toBe` expected _no expected value_ _(none)_
- `salt reuse reproduces identical keys and the callout explains the failure` — e2e/claims.spec.ts:526
    - :541 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :542 `toContainText` expected `'rainbow tables'` _(literal)_
    - :543 `toHaveCount` expected `0` _(literal)_
    - :547 `toBe` expected `firstSalt` _(expression)_
    - :548 `toBe` expected `first[i]` _(expression)_
    - :557 `toEqual` expected `pinned` _(expression)_
    - :558 `toBe` expected `pinnedSalt` _(expression)_
    - :561 `toBeVisible` expected _no expected value_ _(none)_
    - :562 `toContainText` expected `'Salt reuse is ON (insecure demo mode)'` _(literal)_
    - :563 `toContainText` expected `'rainbow tables'` _(literal)_
    - :564 `toContainText` expected `pinnedSalt` _(expression)_
    - :569 `toEqual` expected `pinned` _(expression)_
    - :570 `toHaveCount` expected `0` _(literal)_
- `the PBKDF2 weaken preset flips the knob and the attacker gets faster` — e2e/claims.spec.ts:573
    - :578 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :581 `toBe` expected `600000` _(literal)_
    - :584 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :585 `toHaveText` expected `'Restore strong default'` _(literal)_
    - :586 `toHaveValue` expected `'1000'` _(literal)_
    - :588 `toBe` expected `true` _(expression)_
    - :592 `toBe` expected `1000` _(literal)_
    - :595 `expect` expected _no expected value_ _(none)_
    - :596 `expect` expected _no expected value_ _(none)_
    - :597 `toBe` expected `strong.keyHex` _(expression)_
    - :600 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :601 `toHaveText` expected `'Weaken: 1,000 iterations'` _(literal)_
    - :602 `toHaveValue` expected `'600000'` _(literal)_
- `the Argon2id weaken preset shrinks the RAM wall the page then reports` — e2e/claims.spec.ts:605
    - :610 `toBe` expected `65536` _(literal)_
    - :614 `toHaveValue` expected `'8192'` _(literal)_
    - :618 `toBe` expected `8192` _(literal)_
    - :619 `toBe` expected `8192` _(literal)_
    - :621 `toBe` expected `8` _(literal)_
    - :623 `toHaveText` expected `'8 MiB'` _(literal)_
- `the teaching content the README promises is on the page` — e2e/claims.spec.ts:627
- `the intro frames compute- vs memory-hardness and flags HKDF as the wrong tool` — e2e/claims.spec.ts:630
    - :635 `toContainText` expected `'key derivation function'` _(literal)_
    - :636 `toContainText` expected `'compute-hard'` _(literal)_
    - :637 `toContainText` expected `'memory-hard'` _(literal)_
    - :638 `toContainText` expected `'wrong tool'` _(literal)_
    - :640 `toHaveCount` expected `5` _(literal)_
    - :641 `toContainText` expected `'extract-and-expand'` _(literal)_
    - :642 `toContainText` expected `'KiB'` _(literal)_
- `each schematic draws the mechanism its KDF actually used` — e2e/claims.spec.ts:645
    - :652 `toHaveAttribute` expected `'data-count', '12345'` _(expression)_
    - :653 `toContainText` expected `'12,345'` _(literal)_
    - :654 `toContainText` expected _no expected value_ _(none)_
    - :657 `toContainText` expected `'Compute-hard'` _(literal)_
    - :660 `toContainText` expected `'extract'` _(literal)_
    - :661 `toContainText` expected `'expand'` _(literal)_
    - :662 `toContainText` expected `'no cost knob'` _(literal)_
    - :663 `toContainText` expected _no expected value_ _(none)_
    - :668 `toHaveCount` expected `2` _(literal)_
    - :669 `toContainText` expected `'Memory-hard'` _(literal)_
    - :670 `expect` expected _no expected value_ _(none)_
- `the memory figure is labelled defined-not-measured on every card` — e2e/claims.spec.ts:673
    - :677 `toHaveCount` expected `4` _(literal)_
    - :679 `expect` expected _no expected value_ _(none)_
    - :683 `expect` expected _no expected value_ _(none)_
    - :684 `expect` expected _no expected value_ _(none)_
    - :685 `toMatch` expected `/estimate/i` _(regex)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-kdf-arena

## What It Is

KDF Arena is a live, in-browser benchmarking tool that compares four key derivation functions side-by-side: HKDF-SHA256, PBKDF2-SHA256, scrypt, and Argon2id. All four run in pure JavaScript via [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) — no WASM, no native bindings — and every one is pinned to its RFC known-answer vector in the test suite (see **Accessibility & Testing**). It measures wall-clock derivation time and reports each function's *nominal* (algorithm-defined, not measured) memory cost using identical input (password + random 16-byte salt). HKDF is included for educational contrast — it is an extract-and-expand KDF for already-strong key material, not a password-hashing function. The three password KDFs (PBKDF2, scrypt, Argon2id) are compared at their recommended default parameters to illustrate the trade-off between iteration hardness and memory hardness, and each parameter is adjustable in the UI's **Cost parameters** panel.

> **A note on the memory figure.** The "nominal memory" shown per KDF is *defined, not measured*: for scrypt it is `128 * N * r` bytes and for Argon2id it is the `memory` parameter (both are the algorithms' actual working-set sizes), while for HKDF and PBKDF2 — which are compute-bound, not memory-hard — it is the small, roughly-constant scratch space they use. It is not a live RSS/heap measurement of the browser.

The live page opens with a plain-language framing of *what a KDF is* and *the compute-hard vs memory-hard tension* the arena teaches, so a first-time visitor gets the "why" without opening this README. Results are shown through a defender/attacker lens — alongside the wall-clock time, each KDF reports an order-of-magnitude **attacker guesses/sec** estimate (derived from that run's real time and the algorithm's defined memory cost) and whether it is compute- or RAM-bound. The memory-hardness axis is then made *visible*, not just tabulated: four same-size **memory-fill grids** sit in one row on a true linear scale, so PBKDF2/HKDF read as one lonely lit cell beside the memory-hard grids (at the shipped defaults scrypt's 128 MiB fills its grid and Argon2id's 64 MiB fills half of it); an interactive **RAM-wall** exhibit draws the attacker's fixed RAM pool and compute lanes and lets you drag Argon2id's memory parameter to watch idle cores get evicted in real time; and the per-guess-memory bar chart defaults to a **linear** scale (with a one-click switch to log) so the honest gap lands before it is compressed for legibility. Every ratio the captions quote is computed from the run on screen — at the shipped defaults it is ~130,000×, and it restates itself when you move a cost knob.

## Exhibits

1. **On-page framing block** — a college-level intro defining KDFs and the compute-hard (PBKDF2) vs memory-hard (scrypt, Argon2id) tension, calling out HKDF as the deliberately-included *wrong tool*.
2. **Four-KDF benchmark** — HKDF-SHA256, PBKDF2-SHA256, scrypt, and Argon2id derived in-browser from a shared salt at adjustable cost parameters, PBKDF2 and scrypt are pinned to their RFC known-answer vectors through the exact `src/bench.ts` wrappers the UI calls; HKDF and Argon2id, whose vectors need inputs the wrappers do not expose, are pinned at the primitive (see **Accessibility & Testing**).
3. **Per-KDF mechanism schematics** — each result card carries a small annotated diagram of that KDF's inner loop: HKDF's two labelled *extract → expand* boxes (no cost knob), PBKDF2's single hash inside a repeat-counter loop, and scrypt/Argon2id's array of memory blocks written then re-read — turning "compute-hard = repeat a hash" vs "memory-hard = fill and revisit RAM" from prose into a picture.
4. **Memory-fill grids, drawn to scale** — all four KDFs shown as same-size cell grids in one row on a *true linear* scale (each measured against the hungriest KDF in the run), so the compute-hard pair light one lonely cell directly beside the far fuller memory-hard grids. The caption under the row names the hungriest KDF and the exact ratio for that run, so lowering a cost parameter restates the gap rather than leaving a stale figure on screen. The side-by-side emptiness-vs-fullness is the demo's clearest single view of memory-hardness.
5. **RAM-wall attacker rig** — a fixed pool of RAM and compute lanes drawn as a token board; guesses that fit are lit and the RAM-starved remainder go idle. A live slider on Argon2id's memory parameter evicts lanes in real time, so *why* adding cores stops helping once you are RAM-bound is watched, not asserted.
6. **Dual charts with a linear/log toggle** — wall-clock *defender cost* beside *attacker's per-guess memory cost*; the memory chart defaults to **linear** (the honest ratio) with a one-click switch to **log** (legible but flattening), each explained in a caption, so a learner cannot mistake Argon2id for "just a slower PBKDF2".
7. **Attacker-lens estimate** — a live, clearly-labelled order-of-magnitude guesses/sec figure per KDF plus its dominating bottleneck (compute vs memory), updating as the cost knobs change.
8. **One-click "weaken it" presets** — a guided toggle per password KDF (PBKDF2 → 1,000 iterations; Argon2id → 8 MiB) alongside the manual number fields, so newcomers who don't know good parameter ranges can flip a strong default to a deliberately weak one and re-run to see the attacker's guesses/sec jump.
9. **Salt-uniqueness lesson** — an on-page callout explaining why the derived key changes each run, with a *Reuse salt across runs* toggle that reproduces identical keys to demonstrate the rainbow-table failure mode.
10. **Jargon glossary** — collapsible in-page definitions for extract-and-expand, iterations/compute-hardness, memory-hardness, lanes/parallelism, and KiB.
11. **Whole-record recovery exercise** — compare `F(p)`, the deliberately leaking `F(p) || p`, and `F(p) || H(p)` using six fixed synthetic strings. All three records really compute scrypt at creation. Recovery of the leaking records reads the password or tests cheap SHA-256 values without calling scrypt. Exact operation counts and expandable traces expose the difference between expensive creation and password protection.

## Expensive Computation and the Complete Record

Open the [record-design exercise](https://systemslibrarian.github.io/crypto-lab-kdf-arena/#record-design), choose a synthetic string, and click **Compare record designs**. The selection is separate from the benchmark password field; there is no free-form input or uploaded dictionary in this exercise.

Here `F` is the existing scrypt wrapper with fixed `N=1024, r=8, p=1`, a 32-byte output, and public demo salt `kdf-record-demo!`. Its nominal main working set is 1 MiB. `H` is SHA-256 of the UTF-8 password. These small costs and the shared demo salt keep the comparison bounded and reproducible; they are not production settings. At most nine scrypt calls run per comparison: three independent record creations and up to six dictionary guesses for the `F(p)` record.

| Stored record | Creation | Displayed recovery strategy |
| --- | --- | --- |
| `F(p)` | One real scrypt call | Evaluate scrypt for each dictionary candidate until its full digest matches. |
| `F(p) || p` | One real scrypt call | Read the appended password; no candidate comparisons or scrypt calls. |
| `F(p) || H(p)` | One real scrypt call and one SHA-256 call | Compare candidate SHA-256 values; no scrypt calls or expensive verification. |

The table counts calls actually executed, candidate comparisons and direct reads. `H` counts standalone SHA-256 calls, excluding hashes internal to scrypt. The six candidates have distinct SHA-256 values, so a matching cheap digest identifies the selected entry within this dictionary. The UI clears old results when the selection changes. It makes no wall-clock attack-rate claim.

The exercise illustrates the distinction motivating Charles Dodd, Pooya Farshim, Siamak F. Shahandashti and Karl Southern, **Multi-Instance Unrecoverability of iMHF-Based Password Hashing** ([University of York research record](https://pure.york.ac.uk/portal/en/publications/multi-instance-unrecoverability-of-imhf-based-password-hashing/), [ePrint 2026/018](https://eprint.iacr.org/2026/018); recommendation CL2864): evaluation hardness alone does not establish password unrecoverability when a construction leaks information about its input. These are invented counterexamples, not attacks on standard scrypt or Argon2 password storage. This is a single-record teaching exercise, not an implementation or independent validation of the paper's multi-instance bounds.

The arena's RAM-wall estimate assumes full evaluations with the nominal working set. It does not cover time–memory trade-offs, preprocessing, hardware-specific attacks or shortcuts exposed by the complete record; it is not a lower bound on every attack. Those limits apply even when a derivation is genuinely expensive on the current browser.

## When to Use It

- **Choosing a password KDF for a new system** — run the benchmark on target hardware to see real timing costs before committing to PBKDF2, scrypt, or Argon2id.
- **Tuning cost parameters** — open the **Cost parameters** panel to adjust iterations (PBKDF2), N/r/p (scrypt), or time/memory/parallelism (Argon2id) and observe the impact on derivation time. The derived keys change as you lower the cost, making it concrete that a weaker parameter is a different (and easier-to-crack) function.
- **Teaching the difference between HKDF and password KDFs** — the sub-millisecond HKDF result makes it visually obvious that HKDF is not designed to resist brute-force attacks on passwords.
- Do NOT use these results as a server-side benchmark — single-threaded JavaScript in a browser does not represent native C/Rust implementations on a server.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-kdf-arena](https://systemslibrarian.github.io/crypto-lab-kdf-arena/)**

Enter any password string and click **Run Benchmark** to derive 32-byte keys with all four KDFs using a shared random salt. The results panel shows wall-clock time in milliseconds, the nominal (defined, not measured) memory cost, an order-of-magnitude attacker guesses/sec estimate, a per-KDF inner-loop schematic, and a hex preview of each derived key. Below the cards, four same-size **memory-fill grids** put every KDF on one true linear scale, an interactive **RAM-wall** exhibit lets you drag Argon2id's memory to evict attacker lanes live, and two bar charts compare defender time and attacker per-guess memory cost — the memory chart defaulting to linear with a one-click switch to log. Use the per-KDF **Weaken** presets or expand **Cost parameters** to tune the cost knobs, and toggle **Reuse salt across runs** to see identical passwords derive identical keys.

## What Can Go Wrong

- **PBKDF2 iteration count too low** — using fewer than 600,000 SHA-256 iterations (OWASP Password Storage Cheat Sheet; NIST SP 800-132 only sets a floor of 1,000) makes offline brute-force feasible on modern GPUs.
- **scrypt N parameter too small** — if `128 * N * r` fits comfortably in GPU memory, scrypt loses its memory-hardness advantage over PBKDF2.
- **Argon2id memory set too low** — reducing the `memory` parameter shrinks the cost asymmetry between defender and attacker. RFC 9106's second recommended option is 64 MiB; OWASP's stated minimum for interactive logins is 19 MiB (m=19456, t=2, p=1).
- **Using HKDF to hash passwords** — HKDF has no cost parameter and completes in microseconds, offering zero brute-force resistance.
- **Salt reuse across users** — all four KDFs require a unique random salt per credential; reusing a salt enables precomputation (rainbow-table) attacks.

## Real-World Usage

- **Argon2id** — winner of the Password Hashing Competition (2015), the default password hash in the libsodium `crypto_pwhash` API, and a selectable KDF in Bitwarden.
- **scrypt** — used by Tarsnap for key derivation and by Litecoin's proof-of-work algorithm; recommended in RFC 7914.
- **PBKDF2** — used for Wi-Fi key derivation in WPA2 (PBKDF2-HMAC-SHA1, 4096 iterations), in LUKS disk encryption, and specified in NIST SP 800-132.
- **HKDF-SHA256** — used by TLS 1.3 (RFC 9846) for deriving traffic keys from the handshake secret, and by the Signal Protocol for ratchet key derivation.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-kdf-arena
cd crypto-lab-kdf-arena
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-kdf-chain](https://systemslibrarian.github.io/crypto-lab-kdf-chain/) — sibling KDF demo with a decision tree, derivation chains, and an attacker-cost model.
- [crypto-lab-bcrypt-forge](https://systemslibrarian.github.io/crypto-lab-bcrypt-forge/) — bcrypt cost-factor tuning, the other major password-hashing family.
- [crypto-lab-phantom-vault](https://systemslibrarian.github.io/crypto-lab-phantom-vault/) — PBKDF2-SHA-256 key stretching with HMAC-DRBG in a vault context.
- [crypto-lab-shadow-vault](https://systemslibrarian.github.io/crypto-lab-shadow-vault/) — Argon2id plus ChaCha20-Poly1305 for file encryption.
- [crypto-lab-mac-race](https://systemslibrarian.github.io/crypto-lab-mac-race/) — HMAC and other MACs, the PRF underneath these KDFs.

## Accessibility & Testing

**Crypto correctness.** `npm test` runs a [Vitest](https://vitest.dev) suite
(`test/kdf.test.ts`) that recomputes the published RFC known-answer vectors —
HKDF-SHA256 (RFC 5869), PBKDF2-HMAC-SHA256 (RFC 7914 §11), scrypt (RFC 7914
§12), and Argon2id (RFC 9106 §5.3) — plus determinism, parameter-liveness, and
salt-uniqueness property tests. A regression that swapped an algorithm, dropped
a parameter, or truncated an output would fail here rather than ship.

`test/record-design.test.ts` independently checks the exercise's scrypt and
SHA-256 fields, exact creation/recovery operation counts, first/middle/last
dictionary matches, early stopping, no-match exhaustion and bounded selection.
It also corrupts the expensive field to prove that the two leaking designs
really bypass it. `e2e/record-design.spec.ts` checks the displayed counts,
independence from the benchmark input, selection changes, expanded recovery
traces and narrow-screen accessibility in both themes.

Two of those vectors run through the exact `src/bench.ts` wrappers the UI calls:
`runPBKDF2` reproduces the RFC 7914 §11 vector and `runScrypt` the §12 one, so
those code paths are verified end to end. The HKDF and Argon2id vectors cannot
be: `runHKDF` pins its own `info` string, and `runArgon2id` exposes no secret
key or associated data, both of which the published vectors require. Those two
are pinned at the primitive, and the wrappers are separately asserted to agree
byte-for-byte with a direct `@noble/hashes` call at the same parameters — so a
swapped algorithm or dropped parameter still fails, just in two steps rather
than one.

**Page claims.** `e2e/claims.spec.ts` drives the real page in Chromium and
asserts the load-bearing states rather than merely that they render: every
card's nominal memory recomputed from the parameters that card prints, every
attacker guesses/sec figure recomputed from that card's own time and memory,
the timing bars against the times on the cards, the memory grids and both chart
scales against the true linear/log ratios, the RAM-wall rig's working and idle
lanes summing to the rig's cores, and each failure or tamper path — invalid
scrypt `N`, empty password, blank cost field, salt reuse, both **Weaken**
presets — driven to its end state and checked to also say *why*. Timings are
asserted as orderings and ratios, never absolute thresholds, so the suite is not
machine-dependent.

KDF Arena is also built to a WCAG 2.1 AA standard and verified by an automated
audit harness (`audit/run.mjs`) that drives the real page in Chromium:

- **axe-core** (WCAG 2.0/2.1 A + AA) on desktop *and* mobile viewports, in both
  the initial and post-benchmark states — **0 violations**.
- **Lighthouse** (mobile form factor) — **100 accessibility, 100 best-practices,
  100 SEO, 100 performance**.
- A **screen-reader accessibility-tree check** asserting the heading outline,
  landmark/region names, labelled controls, the skip link, and the named timing
  meters.

Highlights: logical heading order, a skip link, a real `<form>` (Enter runs the
benchmark), an `aria-live` results region with `aria-busy`, 44px touch targets, a
16px input floor to prevent iOS zoom, system-preference theme detection,
`prefers-reduced-motion` support, and AA-compliant contrast in both themes.

`​``sh
npm install
npm test                          # RFC known-answer + property tests (Vitest)
npx playwright install chromium   # one-time, for the browser gates / audit
npm run test:e2e                  # claims + WCAG A/AA gates (the CI gate)
npm run test:a11y                 # WCAG A/AA gate alone (axe-core, both themes)
npm run audit                     # build + axe + Lighthouse + SR-tree checks
`​``

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Poly1305 MAC

- **slug**: `crypto-lab-poly1305-mac`
- **repo**: https://github.com/systemslibrarian/crypto-lab-poly1305-mac
- **live**: https://systemslibrarian.github.io/crypto-lab-poly1305-mac/
- **commit_sha**: `f5b2b6465c6d5940b7e572beb227a6c353fa6904` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS  ·  **level**: advanced  ·  **--accent**: #097090
- **MISSING FIELDS**: verification

**Name (H1)**: Poly1305  — _read from src/ui.ts_

**Subtitle**: One-Time MAC · GF(2^130-5)  — _read from src/ui.ts_

**Description**: Compute and verify a Poly1305 tag, watch the message evaluate as a polynomial over the field GF(2^130-5), and see how reusing one key across two messages leaks it.  — _read from src/ui.ts_

**Why it matters**: An authentication tag is often the only thing standing between a genuine message and a forged one. Poly1305 is provably strong per key, but it is a one-time MAC: reuse the key and an attacker can solve for it and forge at will.  — _read from src/ui.ts_

**Card copy**: Polynomial evaluation over GF(2¹³⁰−5), constant-time tag verification, key-reuse attack visualizer, and Polynomial Stepper.

**Chips**: Poly1305 · GF(2¹³⁰−5) · Key-Reuse Attack · Polynomial Stepper

**Implements**: Poly1305 `src/poly-math.ts:43`

**Attacks shown**: Nonce reuse `README.md:29`, Side-channel (unspecified) `src/ui.ts:384`, Timing side-channel `src/ui.ts:384`

**References**: AES, AES-GCM, BLAKE3, CMAC, ChaCha20, ChaCha20-Poly1305, GHASH, HMAC, Noise protocol, SHA-256, Salsa20, TLS 1.3

**Standards body**: IETF

**Implementation**: @noble

**Spec citations, exactly as written**:

- `RFC 8439` — first seen README.md:21 (3×)
- `RFC 9001` — first seen README.md:37 (1×)

**README — What Can Go Wrong**:

```text
- **Key reuse** — Poly1305 is a one-time MAC. Authenticating two different messages under the same 32-byte key lets an attacker solve for the secret r and s values algebraically and forge tags for any message.
- **Non-constant-time tag comparison** — Comparing tags with an early-exit `===` loop leaks how many leading bytes matched, giving an attacker a timing oracle to iteratively guess a valid tag.
- **Unclamped r value** — The first 16 bytes of the key must have 22 specific bits zeroed (clamping) before use, and an implementation that skips it produces tags no conforming peer will accept. Note the direction of the tradeoff, which is easy to get backwards: clamping is a *performance* measure — it bounds `r` so the field multiplication can run in fast fixed-width limbs without carry overflow — and it *costs* security rather than adding it, shrinking `r`'s space from 2^128 to 2^106. That 2^106 is exactly the denominator in the 8·⌈L/16⌉ / 2^106 forgery bound.
- **Using Poly1305 without an AEAD wrapper** — Standalone Poly1305 authenticates but does not encrypt. Sending a cleartext message with only a Poly1305 tag gives integrity without confidentiality, which is rarely the correct security goal.
- **Nonce misuse in ChaCha20-Poly1305** — In the AEAD construction, repeating a nonce under the same encryption key re-derives the same Poly1305 sub-key, collapsing back to the key-reuse failure above.
```

**Claims tested** (e2e/claims.spec.ts, 22 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:32
    - :32 `toMatch` expected `/^[0-9A-F]*$/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:33
    - :33 `toBe` expected `0` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:55
    - :55 `toHaveLength` expected `32` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:67
    - :67 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:86
    - :86 `toBe` expected `true` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:87
    - :87 `toBe` expected `true` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:89
    - :89 `toBe` expected `full` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:109
    - :109 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:113
    - :113 `toEqual` expected `[]` _(expression)_
- `the key, its clamped r, and the clamp comparison agree` — e2e/claims.spec.ts:116
    - :121 `toBe` expected `clampedHex` _(expression)_
    - :124 `toHaveCount` expected `2` _(literal)_
    - :127 `toBe` expected `keyHex.slice(0, 32)` _(expression)_
    - :128 `toBe` expected `clampedHex` _(expression)_
    - :134 `toEqual` expected `after.filter((b, i) => b !== before[i])` _(expression)_
    - :135 `toHaveLength` expected `reallyChanged.length` _(expression)_
- `computing a MAC fills the tag grid and hex with the same 16 bytes` — e2e/claims.spec.ts:138
    - :139 `toHaveText` expected `'0'.repeat(32)` _(expression)_
    - :143 `toMatch` expected `/^[0-9A-F]{32}$/` _(regex)_
    - :144 `toBe` expected `'0'.repeat(32)` _(expression)_
    - :147 `toHaveLength` expected `16` _(literal)_
    - :148 `toBe` expected `tagHex` _(expression)_
    - :153 `toHaveAttribute` expected _no expected value_ _(none)_
- `scenario 1 verifies the untampered message as VALID` — e2e/claims.spec.ts:160
    - :164 `toHaveText` expected `'VALID'` _(literal)_
    - :165 `toHaveClass` expected `/scenario-status--valid/` _(regex)_
    - :167 `toHaveText` expected `'Ready to verify'` _(literal)_
    - :168 `toHaveText` expected `'Ready to verify'` _(literal)_
- `scenario 2 rejects the tampered message and shows the tamper` — e2e/claims.spec.ts:171
    - :178 `toBe` expected `'${message} '` _(expression)_
    - :181 `toHaveText` expected `'INVALID'` _(literal)_
    - :182 `toHaveClass` expected `/scenario-status--invalid/` _(regex)_
- `scenario 3 rejects a one-bit tag flip and shows exactly that bit` — e2e/claims.spec.ts:185
    - :190 `toHaveText` expected `'INVALID'` _(literal)_
    - :191 `toHaveClass` expected `/scenario-status--invalid/` _(regex)_
    - :194 `toHaveLength` expected `16` _(literal)_
    - :198 `toEqual` expected `[8]` _(expression)_
    - :199 `toBe` expected `1` _(literal)_
    - :203 `toHaveCount` expected `1` _(literal)_
    - :204 `toHaveAttribute` expected `'aria-label', 'Byte 9 of 16: 0x${tampered[8]}, flipped by the tamper'` _(expression)_
- `editing the message retracts the tag and every verdict` — e2e/claims.spec.ts:207
    - :210 `toHaveText` expected `'VALID'` _(literal)_
    - :217 `toHaveText` expected `'Awaiting MAC'` _(literal)_
    - :219 `toHaveText` expected `'0'.repeat(32)` _(expression)_
    - :220 `toBeDisabled` expected _no expected value_ _(none)_
    - :223 `toBe` expected `firstTag` _(expression)_
- `the polynomial stepper is arithmetically self-consistent and reproduces the tag` — e2e/claims.spec.ts:226
    - :235 `toHaveCount` expected `Math.min(4, Math.ceil(messageBytes.length / 16))` _(expression)_
    - :239 `toBe` expected `r` _(expression)_
    - :240 `toBe` expected `r` _(expression)_
    - :248 `toHaveLength` expected `7` _(literal)_
    - :251 `toBe` expected `String(i + 1)` _(expression)_
    - :255 `toEqual` expected `slice` _(expression)_
    - :256 `toBe` expected `littleEndian([...slice, 0x01])` _(expression)_
    - :259 `toBe` expected `expectedAccBefore` _(expression)_
    - :260 `toBe` expected `BigInt(accBefore) + BigInt(blockValue)` _(expression)_
    - :261 `toBe` expected `BigInt(sum) * r` _(expression)_
    - :262 `toBe` expected `BigInt(product) % PRIME` _(expression)_
    - :270 `toBe` expected `littleEndian(hexToBytes(tagHex))` _(expression)_
- `the stepper says so when a message has no blocks at all` — e2e/claims.spec.ts:273
    - :276 `toHaveText` expected `/no bytes.*no Poly1305 blocks/` _(regex)_
    - :277 `toHaveCount` expected `0` _(literal)_
- `key reuse forges a tag the real key accepts` — e2e/claims.spec.ts:280
    - :289 `toBe` expected `expectedTagHex(messageOne, r, s)` _(expression)_
    - :290 `toBe` expected `expectedTagHex(messageTwo, r, s)` _(expression)_
    - :295 `toEqual` expected _no expected value_ _(none)_
    - :298 `toHaveClass` expected `/reuse-length-note--over/` _(regex)_
    - :302 `toHaveText` expected `/^VALID/` _(regex)_
    - :303 `toHaveClass` expected `/scenario-status--valid/` _(regex)_
    - :304 `toBeVisible` expected _no expected value_ _(none)_
    - :305 `toContainText` expected `'Key broken'` _(literal)_
    - :310 `toHaveCount` expected `2` _(literal)_
    - :317 `toBe` expected `expectedTagHex(forged, r, s)` _(expression)_
    - :318 `toBe` expected `expectedTagHex(messageOne, r, s)` _(expression)_
    - :319 `toBe` expected `expectedTagHex(messageTwo, r, s)` _(expression)_
    - :320 `toBe` expected `forgedHex` _(expression)_
- `a forged message the user types stays forgeable (and clears the old verdict)` — e2e/claims.spec.ts:323
    - :327 `toBeVisible` expected _no expected value_ _(none)_
    - :333 `toHaveText` expected `'0'.repeat(32)` _(expression)_
    - :334 `toBeHidden` expected _no expected value_ _(none)_
    - :335 `toHaveText` expected `'Ready — click Forge Tag'` _(literal)_
    - :336 `toBeEnabled` expected _no expected value_ _(none)_
    - :339 `toHaveText` expected `/^VALID/` _(regex)_
    - :340 `toBe` expected `expectedTagHex('Pay Mallory $7', r, s)` _(expression)_
- `two identical messages cannot recover the key, and the page says why` — e2e/claims.spec.ts:343
    - :347 `toBe` expected `await text(page, '#reuse-tag-two')` _(expression)_
    - :350 `toHaveText` expected `'Need two different messages'` _(literal)_
    - :351 `toHaveClass` expected `/scenario-status--invalid/` _(regex)_
    - :352 `toContainText` expected `'same equation'` _(literal)_
    - :353 `toBeHidden` expected _no expected value_ _(none)_
    - :354 `toHaveText` expected `'0'.repeat(32)` _(expression)_
- `messages over one block are refused, naming which ones` — e2e/claims.spec.ts:357
    - :361 `toHaveClass` expected `/reuse-length-note--over/` _(regex)_
    - :362 `toContainText` expected `'Message 1 exceed 16 bytes'` _(literal)_
    - :363 `toContainText` expected `'Message 2 '` _(literal)_
    - :364 `toBeDisabled` expected _no expected value_ _(none)_
    - :365 `toBeHidden` expected _no expected value_ _(none)_
    - :370 `toBeEnabled` expected _no expected value_ _(none)_
    - :372 `toContainText` expected `'the forged message exceed 16 bytes'` _(literal)_
    - :373 `toBeDisabled` expected _no expected value_ _(none)_
- `an underdetermined pair is reported as ambiguous rather than forged from` — e2e/claims.spec.ts:376
    - :396 `toMatch` expected `/^Key not pinned down — \d+ candidates fit$/` _(regex)_
    - :397 `toHaveClass` expected `/scenario-status--invalid/` _(regex)_
    - :402 `expect` expected _no expected value_ _(none)_
    - :403 `toBe` expected `claimed` _(expression)_
    - :406 `toHaveText` expected `'0'.repeat(32)` _(expression)_
    - :407 `toBeHidden` expected _no expected value_ _(none)_

**Mutation records** (2 file(s)):

- `mutation-evidence.json` (8715 bytes)
- `scripts/claim-mutations.mjs` (6730 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-poly1305-mac

## What It Is

Poly1305 is a one-time message authentication code (MAC) designed by Daniel J. Bernstein. It takes a 32-byte key and a variable-length message and produces a 128-bit authentication tag by evaluating a polynomial over the prime field GF(2^130 − 5). The security model is information-theoretic: as long as each key is used only once, no amount of computation gives an attacker better than an 8·⌈L/16⌉ / 2^106 chance of forging a valid tag on a message of at most L bytes (Bernstein's bound — note that it is weaker than the 2^−128 of a blind guess, and grows with message length). This demo uses the standalone `poly1305` export from `@noble/ciphers/_poly1305.js` to compute and verify tags entirely in the browser.

## When to Use It

- **Authenticating a single message under a fresh key** — Poly1305's one-time guarantee makes it ideal when a higher-level protocol (such as ChaCha20-Poly1305) derives a unique key per message.
- **High-throughput MAC in AEAD constructions** — Poly1305's arithmetic is simple enough for constant-time implementations on commodity hardware, making it a common choice inside TLS 1.3 and WireGuard.
- **Replacing HMAC when polynomial MAC performance matters** — On platforms without AES-NI, Poly1305 can be faster than HMAC-SHA-256 while offering a strong forgery bound.
- **When you need a MAC with a provable security bound** — Poly1305's forgery probability is at most 8·⌈L/16⌉ / 2^106, a concrete, message-length-dependent bound absent from many hash-based MACs.
- **Do NOT use standalone Poly1305 when you cannot guarantee one-time key usage** — reusing a key across two messages lets an attacker recover the secret r value and forge tags for any future message. This is a teaching demo, not a production MAC implementation.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-poly1305-mac](https://systemslibrarian.github.io/crypto-lab-poly1305-mac/)**

Generate a random 32-byte key, type any message, and compute its Poly1305 authentication tag. Three verification scenarios let you confirm the original tag, tamper the message (a trailing space), or flip a single bit of a single tag byte — all with constant-time comparison; each tag byte is drawn as a colored square whose hue encodes its value (0x00 blue → 0xFF red). The Polynomial Stepper visualises the first four blocks with the full recurrence broken into stages — `Acc + Block`, then `× r`, then `mod p → Acc After` — annotates the first block's 0x01 padding and little-endian reading, and includes a "What is clamping?" popover that highlights exactly which key bits are zeroed. The **Forge a Tag by Reusing One Key** section makes the one-time rule concrete: it signs two short (single-block) messages under one key, then — playing the attacker who never sees the key — recovers the secret `r` and `s` from the two tags by algebra and produces a **valid forged tag** for a third message you choose, verified live against the same key.

The forgery is real, not staged: the recovery solves `(c₁ − c₂)·r ≡ (t₁ − t₂) + Δ·2¹²⁸ (mod p)` over the nine possible wrap terms `Δ`, discards every candidate that is not a valid clamped `r` (below 2¹²⁴ and matching the clamp mask) or that fails to reproduce the second tag, and forges only when exactly one candidate survives. That last condition matters: candidates for neighbouring `Δ` differ by `2¹²⁸·(c₁ − c₂)⁻¹ (mod p)`, so two messages that are very close — one byte apart at the same length, like `ab` and `ac` — leave several keys that all explain both captured tags, and the demo says so rather than forging from a guess. A unit test asserts the recovered `r` matches the RFC 8439 key, that any claimed unique recovery really is the sender's `r`, that the forged tag verifies under real `@noble/ciphers` Poly1305 across many random keys, and that the underdetermined message pairs are reported as ambiguous instead of answered.

## What Can Go Wrong

- **Key reuse** — Poly1305 is a one-time MAC. Authenticating two different messages under the same 32-byte key lets an attacker solve for the secret r and s values algebraically and forge tags for any message.
- **Non-constant-time tag comparison** — Comparing tags with an early-exit `===` loop leaks how many leading bytes matched, giving an attacker a timing oracle to iteratively guess a valid tag.
- **Unclamped r value** — The first 16 bytes of the key must have 22 specific bits zeroed (clamping) before use, and an implementation that skips it produces tags no conforming peer will accept. Note the direction of the tradeoff, which is easy to get backwards: clamping is a *performance* measure — it bounds `r` so the field multiplication can run in fast fixed-width limbs without carry overflow — and it *costs* security rather than adding it, shrinking `r`'s space from 2^128 to 2^106. That 2^106 is exactly the denominator in the 8·⌈L/16⌉ / 2^106 forgery bound.
- **Using Poly1305 without an AEAD wrapper** — Standalone Poly1305 authenticates but does not encrypt. Sending a cleartext message with only a Poly1305 tag gives integrity without confidentiality, which is rarely the correct security goal.
- **Nonce misuse in ChaCha20-Poly1305** — In the AEAD construction, repeating a nonce under the same encryption key re-derives the same Poly1305 sub-key, collapsing back to the key-reuse failure above.

## Real-World Usage

- **TLS 1.3** — The `TLS_CHACHA20_POLY1305_SHA256` cipher suite uses Poly1305 as the MAC inside its AEAD, protecting every record on connections that negotiate this suite.
- **WireGuard** — All tunnel packets are authenticated with ChaCha20-Poly1305, relying on Poly1305 for per-packet integrity and authenticity.
- **OpenSSH** — The `chacha20-poly1305@openssh.com` cipher uses Poly1305 to authenticate both the packet length and payload, replacing the older HMAC-based transport MACs.
- **NaCl / libsodium `crypto_secretbox`** — The widely deployed `secretbox` construction pairs XSalsa20 encryption with Poly1305 authentication, used in applications from Signal to Keybase.
- **IETF RFC 8439** — The canonical specification for ChaCha20-Poly1305, referenced by QUIC (RFC 9001), Noise Protocol Framework, and other modern protocols.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-poly1305-mac
cd crypto-lab-poly1305-mac
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-mac-race](https://systemslibrarian.github.io/crypto-lab-mac-race/) — head-to-head comparison of HMAC, CMAC, Poly1305, and GHASH.
- [crypto-lab-chacha20-stream](https://systemslibrarian.github.io/crypto-lab-chacha20-stream/) — the ChaCha20 keystream that pairs with Poly1305 in the AEAD construction.
- [crypto-lab-aes-modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/) — AES-GCM and other authenticated-encryption modes for comparison.
- [crypto-lab-nonce-guard](https://systemslibrarian.github.io/crypto-lab-nonce-guard/) — what nonce reuse does to AEAD constructions, the failure mode behind ChaCha20-Poly1305 misuse.
- [crypto-lab-babel-hash](https://systemslibrarian.github.io/crypto-lab-babel-hash/) — SHA-256, BLAKE3, and HMAC, the hash-based MAC alternative to polynomial MACs.

## Tests

The test suite verifies correctness against the canonical **RFC 8439 §2.5.2** Poly1305 test vector (key, message, clamped `r`, and tag), checks that tampering with either the message or the tag fails verification, and proves the **key-reuse forgery** honestly — recovering the real `r`/`s` from two single-block tags and confirming the forged tag verifies under genuine `@noble/ciphers` Poly1305 for the RFC key and 50 random keys. It also pins the two ways the recovery could lie: every surviving candidate must be a genuine clamped `r` (a candidate of the form `r + k·2¹²⁸` shares the real `r`'s low 16 bytes and would otherwise pass a mask-only test), and message pairs that underdetermine the key must be reported as ambiguous rather than answered with a guess. It also runs an automated [axe-core](https://github.com/dequelabs/axe-core) accessibility audit over the rendered UI. Color contrast for both themes meets WCAG 2.1 AA (≥ 4.5:1 for text).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Merkle Vault

- **slug**: `crypto-lab-merkle-vault`
- **repo**: https://github.com/systemslibrarian/crypto-lab-merkle-vault
- **live**: https://systemslibrarian.github.io/crypto-lab-merkle-vault/
- **commit_sha**: `b2ee9a4df60f11031ddd8e320dbe19544b2287a9` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS  ·  **level**: beginner  ·  **--accent**: #c99b45
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: Merkle Vault  — _read from src/main.ts_

**Subtitle**: Binary hash tree · SHA-256 · O(log n) inclusion proofs  — _read from src/main.ts_

**Description**: Build a binary Merkle tree with real SHA-256, generate O(log n) inclusion proofs for any leaf, and watch tamper detection invalidate the root.  — _read from src/main.ts_

**Why it matters**: Merkle proofs let a client confirm one record belongs to a massive dataset by checking only a handful of hashes — the backbone of Git, Bitcoin, and Certificate Transparency. Domain separation is what keeps those proofs unforgeable.  — _read from src/main.ts_

**Card copy**: The structural view: draw a tree up to 16 leaves with real SHA-256, walk one proof climb level by level, then mount a second-preimage attack and an append-only consistency check on the tree you built.

**Chips**: SHA-256 · Merkle Tree · Inclusion Proofs · Certificate Transparency

**Implements**: Merkle tree `src/consistency.ts:48`, SHA-256 `src/merkle.ts:113`

**Attacks shown**: Malleability (unspecified) `src/main.ts:35`

**Comment-only (named in code comments, not executed)**: Pairing `src/merkle.ts:33`

**References**: BLAKE3, Bloom filter, LMS, SHA-1, SHA-3, SHA-512, SLH-DSA, SPHINCS+

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 6962` — first seen README.md:8 (44×)
- `RFC 9162` — first seen README.md:14 (6×)
- `rfc6962` — first seen src/main.ts:42 (7×)

**Stated limitations (page)**:

- _(scope-note, src/main.ts)_ Where this sits: the Vault is about the structure — the drawn tree, one climb walked level by level with the nodes lighting up as the running hash rises, and the two roots asserted equal byte for byte at the top. If you want proof semantics instead — the trust model of who supplies the root, byte-level hash preimages, RFC 9162 index-based verification, and a real Certificate Transparency entry checked against Google's Argon log — that is crypto-lab-merkle-proofs. The two labs share a subject and deliberately answer different questions about it.

**README — What Can Go Wrong**:

```text
- Missing domain separation: without 0x00/0x01 prefixes, an internal node hash can be presented as a leaf hash, constructing a valid-looking proof for data not in the tree (second preimage attack on tree structure). **You can run this on the page** — flip the convention to "No domain separation" and the forged 64-byte payload is accepted by the real verifier; flip it back and the same payload is refused.
- Odd-leaf duplication leaks: duplicating the last leaf to even the tree can allow an attacker to forge proofs for the duplicated position - implementations should track which positions are real vs. duplicated. This demo lets you switch into that (Bitcoin) mode and see it: `[a,b,c]` and `[a,b,c,c]` collide on one root (CVE-2012-2459), and any proof step that is a self-copy is flagged. The RFC 6962 default (promote, not duplicate) removes the leak entirely.
- Root confusion across trees: a valid inclusion proof is only meaningful relative to a specific root. Without binding the root to a signed, timestamped commitment, an attacker can substitute a different tree with the same structure.
- Hash function weakness: Merkle tree security reduces entirely to collision resistance of the underlying hash. SHA-1-based Merkle trees (early Git) are weakened by SHAttered - Git is migrating to SHA-256.
- Unbalanced trees and depth confusion: non-binary or unbalanced tree implementations can produce ambiguous proof paths where the same proof validates against multiple roots.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-merkle-vault

[![crypto-lab portfolio](https://img.shields.io/badge/crypto--lab-portfolio-blue?style=flat-square)](https://systemslibrarian.github.io/crypto-lab/)
[![Deploy to GitHub Pages](https://github.com/systemslibrarian/crypto-lab-merkle-vault/actions/workflows/pages.yml/badge.svg)](https://github.com/systemslibrarian/crypto-lab-merkle-vault/actions/workflows/pages.yml)

## What It Is

crypto-lab-merkle-vault implements binary Merkle trees and inclusion proofs using SHA-256 via the Web Crypto API. A Merkle tree is a binary hash tree where leaf nodes contain hashes of data items and internal nodes contain hashes of their children, producing a single root hash that cryptographically commits to the entire dataset. An inclusion proof demonstrates that a specific item is in the tree using only O(log n) hashes - for a million-item dataset, 20 hashes suffice. The security model is collision resistance of SHA-256: an attacker cannot produce a valid proof for an item not in the tree without finding a SHA-256 collision. Domain separation prefixes (0x00 for leaves, 0x01 for internal nodes) prevent second preimage attacks on the tree structure per RFC 6962.

The live tree is **drawn** — SVG connector lines run from every parent node to its two children — and generating a proof **highlights the exact sibling consumed at each level** as the target leaf climbs to the root. A step-by-step **"walk the proof"** mode advances one level at a time, showing the running hash, the sibling being combined, and the resulting parent, with the corresponding tree nodes lighting up in sync — so O(log n) siblings become an internalized mechanism rather than a text list. When the climb reaches the top, the recomputed root and the committed root are shown **side by side and asserted equal byte-for-byte** (turning green on a match, red after a tamper) instead of a bare "VALID" line.

**The second-preimage attack is mounted, not described.** A domain-separation toggle rebuilds the same items under the naive convention — `leaf = SHA-256(data)`, `node = SHA-256(L || R)`, no prefixes — and then runs the attack the prefixes exist to stop. Take the internal node above leaves 0 and 1: its 64 raw child bytes `L || R` are themselves a valid leaf payload whose leaf hash *is* that node's hash. Presented with the sibling path from that node upward, the ordinary `verifyProof()` rebuilds the genuine committed root for 64 bytes that were never in the list. The page shows the impersonated node, the forged payload, its leaf hash, the collision check, the recomputed root, and the verifier's own verdict — then the identical computation under RFC 6962, where the leaf hashes into a disjoint space and the forgery is refused. One byte of prefix is the entire difference, and both outcomes are computed on every render.

**Consistency (append-only) proofs.** An inclusion proof says an item is in the tree you published; it says nothing about whether today's tree is last week's tree plus new entries. The RFC 6962 §2.1.2 consistency proof is the check a log auditor actually runs, and it now has its own panel: choose what the log operator did between the two published roots — append honestly, rewrite an old entry, delete one, or reorder two — and the RFC 9162 verification algorithm runs against the old root the auditor already holds. Every tampering case still *grows* the log, so nothing is caught merely because the size shrank. The panel prints the old and new roots, the O(log n) proof hashes, and the roots the replay actually rebuilds, each flagged against the root it is supposed to equal — so a rejection shows its own reasoning instead of asserting a verdict.

**Odd-node handling is selectable, and the default is the safe one.** When a level has an odd number of nodes, the demo defaults to the RFC 6962 rule — the lone node is *promoted* (carried up unchanged), never duplicated. A "Bitcoin — duplicate" mode is also provided, which instead hashes the lone node with a copy of itself. That Bitcoin convention is the exact CVE-2012-2459 block-malleability pattern: the leaf lists `[a,b,c]` and `[a,b,c,c]` hash to the *same* root. The app computes both roots live from real SHA-256 so you can see the collision appear in Bitcoin mode and disappear in RFC 6962 mode. To keep the core build/prove/tamper loop uncluttered for a first read, the odd-node selector and this malleability demonstration live in a collapsed **"Advanced"** subsection beneath the main loop. This is why the "per RFC 6962" framing above is honest for the default construction, and the vulnerable mode is clearly labelled as such.

## Where This Sits Next to crypto-lab-merkle-proofs

Two labs in this catalog cover Merkle trees, and they are not interchangeable. **This one is about
the structure**: the tree is drawn with parent→child connectors, a single proof is *walked* one level
at a time with the corresponding nodes lighting up as the running hash rises, the recomputed and
committed roots are asserted equal byte for byte at the top, and the odd-node convention, the
second-preimage attack, and the append-only audit are each mounted against the tree you personally
built. **[crypto-lab-merkle-proofs](https://systemslibrarian.github.io/crypto-lab-merkle-proofs/) is
about proof semantics**: the trust model of who supplies the root, byte-level hash preimages for
every step, RFC 9162 index-based verification, and a pinned real Certificate Transparency entry
checked against Google's Argon log. Start here for *what a Merkle tree is and how one climb works*;
go there for *what a proof does and does not entitle you to believe*.

## When to Use It

- Use Merkle trees when you need to commit to a large dataset and later prove membership of individual items efficiently - blockchain transactions, certificate logs, software package manifests.
- Use inclusion proofs when verifiers cannot download the full dataset but need cryptographic assurance that a specific item is present.
- Use append-only Merkle logs (as in Certificate Transparency) when you need a tamper-evident audit trail where deletions are detectable — the consistency-proof panel on the page runs exactly that check, including the rewrite, delete, and reorder cases it catches.
- Do not use Merkle trees for exclusion proofs without additional structure - proving an item is NOT in a tree requires sorted Merkle trees or accumulators.
- Do not omit domain separation prefixes - the second preimage attack on trees without 0x00/0x01 prefixes is a real structural vulnerability, not a theoretical concern.
- Do NOT treat this as production code - it is a teaching demo for exploring Merkle tree structure and proofs, not a hardened transparency-log library.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/)**

Enter up to 16 items (or use the library catalog, Git commits, or transaction presets), build the tree with real SHA-256, select any leaf, and generate an inclusion proof. The tree is drawn with parent→child connector lines, and generating a proof highlights the sibling pulled in at each level. Press **"Walk the proof"** to climb one level at a time — the running hash, the sibling being combined, and the resulting parent are shown while the matching tree nodes light up. At the top, the recomputed root is asserted equal to the committed root byte-for-byte. Click "Tamper leaf" to modify one item and watch the root change, the highlighted proof path flag as tampered, and the equality assertion turn red. The gated **Advanced** subsection exposes the odd-node convention (RFC 6962 promote vs Bitcoin duplicate): in Bitcoin mode a proof that lands on a self-copied position is flagged as an "odd-leaf duplication leak," and the live malleability panel recomputes `root([a,b,c])` vs `root([a,b,c,c])` under both conventions. The proof size calculator shows how O(log n) scales to billions of items.

## What Can Go Wrong

- Missing domain separation: without 0x00/0x01 prefixes, an internal node hash can be presented as a leaf hash, constructing a valid-looking proof for data not in the tree (second preimage attack on tree structure). **You can run this on the page** — flip the convention to "No domain separation" and the forged 64-byte payload is accepted by the real verifier; flip it back and the same payload is refused.
- Odd-leaf duplication leaks: duplicating the last leaf to even the tree can allow an attacker to forge proofs for the duplicated position - implementations should track which positions are real vs. duplicated. This demo lets you switch into that (Bitcoin) mode and see it: `[a,b,c]` and `[a,b,c,c]` collide on one root (CVE-2012-2459), and any proof step that is a self-copy is flagged. The RFC 6962 default (promote, not duplicate) removes the leak entirely.
- Root confusion across trees: a valid inclusion proof is only meaningful relative to a specific root. Without binding the root to a signed, timestamped commitment, an attacker can substitute a different tree with the same structure.
- Hash function weakness: Merkle tree security reduces entirely to collision resistance of the underlying hash. SHA-1-based Merkle trees (early Git) are weakened by SHAttered - Git is migrating to SHA-256.
- Unbalanced trees and depth confusion: non-binary or unbalanced tree implementations can produce ambiguous proof paths where the same proof validates against multiple roots.

## Real-World Usage

- Git object model: a commit object references a tree object by hash, and each tree references its subtrees and blobs by hash, forming a Merkle DAG over the directory structure rather than a balanced binary tree. Changing one file changes every hash above it, making the entire repository history tamper-evident. The default object hash is still SHA-1 (hardened against SHAttered since v2.13); SHA-256 is available as an opt-in repository format.
- Bitcoin SPV: lightweight Bitcoin clients verify transaction inclusion using Merkle proofs against the block header's Merkle root, downloading only 80-byte headers rather than full blocks.
- Certificate Transparency (RFC 6962): publicly trusted TLS certificates are logged in append-only Merkle logs; Chrome and Safari require Signed Certificate Timestamps (a log's signed promise to include the certificate) at connection time, and auditors later check the corresponding Merkle inclusion proofs against the log's signed tree head.
- Package managers, as a contrast: npm, Yarn, and Cargo do *not* build Merkle trees. They pin a flat, independent hash per artifact - npm and Yarn record a Subresource-Integrity `integrity` string (normally sha512) for each tarball in `package-lock.json` / `yarn.lock`, and Cargo records a sha256 `checksum` per package in `Cargo.lock`. That detects a tampered download, but there is no root and no O(log n) inclusion proof: verifying one package means holding a hash for every package. The tree structure in this demo is exactly what buys you the logarithmic proof.
- Ethereum state trie: Ethereum's Patricia-Merkle trie commits to the entire world state (all account balances and contract storage) in each block header.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-merkle-vault
cd crypto-lab-merkle-vault
npm install
npm run dev      # dev server
npm test         # crypto unit tests (KATs, round-trip, forgery, CVE-2012-2459, second-preimage, consistency, fuzz)
npm run build    # tsc --noEmit + vite build
npm run test:a11y  # Playwright: WCAG A/AA gate (axe-core) + e2e/demo.spec.ts behaviour gate
`​``

## Related Demos

- [crypto-lab-babel-hash](https://systemslibrarian.github.io/crypto-lab-babel-hash/) - SHA-256, SHA3-256, BLAKE3 internals behind the tree.
- [crypto-lab-hash-zoo](https://systemslibrarian.github.io/crypto-lab-hash-zoo/) - Merkle-Damgard hash construction and properties.
- [crypto-lab-sphincs-ledger](https://systemslibrarian.github.io/crypto-lab-sphincs-ledger/) - SLH-DSA hash-based signatures built on Merkle trees.
- [crypto-lab-lms-ledger](https://systemslibrarian.github.io/crypto-lab-lms-ledger/) - LMS/HSS stateful hash-based signatures using Merkle authentication paths.
- [crypto-lab-collision-vault](https://systemslibrarian.github.io/crypto-lab-collision-vault/) - what happens when the underlying hash's collision resistance fails.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Bcrypt Forge

- **slug**: `crypto-lab-bcrypt-forge`
- **repo**: https://github.com/systemslibrarian/crypto-lab-bcrypt-forge
- **live**: https://systemslibrarian.github.io/crypto-lab-bcrypt-forge/
- **commit_sha**: `07f6e3db0e156a8b9042b748f0054635b490f332` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS  ·  **level**: beginner  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, verification

**Name (H1)**: bcrypt Forge  — _read from index.html_

**Subtitle**: Password Hashing · Adaptive Cost · Salted  — _read from index.html_

**Description**: Generate real bcrypt hashes in your browser, dissect their version/cost/salt/hash anatomy, benchmark how each cost step doubles the work, and watch salting and timing-safe verification hold up against breach and precomputed-table attacks.  — _read from index.html_

**Why it matters**: Leaked password databases are inevitable; what saves your users is how the passwords were stored. bcrypt's deliberate slowness and per-user salt turn an instant plaintext or MD5 catastrophe into a per-account grind the attacker pays for one guess at a time. Panel 6 runs that attack for real and prints the measured bill.  — _read from index.html_

**Card copy**: Bcrypt anatomy, cost factor benchmarking, timing-safe verification, and a real-world breach simulation. The workhorse password hash, dissected.

**Chips**: bcrypt · Blowfish · Cost Factor · Timing-Safe

**Implements**: bcrypt `src/lib.ts:20`, MD5 `src/lib.ts:116`, PBKDF2 `src/crypto-client.ts:108`, SHA-256 `src/crypto-worker.ts:75`

**Attacks shown**: Brute force `src/exhibits.ts:528`, Dictionary attack `src/exhibits.ts:1177`, Timing side-channel `README.md:28`

**Comment-only (named in code comments, not executed)**: Blowfish `src/crypto-client.ts:114`, HMAC `src/crypto-client.ts:107`

**References**: AES, Argon2, Blowfish, ChaCha20, ChaCha20-Poly1305, Falcon, HKDF, HMAC, Poly1305, Rainbow chains, SHA-512, scrypt

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `NIST SP 800-63B` — first seen src/exhibits.ts:843 (2×)
- `SP 800-132` — first seen src/exhibits.ts:843 (1×)
- `sp800-63b` — first seen src/exhibits.ts:871 (1×)

**README — What Can Go Wrong**:

```text
- **72-byte input limit:** bcrypt only hashes the first 72 bytes of a password, so very long or multibyte passwords can share a prefix and collide.
- **Null-byte truncation:** some bcrypt implementations truncate at the first NUL byte, silently weakening passwords that contain one.
- **Cost factor set too low:** a cost that was safe years ago becomes cheap to brute-force as hardware improves, so it must be raised over time.
- **Cost factor set too high:** an excessive cost can turn login into a denial-of-service vector under load.
- **Wrong primitive:** bcrypt is for passwords, not general-purpose encryption, API tokens, or session identifiers.
```

**Claims tested** (e2e/claims.spec.ts, 16 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:49
    - :49 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:56
    - :56 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:62
    - :62 `toBeVisible` expected _no expected value_ _(none)_
- `the anatomy display dissects a real bcrypt hash without losing a character` — e2e/claims.spec.ts:84
    - :90 `toBeVisible` expected `{ timeout: 30_000 }` _(expression)_
    - :93 `toMatch` expected `BCRYPT_RE` _(expression)_
    - :102 `toBe` expected `whole` _(expression)_
    - :105 `toHaveLength` expected `22` _(literal)_
    - :106 `toHaveLength` expected `31` _(literal)_
    - :107 `toContainText` expected `'Salt (22 chars)'` _(literal)_
    - :108 `toContainText` expected `'Hash (31 chars)'` _(literal)_
    - :110 `toEqual` expected `[]` _(expression)_
- `the generated hash carries the requested cost and the work bar matches it` — e2e/claims.spec.ts:117
    - :125 `toHaveText` expected `'6'` _(literal)_
    - :128 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :131 `toMatch` expected `BCRYPT_RE` _(expression)_
    - :135 `toBe` expected `6` _(literal)_
    - :138 `toContainText` expected `'1/16×'` _(literal)_
    - :141 `toMatch` expected `/^Computed in [\d.]+ ms$/u` _(regex)_
- `a hash from Exhibit 2 verifies in Exhibit 4 — the two panels agree about one hash` — e2e/claims.spec.ts:144
    - :155 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :158 `toMatch` expected `BCRYPT_RE` _(expression)_
    - :167 `toContainText` expected `'✓ Match', {` _(expression)_
    - :173 `toContainText` expected _no expected value_ _(none)_
- `editing the generator inputs retires the hash they produced` — e2e/claims.spec.ts:179
    - :186 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :187 `toContainText` expected `'1/16×'` _(literal)_
    - :194 `toHaveCount` expected `0` _(literal)_
    - :195 `expect` expected _no expected value_ _(none)_
    - :196 `expect` expected _no expected value_ _(none)_
    - :200 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :202 `toHaveCount` expected `0` _(literal)_
    - :203 `expect` expected _no expected value_ _(none)_
- `the benchmark rows agree with their own timings, and the legend appears only after a run` — e2e/claims.spec.ts:210
    - :221 `toHaveAttribute` expected `'hidden', ''` _(expression)_
    - :222 `toBeVisible` expected _no expected value_ _(none)_
    - :225 `toHaveText` expected `'Benchmark complete.', { timeout: 180_000 }` _(expression)_
    - :227 `toBeVisible` expected _no expected value_ _(none)_
    - :230 `toHaveCount` expected `7` _(literal)_
    - :259 `expect` expected _no expected value_ _(none)_
    - :260 `expect` expected _no expected value_ _(none)_
    - :264 `toBe` expected `timeMs <= 250 ? 'feels instant' : 'attacker-costly'` _(expression)_
    - :265 `toHaveClass` expected _no expected value_ _(none)_
    - :270 `toHaveClass` expected _no expected value_ _(none)_
    - :275 `toEqual` expected `[8, 9, 10, 11, 12, 13, 14]` _(expression)_
    - :281 `expect` expected _no expected value_ _(none)_
    - :282 `expect` expected _no expected value_ _(none)_
    - :284 `toBeCloseTo` expected `100, 1` _(expression)_
    - :288 `expect` expected _no expected value_ _(none)_
    - :297 `toBe` expected `10_000` _(expression)_
    - :298 `toBe` expected `costs[0]` _(expression)_
    - :302 `expect` expected _no expected value_ _(none)_
    - :303 `expect` expected _no expected value_ _(none)_
    - :309 `toEqual` expected `costs.map((cost) => 'Cost ${cost}')` _(expression)_
- `the example pairs reach opposite verdicts, each earned from a real compare` — e2e/claims.spec.ts:316
    - :328 `toBeEnabled` expected `{ timeout: 60_000 }` _(expression)_
    - :332 `toMatch` expected `BCRYPT_RE` _(expression)_
    - :333 `toBe` expected `'correcthorsebatterystaple'` _(literal)_
    - :336 `toContainText` expected `'✓ Match', {` _(expression)_
    - :343 `toBe` expected `loadedHash` _(expression)_
    - :344 `toBe` expected `'wrongpassword'` _(literal)_
    - :347 `toContainText` expected `'✗ No match', {` _(expression)_
- `a verdict does not outlive the inputs it was computed from` — e2e/claims.spec.ts:352
    - :358 `toBeEnabled` expected `{ timeout: 60_000 }` _(expression)_
    - :361 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :366 `toHaveCount` expected `0` _(literal)_
    - :367 `toContainText` expected `'Inputs changed'` _(literal)_
    - :372 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :377 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :379 `toHaveCount` expected `0` _(literal)_
    - :380 `toContainText` expected `'Inputs changed'` _(literal)_
    - :386 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :388 `toHaveCount` expected `0` _(literal)_
- `a malformed hash is refused before any compare is attempted` — e2e/claims.spec.ts:391
    - :398 `toContainText` expected `'Invalid bcrypt hash format'` _(literal)_
    - :403 `toContainText` expected _no expected value_ _(none)_
    - :406 `toHaveCount` expected `0` _(literal)_
- `every algorithm row expands, and its detail is hidden until it does` — e2e/claims.spec.ts:413
    - :418 `toHaveCount` expected `6` _(literal)_
    - :421 `toHaveCount` expected `6` _(literal)_
    - :423 `toBeVisible` expected _no expected value_ _(none)_
    - :424 `toHaveAttribute` expected `'aria-expanded', 'false'` _(expression)_
    - :430 `toHaveAttribute` expected `'aria-expanded', 'true'` _(expression)_
    - :431 `toBeVisible` expected _no expected value_ _(none)_
    - :432 `expect` expected _no expected value_ _(none)_
    - :435 `toHaveAttribute` expected `'aria-expanded', 'false'` _(expression)_
    - :436 `toBeVisible` expected _no expected value_ _(none)_
- `the plaintext breach reveals exactly the stored passwords` — e2e/claims.spec.ts:443
    - :448 `toHaveCount` expected `DEMO_USERS.length` _(expression)_
    - :450 `toBe` expected `'••••••••'` _(literal)_
    - :458 `toEqual` expected `DEMO_USERS.map((user) => user.password)` _(expression)_
    - :459 `toBeVisible` expected _no expected value_ _(none)_
    - :460 `toBeDisabled` expected _no expected value_ _(none)_
- `the precomputed-table button is never live before its table exists` — e2e/claims.spec.ts:463
    - :480 `expect` expected _no expected value_ _(none)_
    - :490 `toBe` expected `true` _(expression)_
    - :491 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :492 `toBeEnabled` expected `{ timeout: 60_000 }` _(expression)_
    - :496 `toContainText` expected `'Precomputed', { timeout: 120_000 }` _(expression)_
- `the precomputed-table lookup is a real lookup, and its counter matches the cells` — e2e/claims.spec.ts:499
    - :507 `toHaveCount` expected `DEMO_USERS.length, { timeout: 60_000 }` _(expression)_
    - :510 `expect` expected _no expected value_ _(none)_
    - :518 `toMatch` expected `/^[0-9a-f]{32}$/u` _(regex)_
    - :519 `toBe` expected `digests[4]` _(expression)_
    - :520 `toBe` expected `DEMO_USERS.length - 1` _(expression)_
    - :523 `toContainText` expected `'1 hash(es) appear more than once'` _(literal)_
    - :525 `toBeEnabled` expected `{ timeout: 60_000 }` _(expression)_
    - :527 `toContainText` expected `'Precomputed', { timeout: 120_000 }` _(expression)_
    - :533 `expect` expected _no expected value_ _(none)_
    - :547 `toBe` expected `DEMO_USERS[index].password` _(expression)_
    - :553 `toEqual` expected `['ivan']` _(expression)_
    - :554 `toHaveLength` expected `DEMO_USERS.length - 1` _(expression)_
    - :558 `toBe` expected `hits.length` _(expression)_
    - :559 `toBe` expected `DEMO_USERS.length` _(expression)_
    - :560 `expect` expected _no expected value_ _(none)_
    - :563 `toBe` expected _no expected value_ _(none)_
    - :566 `toBeVisible` expected _no expected value_ _(none)_
    - :569 `expect` expected _no expected value_ _(none)_
    - :570 `expect` expected _no expected value_ _(none)_
- `the bcrypt dictionary attack reports the accounts it actually cracked, and retires that report when the cost changes` — e2e/claims.spec.ts:574
    - :589 `toBeEnabled` expected `{ timeout: 240_000 }` _(expression)_
    - :591 `toHaveText` expected `'4'` _(literal)_
    - :592 `toBeEnabled` expected `{ timeout: 240_000 }` _(expression)_
    - :596 `toHaveLength` expected `DEMO_USERS.length` _(expression)_
    - :598 `toBe` expected `4` _(literal)_
    - :601 `toBe` expected `stored[4]` _(expression)_
    - :602 `toBe` expected `DEMO_USERS.length` _(expression)_
    - :605 `toContainText` expected `'Result at cost', { timeout: 240_000 }` _(expression)_
    - :617 `toMatch` expected `new RegExp('^${user.password.replace(/[$#]/gu, '\\$&')} \\(word #\\d+\\)$', 'u')` _(expression)_
    - :623 `toBe` expected `cracked.length` _(expression)_
    - :624 `toBe` expected `DEMO_USERS.length` _(expression)_
    - :625 `toBe` expected `survived.length` _(expression)_
    - :626 `toBe` expected `4` _(literal)_
    - :629 `expect` expected _no expected value_ _(none)_
    - :632 `expect` expected _no expected value_ _(none)_
    - :638 `toBe` expected `4` _(literal)_
    - :639 `toBe` expected `attempts` _(expression)_
    - :642 `toBe` expected `4` _(literal)_
    - :643 `toBe` expected `rate` _(expression)_
    - :644 `toBeVisible` expected _no expected value_ _(none)_
    - :651 `toHaveText` expected `'8'` _(literal)_
    - :653 `expect` expected _no expected value_ _(none)_
    - :654 `expect` expected _no expected value_ _(none)_
    - :655 `toBeVisible` expected _no expected value_ _(none)_
    - :656 `toBeVisible` expected _no expected value_ _(none)_
    - :657 `toBe` expected `'Run Real Dictionary Attack'` _(literal)_
    - :661 `toBeEnabled` expected `{ timeout: 240_000 }` _(expression)_
    - :663 `toBe` expected `'not attempted'` _(literal)_
    - :667 `toBe` expected `8` _(literal)_

**Mutation records** (1 file(s)):

- `mutation-evidence.json` (749 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-bcrypt-forge

## What It Is

bcrypt is a password hashing function designed by Niels Provos and David Mazières (1999), built on the Blowfish cipher with a deliberately slow and adaptive cost factor. Its "cost" is literally an exponent: the expensive Eksblowfish key schedule re-mixes the password and salt into a 4 KB Blowfish state 2^cost times, so each +1 to the cost doubles the work — that iterated key setup is *why* bcrypt is intrinsically slow. It is one of the most widely deployed password hashing schemes in production systems: the default in Rails and PHP, a common choice in Node.js, and the default password hash on OpenBSD, where it originated. On Linux, bcrypt (`$2b$`) is supported through libxcrypt but is *not* the `/etc/shadow` default — most distributions use SHA-512-crypt (`$6$`), and Debian 11+, Ubuntu 22.04+, and Fedora 35+ default to yescrypt (`$y$`). Its adaptive cost factor allows security to be maintained as hardware improves without changing the stored hash format. The security model is one-way: hashes cannot be reversed, only verified.

## When to Use It

- ✅ Storing user passwords in any web application
- ✅ When your stack defaults to bcrypt (Rails, PHP, Node.js)
- ✅ When FIPS compliance is not required and Argon2 is not available
- ✅ Migrating away from plaintext, MD5, or raw SHA passwords
- ❌ Do not use for general-purpose data encryption (use AES-256-GCM)
- ❌ Do not use for API tokens or session IDs (use secure random bytes)
- ❌ Prefer Argon2id for new systems where you have freedom of choice
- ❌ Do NOT treat this as production crypto — it is a teaching demo, not a hardened auth system

## Live Demo

**[systemslibrarian.github.io/crypto-lab-bcrypt-forge](https://systemslibrarian.github.io/crypto-lab-bcrypt-forge/)**

Six exhibits:

1. **Anatomy** — color-annotated bcrypt output (version/cost/salt/hash), plus a "Why bcrypt is slow" panel that **executes the real Eksblowfish key schedule** at a cost you pick: the grid and round counter are driven by rounds that genuinely completed, so the wait you sit through doubles with every +1 to cost. Plus an interactive **72-byte-limit** demo where two long passwords that share a 72-byte prefix cross-verify.
2. **Hash Generator** — live cost slider with real timing.
3. **Benchmark** — cost factors 8–14 with a ~250 ms "login sweet spot" threshold marker so the recommended cost is visually motivated (fast enough for login, slow enough for attackers).
4. **Verify** — timing-safe comparison framed as a *secondary* hardening (slowness + salt is the headline), with a choice between measuring real microsecond timings over thousands of trials or a clearly-labeled simulated/exaggerated leak.
5. **Alternatives** — algorithm comparison table (bcrypt vs Argon2id vs scrypt vs PBKDF2 vs MD5) with inline definitions for terms like *timing oracle* and *PRF*.
6. **Attack Demo** — plaintext vs unsalted MD5 vs bcrypt, attacked for real. The MD5 scenario builds an **actual precomputed lookup table** (MD5 of every word in the bundled common-password list) and recovers accounts by lookup — an account whose password is not in the list genuinely survives. The bcrypt scenario runs an **actual dictionary attack**: every guess is a real `bcrypt.compare` against a real stored hash, and the panel reports the attempts that executed and the rate measured. A **cost-downgrade selector** re-hashes the database at cost 4, 8, or 12 and reruns the identical attack, so the cost factor is the only variable — at cost 4 the list finishes in seconds and the weak accounts fall; at cost 12 the same attack barely starts. alice/eve share a password so salting's effect is visible at a glance.

A rainbow table would store only chain endpoints and trade memory for lookup time; this exhibit stores every pair, which is the simplest precomputation and enough to make the point about salts.

Every hash is **real, computed in your browser** — never simulated, and no progress bar is driven by a timer. All CPU-heavy work (bcrypt, PBKDF2, MD5) runs in a **Web Worker**, so the UI stays smooth even while hashing at cost 14.

## What Can Go Wrong

- **72-byte input limit:** bcrypt only hashes the first 72 bytes of a password, so very long or multibyte passwords can share a prefix and collide.
- **Null-byte truncation:** some bcrypt implementations truncate at the first NUL byte, silently weakening passwords that contain one.
- **Cost factor set too low:** a cost that was safe years ago becomes cheap to brute-force as hardware improves, so it must be raised over time.
- **Cost factor set too high:** an excessive cost can turn login into a denial-of-service vector under load.
- **Wrong primitive:** bcrypt is for passwords, not general-purpose encryption, API tokens, or session identifiers.

## Real-World Usage

- Ruby on Rails `has_secure_password` uses bcrypt by default.
- PHP's `password_hash()` defaults to the bcrypt algorithm.
- Node.js applications widely use the `bcrypt` / `bcryptjs` libraries for credential storage.
- OpenBSD uses bcrypt as its default password hash — the scheme was designed there (Provos & Mazières, USENIX 1999).
- On Linux, libxcrypt implements bcrypt (`$2b$`) so such hashes verify fine, but it is not the `/etc/shadow` default: distributions ship SHA-512-crypt (`$6$`), or yescrypt (`$y$`) on Debian 11+, Ubuntu 22.04+, and Fedora 35+.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-bcrypt-forge
cd crypto-lab-bcrypt-forge
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-kdf-arena](https://systemslibrarian.github.io/crypto-lab-kdf-arena/) — HKDF, PBKDF2, scrypt, and Argon2id compared.
- [crypto-lab-kdf-chain](https://systemslibrarian.github.io/crypto-lab-kdf-chain/) — chaining KDFs across HKDF/PBKDF2/scrypt/Argon2id.
- [crypto-lab-phantom-vault](https://systemslibrarian.github.io/crypto-lab-phantom-vault/) — PBKDF2-SHA-256 key derivation in practice.
- [crypto-lab-shadow-vault](https://systemslibrarian.github.io/crypto-lab-shadow-vault/) — Argon2id with ChaCha20-Poly1305 encryption.
- [crypto-lab-hash-zoo](https://systemslibrarian.github.io/crypto-lab-hash-zoo/) — the underlying hash families and why password hashing differs.

## Architecture

- **No frameworks.** Vanilla TypeScript, plain CSS with design tokens, mobile-first, WCAG 2.1 AA, dark theme, and `prefers-reduced-motion` support.
- **Web Worker crypto.** `src/crypto-worker.ts` runs bcrypt, PBKDF2, and MD5 off the main thread; `src/crypto-client.ts` is a promise-based RPC wrapper. Timings are measured *inside* the worker, so the benchmark numbers reflect the raw primitive rather than scheduling overhead — and the UI never freezes. Long-running operations (the key schedule, the dictionary attack) stream **genuine progress** back over the same channel, so on-screen counters only ever report work that actually happened.
- **Pure, tested core.** `src/lib.ts` holds DOM-free helpers (MD5, bcrypt-hash parsing, duration formatting, and the common-password wordlist both attacks run against) covered by `npm test` — including MD5 known-answer vectors and a bcryptjs round-trip integration test.

## Deploy to GitHub Pages

This repository includes a workflow at `.github/workflows/deploy-pages.yml`.

1. Push to the `main` branch.
2. In GitHub, go to **Settings > Pages**.
3. Set **Source** to **GitHub Actions**.
4. Wait for the **Deploy to GitHub Pages** workflow to finish.

Your site will be published at:
**https://systemslibrarian.github.io/crypto-lab-bcrypt-forge/**

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Bitcoin Wallet

- **slug**: `crypto-lab-bitcoin-wallet`
- **repo**: https://github.com/systemslibrarian/crypto-lab-bitcoin-wallet
- **live**: https://systemslibrarian.github.io/crypto-lab-bitcoin-wallet/
- **commit_sha**: `a7913cef513f22e3fc095fa23071e0078b887e38` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `0eceb67b039bbce7daa2b4af5987863d1cb777c8`
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS  ·  **level**: intermediate  ·  **--accent**: #000000
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Bitcoin Wallet  — _read from src/ui.ts_

**Subtitle**: secp256k1 · HASH160 · Base58Check · Bech32 · BIP-39 · BIP-32  — _read from src/ui.ts_

**Description**: Runs the real derivation chain in your browser — 32 random bytes → secp256k1 public key → HASH160 → P2PKH & P2WPKH addresses, plus a BIP-39 mnemonic decoded to a BIP-32 master key and walked down a derivation path.  — _read from src/ui.ts_

**Why it matters**: Those 12 words and 32 bytes ARE the money — anyone who sees them can spend your Bitcoin, and there is no reset. Knowing how the chain is built is how you tell a safe wallet from a trap, and why hardware keys exist.  — _read from src/ui.ts_

**Card copy**: Bitcoin wallet pipeline in the browser — secp256k1 keys to P2PKH and P2WPKH addresses via HASH160, plus BIP-39 mnemonics, PBKDF2 seed stretching, and BIP-32 hardened child derivation.

**Chips**: secp256k1 · BIP-32 · BIP-39 · Bech32

**Implements**: HMAC `src/engine.ts:250`, PBKDF2 `src/engine.ts:186`, secp256k1 `src/engine.ts:9`, SHA-256 `src/engine.ts:40`, SHA-512 `src/engine.ts:191`

**Attacks shown**: Nonce reuse `src/ui.ts:1278`

**Comment-only (named in code comments, not executed)**: BCH `src/qr.ts:326`, Reed-Solomon `src/qr.ts:41`

**References**: BIKE, BLAKE3, ECDH, ECDSA, FROST, Merkle tree, P-256, Pollard kangaroo, SHA-3, X25519

**Standards body**: IETF, NIST, SECG

**Implementation**: @noble

**Spec citations, exactly as written**:

- `ISO/IEC 18004` — first seen src/qr.ts:1 (3×)

**README — What Can Go Wrong**:

```text
- **A browser is not a vault:** keys generated in a web tab can be exposed by malicious extensions, cross-site scripting, swap files, or clipboard sniffers — never put real funds behind a browser-generated key.
- **Weak entropy:** a seed is only as strong as its randomness; a broken or backdoored RNG produces guessable keys and predictable addresses.
- **Seed-phrase phishing:** anyone who learns your mnemonic controls the funds, and fake "validate your phrase" prompts are a common theft vector.
- **No passphrase = single factor:** a BIP-39 seed with no extra passphrase rests entirely on the secrecy of the words themselves. A wrong passphrase does not fail a checksum either — it silently derives a different, perfectly valid wallet.
- **Every layer below the words can spend:** entropy → words (+ passphrase) → 64-byte seed → BIP-32 master key → child keys. A leaked child private key spends that address's coins without revealing the words, and an `xprv` spends everything under it — "only the seed can spend" is not true, which is why the page prints a child private key and WIF where you can see it.
- **Address reuse leaks privacy:** reusing one address links transactions on a public ledger; HD wallets exist precisely so each receive can use a fresh address.
```

**Claims tested** (e2e/claims.spec.ts, 18 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:42
    - :42 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:146
    - :146 `toHaveLength` expected `5` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:148
    - :148 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:210
    - :210 `toHaveCount` expected `12` _(literal)_
- `every published BIP vector recomputes to a match, and each badge agrees with the values it printed` — e2e/claims.spec.ts:234
    - :240 `toHaveCount` expected `3` _(literal)_
    - :248 `toHaveText` expected `'✓ match'` _(literal)_
    - :249 `toHaveClass` expected `/scenario-status--valid/` _(regex)_
    - :252 `expect` expected _no expected value_ _(none)_
    - :253 `toBe` expected `m![2]` _(expression)_
    - :257 `toHaveCount` expected `0` _(literal)_
    - :266 `toHaveText` expected `katAddress` _(expression)_
- `both addresses provably commit to the HASH160 the page displayed, and a second Generate replaces every value` — e2e/claims.spec.ts:272
    - :278 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :279 `toMatch` expected _no expected value_ _(none)_
    - :282 `toMatch` expected `/^[0-9a-f]{40}$/` _(regex)_
    - :287 `expect` expected _no expected value_ _(none)_
    - :294 `toBe` expected `25` _(literal)_
    - :295 `toBe` expected `0` _(literal)_
    - :296 `toBe` expected `p.hash160` _(expression)_
    - :297 `toBe` expected _no expected value_ _(none)_
    - :303 `toBe` expected `'bc'` _(literal)_
    - :304 `toBe` expected `true` _(expression)_
    - :305 `toBe` expected `0` _(literal)_
    - :306 `toBe` expected `p.hash160` _(expression)_
    - :314 `toHaveText` expected `first.hash160` _(expression)_
    - :315 `toHaveText` expected `first.p2pkh` _(expression)_
    - :316 `toHaveText` expected `first.p2wpkh` _(expression)_
    - :320 `toHaveCount` expected `2` _(literal)_
    - :321 `toHaveText` expected `first.p2pkh` _(expression)_
    - :322 `toHaveText` expected `first.p2wpkh` _(expression)_
    - :323 `toHaveCount` expected `2` _(literal)_
    - :329 `toHaveText` expected _no expected value_ _(none)_
    - :334 `toBe` expected `first[k]` _(expression)_
    - :337 `toHaveText` expected `second.hash160` _(expression)_
    - :338 `toHaveText` expected `second.p2pkh` _(expression)_
- `the bit strip accounts for all 132 bits, each band indexes its own word, and the checksum badge matches an independent SHA-256` — e2e/claims.spec.ts:344
    - :349 `toHaveLength` expected `12` _(literal)_
    - :354 `toBe` expected `128` _(literal)_
    - :355 `toBe` expected `4` _(literal)_
    - :356 `toBe` expected _no expected value_ _(none)_
    - :359 `toBe` expected `132` _(literal)_
    - :360 `toHaveLength` expected `12` _(literal)_
    - :361 `toHaveLength` expected `11` _(literal)_
    - :362 `toBe` expected `true` _(expression)_
    - :365 `toHaveLength` expected `12` _(literal)_
    - :368 `toBe` expected _no expected value_ _(none)_
    - :371 `expect` expected _no expected value_ _(none)_
    - :372 `expect` expected _no expected value_ _(none)_
    - :373 `toBe` expected `String(i + 1).padStart(2, '0')` _(expression)_
    - :378 `toEqual` expected `phrase` _(expression)_
    - :380 `toEqual` expected `phrase` _(expression)_
    - :383 `toBe` expected `true` _(expression)_
    - :384 `expect` expected _no expected value_ _(none)_
    - :385 `expect` expected _no expected value_ _(none)_
    - :389 `expect` expected _no expected value_ _(none)_
    - :390 `expect` expected _no expected value_ _(none)_
    - :391 `toBe` expected `true` _(expression)_
- `mangling the last word reaches the broken-checksum state, names the cause, and is confirmed broken by an independent SHA-256` — e2e/claims.spec.ts:397
    - :404 `toHaveText` expected `'✗ checksum broken'` _(literal)_
    - :409 `toBe` expected `false` _(expression)_
    - :413 `expect` expected _no expected value_ _(none)_
    - :414 `expect` expected _no expected value_ _(none)_
    - :421 `toEqual` expected `[11]` _(expression)_
    - :425 `toHaveValue` expected `mangled.join(' ')` _(expression)_
    - :427 `toHaveText` expected `'invalid (bad word or checksum)'` _(literal)_
    - :428 `toHaveClass` expected `/scenario-status--invalid/` _(regex)_
    - :433 `toEqual` expected `phrase` _(expression)_
    - :436 `toContainText` expected `'checksum now fails'` _(literal)_
- `flipping one entropy bit re-indexes its band and the badge tracks the recomputed checksum either way` — e2e/claims.spec.ts:442
    - :452 `toHaveAttribute` expected `'aria-pressed', wasPressed === 'true' ? 'false' : 'true'` _(expression)_
    - :453 `toHaveText` expected `wasPressed === 'true' ? '0' : '1'` _(expression)_
    - :456 `toBe` expected `1 - before.bands[0][3]` _(expression)_
    - :457 `expect` expected _no expected value_ _(none)_
    - :461 `toBe` expected `value` _(expression)_
    - :462 `toBe` expected `before.words[0].text` _(expression)_
    - :469 `expect` expected _no expected value_ _(none)_
    - :472 `toHaveCount` expected `4` _(literal)_
    - :473 `toHaveCount` expected `0` _(literal)_
- `the page can produce a one-word change the checksum misses, and both the badge and the validator call it valid` — e2e/claims.spec.ts:487
    - :502 `expect` expected _no expected value_ _(none)_
    - :507 `expect` expected _no expected value_ _(none)_
    - :511 `expect` expected _no expected value_ _(none)_
    - :514 `toHaveValue` expected `changedWords.join(' ')` _(expression)_
    - :515 `toHaveText` expected `'checksum valid'` _(literal)_
    - :521 `expect` expected _no expected value_ _(none)_
    - :522 `expect` expected _no expected value_ _(none)_
    - :523 `expect` expected _no expected value_ _(none)_
    - :524 `expect` expected _no expected value_ _(none)_
    - :525 `expect` expected _no expected value_ _(none)_
    - :529 `toContainText` expected `'still validates'` _(literal)_
- `the page never claims a wrong word always fails validation` — e2e/claims.spec.ts:532
    - :536 `expect` expected _no expected value_ _(none)_
    - :538 `expect` expected _no expected value_ _(none)_
    - :539 `toMatch` expected `/about 1 in 16/` _(regex)_
- `the address table names the purpose subtree it derives from, and the ones it does not` — e2e/claims.spec.ts:546
    - :551 `toHaveCount` expected `5` _(literal)_
    - :555 `expect` expected _no expected value_ _(none)_
    - :556 `expect` expected _no expected value_ _(none)_
    - :557 `expect` expected _no expected value_ _(none)_
    - :564 `toEqual` expected `["44'", "49'", "84'", "86'"]` _(expression)_
    - :565 `toBe` expected `"m/84'/0'/0'/0/i"` _(literal)_
    - :566 `toBe` expected `"m/86'/0'/0'/0/i"` _(literal)_
    - :567 `expect` expected _no expected value_ _(none)_
    - :570 `toHaveValue` expected `/^m\/44'/` _(regex)_
- `the xpub card does not claim only the seed can spend, while the page prints a child private key` — e2e/claims.spec.ts:577
    - :586 `toMatch` expected `/priv hex\s*[0-9a-f]{64}/` _(regex)_
    - :587 `toMatch` expected `/WIF\s*[KL5][1-9A-HJ-NP-Za-km-z]{50,}/` _(regex)_
    - :592 `expect` expected _no expected value_ _(none)_
    - :593 `expect` expected _no expected value_ _(none)_
    - :594 `expect` expected _no expected value_ _(none)_
- `the validator passes the official phrase, names its failures, and retires the verdict when the phrase is edited` — e2e/claims.spec.ts:600
    - :606 `toHaveText` expected `'awaiting input'` _(literal)_
    - :607 `toHaveClass` expected `/scenario-status--pending/` _(regex)_
    - :611 `toHaveText` expected `'checksum valid'` _(literal)_
    - :612 `toHaveClass` expected `/scenario-status--valid/` _(regex)_
    - :620 `toHaveText` expected _no expected value_ _(none)_
    - :623 `toHaveClass` expected `/scenario-status--pending/` _(regex)_
    - :624 `toContainText` expected `'no longer applies'` _(literal)_
    - :629 `toHaveText` expected `'invalid (bad word or checksum)'` _(literal)_
    - :630 `toHaveClass` expected `/scenario-status--invalid/` _(regex)_
    - :635 `toHaveText` expected `'invalid (bad word or checksum)'` _(literal)_
    - :640 `toHaveText` expected `'invalid (bad word or checksum)'` _(literal)_
    - :645 `toHaveText` expected `'awaiting input'` _(literal)_
    - :646 `toHaveClass` expected `/scenario-status--pending/` _(regex)_
- `malformed derivation paths and indices are refused by name instead of silently deriving a wrong address` — e2e/claims.spec.ts:652
    - :659 `toHaveText` expected `"Derived along m/44'/0'/0'/0/0"` _(literal)_
    - :660 `toHaveCount` expected `6` _(literal)_
    - :661 `toBeVisible` expected _no expected value_ _(none)_
    - :666 `toHaveText` expected `"Path must start with 'm', e.g. m/44'/0'/0'/0/0"` _(literal)_
    - :667 `toHaveCount` expected `0` _(literal)_
    - :668 `toHaveCount` expected `0` _(literal)_
    - :669 `toBeHidden` expected _no expected value_ _(none)_
    - :676 `toContainText` expected `'Path error'` _(literal)_
    - :677 `toContainText` expected `'"abc"'` _(literal)_
    - :678 `toHaveCount` expected `0` _(literal)_
    - :682 `toContainText` expected `'Path error'` _(literal)_
    - :683 `toContainText` expected `'out of range'` _(literal)_
    - :684 `toHaveCount` expected `0` _(literal)_
    - :688 `toContainText` expected `'Path error'` _(literal)_
    - :689 `toContainText` expected `'"1.5"'` _(literal)_
    - :695 `toHaveText` expected `"Derived along m/44'/0'/0'/0/0"` _(literal)_
    - :697 `toHaveText` expected `'Index must be a non-negative integer.'` _(literal)_
    - :698 `toHaveCount` expected `0` _(literal)_
    - :700 `toHaveText` expected `'Index must be a non-negative integer.'` _(literal)_
    - :704 `toHaveText` expected `"Derived along m/44'/0'/0'/0/0"` _(literal)_
    - :705 `toHaveCount` expected `6` _(literal)_
    - :706 `toHaveText` expected `good` _(expression)_
- `the receive index walks the same addresses the five-address table lists, and all five are distinct` — e2e/claims.spec.ts:712
    - :719 `toHaveCount` expected `5` _(literal)_
    - :724 `toBe` expected `String(i)` _(expression)_
    - :727 `toBe` expected `5` _(literal)_
    - :728 `toBe` expected `5` _(literal)_
    - :732 `toHaveText` expected `'Derived along m/44'/0'/0'/0/${i}'` _(expression)_
    - :734 `toBe` expected `table[i].p2pkh` _(expression)_
    - :735 `toBe` expected `table[i].p2wpkh` _(expression)_
    - :737 `toBe` expected `values[3]` _(expression)_
    - :738 `toBe` expected `values[3]` _(expression)_
    - :745 `toBe` expected `table[0].p2pkh` _(expression)_
- `the drill counts placed words consistently, names a wrong word, and can be restarted after completion` — e2e/claims.spec.ts:751
    - :759 `toHaveCount` expected `12` _(literal)_
    - :760 `toHaveCount` expected `12` _(literal)_
    - :761 `toHaveText` expected `'Drill started — click the words in order.'` _(literal)_
    - :766 `toHaveText` expected `'That word is out of order for slot 1. Try again.'` _(literal)_
    - :767 `toContainText` expected `'Expected ${phrase[0]}'` _(expression)_
    - :768 `toHaveCount` expected _no expected value_ _(none)_
    - :771 `toHaveText` expected `'—'` _(literal)_
    - :779 `toHaveText` expected `'Placed 1 of 12.'` _(literal)_
    - :781 `expect` expected _no expected value_ _(none)_
    - :785 `toHaveClass` expected `/memorize-slot--ok/` _(regex)_
    - :786 `toHaveCount` expected `0` _(literal)_
    - :792 `toHaveCount` expected `placed` _(expression)_
    - :793 `toHaveCount` expected `placed` _(expression)_
    - :795 `toHaveText` expected `'Placed ${placed} of 12.'` _(expression)_
    - :796 `toHaveCount` expected `12 - placed` _(expression)_
    - :798 `toHaveText` expected `'✓ Perfect — every word in order.'` _(literal)_
    - :799 `toContainText` expected `'Drill complete'` _(literal)_
    - :804 `toEqual` expected `phrase` _(expression)_
    - :808 `toHaveCount` expected `0` _(literal)_
    - :809 `toHaveCount` expected `0` _(literal)_
    - :811 `toHaveCount` expected `12` _(literal)_
    - :812 `toHaveText` expected `'Drill started — click the words in order.'` _(literal)_
- `no element carrying the hidden attribute is actually rendered` — e2e/claims.spec.ts:820
    - :839 `toEqual` expected `[]` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-bitcoin-wallet

## What It Is

A working model of **Bitcoin wallet mechanics** — the chain that turns 32 random bytes into a spendable address, and 12 words into a hierarchical-deterministic wallet — using **real cryptography in the browser**. The page composes the audited [`@noble/secp256k1`](https://github.com/paulmillr/noble-secp256k1) and [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) libraries to walk the full pipeline: secp256k1 private key → compressed public key → HASH160 (SHA-256 → RIPEMD-160) → P2PKH `1...` (Base58Check, version byte `0x00` — the original Bitcoin address format, which predates the BIP process; BIP-13 is the `3...` pay-to-script-hash format) and P2WPKH `bc1...` (Bech32, BIP-173); BIP-39 entropy → 12-word mnemonic with checksum → PBKDF2-HMAC-SHA512 seed; BIP-32 master key → hardened/normal child derivation along a path like `m/44'/0'/0'/0/0`. The derivation logic is validated at boot and in CI against the official **BIP-32 Test Vector 1** — the boot self-test derives the mixed hardened/normal path `m/0'/1/2'/2/1000000000` from seed `000102…0f` and compares the serialized `xprv`/`xpub` byte-for-byte to the published extended keys — the **BIP-39** test phrase (`abandon × 11, about` with passphrase `TREZOR` → seed prefix `c55257c360c07c72`), and the textbook privkey = 1 P2PKH address `1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH`. A Vitest suite (`npm test`) asserts all of these as known-answer tests, including both official BIP-39 Trezor vectors, the BIP-173 Bech32 example, and the BIP-32 CKDpriv edge-case contract — `deriveChild` takes an injectable HMAC solely so the test can force `parse256(IL) >= n` and `k_i = 0` and assert that derivation advances to the next index, since with the real HMAC those branches occur with probability about 2<sup>-127</sup>. The in-repo QR encoder has its own suite: the module bitmaps for fixed addresses are pinned to digests taken from an independent reference encoder, and a spec-side reader decodes each generated symbol back to the original string. This is mainnet-style derivation **for education only** — do not hold real funds on any key generated here.

## When to Use It

- **Understanding what a Bitcoin address actually is** — show the secp256k1 → HASH160 → Base58Check / Bech32 chain step by step, instead of treating an address as opaque.
- **Teaching seed phrases honestly** — make BIP-39 visible: the bit-strip slices 132 bits into twelve 11-bit bands and lights up the word each band indexes, so 16 random bytes become 12 words with 4 SHA-256 checksum bits sharing the final band, and PBKDF2 stretches the phrase into the seed the wallet derives from. The lab is explicit about what those 4 bits can and cannot do: measured with its own engine over 982,560 single-word substitutions on 40 random phrases, 61,141 (6.22%, about 1 in 16) still validate — and a **Find a change the checksum misses** control produces one on demand.
- **Demonstrating HD wallets and derivation paths** — change the index of `m/44'/0'/0'/0/0` and watch one seed produce successive receive addresses; bumping the last segment is how an HD wallet hands out its address book. The lab derives from the BIP-44 legacy subtree only, and says so beside the address table: real wallets separate output types into `44'`/`49'`/`84'`/`86'` purpose subtrees so recovery software knows which type to scan, and a `bc1q…` derived under `44'` is a valid address a restored wallet would very likely never look for.
- **Showing the address checksum doing its job, and its limits** — paste a phrase, mangle a word, and watch the BIP-39 checksum reject it; then use the companion control to change a word it *cannot* see. The typo-protection check is the same idea as the four-byte Base58Check tail on `1...` addresses, and it has the same limit: it proves the string was typed cleanly, not that it is the right string.
- **Do NOT use this for real funds.** A browser tab is not a secure place to generate or hold money. Use a hardware wallet (Ledger, Trezor, Coldcard) or audited wallet software for anything you cannot afford to lose. Never paste a phrase that controls real Bitcoin into any web page — including this one.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-bitcoin-wallet](https://systemslibrarian.github.io/crypto-lab-bitcoin-wallet/)**

The page has two interactive flows. **Generate key** makes a fresh secp256k1 private key, then walks the five-stage pipeline — private key (hex + WIF), compressed public key, HASH160, P2PKH `1...`, and P2WPKH `bc1...` — every transform shown with its real bytes. **Generate mnemonic** produces 16 bytes of entropy via `crypto.getRandomValues`, encodes them as a 12-word BIP-39 phrase, stretches the phrase with PBKDF2-HMAC-SHA512 into a 64-byte seed, and derives the BIP-32 master key. A **validate-mnemonic** input runs the checksum check on any pasted phrase (pass / fail badge — do not paste a real wallet phrase). A **path** field (default `m/44'/0'/0'/0/0`) plus a **receive index** spinner walk the BIP-32 derivation to a real address; bumping the index produces the next address from the same seed, which is what a wallet does every time you click "new address". The page is dark by default with a top-right `🌙/☀️` toggle that persists across visits.

The exhibits are:

1. **Watch the bytes flow** — an animated byte-flow diagram that, on Generate, carries the real public-key bytes into a SHA-256 box, then into a RIPEMD-160 box producing the 20-byte HASH160, then splits that one fingerprint into two encoders — Base58Check (`1...`) and Bech32 (`bc1...`) — so you *see* both address types commit to the same fingerprint rather than reading it asserted.
2. **Key → Address pipeline** — the five real transforms (private key + WIF, compressed public key, HASH160, P2PKH, P2WPKH) each shown with its own bytes and a copy button, plus scannable QR codes for both addresses.
3. **Bits → words: the BIP-39 encoder** — the 128 entropy bits + 4 checksum bits rendered as 132 colored bit-cells grouped into twelve 11-bit bands, each band's integer value indexing a word. Click any entropy bit to flip it and watch the affected word *and* the checksum band change; a one-click **Mangle the last word** button breaks the checksum on purpose and flips the badge to invalid, and its counterweight **Find a change the checksum misses** changes one word in a way the 4 bits do not detect — the badge and the validator both still say valid, and the note reports how many of the 128 single-bit changes to that phrase are invisible (typically about 8).
4. **BIP-44 path breakdown** — `m/44'/0'/0'/0/0` rendered as labeled nodes (Purpose / Coin / Account / Change / Index), each captioned with what the number means and why it is hardened.
5. **Seed → HD wallet** — mnemonic → PBKDF2 seed → BIP-32 master key, a **Walk a derivation path** control (with a note that the leaf is an ordinary private key fed into the same Key → Address pipeline), a **Test yourself** memorize drill, and the first five receive addresses from one seed.
6. **Verified against the official spec** — a panel that recomputes the published BIP-32/BIP-39 constants (privkey = 1 P2PKH, the full 64-byte TREZOR seed, BIP-32 Test Vector 1 `xprv` **and** `xpub`) live in the browser and compares each whole value — the display truncates, the badge does not — showing a green match only on an exact hit, plus an inline glossary for spike terms (SegWit, witness version, Base58Check, Bech32, polymod, WIF).

## What Can Go Wrong

- **A browser is not a vault:** keys generated in a web tab can be exposed by malicious extensions, cross-site scripting, swap files, or clipboard sniffers — never put real funds behind a browser-generated key.
- **Weak entropy:** a seed is only as strong as its randomness; a broken or backdoored RNG produces guessable keys and predictable addresses.
- **Seed-phrase phishing:** anyone who learns your mnemonic controls the funds, and fake "validate your phrase" prompts are a common theft vector.
- **No passphrase = single factor:** a BIP-39 seed with no extra passphrase rests entirely on the secrecy of the words themselves. A wrong passphrase does not fail a checksum either — it silently derives a different, perfectly valid wallet.
- **Every layer below the words can spend:** entropy → words (+ passphrase) → 64-byte seed → BIP-32 master key → child keys. A leaked child private key spends that address's coins without revealing the words, and an `xprv` spends everything under it — "only the seed can spend" is not true, which is why the page prints a child private key and WIF where you can see it.
- **Address reuse leaks privacy:** reusing one address links transactions on a public ledger; HD wallets exist precisely so each receive can use a fresh address.

## Real-World Usage

- BIP-32 and BIP-39 are widely used across hardware and software wallets, while BIP-44, BIP-49, BIP-84 and BIP-86 define the common account paths for particular coins and Bitcoin output types. Practice varies: Electrum generates its own seed-version phrases by default (it can import BIP-39 ones), and MetaMask uses BIP-39-style phrases with BIP-44-family paths for Ethereum, not Bitcoin.
- Bech32 (BIP-173) encodes the native SegWit `bc1...` addresses used across the Bitcoin network.
- secp256k1 is the signing curve for both Bitcoin and Ethereum transactions.
- BIP-39 mnemonics are the common backup format users write down to recover a wallet across devices.

## How to Run Locally

CI uses Node24 and `npm ci` with the paired Noble secp256k1 v3/hashes v2 graph. Official BIP-32/BIP-39 and address known answers, derivation edge cases and independent QR checks remain the correctness gates; library migration does not extend the supported address or wallet-security claims.

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-bitcoin-wallet
cd crypto-lab-bitcoin-wallet
npm install
npm run dev
`​``

No environment variables, no API keys, no servers — everything runs client-side. The build bundles `@noble/secp256k1`, `@noble/hashes`, and the in-repo BIP-39 wordlist + QR-code encoder into a single static JS file deployed straight to GitHub Pages, with no remote services and no telemetry. Additional scripts: `npm test` (Vitest known-answer + property tests for the crypto — BIP-39/BIP-32 vectors, Base58Check, Bech32, HD derivation, and the QR encoder), `npm run build` (tsc + production build to `dist/`), `npm run preview` (serve the built `dist/` locally), `npm run test:e2e` (the whole Playwright suite — functional claims plus the axe-core WCAG 2.2 gate), `npm run test:claims` and `npm run test:a11y` (either half on its own), and `npm run test:legacy-e2e` (the older Puppeteer flow, kept until its remaining unique assertions are migrated). `npm test` runs only the Vitest unit suite.

## Related Demos

- [crypto-lab-ecdsa-forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) — secp256k1 ECDSA signing and nonce-reuse failures, the curve that spends Bitcoin.
- [crypto-lab-merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) — SHA-256 Merkle trees and inclusion proofs.
- [crypto-lab-hash-zoo](https://systemslibrarian.github.io/crypto-lab-hash-zoo/) — the hash families behind addresses and checksums.
- [crypto-lab-babel-hash](https://systemslibrarian.github.io/crypto-lab-babel-hash/) — SHA-256, SHA3-256, and BLAKE3 with HMAC.
- [crypto-lab-curve-lens](https://systemslibrarian.github.io/crypto-lab-curve-lens/) — elliptic-curve fundamentals (Curve25519, P-256, ECDH).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Collision Vault

- **slug**: `crypto-lab-collision-vault`
- **repo**: https://github.com/systemslibrarian/crypto-lab-collision-vault
- **live**: https://systemslibrarian.github.io/crypto-lab-collision-vault/
- **commit_sha**: `d4d105cdc1abec7ecb479354bc7f966318d2c609` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS | ATTACKS  ·  **level**: beginner  ·  **--accent**: #d6455d
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: Collision Vault  — _read from demos/collision-vault/src/main.ts_

**Subtitle**: Hash collisions · MD5 / SHA-1 broken · SHA-256 / SHA-3 resist  — _read from demos/collision-vault/src/main.ts_

**Description**: Verify published MD5 and SHA-1 collision pairs live — two genuinely different files hashing to one digest — and watch SHA-256 / SHA-3 keep them apart, with the Merkle–Damgård chaining values traced as they re-converge.  — _read from demos/collision-vault/src/main.ts_

**Why it matters**: A digest is meant to prove a file is unaltered. Once a hash collides, an attacker can swap a benign file for a malicious one with the same checksum — forging certificates, signatures, or downloads. MD5 and SHA-1 fell here; SHA-256 / SHA-3 hold.  — _read from demos/collision-vault/src/main.ts_

**Card copy**: Verify published MD5 and SHA-1 collision pairs, then compare full-round SHA-256 and SHA-3 digests. A separate research verifier checks a published 36-step SHA-256 pair.

**Chips**: MD5 · SHA-1 · SHAttered · Chosen-Prefix Collision

**Implements**: MD5 `demos/collision-vault/src/hashing/md5.ts:10`, SHA-1 `demos/collision-vault/src/hashing/trace.ts:111`, SHA-256 `demos/collision-vault/src/hashing/index.ts:79`, SHA-3 `demos/collision-vault/src/hashing/sha3.ts:9`, SHA-512 `demos/collision-vault/src/hashing/index.ts:81`

**Attacks shown**: Brute force `demos/collision-vault/src/pairs/manifest.ts:64`, Collision attack `demos/collision-vault/src/hashing/index.ts:44`, Length extension `README.md:60`

**Comment-only (named in code comments, not executed)**: Keccak `demos/collision-vault/src/hashing/sha3.ts:1`

**References**: BLAKE3, CMAC, GHASH, HMAC, Keccak, Kupyna, Merkle tree, Poly1305, Streebog

**Standards body**: IETF, NIST

**Implementation**: WebCrypto / noble / local reduced-round SHA-256

**Spec citations, exactly as written**:

- `10.1007/11426639_2` — first seen demos/collision-vault/src/pairs/manifest.ts:104 (1×)
- `ePrint 2026/1120` — first seen README.md:120 (1×)
- `eprint.iacr.org/2026/1120` — first seen README.md:115 (4×)
- `eprint.iacr.org/2026/232` — first seen README.md:115 (2×)
- `EUROCRYPT 2005` — first seen README.md:10 (1×)
- `EUROCRYPT 2026` — first seen demos/collision-vault/src/main.ts:48 (1×)
- `FIPS 180-4` — first seen README.md:6 (4×)
- `FIPS 202` — first seen README.md:7 (4×)
- `RFC 1321` — first seen README.md:6 (5×)

**README — What Can Go Wrong**:

```text
- Using MD5 or SHA-1 for any adversarial integrity purpose: practical chosen-prefix collisions let an attacker craft two different files with the same digest, which is how a rogue CA certificate (2008) and the Flame malware (2012) were signed.
- Relying on a hash's collision strength for password storage: collision resistance is the wrong property, and a fast hash only speeds up brute force — use a password KDF instead.
- Length-extension on Merkle–Damgård hashes (MD5, SHA-1, SHA-256): building a MAC as `H(secret || message)` is forgeable; use HMAC.
- Confusing collision resistance with preimage resistance: MD5/SHA-1 collisions are practical while preimages are not, so "still fine for X" reasoning about broken hashes is error-prone.
- Truncating a strong digest too aggressively drops collision security below the birthday bound and can reopen collision risk.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-collision-vault

## What It Is

Collision Vault verifies **real, already-published hash collisions** for the broken hash
functions **MD5** (RFC 1321) and **SHA-1** (FIPS 180-4), and contrasts them with the
collision-resistant **SHA-256** (FIPS 180-4) and **SHA3-256** (FIPS 202). These are
cryptographic hash functions: unkeyed, public functions that map arbitrary input to a
fixed-size digest, whose core promise is *collision resistance* — it should be infeasible
to find two different inputs with the same digest. MD5 (Wang & Yu, EUROCRYPT 2005) and SHA-1
(SHAttered, 2017) no longer hold that promise, and this demo recomputes digests live in the
browser over bundled, genuinely different file pairs to prove it. It does **not** find new
collisions — that is a massive offline computation — it verifies real ones and shows the
broken hash failing while the modern hashes keep the files apart.

## When to Use It

- **Protecting integrity, signatures, commitments, or content addresses today → use SHA-256
  or SHA-3.** They have no known practical collisions and roughly 2¹²⁸ collision security.
- **Adversarial deduplication or version control identity → SHA-256/SHA-3.** This is exactly
  why Git is migrating object IDs off SHA-1.
- **Legacy, non-security checksums → MD5 or CRC are acceptable only as error detection,**
  never as a defense against an attacker who can craft inputs.
- **Teaching, auditing, or convincing a stakeholder *why* hash choice matters → this demo,**
  which makes "two different files, one digest" concrete and verifiable.
- **When NOT to use MD5 or SHA-1:** never for any security purpose — certificates,
  signatures, integrity against an adversary, or deduplication. Chosen-prefix collisions
  enabled a rogue CA certificate (2008) and the Flame espionage malware (2012).
- **Do NOT** treat this as production code — it is a teaching demo that verifies known collisions, not a hardened hashing or file-integrity library.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-collision-vault](https://systemslibrarian.github.io/crypto-lab-collision-vault/)**

Pick a real collision pair and watch a broken hash produce one digest for two different
files, computed live in your browser, while SHA-256 and SHA3-256 keep them distinct. This
demo is about **hashing only — there is no encryption or decryption.** Controls include the
collision-pair selector (SHAttered SHA-1 PDFs, MD5 identical-prefix, MD5 chosen-prefix), a
byte-diff viewer and whole-file minimap, the broken-hash digest panel, an
identical-vs-chosen-prefix explainer, a block-by-block trace of the hash's internal state
showing the two files' chaining values diverge and get forced back together by the crafted
blocks, the SHA-256/SHA-3 resistance contrast, a verification ledger, a one-byte "tamper"
experiment that breaks the collision, a "mint your own colliding pair" panel that appends bytes
you type to both halves and recomputes — turning the published pair into a brand-new collision
at a digest that did not exist before you pressed the button — and a keyboard-driven presenter
mode.

That extension panel first measures the three conditions that make a pair *suffix-closed* (equal
lengths, equal un-padded chaining values after the last complete 64-byte block, identical tail
bytes), predicts the outcome from them, and only then hashes; the verdict is a function of the
prediction and the measured digests, and says so loudly if the two ever disagree. Appending
different bytes to the two halves, or to only one of them, breaks the collision — both are
selectable, and both are asserted in the browser suite. This is *not* the length-extension
attack (which forges `H(secret || m || pad || ext)` without the secret); nothing here is secret.

## What Can Go Wrong

- Using MD5 or SHA-1 for any adversarial integrity purpose: practical chosen-prefix collisions let an attacker craft two different files with the same digest, which is how a rogue CA certificate (2008) and the Flame malware (2012) were signed.
- Relying on a hash's collision strength for password storage: collision resistance is the wrong property, and a fast hash only speeds up brute force — use a password KDF instead.
- Length-extension on Merkle–Damgård hashes (MD5, SHA-1, SHA-256): building a MAC as `H(secret || message)` is forgeable; use HMAC.
- Confusing collision resistance with preimage resistance: MD5/SHA-1 collisions are practical while preimages are not, so "still fine for X" reasoning about broken hashes is error-prone.
- Truncating a strong digest too aggressively drops collision security below the birthday bound and can reopen collision risk.

## Real-World Usage

- Git is migrating its object identifiers from SHA-1 to SHA-256 specifically because adversarial SHA-1 collisions are now practical.
- X.509 certificates and Certificate Transparency logs use SHA-256; CAs and browsers deprecated MD5- and SHA-1-based certificate signatures.
- Content addressing and deduplication systems use SHA-256 to give files stable, collision-resistant identities.
- Software-distribution integrity (release checksums, package managers, signed updates) relies on SHA-256/SHA-3 digests.
- Code signing and TLS handshakes moved off MD5/SHA-1 to SHA-256-family hashes as the broken functions fell.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-collision-vault
cd crypto-lab-collision-vault/demos/collision-vault
npm install
npm run dev
`​``

No environment variables are required. Everything runs client-side with no backend.

## Related Demos
- [crypto-lab-hash-zoo](https://systemslibrarian.github.io/crypto-lab-hash-zoo/) — SHA-256, SHA3-256, and BLAKE3 with the Merkle–Damgård construction, the families compared here.
- [crypto-lab-babel-hash](https://systemslibrarian.github.io/crypto-lab-babel-hash/) — hands-on tour of SHA-256, SHA3-256, BLAKE3, and HMAC.
- [crypto-lab-merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) — SHA-256 Merkle trees and inclusion proofs, a hash application that needs collision resistance.
- [crypto-lab-world-hashes](https://systemslibrarian.github.io/crypto-lab-world-hashes/) — national hash standards (SM3, Streebog, Kupyna) alongside SHA-256.
- [crypto-lab-mac-race](https://systemslibrarian.github.io/crypto-lab-mac-race/) — HMAC, CMAC, Poly1305, and GHASH, the keyed-hash counterpart to plain hashing.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Native TypeScript and lint tooling

The build and CI run native TypeScript 7.0.2 through `tsc`. ESLint still needs
a JavaScript compiler API, so the lock uses Microsoft's
[official side-by-side aliases](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-60):
`@typescript/native` supplies the native compiler, while the `typescript`
compatibility wrapper 6.0.2 exposes the locked TypeScript 6.0.3 JavaScript API.
The separate `tsc6` executable is not used for the build. The existing Node
types are explicit for the included file-reading test fixtures; TypeScript 7
no longer includes installed ambient packages automatically. DOM, WebWorker,
strict checks, and the publish-request controls remain enabled.

`npm run test:tooling` checks the real native compiler and API, all 44 existing
lint scopes and five ignored output directories, and positive/negative
compiler and lint behavior. `npm run lint` runs those controls before the
existing ESLint command.

## Reduced-round research context

The live demo links [2026/232](https://eprint.iacr.org/2026/232) and [2026/1120](https://eprint.iacr.org/2026/1120), distinguishes reported reduced-round results from standard full-round SHA-2, and identifies the September result as a preprint. The separate verifier below now checks the supplied Table 2 36-step pair under explicit compression conventions, with independent checks and full SHA-256 contrast.


## Published reduced-SHA-256 pair

The separate research panel now recomputes the two-block, 36-step collision in Table 2 (p. 14) of [Li et al., ePrint 2026/1120, revised 9 September 2026](https://eprint.iacr.org/2026/1120). It uses the standard SHA-256 IV, big-endian words, steps 0–35 and feed-forward after each block, without appending padding for the reported table value. This is not the appendix’s semi-free-start example. Standard WebCrypto SHA-256 hashes both complete 128-byte messages with normal padding and produces different digests.

The fixture records the original source, mirror retrieval URL and PDF SHA-256 fingerprint. The original PDF endpoint returned HTTP403; the matching revision was retrieved from the ePrint mirror. Only the extracted technical data is bundled, not the PDF. Reproduce the independent check with `python3 demos/collision-vault/tools/verify-sha256-research.py`; CI gates it alongside the TypeScript tests. Tests include all 1,024 one-bit mutations, incorrect round/IV/padding controls, and full 64-step compression cross-checks against independent noble SHA-256 at padding boundaries. The browser computes every displayed result and offers mutation and wrong-round controls. It verifies the pair rather than running the attack search or reproducing its complexity estimates.

```

</details>

---

## Merkle Proofs

- **slug**: `crypto-lab-merkle-proofs`
- **repo**: https://github.com/systemslibrarian/crypto-lab-merkle-proofs
- **live**: https://systemslibrarian.github.io/crypto-lab-merkle-proofs/
- **commit_sha**: `de3f35f9c8196187955ff33f81487b15801404cf` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS | ATTACKS  ·  **level**: intermediate  ·  **--accent**: #10b981
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Merkle Proofs  — _read from index.html_

**Subtitle**: Inclusion & Consistency · SHA-256 · RFC 6962  — _read from index.html_

**Description**: Build a Merkle tree, then generate and verify inclusion and consistency proofs against its root using RFC 6962 domain separation.  — _read from index.html_

**Why it matters**: One tiny root commits to millions of records, and a handful of hashes proves any one is in the set — without the whole set. This is how Bitcoin light clients, Git, and Certificate Transparency stay honest at scale.  — _read from index.html_

**Card copy**: The proof-semantics view: what an inclusion proof does and does not establish — RFC 9162 index verification, a pinned real Certificate Transparency entry, and the RFC 6962 and CVE-2012-2459 attacks.

**Chips**: SHA-256 · Merkle Proof · RFC 6962 · CVE-2012-2459

**Implements**: Merkle tree `src/main.ts:10`, SHA-256 `src/merkle/hash.ts:65`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Argon2 `src/merkle/ct-fixture.ts:4`, ECDSA `src/merkle/ct-fixture.ts:17`

**References**: Argon2, ECDSA, SHA-512

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 203` — first seen README.md:55 (1×)
- `RFC 6962` — first seen README.md:5 (39×)
- `RFC 9162` — first seen README.md:32 (9×)
- `rfc6962` — first seen index.html:185 (3×)
- `rfc9162` — first seen index.html:467 (4×)

**Stated limitations (page)**:

- _(scope-note, index.html)_ Where this sits: this lab is about what a proof means — where the trusted root has to come from, the exact bytes hashed at every step, RFC 9162 index-based verification, the attacks a construction survives or does not, and a real Certificate Transparency entry checked against a production log. If you want the structure instead — the tree drawn with parent-to-child connectors, one climb walked level by level with the nodes lighting up as the running hash rises, and the recomputed and committed roots asserted equal byte for byte at the top — that is crypto-lab-merkle-vault. The two labs share a subject and deliberately answer different questions about it.

**Claims tested** (e2e/claims.spec.ts, 16 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:24
    - :24 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:33
    - :33 `toHaveText` expected `/^[0-9a-f]{64}$/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:34
    - :34 `toContainText` expected `'INCLUDED'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:43
    - :43 `expect` expected _no expected value_ _(none)_
- `explorer: the honest proof recomputes exactly the root the tree published` — e2e/claims.spec.ts:67
    - :76 `toBe` expected `6` _(literal)_
    - :77 `toBe` expected `leaves` _(expression)_
    - :78 `toBe` expected `Math.ceil(Math.log2(leaves))` _(expression)_
    - :84 `expect` expected _no expected value_ _(none)_
    - :85 `toBe` expected `steps` _(expression)_
    - :86 `toBe` expected `steps` _(expression)_
    - :89 `expect` expected _no expected value_ _(none)_
    - :93 `toBe` expected `root` _(expression)_
    - :94 `toBe` expected `trusted` _(expression)_
    - :95 `toContainText` expected _no expected value_ _(none)_
    - :98 `toHaveClass` expected `/mt-verdict--ok/` _(regex)_
    - :102 `toHaveLength` expected `steps + 1` _(expression)_
    - :103 `expect` expected _no expected value_ _(none)_
    - :104 `toHaveText` expected `'Step ${steps} of ${steps}'` _(expression)_
- `explorer tamper: changing the leaf or flipping a proof bit is rejected, and recoverable` — e2e/claims.spec.ts:107
    - :115 `toContainText` expected `'REJECTED'` _(literal)_
    - :116 `toHaveClass` expected `/mt-verdict--bad/` _(regex)_
    - :117 `toContainText` expected _no expected value_ _(none)_
    - :121 `toBe` expected `root` _(expression)_
    - :122 `toBe` expected `printed.trusted` _(expression)_
    - :123 `toHaveValue` expected `/!$/` _(regex)_
    - :127 `toContainText` expected `'INCLUDED'` _(literal)_
    - :129 `toBe` expected `root` _(expression)_
    - :133 `toContainText` expected `'REJECTED'` _(literal)_
    - :135 `toBe` expected `root` _(expression)_
    - :136 `toBe` expected `root` _(expression)_
    - :142 `toBe` expected `published` _(expression)_
    - :143 `toBe` expected `published.slice(2)` _(expression)_
    - :147 `toContainText` expected `'INCLUDED'` _(literal)_
    - :149 `toContainText` expected `'REJECTED'` _(literal)_
- `explorer step-through: the trace reveals one hash at a time and withholds the verdict until the top` — e2e/claims.spec.ts:152
    - :159 `expect` expected _no expected value_ _(none)_
    - :163 `toHaveText` expected `'Step 0 of ${total}'` _(expression)_
    - :167 `toHaveText` expected `'Step ${revealed} of ${total}'` _(expression)_
    - :169 `toHaveCount` expected `revealed + 1` _(expression)_
    - :172 `toContainText` expected _no expected value_ _(none)_
    - :175 `toContainText` expected `'INCLUDED'` _(literal)_
    - :176 `toContainText` expected `'REJECTED'` _(literal)_
    - :178 `toHaveCount` expected `0` _(literal)_
    - :181 `toContainText` expected `'INCLUDED'` _(literal)_
    - :183 `toBe` expected `trusted` _(expression)_
- `explorer builder: editing the leaf set moves the root and re-proves the selected leaf` — e2e/claims.spec.ts:186
    - :193 `toHaveText` expected `/^0 leaves · /` _(regex)_
    - :194 `toContainText` expected `'Add at least one leaf'` _(literal)_
    - :197 `toHaveText` expected `/^6 leaves · /` _(regex)_
    - :198 `toHaveText` expected `before` _(expression)_
    - :203 `toHaveText` expected `/^7 leaves · proof size ≤ 3 hashes$/` _(regex)_
    - :205 `toBe` expected `before` _(expression)_
    - :209 `toContainText` expected `'Proof for leaf 6'` _(literal)_
    - :210 `toHaveValue` expected `'grace'` _(literal)_
    - :211 `toContainText` expected `'INCLUDED'` _(literal)_
    - :213 `toBe` expected `after` _(expression)_
    - :214 `toBe` expected `after` _(expression)_
    - :216 `expect` expected _no expected value_ _(none)_
- `trust model: a self-supplied root verifies and the page says it proves nothing` — e2e/claims.spec.ts:223
    - :229 `toContainText` expected `'INCLUDED, AND IT MEANS SOMETHING'` _(literal)_
    - :230 `toHaveClass` expected `/mt-verdict--ok/` _(regex)_
    - :232 `expect` expected _no expected value_ _(none)_
    - :233 `expect` expected _no expected value_ _(none)_
    - :237 `toContainText` expected `'VERIFIES — AND PROVES NOTHING'` _(literal)_
    - :238 `toHaveClass` expected `/mt-verdict--bad/` _(regex)_
    - :240 `expect` expected _no expected value_ _(none)_
    - :241 `expect` expected _no expected value_ _(none)_
    - :242 `expect` expected _no expected value_ _(none)_
- `domain separation: the second-preimage forgery is blocked with 0x00/0x01 and succeeds without` — e2e/claims.spec.ts:249
    - :267 `toBeChecked` expected _no expected value_ _(none)_
    - :269 `toBe` expected `'RFC 6962 domain separation ON'` _(literal)_
    - :270 `expect` expected _no expected value_ _(none)_
    - :271 `toBe` expected `'NO — attack blocked'` _(literal)_
    - :272 `toHaveClass` expected `/mt-verdict--ok/` _(regex)_
    - :275 `toHaveLength` expected `128` _(literal)_
    - :276 `expect` expected _no expected value_ _(none)_
    - :281 `toContainText` expected `'FORGED LEAF ACCEPTED'` _(literal)_
    - :283 `toBe` expected `'domain separation OFF'` _(literal)_
    - :284 `toBe` expected `'YES — inclusion forged'` _(literal)_
    - :285 `toHaveClass` expected `/mt-verdict--bad/` _(regex)_
    - :286 `expect` expected _no expected value_ _(none)_
    - :287 `toHaveLength` expected `128` _(literal)_
    - :290 `toBe` expected `on.impersonated` _(expression)_
    - :294 `toContainText` expected `'FORGERY REJECTED'` _(literal)_
- `CVE-2012-2459: the collide/differ verdict matches the two roots it prints` — e2e/claims.spec.ts:297
    - :312 `toBe` expected `'Bitcoin duplication'` _(literal)_
    - :313 `toBe` expected `dup.rootB` _(expression)_
    - :314 `expect` expected _no expected value_ _(none)_
    - :315 `expect` expected _no expected value_ _(none)_
    - :316 `toHaveClass` expected `/mt-verdict--bad/` _(regex)_
    - :320 `toContainText` expected `'ROOTS DIFFER'` _(literal)_
    - :322 `toBe` expected `'RFC 6962 promotion'` _(literal)_
    - :323 `toBe` expected `promote.rootB` _(expression)_
    - :324 `toHaveClass` expected `/mt-verdict--ok/` _(regex)_
    - :327 `toBe` expected `dup.rootB` _(expression)_
    - :328 `toBe` expected `dup.rootA` _(expression)_
- `consistency: an honest append proves consistent with a logarithmic proof` — e2e/claims.spec.ts:335
    - :340 `toContainText` expected `'CONSISTENT'` _(literal)_
    - :343 `expect` expected _no expected value_ _(none)_
    - :344 `toHaveClass` expected `/mt-verdict--ok/` _(regex)_
    - :349 `toBe` expected `newRoot` _(expression)_
    - :354 `toBe` expected `claimed` _(expression)_
    - :355 `expect` expected _no expected value_ _(none)_
    - :358 `toBe` expected `8` _(literal)_
    - :359 `toBe` expected `5` _(literal)_
    - :360 `toBe` expected `0` _(literal)_
    - :363 `expect` expected _no expected value_ _(none)_
- `consistency tampers: rewrite, delete and reorder are each caught and each recover` — e2e/claims.spec.ts:366
    - :372 `toContainText` expected `'CONSISTENT'` _(literal)_
    - :382 `toContainText` expected _no expected value_ _(none)_
    - :385 `toHaveClass` expected `/mt-verdict--bad/` _(regex)_
    - :388 `expect` expected _no expected value_ _(none)_
    - :389 `expect` expected _no expected value_ _(none)_
    - :391 `expect` expected _no expected value_ _(none)_
    - :395 `toContainText` expected `marker` _(expression)_
    - :399 `toContainText` expected `'CONSISTENT'` _(literal)_
    - :400 `toBe` expected `0` _(literal)_
- `CT: the pinned real log entry verifies in 32 hashes, and one flipped bit breaks it` — e2e/claims.spec.ts:408
    - :421 `toBe` expected `Math.ceil(Math.log2(treeSize))` _(expression)_
    - :422 `toBe` expected `pathLen * 32` _(expression)_
    - :425 `toContainText` expected `'INCLUDED', { timeout: 30_000 }` _(expression)_
    - :426 `toHaveClass` expected `/mt-verdict--ok/` _(regex)_
    - :428 `expect` expected _no expected value_ _(none)_
    - :429 `expect` expected _no expected value_ _(none)_
    - :433 `toBe` expected `pathLen` _(expression)_
    - :434 `toBe` expected `trustedRoot` _(expression)_
    - :439 `toContainText` expected `'REJECTED', { timeout: 30_000 }` _(expression)_
    - :440 `toHaveClass` expected `/mt-verdict--bad/` _(regex)_
    - :441 `expect` expected _no expected value_ _(none)_
    - :446 `toBe` expected `trustedRoot` _(expression)_
    - :450 `toContainText` expected `'INCLUDED', { timeout: 30_000 }` _(expression)_
- `efficiency: the headline numbers are the arithmetic of the size the slider names` — e2e/claims.spec.ts:457
    - :464 `toHaveText` expected `exp` _(expression)_
    - :481 `toBe` expected `2 ** Number(exp)` _(expression)_
    - :482 `toBe` expected `Number(exp)` _(expression)_
    - :483 `toBeCloseTo` expected `hashes * 32, 0` _(expression)_
    - :484 `toBeCloseTo` expected `1, 1` _(expression)_
    - :485 `toBe` expected `Math.round((n * 32) / (hashes * 32))` _(expression)_
    - :492 `toBe` expected `'100%'` _(literal)_
    - :493 `expect` expected _no expected value_ _(none)_
- `efficiency: a real 256-leaf tree verifies from 8 hashes` — e2e/claims.spec.ts:497
    - :501 `toContainText` expected `'Result', { timeout: 60_000 }` _(expression)_
    - :509 `toBe` expected `256` _(literal)_
    - :511 `toBe` expected `Math.log2(n)` _(expression)_
    - :512 `toBe` expected `hashes * 32` _(expression)_
    - :513 `toBe` expected `hashes` _(expression)_
    - :514 `toBe` expected `n` _(expression)_
    - :515 `expect` expected _no expected value_ _(none)_
    - :516 `expect` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-merkle-proofs

## What It Is

This is an interactive demo of **Merkle trees** and **Merkle inclusion proofs**, built on **SHA-256** via the browser's WebCrypto API. A Merkle tree hashes a set of data blocks into a single root hash that commits to all of them at once; an inclusion proof is the short list of sibling hashes that lets anyone re-derive that root from a single leaf. The security model is purely **hash-based**: it relies on the collision and second-preimage resistance of SHA-256, with no keys or signatures involved. Hashing follows **RFC 6962** domain separation (`leaf = SHA-256(0x00 ∥ data)`, `node = SHA-256(0x01 ∥ left ∥ right)`), which is what makes the second-preimage defense in the demo real rather than decorative. It is a teaching tool, not a production library.

## Where This Sits Next to crypto-lab-merkle-vault

Two labs in this catalog cover Merkle trees, and they are not interchangeable. **This one is about
proof semantics**: where the trusted root must come from, the exact bytes hashed at every step, RFC
9162 index-based verification, consistency proofs with the history attacks they catch, the
second-preimage and CVE-2012-2459 constructions broken on the page, and a pinned real Certificate
Transparency entry verified against Google's Argon log.
**[crypto-lab-merkle-vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) is about
the structure**: the tree drawn with parent-to-child connectors, a single proof walked one level at
a time with the corresponding nodes lighting up as the running hash rises, and the recomputed and
committed roots asserted equal byte for byte at the top. Start there for *what a Merkle tree is and
how one climb works*; come here for *what a proof does and does not entitle you to believe*.

## When to Use It

- **To prove one element belongs to a large committed set, cheaply.** A proof is `⌈log₂ n⌉` hashes, so a single transaction can be shown to be in a block of millions without sending the block.
- **To detect tampering against a trusted root.** If you already hold the root, you can verify any leaf+proof and reject anything that doesn't recompute to it.
- **To give light clients integrity without full state.** SPV wallets and stateless clients check membership against a header's root instead of downloading everything.
- **To make a log verifiably append-only.** Certificate Transparency uses exactly this RFC 6962 construction.
- **Do NOT use a Merkle proof to prove *non*-membership or order** unless the tree is specifically a sorted/sparse Merkle tree — a plain inclusion proof says nothing about what is absent, and a tree built without domain separation is open to second-preimage forgery.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-merkle-proofs](https://systemslibrarian.github.io/crypto-lab-merkle-proofs/)**

Add or remove data blocks to build a tree live, choose any leaf to generate its inclusion proof, then verify it — recomputing the root from only the leaf and its sibling hashes. You can **step through or animate** the recompute one hash at a time (watching the running hash climb the tree), expand **“show bytes”** on any step to see the exact SHA-256 preimage (`0x00 ∥ data` for leaves, `0x01 ∥ L ∥ R` for nodes), tamper with the leaf or flip a bit in any proof step and watch verification flip to REJECTED, and scale a slider to see proofs stay logarithmic up to 2³⁰ leaves (plus build real 256–4,096-leaf trees). A **trust-model demo** stages the classic misconception directly: a prover who supplies leaf, proof, *and root* produces a triple that verifies — and proves nothing. Two security demos let you toggle RFC 6962 domain separation on/off to make the second-preimage forgery succeed then fail, and compare Bitcoin's odd-node duplication against RFC 6962 promotion to reproduce the **CVE-2012-2459** root collision. **Consistency (append-only) proofs** get their own visualization — the old tree shaded inside the new one, with the proof's subtree roots marked — plus three history-tampering attacks (rewrite, delete, reorder) that the proof catches. Finally, the page verifies a **real Certificate Transparency entry**: a pinned Let's Encrypt certificate at index 1,234,567,890 of Google's Argon2026h1 log (2.8 billion certificates), proven included with 32 hashes using RFC 9162 index-based verification — the same code path as the rest of the lab. Learning objectives, predict-then-reveal prompts, self-check quizzes, glossary tooltips, a recap table, and further reading support active learning; **“Copy link to this tree”** deep-links any tree state for slides or assignments.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-merkle-proofs
cd crypto-lab-merkle-proofs
npm install
npm run dev
`​``

There are no environment variables. Run the test suite (RFC 6962 vectors, proof round-trips, tamper rejection, the second-preimage attack/defense, consistency proofs, fuzzing against an independent reference implementation, and the pinned real-world CT proof) with `npm test`.

`npm run test:a11y` runs the browser gate (Playwright). `e2e/claims.spec.ts` drives the real page and re-derives every verdict from what the page printed — INCLUDED only when the recomputed root shown equals the trusted root shown, ROOTS COLLIDE only when the two roots printed are equal, the efficiency headline from its own arithmetic — and walks each tamper path (leaf, proof bit, log rewrite/delete/reorder, the CT certificate bit-flip) to assert it reaches rejection, names the cause, and recovers. `e2e/a11y.spec.ts` is the axe-core WCAG A/AA scan. Both run in CI before every Pages deploy.

## Teaching With It

See **[TEACHING.md](TEACHING.md)** for an instructor guide: a 50-minute lesson flow, discussion questions, the misconceptions each section is designed to break, and homework extensions.

## Part of the Crypto-Lab Suite

> One of 170+ live browser demos at
> [systemslibrarian.github.io/crypto-lab](https://systemslibrarian.github.io/crypto-lab/)
> — spanning Atbash (600 BCE) through NIST FIPS 203/204/205 (2024).

---

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## KMAC Gate

- **slug**: `crypto-lab-kmac-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-kmac-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-kmac-gate/
- **commit_sha**: `bb335fade279288532b28fa2ce1955e570a5d15c` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS  ·  **level**: advanced  ·  **--accent**: #6e4cb8
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: KMAC Gate  — _read from src/ui/app.ts_

**Subtitle**: Keyed Keccak · SP 800-185 / FIPS 202  — _read from src/ui/app.ts_

**Description**: Runs SHA3-256, SHAKE, cSHAKE and KMAC on one hand-written Keccak-f[1600] permutation, so you can watch a hash, an extendable output, a domain-separated output and a keyed tag come out of the same machine.  — _read from src/ui/app.ts_

**Why it matters**: Keying a hash the obvious way — hashing the key in front of the message — is broken for SHA-256, and HMAC exists to work around it. Keccak needs no such wrapper, and seeing why turns a rule you memorise into a structure you can point at.  — _read from src/ui/app.ts_

**Card copy**: SHA3-256, SHAKE, cSHAKE and KMAC driven by one hand-rolled Keccak-f[1600] permutation — step the sponge block by block, then tamper with a signed message and watch the real verifier reject it.

**Chips**: Keccak-f[1600] · SHAKE128/256 · cSHAKE128/256 · KMAC128/256

**Implements**: Keccak `src/keccak/keccak-f1600.ts:127`, KMAC `src/demo/naive-mac.ts:70`, SHA-256 `src/demo/naive-mac.ts:22`, SHA-3 `src/demo/trace.ts:84`, SHAKE `src/demo/trace.ts:88`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: HMAC `src/keccak/sp800-185.ts:138`

**References**: HMAC, ML-DSA, ML-KEM, Sum-check

**Standards body**: NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 202` — first seen README.md:3 (21×)
- `fips202` — first seen README.md:164 (7×)
- `NIST SP 800-185` — first seen README.md:127 (2×)
- `SP 800-185` — first seen README.md:3 (28×)
- `sp800-185` — first seen README.md:165 (6×)

**README — What Can Go Wrong**:

```text
- **Keying a Merkle–Damgård hash by prefixing.** The append/length-extension forgery. It is the
  reason HMAC exists, and the reason KMAC does not need it. The attack itself is played out in
  [crypto-lab-mac-race](https://github.com/systemslibrarian/crypto-lab-mac-race) and
  [crypto-lab-babel-hash](https://github.com/systemslibrarian/crypto-lab-babel-hash).
- **Reusing one XOF across subsystems.** Without a customization string, output meant for one
  purpose is valid output for another, and values can be replayed across the boundary.
- **Assuming a longer KMAC tag contains the shorter one.** It does not: KMAC absorbs
  `right_encode(L)`, so the requested length changes the input. KMACXOF is the variant with the
  prefix property. Stage 4 computes both.
- **Reading an accepted tag as more than it is.** Verification establishes that these exact bytes
  were authenticated under this exact key at these exact parameters. It says nothing about who
  computed it, when, or whether the message should be acted on — a replayed old message and tag
  verify perfectly.
- **Trusting a comparison that returns early.** A verifier that stops at the first mismatching
  byte leaks information through timing. The comparison here accumulates the XOR of every byte
  pair and tests once — the right shape, though JavaScript still makes no timing promise.
```

**Claims tested** (e2e/claims.spec.ts, 42 test(s)):

- `the SHA3-256 digest is the real digest of the message in the box` — e2e/claims.spec.ts:47
    - :52 `toBe` expected `expected` _(expression)_
- `the SHAKE output matches OpenSSL at the requested strength and length` — e2e/claims.spec.ts:56
    - :70 `toBe` expected `expected` _(expression)_
- `the cSHAKE output matches an independent implementation` — e2e/claims.spec.ts:74
    - :86 `toBe` expected _no expected value_ _(none)_
- `the held KMAC tag matches an independent implementation` — e2e/claims.spec.ts:92
    - :98 `toBe` expected `kmac128(Buffer.from(key, 'utf8'), Buffer.from(message, 'utf8'), 256, custom)` _(expression)_
- `KMAC256 at 512 bits also matches` — e2e/claims.spec.ts:101
    - :108 `toBe` expected `kmac256(Buffer.from(key, 'utf8'), Buffer.from(message, 'utf8'), 512, '')` _(expression)_
- `the naive MAC panel shows a real SHA-256 of key ‖ message` — e2e/claims.spec.ts:111
    - :115 `toBe` expected _no expected value_ _(none)_
- `the permutation counts separate one operation from the page proof workload` — e2e/claims.spec.ts:126
    - :131 `toHaveLength` expected `4` _(literal)_
    - :136 `expect` expected _no expected value_ _(none)_
    - :139 `toBe` expected `operationSum` _(expression)_
    - :140 `toBe` expected `statedTotal` _(expression)_
    - :141 `toBe` expected `statedTotal` _(expression)_
    - :143 `expect` expected _no expected value_ _(none)_
- `a stage count is the cost of that stage alone, not the whole render` — e2e/claims.spec.ts:146
    - :150 `expect` expected _no expected value_ _(none)_
    - :151 `expect` expected _no expected value_ _(none)_
    - :152 `expect` expected _no expected value_ _(none)_
    - :157 `toBe` expected `kmac` _(expression)_
- `the pipeline table shows the permutation row identical in all four modes` — e2e/claims.spec.ts:160
    - :165 `toHaveLength` expected `4` _(literal)_
    - :166 `toBe` expected `1` _(literal)_
    - :171 `toBe` expected `0` _(literal)_
- `a marked pipeline cell really does differ from the cell to its left` — e2e/claims.spec.ts:174
    - :193 `toEqual` expected `[]` _(expression)_
- `the padding marker points at the real suffix, not a matching message byte` — e2e/claims.spec.ts:196
    - :210 `expect` expected _no expected value_ _(none)_
    - :212 `toEqual` expected `['61', '62', '06', '63', '64', '06']` _(expression)_
    - :214 `expect` expected _no expected value_ _(none)_
    - :215 `toBe` expected `'06'` _(literal)_
    - :217 `toHaveLength` expected `1` _(literal)_
- `the cSHAKE branch shows exactly one active route, matching the inputs` — e2e/claims.spec.ts:220
    - :223 `toHaveCount` expected `1` _(literal)_
    - :224 `toHaveCount` expected `1` _(literal)_
    - :225 `toContainText` expected `'Route B'` _(literal)_
    - :228 `toHaveCount` expected `1` _(literal)_
    - :229 `toHaveCount` expected `1` _(literal)_
    - :230 `toContainText` expected `'Route A'` _(literal)_
    - :232 `toContainText` expected `'0x1F'` _(literal)_
- `RACE: a slow naive digest cannot be painted beside a newer key` — e2e/claims.spec.ts:235
    - :241 `toHaveAttribute` expected `'data-hex', /.+/` _(expression)_
    - :244 `toBe` expected _no expected value_ _(none)_
- `RACE: rapid key edits settle on a tag for the final key` — e2e/claims.spec.ts:251
- `the KMAC stage never calls a MAC a signature` — e2e/claims.spec.ts:265
    - :268 `toMatch` expected `/\bsign(ed|ing|s)?\b/i` _(regex)_
    - :269 `toMatch` expected `/Compute tag/` _(regex)_
    - :272 `expect` expected _no expected value_ _(none)_
    - :273 `expect` expected _no expected value_ _(none)_
- `the capacity is described as unrecoverable, never as untouched` — e2e/claims.spec.ts:276
    - :279 `toMatch` expected `/never written by input/i` _(regex)_
    - :280 `toMatch` expected `/no input or output ever touches/i` _(regex)_
    - :281 `toMatch` expected `/cannot see or touch/i` _(regex)_
    - :283 `toMatch` expected `/never emitted|never given out|never output/` _(regex)_
- `the trace shows capacity lanes changing, matching what the copy claims` — e2e/claims.spec.ts:286
    - :294 `expect` expected _no expected value_ _(none)_
- `the permutation count changes when the work changes` — e2e/claims.spec.ts:297
    - :301 `expect` expected _no expected value_ _(none)_
- `the reported block count matches the message length and the rate` — e2e/claims.spec.ts:304
    - :312 `toBe` expected `blocks` _(expression)_
    - :313 `toBe` expected `'${length} bytes'` _(expression)_
- `every "identical / different" verdict matches the bytes printed beside it` — e2e/claims.spec.ts:317
    - :337 `toEqual` expected `[]` _(expression)_
- `the SHAKE prefix claim is true of the bytes the page printed` — e2e/claims.spec.ts:340
    - :345 `toBe` expected `true` _(expression)_
    - :346 `expect` expected _no expected value_ _(none)_
- `the cSHAKE fallback panel proves equality with plain SHAKE` — e2e/claims.spec.ts:349
    - :355 `toBe` expected _no expected value_ _(none)_
    - :358 `toContainText` expected `'IS plain SHAKE'` _(literal)_
- `a customization string makes the output unrelated, and the page says so honestly` — e2e/claims.spec.ts:361
    - :366 `toBe` expected `plain` _(expression)_
    - :370 `expect` expected _no expected value_ _(none)_
- `the length-binding panel claims binding only when the bytes show it` — e2e/claims.spec.ts:373
    - :378 `toBe` expected `kmacLong` _(expression)_
    - :379 `toBe` expected `xofLong` _(expression)_
    - :386 `toBe` expected `kmac128(k, m, 256, '')` _(expression)_
    - :387 `toBe` expected `kmac128(k, m, 512, '').slice(0, 64)` _(expression)_
- `a tampered message is rejected, and the page names the message as the cause` — e2e/claims.spec.ts:394
    - :397 `toHaveCount` expected `1` _(literal)_
    - :403 `toHaveCount` expected `1` _(literal)_
    - :404 `toContainText` expected `'rejected'` _(literal)_
    - :405 `toContainText` expected `'the message bytes changed'` _(literal)_
    - :406 `toHaveCount` expected `0` _(literal)_
- `the rejection shows a recomputed tag that really differs from the held one` — e2e/claims.spec.ts:409
    - :415 `toBe` expected `held` _(expression)_
    - :419 `toBe` expected _no expected value_ _(none)_
- `a changed key is rejected and named` — e2e/claims.spec.ts:424
    - :428 `toContainText` expected `'the key changed'` _(literal)_
- `a changed output length is rejected and named` — e2e/claims.spec.ts:431
    - :435 `toContainText` expected `'KMAC binds L into the tag'` _(literal)_
- `an appended message is rejected — no length extension` — e2e/claims.spec.ts:438
    - :443 `toHaveCount` expected `1` _(literal)_
- `editing the message retires the verdict, says so, and names the control` — e2e/claims.spec.ts:450
    - :453 `toHaveCount` expected `1` _(literal)_
    - :457 `toHaveCount` expected `0` _(literal)_
    - :459 `toHaveCount` expected `1` _(literal)_
    - :460 `toContainText` expected `'retired'` _(literal)_
    - :461 `toContainText` expected `'the message'` _(literal)_
    - :462 `toContainText` expected `'Verify tag'` _(literal)_
- `a retired verdict is never silently blanked` — e2e/claims.spec.ts:465
    - :471 `toMatch` expected `/retired/i` _(regex)_
    - :472 `expect` expected _no expected value_ _(none)_
- `changing any KMAC input retires the verdict, each naming what moved` — e2e/claims.spec.ts:475
    - :489 `toHaveCount` expected `1` _(literal)_
    - :492 `toHaveCount` expected `1` _(literal)_
    - :493 `toMatch` expected `matcher` _(expression)_
- `NO-OP GUARD: re-selecting the same value does not retire a fresh verdict` — e2e/claims.spec.ts:497
    - :500 `toHaveCount` expected `1` _(literal)_
    - :509 `toHaveCount` expected `0` _(literal)_
    - :510 `toHaveCount` expected `1` _(literal)_
- `a round-trip edit that restores the original bytes does not retire` — e2e/claims.spec.ts:513
    - :518 `toHaveCount` expected `1` _(literal)_
    - :520 `toHaveCount` expected `0` _(literal)_
    - :521 `toHaveCount` expected `1` _(literal)_
- `re-tagging clears the old verdict rather than leaving it to endorse a new tag` — e2e/claims.spec.ts:524
    - :527 `toHaveCount` expected `1` _(literal)_
    - :530 `toHaveCount` expected `0` _(literal)_
    - :531 `toHaveCount` expected `0` _(literal)_
    - :532 `toContainText` expected `'Nothing verified yet'` _(literal)_
- `the held tag survives tampering — it is what makes the rejection possible` — e2e/claims.spec.ts:535
    - :539 `toBe` expected `held` _(expression)_
    - :540 `toContainText` expected `'covers the earlier inputs'` _(literal)_
- `the accept verdict does not claim more than KMAC establishes` — e2e/claims.spec.ts:547
    - :552 `toMatch` expected `/does not identify who/i` _(regex)_
    - :553 `toMatch` expected `/does not say when|replayed/i` _(regex)_
    - :554 `toMatch` expected `/proves the sender|guarantees|authentic sender|came from/i` _(regex)_
- `the contrast panel states an append forgery, never key recovery` — e2e/claims.spec.ts:557
    - :559 `expect` expected _no expected value_ _(none)_
    - :560 `toMatch` expected `/key recovery|recovers the key|leaks the key/` _(regex)_
    - :561 `expect` expected _no expected value_ _(none)_
- `the page scopes itself honestly as a teaching implementation` — e2e/claims.spec.ts:564
    - :566 `toMatch` expected `/not production/i` _(regex)_
    - :567 `toMatch` expected `/not constant-time/i` _(regex)_
    - :568 `toMatch` expected `/TupleHash and ParallelHash/` _(regex)_
- `the standards note links the NIST draft without claiming streaming API conformance` — e2e/claims.spec.ts:571
    - :573 `toBeVisible` expected _no expected value_ _(none)_
    - :574 `expect` expected _no expected value_ _(none)_
    - :576 `toContainText` expected `'comments due December 7, 2026'` _(literal)_
    - :577 `toContainText` expected `'preserving the existing single-call outputs'` _(literal)_
    - :578 `toContainText` expected `'not a replacement final standard'` _(literal)_
    - :579 `toContainText` expected `'do not establish conformance'` _(literal)_
- `nothing carrying the hidden attribute is still painted` — e2e/claims.spec.ts:582
    - :588 `toEqual` expected `[]` _(expression)_
- `there is exactly one h1 and one banner landmark` — e2e/claims.spec.ts:591
    - :592 `toHaveCount` expected `1` _(literal)_
    - :593 `toHaveCount` expected `1` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# KMAC Gate

**Keyed Keccak · SP 800-185 / FIPS 202**

SHAKE, cSHAKE, and KMAC built on one Keccak-f[1600] sponge — the same permutation doing hash,
XOF, domain-separated XOF, and keyed MAC.

**Live demo:** https://systemslibrarian.github.io/crypto-lab-kmac-gate/

---

## What It Is

An interactive, browser-only demonstration that four cryptographic functions people usually meet
separately are one machine with four labels.

The primitives are real and hand-rolled, not called out to a library:

| Function | Spec | Rate / capacity | Domain suffix |
| --- | --- | --- | --- |
| **Keccak-f[1600]** | FIPS 202 §3.2 | — | — |
| **SHA3-256** | FIPS 202 | 136 / 64 bytes | `0x06` |
| **SHAKE128 / SHAKE256** | FIPS 202 | 168 / 32, 136 / 64 bytes | `0x1F` |
| **cSHAKE128 / cSHAKE256** | SP 800-185 §3 | as SHAKE | `0x04` |
| **KMAC128 / KMAC256 / KMACXOF** | SP 800-185 §4 | as cSHAKE | `0x04` |

Plus the SP 800-185 encoding functions the last two are framed with: `left_encode`,
`right_encode`, `encode_string` and `bytepad`.

**Standards update — October 8, 2026.** NIST published the
[SP 800-185 Revision 1 initial public draft](https://csrc.nist.gov/pubs/sp/800/185/r1/ipd),
with comments due December 7, 2026. It proposes streaming XOF interfaces using
`INIT`, `ABSORB` and `SQUEEZE`, while preserving the existing single-call outputs.
This is a draft, not a replacement final standard. The lab continues to follow the
final SP 800-185 specification; its incremental sponge operations demonstrate the
mechanism, but do not establish conformance to the draft's streaming API.

**The "one sponge" claim is literally true in the code, and enforced by tests.** There is exactly
one `keccakF1600` function and exactly one `Sponge` class in `src/`; every mode reaches the
permutation through them. `src/keccak/architecture.test.ts` checks this two ways — behaviourally
(every mode moves the same shared call counter) and structurally (the source defines the round
function, the permutation and the sponge exactly once, and no mode module calls the permutation
directly).

**Security model.** The key is whatever you type; it lives in a text box and in memory for the
session, and is never persisted or transmitted. There is no backend and no network call. The
only thing written to storage is the pinned theme name, which the page overwrites on every load
rather than reading.

**This is not production cryptography.** It is a teaching implementation whose priority is that
you can read it. The permutation uses BigInt arithmetic in a JIT-compiled runtime and tag
comparison is branch-free in shape only; neither offers any timing guarantee. Use a vetted
library for anything real.

## Exhibits

1. **The core — one permutation, counted.** A live count of Keccak-f[1600] invocations for the
   current render, broken down per stage, with the parts shown summing to the whole. Beside it, a
   table of the four modes' rate/capacity splits and domain-separation suffix bytes — the same
   message, four framings.
2. **Stage 1 — SHA3-256.** Type a message; watch it padded into 136-byte blocks, each XORed into
   the rate and permuted. The rate/capacity split is drawn to scale, and a stepper walks the
   blocks one at a time, showing the 5×5 lane grid after each permutation with changed lanes
   underlined. The padded block is shown with the domain suffix and the pad10*1 final bit marked
   as bytes you can point at.
3. **Stage 2 — SHAKE128/256.** A draggable output-length control from 16 to 512 bytes. The page
   squeezes the same message separately at a short length and compares byte-for-byte against the
   prefix of the long output, so "longer output is a continuation, not a rehash" is shown rather
   than asserted. A second check splits one squeeze in two and confirms the concatenation matches.
4. **Stage 3 — cSHAKE128/256.** Editable function name `N` and customization string `S`. Changing
   `S` by one character is shown producing an unrelated output. Separately and always, the page
   computes cSHAKE with empty `N` and `S` against plain SHAKE and shows the byte-level equality
   that proves the spec's fallback. The framed prefix cSHAKE absorbs is displayed as hex.
5. **Stage 4 — KMAC128/256 + KMACXOF (break it yourself).** Type a key and a message, sign it,
   verify it — then tamper and verify again, and watch the real verifier reject. Also computes
   output-length binding live: KMAC at 256 and 512 bits produces unrelated tags, while KMACXOF at
   the two lengths produces one as a prefix of the other.
6. **Why key it this way.** A compact closing panel placing KMAC beside a naive
   `SHA-256(key ‖ message)` MAC — both really computed — with the structural numbers that explain
   the difference.
7. **Scope.** What is real, what is not, and what is deliberately absent.

## When to Use It

- **Use KMAC** when you want a MAC or a KDF from a Keccak-family primitive: it is a NIST-approved
  construction (SP 800-185), it needs no HMAC-style nesting, and its customization string gives
  you domain separation for free.
- **Use KMACXOF** when you need arbitrary-length key material and want outputs at different
  lengths to extend one another.
- **Use cSHAKE** when two subsystems share a hash function and you need their outputs to be
  independent — the customization string makes each its own function.
- **Do NOT use `SHA-256(key ‖ message)` as a MAC.** Merkle–Damgård emits its chaining state as the
  digest, so a tag holder can append to the message and forge a valid tag for the longer message
  without the key. Use HMAC, or KMAC.
- **Do NOT use this code.** It is a teaching implementation, not a hardened one.

## Live Demo

https://systemslibrarian.github.io/crypto-lab-kmac-gate/

Type a message and watch one digest, one extendable output, and one domain-separated output come
out of the same state. Then key it: sign a message, verify it, tamper with one character, and
verify again to see the real primitive reject. Every number on the page is computed in your
browser during that run.

## What Can Go Wrong

- **Keying a Merkle–Damgård hash by prefixing.** The append/length-extension forgery. It is the
  reason HMAC exists, and the reason KMAC does not need it. The attack itself is played out in
  [crypto-lab-mac-race](https://github.com/systemslibrarian/crypto-lab-mac-race) and
  [crypto-lab-babel-hash](https://github.com/systemslibrarian/crypto-lab-babel-hash).
- **Reusing one XOF across subsystems.** Without a customization string, output meant for one
  purpose is valid output for another, and values can be replayed across the boundary.
- **Assuming a longer KMAC tag contains the shorter one.** It does not: KMAC absorbs
  `right_encode(L)`, so the requested length changes the input. KMACXOF is the variant with the
  prefix property. Stage 4 computes both.
- **Reading an accepted tag as more than it is.** Verification establishes that these exact bytes
  were authenticated under this exact key at these exact parameters. It says nothing about who
  computed it, when, or whether the message should be acted on — a replayed old message and tag
  verify perfectly.
- **Trusting a comparison that returns early.** A verifier that stops at the first mismatching
  byte leaks information through timing. The comparison here accumulates the XOR of every byte
  pair and tests once — the right shape, though JavaScript still makes no timing promise.

## Real-World Usage

KMAC is specified in NIST SP 800-185 and is the MAC and KDF of choice in Keccak-based designs,
including CNSA 2.0-aligned and post-quantum key schedules where a SHA-3-family primitive is
already present. cSHAKE's domain separation is the same mechanism ML-KEM and ML-DSA rely on to
keep their internal hash uses independent. (This demo builds the primitives only; no protocol is
built here.)

## How to Run Locally

`​``bash
npm ci
npm run dev            # http://localhost:5173/crypto-lab-kmac-gate/
npm test               # 257 unit tests, including 21 spec KATs
npm run build          # tsc --noEmit && vite build
npm run test:browser   # 53 Playwright tests: axe WCAG gate + theme contract + claims suite
`​``

`npm run test:browser` builds first, then serves `dist/` on port 4646, so what is tested is what
ships.

## Related Demos

- [crypto-lab-mac-race](https://systemslibrarian.github.io/crypto-lab-mac-race/) — the
  length-extension forgery as a playable attack
- [crypto-lab-babel-hash](https://systemslibrarian.github.io/crypto-lab-babel-hash/) — hash
  construction internals and their failure modes
- [crypto-lab-collision-vault](https://systemslibrarian.github.io/crypto-lab-collision-vault/) —
  collision resistance
- [crypto-lab-hash-zoo](https://systemslibrarian.github.io/crypto-lab-hash-zoo/) — the hash
  function landscape

## Build & Verify

**257 unit tests (Vitest), of which 21 are spec known-answer tests.**

| Suite | File | What it covers |
| --- | --- | --- |
| Permutation | `src/keccak/keccak-f1600.test.ts` | ρ offsets and ι round constants **derived** from their FIPS 202 definitions and asserted equal to the published tables; the all-zero-state vectors |
| FIPS 202 KATs | `src/keccak/fips202.test.ts` | 4 SHA3-256 + 2 SHAKE known answers, rate-boundary inputs, the prefix property |
| SP 800-185 KATs | `src/keccak/sp800-185.test.ts` | 4 cSHAKE + 11 KMAC/KMACXOF sample values, the encoding functions, the SHAKE fallback |
| Cross-oracle | `src/keccak/oracle.test.ts` | agreement with **two independent implementations** — OpenSSL via `node:crypto` for FIPS 202, `js-sha3` for SP 800-185 — across message lengths straddling both rate boundaries |
| Architecture | `src/keccak/architecture.test.ts` | the "one sponge" claim, behaviourally and structurally |
| Demo layer | `src/demo/*.test.ts` | tag/verify accept and every reject path, verdict retirement and the no-op guard, trace fidelity, the run report's parts-sum-to-whole |
| Pipeline spine | `src/demo/pipeline.test.ts` | the Keccak-f[1600] step is identical in all four modes; a step is marked changed only when its value really differs; padding offsets come from structural metadata, including for messages containing `0x06`/`0x1f`/`0x04`/`0x80` as data; capacity lanes are zero before the permutation and non-zero after |

`js-sha3` and `node:crypto` are **test-only oracles**. Neither is imported by the app bundle,
which is hand-rolled down to the permutation.

**53 browser tests (Playwright).** `e2e/a11y.spec.ts` runs `@axe-core/playwright` against the
production build for zero WCAG 2.1 A/AA violations across **six interaction states** (first
paint, mid-trace, cSHAKE fallback, tag accepted, verdict retired, tag rejected), plus an
arithmetic contrast sweep that measures every text node against the surface it
is actually drawn on, a `[hidden]` leak probe, and a keyboard-reachability check on every
scrollable region. `e2e/claims.spec.ts` checks the page cannot claim what it did not compute:
every headline value is re-derived independently, every failure path is exercised, and verdict
retirement and its no-op guard are asserted. `e2e/theme.spec.ts` asserts the theme contract below.

The accessibility gate blocks the deploy: `.github/workflows/deploy.yml` runs the unit tests, the
typechecked build, and the browser suite before publishing — on pull requests as well as on
pushes, so a Dependabot bump is judged by the same gate before it can merge itself.

## Theme

The page is dark, and there is no way to change it. `<head>` pins `data-theme="dark"` with a
literal before first paint, overwriting any stored preference rather than reading one.

This lab was built before the fleet-wide toggle removal and was missed by it, so until now it
still shipped the old header toggle — which persisted its choice, meaning a single past click
pinned a returning visitor to the light palette forever. Both the button and its handler are
gone, the boot script writes instead of reads, and `e2e/theme.spec.ts` blocks the deploy if
either comes back. The `[data-theme='light']` block left in `src/styles.css` is dead code:
nothing selects it.

## Performance

Every mode is computed synchronously on each keystroke. A typical render runs the permutation
about 26 times per render — 7 for the four mode operations themselves and 19 more for the side-by-side comparisons the page computes as evidence — well under a millisecond of Keccak work — so the page
recomputes everything from scratch rather than caching, which is also what keeps any two panels
from describing different runs. The BigInt implementation is considerably slower than an
optimised 32-bit-lane one; that is a deliberate trade for readability.

---

*One of 120+ browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Drift Key

- **slug**: `crypto-lab-drift-key`
- **repo**: https://github.com/systemslibrarian/crypto-lab-drift-key
- **live**: https://systemslibrarian.github.io/crypto-lab-drift-key/
- **commit_sha**: `13e64277ae48f235d4eee84b38df023ac36e520e` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `4789d34c90d7233a87121446758c93bb103871f3`
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS  ·  **level**: advanced  ·  **--accent**: #a3e635
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Drift Key  — _read from index.html_

**Subtitle**: Fuzzy extractor &middot; code-offset sketch &middot; Dodis&ndash;Reyzin&ndash;Smith 2004  — _read from index.html_

**Description**: Same device, different bits, same key — then watch a weak source give that key away without a single check failing.  — _read from index.html_

**Why it matters**: A key that is never stored cannot be read out of a chip that is switched off. Getting there means publishing helper data, and the whole question is what that costs.  — _read from index.html_

**Card copy**: Turn a noisy reading that never repeats into the same key every time: a code-offset secure sketch over hand-built BCH codes, HKDF-SHA-256, and the exact entropy the public helper data costs.

**Chips**: Fuzzy Extractor · Code-Offset Sketch · BCH · HKDF-SHA-256

**Implements**: BCH `src/crypto/bch.ts:62`, Fuzzy extractor `src/crypto/sketch.ts:53`, HKDF `src/crypto/kdf.ts:34`, SHA-256 `src/crypto/kdf.ts:34`

**Attacks shown**: Brute force `src/ui/panels/context.ts:72`, Key recovery `src/ui/panels/guided.ts:606`

**Comment-only (named in code comments, not executed)**: Reed-Muller `src/crypto/bch.ts:92`, von Neumann extractor `src/model/source.ts:47`

**References**: Classic McEliece, HMAC, Repetition code

**Standards body**: IETF, NIST

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `CHES 2007` — first seen README.md:204 (3×)
- `CHES 2008` — first seen README.md:208 (3×)
- `eprint.iacr.org/2003/235` — first seen README.md:52 (3×)
- `EUROCRYPT 2004` — first seen src/crypto/sketch.ts:3 (3×)
- `RFC 5869` — first seen README.md:27 (6×)

**README — What Can Go Wrong**:

```text
- **The source has less min-entropy than you assumed.** This is the failure that matters, and the
  construction cannot see it. Enrolment, decoding and reproduction behave identically whether the
  residual bound is 64 bits or 50 below zero. Characterising a real source means measuring per-cell
  behaviour across temperature, voltage and device lifetime — there is no substitute, and nothing
  in the pipeline does it for you.
- **The re-reading drifts past the code's radius.** The device cannot unlock. That is the correct
  behaviour; the alternative is worse.
- **Mis-correction.** Past the radius the decoder can land on a *different* codeword, correct
  towards it, and report success. The device derives a well-formed key that is not the right key —
  and a real device holds no copy of the enrolled reading to compare against, so it cannot tell
  this from a correct reproduction. Systems that need to know add a key confirmation value (a MAC
  or hash of the key, published alongside the helper data). That is an addition to this
  construction, not a property of it.
- **The random codeword is not uniform over the whole code.** Then the `n − k` bound does not
  apply, because that was its hypothesis. The Enrolling Twice panel ships this as a marked, broken
  variant: reproduction still works perfectly and the first helper costs 11 bits instead of 8.
- **Helper-data manipulation.** An attacker who can *modify* the published helper data is outside
  the model this page demonstrates. The code-offset sketch provides no integrity for it.
- **Repeated enrolment in a stronger model.** Boyen (CCS 2004) showed ordinary fuzzy-extractor
  security can fail under repeated use when an attacker can influence the perturbations between
  readings. Reusable fuzzy extractors are a separate notion for that reason. **This page does not
  demonstrate those attacks**, and the XOR exhibit in panel 5 is not evidence about them either way.
```

**Claims tested** (e2e/claims.spec.ts, 52 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:48
    - :48 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:49
    - :49 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:55
    - :55 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:56
    - :56 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:61
    - :61 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:62
    - :62 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:93
    - :93 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:97
    - :97 `toBeVisible` expected `{ timeout: 90_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:120
    - :120 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:152
    - :152 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:162
    - :162 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:177
    - :177 `toBe` expected `expected.result` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:178
    - :178 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:179
    - :179 `toHaveClass` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:182
    - :182 `toBe` expected `expected.check` _(expression)_
- `the construction` — e2e/claims.spec.ts:185
- `h = w XOR c, recomputed from the three values the page printed` — e2e/claims.spec.ts:186
    - :197 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :205 `toEqual` expected `hb` _(expression)_
    - :208 `toBe` expected `true` _(expression)_
    - :209 `toBe` expected `w` _(expression)_
- `the stepper ends with the same key, and both sides are printed in full` — e2e/claims.spec.ts:212
    - :216 `toBe` expected `'Step 0 / 6'` _(literal)_
    - :220 `toBe` expected `'Step ${i} / 6'` _(expression)_
    - :223 `toHaveCount` expected `7` _(literal)_
    - :227 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :228 `toBe` expected `atEnrolment` _(expression)_
    - :238 `toBe` expected `actual` _(expression)_
- `the helper carries exactly the syndrome, and a codeword carries none` — e2e/claims.spec.ts:241
    - :251 `expect` expected _no expected value_ _(none)_
    - :257 `toMatch` expected `/^[01]+$/` _(regex)_
    - :258 `toBe` expected `n - k` _(expression)_
    - :259 `toBe` expected `ofSource` _(expression)_
    - :260 `toBe` expected `'0'.repeat(n - k)` _(expression)_
- `every failure path, and the page naming the cause` — e2e/claims.spec.ts:265
- `past the radius the decoder fails and prints its own failure code` — e2e/claims.spec.ts:266
    - :272 `expect` expected _no expected value_ _(none)_
    - :279 `expect` expected _no expected value_ _(none)_
    - :280 `expect` expected _no expected value_ _(none)_
    - :285 `expect` expected _no expected value_ _(none)_
    - :292 `expect` expected _no expected value_ _(none)_
- `mis-correction is reachable, and reads as its own outcome` — e2e/claims.spec.ts:295
    - :308 `expect` expected _no expected value_ _(none)_
    - :309 `expect` expected _no expected value_ _(none)_
    - :313 `toBe` expected `true` _(expression)_
- `BER zero reproduces with nothing corrected, and the page says it is trivial` — e2e/claims.spec.ts:321
    - :325 `toBe` expected `'0'` _(literal)_
    - :326 `toBe` expected `'0%'` _(literal)_
- `the measured sweeps agree with the predictions` — e2e/claims.spec.ts:331
- `every reliability row sums to its trial count and matches a direct binomial` — e2e/claims.spec.ts:332
    - :337 `toBeVisible` expected `{ timeout: 180_000 }` _(expression)_
    - :340 `expect` expected _no expected value_ _(none)_
    - :345 `expect` expected _no expected value_ _(none)_
    - :355 `toBe` expected `trials` _(expression)_
    - :360 `expect` expected _no expected value_ _(none)_
    - :367 `expect` expected _no expected value_ _(none)_
    - :379 `expect` expected _no expected value_ _(none)_
    - :380 `toMatch` expected `/^\d+ \/ \d+$/` _(regex)_
- `switching the code RETIRES the sweep, and re-selecting the same one does not` — e2e/claims.spec.ts:383
    - :388 `toBeVisible` expected `{ timeout: 180_000 }` _(expression)_
    - :396 `toBeVisible` expected _no expected value_ _(none)_
    - :403 `toHaveCount` expected `0` _(literal)_
    - :404 `toContainText` expected `'Press Run the sweep'` _(literal)_
    - :405 `toBeVisible` expected _no expected value_ _(none)_
- `the entropy accounting` — e2e/claims.spec.ts:409
- `residual = m - (n - k) at every bias, and the loss never moves` — e2e/claims.spec.ts:418
    - :426 `toHaveText` expected `Number(skew).toFixed(2)` _(expression)_
    - :430 `expect` expected _no expected value_ _(none)_
    - :434 `expect` expected _no expected value_ _(none)_
    - :438 `toBeCloseTo` expected `a.m, 1` _(expression)_
    - :439 `toBeCloseTo` expected `a.loss, 1` _(expression)_
    - :440 `toBeCloseTo` expected `a.residual, 1` _(expression)_
    - :442 `toBe` expected `1` _(literal)_
- `a fair-coin source has m = n exactly, and the loss is n - k` — e2e/claims.spec.ts:445
    - :459 `toBeCloseTo` expected `n, 1` _(expression)_
    - :460 `toBe` expected `n - k` _(expression)_
    - :461 `toBeCloseTo` expected `n - (n - k), 1` _(expression)_
- `a negative residual is drawn below zero, never as a small positive` — e2e/claims.spec.ts:465
    - :471 `expect` expected _no expected value_ _(none)_
    - :474 `toHaveCount` expected `1` _(literal)_
    - :475 `toHaveCount` expected `0` _(literal)_
    - :476 `toContainText` expected `'below zero'` _(literal)_
    - :480 `toContainText` expected `'it does not say the helper leaks more'` _(literal)_
- `the measured attack` — e2e/claims.spec.ts:484
- `the win condition is the guess landing inside the radius, re-derived` — e2e/claims.spec.ts:485
    - :492 `toBeVisible` expected _no expected value_ _(none)_
    - :501 `toBe` expected `shouldWin ? 'alarm' : 'pass'` _(expression)_
    - :502 `expect` expected _no expected value_ _(none)_
- `against a fair-coin source the attack is at a chance level far below any decimal` — e2e/claims.spec.ts:506
    - :513 `expect` expected _no expected value_ _(none)_
    - :527 `expect` expected _no expected value_ _(none)_
- `the bias sweep table is internally consistent and matches the exact probability` — e2e/claims.spec.ts:530
    - :534 `toBeVisible` expected `{ timeout: 180_000 }` _(expression)_
    - :537 `expect` expected _no expected value_ _(none)_
    - :548 `expect` expected _no expected value_ _(none)_
    - :551 `expect` expected _no expected value_ _(none)_
    - :557 `toBe` expected `true` _(expression)_
    - :558 `toBe` expected `true` _(expression)_
- `enrolling twice` — e2e/claims.spec.ts:562
- `the bits-learned counter is a ratio of two counts the page printed` — e2e/claims.spec.ts:563
    - :572 `toBeCloseTo` expected `Math.log2(before / after), 6` _(expression)_
    - :573 `toBe` expected `0` _(literal)_
    - :574 `toBe` expected `128` _(literal)_
    - :577 `toBe` expected `await readClaim(page, 'reuse-syn2')` _(expression)_
- `a noisy re-read exposes the flips and still adds no bits of the reading` — e2e/claims.spec.ts:580
    - :585 `toBe` expected `await readClaim(page, 'reuse-syn2')` _(expression)_
    - :587 `expect` expected _no expected value_ _(none)_
    - :592 `toBeCloseTo` expected `Math.log2(before / after), 6` _(expression)_
    - :593 `toBe` expected `0` _(literal)_
- `THE COUNTER MOVES: a codeword from half the code narrows the reading further` — e2e/claims.spec.ts:596
    - :602 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :607 `expect` expected _no expected value_ _(none)_
    - :608 `toBe` expected `16` _(literal)_
    - :610 `toContainText` expected `'11 bits'` _(literal)_
    - :613 `toBe` expected `0` _(literal)_
- `the page tells the truth about itself` — e2e/claims.spec.ts:617
- `the simulated-source banner is present and cannot be dismissed (I7)` — e2e/claims.spec.ts:618
    - :621 `toBeVisible` expected _no expected value_ _(none)_
    - :622 `toContainText` expected `'No physical device here'` _(literal)_
    - :623 `toContainText` expected `'Not production crypto'` _(literal)_
    - :626 `expect` expected _no expected value_ _(none)_
    - :631 `toContainText` expected `'No physical device here'` _(literal)_
    - :635 `toBeVisible` expected _no expected value_ _(none)_
- `nothing is hidden by a class rule while the code believes it is hidden` — e2e/claims.spec.ts:638
    - :648 `toEqual` expected `[]` _(expression)_
    - :649 `toHaveCount` expected `5` _(literal)_
- `the bit grids say in words what they draw` — e2e/claims.spec.ts:652
    - :662 `expect` expected _no expected value_ _(none)_
    - :663 `expect` expected _no expected value_ _(none)_
    - :665 `toHaveCount` expected `Number(label.match(/(\d+) cells,/)?.[1])` _(expression)_
    - :666 `toHaveCount` expected `set` _(expression)_
    - :667 `toHaveCount` expected `ringed` _(expression)_
- `§4.1d the negative claim` — e2e/claims.spec.ts:685
- `reproduced AND recovered, with every construction check green` — e2e/claims.spec.ts:686
    - :692 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :693 `toHaveAttribute` expected `'data-fixture', 'weak-source'` _(expression)_
    - :697 `expect` expected _no expected value_ _(none)_
    - :725 `expect` expected _no expected value_ _(none)_
    - :726 `toEqual` expected `[]` _(expression)_
    - :732 `toBeVisible` expected _no expected value_ _(none)_
    - :733 `toHaveAttribute` expected `'hidden', /.*/` _(expression)_
    - :734 `toBe` expected `true` _(expression)_
    - :735 `toContainText` expected _no expected value_ _(none)_
    - :738 `toContainText` expected _no expected value_ _(none)_
    - :744 `toBe` expected `'NO_CODE_FOR_WEAK_SOURCE'` _(literal)_
    - :745 `toContainText` expected `'there is none'` _(literal)_
- `the experience` — e2e/claims.spec.ts:759
- `the first action is reachable without hunting for it` — e2e/claims.spec.ts:760
    - :764 `toBe` expected `true` _(expression)_
    - :772 `expect` expected _no expected value_ _(none)_
    - :773 `expect` expected _no expected value_ _(none)_
- `guided mode never offers more than one primary action at a time` — e2e/claims.spec.ts:776
    - :785 `toBe` expected `1` _(literal)_
    - :787 `toEqual` expected `[1, 1, 1, 1, 1]` _(expression)_
- `every guided action leaves its result in the viewport` — e2e/claims.spec.ts:790
    - :795 `toBeVisible` expected _no expected value_ _(none)_
    - :796 `toBeVisible` expected _no expected value_ _(none)_
    - :797 `toBeVisible` expected _no expected value_ _(none)_
    - :798 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :799 `toBeVisible` expected `{ timeout: 90_000 }` _(expression)_
    - :804 `expect` expected _no expected value_ _(none)_
- `the punchline lands in five primary actions, and says both things at once` — e2e/claims.spec.ts:812
    - :816 `toBe` expected `5` _(literal)_
    - :826 `toBe` expected `true` _(expression)_
    - :832 `expect` expected _no expected value_ _(none)_
    - :833 `expect` expected _no expected value_ _(none)_
- `colour tracks system integrity, not the raw return value` — e2e/claims.spec.ts:836
    - :850 `toBeVisible` expected _no expected value_ _(none)_
    - :852 `expect` expected _no expected value_ _(none)_
    - :853 `expect` expected _no expected value_ _(none)_
    - :856 `toBe` expected `'pass'` _(literal)_
    - :857 `toBe` expected `'alarm'` _(literal)_
    - :858 `toHaveClass` expected `/verdict-pass\b/` _(regex)_
    - :860 `toHaveClass` expected `/verdict-alarm\b/` _(regex)_
    - :861 `toHaveClass` expected `/verdict-pass\b/` _(regex)_
    - :865 `toBe` expected `'measurement'` _(literal)_
    - :866 `toBe` expected `'construction'` _(literal)_
- `the scenario bar names the shared state, and Reset restores it` — e2e/claims.spec.ts:869
    - :871 `toBe` expected `'Healthy source'` _(literal)_
    - :872 `toHaveCount` expected `0` _(literal)_
    - :874 `expect` expected _no expected value_ _(none)_
    - :881 `toBe` expected `'Weak source'` _(literal)_
    - :882 `toBeVisible` expected _no expected value_ _(none)_
    - :883 `expect` expected _no expected value_ _(none)_
    - :888 `toBe` expected `'Weak source'` _(literal)_
    - :889 `expect` expected _no expected value_ _(none)_
    - :892 `toHaveText` expected `'Healthy source'` _(literal)_
    - :893 `toHaveCount` expected `0` _(literal)_
    - :894 `expect` expected _no expected value_ _(none)_
    - :895 `expect` expected _no expected value_ _(none)_
- `the weak-source control says what it does, not what the test suite calls it` — e2e/claims.spec.ts:898
    - :902 `toBe` expected `'Break secrecy without breaking reproduction'` _(literal)_
    - :903 `expect` expected _no expected value_ _(none)_
    - :908 `toBeVisible` expected `{ timeout: 90_000 }` _(expression)_
    - :909 `expect` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Drift Key

**Fuzzy extractors · code-offset secure sketch · BCH · HKDF-SHA-256**

Turn a reading that is never the same twice into the same key every time, and see exactly how
much secrecy the public helper data costs.

**[Live demo →](https://systemslibrarian.github.io/crypto-lab-drift-key/)**

---

## What It Is

An interactive lab for **fuzzy extractors**: the construction that turns a noisy, non-repeatable
physical measurement into a stable cryptographic key, at a cost in secrecy you can write down
before you build anything.

The exact primitives on the page:

- **The code-offset secure sketch.** Juels and Wattenberg published it in 1999 as *fuzzy
  commitment*; Dodis, Reyzin and Smith named and analysed it as a *secure sketch* in 2004.
  Enrolment picks a uniformly random codeword `c` and publishes `h = w XOR c`. Reproduction
  computes `h XOR w' = c XOR e`, decodes to `c`, and recovers `w = h XOR c`.
- **Binary primitive narrow-sense BCH codes**, hand-rolled and inspectable: GF(2^m) log/antilog
  arithmetic, the generator polynomial built from cyclotomic cosets, systematic encoding,
  syndromes, Berlekamp–Massey, and a Chien search. Five sizes from BCH(15, 7) to BCH(255, 131).
- **HKDF-SHA-256 from WebCrypto** (RFC 5869) as the key-derivation step, pinned to all three of
  the RFC's SHA-256 test vectors through the same call path the lab derives keys with.
- **A labelled noise model** standing in for an SRAM PUF, with its parameters on screen.

**The security model, stated plainly.** For a binary linear `[n, k]` code used in the code-offset
construction, and *any* source `W` with min-entropy `m`, the sketch leaves

`​``
Hinf~(W | SS(W))  >=  m - (n - k)
`​``

That is the *average min-entropy of the source given the helper data* — how hard `W` still is to
guess for someone holding everything that was published. It is an upper bound on the **loss**, not
an estimate of it, and it holds for non-uniform sources without modification.

In Dodis, Ostrovsky, Reyzin and Smith this is **Theorem 5.1**: an `[n, k, 2t+1]` code over `F`
gives an average-case `(F^n, m, m − (n − k)f, t)` secure sketch, and over the binary alphabet
`f = 1`. It rests on their **Lemma 2.2(b)** — a published value with at most `2^λ` possibilities
costs at most `λ` bits of average min-entropy, and the syndrome has exactly `2^(n−k)` of them.
**Construction 2** is the code-offset construction, and the paper says outright that over the
binary alphabet it *is* the Juels–Wattenberg commitment `SS(w) = w ⊕ C(x)`; **Construction 3**
publishes the syndrome directly, and the two are proved equivalent in both directions — which is
the equality the Enrol & Reproduce panel measures on screen. **Lemma 4.1** builds the fuzzy
extractor from a sketch plus an average-case strong extractor.

*These numbers were read from [eprint.iacr.org/2003/235](https://eprint.iacr.org/2003/235), the
revision dated 20 January 2008, which is the journal version — not from the printed SIAM pages.
Numbering can differ between a preprint and the copy-edited article, so every statement is given
in full here and on the page as well; check those rather than the numbers if the two disagree.*

Three things it is **not**:

- It is **not** the entropy of the derived key. The key comes from a further extraction step with
  its own loss. The security proof uses a strong randomness extractor (universal hashing and the
  leftover hash lemma) and gives an information-theoretic statement; this lab uses HKDF-SHA-256,
  which is what a real device ships and rests on different assumptions. No bit count for the key
  itself is claimed anywhere.
- It is **not** a promise that enough is left. Bias does not make the helper leak more than
  `n − k` bits — it lowers `m`, so the same subtraction can leave nothing. The page shows the
  residual going below zero and says there is no guarantee left, which is a different statement
  from "the helper leaks more".
- It is **not** production crypto. This is a teaching demo. The code is written to be read, the
  model PRNG is not cryptographic, and nothing here has been reviewed for deployment.

**There is no physical device in this page.** A browser has no PUF and cannot acquire one, so the
cell readings come from an explicit model whose parameters are on screen. Everything downstream of
the readings — the error-correcting code, the helper data, the key derivation — is real.

## Exhibits

There are two ways in. **Guided tour** is the default: five scenes, one thing to press at a time,
each scene's result directly beneath its own action, and the whole argument in about ninety
seconds. **Explore freely** is the six-panel lab below, with every control.

A persistent **scenario bar** names the settings every exhibit is reading — `Healthy source`,
`Too noisy`, `Weak source`, or `Custom` — with the code, the re-read noise, the residual bound, and
a Reset. Before it existed, pressing the weak-source button on one panel silently re-tuned the
device for every other one, and a visitor who moved between exhibits afterwards was reading a
different experiment without being told.

### The guided tour

1. **Same device, different reading.** Read the modelled device twice; a few cells change.
2. **So hash it?** Hash both readings with real SHA-256; two completely different keys.
3. **The key comes back.** The BCH decode, one operation at a time on a single stage that changes
   rather than a column of cards that grows — `w`, `h = w ⊕ c`, `w'`, `h ⊕ w'`, the repair, the
   recovered reading, the key — ending on the two keys compared byte for byte.
4. **Reliability has a boundary.** Push the re-read past the correction radius and watch the real
   decoder refuse, or mis-correct.
5. **Correct is not secret.** A weak source. Reproduction stays green and the attacker gets the
   key from published data alone: **The device succeeded. The attacker did too.**

### The full lab

1. **Noisy Source.** Power the modelled device up twice and watch the cells disagree. Then hash
   both readings with real SHA-256 and watch the two digests diverge completely — the problem the
   rest of the lab exists to solve.
2. **Enrol & Reproduce.** The headline mechanism, stepped one line at a time: the enrolled reading
   `w`, a uniformly random codeword `c`, the published helper `h = w XOR c`, a later reading `w'`,
   the offset `h XOR w'`, the decode that finds and undoes the flips, the recovered reading, and
   the key. Every point where two things should be equal is compared byte for byte on screen.
   A three-column split keeps *secret*, *public* and *derived* apart. Push the bit-error rate past
   the code's radius and the real decoder fails, naming its own failure code; choose BCH(15, 7)
   and it will sometimes **mis-correct** instead — returning a perfectly well-formed key that is
   simply the wrong one.
3. **Measured Reliability.** Thousands of full enrol-and-reproduce cycles in a worker, plotted
   against `1 − P(Binomial(n, BER) ≤ t)` with no fitted parameter, with 95% intervals drawn and
   decode failures and mis-corrections counted separately.
4. **What the Helper Costs.** The entropy bar: `m`, minus `n − k`, equals the residual — which is
   allowed to reach zero and go below it, and is drawn below zero when it does. Beside it, a
   measured guessing attack that uses only public data, and a sweep across the whole bias range
   showing how far apart "the bound stops promising" and "the attack starts winning" really are.
   This panel holds the negative claim (below).
5. **Enrolling Twice.** Two helpers for one source. Exactly: `h1 XOR h2 = c1 XOR c2`, a codeword —
   the reading cancels. With a noisy re-read the XOR exposes *which cells flipped*, not what they
   hold. The "bits of the reading the second helper added" counter is **counted, not asserted**:
   every candidate is enumerated. A deliberately broken variant — drawing the codeword from half
   the code — makes that same counter move, which is what makes the zero a result.
6. **Why It Matters.** SRAM PUF device keys, biometric template protection, the honesty list, and
   the references.

## What Can Go Wrong

- **The source has less min-entropy than you assumed.** This is the failure that matters, and the
  construction cannot see it. Enrolment, decoding and reproduction behave identically whether the
  residual bound is 64 bits or 50 below zero. Characterising a real source means measuring per-cell
  behaviour across temperature, voltage and device lifetime — there is no substitute, and nothing
  in the pipeline does it for you.
- **The re-reading drifts past the code's radius.** The device cannot unlock. That is the correct
  behaviour; the alternative is worse.
- **Mis-correction.** Past the radius the decoder can land on a *different* codeword, correct
  towards it, and report success. The device derives a well-formed key that is not the right key —
  and a real device holds no copy of the enrolled reading to compare against, so it cannot tell
  this from a correct reproduction. Systems that need to know add a key confirmation value (a MAC
  or hash of the key, published alongside the helper data). That is an addition to this
  construction, not a property of it.
- **The random codeword is not uniform over the whole code.** Then the `n − k` bound does not
  apply, because that was its hypothesis. The Enrolling Twice panel ships this as a marked, broken
  variant: reproduction still works perfectly and the first helper costs 11 bits instead of 8.
- **Helper-data manipulation.** An attacker who can *modify* the published helper data is outside
  the model this page demonstrates. The code-offset sketch provides no integrity for it.
- **Repeated enrolment in a stronger model.** Boyen (CCS 2004) showed ordinary fuzzy-extractor
  security can fail under repeated use when an attacker can influence the perturbations between
  readings. Reusable fuzzy extractors are a separate notion for that reason. **This page does not
  demonstrate those attacks**, and the XOR exhibit in panel 5 is not evidence about them either way.

### The negative claim

Every lab here declares at least one security property its construction does **not** provide, and
backs it with a state you can reach:

> **Reproducing the key correctly is not evidence that any secrecy is left.** This construction
> raises no failure code for a source that never had enough min-entropy: enrolment, decoding and
> reproduction behave identically whether the residual bound is 64 bits or 50 bits below zero.

The **Weak-source fixture** button on panel 4 drives the page into exactly that state. Every check
the construction performs reports success — the decoder corrects, the codeword matches, the
recovered reading matches, the key matches byte for byte, the syndrome equivalence holds — and the
key has *already* been recovered from the published data by the attacker running beside it. The
headline verdict reads **KEY REPRODUCED — AND RECOVERED FROM PUBLIC DATA**.

`e2e/claims.spec.ts` asserts all three halves of that: that the state is reachable through the UI,
that every construction check in it reports pass (swept across the page, not sampled), and that the
limitation is visible on screen in that state rather than hidden behind a disclosure.

## When to Use It

**Use a fuzzy extractor when** the secret you want is a measurement rather than a stored value: an
SRAM PUF device key, a ring-oscillator or arbiter PUF, a biometric template you must not store. The
appeal is that between power-ups there is nothing on the chip to find.

**Do NOT use one when:**

- **You have not measured the source's min-entropy.** The `n − k` bound is arithmetic; `m` is an
  empirical fact about your hardware, and the whole guarantee is their difference. A fuzzy
  extractor over an uncharacterised source is a key derived from an unknown quantity.
- **You could just store a key in protected hardware.** A secure element with real key storage is
  simpler, faster and better understood. Fuzzy extractors earn their complexity where that option
  does not exist.
- **Your error metric is not Hamming distance.** Set difference wants a fuzzy vault (Juels–Sudan
  2002), which is a different scheme; edit distance wants something else again.
- **You need to re-enrol under an adversary's influence.** That is the reusability setting, and it
  needs a construction designed for it.

## Live Demo

**<https://systemslibrarian.github.io/crypto-lab-drift-key/>**

Power the device up twice and see the cells disagree. Step through the enrolment one line at a
time and watch the key come back byte for byte. Push the bit-error slider past the code's radius
and break it. Run a few thousand reproductions and lay the measurement over the prediction. Then
raise the cell skew, watch the residual bound cross zero, and run the attack that takes the key out
of the public helper data.

## Real-World Usage

- **SRAM PUF key generation.** The power-up pattern of an uninitialised SRAM block is a per-chip
  fingerprint. Guajardo, Kumar, Schrijen and Tuyls (CHES 2007) proposed deriving a device key from
  it with helper data, and the approach is shipped commercially. The expensive part is the decoder,
  so hardware designs put a cheap inner code — a repetition code, say — in front of the BCH stage to
  clean up the bulk of the noise before it runs; Bösch, Guajardo, Sadeghi, Shokrollahi and Tuyls
  (CHES 2008) is the reference for making helper-data key extraction efficient on an FPGA. **This
  lab implements a single BCH stage and claims no particular published parameter set** — the
  concatenated construction is named as a design idea, not as a surveyed norm.
- **Biometric template protection.** Juels and Wattenberg's original motivation. Feature extraction
  — turning a scan into a bit string whose Hamming distance means something — is its own hard
  problem and is not modelled here.
- **Anti-counterfeiting and key storage without key storage.** A device that can derive its key but
  never holds it at rest changes what an attacker must do; reading the flash gives them the helper
  data, which was public anyway.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-drift-key.git
cd crypto-lab-drift-key
npm install
npm run dev          # http://localhost:5173/crypto-lab-drift-key/
`​``

`​``bash
npm test             # 175 unit tests (Vitest)
npm run build        # typecheck + production build
npx playwright install chromium
npm run test:a11y    # the WCAG 2.1 AA gate, desktop and 380px
npm run test:claims  # 28 claims tests, incl. the negative claim and the experience assertions
`​``

## Related Demos

- [crypto-lab-syndrome-drain](https://systemslibrarian.github.io/crypto-lab-syndrome-drain/) —
  syndrome decoding as a *hardness* assumption. The same syndrome, used for the opposite purpose:
  here it is the thing the helper reveals, there it is the thing that must stay hard.
- [crypto-lab-mceliece-gate](https://systemslibrarian.github.io/crypto-lab-mceliece-gate/) —
  error-correcting codes where knowing the decoder *is* the trapdoor.
- [crypto-lab-kdf-chain](https://systemslibrarian.github.io/crypto-lab-kdf-chain/) — what a
  key-derivation function is doing, step by step.
- [crypto-lab-entropy-collapse](https://systemslibrarian.github.io/crypto-lab-entropy-collapse/) —
  what happens to a system when its entropy source is not what it was believed to be.
- [crypto-lab-quantum-entropy](https://systemslibrarian.github.io/crypto-lab-quantum-entropy/) —
  extracting a key from a physical randomness source.

## Build & Verify

**205 tests, all passing: 175 unit (Vitest), 28 claims and 2 accessibility scans (Playwright).**

Known-answer and exhaustive verification:

| What | Where |
|---|---|
| RFC 5869 HKDF-SHA-256 vectors A.1, A.2, A.3, through the lab's own call path | `src/crypto/kdf.test.ts` |
| BCH `(n, k)` against the published parameter table, 16 codes | `src/crypto/bch.test.ts` |
| BCH(15, 7) over its **whole 2^15 space**: the decoder corrects exactly the words inside a ball of radius `t` and fails on exactly the words outside every ball, judged by a brute-force nearest-codeword oracle that shares no arithmetic with it | `src/crypto/bch.test.ts` |
| Every codeword × every error of weight ≤ 2 (15,488 decodes), and every weight-3 pattern (58,240) confirming a decode past the radius never returns the sent codeword | `src/crypto/bch.test.ts` |
| GF(2^m) table multiplication against carry-less multiply-and-reduce, exhaustively for m = 3…8 | `src/crypto/gf2m.test.ts` |
| `syn(h) = syn(w)`, and that a coset has exactly 2^k members, by enumeration | `src/crypto/sketch.test.ts` |
| Measured reliability within four standard errors of the binomial prediction, seeded | `src/model/trials.test.ts` |
| The attacker module's imports, parsed from its own source (invariant I5) | `src/model/attacker.test.ts` |

**The experience is tested too.** Correctness tests could not see the defect that mattered most:
every claim in the suite passed while the strongest result in the lab rendered **1003px below the
button that produced it** in a 900px viewport, with the scroll position unchanged — a visitor could
press the marquee control and watch nothing happen. So reachability is now a claim like any other.
`e2e/claims.spec.ts` asserts that the first action is visible without scrolling on desktop and
within 1.25 viewports at 390px; that guided mode never offers more than one primary action at a
time; that every guided action leaves its result inside the viewport; that the punchline arrives in
five primary actions; that the scenario bar names the shared state and Reset restores it; and that
colour tracks system integrity rather than the return value — the device reproducing its own key is
green, the attacker deriving that same key is an alarm, from the same component.

**Accessibility.** `npm run build && npm run test:a11y` must pass with **zero** violations, at
1280px and at 380px, and it gates the deploy. The gate is the honest form: it injects nothing into
the page, reveals no panel from script, asserts axe's `incomplete` bucket as well as `violations`,
and adds the three oracles axe has no rule for — arithmetic composite-aware contrast, non-text
contrast ratcheted against an **empty** baseline, and reflow. It found three real defects on its
first runs, each fixed in the source rather than baselined.

**Mutation discipline.** A green suite is not evidence until you have watched it fail. Six
mutations were applied to the source, each confirmed to build cleanly and change the shipped
bundle before its owning test was checked:

| Mutation | Result |
|---|---|
| Delete the negative-claim sentence | the §4.1d fixture fails on assertion 3, naming the missing text |
| Invert the byte-for-byte comparison | the fixture fails on assertion 2: `key-match` reports `fail` |
| Report the *promised* leak instead of the measured one in the reuse counter | `THE COUNTER MOVES` fails: "8 bits, not the 8 the construction promises" |
| `residual = m + (n − k)` instead of `m − (n − k)` | 5 unit tests and 2 claims tests fail |
| Degrade `--control-border` below 3:1 | the a11y gate fails naming every tab at 1.90:1 |
| Degrade `--text-dim` below 4.5:1 | the a11y gate fails with axe violations at every driven state |

The gate went on earning its place after that. Restructuring the page into two modes moved `<main>`
inside the container that starts hidden, and the gate failed the arrival state on
`landmark-one-main` before a human would have noticed the document had no main landmark at all.

One mutation left everything green: removing the decoder's final "is the corrected word really a
codeword?" check. Under §4.1c that is evidence about the *source*, so it was measured rather than
explained away — across the entire 32,768-word space of BCH(15, 7) and 20,000 heavy-error decodes
over all five codes, `DECODE_RESIDUAL_SYNDROME` never fires; the Chien root-count test catches every
inconsistent locator first. The check stays, because it is the last thing standing between
"corrected" and a best guess, but the finding is recorded in `bch.ts`, asserted in `bch.test.ts`,
and stated on the page's own failure-code table rather than letting the lab list a code it cannot
raise.

## Performance

Every trial runs the whole pipeline — enrol with a fresh random codeword, derive a real
HKDF-SHA-256 key, reproduce, compare key bytes — rather than shortcutting to a Hamming-weight test
that would agree with the prediction by construction. In a worker, on a laptop: about 2,700
reproductions in 210 ms on BCH(127, 64), and about 5,400 in 1.5 s on BCH(255, 131). The exhaustive
BCH(15, 7) test suite decodes about 139,000 received words, cross-checking most of them against a
brute-force search over all 128 codewords.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Hash Hunt

- **slug**: `crypto-lab-hash-hunt`
- **repo**: https://github.com/systemslibrarian/crypto-lab-hash-hunt
- **live**: https://systemslibrarian.github.io/crypto-lab-hash-hunt/
- **commit_sha**: `9cca4441e6f15f37529fdb0d61ce1cf1aa8f3208` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HASHING & KDFS | ATTACKS  ·  **level**: intermediate  ·  **--accent**: #f3ca72
- **MISSING FIELDS**: verification

**Name (H1)**: '+escape(title)+'  — _read from src/ui/ui.ts_

**Subtitle**: '+escape(subtitle)+'  — _read from src/ui/ui.ts_

**Description**: '+escape(intro)+'  — _read from src/ui/ui.ts_

**Why it matters**: '+escape(why)+'  — _read from src/ui/ui.ts_

**Card copy**: Find shortened-hash collisions, test an insecure hash-then-MAC composition, and measure chain and salt tradeoffs. Compare attacker-chosen public hash-table buckets with a secret keyed map.

**Chips**: Truncated SHA-256 · Floyd Cycle Finding · Hellman / Rainbow Chains · HMAC-SHA-256 · Hash-Table Flood

**Implements**: Floyd cycle finding `src/attack/floyd.ts:2`, Hellman chains `src/attack/tmto/tables.ts:8`, HMAC `src/mac/hashAndMac.ts:2`, Rainbow chains `src/attack/tmto/tables.ts:8`, SHA-256 `src/hash/truncate.ts:3`

**Attacks shown**: Birthday bound `brief-extension.md:61`, Collision attack `README.md:14`, Hash-flooding `src/main.ts:2`

**References**: Grover's algorithm, MD5, SHA-1, bcrypt

**Standards body**: IETF, NIST

**Implementation**: noble SHA-256 / WebCrypto HMAC / local attack engines

**Spec citations, exactly as written**:

- `CRYPTO 2004` — first seen README.md:45 (2×)
- `doi.org/10.1007/978-3-540-28628-8_19` — first seen README.md:45 (2×)
- `doi.org/10.1080/0161-117991854025` — first seen README.md:45 (2×)
- `FIPS 180-4` — first seen README.md:45 (2×)
- `RFC 4231` — first seen README.md:45 (3×)
- `rfc4231` — first seen README.md:45 (2×)

**README — What Can Go Wrong**:

```text
- A valid tag over a collision-prone digest does not establish which letter was approved.
- Two active Floyd registers exclude seeds, hash state, counters and diagnostics.
- Full lookup covers reachable digests, not all outputs. H(x) targets differ from uniform output targets.
- Hellman's roughly 0.63 model requires the stated parameter relation and heuristic independence. Rainbow's recurrence is a random-function model, not a measured success rate.
- Matching endpoints still require regeneration and verification. Diagnostic coverage/merge sets consume extra temporary memory.
- Salts prevent mapping reuse, not per-user guessing. At 12 bits, accidental valid table answers and multiple preimages are possible.
- Joux multicollisions are not second-preimage attacks. Kelsey–Schneier long-message second-preimage techniques remain out of scope, and no result on this page breaks real SHA-256.
- A public, unkeyed mapping lets an adversary search for colliding table buckets offline. Here the measured cost is the number of table slots inspected during insertion, not SHA-256 collision work. The keyed HMAC comparison is a toy countermeasure illustration, not a benchmark or proof that every server resists denial of service. The selected names, table size and probing algorithm are identical between runs; only the bucket mapping changes. See [Rust's current `HashMap` documentation](https://doc.rust-lang.org/std/collections/struct.HashMap.html) and [Aumasson and Bernstein's SipHash paper (2012)](https://www.aumasson.jp/siphash/siphash.pdf).
- Runtime caps may stop a search. Input changes retire old results; cancellation terminates the worker. Bounded fallback can occupy the main thread if workers cannot be created.
```

**Claims tested** (e2e/claims.spec.ts, 22 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:4
    - :4 `toBe` expected `b` _(expression)_
- `birthday probability and measured trial count agree independently` — e2e/claims.spec.ts:5
    - :6 `toBeVisible` expected _no expected value_ _(none)_
- `meaningful forgery is a cross-type collision with a real accepted HMAC` — e2e/claims.spec.ts:7
- `chained table preimages and full-table cost agree independently` — e2e/claims.spec.ts:8
- `salted recovered preimages verify independently and retain the negative claim` — e2e/claims.spec.ts:9
- `invalid controls refuse a result and tabs retire the old experiment` — e2e/claims.spec.ts:10
- `near miss verifier refuses equal first 8 bits at width 9` — e2e/claims.spec.ts:12
    - :21 `toContainText` expected `/Measured calibration|Calibration unavailable/` _(regex)_
    - :32 `toBe` expected `1` _(literal)_
- `multicollision forks chain from each verified next state` — e2e/claims.spec.ts:45
    - :47 `toHaveLength` expected `5` _(literal)_
    - :51 `toBe` expected `index+1` _(expression)_
    - :53 `toContainText` expected `'Swapping one choice'` _(literal)_
- `toy Merkle-Damgard display includes the encoded length block` — e2e/claims.spec.ts:56
    - :59 `toHaveAttribute` expected `'data-padding-block','PB:4'` _(expression)_
    - :60 `toBe` expected `toyMd(blocks,11,'h1')` _(expression)_
- `enumeration maps every mask to its displayed fork choices` — e2e/claims.spec.ts:63
    - :65 `toHaveAttribute` expected `'data-complete','true'` _(expression)_
    - :66 `toBe` expected `64` _(literal)_
    - :68 `toHaveCount` expected `64` _(literal)_
    - :69 `toEqual` expected `choices.map((choice,bit)=>((mask>>bit)&1)?choice.right:choice.left)` _(expression)_
- `flipping one displayed fork changes the message without moving H1` — e2e/claims.spec.ts:72
    - :75 `toBeVisible` expected _no expected value_ _(none)_
- `cascade pair independently collides under H1 and H2` — e2e/claims.spec.ts:78
    - :79 `toHaveAttribute` expected `'data-evidence-green','true'` _(expression)_
    - :80 `toEqual` expected `b` _(expression)_
    - :81 `toBe` expected `'pass'` _(literal)_
    - :82 `toContainText` expected `'2n-BIT DIGEST — b·2^(n/2) WORK'` _(literal)_
    - :83 `toContainText` expected `'does not double the collision work'` _(literal)_
    - :84 `toBeVisible` expected _no expected value_ _(none)_
- `whole-message H2 toggle still verifies the displayed concatenation collision` — e2e/claims.spec.ts:87
    - :89 `toBeVisible` expected _no expected value_ _(none)_
- `cascade compression-call parts sum and include every H2 evaluation` — e2e/claims.spec.ts:92
    - :95 `toBe` expected `candidates*11` _(expression)_
- `naive 2n-bit comparison uses the birthday exponent and measured rate` — e2e/claims.spec.ts:98
    - :100 `toHaveAttribute` expected `'data-naive-kind','extrapolated'` _(expression)_
    - :102 `toBeCloseTo` expected `Math.sqrt(Math.PI/2)*2**19,10` _(expression)_
- `multicollision evidence retires on a changed input but not a no-op` — e2e/claims.spec.ts:105
    - :106 `toBeVisible` expected _no expected value_ _(none)_
- `every selected fork stays inspectable and stage-first choices match the message blocks` — e2e/claims.spec.ts:109
    - :113 `toBeVisible` expected _no expected value_ _(none)_
    - :115 `toHaveAttribute` expected `'data-fork',String(fork)` _(expression)_
    - :117 `toEqual` expected `[fork]` _(expression)_
    - :120 `toBeVisible` expected _no expected value_ _(none)_
    - :124 `toHaveText` expected `expected` _(expression)_
- `same-type meaningful collision is rejected despite matching hashes` — e2e/claims.spec.ts:128
    - :129 `toBe` expected `b` _(expression)_
- `Floyd displays real same-type retries before the meaningful forgery` — e2e/claims.spec.ts:131
    - :133 `toBe` expected `1` _(literal)_
    - :134 `toBe` expected `4` _(literal)_
- `actual salt draws occur only after precomputation has completed` — e2e/claims.spec.ts:136
    - :138 `toBeVisible` expected _no expected value_ _(none)_
- `partial-byte mask tooltip and required related labs are present` — e2e/claims.spec.ts:140
    - :141 `toBe` expected `1` _(literal)_
    - :142 `expect` expected _no expected value_ _(none)_
- `chosen names crowd the public hash table, with measured keyed comparison` — e2e/claims.spec.ts:145
    - :150 `toContainText` expected `'Unkeyed slot visits'` _(literal)_
    - :151 `toContainText` expected `'Keyed slot visits'` _(literal)_
    - :152 `toContainText` expected `'300'` _(literal)_
    - :153 `toHaveCount` expected `8` _(literal)_
    - :159 `toHaveLength` expected `6` _(literal)_
    - :160 `toBe` expected `index + 1` _(expression)_
    - :162 `toBe` expected `publicStart` _(expression)_
    - :163 `toBe` expected `index + 1` _(expression)_
    - :164 `expect` expected _no expected value_ _(none)_
    - :166 `toBe` expected `8` _(literal)_
    - :167 `expect` expected _no expected value_ _(none)_

**Mutation records** (4 file(s)):

- `mutation-results.json` (4152 bytes)
- `scripts/mutation-report.mjs` (3664 bytes)
- `scripts/mutations.json` (6825 bytes)
- `scripts/mutations.mjs` (2936 bytes)

<details><summary>Full README</summary>

```markdown
# Hash Hunt

Generic hash attacks · birthday · Floyd · time–memory tradeoffs

## What It Is

A browser laboratory that deliberately shortens SHA-256, then runs real generic attacks on the shortened output. Find collisions, produce meaningfully different colliding letters, transfer a real HMAC tag between them, and compare exhaustive search, full lookup, Hellman chains and rainbow chains. A length-strengthened toy Merkle–Damgård construction then chains real compression collisions into 2^b messages and applies Joux’s attack to H1‖H2. A separate exhibit measures hash-table flooding with chosen inputs and a secret keyed mapping. This is a teaching demo, not production cryptography, and it does not attack full SHA-256.

Built to the [Crypto Lab master template](https://github.com/systemslibrarian/crypto-lab/blob/main/audits/_MASTER-TEMPLATE.md). The original brief is included. Shared fleet UI and accessibility machinery derives from MIT-licensed work by Paul Clark.

## Exhibits

1. **Birthday room:** fresh hash trials, an exact uniform-output probability model, and explicitly range-limited bounds.
2. **Collision hunt:** a generic collision attack using birthday search or Floyd's two active walk registers; full digests, truncated bits and independent checks.
3. **Meaningful forgery:** two piles or Floyd over an injective letter map. An isolated employer closure signs the dismissal's shortened digest; WebCrypto verifies that tag on the recommendation and rejects a modified tag. Word choices are highlighted; Floyd exposes recorded walk steps.
4. **Chained tables:** actual Hellman/rainbow reductions, endpoint storage, regeneration, false alarms, coverage, online costs and reachable-target hit rates.
5. **Salt experiment:** precompute before drawing fresh salts; distinguish bucket matches, verified preimages, and original passwords.
6. **Multicollisions:** chained compression collisions, 2^b same-digest messages, and an H1‖H2 collision measured against the naive cost.
7. **Hash-table flood:** search distinct names that start in one public bucket, insert them by linear probing, then compare slot visits for the same names under a fresh secret HMAC-SHA-256 mapping. This is a table attack, not a cryptographic digest collision or an implementation of SipHash.

## When to Use It

Teach generic attack costs and the limits of composition. This attacks tiny output spaces, not full SHA-256 or HMAC. Full SHA-256's approximately 2^128 generic collision scale is a formula only.

## Live Demo

[Hash Hunt](https://systemslibrarian.github.io/crypto-lab-hash-hunt/). Build collision forks, enumerate their messages, flip one fork, and compare a measured H1‖H2 break with the naive 2n-bit birthday cost. Publication follows the complete correctness, browser, accessibility and mutation gate.

## What Can Go Wrong

- A valid tag over a collision-prone digest does not establish which letter was approved.
- Two active Floyd registers exclude seeds, hash state, counters and diagnostics.
- Full lookup covers reachable digests, not all outputs. H(x) targets differ from uniform output targets.
- Hellman's roughly 0.63 model requires the stated parameter relation and heuristic independence. Rainbow's recurrence is a random-function model, not a measured success rate.
- Matching endpoints still require regeneration and verification. Diagnostic coverage/merge sets consume extra temporary memory.
- Salts prevent mapping reuse, not per-user guessing. At 12 bits, accidental valid table answers and multiple preimages are possible.
- Joux multicollisions are not second-preimage attacks. Kelsey–Schneier long-message second-preimage techniques remain out of scope, and no result on this page breaks real SHA-256.
- A public, unkeyed mapping lets an adversary search for colliding table buckets offline. Here the measured cost is the number of table slots inspected during insertion, not SHA-256 collision work. The keyed HMAC comparison is a toy countermeasure illustration, not a benchmark or proof that every server resists denial of service. The selected names, table size and probing algorithm are identical between runs; only the bucket mapping changes. See [Rust's current `HashMap` documentation](https://doc.rust-lang.org/std/collections/struct.HashMap.html) and [Aumasson and Bernstein's SipHash paper (2012)](https://www.aumasson.jp/siphash/siphash.pdf).
- Runtime caps may stop a search. Input changes retire old results; cancellation terminates the worker. Bounded fallback can occupy the main thread if workers cannot be created.

## Real-World Usage

The birthday principle motivates hash lengths. Time–memory tradeoffs explain historical password precomputation, while salts and expensive password hashing address different costs. A shortened hash before a MAC can defeat an otherwise sound MAC construction. Separately, keyed short-input hashing in hash tables makes offline bucket targeting difficult when applications accept attacker-chosen keys; Rust currently documents SipHash 1-3 as its default and explicitly says this default may change.

Primary references: Katz–Lindell third edition §§6.4, 6.6.3 and Appendix A.4; [Boneh–Shoup v0.6 §8.4](https://toc.cryptobook.us/book.pdf); [Joux (CRYPTO 2004)](https://doi.org/10.1007/978-3-540-28628-8_19); [Hellman (1980)](https://www-ee.stanford.edu/~hellman/publications/36.pdf); [Avoine, Junod and Oechslin](https://crypto.junod.info/jacm08.pdf); [Yuval (1979)](https://doi.org/10.1080/0161-117991854025); [FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final); [RFC 4231](https://www.rfc-editor.org/rfc/rfc4231.html).

## How to Run Locally

Node 22 or newer:

`​``sh
npm ci
npm run dev
`​``

## Related Demos

[Collision Vault](https://systemslibrarian.github.io/crypto-lab-collision-vault/), [Babel Hash](https://systemslibrarian.github.io/crypto-lab-babel-hash/), [Bcrypt Forge](https://systemslibrarian.github.io/crypto-lab-bcrypt-forge/), [KDF Arena](https://systemslibrarian.github.io/crypto-lab-kdf-arena/), [Log Forge](https://systemslibrarian.github.io/crypto-lab-log-forge/).

Source review used the sibling commits pinned in the brief. Bcrypt Forge has a full dictionary map described as rainbow precomputation; this lab adds actual column-dependent rainbow chains. Cryptanalytic collisions and length extension remain separate demos.

## Build & Verify

`​``sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:mutations
`​``

37 executed unit cases cover SHA-256, all truncation widths, RFC 4231's long-key/long-data HMAC example, Floyd predecessors, independently checked collisions, meaningful methods, chain inversion, salt timing, complete and sampled Joux fork enumeration, both H2 cascade modes, exact call accounting, import boundaries, and hash-table probes. The flood tests recheck HMAC bucket starts independently with Node's HMAC and count wraparound in linear probing. The exact 163-byte NIST CAVP LongMsg fixture and provenance are in `src/hash/sha256-longmsg-1304.json`. The official ZIP was inaccessible locally; a preserved NIST response file from TclTLS was independently checked with platform SHA-256. No current-ZIP comparison or coverage percentage is claimed.

Twenty-three browser claims use Node SHA-256 to recheck displayed inputs, recovered preimages, every fork transition, sampled multicollision messages, both H2 modes, the final H1‖H2 pair, cost sums and extrapolation. The hash-table claim checks that 24 public collisions cost 300 slot visits and the displayed first eight rows show the expected growing probes. Twenty-four mutations must pass baseline, build, move bundle bytes, fail a named test, restore, and pass again. Accessibility exercises every multicollision state and the hash-table panel at 1280/320 pixels with the unchanged fleet contrast/non-text oracles. Browser QA runs in CI when supported local browser control is unavailable.

Pages, PRs and grouped Dependabot auto-merge use the entire gate; automated merges explicitly dispatch deployment.

## Performance

A measured hash calibration sets a 12–24-bit interaction cap. Searches also enforce time/evaluation limits; letter hashes can be slower. Counts exclude independent verification. Multicollision costs count each H1 compression and H2 evaluation, while naive work above the two-million-call budget is explicitly extrapolated from the measured rate. Chain construction is capped at one million hashes. Timings describe this browser, not production-size SHA-256.

The Crypto Lab catalog integration records this lab’s concept, level, source evidence and fleet automation. Playwright port 4225 is unique across all 223 registered configurations; strictPort is enforced and existing servers are never reused.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

### Multicollision correction

Choosing a fork to inspect no longer retires the chain; every fork remains flippable.
The table prints choices in stage order, matching the displayed blocks. New searches
retire the previous chain immediately. Independent verification now binds each fork
to its predecessor and each message to its stated mask, and checks complete-set counts.
Mutation replay reads structured test results and rejects crashes or setup failures.

Cancellation in degraded mode is checked before computation starts and on every
progress update or error, so a retired run cannot replace a newer result.

## Deviations from the brief

- **HH-2: retain the hardened mutation runner.** Restoring the base text-search runner would allow a timeout, crash or setup error to masquerade as a kill. The current structured-report validation remains. The repair also clears generated output and captures the baseline bundle hash immediately after an explicit clean build; browser artifact collection had left stale mutant chunks beside the active bundle. A kill still requires the named assertion to fail, a changed successful build, restoration to the original build hash and a passing restored test.
- **HH-12: salted hits are measured, not forced to zero.** A twelve-bit table can accidentally return a valid salted preimage. The visible “TABLE USELESS FOR THIS BATCH” appears only when every table candidate fails verification; the recovery experiment reports the actual count. Under an ideal independent random-function model, a domain of N=4096 with M=2624 stored unsalted outputs has per-user accidental-success probability M(2N−1)/N³. The resulting probability of at least one hit among 20 users is about 0.624%, rather than the audit summary's 0.3%. The extra contribution comes from the table candidate sometimes being the originally sampled password. This is a model calculation, not a guaranteed or measured frequency.
- **Existing accessibility oracles were not weakened.** The audit's condensed files retained the contrast/non-text algorithms. The full reference structure and comments are restored, and missing structural boot assertions now check list semantics, one main landmark, seven tabs, the skip-link destination, default inputs, closed disclosures and absence of theme controls. The lab-specific state driver remains adapted to Hash Hunt.

## Audit repair evidence

HH-1 now has both a genuine same-type eight-bit collision control and a deterministic Floyd run with four actual same-type retries before the cross-type forgery. The page logs the rejected letter pairs, and browser tests hash those letters with Node SHA-256. Separate mutations bypass the semantic verifier and the retry step.

The salt-timing test exercises the real inline fallback and observes the actual CSPRNG calls. Each salt must be drawn after the real table-build completion callback. A mutation creates the targets before construction, and must fail that test; this is distinct from the existing invalid-bucket-answer mutation. Table construction still has no access to salts. The experiment uses the full lookup table as described on the page.

The full lookup is named Bcrypt Forge’s Scenario B; Hash Zoo, DNSSEC Chain, Feistel Forge and Grover have framed links. Non-byte-aligned controls expose the final-byte mask and measured cap. Explicit Hellman/rainbow start-point fixtures confirm that an index is not accepted as a preimage merely because it is a stored start.

Counts are obtained with `npx vitest list --json`, `npm test` (which expands parameter rows to 37), `npx playwright test --list` (23 claims plus two accessibility drives), and the 24-entry `scripts/mutations.json`. No tests are skipped. Local browser runs can select an installed Chromium with `CHROMIUM_PATH`; the registered port, deployment workflow, header and theme pin are unchanged.

Mutation restoration hashes the JavaScript files listed by each fresh Vite build manifest. Unreferenced files left by browser artifact collection are excluded; baseline, mutant and restored builds still have to satisfy every assertion and hash check.

```

</details>

---
