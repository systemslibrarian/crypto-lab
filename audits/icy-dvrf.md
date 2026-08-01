# What Would Make This Demo a 10/10 Gold Standard

Assessment date: 2026-07-20

## Executive verdict

**Current level: about 8/10.** The demo already has the difficult foundation: real
ristretto255 arithmetic, a small inspectable protocol layer, strong self-consistency tests,
clear teaching-only boundaries, a coherent five-exhibit story, and an automated accessibility
scan. It is materially better than a typical browser cryptography demo.

The remaining distance to 10/10 is not more visual polish. It is making every claim and every
visible state independently trustworthy. A gold-standard version should:

1. identify exactly which construction it implements and how it differs from each paper revision;
2. distinguish output uniqueness from liveness and selective-abort resistance;
3. keep the nonce batch, message, roster, ceremony, and transcript visibly synchronized;
4. let a user verify an exported proof rather than only re-checking an in-memory object; and
5. make the documented release commands reliably green on desktop and mobile.

## What is already strong

- The cryptographic path is compact enough to inspect. The group wrapper has framed,
  domain-separated hashing ([group.ts](src/dvrf/group.ts#L27-L60)); the DLEQ verifier checks its
  two equations independently ([dleq.ts](src/dvrf/dleq.ts#L32-L49)); and aggregation is explicit
  rather than hidden behind a framework ([protocol.ts](src/dvrf/protocol.ts#L374-L408)).
- The teaching boundary is unusually candid. The README says this is not a reference
  implementation or production randomness source ([README.md](README.md#L45-L51)), and the page
  identifies the trusted dealer, simulated network, custom ristretto255 instantiation, and lack of
  constant-time behavior ([index.html](index.html#L340-L367)).
- The core invariants are tested: direct-evaluation equality, subset independence, tamper
  rejection, per-equation blame, nonce single-use, below-threshold refusal, and multiple threshold
  shapes ([protocol.test.ts](src/dvrf/protocol.test.ts#L28-L163)). RFC 9496 vectors separately pin
  the underlying Ristretto encodings and element derivation.
- The five-exhibit sequence is pedagogically sound: setup, preprocessing, online rounds, public
  verification, then adversarial behavior. The round ladder gives the page a clear central idea.
- Accessibility is treated as a release concern rather than an afterthought. The dynamic states are
  driven before axe scans in both themes ([a11y.spec.ts](e2e/a11y.spec.ts#L8-L56)).

## Gold-standard blockers

### 01. Pin the protocol identity and publish a construction map

**Classification: provenance blocker, not a confirmed cryptographic defect.**

The repository is careful in some places to say “in the style of Icy-DVRF”
([README.md](README.md#L3-L9), [protocol.ts](src/dvrf/protocol.ts#L1-L7)) and admits that this is its
own ristretto255 instantiation rather than the paper's EVM-oriented parameterization
([index.html](index.html#L355-L363)). Elsewhere, the first viewport and Exhibit 3 call it “Icy DVRF”
and “the real protocol” ([index.html](index.html#L155-L164), [index.html](index.html#L251-L258)).

Those are stronger claims than the evidence currently supports. The Icy-DVRF ePrint had two
revisions as of this assessment, with the latest posted 2026-07-15. The repository has no
revision-pinned construction map or Icy-DVRF transcript vectors. Its 52 RFC 9496 KATs validate the
group implementation, not equivalence to the paper's DVRF construction. The custom binding-factor
transcript ([protocol.ts](src/dvrf/protocol.ts#L180-L199)), challenge transcript
([dleq.ts](src/dvrf/dleq.ts#L20-L30)), output hash, encodings, abort behavior, and setup assumptions
therefore need to be documented as deliberate choices.

**Make it 10/10:**

- Rename the first-viewport description to **“Icy-DVRF-inspired educational instantiation over
  ristretto255”** unless exact conformance is established.
- Add a versioned protocol map that cites the exact ePrint revision/date and maps every paper step
  to a function in this repository. Include group, scalar and index encodings; domain-separation
  strings; challenge inputs and order; proof serialization; DKG/dealer assumptions; participant
  selection; abort/restart semantics; and every intentional deviation.
- Freeze deterministic end-to-end transcript vectors for this construction. If an official artifact
  or vectors become available, add differential tests rather than replacing the local vectors.
- Have a cryptographer who did not author the code review the map and equations. Record scope and
  date; do not label the code “audited” unless the review actually meets that bar.

**Done when:** a reader can answer “paper revision, exact construction, exact differences, and exact
bytes hashed” without inferring anything from source code.

### 02. Correct the security story: uniqueness is not full bias resistance

The strongest prose currently collapses several different properties. It says that no `t-1` parties
can “produce, predict, or bias” the output ([README.md](README.md#L11-L14)), that cheating can “delay
the beacon, never bend it” ([README.md](README.md#L37-L42)), and that nobody can pick a nonce after
seeing the message ([index.html](index.html#L204-L209)).

The implementation does demonstrate a narrower and valuable fact: for a fixed group key and fixed
message, every valid threshold subset reconstructs the same `Gamma`, so a different valid `beta`
cannot be selected. It also demonstrates detection of the two scripted transcript mutations.

It does **not** demonstrate complete operational bias resistance. Once enough round-1 partials are
known, participants can compute the eventual `Gamma` and `beta` before responses make the proof
publishable. A coalition can then withhold and cause a selective abort. If a surrounding beacon
changes the message, committee, or fallback behavior on retry, that abort policy can bias the
distribution of *published* outcomes. Reusing the same key and exact message preserves uniqueness,
but may sacrifice liveness indefinitely. Similarly, preprocessing does not stop a party from
attempting a post-message nonce substitution; it makes that substitution unable to yield a valid
proof against the pinned commitment.

**Make it 10/10:**

- Teach four properties separately: pre-evaluation unpredictability, fixed-input uniqueness,
  public verifiability, and liveness/robustness.
- Add a “selective abort after learning the output” adversarial cast. Show that no alternate valid
  `beta` exists, while publication can still be censored.
- State the retry rule needed to preserve the no-steering claim: keep the application input fixed,
  define committee replacement explicitly, and never silently roll to a fresh candidate output.
- Replace “nobody can pick” with “a party cannot substitute a post-message nonce and still pass
  verification against the precommitted slot.”

**Done when:** every no-bias sentence states the fixed-input and liveness assumptions beside the
claim, not only in a distant disclaimer.

### 03. Make public verification genuinely independent

Exhibit 4 says anyone can verify using only the public key, message, output, and four-value proof.
The math supports that statement, but the UI does not demonstrate the trust boundary. `runVerify()`
reads `state.lastOk` directly and passes its already-parsed objects to `verify()`
([main.ts](src/main.ts#L357-L382)). A user cannot paste a proof from another tab, inspect canonical
bytes, import malformed data, or verify without first trusting the producing state machine.

**Make it 10/10:**

- Define a versioned canonical JSON/CBOR proof envelope containing construction ID, group public
  key, message bytes or encoding, `beta`, `Gamma`, `R_B`, `R_P`, and `z`.
- Add **Export transcript** and an independent **Verifier workbench** that accepts pasted data and
  invokes a strict parser before verification.
- Reject wrong lengths, non-canonical points/scalars, unknown versions, extra/missing fields, wrong
  message/key, and tampering with every component. Show which parse or equation check failed.
- Make the verifier loadable directly by URL, without completing Exhibits 1–3.

**Done when:** a proof exported in one fresh browser context verifies in another, and a one-bit edit
fails for an intelligible reason. That is the moment “anyone can check it” becomes visible rather
than asserted.

### 04. Keep the consumed nonce batch visible and immutable

This is a confirmed teaching-state defect in the demo's central exhibit. `publishBatch()` both
creates the current batch and overwrites Exhibit 2 ([main.ts](src/main.ts#L140-L158)). At evaluation
start, the app consumes that batch and immediately calls `publishBatch(false)`
([main.ts](src/main.ts#L275-L286)). In the browser, clicking the first Step changed the displayed text
from **Batch #1** to **Batch #2** while the transcript being explained still used Batch #1.

That makes it impossible to compare the visible commitments with the binding factors and proof.
It also weakens the “committed before the message” lesson because later batches are generated
automatically after a message is already on screen.

**Make it 10/10:**

- Model nonce slots explicitly as `queued -> reserved -> spent` records with stable batch/slot IDs.
- Store the exact commitments and batch ID inside the transcript snapshot.
- Keep the consumed batch visible, mark each responder's slot **spent**, and show the next queued
  batch separately. Do not replace historical evidence in place.
- Pin batch selection before revealing the request message in the guided flow. If preprocessing is
  generated after a prior message, say it is for a distinct future request ID.
- Let the nonce-reuse attack select an actually spent slot and show a hard refusal.

**Done when:** every displayed `rho_i`, `R_i^B`, and proof can be traced back to commitments still
visible under the same immutable transcript ID.

### 05. Replace the loose globals with an explicit UI state machine

Several confirmed contradictions share one root cause: controls mutate independently while a
transcript is in progress.

- `runSetup()` clears rendered evaluation state but does not clear the module-level `current`
  transcript ([main.ts](src/main.ts#L88-L101), [main.ts](src/main.ts#L290)). Browser reproduction:
  begin one step, run a new ceremony, publish, then press Step; the enabled button renders zero steps
  until the user discovers Reset.
- The message and roster stay editable after round 1. Browser reproduction: change the field to
  “changed after round 1”; the completed five-step transcript still says “beacon round #42”.
- Changing `n` or `t` updates labels but does not invalidate the existing ceremony and downstream
  outputs ([main.ts](src/main.ts#L76-L86), [main.ts](src/main.ts#L562-L574)).
- Cheat controls exist for every party regardless of the selected roster. Browser reproduction with
  parties 1–3 selected and party 5 set to corrupt `Gamma`: the result says “party 5 corrupts” and
  also “all selected parties responded honestly,” then succeeds. The summary is built from all
  selected cheat controls, not participating cheats ([main.ts](src/main.ts#L456-L476)).
- “Honest majority delivers” is incorrect terminology for thresholds such as 2-of-7; the relevant
  condition is an honest threshold ([main.ts](src/main.ts#L521-L551)).

**Make it 10/10:**

- Use one discriminated state model such as `unconfigured`, `preprocessed`, `evaluating(snapshot)`,
  `completed(transcript)`, and `aborted(transcript)`.
- Snapshot ceremony ID, threshold, message bytes, roster, nonce slot IDs, and cheat cast when an
  evaluation starts. Render only from the snapshot.
- Either lock upstream controls during a run or make every upstream edit explicitly cancel and
  invalidate descendants. A new ceremony must atomically clear `current`, proofs, comparisons,
  attack output, and spent/queued nonce references.
- Disable or label cheat controls for nonparticipants and summarize only effective cast members.
- Use “honest threshold” rather than “honest majority.”

**Done when:** no visible control can describe different data from the transcript currently being
rendered, and Back/Reset/New ceremony are deterministic transitions covered by browser tests.

### 06. Make the documented accessibility gate reliably pass

The underlying axe result is currently clean, but the documented command is not reliable. On this
machine:

- `npm run test:a11y` failed both tests at Playwright's default 30-second test timeout: dark theme
  timed out before the final attack interaction, and light theme timed out during axe analysis.
- `npx playwright test --timeout=120000` passed both themes with zero reported violations.

The `120_000` value in the current config applies only to starting the preview server
([playwright.config.ts](playwright.config.ts#L17-L22)); it is not a test timeout. The test also uses a
fixed sleep ([a11y.spec.ts](e2e/a11y.spec.ts#L53-L56)), which adds time without proving readiness.

**Make it 10/10:**

- Set an evidence-based test timeout in Playwright config, remove fixed sleeps, and wait on stable
  application state instead.
- Split the long journey into focused state fixtures or seed deterministic states so axe does not
  repeatedly pay for unrelated cryptography and scrolling.
- Keep one full keyboard journey as a separate functional test. Axe does not validate logical focus
  order, understandable announcements, or whether every workflow is operable without a pointer.
- Require the exact documented command to pass repeatedly on a clean checkout and in CI.

**Done when:** `npm run test:a11y` passes three consecutive local runs and the CI gate has no
timeout-only flakes.

### 07. Eliminate mobile horizontal overflow and test completed states

At a 390 x 844 viewport, the completed page had a `375 px` document client width but a `396 px`
scroll width. The hero children were the offenders. The mobile rule sets `.cl-hero-why` to
`width: 100%` while it also has padding and a border, with no border-box sizing in the page stylesheet
([style.css](src/style.css#L102-L111)). Because this hero block is marked as fleet-managed, its
source-of-truth should be fixed rather than patched only in this repository.

**Make it 10/10:**

- Apply consistent border-box sizing in the shared component and reapply it across the fleet.
- Add viewport assertions at 320, 390, 768, and desktop widths after the longest dynamic states:
  seven parties, full proof, compare table, abort/blame table, and both themes.
- Assert `scrollWidth <= clientWidth` and capture visual-regression screenshots. Axe does not detect
  this class of layout failure.

**Done when:** there is no page-level horizontal scroll at supported widths and long values wrap
inside their owning panel rather than widening the document.

## High-leverage finishing work

### 08. Quantify and source the comparison, not just the slogans

The round ladder is the best teaching device on the page, but “1 vs 3 vs 2 rounds” and “linear vs
constant-size” need an explicit comparison basis. Add citations and a compact matrix for online
broadcast rounds, messages per party, proof bytes, verifier group operations/pairings, setup model,
and preprocessing/storage cost. Label values as measured, derived, or paper-reported.

Serialize the current proof and show its actual size. In this construction, three encoded Ristretto
points plus one canonical scalar should have a concrete byte count; displaying it is stronger than
saying “four values.” Show the size staying fixed while `t` changes, alongside the growing round-1
transcript that is deliberately not part of the final public proof.

### 09. Add UI regression tests for the invariants users can see

The 78 unit tests validate protocol functions, while the two browser tests are accessibility scans
([a11y.spec.ts](e2e/a11y.spec.ts#L69-L81)). That division allowed all confirmed state defects above
to escape. Add focused Playwright tests for:

- new ceremony during a partial walk;
- message, threshold, and roster edits invalidating downstream state;
- transcript batch ID matching displayed commitments;
- nonparticipant cheat controls having no contradictory summary;
- export in one context and import/verify in another;
- below-threshold, abort, retry, and nonce-reuse paths;
- keyboard-only completion; and
- no horizontal overflow in longest completed states.

Keep the cryptographic unit suite, then add property-based coverage for roster permutations,
threshold shapes, deterministic transcript serialization, parser rejection, and pathological RNG
outputs such as a zero candidate. A zero dealer key would make the output predictable, so key
generation should explicitly reject and resample invalid secret-key candidates even though the
probability under a healthy CSPRNG is negligible ([group.ts](src/dvrf/group.ts#L40-L44),
[protocol.ts](src/dvrf/protocol.ts#L153-L163)).

### 10. Make the result portable and reproducible

Add a share/download action for the canonical transcript, a deterministic “replay this transcript”
mode, and a concise construction/version fingerprint in every export. Include the exact app commit,
protocol-map version, curve suite, domain-separation version, and message encoding. This turns a
one-tab animation into a reproducible educational artifact.

For repository reproducibility, declare the expected Node/package-manager versions, keep using
`npm ci`, and pin third-party GitHub Actions by immutable commit SHA. The lockfile already gives npm
dependency integrity; the manifest's caret ranges are not themselves exact version pins
([package.json](package.json#L12-L23)).

## What is deliberately not required for 10/10

- **A production DKG implementation.** The trusted dealer is a clearly stated scope decision and the
  suite already links to VSS/DKG-adjacent material. A small, correct explainer is better than folding
  an unaudited DKG into this page.
- **Production side-channel hardening.** The page correctly says it is not production crypto. Keep
  that boundary rather than implying that browser JavaScript can become a beacon implementation
  through incremental hardening.
- **A real distributed network.** A deterministic network simulator with delay/drop controls could
  help teach rounds, but actual sockets and deployment complexity are not necessary to prove the
  educational point.
- **More decoration or animation.** The highest-value work is provenance, security precision,
  independent verification, state consistency, and reproducible evidence.

## Release bar for a 10/10 claim

A 10/10 label is justified when all of the following are true:

| Area | Required evidence |
| --- | --- |
| Construction | Revision-pinned protocol map, deterministic transcript vectors, documented deviations, independent equation review |
| Claims | Fixed-input uniqueness, unpredictability, selective abort, robustness, and retry assumptions taught separately |
| Verification | Canonical export/import verifier works across fresh contexts and rejects malformed/tampered input |
| State | Ceremony, message, roster, nonce batch, cast, and proof share one immutable transcript ID |
| Tests | Unit, build, UI, keyboard, mobile overflow, and axe commands pass using the documented scripts |
| Responsive UI | No horizontal overflow or incoherent wrapping in longest dynamic states at supported widths |
| Reproducibility | Construction version, app commit, dependencies, and transcript bytes can be replayed independently |

## Evidence recorded during this assessment

- `npx vitest run --reporter=verbose`: **78/78 tests passed** across four files.
- `npm run build`: **passed** TypeScript checking and the production Vite build; generated JavaScript
  was `50.78 kB` (`20.09 kB` gzip).
- `npm run test:a11y`: **failed 2/2 by the default 30-second timeout**.
- `npx playwright test --timeout=120000`: **passed 2/2**, with zero axe WCAG 2.1 A/AA violations in
  the tested dark and light dynamic states.
- Browser reproduction: first Step replaced displayed **Batch #1** with **Batch #2**.
- Browser reproduction: new ceremony during an active walk left Step enabled but rendered zero
  steps until Reset.
- Browser reproduction: the field could show a changed message while the completed transcript kept
  the old message.
- Browser reproduction: a nonparticipating party could be described as cheating while the result
  simultaneously said every selected party was honest.
- Browser measurement at 390 x 844: `clientWidth = 375`, `scrollWidth = 396`.

The core mathematics passed every repository test exercised here. This assessment does not claim an
algorithmic mismatch with Icy-DVRF; it says the repository has not yet published enough
revision-specific evidence to let an independent reader establish equivalence. Closing that gap,
then fixing the confirmed state and release issues, would make the demo a defensible gold standard.
