# Crypto Lab Simon Period — Suggestions

## Overall Assessment

Simon Period is one of the most technically ambitious and successful Crypto Labs.

The recent changes are substantial:

- The browser suite now checks the displayed periods, equations, interference signs, candidate counts, key recovery, MAC forgery, no-period proof, and race arithmetic.
- The Even-Mansour consequence no longer trusts a single predicted block; the recovered key is checked against the complete toy codebook.
- The CBC-MAC panel performs a real existential forgery against the toy MAC.
- The no-period control reaches full rank and confirms the absence of every nonzero period.
- The simulator correctly preserves the key invariant that every measured vector is orthogonal to a genuine period even when accidental collisions make the function more than 2-to-1.
- The race and asynchronous target switching received meaningful state-safety fixes.

This is no longer merely a visualization of Simon’s algorithm. It is an executable argument connecting:

1. superposition;
2. destructive interference;
3. equations over GF(2);
4. hidden-period recovery;
5. Even-Mansour key recovery; and
6. CBC-MAC forgery.

The highest-value remaining changes concern what the lab counts as work, what “exact” means in a Float64 simulation, and how prominently the strong Q2 access assumption appears.

## What Improved Most

### 1. The Browser Claims Suite Has Real Teeth

The newest Playwright suite checks relationships rather than labels:

- the period in the verdict equals the secret held by the target;
- every measured equation satisfies `y · s = 0`;
- cancelled outcomes and surviving outcomes agree with the period;
- displayed path signs equal `(−1)^(x·y)`;
- the arithmetic sum equals the displayed terms;
- the recovered Even-Mansour keys reproduce the cipher;
- the CBC-MAC forgery is accepted by the actual toy MAC;
- the control exhaustively rejects every nonzero period; and
- the race ratio is calculated from the displayed means.

That is unusually strong for an educational quantum-computing page.

### 2. The Full Statevector Path Is Justified

Using the full amplitude evolution is valuable here because the Even-Mansour target does not always satisfy the exact two-to-one promise.

Extra collisions merge complete period cosets. They do not create measurements outside `s⊥`, but they do skew the probabilities among the surviving orthogonal vectors.

A one-line sampler for the textbook distribution would fail to reproduce that.

### 3. The Consequences Are Executed

Recovering a binary vector is not presented as the end of the attack.

For Even-Mansour, the lab:

- treats the period as `k₁`;
- derives `k₂`;
- predicts a fresh ciphertext; and
- verifies the recovered key over the entire toy domain.

For CBC-MAC, it:

- recovers the affine period;
- transfers a legitimate tag to a distinct message; and
- confirms that the real toy MAC accepts it.

### 4. The Control Is a Genuine Positive Result

The no-period target does not merely time out.

The measurements reach rank `n`, the null space contains only zero, and the panel exhaustively checks that no nonzero period holds.

That is an excellent way to show that the algorithm does not manufacture a secret where none exists.

## Priority Recommendations

### 1. Separate Logical Oracle Queries From All Other Work

This is the most important correction.

The page displays a tally called:

> oracle queries

and the race compares Simon’s `O(n)` query count with a classical birthday search.

However, the browser performs several other kinds of work that are not counted:

- the complete oracle table is constructed before the attack;
- applying one simulated oracle touches the full statevector and table;
- every candidate period is verified over all `2^n` inputs;
- the Even-Mansour recovered key is audited over the full codebook; and
- the no-period panel tests every candidate against the full domain.

Those are appropriate teaching checks, but they are not free black-box queries.

Add a visible resource ledger:

| Resource | What the lab counts |
|---|---|
| Coherent oracle calls | One per Simon round |
| Classical search queries | Distinct inputs queried |
| Candidate-verification evaluations | Shown separately |
| Full-codebook audit evaluations | Shown separately |
| Simulator arithmetic | Classical work, not quantum speedup |
| Gate count and circuit depth | Not modeled |

Rename the race metric:

> **Logical discovery-phase oracle queries**

Do not let the displayed `O(n)` number appear to include exhaustive verification.

### 2. Explain That the Browser Precomputes the Full Oracle

The target builders evaluate the complete toy function table before Simon’s circuit runs.

That is normal for a statevector simulator, but it is not how an attacker receives a real Q2 oracle. At cryptographic scale, the attacker would need a reversible quantum circuit implementing the keyed primitive.

Add a fidelity note:

> This browser precomputes the complete 4–6-bit truth table so it can simulate the unitary lookup. The attack’s query count treats that table as one coherent oracle. The demo does not synthesize or count a reversible cipher circuit.

This is essential before extrapolating from `n = 6` to `n = 128`.

### 3. Replace “Exact Statevector Simulation” With Precise Numerical Language

The simulator uses `Float64Array`, `Math.SQRT1_2`, numerical tolerances, and `toBeCloseTo` assertions.

It is a **full statevector simulation**, but it is not mathematically exact arithmetic.

Recommended wording:

> Full amplitude-level statevector simulation, accurate to floating-point precision.

Replace:

> cancelled to exactly zero

with:

> mathematically cancels to zero; displayed as zero within numerical tolerance.

The current wording is especially inconsistent because `amplitudeSign()` classifies values below `1e−12` as zero.

### 4. Correct the “Complex Numbers” Statement

The honesty panel says the simulator stores:

> `2^(n+m)` complex numbers

The implementation stores one real `Float64Array`. No imaginary component is represented because every gate used by this circuit has real entries.

Use:

> `2^(n+m)` real amplitudes

This is a small wording fix, but it is a concrete factual mismatch with the code.

### 5. Narrow “Doubling the Key Does Nothing”

The headline lesson is directionally right but currently overstated.

Simon's query complexity is `O(n)`, so increasing the hidden-period width from `n` to `2n` does increase the number of queries and the circuit size. What it does **not** do is restore exponential security.

Recommended wording:

> Increasing key or block width only increases this structural attack polynomially; it does not restore the exponential security that key-length inflation provides against Grover search.

Avoid:

- “doubling does nothing”;
- “Simon ignores key length completely”; and
- “a 512-bit key falls just as fast as a 64-bit key.”

For two-key Even-Mansour, `k₂` cancels from the periodic function, but `k₁` is still an `n`-bit period and the attack cost grows with `n`.

### 6. Put the Q2 Qualifier Beside Every “Broken” Claim

The limitations panel explains Q2 well, but the hero and break cards can be quoted or screenshotted without that qualification.

Add a persistent badge near the hero:

> **Q2 MODEL — coherent superposition access required**

Use target verdicts such as:

> **BROKEN IN Q2 — period s = …**

For CBC-MAC and GCM-related copy, say:

> Completely broken in the superposition-query security model.

This preserves the strength of the result while preventing readers from interpreting the toy exhibit as a remotely executable attack on ordinary TLS endpoints.

### 7. Describe Q2 as Oracle Access, Not “Handing Over the Secret Key”

The current explanation says Q2 means handing a quantum device the secret key.

More precisely, the attacker receives coherent black-box access to an oracle implementing the keyed primitive. The key can remain internal to the oracle.

Recommended wording:

> The adversary can query a keyed encryption or MAC oracle coherently on a superposition of inputs and preserve the resulting quantum state.

### 8. Distinguish Query Complexity From Gate Complexity and Runtime

The page extrapolates:

> at `n = 128`, Simon needs roughly 130 queries.

That is a query-complexity statement, not a practical runtime estimate.

A real attack must also pay for:

- reversible implementation of the cipher or MAC;
- oracle depth;
- ancillary qubits;
- uncomputation;
- fault-tolerant overhead;
- state preparation;
- measurement repetition; and
- classical post-processing.

Add a card:

> **130 queries does not mean 130 cheap operations.** Each query is a coherent execution of the full keyed construction.

The input-width note should say:

> Query complexity grows linearly, while this classical simulator’s memory and runtime grow exponentially.

Replace:

> the algorithm does not care.

### 9. Show Probability Magnitudes, Not Only Signs

This is the most valuable presentation improvement.

The principal reason for building a full statevector simulator is that Even-Mansour’s extra collisions make the surviving outcomes nonuniform.

However, the grid displays only:

- `+`;
- `−`; or
- `0`.

The learner cannot see which surviving outcomes are more likely.

Add one of:

- probability percentages inside each post-Hadamard cell;
- opacity proportional to probability;
- a miniature probability bar;
- a toggle between **sign view** and **probability view**; or
- a histogram beneath the grid.

Then compare:

- textbook target: uniform over `s⊥`;
- Even-Mansour: zero outside `s⊥`, skewed within it.

This would finally make the simulator’s most sophisticated fidelity choice visible.

### 10. Change “Half the Answers Vanish” to “At Least Half”

For the exact two-to-one target, exactly half the outcomes cancel.

For a target with merged preimage classes, additional outcomes inside `s⊥` can also cancel. The browser tests already acknowledge this.

Recommended title:

> **Why every non-orthogonal answer vanishes**

or:

> **Why at least half the answers vanish**

### 11. Replace “Both Contributing Paths” With “All Contributing Paths”

Several descriptions say the arithmetic panel adds both contributing paths.

For an Even-Mansour output with accidental collisions, the observed preimage class can contain more than two inputs.

Use:

> Select an outcome and the lab computes every contributing path from the observed preimage class.

The code already handles all paths correctly; the prose should catch up.

### 12. Make Only the Post-Hadamard Outcome Grid Drive the Arithmetic Panel

Every cell in both grids is currently clickable.

A cell in the first grid represents an input basis state `x`, while the arithmetic panel interprets its numeric value as an output candidate `y`.

Clicking a pre-Hadamard input therefore silently changes semantic roles from `x` to `y`.

Choose one:

- make only the post-Hadamard outcome cells interactive; or
- give pre-Hadamard cells a separate interaction that highlights the complete preimage class and its `x XOR s` partners.

Do not label the resulting computation “Outcome y” after the learner clicked an input `x`.

### 13. Fix the Outdated `promiseReport()` Documentation

The final comment in `src/quantum/simon.ts` says that oversized preimage classes are:

> where a non-orthogonal measurement comes from.

That directly contradicts the corrected explanation above it and the newest tests.

Extra collisions can skew the distribution and cancel additional orthogonal outcomes, but they do not create mass where `y · s = 1` while `s` remains a genuine period.

Rewrite that documentation immediately.

### 14. Make the Even-Mansour Uniqueness Test Match Its Name

The test is titled:

> the period is exactly `k₁`

but it currently proves only that `k₁` is **a** period.

Add:

```text
for every nonzero s != k1:
    verifyPeriod(table, n, s) must be false
```

This matters because a target with an additional global period would leave a larger period subspace and could prevent unique key recovery.

The current fixed public permutations appear to avoid that problem, but the suite should enforce it.

### 15. Correct the “Uniform Random Permutation” Claim

`derivePermutation()` does not sample an information-theoretically uniform permutation from the full permutation set.

It uses a deterministic SHA-256-derived stream from a 128-bit seed.

At `n = 6`:

- the domain contains 64 elements;
- there are `64!`, approximately `2^296`, possible permutations;
- a 128-bit seed can select at most `2^128` generated tables.

Therefore, most 64-element permutations are unreachable.

Recommended wording:

> A deterministic SHA-256-seeded pseudorandom permutation table, shuffled with unbiased Fisher-Yates indices.

Two cleaner implementation choices:

1. Keep deterministic generation and stop calling it an ideal or uniformly sampled permutation.
2. Draw Fisher-Yates indices directly from `crypto.getRandomValues()` when a fresh truly random toy permutation is desired.

The theorem applies to an ideal random permutation; this browser demonstrates the attack on a representative pseudorandom toy table.

### 16. Domain-Separate Permutations by Width and Purpose

The SHA-256 stream label does not include:

- `n`;
- target type; or
- intended role.

The same key material used at different widths draws from correlated stream prefixes.

Include a structured domain label such as:

```text
crypto-lab-simon-period
purpose = public-even-mansour-permutation
width = 6
version = 1
```

Use a different purpose for CBC-MAC’s keyed toy permutation.

### 17. Disclose That the Public Even-Mansour Permutation Is Fixed

`publicPermutation(n)` uses a constant seed and memoizes one table per width.

That is a reasonable way to model a published public permutation, but the page sometimes sounds as though a fresh ideal `P` is sampled for every target or race trial.

Say:

> Each width uses one fixed, published teaching permutation. New-secret runs change the whitening keys, not `P`.

In the race, “fresh target” should mean fresh keys against the same public `P`.

### 18. Separate the No-Period Control From the Birthday Race

The race accepts the selected target, including **No period**.

For an injective permutation:

- the classical algorithm is not performing a birthday period search;
- it must exhaust the domain to establish no collision;
- the displayed `2^(n/2)` birthday reference is irrelevant; and
- the bar label “birthday (classical)” is false.

Choose one:

- disable the no-period target for the standard period-finding race; or
- render a separate control comparison labelled:
  > prove injectivity/no period: full-domain classical check vs. rank-`n` quantum evidence.

The current race language is valid only for periodic targets with collision structure.

### 19. Use the Correct Target-Specific Classical Reference

The page displays:

```text
2^(n/2)
```

For a textbook two-to-one Simon function, the collision classes number `2^(n−1)`, and the expected first-collision scale is closer to:

```text
sqrt((π/2) × 2^(n−1))
```

The asymptotic `Θ(2^(n/2))` statement is correct, but the panel presents a numeric reference.

Label it:

> asymptotic birthday scale

or display the expected finite-domain mean used by the unit test.

### 20. Separate Textbook Separation From Real-Construction Measurements

The rigorous black-box separation belongs most cleanly to the promised textbook function.

For Even-Mansour:

- the function can have extra collisions;
- wrong collision candidates need verification; and
- the browser excludes that verification cost.

Consider two race modes:

#### Promise-problem race

Textbook 2-to-1 function, matching Simon’s lower-bound setting.

#### Construction race

Even-Mansour or CBC-MAC, explicitly labelled as an empirical search-phase comparison.

### 21. Make Verification Cost Visible in the Verdict

The verdict currently says:

> Verified against `f` over all inputs … queries spent: N.

Those statements sit together even though the exhaustive audit is not included in `N`.

Use:

```text
Simon rounds: 7 coherent oracle calls
Candidate audit: 32 table comparisons
Exploit audit: 32 full-codebook checks
```

This is one of the lab’s strongest honesty opportunities.

### 22. Avoid Saying “Nothing Is Searched”

The period is derived by linear algebra rather than generic candidate search, which is the intended lesson.

But the demo subsequently enumerates candidate periods and exhaustively audits the function.

Recommended wording:

> The candidate is derived from equations rather than found by brute-force search. The browser then audits it exhaustively because the toy domain is small.

### 23. Make the Rank Meter Target-Aware

For the no-period control, the UI can display:

```text
5 / 4 needed
```

That is mathematically explainable but visually confusing.

Use:

- periodic target: `rank r / (n−1) needed to isolate a period`;
- no-period control: `rank r / n needed to prove no nonzero period`.

Update the meter’s accessible label as well.

### 24. Do Not Style the Control as Broadly “Safe”

The CSS/status class for the no-period result is `is-safe`.

The control proves only:

> this particular oracle has no nonzero XOR period.

It does not prove that a primitive, mode, or surrounding construction is quantum-safe.

Use a neutral status such as:

> **NO XOR PERIOD FOUND — control behaves as expected**

### 25. Tighten the Countermeasure Advice

The page currently recommends ideas such as adding rounds or using independent subkeys.

Those may remove a particular period, but none is a generic proof of Q2 security.

Recommended wording:

> The construction must prevent an adversary from building a periodic oracle from its interfaces, and it needs an analysis in the intended quantum-query model.

Treat “add rounds” as an example that can alter structure, not as a guaranteed repair.

### 26. Specify “Raw Fixed-Length Two-Block CBC-MAC”

The live target implements:

```text
MAC(m1 || m2) = E(E(m1) XOR m2)
```

over exactly two blocks.

Label it:

> **Raw two-block fixed-length CBC-MAC**

This prevents learners from confusing the Q2 forgery with CBC-MAC’s well-known classical variable-length misuse problem.

### 27. Clarify What “Real Construction” Means

The page repeatedly says the attacks are checked against the “real cipher” or “real MAC.”

The formulas and exploit logic are real, but the block cipher is a tiny table-based toy permutation.

Use:

> the actual toy construction implemented on this page

rather than wording that may imply AES-scale CBC-MAC or deployed Even-Mansour.

### 28. Remove the Unused Statevector Clone

`simonRound()` creates:

```ts
const snapshot = cloneState(state);
```

then immediately discards it with:

```ts
void snapshot;
```

This allocates and copies the complete state on every round, including every race trial, without affecting the result.

Remove the clone and the unused import unless a future panel will display that snapshot.

### 29. Add Deterministic Target Generation for Tests

The measurement RNG is seeded in several places, but target keys and periods still come from `crypto.getRandomValues()`.

This makes failures harder to reproduce and leaves a small probability of stochastic CI behavior.

Inject a randomness source into:

- `randomKey`;
- `randomWord`;
- target builders; and
- public-permutation generation.

Use deterministic seeds in unit and browser tests, while production continues using the platform CSPRNG.

### 30. Add Error-Safe `finally` Handling

`rebuild()` and `runRacePanel()` can leave controls disabled if target construction or crypto APIs throw.

Wrap asynchronous UI actions in `try / catch / finally` so that:

- `state.busy` is cleared;
- buttons are restored;
- stale results are not shown; and
- the failure is announced in an accessible status region.

### 31. Split the Browser Test Commands

Both of these scripts currently run the same entire Playwright suite:

```json
"test:a11y": "playwright test",
"test:e2e": "playwright test"
```

Use:

```json
{
  "test:e2e": "playwright test",
  "test:a11y": "playwright test e2e/a11y.spec.ts",
  "test:claims": "playwright test e2e/claims.spec.ts"
}
```

Have deployment run `npm run test:e2e`.

Rename the workflow step from:

> Accessibility gate

to:

> Browser claims and accessibility gate

### 32. Add Direct Primary-Source Links

The paper names and venues are good, but the lab would be more useful academically with direct links to:

- Simon’s SICOMP paper;
- Kuwakado and Morii’s Even-Mansour paper;
- Kaplan et al.’s CRYPTO 2016 paper;
- the 3-round Feistel paper; and
- the quantum slide-attack paper.

Add a compact references section with DOI or archival links.

### 33. Remove or Source Dynamic Ecosystem Claims

Two statements deserve direct sourcing or removal:

- GCM carries the majority of TLS 1.3 traffic.
- NIST’s processes ask about superposition-query security because of this specific line of work.

Both are broader and more time-sensitive than the mathematical claims implemented by the lab.

### 34. Refine the Simon–Shor Relationship

The README describes Shor as essentially Simon moved from XOR periodicity to modular periodicity.

They share the hidden-period/hidden-subgroup shape, and Simon’s result directly influenced Shor, but they are not the same algorithm with only the Hadamard replaced.

Recommended wording:

> Simon’s algorithm is the hidden-subgroup problem over `(Z₂)^n`; Shor’s period finding works over cyclic arithmetic groups using the quantum Fourier transform. Simon supplied the conceptual path, but the algorithms solve different group structures.

### 35. Add a Visible Fidelity Panel

A compact panel near the controls could say:

#### Real in this lab

- complete statevector evolution;
- reversible XOR-oracle action;
- actual output-register measurement;
- real interference arithmetic;
- GF(2) elimination;
- toy Even-Mansour key recovery;
- toy CBC-MAC forgery; and
- measured logical-query counts.

#### Modeled or omitted

- the oracle table is precomputed;
- no quantum hardware;
- floating-point amplitudes;
- no reversible cipher synthesis;
- no gate, depth, noise, or fault-tolerance accounting;
- exhaustive audits are not counted as attack queries; and
- Q2 access is assumed.

This single panel would resolve most possible misreadings.

## Recommended Test Additions

1. Every wrong nonzero Even-Mansour period is rejected, proving uniqueness rather than merely confirming `k₁` is one period.
2. The displayed audit-evaluation count agrees with the actual verification work.
3. The no-period target never receives a birthday-bound label.
4. The rank meter switches from an `n−1` threshold to an `n` threshold for the control.
5. Only post-Hadamard cells invoke outcome arithmetic.
6. A pre-Hadamard cell either has no button role or opens a separate preimage explanation.
7. Probability labels equal the squared amplitudes shown by the simulator.
8. The textbook probability view is uniform across `s⊥`.
9. The Even-Mansour probability view is zero outside `s⊥` and visibly nonuniform within it when extra collisions occur.
10. No user-facing text calls Float64 results mathematically exact.
11. No user-facing text says complex amplitudes are stored.
12. Q2 appears in every break verdict and break card.
13. Target generation is reproducible under an injected test seed.
14. Permutation derivation includes width and purpose in its domain separator.
15. A failure during target creation or race execution restores all controls.
16. Deployment runs both claims and accessibility under an accurately named command.
17. The unused state clone is removed or becomes an asserted visual state.

## Suggested Teaching Sequence

The current wayfinder is strong. I would refine it to:

> Oracle model → One Simon round → Probability and cancellation → GF(2) equations → Verified period → Executed consequence → Query accounting → Q2 and resource limits

The critical distinction should remain visible throughout:

```text
query complexity
    is not
gate complexity
    is not
classical simulation runtime
    is not
practical attack feasibility
```

## Final Verdict

Simon Period is already one of the collection’s best labs.

The quantum mechanism is not hand-waved:

- amplitudes evolve;
- paths cancel;
- equations accumulate;
- candidates are verified;
- key recovery and forgery execute; and
- a control proves that the method does not invent a period.

The remaining work is mainly to make its honesty as rigorous as its algebra:

1. count and label every category of work;
2. distinguish full numerical simulation from exact arithmetic;
3. put Q2 beside every break claim;
4. replace “doubling does nothing” with a query-complexity-accurate statement;
5. stop calling the seeded permutation ideal or uniformly random;
6. visualize probability magnitudes;
7. fix the multi-path and pre-grid interaction wording; and
8. make the race target-aware.

With those changes, Simon Period would be not merely a striking quantum demo, but an unusually careful explanation of where theoretical quantum query separations end and real cryptanalytic engineering begins.
