# Owner lab PR campaign — triage, 2026-10-28

Read-only. Nothing here was merged, closed, rebased or commented on. Measured against
each lab's own `origin/main` and hub `main` `df78da23` on 2026-10-28.

**Scope.** The 64 owner-authored pull requests open across `crypto-lab-*` and `TruePad`
when this round began. Two left the set during the round and are recorded at the end.
**62 remain open.**

They are one campaign, not a backlog: **59 of the 64 were opened on 2026-10-22 or 10-23**.
The verbs cluster — 21 *Harden*, 7 *Retire*, 7 *Repair*, 5 *Pin*, 3 *Fix*, 2 *Restore*,
2 *Fail closed*, 2 *Cross-check* — and the bodies read as a security-evidence sweep.

## Counts by recommendation

| Recommendation | Count |
|---|---|
| Needs review — changes a displayed claim or recorded evidence | 42 |
| Rebase then needs review — same, but will not apply as-is | 5 |
| Merge after a watched gate — tests, tooling or docs only | 13 |
| Close as superseded | 2 |
| **Already resolved during this round** | **2 (merged)** |

**The single most useful fact for deciding Q8:** 47 of the 62 touch `src/`. In this fleet
`src/` is where displayed claims live, so those 47 cannot be a batch merge. The 13 that
touch only tests, workflows or prose can be, and they are listed first because they are
the part an agent can finish without a judgement call.

---

## Group 1 — Merge after a watched gate (13)

Touch no file under `src/`. No displayed claim can move, so the risk is confined to CI
and prose. Each still needs its gate watched to completion and its deploy verified, the
way the audit-fix round was done; none needs a human to re-read a claim.

| Lab | PR | Touches | Purpose |
|---|---|---|---|
| adaptor-gate | #8 | ci | Complete the Vite security update |
| dilithium-reject | #22 | other | Patch brace-expansion advisory ranges |
| fold-gate | #22 | docs | Record DAYBREAK audit authorization |
| hybrid-wire | #17 | test | Cross-check the combiner against Noble HKDF |
| privacy-pass | #15 | docs | Record DAYBREAK audit authorization |
| pulse-chain | #5 | docs, ci | Harden publishing, correct test-port evidence |
| quantum-vault-kpqc | #21 | test, docs, ci | Restore security evidence and fail-closed boundaries |
| ratchet-wire | #17 | test, docs, ci | Harden protocol and Pages gate |
| rsa-small-roots | #3 | test, docs, ci | Refresh evidence counts, harden Pages publishing |
| simon-period | #25 | test, docs, ci | Harden publish workflow controls |
| sleeve-check | #9 | test, ci | Harden publish workflow controls |
| sm2-forge | #9 | test, ci | Fix axe 4.14 label mismatch, harden Pages deploy |
| syndrome-hints | #23 | test, docs, ci | Restore publish provenance |

Two caveats before batching these. `quantum-vault-kpqc` is the fleet's one deliberate
light-theme lab, so anything touching its gate deserves a look at the theme assertion.
`fold-gate` #22 and `privacy-pass` #15 are the two oldest in the whole set (2026-10-11)
and are identical in kind, so they can be decided once.

## Group 2 — Close as superseded (2)

Both are "Pin dark theme in the head script", and both labs already pin it on `main`.
Three independent confirmations: each lab's `index.html` opens `data-theme="dark"`, each
main carries the commit that did it, and hub `theme-sync check` passes fleet-wide
("Every lab pins one theme, and none ships a toggle"). Both also now conflict, because
the file they would edit has moved.

| Lab | PR | Superseded by |
|---|---|---|
| aes-anatomy | #2 | `61be376` "Use the canonical pinned-dark-theme marker (#7)" |
| clock-arithmetic | #2 | `b97b515` "Pin the dark theme with the fleet contract (#4)" |

## Group 3 — Rebase then needs review (5)

Conflict with their lab's current `main`. Three conflict because of merges made during
this round, so a rebase is mechanical; the review that follows is not, because all five
touch `src/` except where noted.

| Lab | PR | Purpose | Why it conflicts |
|---|---|---|---|
| matsui-line | #25 | Harden inputs and delivery gates (26 files) | today's #28 merge (`11381fec`) moved the same files |
| pq-rotation | #24 | Fail closed across rotation boundaries (10 files) | drifted since 2026-10-23 |
| compression-leak | #6 | Pin the production AES-GCM path to a NIST example | drifted |
| sm9-forge | #10 | Retire stale SM9 evidence and harden publishing | drifted |
| TruePad | #51 | Rename the browser app to VerityPad | drifted; not a `crypto-lab-*` repo, and a product rename is an owner call on its own |

## Group 4 — Needs review (42)

Each changes a displayed claim, recorded evidence, or real cryptographic source, and each
applies cleanly today. They are mergeable, but "mergeable" is not "reviewed": this is the
category the encyclopedia audit existed to check, and the same discipline applies — read
the claim against the code, watch the gate, verify the served bytes, then re-pin the hub
once at the end.

otp-vault #26 · ring-sign #24 · webauthn #25 · nonce-lattice #27 · ntru-classic #24 ·
opaque-gate #34 · order-leak #14 · ot-gate #26 · padding-oracle #23 · paillier-gate #25 ·
pairing-gate #22 · pake-gate #45 · patron-shield #20 · point-ledger #21 · poly1305-mac #27 ·
pq-tls-handshake #26 · pqxdh-wire #12 · privacy-pass #17 · protocol-compose #23 ·
psi-gate #28 · quantum-entropy #23 · reshare-circle #23 · return-path #8 ·
rsa-educational #23 · rsa-forge #25 · sat-break #6 · schnorr-forge #25 · shelf-oracle #13 ·
split-point #13 · subliminal-channels #6 · syndrome-drain #26 · tc26-pair #10 ·
threshold-decrypt #21 · timing-sidechannel #26 · token-tell #25 · vdf #23 ·
vigenere-break #29 · vrf-gate #22 · web-of-trust #21 · what-is-pqc #3 ·
world-ciphers #26 · harvest-vault #21

Three worth pulling out of the list:

- **sat-break #6, "Add cube-sum superpoly exhibit."** This is the other half of the
  retarget the owner rejected today: LFSR Forge #7 and hub #343 were closed because the
  cube lesson stays in LFSR Forge. Merging this would put a second cube-sum exhibit in
  SAT Break and reopen the question by the back door. **Recommend closing it with the
  same reasoning**, but it is the owner's call because it was not named in that decision.
- **shelf-oracle #13, "Cross-check ChaCha20 independently."** Mergeable and clean, and
  the lab merged a different PR today (`b0e9475a`) without conflict.
- **pake-gate #45** sits in the same repo as the held `globals` bump #43; whichever lands
  first will move the other's lockfile.

---

## Already resolved during this round (2)

| Lab | PR | Outcome |
|---|---|---|
| time-lock-puzzle | #24 | **merged** `badafbde` |
| timing-oracle | #31 | **merged** `8e2264e9` |

Both were "test: locate npm CLI portably", the same fix merged today into Envelope KMS,
LLL Break and MAC Race. They were candidates to close as superseded, and the check that
decided it was running their own control on their own `main`: both reported **0 pass,
2 fail**, with `process.execPath`-derived `npm-cli.js` missing under Homebrew. The fix was
absent, not duplicated, so they were merged instead of closed.

---

## How to read "needs review" here

None of the 42 is suspected of being wrong. The point is narrower: a PR that edits a
claim the page displays cannot be merged on a green check, because the check tests whether
the page is consistent, not whether the sentence is true. That distinction is the whole
subject of `ENCYCLOPEDIA-AUDIT-2026-10-27.md`, and the campaign is large enough that
merging it unreviewed would undo the thing that audit established.

A workable order, if Q8 comes back "land them": Group 1 as one batch, Group 2 closed,
Group 3 rebased and then queued into Group 4, and Group 4 one lab at a time with the hub
re-pinned once at the end rather than 42 times.
