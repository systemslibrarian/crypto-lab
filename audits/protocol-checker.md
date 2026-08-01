# What Would Make This the Gold Standard

## Verified Baseline

- The repo already does the important honesty work well: the README clearly states that this is a symbolic, bounded, perfect-cryptography model rather than production-grade crypto assurance.
- The core is small and inspectable: the term algebra, unifier, intruder model, and bounded search are split cleanly across `src/symbolic/terms.ts`, `src/symbolic/unify.ts`, `src/symbolic/intruder.ts`, and `src/symbolic/search.ts`.
- The current quality gates are real, not decorative. Verified locally on 2026-07-17:
  - `npm test`: 30/30 tests passed
  - `npm run build`: passed
  - `npm run test:a11y`: 2/2 Playwright axe checks passed
- CI already enforces `test -> build -> accessibility -> deploy` in `.github/workflows/deploy.yml`.

That means the question is not "how do we make this respectable?" It already is. The question is what still separates it from a gold-standard reference artifact.

## What Still Blocks Gold Standard

### 1. Secure explanations are hand-authored, not derived

Evidence:

- `Protocol` includes an optional `secureReason` string in `src/symbolic/protocol.ts`.
- The UI renders that string directly in the secure verdict path in `src/ui.ts`.

Why this matters:

- For attacks, the machine produces a real witness trace.
- For secure verdicts, the explanation is still partly editorial.
- A gold-standard checker should explain success and failure from the same engine.

What to add:

- machine-derived rejection reasons for each failed receive/match point
- proof objects for secure verdicts, not just counts
- exportable derivation trees or "why the attack fails" witnesses

### 2. Bounds and scenarios are fixed instead of user- or experiment-driven

Evidence:

- Each protocol hard-codes its `instances` and a single `bound: 60000` in `src/symbolic/protocol.ts`.
- The UI displays the bound and explored states, but does not let the user vary sessions, principals, or search caps.

Why this matters:

- In a bounded symbolic checker, "no attack in bound" is only as persuasive as the scenario that was explored.
- Gold standard means letting the user test robustness, not just inspect one baked-in scenario.

What to add:

- parameterized scenario generation
- session-count and bound controls in the UI
- bound-sweep tables or charts showing how verdicts and state counts change
- saved benchmark fixtures so changes in search breadth are reviewable

### 3. The engine is internally tested, but not externally cross-validated

Evidence:

- The KATs in `src/symbolic/search.test.ts` are strong and worthwhile.
- But they still validate the implementation against expectations encoded in the same codebase.

Why this matters:

- Gold standard requires more than internal consistency.
- It should be possible to say: this mini-engine agrees with a trusted external formulation on a small but meaningful corpus.

What to add:

- a reference corpus cross-checked against ProVerif, Tamarin, or published FDR/FDR-style results where applicable
- frozen attack-trace artifacts for known cases
- CI checks that fail if the local engine diverges from the reference corpus

### 4. The protocol library is curated, not authorable

Evidence:

- `PROTOCOLS` is a static in-memory array in `src/symbolic/protocol.ts`.
- The current experience is excellent for demonstration, but not yet a protocol workbench.

Why this matters:

- Gold standard is not just "four polished examples".
- It is a tool that lets a learner or reviewer encode nearby protocols, mutate them, and inspect the consequences.

What to add:

- a small protocol DSL or JSON schema
- parser and validation errors that teach the model constraints
- import/export and shareable URLs for protocol examples
- a diff view between two protocol variants, especially vulnerable vs. repaired

### 5. The tests are good regression tests, but not yet adversarial enough for semantics-heavy code

Evidence:

- The repo has 30 unit/KAT tests and a solid accessibility suite.
- There is no coverage threshold, property-based test layer, mutation testing, or benchmark regression gate in the current scripts.

Why this matters:

- Symbolic engines are exactly the kind of code where edge-case semantic drift can hide behind apparently strong example tests.

What to add:

- property-based tests for unification, canonicalization, determinism, and attacker-knowledge monotonicity
- bound-monotonicity checks: increasing the cap should not hide previously found attacks
- mutation testing focused on `intruder.ts` and `search.ts`
- coverage reporting with enforced thresholds
- performance regression checks for runtime and state-count movement

### 6. The UI explains attacks well, but not the shape of search failure

Evidence:

- The current UI shows trace steps, knowledge growth, and real search counts.
- It does not expose the explored frontier, rejected candidate messages, or why nearby branches failed.

Why this matters:

- Gold standard pedagogy does not stop at "attack found" or "none in bound".
- It teaches the near misses, the rejected messages, and the exact structural reason a repair works.

What to add:

- a frontier/state graph explorer
- per-step match diagnostics: why this message matched, why adjacent candidates failed
- attack-trace minimization
- side-by-side comparison mode for vulnerable vs. fixed runs

## Priority Order

If the goal is maximum impact per unit of work, the order should be:

1. Replace hand-authored secure explanations with machine-derived explanations.
2. Add parameterized bounds and scenarios, then show bound sweeps in the UI.
3. Cross-validate a small corpus against external tools or literature-grade reference artifacts.
4. Add protocol authoring/import-export.
5. Add property-based tests, mutation testing, coverage thresholds, and benchmark gates.

## Repo-Level Extras

If you also want the repository itself, not just the demo, to feel gold standard as an open artifact:

- add `LICENSE`, `CONTRIBUTING.md`, and `CHANGELOG.md`
- add a short architecture note defining the state transition system and deduction rules in one place
- publish benchmark artifacts from CI alongside deployment

## Bottom Line

This is already a strong, honest, well-verified teaching demo.

What would make it gold standard is not more polish. It is the next layer of epistemic strength:

- explanations generated by the engine rather than written around it
- parameterized experiments instead of fixed scenarios
- external cross-validation instead of self-contained correctness
- protocol authoring instead of a fixed showcase

That is the difference between a convincing demo and a reference-quality symbolic protocol lab.