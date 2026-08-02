# Triage — 2026-08-02 — batch 2 (icy-dvrf, lattice-gentle, protocol-checker, schnorr-forge, spdz-forge)

Verdicts: DONE (already implemented since audit), STALE (premise no longer true),
STILL-APPLICABLE (verified against current source; action = implemented or PROPOSED).

## audits/icy-dvrf.md → crypto-lab-icy-dvrf

Audit dated 2026-07-20. Commit `b203acd` ("Close the gold-standard gaps from external
review", 2026-07-20) plus the 2026-08-01 accessibility/citation series (`26535e0`..`24dbcdc`)
addressed the audit nearly in full. Gates re-verified 2026-08-02: 89/89 vitest,
build clean, 10/10 Playwright (a11y both themes + 8 UI regression tests).

| Item | Verdict | Evidence | Action |
| --- | --- | --- | --- |
| 01 Pin protocol identity / construction map | DONE | `docs/CONSTRUCTION.md` (143 lines) maps phases, transcripts, encodings, deviations; hero says "Icy-DVRF-inspired" (index.html:173); golden transcript vectors in `src/dvrf/golden.test.ts` pin suite `crypto-lab-icy-dvrf:v1:ristretto255-SHA512`; citations corrected in `05229b6` | none |
| 02 Uniqueness vs liveness/bias story | DONE | Four properties taught separately; withhold-round-2 selective-abort cheat with honest-rerun byte-for-byte comparison (src/main.ts:727-780, e2e ui.spec.ts:81); retry rule stated beside no-bias claims | none |
| 03 Independent public verification | DONE | Canonical JSON envelope + strict fail-closed parser (`src/dvrf/envelope.ts`, 90-line test file); export box + stateless verifier workbench (index.html:358); cross-context verify + one-bit tamper rejection tested (ui.spec.ts:95) | none |
| 04 Nonce batch visible/immutable | DONE | Numbered batches with queued→spent lifecycle; transcript names its batch (ui.spec.ts:40) | none |
| 05 UI state machine / control locking | DONE | Upstream controls lock during walk (ui.spec.ts:22); new ceremony atomically invalidates descendants; stale n/t flagged (ui.spec.ts:52); cheat cast limited to roster (ui.spec.ts:61); "honest threshold" wording | none |
| 06 a11y gate reliability | DONE | playwright.config.ts test timeout 120s, sleeps removed (b203acd); `npm run test:a11y` green 2026-08-02 | none |
| 07 Mobile horizontal overflow | DONE | border-box + shrinkable selects (b203acd), cl-hero mobile layout fix (`26535e0`); overflow asserted at 390/320px (ui.spec.ts:124), passing | none |
| 08 Quantify/source the comparison | DONE | `PROOF_BYTES` (128 B) displayed as constant-in-t (src/main.ts:361,439); ladder states synchronous-broadcast comparison basis with sources in construction map (index.html:291-294); citations fixed in `05229b6` | none |
| 09 UI regression tests + zero-scalar rejection | DONE | 8 Playwright UI tests covering exactly the audit's list; zero scalar rejected and resampled (src/dvrf/group.ts:42-44) | none |
| 10 Portable/reproducible result | DONE (partial residue) | Envelope carries construction ID/suite; `engines: node>=22` declared; residue: GH Actions pinned by tag not SHA, no full replay-transcript mode / app-commit fingerprint | PROPOSED: pin third-party actions by commit SHA; optional transcript replay mode |
