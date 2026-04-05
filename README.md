# Crypto Lab

> Browser-based cryptography demos — no backends, no accounts, just the math.

A curated collection of single-concept cryptography demonstrations. Each one isolates a real primitive or protocol and makes it interactive in the browser. Classic algorithms, post-quantum schemes, zero-knowledge proofs — all grounded in real specifications, not toy reimplementations.

**Live →** https://systemslibrarian.github.io/crypto-lab/

---

## Featured

| Project | Concept | Primitives |
|---|---|---|
| [Shadow Vault](https://systemslibrarian.github.io/shadow-vault/) | Deniable Encryption | Argon2id · ChaCha20-Poly1305 · SHA-256 |
| [ZK Proof Lab](https://systemslibrarian.github.io/zk-proof-lab/) | Zero-Knowledge Proofs | Schnorr · Fiat-Shamir · SHA-256 Commitments · zk-SNARK |

---

## All Demos

| Project | Category | Stack |
|---|---|---|
| [Shadow Vault](https://systemslibrarian.github.io/shadow-vault/) | Deniable Encryption | Argon2id · ChaCha20-Poly1305 · SHA-256 |
| [ZK Proof Lab](https://systemslibrarian.github.io/zk-proof-lab/) | Zero-Knowledge Proofs | Schnorr · SHA-256 Commitments · Fiat-Shamir · zk-SNARK |
| [Phantom Vault](https://systemslibrarian.github.io/phantom-vault/) | Stateless Passwords | PBKDF2-SHA-256 · HMAC-DRBG · Rejection Sampling |
| [Corrupted Oracle](https://systemslibrarian.github.io/corrupted-oracle/) | Backdoored RNG | Dual\_EC\_DRBG · HMAC-DRBG · ChaCha20-DRBG · P-256 |
| [Iron Letter](https://systemslibrarian.github.io/iron-letter/) | Asymmetric Encryption | ECIES P-256 · RSA-OAEP · AES-256-GCM |
| [Quantum Vault KpqC](https://systemslibrarian.github.io/quantum-vault-kpqc/) | Post-Quantum | AES-256-GCM · Shamir SSS · SMAUG-T · HAETAE |
| [Blind Oracle](https://systemslibrarian.github.io/blind-oracle/) | Homomorphic Encryption | TFHE-rs |
| [Snow 2](https://systemslibrarian.github.io/snow2/) | Stream Cipher | XChaCha20-Poly1305 · Argon2id · HKDF-SHA-256 · Steganography |
| [Dad Mode Morse](https://systemslibrarian.github.io/dad-mode-morse2/) | Encrypted Morse | AES-256-GCM · Argon2id · HKDF-SHA-256 · Ed25519 |
| [Patron Shield](https://systemslibrarian.github.io/patron-shield/) | Library Privacy | IT-PIR · XOR Secret Sharing · Chor et al. 1995 |
| [Silent Tally](https://systemslibrarian.github.io/silent-tally/) | Secure MPC | Shamir SSS · GF(2⁶¹−1) · Lagrange Interpolation · Additive Homomorphism |
| [FROST Threshold](https://systemslibrarian.github.io/frost-threshold/) | Threshold Signatures | FROST (RFC 9591) · Ed25519 · Nonce Commitments · VSS Commitments |

---

## Related Projects

These sit outside the browser-demo scope of Crypto Lab but belong to the same collection:

- **[Crypto Compare](https://systemslibrarian.github.io/crypto-compare/)** — Algorithm reference covering NIST and PQ-Safe standards.
- **[Cipher Museum](https://ciphermuseum.com)** — An interactive museum spanning 2,500 years of cryptographic history. Ten halls, 37 ciphers, live encryption demos, and cryptanalysis labs.
- **[Meow Decoder](https://www.meowdecoder.com/)** — Secure optical air-gap file transfer via QR-code GIFs. AES-256-GCM + Argon2id + ML-KEM-1024 + fountain codes. Python + Rust.

---

## About

Each demo is self-contained: one concept, one repository, full source. Documentation and threat models are included where the attack surface warrants it.

Built by [Paul Clark](https://github.com/systemslibrarian) — IT Librarian & Systems Analyst.

---

*So whether you eat or drink or whatever you do, do it all for the glory of God. — 1 Corinthians 10:31*
