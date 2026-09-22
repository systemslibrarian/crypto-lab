---
exhibit: shor
module: post-quantum
minutes: 18
outcomes: [1, 2]
source_commit: 66c0e3109427
checked: 2026-09-22
anchors:
  - "#n-input"
  - "#preset-15"
  - "#preset-91"
  - "#run-btn"
  - "#reset-btn"
  - "#step-log"
  - "#viz-panel"
  - "#aha-period"
  - "#aha-period-live"
  - "#aha-qft"
  - "#live-callout"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. You are going to run the same N three times. For each of these, predict whether it stays the same across your three runs or changes: the base *a*, the period *r*, the register size *Q*, and the two factors printed on the result line. Write your predictions in the first column of the first table under Record.
2. The page's first explainer turns `a^r ≡ 1 (mod N)` into `(a^(r/2) − 1)(a^(r/2) + 1) ≡ 0 (mod N)` and then takes a gcd of each half with N. That chain needs the period *r* to be **even**. Predict what a run should do when the period it recovers is odd: stop and report failure, print a factor anyway, or something else.
3. Each attempt picks a base *a* at random from 2 to N−1. Predict what should happen when that base happens to share a factor with N, before any quantum step runs. Would you call that outcome a success or a failure of the run?
4. The quantum measurement is a sample from a probability distribution, not a lookup. Predict whether two attempts using the same base *a*, and therefore the same period *r*, could still measure different frequencies *m* — and whether both could still end with the same *r*.

## Do

> A run that retries, or that ends without ever showing a period, is one of this algorithm's own outcomes. Record it as a result. Do not clear it and hunt for a tidier run.

1. Open the exhibit. Before pressing anything, read the note under the controls: it says Shor is *randomized*, that each run picks a fresh base *a*, and that a run can fail and retry. Then read the first explainer, *Why does the period r let you factor N?*, which stays open at the top of the page.
2. In the **Presets** row, press **91**. A preset fills the **Factor N** field and starts the run by itself — you do not also press **Run Shor's Algorithm**. Watch the **ALGORITHM STEPS** log fill from the top.
3. When the run stops, find the *Resource estimate* line near the top of the log and copy the register size *Q* and the logical qubit count it states into the second table. You read this line once; later runs of N = 91 restate it.
4. Fill the first row of the third table from this run: the base *a* and the period *r* from the *This run:* line inside the first explainer; *Attempts* and the two factors from the RESULT line at the foot of the log; and, in the last column, every line that begins *↺ Retrying:* together with the reason it names.
5. Press **Run Shor's Algorithm** and record a second run the same way, then a third. Record each run before you start the next one — a new run clears the log and the **PERIOD TABLE / QFT VISUALIZATION** panel.
6. Some runs end differently, and each of those is a row to fill in rather than a mistake. If the *This run:* line keeps its italic placeholder and the **PERIOD TABLE / QFT VISUALIZATION** panel says the run drew a base that already shared a factor with N, write "lucky gcd, no period" in the last column and copy the factor the log's *Lucky GCD* line reports. If the log prints one or more *↺ Retrying:* lines and then carries on, record every reason it names. If a stage banner reads *Stage 3 — no convergent denominator satisfied a^r ≡ 1, so the period was NOT recovered*, record that alongside the retry reason.
7. Pick one of your runs that did reach a period, and copy its *This run:* chain into the fourth table, number by number: the base, the period, `a^(r/2) mod N`, both gcds, and the check it prints at the end.

## Record

Every value in the second, third and fourth tables comes from your own run.

| Value | Same across runs, or changes? (predicted) | What my three runs showed |
|---|---|---|
| Base a | | |
| Period r | | |
| Register size Q | | |
| The two factors on the RESULT line | | |

| From the *Resource estimate* line, for N = 91 | Value |
|---|---|
| Register size Q | |
| Logical qubits | |

| Run | Base a | Period r | Attempts | Factors on the RESULT line | Retry reasons, or how else the run ended |
|---|---|---|---|---|---|
| First run | | | | | |
| Second run | | | | | |
| Third run | | | | | |

| From the *This run:* line of one run that reached a period | Value |
|---|---|
| Base a | |
| Period r | |
| `a^(r/2) mod N` | |
| `gcd(a^(r/2) − 1, N)` | |
| `gcd(a^(r/2) + 1, N)` | |
| The check it prints | |

## Explain

1. Match your fourth table line by line to the four numbered steps of the first explainer, *Why does the period r let you factor N?* Why does that chain need *r* to be even, and what does the demo do with an attempt whose period is odd — answer from your own log if one of your runs showed it, otherwise from the third step of the explainer's chain. What do your two gcds multiply to, and what does the *Verification* clause of the log's *Factors found* line check?
2. Compare your three rows. Which values changed from run to run and which did not? The *Resource estimate* line states how *Q* is built — use its wording to say what *Q* depends on, and why the base *a* and the period *r* do not behave the same way across runs.
3. Take one run that retried, that needed more than one attempt, or that ended with no period at all. Using the reason the log names, say what that attempt had drawn or measured, and why drawing a fresh base is part of the method rather than an error. If the retry pushed the *Attempts* count up, say what else appeared in the log at that moment; if the count did not move, say what that tells you about where in the attempt the retry happened. If none of your runs did any of this, use a classmate's.
4. The explainer closes by saying the quantum computer's only job is finding *r*, and that everything else in the chain is ordinary arithmetic. Using your own log, name one step of your run that a quantum computer would perform and one that it would not, and say which words on the page told you which was which.

## Fix / Extend

1. **Fix.** A service establishes its keys with RSA-2048 and encrypts the data itself with AES-256. Using the *QUANTUM-RESISTANT AFTER SHOR* list and the *RESOURCE REQUIREMENTS* table in the **RSA IMPACT** panel, say which of those two the page puts on its broken list and which it leaves usable, what that table gives as the logical-qubit estimate for the broken one, and which of the replacements named on the page you would put in its place. The call-out at the foot of that panel links one of them.
2. **Extend.** After a run that reached a QFT visualization, scroll the **PERIOD TABLE / QFT VISUALIZATION** panel to the block headed *Phasor wheels — why the peaks form (classically simulated)*. Its frequency buttons are built by the run, so their labels carry your own run's numbers: press the one whose label begins *off-peak* and record the Σ value under the summed wheel and whether the page calls it add or cancel; then press the one whose label begins *on-peak* and record the same two. Using the second explainer, *Why does the QFT concentrate at multiples of Q/r?*, explain why one frequency gives a long resultant and the other a short one, and what that has to do with the tall bars in the distribution chart above it.
3. **Extend.** Press **Reset**, then the preset **15**, and let three runs go by. Record the register size *Q* and the logical qubit count from the *Resource estimate* line for N = 15 and compare them with the pair you wrote down for N = 91. How many of your three runs reached a QFT visualization at all, and what did the **PERIOD TABLE / QFT VISUALIZATION** panel say for the ones that did not?
4. **Extend.** Type 97 into the **Factor N** field and press **Run Shor's Algorithm**, then do the same with an even number such as 100. Record the banner each one produces and what the **PERIOD TABLE / QFT VISUALIZATION** panel says. Using the *Pre-check* line that N = 91 printed, list what the demo tests about N before it would draw a base at all, and say which test each of your two inputs failed.
5. **Extend.** In the **PERIOD TABLE / QFT VISUALIZATION** panel, find the *Continued Fraction Extraction* section for one attempt and read its caption and its table. Which row is marked *← the period r*, and what test does the third column apply to each denominator? Using the caption, explain why the demo tests the denominators rather than trusting the first one it computes.
