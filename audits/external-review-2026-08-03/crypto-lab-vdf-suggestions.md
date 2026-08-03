# Crypto Lab VDF — Suggestions

## Overall Assessment

The VDF lab is a strong, compact demonstration of repeated squaring and fast Wesolowski verification.

Its best qualities are:

- the honest evaluator performs a real chain of `T` modular squarings;
- the verifier re-derives the Fiat–Shamir challenge instead of trusting the supplied value;
- output and proof tampering are visibly rejected;
- operation counts make the evaluation-versus-verification gap concrete;
- the trapdoor path demonstrates why knowledge of the RSA group order destroys the delay;
- recent browser tests verify the page’s displayed claims against computed values; and
- stale completed results are retired when inputs change.

The newest parallelism work is also an improvement over the previous CSS-only exhibit. The panel now computes two strategies and compares their outputs rather than merely animating a predetermined conclusion.

The remaining issues mostly concern fidelity and wording. Several statements are stronger than the implementation supports, and one important asynchronous state race remains.

## What Improved Most

### 1. The Parallelism Panel Now Computes Its Results

The panel now:

- splits `T` into four slices;
- confirms the slices sum to `T`;
- runs the slices sequentially as a dependency chain;
- confirms that chained execution reproduces the honest `y`; and
- computes a separate result from independently started slices.

This is much better than four decorative lanes followed by a hardcoded conclusion.

### 2. Browser Tests Assert Relationships, Not Just Phrases

The new claims suite verifies:

- the displayed step count matches the selected difficulty;
- the evaluation and verification cost tiles agree with the run;
- the displayed speed ratio is derived from those two costs;
- tampered `y` and `π` are rejected;
- the trapdoor output equals the honest output;
- the worker slices sum correctly; and
- completed results disappear after their inputs change.

That is a serious improvement in educational trustworthiness.

### 3. The Time-Lock Puzzle Comparison Was Corrected

The lab now correctly explains that anyone can open a time-lock puzzle by doing the sequential work. The factorization lets the creator shortcut construction; it is not required by an ordinary solver.

The important distinction is now public verifiability: a VDF provides a succinct proof, while checking a time-lock puzzle answer ordinarily requires repeating the work.

### 4. Accessibility and Deployment Quality Are Strong

The site includes:

- dynamic status announcements;
- progressbar semantics;
- input-error handling;
- dark and light theme testing;
- control-boundary contrast fixes;
- touch-target handling; and
- production-build browser testing that avoids stale `dist/` bundles.

## Priority Recommendations

### 1. Separate the Honest Modulus from the Published Trapdoor Modulus

This is the highest-priority conceptual issue.

The page describes the evaluator as operating in a group of unknown order and repeatedly says that nobody knows the factorization. However, `P` and `Q` are exported directly from `src/vdf/group.ts` and shipped in the public browser bundle.

The disclosure panel does not protect the factors. Any visitor, script, or competing evaluator can read them and use the shortcut.

Therefore, the live demo’s actual modulus is not unknown-order.

Recommended architecture:

- Use one modulus `N_honest` for the main evaluation and verification panels.
- Publish only `N_honest`, not its factors.
- Use a separate small teaching modulus `N_trapdoor` with published factors inside the trapdoor exhibit.
- Explain that the second modulus demonstrates the failure mode but is not the modulus used by the honest run.

Another acceptable option is to keep one modulus but change the wording everywhere to:

> The honest code path deliberately ignores the published teaching trapdoor.

Do not say the factorization is unavailable or that nobody can shortcut this particular deployed instance.

### 2. Show the Prover Cost Separately

The current presentation makes the full operation look like:

1. perform `T` squarings;
2. generate a tiny proof;
3. verify cheaply.

But `prove()` computes:

```text
q = floor(2^T / ℓ)
π = x^q mod N
```

using a new square-and-multiply exponentiation. This performs another amount of group work roughly linear in `T`.

The current implementation does not derive the proof “for free” from the completed evaluation. It performs a second expensive exponentiation after `y` is finished.

Recommended cost display:

- **Evaluate `y`:** measured group operations.
- **Generate proof `π`:** measured group operations.
- **Total evaluator/prover cost:** evaluation plus proof generation.
- **Verify:** measured group operations.

Rename:

> Short proof (computed once by the evaluator)

to:

> Short proof generated after evaluation — this simple implementation performs additional prover work.

For a higher-fidelity implementation, use an established Wesolowski proof-generation algorithm that avoids materializing the full `2^T` exponent and can generate the proof alongside or efficiently after evaluation.

### 3. Do Not Materialize `2^T` as a BigInt

`prove()` creates:

```text
1n << BigInt(t)
```

This is manageable at the slider’s toy maximum of 16,384 bits, but it is not representative of real VDF difficulty and does not scale.

A real implementation should compute the quotient-related proof through streaming or recursive techniques rather than constructing the complete exponent `2^T`.

At minimum:

- enforce an explicit maximum `T` in the core API;
- document that the proof algorithm is toy-scale;
- catch resource-exhaustion failures; and
- keep the UI limit synchronized with the core limit.

### 4. Rename the Worker Button or Use Actual Web Workers

The page says “Try 4 parallel workers,” and the README says it actually runs the same problem across four workers.

It does not use browser Web Workers. `raceWorkers()` executes every slice synchronously in one JavaScript thread.

The panel computes a mathematical simulation of worker strategies, which is still useful, but it is not a parallel execution experiment.

Choose one:

#### Accurate naming

Rename the control:

> **Simulate splitting the chain across 4 workers**

State that “wall-clock steps” are theoretical dependency depth, not measured browser time.

#### Actual workers

Use Web Workers for the independently started strategy and record real elapsed time. The chained strategy can dispatch each next worker only after the previous result returns.

Even with real workers, explain that measured time depends on scheduling and hardware; the important invariant is dependency depth and output correctness.

### 5. Narrow What the Worker Experiment Proves

The independently started strategy multiplies the four outputs together and calls this “the only way independent shares can be combined.”

That is too strong. It is one natural but invalid splitting attempt, not the only conceivable parallel algorithm.

The experiment demonstrates:

> Splitting the known squaring chain into independent slices starting from the same `x`, then multiplying their outputs, does not compute `x^(2^T)`.

It does not experimentally prove that no parallel shortcut exists.

That stronger conclusion is a cryptographic sequentiality assumption about repeated squaring in an unknown-order group.

Recommended wording:

> This defeats the obvious divide-and-combine strategy. The broader no-shortcut claim is the repeated-squaring assumption, not something four browser lanes can prove.

### 6. Replace “No Amount of Hardware” with a Precise Claim

The hero currently says:

> no amount of hardware buys a shortcut.

Parallel hardware is not expected to collapse the dependency chain, but faster serial hardware, optimized big-integer arithmetic, ASICs, and better clock rates can absolutely reduce wall-clock time per squaring.

Recommended wording:

> Under the repeated-squaring assumption, parallel machines cannot reduce the chain’s `T` sequential dependencies, although faster hardware can make each individual squaring faster.

This distinction matters when VDF protocols choose delay parameters.

### 7. Map Inputs into an Appropriate Subgroup

`toElement()` only ensures that the input is:

- within range;
- nontrivial by a simple numeric check; and
- coprime to `N`.

It does not ensure that the input has suitably large order.

The published primes have small factors in `P−1` and `Q−1`. Since the factorization is public, an adversarial visitor can construct low-order elements whose repeated squaring becomes trivial or periodic.

Recommended changes:

- generate an RSA modulus from safe or otherwise suitable primes;
- map arbitrary messages through a domain-separated hash-to-group routine;
- square the mapped value into the quadratic-residue subgroup where appropriate;
- reject degenerate values; and
- explain the input-sampling requirement.

For the visual input field, distinguish:

- **message/input text**, and
- **derived group element `x`**.

Do not imply every coprime integer is an equally safe VDF input.

### 8. Fix the In-Flight Stale-Result Race

The recent input-retirement change handles completed results, but not an evaluation or proof that is still running.

Two problematic cases remain.

#### During evaluation

While `evaluateSteps()` is advancing, the user can edit `x` or `T`. Because `state.result` and `state.proof` are still null, `retireResult()` returns without cancelling the active generator. The old run can finish and appear beside the new inputs.

#### During proof generation

`finalizeEval()` sets `state.result`, awaits `prove()`, then writes the proof and re-enables verification. If the user changes an input during that await, the retirement handler clears state—but the old promise can later resolve and resurrect the stale result.

Recommended solution:

- increment a `runGeneration` or `runId` for every evaluation and every input change;
- capture the ID at evaluation start;
- check it before every animation tick and after every `await`;
- discard the result when the ID no longer matches;
- optionally use an `AbortController`; and
- disable or clearly lock inputs while a run is active.

Add Playwright tests that change `x` and `T:

- midway through evaluation; and
- while “Generating the short proof…” is displayed.

### 9. Measure the Trapdoor Shortcut Instead of Saying “No Delay”

The trapdoor path still performs:

1. exponent reduction modulo `λ(N)`; and
2. a modular exponentiation with an exponent up to roughly the size of the group order.

That cost is independent of `T`, but it is not zero.

For small values of `T`, the trapdoor exponentiation can cost approximately the same as—or more than—the honest `T` squarings. The test currently demonstrates “no delay at all” at only 128 squarings, where the asymptotic advantage is not meaningful.

Recommended panel output:

- honest evaluation operations;
- trapdoor-path operations;
- measured ratio;
- statement that trapdoor cost is approximately constant in `T`; and
- a note that it becomes dramatically cheaper only as `T` grows beyond the modulus-size work factor.

Replace:

> Same y — no delay at all.

with:

> Same `y` with work that no longer grows linearly with `T`.

### 10. Remove or Validate the Transmitted Challenge `ℓ`

The `Proof` object contains both `ℓ` and `π`, but verification ignores `proof.l` and derives `ℓ` independently.

Cryptographically, re-deriving the challenge is correct. The ambiguity comes from displaying `ℓ` as though it were a trusted part of the proof object.

Choose one design:

- remove `l` from the proof type and derive it only for display; or
- compare `proof.l` with the derived value and reject a mismatch with a specific reason.

Add a test for tampering with `ℓ`. The current test suite covers `y`, `π`, and `T`, but not the displayed challenge.

### 11. Validate Canonical Proof and Group Elements

`verify()` validates the range of `x` and `y`, but not `proof.pi`.

`groupPow()` silently reduces any supplied `π` modulo `N`, so `π + N` is treated as the same proof. That may be mathematically equivalent, but it conflicts with strict canonical-encoding and fail-closed messaging.

Recommended validation:

- `0 < π < N`;
- `gcd(π, N) = 1`;
- `gcd(x, N) = 1`;
- `gcd(y, N) = 1`;
- reject `x = 1` and other explicitly degenerate inputs; and
- return distinct reasons such as `non-canonical-proof` or `not-in-group`.

The `bad-input` reason already exists in the type but is never used.

### 12. Strengthen Hash-to-Prime

The challenge generator uses Miller–Rabin bases 2 through 37 and calls the result “deterministic enough” for a 128-bit candidate.

The tests do not independently prove primality; they only verify oddness and absence of several tiny factors.

Recommended changes:

- use a primality routine with a justified error bound or deterministic coverage for the candidate range;
- use more independent Miller–Rabin bases or a well-reviewed library;
- add a domain-separation label such as `CRYPTO-LAB-VDF-WESOLOWSKI-V1`;
- encode `N`, `x`, `y`, and `T` in canonical fixed-format bytes rather than interpolated decimal text; and
- test the result with an independent primality implementation.

The demo should say **probable prime** unless the implementation establishes primality deterministically.

### 13. Run the Claims Suite in Deployment CI

The deployment workflow runs:

- unit tests;
- build; and
- `npm run test:a11y`.

It does not run `e2e/claims.spec.ts`, because `test:a11y` targets only the accessibility file.

This means the new load-bearing claims tests do not block deployment.

Change the deployment gate to:

```text
npm run test:e2e
```

or run both:

```text
npm run test:a11y
npm run test:claims
```

The README currently implies the browser claims suite is part of the quality story, so it should be a required deployment gate.

### 14. Correct “One Squaring at a Time”

The evaluator advances 256 squarings per animation frame.

The counter is accurate, but the browser does not paint after each individual squaring.

Replace:

> Watch the work accrue one squaring at a time.

with:

> Watch the exact squaring count advance in small chunks while every computation remains sequential.

### 15. Add a Visible Fidelity Note

A compact “What is real / what is illustrative” panel would help:

#### Real in this lab

- actual modular squaring;
- actual Wesolowski identity;
- challenge binding;
- proof and output tamper rejection;
- real operation counts; and
- actual trapdoor exponent reduction.

#### Illustrative or toy-scale

- 512-bit modulus;
- published factorization;
- simple non-scalable proof generation;
- simulated worker timing;
- user-selected raw group elements; and
- tiny delay values.

This would align VDF with the strongest transparency practices used in other Crypto Labs.

## Application-Claim Refinements

### Randomness Beacons

A VDF alone does not make randomness unbiased. It must be combined with an unpredictable input-generation protocol, and designs must account for withholding and last-revealer behavior.

Recommended wording:

> VDFs can help randomness-beacon protocols reduce grinding and last-mover advantage when applied to jointly generated unpredictable input.

### Leader Election

Avoid suggesting the VDF alone selects an unpredictable leader. It is one component in a larger protocol involving seed generation, eligibility rules, and consensus.

### Front-Running

A VDF does not automatically prevent front-running. It can support delayed-reveal, ordering, or encrypted-mempool protocols, but fairness depends on the complete protocol.

## Recommended Test Additions

1. Changing `x` during an active evaluation cancels the old run.
2. Changing `T` during proof generation prevents stale proof resurrection.
3. `π = π + N` is rejected as noncanonical.
4. Non-unit `x`, `y`, and `π` are rejected.
5. Degenerate or deliberately low-order input is rejected or remapped.
6. Tampering with the displayed `ℓ` behaves exactly as documented.
7. Proof-generation operation count is measured and displayed.
8. Trapdoor operation count is compared at small and large `T`.
9. Hash-to-prime output passes an independent primality check.
10. The deployment workflow runs the full claims suite.
11. Actual worker use is tested if Web Workers are implemented.
12. The worker panel describes itself as a simulation if they are not.

## Final Verdict

The VDF lab already teaches the central shape well:

> evaluation is sequential, proof verification is cheap, and knowledge of the group order destroys the delay.

The recent claims tests and computed worker panel move it substantially forward.

The highest-value next step is to make every headline match the exact implementation:

- the factors are public;
- the proof generator performs significant additional work;
- the workers are simulated;
- the trapdoor path is constant in `T`, not literally free;
- the no-parallel-shortcut statement is an assumption, not an experimental proof; and
- active asynchronous runs still need cancellation protection.

With those corrections, this would be one of the collection’s clearest demonstrations of the difference between **slow evaluation**, **fast verification**, and **setup failure**.
