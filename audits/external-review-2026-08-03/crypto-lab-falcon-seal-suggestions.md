# Crypto Lab Falcon Seal — Suggestions

## Overall Assessment

Falcon Seal is now one of the most ambitious and technically interesting labs in the collection.

The new toy-scale trapdoor implementation is the most important recent improvement. It closes the central conceptual gap in the earlier version: the original illustrative signing flow did not use the private key, while the new panel actually:

- samples the short NTRU polynomials `(f, g)`;
- solves the NTRU equation `f·G − g·F = q` for `(F, G)`;
- builds the full `2n`-dimensional trapdoor basis;
- produces a short solution using that basis;
- verifies the real Falcon-style equation `s₁ + s₂·h ≡ c (mod q)` together with a norm bound; and
- demonstrates equation-valid but overly long forgeries.

That turns the lab from an honest explanation of a missing mechanism into an exhibit that actually demonstrates the mechanism at toy scale.

The lab now contains several distinct fidelity levels:

1. A two-dimensional lattice intuition playground.
2. An intentionally forgeable illustrative signing flow.
3. A real NTRU trapdoor and verification equation at toy dimension `n = 8`.
4. A timing-leakage model.
5. A real Falcon-1024 WebAssembly implementation.

That breadth is a major strength, but it also creates the lab’s biggest remaining problem: the documentation and narrative structure have not completely caught up with the new mechanism.

## What Improved Most

### 1. The Private Key Is Finally Load-Bearing

The new trapdoor signer genuinely depends on the completed basis `(f, g, F, G)`. This is the precise mechanism the earlier illustrative signer lacked.

The panel does more than announce that the trapdoor helps. It compares measured outcomes from:

- the completed `2n`-row basis;
- an intentionally incomplete `n`-row basis;
- a public-key-only forgery attempt; and
- a damaged completion.

That is a strong experimental teaching design.

### 2. The NTRU Equation Is Shown, Not Merely Described

Displaying `f·G − g·F` coefficient by coefficient and comparing it with the required polynomial `q` is excellent.

It makes the trapdoor completion inspectable and gives learners a concrete invariant to check rather than asking them to trust a label.

### 3. Verification Teaches the Correct Two-Part Requirement

The new verifier separates:

1. the equation check `s₁ + s₂·h ≡ c (mod q)`; and
2. the shortness check `‖(s₁, s₂)‖² ≤ β²`.

The public-key-only forger demonstrates why satisfying the equation is easy while finding a sufficiently short solution is hard without the trapdoor. This is much more accurate than treating shortness by itself as proof of authorship.

### 4. The Limitations Are Stated Honestly

The panel clearly says that:

- `n = 8` provides no security;
- the lattice is only 16-dimensional;
- LLL could recover the trapdoor;
- Babai round-off is not Falcon’s Fast Fourier Gaussian sampling; and
- round-off has the historical NTRUSign leakage problem.

That honesty makes the educational value stronger, not weaker.

### 5. The Tests Assert the Claims Learners See

The browser suite checks the displayed NTRU equation, accepted signature, failed incomplete-basis attempt, equation-valid forgery, damaged trapdoor, and comparison table.

The recent build changes also ensure TypeScript checking occurs before the normal production build.

## Priority Recommendations

### 1. Rewrite the README Immediately

This is the most urgent correction.

The README still says, in broad terms, that:

- the signing flow never reads the private key;
- key generation stops at `(f, g, h)`;
- `(F, G)` does not exist in the build;
- the lab cannot teach unforgeability; and
- the final panel is the WebAssembly implementation.

Those statements describe Panels 2 and 3, but they are no longer true of the lab as a whole because Panel 7 now implements the missing trapdoor mechanism.

The README should introduce the lab as three separate signing layers:

#### Layer A — Illustrative Full-Size Flow

Panels 2 and 3 use nominal Falcon-512/Falcon-1024 dimensions and real NTRU public-key arithmetic, but their signer is intentionally forgeable and does not use the private trapdoor.

#### Layer B — Real Trapdoor Mechanism at Toy Scale

Panel 7 uses `n = 8`, solves `f·G − g·F = q`, signs with the completed basis, and verifies the real equation plus norm bound. It demonstrates the unforgeability mechanism but provides no security and does not use Falcon’s Gaussian sampler.

#### Layer C — Real Falcon-1024 WebAssembly

Panel 6 runs an existing Falcon implementation for real key generation, signing, verification, sizes, and timings.

Remove or rewrite phrases such as:

- “the completing pair `(F, G)` does not exist”;
- “what it cannot teach is unforgeability”; and
- “the final panel runs real Falcon-1024.”

Those can remain only when explicitly scoped to the illustrative Panels 2 and 3.

### 2. Correct the “Only `(f, g)`” Experiment’s Interpretation

This is the most important technical wording issue.

The panel currently describes the incomplete-basis experiment as:

- “Sign with only `(f, g)`”;
- “Half the private key”; and
- evidence that a holder of `(f, g)` is no better off than someone holding no private key.

That conclusion is too strong.

The same key-generation code begins with `(f, g)` and then derives `(F, G)` by solving the NTRU equation. A party possessing the valid secret pair `(f, g)` can run that completion procedure. Therefore, `(f, g)` is not equivalent to having no useful secret information.

What the experiment actually proves is narrower:

> Babai round-off against only the first `n` rotations produces an intentionally rank-deficient basis that cannot cancel the target in all `2n` directions.

Recommended changes:

- Rename the button to **“Attempt signing with an incomplete n-row basis.”**
- Rename the comparison row to **“Incomplete rank-n basis: rotations of `(g, −f)` only.”**
- Replace “Half a trapdoor is not half an advantage; it is none” with:

> For this round-off algorithm, withholding the completion rows makes the supplied basis rank-deficient, and its measured results are no better than the public-only attempt.

Do not describe this as proving that a holder of `(f, g)` has no advantage. The experiment withholds the completion algorithm, not merely secret data.

A stronger comparison would use:

1. the completed private basis;
2. the deliberately rank-deficient basis;
3. the public-only equation forger; and
4. the damaged completion.

That preserves the excellent experiment without overclaiming.

### 3. Move the Trapdoor Panel Earlier

Panel 7 closes the exact gap introduced in Panels 2 and 3, but it currently appears after the WebAssembly panel.

This creates two problems:

- the most educational mechanism is buried near the bottom; and
- the real WebAssembly implementation stops feeling like the finale.

Recommended order:

1. NTRU lattice primer
2. Illustrative key generation
3. Illustrative signing, verification, and forgery
4. **Toy-scale real trapdoor mechanism**
5. Size and algorithm comparison
6. Timing and side-channel risks
7. Real Falcon-1024 WebAssembly

The progression would then be:

> intuition → flawed approximation → real mechanism → implementation danger → production implementation

### 4. Update the Guided Tour

The guided tour currently stops at the WebAssembly panel and says:

> “That’s the whole demo.”

It does not visit the new trapdoor panel, even though that panel now contains the lab’s most important conceptual result.

Add tour steps that:

1. generate a toy trapdoor;
2. show the coefficient-by-coefficient NTRU equation;
3. sign with the completed basis;
4. run the incomplete-basis attempt;
5. run the public-only forgery; and
6. damage `F` and show verification failure.

The WebAssembly panel should become the final tour step only after the toy mechanism has been demonstrated.

### 5. Snapshot the Message Used by the Comparison

The Panel 7 comparison table says:

> “Same public key, same message, same verifier.”

However, each action reads the current message independently. A learner can:

1. sign one message with the full basis;
2. edit the message in Panel 3;
3. run the incomplete-basis attempt or forgery; and
4. receive a comparison table claiming all runs used the same message.

Store an `experimentMessage` when the Panel 7 experiment begins. Then either:

- use that exact message for every comparison action; or
- clear all comparison results whenever the message changes.

Display the captured message or a short digest beside the table so the claim is inspectable.

### 6. Move Trapdoor Computation into a Web Worker

The toy key-generation operation performs exact BigInt determinant, linear-algebra, resultant, and completion work synchronously in the click handler.

Even at `n = 8`, a slow or unlucky run can block the main browser thread. While it runs, the page may appear frozen and an `aria-live` status cannot paint until the computation returns.

Recommended implementation:

- place key generation and signing in a Web Worker;
- disable the relevant buttons while work is active;
- display “Solving the NTRU equation…” before dispatching the worker;
- return structured progress or at least completion/failure; and
- make cancellation possible when practical.

This would improve responsiveness without changing the mathematics.

### 7. Make Randomized Tests Reproducible

Several browser tests depend on randomly generated keys, nonces, and sampled vectors while asserting a specific ordering or failure outcome.

The probabilities may be favorable, but cryptographic randomness in a regression suite creates avoidable flake risk.

Inject a randomness provider into the toy trapdoor module:

- production mode: `crypto.getRandomValues`;
- test mode: a deterministic seeded generator.

Keep at least one separate stochastic smoke test if desired, but use deterministic vectors for the load-bearing browser assertions.

### 8. Fix the Deploy Script’s Typecheck Bypass

The normal build script correctly runs:

```text
tsc --noEmit && vite build
```

But the deploy script still runs a bare `vite build`, bypassing the new TypeScript gate.

Change:

```json
"deploy": "vite build && gh-pages -d dist"
```

to:

```json
"deploy": "npm run build && gh-pages -d dist"
```

Otherwise a local `npm run deploy` can publish code that the normal build command would reject.

### 9. Tighten the Panel Title

“Real trapdoor signing” can be read as “real Falcon signing,” even though the panel intentionally uses Babai round-off rather than Falcon’s Fast Fourier Gaussian sampler.

A more precise title would be:

> **Real NTRU trapdoor mechanism at toy scale**

or:

> **Toy NTRU trapdoor signing with Babai round-off**

This preserves the legitimate claim—real NTRU equation, real completed basis, real verification equation—without blurring the missing Falcon sampler.

### 10. Add a Lab Navigator and Fidelity Labels

This lab is now long enough to need a visible map.

Add a compact jump navigator beneath the hero:

> Primer → Illustrative Flow → Forge It → Real Toy Trapdoor → Compare → Timing Attack → Real WASM

Also add a small fidelity label to each major panel:

- **Geometric analogy**
- **Illustrative and intentionally forgeable**
- **Exact toy mechanism; no security**
- **Timing model; not a browser measurement**
- **Real WebAssembly implementation**

The lab already states these limitations in prose. Making them visually consistent would help learners retain which claims belong to which layer.

### 11. Update Quiz 2’s Definition of the Trapdoor

Quiz 2 currently centers `(f, g)` as the trapdoor and then explains that key generation extends it to `(f, g, F, G)`.

After adding Panel 7, the clearest answer would be:

> The completed short NTRU basis derived from `(f, g)` and its completion `(F, G)`.

This avoids teaching that the rank-n rows used by the incomplete-basis experiment are themselves the complete signing basis.

## Final Verdict

The newest work is a substantial advancement.

Before Panel 7, Falcon Seal’s greatest strength was its honesty about why its illustrative signer was forgeable. Now it goes further and implements the missing NTRU trapdoor mechanism at a scale small enough to inspect.

The main remaining work is not adding another feature. It is aligning every explanation with what the lab now actually contains:

- rewrite the README;
- correct the interpretation of the `(f, g)`-only experiment;
- move the trapdoor mechanism into the main learning sequence;
- include it in the guided tour; and
- harden the experiment state and test reproducibility.

With those corrections, Falcon Seal would become one of the collection’s best examples of how to teach a sophisticated cryptographic design without pretending that a browser demonstration is production cryptography.
