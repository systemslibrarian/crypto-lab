# Decision: split the Cryptanalyst Path 12 + 9

The two-way split is implemented in this pull request. The original `cryptanalyst` id is
retained for the 12-step Structure and Statistics path, preserving existing stored and
linked selections; the 9-step Implementation and Composition path receives the new
`cryptanalyst-implementation` id. This record keeps the alternatives and trade-offs that
informed the choice rather than making the resulting path structure look inevitable.

## Re-derived state — 2026-10-21

At catalog commit `1e6f181`, the Cryptanalyst Path has **21 steps**. AES Anatomy was
added after the original 20-step proposal, so that proposal's 11+9 partition no longer
covered the whole path. There are **nine** learning paths, with current lengths:

| path | steps |
|---|---:|
| Start Here | 13 |
| Understanding Cryptography | 12 |
| Introduction to Modern Cryptography | 12 |
| Boneh & Shoup | 11 |
| Developer | 18 |
| Cryptanalyst | **21** |
| Post-Quantum | 12 |
| Key Exchange | 12 |
| Applied Cryptography | 9 |

`CLAUDE.md` says to keep a path at roughly 12 steps for readability. Cryptanalyst is
still the longest path, but it is no longer accurate to say it is the only path past 17:
Developer now has 18. Length is a reason to decide, not a reason to assume a split.

## The two-way split line comes from the path's own blurb

The current blurb names four classes:

> "Mathematical attacks exploit structure and statistics; oracles exploit response
> differences; side channels measure timing or power; faults alter computation."

That sentence supplies a defensible two-way cut: **clause one** on one side and
**clauses two to four** on the other. The distinction is what the attacker needs. The
first group needs the mathematics — the algorithm's structure or the statistics of its
output, and the attack works on paper. The second needs a running machine — an oracle's
answers, a timing or power trace, a validation check that is missing, or a fault.

## Two-way option A — Structure and Statistics (12 steps)

Attacks on what the algorithm is. This is the only proposed path that starts at
`beginner`; six of its twelve steps are `intermediate`. AES Anatomy belongs here because
it exposes the primitive's round structure and the weakened structures attacked by the
later differential and linear labs.

| # | step | level | why here |
|---|---|---|---|
| 1 | Dead Sea Cipher | beginner | historical cipher; the entry point and the only `historical` card in the current path |
| 2 | LFSR Forge | intermediate | Berlekamp–Massey fits a recurrence from output alone |
| 3 | DVD Scramble | intermediate | the two-register structure algebraically determines the key |
| 4 | WEP Crack | intermediate | RC4 keystream biases plus a CRC-32 that authenticates nothing |
| 5 | AES Anatomy | intermediate | the full primitive, key schedule and deliberately weakened round structures |
| 6 | Biham Lens | advanced | differential cryptanalysis — statistics of output differences |
| 7 | Matsui Line | advanced | linear cryptanalysis — the same move with linear approximations |
| 8 | RSA Small Roots | advanced | Coppersmith; a lattice over the algorithm's own structure |
| 9 | Next Number | advanced | a generator's recurrence read off its output |
| 10 | Nonce Lattice | advanced | the same lattice technique against signature nonces |
| 11 | Entropy Collapse | intermediate | what fails when the input distribution is wrong |
| 12 | Nonce Collision | intermediate | what fails when a value that must be unique repeats |

Levels: 1 beginner, 6 intermediate, 5 advanced.

## Two-way option B — Implementation and Composition (9 steps)

Attacks on what a running implementation reveals or fails to bind. This path assumes A.

| # | step | level | why here |
|---|---|---|---|
| 1 | Padding Oracle | intermediate | the cleanest oracle: a response difference, nothing else |
| 2 | Timing Oracle | advanced | the same idea when the difference is a duration |
| 3 | Twist Trap | advanced | the oracle is a peer doing scalar multiplication; the flaw is a missing validation check |
| 4 | Power Trace | advanced | the leak moves from time to power |
| 5 | Masked Core | advanced | second-order CPA — what a countermeasure still leaks |
| 6 | Salamander | advanced | key commitment: the construction binds less than it appears to |
| 7 | Frozen Heart | advanced | proof forgery from a transcript that binds too little |
| 8 | KyberSlash | advanced | the whole arc again on a post-quantum KEM |
| 9 | Lattice Fault | advanced | and with faults rather than observation |

Levels: 1 intermediate, 8 advanced.

## Three-way option

If implementation leakage and composition are too different to share a path, the same
21 steps partition exactly into **12 + 6 + 3**:

- **Structure and Statistics (12):** the option A list above.
- **Oracles, Leakage and Faults (6):** Timing Oracle, Twist Trap, Power Trace, Masked
  Core, KyberSlash, Lattice Fault.
- **Composition and Binding (3):** Padding Oracle, Salamander, Frozen Heart.

The third group's theme is not invented for this proposal. `concept-coverage.md` §29 is
already **Composition and parsing failures** and files Padding Oracle and Salamander
there. Frozen Heart is primarily filed under zero knowledge in §21, but its attack has
the same operative failure: a transcript binds too little. The drawback is equally
visible — a three-step path is small, so the conceptual purity may not justify another
top-level path.

## Placements on which a maintainer could reasonably disagree

- **Salamander** and **Frozen Heart** are neither observation nor classical
  cryptanalysis. They remain in two-way B because the failure is in what a construction
  binds, and form the three-way composition seed with Padding Oracle.
- **Entropy Collapse** and **Nonce Collision** are input misuse rather than structural
  analysis. They remain in A because the attack becomes statistical once the misuse
  exists, and because they preserve an intermediate middle rather than leaving a jump
  from WEP Crack to advanced-only material.
- **Twist Trap** could sit in A because recovery uses small-subgroup logs and CRT. It
  remains in B because the exploitable condition is a validation check the
  implementation skipped.
- **AES Anatomy** is not itself one attack. It sits in A as the bridge from the primitive
  and key schedule to Biham Lens and Matsui Line; putting it in B would sever that arc.

## Decision table

| choice | resulting lengths | trade-off |
|---|---|---|
| retain the current path | 21 | preserves one complete attack journey, but remains well above the approximate 12-step guideline |
| **split in two — selected** | **12 + 9** | both paths fit the guideline and retain substantial arcs; composition and implementation leakage share one path |
| split in three | 12 + 6 + 3 | cleanest conceptual boundary, but the composition path may be too short for top-level navigation |

The two-way split is the smallest change that brings both resulting paths within the
roughly-12-step guideline. It avoids promoting a three-step seed to top-level navigation,
keeps the full 21-step journey, and preserves substantial progressions on both sides.

## Implementation completed

1. `LEARNING_PATHS` now carries the two entries and their distinct focus/blurb text.
2. The persistent knowledge-map test asserts the exact 12-step and 9-step sequences,
   21 total titles and 21 unique titles, so an omission or duplicate fails visibly.
3. `readme-sync` regenerates the public Learning Paths table from those entries.
4. `knowledge-map-sync` runs after the index change, producing ten paths and the new
   `index.html` source hash.
5. `teach-build` and the normal checker sweep verify the derived surfaces.

No card change and no new lab is part of this implementation.
