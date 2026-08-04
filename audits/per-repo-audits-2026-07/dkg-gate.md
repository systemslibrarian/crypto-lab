# DKG Gate: Gold-Standard Roadmap

Audit date: 2026-07-22

## Executive view

This is already a strong teaching implementation. The group layer is pinned to RFC 9496 vectors, the protocol code is compact enough to inspect, failure is explicit, the demo exposes the right intermediate values, and the current test/build/accessibility commands all pass.

The remaining work is not "add more crypto-looking material." The biggest gains are:

1. Make the GJKR claim match the exact protocol that is implemented.
2. Make every browser gate fail when it does not reach the state it claims to test.
3. Make experiments reproducible and directly comparable.
4. State the threat model property by property, using a separate adversary bound rather than overloading `t`.
5. Add pre-merge, cross-browser, mobile, and release-integrity checks.

My bar for "gold standard" would be: a reader can map every phase to a primary source, replay every result, independently verify a transcript, and trust that CI exercised every state the README says is gated.

## Verified baseline

I ran the repository as it stands:

- `npm test -- --reporter=verbose`: 7 files and all 96 tests passed. The README's count is accurate.
- `npm run build`: TypeScript and Vite passed. The production output was about 21.79 kB of gzipped JavaScript and 2.52 kB of gzipped CSS.
- `npm run test:a11y`: both current Chromium/axe theme scans passed.

The strongest existing choices should stay:

- Ristretto arithmetic remains delegated to `@noble/curves`, while RFC 9496 vectors pin the wrapper to the specification.
- The field, polynomial, VSS, DKG, and attack logic remain small, typed, and inspectable.
- The ceremony fails closed when `|QUAL| < t` and removes a disqualified dealer's whole contribution ([DKG implementation](src/dkg/dkg.ts#L115)).
- The one-tab transcript and reconstructed group secret are clearly useful teaching X-rays, not defects to remove ([transcript warning](src/dkg/dkg.ts#L64)).
- Accessibility is already treated as a deployment gate, not a post-launch aspiration ([deploy workflow](.github/workflows/deploy.yml#L26-L34)).

## P0: Before calling it the gold standard

### 1. Either implement the complete GJKR flow or narrow the claim

The main ceremony currently imports and runs Feldman dealings only ([src/dkg/dkg.ts](src/dkg/dkg.ts#L32)). The Pedersen VSS layer exists separately ([src/dkg/pedersen.ts](src/dkg/pedersen.ts#L1)), but the DKG engine does not consume it. The bias exhibit independently constructs only `C_0` values and a subset-sum attack model ([src/dkg/bias.ts](src/dkg/bias.ts#L55)). That is a sound illustration of the hiding insight, but it is not yet a complete GJKR ceremony with extraction and consistency handling.

Preferred path: add a second, complete ceremony mode whose phases follow the cited GJKR construction:

- Pedersen commit/deal and verification while contributions are hidden.
- Complaint resolution and finalization of `QUAL` before extraction.
- Feldman coefficient extraction/reveal after `QUAL` is fixed.
- The paper's consistency checks and prescribed handling of missing or invalid extraction messages.
- Public-key and final-share assembly only from the fixed qualified set.

The implementation should be derived from a cited section of the paper, especially for complaint thresholds, reconstruction, and malicious phase-two behavior. Those rules should not be improvised from the simplified exhibit.

If a full implementation is intentionally out of scope, relabel the current feature as "the GJKR hiding-commitment insight" or "a model of the bias and fix," and say explicitly that the complete GJKR extraction protocol is not implemented.

Definition of done:

- A phase table maps every message, check, and state transition to a primary-source section and notation.
- Tests cover an inconsistent `A_j` reveal, a missing reveal, a malformed share pair, and an attempted post-`QUAL` change.
- README, UI, and module comments consistently distinguish the full ceremony from the degree-zero attack model.

### 2. Publish a property-by-property threat model

The UI currently says "synchronous, honest-majority only" ([index.html](index.html#L254)), but it does not define the corruption bound or separate it from the reconstruction threshold. Introduce an adversary variable such as `f` and state assumptions independently for:

- correctness/agreement;
- secrecy of the group secret;
- output uniformity;
- availability of a later `t`-of-`n` operation;
- robustness of complaint resolution;
- authenticated private channels and reliable broadcast;
- static versus adaptive corruption;
- rushing, omission, equivocation, and denial-of-service behavior.

Do not add an unexplained rule such as `t > n/2`. The reconstruction threshold `t` and the number of corrupt parties `f` are different quantities. For example, secrecy needs fewer than `t` colluding share holders, while availability needs at least `t` responsive holders. The exact Byzantine bound then comes from the selected protocol and network assumptions.

This should also say which properties are implemented, which are illustrated, and which are assumed. Simulated private channels, a centralized transcript, and the X-ray secret are deliberate scope decisions. Missing-message, equivocation, and malicious-recipient behavior are currently unmodeled, not silently guaranteed.

Definition of done: a reader can answer "secure against whom, for which property, under which channel assumptions?" without inferring anything from the `n` and `t` selectors.

### 3. Make the browser gates prove that they reached every state

The current accessibility driver suppresses failures on nearly every important action ([e2e/a11y.spec.ts](e2e/a11y.spec.ts#L12-L33)). If a selector breaks or a click stops working, the test can scan an earlier state and still pass. Fixed sleeps add timing without proving readiness. The final switch to GJKR also replaces the naive candidate table, so one final axe scan does not retain both dynamic branches even though the README says every exhibit is driven to its post-interaction state ([README.md](README.md#L74)).

Change the gate so that:

- no required action uses `.catch(() => {})`;
- each branch is a separate named state/test, rather than a sequence that replaces prior DOM;
- semantic assertions prove the expected complaint, abort, reconstruction, candidate-table, and GJKR result appeared before axe runs;
- tests fail on uncaught page errors and unexpected console errors;
- locator/state waits replace `waitForTimeout`;
- the honest, double-down, back-down, abort, `t`-share, `t-1`-share, naive-bias, and GJKR states are all covered.

Keep the two-theme axe gate, but also run the applicable axe best-practice rules or add direct landmark assertions. The current page exposes both the shared site banner and the nested hero `<header>` as banner landmarks ([index.html](index.html#L155)); the present WCAG-tag-only scan ([e2e/a11y.spec.ts](e2e/a11y.spec.ts#L44)) does not catch that semantic duplication.

Definition of done: deliberately breaking any required button, result renderer, or landmark makes the relevant test fail before axe reports success.

### 4. Fix and gate mobile reflow

A standalone Chromium check at a 360 px viewport, after completing the ceremony, measured a 537 px root scroll width. Two sources were visible:

- the mobile hero sets a content-box element to `width: 100%` and then adds padding/border ([src/styles.css](src/styles.css#L86-L89));
- the 516 px share matrix is intended to stay inside `.scroll-region`, but still expands the root scrollable area in the completed state ([src/styles.css](src/styles.css#L330-L341)).

Use border-box sizing and explicit `min-width: 0`/containment at the relevant layout boundaries, then preserve horizontal scrolling only inside the labeled matrix/table regions. Do not mask the symptom with page-wide `overflow-x: hidden` unless the underlying containment is also fixed.

Add reflow assertions at 320, 360, and 400 CSS pixels and at 200% zoom-equivalent layouts. Targeted screenshots should cover the completed ceremony, both bias modes, and the longest labels in both themes.

Definition of done: `document.documentElement.scrollWidth <= document.documentElement.clientWidth` at each viewport, while the share and candidate tables remain independently keyboard-scrollable.

### 5. Run required checks before merge, not only before deploy

The only workflow runs on pushes to `main` and manual dispatch ([deploy.yml](.github/workflows/deploy.yml#L3-L6)). This blocks a broken deployment, but it does not stop a broken commit from landing on the default branch.

Add a read-only CI workflow for pull requests that runs install, unit tests, build/typecheck, browser behavior tests, and the accessibility gate. Keep Pages write permissions in the main-branch deployment job only. Configure branch protection so the PR checks are required.

Definition of done: a pull request with a failing protocol test, type error, mobile overflow, or unreachable dynamic state cannot merge.

## P1: Highest-return improvements after P0

### 6. Make every experiment replayable and every comparison paired

Tests have a deterministic RNG ([src/dkg/testutil.ts](src/dkg/testutil.ts#L6)), but the UI always uses fresh randomness. Add a visible seed, "new seed," and permalink/replay mechanism. Include `n`, `t`, cheat configuration, bias mode, target predicate, and schema/version in the URL state.

Most importantly, compare naive and GJKR views over the same underlying dealer scalars. Today changing mode creates a fresh run, which changes both the commitments and the key material. A paired run should hold the contributions fixed and change only what is revealed before `QUAL` is chosen. That makes the causal lesson much sharper.

Add a versioned, canonical transcript encoding. Offer a redacted/public export by default. If an X-ray export includes private shares, polynomial coefficients, or `groupSecret`, label that file as secret-bearing even though this is a demo.

Definition of done: opening the same permalink in a fresh browser reproduces the same commitments, complaints, `QUAL`, candidate set, and public key byte for byte.

### 7. Add an independent transcript verifier and adversarial property tests

Create a pure `verifyTranscript` path that consumes encoded public messages and recomputes every public invariant without trusting the generator's booleans or derived fields. It should verify commitments, complaints/reveals, qualified-set derivation, joint commitments, final shares, and public-key assembly.

Then add property-based tests across the supported `n`/`t` range, deterministic seeds, multiple malicious dealers, multiple victims, and reordered complaints. Once the full GJKR flow exists, include omissions, equivocation attempts, inconsistent extraction values, and post-qualification changes.

Useful depth checks are:

- canonical golden transcripts for honest, corrected-complaint, disqualification, abort, naive-bias, and GJKR cases;
- single-field transcript mutations that must be rejected;
- differential checks against a small independent oracle for field/polynomial identities;
- mutation testing to find assertions that execute code without constraining behavior.

Prefer this over chasing a larger raw test count or a line-coverage badge. The current 96 tests already execute the core; the next step is independent and adversarial evidence.

Definition of done: changing any committed share, reveal, `QUAL` member, joint commitment, or public key in a golden transcript causes verification to fail for a specific reason.

### 8. Tighten the randomness and bias-statistics story

`randomScalar` reduces 48 random bytes modulo the group order and correctly calls the resulting bias negligible ([src/dkg/group.ts](src/dkg/group.ts#L35-L44)). Because this demo is specifically about output bias, exact rejection sampling would be cleaner and easy to test. Add deterministic tests for zero/out-of-range rejection and retry behavior.

The bias suite's test named "stays near 1/16" uses 12 fixed seeds and only asserts that rushing wins exceed blind wins ([src/dkg/bias.test.ts](src/dkg/bias.test.ts#L59-L69)). The UI also presents `1 - (15/16)^(2^k)` as theory ([src/ui/bias.ts](src/ui/bias.ts#L152)), although subset keys are correlated and the encoding predicate should be described as approximately balanced.

Use paired deterministic trials, report a binomial confidence interval, and label the subset formula as an independence heuristic unless a proof supports the exact claim. Separately test the structural property that the GJKR selection decision is independent of hidden `A_0` values. Statistical output should illustrate the structural proof, not stand in for it.

Definition of done: displayed probability language, test names, and assertions say exactly what the experiment establishes, and repeated CI runs cannot become flaky.

### 9. Broaden browser and human-accessibility coverage

Playwright currently configures one Chromium project ([playwright.config.ts](playwright.config.ts#L14-L25)). Add small behavioral smoke suites for Chromium, Firefox, and WebKit, plus one narrow mobile profile. The full axe matrix can remain smaller if runtime cost matters.

Add checks axe cannot supply:

- keyboard-only completion of each exhibit;
- visible focus and logical focus order;
- status announcement content after each phase;
- reflow at 200% and text spacing overrides;
- reduced-motion behavior;
- no unexpected layout shift when long random values/results appear.

Targeted visual snapshots are more useful here than a single full-page image because the page is long and highly stateful.

### 10. Align the documentation with the actual UI and primary sources

The README describes four exhibits, while the UI has three and folds cheating into Exhibit 1. Later README references mix those numbering schemes ([README.md](README.md#L42-L45), [index.html](index.html#L192-L221)). Fix the numbering and keep it generated or tested if this fleet shares documentation patterns.

Add:

- a primary-source bibliography with stable links and section/page references;
- a notation table mapping paper symbols to UI/code names;
- a message-by-message sequence diagram;
- a clear distinction between "checked by tests," "demonstrated interactively," and "proved by the cited protocol";
- a browser support statement tied to the tested matrix.

## P2: Reference-project and release maturity

### 11. Harden dependency and workflow provenance

The lockfile and `npm ci` are good. For a reference project, also:

- pin GitHub Actions to reviewed commit SHAs rather than mutable major tags ([deploy.yml](.github/workflows/deploy.yml#L21-L22));
- enable Dependabot or Renovate for npm and Actions;
- pin the package-manager version with `packageManager`/Corepack;
- monitor production dependency advisories and licenses;
- generate an SBOM and attest the Pages artifact or at least publish its digest.

### 12. Add reference-project governance

The repository currently has no license, security policy, contribution guide, or citation metadata. Add an explicit `LICENSE`, `SECURITY.md`, a concise contribution/testing guide, and `CITATION.cff`. Record which version and scope any independent cryptographic review covered; do not use the word "audited" for this application unless that review actually happens.

### 13. Add post-deploy and maintenance checks

After deployment, smoke-test the real Pages URL, validate internal/related-demo links, and verify that the served asset digest matches the built artifact. Add a modest bundle-size budget so the current fast, small experience does not regress unnoticed.

An external review by someone familiar with DKG should happen after the complete protocol flow and transcript verifier stabilize. Reviewing before that would spend scarce expert time on a moving target.

## What I would not prioritize

- Do not turn this into a production networking implementation. Simulated channels are appropriate for the teaching goal; model the boundary precisely instead.
- Do not remove the share matrix or X-ray secret. They are the reason the mechanism is inspectable; keep the warnings and separate public versus secret-bearing exports.
- Do not hand-roll curve formulas. Keeping `@noble/curves` behind spec vectors is the stronger design.
- Do not add a threshold restriction without first defining the adversary bound and the property it protects.
- Do not optimize for a larger test count. Optimize for independent transcript verification, malicious transitions, and browser states that cannot silently skip.

## Recommended sequence

First, fix the mobile overflow, duplicate landmark, dynamic-state test suppression, README numbering, and PR CI. These are contained changes and immediately make the existing claims more trustworthy.

Second, decide the central scope question: full GJKR ceremony versus explicitly scoped bias model. If full GJKR is the goal, implement it together with the threat-model table and independent transcript verifier.

Third, add seeded permalinks, paired naive/fixed runs, canonical transcripts, property tests, and the cross-browser/reflow matrix.

Finally, pin the release chain, add governance files, obtain independent review, and publish the reviewed version and artifact digest.
