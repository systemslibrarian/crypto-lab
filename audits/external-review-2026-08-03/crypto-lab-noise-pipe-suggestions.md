# Crypto Lab Noise Pipe — Suggestions

## Overall Assessment

Noise Pipe is one of the most sophisticated protocol labs in the collection.

The implementation is far beyond a decorative handshake animation:

- It implements the Noise `CipherState`, `SymmetricState`, and `HandshakeState` model.
- It uses real X25519, HKDF-SHA-256, SHA-256, and AES-256-GCM.
- It supports all thirteen displayed base patterns plus `IKpsk2`.
- It renders the actual message bytes, transcript hash, chaining key, temporary cipher-key state, DH operands, and post-`Split()` transport keys.
- It has known-answer tests against published Noise vectors.
- It demonstrates transport encryption, nonce counters, rekeying, tamper rejection, replay behavior, responder-key substitution, PSK mismatch, nonce reuse, and forward-secrecy concepts.
- The latest Playwright claims suite checks visible conclusions against values computed by the page rather than against duplicated hardcoded text.

The recent corrections are especially important:

1. `Split()` is now included in the displayed operation log, so the transport keys shown in the UI are the keys the engine actually derived.
2. The responder-static substitution panel now models a genuine impersonator holding the matching private key instead of incorrectly claiming that IK detects a substituted pinned key.
3. “Attack succeeded,” “defense held,” “not applicable,” and “simulation error” are now separate outcomes.
4. Stale transport and Break-it results are retired when their inputs change.
5. Published Noise vectors caught and fixed the AES-GCM nonce-endianness error.

The remaining issues are concentrated in three areas:

- state and nonce safety in the interactive transport panel;
- the difference between a public transcript and a complete secret-state dump; and
- security-property wording that is still coarser than the Noise specification’s direction- and message-specific guarantees.

## What Improved Most

### 1. The Browser Claims Suite Is Meaningful

The new claims tests verify:

- the walkthrough message count agrees with the selected pattern;
- stepping remains usable in both directions;
- `Split()` keys reach the transport panel;
- transport ciphertext length includes the AES-GCM tag;
- directional nonce counters advance independently;
- transport plaintext really comes from successful decryption;
- pattern changes retire old attack verdicts;
- responder-key substitution gives the impersonator the same transport key;
- wire segments agree with total message size; and
- attack badges match the actual outcome category.

The mutation testing described in the latest commit is exactly the right standard for this collection.

### 2. Responder-Key Substitution Is Finally Modeled Correctly

The current simulation captures the real trust-bootstrap failure:

> If the initiator is tricked into trusting an attacker-controlled responder static key, a pattern such as IK has no internal way to distinguish that key from the intended responder’s key.

Running the attacker as the responder and showing identical initiator/attacker transport keys is much stronger than merely reporting that the handshake completed.

### 3. Pattern Security Notes Are Much More Honest

The README and `patterns.ts` now acknowledge that:

- IK-family first-message payloads occur before `ee`;
- later compromise of the responder static key can expose recorded first-message content;
- IKpsk2’s `psk` token arrives too late to protect message 1;
- identity hiding is not the same as unlinkability;
- pre-shared static keys can still support offline candidate confirmation; and
- transport secrecy can differ from early-handshake payload secrecy.

That is an excellent foundation.

### 4. The Token-Onboarding Sequence Is Strong

The “Anatomy of a token” feature solves a genuine teaching problem.

Showing:

```text
my ephemeral × their static
```

rather than merely displaying:

```text
es
```

makes the role-dependent `es` and `se` interpretation much easier to understand.

### 5. The Wire View Makes Identity Protection Visible

Showing separate wire blocks for:

- ephemeral public key;
- clear or encrypted static public key;
- payload; and
- AEAD tag

is one of the strongest presentation choices in the lab.

### 6. Published Vectors Anchor the Core

The published Noise-vector tests for NN, XX, KK, and IK provide much stronger assurance than self-generated round trips.

The nonce byte-order bug is a good example of why those vectors matter: two sides sharing the same wrong implementation can agree with each other while still violating the protocol.

## Priority Recommendations

### 1. Fix Transport Reset Before Anything Else

This is the highest-priority code defect.

`resetTransport()` restores the existing transport `CipherState` objects and sets every nonce counter back to zero:

```text
same transport key
same direction
nonce reset to zero
```

If the learner sends any message, presses Reset, and sends again, AES-GCM reuses a `(key, nonce)` pair.

That is the exact catastrophic condition the lab’s own nonce-reuse panel warns against.

The existing browser test currently treats this behavior as correct by requiring Reset to return both counters to zero and allow another send. The test therefore anchors the vulnerability.

Recommended behavior:

#### Option A — Clear the Display Only

Rename the button:

> **Clear transport display**

Clear ciphertext, plaintext, and status text without touching the `CipherState` objects or nonce counters.

#### Option B — Start a Fresh Handshake

Rename it:

> **New session**

Run a fresh handshake with new ephemeral keys, replace both transport-key pairs, and then begin the new session at nonce zero.

#### Option C — Clone a Recorded Teaching Snapshot

Only acceptable when explicitly labelled as a replayable deterministic test fixture that must never be used as a live channel.

Never rewind a nonce while retaining the same key.

Add an urgent regression test:

```text
send once
clear/reset
send again
assert either:
  key changed, or
  nonce continued
```

The test must reject:

```text
same key + same nonce
```

### 2. Serialize Encryption Operations to Prevent Concurrent Nonce Reuse

`CipherState.encryptWithAd()` currently:

1. reads `this.n`;
2. derives the nonce;
3. awaits WebCrypto encryption;
4. increments `this.n`.

Two concurrent calls can both read the same nonce before either call increments it.

Rapid double-clicks, programmatic calls, or a future application integration can therefore reuse the same `(key, nonce)` pair without calling `setNonce()`.

Recommended design:

- serialize all operations on each `CipherState`;
- reserve the nonce synchronously before the first `await`;
- reject or queue overlapping encryptions;
- serialize decryptions as well;
- prevent rekey from racing with encryption or decryption; and
- disable each directional send/rekey control while that direction has an operation in flight.

Conceptually:

```text
lock state
validate n
reserved = n
n = n + 1
unlock reservation
encrypt using reserved
```

If encryption fails, do not roll the nonce backward. Skipping a nonce is safe; reusing one is not.

Add a deterministic test that launches two encryptions through `Promise.all()` and confirms they use distinct nonces and produce decryptable records in the expected order.

### 3. Replace “Export Transcript” With a Safe Public Transcript

The current export contains:

- initiator static private key;
- responder static private key;
- PSK;
- chaining keys;
- intermediate cipher keys;
- raw DH outputs;
- transport keys;
- secret state snapshots; and
- public wire messages.

That is not a transcript. It is a complete session-secret dump.

A learner may reasonably assume a button called **Export transcript** produces public diagnostic material safe to share.

Recommended public export:

```text
protocol name
pattern
prologue or prologue digest
public pre-messages
wire messages
message directions
token sequence
public ephemeral keys
public or encrypted static-key fields as they appeared on the wire
message sizes
final handshake hash
timestamps and display metadata
```

It must exclude:

```text
private keys
PSK
ck
temporary k
DH shared secrets
transport keys
decrypted hidden static keys
secret plaintext payloads unless explicitly selected
```

A separate advanced control may be provided:

> **Export secret teaching state**

That control should require an explicit warning:

> This file contains every private key and session secret. Anyone who receives it can impersonate the participants and decrypt the demonstrated session. Never collect or export this state in a real implementation.

Use a visibly dangerous style and do not make it the default.

### 4. Remove Full Secrets From the Ordinary DOM

The UI exposes full values through:

- `title` attributes;
- copy buttons;
- logs;
- state cards;
- `Split()` details; and
- exported JSON.

For a teaching lab, deliberate secret-state inspection is useful. It should nevertheless be clearly separated from normal protocol telemetry.

Recommended approach:

- show short fingerprints by default;
- add **Reveal secret teaching state**;
- label `ck`, `k`, PSK, private keys, and DH outputs as secret;
- do not place unrevealed full values in hidden attributes or tooltips;
- add **Clear session secrets**;
- overwrite mutable buffers where practical before dropping references; and
- state that JavaScript cannot guarantee memory zeroization.

A persistent warning would help:

> This lab intentionally exposes internal secrets for teaching. Production Noise implementations must not log, copy, export, or render these values.

### 5. Correct the Forward-Secrecy Experiment

The current forward-secrecy panel does not actually reconstruct the historical Noise key schedule from compromised material.

It derives an unrelated candidate key using:

```text
HKDF(zero chaining key, static DH)
```

and observes that AES-GCM rejects it.

Failure under an arbitrary guessed key is not proof of forward secrecy.

The panel also:

- tests only initiator-to-responder transport;
- does not model early responder transport;
- does not model first-handshake-message payload exposure;
- reports “both static private keys” even for patterns that possess only one or no static keys; and
- misses the Noise specification’s weak-forward-secrecy transition for patterns beginning with `K` or `I`.

Replace this with three exact experiments.

#### Experiment A — First-Message Payload Exposure

For NK, KK, XK, IK, and IKpsk2:

1. put a nonempty payload in message 1;
2. record the handshake;
3. compromise the responder static private key afterward;
4. reconstruct the correct pre-`ee` handshake state; and
5. decrypt the recorded message-1 payload.

This demonstrates the partial-forward-secrecy label directly.

#### Experiment B — Early Responder Transport

For patterns beginning with `K` or `I`, demonstrate the Noise specification’s directional nuance:

- responder sends transport before receiving a transport message from the initiator;
- later initiator-static compromise may leave that early responder traffic only weakly forward secret;
- after the initiator sends transport, subsequent responder traffic obtains the stronger grade.

#### Experiment C — Normal Post-Handshake Transport

Record transport after the required confirmation point, compromise relevant static keys, and prove that the correct historical key cannot be reconstructed without erased ephemeral private keys.

The teaching table should distinguish:

```text
first handshake payload
initiator transport
early responder transport
confirmed responder transport
```

### 6. Stop Saying the Handshake Hash “Proves Nobody Tampered”

The handshake hash `h` commits to the exact transcript and serves as channel-binding material.

It does not independently prove:

- who the peer is;
- that no man-in-the-middle created two separate handshakes;
- that a pre-known key was authentic;
- that the application associated the transcript with the intended identity; or
- that external negotiation was not downgraded.

For example, NN can be actively intercepted by an adversary who creates one valid handshake with each endpoint. Each connection has an internally consistent handshake hash.

Recommended wording:

> `h` commits to the exact protocol transcript. If the peers compare or authenticate the same final value through a trusted mechanism, it can serve as a channel binding and reveal transcript mismatch.

Replace:

> proves nobody tampered

with:

> binds every handshake byte into one transcript fingerprint

Add a small MITM experiment:

- attacker runs separate NN handshakes;
- both local handshakes complete;
- Alice and Bob have different final `h` values;
- comparing `h` through an authenticated channel exposes the split.

### 7. Separate Key Possession From Identity Verification

The page says or implies that XX “verifies” the responder static key during the handshake.

XX proves that the peer controls the private key corresponding to the static public key received during that handshake.

It does not prove that this key belongs to the intended human, server, organization, or device.

On first contact, an active attacker can run one XX handshake with each endpoint unless the application adds:

- certificate validation;
- a directory;
- QR comparison;
- key fingerprint verification;
- TOFU with persistent pinning;
- a pre-authenticated account identity; or
- another trusted binding.

Recommended trust panel:

| Question | Noise answers? |
|---|---|
| Does the peer possess this private key? | Yes, depending on pattern |
| Is this key the intended peer’s identity? | Application responsibility |
| Was a pre-known key distributed authentically? | Application responsibility |
| Is first contact protected from MITM? | Only with external trust or verification |

The responder-static swap attack should remain “not applicable” only in the narrow sense that XX has no pre-known `rs` to substitute. Add a separate **first-contact key substitution** experiment for XX/NX/KX/IX.

### 8. Refine the IKpsk2 Responder-Key Substitution Verdict

The corrected attack properly shows that a secret PSK prevents the attacker from finishing the full IKpsk2 handshake and obtaining the transport session.

However, the PSK is mixed at message 2.

The attacker controlling the forged responder static private key can already process message 1, which includes:

- the initiator ephemeral public key;
- `es`;
- the encrypted initiator static public key;
- `ss`; and
- any first-message payload.

Therefore, the strongest honest verdict is:

> The PSK blocks session completion and protects the later transport keys, but it arrives too late to protect message 1 from an attacker whose substituted responder key the initiator trusted.

Display both outcomes:

```text
message-1 identity/payload exposure: succeeded
full transport impersonation: blocked by PSK
```

Also state that this result assumes a strong, independent, nondefault PSK. In systems where the optional PSK is absent or set to an all-zero value, plain IK security applies.

### 9. Reframe the Replay Experiment

The replay panel currently reports **Attack succeeded** when a fresh responder accepts message 1.

That proves a replay surface, but not necessarily a security compromise.

For a bare `e` message, accepting a repeated ephemeral public key may only allocate state. The actual consequences depend on:

- whether message 1 contains a payload;
- whether the payload causes an application side effect;
- whether the pattern authenticates the sender by that point;
- whether the application caches handshake identifiers;
- whether the protocol adds timestamps, nonces, counters, cookies, or replay windows; and
- whether the replay can finish.

Recommended outcome categories:

- **Message replay accepted**
- **Duplicate application action reproduced**
- **Full session replay completed**
- **Replay rejected**
- **Not applicable**

Add a nonempty first-message payload such as:

```text
transfer $10
open door
register device
```

Then show whether replay duplicates the action.

For WireGuard, explain that the encrypted timestamp is application/protocol framing layered around Noise specifically to address this issue.

### 10. Replace Coarse Security Badges With Per-Direction Grades

The current comparison compresses each pattern into:

- authentication: none / one-way / mutual;
- forward secrecy: none / partial / full;
- identity hiding: none / initiator / responder / both.

Those badges are useful for orientation but flatten essential Noise details.

A more faithful comparison should show:

| Surface | Property |
|---|---|
| Message 1 payload | Noise destination grade |
| Later handshake payloads | Noise destination grade |
| Initiator authentication | source grade and when achieved |
| Responder authentication | source grade and when achieved |
| Initiator identity hiding | specification grade |
| Responder identity hiding | specification grade |
| Initiator transport | forward-secrecy grade |
| Early responder transport | forward-secrecy grade |
| Responder transport after confirmation | forward-secrecy grade |

The existing coarse row can remain as a summary, but every badge should open the exact grade table.

### 11. Correct the “Full Transport Forward Secrecy” Generalization

The README repeatedly says all transport keys are fully forward secret.

The Noise specification includes a timing and direction nuance for patterns whose first letter is `K` or `I`.

The responder’s transport messages initially have weaker forward-secrecy properties until the responder receives a transport message from the initiator. That received transport message confirms the initiator’s ephemeral participation and upgrades later responder traffic.

Recommended wording:

> Noise transport is generally forward secret because ephemeral DH contributes to the session, but the exact source and forward-secrecy grade is direction- and timing-specific. In `K*` and `I*` patterns, early responder transport has weaker guarantees until an initiator transport message confirms the session.

Add a visible “confirmation point” to the transport panel.

### 12. Let Learners Put Payloads in Handshake Messages

`runFullHandshake()` uses empty payloads for every handshake message.

As a result, the lab discusses:

- first-message payload protection;
- 0-RTT-style tradeoffs;
- payload-security grades;
- replay exposure; and
- partial forward secrecy

without displaying an actual protected payload.

Add an advanced handshake-payload mode:

- one editable payload per message;
- exact wire ciphertext and tag;
- whether a cipher key existed at that point;
- specification security grade;
- whether later static compromise exposes it; and
- whether replay duplicates it.

This would turn the lab’s most nuanced prose into executable evidence.

### 13. Add Explicit X25519 Invalid-Output Rejection

`dh()` currently returns the X25519 shared secret directly.

Noise requires the implementation to handle invalid DH public keys, including the identity/low-order cases that produce an all-zero shared secret.

Add:

```text
validate public-key length
perform X25519
constant-time check for all-zero output
reject the handshake if all zero
delete handshake state
```

Tests should include known low-order or all-zero encodings and assert that every pattern fails closed before deriving transport keys.

Do not rely on undocumented library behavior.

### 14. Validate PSK Length

Noise PSKs are 32 bytes.

The current API accepts an arbitrary `Uint8Array`.

Reject:

- missing PSK for a `psk` token;
- 0-byte PSK;
- 16-byte PSK;
- 31-byte PSK;
- 33-byte PSK; and
- oversized inputs.

Fail at initialization, not halfway through the handshake.

### 15. Enforce Noise Message-Length Limits

Noise messages are limited to 65,535 bytes.

The engine currently accepts arbitrary payload sizes and does not reject an oversized incoming message.

Add checks for:

- outgoing handshake message total size;
- incoming handshake message total size;
- token parsing boundaries;
- payload plus AEAD tag;
- transport-message framing where applicable.

Tests:

```text
65535 bytes accepted when structurally valid
65536 bytes rejected
truncated encrypted static rejected
truncated AEAD tag rejected
extra trailing bytes handled exactly as documented
```

### 16. Validate `setNonce()`, or Remove It From the Ordinary API

`setNonce()` accepts:

- negative values;
- fractions;
- `NaN`;
- infinity;
- unsafe integers; and
- values above the implementation’s ceiling.

This can produce malformed or repeated nonces.

Use a validated type and enforce:

```text
integer
finite
nonnegative
within exact supported range
```

Prefer `bigint` so the demo can model the actual `2^64 − 1` specification boundary instead of lowering the ceiling to `2^53 − 1`.

Expose arbitrary nonce setting only to test and attack helpers—not to normal transport code.

### 17. Validate Pattern State Transitions

The engine is correct for the built-in patterns, but its public classes permit invalid custom state transitions:

- a second `e` token can overwrite a prior local ephemeral key;
- another received `e` can overwrite `re`;
- another `s` can overwrite `rs`;
- duplicate DH tokens may be accepted;
- invalid pre-message combinations are not rejected;
- initialization reuse can retain logs or test ephemerals; and
- malformed patterns may fail only midway through processing.

Add a pattern-validation phase based on the Noise validity rules.

Before running a pattern, verify:

- required keys exist;
- forbidden keys are absent;
- `e`, `s`, `ee`, `es`, `se`, and `ss` occur only where legal;
- dependencies are satisfied;
- message direction and token order are valid;
- PSK modifiers are legal;
- static and ephemeral overwrite rules are enforced; and
- the protocol name matches the validated pattern.

### 18. Separate Test Hooks From the Production State Machine

`setFixedEphemerals()` is public on the normal `HandshakeState`.

It exists for valid known-answer testing, but a production caller could accidentally reuse fixed ephemeral keys.

Safer options:

- constructor-injected key generator;
- internal test subclass;
- test-only factory;
- build-time test adapter; or
- explicit dependency injection not exported from the browser entry point.

The UI path should have no API for deterministic ephemeral reuse.

### 19. Fix the Pattern-Selection Race

`selectPattern()`:

1. updates `currentPattern`;
2. starts an asynchronous handshake;
3. awaits it; and
4. assigns the result to global state.

If a learner switches patterns rapidly, an older, slower handshake can finish after a newer one and overwrite the UI.

The page can then show:

- new pattern label;
- old handshake result;
- old transport keys; and
- attack results for mismatched state.

Use a monotonic generation ID:

```text
selectionGeneration++
capture myGeneration
await handshake
if myGeneration != selectionGeneration:
    discard result
```

Clear or disable transport controls while a new handshake is pending.

Add a browser test that switches NN → XX → IK rapidly and asserts that every rendered value belongs to IK.

### 20. Fix Stale Break-It Results From In-Flight Attacks

Completed attack results are now cleared on pattern change, but an attack already running can finish afterward and repopulate the cleared result area.

Capture:

- selected pattern;
- attack run ID;
- current generation; and
- target result element.

Discard the result when any no longer match.

Disable the individual attack button while it is running, and provide cancellation when the simulation is long enough to matter.

### 21. Treat Rekey as an Application-Coordinated Event

The UI rekeys both local and remote cipher states at once.

That makes the cryptographic transformation work, but it can teach that Noise itself sends an automatic rekey signal. `REKEY()` only changes a local cipher key. The application protocol must coordinate when both sides perform it.

Add an experiment:

1. initiator rekeys locally;
2. responder does not;
3. the next record fails authentication;
4. an authenticated application control message coordinates an epoch change; and
5. both sides rekey consistently.

Display:

```text
Noise provides the primitive.
The application provides the synchronization protocol.
```

### 22. Render Actual Cipher-State Nonces

The UI maintains separate variables:

```text
nI2R
nR2I
```

alongside the real `CipherState.n` counters.

Duplicated state can drift after:

- failed encryption;
- failed decryption;
- reset;
- rekey;
- concurrent calls;
- test manipulation; or
- future refactoring.

Render the real sender and receiver counters directly.

Also display both sides:

```text
initiator send n
responder receive n
```

A mismatch should be visible as a synchronization failure.

### 23. Narrow the Nonce-Reuse Claim or Demonstrate Authentication Failure Fully

The current nonce-reuse panel correctly proves:

```text
ciphertext1 XOR ciphertext2
    =
plaintext1 XOR plaintext2
```

for the encrypted bodies.

That demonstrates immediate confidentiality loss.

The text also says AES-GCM authentication is destroyed. Reuse is indeed catastrophic for GCM, but this panel does not construct or verify a forged tag.

Choose one:

- narrow the verdict to the confidentiality result actually demonstrated; or
- add a well-scoped teaching forgery demonstration showing how nonce reuse leaks the authentication subkey relationship and enables forgery under appropriate known/chosen plaintext conditions.

Do not claim a property the panel does not execute.

### 24. Correct the “No Negotiation, Therefore No Downgrade” Message

A fixed Noise protocol name prevents in-protocol cipher-suite negotiation.

Applications may still negotiate:

- pattern;
- cipher;
- hash;
- DH function;
- version;
- feature flags; or
- fallback behavior

before initializing Noise.

If that external choice is not authenticated or included in the prologue, the application can still suffer downgrade or session-confusion problems.

Recommended wording:

> This demo selects one protocol name before the handshake. Noise has no built-in algorithm negotiation. If an application negotiates versions or patterns externally, it must bind that choice into the prologue or another authenticated context.

Add a prologue experiment:

- both sides use the same prologue: success;
- different application context or negotiated version: handshake hashes and AEAD state diverge;
- unbound external negotiation: explain the downgrade risk.

### 25. Clarify That “No CA” Does Not Mean “No Trust Distribution”

Noise does not require X.509 or a certificate authority.

Patterns that authenticate a pre-known key still require a trustworthy method to distribute or verify that key.

Possible mechanisms include:

- embedded device provisioning;
- QR comparison;
- account directory;
- signed key transparency;
- TOFU;
- DNSSEC/DANE;
- certificates;
- an organizational PKI; or
- another authenticated channel.

Recommended wording:

> Noise lets applications choose their own trust-distribution model; it does not make trust bootstrap unnecessary.

### 26. Correct the “Constant-Time Comparison” Claim

The `equal()` helper avoids an early exit, which is useful.

JavaScript and browser JIT execution do not provide a reliable constant-time guarantee.

Rename the comment:

> best-effort full-length comparison without intentional early exit

Do not use it as a production side-channel claim.

### 27. Clone and Retire Key Material Deliberately

`CipherState.initializeKey()` stores the supplied array by reference.

Recommended changes:

- validate exact key length;
- clone the incoming key;
- overwrite the previous mutable key before replacement where practical;
- clear keys when handshake state is destroyed;
- clear temporary HKDF outputs after use where practical; and
- prevent snapshots from returning mutable secret references.

Again, JavaScript cannot guarantee physical erasure, but careful ownership still prevents accidental aliasing and mutation.

### 28. Distinguish Static-Key Lifetime From Session-Key Lifetime

Every pattern selection creates new static keys, which may blur the central difference:

- static identity keys persist across sessions;
- ephemeral keys are regenerated per session;
- transport keys are derived per handshake.

Add a two-session experiment:

```text
same static identities
new ephemeral keys
new wire bytes
new handshake hash
new transport keys
```

Then deliberately reuse an ephemeral key and show why that violates the intended session model.

### 29. Use More Specific Break-It Badges

“Defense held” can imply that the Noise pattern itself supplied the defense even when the result comes from:

- AES-GCM integrity;
- a PSK;
- an application trust assumption;
- a simulator setup error;
- missing applicability; or
- an external replay layer.

Use badges such as:

- **AEAD integrity held**
- **PSK blocked session completion**
- **Trust bootstrap failed**
- **Replay surface confirmed**
- **Forward-secrecy property held**
- **Configuration mismatch detected**
- **Not applicable**
- **Simulation error**

This teaches where the security property actually comes from.

### 30. Correct Pattern Real-World Labels Where They Sound Normative

Descriptions such as:

- “early QUIC drafts”;
- “Signal X3DH-like flows”;
- “WhatsApp transport”;
- “libp2p default”; and
- ecosystem deployment statements

should have direct primary-source links and a “last verified” date when they are used as current claims.

Prefer:

> Conceptually similar use case

when a system does not literally use that exact pattern and cipher suite.

### 31. Fix Local Deploy to Preserve the Typecheck Gate

The normal build runs:

```text
tsc && vite build
```

but the local deploy script runs:

```text
vite build && gh-pages -d dist
```

Change it to:

```json
"deploy": "npm run build && gh-pages -d dist"
```

Otherwise a local deploy can publish TypeScript-invalid source.

### 32. Rename the Browser Test Commands

`test:a11y` currently runs the entire Playwright suite, including functional claims.

That is good coverage, but the script and CI step are misleading.

Recommended scripts:

```json
{
  "test:e2e": "playwright test",
  "test:a11y": "playwright test e2e/a11y.spec.ts",
  "test:claims": "playwright test e2e/claims.spec.ts"
}
```

Have CI run:

```text
npm run test:e2e
```

Rename the workflow step:

> Browser claims and accessibility gate

### 33. Use Reproducible CI Installation

The deployment workflow uses:

```text
npm install
```

Use:

```text
npm ci
```

and enable the npm cache in `actions/setup-node`.

This ensures CI tests exactly the lockfile dependency graph.

### 34. Add a Visible Fidelity and Threat-Model Panel

A compact panel would greatly reduce misinterpretation.

#### Faithful in this lab

- Noise state-machine structure;
- X25519 operations;
- HKDF-SHA-256;
- AES-256-GCM;
- protocol-name hashing;
- pre-messages;
- token sequencing;
- transcript hash;
- `Split()`;
- directional transport keys;
- nonce counters;
- Noise-vector known-answer tests.

#### Intentionally exposed or simplified

- all parties run in one browser;
- secrets are displayed for teaching;
- no network framing;
- no application identity directory;
- no certificate/TOFU/QR verification;
- no external negotiation;
- empty handshake payloads;
- replay handling is mostly absent;
- static keys are regenerated on pattern changes;
- JavaScript cannot guarantee zeroization;
- timing and side-channel resistance are not modeled.

## Recommended Test Additions

1. Transport display reset never reuses the same key and nonce.
2. Two concurrent encryptions reserve distinct nonces.
3. Concurrent encrypt and rekey operations are serialized.
4. Concurrent decryptions cannot consume the same receive nonce.
5. Rapid pattern selection cannot publish an older handshake.
6. An in-flight Break-it result cannot repopulate after pattern change.
7. Public transcript export contains no private key, PSK, `ck`, `k`, DH output, or transport key.
8. Secret-state export requires explicit acknowledgement and carries a warning.
9. X25519 all-zero shared output aborts the handshake.
10. Invalid public-key lengths are rejected.
11. PSKs of 31 and 33 bytes are rejected.
12. A 32-byte PSK is accepted.
13. A 65,535-byte message boundary is enforced exactly.
14. Negative, fractional, `NaN`, infinite, and out-of-range nonces are rejected.
15. Nonce exhaustion is tested against the actual 64-bit boundary when BigInt is adopted.
16. Duplicate `e`, `s`, or DH tokens in an invalid custom pattern are rejected before the handshake.
17. Reinitializing a state clears logs, old keys, and fixed test ephemerals.
18. IKpsk2 responder-key substitution exposes message 1 but cannot derive final transport keys without the PSK.
19. Replay is only labelled a successful attack when a replay-relevant payload or side effect is duplicated.
20. First-message payload compromise is demonstrated for each partial-FS pattern.
21. Early responder transport and confirmed responder transport receive different specification grades where required.
22. One-sided rekey causes a named synchronization failure.
23. A coordinated rekey restores communication.
24. Prologue mismatch causes the handshake to fail.
25. External negotiated parameters are shown as bound or unbound to the prologue.
26. Public transcript final `h` matches both peers.
27. Repeated sessions retain statics but rotate ephemerals and transport keys.
28. Full Playwright claims and accessibility suites block deployment.
29. Local deploy invokes the typechecked build.
30. `npm ci` succeeds from the committed lockfile.

## Suggested Teaching Sequence

The current guided path is already good. A refined sequence would be:

> Choose trust model → Bind application context → Read the pattern → Process tokens → Send real handshake payloads → Reach Split → Confirm identity binding → Use transport → Coordinate rekey → Attack trust, replay, nonce, and compromise assumptions

The most important conceptual split should remain visible:

```text
Noise proves possession of keys
        ≠
the application proves whose keys they are
```

A second permanent distinction:

```text
transcript hash
        ≠
identity verification
        ≠
replay protection
        ≠
external negotiation binding
```

## Final Verdict

Noise Pipe is already one of the most technically credible Crypto Labs.

The strongest parts are:

- published Noise-vector conformance;
- real cryptographic primitives;
- inspectable token processing;
- byte-level wire rendering;
- explicit directional transport states;
- the corrected responder-key impersonation model;
- the four-way attack verdict system; and
- the new browser claims suite.

The next release should prioritize safety and exact security scoping:

1. eliminate Reset-driven nonce reuse;
2. serialize all cipher-state operations;
3. make transcript export public by default and remove secrets;
4. replace the current forward-secrecy panel with specification-faithful message- and direction-specific experiments;
5. stop treating `h` as standalone tamper or identity proof;
6. show the external identity-binding requirement for XX and related patterns;
7. split IKpsk2’s message-1 exposure from its transport protection;
8. validate X25519 outputs, PSK length, message limits, nonce values, and pattern state;
9. protect asynchronous UI state from stale handshakes and attacks; and
10. align CI and deploy commands with the excellent test suite already present.

With those changes, Noise Pipe would not merely show how Noise tokens compose. It would teach the more difficult—and more important—lesson: a correct Noise state machine provides precisely scoped cryptographic guarantees, while nonce discipline, trust bootstrap, replay policy, negotiation binding, key lifecycle, and application framing remain part of the protocol designer’s job.

## Primary References

- Noise Protocol Framework, Revision 34: https://noiseprotocol.org/noise.html
- Official Noise protocol site and specifications: https://noiseprotocol.org/
- WireGuard paper: https://www.wireguard.com/papers/wireguard.pdf
- noise-c test vectors: https://github.com/rweather/noise-c
- RFC 7748 — X25519
- RFC 5869 — HKDF
- NIST SP 800-38D — GCM
