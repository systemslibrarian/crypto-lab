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

## audits/lattice-gentle.md → crypto-lab-lattice-gentle

Audit dated 2026-07-20. Commits `9f26f74` + `f3c8152` (both 2026-07-20) closed the four
P0s and the P1s; `ce272c2`..`f3ef9d9` (2026-08-01) added the fleet a11y/layout passes.
Re-verification on 2026-08-02 found one remaining live defect in the audit's GS-03
acceptance criterion ("three consecutive clean runs"): a real ~6% flake rooted in the
toy crypto itself — fixed and pushed as `fca3ad7`.

| Item | Verdict | Evidence | Action |
| --- | --- | --- | --- |
| GS-01 Central security story | DONE | "basis quality is intuition; secrets are short vectors" copy (9f26f74); ML-KEM/ML-DSA deployments stated separately; exit-check question "the real ML-KEM secret" | none |
| GS-02 Toy-to-standard boundary / implicit rejection | DONE | FIPS 203-style implicit rejection with z-derived fallback (src/kyber/toyKyber.ts:9,45,138-217), determinism+separation tests; toy-vs-standard delta tables for both schemes; "only the sizes change" gone | none |
| GS-03 a11y gate reliability | DONE, then re-broken by residual flake — STILL-APPLICABLE | 120s timeout + state assertions landed in 9f26f74, but observed 1 failure in ~5 runs on 2026-08-02: with 4-bit toy challenges, tampered-message verify accidentally ACCEPTS ~1/16 (challenge space = 16), failing the asserted SIGNATURE REJECTED state | IMPLEMENTED (`fca3ad7`): e2e pins dil-seed 7; three consecutive clean 13-test runs recorded |
| GS-04 Mobile overflow | DONE | box-sizing + scrollable wrappers (9f26f74), cl-hero fix (ce272c2); 320-768px + 200% zoom overflow test passing | none |
| GS-05 Experiment before essay / guided shell | DONE | Guided mode with first-viewport prediction experiment, progress rail, deep links, Reference mode (f3c8152) | none |
| GS-06 Learning loops / exit check | DONE | SVP prediction prompt, solutions behind disclosure, five-question transfer exit check with feedback (f3c8152) | none |
| GS-07 Reproducible seeded experiments | DONE | visible seed, reroll, ?kseed/?dseed links, eta vs measured error separated (9f26f74) | none |
| GS-08 Valid control states | DONE | prerequisite/busy/stale-result handling on async controls; verify buttons disabled until signature exists (exhibitSchemes.ts:455-458) | none |
| GS-09 Beyond axe-only a11y | DONE (2 declared-open manual items) | keyboard-only e2e suite, forced-colors + reduced-motion runs, concise live regions (f3c8152); README documents NVDA pass + learner study as deliberately open | PROPOSED (unchanged): manual NVDA pass; learner outcome study |
| GS-10 Layered math | DONE | inspect/disclosure pattern ("Inspect the secrets", details elements); solutions collapsed | none |
| GS-11 Provenance & "spec KATs" wording | DONE | README:76 "32 worked-example KATs (regression tests against the teaching sources, not official FIPS/ACVP vectors)" with exact source revisions; glossary + citations (9f26f74) | none |
| (new, audit-adjacent) Dishonest tamper caption + flaky unit tests | STILL-APPLICABLE | Caption said the re-derived challenge "must now disagree" — false 1/16; unit tests "rejects a tampered message"/"tampered z" used fresh randomness, flaky at ~6% | IMPLEMENTED (`fca3ad7`): warn-labelled toy-forgery acceptance branch, honest caption, seed-pinned rejection tests, new pinned forgery test (seed 32) proving the collision branch; gates: 58 vitest, build, 13 Playwright x3 |

## audits/protocol-checker.md → crypto-lab-protocol-checker

Audit verified baseline 2026-07-17; commit `e650cdf` ("Gold-standard pass", 2026-07-17)
addressed the top-priority items the same day. Gates re-verified 2026-08-02: 52/52 vitest,
build clean, 2/2 Playwright a11y. No changes needed; remaining items are feature/redesign
scale and stay PROPOSED.

| Item | Verdict | Evidence | Action |
| --- | --- | --- | --- |
| 1 Machine-derived secure explanations | DONE | `src/symbolic/explain.ts` (256 lines) derives the repair diagnostic from the same engine primitives (unify + canSynth); "why the repair holds — derived, not asserted" panel; hand-authored prose demoted to fallback; explain.test.ts | none |
| 2 Parameterized bounds/scenarios | STILL-APPLICABLE (feature-scale) | `bound: 60000` and `instances` still fixed per protocol (src/symbolic/protocol.ts:51-62); UI honestly distinguishes "space fully exhausted" vs "state cap reached" (src/ui.ts:420-463) but offers no session/bound controls or sweeps | PROPOSED: session-count + bound controls, bound-sweep tables |
| 3 External cross-validation | PARTIAL — DONE for literature grounding, rest PROPOSED | Literature citations on KATs (Dolev-Yao 1983, Needham-Schroeder 1978, Lowe 1995/96) make "agrees with the published result" explicit (e650cdf); no ProVerif/Tamarin differential corpus | PROPOSED: reference corpus cross-checked against ProVerif/Tamarin |
| 4 Protocol authoring/DSL | STILL-APPLICABLE (redesign-scale) | `PROTOCOLS` still a static array; no DSL/import-export | PROPOSED: protocol DSL/JSON schema, import/export, diff view |
| 5 Adversarial test depth | PARTIAL — property layer DONE, infra PROPOSED | `properties.test.ts`: seeded randomized MGU soundness, monotonicity, idempotence, DH commutativity, search determinism, bound-monotonicity (30→52 tests, e650cdf); no mutation testing/coverage thresholds/benchmark gates | PROPOSED: mutation testing on intruder.ts/search.ts, coverage + perf gates |
| 6 Search-failure pedagogy (frontier explorer) | STILL-APPLICABLE (redesign-scale) | No frontier/state-graph explorer or per-step match diagnostics in src/ui.ts | PROPOSED: frontier explorer, trace minimization, side-by-side compare |
| Extras: architecture note | DONE | `ARCHITECTURE.md` (63 lines): term algebra, transition system, deduction rules | none |
| Extras: LICENSE/CONTRIBUTING/CHANGELOG | STILL-APPLICABLE (owner's call) | None present — but no repo in the fleet carries them (checked icy-dvrf, lattice-gentle), so license choice is a fleet-wide maintainer decision | PROPOSED: fleet-wide license decision |
