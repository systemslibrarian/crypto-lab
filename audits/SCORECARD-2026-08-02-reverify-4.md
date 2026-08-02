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
