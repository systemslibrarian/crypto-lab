# What Would Make This Demo a 10/10?

## Bottom line

The cryptographic implementation is already unusually strong for a teaching demo. It uses real primitives, runs a real two-party handshake, exposes honest limitations, tests the claims it makes, and lets the learner inspect actual bytes produced by the Rust core. The remaining gap is not more cryptography. It is a clearer learning journey.

A 10/10 version should ensure that a learner can answer these questions after one guided session:

1. Which layer protects against which adversary?
2. Why did knowing Navajo not give Joe Kieyoomia the codebook?
3. Why are encryption, authentication, and transport obfuscation different jobs?
4. Why is a valid signature insufficient without a pinned identity?
5. Why is nonce reuse catastrophic only when the key repeats too?
6. What does this symmetric ratchet provide, and what does it not provide?
7. Which post-quantum property is being claimed: confidentiality, authentication, or both?

The current console contains the evidence needed to teach nearly all of that, but it asks learners to discover the lesson by manipulating a large control surface without a prediction-and-debrief loop. The biggest upgrade is to turn the console into a short sequence of experiments while preserving free exploration.

## What is already excellent

- **The central claim is precise.** The demo distinguishes the codebook from the language layer instead of repeating the misleading idea that rarity of language was itself strong cryptography.
- **The Kieyoomia result is executable.** The fluent-speaker control can be toggled, and the corresponding claim is held by `kieyoomia_linguist_without_codebook_recovers_nothing` in [codetalker-core/tests/ablation.rs](codetalker-core/tests/ablation.rs).
- **The demo is not simulated.** The values shown in [web/index.html](web/index.html) come from [codetalker-core](codetalker-core/src/lib.rs) through [codetalker-wasm](codetalker-wasm/src/lib.rs).
- **The recipient and adversary are both visible.** This avoids the common mistake of showing only that an attacker failed without showing whether the intended channel worked.
- **The nonce lesson is honest.** The demo uses two real ciphertexts, shows the XOR relation, reports the crib bound, and correctly avoids claiming a break when a ratchet causes the key to change.
- **Authentication is taught correctly.** The implementation demonstrates that a signature can be valid under the attacker's identity and still fail to authenticate the intended peer.
- **The post-quantum claim is split correctly.** KEM confidentiality and signature authentication are shown separately.
- **The limitations are unusually candid.** [README.md](README.md) distinguishes a symmetric ratchet from a Double Ratchet, rejects production use of the transport layer, and calls out WASM side-channel limitations.
- **The engineering evidence is excellent.** Known-answer tests, property tests, fuzzing, feature-matrix tests, browser configuration coverage, supply-chain checks, artifact checks, and a coverage floor make “real primitives” a defensible claim.

This is already close to a 9/10 technical artifact. It is closer to a 7/10 self-guided lesson because the learner has to infer the intended sequence and causal conclusions.

## The highest-impact changes

### 1. Add a guided experiment mode

Keep the existing console as **Explore**, but make **Guided lab** the default first-run experience. Use five short experiments with one control change at a time:

| Experiment | Starting state | Learner changes | Expected observation | Concept |
|---|---|---|---|---|
| Kieyoomia | Full stack | Give the adversary a fluent speaker | Recovery stays at metadata only | Language recognition is not possession of the codebook |
| Obscurity only | Full stack | Disable key agreement and AEAD while retaining transport | The wire looks transformed, but plaintext is recovered | Obscurity is not confidentiality |
| Active attacker | Full stack | Disable peer authentication | The handshake succeeds with the attacker as peer | Encryption without identity does not stop MITM |
| Two-time pad | AEAD on, ratchet off | Repeat the nonce | Message 2 is recovered only as far as the message 1 crib | Nonce and key reuse together are catastrophic |
| Ratchet earns its place | Previous state | Enable the ratchet while nonce repetition remains injected | Recovery returns to metadata only because the message key changes | Nonce uniqueness is per key; fresh keys change the result |

Each step should have exactly four beats:

1. **Predict:** “What will the adversary recover?”
2. **Change one thing:** Highlight only the relevant control.
3. **Observe:** Animate or outline the exact output fields that changed.
4. **Explain:** Give a two-sentence causal debrief and name the adversary defeated or enabled.

Do not hide the controls or replace the console with slides. The educational value comes from seeing that one controlled change produces one observable consequence.

### 2. Add presets with shareable state

Add compact scenario controls for:

- Full stack
- Kieyoomia test
- Obscurity only
- MITM succeeds
- Nonce reuse breaks
- Ratchet prevents pad reuse
- Classical versus post-quantum

Presets should set the switches and messages, then leave everything editable. Encode the state in the URL so an instructor can link directly to an experiment and learners can submit or discuss an exact configuration. Include a reset control.

This is more useful than adding more toggle explanations: it gives the existing controls an intentional order.

### 3. Put the threat model beside the verdict

The current verdict says what was recovered, but not which attacker model produced that result. Add a compact live matrix derived from [THREAT_MODEL.md](THREAT_MODEL.md):

| Adversary | Current configuration |
|---|---|
| A1 passive observer | Defended / exposed |
| A2 active MITM | Defended / exposed |
| A3 key compromise at time T | Past messages bounded / archive exposed |
| A4 future quantum attacker | Defended / not defended |
| A5 local side channel | Out of scope |

Every red or green result should include a short “because” clause. For example: “A2 exposed because peer authentication is off,” not merely a cross icon.

This also fixes a subtle teaching ambiguity: “channel holding” is never universal. It only holds against a named adversary and for named assets.

### 4. Make the learner predict before revealing the result

The page currently recomputes immediately. That is excellent for exploration but weaker for retention. In guided mode, ask the learner to choose one prediction before the relevant toggle is applied:

- Full plaintext
- Partial plaintext
- Metadata only
- Handshake rejected
- Successful delivery to the wrong peer

Then reveal the result and keep a small score such as “4 of 5 causal predictions correct.” This is not gamification for its own sake; prediction exposes misconceptions that passive reading does not.

### 5. End with a transfer challenge

The final task should present a goal, not a recipe:

> Configure the channel to resist a passive observer and an active MITM, use classical primitives, and deliberately omit forward secrecy. Explain which future compromise remains possible.

Then add a second challenge:

> Construct the smallest configuration in which nonce repetition recovers message 2 from a crib for message 1. Explain why each selected condition is necessary.

The demo should validate the configuration and ask for a one-sentence explanation. This tests whether learners can transfer the model instead of merely replaying the tour.

## Clarify the concepts at the point of use

### Layer explanations

Each layer needs a brief expandable explanation with the same schema:

- **Job:** What security property it provides.
- **Attacker:** Which threat it addresses.
- **Off means:** The concrete failure the console will show.
- **Historical analogue:** Where the analogy is useful and where it stops.
- **Modern analogue:** A careful protocol comparison when appropriate.

Avoid describing the layers as a single ladder from weak to strong. They solve different problems. Transport obfuscation, confidentiality, authentication, forward secrecy, and post-quantum resistance are not interchangeable quantities.

### Terms worth defining

Add an inline glossary for KEM, AEAD, nonce, transcript, associated data, pinning, ratchet, forward secrecy, post-compromise security, crib, metadata, and harvest-now-decrypt-later. Definitions should be one sentence, available by focus as well as hover, and should not interrupt experienced users.

### Ratchet wording

Be especially precise here:

- This is a **symmetric hash ratchet**, not the Signal Double Ratchet.
- It provides forward secrecy for deleted earlier message keys.
- It does not provide post-compromise healing because there is no new Diffie-Hellman input.
- In this demo, it also prevents repeated nonces from repeating a keystream because every message uses a fresh key.

The console should visualize this with `key 1 != key 2` rather than relying on two long hexadecimal values for the learner to compare manually.

### Metadata wording

Show exactly what remains visible in the selected configuration:

- Channel existence
- Timing and frequency
- Quantized wire length
- Frame structure, if transport is disabled

The transport layer should never receive a generic “secure” status. [THREAT_MODEL.md](THREAT_MODEL.md) correctly says that metadata is not protected beyond length quantization; the UI should say the same beside the bytes.

## Improve the visual explanation, not the visual decoration

The current restrained console aesthetic fits the subject. A 10/10 revision does not need a redesign. It needs stronger visual causality:

- Flash or outline changed values after a toggle: verdict, recipient, nonce, key equality, wire length, and affected threat row.
- Add an explicit equality indicator between frame values: `same nonce`, `same key`, or `different key`.
- Let a learner focus a hexdump legend item to highlight its bytes and show one sentence about that field's purpose.
- Use a short handshake sequence diagram that changes when authentication is disabled, making it visible that the attacker becomes the peer.
- Collapse raw root keys and full transcript hashes behind “inspect internals.” They are valuable evidence, but they compete with the primary lesson for novice attention.
- Preserve the immediate side-by-side display of adversary recovery and intended-recipient delivery.

Do not add decorative cryptography imagery, oversized marketing sections, or simulated packet animations. They would dilute the strongest property of this demo: the output is real and inspectable.

## Historical and ethical release gate

This is not optional polish. [SOURCES.md](SOURCES.md) says to contact the Navajo Code Talkers Museum and the Navajo Nation Museum before public publication. A 10/10 version should treat community review as a release criterion.

Ask reviewers specifically about:

- Whether the Kieyoomia framing is accurate, respectful, and sufficiently contextualized.
- Whether naming his torture is appropriate in this teaching context and how it should be presented.
- Whether the phrase “the codebook was doing the work” is too reductive about operational security, language knowledge, training, and historical conditions.
- Preferred terminology, pronunciation support, links, and attribution.
- Whether the project should direct attention or donations to a community institution.

The historical section should remain visible in the main experience, not be reduced to a citation footnote. The technical analogy must also state its limit: a modern KEM is not literally equivalent to a manually distributed military codebook.

## Accessibility requirements

A teaching demo is incomplete if the experiment cannot be operated or interpreted without a mouse or color perception.

- Announce verdict changes through an `aria-live` region.
- Give every switch an accessible name, state, and description.
- Implement full keyboard behavior for the frame tabs, including arrow-key navigation.
- Do not use red/green or hex colors as the only carriers of meaning; pair them with labels and patterns or borders.
- Provide a non-hexdump structured view for screen-reader users.
- Keep glossary explanations available on focus and touch, not hover only.
- Test at 200% zoom, narrow mobile width, dark/light themes, reduced motion, and high contrast.
- Avoid auto-moving focus when the learner changes a control.

## Instructor and assessment support

Add one concise instructor guide with three delivery formats:

| Format | Suggested use |
|---|---|
| 10 minutes | Kieyoomia result plus obscurity-only contrast |
| 30 minutes | Five guided experiments with prediction and discussion |
| 60 minutes | Full lab, transfer challenges, and threat-model debrief |

Include:

- Learning objectives and prerequisites.
- Expected outcomes for every preset.
- Common misconceptions and diagnostic questions.
- A printable or downloadable observation sheet.
- A no-spoilers student lab and a separate answer key.
- Discussion prompts about analogy limits and ethical historical framing.
- A short rubric based on causal explanations, not whether the learner found a particular switch combination.

The best assessment question is “why did the result change?” rather than “what did the result say?”

## Recommended implementation order

### Phase 0: publication prerequisite

1. Obtain historical/community review.
2. Revise wording and attribution based on that review.

### Phase 1: highest learning gain

1. Add Guided lab and Explore modes.
2. Add the five experiment presets.
3. Add predict-change-observe-explain steps.
4. Add reset and URL state sharing.
5. Add the live A1-A5 threat matrix.

### Phase 2: concept visibility

1. Add inline layer explanations and glossary.
2. Add same/different indicators for per-frame keys and nonces.
3. Add the metadata leakage summary.
4. Add the authentication/MITM sequence view.
5. Collapse advanced handshake internals by default.

### Phase 3: teaching package

1. Add transfer challenges and prediction scoring.
2. Add the instructor guide, student worksheet, and answer key.
3. Complete keyboard, screen-reader, zoom, contrast, and mobile checks.
4. Add browser tests for presets, URL restoration, focus behavior, and announced verdicts.

Do not prioritize new algorithms, additional KEMs, more raw metrics, or a more elaborate transport scheme. Those increase surface area without strengthening the core lesson.

## Definition of 10/10

The demo is ready to call 10/10 when all of the following are true:

- A first-time learner can complete the five guided experiments in under 20 minutes without external explanation.
- At least 80% of pilot learners correctly predict four of the five experiment outcomes after the first example.
- At least 80% can explain, in their own words, why the fluent-speaker toggle does not reveal plaintext under the full stack.
- At least 80% can distinguish passive confidentiality, active peer authentication, and forward secrecy in a transfer question.
- Learners can explain that nonce repetition becomes a two-time pad only when the key repeats too.
- Learners do not leave believing that the symmetric ratchet provides post-compromise security.
- Learners do not leave believing that padding hides timing, frequency, or channel existence.
- Every preset has a deterministic browser test and a matching Rust teaching assertion where applicable.
- The complete guided flow works with keyboard-only navigation and has a meaningful screen-reader representation.
- The historical framing has been reviewed by an appropriate Navajo community institution or advisor, with the resulting attribution recorded.
- The existing technical verification remains green across classical, post-quantum, WASM, and browser paths.

## Final recommendation

Preserve the implementation and the console's intellectual honesty. Build the next iteration around a learner making a prediction, changing one variable, seeing one consequence, and naming the adversary and asset involved. That is the shortest path from an excellent cryptographic artifact to an excellent lesson.