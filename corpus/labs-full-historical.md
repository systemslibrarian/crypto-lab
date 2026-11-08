# Crypto Lab audit corpus — HISTORICAL

Generated 2026-11-08T20:20:28.593Z from 3 lab record(s).

Every finding must cite **commit_sha + lab slug + field**. A field printed as
`MISSING` was not found by the generator; it is not a claim that the lab lacks it.

---
## Dead Sea Cipher

- **slug**: `crypto-lab-dead-sea-cipher`
- **repo**: https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher
- **live**: https://systemslibrarian.github.io/crypto-lab-dead-sea-cipher/
- **commit_sha**: `824b3af3f2b549624aac971953f209133dc47c85` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HISTORICAL  ·  **level**: beginner  ·  **--accent**: #c4956a
- **MISSING FIELDS**: verification

**Name (H1)**: Dead Sea Cipher  — _read from demos/dead-sea-cipher/src/main.ts_

**Subtitle**: Atbash · Caesar · Vigenère · One-Time Pad · AES-256-GCM  — _read from demos/dead-sea-cipher/src/main.ts_

**Description**: Walk the arc of cryptographic history one era at a time — encrypt with each cipher live, then run the very attack that broke it.  — _read from demos/dead-sea-cipher/src/main.ts_

**Why it matters**: Every confidentiality scheme fails for a structural reason: tiny key space, frequency leakage, key reuse, no integrity. Each generation patches the last one's fatal flaw — and seeing the break is how you learn to trust the fix.  — _read from demos/dead-sea-cipher/src/main.ts_

**Card copy**: Explore substitution, affine, and polyalphabetic ciphers from Atbash through Vigenère, then compare modern AES-256-GCM. Encrypt, decrypt, rank all affine keys, and recover keys from known letter pairs.

**Chips**: Substitution · Affine Cipher · Vigenère · Atbash

**Implements**: AES `demos/dead-sea-cipher/src/ciphers/aes.ts:73`, AES-CTR `demos/dead-sea-cipher/src/ciphers/ghash.ts:118`, AES-GCM `demos/dead-sea-cipher/src/ciphers/aes.ts:79`, Affine cipher `demos/dead-sea-cipher/src/ciphers/affine.ts:16`, Caesar cipher `demos/dead-sea-cipher/src/analysis/caesar-crack.ts:15`, GHASH `demos/dead-sea-cipher/src/ciphers/ghash.ts:82`, One-time pad `demos/dead-sea-cipher/src/ciphers/otp.ts:8`, PBKDF2 `demos/dead-sea-cipher/src/ciphers/aes.ts:48`, Vigenere cipher `demos/dead-sea-cipher/src/ciphers/vigenere.ts:11`

**Attacks shown**: Brute force `demos/dead-sea-cipher/src/ciphers/caesar.ts:38`, Frequency analysis `demos/dead-sea-cipher/src/content/scripture.ts:65`, Key recovery `demos/dead-sea-cipher/src/analysis/affine-crack.ts:38`, Known-plaintext attack `demos/dead-sea-cipher/src/analysis/affine-crack.ts:38`

**Comment-only (named in code comments, not executed)**: SHA-256 `demos/dead-sea-cipher/src/ciphers/aes.ts:5`

**References**: DES, Enigma, Grover's algorithm, Hill cipher, SHA-256, Serpent, Substitution cipher

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 197` — first seen demos/dead-sea-cipher/src/ciphers/aes.ts:3 (1×)
- `NIST SP 800-38D` — first seen demos/dead-sea-cipher/src/ciphers/ghash.ts:2 (1×)
- `SP 800-38D` — first seen demos/dead-sea-cipher/src/ciphers/ghash.ts:56 (1×)

**README — What Can Go Wrong**:

```text
- **Monoalphabetic substitution leaks structure.** Atbash, Caesar, and simple substitution preserve letter frequencies, so frequency analysis and brute force over a tiny key space recover the plaintext quickly.
- **Vigenère is broken by period detection.** Once the key length is found (Kasiski examination, index of coincidence), the cipher reduces to several independent Caesar shifts and falls to frequency analysis.
- **One-time-pad key reuse is catastrophic.** Reusing a pad turns it into a two-time pad; XORing two ciphertexts cancels the key and exposes both messages to crib-dragging.
- **Confidentiality without integrity is not enough.** Classical ciphers provide no authentication, so a ciphertext can be altered undetected — the lesson that motivates authenticated encryption (AES-256-GCM) at the end of the timeline.
```

**Claims tested** (demos/dead-sea-cipher/e2e/claims.spec.ts, 49 test(s)):

- `(assertions outside a test block)` — demos/dead-sea-cipher/e2e/claims.spec.ts:43
    - :43 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — demos/dead-sea-cipher/e2e/claims.spec.ts:54
    - :54 `toHaveClass` expected `/active/` _(regex)_
- `(assertions outside a test block)` — demos/dead-sea-cipher/e2e/claims.spec.ts:55
    - :55 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
- `Atbash: the encoder is its own inverse and the leakage verdict matches the ICs beside it` — demos/dead-sea-cipher/e2e/claims.spec.ts:74
    - :82 `toHaveText` expected `'YZYVO'` _(literal)_
    - :87 `toBe` expected `plaintext` _(expression)_
    - :92 `toHaveText` expected `plaintext` _(expression)_
    - :99 `expect` expected _no expected value_ _(none)_
    - :100 `toBe` expected `icPlain` _(expression)_
    - :101 `toHaveText` expected `'IDENTICAL — leaks'` _(literal)_
    - :102 `toHaveClass` expected `/leak/` _(regex)_
    - :105 `expect` expected _no expected value_ _(none)_
    - :109 `toHaveText` expected `'—'` _(literal)_
    - :110 `toHaveText` expected `'—'` _(literal)_
    - :111 `toHaveText` expected `'—'` _(literal)_
    - :112 `toHaveClass` expected `/leak/` _(regex)_
- `Caesar: Break It recovers the shift in use and its winning row decrypts to the typed plaintext` — demos/dead-sea-cipher/e2e/claims.spec.ts:117
    - :126 `toHaveText` expected `'11'` _(literal)_
    - :129 `toBe` expected `plaintext` _(expression)_
    - :136 `toContainText` expected `'Winner: shift 11'` _(literal)_
    - :137 `toContainText` expected `'closest match to English'` _(literal)_
    - :140 `toHaveCount` expected `26` _(literal)_
    - :156 `expect` expected _no expected value_ _(none)_
    - :159 `toHaveLength` expected `1` _(literal)_
    - :160 `toBe` expected `true` _(expression)_
    - :161 `toBe` expected `11` _(literal)_
    - :163 `toBe` expected `plaintext` _(expression)_
    - :165 `toBe` expected `26` _(literal)_
    - :168 `toHaveCount` expected `1` _(literal)_
    - :169 `toContainText` expected `'→E'` _(literal)_
- `Caesar: the break verdict is retired when the ciphertext it described changes` — demos/dead-sea-cipher/e2e/claims.spec.ts:172
    - :180 `toContainText` expected `'Winner: shift 3'` _(literal)_
    - :181 `toBeVisible` expected _no expected value_ _(none)_
    - :187 `toHaveText` expected `'17'` _(literal)_
    - :188 `toHaveText` expected `''` _(literal)_
    - :189 `toBeHidden` expected _no expected value_ _(none)_
    - :190 `toHaveCount` expected `0` _(literal)_
    - :194 `toContainText` expected `'Winner: shift 17'` _(literal)_
    - :196 `toHaveText` expected `''` _(literal)_
    - :198 `toContainText` expected `'Winner: shift 17'` _(literal)_
- `Vigenère: Kasiski recovers the keyword and every bracketed gap divides the reported key length` — demos/dead-sea-cipher/e2e/claims.spec.ts:203
    - :217 `expect` expected _no expected value_ _(none)_
    - :220 `toBeVisible` expected _no expected value_ _(none)_
    - :224 `toBe` expected `keyword.length` _(expression)_
    - :231 `expect` expected _no expected value_ _(none)_
    - :233 `toBe` expected `0` _(literal)_
    - :239 `toBe` expected `gaps.length` _(expression)_
    - :241 `toBe` expected `keyLength` _(expression)_
    - :247 `toContainText` expected `'recovering the key "${keyword}"'` _(expression)_
    - :250 `toBeVisible` expected _no expected value_ _(none)_
    - :251 `toContainText` expected `'RECOVERED KEY: "${keyword}"'` _(expression)_
    - :252 `toContainText` expected `'PROBABLE KEY LENGTH: ${keyLength}'` _(expression)_
    - :253 `toContainText` expected `'COLUMN ANALYSIS (key length = ${keyLength})'` _(expression)_
    - :256 `toHaveLength` expected `keyLength` _(expression)_
    - :257 `toBe` expected `keyword` _(expression)_
    - :266 `expect` expected _no expected value_ _(none)_
    - :268 `toHaveLength` expected `gaps.length` _(expression)_
    - :273 `expect` expected _no expected value_ _(none)_
    - :274 `expect` expected _no expected value_ _(none)_
    - :280 `expect` expected _no expected value_ _(none)_
- `Vigenère: too-short ciphertext and an invalid key both reach a failure state naming the cause` — demos/dead-sea-cipher/e2e/claims.spec.ts:283
    - :292 `toContainText` expected _no expected value_ _(none)_
    - :295 `toHaveCount` expected `0` _(literal)_
    - :296 `expect` expected _no expected value_ _(none)_
    - :297 `expect` expected _no expected value_ _(none)_
    - :303 `toHaveText` expected `'(enter a valid key)'` _(literal)_
    - :305 `toHaveText` expected `'(enter a valid key)'` _(literal)_
    - :306 `toHaveText` expected `'—'` _(literal)_
    - :307 `toHaveText` expected `'—'` _(literal)_
    - :311 `toHaveText` expected `'(enter a valid key)'` _(literal)_
    - :312 `expect` expected _no expected value_ _(none)_
- `Vigenère: a completed Kasiski run is retired when its ciphertext changes` — demos/dead-sea-cipher/e2e/claims.spec.ts:315
    - :327 `toContainText` expected `'key length ='` _(literal)_
    - :333 `toBeHidden` expected _no expected value_ _(none)_
    - :334 `expect` expected _no expected value_ _(none)_
    - :335 `expect` expected _no expected value_ _(none)_
    - :339 `toBeVisible` expected _no expected value_ _(none)_
    - :340 `toContainText` expected `'key length ='` _(literal)_
- `OTP: the key-reuse grid satisfies C1 ⊕ C2 = P1 ⊕ P2 in the hex it actually rendered` — demos/dead-sea-cipher/e2e/claims.spec.ts:345
    - :352 `toHaveCount` expected `5` _(literal)_
    - :361 `toEqual` expected _no expected value_ _(none)_
    - :366 `expect` expected _no expected value_ _(none)_
    - :368 `toHaveLength` expected `n` _(expression)_
    - :369 `toMatch` expected `/^[0-9a-f]{2}$/` _(regex)_
    - :380 `toBe` expected `c1[i] ^ c2[i]` _(expression)_
    - :382 `toBe` expected `xorC[i]` _(expression)_
    - :384 `expect` expected _no expected value_ _(none)_
    - :385 `expect` expected _no expected value_ _(none)_
    - :388 `toBe` expected `byLabel['C2'].join('')` _(expression)_
    - :391 `toHaveClass` expected `/match/` _(regex)_
    - :392 `toHaveClass` expected `/nomatch/` _(regex)_
    - :393 `toContainText` expected `'identical in all ${n} bytes'` _(expression)_
- `OTP: crib dragging recovers Message 2 at the right offset and gibberish elsewhere` — demos/dead-sea-cipher/e2e/claims.spec.ts:396
    - :406 `toBeVisible` expected _no expected value_ _(none)_
    - :407 `toHaveText` expected `'ATTACK AT'` _(literal)_
    - :408 `toContainText` expected `'Looks like English'` _(literal)_
    - :413 `toHaveText` expected `'7'` _(literal)_
    - :415 `toBe` expected `'ATTACK AT'` _(literal)_
    - :416 `toContainText` expected `'Gibberish means the guess'` _(literal)_
    - :421 `toHaveText` expected `'ATTACK AT'` _(literal)_
    - :422 `toContainText` expected `'Gibberish means the guess'` _(literal)_
    - :426 `toHaveText` expected `'ATTACK AT'` _(literal)_
- `OTP: encryption round-trips, and a ciphertext is retired when its inputs change` — demos/dead-sea-cipher/e2e/claims.spec.ts:429
    - :440 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :441 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :442 `toBe` expected `plaintext.length * 2` _(expression)_
    - :443 `toHaveText` expected `plaintext` _(expression)_
    - :450 `toBe` expected `plaintext` _(expression)_
    - :456 `toHaveText` expected `'—'` _(literal)_
    - :457 `toHaveText` expected `'—'` _(literal)_
    - :460 `toHaveText` expected `'A COMPLETELY DIFFERENT MESSAGE'` _(literal)_
    - :465 `toHaveText` expected `'—'` _(literal)_
    - :466 `toHaveText` expected `'—'` _(literal)_
    - :468 `toBe` expected `keyHex` _(expression)_
- `AES-256-GCM: encrypt/decrypt round-trips and every field the panel shows is well formed` — demos/dead-sea-cipher/e2e/claims.spec.ts:473
    - :482 `expect` expected _no expected value_ _(none)_
    - :489 `toMatch` expected `b64` _(expression)_
    - :491 `toBe` expected `12` _(literal)_
    - :492 `toBe` expected `16` _(literal)_
    - :493 `toBe` expected `16` _(literal)_
    - :495 `toBe` expected `plaintext.length` _(expression)_
    - :496 `toBeVisible` expected _no expected value_ _(none)_
    - :499 `toContainText` expected _no expected value_ _(none)_
    - :505 `toHaveText` expected `plaintext, { timeout: CRYPTO_TIMEOUT }` _(expression)_
    - :510 `toHaveText` expected `ciphertext, { timeout: CRYPTO_TIMEOUT }` _(expression)_
    - :511 `toBe` expected `iv` _(expression)_
    - :512 `toBe` expected `salt` _(expression)_
- `AES-256-GCM: a flipped bit is rejected and the rejection names tampering as the cause` — demos/dead-sea-cipher/e2e/claims.spec.ts:515
    - :523 `expect` expected _no expected value_ _(none)_
    - :525 `toHaveText` expected `'—', { timeout: CRYPTO_TIMEOUT }` _(expression)_
    - :532 `toBe` expected `before` _(expression)_
    - :536 `toBe` expected `beforeBytes.length` _(expression)_
    - :538 `toHaveLength` expected `1` _(literal)_
    - :540 `toBe` expected `tagBefore` _(expression)_
    - :545 `toHaveText` expected `'—'` _(literal)_
    - :546 `toContainText` expected _no expected value_ _(none)_
    - :551 `toHaveClass` expected `/gcm-stale/, { timeout: 5_000 }` _(expression)_
    - :552 `toHaveClass` expected `/gcm-changed/` _(regex)_
    - :553 `toBeVisible` expected _no expected value_ _(none)_
    - :554 `toContainText` expected `'no longer matches'` _(literal)_
    - :559 `toContainText` expected `'Integrity check FAILED', { timeout: CRYPTO_TIMEOUT }` _(expression)_
    - :560 `toContainText` expected `'tampered with'` _(literal)_
    - :561 `toHaveCount` expected `0` _(literal)_
    - :564 `toContainText` expected `'Decryption failed', {` _(expression)_
    - :567 `toContainText` expected `'tampered with'` _(literal)_
    - :572 `toHaveText` expected `'—', { timeout: CRYPTO_TIMEOUT }` _(expression)_
    - :573 `toHaveClass` expected `/gcm-stale/` _(regex)_
    - :574 `toBeHidden` expected _no expected value_ _(none)_
    - :576 `toHaveText` expected `'—', { timeout: CRYPTO_TIMEOUT }` _(expression)_
    - :578 `toBe` expected `''` _(literal)_
- `AES-256-GCM: a wrong passphrase is rejected and blamed on the passphrase, not on tampering` — demos/dead-sea-cipher/e2e/claims.spec.ts:581
    - :589 `expect` expected _no expected value_ _(none)_
    - :595 `toContainText` expected `'Integrity check FAILED', { timeout: CRYPTO_TIMEOUT }` _(expression)_
    - :598 `toContainText` expected `'passphrase does not derive the key'` _(literal)_
    - :599 `toContainText` expected `'tampered with'` _(literal)_
    - :602 `toContainText` expected `'Decryption failed', {` _(expression)_
    - :605 `toContainText` expected `'passphrase'` _(literal)_
    - :606 `toContainText` expected `'tampered'` _(literal)_
- `AES-256-GCM: the page recomputes GHASH and lands on the tag Web Crypto sealed with` — demos/dead-sea-cipher/e2e/claims.spec.ts:609
    - :617 `toBeHidden` expected _no expected value_ _(none)_
    - :618 `toBeVisible` expected _no expected value_ _(none)_
    - :621 `toBeVisible` expected `{ timeout: CRYPTO_TIMEOUT }` _(expression)_
    - :629 `toMatch` expected `hex32` _(expression)_
    - :633 `toEqual` expected `hexToBytes(computedTag)` _(expression)_
    - :639 `toEqual` expected `b64TagBytes` _(expression)_
    - :640 `toEqual` expected `b64TagBytes` _(expression)_
    - :642 `toContainText` expected `'all 128 bits agree'` _(literal)_
    - :645 `toContainText` expected _no expected value_ _(none)_
    - :651 `expect` expected _no expected value_ _(none)_
- `AES-256-GCM: a learner-chosen bit is the one that flips, and the moved tag bits are counted` — demos/dead-sea-cipher/e2e/claims.spec.ts:658
    - :666 `toBeVisible` expected `{ timeout: CRYPTO_TIMEOUT }` _(expression)_
    - :672 `toHaveText` expected `'of ${ctLen} bytes (0–${ctLen - 1})'` _(expression)_
    - :673 `toBe` expected `String(ctLen - 1)` _(expression)_
    - :686 `toEqual` expected `[byteIndex]` _(expression)_
    - :687 `toBe` expected `1 << bitIndex` _(expression)_
    - :688 `toContainText` expected _no expected value_ _(none)_
    - :695 `toContainText` expected `'of 128', {` _(expression)_
    - :699 `toBe` expected `sealedTag` _(expression)_
    - :700 `toBe` expected `sealedTag` _(expression)_
    - :708 `toBe` expected `actual` _(expression)_
    - :709 `expect` expected _no expected value_ _(none)_
    - :713 `toContainText` expected _no expected value_ _(none)_
- `AES-256-GCM: editing an input retires the ciphertext, the tag and the GHASH verdict` — demos/dead-sea-cipher/e2e/claims.spec.ts:719
    - :727 `toBeVisible` expected `{ timeout: CRYPTO_TIMEOUT }` _(expression)_
    - :729 `toContainText` expected _no expected value_ _(none)_
    - :738 `toBeHidden` expected _no expected value_ _(none)_
    - :739 `toBeHidden` expected _no expected value_ _(none)_
    - :740 `toBeVisible` expected _no expected value_ _(none)_
    - :741 `expect` expected _no expected value_ _(none)_
    - :742 `toHaveText` expected `'—'` _(literal)_
    - :743 `toHaveText` expected `'auth tag'` _(literal)_
    - :744 `toHaveText` expected `'encrypt first'` _(literal)_
    - :748 `toContainText` expected _no expected value_ _(none)_
    - :758 `toBeVisible` expected `{ timeout: CRYPTO_TIMEOUT }` _(expression)_
    - :760 `toHaveText` expected `'A different message entirely.', {` _(expression)_
    - :764 `toBeVisible` expected `{` _(expression)_
    - :770 `expect` expected _no expected value_ _(none)_
    - :771 `toHaveText` expected `'—'` _(literal)_
    - :772 `toBeVisible` expected _no expected value_ _(none)_
    - :773 `toBe` expected `sealedCt` _(expression)_
    - :774 `toBeVisible` expected _no expected value_ _(none)_
    - :778 `toContainText` expected _no expected value_ _(none)_
- `AES-256-GCM: the controls refuse to act before anything has been encrypted` — demos/dead-sea-cipher/e2e/claims.spec.ts:784
    - :791 `toContainText` expected _no expected value_ _(none)_
    - :795 `toContainText` expected _no expected value_ _(none)_
    - :799 `toHaveText` expected `'(encrypt something first)'` _(literal)_
    - :801 `toBeHidden` expected _no expected value_ _(none)_
- `every era tab reaches its panel and only one panel is ever shown` — demos/dead-sea-cipher/e2e/claims.spec.ts:806
    - :812 `toEqual` expected `['atbash', 'caesar', 'vigenere', 'otp', 'aes', 'full-arc']` _(expression)_
    - :816 `toHaveCount` expected `1` _(literal)_
    - :817 `toBeVisible` expected _no expected value_ _(none)_
    - :818 `toHaveCount` expected `1` _(literal)_
    - :824 `expect` expected _no expected value_ _(none)_
    - :825 `toBeVisible` expected _no expected value_ _(none)_
    - :827 `toBeVisible` expected _no expected value_ _(none)_
    - :829 `toBeVisible` expected _no expected value_ _(none)_
- `no element carrying the hidden attribute is actually rendered` — demos/dead-sea-cipher/e2e/claims.spec.ts:837
    - :849 `toEqual` expected `[]` _(expression)_
    - :857 `toBeVisible` expected _no expected value_ _(none)_
    - :858 `toHaveCount` expected `25` _(literal)_
    - :859 `toHaveCount` expected `26` _(literal)_
    - :894 `toHaveText` expected `expected` _(expression)_
    - :910 `toMatch` expected `/^[a-z]$/i` _(regex)_
    - :911 `toMatch` expected `/^[a-z]$/i` _(regex)_
    - :931 `toHaveAttribute` expected `'data-verdict', 'recovered'` _(expression)_
    - :932 `toHaveClass` expected `'affine-alarm'` _(literal)_
    - :934 `expect` expected _no expected value_ _(none)_
    - :937 `toBe` expected `1` _(literal)_
    - :939 `toBe` expected `y` _(expression)_
    - :944 `toContainText` expected _no expected value_ _(none)_
    - :947 `toHaveClass` expected `'affine-info'` _(literal)_
- `Affine default ciphertext is recomputed from the displayed plaintext and key` — demos/dead-sea-cipher/e2e/claims.spec.ts:950
- `Affine changed ciphertext preserves case for the displayed 11,20 key` — demos/dead-sea-cipher/e2e/claims.spec.ts:957
    - :963 `toHaveText` expected `'Eh vtm fmiehhehi'` _(literal)_
- `Affine displayed inverse equation checks the printed numbers` — demos/dead-sea-cipher/e2e/claims.spec.ts:966
    - :975 `expect` expected _no expected value_ _(none)_
    - :977 `toBe` expected `Number(await page.locator('#affine-a').inputValue())` _(expression)_
    - :978 `toBe` expected `1` _(literal)_
    - :979 `toBe` expected `(printedA * inverse) % 26` _(expression)_
- `Affine full ranking counts every independently admissible key` — demos/dead-sea-cipher/e2e/claims.spec.ts:983
    - :987 `toHaveCount` expected `affineKeyCount()` _(expression)_
    - :988 `toHaveCount` expected `3` _(literal)_
    - :990 `toBe` expected `true` _(expression)_
    - :991 `toBe` expected `affineKeyCount()` _(expression)_
    - :992 `toBe` expected `1` _(literal)_
- `Affine ranking recovery is an alarm matching the displayed key` — demos/dead-sea-cipher/e2e/claims.spec.ts:995
    - :1000 `toHaveAttribute` expected `'data-verdict', 'recovered'` _(expression)_
    - :1001 `toHaveClass` expected `'affine-alarm'` _(literal)_
    - :1002 `toContainText` expected `'a = ${a}, b = ${b}'` _(expression)_
    - :1003 `toHaveAttribute` expected `'data-a', String(a)` _(expression)_
    - :1004 `toHaveAttribute` expected `'data-b', String(b)` _(expression)_
    - :1005 `toContainText` expected `plaintext` _(expression)_
- `Affine solver recovery satisfies every displayed pair` — demos/dead-sea-cipher/e2e/claims.spec.ts:1008
    - :1012 `toContainText` expected `'a = (y₁ − y₂)(x₁ − x₂)⁻¹ mod 26'` _(literal)_
- `Affine solver recovery confirmed by a third pair satisfies all three` — demos/dead-sea-cipher/e2e/claims.spec.ts:1015
    - :1024 `toContainText` expected `'also explains your third letter'` _(literal)_
- `Affine negative claim: valid checks and frequency recovery together` — demos/dead-sea-cipher/e2e/claims.spec.ts:1027
    - :1030 `toEqual` expected `[7, 3]` _(expression)_
    - :1031 `toBe` expected `60` _(literal)_
    - :1034 `toHaveCount` expected `3` _(literal)_
    - :1035 `expect` expected _no expected value_ _(none)_
    - :1039 `toHaveCount` expected `0` _(literal)_
    - :1041 `toBeVisible` expected _no expected value_ _(none)_
    - :1042 `toHaveAttribute` expected `'data-verdict', 'recovered'` _(expression)_
    - :1043 `toHaveClass` expected `'affine-alarm'` _(literal)_
    - :1044 `toContainText` expected `'VALID KEY — AND RECOVERED BY FREQUENCY'` _(literal)_
    - :1045 `toContainText` expected _no expected value_ _(none)_
- `Affine inadmissible multiplier refuses decryption and ranking` — demos/dead-sea-cipher/e2e/claims.spec.ts:1050
    - :1053 `toHaveCount` expected `0` _(literal)_
    - :1054 `toContainText` expected `'not decryptable'` _(literal)_
    - :1055 `toContainText` expected `'13 distinct outputs'` _(literal)_
    - :1057 `toContainText` expected `'Not decryptable'` _(literal)_
    - :1058 `toHaveCount` expected `0` _(literal)_
    - :1059 `toBeHidden` expected _no expected value_ _(none)_
    - :1060 `expect` expected _no expected value_ _(none)_
- `Affine repeated D→Y pairs report SeveralKeys with twelve matches` — demos/dead-sea-cipher/e2e/claims.spec.ts:1063
    - :1070 `toHaveAttribute` expected `'data-verdict', 'SeveralKeys'` _(expression)_
    - :1074 `toBe` expected `(await matchingAffineKeys(page)).length` _(expression)_
    - :1075 `toBe` expected `12` _(literal)_
    - :1076 `toContainText` expected _no expected value_ _(none)_
- `Affine A→D/N→Q report SeveralKeys with twelve matches` — demos/dead-sea-cipher/e2e/claims.spec.ts:1082
    - :1089 `toHaveAttribute` expected `'data-verdict', 'SeveralKeys'` _(expression)_
    - :1093 `toBe` expected `(await matchingAffineKeys(page)).length` _(expression)_
    - :1094 `toBe` expected `12` _(literal)_
- `Affine A→D/E→F recover 7,3 with the even-difference explanation` — demos/dead-sea-cipher/e2e/claims.spec.ts:1098
    - :1106 `toContainText` expected `'a = 7, b = 3'` _(literal)_
    - :1107 `toContainText` expected _no expected value_ _(none)_
- `Affine NoAffineKey for D→Y/E→A names no key` — demos/dead-sea-cipher/e2e/claims.spec.ts:1112
    - :1119 `toHaveAttribute` expected `'data-verdict', 'NoAffineKey'` _(expression)_
    - :1120 `toContainText` expected `'no affine key maps D→Y and E→A'` _(literal)_
    - :1122 `toHaveLength` expected `0` _(literal)_
- `Affine NoAffineKey for A→C/B→C names no key` — demos/dead-sea-cipher/e2e/claims.spec.ts:1125
    - :1132 `toHaveAttribute` expected `'data-verdict', 'NoAffineKey'` _(expression)_
    - :1133 `toContainText` expected `'no affine key maps A→C and B→C'` _(literal)_
    - :1135 `toHaveLength` expected `0` _(literal)_
- `Affine no letters has nothing to measure and no candidate rows` — demos/dead-sea-cipher/e2e/claims.spec.ts:1138
    - :1143 `toContainText` expected `'Nothing to measure'` _(literal)_
    - :1144 `toHaveCount` expected `0` _(literal)_
    - :1145 `expect` expected _no expected value_ _(none)_
    - :1146 `toBeHidden` expected _no expected value_ _(none)_
- `Affine short DEAD SEA SCROLLS stays an informational most likely candidate` — demos/dead-sea-cipher/e2e/claims.spec.ts:1149
    - :1157 `toHaveAttribute` expected `'data-verdict', 'candidate'` _(expression)_
    - :1158 `toHaveClass` expected `'affine-info'` _(literal)_
    - :1159 `toContainText` expected `'MOST LIKELY CANDIDATE'` _(literal)_
    - :1160 `toContainText` expected `/RECOVERED|VALID KEY/` _(regex)_
    - :1161 `toContainText` expected `'14 letters'` _(literal)_
    - :1162 `toContainText` expected `'Short texts mislead the statistics'` _(literal)_
    - :1163 `toHaveAttribute` expected `'data-a', String(a)` _(expression)_
    - :1164 `toHaveAttribute` expected `'data-b', String(b)` _(expression)_
- `Affine short LOVE ONE ANOTHER match is most likely, never recovered` — demos/dead-sea-cipher/e2e/claims.spec.ts:1167
    - :1174 `toHaveAttribute` expected `'data-verdict', 'most-likely'` _(expression)_
    - :1175 `toHaveClass` expected `'affine-alarm'` _(literal)_
    - :1176 `toContainText` expected _no expected value_ _(none)_
    - :1179 `toContainText` expected `/RECOVERED|VALID KEY/` _(regex)_
    - :1180 `toHaveAttribute` expected `'data-a', String(a)` _(expression)_
    - :1181 `toHaveAttribute` expected `'data-b', String(b)` _(expression)_
- `Affine third-pair mismatch reports no key fitting all three` — demos/dead-sea-cipher/e2e/claims.spec.ts:1184
    - :1192 `toHaveAttribute` expected `'data-verdict', 'NoAffineKey'` _(expression)_
    - :1193 `toContainText` expected _no expected value_ _(none)_
    - :1197 `toHaveLength` expected `0` _(literal)_
- `Affine third pair disambiguates a difference of thirteen` — demos/dead-sea-cipher/e2e/claims.spec.ts:1200
- `Affine ${id} change retires the ranking and solver and says so` — demos/dead-sea-cipher/e2e/claims.spec.ts:1216
    - :1222 `toBeHidden` expected _no expected value_ _(none)_
    - :1223 `toHaveCount` expected `0` _(literal)_
    - :1224 `expect` expected _no expected value_ _(none)_
    - :1225 `toHaveAttribute` expected `'data-verdict', /.+/` _(expression)_
    - :1226 `expect` expected _no expected value_ _(none)_
    - :1227 `toContainText` expected `'retired'` _(literal)_
- `Affine pair change retires the solver verdict and says so` — demos/dead-sea-cipher/e2e/claims.spec.ts:1231
    - :1236 `toHaveAttribute` expected `'data-verdict', /.+/` _(expression)_
    - :1237 `toHaveClass` expected `/affine-alarm/` _(regex)_
    - :1238 `toContainText` expected `/a = \d+, b = \d+/` _(regex)_
    - :1239 `toContainText` expected `'retired'` _(literal)_
- `Affine ${label} pair input is invalid and names no key` — demos/dead-sea-cipher/e2e/claims.spec.ts:1246
    - :1250 `toHaveAttribute` expected `'data-verdict', 'invalid'` _(expression)_
    - :1251 `toContainText` expected `'Each pair needs one Latin letter'` _(literal)_
- `Affine half-filled third pair is invalid and names no key` — demos/dead-sea-cipher/e2e/claims.spec.ts:1256
    - :1260 `toHaveAttribute` expected `'data-verdict', 'invalid'` _(expression)_
- `Affine same multiplier selection keeps a fresh ranking` — demos/dead-sea-cipher/e2e/claims.spec.ts:1264
    - :1271 `toBeVisible` expected _no expected value_ _(none)_
    - :1272 `toHaveText` expected `before` _(expression)_
    - :1273 `toHaveText` expected `notice` _(expression)_
    - :1274 `toHaveAttribute` expected `'data-verdict', 'recovered'` _(expression)_
    - :1275 `toHaveClass` expected `'affine-alarm'` _(literal)_
- `Affine edits before any result do not claim retirement` — demos/dead-sea-cipher/e2e/claims.spec.ts:1278
    - :1282 `expect` expected _no expected value_ _(none)_
    - :1283 `expect` expected _no expected value_ _(none)_
- `Affine ${preset} preset reports the computed match without a raw boolean` — demos/dead-sea-cipher/e2e/claims.spec.ts:1287
    - :1300 `toHaveAttribute` expected _no expected value_ _(none)_
    - :1304 `toContainText` expected _no expected value_ _(none)_
    - :1307 `toContainText` expected `/true|false/` _(regex)_
- `Affine count explains the identity and the unchanged Caesar convention` — demos/dead-sea-cipher/e2e/claims.spec.ts:1311
    - :1314 `toContainText` expected _no expected value_ _(none)_
- `Affine hidden regions paint no pixels before or after retirement` — demos/dead-sea-cipher/e2e/claims.spec.ts:1319
    - :1323 `expect` expected _no expected value_ _(none)_

**Mutation records** (2 file(s)):

- `mutation-evidence-affine.json` (16082 bytes)
- `scripts/check-affine-mutations.mjs` (7061 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-dead-sea-cipher

## What It Is

A browser-based cryptographic history demo that walks the full arc of cryptographic history — from Atbash (~600 BCE) through AES-256-GCM (2001 CE). The Caesar panel also implements the affine cipher, including inverse checks, collisions, all 312 keys and known-letter recovery. Each stage shows why a cipher failed and what the next one fixed, turning the timeline into a story about how secrecy was repeatedly broken and rebuilt.

## When to Use It

- Teaching the historical progression of ciphers — substitution, Atbash, Caesar, Vigenère, the one-time pad, and modern AEAD — as one connected narrative.
- Demonstrating live classical attacks (Caesar brute force, Kasiski examination, one-time-pad key reuse) so the weaknesses are seen rather than asserted.
- Showing the contrast between a classical cipher and a modern authenticated cipher (AES-256-GCM tamper detection) at the end of the timeline.
- Do NOT use the classical ciphers here for any real protection — they are historical teaching examples, broken by design, not production cryptography.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-dead-sea-cipher](https://systemslibrarian.github.io/crypto-lab-dead-sea-cipher/)**

The demo steps through the cipher timeline from Atbash and Caesar, through the Vigenère polyalphabetic cipher and the one-time pad, up to AES-256-GCM. Along the way it runs live attacks — Caesar brute force, Kasiski analysis of Vigenère, two-time-pad recovery from one-time-pad key reuse — and finishes by showing AES-256-GCM rejecting a tampered ciphertext, so each cipher's failure mode and the fix that followed are demonstrated interactively.

## What Can Go Wrong

- **Monoalphabetic substitution leaks structure.** Atbash, Caesar, and simple substitution preserve letter frequencies, so frequency analysis and brute force over a tiny key space recover the plaintext quickly.
- **Vigenère is broken by period detection.** Once the key length is found (Kasiski examination, index of coincidence), the cipher reduces to several independent Caesar shifts and falls to frequency analysis.
- **One-time-pad key reuse is catastrophic.** Reusing a pad turns it into a two-time pad; XORing two ciphertexts cancels the key and exposes both messages to crib-dragging.
- **Confidentiality without integrity is not enough.** Classical ciphers provide no authentication, so a ciphertext can be altered undetected — the lesson that motivates authenticated encryption (AES-256-GCM) at the end of the timeline.

## Real-World Usage

- The ciphers in this demo are primarily of historical and educational value; the classical ones are obsolete for protecting real data.
- Substitution and Vigenère-style ciphers persist in puzzles, CTF challenges, and teaching exercises for cryptanalysis fundamentals.
- The one-time pad, when keys are truly random, single-use, and as long as the message, remains the textbook example of information-theoretic perfect secrecy.
- AES-256-GCM, the modern endpoint of the timeline, is the authenticated cipher actually deployed today in TLS, disk encryption, and countless protocols.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher
cd crypto-lab-dead-sea-cipher/demos/dead-sea-cipher
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-vigenere-break](https://systemslibrarian.github.io/crypto-lab-vigenere-break/) — breaks the Vigenère cipher with Kasiski examination and index of coincidence.
- [crypto-lab-enigma-forge](https://systemslibrarian.github.io/crypto-lab-enigma-forge/) — rotors, plugboard, and a Bombe-style attack on the Enigma machine.
- [crypto-lab-otp-vault](https://systemslibrarian.github.io/crypto-lab-otp-vault/) — one-time-pad perfect secrecy and the two-time-pad reuse failure.
- [crypto-lab-iron-serpent](https://systemslibrarian.github.io/crypto-lab-iron-serpent/) — modern block ciphers (Serpent, AES-256) that inherit the lessons of this timeline.

## Build & Verify

From `demos/dead-sea-cipher`, run `npm ci`, `npm test`, `npm run build`, and `npx playwright test` (all specs). The suites contain **63 Vitest tests**, **2 node:test tests**, and **67 Playwright tests** (17 accessibility + 50 claims). The affine suite checks all 312 round trips, all 26⁴ known-letter tuples and 2,000 seeded three-pair tuples against independent brute force. The five affine accessibility states are scanned at 1280px, 380px and 320px. Expected affine values are arithmetic facts and original examples, not published test vectors. `node scripts/check-affine-mutations.mjs` (from the repository root) proves the source changes are caught: **14/14 mutations killed**, with the exact build artifact restored and the owning test green after every case.

## Historical & Classical Ciphers

| Field | Value |
|-------|-------|
| Coverage | Atbash → Caesar → Vigenère → OTP → AES-256-GCM |
| Time span | ~600 BCE to 2001 CE |
| Scripture connection | Jeremiah 25:26, 51:1, 51:41 |
| Live attacks | Caesar brute force, Kasiski, OTP key reuse, AES tamper detection |
| Educational focus | Why each cipher failed; what the next fixed |

Narrative companion: [ciphermuseum.com](https://ciphermuseum.com).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Enigma Forge

- **slug**: `crypto-lab-enigma-forge`
- **repo**: https://github.com/systemslibrarian/crypto-lab-enigma-forge
- **live**: https://systemslibrarian.github.io/crypto-lab-enigma-forge/
- **commit_sha**: `d33c537b2ded41f198931b4898065def7ba6b8cd` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `9adec18db1efea4450e5595a5094c9ba7c44b9ce`
- **read_from**: working tree (clean)
- **category**: HISTORICAL | ATTACKS  ·  **level**: beginner  ·  **--accent**: #b5651d
- **MISSING FIELDS**: spec_citations, mutations, verification

**Name (H1)**: Enigma Forge  — _read from src/main.ts_

**Subtitle**: Enigma I · rotor · plugboard · reflector · crib + Bombe  — _read from src/main.ts_

**Description**: Trace a keystroke through the live rotor, plugboard, and reflector wiring, then run a crib against a simulated Bombe to recover the daily key.  — _read from src/main.ts_

**Why it matters**: Enigma had a ~10^23 keyspace yet fell to hand-guessed cribs. Its reflector guaranteed no letter ever encrypts to itself — one structural flaw that let the Bombe reject wrong keys en masse. A huge keyspace is not strength.  — _read from src/main.ts_

**Card copy**: Full mechanical Enigma — rotors with double-stepping, plugboard, and reflector — plus the crib-based Bombe break that exploits the flaw that no letter ever maps to itself.

**Chips**: Enigma · Rotors · Plugboard · Bombe

**Implements**: Enigma `src/break/bombe.ts:19`

**Attacks shown**: Differential cryptanalysis `README.md:77`, Frequency analysis `README.md:74`, Known-plaintext attack `src/ui/break-panel.ts:447`

**Comment-only (named in code comments, not executed)**: Pairing `src/enigma/machine.ts:256`

**References**: Vigenere cipher

**Standards body**: _none_

**Implementation**: hand-rolled

**README — What Can Go Wrong**:

```text
- The reflector is fixed-point-free, so no letter ever encrypts to itself — a structural leak that crib placement exploits to reject impossible alignments.
- Predictable plaintext (stereotyped openings, weather reports) gives cribs that a Bombe-style search uses to eliminate rotor and plugboard settings.
- Operator procedure failures — reused message keys, lazy rotor choices, repeated indicators — historically shrank the effective keyspace far below its theoretical size.
- The large keyspace (~10²³) creates a false sense of security; exploitable structure, not brute force, is what broke it.
- It provides no authentication or integrity and no forward secrecy, so ciphertext can be altered undetectably.
```

**Claims tested** (e2e/claims.spec.ts, 22 test(s)):

- `encrypts a typed message, and the same settings decrypt it (own inverse)` — e2e/claims.spec.ts:57
    - :63 `toHaveLength` expected `plain.length` _(expression)_
    - :64 `toBe` expected `plain` _(expression)_
    - :66 `toBe` expected `plain[i]` _(expression)_
    - :71 `toHaveText` expected `plain` _(expression)_
- `reproduces the published Enigma I vector, and the appendix agrees with the machine` — e2e/claims.spec.ts:74
    - :79 `toHaveText` expected `'BDZGO'` _(literal)_
    - :84 `toHaveText` expected `'BDZGO'` _(literal)_
    - :87 `toBe` expected `'BDZGO'` _(literal)_
    - :88 `toHaveLength` expected `5` _(literal)_
- `lampboard, rotor windows and signal path all describe the same keystroke` — e2e/claims.spec.ts:91
    - :98 `toHaveCount` expected `1` _(literal)_
    - :99 `toHaveText` expected `last` _(expression)_
    - :102 `toContainText` expected `'A → ${last}'` _(expression)_
    - :103 `toContainText` expected _no expected value_ _(none)_
    - :110 `expect` expected _no expected value_ _(none)_
    - :112 `toBe` expected `after![2]` _(expression)_
    - :115 `toContainText` expected `'⚙'` _(literal)_
- `the double-step demo reaches the documented ADU sequence` — e2e/claims.spec.ts:118
    - :122 `toHaveText` expected `'⚙ double-step! middle + left advanced'` _(literal)_
    - :123 `toHaveClass` expected `/alarm/` _(regex)_
    - :124 `toContainText` expected `'AEW → BFX'` _(literal)_
    - :125 `toContainText` expected `'double-step'` _(literal)_
    - :126 `toBe` expected `'BFX'` _(literal)_
    - :129 `toContainText` expected `'ADV → AEW → BFX → BFY'` _(literal)_
- `an illegal machine setting is rejected and rolled back` — e2e/claims.spec.ts:132
    - :139 `toHaveText` expected `'Each rotor may be used only once (no duplicates).'` _(literal)_
    - :140 `toHaveValue` expected `before` _(expression)_
    - :144 `toHaveText` expected `''` _(literal)_
- `the empty-diagonal verdict matches the mapping the page actually rendered` — e2e/claims.spec.ts:151
    - :156 `toHaveLength` expected `26` _(literal)_
    - :165 `toHaveText` expected _no expected value_ _(none)_
    - :168 `toBe` expected `0` _(literal)_
    - :169 `toHaveClass` expected `/broken/` _(regex)_
    - :171 `toBe` expected `from` _(expression)_
    - :181 `toHaveText` expected `'1 pair(s): A↔M'` _(literal)_
- `crib placement: every surviving offset is exactly the self-map-free one` — e2e/claims.spec.ts:189
    - :207 `expect` expected _no expected value_ _(none)_
    - :208 `toBe` expected `expectedValid.length` _(expression)_
    - :209 `toBe` expected `total` _(expression)_
    - :211 `toHaveCount` expected `total` _(expression)_
    - :212 `toHaveCount` expected `expectedValid.length` _(expression)_
    - :213 `toHaveCount` expected `total - expectedValid.length` _(expression)_
    - :218 `toEqual` expected `expectedValid` _(expression)_
    - :224 `toBe` expected `rejected` _(expression)_
- `crib placement failure paths: empty, over-long, and fully eliminated` — e2e/claims.spec.ts:228
    - :233 `toHaveText` expected _no expected value_ _(none)_
    - :236 `toContainText` expected `'Select a surviving placement above'` _(literal)_
    - :237 `toBeDisabled` expected _no expected value_ _(none)_
    - :242 `toHaveText` expected _no expected value_ _(none)_
    - :245 `toBeDisabled` expected _no expected value_ _(none)_
    - :246 `toHaveCount` expected `0` _(literal)_
    - :251 `toContainText` expected `'0 of 2 offsets survive self-map rejection'` _(literal)_
    - :252 `toContainText` expected `'✗ all eliminated — the crib cannot occur here'` _(literal)_
    - :253 `toHaveCount` expected `0` _(literal)_
    - :254 `toHaveCount` expected `2` _(literal)_
    - :255 `toBeDisabled` expected _no expected value_ _(none)_
- `menu statistics are consistent with the menu edges the page drew` — e2e/claims.spec.ts:262
    - :269 `expect` expected _no expected value_ _(none)_
    - :274 `toHaveLength` expected `crib.length` _(expression)_
    - :275 `toBe` expected `crib` _(expression)_
    - :307 `toBe` expected `nodes.length` _(expression)_
    - :308 `toBe` expected `edges.length` _(expression)_
    - :309 `toBe` expected `loops` _(expression)_
    - :310 `toBe` expected `central` _(expression)_
    - :311 `expect` expected _no expected value_ _(none)_
    - :315 `expect` expected _no expected value_ _(none)_
    - :316 `expect` expected _no expected value_ _(none)_
    - :317 `expect` expected _no expected value_ _(none)_
    - :318 `expect` expected _no expected value_ _(none)_
- `the menu coach grades a looped menu good and a loopless one bad` — e2e/claims.spec.ts:321
    - :325 `toHaveClass` expected `/good/` _(regex)_
    - :326 `toContainText` expected `'Strong menu'` _(literal)_
    - :327 `toContainText` expected `'${stats.get('loops')} loops'` _(expression)_
    - :333 `toBe` expected `0` _(literal)_
    - :334 `toHaveClass` expected `/bad/` _(regex)_
    - :335 `toContainText` expected `'Weak menu — no loops'` _(literal)_
    - :336 `toContainText` expected `'Expect many coincidental stops'` _(literal)_
- `the search-space estimate is the arithmetic it claims` — e2e/claims.spec.ts:343
    - :349 `toBe` expected `positions` _(expression)_
    - :350 `toHaveClass` expected `/warn/` _(regex)_
    - :353 `toBe` expected `60 * positions` _(expression)_
    - :354 `toHaveClass` expected `/warn/` _(regex)_
    - :355 `toContainText` expected `'consider the Cancel button'` _(literal)_
    - :359 `toBeVisible` expected _no expected value_ _(none)_
    - :361 `toBe` expected `positions * 26` _(expression)_
    - :362 `toContainText` expected `'searching rings multiplies the space fast'` _(literal)_
- `a successful Bombe run: counters partition the space and the stop verifies` — e2e/claims.spec.ts:365
    - :379 `toBe` expected `'AAA'` _(literal)_
    - :383 `expect` expected _no expected value_ _(none)_
    - :386 `toBe` expected `26 * 26 * 26` _(expression)_
    - :387 `expect` expected _no expected value_ _(none)_
    - :394 `toBe` expected `tested` _(expression)_
    - :395 `toBe` expected `stops` _(expression)_
    - :396 `expect` expected _no expected value_ _(none)_
    - :399 `toHaveCount` expected `stops` _(expression)_
    - :401 `toHaveText` expected `'✓ verified'` _(literal)_
    - :402 `toHaveText` expected `'pos ${truth}'` _(expression)_
    - :410 `toHaveText` expected `cipher.slice(offset, offset + crib.length)` _(expression)_
    - :411 `toHaveText` expected `crib` _(expression)_
    - :418 `expect` expected _no expected value_ _(none)_
    - :419 `expect` expected _no expected value_ _(none)_
- `a wrong placement reaches the no-stops failure state and says why` — e2e/claims.spec.ts:422
    - :430 `toHaveCount` expected `1` _(literal)_
    - :433 `toHaveClass` expected `/bad/` _(regex)_
    - :434 `expect` expected _no expected value_ _(none)_
    - :435 `toContainText` expected _no expected value_ _(none)_
    - :438 `toHaveCount` expected `0` _(literal)_
    - :442 `expect` expected _no expected value_ _(none)_
    - :447 `toBe` expected `0` _(literal)_
- `a loopless menu surfaces many stops and admits it is under-constrained` — e2e/claims.spec.ts:450
    - :456 `toBe` expected `0` _(literal)_
    - :461 `expect` expected _no expected value_ _(none)_
    - :464 `expect` expected _no expected value_ _(none)_
    - :469 `toBe` expected `stops` _(expression)_
    - :471 `toContainText` expected _no expected value_ _(none)_
    - :475 `toHaveCount` expected `24` _(literal)_
    - :476 `toHaveText` expected `'… and ${stops - 24} more.'` _(expression)_
- `a running search can be cancelled and the panel returns to a runnable state` — e2e/claims.spec.ts:479
    - :487 `toContainText` expected `'Searching 60 rotor order(s)'` _(literal)_
    - :488 `toBeVisible` expected _no expected value_ _(none)_
    - :489 `toBeDisabled` expected _no expected value_ _(none)_
    - :492 `toBeHidden` expected _no expected value_ _(none)_
    - :493 `toBeEnabled` expected _no expected value_ _(none)_
    - :494 `toHaveCount` expected `0` _(literal)_
- `loading a stop re-decrypts the crib, and the banner re-checks it against live output` — e2e/claims.spec.ts:501
    - :512 `toBeVisible` expected _no expected value_ _(none)_
    - :513 `toHaveClass` expected `/failed/` _(regex)_
    - :514 `toContainText` expected `'✓ Checked:'` _(literal)_
    - :515 `toContainText` expected `'re-decrypts offset 0 to “${crib}”'` _(expression)_
    - :516 `toContainText` expected `'start ${await currentStart(page)}'` _(expression)_
    - :518 `toContainText` expected `'${plugs} Stecker pair(s)'` _(expression)_
    - :522 `toBe` expected `crib` _(expression)_
    - :526 `toBe` expected `plaintext` _(expression)_
    - :527 `toContainText` expected `'letters outside the crib may read transposed'` _(literal)_
    - :532 `toHaveText` expected `plaintext` _(expression)_
    - :533 `toHaveClass` expected `/failed/` _(regex)_
- `the success verdict fails when the settings stop reproducing the crib` — e2e/claims.spec.ts:536
    - :545 `toContainText` expected `'✓ Checked:'` _(literal)_
    - :549 `toHaveClass` expected `/failed/` _(regex)_
    - :550 `toContainText` expected `'✗ Not verified:'` _(literal)_
    - :551 `toContainText` expected `'UKW-C'` _(literal)_
    - :552 `toContainText` expected _no expected value_ _(none)_
    - :557 `toBe` expected `crib` _(expression)_
    - :558 `toBe` expected `got` _(expression)_
    - :562 `toHaveClass` expected `/failed/` _(regex)_
    - :564 `toHaveClass` expected `/failed/` _(regex)_
    - :566 `toBe` expected `crib` _(expression)_
    - :567 `toBe` expected `got` _(expression)_
    - :573 `toBeHidden` expected _no expected value_ _(none)_
    - :577 `toHaveClass` expected `/failed/` _(regex)_
    - :578 `toHaveText` expected `'No pairs wired. Click a letter, then its partner.'` _(literal)_
    - :579 `toHaveText` expected `plaintext` _(expression)_
- `the guided step tracker only ticks steps that actually happened` — e2e/claims.spec.ts:586
    - :591 `toHaveCount` expected `6` _(literal)_
    - :592 `toHaveCount` expected `0` _(literal)_
    - :596 `toHaveCount` expected `4` _(literal)_
    - :597 `toHaveText` expected `'Run the Bombe'` _(literal)_
    - :600 `toHaveCount` expected `5` _(literal)_
    - :601 `toHaveText` expected `'Recover & check'` _(literal)_
    - :604 `toHaveCount` expected `6` _(literal)_
    - :607 `toHaveCount` expected `0` _(literal)_
    - :608 `toHaveText` expected `'—'` _(literal)_
    - :609 `toBeHidden` expected _no expected value_ _(none)_
- `a shared link reproduces the state it was copied from` — e2e/claims.spec.ts:612
    - :622 `expect` expected _no expected value_ _(none)_
    - :628 `toHaveText` expected `output` _(expression)_
    - :629 `toHaveText` expected `plugs` _(expression)_
    - :630 `toBe` expected `cipher` _(expression)_
- `an unparseable import is refused instead of silently loading` — e2e/claims.spec.ts:634
    - :643 `toHaveText` expected `'⚠ Not a valid scenario link or JSON.'` _(literal)_
    - :644 `toBeVisible` expected _no expected value_ _(none)_
    - :645 `toHaveText` expected `before` _(expression)_
- `the ciphertext handed to the break panel is the machine output verbatim` — e2e/claims.spec.ts:648
    - :653 `toBe` expected `output` _(expression)_
    - :655 `expect` expected _no expected value_ _(none)_
    - :656 `toContainText` expected `'offsets survive self-map rejection'` _(literal)_
- `nothing marked hidden is painted` — e2e/claims.spec.ts:669
    - :673 `expect` expected _no expected value_ _(none)_
    - :687 `toEqual` expected `[]` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-enigma-forge

## What It Is

Enigma Forge is a faithful, in-browser simulation of the **Wehrmacht Enigma I**
(3-rotor) cipher machine, paired with the **crib + simulated-Bombe** attack that
broke it. The cipher is a symmetric, electromechanical polyalphabetic
substitution: a signal passes through the plugboard (Steckerbrett), three rotors
(chosen from I–V, with ring settings and start positions), a reflector (UKW-B or
UKW-C), back through the rotors, and out the plugboard — stepping the rotors
every keystroke. It solves the problem of a constantly-changing substitution
alphabet, and it is its own inverse (the same settings decrypt). It is **not**
secure by any modern standard: a structural flaw (no letter ever encrypts to
itself) plus predictable cribs let the demo recover settings by elimination.

## When to Use It

- **Teaching how rotor machines actually work** — the path visualizer traces a
  keystroke contact-by-contact, because the mechanism, not a formula, is the point.
- **Demonstrating the no-self-encryption flaw** — the empty diagonal is shown
  interactively and then exploited, making an abstract weakness concrete.
- **Explaining real cryptanalysis** — crib placement, menu construction, and the
  Bombe's deduction-by-contradiction mirror the historical break, not a hand-wave.
- **Showing that keyspace size isn't security** — Enigma's ~10²³ keys still fell
  because exploitable structure leaked; a vivid lesson for modern designers.
- **Do NOT use Enigma for real security.** It is broken: it has no forward
  secrecy, no authentication, a fixed-point-free reflector that leaks structure,
  and is trivially recoverable from cribbed ciphertext. This is a teaching tool only.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-enigma-forge](https://systemslibrarian.github.io/crypto-lab-enigma-forge/)**

Type a message to encrypt it live (and, with identical settings, decrypt it — the
machine is its own inverse) while the lampboard, rotor windows, and signal-path
diagram update per keystroke. Controls include rotor selection and order (I–V),
ring settings (Ringstellung), initial positions (Grundstellung), reflector (B/C),
and plugboard pairs (Steckerbrett). The break workflow then takes a crib and
ciphertext through placement (self-map rejection), menu construction, and a
simulated Bombe that recovers candidate settings you can load back into the machine.
Every stop is surfaced only after the crib window is genuinely re-decrypted, and the
success banner re-runs that check against the machine's live output rather than
trusting that a stop was loaded. Note the honest limit: the Bombe can only deduce
Steckers that touch the menu, so a loaded stop reproduces the crib exactly but may
leave letters elsewhere transposed until the remaining plugboard pairs are found by
hand — the bundled challenge is deliberately one of those cases.

## What Can Go Wrong

- The reflector is fixed-point-free, so no letter ever encrypts to itself — a structural leak that crib placement exploits to reject impossible alignments.
- Predictable plaintext (stereotyped openings, weather reports) gives cribs that a Bombe-style search uses to eliminate rotor and plugboard settings.
- Operator procedure failures — reused message keys, lazy rotor choices, repeated indicators — historically shrank the effective keyspace far below its theoretical size.
- The large keyspace (~10²³) creates a false sense of security; exploitable structure, not brute force, is what broke it.
- It provides no authentication or integrity and no forward secrecy, so ciphertext can be altered undetectably.

## Real-World Usage

- Historically the primary German military cipher of World War II; breaking it (the Polish Biuro Szyfrów, then Bletchley Park) materially affected the war.
- A foundational case study in cryptanalysis teaching — known-plaintext attacks, search-space reduction, and why keyspace size alone is not security.
- The origin point for mechanized codebreaking (the Bombe), a precursor to modern computing.
- Today purely a teaching and museum artifact, not used for any real protection.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-enigma-forge
cd crypto-lab-enigma-forge
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-vigenere-break](https://systemslibrarian.github.io/crypto-lab-vigenere-break/) — breaking a classical polyalphabetic cipher with Kasiski and frequency analysis.
- [crypto-lab-dead-sea-cipher](https://systemslibrarian.github.io/crypto-lab-dead-sea-cipher/) — substitution, Vigenère, and Atbash, the historical ciphers Enigma descends from.
- [crypto-lab-otp-vault](https://systemslibrarian.github.io/crypto-lab-otp-vault/) — the one cipher with provable secrecy, and the key-reuse mistake that breaks it.
- [crypto-lab-biham-lens](https://systemslibrarian.github.io/crypto-lab-biham-lens/) — modern differential cryptanalysis of a substitution-permutation network.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Vigenère Break

- **slug**: `crypto-lab-vigenere-break`
- **repo**: https://github.com/systemslibrarian/crypto-lab-vigenere-break
- **live**: https://systemslibrarian.github.io/crypto-lab-vigenere-break/
- **commit_sha**: `0b6bf1cbdb1e1399d49e9dd546095c533acab552` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: HISTORICAL | ATTACKS  ·  **level**: beginner  ·  **--accent**: #7e57c2
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Vigenère Break  — _read from src/main.ts_

**Subtitle**: Polyalphabetic cipher · Kasiski · Index of Coincidence  — _read from src/main.ts_

**Description**: Encrypt with a repeating key, then break a ciphertext live — Kasiski spacing recovers the key length, the index of coincidence confirms it, and per-column chi-squared frequency analysis pulls out each key letter.  — _read from src/main.ts_

**Why it matters**: A short, reused key looks like strong encryption but leaks its own structure. Vigenère stood as  — _read from src/main.ts_

**Card copy**: Encrypt and decrypt with repeating-key Vigenère, then use Kasiski, coincidence counts and frequency scores to propose candidates. Verify a purported break against the supplied answer; a high English score alone can be wrong.

**Chips**: Vigenère · Kasiski Examination · Index of Coincidence · Frequency Analysis

**Implements**: Vigenere cipher `src/samples/index.ts:6`

**Attacks shown**: Frequency analysis `src/main.ts:22`

**Comment-only (named in code comments, not executed)**: Caesar cipher `src/samples/index.ts:68`

**References**: AES, AES-GCM, Caesar cipher, ChaCha20, ChaCha20-Poly1305, Enigma, One-time pad, Poly1305, Substitution cipher

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `10.1002/j.1538-7305.1949.tb00928.x` — first seen src/main.ts:61 (1×)
- `doi.org/10.1002/j.1538-7305.1949.tb00928.x` — first seen README.md:25 (2×)
- `RFC 4949` — first seen README.md:25 (3×)
- `rfc4949` — first seen README.md:25 (3×)

**README — What Can Go Wrong**:

```text
- Too little ciphertext defeats the break: Kasiski needs repeated factors and the index of coincidence and per-column chi-squared analysis need enough letters per column to be statistically meaningful.
- A wrong key-length guess misaligns every column, so the chi-squared solver locks onto plausible-but-wrong shifts and produces garbage plaintext.
- Frequency analysis assumes a known plaintext language; text that is not standard English (or a different alphabet entirely) shifts the expected distribution and misleads the solver.
- Sparse columns can make this statistical solver inconclusive without making a ciphertext secure. The bundled long-key sample uses a predictable English phrase shorter than the message, so the key repeats. Key length and non-reuse alone do not imply a one-time pad or perfect secrecy; see the independent random-key conditions in [RFC 4949](https://www.rfc-editor.org/rfc/rfc4949#section-6) and [Shannon (1949)](https://doi.org/10.1002/j.1538-7305.1949.tb00928.x).
- A wrong key can produce an English-like candidate. For example, a long English passage encrypted under `LEMON` can still score about 0.686 on this demo's heuristic when decrypted under `MEMON`; the bundle's answer check prevents that from being called verified. For custom text, compare against independent evidence yourself.
- Reusing the same keyword across many messages multiplies the exposed material and makes recovery easier, the historical reason Vigenère eventually fell.
```

**Claims tested** (e2e/claims.spec.ts, 36 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:87
    - :87 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:115
    - :115 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:116
    - :116 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:121
    - :121 `toHaveURL` expected `new RegExp('s=${id}')` _(expression)_
- `Cipher panel` — e2e/claims.spec.ts:150
- `ciphertext equals an independent Vigenere encryption of the shown input and key` — e2e/claims.spec.ts:151
    - :158 `toBe` expected `encryptLetters(plain, key)` _(expression)_
    - :160 `toBe` expected `normalize(plain)` _(expression)_
    - :162 `toBe` expected `plain.length` _(expression)_
- `the alignment strip shows the key repeating under the message, position by position` — e2e/claims.spec.ts:165
    - :181 `toBe` expected `letters.length` _(expression)_
    - :184 `toBe` expected `letters[i]` _(expression)_
    - :186 `toBe` expected `normKey[i % normKey.length]` _(expression)_
    - :187 `toBe` expected `normKey.charCodeAt(i % normKey.length) - A` _(expression)_
    - :189 `toBe` expected `String.fromCharCode(A + ((cell.in.charCodeAt(0) - A + cell.shift) % 26))` _(expression)_
- `the character/letter counter matches the text actually in the box` — e2e/claims.spec.ts:193
    - :199 `toBe` expected `text.length` _(expression)_
    - :200 `toBe` expected `normalize(text).length` _(expression)_
- `decrypt direction inverts encrypt: ciphertext under the same key returns the plaintext` — e2e/claims.spec.ts:203
    - :211 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :215 `toBe` expected `normalize(plain)` _(expression)_
    - :216 `toBe` expected `decryptLetters(ct, key)` _(expression)_
- `a non-letter keyword is refused with a reason, and no output is faked` — e2e/claims.spec.ts:219
    - :223 `toHaveText` expected `/letters A.Z only/i` _(regex)_
    - :225 `toHaveCount` expected `0` _(literal)_
- `Break workbench: the exploit lands (Declaration / ideal case)` — e2e/claims.spec.ts:233
- `re-encrypting the recovered plaintext under the recovered key reproduces the ciphertext` — e2e/claims.spec.ts:234
    - :240 `toMatch` expected `/^[A-Z]+$/` _(regex)_
    - :243 `toBe` expected `normalize(ct)` _(expression)_
    - :244 `toBe` expected `normalize(plaintext)` _(expression)_
- `the recovered plaintext is real English, not just self-consistent` — e2e/claims.spec.ts:247
    - :251 `expect` expected _no expected value_ _(none)_
    - :254 `expect` expected _no expected value_ _(none)_
- `the recovered key length equals the index-of-coincidence peak the chart marks` — e2e/claims.spec.ts:257
    - :264 `toEqual` expected `[key.length]` _(expression)_
    - :266 `toBe` expected `key.length` _(expression)_
    - :267 `toBe` expected `true` _(expression)_
    - :269 `toContainText` expected _no expected value_ _(none)_
    - :273 `toContainText` expected `'(length ${key.length})'` _(expression)_
- `every IoC number on the chart is the real index of coincidence of that period` — e2e/claims.spec.ts:276
    - :280 `expect` expected _no expected value_ _(none)_
    - :282 `toBeCloseTo` expected `averageIocForPeriod(letters, row.period), 4` _(expression)_
- `the peak is a real spike: English-like at the key length, near-random at its neighbours` — e2e/claims.spec.ts:286
    - :292 `expect` expected _no expected value_ _(none)_
    - :294 `expect` expected _no expected value_ _(none)_
    - :295 `expect` expected _no expected value_ _(none)_
- `each column key letter is the argmin of the chi-squared profile the page prints` — e2e/claims.spec.ts:299
    - :304 `toHaveCount` expected `key.length` _(expression)_
    - :318 `toHaveLength` expected `26` _(literal)_
    - :322 `toBeCloseTo` expected `chiSquaredForShift(column, shift), 0` _(expression)_
    - :326 `toBe` expected `String.fromCharCode(A + argmin)` _(expression)_
    - :327 `toBe` expected `String.fromCharCode(A + argmin)` _(expression)_
- `bundled answer verification agrees with the independent plaintext and key` — e2e/claims.spec.ts:331
    - :333 `toContainText` expected `/both the known key and plaintext/` _(regex)_
    - :336 `toBe` expected `'LEMON'` _(literal)_
    - :337 `toBe` expected `decryptLetters(normalize(await ciphertextOf(page)), 'LEMON')` _(expression)_
    - :338 `expect` expected _no expected value_ _(none)_
    - :340 `expect` expected _no expected value_ _(none)_
    - :343 `expect` expected _no expected value_ _(none)_
    - :344 `expect` expected _no expected value_ _(none)_
    - :346 `toHaveCount` expected `4` _(literal)_
    - :347 `toHaveCount` expected `0` _(literal)_
- `revealing the true key confirms the recovery against the answer key` — e2e/claims.spec.ts:350
    - :355 `toContainText` expected `'True key: ${key}.'` _(expression)_
    - :356 `toContainText` expected `'Your candidate key and plaintext match the bundled answer.'` _(literal)_
- `the ciphertext counters describe the ciphertext actually in the box` — e2e/claims.spec.ts:359
    - :364 `toBe` expected `ct.length` _(expression)_
    - :365 `toBe` expected `normalize(ct).length` _(expression)_
    - :366 `toBe` expected `Math.max(0, ct.length - normalize(ct).length - (ct.match(/\s/g)?.length ?? 0))` _(expression)_
    - :368 `expect` expected _no expected value_ _(none)_
    - :369 `toHaveText` expected `''` _(literal)_
- `the solver transcript narrates its candidate without claiming verification` — e2e/claims.spec.ts:372
    - :377 `toContainText` expected `'plausible candidate only', { timeout: 20000 }` _(expression)_
    - :379 `expect` expected _no expected value_ _(none)_
    - :380 `expect` expected _no expected value_ _(none)_
    - :382 `expect` expected _no expected value_ _(none)_
- `Failure and honest-refusal paths` — e2e/claims.spec.ts:391
- `too-short ciphertext: refuses to fabricate a key and says how short it is` — e2e/claims.spec.ts:392
    - :397 `expect` expected _no expected value_ _(none)_
    - :399 `toHaveCount` expected `0` _(literal)_
    - :400 `toHaveCount` expected `0` _(literal)_
    - :402 `toContainText` expected _no expected value_ _(none)_
    - :405 `toContainText` expected `/below the ~50 needed/` _(regex)_
    - :407 `toHaveClass` expected `/fail/` _(regex)_
    - :408 `toHaveCount` expected `0` _(literal)_
- `long predictable key: no English-like period is flagged when the verdict says there is none` — e2e/claims.spec.ts:411
    - :416 `toBeVisible` expected _no expected value_ _(none)_
    - :420 `toEqual` expected `[]` _(expression)_
    - :421 `expect` expected _no expected value_ _(none)_
    - :425 `expect` expected _no expected value_ _(none)_
    - :426 `toContainText` expected `/inconclusive/` _(regex)_
    - :427 `toHaveCount` expected `0` _(literal)_
    - :428 `toContainText` expected `'predictable'` _(literal)_
    - :429 `toContainText` expected `'effectively unbreakable'` _(literal)_
- `non-English plaintext: bundled answer verifies even though English-quality fails` — e2e/claims.spec.ts:432
    - :440 `toBe` expected `normalize(ct)` _(expression)_
    - :443 `toContainText` expected _no expected value_ _(none)_
    - :446 `toHaveCount` expected `1` _(literal)_
    - :447 `toContainText` expected `/Verified against the bundled answer/` _(regex)_
    - :448 `toHaveClass` expected `/done/` _(regex)_
- `a wrong key-length hypothesis produces garbage and the page says so` — e2e/claims.spec.ts:451
    - :457 `toHaveText` expected `new RegExp('^[A-Z]{${wrongLength}}$')` _(expression)_
    - :458 `toHaveCount` expected `wrongLength` _(expression)_
    - :464 `toBe` expected `normalize(ct)` _(expression)_
    - :466 `expect` expected _no expected value_ _(none)_
    - :467 `toHaveCount` expected `0` _(literal)_
    - :468 `toContainText` expected _no expected value_ _(none)_
    - :472 `toContainText` expected `'high'` _(literal)_
    - :475 `toContainText` expected _no expected value_ _(none)_
- `tampering with a single column shift breaks the key and is labelled as manual` — e2e/claims.spec.ts:480
    - :489 `toBe` expected `String.fromCharCode(A + wrongShift)` _(expression)_
    - :490 `toBe` expected `trueKey.slice(1)` _(expression)_
    - :492 `toHaveText` expected `/manual/` _(regex)_
    - :493 `toHaveClass` expected `/overridden/` _(regex)_
    - :496 `toBe` expected `normalize(await ciphertextOf(page))` _(expression)_
    - :497 `expect` expected _no expected value_ _(none)_
    - :499 `toContainText` expected `'Your candidate does not match the bundled answer yet'` _(literal)_
    - :503 `toHaveText` expected `trueKey` _(expression)_
    - :504 `toHaveCount` expected `0` _(literal)_
- `custom short ciphertext warns before it fails, with the real letter count` — e2e/claims.spec.ts:507
    - :510 `toHaveText` expected `'13 characters · 12 letters (analysed) · 0 punctuation/digits'` _(literal)_
    - :511 `toHaveText` expected `/Only 12 letters/` _(regex)_
    - :512 `toHaveCount` expected `0` _(literal)_
    - :513 `toContainText` expected `'only 12 letters'` _(literal)_
- `mostly-punctuation input is called out rather than silently analysed` — e2e/claims.spec.ts:516
    - :520 `toHaveText` expected _no expected value_ _(none)_
    - :524 `toEqual` expected `[junk.length, 2]` _(expression)_
- `clearing the ciphertext leaves no recovered key behind` — e2e/claims.spec.ts:527
    - :530 `toHaveValue` expected `''` _(literal)_
    - :531 `toHaveCount` expected `0` _(literal)_
    - :532 `toHaveCount` expected `0` _(literal)_
- `Challenge mode` — e2e/claims.spec.ts:540
- `the key is hidden until submitted, and the counters track what you set` — e2e/claims.spec.ts:541
    - :546 `toHaveCount` expected `0` _(literal)_
    - :548 `toEqual` expected `new Array(keyLength).fill('?')` _(expression)_
    - :550 `toHaveText` expected _no expected value_ _(none)_
    - :553 `toContainText` expected `'Columns set: 0/${keyLength} · hints used: 0'` _(expression)_
    - :556 `toHaveText` expected `'?'` _(literal)_
    - :557 `toContainText` expected `'Columns set: 1/${keyLength} · hints used: 1'` _(expression)_
- `solving every column by hand with no hints scores a perfect 100` — e2e/claims.spec.ts:560
    - :569 `toContainText` expected `'Columns set: ${key.length}/${key.length} · hints used: 0'` _(expression)_
    - :572 `toHaveText` expected `key` _(expression)_
    - :574 `toContainText` expected `'Score 100/100 (A)'` _(literal)_
    - :575 `toContainText` expected `'${key.length} columns · 0 hint(s) · ${key.length} manual solve(s)'` _(expression)_
    - :576 `toContainText` expected `'Verified: key and plaintext match the bundled answer.'` _(literal)_
- `wrong manual key cannot pass challenge despite a plausible decryption` — e2e/claims.spec.ts:579
    - :586 `toHaveText` expected `'MEMON'` _(literal)_
    - :587 `toContainText` expected `'Score 0/100'` _(literal)_
    - :588 `toContainText` expected `'Not verified against the bundled answer'` _(literal)_
    - :589 `toHaveClass` expected `/active/` _(regex)_
- `hints are charged at 12 points each, exactly as the score claims` — e2e/claims.spec.ts:592
    - :609 `toContainText` expected `'Score ${expected}/100'` _(expression)_
    - :610 `toContainText` expected `'${hints} hint(s) · ${key.length - hints} manual solve(s)'` _(expression)_
    - :611 `toHaveText` expected `key` _(expression)_
- `the URL hash round-trips the ciphertext, hypothesis and overrides` — e2e/claims.spec.ts:619
    - :627 `expect` expected _no expected value_ _(none)_
    - :628 `expect` expected _no expected value_ _(none)_
    - :629 `expect` expected _no expected value_ _(none)_
    - :632 `toHaveText` expected `'A' + key.slice(1)` _(expression)_
    - :633 `toHaveText` expected `/manual/` _(regex)_
    - :634 `toHaveValue` expected `'holmes'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-vigenere-break

## What It Is

The **Vigenère cipher** is a polyalphabetic substitution cipher: each plaintext letter is shifted by the corresponding letter of a repeating keyword, i.e. `c_i = (p_i + k_(i mod L)) mod 26`. It solves the weakness of a simple Caesar/monoalphabetic cipher — a single fixed shift that flat letter-frequency analysis cracks instantly — by cycling through `L` different shifts. It is a **symmetric** scheme: the same short keyword both encrypts and decrypts, and it is **not** secure by modern standards. This demo implements the cipher *and* its classical break — **Kasiski examination**, the **index of coincidence**, and per-column **chi-squared frequency analysis** — to propose a key from ciphertext alone. The workbench verifies a candidate only when both its key and plaintext match a bundled known answer. A long predictable key is not a one-time pad: an OTP needs an independent, uniformly random, secret key of at least the message length, used only once.

## When to Use It

- **Teaching how classical cryptanalysis actually works** — Kasiski spacing, index of coincidence, and frequency analysis are visible end-to-end here, which is why Vigenère is the canonical worked example.
- **Understanding why key reuse is fatal** — the repeating key is exactly what the break exploits, a lesson that carries directly into modern stream-cipher and one-time-pad discipline.
- **Puzzles, CTFs, and historical recreation** — Vigenère shows up in beginner crypto challenges and 16th–19th-century historical contexts where this is the right period-accurate tool.
- **Do NOT use it to protect real data.** A short repeating key has no modern security: sufficient ciphertext enables statistical attacks, as this demo illustrates. For confidentiality use an authenticated modern cipher (e.g. AES-GCM or ChaCha20-Poly1305); for the theoretical result with an independent random one-time pad, see the OTP Vault demo.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-vigenere-break](https://systemslibrarian.github.io/crypto-lab-vigenere-break/)**

Encrypt and decrypt text with a keyword (the panel shows the per-letter key alignment and an optional tabula recta), then **attempt to break a ciphertext step by step**. The break workbench walks Kasiski examination → index of coincidence → per-column chi-squared solving → candidate key → decryption, with controls for the **plaintext/keyword input**, **ciphertext input**, **key-length selector**, and **per-column shift override**, plus a guided challenge mode. Every statistic is computed live from the ciphertext. Its English-quality number ranks plausibility; it is not a probability of correctness. A bundled sample's reference key and plaintext are used only to check a candidate after solving, never to select its shifts. Custom ciphertext has no answer key and cannot receive a verified verdict or score. Manual shifts and hints are labeled as user input.

## What Can Go Wrong

- Too little ciphertext defeats the break: Kasiski needs repeated factors and the index of coincidence and per-column chi-squared analysis need enough letters per column to be statistically meaningful.
- A wrong key-length guess misaligns every column, so the chi-squared solver locks onto plausible-but-wrong shifts and produces garbage plaintext.
- Frequency analysis assumes a known plaintext language; text that is not standard English (or a different alphabet entirely) shifts the expected distribution and misleads the solver.
- Sparse columns can make this statistical solver inconclusive without making a ciphertext secure. The bundled long-key sample uses a predictable English phrase shorter than the message, so the key repeats. Key length and non-reuse alone do not imply a one-time pad or perfect secrecy; see the independent random-key conditions in [RFC 4949](https://www.rfc-editor.org/rfc/rfc4949#section-6) and [Shannon (1949)](https://doi.org/10.1002/j.1538-7305.1949.tb00928.x).
- A wrong key can produce an English-like candidate. For example, a long English passage encrypted under `LEMON` can still score about 0.686 on this demo's heuristic when decrypted under `MEMON`; the bundle's answer check prevents that from being called verified. For custom text, compare against independent evidence yourself.
- Reusing the same keyword across many messages multiplies the exposed material and makes recovery easier, the historical reason Vigenère eventually fell.

## Real-World Usage

- A historical confidentiality tool from the 16th through 19th centuries, famously dubbed "le chiffre indéchiffrable" before Babbage and Kasiski showed how to break it.
- A staple teaching example in cryptography courses precisely because its strengths and its break are both tractable by hand.
- A common beginner-level puzzle in CTFs, escape rooms, and alternate-reality games where period-accurate or lightweight obfuscation is wanted.
- Today strictly obsolete for security: it is studied to motivate key non-reuse, computational hardness, and the move to modern authenticated ciphers.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-vigenere-break
cd crypto-lab-vigenere-break
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-dead-sea-cipher](https://systemslibrarian.github.io/crypto-lab-dead-sea-cipher/) — substitution, Vigenère, and Atbash classical ciphers in one place.
- [crypto-lab-enigma-forge](https://systemslibrarian.github.io/crypto-lab-enigma-forge/) — another historical cipher and its mechanized break (the Bombe).
- [crypto-lab-otp-vault](https://systemslibrarian.github.io/crypto-lab-otp-vault/) — independent uniformly random secret pad material, once per message, and the two-time-pad failure.
- [crypto-lab-world-ciphers](https://systemslibrarian.github.io/crypto-lab-world-ciphers/) — modern symmetric block ciphers, the secure successors to classical substitution.

## Sources

- Bernhard Esslinger, [*Learning and Experiencing Cryptography with CrypTool and SageMath*](https://www.cryptool.org/en/ctbook/) (Artech House, 2024), chapter 3 on historical ciphers and Vigenère analysis.
- J. Shirey, [RFC 4949, *Internet Security Glossary, Version 2*](https://www.rfc-editor.org/rfc/rfc4949#section-6) (IETF, August 2007), “one-time pad.”
- C. E. Shannon, [*Communication Theory of Secrecy Systems*](https://doi.org/10.1002/j.1538-7305.1949.tb00928.x) (Bell System Technical Journal, 1949), perfect secrecy.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---
