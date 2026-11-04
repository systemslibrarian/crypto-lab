# KDF converse resolution — 4 November 2026

**Disposition: reject the unrestricted deterministic converse as stated; use the corrected statements below. The restricted forward-bound calculator remains supported under its displayed assumptions.** This closes the mathematical question raised by R20261031-14. It does not turn a conditional calculation into a certificate for a real source, device or production KDF.

## What the issue means

The calculator asks a forward question: given the stated source, hash-family and application assumptions, what sufficient upper bound follows for the application's failure probability? Its two routes have a direct argument that does not use the disputed converse.

The converse asks a different question: if every permitted attack test succeeds with probability at most ε, what does that force the output distribution to look like? In the paper's literal deterministic-test definition, a test accepts a whole number of output/seed pairs. The claimed converse overlooks that rounding. A test budget of 2.4 pairs permits two pairs, not 2.4. This matters mathematically even though the calculator does not use that converse.

We have replaced the open-ended “converse held” disposition with a specific result: the unrestricted statement is false under that definition; a floor-adjusted deterministic statement is valid, and the original ratio is valid under either an integer-grid condition or a stronger randomized-test premise. No change to the calculator's numerical formulas is needed.

## Source and attribution

Dodis, Pietrzak and Wichs, *[Key Derivation Without Entropy Waste](https://eprint.iacr.org/2013/708)*, version dated 6 February 2014; [author-hosted PDF](https://cs.nyu.edu/~dodis/ps/nolossKDF.pdf), Definition 3.1 and Lemmas 3.3–3.6, PDF pp. 8–10. The sufficient forward constructions used by the calculator are Lemmas 4.2/4.4 and Corollaries 4.3/4.5, pp. 11–12.

Lemma 3.6 assumes heavy-set mass ε̂ > ε but then uses ε̂/t ≤ ε/t. That step does not follow. The [3 November investigation](kdf-calculator-investigation-2026-11-03.md) preserves the source-version hashes, the original counterexample and the earlier implementation receipts. The corrections and proofs here are our derivations, not an author-issued erratum or an independently published proof certification. This selected reread adds no full-paper reading credit.

## Corrected deterministic statement

Let P be a probability distribution on N atoms, and let U be uniform on those atoms. Fix 0 < δ < ε < 1. Suppose every deterministic acceptance set A satisfies

`|A|/N ≤ δ  ⇒  P(A) ≤ ε`.

The quantifier covers every joint acceptance set, including tests that depend on the public seed. This is an information-theoretic premise; restricting it to efficient tests or seed-independent events would not justify the proof below.

Let `q = floor(δN)`. If `q ≥ 1`, define `δ_eff = q/N` and `t_det = ε/δ_eff`. Then

`P({i : P(i) > t_det/N}) ≤ ε`.

Equivalently, the threshold for each heavy atom is `ε/q`.

**Proof.** Let H be the set of atoms with P(i) > ε/q, and suppose P(H) > ε. If |H| ≤ q, H itself is an allowed acceptance set, because |H|/N ≤ q/N ≤ δ. This contradicts the premise. If |H| > q, select any q atoms in H. Their total mass is strictly greater than q·ε/q = ε, and that set is also allowed. This again contradicts the premise. Thus P(H) ≤ ε. ∎

When `δN` is an integer, `δ_eff = δ`, giving the paper's claimed ratio `t = ε/δ`. When it is not an integer, the safe deterministic ratio is `ε/δ_eff`, which is at least `ε/δ`. If `q = 0`, only the empty set is allowed: the premise is vacuous and supplies no nontrivial distributional conclusion. One must not divide by zero or report an informative converse in that case.

Any future numerical implementation of this converse must calculate the floor using exact rational and integer arithmetic. Floating-point rounding near an integer could otherwise make the claimed threshold too strong. The present calculator does not calculate a converse.

### Translation to the paper's balance definition

For each flat source X of size 2^k and an independent uniform d-bit public seed S, let `load_X(y,s)` count the x in X mapped to y at seed s. The joint atom has probability

`P(y,s) = load_X(y,s) / 2^(k+d)`, with `N = 2^(m+d)`.

Consequently `P(y,s) > t/N` is exactly `load_X(y,s) > t·2^(k−m)`. Apply the preceding proof separately to every flat source covered by the extraction premise. The corrected deterministic implication is therefore `(k, δ, ε)` unpredictability extraction ⇒ `(k, ε/δ_eff, ε)` balance, provided `floor(δ·2^(m+d)) ≥ 1`. This argument retains the independent uniform seed and the quantified source class; it does not replace them with measurements from sample bytes.

## Original ratio under a stronger randomized premise

Suppose the premise instead covers **all randomized tests**, represented by weights `a_i ∈ [0,1]` satisfying `sum(a_i)/N ≤ δ`, and requires `sum(P(i)·a_i) ≤ ε`. Then the original ratio `t = ε/δ` is valid for every δ in the stated range.

**Proof.** Let H = {i : P(i) > t/N}, let u = |H|/N, and suppose p = P(H) > ε. If u ≤ δ, its indicator is an allowed test and contradicts the premise. If u > δ, accept on H with probability δ/u and reject elsewhere. The uniform acceptance is exactly δ, while actual acceptance is p·δ/u > t·δ = ε, since p > t·u. This contradicts the randomized premise. Hence P(H) ≤ ε. ∎

This is a change in the premise. The literal deterministic guarantee cannot be silently promoted to a guarantee against randomized tests with the same acceptance budget.

## Exact counterexample and repaired result

Take n = k = 4, m = 2 and d = 1. At each seed, map the 16 inputs into output buckets of sizes 5, 5, 3 and 3. The seed is independent and uniform; this example's map does not otherwise use it. The only source with min-entropy at least four bits on this domain is uniform, so this example covers the required source class.

There are N = 8 joint output/seed atoms, with probabilities `(5,5,3,3,5,5,3,3)/32`. Choose δ = 3/10 and ε = 1/3.

| Statement | Exact result |
| --- | --- |
| Allowed deterministic sets | At most floor(8·3/10) = 2 atoms; 37 allowed sets among all 256 subsets. |
| Largest actual success of an allowed deterministic test | 5/16 ≤ 1/3, so the premise holds. |
| Original ratio ε/δ | 10/9; the load threshold is 40/9. The size-five buckets have total mass 5/8 > 1/3, so the claimed conclusion fails. |
| Corrected deterministic ratio | δ_eff = 1/4 and t_det = 4/3; the load threshold is 16/3. No bucket is heavy, so the corrected conclusion holds. |
| Randomized test on the original heavy set | Accept with probability 3/5 there. Uniform success is 3/10 and actual success is 3/8 > 1/3. Thus this example does **not** satisfy the stronger randomized premise. |

The counterexample establishes a false statement as written, not merely an incomplete proof. The explicit proofs above establish the replacement statements; the following finite checks guard against arithmetic and implementation mistakes.

## Why the forward calculator remains valid

If a bad set has actual mass at most η and every other atom has probability at most t/N, a test with uniform acceptance at most δ succeeds with probability at most `η + tδ`. For randomized tests, multiply each atom by its acceptance weight and apply the same bound. There is no reverse inference and no rounding of the test's acceptance budget in this argument.

The calculator applies the sufficient balance bounds from Lemmas 4.2 and 4.4, conservatively within this supported range:

| Route | Conditions in addition to the displayed model assumptions | Sufficient application-failure bound |
| --- | --- | --- |
| No entropy loss | Integer b = 6…256; k = m; at least (b+1)-wise-independent hash family. | `(b+1)·2^-b` |
| Small entropy loss | Integer b = 6…256; k ≥ m + ceil(log2 b) + 4; at least (b+6)-wise-independent hash family. | `3·2^-b` |

At m = 128 and b = 64, k = 128 gives `65·2^-64` and k = 138 gives `3·2^-64`. The assumptions still include the specified unpredictability game and its uniform-key baseline, the source min-entropy bound under the stated adversary-information model, and an independent uniform public seed. These are application-failure bounds, not output min-entropy, guarantees for HKDF, or physical entropy-source validation. Unsupported inputs must continue to remove the numerical result.

## Reproducible checks and limits

Run `python3 tools/kdf-investigation-check.py` from the hub repository root. It checks all 256 acceptance sets in the counterexample, the repaired threshold, the randomized distinguishing probability, an aligned budget and a zero-budget control. It also exhausts probability histograms with denominator eight on two, four and eight atoms against several exact budgets and ε values, checking both corrected implications whenever their respective premises hold. Finally it checks the sufficient forward tail inequalities for every integer b = 6…256 and the two displayed examples.

These finite checks are regression evidence. They do not substitute for the general proofs, establish every theorem in the paper, or validate a real source. The existing calculator's numerical and assumption-gate tests remain necessary. The dated implementation receipt records their actual execution separately.
