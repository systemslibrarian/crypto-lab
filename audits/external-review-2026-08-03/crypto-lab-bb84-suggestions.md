# Crypto Lab BB84 — Suggestions

## Overall Assessment

BB84 is now one of the strongest narrative labs in the collection.

The recent changes fixed several important credibility problems:

- Alice and Bob now derive separate keys from their own retained bits.
- AES-GCM encryption uses Alice’s key and decryption uses Bob’s, so the round trip genuinely tests agreement.
- A noisy channel now exposes the missing information-reconciliation step instead of displaying a false success.
- The page no longer describes a short raw key expanded by SHA-256 as containing 256 bits of secrecy.
- QBER counters now use the sacrificed sample as their denominator.
- The browser claims suite checks the verdict, QBER arithmetic, sifting decisions, minimap accounting, key agreement, tag failure, reset behavior, and the eavesdropping path.
- The photon inspector and Eve tally no longer overwrite each other.

Those are substantial improvements. The lab now demonstrates a real and often omitted lesson:

> Sifting and hashing do not automatically give Alice and Bob the same secret key over a noisy channel.

The remaining problems are concentrated in protocol fidelity. The largest are the attack model, verdict wording, parameter-estimation sampling, and the function currently called privacy amplification.

## What Improved Most

### 1. Step 6 Now Tests the Protocol Instead of the Cipher API

The previous implementation encrypted and decrypted with Bob’s key, which made successful decryption inevitable.

The current flow correctly performs:

```text
Alice’s retained bits
    → Alice’s derived key
    → AES-GCM encryption

Bob’s retained bits
    → Bob’s derived key
    → AES-GCM decryption
```

A tag failure now means the two sides did not establish the same key.

That is a major improvement in educational honesty.

### 2. The Missing Reconciliation Step Is Visible

The page openly shows that residual errors remain after parameter estimation.

This is valuable because many simplified BB84 diagrams jump directly from QBER estimation to privacy amplification and silently assume the keys already agree.

### 3. The Browser Claims Suite Is Substantive

The current Playwright suite checks relationships rather than static prose:

- `QBER = errors / sacrificed bits`;
- gauge, counter, caption, and banner agree;
- every KEEP/DROP follows from the displayed bases;
- the minimap totals reconcile with sent and sifted counts;
- an aborted run never reaches key derivation;
- clean-channel Alice and Bob keys match;
- noisy-channel keys differ;
- the displayed plaintext is the message the learner typed; and
- a second run replaces the first state.

### 4. The Per-Photon Teaching Layer Is Strong

The polarization decoder, sifting table, clickable photon inspector, Eve annotations, and minimap make the protocol mechanics visible rather than decorative.

## Priority Recommendations

### 1. Present Intercept–Resend as One Attack, Not Eve’s Only Option

This is the highest-priority conceptual correction.

The page currently says:

> Eve’s only option is to measure the photon and resend a new one.

and:

> Even with a quantum computer, Eve cannot do better.

That is not true.

No-cloning prevents Eve from making a perfect independent copy of an arbitrary unknown state. It does not force her to perform immediate intercept–measure–resend.

A general adversary can, depending on the security model:

- couple an ancillary quantum system to the signal;
- retain quantum information in memory;
- postpone measurement until basis information is public;
- perform optimized individual attacks;
- perform collective measurements across stored probes;
- perform coherent attacks across many signals; or
- exploit implementation defects rather than attack the ideal qubit protocol.

Recommended wording:

> This panel simulates the simplest full intercept–resend attack. A general Eve has more sophisticated quantum strategies. BB84 security does not follow from intercept–resend being optimal; it follows from a security proof that bounds Eve’s information from the observed statistics under an explicit device model.

Keep the 25% QBER result, but label it:

> **Expected disturbance from full intercept–resend in the ideal four-state model**

### 2. Replace “Eavesdropper Detected” With “Excess Disturbance Detected”

Alice and Bob observe errors. They do not observe Eve directly.

Natural noise can push QBER above the threshold, and a partial or optimized attack can remain below it. Finite samples can also miss a full intercept–resend attack.

Replace:

> **EAVESDROPPER DETECTED**

with:

> **ABORT — observed disturbance exceeds the acceptance threshold**

Replace:

> **CHANNEL CLEAN — No eavesdropper detected**

with:

> **PARAMETER TEST PASSED — observed disturbance is within the selected limit**

A useful explanatory line:

> A high QBER does not identify the cause, and a low sampled QBER does not prove that no adversary interacted with the channel. It determines whether the protocol’s security analysis permits key generation.

### 3. Randomly Select the Sacrificed Test Bits

The implementation currently sacrifices the first half of the sifted indices:

```text
siftedIndices.slice(0, sacrificedCount)
```

A real parameter-estimation sample must be chosen randomly after sifting.

Using the first half is harmless against this demo’s independent, identically distributed Eve and noise models, but it fails against time-dependent behavior. Eve could attack only later photons, allowing the first-half test to look clean while corrupting the retained key.

Recommended implementation:

1. Generate a fresh random permutation of the sifted indices.
2. Use the first portion of the shuffled list as the test sample.
3. Use the remainder as candidate key positions.
4. Display the randomly selected test positions.

Add a **Burst attack** experiment:

- Eve leaves the early photons untouched.
- Eve attacks only the latter half.
- Sequential sampling misses her.
- Random sampling exposes the bias with the expected statistical probability.

### 4. Add Finite-Sample Confidence, Not Just a Raw QBER Threshold

With only 64–512 transmitted photons, the test sample is small.

A measured QBER of zero does not mean the true channel error rate is zero. A full intercept–resend attack can occasionally produce a low sampled error count, especially at the smallest setting.

The page should display:

- sacrificed sample size;
- observed error count;
- observed QBER;
- a confidence interval or conservative upper bound;
- chosen failure probability `εPE`; and
- whether that bound permits a positive secret-key length.

For teaching purposes, a binomial confidence interval is better than a bare threshold. A more protocol-faithful finite-key model can use random-sampling bounds.

Add a panel:

> **Observed 1 error in 18 test bits does not mean the channel’s true QBER is exactly 5.6%.**

### 5. Explain What the 11% Value Actually Means

The default 11% is presented as an eavesdropper-detection threshold.

Approximately 11% is associated with an asymptotic BB84 secret-key-rate boundary under particular idealized assumptions and one-way post-processing. It is not a universal detector setting for every BB84 implementation.

The tolerable error rate changes with:

- proof model;
- one-way versus two-way post-processing;
- finite-key corrections;
- source and detector assumptions;
- decoy-state analysis;
- error-correction efficiency; and
- selected composable-security parameters.

Rename the slider:

> **Teaching abort threshold**

Add:

> The default 11% is an asymptotic reference value for an idealized BB84 analysis, not a universal operational setting.

Better still, remove arbitrary 5–20% threshold selection and let the security model calculate whether the estimated key length is positive.

### 6. Fix the Equality Boundary

The code aborts only when:

```text
qber > threshold
```

At exact equality, the page continues while saying the QBER is “below” the threshold.

Choose one rule:

```text
abort when qber >= threshold
```

or change every accepted-state phrase to:

> at or below the threshold

Add a boundary test with counts that produce QBER exactly equal to the selected threshold.

### 7. Replace the Current “Privacy Amplification” Function

This is the largest technical problem in the implementation.

The current function:

- always outputs at least 256 bits;
- can expand a short raw key;
- uses deterministic SHA-256 counter expansion;
- uses no random universal-hash seed;
- does not subtract information-reconciliation leakage;
- includes no finite-key security margin;
- includes no composable-security parameter; and
- uses a simplified `1 − 2Q` factor.

This is not a security-valid BB84 privacy-amplification calculation.

For ideal asymptotic one-way BB84, the familiar secret fraction involves binary entropy, approximately:

```text
1 − 2h₂(Q)
```

not:

```text
1 − 2Q
```

At `Q = 11%`, those are radically different:

- `1 − 2Q` remains about 0.78;
- `1 − 2h₂(Q)` is near zero.

Recommended options:

#### Option A — Rename the Current Step Honestly

Call it:

> **Teaching key formatter — SHA-256 derivation, not proven privacy amplification**

State:

> This maps the retained bits to AES-key width but does not establish additional entropy or a BB84 secrecy bound.

#### Option B — Implement Toy Privacy Amplification

Use a randomly selected two-universal hash, such as a Toeplitz matrix:

```text
final length
  <= estimated smooth min-entropy
     − error-correction leakage
     − verification leakage
     − security margin
```

Publish the random hash seed because it does not need to be secret.

The output must be shorter than the security bound. Never impose a 256-bit minimum.

### 8. Insert Information Reconciliation Before Privacy Amplification

The page currently uses the wrong operational order:

```text
parameter estimation
    → privacy amplification
    → discover key disagreement through AES-GCM
```

A real protocol needs:

```text
parameter estimation
    → information reconciliation
    → error verification / key confirmation
    → privacy amplification
    → application-key derivation
```

The current failure demonstration is excellent, but make the missing step an explicit numbered panel rather than silently skipping over it.

Recommended sequence:

1. Alice prepares states.
2. Bob measures.
3. Authenticated basis sifting.
4. Random parameter estimation.
5. **Information reconciliation — deliberately omitted or simulated.**
6. Error verification.
7. Privacy amplification.
8. Use the final key.

A switch could compare:

- **Skip reconciliation:** AES-GCM fails on noisy runs.
- **Toy reconciliation enabled:** keys agree, but disclosed parity information is subtracted from the privacy-amplification budget.

### 9. Add an Authenticated-Classical-Channel Attack

The README mentions authentication, but the live protocol treats the classical channel as trusted.

Without authentication, Eve can establish one BB84 key with Alice and a different BB84 key with Bob. Both quantum links can show low QBER while Eve sits in the middle.

This would be one of the lab’s strongest possible experiments:

> **Run an unauthenticated man-in-the-middle**

Show:

- Alice thinks she shares a key with Bob.
- Bob thinks he shares a key with Alice.
- Eve actually holds one key with each.
- QBER can remain normal.
- The failure is identity authentication, not quantum-state secrecy.

Explain that QKD expands authenticated keying material; it does not create identity or trust from nothing.

### 10. Fix `bitsToBytes()` Structural Collisions

`bitsToBytes()` repeats the raw bit sequence cyclically until it fills at least 16 bytes.

This creates large deterministic collisions before SHA-256.

Examples:

```text
[1]
[1, 1]
[1, 1, 1]
```

all expand to the same all-ones byte string.

Likewise, a periodic key and repetitions of that key can map to identical input material.

Pack the bits exactly and include their length:

```text
domain label
|| bit length
|| zero-padded packed bits
```

Do not repeat the key to reach a minimum byte count.

Add tests proving that:

- `[1]` and `[1,1]` produce different encoded material;
- `[0,1]` and `[0,1,0,1]` differ;
- leading zeroes are preserved; and
- empty input is rejected.

### 11. Never Derive a Fixed Key From an Empty Raw Key

When `rawKey` is empty, the current code hashes deterministic zero material and returns a fixed 256-bit value.

The core also permits a sacrifice rate of 100%, which leaves no retained key but still produces output.

Reject key generation when:

- there are no retained bits;
- the estimated entropy is nonpositive;
- the final extractable length is below the selected security target; or
- the protocol has aborted.

Return an explicit state such as:

```text
insufficient-key-material
```

### 12. Do Not Use AES-256 as Evidence of 256-Bit Security

At the available photon counts, the retained raw key is usually about 16–128 bits before accounting for Eve’s information, reconciliation leakage, or finite-key margins.

A 256-bit AES key string derived from those bits does not provide 256 bits of brute-force security.

Replace the single **Key bits** counter with:

- retained raw bits;
- estimated extractable secret bits;
- derived AES-key width; and
- protocol security parameter.

Do not enable the encryption demonstration as though it were secure when the extractable secret-bit estimate is too small. Label it clearly as a mechanics-only demonstration at teaching scale.

### 13. Add a Security-Scale Batch Mode

The animation only needs a small sample, but the cryptographic calculation can process many more signals.

Add two modes:

#### Watch mode

- 64–512 signals;
- full animation;
- no claim of a production-scale secret key.

#### Batch mode

- tens of thousands or more simulated detections;
- only a 64-photon visual sample;
- finite-key estimate;
- reconciliation leakage;
- genuine compression to a shorter key.

This would let the privacy-amplification bar finally shrink rather than stretch.

### 14. Use Exact, Unbiased Noise Sampling

Noise is currently applied with:

```text
randomByte < noiseRate × 256
```

For rates that do not map to an integer byte threshold, this rounds upward.

For example, a selected 1% noise rate becomes:

```text
3 / 256 ≈ 1.171875%
```

Use a uniform 32-bit draw and compare against a 32-bit threshold, or inject a uniform real in `[0,1)`.

Add deterministic tests for every slider value.

### 15. Separate Eve-Caused Disturbance From Channel Noise

The running Eve tally counts a final Alice/Bob disagreement as an Eve-induced misread when Eve used the wrong basis.

With nonzero channel noise, the final bit difference is not a clean causal label:

- noise may introduce an error after a correct Eve measurement;
- noise may reverse an Eve-induced error;
- a same-basis Eve interception can still be followed by a noise error.

Store distinct fields such as:

```text
bobBitBeforeNoise
eveChangedState
eveInducedMismatchBeforeNoise
noiseFlipped
finalMismatch
```

Then display:

- disturbance caused by intercept–resend;
- disturbance caused by simulated channel noise; and
- net observed error.

### 16. Correct the Minimap Categories

The minimap currently labels every basis-matched, non-sampled-error photon as “kept.”

That includes:

- sacrificed test bits that were correct; and
- retained bits on which Alice and Bob disagree but which were never publicly tested.

Those are not equivalent.

Use categories such as:

1. basis mismatch — discarded;
2. test sample — matched;
3. test sample — error;
4. retained key — Alice/Bob agree;
5. retained key — residual disagreement.

The fifth category should be labelled as a **teaching ground-truth overlay** because real Alice and Bob do not know every retained disagreement before reconciliation.

### 17. Add Partial-Interception Controls

The only Eve mode intercepts every signal.

Add an interception fraction:

```text
0%, 10%, 25%, 50%, 100%
```

The expected intercept–resend contribution to QBER scales with the attacked fraction. This would immediately show why:

- eavesdropping is statistical;
- low disturbance does not prove zero information leakage; and
- privacy amplification is required even after a run is accepted.

Do not present partial intercept–resend as the general optimal attack; it is still a teaching model.

### 18. Explain That AES-GCM Makes Message Security Computational

BB84 can establish key material with information-theoretic security under its proof assumptions.

The demo then uses AES-256-GCM. The message is therefore protected by a computational symmetric cipher, not by information-theoretic encryption.

Add a comparison:

#### AES-GCM mode

- reusable practical encryption;
- authenticated encryption;
- computational security.

#### One-time-pad teaching mode

- information-theoretic confidentiality when the key is truly uniform, secret, and at least as long as the message;
- key cannot be reused;
- separate authentication is still required.

This distinction would prevent “BB84 is information-theoretic” from being transferred automatically to every application using a QKD-derived key.

### 19. Scope the “Information-Theoretic” Table Entry

Replace:

> BB84 QKD — NO, information-theoretic

with:

> Under an authenticated classical channel, a proven device model, correct finite-key post-processing, and successful parameter estimation, BB84 can produce composably secure key material without computational assumptions about Eve.

Also clarify:

- authentication may use preshared symmetric keying material or an authenticated computational mechanism;
- implementations can violate the proof model; and
- the application cipher may still be computational.

### 20. Remove “Security Is Guaranteed by Physics” as a Standalone Claim

Physics supplies the observable constraints used by the proof. It does not automatically secure:

- source behavior;
- detector behavior;
- classical software;
- random-number generation;
- authentication;
- calibration;
- post-processing;
- firmware;
- supply chain; or
- endpoint compromise.

Recommended wording:

> Quantum mechanics constrains Eve’s interaction with the modeled signals. A complete security guarantee also depends on authenticated classical communication, a proof matching the devices, finite-key analysis, correct post-processing, and secure endpoints.

### 21. Model Photon Loss and No-Detection Events

Every simulated photon currently reaches Bob and yields a bit.

Real optical QKD is heavily shaped by:

- attenuation;
- detector efficiency;
- dark counts;
- no-click events;
- double clicks; and
- basis-dependent detection behavior.

Add a loss slider and distinguish:

```text
sent
detected
basis matched
tested
retained
```

This would also correct the implication that distance only changes convenience rather than the statistical key rate.

### 22. Add Weak-Coherent-Pulse and Decoy-State Context

Practical BB84 systems often use attenuated laser pulses rather than ideal single-photon sources. Multi-photon pulses create photon-number-splitting risks, and decoy-state methods estimate the single-photon contribution.

The current limitations text mentions multi-photon pulses only in the README.

Add a visible fidelity panel:

- ideal single photons in this simulation;
- no photon loss;
- no dark counts;
- no decoy states;
- no detector mismatch;
- no basis-dependent flaws;
- no side-channel model.

### 23. Avoid a Fixed “~100 km Maximum” Claim

“About 100 km maximum in fiber” is too categorical.

Commercial point-to-point deployments may often operate over metropolitan or regional distances, while research protocols and specialized systems have demonstrated substantially longer fiber links. Different QKD families have different rate-distance behavior.

Recommended wording:

> Fiber loss sharply reduces key rate with distance. Practical distances depend on protocol, detector technology, channel loss, trusted-node architecture, and whether newer designs such as twin-field QKD are used.

Keep current deployment claims sourced and date-stamped.

### 24. Add Sources and a “Last Verified” Date to the Deployment Panel

The panel is titled:

> DEPLOYED QKD NETWORKS (2026)

Those statements are time-sensitive.

Link directly to authoritative sources and include:

```text
Last verified: August 2026
```

Distinguish:

- operational service;
- testbed;
- deployment project;
- research demonstration; and
- planned satellite mission.

### 25. Do Not Compute Final Keys After an Abort

`runBB84()` derives Alice’s and Bob’s final keys before the UI checks `eveDetected`.

The UI correctly refuses to expose or use them after an abort, but a fail-closed core should not generate application keys from a transcript that failed parameter estimation.

Return a discriminated result:

```ts
type BB84Result =
  | { status: 'aborted'; qber: number; ... }
  | { status: 'accepted'; candidateKeys: ... };
```

Only perform reconciliation, privacy amplification, and key derivation on the accepted path.

### 26. Clear Sensitive State More Deliberately

After a successful run, key bytes and key prefixes remain in:

- module-level variables;
- DOM text;
- result objects; and
- JavaScript-managed memory.

This is acceptable for a teaching simulation, but the page should not imply that Reset guarantees erasure.

Recommended changes:

- overwrite mutable `Uint8Array` buffers before dropping references;
- clear key text from the DOM on reset or input change;
- avoid printing key prefixes unless the learner explicitly reveals them;
- add a **Clear session secrets** control; and
- state that JavaScript cannot guarantee memory zeroization.

### 27. Validate Core Inputs Explicitly

The core clamps numeric values but does not reject `NaN`, infinity, or invalid noninteger values.

Examples:

- `qberThreshold = NaN` can make every comparison false;
- `noiseRate = NaN` silently behaves unlike a valid rate;
- an invalid photon count can collapse into an empty allocation or unexpected behavior.

Validate:

- finite integer photon count;
- explicit maximum;
- finite rates in `[0,1]`;
- nonzero test sample;
- retained key material;
- supported protocol profile.

Do not silently convert invalid cryptographic parameters into a different experiment.

### 28. Add Run Cancellation

The Reset control remains visually available while a run is active, but `resetAll()` simply returns when `running` is true.

That makes the control look functional while doing nothing.

Choose one:

- disable Reset during a run; or
- turn it into **Cancel run** using an `AbortController` or monotonic run token.

Cancellation should stop:

- pending delays;
- photon animations;
- annotations;
- later step rendering; and
- stale key publication.

### 29. Make Tests Deterministic Through Randomness Injection

The unit tests use large random samples, and one browser test retries noisy runs up to five times.

The probabilities are favorable, but deterministic protocol tests are better.

Inject a randomness provider for:

- Alice bits;
- Alice bases;
- Bob bases;
- Eve bases;
- wrong-basis outcomes;
- test-sample selection;
- channel noise; and
- AES IVs where a deterministic test vector is useful.

Then build exact scenarios:

- perfect channel;
- every basis matches;
- no basis matches;
- full intercept–resend with known outcomes;
- partial interception;
- burst attack;
- threshold equality;
- residual error after the sample;
- empty retained key; and
- deterministic false-negative sample.

Keep separate statistical smoke tests if desired, but do not make CI depend on luck.

### 30. Run the Functional Claims Suite in Deployment CI

The deployment workflow runs:

```text
npm run test:a11y
```

That command targets only:

```text
e2e/a11y.spec.ts
```

The new `e2e/claims.spec.ts` suite therefore does not block deployment.

Change the workflow to:

```text
npm run test:browser
```

or define:

```json
{
  "test:e2e": "playwright test",
  "test:a11y": "playwright test e2e/a11y.spec.ts",
  "test:claims": "playwright test e2e/claims.spec.ts"
}
```

Then run `npm run test:e2e` before uploading the Pages artifact.

Rename the workflow step:

> Browser claims and accessibility gate

### 31. Add a Real Privacy-Amplification Claims Test

Once the step is replaced, the browser test should independently verify:

- random universal-hash seed is displayed;
- output length equals the calculated security budget;
- output is shorter than the corrected/reconciled raw key;
- changing the public seed changes the extracted key;
- Alice and Bob use the same seed;
- reconciliation leakage is included;
- zero or negative extractable length aborts;
- no 256-bit floor exists; and
- the displayed security parameter matches the configured failure probability.

### 32. Add a Protocol Transcript Panel

A compact transcript would make the classical communication boundary inspectable:

```text
public:
  basis announcements
  test positions
  revealed test bits
  error-correction messages
  verification tag
  privacy-amplification seed

secret:
  unrevealed reconciled key bits
  final extracted key
```

This would help learners understand why public discussion does not automatically reveal the final key—and why every disclosed bit must be accounted for.

## Recommended Test Additions

1. Test positions are randomly sampled rather than selected by order.
2. A late burst attack defeats sequential sampling and is detected probabilistically by random sampling.
3. Exact-threshold QBER follows the documented accept/abort rule.
4. Verdict text never claims the cause of disturbance is known.
5. A low-QBER partial attack is not labelled “channel clean.”
6. Finite-key upper bounds are calculated from sample size and errors.
7. `1 − 2Q` is absent from privacy-amplification logic.
8. Empty raw keys and 100% sacrifice abort.
9. `[1]` and `[1,1]` cannot derive the same encoded input material.
10. Output length never exceeds the estimated extractable secret length.
11. Information reconciliation occurs before privacy amplification.
12. Public reconciliation leakage reduces final length.
13. Key confirmation catches residual disagreement before encryption.
14. Noise probabilities match selected slider values without byte-threshold bias.
15. Eve-induced and noise-induced error counters follow their own simulated causes.
16. Minimap categories distinguish test bits, retained bits, and residual errors.
17. Aborted runs never call the application-key derivation function.
18. `NaN`, infinity, fractional photon counts, and invalid rates are rejected.
19. Reset cancels or is disabled during a run.
20. The full Playwright suite blocks deployment.

## Suggested Teaching Sequence

A refined wayfinder could be:

> Prepare states → Measure → Authenticated sifting → Random parameter sample → Statistical bound → Reconcile → Verify agreement → Privacy amplify → Use the key

A permanent fidelity card should distinguish:

### Implemented faithfully at toy scale

- random BB84 bases and bits;
- conjugate-basis measurement behavior;
- basis sifting;
- full intercept–resend disturbance;
- sampled QBER;
- separate Alice/Bob retained keys;
- AES-GCM agreement check.

### Simplified or currently omitted

- general quantum attacks;
- authenticated classical channel;
- random finite-key parameter estimation;
- photon loss;
- weak coherent pulses and decoy states;
- information reconciliation;
- error verification before key use;
- proof-derived privacy amplification;
- device imperfections;
- composable security parameters.

## Final Verdict

BB84 has improved significantly.

The strongest recent correction was allowing the protocol to fail honestly when Alice and Bob retain different bits. The page now teaches that quantum transmission alone is not enough; classical post-processing is load-bearing.

The next release should focus on four foundational corrections:

1. make intercept–resend explicitly one teaching attack rather than Eve’s only strategy;
2. report observed disturbance rather than claiming to identify an eavesdropper;
3. randomize and statistically interpret the test sample; and
4. replace the SHA-256 stretching step with either honestly labelled key formatting or an actual toy universal-hash privacy-amplification stage.

After those changes, BB84 would move from a very good intercept–resend visualizer to a much more complete explanation of how QKD turns quantum measurements, authenticated public discussion, statistical estimation, reconciliation, and entropy extraction into usable key material.

## Primary References Worth Linking

- Bennett and Brassard, *Quantum Cryptography: Public Key Distribution and Coin Tossing* (1984).
- Shor and Preskill, *Simple Proof of Security of the BB84 Quantum Key Distribution Protocol* (2000).
- Modern finite-key BB84 analyses based on random sampling and composable security.
- Leftover-hashing/privacy-amplification literature using two-universal hash families.
- ETSI QKD work on authenticated classical interfaces.
