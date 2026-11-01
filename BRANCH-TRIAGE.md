# Unowned remote branch triage — 2026-11-01

Read-only. **Nothing in this list was deleted, merged, closed or pushed.**

The 65 remote branches across the fleet that belong to no lane prefix: not
`codex/`, not `claude/`, not `chatgpt/`, not `dependabot/`. They are what is left
once those four owners are accounted for, and every one of them still holds at
least one commit `main` does not have.

`ahead` counts commits on the branch that `main` lacks; `behind` counts how far
the branch has fallen behind `main`. A branch with a MERGED PR and a non-zero
`ahead` is the shape worth noticing: its pull request landed, usually squashed,
and these commits are the pre-squash originals rather than unlanded work.

**All 65 are authored by the owner's own addresses** (`systemslibrarian@gmail.com` or `paul@systemslibrarian.dev`), so the flag column is
uniformly yes and carries no signal here. It is kept because the question was asked,
and because its uniformity is itself the answer: none of these came from a third party.

## Shape of the list

| pull request state | branches | what it means |
|---|---:|---|
| MERGED | 60 | landed; the branch commits are the pre-squash originals |
| no PR | 2 | never proposed; the only copy of this work |
| OPEN | 1 | live proposal, do not touch |
| CLOSED | 2 | proposed and rejected; commits never landed |

## Every branch

| repo | branch | last commit | author | ahead | behind | PR | what the unique commits change | owner-authored |
|---|---|---|---|---:|---:|---|---|---|
| crypto-lab | `docs/encyclopedia-progress-20261023` | 2026-10-23 | Paul Clark <paul@systemslibrarian.dev> | 3 | 129 | no PR | Track live HIBE and AES DFA gate / Keep roadmap phase counts consistent / Mark AES DFA live and advance to SIFA | **yes** |
| crypto-lab-ablation-wire | `repair/secret-independence-typed-boundaries-20261013` | 2026-10-13 | Paul Clark <paul@systemslibrarian.dev> | 4 | 12 | #21 MERGED | fix: preserve secret typing through ML-KEM and X-Wing / ci: make secret-independence controls executable / ci: prefetch locked compiler controls | **yes** |
| crypto-lab-aes-anatomy | `ebook-research-20261026` | 2026-10-26 | Paul Clark <paul@systemslibrarian.dev> | 2 | 5 | #5 MERGED | Add wide-trail dispersion and oracle-only reduced-round integral lesson / Record all 47 semantic mutation kills and exact artifact restorations | **yes** |
| crypto-lab-aes-anatomy | `feat/aes-dfa-20261023` | 2026-10-23 | Paul Clark <paul@systemslibrarian.dev> | 20 | 7 | #3 MERGED | Add AES-128 DFA candidate recovery core / Add round-9 AES fault injection harness / Test AES DFA recovery and key-schedule inversion | **yes** |
| crypto-lab-aes-modes | `fix/gcm-forgery-explanation-20261009` | 2026-10-09 | Paul Clark <paul@systemslibrarian.dev> | 1 | 20 | #24 MERGED | Correct GCM forgery probability explanation using NIST Appendix B | **yes** |
| crypto-lab-babel-hash | `fix/dependabot-manifest-directory` | 2026-10-07 | Paul Clark <paul@systemslibrarian.dev> | 1 | 17 | #6 MERGED | fix: point Dependabot at the nested npm manifest | **yes** |
| crypto-lab-bcrypt-forge | `repair/five-year-review-20261012` | 2026-10-12 | Paul Clark <paul@systemslibrarian.dev> | 1 | 6 | #20 MERGED | Version NIST password guidance in the comparison | **yes** |
| crypto-lab-biham-lens | `ebook-research-20261026` | 2026-10-26 | Paul Clark <paul@systemslibrarian.dev> | 1 | 5 | #20 MERGED | Separate public differential modeling from instructor-only evidence | **yes** |
| crypto-lab-biham-lens | `fix/dependabot-manifest-directory` | 2026-10-07 | Paul Clark <paul@systemslibrarian.dev> | 1 | 27 | #7 MERGED | fix: point Dependabot at the nested npm manifest | **yes** |
| crypto-lab-biham-lens | `fix/present-audit-hardening` | 2026-10-21 | Paul Clark <paul@systemslibrarian.dev> | 1 | 6 | #18 MERGED | Harden PRESENT-80 claims, teaching UI, recovery verdicts, and mutation evidence | **yes** |
| crypto-lab-compression-leak | `build/compression-leak-v1` | 2026-10-17 | Paul Clark <paul@systemslibrarian.dev> | 7 | 6 | #1 MERGED | Implement crypto-lab-compression-leak browser Crypto Lab with real primitives and tests / Fix TypeScript BufferSource types at crypto API boundaries / | **yes** |
| crypto-lab-compression-leak | `chore/pin-dependency-tree` | 2026-10-17 | Paul Clark <paul@systemslibrarian.dev> | 4 | 5 | #3 MERGED | Generate exact dependency lockfile receipt on CI / Align dependency resolution with merged TypeScript 7 update / Pin npm dependency resolution under T | **yes** |
| crypto-lab-compression-leak | `fix/length-oracle-honesty` | 2026-10-17 | Paul Clark <paul@systemslibrarian.dev> | 2 | 3 | #4 MERGED | Do not infer length secrecy from a single ciphertext size / Do not infer length secrecy from a single ciphertext size | **yes** |
| crypto-lab-curve-lens | `repair/five-year-review-20261012` | 2026-10-12 | Paul Clark <paul@systemslibrarian.dev> | 1 | 7 | #28 MERGED | Report curve algorithms instead of invented ladder counts | **yes** |
| crypto-lab-dead-sea-cipher | `fix/dependabot-manifest-directory` | 2026-10-07 | Paul Clark <paul@systemslibrarian.dev> | 1 | 16 | #7 MERGED | fix: point Dependabot at the nested npm manifest | **yes** |
| crypto-lab-dilithium-reject | `fix/mldsa-iteration-references-20261016` | 2026-10-16 | Paul Clark <paul@systemslibrarian.dev> | 1 | 3 | #25 MERGED | Correct ML-DSA rejection-loop reference estimates and source notes | **yes** |
| crypto-lab-dilithium-reject | `repair/brace-expansion-review-20261009` | 2026-10-09 | Paul Clark <paul@systemslibrarian.dev> | 1 | 7 | #22 CLOSED | fix(deps): patch brace-expansion to 5.0.12 | **yes** |
| crypto-lab-dilithium-seal | `fix/research-watch-20261018` | 2026-10-18 | Paul Clark <paul@systemslibrarian.dev> | 1 | 5 | #43 MERGED | Explain revised MSIS estimates without changing ML-DSA security categories | **yes** |
| crypto-lab-dp-noise | `verification/dp-public-controls-20261012` | 2026-10-12 | Paul Clark <systemslibrarian@gmail.com> | 2 | 5 | no PR | Verify original DP browser fixtures against the public deployment / Require complete source-bound DP public verification evidence | **yes** |
| crypto-lab-drbg-arena | `research-review-2026-10-31` | 2026-10-31 | Paul Clark <paul@systemslibrarian.dev> | 4 | 1 | #26 MERGED | Compare signed monobit Q values with finite binomial calibration (R20261031-02) / test: independently check signed tails and application ordering / fi | **yes** |
| crypto-lab-envelope-kms | `ebook-research-20261026` | 2026-10-26 | Paul Clark <paul@systemslibrarian.dev> | 2 | 7 | #47 MERGED | Add trusted KWP length policy and qualify integrity claims / Apply repository formatting to key-wrap research documentation | **yes** |
| crypto-lab-envelope-kms | `feat/encyclopedia-key-handles-20261023` | 2026-10-23 | Paul Clark <paul@systemslibrarian.dev> | 4 | 10 | #43 MERGED | Teach stateful key-handle misuse with a real wrap-decrypt trace / Isolate mutation builds and record output cleanup evidence / Use the official Ubuntu | **yes** |
| crypto-lab-fhe-arena | `fix/noise-budget-rounding` | 2026-10-07 | Paul Clark <paul@systemslibrarian.dev> | 1 | 12 | #18 MERGED | fix: verify noise health against unrounded budget | **yes** |
| crypto-lab-fold-gate | `fix/brand-accessible-name` | 2026-10-28 | Paul Clark <systemslibrarian@gmail.com> | 1 | 5 | #27 OPEN | Let the brand link take its accessible name from its visible text | **yes** |
| crypto-lab-frodo-vault | `repair/five-year-review-20261012` | 2026-10-12 | Paul Clark <paul@systemslibrarian.dev> | 1 | 4 | #21 MERGED | Enforce eFrodoKEM few-ciphertext key-use policy | **yes** |
| crypto-lab-gg20-wallet | `repair/five-year-review-20261012` | 2026-10-12 | Paul Clark <paul@systemslibrarian.dev> | 1 | 4 | #20 MERGED | Correct GG20 range-proof acceptance claim | **yes** |
| crypto-lab-hostile-paths | `research-review-2026-10-31` | 2026-10-31 | Paul Clark <paul@systemslibrarian.dev> | 1 | 1 | #5 MERGED | Enumerate full public-helper views in a separate broken CRT scheme (R20261031-13) | **yes** |
| crypto-lab-hybrid-guide | `fix/research-watch-20261018` | 2026-10-18 | Paul Clark <paul@systemslibrarian.dev> | 2 | 5 | #23 MERGED | Clarify hybrid and pure-PQ TLS guidance and label future scenarios / Exercise timeline guidance through its year buttons | **yes** |
| crypto-lab-hybrid-pqc | `fix/book-lab-hybrid-evidence` | 2026-10-30 | Paul Clark <paul@systemslibrarian.dev> | 1 | 1 | #33 MERGED | Align hybrid experiment claims with observed attack outcomes | **yes** |
| crypto-lab-hybrid-pqc | `repair/five-year-review-20261012` | 2026-10-12 | Paul Clark <paul@systemslibrarian.dev> | 1 | 7 | #28 MERGED | Update final NIST KEM and RFC publication references | **yes** |
| crypto-lab-hybrid-wire | `repair/five-year-review-20261012` | 2026-10-12 | Paul Clark <paul@systemslibrarian.dev> | 1 | 7 | #15 MERGED | Separate Chrome draft Kyber and ML-KEM deployment history | **yes** |
| crypto-lab-ibe-gate | `feat/hibe-delegation-20261023` | 2026-10-23 | Paul Clark <paul@systemslibrarian.dev> | 12 | 7 | #24 MERGED | Add bounded asymmetric HIBE delegation core / Test HIBE delegation and subtree boundaries / Make sibling HIBE failure cryptographic | **yes** |
| crypto-lab-iron-serpent | `fix/dependabot-manifest-directory` | 2026-10-07 | Paul Clark <paul@systemslibrarian.dev> | 1 | 17 | #3 MERGED | fix: point Dependabot at the nested npm manifest | **yes** |
| crypto-lab-isogeny-atlas | `repair/five-year-review-20261012` | 2026-10-12 | Paul Clark <paul@systemslibrarian.dev> | 1 | 7 | #22 MERGED | Qualify isogeny complexity and endpoint-ring claims | **yes** |
| crypto-lab-key-lifecycle | `build/key-lifecycle-v1` | 2026-10-17 | Paul Clark <paul@systemslibrarian.dev> | 6 | 7 | #1 MERGED | Implement Key Lifecycle teaching lab with real AES-GCM and tests / Fix TypeScript BufferSource types at crypto API boundaries / Keep plaintext unchang | **yes** |
| crypto-lab-key-lifecycle | `chore/pin-dependency-tree` | 2026-10-17 | Paul Clark <paul@systemslibrarian.dev> | 4 | 6 | #3 MERGED | Generate exact dependency lockfile receipt on CI / Align dependency resolution with merged TypeScript 7 update / Pin npm dependency resolution under T | **yes** |
| crypto-lab-key-lifecycle | `feat/guided-key-lifecycle` | 2026-10-18 | Paul Clark <paul@systemslibrarian.dev> | 1 | 2 | #6 MERGED | Add a guided key-management lifecycle | **yes** |
| crypto-lab-key-lifecycle | `fix/credible-tamper-check` | 2026-10-17 | Paul Clark <paul@systemslibrarian.dev> | 3 | 4 | #4 MERGED | Fail closed when authentication cannot be tested / Fail closed when authentication cannot be tested / Fail closed when authentication cannot be tested | **yes** |
| crypto-lab-lattice-builder | `work/lattice-game-learning-bridge-20261017` | 2026-10-17 | Paul Clark <paul@systemslibrarian.dev> | 1 | 4 | #17 MERGED | Connect Beacon Run to lattice labs and Basis Match | **yes** |
| crypto-lab-lattice-fault | `ebook-research-20261026` | 2026-10-26 | Paul Clark <paul@systemslibrarian.dev> | 1 | 4 | #27 MERGED | Explain physical ML-DSA secret-key-unpacking leakage | **yes** |
| crypto-lab-lattice-fault | `fix/mldsa-iteration-references-20261016` | 2026-10-16 | Paul Clark <paul@systemslibrarian.dev> | 1 | 6 | #25 MERGED | Separate corrected ML-DSA signing estimates from fault-injection cost | **yes** |
| crypto-lab-lms-ledger | `ebook-research-20261026` | 2026-10-26 | Paul Clark <paul@systemslibrarian.dev> | 2 | 3 | #23 MERGED | Qualify LMS hash-construction and aggregate-use security claims / Underline research links for accessible inline distinction | **yes** |
| crypto-lab-lms-xmss | `ebook-research-20261026` | 2026-10-26 | Paul Clark <paul@systemslibrarian.dev> | 1 | 4 | #27 MERGED | Qualify stateful-signature selection with concrete hash limits | **yes** |
| crypto-lab-mls-group | `research-review-2026-10-31` | 2026-10-31 | Paul Clark <paul@systemslibrarian.dev> | 3 | 1 | #30 MERGED | Separate recipient application consistency from epoch key convergence (R20261031-03) / test: independently check signed tails and application ordering | **yes** |
| crypto-lab-multivariate | `research-review-2026-10-31` | 2026-10-31 | Paul Clark <paul@systemslibrarian.dev> | 3 | 1 | #23 MERGED | Account for UOV precomputation costs and one-use state (R20261031-12) / fix: apply existing accessible controls and update panel coverage / fix: apply | **yes** |
| crypto-lab-nonce-guard | `fix/book-nonce-misuse-language` | 2026-10-30 | Paul Clark <paul@systemslibrarian.dev> | 2 | 1 | #24 MERGED | Align nonce-misuse explanations with the experiment's actual scope / Follow the scoped SIV badge in the existing accessibility driver | **yes** |
| crypto-lab-ot-gate | `feat/andos-history` | 2026-10-18 | Paul Clark <paul@systemslibrarian.dev> | 1 | 8 | #23 MERGED | Add an ANDOS private-choice lesson to OT Gate | **yes** |
| crypto-lab-pq-families | `fix/research-watch-20261018` | 2026-10-18 | Paul Clark <paul@systemslibrarian.dev> | 1 | 9 | #25 MERGED | Explain revised MSIS estimates without changing ML-DSA security categories | **yes** |
| crypto-lab-quantum-entropy | `research-review-2026-10-31` | 2026-10-31 | Paul Clark <paul@systemslibrarian.dev> | 1 | 1 | #25 MERGED | docs: correct leftover-hash vacuity boundary (R20261031-01) | **yes** |
| crypto-lab-ratchet-wire | `fix/dependabot-manifest-directory` | 2026-10-07 | Paul Clark <paul@systemslibrarian.dev> | 1 | 26 | #7 MERGED | fix: point Dependabot at the nested npm manifest | **yes** |
| crypto-lab-rsa-small-roots | `repair/unit-count-gate-20261009` | 2026-10-09 | Paul Clark <systemslibrarian@gmail.com> | 1 | 13 | #1 CLOSED | Keep the nonzero unit gate readable without ANSI colors | **yes** |
| crypto-lab-salamander | `research-review-2026-10-31` | 2026-10-31 | Paul Clark <paul@systemslibrarian.dev> | 2 | 1 | #33 MERGED | Separate AEAD context, leakage and fault evidence (R20261031-11) / fix: apply existing accessible controls and update panel coverage | **yes** |
| crypto-lab-search-vault | `feat/query-result-integrity-20261023` | 2026-10-23 | Paul Clark <paul@systemslibrarian.dev> | 9 | 9 | #24 MERGED | Add query-result integrity checkpoint model / Test query completeness and freshness cases / Wire integrity checkpoints into app state | **yes** |
| crypto-lab-shamir-gate | `fix/dependabot-manifest-directory` | 2026-10-07 | Paul Clark <paul@systemslibrarian.dev> | 1 | 24 | #8 MERGED | fix: point Dependabot at the nested npm manifest | **yes** |
| crypto-lab-shelf-oracle | `docs/encyclopedia-pir-scope-20261023` | 2026-10-23 | Paul Clark <paul@systemslibrarian.dev> | 1 | 7 | #14 MERGED | Clarify direct-scan PIR scope and preprocessing tradeoffs | **yes** |
| crypto-lab-snark-arena | `research-review-2026-10-31` | 2026-10-31 | Paul Clark <paul@systemslibrarian.dev> | 1 | 1 | #27 MERGED | Add semantic proof-outcome and ineffective-mutation controls (R20261031-09) | **yes** |
| crypto-lab-sphincs-ledger | `fix/dependabot-manifest-directory` | 2026-10-07 | Paul Clark <paul@systemslibrarian.dev> | 1 | 16 | #6 MERGED | fix: point Dependabot at the nested npm manifest | **yes** |
| crypto-lab-sphinx-mix | `repair/five-year-review-20261012` | 2026-10-12 | Paul Clark <paul@systemslibrarian.dev> | 1 | 4 | #12 MERGED | Separate Sphinx diffusion diagnostics from unlinkability | **yes** |
| crypto-lab-subliminal-channels | `build/subliminal-channels-v1` | 2026-10-17 | Paul Clark <paul@systemslibrarian.dev> | 3 | 6 | #1 MERGED | Implement crypto-lab-subliminal-channels browser Crypto Lab with real primitives and tests / Fix TypeScript BufferSource types at crypto API boundarie | **yes** |
| crypto-lab-subliminal-channels | `chore/pin-dependency-tree` | 2026-10-17 | Paul Clark <paul@systemslibrarian.dev> | 3 | 4 | #3 MERGED | Generate exact dependency lockfile receipt on CI / Pin npm resolution from passing TypeScript 7 CI / Use pinned npm ci without temporary dependency re | **yes** |
| crypto-lab-subliminal-channels | `fix/deterministic-verdict` | 2026-10-17 | Paul Clark <paul@systemslibrarian.dev> | 2 | 3 | #4 MERGED | Distinguish deterministic signing from signaling risk in verdict / Distinguish deterministic signing from signaling risk in verdict | **yes** |
| crypto-lab-timing-oracle | `repair/five-year-review-20261012` | 2026-10-12 | Paul Clark <paul@systemslibrarian.dev> | 1 | 7 | #28 MERGED | Scope timing chart captions to observed measurements | **yes** |
| crypto-lab-timing-sidechannel | `repair/five-year-review-20261012` | 2026-10-12 | Paul Clark <paul@systemslibrarian.dev> | 1 | 5 | #23 MERGED | Make incomplete timing recoveries inconclusive | **yes** |
| crypto-lab-vector-gate | `research-review-2026-10-31` | 2026-10-31 | Paul Clark <paul@systemslibrarian.dev> | 1 | 1 | #11 MERGED | Scope the Jasmin ML-KEM compiler preservation result (R20261031-08) | **yes** |
| crypto-lab-x3dh-wire | `repair/five-year-review-20261012` | 2026-10-12 | Paul Clark <paul@systemslibrarian.dev> | 2 | 6 | #27 MERGED | Date X3DH's role and Signal's post-quantum successors / Keep research-history links readable on tinted mobile backgrounds | **yes** |

## What this is for

The round's branch sweep deleted only branches that were provably empty: fully
contained in `main` with no open pull request. Every branch above fails that
test, so none was touched and none should be deleted on the strength of this
table alone. The `no PR` rows are the ones to read first, since for those the
branch is the only copy.
