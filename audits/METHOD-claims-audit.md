# Teaching-correctness audit — the brief

## Why this is not a grep

I built and validated three mechanical detectors against known answers first.
Two worked precisely and both returned **zero remaining instances fleet-wide**:

| detector | validated | fleet result |
|---|---|---|
| shipped default contradicts the code's own fallback | 3 hits pre-fix, 0 post-fix | **0** — harvest-timeline was the only one |
| batch runner disabled by its own re-entrancy guard | names both dead callees, clean post-fix | **0** — zk-proof-lab was the only one |
| printed difference that can go negative | fires on the pre-fix source | 11 candidates, **0 real** on review |

The third is the lesson. Its 11 candidates were `Math.abs`-guarded, already
fixed, or matched no subtraction at all. **The defects that matter here are
semantic — a sentence asserting something the code does not do — and a regex
cannot see the relationship between a claim and the computation behind it.**

So this audit is done by driving the lab and reading what it says.

## What you are looking for

For every claim the page renders, ask: **is this sentence true in the state it
is being shown in?** The known defects all failed that one question:

- "The attacker deleted 0 bytes … plus its **-6-byte** key_share" — sentence
  unconditional, state was not.
- "Mara Kowalski earns $480,000 — **above your declared bound**" — printed
  unconditionally, directly contradicting `Records clipped: 0 of 13` above it.
- Two exhibits disagreeing at first paint because a menu opened on a scenario
  the rest of the code did not intend, and **Reset moved the verdict**.
- A "Run 10" button that produced no commitment, no challenge, no log line, and
  left confidence at 0.00%.
- "QR Code" that threw for RSA-4096 and did nothing — the test asserted only
  that the container existed.

## Method, per repo

1. **Drive every state** (the honest gate already does this — reuse
   `driveAllStates`). At each state, read the rendered prose, not the DOM shape.
2. **For each claim, find the computation behind it.** If the sentence states a
   quantity, a comparison, a verdict or a cause, locate the value it came from
   and check the sentence is conditional on it.
3. **Press every control and verify something changed.** A control that
   produces no visible change is either dead or its outcome is unasserted.
   Check the disabled/guard paths too.
4. **Check exhibits against each other** at the same moment. Two panels
   describing the same quantity must agree.
5. **Verify the crypto against its own cited spec** where the lab names one —
   an RFC number in the prose is a claim like any other. Two defects so far
   were spec violations the lab's own panel contradicted.
6. **Assert the shipped defaults**, and check Reset returns to them.

## Rules

- A claim you cannot trace to a computation is a finding: say so.
- Fix what is wrong; where the fix is a judgement call, report rather than guess.
- Add a regression test that asserts the CLAIM, not the element. "Asserting only
  `#qr-container svg`" is how a thrown exception stayed hidden.
- Report anything cleared, with the reason — a negative result is a result.

## What worked in the first repo (shor — 5 defects, all real)

Four techniques did the work. Reuse them.

1. **Quantify how often the bad branch is taken, headless.** Don't argue about
   whether a failure path is reachable — run the lab's own engine module in node
   a few hundred times and count. shor: "53 of 720 runs across 12 values of N"
   turned a hypothetical into a shipped defect. The same harness *cleared* four
   other claims (0/720 counterexamples) — that is what makes a negative result
   credible rather than merely unrefuted.
2. **Pin `crypto.getRandomValues` to make a rare state reproducible.** Returning
   zeros made N = 15 draw a = 2 and measure the same peak every time, so the
   failure branch became a deterministic test instead of a flake.
3. **Assert an invariant between two claims, not a string.** shor's regression
   test requires *the count of "recovered the period r" banners to equal the
   count of convergents tables that actually crown a row.* That survives copy
   edits and catches the whole class, where a string assertion catches one case.
4. **Look for state that is written but never cleared.** The `#live-callout`
   defect — Reset returned three other panels to placeholders and left this one
   asserting the previous run's factorisation — was invisible until Reset and a
   second run were driven in sequence. Drive *transitions*, not just states.

Also: a claim can be true of the run but stated as a property of the input
("N was resolved classically … for this input", when a third of runs on that N
do not). Scope errors like that read as fact and are worth fixing.

---

## What ~13 labs have taught (updated 2026-08-11)

### The dominant pattern: the suite encoded the defect

**Seven confirmed instances.** Not "the test missed it" — the test was *shaped around* it and
scoped to avoid the counterexample:

| repo | what the test avoided |
|---|---|
| hash-zoo | ran only **bit 0** — the single index where a fixed prefix is correct |
| paillier-gate (×2 suites) | targeted the ballot at index 2 **because dropping it costs the tally nothing** |
| grover | asserted the buggy invariant over the input range where it happens to hold |
| bb84 | asserted `qber > threshold`, the strict form the fix corrects |
| patron-shield | **recomputed the same wrong `Math.round` formula** it was checking |
| noise-pipe | forward-secrecy test ran only **NN**, the one pattern masking the wrong key count |
| timing-oracle (×3) | every `operations` assertion used **equal-length pairs**; the ladder test picked the two values that **both** keep the top bit set |

**So: when you audit a claim, read the test that covers it and ask what it avoids.** That
question has found more defects than any other single move.

### Rank by what the failing state MEANS, not by how exotic the mechanism is

The external review's own ranking was wrong in both directions. Its self-declared "most
under-ranked item in the whole review set" (a cyclic-repetition hash collision) is real and
**unreachable with random inputs**. Meanwhile an off-by-an-equals-sign comparison it filed as
a wording nit turned out to fire on **0.31% of runs — 83% of them the case where the lab
denied the very thing it exists to teach**.

A mechanism that sounds alarming and cannot happen is worth less than a trivial-sounding
comparison that lands on the teaching point.

### The shapes that keep recurring

- **A verdict printed rather than computed.** noise-pipe claimed the AEAD rejected a
  static-only key for all 13 patterns while 4 ran no decryption at all. simon-period asserted
  three properties of a *periodic* function on the *injective control*, 480/480 rounds.
- **A ceiling presented as a measurement.** phantom-vault printed `min(format ceiling,
  composition ceiling)` as a strength verdict and called `password123` "Fair, 57 bits" —
  then cracked it in 249 ms on the same screen.
- **Counting work the code never did.** timing-oracle counted characters a comparator never
  examined, because it returns on a length mismatch *before* the loop: 98 of a 124-guess
  corpus overstated, under a caption reading "exact every run".
- **A claim true of one exhibit and false beside it.** jevil said "even unlimited computing
  power can't tell which is f" while publishing a fingerprint from which the key was
  brute-forceable with zero signatures issued.
- **A property asserted about the empty set** ("0 of 32 outcomes cancelled to zero — they are
  impossible").

### Measurement discipline

- Prefer a **complete census** over sampling when the space is small enough: simon-period's
  "stalled forever" failure was cleared by enumerating **all 109** k₁ values at n=4,5,6.
- Report frequencies with their denominator. "200 of 200 concurrent pairs reused nonce 0" and
  "0/200 at a realistic 16 ms click gap" are both findings, and they mean opposite things.
- **Reachability changes the verdict, in both directions.** Measure before ranking.

### Rules that have earned their place

- A test that hunts for a rare state must **FAIL when that state never occurs**, or it passes
  by never reaching the case it exists to check.
- Assert a non-zero count of whatever you check, so the test cannot pass vacuously. One test
  toggled a panel without running the engine and asserted against an **empty container**.
- Mutations: revert the **whole** fix. Where two halves are each independently sufficient,
  reverting one token certifies nothing.
- Where a fix changes a module's contract or a derivation spec, **report it** — do not
  silently alter every derived value. One agent recorded a measured 2^-59 modulo bias in
  `KNOWN-GAPS.md` rather than changing every position the lab derives.
