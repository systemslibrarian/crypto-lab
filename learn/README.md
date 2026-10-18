# Reading path and protocol workshops

These pages live in the hub and deploy with its existing GitHub Pages site. They
do not require new repositories or add standalone cards to the catalog count.

## Reading path

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
