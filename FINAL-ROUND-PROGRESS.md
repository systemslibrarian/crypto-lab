# Final round — 47 src-touching campaign PRs + CodeQL REAL alerts

Started 2026-10-29. One repo at a time, alphabetical. Campaign PRs are audited as an
independent reviewer: their descriptions are claims, not proof.

Legend: `pending` / `done`. Campaign verdicts: SOUND / FIXABLE / WRONG / SUPERSEDED.

| # | repo | campaign PR | REAL alerts | status | outcome |
|---:|---|---|---:|---|---|
| 1 | TruePad | #51 | 0 | deferred | OWNER CALL — product rename, not a crypto-lab repo. Audited: diff is 880 lines, 803 are the rename, rest is storage-origin guidance; wordlist change is a comment only, no crypto behaviour touched. Branch is 54 commits behind master, CONFLICTING, checks stale/red. Triage flagged it an owner decision; left open. |
| 2 | crypto-lab-ablation-wire | — | 11 | done | ONE-OFF: MSRV 1.85→1.87 + ctutils 0.4.4 clears RUSTSEC-2026-0385 (PR #26, merged 5e6c1085). Vendor removal TESTED and REVERTED: E0133 persists on 1.87, so the patch was never a 1.85 artefact; README+doc corrected to say so. CodeQL: 12 permissions alerts FIXED by a top-level contents:read (02f6640c); 13 dismissed used-in-tests, 5 won't-fix (1 disclosed injected nonce, 4 zero-buffers overwritten). 0 open. |
| 3 | crypto-lab-aes-anatomy | — | 1 | done | CodeQL 1 REAL js/xss-through-dom FIXED (cbce3ca5): two selects were 'as' casts with no runtime check flowing into innerHTML. Proved it: crafted option injected an <img> into #result-9 on the old code (CSP blocked only the handler); nothing lands now. Runtime guard against the page's own option lists. 56 tests, tsc, gate pass. Alert state: fixed. No campaign PR. |
| 4 | crypto-lab-aes-modes | — | 2 | done | CodeQL 2 REAL js/xss-through-dom FIXED via PR #30 (752b3ede): glossary tip and quiz verdict rebuilt with createElement+textContent. Rendering compared byte-for-byte against main — identical. 90 tests, tsc, gate pass. No campaign PR. Branch deleted both sides. |
| 5 | crypto-lab-blind-oracle-api | — | 2 | done | CodeQL 2 REAL actions/missing-workflow-permissions FIXED via PR #7 (131afc9c): top-level contents:read; build-and-test only builds and docker has push:false, so neither needs more. dependabot-auto-merge keeps its own block. Re-verified: 2 fixed, 0 open. No campaign PR. Branch deleted both sides. |
| 6 | crypto-lab-compression-leak | #6 | 0 | done | PR #6 SOUND, merged 3adb972 (merge commit). Verified the central claim from the PRIMARY SOURCE, not the body: NIST aes_gcm.pdf GCM-AES256 Example #1 really is K=FEFFE992..x2 / IV=CAFEBABE.. / empty P with Tag FD2CAA16 A5832E76 AA132C14 53EEDA7E, matching an independent recomputation byte for byte. The vector it REPLACED (530f8afb, all-zero key) is absent from that document, so the old README provenance was the unsupported claim and this corrects it. Mutation-proved in both directions: tagLength 128->96 in the production helper reddens the KAT on the branch and leaves it GREEN on main, which is the test-gap the PR exists to close; key length 256->128 and a one-byte tag edit each fail exactly one test. 7/7 tests, build, deploy green, live bundle sha256 identical to a build of the merge commit. 0 CodeQL alerts. |
| 7 | crypto-lab-curve-lens | — | 3 | done | CodeQL 3 REAL (js/xss, js/xss-through-dom, js/xss-through-exception) all on one sink, root.innerHTML = buildAppMarkup(state). FIXED ed2a978; all 3 now state=fixed, 0 open. Proved exploitable first: ?rs= goes from URL to the scalar input's value attribute unvalidated, and ?rs="><img src=x data-injected=yes> put 2 live <img data-injected> elements in the built page and ate the input's spellcheck attribute. After: 0 injected on 3 payload shapes, trailing attribute intact, value renders as literal text. Exception sink escaped defensively and SAID SO - all 4 realcurve.ts throw sites build static sentences, so that path was not exploitable today. Render identity measured against the lab's own noise floor (it re-randomises its demo point and ECDH keys per load): same build twice = 290 differing folded lines, main vs fix = 290, scalar input byte-identical across 5 URL states. Added 4 regression tests; removing the escape fails them. 81 unit, 21 browser/axe, lint, build, CI, Pages green. Live bundle sha256 identical and carries the escaping. No campaign PR. |
| 8 | crypto-lab-curve448 | — | 1 | pending | |
| 9 | crypto-lab-dilithium-reject | — | 5 | pending | |
| 10 | crypto-lab-factor-forge | — | 1 | pending | |
| 11 | crypto-lab-falcon-seal | — | 1 | pending | |
| 12 | crypto-lab-feistel-forge | — | 2 | pending | |
| 13 | crypto-lab-harvest-timeline | — | 8 | pending | |
| 14 | crypto-lab-harvest-vault | #21 | 0 | pending | |
| 15 | crypto-lab-hash-zoo | — | 1 | pending | |
| 16 | crypto-lab-hqc-vault | — | 1 | pending | |
| 17 | crypto-lab-ibe-gate | — | 2 | pending | |
| 18 | crypto-lab-icy-dvrf | — | 1 | pending | |
| 19 | crypto-lab-isogeny-gate | — | 2 | pending | |
| 20 | crypto-lab-j-uniward | — | 2 | pending | |
| 21 | crypto-lab-key-exchange | — | 1 | pending | |
| 22 | crypto-lab-lfsr-forge | — | 1 | pending | |
| 23 | crypto-lab-lll-break | — | 1 | pending | |
| 24 | crypto-lab-mac-race | — | 1 | pending | |
| 25 | crypto-lab-matsui-line | #25 | 0 | pending | |
| 26 | crypto-lab-model-breach | — | 1 | pending | |
| 27 | crypto-lab-multivariate | — | 1 | pending | |
| 28 | crypto-lab-noise-to-numbers | — | 4 | pending | |
| 29 | crypto-lab-nonce-lattice | #27 | 0 | pending | |
| 30 | crypto-lab-ntru-classic | #24 | 0 | pending | |
| 31 | crypto-lab-opaque-gate | #34 | 0 | pending | |
| 32 | crypto-lab-order-leak | #14 | 1 | pending | |
| 33 | crypto-lab-ot-gate | #26 | 1 | pending | |
| 34 | crypto-lab-otp-vault | #26 | 0 | pending | |
| 35 | crypto-lab-padding-oracle | #23 | 0 | pending | |
| 36 | crypto-lab-paillier-gate | #25 | 1 | pending | |
| 37 | crypto-lab-pairing-gate | #22 | 0 | pending | |
| 38 | crypto-lab-pake-gate | #45 | 1 | pending | |
| 39 | crypto-lab-patron-shield | #20 | 0 | pending | |
| 40 | crypto-lab-point-ledger | #21 | 0 | pending | |
| 41 | crypto-lab-poly1305-mac | #27 | 0 | pending | |
| 42 | crypto-lab-power-trace | — | 1 | pending | |
| 43 | crypto-lab-pq-families | — | 1 | pending | |
| 44 | crypto-lab-pq-rotation | #24 | 1 | pending | |
| 45 | crypto-lab-pq-tls-handshake | #26 | 0 | pending | |
| 46 | crypto-lab-pqxdh-wire | #12 | 0 | pending | |
| 47 | crypto-lab-privacy-pass | #17 | 0 | pending | |
| 48 | crypto-lab-protocol-compose | #23 | 2 | pending | |
| 49 | crypto-lab-psi-gate | #28 | 2 | pending | |
| 50 | crypto-lab-quantum-entropy | #23 | 0 | pending | |
| 51 | crypto-lab-quantum-vault-kpqc | — | 2 | pending | |
| 52 | crypto-lab-reshare-circle | #23 | 0 | pending | |
| 53 | crypto-lab-return-path | #8 | 0 | pending | |
| 54 | crypto-lab-ring-sign | #24 | 1 | pending | |
| 55 | crypto-lab-rsa-educational | #23 | 0 | pending | |
| 56 | crypto-lab-rsa-forge | #25 | 0 | pending | |
| 57 | crypto-lab-sat-break | #6 | 0 | pending | |
| 58 | crypto-lab-schnorr-forge | #25 | 0 | pending | |
| 59 | crypto-lab-shelf-oracle | #13 | 0 | pending | |
| 60 | crypto-lab-sm9-forge | #10 | 0 | pending | |
| 61 | crypto-lab-split-point | #13 | 0 | pending | |
| 62 | crypto-lab-subliminal-channels | #6 | 0 | pending | |
| 63 | crypto-lab-syndrome-drain | #26 | 0 | pending | |
| 64 | crypto-lab-tc26-pair | #10 | 0 | pending | |
| 65 | crypto-lab-threshold-decrypt | #21 | 0 | pending | |
| 66 | crypto-lab-timing-oracle | — | 1 | pending | |
| 67 | crypto-lab-timing-sidechannel | #26 | 0 | pending | |
| 68 | crypto-lab-token-tell | #25 | 1 | pending | |
| 69 | crypto-lab-traitor-trace | — | 1 | pending | |
| 70 | crypto-lab-vdf | #23 | 0 | pending | |
| 71 | crypto-lab-vector-gate | — | 1 | pending | |
| 72 | crypto-lab-vigenere-break | #29 | 0 | pending | |
| 73 | crypto-lab-vrf-gate | #22 | 0 | pending | |
| 74 | crypto-lab-web-of-trust | #21 | 1 | pending | |
| 75 | crypto-lab-webauthn | #25 | 0 | pending | |
| 76 | crypto-lab-what-is-pqc | #3 | 0 | pending | |
| 77 | crypto-lab-world-ciphers | #26 | 1 | pending | |
| 78 | crypto-lab-zk-proof-lab | — | 3 | pending | |

## Notes

## Branch hygiene

The rule for this round: every branch I create is deleted when its PR merges, so
when the round is done no branch of mine exists anywhere. `gh pr merge
--delete-branch` does the remote side; the local copy is removed too.

Verified 2026-11-01 across all 254 repositories: **0 branches of mine survive**,
local or remote. The check is one script — it looks for the prefixes this
session uses (`a11y/`, `msrv/`, and any `*work` throwaway) and exits non-zero if
it finds one.

What else exists is NOT mine to delete, and the counts are recorded so a later
reader does not mistake them for leftovers:

| owner | remote branches | can I delete them |
|---|---:|---|
| `codex/*` | 74 | no — another lane's live work |
| unowned (`fix/`, `repair/`, `research-review-`, `ebook-research-`, ...) | 73 | no — 67 still hold commits main lacks |
| `dependabot/*` | 50 | no — Dependabot deletes its own on merge |
| `chatgpt/*` | 3 | no — another lane |

Cleaned up on the way through, because these provably held nothing:

- **8 remote branches** fully contained in `main` with no open PR. Seven were
  leftovers from PRs that had already merged without deleting their branch
  (aes-anatomy #1, aes-modes #27 and #22, clock-arithmetic #1, dead-sea-cipher
  #12, quantum-vault-kpqc #8, silent-tally #26); the eighth,
  `crypto-lab draft/understanding-cryptography-2e`, had no PR at all.
- **138 local branches** in the clones, all ancestors of `origin/main`. The
  remaining 113 local branches hold commits `main` does not have and were left
  alone.

All 253 clones were fetched and fast-forwarded first, which is what let the
local sweep tell "already on main" apart from "not merged yet": `git branch -d`
compares against the current HEAD, so a stale local `main` refuses deletions
that are perfectly safe. 22 refusals turned into deletions after the fetch.

