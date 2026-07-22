# crypto-lab card accuracy findings (README cross-check, analysis only)
99 / 123 cards accurate. 24 with discrepancies, below.

## MAJOR — card describes a different demo / wrong scheme
- ~~hqc-timing-break: repo content is actually a **Paillier** demo~~ **RESOLVED 2026-07-21**: repo now contains the real HQC demo (title "HQC Cache-Timing Break", Reed-Muller + Soft-ISD engine, rebuilt in commits through 2026-07-12) and the live Pages site serves it. Card is accurate as written.
- isogeny-gate: card says "toy SIDH over GF(71)"; demo is toy **CSIDH over GF(419)**. Wrong scheme AND wrong field.

## ACCURACY ERRORS (wrong claim / label / number)
- bb84: kicker "Post-Quantum Key Distribution" -> BB84 is **Quantum** Key Distribution (QKD), not PQC.
- e91: category POST-QUANTUM contradicts README ("do NOT confuse QKD with post-quantum"); also "eavesdropper dragged below 2 and caught" overstates (|S|<2 can't distinguish Eve from noise).
- biham-lens: "the technique that broke DES" -> full 16-round DES resists differential; only reduced-round fell.
- hqc-timing: calls HQC "finalist" -> HQC was **selected for standardization (2025)**.
- hqc-vault: "perfect correctness" -> HQC has a nonzero decryption-failure rate by design.
- hybrid-wire: attributes X25519+ML-KEM-768 to "Signal" -> Signal's PQXDH uses ML-KEM-1024 (Chrome 124+/Cloudflare are correct).
- ed25519-forge: "ZIP215 cofactor handling" presented as a feature -> README only discusses it conceptually; demo is keygen/sign/verify/tamper.
- iron-serpent: "S-box visualization" -> not present; demo has avalanche + security-margin (round-count) charts.
- opaque-gate: chip "AES-256-GCM" -> demo uses no AES (HMAC tag + derived key; OPRF/HKDF/HMAC/scrypt on P-256).
- ot-gate: "X25519" (copy + chip) -> demo uses **Edwards25519** group ops; X25519 (Montgomery DH) is the wrong label.
- lms-xmss: chip "XMSS" -> not implemented (only LMS/LM-OTS/HSS; XMSS is a one-line comparison).
- sphincs-ledger: chip "FORS" -> never used; central visualized primitive WOTS+ is missing from chips.
- dead-sea-cipher: chip "Transposition" + "transposition ciphers" -> no transposition cipher (only Atbash/Caesar/Vigenere/OTP + AES-GCM).
- scloud-vault: name "S-Cloud+" -> correct is **Scloud+**; "faithful implementation" -> README says faithful but **simplified**.
- rsa-forge: lists "Bleichenbacher ... and padding oracle" -> Bleichenbacher IS the padding oracle (redundant/misleading; only 2 attacks).
- webauthn: "Attestation" (copy + chip) -> README explicitly excludes attestation; demo is assertion/auth only. Also "platform vs cross-platform authenticators" not in demo.
- threshold-mldsa: "without any one signer ever reconstructing the full key" -> README says it DOES reconstruct (no-reconstruction NOT provided); "k-of-n" -> demo is two-party.

## OVERSELLING / SCOPE
- format-ward: "PCI-DSS compliant" -> not in README; compliance claim on a teaching demo. (uses NIST SP 800-38G FPE.)
- psi-gate: "learn only their overlap and nothing else" -> set sizes ARE revealed.
- quantum-vault-kpqc: "Threshold file encryption" -> seals short messages/secrets, no file encryption.

## CATEGORY / METADATA
- bitcoin-wallet: category includes SIGNATURES but demo only derives keys/addresses (no signing).
- ibe-gate: category includes SIGNATURES but it's IBE encryption only.
- harvest-vault: category PRIVACY only; it's an HNDL/PQC-migration tool -> add POST-QUANTUM (sibling harvest-timeline has it).
