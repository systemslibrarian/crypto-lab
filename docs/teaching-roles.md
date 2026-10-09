# Source-backed choices between overlapping exhibits

These descriptions retain both labs and acknowledge shared learning content. They offer different lesson paths through features that already exist; they do not establish disjoint implementations or a cryptographic correctness audit. The authored catalog guidance is reviewed separately from application correctness and deployment evidence.

## Babel Hash / Hash Zoo

Both compute SHA-256, SHA3-256 and BLAKE3, show avalanche, and perform real SHA-256 length extension. Use Babel Hash for the explicit transition from a prefix-MAC attack to HMAC defense: its secret-length sweep and HMAC tab make the contrast directly actionable. Use Hash Zoo when the lesson asks learners to inspect construction details, SHA-256 glue padding and SHA-3 rate/capacity. The overlap remains substantial. Browser timing views are not definitive native speed rankings.

Reviewed source:

- [Babel Hash](https://github.com/systemslibrarian/crypto-lab-babel-hash/tree/61b037bbbf103fdfbcf9f1e1b4862ddfe2ccafae): README and `demos/babel-hash/src/main.ts`, `crypto/hash.ts`, `crypto/hmac.ts`, `crypto/length-extension.ts`.
- [Hash Zoo](https://github.com/systemslibrarian/crypto-lab-hash-zoo/tree/4d6f3ae4fb0bc09510974339e7d5db9ae634e1ca): README and `src/hasher.ts`, construction/padding controls.

## LMS Ledger / LMS/XMSS

Both teach LMS/HSS state consumption and index-reuse forgery. Use LMS Ledger to watch the small h1=h2=3 HSS instance fill, roll over and exhaust during a short session. Use LMS/XMSS for the Winternitz-chain and authentication-path walk, then vary the number of leaked signatures and inspect reachable chain depths in the forgery. This comparison concerns existing teaching controls, not just different parameter sizes. The name LMS/XMSS is not evidence that it implements XMSS; the reviewed implementation is LMS/HSS.

Reviewed source:

- [LMS Ledger](https://github.com/systemslibrarian/crypto-lab-lms-ledger/tree/360d7c6da3407c130648d58926c40384d3be8f09): README and `src/lms.ts` (small HSS rollover and reuse forgery).
- [LMS/XMSS](https://github.com/systemslibrarian/crypto-lab-lms-xmss/tree/a9d82427ffa5093782ab84375a8e22ae80d14e0d): README and `src/main.ts`, `src/forge.ts`, `src/lmots.ts`. The change from previously reviewed 6377466a1d70008df74aad70bde01cd8b28868ef is dependency metadata only.

This catalog update preserves both labs and changes no lab runtime code, name or deployment. These source reviews are separate from live-browser evidence and binary provenance.
