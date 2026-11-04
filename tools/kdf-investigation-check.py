"""Exact KDF converse regression checks and forward bounds; not a deployed KDF.

The general proofs are in docs/kdf-converse-resolution-2026-11-04.md.
Finite enumeration checks arithmetic and edge cases, not all distributions.
"""
from fractions import Fraction as F

# Every deterministic test on the 2^(m+d)=8 atoms, including nonempty tests.
probabilities = [F(size, 32) for size in (5, 5, 3, 3) * 2]
delta, epsilon = F(3, 10), F(1, 3)
t = epsilon / delta
accepted = [
    sum((p for i, p in enumerate(probabilities) if mask >> i & 1), F(0))
    for mask in range(256)
    if F(mask.bit_count(), 8) <= delta
]
assert len(accepted) == 37  # empty set, 8 singletons, 28 pairs
assert max(accepted) == F(5, 16) <= epsilon
heavy_mass = sum((p for p in probabilities if p > t / 8), F(0))
assert heavy_mass == F(5, 8) > epsilon

# The floor-adjusted theorem retains the literal deterministic premise.
q = (delta * len(probabilities)).__floor__()
delta_eff = F(q, len(probabilities))
assert delta_eff == F(1, 4)
assert epsilon / delta_eff == F(4, 3)
assert sum((p for p in probabilities if p > epsilon / q), F(0)) == 0

# Randomization is a stronger premise, and this counterexample fails it.
heavy = [p for p in probabilities if p > t / len(probabilities)]
uniform_heavy_mass = F(len(heavy), len(probabilities))
acceptance_weight = delta / uniform_heavy_mass
assert acceptance_weight == F(3, 5)
assert uniform_heavy_mass * acceptance_weight == delta
assert sum(heavy, F(0)) * acceptance_weight == F(3, 8) > epsilon

# Aligned budgets recover the original ratio. With q=0 the premise is vacuous:
# a point mass meets every permitted deterministic test yet violates that ratio.
aligned_delta = F(1, 4)
assert F((aligned_delta * 8).__floor__(), 8) == aligned_delta
zero_delta, zero_epsilon = F(1, 16), F(1, 3)
assert (zero_delta * 8).__floor__() == 0
assert F(1) > (zero_epsilon / zero_delta) / 8
assert F(1) > zero_epsilon


def histograms(total, bins):
    """Every probability vector on the chosen denominator, including zeros."""
    if bins == 1:
        yield (total,)
        return
    for first in range(total + 1):
        for rest in histograms(total - first, bins - 1):
            yield (first,) + rest


budgets = [F(1, 10), F(3, 10), F(1, 2), F(7, 10), F(9, 10)]
epsilons = sorted({F(i, 8) for i in range(1, 8)} | {F(1, 3), F(2, 3)})
vectors = deterministic_cases = randomized_cases = zero_budget_cases = 0
for atom_count in (2, 4, 8):
    for counts in histograms(8, atom_count):
        vectors += 1
        ps = [F(c, 8) for c in sorted(counts, reverse=True)]
        for budget in budgets:
            budget_atoms = budget * atom_count
            slots = budget_atoms.__floor__()
            # Sorting gives the optimum deterministic acceptance set, and the
            # fractional next atom gives the optimum randomized test.
            deterministic_max = sum(ps[:slots], F(0))
            randomized_max = deterministic_max + (budget_atoms - slots) * ps[slots]
            for failure in epsilons:
                if not budget < failure:
                    continue
                if deterministic_max <= failure:
                    if slots == 0:
                        zero_budget_cases += 1
                    else:
                        mass = sum((p for p in ps if p > failure / slots), F(0))
                        assert mass <= failure, (ps, budget, failure)
                        deterministic_cases += 1
                if randomized_max <= failure:
                    mass = sum((p for p in ps if p > failure / budget_atoms), F(0))
                    assert mass <= failure, (ps, budget, failure)
                    randomized_cases += 1

assert vectors == 6609
assert deterministic_cases > 0 and randomized_cases > 0 and zero_budget_cases > 0

for b in range(6, 257):
    # e < 11/4, so this rational check is conservative for Lemma 4.2.
    assert (F(11, 4) / b) ** b <= F(1, 2**b)
    gap = (b - 1).bit_length() + 4  # exact ceil(log2(b)) + 4
    u = 2**gap
    q = b + 3
    q += q % 2  # smallest even q >= b+3
    assert q + 1 <= b + 6
    # Lemma 4.4 with alpha=1 and u=2^(k-m).
    tail = 8 * F(q * u + q * q, (u - 1) ** 2) ** (q // 2)
    assert tail <= F(1, 2**b), b

assert (64 + 1) * F(1, 2**64) == F(65, 2**64)
assert (64 - 1).bit_length() + 4 == 10
print('PASS: all 256 deterministic subsets; repaired and randomized counterexample controls.')
print(f'PASS: {vectors} exact histograms; {deterministic_cases} deterministic, '
      f'{randomized_cases} randomized premise-satisfying cases; '
      f'{zero_budget_cases} vacuous cases kept separate.')
print('PASS: forward tail bounds for b=6..256; paper examples.')
