# Build brief — `crypto-lab-locks-and-keys`

**2026-10-03. Brief only; no repository exists yet.** Written against
`audits/_MASTER-TEMPLATE.md`; §0 principles, §1 build, §2 teach, §3 look, §4 accessibility,
§5 README and §6 deploy all apply unchanged. Decided in
`audits/BEGINNER-ONRAMP-2026-10-03.md`.

```
NEW DEMO BRIEF
- Repo name:         crypto-lab-locks-and-keys
- Short name (H1):   Locks and Keys
- Subtitle:          Public and private keys - RSA-OAEP - RSA-PSS
- One-liner:         Generates a real key pair, encrypts a message to the public half and
                     decrypts it with the private half, then uses the same pair the other way
                     round to sign.
- Concept to teach:  A public key is a padlock anyone may close and only you can open - and
                     running the same pair backwards is what a signature is.
- Primitives/spec:   RFC 8017 (RSA-OAEP, RSA-PSS), via WebCrypto SubtleCrypto
- Accent (--accent): [central assignment]
- Favicon emoji:     [central assignment]
- In scope:          key generation, encrypt-to-public / decrypt-with-private, wrong-key failure,
                     the same pair used in reverse to sign and verify
- Non-goals:         the number theory (Educational RSA owns it), key sizes and performance
                     (Iron Letter owns it), hybrid encryption and KEMs, certificates
```

## Why RSA and not a curve

The padlock story is **literal** for RSA-OAEP and only approximate for the elliptic-curve
shape. With RSA the reader encrypts directly to the public key: one key closes the lock, the
other opens it, and there is nothing else on screen. ECIES and HPKE need an ephemeral key pair
and a key-derivation step before anything is encrypted — true to how the modern web works and
one concept too many for the first time someone meets the idea.

So the lab uses `RSA-OAEP` and `RSA-PSS` through WebCrypto, with **no library at all**, and
says plainly in-page that most systems today use the curve-based shape instead, linking to
**Iron Letter** (which compares ECIES P-256 against RSA-OAEP directly) and **HPKE Envelope**.
That honesty note is §0.2, not an apology: a beginner lab that quietly implies RSA is what
HTTPS uses would be teaching something false in order to be simple.

## Scope — four panels

1. **Make a pair.** One button. The private half is generated and never displayed in full; the
   public half is shown and copyable. Plain sentence: *"Hand the public one to anybody. It can
   only close the lock."*
2. **Close the lock.** Type a short message, encrypt it **to the public key**. The ciphertext is
   shown as unreadable bytes. Note in-page: the private key was not used and was not needed.
3. **Open it.** Decrypt with the private key — the message comes back. Then try a **second,
   freshly generated** private key and watch it fail. Failure is the point of the panel, not an
   error state.
4. **The same pair, backwards.** Sign the message with the private key, verify with the public
   key, then change one character and watch verification fail. This is the panel that earns
   the lab its place: most newcomers believe signing is a separate mechanism.

## Keeping it real with the maths hidden

Every operation is `crypto.subtle` on a real 2048-bit key pair. **No modulus, no exponent, no
`c = m^e mod n` anywhere on the page.** The words *prime*, *modulus* and *exponent* do not
appear outside the one link to **Educational RSA**, which exists precisely to show that layer
and is the right place to send a reader who asks "but how?".

A `<details>` disclosure carries the actual public key and ciphertext bytes for anyone who
wants them, closed by default (the shape §0.3 asks for, and the shape `crypto-lab-ed25519-forge`
now opens with).

## Visual semantics

Closed lock and open lock as the two states, always with icon plus text plus colour. The
**wrong-key failure is a correct outcome** and must not read as a system error: it is the
padlock doing its job, shown as a calm "this key does not open that lock", not a red alarm.
Reserve alarm colouring for a state where something that should have failed did not.

## Tests

- KATs are not available for a random key pair, so correctness is asserted by round-trip plus
  **cross-pair rejection**: a message encrypted to pair A never decrypts under pair B, and a
  signature from pair A never verifies under pair B, over many generated pairs.
- A pinned RSA-OAEP / RSA-PSS vector from RFC 8017's test data verifies in the browser, so the
  lab has at least one check against the publication rather than against itself.
- `e2e/claims.spec.ts` asserts each panel's verdict from the computed result (§4.1b).
- §4.1c mutations per verdict — decryption that always returns the plaintext, verification that
  always accepts, the wrong-key path silently reusing the right key — each required to turn a
  NAMED test red, with baseline-passed and bundle-hash-moved asserted first.
- §4.1d: a passing test that a correct decryption does **not** establish who sent the message —
  anyone with the public key could have encrypted it. That is the non-promise this lab is most
  likely to leave a reader believing, and it is also the reason panel 4 exists.

## Links out

**Educational RSA** for the number theory. **Iron Letter** for the curve-based comparison and
the key-size trade-off. **HPKE Envelope** for how it is actually packaged today. Named because
this brief was written against them; the catalog may hold others.
