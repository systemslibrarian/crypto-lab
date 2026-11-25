# Public evidence errata

The public evidence snapshot under `data/` is **intentionally frozen** to a single
dated capture — October 11, 2026 (UTC), private input SHA-256
`be878bc9739e66d3407773dfb679b2bcc7485678a9bc1ed0f6d325e67d5645e2`, projected to
`PUBLIC_SHA256 = 5c2d3ed72dfe1a5f01586fedcf8ed2451e5bc3de49423c54394047d3aa7ef179`.
It is not re-captured or re-pinned when a lab's source later changes; the pinned
bytes are the record of what was collected on that date.

This file records rows of that frozen snapshot that are **known to be stale** relative
to the labs' current source. The entries below **supersede** those rows. The snapshot
files themselves are left unchanged on purpose.

## Superseded rows

### 1. BIKE — NIST round status (`demo_crypto_lab_bike-vault`)

- **Stale value (snapshot):** "…side-by-side comparison against ML-KEM. **NIST Round 4 alternate candidate.**"
- **Corrected value:** BIKE was a **NIST Round 4 candidate**, not an "alternate" ("alternate" was Round 3 terminology; Round 4 candidates were under continued evaluation).
- **Authoritative source:** `crypto-lab-bike-vault` `src/compare.ts` (`nistStatus: 'Round 4 Candidate'` for BIKE Levels 1/3/5) and `README.md` ("a NIST Post-Quantum Cryptography round-4 candidate"), at commit `c764857`.
- **Recorded:** 2026-11-19.

### 2. Polygon zkEVM — deployment status (`demo_crypto_lab_snark-arena`)

- **Stale value (snapshot):** "…**production deployments** in Zcash, Polygon zkEVM, WorldID, and zkLogin."
- **Corrected value:** Polygon zkEVM is a **historical** deployment, not a current one: its Mainnet Beta sequencer was sunset on 3 July 2026 (announced for deprecation on 11 June 2025). It is kept as a historical PLONK/FFLONK case, not a live production deployment.
- **Authoritative source:** `crypto-lab-snark-arena` `README.md` ("kept as a historical case (wound down in 2026)"; "Sources reviewed 15 November 2026" with the Polygon blog, forum and zkEVM-page citations), at commit `eb97e339`.
- **Recorded:** 2026-11-19.

### 3. VRF Gate — final participant’s choice (`crypto-lab-vrf-gate`)

The snapshot says the beacon simulation demonstrates resistance to last-reveal
manipulation. In this classroom construction the final participant can compare
the outcomes of revealing and withholding its contribution. The toy VDF enforces
no delay because its modulus has public factors.

The [lesson and its teaching notes](https://github.com/systemslibrarian/crypto-lab-vrf-gate/blob/c88b13bc17f680c4499f1ae1a55d870781469914/README.md)
explain this limitation. Recorded 2026-11-25.
