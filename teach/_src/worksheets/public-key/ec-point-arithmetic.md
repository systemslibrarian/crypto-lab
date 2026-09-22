---
exhibit: ec-point-arithmetic
module: public-key
minutes: 20
outcomes: [4]
source_commit: ce6c3d3eb0c2
checked: 2026-09-22
anchors:
  - "#add"
  - "#cl-tab-real"
  - "#cl-panel-real"
  - "label:Real teaching curve"
  - "label:Show −P (the reflection)"
  - "label:Tangent (P = Q)"
  - "label:P + (−P) = O"
  - "label:2P = O (y = 0)"
  - "#cl-tab-fp"
  - "#cl-panel-fp"
  - "label:Finite-field curve"
  - "label:Point P"
  - "label:Point Q"
  - "label:Doubling (P = Q)"
  - "label:P + O = P"
  - "label:secp256k1 (y² = x³ + 7)"
  - "#scalar"
  - "label:Curve"
  - "label:Method"
  - "label:Double-and-add (efficient)"
  - "label:Repeated addition (definition)"
  - "label:Scalar k"
  - "label:Step ▸"
  - "label:Show all"
  - "label:k = order → O"
  - "#hard"
  - "label:Walk the subgroup ▶"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. The exhibit adds two points P and Q on a curve `y² = x³ + ax + b` by this rule: draw the line through P and Q, find where it meets the curve a third time, and reflect that point across the x-axis. Sketch a curve, put two points on it, and predict where P + Q lands relative to the third intersection. Then predict what the rule can return when the line through P and Q is vertical.
2. The exhibit runs the same formulas a second time with every coordinate reduced modulo a prime, the smallest being `p = 17`. Predict what the set of points looks like once you do that, and whether the slope of a "line" still makes sense. Predict what kind of numbers the slope and the resulting coordinates will be.
3. `k · G` means adding G to itself k times. For `k = 9`, predict how many point additions the definition needs. Then, given that doubling a point counts as one operation and that 9 is `1001` in binary, predict the fewest operations a doubling-based method could need. Write both numbers in the fourth table under Record.
4. One curve in the exhibit has a subgroup of 99 points; the other named curve has about 2 to the 256th. Suppose that recovering k from G and `k · G` could be done no other way than by trying every multiple of G in turn. Predict the worst-case number of tries on each. Then say whether a method needing about the square root of that number would change your answer for the larger curve.

## Do

1. Open the exhibit and scroll to the panel headed **2 · Point addition: the chord-and-tangent rule**. The **Over ℝ (geometry)** tab is the one open when the page loads. Leave the curve menu on `y² = x³ − x + 1`. Read the text readout under the controls on the right and record, in the first table, the P line, the Q line, which λ row is shown and the value after its `=`, and the x₃ and y₃ values. Check that the `P + Q` line at the foot of the readout repeats the x₃ and y₃ you just wrote down.
2. Still on **Over ℝ (geometry)**: put keyboard focus on the curve picture by pressing Tab twice from the **Over ℝ (geometry)** tab button, or by clicking the picture once without moving the mouse. Press the right-arrow key five times, then record the same readings. Press the up-arrow key once and record them again.
3. Still on **Over ℝ (geometry)**: tick **Show −P (the reflection)** and note what the picture adds. Then press **Tangent (P = Q)** in the row of examples under the controls, and record the readings again. One of the rows you have been copying is no longer printed; leave that cell empty.
4. Still on **Over ℝ (geometry)**: press **P + (−P) = O**, then press **2P = O (y = 0)**. For each, record in the third table what the result line says and the sentence printed underneath it.
5. Choose the **Over 𝔽ₚ (real crypto)** tab of the same panel. Leave the curve menu on `y² = x³ + 2x + 2 mod 17`. Read which point is already selected in **Point P**, then open **Point Q** and choose `(6, 3)`. Record the same readings in the second table, and again check the result line at the foot of the readout against your x₃ and y₃.
6. Still on **Over 𝔽ₚ (real crypto)**: press **Doubling (P = Q)** in the row of examples and record the readings. Then press **P + O = P** and record, in the third table, the line the readout prints and the sentence underneath it.
7. Scroll to the panel headed **3 · Scalar multiplication: k · P**. Leave **Curve**, leave **Method** on **Double-and-add (efficient)** and leave **Scalar k** at 9. Copy the cost each of the two cards below the examples prints into the fourth table. Press **Step** three times, recording the trace row and the accumulator line after each press in the fifth table. Note the row of bits labelled `k in binary:` above the buttons. Then press **Show all** and record the live counter on the selected card, the number of trace rows and the final line.

> The keyboard hint under the picture in step 2 reads: "Drag P or Q along the curve. Keyboard: focus the canvas, ← → move P (Shift for Q), ↑↓ flip branch." If an arrow press changes nothing, P has reached an end of the drawn stretch of curve; press the other arrow instead.

> Step 3 measures the tangent at wherever your arrow presses left P, so your numbers there depend on step 2 having been done exactly as written. If you have moved P further, say so beside the row.

> Do not press the randomize button in step 2. Every value in this worksheet is reproducible from the page's own starting state, and that control replaces it.

## Record

Every value comes from your own run.

| Reading, Over ℝ | P | Q | λ: which row, and its value | x₃ | y₃ |
|---|---|---|---|---|---|
| Opening state | | | | | |
| After five right-arrow presses | | | | | |
| After one up-arrow press | | | | | |
| After Tangent (P = Q) | | | | | |

| Reading, Over 𝔽ₚ | P | Q | λ: which row, and its value | x₃ | y₃ |
|---|---|---|---|---|---|
| Point Q set to (6, 3) | | | | | |
| After Doubling (P = Q) | | | | | |

| Example | Tab | The line the readout printed | The sentence printed under it |
|---|---|---|---|
| P + (−P) = O | Over ℝ | | |
| 2P = O (y = 0) | Over ℝ | | |
| P + O = P | Over 𝔽ₚ | | |

| For k = 9 | Repeated addition | Double-and-add |
|---|---|---|
| My prediction from Predict 3 | | |
| The cost its card prints | | |
| Live counter on the card after Show all | | |
| Trace rows I counted after Show all | | |
| The final line in the result card | | |

| Step press | The trace row as printed | The accumulator line |
|---|---|---|
| First | | |
| Second | | |
| Third | | |

## Explain

1. Your first three rows in the first table describe one rule with different numbers. The panel's opening sentence says: "To add P and Q: draw the line through them, find where it meets the curve a third time, and reflect that point across the x-axis." On the picture the third intersection is labelled `−(P+Q)` and the sum is labelled `P + Q`. Using your recorded x₃ and y₃, say what the reflection does to each of the two coordinates, and which of the two printed formulas is the one that carries it out.
2. In the fourth row of the first table the λ row changed its name and one of your columns went empty. The panel says: "When P = Q, the 'line' is the tangent." Explain what the tangent has replaced, and why the readout stopped printing that row even though its result line still reads `P + Q = …`.
3. Both examples you recorded on the **Over ℝ** rows of the third table ended at the same result. Quote the sentence the page printed under each, and explain from the picture why a vertical line leaves the rule with nothing to reflect. Panel 1 says the curve's points form a group "together with one extra point `O` — the 'point at infinity'". Using your third table, say what that extra point is there for.
4. Put your first table beside your second. The two λ rows print different formulas: over ℝ the readout divides, and over 𝔽ₚ it multiplies by a quantity written with `⁻¹ mod 17`. The note beside the lattice says: "Same group law — but every coordinate is reduced mod p, so the smooth curve becomes a scatter of points and the 'line' wraps around. The algebra below is identical to the ℝ case." Using both tables, say which parts of the two calculations are the same, which differ, and what has taken the place of division.

## Fix / Extend

1. **Fix.** A classmate writes in their report: "I recovered the secret k from G and k·G in the exhibit, so I solved an elliptic-curve discrete logarithm." Using the line panel 4 printed when **Walk the subgroup** stopped, and the sentence beginning "What this isn’t" at the foot of that panel, say what the exhibit actually did. Then rewrite the claim so that it says no more than your own run supports.
2. **Extend.** Open the exhibit at the panel headed **3 · Scalar multiplication: k · P**, leaving **Curve** as it loads and **Scalar k** at 9 so that this run matches the one you made in step 7. Open **Method**, choose **Repeated addition (definition)**, and press **Show all**. Record the live counter on the repeated-addition card, the number of trace rows and the final line in the result card; those three complete the repeated-addition column of the fourth table under Record.
3. **Extend.** Scroll to the panel headed **4 · Why you can’t go backwards (ECDLP)**. Press **Walk the subgroup** and let it run until it stops on its own. Write down the line it printed when it stopped, then copy both rows of the table of curves in that panel: for the toy curve and for secp256k1, the order n and the best generic attack the table gives for each. Do not press the new-secret button beside the walk; the line the walk prints is reproducible from the page's own starting state, and that control replaces it.
4. **Extend.** Your two columns in the fourth table reached the same `k · G`. State each method's cost in terms of k, using the cards' own wording and your two trace-row counts, and say how the number of doublings relates to the row of bits labelled `k in binary:` above the buttons on panel 3. Then use the line the walk printed and the two curve rows beside it to explain why computing `k · G` forward is cheap while recovering k from G and `k · G` is not, and say what the secp256k1 row adds that the toy row does not.
5. **Extend.** On panel 3, choose **Repeated addition (definition)** in **Method**, type `5000` into **Scalar k** and press Enter. The page prints a message in place of a trace. Record it, including the number it gives for double-and-add, and check that number against the cost card beside it. Say what the refusal is demonstrating and why the page treats it as part of the lesson rather than an error.
6. **Extend.** On panel 2's **Over 𝔽ₚ (real crypto)** tab, open **Finite-field curve** and choose `secp256k1 (y² = x³ + 7)`. The lattice is replaced by a note; record what the note says and how many decimal digits the x coordinate of P has. Then on panel 3 choose the same curve in **Curve**, press **k = order → O**, and press **Show all**. Record both cost cards, and compare the number on the repeated-addition card with the secp256k1 subgroup order you copied from panel 4's table of curves.
