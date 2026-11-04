# KDF calculator investigation — 3 November 2026

**Current resolution, 4 November:** the unrestricted deterministic converse is rejected as stated and replaced with a proved floor-adjusted statement; the original ratio requires an integer-grid condition or a stronger randomized-test premise. See the [complete resolution and proofs](kdf-converse-resolution-2026-11-04.md). The dated investigation and implementation receipts below are preserved as history.

**Decision: a narrowly scoped forward-bound calculator is supportable; do not teach an unrestricted converse equivalence.** At this investigation checkpoint, R20261031-14 was unimplemented; the subsequent implementation receipt is appended below. The original blanket implementation hold can be narrowed to an explicit specification and review gate. This investigation does not change HKDF, generate keys or certify a source’s entropy.

## Source identity and scope

The source is Dodis, Pietrzak and Wichs, *Key Derivation Without Entropy Waste*, dated 6 February 2014: [ePrint 2013/708](https://eprint.iacr.org/2013/708), [author-hosted PDF](https://cs.nyu.edu/~dodis/ps/nolossKDF.pdf). Selected passages checked: Definition 3.1, Lemmas 3.3–3.6, Lemmas 4.2/4.4 and Corollaries 4.3/4.5, PDF pp. 8–12. The saved CL965 PDF’s page 10 was visually inspected.

- Saved CL965 PDF SHA-256: `2483b9fefe77c7ffc29fce4e6798db730f84d620fe927ab1f9e4cd5743194b2d` (505,389 bytes).
- Author-hosted PDF SHA-256: `ac8bc085c9ba7a4266dc70213a211ba19002d6e4bc7a504b8c294fda8b66698a` (364,702 bytes).

These are distinct byte versions. Both contain the disputed inequality. No author-issued correction was found in the archive record or targeted search; that is not proof none exists. The analysis and repair below are our derivations, not a published erratum. This is a selected reread, not new full-paper reading credit.

## What is wrong with the converse argument?

Lemma 3.6 assumes heavy-output mass `epsilon_hat > epsilon`, then concludes `epsilon_hat/t <= epsilon/t`. That inequality reverses the assumption. Its proposed heavy-set distinguisher therefore has not been shown to fit the required uniform-input acceptance budget `delta = epsilon/t`.

There is also a finite-grid issue if Definition 3.1’s Boolean function is read literally as deterministic. A non-vacuous counterexample:

- Set `n = k = 4`, `m = 2`, `d = 1`, `delta = 3/10`, `epsilon = 1/3`.
- For each of the two seed values, map the 16 inputs into four output buckets of sizes `5, 5, 3, 3`. The seed is uniform, independent, and unused by this particular family.
- The only source with min-entropy at least 4 on this domain is uniform. There are eight `(output, seed)` atoms. A deterministic test with uniform acceptance at most `3/10` can accept at most two atoms. Its maximum actual success is `5/16 <= 1/3`, so the literal UExtract condition holds.
- But `t = epsilon/delta = 10/9`; the load threshold is `t * 2^(k-m) = 40/9`. The two size-5 buckets are heavy. Their combined mass is `5/8 > 1/3`, violating the claimed balance conclusion.

All 256 deterministic acceptance sets were enumerated with exact rational arithmetic to check this example. Reproduce this and the tail checks with `python3 tools/kdf-investigation-check.py` from the repository root. This identifies a definition/parameter caveat; it does not invalidate the forward constructions or establish an attack on a deployed KDF.

## How a converse can be repaired

Let `N = 2^(m+d)`. Every heavy joint atom has actual mass strictly greater than `t/N`.

If randomized tests are permitted, let `a` be the uniform mass of the heavy set and `p > epsilon` its actual mass. When `a <= delta`, use the heavy-set test directly. Otherwise accept on that set with probability `delta/a`. Its uniform acceptance becomes exactly `delta`, while actual acceptance is `delta*p/a > delta*t = epsilon`, because `p > t*a`. This supplies the missing budget argument under the randomized definition.

For deterministic tests, the same conclusion follows when `delta*N` is an integer: accept all heavy atoms if there are fewer than that many; otherwise select exactly `delta*N` heavy atoms. Without that grid condition, rounding cannot silently be discarded. Thus the unrestricted equivalence should remain excluded from teaching until its definition and parameters are stated correctly.

## The forward calculator does not need Lemma 3.6

A direct sufficient argument is enough. If bad/heavy outcomes have mass at most `eta`, and every remaining atom has density at most `t` times uniform, any test whose uniform acceptance is at most `delta` has actual acceptance at most `eta + t*delta`. This argument works for deterministic or randomized acceptance and has no converse step. Lemmas 4.2 and 4.4 supply the sufficient balance bounds used in the two concrete examples.

A conservative initial specification can use integer `b` from 6 to 256, with `delta = 2^-b`, integer `n >= k >= m >= 1`, and these two routes:

| Route | Entropy condition | Sufficient hash independence | Application failure bound |
| --- | --- | --- | --- |
| No entropy loss | `k = m` | at least `b+1` wise | `(b+1) * 2^-b` |
| Small entropy loss | `k >= m + ceil(log2(b)) + 4` | at least `b+6` wise (conservative Corollary 4.5 requirement) | `3 * 2^-b` |

For `m=128`, `b=64`, these reproduce `65 * 2^-64` at `k=128` and `3 * 2^-64` at `k=138`. These are upper bounds on a specified attack’s success probability, not key entropy, an HKDF estimate, or a general indistinguishability guarantee. A separate application analysis must supply `delta`, including its adversary/query budget.

The independent checks verified the sufficient tail inequalities for every integer `b` in 6–256. For the second route, choose the least even `q >= b+3`; then `q+1 <= b+6`, and the Lemma 4.4 expression with `alpha=1` is at most `2^-b` at the stated minimum entropy gap. For the first route, `(e/b)^b <= 2^-b` throughout that range. This finite check supports the proposed UI range; it is not a certification of every theorem in the paper.

## Acceptance conditions established by the investigation

Require a stated unpredictability game, independent uniform public seed, and a hash family with the required independence. Treat source min-entropy as a supplied assumption, not an estimate from sample bytes. Reject unsupported inputs and application classes instead of interpolating the paper’s big-O statement. Display the route, all assumptions, the failure bound, and a warning when assumptions are unverified. Do not label `-log2(bound)` as output entropy. Keep the existing generic entropy lesson and production KDFs separate.

The investigation proposed a bounded educational comparison in Quantum Entropy, with edge-case and assumption-gate tests. No calculator was built during the investigation itself. The subsequent implementation is recorded below; the converse claim remains held.


## Restricted KDF implementation, 3 November 2026

[Live calculator](https://systemslibrarian.github.io/crypto-lab-quantum-entropy/#kdf-calculator); [PR26](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/pull/26), tested head `089badaae179feb013e7d6f9966fcb50eed66052`, merge `3c401a6a19c06e582acdca6f16abff66d7f92652`. 79 unit tests pass, including exact integer checks of both sufficient tail inequalities for every supported exponent. The full hosted gate passed 27 browser tests, builds on Node 22/24, dependency audit and code scanning. [Post-merge deployment](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/actions/runs/41723332677) succeeded; live asset hashes matched the validated production build.

Two presets reproduce 65 × 2^-64 and 3 × 2^-64. Controls expose source length, assumed min-entropy, output length, application baseline and game, public-seed model and hash-family independence. Unsupported settings remove the number. These are illustrative application-failure bounds, not generated keys, output entropy, an HKDF guarantee or a device certificate. No new full-paper reading credit.
