# Crypto Lab

🥇 **[Crypto Lab](https://crypto-lab.systemslibrarian.dev/)** · [2026 Cybersecurity Excellence Awards — Gold Winner](https://cybersecurity-excellence-awards.com/candidates/crypto-lab-2026/)

> Browser-based cryptography demos — no backends, no accounts, just the math.\*

\* ⚡ One deliberate exception: **[Blind Oracle](https://systemslibrarian.github.io/crypto-lab-blind-oracle/)** runs a live Rust/TFHE-rs server to demonstrate real fully homomorphic encryption — it adds your two encrypted numbers and still mathematically cannot read them.

A curated collection of single-concept cryptography demonstrations. Each one isolates a real primitive or protocol and makes it interactive in the browser. Classic algorithms, post-quantum schemes, zero-knowledge proofs — all grounded in real specifications, not toy reimplementations.

**Live →** https://crypto-lab.systemslibrarian.dev/

---

## Featured

| Project | Concept | Primitives |
|---|---|---|
| [Quantum Vault KpqC](https://systemslibrarian.github.io/crypto-lab-quantum-vault-kpqc/) | Post-Quantum | AES-256-GCM · Shamir SSS · SMAUG-T · HAETAE |
| [Corrupted Oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/) | Backdoored RNG | Dual_EC_DRBG · HMAC-DRBG · ChaCha20-DRBG · P-256 |
| [Padding Oracle](https://systemslibrarian.github.io/crypto-lab-padding-oracle/) | CBC Padding Oracle | AES-CBC · PKCS#7 · Vaudenay 2002 · POODLE |
| [Nonce Lattice](https://systemslibrarian.github.io/crypto-lab-nonce-lattice/) | Lattice Attack | ECDSA · Hidden Number Problem · LLL Reduction · secp256k1 |

---

## Learning Paths

Curated, ordered journeys through the catalog. Pick one on the [live site](https://crypto-lab.systemslibrarian.dev/) and follow it step by step.

| Path | Focus | Journey |
|---|---|---|
| **Developer** | A builder's journey — from primitives to the protocols you actually ship. | Babel Hash → AES Modes → KDF Chain → Educational RSA → RSA Forge → Point Arithmetic → Curve Lens → Signed Bytes → DH MITM → X3DH Wire → Noise Pipe → OPAQUE Gate → WebAuthn → SSH Handshake → TLS Handshake → PQ TLS Handshake |
| **Cryptanalyst** | An attacker's lens — classical ciphers to post-quantum side channels. | Dead Sea Cipher → Biham Lens → Padding Oracle → Timing Oracle → Power Trace → Salamander → Nonce Collision → Entropy Collapse → Nonce Lattice → Frozen Heart → KyberSlash → Lattice Fault |
| **Post-Quantum** | A focused track on PQ KEMs, signatures, hybrids, and migration. | PQ Families → Kyber Vault → KEM Trap → Dilithium Seal → MAYO Seal → Hybrid Wire → Hybrid PQC → Downgrade Wire → PQ TLS Handshake → PQ Rotation → Harvest Timeline |
| **Key Exchange** | How two parties agree on a secret — classical ECDH to hybrid post-quantum handshakes. | Key Exchange → Curve Lens → DH MITM → X3DH Wire → Ratchet Wire → Noise Pipe → OPAQUE Gate → TLS Handshake → Kyber Vault → Hybrid Wire → PQ TLS Handshake |

---

## All Demos

| Project | Category | Stack |
|---|---|---|
| [ORAM Vault](https://systemslibrarian.github.io/crypto-lab-oram-vault/) | Access-Pattern Privacy | Path ORAM · Position Map · Stash · Access Patterns |
| [Paillier Gate](https://systemslibrarian.github.io/crypto-lab-paillier-gate/) | Additive Homomorphic Encryption | Paillier · Additive HE · Private Voting · Aggregation |
| [Credential Veil](https://systemslibrarian.github.io/crypto-lab-credential-veil/) | Anonymous Credentials | BBS+ · Selective Disclosure · Unlinkability · Range Proof |
| [Iron Letter](https://systemslibrarian.github.io/crypto-lab-iron-letter/) | Asymmetric Encryption | ECIES P-256 · RSA-OAEP · AES-256-GCM |
| [X3DH Wire](https://systemslibrarian.github.io/crypto-lab-x3dh-wire/) | Asynchronous Key Agreement | X3DH · X25519 · HKDF-SHA-256 · Signal Protocol |
| [AEGIS Gate](https://systemslibrarian.github.io/crypto-lab-aegis-gate/) | Authenticated Encryption | AEGIS-256 · AES Round Function · 6-State Sponge · Test Vectors |
| [Kerberos v5](https://systemslibrarian.github.io/crypto-lab-kerberos/) | Authentication Protocol | RFC 4120 · Needham-Schroeder · Lowe Attack · AES-256-CTS |
| [Corrupted Oracle](https://systemslibrarian.github.io/crypto-lab-corrupted-oracle/) | Backdoored RNG | Dual_EC_DRBG · HMAC-DRBG · ChaCha20-DRBG · P-256 |
| [Bitcoin Script](https://systemslibrarian.github.io/crypto-lab-bitcoin-script/) | Bitcoin Script | secp256k1 · P2PKH · ECDSA · Stack Machine |
| [Blind Sign](https://systemslibrarian.github.io/crypto-lab-blind-sign/) | Blind Signatures | Chaum RSA · Schnorr EC · e-Cash · Unlinkability |
| [Iron Serpent](https://systemslibrarian.github.io/crypto-lab-iron-serpent/) | Block Cipher | Serpent · AES-256 · SPN |
| [World Ciphers](https://systemslibrarian.github.io/crypto-lab-world-ciphers/) | Block Cipher | Camellia · ARIA · SM4 · Kuznyechik |
| [AES Modes](https://systemslibrarian.github.io/crypto-lab-aes-modes/) | Block Cipher Modes | AES · AES-GCM · AES-CBC · Authenticated Encryption |
| [Traitor Trace](https://systemslibrarian.github.io/crypto-lab-traitor-trace/) | Broadcast Encryption | NNL Subset-Cover · Broadcast Encryption · Traitor Tracing · AES-256-GCM |
| [Padding Oracle](https://systemslibrarian.github.io/crypto-lab-padding-oracle/) | CBC Padding Oracle | AES-CBC · PKCS#7 · Vaudenay 2002 · POODLE |
| [Time Trust](https://systemslibrarian.github.io/crypto-lab-time-trust/) | Clock-Dependent Security | Ed25519 · X.509 · JWT · TOTP |
| [BIKE Vault](https://systemslibrarian.github.io/crypto-lab-bike-vault/) | Code-Based KEM | BIKE · QC-MDPC · Post-Quantum · KEM |
| [HQC Vault](https://systemslibrarian.github.io/crypto-lab-hqc-vault/) | Code-Based KEM | HQC · Reed-Muller · Reed-Solomon · Post-Quantum |
| [Commit Gate](https://systemslibrarian.github.io/crypto-lab-commit-gate/) | Commitment Schemes | Hash Commitment · Pedersen · Binding & Hiding · Homomorphic |
| [Hybrid Sign](https://systemslibrarian.github.io/crypto-lab-hybrid-sign/) | Composite Signatures | Ed25519 · ML-DSA-65 · Composite Signatures · IETF LAMPS |
| [Model Breach](https://systemslibrarian.github.io/crypto-lab-model-breach/) | Cryptanalysis | Threat Modeling · Candidate Enumeration · MITM Recovery · Guess-and-Determine |
| [DRBG Arena](https://systemslibrarian.github.io/crypto-lab-drbg-arena/) | CSPRNG | HMAC_DRBG · CTR_DRBG · Hash_DRBG · NIST SP 800-90A |
| [Web of Trust](https://systemslibrarian.github.io/crypto-lab-web-of-trust/) | Decentralized Trust | PGP · OpenPGP · GnuPG · Key Signing · Trust Graph |
| [Shadow Vault](https://systemslibrarian.github.io/crypto-lab-shadow-vault/) | Deniable Encryption | Argon2id · ChaCha20-Poly1305 · SHA-256 |
| [Biham Lens](https://systemslibrarian.github.io/crypto-lab-biham-lens/) | Differential Cryptanalysis | Differential Cryptanalysis · SPN · DDT · Chosen-Plaintext |
| [DH MITM](https://systemslibrarian.github.io/crypto-lab-diffie-hellman-mitm/) | Diffie-Hellman + MITM | Diffie-Hellman · Modular Arithmetic · MITM · Key Exchange |
| [ECDSA Forge](https://systemslibrarian.github.io/crypto-lab-ecdsa-forge/) | Digital Signatures | ECDSA · secp256k1 · RFC 6979 · Nonce Reuse |
| [Ed25519 Forge](https://systemslibrarian.github.io/crypto-lab-ed25519-forge/) | Digital Signatures | Ed25519 · EdDSA · Deterministic Nonces · ZIP215 · Cofactor |
| [Schnorr Forge](https://systemslibrarian.github.io/crypto-lab-schnorr-forge/) | Digital Signatures | BIP-340 · secp256k1 · Nonce Reuse · Aggregation |
| [DKG Gate](https://systemslibrarian.github.io/crypto-lab-dkg-gate/) | Distributed Key Generation | Pedersen DKG · GJKR 1999 · Feldman VSS · ristretto255 |
| [Icy DVRF](https://systemslibrarian.github.io/crypto-lab-icy-dvrf/) | Distributed VRF | DVRF · Chaum-Pedersen DLEQ · ristretto255 · FROST Nonces |
| [Downgrade Wire](https://systemslibrarian.github.io/crypto-lab-downgrade-wire/) | Downgrade Attacks | TLS 1.3 · Transcript Binding · X25519MLKEM768 · Downgrade |
| [Curve Lens](https://systemslibrarian.github.io/crypto-lab-curve-lens/) | Elliptic Curves | ECC · Curve25519 · ECDH · P-256 |
| [Point Arithmetic](https://systemslibrarian.github.io/crypto-lab-ec-point-arithmetic/) | Elliptic Curves | Group Law · Chord-and-Tangent · Scalar Mult · secp256k1 |
| [Encrochat](https://systemslibrarian.github.io/crypto-lab-encrochat/) | Endpoint Compromise | Double Ratchet · X25519 · AES-256-GCM · Endpoint Implant |
| [E91](https://systemslibrarian.github.io/crypto-lab-e91/) | Entanglement-Based QKD | E91 · Entanglement · CHSH Bell Test · QKD |
| [Envelope KMS](https://systemslibrarian.github.io/crypto-lab-envelope-kms/) | Envelope Encryption | RFC 3394 · AES Key Wrap · DEK/KEK · Key Rotation |
| [Jevil](https://systemslibrarian.github.io/crypto-lab-jevil/) | Few-Time Signatures | Jevil · Hash-Based · Goldilocks Field · Lagrange Interpolation |
| [Format Ward](https://systemslibrarian.github.io/crypto-lab-format-ward/) | Format-Preserving Encryption | FF1 · FF3-1 · AES-256 · Tokenization |
| [Ratchet Wire](https://systemslibrarian.github.io/crypto-lab-ratchet-wire/) | Forward-Secret Messaging | Double Ratchet · X25519 · HKDF · AES-256-GCM |
| [MLS Group](https://systemslibrarian.github.io/crypto-lab-mls-group/) | Group Messaging Security | MLS (RFC 9420) · TreeKEM · Epoch Key Schedule · Forward Secrecy |
| [Collision Vault](https://systemslibrarian.github.io/crypto-lab-collision-vault/) | Hash Collisions | MD5 · SHA-1 · SHAttered · Chosen-Prefix Collision |
| [Hash Zoo](https://systemslibrarian.github.io/crypto-lab-hash-zoo/) | Hash Construction | SHA-256 · SHA3-256 · BLAKE3 · Merkle-Damgård |
| [Babel Hash](https://systemslibrarian.github.io/crypto-lab-babel-hash/) | Hash Functions | SHA-256 · SHA3-256 · BLAKE3 · HMAC |
| [World Hashes](https://systemslibrarian.github.io/crypto-lab-world-hashes/) | Hash Functions | SM3 · Streebog · Kupyna · SHA-256 |
| [LMS/XMSS](https://systemslibrarian.github.io/crypto-lab-lms-xmss/) | Hash-Based Signatures | LMS · LM-OTS · HSS · NIST SP 800-208 |
| [SPHINCS+ Ledger](https://systemslibrarian.github.io/crypto-lab-sphincs-ledger/) | Hash-Based Signatures | SLH-DSA · FIPS 205 · SPHINCS+ · SHA-256 · WOTS+ |
| [Bitcoin Wallet](https://systemslibrarian.github.io/crypto-lab-bitcoin-wallet/) | HD Wallet Mechanics | secp256k1 · BIP-32 · BIP-39 · Bech32 |
| [Curve448](https://systemslibrarian.github.io/crypto-lab-curve448/) | High-Security Curves | X448 · Ed448 · RFC 7748 · RFC 8032 |
| [Syndrome Hints](https://systemslibrarian.github.io/crypto-lab-syndrome-hints/) | Hint-Assisted ISD | Hint-ISD · Prange · Stern · Syndrome Decoding |
| [Dead Sea Cipher](https://systemslibrarian.github.io/crypto-lab-dead-sea-cipher/) | Historical Cipher | Substitution · Vigenère · Atbash |
| [Blind Oracle](https://systemslibrarian.github.io/crypto-lab-blind-oracle/) | Homomorphic Encryption | FHE · TFHE-rs · Rust · Encrypted Compute |
| [CKKS Lab](https://systemslibrarian.github.io/crypto-lab-ckks-lab/) | Homomorphic Encryption | CKKS · RLWE · Approximate FHE · Encrypted Inference |
| [FHE Arena](https://systemslibrarian.github.io/crypto-lab-fhe-arena/) | Homomorphic Encryption | BGV/BFV · RLWE · Noise Budget · SIMD Batching |
| [HPKE Envelope](https://systemslibrarian.github.io/crypto-lab-hpke-envelope/) | Hybrid Encryption | DHKEM X25519 · HKDF-SHA256 · AES-GCM · RFC 9180 |
| [Hybrid Wire](https://systemslibrarian.github.io/crypto-lab-hybrid-wire/) | Hybrid Key Exchange | X25519 · ML-KEM-768 · HKDF-SHA256 · AES-256-GCM |
| [Hybrid PQC](https://systemslibrarian.github.io/crypto-lab-hybrid-pqc/) | Hybrid Key Exchange & Signatures | X25519 · ML-KEM-768 · Ed25519 · ML-DSA-65 |
| [Hybrid Guide](https://systemslibrarian.github.io/crypto-lab-hybrid-guide/) | Hybrid PQC | KEM Combiner · X25519 · ML-KEM-768 · X-Wing |
| [IBE Gate](https://systemslibrarian.github.io/crypto-lab-ibe-gate/) | Identity-Based Encryption | Boneh-Franklin · BLS12-381 · Identity-Based Encryption · Key Escrow |
| [Oblivious Shelf](https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/) | IT-PIR | XOR PIR · Chor et al. 1995 · 2-Server PIR · Privacy Audit |
| [KDF Arena](https://systemslibrarian.github.io/crypto-lab-kdf-arena/) | KDF Benchmarks | HKDF · PBKDF2 · scrypt · Argon2id |
| [KEM Trap](https://systemslibrarian.github.io/crypto-lab-kem-trap/) | KEM Misuse | ML-KEM-768 · FIPS 203 · FO Transform · Implicit Rejection |
| [Salamander](https://systemslibrarian.github.io/crypto-lab-salamander/) | Key Commitment | AES-GCM · GHASH · GF(2¹²⁸) · Message Franking |
| [KDF Chain](https://systemslibrarian.github.io/crypto-lab-kdf-chain/) | Key Derivation | HKDF · PBKDF2 · scrypt · Argon2id |
| [Key Exchange](https://systemslibrarian.github.io/crypto-lab-key-exchange/) | Key Exchange Overview | Diffie-Hellman · ECDH · X25519 · ML-KEM |
| [Key Mirror](https://systemslibrarian.github.io/crypto-lab-key-mirror/) | Key Transparency | Merkle Tree · VRF · Ed25519 · KEYTRANS |
| [Nonce Lattice](https://systemslibrarian.github.io/crypto-lab-nonce-lattice/) | Lattice Attack | ECDSA · Hidden Number Problem · LLL Reduction · secp256k1 |
| [LWE Hints](https://systemslibrarian.github.io/crypto-lab-lwe-hints/) | Lattice Cryptanalysis | LWE · Sparse Ternary Secrets · Approximate Hints · Lattice |
| [NTRU Classic](https://systemslibrarian.github.io/crypto-lab-ntru-classic/) | Lattice Cryptography | NTRU · Polynomial Rings · Lattice · EESS#1 |
| [Lattice Gentle](https://systemslibrarian.github.io/crypto-lab-lattice-gentle/) | Lattice Foundations | SVP & CVP · LLL · LWE & SIS · toy ML-KEM/ML-DSA |
| [Broken Trust](https://systemslibrarian.github.io/crypto-lab-broken-trust/) | Leakage Cryptanalysis | ML-DSA · Bit Leakage · Hill-Climbing · Subkey Recovery |
| [Patron Shield](https://systemslibrarian.github.io/crypto-lab-patron-shield/) | Library Privacy | IT-PIR · XOR Secret Sharing · Chor et al. 1995 |
| [Ascon](https://systemslibrarian.github.io/crypto-lab-ascon/) | Lightweight Cryptography | Ascon-AEAD128 · Ascon-Hash256 · Lightweight Crypto · IoT |
| [Poly1305 MAC](https://systemslibrarian.github.io/crypto-lab-poly1305-mac/) | MAC Primitive | Poly1305 · GF(2¹³⁰−5) · Key-Reuse Attack · Polynomial Stepper |
| [SPDZ Forge](https://systemslibrarian.github.io/crypto-lab-spdz-forge/) | Malicious-Secure MPC | SPDZ · Beaver Triples · SPDZ MACs · Dishonest Majority |
| [Merkle Proofs](https://systemslibrarian.github.io/crypto-lab-merkle-proofs/) | Merkle Inclusion Proofs | SHA-256 · Merkle Proof · RFC 6962 · CVE-2012-2459 |
| [Merkle Vault](https://systemslibrarian.github.io/crypto-lab-merkle-vault/) | Merkle Trees | SHA-256 · Merkle Tree · Inclusion Proofs · Certificate Transparency |
| [MAC Race](https://systemslibrarian.github.io/crypto-lab-mac-race/) | Message Authentication | HMAC · CMAC · Poly1305 · GHASH |
| [Blind Relay](https://systemslibrarian.github.io/crypto-lab-blind-relay/) | Metadata Privacy | OHTTP · HPKE · Binary HTTP · RFC 9458 |
| [PQ Rotation](https://systemslibrarian.github.io/crypto-lab-pq-rotation/) | Migration Operations | Hybrid X.509 · CNSA 2.0 · Key Rotation · Migration Planner |
| [Harvest Timeline](https://systemslibrarian.github.io/crypto-lab-harvest-timeline/) | Migration Planning | Mosca Inequality · CRQC Scenarios · Cost of Delay · PQC Migration |
| [Dilithium Reject](https://systemslibrarian.github.io/crypto-lab-dilithium-reject/) | ML-DSA Internals | ML-DSA · Rejection Sampling · FIPS 204 · Timing Tradeoffs |
| [Syndrome Drain](https://systemslibrarian.github.io/crypto-lab-syndrome-drain/) | Multi-Instance Degradation | DOOM · BIKE · HQC · Classic McEliece |
| [MAYO Seal](https://systemslibrarian.github.io/crypto-lab-mayo-seal/) | Multivariate Signatures | MAYO · GF(16) · Whipping · NIST On-Ramp |
| [Multivariate UOV](https://systemslibrarian.github.io/crypto-lab-multivariate/) | Multivariate Signatures | UOV · GF(256) · MQ Problem · Beullens Attack |
| [Noise Pipe](https://systemslibrarian.github.io/crypto-lab-noise-pipe/) | Noise Protocol Framework | X25519 · HKDF · WireGuard · Handshake Patterns |
| [Nonce Guard](https://systemslibrarian.github.io/crypto-lab-nonce-guard/) | Nonce Misuse Resistance | AES-GCM · AES-GCM-SIV · RFC 8452 · Synthetic IV |
| [Nonce Collision](https://systemslibrarian.github.io/crypto-lab-nonce-collision/) | Nonce Reuse | AES-GCM · ChaCha20-Poly1305 · Forbidden Attack · Crib Dragging |
| [OT Gate](https://systemslibrarian.github.io/crypto-lab-ot-gate/) | Oblivious Transfer | Simplest OT · Chou-Orlandi 2015 · Edwards25519 · AES-256-GCM |
| [Pairing Gate](https://systemslibrarian.github.io/crypto-lab-pairing-gate/) | Pairing Cryptography | BLS12-381 · BLS Signatures · Signature Aggregation · Rogue Key Attack |
| [PAKE Gate](https://systemslibrarian.github.io/crypto-lab-pake-gate/) | PAKE Family | SRP-6a · J-PAKE · CPace · Dragonfly |
| [WebAuthn](https://systemslibrarian.github.io/crypto-lab-webauthn/) | Passkeys & Authentication | WebAuthn · FIDO2 · Passkeys · Assertion |
| [Bcrypt Forge](https://systemslibrarian.github.io/crypto-lab-bcrypt-forge/) | Password Hashing | bcrypt · Blowfish · Cost Factor · Timing-Safe |
| [OPAQUE Gate](https://systemslibrarian.github.io/crypto-lab-opaque-gate/) | Password-Authenticated Key Exchange | OPAQUE · OPRF · 3DH · HKDF |
| [SPAKE Gate](https://systemslibrarian.github.io/crypto-lab-spake-gate/) | Password-Authenticated KX | SPAKE2 · SPAKE2+ · P-256 · PAKE |
| [OTP Vault](https://systemslibrarian.github.io/crypto-lab-otp-vault/) | Perfect Secrecy | One-Time Pad · Perfect Secrecy · Two-Time Pad · Crib Dragging |
| [Chain of Trust](https://systemslibrarian.github.io/crypto-lab-chain-of-trust/) | PKI & Certificates | X.509 · RFC 5280 · ECDSA P-256 · nameConstraints |
| [PKI Chain](https://systemslibrarian.github.io/crypto-lab-pki-chain/) | PKI & Certificates | X.509 · Certificate Transparency · CA Compromise · ML-DSA |
| [Vigenère Break](https://systemslibrarian.github.io/crypto-lab-vigenere-break/) | Polyalphabetic Cipher | Vigenère · Kasiski Examination · Index of Coincidence · Frequency Analysis |
| [Quantum Vault KpqC](https://systemslibrarian.github.io/crypto-lab-quantum-vault-kpqc/) | Post-Quantum | AES-256-GCM · Shamir SSS · SMAUG-T · HAETAE |
| [Grover](https://systemslibrarian.github.io/crypto-lab-grover/) | Post-Quantum Cryptanalysis | Grover's Algorithm · Amplitude Amplification · Phase Kickback · AES Key Search |
| [LLL Break](https://systemslibrarian.github.io/crypto-lab-lll-break/) | Post-Quantum Cryptanalysis | LLL · BKZ · Gram-Schmidt · Toy LWE |
| [Shor](https://systemslibrarian.github.io/crypto-lab-shor/) | Post-Quantum Cryptanalysis | Shor's Algorithm · Period Finding · QFT · RSA Factorization |
| [Isogeny Gate](https://systemslibrarian.github.io/crypto-lab-isogeny-gate/) | Post-Quantum Isogeny | SIDH · CSIDH · SQIsign · Castryck-Decru |
| [Frodo Vault](https://systemslibrarian.github.io/crypto-lab-frodo-vault/) | Post-Quantum KEM | FrodoKEM · LWE · Lattice · Post-Quantum |
| [Kyber Vault](https://systemslibrarian.github.io/crypto-lab-kyber-vault/) | Post-Quantum KEM | ML-KEM · FIPS 203 · CRYSTALS-Kyber · Lattice · AES-256-GCM |
| [McEliece Gate](https://systemslibrarian.github.io/crypto-lab-mceliece-gate/) | Post-Quantum KEM | Classic McEliece · Goppa Codes · Post-Quantum |
| [Scloud+ Vault](https://systemslibrarian.github.io/crypto-lab-scloud-vault/) | Post-Quantum KEM | Scloud+ · LWE KEM · BW32 Coding · Ternary Secrets |
| [PQ Families](https://systemslibrarian.github.io/crypto-lab-pq-families/) | Post-Quantum Overview | Lattice · Code-Based · Hash-Based · Multivariate · Isogeny |
| [Ciphertext Mirror](https://systemslibrarian.github.io/crypto-lab-ciphertext-mirror/) | Post-Quantum Side-Channel | ML-KEM · FO Transform · LDPC Decoder · NTT Blinding |
| [HQC Timing](https://systemslibrarian.github.io/crypto-lab-hqc-timing/) | Post-Quantum Side-Channel | HQC · BCH Decoder · Timing Oracle · Constant-Time |
| [HQC Timing Break](https://systemslibrarian.github.io/crypto-lab-hqc-timing-break/) | Post-Quantum Side-Channel | HQC · Cache Timing · Reed-Muller · Soft-ISD |
| [KyberSlash](https://systemslibrarian.github.io/crypto-lab-kyberslash/) | Post-Quantum Side-Channel | ML-KEM · KyberSlash · Timing Attack · Barrett Reduction |
| [Lattice Fault](https://systemslibrarian.github.io/crypto-lab-lattice-fault/) | Post-Quantum Side-Channel | ML-KEM · ML-DSA · KyberSlash · Fault Injection |
| [Dilithium Seal](https://systemslibrarian.github.io/crypto-lab-dilithium-seal/) | Post-Quantum Signatures | ML-DSA · FIPS 204 · CRYSTALS-Dilithium · Lattice |
| [Falcon Seal](https://systemslibrarian.github.io/crypto-lab-falcon-seal/) | Post-Quantum Signatures | Falcon · FN-DSA · NTRU · FFT Sampling · Post-Quantum |
| [HAWK](https://systemslibrarian.github.io/crypto-lab-hawk/) | Post-Quantum Signatures | HAWK · Lattice Signatures · Gaussian Sampling · NIST Round 2 |
| [MPCitH Sign](https://systemslibrarian.github.io/crypto-lab-mpcith-sign/) | Post-Quantum Signatures | MPC-in-the-Head · Fiat-Shamir · SHA-256 Commitments · Merkle Proofs |
| [PQ TLS Handshake](https://systemslibrarian.github.io/crypto-lab-pq-tls-handshake/) | Post-Quantum TLS | TLS 1.3 · X25519MLKEM768 · Key Schedule · Hybrid PQC |
| [Power Trace](https://systemslibrarian.github.io/crypto-lab-power-trace/) | Power Side-Channel | CPA · DPA · AES-128 · Hamming Weight |
| [PSI Gate](https://systemslibrarian.github.io/crypto-lab-psi-gate/) | Private Set Intersection | DH-PSI · ristretto255 · Hash-to-Curve · Contact Discovery |
| [Reshare Circle](https://systemslibrarian.github.io/crypto-lab-reshare-circle/) | Proactive Secret Sharing | Shamir · Feldman VSS · HJKY 1995 · Mobile Adversary |
| [Frozen Heart](https://systemslibrarian.github.io/crypto-lab-frozen-heart/) | Proof Forgery | Fiat-Shamir · Schnorr · ristretto255 · NIZK |
| [Protocol Compose](https://systemslibrarian.github.io/crypto-lab-protocol-compose/) | Protocol Composition | MAC-then-Encrypt · Encrypt-then-MAC · CRIME · TLS 1.3 |
| [Educational RSA](https://systemslibrarian.github.io/crypto-lab-rsa-educational/) | Public-Key Cryptography | RSA · Key Generation · Modular Exponentiation · OAEP |
| [RSA Forge](https://systemslibrarian.github.io/crypto-lab-rsa-forge/) | Public-Key Cryptography | RSA · OAEP · PSS · PKCS#1 |
| [ElGamal Plain](https://systemslibrarian.github.io/crypto-lab-elgamal-plain/) | Public-Key Encryption | ElGamal · RFC 3526 Group 14 · Homomorphism · Re-randomization |
| [BB84](https://systemslibrarian.github.io/crypto-lab-bb84/) | Quantum Key Distribution | Photon Polarization · Basis Sifting · QBER · Privacy Amplification |
| [Quantum Entropy](https://systemslibrarian.github.io/crypto-lab-quantum-entropy/) | Quantum RNG | QRNG · Min-Entropy · Toeplitz Extractor · SP 800-90B |
| [Harvest Vault](https://systemslibrarian.github.io/crypto-lab-harvest-vault/) | Quantum Threat | HNDL · Mosca's Theorem · Q-Day Timeline · PQC Migration |
| [Entropy Collapse](https://systemslibrarian.github.io/crypto-lab-entropy-collapse/) | Randomness Failures | HMAC_DRBG · Seed Provenance · VM Cloning · Nonce Reuse |
| [Ring Sign](https://systemslibrarian.github.io/crypto-lab-ring-sign/) | Ring Signatures | LSAG · Key Image · Group Signatures · Monero |
| [Enigma Forge](https://systemslibrarian.github.io/crypto-lab-enigma-forge/) | Rotor Machine | Enigma · Rotors · Plugboard · Bombe |
| [Time-Lock Puzzle](https://systemslibrarian.github.io/crypto-lab-time-lock-puzzle/) | RSW Time-Lock | RSW · Sequential Squaring · AES-256-GCM · Trapdoor |
| [Shamir Gate](https://systemslibrarian.github.io/crypto-lab-shamir-gate/) | Secret Sharing | Shamir SSS · Lagrange Interpolation · GF(p) |
| [Garbled Gate](https://systemslibrarian.github.io/crypto-lab-garbled-gate/) | Secure MPC | Garbled Circuits · Oblivious Transfer · Free XOR · Two-Party MPC |
| [Silent Tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) | Secure MPC | Shamir SSS · GF(2⁶¹−1) · Lagrange Interpolation · Additive Homomorphism |
| [SSH Handshake](https://systemslibrarian.github.io/crypto-lab-ssh-handshake/) | Secure Shell Handshake | X25519 · Ed25519 · TOFU · known_hosts |
| [Signed Bytes](https://systemslibrarian.github.io/crypto-lab-signed-bytes/) | Signature Canonicalization | Ed25519 · JCS RFC 8785 · Parser Differential · Unicode NFC |
| [LMS Ledger](https://systemslibrarian.github.io/crypto-lab-lms-ledger/) | Stateful Hash-Based Signatures | LMS · HSS · W-OTS+ · NIST SP 800-208 |
| [Phantom Vault](https://systemslibrarian.github.io/crypto-lab-phantom-vault/) | Stateless Passwords | PBKDF2-SHA-256 · HMAC-DRBG · Rejection Sampling |
| [J-UNIWARD](https://systemslibrarian.github.io/crypto-lab-j-uniward/) | Steganography | J-UNIWARD · DCT · Wavelet Distortion · Adaptive Embedding |
| [Stego Suite](https://systemslibrarian.github.io/crypto-lab-stego-suite/) | Steganography | LSB · DCT · Adaptive Embedding · Chi-Squared Steganalysis |
| [ChaCha20 Stream](https://systemslibrarian.github.io/crypto-lab-chacha20-stream/) | Stream Cipher | ChaCha20 · ARX · Nonce Reuse · Keystream |
| [Snow 2](https://systemslibrarian.github.io/snow2/) | Stream Cipher | XChaCha20-Poly1305 · Argon2id · HKDF-SHA-256 · Steganography |
| [Isogeny Atlas](https://systemslibrarian.github.io/crypto-lab-isogeny-atlas/) | Supersingular Isogeny Graph | Isogeny Graphs · Modular Polynomials · Endomorphism Rings · CGL Hash |
| [Protocol Checker](https://systemslibrarian.github.io/crypto-lab-protocol-checker/) | Symbolic Analysis | Dolev-Yao · Symbolic Model · Needham-Schroeder · Unification |
| [Shamir vs FROST](https://systemslibrarian.github.io/crypto-lab-shamir-vs-frost/) | Threshold Crypto Compared | Shamir SSS · FROST · Ed25519 · GF(256) |
| [Threshold Decrypt](https://systemslibrarian.github.io/crypto-lab-threshold-decrypt/) | Threshold Decryption | ElGamal · P-256 · NIZK Proofs · t-of-n |
| [GG20 Wallet](https://systemslibrarian.github.io/crypto-lab-gg20-wallet/) | Threshold ECDSA | GG20 · Paillier · secp256k1 · Distributed Key Generation |
| [FROST Threshold](https://systemslibrarian.github.io/crypto-lab-frost-threshold/) | Threshold Signatures | FROST (RFC 9591) · Ed25519 · Nonce Commitments · VSS Commitments |
| [Threshold ML-DSA](https://systemslibrarian.github.io/crypto-lab-threshold-mldsa/) | Threshold Signatures | Threshold ML-DSA · Distributed Signing · Two-Party · Post-Quantum |
| [Timing Oracle](https://systemslibrarian.github.io/crypto-lab-timing-oracle/) | Timing Side-Channel | Timing Attack · HMAC · RSA · Cache-Timing |
| [Timing Side-Channel](https://systemslibrarian.github.io/crypto-lab-timing-sidechannel/) | Timing Side-Channel | Timing Attack · Constant-Time · Side-Channel · Secret Compare |
| [TLS Handshake](https://systemslibrarian.github.io/crypto-lab-tls-handshake/) | TLS 1.3 Walkthrough | TLS 1.3 · X25519 · Ed25519 · AES-GCM |
| [Blind Hello](https://systemslibrarian.github.io/crypto-lab-blind-hello/) | TLS Privacy | TLS 1.3 · ECH · HPKE · SNI |
| [JWT Forge](https://systemslibrarian.github.io/crypto-lab-jwt-forge/) | Token Forgery | JWT · JWS · alg:none · HS/RS Key Confusion |
| [VDF](https://systemslibrarian.github.io/crypto-lab-vdf/) | Verifiable Delay Function | VDF · Wesolowski · Modular Squaring · Randomness Beacon |
| [VRF Gate](https://systemslibrarian.github.io/crypto-lab-vrf-gate/) | Verifiable Randomness | ECVRF P-256 · Wesolowski VDF · RANDAO · RFC 9381 |
| [VSS Gate](https://systemslibrarian.github.io/crypto-lab-vss-gate/) | Verifiable Secret Sharing | Feldman VSS · Pedersen VSS · Commitment Verification · Cheating Detection |
| [SNARK Arena](https://systemslibrarian.github.io/crypto-lab-snark-arena/) | Zero-Knowledge Proofs | Groth16 · PLONK · Trusted Setup · zk-SNARK |
| [STARK Tower](https://systemslibrarian.github.io/crypto-lab-stark-tower/) | Zero-Knowledge Proofs | zk-STARK · AIR Constraints · FRI · Post-Quantum |
| [ZK Arena](https://systemslibrarian.github.io/crypto-lab-zk-arena/) | Zero-Knowledge Proofs | zk-SNARK · zk-STARK · Proof Systems · Comparison |
| [ZK Proof Lab](https://systemslibrarian.github.io/crypto-lab-zk-proof-lab/) | Zero-Knowledge Proofs | Schnorr · SHA-256 Commitments · Fiat-Shamir · zk-SNARK |
| [Bulletproofs](https://systemslibrarian.github.io/crypto-lab-bulletproofs/) | Zero-Knowledge Range Proofs | Bulletproofs · ristretto255 · Range Proofs · Inner-Product Argument |

---

## Related Projects

These sit outside the browser-demo scope of Crypto Lab but belong to the same collection:

- **[Crypto Compare](https://systemslibrarian.github.io/crypto-compare/)** — Algorithm reference covering NIST and PQ-Safe standards.
- **[Cipher Museum](https://ciphermuseum.com)** — An interactive museum spanning 3,900 years of cryptographic history. Thirteen halls, 140 exhibits, live encryption demos, and cryptanalysis labs.
- **[Meow Decoder](https://www.meowdecoder.com/)** — Secure optical air-gap file transfer via QR-code GIFs. AES-256-GCM + Argon2id + ML-KEM-1024 + fountain codes. Python + Rust.

---

## About

Each demo is self-contained: one concept, one repository, full source. Documentation and threat models are included where the attack surface warrants it.

Built by [Paul Clark](https://github.com/systemslibrarian) — IT Librarian & Systems Analyst.

---

*So whether you eat or drink or whatever you do, do it all for the glory of God. — 1 Corinthians 10:31*
