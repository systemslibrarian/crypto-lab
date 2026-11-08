# Crypto Lab audit corpus — KEY EXCHANGE

Generated 2026-11-08T20:20:28.593Z from 21 lab record(s).

Every finding must cite **commit_sha + lab slug + field**. A field printed as
`MISSING` was not found by the generator; it is not a claim that the lab lacks it.

---
## Ratchet Wire

- **slug**: `crypto-lab-ratchet-wire`
- **repo**: https://github.com/systemslibrarian/crypto-lab-ratchet-wire
- **live**: https://systemslibrarian.github.io/crypto-lab-ratchet-wire/
- **commit_sha**: `fc14fecf8610dd8c8fea5ed9b9aa4c6e629b67fe` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `b55e343d11d31be25de45138dc1561a1bb73cc29`
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | PROTOCOLS  ·  **level**: intermediate  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, claims, mutations, verification

**Name (H1)**: Ratchet Wire  — _read from ratchet-wire/index.html_

**Subtitle**: Double Ratchet · Classical and hybrid session setup  — _read from ratchet-wire/index.html_

**Description**: Send messages over an untrusted channel and watch the symmetric and DH ratchets advance the keys step by step, live.  — _read from ratchet-wire/index.html_

**Why it matters**: See how a conversation replaces its encryption keys. Compare classical setup with a real post-quantum KEM, then learn why current Signal also uses a continuing post-quantum ratchet.  — _read from ratchet-wire/index.html_

**Card copy**: Compare classical X3DH and real ML-KEM-1024 hybrid setup, then exchange messages through the Double Ratchet. Explains the continuing post-quantum ratchet used by current Signal.

**Chips**: Double Ratchet · X25519 · HKDF · AES-256-GCM

**Implements**: AES `ratchet-wire/src/crypto/double-ratchet.ts:309`, AES-GCM `ratchet-wire/src/crypto/double-ratchet.ts:300`, Diffie-Hellman `ratchet-wire/src/crypto/dh-ratchet.ts:72`, Double Ratchet `ratchet-wire/src/main.ts:8`, Ed25519 `ratchet-wire/src/crypto/ed25519.ts:25`, HKDF `ratchet-wire/src/crypto/hkdf.ts:32`, ML-KEM `ratchet-wire/src/crypto/hybrid-session.ts:11`, SHA-256 `ratchet-wire/src/crypto/hkdf.ts:53`, X25519 `ratchet-wire/src/crypto/dh-ratchet.ts:20`, X3DH `ratchet-wire/src/crypto/session-init.ts:151`

**Attacks shown**: Man-in-the-middle `ratchet-wire/src/main.ts:494`, Nonce reuse `README.md:24`, Side-channel (unspecified) `ratchet-wire/README.md:10`

**Comment-only (named in code comments, not executed)**: EdDSA `ratchet-wire/src/crypto/ed25519.ts:4`, HMAC `ratchet-wire/src/crypto/hkdf.ts:2`, Kyber `ratchet-wire/src/crypto/hybrid-session.ts:8`, PQXDH `ratchet-wire/src/crypto/hybrid-session.ts:2`, X448 `ratchet-wire/src/crypto/session-init.ts:25`

**References**: ECDH, EdDSA, Kyber, MLS, Noise protocol, PQXDH, X448

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 203` — first seen README.md:46 (3×)
- `FIPS203` — first seen README.md:48 (1×)
- `RFC 5869` — first seen ratchet-wire/index.html:1036 (6×)
- `RFC 7748` — first seen ratchet-wire/index.html:1042 (3×)
- `RFC 8032` — first seen ratchet-wire/src/crypto/ed25519.ts:4 (1×)
- `rfc5869` — first seen ratchet-wire/index.html:1035 (2×)
- `rfc7748` — first seen ratchet-wire/index.html:1041 (2×)
- `rfc8032` — first seen ratchet-wire/src/crypto/ed25519.ts:5 (1×)

**Stated limitations (page)**:

- _(disclaimer, ratchet-wire/index.html)_ ⚠️ Educational demo — not for production. Ratchet Wire exists to teach how the Double Ratchet works. It runs entirely in your browser with no real contacts, servers, or network traffic. Don't use this code to protect real secrets: it is unaudited, keeps no persistent state, uses a simplified identity model (separate Ed25519 + X25519 keys rather than XEdDSA), and does not address the many side-channels and operational concerns a real messenger must. For genuine end-to-end encryption, use a vetted library such as libsignal(opens in new tab).
- _(disclaimer, ratchet-wire/index.html)_ Classical-mode deviation — the F prefix is omitted. Real X3DH does not hash the DH outputs bare. X3DH §2.2(opens in new tab) defines KDF(KM) = HKDF(F ‖ KM, …), where F is 32 bytes of 0xFF for X25519 (57 bytes for X448). F is there for cryptographic domain separation with XEdDSA. This demo computes HKDF(DH1 ‖ DH2 ‖ DH3 ‖ DH4) with no F prefix, so the shared secret shown above is not the secret a spec-conformant X3DH would derive from the same keys — this demo is not interoperable with real X3DH or libsignal. Classical-mode keys reflect this legacy demo KDF. Hybrid mode includes the F prefix and a separate parameter-specific label.

**README — What Can Go Wrong**:

```text
- **Unauthenticated identity keys.** The handshake here does verify Bob's signed pre-key against his Ed25519 identity key and aborts if that signature fails, but the identity key itself arrives in-band; without pinning or comparing it out-of-band, an active attacker who substitutes the whole bundle can still mount a man-in-the-middle on the initial session setup.
- **Skipped-message key growth.** Out-of-order or dropped messages force the receiver to store skipped message keys; without a cap, an attacker can flood gaps and exhaust memory (a denial-of-service vector).
- **AES-256-GCM nonce reuse.** If a per-message key and nonce pair ever repeats, GCM's confidentiality and tag-forgery resistance collapse, so each message key must be used exactly once.
- **No post-compromise recovery without a DH step.** Forward secrecy protects past messages, but healing after a state compromise only happens once a fresh DH ratchet step runs; until then a stolen chain key keeps decrypting new messages.
- **Weak randomness defeats the ratchet.** The whole construction depends on unpredictable X25519 key pairs; a broken RNG makes ratcheting cosmetic and exposes keys regardless of the math.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-ratchet-wire

## What It Is

Ratchet Wire is a browser-based demonstration of the classical Double Ratchet with selectable simplified X3DH or real ML-KEM-1024 hybrid session setup. It uses X25519 for key agreement, HKDF-SHA256 for key derivation, and AES-256-GCM for encryption. It shows how two parties keep deriving fresh keys while exchanging messages over an untrusted channel. The algorithm solves the problem of end-to-end message confidentiality with forward secrecy and break-in recovery after a state compromise. Its security model is hybrid: asymmetric key agreement establishes and refreshes shared secrets, while symmetric ratchets derive per-message encryption keys.

## When to Use It

- Use it for asynchronous end-to-end messaging systems where each message needs its own fresh encryption key, because the Double Ratchet Algorithm is designed to preserve confidentiality across long conversations.
- Use it when you need forward secrecy and break-in recovery in a chat protocol, because compromised current state should not expose old traffic and should stop helping an attacker after a ratchet step.
- Use it for educational or prototype work that needs to illustrate X25519, HKDF-SHA256, AES-256-GCM, and Simplified X3DH together, because this demo exposes those pieces directly in the UI and source.
- Do NOT use this demo as a production messenger, because the Simplified X3DH implementation models the identity as separate Ed25519 and X25519 keys instead of Signal's XEdDSA, omits the pre-key server and pre-key rotation, and has no persistent state management.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-ratchet-wire](https://systemslibrarian.github.io/crypto-lab-ratchet-wire/)**

The demo lets you switch between Conversation, Session Handshake, Out of Order, Ratchet State, Forward Secrecy, Break-In Recovery, How It Works, and Test Yourself tabs while sending messages as Alice or Bob and watching the live root-key and chain-key state update. The Key State panel includes a convergence check proving both parties independently derived identical chain keys, and the live message-key timeline marks every DH ratchet with the root key it replaced. A guided tour and a reactive coach narrate each cryptographic event, and the Test Yourself tab closes the loop with an instant-feedback quiz. The setup controls switch between classical and hybrid sessions and select a one-time or last-resort KEM prekey. Starting a selected setup resets the conversation and exercises. The Session Handshake tab exposes the real DH/KEM derivation and an altered-ciphertext rejection experiment.

## What Can Go Wrong

- **Unauthenticated identity keys.** The handshake here does verify Bob's signed pre-key against his Ed25519 identity key and aborts if that signature fails, but the identity key itself arrives in-band; without pinning or comparing it out-of-band, an active attacker who substitutes the whole bundle can still mount a man-in-the-middle on the initial session setup.
- **Skipped-message key growth.** Out-of-order or dropped messages force the receiver to store skipped message keys; without a cap, an attacker can flood gaps and exhaust memory (a denial-of-service vector).
- **AES-256-GCM nonce reuse.** If a per-message key and nonce pair ever repeats, GCM's confidentiality and tag-forgery resistance collapse, so each message key must be used exactly once.
- **No post-compromise recovery without a DH step.** Forward secrecy protects past messages, but healing after a state compromise only happens once a fresh DH ratchet step runs; until then a stolen chain key keeps decrypting new messages.
- **Weak randomness defeats the ratchet.** The whole construction depends on unpredictable X25519 key pairs; a broken RNG makes ratcheting cosmetic and exposes keys regardless of the math.

## Real-World Usage

- **Signal** — X3DH and the classical Double Ratchet are historical foundations of the Signal Protocol and the constructions this lab teaches. Signal added PQXDH for session establishment, then announced [SPQR and the Triple Ratchet](https://signal.org/blog/spqr/) on 2 October 2025, combining a continuing post-quantum ratchet with the Double Ratchet. See the [current ratchet specification](https://signal.org/docs/specifications/doubleratchet/) and [PQXDH Wire](https://systemslibrarian.github.io/crypto-lab-pqxdh-wire/) for that distinction. This lab now implements a **PQXDH-style hybrid handshake** composed with its classical Double Ratchet: real ML-KEM-1024 encapsulation/decapsulation, signed curve and KEM prekeys, an initial authenticated ciphertext, and identity-associated data on subsequent messages. Separate Ed25519/X25519 identities, lab-specific encodings and labels, and the standardized ML-KEM wire format make it **non-interoperable with Signal clients**. It does not implement SPQR, ML-KEM Braid or the Triple Ratchet, so its recovery exercise demonstrates classical DH recovery rather than quantum post-compromise healing.
- **WhatsApp** — uses the Signal Protocol for end-to-end encrypted messages and calls across billions of users.
- **Google Messages (RCS)** and **Facebook Messenger / Messenger secret conversations** — adopt the Signal Protocol's Double Ratchet for their end-to-end encryption.
- **Matrix (Olm/Megolm)** — uses a Double Ratchet-derived construction for encrypted Matrix conversations.

## Hybrid setup and its limits

At the top of the demo, select **Hybrid PQXDH-style (ML-KEM-1024)** and press **Start selected setup**. The live conversation, out-of-order exercise, forward-secrecy exercise and recovery exercise use that setup. Classical mode remains available for comparison.

- Alice verifies both signed prekeys before encapsulating. A supplied, valid identity key is not an authenticated person: pin or compare its fingerprint through a trusted channel. The banner makes this distinction explicit.
- The new hybrid KDF uses `F || DH1 || DH2 || DH3 || DH4 || SS`, where `F` is 32 bytes of `0xFF`, zero SHA-256 salt and `RatchetWire-v1_CURVE25519_SHA-256_ML-KEM-1024` as the parameter-specific info string. The legacy classical KDF and its pinned vectors are preserved.
- Bob independently decapsulates, derives SK and authenticates the initial AES-GCM confirmation before accepting. ML-KEM implicit rejection is confirmed by AEAD; a changed KEM ciphertext cannot silently establish a usable session.
- Identity-associated data binds the two DH identities, Bob’s separate signing identity and the KEM key. It is preserved through DH steps and bound with each message header, including skipped-message delivery.
- Accepted one-time curve/KEM private prekeys are marked consumed and best-effort overwritten. Failed setups retain them for an authentic retry. JavaScript and Web Crypto may retain copies; this is not a secure-erasure guarantee.
- Last-resort KEM prekeys are reusable and require rotation. Each UI reset generates fresh keys; there is no persistent prekey server or pool. The crypto API also tests the optional-curve-OPK branch. A last-resort setup without any one-time prekey needs replay handling, which this lab does not provide as a server protocol.

The KEM is [ML-KEM-1024 from FIPS 203](https://csrc.nist.gov/pubs/fips/203/final), not an older Kyber-compatible wire implementation. Authentication remains classical. PQ setup does not heal a later stolen session state against a quantum adversary. Continuing post-quantum recovery requires a construction such as SPQR/Triple Ratchet; the visible **How It Works → How this compares with current Signal** section links the primary specifications and explains that missing layer.

The tests additionally check ML-KEM-1024 encapsulation and implicit-rejection decapsulation against independently published [NIST ACVP cases 51 and 96](https://github.com/usnistgov/ACVP-Server/blob/975de31eb83d87039ec88934fdc47d8c312b892d/gen-val/json-files/ML-KEM-encapDecap-FIPS203/internalProjection.json), with the source commit, Git blob and corpus SHA-256 pinned in the fixture. These checks are not NIST validation or a Signal interoperability certification.

Sources: [PQXDH revision 3, updated 23 January 2024](https://signal.org/docs/specifications/pqxdh/), §§2–4; [Double Ratchet revision 4, 4 November 2025](https://signal.org/docs/specifications/doubleratchet/), §§5–7; [Signal’s SPQR announcement, 2 October 2025](https://signal.org/blog/spqr/). Reviewed 12 October 2026.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-ratchet-wire
cd crypto-lab-ratchet-wire/ratchet-wire
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-pqxdh-wire](https://systemslibrarian.github.io/crypto-lab-pqxdh-wire/) — isolate hybrid handshake steps, ciphertext tampering and classical versus quantum attack models.
- [crypto-lab-x3dh-wire](https://systemslibrarian.github.io/crypto-lab-x3dh-wire/) — the full X3DH initial key agreement that seeds a Double Ratchet session.
- [crypto-lab-mls-group](https://systemslibrarian.github.io/crypto-lab-mls-group/) — TreeKEM group messaging with forward secrecy, the multi-party counterpart to the two-party ratchet.
- [crypto-lab-noise-pipe](https://systemslibrarian.github.io/crypto-lab-noise-pipe/) — Noise handshake patterns over X25519 and HKDF, a related session-setup framework.
- [crypto-lab-key-exchange](https://systemslibrarian.github.io/crypto-lab-key-exchange/) — Diffie-Hellman, ECDH, and X25519 fundamentals underlying the DH ratchet.
- [crypto-lab-ssh-handshake](https://systemslibrarian.github.io/crypto-lab-ssh-handshake/) — X25519 + Ed25519 session establishment in a different transport protocol.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Hybrid Wire

- **slug**: `crypto-lab-hybrid-wire`
- **repo**: https://github.com/systemslibrarian/crypto-lab-hybrid-wire
- **live**: https://systemslibrarian.github.io/crypto-lab-hybrid-wire/
- **commit_sha**: `a939d38d37bccffd6970fc18c831147ce3213fe8` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, claims, mutations, verification

**Name (H1)**: Hybrid Wire  — _read from demos/hybrid-wire/src/main.ts_

**Subtitle**: X25519 + ML-KEM-768 · HKDF combiner  — _read from demos/hybrid-wire/src/main.ts_

**Description**: Step through a live hybrid handshake that runs a classical X25519 exchange alongside an ML-KEM-768 encapsulation, then mixes both secrets through HKDF into one AES-256-GCM session key.  — _read from demos/hybrid-wire/src/main.ts_

**Why it matters**: A recorded handshake can be broken years later once quantum computers arrive. Binding a classical and a post-quantum secret together means an attacker must defeat both wires at once, so today’s traffic stays confidential well into the future.  — _read from demos/hybrid-wire/src/main.ts_

**Card copy**: Combine real X25519 and ML-KEM-768 in a custom teaching handshake, then step through an encrypted chat. Compare its key combiner with the standardized TLS 1.3 hybrid group; this demo is not wire-compatible with TLS.

**Chips**: X25519 · ML-KEM-768 · HKDF-SHA256 · AES-256-GCM

**Implements**: AES `demos/hybrid-wire/src/crypto/security.ts:50`, AES-GCM `demos/hybrid-wire/src/crypto/security.ts:52`, HKDF `demos/hybrid-wire/src/crypto/hybrid.ts:59`, ML-KEM `demos/hybrid-wire/src/crypto/mlkem768.ts:12`, X25519 `demos/hybrid-wire/src/crypto/x25519.ts:17`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Diffie-Hellman `demos/hybrid-wire/src/main.ts:597`, SHA-256 `demos/hybrid-wire/src/crypto/hybrid.ts:36`, TLS 1.3 `demos/hybrid-wire/src/crypto/hybrid.ts:37`

**References**: Diffie-Hellman, Dilithium, Double Ratchet, ECDH, Ed25519, Kyber, PQXDH, SHA-256, SHA-512, Serpent, TLS 1.3

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `FIPS 203` — first seen README.md:65 (3×)
- `NIST SP 800-56C` — first seen demos/hybrid-wire/src/main.ts:867 (1×)
- `RFC 10024` — first seen README.md:28 (5×)
- `RFC 9954` — first seen README.md:31 (4×)
- `rfc10024` — first seen README.md:28 (5×)
- `rfc9954` — first seen README.md:31 (4×)

**README — What Can Go Wrong**:

```text
- Reusing a message number with the same session key reuses an AES-GCM IV. The sender reserves each number before asynchronous encryption, burns it after errors and discards stale results when the session changes. A reset invalidates the old session before resetting its counter; new sessions use newly established keys.
- Combining the two shared secrets badly. XOR-ing or truncating raw secrets can void the security argument; the secrets must flow through a sound KDF (HKDF here) that binds both wires.
- Larger handshake messages. The added ML-KEM-768 key and ciphertext (+2,272 bytes vs X25519) can push a ClientHello past one packet and trip middlebox ossification on old network gear.
- Treating the hybrid as twice as strong. It is a hedge, not a multiplier: it survives a break of either wire, but a flaw in the combiner or in either implementation can still sink the session.
- Mismatched parameters or versions between peers. If the two ends disagree on the KEM parameter set or the HKDF/transcript binding, key agreement fails or, worse, silently weakens.
- Carrying the classical wire forever. Hybrid is a migration tool; the plan should include moving to PQ-native once ML-KEM has more cryptanalytic maturity.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-hybrid-wire

## What It Is

This project is a browser teaching demo of a hybrid key exchange that combines X25519 and ML-KEM-768, then derives a session key with HKDF-SHA-256 for AES-256-GCM message encryption. It illustrates the transition problem where systems need confidentiality against both classical and future quantum-capable adversaries. The design is asymmetric and post-quantum-hybrid: two independent key-establishment wires are combined into one session key. Under the demo's passive, one-component-compromised model, its security goal is that the session key remains protected if either X25519 or ML-KEM-768 remains secure. The demo does not authenticate peers.

## When to Use It

This is where hybrid key exchange runs in the real world, not advice to use this code: the lab exists to show how such a handshake fits together.

- TLS 1.3 on the web. The IETF-named X25519MLKEM768 group pairs X25519 with ML-KEM-768 in the handshake; the demo's *Deployed today* tab lists Chrome 124-era draft Kyber → Chrome 131 standardized ML-KEM and Cloudflare, and Cloudflare and Google have both deployed and measured hybrid post-quantum key exchange on production traffic.
- Beyond TLS. The same two-wire idea appears in messaging and remote-shell setup: the *Deployed today* tab lists Signal PQXDH (X25519 plus post-quantum prekeys), iCloud PQ3 and OpenSSH 9.0+ (sntrup761x25519-sha512), with AWS s2n-tls offering hybrid TLS for cloud workloads.
- Traffic that must stay confidential for years. Hybrids are enabled today so that traffic recorded now cannot be decrypted later once large-scale quantum computers exist.
- Not on every link. The extra key and ciphertext sizes (+2,272 bytes vs pure X25519) may be too costly where bytes are critical.
- Do NOT use this code in production. It is a browser teaching demo of the hybrid handshake, not a vetted, hardened library; use a reviewed TLS stack for real deployments.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-hybrid-wire](https://systemslibrarian.github.io/crypto-lab-hybrid-wire/)**

The demo lets you step through a six-stage handshake, watch both shared secrets feed the HKDF combiner, and run encrypted chat with tamper detection after session derivation. The threat-model tab is interactive and computes its verdict: toggle either wire to "broken" and the attacker gets that wire's real secret, runs the real HKDF combiner over it plus a guess for the rest, and tries to decrypt a record encrypted under the live session key. The session only fails when X25519 *and* ML-KEM-768 fall together — and when it does, the recovered plaintext is shown. You can navigate tabs for the live handshake, two-wire breakdown, resilience explorer, deployed examples, and rationale. The benchmark control runs repeated iterations (50) to compare X25519, ML-KEM-768, and hybrid performance.

### Relationship to the TLS standard

This demo's `HKDF(x25519_secret || mlkem_secret)` with a zero salt and
`hybrid-wire-v1` context is its own chat-key teaching construction. It does not
implement the TLS 1.3 `X25519MLKEM768` named group or produce TLS-compatible
keys or messages. [RFC 10024 §§4.1–4.3 (August 2026)](https://www.rfc-editor.org/rfc/rfc10024.html#section-4)
specifies ML-KEM **first** in client and server key shares and the 64-byte
shared secret, then uses the TLS 1.3 key schedule. The general TLS hybrid
framework is [RFC 9954 (July 2026)](https://www.rfc-editor.org/rfc/rfc9954.html).
TLS also supplies transcript binding and authenticated handshakes, which this
browser exchange does not model. For implementation details and limitations,
see the [demo README](demos/hybrid-wire/README.md#6-a-note-on-the-combiner).

## What Can Go Wrong

- Reusing a message number with the same session key reuses an AES-GCM IV. The sender reserves each number before asynchronous encryption, burns it after errors and discards stale results when the session changes. A reset invalidates the old session before resetting its counter; new sessions use newly established keys.
- Combining the two shared secrets badly. XOR-ing or truncating raw secrets can void the security argument; the secrets must flow through a sound KDF (HKDF here) that binds both wires.
- Larger handshake messages. The added ML-KEM-768 key and ciphertext (+2,272 bytes vs X25519) can push a ClientHello past one packet and trip middlebox ossification on old network gear.
- Treating the hybrid as twice as strong. It is a hedge, not a multiplier: it survives a break of either wire, but a flaw in the combiner or in either implementation can still sink the session.
- Mismatched parameters or versions between peers. If the two ends disagree on the KEM parameter set or the HKDF/transcript binding, key agreement fails or, worse, silently weakens.
- Carrying the classical wire forever. Hybrid is a migration tool; the plan should include moving to PQ-native once ML-KEM has more cryptanalytic maturity.

## Real-World Usage

- TLS 1.3 hybrid key exchange. The IETF-named X25519MLKEM768 group pairs X25519 with ML-KEM-768 in the handshake and is now widely supported across browsers and servers.
- Cloudflare and Google. Both have deployed and measured hybrid post-quantum key exchange on production traffic during the migration period.
- Harvest-now-decrypt-later defense. Hybrids are enabled today so that traffic recorded now cannot be decrypted later once large-scale quantum computers exist.
- AES-256-GCM data protection. The derived session key feeds an AEAD cipher, the same record-protection pattern used by TLS and modern secure channels.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-hybrid-wire
cd crypto-lab-hybrid-wire/demos/hybrid-wire
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-hybrid-guide](https://systemslibrarian.github.io/crypto-lab-hybrid-guide/) — the decision guide and combiner theory behind this exact hybrid.
- [crypto-lab-pq-tls-handshake](https://systemslibrarian.github.io/crypto-lab-pq-tls-handshake/) — the X25519MLKEM768 hybrid inside a real TLS 1.3 key schedule.
- [crypto-lab-kyber-vault](https://systemslibrarian.github.io/crypto-lab-kyber-vault/) — ML-KEM (FIPS 203), the post-quantum wire of this exchange.
- [crypto-lab-hybrid-sign](https://systemslibrarian.github.io/crypto-lab-hybrid-sign/) — the same defense-in-depth idea applied to signatures.
- [crypto-lab-ratchet-wire](https://systemslibrarian.github.io/crypto-lab-ratchet-wire/) — a Double Ratchet over X25519 + HKDF + AES-256-GCM, the classical messaging counterpart.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

Deployment history source: [Google, September 13, 2024 — A new path for Kyber on the web](https://security.googleblog.com/2024/09/a-new-path-for-kyber-on-web.html). These are TLS named key-exchange groups, not cipher suites.

```

</details>

---

## Curve Lens

- **slug**: `crypto-lab-curve-lens`
- **repo**: https://github.com/systemslibrarian/crypto-lab-curve-lens
- **live**: https://systemslibrarian.github.io/crypto-lab-curve-lens/
- **commit_sha**: `ed2a978b062ff80e9018b570971009b6e2e3c896` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `41ae3d4828911859a08493ae0aabc5e4c3242c45`
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE  ·  **level**: intermediate  ·  **--accent**: #b04f21
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Curve Lens  — _read from src/ui.ts_

**Subtitle**: Elliptic curves · group law · ECDH  — _read from src/ui.ts_

**Description**: Explore the finite-field group law by adding points and running scalar multiplication on a toy curve, then agree on a shared secret with ECDH across real P-256, Curve25519, secp256k1, and brainpoolP256r1.  — _read from src/ui.ts_

**Why it matters**: ECC secures TLS, Signal, SSH, and Bitcoin with far smaller keys than RSA. Its safety rests on the elliptic-curve discrete log problem: scalar multiplication is easy one way but recovering the secret scalar is infeasible.  — _read from src/ui.ts_

**Card copy**: Point addition, scalar multiplication, and live ECDH across P-256, Curve25519, secp256k1, and brainpoolP256r1, whose RFC 5639 seeds it recomputes from &pi; and e. Reconstruct P-256's seed from the timestamp-based recipe disclosed in October 2026, with the remaining provenance questions explained.

**Chips**: brainpoolP256r1 · Curve25519 · ECDH · P-256

**Implements**: EC point arithmetic `src/curve.ts:105`, ECDH `src/realcurve.ts:313`, P-256 `src/realcurve.ts:1`, secp256k1 `src/realcurve.ts:90`, X25519 `src/realcurve.ts:257`

**Attacks shown**: Brute force `src/ui.ts:626`, Discrete log `src/curve.ts:349`, Side-channel (unspecified) `README.md:33`, Timing side-channel `README.md:33`

**Comment-only (named in code comments, not executed)**: ECDSA `src/sleeve.ts:150`, HKDF `src/realcurve.ts:67`, SHA-1 `src/sleeve.ts:139`

**References**: AES, ChaCha20, Diffie-Hellman, Double Ratchet, ECDSA, Ed25519, Ed448, HKDF, Kuznyechik, ML-KEM, MLS, Montgomery ladder, PQXDH, RSA, Schnorr, Shor's algorithm, TLS 1.3, WebAuthn, X3DH, X448

**Standards body**: IETF, NIST, SECG

**Implementation**: @noble

**Spec citations, exactly as written**:

- `FIPS 186-4` — first seen README.md:74 (5×)
- `FIPS 186-5` — first seen src/realcurve.ts:116 (2×)
- `FIPS 203` — first seen README.md:17 (1×)
- `NIST SP 800-56A` — first seen src/realcurve.ts:63 (1×)
- `RFC 10024` — first seen README.md:13 (2×)
- `RFC 5639` — first seen README.md:9 (22×)
- `RFC 5903` — first seen README.md:24 (5×)
- `RFC 7027` — first seen README.md:9 (14×)
- `RFC 7748` — first seen README.md:24 (13×)
- `RFC 9846` — first seen README.md:13 (2×)
- `rfc10024` — first seen README.md:13 (2×)
- `RFC5639` — first seen src/brainpool.ts:32 (13×)
- `RFC7027` — first seen src/brainpool.ts:50 (13×)
- `rfc7748` — first seen README.md:30 (16×)
- `rfc9846` — first seen README.md:13 (1×)
- `SP 800-186` — first seen src/realcurve.ts:116 (1×)
- `SP 800-56A` — first seen README.md:24 (4×)

**README — What Can Go Wrong**:

```text
- **Low-order peer input in X25519.** A small-order public input removes the other party's contribution: the clamped X25519 operation has an all-zero raw output, not a shared value that reveals bits of its private scalar. An implementation may reject this result, as the library used here does. Protocols must not assume contributory behavior; [RFC 7748 §§6.1 and 7](https://www.rfc-editor.org/rfc/rfc7748.html#section-7) permits an all-zero check and explains why a KDF may need to bind both public keys. Panel 5 exchanges self-generated valid public keys and does not accept an attacker-chosen input.
- **Reuse of ephemeral scalars.** ECDH is designed for one-time use per session. Reusing the same ephemeral private scalar across multiple exchanges eliminates forward secrecy and, if combined with additional oracle access, can expose the scalar entirely.
- **Scalar generation from a weak RNG.** The security of the entire scheme depends on the private scalar being drawn from a cryptographically uniform distribution. A biased or predictable RNG (e.g., a seeded PRNG, `Math.random()`) reduces the effective key space and makes the scalar recoverable.
- **Timing side-channel in scalar multiplication.** A variable-time double-and-add loop leaks secret scalar bits through execution timing. @noble/curves aims for algorithmic constant-time behavior, but JavaScript BigInt, JIT and GC do not provide an end-to-end timing guarantee. The UI reports algorithm and public parameter size, not measured iterations. See the [noble-curves security documentation](https://github.com/paulmillr/noble-curves#security).
- **Conflating the shared point with a symmetric key.** The x-coordinate of the ECDH shared point is not uniformly distributed and must be passed through a KDF (e.g., HKDF) before use as an AES or ChaCha20 key. Using the raw coordinate directly is a protocol error present in numerous real-world implementations.
```

**Claims tested** (e2e/claims.spec.ts, 20 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:36
    - :36 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:58
    - :58 `toHaveClass` expected `/is-active/` _(regex)_
- `Panel 1: the finite-field sum, its derivation and its summary all name the same plotted point` — e2e/claims.spec.ts:63
    - :70 `expect` expected _no expected value_ _(none)_
    - :76 `expect` expected _no expected value_ _(none)_
    - :77 `toBe` expected `points.length + 1` _(expression)_
    - :92 `expect` expected _no expected value_ _(none)_
    - :93 `expect` expected _no expected value_ _(none)_
    - :100 `expect` expected _no expected value_ _(none)_
    - :108 `expect` expected _no expected value_ _(none)_
    - :109 `expect` expected _no expected value_ _(none)_
    - :110 `toBe` expected `'(${x3![1]}, ${y3![1]})'` _(expression)_
    - :115 `expect` expected _no expected value_ _(none)_
    - :116 `expect` expected _no expected value_ _(none)_
    - :117 `expect` expected _no expected value_ _(none)_
    - :118 `toBe` expected `prime` _(expression)_
    - :121 `expect` expected _no expected value_ _(none)_
- `Panel 1: adding a point to its own reflection reaches O and names the vertical line as the cause` — e2e/claims.spec.ts:124
    - :138 `expect` expected _no expected value_ _(none)_
    - :144 `toHaveText` expected `'O'` _(literal)_
    - :146 `toContainText` expected `'vertical'` _(literal)_
    - :147 `toContainText` expected `'P + Q = O (point at infinity)'` _(literal)_
    - :151 `expect` expected _no expected value_ _(none)_
- `Panel 1: a shared link reproduces the selection and the sum it produced` — e2e/claims.spec.ts:154
    - :175 `toHaveText` expected `/Link copied|Copy failed/` _(regex)_
    - :178 `expect` expected _no expected value_ _(none)_
    - :184 `expect` expected _no expected value_ _(none)_
    - :185 `expect` expected _no expected value_ _(none)_
    - :186 `expect` expected _no expected value_ _(none)_
- `Panel 2: the runtime verification suite passes and its glyph matches its announcement` — e2e/claims.spec.ts:191
    - :198 `expect` expected _no expected value_ _(none)_
    - :208 `expect` expected _no expected value_ _(none)_
    - :209 `expect` expected _no expected value_ _(none)_
    - :210 `toMatch` expected _no expected value_ _(none)_
    - :213 `toBe` expected `'✓'` _(literal)_
    - :217 `expect` expected _no expected value_ _(none)_
    - :218 `expect` expected _no expected value_ _(none)_
    - :219 `expect` expected _no expected value_ _(none)_
    - :220 `expect` expected _no expected value_ _(none)_
- `Panel 2: the double-and-add trace chains and its final accumulator is the headline k·G` — e2e/claims.spec.ts:223
    - :228 `toHaveText` expected `'13 · G'` _(literal)_
    - :240 `expect` expected _no expected value_ _(none)_
    - :244 `toBe` expected _no expected value_ _(none)_
    - :248 `toBe` expected `'O'` _(literal)_
    - :256 `toBe` expected `steps.length` _(expression)_
    - :257 `toBe` expected `bits.length` _(expression)_
    - :258 `toBe` expected `[...bits].filter((bit) => bit === '1').length` _(expression)_
    - :261 `toBe` expected `headline` _(expression)_
- `Panel 2: each rejected scalar reaches the error card naming its own cause, and a good one clears it` — e2e/claims.spec.ts:264
    - :269 `toHaveClass` expected `/is-active/` _(regex)_
    - :276 `toBeVisible` expected _no expected value_ _(none)_
    - :277 `toContainText` expected `'Scalar must be in [1, n-1] for P-256.'` _(literal)_
    - :279 `toContainText` expected `'Public point (x, y)'` _(literal)_
    - :280 `toHaveCount` expected `0` _(literal)_
    - :286 `toContainText` expected `'Scalar must be in [1, n-1] for P-256.'` _(literal)_
    - :291 `toContainText` expected `'Curve25519 real mode expects a 32-byte scalar in hex.'` _(literal)_
    - :295 `toContainText` expected `'Hex input must contain an even number of hexadecimal'` _(literal)_
    - :299 `toHaveCount` expected `0` _(literal)_
    - :300 `toContainText` expected `'32-byte u-coordinate'` _(literal)_
    - :302 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
- `Panel 3: the recovered scalar reproduces the published challenge point and the step count equals k` — e2e/claims.spec.ts:307
    - :314 `expect` expected _no expected value_ _(none)_
    - :318 `toMatch` expected `POINT` _(expression)_
    - :321 `toContainText` expected `'Press'` _(literal)_
    - :324 `toContainText` expected `'Solved', { timeout: 30_000 }` _(expression)_
    - :331 `toBe` expected `k` _(expression)_
    - :332 `expect` expected _no expected value_ _(none)_
    - :333 `expect` expected _no expected value_ _(none)_
    - :338 `expect` expected _no expected value_ _(none)_
    - :339 `toBe` expected `publishedQ` _(expression)_
    - :340 `expect` expected _no expected value_ _(none)_
    - :341 `expect` expected _no expected value_ _(none)_
- `Panel 3: "New secret" clears the solved verdict and the search re-arms against the new challenge` — e2e/claims.spec.ts:344
    - :353 `toContainText` expected `'Solved', { timeout: 30_000 }` _(expression)_
    - :357 `toContainText` expected `'Solved'` _(literal)_
    - :358 `toContainText` expected `'Press'` _(literal)_
    - :366 `toContainText` expected `'Solved', { timeout: 30_000 }` _(expression)_
    - :368 `toBe` expected `newQ` _(expression)_
    - :369 `expect` expected _no expected value_ _(none)_
- `Panel 5 (toy): a·B, b·A and the shared-dot verdict are one and the same point` — e2e/claims.spec.ts:374
    - :393 `toBe` expected `b` _(expression)_
    - :394 `toBe` expected `bPublic` _(expression)_
    - :398 `toBe` expected `aB` _(expression)_
    - :400 `toBe` expected `'✓ Both reach ${aB}'` _(expression)_
    - :401 `expect` expected _no expected value_ _(none)_
    - :408 `toBe` expected `true` _(expression)_
    - :412 `toContainText` expected `'secret a ='` _(literal)_
    - :416 `expect` expected _no expected value_ _(none)_
- `Panel 5 (real): the shared secret equals both parties’ own values on every curve` — e2e/claims.spec.ts:432
    - :454 `toBe` expected _no expected value_ _(none)_
    - :457 `toBe` expected `bobPublic` _(expression)_
    - :459 `toBe` expected `bobShared` _(expression)_
    - :460 `toBe` expected _no expected value_ _(none)_
    - :463 `toContainText` expected `'✓ Yes — both parties derived the same secret'` _(literal)_
    - :464 `toHaveClass` expected `/is-error/` _(regex)_
    - :467 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :468 `expect` expected _no expected value_ _(none)_
    - :474 `toBe` expected `true` _(expression)_
    - :475 `toBe` expected `130` _(literal)_
    - :480 `toMatch` expected `/^04[0-9a-f]{128}$/` _(regex)_
    - :481 `toBe` expected `headline` _(expression)_
    - :482 `toBe` expected `headline` _(expression)_
    - :483 `toContainText` expected `'x-coordinate alone'` _(literal)_
    - :486 `toContainText` expected `'there is no y to discard'` _(literal)_
    - :490 `toContainText` expected `'In production Z is run through a KDF'` _(literal)_
    - :494 `toHaveText` expected `headline` _(expression)_
    - :498 `toBe` expected `nextBob` _(expression)_
    - :499 `toBe` expected `nextAlice` _(expression)_
    - :500 `toContainText` expected `'✓ Yes'` _(literal)_
    - :505 `expect` expected _no expected value_ _(none)_
    - :511 `toContainText` expected `'Teaching view'` _(literal)_
    - :512 `toContainText` expected _no expected value_ _(none)_
- `no element carrying the hidden attribute is actually rendered` — e2e/claims.spec.ts:524
    - :536 `toEqual` expected `[]` _(expression)_
- `Panel 1 (reals): the chord really passes through P, Q and the third point, which reflects onto the sum` — e2e/claims.spec.ts:558
    - :563 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :564 `toHaveClass` expected `/is-active/` _(regex)_
    - :565 `toBeVisible` expected _no expected value_ _(none)_
    - :599 `toContainText` expected `'P+Q'` _(literal)_
    - :603 `expect` expected _no expected value_ _(none)_
    - :605 `toHaveLength` expected `4` _(literal)_
    - :610 `expect` expected _no expected value_ _(none)_
    - :613 `expect` expected _no expected value_ _(none)_
    - :617 `expect` expected _no expected value_ _(none)_
    - :624 `toHaveLength` expected `1` _(literal)_
    - :625 `expect` expected _no expected value_ _(none)_
    - :626 `expect` expected _no expected value_ _(none)_
    - :627 `expect` expected _no expected value_ _(none)_
    - :628 `expect` expected _no expected value_ _(none)_
    - :631 `expect` expected _no expected value_ _(none)_
    - :639 `expect` expected _no expected value_ _(none)_
    - :644 `expect` expected _no expected value_ _(none)_
    - :645 `expect` expected _no expected value_ _(none)_
- `Panel 3: the security-scale note is consistent with itself AND with arithmetic` — e2e/claims.spec.ts:650
    - :656 `toBeVisible` expected _no expected value_ _(none)_
    - :665 `toBe` expected `true` _(expression)_
    - :667 `toBe` expected `brute / 2` _(expression)_
    - :669 `toBe` expected `rho` _(expression)_
    - :670 `toBe` expected `brute` _(expression)_
    - :671 `toBe` expected `notRated` _(expression)_
    - :683 `toBe` expected _no expected value_ _(none)_
    - :687 `toBe` expected `true` _(expression)_
    - :688 `expect` expected _no expected value_ _(none)_
    - :691 `toMatch` expected _no expected value_ _(none)_
- `Panel 2: the brainpoolP256r1 shared point recomputed on screen is the RFC 7027 vector` — e2e/claims.spec.ts:711
    - :717 `toHaveCount` expected `1` _(literal)_
    - :721 `toBe` expected _no expected value_ _(none)_
    - :726 `toHaveClass` expected `/is-pass/` _(regex)_
    - :727 `toHaveClass` expected `/is-fail/` _(regex)_
    - :728 `toBe` expected `'✓'` _(literal)_
    - :729 `toHaveAttribute` expected `'aria-label', /: passed$/` _(expression)_
    - :733 `toHaveCount` expected `1` _(literal)_
- `Panel 4: the seed provenance note derives brainpool’s seeds and contrasts them with P-256` — e2e/claims.spec.ts:741
    - :748 `toHaveAttribute` expected `'open', ''` _(expression)_
    - :753 `toBe` expected `3` _(literal)_
    - :754 `expect` expected _no expected value_ _(none)_
    - :759 `toHaveCount` expected `3` _(literal)_
    - :762 `toBe` expected `2` _(literal)_
    - :763 `toMatch` expected `/^[0-9A-F]{40}$/` _(regex)_
    - :764 `toBe` expected _no expected value_ _(none)_
    - :771 `toBe` expected `second` _(expression)_
    - :774 `toHaveText` expected _no expected value_ _(none)_
    - :779 `expect` expected _no expected value_ _(none)_
    - :780 `expect` expected _no expected value_ _(none)_
    - :781 `expect` expected _no expected value_ _(none)_
    - :782 `expect` expected _no expected value_ _(none)_
    - :785 `expect` expected _no expected value_ _(none)_
    - :786 `expect` expected _no expected value_ _(none)_
    - :790 `toHaveCount` expected `1` _(literal)_
    - :791 `toHaveAttribute` expected _no expected value_ _(none)_
- `Panel 4: every comparison card is complete and agrees with the glossary` — e2e/claims.spec.ts:799
    - :816 `toEqual` expected `[...scalarCurves].sort()` _(expression)_
    - :817 `toEqual` expected `[...ecdhCurves].sort()` _(expression)_
    - :818 `toHaveLength` expected `4` _(literal)_
    - :842 `expect` expected _no expected value_ _(none)_
    - :845 `expect` expected _no expected value_ _(none)_
    - :850 `expect` expected _no expected value_ _(none)_
    - :853 `expect` expected _no expected value_ _(none)_
    - :859 `toHaveAttribute` expected _no expected value_ _(none)_
    - :863 `expect` expected _no expected value_ _(none)_
    - :870 `toHaveAttribute` expected `'open', ''` _(expression)_
    - :872 `expect` expected _no expected value_ _(none)_
    - :875 `toBe` expected `'1'` _(literal)_
    - :876 `toBe` expected `'1'` _(literal)_
    - :877 `toBe` expected `'1'` _(literal)_
    - :878 `toBe` expected `'8'` _(literal)_
- `exactly one skip link exists, it is the first tab stop, and its target renders` — e2e/claims.spec.ts:883
    - :887 `toBeVisible` expected _no expected value_ _(none)_
    - :891 `toHaveCount` expected `1` _(literal)_
    - :892 `toHaveAttribute` expected `'href', '#main-content'` _(expression)_
    - :893 `toHaveCount` expected `1` _(literal)_
    - :900 `toBe` expected `'#main-content'` _(literal)_
- `related-demo cross-links open the live labs, not their source repositories` — e2e/claims.spec.ts:903
    - :907 `toBeVisible` expected _no expected value_ _(none)_
    - :912 `expect` expected _no expected value_ _(none)_
    - :914 `toMatch` expected _no expected value_ _(none)_
    - :920 `expect` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-curve-lens

## What It Is

Elliptic-curve Diffie-Hellman (ECDH) is an asymmetric key-agreement protocol built on the elliptic-curve discrete logarithm problem (ECDLP): given a public point Q = k·G on a curve, recovering the private scalar k is computationally infeasible in a suitable large subgroup. This demo implements exact finite-field point addition and scalar multiplication for a small teaching curve (y² = x³ + 2x + 2 mod 17 and analogs), plus production-size finite-field computations for P-256, Curve25519/X25519, secp256k1, and brainpoolP256r1 via @noble/curves. The security model is asymmetric: two parties exchange public values derived from private scalars and independently compute the same shared value without ever transmitting the secret. None of the four production curves shown are post-quantum secure; Shor's algorithm on a sufficiently large fault-tolerant quantum computer solves ECDLP in polynomial time.

The lab is built to be read top to bottom by a first-time visitor: it opens with the group law drawn over the ordinary real numbers (a smooth chord-and-tangent picture), then uses analogous addition formulas in a distinct finite-field group. A plain-language glossary defines the vocabulary (generator, subgroup order, cofactor, Weierstrass vs Montgomery, u-coordinate) inline, and the ECDH payoff is first shown on the toy curve — Alice's a·B and Bob's b·A landing on one literal shared dot — before the production-size values.

brainpoolP256r1 (RFC 5639, RFC 7027) is here for a reason beyond being a fourth curve. Its domain parameters are not imported from a library — they are built in this repo from the RFC 5639 §3.4 integers and then validated, before the curve is offered anywhere in the UI, by recomputing the RFC 7027 Appendix A.1 ECDH exchange in both directions and requiring both coordinates of the shared point to match. A curve that fails that check is withheld from the selector rather than shown with a caveat. It also anchors the **seed provenance** note in Panel 4: brainpool's seeds are themselves derived from π and e (RFC 5639 Appendix A.1 and A.2), and the page recomputes both from those constants in your browser and compares them with the published values, next to P-256's seed, now reconstructed in the browser from the timestamp-initialized `lrand48` recipe disclosed by [Anthropic on 16 October 2026](https://www.anthropic.com/research/ecdsa-curve-origins). The recovered recipe reproduces the published value; it does not explain skipped viable candidates or the selection of P-256's base point. This is a provenance result, not a cryptographic break.

## When to Use It

- **Ephemeral key agreement in TLS 1.3.** X25519 and P-256 are supported classical groups in [RFC 9846](https://www.rfc-editor.org/rfc/rfc9846); the handshake can provide forward secrecy when fresh ephemeral private keys are erased. Hybrid ML-KEM groups are specified separately in [RFC 10024](https://www.rfc-editor.org/rfc/rfc10024).
- **End-to-end encrypted messaging.** X25519 ECDH underlies the classical X3DH and Double Ratchet constructions. Signal has also introduced [PQXDH and the SPQR/Triple Ratchet](https://signal.org/blog/spqr/) for post-quantum establishment and ongoing ratcheting; this lab implements neither messaging protocol.
- **Hardware authenticator key generation.** FIDO2/WebAuthn uses P-256 (ES256) for credential key pairs because P-256 is supported in secure-element hardware and is FIPS-approved.
- **Blockchain transaction signing.** secp256k1 is used in Bitcoin and Ethereum for ECDSA signatures; choose it only when compatibility with those ecosystems is required — not for general-purpose key agreement.
- **Do not use ECDH** when post-quantum security is a requirement (NIST PQC standards such as ML-KEM / FIPS 203 should be preferred), or when the runtime cannot guarantee a cryptographically secure random number generator for private scalar generation.
- Do NOT treat this as production code — it is a browser teaching demo, not a hardened key-agreement library.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-curve-lens](https://systemslibrarian.github.io/crypto-lab-curve-lens/)**

The demo has five interactive panels. Panel 1 (Curve Explorer) starts with a **Reals first (ℝ)** sub-view: slide P and Q along a smooth curve over the real numbers and watch the straight chord hit a third point that reflects down to P+Q — the origin of the group law. Switch to the **Finite field 𝔽₁₇** sub-view to plot every point on the small teaching curve, click any two to compute their exact finite-field sum, and see the same line y ≡ λx + c drawn _wrapped modulo p_ — re-entering the opposite grid edge so it genuinely passes through P, Q, and the third intersection −(P+Q) before the reflection. Panel 2 runs scalar multiplication in both toy and production modes, with a full double-and-add trace for the small field, real generator multiplication for P-256, Curve25519, secp256k1, and brainpoolP256r1, an (x, y)-segmented view of the public point, and a "what changed from the toy curve" note mapping the toy trace to the real one. Panel 3 lets you brute-force the elliptic-curve discrete logarithm on the toy curve — watch G, 2·G, 3·G, … walk the subgroup until the public point appears — then contrasts that with the ~2²⁵⁶ work the same sequential walk would take on P-256, and notes that the best known generic attack, Pollard's rho, needs only ~2¹²⁸ group operations — which is why P-256 is rated at 128-bit security, not 256. Panel 4 shows side-by-side comparison cards for the four production curves (field size, subgroup order, cofactor, SafeCurves rating, post-quantum status) with an inline plain-language glossary for the jargon, plus a **"where did this curve come from?"** note that recomputes brainpoolP256r1's two seeds from π and e and compares them with P-256's seed, recomputed from the recovered timestamp (1997-08-16 01:52:34 UTC) and candidate number 1,842. That note is about provenance only: it is not a claim of any weakness in P-256, and no attack on P-256 is known. Panel 5 first shows ECDH on the toy curve as a two-lane diagram — Alice's a·B and Bob's b·A landing on the same highlighted dot, with the colour-coded identity a·(bG) = b·(aG) = (ab)·G — then runs a live real exchange: click "Generate fresh keypairs" to produce new random Alice and Bob key pairs on your chosen curve and verify that both arrive at the same shared value, with one-click copy on every key. The headline value is the raw ECDH output **Z** — the x-coordinate alone, 32 bytes on all four curves (SP 800-56A §5.7.1.2, RFC 5903 §9, RFC 7748 §6.1) — shown beside the full shared point it was taken from, so the value the panel tells you to feed a KDF is the value those specs mean. The private scalars are displayed deliberately and labelled as a teaching view.

The explorer grid is fully keyboard-navigable (Tab to focus the grid, arrow keys to move between points, Enter to select), and the current view — selected points, scalar, and chosen curves — is encoded in the URL, so "Copy shareable link" reproduces exactly what you're looking at.

## What Can Go Wrong

- **Low-order peer input in X25519.** A small-order public input removes the other party's contribution: the clamped X25519 operation has an all-zero raw output, not a shared value that reveals bits of its private scalar. An implementation may reject this result, as the library used here does. Protocols must not assume contributory behavior; [RFC 7748 §§6.1 and 7](https://www.rfc-editor.org/rfc/rfc7748.html#section-7) permits an all-zero check and explains why a KDF may need to bind both public keys. Panel 5 exchanges self-generated valid public keys and does not accept an attacker-chosen input.
- **Reuse of ephemeral scalars.** ECDH is designed for one-time use per session. Reusing the same ephemeral private scalar across multiple exchanges eliminates forward secrecy and, if combined with additional oracle access, can expose the scalar entirely.
- **Scalar generation from a weak RNG.** The security of the entire scheme depends on the private scalar being drawn from a cryptographically uniform distribution. A biased or predictable RNG (e.g., a seeded PRNG, `Math.random()`) reduces the effective key space and makes the scalar recoverable.
- **Timing side-channel in scalar multiplication.** A variable-time double-and-add loop leaks secret scalar bits through execution timing. @noble/curves aims for algorithmic constant-time behavior, but JavaScript BigInt, JIT and GC do not provide an end-to-end timing guarantee. The UI reports algorithm and public parameter size, not measured iterations. See the [noble-curves security documentation](https://github.com/paulmillr/noble-curves#security).
- **Conflating the shared point with a symmetric key.** The x-coordinate of the ECDH shared point is not uniformly distributed and must be passed through a KDF (e.g., HKDF) before use as an AES or ChaCha20 key. Using the raw coordinate directly is a protocol error present in numerous real-world implementations.

## Real-World Usage

- **TLS 1.3 (RFC 9846).** X25519 and P-256 provide classical ephemeral key shares; [RFC 10024](https://www.rfc-editor.org/rfc/rfc10024) defines hybrid ML-KEM key-agreement groups for TLS 1.3. Handshake authentication and correct key handling are also needed for the intended security properties.
- **Signal Protocol.** X25519 ECDH is part of the classical X3DH and Double Ratchet foundations. Signal's PQXDH and SPQR/Triple Ratchet add post-quantum components; this ECDH panel is only a primitive demonstration.
- **WireGuard.** Uses Curve25519 (X25519) as its sole key-exchange mechanism; the simplicity and speed of the curve are central to the protocol's design goals.
- **FIDO2 / WebAuthn (W3C + CTAP2).** P-256 (ES256) is the mandatory-to-implement credential algorithm for hardware security keys and platform authenticators, used in passkey authentication and hardware 2FA.
- **Bitcoin and Ethereum.** secp256k1 is used for ECDSA transaction signing in both networks; every Bitcoin address and Ethereum account is derived from a secp256k1 public key.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-curve-lens
cd crypto-lab-curve-lens
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-ec-point-arithmetic](https://systemslibrarian.github.io/crypto-lab-ec-point-arithmetic/) — the geometric foundation beneath this demo: drag points to see the chord-and-tangent group law over ℝ, then the identical algebra over 𝔽ₚ.
- [crypto-lab-key-exchange](https://systemslibrarian.github.io/crypto-lab-key-exchange/) — Diffie-Hellman through ECDH, X25519, and ML-KEM in one comparison.
- [crypto-lab-curve448](https://systemslibrarian.github.io/crypto-lab-curve448/) — the higher-security X448/Ed448 sibling to Curve25519 (RFC 7748/8032).
- [crypto-lab-x3dh-wire](https://systemslibrarian.github.io/crypto-lab-x3dh-wire/) — chains X25519 ECDH into Signal's initial key agreement.
- [crypto-lab-ratchet-wire](https://systemslibrarian.github.io/crypto-lab-ratchet-wire/) — the Double Ratchet that keeps re-running ECDH for forward secrecy.
- [crypto-lab-hybrid-wire](https://systemslibrarian.github.io/crypto-lab-hybrid-wire/) — combines X25519 with ML-KEM-768 for post-quantum key exchange.
- [crypto-lab-sleeve-check](https://systemslibrarian.github.io/crypto-lab-sleeve-check/) — the sibling nothing-up-my-sleeve exhibit: GOST's Kuznyechik S-box, published as a bare table, shown to fall out of four small constants and field arithmetic.

## Development

`​``bash
npm install      # install dependencies
npm run dev      # start the Vite dev server
npm test         # run the Vitest suite (arithmetic, real-curve vectors, DOM smoke tests)
npm run lint     # ESLint + Prettier check
npm run format   # apply Prettier
npm run build    # typecheck (tsc --noEmit) + production build
`​``

The finite-field arithmetic, the `@noble/curves` integration, and the rendered UI are all covered by tests. `runVerificationSuite()` additionally re-checks the P-256 and secp256k1 base points and subgroup orders, the RFC 7748 X25519 vectors, and the RFC 7027 Appendix A.1 brainpoolP256r1 exchange at runtime, surfacing the results — including the recomputed brainpool shared point, so it can be read against the RFC — in Panel 2. Spec KATs covered by the unit suite: RFC 7748 (X25519), RFC 7027 Appendix A.1 (brainpoolP256r1, both directions, plus two negative controls), RFC 5639 Appendix A.1/A.2 (all fourteen π- and e-derived seeds), the ANSI X9.62 / FIPS 186-4 D.3.3 seed-to-curve derivation for P-256, and the recovered P-256 RNG recipe against the published seed (with changed-timestamp and changed-candidate negative controls). The historical RNG is used only to reconstruct public parameters, never to generate private keys. `e2e/claims.spec.ts` additionally asserts that the brainpool shared point rendered on screen equals the RFC 7027 vector. CI (`.github/workflows/ci.yml`) runs lint, tests, and build on every push and pull request; deployment to GitHub Pages runs only after the same checks pass.

---

_Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite._

_"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31_

```

</details>

---

## Point Arithmetic

- **slug**: `crypto-lab-ec-point-arithmetic`
- **repo**: https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic
- **live**: https://systemslibrarian.github.io/crypto-lab-ec-point-arithmetic/
- **commit_sha**: `b2ca1876995f360c0ecc5c35192c61af397d20c2` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `23c627ccc7757e614750ca1f5f2a52bb73e1cc79`
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | SIGNATURES  ·  **level**: intermediate  ·  **--accent**: #9f88ff
- **MISSING FIELDS**: mutations, verification, limitations

**Name (H1)**: EC Point Arithmetic  — _read from src/ui.ts_

**Subtitle**: Group law · point addition · scalar multiplication  — _read from src/ui.ts_

**Description**: Add points and multiply by a scalar over the real plane or a finite field 𝔽ₚ.  — _read from src/ui.ts_

**Why it matters**: Elliptic-curve groups underlie ECDSA, EdDSA, and X25519, though their curve forms differ.  — _read from src/ui.ts_

**Card copy**: Drag P and Q to see the geometric group law over real numbers, then switch to distinct finite-field arithmetic. Step double-and-add and explore the small-group ECDLP; real key security needs suitable large subgroups.

**Chips**: Group Law · Chord-and-Tangent · Scalar Mult · secp256k1

**Implements**: EC point arithmetic `src/math/curve-fp.ts:23`, secp256k1 `src/math/curves.ts:73`

**Attacks shown**: Brute force `src/ui/panel-hard.ts:115`, Discrete log `src/ui.ts:31`

**Comment-only (named in code comments, not executed)**: P-256 `src/math/curves.ts:2`, Tonelli–Shanks `src/math/field.ts:5`

**References**: Baby-step giant-step, ECDH, ECDSA, Ed25519, EdDSA, Montgomery ladder, P-256, Tonelli–Shanks, X25519

**Standards body**: SECG

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `10.1007/978-3-662-69007-9` — first seen README.md:35 (2×)
- `FIPS 203` — first seen README.md:49 (1×)

**Claims tested** (e2e/claims.spec.ts, 47 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:64
    - :64 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:69
    - :69 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:79
    - :79 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:91
    - :91 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:100
    - :100 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:101
    - :101 `toBeCloseTo` expected `(3 * P.x * P.x + a) / (2 * P.y), 2` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:102
    - :102 `toBeCloseTo` expected `lambda * lambda - 2 * P.x, 2` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:105
    - :105 `toBeCloseTo` expected `(Q.y - P.y) / (Q.x - P.x), 2` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:106
    - :106 `toBeCloseTo` expected `lambda * lambda - P.x - Q.x, 2` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:108
    - :108 `toBeCloseTo` expected `lambda * (P.x - x3) - P.y, 2` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:111
    - :111 `toHaveText` expected `'P + Q = (${x3text}, ${y3text})'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:113
    - :113 `toBeCloseTo` expected `x3 * x3 * x3 + a * x3 + b, 1` _(expression)_
- `page skeleton` — e2e/claims.spec.ts:118
- `four panels in curriculum order, each with its own exhibit` — e2e/claims.spec.ts:119
    - :122 `toHaveText` expected `[` _(expression)_
    - :129 `toHaveText` expected _no expected value_ _(none)_
    - :132 `expect` expected _no expected value_ _(none)_
- `panel 2 — point addition over ℝ` — e2e/claims.spec.ts:140
- `the opening chord: λ, x₃, y₃ and the P + Q verdict agree, and the sum is on the curve` — e2e/claims.spec.ts:141
    - :150 `toBeCloseTo` expected `pt.x * pt.x * pt.x - pt.x + 1, 2` _(expression)_
- `tangent example: P = Q switches to the tangent slope and stays consistent` — e2e/claims.spec.ts:155
    - :162 `expect` expected _no expected value_ _(none)_
    - :165 `toBeChecked` expected _no expected value_ _(none)_
- `P + (−P) = O reaches the identity and says why (chip and button agree)` — e2e/claims.spec.ts:168
    - :183 `toBeCloseTo` expected `P.x, 3` _(expression)_
    - :184 `toBeCloseTo` expected `-P.y, 3` _(expression)_
    - :186 `expect` expected _no expected value_ _(none)_
    - :187 `expect` expected _no expected value_ _(none)_
    - :188 `toHaveText` expected `'P + Q = O'` _(literal)_
    - :189 `toContainText` expected _no expected value_ _(none)_
- `2P = O: doubling a y = 0 point is the 2-torsion case, not a tangent` — e2e/claims.spec.ts:195
    - :201 `toBeCloseTo` expected `0, 3` _(expression)_
    - :204 `toBeCloseTo` expected `0, 2` _(expression)_
    - :205 `expect` expected _no expected value_ _(none)_
    - :206 `toHaveText` expected `'P + Q = O'` _(literal)_
    - :207 `toContainText` expected `'point at infinity O'` _(literal)_
- `keyboard drag moves P, flips its branch, and the algebra follows` — e2e/claims.spec.ts:210
    - :220 `expect` expected _no expected value_ _(none)_
    - :221 `toBeCloseTo` expected `Q0.x, 3` _(expression)_
    - :228 `toBeCloseTo` expected `upper.x, 3` _(expression)_
    - :229 `toBeCloseTo` expected `-upper.y, 3` _(expression)_
    - :234 `expect` expected _no expected value_ _(none)_
    - :235 `toBeCloseTo` expected `flipped.x, 3` _(expression)_
- `Randomize keeps both operands on the curve; Reset restores the opening points` — e2e/claims.spec.ts:239
    - :252 `toBeCloseTo` expected `pt.x * pt.x * pt.x - pt.x + 1, 1` _(expression)_
    - :256 `toBe` expected `true` _(expression)_
    - :260 `toBe` expected `opening.P` _(expression)_
    - :261 `toBe` expected `opening.Q` _(expression)_
- `the second preset really is a different curve, and its sum lands on it` — e2e/claims.spec.ts:264
    - :270 `toBeVisible` expected _no expected value_ _(none)_
    - :275 `toBeCloseTo` expected `P.x * P.x * P.x - 2 * P.x + 2, 2` _(expression)_
- `the “show −P” toggle changes what is drawn` — e2e/claims.spec.ts:278
    - :285 `toBe` expected `before` _(expression)_
    - :295 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :296 `toBeVisible` expected _no expected value_ _(none)_
    - :297 `toBeHidden` expected _no expected value_ _(none)_
- `panel 2 — addition over a distinct finite-field group` — e2e/claims.spec.ts:303
- `opens on a prompt, and the point menu holds exactly the curve’s points` — e2e/claims.spec.ts:304
    - :308 `toContainText` expected `'Pick points P and Q on the lattice.'` _(literal)_
    - :309 `toHaveCount` expected `FP_CURVES[0].points` _(expression)_
    - :312 `toBe` expected `'O (∞)'` _(literal)_
    - :316 `toBe` expected `true` _(expression)_
- `chord over 𝔽ₚ: λ, x₃, y₃ are exact mod p and the sum is on the curve` — e2e/claims.spec.ts:320
    - :331 `toBe` expected `mod(Q.y - P.y, p)` _(expression)_
    - :332 `toBe` expected `mod(lambda * lambda - P.x - Q.x, p)` _(expression)_
    - :333 `toBe` expected `mod(lambda * (P.x - x3) - P.y, p)` _(expression)_
    - :334 `toBe` expected `true` _(expression)_
    - :335 `toHaveText` expected `'P + Q = (${x3}, ${y3})'` _(expression)_
- `doubling over 𝔽ₚ uses the tangent formula, exactly` — e2e/claims.spec.ts:338
    - :343 `toEqual` expected `P` _(expression)_
    - :349 `toBe` expected `mod(3n * P.x * P.x + a, p)` _(expression)_
    - :350 `toBe` expected `mod(lambda * lambda - 2n * P.x, p)` _(expression)_
    - :351 `toBe` expected `mod(lambda * (P.x - x3) - P.y, p)` _(expression)_
    - :352 `toBe` expected `true` _(expression)_
    - :353 `toHaveText` expected `'P + Q = (${x3}, ${y3})'` _(expression)_
- `P + (−P) = O over 𝔽ₚ reaches the identity and says why` — e2e/claims.spec.ts:356
    - :363 `toBe` expected `P.x` _(expression)_
    - :364 `toBe` expected `0n` _(expression)_
    - :365 `expect` expected _no expected value_ _(none)_
    - :366 `toHaveText` expected `'P + Q = O'` _(literal)_
    - :367 `toContainText` expected _no expected value_ _(none)_
- `P + O = P shows the identity verdict from a fresh load` — e2e/claims.spec.ts:374
    - :377 `toMatch` expected `/^\(\d+, \d+\)$/` _(regex)_
    - :379 `toContainText` expected `'Pick points P and Q'` _(literal)_
    - :380 `toHaveText` expected `'P + O = ${chosenP}'` _(expression)_
    - :381 `toContainText` expected _no expected value_ _(none)_
- `switching curve repopulates the lattice menu and returns to the prompt` — e2e/claims.spec.ts:388
    - :393 `toContainText` expected `'P + O ='` _(literal)_
    - :398 `toContainText` expected `'Pick points P and Q on the lattice.'` _(literal)_
    - :399 `toHaveCount` expected `FP_CURVES[1].points` _(expression)_
    - :404 `toBe` expected `true` _(expression)_
    - :411 `toBe` expected `true` _(expression)_
    - :430 `toBeVisible` expected _no expected value_ _(none)_
- `panel 2 — secp256k1 in exact 256-bit arithmetic` — e2e/claims.spec.ts:433
- `shows the real generator, hides the lattice, and its G + 2G is on the curve` — e2e/claims.spec.ts:434
    - :438 `toBeHidden` expected _no expected value_ _(none)_
    - :439 `toContainText` expected _no expected value_ _(none)_
    - :444 `toBe` expected `SECP_GX` _(expression)_
    - :445 `toBe` expected `SECP_GY` _(expression)_
    - :448 `toBe` expected `true` _(expression)_
- `G + G reproduces the page’s own 2G, and G + (−G) = O, and G + O = G` — e2e/claims.spec.ts:452
    - :461 `toEqual` expected `twoG` _(expression)_
    - :464 `toHaveText` expected `'P + Q = O (point at infinity)'` _(literal)_
    - :466 `toBe` expected `BigInt(SECP_GX)` _(expression)_
    - :467 `toBe` expected `0n` _(expression)_
    - :470 `expect` expected _no expected value_ _(none)_
    - :471 `toEqual` expected `{ x: BigInt(SECP_GX), y: BigInt(SECP_GY) }` _(expression)_
    - :492 `toContainText` expected `/./` _(regex)_
- `panel 3 — k · P, and the cost gap that makes ECC practical` — e2e/claims.spec.ts:495
- `the two cost cards are internally consistent with k and with each other` — e2e/claims.spec.ts:496
    - :505 `toBe` expected `k` _(expression)_
    - :506 `toBe` expected `bitLen(kk)` _(expression)_
    - :507 `toBe` expected `popcount(kk)` _(expression)_
    - :508 `toBe` expected `c.total` _(expression)_
    - :509 `expect` expected _no expected value_ _(none)_
- `Show all: the verdict, the live counters, the trace and the bit tape all agree` — e2e/claims.spec.ts:513
    - :518 `toContainText` expected `'Press Step or Show all'` _(literal)_
    - :523 `toHaveClass` expected `/done/` _(regex)_
    - :524 `toHaveText` expected `'9 · G ='` _(literal)_
    - :528 `toHaveText` expected _no expected value_ _(none)_
    - :532 `toHaveCount` expected `c.total` _(expression)_
    - :533 `toHaveText` expected `answer` _(expression)_
    - :537 `toBe` expected `(9).toString(2)` _(expression)_
    - :538 `toBe` expected `c.dbl` _(expression)_
    - :539 `toHaveCount` expected `c.dbl - 1` _(expression)_
    - :540 `toHaveCount` expected `1` _(literal)_
    - :547 `toBe` expected `true` _(expression)_
- `Step advances one operation at a time and reaches the same answer as Show all` — e2e/claims.spec.ts:551
    - :561 `toHaveCount` expected `0` _(literal)_
    - :565 `toHaveCount` expected `i` _(expression)_
    - :566 `toHaveClass` expected _no expected value_ _(none)_
    - :570 `toBeDisabled` expected _no expected value_ _(none)_
    - :571 `toHaveText` expected `answer` _(expression)_
- `repeated addition and double-and-add reach the same point by different costs` — e2e/claims.spec.ts:574
    - :584 `toHaveClass` expected `/sel/` _(regex)_
    - :587 `toHaveClass` expected `/sel/` _(regex)_
    - :588 `toBeHidden` expected _no expected value_ _(none)_
    - :593 `toBe` expected `fast` _(expression)_
    - :594 `toBe` expected `9` _(literal)_
    - :595 `expect` expected _no expected value_ _(none)_
    - :596 `toHaveText` expected `'${slowOps} done'` _(expression)_
- `the three worked examples land on the values they promise` — e2e/claims.spec.ts:599
    - :605 `toHaveCount` expected `0` _(literal)_
    - :613 `toHaveValue` expected `'0'` _(literal)_
    - :614 `toHaveClass` expected `/done/` _(regex)_
    - :615 `toContainText` expected `'0 · G ='` _(literal)_
    - :616 `toHaveText` expected `'O (∞)'` _(literal)_
    - :620 `toHaveValue` expected `String(order)` _(expression)_
    - :622 `toHaveText` expected `'${order} · G ='` _(expression)_
    - :623 `toHaveText` expected `'O (∞)'` _(literal)_
    - :626 `toHaveValue` expected `String(order + 1)` _(expression)_
    - :628 `toHaveText` expected `'${order + 1} · G ='` _(expression)_
    - :629 `toHaveText` expected `G` _(expression)_
- `repeated addition refuses a large k, and says how cheap the alternative is` — e2e/claims.spec.ts:632
    - :641 `toBeVisible` expected _no expected value_ _(none)_
    - :643 `toContainText` expected `'k = 5000 is too large for repeated addition'` _(literal)_
    - :644 `toContainText` expected `'it would take 5000 steps'` _(literal)_
    - :646 `toContainText` expected `'Double-and-add needs only about ${c.total} operations'` _(expression)_
    - :647 `toBe` expected `bitLen(5000n) + popcount(5000n)` _(expression)_
    - :650 `toHaveCount` expected `0` _(literal)_
    - :651 `toBeDisabled` expected _no expected value_ _(none)_
    - :655 `toBeHidden` expected _no expected value_ _(none)_
    - :657 `toHaveCount` expected `1000` _(literal)_
    - :658 `toHaveClass` expected `/done/` _(regex)_
- `switching to secp256k1 with a lattice frame in flight does not freeze the page` — e2e/claims.spec.ts:665
    - :680 `toBeHidden` expected `{ timeout: 10_000 }` _(expression)_
    - :681 `toContainText` expected `'Press Step or Show all', {` _(expression)_
    - :685 `toHaveClass` expected `/done/` _(regex)_
- `the larger toy curve and secp256k1 both close the loop at k = order` — e2e/claims.spec.ts:688
    - :696 `toHaveValue` expected `String(FP_CURVES[1].points)` _(expression)_
    - :698 `toHaveText` expected `'O (∞)'` _(literal)_
    - :701 `toBeHidden` expected _no expected value_ _(none)_
    - :704 `expect` expected _no expected value_ _(none)_
    - :706 `toHaveText` expected `'O (∞)'` _(literal)_
    - :708 `toBe` expected `bitLen(n)` _(expression)_
    - :709 `toBe` expected `'~2^${bitLen(n) - 1}'` _(expression)_
    - :724 `expect` expected _no expected value_ _(none)_
- `panel 4 — why you cannot go backwards` — e2e/claims.spec.ts:729
- `the walk lands on Q, and the step count it reports is the count it took` — e2e/claims.spec.ts:730
    - :737 `toContainText` expected `'Recovering it is the ECDLP.'` _(literal)_
    - :738 `toContainText` expected `'Found'` _(literal)_
    - :741 `expect` expected _no expected value_ _(none)_
    - :743 `toHaveText` expected _no expected value_ _(none)_
    - :746 `toBeDisabled` expected _no expected value_ _(none)_
- `a new secret resets the search and is still found by walking` — e2e/claims.spec.ts:749
    - :754 `toContainText` expected `'Found after'` _(literal)_
    - :757 `toContainText` expected `'Found'` _(literal)_
    - :758 `toContainText` expected `'Tried'` _(literal)_
    - :759 `toBeEnabled` expected _no expected value_ _(none)_
    - :762 `expect` expected _no expected value_ _(none)_
    - :763 `toContainText` expected `'Found after ${clicks} steps: k = ${clicks}.'` _(expression)_
- `Walk runs the search on a timer and pauses where it left off` — e2e/claims.spec.ts:766
    - :771 `toHaveText` expected `'Pause ⏸'` _(literal)_
    - :772 `toContainText` expected `'multiples — no match yet.'` _(literal)_
    - :776 `toHaveText` expected `'Walk the subgroup ▶'` _(literal)_
    - :779 `toBe` expected `frozen` _(expression)_
    - :781 `expect` expected _no expected value_ _(none)_
    - :782 `expect` expected _no expected value_ _(none)_
- `the scale table is self-consistent: the generic attack really is about √n` — e2e/claims.spec.ts:785
    - :791 `toHaveCount` expected `2` _(literal)_
    - :794 `expect` expected _no expected value_ _(none)_
    - :797 `toBe` expected `Math.round(Math.sqrt(n))` _(expression)_
    - :799 `toContainText` expected `'Tried'` _(literal)_
    - :801 `toContainText` expected `'Tried 1 / ${n} multiples'` _(expression)_
    - :804 `expect` expected _no expected value_ _(none)_
    - :805 `expect` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-ec-point-arithmetic

## What It Is

This is an interactive visualizer for **elliptic-curve point addition** and **scalar multiplication**. It shows short-Weierstrass addition (y² = x³ + ax + b) over the real numbers, where you can drag points along a smooth curve, and over a finite field 𝔽ₚ, where the same form of formulas runs in exact `BigInt` arithmetic (modular inverse via the extended Euclidean algorithm, modular square roots via Tonelli–Shanks). These are **different groups**: the lab's real and finite-field presets even use different curve coefficients. It is a teaching tool, not a cryptographic library. Point addition can be undone when a summand is known: from Q = P + R and P, compute R = Q − P. In a suitable large finite-field subgroup, computing Q = k·P is practical while recovering k from P and Q is the **elliptic-curve discrete logarithm problem (ECDLP)**. The secp256k1 finite-field results are cross-checked against `@noble/curves` in the test suite.

## When to Use It

- **Learning ECC before ECDSA or ECDH.** The group law is the prerequisite for both; see point addition and doubling geometrically first, and signatures/key-exchange become far easier to follow.
- **Understanding the scalar-recovery problem.** Step through double-and-add and watch the operation count stay near log₂k. The small teaching groups can be searched; security relies on the hardness of recovering k in an appropriately chosen large subgroup.
- **Connecting the picture to the algebra.** The λ, x₃, y₃ formulas update in lockstep with the geometry, so the equations stop being arbitrary.
- **Comparing real and finite-field groups.** The ℝ ↔ 𝔽ₚ toggle reuses the interaction and the form of the addition formulas; it does not turn the smooth real curve into the same group of finite points.
- **When NOT to use it:** this is not a key-agreement, signing, or discrete-log-attack tool. For ECDH and a real ECDLP brute-forcer use [Curve Lens](https://systemslibrarian.github.io/crypto-lab-curve-lens/); for signatures use ECDSA Forge. And never treat any of this as production code — it is a browser teaching demo, deliberately variable-time and un-hardened.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-ec-point-arithmetic](https://systemslibrarian.github.io/crypto-lab-ec-point-arithmetic/)**

Four panels. Panel 1 introduces the curve. Panel 2 is the core: drag P and Q along a real curve (or pick them from menus / use arrow keys) and watch the chord or tangent, the third intersection, the reflection, and the algebra all update live — then flip the **Over ℝ ↔ Over 𝔽ₚ** switch to run the same addition on a finite point lattice. Panel 3 computes k·P by both naive repeated addition and double-and-add, stepping through the trace and showing the operation-count gap. Panel 4 builds ECDLP intuition by walking a small subgroup until it lands on the target point, then contrasts that with secp256k1's ~2²⁵⁶ order. Controls include the curve presets (toy 𝔽₁₇, 𝔽₉₇, and secp256k1), the scalar k, the addition method, and the doubling / show-−P toggles.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic
cd crypto-lab-ec-point-arithmetic
npm install
npm run dev
`​``

There are no environment variables. `npm test` runs the Vitest suite (field arithmetic, the real and finite-field group laws, double-and-add vs. naive equivalence, and the secp256k1 cross-check against `@noble/curves`); `npm run build` typechecks and produces the static `dist/`. An optional `npm run smoke` drives a real browser over the built site (canvas rendering, the core interactions, mobile layout); it needs a local Chromium/Edge and `npm i -D playwright`, and is kept out of CI to stay light.

## Sources and Scope

- [SEC 1, version 2.0 (21 May 2009)](https://www.secg.org/sec1-v2.pdf), §§2.2.1 and 3.2.1, specifies finite-field elliptic-curve groups and public keys of the form Q = dG.
- Paar, Pelzl, and Güneysu, [_Understanding Cryptography_, second edition (2024)](https://link.springer.com/book/10.1007/978-3-662-69007-9), chapter 9, distinguishes the geometric intuition from the finite-field group and scalar-recovery problem.

The toy groups and the real-plane construction are for learning. The difficulty claim applies to suitable large subgroups and assumptions, not to point addition or every elliptic curve.

## Related Demos

- [crypto-lab-curve-lens](https://systemslibrarian.github.io/crypto-lab-curve-lens/) — the next step: finite-field point clouds, curve comparison, a real ECDLP brute-forcer, and live ECDH across P-256, Curve25519, and secp256k1.
- [crypto-lab-ecdsa-forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) — what the group law is used for: ECDSA signing, verification, and nonce-reuse forgery.
- [crypto-lab-ed25519-forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) — EdDSA on the twisted-Edwards form of the same idea.

## Part of the Crypto-Lab Suite

> One of 170+ live browser demos at
> [systemslibrarian.github.io/crypto-lab](https://systemslibrarian.github.io/crypto-lab/)
> — spanning Atbash (600 BCE) through NIST FIPS 203/204/205 (2024).

---

_"Whether you eat or drink, or whatever you do, do all to the glory of God." — 1 Corinthians 10:31_

```

</details>

---

## X3DH Wire

- **slug**: `crypto-lab-x3dh-wire`
- **repo**: https://github.com/systemslibrarian/crypto-lab-x3dh-wire
- **live**: https://systemslibrarian.github.io/crypto-lab-x3dh-wire/
- **commit_sha**: `f656fda9646afb0ad7f7e851412fc274aa01770e` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | PROTOCOLS  ·  **level**: intermediate  ·  **--accent**: #57d4a7
- **MISSING FIELDS**: claims, mutations, verification

**Name (H1)**: X3DH  — _read from src/ui.ts_

**Subtitle**: Extended Triple Diffie-Hellman · X25519 + HKDF  — _read from src/ui.ts_

**Description**: Derives a shared secret from an offline prekey bundle using three X25519 DH terms, plus a fourth when a one-time prekey is available. Check whose identity key the bundle belongs to before trusting the session.  — _read from src/ui.ts_

**Why it matters**: Secure messengers must let people start a conversation without both parties being online at once. X3DH is the classical foundation of Signal’s asynchronous session setup, and its forward secrecy limits the damage if a key is later stolen.  — _read from src/ui.ts_

**Card copy**: Explore classical X3DH with real X25519, three required DH terms, an optional fourth one-time prekey term, and HKDF. Replace a whole signed bundle to see why Bob’s identity key must be authenticated independently.

**Chips**: X3DH · X25519 · HKDF-SHA-256 · Signal Protocol

**Implements**: AES `src/x3dh.ts:179`, AES-GCM `src/x3dh.ts:190`, Diffie-Hellman `src/kdf.ts:66`, Ed25519 `src/xeddsa.ts:43`, EdDSA `src/xeddsa.ts:136`, HKDF `src/kdf.ts:37`, HMAC `src/kdf.ts:21`, SHA-256 `src/kdf.ts:31`, SHA-512 `src/xeddsa.ts:145`, X25519 `src/x3dh.ts:59`, X3DH `src/x3dh.ts:165`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: EC point arithmetic `src/xeddsa.ts:84`

**References**: Double Ratchet, ECDH, ML-KEM, MLS, PQXDH, X448

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 5869` — first seen README.md:66 (1×)
- `rfc5869` — first seen README.md:66 (1×)

**README — What Can Go Wrong**:

```text
- A failed signed-prekey signature aborts before DH, key derivation or initial-message encryption, as required by [X3DH §3.3](https://signal.org/docs/specifications/x3dh/#sending-the-initial-message). The tamper and relay-substitution controls show this rejected outcome and disable downstream panels; they do not establish a session while ignoring verification.
- Without one-time prekeys, the handshake loses some of its forward-secrecy strength against an attacker who later compromises the recipient's keys.
- X3DH alone provides no protection for ongoing messages or replay handling; it must hand off to a post-handshake ratchet (e.g. Double Ratchet) for continued security.
- A compromised or unrotated signed prekey weakens authentication of the session setup; prekeys must be rotated and exhausted one-time prekeys replenished.
- Compromise of an identity key undermines authentication of future handshakes, so identity-key protection is critical.
- A valid signed-prekey signature proves only that the holder of the published identity key chose that prekey — it cannot prove the identity key is Bob's. An attacker who substitutes the whole bundle produces one that verifies. This lab checks its complete SHA-256 identity fingerprint against a separately trusted Bob key, and deliberately continues an unpinned branch to show the attack. [X3DH §4.1](https://signal.org/docs/specifications/x3dh/#authentication) describes authentication of identity keys; [§4.8](https://signal.org/docs/specifications/x3dh/#identity-binding) explains that identity misbinding can remain even after fingerprint comparison.
- The demo runs both sides in one browser tab with no networking or persistence, and omits X3DH's associated-data field (AD = Encode(IK_A) || Encode(IK_B)) from the AEAD call, so the initial ciphertext is not cryptographically bound to the two identity keys. It illustrates the protocol shape rather than a deployable transport.
```

**Claims tested**: _MISSING — no claims suite found_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-x3dh-wire

[![GitHub Pages](https://img.shields.io/badge/demo-live-brightgreen)](https://systemslibrarian.github.io/crypto-lab-x3dh-wire/)
[![CI](https://github.com/systemslibrarian/crypto-lab-x3dh-wire/actions/workflows/deploy.yml/badge.svg)](https://github.com/systemslibrarian/crypto-lab-x3dh-wire/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

## What It Is

This browser lab teaches the Extended Triple Diffie-Hellman (X3DH) handshake. It computes real X25519 Diffie-Hellman operations, HKDF-SHA-256, and XEdDSA signatures on signed prekeys. The signature binds a prekey to the **identity key in the offered bundle**; Alice must independently verify that this identity key belongs to Bob. The five-panel walkthrough demonstrates asynchronous setup while Bob is offline. A new whole-bundle substitution experiment shows a valid signed-prekey signature beside a mismatch against an independently trusted Bob identity fingerprint. The deliberately unpinned continuation lets the attacker derive Alice's key and decrypt her first message while Bob cannot. This distinguishes cryptographic bundle consistency from authentication of its owner.

## When to Use It

- Use it for asynchronous secure messaging bootstrapping: X3DH is designed so the initiator can derive a shared secret from published prekeys even when the recipient is offline.
- Use it to study authenticated initial key agreement: signed prekeys bind the setup to an identity key, while an authenticated comparison or trusted pin establishes whose key it is.
- Use it when your system will transition into a ratchet protocol: X3DH cleanly produces the initial secret that feeds a Double Ratchet-style root key.
- Use it to establish a starting secret only, not as a standalone long-term session protocol: ongoing message security needs a post-handshake ratchet and replay-handling design.
- Do NOT use it to secure real communications: it is an educational demo — use a vetted library such as [libsignal](https://github.com/signalfoundation/libsignal).

## Live Demo

**[systemslibrarian.github.io/crypto-lab-x3dh-wire](https://systemslibrarian.github.io/crypto-lab-x3dh-wire/)**

The lab opens with a "who holds what" view, then steps through bundle publication, Alice's initiation, three DH operations plus an optional fourth when a one-time prekey is present, key derivation, and the first encrypted message. Break-it controls unlock after the five-panel walkthrough. Panel 1 displays complete SHA-256 fingerprints of Bob's independently trusted identity key and the identity key in the offered bundle, plus a separate signed-prekey signature verdict. The six controls regenerate keys, tamper a signature, replace one prekey, replace the whole bundle, omit a one-time prekey, or corrupt Alice's ephemeral public key. The whole-bundle case has a valid signature but a failed pin: the safe, pinned path would abort, while the explicitly unpinned teaching continuation shows actual key derivation and AES-GCM decryption by the attacker. A full fingerprint is used only as a comparison aid. This lab does not implement Signal's safety-number encoding, a short authentication string, or actual human identity verification; the trusted reference is supplied by the teaching fixture.

## What Can Go Wrong

- A failed signed-prekey signature aborts before DH, key derivation or initial-message encryption, as required by [X3DH §3.3](https://signal.org/docs/specifications/x3dh/#sending-the-initial-message). The tamper and relay-substitution controls show this rejected outcome and disable downstream panels; they do not establish a session while ignoring verification.
- Without one-time prekeys, the handshake loses some of its forward-secrecy strength against an attacker who later compromises the recipient's keys.
- X3DH alone provides no protection for ongoing messages or replay handling; it must hand off to a post-handshake ratchet (e.g. Double Ratchet) for continued security.
- A compromised or unrotated signed prekey weakens authentication of the session setup; prekeys must be rotated and exhausted one-time prekeys replenished.
- Compromise of an identity key undermines authentication of future handshakes, so identity-key protection is critical.
- A valid signed-prekey signature proves only that the holder of the published identity key chose that prekey — it cannot prove the identity key is Bob's. An attacker who substitutes the whole bundle produces one that verifies. This lab checks its complete SHA-256 identity fingerprint against a separately trusted Bob key, and deliberately continues an unpinned branch to show the attack. [X3DH §4.1](https://signal.org/docs/specifications/x3dh/#authentication) describes authentication of identity keys; [§4.8](https://signal.org/docs/specifications/x3dh/#identity-binding) explains that identity misbinding can remain even after fingerprint comparison.
- The demo runs both sides in one browser tab with no networking or persistence, and omits X3DH's associated-data field (AD = Encode(IK_A) || Encode(IK_B)) from the AEAD call, so the initial ciphertext is not cryptographically bound to the two identity keys. It illustrates the protocol shape rather than a deployable transport.

## Real-World Usage

X3DH is the classical asynchronous-handshake foundation taught here. Signal announced [PQXDH on September 19, 2023](https://signal.org/blog/pqxdh/) for post-quantum setup protection and [SPQR / Triple Ratchet on October 2, 2025](https://signal.org/blog/spqr/) for continuing post-quantum ratcheting. Announcement dates are not universal migration dates for all sessions or other adopters.

Related lessons: [PQXDH Wire](https://systemslibrarian.github.io/crypto-lab-pqxdh-wire/) and [Ratchet Wire](https://systemslibrarian.github.io/crypto-lab-ratchet-wire/). Ratchet Wire’s ML-KEM setup plus classical Double Ratchet is not an SPQR implementation.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-x3dh-wire
cd crypto-lab-x3dh-wire
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-ratchet-wire](https://systemslibrarian.github.io/crypto-lab-ratchet-wire/) — the Double Ratchet that takes over after X3DH establishes the initial secret.
- [crypto-lab-key-exchange](https://systemslibrarian.github.io/crypto-lab-key-exchange/) — the Diffie-Hellman / ECDH / X25519 foundations X3DH is built from.
- [crypto-lab-noise-pipe](https://systemslibrarian.github.io/crypto-lab-noise-pipe/) — the Noise framework's handshake patterns, an alternative key-agreement design.
- [crypto-lab-mls-group](https://systemslibrarian.github.io/crypto-lab-mls-group/) — group key agreement (MLS/TreeKEM) for the many-party case.
- [crypto-lab-hybrid-wire](https://systemslibrarian.github.io/crypto-lab-hybrid-wire/) — X25519 + ML-KEM-768 hybrid key exchange for post-quantum migration.

## Tests and Verification

`​``bash
npm run typecheck   # strict TypeScript, no emit
npm test            # Vitest suite
`​``

The cryptography is checked against known-answer test vectors and protocol invariants, not just exercised:

- **HKDF-SHA-256** is verified byte-for-byte against the [RFC 5869](https://datatracker.ietf.org/doc/html/rfc5869#appendix-A) Appendix A test vectors, so key derivation is interoperable with any conforming implementation.
- **X3DH agreement symmetry**: Alice's and Bob's four Diffie-Hellman results and the final derived shared secret are asserted equal, and independent sessions are asserted to differ.
- **XEdDSA** is implemented against the [Signal XEdDSA specification](https://signal.org/docs/specifications/xeddsa/): the `hash_1` prefix, the `convert_mont` birational map, the forced sign bit, and the `Rcheck = sB - hA` verification are each asserted. Signatures produced here also verify under an independent Ed25519 verifier given `A = convert_mont(u)`, which is what XEdDSA verification is defined to be.
- **Signed-prekey authentication**: valid bundles verify; tampered prekeys and tampered signatures are rejected; and a prekey signed by any *other* identity key is rejected — the signature is checked against the bundle's own IK_B, so there is no separate signing key an attacker could swap in alongside it.
- **Identity pin versus self-consistent bundle**: the same Bob, Alice, and attacker key pairs are tested in honest and whole-bundle-swap runs. The attacker signature remains valid, the offered fingerprint differs from the trusted Bob fingerprint, Alice and the attacker derive matching secrets, Bob derives a different one, and only the attacker decrypts on the deliberately unpinned branch. A browser test checks the visible outcomes and recovery to the honest run.
- **AES-GCM initial message**: round-trips under the derived key, and fails authentication under a wrong key or a tampered ciphertext.

Every push and pull request runs typecheck plus the full suite via GitHub Actions (`.github/workflows/deploy.yml`), and a deploy only ships after those pass.

## Security Note

This is an **educational demonstration**, not a production cryptography library. It runs both sides of the handshake in a single browser tab to make every intermediate value visible, and performs no networking or persistence. It implements XEdDSA for legibility against the specification rather than for constant-time execution, and it omits X3DH's associated-data (AD) field, which real deployments pass to the AEAD to bind the initial ciphertext to both identity keys. Do not use it to secure real communications — use a vetted library such as [libsignal](https://github.com/signalfoundation/libsignal).

## License

Released under the [MIT License](./LICENSE).

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Publishing requests

`npm run deploy` requests the existing `deploy.yml` workflow at `main`.
The workflow retains its full type, unit, build and browser gates. A successful
request is not evidence of publication; inspect the run and actual public site.
Failed requests retain their nonzero exit status.

```

</details>

---

## Noise Pipe

- **slug**: `crypto-lab-noise-pipe`
- **repo**: https://github.com/systemslibrarian/crypto-lab-noise-pipe
- **live**: https://systemslibrarian.github.io/crypto-lab-noise-pipe/
- **commit_sha**: `6bf2c12cae3333038b8a85e8bb1b68cc2261a35f` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `56fbddba1e9f135a0d40d7a3977a8667cf616426`
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | PROTOCOLS  ·  **level**: intermediate  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, mutations, verification

**Name (H1)**: Noise Pipe  — _read from index.html_

**Subtitle**: Noise Protocol Framework · X25519 · HKDF-SHA-256 · AES-256-GCM  — _read from index.html_

**Description**: Pick a Noise handshake pattern from its DH-operation tokens and watch the chosen pattern deterministically fix the channel's authentication, forward-secrecy, and identity-hiding properties.  — _read from index.html_

**Why it matters**: Noise underpins WireGuard, the Lightning Network, and WhatsApp's transport layer — real channels where one wrong pattern choice silently drops authentication or forward secrecy. There is no in-protocol negotiation to downgrade and no certificate authority — the pattern is fixed before the first byte, and trusting the keys themselves stays the application's job.  — _read from index.html_

**Card copy**: NN, XX, IK, and IKpsk2 handshake patterns with real X25519 arithmetic, live transport encryption, and a WireGuard deep dive.

**Chips**: X25519 · HKDF · WireGuard · Handshake Patterns

**Implements**: AES `src/crypto.ts:103`, AES-GCM `src/crypto.ts:103`, Diffie-Hellman `src/crypto.ts:26`, HKDF `src/crypto.ts:59`, HMAC `src/crypto.ts:46`, Noise protocol `src/noise.ts:181`, SHA-256 `src/crypto.ts:46`, X25519 `src/crypto.ts:8`

**Attacks shown**: Man-in-the-middle `src/patterns.ts:566`, Nonce reuse `src/noise.ts:977`

**References**: BLAKE2, ChaCha20, ChaCha20-Poly1305, Double Ratchet, EC point arithmetic, ECDH, Ed25519, ML-KEM, MLS, Poly1305, TLS 1.3, X3DH, secp256k1

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 5869` — first seen README.md:63 (3×)
- `RFC 7748` — first seen README.md:63 (1×)
- `RFC 9846` — first seen src/patterns.ts:370 (1×)

**README — What Can Go Wrong**:

```text
- **Wrong pattern chosen for the threat model** — selecting NN when authentication is required means either party can be impersonated by anyone; Noise provides no runtime negotiation or fallback to detect this mismatch.
- **IK or IKpsk2 with an unverified static key** — these patterns assume the initiator already holds the responder's authentic static public key; if this key is substituted by an attacker (e.g., via a compromised key-distribution channel), the responder can be fully impersonated without breaking X25519.
- **AES-256-GCM nonce counter exhaustion** — the transport nonce is a 64-bit counter, and reusing one under the same key would be catastrophic for AES-GCM's authentication and confidentiality. Noise's answer is to make exhaustion a hard stop rather than a wraparound: the spec reserves the maximum value 2⁶⁴−1, and requires that once incrementing `n` reaches it, any further encrypt or decrypt call **signals an error to the caller** (spec §5.1) — a spec-compliant session therefore refuses to continue rather than repeating a nonce. The failure mode to design for is an application that must rekey or reconnect after 2⁶⁴−1 messages, not one that silently loses confidentiality. *(Demo caveat: this teaching implementation tracks the nonce as a JavaScript `number` and trips its "must rekey" guard at 2⁵³−1, the largest exactly-representable integer, rather than the spec ceiling of 2⁶⁴−1. The behaviour is faithful; the exact threshold is an approximation. A production build would use a BigInt or 64-bit counter.)*
- **PSK reuse in IKpsk2** — the pre-shared key must be rotated out-of-band; a long-lived PSK that is never rotated steadily erodes its post-quantum and identity-hiding contributions, especially if the PSK is shared across multiple sessions.
- **Handshake hash not bound at the application layer** — if the application does not verify the channel binding (the final handshake hash) out-of-band or via a higher-level protocol message, a network-level adversary can attempt session confusion attacks across concurrent connections.
```

**Claims tested** (e2e/claims.spec.ts, 27 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:23
    - :23 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:31
    - :31 `toHaveText` expected `'Handshake complete'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:42
    - :42 `toHaveText` expected `PROTOCOL(name)` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:43
    - :43 `toHaveText` expected `'Handshake complete'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:79
    - :79 `toBeVisible` expected _no expected value_ _(none)_
- `the handshake completes and the walkthrough agrees with the pattern listing` — e2e/claims.spec.ts:87
    - :97 `expect` expected _no expected value_ _(none)_
    - :100 `toHaveText` expected `'Message 1 of ${expected}'` _(expression)_
    - :103 `toBe` expected `expected` _(expression)_
    - :104 `toHaveText` expected `'Message ${expected} of ${expected}'` _(expression)_
- `the step controls stay alive in both directions` — e2e/claims.spec.ts:110
    - :118 `toBeDisabled` expected _no expected value_ _(none)_
    - :119 `toBeEnabled` expected _no expected value_ _(none)_
    - :122 `expect` expected _no expected value_ _(none)_
    - :123 `toBeDisabled` expected _no expected value_ _(none)_
    - :124 `toBeEnabled` expected _no expected value_ _(none)_
    - :129 `toHaveText` expected `'Message 1 of ${total}'` _(expression)_
    - :130 `toBeDisabled` expected _no expected value_ _(none)_
    - :131 `toBeEnabled` expected _no expected value_ _(none)_
- `the transport panel shows the keys the walkthrough says Split derived` — e2e/claims.spec.ts:138
    - :153 `toBeVisible` expected _no expected value_ _(none)_
    - :157 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :158 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :159 `toBe` expected `loggedRecv` _(expression)_
    - :162 `toHaveText` expected `loggedSend!` _(expression)_
    - :163 `toHaveText` expected `loggedRecv!` _(expression)_
- `transport encrypt/decrypt round-trips and the nonce counts the sends` — e2e/claims.spec.ts:170
    - :181 `toHaveText` expected `plaintext` _(expression)_
    - :185 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :186 `toBe` expected `plaintext.length + 16` _(expression)_
    - :187 `toHaveText` expected `'1'` _(literal)_
    - :192 `toHaveText` expected `'2'` _(literal)_
    - :194 `toBe` expected `ct1` _(expression)_
    - :195 `toHaveText` expected `plaintext` _(expression)_
    - :198 `toHaveText` expected `'0'` _(literal)_
    - :201 `toHaveText` expected `'roger'` _(literal)_
    - :202 `toHaveText` expected `'1'` _(literal)_
    - :203 `toHaveText` expected `'2'` _(literal)_
    - :210 `toHaveText` expected `'0'` _(literal)_
    - :211 `toHaveText` expected `'0'` _(literal)_
    - :212 `toHaveText` expected `''` _(literal)_
    - :213 `toHaveText` expected `keyBeforeReset ?? ''` _(expression)_
    - :215 `toHaveText` expected `plaintext` _(expression)_
    - :216 `toHaveText` expected `'1'` _(literal)_
- `a new session never replays a (key, nonce) pair` — e2e/claims.spec.ts:219
    - :237 `toHaveText` expected `'1'` _(literal)_
    - :241 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :244 `toHaveText` expected `'0'` _(literal)_
    - :249 `toBe` expected `sendKeyBefore` _(expression)_
    - :250 `toBe` expected `recvKeyBefore` _(expression)_
    - :256 `toHaveText` expected `'1'` _(literal)_
    - :258 `expect` expected _no expected value_ _(none)_
    - :264 `toHaveText` expected `plaintext` _(expression)_
- `the displayed nonce counts records, and identical plaintext never repeats bytes` — e2e/claims.spec.ts:267
    - :288 `toHaveText` expected `plaintext` _(expression)_
    - :289 `expect` expected _no expected value_ _(none)_
    - :294 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :297 `toHaveLength` expected `4` _(literal)_
    - :298 `expect` expected _no expected value_ _(none)_
- `two sends fired in one tick cannot share a nonce` — e2e/claims.spec.ts:304
    - :338 `toHaveText` expected `'IDENTICAL PLAINTEXT'` _(literal)_
    - :345 `expect` expected _no expected value_ _(none)_
    - :346 `expect` expected _no expected value_ _(none)_
    - :352 `expect` expected _no expected value_ _(none)_
- `the transport readout retires when the input it described changes` — e2e/claims.spec.ts:358
    - :368 `toHaveText` expected `'first'` _(literal)_
    - :371 `toHaveText` expected `''` _(literal)_
    - :372 `toHaveText` expected `''` _(literal)_
    - :377 `toHaveText` expected `'second'` _(literal)_
    - :380 `toHaveText` expected `keyBefore!` _(expression)_
    - :381 `toHaveText` expected `''` _(literal)_
    - :382 `toContainText` expected `'rekeyed'` _(literal)_
    - :383 `toContainText` expected `'old k'` _(literal)_
    - :388 `toHaveText` expected `'after rekey'` _(literal)_
- `break-it: ${pattern} / ${attack} → ${badge}` — e2e/claims.spec.ts:431
    - :436 `expect` expected _no expected value_ _(none)_
    - :437 `toMatch` expected `cause` _(expression)_
    - :440 `expect` expected _no expected value_ _(none)_
- `the responder-static swap is an impersonation, demonstrated in bytes` — e2e/claims.spec.ts:445
    - :463 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :464 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :465 `toBe` expected `real` _(expression)_
    - :468 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :469 `toBe` expected `initiatorKey` _(expression)_
    - :475 `expect` expected _no expected value_ _(none)_
- `IKpsk2 rsswap: "held" still reports the message-1 identity exposure, in bytes` — e2e/claims.spec.ts:478
    - :489 `expect` expected _no expected value_ _(none)_
    - :490 `toMatch` expected `/message 1/i` _(regex)_
    - :495 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :496 `toBe` expected `initiatorStatic` _(expression)_
- `the bit-flip result is internally consistent: one byte, one bit` — e2e/claims.spec.ts:499
    - :507 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :508 `toHaveLength` expected `clean!.length` _(expression)_
    - :513 `toHaveLength` expected `1` _(literal)_
    - :514 `toBe` expected `0x80` _(expression)_
    - :515 `toBe` expected `0` _(literal)_
- `nonce reuse is demonstrated, not asserted: the two XORs agree` — e2e/claims.spec.ts:518
    - :532 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :533 `toBe` expected `ct1` _(expression)_
    - :534 `toBe` expected `ptXor` _(expression)_
    - :535 `toMatch` expected `/^0+$/` _(regex)_
    - :542 `toBe` expected `ctXor` _(expression)_
- `break-it verdicts retire when the pattern they describe changes` — e2e/claims.spec.ts:545
    - :551 `expect` expected _no expected value_ _(none)_
    - :556 `toHaveText` expected `''` _(literal)_
    - :557 `toHaveCount` expected `0` _(literal)_
- `an attack already in flight cannot repaint the panel after the pattern changes` — e2e/claims.spec.ts:560
    - :586 `toHaveText` expected `PROTOCOL('NN')` _(expression)_
    - :587 `toHaveText` expected `'Handshake complete'` _(literal)_
    - :593 `expect` expected _no expected value_ _(none)_
    - :597 `toBe` expected `''` _(literal)_
- `a pattern switched mid-handshake never leaves the previous handshake on screen` — e2e/claims.spec.ts:600
    - :625 `toHaveText` expected `PROTOCOL('NN')` _(expression)_
    - :626 `toHaveText` expected `'Handshake complete'` _(literal)_
    - :631 `toHaveText` expected _no expected value_ _(none)_
    - :635 `toBe` expected `2` _(literal)_
    - :639 `expect` expected _no expected value_ _(none)_
- `the forward-secrecy verdict reports how many keys it actually tried` — e2e/claims.spec.ts:645
    - :666 `expect` expected _no expected value_ _(none)_
    - :670 `expect` expected _no expected value_ _(none)_
    - :671 `expect` expected _no expected value_ _(none)_
    - :674 `expect` expected _no expected value_ _(none)_
    - :675 `toBe` expected `0` _(literal)_
    - :676 `expect` expected _no expected value_ _(none)_
    - :684 `expect` expected _no expected value_ _(none)_
    - :686 `expect` expected _no expected value_ _(none)_
    - :690 `expect` expected _no expected value_ _(none)_
    - :693 `expect` expected _no expected value_ _(none)_
    - :698 `expect` expected _no expected value_ _(none)_
    - :699 `expect` expected _no expected value_ _(none)_
- `wire-block segments sum to the message total, on every step` — e2e/claims.spec.ts:706
    - :721 `expect` expected _no expected value_ _(none)_
    - :722 `toBe` expected `false` _(expression)_
    - :723 `toBe` expected `false` _(expression)_
    - :724 `expect` expected _no expected value_ _(none)_
- `the wire view shows a static key in the clear only when no k exists yet` — e2e/claims.spec.ts:734
    - :740 `toContainText` expected `'🔓'` _(literal)_
    - :741 `toContainText` expected `'🔒'` _(literal)_
    - :742 `toContainText` expected `'in the clear'` _(literal)_
    - :748 `toContainText` expected `'🔒'` _(literal)_
    - :749 `toContainText` expected `'🔓'` _(literal)_
    - :750 `toContainText` expected `'encrypted'` _(literal)_
- `nothing carrying the hidden attribute is still painted` — e2e/claims.spec.ts:757
    - :768 `toEqual` expected `[]` _(expression)_
- `the what's-new banner describes the pattern on screen, or nothing` — e2e/claims.spec.ts:771
    - :778 `toBeVisible` expected _no expected value_ _(none)_
    - :779 `toContainText` expected `'Start here'` _(literal)_
    - :782 `toBeVisible` expected _no expected value_ _(none)_
    - :783 `toContainText` expected `'New vs NN'` _(literal)_
    - :786 `toBeVisible` expected _no expected value_ _(none)_
    - :787 `toContainText` expected `'New vs NK'` _(literal)_
    - :792 `toBeHidden` expected _no expected value_ _(none)_
    - :795 `toBeVisible` expected _no expected value_ _(none)_
    - :796 `toContainText` expected `'New vs XX'` _(literal)_
- `the comparison table agrees with each pattern panel about its properties` — e2e/claims.spec.ts:803
    - :819 `toHaveLength` expected `3` _(literal)_
    - :820 `toBe` expected `false` _(expression)_
    - :836 `toEqual` expected `panelValues` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-noise-pipe

> `Noise Protocol` · `X25519` · `AES-256-GCM` · `HKDF-SHA-256`

## What It Is

The **Noise Protocol Framework** is a framework for constructing cryptographic handshake protocols from composable patterns. Instead of negotiating cipher suites like TLS, you choose a **handshake pattern** — a fixed sequence of **X25519** (Curve25519 ECDH) Diffie-Hellman operations — and the security properties follow deterministically from the pattern definition. Key material is derived throughout the handshake using **HKDF-SHA-256** applied to a chaining key and running handshake hash; once the handshake completes, both parties hold symmetric **AES-256-GCM** transport keys with independent send and receive nonce counters. The security model is asymmetric during the handshake (static and ephemeral Diffie-Hellman key pairs) and symmetric during transport (256-bit-keyed AEAD encryption). The optional PSK mode used in IKpsk2 adds a pre-shared symmetric secret as a post-quantum defensive hedge without changing the handshake round-trips.

## When to Use It

- **You need a secure channel without TLS PKI** — Noise eliminates certificate authorities and in-protocol cipher-suite negotiation, so there is no in-protocol downgrade path; the pattern chosen at design time determines all authentication and secrecy properties with no runtime negotiation. Two responsibilities stay with the application: any version or pattern choice it negotiates *before* the handshake must be bound into the prologue (or another authenticated context) or downgrade returns through that door, and the static public keys still need a trustworthy distribution mechanism — no CA does not mean no trust bootstrap.
- **You need precisely scoped authentication** — patterns such as XX (mutual), NK (known responder static key), NN (anonymous), and IKpsk2 (mutual + PSK) let you express exactly the authentication model your application requires, not whatever TLS negotiates.
- **You are building a peer-to-peer or embedded transport** — Noise is designed for application-layer use where PKI infrastructure is absent or impractical, such as VPN tunnels, IoT devices, or payment-channel networks.
- **You require proven forward secrecy** — every Noise pattern derives its **transport** keys from per-session ephemeral X25519 key pairs, so recorded transport traffic stays secure even if long-term static keys are later compromised. Read that as scoped to transport, not to the whole session. Patterns that pre-share the responder's static key (NK, KK, XK, IK, IKpsk2) encrypt their **first message payload** before the ephemeral-ephemeral DH runs, using only `es` and `ss`. The Noise spec's payload-security table grades that payload destination 2 — "encryption to a known recipient, forward secrecy for sender compromise only" — so an attacker who records the handshake and later steals the responder's static key can decrypt it. In IK and IKpsk2 that first message also carries the initiator's static key, so its identity falls the same way (spec §7.8 grade 4: encrypted, but without forward secrecy). This is the same trade-off as TLS 1.3 0-RTT early data, and it is what buys the round trip these patterns save. One further direction-specific caveat (spec §7.7): in patterns starting with K or I, the responder is guaranteed only weak forward secrecy for the transport messages it sends until it receives a transport message from the initiator. If you need forward secrecy for the first payload too, use XX or NX, which encrypt nothing before `ee` runs.
- **Do not use Noise** when you need interoperability with existing TLS-based infrastructure (web servers, browsers, HTTPS APIs) — Noise is not TLS and does not speak the TLS record protocol.
- **Do NOT treat this as production code** — it is a teaching demo for stepping through handshake patterns, not a hardened Noise implementation.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-noise-pipe](https://systemslibrarian.github.io/crypto-lab-noise-pipe/)**

Select from thirteen handshake patterns (NN, NK, NX, KN, IN, KX, XN, XK, KK, IX, IK, XX, IKpsk2). The demo opens on **NN** — the simplest complete handshake (two ephemeral keys, one DH, no identities) — and offers a **guided path** (NN → NK → XX → IKpsk2) with a "what's new in this pattern vs the last" banner, so a newcomer meets one new idea at a time before the full thirteen-pattern grid. Patterns are ordered simplest → most complex throughout.

An **"Anatomy of a token"** onboarding step animates the DH-token notation directly: pick `ee`/`es`/`se`/`ss` and watch the two labeled key icons (e.g. *my ephemeral* × *their static*) slide into a DH mixer that emits the chaining-key update — and toggling **Initiator ↔ Responder** physically swaps which operand is yours, making the role-dependent `es`/`se` flip concrete instead of a tooltip.

Step through each handshake message one at a time, observing real X25519 DH scalar multiplications (each shown as **which two public keys were multiplied**, not just an output blob), chaining-key evolution via HKDF-SHA-256, and running handshake-hash updates. The per-party state is split into two captioned tracks — a **transcript** lane for `h` ("everything said so far, hashed — binds every handshake byte into one fingerprint") and a **key-schedule** lane for `ck→k` ("the secret that grows with each DH") — and each token is labeled *binds to transcript* and/or *adds to key schedule* as it fires. A **segmented on-the-wire byte-block view** shows each message's bytes (ephemeral pubkey · encrypted/plaintext static · AEAD tag), lighting up when the static key becomes **encrypted** (a `k` now exists) versus sent in the clear — making identity hiding visible per pattern. A **predict-before-you-step** prompt lets you commit to an answer and then reveals whether only `h` changes or `h` and `ck/k` both change.

After handshake completion, encrypt and decrypt plaintext messages using the derived AES-256-GCM transport keys with live nonce tracking; a Pattern Comparison panel shows NN, XX, IK, and IKpsk2 side-by-side, and a WireGuard Deep Dive panel maps IKpsk2 token-by-token to WireGuard's actual Initiator and Responder messages.

The **Break it** panel proves security properties by live attack rather than by badge — bit-flip tamper (AEAD tag), responder-static swap run as a genuine impersonation — the attacker holds the private key for the substituted `rs` and answers in the responder's place, so IK/NK/XK/KK complete the handshake with it and hand it the *same transport key* the initiator derived, while IKpsk2 refuses because the attacker never had the PSK — transport nonce reuse (leaking the plaintext XOR), PSK mismatch, message replay, and a **forward-secrecy demonstration**: it records a transport message, then "compromises" both static private keys *after the fact* and shows the recorded ciphertext still cannot be decrypted (the session key came from the discarded ephemeral DH), contrasted against a hypothetical static-only channel that the same attacker decrypts instantly.

## What Can Go Wrong

- **Wrong pattern chosen for the threat model** — selecting NN when authentication is required means either party can be impersonated by anyone; Noise provides no runtime negotiation or fallback to detect this mismatch.
- **IK or IKpsk2 with an unverified static key** — these patterns assume the initiator already holds the responder's authentic static public key; if this key is substituted by an attacker (e.g., via a compromised key-distribution channel), the responder can be fully impersonated without breaking X25519.
- **AES-256-GCM nonce counter exhaustion** — the transport nonce is a 64-bit counter, and reusing one under the same key would be catastrophic for AES-GCM's authentication and confidentiality. Noise's answer is to make exhaustion a hard stop rather than a wraparound: the spec reserves the maximum value 2⁶⁴−1, and requires that once incrementing `n` reaches it, any further encrypt or decrypt call **signals an error to the caller** (spec §5.1) — a spec-compliant session therefore refuses to continue rather than repeating a nonce. The failure mode to design for is an application that must rekey or reconnect after 2⁶⁴−1 messages, not one that silently loses confidentiality. *(Demo caveat: this teaching implementation tracks the nonce as a JavaScript `number` and trips its "must rekey" guard at 2⁵³−1, the largest exactly-representable integer, rather than the spec ceiling of 2⁶⁴−1. The behaviour is faithful; the exact threshold is an approximation. A production build would use a BigInt or 64-bit counter.)*
- **PSK reuse in IKpsk2** — the pre-shared key must be rotated out-of-band; a long-lived PSK that is never rotated steadily erodes its post-quantum and identity-hiding contributions, especially if the PSK is shared across multiple sessions.
- **Handshake hash not bound at the application layer** — if the application does not verify the channel binding (the final handshake hash) out-of-band or via a higher-level protocol message, a network-level adversary can attempt session confusion attacks across concurrent connections.

## Real-World Usage

- **WireGuard** — uses the Noise IKpsk2 pattern as its entire VPN handshake; the pattern's mutual static-key authentication, ephemeral forward secrecy, and PSK layer map directly to WireGuard's Initiator and Responder handshake messages ([WireGuard paper, Donenfeld 2017](https://www.wireguard.com/papers/wireguard.pdf)).
- **Lightning Network** — BOLT #8 specifies Noise_XK_secp256k1_ChaChaPoly_SHA256 for encrypted transport between Lightning nodes, providing forward secrecy and responder identity hiding without a PKI.
- **WhatsApp** — the transport layer between WhatsApp clients and servers uses a Noise-based protocol, providing forward secrecy and mutual authentication independently of the Signal end-to-end encryption layer.
- **libp2p** — the peer-to-peer networking library used by IPFS and Ethereum clients implements Noise XX as its default secure channel protocol (libp2p Noise spec), providing mutual authentication and identity hiding for both peers.

## How to Run Locally

Use Node.js 24 to match the CI runtime.

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-noise-pipe
cd crypto-lab-noise-pipe
npm install
npm run dev
`​``

## Correctness & Tests

The handshake is a real, spec-faithful implementation (CipherState / SymmetricState / HandshakeState, PSK, Split, Rekey) — not a mock. To keep it honest, `npm test` runs a Vitest suite that:

- **Cross-checks the full handshake against published Noise test vectors** from the [noise-c](https://github.com/rweather/noise-c) suite (also reproduced verbatim by Rust `snow` and Haskell `cacophony`). For `NN`, `XX`, `KK`, and `IK` it asserts every handshake message's exact wire bytes, the final handshake hash (channel binding), and the post-`Split()` transport ciphertexts — byte for byte.
- **Anchors the primitives** with known-answer tests: X25519 (RFC 7748 §6.1), HKDF-SHA-256 (RFC 5869 Test Case 1), SHA-256 and AES-256-GCM (NIST) digests, and the AES-GCM nonce encoding (Noise §12.4, big-endian).
- **Verifies structural invariants and failure modes** across every advertised pattern: both parties derive matching transport keys, AEAD rejects bit-flips and wrong keys, a substituted responder static key lets an impersonator complete the handshake and derive the initiator's transport key (IK/NK/XK — the pre-known `rs` is trusted unconditionally) while IKpsk2 stops the same attacker for want of the PSK, mismatched PSKs break the handshake, and replayed first messages are (correctly) accepted since core Noise has no replay protection.

These vectors caught a real bug during development: AES-GCM nonces were being encoded little-endian instead of big-endian, which silently corrupted every message after the first keyed one (`n >= 1`). The fix is anchored by the KATs above.

## Related Demos

- [crypto-lab-ratchet-wire](https://systemslibrarian.github.io/crypto-lab-ratchet-wire/) — Double Ratchet algorithm (Signal Protocol).
- [crypto-lab-x3dh-wire](https://systemslibrarian.github.io/crypto-lab-x3dh-wire/) — X3DH asynchronous key agreement protocol.
- [crypto-lab-hybrid-wire](https://systemslibrarian.github.io/crypto-lab-hybrid-wire/) — hybrid X25519 + ML-KEM-768 key exchange.
- [crypto-lab-mls-group](https://systemslibrarian.github.io/crypto-lab-mls-group/) — MLS/TreeKEM for scalable encrypted group messaging.
- [crypto-lab-ssh-handshake](https://systemslibrarian.github.io/crypto-lab-ssh-handshake/) — the SSH transport handshake and TOFU trust model.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## IPsec / IKE

- **slug**: `crypto-lab-ipsec-ike`
- **repo**: https://github.com/systemslibrarian/crypto-lab-ipsec-ike
- **live**: https://systemslibrarian.github.io/crypto-lab-ipsec-ike/
- **commit_sha**: `3019cef4c514b5649aa530b74f3a6053deda4b4c` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `12dd3dba9c54e2e791d466531eafae4e6c3ae765`
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | PROTOCOLS  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: subtitle, description, why_it_matters, accent, verification, limitations

**Name (H1)**: From IKE policy to an authenticated ESP packet  — _read from src/main.ts_

**Subtitle**: _MISSING_

**Description**: _MISSING_

**Why it matters**: _MISSING_

**Card copy**: Apply an ordered SPD, run a four-message PSK IKEv2 exchange, derive two simplex Child SAs, then protect real IPv4 bytes with ESP AES-GCM while exercising mode negotiation, replay handling, deletion, and rekey.

**Chips**: IKEv2 · ESP · AES-GCM-16 · Anti-Replay

**Implements**: AES `src/protocol/primitives.ts:45`, AES-GCM `src/protocol/primitives.ts:45`, Diffie-Hellman `src/protocol/ike.ts:573`, HMAC `src/protocol/primitives.ts:19`, IKEv2 `src/protocol/ike-wire.ts:91`, IPsec ESP `src/protocol/esp.ts:149`, SHA-256 `src/protocol/primitives.ts:19`, X25519 `src/protocol/x25519.ts:17`

**Attacks shown**: _none derived_

**References**: EC point arithmetic, X448

**Standards body**: IETF, NIST

**Implementation**: WebCrypto AES-GCM, HMAC and SHA-256 / local TypeScript and BigInt X25519, IKEv2, ESP, IPv4 and protocol-state teaching implementations

**Spec citations, exactly as written**:

- `RFC 4106` — first seen README.md:58 (2×)
- `RFC 4301` — first seen README.md:56 (1×)
- `RFC 4303` — first seen README.md:57 (5×)
- `RFC 5282` — first seen README.md:59 (2×)
- `RFC 7296` — first seen README.md:60 (3×)
- `RFC 7748` — first seen README.md:50 (3×)
- `RFC 8031` — first seen README.md:25 (6×)
- `RFC 8221` — first seen README.md:63 (1×)
- `RFC 8247` — first seen README.md:64 (2×)
- `RFC 9370` — first seen README.md:65 (1×)
- `RFC 9827` — first seen README.md:66 (1×)
- `rfc4106` — first seen README.md:58 (2×)
- `rfc4301` — first seen README.md:56 (1×)
- `rfc4303` — first seen README.md:57 (2×)
- `rfc5282` — first seen README.md:59 (2×)
- `rfc7296` — first seen README.md:60 (2×)
- `rfc7748` — first seen README.md:61 (1×)
- `rfc8031` — first seen README.md:62 (2×)
- `rfc8221` — first seen README.md:63 (1×)
- `rfc8247` — first seen README.md:64 (1×)
- `rfc9370` — first seen README.md:65 (1×)
- `rfc9827` — first seen README.md:66 (1×)

**Claims tested** (e2e/claims.spec.ts, 9 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:6
    - :6 `toHaveAttribute` expected `"aria-busy", "false"` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:8
    - :8 `toContainText` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:11
    - :11 `toContainText` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:22
    - :22 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
- `the fixed run connects policy, four IKE messages, and two simplex Child SAs` — e2e/claims.spec.ts:26
    - :32 `toHaveCount` expected `3` _(literal)_
    - :33 `toContainText` expected `"DISCARD"` _(literal)_
    - :34 `toContainText` expected `"BYPASS"` _(literal)_
    - :35 `toContainText` expected `"PROTECT"` _(literal)_
    - :36 `toContainText` expected `"IP protocol 1"` _(literal)_
    - :37 `toContainText` expected `"destination port"` _(literal)_
    - :40 `toHaveCount` expected `4` _(literal)_
    - :42 `toHaveLength` expected `4` _(literal)_
    - :43 `toBe` expected `4` _(literal)_
    - :44 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :47 `toHaveCount` expected `2` _(literal)_
    - :54 `toBe` expected `second[1]` _(expression)_
    - :55 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :56 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :57 `toMatch` expected `/^[0-9a-f]{8}$/` _(regex)_
    - :58 `toMatch` expected `/^[0-9a-f]{8}$/` _(regex)_
    - :59 `toBe` expected `'${second[2]}${second[3]}'` _(expression)_
    - :60 `toContainText` expected `"PASS"` _(literal)_
- `the rendered ESP fields form one AES-GCM packet and decrypt to the rendered protected bytes` — e2e/claims.spec.ts:63
    - :72 `toHaveLength` expected `5` _(literal)_
    - :78 `toHaveLength` expected `4` _(literal)_
    - :91 `toBe` expected `receiverSpi` _(expression)_
    - :92 `toBe` expected _no expected value_ _(none)_
    - :95 `toBe` expected `'${salt}${explicitIv}'` _(expression)_
    - :96 `toBe` expected `'${aad}${explicitIv}${ciphertext}${tag}'` _(expression)_
    - :116 `toBe` expected `protectedBytes` _(expression)_
    - :117 `toEqual` expected _no expected value_ _(none)_
    - :120 `toBe` expected `4` _(literal)_
    - :121 `toBe` expected _no expected value_ _(none)_
    - :124 `toContainText` expected _no expected value_ _(none)_
- `the receiver table exposes precheck, authentication, and SAD failures without moving state` — e2e/claims.spec.ts:129
    - :134 `toHaveCount` expected `7` _(literal)_
    - :142 `toEqual` expected `[` _(expression)_
    - :151 `toContainText` expected `"PASS"` _(literal)_
    - :152 `expect` expected _no expected value_ _(none)_
    - :155 `expect` expected _no expected value_ _(none)_
- `transport echo, tunnel fallback, and policy refusal produce distinct current states` — e2e/claims.spec.ts:160
    - :164 `toHaveAttribute` expected `"aria-busy", "false"` _(expression)_
    - :166 `toBeEnabled` expected _no expected value_ _(none)_
    - :167 `toBeEnabled` expected _no expected value_ _(none)_
    - :170 `toContainText` expected `"completed"` _(literal)_
    - :171 `toContainText` expected `"transport"` _(literal)_
    - :172 `toHaveText` expected _no expected value_ _(none)_
    - :178 `toContainText` expected `"completed"` _(literal)_
    - :179 `expect` expected _no expected value_ _(none)_
    - :186 `toBeVisible` expected _no expected value_ _(none)_
    - :190 `toContainText` expected `"completed"` _(literal)_
    - :191 `toContainText` expected _no expected value_ _(none)_
    - :194 `toContainText` expected _no expected value_ _(none)_
    - :197 `toHaveCount` expected `0` _(literal)_
    - :198 `toHaveCount` expected `0` _(literal)_
- `a fresh rerun retires every prior result and publishes a new run token` — e2e/claims.spec.ts:201
    - :210 `toContainText` expected `"fresh learner run"` _(literal)_
    - :215 `toBe` expected `fixedToken` _(expression)_
    - :216 `toContainText` expected _no expected value_ _(none)_

**Mutation records** (1 file(s)):

- `scripts/claim-mutations.mjs` (11187 bytes)

<details><summary>Full README</summary>

```markdown
# IPsec / IKE — Crypto Lab

[Live Demo](https://systemslibrarian.github.io/crypto-lab-ipsec-ike/)

## What It Is

This lab is a bounded, executable IKEv2 and ESP packet-flow lesson. It applies an ordered Security Policy Database, performs a real four-message PSK IKEv2 setup with X25519, derives two unidirectional Child-SA key streams, and protects actual IPv4 bytes with AES-GCM-16/128. The receiver performs SAD lookup, a non-mutating 64-packet replay precheck, authentication, replay-state commit, trailer validation, packet reconstruction, and checksum verification in that order. Separate cases execute transport negotiation, tunnel fallback, protected Child-SA deletion, valid reordering, replay, too-old and invalid-tag handling, and fresh-state Child-SA rekeying. It is deliberately not an interoperable VPN daemon or production credential store.

## When to Use It

- Use it to trace where IPsec policy ends and route selection begins, because the three SPD dispositions and the route are computed separately.
- Use it to inspect IKEv2 and ESP bytes, keys, nonces, AAD and state transitions, because every displayed outcome is derived from the current browser run.
- Use it for testing replay, mode-fallback and Child-SA rekey reasoning, because the negative cases exercise the same packet receiver and state as the honest path.
- Do not use it to protect real traffic or select deployment algorithms, because it is a demo app and does not provide hardened operational controls.

## Declared teaching profile

- IPv4 TEST-NET fixtures; no network packets leave the browser.
- IKEv2 PSK AUTH method 2, Curve25519 Key Exchange Method 31 computed with X25519, PRF_HMAC_SHA2_256 transform 5, and ENCR_AES_GCM_16 transform 20 with a 128-bit key attribute.
- AEAD-only IKE key split: zero-length `SK_ai`/`SK_ar`, 20-byte `SK_ei`/`SK_er` values (16-byte AES key plus four-byte salt).
- Initial Child SA established inside IKE_AUTH with no KE or INTEG transform; `KEYMAT = prf+(SK_d, Ni | Nr)`.
- ESP transform 20, sequence-numbers transform 0, a 16-byte tag, minimal default padding, and a 64-packet replay window.
- Separate per-direction IKE IV allocators and ESP sequence/IV allocators burn state before AEAD and cache exact successful IKE retransmissions.

Fresh learner runs generate new X25519 private scalars, nonces, IKE SPIs, Child-SA SPIs and a binary teaching PSK with Web Crypto. The “Load fixed evidence” control is the only deterministic application seam. It pins published RFC 8031 X25519 inputs plus project-owned IKE and ESP transcript oracles independently recomputed with Node’s cryptographic implementation in tests.

## Run locally

Requires Node.js 22.13.x, an even-numbered Node.js release from 24 onward, or Node.js 26+.

`​``sh
npm ci
npm run dev
`​``

The complete local gate is:

`​``sh
npm run format:check
npm run typecheck
npm run lint
npm run test:coverage
npm run build
npm run test:e2e
npm run test:mutations
`​``

## Security boundaries

The lesson excludes certificates, EAP, IPv6, NAT traversal, fragmentation, MOBIKE, multiple proposals, AH, multicast, traffic-flow-confidentiality padding, extended sequence numbers, kernel routing and production secret storage. Its sequence-derived ESP explicit IV is a declared uniqueness construction for this profile, not an IKE-negotiated universal algorithm. Its hand-written BigInt X25519 ladder is testable teaching arithmetic, not constant-time production code. Rejecting an all-zero X25519 shared result is the demo’s optional RFC 7748 local policy; it is not presented as an RFC 8031 MUST. Registered algorithm requirement levels describe implementation support and are not universal deployment recommendations.

See [the implementation brief](docs/e-k-03-brief.md) for exact source sections, wire choices, vector provenance and retained limits.

## Primary references

- [RFC 4301 — Security Architecture for IP](https://www.rfc-editor.org/rfc/rfc4301.html)
- [RFC 4303 — Encapsulating Security Payload](https://www.rfc-editor.org/rfc/rfc4303.html)
- [RFC 4106 — AES-GCM for ESP](https://www.rfc-editor.org/rfc/rfc4106.html)
- [RFC 5282 — AEAD algorithms for IKEv2](https://www.rfc-editor.org/rfc/rfc5282.html)
- [RFC 7296 — IKEv2](https://www.rfc-editor.org/rfc/rfc7296.html)
- [RFC 7748 — X25519 and X448](https://www.rfc-editor.org/rfc/rfc7748.html)
- [RFC 8031 — Curve25519 and Curve448 for IKEv2](https://www.rfc-editor.org/rfc/rfc8031.html)
- [RFC 8221 — ESP and AH algorithm requirements](https://www.rfc-editor.org/rfc/rfc8221.html)
- [RFC 8247 — IKEv2 algorithm requirements](https://www.rfc-editor.org/rfc/rfc8247.html)
- [RFC 9370 — IKEv2 key-exchange terminology](https://www.rfc-editor.org/rfc/rfc9370.html)
- [RFC 9827 — IKEv2 sequence-number transform terminology](https://www.rfc-editor.org/rfc/rfc9827.html)
- [IANA IKEv2 Parameters](https://www.iana.org/assignments/ikev2-parameters/ikev2-parameters.xhtml)

## License

[MIT](LICENSE)

```

</details>

---

## OPAQUE Gate

- **slug**: `crypto-lab-opaque-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-opaque-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-opaque-gate/
- **commit_sha**: `585a0b609e621115dc1688bfb920c54d9d19447c` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `2cca7249386fe0c0ebb3afb7e3c6a79158204add`
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | PRIVACY  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, mutations, verification

**Name (H1)**: OPAQUE  — _read from src/main.ts_

**Subtitle**: aPAKE · RFC 9807  — _read from src/main.ts_

**Description**: Runs the real OPRF → authenticated envelope (${ENVELOPE_FORMAT}) → 3-message 3DH handshake so you can step through a registration and login whose protocol messages never reveal the password to the server.  — _read from src/main.ts_

**Why it matters**: Breaches leak billions of reused credentials every year. OPAQUE keeps plaintext passwords and conventional password hashes out of the database, while forcing an attacker who steals both a record and its OPRF key to begin a per-user offline guessing attack.  — _read from src/main.ts_

**Card copy**: RFC 9807 OPAQUE aPAKE with live OPRF blind/evaluate/unblind flow, credential-envelope handling, 3DH mutual authentication, and server-breach simulation showing the password never reaches the server.

**Chips**: OPAQUE · OPRF · 3DH · HKDF

**Implements**: AES `src/kdf.ts:317`, AES-GCM `src/kdf.ts:317`, Diffie-Hellman `src/kdf.ts:268`, Hash-to-curve `src/oprf.ts:62`, HKDF `src/kdf.ts:123`, HMAC `src/kdf.ts:102`, OPRF `src/envelope.ts:112`, P-256 `src/ake.ts:35`, scrypt `src/kdf.ts:193`, SHA-256 `src/kdf.ts:97`

**Attacks shown**: Dictionary attack `src/main.ts:584`

**Comment-only (named in code comments, not executed)**: OPAQUE `src/ake.ts:2`

**References**: CPace, EC point arithmetic, OPAQUE, Pairing, RSA, SHA-512, SRP, WebAuthn, X25519, X3DH, bcrypt, ristretto255

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `EUROCRYPT 2018` — first seen README.md:53 (1×)
- `RFC 5869` — first seen src/kdf.ts:121 (4×)
- `RFC 9474` — first seen src/main.ts:2026 (1×)
- `RFC 9497` — first seen README.md:83 (9×)
- `RFC 9807` — first seen README.md:5 (51×)
- `rfc9807` — first seen README.md:53 (2×)

**README — What Can Go Wrong**:

```text
- **Validated, but not audited.** Every named intermediate and output matches the CFRG `vectors.json` for P256-SHA256 byte-for-byte (`tests/test-vectors.test.ts` — 16 checks against a Real vector plus 1 against a Fake-login vector), and the spec-derived protocol properties pass (`tests/verify.test.ts` — 12 checks). These run under `npm test` (vitest) and are enforced in CI on every push, so a regression in any derivation fails the build. That's strong evidence each derivation matches RFC 9807, but it isn't a substitute for the testing, fuzzing, constant-time review, and side-channel analysis a production deployment needs. Use a vetted PAKE library in real systems.
- **Offline attack surface with OPRF key compromise.** If an attacker gets the server's OPRF key and credential record for a user, they can try offline password guesses. Each guess costs one OPRF evaluation plus one `stretch()` (scrypt N=2^15 here; Exhibit 4 times real guesses in your browser instead of quoting a production rate). OPAQUE's advantage is resistance to work done before compromise, not immunity afterward: the unpredictable key prevents reusable advance tables, while the password's entropy and KSF cost govern post-compromise guessing.
- **Registration requires TLS.** OPAQUE doesn't bootstrap trust from nothing. First registration assumes the client can trust the server (via TLS). Subsequent logins are password-only. By design: RFC 9807 §3.2 states registration is the only stage requiring a server-authenticated channel with confidentiality and integrity. Real deployments may layer additional factors on top.
- **No backend in this demo.** All crypto runs client-side; both "sides" are simulated in the same browser. Real deployments need a server to store registration records, perform OPRF evaluations (server's OPRF key never leaves), enforce rate limits to slow online attacks, and possibly use an HSM to protect OPRF keys.
- **Only the P256-SHA256 suite is validated.** The CFRG publishes vectors for ristretto255-SHA512 as well; supporting them requires generalizing this codebase across OPRF groups. The framework in `tests/test-vectors.test.ts` is ready for them.
```

**Claims tested** (e2e/claims.spec.ts, 4 test(s)):

- `the internal-mode envelope is described as authentication, not encryption` — e2e/claims.spec.ts:4
    - :8 `toContainText` expected `'authenticated envelope'` _(literal)_
    - :9 `toContainText` expected `'nonce + HMAC authentication tag (no ciphertext)'` _(literal)_
    - :12 `toContainText` expected `'encrypted-envelope'` _(literal)_
    - :13 `toContainText` expected `'encrypted envelope'` _(literal)_
    - :14 `toContainText` expected `'decrypt the envelope'` _(literal)_
- `breach and deployment claims preserve the demonstrated limitations` — e2e/claims.spec.ts:17
    - :21 `toContainText` expected `'per-user offline guessing attack'` _(literal)_
    - :22 `toContainText` expected `'neither is evidence of an OPAQUE deployment'` _(literal)_
    - :23 `toContainText` expected `'stolen database useless'` _(literal)_
    - :24 `toContainText` expected `'whole defence'` _(literal)_
    - :25 `toContainText` expected `'strong one is out of reach'` _(literal)_
    - :26 `toContainText` expected `'breach reveals NO patron passwords'` _(literal)_
    - :33 `toBeVisible` expected `{ timeout: 60000 }` _(expression)_
    - :37 `toHaveCount` expected `0, { timeout: 60000 }` _(expression)_
    - :39 `toBeVisible` expected `{ timeout: 60000 }` _(expression)_
- `the forward-secrecy panel computes the attack in both directions` — e2e/claims.spec.ts:55
    - :62 `toBeVisible` expected `{ timeout: 120000 }` _(expression)_
    - :65 `toHaveCount` expected `5` _(literal)_
    - :68 `toContainText` expected `'Leaked session key A vs. session B traffic'` _(literal)_
    - :69 `toContainText` expected `'GCM tag rejected'` _(literal)_
    - :70 `toHaveAttribute` expected `'data-fs-measured', 'attacker-blocked'` _(expression)_
    - :72 `toContainText` expected `'one guess at dh1'` _(literal)_
    - :73 `toContainText` expected `'did NOT decrypt'` _(literal)_
    - :74 `toHaveAttribute` expected `'data-fs-measured', 'attacker-blocked'` _(expression)_
    - :78 `toContainText` expected `'dh2 matches the real dh2'` _(literal)_
    - :79 `toContainText` expected `'dh3 matches the real dh3'` _(literal)_
    - :80 `toHaveAttribute` expected `'data-fs-measured', 'attacker-won'` _(expression)_
    - :84 `toContainText` expected `'static-only scheme'` _(literal)_
    - :85 `toContainText` expected `'long-term shared secret recomputed exactly'` _(literal)_
    - :86 `toContainText` expected `'session A traffic DECRYPTED'` _(literal)_
    - :87 `toContainText` expected `'session B traffic DECRYPTED'` _(literal)_
    - :88 `toHaveAttribute` expected `'data-fs-measured', 'attacker-won'` _(expression)_
    - :90 `toHaveAttribute` expected `'data-fs-verdict', 'held'` _(expression)_
    - :91 `toContainText` expected `'forward secrecy HELD'` _(literal)_
    - :92 `toContainText` expected `'opened both sessions'` _(literal)_
- `the forward-secrecy panel does not assert its conclusions in prose` — e2e/claims.spec.ts:99
    - :104 `toContainText` expected `'Past and future logins are safe'` _(literal)_
    - :105 `toContainText` expected `'stealing the long-term keys once would regenerate'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-opaque-gate

## What It Is

A browser-based educational demo of **OPAQUE** (RFC 9807, July 2025) — an Augmented Password-Authenticated Key Exchange (aPAKE) whose protocol messages do not reveal the password to the server. This demo simulates both sides in one browser.

It opens with a one-screen **map of the whole protocol** (`password → OPRF output → randomized_password → envelope → keys → 3DH → session`, each stage clickable to jump to the exhibit that runs it) so a newcomer meets the three stacked primitives in dependency order before diving into any one of them.

It is a practically relevant password-authentication design for reducing the value of password databases after compromise:

- **Registration**: Client derives credentials from the password-assisted OPRF and authenticates them with an HMAC. In internal mode, the server stores an envelope containing only a nonce and HMAC tag, plus the OPRF evaluation key and client's public key. Zero password bytes and no envelope ciphertext.

- **Login**: Client blinds the password with a random factor. Server evaluates it with a secret key (only known to the server). Client unblinds the result, re-derives its credentials, and authenticates the envelope's HMAC tag. Server never sees the unblinded value or the password.

- **Mutual Authentication & Forward Secrecy**: Three Diffie-Hellman operations provide mutual proof that both client and server hold the right long-term keys. One of the three mixes a fresh ephemeral from each side, which is what gives *forward secrecy*: because those ephemeral private keys are discarded when the handshake ends, later compromise of the long-term keys (or of the password, or of the server record) does not let an attacker recompute the session keys of past logins it recorded off the wire.

**Key property**: If the server database is breached:
- Attacker has an authenticated envelope (nonce + HMAC tag, no ciphertext) + OPRF key
- Offline dictionary attack _is_ possible, but each guess costs one OPRF evaluation plus one run of the key-stretching function. Exhibit 4 measures that rate in your own browser rather than quoting a figure; this build uses scrypt N=2^15, r=8, which is memory-hard in a way bcrypt is not, so the two are not interchangeable cost units.
- No plaintext password or conventional password hash is exposed; a secret OPRF
  key makes a precomputed table unavailable before compromise and scopes later
  guesses to that credential.
- OPAQUE resists the pre-computation attack defined by RFC 9807, but it does not
  make the stolen record useless: after the record and OPRF key leak, an attacker
  can make a fresh, per-user offline dictionary attack.

## When to Use It

- Replacing bcrypt+TLS password authentication in applications where database breaches are a concern
- Patron portal authentication in library systems (ILS, self-checkout, staff login)
- Understanding why current password hashing (even modern schemes) still exposes credentials to offline attacks
- Systems that should keep plaintext passwords and reusable password hashes out
  of the server while forcing a database attacker to begin per-user guessing
  after compromise; OPAQUE does not eliminate weak-password recovery
- Do NOT deploy this in production — it is a teaching demo with both client and server simulated in one browser; use a vetted PAKE library in real systems.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-opaque-gate](https://systemslibrarian.github.io/crypto-lab-opaque-gate/)**

The demo simulates both client and server in one browser. It opens with a clickable **map of the whole protocol**, then five interactive exhibits: why plaintext and salted-hash password auth is broken (grounded in your own registered envelope), a live obliviousness demo where re-running the OPRF with a fresh blinding factor changes the wire value but not the recovered secret, a *stepped* KE1 → KE2 → KE3 login handshake you walk one message at a time — with cards that cross the CLIENT ↔ SERVER gap, tappable definitions on the jargon in each byte-grid label, a wrong-password path where credential-response or envelope validation fails, and — on success — a **drawn 3DH diagram** (four keypairs, three labeled pairings feeding one session key) plus a *poke-the-forward-secrecy* button, a server-breach simulation that attacks your real envelope and measures the offline-guess cost live from the browser's actual scrypt, and a tour of the publication and adjacent systems.

## What Can Go Wrong

- **Validated, but not audited.** Every named intermediate and output matches the CFRG `vectors.json` for P256-SHA256 byte-for-byte (`tests/test-vectors.test.ts` — 16 checks against a Real vector plus 1 against a Fake-login vector), and the spec-derived protocol properties pass (`tests/verify.test.ts` — 12 checks). These run under `npm test` (vitest) and are enforced in CI on every push, so a regression in any derivation fails the build. That's strong evidence each derivation matches RFC 9807, but it isn't a substitute for the testing, fuzzing, constant-time review, and side-channel analysis a production deployment needs. Use a vetted PAKE library in real systems.
- **Offline attack surface with OPRF key compromise.** If an attacker gets the server's OPRF key and credential record for a user, they can try offline password guesses. Each guess costs one OPRF evaluation plus one `stretch()` (scrypt N=2^15 here; Exhibit 4 times real guesses in your browser instead of quoting a production rate). OPAQUE's advantage is resistance to work done before compromise, not immunity afterward: the unpredictable key prevents reusable advance tables, while the password's entropy and KSF cost govern post-compromise guessing.
- **Registration requires TLS.** OPAQUE doesn't bootstrap trust from nothing. First registration assumes the client can trust the server (via TLS). Subsequent logins are password-only. By design: RFC 9807 §3.2 states registration is the only stage requiring a server-authenticated channel with confidentiality and integrity. Real deployments may layer additional factors on top.
- **No backend in this demo.** All crypto runs client-side; both "sides" are simulated in the same browser. Real deployments need a server to store registration records, perform OPRF evaluations (server's OPRF key never leaves), enforce rate limits to slow online attacks, and possibly use an HSM to protect OPRF keys.
- **Only the P256-SHA256 suite is validated.** The CFRG publishes vectors for ristretto255-SHA512 as well; supporting them requires generalizing this codebase across OPRF groups. The framework in `tests/test-vectors.test.ts` is ready for them.

## Publication and Adjacent Systems

- **[RFC 9807](https://www.rfc-editor.org/rfc/rfc9807.html)** was published by the IRTF Crypto Forum Research Group in July 2025 as an Informational RFC, not an Internet Standards Track specification. Authors: Daniel Bourdrez, Hugo Krawczyk (AWS), Kevin Lewi (Meta), and Christopher Wood (Cloudflare). The underlying OPAQUE construction is due to Jarecki, Krawczyk and Xu (EUROCRYPT 2018).
- **[WhatsApp](https://engineering.fb.com/2021/09/10/security/whatsapp-e2ee-backups/)** (2021+): End-to-End Encrypted Backups gate the backup key behind a user password and an HSM-backed Backup Key Vault. Meta's public engineering write-up describes the design without naming OPAQUE, so treat this as adjacent rather than a confirmed deployment.
- **[Cloudflare](https://blog.cloudflare.com/opaque-oblivious-passwords/)**: Published OPAQUE research and a public proof-of-concept demo. It is not evidence of a shipped production login path.
- **[Apple Private Cloud Compute](https://security.apple.com/documentation/private-cloud-compute/nontargetability)**: A neighbour rather than an example — PCC authorizes requests with single-use RSA Blind Signatures, not an OPRF.
- **[1Password](https://1password.com/files/1Password-White-Paper.pdf)**: An
  adjacent PAKE deployment, not an OPAQUE deployment. Its published security
  design uses SRP for password-and-Secret-Key account authentication, and it
  [documents CPace](https://1password.com/blog/unlock-sso-deep-dive) for an SSO
  device-enrollment flow.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-opaque-gate
cd crypto-lab-opaque-gate
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-webauthn](https://systemslibrarian.github.io/crypto-lab-webauthn/) — FIDO2 passkeys, the passwordless alternative to password-based aPAKE.
- [crypto-lab-x3dh-wire](https://systemslibrarian.github.io/crypto-lab-x3dh-wire/) — X25519 asynchronous key agreement from the Signal protocol.
- [crypto-lab-psi-gate](https://systemslibrarian.github.io/crypto-lab-psi-gate/) — also built on an OPRF (DH-PSI) for private contact discovery.
- [crypto-lab-noise-pipe](https://systemslibrarian.github.io/crypto-lab-noise-pipe/) — X25519 handshake patterns and key exchange.

## Stack

- **Vite** + TypeScript (strict mode)
- **[@noble/curves](https://github.com/paulmillr/noble-curves)** for the
  P-256 ECC and the RFC 9497 OPRF
- **[@noble/hashes](https://github.com/paulmillr/noble-hashes)** for HKDF,
  HMAC, and scrypt
- **WebCrypto** for randomness (`crypto.getRandomValues`)
- **Vanilla CSS**
- Deployable to **GitHub Pages** (no backend)
- Mobile-first, responsive layout
- Automated WCAG 2.1 A/AA checks across exercised states (not a claim of full
  conformance or a substitute for manual assistive-technology testing)

## How OPAQUE Works

### Component 1: OPRF (Oblivious Pseudorandom Function)

The server has a secret key **k**. The client has a password **pwd**. An OPRF computes F(k, pwd) such that:

1. **Client blinds**: Generate random factor _r_, send blinded(pwd) to server
2. **Server evaluates**: Compute evaluated = F(k, blinded), send back
3. **Client unblinds**: Compute rwd = F(k, pwd) without ever learning k or sending pwd

The server sees only _blinded_ values. The client computes the raw OPRF output, then derives RFC 9807's `randomized_password` from it and the key-stretching output.

**Implementation**: real RFC 9497 OPRF on NIST P-256 with hash-to-curve
(SSWU map), via `@noble/curves`. The blind, evaluate, and unblind steps
use scalar multiplication on the curve — not HKDF stand-ins. The final
`oprf_output` is `Hash(input || N || "Finalize")` where `N = r⁻¹·evaluated`.

### Component 2: Credential Envelope (RFC 9807 §4, internal mode)

The client's long-term private key is _not_ encrypted — it's *derived*
from the OPRF output. The envelope is just a MAC tag that proves the
server hasn't tampered with the credentials.

`​``
oprf_output      = OPRF.Finalize(password, blind, evaluated)
randomized_pwd   = HKDF-Extract("", oprf_output || stretch(oprf_output))
envelope_nonce   = random(32)

seed             = HKDF-Expand(randomized_pwd, envelope_nonce || "PrivateKey", 32)
(client_sk, pk)  = DeriveAuthKeyPair(seed)
auth_key         = HKDF-Expand(randomized_pwd, envelope_nonce || "AuthKey", 32)
export_key       = HKDF-Expand(randomized_pwd, envelope_nonce || "ExportKey", 32)
masking_key      = HKDF-Expand(randomized_pwd, "MaskingKey", 32)

envelope         = envelope_nonce || HMAC(auth_key, envelope_nonce || cleartext_creds)
`​``

Same password → same `randomized_pwd` → same `client_sk` and same
`envelope` MAC. Wrong password (or tampered envelope) → MAC mismatch on
recovery. The `stretch` step (scrypt N=2^15 by default) is what makes
each guess in an offline attack expensive.

Server stores: `{credential_identifier, client_public_key, masking_key, envelope, oprf_key}`.
There is no plaintext password or conventional password hash in that record,
but the record plus OPRF key is still a verifier for a per-user offline attack
after compromise.

### Component 3: 3DH AKE (RFC 9807 §6, internal mode)

After OPRF unblinding and envelope recovery, both sides compute three
Diffie-Hellman shared secrets:

`​``
dh1 = DH(client_eph_sk, server_eph_pk)     [ephemeral × ephemeral — fresh-fresh]
dh2 = DH(client_eph_sk, server_static_pk)  [ephemeral × static    — fresh-server]
dh3 = DH(client_static_sk, server_eph_pk)  [static × ephemeral    — client-fresh]
`​``

These feed an HKDF-based key schedule that derives separate keys for
each direction:

`​``
prk              = HKDF-Extract("", dh1 || dh2 || dh3)
handshake_secret = Derive-Secret(prk, "HandshakeSecret", H(preamble))
session_key      = Derive-Secret(prk, "SessionKey",      H(preamble))
km2              = Expand-Label(handshake_secret, "ServerMAC", "", 32)
km3              = Expand-Label(handshake_secret, "ClientMAC", "", 32)

server_mac       = HMAC(km2, H(preamble))
client_mac       = HMAC(km3, H(preamble || server_mac))
`​``

- **dh1** provides "fresh × fresh" forward secrecy.
- **dh2 + dh3** mix in long-term keys, giving mutual authentication.
- The preamble commits to context, identities, KE1, the credential
  response, and the server's keyshare — any byte modified by an attacker
  changes `H(preamble)` and breaks both MACs.

## Library Patron Context

Current library systems send patron passwords to ILS servers (or store hashes):

`​``
Patron enters password → TLS → ILS server hashes and compares → database
`​``

Risk: ILS database breach → patron passwords (or hashes) leaked → credential stuffing, reuse attacks

OPAQUE deployment would mean:

`​``
Patron enters password (never leaves device) →
  Blind with OPRF →
  Server evaluates (returns the masked credential response) →
  Patron unmasks it, verifies the envelope tag, and re-derives credentials locally →
  3DH session established

Breach: Authenticated envelope (nonce + HMAC tag) + OPRF key
Auth failure: Attacker cannot forge login without correct password
`​``

**Practical path**: SirsiDynix Symphony, Innovative Interfaces Polaris, and EBSCO Discovery Service could integrate OPAQUE. That would require vendor design, implementation and review; RFC 9807 is a published CFRG Informational specification, not a deployment certification.

## Exhibit Tour

The demo opens with a **Start Here** map of the whole protocol — `password → OPRF output → randomized_password → envelope → keys → 3DH → session` laid out top to bottom, with the three operations (OPRF, envelope, 3DH) boxed and clickable to jump straight to the exhibit that runs each one. It states the OPRF's purpose up front, before the mechanics, so the primitives are met in dependency order. Below it are five interactive exhibits:

1. **Why Current Password Auth Is Broken**: Compare plaintext, salted-hash, and OPAQUE breach outcomes. Once you register in Exhibit 3, the OPAQUE row shows *your own* stored envelope bytes — the exact record the server holds — rather than a canned string.

2. **The OPRF**: Leads with a plain statement of *what this stage is for*, then a one-picture "locked box" primer plus a live obliviousness demo. Press **Run OPRF**, then **Run again (fresh r)**, and watch side-by-side runs: the blinding factor `r` and the on-the-wire **Blind** change every time (changed bytes highlighted), while the recovered raw OPRF output stays byte-for-byte identical (also highlighted) — so the server gets fresh noise it cannot directly correlate, yet the client recovers the same output. Expand-on-demand definitions distinguish that raw output from RFC 9807's derived `randomized_password`.

3. **Registration and the Login Handshake**: Registration shows the client handing the server only a public key, masking key, and envelope (no password, no conventional password hash). Login is **stepped**: walk KE1 → KE2 → KE3 one message at a time as each card animates *across* the gap from the sending column to the receiving one, listing what it carries *and what it never carries*. Jargon in the byte-grid labels (`masked_response`, `evaluated_message`, `keyshare`, `preamble`, …) is **tappable** — click a term for an inline definition at the point of confusion. A **wrong-password** checkbox lets you watch credential-response validation or envelope authentication abort the handshake at KE3 with the specific broken step named. On a successful login the exhibit **draws the 3DH**: the client and server static + ephemeral keypairs as four labeled dots, the three DH pairings as connecting lines (each labeled with what it buys — `dh1` = forward secrecy, `dh2`/`dh3` = mutual auth) feeding one session-key box, with the real shared-secret bytes shown. A **"Leak the session key and run the attack"** button then turns the forward-secrecy claim into an experiment rather than a paragraph: it runs a *second* complete login, seals traffic under each session key with AES-256-GCM, hands a simulated attacker the leaked session key **and** both long-term secret keys **and** the recorded transcript, and reports which tags actually verified. The attacker rebuilds `dh2` and `dh3` byte-for-byte and still cannot open the second session, because `dh1` needed two ephemeral private keys that no longer exist. The same key schedule is then re-run over a static-only ikm (`DH(client_static, server_static)`, no ephemeral term) and the same attacker decrypts both sessions — the negative case, measured rather than described.

4. **Server Breach Simulation**: Actually runs four attacks against the envelope you registered in Exhibit 3 and prints what happened, not a canned verdict. Attack 1 calls `recover()` with a random `randomized_password` and shows the thrown authentication error. Attack 2 is a real offline dictionary attack: several wrong candidates plus the true password, each taken all the way through OPRF evaluation, `randomized_password` derivation and `recover()`, with the wall-clock per-guess rate measured from those guesses. Attack 3 evaluates the same password under two different per-user OPRF keys and compares the outputs. Attack 4 forges a KE2 from the stolen record with an attacker-generated server keypair and hands it to the real `clientLoginStep3`. Each verdict is derived from the outcome, so a broken build would report a successful attack.

5. **Published and Adjacent Systems**: RFC 9807, WhatsApp, Cloudflare, Apple, and 1Password are labeled according to what their public material actually establishes. The exhibit then applies OPAQUE's security properties and residual offline-guessing risk to library patron privacy.

## No Math.random()

All randomness uses `crypto.getRandomValues()`. No `Math.random()` anywhere in the codebase.

`​``bash
grep -r "Math.random" src/
# Output: (empty)
`​``

## Build & Run

`​``bash
npm install
npm run build        # TypeScript strict, zero errors
npm run dev          # Local development server
npm test             # RFC 9807 KATs + protocol properties (vitest)
npm run test:a11y    # axe-core WCAG A/AA gate (Playwright)
`​``

The built output is in `dist/` — ready to deploy to GitHub Pages.

## Code Architecture

`​``
src/
  oprf.ts          — RFC 9497 OPRF wrapper (@noble/curves) + demo wrappers
  kdf.ts           — HKDF, Expand-Label, Derive-Secret, DeriveKeyPair,
                     stretch (scrypt + identity), dh()
  envelope.ts      — RFC 9807 §4 Store / Recover, register()
  ake.ts           — RFC 9807 §6 KE1 / KE2 / KE3, masked credential
                     response, full key schedule
  main.ts          — UI: five interactive exhibits
  style.css        — Dark theme, responsive, accessible

tests/                        (run by `npm test`, never shipped in the bundle)
  verify.test.ts       — protocol-property tests (round-trip, tampering, FS)
  test-vectors.test.ts — RFC 9807 §C P256-SHA256 vector validation
                         (Real + Fake-login)
`​``

## Security Considerations

- **Password strength**: OPAQUE does not remove password guessing. After the
  credential record and OPRF key are compromised, weak passwords can be
  recovered with a per-user offline attack; unlike an ordinary public salt,
  the secret OPRF key prevents an attacker from preparing that mapping in
  advance.
- **OPRF key protection**: Server OPRF key (k) must be protected. If leaked, offline attacks become practical. Use HSM or key management service in production.
- **TLS**: All communication should still be over TLS (OPAQUE is not a replacement for transport security).
- **Rate limiting**: Server-side limits slow online guesses and OPRF-oracle
  abuse. They cannot throttle an attacker making offline guesses from a stolen
  credential record and OPRF key.
- **Session keys and erasure**: Each login derives a new session key. Forward
  secrecy depends on erasing the ephemeral private keys; compromise of one
  session key does not by itself expose a different session.

## Automated WCAG 2.1 A/AA Checks

- Keyboard navigation (all buttons, inputs, tabs focusable)
- Programmatic labels on inputs and byte-grid regions
- `role="alert"` on errors
- Dark-theme contrast checks across the driven application states
- Reduced-motion and 380px reflow checks
- Focus outlines on all interactive elements

These automated gates cover the states they drive; they are not a full WCAG
conformance audit or manual assistive-technology evaluation.

## Repository Description (GitHub)

Browser-based OPAQUE aPAKE demo (RFC 9807, July 2025). Real RFC 9497
OPRF on P-256 via `@noble/curves`. RFC 9807-compliant envelope (HMAC
tag + derived static key, no AES), full 3DH key schedule with separate
MAC keys per direction. Validated byte-for-byte against the CFRG
P256-SHA256 test vectors (Real and Fake-login). Protocol messages do not reveal
the password to the server; this teaching app simulates both sides in one browser.

## Topics

`cryptography` `pake` `opaque` `password-authentication` `oprf` `authenticated-key-exchange` `3dh` `forward-secrecy` `browser-demo` `educational` `typescript` `vite` `rfc9807` `library-auth` `patron-privacy`

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Curve448

- **slug**: `crypto-lab-curve448`
- **repo**: https://github.com/systemslibrarian/crypto-lab-curve448
- **live**: https://systemslibrarian.github.io/crypto-lab-curve448/
- **commit_sha**: `04ce0be4284fab40b28aad9cbab4a5dff7f479fa` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `6f6f35fd76d2f520a0b3c4608d960ac1a8b59ae2`
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | SIGNATURES  ·  **level**: intermediate  ·  **--accent**: #9d4edd
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Curve448 / Ed448  — _read from src/main.ts_

**Subtitle**: X448 ECDH · Ed448 · RFC 7748 / 8032  — _read from src/main.ts_

**Description**: Run a live X448 Diffie-Hellman handshake and Ed448 sign/verify, then compare key sizes, signatures, and timings head-to-head against Curve25519/Ed25519 — with the RFC test vectors recomputed in your browser.  — _read from src/main.ts_

**Why it matters**: Curve448 is the 224-bit security tier — the higher-assurance ECC choice for long-lived keys and strict compliance. That margin isn't free: clamping, SHAKE256, and larger, slower keys are the price of trading Curve25519's speed for headroom.  — _read from src/main.ts_

**Card copy**: X448 key exchange and Ed448 signatures side by side with Curve25519 and Ed25519, covering the 224-bit security tier for long-lived keys.

**Chips**: X448 · Ed448 · RFC 7748 · RFC 8032

**Implements**: Ed25519 `src/main.ts:846`, Ed448 `src/main.ts:1035`, SHA-512 `src/hashdemo.ts:34`, SHAKE `src/hashdemo.ts:52`, X25519 `src/main.ts:928`, X448 `src/main.ts:1012`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Diffie-Hellman `src/main.ts:381`, EC point arithmetic `src/toycurve.ts:5`, EdDSA `src/hashdemo.ts:5`

**References**: Diffie-Hellman, Dilithium, EC point arithmetic, ECDH, EdDSA, ML-DSA, ML-KEM, P-256, SHA-3, Shor's algorithm, TLS 1.3, X3DH

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `RFC 7748` — first seen README.md:5 (17×)
- `RFC 8032` — first seen README.md:5 (9×)
- `RFC 8709` — first seen README.md:45 (3×)
- `RFC 9846` — first seen src/main.ts:338 (1×)

**README — What Can Go Wrong**:

```text
- Curve448 is still vulnerable to Shor's algorithm on a sufficiently large quantum computer, just like Curve25519. This is classical security, not post-quantum security.
- X448 scalar clamping is mandatory per RFC 7748. Skipping clamping can reintroduce subgroup and validation hazards.
- Ed448 uses SHAKE256, not SHA-512. Porting Ed25519 code naively to Ed448 often fails RFC vectors for this reason.
- Ed448 signatures are 114 bytes; protocols hard-coded for 64-byte signatures will break.
- Ed448 context is domain separation: same message with different contexts yields different valid signatures.
```

**Claims tested** (e2e/claims.spec.ts, 21 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:28
    - :28 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:44
    - :44 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:51
    - :51 `toHaveCount` expected `1` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:53
    - :53 `toHaveLength` expected `3` _(literal)_
- `the Goldilocks prime shown is really 2^448 - 2^224 - 1` — e2e/claims.spec.ts:59
    - :65 `toBe` expected `truth` _(expression)_
    - :66 `toHaveLength` expected `135` _(literal)_
- `the log-scale work-factor bars agree with their own labels` — e2e/claims.spec.ts:69
    - :72 `toHaveCount` expected `2` _(literal)_
    - :95 `toBe` expected `weak.decades.toFixed(1)` _(expression)_
    - :96 `toBe` expected `strong.decades.toFixed(1)` _(expression)_
    - :102 `expect` expected _no expected value_ _(none)_
    - :103 `expect` expected _no expected value_ _(none)_
    - :110 `expect` expected _no expected value_ _(none)_
    - :112 `toBe` expected `strong.bits - weak.bits` _(expression)_
    - :113 `toBe` expected `gapMantissa` _(expression)_
- `the ab.G payoff stays gated until the public points cross the wire` — e2e/claims.spec.ts:118
    - :121 `toBeHidden` expected _no expected value_ _(none)_
    - :122 `toBeHidden` expected _no expected value_ _(none)_
    - :123 `toContainText` expected `'Press'` _(literal)_
    - :127 `toBeVisible` expected _no expected value_ _(none)_
    - :128 `toBeVisible` expected _no expected value_ _(none)_
    - :129 `toContainText` expected `'A crosses to Bob'` _(literal)_
    - :130 `toContainText` expected `'B crosses to Alice'` _(literal)_
- `the handshake verdict is backed by the secret the page computed` — e2e/claims.spec.ts:133
    - :138 `toHaveClass` expected `/\bok\b/` _(regex)_
    - :140 `expect` expected _no expected value_ _(none)_
    - :148 `toBe` expected `0` _(literal)_
    - :149 `toBe` expected `claimedBytes` _(expression)_
    - :150 `toHaveClass` expected `/\bok\b/` _(regex)_
    - :155 `toBe` expected `abbreviated` _(expression)_
    - :156 `toBe` expected `abbreviated` _(expression)_
    - :157 `toHaveClass` expected `/abg-match/` _(regex)_
    - :158 `toHaveClass` expected `/abg-match/` _(regex)_
- `the wire packet and the toy-curve callout show the same real public key` — e2e/claims.spec.ts:161
    - :170 `toMatch` expected `/^[0-9a-f]+…[0-9a-f]+$/` _(regex)_
    - :171 `toBe` expected `onWire` _(expression)_
    - :176 `toBe` expected `onWire` _(expression)_
    - :177 `toBe` expected `onWire2` _(expression)_
- `the clamping bit-grid matches the scalar actually in use` — e2e/claims.spec.ts:180
    - :182 `toHaveText` expected `/^█+$/` _(regex)_
    - :183 `toBeHidden` expected _no expected value_ _(none)_
    - :186 `toBeVisible` expected _no expected value_ _(none)_
    - :189 `toMatch` expected `/^[0-9a-f]{112}$/` _(regex)_
    - :195 `toBe` expected `0` _(literal)_
    - :196 `toBe` expected `0b1000_0000` _(expression)_
    - :199 `toHaveCount` expected `2` _(literal)_
    - :200 `toHaveCount` expected `1` _(literal)_
    - :205 `toBe` expected `lowByte.toString(2).padStart(8, '0')` _(expression)_
    - :206 `toBe` expected `highByte.toString(2).padStart(8, '0')` _(expression)_
    - :210 `toEqual` expected `['0', '0']` _(expression)_
    - :211 `toEqual` expected `['1']` _(expression)_
    - :215 `toBeHidden` expected _no expected value_ _(none)_
    - :216 `toHaveText` expected `/^█+$/` _(regex)_
- `the toy curve has as many points as the copy claims, all distinct` — e2e/claims.spec.ts:219
    - :227 `toBe` expected `claimed` _(expression)_
    - :230 `toBe` expected `String(claimed - 1)` _(expression)_
    - :241 `toBe` expected `true` _(expression)_
    - :242 `toBe` expected `String(k)` _(expression)_
    - :245 `toBe` expected `claimed - 1` _(expression)_
- `sign and verify report the real message and signature sizes` — e2e/claims.spec.ts:250
    - :252 `toHaveText` expected `'(no signature yet)'` _(literal)_
    - :261 `toBe` expected `new TextEncoder().encode(message).length` _(expression)_
    - :262 `toBe` expected `114` _(literal)_
    - :266 `toMatch` expected `/^[0-9a-f]{20}…[0-9a-f]{20}$/` _(regex)_
    - :269 `toContainText` expected `'VALID'` _(literal)_
    - :270 `toHaveClass` expected `/\bok\b/` _(regex)_
- `verifying or tampering before signing fails with the reason why` — e2e/claims.spec.ts:273
    - :277 `toHaveText` expected `'Sign a message first.'` _(literal)_
    - :278 `toHaveClass` expected `/\bbad\b/` _(regex)_
- `a verdict is about the message on screen, not the one signed earlier` — e2e/claims.spec.ts:282
    - :288 `toContainText` expected `'VALID'` _(literal)_
    - :289 `toHaveClass` expected `/\bok\b/` _(regex)_
    - :297 `toContainText` expected `'INVALID signature'` _(literal)_
    - :298 `toHaveClass` expected `/\bbad\b/` _(regex)_
    - :304 `toContainText` expected `'VALID'` _(literal)_
    - :305 `toHaveClass` expected `/\bok\b/` _(regex)_
    - :310 `toContainText` expected `'INVALID signature'` _(literal)_
    - :315 `toContainText` expected `'VALID'` _(literal)_
- `a tampered message fails, says why, and sticks until reset` — e2e/claims.spec.ts:318
    - :323 `toContainText` expected `'VALID'` _(literal)_
    - :327 `toHaveClass` expected `/\bbad\b/` _(regex)_
    - :329 `expect` expected _no expected value_ _(none)_
    - :331 `expect` expected _no expected value_ _(none)_
    - :335 `toBe` expected `expected` _(expression)_
    - :336 `toBe` expected `original` _(expression)_
    - :340 `toContainText` expected `'INVALID signature'` _(literal)_
    - :341 `toHaveClass` expected `/\bbad\b/` _(regex)_
    - :346 `toContainText` expected `'VALID'` _(literal)_
    - :347 `toHaveClass` expected `/\bok\b/` _(regex)_
- `a tampered signature fails, says why, and sticks until reset` — e2e/claims.spec.ts:350
    - :358 `toHaveClass` expected `/\bbad\b/` _(regex)_
    - :360 `expect` expected _no expected value_ _(none)_
    - :361 `expect` expected _no expected value_ _(none)_
    - :365 `toBe` expected `before` _(expression)_
    - :366 `toBe` expected `before.slice(2)` _(expression)_
    - :367 `toBe` expected _no expected value_ _(none)_
    - :371 `toBe` expected `original` _(expression)_
    - :374 `toContainText` expected `'INVALID signature'` _(literal)_
    - :378 `toContainText` expected `'Reset'` _(literal)_
    - :379 `toHaveClass` expected `/\bok\b/` _(regex)_
    - :380 `toHaveText` expected `'(no signature yet)'` _(literal)_
    - :381 `toBe` expected `original` _(expression)_
    - :385 `toHaveText` expected `'Sign a message first.'` _(literal)_
- `the seed expansion panel is internally consistent and hashes what it shows` — e2e/claims.spec.ts:388
    - :396 `toHaveCount` expected `2` _(literal)_
    - :412 `toBe` expected `'SHA-512'` _(literal)_
    - :413 `toBe` expected `'SHAKE256'` _(literal)_
    - :416 `toBe` expected `sha.digest` _(expression)_
    - :417 `toBe` expected `shake.digest` _(expression)_
    - :419 `toBe` expected `2 * sha.seedLen` _(expression)_
    - :420 `toBe` expected `2 * shake.seedLen` _(expression)_
    - :423 `toBe` expected `64` _(literal)_
    - :424 `expect` expected _no expected value_ _(none)_
    - :429 `toBe` expected `shake.seedLen` _(expression)_
    - :430 `toBe` expected `shortHexOf(seed, 8)` _(expression)_
    - :431 `toBe` expected `shortHexOf(seed.slice(0, sha.seedLen * 2), 8)` _(expression)_
    - :432 `toBe` expected `shake.seedHex` _(expression)_
- `domain separation rejects exactly the off-diagonal, for contexts you choose` — e2e/claims.spec.ts:435
    - :443 `toHaveText` expected _no expected value_ _(none)_
    - :449 `toHaveText` expected _no expected value_ _(none)_
    - :459 `toEqual` expected `['signature', 'under "alpha-context"', 'under "beta-context"']` _(expression)_
    - :462 `toHaveCount` expected `2` _(literal)_
    - :468 `toEqual` expected `['sig A', '✓ verifies', '✗ rejected']` _(expression)_
    - :469 `toEqual` expected `['sig B', '✗ rejected', '✓ verifies']` _(expression)_
    - :473 `toHaveLength` expected `2` _(literal)_
    - :474 `toBe` expected `sigs[1]` _(expression)_
    - :476 `toEqual` expected `['context = "alpha-context"', 'context = "beta-context"']` _(expression)_
- `the comparison table agrees with the live exhibits it summarizes` — e2e/claims.spec.ts:481
    - :484 `toBeVisible` expected _no expected value_ _(none)_
    - :488 `toHaveCount` expected `11` _(literal)_
    - :491 `toHaveLength` expected `3` _(literal)_
    - :492 `expect` expected _no expected value_ _(none)_
    - :502 `toBe` expected `scalarHex.length / 2` _(expression)_
    - :514 `toBe` expected `fullSecret.length / 2` _(expression)_
    - :520 `toBe` expected `seedHex.length / 2` _(expression)_
    - :529 `toBe` expected `sigBytes` _(expression)_
    - :537 `toBe` expected `claimed.toFixed(1)` _(expression)_
    - :540 `toHaveCount` expected `2` _(literal)_
    - :545 `expect` expected _no expected value_ _(none)_
    - :551 `toMatch` expected `new RegExp('${op}: [\\d.]+ ms')` _(expression)_
    - :552 `toMatch` expected `new RegExp('${op}: [\\d.]+ ms')` _(expression)_
- `both RFC vectors pass because computed equals expected` — e2e/claims.spec.ts:558
    - :561 `toBeVisible` expected _no expected value_ _(none)_
    - :564 `toHaveCount` expected `2` _(literal)_
    - :569 `expect` expected _no expected value_ _(none)_
    - :570 `toHaveCount` expected `1` _(literal)_
    - :571 `toHaveCount` expected `0` _(literal)_
    - :572 `toMatch` expected `/RFC \d+ §[\d.]+/` _(regex)_
    - :575 `toHaveLength` expected `2` _(literal)_
    - :578 `toBe` expected `expected` _(expression)_
    - :579 `toMatch` expected `/^[0-9a-f]+…[0-9a-f]+$/` _(regex)_
- `every advanced exhibit stays collapsed until asked for` — e2e/claims.spec.ts:585
    - :592 `toBeHidden` expected _no expected value_ _(none)_
    - :593 `toHaveAttribute` expected `'aria-expanded', 'false'` _(expression)_
    - :595 `toBeVisible` expected _no expected value_ _(none)_
    - :596 `toHaveAttribute` expected `'aria-expanded', 'true'` _(expression)_
    - :598 `toBeHidden` expected _no expected value_ _(none)_
    - :599 `toHaveAttribute` expected `'aria-expanded', 'false'` _(expression)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-curve448

## What It Is

Browser-based demo of Curve448 (X448 key exchange) and Ed448 (digital signatures) per RFC 7748 and RFC 8032. Curve448 provides 224-bit classical security, the paranoid tier for long-lived data, national security profiles, and decades-long archive protection. The app uses `@noble/curves` for audited arithmetic and implements protocol flows on top: X448 Diffie-Hellman handshake with matching shared secrets, Ed448 signatures with SHAKE256-based derivation, and side-by-side comparison against Curve25519/Ed25519. Validation includes RFC 7748 Section 5.2 and RFC 8032 Section 7.4 vectors.

Beyond showing *outcomes*, it teaches the *mechanisms*: an interactive toy-curve visualizer plots k·G on a small illustrative curve so "public = scalar · G" becomes a picture of hopping between points before you ever meet the 448-bit hex; on **Run Handshake** the public points visibly travel across the wire and the a·B = b·A = ab·G payoff is gated behind that crossing, so a first-timer plays with the inputs before seeing the answer; a side-by-side "you compute / they compute" derivation then makes the identity visible instead of asking you to take "the two blobs matched" on faith; a live bit-grid shows RFC 7748 clamping flipping the exact bits (two low bits → 0, top bit → 1); a log-scale security-margin visual replaces a misleading linear bar so the picture agrees with the honest 2^96 work-factor gap; a live "seed → hash → (scalar, nonce)" panel expands the current seed with both SHA-512 and SHAKE256 so you can see why an XOF is required for Ed448's larger field; and a guided domain-separation demo signs one message under two contexts and cross-checks them so the off-diagonal rejection is observable. Advanced exhibits (comparison table, RFC vectors, decision guide) are collapsed behind "Show me the numbers" / "Show the proof" toggles so the core DH story lands first. First-mention jargon (scalar, ECDLP, XOF, domain separation) carries plain-language glosses.

## When to Use It

- Understanding why the 224-bit security tier exists and where it is justified
- Teaching the hash distinction: Ed25519 uses SHA-512 while Ed448 uses SHAKE256
- Showing trade-offs: stronger security margins come with slower operations and larger signatures
- Evaluating long-term key material (identity keys, code-signing keys, root authority keys)
- Not for ephemeral sessions or short-lived tokens where Curve25519 already fits
- Do NOT use this as production code — it is a teaching demo built on `@noble/curves`, not a hardened protocol implementation.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-curve448](https://systemslibrarian.github.io/crypto-lab-curve448/)**

Six interactive exhibits:

1. **Why Curve448?** — the security-margin rationale and the Goldilocks prime, headed by a log-scale work-factor visual that shows the honest 2^96 gap (not a misleading ~1.75× linear bar).
2. **X448 Diffie-Hellman Live** — starts with an interactive toy-curve visualizer (drag the scalar and watch k·G hop between points on a small illustrative curve, with the real 448-bit public key shown alongside), then a "Diffie-Hellman in 10 seconds" primer, an animated wire step that sends the real public points across the channel on **Run Handshake**, and a "you compute / they compute" panel — gated behind the crossing — deriving a·B = b·A = ab·G; revealing the private scalars opens a live bit-grid that flips the exact RFC 7748 clamping bits. Motion respects `prefers-reduced-motion`.
3. **Ed448 Signatures** — sign / verify / tamper (tampering now sticks until you re-sign or Reset), a live "seed → hash → (scalar, nonce)" comparison of SHA-512 vs SHAKE256, and a guided domain-separation demo that signs one message under two contexts and cross-checks them.
4. **Curve25519 vs Curve448** — behind "Show me the numbers": a live side-by-side comparison with averaged in-browser benchmarks, with the trade-off rows (114-byte vs 64-byte signatures, slower timings) highlighted as "the price of the margin."
5. **Verified Against the RFCs** — behind "Show the proof": recomputes the RFC 7748 §5.2 and RFC 8032 §7.4 test vectors in your browser on every load.
6. **When to Use Which** — behind "Show the decision guide": decision tree and real deployments.

Light and dark themes are both fully supported.

## What Can Go Wrong

- Curve448 is still vulnerable to Shor's algorithm on a sufficiently large quantum computer, just like Curve25519. This is classical security, not post-quantum security.
- X448 scalar clamping is mandatory per RFC 7748. Skipping clamping can reintroduce subgroup and validation hazards.
- Ed448 uses SHAKE256, not SHA-512. Porting Ed25519 code naively to Ed448 often fails RFC vectors for this reason.
- Ed448 signatures are 114 bytes; protocols hard-coded for 64-byte signatures will break.
- Ed448 context is domain separation: same message with different contexts yields different valid signatures.

## Real-World Usage

- Curve448 was designed by Mike Hamburg at Rambus in 2014 and named Ed448-Goldilocks for the prime's balanced structure, then standardized in RFC 7748 (X448) and RFC 8032 (Ed448).
- TLS 1.3 includes X448 as an optional NamedGroup for high-security key exchange.
- SSH standardizes the `ssh-ed448` key type in RFC 8709 — implemented by PuTTY 0.75+ and WinSCP, though OpenSSH has not adopted it — and GnuPG supports Ed448 for long-lived identity keys.
- CNSA-style high-assurance classical cryptography profiles favor Curve448 when long-horizon confidentiality or stronger classical margins are required, though most broad interoperability still centers on Curve25519.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-curve448
cd crypto-lab-curve448
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-curve-lens](https://systemslibrarian.github.io/crypto-lab-curve-lens/) — Curve25519 and P-256 ECDH, the curves Curve448 is benchmarked against.
- [crypto-lab-ed25519-forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) — Ed25519/EdDSA, the SHA-512 sibling of the Ed448 signatures here.
- [crypto-lab-key-exchange](https://systemslibrarian.github.io/crypto-lab-key-exchange/) — Diffie-Hellman, ECDH, and X25519 key agreement fundamentals.
- [crypto-lab-ssh-handshake](https://systemslibrarian.github.io/crypto-lab-ssh-handshake/) — X25519 + Ed25519 in the SSH transport, an applied use of these curves.

## Development

`​``bash
npm install      # install dependencies
npm run dev      # start the Vite dev server
npm test         # run the Vitest suite (crypto vectors + DOM smoke tests)
npm run build    # type-check and produce the production bundle in dist/
`​``

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Key Exchange

- **slug**: `crypto-lab-key-exchange`
- **repo**: https://github.com/systemslibrarian/crypto-lab-key-exchange
- **live**: https://systemslibrarian.github.io/crypto-lab-key-exchange/
- **commit_sha**: `6ba971c2b3ed89f3a1eee9988cca7fcd67f65810` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE  ·  **level**: advanced  ·  **--accent**: #086a91
- **MISSING FIELDS**: verification

**Name (H1)**: Key Exchange  — _read from src/ui.ts_

**Subtitle**: DH · ECDH · X25519 · ML-KEM · Hybrid  — _read from src/ui.ts_

**Description**: Walk the five generations of agreeing on a shared secret over an open channel — run live DH and ECDH, break discrete log on toy parameters, and trace ML-KEM encapsulation and the hybrid X25519+ML-KEM combine.  — _read from src/ui.ts_

**Why it matters**: The post-quantum move isn't a bigger key — it's a different mechanism. Shor's algorithm breaks discrete-log key agreement in any group, so ML-KEM's lattice hardness, wrapped in a hybrid, is what protects data being harvested today for decryption later.  — _read from src/ui.ts_

**Card copy**: Walk from Diffie-Hellman to hybrid post-quantum exchange, then test a short-code pairing relay to see why commitment order and identity checks matter.

**Chips**: Diffie-Hellman · ECDH · X25519 · ML-KEM

**Implements**: AES `src/engine.ts:181`, AES-GCM `src/engine.ts:181`, Diffie-Hellman `src/engine.ts:55`, EC point arithmetic `src/engine.ts:404`, ECDH `src/engine.ts:422`, Ed25519 `src/engine.ts:24`, HKDF `src/engine.ts:164`, LWE `src/ui.ts:1921`, Merkle tree `src/merkle/aes.ts:11`, ML-KEM `src/engine.ts:476`, SHA-256 `src/pairing.ts:52`, Shor's algorithm `src/ui.ts:1552`, X25519 `src/engine.ts:24`

**Attacks shown**: Brute force `src/merkle/eve-core.ts:83`, Chosen-ciphertext attack `src/data.ts:330`, Discrete log `src/data.ts:29`, Factoring `src/data.ts:151`, Invalid curve attack `README.md:51`, Key recovery `src/data.ts:292`, Man-in-the-middle `src/engine.ts:99`

**Comment-only (named in code comments, not executed)**: Grover's algorithm `src/merkle/eve.worker.ts:35`, Index calculus `src/ui.ts:406`, NTT `src/engine.ts:11`, TLS 1.3 `src/engine.ts:533`

**References**: AES-CBC, AES-ECB, Double Ratchet, Grover's algorithm, Index calculus, Isogeny walk, Kyber, NTT, Noise protocol, P-256, PQXDH, Pairing, RSA, SIKE, TLS 1.3, X3DH

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `10.1007/3-540-39799-X_31` — first seen src/data.ts:259 (1×)
- `ASIACRYPT 2017` — first seen src/ui.ts:1644 (1×)
- `CRYPTO ’85` — first seen src/data.ts:258 (1×)
- `crypto2009` — first seen src/merkle/ui.ts:180 (1×)
- `crypto2011` — first seen src/merkle/ui.ts:181 (1×)
- `doi.org/10.1145/73007.73012` — first seen src/merkle/ui.ts:180 (1×)
- `eprint.iacr.org/2022/975` — first seen src/data.ts:294 (1×)
- `EUROCRYPT 2023` — first seen src/data.ts:293 (1×)
- `FIPS 197` — first seen README.md:113 (1×)
- `FIPS 203` — first seen README.md:5 (22×)
- `NIST SP 800-38A` — first seen README.md:113 (1×)
- `RFC 8446` — first seen src/data.ts:174 (1×)
- `RFC 9846` — first seen README.md:56 (1×)

**README — What Can Go Wrong**:

```text
- **Unauthenticated Diffie–Hellman** is wide open to a man-in-the-middle; key agreement must be authenticated by signatures, certificates, or a PAKE. The MitM section lets you mount the relay for real and then watch signed key shares defeat it.
- **A matching short code needs the whole pairing protocol.** In the numeric-comparison subpanel, Eve can force a match in a deliberately three-digit toy by selecting her nonce after seeing the other leg. A SHA-256 commitment to the public shares and nonce made before reveal rejects that late change. The fixed-nonce, non-cryptographic three-digit display is a teaching model, not Bluetooth or an estimate of its six-digit attack probability. [Bluetooth Core Specification v6.3 (5 May 2026), Security Manager §2.3.5.6.2](https://www.bluetooth.com/wp-content/uploads/Files/Specification/HTML/Core_v6.3/out/en/host/security-manager-specification.html) specifies the real P-256, fresh nonce, f4/g, commitment, six-digit confirmation, and abort sequence.
- **Weak or unvalidated group parameters** enable downgrade and precomputation attacks (e.g., Logjam against export-grade DH groups).
- **Reusing ephemeral keys** turns ephemeral DH into static DH and forfeits forward secrecy.
- **Skipping point/parameter validation** invites small-subgroup and invalid-curve attacks that can leak the private key.
- **Classical-only DH/ECDH** is vulnerable to harvest-now-decrypt-later once a large quantum computer exists — which is why hybrid X25519+ML-KEM exists.
```

**Claims tested** (e2e/claims.spec.ts, 16 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:13
    - :13 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:18
    - :18 `toBeVisible` expected _no expected value_ _(none)_
- `noble AES agrees with WebCrypto AES-CBC first blocks for random keys` — e2e/claims.spec.ts:21
    - :43 `toHaveLength` expected `8` _(literal)_
    - :44 `toBe` expected `comparison.webcrypto` _(expression)_
- `displayed work formulas equal independently recomputed values` — e2e/claims.spec.ts:47
    - :56 `toBe` expected `expectedAlice` _(expression)_
    - :57 `toBe` expected `expectedBob` _(expression)_
    - :58 `toBe` expected `expectedEve` _(expression)_
    - :59 `toBe` expected `expectedAlice` _(expression)_
    - :61 `toHaveText` expected `'3L'` _(literal)_
    - :62 `toHaveText` expected `'(|K| + 1) / 2'` _(literal)_
    - :63 `toHaveText` expected `'((L + 1) / 2) × ((|K| + 1) / 2)'` _(literal)_
- `salted table rejects shared-prefix reuse; BROKEN appears only in textbook mode` — e2e/claims.spec.ts:66
    - :68 `toBeChecked` expected _no expected value_ _(none)_
    - :69 `toContainText` expected `'table matches 0 puzzles'` _(literal)_
    - :70 `toContainText` expected `'BROKEN — one table'` _(literal)_
    - :73 `toBeVisible` expected _no expected value_ _(none)_
    - :75 `toContainText` expected `'BROKEN — one table'` _(literal)_
    - :77 `toContainText` expected `'solved all ${count.toLocaleString('en-US')} puzzles'` _(expression)_
    - :81 `toContainText` expected `'table matches 0 puzzles'` _(literal)_
    - :82 `toContainText` expected `'BROKEN — one table'` _(literal)_
- `Bob agreement is computed from both rendered secrets` — e2e/claims.spec.ts:85
    - :88 `toHaveClass` expected `/puzzle-verdict--safe/` _(regex)_
    - :91 `toMatch` expected `/^[0-9a-f]{32}$/` _(regex)_
    - :92 `toBe` expected `alice` _(expression)_
    - :93 `toBe` expected `1` _(literal)_
    - :94 `toContainText` expected `'AGREED'` _(literal)_
    - :98 `toBe` expected `alice` _(expression)_
    - :99 `toHaveText` expected `'NOT AGREED — the two 128-bit values differ'` _(literal)_
- `parameter changes retire claims while a no-op preserves them` — e2e/claims.spec.ts:102
    - :108 `toBeHidden` expected _no expected value_ _(none)_
    - :109 `toHaveText` expected `original ?? ''` _(expression)_
    - :112 `toBeVisible` expected _no expected value_ _(none)_
    - :113 `toHaveAttribute` expected `'data-verdict'` _(literal)_
    - :114 `toBeDisabled` expected _no expected value_ _(none)_
    - :115 `toContainText` expected `'Previous results retired'` _(literal)_
- `Eve counter matches its derived prediction and the payload is transcript-only` — e2e/claims.spec.ts:118
    - :138 `toBeVisible` expected `{ timeout: 120_000 }` _(expression)_
    - :139 `toContainText` expected `'RECOVERED BY THE EAVESDROPPER'` _(literal)_
    - :141 `expect` expected _no expected value_ _(none)_
    - :142 `expect` expected _no expected value_ _(none)_
    - :143 `toBe` expected `predicted` _(expression)_
    - :161 `toEqual` expected `['b', 'cap', 'transcript']` _(expression)_
    - :162 `toEqual` expected `['puzzles', 'targetIndex']` _(expression)_
    - :163 `toEqual` expected `['c1', 'c2', 'c3', 'prefix']` _(expression)_
    - :164 `toBe` expected `0` _(literal)_
    - :165 `toMatch` expected `/"(?:u|s|bobChoice|puzzlePosition)"\s*:/` _(regex)_
- `negative claim remains visible in the all-green recovery fixture` — e2e/claims.spec.ts:168
    - :171 `toHaveText` expected `'1'` _(literal)_
    - :172 `toContainText` expected `'table matches 0 puzzles'` _(literal)_
    - :173 `toHaveClass` expected `/puzzle-verdict--safe/` _(regex)_
    - :174 `toHaveClass` expected `/puzzle-verdict--safe/` _(regex)_
    - :176 `toContainText` expected `'RECOVERED BY THE EAVESDROPPER', { timeout: 120_000 }` _(expression)_
    - :177 `toHaveText` expected `'AGREED — AND RECOVERED BY THE EAVESDROPPER'` _(literal)_
    - :178 `toBeVisible` expected _no expected value_ _(none)_
    - :179 `toHaveText` expected `NEGATIVE_CLAIM` _(expression)_
- `Bob publishes a nonzero index and reports both follow-up AES decryptions` — e2e/claims.spec.ts:182
    - :187 `expect` expected _no expected value_ _(none)_
    - :188 `expect` expected _no expected value_ _(none)_
    - :189 `toHaveText` expected `'2'` _(literal)_
- `numeric puzzle counts stay synchronized with the range control` — e2e/claims.spec.ts:192
    - :195 `toHaveValue` expected `'333'` _(literal)_
    - :196 `toHaveText` expected `'333'` _(literal)_
    - :198 `toHaveText` expected `'999'` _(literal)_
- `displayed Eve tolerance follows independent search costs for each solved puzzle` — e2e/claims.spec.ts:201
    - :218 `expect` expected _no expected value_ _(none)_
    - :219 `toBeCloseTo` expected `6 * Math.sqrt(variance), 2` _(expression)_
- `selecting Bob again retires the previous Eve recovery` — e2e/claims.spec.ts:222
    - :226 `toContainText` expected `'RECOVERED BY THE EAVESDROPPER', { timeout: 120_000 }` _(expression)_
    - :228 `toHaveAttribute` expected `'data-verdict'` _(literal)_
    - :229 `toContainText` expected `'previous result was retired'` _(literal)_
    - :230 `toHaveText` expected `'—'` _(literal)_
    - :231 `toContainText` expected `'RECOVERED'` _(literal)_
- `late worker progress cannot overwrite a newer Bob selection` — e2e/claims.spec.ts:234
    - :256 `toHaveText` expected `'—'` _(literal)_
    - :257 `toBeEnabled` expected _no expected value_ _(none)_
    - :258 `toHaveText` expected `currentStatus!` _(expression)_
- `fallback ${action} stops suspended work and preserves the current verdict` — e2e/claims.spec.ts:262
    - :293 `toContainText` expected `'main-thread fallback'` _(literal)_
    - :299 `toBe` expected `1` _(literal)_
    - :300 `toHaveText` expected `verdict!` _(expression)_
    - :301 `toHaveText` expected `currentStatus!` _(expression)_
    - :302 `toBeDisabled` expected _no expected value_ _(none)_
    - :303 `toHaveText` expected `action === 'cancel' ? '0' : '—'` _(expression)_
- `real-scale exponent is recomputed from the displayed expected-half formula` — e2e/claims.spec.ts:307
    - :311 `toBe` expected `58` _(literal)_
    - :313 `toEqual` expected `[30, Math.floor(Math.log2(expected))]` _(expression)_

**Mutation records** (3 file(s)):

- `scripts/mutation-report.mjs` (2684 bytes)
- `scripts/mutation-report.test.mjs` (3566 bytes)
- `scripts/mutations.mjs` (4251 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-key-exchange

## What It Is

An interactive walk through five generations of key exchange: Diffie–Hellman (1976), ECDH (1985), X25519 (2006), ML-KEM (FIPS 203, 2024), and hybrid X25519+ML-KEM (2024). A prequel section runs Merkle puzzles (1978): key agreement from AES alone, with real work counters, and shows the protocol's quadratic limit. The prequel is not a sixth generation and the five-generation timeline remains unchanged. The point is that the generations are not five different problems — they are one problem ("agree on a shared secret over an open channel") solved in five different groups, with the last move stepping off the classical-group story entirely.

The Merkle section uses real single-block AES-128 from [`@noble/ciphers`](https://github.com/paulmillr/noble-ciphers). Its safe default is a clearly labelled lab modification: each puzzle has an independent public key prefix. The shared-zero-prefix form printed in Boneh–Shoup v0.6 §10.8 remains available only behind a **BROKEN** switch because one reusable `E(k, 0)` table solves every puzzle. Neither form is production cryptography.

Puzzle indices run from 1 through L, reserving zero for the check block. This
prevents identifying a shuffled puzzle just by comparing its index and check
ciphertexts. Bob reports first-match trials, the uniqueness audit, and both
follow-up AES decryptions separately. Eve's variance uses a sum of independent
puzzle-search costs. A cancelled, rebuilt, or replaced run cannot update the
current verdict, including when Worker is unavailable and work falls back to the
main thread.

The first three public-key generations rely on the hardness of the discrete-log problem in Z_p* or on an elliptic curve, all of which Shor's algorithm breaks in polynomial time on a fault-tolerant quantum computer. ML-KEM rests on Module-LWE over polynomial rings — a lattice problem Shor doesn't touch — and hybrid is the bridge: derive a session key from both halves so neither failing alone breaks the channel. The DH and ECDH primitives are implemented from scratch in TypeScript with deliberately tiny parameters so the math is visible; the discrete-log attack on Z_p* is real and runs in milliseconds. The ML-KEM step is **real ML-KEM-768 (FIPS 203)** from [`@noble/post-quantum`](https://github.com/paulmillr/noble-post-quantum) — production-grade parameters, full Module-LWE, NTT, and compression — and the hybrid combine mixes an actual X25519 secret with the ML-KEM secret through HKDF, matching the shape of the production X25519MLKEM768 combiner.

## Exhibits

1. **Merkle-puzzle prequel.** Build and shuffle independent AES puzzles, let Bob brute-force one, compare Alice's and Bob's 128-bit secrets byte for byte, then run Eve over the transcript alone. The three-row work meter places measured AES calls beside the derived `3L`, `(|K|+1)/2`, and `((L+1)/2)·((|K|+1)/2)` predictions.
2. **The one-table break.** The non-default textbook-form switch uses one shared reduced key space. A real `E(k, 0)` table solves every puzzle; switching back to independent prefixes makes the same table match zero puzzles in the evidence fixture.
3. **Five generations.** The existing tablist keeps DH, ECDH, X25519, ML-KEM, and hybrid as five generations with their mechanics, assumptions, sizes, migration pressure, and quantum status.
4. **DH, active interception, and device pairing.** Run toy Diffie–Hellman, see why both exponent towers meet at `g^(ab)`, recover a toy exponent, then watch a real AES-GCM relay succeed until Ed25519 authentication stops it. A second comparison models a displayed short code: an honest exchange, Eve adapting a nonce after seeing the target code, and the same choice rejected by a prior commitment.
5. **ECDH.** Plot the full toy curve and step through scalar multiplication one point at a time before contrasting the toy curve with Curve25519.
6. **ML-KEM and hybrid.** Run real ML-KEM-768, mutate its ciphertext, and combine its secret with a real X25519 secret through HKDF.
7. **Compare, sizes, and dated history.** Put all five deployed generations on one screen, compare byte sizes, and follow the evidence-backed history now including Merkle's 1978 paper.
8. **Shor and Module-LWE.** Inspect classical order finding and its spectrum, then toggle Module-LWE noise and run the actual modular solver to see why the error term matters.
9. **Production and synthesis.** Connect the mechanisms to current deployments, then close with the three distinctions the lesson is designed to preserve.

## When to Use It

- **Teaching the migration story** — show why "post-quantum" is not just a bigger key, it's a different mechanic.
- **Briefing engineers on hybrid** — make X25519MLKEM768 concrete by computing the combine yourself.
- **Demonstrating why discrete log fails on tiny primes** — the "Break it" button actually recovers Alice's secret exponent, and the same algorithm would take heat-death timescales on a real 2048-bit DH group.
- **Reference: in production, use these** — X25519 today for classical ECDH; ML-KEM (FIPS 203) for post-quantum; hybrid X25519+ML-KEM during migration. Use a vetted library (BoringSSL, OpenSSL, liboqs, libsodium, BouncyCastle) — never roll your own.
- Do NOT use this demo's tiny p, g, or curve for anything — they exist so the brute-force discrete log can run in your browser. That is the entire point of choosing them.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-key-exchange](https://systemslibrarian.github.io/crypto-lab-key-exchange/)**

The page is one long scrollable lesson with a sticky scroll-spy nav at the top. A **"New here?" banner** points a first-timer straight at the DH playground, and the engineer-facing production decision card is tucked behind a "for engineers" disclosure so a newcomer meets arithmetic before jargon. Inside: the Merkle-puzzle prequel and its live Alice/Bob/Eve work meter; the five-generation tablist; a live DH playground whose **"why do they match?" panel** renders the two exponent towers `(g^a)^b` and `(g^b)^a` collapsing to the same `g^(ab)` so the commutativity is *shown*, not asserted; a MitM playground that goes past the mismatched numbers — a **relay exhibit** where Eve's HKDF-derived AES-256-GCM key really decrypts Alice's ciphertext, optionally rewrites it, and re-encrypts it to Bob (whose decryption then succeeds with every tag verifying), plus a signed-key-share variant where a real Ed25519 verification fails and Alice aborts before sending, with a control verification over Bob's genuine share returning valid in the same run; ECDH with a plot of every point on the demo curve plus a **step-by-step scalar-multiplication walk** (`G → 2G → 3G → … → a·G`) that lights up the numbered hops so the random-looking walk behind ECDLP is visible; a live real ML-KEM-768 encapsulation (including a forge check that flips a ciphertext bit); the hybrid combine with **live provenance chips** showing which half came from which section; an all-five comparison table; sizes and history sections; a roster of real production deployments; interactive Shor classical order-finding backed by a **"Shor in three registers" visualization** (the real periodic `a^x mod N` and the real |DFT| of that window peaking at multiples of `1/r`, labelled as the classical stand-in for the quantum step); a Module-LWE panel where you can **flip the noise `e` on and off and run real Gaussian elimination** — it recovers the secret exactly with noise off and lands on a wrong, non-short vector with noise on; a closing "remember three things" synthesis; and a references-and-glossary panel. Number keys `1`–`9` and `0` jump to the first ten nav entries; adding Puzzles after Generations shifts each later shortcut by one, and `?` opens the regenerated keyboard-shortcut help. Every interactive section carries an explicit threat-model chip strip (what it protects against, what it does not) and a visible "toy parameters" warning.

## What Can Go Wrong

- **Unauthenticated Diffie–Hellman** is wide open to a man-in-the-middle; key agreement must be authenticated by signatures, certificates, or a PAKE. The MitM section lets you mount the relay for real and then watch signed key shares defeat it.
- **A matching short code needs the whole pairing protocol.** In the numeric-comparison subpanel, Eve can force a match in a deliberately three-digit toy by selecting her nonce after seeing the other leg. A SHA-256 commitment to the public shares and nonce made before reveal rejects that late change. The fixed-nonce, non-cryptographic three-digit display is a teaching model, not Bluetooth or an estimate of its six-digit attack probability. [Bluetooth Core Specification v6.3 (5 May 2026), Security Manager §2.3.5.6.2](https://www.bluetooth.com/wp-content/uploads/Files/Specification/HTML/Core_v6.3/out/en/host/security-manager-specification.html) specifies the real P-256, fresh nonce, f4/g, commitment, six-digit confirmation, and abort sequence.
- **Weak or unvalidated group parameters** enable downgrade and precomputation attacks (e.g., Logjam against export-grade DH groups).
- **Reusing ephemeral keys** turns ephemeral DH into static DH and forfeits forward secrecy.
- **Skipping point/parameter validation** invites small-subgroup and invalid-curve attacks that can leak the private key.
- **Classical-only DH/ECDH** is vulnerable to harvest-now-decrypt-later once a large quantum computer exists — which is why hybrid X25519+ML-KEM exists.

## Real-World Usage

- **X25519** is a widely used TLS 1.3 key-share group (RFC 9846 recommends supporting it) and is used in SSH.
- **The Signal Protocol** builds X3DH and the Double Ratchet on X25519.
- **WireGuard** uses X25519 in its Noise-based handshake.
- **ML-KEM** (FIPS 203) is NIST's standardized post-quantum KEM.
- **Hybrid X25519MLKEM768** is deployed in TLS 1.3 by Chrome and Cloudflare for the migration period.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-key-exchange
cd crypto-lab-key-exchange
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-curve-lens](https://systemslibrarian.github.io/crypto-lab-curve-lens/) — ECC and ECDH on Curve25519 and P-256 up close.
- [crypto-lab-hybrid-wire](https://systemslibrarian.github.io/crypto-lab-hybrid-wire/) — the X25519 + ML-KEM-768 hybrid wire protocol end to end.
- [crypto-lab-pq-tls-handshake](https://systemslibrarian.github.io/crypto-lab-pq-tls-handshake/) — X25519MLKEM768 inside the TLS 1.3 key schedule.
- [crypto-lab-x3dh-wire](https://systemslibrarian.github.io/crypto-lab-x3dh-wire/) — Signal's X3DH key agreement.
- [crypto-lab-noise-pipe](https://systemslibrarian.github.io/crypto-lab-noise-pipe/) — Noise handshake patterns over X25519.
- [crypto-lab-agreeing-in-public](https://systemslibrarian.github.io/crypto-lab-agreeing-in-public/) — the beginner version of agreeing on a secret while a watcher sees every message.
- [crypto-lab-grover](https://systemslibrarian.github.io/crypto-lab-grover/) — why generic quantum search erases the classical Merkle-puzzle gap.

## How to Teach From It

If you have **5 minutes** — the time it takes a manager to skim:
1. Production decision card (top of page) — "if I'm building today, use…"
2. The five-generation tablist — one screen, every mechanism named
3. The synthesis card near the bottom — "remember three things"

If you have **15 minutes** — a brown-bag walk-through:
1. Production decision card
2. Five-generation tablist (click each chip, read the mechanic and threat)
3. Merkle-puzzle prequel — build the independent form, run Bob and Eve, then flip on the visibly broken textbook form to see one table solve every puzzle
4. DH playground — change `a`, watch both ends agree, then read the "why do they match?" panel to see the exponents commute to `g^(ab)`
5. "Break it" — recover Alice's exponent and read the scaling table
6. MitM panel — see Alice and Bob end with mismatched secrets, then hit **Relay it** and watch Eve decrypt the actual message and re-encrypt it to Bob; hit **Same attack — signed key shares** to watch an Ed25519 check stop the identical attack
7. KEM section — note the *shape* change vs DH
8. Hybrid combine — run it once, expand "Why is this secure if either half holds?"
9. Synthesis card

If you have **30 minutes** — a class or onboarding session:
1. Full top-to-bottom in nav order
2. Pause on ECDH for the point plot, the "walk a·G one hop at a time" animation, and the Curve25519 contrast table
3. Pause on Shor for the order-finding cycle, the "Shor in three registers" periodicity/spectrum visualization, and the resource estimates
4. Pause on Module-LWE for the `b = A·s + e` matrix layout, then flip the noise off/on and run the solver to feel why the noise is the whole game
5. End on References & glossary — every claim has a stable link

## Validation contract

What is tested, what is intentionally not tested, and how to run each:

| Test | Command | What it covers |
| --- | --- | --- |
| Engine unit tests | `npm test` | `modPow`, `modInverse`, `diffieHellman`, `discreteLogAttack`, `isOnCurve`, `ecAdd`, `ecMul` (incl. agreement with iterated addition and `n·G = ∞`), `ecdh` agreement for every scalar pair on the demo curve, `pointToString`; **real ML-KEM-768** FIPS 203 sizes (1184/1088/32), encapsulate↔decapsulate round-trip, implicit rejection of a flipped-bit ciphertext and of the wrong decapsulation key; `hybridCombine` determinism, fixed-width DH encoding, and the full `hybridHandshake` (real X25519 + real ML-KEM-768) both-ends-agree check; and the `mitmRelay` exhibit — Eve's real AES-GCM decrypt of Alice's ciphertext, her relay landing in Bob's plaintext, Bob's real tag failure on Alice's own ciphertext, and the signed-key-share variant aborting before anything is sent (with the honest no-attacker control still going through). The separate pairing-model tests check honest codes, adaptive substitution, failed commitment, and independently recompute SHA-256. Deterministic except for fresh keygen/encapsulation randomness (asserted on properties, not fixed bytes). |
| Merkle puzzle + AES unit tests | `npm test` | The FIPS 197-upd1 Appendix B AES-128 block, all four blocks from NIST SP 800-38A F.1.1, 100 Alice/Bob agreements, transcript-only Eve input, the 1,024/1,024 textbook table break, the salted-table negative control, ambiguity restart, cap/cancel paths, exact counters, and a repeated Eve mean checked against variance-derived tolerance. |
| Browser smoke | `npm run smoke` | Playwright/Chromium on three viewports (desktop 1280, iPhone 12, narrow 360×740). Exercises every interactive control end-to-end, the URL-hash deep-links, the keyboard shortcuts, the copy-to-clipboard chips, the EC curve plot, the MitM panel, the Shor cycle, and the Module-LWE matrices. Asserts no console errors and no horizontal overflow. |
| Browser exhibit + WCAG suite | `npm run test:a11y` | The Playwright suite in `e2e/`: the WCAG A/AA gate at desktop, 380px, and 320px with Merkle and MitM results rendered; computed MitM outcomes; and `claims.spec.ts`, created for this extension, which independently recomputes every displayed Merkle work claim, reads both secrets, inspects the real worker payload, checks retirement/no-op behaviour, and reaches the §4.1d recovery fixture. It also cross-checks eight random noble AES blocks against WebCrypto AES-CBC's zero-IV first block. |
| Merkle review regressions | `npm test` | Exhaustive index/check separation, enumeration of independent search-cost distributions, and instrumented AES-call accounting. Mutation-report fixtures reject zero tests, browser crashes, setup failures, timeouts, signals, skips, retries, and unrelated assertions. |
| Merkle verdict mutations | `npm run test:mutations` | Ten concrete patches in `mutations/ledger.json`; requires a clean committed tree. Each must compile, move the JavaScript bundle hash, and fail an assertion in its exact owning test, with a green control and `--retries=0`. Restoration rebuilds the original bundle and reruns the green owning test even when the mutant fails unexpectedly. Both CI and deployment enforce this gate. |
| Accessibility audit | `npm run axe` | axe-core WCAG 2.1 A/AA against six configurations (3 viewport widths × 2 themes). Currently zero violations. |
| Full local CI pass | `npm run verify` | Runs `build` + `test` and then expects you to run `smoke` / `axe` against a `preview` server. (CI runs all of them automatically on every push and PR.) |

Additional scripts: `npm run build` (type-check + production build to `dist/`) and `npm run preview` (serve the built `dist/` locally). No environment variables, no API keys, no servers — everything runs client-side in the browser.

What is **not** tested, by design:
- The visual appearance of the EC curve plot (only the count of finite points and the highlight classification is asserted).
- The exact text of every long-form explanation — that would freeze the prose against intentional editing.
- Real-network behaviour. The page is fully static and client-side.

The ML-KEM step is **not** simulated: it is real ML-KEM-768 (FIPS 203) from the vetted `@noble/post-quantum` library, and the hybrid combine mixes a real X25519 secret with the real ML-KEM secret via HKDF. The DH and ECDH panels remain deliberately toy-sized (so the discrete-log break can run in your browser) and are labelled as such; those toy parameters are the only "not for production" primitives in the demo.

CI runs `build + test + smoke + axe` on every push to `main` and on every PR (`.github/workflows/ci.yml`). The deploy workflow (`.github/workflows/deploy.yml`) only fires on push to `main`.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## SSH Handshake

- **slug**: `crypto-lab-ssh-handshake`
- **repo**: https://github.com/systemslibrarian/crypto-lab-ssh-handshake
- **live**: https://systemslibrarian.github.io/crypto-lab-ssh-handshake/
- **commit_sha**: `9081e076a9252fc2f14ef482965fad02a1ceb142` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `896fc07e2692e4c46fd9a3a637123750802c5ed6`
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | PROTOCOLS | SIGNATURES  ·  **level**: intermediate  ·  **--accent**: #0b7fab
- **MISSING FIELDS**: verification

**Name (H1)**: SSH Handshake  — _read from src/ui.ts_

**Subtitle**: Transport handshake · ephemeral ECDH + host-key sig · known_hosts TOFU  — _read from src/ui.ts_

**Description**: Run a real forward-secret SSH transport handshake in your browser — ephemeral ECDH keyed to a host-key signature over the exchange hash — then watch known_hosts pin the fingerprint on first contact and reject any later key swap.  — _read from src/ui.ts_

**Why it matters**: SSH has no CA: the first connection is a leap of faith, and a MITM there pins itself instead of the real host. Knowing what TOFU catches — and what SSHFP or @cert-authority add — is the difference between real server authentication and a false sense of it.  — _read from src/ui.ts_

**Card copy**: SSH transport-layer handshake and TOFU host-key pinning — ephemeral X25519 / ECDH, Ed25519 signatures over the exchange hash, and known_hosts change detection across StrictHostKeyChecking modes.

**Chips**: X25519 · Ed25519 · TOFU · known_hosts

**Implements**: AES `src/bpp/cbc-and-mac.ts:49`, AES-CBC `src/bpp/cbc-and-mac.ts:49`, AES-CTR `src/bpp/ctr.ts:5`, ChaCha20 `src/bpp/chachapoly.ts:41`, ECDH `src/engine.ts:45`, ECDSA `src/ca.ts:25`, Ed25519 `src/bpp/kex.ts:95`, HMAC `src/bpp/cbc-and-mac.ts:24`, P-256 `src/ca.ts:25`, Poly1305 `src/bpp/chachapoly.ts:55`, SHA-256 `src/bpp/cbc-and-mac.ts:34`, X25519 `src/bpp/kex.ts:77`

**Attacks shown**: Man-in-the-middle `src/data.ts:361`

**Comment-only (named in code comments, not executed)**: ChaCha20-Poly1305 `src/bpp/chachapoly.ts:1`, DSA `src/wire.ts:114`, RSA `src/wire.ts:114`, SHA-1 `src/wire.ts:115`

**References**: AES-GCM, ChaCha20-Poly1305, Ed448, EdDSA, Kerberos, MD5, ML-DSA, ML-KEM, RSA, SHA-1, SHA-512, TLS 1.3, X3DH

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `draft-ietf-sshm-chacha20-poly1305-04` — first seen README.md:69 (4×)
- `draft-ietf-sshm-strict-kex-02` — first seen src/data.ts:207 (2×)
- `NIST SP 800-38A` — first seen README.md:65 (2×)
- `RFC 4231` — first seen src/data.ts:222 (1×)
- `RFC 4251` — first seen src/data.ts:177 (1×)
- `RFC 4253` — first seen README.md:70 (21×)
- `RFC 4255` — first seen README.md:38 (5×)
- `RFC 5656` — first seen src/data.ts:237 (2×)
- `RFC 6668` — first seen src/data.ts:187 (1×)
- `RFC 7479` — first seen src/ui.ts:985 (1×)
- `RFC 8308` — first seen src/data.ts:192 (1×)
- `RFC 8439` — first seen src/data.ts:217 (2×)
- `RFC 8709` — first seen src/ca.ts:49 (4×)
- `RFC 8731` — first seen src/data.ts:247 (1×)
- `rfc4231` — first seen src/data.ts:223 (1×)
- `rfc4251` — first seen src/data.ts:178 (1×)
- `rfc4253` — first seen src/data.ts:183 (3×)
- `rfc4255` — first seen src/data.ts:233 (1×)
- `rfc5656` — first seen src/data.ts:238 (1×)
- `rfc6668` — first seen src/data.ts:188 (1×)
- `rfc8308` — first seen src/data.ts:193 (1×)
- `rfc8439` — first seen src/data.ts:218 (1×)
- `rfc8709` — first seen src/data.ts:243 (1×)
- `rfc8731` — first seen src/data.ts:248 (1×)

**README — What Can Go Wrong**:

```text
- **TOFU does not protect first contact** — an active man-in-the-middle on the very first connection is pinned as if legitimate; trust-on-first-use only detects *changes* afterward.
- **Ignoring `REMOTE HOST IDENTIFICATION HAS CHANGED!`** — dismissing the known_hosts warning, or reflexively removing the pin, discards the one signal that distinguishes a planned key rotation from an attack.
- **`StrictHostKeyChecking no`** — a changed key still triggers a warning and the existing pin remains. OpenSSH may continue with password/keyboard-interactive authentication, forwarding and UpdateHostkeys disabled; this does not restore trust in the host identity. This demo explicitly models those restrictions as transport-policy metadata, because it has no user-authentication or forwarding layers. The policy wrapper rolls back the engine's first-contact auto-pin after a failed signature or key exchange, and never offers that failed handshake for acceptance. Intentional pin replacement requires out-of-band verification and an explicit remove/reconnect flow. Other OpenSSH conditions (such as ExitOnForwardFailure) may still abort; this is not full client parity. Source: [pinned OpenSSH HOST_CHANGED/continue_unsafe](https://github.com/openssh/openssh-portable/blob/813f670ccc086aeb48ca6bf701e6a73c098a65bb/sshconnect.c#L1231-L1344).
- **SSHFP without DNSSEC** — verifying a fingerprint via an unsigned DNS record can itself be spoofed, so the "out-of-band" check lies.
- **Accepting a fingerprint without real out-of-band verification** — clicking through the `ask` prompt without comparing the fingerprint through a trusted channel defeats the purpose of the prompt.
- **Reading CBC packet length before checking the MAC** — the APW/Boneh–Shoup exhibit shows how distinguishable receiver reactions disclose 14 or 32 plaintext bits even though the eventual HMAC fails.
- **Assuming valid packet tags prove completeness** — Terrapin manipulates pre-NEWKEYS sequence numbers, deletes EXT_INFO, and still gives the client a valid Poly1305 tag on every packet it receives.
```

**Claims tested** (tests/e2e/claims.spec.ts, 19 test(s)):

- `(assertions outside a test block)` — tests/e2e/claims.spec.ts:15
    - :15 `toHaveText` expected `'After the handshake: the packet layer'` _(literal)_
- `(assertions outside a test block)` — tests/e2e/claims.spec.ts:20
    - :20 `toHaveText` expected `'Target captured.'` _(literal)_
- `(assertions outside a test block)` — tests/e2e/claims.spec.ts:21
    - :21 `toBeEnabled` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — tests/e2e/claims.spec.ts:30
    - :30 `toBe` expected `computed` _(expression)_
- `(assertions outside a test block)` — tests/e2e/claims.spec.ts:31
    - :31 `toHaveText` expected `computed` _(expression)_
- `[mutation:apw-ideal] idealised receiver verdict follows real CBC XOR` — tests/e2e/claims.spec.ts:34
    - :39 `toHaveText` expected `'⚠ ALARM — PLAINTEXT LEAKED (32 bits)'` _(literal)_
    - :43 `toContainText` expected `'ℓ = ${length.toLocaleString()}'` _(expression)_
    - :44 `toContainText` expected `'bytes counted'` _(literal)_
- `[mutation:apw-openssh] pre-5.2 verdict follows the range oracle` — tests/e2e/claims.spec.ts:47
    - :53 `toHaveText` expected `'⚠ ALARM — PLAINTEXT LEAKED (14 bits)'` _(literal)_
    - :54 `toHaveText` expected `'FIN'` _(literal)_
- `pre-5.2 aligned wait recovers the displayed 32-bit prefix` — tests/e2e/claims.spec.ts:58
    - :64 `toHaveText` expected `'⚠ ALARM — PLAINTEXT LEAKED (32 bits)'` _(literal)_
    - :65 `toHaveText` expected `'WAIT → MAC_ERROR'` _(literal)_
    - :66 `toBe` expected `'MAC_ERROR'` _(literal)_
- `[mutation:apw-no-recovery-${depth}] invalid length cannot establish a ${depth}-bit recovery` — tests/e2e/claims.spec.ts:71
    - :78 `toHaveText` expected `'DISCONNECT'` _(literal)_
    - :79 `toContainText` expected `'No plaintext prefix recovered'` _(literal)_
    - :80 `toHaveCount` expected `0` _(literal)_
    - :81 `toHaveCount` expected `0` _(literal)_
    - :82 `toHaveCount` expected `0` _(literal)_
- `idealised over-budget wait shows cost without claiming recovery` — tests/e2e/claims.spec.ts:86
    - :92 `toHaveText` expected `'WAIT'` _(literal)_
    - :93 `toContainText` expected `'Cost shown; run not performed'` _(literal)_
    - :94 `toHaveCount` expected `0` _(literal)_
    - :95 `toHaveCount` expected `0` _(literal)_
- `[mutation:apw-ctr] AES-CTR output and recovery candidate match independent OpenSSL computation` — tests/e2e/claims.spec.ts:98
    - :104 `toBeVisible` expected _no expected value_ _(none)_
    - :110 `toBe` expected `await readBytes('#apw-cstar')` _(expression)_
    - :114 `toBe` expected `expected` _(expression)_
    - :117 `toBe` expected `xorHex(expected, await readBytes('#apw-ctr-last'), await readBytes('#apw-ctr-predecessor')).slice(0, 32)` _(expression)_
    - :119 `toBe` expected `String(unrelated)` _(expression)_
    - :121 `toHaveText` expected `'✓ DEFENCE HELD — AES-CTR USED AN UNRELATED KEYSTREAM BLOCK'` _(literal)_
    - :123 `toHaveCount` expected `0` _(literal)_
    - :124 `toContainText` expected `'INCONCLUSIVE'` _(literal)_
- `changed APW inputs retire results while reselecting the same inputs preserves them` — tests/e2e/claims.spec.ts:128
    - :137 `toContainText` expected `'(14 bits)'` _(literal)_
    - :138 `toBe` expected `prime` _(expression)_
    - :141 `toHaveCount` expected `0` _(literal)_
    - :142 `toContainText` expected `'retired'` _(literal)_
    - :144 `toContainText` expected `'(32 bits)'` _(literal)_
    - :146 `toHaveCount` expected `0` _(literal)_
    - :147 `toContainText` expected `'retired'` _(literal)_
    - :149 `toBeVisible` expected _no expected value_ _(none)_
    - :151 `toContainText` expected `'retired'` _(literal)_
    - :152 `toHaveCount` expected `0` _(literal)_
    - :153 `toHaveCount` expected `0` _(literal)_
    - :154 `toBeDisabled` expected _no expected value_ _(none)_
    - :155 `toBeDisabled` expected _no expected value_ _(none)_
- `changing the fix retires its verdict and reselecting the same fix is a no-op` — tests/e2e/claims.spec.ts:158
    - :163 `toBeVisible` expected _no expected value_ _(none)_
    - :165 `toBeVisible` expected _no expected value_ _(none)_
    - :167 `toHaveCount` expected `0` _(literal)_
    - :168 `toContainText` expected `'retired'` _(literal)_
- `[mutation:apw-chacha] ChaCha defence is tied to the real Poly1305 rejection` — tests/e2e/claims.spec.ts:171
    - :176 `toHaveText` expected `'✓ DEFENCE HELD — POLY1305 REJECTED BEFORE PAYLOAD DECRYPTION'` _(literal)_
    - :177 `toBe` expected `'true'` _(literal)_
- `measured rates equal displayed hits divided by attempts` — tests/e2e/claims.spec.ts:180
    - :186 `toBeVisible` expected _no expected value_ _(none)_
    - :193 `toBe` expected `hits14 / total` _(expression)_
    - :194 `toBe` expected `hits32 / total` _(expression)_
    - :198 `toBeVisible` expected _no expected value_ _(none)_
    - :199 `toHaveText` expected `'VERIFIED'` _(literal)_
- `[mutation:strict-kex] safe default rejects IGNORE at the computed strict-kex rule` — tests/e2e/claims.spec.ts:202
    - :205 `toContainText` expected `'STRICT KEX ACTIVE'` _(literal)_
    - :206 `toContainText` expected `'host signature FAILS'` _(literal)_
    - :208 `toHaveText` expected `'✓ DEFENCE HELD — STRICT KEX REJECTED SSH_MSG_IGNORE'` _(literal)_
    - :209 `toHaveText` expected `'2'` _(literal)_
- `[mutation:terrapin] delivered sequence matches C.Rcv and authenticated truncation is proved` — tests/e2e/claims.spec.ts:212
    - :218 `toContainText` expected `'BROKEN MODE'` _(literal)_
    - :220 `toHaveText` expected `'UNCHANGED'` _(literal)_
    - :221 `toBe` expected `originalH` _(expression)_
    - :229 `toEqual` expected `{` _(expression)_
    - :236 `toHaveText` expected `'⚠ ALARM — PACKET DELETED, MAC VALID'` _(literal)_
    - :238 `toBe` expected `counterValues['client-receive']` _(expression)_
    - :239 `toBe` expected `await fixture.getAttribute('data-delivered-sequence')` _(expression)_
    - :240 `toHaveText` expected `'AUTHENTICATED — AND TRUNCATED'` _(literal)_
    - :241 `toContainText` expected `'A valid MAC on every delivered packet does not mean no packet was deleted.'` _(literal)_
    - :242 `toContainText` expected `'VERIFIED'` _(literal)_
    - :243 `toContainText` expected `'VERIFIED'` _(literal)_
    - :244 `toContainText` expected `'NEVER ARRIVED'` _(literal)_
    - :245 `toHaveText` expected `'MISSING'` _(literal)_
    - :246 `toHaveText` expected `'MISSING'` _(literal)_
- `delete without IGNORE, late IGNORE, and one-sided strict kex fail safely` — tests/e2e/claims.spec.ts:249
    - :253 `toContainText` expected `'one-sided support is not negotiation'` _(literal)_
    - :256 `toContainText` expected `'sequence-number mismatch'` _(literal)_
    - :259 `toContainText` expected `'IGNORE after NEWKEYS would need a valid encrypted packet and tag'` _(literal)_
- `retirement and no-op guards remove the overclaim and keep safe defaults inert` — tests/e2e/claims.spec.ts:262
    - :265 `expect` expected _no expected value_ _(none)_
    - :266 `expect` expected _no expected value_ _(none)_
    - :268 `toEqual` expected `[` _(expression)_
    - :279 `toContainText` expected `'No broken receiver selected'` _(literal)_
    - :280 `toHaveCount` expected `0` _(literal)_
    - :285 `toContainText` expected `'the tag is not CBC ciphertext'` _(literal)_

**Mutation records** (1 file(s)):

- `scripts/mutation-test.mjs` (4844 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-ssh-handshake

## What It Is

An interactive model of the **SSH transport-layer handshake** and the **`known_hosts` / Trust-On-First-Use** flow that authenticates the server. The server holds a long-term host key; every connection generates fresh ephemeral ECDH keys on both sides; the server signs a single teaching-model "exchange hash" over selected KEX fields to prove possession of its host private key, and the client verifies that signature and then compares the host fingerprint against its known_hosts pin. The crypto is real: ephemeral **X25519** with an automatic **ECDH P-256** fallback for key agreement, and **Ed25519** with an automatic **ECDSA P-256** fallback for the host signature, all via the Web Crypto API. The problem SSH solves with this is **authenticating a server you have no CA path and no web-of-trust path to**: the first connection pins the host key (an unverified leap of faith), and every connection after that detects whether the key changed. A focused packet-layer section then builds real AES-CBC/HMAC-SHA-256 and `chacha20-poly1305@openssh.com` packets to expose the APW length oracle and the Terrapin prefix-truncation attack, plus their AES-CTR/strict-kex defenses. The core engine still uses compact JSON messages, and the lab does not implement general algorithm negotiation, channels, or user authentication; it is not a re-implementation of OpenSSH.

## When to Use It

- **Understanding the SSH host-key prompt** — see exactly what the client is being asked to commit to when it prints `The authenticity of host '…' can't be established` and a fingerprint. The demo's `ask` mode rolls back the engine's auto-pin so you have to actually accept, reject, or verify the fingerprint yourself.
- **Reasoning about `known_hosts` warnings** — when `REMOTE HOST IDENTIFICATION HAS CHANGED!` appears, this is what is happening underneath. The transcript inspector highlights the field that broke the handshake (host pubkey, signature, etc.) so you can see *which* part of the check fired.
- **Contrasting the three trust models** — read alongside the sibling [`crypto-lab-pki-chain`](https://systemslibrarian.github.io/crypto-lab-pki-chain/) (hierarchical CA / TLS) and [`crypto-lab-web-of-trust`](https://systemslibrarian.github.io/crypto-lab-web-of-trust/) (decentralized PGP) demos. SSH sits between them: no CA, no graph, just a per-host pin — unless you opt into SSHFP+DNSSEC or OpenSSH `@cert-authority`, which the demo also models.
- **Teaching ephemeral KEX + signature authentication** — the same shape shows up in TLS 1.3 and Noise; SSH is the cleanest place to see it because there is no certificate machinery in the way.
- **Comparing `StrictHostKeyChecking` modes** — toggle between `yes` (refuse unknown), `ask` (prompt), `accept-new` (silent pin, reject change), and `no` (auto-pin new hosts, permit restricted changed-key continuation without replacing the saved pin) and watch the same connection produce very different decisions.
- **Do NOT use this to reason about first-contact safety in production** — TOFU does **not** protect a first connection against an active man-in-the-middle. The demo includes the *MITM on first contact* and *DNS spoof of SSHFP without DNSSEC* scenarios specifically to make that limitation undeniable.
- **Do NOT use this as a real SSH implementation** — this is a toy for learning. For production use OpenSSH, libssh, or another vetted library.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-ssh-handshake](https://systemslibrarian.github.io/crypto-lab-ssh-handshake/)**

The page walks through seven sections: starting a server; connecting with a real handshake and TOFU policy; a guided eight-scenario “break it and recover” lab; the APW and Terrapin packet-layer exhibits; a three-trust-models comparison; an “in the real world” reference; and scope/provenance. The URL accepts `?scenario=<id>` for deep links—e.g. `?scenario=mitm-after`.

## What Can Go Wrong

- **TOFU does not protect first contact** — an active man-in-the-middle on the very first connection is pinned as if legitimate; trust-on-first-use only detects *changes* afterward.
- **Ignoring `REMOTE HOST IDENTIFICATION HAS CHANGED!`** — dismissing the known_hosts warning, or reflexively removing the pin, discards the one signal that distinguishes a planned key rotation from an attack.
- **`StrictHostKeyChecking no`** — a changed key still triggers a warning and the existing pin remains. OpenSSH may continue with password/keyboard-interactive authentication, forwarding and UpdateHostkeys disabled; this does not restore trust in the host identity. This demo explicitly models those restrictions as transport-policy metadata, because it has no user-authentication or forwarding layers. The policy wrapper rolls back the engine's first-contact auto-pin after a failed signature or key exchange, and never offers that failed handshake for acceptance. Intentional pin replacement requires out-of-band verification and an explicit remove/reconnect flow. Other OpenSSH conditions (such as ExitOnForwardFailure) may still abort; this is not full client parity. Source: [pinned OpenSSH HOST_CHANGED/continue_unsafe](https://github.com/openssh/openssh-portable/blob/813f670ccc086aeb48ca6bf701e6a73c098a65bb/sshconnect.c#L1231-L1344).
- **SSHFP without DNSSEC** — verifying a fingerprint via an unsigned DNS record can itself be spoofed, so the "out-of-band" check lies.
- **Accepting a fingerprint without real out-of-band verification** — clicking through the `ask` prompt without comparing the fingerprint through a trusted channel defeats the purpose of the prompt.
- **Reading CBC packet length before checking the MAC** — the APW/Boneh–Shoup exhibit shows how distinguishable receiver reactions disclose 14 or 32 plaintext bits even though the eventual HMAC fails.
- **Assuming valid packet tags prove completeness** — Terrapin manipulates pre-NEWKEYS sequence numbers, deletes EXT_INFO, and still gives the client a valid Poly1305 tag on every packet it receives.

## Real-World Usage

- **OpenSSH `known_hosts`** — every SSH client pins host keys on first connection and warns on change, exactly the TOFU flow modeled here.
- **Server and infrastructure administration** — interactive shells, configuration management, and automation authenticate hosts via these host keys.
- **Git over SSH** — pushing and pulling from GitHub, GitLab, and self-hosted servers relies on SSH host-key verification.
- **SSHFP + DNSSEC** — publishing host fingerprints in signed DNS lets clients bootstrap trust without a prior connection (RFC 4255).
- **OpenSSH certificate authorities** — `@cert-authority` lets an organization sign host keys so clients trust a CA instead of pinning every host.
- **Strict key exchange** — both peers advertise the strict-kex pseudo-algorithms, reject non-KEX messages during initial KEX, require KEXINIT first, and reset sequence numbers after NEWKEYS to close Terrapin’s prefix-truncation path.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-ssh-handshake
cd crypto-lab-ssh-handshake
npm install
npm run dev
`​``

## Testing

The shared CI/Pages build gate runs `npm test`, `npm run build`, and
`npm run test:e2e`, which includes both the functional teaching flows and the
accessibility specs. `npm run test:a11y` is the accessibility-only subset for
local focused checks; it does not replace the full browser gate.
The browser gate checks first contact, changed-key rejection, and explicit
pin-replacement recovery at 320px, 380px, and desktop width, including complete
fingerprint text, page reflow, and accessibility scans.
Sequence rows reveal at full text contrast while keeping their staggered motion;
the accessibility regression samples the actual entrance animation and includes
an intentional low-contrast negative control. Reduced motion reveals all rows.

The packet path pins **nine published known-answer cases**: one four-block
AES-128-CBC case from NIST SP 800-38A F.2.1; two HMAC-SHA-256 cases from RFC
4231 (Cases 1 and 7, including its 131-byte key and 152-byte data); five RFC
8439 cases (three ChaCha20 cases from §2.4.2/A.1/A.2 and two Poly1305 cases from
§2.5.2/A.3); and the 92-byte packet from
draft-ietf-sshm-chacha20-poly1305-04 Appendix A, whose 72-byte encrypted body
crosses a 64-byte ChaCha block boundary. The RFC 4253 §7.2 expansion also has an
independent test re-derivation.

Recovery verdicts require an observable receiver reaction and a matching plaintext
check. Invalid-length disconnects and unfinished over-budget waits never claim a
recovered prefix. Changing the receiver, recovery depth, target, or fix retires
the corresponding stale evidence; selecting the same value preserves it.
The AES-CTR browser claim independently checks the displayed calculation against
Node/OpenSSL, rather than trusting two values produced by the same implementation.

`npm run test:mutations` replays seven behavioral source changes: corrupt CBC
recovery, invert the receiver range check, corrupt AES-CTR output, invert Poly1305
tag rejection, delete the wrong Terrapin packet, invert strict-kex rejection, and
reintroduce a recovery claim after a disconnect. Verdict wording is left unchanged.
Each case requires the owning browser test to pass first, a successful mutated
build with a different bundle hash, an assertion failure in that exact test, and
restoration to the original passing bundle. Build failures, browser startup errors,
timeouts, skips, and absent tests cannot count as kills. Commit source changes
before running the mutation script; it refuses to mutate uncommitted source.
The deployment workflow runs this gate after the full browser suite and before
uploading the restored production bundle.

## Related Demos

- [crypto-lab-pki-chain](https://systemslibrarian.github.io/crypto-lab-pki-chain/) — hierarchical X.509 CA trust, the centralized counterpart to SSH's TOFU model.
- [crypto-lab-web-of-trust](https://systemslibrarian.github.io/crypto-lab-web-of-trust/) — PGP/OpenPGP decentralized trust graphs, the third trust model SSH is compared against.
- [crypto-lab-noise-pipe](https://systemslibrarian.github.io/crypto-lab-noise-pipe/) — the Noise/WireGuard handshake patterns that share SSH's ephemeral-KEX shape.
- [crypto-lab-ed25519-forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) — Ed25519/EdDSA signatures, the algorithm signing the SSH exchange hash.
- [crypto-lab-x3dh-wire](https://systemslibrarian.github.io/crypto-lab-x3dh-wire/) — X3DH ephemeral key agreement from the Signal protocol.

## Exhibits

1. **Start the server** generates a real host keypair in your browser and shows its `SHA256:` fingerprint. The two second-order trust-bootstrap mechanisms—SSHFP with a DNSSEC toggle and an OpenSSH host CA—live behind an optional progressive-disclosure gate so plain TOFU lands first.
2. **Connect** runs the handshake as a two-party sequence diagram under a `StrictHostKeyChecking` selector. Its exchange-hash lab mutates one of the core model’s five selected fields and re-runs real SHA-256 and signature verification; its authentication lab separates KEX, proof of host-key possession, and comparison against a pre-existing pin. A transcript inspector and realistic `known_hosts` view expose the computed evidence.
3. **Break it (and recover)** runs eight guided scenarios: MITM after pinning, MITM on first contact, tampered host signature, unsigned SSHFP spoofing, a rogue CA, planned rotation, emergency rotation, and rotation beneath the same trusted CA.
4. **After the handshake: the packet layer** contains two real-computation exhibits. APW/Boneh–Shoup captures AES-128-CBC ciphertext, injects a block, derives `P′ = D(c*) ⊕ L`, and measures the pre-5.2 receiver’s 2⁻¹⁴/2⁻¹⁸ reactions in a worker; AES-CTR and OpenSSH ChaCha20-Poly1305 stop the same injection. Terrapin performs real X25519, exact RFC-shaped H and §7.2 key expansion, then protects packets with `chacha20-poly1305@openssh.com`; an injected IGNORE balances a deleted EXT_INFO so the next tag verifies. Strict kex rejects the injection and binds its negotiation markers through KEXINIT and H.
5. **Three trust models** compares hierarchical PKI, Web of Trust, and SSH TOFU, with first-contact callouts linking to the sibling demos.
6. **In the real world** documents `~/.ssh/known_hosts`, `SHA256:` fingerprints, host key types, SSHFP, certificate-based SSH, and `StrictHostKeyChecking` modes.
7. **Scope & provenance** states the exact model boundaries and links the RFCs, drafts, primary attack papers, published-vector sources, OpenSSH protocol notes, and relevant man pages.

The URL accepts `?scenario=<id>` for deep links — e.g. `?scenario=mitm-after` auto-starts the server, pins the legitimate host once, then triggers the MITM-after-pinning scenario.

## Implementation Notes

Additional npm scripts:

`​``bash
npm run build      # type-check + production build to dist/
npm run preview    # serve the built dist/ locally
npm test           # vitest — engine, policy, wire format, SSHFP, CA
npm run test:e2e   # playwright — teaching flows + WCAG a11y gate (needs `npx playwright install chromium`)
`​``

No environment variables, no API keys, no servers. Everything runs client-side in the browser. The existing engine in `src/engine.ts` remains the compact teaching path: its exchange hash covers the host name, host key, both ephemerals, and shared secret, and its helpers re-run the same SHA-256 and signature verification for the binding exhibit. The isolated `src/bpp/` path builds RFC 4253 §8’s exact H field shape—V_C, V_S, I_C, I_S, K_S, Q_C, Q_S, K—and demonstrates that optional IGNORE messages and implicit sequence numbers are not among those fields. It uses Web Crypto for X25519, Ed25519, HMAC-SHA-256, and AES-CTR; `@noble/ciphers` supplies raw no-padding AES-CBC plus the 64-bit-nonce ChaCha20 and Poly1305 primitives Web Crypto lacks. The StrictHostKeyChecking policy, SSHFP registry, host CA, and transcript capture continue to sit on top of the original engine without changing its cryptographic logic.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## OpenSSH deployment context

A visible dated comparison links [OpenSSH release notes](https://www.openssh.org/releasenotes.html) and [PQ guidance](https://www.openssh.org/pq.html), separates PQ key exchange, host signatures and trust bootstrap, and keeps the lab’s classical JSON-model engine explicit.

```

</details>

---

## E91

- **slug**: `crypto-lab-e91`
- **repo**: https://github.com/systemslibrarian/crypto-lab-e91
- **live**: https://systemslibrarian.github.io/crypto-lab-e91/
- **commit_sha**: `399024409e799c86c717b6d82ba017afcc5e1e11` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE  ·  **level**: advanced  ·  **--accent**: #086e96
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: E91  — _read from src/ui.ts_

**Subtitle**: Ekert 1991 · Entanglement-based QKD · CHSH Bell test  — _read from src/ui.ts_

**Description**: Run a CHSH Bell test on streams of entangled singlet pairs, watch |S| sit near Tsirelson's bound 2√2 ≈ 2.828, then switch on an intercept-resend Eve (or channel noise) and see S collapse back toward the classical bound of 2.  — _read from src/ui.ts_

**Why it matters**: E91 uses Bell-test statistics to help bound an eavesdropper's information under specified protocol and device assumptions. This simulation compares those statistics with the classical bound; it does not certify a secret key.  — _read from src/ui.ts_

**Card copy**: Simulate E91, estimate a CHSH Bell statistic, and test how biased coincidence selection can mislead a Bell check. The model does not prove finite-key or device-independent security.

**Chips**: E91 · Entanglement · CHSH Bell Test · QKD

**Implements**: E91 `src/engine.ts:375`

**Attacks shown**: _none derived_

**References**: BB84, Grover's algorithm, Shor's algorithm

**Standards body**: _none_

**Implementation**: idealized statistical simulation

**Spec citations, exactly as written**:

- `doi.org/10.1007/BF00417500` — first seen src/data.ts:309 (1×)
- `doi.org/10.1038/nature15759` — first seen src/data.ts:333 (1×)
- `doi.org/10.1038/s41586-022-04891-y` — first seen src/data.ts:357 (1×)
- `doi.org/10.1038/s41586-022-04941-5` — first seen src/data.ts:349 (1×)
- `doi.org/10.1103/PhysRevLett.127.050503` — first seen README.md:117 (2×)
- `doi.org/10.1103/PhysRevLett.23.880` — first seen src/data.ts:301 (1×)
- `doi.org/10.1103/PhysRevLett.49.1804` — first seen src/data.ts:317 (1×)
- `doi.org/10.1103/PhysRevLett.67.661` — first seen src/data.ts:325 (1×)
- `doi.org/10.1126/science.aan3211` — first seen src/data.ts:341 (1×)

**Stated limitations (page)**:

- _(caveat, src/ui.ts)_ What this simulation does and does not model

**README — What Can Go Wrong**:

```text
- **A missing 2√2 is ambiguous.** A measured |S| below the classical bound can be caused by an eavesdropper *or* by ordinary noise, misalignment, or loss; from |S| alone you cannot tell which, so a degraded key is discarded either way.
- **A Bell pass is not a key.** The five-step panel displays candidate sifted bits from a preselected shared 45° setting and tests separate CHSH rounds. Its confidence interval addresses the modeled correlations under independent-trial and fair-sampling assumptions; it neither certifies an untrusted source nor establishes a finite-key secret. Real QKD needs authenticated public discussion, error reconciliation, privacy amplification with an entropy bound, and a security proof for its devices and protocol.
- **Finite-key effects.** Real E91 needs finite-key security corrections and enough rounds for the CI to tighten; a small sample can leave the verdict inconclusive or misleading (this demo models the statistics but not full finite-key proofs).
- **Detector side-channels (real hardware).** Physical implementations face detector-blinding, timing, and efficiency-loophole attacks that an idealized simulation does not capture.
- **Unauthenticated classical channel.** The public discussion/sifting channel must be authenticated; without it, a man-in-the-middle can defeat QKD regardless of the Bell test.
- **The detection-efficiency (loss) loophole.** Low detection efficiency can let a local hidden-variable model fake a Bell violation, so loss must be accounted for in any real security claim.
- **Fair loss and selective loss differ.** The channel slider discards pairs independently of settings and outcomes, which leaves expected |S| unchanged. The separate exact classical model filters coincidences by local detector rules and can fake an apparent violation on a biased subset. See [Larsson, *Loopholes in Bell Inequality Tests of Local Realism* (2014)](https://arxiv.org/abs/1407.0363); a loophole-aware protocol must handle missing rounds, and real device-independent QKD needs much more than this comparison.
```

**Claims tested** (e2e/claims.spec.ts, 64 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:137
    - :137 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:139
    - :139 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:141
    - :141 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:161
    - :161 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:174
    - :174 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:180
    - :180 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:181
    - :181 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:199
    - :199 `toBeCloseTo` expected `n.absS, 3` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:200
    - :200 `toBeCloseTo` expected `n.ciLo, 3` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:201
    - :201 `toBeCloseTo` expected `n.ciHi, 3` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:202
    - :202 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:203
    - :203 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:205
    - :205 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:206
    - :206 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:211
    - :211 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:212
    - :212 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:213
    - :213 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:214
    - :214 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:216
    - :216 `toBe` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:221
    - :221 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:222
    - :222 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:224
    - :224 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:225
    - :225 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:227
    - :227 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:228
    - :228 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:235
    - :235 `toHaveLength` expected `4` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:236
    - :236 `toEqual` expected `[` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:245
    - :245 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:252
    - :252 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:255
    - :255 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:258
    - :258 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:259
    - :259 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:260
    - :260 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:261
    - :261 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:265
    - :265 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:276
    - :276 `toBe` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:279
    - :279 `toBe` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:282
    - :282 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:283
    - :283 `toBe` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:293
    - :293 `toBe` expected `bob.length` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:294
    - :294 `toBe` expected `Math.min(64, k.siftedBits)` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:295
    - :295 `toHaveLength` expected `alice.length` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:297
    - :297 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:303
    - :303 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:304
    - :304 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:306
    - :306 `toBe` expected `k.siftedBits > 64` _(expression)_
- `ideal channel: verdict, |S| and key agreement all follow the numbers on screen` — e2e/claims.spec.ts:311
    - :315 `toHaveText` expected `'E91'` _(literal)_
    - :322 `toBe` expected `'Bell violation observed'` _(literal)_
    - :324 `toBeCloseTo` expected `TSIRELSON, 2` _(expression)_
    - :325 `expect` expected _no expected value_ _(none)_
    - :326 `expect` expected _no expected value_ _(none)_
    - :330 `toBe` expected `100` _(literal)_
    - :331 `toBe` expected `100` _(literal)_
    - :332 `toBe` expected `true` _(expression)_
    - :336 `expect` expected _no expected value_ _(none)_
    - :337 `expect` expected _no expected value_ _(none)_
    - :339 `toEqual` expected `[-1, -1, -1, 1]` _(expression)_
- `the gauge draws the number it reports` — e2e/claims.spec.ts:342
    - :346 `toBeCloseTo` expected `(n.absS / 4) * 100, 1` _(expression)_
    - :347 `toBeCloseTo` expected `(Math.max(0, n.ciLo) / 4) * 100, 1` _(expression)_
    - :348 `expect` expected _no expected value_ _(none)_
    - :349 `toBe` expected `true` _(expression)_
- `failure path — intercept-resend Eve collapses the Bell violation` — e2e/claims.spec.ts:354
    - :356 `expect` expected _no expected value_ _(none)_
    - :359 `toHaveText` expected `'Eve'` _(literal)_
    - :360 `toHaveAttribute` expected _no expected value_ _(none)_
    - :371 `toBe` expected `'Below classical bound'` _(literal)_
    - :373 `expect` expected _no expected value_ _(none)_
    - :374 `expect` expected _no expected value_ _(none)_
    - :378 `toBeCloseTo` expected `SQRT2, 2` _(expression)_
    - :379 `expect` expected _no expected value_ _(none)_
    - :380 `expect` expected _no expected value_ _(none)_
    - :383 `toBeCloseTo` expected `75, 1` _(expression)_
    - :384 `expect` expected _no expected value_ _(none)_
    - :385 `toBe` expected `true` _(expression)_
- `failure path — depolarizing noise alone destroys the violation, without blaming Eve` — e2e/claims.spec.ts:388
    - :398 `toBe` expected `'Below classical bound'` _(literal)_
    - :400 `expect` expected _no expected value_ _(none)_
    - :401 `expect` expected _no expected value_ _(none)_
    - :402 `expect` expected _no expected value_ _(none)_
    - :406 `toBeCloseTo` expected `(1 - p) * TSIRELSON, 2` _(expression)_
    - :407 `expect` expected _no expected value_ _(none)_
    - :409 `expect` expected _no expected value_ _(none)_
    - :412 `toBeCloseTo` expected `100 * (1 - p / 2), 1` _(expression)_
- `failure path — analyzer misalignment past 22.5 degrees looks exactly like an attack` — e2e/claims.spec.ts:415
    - :425 `toBe` expected `'Below classical bound'` _(literal)_
    - :426 `expect` expected _no expected value_ _(none)_
    - :427 `expect` expected _no expected value_ _(none)_
    - :431 `toBeCloseTo` expected `TSIRELSON * Math.cos(2 * delta), 2` _(expression)_
    - :432 `expect` expected _no expected value_ _(none)_
    - :434 `toBeCloseTo` expected `50 * (1 + Math.cos(2 * delta)), 1` _(expression)_
- `failure path — the borderline case stays inconclusive and asks for more rounds` — e2e/claims.spec.ts:437
    - :447 `toBe` expected `'Inconclusive'` _(literal)_
    - :448 `expect` expected _no expected value_ _(none)_
    - :450 `toBeCloseTo` expected `2, 3` _(expression)_
    - :451 `expect` expected _no expected value_ _(none)_
    - :452 `expect` expected _no expected value_ _(none)_
- `failure path — photon loss starves the statistics instead of breaking them` — e2e/claims.spec.ts:455
    - :467 `toBe` expected `10000` _(literal)_
    - :468 `expect` expected _no expected value_ _(none)_
    - :474 `toBeCloseTo` expected `TSIRELSON, 2` _(expression)_
    - :475 `expect` expected _no expected value_ _(none)_
    - :480 `expect` expected _no expected value_ _(none)_
    - :481 `expect` expected _no expected value_ _(none)_
    - :482 `toBe` expected `10000` _(literal)_
- `a key shorter than the grid is described by the grid it actually drew` — e2e/claims.spec.ts:485
    - :491 `expect` expected _no expected value_ _(none)_
    - :492 `expect` expected _no expected value_ _(none)_
    - :495 `toHaveLength` expected `k.siftedBits` _(expression)_
    - :496 `expect` expected _no expected value_ _(none)_
    - :497 `expect` expected _no expected value_ _(none)_
- `the ! badge marks model expectations outside the simultaneous bounds` — e2e/claims.spec.ts:502
    - :508 `toBe` expected `r.expected < r.ciLo || r.expected > r.ciHi` _(expression)_
    - :510 `toHaveLength` expected `1` _(literal)_
    - :511 `toHaveAttribute` expected `'title', /outside the simultaneous confidence bounds/` _(expression)_
    - :513 `toBe` expected `true` _(expression)_
- `sparse supported lossy run is inconclusive and all confidence displays agree` — e2e/claims.spec.ts:516
    - :518 `toEqual` expected `[4, 10, 5, 6]` _(expression)_
    - :519 `toBe` expected `'Inconclusive'` _(literal)_
    - :520 `toBeCloseTo` expected `3.8` _(literal)_
    - :523 `expect` expected _no expected value_ _(none)_
    - :524 `expect` expected _no expected value_ _(none)_
    - :525 `expect` expected _no expected value_ _(none)_
    - :526 `toBe` expected `true` _(expression)_
- `unobserved settings show full bounds and never a fabricated CHSH estimate` — e2e/claims.spec.ts:529
    - :532 `toBe` expected `'Inconclusive'` _(literal)_
    - :533 `expect` expected _no expected value_ _(none)_
    - :534 `expect` expected _no expected value_ _(none)_
    - :535 `expect` expected _no expected value_ _(none)_
    - :536 `expect` expected _no expected value_ _(none)_
    - :537 `expect` expected _no expected value_ _(none)_
    - :539 `toBe` expected `0` _(literal)_
    - :540 `toBe` expected `true` _(expression)_
    - :541 `toBe` expected `true` _(expression)_
    - :542 `toEqual` expected `[-1, 1]` _(expression)_
    - :543 `toBe` expected `false` _(expression)_
    - :545 `toBeHidden` expected _no expected value_ _(none)_
    - :548 `toContainText` expected `'CSV copied'` _(literal)_
    - :550 `expect` expected _no expected value_ _(none)_
    - :551 `expect` expected _no expected value_ _(none)_
    - :552 `expect` expected _no expected value_ _(none)_
    - :553 `expect` expected _no expected value_ _(none)_
    - :554 `toMatch` expected `/NaN|Infinity/` _(regex)_
- `transcript rows are internally consistent and off by default` — e2e/claims.spec.ts:559
    - :561 `toHaveLength` expected `0` _(literal)_
    - :564 `toHaveLength` expected `50` _(literal)_
    - :580 `expect` expected _no expected value_ _(none)_
    - :582 `expect` expected _no expected value_ _(none)_
    - :587 `expect` expected _no expected value_ _(none)_
    - :588 `expect` expected _no expected value_ _(none)_
    - :589 `toBe` expected `A * B` _(expression)_
    - :593 `toMatch` expected `/^a[12] · (0|45)°$/` _(regex)_
    - :595 `toMatch` expected `/^b[12] · (37|-8)°$/` _(regex)_
    - :598 `toBe` expected `'key'` _(literal)_
    - :599 `toBe` expected `'key · 45°'` _(literal)_
    - :600 `toBe` expected `'key · 60°'` _(literal)_
    - :603 `toBe` expected `50` _(literal)_
    - :604 `expect` expected _no expected value_ _(none)_
    - :605 `expect` expected _no expected value_ _(none)_
- `the copied link reproduces the exact run` — e2e/claims.spec.ts:610
    - :613 `expect` expected _no expected value_ _(none)_
    - :620 `toContainText` expected `'Link copied'` _(literal)_
    - :622 `expect` expected _no expected value_ _(none)_
    - :623 `expect` expected _no expected value_ _(none)_
    - :624 `expect` expected _no expected value_ _(none)_
    - :628 `expect` expected _no expected value_ _(none)_
    - :632 `toBe` expected `before.headline` _(expression)_
    - :633 `toBe` expected `sNumbers(before).absS` _(expression)_
    - :634 `toEqual` expected `before.rows.map((r) => r.measured)` _(expression)_
    - :635 `toBe` expected `before.keyLine` _(expression)_
- `the exported CSV carries the same numbers the page shows` — e2e/claims.spec.ts:638
    - :642 `toContainText` expected `'CSV copied'` _(literal)_
    - :647 `expect` expected _no expected value_ _(none)_
    - :650 `toBe` expected `'eve'` _(literal)_
    - :651 `toBe` expected `'below-classical-bound'` _(literal)_
    - :652 `toBe` expected `'Below classical bound'` _(literal)_
    - :656 `toBe` expected `c.requested` _(expression)_
    - :657 `toBe` expected `c.coincidences` _(expression)_
    - :658 `toBeCloseTo` expected `n.absS, 3` _(expression)_
    - :659 `toBeCloseTo` expected `n.seS, 4` _(expression)_
    - :660 `toBe` expected `2` _(literal)_
    - :661 `toBeCloseTo` expected `TSIRELSON, 9` _(expression)_
    - :662 `toBeCloseTo` expected `keyNumbers(s).measuredPct, 2` _(expression)_
    - :667 `expect` expected _no expected value_ _(none)_
    - :668 `toBeCloseTo` expected `row.measured, 3` _(expression)_
    - :669 `toBeCloseTo` expected `row.se, 4` _(expression)_
    - :670 `toBe` expected `row.n` _(expression)_
- `scenario strip offers all five channel models and each re-runs the sim` — e2e/claims.spec.ts:676
    - :678 `expect` expected _no expected value_ _(none)_
    - :680 `toHaveCount` expected `5` _(literal)_
    - :681 `toHaveText` expected `[/Ideal/, /Eve/, /Noisy/, /Misaligned/, /Lossy/]` _(expression)_
    - :692 `toHaveText` expected `exp.heading` _(expression)_
    - :693 `toHaveCount` expected `exp.knob ? 1 : 0` _(expression)_
    - :694 `expect` expected _no expected value_ _(none)_
    - :699 `expect` expected _no expected value_ _(none)_
- `the noise slider distinguishes insufficient violation evidence, secure and compromised` — e2e/claims.spec.ts:703
    - :705 `expect` expected _no expected value_ _(none)_
    - :710 `toBe` expected `'Inconclusive'` _(literal)_
    - :715 `toBe` expected `'Bell violation observed'` _(literal)_
    - :720 `toHaveText` expected `'0.50'` _(literal)_
    - :723 `toBe` expected `'Below classical bound'` _(literal)_
    - :724 `expect` expected _no expected value_ _(none)_
    - :725 `expect` expected _no expected value_ _(none)_
- `the rounds control changes the sample size and tightens the interval` — e2e/claims.spec.ts:728
    - :730 `expect` expected _no expected value_ _(none)_
    - :735 `toBe` expected `2000` _(literal)_
    - :741 `toBe` expected `20000` _(literal)_
    - :742 `expect` expected _no expected value_ _(none)_
    - :748 `toBe` expected `1000` _(literal)_
- `the explainer matches the engine: curve points, protocol steps, comparison table` — e2e/claims.spec.ts:754
    - :758 `expect` expected _no expected value_ _(none)_
    - :763 `toHaveLength` expected `4` _(literal)_
    - :766 `toEqual` expected `ideal.rows.map((r) => r.expected)` _(expression)_
    - :767 `expect` expected _no expected value_ _(none)_
    - :770 `toHaveCount` expected `5` _(literal)_
    - :772 `toHaveCount` expected `6` _(literal)_
    - :773 `toContainText` expected _no expected value_ _(none)_
    - :776 `toContainText` expected `'CHSH parameter'` _(literal)_
    - :777 `toContainText` expected _no expected value_ _(none)_
    - :780 `toContainText` expected _no expected value_ _(none)_
    - :784 `toContainText` expected `'assigns each round to a shared 45° key setting'` _(literal)_
    - :785 `toContainText` expected `'neither outcome alone proves key security'` _(literal)_
    - :786 `toContainText` expected `'candidate sifted bits'` _(literal)_
    - :787 `toContainText` expected `'privacy amplification'` _(literal)_
    - :788 `toContainText` expected `'not undergone reconciliation, privacy amplification'` _(literal)_
    - :790 `toContainText` expected `'Bob independently picks a measurement basis'` _(literal)_
    - :791 `toContainText` expected `'simple intercept-resend Eve has to guess'` _(literal)_
    - :792 `toContainText` expected `'Eve\'s presence shows up'` _(literal)_
    - :793 `toContainText` expected `'Bell-test outcome itself certifies the devices'` _(literal)_
    - :796 `toHaveCount` expected `6` _(literal)_
    - :798 `toHaveCount` expected `1` _(literal)_
    - :800 `toHaveCount` expected `13` _(literal)_
    - :801 `toHaveAttribute` expected _no expected value_ _(none)_
    - :805 `toHaveAttribute` expected _no expected value_ _(none)_
    - :809 `toContainText` expected `'Does not model'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-e91

## What It Is

An interactive simulation of **E91 (Ekert 1991)**, the entanglement-based quantum key distribution protocol. A source emits polarization-entangled photon pairs in the singlet state; Alice and Bob each measure their half at independently chosen analyzer angles; the joint statistics are checked against the **CHSH form of Bell's inequality**. Quantum mechanics allows |S| to reach the **Tsirelson bound 2√2 ≈ 2.828**, while any classical (local hidden-variable) theory is stuck at |S| ≤ 2. The modeled intercept-resend attack destroys the violation; observing or losing a violation alone is not a secret-key security verdict.

The protocol is the cousin of BB84 in the sibling [`crypto-lab-bb84`](https://systemslibrarian.github.io/crypto-lab-bb84/) demo. This page contrasts their tests: BB84 estimates bit errors; E91 estimates a Bell statistic. The engine is implemented from scratch in TypeScript using the standard textbook quantum-mechanical predictions for the singlet state, plus three additional channel models (depolarizing noise, analyzer misalignment, photon loss) so the demo can show **that a missing 2√2 is not by itself proof of an eavesdropper** — noise and calibration error can produce the same signature.

This is an **idealized educational simulation**, not a model of real photon-counting hardware. There is no detector dark-count model, no finite-key correction, no decoy-state analysis, no side-channel attacks. The math you see is the standard textbook math, decorated with sample-size-aware statistics (descriptive plug-in standard errors and conservative joint confidence bounds on |S|) so the Bell-test outcome depends on the data rather than a hard-coded threshold.

## When to Use It

- **Teaching how entanglement detects eavesdroppers** — the singlet's correlation exceeds anything a classical theory can produce, and Eve's measurement drags it back to classical.
- **Comparing E91 and BB84** — both distribute candidate key bits and sample correlations or errors. BB84 uses QBER to test disturbance; E91 tests CHSH correlations. Neither statistic by itself establishes a secret key.
- **Introducing CHSH, Tsirelson's bound, and Bell-test statistics** — including the lesson that the answer is a confidence interval, not a single number.
- **Distinguishing attack from ordinary degradation** — noise and misalignment can reduce |S| without Eve; independent, fair loss retains the expected correlation while reducing the sample and widening its interval.
- **Setting up device-independent QKD intuition** — DI-QKD descends directly from E91, but a Bell violation alone is insufficient for the key-security guarantee of a specific protocol.
- **Do NOT** use this as a model of a real quantum channel. It is faithful to the textbook idealization, not to lab hardware.
- **Do NOT** confuse QKD with post-quantum cryptography. QKD addresses *key distribution* over a quantum channel; it does not replace the larger PQC migration story (see the rest of the suite for that).

## Live Demo

**[systemslibrarian.github.io/crypto-lab-e91](https://systemslibrarian.github.io/crypto-lab-e91/)**

Inside the page:

- **Scenario chip strip** — five channel models you can flip between: ideal, intercept-resend Eve, depolarizing noise, misaligned analyzer, lossy channel. Each scenario has a one-line story and an expectation for |S| and key agreement; the parameterised ones (noise level, misalignment angle, detection efficiency) expose a slider.
- **Selective detection** — a separate exact eight-instruction local classical model compares all emitted rounds (|S| = 2) with a biased two-click sample (apparent |S| = 4, with only 25% of each setting pair retained). The detector gates use only local settings and a shared preassigned instruction. It illustrates the fair-sampling assumption, not a real-device attack or a QKD security proof.
- **Statistical Bell-test panel** — Bell violation observed / below classical bound / inconclusive, with the 95% interval for |S| spelled out. These labels classify the modeled Bell test, not a key.
- **CHSH gauge with confidence band** — visual marker for the measured |S|, dashed CI box, and labelled ticks at the classical bound (2) and Tsirelson's bound (2√2).
- **Expected vs measured correlation table** — the four E(aᵢ,bⱼ) with their theoretical value, measured value, simultaneous confidence bounds, descriptive plug-in standard error, and sample size. A `!` badge marks a model expectation outside the simultaneous bounds.
- **Candidate sifted-bit panel** — Alice / Bob bit strings from the dedicated 45° key setting, per-bit agreement coloring, measured vs expected agreement percentage. The bits are not a final secret key.
- **Round-by-round transcript (optional)** — first 50 rounds with bucket (CHSH / key), analyzer indices, angles in degrees, ±1 outcomes, and the product A·B.
- **The Bell test explained** — concept cards, the singlet correlation curve E(Δ) = −cos(2Δ) with CHSH points marked, and the five-step protocol flow.
- **E91 vs BB84** — six-row comparison table linking the sibling demo.
- **In the real world** — Bell (1964), Aspect (1982), Ekert (1991), loophole-free Bell (2015), Micius (2017), device-independent QKD (2022).
- **Sources & further reading** — primary references with DOIs, plus a "what this simulation does and does not model" caveat box.

**Shareable runs**: the rounds, scenario, scenario knob value, seed, and transcript flag are mirrored to the URL hash. The "Copy link to this run" button gives you a deterministic URL that reproduces the exact run; "Copy results (CSV)" exports the summary and transcript to clipboard.

## What Can Go Wrong

- **A missing 2√2 is ambiguous.** A measured |S| below the classical bound can be caused by an eavesdropper *or* by ordinary noise, misalignment, or loss; from |S| alone you cannot tell which, so a degraded key is discarded either way.
- **A Bell pass is not a key.** The five-step panel displays candidate sifted bits from a preselected shared 45° setting and tests separate CHSH rounds. Its confidence interval addresses the modeled correlations under independent-trial and fair-sampling assumptions; it neither certifies an untrusted source nor establishes a finite-key secret. Real QKD needs authenticated public discussion, error reconciliation, privacy amplification with an entropy bound, and a security proof for its devices and protocol.
- **Finite-key effects.** Real E91 needs finite-key security corrections and enough rounds for the CI to tighten; a small sample can leave the verdict inconclusive or misleading (this demo models the statistics but not full finite-key proofs).
- **Detector side-channels (real hardware).** Physical implementations face detector-blinding, timing, and efficiency-loophole attacks that an idealized simulation does not capture.
- **Unauthenticated classical channel.** The public discussion/sifting channel must be authenticated; without it, a man-in-the-middle can defeat QKD regardless of the Bell test.
- **The detection-efficiency (loss) loophole.** Low detection efficiency can let a local hidden-variable model fake a Bell violation, so loss must be accounted for in any real security claim.
- **Fair loss and selective loss differ.** The channel slider discards pairs independently of settings and outcomes, which leaves expected |S| unchanged. The separate exact classical model filters coincidences by local detector rules and can fake an apparent violation on a biased subset. See [Larsson, *Loopholes in Bell Inequality Tests of Local Realism* (2014)](https://arxiv.org/abs/1407.0363); a loophole-aware protocol must handle missing rounds, and real device-independent QKD needs much more than this comparison.

## Real-World Usage

- **Device-independent QKD.** E91 is a conceptual ancestor of DI-QKD. Formal security also depends on the protocol, observed errors, reconciliation, finite-key bounds and physical assumptions; a violation by itself is not sufficient.
- **Entanglement-based QKD experiments.** Laboratory and field demonstrations distribute entangled photon pairs and verify CHSH violation as the security test.
- **Satellite QKD.** The Micius satellite distributed entangled photons over ~1200 km, demonstrating entanglement-based key distribution at intercontinental scale.
- **Loophole-free Bell tests.** Experiments such as Hensen et al. (2015) closed the detection and locality loopholes, underpinning the security argument E91 relies on.
- **Bell-test-certified randomness.** The same Bell-violation certificate used in E91 is used to certify randomness in device-independent randomness expansion.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-e91
cd crypto-lab-e91
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-bb84](https://systemslibrarian.github.io/crypto-lab-bb84/) — the sibling QKD protocol whose alarm is QBER from no-cloning, not a Bell violation.
- [crypto-lab-shor](https://systemslibrarian.github.io/crypto-lab-shor/) — Shor's algorithm, the quantum attack that motivates quantum-safe key distribution.
- [crypto-lab-grover](https://systemslibrarian.github.io/crypto-lab-grover/) — Grover's algorithm and quantum search against symmetric keys.
- [crypto-lab-pq-families](https://systemslibrarian.github.io/crypto-lab-pq-families/) — the five post-quantum families, the computational alternative to QKD.

## Statistical interpretation of S

The CHSH parameter `S = E(a₁,b₁) + E(a₁,b₂) + E(a₂,b₁) − E(a₂,b₂)` combines four sample means. Each ±1 product becomes a Bernoulli observation via `X = (A·B + 1)/2`. Hoeffding's inequality gives `P(|p̂ − p| > ε) ≤ 2 exp(−2nε²)`. Allocate `.05/4` error to each setting, choose `ε = √(ln(160)/(2n))`, and transform `p̂ ± ε` back to correlation bounds, intersected with the known domain `[-1,1]`.

The union bound gives **at least 95% simultaneous coverage** of all four correlations. Add the first three lower/upper endpoints and subtract the fourth upper/lower endpoints to get signed S bounds; then map that whole interval through absolute value, using zero as the lower bound if it crosses zero. This is a conservative finite-sample interval, not a clipped Wald approximation or a claim of exactly 95% coverage. All-identical finite samples keep nonzero width. An unobserved setting retains `[-1,1]`; its measured value and standard error are unobserved, exported as empty CSV cells, and the verdict is inconclusive. The gauge spans the algebraic bound 4, so a sparse estimate above the expected quantum bound remains visible.

The Bell-test outcome compares these bounds with 2: “Bell violation observed” requires the lower bound above 2, “Below classical bound” the upper bound below 2, and “Inconclusive” otherwise or whenever a setting is missing. Noise and misalignment can lose the violation too; this does not identify Eve. The engine retains legacy internal identifiers `secure` and `compromised` for compatibility; they mean only the stated interval comparison. CSV exports use `bell_test_outcome` and scoped values. The retained plug-in `SE(E) = √((1 − E²)/n)` and root-sum-square `SE(S)` are descriptive, never confidence radii. A zero plug-in SE is not certainty.

Coverage assumes independent observations in a **fixed run**, conditioned on setting counts with the simulator's setting/outcome-independent loss. It does not apply to arbitrary detector selection, adversarial device memory, or repeatedly testing until a favorable result appears. Seeded runs are reproducible controls, not random coverage experiments. This remains a teaching model, not a finite-key or device-independent QKD security proof. See [Bartlett's lecture 12, §4.2](https://people.eecs.berkeley.edu/~bartlett/courses/281b-sp08/12.pdf) for the concentration bound.

## Testing

`scripts/engine.test.mjs` is the source of truth. It covers:

- The singlet correlation function returns textbook values.
- The theoretical S for each scenario matches the textbook closed form (`2√2`, `√2` under intercept-resend at π/8, `(1−p)·2√2` under depolarizing noise, `2√2·cos(2δ)` under misalignment, and unchanged under loss).
- The theoretical key agreement at aligned bases matches its closed form per scenario.
- `runE91` converges to the predicted |S| within 0.05 for 30k seeded rounds across all five scenarios.
- The confidence-aware Bell-test outcome classifies seeded runs on opposite sides of the classical bound, and the legacy `eve: true / false` flag still selects the right scenario.
- The transcript respects its cap, labels CHSH vs key buckets, and records consistent product = A·B.
- Joint confidence bounds stay nondegenerate at finite all-identical samples; missing/partial settings and the supported sparse-loss example are inconclusive. Exact binomial enumeration checks the per-setting noncoverage budget over small sample sizes; this numerical control supplements the Hoeffding/union-bound derivation. Impossible counts are rejected.
- Per-correlation descriptive standard errors and S confidence bounds are populated; browser controls check table/verdict/gauge/CSV agreement, algebraic limits and model-discrepancy badges.
- `effectiveRounds` for the lossy channel matches `rounds · η²` to within sampling noise.
- `resolveScenario` accepts both ID strings and partial-override objects.

One workflow does both. `.github/workflows/deploy.yml` has a `build` job that runs `npm test`, `npm run build` and the Chromium accessibility gate on every push and pull request, and a `deploy` job that ships `dist/` to GitHub Pages on push to `main` and names `build` in `needs:`. The Dependabot auto-merge names the same job, so a bump cannot merge against a lighter gate than the one the deploy runs.

## Sources

Primary references are also listed on the live page with DOIs. The most load-bearing:

- J. S. Bell. *On the Einstein Podolsky Rosen paradox.* Physics 1, 195 (1964).
- J. F. Clauser, M. A. Horne, A. Shimony, R. A. Holt. *Proposed experiment to test local hidden-variable theories.* PRL 23, 880 (1969).
- B. S. Cirel'son. *Quantum generalizations of Bell's inequality.* Lett. Math. Phys. 4, 93 (1980).
- A. K. Ekert. *Quantum cryptography based on Bell's theorem.* PRL 67, 661 (1991).
- B. Hensen et al. *Loophole-free Bell inequality violation.* Nature 526, 682 (2015).
- J. Yin et al. *Satellite-based entanglement distribution over 1200 km.* Science 356, 1140 (2017).
- D. P. Nadlinger et al. *Experimental QKD certified by Bell's theorem.* Nature 607, 682 (2022).
- W. Zhang et al. *A device-independent QKD system for distant users.* Nature 607, 687 (2022).

Standard textbook treatment: Nielsen & Chuang, *Quantum Computation and Quantum Information* (Cambridge), Chapters 2 and 12. For QKD security proofs beyond the idealization, see Renner's 2005 thesis [`arxiv.org/abs/quant-ph/0512258`](https://arxiv.org/abs/quant-ph/0512258).

For why nonlocality alone does not imply a key from standard device-independent protocols, see Farkas et al., [*Bell Nonlocality Is Not Sufficient for the Security of Standard Device-Independent Quantum Key Distribution Protocols*](https://doi.org/10.1103/PhysRevLett.127.050503), *Physical Review Letters* 127, 050503 (2021). Their result is conditional on the protocols and reconciliation studied; it does not say that all DI-QKD is impossible.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## DH MITM

- **slug**: `crypto-lab-diffie-hellman-mitm`
- **repo**: https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm
- **live**: https://systemslibrarian.github.io/crypto-lab-diffie-hellman-mitm/
- **commit_sha**: `c653b982370b81eebe38c216b45edf7497ae4df8` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | ATTACKS  ·  **level**: intermediate  ·  **--accent**: #92400e
- **MISSING FIELDS**: mutations, verification, limitations

**Name (H1)**: Diffie–Hellman & MITM  — _read from src/ui.ts_

**Subtitle**: Key exchange · Man-in-the-middle  — _read from src/ui.ts_

**Description**: Run a live Diffie–Hellman exchange, break it by discrete log on toy primes, then watch an active attacker split it into two keys — and stop her by signing the handshake.  — _read from src/ui.ts_

**Why it matters**: Unauthenticated DH secures nearly every handshake on the internet, yet an attacker who can alter messages defeats it without breaking any math. That is why TLS, SSH, and Signal authenticate their key exchange — the fix is identity, not bigger numbers.  — _read from src/ui.ts_

**Card copy**: Interactive Diffie-Hellman key exchange, then a live man-in-the-middle attack on the unauthenticated channel that shows why raw DH needs authentication. Real modular arithmetic. No backend.

**Chips**: Diffie-Hellman · Modular Arithmetic · MITM · Key Exchange

**Implements**: AES `src/engine.ts:396`, AES-GCM `src/engine.ts:396`, Baby-step giant-step `src/engine.ts:135`, Diffie-Hellman `src/engine.ts:99`, ECDSA `src/engine.ts:291`, P-256 `src/engine.ts:291`, SHA-256 `src/engine.ts:329`

**Attacks shown**: Brute force `src/engine.ts:520`, Discrete log `src/engine.ts:135`, Man-in-the-middle `src/engine.ts:235`

**Comment-only (named in code comments, not executed)**: HKDF `src/engine.ts:382`, Miller–Rabin `src/engine.ts:53`, TLS 1.3 `src/engine.ts:276`

**References**: ECDH, Index calculus, OPAQUE, TLS 1.3, X25519, X3DH

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `CRYPTO 2003` — first seen src/ui.ts:768 (1×)
- `FIPS 186-5` — first seen src/ui.ts:774 (1×)
- `FIPS 203` — first seen README.md:36 (1×)
- `NIST SP 800-57` — first seen src/ui.ts:346 (1×)
- `RFC 3526` — first seen README.md:19 (4×)
- `RFC 7748` — first seen src/ui.ts:771 (1×)
- `RFC 9846` — first seen src/ui.ts:770 (1×)
- `rfc3526` — first seen src/ui.ts:769 (1×)
- `rfc7748` — first seen src/ui.ts:771 (1×)
- `rfc9846` — first seen src/ui.ts:770 (1×)

**Claims tested** (e2e/claims.spec.ts, 19 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:30
    - :30 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:113
    - :113 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:152
    - :152 `toHaveText` expected `'Step 6 of 6'` _(literal)_
- `honest exchange: the two rendered shared secrets are the same number, and it is g^ab mod p` — e2e/claims.spec.ts:157
    - :179 `toBe` expected `fromBob` _(expression)_
    - :180 `toHaveClass` expected `/status--ok/` _(regex)_
    - :181 `toContainText` expected `'same shared secret'` _(literal)_
    - :184 `toBe` expected `preset.bits` _(expression)_
    - :185 `toBe` expected `modPow(g, a, p)` _(expression)_
    - :186 `toBe` expected `modPow(g, b, p)` _(expression)_
    - :187 `toBe` expected `modPow(B, a, p)` _(expression)_
    - :188 `toBe` expected `modPow(A, b, p)` _(expression)_
    - :190 `toBe` expected `A` _(expression)_
    - :191 `toBe` expected `B` _(expression)_
    - :196 `expect` expected _no expected value_ _(none)_
- `the hero worked example and Part 2 default run render the same p=23 numbers` — e2e/claims.spec.ts:199
    - :208 `toBe` expected `'6'` _(literal)_
    - :209 `toBe` expected `'15'` _(literal)_
    - :210 `toBe` expected `heroA` _(expression)_
    - :211 `toBe` expected `heroB` _(expression)_
    - :212 `toBe` expected `heroShared` _(expression)_
    - :213 `toBe` expected `heroShared` _(expression)_
    - :215 `toBe` expected `modPow(5n, 6n * 15n, 23n)` _(expression)_
- `BSGS scaling prose follows the square-root law on the chart and attack panel` — e2e/claims.spec.ts:220
    - :225 `toHaveCount` expected `0` _(literal)_
    - :226 `toContainText` expected `'baby-step giant-step'` _(literal)_
    - :235 `toContainText` expected `/extra two bits of the modulus roughly double/` _(regex)_
    - :236 `toContainText` expected `/one extra bit multiplies (?:it|the work) by about √2/` _(regex)_
    - :237 `toContainText` expected `/extra bit of the modulus roughly doubles/` _(regex)_
    - :241 `toContainText` expected `'number field sieve'` _(literal)_
    - :242 `toContainText` expected `'sub-exponential'` _(literal)_
    - :243 `toContainText` expected `'112 bits'` _(literal)_
- `the discrete-log break recovers the exponent that was typed, and its step count decomposes into the cost table it prints` — e2e/claims.spec.ts:246
    - :272 `toBe` expected `exponents[preset.id]` _(expression)_
    - :273 `toBe` expected `A` _(expression)_
    - :274 `toHaveClass` expected `/status--alarm/` _(regex)_
    - :282 `toBe` expected `preset.bits` _(expression)_
    - :283 `toBe` expected `'breakable here'` _(literal)_
    - :284 `expect` expected _no expected value_ _(none)_
    - :285 `expect` expected _no expected value_ _(none)_
- `the 2048-bit group refuses the break, and every surface quotes the same work factor` — e2e/claims.spec.ts:289
    - :299 `toBe` expected `'infeasible'` _(literal)_
    - :308 `toBeDisabled` expected _no expected value_ _(none)_
    - :310 `toMatch` expected `/Disabled: at 2048 bits/` _(regex)_
    - :316 `toBe` expected `tableExp` _(expression)_
    - :317 `toBe` expected `tableExp` _(expression)_
    - :320 `toContainText` expected `'same shared secret'` _(literal)_
- `the chart description a screen reader hears quotes the same work factors as the bars it describes` — e2e/claims.spec.ts:323
    - :334 `toHaveLength` expected `4` _(literal)_
    - :340 `toHaveLength` expected `4` _(literal)_
    - :346 `toBe` expected `spoken[i]!.exp` _(expression)_
    - :347 `expect` expected _no expected value_ _(none)_
    - :356 `expect` expected _no expected value_ _(none)_
    - :357 `expect` expected _no expected value_ _(none)_
    - :359 `expect` expected _no expected value_ _(none)_
- `MITM: Alice shares her key with Mallory, Bob shares a different one, and no key is shared between Alice and Bob` — e2e/claims.spec.ts:366
    - :388 `toBe` expected `kMalloryAlice` _(expression)_
    - :389 `toBe` expected `kMalloryBob` _(expression)_
    - :390 `toBe` expected `kBob` _(expression)_
    - :393 `toBe` expected `B` _(expression)_
    - :394 `toBe` expected `A` _(expression)_
    - :395 `expect` expected _no expected value_ _(none)_
    - :396 `expect` expected _no expected value_ _(none)_
    - :401 `toBe` expected `modPow(g, 1751n, p)` _(expression)_
    - :402 `toBe` expected `modPow(g, 998n, p)` _(expression)_
    - :403 `toBe` expected `modPow(g, 333n, p)` _(expression)_
    - :404 `toBe` expected `modPow(g, 777n, p)` _(expression)_
    - :405 `toBe` expected `modPow(M1, 1751n, p)` _(expression)_
    - :406 `toBe` expected `modPow(M2, 998n, p)` _(expression)_
    - :410 `toBe` expected `kAlice` _(expression)_
    - :411 `toBe` expected `kBob` _(expression)_
    - :412 `toHaveCount` expected `2` _(literal)_
    - :413 `toHaveClass` expected `/status--alarm/` _(regex)_
    - :414 `toContainText` expected `"Alice's key ≠ Bob's key"` _(literal)_
- `the relay really encrypts: Mallory reads the plaintext, swaps it, and Bob cannot open Alice’s own ciphertext` — e2e/claims.spec.ts:417
    - :430 `expect` expected _no expected value_ _(none)_
    - :431 `expect` expected _no expected value_ _(none)_
    - :432 `expect` expected _no expected value_ _(none)_
    - :435 `expect` expected _no expected value_ _(none)_
    - :439 `expect` expected _no expected value_ _(none)_
    - :440 `toHaveClass` expected `/key-card--alarm/` _(regex)_
    - :441 `toContainText` expected `'AES-GCM tag check just failed'` _(literal)_
    - :442 `toHaveClass` expected `/status--alarm/` _(regex)_
    - :446 `toHaveLength` expected `2` _(literal)_
    - :447 `toBe` expected `sealed[1]` _(expression)_
    - :448 `toMatch` expected `/^iv=[0-9a-f]{8}… · ct=[0-9a-f]{24}…$/` _(regex)_
    - :451 `toBeEnabled` expected _no expected value_ _(none)_
- `when the chosen exponents make the two keys collide, BOTH panels say so and neither claims a split` — e2e/claims.spec.ts:454
    - :464 `toBe` expected `leadingBigInt(bobKey!)` _(expression)_
    - :465 `toHaveClass` expected `/status--info/` _(regex)_
    - :466 `toContainText` expected `'happened to collide'` _(literal)_
    - :467 `toHaveCount` expected `0` _(literal)_
    - :475 `expect` expected _no expected value_ _(none)_
    - :476 `expect` expected _no expected value_ _(none)_
    - :477 `toContainText` expected `'the split never happened'` _(literal)_
    - :478 `toContainText` expected `'AES-GCM tag check just failed'` _(literal)_
- `signed handshake (honest): the signature verifies, Bob proceeds, and the signed shares are the ones Part 3 puts on the wire` — e2e/claims.spec.ts:483
    - :500 `toBe` expected `'true'` _(literal)_
    - :501 `toBe` expected `'yes'` _(literal)_
    - :502 `toHaveClass` expected `/status--ok/` _(regex)_
    - :503 `toContainText` expected `'Bob accepts'` _(literal)_
    - :510 `toBe` expected `signedSelf` _(expression)_
    - :511 `toBe` expected `signedPeer` _(expression)_
    - :512 `expect` expected _no expected value_ _(none)_
    - :515 `toBe` expected `leadingBigInt(aliceSends!).toString()` _(expression)_
    - :516 `toBe` expected `leadingBigInt(bobSends!).toString()` _(expression)_
    - :517 `toBe` expected `modPow(2n, 1751n, 2357n)` _(expression)_
- `signed handshake (tampered): verification fails closed, the cause is named, and the substituted share is exactly the value Part 3 shows Mallory sending` — e2e/claims.spec.ts:520
    - :534 `toBe` expected `'false'` _(literal)_
    - :535 `toBe` expected `'no — aborted'` _(literal)_
    - :536 `toContainText` expected `'man-in-the-middle is detected'` _(literal)_
    - :537 `toContainText` expected `'aborts'` _(literal)_
    - :539 `toHaveClass` expected `/status--ok/` _(regex)_
    - :549 `toBe` expected `signedSelf` _(expression)_
    - :550 `toBe` expected `signedPeer` _(expression)_
    - :551 `expect` expected _no expected value_ _(none)_
    - :553 `toBe` expected `malloryShare` _(expression)_
    - :554 `toBe` expected `modPow(2n, 333n, 2357n)` _(expression)_
    - :560 `toBe` expected `'true'` _(literal)_
- `REGRESSION: re-running the attack retires the relay that was encrypted under the old keys` — e2e/claims.spec.ts:565
    - :576 `toContainText` expected `'the split never happened'` _(literal)_
    - :582 `toBe` expected `leadingBigInt(bobKey!)` _(expression)_
    - :583 `toContainText` expected `'Attack succeeded'` _(literal)_
    - :589 `toContainText` expected `'the split never happened'` _(literal)_
    - :590 `toContainText` expected `'believes Alice said'` _(literal)_
    - :591 `toContainText` expected `'Send through Mallory'` _(literal)_
    - :592 `toHaveCount` expected `0` _(literal)_
    - :601 `toHaveCount` expected `0` _(literal)_
- `REGRESSION: a verdict does not outlive the exponent it names` — e2e/claims.spec.ts:604
    - :611 `toContainText` expected `"Recovered Alice's secret: a = 6"` _(literal)_
    - :615 `toHaveAttribute` expected `'data-stale', 'true'` _(expression)_
    - :617 `toBeVisible` expected _no expected value_ _(none)_
    - :618 `toContainText` expected `'Run exchange'` _(literal)_
    - :624 `toHaveAttribute` expected `'data-stale', 'true'` _(expression)_
    - :625 `toHaveCount` expected `0` _(literal)_
    - :626 `toBe` expected `modPow(5n, 7n, 23n)` _(expression)_
    - :635 `toHaveAttribute` expected `'data-stale', 'true'` _(expression)_
    - :636 `toHaveAttribute` expected `'data-stale', 'true'` _(expression)_
    - :637 `toContainText` expected `'Run the attack'` _(literal)_
    - :638 `toContainText` expected `'Send through Mallory'` _(literal)_
    - :645 `toHaveAttribute` expected `'data-stale', 'true'` _(expression)_
    - :647 `toHaveAttribute` expected `'data-stale', 'true'` _(expression)_
    - :648 `toHaveAttribute` expected `'data-stale', 'true'` _(expression)_
- `REGRESSION: the hidden attribute actually hides — author display rules do not beat it` — e2e/claims.spec.ts:651
    - :662 `toEqual` expected `[]` _(expression)_
    - :693 `toEqual` expected `[]` _(expression)_
- `out-of-range and non-numeric exponents are clamped into [1, p-2] and the exchange still agrees with the clamped value` — e2e/claims.spec.ts:698
    - :717 `toBe` expected `c.expect` _(expression)_
    - :720 `toBe` expected `modPow(5n, BigInt(c.expect), 23n)` _(expression)_
    - :721 `toBe` expected `BigInt(kv['Bob: Aᵇ mod p']!.full)` _(expression)_
    - :722 `toHaveClass` expected `/status--ok/` _(regex)_
- `every control stays live across a full session` — e2e/claims.spec.ts:726
    - :731 `toBeDisabled` expected _no expected value_ _(none)_
    - :732 `toBeEnabled` expected _no expected value_ _(none)_
    - :734 `toBeEnabled` expected _no expected value_ _(none)_
    - :738 `toHaveText` expected `'Step 1 of 6'` _(literal)_
    - :739 `toBeDisabled` expected _no expected value_ _(none)_
    - :740 `toBeEnabled` expected _no expected value_ _(none)_
    - :747 `toBeEnabled` expected _no expected value_ _(none)_
    - :753 `toBeDisabled` expected _no expected value_ _(none)_
    - :757 `toBeEnabled` expected _no expected value_ _(none)_
    - :758 `toBeEnabled` expected _no expected value_ _(none)_
    - :765 `toBeEnabled` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-diffie-hellman-mitm

## What It Is

An interactive lesson on the **Diffie–Hellman key exchange** and the **man-in-the-middle attack** that breaks it when it is left unauthenticated. Diffie–Hellman solves a single problem: two parties who have never met agree on a shared secret over a channel anyone can read, using the hardness of the **discrete-logarithm problem** in the multiplicative group Z_p\*. Its security model is precise and narrow — it defeats a *passive* eavesdropper, but it provides **no authentication**, so an *active* attacker who can modify messages can run two separate exchanges and sit in the middle. Every number in the demo is real, hand-rolled BigInt modular arithmetic (no faked math), and the discrete-log break and the ECDSA-signed fix both actually run in your browser. The toy primes exist only so the attack is fast enough to watch; this is a teaching tool, not a library.

## When to Use It

- **Teaching why "secure key exchange" needs authentication** — the demo shows the math is fine and the *protocol* is what fails, which is the point students most often miss.
- **Explaining the passive-vs-active attacker distinction** — run the discrete-log break (passive, defeated at real sizes) right next to the MITM (active, defeated only by signatures) to make the contrast concrete.
- **Briefing engineers before they touch a handshake** — make it visceral that raw, unauthenticated (EC)DH must be wrapped in signatures, certificates, or a PAKE.
- **Showing the cost curve of discrete log** — the break runs in milliseconds on the 5-, 12- and 20-bit presets and is left disabled on the real 2048-bit group, illustrating why bigger parameters stop the eavesdropper but never the man in the middle. The page is explicit that √p is the cost of *baby-step giant-step specifically*: real finite-field DH is bounded by the sub-exponential number field sieve (≈ L_p[1/3]), which is why a 2048-bit group rates ~112-bit security and why Logjam's per-prime precomputation worked.
- **Do NOT use it as a crypto library** — the primes are deliberately tiny and breakable, and rolling your own key exchange is exactly the mistake the lesson warns against. In production use a vetted implementation of an authenticated protocol (TLS 1.3, the Signal protocol, SSH, Noise).

## Live Demo

**[systemslibrarian.github.io/crypto-lab-diffie-hellman-mitm](https://systemslibrarian.github.io/crypto-lab-diffie-hellman-mitm/)**

The page is one scrollable lesson in five parts. You can run a Diffie–Hellman exchange on four parameter sets (`p = 23` up to a real 2048-bit RFC 3526 group), press **Break it** to recover Alice's secret exponent with a baby-step giant-step discrete-log attack, switch on **Mallory** to watch an active man-in-the-middle give Alice and Bob two different keys, and run a **real WebCrypto ECDSA** signed exchange that catches the tamper and fails closed. Controls: parameter preset, the private exponents `a` and `b`, Mallory's two exponents `m₁`/`m₂`, and honest-vs-tampered signed-delivery buttons.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm
cd crypto-lab-diffie-hellman-mitm
npm install
npm run dev
`​``

No environment variables, no API keys, no backend — everything runs client-side in the browser. `npm run build` type-checks and produces the static `dist/`; `npm test` runs the engine unit tests; `npm run verify` does both.

## Part of the Crypto-Lab Suite

> One of 170+ live browser demos at
> [systemslibrarian.github.io/crypto-lab](https://systemslibrarian.github.io/crypto-lab/)
> — spanning Atbash (600 BCE) through NIST FIPS 203/204/205 (2024).

---

*"Whether you eat or drink, or whatever you do, do all to the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## PAKE Gate

- **slug**: `crypto-lab-pake-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-pake-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-pake-gate/
- **commit_sha**: `8334867bc495b89e8712cdfd32abaf9f90f8015e` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | PROTOCOLS  ·  **level**: advanced  ·  **--accent**: #c084fc
- **MISSING FIELDS**: verification, limitations

**Name (H1)**: PAKE Gate  — _read from src/ui/tabs.ts_

**Subtitle**: PAKE · SRP-6a · J-PAKE · CPace · Dragonfly  — _read from src/ui/tabs.ts_

**Description**: Run four password-authenticated key exchanges for real in your browser and watch each side derive a session key without ever sending the password itself. A passive transcript gives no direct offline password test; compromised server storage is a separate, protocol-specific question.  — _read from src/ui/tabs.ts_

**Why it matters**: A PAKE does more than hash and send a password. A passive transcript does not give an eavesdropper a direct offline password test. A server breach is different: a stolen SRP verifier supports per-user offline password guessing, while a balanced PAKE stores no server verifier. Compare that difference below before choosing a design.  — _read from src/ui/tabs.ts_

**Card copy**: Compare four runnable classical PAKEs, server-storage tradeoffs, and the Dragonblood timing lesson. A sourced conceptual table contrasts three post-quantum PAKE research approaches; none is implemented here.

**Chips**: SRP-6a · J-PAKE · CPace · Dragonfly

**Implements**: CPace `src/pake/factories.ts:156`, Dragonfly `src/pake/dragonfly.ts:276`, HKDF `src/pake/hashes.ts:22`, HMAC `src/pake/hashes.ts:17`, J-PAKE `src/pake/factories.ts:100`, P-256 `src/pake/groups.ts:146`, ristretto255 `src/pake/factories.ts:131`, Schnorr `src/pake/schnorr-nizk.ts:27`, SHA-1 `src/pake/hashes.ts:12`, SHA-256 `src/pake/hashes.ts:22`, SHA-512 `src/pake/hashes.ts:14`, SRP `src/pake/factories.ts:75`

**Attacks shown**: Dictionary attack `src/pake/taxonomy.ts:51`, Discrete log `src/ui/glossary.ts:20`, Side-channel (unspecified) `src/pake/dragonblood.ts:18`, Timing side-channel `src/ui/dragonbloodPanel.ts:48`

**Comment-only (named in code comments, not executed)**: Diffie-Hellman `src/pake/types.ts:121`, ECDSA `src/pake/dragonfly.ts:67`, Ed25519 `src/pake/cpace.ts:44`, Hash-to-curve `src/pake/groups.ts:131`, OPAQUE `src/pake/taxonomy.ts:1`, OPRF `src/pake/taxonomy.ts:4`, Schnorr identification `src/pake/jpake.ts:123`

**References**: Diffie-Hellman, EC point arithmetic, Ed25519, ML-KEM, OPAQUE, OPRF, Schnorr identification

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `draft-irtf-cfrg-cpace-21` — first seen README.md:44 (5×)
- `eprint.iacr.org/2025/119` — first seen README.md:58 (1×)
- `ISO/IEC 11770-4` — first seen src/pake/taxonomy.ts:62 (1×)
- `NIST SP 800-108` — first seen src/pake/hashes.ts:33 (1×)
- `RFC 2945` — first seen README.md:42 (4×)
- `RFC 3526` — first seen src/pake/jpake.ts:3 (3×)
- `RFC 5054` — first seen README.md:42 (15×)
- `RFC 5869` — first seen src/pake/hashes.ts:21 (1×)
- `RFC 7664` — first seen README.md:3 (19×)
- `RFC 8235` — first seen README.md:43 (4×)
- `RFC 8236` — first seen README.md:43 (7×)
- `RFC 9380` — first seen src/pake/groups.ts:133 (1×)
- `RFC 9807` — first seen README.md:47 (4×)
- `RFC 9836` — first seen src/pake/cpace.ts:2 (2×)
- `rfc5054` — first seen src/pake/srp6a.ts:46 (1×)
- `SP800-108` — first seen src/pake/dragonfly.ts:23 (1×)

**Claims tested** (e2e/claims.spec.ts, 18 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:42
    - :42 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:55
    - :55 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:64
    - :64 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:90
    - :90 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
- `${protocol}: an honest run confirms, and the green verdict is the derived keys` — e2e/claims.spec.ts:98
    - :106 `toBe` expected `'✓ Confirmed — password never left either box.'` _(literal)_
    - :107 `toHaveClass` expected `/verdict--ok/` _(regex)_
    - :108 `toBe` expected `'Key confirmed — password never left either box.'` _(literal)_
    - :112 `toHaveLength` expected `2` _(literal)_
    - :113 `toBe` expected `fps[1]` _(expression)_
    - :114 `toBe` expected `''` _(literal)_
    - :117 `toEqual` expected `['✓ confirmed', '✓ confirmed']` _(expression)_
    - :120 `toHaveLength` expected `2` _(literal)_
    - :121 `toBe` expected `keys[1]` _(expression)_
    - :122 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :123 `expect` expected _no expected value_ _(none)_
    - :124 `toContainText` expected `'Demo only'` _(literal)_
    - :127 `toHaveCount` expected `0` _(literal)_
    - :128 `toHaveCount` expected `0` _(literal)_
    - :129 `toHaveCount` expected `0` _(literal)_
    - :132 `toContainText` expected _no expected value_ _(none)_
- `${protocol}: a wrong password fails closed and says so` — e2e/claims.spec.ts:137
    - :143 `expect` expected _no expected value_ _(none)_
    - :144 `toMatch` expected `/^⚠ /` _(regex)_
    - :145 `toHaveClass` expected `/status__pill--alarm/` _(regex)_
    - :147 `toHaveClass` expected `/verdict--alarm/` _(regex)_
    - :149 `toMatch` expected _no expected value_ _(none)_
    - :154 `expect` expected _no expected value_ _(none)_
    - :157 `toBe` expected `fps[1]` _(expression)_
    - :159 `toContainText` expected `'red alarm'` _(literal)_
- `the step counter counts the messages that are actually on the wire` — e2e/claims.spec.ts:165
    - :171 `expect` expected _no expected value_ _(none)_
    - :172 `toBe` expected `1` _(literal)_
    - :174 `expect` expected _no expected value_ _(none)_
    - :175 `toHaveCount` expected `0` _(literal)_
    - :176 `toContainText` expected `'No messages yet'` _(literal)_
    - :185 `expect` expected _no expected value_ _(none)_
    - :186 `expect` expected _no expected value_ _(none)_
    - :192 `toBe` expected `'Step ${i + 1} of ${total} ready.'` _(expression)_
    - :194 `toMatch` expected _no expected value_ _(none)_
    - :199 `toBeDisabled` expected _no expected value_ _(none)_
    - :200 `expect` expected _no expected value_ _(none)_
    - :203 `toHaveClass` expected `/verdict--ok/` _(regex)_
    - :205 `toBe` expected `fps[1]` _(expression)_
    - :209 `expect` expected _no expected value_ _(none)_
    - :216 `toHaveCount` expected `0` _(literal)_
    - :217 `toHaveClass` expected `/verdict--pending/` _(regex)_
    - :218 `toBe` expected `'Step 1 of ${total} ready.'` _(expression)_
    - :219 `toBeEnabled` expected _no expected value_ _(none)_
- `${protocol}: every curated tamper op aborts the handshake by name` — e2e/claims.spec.ts:225
    - :233 `expect` expected _no expected value_ _(none)_
    - :239 `toBe` expected `''` _(literal)_
    - :245 `expect` expected _no expected value_ _(none)_
    - :246 `toMatch` expected `/^⚠ /` _(regex)_
    - :247 `expect` expected _no expected value_ _(none)_
    - :251 `toHaveClass` expected `/verdict--alarm/` _(regex)_
    - :256 `expect` expected _no expected value_ _(none)_
    - :263 `toHaveCount` expected `0` _(literal)_
    - :269 `toBe` expected `''` _(literal)_
    - :270 `expect` expected _no expected value_ _(none)_
- `${protocol}: regression — editing the password discards the verdict it produced` — e2e/claims.spec.ts:284
    - :295 `toHaveClass` expected `/verdict--ok/` _(regex)_
    - :297 `toBe` expected `before[1]` _(expression)_
    - :307 `expect` expected _no expected value_ _(none)_
    - :308 `toHaveClass` expected `/verdict--ok/` _(regex)_
    - :309 `expect` expected _no expected value_ _(none)_
    - :310 `expect` expected _no expected value_ _(none)_
    - :311 `toHaveCount` expected `0` _(literal)_
    - :312 `toHaveCount` expected `0` _(literal)_
    - :315 `toContainText` expected _no expected value_ _(none)_
    - :318 `toBeVisible` expected _no expected value_ _(none)_
    - :321 `expect` expected _no expected value_ _(none)_
    - :322 `toBe` expected `'${ran}x'` _(expression)_
    - :326 `toHaveCount` expected `0` _(literal)_
    - :327 `toHaveClass` expected `/verdict--ok/` _(regex)_
    - :329 `toBe` expected `after[1]` _(expression)_
    - :330 `toBe` expected `before[0]` _(expression)_
- `regression: an untouched tab steps with the newly typed credentials` — e2e/claims.spec.ts:334
    - :341 `toHaveCount` expected `0` _(literal)_
    - :342 `toMatch` expected `/^Step 1 of \d+ ready\.$/` _(regex)_
    - :351 `expect` expected _no expected value_ _(none)_
    - :352 `toMatch` expected `/^⚠ /` _(regex)_
    - :353 `toHaveClass` expected `/status__pill--alarm/` _(regex)_
    - :354 `toHaveClass` expected `/status__pill--ok/` _(regex)_
- `the on-path observer shows the transcript and audits it for the password` — e2e/claims.spec.ts:359
    - :366 `expect` expected _no expected value_ _(none)_
    - :370 `toBeVisible` expected _no expected value_ _(none)_
    - :373 `toHaveCount` expected `wireCards` _(expression)_
    - :376 `toHaveClass` expected `/\bok\b/` _(regex)_
    - :377 `toContainText` expected `'Transcript audit: clean'` _(literal)_
    - :378 `toContainText` expected `'HIT'` _(literal)_
    - :382 `expect` expected _no expected value_ _(none)_
    - :384 `toContainText` expected `'augmented'` _(literal)_
- `the SRP breach panel dumps the verifier, and the grind reports what it tested` — e2e/claims.spec.ts:389
    - :400 `toBeVisible` expected _no expected value_ _(none)_
    - :404 `toHaveCount` expected `3` _(literal)_
    - :406 `expect` expected _no expected value_ _(none)_
    - :409 `toContainText` expected `'NOT the password'` _(literal)_
    - :415 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :420 `expect` expected _no expected value_ _(none)_
    - :421 `expect` expected _no expected value_ _(none)_
    - :428 `toBe` expected `guesses` _(expression)_
    - :429 `toBe` expected `1` _(literal)_
    - :430 `toContainText` expected `'verifier matched'` _(literal)_
    - :431 `toContainText` expected `'Recovered'` _(literal)_
    - :442 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :443 `expect` expected _no expected value_ _(none)_
    - :447 `toContainText` expected `'No match in'` _(literal)_
    - :450 `expect` expected _no expected value_ _(none)_
    - :459 `toMatch` expected `/GPU-day/i` _(regex)_
    - :460 `toMatch` expected `/billions/i` _(regex)_
    - :463 `toBe` expected `''` _(literal)_
    - :464 `expect` expected _no expected value_ _(none)_
    - :466 `expect` expected _no expected value_ _(none)_
    - :467 `expect` expected _no expected value_ _(none)_
    - :471 `expect` expected _no expected value_ _(none)_
- `the passive-transcript scan reports what it read, and finds no literal encoding` — e2e/claims.spec.ts:481
    - :489 `expect` expected _no expected value_ _(none)_
    - :495 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :498 `expect` expected _no expected value_ _(none)_
    - :499 `toBe` expected _no expected value_ _(none)_
    - :502 `toHaveClass` expected `/race__verdict--neutral/` _(regex)_
    - :507 `expect` expected _no expected value_ _(none)_
    - :508 `expect` expected _no expected value_ _(none)_
    - :511 `expect` expected _no expected value_ _(none)_
    - :518 `toContainText` expected `'leak audit, not a proof'` _(literal)_
    - :520 `expect` expected _no expected value_ _(none)_
- `regression: the passive column never calls the SRP transcript a balanced-PAKE one` — e2e/claims.spec.ts:531
    - :541 `expect` expected _no expected value_ _(none)_
    - :542 `toEqual` expected `['client-hello', 'server-hello', 'client-proof', 'server-proof']` _(expression)_
    - :547 `toMatch` expected _no expected value_ _(none)_
    - :550 `expect` expected _no expected value_ _(none)_
- `regression: scanning an empty transcript must not report a clean result` — e2e/claims.spec.ts:559
    - :567 `toHaveCount` expected `0` _(literal)_
    - :568 `toBeVisible` expected _no expected value_ _(none)_
    - :573 `toBeVisible` expected `{ timeout: 60_000 }` _(expression)_
    - :576 `expect` expected _no expected value_ _(none)_
    - :580 `expect` expected _no expected value_ _(none)_
    - :583 `expect` expected _no expected value_ _(none)_
    - :586 `toMatch` expected `/No transcript captured yet/` _(regex)_
    - :587 `expect` expected _no expected value_ _(none)_
    - :588 `toHaveClass` expected `/race__verdict--amber/` _(regex)_
    - :595 `toContainText` expected `'No literal encoding leak found', {` _(expression)_
    - :598 `expect` expected _no expected value_ _(none)_
- `the Dragonblood plot shows a varying legacy cost against a flat fixed-work one` — e2e/claims.spec.ts:603
    - :611 `toBeVisible` expected _no expected value_ _(none)_
    - :615 `expect` expected _no expected value_ _(none)_
    - :621 `toHaveCount` expected `2` _(literal)_
    - :624 `toHaveClass` expected `/bar--legacy/` _(regex)_
    - :625 `toHaveClass` expected `/bar--fixed/` _(regex)_
    - :629 `toBe` expected `1` _(literal)_
    - :630 `expect` expected _no expected value_ _(none)_
    - :631 `expect` expected _no expected value_ _(none)_
    - :643 `expect` expected _no expected value_ _(none)_
    - :648 `expect` expected _no expected value_ _(none)_
    - :651 `toContainText` expected _no expected value_ _(none)_
    - :656 `expect` expected _no expected value_ _(none)_
    - :657 `toContainText` expected `'fixed-work teaching variant'` _(literal)_
    - :663 `expect` expected _no expected value_ _(none)_
    - :664 `expect` expected _no expected value_ _(none)_
    - :667 `expect` expected _no expected value_ _(none)_
- `the confirmation captions describe the construction the code computes` — e2e/claims.spec.ts:682
    - :690 `expect` expected _no expected value_ _(none)_
    - :692 `toMatch` expected `/MAC M1|M1 .{0,12}MAC/i` _(regex)_
    - :693 `toMatch` expected `/evidence hash/i` _(regex)_
    - :699 `expect` expected _no expected value_ _(none)_
    - :701 `toMatch` expected _no expected value_ _(none)_
    - :704 `toMatch` expected `/own public contribution/i` _(regex)_
    - :705 `toMatch` expected _no expected value_ _(none)_
    - :713 `expect` expected _no expected value_ _(none)_
    - :715 `toMatch` expected _no expected value_ _(none)_
    - :718 `toMatch` expected `/keyed by a value derived from its shared secret/i` _(regex)_
- `the other protocols stay gated until "Go deeper" is pressed` — e2e/claims.spec.ts:723
    - :727 `toBeDisabled` expected _no expected value_ _(none)_
    - :728 `toHaveAttribute` expected `'aria-disabled', 'true'` _(expression)_
    - :730 `toBeVisible` expected _no expected value_ _(none)_
    - :731 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :734 `toHaveCount` expected `2` _(literal)_
    - :735 `toHaveCount` expected `0` _(literal)_
    - :740 `toBeEnabled` expected _no expected value_ _(none)_
    - :742 `toBeHidden` expected _no expected value_ _(none)_
    - :743 `toHaveCount` expected `5` _(literal)_
    - :747 `toHaveCount` expected `2` _(literal)_
    - :748 `toBeEnabled` expected _no expected value_ _(none)_

**Mutation records** (2 file(s)):

- `mutation-evidence.json` (10675 bytes)
- `scripts/claim-mutations.mjs` (7570 bytes)

<details><summary>Full README</summary>

```markdown
# PAKE Gate

**SRP-6a · J-PAKE · CPace · Dragonfly (RFC 7664) — the PAKE family, side by side.**

A live, in-browser tour of Password-Authenticated Key Exchange: how two parties turn a
shared, low-entropy **password** into a strong shared key **without sending the password
itself**. A passive transcript gives an observer no direct offline password test; a
stolen server verifier can still permit per-user offline guesses, depending on the
PAKE, and a compromised endpoint is a separate case again. Real group
arithmetic and real hash primitives — SHA-1/256/512, HMAC and HKDF come from
`@noble/hashes` rather than WebCrypto's async SubtleCrypto (same primitives,
synchronous, so the engines and KATs stay deterministic); session randomness comes from
the platform CSPRNG (WebCrypto in the browser). No backend, no network, nothing
persisted.

> [!WARNING]
> **This is a teaching/demo lab, not production authentication code.** The engines are
> hand-rolled so every step is inspectable; browser TypeScript is **not** constant-time,
> session keys are exposed in the UI on purpose, and randomness/parameters are chosen for
> clarity. Do not lift this code into a real auth system — use a reviewed library.

## What it demonstrates

The one lesson: **a PAKE is not "hash the password and send it."** Each tab runs a real
handshake one message at a time, showing the two peers' private scratchpads, the **Wire**
(literally everything an on-path observer sees), and each side's derived key — which lights
green only when both sides match **and** confirm.

**Built for two audiences at once.** The lab opens in a guided *Start here* view — SRP-6a
only, plain-language scratchpad rows (“my private nonce”, “my public share”), and just
*Honest run* / *Wrong password* — so a newcomer meets one handshake, not four dense tabs.
Each message that crosses **animates lifting out of the sender's box and settling on the
Wire while the secret rows stay put and pulse their lock**, and carries a one-sentence
plain-language caption (“sends its public Diffie–Hellman share `g^a` — useless without the
password”). Pressing **Go deeper** reveals the full notation, in-context glossary tooltips
(scalar, verifier `v`, premaster `S`, Schnorr NIZK, salt…), the tamper / observer / breach
panels, and the other three protocols. Nothing is dumbed down — the clarity is layered on
top of the same profile-explicit, test-verified crypto.

| Protocol | Family | What's distinctive | Standard |
| --- | --- | --- | --- |
| **SRP-6a** | augmented | server stores a verifier `{salt, v}`, never the password | RFC 5054 (Informational); RFC 2945 is the earlier SRP-3 |
| **J-PAKE** | balanced | both peers share the password; Schnorr NIZK proofs, no verifier stored | RFC 8236 (+ RFC 8235) |
| **CPace** | balanced | one-round; generator derived from password + session context | draft-irtf-cfrg-cpace-21 (Internet-Draft, **not** an RFC) |
| **Dragonfly** | balanced | hunting-and-pecking password→point (the surface Dragonblood attacked) | RFC 7664 (family behind WPA3 SAE) |

Plus a family **taxonomy matrix** (with an OPAQUE / RFC 9807 reference row and a deep link to
the sibling [OPAQUE Gate](https://systemslibrarian.github.io/crypto-lab-opaque-gate/) lab), a
curated **tamper** menu, an **offline-grind** simulator contrasting balanced-transcript vs
stolen-SRP-verifier breach economics, and the **Dragonblood** side-channel comparison — whose
bars are now **click-to-explain**: pick a candidate to see *why* it took that many
hunt-and-peck iterations and exactly what the legacy timing difference leaks to an attacker.

## Run it

The post-quantum research section distinguishes KEM/EKE-style, direct lattice
reconciliation, and lattice proof-based PAKE families, following [Alnahawi et al.,
*SoK: PQC PAKEs* (2025; revised 11 September 2026)](https://eprint.iacr.org/2025/119).
The reserved KEM/password interface models only the first family; no post-quantum
PAKE runs in this lab. Each candidate needs a construction-specific security argument,
including password-guessing and server-compromise assumptions. The linked October
2026 EKE/OEKE research is model-conditional and does not break these classical engines.


`​``bash
npm ci
npm run dev        # local dev server
npm run build      # static build → dist/  (deployed to GitHub Pages)
`​``

Live demo (once Pages is enabled): `https://systemslibrarian.github.io/crypto-lab-pake-gate/`

## Test & verify

`​``bash
npm test           # full suite (Vitest)
npm run test:fast  # skips the slow big-integer primality/grind tests
npm run coverage   # coverage; enforces a floor on the crypto core (src/pake/**)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint (bans unsafe casts in src/pake — the password barrier)
`​``

ESLint 10 reads `eslint.config.mjs`. The migration retains the previous enabled rules, password-core assertion selectors, ECMAScript 2022/module parser mode, effective global names and writability, and tracked TypeScript/ignore boundaries. The previous transitive `globals` 13.24.0 is declared directly to preserve that environment footprint. It also retains the three rules dropped from newer recommended presets and explicitly preserves constant-loop and block-function checks whose defaults became less strict. The older `.eslintrc.cjs` remains a historical reference.

`npm run lint` also runs `npm run test:lint`: seven Node controls compare the captured ESLint 8 baseline at `8cfae8ec5f15f2889f934e87a2d7a9dd77f36d4b` and exercise unsafe assertion, ordinary-branding, scope, constant-loop, block-function, semicolon and indentation cases. `tests/fixtures/lint-baseline.json` records that historical configuration and dependency versions; it is not a new source-review claim.

Every engine is validated against **published test vectors where they exist** (SRP RFC 5054
Appendix B; CPace draft-21 ristretto255/SHA-512) and against **independent from-scratch
Python KAT generators** where the RFC publishes none (SRP Track 2, J-PAKE, Dragonfly). Group
primes are derived from first principles and verified as safe primes. Full provenance is in
[`tests/vectors/README.md`](tests/vectors/README.md).

## How it's built

- `src/pake/` — the four headless engines, shared group arithmetic, the `Wire` transport,
  branded types (the compile-time `Hex`-vs-`Password` barrier that keeps the password off the
  wire), and the taxonomy data.
- `src/ui/` — vanilla-DOM UI (no framework): tabbed split view, wire transcript, key panel,
  attacker/breach/Dragonblood panels.
- `tests/` — 120+ tests: published vectors, independent KATs, round-trips, security invariants,
  fail-closed edge cases, tamper-aborts-pre-key, offline-grind asymmetry, plus jsdom render +
  axe-core accessibility + runner interaction tests.

**Accessibility & mobile:** WCAG 2.1 AA — state is conveyed by icon + text + color (never color
alone), all controls are keyboard-operable with focus rings, inputs are labeled, contrast is AA
in both light and dark themes, and `prefers-reduced-motion` is respected. The layout stacks
below 640px.

---

*Part of the Crypto Lab suite. This build produces the demo logic, UI, and content; a separate
standardization pass owns the shared header and footer.*

```

</details>

---

## TLS Handshake

- **slug**: `crypto-lab-tls-handshake`
- **repo**: https://github.com/systemslibrarian/crypto-lab-tls-handshake
- **live**: https://systemslibrarian.github.io/crypto-lab-tls-handshake/
- **commit_sha**: `55a3cfaea24792fb01532972d373f52a94859e04` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | PROTOCOLS  ·  **level**: intermediate  ·  **--accent**: #6ea6f7
- **MISSING FIELDS**: verification

**Name (H1)**: TLS 1.3 Handshake  — _read from src/main.ts_

**Subtitle**: TLS 1.3 · RFC 9846  — _read from src/main.ts_

**Description**: Step through a real 1-RTT handshake and watch ephemeral X25519 key exchange, Ed25519 certificate authentication, the HKDF key schedule, and AES-128-GCM record protection combine live in your browser — with an MITM attempt you can run yourself.  — _read from src/main.ts_

**Why it matters**: HTTPS guards every login, payment, and message you send. Key exchange alone gives you a shared secret with someone  — _read from src/main.ts_

**Card copy**: Step through real X25519, Ed25519, HKDF, and AES-GCM operations in a TLS teaching model. Compare certificate names, SNI, ALPN, and handler selection in a separate service-routing exercise.

**Chips**: TLS 1.3 · X25519 · Ed25519 · AES-GCM

**Implements**: AES `src/primitives.ts:241`, AES-GCM `src/primitives.ts:241`, Ed25519 `src/primitives.ts:124`, HKDF `src/primitives.ts:152`, HMAC `src/primitives.ts:88`, SHA-256 `src/primitives.ts:83`, TLS 1.3 `src/antireplay.ts:101`, X25519 `src/primitives.ts:105`

**Attacks shown**: Man-in-the-middle `src/handshake.ts:595`, Side-channel (unspecified) `brief-extension.md:84`

**Comment-only (named in code comments, not executed)**: ECDH `src/handshake.ts:271`

**References**: ECDH, ML-KEM, RC4, RSA

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `RFC 5869` — first seen scripts/phase-checks.ts:546 (10×)
- `RFC 7301` — first seen README.md:141 (2×)
- `RFC 8032` — first seen src/certs.ts:12 (1×)
- `RFC 8448` — first seen README.md:157 (26×)
- `RFC 9325` — first seen README.md:140 (2×)
- `RFC 9846` — first seen README.md:8 (37×)
- `rfc5869` — first seen scripts/phase-checks.ts:550 (9×)
- `rfc7301` — first seen README.md:141 (2×)
- `rfc8448` — first seen src/main.ts:714 (1×)
- `rfc9325` — first seen README.md:140 (2×)
- `rfc9846` — first seen README.md:142 (3×)

**README — What Can Go Wrong**:

```text
- **0-RTT is replayable.** A valid ticket and binder authenticate the recorded first flight; they do not prove freshness. The broken policy executes the modelled bill payment twice.
- **`psk_ke` has no fresh (EC)DHE input.** Leaking the STEK later recovers the ticket PSK and opens recorded resumed 1-RTT data. The default `psk_dhe_ke` keeps that 1-RTT data sealed, though its PSK-derived 0-RTT data is still exposed.
- **A local replay cache is local.** ClientHello recording refuses a duplicate in region A while region B, sharing the STEK but not the recording store, accepts it.
- **Every ticket-based early-data policy checks ticket age.** Single-use tickets and ClientHello recording add duplicate tracking. Freshness alone rejects late copies but permits replays inside the tolerance.
- **Failed full handshakes cannot establish resumption.** A failed chain, signature, Finished check, or shared-secret agreement prevents ticket issuance and retires the resumption panel's previous results.
- **Ticket authentication precedes binder verification.** Flipping opaque ticket bytes fails ticket AEAD; flipping only the binder fails the binder check. Neither failure releases early plaintext.
- **A valid handshake can reach the wrong service.** A certificate covering the requested hostname does not identify an application protocol. In the service-routing model, a mail service on the same hostname passes strict SNI; requiring matched ALPN blocks it. Conversely, ALPN alone does not distinguish two names offering the same protocol.
```

**Claims tested** (e2e/claims.spec.ts, 24 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:27
    - :27 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:54
    - :54 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:55
    - :55 `toBeVisible` expected _no expected value_ _(none)_
- `honest session: every verdict the page prints is a pass, and it says so` — e2e/claims.spec.ts:144
    - :146 `toHaveClass` expected `/faulted/` _(regex)_
    - :147 `toHaveCount` expected `0` _(literal)_
    - :150 `toEqual` expected `[...FAULT_VERDICTS].sort()` _(expression)_
    - :151 `toEqual` expected `Object.fromEntries(FAULT_VERDICTS.map((v) => [v, true]))` _(expression)_
    - :155 `toContainText` expected `'All four hold, so this session completes'` _(literal)_
    - :159 `toEqual` expected `{` _(expression)_
    - :166 `toEqual` expected `{` _(expression)_
- `key exchange: the agreement pill agrees with the bytes rendered under it` — e2e/claims.spec.ts:172
    - :176 `toHaveLength` expected `64` _(literal)_
    - :177 `toHaveLength` expected `64` _(literal)_
    - :180 `toEqual` expected `serverRow.diffs` _(expression)_
    - :186 `toBe` expected `clientRow.hex === serverRow.hex` _(expression)_
    - :187 `toBe` expected `clientRow.diffs.length === 0` _(expression)_
    - :188 `toBe` expected `true` _(expression)_
- `ECDHE fault: Finished fails on both sides, authentication does not, and the page names the mismatch` — e2e/claims.spec.ts:195
    - :199 `toBeVisible` expected _no expected value_ _(none)_
    - :200 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :202 `toEqual` expected `{` _(expression)_
    - :213 `expect` expected _no expected value_ _(none)_
    - :216 `toBe` expected `clientRow.hex.slice(0, 8)` _(expression)_
    - :217 `toBe` expected `serverRow.hex.slice(0, 8)` _(expression)_
    - :218 `toBe` expected `serverRow.hex` _(expression)_
    - :219 `expect` expected _no expected value_ _(none)_
    - :221 `toContainText` expected `'Finished is the check that catches this'` _(literal)_
    - :225 `toBe` expected `true` _(expression)_
    - :226 `toBe` expected `true` _(expression)_
    - :227 `toBe` expected `true` _(expression)_
- `in-flight byte flip: every transcript-bound check fails at once, ECDHE still agrees` — e2e/claims.spec.ts:230
    - :232 `toBeVisible` expected _no expected value_ _(none)_
    - :234 `toEqual` expected `{` _(expression)_
    - :245 `expect` expected _no expected value_ _(none)_
    - :247 `toBe` expected `1` _(literal)_
    - :249 `toBe` expected `m![4]` _(expression)_
    - :251 `toContainText` expected `'transcript binding doing its job'` _(literal)_
    - :255 `toEqual` expected `{` _(expression)_
    - :265 `toBe` expected `serverRow.hex` _(expression)_
- `every fault choice is reachable and returns to a clean state` — e2e/claims.spec.ts:268
    - :275 `toEqual` expected `['ecdhe', 'none', 'transcript']` _(expression)_
    - :279 `toBeVisible` expected _no expected value_ _(none)_
    - :280 `toHaveCount` expected `0` _(literal)_
    - :281 `expect` expected _no expected value_ _(none)_
    - :284 `toHaveClass` expected `/faulted/` _(regex)_
    - :285 `toHaveCount` expected `0` _(literal)_
    - :286 `toHaveCount` expected `0` _(literal)_
- `ladder: the progress counter, the rendered rows and the detail card stay in step` — e2e/claims.spec.ts:293
    - :295 `toHaveCount` expected `STEP_TITLES.length` _(expression)_
    - :301 `toBe` expected `await rows.count()` _(expression)_
    - :305 `toHaveText` expected `'Step ${i + 1} / ${total}'` _(expression)_
    - :306 `toHaveAttribute` expected `'aria-current', 'step'` _(expression)_
    - :307 `toHaveCount` expected `1` _(literal)_
    - :308 `toContainText` expected `STEP_TITLES[i]!` _(expression)_
    - :313 `toBe` expected `rowBytes` _(expression)_
    - :318 `toHaveText` expected `'Step ${total} / ${total}'` _(expression)_
    - :320 `toHaveText` expected `'Step ${total - 1} / ${total}'` _(expression)_
    - :324 `toHaveText` expected `'Step ${total - 2} / ${total}'` _(expression)_
    - :326 `toHaveText` expected `'Step ${total - 1} / ${total}'` _(expression)_
- `transcript chips name the run they cover, and a signature covers the message before it` — e2e/claims.spec.ts:329
    - :336 `toBe` expected `'SHA-256(ClientHello)'` _(literal)_
    - :337 `toBe` expected `false` _(expression)_
    - :340 `toBe` expected `'SHA-256(ClientHello..Certificate)'` _(literal)_
    - :346 `toBe` expected `'SHA-256(ClientHello..Certificate)'` _(literal)_
    - :347 `toBe` expected `certificate.value` _(expression)_
    - :348 `toBe` expected `true` _(expression)_
    - :349 `toContainText` expected `'is what gets SIGNED here'` _(literal)_
    - :352 `toBe` expected `'SHA-256(ClientHello..CertificateVerify)'` _(literal)_
    - :353 `toBe` expected `certVerify.value` _(expression)_
    - :354 `toBe` expected `true` _(expression)_
    - :355 `toContainText` expected `"is what gets MAC'd here"` _(literal)_
    - :362 `toMatch` expected `/^[0-9a-f]{12}…[0-9a-f]{12}$/` _(regex)_
    - :364 `toBe` expected `prior` _(expression)_
    - :372 `toBe` expected `6` _(literal)_
    - :373 `toBe` expected `seen.size` _(expression)_
- `MITM: every strategy reaches a verdict that follows from the checks printed above it` — e2e/claims.spec.ts:380
    - :388 `expect` expected _no expected value_ _(none)_
    - :396 `toEqual` expected `['own-key', 'relay', 'reuse-cert']` _(expression)_
    - :400 `toBeVisible` expected _no expected value_ _(none)_
    - :403 `toEqual` expected _no expected value_ _(none)_
    - :409 `toBe` expected _no expected value_ _(none)_
    - :413 `toBe` expected `blocked` _(expression)_
    - :414 `expect` expected _no expected value_ _(none)_
    - :418 `toBe` expected `genuineTranscript` _(expression)_
    - :420 `expect` expected _no expected value_ _(none)_
    - :423 `toBe` expected `true` _(expression)_
    - :428 `toBe` expected `true` _(expression)_
    - :429 `toBe` expected `false` _(expression)_
    - :430 `toBe` expected `true` _(expression)_
    - :431 `expect` expected _no expected value_ _(none)_
    - :432 `expect` expected _no expected value_ _(none)_
    - :433 `expect` expected _no expected value_ _(none)_
    - :437 `toBe` expected `false` _(expression)_
    - :438 `toBe` expected `true` _(expression)_
    - :439 `toBe` expected `true` _(expression)_
    - :440 `expect` expected _no expected value_ _(none)_
    - :441 `expect` expected _no expected value_ _(none)_
    - :442 `expect` expected _no expected value_ _(none)_
    - :445 `toBe` expected `true` _(expression)_
    - :446 `toBe` expected `true` _(expression)_
    - :447 `toBe` expected `true` _(expression)_
    - :448 `toBe` expected `false` _(expression)_
    - :449 `toBe` expected `genuineTranscript` _(expression)_
    - :450 `expect` expected _no expected value_ _(none)_
    - :451 `expect` expected _no expected value_ _(none)_
- `MITM verdicts never go stale: re-running the handshake clears the previous result` — e2e/claims.spec.ts:456
    - :458 `toBeVisible` expected _no expected value_ _(none)_
    - :462 `toHaveCount` expected `0` _(literal)_
    - :466 `toBeVisible` expected _no expected value_ _(none)_
    - :468 `toHaveCount` expected `0` _(literal)_
    - :474 `toBe` expected `genuine` _(expression)_
- `New session rotates the ephemeral material and keeps the long-term identity` — e2e/claims.spec.ts:481
    - :493 `toHaveText` expected `/Step 1 \//` _(regex)_
    - :497 `toEqual` expected `before.leaf` _(expression)_
    - :500 `toBe` expected `before.secret` _(expression)_
    - :501 `toBe` expected `before.record` _(expression)_
    - :508 `toHaveLength` expected `8` _(literal)_
    - :509 `toBe` expected `before.schedule[0]` _(expression)_
    - :510 `toHaveText` expected `/Early Secret\s+\(full handshake — no PSK\)/` _(regex)_
    - :511 `toContainText` expected _no expected value_ _(none)_
    - :515 `toBe` expected `before.schedule[i]` _(expression)_
    - :518 `toBe` expected `8` _(literal)_
- `record layer: the header, the ciphertext and the plaintext lengths agree` — e2e/claims.spec.ts:525
    - :540 `toMatch` expected `/^[0-9a-f]{24}$/` _(regex)_
    - :541 `toMatch` expected `/^[0-9a-f]+$/` _(regex)_
    - :545 `toBe` expected `r.ct.length / 2` _(expression)_
    - :549 `toMatch` expected `/^170303[0-9a-f]{4}$/` _(regex)_
    - :550 `toBe` expected `labelled` _(expression)_
    - :555 `toBe` expected `labelled` _(expression)_
    - :558 `toBe` expected `true` _(expression)_
- `key schedule: the worked derivation states the same length its own bars measure` — e2e/claims.spec.ts:561
    - :562 `toHaveCount` expected `8` _(literal)_
    - :585 `toBe` expected `32` _(literal)_
    - :586 `toEqual` expected `['${stated} B', '${stated} B']` _(expression)_
    - :590 `toBe` expected `d.scheduleHandshakeSecret` _(expression)_
    - :591 `expect` expected _no expected value_ _(none)_
    - :592 `toBe` expected `'server_handshake_traffic_secret'` _(literal)_
    - :627 `toBeEnabled` expected _no expected value_ _(none)_
    - :629 `toBeVisible` expected _no expected value_ _(none)_
- `[verdict:binder-check] binder is independently re-derived from the PSK and exact truncated bytes` — e2e/claims.spec.ts:632
    - :642 `toHaveLength` expected `32` _(literal)_
    - :643 `toBe` expected `true` _(expression)_
    - :644 `expect` expected _no expected value_ _(none)_
    - :652 `toBe` expected `expectedBinder` _(expression)_
    - :653 `toHaveAttribute` expected `'data-ok', 'true'` _(expression)_
    - :656 `toHaveAttribute` expected `'data-ok', 'false'` _(expression)_
    - :657 `toHaveAttribute` expected `'data-ticket-valid', 'false'` _(expression)_
    - :658 `toContainText` expected `'pre_shared_key.identities[0]'` _(literal)_
    - :659 `toContainText` expected `'Ticket AEAD rejected'` _(literal)_
    - :660 `toHaveAttribute` expected `'data-plaintext-released', 'false'` _(expression)_
    - :661 `toBe` expected `raw.full` _(expression)_
    - :663 `toHaveAttribute` expected `'data-ok', 'true'` _(expression)_
    - :666 `toHaveAttribute` expected `'data-ok', 'false'` _(expression)_
    - :667 `toHaveAttribute` expected `'data-ticket-valid', 'true'` _(expression)_
    - :668 `toContainText` expected `'pre_shared_key.binders[0]'` _(literal)_
    - :669 `toContainText` expected `'no early plaintext released'` _(literal)_
    - :670 `toHaveAttribute` expected `'data-plaintext-released', 'false'` _(expression)_
    - :671 `toHaveAttribute` expected `'data-truncated-clienthello', raw.truncated` _(expression)_
    - :672 `toBe` expected `expectedBinder` _(expression)_
    - :674 `toHaveAttribute` expected `'data-ok', 'true'` _(expression)_
- `resumption wire claims and protocol edges are computed, bounded, and internally consistent` — e2e/claims.spec.ts:677
    - :679 `expect` expected _no expected value_ _(none)_
    - :680 `expect` expected _no expected value_ _(none)_
    - :682 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :683 `toContainText` expected _no expected value_ _(none)_
    - :689 `toHaveLength` expected `5` _(literal)_
    - :690 `toBe` expected `true` _(expression)_
- `mode toggle retires stale proof, while selecting the current mode is a no-op` — e2e/claims.spec.ts:693
    - :697 `toHaveAttribute` expected `'data-retired-count', '0'` _(expression)_
    - :700 `toHaveAttribute` expected `'data-retired-count', '0'` _(expression)_
    - :701 `toHaveCount` expected `0` _(literal)_
    - :704 `toHaveAttribute` expected `'data-mode', 'psk_ke'` _(expression)_
    - :705 `toHaveAttribute` expected `'data-retired-count', '1'` _(expression)_
    - :706 `toContainText` expected `'Previous computed verdict retired (1)'` _(literal)_
    - :707 `toContainText` expected `'MUST NOT carry a key_share'` _(literal)_
    - :708 `toEqual` expected `before` _(expression)_
    - :711 `toHaveAttribute` expected `'data-retired-count', '1'` _(expression)_
- `[verdict:stek-psk-ke] [verdict:stek-psk-dhe] leaked STEK exposes exactly the PSK-derived recordings` — e2e/claims.spec.ts:714
    - :717 `toHaveAttribute` expected `'data-psk-ke-early', 'true'` _(expression)_
    - :718 `toHaveAttribute` expected `'data-psk-ke-one-rtt', 'true'` _(expression)_
    - :719 `toHaveAttribute` expected `'data-psk-dhe-early', 'true'` _(expression)_
    - :720 `toHaveAttribute` expected `'data-psk-dhe-one-rtt', 'false'` _(expression)_
    - :721 `toHaveAttribute` expected `'data-ok', 'false'` _(expression)_
    - :722 `toHaveAttribute` expected `'data-ok', 'false'` _(expression)_
    - :723 `toContainText` expected `'ALARM — PAST SESSION READ'` _(literal)_
    - :724 `toContainText` expected `'1-RTT HOLDS — 0-RTT EXPOSED'` _(literal)_
- `[verdict:replay-${expected.id}] ${expected.id} verdict equals the server execution log` — e2e/claims.spec.ts:736
    - :747 `toHaveLength` expected `2` _(literal)_
    - :749 `toBe` expected `region.rows.filter((row) => row.executed).length` _(expression)_
    - :751 `toBe` expected `expected.count` _(expression)_
    - :752 `toBe` expected `expected.countB` _(expression)_
    - :753 `toBe` expected `true` _(expression)_
    - :754 `toHaveLength` expected `1` _(literal)_
    - :755 `expect` expected _no expected value_ _(none)_
    - :757 `toHaveAttribute` expected `'data-ok', String(expected.ok)` _(expression)_
    - :758 `toContainText` expected `expected.verdict` _(expression)_
- `[verdict:one-rtt-fallback] freshness rejection preserves a computed 1-RTT fallback` — e2e/claims.spec.ts:762
    - :764 `toHaveAttribute` expected `'data-ok', 'true'` _(expression)_
    - :765 `toContainText` expected `'reject 0-RTT, proceed with 1-RTT'` _(literal)_
    - :766 `toHaveAttribute` expected `'data-ok', 'true'` _(expression)_
- `[verdict:handshake-gate] failed full handshakes retire tickets and block resumption until a new honest session` — e2e/claims.spec.ts:769
    - :771 `toHaveAttribute` expected `'data-available', 'true'` _(expression)_
    - :773 `toBeVisible` expected _no expected value_ _(none)_
    - :775 `toHaveClass` expected `/faulted/` _(regex)_
    - :776 `toHaveAttribute` expected `'data-available', 'false'` _(expression)_
    - :777 `toContainText` expected `'No usable ticket or resumption PSK was issued'` _(literal)_
    - :778 `toHaveCount` expected `0` _(literal)_
    - :780 `toHaveAttribute` expected `'data-available', 'true'` _(expression)_
    - :781 `toHaveCount` expected `1` _(literal)_
- `[verdict:region-routing] recording the original processes region A only` — e2e/claims.spec.ts:785
    - :787 `toHaveAttribute` expected `'data-count', '1'` _(expression)_
    - :788 `toHaveCount` expected `1` _(literal)_
    - :789 `toHaveAttribute` expected `'data-count', '0'` _(expression)_
    - :790 `toHaveCount` expected `0` _(literal)_
    - :792 `toHaveAttribute` expected `'data-server-region', 'region B'` _(expression)_
    - :793 `toHaveAttribute` expected `'data-count', '0'` _(expression)_
- `negative claim: authenticated 0-RTT can still execute twice` — e2e/claims.spec.ts:796
    - :799 `toBeVisible` expected _no expected value_ _(none)_
    - :800 `toHaveCount` expected `3` _(literal)_
    - :802 `toBe` expected `2` _(literal)_
    - :803 `toHaveAttribute` expected `'data-count', '2'` _(expression)_
    - :810 `toBe` expected `true` _(expression)_
    - :811 `toContainText` expected `'AUTHENTICATED — AND REPLAYED'` _(literal)_
    - :812 `toContainText` expected `'A valid PSK binder and a valid ticket do not make 0-RTT data replay-safe.'` _(literal)_

**Mutation records** (2 file(s)):

- `scripts/mutation-ledger.json` (3481 bytes)
- `scripts/mutations.ts` (5549 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-tls-handshake

> **TLS 1.3 Handshake** — an interactive, step-by-step walkthrough of how a modern
> HTTPS connection is established. Real WebCrypto + real primitives, no backend.

## What It Is

A browser demo of a complete **TLS 1.3** (RFC 9846) full handshake and PSK resumption,
run entirely in the page with no server. It uses genuine cryptographic primitives — **X25519** ephemeral
key exchange, **Ed25519** certificate-chain and `CertificateVerify` signatures, the
**HKDF** key schedule (`HKDF-Extract` / `HKDF-Expand-Label` / `Derive-Secret`), HMAC
`Finished` MACs, and **AES-128-GCM** record protection. It surfaces the running
**transcript hash** as a first-class value so you can see exactly what each signature and
MAC is bound to. The extension derives a ticket PSK, computes and verifies the truncated-
ClientHello binder, compares `psk_dhe_ke` with the deliberately weak `psk_ke`, protects real
0-RTT records, and lets you replay a bill payment against five server policies. It is an honest
educational simulation, not a hardened TLS stack: it deliberately omits HelloRetryRequest,
client authentication, X.509 encoding, and every name/validity/revocation check a real client
performs. A separate service-routing exercise uses declared DNS-name and ALPN fixtures
to teach application admission without adding those extensions to the cryptographic
handshake. The page states those boundaries itself, in a Scope panel.

## Exhibits

1. **What TLS 1.3 Gives You** — confidentiality, integrity, authentication, and the message flow.
2. **Interactive Handshake Simulator** — the eight-message 1-RTT trace and break-it-yourself faults.
3. **Key Exchange** — both X25519 computations shown byte for byte.
4. **Authentication** — the model chain, `CertificateVerify`, and three live MITM strategies.
5. **Key Derivation & Forward Secrecy** — the no-PSK full-handshake schedule and one worked HKDF expansion.
6. **Record Layer** — an AES-128-GCM application record and tamper rejection.
7. **Resumption & 0-RTT** — ticket-to-PSK derivation, binder failure, STEK compromise, and replay policies.
8. **A Valid Handshake — For Which Service?** — independent certificate-name, SNI, and ALPN checks against eight declared service routes.
9. **TLS 1.3 vs 1.2 & Takeaways** — the protocol cleanup in context.
10. **Scope** — what is faithful, compressed, or deliberately absent.

## What Can Go Wrong

- **0-RTT is replayable.** A valid ticket and binder authenticate the recorded first flight; they do not prove freshness. The broken policy executes the modelled bill payment twice.
- **`psk_ke` has no fresh (EC)DHE input.** Leaking the STEK later recovers the ticket PSK and opens recorded resumed 1-RTT data. The default `psk_dhe_ke` keeps that 1-RTT data sealed, though its PSK-derived 0-RTT data is still exposed.
- **A local replay cache is local.** ClientHello recording refuses a duplicate in region A while region B, sharing the STEK but not the recording store, accepts it.
- **Every ticket-based early-data policy checks ticket age.** Single-use tickets and ClientHello recording add duplicate tracking. Freshness alone rejects late copies but permits replays inside the tolerance.
- **Failed full handshakes cannot establish resumption.** A failed chain, signature, Finished check, or shared-secret agreement prevents ticket issuance and retires the resumption panel's previous results.
- **Ticket authentication precedes binder verification.** Flipping opaque ticket bytes fails ticket AEAD; flipping only the binder fails the binder check. Neither failure releases early plaintext.
- **A valid handshake can reach the wrong service.** A certificate covering the requested hostname does not identify an application protocol. In the service-routing model, a mail service on the same hostname passes strict SNI; requiring matched ALPN blocks it. Conversely, ALPN alone does not distinguish two names offering the same protocol.

## When to Use It

- **Teaching how a real handshake fits together** — students who learned Diffie–Hellman, signatures, and AEAD in isolation can see them combine into one protocol.
- **Showing why authentication, not key exchange, stops a MITM** — the attack panel runs three different attacker strategies against the *current session's* real chain and real transcript, and shows which check each one trips: reusing the server's certificate fails the signature, signing with the attacker's own key fails the trust anchor, and relaying unchanged passes every check while gaining the attacker nothing.
- **Explaining forward secrecy concretely** — the server's Ed25519 certificate key persists across sessions while the X25519 keys are generated per session and discarded, so you can press *New session* and watch the long-term key stay put while every derived secret changes.
- **Walking the TLS 1.3 key schedule** — every secret in the RFC 9846 §7.1 tree is shown as the real HKDF output for the current session.
- **Demonstrating the latency/security tradeoff in resumption** — record and replay the exact ClientHello + early-data bytes, then compare five computed admission policies.
- **Do NOT use it as a TLS library.** It is an educational tool; JavaScript here is not constant-time and the chain validation is intentionally minimal. For production, use a vetted TLS implementation.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-tls-handshake](https://systemslibrarian.github.io/crypto-lab-tls-handshake/)**

Step through the eight steps — the seven handshake messages plus the first application
record — one flight at a time (Step / Back / Auto-play, arrow keys, or click any message);
a labelled packet flies along the wire, tinted by its encryption layer (cleartext /
handshake-key / app-key). Each step shows what cryptographic
operation runs, which keys are derived, and — as a **live transcript-hash chip** — the
exact SHA-256 that `CertificateVerify` signs and the `Finished` MACs cover, so transcript
binding is a value you watch change rather than a claim. The chip names the run it is a
hash of (`SHA-256(ClientHello..Certificate)`) rather than the step's ordinal, because a
signature or MAC necessarily covers the transcript ending just *before* its own message.
A **Break this handshake** panel under the ladder re-runs the whole real handshake with a
fault you choose and reports the four verifier booleans it produced — *break the ECDHE
agreement* (one bit of the client's X25519 output flipped) or *flip a byte in flight* (one
byte of `EncryptedExtensions` altered between server and client). The separation is the
lesson: under the ECDHE fault the chain and `CertificateVerify` still verify — authentication
proves *who* the peer is, not that you share keys with them — and both `Finished` MACs are
what catch it; under the in-flight byte flip the client hashes what it received, so the
server's real signature no longer fits the client's transcript and every transcript-bound
check fails at once. Each verdict is the return value of the same `verifyFinished` /
`verifyCertificateVerify` calls the honest run makes. The **key-exchange panel** shows
both sides fully: each combines its own (masked) private key with the peer's public key,
and the two independently-computed 32-byte secrets are stacked with a **byte-level match
highlight** — different private inputs, byte-identical output, the Diffie–Hellman "aha".
The authentication panel validates the certificate chain and lets you choose the
attacker's move in a **MITM panel** — *reuse the server's certificate*, *sign with its own
key*, or *relay unchanged*. Each runs against this session's own ClientHello, chain, and
`CertificateVerify` signature, so the "genuine session" transcript it compares against is
literally the value the Certificate step shows above; every verdict is the output of the
same chain and signature verification the honest handshake runs, and the panel reports
separately whether the client accepted and whether the attacker ended up holding the
session secret. The key-schedule panel renders
the live HKDF tree plus an expandable **"show one derivation in full"** view — inputs →
`HKDF-Expand-Label(secret, label, context)` → output, with byte-length bars. The
record-layer panel encrypts a real HTTP request with AES-128-GCM and proves tampering is
rejected. Inline dotted-underline definitions cover ECDHE, AEAD, AAD, IV/nonce, and the
transcript hash. Press **New session** for fresh ephemeral keys — the server's long-term
leaf key stays the same. A **Resumption &amp; 0-RTT** panel then issues an RFC-shaped
NewSessionTicket, derives the PSK and binder, toggles both PSK establishment modes, and runs a
recorded-wire STEK compromise. The resumption ClientHello advertises X25519 in `supported_groups`
and Ed25519 for certificate fallback, with `pre_shared_key` last. Its replay console processes the
original only in region A, then one replay in each region; each region displays its own admission
log and payment count. Certificate handshakes and `psk_dhe_ke` provide forward secrecy through
fresh (EC)DHE; `psk_ke` and 0-RTT do not. A closing **Scope** panel states
in the page itself what is
modelled faithfully and what is not: the certificate chain is not X.509 (so the
`Certificate` step's byte count is this demo's encoding), no hostname/SAN, validity, or
revocation check exists in that cryptographic handshake, HelloRetryRequest and client authentication are omitted, nothing is negotiated on a network,
and only application-data records (including 0-RTT) are actually AEAD-sealed.

## Application Service Binding

The **A Valid Handshake — For Which Service?** panel is a bounded, synthetic admission
exercise. It keeps four checks separate: the current simulator's real cryptographic
handshake result; whether declared certificate DNS names include the requested hostname;
whether the endpoint recognizes the requested SNI name; and whether an ALPN selection was
offered, is supported, matches the client's intended protocol, and is honored by the
receiving application handler.

Try **Same hostname, mail service** with **Add strict SNI**: the name matches but the
wrong service is admitted. Switch to **Require SNI + ALPN**: the disjoint protocol lists
cause rejection. **Other hostname, web service** provides the converse control—ALPN
matches while strict server-name policy fails. The remaining controls include the
intended endpoint, another hostname's mail endpoint, a certificate for the wrong name,
missing ALPN, an unoffered selection, and an HTTP selection delivered to a mail handler.
A failed cryptographic handshake blocks all routes under every policy; the synthetic
name/protocol observations remain independent.

SNI is a server-side name/routing policy, not the client's certificate hostname check.
The client-name comparison here handles only declared exact ASCII DNS names; it is not
X.509/SAN validation and includes no wildcards, IDNA, DNS resolution, or port identity.
ALPN identifiers are compared exactly. Requiring an ALPN selection is the exercise's
explicit application policy, not a claim that every TLS application must reject absent
ALPN. Policies that omit checks are deliberately incomplete controls.

No SNI/ALPN bytes are added to ClientHello or EncryptedExtensions, and no network TLS,
HTTP/SMTP parsing, traffic redirection, or real ALPACA exploit occurs. Wrong-service
admission demonstrates the missing binding; it does not establish data theft or an
exploitable application parser. The cryptographic transcript and existing vector tests
remain unchanged. In actual TLS 1.3, the server's ALPN response belongs in
EncryptedExtensions.

Primary sources: [Brinkmann et al., ALPACA (USENIX Security 2021)](https://www.usenix.org/conference/usenixsecurity21/presentation/brinkmann),
[RFC 9325 §§3.7–3.9](https://www.rfc-editor.org/rfc/rfc9325.html#section-3.7),
[RFC 7301 §3.2](https://www.rfc-editor.org/rfc/rfc7301.html#section-3.2), and
[RFC 9846 §4.3](https://www.rfc-editor.org/info/rfc9846/) (TLS 1.3 extension locations).

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-tls-handshake
cd crypto-lab-tls-handshake
npm install
npm run dev
`​``

Verification:

`​``bash
npm run typecheck   # tsc strict, no emit
npm test            # RFC 8448 full/resumed vectors + schedules, auth/MITM, AEAD, replay gates
npm run verify:service-binding # 32 route/policy outcomes + independent failure controls
npm run build       # type-check + production bundle
npm run test:a11y   # claims + WCAG A/AA drive, including the new panel at 320px
npm run test:mutations # 14 replayable behavioural mutations; requires a clean committed tree
`​``

`npm test` runs `scripts/phase-checks.ts`: the RFC 8448 `HKDF-Expand-Label`/Early-Secret
vectors, a deterministic distinct-secrets key-schedule check, certificate-chain
accept/reject and `CertificateVerify` forge-rejection, a long-term-identity check (the leaf
key survives a new session, the session secrets do not), per-strategy MITM invariants —
including that each strategy is run against the session's own CertificateVerify transcript
— AES-128-GCM round-trip + tamper rejection + per-record nonce uniqueness, a 40-session
end-to-end agreement loop, a check that each step's transcript chip names (and displays)
the run of messages its signature or MAC actually covers, a check that `Finished`
verification fails when the two sides derived from different ECDHE secrets, a gate on each
"Break this handshake" fault asserting both which verdicts it must flip *and* which it must
leave alone (the ECDHE fault must not disturb `CertificateVerify`; the in-flight byte flip
must not disturb chain validation), and a source
scan that rejects `Math.random`. The resumption phase adds 13 published values from RFC 8448
§§3–4 (resumption secret, PSK, binder derivation, early/handshake/main secrets, and the
encrypted early record), plus a generated multi-block AEAD round-trip and every replay,
fallback, and ticket-key-compromise outcome. The same gates
gate the GitHub Pages deploy (`.github/workflows/deploy.yml`). The protocol regressions also check
stale first arrivals under all five policies, zero-lifetime and exact-deadline expiry, invalid
lifetime encodings, missing/mismatched groups, and each failed full-handshake precondition.
The service-binding phase checks the full eight-route/four-policy matrix, every
cryptographic failure independently, name-versus-SNI separation, missing/disjoint/invalid
ALPN, exact protocol identifiers, and handler consistency. Browser tests verify the
rendered matrix, live handshake-fault propagation, keyboard focus, and reachable verdict
states through the existing accessibility/contrast/reflow gate at desktop and 320px.

The mutation ledger in `scripts/mutation-ledger.json` changes binder admission, replay stores,
freshness enforcement, PSK/DHE derivation, fallback, handshake eligibility, group advertisement,
expiry, and regional results. For each entry the runner proves baseline green, a non-empty source
diff, a successful build with a changed JavaScript bundle hash, failure of the single named owning
assertion, and restored source/hash/test success. Compilation, startup, navigation, skipped tests,
and test timeouts cannot count as kills. This gate runs before the Pages artifact is uploaded.

## Part of the Crypto-Lab Suite

Browse related teaching labs at
[systemslibrarian.github.io/crypto-lab](https://systemslibrarian.github.io/crypto-lab/).

Related: [pq-tls-handshake](https://systemslibrarian.github.io/crypto-lab-pq-tls-handshake/) ·
[ssh-handshake](https://systemslibrarian.github.io/crypto-lab-ssh-handshake/) ·
[key-exchange](https://systemslibrarian.github.io/crypto-lab-key-exchange/) ·
[pki-chain](https://systemslibrarian.github.io/crypto-lab-pki-chain/)

## License

[MIT](LICENSE) © Paul Clark (systemslibrarian)

---

*"Whether you eat or drink, or whatever you do, do all to the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## SPAKE Gate

- **slug**: `crypto-lab-spake-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-spake-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-spake-gate/
- **commit_sha**: `8ed00490c51d9a41fb54a1829bd93ab3558a64e5` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE  ·  **level**: advanced  ·  **--accent**: #6d28d9
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: SPAKE Gate  — _read from src/main.ts_

**Subtitle**: SPAKE2 & SPAKE2+ · RFC 9382 · RFC 9383  — _read from src/main.ts_

**Description**: Runs real SPAKE2 and SPAKE2+ over P-256 on one password, then steals both server databases so you can watch exactly what a balanced leak hands over versus an augmented one.  — _read from src/main.ts_

**Why it matters**: Databases get breached. A balanced PAKE server holds a secret that IS the user; an augmented one holds a verifier that only forces an offline guess. Same login, wildly different blast radius when it leaks.  — _read from src/main.ts_

**Card copy**: SPAKE2 and SPAKE2+ on the same password, side by side — indistinguishable until the server database leaks, then one impersonation costs nothing and the other forces an offline crack.

**Chips**: SPAKE2 · SPAKE2+ · P-256 · PAKE

**Implements**: HKDF `src/spake/transcript.ts:52`, HMAC `src/spake/transcript.ts:41`, P-256 `src/spake/group.ts:66`, PBKDF2 `src/spake/password.ts:49`, SHA-256 `src/spake/transcript.ts:37`, SPAKE2 `src/spake/spake2.ts:119`

**Attacks shown**: Dictionary attack `src/attack/offline.ts:106`, Discrete log `src/main.ts:97`, Man-in-the-middle `src/ui/constants.ts:60`, Side-channel (unspecified) `README.md:72`

**Comment-only (named in code comments, not executed)**: Argon2 `src/spake/password.ts:4`, CPace `src/ui/comparison.ts:4`, Diffie-Hellman `src/attack/offline.ts:56`, Hash-to-curve `src/ui/constants.ts:9`, J-PAKE `src/ui/comparison.ts:4`, OPAQUE `src/ui/comparison.ts:1`, OPRF `src/ui/comparison.ts:4`, scrypt `src/spake/password.ts:4`, SRP `src/ui/comparison.ts:4`

**References**: CPace, Diffie-Hellman, Dragonfly, EC point arithmetic, ECDH, Hash-to-curve, J-PAKE, Kerberos, OPAQUE, OPRF, Pairing, SRP

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `RFC 9382` — first seen README.md:3 (18×)
- `RFC 9383` — first seen README.md:3 (22×)
- `RFC 9807` — first seen README.md:55 (3×)

**README — What Can Go Wrong**:

```text
- **Trapdoored M/N.** If anyone knew the discrete log of M or N with respect to the base point P (a scalar `m*` with `M = m*·P`), a malicious server or man-in-the-middle could convert its single online guess per session into an unlimited *offline* dictionary attack. This is why M and N are fixed, seed-derived by hash-to-curve, and public — so no such discrete log is known to anyone.
- **Weak passwords.** Against a stolen SPAKE2+ record, a dictionary word is recovered in milliseconds. The augmented record only raises the cost from *zero* (SPAKE2) to *one offline guess per candidate* (SPAKE2+).
- **Low KDF cost.** This demo uses a deliberately low PBKDF2 iteration count so the attack is visible in a tab. Real deployments use a per-record salt and far more iterations, slowing the attacker — but not changing which side can be impersonated.
- **Balanced storage of many users' `w`.** Using SPAKE2 as a server login scheme means the database *is* the set of every user's credential.
```

**Claims tested** (e2e/claims.spec.ts, 1 test(s)):

- `M and N distinguish RFC derivation evidence from work rerun in-page` — e2e/claims.spec.ts:3
    - :7 `toHaveCount` expected `2` _(literal)_
    - :8 `toHaveCount` expected `2` _(literal)_
    - :9 `toContainText` expected `'we do not re-run the full hash-to-curve derivation in-page'` _(literal)_
    - :10 `toContainText` expected `'derived by hashing the seed'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# SPAKE Gate

**SPAKE2 (RFC 9382) & SPAKE2+ (RFC 9383) over P-256 — a balanced and an augmented PAKE on the same password, side by side, so you can see exactly what each server keeps and what an attacker gets when the database leaks.**

A browser teaching demo in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite. Real crypto, no backend, everything in memory.

## What It Is

A **PAKE** (Password-Authenticated Key Exchange) turns a shared password into a strong shared key without ever putting the password on the wire and without leaking anything an eavesdropper could grind offline.

- **SPAKE2** is a *balanced* PAKE: both parties hold the same secret scalar `w` (derived from the password). The server stores `w`.
- **SPAKE2+** is an *augmented* PAKE: registration splits the password into `w0` and `w1`. The client keeps both; the server stores only `w0` and the point `L = w1·P`. That record can *verify* a login but cannot *perform* one.

On a good day the two are indistinguishable — same handshake, same session key. The difference only appears when the server's database leaks:

- Steal a **SPAKE2** database → you have `w`, and `w` is everything the client uses on this service. You **are** the client, permanently, with **no cracking**. (The plaintext password isn't directly exposed — `w` is a PBKDF2 image — so reuse on *other* sites still needs an offline crack; but impersonation *here* needs none.)
- Steal a **SPAKE2+** database → you have `(w0, L)`. You cannot impersonate the client without `w1`, so you are **forced into an offline dictionary attack** on the password. A weak password falls; a strong one holds.

**Precision that matters:** SPAKE2+ does **not** prevent an offline attack — it *forces* one. Augmentation buys work, not immunity.

The SPAKE2 and SPAKE2+ logic is **hand-rolled** over real P-256 (the elliptic-curve group and hash primitives come from the audited [`@noble/curves`](https://github.com/paulmillr/noble-curves) / `@noble/hashes`). The M/N masking — the actual teaching subject — is written out in full so you can read it. **This is a teaching demo, not production crypto.**

## Exhibits

1. **The M / N mask, stepped** — the headline mechanism. Watch a real Diffie–Hellman share `X = x·P` get blinded to `pA = X + w·M`, see the *observer's view* (a uniformly random point that leaks nothing), then watch the peer subtract `w·M` back off and both sides land on the same key `K` (compared byte-for-byte).
2. **Why M and N are nothing-up-my-sleeve** — the two fixed constants, their derivation seeds, and the exact requirement: nobody may know the discrete log of `M` or `N` with respect to the base point `P` (no scalar `m*` with `M = m*·P`, no `n*` with `N = n*·P`). RFC 9382 §7 puts it as "the generation methods specified in this document are designed to eliminate concerns related to knowing discrete logs of M and N."
3. **Steal the database** — register one password on a balanced server and an augmented one, steal both, and see what the thief can do. The **cryptographic result** and the **security verdict** are shown as two independent indicators: a forged-but-accepted login reads as **ALARM**, not green. Includes a **real offline dictionary attack** you run against the stolen SPAKE2+ record — it succeeds on `password123` and fails on a strong passphrase.
4. **SPAKE2 vs SPAKE2+ vs OPAQUE** — a three-way table of what each server stores, what breaks on compromise, and how registration differs.
5. **You already run this: Matter / Thread** — SPAKE2+ is what commissions your smart-home devices; the QR code is the password.

## When to Use It

- **Use SPAKE2+** when a server authenticates users by password and you want a database leak to force offline work rather than hand over impersonation — e.g. device commissioning (Matter/Thread), or any augmented login where you cannot assume the server is never breached.
- **Use SPAKE2** only when both endpoints legitimately share the secret and neither is a persistent, breachable store of many users' passwords (e.g. a symmetric pairing between two devices you control).
- **Do NOT use SPAKE2** as a server-side password-authentication scheme for many users. A single database leak is total account takeover with no cracking step. This is the failure the demo exists to show.
- **Do NOT treat any PAKE as a substitute for a strong password.** Augmented PAKEs force offline attacks; they do not survive guessable passwords.

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-spake-gate/**

Type a password, steal both databases, and run the offline attack. Everything runs client-side; nothing is stored or transmitted.

## What Can Go Wrong

- **Trapdoored M/N.** If anyone knew the discrete log of M or N with respect to the base point P (a scalar `m*` with `M = m*·P`), a malicious server or man-in-the-middle could convert its single online guess per session into an unlimited *offline* dictionary attack. This is why M and N are fixed, seed-derived by hash-to-curve, and public — so no such discrete log is known to anyone.
- **Weak passwords.** Against a stolen SPAKE2+ record, a dictionary word is recovered in milliseconds. The augmented record only raises the cost from *zero* (SPAKE2) to *one offline guess per candidate* (SPAKE2+).
- **Low KDF cost.** This demo uses a deliberately low PBKDF2 iteration count so the attack is visible in a tab. Real deployments use a per-record salt and far more iterations, slowing the attacker — but not changing which side can be impersonated.
- **Balanced storage of many users' `w`.** Using SPAKE2 as a server login scheme means the database *is* the set of every user's credential.

## Real-World Usage

- **Matter / Thread** commissioning uses SPAKE2+ (PASE) with the printed setup code as the password.
- **SPAKE2** is used in some symmetric device-pairing and Kerberos-adjacent contexts where both sides share the secret.
- **OPAQUE** (RFC 9807) is the OPRF-based augmented aPAKE for password logins where the server should never see the password at all — see the sibling demo.

## How to Run Locally

`​``bash
npm install
npm run dev        # start the Vite dev server
npm test           # run the Vitest known-answer + attack tests
npm run build      # production build to dist/
npm run test:a11y  # WCAG 2.1 AA gate (axe-core via Playwright), both themes
`​``

Requires Node 20.19+; CI uses Node 24. The a11y gate needs a Chromium browser: `npx playwright install chromium`.

## Related Demos

- **[OPAQUE Gate](https://systemslibrarian.github.io/crypto-lab-opaque-gate/)** — the OPRF-based augmented aPAKE (RFC 9807).
- **[PAKE Gate](https://systemslibrarian.github.io/crypto-lab-pake-gate/)** — the wider PAKE survey (SRP-6a, J-PAKE, CPace, Dragonfly, and the Dragonblood side-channel).
- **EC Point Arithmetic / Curve Lens** — the elliptic-curve point operations underpinning the mask.

## Build & Verify

- **27 tests** (Vitest):
  - **10 known-answer tests** reproducing the RFC vectors bit-for-bit:
    - `src/spake/spake2.test.ts` — all **4** RFC 9382 Appendix B SPAKE2 vectors (shares, `K`, transcript, `Ke/Ka`, `KcA/KcB`, both confirmation MACs), plus the M/N constant check.
    - `src/spake/spake2plus.test.ts` — the RFC 9383 Appendix C SPAKE2+ vector (record `L`, shares, `Z`, `V`, transcript, `K_main`, confirmation keys, `K_shared`, both MACs).
  - **8 attack tests** (`src/attack/offline.test.ts`): the offline dictionary attack cracks a weak password and fails on a strong one; the recovered `w1` genuinely reconstructs `L`; a forged SPAKE2+ login built from the cracked halves is accepted by an honest verifier holding only `(w0, L)` — and is **rejected** when `w1` is wrong even though `w0` is right; and a stolen SPAKE2 `w` is accepted by the real verifier while a wrong `w` is rejected.
  - **9 primitive compatibility controls** (`src/spake/primitive-compatibility.test.ts`): P-256 encoding against native ECDH, malformed/off-curve/infinity rejection, scalar boundaries, and SHA-256/HMAC/HKDF/PBKDF2 against Node's independent crypto provider. These controls supplement the published protocol vectors; they do not establish constant-time execution or production suitability.
- **Accessibility gate:** `@axe-core/playwright` scans the production build for zero WCAG 2.1 A/AA violations in **both** themes; the GitHub Pages deploy is blocked if it fails.

## Performance

The full SPAKE2/SPAKE2+ handshake is a handful of P-256 scalar multiplications — sub-millisecond. The offline attack's cost is dominated by PBKDF2; the demo's low iteration count keeps a full dictionary sweep under a second so it renders live.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## PQXDH Wire

- **slug**: `crypto-lab-pqxdh-wire`
- **repo**: https://github.com/systemslibrarian/crypto-lab-pqxdh-wire
- **live**: https://systemslibrarian.github.io/crypto-lab-pqxdh-wire/
- **commit_sha**: `6a01beb5abbf41c6087854f2a0d8ba942c3c938f` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `f6183edf1777395d95aac9ea034828c4a35ca5f7`
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | POST-QUANTUM  ·  **level**: advanced  ·  **--accent**: #ff7eb6
- **MISSING FIELDS**: verification

**Name (H1)**: PQXDH Wire  — _read from src/main.ts_

**Subtitle**: Post-quantum asynchronous handshake · Signal PQXDH · Revision 3  — _read from src/main.ts_

**Description**: Run four real X25519 agreements and one real ML-KEM encapsulation into a single HKDF, then expose each input to two modeled adversaries.  — _read from src/main.ts_

**Why it matters**: Traffic recorded today may be attacked when a large quantum computer exists. PQXDH protects the initial session key against that future decryption threat, while leaving authentication and later classical ratcheting as separate problems.  — _read from src/main.ts_

**Card copy**: One ML-KEM secret added to the X3DH transcript is what survives a future curve break. The prekey signature and the ratchet after it are untouched, so Bob can still be impersonated with every check green.

**Chips**: X25519 · ML-KEM-1024 · HKDF-SHA-512 · Ed25519

**Implements**: AES `src/crypto/aead.ts:20`, AES-GCM `src/crypto/aead.ts:20`, Diffie-Hellman `src/model/ratchet-step.ts:74`, Ed25519 `src/pqxdh/bundle.ts:1`, HKDF `src/model/ratchet-step.ts:11`, ML-KEM `src/pqxdh/alice.ts:2`, PQXDH `src/pqxdh/kdf.ts:6`, SHA-512 `src/model/ratchet-step.ts:3`, X25519 `src/model/quantum.ts:1`, X3DH `src/main.ts:18`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Shor's algorithm `src/model/ratchet-step.ts:28`

**References**: Double Ratchet, EdDSA, Kyber, Shor's algorithm

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `FIPS 203` — first seen README.md:9 (7×)
- `RFC 5869` — first seen README.md:100 (4×)
- `RFC 7748` — first seen README.md:99 (5×)
- `rfc5869` — first seen README.md:208 (2×)
- `rfc7748` — first seen README.md:208 (2×)

**README — What Can Go Wrong**:

```text
- A bad signed prekey must abort Alice before key agreement.
- A modified ML-KEM ciphertext produces a pseudorandom rejected secret; the mismatch appears at AES-GCM authentication, not as a decapsulation error.
- Reusing the signed last-resort PQ prekey widens the impact of a later private-key compromise compared with deleting a one-time key.
- PQXDH authentication is not quantum-secure. An active quantum adversary that forges the classical identity signature can impersonate Bob while all checks pass.
- A classical X25519 Double Ratchet step provides classical post-compromise healing, not post-quantum healing. Signal's SPQR and Triple Ratchet address that later phase.
- Omitting `F`, changing the DH order, or failing to bind the KEM public key in associated data changes the protocol transcript.
```

**Claims tested** (e2e/claims.spec.ts, 9 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:8
    - :8 `toContainText` expected `expected` _(expression)_
- `recomputes the displayed SK independently from displayed KDF inputs` — e2e/claims.spec.ts:20
    - :35 `toHaveText` expected `expected` _(expression)_
    - :36 `toHaveText` expected `expected` _(expression)_
    - :37 `toHaveText` expected `expected` _(expression)_
- `names each real rejection cause` — e2e/claims.spec.ts:40
    - :42 `toContainText` expected `'Signed ML-KEM prekey signature verification failed'` _(literal)_
    - :45 `toContainText` expected `'Initial AEAD authentication failed after ML-KEM implicit rejection'` _(literal)_
- `derives no adversary SK until both modeled assumptions are granted` — e2e/claims.spec.ts:48
    - :53 `toContainText` expected `'SS = UNKNOWN · SK = NOT DERIVED'` _(literal)_
    - :54 `toHaveCount` expected `0` _(literal)_
    - :57 `toHaveText` expected `honestKey ?? ''` _(expression)_
- `shows last-resort reuse without claiming that reuse alone reveals SK` — e2e/claims.spec.ts:60
    - :63 `toContainText` expected `'SAME PQ KEY ID'` _(literal)_
    - :64 `toContainText` expected `'Reuse does not reveal either SK by itself'` _(literal)_
- `retires a completed handshake on reset and preserves it for a no-op check` — e2e/claims.spec.ts:67
    - :72 `toBeVisible` expected _no expected value_ _(none)_
    - :73 `toHaveText` expected `honestKey ?? ''` _(expression)_
    - :76 `toBeHidden` expected _no expected value_ _(none)_
    - :77 `toBeHidden` expected _no expected value_ _(none)_
    - :78 `toContainText` expected `'READY'` _(literal)_
    - :79 `toHaveText` expected `'not available'` _(literal)_
    - :80 `toHaveText` expected `'not available'` _(literal)_
    - :81 `toContainText` expected `honestKey ?? ''` _(expression)_
    - :90 `toHaveAttribute` expected `'title'` _(literal)_
- `keeps hidden states genuinely hidden` — e2e/claims.spec.ts:94
    - :95 `toHaveAttribute` expected `'hidden', ''` _(expression)_
    - :96 `toHaveAttribute` expected `'hidden', ''` _(expression)_
    - :97 `toHaveAttribute` expected `'hidden', ''` _(expression)_
    - :98 `toBeHidden` expected _no expected value_ _(none)_
    - :101 `toHaveAttribute` expected `'href', '#app'` _(expression)_
    - :104 `expect` expected _no expected value_ _(none)_
- `reaches the authenticated impersonation negative-claim fixture` — e2e/claims.spec.ts:107
    - :109 `toContainText` expected `'PQ-CONFIDENTIAL — AND IMPERSONATED'` _(literal)_
    - :110 `toBeVisible` expected _no expected value_ _(none)_
    - :117 `toHaveLength` expected `4` _(literal)_
    - :118 `toBe` expected `true` _(expression)_
    - :119 `toContainText` expected `'FAIL'` _(literal)_
    - :120 `toContainText` expected `"signer is Bob's identity key: PASS"` _(literal)_
    - :121 `toContainText` expected `"Alice's initial AES-GCM message opened: PASS"` _(literal)_
- `reaches both reduced-ratchet negative-claim outcomes` — e2e/claims.spec.ts:124
    - :127 `toContainText` expected `'HEALED'` _(literal)_
    - :128 `toContainText` expected `'STILL READ'` _(literal)_
    - :129 `toContainText` expected `'DID NOT HEAL'` _(literal)_
    - :138 `toHaveLength` expected `4` _(literal)_
    - :139 `toBe` expected `4` _(literal)_
    - :140 `toBe` expected `compromised.slice(0, 8)` _(expression)_
    - :144 `toContainText` expected `'HEALED — AND STILL READ'` _(literal)_
    - :145 `toBeVisible` expected _no expected value_ _(none)_

**Mutation records** (1 file(s)):

- `e2e/verdict-mutations.json` (12344 bytes)

<details><summary>Full README</summary>

```markdown
# PQXDH Wire

## What It Is

PQXDH Wire is an interactive, browser-only walkthrough of Signal's PQXDH Revision 3 key agreement. It runs four X25519 agreements, strict Ed25519 prekey signatures, ML-KEM-1024, HKDF-SHA-512, and AES-256-GCM with real cryptographic implementations. Alice and Bob derive the session key in separate modules and compare all 32 bytes.

The lab teaches one boundary: adding an independent post-quantum KEM secret to the X3DH transcript prevents a modeled future curve break from recovering the initial session key. The curve and lattice breaks are explicitly modeled by handing private values to an adversary module; no quantum algorithm runs in the browser.

This is not production cryptography. It uses Ed25519 instead of XEdDSA and standardized FIPS 203 ML-KEM-1024 instead of Revision 3's example CRYSTALS-KYBER-1024. Kyber round 3 and ML-KEM are not wire-compatible. Reset best-effort overwrites the live handshake's retained secret arrays and removes rendered key text, but JavaScript cannot guarantee secure erasure; reload discards the page context.

## Exhibits

1. **Build the transcript** — publish Bob's signed bundle, derive Alice's four DH outputs and KEM secret, send the initial message, derive independently as Bob, and compare the session keys.
2. **Open the boxes** — grant a model every X25519 private key, then separately grant the ML-KEM shared secret and watch the adversary recompute only when all inputs exist.
3. **Break real checks** — corrupt the signed ML-KEM prekey and flip a ciphertext bit against the actual Ed25519, ML-KEM, and AES-GCM paths.
4. **Reuse the fallback** — exhaust one-time PQ prekeys and watch the page measure three facts before it says anything: that the served key really is the last-resort key, that both sessions cite one PQ prekey id, and that the per-session KEM secrets still differ. It does not claim reuse alone reveals either session key.
5. **Forge authentication** — grant an active model Bob's classical signing and curve identity secrets; every check passes while Alice talks to the adversary.
6. **Follow the ratchet** — run a reduced three-step X25519 root-key model. The adversary keeps its own root chain, advanced only from the public transcript plus whatever the model grants it, so `HEALED` and `HEALED — AND STILL READ` are a comparison of two chains rather than a restatement of the premise.
7. **Diff X3DH and PQXDH** — inspect the exact 32-byte KDF addition and 1,568-byte initial-message addition.

## When to Use It

Use this lab to learn the boundary between PQXDH's post-quantum initial-key confidentiality and its classical authentication, to inspect Revision 3's transcript ordering, or to test how implicit rejection surfaces at the first AEAD.

Do not use this code as a messaging protocol, a libsignal-compatible implementation, a Double Ratchet implementation, or evidence that a real quantum computer has broken X25519 or ML-KEM. Production systems need reviewed protocol state, serialization, erasure, side-channel controls, prekey-server behavior, replay handling, and a production cryptographic backend.

## Live Demo

[Open PQXDH Wire on GitHub Pages](https://systemslibrarian.github.io/crypto-lab-pqxdh-wire/).

Complete the five handshake steps, inspect every KDF input, enable each adversary capability, then run the signature, KEM-ciphertext, prekey-reuse, impersonation, and ratchet fixtures.

Every outcome the page renders carries a `data-verdict` marker and every number it renders carries a `data-claim` marker, and every marker of either kind is killed by a recorded mutation (below). No verdict and no measurement on this page is a constant.

## What Can Go Wrong

- A bad signed prekey must abort Alice before key agreement.
- A modified ML-KEM ciphertext produces a pseudorandom rejected secret; the mismatch appears at AES-GCM authentication, not as a decapsulation error.
- Reusing the signed last-resort PQ prekey widens the impact of a later private-key compromise compared with deleting a one-time key.
- PQXDH authentication is not quantum-secure. An active quantum adversary that forges the classical identity signature can impersonate Bob while all checks pass.
- A classical X25519 Double Ratchet step provides classical post-compromise healing, not post-quantum healing. Signal's SPQR and Triple Ratchet address that later phase.
- Omitting `F`, changing the DH order, or failing to bind the KEM public key in associated data changes the protocol transcript.

## Real-World Usage

Signal introduced PQXDH to resist harvest-now-decrypt-later attacks against asynchronous session setup. This lab pins the public specification at Revision 3, dated 2023-05-24 and last updated 2024-01-23. Signal's implementation uses a Kyber-1024 profile; this browser lab deliberately uses the standardized, non-wire-compatible ML-KEM-1024 primitive and labels that deviation throughout.

Signal announced SPQR and the Triple Ratchet on 2025-10-02 to add post-quantum forward secrecy and post-compromise security after session setup.

## How to Run Locally

Requires Node.js 22 or newer.

`​``bash
npm ci
npm run dev
`​``

Vite prints the local URL. To run every gate exactly as CI does:

`​``bash
npm run test:coverage
npm run build
npx playwright install chromium
npm run test:a11y
`​``

To see a verdict fail, apply one of the recorded mutations and rerun. `CI=1` is
required: it turns off Playwright's `reuseExistingServer`, so the suite cannot
hit a stale server built from unmutated code and report a survivor.

`​``bash
npm run mutate list
npm run mutate apply ratchet-grant-is-not-a-recovery
CI=1 npm run test:verdicts     # ratchet-heal must fail on its own assertion
npm run mutate revert ratchet-grant-is-not-a-recovery
`​``

`npm run test:verdicts` and the full suite both run `e2e/verdicts.spec.ts`, which
is what the runtime coverage rule in `globalTeardown` reads. A narrowed run that
leaves that file out cannot answer the rule and says so rather than passing
quietly.

## Related Demos

- [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) — the full browser-demo catalog.
- [Signal X3DH specification](https://signal.org/docs/specifications/x3dh/) — the classical handshake PQXDH extends.
- [Signal Double Ratchet specification](https://signal.org/docs/specifications/doubleratchet/) — the post-handshake ratchet modeled here only at one reduced boundary.
- [Signal Protocol and Post-Quantum Ratchets](https://signal.org/blog/spqr/) — where SPQR and the Triple Ratchet take the story next.

## Build & Verify

The repository has **51 executable tests**: 25 Vitest unit/correctness tests and 26 Playwright tests (2 accessibility, 8 claims, 12 per-marker, 4 verdict-coverage), plus one run-scoped coverage rule checked in `globalTeardown` rather than as a test.

V8 coverage over the cryptographic, protocol, model, and verification modules is 95.80% statements, 95.18% branches, 91.17% functions, and 96.12% lines. CI enforces floors of 90% statements, 85% branches, 85% functions, and 90% lines.

Three specification known-answer tests are pinned in source:

- RFC 7748 X25519 test vector.
- RFC 5869 HKDF test case 1.
- NIST ACVP FIPS 203 ML-KEM-1024 keyGen `tgId 3 / tcId 51`, checked against digests of the complete 1,568-byte encapsulation key and 3,168-byte decapsulation key.

The remaining correctness tests cover independent Alice/Bob derivation, exact `F || DH1 || DH2 || DH3 || DH4 || SS` ordering, signature failure, curve-prekey exhaustion, last-resort fallback, ML-KEM implicit rejection, adversary input isolation, classical impersonation, and reduced-ratchet outcomes. No stable byte-for-byte libsignal PQXDH transcript vector was found in the public repository search on 2026-09-11; the lab states that limit instead of presenting component tests as an end-to-end interoperability vector.

The Playwright gate builds before serving, drives every real UI state at desktop and 380 px, runs Axe WCAG 2.1 A/AA, asserts Axe's incomplete bucket, measures text and non-text contrast, checks reflow and keyboard-reachable scrollers, independently recomputes HKDF with Node's `crypto`, and exercises both negative claims.

### Verdict coverage

Reading the code is not evidence that a rendered outcome is real. Three of this
fleet's eight audited labs shipped a verdict that could not come out the other
way, and none was caught by reading. This lab's own `checksGreen` was a literal
until a66045f, and an auditor then found `stillReadable` in
`src/model/ratchet-step.ts` true by construction for the same reason.

So coverage here is derived from the rendered page, never from a list written by
hand:

- Every element that renders an outcome carries `data-verdict="<id>"`. There are
  eleven: `handshake-status`, `session-key-match`, `session-key-state`,
  `kdf-input-state`, `adversary-model`, `prekey-signature-abort`,
  `kem-tamper-abort`, `last-resort-reuse`, `impersonation`, `ratchet-heal`,
  `wire-secrecy`.
- Every element that renders a measurement carries `data-claim="<id>"`, with the
  machine value in `data-value`. There are six: `wire-kem-ct-bytes`,
  `wire-ad-bytes`, `wire-scanned-secret-bytes`, `wire-secret-bytes`,
  `ratchet-honest-updates`, `ratchet-model-updates`. A rendered
  number is a claim in exactly the way a rendered word is, and it is the easier
  one to leave unchecked, because a number does not look like a claim. Three of
  them were `1,568 B`, `1,632 B` and `0 B` written into the page template until
  this pass — and `0 B`, the strongest claim the exhibit makes, was a literal
  about nothing. `wire-scanned-secret-bytes` is the anti-vacuity figure: a search
  reporting "found none" is evidence only if the page also says how much it
  looked for. The two `ratchet-*-updates` counts replace the English words
  "Three" and "all three", which no oracle compared to the chain beside them —
  an auditor rendered *"Seven honest root updates completed"* over a four-root
  chain with every check green.
- `e2e/verdicts.spec.ts` asserts what each marker renders **and the state it
  paints**, together, through `expectVerdict` / `expectClaim`. The helper
  refuses a text-only claim: a mutation that flips the words while leaving
  `data-result="pass"` in place would otherwise be recorded as a kill, and the
  marker would go on claiming pass in every way a reader can see except the
  sentence.
- `e2e/verdict-mutations.json` records the mutations that kill them — a
  single-token edit to real source that forces the measured value the other way
  — and, per marker, the **test and the exact claim** that does the killing.
- That record is checked against what RAN, not against the spec's source text.
  `expectVerdict` / `expectClaim` append every `(test, marker, claim)` they
  execute to a run-scoped sink, and `e2e/global-teardown.ts` fails the run if any
  recorded kill is missing from it. The rule this replaces scanned
  `verdicts.spec.ts` for the substring `expectVerdict(page, '<id>'`, and across
  this lane auditors defeated that form three ways: **comment the call out** and
  the substring survives inside the comment; **rewrite the killing assertion**
  and let an unrelated call elsewhere in the file satisfy a file-granular rule;
  **keep the call but feed it values read off the page** in the same test. A
  mention is not an assertion — which is the defect the helper rule existed to
  close, one level down. Pinning the claim as well as the pair is what reaches
  the third: on an unmutated page a tautological argument is byte-identical to a
  correct one and no runtime rule can separate them, so it is caught the moment
  the page moves, which is the state the escape was built to survive.
- `e2e/drive-every-state.ts` is the denominator, not a test. It visits every
  option of every control that changes what renders — each control on its own,
  not the full cross-product — because a marker that appears only in a state the
  walk never reaches is outside the set the coverage rules judge. The table in
  that file lists every control and what it owes, and names the three controls
  deliberately skipped with the reason.
- `e2e/verdict-coverage.spec.ts` enumerates over that walk and fails on a
  rendered marker of **either** family that no mutation covers, on a mutation
  naming a marker the page never renders, on a covered id that no
  `expectVerdict` / `expectClaim` call asserts, on a mutation whose `find` no
  longer matches its file, and on any verdict word, verdict styling **or
  digit-plus-unit measurement** rendered outside a marker in a result region.
  Its last test injects a raw unmarked banner, a raw unmarked number and a bare
  unmarked state hook the way a careless builder would, and fails if the scanner
  stays quiet. `[data-outcome]` is in the styling selector because of a real one:
  `#comparison-panel` carried `data-outcome="pass" | "alarm"` outside every
  marker, so it could have painted the card pass while the verdict inside it said
  alarm. The card is keyed off the marker's own `data-result` now, and the
  attribute name stays in the selector so a replacement cannot arrive unmarked.

A kill counts only when the unmutated baseline passed in the same run, the
failure is that verdict's own assertion rather than a build error or a blank
page, and the server served the mutated code. All thirteen recorded mutations
were run that way, with `CI=1`; each failed the markers it claims to cover, on those
markers' own assertions, and no other per-marker test. Several also turn the
coverage walk red, which is expected rather than collateral damage: the walk
asserts the intermediate states it steps through, and `every recorded mutation
still applies to the source it names` necessarily fails while a mutation is
applied, because the `find` string it looks for is the line the mutation just
replaced.

Two limits this exhibit cannot exceed are recorded rather than papered over.
`wire-scanned-secret-bytes` sums each secret at its own width, but every secret
here is 32 B, so summing them and multiplying one width by six render the
identical `192 B` — `secrets.length * 32` would survive this suite, and the
source comment says so instead of claiming a mechanism the page cannot show. The
reduced ratchet is a fixed three-step model with no control that varies it, so
the four-root chain length is pinned by the oracle; what is now *derived* is the
count rendered beside it, which is the thing that was an English literal.

`verdict-gate` is a separate job so it is a separate check, and `deploy` and
`dependabot-auto-merge` both list it in `needs:`. `main` here carries no branch
protection, so it is not a *required* status check — `needs:` is what actually
holds, and it covers a direct push to `main`, which skips pull-request checks
entirely. Whether protection spreads beyond this fleet's three pilot labs is the
maintainer's call and is deliberately not changed from inside this lane. CI
blocks deployment unless every check passes.

Primary sources: [PQXDH Revision 3](https://signal.org/docs/specifications/pqxdh/), [RFC 7748](https://www.rfc-editor.org/rfc/rfc7748), [RFC 5869](https://www.rfc-editor.org/rfc/rfc5869), [FIPS 203](https://csrc.nist.gov/pubs/fips/203/final), and [Bhargavan et al., USENIX Security 2024](https://www.usenix.org/conference/usenixsecurity24/presentation/bhargavan).

## Performance

All operations run on the main browser thread for inspectability. A handshake performs four X25519 agreements per party, one ML-KEM-1024 encapsulation and decapsulation, two HKDF derivations, and one AES-GCM round trip. This is intentionally a single-session teaching workload, not a throughput benchmark; JavaScript timing is not constant-time and must not be treated as side-channel evidence.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Agreeing in Public

- **slug**: `crypto-lab-agreeing-in-public`
- **repo**: https://github.com/systemslibrarian/crypto-lab-agreeing-in-public
- **live**: https://systemslibrarian.github.io/crypto-lab-agreeing-in-public/
- **commit_sha**: `0aea1597dcf46dcb48268ad585f47259011a78d0` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `4089dabb08ea44806bf777a7a3bfab1e208c94d9`
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE  ·  **level**: beginner  ·  **--accent**: #35d6bb
- **MISSING FIELDS**: verification

**Name (H1)**: Agreeing in Public  — _read from src/main.ts_

**Subtitle**: X25519 · RFC 7748 · key agreement  — _read from src/main.ts_

**Description**: Runs one real X25519 exchange and shows the two sides landing on the identical 32 bytes, beside  — _read from src/main.ts_

**Why it matters**: Almost every secure connection starts with two strangers needing the same key and having no  — _read from src/main.ts_

**Card copy**: The paint-mixing picture, then one real X25519 exchange with both sides&rsquo; secrets compared byte for byte — and a stranger who answers in Bob&rsquo;s place while every check on the page still passes. No modulus, no exponent.

**Chips**: X25519 · RFC 7748 · Key Agreement · No Authentication

**Implements**: X25519 `src/x25519/agree.ts:64`

**Attacks shown**: Man-in-the-middle `src/main.ts:145`

**Comment-only (named in code comments, not executed)**: Diffie-Hellman `src/exchange/impostor.ts:20`, EC point arithmetic `src/x25519/vectors.ts:11`, Pairing `src/ui/eavesdrop-panel.ts:31`

**References**: Diffie-Hellman, ECDH, Ed25519, PQXDH, Pairing, TLS 1.3, X3DH

**Standards body**: IETF

**Implementation**: @noble

**Spec citations, exactly as written**:

- `RFC 7748` — first seen README.md:3 (31×)
- `rfc7748` — first seen README.md:13 (2×)

**README — What Can Go Wrong**:

```text
- **Mistaking agreement for authentication.** This is the big one, and it is why panel 4 exists.
  Alice's secret matches the secret held by whoever sent the value she received. Nothing in X25519
  says who that was, and there is no error code when it is not who she expected.
- **Trusting the analogy too far.** Equal-parts paint mixing has the commutativity the story needs
  and none of the one-wayness. A watcher *can* unmix it; the panel says so and a unit test proves
  it. It is labelled an analogy, and panel 2 is the real thing on purpose.
- **Reading the size of the guessing space as the strength of the cipher.** The space of distinct
  private values is 76 digits long; the figure usually quoted for X25519's strength is lower,
  because the best known attacks do better than trying every value. Neither number is on the main
  path, and the expert disclosure says why.
- **A public value of low order.** RFC 7748 §6.1 notes that both parties may check whether the
  resulting value is all-zero and abort. The lab performs that check and reports it;
  `@noble/curves` additionally refuses such a value before an all-zero result could be returned,
  which `src/x25519/agree.test.ts` measures rather than assumes.
- **Reusing a private value forever.** Nothing here rotates anything. Forward secrecy comes from
  generating a fresh pair per session, which is what "ephemeral" means in ECDHE; this lab
  generates a fresh pair per press and says nothing stronger.
- **Reading the shared secret as a key.** In practice it is run through a KDF before anything uses
  it. That step is out of scope here and is not performed.
```

**Claims tested** (e2e/claims.spec.ts, 21 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:49
    - :49 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:51
    - :51 `toHaveAttribute` expected `'open', ''` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:56
    - :56 `expect` expected _no expected value_ _(none)_
- `the shared secret is what X25519 independently says it should be` — e2e/claims.spec.ts:59
    - :63 `toMatch` expected `HEX` _(expression)_
    - :64 `toMatch` expected `HEX` _(expression)_
    - :69 `toHaveAttribute` expected `'data-value', derived` _(expression)_
    - :70 `toContainText` expected `derived.slice(0, 16)` _(expression)_
- `the two sides are two computations, not one value printed twice` — e2e/claims.spec.ts:73
    - :84 `toBe` expected `bobSide` _(expression)_
    - :85 `toBe` expected `aliceSide` _(expression)_
    - :86 `toBe` expected `bobSide` _(expression)_
    - :90 `toBe` expected `alicePublic` _(expression)_
    - :91 `toBe` expected `bobPublic` _(expression)_
- `the private values are never among the values the transcript shows as sent` — e2e/claims.spec.ts:94
    - :106 `toHaveLength` expected `3` _(literal)_
    - :107 `expect` expected _no expected value_ _(none)_
    - :108 `expect` expected _no expected value_ _(none)_
    - :112 `expect` expected _no expected value_ _(none)_
- `a private value is on screen only after the leak disclosure is opened` — e2e/claims.spec.ts:115
    - :120 `toBeVisible` expected _no expected value_ _(none)_
    - :121 `toBeHidden` expected _no expected value_ _(none)_
    - :122 `toBeHidden` expected _no expected value_ _(none)_
    - :125 `toBeVisible` expected _no expected value_ _(none)_
    - :127 `toHaveLength` expected `2` _(literal)_
    - :128 `toMatch` expected `HEX` _(expression)_
- `the transcript separates what was already public from what was sent` — e2e/claims.spec.ts:131
    - :134 `expect` expected _no expected value_ _(none)_
    - :135 `expect` expected _no expected value_ _(none)_
    - :138 `toHaveCount` expected `1` _(literal)_
    - :139 `toHaveCount` expected `2` _(literal)_
- `Bob's private value does not recover through this panel, which guesses Alice's` — e2e/claims.spec.ts:142
    - :152 `toHaveText` expected _no expected value_ _(none)_
    - :155 `toContainText` expected `'Alice'` _(literal)_
    - :160 `toHaveText` expected _no expected value_ _(none)_
- `a candidate X25519 treats as identical also recovers, and the page does not claim otherwise` — e2e/claims.spec.ts:165
    - :176 `toBe` expected `alicePrivate` _(expression)_
    - :180 `toHaveText` expected _no expected value_ _(none)_
    - :184 `expect` expected _no expected value_ _(none)_
    - :185 `expect` expected _no expected value_ _(none)_
- `a fresh exchange restarts the per-exchange guess count` — e2e/claims.spec.ts:188
    - :194 `toHaveAttribute` expected `'data-value', '2'` _(expression)_
- `the analogy says what it does not show, rather than claiming secrecy` — e2e/claims.spec.ts:208
    - :213 `toContainText` expected `'does not'` _(literal)_
    - :214 `toContainText` expected `'can be undone'` _(literal)_
    - :216 `toContainText` expected `'could unmix these'` _(literal)_
    - :217 `toContainText` expected `'cannot stir'` _(literal)_
- `the guessing space the prose names matches the length the input accepts` — e2e/claims.spec.ts:220
    - :225 `expect` expected _no expected value_ _(none)_
    - :226 `expect` expected _no expected value_ _(none)_
    - :227 `toHaveAttribute` expected `'maxlength', '64'` _(expression)_
    - :229 `toHaveValue` expected `HEX` _(expression)_
    - :236 `expect` expected _no expected value_ _(none)_
- `a fresh exchange retires an attempt made against the previous secret` — e2e/claims.spec.ts:239
    - :243 `toHaveCount` expected `1` _(literal)_
    - :248 `toBe` expected `before` _(expression)_
    - :252 `toHaveCount` expected `0` _(literal)_
    - :253 `toContainText` expected `'retired'` _(literal)_
- `re-entering the same candidate does not retire a standing attempt` — e2e/claims.spec.ts:256
    - :262 `toHaveCount` expected `1` _(literal)_
    - :266 `toHaveCount` expected `1` _(literal)_
    - :267 `toHaveCount` expected `0` _(literal)_
- `each refusal names its actual cause` — e2e/claims.spec.ts:270
    - :274 `toContainText` expected `'not 32 bytes'` _(literal)_
    - :278 `toContainText` expected `'not hex'` _(literal)_
- `the arrival state renders no outcome it has not computed` — e2e/claims.spec.ts:281
    - :285 `toBeHidden` expected _no expected value_ _(none)_
    - :286 `toBeHidden` expected _no expected value_ _(none)_
    - :287 `toHaveCount` expected `0` _(literal)_
    - :288 `toHaveCount` expected `0` _(literal)_
    - :289 `toHaveCount` expected `0` _(literal)_
    - :290 `toHaveCount` expected `0` _(literal)_
- `the analogy numbers its steps for the reader` — e2e/claims.spec.ts:293
    - :297 `toHaveText` expected `'Step 1 of 4'` _(literal)_
    - :299 `toHaveText` expected `'Step 2 of 4'` _(literal)_
- `the page says it is an analogy before it shows the picture` — e2e/claims.spec.ts:302
    - :306 `toContainText` expected `'analogy'` _(literal)_
    - :307 `toContainText` expected `'not the mechanism'` _(literal)_
- `identity-status: every check passes in the substituted exchange and the limit is on screen` — e2e/claims.spec.ts:320
    - :325 `toBeVisible` expected _no expected value_ _(none)_
    - :331 `toHaveLength` expected `4` _(literal)_
    - :332 `toBe` expected `true` _(expression)_
    - :334 `toBe` expected `0` _(literal)_
    - :350 `toBeVisible` expected _no expected value_ _(none)_
    - :357 `expect` expected _no expected value_ _(none)_
- `the substituted exchange really was run against a substituted value` — e2e/claims.spec.ts:362
    - :367 `toBeVisible` expected _no expected value_ _(none)_
    - :369 `toMatch` expected `HEX` _(expression)_
    - :374 `toHaveLength` expected `2` _(literal)_
    - :375 `toBe` expected `sides[1].trim()` _(expression)_
    - :376 `toBe` expected `true` _(expression)_
    - :378 `toContainText` expected _no expected value_ _(none)_

**Mutation records** (1 file(s)):

- `e2e/verdict-mutations.json` (11339 bytes)

<details><summary>Full README</summary>

```markdown
# Agreeing in Public

**X25519 · RFC 7748 · key agreement.** Two strangers who have never met end up holding the same
32 bytes, while an observer who saw every message sent holds nothing.

**Live demo:** https://systemslibrarian.github.io/crypto-lab-agreeing-in-public/

---

## What It Is

A browser-only teaching lab for **X25519 key agreement** as specified in
[RFC 7748](https://www.rfc-editor.org/rfc/rfc7748) — one of the key agreements your browser runs
before the first byte of a web page arrives. One real exchange is performed in the page,
with `@noble/curves` doing the curve arithmetic, and the two independently computed shared
secrets are compared byte for byte on screen.

It is written for someone who has not met key agreement before. **The page shows no modulus, no
exponent and no curve equation, and it never uses the words "discrete logarithm"** — plain
language arrives before any hex, and the mathematics underneath is named and handed on to
[DH MITM](https://systemslibrarian.github.io/crypto-lab-diffie-hellman-mitm/) and
[Key Exchange](https://systemslibrarian.github.io/crypto-lab-key-exchange/) rather than taught
here. Simplifying the explanation, not the cryptography: every value on the page is real.

The security model is deliberately small, and the lab says so in the page as well as here.
X25519 key agreement gives two parties the same secret without either sending it. It gives them
**nothing about who they agreed with** — and panel 4 is an exhibit that demonstrates that rather
than a disclaimer that asserts it. There is no authentication here, no key schedule, and no
protocol around the exchange. **This is not production cryptography.**

What is real: the X25519 operations, the key generation (the browser's own CSPRNG), the
byte-for-byte comparison, the RFC 7748 §6.1 all-zero check, and the RFC 7748 §5.2 vector check
that runs in the reader's browser at page load. What is an analogy: the coloured-paint picture
in panel 1, which carries no numbers and is labelled an analogy in the panel itself.

## Exhibits

1. **The picture first.** Two people each start with a colour they keep and one colour everyone
   can see. They mix, send the mixtures in the open, and mix again — and land on the same colour,
   which neither of them sent. Four stages, advanced one press at a time; no numbers anywhere in
   it. The mixing model is equal parts of the base colours, which is the one model that actually
   has the commutativity the story needs. **The panel also says, in the panel, what the picture
   does not show: secrecy.** Averaging is reversible, so a watcher holding the public colour and
   both mixtures can recover the private colours and mix the shared one herself —
   `src/ui/mixing.test.ts` asserts that she can, so the limitation is a measured fact rather than
   a hedge, and it is the precise reason panel 2 is not optional.

2. **The real exchange.** Before anything is pressed, the page runs RFC 7748 §5.2's published
   vectors through the real function in your browser and reports the result — so "this is the
   real thing" is a measurement rather than a promise. Then one press: Alice and Bob each take
   32 random bytes, each computes the value they publish, the two published values cross, and
   each combines the other's with their own. **The two results are compared byte for byte and
   the comparison's own answer is what is rendered.** The two sides are computed in separate
   functions from only what each party knows, so the two identical byte strips on screen are two
   computations rather than one value drawn twice. "Show the working" discloses every value in
   full, states the exchange in RFC 7748 §6.1's own notation, and reports the §6.1 all-zero check.

3. **What the eavesdropper has.** The complete transcript — the starting value and both published
   values — shown as ordinary and complete, and separating what was **already public** (the
   starting value, fixed in the specification) from what was **sent during this exchange** (two
   messages, not three). The private values are named as withheld and are reachable only through
   an explicitly labelled "simulate a leak" disclosure, so the page never shows "here is the
   watcher's record" and both secrets in the same breath. Then you can **try to break it yourself against the real primitive**:
   roll or paste a candidate private value, and the page runs the same X25519 and the same
   comparison, and reports what it measured. The exercise guesses **Alice's** private value
   specifically and pairs each candidate with the value Bob sent, which is the pairing that would
   reproduce the secret; the panel says so rather than implying either private value would do.
   Supply Alice's actual value and the panel reports recovery — the verdict is wired to a
   measurement, not to a constant — and labels it as a leaked input rather than a break of the
   transcript. The framing is honest: not "this is impossible", but that no practical method is
   known, and that this panel explores guessing rather than every possible attack. A separate
   disclosure explains why some *different* candidates recover too: RFC 7748 §5 fixes five bits
   before use, so candidates differing only in those are the same private value.

4. **What the secret is for, and the one thing it is not.** The shared secret becomes the key that
   encrypts the rest of the conversation. Then the negative claim, built rather than asserted:
   Alice sets out to agree with Bob, somebody else's public value arrives instead, and Alice and
   that somebody land on the same 32 bytes. **Every check the page performs passes, and they are
   all listed so that can be read rather than taken on trust.** There is no failure code, and the
   absence of one is the exhibit. The attack itself is handed on to DH MITM.

## When to Use It

- **Use it to see that a shared secret can be built in public**, because the two byte strips are
  computed independently and shown identical, beside a transcript that demonstrably does not
  contain them.
- **Use it as the step between "you have a pair of keys" and "your browser has a secure
  connection"**, because that step is the one a newcomer is usually asked to take on faith.
- **Use it to understand what key agreement does not buy**, because panel 4 reaches a state where
  every check reports success and the reader still does not know who they agreed with.
- **Do NOT use it as a model for real key agreement code.** It has no authentication, derives no
  keys from the shared secret, and has no protocol, transcript binding or replay protection around
  it. It is a demo app and does not provide hardened operational controls.

## Live Demo

https://systemslibrarian.github.io/crypto-lab-agreeing-in-public/

Run the exchange and watch the two byte strips arrive identical. Open "show the working" for every
value in full. Then roll a guess at the eavesdropper's panel and watch the real X25519 refuse it,
and press "Let a stranger answer instead" to reach the state where everything passes and identity
is still unknown. Everything runs in your browser; nothing is sent anywhere, and no key material
is stored.

## What Can Go Wrong

- **Mistaking agreement for authentication.** This is the big one, and it is why panel 4 exists.
  Alice's secret matches the secret held by whoever sent the value she received. Nothing in X25519
  says who that was, and there is no error code when it is not who she expected.
- **Trusting the analogy too far.** Equal-parts paint mixing has the commutativity the story needs
  and none of the one-wayness. A watcher *can* unmix it; the panel says so and a unit test proves
  it. It is labelled an analogy, and panel 2 is the real thing on purpose.
- **Reading the size of the guessing space as the strength of the cipher.** The space of distinct
  private values is 76 digits long; the figure usually quoted for X25519's strength is lower,
  because the best known attacks do better than trying every value. Neither number is on the main
  path, and the expert disclosure says why.
- **A public value of low order.** RFC 7748 §6.1 notes that both parties may check whether the
  resulting value is all-zero and abort. The lab performs that check and reports it;
  `@noble/curves` additionally refuses such a value before an all-zero result could be returned,
  which `src/x25519/agree.test.ts` measures rather than assumes.
- **Reusing a private value forever.** Nothing here rotates anything. Forward secrecy comes from
  generating a fresh pair per session, which is what "ephemeral" means in ECDHE; this lab
  generates a fresh pair per press and says nothing stronger.
- **Reading the shared secret as a key.** In practice it is run through a KDF before anything uses
  it. That step is out of scope here and is not performed.

## Real-World Usage

X25519 is the key agreement in TLS 1.3, in SSH, in WireGuard, in Signal's X3DH and PQXDH, and in
the `age` file encryption format. The exchange in panel 2 is the same operation, with the same
base point, that your browser performs on essentially every HTTPS connection it makes. RFC 7748
§6.1's worked example is reproduced exactly by `src/exchange/exchange.test.ts`.

## How to Run Locally

`​``bash
npm install
npm run dev          # http://localhost:5173/crypto-lab-agreeing-in-public/
`​``

`​``bash
npm run build        # tsc -b && vite build
npm run preview      # serves dist/ on port 4731
`​``

## Related Demos

- [Locks and Keys](https://systemslibrarian.github.io/crypto-lab-locks-and-keys/) — the step
  before this one: what a public and a private value even are.
- [The HTTPS Padlock](https://systemslibrarian.github.io/crypto-lab-https-padlock/) — the step
  after: what the padlock in your address bar does and does not promise.
- [DH MITM](https://systemslibrarian.github.io/crypto-lab-diffie-hellman-mitm/) — panel 4's gap
  turned into the actual attack, with the arithmetic on screen.
- [Key Exchange](https://systemslibrarian.github.io/crypto-lab-key-exchange/) — five generations
  of this idea, from 1976 to post-quantum hybrids.
- [What is PQC](https://systemslibrarian.github.io/crypto-lab-what-is-pqc/) — why the hard problem
  under this exchange is one a quantum computer would undo.

## Build & Verify

`​``bash
npm test             # 70 unit tests, 8 files
npm run test:a11y    # the WCAG 2.1 AA gate and the claims suite, 32 browser tests
npm run test:verdicts # the verdict, claims and marker-coverage suites
npm run test:mutation # applies every recorded mutation and judges each result
`​``

**Known-answer tests.** `src/x25519/vectors.ts` holds the RFC 7748 numbers, copied by section with
nothing recomputed; `src/x25519/agree.test.ts` runs them. Both §5.2 single-multiplication vectors
pass, as do the iterated results after 1 and after 1,000 iterations — the RFC's 1,000,000-iteration
result is **not** run, because it costs minutes of CI and covers nothing further that this lab
claims, and that omission is recorded in the file rather than left silent. RFC 7748 §6.1's worked
exchange is reproduced end to end, in both directions. The round-trip tests carry a **negative
control** of equal weight: across 50 mismatched pairings the two sides must *not* agree, because a
round-trip test on its own passes against an implementation that returns a constant.

**Accessibility.** `@axe-core/playwright` scans the production build for zero WCAG 2.1 A/AA
violations across every state a reader can reach, at **1280px, 390px and 320px**. The gate asserts
axe's `incomplete` bucket as well as its violations, computes text contrast arithmetically
alongside axe, measures non-text contrast per border side, and sets `prefers-reduced-motion`
through `emulateMedia` before navigation and then asserts from inside the page that it took
effect. Nothing is injected into the page and no panel is revealed from script — every state is
reached by operating the control a reader would operate. `e2e/nontext-baseline.ts` is empty, which
is the terminal state of its ratchet rather than an unrun check.

**Claims.** `e2e/claims.spec.ts` checks that the page tells the truth, by **re-deriving** its
claims from the page's own raw inputs through the library directly rather than by re-running the
source's own expression — a test that only checks the page agrees with itself passes a mutation
that corrupts the maths, because the corrupted value is reported consistently everywhere. It also
covers the §4.1d negative claim: the fixture is reached through the interface, every rendered check
is asserted to report success, and the limitation is asserted to be visible in that same state and
not behind a disclosure.

**Mutation testing.** Every outcome the page renders carries a `data-verdict` marker and every
number it reports about a run carries a `data-claim` marker; `e2e/verdict-coverage.spec.ts` fails
if the page renders a marker no recorded mutation covers, if a mutation names a marker the page
never renders, or if a mutation's anchor no longer matches its source. `node scripts/mutate.mjs
run` applies each mutation in an isolated `git archive HEAD` tree and judges the result against
four rules — the owning test passed unmutated in the same run, the patch changed the file, the
built bundle's hash moved *and* the failure was not a build error or a dead server, and the
failure was that marker's own assertion. **A patch that does not compile is `DOES NOT BUILD` and
is never a kill.** The results in `mutations/EVIDENCE.md` are written by that script from the run
it reports; nothing there is typed. Separately, `e2e/global-teardown.ts` fails the suite when a
kill recorded in the registry never actually executed, so an unperformed record cannot sit there
looking performed.

## Performance

Everything is a handful of curve operations and renders instantly; there is nothing to benchmark.
The one deliberately slow thing is the 1,000-iteration RFC 7748 §5.2 test, which runs in well
under a second.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Log Forge

- **slug**: `crypto-lab-log-forge`
- **repo**: https://github.com/systemslibrarian/crypto-lab-log-forge
- **live**: https://systemslibrarian.github.io/crypto-lab-log-forge/
- **commit_sha**: `4ac3dd1edee161ae42bf7f71e1b0b3225a14060b` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `84b3bca691dd87e39bd43a975123503bf9a0c6ec`
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | ATTACKS  ·  **level**: intermediate  ·  **--accent**: #83c9f4
- **MISSING FIELDS**: verification

**Name (H1)**: '+escape(title)+'  — _read from src/ui/ui.ts_

**Subtitle**: '+escape(subtitle)+'  — _read from src/ui/ui.ts_

**Description**: '+escape(intro)+'  — _read from src/ui/ui.ts_

**Why it matters**: '+escape(why)+'  — _read from src/ui/ui.ts_

**Card copy**: Recover exponents with generic, smooth-order, index-calculus, and Cheon q-1 methods across finite fields and a toy curve, including a validated static-DH oracle.

**Chips**: BSGS · Pollard Rho / Kangaroo · Pohlig–Hellman · Index Calculus · Cheon q-1

**Implements**: Baby-step giant-step `src/dlog/aux/cheon.ts:10`, Cheon attack `src/dlog/aux/cheon.ts:19`, EC point arithmetic `src/group/ec.ts:4`, Index calculus `src/dlog/index/calculus.ts:4`, Miller–Rabin `src/data/orders.ts:17`, Pohlig–Hellman `src/dlog/pohlig.ts:3`, Pollard kangaroo `src/dlog/generic/kangaroo.ts:3`, Pollard rho (discrete log) `src/dlog/generic/rho.ts:3`

**Attacks shown**: Brute force `src/main.ts:3`, Discrete log `src/main.ts:3`, Key recovery `src/ui/static.ts:41`

**Comment-only (named in code comments, not executed)**: Diffie-Hellman `src/dlog/generic/rho.ts:2`

**References**: CKKS, Diffie-Hellman, ElGamal, Floyd cycle finding, HKDF, OPRF, P-256, P-384, Privacy Pass, SHA-384, Shor's algorithm, TLS 1.3, X25519, ristretto255, secp256k1

**Standards body**: _none_

**Implementation**: local generic group solvers / finite-field and toy-curve arithmetic

**Spec citations, exactly as written**:

- `doi.org/10.1090/S0025-5718-1978-0491431-9` — first seen README.md:45 (2×)
- `doi.org/10.1109/TIT.1978.1055817` — first seen README.md:45 (2×)
- `EUROCRYPT 2006` — first seen README.md:45 (2×)
- `eurocrypt2006` — first seen README.md:45 (2×)
- `NIST SP 800-57` — first seen README.md:45 (4×)
- `RFC 7748` — first seen src/data/orders.ts:11 (2×)
- `RFC 8446` — first seen README.md:97 (2×)
- `RFC 9497` — first seen README.md:45 (6×)
- `rfc7748` — first seen src/ui/static.ts:41 (1×)
- `rfc8446` — first seen src/ui/static.ts:41 (1×)
- `rfc9497` — first seen README.md:45 (3×)

**README — What Can Go Wrong**:

```text
- Generic BSGS/rho search the square root of the **order being searched**. The largest-prime-factor statement applies after Pohlig–Hellman decomposition; it is not a universal cost for an unsplit solver.
- A 128-bit modulus with smooth order can give up its exponent. The fixture carries a Lucas certificate using the complete factorization of p−1.
- Rho restarts on degenerate congruences. Non-invertible coefficients are gcd-reduced, and candidate exponents are checked.
- A partial CRT result is a congruence, not a full logarithm. Large digits are explicitly skipped.
- General index calculus is restricted to safe-prime fixtures below 2^64. Rank deficiency never yields an arbitrary answer. Subgroup logs lift through a full generator, then divide by the cofactor.
- A fair toy race can have several winners, including brute force on a tiny prime-order curve. The brief's exclusive-winner rule is replaced with disclosed equal budgets and actual outcomes; caps are not tuned to manufacture a result.
- Failed or capped attacks establish no security claim. Stopped runs do not report an invented memory count: it is marked “not captured.” Successful memory counts are group/table records, excluding traces and arithmetic temporaries.
- The static-DH exhibit implements only Cheon’s q−1 construction. It shows q+1 divisors but never attacks them. Its square-root speed-ups count search steps; each Cheon step is an exponentiation, so the group-operation saving is smaller.
- BigInt is variable-time. Browser measurements are not attack-cost forecasts. Input changes retire results; cancellation terminates a fresh worker. A bounded main-thread fallback is explicitly disclosed if workers cannot be created.
```

**Claims tested** (e2e/claims.spec.ts, 16 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:6
    - :6 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:7
    - :7 `toBe` expected `s.h` _(expression)_
- `race solutions independently exponentiate and retire only changed input` — e2e/claims.spec.ts:8
- `PH residues CRT to the independently verified 128-bit solution` — e2e/claims.spec.ts:9
- `safe-prime PH reports a partial congruence instead of a full solution` — e2e/claims.spec.ts:10
- `rho recovers a prime-order subgroup exponent and shows measured walk` — e2e/claims.spec.ts:11
- `index relations and reusable individual logs independently recompute` — e2e/claims.spec.ts:12
- `prime order negative claim survives a verified index-calculus solution` — e2e/claims.spec.ts:13
- `measured ladder points retain the run counts and square-root scale` — e2e/claims.spec.ts:14
- `membership refusal and outside-interval search never claim a log` — e2e/claims.spec.ts:15
- `forged curve answers independently add back and disclose equal budgets` — e2e/claims.spec.ts:17
- `static Cheon chain, tables, race and negative claim independently verify` — e2e/claims.spec.ts:18
- `real-group divisor rows recompute their displayed q minus one choice` — e2e/claims.spec.ts:19
- `static oracle results retire only when d really changes` — e2e/claims.spec.ts:20
- `static oracle refuses non-divisor d before making queries` — e2e/claims.spec.ts:21
- `raw static-DH oracle scope distinguishes the fixture from TLS` — e2e/claims.spec.ts:23
    - :25 `toContainText` expected `'TLS key reuse alone does not expose this raw-answer oracle'` _(literal)_
    - :26 `toContainText` expected `'fixed teaching key'` _(literal)_
    - :27 `toHaveAttribute` expected `'href',/rfc8446#section-7.1/` _(expression)_

**Mutation records** (4 file(s)):

- `mutation-results.json` (2558 bytes)
- `scripts/mutation-report.mjs` (3664 bytes)
- `scripts/mutations.json` (3125 bytes)
- `scripts/mutations.mjs` (2232 bytes)

<details><summary>Full README</summary>

```markdown
# Log Forge

Discrete logarithms · generic algorithms · Pohlig–Hellman · index calculus

## What It Is

A browser-only laboratory that actually recovers discrete logarithms in finite fields, their prime-order subgroups, and a verified toy elliptic curve. It also shows how a validated static-DH oracle can surrender its long-lived exponent through Cheon’s attack. Every displayed exponent is checked with independent arithmetic before display. It is a teaching demo, not production cryptography.

Built to the [Crypto Lab master template](https://github.com/systemslibrarian/crypto-lab/blob/main/audits/_MASTER-TEMPLATE.md). The original brief is included; scope corrections below are deliberate. Fleet chrome and accessibility machinery derive from MIT-licensed Crypto Lab work by Paul Clark.

## Exhibits

1. **Solver race:** brute force, BSGS, Pollard rho with Floyd, kangaroo, Pohlig–Hellman and index calculus. Actual generator orders and membership are checked first.
2. **Digit lifting:** prime-power digits, verified projections and CRT; a certified 128-bit smooth-order modulus; safe-prime and ZK Arena partial leaks.
3. **Tables and walks:** recorded baby/giant steps, rho exponent-pair collisions and measured tail/cycle lengths, and tame/wild kangaroo jumps. Step controls expose the actual records. Long traces are sampled.
4. **Index calculus:** smooth relations, full-rank linear algebra modulo q, Euler parity modulo 2, and CRT. Keep one precomputation and solve several targets. A fixed p=101 trace checks all four non-field division candidates.
5. **Weak group forge:** fresh targets with smooth order, short exponents, a small field, or a prime-order toy curve. Every solver gets the same calibrated budgets, and every outcome is shown.
6. **Cost and key lengths:** separate field/order axes, formula lines, discrete measured points, NIST's classical-strength table, and the historical Logjam results.
7. **Static DH oracle:** Cheon’s q−1 attack recovers a static Diffie–Hellman key from d validated oracle answers, then recomputes query-budget divisors for three real group orders.

## When to Use It

Teach why field size, order factorization, group representation and exponent range all matter. Prime order removes a smoothness advantage; it does not make a tiny field safe. Generic algorithms run unchanged over the curve and field group interfaces.

## Live Demo

[Log Forge](https://systemslibrarian.github.io/crypto-lab-log-forge/). Pages publication follows unit, browser claims, accessibility and concrete mutation gates.

## What Can Go Wrong

- Generic BSGS/rho search the square root of the **order being searched**. The largest-prime-factor statement applies after Pohlig–Hellman decomposition; it is not a universal cost for an unsplit solver.
- A 128-bit modulus with smooth order can give up its exponent. The fixture carries a Lucas certificate using the complete factorization of p−1.
- Rho restarts on degenerate congruences. Non-invertible coefficients are gcd-reduced, and candidate exponents are checked.
- A partial CRT result is a congruence, not a full logarithm. Large digits are explicitly skipped.
- General index calculus is restricted to safe-prime fixtures below 2^64. Rank deficiency never yields an arbitrary answer. Subgroup logs lift through a full generator, then divide by the cofactor.
- A fair toy race can have several winners, including brute force on a tiny prime-order curve. The brief's exclusive-winner rule is replaced with disclosed equal budgets and actual outcomes; caps are not tuned to manufacture a result.
- Failed or capped attacks establish no security claim. Stopped runs do not report an invented memory count: it is marked “not captured.” Successful memory counts are group/table records, excluding traces and arithmetic temporaries.
- The static-DH exhibit implements only Cheon’s q−1 construction. It shows q+1 divisors but never attacks them. Its square-root speed-ups count search steps; each Cheon step is an exponentiation, so the group-operation saving is smaller.
- BigInt is variable-time. Browser measurements are not attack-cost forecasts. Input changes retire results; cancellation terminates a fresh worker. A bounded main-thread fallback is explicitly disclosed if workers cannot be created.

## Real-World Usage

Discrete-log assumptions support DH and many signatures/proofs. Classical generic attacks motivate large prime subgroup orders; finite-field index calculus requires much larger fields. A static key holder that returns raw v^α values adds a separate oracle-query attack surface. NFS is a formula here, not implemented. The 2015 Logjam measurements are attributed to the authors' infrastructure and vulnerable servers at that time.

Primary references: Katz–Lindell third edition Chapter 10; [HAC §3.6](https://cacr.uwaterloo.ca/hac/about/chap3.pdf); [Pollard 1978](https://doi.org/10.1090/S0025-5718-1978-0491431-9); [Pohlig–Hellman 1978](https://doi.org/10.1109/TIT.1978.1055817); [Shoup 1997](https://www.shoup.net/papers/dlbounds1.pdf); [Logjam](https://weakdh.org/imperfect-forward-secrecy-ccs15.pdf); [NIST SP 800-57 Part 1 Rev 5 Table 2](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r5.pdf); [Boneh–Shoup v0.6 §16.1.4 and Exercise 16.3](https://toc.cryptobook.us/); [Cheon, EUROCRYPT 2006](https://iacr.org/archive/eurocrypt2006/40040001/40040001.pdf); and [RFC 9497 §7.2.3](https://www.rfc-editor.org/rfc/rfc9497#section-7.2.3). The NIST ECC ranges are preserved rather than presented as exact equalities.

## How to Run Locally

Node 22 or newer:

`​``sh
npm ci
npm run dev
`​``

## Related Demos

[Factor Forge](https://systemslibrarian.github.io/crypto-lab-factor-forge/), [ZK Arena](https://systemslibrarian.github.io/crypto-lab-zk-arena/), [ElGamal Plain](https://systemslibrarian.github.io/crypto-lab-elgamal-plain/), [DH MITM](https://systemslibrarian.github.io/crypto-lab-diffie-hellman-mitm/), [Function Key](https://systemslibrarian.github.io/crypto-lab-function-key/), [Curve Lens](https://systemslibrarian.github.io/crypto-lab-curve-lens/), [Hash Hunt](https://systemslibrarian.github.io/crypto-lab-hash-hunt/).

The overlap review matches the sibling commits pinned in the brief. ZK Arena already implements partial Pohlig–Hellman; its parameters, not its attack code, are reused as a cross-implementation fixture. Existing BSGS attacks remain linked. Log Forge adds digit lifting, a generic cross-representation comparison and real index-calculus precomputation.

## Build & Verify

`​``sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:mutations
`​``

32 local unit tests pass. They cover the three K–L worked examples, all four generic methods in both representations, membership, Hasse-certified curve order, the 128-bit Lucas certificate, PH's measured operation advantage on a prime-power subgroup, ZK Arena's 564522-modulus partial leak, rank deficiency, every collected relation, Euler parity, subgroup lifting, independent verifier isolation, worker decimal serialization, the static-DH fixture and oracle boundary, Cheon recovery for every offered d, and multiply-back/primality checks for every real-group factor. No coverage percentage is claimed.

Thirteen browser claims independently exponentiate displayed answers, check CRT residues, rederive index relations, verify the oracle chain and recovered key, recompute real-group factors/divisors, verify negative claims, inspect trace controls and assert stale-result retirement. Fourteen concrete mutations must build, move bundle bytes, fail a previously passing named claim, restore exactly and pass again. Accessibility drives the production build at 1280/320 pixels through success, refusal, intermediate trace and disclosure states using unchanged fleet contrast and non-text oracles.

Browser verification runs in CI when supported local browser control is unavailable. Pages and grouped Dependabot auto-merge are gated on the full suite. PR checks, manual dispatch, per-ref concurrency and post-merge deployment dispatch are included.

## Performance

Each original race calibrates primitive group-operation throughput in the executing browser, then applies the same 2,000–100,000-operation and 3-second caps to every method. The static-DH race measures Cheon first and applies one disclosed, larger cap to Cheon, generic BSGS, and rho. Exponentiation expands into counted operations; inversions count once and are separately reported. Oracle queries and server work are reported separately from attacker work. Index linear-algebra scalar operations are separate. A method can refuse a table or interval before allocating unbounded memory. Independent verification is outside attack counts.

Real-size groups appear only in formulas and the key-length table. The inspectable smooth-order and partial-leak fixtures demonstrate weaknesses; they are not production parameters. Elementary index-calculus asymptotics omit the unspecified constant and are not numerical predictions.

The Crypto Lab catalog integration records this lab’s concept, level, source evidence and fleet automation. Playwright port 4227 is unique across all 223 registered configurations; strictPort is enforced and existing servers are never reused.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

### Static-DH correction

A failed first Cheon search reports only the table it actually built. Out-of-range
oracle inputs still count as queries and validation checks, but do not charge a
membership exponentiation that was skipped. The page now distinguishes its fixed
raw-answer oracle from TLS: RFC 8446 §§7.1 and 7.4 feed the DH secret into HKDF;
key reuse alone does not expose this oracle. RFC 9497 §7.2.3 supplies the OPRF
connection. Mutation replay requires the owning assertion in a structured report;
crashes, skipped tests, and setup failures cannot count as kills.

Cancellation in degraded mode is checked before computation starts and on every
progress update or error, so a retired run cannot replace a newer result.

```

</details>

---

## AKE Ladder

- **slug**: `crypto-lab-ake-ladder`
- **repo**: https://github.com/systemslibrarian/crypto-lab-ake-ladder
- **live**: https://systemslibrarian.github.io/crypto-lab-ake-ladder/
- **commit_sha**: `fa6172d0ef6a1c289d44bb2e8d6684fc0041c622` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `76a2eb0a58fc67ea5ba216312f7b1f63cbc18114`
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | PROTOCOLS  ·  **level**: advanced  ·  **--accent**: #f5a66f
- **MISSING FIELDS**: verification

**Name (H1)**: AKE Ladder  — _read from index.html_

**Subtitle**: Authenticated key exchange · Boneh–Shoup ch. 21  — _read from index.html_

**Description**: Build authenticated key exchange and remove fields to see how replay, key exposure, and partner confusion arise.  — _read from index.html_

**Why it matters**: A shared key alone does not tell each party who holds it. Protocol fields bind the key to identities and a fresh session.  — _read from index.html_

**Card copy**: Walk Boneh-Shoup's authenticated key exchange: remove one protection at a time and watch a scripted attack land on real transcripts, then compare both parties' actual session-key fingerprints.

**Chips**: ristretto255 · Ed25519 · HKDF-SHA-256 · AES-GCM

**Implements**: AES `src/crypto.ts:13`, AES-CTR `src/pke/eeg-ctr.ts:14`, AES-GCM `src/crypto.ts:13`, Diffie-Hellman `src/ake/ake5.ts:13`, Ed25519 `src/ake/ake1.ts:2`, HKDF `src/crypto.ts:6`, ristretto255 `src/ake/ake1.ts:1`, SHA-256 `src/crypto.ts:8`

**Attacks shown**: Chosen-ciphertext attack `README.md:9`, Ciphertext malleability `src/ui/acts.ts:20`, Man-in-the-middle `src/ui/acts.ts:20`

**References**: HPKE, Kerberos, OPAQUE, RSA, Schnorr, X3DH

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `NIST SP 800-38A` — first seen README.md:83 (1×)
- `RFC 5869` — first seen README.md:63 (3×)
- `RFC 8032` — first seen README.md:62 (3×)
- `RFC 9496` — first seen README.md:61 (3×)
- `rfc5869` — first seen README.md:63 (2×)
- `rfc8032` — first seen README.md:62 (2×)
- `rfc9496` — first seen README.md:61 (2×)
- `SP 800-38A` — first seen README.md:83 (1×)

**README — What Can Go Wrong**:

```text
AKE1 authenticates its session but does not provide forward secrecy: a later leak of P’s decryption scalar reveals a recorded session key and the recorded application message. Omitting individual fields can instead expose the key, replay it, or cause identity misbinding.
```

**Claims tested** (e2e/claims.spec.ts, 12 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:6
    - :6 `toMatch` expected `/^(?:Abort|Experiment failed|Error|Attack failed)/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:8
    - :8 `toBe` expected `1` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:9
    - :9 `toBe` expected `fingerprint(e[side].key)` _(expression)_
- `honest binding and fingerprints derive from complete wire bytes` — e2e/claims.spec.ts:11
    - :12 `toBe` expected `'Q'` _(literal)_
    - :16 `expect` expected _no expected value_ _(none)_
    - :17 `toBe` expected `e.record.chosenKey` _(expression)_
    - :18 `toBe` expected `e.qWire.r` _(expression)_
    - :19 `toBe` expected `'R'` _(literal)_
    - :20 `toBe` expected `e.q.key` _(expression)_
    - :21 `toBe` expected `'R'` _(literal)_
    - :22 `toBe` expected `Buffer.from('Q')[0]^Buffer.from('R')[0]` _(expression)_
    - :23 `toMatch` expected `/signature verification failed|decrypted identity|decryption failed|CTR ciphertext/` _(regex)_
- `AKE1 leaked scalar independently decrypts prior application record` — e2e/claims.spec.ts:25
    - :27 `toBe` expected `key` _(expression)_
- `AKE2 signing-key disclosure runs real rejected decryption probes` — e2e/claims.spec.ts:29
    - :31 `toBe` expected `true` _(expression)_
    - :32 `toHaveLength` expected `3` _(literal)_
    - :33 `toBe` expected `false` _(expression)_
    - :34 `toBe` expected `false` _(expression)_
- `ephemeral leak leads honest Q to accept a fresh adversary record` — e2e/claims.spec.ts:36
    - :37 `toBe` expected `true` _(expression)_
- `active fake responder is rejected before c2 is sent` — e2e/claims.spec.ts:39
    - :40 `expect` expected _no expected value_ _(none)_
- `AKE4 fabrication rejects a valid signature replayed onto fresh DH values` — e2e/claims.spec.ts:42
    - :45 `toBe` expected `true` _(expression)_
- `AKE5 real and Q fabricated confirmations independently recompute` — e2e/claims.spec.ts:47
    - :49 `toBe` expected `ake5Keys(e)` _(expression)_
    - :50 `toBe` expected `true` _(expression)_
- `every altered AKE1 definition yields an observed attack and restored AKE1 rejects it` — e2e/claims.spec.ts:53
    - :55 `toMatch` expected `/signature verification failed|decrypted identity|decryption failed|CTR ciphertext/` _(regex)_
    - :56 `toBe` expected `0` _(literal)_
- `a valid AKE1 handshake is exposed after later key compromise` — e2e/claims.spec.ts:58
    - :59 `toBe` expected `'private prior session'` _(literal)_

**Mutation records** (3 file(s)):

- `scripts/mutation-report.mjs` (3664 bytes)
- `scripts/mutations.json` (5029 bytes)
- `scripts/mutations.mjs` (3029 bytes)

<details><summary>Full README</summary>

```markdown
# AKE Ladder

## What It Is

Implements Boneh–Shoup v0.6 AKE1 over ristretto255, Ed25519, HKDF-SHA-256 and AES-GCM; each of six insecure variations has a scripted attack over real wire operations. Additional acts compute AKE2eg, AKE4eg and AKE5 key agreements and show forward-secrecy, identity-protection and honest-Q deniability intuitions. Not production crypto — a teaching demo. All material is generated in memory; this static site has no account, backend or key storage.

## Exhibits

1. Step the honest AKE1 certificate, signature, CCA encryption, identity check and channel binding.
2. Remove one of six protocol protections; compare both parties’ actual session-key fingerprints and partner identities, then restore the field and see the same attacker procedure rejected.
3. Record AKE1 and AKE2eg AES-GCM messages and leak a long-term key; contrast with a leak of ephemeral α.
4. Compare AKE2eg’s clear certificates with AKE4eg’s encrypted certificates; try a fake responder.
5. Check genuine and Q-fabricated AKE5 transcripts with the same group-key consistency equations.

## When to Use It

Use this to study the exact mechanism and its failure boundary. Do not use the toy implementation, keys or protocols in a deployed security system.

## Live Demo

[Open AKE Ladder](https://systemslibrarian.github.io/crypto-lab-ake-ladder/) to drive the exhibits. The build uses Vite's `/crypto-lab-ake-ladder/` base for GitHub Pages.

## What Can Go Wrong

AKE1 authenticates its session but does not provide forward secrecy: a later leak of P’s decryption scalar reveals a recorded session key and the recorded application message. Omitting individual fields can instead expose the key, replay it, or cause identity misbinding.

## Real-World Usage

The CA and certificate encoding are a small teaching model. V6 uses an E_EG KEM with an AES-CTR DEM instead of the book’s trapdoor-function construction; the malleability is the taught point. AKE5’s demonstration is honest-Q intuition, not the formal simulator argument.

## How to Run Locally

`​``sh
npm ci
npm run dev
`​``

## Related Demos

[Protocol Checker](https://github.com/systemslibrarian/crypto-lab-protocol-checker) · [DH MITM](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm) · [TLS Handshake](https://github.com/systemslibrarian/crypto-lab-tls-handshake) · [Noise Pipe](https://github.com/systemslibrarian/crypto-lab-noise-pipe) · [Protocol Compose](https://github.com/systemslibrarian/crypto-lab-protocol-compose)

## Build & Verify

`​``sh
npm test
npm run build
npx playwright install chromium
npm run test:a11y
npm run test:mutations
`​``

73 executed unit cases cover the six live variations and their restored failures, honest binding, primitive known answers, and AKE2eg/AKE4eg/AKE5 exchanges. No published AKE1–AKE5 end-to-end test vectors exist. The replayable mutation harness contains 17 concrete source patches (13 verdict paths and the original four definition regressions). Each run first passes its named baseline test, requires a non-empty diff, a successful build and changed JavaScript bundle hash, then requires the owning test to fail and restores the original hash. The Playwright suite contains 15 claims tests and two accessibility state drives (1280px and 320px). It scans reachable desktop and mobile states for WCAG 2.1 A/AA issues and independently rederives displayed claims. GitHub Actions runs unit tests, production build and browser gate before deploying; it also gates Dependabot pull requests, groups minor/patch npm updates and dispatches a deploy after an automated merge.

## Performance

All runs are local to the browser. Work figures shown in the page are either actual counted operations or explicitly labelled mathematical estimates/extrapolations. Workers keep long searches cancellable where used. No speed number is a claim about a production deployment.

## Sources

- [Boneh–Shoup v0.6 chapter 21 and §12.4](https://toc.cryptobook.us/)
- [RFC 9496 ristretto255](https://www.rfc-editor.org/rfc/rfc9496)
- [RFC 8032 Ed25519](https://www.rfc-editor.org/rfc/rfc8032)
- [RFC 5869 HKDF](https://www.rfc-editor.org/rfc/rfc5869)

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Deviations from the brief

- The mutation runner uses structured Playwright reports, rejects timeouts, browser/setup failures and retries, requires the exact owning assertion, and reruns the restored test. Retaining the former text-search runner would incorrectly count infrastructure failures as kills. This intentional exception to the runner freeze matches Hash Hunt's hardened runner.
- The brief leaves its McGrew–Viega GCM case explicitly UNVERIFIED. The pinned multi-block substitute is NIST's [AES-GCM examples](https://csrc.nist.gov/CSRC/media/Projects/Cryptographic-Standards-and-Guidelines/documents/examples/AES_GCM.pdf), GCM-AES256 Example 2 (512-bit plaintext, no AAD, 128-bit tag). The actual AES-GCM wrapper is tested with the published IV through a test-only RNG mock.
- A finite set of leaked-signing-key decryption probes cannot prove forward secrecy. The page says exactly what was tried; DH security and erasure supply the cryptographic argument (Boneh–Shoup §21.3). The adversary receives the actual disclosed key and public recording. A negative-control unit test deliberately encrypts under that key and confirms the probe catches the exposure.

## Audit repair evidence

Protocol runs are coordinated in `src/ake/`; individual `src/attack/` modules receive public wire copies, corrupt-user signing capability or an explicitly leaked key. They cannot import honest state. Honest P creates the V1 application record; honest Q supplies V3's partner and binding. The ephemeral-alpha experiment replays a signed u to a fresh honest Q, derives the adversary's key, sends an application record, and checks Q's actual acceptance. The AKE4 forgery replays an authentic earlier signature on fresh DH values, with a successful verification of the original as its positive control.

Expandable educator inspectors include session keys and full bytes for verification; those inspector values are not inputs to the adversary. Browser tests independently encode tuples and use Node crypto for hashes, HKDF, AES-GCM and Ed25519; their AKE5 reference reimplements the equations over the public ristretto primitive. AKE1 post-leak decryption is independently recomputed from the disclosed scalar.

`src/kat/vectors.json` was extracted from primary texts, not recalled values: RFC 9496 A.1 (16) and A.2 (29); RFC 8032 §7.1 TEST 1, TEST 2, TEST 1024; RFC 5869 A.1/A.2; NIST SP 800-38A F.5.1's four blocks; NIST AES-GCM AES256 Example 2. The file records SHA-256 digests of the downloaded source files. URLs: [RFC 9496](https://www.rfc-editor.org/rfc/rfc9496.txt), [RFC 8032](https://www.rfc-editor.org/rfc/rfc8032.txt), [RFC 5869](https://www.rfc-editor.org/rfc/rfc5869.txt), [SP 800-38A](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38a.pdf).

Counts: `npx vitest list --json` enumerates declarations in this Vitest version; `npm test` expands parameter rows to 73 cases. `npx playwright test --list` lists 17 browser tests. `scripts/mutations.json` has 17 entries. No tests are skipped.

Mutation restoration hashes the JavaScript files listed by each fresh Vite build manifest. Unreferenced files left by browser artifact collection are excluded; baseline, mutant and restored builds still have to satisfy every assertion and hash check.

```

</details>

---

## Clock Arithmetic

- **slug**: `crypto-lab-clock-arithmetic`
- **repo**: https://github.com/systemslibrarian/crypto-lab-clock-arithmetic
- **live**: https://systemslibrarian.github.io/crypto-lab-clock-arithmetic/
- **commit_sha**: `0d934dcebcf5dc4dc0a94555ed777103b588753e` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `57de13f0a0853c2c58d89e401a81c47c99baf299`
- **read_from**: working tree (clean)
- **category**: KEY EXCHANGE | ENCRYPTION  ·  **level**: intermediate  ·  **--accent**: #7bd389
- **MISSING FIELDS**: why_it_matters, verification

**Name (H1)**: Clock Arithmetic  — _read from index.html_

**Subtitle**: ℤₙ · Extended Euclid · Euler φ · Cyclic Groups · CRT · Montgomery REDC  — _read from index.html_

**Description**: Work through the arithmetic underneath RSA and Diffie–Hellman — inverses, φ, cycles, generators, the Chinese remainder theorem and repeated modular multiplication — and watch each one fail when its precondition does.  — _read from index.html_

**Why it matters**: _MISSING_

**Card copy**: Step through exact BigInt arithmetic under RSA and finite-field Diffie–Hellman: inverses, Euler φ, orders, generators, subgroups and generalized CRT. Then encode, multiply and square through Montgomery REDC while exposing cancellation, radix shifts, final subtraction and bounded fixed-work timings.

**Chips**: Modular Arithmetic · Extended Euclid · Euler φ · CRT · Montgomery REDC

**Implements**: Diffie-Hellman `src/nt/toyDh.ts:26`, Montgomery multiplication `src/nt/montgomery.ts:96`

**Attacks shown**: _none derived_

**References**: AES, Baby-step giant-step, EC point arithmetic, ElGamal, Jacobi symbol, Miller–Rabin, Montgomery ladder, Pohlig–Hellman, RSA, SHA-256

**Standards body**: IETF

**Implementation**: hand-rolled exact BigInt arithmetic, including power-of-two Montgomery REDC

**Spec citations, exactly as written**:

- `doi.org/10.1090/S0025-5718-1985-0777282-X` — first seen README.md:33 (1×)
- `RFC 7919` — first seen README.md:33 (2×)
- `rfc7919` — first seen README.md:33 (2×)

**README — What Can Go Wrong**:

```text
An inverse requires gcd one. Euler requires a unit. A whole-group generator must pass the check for every prime dividing the group order. A proper prime-order subgroup is useful, while an order-two DH base is too small. Generalized CRT requires the gcd to divide each difference. The power-of-two Montgomery specialization requires odd N, R > N and the inverse-derived constant N′; the unreduced REDC candidate may still require one final subtraction. Correct mathematical refusals are informational; route disagreements and the deliberately tiny DH space are alarms.

The negative fixture uses a = 22 modulo 23: Euler, Fermat, divisibility of the order and return to one all pass, while only two shared secrets are possible. Passing a theorem’s precondition does not establish a useful cryptographic group size.
```

**Claims tested** (e2e/claims.spec.ts, 28 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:18
    - :18 `toContainText` expected `'Computed'` _(literal)_
- `Arrival preserves every prediction until the learner computes or reveals` — e2e/claims.spec.ts:33
    - :48 `expect` expected _no expected value_ _(none)_
    - :49 `expect` expected _no expected value_ _(none)_
    - :51 `toHaveAttribute` expected `'open', ''` _(expression)_
    - :53 `toBeVisible` expected _no expected value_ _(none)_
    - :54 `toContainText` expected `answers[n - 1]` _(expression)_
    - :55 `expect` expected _no expected value_ _(none)_
    - :62 `toHaveText` expected `String(phi(36))` _(expression)_
- `Wrap reductions and every printed multiplication row own their permutation claim` — e2e/claims.spec.ts:65
    - :72 `toContainText` expected `'${a} mod ${n} = ${mod(a, n)}'` _(expression)_
    - :79 `toHaveLength` expected `n` _(expression)_
    - :84 `toEqual` expected `all.map((b) => mod(a * b, n))` _(expression)_
    - :86 `toBe` expected `permutation ? 'permutation · inverse exists' : 'repeats · no inverse'` _(expression)_
- `Bézout every printed row and reduced inverse independently checked` — e2e/claims.spec.ts:90
    - :105 `expect` expected _no expected value_ _(none)_
    - :108 `toBe` expected `r` _(expression)_
    - :109 `toBe` expected `r` _(expression)_
    - :115 `toBe` expected `true` _(expression)_
    - :116 `toBe` expected `1n` _(expression)_
    - :117 `toContainText` expected _no expected value_ _(none)_
    - :121 `toHaveAttribute` expected `'data-verdict', 'info'` _(expression)_
    - :122 `toHaveClass` expected `'verdict-info'` _(literal)_
    - :123 `toContainText` expected _no expected value_ _(none)_
    - :126 `toContainText` expected `'Use this inverse'` _(literal)_
- `Phi drawn units match count and independent formula` — e2e/claims.spec.ts:131
    - :138 `toEqual` expected `expected.map(String)` _(expression)_
    - :139 `toHaveText` expected `String(expected.length)` _(expression)_
    - :140 `toHaveText` expected `String(expected.length)` _(expression)_
- `Generators, subgroups and toy DH search spaces rederive from multiplication` — e2e/claims.spec.ts:145
    - :156 `toHaveLength` expected _no expected value_ _(none)_
    - :159 `expect` expected _no expected value_ _(none)_
    - :164 `toHaveText` expected `String(phi(p - 1))` _(expression)_
    - :165 `toBe` expected `phi(p - 1)` _(expression)_
    - :171 `toHaveLength` expected `p - 1` _(expression)_
    - :173 `toBe` expected _no expected value_ _(none)_
    - :183 `toEqual` expected `primes` _(expression)_
    - :186 `toBe` expected `expected` _(expression)_
    - :187 `toBe` expected `expected !== 1 ? 'yes' : 'no'` _(expression)_
    - :190 `toHaveClass` expected `'verdict-info'` _(literal)_
    - :191 `toHaveAttribute` expected `'data-verdict', 'info'` _(expression)_
    - :192 `toBe` expected _no expected value_ _(none)_
    - :196 `toContainText` expected `'not a flaw'` _(literal)_
    - :197 `toContainText` expected `'alarm below'` _(literal)_
    - :198 `toContainText` expected `'not a flaw'` _(literal)_
    - :203 `toHaveCount` expected `divisors.length` _(expression)_
    - :208 `expect` expected _no expected value_ _(none)_
    - :212 `toBe` expected `divisors[i]` _(expression)_
    - :213 `toHaveLength` expected `d` _(expression)_
    - :214 `toBe` expected `0` _(literal)_
    - :215 `toEqual` expected _no expected value_ _(none)_
    - :218 `toHaveAttribute` expected `'data-size', String(d)` _(expression)_
    - :219 `toHaveAttribute` expected `'data-order', String(d)` _(expression)_
    - :221 `toHaveText` expected `String(members.length)` _(expression)_
    - :225 `toBe` expected `power(g, a * b, p)` _(expression)_
    - :226 `expect` expected _no expected value_ _(none)_
    - :227 `toHaveText` expected `String(members.indexOf(secret) + 1)` _(expression)_
    - :229 `toHaveClass` expected `'verdict-' + kind` _(expression)_
    - :230 `toHaveAttribute` expected `'data-verdict', kind` _(expression)_
    - :242 `toBe` expected `mod(a, n)` _(expression)_
    - :243 `expect` expected _no expected value_ _(none)_
    - :244 `expect` expected _no expected value_ _(none)_
    - :245 `toHaveText` expected `String(lcm)` _(expression)_
    - :246 `toHaveAttribute` expected `'data-verdict', 'ok'` _(expression)_
    - :247 `toHaveClass` expected `'verdict-ok'` _(literal)_
    - :251 `expect` expected _no expected value_ _(none)_
    - :253 `toEqual` expected `[base, inv, n]` _(expression)_
    - :254 `expect` expected _no expected value_ _(none)_
    - :255 `expect` expected _no expected value_ _(none)_
    - :256 `toBe` expected `1` _(literal)_
    - :257 `toBe` expected `1` _(literal)_
- `CRT substitutes printed solution and uses lcm for shared factors` — e2e/claims.spec.ts:263
    - :269 `expect` expected _no expected value_ _(none)_
- `CRT deduplicates identical congruences with an informational note and solution` — e2e/claims.spec.ts:272
    - :281 `toHaveText` expected `'1'` _(literal)_
    - :283 `toHaveAttribute` expected `'data-verdict', 'info'` _(expression)_
    - :284 `toHaveClass` expected `'verdict-info'` _(literal)_
    - :285 `toContainText` expected `'1 repeated congruence(s) deduplicated'` _(literal)_
- `CRT refuses modulus n = 1` — e2e/claims.spec.ts:287
    - :291 `toContainText` expected `'nothing wraps'` _(literal)_
    - :292 `expect` expected _no expected value_ _(none)_
- `Euler negative claim all five checks pass while the cycle has only two elements` — e2e/claims.spec.ts:295
    - :304 `toHaveText` expected `String(walk(22, 23).order)` _(expression)_
    - :305 `toHaveAttribute` expected `'data-verdict', 'alarm'` _(expression)_
    - :306 `toHaveClass` expected `'verdict-alarm'` _(literal)_
    - :307 `toBeVisible` expected _no expected value_ _(none)_
    - :308 `toContainText` expected _no expected value_ _(none)_
    - :311 `toContainText` expected _no expected value_ _(none)_
    - :314 `toContainText` expected _no expected value_ _(none)_
- `Euler composite case uses phi rather than n minus one` — e2e/claims.spec.ts:320
- `Break the precondition shows the nonunit walk and independently computed Euler failure` — e2e/claims.spec.ts:326
    - :333 `expect` expected _no expected value_ _(none)_
    - :334 `toContainText` expected `'2 → 4 → 8 → 6 → 2'` _(literal)_
    - :335 `toContainText` expected _no expected value_ _(none)_
- `Clock directed edges match the walk; nonreturning cycles have no edge into 1` — e2e/claims.spec.ts:339
    - :357 `toHaveCount` expected `vertices.length - 1` _(expression)_
    - :358 `toHaveAttribute` expected `'data-closed', String(w.order !== null)` _(expression)_
    - :360 `toHaveAttribute` expected `'data-from', String(vertices[i])` _(expression)_
    - :361 `toHaveAttribute` expected `'data-to', String(vertices[i + 1])` _(expression)_
    - :362 `toHaveAttribute` expected `'marker-end', /url\(#arrow-act4\)/` _(expression)_
    - :363 `toHaveAttribute` expected `'d', / A /` _(expression)_
    - :366 `toHaveCount` expected `0` _(literal)_
    - :367 `toHaveCount` expected `1` _(literal)_
    - :368 `toHaveAttribute` expected `'stroke-dasharray', '5 4'` _(expression)_
    - :369 `toHaveText` expected `'cycle'` _(literal)_
    - :370 `toHaveCount` expected `0` _(literal)_
    - :372 `toHaveAttribute` expected `'stroke-width', '4'` _(expression)_
    - :386 `expect` expected _no expected value_ _(none)_
- `No inverse ${name} is a neutral fact` — e2e/claims.spec.ts:396
    - :401 `toHaveAttribute` expected `'data-verdict', 'info'` _(expression)_
    - :402 `toHaveClass` expected `'verdict-info'` _(literal)_
    - :403 `toContainText` expected _no expected value_ _(none)_
    - :406 `toHaveCount` expected `0` _(literal)_
    - :407 `toContainText` expected `'Use this inverse'` _(literal)_
- `Refuses ${name}` — e2e/claims.spec.ts:415
    - :419 `toContainText` expected `msg` _(expression)_
    - :420 `expect` expected _no expected value_ _(none)_
- `Phi above million labels its single route` — e2e/claims.spec.ts:422
    - :428 `toHaveAttribute` expected `'data-verdict', 'info'` _(expression)_
    - :429 `toHaveClass` expected `'verdict-info'` _(literal)_
    - :430 `toContainText` expected `'φ(1000001) = ${phi(1000001)}; single route (factorisation)'` _(expression)_
    - :431 `toHaveCount` expected `0` _(literal)_
- `Composite prime-group input refused and the Z15 counterexample stays reachable` — e2e/claims.spec.ts:433
    - :439 `toContainText` expected `'requires a prime'` _(literal)_
    - :440 `toContainText` expected `'act 4'` _(literal)_
    - :441 `toContainText` expected `'ℤ₁₅* counterexample'` _(literal)_
    - :442 `expect` expected _no expected value_ _(none)_
    - :445 `toBeVisible` expected _no expected value_ _(none)_
    - :447 `toContainText` expected `'${a} → order ${order}'` _(expression)_
    - :448 `toContainText` expected _no expected value_ _(none)_
- `Refuses act5 prime p above 10^4` — e2e/claims.spec.ts:452
    - :456 `toContainText` expected `'exact budget of 10000'` _(literal)_
    - :457 `expect` expected _no expected value_ _(none)_
    - :471 `toBe` expected `0` _(literal)_
    - :472 `toHaveClass` expected `'verdict-info'` _(literal)_
    - :473 `toHaveAttribute` expected `'data-verdict', 'info'` _(expression)_
    - :474 `toContainText` expected _no expected value_ _(none)_
    - :477 `toHaveCount` expected `0` _(literal)_
- `Changing n mid-computation retires it; same values preserve computed results` — e2e/claims.spec.ts:479
    - :486 `expect` expected _no expected value_ _(none)_
    - :493 `toContainText` expected `'Computing'` _(literal)_
    - :497 `expect` expected _no expected value_ _(none)_
    - :498 `toContainText` expected `'retired'` _(literal)_
    - :499 `toHaveValue` expected `'97'` _(literal)_
    - :502 `expect` expected _no expected value_ _(none)_
    - :503 `toContainText` expected `'retired'` _(literal)_
    - :507 `expect` expected _no expected value_ _(none)_
    - :509 `expect` expected _no expected value_ _(none)_
    - :510 `toContainText` expected `'retired'` _(literal)_
- `Point Arithmetic scope link targets the existing EC lab` — e2e/claims.spec.ts:512
    - :515 `toHaveAttribute` expected _no expected value_ _(none)_
- `Hidden probe and keyboard stepper` — e2e/claims.spec.ts:520
    - :524 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :525 `expect` expected _no expected value_ _(none)_
    - :528 `expect` expected _no expected value_ _(none)_
    - :533 `toHaveCount` expected `1` _(literal)_
    - :535 `toHaveCount` expected `2` _(literal)_
- `Montgomery default trace independently checks cancellation and canonical product` — e2e/claims.spec.ts:538
    - :545 `toHaveText` expected `'15'` _(literal)_
    - :546 `toHaveText` expected `'4'` _(literal)_
    - :547 `toHaveText` expected `'11'` _(literal)_
    - :548 `toHaveText` expected `'7'` _(literal)_
    - :549 `toHaveText` expected `'77'` _(literal)_
    - :550 `toHaveText` expected `'13'` _(literal)_
    - :551 `toHaveText` expected `'3'` _(literal)_
    - :552 `toHaveText` expected `'51'` _(literal)_
    - :553 `toHaveText` expected `'0'` _(literal)_
    - :554 `toHaveText` expected `'4'` _(literal)_
    - :555 `toContainText` expected `'4 < 17'` _(literal)_
    - :556 `toHaveText` expected `'4'` _(literal)_
    - :557 `toHaveText` expected `'15'` _(literal)_
    - :558 `toHaveText` expected `'15'` _(literal)_
- `Montgomery critical regression exposes raw candidate and final subtraction` — e2e/claims.spec.ts:561
    - :569 `toHaveText` expected `'9'` _(literal)_
    - :570 `toHaveText` expected `'15'` _(literal)_
    - :571 `toHaveText` expected `'135'` _(literal)_
    - :572 `toHaveText` expected `'9'` _(literal)_
    - :573 `toContainText` expected `'9 ≥ 9'` _(literal)_
    - :574 `toContainText` expected `'9 − 9 = 0'` _(literal)_
    - :575 `toHaveText` expected `'0'` _(literal)_
    - :576 `toHaveText` expected `'0'` _(literal)_
- `Montgomery chain retains product and square until one conversion out` — e2e/claims.spec.ts:579
    - :583 `toEqual` expected `[` _(expression)_
    - :588 `toHaveText` expected `'12'` _(literal)_
    - :589 `toHaveText` expected `'12'` _(literal)_
    - :590 `toHaveAttribute` expected _no expected value_ _(none)_
- `Montgomery fixed work separates setup repeated loops and decode` — e2e/claims.spec.ts:596
    - :600 `toHaveText` expected `'4096'` _(literal)_
    - :602 `toHaveLength` expected `4` _(literal)_
    - :603 `expect` expected _no expected value_ _(none)_
    - :604 `expect` expected _no expected value_ _(none)_
    - :605 `expect` expected _no expected value_ _(none)_
    - :606 `expect` expected _no expected value_ _(none)_
    - :607 `expect` expected _no expected value_ _(none)_
    - :608 `expect` expected _no expected value_ _(none)_
    - :609 `expect` expected _no expected value_ _(none)_
    - :610 `expect` expected _no expected value_ _(none)_
    - :613 `toBe` expected `true` _(expression)_
    - :615 `toHaveAttribute` expected _no expected value_ _(none)_
    - :619 `toContainText` expected _no expected value_ _(none)_
- `Montgomery negative input uses a canonical residue and every check passes` — e2e/claims.spec.ts:624
    - :632 `toHaveText` expected `'14'` _(literal)_
    - :633 `toHaveText` expected `'2'` _(literal)_
    - :634 `toHaveText` expected `'2'` _(literal)_
- `Montgomery composite and zero inputs retain canonical results` — e2e/claims.spec.ts:637
    - :642 `toHaveText` expected `'1'` _(literal)_
    - :646 `toHaveText` expected `'0'` _(literal)_
- `Montgomery rejects ${name}` — e2e/claims.spec.ts:660
    - :665 `toHaveAttribute` expected `'data-verdict', 'info'` _(expression)_
    - :666 `toContainText` expected `message` _(expression)_
    - :667 `toHaveCount` expected `0` _(literal)_

**Mutation records** (1 file(s)):

- `scripts/check-mutations.mjs` (15546 bytes)

<details><summary>Full README</summary>

```markdown
# Clock Arithmetic

## What It Is

Exact, inspectable BigInt number theory underneath RSA and finite-field Diffie–Hellman: modular arithmetic, extended Euclid, Euler φ, multiplicative orders, generators, subgroups, generalized CRT and Montgomery reduction. The computations check their own preconditions and use independent routes where feasible. This is a small-number teaching lab, not production cryptography.

## Exhibits

1. **Wrap around:** reduce signed integers; draw discrete clocks through modulus 24 and residue strips above it; inspect addition and multiplication tables through 13.
2. **Undo multiplication:** step Euclid, check every Bézout row, derive a normalized inverse, and recognize shared-factor failures.
3. **Count units:** compare enumeration with the prime-factor formula. Unit lists paginate in groups of 200; the exact count includes all units.
4. **Watch powers cycle:** compare a walk with divisor-based order computation, check Euler/Fermat/Lagrange, and observe that Euler can hold for a cycle of length two.
5. **Generators and subgroups:** inspect every element’s order and every prime-factor generator check. A toy DH separates the possible-secret count from the number of guesses actually used.
6. **Recombine remainders:** step generalized CRT, reject incompatible congruences, deduplicate repeats, and use the lcm for compatible noncoprime moduli.
7. **Montgomery multiplication:** choose an explicit power-of-two radix, encode through REDC, inspect low-word cancellation, radix shifting and final subtraction, keep a product-and-square chain encoded, then decode once. A fixed 4,096-operation comparison measures setup, ordinary repeated work, Montgomery repeated work and final decoding separately.

## When to Use It

Use it to learn the arithmetic vocabulary before RSA, finite-field DH or discrete-log attacks. Predict each outcome before computing and compare the counterexamples. Do **not** use it to generate or protect real keys, test large numbers for primality, or benchmark real cryptographic attacks.

## Live Demo

[Open Clock Arithmetic](https://systemslibrarian.github.io/crypto-lab-clock-arithmetic/). Predict first, then click Compute or an example to inspect every computed row. Each reveal answers its own fixed prediction using the arithmetic modules. Input changes cancel the Worker and retire dependent results; a no-op leaves them intact.

## What Can Go Wrong

An inverse requires gcd one. Euler requires a unit. A whole-group generator must pass the check for every prime dividing the group order. A proper prime-order subgroup is useful, while an order-two DH base is too small. Generalized CRT requires the gcd to divide each difference. The power-of-two Montgomery specialization requires odd N, R > N and the inverse-derived constant N′; the unreduced REDC candidate may still require one final subtraction. Correct mathematical refusals are informational; route disagreements and the deliberately tiny DH space are alarms.

The negative fixture uses a = 22 modulo 23: Euler, Fermat, divisibility of the order and return to one all pass, while only two shared secrets are possible. Passing a theorem’s precondition does not establish a useful cryptographic group size.

## Real-World Usage

RSA computes its private exponent using an inverse and often recombines CRT residues. [RFC 7919 Appendix A.1](https://www.rfc-editor.org/rfc/rfc7919.html#appendix-A.1) specifies FFDHE’s g = 2 and prime subgroup order q = (p−1)/2. The p = 23 examples here are arithmetic models, not deployed parameters. [Montgomery’s original 1985 paper](https://doi.org/10.1090/S0025-5718-1985-0777282-X) defines the residue representation and REDC method used in exhibit 7. Sunzi’s classical remainder problem supplies the CRT default; no historical date is asserted. Paar and Pelzl, *Understanding Cryptography* (2010), §§1.4, 6.3, 7.5.2 and 8.2 supply teaching context; no text or worked example is reproduced.

## How to Run Locally

`​``bash
npm ci
npm run dev
`​``

## Related Demos

- [Educational RSA](https://systemslibrarian.github.io/crypto-lab-rsa-educational/) — the inverse becomes d; fast exponentiation traces.
- [RSA Forge](https://systemslibrarian.github.io/crypto-lab-rsa-forge/) — Håstad’s attack and software-simulated CRT faults, both confirmed from executed source.
- [Prime Witness](https://systemslibrarian.github.io/crypto-lab-prime-witness/) — Fermat as a primality test, and its liars.
- [Log Forge](https://systemslibrarian.github.io/crypto-lab-log-forge/) — discrete-log algorithms and Pohlig–Hellman.
- [ElGamal Plain](https://systemslibrarian.github.io/crypto-lab-elgamal-plain/) — full-group versus subgroup message encoding.
- [Residue Gate](https://systemslibrarian.github.io/crypto-lab-residue-gate/) — squares and symbols.
- [DH MITM](https://systemslibrarian.github.io/crypto-lab-diffie-hellman-mitm/) — the exchange and its authentication.
- [AES Anatomy](https://systemslibrarian.github.io/crypto-lab-aes-anatomy/) — polynomial arithmetic over GF(2⁸).

## Build & Verify

`​``bash
npm ci
npm test
npm run build
npx playwright install chromium
npx playwright test --retries=0
node scripts/check-mutations.mjs
`​``

Fifty-nine unit cases include the original exhaustive arithmetic checks plus independent Montgomery REDC calculations, every valid T for N = 17, every input pair for every odd modulus through 99, explicit raw-candidate/final-subtraction traces, both sides of the 2³⁹ radix transition, the full 10¹² modulus boundary, invalid modulus/radix combinations, conversion through R², chained multiplication and identical fixed-work schedules. The original core ranges and pinned mathematical values are unchanged.

The 38 browser claims independently recompute reductions, multiplication-row permutations, Bézout identities, inverse ranges, unit counts, power walks, every prime-factor generator check, subgroup members, DH search space and guess position, CRT inverses/substitutions, and the Montgomery trace, chain and fixed-work result. The N = 9 fixture requires raw candidate 9 followed by subtraction to 0; the negative-input fixture requires canonical result 2 and every verdict to pass. Invalid even/unit/over-budget moduli, too-small radices and non-power-of-two radices have named informational refusals. The existing negative act-4 fixture and cancellation/input-budget gates remain intact.

Two accessibility tests scan every act and example at 1280px and 320px, including Montgomery’s valid traces and refusal states, arrival before computation, reveals and the composite counterexample. They retain axe, measured contrast, focus, hidden-state and overflow gates and the existing non-text baseline.

The mutation runner requires committed source and records 38 concrete mutations, including ten Montgomery cases and the existing two-patch cancellation mutation. Before building, it proves that every mutation owner selects exactly one browser test. Each case must pass that named baseline, produce a non-empty source diff, compile and move the bundle hash, fail by an assertion, then restore the exact bundle and pass again. It rejects missing/duplicate anchors, build failures, infrastructure errors, timeouts, empty/multiple selections, skips and retries as kills. Hosted CI preserves complete JSON and per-case logs after a successful gate, or whatever partial evidence was generated by an in-loop failure; failures before artifact creation remain visible in the workflow step log.


## Performance

Heavy computations and HTML preparation run in a cancellable Worker; the page reports their measured elapsed time. The Montgomery exhibit additionally separates context/encoding setup, an ordinary 4,096-operation loop, the matching encoded loop and final decoding. The encoded loop executes the implementation’s validation and trace-object work on every operation, so its single-run values are neither a general benchmark nor a constant-time claim. Factorisation is exact trial division through 10¹², counting through 10⁶, prime-group enumeration through 10⁴, and displayed wrap/walk experiments through modulus 10⁴. Inputs above the declared budget are refused. BigInt arithmetic stays exact above 2⁵³. Large unit lists are paginated, and wide data regions are keyboard-scrollable. Subgroup construction reuses one primitive root across every divisor instead of enumerating all generators again for each subgroup.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---
