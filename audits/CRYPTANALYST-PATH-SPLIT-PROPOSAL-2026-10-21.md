# Proposal: split the Cryptanalyst Path in two

**Proposal only. Nothing in `index.html` is changed by this PR.** The decision is the
maintainer's; this file exists so the decision can be made from the step list rather
than from a count.

## Why

The Cryptanalyst Path reached **20 steps** when Next Number, DVD Scramble and Twist Trap
were added in #239. `CLAUDE.md` says "Keep `steps` ≤ ~12 for readability". It was already
17 before those three, so this is not a new problem and the three additions are not its
cause — they are what made it worth raising.

For scale, the other seven paths: `developer` 16, `start-here` 13, `post-quantum` 12,
`key-exchange` 11, `modern-cryptography` 10, `boneh-shoup` 9, `applied-cryptography` 8.
Cryptanalyst is the longest and the only one past 17.

## The split line comes from the path's own blurb

The existing blurb already names four classes:

> "Mathematical attacks exploit structure and statistics; oracles exploit response
> differences; side channels measure timing or power; faults alter computation."

That sentence is the proposed cut: **clause one** on one side, **clauses two to four** on
the other. The distinction is what the attacker needs. The first group needs the maths —
the algorithm's structure or the statistics of its output, and the attack works on paper.
The second needs the running machine — an oracle's answers, a timing or power trace, a
validation check that is missing, a fault. Nothing in the second group can be carried out
against a specification.

## Proposed path A — Structure and Statistics (11 steps)

Attacks on what the algorithm IS. Keeps the on-ramp: it is the only one of the two that
starts at `beginner`, and five of its eleven are `intermediate`.

| # | step | level | why here |
|---|---|---|---|
| 1 | Dead Sea Cipher | beginner | historical cipher; the entry point and the only `historical` card in the path |
| 2 | LFSR Forge | intermediate | Berlekamp–Massey fits a recurrence from output alone |
| 3 | DVD Scramble | intermediate | the two-register structure algebraically determines the key |
| 4 | WEP Crack | intermediate | RC4 keystream biases plus a CRC-32 that authenticates nothing |
| 5 | Biham Lens | advanced | differential cryptanalysis — statistics of output differences |
| 6 | Matsui Line | advanced | linear cryptanalysis — the same move with linear approximations |
| 7 | RSA Small Roots | advanced | Coppersmith; a lattice over the algorithm's own structure |
| 8 | Next Number | advanced | a generator's recurrence read off its output |
| 9 | Nonce Lattice | advanced | the same lattice technique against signature nonces |
| 10 | Entropy Collapse | intermediate | what fails when the input distribution is wrong |
| 11 | Nonce Collision | intermediate | what fails when a value that must be unique repeats |

Levels: 1 beginner, 5 intermediate, 5 advanced.

## Proposed path B — Implementation and Composition (9 steps)

Attacks on what a RUNNING implementation reveals, or fails to bind. Assumes A.

| # | step | level | why here |
|---|---|---|---|
| 1 | Padding Oracle | intermediate | the cleanest oracle: a response difference, nothing else |
| 2 | Timing Oracle | advanced | the same idea when the difference is a duration |
| 3 | Twist Trap | advanced | the oracle is a peer doing a scalar multiplication; the flaw is a missing validation check |
| 4 | Power Trace | advanced | the leak moves from time to power |
| 5 | Masked Core | advanced | second-order CPA — what a countermeasure still leaks |
| 6 | Salamander | advanced | key commitment: the construction binds less than it appears to |
| 7 | Frozen Heart | advanced | proof forgery from a transcript that binds too little |
| 8 | KyberSlash | advanced | the whole arc again on a post-quantum KEM |
| 9 | Lattice Fault | advanced | and with faults rather than observation |

Levels: 1 intermediate, 8 advanced.

## The three placements I am least sure of

Named rather than buried, because they are where a reader would reasonably disagree.

- **Salamander** and **Frozen Heart** are neither observation nor mathematics. They are
  composition failures — something that should have been bound was not. They sit in B
  because the failure is in what the construction does rather than in its algebra, but a
  third path for composition and protocol failures would hold them better, and
  `concept-coverage.md` already has a §29 "Composition and parsing failures" for exactly
  this class. If you want three paths rather than two, these two plus Padding Oracle are
  the seed.
- **Entropy Collapse** and **Nonce Collision** are input-misuse rather than structural
  analysis. They are in A because the attack is statistical once the misuse exists, and
  because they are two of A's five intermediate steps — moving them leaves A with a
  harder middle.
- **Twist Trap** could sit in A, since the recovery itself is small-subgroup logs plus
  CRT. It is in B because the exploitable condition is a validation check the
  implementation skipped, which is B's subject.

## What implementing it would need

Mechanical, once the split is agreed:

1. Replace the `cryptanalyst` entry in `LEARNING_PATHS` with two entries, each with its
   own `id`, `label`, `focus`, `blurb` and `steps`.
2. Split the existing blurb along the same clause boundary rather than writing two new
   ones, so the reasoning that produced the split stays visible on the page.
3. `node tools/readme-sync.js` — the Learning Paths table is generated.
4. `node tools/knowledge-map-sync.js write` — the map records a path count, currently 8,
   and hashes `index.html`. It must run AFTER any card stamper.
5. `node tools/teach-build.js` and the usual checker sweep.

No card changes, no new labs, and no step leaves the catalog: all 20 appear exactly once
across the two paths.
