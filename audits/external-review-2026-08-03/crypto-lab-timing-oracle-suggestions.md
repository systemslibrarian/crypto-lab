# Crypto Lab Timing Oracle — Suggestions

## Overall Assessment

Timing Oracle is a strong educational lab with unusually good self-correction.

The recent changes materially improved its credibility:

- The new browser claims suite recomputes every visible verdict from the values the page actually rendered.
- Completed verdicts, charts, tables, and summaries are retired when their inputs change.
- Malformed HMAC hex now reaches a named failure state instead of being silently replaced with an all-zero value.
- The string panel’s per-byte timing estimate now divides by both the number of characters spanned and the number of comparisons in the timed batch.
- The cache hierarchy diagram is now explicitly static rather than masquerading as benchmark output.
- The RSA mechanism and timed Montgomery ladder now agree on one square plus one multiply per exponent bit.
- Toy RSA prime selection now uses the platform CSPRNG with rejection sampling.
- Playwright builds the current source before serving it, preventing stale bundles from passing.
- The deterministic mechanism panels correctly separate causal operation counts from noisy browser timing.

Those are meaningful improvements.

The lab’s best idea is the two-layer teaching model:

1. **deterministic mechanism evidence** explains why secret-dependent work exists; and
2. **live timing measurements** show whether this browser can observe the effect.

The remaining weaknesses are mostly about keeping those two layers aligned and avoiding stronger conclusions than the measurements justify.

The highest-priority issues are:

1. the string mechanism does not model the comparator that is actually timed when lengths differ;
2. the benchmark order and verdict logic are not statistically strong enough for “Leak detected” claims;
3. HMAC results can resurface after inputs change during an in-flight run;
4. independently lazy-loaded panels can benchmark concurrently and contaminate one another;
5. the cache panel does not prove that its two conditions are genuinely cached and uncached; and
6. the functional claims suite still does not block the Pages deployment.

## What Improved Most

### 1. The Claims Suite Checks Relationships

The newest browser suite does more than locate a green or red sentence.

It checks that:

- mechanism counters agree with rendered cells;
- the vulnerable byte count equals the inspected cells;
- the RSA multiply count equals the rendered exponent’s Hamming weight;
- the ladder count equals the bit length;
- displayed HMAC bytes match an independent WebCrypto calculation;
- every verdict threshold agrees with the panel’s own published numbers;
- failed runs clear stale tables and charts;
- the fixed cache-reference ladder never changes; and
- uncaught browser exceptions fail the test.

This is one of the project’s strongest assets.

### 2. The Deterministic Mechanism Panels Are Valuable

Browser timers are noisy and intentionally coarsened.

Showing exact work counts independently of the clock ensures that a learner can still understand:

- early-exit comparison;
- secret-dependent multiply counts; and
- fixed operation schedules.

This is the correct teaching architecture.

### 3. The Page Is More Honest About JavaScript

The page now says that:

- source-level fixed-work structure is not an engine-level constant-time guarantee;
- JIT, garbage collection, bounds checks, and other runtime behavior remain;
- the L1/L2/L3/DRAM values are fixed references; and
- a below-noise result is not proof of safety.

Keep this tone and extend it to the remaining verdict language.

### 4. The RSA Routine and Animation Now Agree

The benchmarked ladder now performs exactly the operation schedule the animation claims:

```text
one square + one multiply per bit
```

The round-trip check also confirms that both the naive and ladder routines compute the intended modular exponentiation.

## Priority Recommendations

### 1. Make the String Animation Model the Actual Comparator

This is the highest-priority correctness bug.

The timed vulnerable comparator begins with:

```ts
if (a.length !== b.length) {
  return false;
}
```

The deterministic mechanism does not model that check. It walks the strings until it finds a character mismatch or reaches a missing character.

The default controls make the mismatch visible:

```text
target: timing-oracle-demo-secret  // 25 UTF-16 code units
guess:  timing-oracle-demo-xxxxx   // 24 UTF-16 code units
```

The real timed comparator rejects immediately at the length check and performs zero `charCodeAt()` comparisons.

The animation instead shows a walk through the shared prefix and a mismatch later in the string.

That contradicts the mechanism panel’s claim that it:

> runs the compare loop for real on your current guess

Recommended options:

#### Option A — Enforce equal-length inputs

Use a same-length default guess and prevent the attack experiment from running until both values have the same encoded length.

Explain:

> Cryptographic tags and tokens normally have a fixed public length. This panel isolates the prefix leak after format and length validation.

#### Option B — Model the length check explicitly

Add an initial animation step:

```text
compare lengths
→ unequal
→ reject before inspecting content
```

Then provide a separate same-length prefix experiment.

#### Option C — Remove the initial length shortcut from the vulnerable teaching function

Only appropriate if the UI clearly says it is demonstrating a deliberately simplified comparator rather than JavaScript’s normal equality behavior.

Add a regression test requiring the mechanism operation count to equal an instrumented version of the real timed comparator for:

- equal strings;
- early mismatch;
- late mismatch;
- shorter guess;
- longer guess; and
- empty input.

Testing equality alone is insufficient. The current mechanism test proves both functions return the same Boolean, not that they perform the same work.

### 2. Stop Calling UTF-16 Code Units “Bytes”

The string panel uses:

- `string.length`;
- `charCodeAt()`;
- `slice()`; and
- JavaScript string indexing.

Those operate on UTF-16 code units, not UTF-8 bytes and not necessarily user-perceived characters.

The UI repeatedly says:

- byte checks;
- correct leading bytes;
- microseconds per extra correct byte; and
- leak the secret one byte at a time.

That wording is only accidentally correct for the current ASCII defaults.

Recommended implementation:

```text
TextEncoder
→ Uint8Array
→ fixed-length byte comparison
```

Then the mechanism, timed comparator, labels, and HMAC panel share one byte-oriented primitive.

Add tests with:

- accented characters;
- combining marks;
- emoji;
- surrogate pairs; and
- NFC/NFD variants.

If strings remain the teaching primitive, use **UTF-16 code unit** consistently.

### 3. Use a Fixed-Length Comparison Contract

`constantTimeCompareStrings()` and `constantTimeVerifyBytes()` run to:

```text
max(a.length, b.length)
```

Their loop count therefore reveals the longer input length.

They also execute bounds branches on every iteration:

```ts
i < a.length ? ... : 0
```

This can be acceptable when length is public, but the page currently presents the routine as a general constant-time secret comparison.

For cryptographic tags:

1. validate the exact public format and length first;
2. reject malformed lengths outside the secret-comparison primitive;
3. compare exactly the fixed tag length; and
4. accumulate the difference without secret-dependent early exit.

For arbitrary secret strings:

- do not recommend direct string comparison;
- encode and normalize deliberately;
- derive a fixed-length verifier or digest through the correct protocol; and
- compare that fixed-length value through a vetted primitive.

Recommended API:

```ts
compareFixed32(expected: Uint8Array, candidate: Uint8Array): boolean
```

with both arrays required to be exactly 32 bytes.

### 4. Require Exactly 32 Bytes for HMAC-SHA-256

`hexToBytes()` accepts any nonempty, even-length hex string.

A 1-byte or 100-byte candidate is considered well formed, even though the expected HMAC is 32 bytes.

The vulnerable verifier then returns immediately on the length check. The “constant-time” verifier loops to the larger length.

This introduces a format/length timing surface that is different from the prefix experiment.

Recommended behavior:

```text
forged MAC must be exactly 64 hexadecimal characters
```

Reject any other length before benchmarking.

A separate advanced experiment can intentionally demonstrate a length oracle, but do not mix it into the fixed-length MAC-prefix lesson.

### 5. Distinguish WebCrypto HMAC Computation From Verification

The panel imports a WebCrypto HMAC key and calls:

```text
crypto.subtle.sign()
```

to compute the expected tag.

It then verifies the candidate with JavaScript comparison functions.

Therefore, the experiment is:

> WebCrypto HMAC generation plus vulnerable/fixed-work JavaScript tag comparison.

It is not WebCrypto HMAC verification.

Recommended panel labels:

- **Expected tag:** computed by WebCrypto HMAC-SHA-256.
- **Vulnerable verifier:** JavaScript early-exit byte comparison.
- **Teaching fixed-work verifier:** JavaScript full-length comparison.
- **Production path:** vetted native verification API.

An optional third path can call `crypto.subtle.verify()` to show the API a browser application should normally use. Do not use its observed timing as proof that every browser implementation is constant-time.

### 6. Label the HMAC Sweep as Oracle Calibration, Not Tag Recovery

The benchmark constructs candidate tags using the known expected MAC:

```text
copy the first N correct bytes
force the next byte wrong
```

That is appropriate for calibrating a verifier’s timing behavior.

It is not an attacker recovering an unknown tag.

The hardcoded demo key is public in the source, and the benchmark already knows the correct tag while building each candidate.

Recommended wording:

> The lab deliberately constructs candidates with known prefix lengths to measure the oracle. It does not recover an unknown production MAC.

A stronger advanced exhibit could recover a deliberately truncated 2- or 3-byte teaching tag through repeated timing queries.

That attack should display:

- candidate byte;
- sample count;
- mean/median delay;
- confidence interval;
- query budget;
- recovered prefix; and
- failure under added jitter or rate limiting.

### 7. Measure HMAC Prefixes One Byte at a Time

The HMAC chart measures only:

```text
0, 4, 8, 12, and 16 correct bytes
```

It never measures:

- one-byte increments;
- the second half of the 32-byte tag; or
- a complete 32-byte match.

Yet the prose repeatedly says:

> leak the MAC one byte at a time.

Recommended choices:

- measure every prefix from 0 through 32; or
- say explicitly that the five points are sparse samples of the expected trend.

For performance, adapt the loops per point to the observed timer quantum.

### 8. Fix the In-Flight HMAC Stale-Result Race

The recent stale-result fix handles inputs changed **after** a completed run.

It does not handle inputs changed while an asynchronous HMAC run is in progress.

`invalidate()` returns immediately when `stats` is null. During:

```text
await hmacSha256(message)
```

the learner can edit the message or forged tag. The old run can later complete and render a result for the prior input beside the newer controls.

Use a monotonic generation ID:

```ts
let generation = 0;

function invalidate() {
  generation++;
  clearResult();
}

async function execute() {
  const myGeneration = ++generation;
  const snapshot = {
    message: messageInput.value,
    forged: forgedInput.value,
  };

  const result = await benchmarkHmacVerification(snapshot.message, snapshot.forged);

  if (
    myGeneration !== generation ||
    messageInput.value !== snapshot.message ||
    forgedInput.value !== snapshot.forged
  ) {
    return;
  }

  stats = result;
  draw();
}
```

Alternatively, disable both inputs while the run is active.

Add a browser test that changes the message immediately after starting the benchmark and proves the old MAC never appears.

### 9. Serialize All Timing Benchmarks Globally

Each panel has its own Running state, but there is no page-wide benchmark lock.

The lazy `IntersectionObserver` can launch multiple panels as the learner scrolls quickly. The user can also start another panel while one is active.

Concurrent work changes:

- CPU frequency;
- JIT activity;
- garbage collection;
- event-loop scheduling;
- memory pressure;
- cache state; and
- the very timing distributions being measured.

Recommended design:

- one global benchmark queue or mutex;
- a visible banner naming the active experiment;
- prevent another benchmark from starting until the first finishes;
- cancel queued automatic runs when the user starts one manually; and
- pause animations and chart redraws while a timing sample is being collected.

For the most defensible browser measurements, run benchmark loops in a dedicated Worker and keep rendering on the main thread.

### 10. Remove Automatic Timing Runs or Make Them Explicit

Every panel runs automatically the first time it becomes visible.

That is convenient for a showcase, but weak for a measurement lab:

- the learner may be scrolling;
- multiple panels may enter view;
- rendering and layout may still be active;
- the page may be backgrounded;
- another tab or process may be busy; and
- the learner did not choose a quiet measurement moment.

Recommended approach:

- render deterministic mechanism evidence immediately;
- display a static example chart or empty measured state;
- require an explicit **Measure this browser** action;
- show a short environment checklist before the first run.

The automatic behavior is also why the browser tests must wait for hidden lazy work before they can act.

### 11. Randomize and Interleave Measurement Order

The benchmarks execute cases in fixed order.

#### String distributions

All vulnerable samples run before all fixed-work samples.

#### Prefix sweeps

Prefixes run from shortest to longest.

#### HMAC

For each ascending prefix, all vulnerable samples run before all fixed-work samples.

#### RSA

Each sample always runs:

```text
naive bit 0
naive bit 1
ladder bit 0
ladder bit 1
```

#### Cache

The warm condition always precedes the post-thrash condition.

This creates systematic confounding from:

- JIT tiering;
- CPU frequency scaling;
- thermal drift;
- garbage collection;
- scheduler changes; and
- background activity.

Recommended method:

1. warm every implementation;
2. generate a randomized or balanced order;
3. interleave paired observations;
4. record the order;
5. use the same number of observations for every condition; and
6. report whether position in the sequence predicts time.

For paired experiments, alternate AB/BA or use randomized blocks.

### 12. Prevent Dead-Code Elimination

The return values of the string, HMAC, and RSA benchmark calls are discarded inside hot loops.

A sufficiently optimizing engine can inline pure-looking operations and remove or transform work whose result has no observable use.

Use a benchmark sink:

```ts
let sink = 0;

for (...) {
  sink ^= compare(...) ? 1 : 0;
}

globalSink ^= sink;
```

For RSA, fold a small portion of the result into a sink.

The cache benchmark already uses a sink; apply the same discipline consistently.

Add a test-only instrumented build that verifies the expected call or operation count.

### 13. Use Statistical Evidence, Not a Single 15% Threshold

Every verdict is based on an arbitrary:

```text
15% relative mean gap
```

The code already contains useful helpers such as:

- median;
- trimmed mean;
- standard deviation; and
- Cohen’s d.

They are not used by the verdict logic.

The current approach does not report:

- confidence intervals;
- statistical significance;
- effect size;
- monotonicity;
- error bars;
- timer quantization;
- run-to-run stability; or
- false-positive risk.

Recommended measured verdict:

```text
Local timing separation observed
effect size: ...
95% bootstrap interval: ...
samples: ...
timer resolution: ...
```

For side-channel detection, consider a dudect-style fixed-versus-random Welch t-test as an advanced panel.

Keep the conclusion narrow:

> Evidence of a timing distribution difference was observed in this browser.

Do not turn one threshold crossing into a claim that a remote attacker can recover the complete secret.

### 14. Make the String Verdict Check the Fixed-Work Path

`stringComparisonVerdict()` receives only:

- vulnerable short-prefix time; and
- vulnerable full-prefix time.

It does not receive or inspect the fixed-work sweep.

Nevertheless, its leak verdict says:

> The constant-time path stays flat.

The function has no evidence for that sentence.

Pass both paths’ complete sweep data into the verdict function.

Require:

- positive vulnerable trend;
- meaningful vulnerable effect size;
- weaker or absent fixed-work trend;
- uncertainty bounds that separate the effects; and
- no major sequence-position confound.

Add a mutation test that forces the fixed-work line to rise and proves the page cannot still claim it stayed flat.

### 15. Use Regression Across the Full Sweep

The string and HMAC verdicts use two endpoints.

A noisy last point can create a false positive, and a noisy first point can hide a genuine trend.

Fit a line across all prefix values and report:

- slope;
- confidence interval;
- goodness of fit;
- monotonicity violations; and
- fixed-work comparison.

For HMAC, use all 33 prefix lengths if practical.

For the string panel, keep the deterministic operation-count line as the ground truth and treat the measured regression as evidence of observability.

### 16. Make Summaries Conditional on the Measurement

The string summary always says:

> That is the per-guess signal an attacker averages over to leak the secret one byte at a time.

It says this even when:

- the measured gain is negative;
- the verdict is below noise;
- the fixed-work path also drifts; or
- the default user guess took the unequal-length shortcut.

Recommended summary logic:

#### Positive supported trend

> This run observed a positive prefix-dependent timing trend.

#### Below noise

> The mechanism performs more work for longer prefixes, but this run did not resolve that difference reliably.

#### Reversed trend

> The measured direction was opposite the expected signal, indicating benchmark noise or confounding.

### 17. Rename “Leak Detected”

A better measured label is:

> **Local timing separation observed**

The deterministic mechanism can separately say:

> **Secret-dependent work exists**

This distinction prevents one local same-thread microbenchmark from being interpreted as proof of:

- remote exploitability;
- cross-origin exploitability;
- key recovery;
- practical query cost; or
- a production vulnerability.

Add a threat-model card:

| Requirement | Modeled here? |
|---|---|
| Attacker can submit chosen guesses | Yes |
| Attacker can repeat queries | Yes |
| Attacker measures inside the same page | Yes |
| Network jitter | No |
| Server rate limiting | No |
| Multiple tenants/processes | No |
| Secret recovery algorithm | Mostly no |
| Production compiler/runtime | No |

### 18. Display the Timing Environment

Before each run, record and display:

- browser user agent;
- `performance.now()` minimum positive step;
- `crossOriginIsolated`;
- `document.visibilityState`;
- hardware concurrency;
- whether reduced timer precision appears active;
- sample count;
- loops per batch;
- warm-up count; and
- whether another benchmark was active.

Abort or mark the run contaminated when:

- the document becomes hidden;
- the user resizes repeatedly;
- a long task overlaps;
- another benchmark starts; or
- the input changes.

### 19. Reframe the RSA Panel as a Controlled Operation-Count Experiment

The RSA panel creates two artificial exponents:

```text
d with one selected bit forced to 0
d with the same bit forced to 1
```

Those modified exponents are not necessarily valid private exponents for the generated RSA key.

The round-trip check uses the original `d`, not the bit-forced variants.

Therefore, the panel demonstrates:

> Two equal-length exponents differing at one bit cause different operation counts under square-and-multiply.

It does not execute a Kocher key-recovery attack against one fixed unknown RSA private key.

Recommended title:

> **RSA exponentiation — controlled secret-bit timing experiment**

Add a second, explicitly modeled panel explaining how a real timing attack:

- queries one fixed private key with many chosen inputs;
- predicts timing contributions for candidate bits;
- correlates predictions with observations; and
- advances through the key statistically.

### 20. Say “Uniform Operation Schedule,” Not “Constant-Time Ladder”

The ladder performs one square and one multiply per bit.

That fixes one source of leakage: secret-dependent operation count.

It does not prove constant-time execution because:

- BigInt multiplication can vary with operand values;
- modular reduction can vary;
- the JIT can specialize;
- the `cswap` implementation is not guaranteed constant-time;
- memory allocation may vary; and
- the CPU executes different data.

Recommended labels:

- **Naive: secret-dependent operation schedule**
- **Ladder: bit-independent operation schedule**
- **Not a constant-time guarantee in JavaScript**

Change the verdict from:

> Naive leaks; ladder uniform

to:

> Naive operation count is bit-dependent; ladder operation count is fixed in this model.

### 21. Teach RSA Blinding as a Separate Defense

Real RSA timing defenses do not reduce to “always use a ladder.”

Production implementations also use techniques such as:

- RSA blinding;
- constant-time fixed-window exponentiation;
- constant-time table selection;
- CRT hardening;
- fault checks; and
- vetted native implementations.

Add a blinding experiment:

1. sign/decrypt the same message repeatedly without blinding;
2. model a stable input-dependent timing component;
3. randomize the base with blinding;
4. show that an attacker can no longer align timings to the same internal value.

Label it as a teaching model unless the exact native implementation is controlled.

### 22. Separate the WebCrypto RSA Timing Reference

The panel measures a 1024-bit WebCrypto RSA-PSS signature and places its mean beside tiny toy-BigInt exponentiation values.

These are not comparable:

- different key sizes;
- different algorithms and padding;
- different runtimes;
- native versus JavaScript;
- asynchronous API overhead;
- possible hardware acceleration; and
- different sample structures.

A stable WebCrypto mean is also not evidence that its implementation is constant-time.

Recommended changes:

- use at least a clearly labelled modern-size key for the API demonstration;
- place WebCrypto in a separate card;
- say it is a performance reference only;
- do not include it in the leak verdict; and
- never imply that one mean value proves side-channel resistance.

### 23. Preserve a Fixed Number of RSA Low Bits

`exponentLowBits` extracts ten bits, but `bitsOf()` removes leading zeroes.

The animation can therefore show fewer than ten low-order positions.

Use a fixed-width representation:

```text
10 bits, including leading zeroes
```

This makes comparisons between keys easier and keeps the animation’s claim precise.

### 24. Rename Cache Conditions to “Warm” and “Post-Thrash”

The cache benchmark allocates:

- a 64 KiB hot array; and
- an 8 MiB eviction/thrash array.

It then compares accesses after touching the hot array with accesses after scanning the 8 MiB array.

JavaScript cannot confirm that:

- the first condition is in L1;
- the second condition is absent from every cache;
- the 8 MiB array exceeds the machine’s last-level cache;
- the same lines were evicted;
- hardware prefetching did not intervene; or
- the slowdown came only from cache residency.

Use:

- **warm working set**
- **post-thrash working set**

Replace:

> uncached access

with:

> access after memory-pressure/thrash phase

Replace:

> Cache state is observable

with:

> Post-thrash access was slower in this run.

### 25. Narrow the Cache Causality Claim

The summary says:

> Timing differs because cache-line residency changes memory latency.

The experiment can also be affected by:

- memory bandwidth pressure;
- CPU frequency changes;
- prefetcher state;
- branch predictor state;
- scheduler interruption;
- garbage collection; and
- page faults.

Recommended wording:

> This run observed a timing difference between a warmed working set and the same access loop after a large memory-thrash phase. Cache residency is a likely contributor, but this browser cannot identify the exact cache level or exclude every microarchitectural confound.

### 26. Add an Actual Secret-Dependent Lookup Model

The measured cache panel demonstrates that memory state can affect timing, but it does not currently connect a secret index to an attacker observation.

Add a separate mechanism exhibit:

```text
secret byte
→ selects one table/cache line
→ attacker probes candidate lines
→ one line appears warmer
```

Make clear whether each stage is:

- computed;
- measured;
- or simulated.

A simple deterministic cache-line map can teach the mechanism without pretending JavaScript provides `clflush` or reliable cache-set control.

### 27. Qualify the WebCrypto AES Claim

The page says:

> WebCrypto AES routes to hardened native implementations.

A browser generally delegates WebCrypto to native cryptographic code, but the page cannot prove:

- which backend is used;
- whether AES hardware instructions are active;
- whether every platform path is constant-time; or
- whether the surrounding application leaks elsewhere.

Recommended wording:

> WebCrypto avoids implementing AES lookup tables in page JavaScript and delegates to the browser’s cryptographic backend. Applications should use vetted platform APIs rather than handwritten table-based AES.

### 28. Fix the Password Comparison Rule

The defense checklist says:

> Always use constant-time comparison for MACs and passwords.

Applications should not normally compare plaintext passwords directly.

Recommended wording:

> Use a password-hashing/KDF API for passwords. Use a vetted fixed-time comparison for fixed-length MACs, hashes, verifiers, and secret tokens where the protocol requires it.

This distinction prevents a learner from treating direct password comparison as the recommended authentication design.

### 29. Add Input Limits and Core Validation

The editable controls have no practical limits.

A learner can enter:

- an enormous target string, creating thousands of DOM cells and very long comparison loops;
- a huge HMAC message;
- a huge forged hex string, causing large allocation and comparison work; or
- empty strings that produce edge-case summaries.

Add explicit limits and named errors:

- target and guess: reasonable byte limit;
- HMAC message: reasonable teaching limit;
- forged MAC: exactly 64 hex characters;
- string target: nonempty for the prefix attack;
- all numeric benchmark parameters: finite integers within documented bounds.

Handle failures for the string and cache panels as carefully as the HMAC and RSA panels. A thrown allocation or canvas error should not become an uncaught page exception with a dead button.

### 30. Use a Worker and Cancellation

Heavy benchmarks run synchronously on the main thread after a two-frame paint.

This can:

- freeze interaction;
- delay accessibility announcements;
- interfere with animation;
- make cancellation impossible;
- contaminate timing through rendering; and
- tempt the browser to classify the page as unresponsive.

A dedicated Worker can provide:

- isolated sequential execution;
- progress messages;
- cancellation;
- a benchmark queue;
- input snapshots;
- stale-result rejection; and
- fewer rendering effects in the timed loop.

A Worker is not a constant-time environment, but it is a cleaner teaching measurement environment.

### 31. Use the Robust Statistics Helpers Already Present

`stats.ts` already defines:

- `median`;
- `trimmedMean`;
- `stdDev`;
- `cohenD`; and
- percentile helpers.

Use them in the result surface.

Recommended table:

| Metric | Vulnerable | Fixed-work |
|---|---:|---:|
| Median | | |
| 10% trimmed mean | | |
| Standard deviation | | |
| Bootstrap 95% CI | | |
| Effect size | | |
| Samples | | |

Show error bars on line charts.

### 32. Make Histogram Clipping Visible

The histogram uses the 2nd and 98th percentiles as its visible range.

That is a reasonable way to avoid extreme outliers dominating the graph, but the page does not say that values are clipped from view.

Add:

> Chart range shows the 2nd–98th percentiles; the full sample set remains in the table.

Display the number of observations below and above the plotted range.

### 33. Keep the Claims Suite, but Expand Its Independence

The new claims suite is excellent at proving:

> the verdict matches the page’s own rule.

It does not prove:

> the rule is scientifically sufficient.

For example, the browser test reproduces the same 15% threshold and endpoint arithmetic as the application.

Add independent semantic assertions:

- a string leak verdict requires the fixed-work trend to remain below its own threshold;
- the default mechanism matches the real comparator’s length-check behavior;
- a non-monotonic prefix curve cannot claim byte-by-byte leakage;
- shuffled measurement order remains balanced;
- HMAC requires exactly 32 bytes;
- cache labels say warm/post-thrash;
- a large ladder gap prevents the word “uniform”;
- an input changed during an asynchronous run cannot receive the old result; and
- two panels cannot benchmark simultaneously.

### 34. Run the Functional Claims Suite Before Deployment

The package scripts correctly separate:

```text
test:a11y
test:claims
test:e2e
```

The Pages workflow still runs only:

```text
npm run test:a11y
```

Therefore, the new functional claims suite does not block deployment.

Change the workflow step to:

```text
npm run test:e2e
```

Rename it:

> Browser claims and accessibility gate

The README currently says tests run before every Pages deploy. That statement becomes fully true only after this change.

### 35. Add a Dedicated CI Workflow or Coverage Gate

The deployment job runs:

- lint;
- unit tests;
- build;
- accessibility; and
- publish.

That is a good base.

Consider adding:

- coverage thresholds for core comparison and verdict logic;
- Node-version matrix;
- a separate PR CI workflow;
- deterministic non-timing unit tests on every platform; and
- browser timing smoke tests treated as non-deterministic evidence rather than exact performance requirements.

Do not make CI require that a real timing leak exceed the threshold on every runner. Mechanism correctness and verdict arithmetic should be deterministic; observability is environment-dependent.

### 36. Honor Reduced-Motion Preference More Explicitly

The automatic animation respects reduced motion.

Pressing **Replay** deliberately bypasses it.

A user-initiated animation is less problematic than automatic motion, but the current button does not explain that it will override the preference and provides no pause control.

Recommended controls:

- **Show final state**
- **Step one operation**
- **Animate**

Keep Animate optional and cancellable.

### 37. Add a Permanent Fidelity Panel

A compact fidelity panel would make the boundaries obvious.

#### Computed directly

- vulnerable and fixed-work operation counts;
- real HMAC-SHA-256 output through WebCrypto;
- toy modular exponentiation;
- source-level ladder operation schedule;
- warm versus post-thrash browser timings;
- all displayed sample tables.

#### Measured but noisy

- string batch timing;
- HMAC comparison timing;
- toy BigInt exponentiation timing;
- memory working-set timing.

#### Not demonstrated

- remote secret recovery;
- production compiler constant-time behavior;
- full HMAC forgery;
- real RSA key recovery;
- an identified L1/L2/L3 cache hit;
- cross-tenant exploitation;
- AES key extraction;
- network jitter and rate limiting.

## Recommended Test Additions

1. Default target and guess have the same encoded length, or the UI visibly models the length rejection.
2. Instrumented vulnerable comparator operation counts equal the mechanism counts for unequal lengths.
3. UTF-8 byte counts replace UTF-16 code-unit labels.
4. Emoji and combining-character cases follow the documented encoding.
5. Fixed-work tag comparison accepts only exactly 32-byte candidates.
6. HMAC candidates of 31 and 33 bytes are rejected before the secret comparison.
7. Every HMAC prefix from 0 through 32 is represented, or the UI says the points are sparse.
8. Changing HMAC input during an in-flight run prevents the old result from rendering.
9. Only one benchmark can execute at a time.
10. Measurement order is randomized or balanced.
11. Every timed result contributes to a sink.
12. The string verdict checks both vulnerable and fixed-work trends.
13. A rising fixed-work line prevents a “stays flat” claim.
14. A non-monotonic endpoint-only curve cannot claim a clean prefix oracle.
15. Confidence intervals and sample counts agree with the underlying observations.
16. A hidden/background tab invalidates the run.
17. RSA bit-forced exponents are labelled hypothetical rather than valid private keys.
18. The ladder verdict says operation schedule, not constant-time execution.
19. The RSA animation always renders exactly ten low-order positions.
20. WebCrypto RSA is separated from the toy leak comparison.
21. Cache output uses warm/post-thrash labels.
22. The cache verdict never claims a known cache level.
23. Large inputs fail with named errors rather than freezing or throwing uncaught exceptions.
24. Cancelled Worker jobs cannot publish stale results.
25. The deployment workflow runs the complete Playwright suite.

## Suggested Teaching Sequence

A refined sequence could be:

> Threat model → Deterministic secret-dependent work → Measurement environment → Randomized samples → Statistical evidence → Attack query budget → Source-level defense → Production API and residual risks

The most important distinction should remain visible throughout:

```text
secret-dependent work exists
        is not the same as
this browser observed a timing difference
        is not the same as
a remote attacker can recover the secret
```

A second permanent distinction:

```text
fixed operation count
        is not automatically
constant-time machine execution
```

## Final Verdict

Timing Oracle has improved substantially.

Its strongest features are now:

- deterministic mechanism explanations;
- live measurements;
- explicit browser/runtime caveats;
- corrected RSA ladder mechanics;
- honest failure paths;
- stale-result retirement;
- strong accessibility;
- and a browser claims suite with genuine mutation-tested value.

The next release should focus on aligning mechanism, measurement, and conclusion:

1. fix the string length-check mismatch;
2. compare bytes rather than UTF-16 code units;
3. require fixed-size HMAC tags;
4. distinguish HMAC computation, calibration, and actual attack recovery;
5. reject stale in-flight results;
6. serialize benchmarks;
7. randomize and interleave measurement order;
8. replace the 15% threshold with effect sizes and uncertainty;
9. reframe the RSA and cache panels around what they actually demonstrate; and
10. make the full claims suite block deployment.

With those changes, Timing Oracle could become one of the collection’s best examples of a difficult principle:

> A side-channel demo must be as disciplined about measurement and inference as it is about cryptographic code.

## Primary References Worth Linking

- Paul C. Kocher, “Timing Attacks on Implementations of Diffie-Hellman, RSA, DSS, and Other Systems,” CRYPTO 1996.
- David Brumley and Dan Boneh, “Remote Timing Attacks Are Practical,” USENIX Security 2003.
- Scott A. Crosby, Dan S. Wallach, and Rudolf H. Riedi, “Opportunities and Limits of Remote Timing Attacks,” ACM TISSEC, 2009.
- Daniel J. Bernstein, “Cache-Timing Attacks on AES,” 2005.
- Nadhem AlFardan and Kenneth Paterson, “Lucky Thirteen,” IEEE Symposium on Security and Privacy, 2013.
- Oscar Reparaz, Josep Balasch, and Ingrid Verbauwhede, “Dude, Is My Code Constant Time?” — the dudect testing methodology.
- NIST guidance and vetted-library documentation for fixed-length MAC verification and RSA blinding.
