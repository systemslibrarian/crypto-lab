---
exhibit: lattice-gentle
module: post-quantum
minutes: 30
outcomes: [3, 4]
source_commit: 893db9f6f046
checked: 2026-09-22
anchors:
  - "#mode-guided"
  - "#mode-reference"
  - "#rail-step-1"
  - "#rail-step-2"
  - "#rail-step-3"
  - "#rail-step-4"
  - "#rail-step-5"
  - "#rail-step-6"
  - "label:B decodes closer"
  - "label:B′ decodes closer"
  - "label:Same dots — they must tie"
  - "label:Good basis B (Ex 2.24)"
  - "label:Bad basis B′ (Ex 2.24)"
  - "#ex1-tx"
  - "#ex1-ty"
  - "#ex1-b1x"
  - "label:Predict: yes, it changes"
  - "label:Predict: no, it stays"
  - "label:Good basis B₂ = (2,0), (0,1)"
  - "label:Bad basis B₃ = (−2,−2), (4,3)"
  - "label:Gauss — Ex 9.11"
  - "label:Gauss — Ex 9.12 (big numbers)"
  - "label:LLL — Ex 9.21 (4-dimensional)"
  - "label:Step"
  - "label:Run to end"
  - "label:Stuck? Reveal the known solutions"
  - "label:A wrong guess: s = (1, 2, 3)"
  - "label:Solution 1: s = (2, 15, 12)"
  - "#lwe-s2"
  - "label:Solution 1: z = (2, -2, 0, 3, 0)"
  - "label:The cheat: z = 0"
  - "#sis-z0"
  - "label:Worked example from the slides"
  - "label:Fresh seeded keys"
  - "label:Reroll seed"
  - "label:Copy experiment link"
  - "#kyber-seed"
  - "#kyber-noise"
  - "label:The KEM layer: Fujisaki–Okamoto with implicit rejection, live"
  - "label:Run KEM: encapsulate → decapsulate"
  - "label:Tamper with the ciphertext, then decapsulate"
  - "label:Replay the slides’ worked example"
  - "label:Sign (live, with rejection sampling)"
  - "#dil-msg"
  - "label:Verify"
  - "label:Verify against a tampered message"
  - "label:Tamper with z, then verify"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. One grid of dots can be described by more than one pair of arrows. Basis B has short arrows, basis B′ has long ones, and both describe the same dots. Decoding a target point means writing it in the current arrows' coordinates and rounding those coordinates to whole numbers. Predict which description decodes the target closer, or whether the two must tie because the dots are the same, and give your reason in one sentence.
2. Now think about the shortest arrow you could draw from one dot of that grid to another. If the short-arrow description is swapped for the long-arrow one, predict whether that shortest vector changes, and predict whether it becomes harder to find. Those are two separate questions — answer both.
3. One exhibit hands you a system b = A·s + e (mod 47) in which every entry of the error e lies between −2 and 2, and lets you compute A·s for any candidate s you type. Predict how you would recognise the right s, and predict what b − A·s looks like when s is wrong by only a little.
4. The toy-Kyber panel runs at q = 137 and decrypts correctly while its decryption error stays under q/4. Predict what you will see as that error grows past the ceiling: a warning first, some message bits flipping, or an error message in place of a plaintext.

## Do

Steps 1 and 2 are in the page header and the progress rail. Every step after that names the rail button that opens it, so you always know which guided step you are in.

1. Open the exhibit. The experiment in the header asks which of two descriptions of one grid decodes the target t = (9, 2) closer. Press the button that matches your answer to Predict 1: **B decodes closer**, **B′ decodes closer**, or **Same dots — they must tie**. Fill in the first Record table from the sentence the page then computes.
2. Check that **Guided** is the selected reading mode, then press **1 · Basis** on the progress rail.
3. In Exhibit 1, press **Good basis B (Ex 2.24)**. Record its row of the second table: the status line under the picture (same lattice, or different), the point the rounding lands on, the error, and the badge at the end of the decoding line.
4. Press **Bad basis B′ (Ex 2.24)** and record that row the same way. The two presets decode the same target, so what changed between your two rows is the description.
5. Press **Good basis B (Ex 2.24)** again. Now set **target x** to 9 and **target y** to 2, typing each value and pressing Tab to commit it. Record that row — this is the target the header experiment used.
6. Leave the target where it is and set **b₁ x** to 4. Record what the status line says now and what appears among the dots. Then press **Good basis B (Ex 2.24)** to put both the basis and the target back.
7. Press **2 · SVP/CVP**. The panel asks its own prediction first: press **Predict: yes, it changes** or **Predict: no, it stays** to match your answer to Predict 2, and read the reply. Then press **Good basis B₂ = (2,0), (0,1)** and **Bad basis B₃ = (−2,−2), (4,3)** in turn, recording a row of the third table for each.
8. Press **3 · Reduce**. Press **Gauss — Ex 9.11**, then press **Step** twice, recording ‖v‖² from each line as it appears. Press **Run to end** and record the last line and the count in the status line.
9. Press **4 · LWE & SIS** and stay in the first panel, LWE. Record the row the panel already shows for the candidate it opens with. Then open the LWE panel's **Stuck? Reveal the known solutions** disclosure, press **A wrong guess: s = (1, 2, 3)**, and record that row.
10. Still in the LWE panel, press **Solution 1: s = (2, 15, 12)** and record its row, including how many of the five table rows report a small error. Then change **s3** to one more than the value that button set, press Tab, and record the last row.
11. Press **5 · Schemes** and stay in the first panel, toy-Kyber, with **Worked example from the slides** selected. Fill in the worked-example column of the fifth table from the decryption panel: the message bits, the decoded bits, the measured error, the ceiling the page prints, and the badge on that line. Record the **Experiment seed** value as well.
12. Focus the error-bound slider in that same decryption panel — its label begins *Error bound η for the sampled e₁, e₂* — and press the Right arrow key one step at a time, watching the measured-error line after each press. Stop at the first setting where the badge reports the error is over the ceiling, and fill in the second column of the fifth table, including which of the toy-Kyber panel's two mode buttons — **Worked example from the slides** or **Fresh seeded keys** — is now shown as selected. If the badge has not changed by the time the slider stops moving, press **Reroll seed** in the toy-Kyber panel and work up from the bottom again.
13. Open the disclosure headed **The KEM layer: Fujisaki–Okamoto with implicit rejection, live** at the foot of the toy-Kyber panel. Press **Run KEM: encapsulate → decapsulate** and record its row of the last table, then press **Tamper with the ciphertext, then decapsulate** and record that row.

> In step 6 the typed arrows describe a different set of dots from the ones drawn — the status line says which dots they generate. Read that row's decoding cells as what the page reports, not as a decoding of the grid in front of you.

> The values in steps 11 to 13 come from the seed shown in the panel, so a classmate with a different seed sees different numbers. **Copy experiment link** puts your seeds in a URL if you want someone else to reproduce your exact run.

> Guided mode shows one exhibit at a time. If you would rather have the whole page at once, **Reference** switches to that view, and the rail still moves you between exhibits.

## Record

Every value here comes from your own run.

| Header experiment | What the page computed |
|---|---|
| Where rounding in B lands | |
| B's error | |
| Where rounding in B′ lands | |
| B′'s error | |
| How much bigger the page says B′'s miss is | |

| Exhibit 1 row | Status line: same lattice or different | Rounded decode | Error | Badge on the decoding line |
|---|---|---|---|---|
| Good basis B, target as the preset sets it | | | | |
| Bad basis B′, target as the preset sets it | | | | |
| Good basis B, target (9, 2) | | | | |
| b₁ x set to 4, target (9, 2) | | | | |

| Exhibit 2 basis | Shortest vector reported | Its length | ‖b₁‖ | ‖b₂‖ | What the badge says |
|---|---|---|---|---|---|
| Good basis B₂ | | | | | |
| Bad basis B₃ | | | | | |

| Exhibit 3, Gauss on Example 9.11 | Value |
|---|---|
| ‖v‖² in the first line | |
| ‖v‖² in the second line | |
| The reduced basis in the last line | |
| What the last line says the first vector attains | |
| Recorded steps counted in the status line | |

| LWE candidate s | Error size ‖e‖∞ reported | Accepted or rejected | Rows reporting a small error |
|---|---|---|---|
| The candidate the panel opens with | | | |
| (1, 2, 3) | | | |
| Solution 1 | | | |
| Solution 1 with s3 raised by one | | | |

| toy-Kyber reading | Worked example from the slides | At the first setting over the ceiling |
|---|---|---|
| Message bits sent | | |
| Decoded bits | | |
| Measured error ‖E‖∞ | | |
| Ceiling the page prints | | |
| Badge on the measured-error line | | |
| Experiment seed | | |
| Error-bound setting | | |
| Mode button shown as selected | | |

| KEM action | Do the two keys agree? | What the teaching view says happened |
|---|---|---|
| Run KEM: encapsulate → decapsulate | | |
| Tamper with the ciphertext, then decapsulate | | |

## Explain

1. Your first two Exhibit 1 rows decode the same target, and the status line said the same thing about the dots in both. Using the decoding line the page prints — the target written as c₁·b₁ + c₂·b₂, then each coefficient rounded — explain why the rounded point moved when only the description changed, and why the error grew.
2. Look at the badge column of the second table. Did rounding land on the point the page calls the true closest in every row? Using the page's own description of this decoding as the Closest Vector Problem solved the naive way, say what rounding gives you and what it does not, and which of your rows is the evidence.
3. In the third table the shortest vector reported did not move when you switched bases, but the two badges disagreed about the basis. Explain what that says about which facts belong to the grid of dots and which belong to the description, and say what the page means when it still calls one of the two bases good.
4. In the LWE panel, checking a candidate took one press and the page showed both sides of every equation. Using the panel's own note that the same system without the error term is solved instantly by Gaussian elimination, and the panel's disclosure on where the lattice in LWE is, explain why checking a candidate is easy while finding one is not, and name the exhibit you already did that the disclosure points back to.
5. Use your last two tables together. First, say what actually crossed what when the decoded bits stopped matching the message, quoting the two numbers on the measured-error line rather than the slider setting — the slider's label says which of the two decides. Then say what the receiver did with the tampered ciphertext, and why the page describes that as specified behaviour rather than a failure.

## Fix / Extend

1. **Fix.** A colleague's slide says: "ML-KEM's private key is a secret good basis, and the receiver decodes the ciphertext with it." Using the opening card's paragraph on holding the basis intuition loosely, the key-generation note in the toy-Kyber panel, and the page's closing section on what is real here, say what is wrong with that sentence, what the secret actually is, and which part of the geometry you worked through is intuition rather than mechanism.
2. **Extend.** Press **4 · LWE & SIS** and go to the second panel, SIS. Open its **Stuck? Reveal the known solutions** disclosure and press **The cheat: z = 0**; record which of the three conditions the panel reports pass and which fail. Press **Solution 1: z = (2, -2, 0, 3, 0)** and record the three again. Then set **z1** to 1, press Tab, and record which condition flips. Finally, read the two disclosures headed with the question of where the lattice is, one in each panel, and write one sentence saying which of the shortest-vector and closest-vector problems each panel is.
3. **Extend.** Press **3 · Reduce** and press **LLL — Ex 9.21 (4-dimensional)**. Press **Step** through the whole run, writing down each Lovász line as holding or violated and noting where a swap follows one. Press **Run to end** and record the reduced basis and the number of swaps the last line reports. Then press **Gauss — Ex 9.12 (big numbers)** and **Run to end**, and record ‖v‖² in the first line and in the last, and how many iterations the run took compared with the number the panel's introduction states.
4. **Extend.** Press **5 · Schemes** and go to the second panel, toy-Dilithium. Press **Replay the slides’ worked example**, then **Verify**, and record the two check lines and the verdict. Press **Tamper with z, then verify** and record what changed. Then type a short message of your own into **Message to sign:**, press **Sign (live, with rejection sampling)**, and record how many attempts the page lists and how many of them were aborted and why. Press **Verify**, then **Verify against a tampered message**, and record both verdicts together with what the page says about how often a tampered message can still be accepted at this toy size.
5. **Extend.** Press **6 · Check** and answer all five questions, choosing before you read any explanation. Record your first-try score, and for each question you missed write one line saying what the page's explanation gave you that your answer did not.
