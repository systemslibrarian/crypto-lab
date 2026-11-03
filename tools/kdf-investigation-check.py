"""Exact finite checks for the dated KDF investigation; not a deployed KDF."""
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
print('PASS: 256 deterministic tests; forward tail bounds for b=6..256; paper examples.')
