# crypto-lab card accuracy findings (README cross-check, analysis only)
All 24 findings resolved — 123 / 123 cards accurate as of 2026-07-21 re-verification.

The card fixes in index.html had already shipped by the time of re-verification
(commits between the 2026-07-02 audit and 2026-07-21). Seven README table rows
still carried the old chip sets and were synced on 2026-07-21. Remaining
README-vs-card differences are cosmetic label variants (README Category drives
its alphabetical sort and intentionally differs from card kickers).

## MAJOR — card describes a different demo / wrong scheme
- ~~hqc-timing-break: repo content is actually a **Paillier** demo~~ **RESOLVED 2026-07-21**: repo now contains the real HQC demo (title "HQC Cache-Timing Break", Reed-Muller + Soft-ISD engine, rebuilt in commits through 2026-07-12) and the live Pages site serves it. Card is accurate as written.
- ~~isogeny-gate: card says "toy SIDH over GF(71)"~~ **RESOLVED**: card copy now reads "toy CSIDH over GF(419)".

## ACCURACY ERRORS (wrong claim / label / number)
- ~~bb84: kicker "Post-Quantum Key Distribution"~~ **RESOLVED**: kicker is now "Quantum Key Distribution".
- ~~e91: category POST-QUANTUM; "eavesdropper dragged below 2 and caught" overstates~~ **RESOLVED**: category is KEY EXCHANGE only; copy now says the eavesdropper "drags it toward the classical bound, so the key is discarded".
- ~~biham-lens: "the technique that broke DES"~~ **RESOLVED**: copy now says "broke reduced-round DES".
- ~~hqc-timing: calls HQC "finalist"~~ **RESOLVED**: copy now says "the standardized code-based KEM".
- ~~hqc-vault: "perfect correctness"~~ **RESOLVED**: claim removed from copy.
- ~~hybrid-wire: attributes X25519+ML-KEM-768 to "Signal"~~ **RESOLVED**: copy now credits Chrome 124+ and Cloudflare only.
- ~~ed25519-forge: "ZIP215 cofactor handling" presented as a feature~~ **RESOLVED**: the demo caught up with the card — a live cofactor/ZIP215 malleability exhibit (Pitfalls & ZIP215 tab, dual ZIP215-vs-strict verdicts computed live via @noble/curves) shipped in the demo repo. Card is accurate as written.
- ~~iron-serpent: "S-box visualization" not present~~ **RESOLVED**: copy now describes avalanche analysis and the security-margin (round-count) view.
- ~~opaque-gate: chip "AES-256-GCM"~~ **RESOLVED**: chips are now OPAQUE / OPRF / 3DH / HKDF. README row synced 2026-07-21.
- ~~ot-gate: "X25519" (copy + chip)~~ **RESOLVED**: copy and chips now say Edwards25519. README row synced 2026-07-21.
- ~~lms-xmss: chip "XMSS" not implemented~~ **RESOLVED**: chip replaced with LM-OTS; copy frames XMSS as a comparison. README row synced 2026-07-21.
- ~~sphincs-ledger: chip "FORS" never used; WOTS+ missing~~ **RESOLVED**: chips now include WOTS+, FORS removed. README row synced 2026-07-21.
- ~~dead-sea-cipher: chip "Transposition" — no transposition cipher~~ **RESOLVED**: chip replaced with Vigenère; copy matches. README row synced 2026-07-21.
- ~~scloud-vault: name "S-Cloud+"; "faithful implementation"~~ **RESOLVED**: title is Scloud+ Vault; copy says "faithful but simplified".
- ~~rsa-forge: "Bleichenbacher ... and padding oracle" redundant~~ **RESOLVED**: copy now names "Bleichenbacher PKCS#1 v1.5 padding oracle" as one attack.
- ~~webauthn: "Attestation" excluded by demo~~ **RESOLVED**: copy and chips are assertion-only. README row synced 2026-07-21.
- ~~threshold-mldsa: "without any one signer ever reconstructing the full key"; "k-of-n"~~ **RESOLVED**: copy now says two-party and "key-non-reconstruction is illustrated, not enforced". README row synced 2026-07-21.

## OVERSELLING / SCOPE
- ~~format-ward: "PCI-DSS compliant"~~ **RESOLVED**: compliance claim removed; copy cites NIST SP 800-38G.
- ~~psi-gate: "learn only their overlap and nothing else"~~ **RESOLVED**: copy now says "their overlap (and each other's set size) and nothing more".
- ~~quantum-vault-kpqc: "Threshold file encryption"~~ **RESOLVED**: copy now says "Threshold short-secret encryption".

## CATEGORY / METADATA
- ~~bitcoin-wallet: category includes SIGNATURES~~ **RESOLVED**: category is HASHING & KDFS only.
- ~~ibe-gate: category includes SIGNATURES~~ **RESOLVED**: category is ENCRYPTION only.
- ~~harvest-vault: category PRIVACY only~~ **RESOLVED**: category is now POST-QUANTUM | PRIVACY.
