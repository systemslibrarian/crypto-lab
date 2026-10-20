# Reading path and protocol workshops

These pages live in the hub and deploy with its existing GitHub Pages site. They
do not require new repositories or add standalone cards to the catalog count.
The two book companions remain in the hub menu and at their direct URLs. Their
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
`tests/protocol-workshops-browser.test.cjs` exercises full UI flows, filters,
progress, keyboard controls, axe accessibility audits and mobile/desktop overflow.
CI runs all three.

```sh
node --test tests/protocol-workshops.test.mjs tests/reading-path.test.mjs
node --test tests/protocol-workshops-browser.test.cjs
```
