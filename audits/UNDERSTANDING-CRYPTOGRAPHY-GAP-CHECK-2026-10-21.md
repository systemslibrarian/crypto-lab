# Understanding Cryptography, second edition — chapter map and gap check

**Review date:** 21 October 2026  
**Authors / edition:** Christof Paar, Jan Pelzl and Tim Güneysu, Springer, 2024  
**Original draft branch:** `draft/understanding-cryptography-2e` (review provenance)  
**Companion source:** [`learn/understanding-cryptography/`](../learn/understanding-cryptography/)  
**Publication:** `main`, with menu access at `/learn/understanding-cryptography/` and `home: false` (no homepage card).  
**Status:** Historical gap-check snapshot with a shipped follow-up below. The original findings, source pins and release-preparation evidence are retained as provenance, not a current unfulfilled-work list.

## Shipped follow-up — AES Anatomy and Clock Arithmetic

Both labs are now catalogued and linked in the published companion:

- [AES Anatomy, `7abf61f`](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/tree/7abf61f7fdcef076c5f536c81ec0e1b729b05118)
  supplies the chapter 4 field-arithmetic → S-box → key-expansion → full cipher
  → inverse route. That study stop is now a **direct connection**. Its original
  activity compares a deliberately weakened affine-only AES-128 fixture with
  full-AES controls; no attack on full AES or general security proof is claimed.
- [Clock Arithmetic, `5bb8684`](https://github.com/systemslibrarian/crypto-lab-clock-arithmetic/tree/5bb86840fab4806e3681c1a378fd4c643831035d)
  supplies signed residues in chapter 1, traced Euclid/Bézout and Euler φ in
  chapter 6, generalized CRT in chapter 7, and orders, generators, subgroups and
  a finite-field DH model in chapter 8. The named inverse-derivation teaching gap
  is filled. Tiny arithmetic and a shared-secret search do not establish hardness.

The current companion has **48 connections to 39 distinct catalogued labs**.
Recommendations 1 and 2 below record the original missing teaching surfaces;
they must not be reissued as new work. The chapter map and other recommendations
below remain the original source snapshot rather than a fresh review of every
lab or extension. Current activities and boundaries are in
[`learn/understanding-cryptography/chapters.mjs`](../learn/understanding-cryptography/chapters.mjs).

## Original findings and edition correction

Every published chapter has at least one useful catalogued lab connection. This
does **not** amount to complete chapter coverage. The clearest substantial
teaching gap is a coherent AES-internals route. Four narrower additions survive
the prior-batch exclusions: an extended-Euclid derivation, historical finite-field
DSA, PRESENT, and a Salsa20/ChaCha20 comparison. Smaller coverage boundaries are
recorded below without assigning more work to commissioned extensions.

The published second edition has **14 numbered chapters**. SHA-3 is **§11.5 within
Chapter 11**, not a separate numbered chapter. Post-Quantum Cryptography is
Chapter 12, MACs is Chapter 13, and the publisher calls Chapter 14 **Key Management**.
The authors' website calls that last chapter **Key Establishment**. The companion
preserves all 15 requested topics as **14 chapter entries plus a separate SHA-3
focus**, in the book's actual order. It contains **43 lab connections to 37 distinct
catalogued repositories**.

Edition authority:

- [Springer's second-edition record and 14-chapter list](https://link.springer.com/book/10.1007/978-3-662-69007-9),
  DOI `10.1007/978-3-662-69007-9`, eBook ISBN `978-3-662-69007-9`.
- [Publisher's front matter and contents](https://link.springer.com/content/pdf/bfm:978-3-662-69007-9/1),
  [authors' contents](https://www.cryptography-textbook.com/files/toc.pdf), and
  [authors' book page](https://www.cryptography-textbook.com/book/).
- [Second-edition errata](https://www.cryptography-textbook.com/wp-content/uploads/2025/04/errata_2nd.pdf).

The supplied detailed contents agree with the second-edition structure. The later
usable PDF has the first edition's 2010 copyright, Paar and Pelzl as its two
authors, and 13 chapters; it is a foundational reference, not the numbering
authority for this path. A separate promotional preview was not treated as a
complete second-edition text. No supplied PDF or book content is committed here.
This is a contents-led alignment and a lab-capability review, not a claim to have
checked every page or exercise of the full second edition.

## Evidence and mapping rules

1. **Catalog membership, names and destinations are authoritative.** The source
   snapshot is [`CATALOG.md` at `88f75e7`](https://github.com/systemslibrarian/crypto-lab/blob/88f75e7edc6fea762f65f6ef213e9e3f33c94617/CATALOG.md),
   blob `f6409d865b6432730ccbad3e327283ba2f292c4d`. The page generator reads the
   per-lab section directly, looks up each repository slug, and refuses missing
   or duplicate connections. It does not guess live URLs from repository names.
2. **Capability claims need more than a matching name.** Relevant repository
   READMEs and selected implementation files qualify the catalog's concise
   descriptions. For example, a real toy Goppa decoder is not a complete Classic
   McEliece KEM, and X25519 is a modern connection to finite-field DH.
3. **Direct connection means selected concepts.** Modern counterpart denotes a
   related but different construction or later standard. Introductory bridge
   denotes a partial or intuitive connection. Every study stop has an explicit
   boundary; none claims a complete chapter implementation.
4. **The prior batches are excluded at the level of the commissioned lesson.**
   Existing labs can still be linked. A deployed addition or an unfinished brief
   is not reissued as a new recommendation. The 32-brief exclusion ledger below
   covers 29 unique repositories.

The map deliberately selects useful entry points, rather than listing every
adjacent cryptographic exhibit. Repository links below use the catalog's exhibit
titles; their exact repository slugs are visible in the destinations. The companion
path supplies the catalog's live lab links.

## Original chapter → repository map

All rows represent **partial chapter coverage**. “Direct” and “bridge” describe
the relationship, not completeness. Numbering follows the published book.

| Book chapter / focus | Catalogued lab repositories | Selected coverage and explicit limit |
|---|---|---|
| 1. Introduction to Cryptography and Data Security | [Dead Sea Cipher](https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher); [Vigenère Break](https://github.com/systemslibrarian/crypto-lab-vigenere-break) | Direct classical-cipher and modular-arithmetic examples. Vigenère is a related bridge; an exact affine-cipher/integer-ring lesson is not established. |
| 2. Stream Ciphers | [OTP Vault](https://github.com/systemslibrarian/crypto-lab-otp-vault); [LFSR Forge](https://github.com/systemslibrarian/crypto-lab-lfsr-forge); [ChaCha20 Stream](https://github.com/systemslibrarian/crypto-lab-chacha20-stream) | Direct OTP, LFSR, Trivium and ChaCha20 connections. No catalogued Salsa20 stream-cipher lesson. OTP perfect-secrecy and Trivium extensions are already commissioned. |
| 3. The Data Encryption Standard (DES) and Alternatives | [Feistel Forge](https://github.com/systemslibrarian/crypto-lab-feistel-forge); [Iron Serpent](https://github.com/systemslibrarian/crypto-lab-iron-serpent); [Biham Lens](https://github.com/systemslibrarian/crypto-lab-biham-lens) | Direct DES and one AES finalist; differential SPN bridge. PRESENT is not implemented by these alternatives. Exact DESX/3DES execution is not established. |
| 4. The Advanced Encryption Standard (AES) | [AEGIS Gate](https://github.com/systemslibrarian/crypto-lab-aegis-gate); [AES Modes](https://github.com/systemslibrarian/crypto-lab-aes-modes); [Glass Box](https://github.com/systemslibrarian/crypto-lab-glass-box) | **Introductory/partial:** real AES in modes and white-box code, plus one genuine AES round inside AEGIS. No complete introductory GF arithmetic → key schedule → inverse route. |
| 5. More About Block Ciphers | [AES Modes](https://github.com/systemslibrarian/crypto-lab-aes-modes); [Sector Vault](https://github.com/systemslibrarian/crypto-lab-sector-vault); [Feistel Forge](https://github.com/systemslibrarian/crypto-lab-feistel-forge) | Direct ECB/CBC/CTR, authenticated modes, XTS and double-DES meet-in-the-middle. OFB is already commissioned; CFB and exact triple-encryption/whitening lessons remain unestablished. |
| 6. Introduction to Public-Key Cryptography | [Locks and Keys](https://github.com/systemslibrarian/crypto-lab-locks-and-keys); [Educational RSA](https://github.com/systemslibrarian/crypto-lab-rsa-educational) | Direct key-role and small RSA arithmetic connections. Modular inverses are computed, but quotient/remainder/Bézout derivation is not exposed as a step-by-step lesson. |
| 7. The RSA Cryptosystem | [Educational RSA](https://github.com/systemslibrarian/crypto-lab-rsa-educational); [RSA Forge](https://github.com/systemslibrarian/crypto-lab-rsa-forge); [Prime Witness](https://github.com/systemslibrarian/crypto-lab-prime-witness); [Factor Forge](https://github.com/systemslibrarian/crypto-lab-factor-forge) | Direct raw RSA versus OAEP/PSS, exponentiation, primality and factoring. Tiny attacks are not evidence against production parameters. Earlier RSA/CRT/oracle work is excluded. |
| 8. Cryptosystems Based on the Discrete Logarithm Problem | [Agreeing in Public](https://github.com/systemslibrarian/crypto-lab-agreeing-in-public); [ElGamal Plain](https://github.com/systemslibrarian/crypto-lab-elgamal-plain); [Log Forge](https://github.com/systemslibrarian/crypto-lab-log-forge) | Direct ElGamal and bounded DLP algorithms; **X25519 is a modern counterpart**, not the finite-field DH arithmetic lesson. Subgroup and static-DH extensions are already commissioned. |
| 9. Elliptic Curve Cryptosystems | [Point Arithmetic](https://github.com/systemslibrarian/crypto-lab-ec-point-arithmetic); [Curve Lens](https://github.com/systemslibrarian/crypto-lab-curve-lens) | Direct finite-field point arithmetic, scalar multiplication and ECDH. Real-coordinate drawings are intuition aids. Twist/validation work is already commissioned. |
| 10. Digital Signatures | [RSA Forge](https://github.com/systemslibrarian/crypto-lab-rsa-forge); [ElGamal Plain](https://github.com/systemslibrarian/crypto-lab-elgamal-plain); [ECDSA Forge](https://github.com/systemslibrarian/crypto-lab-ecdsa-forge) | Direct RSA, **already implemented ElGamal signatures**, and ECDSA. Historical finite-field DSA (§10.4) remains distinct and lacks a catalogued experiment. |
| 11. Hash Functions | [Hash Zoo](https://github.com/systemslibrarian/crypto-lab-hash-zoo); [Hash Hunt](https://github.com/systemslibrarian/crypto-lab-hash-hunt) | Direct hash goals, padding, avalanche, length extension and reduced-output searches. Complete SHA-256 compression/message-schedule teaching and proofs remain reading work; generic-attack extensions are excluded. |
| §11.5 — SHA-3 focus | [KMAC Gate](https://github.com/systemslibrarian/crypto-lab-kmac-gate) | **Substantial direct coverage already exists:** SHA3-256 framing, absorb blocks, rate/capacity and SHAKE squeezing. Full Keccak theta/rho/pi/chi/iota lane stepping is outside this surface. |
| 12. Post-Quantum Cryptography | [Lattice Gentle](https://github.com/systemslibrarian/crypto-lab-lattice-gentle); [What Is PQC](https://github.com/systemslibrarian/crypto-lab-what-is-pqc); [McEliece Gate](https://github.com/systemslibrarian/crypto-lab-mceliece-gate); [LMS Ledger](https://github.com/systemslibrarian/crypto-lab-lms-ledger); [Dilithium Seal](https://github.com/systemslibrarian/crypto-lab-dilithium-seal); [SPHINCS+ Ledger](https://github.com/systemslibrarian/crypto-lab-sphincs-ledger) | Direct toy LWE, Goppa/Patterson and stateful hash signatures; modern ML-KEM, ML-DSA and SLH-DSA paths. McEliece is not a complete submitted KEM; the small HSS transcript is non-interoperable. |
| 13. Message Authentication Codes (MACs) | [MAC Race](https://github.com/systemslibrarian/crypto-lab-mac-race); [AES Modes](https://github.com/systemslibrarian/crypto-lab-aes-modes) | Direct checksum/MAC contrast, HMAC, CMAC, GCM and CCM. Raw CBC-MAC/repair work is commissioned. Dedicated GMAC teaching is not established; bare GHASH is not GMAC. |
| 14. Key Management | [KDF Chain](https://github.com/systemslibrarian/crypto-lab-kdf-chain); [Kerberos v5](https://github.com/systemslibrarian/crypto-lab-kerberos); [DH MITM](https://github.com/systemslibrarian/crypto-lab-diffie-hellman-mitm); [PKI Chain](https://github.com/systemslibrarian/crypto-lab-pki-chain) | Direct KDF, MITM and scoped PKI; Kerberos is a practical KDC counterpart. Its Lowe lesson is public-key Needham–Schroeder, not §14.3.2’s symmetric protocol. Revocation uses local fixtures. |

## Original ranked recommendations

The ranking is an editorial teaching judgment: prerequisite value and reuse come
first, followed by how much of a genuinely missing construction becomes visible
and whether the addition can stay small. It is not a security-risk score or an
estimate of implementation effort. No new lab or extension is implemented by
this release.

### 1. AES core learner sequence — highest value, partial coverage

**Book:** Chapter 4, especially §§4.3–4.5.  
**Existing base:** AEGIS Gate, Glass Box, AES Modes.  
**New scope:** A focused AES-core teaching route, separate from the commissioned
AES Modes/OFB extension.

The fleet already computes full AES, and AEGIS Gate already opens one genuine
AES round. The gap is the sequence a first-time reader needs: polynomial
multiplication and reduction in GF(2^8), inversion and S-box construction,
MixColumns, key expansion, full encryption including the exceptional last round,
and inverse operations. The same arithmetic later supports several other topics.
Do not describe this as “missing AES,” “missing AES code,” or even “missing round
inspection.”

**Original activity for a future lesson:** Predict whether multiplying a chosen
byte by two requires reduction, inspect that operation, then trace the byte into
a round. Change one key byte, follow the derived round keys, and explain why
decrypting requires both the correct inverse layers and the correct key order.
Check a published AES test vector; a displayed trace is not a side-channel claim.

### 2. Extended Euclid as a visible derivation — high value, small addition

**Book:** §6.3.2, reused in RSA, ElGamal/DSA and finite-field curve arithmetic.  
**Suggested host:** `crypto-lab-rsa-educational`, not the already commissioned
`crypto-lab-rsa-forge` work.

Educational RSA already implements extended Euclid, returns the modular inverse,
checks the resulting key relation, and shows a detailed square-and-multiply
trace. Add only the missing quotient/remainder and Bézout-coefficient derivation,
including a non-coprime example where no inverse exists.

**Original activity:** Predict whether an inverse exists before running the
trace; check the Bézout identity at each step; change the input to share a factor
with the modulus and explain why the final gcd prevents inversion. This fills a
foundational arithmetic gap without reissuing primality, factoring or fast
exponentiation lessons.

### 3. Finite-field DSA comparison — medium to high value, exact lesson absent

**Book:** §10.4, compared with ElGamal signatures (§10.3) and ECDSA (§10.5).  
**Suggested host:** A small historical comparison in `crypto-lab-ecdsa-forge`,
or a tightly scoped signature-family lesson.

The new value is DSA's specific order-q subgroup construction, reduction to its
signature components, and verification relation. ElGamal signing already exists;
ECDSA and ML-DSA are different algorithms. Another generic repeated-nonce demo
alone would add little because that lesson already exists.

**Original activity:** Predict which modulus applies at each step, sign and verify
a small teaching message, then deliberately confuse the field modulus with the
subgroup order and explain the failure. Compare the resulting relation with the
existing ElGamal and ECDSA displays.

Label it historical: [NIST's FIPS 186-5 announcement](https://csrc.nist.gov/News/2023/nist-releases-fips-186-5-and-sp-800-186)
states that DSA is retained only for verification of existing signatures. This
recommendation is about understanding the book, not adopting DSA for new systems.

### 4. PRESENT as an exact lightweight SPN — medium value, exact cipher absent

**Book:** §3.7.3.  
**Existing bridges:** Serpent and the deliberately small differential/linear SPNs.  
**New scope:** Actual PRESENT state, 4-bit S-box layer, bit permutation and key
update, with clear historical/lightweight-design context.

This gives readers a compact exact SPN to compare with DES and AES. Neither a toy
SPN nor an AES finalist establishes PRESENT coverage. Keep it separate from the
commissioned Feistel/Luby–Rackoff lesson.

**Original activity:** Predict where one selected bit moves through the specified
permutation, inspect the next S-box inputs, and explain how repeated rounds spread
the change. Check the implementation against a published PRESENT vector; avoid
treating a few avalanche observations as a security argument.

### 5. Salsa20 versus ChaCha20 — optional, narrow comparison

**Book:** §2.4.1 compared with §2.4.2.  
**Suggested host:** `crypto-lab-chacha20-stream`.

ChaCha20 Stream already teaches ARX, quarter rounds and keystream reuse. A useful
addition would implement the actual Salsa20 transformation and show the precise
state/round-scheduling differences. A comparison paragraph or another reuse demo
would not fill the exact construction gap. The observation is about a catalogued
Salsa20 stream-cipher lesson; it does not deny Salsa20/8 components elsewhere,
such as inside scrypt.

**Original activity:** Predict which state words a chosen input difference reaches
after each round schedule, compare actual Salsa20 and ChaCha20 outputs under
specified inputs, and explain the scheduling difference without ranking security
from one visual sample. Trivium is already commissioned and is not a new request.

## Lower-priority residual boundaries

These complete the gap picture below the five recommendations. They are
**observations, not additional work assignments**. “Not established” means the
catalog and inspected teaching surfaces do not establish the exact lesson; it
does not mean no code exists anywhere in the fleet.

| Rank | Topic | What remains and why it is below the shortlist |
|---|---|---|
| 6 | Symmetric Needham–Schroeder, §14.3.2 | Kerberos gives a strong KDC/ticket bridge, but its named Lowe scenario is public-key Needham–Schroeder. An exact symmetric replay/freshness lesson is not established. AKE, TLS and protocol-composition work already occupies the broader teaching space. |
| 7 | CFB, §5.1.4 | An explicit CFB feedback/register lesson is not established. Existing modes explain much of the surrounding design space. Do not expand the already commissioned AES Modes/OFB task through this report. |
| 8 | GMAC, §13.3.5 | A dedicated authentication-only GCM lesson is not established. Existing GCM may already compute the empty-plaintext/AAD case, so “GMAC computation is absent” would be too strong. Bare GHASH is not the complete tag construction. |
| 9 | Affine cipher, §1.4.4 | The exact invertibility/key-space lesson is not established, although classical-cipher labs already motivate search, frequency analysis and modular operations. |
| 10 | DESX / exact triple encryption, §§3.7.2 and 5.3 | DES and double-DES meet-in-the-middle are already implemented. Executable whitening and a complete 3DES sequence are not established; these have lower incremental value than AES-core teaching and must not become another Feistel extension request. |

Fine-grained SHA-256 compression rounds and individual Keccak permutation steps
also remain outside the selected learner surfaces. They are explicit reading
boundaries in the path, not a reason to recommend another generic hash or sponge
lab. General proofs, exhaustive chapter exercises, deployment engineering and
hardware/timing assurance are outside this companion's contract throughout.

## Prior-batch exclusion ledger

The review matched **13 Katz–Lindell extension briefs, 10 Boneh–Shoup extension
briefs, four Katz–Lindell new-lab briefs, and five Boneh–Shoup new-lab briefs**:
32 briefs across 29 unique repositories. Repeated repositories have distinct
commissioned scopes. This records the supplied assignment inventory, not a claim
that every brief has shipped. Earlier consideration of generic AND/OR proof
composition is also not revived; existing threshold/credential work covers that
direction.

Provenance: the supplied `extension-crypto-lab-*.md` and
`brief-crypto-lab-*.md` documents, including the distinct second RSA Forge
extension brief, plus `EXTENSION-KICKOFF.md`. Their relevant scope and boundary
sections were read for this review. Private document identifiers and full brief
contents are not republished.

### Katz–Lindell extensions — 13

| Repository | Already commissioned scope; excluded here |
|---|---|
| `crypto-lab-aes-modes` | OFB feedback, precomputation/random-access cost, IV reuse and malleability; comparison with CTR. |
| `crypto-lab-bcrypt-forge` | Correct the full-table/rainbow-table distinction and the salt lesson. |
| `crypto-lab-elgamal-plain` | Quadratic-character leakage, full-group versus subgroup encoding, Euler-criterion distinguisher and repair. |
| `crypto-lab-factor-forge` | Shared-prime corpora, collision effects, product/remainder-tree batch GCD. |
| `crypto-lab-feistel-forge` | Luby–Rackoff, one- through four-round distinguishers, PRP/strong-PRP and round-function independence. |
| `crypto-lab-hash-zoo` | AES Davies–Meyer, feedforward, fixed points/freestart behavior and length strengthening. |
| `crypto-lab-lfsr-forge` | Real Trivium, warm-up/state, Berlekamp–Massey forecasting and broken initialization. |
| `crypto-lab-mac-race` | Raw CBC-MAC fixed-length assumption, splice forgery and length/CMAC repairs. |
| `crypto-lab-otp-vault` | Exhaustive perfect-secrecy probabilities, shortened key spaces and Shannon's bound. |
| `crypto-lab-protocol-compose` | Sign/encrypt stripping, re-signing/forwarding and sender/recipient binding. |
| `crypto-lab-rsa-forge` | CRT faults, shared/common modulus and parity-oracle work. |
| `crypto-lab-threshold-decrypt` | Encrypted voting, overvotes and disjunctive Chaum–Pedersen 0/1 ballot proofs. |
| `crypto-lab-wep-crack` | RC4 second-byte bias. |

### Boneh–Shoup extensions — 10

| Repository | Already commissioned scope; excluded here |
|---|---|
| `crypto-lab-ssh-handshake` | CBC packet-length oracle, non-atomic decryption and Terrapin/transcript distinctions. |
| `crypto-lab-tls-handshake` | Resumption PSKs/tickets/binders, PSK-only versus DHE, forward secrecy and 0-RTT replay. |
| `crypto-lab-ot-gate` | IKNP matrix roles/scaling and a malicious-receiver boundary. |
| `crypto-lab-key-exchange` | Merkle puzzles, work separation, independence and reusable shared-prefix tables. |
| `crypto-lab-rsa-small-roots` | Wiener; Boneh–Durfee remains outside that brief. |
| `crypto-lab-rsa-forge` | Bleichenbacher 2006 lax signature parsing, distinct from the 1998 encryption oracle. |
| `crypto-lab-zk-proof-lab` | Okamoto/GQ relations, special soundness and extraction. |
| `crypto-lab-frost-threshold` | Accountable BLS threshold signatures, signer-set binding, framing and blame. |
| `crypto-lab-hash-hunt` | Joux multicollisions and concatenated hashes. |
| `crypto-lab-log-forge` | Static-DH oracle and Brown–Gallant/Cheon-style work. |

### New-lab batches — nine briefs

| Batch | Repository | Already commissioned scope; excluded here |
|---|---|---|
| Katz–Lindell | `crypto-lab-prime-witness` | Prime generation and primality witnesses. |
| Katz–Lindell | `crypto-lab-residue-gate` | Rabin and Goldwasser–Micali. |
| Katz–Lindell | `crypto-lab-log-forge` | Discrete-log algorithms and group structure. |
| Katz–Lindell | `crypto-lab-hash-hunt` | Generic/reduced-output hash attacks and precomputation. |
| Boneh–Shoup | `crypto-lab-dvd-scramble` | DVD/CSS-oriented cryptanalysis. |
| Boneh–Shoup | `crypto-lab-next-number` | LCG/Java Random prediction and lattice/ChaCha comparisons. |
| Boneh–Shoup | `crypto-lab-tesla-broadcast` | Delayed-disclosure broadcast authentication. |
| Boneh–Shoup | `crypto-lab-ake-ladder` | Authentication, identity binding, forward secrecy, key exposure and deniability. |
| Boneh–Shoup | `crypto-lab-twist-trap` | Invalid-curve/twist and validation lessons. |

## Capability checks that changed the conclusions

These checks prevent plausible but incorrect “new gap” recommendations. Lab
READMEs are documentation of implemented teaching scope, not external security
certifications. The chapter map links all selected repositories.

| Evidence | Consequence |
|---|---|
| [AEGIS Gate AES-round visualizer, `96c9e52`](https://github.com/systemslibrarian/crypto-lab-aegis-gate/blob/96c9e52024915148f967a8d0c9b57feaa6eb4d9b/src/aes-round-vis.ts) | Real SubBytes, ShiftRows, MixColumns and XOR are already visible. Its AEGIS state-block XOR is not a complete AES key-expansion lesson. |
| [Glass Box README, `5c9781f`](https://github.com/systemslibrarian/crypto-lab-glass-box/blob/5c9781fb7a98dfae9422e74b604936180b585cad/README.md) | Full AES-128 and field-derived S-box work exist in a white-box/attack context; the missing item is an introductory route. |
| [Educational RSA arithmetic, `bc479ab`](https://github.com/systemslibrarian/crypto-lab-rsa-educational/blob/bc479abe82b5232b8187c9032e0fb8046e0e8f5b/src/rsa/bigint-math.ts), [key generation](https://github.com/systemslibrarian/crypto-lab-rsa-educational/blob/bc479abe82b5232b8187c9032e0fb8046e0e8f5b/src/rsa/keygen.ts), [trace renderer](https://github.com/systemslibrarian/crypto-lab-rsa-educational/blob/bc479abe82b5232b8187c9032e0fb8046e0e8f5b/src/ui/step-trace.ts) | Extended Euclid already runs internally; modular exponentiation already has a visible per-bit trace. Only the inverse derivation is proposed. |
| [ElGamal Plain signatures, `251bf90`](https://github.com/systemslibrarian/crypto-lab-elgamal-plain/blob/251bf90ef747f256d0e18f0fe987eadafa3f06da/src/signatures.ts) | Full-group ElGamal signing, verification and reused-nonce recovery already exist. Do not recommend ElGamal signatures as missing. |
| [KMAC Gate README, `ee6a551`](https://github.com/systemslibrarian/crypto-lab-kmac-gate/blob/ee6a55147e8717f0e7f6d53ddfcae3523a3ec424/README.md) | SHA3-256 and SHAKE use real Keccak-f[1600]; padding, rate/capacity, absorb and squeeze already have learner surfaces. No new generic SHA-3 lab is justified. |
| [ChaCha20 Stream README, `e2c3aad`](https://github.com/systemslibrarian/crypto-lab-chacha20-stream/blob/e2c3aad0d0f370878c3db9eb57337e792856e228/README.md) | Salsa20 is contextual comparison, not a catalogued executable stream-cipher lesson. |
| [Agreeing in Public README](https://github.com/systemslibrarian/crypto-lab-agreeing-in-public#readme) | The exchange is real X25519, so its Chapter 8 connection is labelled modern. |
| [McEliece Gate README](https://github.com/systemslibrarian/crypto-lab-mceliece-gate#readme) | Genuine small Goppa-code/Patterson operations exist, while submitted-size displays are simulated; no full submitted KEM API is credited. |
| [LMS Ledger README](https://github.com/systemslibrarian/crypto-lab-lms-ledger#readme) | LM-OTS/Merkle operations are real, but the small HSS transcript uses a custom child-key encoding and is not interoperable RFC 8554 HSS. Its name does not establish XMSS coverage. |
| [Kerberos README](https://github.com/systemslibrarian/crypto-lab-kerberos#readme) and [PKI Chain README](https://github.com/systemslibrarian/crypto-lab-pki-chain#readme) | Separate the public-key Lowe scenario from symmetric Needham–Schroeder; describe PKI's validation subset and local revocation fixtures explicitly. |

The book appeared in May 2024. The final [FIPS 203–205 publications](https://csrc.nist.gov/news/2024/postquantum-cryptography-fips-approved)
followed in August 2024. Their draft names already existed before publication,
so the path does not say the names themselves postdate the book. Legacy Kyber,
Dilithium and SPHINCS+ labels do not by themselves establish conformance to
ML-KEM, ML-DSA and SLH-DSA; each linked lab's documented path and limits control.

## Companion design and original activities

The page follows the Boneh–Shoup structure: printed chapter title, original
learning focus, targeted reading references, a prediction before the lab links,
an experiment, an explanation prompt and a visible coverage boundary. Individual
lab connections also carry their own labels. All 15 stops and their links are
present in generated HTML without JavaScript.

It retains the shared reading-path styling, chapter jumps, search, area and
connection filters, and optional local progress. Chapter 11 and the SHA-3 focus
have different identifiers and checkmarks. Storage failure leaves the page usable;
searching or opening a deep link cannot permanently hide the target. Checkmarks
record exploration rather than mastery.

Examples of the original predict–experiment–explain work in this companion:

- **AES:** classify value changes, byte relocation and mixing before stepping one
  real round in AEGIS; identify why that view still leaves key expansion and
  inverse operations to the reading.
- **SHA-3:** predict the padded block count for 135 versus 136 ASCII bytes at a
  136-byte rate, inspect the actual suffix/padding and absorb steps, then explain
  why SHAKE output extension differs from extending a message.
- **Public-key foundations:** compare decryption with the right and wrong key,
  test a modified signed message, and connect an RSA inverse result to the
  coprimality condition without mistaking arithmetic success for identity trust.
- **Key management:** change a trust anchor and an HKDF `info` string in their
  respective labs, then explain the difference between identity validation and
  separation of derived-key uses.

The companion is independent and unaffiliated. No book text, figures, worked
examples, exercise statements or solutions are reproduced. Chapter titles and
section references identify the reading; the activity text is original and
anchored to controls in the selected labs. Readers need their own lawful access
to the book for its explanations and derivations.

## Verification and release scope

Original draft verification completed on 21 October 2026:

- `node learn/understanding-cryptography/build.mjs --check` passes.
- `node --test tests/reading-path.test.mjs tests/understanding-cryptography.test.mjs`
  passes **10 tests**: the four existing reading-path checks and six new checks.
  The new suite checks the 14+1 sequence, static activities, catalog-driven names
  and URLs, missing-lab rejection, local resources including CSS imports, filtering,
  separate progress, invalid stored data, unavailable storage and filtered deep links.
- A real Chromium smoke run passes shared-style loading, keyboard skip-link
  navigation, chapter/section search, area/connection filters, persisted progress
  and reset, deep-link recovery, 320-pixel overflow checks and no-JavaScript reading.
  Desktop and mobile screenshots were inspected; there were no page errors or
  missing resource responses in that run.
- The existing CI integrity command includes the new test file. CI runs on pull
  requests and main updates under the repository's existing triggers. The local
  results above record the draft review; they do not verify a release workflow
  or live deployment.

These checks validate the companion's content structure and interactions. They
are not a new audit or exhaustive execution of the 37 linked labs. The original
local draft review did not rerun the full protocol-workshop browser suite.

The release includes the new path, this report, `learn/README.md`, its focused
test and the CI test invocation, plus menu registration and the associated
generated navigation records. The menu entry points to
`/learn/understanding-cryptography/` and sets `home: false`; it adds no homepage
card or catalog exhibit. The chapter map, ranked recommendations and prior-batch
exclusions retain the original review's scope, and no lab implementation is
changed.

### Publication preparation

The companion was first prepared on the draft branch identified above. The
publication version removes learner-facing draft labels, points report/catalog/
source links at `main`, and adds the menu link and `home: false` path record.
The README learning-path table and knowledge-map catalog were regenerated after
the final hub edit. Their freshness checks pass; catalog and catalog-structure
checks also pass without adding an exhibit or changing any lab capability claim.

`node --test tests/reading-path.test.mjs tests/understanding-cryptography.test.mjs tests/knowledge-map-sync.test.cjs`
passes **18 tests** for the publication candidate. The permanent browser suite
also includes this companion's menu discovery, separate chapter/focus progress,
publication links and no-JavaScript reading, and includes it in the existing
keyboard/responsive checks.

The focused Understanding Cryptography browser regression passes (one test),
including actual menu navigation and an Axe WCAG 2 A/AA and 2.1 A/AA scan with
zero violations. The separate Chromium guide smoke also passes its keyboard,
filtering, persistence, deep-link, 320-pixel and no-JavaScript checks, with no page
errors or missing resource responses.

Publication follows the repository's existing Pages build from `main`. The
[Actions history](https://github.com/systemslibrarian/crypto-lab/actions) records
the deployment and checks for each commit; the
[public companion](https://crypto-lab.systemslibrarian.dev/learn/understanding-cryptography/)
is the served page. The local checks above describe candidate validation and do
not substitute for verifying the deployment and served content.
