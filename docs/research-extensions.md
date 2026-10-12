# Research exhibit extensions — 12 October 2026

This records the remaining optional implementation scope from the 18-month review. It is not a security audit or a claim that every new paper should become a runnable attack.

| Extension | Outcome | Scope |
| --- | --- | --- |
| PQ Families RSA-2048 comparison | Implemented | Separate 2019/2021 and 2025 source accounts, assumptions, physical/logical metrics and runtime; no Q-Day prediction. |
| ChaCha20 Stream reduced-round trace | Implemented | Isolated public-input 6/7/20-round prefix trace. Full encryption remains 20 rounds. No bit-puncturing attack or fractional-round reproduction. |
| Collision Vault 36-step SHA-256 pair | Implemented | Paper Table 2 bytes independently reproduce the reported compression value. Browser contrasts normal full SHA-256; mutation/wrong-round controls and independent Python/TypeScript checks. This verifies a supplied pair, not the search complexity. |
| Sector Vault EME2 engine | Historical research exhibit implemented | Real EME* / EME2 encryption/decryption from the 2004 paper and archived December 2008 draft. Independent AES backends and third-party regression vectors; IEEE1619.2-2025 normative conformance remains unverified. |

## Credential Veil BBS baseline

[Credential Veil](https://systemslibrarian.github.io/crypto-lab-credential-veil/)
now has a verified SHA-256 BBS baseline against numbered CFRG draft-12
(28 September 2026) and immutable matching publisher fixtures/tooling.
All 30 original fixture byte sequences match the selected upstream snapshot;
102 unit tests, source/equation/trace checks and 18 local browser cases passed.
The demo links the draft and fixture source visibly. The draft remains work in
progress, and these checks exclude the custom age-proof composition and browser
side channels. The original source revision remains unknown in Git history.
See the lab’s [baseline review](https://github.com/systemslibrarian/crypto-lab-credential-veil/blob/main/docs/bbs-baseline-review.md)
for exact pins and evidence boundaries.

## EME2 exhibit and remaining standards validation

[IEEE1619.2-2025](https://standards.ieee.org/ieee/1619.2/11949/) was published 20 November 2025. Its public record describes EME2-AES and test vectors, but full access requires purchase or subscription. No authorized copy of that normative text or its official vectors was available in this work.

The [runnable Sector Vault exhibit](https://systemslibrarian.github.io/crypto-lab-sector-vault/#wideblock-research)
now implements Halevi’s [2004 EME* construction](https://eprint.iacr.org/2004/125)
with byte encoding from the archived IEEE P1619.2/D9 draft (December 2008).
It computes AES-128/256 encryption and decryption, AD hashing, partial blocks
and 128-block mask renewal. Its UI compares XTS and EME2 ciphertext/plaintext
diffusion, block splicing, changed address/AD and exact acceptance of old
ciphertext. XTS, AES-GCM and trusted-version lessons remain intact.

Validation cross-checks noble AES/byte arithmetic against an independently
transcribed OpenSSL/BigInt implementation in both directions, plus six
published self-generated Rust regression vectors. The Rust reference's key
order differs from D9; tests map named components explicitly. These are not
official IEEE vectors. The historical draft's vector section remains TBD.
The exhibit uses bounded teaching inputs, not claimed IEEE domain limits.
Primary links, retrieved-PDF fingerprints and test provenance are documented
in the lab's [validation notes](https://github.com/systemslibrarian/crypto-lab-sector-vault/blob/main/docs/eme2-validation.md).

**IEEE1619.2-2025 conformance remains outstanding.** Once the current normative
text and official vectors are available through authorized access, compare
the construction, key format, byte encoding, AD/partial-block rules, mask
renewal, domain and usage requirements; add versioned official tests in both
directions. This historical implementation is not a substitute for that work
and must not be relabeled as current-edition conformance.
