# Crypto Lab — pedagogy scorecard, 2026-08-02, slice 4

Scored 2026-08-02 against the claim-complete bar (SCORECARD-2026-08-01 calibration; no 10s ever awarded).
Repos in this slice, with HEAD short hashes as scored:

model-breach ebc639b · musig-gate 638c110 · nonce-collision 2bb1691 · nonce-lattice 4fee888 ·
padding-oracle 5f2f536 · paillier-gate ddd50d0 · pairing-gate e0f1da0 · pq-families 3862c88 ·
pq-rotation 5ffb07b · pq-tls-handshake 7c86f5e · protocol-checker f335d93 ·
quantum-vault-kpqc dabc9f2 · reshare-circle 985d32e · rsa-educational 261ad16 ·
rsa-forge c287679 · salamander 7222f73 · schnorr-forge a02b70f · shamir-gate a777192 ·
shamir-vs-frost 35eaaba

| Demo | HEAD | Score | Justification |
|---|---|--:|---|
| `model-breach` | ebc639b | **8** | Real AESL (FIPS-197 round vector KAT), a structurally correct toy HiAE, and a black-box key recovery that is genuinely computed — the seed is rediscovered from one keystream query, the forgery is accepted by the real decryption oracle, a random tag is rejected, and the "EXACT MATCH" verdict actually compares recovered bytes to ground truth. Honesty is unusually good: an explicit callout that the browser's 2^16 seed search and the paper's 2^209 MITM are *different techniques*, not one at two sizes. It stops at 8 because Panel B (threat-model map, scenario tabs A/B/C, log-scale bars, academic record, "what the paper shows") is entirely static prose, the headline 2^256→2^209 figure is quoted rather than derived, the standard-model "dead-end" is a scripted spinner rather than a computed impossibility, and the learner never parameterizes anything — Run Attack is the only lever. |

<!-- ROWS -->

## What would raise it

### model-breach
- Let the learner pick the toy seed / keyspace width and watch recovery time and candidate count move with it, instead of a fixed Generate-then-Run.
- Make the leak micro-explainer read the *live* instance key rather than the hardcoded `deriveToyKey(0x1a2b)` demo key — it currently shows a block unrelated to the instance being attacked.
- Make the standard-model side a real dead-end: let the learner submit a candidate and show there is no predicate to evaluate, rather than a timed spinner that prints a canned "unresolvable".
- Drive the scenario tabs from the attack: pressing Scenario A should actually disable the decryption oracle and show Run Attack failing, so the threat-model contract is enforced rather than described.
