# Crypto Lab

> Browser-based cryptography demos — no backends, no accounts, just the math.

A curated collection of single-concept cryptography demonstrations. Each one isolates a real primitive or protocol and makes it interactive in the browser. Classic algorithms, post-quantum schemes, zero-knowledge proofs — all grounded in real specifications, not toy reimplementations.

**Live →** https://systemslibrarian.github.io/crypto-lab/

---

## Featured

| Project | Concept | Primitives |
|---|---|---|
| [Shadow Vault](https://systemslibrarian.github.io/shadow-vault/) | Deniable Encryption | Argon2id · ChaCha20-Poly1305 · SHA-256 |
| [ZK Proof Lab](https://systemslibrarian.github.io/zk-proof-lab/) | Zero-Knowledge Proofs | Schnorr · Fiat-Shamir · SHA-256 Commitments |

---

## All Demos

| Project | Category | Stack |
|---|---|---|
| [Shadow Vault](https://systemslibrarian.github.io/shadow-vault/) | Deniable Encryption | Rust/WASM · Argon2id · ChaCha20-Poly1305 |
| [ZK Proof Lab](https://systemslibrarian.github.io/zk-proof-lab/) | Zero-Knowledge Proofs | HTML/JS · Schnorr · Fiat-Shamir |
| [Phantom Vault](https://systemslibrarian.github.io/phantom-vault/) | Stateless Passwords | TypeScript · PBKDF2-SHA-256 · HMAC-DRBG |
| [Corrupted Oracle](https://systemslibrarian.github.io/corrupted-oracle/) | Backdoored RNG | TypeScript · Dual\_EC\_DRBG · P-256 |
| [Iron Letter](https://systemslibrarian.github.io/iron-letter/) | Asymmetric Encryption | TypeScript · WebCrypto · ECIES · RSA-OAEP |
| [Quantum Vault KpqC](https://systemslibrarian.github.io/quantum-vault-kpqc/) | Post-Quantum | Rust/WASM · ML-KEM · HAETAE · Shamir SSS |
| [Blind Oracle](https://systemslibrarian.github.io/blind-oracle/) | Homomorphic Encryption | TypeScript · Rust · TFHE-rs |
| [Snow 2](https://systemslibrarian.github.io/snow2/) | Stream Cipher | Rust · XChaCha20-Poly1305 · Argon2id · HKDF |
| [Dad Mode Morse](https://systemslibrarian.github.io/dad-mode-morse2/) | Encrypted Morse | HTML/JS · AES-256-GCM · Argon2id · Ed25519 |
| [Patron Shield](https://systemslibrarian.github.io/patron-shield/) | Library Privacy | TypeScript · IT-PIR · XOR Secret Sharing |
| [Crypto Compare](https://systemslibrarian.github.io/crypto-compare/) | Algorithm Reference | TypeScript · 85 Algorithms · PQ-Safe Filter |

---

## Related Projects

These sit outside the browser-demo scope of Crypto Lab but belong to the same collection:

- **[Cipher Museum](https://ciphermuseum.com)** — An interactive museum spanning 2,500 years of cryptographic history. Ten halls, 37 ciphers, live encryption demos, and cryptanalysis labs.
- **[Meow Decoder](https://www.meowdecoder.com/)** — Secure optical air-gap file transfer via QR-code GIFs. AES-256-GCM + Argon2id + ML-KEM-1024 + fountain codes. Python + Rust.

---

## About

Each demo is self-contained: one concept, one repository, full source. Documentation and threat models are included where the attack surface warrants it.

Built by [Paul Clark](https://github.com/systemslibrarian) — IT Librarian & Systems Analyst at Leon County Public Library.

---

*So whether you eat or drink or whatever you do, do it all for the glory of God. — 1 Corinthians 10:31*
