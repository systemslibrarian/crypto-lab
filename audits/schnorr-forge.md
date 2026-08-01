# Schnorr Forge: Gold-Standard Roadmap

Date reviewed: 2026-07-22

## What "gold standard" should mean here

Schnorr Forge should be a reference-quality teaching lab: correct on adversarial
inputs, precise about its security limits, unusually clear about the parts of
BIP-340 that textbook Schnorr leaves out, usable without a mouse at phone and
desktop sizes, and backed by tests that exercise the shipped experience.

The goal is not more panels. The goal is that a learner, educator, or engineer
can use the lab to answer three questions with confidence:

1. What bytes does BIP-340 actually sign and verify?
2. Why did this exact signature pass or fail?
3. Which parts of this demo are specification-conformant, and which are only
   educational simplifications?

## Verified baseline

This is already a strong foundation. These claims were checked locally rather
than inferred from the README:

- `npm test`: 43 of 43 tests pass across four suites.
- `npm run build`: TypeScript and the Vite production build pass.
- Production assets are small: 24.49 kB gzip JavaScript and 2.47 kB gzip CSS.
- `npm run test:a11y`: both dark- and light-theme axe scans pass.
- All 19 official BIP-340 vectors are verified, and the eight signing vectors
  reproduce their expected signatures in
  [src/schnorr/vectors.test.ts](src/schnorr/vectors.test.ts).
- The hand-written signer is checked byte-for-byte against Noble in
  [src/schnorr/bip340.test.ts](src/schnorr/bip340.test.ts).
- Nonce-reuse recovery and the scoped textbook aggregation example have focused
  tests.
- The five exhibits form a coherent progression: sign, understand, break,
  validate, then aggregate.

## P0: Fix before calling it reference-grade

### 1. Make byte parsing strictly fail closed

`hexToBytes()` in [src/schnorr/field.ts](src/schnorr/field.ts) checks whether
`parseInt()` returns `NaN`, but `parseInt()` accepts valid prefixes. A pair such
as `0g` is therefore interpreted as zero instead of rejected. This currently
affects user-entered private keys and would become more serious in a future
paste-to-verify tool.

Change:

- Strip the whitespace the UI intentionally permits, then validate the entire
  normalized string against a hex-only expression before parsing.
- Keep the even-length check.
- Add table-driven tests for `0g`, `g0`, `ff_`, signs, prefixes, Unicode lookalikes,
  odd lengths, empty input, and allowed whitespace.
- Add a dedicated test file for field and encoding boundaries.

Acceptance:

- No malformed pair is partially parsed.
- Every parser failure has a stable, useful reason.
- Valid upper- and lower-case encodings round-trip exactly.

### 2. Remove the mobile horizontal overflow

A Playwright check at a 390 px viewport produced `scrollWidth = 396` and
`clientWidth = 375`. The 346.4 px hero container has two children rendered at
381.6 px. In [src/style.css](src/style.css), the mobile hero main retains an
intrinsic width larger than its flex container, while `.cl-hero-why` combines
`width: 100%` with horizontal padding under content-box sizing.

Change:

- Make mobile hero children shrinkable with `min-width: 0`.
- Give full-width padded children `box-sizing: border-box`.
- Fix the managed hero source as well as this generated copy so a later sync
  cannot reintroduce the defect.
- Add geometry assertions, not only screenshots.

Acceptance:

- No horizontal document overflow at 320, 360, 375, 390, 768, or 1440 px.
- Every hero child stays within its parent at each tested width.
- Long equations and 64-byte signatures wrap without widening the page.

### 3. Correct the page landmarks and skip destination

The rendered page currently exposes two `banner` landmarks: the shared site
header and the nested `.cl-hero` header. The deduplication script in
[index.html](index.html) only demotes implicit headers that are direct children
of `body`, so it misses the hero inside `#app`. The skip link also targets the
application wrapper rather than the main content.

Change:

- Make the hero a non-landmark element or explicitly give it `role="group"`.
- Give `<main>` a stable ID and point "Skip to content" to it.
- Verify that activating the skip link moves keyboard focus to the main region.

Acceptance:

- `getByRole('banner')` returns exactly one element.
- `getByRole('main')` returns exactly one element.
- The skip-link test proves both scrolling and focus transfer.

### 4. Tighten security language and claims

The implementation is well tested, but the project's own BIP-340 layer is not
independently audited. Several comments and UI strings also say that different
messages "never" produce the same deterministic nonce. The intended security
claim is that reuse is computationally negligible under the hash assumptions,
not mathematically impossible.

Change:

- Describe this layer as "specification-conformant and differentially tested,"
  not audited.
- Replace absolute nonce-collision language in
  [src/schnorr/bip340.ts](src/schnorr/bip340.ts),
  [src/ui/signPanel.ts](src/ui/signPanel.ts), and
  [src/ui/attackPanel.ts](src/ui/attackPanel.ts).
- Add a short threat-model section to the README and the in-app safety note:
  JavaScript cannot guarantee constant-time execution; this page deliberately
  renders private keys and nonces; extensions, injected scripts, and developer
  tools can read them; no browser demo should protect real funds.
- Be precise about Noble too: its implementation is independently audited, but
  JavaScript runtime timing guarantees remain limited.

Acceptance:

- No text claims nonce collision is impossible.
- No text implies the hand-written layer received an external audit.
- The UI and README explain what "not production crypto" concretely means.

## P1: Make it the best place to learn BIP-340

### 5. Add an independent Verify Workbench

The current Sign & Verify panel only verifies signatures it just created. A
reference lab should also let users paste artifacts from another implementation.

Add inputs for:

- X-only public key.
- Signature (`R.x || s`).
- Message with UTF-8 and hex-byte modes.
- Curated malformed presets: wrong lengths, `R.x >= p`, `s >= n`, invalid curve
  x-coordinate, changed message, and changed public key.

Show verification as an explicit pipeline:

1. Parse lengths and encodings.
2. Lift the public key and `R.x` to even-y points.
3. Recompute the tagged challenge.
4. Compute both sides as full points.
5. Return the exact acceptance or rejection reason.

Acceptance:

- Official vectors can be pasted without transformation.
- Each malformed preset reaches and labels the intended rejection branch.
- The workbench agrees with Noble for valid and invalid randomized cases.
- Verification requires no private key.

### 6. Expose the BIP-340-specific trace, not only textbook Schnorr

[src/schnorr/bip340.ts](src/schnorr/bip340.ts) already records `d0`, effective
`d`, public-key parity, `k0`, effective `k`, nonce parity, and auxiliary bytes.
Most of that is hidden in the UI. This is the most valuable unused teaching
asset in the repository.

Add an optional "BIP-340 details" disclosure that shows:

- Why x-only keys select an even-y representative.
- `d = d0` or `n - d0` depending on public-key parity.
- Auxiliary randomness, the masked secret `t`, and the nonce tagged hash.
- `k = k0` or `n - k0` depending on commitment parity.
- The exact 32-byte boundaries in `R.x || P.x || m`.
- Which displayed values are secret and which may be published.

Keep the current three-step explanation as the default. The detail layer should
deepen it, not bury the clean equation.

Acceptance:

- A learner can explain why textbook `s = k + e*x` needs parity normalization
  to become BIP-340.
- Every displayed intermediate comes from the real signing path.
- A signing-vector preset reproduces all available official intermediate values.

### 7. Treat messages as bytes

The UI currently converts text to UTF-8, while BIP-340 signs byte arrays and the
official vectors include non-text and variable-length messages.

Change:

- Add a UTF-8 / hex segmented input mode to signing and verification.
- Display byte length and the exact encoded bytes.
- Include presets for empty, 32-byte, short, and long messages from the official
  vectors.
- Preserve leading zero bytes in hex mode.

Acceptance:

- Text and its UTF-8 hex representation produce the same signature.
- Arbitrary valid hex, including `00`, round-trips without normalization.
- Invalid byte input fails before any cryptographic operation.

### 8. Turn rejection reasons into a teaching exhibit

The verifier already returns exact reasons, but the vectors table only reports
whether the implementation matched the specification. Let each row expand to
show the full public key, message, signature, expected verdict, actual verdict,
and verifier stage/reason.

Acceptance:

- Full values are available to keyboard and touch users; do not rely on `title`.
- Rejected vectors explain the invariant they violate.
- A "Load in Verify Workbench" action transfers only public artifacts.

### 9. Add lightweight learner checks

After each core exhibit, offer one optional prediction before revealing the
result, for example:

- Will changing only the message preserve verification?
- Which term cancels when a nonce is reused?
- Is naive key aggregation safe against a malicious participant?

These should be state-based interactions with immediate explanations, not a
score, account, or gamification system.

Acceptance:

- Every check targets one misconception observed in the existing lesson.
- All checks work with keyboard and screen readers.
- The main lab remains usable without completing them.

## P1: Make the proof as strong as the lesson

### 10. Expand cryptographic assurance

The current Noble differential check uses one fixed key and message. Raise
confidence in the hand-written layer with deterministic, reproducible property
tests:

- Compare signatures and verification with Noble across many keys, messages,
  auxiliary values, and message lengths.
- Exercise scalar and coordinate boundaries: `0`, `1`, `n - 1`, `n`, `p - 1`,
  and `p` where applicable.
- Property-test byte/hex round trips and strict parser rejection.
- Check every verifier rejection branch directly.
- Keep attack and aggregation properties, including parity combinations.
- Add targeted mutation testing for range checks, parity normalization, tagged
  hash domains, and subtraction order in key recovery.

Use fixed seeds and print the seed on failure so CI failures are reproducible.

Acceptance:

- Every branch in the fail-closed verifier has a named test.
- Randomized differential tests are deterministic in CI.
- The suite kills mutations that remove a bound, parity correction, or domain tag.

### 11. Replace the broad axe driver with explicit browser scenarios

[e2e/a11y.spec.ts](e2e/a11y.spec.ts) finds buttons by a label regex, uses fixed
timeouts, and swallows click failures with `catch(() => {})`. It then removes
`hidden` from every panel and scans a page state users cannot actually reach.
The suite passes while missing the confirmed overflow and duplicate banner.

Change:

- Drive each exhibit with role-based locators and assert its expected result.
- Never swallow an interaction failure.
- Replace fixed waits with state assertions.
- Scan each reachable panel state separately.
- Add WCAG 2.2 and axe best-practice rules alongside the current A/AA tags.
- Add keyboard tests for tab roving, Home/End, focus visibility, skip navigation,
  radio controls, stepper controls, and the vector table.
- Use one concise live announcer per interaction. Do not mark entire changing
  traces as live regions, which would create noisy screen-reader output.

Acceptance:

- Browser tests prove sign, tamper, recover, vector, and aggregate outcomes.
- A failed click or missing result fails the test immediately.
- Manual NVDA and VoiceOver checks are recorded for a release candidate.

### 12. Add browser and viewport coverage

[playwright.config.ts](playwright.config.ts) currently has one Desktop Chrome
project.

Add a compact matrix covering:

- Chromium, Firefox, and WebKit for core smoke behavior.
- At least one 390 px touch viewport and one 320 px layout viewport.
- Dark and light themes without multiplying every test combination.
- Geometry assertions for overflow and primary touch targets.

Use a 44 by 44 CSS px target for primary controls and icon buttons. Inline links
and native radio inputs may rely on sufficiently large labeled hit areas.

Acceptance:

- Core workflows pass in all three engines.
- No tested viewport has document-level horizontal scrolling.
- Theme selection persists across reload.
- Focus order and accessible names remain stable in both themes.

### 13. Gate changes before merge

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) runs only for pushes
to `main` and manual dispatch. That validates after merge, not before it.

Change:

- Add a pull-request validation workflow for typecheck, unit tests, build, and
  browser tests.
- Keep Pages permissions and deployment in the main-only deploy job.
- Make the validation job a required branch-protection check.
- Add automated dependency update PRs and review lockfile changes normally.

Acceptance:

- A failing cryptographic or browser test blocks merge.
- Pull requests never receive Pages write permissions.
- The deploy artifact is built from the same commit that passed all gates.

## P2: Polish that adds real value

### 14. Add deliberate copy and export controls

Copying 32- and 64-byte values is useful, but blanket copy buttons would treat
public keys and private nonces as equivalent. Add copy actions for public keys,
messages, signatures, and hashes. Put private keys/nonces behind explicit
reveal/copy controls with a warning.

An exported trace should be structured JSON, versioned, and marked
`containsSecrets: true` when appropriate. Never put secrets in a URL.

### 15. Add reproducible public examples

Allow a verification case or official vector to be shared through a permalink
containing only public data. Signing examples that contain a private key, raw
nonce, or auxiliary secret must not be serializable into query parameters,
history, analytics, or logs.

### 16. Record provenance and scope

Document:

- The exact BIP-340 vector source and revision.
- The Noble version used as the differential oracle.
- Which modules are hand-written and which operations Noble supplies.
- The textbook-only scope of [src/schnorr/aggregate.ts](src/schnorr/aggregate.ts).
- The fact that passing conformance tests is not an independent security audit.

### 17. Protect the current performance advantage

The current bundle is already small, so a heavy Lighthouse stack is not the
first priority. Add a simple compressed-size budget in CI and one production
smoke measurement instead.

Suggested starting budgets:

- JavaScript: at most 35 kB gzip.
- CSS: at most 10 kB gzip.
- No external network request after the app shell loads unless the user follows
  an explicit link.

## What not to change

- Keep the application browser-only. A backend would add risk without improving
  the lesson.
- Keep the three-step equation as the default explanation.
- Keep the hand-written BIP-340 layer inspectable; strengthen its tests and
  claims rather than replacing the teaching subject with a library call.
- Keep the linearity panel explicitly textbook and full-point. Do not run its
  output through BIP-340, observe a rejection, and imply that rejection explains
  rogue-key or Wagner attacks. The existing caveat correctly separates algebraic
  linearity from secure protocol design.
- Do not add more attack panels until strict parsing, independent verification,
  mobile behavior, and pre-merge gates are complete.
- Do not make every changing region `aria-live`; announce concise outcomes and
  let users navigate the detailed trace normally.
- Do not claim that JavaScript secrets can be reliably zeroized.

## Recommended sequence

1. Fix strict parsing, mobile overflow, landmarks, and security wording.
2. Add the Verify Workbench and exact-byte input modes.
3. Expose the optional BIP-340 parity and nonce-derivation trace.
4. Build explicit end-to-end scenarios and the cross-browser/mobile matrix.
5. Add deterministic differential, boundary, and mutation tests.
6. Add vector drill-down, deliberate copy/export, provenance, and size budgets.

## Gold-standard release gate

Call the lab reference-grade when all of the following are true:

- Every official vector and every verifier rejection branch has a named test.
- Randomized, reproducible differential tests agree with Noble.
- Malformed bytes cannot be partially parsed.
- External public keys and signatures can be verified without signing first.
- The UI explains even-y key and nonce normalization with real intermediates.
- The UI accepts exact message bytes as well as UTF-8 text.
- There is one banner, one main landmark, and working skip navigation.
- Core workflows pass with keyboard, NVDA, and VoiceOver.
- Chromium, Firefox, WebKit, and phone-width tests pass without overflow.
- Required pull-request checks pass before merge.
- Safety text distinguishes conformance, dependency audits, runtime limits, and
  the deliberately exposed secrets in the teaching UI.