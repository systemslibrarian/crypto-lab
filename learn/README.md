# Reading path and protocol workshops

These pages live in the hub and deploy with its existing GitHub Pages site. They
do not require new repositories or add standalone cards to the catalog count.

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
per-lab connection labels, reflection questions and explicit coverage limits.
Its independent progress key is `crypto-lab-modern-cryptography-progress-v1`.

```sh
node learn/modern-cryptography/build.mjs
node learn/modern-cryptography/build.mjs --check
```

### Sources and edition boundary — reviewed 20 October 2026

- [Katz’s official book page](https://www.cs.umd.edu/~jkatz/imc.html) identifies
  the authors, third edition, intended scope, contents and errata.
- [Author-hosted contents and preface](https://www.cs.umd.edu/~jkatz/imc/toc-preface-3rd.pdf)
  establishes the 15-chapter sequence, three parts and section pointers used here.
- [Revised third edition publisher listing](https://www.routledge.com/Introduction-to-Modern-Cryptography-Revised-Third-Edition/Katz-Lindell/p/book/9781032496795)
  and its [indexed alternate URL](https://www.routledge.com/Introduction-to-Modern-Cryptography-Third-Edition/Katz-Lindell/p/book/9781032496795)
  identify the 2025 revision and the same chapter outline. The author’s contents
  call chapter 14 “Post-Quantum Cryptography”; the publisher’s listing uses
  “Quantum-Secure Cryptography.” Section pointers were checked against the
  author-hosted third-edition contents, not a revised-edition interior. No
  revised-edition page offsets are claimed.
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
  and proofs are not implemented by these connections.
- Chapter 10 has real selected factoring methods and toy baby-step/giant-step;
  Pohlig–Hellman and index calculus remain gaps.
- Chapter 14 separates quantum simulations and the text’s themes from later
  standardized ML-KEM/ML-DSA examples. LMS Ledger is a teaching adaptation,
  not interoperable HSS.
- Chapter 15 covers selected Paillier, sharing and threshold concepts. It does
  not implement Goldwasser–Micali, Rabin or generic trapdoor-permutation proofs.
  VSS Gate deliberately makes the second-generator relation knowable, defeating
  Pedersen binding. Threshold parties run in one browser, not a distributed system.
- General ZK and MPC are further study, not invented numbered book chapters.

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
