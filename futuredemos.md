# Future Demos — Coverage Analysis & Gap List

Analysis of what Crypto Lab currently covers (114 demos) and which well-known
demos are missing. Gaps below were verified absent from both card chips **and**
card copy text.

---

## What we cover — and it's deep

| Section | Density | Notes |
|---|---|---|
| **Post-quantum** | Exceptional (~25) | All 4 NIST winners + McEliece, BIKE, HQC, Frodo, NTRU, HAWK, KpqC, isogenies, hybrids, migration tooling, PQ side-channels. Best-covered area by far. |
| **Privacy/MPC/ZK** | Strong | PIR, ORAM, PSI, FHE (incl. live TFHE server), garbled circuits, threshold, VSS, full ZK spread (SNARK/STARK/Bulletproofs). |
| **Public-key** | Strong | RSA (+Bleichenbacher/PSS), ECDSA, Ed25519, ElGamal, ECIES, pairings, IBE, blind, ring. |
| **Key-exchange/Protocols** | Strong | Signal stack (X3DH + Double Ratchet), Noise, MLS, Kerberos, PKI/CT, OPAQUE, WebAuthn, SSH, KMS, TLS 1.3. |
| **Foundations/Hashing** | Strong | Hash zoo + length-extension, MACs, KDFs, DRBGs, Dual_EC backdoor, VRF, commitments, Shamir, bcrypt. |
| **Symmetric** | Good | AES modes (+ECB penguin), Serpent, world ciphers, ChaCha20, AEGIS, Ascon, FPE, GCM-SIV. |
| **Cryptanalysis** | Good | Padding/timing oracles, differential, HNP/lattice, PQ faults. |
| **Historical** | Thin (3) | Dead Sea Cipher + two steganography demos. |

---

## Current coverage — full inventory (114 demos)

Every demo grouped by curriculum section, with its primitive chips.

### Foundations (15)

| Demo | Primitives |
|---|---|
| Babel Hash | SHA-256 · SHA3-256 · BLAKE3 · HMAC |
| Bcrypt Forge | bcrypt · Blowfish · Cost Factor · Timing-Safe |
| Commit Gate | Hash Commitment · Pedersen · Binding & Hiding · Homomorphic |
| Curve Lens | ECC · Curve25519 · ECDH · P-256 |
| DRBG Arena | HMAC_DRBG · CTR_DRBG · Hash_DRBG · NIST SP 800-90A |
| Hash Zoo | SHA-256 · SHA3-256 · BLAKE3 · Merkle-Damgård |
| KDF Arena | HKDF · PBKDF2 · scrypt · Argon2id |
| KDF Chain | HKDF · PBKDF2 · scrypt · Argon2id |
| MAC Race | HMAC · CMAC · Poly1305 · GHASH |
| Merkle Vault | SHA-256 · Merkle Tree · Inclusion Proofs · Certificate Transparency |
| Phantom Vault | PBKDF2-SHA-256 · HMAC-DRBG · Rejection Sampling |
| Poly1305 MAC | Poly1305 · GF(2¹³⁰−5) · Key-Reuse Attack · Polynomial Stepper |
| Shamir Gate | Shamir SSS · Lagrange Interpolation · GF(p) |
| VRF Gate | ECVRF P-256 · Wesolowski VDF · RANDAO · RFC 9381 |
| World Hashes | SM3 · Streebog · Kupyna · SHA-256 |

### Symmetric Encryption (10)

| Demo | Primitives |
|---|---|
| AEGIS Gate | AEGIS-256 · AES Round Function · 6-State Sponge · Test Vectors |
| AES Modes | AES · AES-GCM · AES-CBC · Authenticated Encryption |
| Ascon | Ascon-AEAD128 · Ascon-Hash256 · Lightweight Crypto · IoT |
| ChaCha20 Stream | ChaCha20 · ARX · Nonce Reuse · Keystream |
| Dad Mode Morse | AES-256-GCM · Argon2id · HKDF-SHA-256 · Ed25519 |
| Format Ward | FF1 · FF3-1 · AES-256 · Tokenization |
| Iron Serpent | Serpent · AES-256 · SPN |
| Shadow Vault | Argon2id · ChaCha20-Poly1305 · SHA-256 |
| Snow 2 | XChaCha20-Poly1305 · Argon2id · HKDF-SHA-256 · Steganography |
| World Ciphers | Camellia · ARIA · SM4 · Kuznyechik |

### Public-Key & Signatures (15)

| Demo | Primitives |
|---|---|
| Bitcoin Wallet | secp256k1 · BIP-32 · BIP-39 · Bech32 |
| Blind Sign | Chaum RSA · Schnorr EC · e-Cash · Unlinkability |
| Curve448 | X448 · Ed448 · RFC 7748 · RFC 8032 |
| ECDSA Forge | ECDSA · secp256k1 · RFC 6979 · Nonce Reuse |
| Ed25519 Forge | Ed25519 · EdDSA · Deterministic Nonces · ZIP215 · Cofactor |
| ElGamal Plain | ElGamal · RFC 3526 Group 14 · Homomorphism · Re-randomization |
| IBE Gate | Boneh-Franklin · BLS12-381 · Identity-Based Encryption · Key Escrow |
| Iron Letter | ECIES P-256 · RSA-OAEP · AES-256-GCM |
| Jevil | Jevil · Hash-Based · Goldilocks Field · Lagrange Interpolation |
| LMS Ledger | LMS · HSS · W-OTS+ · NIST SP 800-208 |
| LMS/XMSS | LMS · XMSS · HSS · NIST SP 800-208 |
| Pairing Gate | BLS12-381 · BLS Signatures · Signature Aggregation · Rogue Key Attack |
| RSA Forge | RSA · OAEP · PSS · PKCS#1 |
| Ring Sign | LSAG · Key Image · Group Signatures · Monero |
| SPHINCS+ Ledger | SLH-DSA · FIPS 205 · SPHINCS+ · SHA-256 · FORS |

### Key Exchange & Protocols (13)

| Demo | Primitives |
|---|---|
| Envelope KMS | RFC 3394 · AES Key Wrap · DEK/KEK · Key Rotation |
| Hybrid Wire | X25519 · ML-KEM-768 · HKDF-SHA256 · AES-256-GCM |
| Kerberos v5 | RFC 4120 · Needham-Schroeder · Lowe Attack · AES-256-CTS |
| Key Exchange | Diffie-Hellman · ECDH · X25519 · ML-KEM |
| MLS Group | MLS (RFC 9420) · TreeKEM · Epoch Key Schedule · Forward Secrecy |
| Noise Pipe | X25519 · HKDF · WireGuard · Handshake Patterns |
| OPAQUE Gate | OPAQUE · OPRF · 3DH · AES-256-GCM |
| PKI Chain | X.509 · Certificate Transparency · CA Compromise · ML-DSA |
| Ratchet Wire | Double Ratchet · X25519 · HKDF · AES-256-GCM |
| SSH Handshake | X25519 · Ed25519 · TOFU · known_hosts |
| Web of Trust | PGP · OpenPGP · GnuPG · Key Signing · Trust Graph |
| WebAuthn | WebAuthn · FIDO2 · Passkeys · Attestation |
| X3DH Wire | X3DH · X25519 · HKDF-SHA-256 · Signal Protocol |

### Privacy & Advanced (20)

| Demo | Primitives |
|---|---|
| Blind Oracle | TypeScript · Rust · TFHE-rs |
| Bulletproofs | Bulletproofs · ristretto255 · Range Proofs · Inner-Product Argument |
| CKKS Lab | CKKS · RLWE · Approximate FHE · Encrypted Inference |
| FHE Arena | BGV/BFV · RLWE · Noise Budget · SIMD Batching |
| FROST Threshold | FROST (RFC 9591) · Ed25519 · Nonce Commitments · VSS Commitments |
| GG20 Wallet | GG20 · Paillier · secp256k1 · Distributed Key Generation |
| Garbled Gate | Garbled Circuits · Oblivious Transfer · Free XOR · Two-Party MPC |
| ORAM Vault | Path ORAM · Position Map · Stash · Access Patterns |
| OT Gate | Simplest OT · Chou-Orlandi 2015 · X25519 · AES-256-GCM |
| Oblivious Shelf | XOR PIR · Chor et al. 1995 · 2-Server PIR · Privacy Audit |
| PSI Gate | DH-PSI · ristretto255 · Hash-to-Curve · Contact Discovery |
| Paillier Gate | Paillier · Additive HE · Private Voting · Aggregation |
| Patron Shield | IT-PIR · XOR Secret Sharing · Chor et al. 1995 |
| SNARK Arena | Groth16 · PLONK · Trusted Setup · zk-SNARK |
| STARK Tower | zk-STARK · AIR Constraints · FRI · Post-Quantum |
| Silent Tally | Shamir SSS · GF(2^61-1) · Lagrange Interpolation · Additive Homomorphism |
| Threshold Decrypt | ElGamal · P-256 · NIZK Proofs · t-of-n |
| VSS Gate | Feldman VSS · Pedersen VSS · Commitment Verification · Cheating Detection |
| ZK Arena | zk-SNARK · zk-STARK · Proof Systems · Comparison |
| ZK Proof Lab | Schnorr · SHA-256 Commitments · Fiat-Shamir · zk-SNARK |

### Post-Quantum (24)

| Demo | Primitives |
|---|---|
| BB84 | Photon Polarization · Basis Sifting · QBER · Privacy Amplification |
| BIKE Vault | BIKE · QC-MDPC · Post-Quantum · KEM |
| Dilithium Reject | ML-DSA · Rejection Sampling · FIPS 204 · Timing Tradeoffs |
| Dilithium Seal | ML-DSA · FIPS 204 · CRYSTALS-Dilithium · Lattice |
| Falcon Seal | Falcon · FN-DSA · NTRU · FFT Sampling · Post-Quantum |
| Frodo Vault | FrodoKEM · LWE · Lattice · Post-Quantum |
| Grover | Grover's Algorithm · Amplitude Amplification · Phase Kickback · AES Key Search |
| HAWK | HAWK · Lattice Signatures · Gaussian Sampling · NIST Round 2 |
| HQC Vault | HQC · Reed-Muller · Reed-Solomon · Post-Quantum |
| Harvest Timeline | Mosca Inequality · CRQC Scenarios · Cost of Delay · PQC Migration |
| Harvest Vault | HNDL · Mosca's Theorem · Q-Day Timeline · PQC Migration |
| Hybrid Sign | Ed25519 · ML-DSA-65 · Composite Signatures · IETF LAMPS |
| Isogeny Gate | SIDH · CSIDH · SQIsign · Castryck-Decru |
| Kyber Vault | ML-KEM · FIPS 203 · CRYSTALS-Kyber · Lattice · AES-256-GCM |
| MPCitH Sign | MPC-in-the-Head · Fiat-Shamir · SHA-256 Commitments · Merkle Proofs |
| McEliece Gate | Classic McEliece · Goppa Codes · Post-Quantum |
| NTRU Classic | NTRU · Polynomial Rings · Lattice · EESS#1 |
| PQ Families | Lattice · Code-Based · Hash-Based · Multivariate · Isogeny |
| PQ Rotation | Hybrid X.509 · CNSA 2.0 · Key Rotation · Migration Planner |
| PQ TLS Handshake | TLS 1.3 · X25519MLKEM768 · Key Schedule · Hybrid PQC |
| Quantum Vault KpqC | AES-256-GCM · Shamir SSS · SMAUG-T · HAETAE |
| S-Cloud+ Vault | S-Cloud+ · LWE KEM · BW32 Coding · Ternary Secrets |
| Shor | Shor's Algorithm · Period Finding · QFT · RSA Factorization |
| Threshold ML-DSA | Threshold ML-DSA · Distributed Signing · k-of-n · Post-Quantum |

### Cryptanalysis (14)

| Demo | Primitives |
|---|---|
| Biham Lens | Differential Cryptanalysis · SPN · DDT · Chosen-Plaintext |
| Ciphertext Mirror | ML-KEM · FO Transform · LDPC Decoder · NTT Blinding |
| Corrupted Oracle | Dual_EC_DRBG · HMAC-DRBG · ChaCha20-DRBG · P-256 |
| HQC Timing | HQC · BCH Decoder · Timing Oracle · Constant-Time |
| HQC Timing Break | HQC · Cache Timing · Reed-Muller · Soft-ISD |
| KyberSlash | ML-KEM · KyberSlash · Timing Attack · Barrett Reduction |
| LLL Break | LLL · BKZ · Gram-Schmidt · Toy LWE |
| Lattice Fault | ML-KEM · ML-DSA · KyberSlash · Fault Injection |
| Model Breach | Threat Modeling · Candidate Enumeration · MITM Recovery · Guess-and-Determine |
| Nonce Guard | AES-GCM · AES-GCM-SIV · RFC 8452 · Synthetic IV |
| Nonce Lattice | ECDSA · Hidden Number Problem · LLL Reduction · secp256k1 |
| Padding Oracle | AES-CBC · PKCS#7 · Vaudenay 2002 · POODLE |
| Protocol Compose | MAC-then-Encrypt · Encrypt-then-MAC · CRIME · TLS 1.3 |
| Timing Oracle | Timing Attack · HMAC · RSA · Cache-Timing |

### Historical & Steganography (3)

| Demo | Primitives |
|---|---|
| Dead Sea Cipher | Substitution · Transposition · Atbash |
| J-UNIWARD | J-UNIWARD · DCT · Wavelet Distortion · Adaptive Embedding |
| Stego Suite | LSB · DCT · Adaptive Embedding · Chi-Squared Steganalysis |

---

## Genuinely missing — verified absent from chips *and* copy

### Tier 1 — iconic / high-traffic, would surprise people they're absent

1. **Enigma machine** — the most famous cipher in history, and the Historical section has a single demo. Rotors + plugboard + the cribbing/Bombe break is a natural showpiece.
2. **One-time pad & the two-time-pad break** — foundational (perfect secrecy) *and* a great attack demo (XOR two ciphertexts under a reused key, crib-drag to recover plaintext). Nothing covers it.
3. **Hash collisions (MD5/SHA-1, SHAttered, chosen-prefix)** — length-extension is covered well, but not collisions, which is the more famous hash failure (identical-prefix PDFs, Flame).
4. **JWT / JWS** — the signature format developers touch daily; `alg:none` and HS/RS key-confusion attacks. A clear real-world gap.

### Tier 2 — well-known, fills an obvious pair or deployed system

5. **Classical cipher cryptanalysis** — Caesar/Vigenère with frequency analysis + Kasiski. Dead Sea Cipher has substitution/transposition/Atbash but not the canonical Vigenère break.
6. **Feistel / DES** — there's SPN (Serpent) and differential cryptanalysis *of* DES, but no demo of the Feistel structure itself. (FPE's "AES Feistel rounds" only mentions it in passing.)
7. **Linear cryptanalysis (Matsui)** — the natural twin of the differential demo (Biham Lens).
8. **TOTP/HOTP 2FA** — RFC 6238/4226 authenticator codes; ubiquitous, developer-facing, absent.
9. **Disk encryption / AES-XTS** — BitLocker/FileVault/LUKS sector encryption; a deployed mode not present.

### Tier 3 — on-theme, rounds out a family

10. **Classical DLP attacks** — Pollard's rho / baby-step-giant-step. Lattice attacks and Shor are covered, but not the classical discrete-log breaks.
11. **Multivariate PQC demo (UOV/MAYO)** — multivariate appears only in the PQ Families *overview*; it's the one NIST family without a dedicated card.
12. **DNSSEC or DKIM** — deployed real-world signing infrastructure; neither is represented.

---

## Highest-impact single addition

**Enigma** — the most glaring absence relative to expectations, visually rich, and
it gives the nearly-empty Historical section a real anchor. Close runners-up:
**JWT** (developer relevance) and **hash collisions** (completes the hash-attack story).
