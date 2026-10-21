# Reading path and protocol workshops

These pages live in the hub and deploy with its existing GitHub Pages site. They
do not require new repositories or add standalone cards to the catalog count.
The book companions use the hub menu and their direct URLs. Their
`LEARNING_PATHS` entries set `home: false`, which omits their cards from the
homepage Learning paths band while preserving menu steps and generated records.

## Applied Cryptography reading path

`applied-cryptography/chapters.mjs` contains original exercises and connections to
all 25 chapters of Bruce Schneier's *Applied Cryptography*, second edition.
`build.mjs` resolves exhibit names against the generated knowledge-map catalog and
emits complete HTML, so chapter links work without JavaScript. Run:

```sh
node tools/knowledge-map-sync.js
node learn/applied-cryptography/build.mjs
node learn/applied-cryptography/build.mjs --check
```

Coverage labels describe selected connections, never complete chapter coverage.
The path is independent, unaffiliated, and does not reproduce book passages.
Checkmarks are optional localStorage data and measure exploration, not mastery.

## Introduction to Modern Cryptography reading path

`modern-cryptography/chapters.mjs` supplies 15 original chapter activities for
Jonathan Katz and Yehuda Lindell’s third-edition structure. Chapters 1–2 form
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

### Sources and edition boundary — reviewed 20 October 2026

- Reference edition: Jonathan Katz and Yehuda Lindell, *Introduction to Modern
  Cryptography*, third edition, CRC Press, 2021. Chapter titles and targeted
  activity references were checked against a supplied copy’s contents and
  relevant interior sections. The textbook is not stored in this repository.
- [Katz’s official book page](https://www.cs.umd.edu/~jkatz/imc.html) identifies
  the authors, third edition, intended scope, contents and errata.
- [Author-hosted contents and preface](https://www.cs.umd.edu/~jkatz/imc/toc-preface-3rd.pdf)
  establishes the 15-chapter sequence, three parts and section pointers used here.
- [Revised third edition publisher listing](https://www.routledge.com/Introduction-to-Modern-Cryptography-Revised-Third-Edition/Katz-Lindell/p/book/9781032496795)
  and its [indexed alternate URL](https://www.routledge.com/Introduction-to-Modern-Cryptography-Third-Edition/Katz-Lindell/p/book/9781032496795)
  identify the 2025 revision and the same chapter outline. The author’s contents
  call chapter 14 “Post-Quantum Cryptography”; the publisher’s listing uses
  “Quantum-Secure Cryptography.” That alternate title is also shown on chapter
  14’s card and is searchable. The revised chapter outline was cross-checked;
  revised-edition section and page numbering were not verified. The precise
  section pointers on this page follow the 2021 edition.
- [Author errata](https://www.cs.umd.edu/~jkatz/imc/errata-3rd.pdf), dated 23 July
  2024, includes the qualification on second-preimage versus preimage resistance
  reflected in chapter 6’s boundary.

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
- Chapter 14 separates quantum simulations and the text’s themes from later
  standardized ML-KEM/ML-DSA examples. LMS Ledger is a teaching adaptation,
  not interoperable HSS.
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

| Lab | Modern Cryptography connection | Applied Cryptography connection |
|---|---|---|
| Prime Witness | §9.2.1–9.2.2: candidate generation and primality evidence | Chapter 11: prime generation |
| Hash Hunt | §6.3.1, §6.4.1–6.4.3, §6.6.3, Appendix A.4: composition, generic attacks and salts | Chapters 7 and 18: birthday costs, hash functions and authentication |
| Log Forge | §10.2–10.4: generic algorithms, smooth order, index calculus and key lengths | Chapters 7 and 11: public-key strength and finite-field discrete logs |
| Residue Gate | §15.4–15.5: Goldwasser–Micali, Rabin and the root-oracle reduction | Chapters 19 and 23: Rabin and probabilistic encryption |

Applied Cryptography placements were checked against the author’s expanded
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

This is neither RFC 3161 ASN.1/CMS nor an independently trusted timestamp service.
Clock, key custody and external publication are simulated. No X.509 validation,
network TSA, blockchain, durable log or authorship proof is provided.

Sources: [RFC 3161](https://www.rfc-editor.org/rfc/rfc3161.html), especially §§1–2.4;
[Haber and Stornetta, 1991](https://doi.org/10.1007/BF00196791). The simple hash chain
illustrates the linking/anchoring distinction, not the complete paper's protocol.

## Fair exchange

`fair-exchange/core.mjs` binds both fictional items to one random session, scenario,
party and subject. Real ECDSA verifies the signed packet; actual AES-GCM decryption
and hash comparison check its content. Direct delivery exposes the first sender
to a party who stops. An ideal always-involved intermediary validates deposits,
then makes a single terminal abort/release decision. Both items are checked before
either retrieval right is committed. Concurrent actions are rejected.

The receipt authorizes release of a bound message; it does not prove human reading.
The model's release means both parties can retrieve evidence, not simultaneous
network delivery. Identity, custody, durable decision storage and availability are
assumptions. Every secret is accessible to the one-browser simulator. This is not
a deployed service, an optimistic fair-exchange implementation or a new protocol
security claim.

Sources: [Asokan, Shoup and Waidner](https://eprint.iacr.org/1997/015),
[expanded paper](https://www.shoup.net/papers/fex.pdf), and
[Chatterjee and Raman](https://arxiv.org/abs/1004.2697). Optimistic constructions and
formal abort/resolve analysis are further reading, not implemented features.

## Verification

`tests/protocol-workshops.test.mjs` covers signature/message/nonce changes, false
signed times, anchored rewrites, actual decryption, wrong-session evidence,
tampering, premature release, terminal decisions and interleaving guards.
`tests/reading-path.test.mjs` checks generated chapter coverage and local links.
`tests/understanding-cryptography.test.mjs` checks the second-edition path,
its catalog-only connections, filters, progress and static reading fallback.
`tests/protocol-workshops-browser.test.cjs` exercises full UI flows, filters,
progress, keyboard controls, axe accessibility audits and mobile/desktop overflow.
CI includes these suites; the Understanding Cryptography path also received a
focused local Chromium smoke check.

```sh
node --test tests/protocol-workshops.test.mjs tests/reading-path.test.mjs tests/understanding-cryptography.test.mjs
node --test tests/protocol-workshops-browser.test.cjs
```

## Boneh–Shoup reading path

`boneh-shoup/chapters.mjs` supplies 23 chapter entries for Dan Boneh and Victor
Shoup's *A Graduate Course in Applied Cryptography*, version 0.6 (January 2023).
The guide lives at `/learn/boneh-shoup/`, in the hub menu and alongside the other
book companions. It adds no catalog exhibits and uses `home: false` like the
existing book paths.

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

Chapter order and section pointers were checked against the publisher's
[front matter](https://link.springer.com/content/pdf/bfm:978-3-662-69007-9/1), the
[authors' contents](https://www.cryptography-textbook.com/files/toc.pdf) and the
supplied detailed contents. The supplied usable 2010 first-edition PDF has
13 chapters and is not the numbering authority. No textbook PDF, passages,
figures, exercises or solutions are stored or reproduced here. This is a
contents-led alignment, not an exhaustive review of the full second-edition text.

### Catalog source and capability limits

Unlike the existing generators, this path reads the per-lab section of
`CATALOG.md` directly. `chapters.mjs` specifies repository slugs and original
connection notes; `build.mjs` resolves the exact catalog titles and live URLs.
Unknown slugs, duplicate connections and an incorrect chapter sequence fail the
build. The path has **43 connections to 37 distinct catalogued labs**.

Direct connection, modern counterpart and introductory bridge describe selected
relationships, never complete chapter coverage. Significant boundaries include:

- AEGIS exposes one real AES round; full AES code exists elsewhere, but the
  introductory field-arithmetic/key-expansion/inverse route remains incomplete.
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
