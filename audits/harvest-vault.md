# Suggestions to Make This the Gold Standard for What It Teaches

## My Read of the Current Demo

This is already teaching the right core idea: Harvest Now, Decrypt Later is not a future breach; it is present-day collection plus future decryption. The strongest existing pieces are the three-act hero, the Mosca's Theorem calculator, the HNDL timeline, the sector presets, and the explicit correction that AES-256 is not the weak point.

To become the gold standard, the demo should shift from "excellent explainer" to "guided learning instrument." A learner should finish with four things:

1. A clear mental model of the attack.
2. A defensible understanding of `X + Y > Z`.
3. A sector-specific risk judgment they can explain to someone else.
4. A short action plan for what to do next.

## Highest-Leverage Improvements

### 1. Add a Guided Learning Path

Right now the demo has strong sections, but it relies on the learner to assemble the lesson. Add a visible progression:

1. What is harvested?
2. What breaks at Q-Day?
3. Why does time matter?
4. Is my sector at risk?
5. What mitigations actually help?
6. What should I do this quarter?

The key is not to add more explanatory text everywhere. Instead, make each section answer exactly one question and end with a small learner checkpoint.

Good checkpoint examples:

- "Can PQC protect traffic captured last year?" Answer: no.
- "If data must remain secret for 30 years and migration takes 5 years, does a 10-year Q-Day estimate create risk?" Answer: yes, because `5 + 30 > 10`.
- "Does AES-256 fail under Shor's algorithm?" Answer: no; the public-key handshake is the main HNDL target.

### 2. Add a Final Risk Brief Generator

The Mosca calculator is the heart of the demo. Make it produce a copyable one-page brief from the selected sector and slider values.

The brief should include:

- Sector selected.
- `X`, `Y`, and `Z` values.
- The calculation and verdict.
- Q-Day estimate year.
- Latest migration start year.
- Whether the user is already behind schedule.
- Top three mitigations for that profile.
- One sentence explaining what cannot be retroactively fixed.

This would turn the demo from educational into useful. The learner can take the output to a manager, board, IT director, faculty member, or procurement discussion.

### 3. Make the Sources First-Class

The README cites important real-world claims, and the timeline includes some source strings, but the app should expose evidence more consistently.

Add a compact "Evidence" drawer or source links beside major claims:

- 2013 Snowden disclosures and mass encrypted traffic collection.
- NIST PQC standards: FIPS 203, 204, 205.
- NSA CNSA 2.0 transition dates.
- FBI/CISA/NIST Year of Quantum Security messaging.
- Mosca's theorem source.
- Resource estimate papers used in the timeline.
- Cloudflare PQC deployment and migration statements.

This matters because the topic is easy to dismiss as speculative. Gold-standard teaching should separate:

- Confirmed present behavior: encrypted traffic is collected.
- Standardized response: PQC algorithms exist and migration guidance exists.
- Forecast uncertainty: exact Q-Day timing is unknown.
- Risk logic: `X + Y > Z` remains useful under uncertainty.

### 4. Teach Uncertainty Better

The `Z` slider is useful, but the demo would teach better if it showed uncertainty as a range, not only a single selected estimate.

Add a three-scenario comparison:

- Aggressive Q-Day: 2028.
- Center estimate: 2030.
- Conservative planning: 2035.

For the selected sector, show three verdict chips side by side. This teaches that the exact date is not the lesson. The lesson is whether the organization survives the plausible range.

This is probably the single best way to prevent false precision.

### 5. Add Misconception Cards

The demo already corrects one major misconception: "we use AES-256" is not enough. Make that pattern explicit with a short misconception section.

Suggested cards:

- "We use AES-256, so we are safe." Mostly wrong for HNDL, because the handshake can expose the session key.
- "We can wait until quantum computers arrive." Wrong, because the ciphertext may already be collected.
- "PQC migration fixes old traffic." Wrong, unless the relevant protection was in place before collection.
- "Q-Day has to be exactly 2030 for this to matter." Wrong, because Mosca's theorem works across date ranges.
- "This only matters to governments." Wrong, because healthcare, legal, finance, libraries, and research data can remain sensitive for decades.

These would make the demo more memorable because learners often retain corrected misconceptions better than standalone facts.

### 6. Improve the Sector Risk Matrix

The current matrix is good, but it can become a teaching centerpiece.

Add these upgrades:

- Clicking a dot should select that sector in the Mosca calculator, not only show text in the matrix info box.
- Each dot should show `X`, `Y`, `X + Y`, and risk level on focus or click.
- Add a legend explaining color and axis meaning.
- Add a toggle for `Z = 4`, `Z = 8`, and `Z = 12` so learners see dots move between risk states.
- Add a "why this sector is here" explanation for each dot.

This would connect the abstract formula to real institutional profiles.

### 7. Add an Assessment Mode

Gold-standard teaching should check whether the learner actually understood the lesson.

Add a short quiz or challenge mode at the end:

1. Given `X`, `Y`, and `Z`, identify the verdict.
2. Choose which mitigation protects future traffic only.
3. Choose which mitigation can reduce already-harvested exposure.
4. Identify whether RSA/ECC, AES, or SHA is the main HNDL problem.
5. Pick the safer migration start date for a sector.

Keep it small. Five questions is enough. The goal is retrieval practice, not a course exam.

### 8. Add a "What To Do Monday" Section

The mitigation cards are accurate, but the demo should end with operational next steps.

Suggested structure:

First 30 days:

- Inventory public-key cryptography: TLS, VPN, SSH, S/MIME, code signing, certificates, APIs, backups, vendor links.
- Identify long-sensitivity data flows.
- Turn on TLS 1.3 and forward secrecy where missing.
- Ask vendors for PQC roadmaps.

Next 90 days:

- Pilot hybrid key exchange where supported.
- Update procurement requirements.
- Reduce retention of sensitive logs and archived communications.
- Create a migration owner and timeline.

Next 12 months:

- Prioritize high-sensitivity, high-retention systems.
- Move new systems to PQC-ready libraries and protocols.
- Track standards and browser/server support.
- Re-run the Mosca estimate quarterly.

This would make the demo usable for leadership and practitioners.

### 9. Make the Threat Model More Explicit

Add a compact threat model panel that says:

- Attacker capability: records encrypted traffic today and stores it.
- Target: public-key handshake or key establishment, mainly RSA/ECC/DH/ECDH/ECDSA contexts.
- Future capability: cryptographically relevant quantum computer running Shor's algorithm.
- Result: recovered keys or signatures allow retroactive reading or forgery depending on protocol and context.
- Non-goal: claiming every encrypted database or every symmetric cipher is broken.

This prevents overclaiming and makes the educational claim more defensible.

### 10. Add Protocol-Level Examples

The current teaching is conceptually strong. It would be stronger with concrete examples.

Add examples like:

- Classical TLS with RSA key exchange: especially vulnerable to retrospective decryption if captured.
- TLS with ECDHE: classical forward secrecy helps against later server key compromise, but ECDHE itself is quantum-vulnerable if the handshake transcript is captured and a quantum computer later solves the elliptic curve discrete log.
- TLS 1.3 with hybrid X25519 + ML-KEM: stronger migration path because the attacker must defeat both classical and post-quantum components.
- Stored encrypted files: different threat model; HNDL mainly concerns traffic and key establishment, not magically breaking AES-256 ciphertext.

That distinction would raise the technical quality a lot.

## Smaller Product Polish

- Add a persistent progress indicator so learners know where they are in the lesson.
- Add "copy result" buttons for the Mosca verdict and risk brief.
- Add shareable URL parameters for sector and slider values.
- Add a reset button for the calculator.
- Add keyboard-visible selected states for matrix dots and timeline events.
- Add a glossary for HNDL, Q-Day, PQC, PFS, ML-KEM, ML-DSA, Shor, Grover, RSA, ECC, ECDHE.
- Add a print stylesheet for the final brief.
- Add a "confidence labels" pattern: confirmed, estimate, illustrative, recommendation.

## What I Would Avoid

- Do not make Q-Day look like a certain date.
- Do not imply AES-256 is broken by quantum computers.
- Do not imply PQC can save traffic already collected before migration.
- Do not bury the learner in standards acronyms before they understand the harvest/decrypt split.
- Do not add more animation unless it teaches a specific state change.
- Do not make the tone more alarmist; make the evidence and decision logic stronger.

## Suggested Implementation Order

If I were turning this into the gold-standard version, I would do it in this order:

1. Add source/evidence affordances for the strongest claims.
2. Add the three-scenario `Z` comparison to the Mosca calculator.
3. Make matrix dots select sectors and explain their placement.
4. Add the copyable risk brief generator.
5. Add misconception cards.
6. Add the five-question assessment mode.
7. Add the "What To Do Monday" action section.
8. Add URL parameters and print/export polish.

That order improves credibility first, then comprehension, then usefulness.

## The North Star

The gold-standard version should make a learner able to say:

"HNDL means encrypted traffic can be stolen today and decrypted later. The main risk is public-key cryptography in key establishment and signatures, not AES-256 itself. Mosca's theorem says we are at risk when migration time plus data sensitivity lifetime exceeds the time until quantum capability. Because the Q-Day date is uncertain, we plan across a range. PQC protects future traffic, not old harvested traffic. Forward secrecy, hybrid key exchange, crypto inventory, and data minimization are the practical next steps."

If the demo reliably gets learners to that paragraph, it is doing the job at a very high level.