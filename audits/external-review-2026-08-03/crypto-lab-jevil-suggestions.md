# Crypto Lab Jevil — Suggestions

## Overall Assessment

Jevil is one of the most conceptually original labs in the collection.

The strongest part is that it does not merely animate a “catastrophic cliff.” It performs real finite-field evaluation and Lagrange interpolation, tracks only distinct public points, reconstructs the polynomial from the ledger, and compares every recovered coefficient against the true secret. The tower-field option, malicious higher-degree signer, public transcript export, and offline verifier give the lab much more substance than a normal explanatory visualization.

The latest testing work is also excellent. The browser suites now cross-check the page’s parameter identities, counters, progress meter, signature accounting, cliff verdict, malicious-escape path, transcript export, offline verifier, stale-result retirement, and unapplied selector state. That is unusually strong for an educational site.

The biggest remaining issues are not the core interpolation arithmetic. They are about exactly what the lab claims that arithmetic proves.

## What Improved Most

### 1. The Page’s Claims Are Now Tested as a System

The recent browser tests do much more than search for expected phrases. They verify relationships such as:

- `M = (n* + 1)K`;
- `D = M - 1`;
- `T = 2M`;
- the cliff occurs at signature `n* + 1`;
- the ledger count equals the OOD point plus revealed points minus duplicates;
- the coefficient table contains the advertised number of recovered values; and
- the public transcript survives an independent CLI verification path.

That makes the lab’s visible conclusions much harder to accidentally disconnect from its calculations.

### 2. Stale Verdicts Are Properly Retired

The latest fixes for exported results and unapplied parameter selectors are important usability improvements.

A cryptography lab is especially dangerous when two parts of the screen silently refer to different states. The new ledger stamp and “press Generate key to apply” notice prevent that ambiguity.

### 3. The Malicious-Signer Mode Is Excellent

Showing a degree-`D+1` signer evade the advertised degree-`D` cliff is a powerful way to explain why the omitted zk-WHIR commitment is load-bearing.

The mode does not merely say “a commitment is necessary.” It demonstrates the exact failure that degree binding prevents.

### 4. The Public Transcript Is a Strong Educational Feature

Exporting only public values and reconstructing a polynomial outside the browser is a compelling way to show that the recovered coefficients are not a stored answer.

The idea should remain. It only needs tighter trust semantics and stricter validation.

### 5. The Fidelity Documentation Is Better Than Most Demos

`KNOWN-GAPS.md` clearly separates:

- exact finite-field arithmetic;
- the base and extension fields;
- hash-derived positions;
- the OOD point;
- distinct-point accounting;
- real interpolation;
- the missing polynomial commitment;
- the illustrative real-number plot; and
- the schematic soft-vs-sharp comparison.

That honesty is one of the lab’s greatest strengths.

## Priority Recommendations

### 1. Narrow the “Information-Theoretically Hidden” Claim

This is the highest-priority correction.

The page currently says that below `D+1` points the secret is information-theoretically hidden and that even unlimited computing power cannot determine which polynomial is the true secret.

That statement is true about the interpolation problem when considering only the revealed evaluations and a uniformly selected degree-`D` polynomial.

It is not true of this implementation as a whole.

The implementation generates every coefficient deterministically from an eight-byte seed. Therefore, the actual key generator can produce at most `2^64` different polynomials, not infinitely many. It also publishes:

- a 48-bit `rootHint` derived from that seed; and
- a 256-bit fingerprint of the coefficient vector.

An unbounded adversary can enumerate the implementation’s seed space and test candidates against those public values. The public fingerprint also computationally distinguishes the intended polynomial from alternate interpolants.

Recommended replacement:

> From the revealed evaluations alone, fewer than `D+1` distinct points do not uniquely determine a degree-`D` polynomial. Many polynomials remain consistent with those points. The full scheme additionally relies on its commitment and hash assumptions for computational security.

Avoid “even unlimited computing power” unless the discussion is explicitly restricted to the evaluation equations and excludes the public fingerprint and deterministic key derivation.

Also update `KNOWN-GAPS.md`, the cliff status, the plot explanation, and any accessibility labels that repeat the information-theoretic wording.

### 2. Increase the Seed to 32 Bytes

`randomSeed()` currently produces only eight random bytes.

That is far below the paper’s approximately 124-bit security target and below the 32-byte secret-key size described by the paper. It also makes the information-theoretic overclaim much more concrete because the entire demo key space is enumerable in `2^64`.

Use at least 32 random bytes:

```text
crypto.getRandomValues(new Uint8Array(32))
```

The lab can still derive coefficients deterministically for reproducibility, but the seed should have paper-scale entropy.

Add a test asserting the generated seed contains 32 bytes and update any comments describing the key distribution.

### 3. Anchor Transcript Verification to a Separately Known Public Key

The offline verifier currently compares the reconstructed polynomial against a fingerprint stored inside the same JSON transcript.

That proves internal consistency:

> These supplied points interpolate to a polynomial whose hash equals this supplied fingerprint.

It does not prove that the transcript belongs to the original public key. Someone can create different points and replace the fingerprint in the same file.

Recommended changes:

- Add an optional required CLI argument such as:

  ```text
  npm run verify transcript.json --expected-fingerprint <known fingerprint>
  ```

- Or export the public key separately and require the verifier to receive it from an independently authenticated source.
- Display the full public fingerprint prominently when the key is generated.
- Phrase the current result as **“internally consistent”** unless an external fingerprint was supplied.
- Reserve **“VERIFIED against the known public key”** for the externally anchored path.

This distinction matters because the lab currently presents the CLI result as proving that *the* key fell out of public data. It proves that only relative to the fingerprint the verifier trusts.

### 4. Harden and Canonicalize the Transcript Schema

The transcript currently contains an `ood` field and also includes the OOD point in `points`, because `ledgerPoints()` starts with the OOD pair. The verifier ignores the separate `ood` field entirely.

As a result, someone can alter `ood` and the file still verifies.

Other fields are also insufficiently validated:

- `version` is not checked;
- an unknown `field` value falls through to the base field;
- `rootHint` is not checked;
- parameter identities are not validated;
- malformed coordinate lengths are not rejected explicitly; and
- the verifier does not confirm `M = (n*+1)K`, `D = M-1`, `T = 2M`, and `nCliff = n*+1`.

Recommended design:

- Include the OOD point exactly once.
- Reject unknown scheme versions and field identifiers.
- Validate every parameter identity and safe numeric range.
- Validate coordinate counts for base and tower elements.
- Reject duplicate or contradictory representations.
- Check that the OOD point in the transcript is the point used by interpolation.
- Return structured error codes rather than relying only on free-form strings.

Add mutation tests for:

- altered `ood`;
- altered `version`;
- unknown `field`;
- inconsistent `D` or `M`;
- malformed tower coordinates;
- duplicate points; and
- an excessive point count intended to cause resource exhaustion.

### 5. Rename the Export as a “Recovery Transcript,” or Include Signatures

The exported JSON proves that the included public points are sufficient to reconstruct a polynomial. It does not currently prove:

- which messages were signed;
- how the positions were derived;
- how many signatures produced the points;
- which points belonged to each signature; or
- that the points came from accepted Jevil signatures.

The file contains deduplicated points, not the original signature ledger.

Two clean options exist.

#### Option A — Narrow the Claim

Rename it:

> **Export public recovery transcript**

State that it audits interpolation and fingerprint consistency, not signature validity or the exact number of signing operations.

#### Option B — Export the Full Public Ledger

Include:

- signature number;
- message;
- derived indices;
- each revealed `(x, y)` pair;
- the OOD pair; and
- the advertised public-key fields.

The verifier can then independently re-derive positions from `rootHint` and each message, reproduce duplicate accounting, and confirm the cliff count.

It still cannot validate polynomial-opening proofs without the omitted commitment, but it can audit substantially more of what the page claims.

### 6. Guarantee That the OOD Point Is Actually Out of Domain

`deriveOOD()` hashes directly to a field element but does not verify that the result differs from every position point `g^i` in the domain.

The collision probability is tiny, especially in the extension field, but “out of domain” is currently a probabilistic expectation rather than an enforced invariant.

Use rejection sampling:

1. derive a candidate with a counter;
2. compare it against `psi(0)` through `psi(T-1)`;
3. retry when it lies in the position domain.

Add a deterministic test with an injected hash source that deliberately produces a domain point on the first draw.

### 7. Remove the “Security Grade” Label from `K = 16`

The selector describes `K = 16` as “security grade.”

`K = 16` alone does not make a configuration security-grade. The same screen permits:

- the 64-bit base field;
- unsupported signing budgets such as `n* = 2, 4, 5, 6`;
- an eight-byte seed;
- the missing zk-WHIR commitment; and
- tiny demo domains.

Rename the option to something such as:

> `16 — paper parameter value`

Then state that the full parameter set, commitment, random-oracle encoding, and proof system determine security—not `K` by itself.

### 8. Scope the 124-Bit Claim to the Paper’s Full Construction

The hero says that one signature past budget turns a “~124-bit-safe key” into public data.

That statement is too broad on a page whose default configuration uses:

- tiny visual parameters;
- the base field;
- no zk-WHIR commitment; and
- only 64 bits of seed entropy.

Recommended wording:

> In the paper’s full construction and recommended parameters, signatures through `n*` target about 124-bit classical security; signature `n*+1` makes the secret polynomial recoverable.

Use a persistent fidelity badge near the hero:

> **This demo proves the cliff arithmetic, not the paper’s full security level.**

### 9. Make the Soft-vs-Sharp Chart Explicitly Schematic

The chart puts a numeric HORS bound on the same “forgery probability” axis as a Jevil line drawn exactly at zero before the cliff.

That visually implies a measured zero forgery probability for the live demo configuration. It also mixes tiny demo parameters for HORS with the paper’s approximately 124-bit statement for Jevil.

Better options:

- Use a logarithmic y-axis and draw the paper’s claimed pre-cliff security floor.
- Plot both schemes using clearly identified paper parameter sets.
- Or relabel the y-axis as **“qualitative failure behavior”** and mark the Jevil line **“schematic: negligible, not zero.”**

The current caveat is present, but it is visually subordinate to a graph that appears quantitative.

### 10. Use Unbiased Sampling for Security-Descriptive Paths

The XOF converts 128-bit chunks to Goldilocks elements with modular reduction, then derives indices by reducing those field values modulo `T`.

The field-element reduction has a small but nonzero concrete bias, and reducing a roughly 64-bit field value modulo a small non-divisor `T` produces bias at roughly the 64-bit scale for several offered domains. That does not align with a 124-bit security narrative.

For a teaching-only visualizer this is not catastrophic, but the fidelity documentation currently calls the sampling faithful and the bias negligible.

Recommended implementation:

- sample field elements using rejection sampling from a wider SHAKE stream; and
- sample indices directly from raw XOF bytes with rejection against the largest multiple of `T`.

Then add distribution sanity tests and document that the code models the random oracle without modulo bias relevant to the claimed security level.

### 11. Separate “First-of-Its-Kind” Claims from the Lab’s Own Voice

The page says Jevil is the first post-quantum, transparent, sharp-cliff, count-triggered FTS.

The paper makes this “to our knowledge” claim. Because the paper is a recent preprint, the lab should preserve that attribution everywhere.

Recommended wording:

> The paper claims, to the author’s knowledge, that Jevil is the first scheme combining these four properties.

This keeps the lab accurate if related work or later revisions change the priority claim.

### 12. Reframe “When to Use It” as Proposed Applications

The README currently presents firmware releases, attestation budgets, and ephemeral signers under “When to Use It.”

Jevil is a new preprint with very large signatures, and the lab omits its load-bearing commitment. Those scenarios are better presented as proposed or research applications.

Rename the section:

> **Where the Idea Could Fit**

Add:

> Jevil is experimental research, not a standardized or broadly audited production signature scheme.

The existing “do not use this demo” warning is necessary but does not fully communicate the maturity of the underlying scheme.

## Testing Additions

The current tests are already a major strength. The next tests should target trust boundaries rather than more UI counters:

1. A public fingerprint and 32-byte seed-entropy test.
2. A test proving the OOD derivation rejects a domain collision.
3. Transcript schema tests for every ignored or malformed field.
4. A test showing that changing both points and the embedded fingerprint produces only an “internally consistent” result, not externally authenticated verification.
5. A full-ledger export test that re-derives message positions.
6. A deterministic random-source interface so rare edge cases can be forced.
7. A test that the “information-theoretic” language never appears without the qualifier “from the evaluations alone.”

## Smaller Presentation Improvements

### Add a Six-Step Navigator

The page is long enough to benefit from a jump bar:

> Key → Sign → Cliff → Recover → Ledger → Compare

### Show the Public Fingerprint in the Key Panel

The transcript depends on it, but learners should see the exact trust anchor before exporting anything.

### Distinguish Three Different Statements

Use consistent labels:

- **Algebraically underdetermined:** fewer than `D+1` evaluations.
- **Computationally protected:** commitment and hash assumptions.
- **Catastrophically recovered:** enough public evaluations to interpolate the key.

That vocabulary would resolve most of the current conceptual ambiguity.

## Final Verdict

Jevil is already a very strong lab.

Its core achievement is real: the public ledger accumulates actual field points, distinct points determine the threshold, Lagrange interpolation reconstructs the polynomial, and the exact coefficient comparison proves the cliff occurred.

The highest-value next step is not another animation or panel. It is tightening the epistemology of the demo:

- what the points prove;
- what the fingerprint proves;
- what the transcript proves;
- what remains computational rather than information-theoretic; and
- which security claims belong to the paper rather than the tiny browser configuration.

After those corrections, Jevil would be one of the most rigorous and intellectually honest exhibits in the Crypto Lab collection.
