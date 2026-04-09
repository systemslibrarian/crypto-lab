# Crypto Lab

> Browser-based cryptography demos — no backends, no accounts, just the math.

A curated collection of single-concept cryptography demonstrations. Each one isolates a real primitive or protocol and makes it interactive in the browser. Classic algorithms, post-quantum schemes, zero-knowledge proofs — all grounded in real specifications, not toy reimplementations.

**Live →** https://systemslibrarian.github.io/crypto-lab/

---

## Featured

| Project | Concept | Primitives |
|---|---|---|
| [Shadow Vault](https://systemslibrarian.github.io/crypto-lab-shadow-vault/) | Deniable Encryption | Argon2id · ChaCha20-Poly1305 · SHA-256 |
| [ZK Proof Lab](https://systemslibrarian.github.io/crypto-lab-zk-proof-lab/) | Zero-Knowledge Proofs | Schnorr · Fiat-Shamir · SHA-256 Commitments · zk-SNARK |

---

## All Demos

| Project | Category | Stack |
|---|---|---|
| [Shadow Vault](https://systemslibrarian.github.io/crypto-lab-shadow-vault/) | Deniable Encryption | Argon2id · ChaCha20-Poly1305 · SHA-256 |
| [ZK Proof Lab](https://systemslibrarian.github.io/crypto-lab-zk-proof-lab/) | Zero-Knowledge Proofs | Schnorr · SHA-256 Commitments · Fiat-Shamir · zk-SNARK |
| [Phantom Vault](https://systemslibrarian.github.io/crypto-lab-phantom-vault/) | Stateless Passwords | PBKDF2-SHA-256 · HMAC-DRBG · Rejection Sampling |
| [Corrupted Oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/) | Backdoored RNG | Dual\_EC\_DRBG · HMAC-DRBG · ChaCha20-DRBG · P-256 |
| [Iron Letter](https://systemslibrarian.github.io/crypto-lab-iron-letter/) | Asymmetric Encryption | ECIES P-256 · RSA-OAEP · AES-256-GCM |
| [Quantum Vault KpqC](https://systemslibrarian.github.io/crypto-lab-quantum-vault-kpqc/) | Post-Quantum | AES-256-GCM · Shamir SSS · SMAUG-T · HAETAE |
| [Blind Oracle](https://systemslibrarian.github.io/crypto-lab-blind-oracle/) | Homomorphic Encryption | TFHE-rs |
| [Snow 2](https://systemslibrarian.github.io/snow2/) | Stream Cipher | XChaCha20-Poly1305 · Argon2id · HKDF-SHA-256 · Steganography |
| [Dad Mode Morse](https://systemslibrarian.github.io/dad-mode-morse2/) | Encrypted Morse | AES-256-GCM · Argon2id · HKDF-SHA-256 · Ed25519 |
| [Patron Shield](https://systemslibrarian.github.io/crypto-lab-patron-shield/) | Library Privacy | IT-PIR · XOR Secret Sharing · Chor et al. 1995 |
| [Silent Tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) | Secure MPC | Shamir SSS · GF(2⁶¹−1) · Lagrange Interpolation · Additive Homomorphism |
| [FROST Threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) | Threshold Signatures | FROST (RFC 9591) · Ed25519 · Nonce Commitments · VSS Commitments |
| [Dilithium Seal](https://systemslibrarian.github.io/crypto-lab-dilithium-seal/) | Post-Quantum Signatures | ML-DSA · CRYSTALS-Dilithium · Lattice |
| [Ratchet Wire](https://systemslibrarian.github.io/crypto-lab-ratchet-wire/) | Forward-Secret Messaging | Double Ratchet · X25519 · HKDF · AES-256-GCM |
| [Kyber Vault](https://systemslibrarian.github.io/crypto-lab-kyber-vault/) | Post-Quantum KEM | ML-KEM · CRYSTALS-Kyber · Lattice · AES-256-GCM |
| [Iron Serpent](https://systemslibrarian.github.io/crypto-lab-iron-serpent/) | Block Cipher | Serpent · AES-256 · SPN |
| [Shamir Gate](https://systemslibrarian.github.io/crypto-lab-shamir-gate/) | Secret Sharing | Shamir SSS · Lagrange Interpolation · GF(p) |
| [Dead Sea Cipher](https://systemslibrarian.github.io/crypto-lab-dead-sea-cipher/) | Historical Cipher | Substitution · Transposition · Atbash |
| [SPHINCS+ Ledger](https://systemslibrarian.github.io/crypto-lab-sphincs-ledger/) | Hash-Based Signatures | SLH-DSA · SPHINCS+ · SHA-256 · FORS |
| [Biham Lens](https://systemslibrarian.github.io/crypto-lab-biham-lens/) | Differential Cryptanalysis | Differential Cryptanalysis · SPN · DDT · Chosen-Plaintext |
| [Hybrid Wire](https://systemslibrarian.github.io/crypto-lab-hybrid-wire/) | Hybrid Key Exchange | X25519 · ML-KEM-768 · HKDF-SHA256 · AES-256-GCM |
| [Babel Hash](https://systemslibrarian.github.io/crypto-lab-babel-hash/) | Hash Functions | SHA-256 · SHA3-256 · BLAKE3 · HMAC |
| [AES Modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/) | Block Cipher Modes | AES · AES-GCM · AES-CBC · Authenticated Encryption |
| [RSA Forge](https://systemslibrarian.github.io/crypto-lab-rsa-forge/) | Public-Key Cryptography | RSA · OAEP · PSS · PKCS#1 |
| [Curve Lens](https://systemslibrarian.github.io/crypto-lab-curve-lens/) | Elliptic Curves | ECC · Curve25519 · ECDH · P-256 |
| [X3DH Wire](https://systemslibrarian.github.io/crypto-lab-x3dh-wire/) | Asynchronous Key Agreement | X3DH · X25519 · HKDF-SHA-256 · Signal Protocol |
| [Noise Pipe](https://systemslibrarian.github.io/crypto-lab-noise-pipe/) | Noise Protocol Framework | X25519 · HKDF · WireGuard · Handshake Patterns |
| [MAC Race](https://systemslibrarian.github.io/crypto-lab-mac-race/) | Message Authentication | HMAC · CMAC · Poly1305 · GHASH |
| [KDF Chain](https://systemslibrarian.github.io/crypto-lab-kdf-chain/) | Key Derivation | HKDF · PBKDF2 · scrypt · Argon2id |
| [Format Ward](https://systemslibrarian.github.io/crypto-lab-format-ward/) | Format-Preserving Encryption | FF1 · FF3-1 · AES-256 · Tokenization |
| [Padding Oracle](https://systemslibrarian.github.io/crypto-lab-padding-oracle/) | CBC Padding Oracle | AES-CBC · PKCS#7 · Vaudenay 2002 · POODLE |
| [Timing Oracle](https://systemslibrarian.github.io/crypto-lab-timing-oracle/) | Timing Side-Channel | Timing Attack · HMAC · RSA · Cache-Timing |
| [McEliece Gate](https://systemslibrarian.github.io/crypto-lab-mceliece-gate/) | Post-Quantum KEM | Classic McEliece · Goppa Codes · Post-Quantum |
| [BIKE Vault](https://systemslibrarian.github.io/crypto-lab-bike-vault/) | Code-Based KEM | BIKE · QC-MDPC · Post-Quantum · KEM |
| [HQC Vault](https://systemslibrarian.github.io/crypto-lab-hqc-vault/) | Code-Based KEM | HQC · Reed-Muller · Reed-Solomon · Post-Quantum |
| [Falcon Seal](https://systemslibrarian.github.io/crypto-lab-falcon-seal/) | Post-Quantum Signatures | Falcon · NTRU · FFT Sampling · Post-Quantum |
| [ChaCha20 Stream](https://systemslibrarian.github.io/crypto-lab-chacha20-stream/) | Stream Cipher | ChaCha20 · ARX · Nonce Reuse · Keystream |
| [Ed25519 Forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) | Digital Signatures | Ed25519 · Deterministic Nonces · ZIP215 · Cofactor |
| [Hash Zoo](https://systemslibrarian.github.io/crypto-lab-hash-zoo/) | Hash Internals | SHA-256 · SHA3-256 · BLAKE3 · Merkle-Damgård · Sponge |
| [KDF Arena](https://systemslibrarian.github.io/crypto-lab-kdf-arena/) | KDF Benchmarks | HKDF · PBKDF2 · scrypt · Argon2id |
| [Poly1305 MAC](https://systemslibrarian.github.io/crypto-lab-poly1305-mac/) | MAC Primitive | Poly1305 · GF(2¹³⁰−5) · Key-Reuse Attack · Polynomial Stepper |
| [Shamir Visual](https://systemslibrarian.github.io/crypto-lab-shamir-visual/) | Secret Sharing Visualizer | Shamir SSS · Lagrange Interpolation · Polynomial Graph |
| [OT Gate](https://systemslibrarian.github.io/crypto-lab-ot-gate/) | Oblivious Transfer | Simplest OT · Chou-Orlandi 2015 · X25519 · AES-256-GCM |
| [LMS Ledger](https://systemslibrarian.github.io/crypto-lab-lms-ledger/) | Stateful Hash-Based Signatures | LMS · HSS · W-OTS+ · NIST SP 800-208 |
| [Merkle Vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) | Merkle Trees | SHA-256 · Merkle Tree · Inclusion Proofs · Certificate Transparency |
| [Nonce Guard](https://systemslibrarian.github.io/crypto-lab-nonce-guard/) | Nonce Misuse Resistance | AES-GCM · AES-GCM-SIV · RFC 8452 · Synthetic IV |
| [Pairing Gate](https://systemslibrarian.github.io/crypto-lab-pairing-gate/) | Pairing Cryptography | BLS12-381 · BLS Signatures · Signature Aggregation · Rogue Key Attack |
| [Oblivious Shelf](https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/) | IT-PIR Library Privacy | XOR PIR · Chor et al. 1995 · 2-Server PIR · Privacy Audit |

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
