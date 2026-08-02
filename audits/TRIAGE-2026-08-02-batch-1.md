# Triage — 2026-08-02 — Batch 1 (Task 10)

Documents actioned: `ablation-wire.md`, `credential-veil.md`, `dkg-gate.md`,
`harvest-vault.md`, `hqc-timing.md` + `hqc-timing-bugs.md`.
Every recommendation was verified against current source before acting.

Verdicts: **DONE** (implemented since the audit), **STALE** (premise no longer true),
**IMPLEMENTED** (was still applicable; fixed in this batch), **PROPOSED** (still
applicable but redesign-scale or a maintainer decision — left for the maintainer).

---

## audits/ablation-wire.md → crypto-lab-ablation-wire

Nearly the whole roadmap has been implemented since the audit (commit run
`fe38ce6`…`b77e3e8`…`da8778b`…`ce9c88e` and the accessibility passes). No code changes
made in this batch.

| # | Item | Verdict | Evidence / action |
|---|---|---|---|
| 1 | Guided experiment mode (5 experiments, predict–change–observe–explain) | DONE | `web/index.html`: `LAB.steps`, guided/explore modes, per-step predict+reveal; commits `da8778b`, `ce9c88e` ("put the curriculum in the crate") |
| 2 | Presets with shareable URL state + reset | DONE | `#presets` group, `history.replaceState` hash state, `#reset` button, preset derived from state (`markPreset`) |
| 3 | Live A1–A5 threat matrix with "because" clauses | DONE | index.html "A1–A5, computed for this configuration"; commit `fe38ce6` "Name the adversary beside the verdict" |
| 4 | Predict before reveal, with score | DONE | `revealStep({score})`, `answered` map; prediction scored against crate output |
| 5 | Transfer challenges (goal, validation, explanation) | DONE | `#lab-challenge`, `scoreChallenge()` (crate-scored, condition by condition), answer box; commit `da8778b` "end it with a task" |
| 6 | Layer explanations (Job / Attacker / Off-means schema) | DONE | Per-panel rows incl. "Off means"/"On means" consequence (index.html ~1517) |
| 7 | Inline glossary (focus-reachable) | DONE | `data-term` buttons + `.term-def`, 13 glossary hooks |
| 8 | Ratchet precision + key/nonce equality indicator | DONE | `.keycmp` UI: "nonce 1 ≠ nonce 2", "repeated nonce, fresh key — no pad" consequence text |
| 9 | Metadata leakage summary beside the bytes | DONE | `#metadata-card`; "what leaks regardless" in the change-diff |
| 10 | Visual causality (change highlighting, handshake sequence view, collapsed internals, hexdump legend focus) | DONE | change-diff (`out.push(...)` at ~1886–1889), `renderSequence()` switching authenticated/unauthenticated, `details.internals`, `.legend button` |
| 11 | Historical/community review as release gate (Phase 0) | PROPOSED | External process only the maintainer can run. The old "contact the museums before publication" line is no longer in SOURCES.md, but no recorded review outcome was found in the repo — recommend recording one either way |
| 12 | Accessibility requirements (aria-live verdicts, keyboard, contrast, touch) | DONE | `aria-live` regions on reveal/verdict; commits `7287566`, `d06279b`, `f759ebb` |
| 13 | Instructor guide, worksheet, answer key (10/30/60 formats) | DONE | `TEACHING.md` (objectives, prerequisites, worksheet, answer key, the "why did it change" rubric) |
| 14 | Browser tests for presets/URL/verdict states in CI | DONE | `.github/workflows/ci.yml` drives the page; commits `b77e3e8`, `a022fd7`, `c08ad75` |

**Counts: 13 DONE, 0 STALE, 0 implemented now, 1 PROPOSED.**

---

## audits/credential-veil.md → crypto-lab-credential-veil

Commit `e82cc2b` ("Gold-standard pass: reviewability, validation, worker offload, trust
surface") implemented this audit almost line by line. No code changes made in this batch.

| # | Item | Verdict | Evidence / action |
|---|---|---|---|
| 1 | Reviewable cryptographic design note (+ threat model, spec provenance) | DONE | `docs/design-note.md` (module map, exact proof statements, DOB-encoding deviation, soundness intuition, known limitations, review checklist), `docs/threat-model.md`, `docs/spec-provenance.md` |
| 2a | Property-based / adversarial / mutation tests | DONE | `src/credential/adversarial.test.ts` (random reveal subsets, truncation/extension/byte-flip, index re-targeting, age-proof mutations — fail closed) |
| 2b | Differential tests vs an independent BBS implementation | PROPOSED | Not present anywhere in the repo; requires importing a second BBS implementation — dependency/scope decision for the maintainer |
| 3 | Multi-browser + mobile Playwright | DONE | `playwright.config.ts`: chromium, firefox, webkit, Pixel 7 project; serialized for renderer stability |
| 4 | Web Worker offload + progress/cancel | DONE | `src/worker/cryptoWorker.ts`, `src/worker/client.ts` (watchdog, terminate+respawn cancel, self-healing retry) |
| 5 | Reproducible benchmarks | DONE | `bench/crypto.bench.ts`, `docs/benchmarks.md` recorded run; not a CI gate, as the audit asked |
| 6 | LICENSE / SECURITY.md / CONTRIBUTING.md / CODEOWNERS | DONE | All four present (`LICENSE` MIT, `.github/CODEOWNERS`) |
| 7 | Deeper revocation story | DONE | Status list vs issuer-online vs ZK-accumulator comparison + "what a private deployment would require" (in `e82cc2b`; README "honest tension" section) |
| 8 | Package for third-party review (module map, read-this-first) | DONE | design-note opens "Read this first if you are reviewing the cryptography"; module map + suggested reading order |
| 9 | Production-grade scope change (audit §"What Would Be Required…") | PROPOSED | Explicitly out of scope in the audit itself; repo remains labeled a teaching demo |

**Counts: 8 DONE, 0 STALE, 0 implemented now, 2 PROPOSED.**

---

## audits/dkg-gate.md → crypto-lab-dkg-gate

The contained P0 fixes (gate suppression, landmark, mobile CSS, PR CI, numbering) had
already landed. Implemented the remaining self-contained items in commit **`c3e845a`**
(pushed to origin/main): property-by-property threat model, bias-statistics honesty,
and a reflow gate. Gates run: `npm test` (96/96), `npm run build` (tsc + vite),
`npm run test:a11y` (5/5: 2 a11y themes + 3 reflow widths).

| # | Item | Verdict | Evidence / action |
|---|---|---|---|
| P0-1 | Full GJKR ceremony **or** narrowed claim | DONE (narrowed) | Audit offered relabeling as the acceptable alternative, and it was taken: README "A note on scope", index.html Exhibit 3 "faithful model … not a second full ceremony", `dkg.ts` header names Pedersen/Joint-Feldman. A full commit-then-reveal ceremony mode remains unbuilt — that half stays open only as an explicit non-goal |
| P0-2 | Property-by-property threat model with `f` ≠ `t` | IMPLEMENTED (`c3e845a`) | New "Secure against whom, for what?" panel in index.html + README "Threat Model, Property by Property": correctness, secrecy (f ≤ t−1, computational), uniformity (fails vs rushing, restored by GJKR), availability (f ≤ n−t), channels, static corruption |
| P0-3 | Browser gates must prove every state | DONE | `e2e/a11y.spec.ts` rewritten since audit: no `.catch(() => {})`, no `waitForTimeout`, semantic assertions before each scan, pageerror/console.error guards, both bias branches scanned, landmark best-practice rules + `assertSingleBanner` |
| P0-4 | Fix and gate mobile reflow | DONE + IMPLEMENTED | CSS fix landed in `32dcf4b`; I measured scrollWidth == clientWidth at 320/360/400 px in the completed state, then added `e2e/reflow.spec.ts` (`c3e845a`) gating exactly the audit's definition of done |
| P0-5 | PR CI, not only deploy CI | DONE | `.github/workflows/ci.yml`: tests/build/a11y on `pull_request` and non-main pushes, contents:read only |
| P1-6 | Seeded permalinks + paired naive/GJKR runs | PROPOSED | No URL state or seed UI exists; feature-scale UI/state work |
| P1-7 | Independent `verifyTranscript` + golden/mutation transcript tests | PROPOSED | New subsystem; audit itself sequences it with the scope decision |
| P1-8a | Exact rejection sampling in `randomScalar` | PROPOSED (declined) | Current 48-byte reduction has ~2⁻¹³¹ bias (negligible, correctly documented); changing sampling would invalidate every seeded deterministic test pin for no security gain |
| P1-8b | Bias statistics honesty (test name vs assertion; "theory" label) | IMPLEMENTED (`c3e845a`) | `bias.test.ts`: paired-seed test now pins the deterministic counts (1 blind win vs 5 rushing wins over the same 12 seeds) so name and assertion agree; `ui/bias.ts` batch banner now says "independence heuristic ≈ N%" (naive) / "blind guess = 6.3%" (GJKR) instead of "theory" |
| P1-9 | Cross-browser + keyboard/reduced-motion coverage | PROPOSED | Playwright still Chromium-only; fleet precedent (credential-veil) exists if the maintainer wants it |
| P1-10 | README/UI exhibit numbering | DONE | Both now consistently list 3 exhibits with cheating folded into Exhibit 1; bibliography/notation table remain PROPOSED |
| P2-11 | SHA-pinned actions, Dependabot, SBOM | PROPOSED | Workflows still use mutable major tags (`actions/checkout@v5`) |
| P2-12 | LICENSE, SECURITY.md, CITATION.cff | PROPOSED | Absent; license choice is the maintainer's legal call (fleet precedent: MIT in credential-veil) |
| P2-13 | Post-deploy smoke, bundle budget, external review | PROPOSED | Not present; audit sequences external review after the scope decision anyway |

**Counts: 4 DONE, 0 STALE, 3 implemented now (in `c3e845a`), 7 PROPOSED.**

---

## audits/harvest-vault.md → crypto-lab-harvest-vault

The git history implements the audit tier by tier, in the audit's own suggested order.
No code changes made in this batch.

| # | Item | Verdict | Evidence / action |
|---|---|---|---|
| 1 | Guided learning path + checkpoints | DONE | `bb8e3fb` (sticky guided-path nav), `14e63bd` (checkpoints) |
| 2 | Copyable risk brief generator | DONE | `f4bd42e`; `#copy-brief`, `briefText()`, print stylesheet |
| 3 | Sources first-class (evidence + confidence labels) | DONE | `60ceab7`; `confidenceBadge()` (confirmed/estimate/illustrative/recommendation); post-audit commits `de96e66`, `29c9ea8` further tightened citation honesty |
| 4 | Three-scenario Z uncertainty comparison | DONE | `14e63bd`; `Z_SCENARIOS` + `createScenarioStrip()` recomputed from live X/Y |
| 5 | Misconception cards | DONE | `14e63bd`; `MISCONCEPTIONS` + `createMisconceptions()` |
| 6 | Interactive sector matrix (select → calculator, Z toggle, legend) | DONE | `0223928`; `matrixZ` toggle, dot → preset selection |
| 7 | Five-question assessment mode | DONE | `e1d073b`; `QUIZ`, score text, `#quiz-reset`; a11y fixed in `ad1ec04` |
| 8 | "What To Do Monday" action plan | DONE | `5ffdeff` |
| 9 | Explicit threat-model panel | DONE | `60ceab7` |
| 10 | Protocol-level examples (RSA-TLS / ECDHE / hybrid / stored files) | DONE | `60ceab7` (protocols) |
| 11 | Polish list (progress, copy/reset, URL params, glossary, print) | DONE | `#copy-verdict`, `#reset-calc`, URLSearchParams round-trip (fixed in `ad1ec04`), `GLOSSARY`, print stylesheet |
| 12 | "What I Would Avoid" (no false certainty etc.) | DONE (respected) | Post-audit honesty commits: `97fbf96` (Mosca X/Y canonical convention, honest counter label), `de96e66`, `29c9ea8` |

**Counts: 12 DONE, 0 STALE, 0 implemented now, 0 PROPOSED.**

---

## audits/hqc-timing.md + hqc-timing-bugs.md → crypto-lab-hqc-timing

No code changes made in this batch.

| # | Item | Verdict | Evidence / action |
|---|---|---|---|
| main | All recommendations of the 10/10 review | LOST | Partial salvage contains only the intro ("current read: 8.5–9/10"); every recommendation is gone. Not triageable — fresh audit is tracked separately (salvage note: task #6) |
| bugs-1 | Theme hydration overwrites OS preference | DONE | Verified in current `src/main.ts`: `reflect()` on load does not persist; `persist()` only runs on click; the `prefers-color-scheme` listener is gated on `hasExplicitChoice()` |
| bugs-2 | ARIA live-region announcer race | DONE | Verified in current `src/ui.ts`: `announceTimer` tracked, pending timeout cleared before re-arm (lines 31–42) |
| bugs-3 | Lost tail (~3 lines, possibly a third finding) | LOST | Absent from git, session logs, file-history, paste-cache — unrecoverable without the original ChatGPT export |

**Counts: 2 DONE (verified), 0 STALE, 0 implemented now, 0 PROPOSED; main audit + one possible finding unrecoverable.**

---

## Batch summary

- **Repos changed:** dkg-gate only — commit `c3e845a`, pushed to origin/main, all gates green (96 unit tests, tsc+vite build, 5/5 Playwright incl. new reflow gate).
- **Untouched by design:** ablation-wire, credential-veil, harvest-vault (audits fully implemented since), hqc-timing (findings already remediated; main audit lost).
- Preserved untracked scratch files (`chat.md`, `chatgpt.md`, `gem.md`) were left untouched and out of commits.
