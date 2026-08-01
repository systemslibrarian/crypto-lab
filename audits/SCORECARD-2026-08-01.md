# Crypto Lab — pedagogy scorecard, reconstructed 2026-08-01

## Post-remediation recheck — 2026-08-01

Four large recorded regressions were re-investigated against fetched current source. The
lower scores later in this file remain useful history, but are no longer current:

| Demo | Current | Why it stops there |
|---|:--:|---|
| `zk-proof-lab` | **7** | Verdicts and tamper paths are now computed; SNARK setup remains assumed and the page exposes values it calls hidden. |
| `hawk` | **7** | It honestly demonstrates its public linear model and a real forgery; it still is not production HAWK's secret Gaussian coset sampler. |
| `tls-handshake` | **8** | MITM, Finished checks, transcript binding, and injected failure paths are computed; several TLS layers remain honestly compressed. |
| `bcrypt-forge` | **8** | Rainbow construction, dictionary attempts, and cost-scaled work are real and measured; it remains a teaching implementation. |

The earlier drops were valid corrections against then-live defects, not evidence that the
repositories had newly regressed. Subsequent remediation made those downgraded scores stale.

## Provenance

Reconstructed on 2026-08-01 from the Claude Code session transcript
`~/.claude/projects/-Users-gmcas-repos-crypto-lab/72054ee4-8e8a-446f-89dd-2b5d9dc97349.jsonl`
and its 187 subagent transcripts. Nothing here was read from a scorecard file on disk — no such
file was written during that session. Every row below is quoted or paraphrased from a scoring
agent's own report inside that transcript.

**Recovered: 74 of 174 demos (43%).** The session summary asserts scoring was "complete, all
174 demos, calibrated to your scorecard". That assertion is not supported by the transcript.
Only five scoring agents ever produced scores:

| Scoring agent | Agent id | Demos scored |
|---|---|--:|
| Gold standard scoring batch 1 | `ada8dfcbf97915247` | 12 |
| Gold standard scoring batch 2 | `aff82ddf8c014c6cf` | 18 |
| Gold standard scoring batch 3 | `ae556a9f2afe088ce` | 18 |
| Gold standard scoring batch 4 | `a4640b7c4c7166a94` | 20 |
| Parallel pre-batch assessments | `a427bec3a3ce81297`, `afb76e2192b81f334` | 6 |

12 + 18 + 18 + 20 + 6 = 74. The remaining ~100 demos have no score anywhere in the transcript,
main thread or subagent. Four further scoring agents were launched under the same batch names
and stopped before producing output (`ab09cbfd3341d0cde`, `a398c68803e465876`,
`a77bda5f4e55ecfd4`, `acbcaff09c0c54f4f`). No score below is interpolated or inferred.

**Known incomplete or uncertain:**

- Prior scores are recorded only where a scoring agent stated one. 25 of 74 rows have no stated
  prior; that does not mean the prior scorecard lacked them, only that the agent did not quote
  one. The prior scorecard itself is at
  `/Users/gmcas/repos/__Misc/CRYPTO-LAB-PEDAGOGY-SCORECARD.md` (136 demos) and was not read
  during this reconstruction.
- Batch 4's full report (20 scores, 49 falsifiable claims) **never reached the main thread.**
  Only its later two-row correction did. Those 20 scores exist solely in the subagent
  transcript, so they were never reconciled against anything.
- `tls-handshake` and `ssh-handshake` were disputed. The values below are the ones the main
  thread settled on after reading the code directly; batch 3 itself reported both differently at
  different points. See the dispute note at the end.
- Reasons are condensed from the agents' one-line verdicts. Longer per-demo detail and ranked
  remediation lists exist in the subagent transcripts and were not carried over here.

## Distribution of the 74 recovered scores

| Score | Count |
|--:|--:|
| 5 | 4 |
| 6 | 3 |
| 7 | 18 |
| 8 | 28 |
| 9 | 21 |

No 10s, consistent with the main thread's "No 10s anywhere".

The main thread also stated "only three moved down". That is wrong against the full recovered
set: **10 of the 49 demos with a stated prior moved down.** The main thread was counting only
what it had seen at that moment — batch 4's downgrades never reached it, and batch 2's arrived
minutes before session close.

| Direction | Count |
|---|--:|
| Up | 20 |
| Unchanged | 19 |
| Down | 10 |
| No prior stated | 25 |

### Every downward move

| Demo | Prior | New | Stated reason |
|---|--:|--:|---|
| `bcrypt-forge` | 7 | **6** | Exhibit 6 is pure theater; a "key schedule" animation runs Math.random() then claims 16,384 rounds executed. |
| `drbg-arena` | 7 | **6** | Two of five exhibits are Generate-to-hex-blob; a hidden per-click nonce falsifies the demo's own determinism claim; Exhibit 5's headline visual claim is empirically untrue. |
| `hawk` | 7 | **5** | Signing needs no secret and never calls the CDT sampler the demo is built around. Agent states explicitly the prior 7 was wrong. |
| `multivariate` | 9 | **8** | Exceptional constructive path, but "watch the collapse" is four hardcoded captions and there is no attack exhibit. Agent states prior 9 was inflated. |
| `tls-handshake` | 8 | **7** | Real TLS 1.3 crypto fully precomputed at load; "stepping" reveals pre-rendered panels and the MITM exhibit's headline evidence is fabricated. See note on disagreement below. |
| `zk-proof-lab` | 8 | **5** | Wears the most "REAL" badges and has the most string-literal verdicts: five conclusions printed without ever being computed; its graph exhibit has no reachable failure branch. |
| `oblivious-shelf` | 8 | **7** | Half the page is static prose; the "record" it retrieves is one bit already on screen; panels labelled "Server A's view" highlight the exact index the text says a server cannot see. |
| `snark-arena` | 8 | **7** | Contains the single best artifact in the cluster (a real client-side Groth16 proof, forged and rejected) surrounded by decorative Verify buttons; its key takeaway is false over its own field. |
| `silent-tally` | 8 | **7** | Corrected down from a filed 8. The coalition-attack exhibit computes nothing; the verdict is selected by checkbox count. |
| `patron-shield` | 9 | **8** | Still the best-structured PIR teaching sequence with a genuinely computed collusion break — docked one point for a "Correct" badge that never reads the correctness flag it computes. |

### Every upward move

| Demo | Prior | New | Stated reason |
|---|--:|--:|---|
| `opaque-gate` | 4 | **8** | The 4 no longer stands. Stepped KE1/KE2/KE3, a learner-mounted wrong-password MAC failure, obliviousness shown by learner-triggered repeat runs. Prior graded a codebase that no longer exists. |
| `x3dh-wire` | 5 | **9** | The 5 no longer stands. Five break-it toggles re-run the real handshake; a relay-substituted prekey is genuinely rejected by XEdDSA against IK_B. |
| `kdf-arena` | 5 | **8** | Transformed: real cost knobs, salt-reuse toggle producing identical keys, honest linear-scale memory grids. Held back by a hardcoded "64,000x" the live grid contradicts. |
| `poly1305-mac` | 6 | **9** | The learner types a message the sender never signed and the real key accepts their forged tag — recovered by genuine algebra, not brute force. |
| `hash-zoo` | 6 | **8** | Real, independently-verified length-extension forgery plus an every-bit avalanche sweep; sponge/tree half still static SVGs. |
| `aegis-gate` | 7 | **9** | Spec-conformant AEGIS you can single-step; an AES round opened stage-by-stage on live state; nonce-reuse exhibit marks where recovery stops being real. |
| `kyber-vault` | 6 | **8** | Real ML-KEM plus the noiseless-vs-noisy Gaussian elimination contrast; the prior review's three HIGH fixes have all landed. Agent states prior 6 is stale. |
| `ntru-classic` | 6 | **8** | Real LLL now recovers the real private key from public data at N=5 — the bridge the prior review asked for. Agent states prior 6 is stale. |
| `mls-group` | 6 | **8** | Real RFC 9180 HPKE and TreeKEM; the removed-member lockout is a real learner-mounted AEAD failure. Prior was too low. |
| `world-hashes` | 6 | **7** | Better on-ramp, live KAT self-test, honest editorial labelling — but only one of four avalanche panels is learner-driven and nothing ever breaks. |
| `nonce-guard` | 7 | **8** | Break-before-theory reordering fixed the on-ramp; H recovery plus a forgery real AES-GCM accepts. Level 2 runs on internal probes, not the learner's messages. |
| `phantom-vault` | 7 | **8** | Entropy cap and modulo-bias panels now live and computed; nothing to break, and the bias exhibit's sample is too small for the contrast it promises. |
| `kdf-chain` | 7 | **8** | Every panel shows mechanism from real bytes with attacker assumptions inline and RFC KATs on the page; the learner tunes and reads rather than breaks. |
| `mac-race` | 8 | **9** | Six live attacks: the learner guesses a hidden secret length, forges, and watches a broken server accept while the HMAC server rejects. |
| `corrupted-oracle` | 8 | **9** | The attacker predicts the learner's own next click, from a real 2^16 Shumow-Ferguson search on real P-256. |
| `kerberos` | 7 | **8** | Real RFC 3961/3962 AES-256 CTS profile with live KATs, plus mounted replay, clock-skew and Needham-Schroeder/Lowe attacks. |
| `jwt-forge` | 8 | **9** | The learner hand-forges a token a real vulnerable verifier really accepts and a real correct verifier really rejects. |
| `ot-gate` | 7 | **8** | Both HIGH fixes from the prior review landed: two independent routes to the shared point are computed and byte-compared, and the DDH game has a real 1000-round tally. |
| `bulletproofs` | 7 | **8** | The verifier equation now has a three-tier plain-English-to-algebra ramp with equation (1) evaluated live on real points; the bit-vector/inner-product gap is closed. |
| `stark-tower` | 7 | **8** | The missing middle step is built: exact polynomial division makes a broken constraint visibly explode in degree. Only the jargon wall keeps it off 9. |

## Full recovered table

Sorted by score ascending, then demo name. `Src` is the scoring batch.

| Demo | New | Prior | Src | Stated reason |
|---|--:|--:|---|---|
| `bike-vault` | **5** | — | B2 | Black-Gray-Flip is named, legended and narrated in five steps but not implemented; six headline numbers contradicted by the demo's own live output. |
| `hawk` | **5** | 7 | B2 | Signing needs no secret and never calls the CDT sampler the demo is built around. Agent states explicitly the prior 7 was wrong. |
| `isogeny-gate` | **5** | — | B2 | 14 of 20 controls are reveal-only; the one real walk exhibit steps vertex representatives, demonstrating non-commutativity two sections before the page claims commutativity. |
| `zk-proof-lab` | **5** | 8 | B4 | Wears the most "REAL" badges and has the most string-literal verdicts: five conclusions printed without ever being computed; its graph exhibit has no reachable failure branch. |
| `bcrypt-forge` | **6** | 7 | B1 | Exhibit 6 is pure theater; a "key schedule" animation runs Math.random() then claims 16,384 rounds executed. |
| `drbg-arena` | **6** | 7 | B1 | Two of five exhibits are Generate-to-hex-blob; a hidden per-click nonce falsifies the demo's own determinism claim; Exhibit 5's headline visual claim is empirically untrue. |
| `shadow-vault` | **6** | 6 | B4 | Real end-to-end deniable encryption wrapped in "fill a form, get a file"; four headline claims contradicted by its own code; sharpest caveats live only in .md. |
| `dilithium-seal` | **7** | — | B2 | Real ML-DSA with a computed seal-tamper lesson, but three of five tabs are inert prose and the toy abort loop reports acceptances that never happened. |
| `envelope-kms` | **7** | 7 | B3 | Real RFC 3394/5649 with five learner-run experiments; the headline three-tier hierarchy exists only in prose and SVG. |
| `falcon-seal` | **7** | — | B2 | Superb forgery playground and a real WASM Falcon panel, undercut by a signing path that never touches the private key while the page insists it does. |
| `hqc-vault` | **7** | — | B2 | Richest interaction set of the code-based trio and a real BM/Chien/Forney decoder, but the "push past the error budget" slider cannot reach failure. |
| `lms-xmss` | **7** | — | B2 | Fully real RFC 8554 with a genuine end-to-end forgery, but the Danger Zone and the forgery describe two disconnected state machines. |
| `mceliece-gate` | **7** | — | B2 | Real Goppa code and Patterson trace with real decode failure past the radius — but the live KEM bypasses the S.G.P scrambling the demo just taught. |
| `noise-pipe` | **7** | 7 | B3 | Broadest and most KAT-anchored implementation in the cluster; the walkthrough is a scrubbable replay and one attack card teaches the inverse of what its code does. |
| `oblivious-shelf` | **7** | 8 | B4 | Half the page is static prose; the "record" it retrieves is one bit already on screen; panels labelled "Server A's view" highlight the exact index the text says a server cannot see. |
| `oram-vault` | **7** | 7 | B4 | A genuine Path ORAM computing a real chi-square from real access traces — then printing "Distribution looks uniform" unconditionally next to it. |
| `pake-gate` | **7** | 7 | B3 | Four spec-accurate PAKE engines the learner drives message-by-message, but every attack is a canned menu item and guard code for the classic attacks is unreachable from the UI. |
| `pki-chain` | **7** | 7 | B3 | An excellent RFC 6962 CT exhibit bolted onto "certificates" that are JSON objects, under a hero bar reading X.509 / RFC 5280. |
| `psi-gate` | **7** | 7 | B4 | Corrected down from a filed 8. Its DDH exhibit should fail its own test, and its input-validation certificate is for validation that never runs. |
| `ring-sign` | **7** | 7 | B4 | Real LSAG with a genuine tamper path and animated challenge chain — but the linkability exhibit's "not linked" branch is unreachable code. |
| `silent-tally` | **7** | 8 | B4 | Corrected down from a filed 8. The coalition-attack exhibit computes nothing; the verdict is selected by checkbox count. |
| `snark-arena` | **7** | 8 | B4 | Contains the single best artifact in the cluster (a real client-side Groth16 proof, forged and rejected) surrounded by decorative Verify buttons; its key takeaway is false over its own field. |
| `sphincs-ledger` | **7** | — | B2 | Real SLH-DSA plus a genuine WOTS+ reuse forgery, weakened by a checksum omission that teaches a wrong general fact and a fixed-constant hypertree path. |
| `tls-handshake` | **7** | 8 | B3 | Real TLS 1.3 crypto fully precomputed at load; "stepping" reveals pre-rendered panels and the MITM exhibit's headline evidence is fabricated. See note on disagreement below. |
| `world-hashes` | **7** | 6 | B1 | Better on-ramp, live KAT self-test, honest editorial labelling — but only one of four avalanche panels is learner-driven and nothing ever breaks. |
| `bulletproofs` | **8** | 7 | B4 | The verifier equation now has a three-tier plain-English-to-algebra ramp with equation (1) evaluated live on real points; the bit-vector/inner-product gap is closed. |
| `collision-vault` | **8** | 8 | PP | Prior score holds, at the low end of the band; 6 of 8 sections have zero interaction. |
| `credential-veil` | **8** | — | B4 | Real BBS to the IRTF draft with a forced forgery separating "pairing passes" from "challenge fails"; two of five exhibits stage what they claim to demonstrate. |
| `dilithium-reject` | **8** | — | B2 | The rejection loop is genuinely instrumented FIPS 204 in a worker and displayed statistics are measured, not modelled. |
| `frodo-vault` | **8** | — | B2 | Real liboqs FrodoKEM with a noise slider that genuinely destroys solvability; the tamper exhibit shows nothing 99.6% of the time. |
| `hash-zoo` | **8** | 6 | B1 | Real, independently-verified length-extension forgery plus an every-bit avalanche sweep; sponge/tree half still static SVGs. |
| `kdf-arena` | **8** | 5 | B1 | Transformed: real cost knobs, salt-reuse toggle producing identical keys, honest linear-scale memory grids. Held back by a hardcoded "64,000x" the live grid contradicts. |
| `kdf-chain` | **8** | 7 | B1 | Every panel shows mechanism from real bytes with attacker assumptions inline and RFC KATs on the page; the learner tunes and reads rather than breaks. |
| `kerberos` | **8** | 7 | B3 | Real RFC 3961/3962 AES-256 CTS profile with live KATs, plus mounted replay, clock-skew and Needham-Schroeder/Lowe attacks. |
| `kyber-vault` | **8** | 6 | B2 | Real ML-KEM plus the noiseless-vs-noisy Gaussian elimination contrast; the prior review's three HIGH fixes have all landed. Agent states prior 6 is stale. |
| `lms-ledger` | **8** | — | B2 | The learner personally burns a leaf twice and forges a signature the real verifier accepts against the real root. |
| `mls-group` | **8** | 6 | B3 | Real RFC 9180 HPKE and TreeKEM; the removed-member lockout is a real learner-mounted AEAD failure. Prior was too low. |
| `multivariate` | **8** | 9 | B2 | Exceptional constructive path, but "watch the collapse" is four hardcoded captions and there is no attack exhibit. Agent states prior 9 was inflated. |
| `nonce-guard` | **8** | 7 | B1 | Break-before-theory reordering fixed the on-ramp; H recovery plus a forgery real AES-GCM accepts. Level 2 runs on internal probes, not the learner's messages. |
| `ntru-classic` | **8** | 6 | B2 | Real LLL now recovers the real private key from public data at N=5 — the bridge the prior review asked for. Agent states prior 6 is stale. |
| `opaque-gate` | **8** | 4 | B3 | The 4 no longer stands. Stepped KE1/KE2/KE3, a learner-mounted wrong-password MAC failure, obliviousness shown by learner-triggered repeat runs. Prior graded a codebase that no longer exists. |
| `ot-gate` | **8** | 7 | B4 | Both HIGH fixes from the prior review landed: two independent routes to the shared point are computed and byte-compared, and the DDH game has a real 1000-round tally. |
| `patron-shield` | **8** | 9 | B4 | Still the best-structured PIR teaching sequence with a genuinely computed collusion break — docked one point for a "Correct" badge that never reads the correctness flag it computes. |
| `phantom-vault` | **8** | 7 | B1 | Entropy cap and modulo-bias panels now live and computed; nothing to break, and the bias exhibit's sample is too small for the contrast it promises. |
| `quantum-entropy` | **8** | 8 | PP | Honest that it is a classical simulation, and says so where the learner stands. |
| `ratchet-wire` | **8** | 8 | B3 | Real Double Ratchet the learner drives with two learner-parameterized failures; the compromise story stops one decrypt() short of a break. |
| `scloud-vault` | **8** | — | B2 | A real hand-rolled Scloud+ and the best on-ramp in the cluster; Exhibit 3's correction-radius crossing is a true break-it exhibit. |
| `ssh-handshake` | **8** | 8 | B3 | Best failure coverage in the cluster including a MITM that genuinely succeeds — spoiled by one lab that asserts the opposite of what it computes. See note on disagreement below. |
| `stark-tower` | **8** | 7 | B4 | The missing middle step is built: exact polynomial division makes a broken constraint visibly explode in degree. Only the jargon wall keeps it off 9. |
| `vrf-gate` | **8** | 8 | PP | Now the weakest-visualized of the six; honesty improved, narrative unchanged. |
| `web-of-trust` | **8** | 8 | B3 | Real Ed25519 certifications and revocations with a mountable over-trusted-introducer attack; several panels state crypto facts from flags instead of computing them. |
| `webauthn` | **8** | 8 | B3 | Real ECDSA, four mounted attacks, a genuine bit-level tamper bench, a real navigator.credentials path — but every attack is a scripted button. |
| `zk-arena` | **8** | 8 | B4 | Two real forgeries and the most sophisticated self-disclosure in the set (it quantifies its own toy group's 19-bit leak) — but its namesake comparison is a hardcoded table. |
| `aegis-gate` | **9** | 7 | B1 | Spec-conformant AEGIS you can single-step; an AES round opened stage-by-stage on live state; nonce-reuse exhibit marks where recovery stops being real. |
| `babel-hash` | **9** | 9 | PP | Prior score holds, at the bottom of the band; tabs 4-5 are mostly static. |
| `card-trick` | **9** | — | B4 | Exactly enumerated leakage (not sampled), and a break panel where "genuinely random, but only by 0 or 1" hands the secret over in full. Zero falsifiable claims found. |
| `chain-of-trust` | **9** | — | B3 | Genuine DER X.509 and ECDSA over real TBS bytes; the learner delivers a ruling and is graded against the real validator. |
| `corrupted-oracle` | **9** | 8 | B1 | The attacker predicts the learner's own next click, from a real 2^16 Shumow-Ferguson search on real P-256. |
| `dp-noise` | **9** | — | B4 | Exact discrete samplers, a real accountant, five separate attacks, and the most complete honesty scaffold in the suite. |
| `entropy-collapse` | **9** | — | PP | The learner personally brute-forces a real DRBG and holds the recovered key. |
| `frozen-heart` | **9** | — | B4 | Drop one field from the hash and forge a proof the real verifier accepts, then an omission ladder grading which omissions actually matter. |
| `garbled-gate` | **9** | 9 | B4 | Real crypto end to end; the label-reuse attack is literally the honest evaluator run twice — the leak falls out of two legitimate decryptions. |
| `isogeny-atlas` | **9** | — | B2 | Every vertex and edge discovered live by real polynomial factorization, with live self-checks printed into the page and zero display/reality contradictions. |
| `jwt-forge` | **9** | 8 | B3 | The learner hand-forges a token a real vulnerable verifier really accepts and a real correct verifier really rejects. |
| `key-mirror` | **9** | — | B3 | The learner mounts real directory equivocation and produces the counterexample: a valid inclusion proof that proves a lie. |
| `mac-race` | **9** | 8 | B1 | Six live attacks: the learner guesses a hidden secret length, forges, and watches a broken server accept while the HMAC server rejects. |
| `mayo-seal` | **9** | — | B2 | Spec-faithful MAYO over GF(16) with KAT byte-comparison, and a wrong-oil-space forgery producing a well-formed signature the real verifier rejects. |
| `otp-vault` | **9** | 9 | PP | Prior score holds. The perfect-secrecy panel is the copyable pattern for the whole fleet. |
| `poly1305-mac` | **9** | 6 | B1 | The learner types a message the sender never signed and the real key accepts their forged tag — recovered by genuine algebra, not brute force. |
| `search-vault` | **9** | — | B4 | The learner runs a real leakage-abuse attack computed only from the leakage profile, then becomes the server and tries to beat it by hand. |
| `spake-gate` | **9** | — | B3 | The learner types a password and personally recovers w1 from a stolen SPAKE2+ record, then watches it reconstruct L. |
| `spdz-forge` | **9** | — | B4 | Cheat and get caught by a real MAC check, then a second break-it that succeeds once you remove the commit-then-open ordering rule. Zero falsifiable claims found. |
| `time-trust` | **9** | — | B3 | Replay an intercepted TOTP code a real HMAC accepts; roll a server clock and resurrect a dead signed URL. |
| `x3dh-wire` | **9** | 5 | B3 | The 5 no longer stands. Five break-it toggles re-run the real handshake; a relay-substituted prekey is genuinely rejected by XEdDSA against IK_B. |

## By scoring batch

### Batch 1 — hashes, MACs, KDFs, RNG

| Demo | New | Prior |
|---|--:|--:|
| `bcrypt-forge` | 6 | 7 |
| `drbg-arena` | 6 | 7 |
| `world-hashes` | 7 | 6 |
| `hash-zoo` | 8 | 6 |
| `kdf-arena` | 8 | 5 |
| `kdf-chain` | 8 | 7 |
| `nonce-guard` | 8 | 7 |
| `phantom-vault` | 8 | 7 |
| `aegis-gate` | 9 | 7 |
| `corrupted-oracle` | 9 | 8 |
| `mac-race` | 9 | 8 |
| `poly1305-mac` | 9 | 6 |

### Batch 2 — post-quantum

| Demo | New | Prior |
|---|--:|--:|
| `bike-vault` | 5 | — |
| `hawk` | 5 | 7 |
| `isogeny-gate` | 5 | — |
| `dilithium-seal` | 7 | — |
| `falcon-seal` | 7 | — |
| `hqc-vault` | 7 | — |
| `lms-xmss` | 7 | — |
| `mceliece-gate` | 7 | — |
| `sphincs-ledger` | 7 | — |
| `dilithium-reject` | 8 | — |
| `frodo-vault` | 8 | — |
| `kyber-vault` | 8 | 6 |
| `lms-ledger` | 8 | — |
| `multivariate` | 8 | 9 |
| `ntru-classic` | 8 | 6 |
| `scloud-vault` | 8 | — |
| `isogeny-atlas` | 9 | — |
| `mayo-seal` | 9 | — |

### Batch 3 — protocols and key exchange

| Demo | New | Prior |
|---|--:|--:|
| `envelope-kms` | 7 | 7 |
| `noise-pipe` | 7 | 7 |
| `pake-gate` | 7 | 7 |
| `pki-chain` | 7 | 7 |
| `tls-handshake` | 7 | 8 |
| `kerberos` | 8 | 7 |
| `mls-group` | 8 | 6 |
| `opaque-gate` | 8 | 4 |
| `ratchet-wire` | 8 | 8 |
| `ssh-handshake` | 8 | 8 |
| `web-of-trust` | 8 | 8 |
| `webauthn` | 8 | 8 |
| `chain-of-trust` | 9 | — |
| `jwt-forge` | 9 | 8 |
| `key-mirror` | 9 | — |
| `spake-gate` | 9 | — |
| `time-trust` | 9 | — |
| `x3dh-wire` | 9 | 5 |

### Batch 4 — privacy, ZK, MPC

| Demo | New | Prior |
|---|--:|--:|
| `zk-proof-lab` | 5 | 8 |
| `shadow-vault` | 6 | 6 |
| `oblivious-shelf` | 7 | 8 |
| `oram-vault` | 7 | 7 |
| `psi-gate` | 7 | 7 |
| `ring-sign` | 7 | 7 |
| `silent-tally` | 7 | 8 |
| `snark-arena` | 7 | 8 |
| `bulletproofs` | 8 | 7 |
| `credential-veil` | 8 | — |
| `ot-gate` | 8 | 7 |
| `patron-shield` | 8 | 9 |
| `stark-tower` | 8 | 7 |
| `zk-arena` | 8 | 8 |
| `card-trick` | 9 | — |
| `dp-noise` | 9 | — |
| `frozen-heart` | 9 | — |
| `garbled-gate` | 9 | 9 |
| `search-vault` | 9 | — |
| `spdz-forge` | 9 | — |

### Parallel pass (pre-batch)

| Demo | New | Prior |
|---|--:|--:|
| `collision-vault` | 8 | 8 |
| `quantum-entropy` | 8 | 8 |
| `vrf-gate` | 8 | 8 |
| `babel-hash` | 9 | 9 |
| `entropy-collapse` | 9 | — |
| `otp-vault` | 9 | 9 |

## The tls-handshake / ssh-handshake dispute

Batch 3 reported `ssh-handshake` at 8, revised to 9, then reasserted 8/8/8 for the
tls/ssh/kerberos trio, then reported 9 again. A separate critical agent said the ssh MITM
exhibit carries a falsifiable claim. The main thread read
`crypto-lab-ssh-handshake/src/ui.ts:645-715` directly and found:

```js
const connected = authOn ? (kexOk && result.signatureValid && result.connected) : kexOk;
const verdictCls = connected ? 'ssh-warning--bad' : 'ssh-warning--pending';
const verdict = authOn ? `MITM rejected — authentication did its job` : ...
```

The verdict text is chosen by the checkbox while the CSS class is chosen by the result, so the
box renders styled as `--bad` while the headline reads "MITM rejected". The main thread ruled
the critical agent right and pinned `ssh-handshake` at **8** and `tls-handshake` at **7**. Those
are the values used above. Batch 3 asserted "no falsifiable claim found" for `ssh-handshake`
three times; the main thread explicitly refused to relay that as fact.

## What the scores rest on

The rubric was the owner's own `CRYPTO-LAB-PEDAGOGY-SCORECARD.md`, with anchors `opaque-gate` = 4
and a 5-cluster (`kdf-arena`, `quantum-vault-kpqc`, `mpcith-sign`, `iron-letter`,
`lattice-fault`, `nonce-lattice`, `paillier-gate`, `x3dh-wire`, `blind-oracle`). Criteria
briefed to every scoring agent: does the learner do something and does the page compute a real
consequence; on-ramp; depth on demand; does it show failure; honesty about toy parameters and
scope; does the interaction teach the concept or decorate it.

One structural finding from batch 3 is worth keeping: the prior scorecard is **one remediation
pass stale**. An agent proved it rather than asserting it — `git show 4cdff77:src/main.ts` in
`opaque-gate` still contains the exact artifacts the prior review criticizes (`hunter2`, the
single Login button, "~100M hash ops"), all deleted 2026-07-12/13, before the review file's own
date. That is why `opaque-gate` moved 4 to 8 and `x3dh-wire` moved 5 to 9.
