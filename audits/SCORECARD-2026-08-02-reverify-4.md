# Re-verify pass 4 — 2026-08-02

Re-verification of 14 recovered scores from SCORECARD-2026-08-01.md against fetched current
source, built output, and Playwright-driven behavior. Read-only over the demo repos.

Assigned demos: search-vault, shadow-vault, silent-tally, snark-arena, spake-gate,
sphincs-ledger, ssh-handshake, stark-tower, vrf-gate, web-of-trust, webauthn, world-hashes,
x3dh-wire, zk-arena.

| demo | HEAD | prior | current | what changed |
|---|---|--:|--:|---|
| search-vault | 3bec966 | 9 | 9 | Prior stands. 78/78 unit tests pass; Playwright run confirms the leakage-abuse attack is computed live (14/14 recovered at exact knowledge), the "actually" scoring column is post-hoc as claimed, and the knowledge-error slider genuinely degrades recovery (100% -> 86% -> 29%). Commit 37b816f since scoring hardened unknown-query handling. |

- search-vault remaining gaps: Exhibit 3 (pattern-only visualization) is mostly display; the SSE/ORAM/FHE comparison table mixes one measured number (50 timed searches) with asserted literature costs. Not enough interactive falsification of the comparison exhibit to call it claim-complete.

| shadow-vault | 00f6027 | 6 | 8 | Up. The prior 6's named defects are fixed: 79f9603 documented the global-constant salt and softened the two undetectability claims on-page; 00f6027 put deniability limits ("format-aware adversary knows a second slot exists") and Argon2id creation parameters into the UI, not just .md files. Playwright run: full round trip with a real downloaded container — decoy passphrase decrypts the decoy, real passphrase decrypts the real message, wrong passphrase honestly reports "No message found"; the coercion scenario performs real decryptions of the learner's own messages; attacker/holder container-map toggle works. |

- shadow-vault remaining gaps: "attacker sees uniform noise" is shown as an animation, not a computed statistical comparison against true randomness; no learner-mounted attack (e.g., brute-forcing a weak decoy passphrase to confirm a slot) even though the page states that caveat; entropy meter is an estimate.

| silent-tally | d1507f2 | 7 | 8 | Up. The exact defect that cost the point is fixed: f94b1b6 ("Exhibit 6: compute the coalition attack instead of asserting it") replaced the coalitionArr.length verdict with attackSucceeded read off a real wasm lagrange_interpolate over the coalition's actual shares. Playwright confirms: 1 and 2 colluders reconstruct wrong field-sized values (e.g. 14445048432114572 vs real 983), 3 colluders recover the victim's count exactly (761 = 761). 18/18 unit tests pass. |

- silent-tally remaining gaps: still a guided six-step walkthrough — the learner locks in counts and watches, but never chooses inputs adversarially outside Exhibit 6; the "omniscient view" line is the only place the true secret appears, which is honest but means the sub-threshold "belief unchanged" claim rests on prose rather than a demonstration over multiple candidate secrets.
