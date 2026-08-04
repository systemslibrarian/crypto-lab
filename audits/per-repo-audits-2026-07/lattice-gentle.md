# Gold-standard audit: Lattice Gentle

Audit date: 2026-07-20

## Verdict

This is already a strong mathematical demo. The arithmetic is live, the toy boundaries are mostly explicit, failure paths are visible, and the test suite is much better than the average educational cryptography project. It scores **76/100 (about 7.6/10) today** on the rubric below.

It is not yet a 10/10 gold standard because five things still undermine the promise:

1. The opening thesis overstates the role of good and bad bases in modern ML-KEM and ML-DSA.
2. The toy KEM visibly rejects malformed ciphertexts, while standardized ML-KEM uses implicit rejection, yet the UI calls this a working ML-KEM and says only the sizes change.
3. The default accessibility command currently times out even though the same axe scans pass with a larger timeout.
4. The mobile page horizontally overflows, and the first interaction is more than two phone screens down.
5. The page is an excellent interactive reference, but not yet a guided learning experience with prediction, feedback, progression, and reproducible experiments.

The route to 10/10 is not more cryptographic machinery. It is tighter truthfulness, a guided first-run experience, deterministic replay, stronger interaction states, and release checks that pass reliably.

## Evidence collected

I inspected the application source, unit tests, Playwright tests, build configuration, and the production-rendered page.

Executable results:

- `npm test -- --reporter=verbose`: **54/54 tests passed** across five test files.
- `npm run build`: **passed** TypeScript checking and the Vite production build.
- `npm run test:a11y`: **failed 2/2 tests** at Playwright's default 30-second test timeout while axe was scanning.
- `npx playwright test --timeout=120000`: **passed 2/2 tests**, with no WCAG A/AA axe violations in either theme.

Rendered measurements in Chromium:

| Measurement | Desktop, 1440 x 900 | Mobile, 390 x 844 |
| --- | ---: | ---: |
| Total page height | 6,369 px | 12,986 px |
| First Exhibit 1 control | 842 px from top | 1,910 px from top |
| Document width | fits | 398 px in a 390 px viewport |
| Initial app words | 2,210 | 2,210 |
| Controls mounted at once | 54 | 54 |

These measurements are not all defects. They establish that the current product is a long-form technical reference and explain why first-time learners can struggle to find the intended path.

## What is already gold-standard quality

Do not lose these strengths while redesigning the lesson.

- **The mathematics is executed, not staged.** Lattice operations, reductions, finite-field and quotient-ring arithmetic, signing, verification, and failure decisions come from the implementation.
- **The tests carry real substance.** The suite includes worked-example checks, exhaustive solution counts, round trips, rejection paths, and properties such as Gauss attaining `lambda_1` and LLL output being reduced.
- **The demo exposes failure.** The learner can make Babai rounding miss, exceed the Kyber noise budget, tamper with a KEM ciphertext, trigger signing aborts, and alter a signature.
- **The scope warnings are unusually candid.** Tiny dimensions, SHA-256 standing in for SHAKE, omitted compression, and lack of production security are stated in the page and [README](README.md#L7).
- **Pointer dragging has a keyboard-equivalent path.** Exhibit 1 also exposes labelled numeric inputs, so pointer dragging is a convenience rather than the only way to alter the basis ([exhibitLattice.ts](src/ui/exhibitLattice.ts#L80)).
- **Accessible state is not color-only.** Results combine text, symbols, and color, and the changing lattice graphic receives an updated accessible label ([exhibitLattice.ts](src/ui/exhibitLattice.ts#L157)).

## Release blockers

### GS-01: Correct the central security story

**Type:** Pedagogical correctness  
**Priority:** P0

The page says that lattice cryptography is built "exactly" on honest users holding an easy description while attackers receive a hopeless one ([index.html](index.html#L169), [index.html](index.html#L182)). The README goes further and calls good-basis versus bad-basis asymmetry "the entire security story" ([README.md](README.md#L7)).

That is useful intuition for reduction and decoding, but it is not a faithful description of modern ML-KEM or ML-DSA. Their honest users are not generally given a secret good basis for the attacker's q-ary lattice. In this demo's own Kyber flow, the secret key is the short vector `s`, and the public relation is `t = A*s + e` ([toyKyber.ts](src/kyber/toyKyber.ts#L53)). The connection to hard lattice problems is through MLWE/MSIS formulations and reductions, not a literal good-basis trapdoor in the two standardized schemes.

Required change:

> Basis quality gives geometric intuition for why short-vector search and decoding can be easy or hard. ML-KEM and ML-DSA do not give honest users a secret good basis; they use short secrets, controlled errors, and module-LWE/module-SIS constructions whose security is connected to hard high-dimensional lattice problems.

Also split the deployment sentence. ML-KEM is the mechanism relevant to hybrid key establishment in TLS, Signal, and iMessage; that sentence currently groups ML-DSA into the same examples ([index.html](index.html#L167)). Give ML-DSA its own signature deployments rather than implying both standards protect all three systems in the same way.

Acceptance criteria:

- No copy says good/bad bases are the entire security story.
- Every bridge from geometry to MLWE/MSIS is labelled as one of: intuition, exact formulation, or security reduction.
- The learner can answer: "Does an ML-KEM recipient possess a secret good basis?" with "No" after Exhibit 5.
- ML-KEM deployment examples and ML-DSA deployment examples are stated separately.

### GS-02: Make the toy-to-standard boundary exact

**Type:** Cryptographic fidelity  
**Priority:** P0

The toy decapsulator returns `null` when re-encryption does not match and even comments that real ML-KEM instead returns an implicit-rejection key ([toyKyber.ts](src/kyber/toyKyber.ts#L190)). The UI nevertheless says:

- "rejected - no key released" ([exhibitSchemes.ts](src/ui/exhibitSchemes.ts#L240));
- decapsulation "refuses to release a key" ([exhibitSchemes.ts](src/ui/exhibitSchemes.ts#L246));
- this is "a working ML-KEM" ([exhibitSchemes.ts](src/ui/exhibitSchemes.ts#L256)); and
- real ML-KEM changes "only the sizes, never the shape" ([exhibitSchemes.ts](src/ui/exhibitSchemes.ts#L260)).

Those statements conflict with both the implementation comment and standardized ML-KEM. FIPS 203 decapsulation uses implicit rejection: a malformed ciphertext produces a pseudorandom fallback shared secret rather than an externally visible "no key" result. The standard also differs in more than sizes, including exact hashing/XOF, encoding, compression, and key material. The same caution applies to calling the simplified Dilithium flow a working ML-DSA when standard details such as hints and encoding are omitted.

There are two valid fixes:

1. **Preferred:** implement a toy implicit-rejection path with fallback secret `z`, show that both paths output same-length keys, and reveal the internal match only inside an explicitly labelled teaching trace.
2. **Smaller:** retain explicit rejection, rename it "FO-style toy KEM," and state that it intentionally differs from ML-KEM decapsulation.

Add a compact "toy versus standard" table beside each scheme:

| Property | This toy | FIPS standard |
| --- | --- | --- |
| Ring dimension | 4 | 256 |
| Modulus | 137 / 16417 | 3329 / 8380417 |
| Hash/XOF | SHA-256 stand-in | SHA3/SHAKE functions specified by FIPS |
| Compression/encoding | omitted or simplified | normative |
| ML-KEM invalid ciphertext | explicit visible rejection today | implicit rejection with fallback key |
| Security claim | none | parameter-set security target |

Use [FIPS 203](https://doi.org/10.6028/NIST.FIPS.203) and [FIPS 204](https://doi.org/10.6028/NIST.FIPS.204) as the normative references.

Acceptance criteria:

- The page never presents externally visible failure as real ML-KEM behavior.
- "Only the sizes change" is removed.
- "Working ML-KEM/ML-DSA" is used only if the demonstrated algorithm matches the named standard at the claimed abstraction level.
- Every deliberate deviation is visible before, not only after, the learner runs the scheme.
- Tests cover valid decapsulation, corrupted ciphertext, fallback-key determinism, and separation from the valid shared key if implicit rejection is implemented.

### GS-03: Repair the default accessibility release gate

**Type:** Engineering reliability  
**Priority:** P0

The normal command fails locally because the test expands every disclosure, drives every state, and then scans a large DOM with axe ([a11y.spec.ts](e2e/a11y.spec.ts#L9), [a11y.spec.ts](e2e/a11y.spec.ts#L76)). The Playwright configuration gives the web server 120 seconds but does not raise the per-test timeout from its 30-second default ([playwright.config.ts](playwright.config.ts#L3)).

Observed result:

```text
npm run test:a11y
2 failed: Test timeout of 30000ms exceeded during AxeBuilder.analyze()
```

The exact same tests pass with `--timeout=120000`, proving this run found timeout instability rather than axe violations.

Required change:

- Set an intentional test or suite timeout in configuration.
- Replace fixed sleeps with assertions on the state that the click is meant to produce.
- Consider splitting one giant scan into stable exhibit-scoped scans while retaining one baseline whole-page scan.
- Keep both themes, and add mobile projects rather than multiplying all states into one ever-growing test.

Acceptance criteria:

- `npm run test:a11y` passes three consecutive runs with no CLI override.
- CI records an axe violation differently from a timeout.
- No fixed wait is used where a DOM assertion can establish readiness.

### GS-04: Eliminate mobile overflow

**Type:** Responsive-layout defect  
**Priority:** P0

At a 390 px viewport, the rendered document is 398 px wide. The hero is the main source: at the mobile breakpoint, `.cl-hero-why` gets `width: 100%` while retaining horizontal padding and borders, and the page has no global `box-sizing: border-box` rule ([style.css](src/style.css#L90-L93)).

Required change:

- Apply `box-sizing: border-box` consistently, including pseudo-elements.
- Remove any compensating widths that become unnecessary.
- Check long equations, tables, badges, and matrix rows at 320, 360, 390, and 768 px.
- Preserve intentional horizontal scrolling only inside labelled math/table containers.

Acceptance criteria:

- `document.documentElement.scrollWidth <= window.innerWidth` at all supported phone widths.
- The same remains true at 200% browser zoom on desktop.
- No control, status badge, equation, or table is clipped.

## Highest-impact upgrades

### GS-05: Put the experiment before the essay

**Type:** Product and information design  
**Priority:** P1

On a 390 x 844 phone, the first Exhibit 1 control begins 1,910 px from the top. A learner passes the hero, "why it matters," the full lattice introduction, the concept map, a warning, an exhibit heading, and another explanatory paragraph before doing anything. The first screen advertises interactivity but does not provide it.

Make the first viewport the actual experience:

- Present the good/bad-basis toggle and target immediately after the title.
- Ask one concrete question: "Which basis will round closer to the target?"
- Let the learner predict, toggle, and observe before showing the full explanation.
- Move the current introductory prose into a concise takeaway and an expandable "theory" section.

Keep a **Guided** and **Reference** mode:

- Guided mode reveals one exhibit at a time and carries a progress rail: Basis -> SVP/CVP -> Reduction -> LWE/SIS -> Schemes.
- Reference mode preserves the current all-on-one-page inspectability for instructors and returning users.
- Each exhibit header contains exactly four things: question, action, observation, takeaway.

Acceptance criteria:

- A meaningful input and visible response fit in the first phone viewport after the shared header.
- A new learner can state the first exhibit's goal without reading more than 80 words.
- Every exhibit ends with a one-sentence bridge to the next exhibit.
- Deep links open directly to any exhibit and restore its relevant state.

### GS-06: Turn demonstrations into learning loops

**Type:** Pedagogy  
**Priority:** P1

Most current controls reveal known states immediately. LWE and SIS even provide solution buttons beside the candidate fields ([exhibitLweSis.ts](src/ui/exhibitLweSis.ts#L38), [exhibitLweSis.ts](src/ui/exhibitLweSis.ts#L158)). This is useful for verification, but it does not require the learner to predict, test, or explain.

Use a consistent prediction-observation-explanation loop:

1. **Predict:** choose what will remain invariant or which operation will fail.
2. **Act:** drag, step, type, tamper, or change noise.
3. **Observe:** highlight only the numbers that caused the result.
4. **Explain:** select or write the reason in one sentence.
5. **Transfer:** apply the idea to the next representation.

Suggested checkpoints:

- Exhibit 1: identify when a new pair spans the same lattice and predict whether Babai rounds correctly.
- Exhibit 2: explain why the shortest vector stays fixed when the basis changes.
- Exhibit 3: explain why subtracting an integer multiple changes the basis but not the lattice.
- Exhibit 4: distinguish LWE's small residual from SIS's short nonzero kernel vector.
- Exhibit 5: distinguish decryption correctness, KEM ciphertext validation, signature rejection, and security at real dimensions.

Acceptance criteria:

- Each exhibit has one stated learning objective and one observable success condition.
- "Show solution" is secondary and appears after an attempt, not beside the initial task.
- A five-question exit check tests transfer, not recall of displayed numbers.
- A small usability study with representative learners reaches at least 80% correct on those five outcomes without instructor intervention.

### GS-07: Make random experiments reproducible and shareable

**Type:** Scientific UX  
**Priority:** P1

Fresh keys and errors use `crypto.getRandomValues`, which is appropriate for fresh randomness ([toyKyber.ts](src/kyber/toyKyber.ts#L83)). However, the noise slider resamples on every input event ([exhibitSchemes.ts](src/ui/exhibitSchemes.ts#L127)). Two learners selecting the same value can see different polynomials and outcomes, and neither can replay or share the interesting case.

Add:

- a visible experiment seed;
- `Reroll` and `Replay` commands;
- URL-encoded exhibit, preset, seed, message, noise, and step index;
- a `Copy experiment link` command;
- a clear label that deterministic seeded generation is for reproducible teaching, not production key generation.

For the noise lab, separate the **input distribution bound** `eta` from the **measured aggregate error** `||E||_infinity`. Animate or highlight the coefficient that crosses `q/4`; do not imply that the slider value itself is the noise budget.

Acceptance criteria:

- Reloading or opening a shared link reproduces every displayed value and decision.
- A learner can distinguish `eta`, the sampled error coefficients, and the aggregate decryption error.
- The exact coefficient responsible for a flipped bit is visibly linked across the error expression, number line, and decoded output.

### GS-08: Give every control a valid state

**Type:** Interaction defect  
**Priority:** P1

All scheme buttons are enabled on initial render. The three Dilithium verification/tamper handlers silently return when no signature exists ([exhibitSchemes.ts](src/ui/exhibitSchemes.ts#L472)). Clicking an apparently available command therefore does nothing. Signing and KEM actions also have no pending, duplicate-click, or surfaced error state ([exhibitSchemes.ts](src/ui/exhibitSchemes.ts#L250), [exhibitSchemes.ts](src/ui/exhibitSchemes.ts#L363)).

Required change:

- Disable dependent actions until their prerequisite exists.
- On sign/encapsulate/verify, set `aria-busy`, show a concise pending state, and prevent duplicate runs.
- Catch and display convergence or WebCrypto failures, then restore controls.
- Ignore stale async results after keys, message, or mode change.
- Reset downstream results whenever an upstream input changes.

Acceptance criteria:

- No enabled control is a silent no-op.
- Every async action has idle, pending, success, and error states.
- Rapid double-clicks cannot publish stale or conflicting results.
- Keyboard focus moves to a concise result summary after a user-triggered run.

### GS-09: Go beyond an axe-only accessibility claim

**Type:** Accessibility quality  
**Priority:** P1

Passing axe with a longer timeout is meaningful, but axe does not validate teaching flow, announcement quality, touch behavior, focus order, or overflow. Several large containers are `role="status"` and are wholly replaced on input, including tables, polynomials, and diagrams ([exhibitLweSis.ts](src/ui/exhibitLweSis.ts#L25), [exhibitSchemes.ts](src/ui/exhibitSchemes.ts#L65)). A screen reader may receive far more content than the one result that changed.

Required change:

- Keep the full computed region outside live regions; announce only a short result sentence.
- Add keyboard-only tests for every workflow, including focus order and focus return.
- Add 320/390 px touch projects and overflow assertions.
- Test forced colors, reduced motion, 200% zoom, and text spacing.
- Perform one manual NVDA pass for each exhibit's primary workflow.

Acceptance criteria:

- A changed input announces one concise result, not an entire table or scheme transcript.
- Every workflow can be completed without a pointer.
- Touch targets remain at least 44 by 44 CSS pixels where practical.
- The accessibility documentation distinguishes automated axe coverage from manual checks.

### GS-10: Layer the math instead of showing every number at once

**Type:** Information design  
**Priority:** P1

The page mounts 54 controls, 15 subheadings, and about 2,210 words at once. Exhibit 5 immediately prints secret vectors, noise vectors, public vectors, ciphertext polynomials, decoded coefficients, and controls in two dense panels. Experts can audit it; first-time learners must decide which number matters without guidance.

Use three synchronized layers:

1. **Concept:** one diagram and one sentence describing the invariant or failure.
2. **Equation:** the current symbolic operation with changed terms highlighted.
3. **Arithmetic:** the complete vectors, matrices, and trace under "Inspect every value."

Do not remove the raw arithmetic. Make it an intentional inspection mode. When a learner selects a coefficient in the diagram, highlight the corresponding term in the equation and table.

Acceptance criteria:

- The default view never presents more than one primary conclusion per panel.
- All current values remain available within one disclosure action.
- Color is not the only link between synchronized values.
- Expanding arithmetic does not shift the active control out of view without preserving focus.

### GS-11: Strengthen provenance and terminology

**Type:** Trust and scholarly UX  
**Priority:** P1

The page names eprint 2026/1098 and slide examples but does not link each exhibit to the exact source section/page. The README calls 32 checks "spec KATs" even though many are worked examples from notes and course slides ([README.md](README.md#L75)). That wording can be mistaken for official FIPS or ACVP known-answer vectors.

Required change:

- Add a source link and page/section citation to every preset.
- Label statements as theorem, worked example, implementation property, analogy, or security claim.
- Rename "spec KATs" to "source-example regression tests" or "worked-example KATs" unless official standard vectors are added.
- Add a short glossary for basis, norm, CVP, SVP, BDD, LWE, SIS, MLWE, MSIS, KEM, and signature.
- Show the tested source identity or revision so future slide changes cannot silently invalidate the claim.

Acceptance criteria:

- Every exact-number claim has a clickable primary source.
- "KAT" cannot be read as an official FIPS vector unless it is one.
- A reader can tell which statements are intuition and which are formal claims.

## Recommended product shape

A gold-standard first run would look like this:

1. **Hook:** "Same dots, different arrows. Which basis decodes this target?" The learner predicts and toggles.
2. **Reveal:** the lattice stays fixed, Babai's result changes, and the true closest vector stays fixed.
3. **Repair:** the learner steps Gauss reduction and sees each integer basis operation preserve the lattice.
4. **Translate:** the geometry becomes residuals and kernel vectors over `F_q`; only the relevant row is highlighted.
5. **Apply:** the learner follows one message through toy encryption and one signature through abort/verify.
6. **Break:** a seeded high-noise case, a malformed KEM ciphertext, and two signature tamper cases fail for different reasons.
7. **Reflect:** a five-question transfer check distinguishes correctness, validation, and security.
8. **Inspect:** reference mode exposes every current number, source citation, and implementation test.

This keeps the rigor while giving newcomers a reason to care about each equation before asking them to parse it.

## Test matrix for a 10/10 release

| Layer | Required checks |
| --- | --- |
| Algebra | Existing 54 tests, plus implicit-rejection behavior if implemented |
| Worked examples | Source revision and exact page recorded with each fixture |
| UI behavior | Presets, manual input, invalid/degenerate basis, step/reset, async pending/error, stale-result prevention |
| Responsive | 320, 360, 390, 768, 1440 px; no document overflow |
| Accessibility | axe in both themes, keyboard workflows, concise live regions, forced colors, 200% zoom, manual NVDA pass |
| Reproducibility | Seeded URL restores all displayed values and outcomes |
| Pedagogy | Five learning objectives and an outcome-based usability test |
| Production | Typecheck, build, unit, behavior, visual, and a11y commands pass without overrides |

## Suggested implementation order

### Phase 1: Truth and release confidence

1. Correct the good-basis thesis and deployment sentence.
2. Decide between faithful implicit rejection and an explicitly non-ML-KEM toy KEM label.
3. Replace "only the sizes change" and add the toy-to-standard delta.
4. Stabilize the Playwright timeout and waits.
5. Fix mobile overflow and add viewport assertions.

### Phase 2: Guided learning shell

1. Move the first experiment into the first viewport.
2. Add Guided/Reference modes and exhibit deep links.
3. Give each exhibit one objective, prediction, action, observation, and takeaway.
4. Collapse raw arithmetic by default without removing it.

### Phase 3: Reproducible experiments

1. Add seed, reroll, replay, and shareable URL state.
2. Link `eta` to sampled errors and measured aggregate noise explicitly.
3. Synchronize coefficient highlighting across diagram, equation, and arithmetic.
4. Add prerequisite, pending, failure, and stale-result handling to every command.

### Phase 4: Prove the experience

1. Add mobile, keyboard, live-region, and behavior tests.
2. Run manual NVDA and zoom/forced-color checks.
3. Test the five learning outcomes with representative novice learners.
4. Record the results and limitations in the README.

## Scoring rubric

| Dimension | Weight | Current | Gold-standard bar |
| --- | ---: | ---: | --- |
| Mathematical correctness | 20 | 19 | All displayed decisions computed and property-tested |
| Standards and claim fidelity | 20 | 13 | No toy/standard ambiguity; reductions and analogies labelled |
| Learning design | 20 | 14 | Guided prediction/feedback/transfer loop with measured outcomes |
| Interaction and information design | 15 | 11 | First-screen value, progressive disclosure, valid control states |
| Accessibility and responsive behavior | 10 | 8 | Automated plus manual coverage; no overflow; concise announcements |
| Reproducibility and provenance | 10 | 7 | Seeded share links and exact primary-source citations |
| Release reliability | 5 | 4 | All documented commands pass repeatedly without overrides |
| **Total** | **100** | **76** | **95+ with no unresolved P0 or P1 finding** |

The numeric score is a prioritization aid, not a claim that rigor can be reduced to a number. A 10/10 release requires all four P0 findings to be closed, all P1 acceptance criteria to be met or explicitly justified, and no educational claim that is more confident than the implementation or standard supports.

## What not to add

- Do not add 3D lattice spectacle; it would add visual complexity without fixing the learning path.
- Do not replace real arithmetic with canned animation.
- Do not hide the toy limitations in a footer or modal.
- Do not rewrite this in a large framework solely to add navigation or state.
- Do not remove the raw traces that make the demo auditable.
- Do not call pointer dragging inaccessible while labelled numeric inputs provide the same operation; test the complete keyboard workflow instead.
- Do not add more exhibits until the existing five form one coherent, measurable lesson.

## Bottom line

The demo already has the hard part: a credible mathematical engine and the courage to show failures. The 10/10 version should make three promises and keep them precisely:

1. **What you see is computed.**
2. **What is toy is never presented as standard behavior.**
3. **What you do produces a concept you can explain and reproduce.**

Fix the two conceptual fidelity issues, make the release gate and mobile layout reliable, and turn the long reference page into a guided sequence with seeded experiments. That would make Lattice Gentle a gold-standard educational cryptography demo rather than merely an excellent collection of interactive examples.