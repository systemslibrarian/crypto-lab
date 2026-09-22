---
exhibit: grover
module: post-quantum
minutes: 26
outcomes: [2]
source_commit: 873e40d8f891
checked: 2026-09-22
anchors:
  - "#panel-a"
  - "#n-slider"
  - "#n-value"
  - "#random-btn"
  - "#target-display"
  - "#step-btn"
  - "#reset-btn"
  - "#decompose-toggle"
  - "#predict-toggle"
  - "#predict-prompt"
  - "#iter-display"
  - "#phase-label"
  - "#viz-rotation"
  - "#viz-amplitudes"
  - "#bar-chart"
  - "#amp-values"
  - "#math-layer"
  - "#banner"
  - "#misconception"
  - "#prob-canvas"
  - "#measure-btn"
  - "#measure-stats"
  - "#panel-b"
  - "#race-classical-stats"
  - "#race-quantum-stats"
  - "#panel-c"
  - "#panel-signature"
  - "#key-selector"
  - "#aes-example"
  - "#panel-budget"
  - "#budget-selector"
  - "#budget-box"
  - "#reality-panel"
  - "#panel-challenge"
  - "#challenge-list"
  - "label:Grover vs Shor — The Two Quantum Threats"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. A search space holds 16 keys and exactly one of them is correct. Classically, how many keys would you expect to try before you hit it? Grover's search needs roughly the square root of the space instead. Write down the number of Grover iterations you expect, and say which of the two numbers you are more confident about.
2. Grover's oracle recognises the correct key and flips the sign of its amplitude — it turns a positive number negative. Predict what that does to the *probability* of measuring the correct key at that instant: raises it, lowers it, or leaves it alone. Give a reason before you look.
3. You keep pressing Step long after the amplitude has climbed. Predict what the success probability does: keeps rising, levels off at some ceiling, or falls again. Sketch the shape you expect on a graph of probability against iteration count.
4. Grover is usually summarised as "it halves your effective key length". Predict what AES-128 and AES-256 become under that rule, and predict whether a halved key length is the same thing as a broken cipher. Then predict which of AES-256 and RSA-2048 the page will say needs a bigger parameter and which needs a different algorithm.

## Do

The exhibit is one long page of panels, not tabs. Each step names the panel heading to scroll to.

1. In the **Grover's Algorithm — Amplitude Amplification** panel, leave **Search space n qubits** at 4. Record the N readout beside the slider, the index and binary label on the target line, and the two numbers on the iteration line, which reads `Iteration: k = 0 / k* = 3`. Scroll to **Classical vs Quantum Search** and record the three numbers in the two strategy blocks: the classical expected queries, the Grover oracle queries, and the reflections applied. Fill in the first table.
2. Back in **Grover's Algorithm — Amplitude Amplification**, check **Show oracle + diffusion sub-steps**. A sub-step line appears under the iteration line reading `State — equal-ish superposition after the last iteration`. Record the target amplitude and the probability from the amplitude readout beside the bar chart, and whether the target's bar sits above or below the centre line.
3. Press **Step** once. The sub-step line now reads `Oracle — flip the target’s phase`. Record the same three things again. Press **Step** a second time; the line reads `Diffusion — invert all amplitudes about the mean`. Record the same three things a third time. Fill in the second table.
4. Press **Reset**, uncheck **Show oracle + diffusion sub-steps**, and check **Prediction mode**. Press **Step**: instead of advancing, the page asks you to commit a guess and offers three answers. Write your guess in the third table, then choose the matching answer. Read the verdict line and record what the page says actually happened, with the two percentages it prints. After each commit, glance at the probability curve below the charts and find the moving dot. Repeat until the gold banner appears reporting that the optimal k* has been reached.
5. Press **Measure ×100** and record the hit count, the empirical success and the theoretical figure in the fourth table.
6. Press **Step** once more. The prompt now says you are at or past k*; commit a guess and record the verdict in the last row of the third table. The banner should change. Press **Measure ×100** again and record the second row of the fourth table.
7. Scroll to **Why Grover Still Doesn't Break AES Instantly**. Set **Key size** to AES-128 and record the classical and Grover figures; set it to AES-256 and record the same two. Fill in the fifth table.
8. Scroll to **The Real Cost of One Oracle Call**. This panel has its own **Key size** control, and it does not follow the one in the panel above. Set it to AES-128 and record the iterations, the cost per oracle call, the total circuit depth and the practical threat; then set it to AES-256 and record the same four. Fill in the sixth table.

> If pressing **Step** appears to do nothing, check whether **Prediction mode** is on. With it on, **Step** only opens the question — the walk advances when you commit to one of the three answers.

> The measurement grid clears itself whenever the state changes, so read your hit count before you press **Step** again.

## Record

Everything here comes from your own run. Only the target line in the first table and the hit counts in the fourth are yours alone; every other cell should match your neighbour's, and Explain 3 asks you to check that.

| Reading | My value |
|---|---|
| N | |
| Target index, and its binary label | |
| Optimal iterations k* | |
| Classical expected queries | |
| Grover oracle queries | |
| Reflections applied | |

| Sub-step | Target amplitude | Success probability | Target bar above or below the centre line |
|---|---|---|---|
| State, before the oracle | | | |
| Oracle | | | |
| Diffusion | | | |

| Step | My prediction | What the page reported | Probability before and after |
|---|---|---|---|
| k = 0 to k = 1 | | | |
| k = 1 to k = 2 | | | |
| k = 2 to k = 3 | | | |
| k = 3 to k = 4 | | | |

| Measured at | Target hits out of 100 | Empirical success | Theoretical |
|---|---|---|---|
| k = k* | | | |
| k = k* + 1 | | | |

| Key size | Classical brute force | Grover (idealized) |
|---|---|---|
| AES-128 | | |
| AES-256 | | |

| Key size | Grover iterations | Cost per oracle call | Total circuit depth | Practical threat |
|---|---|---|---|---|
| AES-128 | | | | |
| AES-256 | | | | |

## Explain

1. In your second table, the oracle changed the sign of the target amplitude. Did your probability column change across that row? Using the **Reality** line the Myth and Reality panel shows during the oracle sub-step, and the relationship the amplitude readout prints between an amplitude and a probability, explain what the oracle did and what it did not do. Then say what the diffusion row changed that the oracle row did not.
2. Describe in one sentence how the probability moved across the four rows of your third table. The rotation view's caption says the state is a unit vector, that each iteration rotates it by 2θ toward the target axis, and that success probability is the squared height. Use that to explain why your last step lowered the probability rather than raising it.
3. Your two measurement rows were taken from two different states. Compare each empirical success against the theoretical figure printed beside it, and compare your figures with a classmate's. Using the caption beside the **Measure ×100** button, explain why running Grover to k* is not the same as knowing the key, and why your hit count is not your classmate's.
4. Both key sizes in your sixth table have their iteration count set at half the key length, yet the page calls one of them weakened and the other strong. Look at which of the three cost figures changes between your two rows and which stays the same. Use that to explain both the halving and the difference in verdict. Then read **The Mitigation** in the **Impact on Symmetric Cryptography** panel: what does it say fixes the symmetric case, and what does it say public-key systems need instead? Say which of those two claims you saw evidence for in this exhibit and which one the page only asserts.
5. The **About This Demo** panel lists, under **This demo is not**, several things the simulation leaves out. Name the item on that list that most limits what your sixth table can tell you about a real attack, and say why.

## Fix / Extend

1. **Fix.** You run a service that encrypts stored records with AES-128 and authenticates them with HMAC-SHA-256, and you are asked what to change for a post-quantum threat model. Using **The Mitigation** list in the **Impact on Symmetric Cryptography** panel and the hash table above it, name the parameter changes the page supports and say, from your own sixth table, what each one buys. Then use the note printed under the hash table to say which hash property the halving rule applies to and which one it does not.
2. **Extend.** In the **Grover's Algorithm — Amplitude Amplification** panel, move **Search space n qubits** to 8 and record N and k* from the readouts; then move it to 12 and record them again. Above 8 qubits the bar chart is replaced by a note saying the space is too large to draw individual bars; the rotation view and the probability curve keep working. Alongside each pair write the square root of N. Compare how k* grows against how N grows, and say whether the growth you recorded looks like N or like the square root of N.
3. **Extend.** With the slider back at 4, press **Reset**, then press **Random target** several times and watch the target line, the iteration line and the amplitude readout. Record which of those three change and which do not. The math layer under the two charts prints the equations for θ and for the success probability with the current numbers substituted; use them to explain what the probability depends on.
4. **Extend.** In the **Impact on Symmetric Cryptography** panel, open the disclosure **Grover vs Shor — The Two Quantum Threats** and read its seven rows. For each row, mark whether this exhibit showed you evidence for it or only stated it. Keep the marked table: the companion Shor exhibit covers the rows this one only states.
5. **Extend.** Work the **Challenge Mode** panel as an exit ticket. Answer all of its questions, read each explanation, and note any question whose explanation disagrees with what you recorded above.
