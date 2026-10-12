# Research exhibit extensions — 12 October 2026

This records the remaining optional implementation scope from the 18-month review. It is not a security audit or a claim that every new paper should become a runnable attack.

| Extension | Outcome | Scope |
| --- | --- | --- |
| PQ Families RSA-2048 comparison | Implemented | Separate 2019/2021 and 2025 source accounts, assumptions, physical/logical metrics and runtime; no Q-Day prediction. |
| ChaCha20 Stream reduced-round trace | Implemented | Isolated public-input 6/7/20-round prefix trace. Full encryption remains 20 rounds. No bit-puncturing attack or fractional-round reproduction. |
| Collision Vault 36-step SHA-256 pair | Implemented | Paper Table 2 bytes independently reproduce the reported compression value. Browser contrasts normal full SHA-256; mutation/wrong-round controls and independent Python/TypeScript checks. This verifies a supplied pair, not the search complexity. |
| Sector Vault EME2 engine | Source-blocked | The comparison card is complete. The current normative IEEE1619.2-2025 algorithm text and official vectors are still required for an implementation. |

## EME2 source constraint

[IEEE1619.2-2025](https://standards.ieee.org/ieee/1619.2/11949/) was published 20 November 2025. Its public record describes EME2-AES and test vectors, but full access requires purchase or subscription. No authorized copy of that normative text or its official vectors was available in this work.

Halevi’s public [2004 EME* paper](https://eprint.iacr.org/2004/125) was retrieved and reviewed as historical background. It is not a substitute for checking the current IEEE construction, requirements and vectors; older EME/EME* implementations or drafts must not be relabeled as IEEE1619.2-2025 conformance.

When those primary inputs become available, implement in a separate module, pin their version/provenance, and test official encryption/decryption vectors, permitted lengths and associated-data boundaries. Show whole-data-unit manipulation propagation without claiming authentication. Existing confidentiality-only replay/rollback controls must continue to succeed; integrity and freshness require separate authenticated/trusted mechanisms. Keep XTS and AES-GCM lessons intact.
