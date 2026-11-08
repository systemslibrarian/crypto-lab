# Crypto Lab audit corpus — STEGANOGRAPHY

Generated 2026-11-08T20:20:28.593Z from 4 lab record(s).

Every finding must cite **commit_sha + lab slug + field**. A field printed as
`MISSING` was not found by the generator; it is not a claim that the lab lacks it.

---
## Stego Suite

- **slug**: `crypto-lab-stego-suite`
- **repo**: https://github.com/systemslibrarian/crypto-lab-stego-suite
- **live**: https://systemslibrarian.github.io/crypto-lab-stego-suite/
- **commit_sha**: `9a938c5c2ddbe0613ad71827af59849810ef384b` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: STEGANOGRAPHY  ·  **level**: beginner  ·  **--accent**: #ff9f1c
- **MISSING FIELDS**: spec_citations, verification

**Name (H1)**: Stego Suite  — _read from src/main.ts_

**Subtitle**: LSB · DCT · Adaptive embedding · Chi-squared steganalysis  — _read from src/main.ts_

**Description**: Hide a message inside a picture, look at the result and see nothing, read the message back out — then hand the same picture to a program that hunts for hidden messages and watch it find nothing either.  — _read from src/main.ts_

**Why it matters**: Sometimes the risk is not that someone can read your message. It is that anyone can see you sent one at all. Hiding a message inside something ordinary answers that — and the catch is that hidden is not the same as safe, because whether it stays hidden depends on how much you hide and who is looking.  — _read from src/main.ts_

**Card copy**: Compare LSB, DCT, and adaptive image hiding with chi-squared steganalysis. Optional AES-GCM passphrase encryption versions its KDF and warns when opening legacy images.

**Chips**: LSB · DCT · Adaptive Embedding · Chi-Squared Steganalysis

**Implements**: AES `src/lib/crypto.ts:12`, AES-GCM `src/lib/crypto.ts:24`, PBKDF2 `src/lib/crypto.ts:15`, SHA-256 `src/lib/crypto.ts:15`

**Attacks shown**: _none derived_

**References**: HMAC, SNOW 2.0

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**README — What Can Go Wrong**:

```text
- **LSB is trivially detectable** — the chi-squared test has reliably flagged sequential LSB embedding since 1999; LSB offers no security in any adversarial setting.
- **JPEG compression destroys LSB** — re-encoding a JPEG wipes LSB modifications, so spatial LSB is useless for JPEG carriers (use DCT-domain methods instead).
- **Embedding in smooth regions** — flat areas make statistical anomalies obvious; adaptive schemes concentrate changes in textured regions for exactly this reason.
- **Stego without encryption** — steganography hides existence, not content; once a payload is detected, an unencrypted message is fully exposed.
- **Weak passphrase or old encrypted PNG** — a discovered encrypted payload can be guessed offline. Mode 1 images used 120,000 PBKDF2 iterations; the app still opens them but warns you to recover and re-embed using the newer mode and a strong passphrase. Do not assume hiding a payload prevents offline guessing if it is found.
- **Capacity vs detectability** — the more of the carrier a payload fills, the easier detection becomes; near-full embedding is precisely where even crude global tests start firing.
```

**Claims tested** (e2e/claims.spec.ts, 29 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:57
    - :57 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:82
    - :82 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:83
    - :83 `toBeEnabled` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:90
    - :90 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:91
    - :91 `toBeEnabled` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:124
    - :124 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:130
    - :130 `toBeVisible` expected _no expected value_ _(none)_
- `cover: the shared sample carrier is the size every exhibit budgets against` — e2e/claims.spec.ts:135
    - :137 `expect` expected _no expected value_ _(none)_
    - :138 `toEqual` expected `[COVER_W, COVER_H]` _(expression)_
    - :141 `toBe` expected `CAPACITY_BITS` _(expression)_
- `capacity meter: the payload budget is the packet size, and encryption adds exactly its overhead` — e2e/claims.spec.ts:144
    - :150 `toBe` expected `expected` _(expression)_
    - :151 `toBe` expected `CAPACITY_BITS` _(expression)_
    - :153 `toBe` expected `Number(((expected / CAPACITY_BITS) * 100).toFixed(2))` _(expression)_
    - :158 `toBe` expected `AES_OVERHEAD * 8` _(expression)_
    - :159 `expect` expected _no expected value_ _(none)_
    - :165 `toBeCloseTo` expected `(packetBits(200) / CAPACITY_BITS) * 100, 2` _(expression)_
- `walkthrough: every step hides the real packet bit, in the right channel, at the right pixel` — e2e/claims.spec.ts:170
    - :175 `toBeDisabled` expected _no expected value_ _(none)_
    - :181 `toBe` expected `step + 1` _(expression)_
    - :182 `toBe` expected `bits.length` _(expression)_
    - :183 `toBe` expected `bits[step]` _(expression)_
    - :187 `expect` expected _no expected value_ _(none)_
    - :188 `toBe` expected `channel` _(expression)_
    - :191 `toEqual` expected `[pixel % COVER_W, Math.floor(pixel / COVER_W)]` _(expression)_
    - :197 `toHaveLength` expected `8` _(literal)_
    - :199 `toBe` expected `shown` _(expression)_
    - :200 `toBe` expected `bits[step]` _(expression)_
    - :206 `toBe` expected `(before & 0xfe) | bits[step]` _(expression)_
    - :207 `toBe` expected `1` _(literal)_
    - :208 `toBe` expected `shown` _(expression)_
    - :211 `toBe` expected `bits[step]` _(expression)_
    - :212 `toBe` expected `shown` _(expression)_
    - :215 `toBeDisabled` expected _no expected value_ _(none)_
    - :219 `toBe` expected `1` _(literal)_
    - :220 `toBeDisabled` expected _no expected value_ _(none)_
- `walkthrough: the packet-byte note counts bytes, not bits` — e2e/claims.spec.ts:223
    - :230 `toBe` expected `(step % 8) + 1` _(expression)_
    - :232 `toBe` expected `Math.floor(step / 8) + 1` _(expression)_
    - :233 `expect` expected _no expected value_ _(none)_
    - :234 `expect` expected _no expected value_ _(none)_
- `LSB embed: the reported payload, capacity and fidelity are all recomputable` — e2e/claims.spec.ts:240
    - :246 `toBe` expected `bytes` _(expression)_
    - :247 `toBe` expected `bytes` _(expression)_
    - :248 `toBe` expected `CAPACITY_BITS / 8` _(expression)_
    - :249 `expect` expected _no expected value_ _(none)_
    - :252 `toBe` expected `1` _(literal)_
    - :254 `expect` expected _no expected value_ _(none)_
    - :259 `expect` expected _no expected value_ _(none)_
    - :260 `expect` expected _no expected value_ _(none)_
    - :265 `toBe` expected `(before & 0xfe) | bit` _(expression)_
    - :266 `toBe` expected `before & 1` _(expression)_
    - :267 `toBe` expected `after & 1` _(expression)_
    - :268 `toBe` expected `before` _(expression)_
- `LSB round trip: the extracted message is the message that was embedded` — e2e/claims.spec.ts:271
    - :276 `expect` expected _no expected value_ _(none)_
    - :277 `expect` expected _no expected value_ _(none)_
- `LSB: extracting before embedding, and after a reset, refuses instead of inventing a message` — e2e/claims.spec.ts:281
    - :282 `expect` expected _no expected value_ _(none)_
    - :285 `expect` expected _no expected value_ _(none)_
    - :289 `toContainText` expected `'reset to the current cover'` _(literal)_
    - :290 `expect` expected _no expected value_ _(none)_
- `LSB: an empty message and a passphrase-less encryption are both refused` — e2e/claims.spec.ts:293
    - :295 `expect` expected _no expected value_ _(none)_
    - :300 `expect` expected _no expected value_ _(none)_
- `AES: encrypt-then-embed stores exactly the overhead, and only the right passphrase recovers it` — e2e/claims.spec.ts:303
    - :311 `toBe` expected `plain` _(expression)_
    - :312 `toBe` expected `plain + AES_OVERHEAD` _(expression)_
    - :313 `expect` expected _no expected value_ _(none)_
    - :314 `toBe` expected `1` _(literal)_
    - :316 `expect` expected _no expected value_ _(none)_
    - :317 `expect` expected _no expected value_ _(none)_
    - :322 `expect` expected _no expected value_ _(none)_
    - :323 `expect` expected _no expected value_ _(none)_
    - :328 `expect` expected _no expected value_ _(none)_
    - :329 `expect` expected _no expected value_ _(none)_
- `carrier: the exported stego PNG re-uploads and extracts the same message` — e2e/claims.spec.ts:334
    - :344 `toBe` expected `'stego-lsb.png'` _(literal)_
    - :347 `expect` expected _no expected value_ _(none)_
    - :348 `expect` expected _no expected value_ _(none)_
    - :349 `expect` expected _no expected value_ _(none)_
- `carrier: flipping one bit of the length header makes extraction fail outright` — e2e/claims.spec.ts:352
    - :357 `expect` expected _no expected value_ _(none)_
    - :358 `expect` expected _no expected value_ _(none)_
- `carrier: altering the payload region corrupts the recovered message` — e2e/claims.spec.ts:361
    - :369 `expect` expected _no expected value_ _(none)_
    - :374 `toHaveLength` expected `message.length` _(expression)_
    - :376 `toHaveLength` expected `1` _(literal)_
- `carrier: a cover image that never carried a payload is reported as empty` — e2e/claims.spec.ts:379
    - :381 `expect` expected _no expected value_ _(none)_
- `carrier: JPEG re-encoding destroys the hidden bits, exactly as the README warns` — e2e/claims.spec.ts:384
    - :390 `expect` expected _no expected value_ _(none)_
    - :391 `expect` expected _no expected value_ _(none)_
- `chi-squared: the verdict follows the probability the test computed` — e2e/claims.spec.ts:403
    - :405 `toContainText` expected `'Cover test'` _(literal)_
    - :407 `expect` expected _no expected value_ _(none)_
    - :408 `toBe` expected `cover.pct > 50` _(expression)_
    - :409 `toBe` expected `false` _(expression)_
    - :414 `expect` expected _no expected value_ _(none)_
    - :415 `expect` expected _no expected value_ _(none)_
    - :419 `toContainText` expected `'Stego test'` _(literal)_
    - :421 `toBe` expected `stego.pct > 50` _(expression)_
- `chi-squared: testing the stego image before anything is hidden says so` — e2e/claims.spec.ts:424
    - :426 `toContainText` expected `'No LSB embedding done yet'` _(literal)_
    - :427 `toBeVisible` expected _no expected value_ _(none)_
    - :431 `toBeHidden` expected _no expected value_ _(none)_
- `chi-squared: the detectability curve only fires near full capacity` — e2e/claims.spec.ts:434
    - :436 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :441 `toHaveLength` expected `3` _(literal)_
    - :445 `toBeCloseTo` expected `rates[i], 5` _(expression)_
    - :446 `toBe` expected `Math.floor(CAPACITY_BITS * rates[i])` _(expression)_
    - :449 `toBe` expected `pct > 50` _(expression)_
    - :454 `expect` expected _no expected value_ _(none)_
    - :455 `expect` expected _no expected value_ _(none)_
    - :456 `expect` expected _no expected value_ _(none)_
    - :457 `expect` expected _no expected value_ _(none)_
- `chi-squared toy: the residual falls off as (1 - fraction)^2 and vanishes at full embedding` — e2e/claims.spec.ts:460
    - :475 `toBe` expected `0` _(literal)_
    - :476 `expect` expected _no expected value_ _(none)_
    - :477 `toBe` expected `false` _(expression)_
    - :485 `toHaveText` expected `'${f}%'` _(expression)_
    - :487 `toBe` expected `f` _(expression)_
    - :490 `toBeCloseTo` expected `base.chi2 * (1 - f / 100) ** 2, 1` _(expression)_
    - :491 `expect` expected _no expected value_ _(none)_
    - :493 `toBe` expected `now.chi2 < 2` _(expression)_
    - :495 `toBe` expected `0` _(literal)_
- `DCT: the bit count is the packet size, and the message survives the coefficient round trip` — e2e/claims.spec.ts:500
    - :506 `toContainText` expected `'Computed 8×8 block DCT'` _(literal)_
    - :510 `toContainText` expected `'Embedded', { timeout: 30_000 }` _(expression)_
    - :513 `toBe` expected `(4 + utf8(message).length) * 8` _(expression)_
    - :514 `expect` expected _no expected value_ _(none)_
    - :515 `expect` expected _no expected value_ _(none)_
    - :518 `toContainText` expected `'Inverse DCT rendered'` _(literal)_
    - :522 `toContainText` expected `'Recovered', { timeout: 30_000 }` _(expression)_
    - :523 `expect` expected _no expected value_ _(none)_
- `DCT: extracting before embedding refuses instead of decoding noise` — e2e/claims.spec.ts:526
    - :530 `toContainText` expected `'No message embedded in DCT yet'` _(literal)_
    - :531 `expect` expected _no expected value_ _(none)_
- `adaptive: the comparison numbers back the stealth claim, and the chi verdict follows the data` — e2e/claims.spec.ts:536
    - :543 `toContainText` expected `'Sobel gradient magnitude'` _(literal)_
    - :547 `toContainText` expected `'Adaptive embedding wrote', { timeout: 30_000 }` _(expression)_
    - :548 `toBe` expected `bits` _(expression)_
    - :551 `toContainText` expected `'Sequential baseline plotted'` _(literal)_
    - :555 `toContainText` expected `'different placement', { timeout: 30_000 }` _(expression)_
    - :559 `toBe` expected `bits` _(expression)_
    - :563 `expect` expected _no expected value_ _(none)_
    - :567 `expect` expected _no expected value_ _(none)_
    - :568 `expect` expected _no expected value_ _(none)_
    - :569 `expect` expected _no expected value_ _(none)_
    - :583 `expect` expected _no expected value_ _(none)_
- `adaptive: comparing before both placements exist refuses instead of comparing nothing` — e2e/claims.spec.ts:586
    - :589 `toContainText` expected `'Run both adaptive and sequential embedding first'` _(literal)_
    - :590 `toBeVisible` expected _no expected value_ _(none)_
    - :593 `toContainText` expected `'Adaptive embedding wrote', { timeout: 30_000 }` _(expression)_
    - :596 `toContainText` expected `'Run both adaptive and sequential embedding first'` _(literal)_
    - :599 `toContainText` expected `'Sequential baseline plotted'` _(literal)_
    - :600 `toBeHidden` expected _no expected value_ _(none)_
    - :603 `toContainText` expected `'different placement', { timeout: 30_000 }` _(expression)_

**Mutation records** (1 file(s)):

- `audits/mutation-observations.json` (2501 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-stego-suite

## What It Is

Stego Suite demonstrates three steganographic techniques — LSB (Least Significant Bit) substitution, F5-inspired DCT-domain embedding, and WOW-inspired adaptive steganography — alongside their corresponding steganalysis attacks. Steganography hides the existence of a message rather than its content, making it fundamentally different from encryption. The demo covers the complete hiding-and-detection cycle: embed a payload, attempt detection with a chi-squared test, compare sequential vs adaptive embedding strategies, and examine real-world deployments from printer tracking dots to malware covert channels.

## When to Use It

- ✅ Digital watermarking for copyright protection (robust embedding)
- ✅ Covert communication where the existence of a message must be hidden
- ✅ Combined with encryption: encrypt first, then hide (strongest model)
- ✅ Network covert channels (timing-based or header-based)
- ❌ LSB steganography for any adversarial context — chi-squared test detects it trivially and has since 1999
- ❌ Steganography alone without encryption — if detected, content is exposed
- ❌ JPEG LSB embedding — JPEG compression destroys LSB modifications (use DCT-domain tools for JPEG)
- ❌ Smooth image regions — always embed in textured areas
- ❌ As a production steganography or anti-forensics tool — this is a teaching demo of hiding-and-detection techniques, not a hardened covert-channel implementation

## Live Demo

**[systemslibrarian.github.io/crypto-lab-stego-suite](https://systemslibrarian.github.io/crypto-lab-stego-suite/)**

Six exhibits cover steganography-vs-cryptography orientation, LSB substitution with pixel-level visualization and optional AES encryption, a real chi-squared steganalysis test detecting LSB embedding, F5-inspired DCT-domain embedding with 8×8 block transform visualization, WOW-inspired adaptive embedding using texture cost maps, and real-world cases from printer tracking dots to malware C2 channels. The exhibits are numbered as a suggested path, and dependent controls show inline hints when a prerequisite step is still pending. **Bring your own image:** upload any photo as the cover, embed a message, download the exact stego PNG, then re-upload to extract — a full round-trip on real imagery, with PSNR/fidelity metrics, a peak per-channel change readout, and a live capacity meter.

For optional encryption, new PNGs use a random salt, PBKDF2-HMAC-SHA-256 at 600,000 iterations, and AES-256-GCM. The existing packet's mode byte identifies the KDF: mode 2 is used for new encrypted PNGs; mode 1 remains readable at its original 120,000 iterations and shows a legacy warning when recovered. Plaintext mode 0 is unchanged. The salt/IV/tag payload length and the image capacity calculation stay the same. [OWASP's Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) recommends at least 600,000 PBKDF2-HMAC-SHA-256 iterations for stored password verifiers; here we apply the same work-factor lesson to password-derived encryption against offline guessing, not as a compliance claim. Choose a strong passphrase: the work factor cannot rescue a weak one. This browser exercise is not a production encryption or secret-storage tool.

Interactive teaching aids build the intuition before the machinery:

1. **Steganography vs cryptography** — a one-line plain-language contrast, a five-term vocabulary table, and an expandable "History / going deeper" panel holding the Westfeld–Pfitzmann / Fridrich / SRNet arms-race citations.
2. **LSB substitution** — a step-forward/step-back walkthrough that hides the *first payload bits one at a time*, showing the target channel's byte in binary and animating its least-significant bit flip to match each message bit, before the bulk embed.
3. **Chi-squared steganalysis** — a manipulable 8-pair toy histogram whose paired bars equalize toward their shared mean as you drag a "fraction embedded" slider (with a live residual χ²), grounding the pair-equalization insight before the real full-histogram test on the image (whose degrees of freedom are counted from the value-pairs the carrier actually populates — 127 for a full 8-bit histogram, fewer for a limited palette).
4. **DCT-domain embedding** — a primer defining a DCT coefficient as "how much of a given wave pattern this 8×8 block contains," plus a live basis-pattern thumbnail that previews the wave a coefficient controls when you hover a heatmap cell.
5. **Adaptive embedding** — a side-by-side **noise-residual view** (what a modern high-pass detector sees) contrasting sequential vs adaptive, so adaptive's changes visibly hide in texture while sequential's stand out on the smooth sky; the texture cost-map legend states the takeaway directly (green = textured = cheap to hide in; red = smooth = risky) and rings where adaptive placed its first bits.

## What Can Go Wrong

- **LSB is trivially detectable** — the chi-squared test has reliably flagged sequential LSB embedding since 1999; LSB offers no security in any adversarial setting.
- **JPEG compression destroys LSB** — re-encoding a JPEG wipes LSB modifications, so spatial LSB is useless for JPEG carriers (use DCT-domain methods instead).
- **Embedding in smooth regions** — flat areas make statistical anomalies obvious; adaptive schemes concentrate changes in textured regions for exactly this reason.
- **Stego without encryption** — steganography hides existence, not content; once a payload is detected, an unencrypted message is fully exposed.
- **Weak passphrase or old encrypted PNG** — a discovered encrypted payload can be guessed offline. Mode 1 images used 120,000 PBKDF2 iterations; the app still opens them but warns you to recover and re-embed using the newer mode and a strong passphrase. Do not assume hiding a payload prevents offline guessing if it is found.
- **Capacity vs detectability** — the more of the carrier a payload fills, the easier detection becomes; near-full embedding is precisely where even crude global tests start firing.

## Real-World Usage

- **Printer tracking dots** — many color laser printers embed near-invisible yellow microdot patterns encoding serial number and timestamp.
- **Digital watermarking** — robust embedding marks images, audio, and video for copyright and provenance tracking.
- **Malware covert channels** — real-world malware has hidden command-and-control data and payloads inside images and other media.
- **Network covert channels** — timing- and header-based steganography smuggles data through traffic that looks ordinary.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-stego-suite
cd crypto-lab-stego-suite
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-j-uniward](https://systemslibrarian.github.io/crypto-lab-j-uniward/) — J-UNIWARD adaptive DCT-domain embedding, the modern successor to the techniques shown here.
- [crypto-lab-shadow-vault](https://systemslibrarian.github.io/crypto-lab-shadow-vault/) — deniable encryption, the cryptographic cousin of hiding a message's existence.
- [crypto-lab-aes-modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/) — AES authenticated encryption for the "encrypt first, then hide" model.
- [crypto-lab-oram-vault](https://systemslibrarian.github.io/crypto-lab-oram-vault/) — Path ORAM, hiding access patterns rather than message content.
- [crypto-lab-iron-letter](https://systemslibrarian.github.io/crypto-lab-iron-letter/) — authenticated public-key encryption to seal a payload before embedding it.

## Steganalysis, stated correctly

The chi-squared exhibit reports the Westfeld–Pfitzmann **probability of embedding** — `Q(dof/2, χ²/2)`, where ≈1 means the carrier looks LSB-embedded and ≈0 means it looks natural. It also surfaces the test's real blind spot: applied to a whole image it only fires reliably near full embedding, so partial and adaptive payloads slip past it. The adaptive exhibit quantifies *why* adaptive embedding is stealthier (mean texture at embedding sites, fraction of bits landing in smooth regions) rather than overclaiming a difference the crude global test cannot actually see.

## Does the message survive?

Exhibit 2 now ends with a transformation comparison. After a message is embedded, each transformation runs on a copy of the stego image, and the stego image itself is kept for comparison. The transformations are:
- an exact PNG reload;
- JPEG re-encoding at qualities 0.95, 0.75 and 0.50, using the browser's own encoder;
- a 90% bilinear resize;
- a 4-pixel crop;
- ±1 noise on 1% of colour channels;
- two targeted single-bit flips, one in the packet header and one in the message body.

Each row reports three things separately: how much the picture changed (PSNR, or the new size), how many embedded bits now read back wrongly, and what extraction produced. Extraction can produce one of four results:
- **recovered**;
- **carrier failure:** the header or packet did not survive, so there was nothing to decrypt;
- **authentication failure:** an encrypted packet survived far enough for AES-GCM to reject it;
- **message altered:** a plaintext packet decoded to different text.

These are measurements on one image in one run, not guarantees. Lossy processing usually destroys the small changes LSB embedding relies on, and detecting a hidden message is a different outcome from recovering or destroying it (Peter Wayner, *Disappearing Cryptography*, 3rd ed., Morgan Kaufmann, 2009). The chi-squared score in Exhibit 3 is not an extraction probability. Exhibit 4's extraction from in-memory DCT coefficients is not a saved-JPEG round trip, and this comparison does not test it.

The pure logic is in `src/lib/survival.ts`, covered by unit tests. `e2e/survival.spec.ts` drives the panel in a real browser, and `scripts/mutate.mjs` holds one mutation case per rendered verdict (SV1–SV8).

## Engineering

The steganographic, cryptographic, DCT, and steganalysis core lives in dependency-free, fully unit-tested modules under [`src/lib`](src/lib); `src/main.ts` is the DOM/canvas layer. The Vitest suite covers bit/packet round-trips, AES-256-GCM, LSB and DCT embed/extract, the incomplete-gamma p-function against closed forms, distortion metrics, and a jsdom integration smoke test that drives every control. CI ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) runs typecheck + tests + build on every push and pull request.

Additional npm scripts:

`​``bash
npm test           # run the unit + DOM integration suite (Vitest)
npm run check      # typecheck + test + production build (what CI runs)
`​``

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## J-UNIWARD

- **slug**: `crypto-lab-j-uniward`
- **repo**: https://github.com/systemslibrarian/crypto-lab-j-uniward
- **live**: https://systemslibrarian.github.io/crypto-lab-j-uniward/
- **commit_sha**: `1553bf080cdcb5581a3e47ccb548d4c3379bd420` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: STEGANOGRAPHY  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, mutations, verification

**Name (H1)**: J-UNIWARD  — _read from index.html_

**Subtitle**: Adaptive JPEG Steganography · Holub & Fridrich, ACM IH&MMSec 2013  — _read from index.html_

**Description**: Embed a message with a Daubechies-8 wavelet distortion cost and watch, side by side, where J-UNIWARD, F5, and naïve LSB place their changes across the image.  — _read from index.html_

**Why it matters**: Content-blind embedding leaves statistical fingerprints that modern detectors read easily. Steering edits into textured, hard-to-model regions is what keeps hidden data hidden — the difference between private communication and a flagged file.  — _read from index.html_

**Card copy**: A foundational adaptive JPEG steganography benchmark using Universal Wavelet Relative Distortion. Its placement-cost model guides DCT embedding; it does not measure detector success or prove undetectability.

**Chips**: J-UNIWARD · DCT · Wavelet Distortion · Adaptive Embedding

**Implements**: AES `src/stc-keys.ts:37`, AES-CTR `src/stc-keys.ts:37`, HKDF `src/kdf.ts:14`, HMAC `src/steg/Embedder.ts:168`, PBKDF2 `src/kdf.ts:45`, SHA-256 `src/kdf.ts:23`

**Attacks shown**: Brute force `README.md:9`

**References**: Private information retrieval

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 5869` — first seen src/kdf.ts:11 (1×)

**README — What Can Go Wrong**:

```text
- **Placement is a proxy, not a detector.** The analysis measures *where* changes land relative to texture — the quantity J-UNIWARD minimizes — which predicts resistance better than any single first-order test. It is not itself a steganalyzer; real-world detection (SRM, SRNet, XuNet) uses deep learning on rich feature sets.
- **Higher payloads spend costlier coefficients.** As the rate rises the cheap textured coefficients run out, so the average change lands in a costlier spot — measured on `sample-grass.jpg`, J-UNIWARD's mean exposure climbs 7.1% → 11.7% → 17.0% → 21.8% → 27.7% from 0.10 to 0.50 bpnzac, and its worst single placement reaches the 96th percentile at 0.50. There is no universally safe payload; the panel shows the climb for your cover rather than naming a threshold.
- **COM marker sideband.** Salt, rate, and payload length are stored in a JPEG COM marker for extraction. This metadata may be stripped by image pipelines or social media compression — and it makes any file this demo produces trivially identifiable by a metadata scanner, without touching a single DCT coefficient. It exists so the browser round trip is reproducible, not because it is covert.
- **Fragile, not robust.** This is fragile steganography, not watermarking. The payload lives in the exact stego DCT coefficients, so recompression, quality-factor changes, resizing, cropping, rotation, or lossless JPEG optimization all alter those coefficients and break extraction. The recipient generally needs the original stego JPEG bytes.
- **Not "undetectable," and not automatically the winner here.** Placement is what this lab measures, and on that measure F5's per-change average often beats J-UNIWARD's (see above). Real statistical security is established with trained detectors over image corpora, not by grading an algorithm against its own objective.
- **Educational tool.** This is a teaching and portfolio demo, not suitable for adversarial environments.
```

**Claims tested** (e2e/claims.spec.ts, 31 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:37
    - :37 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:62
    - :62 `toContainText` expected `'(${name},', { timeout: 120_000 });` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:63
    - :63 `toContainText` expected `'Cost map ready'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:64
    - :64 `toBeEnabled` expected `{ timeout: 120_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:82
    - :82 `toHaveClass` expected `/hidden/, { timeout: 180_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:83
    - :83 `toBeEnabled` expected `{ timeout: 180_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:88
    - :88 `toBeEnabled` expected `{ timeout: 180_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:89
    - :89 `toHaveClass` expected `/hidden/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:96
    - :96 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:104
    - :104 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:137
    - :137 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:150
    - :150 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:162
    - :162 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:163
    - :163 `toMatch` expected `/_stego\.jpg$/` _(regex)_
- `the capacity table is consistent with the NZAC count the page reported` — e2e/claims.spec.ts:177
    - :182 `expect` expected _no expected value_ _(none)_
    - :187 `toHaveLength` expected `3` _(literal)_
    - :196 `toBe` expected `Math.max(0, Math.floor((nzac * rate) / 8) - 20)` _(expression)_
    - :197 `expect` expected _no expected value_ _(none)_
    - :199 `toMatch` expected `/Lower payload|Medium payload|Higher payload/` _(regex)_
    - :200 `toMatch` expected `/\bSafe\b|\bRisky\b/` _(regex)_
    - :205 `expect` expected _no expected value_ _(none)_
    - :206 `expect` expected _no expected value_ _(none)_
    - :212 `expect` expected _no expected value_ _(none)_
    - :213 `expect` expected _no expected value_ _(none)_
    - :214 `toBe` expected `'${msgBytes} bytes'` _(expression)_
    - :215 `toBe` expected `'${message.length} chars'` _(expression)_
    - :216 `toBe` expected `''` _(literal)_
    - :222 `toMatch` expected `/Low-texture carrier|Moderate-texture carrier|High-texture carrier/` _(regex)_
    - :224 `expect` expected _no expected value_ _(none)_
    - :225 `toBe` expected `nzac` _(expression)_
    - :226 `toBe` expected `blocks * 63` _(expression)_
    - :227 `toBeCloseTo` expected `(nzac / (blocks * 63)) * 100, 1` _(expression)_
    - :228 `expect` expected _no expected value_ _(none)_
- `a cover too small for the envelope says so on every surface, and never prints a negative capacity` — e2e/claims.spec.ts:243
    - :253 `toBe` expected `0.1` _(literal)_
    - :259 `expect` expected _no expected value_ _(none)_
    - :260 `expect` expected _no expected value_ _(none)_
    - :261 `toMatch` expected `/-\d/` _(regex)_
    - :266 `toHaveClass` expected `/alert-error/` _(regex)_
    - :267 `toMatch` expected `/-\d+ bytes/` _(regex)_
    - :268 `expect` expected _no expected value_ _(none)_
    - :271 `expect` expected _no expected value_ _(none)_
    - :276 `toHaveClass` expected `/alert-error/` _(regex)_
    - :277 `expect` expected _no expected value_ _(none)_
    - :278 `toHaveClass` expected `/hidden/` _(regex)_
    - :281 `expect` expected _no expected value_ _(none)_
- `embed verdict, summary and steganalysis all describe the same run` — e2e/claims.spec.ts:287
    - :298 `expect` expected _no expected value_ _(none)_
    - :299 `expect` expected _no expected value_ _(none)_
    - :300 `expect` expected _no expected value_ _(none)_
    - :301 `expect` expected _no expected value_ _(none)_
    - :302 `toHaveClass` expected `/alert-success/` _(regex)_
    - :309 `expect` expected _no expected value_ _(none)_
    - :311 `toBe` expected `msgBytes` _(expression)_
    - :312 `toBe` expected `4` _(literal)_
    - :313 `toBe` expected `16` _(literal)_
    - :314 `toBe` expected `msgPart + hdrPart + macPart` _(expression)_
    - :322 `expect` expected _no expected value_ _(none)_
    - :324 `toBe` expected `blocks * 63` _(expression)_
    - :325 `toBe` expected `nzac` _(expression)_
    - :326 `expect` expected _no expected value_ _(none)_
    - :327 `expect` expected _no expected value_ _(none)_
    - :332 `toBe` expected `changes` _(expression)_
    - :333 `expect` expected _no expected value_ _(none)_
    - :338 `toBeCloseTo` expected `(total * 8) / nzac, 3` _(expression)_
    - :339 `expect` expected _no expected value_ _(none)_
    - :341 `toMatch` expected `/^\d+(\.\d+)?$/` _(regex)_
    - :342 `expect` expected _no expected value_ _(none)_
    - :345 `toHaveClass` expected `/hidden/` _(regex)_
    - :346 `toBeVisible` expected _no expected value_ _(none)_
    - :347 `expect` expected _no expected value_ _(none)_
    - :351 `toHaveClass` expected `/hidden/` _(regex)_
    - :361 `toEqual` expected `['LSB', 'F5', 'J-UNIWARD']` _(expression)_
    - :363 `toMatch` expected `/Low|Medium|High|Negligible/` _(regex)_
    - :366 `expect` expected _no expected value_ _(none)_
    - :367 `expect` expected _no expected value_ _(none)_
    - :369 `expect` expected _no expected value_ _(none)_
    - :385 `expect` expected _no expected value_ _(none)_
    - :388 `expect` expected _no expected value_ _(none)_
    - :391 `toBe` expected `lowest.label` _(expression)_
    - :393 `toBe` expected `Number(lowest.value.replace('%', ''))` _(expression)_
    - :399 `expect` expected _no expected value_ _(none)_
    - :401 `expect` expected _no expected value_ _(none)_
    - :403 `expect` expected _no expected value_ _(none)_
    - :409 `expect` expected _no expected value_ _(none)_
    - :410 `expect` expected _no expected value_ _(none)_
    - :412 `expect` expected _no expected value_ _(none)_
    - :413 `toBe` expected `changes` _(expression)_
    - :414 `expect` expected _no expected value_ _(none)_
    - :415 `expect` expected _no expected value_ _(none)_
    - :420 `expect` expected _no expected value_ _(none)_
    - :421 `toBe` expected `changes` _(expression)_
    - :422 `toBe` expected `blocks * 63` _(expression)_
    - :424 `expect` expected _no expected value_ _(none)_
    - :429 `toContainText` expected `'LSB (spatial)'` _(literal)_
    - :430 `expect` expected _no expected value_ _(none)_
    - :433 `toBe` expected `blocks * 63` _(expression)_
    - :434 `expect` expected _no expected value_ _(none)_
- `a method that could not carry the payload is marked invalid, not ranked` — e2e/claims.spec.ts:447
    - :467 `expect` expected _no expected value_ _(none)_
    - :476 `expect` expected _no expected value_ _(none)_
    - :479 `expect` expected _no expected value_ _(none)_
    - :480 `expect` expected _no expected value_ _(none)_
    - :481 `toBe` expected `Number(m![3])` _(expression)_
    - :482 `expect` expected _no expected value_ _(none)_
    - :488 `expect` expected _no expected value_ _(none)_
    - :493 `expect` expected _no expected value_ _(none)_
    - :494 `expect` expected _no expected value_ _(none)_
    - :497 `expect` expected _no expected value_ _(none)_
- `extract recovers exactly the message that was embedded` — e2e/claims.spec.ts:503
    - :514 `toHaveClass` expected `/alert-success/` _(regex)_
    - :515 `toBe` expected `message` _(expression)_
    - :516 `expect` expected _no expected value_ _(none)_
- `a downloaded stego JPEG round-trips back through upload and extraction` — e2e/claims.spec.ts:523
    - :529 `toEqual` expected `Buffer.from([0xff, 0xd8])` _(expression)_
    - :531 `toEqual` expected `Buffer.from([0xff, 0xfe])` _(expression)_
    - :540 `toHaveClass` expected `/alert-success/` _(regex)_
    - :541 `toBe` expected `message` _(expression)_
- `empty message and empty key are refused by name` — e2e/claims.spec.ts:546
    - :551 `toHaveClass` expected `/alert-error/` _(regex)_
    - :552 `toBe` expected `'Message cannot be empty.'` _(literal)_
    - :553 `toHaveClass` expected `/hidden/` _(regex)_
    - :558 `toHaveClass` expected `/alert-error/` _(regex)_
    - :559 `toBe` expected `'Key cannot be empty.'` _(literal)_
    - :560 `toHaveClass` expected `/hidden/` _(regex)_
    - :563 `toBeEnabled` expected _no expected value_ _(none)_
    - :568 `toBe` expected `'Key cannot be empty.'` _(literal)_
    - :569 `toBeEnabled` expected _no expected value_ _(none)_
- `an over-capacity message is refused, and the refusal quotes the same budget as the banner` — e2e/claims.spec.ts:578
    - :584 `expect` expected _no expected value_ _(none)_
    - :591 `expect` expected _no expected value_ _(none)_
    - :592 `toHaveClass` expected `/alert-error/` _(regex)_
    - :595 `toBeEnabled` expected _no expected value_ _(none)_
    - :596 `toHaveClass` expected `/alert-error/` _(regex)_
    - :599 `expect` expected _no expected value_ _(none)_
    - :600 `expect` expected _no expected value_ _(none)_
    - :603 `toHaveClass` expected `/hidden/` _(regex)_
    - :604 `toHaveClass` expected `/hidden/` _(regex)_
    - :608 `expect` expected _no expected value_ _(none)_
    - :615 `expect` expected _no expected value_ _(none)_
- `the wrong key fails extraction and says why` — e2e/claims.spec.ts:618
    - :628 `toHaveClass` expected `/alert-error/` _(regex)_
    - :629 `toMatch` expected `/^Extraction failed: /` _(regex)_
    - :631 `toHaveLength` expected `1` _(literal)_
    - :632 `toMatch` expected `/HMAC|header|corrupt/i` _(regex)_
    - :633 `expect` expected _no expected value_ _(none)_
    - :638 `toBe` expected `'Only for the key holder.'` _(literal)_
- `a tampered stego JPEG fails the integrity check and says why` — e2e/claims.spec.ts:641
    - :657 `toHaveClass` expected `/alert-error/` _(regex)_
    - :658 `toMatch` expected `/^Extraction failed: /` _(regex)_
    - :659 `toMatch` expected `/HMAC|header|corrupt|invalid/i` _(regex)_
    - :660 `expect` expected _no expected value_ _(none)_
    - :666 `toBe` expected `'Integrity matters.'` _(literal)_
- `a stego JPEG stripped of its COM sideband reports the missing parameters` — e2e/claims.spec.ts:669
    - :676 `toEqual` expected `Buffer.from([0xff, 0xfe])` _(expression)_
    - :684 `toHaveClass` expected `/alert-error/` _(regex)_
    - :685 `toBe` expected _no expected value_ _(none)_
- `extracting with nothing loaded, and uploading a non-JPEG, both name the cause` — e2e/claims.spec.ts:690
    - :696 `toBe` expected _no expected value_ _(none)_
    - :708 `toHaveClass` expected `/alert-error/` _(regex)_
    - :709 `toMatch` expected `/could not be decoded as a JPEG|Failed to load stego JPEG/` _(regex)_
    - :718 `toContainText` expected `'Please upload a JPEG'` _(literal)_
    - :719 `toBeDisabled` expected _no expected value_ _(none)_
- `the embed verdict retires when ${name}` — e2e/claims.spec.ts:746
    - :751 `expect` expected _no expected value_ _(none)_
    - :756 `expect` expected _no expected value_ _(none)_
    - :757 `expect` expected _no expected value_ _(none)_
    - :758 `expect` expected _no expected value_ _(none)_
    - :759 `toHaveClass` expected `/alert-success/` _(regex)_
    - :762 `toHaveClass` expected `/hidden/` _(regex)_
    - :763 `toHaveClass` expected `/hidden/` _(regex)_
    - :764 `toHaveClass` expected `/hidden/` _(regex)_
    - :765 `expect` expected _no expected value_ _(none)_
    - :772 `expect` expected _no expected value_ _(none)_
    - :773 `expect` expected _no expected value_ _(none)_
    - :778 `expect` expected _no expected value_ _(none)_
- `loading a different cover retires the previous embed` — e2e/claims.spec.ts:782
    - :786 `toHaveClass` expected `/hidden/` _(regex)_
    - :791 `toHaveClass` expected `/hidden/` _(regex)_
    - :792 `toHaveClass` expected `/hidden/` _(regex)_
    - :793 `expect` expected _no expected value_ _(none)_
    - :794 `toHaveClass` expected `/hidden/` _(regex)_
- `an uploaded stego file wins over the embed still held in memory` — e2e/claims.spec.ts:801
    - :814 `toBe` expected `'The uploaded one.'` _(literal)_
- `reset clears the session and the page still works afterwards` — e2e/claims.spec.ts:819
    - :825 `toHaveClass` expected `/hidden/` _(regex)_
    - :826 `toHaveClass` expected `/hidden/` _(regex)_
    - :827 `toHaveClass` expected `/hidden/` _(regex)_
    - :828 `toBe` expected `''` _(literal)_
    - :829 `toBe` expected `''` _(literal)_
    - :830 `toBe` expected `'0.1'` _(literal)_
    - :831 `toBe` expected `'0.10 bpnzac'` _(literal)_
    - :834 `toBeEnabled` expected _no expected value_ _(none)_
    - :839 `toBe` expected `'After reset.'` _(literal)_
- `the embed button keeps its shipped label across runs` — e2e/claims.spec.ts:842
    - :846 `expect` expected _no expected value_ _(none)_
    - :851 `toBe` expected `label` _(expression)_
    - :852 `expect` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-j-uniward

## What It Is

*An interactive research lab that teaches why adaptive steganography works.*

Browser-native implementation of **J-UNIWARD** (JPEG Universal Wavelet Relative Distortion) — a foundational and widely used benchmark for adaptive JPEG steganography. Implements the pipeline from Holub, Fridrich & Denemark, *Universal distortion function for steganography in an arbitrary domain* (EURASIP Journal on Information Security 2014:1; conference version ACM IH&MMSec 2013):

- **Cost function:** the published UNIWARD distortion, as defined. The cost of changing a DCT coefficient is the sum of *relative* changes of every wavelet coefficient in the **three first-level undecimated** directional subbands (LH, HL, HH) — built from the Daubechies-8 (`db8`, 16-tap) low-pass/high-pass pair as the outer products K⁽¹⁾ = h·gᵀ, K⁽²⁾ = g·hᵀ, K⁽³⁾ = g·gᵀ — with the stabilizing constant **σ = 2⁻⁶** the paper selects for J-UNIWARD. Nothing is decimated and there is no second or third decomposition level. It is evaluated in closed form: because the undecimated transform is shift-invariant and both the filter bank and the DCT basis are outer products, the ripple factorises along each axis. So it runs in well under a second *and* is the literal definition rather than an approximation of it — the test suite pins it against a brute-force implementation that perturbs actual pixels and re-runs the transform, and the two agree to ~1e-12 relative, at the image boundary as well as inside.
- **Embedding:** Syndrome coding with a 12-bit constraint height (4096 states), solved exactly by Viterbi search (Filler, Judas & Fridrich 2011). The payload is spread across the whole image by a keyed permutation over the full AC coefficient pool. **The search is optimal within each 12-bit syndrome block over its own window of carriers, not across the whole image**: the trellis restarts every 12 message bits rather than running one shifted parity-check matrix along the full carrier stream, so this is block-optimal syndrome embedding rather than the long shifted-submatrix STC construction of the paper. That restart is also why the placement comparison below does not always come out in J-UNIWARD's favour.
- **Key schedule:** PBKDF2-SHA-256 (600k iterations) → HKDF domain separation → AES-CTR hat matrix + Fisher-Yates permutation. HMAC-SHA-256 integrity tag; a real embed→download→upload→extract round-trip recovers the message and verifies the tag.
- **Steganalysis:** Three-way comparison (LSB vs F5 vs J-UNIWARD) at the same payload, with each method's *actually carried* bit count reported — F5 exhausts the non-zero ACs on smooth covers and its comparison is then marked invalid rather than ranked. LSB's spatial edits are re-projected into the quantized DCT domain via a real forward DCT, then every method's changes are ranked against the cost map by *where they land* — the distortion that actually predicts detectability — plus a DCT histogram view (with the cover distribution overlaid so the F5 shrinkage tell is visible).

Everything runs locally in your browser. No backends and no simulated math: the cost map, the coefficient edits, the JPEG round trip and the extraction are all computed. The comparison ratings and the STC schematic are teaching models.

**The comparison is not rigged in J-UNIWARD's favour, and it does not always favour it.** Measured with this repo's own engine across the three bundled covers and six rates, F5's *per-change* mean exposure is lower than J-UNIWARD's in 13 of the 15 (cover, rate) states measured — 9 of the 11 in which F5 carried the whole payload, and all 4 of the ones in which it did not — including the shipped 0.10 bpnzac default on `sample-grass.jpg` (J-UNIWARD 7.1%, F5 4.5%). The reason is structural and worth teaching: F5 only ever edits non-zero AC coefficients, and those are already the cheap textured ones, while J-UNIWARD's carrier pool is *every* AC coefficient, zeros included, so each 12-bit syndrome block sometimes has to spend on a flatter coefficient. J-UNIWARD makes far fewer changes and leaves no shrinkage tell; on summed distortion — the objective it actually minimises — it wins at 0.10 bpnzac on both textured covers (grass 6.6e4 against F5's 1.0e5; portrait 5.9e4 against 1.7e5) and loses at 0.40. The panel prints the ordering it measured for your run instead of asserting one.

### Teaching scaffolding (progressive disclosure)

Built for both a newcomer meeting adaptive steganography for the first time and a cryptographer after the subtle details:

1. **Plain-English glossary layer** — load-bearing jargon (`bpnzac`, `DCT`, `wavelet`, `AC`/`DC`, `STC`/`Viterbi`, `shrinkage`) is gated behind a one-line hover/focus gloss wherever it first appears, so the raw acronym never lands cold.
2. **"Inside the cost" block probe** — click any 8×8 block on the cover image to nudge it by a +1 DCT step and watch the ripple hit the three undecimated wavelet detail subbands, with the *cover-magnitude denominator* shown next to each — so you *see* why busy texture yields low normalized cost. Computed live from the same Daubechies-8 transform the embedder uses; no faked numbers.
3. **F5 shrinkage annotation** — the DCT histogram overlays the cover distribution and rings/arrows the suppressed ±1 buckets, pointing directly at the tell the demo names.
4. **STC / Viterbi schematic** — a stepped walkthrough of the keyed permutation spreading the payload, then the trellis choosing the cheapest minimum-distortion flip-set for each 12-bit block of the message.
5. **Placement-proxy framing** — the change-exposure bars are labelled *placement proxy — not a detector* at the point of use, each paired with a one-line "what a real detector would see" note, so a low bar is never misread as "provably safe."

## When to Use It

- Teaching *why* adaptive steganography resists detection better than naive LSB or F5 embedding.
- Walking through the J-UNIWARD pipeline end to end — wavelet cost map, STC embedding, keyed spreading, and round-trip extraction.
- Comparing steganographic methods at equal payload to see *where* each one's changes land relative to image texture.
- Do NOT use it to hide data in adversarial settings — it is a teaching and portfolio demo, not an undetectable channel.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-j-uniward](https://systemslibrarian.github.io/crypto-lab-j-uniward/)**

Load a sample image or your own JPEG, enter a secret message and shared key, and embed with J-UNIWARD while a live panel compares LSB, F5, and J-UNIWARD at the same payload — showing where each method's changes land on the wavelet cost terrain, change-exposure bars, DCT histograms, and low/medium/high objective-exposure bands. A 10× amplified difference map visualizes the edits, a carrier-density readout shows how much of the AC pool is non-zero, and a full embed → download → upload → extract round-trip recovers the message and checks its integrity tag.

## What Can Go Wrong

- **Placement is a proxy, not a detector.** The analysis measures *where* changes land relative to texture — the quantity J-UNIWARD minimizes — which predicts resistance better than any single first-order test. It is not itself a steganalyzer; real-world detection (SRM, SRNet, XuNet) uses deep learning on rich feature sets.
- **Higher payloads spend costlier coefficients.** As the rate rises the cheap textured coefficients run out, so the average change lands in a costlier spot — measured on `sample-grass.jpg`, J-UNIWARD's mean exposure climbs 7.1% → 11.7% → 17.0% → 21.8% → 27.7% from 0.10 to 0.50 bpnzac, and its worst single placement reaches the 96th percentile at 0.50. There is no universally safe payload; the panel shows the climb for your cover rather than naming a threshold.
- **COM marker sideband.** Salt, rate, and payload length are stored in a JPEG COM marker for extraction. This metadata may be stripped by image pipelines or social media compression — and it makes any file this demo produces trivially identifiable by a metadata scanner, without touching a single DCT coefficient. It exists so the browser round trip is reproducible, not because it is covert.
- **Fragile, not robust.** This is fragile steganography, not watermarking. The payload lives in the exact stego DCT coefficients, so recompression, quality-factor changes, resizing, cropping, rotation, or lossless JPEG optimization all alter those coefficients and break extraction. The recipient generally needs the original stego JPEG bytes.
- **Not "undetectable," and not automatically the winner here.** Placement is what this lab measures, and on that measure F5's per-change average often beats J-UNIWARD's (see above). Real statistical security is established with trained detectors over image corpora, not by grading an algorithm against its own objective.
- **Educational tool.** This is a teaching and portfolio demo, not suitable for adversarial environments.

## Real-World Usage

- J-UNIWARD is a standard academic benchmark for adaptive JPEG steganography, introduced by Holub & Fridrich (2013) and widely used to evaluate embedding and detection methods.
- Syndrome-Trellis Codes (STC), the minimal-distortion coding layer used here, are the reference embedding technique across modern steganography research.
- Modern steganalysis — rich-model features (SRM) and deep-learning detectors such as SRNet and XuNet — is developed and benchmarked against schemes like J-UNIWARD.
- The wavelet-distortion idea generalizes to the broader UNIWARD family (S-UNIWARD for spatial, SI-UNIWARD for side-informed embedding) used across image formats.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-j-uniward
cd crypto-lab-j-uniward
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-stego-suite](https://systemslibrarian.github.io/crypto-lab-stego-suite/) — LSB, DCT, and adaptive embedding with chi-squared steganalysis, the broader steganography toolkit.
- [crypto-lab-oram-vault](https://systemslibrarian.github.io/crypto-lab-oram-vault/) — Path ORAM hiding *access patterns*, a different flavor of information hiding.
- [crypto-lab-oblivious-shelf](https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/) — private information retrieval that hides *which* item is read.
- [crypto-lab-patron-shield](https://systemslibrarian.github.io/crypto-lab-patron-shield/) — information-theoretic PIR over XOR secret sharing, another query-hiding scheme.

## Quick Start

Click **▶ Quick Demo** on the live site — it loads a sample image, prefills a message, and scrolls you straight to the embed step. Or follow the guided workflow:

1. **Load** a sample image or upload your own JPEG
2. **Enter** a secret message and shared key
3. **Embed** with J-UNIWARD and watch the analysis panel compare three methods

## Key Features

| Feature | Description |
|---------|-------------|
| Adaptive placement | Changes land in high-texture DCT blocks — harder to detect |
| Payload presets | Conservative (0.10), Balanced (0.20), Aggressive (0.40) bpnzac |
| Embedding summary | Payload size, actual rate, carriers used, distortion, metadata status |
| Visual comparison | Side-by-side cover/stego + 10× amplified difference map |
| Live steganalysis | Change-exposure bars (labelled *placement proxy — not a detector*), the measured ordering for the run, per-method carried-bit accounting, "where changes landed" map over the cost terrain, DCT histograms, low/medium/high objective-exposure bands (not a detector verdict) |
| Cost-mechanism probe | Click any block to see the ±1 wavelet ripple across the three directional subbands and the cover-magnitude denominator that makes texture cheap |
| Jargon glossary | Hover/focus one-line plain-English glosses for bpnzac, DCT, wavelet, AC/DC, STC/Viterbi, shrinkage |
| STC/Viterbi schematic | Stepped walkthrough of keyed spreading → candidate flip-sets → minimum-distortion choice |
| F5 shrinkage callout | Cover histogram overlaid with the ±1 shrinkage buckets ringed and arrowed |
| Method explanations | Teaching text explains *why* each method is more or less detectable, with a "what a real detector would see" note |
| Carrier density | Non-zero AC count and share of the AC pool — the bpnzac denominator, printed with the badge it drove |
| Round-trip verification | Embed → download → upload → extract with integrity check |

## Architecture

`​``
src/
├── main.ts              # Thin orchestrator
├── state/
│   └── app-state.ts     # Central state
├── ui/
│   ├── theme.ts         # Dark/light toggle
│   ├── dropzone.ts      # Image upload + samples
│   ├── embed-panel.ts   # Embed tab + controls
│   ├── extract-panel.ts # Extract tab
│   ├── analysis-panel.ts# Steganalysis comparison
│   ├── glossary.ts      # Plain-English jargon on-ramp (hover/focus glosses)
│   ├── mechanism-panel.ts # "Inside the cost" per-block wavelet probe
│   ├── stc-walkthrough.ts # STC / Viterbi stepped schematic
│   └── renderers.ts     # Canvas drawing + alerts
├── codec/
│   └── JpegCodec.ts     # Custom JPEG DCT codec
├── steg/
│   ├── Embedder.ts      # J-UNIWARD embed
│   ├── Extractor.ts     # STC extract
│   └── WaveletCost.ts   # J-UNIWARD (UNIWARD) wavelet cost function
├── analysis/
│   └── StegAnalysis.ts  # Chi-square, histograms, comparison
├── stc.ts               # STC Viterbi embed/extract
├── stc-keys.ts          # AES-CTR hat matrix + permutation
└── kdf.ts               # PBKDF2 + HKDF key derivation
`​``

## Testing

`​``bash
npm test         # core correctness suite (DCT roundtrip, embed↔extract, analysis)
npm run build    # typecheck + production build
`​``

`npm test` exercises the real pipeline end-to-end — decode → cost map → embed → JPEG encode → re-decode → extract — plus the forward/inverse DCT and the steganalysis ordering. Run `SLOW=1 npm test` to additionally validate the fast cost map against the reference implementation.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Regex Veil — FTE

- **slug**: `crypto-lab-fte`
- **repo**: https://github.com/systemslibrarian/crypto-lab-fte
- **live**: https://systemslibrarian.github.io/crypto-lab-fte/
- **commit_sha**: `61ddd7ec855d2482ee17d5d557df8bd101a75ea0` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `2551a335a2221fff331912eef80e299e4cc1ca3c`
- **read_from**: working tree (clean)
- **category**: STEGANOGRAPHY | ENCRYPTION  ·  **level**: advanced  ·  **--accent**: #9f88ff
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Format-Transforming Encryption  — _read from src/ui/template.ts_

**Subtitle**: FTE · regex-ranked steganography · FF1 (NIST SP 800-38G)  — _read from src/ui/template.ts_

**Description**: Compile a regular expression to a minimal DFA, count its length-n language exactly, and encipher real AES-CTR ciphertext into that count — so the output is a uniformly random member of the language, and a regex classifier watching the wire sees a phone number.  — _read from src/ui/template.ts_

**Why it matters**: Censorship systems and DPI middleboxes classify traffic by what it looks like. FTE was built to answer that: it makes ciphertext satisfy the classifier's own regex, exactly and provably, without weakening the cipher underneath.  — _read from src/ui/template.ts_

**Card copy**: Compiles a regex to a minimal DFA, counts its length-n language exactly, and enciphers real AES-CTR bytes into that slice with FF1 — output a DPI rule accepts, plus the substitution attack proving nothing is authenticated.

**Chips**: FF1 · DFA Ranking · Cycle Walking · AES-256-CTR

**Implements**: AES `src/ff1.ts:86`, AES-CBC `src/ff1.ts:90`, AES-CTR `src/keys.ts:106`, ECDH `src/handshake.ts:75`, FF1 `src/aead.ts:54`, Format-transforming encryption `src/aead.ts:45`, HKDF `src/schedule.ts:76`, HMAC `src/schedule.ts:156`, P-256 `src/handshake.ts:75`, PBKDF2 `src/schedule.ts:42`, SHA-256 `src/handshake.ts:143`, X25519 `src/handshake.ts:75`

**Attacks shown**: Brute force `README.md:402`, Known-plaintext attack `README.md:532`

**Comment-only (named in code comments, not executed)**: Diffie-Hellman `src/handshake.ts:30`, EC point arithmetic `src/rank.ts:22`, Pairing `src/pathtrace.ts:6`

**References**: EC point arithmetic, MD5, SHA-384

**Standards body**: IETF, NIST

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `eprint.iacr.org/2009/251` — first seen README.md:351 (1×)
- `eprint.iacr.org/2012/494` — first seen README.md:354 (1×)
- `ISO/IEC 7816-4` — first seen src/aead.ts:134 (1×)
- `NIST SP 800-38G` — first seen README.md:5 (5×)
- `RFC 1918` — first seen src/decoys.ts:67 (1×)
- `RFC 6479` — first seen src/replay.ts:11 (1×)
- `SP 800-38G` — first seen README.md:355 (4×)
- `SP 800-38G Rev. 1` — first seen README.md:238 (4×)

**README — What Can Go Wrong**:

```text
- **Salt reuse is a two-time pad.** AES-CTR here runs from an all-zero counter block. That is
  safe *only* because a fresh 16-byte salt is drawn on every encode, so the AES-256 key is never
  reused. Encrypt two different messages under the same passphrase **and** the same salt and the
  keystream repeats. The UI generates a new salt every time for exactly this reason, and displays
  the salt rather than hiding it so the reuse is visible if it ever happens. Do not lift
  `keys.ts` into anything that reuses a salt.
- **Lose the salt, the pattern or `n` and the message is gone.** None of the three fit inside the
  stego string. That is a real cost of FTE, not a shortcut taken here.
- **A message that does not fit grows `n`.** The encoder picks the shortest length that holds the
  payload and tells you it did, rather than silently changing the format — but a longer message
  then produces a visibly longer string. See "Length leakage" below.
- **Decode failures are not integrity checks, and the frame byte is weaker than it looks.** The
  `0x01` byte exists so that a big-endian integer can remember its leading zero bytes. The obvious
  guess — that a wrong key passes it 1 time in 256 — is wrong, because the leading byte of a
  *minimal* big-endian encoding is not uniform over `0..255`. A wrong passphrase lands uniformly in
  `[0, N)`, and the fraction of that range beginning with `0x01` is a property of `N`:
  **0.431 for the phone preset** (all of `[2^32, 2^33)` is inside `[0, 10^10)`), 0.0043 for IPv4,
  and `1/255` for hex and base64 — the last two only because their `N` is an exact power of 256,
  which is the coincidence that makes the folklore number sound right. `src/fte.test.ts` computes
  all four in closed form. The strict UTF-8 decode behind it catches most of what gets through;
  "most" is not a security property, and a check whose strength swings by two orders of magnitude
  depending on whether the format happens to be byte-aligned is exactly what a MAC is not.
  End to end on the phone preset, roughly **one wrong passphrase in thirty** clears both checks and
  returns four bytes of plausible-looking garbage rather than an error. The page says so in the
  decode panel. What never happens is recovering the real message: confidentiality is a property
  of AES, and it does not depend on any of this.
- **The ranking order is code-point order, not the format's own order.** For
  `[A-Za-z0-9+/]{64}`, index 0 is 64 `+` characters and index `N-1` is 64 `z` characters, because
  `+` is `0x2B` and `z` is `0x7A`. Base64's own alphabet order is irrelevant to the bijection.
- **Some patterns are rejected, on purpose.** Under 8 bits of capacity at every length up to
  `n_max` ("a format has to have choices in it to hide anything"); over 4096 DFA states, which
  `[ab]*a[ab]{20}` reaches because subset construction is exponential in the worst case; a count
  table over 50 MB; a language slice under the FF1 minimum domain of `10^6`.
```

**Claims tested** (e2e/claims.spec.ts, 86 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:35
    - :35 `toContainText` expected `'Compiled.'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:44
    - :44 `toHaveClass` expected `/is-working/, { timeout: 120_000 }` _(expression)_
- `the format panel agrees with itself` — e2e/claims.spec.ts:51
- `every preset label matches the capacity the DFA actually computes` — e2e/claims.spec.ts:52
    - :61 `toBe` expected `4` _(literal)_
    - :65 `expect` expected _no expected value_ _(none)_
    - :69 `toContainText` expected `'Compiled.'` _(literal)_
    - :70 `toHaveValue` expected `n` _(expression)_
    - :71 `toHaveText` expected `'${bits} bits'` _(expression)_
- `capacity is floor(log2 N), re-derived from the N the page printed` — e2e/claims.spec.ts:75
    - :80 `toMatch` expected `/^\d+$/` _(regex)_
    - :82 `toBe` expected `'${floorLog2(BigInt(printedN))} bits'` _(expression)_
    - :84 `toBe` expected `10n ** 10n` _(expression)_
- `the highlighted count-table row is the row the stat grid describes` — e2e/claims.spec.ts:87
    - :90 `toHaveCount` expected `1` _(literal)_
    - :93 `toBe` expected `await page.inputValue('#length')` _(expression)_
    - :94 `toBe` expected `await text(page, 'stat-total')` _(expression)_
    - :95 `toBe` expected `await text(page, 'stat-capacity')` _(expression)_
- `the count table is C[q0][k] = 16^k for hex, checked in closed form` — e2e/claims.spec.ts:98
    - :101 `toContainText` expected `'Compiled.'` _(literal)_
    - :107 `toBe` expected `22` _(literal)_
    - :112 `toBe` expected `'${floorLog2(expected)} bits'` _(expression)_
    - :115 `toBe` expected `'32'` _(literal)_
    - :116 `toBe` expected `'128 bits'` _(literal)_
- `the SVG draws one circle per state plus one per accepting state` — e2e/claims.spec.ts:119
    - :133 `toBe` expected `await text(page, 'stat-states')` _(expression)_
    - :134 `toHaveCount` expected `states.size + accepting.size` _(expression)_
- `the display cap is applied to the state count the page itself reports` — e2e/claims.spec.ts:137
    - :146 `toContainText` expected `'Compiled.'` _(literal)_
    - :147 `toBe` expected `'65'` _(literal)_
    - :148 `expect` expected _no expected value_ _(none)_
    - :149 `toHaveCount` expected `0` _(literal)_
    - :150 `toHaveText` expected `'Layout: not drawn'` _(literal)_
    - :152 `toBe` expected `'384 bits'` _(literal)_
    - :153 `expect` expected _no expected value_ _(none)_
    - :158 `toHaveValue` expected `'custom'` _(literal)_
    - :159 `toBe` expected `'64'` _(literal)_
    - :160 `toHaveCount` expected `65` _(literal)_
- `a pattern that stops compiling clears the drawing, not just the numbers` — e2e/claims.spec.ts:163
    - :168 `toHaveCount` expected `16` _(literal)_
    - :171 `toHaveValue` expected `'custom'` _(literal)_
    - :172 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :177 `toBe` expected `'—'` _(literal)_
    - :178 `expect` expected _no expected value_ _(none)_
    - :179 `toHaveCount` expected `0` _(literal)_
    - :180 `toHaveCount` expected `0` _(literal)_
    - :181 `toHaveText` expected `'Layout: —'` _(literal)_
    - :184 `toHaveCount` expected `1` _(literal)_
    - :185 `toHaveCount` expected `1` _(literal)_
    - :186 `expect` expected _no expected value_ _(none)_
    - :190 `toContainText` expected `'Compiled.'` _(literal)_
    - :191 `toHaveCount` expected `34` _(literal)_
- `nothing carries a hidden attribute while still being visible` — e2e/claims.spec.ts:194
    - :205 `toEqual` expected `[]` _(expression)_
- `the CDN scripts are an enhancement, not a dependency` — e2e/claims.spec.ts:209
- `with jsDelivr blocked outright, the automaton still draws and the page says so` — e2e/claims.spec.ts:210
    - :220 `toHaveText` expected `'Layout: built-in'` _(literal)_
    - :223 `toHaveCount` expected `16` _(literal)_
    - :224 `expect` expected _no expected value_ _(none)_
    - :230 `toMatch` expected `/^\(\d{3}\) \d{3}-\d{4}$/` _(regex)_
- `the encode path tells the truth` — e2e/claims.spec.ts:234
- `the stego string is a member of the language, per the platform regex engine` — e2e/claims.spec.ts:235
    - :242 `toContainText` expected `'Encoded.'` _(literal)_
    - :245 `toBe` expected `PHONE` _(expression)_
    - :248 `toBe` expected `true` _(expression)_
    - :249 `toBe` expected `await page.inputValue('#length')` _(expression)_
- `the capacity bar figures are the message bytes and the printed capacity` — e2e/claims.spec.ts:252
    - :260 `expect` expected _no expected value_ _(none)_
    - :263 `toBe` expected `8 * (new TextEncoder().encode(message).length + 1)` _(expression)_
    - :264 `toBe` expected `await text(page, 'stat-capacity')` _(expression)_
    - :265 `toHaveAttribute` expected _no expected value_ _(none)_
- `the step trace quotes the same N the stat grid does, and lands inside it` — e2e/claims.spec.ts:271
    - :281 `toBe` expected `6` _(literal)_
    - :284 `expect` expected _no expected value_ _(none)_
    - :286 `toBe` expected `await text(page, 'stat-total')` _(expression)_
    - :287 `toBe` expected `await text(page, 'stat-capacity')` _(expression)_
    - :292 `expect` expected _no expected value_ _(none)_
    - :293 `expect` expected _no expected value_ _(none)_
- `n grows to exactly the length the payload needs, and says so` — e2e/claims.spec.ts:296
    - :302 `toHaveValue` expected `'custom'` _(literal)_
    - :303 `toHaveText` expected `'513'` _(literal)_
    - :316 `toContainText` expected _no expected value_ _(none)_
    - :319 `toBe` expected `String(expectedN)` _(expression)_
    - :320 `toBe` expected `expectedN` _(expression)_
- `an over-capacity message is refused, and the refusal names the real ceiling` — e2e/claims.spec.ts:323
    - :329 `toHaveClass` expected `/is-over/` _(regex)_
    - :335 `expect` expected _no expected value_ _(none)_
    - :336 `toBe` expected `'33 bits'` _(literal)_
    - :338 `toHaveClass` expected `/is-empty/` _(regex)_
- `the decode path tells the truth` — e2e/claims.spec.ts:342
- `the round trip returns the exact message` — e2e/claims.spec.ts:343
    - :346 `toContainText` expected `'Compiled.'` _(literal)_
    - :352 `toContainText` expected `'Encoded.'` _(literal)_
    - :357 `toBe` expected `message` _(expression)_
- `the decode status quotes an index genuinely inside the printed N` — e2e/claims.spec.ts:360
    - :371 `expect` expected _no expected value_ _(none)_
    - :373 `toBe` expected `await text(page, 'stat-total')` _(expression)_
    - :374 `expect` expected _no expected value_ _(none)_
    - :379 `toBe` expected `BigInt(index)` _(expression)_
- `each failure path fails, and the page names the actual cause` — e2e/claims.spec.ts:382
    - :395 `toContainText` expected `'Compiled.'` _(literal)_
    - :407 `toMatch` expected _no expected value_ _(none)_
    - :410 `toHaveClass` expected `/is-empty/` _(regex)_
    - :416 `expect` expected _no expected value_ _(none)_
    - :417 `toHaveClass` expected `/is-empty/` _(regex)_
    - :423 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :424 `expect` expected _no expected value_ _(none)_
    - :428 `expect` expected _no expected value_ _(none)_
    - :436 `expect` expected _no expected value_ _(none)_
    - :442 `expect` expected _no expected value_ _(none)_
- `a wrong key never returns the real message, even when it is not rejected` — e2e/claims.spec.ts:445
    - :465 `toBe` expected `'hi'` _(literal)_
    - :473 `toBe` expected `'hi'` _(literal)_
- `stale results are retired, and only when they are stale` — e2e/claims.spec.ts:477
- `changing the format retires the stego string and says so` — e2e/claims.spec.ts:478
    - :483 `toHaveClass` expected `/is-empty/` _(regex)_
    - :486 `toHaveClass` expected `/is-empty/` _(regex)_
    - :487 `expect` expected _no expected value_ _(none)_
    - :488 `toBeDisabled` expected _no expected value_ _(none)_
    - :489 `toBeDisabled` expected _no expected value_ _(none)_
- `changing n alone also retires it` — e2e/claims.spec.ts:492
    - :495 `toHaveValue` expected `'custom'` _(literal)_
    - :496 `toHaveText` expected `'65'` _(literal)_
    - :501 `toHaveClass` expected `/is-empty/` _(regex)_
    - :504 `toHaveClass` expected `/is-empty/` _(regex)_
    - :505 `expect` expected _no expected value_ _(none)_
- `no-op guard: re-selecting the SAME preset must not retire a fresh result` — e2e/claims.spec.ts:508
    - :516 `expect` expected _no expected value_ _(none)_
    - :520 `toBe` expected `stego` _(expression)_
    - :521 `expect` expected _no expected value_ _(none)_
    - :522 `toBeEnabled` expected _no expected value_ _(none)_
- `the n the encoder grew into is not treated as a change` — e2e/claims.spec.ts:525
    - :528 `toHaveValue` expected `'custom'` _(literal)_
    - :529 `toHaveText` expected `'513'` _(literal)_
    - :536 `expect` expected _no expected value_ _(none)_
    - :537 `toHaveClass` expected `/is-empty/` _(regex)_
    - :538 `toBeEnabled` expected _no expected value_ _(none)_
- `the classifier tells the truth about the adversary` — e2e/claims.spec.ts:548
- `the verdicts match what the platform regex engine says about the printed payloads` — e2e/claims.spec.ts:549
    - :556 `toContainText` expected `'Encode a message first'` _(literal)_
    - :559 `toBe` expected `PHONE` _(expression)_
    - :568 `toHaveLength` expected `3` _(literal)_
    - :576 `expect` expected _no expected value_ _(none)_
- `the stego string passes the same rule the raw ciphertext fails` — e2e/claims.spec.ts:580
    - :594 `expect` expected _no expected value_ _(none)_
    - :595 `toHaveLength` expected `2` _(literal)_
    - :596 `expect` expected _no expected value_ _(none)_
    - :597 `toContainText` expected `'entire product'` _(literal)_
- `a rule sharper than the format flags the stego string, and the page admits it` — e2e/claims.spec.ts:604
    - :622 `expect` expected _no expected value_ _(none)_
    - :623 `toContainText` expected `'honest limit'` _(literal)_
- `resetting restores the format regex and the textbook result` — e2e/claims.spec.ts:626
    - :635 `toBe` expected `PHONE` _(expression)_
    - :636 `toContainText` expected `'both raw encodings dropped'` _(literal)_
- `the pipeline and the cycle walk quote the encode they came from` — e2e/claims.spec.ts:640
- `every pipeline node carries a value the trace also reports` — e2e/claims.spec.ts:641
    - :648 `toBe` expected `stego` _(expression)_
    - :650 `expect` expected _no expected value_ _(none)_
    - :651 `expect` expected _no expected value_ _(none)_
    - :653 `toBe` expected `'—'` _(literal)_
- `the walk draws exactly as many landings as the status line counts` — e2e/claims.spec.ts:657
    - :666 `expect` expected _no expected value_ _(none)_
    - :670 `toBe` expected `steps` _(expression)_
    - :673 `toBe` expected `1` _(literal)_
    - :674 `toBe` expected `steps - 1` _(expression)_
    - :675 `toContainText` expected `'FF1 application'` _(literal)_
- `the highlighted path is the path the string actually walks` — e2e/claims.spec.ts:679
- `the scrubber spans the string, and each step names a real transition` — e2e/claims.spec.ts:680
    - :687 `toBe` expected `String(stego.length)` _(expression)_
    - :688 `toBe` expected `stego.length` _(expression)_
    - :702 `expect` expected _no expected value_ _(none)_
    - :703 `expect` expected _no expected value_ _(none)_
    - :706 `toContainText` expected `'accepting state'` _(literal)_
- `the highlight marks exactly one current state, and only states on the path` — e2e/claims.spec.ts:709
    - :717 `toBe` expected `1` _(literal)_
    - :720 `expect` expected _no expected value_ _(none)_
    - :721 `expect` expected _no expected value_ _(none)_
    - :725 `toContainText` expected `'start state'` _(literal)_
    - :726 `toBe` expected `1` _(literal)_
- `the in-page NIST vectors are the ones the test suite runs` — e2e/claims.spec.ts:730
- `nine rows, none failing, and the unsupported ones say why` — e2e/claims.spec.ts:731
    - :746 `toHaveLength` expected `9` _(literal)_
    - :747 `toEqual` expected `[]` _(expression)_
    - :753 `toBe` expected `row.expected` _(expression)_
    - :755 `toBe` expected `'UNSUPPORTED'` _(literal)_
    - :756 `expect` expected _no expected value_ _(none)_
    - :760 `toHaveLength` expected `3` _(literal)_
    - :761 `toContainText` expected `'6 of 9'` _(literal)_
- `spot the fake deals real unrankings` — e2e/claims.spec.ts:765
- `every candidate is a member of the language the page compiled` — e2e/claims.spec.ts:766
    - :773 `expect` expected _no expected value_ _(none)_
    - :780 `toBe` expected `true` _(expression)_
    - :782 `toBe` expected `values.length` _(expression)_
- `the reveal scores against the truth and names a tell for every candidate` — e2e/claims.spec.ts:785
    - :795 `expect` expected _no expected value_ _(none)_
    - :796 `toBe` expected `count` _(expression)_
    - :799 `expect` expected _no expected value_ _(none)_
    - :804 `toEqual` expected `[]` _(expression)_
    - :805 `expect` expected _no expected value_ _(none)_
    - :806 `expect` expected _no expected value_ _(none)_
- `the game declines to invent a corpus for hex, and says why` — e2e/claims.spec.ts:809
    - :812 `toContainText` expected `'Compiled.'` _(literal)_
    - :814 `toContainText` expected `'no such thing as a realistic random hex'` _(literal)_
    - :815 `toBe` expected `0` _(literal)_
- `the shareable link carries state and never carries secrets` — e2e/claims.spec.ts:819
- `the fragment restores pattern, n and message in a fresh page` — e2e/claims.spec.ts:820
    - :823 `toContainText` expected `'Compiled.'` _(literal)_
    - :828 `expect` expected _no expected value_ _(none)_
    - :832 `toContainText` expected `'Compiled.'` _(literal)_
    - :833 `toBe` expected `'[0-9a-f]{32}'` _(literal)_
    - :834 `toBe` expected `'shared'` _(literal)_
    - :835 `toBe` expected `'32'` _(literal)_
- `a real passphrase and the salt are provably absent from the URL` — e2e/claims.spec.ts:839
    - :849 `expect` expected _no expected value_ _(none)_
    - :853 `expect` expected _no expected value_ _(none)_
    - :854 `expect` expected _no expected value_ _(none)_
- `out-of-range and unknown fragment fields are ignored, not applied` — e2e/claims.spec.ts:863
    - :865 `toContainText` expected `'Compiled.'` _(literal)_
    - :867 `toBe` expected `PHONE` _(expression)_
    - :868 `toBe` expected `'14'` _(literal)_
    - :870 `toBeHidden` expected _no expected value_ _(none)_
    - :872 `expect` expected _no expected value_ _(none)_
    - :874 `toBe` expected `''` _(literal)_
- `a fragment carrying an uncompilable pattern fails visibly and stays usable` — e2e/claims.spec.ts:877
    - :881 `toHaveAttribute` expected `'aria-invalid', 'true'` _(expression)_
    - :882 `toBeDisabled` expected _no expected value_ _(none)_
    - :883 `toBeHidden` expected _no expected value_ _(none)_
    - :887 `toContainText` expected `'Compiled.'` _(literal)_
    - :888 `toBeEnabled` expected _no expected value_ _(none)_
- `the guided path ends where it should` — e2e/claims.spec.ts:892
- `seven steps, and the last one is the honest limitations` — e2e/claims.spec.ts:893
    - :896 `toBeVisible` expected _no expected value_ _(none)_
    - :897 `toBe` expected `'7'` _(literal)_
    - :900 `toBe` expected `String(step)` _(expression)_
    - :903 `toBe` expected `'7'` _(literal)_
    - :904 `toContainText` expected `'Spot the fake'` _(literal)_
    - :905 `toContainText` expected `'honest'` _(literal)_
    - :909 `toBeHidden` expected _no expected value_ _(none)_
- `the hero encoder cannot disagree with the panel below it` — e2e/claims.spec.ts:913
- `one encode, one stego string, shown in both places` — e2e/claims.spec.ts:914
    - :923 `toBe` expected `panel` _(expression)_
    - :924 `toBe` expected `'hi'` _(literal)_
    - :927 `toBe` expected `true` _(expression)_
- `length leakage is shown, not just asserted` — e2e/claims.spec.ts:937
- `a fixed-length preset is one bucket, and the page says it leaks nothing` — e2e/claims.spec.ts:938
    - :942 `toContainText` expected `'leaks nothing about the message size'` _(literal)_
    - :950 `toBe` expected `1` _(literal)_
    - :951 `toBe` expected `'14 characters'` _(literal)_
- `a variable-length pattern separates every size, and the ladder matches closed form` — e2e/claims.spec.ts:954
    - :959 `toContainText` expected `'Compiled.'` _(literal)_
    - :960 `toContainText` expected `'distinct wire lengths'` _(literal)_
    - :972 `toBe` expected `8 * (row.bytes + 1)` _(expression)_
    - :973 `toBe` expected `String(2 * (row.bytes + 1))` _(expression)_
- `the chosen n is highlighted in the ladder, as it is in the count table` — e2e/claims.spec.ts:977
    - :982 `expect` expected _no expected value_ _(none)_
- `the substitution attack runs for real` — e2e/claims.spec.ts:986
- `no substitution ever returns the message that was sent` — e2e/claims.spec.ts:987
    - :996 `toContainText` expected `'None returned your message'` _(literal)_
    - :1001 `toBe` expected `'"hi"'` _(literal)_
- `every substituted string is a genuine member of the language` — e2e/claims.spec.ts:1004
    - :1018 `expect` expected _no expected value_ _(none)_
    - :1020 `toBe` expected `true` _(expression)_
    - :1022 `toBe` expected `original` _(expression)_
- `the three outcomes partition the run, and the totals agree` — e2e/claims.spec.ts:1026
    - :1036 `expect` expected _no expected value_ _(none)_
    - :1042 `toBe` expected `total` _(expression)_
    - :1043 `toBe` expected `60` _(literal)_
- `the measured pass-the-frame rate tracks the closed-form prediction it prints` — e2e/claims.spec.ts:1051
    - :1063 `expect` expected _no expected value_ _(none)_
    - :1068 `expect` expected _no expected value_ _(none)_
    - :1069 `expect` expected _no expected value_ _(none)_
    - :1071 `expect` expected _no expected value_ _(none)_
    - :1077 `toBe` expected `measured` _(expression)_
- `changing the format retires the attack along with the stego string` — e2e/claims.spec.ts:1080
    - :1087 `toHaveText` expected `'—'` _(literal)_
    - :1090 `toContainText` expected `'Compiled.'` _(literal)_
    - :1091 `toHaveText` expected `'—'` _(literal)_
    - :1092 `toContainText` expected `'Nothing substituted yet'` _(literal)_
- `the authenticated mode does what the limitations say is missing` — e2e/claims.spec.ts:1102
    - :1107 `toContainText` expected `'Compiled.'` _(literal)_
    - :1113 `toContainText` expected `'Sealed at counter'` _(literal)_
- `the budget table matches the arithmetic, and refuses what it says it refuses` — e2e/claims.spec.ts:1117
    - :1124 `toHaveLength` expected `4` _(literal)_
    - :1133 `toBe` expected `'${expected} bytes'` _(expression)_
    - :1134 `toBe` expected `'does not fit'` _(literal)_
- `a phone number is refused, and the refusal shows the arithmetic` — e2e/claims.spec.ts:1139
    - :1145 `toContainText` expected `'does not fit'` _(literal)_
    - :1146 `toContainText` expected `'4 whole bytes'` _(literal)_
    - :1147 `toHaveClass` expected `/is-empty/` _(regex)_
- `the sealed string is a member of the language, and nothing travels with it` — e2e/claims.spec.ts:1150
    - :1155 `toBe` expected `true` _(expression)_
    - :1157 `toContainText` expected `'Nothing travels beside it'` _(literal)_
    - :1158 `expect` expected _no expected value_ _(none)_
- `the wire length is constant across message sizes — the length leak is closed` — e2e/claims.spec.ts:1161
    - :1169 `toBe` expected `1` _(literal)_
- `n is never grown — an over-long message is refused, not accommodated` — e2e/claims.spec.ts:1172
    - :1178 `toContainText` expected `'leaves room for'` _(literal)_
    - :1179 `toBe` expected `'64'` _(literal)_
- `the receiver resynchronises without being told the counter` — e2e/claims.spec.ts:1182
    - :1185 `toContainText` expected `'Compiled.'` _(literal)_
    - :1193 `toContainText` expected `'Opened "gap"'` _(literal)_
    - :1194 `toContainText` expected `'found counter 6'` _(literal)_
    - :1195 `toContainText` expected `'without being told'` _(literal)_
- `the substitution attack that beats the unauthenticated mode is refused outright` — e2e/claims.spec.ts:1203
    - :1217 `expect` expected _no expected value_ _(none)_
    - :1223 `toContainText` expected `'60 substitutions, 0 accepted'` _(literal)_
    - :1224 `toContainText` expected `'one in 2^128'` _(literal)_
- `the page does not claim the branchless ranking is constant-time` — e2e/claims.spec.ts:1227
    - :1230 `expect` expected _no expected value_ _(none)_
    - :1231 `expect` expected _no expected value_ _(none)_
    - :1232 `expect` expected _no expected value_ _(none)_
- `the key exchange derives a shared root without sending one` — e2e/claims.spec.ts:1243
- `two different public keys, one identical root` — e2e/claims.spec.ts:1244
    - :1256 `toEqual` expected `['Alice', 'Bob']` _(expression)_
    - :1258 `toBe` expected `rows[1].pub` _(expression)_
    - :1260 `toBe` expected `rows[1].root` _(expression)_
    - :1261 `toBe` expected `rows[0].pub` _(expression)_
    - :1262 `toContainText` expected `'nothing secret crossed the channel'` _(literal)_
- `a fresh exchange gives a fresh root every time` — e2e/claims.spec.ts:1265
    - :1275 `toBe` expected `3` _(literal)_
- `the page does not claim the exchange is authenticated` — e2e/claims.spec.ts:1278
    - :1281 `expect` expected _no expected value_ _(none)_
    - :1282 `expect` expected _no expected value_ _(none)_
    - :1283 `expect` expected _no expected value_ _(none)_
- `fragments carry what one string cannot` — e2e/claims.spec.ts:1287
- `a phone number carries an authenticated message once it is fragmented` — e2e/claims.spec.ts:1288
    - :1297 `toContainText` expected `'does not fit'` _(literal)_
    - :1306 `toBe` expected `PHONE` _(expression)_
    - :1308 `expect` expected _no expected value_ _(none)_
    - :1310 `toBe` expected `true` _(expression)_
    - :1311 `toBe` expected `wire.length` _(expression)_
    - :1315 `toContainText` expected `'"meet me at six"'` _(literal)_
- `the plan states a fragment count the seal then produces` — e2e/claims.spec.ts:1318
    - :1322 `expect` expected _no expected value_ _(none)_
    - :1327 `toHaveLength` expected `Number(planned![1])` _(expression)_
- `tampering with one fragment fails the whole message` — e2e/claims.spec.ts:1330
    - :1337 `toContainText` expected `'refused'` _(literal)_
    - :1338 `toContainText` expected `'tampering with any single piece fails all of it'` _(literal)_
- `freshness is separate from authenticity` — e2e/claims.spec.ts:1342
- `the same strings open once, then are refused as a replay` — e2e/claims.spec.ts:1343
    - :1351 `toContainText` expected `'"once only"'` _(literal)_
    - :1352 `toContainText` expected `'Highest accepted: 0'` _(literal)_
    - :1357 `toContainText` expected `'Authentication failed'` _(literal)_
- `the refusal is the same message a forgery gets — no replay oracle` — e2e/claims.spec.ts:1360
    - :1377 `toContainText` expected `'Compiled.'` _(literal)_
    - :1379 `toContainText` expected `'Compiled.'` _(literal)_
    - :1380 `expect` expected _no expected value_ _(none)_
    - :1381 `toMatch` expected `/replay|counter \d+|already/i` _(regex)_
- `resetting the window makes the same strings acceptable again` — e2e/claims.spec.ts:1384
    - :1393 `toContainText` expected `'Authentication failed'` _(literal)_
    - :1398 `toContainText` expected `'"again please"'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-fte

**Format-Transforming Encryption via regex-ranked steganography.** A regular expression is
compiled to a minimal DFA, the DFA's length-n language slice is counted exactly, and real
AES-CTR ciphertext is enciphered into that slice with FF1 (NIST SP 800-38G) plus cycle-walking,
then unranked back into a string the regular expression accepts.

Live: <https://systemslibrarian.github.io/crypto-lab-fte/> · Source: <https://github.com/systemslibrarian/crypto-lab-fte>

---

## What It Is

Ordinary encryption produces bytes that look like nothing. "Looks like nothing" is itself a
signature: a DPI middlebox that drops what it cannot classify, or a log pipeline that only
accepts well-formed records, rejects high-entropy noise on sight. **Format-Transforming
Encryption** (FTE) fixes the shape of the output without weakening the cipher underneath. You
give it a regular expression; it emits ciphertext that the regular expression accepts, drawn
uniformly from every string the expression accepts at that length.

The exact primitives on this page, all of them running in the browser tab:

| Primitive | Where | What it does here |
| --- | --- | --- |
| Thompson's construction | `src/regex/nfa.ts` | AST to epsilon-NFA; bounded repeats are expanded |
| Subset construction + Hopcroft minimization + trim | `src/regex/dfa.ts` | epsilon-NFA to the unique minimal trim DFA, over alphabet equivalence classes |
| Goldberg-Sipser ranking | `src/rank.ts` | the bijection `{0 … N-1}` to the length-n strings the DFA accepts |
| FF1, radix 2, 10-round Feistel over AES-CBC-MAC | `src/ff1.ts` | permutes `[0, 2^k)`; cycle-walking narrows it to `[0, N)` |
| PBKDF2-HMAC-SHA256, 600,000 iterations | `src/keys.ts` | one pass over passphrase + 16-byte salt yields 384 bits |
| AES-256-CTR (WebCrypto) | `src/keys.ts` | the message cipher |
| Regex DPI classifier | `src/classifier.ts` | the adversary, anchored `^(?:…)$` over three encodings of one ciphertext |
| NANP / dotted-quad corpora | `src/decoys.ts` | realistic decoys for Spot the fake, and an honest refusal where no corpus exists |
| NIST SP 800-38G sample vectors | `src/vectors.ts` | the nine known answers, shared by the test suite and the in-page runner |
| Path tracing | `src/pathtrace.ts` | the route a string walks through the DFA, for the highlighted drawing |
| Substitution attack | `src/substitute.ts` | swaps the stego string for other language members and runs the receiver's own decode over each |
| Length ladder | `src/lengths.ts` | message size against the length that appears on the wire — the leak as an observer would tabulate it |
| HKDF-SHA256 key schedule + ratchet | `src/schedule.ts` | PBKDF2 once as a handshake stand-in, then a per-message chain; the FF1 tweak comes from the counter, so nothing travels beside the string |
| Encrypt-then-MAC (HMAC-SHA256, truncated) | `src/aead.ts` | the authenticated mode: fixed-size padding, one indistinguishable failure, implicit counter with a resync window |
| Branchless ranking | `src/rankct.ts` | unranking without secret-dependent control flow (see the caveat — this is not constant-time) |
| X25519 / P-256 key agreement | `src/handshake.ts` | ephemeral ECDH with a transcript-bound HKDF, replacing the passphrase stand-in |
| Fragmentation | `src/frag.ts` | one authenticated message across several strings, so a narrow format can carry a tag after all |
| Replay window | `src/replay.ts` | the IPsec/DTLS sliding-window freshness check — authenticity is not novelty |
| Shareable state | `src/share.ts` | pattern, `n`, message and classifier rule in the fragment — never a passphrase or salt |

### The bijection

This is the half of FTE with no key in it — pure combinatorics. Let `C[q][k]` be the number of
strings of length exactly `k` that carry state `q` to an accepting state:

`​``
C[q][0] = 1 if q is accepting, else 0
C[q][k] = sum over alphabet classes c of  |c| * C[delta(q, c)][k-1]
N       = C[q0][n]
`​``

Every entry is a `BigInt`, because for a 64-character base64 block `N` is `64^64` and IEEE
doubles stopped counting exactly at `2^53`. `unrank(i)` walks the DFA once, at each position
choosing the symbol whose block of the remaining index range contains `i`; `rank(s)` is the
exact inverse, adding the size of every block that sorts before the symbol actually taken.
Both walk the alphabet in ascending code-point order, so string `i` is the `i`-th accepted
string lexicographically by code point among strings of length `n`. Two properties follow, and
the demo depends on both: `unrank(rank(s)) = s` for every accepted `s`, and `rank` is a
bijection *onto* `[0, N)` with no gaps — so enciphering inside `[0, N)` can land anywhere in the
language and nowhere outside it.

The alphabet Sigma is fixed at 97 symbols: TAB, LF, and printable ASCII `0x20`-`0x7E`. It is
partitioned into equivalence classes — sets of characters that behave identically from every
state — computed from the character sets the pattern actually uses, so `[0-9a-f]{32}` gets two
classes rather than 97. Each class is then cut into maximal contiguous code-point runs, which
is what keeps `rank`/`unrank` at `O(n * |runs|)` rather than `O(n * |Sigma|)` while preserving
strict lexicographic order.

### The regex subset

Small on purpose. Every construct has to survive becoming a DFA and then being counted exactly,
so anything that is not a regular language is not merely unimplemented — it is outside what the
construction can do at all, and `src/regex/parser.ts` says so by name rather than failing later
with something cryptic.

**Supported:** literals (printable ASCII) · `[abc]` `[a-z]` `[^...]` · `\d` `\w` `\s` `\D` `\W`
`\S` `\t` `\n` · escaped punctuation `. ^ $ * + ? ( ) [ ] { } | \ / -` · `.` · `*` `+` `?` `{n}`
`{n,m}` · concatenation · `|` · `(...)` and `(?:...)` · `^` and `$`, which parse to epsilon.

**Not supported, and each rejected with its own message:** backreferences · lookaround · named
groups · open-ended `{n,}` · a repeat bound above 512 · literals outside Sigma. The first two are
not missing features: a language with a backreference or lookaround is not regular, so it has no
DFA and no exact count, and the parser says that rather than implying it could be added.

Two deliberate deviations from a general-purpose engine: matching is always **full-string**, so
an anchor is either redundant or a lie and is accepted and ignored; and `.` is printable ASCII
only, never TAB or LF, matching the usual convention that dot does not cross a line break.

### Security model

Within the FTE threat model the guarantee is exact: the output is a uniformly random member of
`L ∩ Sigma^n`, so **no regular expression that accepts the language can distinguish it from a
genuine member**. That is the whole of what is proved. It defeats a regex classifier. It defeats
nothing else — not a human reader, not a digit-frequency test, not a model trained on real
traffic. Dyer et al. say the same in the paper that introduced FTE: it targets regex-based DPI,
not traffic analysis.

**This is not production cryptography. It is a teaching demo.** There is no authentication
anywhere in the pipeline, the salt and pattern and `n` must travel out of band, and the whole
thing runs client-side with no backend, no storage of key material, and nothing sent anywhere.

---

## Exhibits

A tour of the interactive panels, numbered as the page numbers them.

0. **Try it now.** A compact encoder in the first viewport: message, passphrase, one button, and
   the resulting phone number in large type with the classifier's verdict beside it. It owns no
   cryptography of its own — it drives the same encode path as panel 3 and mirrors the result, so
   the two physically cannot disagree. On a 390 x 844 phone the field, the button and the result
   are all above the fold.

1. **Regex and format.** Four presets plus a free-text pattern box. The automaton, the capacity
   arithmetic and the count table recompute as you type (180 ms debounce). The stat row reports
   `|Q|`, alphabet classes, `N` at the chosen `n`, capacity at that `n`, and the smallest `n`
   that would hold a 128-bit payload. A pattern that will not compile sets `aria-invalid` on the
   input and names the reason.
2. **The minimized DFA.** The automaton your pattern compiles to, drawn as an SVG graph: dashed
   ring for the start state, double ring for accepting states, one labelled edge per alphabet
   equivalence class. The status line reports how many states the powerset construction produced
   and how many minimization and trimming left. Above 64 states the graph is not drawn — the
   panel says so, and the transition table in the disclosure below still lists every transition
   as text. Once something is encoded, **the path that string walks is highlighted on the
   drawing** — one state per character, driven by a scrubber that names each transition
   (`q13 -> q12`) and scrolls the current state into view. Every transition the readout claims is
   cross-checked against the page's own transition table by the claims suite.
3. **Encode.** Message plus passphrase. PBKDF2 derives both keys from a fresh 16-byte salt, the
   message is AES-CTR encrypted, framed with a leading `0x01`, read big-endian as an integer `I`,
   cycle-walked through FF1 inside `[0, N)`, and unranked into the stego string. A capacity bar
   shows payload bits used against bits available and turns red before you can overflow it. The
   out-of-band bundle — `pattern`, `n`, `salt` — is printed separately, because none of it can
   live inside a string every character of which is spoken for by the regex. A six-step trace
   disclosure shows every intermediate: derived key material, ciphertext hex, `I` and its bit
   length, `N` and its capacity, the FF1 domain width `k` with how many applications the cycle
   walk took, and the stego string. Above that disclosure the same values are laid out as a
   **pipeline** — message, ciphertext, framed integer `I`, the slice `N`, the FF1 result, the
   stego string — and the **cycle walk is drawn** as a number line: the wide bar is `[0, 2^k)`,
   the inner bar is `[0, N)`, and each landing is one FF1 application, the rejected ones sitting
   visibly outside the inner bar and the last one inside.
4. **The adversary.** The machine FTE was built for. A regex DPI rule, anchored at both ends,
   run against three payloads carrying the same ciphertext: the stego string, the raw bytes as
   hex, and the raw bytes base64'd. The stego string is forwarded; both raw encodings are
   dropped. The rule is **editable and separate from the format regex** — sharpen it past the
   format and the stego string is flagged too, and the summary says so, because FTE beats the
   regex it was compiled against and not every regex.
5. **Decode.** Paste a stego string, passphrase and salt; the same pattern ranks the string back
   to an integer, FF1 runs backwards through the same cycle walk, and AES-CTR recovers the
   message. A "fill from the encode above" button wires the two panels together.
6. **The count table.** `C[q0][k]` for `k = 0` to 20, plus the chosen `n` if it is larger, with
   `floor(log2 C)` beside each row and the active row highlighted. A note prints the estimated
   BigInt storage for the table at the current `n` — computed by the same estimator that enforces
   the 50 MB ceiling, so the number quoted is the number that would refuse the build. Above it, a
   **capacity curve** plots bits against `n` with the chosen `n` marked and the current message's
   requirement drawn as a horizontal line, so "the encoder grew `n`" is a crossing point rather
   than a sentence.
7. **Honest limitations.** Three named failures of the construction, reproduced below — and all
   three are now demonstrations rather than prose.
   *Uniform is not realistic*: **Spot the fake** deals four real unrankings against four realistic
   decoys and asks you to pick the generated ones, then names the tell in each — an unassigned
   area code, an N11 service code, a leading-zero exchange. On the hex and base64 presets it
   declines to deal and says why: there is no such thing as a realistic random hex string, which
   is exactly why those formats are the easy case and the phone number is the hard one.
   *Length leakage*: **what the wire sees** is the ladder an observer builds from a character
   count alone — message size, payload bits, the `n` the encoder picks, and which other message
   sizes are indistinguishable from it. The four presets are fixed-length and leak nothing;
   `[0-9a-f]{1,64}` separates every single size.
   *No authentication*: **substitute the string** performs the attack. Your stego string is
   replaced sixty times with other real members of the same language, each handed to the
   receiver's own decode under your passphrase and salt. Most are refused by the frame byte, some
   by the UTF-8 check, and roughly one in thirty is **accepted and handed over as a message you
   never sent**. The measured share getting past the frame byte is printed beside the closed-form
   prediction — about 42% against 43.1% on the phone format — which is two independent routes to
   the number the paragraph above claims. PBKDF2 runs once for the whole run, not per trial.
8. **The fix.** The same lab with production requirements applied, running *beside* the
   unauthenticated pipeline rather than replacing it — a mode with a MAC cannot demonstrate what
   happens to one without. Encrypt-then-MAC with a truncated HMAC-SHA256 verified before the
   plaintext is touched; one indistinguishable error for every rejection; an HKDF ratchet with
   PBKDF2 run once rather than per message; the FF1 tweak derived from an implicit counter so
   **nothing travels beside the string** — no salt, no sequence number; fixed-size padding with
   `n` never grown; and branchless unranking. A live budget table shows the cost: a tag competes
   with the message for the format's capacity, so a phone number **cannot carry an authenticated
   message at all**, and the panel refuses with the arithmetic spelled out. Press the attack
   button and the same substitution that beats the unauthenticated mode roughly one time in
   thirty is refused 60 times out of 60.
9. **Keys, fragments, freshness.** The three things the mode above still is not a protocol
   without. A **live X25519 exchange** (P-256 where the browser lacks it) in which two sides
   derive an identical root from public keys alone — with the caveat stated plainly that
   unauthenticated Diffie–Hellman is wide open to an active machine-in-the-middle.
   **Fragmentation**, which is how a phone number carries an authenticated message after all: the
   counter doubles as the sequence number, only the first fragment spends a byte on the count, and
   one tag covers the whole message, so tampering with any single piece fails all of it. A 14-byte
   message becomes 9 phone numbers. And a **freshness window** — the IPsec/DTLS sliding
   construction — because a verified message is authentic but not necessarily new: open the same
   strings twice and the second attempt is refused through the same path as a forgery, with the
   same words, so there is no replay oracle either.
10. **References and glossary.** The four sources this is built from, nine terms defined, and a
   **known-answer panel that runs the NIST vectors in your browser**. Six of the nine run; the
   other three use AES-192, which WebCrypto does not implement in any browser, so they are marked
   UNSUPPORTED rather than failed and are covered by the Node suite. That split is worth noticing:
   a green CI run on Node says nothing about what a visitor's browser can reproduce.

Across the top: a **guided path** of seven steps that ends deliberately on the honest limitations
rather than on the encode that makes the construction look good, and a **copy-link button** that
puts the pattern, `n`, the message and the classifier rule in the URL fragment. The passphrase and
the salt are never written to the URL — `assertNoSecrets` refuses the write, and the claims suite
performs a real encode and greps the resulting URL for both.

Changing the pattern or `n` **retires** any stego string on screen and says so: a stego string
belongs to exactly one `(pattern, n)` pair, and leaving a plausible-looking string that quietly
belongs to a format nobody is looking at any more would be worse than clearing it.

---

## When to Use It

Use this demo to explain, to a colleague or a class:

- what FTE actually is, and why "encryption that looks like a phone number" is a counting problem
  before it is a cryptography problem;
- rank-then-encipher — that a cipher can be made to act on a *language* by acting on the integers
  the language is in bijection with, and that the cipher never sees a string;
- why a DFA is the right data structure: minimization, alphabet equivalence classes, and a
  counting DP that is linear in `n * |Q| * |classes|`;
- what format conformance does and does not buy you, with the three limitations on screen rather
  than in a footnote.

**Do NOT use this to hide real traffic, real messages, or anything whose exposure matters.** It
has no MAC, so any adversary can swap your stego string for a different member of the language
and the receiver cannot tell; it leaks message length through `n`; it is a hand-rolled FF1 in
TypeScript with no side-channel hardening; and the uniform output is trivially separable from
real traffic by anything smarter than a regular expression. If you need a real censorship-
circumvention transport, use a maintained one. If you need format-preserving encryption in
production, use a vetted FF1 implementation and read SP 800-38G Rev. 1 first.

---

## Live Demo

<https://systemslibrarian.github.io/crypto-lab-fte/>

A visitor can pick one of four presets or type a pattern, watch the automaton and the count
table rebuild live, encode a message into a phone number or a hex string or a base64 block,
read every intermediate value in the trace, decode it back, and then break it deliberately —
wrong passphrase, wrong salt, one character changed, a message too long for the format — and
watch each failure land in a different place. Everything runs in the tab: no backend, no
analytics, no fonts, no telemetry, and no key material or message ever leaves the browser.

**Network:** the only requests the page can make are the five SHA-384-integrity-pinned scripts
in the document head — `dagre` and the four `d3-force` modules — served from jsDelivr with
`crossorigin="anonymous"` and `referrerpolicy="no-referrer"`. They are a **layout enhancement,
nothing more**. If either engine fails to load, or the page is opened with no network at all,
the automaton still draws using a built-in BFS layering (column = distance from `q0`), and the
legend says which engine it used. The favicon is an inline SVG data URI, so it costs no request
either.

---

## What Can Go Wrong

- **Salt reuse is a two-time pad.** AES-CTR here runs from an all-zero counter block. That is
  safe *only* because a fresh 16-byte salt is drawn on every encode, so the AES-256 key is never
  reused. Encrypt two different messages under the same passphrase **and** the same salt and the
  keystream repeats. The UI generates a new salt every time for exactly this reason, and displays
  the salt rather than hiding it so the reuse is visible if it ever happens. Do not lift
  `keys.ts` into anything that reuses a salt.
- **Lose the salt, the pattern or `n` and the message is gone.** None of the three fit inside the
  stego string. That is a real cost of FTE, not a shortcut taken here.
- **A message that does not fit grows `n`.** The encoder picks the shortest length that holds the
  payload and tells you it did, rather than silently changing the format — but a longer message
  then produces a visibly longer string. See "Length leakage" below.
- **Decode failures are not integrity checks, and the frame byte is weaker than it looks.** The
  `0x01` byte exists so that a big-endian integer can remember its leading zero bytes. The obvious
  guess — that a wrong key passes it 1 time in 256 — is wrong, because the leading byte of a
  *minimal* big-endian encoding is not uniform over `0..255`. A wrong passphrase lands uniformly in
  `[0, N)`, and the fraction of that range beginning with `0x01` is a property of `N`:
  **0.431 for the phone preset** (all of `[2^32, 2^33)` is inside `[0, 10^10)`), 0.0043 for IPv4,
  and `1/255` for hex and base64 — the last two only because their `N` is an exact power of 256,
  which is the coincidence that makes the folklore number sound right. `src/fte.test.ts` computes
  all four in closed form. The strict UTF-8 decode behind it catches most of what gets through;
  "most" is not a security property, and a check whose strength swings by two orders of magnitude
  depending on whether the format happens to be byte-aligned is exactly what a MAC is not.
  End to end on the phone preset, roughly **one wrong passphrase in thirty** clears both checks and
  returns four bytes of plausible-looking garbage rather than an error. The page says so in the
  decode panel. What never happens is recovering the real message: confidentiality is a property
  of AES, and it does not depend on any of this.
- **The ranking order is code-point order, not the format's own order.** For
  `[A-Za-z0-9+/]{64}`, index 0 is 64 `+` characters and index `N-1` is 64 `z` characters, because
  `+` is `0x2B` and `z` is `0x7A`. Base64's own alphabet order is irrelevant to the bijection.
- **Some patterns are rejected, on purpose.** Under 8 bits of capacity at every length up to
  `n_max` ("a format has to have choices in it to hide anything"); over 4096 DFA states, which
  `[ab]*a[ab]{20}` reaches because subset construction is exponential in the worst case; a count
  table over 50 MB; a language slice under the FF1 minimum domain of `10^6`.

### The three named limitations, as the page states them

**Uniform is not the same as realistic.** Format conformance defeats a *regex* classifier, and
within that model the guarantee is exact. It defeats nothing else. A phone number drawn uniformly
from `(000) 000-0000` through `(999) 999-9999` has no area-code structure, no exchange
conventions, and a leading zero about a tenth of the time. A human glance, a digit-frequency
test, or a model trained on real phone numbers separates it from the genuine article
immediately.

**Length leakage.** `n` is fixed and public, so the stego string's length is a direct function of
the message's length class — and the encoder *grows* `n` when a message will not fit, turning a
longer message into a visibly longer string. Two messages in the same length bucket are
indistinguishable; two that are not, are not. The fixes are the usual ones and neither is
implemented here: pad every message to a constant size before encrypting, or abandon the
fixed-length slice for variable-length arithmetic coding against a real corpus.

**No authentication.** There is no MAC anywhere in this pipeline. An adversary who sees a stego
string can replace it with *any other member of the language* — a different phone number is still
a phone number — and the receiver cannot tell substitution from a genuine message. The frame byte
does not help: see the false-accept rates above. A real
deployment computes HMAC-SHA256 over the stego string under a separate derived key, transmits or
embeds the tag, and refuses to decode anything that does not verify: encrypt-then-MAC, checked
before ranking.

---

## Real-World Usage

- **Censorship circumvention.** FTE was built for this. Dyer, Coull, Ristenpart and Shrimpton
  (CCS 2013) showed that regex-driven DPI — the kind deployed by commercial middlebox vendors and
  by national firewalls — could be made to misclassify a tunnel as HTTP, SMTP or SSH by forcing
  the ciphertext to satisfy the classifier's own regular expression. Their `libfte` and the
  `fteproxy` pluggable transport built on it were deployed in the Tor ecosystem. This demo is not
  libfte and is not a transport; it is the construction, laid open.
- **Format-preserving encryption in industry.** The same rank-then-encipher idea, with the
  language fixed to a format rather than a regex, is what protects card numbers, national ID
  numbers and other fixed-shape fields in databases and payment systems that cannot widen a
  column. That is FF1's day job, and the sibling demo below is the one that shows it.
- **Ranking as compression.** Goldberg and Sipser's original point was not encryption at all: the
  ranking function for a regular language is an *optimal* compressor for it, since a uniformly
  distributed member of a language of size `N` needs exactly `log2 N` bits. Capacity on this page
  is that same number, rounded down.

---

## References

1. A. V. Goldberg and M. Sipser, *Compression and Ranking*, STOC 1985 (SIAM J. Comput. 20(3),
   1991). The ranking function for a regular language, and the observation that it is an optimal
   compressor for it — the combinatorial half of everything above.
2. M. Bellare, T. Ristenpart, P. Rogaway and T. Stegers, *Format-Preserving Encryption*, SAC 2009.
   Names and analyses **rank-then-encipher**: rank into an integer, encipher on the integers,
   unrank back. <https://eprint.iacr.org/2009/251>
3. K. P. Dyer, S. E. Coull, T. Ristenpart and T. Shrimpton, *Protocol Misidentification Made Easy
   with Format-Transforming Encryption*, CCS 2013 — the FTE construction and libfte, aimed
   squarely at regex-based DPI. <https://eprint.iacr.org/2012/494>
4. NIST, *SP 800-38G: Recommendation for Block Cipher Modes of Operation: Methods for
   Format-Preserving Encryption*, March 2016 — FF1, implemented here from §5.2 and checked against
   all nine published sample vectors. Draft Rev. 1 (Feb 2025) supplies the `10^6` minimum domain
   this lab enforces. <https://csrc.nist.gov/pubs/sp/800/38/g/final>

---

## How to Run Locally

`​``sh
git clone https://github.com/systemslibrarian/crypto-lab-fte.git
cd crypto-lab-fte
npm install

npm run dev        # Vite dev server on http://localhost:5173/crypto-lab-fte/
npm run build      # tsc --noEmit, then vite build into dist/
npm run preview    # serve the production build
npm test           # Vitest, the whole unit suite
npm run test:e2e   # Playwright claims suite (needs: npx playwright install chromium)
npm run test:a11y  # Playwright + axe WCAG gate
npm run test:e2e:all  # both Playwright projects
`​``

Vite's `base` is pinned to `/crypto-lab-fte/` because GitHub Pages serves the lab from a project
subpath, so nothing in the page may use a root-absolute asset path. There is no backend and no
build-time secret; opening `dist/index.html` through any static server is enough.

---

## Related Demos

- **[Format Ward](https://systemslibrarian.github.io/crypto-lab-format-ward/)** — the same FF1,
  approached from the format-**preserving** end. There the domain is the format itself: 16 digits
  go in and 16 digits come out. Here the domain is `|L ∩ Sigma^n|`, the number of strings of
  length `n` a regular expression accepts, and the format is recovered by unranking. Same cipher,
  one more layer of combinatorics. Reading the two together is the clearest way to see what
  rank-then-encipher actually generalises.

---

## Build & Verify

`npm test` runs **166 tests across 15 files** (about 8 seconds; the bulk of it is PBKDF2, which is the point):

| File | Tests | What it pins down |
| --- | --- | --- |
| `src/ff1.test.ts` | 19 | **All nine NIST SP 800-38G sample vectors** (S1-S9: AES-128/192/256, radix 10 and 36, with and without tweak), FF1 at radix 2 as a genuine permutation of `{0,1}^k`, cycle-walking injective and round-tripping on a non-power-of-two domain, refusal below the `10^6` domain floor |
| `src/rank.test.ts` | 11 | The count table against brute-force enumeration; **the textbook known answers** `16^32`, `64^64`, `10^10`, `1110^4`; rank/unrank a bijection onto `[0, N)` whose enumeration is sorted; **`rank("(415) 555-0123") = 4155550123`** and `unrank(0) = "(000) 000-0000"` |
| `src/fte.test.ts` | 13 | Round trips through every preset, the stego string re-checked against the platform `RegExp` engine, failing closed on a wrong passphrase or salt, a different salt giving a different string, `n` growing when the payload does not fit, and the frame byte's false-accept rate computed in closed form for all four presets |
| `src/regex/dfa.test.ts` | 9 | The DFA cross-checked against the platform `RegExp` engine on a spread of patterns and inputs, minimization (two spellings of one language give one state count), the alphabet partition covering Sigma exactly once, and the parser rejecting out-of-subset constructs by name |
| `src/classifier.test.ts` | 8 | Anchoring (a buried match is not a match), the textbook PASS/FLAGGED split, the summary admitting it when a sharpened rule flags the stego string or a loose rule passes the raw ciphertext, and base64 checked against the platform encoder across the padding cases |
| `src/decoys.test.ts` | 11 | Every realistic phone number satisfying NANP assignment rules and every dotted quad being one a log would contain — each checked against the same `tells` function the reveal uses, over 400 draws; the refusal to invent a corpus for hex; scoring; and the admission that a uniform draw sometimes carries no tell at all |
| `src/pathtrace.test.ts` | 8 | The traced path agreeing with `rank`/`unrank` over an entire language slice, each step starting where the last ended, the exact index where a string leaves the language, and self-loops collapsing to one edge |
| `src/lengths.test.ts` | 8 | The ladder picking the same `n` the encoder would, checked in closed form (`2(b+1)` for hex); a fixed-length format collapsing to one bucket; a variable-length one separating every size; wire length monotone in message size; and empty or unfittable slices not throwing |
| `src/substitute.test.ts` | 6 | Every substituted string a genuine language member and never the original; **no substitution ever returning the message that was sent**; the three outcomes partitioning the run; and the measured pass-the-frame-byte rate tracking `frameByteFalseAccept`'s closed form, which counts intervals rather than running the cipher |
| `src/aead.test.ts` | 18 | The capacity budget refusing what it says it refuses; fixed-size padding making the wire length constant; `n` never grown; resynchronisation across a gap without transmitting the counter; every substitution rejected; and **six different failure causes producing one byte-identical error**, which is the property the unauthenticated decoder lacks |
| `src/rankct.test.ts` | 8 | The branchless unranking enumerating four languages **identically to `rank.ts` over entire slices**, plus a Proxy-instrumented count showing its run-loop iterations do not vary with the secret index — and that the original's *do*, so the control half of the test cannot pass for the wrong reason |
| `src/handshake.test.ts` | 16 | Both sides deriving one root from public keys alone, on **both suites**; a watcher with both public keys deriving something else; every exchange fresh; cross-suite keys refused by length; and the transcript sorted so the two sides build it identically |
| `src/frag.test.ts` | 14 | The plan being **tight** — the claimed fragment count holds the blob and one fewer would not — across four capacities, three tag sizes and four message lengths; a 16-byte message with a 128-bit tag needing exactly 12 phone numbers; and tampering, reordering or dropping any single fragment failing the whole message |
| `src/replay.test.ts` | 8 | Out-of-order arrivals accepted once and only once; anything past the window floor refused as too old; **a jump past the window emptying the bitmap** rather than wrapping stale bits into false freshness |
| `src/share.test.ts` | 9 | Round-tripping regex metacharacters through the fragment, dropping unknown and oversized keys, surviving eleven hostile fragments without throwing, and refusing to write a URL containing key material — including a passphrase with a space, which an earlier `decodeURIComponent`-based check let through |

The known-answer tests are the first two rows: `src/ff1.test.ts` for the cipher, `src/rank.test.ts`
for the combinatorics.

**Numbers the code actually produces** (recomputed from source while writing this):

| Preset | Pattern | `n` | `\|Q\|` | classes | `N` | capacity |
| --- | --- | --- | --- | --- | --- | --- |
| Phone number | `\(\d{3}\) \d{3}-\d{4}` | 14 | 15 | 6 | `10^10` | 33 bits |
| IPv4 dotted quad | `\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}` | 15 | 16 | 3 | `10^12` | 39 bits |
| Hex string | `[0-9a-f]{32}` | 32 | 33 | 2 | `16^32 = 2^128` | 128 bits |
| Base64 block | `[A-Za-z0-9+/]{64}` | 64 | 65 | 2 | `64^64 = 2^384` | 384 bits |

At `n = 15` the IPv4 slice is *exactly* the zero-padded quads (`192.168.001.001`), because that is
the only shape 15 characters can take — one of the ways a fixed length narrows a format. The
phone preset's 33 bits are worth staring at: four message bytes plus the frame byte already
overflow it. Base64 at 65 states is over the 64-state display cap, so that preset is counted and
tabulated but not drawn.

**Accessibility gate.** `e2e/a11y.spec.ts` runs axe-core against `wcag2a`, `wcag2aa`, `wcag21a`
and `wcag21aa` on the production build (Chromium, dark scheme, at desktop width and again at
380 px). It does not scan one arrival state: `e2e/gate.ts` drives the lab through everything it
teaches — the 15-state phone automaton on arrival, the skip link focused, each disclosure opened
by clicking its own `<summary>`, all four presets, an unparseable pattern behind `aria-invalid`,
an 81-state automaton over the display cap, an over-capacity message with the encode refused
before any key derivation, a real encode with its trace, the decode that recovers it, a wrong
passphrase and a malformed salt, hover states and focus rings — and scans every one. The added
panels are driven too: the classifier's textbook PASS/FLAGGED table, the same table after the rule
is sharpened past the format, an invalid rule behind `aria-invalid`, the populated pipeline and
cycle walk, the highlighted DFA path and its focused scrubber, Spot the fake dealt and then
revealed, Spot the fake declining on hex, the vector panel before and after its run, the length
ladder both leaking and not, the substitution panel before and after sixty real trials, the guided
path open, and the two new scrolling regions focused. It also adds
three checks axe has no rule for: a contrast audit that resolves `color-mix()` fills, a non-text
contrast audit against a checked-in baseline, and a horizontal-overflow check for WCAG 1.4.10
reflow. Uncaught page errors fail the run. Nothing is injected into the page and no disclosure is
opened from script, so the rendering that is scanned is the rendering a reader actually gets.

**Claims suite.** `e2e/claims.spec.ts` (`npm run test:e2e`) runs **65 tests** asking a different
question from the unit tests: does the page tell the truth about what it computed? The rule that
makes them worth anything is that each compares two values the *page* printed, or re-derives a
claim from the page's own inputs by a different route than the source takes. The independent
oracles are the platform `RegExp` engine (is the stego string really a language member?),
closed-form combinatorics (a hex format's length-`k` slice has exactly `16^k` members and so
exactly `4k` bits), BigInt arithmetic over the printed numbers (every `capacity = floor(log2 N)`
claim), and the round trip itself. The newer rows extend the same discipline to the added panels:
the classifier's verdict column is re-derived by running the platform `RegExp` engine over the
payloads the page printed; the drawn cycle-walk landings are counted against the FF1 application
count the status line quotes; every transition the path scrubber names is looked up in the page's
own transition table; the in-page vector table's "NIST says" and "this page produced" columns are
compared to each other; every Spot-the-fake candidate is checked to be a genuine language member;
a real encode is performed so the resulting URL can be grepped for the passphrase and the salt;
the length ladder is re-derived in closed form (`2(b+1)` for a hex format); and the substitution
panel is checked to never return the sent message, to put only genuine language members on the
wire, and to have its measured false-accept rate agree with the closed form it prints.
The cross-checks a single surface cannot fake: the preset
menu's hand-written `(33 bits at n = 14)` against the live stat grid, the count table's
highlighted row against that grid, the capacity bar's figures against both, and the SVG's circle
count against the transition table. It also covers every failure path by name, and both halves of
retirement — changing the pattern or `n` must clear a stale stego string *and say it was retired*,
while re-selecting the same preset must not. One test blocks every request to jsDelivr and asserts
the automaton still draws with the built-in layering, which is what makes the CDN tags an
enhancement rather than a dependency.

**The tests have been watched to fail.** Five mutations were applied to the source, one at a
time, each confirmed to leave `tsc` clean and (for the browser ones) to change the bundle hash
before being reverted, with the hash confirmed to return afterwards:

| Mutation | Test that caught it |
| --- | --- |
| `<` to `<=` in the unrank block comparison | the far-ends round-trip in `src/rank.test.ts` |
| `p[6] = 0x0a` to `0x0b` in the FF1 P block | all nine NIST vectors |
| the encrypt cycle walk run through `ff1Decrypt` | the walk's round trip, plus three FTE round trips |
| the phone preset's declared `bits: 33` to `34` | the claims suite's preset-label cross-check |
| the `clearDfa` call removed from the failure branch | the stale-drawing claim (16 stale circles survived) |

A green suite that has never been seen red is not evidence.

**A pre-push audit found two flaky assertions, and both were structural.** Both asserted that a
wrong passphrase always fails, which this construction does not guarantee — so both were rewritten
to drive the state on the base64 preset, where a false accept is a `~2^-40` event rather than a
`~1-in-30` one. The lesson is worth stating plainly: the flake was not a test-timing problem, it
was a test asserting something the README's own "What Can Go Wrong" section says is untrue.

---

## Performance

Measured on the development container; your numbers will differ, but the shape will not.

- **PBKDF2 dominates everything.** 600,000 iterations of HMAC-SHA256 (the OWASP 2023 floor) is
  roughly 300-400 ms per derivation in WebCrypto, and a full encode-then-decode round trip in the
  test suite lands around 700 ms. One derivation produces 384 bits split into the AES-CTR key and
  the FF1 key — domain-separating with two derivations would double the wait for no security
  gain, since distinct non-overlapping ranges of one PRF output are already independent.
- **FF1 is cheap by comparison.** Ten Feistel rounds, each an AES-CBC-MAC over a few blocks
  through WebCrypto. The cycle walk re-enciphers only when the result lands in `[N, 2^k)`, which
  happens with probability under 1/2, so the expected number of applications is `2^k/N < 2`; the
  hard stop at 512 applications is there because looping forever would hide a wrong domain rather
  than report it.
- **Compilation is the interactive cost.** Every keystroke re-parses, rebuilds the epsilon-NFA,
  determinizes, minimizes and re-scans capacity, behind a 180 ms debounce. `scanCapacity` uses a
  single rolling row, so capacity for every `k` up to `n_max` costs `O(|Q|)` memory rather than
  `O(n * |Q|)`.
- **The count table is the memory cost.** `(n+1) * |Q|` BigInt cells, and a BigInt cannot live in
  a typed array — V8 stores each as a heap object of a header plus 64-bit limbs. `estimateTableBytes`
  models that shape honestly and the page prints the estimate; the same estimator enforces the
  50 MB ceiling.
- **rank/unrank are `O(n * |runs|)`** BigInt operations, with `|runs|` typically a handful. Note
  that runs and classes are not the same count: the phone preset has 6 classes but 10 runs, and
  hex has 2 classes but 6 runs, because a class is cut wherever it is not contiguous in code-point
  order (`[0-9a-f]` is one class, two runs) and Sigma itself has a gap between LF and space.
- **Guards, all of them stated in the code and enforced:** NFA expansion 20,000 states; `|Q|`
  ceiling **4096**; repeat bound and `n_max` **512**; count table **50 MB**; minimum useful
  capacity **8 bits**; FF1 minimum domain **10^6**, from Draft SP 800-38G Rev. 1 (2nd public
  draft, Feb 2025), which promoted the 2016 text's recommendation to a requirement after
  Hoang-Tessaro-Trieu showed small domains fall to known-plaintext message recovery; cycle-walk
  hard stop 512 applications; graph display cap 64 states.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Covert Channel Studio

- **slug**: `crypto-lab-covert-channel-studio`
- **repo**: https://github.com/systemslibrarian/crypto-lab-covert-channel-studio
- **live**: https://systemslibrarian.github.io/crypto-lab-covert-channel-studio/
- **commit_sha**: `db77e658a5854fcf98e867fa67e9d3439de3c61f` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: STEGANOGRAPHY | ATTACKS  ·  **level**: advanced  ·  **--accent**: #2dd4bf
- **MISSING FIELDS**: subtitle, description, why_it_matters, claims, mutations, verification

**Name (H1)**: Covert Channel Studio  — _read from index.html_

**Subtitle**: _MISSING_

**Description**: _MISSING_

**Why it matters**: _MISSING_

**Card copy**: The same bits moved eleven ways — DNS labels, ICMP echoes, inter-arrival gaps, packet order, cache lines — each scored by a cited detector. Then a warden closes several channels while their anomaly score falls, leaving no record.

**Chips**: Storage & Timing · Protocol Hopping · Flush+Reload · Active Warden

**Implements**: N/A

**Attacks shown**: Cache timing `js/content/atlas.js:308`, Frequency analysis `js/content/references.js:123`, Side-channel (unspecified) `js/content/atlas.js:305`, Timing side-channel `js/content/quiz.js:265`

**Comment-only (named in code comments, not executed)**: Pairing `js/channels/icmp.js:22`

**References**: AES, LMS, Pairing, RSA, SHA-256, Shamir secret sharing

**Standards body**: _none_

**Implementation**: N/A (model or attack)

**Spec citations, exactly as written**:

- `10.1145/2684195` — first seen js/content/atlas.js:43 (1×)
- `10.1145/3729165` — first seen js/content/atlas.js:45 (1×)
- `arXiv:1004.4358` — first seen js/content/references.js:126 (1×)
- `arXiv:1406.2901` — first seen js/content/atlas.js:43 (2×)
- `arXiv:1606.05915` — first seen js/content/references.js:291 (1×)
- `arXiv:1804.04014` — first seen js/content/references.js:307 (1×)
- `doi.org/10.1007/10719724_5` — first seen js/content/references.js:231 (1×)
- `doi.org/10.1007/11605805_1` — first seen js/content/references.js:330 (1×)
- `doi.org/10.1007/978-3-319-60876-1_8` — first seen js/content/references.js:301 (1×)
- `doi.org/10.1109/5.771065` — first seen js/content/references.js:207 (1×)
- `doi.org/10.1109/CSF.2015.26` — first seen js/content/references.js:285 (1×)
- `doi.org/10.1145/1030083.1030108` — first seen js/content/references.js:157 (1×)
- `doi.org/10.1145/1315245.1315284` — first seen js/content/references.js:165 (1×)
- `doi.org/10.1145/2684195` — first seen js/content/references.js:46 (1×)
- `doi.org/10.1145/357369.357374` — first seen js/content/references.js:30 (1×)
- `doi.org/10.1145/362375.362389` — first seen js/content/references.js:22 (1×)
- `doi.org/10.1145/3729165` — first seen js/content/references.js:54 (1×)
- `doi.org/10.6028/NIST.SP.800-53r5` — first seen js/content/references.js:244 (1×)
- `NIST SP 800-53 Rev. 5` — first seen js/content/references.js:239 (1×)
- `RFC 1035` — first seen js/content/references.js:86 (2×)
- `RFC 2606` — first seen js/content/references.js:94 (2×)
- `RFC 4648` — first seen js/channels/dns.js:27 (1×)
- `RFC 5508` — first seen js/channels/icmp.js:24 (7×)
- `RFC 5737` — first seen README.md:179 (8×)
- `RFC 6761` — first seen js/channels/dns.js:7 (2×)
- `RFC 791` — first seen js/content/references.js:62 (2×)
- `RFC 792` — first seen js/channels/icmp.js:5 (5×)
- `RFC 793` — first seen js/content/references.js:78 (2×)
- `rfc1035` — first seen js/content/references.js:91 (1×)
- `rfc2606` — first seen js/content/references.js:99 (1×)
- `rfc5508` — first seen js/content/references.js:107 (1×)
- `rfc5737` — first seen js/content/references.js:115 (1×)
- `rfc791` — first seen js/content/references.js:67 (1×)
- `rfc792` — first seen js/content/references.js:75 (1×)
- `rfc793` — first seen js/content/references.js:83 (1×)

**README — Limitations**:

```text
Be honest about what this is:

- **It is a simulation.** Real networks add noise, middleboxes, retransmission, and adversarial monitoring that no browser demo reproduces.
- **Simple statistics are indicators, not verdicts.** The detection console uses entropy, frequency, and regularity measures as teaching instruments. Real detection pipelines combine many signals, baselines, and context; a lit indicator here means "worth a look," never "proven covert channel."
- **Toy messages only.** The 24-byte cap keeps every example small enough to trace bit-by-bit; nothing here says anything about real-world channel capacity.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Covert Channel Studio

> Hidden communication in protocols, timing, and media.

Covert Channel Studio is a polished, browser-based **educational security lab** — part of the [**Crypto-Lab**](https://github.com/systemslibrarian/crypto-lab) collection of browser-based cryptography and security exhibits. It teaches how covert channels work, how they differ from ordinary tunneling and steganography, and — just as importantly — how defenders detect them. Everything in the lab is a **100% client-side simulation**: every packet, DNS query, resolver, and timing event is a plain JavaScript object rendered in your browser. Nothing ever touches a real network.

## Table of contents

- [Purpose & educational scope](#purpose--educational-scope)
- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Channel taxonomy](#channel-taxonomy)
- [Safety boundaries](#safety-boundaries)
- [What this project intentionally does not do](#what-this-project-intentionally-does-not-do)
- [How to run locally](#how-to-run-locally)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [Running the tests](#running-the-tests)
- [Accessibility](#accessibility)
- [Browser support](#browser-support)
- [Limitations](#limitations)
- [References](#references)
- [License](#license)

## Purpose & educational scope

The central thesis of the exhibit:

> **A covert channel communicates information through a mechanism that was not intended to carry that information.**

The hidden information does not always live in a packet payload. It can live in a field value, in an ordering, in a protocol's structure, or simply in *when* something happens. The lab is built around a five-way taxonomy, and it deliberately does **not** treat every tunnel as a covert channel:

1. **Covert storage channels** — information encoded in a *value* (e.g., unused or loosely-checked header fields).
2. **Covert timing channels** — information encoded in *when* events occur (inter-arrival gaps, presence/absence in a time slot).
3. **Protocol-shaped tunneling** — a legitimate protocol abused as a carrier (e.g., data smuggled through DNS query names).
4. **Steganography** — information hidden *inside other content* (e.g., least-significant bits of image pixels).
5. **Ordinary encrypted tunnels** (SSH/HTTPS) — these hide *content*, but the traffic is usually readily identifiable as SSH or HTTPS. They are better described as tunneling than as covert signaling. **Hiding content is not the same as hiding the existence or purpose of communication.**

The exhibit teaches both the **sender/receiver** perspective and the **defender/analyst** perspective, and emphasizes the fundamental tradeoff triangle: **capacity vs. reliability vs. observability**. A channel can be subtle without being undetectable — pushing more bits through faster always leaves a bigger statistical footprint.

## Features

Interactive exhibit sections, plus a glossary and a quiz:

- **Overview** — the thesis, the taxonomy, and a "same bits, six carriers" preview.
- **DNS Channel** — a name-lookup protocol abused as a carrier; toy messages encoded into simulated query labels under the reserved `.test` TLD.
- **ICMP Echo Channel** — the textbook "ping tunnel," built as a *pair* of deliberately mismatched carriers: the echo data area (loud, high capacity) and the low bit of the Echo Identifier (quiet, one bit per echo). They die to **orthogonal** defences — a size clamp kills the payload channel and leaves the identifier alone, while a NAT rewriting the identifier does the reverse — so no single normaliser closes ICMP. Also the module where payload *entropy* is shown to be the wrong statistic: the conventional ping fill is already near-maximal entropy, and what actually separates them is that it is predictable and identical in every echo.
- **Timing Channel** — bits in inter-event gaps; jitter degrades reliability *and* detectability, made visible on a live trade-off curve.
- **Storage Channel** — bits in simulated IP/TCP field values (IP-ID parity, TTL toggle, TCP-seq low bit), with a middlebox experiment that rewrites the field and breaks the channel.
- **Packet-Order Channel** — information in the *ordering* of interchangeable events, with the ⌊log₂ n!⌋ capacity ceiling. Also the module that catches most people out in the Carrier Atlas: the published catalog files order *across* PDUs under **timing** (P10 PDU Order), not storage, because no value in any packet is altered — what varies is *when* each PDU appears.
- **HTTP Header Channel** — an application-layer channel: permuting reorderable request headers hides 9 bits/request; a normalizing proxy destroys it.
- **Protocol-Hopping Channel** — the choice of protocol *is* the message. A covert state machine walks an ordered five-protocol set (HTTPS, DNS, NTP, SMTP, SSH) at ⌊log₂(n−1)⌋ = 2 bits per hop. The first module where **no packet is anomalous at all** — every flow is valid, and the channel exists only as a property of the *sequence*, so per-packet inspection is structurally blind to it. The tell is a **transition matrix** whose diagonal the grammar forces empty; the lesson is that a whole-host aggregate hides it and **grouping by peer** brings it back.
- **Image Steganography** — LSB embedding with a visual diff, bit-plane view, and the chi-square steganalysis attack.
- **Library Records** — the librarian's-eye exhibit: routine circulation/transfer metadata as an *unintended inference channel*, and data minimisation as the defence.
- **Air-Gap Optical Channel** — with no network at all, the carrier becomes the medium: an LED blinked as on/off keying, recovered by a matched filter against an explicit ambient-noise process, with measured BER against Shannon capacity. **The medium is modelled, not measured** — no hardware is touched.
- **Shared-Cache Channel** — two colluding processes signalling through cache-line presence (Flush+Reload, with Prime+Probe as the inverted-polarity variant), read by a latency-histogram classifier. The concrete instance of the resource the Shared-Resource Matrix describes abstractly. **The cache is modelled, not measured** — nothing is flushed and no timer is read.
- **Detection Console** — the defender's bench: named, cited statistical detectors across every channel.
- **Detection Challenge** — a genuinely **blind, scored** exercise: observables only, commit a call (clean / suspicious / covert), then reveal the ground truth. Includes false-positive traps.
- **Detector Validation Lab** — every detector is run over hundreds of deterministic clean/covert cases; the section shows **ROC curves, AUC, and confusion matrices** (FPR/FNR/precision/recall), making the detectors' quality — and their honest failure modes — measurable rather than asserted. Method transparency (equation → implementation → threshold → known-answer test → failure modes) is documented in **[VALIDATION.md](VALIDATION.md)**.
- **Active Warden Lab** — a section about **disruption** rather than detection. Eight normaliser actions (header scrubbing, header canonicalisation, packet resequencing, traffic shaping, ICMP normalisation, a protocol egress allow-list, a **protocol-switching-aware warden (PCAW)**, and a DNS label policy) are each applied to the *actual simulation* and every channel is re-run, so the verdicts are measured rather than looked up. Four results carry the section: storage-style channels die cleanly; the **timing channel does not die** — shaping leaves a residual Shannon capacity, and it is the only defence here with an ongoing cost; the PCAW produces a third outcome shape entirely, **rate-limited** — it corrupts nothing, so every bit still arrives and the message decodes perfectly, just more slowly, and a bitrate limit is a budget for a patient sender rather than a barrier; and the air-gap and shared-cache channels are **structurally out of path**, because a normaliser rewrites packets and neither of those carriers is made of packets. It also makes the uncomfortable point that **normalisation is disruption, not detection** — several channels are closed while their anomaly score *falls*, leaving no record that anyone tried.
- **Capacity as three numbers** — every channel reports *theoretical* vs *raw throughput* vs *effective goodput* (after errors/normalisation), not one hand-wavy figure — aligned with the bandwidth-estimation mindset of NIST SC-31.
- **Compare Channels** — ranked by educational clarity, reliability, and teaching value — never by "stealth."
- **Carrier Atlas** — each module mapped to a named hiding pattern from the eleven-pattern catalog (Wendzel et al., 2015) **or to an explicit statement of why it has none**, which over half of them honestly do: payload-carrying and excluded by the survey's own scope sentence, in scope but not one of the eleven, or not made of network PDUs at all. The blank is the teaching point, not a gap. Plus the carriers this lab only *describes* (VoIP/RTP, Wi-Fi / link layer, history channels, and the text/linguistic family), each with a fidelity card. ICMP and protocol hopping moved from described-only to **built** in 1.4.0. The text/linguistic entry links out to the sibling exhibit [**Ghost-Ink**](https://systemslibrarian.github.io/Ghost-Ink/), which covers that family in depth rather than duplicating it here.
- **Case Studies** — five publicly documented incidents, each mapped to the module that models its carrier, the named statistic in this lab that speaks to it, and a **caveat** saying what that statistic would *not* have told you. Mapping only: public sources named inline, no indicators of compromise, no tooling, no reproduction steps. Two of the five are there to complicate the vocabulary rather than confirm it — a side channel repurposed as a covert one, and a carrier that is neither. Pairs with the Atlas: **not one of the five carriers has a pattern number**, for exactly the scope reasons the Atlas gives.
- **Shared-Resource Matrix** — Kemmerer's covert-channel-analysis method as a playable exercise.
- **What Makes a Channel Covert?** — the conceptual core plus the trade-off triangle, computed live.
- **Defensive Takeaways**, **Glossary**, and an interactive **Quiz**.

Cross-cutting features:

- **Blind, scored detection challenge** — analysis, not recognition of a labelled example.
- **Live capacity / reliability / observability instrument** — computed from the actual seeded run (not presets) on every channel, with a sweep curve showing the trade-off move.
- **Named, cited detectors** — corrected conditional entropy (Gianvecchio & Wang 2007), Cabuk regularity (Cabuk et al. 2004), character-frequency divergence (Born & Gustafson 2010), the Westfeld–Pfitzmann chi-square attack, and permutation-capacity bounds — each with a known-answer test.
- **A learned detector beside the classical ones** — a two-feature logistic regression fitted on the *same two features* the hand-built timing detector already computes, so any difference comes from fitting alone. It makes **overfitting** countable (the gap between fit and held-out AUC) and **distribution shift** visible (a set of scheduled pollers and narrow-separation channels neither model was trained on), with the classical detector scored on identical sets as the fair comparison. Deterministic, and documented as a toy — see [VALIDATION.md](VALIDATION.md) §10.
- **Sender/receiver vs. defender view modes** on every channel.
- **Shareable, reproducible links** — the seed and view mode live in the URL hash (`#dns?seed=crypto-lab&mode=defender`), so an instructor can hand out an exact state.
- **Exportable lab notebook** — every channel section can copy the current run (link, seed, settings, decoded result, capacity/BER/observability, detector methods) as Markdown for a take-home or answer key.
- **Per-module learning outcomes** — each interactive section opens with a concise "by the end you can…" contract.
- **Toy messages only** — capped at 24 UTF-8 bytes; the point is understanding, not throughput.

## Screenshots

Run the lab locally (see below) and drop your own captures into `docs/screenshots/`
to illustrate this section. Good candidates:

- **Overview** — the text → bytes → bits pipeline and the "same bits, six carriers" preview.
- **Timing Channel** — the arrival timeline with the "the message is in *when* they arrived" reveal.
- **DNS Channel** — the simulated query log alongside the defender's anomaly panel.
- **Detection Console** — the at-a-glance anomaly gauges across all channels.

## For instructors

A complete teaching package ships with the repo:

- **[INSTRUCTOR-GUIDE.md](INSTRUCTOR-GUIDE.md)** — 30 / 60 / 90-minute lesson plans, a learning-outcome map, grading rubrics, and common-misconception corrections.
- **[docs/student-worksheet.md](docs/student-worksheet.md)** — a printable guided worksheet.
- **[docs/answer-key.md](docs/answer-key.md)** — model answers and talking points.
- **[docs/assessment.md](docs/assessment.md)** — a matched pre/post assessment.

Hand out an exact reproducible state with a seeded link (e.g. `…/#challenge?seed=crypto-lab`), and
have students export a **lab notebook** (Markdown) of each run from any channel's trade-off card.

## Architecture

A fully static site: vanilla JavaScript ES modules, no framework, no build step, no backend.

`​``
/
  index.html          — single-page app, all sections
  package.json        — type:module; scripts: test (node --test), serve (python http.server)
  .nojekyll           — so GitHub Pages serves the js/ folder as-is
  LICENSE (MIT), README.md, SECURITY.md
  /css   base.css (tokens/reset), layout.css, components.css, views.css
  /js
    app.js            — bootstrap + hash routing (seed/mode carried in the URL)
    state.js          — central seeded app state + pub/sub
    simulation.js     — deterministic orchestrator (encode -> channel -> decode -> detect)
    /channels  dns.js, icmp.js, timing.js, storage.js, ordering.js, http.js,
               hopping.js, stego.js, metadata.js, physical.js, cache.js
    /detectors anomaly.js, dnsDetector.js, icmpDetector.js, timingDetector.js,
               storageDetector.js, orderingDetector.js, httpDetector.js,
               hoppingDetector.js, stegoDetector.js, physicalDetector.js,
               cacheDetector.js, learnedDetector.js (fitted, not hand-built)
    /analysis  tradeoff.js (live capacity/reliability/observability),
               challenge.js (blind detection cases),
               validation.js (ROC/AUC benchmark),
               warden.js (active-warden / normalizer lab),
               learned.js (overfitting & distribution-shift experiment)
    /views     one *View.js per section (overview, dns, icmp, timing, storage,
               ordering, http, hopping, stego, metadata, physical, cache,
               detection, challenge, validation, warden, compare, atlas, srm,
               concepts, defense, glossary, quiz, tradeoffView) plus shared
               helpers (dom.js, blocks.js, charts.js, controls.js, widgets.js)
    /content   glossary.js, quiz.js, comparison.js, references.js, atlas.js, copy.js
    /utils     utf8.js, bits.js, seededRandom.js, statistics.js (incl. published
               detection methods: CCE, Cabuk regularity, KL divergence, chi-square)
  /assets  sample-cover-image.png (small, generated locally)
  /test    node --test suites for utf8/bits/seededRandom/statistics, the published
           methods (known-answer), each channel, the detectors, and the orchestrator
`​``

Design principles:

- **Pure logic, separate views.** Channel encoders/decoders (`js/channels/`), detectors (`js/detectors/`), and utilities (`js/utils/`) are pure, DOM-free modules. They take plain data in and return plain data out. Views (`js/views/`) are the only code that touches the DOM.
- **Deterministic orchestration.** `simulation.js` runs the full pipeline — encode → channel → decode → detect — driven by a seeded PRNG, so results are reproducible.
- **Unit-tested under Node.** Because the logic modules never touch the DOM, they run unchanged under `node --test` with no browser, no mocks, and no build step.
- **Strict CSP, zero exfiltration surface.** A `<meta>` Content-Security-Policy tag; no external network requests, no analytics, no cookies.

## Channel taxonomy

> **This table is the lab's own five-way framing, not the published pattern catalog.** "Protocol-shaped tunneling" and the rest are our categories for sorting the modules; they appear nowhere in Wendzel, Zander, Fechner & Herdin's *Pattern-Based Survey and Categorization of Network Covert Channel Techniques* (ACM CSUR 47(3), 2015). That paper's catalog is **eleven numbered patterns**, P1–P11, in two families, and it is reproduced in full — with its own names and numbering — in the in-app **Carrier Atlas**, not here. Keeping the two apart matters, because they collide productively: this table has no *ordering* row at all, while the catalog has two patterns for order sitting on opposite sides of the storage/timing line (P2 Sequence, within one PDU; P10 PDU Order, across PDUs, filed under **timing**); and the DNS-labels and image-LSB rows below, which are perfectly comfortable here, have **no pattern in the catalog at all**, because it excludes payload-carrying channels by its own scope sentence. Staging that disagreement is the most useful thing the Atlas does.

| Category | Where the hidden bits live | Example in the lab | Is it a covert channel? |
| --- | --- | --- | --- |
| Storage channel | In a *value* — a field not meant to carry data | Simulated header field bits | Yes — classic covert storage channel |
| Timing channel | In *when* events occur | Inter-event gap encoding | Yes — classic covert timing channel |
| Protocol-shaped tunneling | Inside a legitimate protocol's structure | Data in simulated DNS query names | Carrier abuse; covert only insofar as it blends in |
| Steganography | Inside *other content* | Image LSB embedding | Hidden data in media; related but distinct discipline |
| Encrypted tunnel (SSH/HTTPS) | Content is encrypted, but the tunnel itself is visible | Discussed conceptually | Usually **no** — it hides content, not existence or purpose |

The key distinction the lab hammers on: **hiding content is not the same as hiding the existence or purpose of communication.** An HTTPS session hides what you said; it does not hide that you said something, to whom, or (often) roughly what kind of thing it was.

## Safety boundaries

This is a controlled, entirely client-side simulation built for understanding and detection, not operation:

- Every "packet," "query," "resolver," "server," and "timing event" is a plain JavaScript object rendered in the browser.
- Simulated domains use the reserved documentation TLD `.test` (e.g., `example.test`), which cannot resolve on the public Internet.
- The site makes **no network requests at all** beyond loading its own static files, enforced by a strict Content-Security-Policy.
- Messages are toy-sized (max 24 UTF-8 bytes) and exist only in browser memory.
- The lab never claims any channel is "undetectable" or "invisible" — a core teaching point is that every channel has an observable footprint, and comparisons are ranked by educational value, never by stealth.

## What this project intentionally does not do

This project **does not transmit covert network traffic and does not provide an operational tunnel of any kind.** It is a simulation for education and defense. The following are deliberately, permanently out of scope:

- No raw sockets, packet crafting, or packet injection.
- No live DNS tunneling — no real DNS queries encode any data, ever.
- No ICMP tunneling or any real ICMP traffic. The ICMP Echo Channel is a simulated log of plain JavaScript objects addressed to RFC 5737 documentation ranges; no packet is crafted, sent, or received.
- No command-and-control (C2) functionality of any kind.
- No data exfiltration capability — nothing leaves the browser.
- No remote destinations, endpoints, listeners, or receiver servers.
- No real network transmission between a sender and a receiver — "sender" and "receiver" are two panels rendering the same in-memory objects.
- No evasion tooling, no "stealth mode," and no guidance on defeating monitoring.

If you want to study covert channels operationally, do so only in an isolated lab environment you own, under an authorization that covers it. This project will not help you do it on a real network — by design.

## How to run locally

`​``bash
git clone https://github.com/<your-username>/crypto-lab-covert-channel-studio.git
cd crypto-lab-covert-channel-studio
python3 -m http.server 8080     # or: npm run serve
`​``

Then open <http://localhost:8080>.

> **Note:** opening `index.html` directly via `file://` will **not** work. The app uses native ES modules, which browsers only load over `http(s)`. Any static file server works; no build step is required.

## Deploying to GitHub Pages

The site is fully static — no build step and no server-side code — so it publishes as-is.

### Option A — GitHub Actions (recommended, automatic)

This repo ships a workflow at `.github/workflows/deploy-pages.yml` that runs the test
suite and then deploys the whole site on every push to `main`.

1. Push the repository to GitHub (`main` branch).
2. In **Settings → Pages**, set **Source** to **GitHub Actions**. (The workflow also
   attempts to enable Pages automatically on its first run.)
3. Push any commit to `main`. The **Deploy to GitHub Pages** workflow builds nothing,
   runs `node --test`, and publishes the site. The live URL appears in the workflow's
   *deploy* job summary.

### Option B — Deploy from a branch (zero config)

In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`.
The included `.nojekyll` file tells Pages to skip Jekyll so every file (including the
`js/` modules) is served exactly as-is.

### Notes

- A project site is served from `https://<user>.github.io/<repo>/`. All asset and module
  paths in this project are **relative**, so it works correctly under that subpath with no
  `<base>` tag or configuration.
- A friendly `404.html` is included for mistyped URLs; navigation within the exhibit uses
  in-page `#` fragments, so normal use never leaves `index.html`.

## Running the tests

`​``bash
npm test          # or: node --test
`​``

Tests use the Node.js built-in test runner (`node --test`). They cover the utilities (`utf8`, `bits`, `seededRandom`, `statistics`) and every channel and detector pair. Because the simulation logic is DOM-free and seeded, the tests are **deterministic** — no browser, no flakiness, no network.

## Accessibility

- Semantic HTML with proper landmarks and heading structure.
- Full keyboard navigation with visible focus indicators.
- `prefers-reduced-motion` respected — animations and timing visualizations degrade gracefully.
- Sender/receiver and defender view modes are reachable and operable without a pointer.
- Meaning is never carried by colour alone (bits, anomaly levels, and status all pair colour with a glyph or label).
- An **automated accessibility gate** (`test/a11y.test.js`) renders every view in both modes and fails the build if any control lacks an accessible name or any scrollable region is not a focusable, labelled region.

## Browser support

Modern evergreen desktop browsers (current Chrome, Firefox, Edge, Safari). The app relies on native ES modules and modern CSS; no transpilation or polyfills are provided.

## Limitations

Be honest about what this is:

- **It is a simulation.** Real networks add noise, middleboxes, retransmission, and adversarial monitoring that no browser demo reproduces.
- **Simple statistics are indicators, not verdicts.** The detection console uses entropy, frequency, and regularity measures as teaching instruments. Real detection pipelines combine many signals, baselines, and context; a lit indicator here means "worth a look," never "proven covert channel."
- **Toy messages only.** The 24-byte cap keeps every example small enough to trace bit-by-bit; nothing here says anything about real-world channel capacity.

## References

A curated, annotated reference list also appears in-app (see the References panel). Two anchor works ground the material:

- Butler W. Lampson, *A Note on the Confinement Problem* (1973) — the paper that introduced covert channels as a formal concern.
- The NCSC covert channel analysis guidance (the "Light Pink Book" of the Rainbow Series) — the classic treatment of identifying and measuring storage and timing channels in evaluated systems.

## License

MIT — see [LICENSE](LICENSE).

```

</details>

---
