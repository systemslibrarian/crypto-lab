# Reading path and protocol workshops

## Chip transaction authentication — reviewed 23 October 2026

[`emv-chip/`](emv-chip/) is a hub-hosted interactive study of an online
card–terminal–issuer exchange. It creates a browser-local synthetic HMAC key,
generates a fresh terminal challenge and monotonic card counter, and binds an
invented amount and terminal ID into an authenticator. The learner can approve
the original packet, alter the amount, replay it after acceptance, or compare a
different checkout challenge. No card number or real payment data is used.

This is deliberately **not** an EMV application cryptogram, chip command,
issuer policy, offline card authentication, cardholder verification, or
certified implementation. The [EMVCo Contact Chip overview](https://www.emvco.com/emv-technologies/emv-contact-chip/)
explains the card–terminal exchange and transaction-unique cryptograms; its
[May 2025 security quick reference](https://www.emvco.com/wp-content/uploads/2025/05/EMVCo_Cybersecurity_QRG_MAY25_FINAL-TAGGED.pdf)
distinguishes the online issuer check from offline public-key authentication.
The source-backed section is indexed in `CATALOG.md` through
`tools/catalog-native.json`, outside the count of separate lab repositories.

Run `node --test learn/emv-chip/model.test.mjs` for fresh, changed-field,
wrong-challenge, wrong-card and replay decisions.

These pages live in the hub and deploy with its existing GitHub Pages site. They
do not require new repositories or add standalone cards to the catalog count.
The three primary book companions are Understanding Cryptography,
Introduction to Modern Cryptography and Boneh–Shoup. They use the main book-menu links and
their direct URLs. Bruce Schneier's 1996 *Applied Cryptography* companion is
retained in the lower **Historical reading** menu group and documented after the
primary companions below.

All four `LEARNING_PATHS` entries set `home: false`, which omits their cards from
the homepage Learning paths band while preserving menu steps and generated
records. Applied Cryptography also sets `historical: true`; the generated hub
README places it in a separate Historical reading section. Its URL, chapter
identifiers, progress data and linked protocol workshops are preserved.

## AES and arithmetic connections — reviewed 21 October 2026

The two new labs now have original activities in the book companions, alongside
their links in the hub's curated path summaries:

| Companion | AES Anatomy | Clock Arithmetic |
|---|---|---|
| Understanding Cryptography, 2024 | Chapter 4: primary AES route, now a direct connection | Chapters 1, 6, 7 and 8: modular arithmetic, Euclid/Euler, CRT and finite-field groups |
| Katz–Lindell, 2025 revised third edition | §7.2.5, alongside SPNs and Feistel networks | §§9.1.2–9.1.5 and 9.3.1–9.3.3, with Appendix B arithmetic algorithms |
| Boneh–Shoup, version 0.6 | Chapter 4: full cipher and deliberately weakened variants | Chapter 10: arithmetic preparation for RSA and DH |
| Applied Cryptography, 1996 historical companion | No new AES placement | Chapter 11: Euclid, modular arithmetic and CRT |

The activities were checked against [AES Anatomy at `7abf61f`](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/tree/7abf61f7fdcef076c5f536c81ec0e1b729b05118)
and [Clock Arithmetic at `5bb8684`](https://github.com/systemslibrarian/crypto-lab-clock-arithmetic/tree/5bb86840fab4806e3681c1a378fd4c643831035d),
including the displayed key-expansion/inverse traces, affine-only fixture,
Euclid rows, subgroup examples and generalized CRT input contract. Katz–Lindell's
section pointers were rechecked against the supplied 2025 revised third edition.

AES Anatomy implements AES-128/192/256; the four layer-removal attacks run on
weakened AES-128 variants with full-AES controls. Clock Arithmetic teaches exact,
bounded integer calculations; its tiny shared-secret search is not a discrete-log
solver. These additions fill the named AES-internals and Euclid teaching gaps,
without claiming complete chapter coverage, security proofs or hardened crypto.
Existing chapter IDs, edition boundaries and saved-progress keys are preserved.

## Introduction to Modern Cryptography reading path

`modern-cryptography/chapters.mjs` supplies 15 original chapter activities for
Jonathan Katz and Yehuda Lindell’s 2025 revised third edition. Chapters 1–2 form
the foundations, 3–8 symmetric cryptography, and 9–15 public-key cryptography.
The generated page has static links, chapter/area/coverage filtering, separate
per-lab connection labels and explicit coverage limits. Each chapter uses the
book’s printed title, an original learning focus, targeted section pointers,
and an original predict–try–explain activity. Predictions appear before the lab
links so readers encounter the question before leaving for an experiment.
Visible labels say **Direct connection**, **Modern counterpart** and
**Introductory bridge**; the filter retains the `direct`/`modern`/`intro` values.
Its independent progress key is `crypto-lab-modern-cryptography-progress-v1`.

```sh
node learn/modern-cryptography/build.mjs
node learn/modern-cryptography/build.mjs --check
```

### Sources and edition boundary — reviewed 21 October 2026

- Reference edition: Jonathan Katz and Yehuda Lindell, *Introduction to Modern
  Cryptography*, revised third edition, CRC Press, 2025. ISBN 9781032496795
  (hardback), 9781003398134 (ebook); DOI [10.1201/9781003398134](https://doi.org/10.1201/9781003398134).
  All 15 chapter titles and listed section references were checked against the
  supplied revised edition’s contents, with §6.1.2 and Chapter 14’s introduction and
  references checked in the text. Figure 10.1 also remains the key-length figure.
  References use the book’s section numbers, not the converted PDF’s viewer page
  numbers. The textbook is not stored in this repository.
- [Katz’s official book page](https://www.cs.umd.edu/~jkatz/imc.html) identifies
  the authors, third edition, intended scope, contents and errata.
- [Author-hosted contents and preface](https://www.cs.umd.edu/~jkatz/imc/toc-preface-3rd.pdf)
  documents the original 2021 third edition and is retained for comparison.
- [Revised third edition publisher listing](https://www.routledge.com/Introduction-to-Modern-Cryptography-Revised-Third-Edition/Katz-Lindell/p/book/9781032496795)
  identifies the edition used here. Chapter 14 is now headed “Quantum-Secure
  Cryptography”; its original 2021 title, “Post-Quantum Cryptography,” remains
  visible and searchable as an edition cross-reference. The numbered section
  pointers used by the existing activities retain their numbering in the revision.
  The chapter 6 pointer now also includes §6.6.4 for KDF Chain.
- [Author errata](https://www.cs.umd.edu/~jkatz/imc/errata-3rd.pdf) remains linked
  as a resource for the original third edition. Revised-edition §6.1.2 itself
  includes the sufficient-compression condition for the implication from
  second-preimage resistance to preimage resistance, so chapter 6’s boundary
  points directly to that section.

The page links official book resources and contains original activity prompts.
It does not redistribute the textbook or copy its exercises. It is independent
and unaffiliated with the authors and publisher.

### Why these connections, and what remains outside them

Exact exhibit names and live URLs come from `knowledge-map/catalog.json`.
The capability review also inspected the source repositories’ READMEs for
[Hidden Bit](https://github.com/systemslibrarian/crypto-lab-hidden-bit),
[OTP Vault](https://github.com/systemslibrarian/crypto-lab-otp-vault),
[Protocol Compose](https://github.com/systemslibrarian/crypto-lab-protocol-compose),
[Feistel Forge](https://github.com/systemslibrarian/crypto-lab-feistel-forge),
[Factor Forge](https://github.com/systemslibrarian/crypto-lab-factor-forge),
[ElGamal Plain](https://github.com/systemslibrarian/crypto-lab-elgamal-plain),
[Frodo Vault](https://github.com/systemslibrarian/crypto-lab-frodo-vault),
[LMS Ledger](https://github.com/systemslibrarian/crypto-lab-lms-ledger),
[Schnorr Forge](https://github.com/systemslibrarian/crypto-lab-schnorr-forge),
[Paillier Gate](https://github.com/systemslibrarian/crypto-lab-paillier-gate),
[VSS Gate](https://github.com/systemslibrarian/crypto-lab-vss-gate), and
[Threshold Decrypt](https://github.com/systemslibrarian/crypto-lab-threshold-decrypt).
These are educational capability checks, not new security audits of those labs.

- Hidden Bit implements security experiments and an ElGamal security reduction to DDH.
  Its finite trials cannot establish security against every efficient adversary.
- Chapter 8 remains introductory: the OWF/hard-core/PRG/GGM/strong-PRP chain
  and proofs are not implemented by these connections. Its switching-game
  background is explicitly cross-referenced to §3.5.1 and Appendix A.4; the
  ElGamal reduction is a later example from §12.4.1.
- Chapter 6 now connects to Hash Hunt for generic searches, meaningful-message
  collisions, hash-then-MAC composition, Hellman precomputation and salts. The
  SHA-256 output is deliberately shortened; rainbow chains are a later extension.
- Chapter 9 now connects to Prime Witness for generation, primality witnesses,
  lying bases and fixed-base limits. Its FIPS-shape panel is a separate later
  connection, not a claim of standards-conformant key generation.
- Chapter 10 now has Log Forge for generic exponent recovery, prime-power
  Pohlig–Hellman and safe-prime index calculus, alongside the existing factoring
  links. Factor Forge’s rho factors integers; Log Forge’s rho recovers exponents.
  Partial congruences, runtime caps and production-size cost formulas remain
  explicitly distinct from verified recovery at teaching sizes.
- Chapter 14 now acknowledges the revision’s discussion of the 2024 standards
  corresponding to Kyber, Dilithium and SPHINCS+ (FIPS 203–205). ML-KEM and
  ML-DSA are still practical counterparts to the chapter’s simplified teaching
  constructions, not exact textbook implementations. LMS Ledger is a teaching
  adaptation, not interoperable HSS.
- Chapter 15 now includes Residue Gate’s Goldwasser–Micali and restricted Rabin
  experiments beside Paillier, sharing and threshold concepts. The canonical
  root-oracle reduction, redundancy rule and one-bit Rabin construction have
  different contracts; none establishes CCA security. Generic trapdoor-permutation
  proofs remain reading-led.
  Feldman VSS connects directly to §15.3.2; Pedersen commitments and proof-checked
  partial decryptions extend the chapter’s presentation.
  VSS Gate deliberately makes the second-generator relation knowable, defeating
  Pedersen binding. Threshold parties run in one browser, not a distributed system.
- General ZK and MPC are further study, not invented numbered book chapters.

The wording review checked these specific source behaviors:

| Activity | Inspected source | Consequence for the guide |
|---|---|---|
| ECDSA forgery goals | [Hidden Bit `ecdsa-high-s.ts`, `734bd6e`](https://github.com/systemslibrarian/crypto-lab-hidden-bit/blob/734bd6ee73294f8fd8d6cded7f4f5170ccd1f4dd/src/adversaries/ecdsa-high-s.ts) | The operation changes `s` to `n − s`: two distinct valid signatures, not alternate encodings of one signature. |
| Merkle tampering | [Merkle Vault `main.ts`, `60c4a0f`](https://github.com/systemslibrarian/crypto-lab-merkle-vault/blob/60c4a0f7a952f75a119fc6243d8970b6ddecbf18/src/main.ts) | Tamper Leaf retains the original proof and checks it against the changed tree’s root; the activity follows that actual control. |
| Share verification | [VSS Gate `vss.ts`, `cda8c3a`](https://github.com/systemslibrarian/crypto-lab-vss-gate/blob/cda8c3aea86774e1bf9edddfb429bf9eba579509/src/vss.ts) | Both Feldman and Pedersen share checks are implemented; the connection distinguishes them. |
| Threshold recovery | [Threshold Decrypt `main.ts`, `842f77d`](https://github.com/systemslibrarian/crypto-lab-threshold-decrypt/blob/842f77ddd5ea11496b0e35599dd43075d2905c7a/src/main.ts) and [`elgamal.ts`](https://github.com/systemslibrarian/crypto-lab-threshold-decrypt/blob/842f77ddd5ea11496b0e35599dd43075d2905c7a/src/elgamal.ts) | Chaum–Pedersen checks run before combination and reject a selected invalid partial. |

The four new lab connections were reviewed against their source, completed gates
and served assets on 20 October 2026. The original briefs identify the Katz–Lindell
section gaps; the activities follow the implemented controls and limits.

| Lab | Modern Cryptography connection | Historical Applied Cryptography (1996) connection |
|---|---|---|
| Prime Witness | §9.2.1–9.2.2: candidate generation and primality evidence | Chapter 11: prime generation |
| Hash Hunt | §6.3.1, §6.4.1–6.4.3, §6.6.3, Appendix A.4: composition, generic attacks and salts | Chapters 7 and 18: birthday costs, hash functions and authentication |
| Log Forge | §10.2–10.4: generic algorithms, smooth order, index calculus and key lengths | Chapters 7 and 11: public-key strength and finite-field discrete logs |
| Residue Gate | §15.4–15.5: Goldwasser–Micali, Rabin and the root-oracle reduction | Chapters 19 and 23: Rabin and probabilistic encryption |

Placements in the historical Applied Cryptography companion were checked against
the author’s expanded
[second-edition contents](https://www.schneier.com/books/applied-cryptography-toc/).
Its chapter 19 Pohlig–Hellman encryption scheme is not Log Forge’s discrete-log
solver. Later SHA-256, rainbow-chain, FIPS and current key-length examples are
identified as extensions, not implementations of every construction in the book.

Inspected implementation pins:
- [Prime Witness `c85f91a`](https://github.com/systemslibrarian/crypto-lab-prime-witness/tree/c85f91a26720f4f2d63b8b4471720cfcce49bb25)
- [Hash Hunt `3c76645`](https://github.com/systemslibrarian/crypto-lab-hash-hunt/tree/3c766455e051b48adb6af5356cb81257770f4ab4)
- [Log Forge `2b5ade3`](https://github.com/systemslibrarian/crypto-lab-log-forge/tree/2b5ade3940e3ae2879823c40cbc0587be6655aef)
- [Residue Gate `d1f1c55`](https://github.com/systemslibrarian/crypto-lab-residue-gate/tree/d1f1c553da40f36f1f02b57800262271278f441a)

To update a mapping, verify the relevant lab’s current capability before editing
the activity or coverage claim; a matching algorithm keyword is insufficient.

## Timestamping

`timestamping/core.mjs` uses SHA-256 and WebCrypto P-256 ECDSA. A fixed-order,
domain-separated encoding binds the digest, request nonce, serial and claimed
time. Verification independently checks the signature, document hash and nonce.
The local authority can genuinely sign a false time: signature validity cannot
make the clock trustworthy. A linked-log exercise separately compares internal
consistency with a checkpoint pinned before the rewrite.

The bounded archive lesson groups two, four or eight text documents under a
position-aware, domain-separated SHA-256 Merkle root. One real ECDSA timestamp
signs that root; a separate reduced path verifies every document. Wrong-path and
wrong-root controls keep inclusion, signed-root equality, response nonce and
signature validity as separate checks. The four-document learner run exposes all
four current proofs, and the unit oracle independently rebuilds the root from the
document strings.

The renewal lesson follows the timestamp-renewal shape in RFC 4998 §§1.2 and 5.
An overlapping successor key hashes and timestamps the complete prior token,
including its old signature, before a declared old-key trust cutoff. At a later
evaluation time, an unrenewed record and a cryptographically valid but late
renewal are refused. The late control actually uses the compromised old private
key to sign a changed Merkle root while claiming an old generation time, then
obtains a valid successor stamp after the cutoff. Its verifier-visible checks
match the late genuine record; only retained teaching ground truth identifies
which was forged. This is why a late stamp cannot retroactively create the
missing trustworthy ordering.

This is neither RFC 3161 ASN.1/CMS nor an independently trusted timestamp service.
It is also not an RFC 4998 ASN.1 EvidenceRecord: the tree and token use a stated
JSON teaching encoding. Clock trust, key/certificate epochs, algorithm-suitability
policy, key custody and external publication are simulated inputs. No X.509
validation, network TSA, blockchain, durable log or authorship proof is provided.
The executed renewal is appropriate to the declared signing-key cutoff while
SHA-256 remains trusted. If the tree hash becomes unsuitable, RFC 4998 requires
hash-tree renewal over the archived objects and older evidence; that procedure is
not implemented. RFC 4998's reported erratum 7411 concerns sorting in that
unimplemented hash-tree-renewal procedure.

Sources: [RFC 3161](https://www.rfc-editor.org/rfc/rfc3161.html), especially §§1–2.4;
[RFC 4998](https://www.rfc-editor.org/rfc/rfc4998.html), especially §§1.2 and 4–5;
[RFC 9169](https://www.rfc-editor.org/rfc/rfc9169.html), which supplies newer-
convention ASN.1 modules without changing this lesson into an interoperable implementation;
and [Haber and Stornetta, 1991](https://doi.org/10.1007/BF00196791). The simple hash
chain illustrates the linking/anchoring distinction, not the complete paper's
protocol.

## Fair exchange

`fair-exchange/core.mjs` binds both fictional items to one random session, scenario,
party and subject. Real ECDSA verifies the signed packet; actual AES-GCM decryption
and hash comparison check its content. Direct delivery exposes the first sender
to a party who stops. An ideal always-involved intermediary validates deposits,
then makes a single terminal abort/release decision. Both items are checked before
either retrieval right is committed. Concurrent actions are rejected.

`fair-exchange/optimistic.mjs` separately executes a bounded adaptation of
Asokan–Shoup–Waidner Protocol E from the expanded 18 October 1999 report. Bob's
Schnorr signature is reduced to a public promise and a private inverse. Alice
places her actual signature in condition-bound RSA-OAEP escrow; Bob proves, with
the report's interactive Protocol D cut-and-choose structure, that his escrow can
recover the inverse matching his promise. The honest E1–E6 path exchanges Alice's
signature and Bob's inverse directly and contacts the trusted intermediary zero
times. The executable fallback implements the paper's distinct `ABORT`, `DEPOSIT`
and `NO-ABORT` records, both serialized abort/B-resolve race orders, A-resolve,
temporary intermediary unavailability and a counterfactual state-loss control.
Following Protocol E's exact order, A-resolve durably writes `NO-ABORT` before
checking either escrow; a later error does not roll that record back. The report's
atomic-request assumption prevents interleaving rather than promising rollback.

The Schnorr teaching instantiation uses the RFC 7919 ffdhe2048 group and SHA-256.
The escrow key is 3072-bit RSA-OAEP with SHA-256 and exponent 65537; OAEP's
actual label binds the ciphertext to Protocol E's condition. Protocol D uses
deterministic RFC 8017 OAEP
encoding only where the prover must recompute a ciphertext from its revealed
randomness. Domain-separated SHA-256 expansion with rejection sampling instantiates
Protocol D's H1, and a distinct SHA-256 domain instantiates H2. Every pair is fixed
under the aggregate H2 commitment before the verifier samples its challenge. The
ordinary and verifiable escrows share the same TTP key under the
expanded report's specific Remark 20 allowance for its suggested implementation;
this is not generalized into a claim that arbitrary escrow schemes may share keys.
Sixteen nonzero-challenge rounds keep a current run inspectable. For a
transcript compatible with exactly one nonzero challenge vector, that vector is
selected with probability 1/65,535. The paper's example uses 40 interactive
rounds, a 1024-bit prime with a 160-bit subgroup, a 160-bit H1 input and H2
output, and 1024-bit RSA-OAEP with exponent 3; this adaptation's declared
parameters differ. The finite calculation is not a production security claim,
and the paper's random-oracle theorem does not automatically transfer to this
modernized browser adaptation.

The UI distinguishes Bob's verified, recoverable promise/Protocol D escrow from a
peer signature that Alice can independently use. Alice's `alpha` is deliberately
ordinary, non-verifiable escrow: Bob has its ciphertext, but only the TTP can
decrypt it and check that it contains Alice's valid signature. The receipt in
the earlier baseline authorizes release of a bound message; it does not prove
human reading. Neither model promises simultaneous packets. The ASW route
assumes that the intermediary is honest, eventually available, serializes
requests atomically and preserves durable transaction state. The original model
assumes a private client–TTP channel and authenticated server responses, but not
authenticated client requests. This one-process simulator executes one
transaction with session-generated request fields; it does not supply an
adversarial network/API, authenticated identities, private TTP channels,
certificates, crash-safe replicated storage, production parameter review or a
deployment proof. Every secret remains accessible to the browser-local teaching
process.

Primary sources: [Asokan, Shoup and Waidner's expanded report](https://www.shoup.net/papers/fex.pdf),
especially §§3–7 and Protocols D/E; the earlier
[EUROCRYPT extended abstract](https://link.springer.com/chapter/10.1007/BFb0054156);
[RFC 7919 Appendix A.1](https://www.rfc-editor.org/rfc/rfc7919.html#appendix-A.1)
for the declared finite group; and [RFC 8017 §7.1](https://www.rfc-editor.org/rfc/rfc8017.html#section-7.1)
for RSAES-OAEP. RFC 7919 does not standardize Schnorr or ASW.

## Verification

`tests/protocol-workshops.test.mjs` covers signature/message/nonce changes, false
signed times, anchored rewrites, an independently rebuilt Merkle root, every
inclusion path, wrong paths and roots, exact-token renewal binding, strict epoch
boundaries, expired and untrusted-time cases, and the late-genuine/backdated-forgery
ambiguity. It also covers actual decryption, wrong-session evidence, tampering,
premature release, terminal decisions and interleaving guards.
`tests/fair-exchange-optimistic.test.mjs` independently recomputes a fixed Schnorr
vector and group invariant, checks both Protocol D branches, condition and
commitment binding, actual TTP decryption, the zero-contact normal path, all three
durable records, both abort/resolve race orders, delayed and unavailable cases,
state-loss failure and request serialization. `fair-exchange/mutations.mjs` first
runs the clean baseline, then requires every named source mutation to fail its
owning test and restores the source byte for byte.
`tests/reading-path.test.mjs` checks generated chapter coverage and local links.
`tests/understanding-cryptography.test.mjs` checks the second-edition path,
its catalog-only connections, filters, progress and static reading fallback.
`tests/protocol-workshops-browser.test.cjs` exercises full UI flows, filters,
progress, the rendered batching and renewal claims, keyboard controls, axe
accessibility audits and mobile/desktop overflow. `timestamping/mutations.mjs`
first proves the unmodified suite passes, then applies nine concrete source
mutations and requires the named owning test to catch each one before restoring
the source byte for byte.
CI includes these suites; the Understanding Cryptography path also received a
focused local Chromium smoke check.

```sh
node --test tests/protocol-workshops.test.mjs tests/reading-path.test.mjs tests/understanding-cryptography.test.mjs
node learn/timestamping/mutations.mjs
node --test tests/protocol-workshops-browser.test.cjs
```

## Boneh–Shoup reading path

`boneh-shoup/chapters.mjs` supplies 23 chapter entries for Dan Boneh and Victor
Shoup's *A Graduate Course in Applied Cryptography*, version 0.6 (January 2023).
The guide lives at `/learn/boneh-shoup/`, in the hub menu and alongside the other
primary book companions. It adds no catalog exhibits and uses `home: false` like
the existing book paths.

```sh
node learn/boneh-shoup/build.mjs
node learn/boneh-shoup/build.mjs --check
node --test tests/reading-path.test.mjs
node --test --test-timeout=180000 tests/protocol-workshops-browser.test.cjs
```

The generator resolves each lab name against `knowledge-map/catalog.json`.
Static HTML preserves every lab link without JavaScript. Search, area/connection
filters, part jumps and optional local progress enhance the page. Its independent
storage key is `crypto-lab-boneh-shoup-progress-v1`.

### Source review and scope — 20 October 2026

- [Official book site](https://toc.cryptobook.us/) identifies version 0.6 as the
  latest release and dates its posting to 14 January 2023.
- [Pinned author-hosted PDF](https://crypto.stanford.edu/~dabo/cryptobook/BonehShoup_0_6.pdf)
  is the authority for chapter order, section pointers and PDF-page links.
  The current-draft alias may change; numbered links deliberately use the
  versioned file. No textbook PDF is redistributed in this repository.
- Chapters **1 and 17** appear in the contents but their bodies are absent:
  the contents go directly to the Part I divider (printed page 3), and printed
  page 711 is followed by the Part III divider (714). The guide labels those
  entries as supplementary exploration, not chapter implementation.
- Sections **20.5–20.7** are unfinished on printed page 842. Bulletproofs and
  SNARK Arena are explicit supplements. Other relevant unfinished sections
  are identified in activity boundaries; no exercises are copied.
- Chapter 14's heading follows the PDF, rather than the alternate wording in
  the website's abbreviated outline.
- Lab scope was checked against the current catalog and relevant repository
  READMEs, particularly ZK Proof Lab (tiny challenge space), LMS Ledger (custom
  HSS teaching transcript), IBE Gate (BasicIdent/CPA), OT Gate (Chou–Orlandi
  adaptation), DKG Gate (Joint-Feldman versus its modeled bias experiment),
  Threshold Decrypt (proof-checked partials), Garbled Gate (semi-honest model)
  and SPDZ Forge (trusted preprocessing dealer and local parties).

The fourth connection label, **Supplementary exploration**, marks an absent or
unfinished portion of the draft. **Modern counterpart** denotes a different
practical construction or later standard, not necessarily something invented
after the draft. Direct connections cover selected concepts only. Original
predict–try–explain activities send readers back to assumptions and proofs.

## Understanding Cryptography reading path

[`understanding-cryptography/`](understanding-cryptography/) is an independent
companion to Christof Paar, Jan Pelzl and Tim Güneysu, *Understanding Cryptography*,
second edition, Springer, 2024. It follows the Boneh–Shoup page structure:
chapter titles, original learning focuses, section references, predictions before
lab links, experiments, explanation prompts and visible coverage boundaries.
Release registration uses `/learn/understanding-cryptography/` in the hub menu.
Its `LEARNING_PATHS` entry sets `home: false`, preserving menu access and generated
records without adding a homepage card.

### Edition and sources — reviewed 21 October 2026

The [published second edition](https://link.springer.com/book/10.1007/978-3-662-69007-9)
has **14 chapters**, with **SHA-3 in §11.5 of Hash Functions**. The companion
preserves all 15 requested topics as 14 numbered chapter entries and one separately
identified SHA-3 focus. Post-Quantum Cryptography is Chapter 12, MACs is Chapter 13,
and the publisher calls Chapter 14 *Key Management*. The
[authors' website](https://www.cryptography-textbook.com/book/) calls the last
chapter *Key Establishment*; that alternate name is also searchable.

Chapter order and section pointers were rechecked against the complete supplied
**2024 second-edition PDF**, eBook ISBN **978-3-662-69007-9**, including its title,
copyright and contents pages. The publisher's
[front matter](https://link.springer.com/content/pdf/bfm:978-3-662-69007-9/1) and
[authors' contents](https://www.cryptography-textbook.com/files/toc.pdf) corroborate
the numbering. Selected text checks cover affine ciphers (§1.4.4), PRESENT
(§3.7.3), OFB/CFB (§§5.1.3–5.1.4) and GCM (§13.3.4). The
[April 2025 errata](https://www.cryptography-textbook.com/wp-content/uploads/2025/04/errata_2nd.pdf)
are linked, with the GCM tag-calculation correction highlighted in Chapter 13.
The earlier first-edition file is not the basis for this verification. No textbook
PDF, passages, figures, exercises or solutions are stored or reproduced here.
This verifies the reading map and selected connections, not every page or exercise.

### Catalog source and capability limits

Unlike the existing generators, this path reads the per-lab section of
`CATALOG.md` directly. `chapters.mjs` specifies repository slugs and original
connection notes; `build.mjs` resolves the exact catalog titles and live URLs.
Unknown slugs, duplicate connections and an incorrect chapter sequence fail the
build. The path has **48 connections to 39 distinct catalogued labs**.

Direct connection, modern counterpart and introductory bridge describe selected
relationships, never complete chapter coverage. Significant boundaries include:

- AES Anatomy now supplies the field-arithmetic, S-box, key-expansion and inverse
  route for full AES. Its ablation experiments concern deliberately weakened
  AES-128 variants; they neither break full AES nor establish side-channel safety.
- Clock Arithmetic now supplies traced Euclid/Bézout calculations, Euler
  preconditions, groups and generalized CRT. Its small examples do not establish
  production-size hardness or authenticate a public key.
- Dead Sea Cipher supplies the affine-cipher card, including admissible
  multipliers and known-letter recovery. Biham Lens supplies full PRESENT-80
  separately from its toy SPN; PRESENT-128 remains outside that lab.
- AES Modes supplies OFB and CFB-128/CFB-8. Feedback and error propagation are
  confidentiality lessons, not message-authentication checks.
- KMAC Gate already provides substantial SHA-3 and SHAKE teaching. It is not a
  missing sponge lab, although complete Keccak step-by-step teaching is outside
  the selected surface.
- ElGamal signatures already exist. Finite-field DSA is a separate exact lesson;
  ECDSA and ML-DSA do not fill it.
- McEliece Gate performs small Goppa/Patterson operations without a full submitted
  KEM API. LMS Ledger's small HSS transcript is non-interoperable. Modern ML-KEM,
  ML-DSA and SLH-DSA paths are identified separately from simplified models.
- Kerberos's Lowe lesson is public-key Needham–Schroeder, not the book's symmetric
  protocol. PKI revocation uses local fixtures.

The [chapter map and gap report](../audits/UNDERSTANDING-CRYPTOGRAPHY-GAP-CHECK-2026-10-21.md)
contains the ranked recommendations, inspected source pins and the exclusion
ledger for **32 prior briefs across 29 repositories**. Those Katz–Lindell and
Boneh–Shoup labs and extensions are not recommended again.

### Build and verify

```sh
node learn/understanding-cryptography/build.mjs
node learn/understanding-cryptography/build.mjs --check
node --test tests/reading-path.test.mjs tests/understanding-cryptography.test.mjs
```

All chapter activities and lab links are static HTML. Search, area/connection
filters, deep links and optional checkmarks enhance that reading. The independent
storage key is `crypto-lab-understanding-cryptography-2e-progress-v1`; Chapter 11 and
its SHA-3 focus have separate progress identifiers. Unavailable storage leaves
checkmarks usable for the current visit. Progress records exploration, not mastery.

The focused tests cover numbering, catalog authority, static content, imported
stylesheets, filtering, invalid saved data, storage failure and deep links. A local
Chromium check also covered keyboard navigation, persistence/reset, no-JavaScript
reading and a 320-pixel viewport. These checks concern the companion; they are
not security audits of the linked labs or claims of complete book coverage.

## Historical reading — Applied Cryptography (1996)

`applied-cryptography/chapters.mjs` contains original exercises and connections to
all 25 chapters of Bruce Schneier's *Applied Cryptography*, second edition (1996).
The companion remains at `/learn/applied-cryptography/`, with its guide link in
the hub's lower Historical reading disclosure. Its `LEARNING_PATHS` entry uses
`historical: true` and `home: false`; its knowledge-map record also identifies the
historical edition. The existing chapter identifiers and localStorage progress
key are retained, so saved exploration progress continues to work.

`build.mjs` resolves exhibit names against the generated knowledge-map catalog and
emits complete HTML, so chapter links work without JavaScript. After the final
hub navigation edit, regenerate the hub README, then the catalog, then the guide:

```sh
node tools/readme-sync.js
node tools/knowledge-map-sync.js
node learn/applied-cryptography/build.mjs
node learn/applied-cryptography/build.mjs --check
```

Coverage labels describe selected connections, never complete chapter coverage.
The path is independent, unaffiliated, and does not reproduce book passages.
Checkmarks are optional localStorage data and measure exploration, not mastery.
Its linked timestamping and fair-exchange workshops remain at
`/learn/timestamping/` and `/learn/fair-exchange/`, with their teaching content and
chapter links preserved.
