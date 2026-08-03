# Crypto Lab Bitcoin Wallet — Suggestions

## Overall Assessment

Bitcoin Wallet is one of the collection’s strongest mechanism-first labs.

The recent work materially improved its trustworthiness. The browser claims suite now checks the values behind the visible conclusions rather than merely checking for expected words:

- Base58Check and Bech32 addresses are independently decoded and tied back to the displayed HASH160.
- The intermediate SHA-256 stage is recomputed outside the application.
- The BIP-39 strip is checked cell by cell: 128 entropy bits, 4 checksum bits, twelve 11-bit bands, and twelve word indices.
- The known-answer panel must show equal full values, not matching prefixes.
- Malformed derivation paths and fractional indices are rejected.
- A checksum verdict retires immediately after the phrase changes.
- The mnemonic drill’s delayed error timer no longer erases a later correct answer.
- QR matrices are compared with an independent reference encoder and decoded through a separate reader.

Those are substantial improvements. The lab is no longer just visually polished; many of its most important teaching claims are now executable assertions.

The remaining priorities are mainly about wallet interoperability and safety boundaries.

## What Improved Most

### 1. The Address Pipeline Is Now Independently Audited

The page does not merely print a `1…` and `bc1…` string. The claims suite independently decodes both and proves that:

- the P2PKH payload is the displayed HASH160;
- the Base58Check checksum is valid;
- the Bech32 HRP is `bc`;
- the witness version is `0`; and
- the P2WPKH witness program is the same displayed HASH160.

That is exactly the right kind of browser-level assertion for this lab.

### 2. The BIP-39 Bit Strip Is a Strong Teaching Device

The visual path from 128 entropy bits plus four checksum bits into twelve 11-bit word indices is one of the best parts of the exhibit.

The new tests ensure that the visual accounting is mathematically consistent rather than decorative.

### 3. Official Vectors Are Compared in Full

The earlier prefix-only comparisons could have displayed a green result over a wrong value. The current implementation compares the complete BIP-32 extended keys and the full BIP-39 seed, truncating only what the learner sees.

That is a major credibility improvement.

### 4. Path Parsing Is Much Safer

Rejecting malformed path segments and non-integer receive indices prevents a dangerous teaching failure: silently deriving index zero while displaying a malformed path.

### 5. QR Encoding Is Now Substantively Tested

The fixed data placement and format-information placement bugs show why independent decoding matters. The encoder now has tests that would catch a plausible-looking but unreadable QR symbol.

## Priority Recommendations

### 1. Default to Testnet or Signet, Not Mainnet

This is the highest-priority safety change.

The page currently creates:

- valid random mainnet private keys;
- mainnet WIF strings;
- valid `1…` and `bc1…` mainnet addresses;
- copy buttons for those secrets; and
- scannable payment QR codes.

It also generates one automatically on page load before the visitor presses **Generate key**.

The warnings are good, but a learner can still accidentally send real Bitcoin to a key created in an ordinary browser tab.

Recommended design:

- Make **testnet/signet** the default live network.
- Use the appropriate network values:
  - P2PKH version `0x6f`;
  - WIF version `0xef`;
  - Bech32 HRP `tb`;
  - BIP-44 coin type `1'`.
- Put mainnet behind a deliberate **Show mainnet-format examples** switch with a warning.
- Use deterministic published vectors for mainnet demonstrations rather than fresh random mainnet secrets.
- Remove the automatic random-key generation on initial page load. Show placeholders until the learner explicitly starts the experiment.

This preserves the exact same cryptographic lesson while making accidental funding much less likely.

### 2. Align Derivation Paths with Address Types

The default path is:

```text
m/44'/0'/0'/0/0
```

That is the BIP-44 legacy-account subtree. The page then produces both:

- a P2PKH address; and
- a native P2WPKH address

from the same leaf key and presents both in the first-five-address table.

The arithmetic is valid, but it does not teach interoperable wallet discovery correctly. Dedicated purpose subtrees exist so recovery software knows which output type to scan:

- `44'` — legacy P2PKH;
- `49'` — nested SegWit P2SH-P2WPKH;
- `84'` — native SegWit P2WPKH;
- `86'` — single-key Taproot P2TR.

A wallet restored from seed may miss funds when an address type is created under a purpose subtree it does not expect.

Recommended UI:

| Account type | Standard path | Address |
|---|---|---|
| Legacy | `m/44'/0'/0'/0/i` | `1…` P2PKH |
| Nested SegWit | `m/49'/0'/0'/0/i` | `3…` P2SH-P2WPKH |
| Native SegWit | `m/84'/0'/0'/0/i` | `bc1q…` P2WPKH |
| Taproot | `m/86'/0'/0'/0/i` | `bc1p…` P2TR |

Let the learner select the account type, then derive the matching address and script.

The existing “same key, two encodings” panel can remain as a low-level demonstration, but it should explicitly say:

> The same public-key hash can be wrapped in different output scripts, but real HD wallets normally separate script types into dedicated purpose subtrees for reliable recovery.

### 3. Correct the BIP-39 “Last Word” Explanation

The current copy says:

> The last word is therefore a checksum word — typing one wrong word makes the whole phrase fail to validate.

That is not precise.

For a 12-word phrase, the final 11-bit word contains:

- seven entropy bits; and
- four checksum bits.

It is not purely a checksum word.

Also, a 4-bit checksum does not reject every possible one-word mutation. Roughly one out of sixteen random corruptions can still happen to carry a valid checksum. The new **Mangle the last word** implementation deliberately searches for a mutation that fails, which is fine for a deterministic lesson, but the surrounding prose must not imply universal detection.

Recommended wording:

> In a 12-word mnemonic, the final word contains seven entropy bits and four checksum bits. Most accidental word changes fail validation, but the checksum is only typo detection—not proof that a phrase is the intended wallet.

Update the seed-step card, README, glossary, safety text, and any tooltip saying a single wrong word always fails.

### 4. Fix CKDpriv Retry at the Index Boundaries

`deriveChild()` determines whether derivation is hardened once, before its retry loop:

```text
const hardened = index >= 0x80000000
```

It then increments `i` when `IL >= n` or the child key is zero.

Two boundary problems remain:

#### Normal boundary

If normal index `0x7fffffff` is invalid, incrementing produces `0x80000000`. The loop still uses the non-hardened data construction because `hardened` was computed from the original index, while the serialized index now has its hardened bit set.

#### Uint32 boundary

If hardened index `0xffffffff` is invalid, incrementing produces `0x100000000`. `ser32()` truncates that value back to zero, potentially continuing under a wrapped index.

Recommended implementation:

- Define the maximum retry index for the selected domain:
  - normal: `0x7fffffff`;
  - hardened: `0xffffffff`.
- Never cross from normal to hardened derivation during an implicit retry.
- Never exceed uint32.
- Return a clear failure when no next index exists.
- Add injected-HMAC tests that force invalid derivation at both final indices.

### 5. Validate the BIP-32 Master Secret Explicitly

`masterKeyFromSeed()` uses `IL` directly as the master private key.

BIP-32 defines the master key as invalid when:

```text
parse256(IL) == 0
```

or:

```text
parse256(IL) >= n
```

The current code eventually relies on secp256k1 key generation to reject a bad value rather than implementing and naming the BIP-32 condition itself.

Recommended changes:

- Check `IL` before constructing the public key.
- Throw a specific `invalid BIP-32 master key` error.
- Add an injectable HMAC to the master-key function so both invalid branches can be forced in tests.
- Explain that an implementation should request new seed material rather than silently alter the seed.

### 6. Treat Secrets Differently from Public Values

The page offers one-click clipboard copying for:

- raw private key;
- WIF;
- mnemonic;
- BIP-39 seed;
- BIP-32 master private key; and
- derived private keys.

That is convenient for a demo but teaches a behavior real wallet software should discourage. Clipboard history, browser extensions, remote-desktop tools, and other applications may observe clipboard contents.

Recommended UX:

- Keep public-key and address copy buttons visible.
- Hide secret values by default behind **Reveal teaching secret**.
- Require a second explicit action before copying a secret.
- Display a warning beside the copy action:
  > Copying places this secret in the operating-system clipboard.
- Automatically re-mask secret displays after a short period.
- Add a **Clear generated secrets** control that drops application references and clears the rendered text.
- State honestly that JavaScript cannot guarantee memory zeroization.

### 7. Add a BIP-39 Passphrase Experiment

The engine already supports the optional BIP-39 passphrase, but the interactive flow always derives with an empty passphrase.

This omits one of the most important recovery hazards.

Add an optional passphrase field with:

- show/hide control;
- a warning not to type a real passphrase;
- side-by-side seed fingerprints for empty and non-empty passphrases; and
- a demonstration that every passphrase produces a wallet.

The critical lesson:

> A wrong BIP-39 passphrase does not produce a checksum error. It silently produces a completely different, valid wallet.

Also avoid describing the passphrase as automatically creating “two-factor authentication.” It is an additional secret mixed into wallet derivation, but whether it functions as a separate factor depends on storage and operational practice.

### 8. Replace the Memorization Framing

The drill begins:

> A backup you cannot recall is no backup.

That can unintentionally encourage relying on human memory for wallet recovery.

A seed phrase should be backed up durably; memory can be supplementary but should not be the only recovery mechanism.

Rename the feature:

> **Verify your written backup**

Recommended framing:

> Wallets often ask users to re-enter the words to confirm that the backup was recorded correctly. This is a verification exercise, not advice to rely on memory alone.

The shuffled-word interaction can remain unchanged.

### 9. Show the Output Scripts, Not Only the Address Encodings

The page currently moves from HASH160 to two address strings. That can make the formats look like two cosmetic encodings of exactly the same destination.

Add the script layer:

#### P2PKH

```text
OP_DUP OP_HASH160 <20-byte HASH160> OP_EQUALVERIFY OP_CHECKSIG
```

#### P2WPKH

```text
0 <20-byte HASH160>
```

Then explain:

- the same key hash is embedded;
- the resulting UTXO locking scripts differ;
- the spending serialization differs; and
- the addresses are not interchangeable labels for one UTXO.

This would make the transition from “address mechanics” to actual Bitcoin spending semantics much clearer.

### 10. Add Taproot and Bech32m as the Modern Endpoint

The current pipeline ends with native SegWit v0 P2WPKH. That is still valid and widely used, but the modern single-key address path is also worth showing:

- BIP-86 derivation: `m/86'/0'/0'/0/i`;
- x-only public key;
- Taproot output-key tweak;
- witness version 1;
- 32-byte witness program; and
- Bech32m `bc1p…` encoding.

This should be a separate panel rather than forcing the current generic `bech32Address()` helper to support all witness versions without validation.

### 11. Make the Bech32 API Type-Specific

`bech32Address()` accepts an arbitrary witness program, HRP, and version, but always uses the original Bech32 checksum constant.

That is correct for witness version 0, which is the only way the lab currently calls it. It would be wrong for witness version 1 or later, which require Bech32m.

Recommended design:

- Rename the current helper to `p2wpkhAddress()` and require a 20-byte program.
- Add strict version and length checks.
- Implement a separate SegWit-address encoder that selects:
  - Bech32 for version 0;
  - Bech32m for versions 1–16.
- Add BIP-350 vectors before adding Taproot.

### 12. Improve the Private-Key Description

The content says:

> A Bitcoin private key is just 256 bits of randomness.

More precisely, it is a uniformly selected integer in:

```text
1 <= k < n
```

where `n` is the secp256k1 group order.

Not every 256-bit string is a valid private key. The Noble generator handles this correctly, but the teaching copy should match the implementation.

Recommended wording:

> A wallet samples 256-bit candidates until it obtains an integer from 1 through secp256k1’s group order minus one.

### 13. Correct the Chain-Code Description

The page says the chain code:

> authorises future derivations.

The chain code is an HMAC input/key used to derive descendants. It is not an authorization token in the usual security sense.

Use:

> The right 32 bytes become the chain code, which supplies the additional HMAC material used for child derivation.

### 14. Tighten the xpub Teaching

The concept card says:

> xpub can watch, only the seed can spend.

That is too absolute.

Private descendants and extended private keys can spend without possessing the original mnemonic. Also, an xpub is highly privacy-sensitive because it reveals the entire derivable address graph.

Recommended wording:

> An xpub cannot sign, but it can derive and monitor all non-hardened descendant addresses. Any corresponding private key or xprv can spend.

This lab is also well suited for a powerful adversarial exercise:

> **Parent xpub + one leaked non-hardened child private key → recover the parent private key.**

That demonstration would make the hardened-versus-normal boundary concrete and explain why account-level nodes are hardened.

### 15. Guard Extended-Key Serialization Limits

The extended-key depth field is one byte. `serializeXprv()` and `serializeXpub()` currently mask depth with:

```text
depth & 0xff
```

A path deeper than 255 segments therefore wraps silently.

Add:

- `0 <= depth <= 255` validation;
- uint32 validation for the child index;
- exact 32-byte chain-code validation;
- exact private/public key-length validation; and
- a path-depth limit before derivation begins.

Do not silently truncate values during serialization.

### 16. Use a Four-Module QR Quiet Zone

The QR renderer defaults to two modules, while the UI requests three.

Use four modules around payment QR codes for standards-aligned scanner compatibility. Also ensure the rendered symbol always has:

- dark modules;
- a solid light background;
- no theme-driven inversion; and
- sufficient physical module size.

The matrix tests are excellent, but add one rendered-SVG test that checks the quiet zone and explicit light background.

### 17. Consolidate the Browser Test Harnesses

The repository now has two browser systems:

- a modern Playwright suite under `e2e/`; and
- the older Puppeteer `tests/browser-e2e.mjs`.

The latest commit notes that `npm run test:e2e` still fails in the legacy Puppeteer harness because it clicks the shared-header-hidden `#theme-toggle`.

At the same time, `npm run test:a11y` actually runs every Playwright file, including the claims suite, because the script is simply `playwright test`.

Recommended scripts:

```json
{
  "test:e2e": "playwright test",
  "test:a11y": "playwright test e2e/a11y.spec.ts",
  "test:claims": "playwright test e2e/claims.spec.ts"
}
```

Then either remove the Puppeteer harness or rename it `test:legacy-e2e` until its remaining unique assertions are migrated.

Update the README so the command names describe what they actually execute.

### 18. Confirm the Playwright Port Is Unique Across the Fleet

The legacy harness received a unique port because shared ports could make it test another lab. Playwright still uses port `4222`.

Given the number of repositories in the collection, confirm that `4222` is unique. If it is shared, assign Bitcoin Wallet its own port and keep `--strictPort`.

### 19. Correct Overbroad Wallet-Ecosystem Statements

The README says BIP-32/39/44 are the standard behind Ledger, Trezor, Electrum, and MetaMask.

This needs nuance:

- Electrum-generated seed phrases use Electrum’s own seed-version system by default, although Electrum can import BIP-39 phrases.
- MetaMask uses BIP-39-style recovery phrases and BIP-44-family derivation for Ethereum accounts, but it is not a Bitcoin wallet.
- Bitcoin wallets vary in script types, descriptors, seed formats, and account-discovery behavior.

Recommended wording:

> BIP-32 and BIP-39 are widely used across hardware and software wallets, while BIP-44, BIP-49, BIP-84, and BIP-86 define common account paths for particular coins and Bitcoin output types. Some wallets use their own seed formats or discovery rules.

Replace “every modern wallet” with “many HD wallets.”

### 20. Distinguish the Mnemonic, Seed, Master Key, and Spend Keys

Several phrases collapse these layers into “the seed is the money.”

A clearer chain is:

```text
entropy
  → mnemonic words
  + optional passphrase
  → 64-byte BIP-39 seed
  → BIP-32 master extended private key
  → child private keys
  → signatures
```

Each layer has different recovery and exposure consequences.

For example:

- words without the correct passphrase may not recover the intended wallet;
- the 64-byte seed is not the same value as the words;
- a child private key can spend its own outputs without revealing the root;
- an xpub cannot sign but can destroy privacy.

Use those distinctions consistently in the hero, safety cards, and seed panel.

## Recommended Test Additions

The existing tests are already a major strength. The next high-value cases are:

1. BIP-32 master `IL = 0` is rejected.
2. BIP-32 master `IL >= n` is rejected.
3. CKDpriv invalid result at normal index `0x7fffffff` fails without crossing into hardened mode.
4. CKDpriv invalid result at `0xffffffff` fails without wrapping.
5. Extended-key depth `256` is rejected rather than serialized as zero.
6. A BIP-44 path produces only the legacy-account result in the standards view.
7. BIP-84 official vectors produce the expected P2WPKH address.
8. BIP-86 official vectors produce the expected P2TR address.
9. Witness v1 encoding uses Bech32m, while witness v0 uses Bech32.
10. The BIP-39 copy states that the final word mixes entropy and checksum bits.
11. A deliberately selected one-word mutation that still has a valid checksum is shown as valid, proving that checksum success is not identity.
12. Testnet mode uses the correct address, WIF, HRP, and coin-type values.
13. No secret or address is generated automatically before user action.
14. Secret copy controls require explicit reveal/confirmation.
15. QR SVGs contain a four-module quiet zone and a light background.
16. The full Playwright claims suite blocks deployment.
17. `npm run test:e2e` is green and maps to the maintained harness.

## Suggested Teaching Sequence

A compact navigator would help visitors understand the structure:

> Random key → Public key → Output scripts → Addresses → Mnemonic bits → BIP-39 seed → HD paths → Account types → Recovery hazards

The account-type panel should connect the separate concepts:

```text
same root seed
  ├─ 44' → legacy P2PKH
  ├─ 49' → nested SegWit
  ├─ 84' → native SegWit
  └─ 86' → Taproot
```

That would turn the current address generator and HD-wallet section into one coherent recovery story.

## Final Verdict

Bitcoin Wallet is already one of the better Crypto Labs because it combines:

- real browser cryptography;
- official vectors;
- inspectable bytes;
- independent address decoding;
- an unusually good BIP-39 visualization;
- QR generation;
- HD derivation; and
- strong browser-level claims tests.

The biggest remaining weakness is not primitive correctness. It is that the page teaches a legacy BIP-44 path while simultaneously producing modern address types from it, and it creates valid mainnet secrets too casually for a safety-focused educational page.

The strongest next release would therefore:

1. default to testnet or signet;
2. separate BIP-44, 49, 84, and 86 account paths;
3. correct the BIP-39 checksum wording;
4. fix BIP-32 boundary retries and master-key validation;
5. gate secret reveal/copy behavior; and
6. consolidate the browser tests around Playwright.

With those changes, the lab would move from an excellent key-and-address visualizer to a much more complete and interoperable model of how real Bitcoin wallet recovery works.

## Standards Referenced

- BIP-32 — Hierarchical Deterministic Wallets
- BIP-39 — Mnemonic code for generating deterministic keys
- BIP-44 — Multi-Account Hierarchy for Deterministic Wallets
- BIP-49 — P2WPKH nested in P2SH account derivation
- BIP-84 — Native P2WPKH account derivation
- BIP-86 — Single-key P2TR account derivation
- BIP-173 — Bech32 witness-v0 address encoding
- BIP-350 — Bech32m for witness versions 1–16
