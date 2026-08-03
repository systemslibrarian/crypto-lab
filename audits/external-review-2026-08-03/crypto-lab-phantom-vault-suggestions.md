# Crypto Lab Phantom Vault — Suggestions

## Overall Assessment

Phantom Vault is one of the collection’s strongest demonstrations of deterministic password derivation.

The recent work materially improved the lab:

- The **Break It** panel now runs a real offline dictionary search through the shipped PBKDF2 → HMAC-DRBG → rejection-sampling pipeline.
- The attack can genuinely fail when the passphrase is absent from the wordlist.
- Browser tests compare the attack’s cross-service prediction with a password independently derived by the vault UI.
- The modulo-bias exhibit now uses exact counts over the complete byte domain rather than relying on a tiny random sample.
- The project has a NIST HMAC-DRBG known-answer test, pipeline property tests, attack tests, browser claims tests, and an accessibility gate.
- Playwright builds the current source before serving it, preventing stale bundles from passing tests.

The lab’s strongest conceptual achievement is that it connects three ideas that are often taught separately:

1. deterministic password generation;
2. output-format limits; and
3. offline attacks against the master passphrase.

The main remaining problems are not whether PBKDF2 or HMAC-DRBG executes. They concern what the page claims those computations prove, how long-term compatibility is defined, and how asynchronous results remain tied to the inputs that produced them.

## What Improved Most

### 1. The Offline Attack Is Real

Every candidate passphrase is sent through the actual derivation pipeline. The result is compared with the stolen credential, and the failure path is tested.

That is much better than animating guesses or estimating attack speed from a hardcoded number.

### 2. The Attack Demonstrates the Global-Blast-Radius Problem

The panel makes a fundamental property of stateless password derivation visible:

> Once the master secret is known, every site-specific password can be regenerated.

This is the correct adversarial counterweight to the “no vault database” benefit.

### 3. Modulo Bias Is Now Demonstrated Deterministically

Enumerating the complete 256-byte input domain makes the rejection-sampling claim inspectable and non-probabilistic.

The learner can see why low indices receive an extra mapping under `byte % N` and why rejection produces equal accepted counts.

### 4. Test Coverage Is Substantive

The current tests cover:

- HMAC-DRBG mechanics against a published vector;
- deterministic reproduction;
- version rotation;
- service and username separation;
- required character classes;
- attack success and failure;
- changed public context;
- truncated stolen passwords;
- browser attack behavior;
- browser accessibility; and
- production-build execution.

This is a strong base.

## Priority Recommendations

### 1. Change “Master Passphrase Recovered” to “Matching Candidate Found”

This is the most important conceptual correction.

One finite derived password is not a unique proof of the original master passphrase. More than one passphrase can map to the same output under the same public context.

The current panel acknowledges a collision margin, but it still says:

> MASTER PASSPHRASE RECOVERED

and describes the result as a recovery rather than a candidate.

The cross-service pivot does not independently prove that the candidate is the original passphrase. It simply computes what that candidate would produce for another service. A different colliding candidate may produce a different password there.

Recommended verdict:

> **Credential-consistent passphrase candidate found**

Recommended explanation:

> This candidate reproduces the stolen password exactly. It is therefore consistent with the observed credential, but one finite output cannot prove that it is the user’s unique original master passphrase.

To demonstrate stronger confirmation, give the attacker two independently stolen derived passwords from different contexts and require one candidate to reproduce both.

The page can then distinguish:

- **one credential:** matching candidate;
- **two independent credentials:** much stronger confirmation;
- **known original in a teaching harness:** ground-truth recovery, but only because the demo is allowed to check hidden truth.

Also correct the source-code comment that still says a match “is the passphrase.”

### 2. Stop Calling the Character-Composition Score Passphrase Entropy

`estimatePassphraseEntropyBits()` calculates:

```text
length × log2(apparent character pool)
```

This is only a mathematical ceiling for a string sampled uniformly from that pool. It is not an estimate of how a human selected the passphrase.

For example, `password123` receives a large composition score even though it appears near the top of common attack dictionaries.

The UI correctly calls the value an “upper bound,” but then uses it to display:

- **Effective entropy**
- **Strength: Fair / Strong / Very Strong**
- an approximate bit count in the accessibility text

An upper bound cannot justify a positive security-strength verdict. The actual value could be dramatically lower.

Recommended model:

#### User-chosen passphrase

Display:

> **Entropy unknown from the string alone.** Security depends on the process that selected it and on attacker knowledge.

Optionally show:

> Composition ceiling: 65 bits — not an estimate of resistance to guessing.

#### Randomly generated passphrase

Provide a mode such as:

- six words selected uniformly from a defined Diceware list; or
- 128 random bits encoded as words.

Only then show a known entropy value based on the documented generation process.

The central teaching equation should become:

```text
effective output security
  <= min(
       master-secret generation entropy,
       valid-output-space ceiling
     )
```

For an ordinary user-entered phrase, the first term is **unknown**, not the composition score.

### 3. Include Password Policy in the Domain-Separated Context

The PBKDF2 salt currently depends on:

```text
service || username || version
```

Length and character-set policy are applied later and are not included in the seed or DRBG personalization.

Therefore, changing length often exposes related outputs from the same deterministic byte stream. A shorter password may be a prefix of a longer one when both first candidates satisfy the character-class rules.

Use one canonical, structured context containing at least:

- derivation algorithm identifier;
- service identifier;
- username/account identifier;
- rotation version;
- password length;
- enabled character classes or policy ID; and
- any compatibility profile.

Example conceptual encoding:

```text
PhantomVault
algorithm = 1
service = github.com
username = person@example.com
rotation = 3
policy = lower+upper+digit+symbol,length=20
```

Encode fields with explicit tags and lengths rather than separator characters.

### 4. Define Canonicalization Rules

A stateless generator must reproduce the same bytes years later on a different device.

The current implementation trims service and username but otherwise derives from the exact UTF-8 strings. Visually similar inputs can produce different passwords:

- `GitHub.com` vs. `github.com`;
- `https://github.com` vs. `github.com`;
- Unicode NFC vs. NFD text;
- an email domain with different casing;
- leading or trailing spaces in the master passphrase; and
- internationalized domain names in Unicode vs. ASCII/Punycode form.

Define and display a canonical derivation record.

Possible rules:

- service: parse as a hostname, lowercase it, convert IDNs consistently, and reject paths unless deliberately supported;
- username: state whether it is literal or normalized;
- passphrase: state whether Unicode normalization is applied;
- whitespace: clearly say whether spaces are significant;
- version and length: canonical unsigned decimal integers.

Show the exact normalized context before deriving.

### 5. Replace Null-Separated Context With Structured Encoding

The PBKDF2 salt is constructed as:

```text
service + NUL + username + NUL + version
```

A separator format is less robust than a length-prefixed encoding and can become ambiguous if a caller supplies separator characters programmatically.

Use a canonical binary encoding:

```text
tag || length || value
```

for every field.

Hash that structured context only after it has been validated and normalized.

### 6. Separate Rotation Version From Algorithm Version

The UI’s `version` field rotates an account password, but the implementation also has an implicit algorithm version:

```text
phantom-vault:v1
```

These are different concepts.

A future change to any of the following will change every derived password:

- PBKDF2 iteration count;
- KDF algorithm;
- charset order;
- symbol list;
- context encoding;
- HMAC-DRBG behavior;
- rejection-sampling policy;
- required-class enforcement; or
- Unicode normalization.

Therefore, “old versions remain reproducible” is true only while the complete old algorithm profile remains available.

Use separate fields:

- **rotation counter:** user-controlled password version;
- **derivation profile:** `PV1`, `PV2`, etc.;
- **policy profile:** account-specific output rules.

Keep old profiles available indefinitely and publish full end-to-end test vectors:

```text
all inputs -> exact derived password
```

### 7. Retire Results Whenever Any Input Changes

After a derivation, the output password, DRBG state, distribution panel, proof results, and armed attack remain visible while the user edits:

- service;
- username;
- version;
- length;
- charset; or
- passphrase.

This can leave an old password displayed beside a new context.

Add a derivation fingerprint or generation ID covering every input. On any edit:

- clear or visibly retire the password;
- disarm the cracker;
- clear proof results;
- clear the distribution and state panels;
- replace the result with:
  > Inputs changed — derive again.

Display the exact context snapshot beside every completed password.

### 8. Disable Inputs or Cancel the Run During Derivation

`setBusy()` currently disables the two action buttons but leaves the input controls editable while PBKDF2 is running.

The function derives from an initial snapshot, so a user can edit the visible service or policy and then receive a result for the earlier values.

Choose one:

- disable every derivation input during the run; or
- allow editing but cancel/retire the in-flight run immediately.

Use a monotonic `runId` or `AbortController` and check it after every asynchronous boundary.

### 9. Cancel Stale Offline Attacks

The cracker and main derivation can run concurrently.

A possible sequence is:

1. start cracking credential A;
2. derive credential B while the attack is running;
3. the cracker is re-armed for B;
4. the old attack for A finishes later; and
5. its result overwrites the panel now labelled for B.

Capture a cracker generation ID for each `arm()` call and each attack. Reject the result when its ID is no longer current.

Also let the main controller know that cracking is active, or provide an explicit **Cancel attack** action.

Add a browser test for this exact sequence.

### 10. Add Attack Cancellation and a Wordlist Limit

The wordlist textarea has no practical size limit and the attack has no cancellation mechanism.

A learner can paste thousands of candidates, each requiring 600,000 PBKDF2 iterations, and leave the tab occupied for an extremely long time.

Add:

- a maximum candidate count for the browser exhibit;
- a visible estimate before starting;
- an `AbortController`;
- a **Cancel attack** button; and
- periodic yielding so cancellation remains responsive.

For larger demonstrations, use a persistent worker rather than creating a new PBKDF2 worker for every candidate.

### 11. Do Not Swallow Every Derivation Error as a Wrong Guess

The cracker catches all derivation errors and continues as though the candidate simply did not match.

That can turn a systemic failure—such as unavailable crypto, an implementation error, or invalid shared policy—into a misleading “wordlist exhausted” verdict.

Separate:

- candidate-specific invalid-input errors, which can count as failed guesses; and
- infrastructure or cryptographic errors, which should abort the attack visibly.

### 12. Preserve Significant Spaces in Attacker Candidates

The main derivation preserves leading and trailing spaces in the master passphrase, although it rejects a phrase that is entirely whitespace.

`parseWordlist()` trims each candidate. Therefore, the cracker cannot represent or recover a valid passphrase whose leading or trailing spaces are significant.

Either:

- define canonical trimming for the master passphrase everywhere; or
- preserve candidate spaces and offer an escaped/JSON wordlist format.

The page must state the rule explicitly.

### 13. Make PBKDF2 Progress Honest

The worker cannot observe WebCrypto’s internal PBKDF2 iteration progress. Its percentage is calculated from elapsed time against a fixed 2.6-second estimate.

That is an animation of estimated time, not measured completion.

Use one of these:

- an indeterminate progress bar labelled **PBKDF2 running**;
- **estimated elapsed progress**, clearly labelled as an estimate; or
- measured historical duration from the same device, still labelled approximate.

Do not present the percentage as actual iteration completion.

### 14. Clarify the HMAC-DRBG Standards Claim

The HMAC-DRBG update and generate mechanics are tested against a NIST vector, which is excellent.

However, this application is using HMAC-DRBG as a deterministic expander seeded by PBKDF2 output and public context. It is not demonstrating a complete approved entropy-source and DRBG subsystem.

Recommended wording:

> The HMAC-DRBG state transition follows SP 800-90A. In this lab it is used as a deterministic byte expander; the seed’s real security remains capped by the master passphrase.

A simpler design could use a well-specified HMAC/HKDF expansion stream instead. HMAC-DRBG is reasonable for teaching, but the lab should separate:

- correct DRBG mechanics; and
- a standards-conformant entropy-source instantiation.

### 15. Treat DRBG State and Sampled Bytes as Sensitive Derived Material

The state panel places complete `K` and `V` values in HTML `title` attributes even though the visible text is truncated.

The derivation result also labels raw DRBG bytes as “not a secret.”

These values are deterministically derived from the master secret. They should not be described as harmless public data.

Recommended changes:

- remove complete `K` and `V` values from the DOM;
- display short digests or heavily truncated teaching fingerprints;
- add a deliberate **Reveal internal teaching state** control;
- label revealed state as sensitive;
- remove the “not a secret” comment for sampled bytes; and
- clear state and sample arrays when inputs change or the learner selects **Clear session**.

A real password generator should never expose internal generator state.

### 16. Correct the “94-Symbol Charset” Claim

The shipped output alphabet contains:

- 26 lowercase letters;
- 26 uppercase letters;
- 10 digits; and
- 27 symbols.

The total is **89 characters**, not 94.

Update the README, attack comments, and UI prose that refer to a 94-symbol alphabet.

Better still, interpolate the value from `buildCharset()` so copy cannot drift from code.

### 17. Do Not Use `alphabet^length` as the Exact Collision Margin

The generator requires every selected character class to appear.

Therefore, the valid output space is smaller than:

```text
alphabetSize^length
```

The output is sampled conditionally from strings satisfying the coverage rule.

The attack panel currently calculates collision agreement using the unconstrained format ceiling.

Either:

- avoid presenting an exact collision probability; or
- compute the valid string count through inclusion-exclusion over enabled classes.

Even an exact random-output collision probability would not prove a candidate is the original human-chosen passphrase, so the candidate wording remains necessary.

### 18. Explain the Deterministic-Salt Tradeoff

The PBKDF2 salt is derived entirely from public context.

This is necessary for a completely stateless design, but it gives up a major benefit of random per-user salts:

- users with the same master passphrase and same context derive the same seed and password;
- common contexts can be precomputed; and
- there is no private or random user namespace separating two otherwise identical users.

A stronger design can add a random, nonsecret **vault identifier** or user namespace to the context.

That identifier must then be backed up. This is a useful teaching tradeoff:

> Pure statelessness removes metadata storage, but also removes a random user-specific salt.

### 19. Consider a Memory-Hard Master KDF

PBKDF2 is CPU-intensive but not memory-hard. A fixed browser iteration count also ages over time as hardware changes.

For a master passphrase protecting an entire password portfolio, consider a versioned memory-hard KDF profile where platform support permits it.

The key design requirement is compatibility:

- parameters must be explicit;
- old profiles must remain reproducible;
- outputs must not silently change after an upgrade; and
- browser and device resource limits must be handled.

The lab could compare:

- PBKDF2 compatibility;
- memory-hard resistance;
- browser implementation complexity; and
- long-term profile migration.

### 20. Acknowledge the Nonsecret Metadata That Must Be Preserved

The system says it stores nothing, but reliable recovery requires reproducing more than the master passphrase:

- exact service identifier;
- exact username;
- rotation version;
- length;
- charset/policy;
- algorithm profile; and
- normalization rules.

Losing any of these can make the password unrecoverable.

This is operational state, even when it is not secret.

Recommended feature:

> **Export nonsecret recovery metadata**

The export must never include the master passphrase or derived passwords. It can contain versioned policy records and canonical service identifiers.

This makes the central tradeoff honest:

> no encrypted secret vault, but some nonsecret account metadata is still valuable.

### 21. Add a Site-Policy Failure Exhibit

Real services may:

- reject certain symbols;
- truncate passwords;
- normalize Unicode;
- silently cap length;
- change requirements; or
- treat copied whitespace differently.

A deterministic password that the site transforms is no longer the exact credential the vault expects.

Add a panel showing:

1. derive a 20-character password;
2. simulate a site truncating it to 16 characters;
3. show that the saved server credential and the regenerated local credential no longer match; and
4. explain why policy metadata and round-trip verification matter.

### 22. Tighten the “Nothing Can Be Breached” Language

The hero says:

> A vault you never store is a vault no one can breach or sync.

The design removes one target: a persisted encrypted password database.

It does not eliminate:

- malicious application updates;
- browser extensions;
- keyloggers;
- clipboard capture;
- DOM inspection;
- memory scraping;
- shoulder surfing;
- phishing;
- compromised derivation code; or
- master-passphrase guessing.

Recommended wording:

> No credential database is persisted by this demo. That removes one breach target, but security is concentrated in the master passphrase, the derivation code, and the device running it.

Also avoid implying that encrypted conventional password managers store plaintext secrets carelessly. Present both architectures as different tradeoffs.

### 23. State the Offline-Attack Threat Model Precisely

A normal website should store a password verifier or password hash, not the plaintext password.

The current attack requires an attacker to obtain the exact derived password, which can occur through:

- phishing;
- malicious browser extensions;
- keylogging;
- credential-stealing malware;
- shoulder surfing;
- application logs;
- a service that improperly stores plaintext; or
- cracking the service’s own password hash first.

Say that explicitly. Avoid implying every ordinary database breach immediately exposes the plaintext derived password.

### 24. Fix Clipboard Auto-Clear Behavior

The page schedules an unconditional clipboard overwrite 30 seconds after copying.

Problems:

- the browser may reject clipboard writes outside a user gesture;
- the timer may erase unrelated content the user copied afterward; and
- “auto-clear scheduled” sounds more reliable than the platform permits.

Safer options:

- warn that the clipboard may retain the password;
- avoid overwriting automatically;
- or clear only after confirming that the clipboard still contains the same password, where permission allows.

Never overwrite newer clipboard content blindly.

### 25. Clear or Relabel the Entropy-Cap Panel After Passphrase Clearing

The passphrase input is cleared programmatically after derivation, but the live entropy-cap panel is not refreshed because no input event is emitted.

The field can therefore be blank while the chart still displays the previous passphrase’s composition ceiling.

Choose one:

- update the chart to zero after clearing; or
- label it **Last derivation’s passphrase ceiling** and preserve the associated context intentionally.

### 26. Validate Every Core Input, Not Only the UI Form

`derivePassword()` directly validates only an empty passphrase and `version < 1`.

Programmatic callers can still pass values such as:

- `version = NaN`;
- fractional version numbers;
- `Infinity`;
- invalid or non-integer length;
- empty service and username without a deliberate policy;
- oversized context fields;
- unexpected charset values; or
- separator characters.

The core API should enforce:

- finite integers;
- explicit ranges;
- at least one enabled class;
- length sufficient for required classes;
- context size limits;
- canonical encoding; and
- prohibited ambiguous characters where applicable.

Add tests that call the core directly, not through HTML constraints.

### 27. Make the Uniformity CI Gate Deterministic

The exact byte-domain proof already demonstrates that rejection mapping is uniform:

- every accepted residue occurs the same number of times; and
- rejected values are outside the largest multiple of the charset size.

The separate chi-square CI test uses fresh randomness and can still fail by chance, even with a low false-positive rate. It also samples `crypto.getRandomValues`, not HMAC-DRBG output.

Recommended split:

- **deployment gate:** deterministic exhaustive mapping property;
- **HMAC-DRBG gate:** NIST known-answer vectors;
- **optional statistical smoke test:** non-blocking or seeded reproducibly.

Avoid describing a randomized statistical test as deterministic proof.

### 28. Split Browser Test Commands Clearly

The script:

```json
"test:a11y": "playwright test"
```

runs both accessibility and functional claims tests.

That is good for deployment coverage but misleading naming.

Use:

```json
{
  "test:e2e": "playwright test",
  "test:a11y": "playwright test e2e/a11y.spec.ts",
  "test:claims": "playwright test e2e/claims.spec.ts"
}
```

Have deployment run `npm run test:e2e`, and rename the workflow step:

> Browser claims and accessibility gate

### 29. Add Full End-to-End Compatibility Vectors

The project has component tests, but a stateless password derivation scheme needs public whole-pipeline vectors to protect long-term recoverability.

Publish several vectors containing:

- exact Unicode input strings;
- canonical encoded context;
- profile/version;
- PBKDF2 parameters;
- charset definition and ordering;
- output length;
- intermediate seed fingerprint; and
- final password.

Include edge cases:

- Unicode;
- spaces;
- all policy combinations;
- multiple versions;
- boundary lengths;
- rejection-heavy charsets; and
- required-class retries.

### 30. Add a Visible Fidelity and Safety Panel

A concise panel would clarify the boundaries.

#### Real in this lab

- PBKDF2-HMAC-SHA256;
- HMAC-DRBG state transitions;
- deterministic context-derived output;
- rejection sampling;
- character-class enforcement;
- real offline candidate testing; and
- measured browser attack time.

#### Illustrative or unsafe for production

- browser handling of the master passphrase;
- exposed internal DRBG state;
- simplistic passphrase composition scoring;
- toy dictionary size;
- no persistent compatibility metadata;
- no hardened update or supply-chain model;
- no recovery workflow; and
- no site-policy integration.

## Recommended Test Additions

1. A one-credential collision is labelled as a candidate, not unique recovery.
2. Two independent credentials are required for the stronger confirmation mode.
3. Changing any input retires every old result.
4. Editing inputs during PBKDF2 cancels or invalidates the old run.
5. Starting a new derivation while cracking prevents the old attack result from resurfacing.
6. Cancelling a long attack stops future guesses.
7. Systemic derivation errors abort the attack instead of reporting dictionary exhaustion.
8. Leading and trailing passphrase spaces follow one documented policy.
9. Unicode normalization vectors reproduce across equivalent input forms when normalization is enabled.
10. `NaN`, fractional, infinite, and out-of-range version and length values are rejected.
11. Policy changes are domain separated.
12. Algorithm-profile changes remain explicitly reproducible through old profiles.
13. Full `K` and `V` values never appear in the DOM by default.
14. Exact symbol count is derived from the live charset.
15. Required-class output-space counting is correct or no precise collision-bit claim is made.
16. Programmatic passphrase clearing refreshes or relabels the entropy panel.
17. Clipboard behavior never overwrites newer user content.
18. End-to-end published vectors reproduce byte for byte.
19. Deployment runs the full browser claims suite under a correctly named command.
20. The deterministic rejection-mapping proof, rather than a random chi-square sample, blocks deployment.

## Suggested Teaching Sequence

A navigation strip would make the argument easier to follow:

> Derive → Reproduce → Rotate → Separate contexts → Measure the format ceiling → Break a weak master → Confirm with a second credential → Examine operational state

The most important conceptual contrast should be visible near the top:

| Property | Stateless derivation |
|---|---|
| Secret vault database | Not required |
| Master compromise blast radius | Every derived credential |
| Per-site random independence | Derived from one shared secret |
| Recovery | Impossible without exact inputs and profile |
| Nonsecret metadata | Still useful or necessary |
| Offline attack after one plaintext leak | Possible |
| Algorithm upgrades | Must preserve old profiles |

## Final Verdict

Phantom Vault is already an unusually thoughtful lab.

Its best recent decision was adding a real attack rather than allowing the entropy-cap lesson to remain abstract. The implementation and tests are strong enough that the next improvements should focus on epistemic precision and operational reality:

1. report matching passphrase candidates honestly;
2. stop treating character composition as measured entropy;
3. domain-separate the complete policy;
4. version the entire derivation specification;
5. tie every result to an immutable input snapshot;
6. cancel stale derivations and attacks;
7. treat DRBG state as sensitive;
8. disclose the nonsecret metadata required for recovery; and
9. replace “nothing can be breached” with a balanced architecture comparison.

With those corrections, Phantom Vault could become one of the collection’s best demonstrations of both the elegance and the hidden costs of stateless password generation.
