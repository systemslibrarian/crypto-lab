# Crypto Lab PAKE Gate — Suggestions

## Overall Assessment

PAKE Gate is one of the most rigorous and technically ambitious Crypto Labs.

It does much more than place four protocol names beside animated arrows. The repository contains four real, inspectable PAKE engines with explicit phase machines:

- SRP-6a;
- J-PAKE;
- CPace; and
- Dragonfly.

The project also has an unusually strong validation story:

- RFC 5054 published vectors anchor the SRP arithmetic.
- Published CPace vectors anchor the Ristretto/SHA-512 core.
- Independent Python known-answer generators check the pinned J-PAKE, Dragonfly, and custom SRP profiles.
- Group elements are validated according to each protocol’s own rules rather than through one permissive decoder.
- The wire serializes and clones messages before delivery.
- A branded `Password` versus `Hex` type barrier helps prevent the password from entering a wire message accidentally.
- Unit tests cover protocol phases, tampering, wrong passwords, malformed elements, group invariants, breach economics, and known-answer vectors.
- The newest Playwright suite checks the actual visible claims for all four protocols.

The latest browser-test work is particularly strong. It now requires that:

- both parties’ fingerprints and complete revealed key bytes agree before the page displays success;
- neither party claims confirmation after a wrong password;
- every curated tamper operation fails closed with a named reason;
- step counts agree with the messages that actually crossed the wire;
- scripted and manually stepped runs produce the same transcript;
- Reset clears the transcript and verdict together;
- the observer displays exactly the transmitted messages;
- the SRP verifier attack genuinely can miss;
- the Dragonblood graph’s fixed-work and variable-work series behave as described; and
- changing a password retires the completed verdict immediately.

The main remaining weaknesses are not basic PAKE algebra. They are concentrated in:

1. exact standards-profile boundaries;
2. random-scalar generation;
3. the difference between a candidate key and a confirmed application key;
4. secret destruction after abort or reset; and
5. a few attack panels that present a demonstration as though it were a proof.

## What Improved Most

### 1. The Browser Claims Suite Has Real Teeth

The newest suite checks relationships, not phrases.

For an honest run, it verifies:

- two fingerprints exist;
- the fingerprints are identical;
- both flags say confirmed;
- complete revealed key bytes are identical;
- no abort card exists; and
- the result surface says the run confirmed.

For a tampered or wrong-password run, it verifies:

- the alarm is visible;
- the cause is named;
- the altered wire card is marked;
- no two matching confirmed keys remain; and
- the rejecting card carries the failure reason.

Mutation testing showed that inverting key equality or removing stale-result retirement causes targeted test failures. That is an excellent standard.

### 2. Custom Profiles Are Documented Honestly

The repository does a better job than most educational crypto projects at separating:

- what an RFC specifies;
- what an RFC leaves open;
- what the lab pins as a concrete profile; and
- which values come from an independent locally generated KAT rather than an official vector.

The SRP track split is especially good:

- Track 1 validates RFC 5054 Appendix B arithmetic.
- Track 2 is explicitly labelled a custom 4096-bit/SHA-256 teaching profile for `K`, `M1`, and `M2`.

### 3. The SRP Breach Attack Is Earned

The candidate list is independent of the current password.

The default weak password is present, so the normal lesson still lands, but a password outside the list produces an honest miss. The learner can add candidates and make the attack succeed deliberately.

That correctly teaches:

> A breached verifier supplies an offline test; it does not magically reveal every password.

### 4. Protocol-Specific Group Validation Is Strong

The implementation correctly avoids one universal “reject identity everywhere” rule.

Examples include:

- SRP canonical range and zero-mod-`N` checks;
- J-PAKE subgroup checks with field-specific identity rules;
- canonical Ristretto decoding and identity rejection;
- P-256 point-format and curve validation; and
- Dragonfly reflection checking.

### 5. Guided Disclosure Works Well

Opening with one SRP walkthrough, plain-language scratchpad terms, and only **Honest run** / **Wrong password** gives newcomers a usable entry point.

The **Go deeper** gate then reveals:

- all four protocols;
- notation;
- the observer;
- tamper operations;
- breach economics; and
- the Dragonblood panel.

This is one of the collection’s better progressive-disclosure designs.

## Priority Recommendations

### 1. Correct or Relabel the Dragonfly Password-Element Profile

This is the highest-priority standards-fidelity issue.

The source describes the honest Dragonfly path as an accurate RFC 7664 derivation, but it differs from the RFC in load-bearing details.

#### Identity input

The implementation first encodes each identity as:

```text
uint16(length) || NFC(identity)
```

and then orders those encoded blobs.

RFC 7664 constructs the base from the contributed identities themselves:

```text
max(Alice, Bob) || min(Alice, Bob) || password || counter
```

The lab’s length-prefixed identity rule is a reasonable custom profile decision, but it should not be described as the exact RFC formula.

#### Y-coordinate parity

The implementation selects the point’s y parity from the low bit of `temp`, the KDF output.

RFC 7664 saves the low bit from `base` and uses that bit to choose between the two possible y coordinates.

That changes the deterministic password element.

#### KDF label

The custom label:

```text
Dragonfly-PAKE-Gate-PE-v1
```

is permissible as a use-specific label, but it reinforces that this is a pinned PAKE-Gate profile rather than a literal reproduction of a separately deployed Dragonfly ciphersuite.

Recommended options:

#### Option A — Exact RFC mode

- Use the exact identity-byte convention required by the selected application profile.
- Save the low bit from `base`, not `temp`.
- Publish fixed RFC-formula vectors from an independent implementation.
- Label the application-specific KDF label explicitly.

#### Option B — Honest custom-profile mode

Rename the implementation:

> **PAKE-Gate Dragonfly profile based on RFC 7664**

List every profile decision beside the panel.

The independent Python generator currently appears to validate the same pinned profile, so agreement between the TypeScript and Python code does not by itself catch a shared interpretation error.

### 2. Stop the Dragonfly Counter at 255

The Dragonfly counter is one octet.

The implementation serializes it as:

```text
counter & 0xff
```

but permits the loop to continue until 4,000.

After counter 255, the serialized counter wraps and repeats earlier candidates.

Recommended changes:

- enforce `1 <= counter <= 255`;
- enforce `1 <= k <= 255`;
- abort with a named failure when no element is found by counter 255;
- remove the 4,000-iteration fallback; and
- add boundary tests at 254, 255, and 256.

Never silently repeat a password-element candidate sequence.

### 3. Generate Scalars With Rejection Sampling

`randInt()` claims to return a uniform integer in `[1, max−1]`, but it computes:

```text
OS2IP(randomBytes(48)) mod (max−1) + 1
```

This creates two problems.

#### The range is too narrow for the MODP profiles

For 3072- and 4096-bit group orders, 48 bytes provide only 384 random bits. The resulting exponent occupies a tiny subset of the declared interval.

That may still provide ample brute-force entropy for a teaching session, but it is not uniform over the group order.

#### Modular reduction introduces bias

Unless the random input range is an exact multiple of the target interval, `%` sampling is biased.

Recommended helper:

```text
uniformScalar(min, max):
    width = max - min + 1
    bytes = ceil(bitLength(width) / 8)
    limit = floor(2^(8*bytes) / width) * width
    repeat:
        r = random bytes interpreted as integer
    until r < limit
    return min + (r mod width)
```

Use protocol-specific intervals:

- SRP private exponents: the documented profile range;
- J-PAKE `x1/x3`: zero may be allowed by the protocol, while `x2/x4` must be nonzero;
- Schnorr proof nonces: nonzero in the subgroup order;
- Dragonfly private and mask: strictly greater than 1 and less than the order; and
- other protocol-specific scalars as required.

Publish the selected exponent policy. A fixed 256- or 384-bit exponent profile can be defensible, but it must not be called uniform over a 4096-bit group.

### 4. Use the CPace Draft’s Scalar-Sampling Rule

CPace currently converts 32 random bytes to an integer and reduces modulo the Ristretto group order.

The draft recommends a specified scalar-sampling method, such as:

- clearing the high bits above the group-order bit length and rejecting invalid values; or
- another uniform sample in `[1, order−1]`.

Implement the exact draft-selected method and add deterministic tests for:

- zero rejection;
- top-bit handling;
- order-bound rejection;
- no modular-reduction bias; and
- published scalar fixtures.

### 5. Do Not Export Session Keys Before Confirmation

J-PAKE, CPace, and Dragonfly expose `sessionKeyBytes` as soon as candidate key material has been derived.

The SRP client similarly exposes `K` after producing `M1`, before verifying `M2`.

The UI displays an unconfirmed flag, which is good, but the engine API still makes candidate material look like an application-ready session key.

Recommended interface:

```ts
get candidateKeyBytes(): Uint8Array | undefined
```

for the educational scratchpad, and:

```ts
exportSessionKey(): Uint8Array
```

that succeeds only in the final confirmed phase.

Before confirmation, it should throw:

```text
key not confirmed
```

Use the confirmed export in all application-facing examples.

This makes the security boundary structural:

> A matching calculation is not an established authenticated session until key confirmation succeeds.

### 6. Destroy Candidate Keys and Secrets on Abort

When a confirmation or proof fails, the phase changes to `aborted`, but traces retain values such as:

- password-derived scalars;
- private exponents;
- premaster secrets;
- raw shared points;
- candidate session keys;
- confirmation keys;
- masks; and
- proof nonces.

Add a best-effort `destroy()` or `abortAndDestroy()` path for every engine.

On abort and Reset:

- overwrite mutable `Uint8Array` secrets;
- clear references to large `bigint` and point objects;
- remove key material from view models;
- clear revealed DOM values;
- cancel pending UI timers; and
- ensure `exportSessionKey()` remains unavailable.

State honestly that JavaScript cannot guarantee physical memory zeroization, but logical destruction and ownership discipline still matter.

### 7. Hide CPace’s Raw `K` by Default

The CPace draft says the intermediate shared point `K` must not be exposed because leakage can enable an offline dictionary attack.

The lab currently renders `K` in the ordinary peer scratchpad.

Internal state inspection is legitimate in a teaching tool, but this particular value deserves a protocol-specific warning.

Recommended presentation:

- show a short fingerprint by default;
- place the complete point behind:
  > **Reveal forbidden internal K**
- add:
  > CPace applications must export ISK, not raw K. This lab reveals K only to explain the derivation.
- ensure the public observer/transcript never includes K.

The generic “production interfaces must never expose session keys” warning does not fully capture CPace’s specific prohibition.

### 8. Fix the Mislabeled “Balanced Transcript” Column

The SRP breach panel receives:

```text
this.transcript()
```

from the active SRP run.

It then labels that data:

> A captured balanced-PAKE transcript.

The security contrast is useful, but the artifact shown is not a J-PAKE, CPace, or Dragonfly transcript.

Choose one:

#### Accurate SRP comparison

Rename the column:

> **Passive SRP transcript**

Explain:

> The ordinary SRP wire transcript alone does not provide the direct verifier-comparison test shown on the right. The offline test comes from the stolen `{salt, v}` record.

#### True balanced comparison

Generate a separate J-PAKE or CPace transcript and display that actual transcript in the left column.

Do not pass one protocol’s transcript and label it as another family.

### 9. Rename the Balanced-Transcript Scan

The balanced side of the breach panel tests each candidate by scanning the transcript for recognizable literal encodings.

That is a useful leak audit, but it does not prove that a transcript provides no offline password-verification equation.

A password can be absent as a literal byte sequence while a flawed protocol still leaks a password-dependent test.

Rename the action:

> **Scan for obvious password encodings**

Rename the verdict:

> No literal encoding leak found.

Place the stronger claim in a separate card:

> Under the PAKE security model and correct protocol execution, a passive transcript does not provide a direct offline password test.

That claim should be tied to the relevant protocol specification/security analysis, not to the string scan.

### 10. Correct the CPace Confirmation Caption

The CPace runner says:

> A sends a MAC over the whole transcript.

The actual tag is computed over that party’s own prior `Y` and associated data, using a MAC key derived from the transcript-bound ISK.

Recommended wording:

> A sends a confirmation MAC over its own public contribution and associated data. The MAC key comes from the transcript-bound ISK, so a peer with a different transcript or password cannot verify it.

This distinction matters because the displayed formula should match the prose exactly.

### 11. Call SRP `M1` an Evidence Hash, Not a MAC

The custom SRP profile computes `M1` as a hash over public values and `K`.

It is not HMAC.

Replace:

> sends a MAC M1

with:

> sends the profile’s key-evidence hash M1

or:

> sends a proof value derived from K and the transcript.

The same applies anywhere `M2` is called a MAC.

### 12. Add Persistent Profile Badges

The README and vector-provenance document are careful, but the live panels can still be viewed without that context.

Add badges near each protocol title:

#### SRP

> **PAKE-Gate 4096/SHA-256 profile**  
> RFC 5054 arithmetic; custom K/M1/M2 profile.

#### J-PAKE

> **PAKE-Gate J-PAKE profile**  
> RFC 8236 algebra with pinned MODP group, password mapping, HKDF, and confirmation encoding.

#### CPace

> **Draft-21 Ristretto profile + pinned confirmation**

#### Dragonfly

> **PAKE-Gate RFC-7664-derived profile**  
> until the identity and parity details are aligned exactly.

The badge should also appear in exported transcripts and known-answer views.

### 13. Use the General CPace Length Encoding for CI

`cpaceCI()` manually stores identity lengths in one byte.

The core encoding module already implements the draft’s general LEB128-style length prefix.

Recommended implementation:

```ts
return lvCat(
  utf8Nfc("CPace-CI-v1"),
  utf8Nfc(idA),
  utf8Nfc(idB),
);
```

Benefits:

- supports identities longer than 255 bytes or rejects them deliberately;
- avoids silent one-byte wrap;
- adds a context/version label;
- makes role ordering explicit; and
- uses one canonical encoding implementation.

Add validation that identities are distinct and that both parties construct identical CI.

### 14. Make CPace Context and Associated Data Interactive

The CPace panel always uses:

- a random `sid`;
- an automatically constructed CI; and
- empty associated data.

These values are load-bearing to the protocol’s binding guarantees.

Add an advanced experiment showing:

- same password, different `sid` → different ISK;
- same password, different CI → different generator and ISK;
- altered `ADa` or `ADb` → confirmation failure or different ISK;
- swapped identities → different context;
- reused sid → explicit warning.

This would make the “password plus session context” claim visible rather than purely textual.

### 15. Add a Session-Reuse Experiment

The CPace draft emphasizes fresh scalars and session identifiers.

Add:

> **Repeat session correctly**

Show:

- same password;
- same identities;
- new sid;
- new scalars;
- new public messages; and
- new ISK.

Then add:

> **Reuse scalar and sid**

Explain why deterministic transcript/key repetition is unsafe and contrary to the protocol profile.

The same two-session comparison would benefit all four tabs.

### 16. Add Identity-Binding Attacks

PAKE proves knowledge of the password in a specific protocol context. Applications must bind the right identities and roles.

Add experiments such as:

- rename Bob after Round 1;
- swap A/B identities;
- alter the server account identity in SRP;
- use the same identity on both sides in J-PAKE;
- alter CPace CI;
- reverse Dragonfly identity ordering.

Show whether the protocol:

- aborts;
- derives a different key;
- or rejects before message processing.

### 17. Clarify the Dragonblood Mitigation

The fixed-work teaching model correctly avoids claiming JavaScript is constant-time.

Keep that language.

Also make clear that:

- a flat iteration count alone does not eliminate cache, branch, memory-access, or field-arithmetic leakage;
- blinding the quadratic-residue test is separately recommended;
- modern SAE commonly uses hash-to-element alternatives rather than relying solely on a fixed loop; and
- the graph models one historical leakage signal, not the complete Dragonblood attack surface.

### 18. Validate Dragonfly Private and Mask Ranges

RFC 7664 requires the private and mask values to satisfy the protocol’s strict range.

The general factory may generate `1`, and injected tests or callers can provide invalid values.

Validate in the `DragonflyParty` constructor:

```text
1 < private < order
1 < mask < order
```

Reject before deriving a commit.

After computing:

```text
scalar = (private + mask) mod order
```

continue enforcing the scalar rule.

Add tests for:

- 0;
- 1;
- `order`;
- `order + 1`;
- valid boundary values; and
- a scalar result equal to 0 or 1.

### 19. Destroy the Dragonfly Mask After Commit

The mask is intended to be ephemeral and must not remain retrievable after it has served its purpose.

The current config retains it for the lifetime of the party.

Recommended design:

- copy the mask into mutable local state;
- use it to construct the commit element;
- overwrite/drop it immediately;
- make subsequent access impossible; and
- add a test that a post-commit debug/export API cannot recover it.

Again, this is best-effort in JavaScript, but the state machine should model the correct lifecycle.

### 20. Cap and Cancel the Offline Grind

The SRP attack performs 4096-bit exponentiation synchronously on the UI thread for every candidate.

The learner can add an unbounded candidate field.

Add:

- a maximum candidate count;
- byte/character limits;
- deduplication before work begins;
- a work estimate;
- a Web Worker;
- a Cancel button;
- progress updates; and
- a run-generation token so stale attack results cannot reappear after inputs change.

Do not freeze the page for a large pasted dictionary.

### 21. Remove the Unsupported GPU-Speed Claim

The no-match verdict says an attacker can continue:

> at billions of candidates per GPU-day.

That figure is unsupported and potentially misleading for this specific custom SRP profile, which requires large modular exponentiation for each candidate.

Replace it with:

> at the attacker’s own offline pace, without server rate limits.

A stronger panel could measure this browser’s candidates per second and clearly label it:

> local demonstration speed—not a GPU benchmark.

### 22. Treat Password Fields as Secrets

The password fields use `type="text"`.

For an educational lab, visible input can help, but secret handling should still be deliberate.

Recommended UX:

- default to `type="password"`;
- add a visible Show/Hide control;
- warn against entering a real password;
- disable browser password-manager capture where practical;
- never copy passwords automatically; and
- clear them on **Clear session**.

Use:

> Use only a throwaway teaching password.

### 23. Make the Observer Audit’s Credential Scope Explicit

After an SRP wrong-password scenario, the current UI password may be the incorrect client password while the registration record was made with the original password.

The observer audit should state exactly what it scanned:

- client-entered password;
- registered password;
- both; or
- a specified candidate.

For SRP teaching, scanning both the registered and attempted password would be clearer.

### 24. Block Deployment on the Complete Core Gate

The repository’s normal CI is excellent:

- Node 20 and 22;
- lint;
- typecheck;
- coverage;
- complete unit tests; and
- build.

The Pages workflow independently runs:

- install;
- build; and
- Playwright.

A failure in the comprehensive `ci.yml` job does not structurally prevent the separate deploy workflow from publishing.

Recommended options:

#### Reusable workflow

Make deployment depend on a reusable core-test workflow.

#### One deployment job

Run:

```text
npm run lint
npm run typecheck
npm run coverage
npm run build
npm run test:e2e
```

before uploading `dist`.

The exact vector and phase-machine gates should block production deployment, not merely appear as a separate red check.

### 25. Rename the Browser-Test Commands

`test:a11y` runs all Playwright tests, including the functional claims suite.

Use:

```json
{
  "test:e2e": "playwright test",
  "test:a11y": "playwright test e2e/a11y.spec.ts",
  "test:claims": "playwright test e2e/claims.spec.ts"
}
```

Have Pages run:

```text
npm run test:e2e
```

Rename the workflow step:

> Browser claims and accessibility gate

### 26. Make the `runAll()` Guard Fail Loudly

The UI stops scripted execution after 64 iterations.

That is a useful infinite-loop guard, but reaching it currently appears to stop silently.

If the guard is exhausted:

- throw a named internal error;
- mark the run failed;
- do not show a partial success state; and
- include the protocol and remaining stage count.

### 27. Make Secret-State Exposure a Separate Mode

The scratchpads intentionally show:

- private exponents;
- password scalars;
- premaster secrets;
- confirmation keys;
- session keys; and
- internal points.

That is appropriate for an educational engine but unlike a safe implementation.

Add a persistent mode switch:

#### Normal protocol view

- public wire values;
- derived-state labels;
- short fingerprints.

#### Secret teaching view

- private scalars;
- raw shared secrets;
- KCK/MK/ISK;
- explicit red warning.

Do not place complete hidden secrets in DOM attributes while the mode is off.

### 28. Tighten Taxonomy Deployment Claims

Statements about current deployments—such as iCloud Keychain, Thread, WhatsApp, and other ecosystem uses—can change.

Add:

- a primary-source link per deployment;
- a last-verified date;
- wording that distinguishes current deployment, historical deployment, and conceptual similarity; and
- a neutral “not verified” state when primary evidence is unavailable.

### 29. Separate Demonstrated Invariants From Security Theorems

A visible fidelity panel would strengthen the entire lab.

#### Demonstrated directly

- the password object is not assigned to a wire field;
- the wire contains the displayed messages;
- both parties derive equal candidate keys in honest runs;
- wrong passwords fail confirmation;
- curated mutations are rejected;
- SRP verifier guesses can be checked offline;
- the modeled Dragonblood iteration count varies in the legacy path.

#### Relies on protocol analysis

- a passive balanced-PAKE transcript gives no direct offline dictionary test;
- a proof is zero-knowledge in the formal model;
- the PAKE resists active attacks beyond the curated mutations;
- the selected group and hash profile meets a target security level;
- side-channel resistance; and
- production endpoint security.

This would avoid asking a byte scan or handful of tamper tests to carry the full PAKE theorem.

## Protocol-Specific Notes

### SRP-6a

Strengths:

- The verifier record contains no password field.
- Canonical A/B checks and the `u != 0` abort are present.
- M1 and M2 are checked before both sides display confirmed status.
- The custom profile is carefully documented and independently generated.

Recommended additions:

- label M1/M2 as profile-specific evidence hashes;
- export K only after M2 verification on the client;
- show account-identity binding explicitly;
- add an unknown-user simulation with response equalization to discuss enumeration;
- discuss verifier theft versus total server compromise;
- distinguish protocol authentication from application session creation.

### J-PAKE

Strengths:

- Schnorr proof verification precedes password-mixed key derivation.
- Received elements receive field-specific identity and subgroup checks.
- Participant IDs must differ.
- Explicit confirmation is present.

Recommended additions:

- use profile-sized rejection sampling for exponents and proof nonces;
- expose ISK only after peer confirmation;
- add identity-swap and replay tests;
- verify every received message’s declared sender/step/protocol type rather than trusting the runner;
- provide a visible profile badge for the chosen group, password mapping, HKDF, and confirmation encoding.

### CPace

Strengths:

- The core matches published draft-21 Ristretto/SHA-512 vectors.
- Generator derivation, transcript ordering, ISK, and confirmation are inspectable.
- Identity points and shared identity are rejected.
- Session ID is freshly generated by the runner.

Recommended additions:

- use the draft’s scalar sampler;
- hide raw K;
- expose only confirmed ISK;
- use canonical length-value CI construction;
- make CI, sid, and AD interactive;
- add replay/session-reuse experiments;
- bind a version/profile label into every application context.

### Dragonfly

Strengths:

- Commit scalar and element validation are explicit.
- Reflection is rejected.
- Confirm tags are checked before final success.
- The Dragonblood teaching model is separated from the honest engine.

Recommended additions:

- align the PE formula exactly or relabel the profile;
- use base-bit parity;
- stop the one-byte counter at 255;
- validate private/mask ranges;
- destroy mask after commit;
- implement the recommended blinding or state its absence more prominently;
- keep SAE and RFC Dragonfly framing clearly separate.

## Recommended Test Additions

1. Dragonfly’s password element matches an independent RFC-formula vector.
2. Dragonfly y parity is derived from the saved base bit.
3. Dragonfly counter 255 is accepted and 256 is never serialized by wrapping.
4. Dragonfly `private = 1` and `mask = 1` are rejected.
5. Dragonfly mask material is unavailable after commit.
6. SRP and J-PAKE large-group exponent generation follows the documented distribution.
7. Rejection sampling never returns zero or an out-of-range value.
8. CPace scalar generation follows the draft’s top-bit/range rule.
9. Every protocol’s application-key export fails before confirmation.
10. Candidate keys are cleared after an abort.
11. Reset removes all revealed secret bytes from the DOM.
12. CPace raw K is hidden unless a dedicated warning is acknowledged.
13. The SRP breach panel never labels an SRP transcript as balanced.
14. The literal-password scan is labelled as a leak audit, not a proof of PAKE security.
15. CPace confirmation captions match the actual tag input.
16. SRP M1/M2 are never called HMACs.
17. CI construction rejects oversized or ambiguous identities.
18. Altering CPace CI, sid, ADa, or ADb changes the derived result or aborts.
19. Reusing CPace sid/scalars triggers the intended teaching warning.
20. J-PAKE identity swaps are rejected or derive a different confirmed context.
21. An in-progress SRP grind can be cancelled.
22. Replacing the password while an attack runs discards the old result.
23. `runAll()` guard exhaustion produces a named error.
24. Deployment executes lint, typecheck, coverage, vectors, build, claims, and accessibility before upload.
25. Current deployment claims carry a source and last-verified date.

## Suggested Teaching Sequence

A refined sequence could be:

> Password model → Public transcript → Candidate key → Explicit confirmation → Application key → Passive observer → Active tamper → Credential-store breach → Side channels → Profile and implementation limits

The central distinction should remain visible:

```text
candidate key derived
        is not
authenticated key confirmed
        is not
safe application session established
```

A second important distinction:

```text
password absent from the wire
        is not by itself
proof that no offline password test exists
```

## Final Verdict

PAKE Gate is already among the collection’s best labs.

Its strongest qualities are:

- four real PAKE state machines;
- careful group validation;
- official and independent vectors;
- explicit custom-profile documentation;
- a thoughtful compile-time password/wire barrier;
- honest SRP breach economics;
- a separated Dragonblood teaching model;
- excellent progressive disclosure; and
- a browser claims suite that now verifies the page’s conclusions.

The next release should focus on exact protocol boundaries and secret lifecycle:

1. align or relabel Dragonfly’s password-element derivation;
2. eliminate counter wrapping;
3. replace modular scalar reduction with protocol-correct rejection sampling;
4. export only confirmed application keys;
5. clear secrets on abort and reset;
6. hide CPace raw K by default;
7. correct the mislabeled transcript comparison;
8. separate leak scanning from PAKE security proof;
9. bind CI/sid/AD visibly in CPace; and
10. make the complete unit/vector/coverage/browser gate block deployment.

With those changes, PAKE Gate would not merely show that passwords stay off the wire. It would teach the harder and more valuable lesson:

> A PAKE is secure only when its exact profile, context binding, randomness, confirmation, key-export boundary, credential-storage model, and side-channel behavior are all implemented correctly.

## Primary References

- RFC 5054 — Using the Secure Remote Password Protocol for TLS Authentication
- RFC 8236 — J-PAKE: Password-Authenticated Key Exchange by Juggling
- RFC 8235 — Schnorr Non-interactive Zero-Knowledge Proof
- draft-irtf-cfrg-cpace-21 — CPace
- RFC 7664 — Dragonfly Key Exchange
- RFC 9807 — OPAQUE
- Dragonblood: Vanhoef and Ronen, 2019
