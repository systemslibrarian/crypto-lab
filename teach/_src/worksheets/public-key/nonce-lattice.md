---
exhibit: nonce-lattice
module: public-key
minutes: 25
outcomes: [5]
source_commit: 6b023a9e821b
checked: 2026-09-22
anchors:
  - "#attack-config-form"
  - "#feasibility-slot"
  - "#gloss-def-information-floor"
  - "label:Curve"
  - "label:Leak Mode"
  - "label:Leak Size (bits)"
  - "label:Signature Count"
  - "label:Measure this column"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. Every ECDSA signature satisfies `s = k⁻¹(h + r·d) mod n`, which rearranges to the linear congruence `r·d − s·k + h ≡ 0 (mod n)`. Here `d` is the private key and `k` is the one-time nonce, and both are unknown; `r`, `s` and `h` are public. One signature is therefore one equation in two unknowns. Now suppose a signer produces two signatures over two *different* messages using the *same* `k`. Write down what an observer would see in the two public signatures that gives the reuse away, then say whether two such equations are enough to solve for `d`, and why.
2. To pin down a 256-bit secret, the leakage an attacker collects has to exceed the secret's entropy: leaked bits per signature multiplied by the number of signatures must clear 256. This lab's controls stop at 32 leaked bits per signature and 32 signatures. Predict the smallest number of signatures at which 24 known bits each could be enough, and predict what the lab should say about 24 bits across 4 signatures.
3. RFC 6979 derives the nonce deterministically from the private key and the message instead of drawing it from a random source. Predict what this attack should report for a batch of RFC 6979 signatures, and predict whether the attacker is left with a lattice that merely fails to give up the key, or with no lattice to reduce at all.
4. Later you will hold the signature count fixed and vary the leak size until recovery stops working. Predict whether that will be a sharp line — every run above it succeeds, every run below it fails — or a band. Say what you would expect to see from three runs of the same configuration sitting right at the edge.

## Do

1. Open the exhibit. It runs a configuration by itself on load, so wait until the line under the pipeline strip stops reading *Running lattice analysis*. Read the always-visible panel **The one equation everything hangs on** and note the rearranged congruence it prints.
2. In the **Configuration** panel, set **Curve** to *secp256k1 (Bitcoin)*, **Leak Mode** to *MSB leak — top bits known*, **Leak Size (bits)** to `24` and **Signature Count** to `12`. Press **Generate Attack**, the submit button at the foot of that form, and wait for the run to finish.
3. In the panel headed **Can this configuration recover the key?**, record the badge beside that heading and the coloured sentence printed under the plot. Then read the closing paragraph of that panel, which begins *Reading the axes honestly*, and record the curve it names and the bits-per-signature figure it quotes from the classic Hidden Number Problem result.
4. Four walkthrough steps appear above the analysis panels once a run finishes, in the same order as the pipeline strip. Every new run reopens the first of them. Open the first step and, from the **Signature Log** table, record for signatures 1 and 2: the *leaked_bits* entry and the leading digits shown in the *r*, *s*, *h* and *SHA-256* columns.
5. Open the fourth walkthrough step. Record the banner text at the top of the panel, the two lines on the *Validation* card, and whether any byte in the two-row key grid is marked as not matching. Then scroll to **Execution details** at the foot of the page and record *Signatures* and *Worker runtime*.
6. Set **Leak Mode** to *Reused nonce — PS3-style* and **Signature Count** to `2`, leaving **Leak Size (bits)** at `24`. Press **Generate Attack**. Record the scenario line under the pipeline strip, the feasibility badge, the two *r* values in the **Signature Log**, the banner in the fourth step, and what the third step's **Lattice View** and **Basis View** say in place of matrices.
7. Staying on that run, read the panel headed **Two signatures, no lattice needed** in the fourth step. Record the two formulas it prints, one for `k` and one for `d`, and the value it gives for `k`.
8. Set **Leak Mode** to *RFC 6979 — deterministic (secure)* and **Signature Count** to `12`, leaving **Leak Size (bits)** at `24`. Press **Generate Attack**. Record the scenario line, the summary line, the feasibility badge and the sentence under the plot, the banner, the *Recovered Key* card, the diagnostic sentence printed in the second walkthrough step, and the single line listed under *Diagnostics* in the fourth.
9. Still in RFC 6979 mode, press **Measure this column** and record the reason the panel gives for declining.
10. Set **Leak Mode** back to *MSB leak — top bits known* and **Signature Count** to `12`, then press **Measure this column**. This runs the real attack several times over at each of several leak sizes, so it takes a while; while it works, the panel says which rung it is on and shows the rungs it has not reached yet as *queued*. Leave the form alone until it finishes, then record every row of the table it fills in and the verdict paragraph below the table.

## Record

Every value below comes from your own run.

| Run | Feasibility badge | Scenario line under the pipeline strip | Summary line | Banner in the fourth step |
|---|---|---|---|---|
| MSB, 24 bits, 12 signatures | | | | |
| Reused nonce, 2 signatures | | | | |
| RFC 6979, 12 signatures | | | | |

| Signature Log (MSB run) | leaked_bits | r | s | h | SHA-256 |
|---|---|---|---|---|---|
| Signature 1 | | | | | |
| Signature 2 | | | | | |

| Recovery (MSB run) | Value |
|---|---|
| Validation card, first line | |
| Validation card, second line | |
| Execution details: Signatures | |
| Execution details: Worker runtime | |

| Reading | Reused-nonce run | RFC 6979 run |
|---|---|---|
| Are the r values in the log equal? | | |
| What the Lattice View shows in place of matrices | | |
| What the Basis View shows in place of rows | | |
| Recovered Key card | | |
| Diagnostic in the second walkthrough step | | |

| Configuration offered to Measure this column | Reason it gave for declining |
|---|---|
| RFC 6979, 12 signatures | |

| Measured column: MSB, 12 signatures | leak bits | recovered | rate | outcome, and milliseconds |
|---|---|---|---|---|
| Rung 1 | | | | |
| Rung 2 | | | | |
| Rung 3 | | | | |
| Rung 4 | | | | |
| Rung 5 | | | | |
| Rung 6 | | | | |

| Verdict paragraph | Value |
|---|---|
| Measured boundary, in bits | |
| Information floor it prints | |
| Drawn practical curve it prints | |
| Rungs it names as recovering sometimes | |

## Explain

1. In your reused-nonce run the two signatures shared one `r`. Using the two formulas the derivation panel prints, explain why sharing `k` makes `r` repeat, and how the pair of equations then yields first `k` and then `d`. Reading the formula for `k`, say what would have to be true of the two signatures for that arithmetic to break down, and why signing two different messages makes that unlikely.
2. The RFC 6979 run recovered nothing, and the third walkthrough step had no matrix in it at all rather than a matrix that failed. Using the diagnostic the page printed in the second step and the *Why this works* paragraph in the fourth, say what RFC 6979 removes from the signing path, and where the page says the security question moves to instead. Then say which of the two failures you reproduced in this exhibit — the reused nonce and the leaked nonce bits — that change addresses, and which one the closing paragraph of the same panel says is left as a separate question.
3. Compare the feasibility badge you recorded for the reused-nonce run and for the RFC 6979 run against what those two runs actually did. Using the note printed under the plot, say which configurations the gauge is about and which it is not. Write one sentence you would add to that panel to stop a reader drawing the wrong conclusion from the badge alone.
4. Look at your measured column. Which rungs recovered on some runs and not on others, and what does the verdict paragraph say decides the outcome at those rungs? Compare the measured boundary with the information floor and with the drawn practical curve that the same paragraph prints. Finally, using *Reading the axes honestly*, explain why your measurement is a statement about this page rather than about secp256k1, and what that paragraph gives as the real reason ordinary keys are safe.

## Fix / Extend

1. **Fix.** At the foot of the page there is a collapsed section whose summary ends *Real-world case studies, timeline, and related labs*. Open it and read the Android wallet entry from 2013 and the Minerva entry from 2019. The second walkthrough step lists an Attack Path and a Defense Path side by side. For each of those two incidents, name the Defense Path items that address it, and say which rung of the Attack Path each incident supplied for free. Then say which of the two the RFC 6979 mode you ran demonstrates a fix for, and which it leaves open.
2. **Extend.** Run the MSB configuration twice and compare the logs. Set **Curve** to *secp256k1 (Bitcoin)*, **Leak Mode** to *MSB leak — top bits known*, **Leak Size (bits)** to `24` and **Signature Count** to `12`, press **Generate Attack**, and wait for the run to finish. Open the first walkthrough step and, from the **Signature Log** table, record for signatures 1 and 2 the *leaked_bits* entry and the leading digits shown in the *r*, *s*, *h* and *SHA-256* columns. Then press **Generate Attack** again without changing anything, open the first walkthrough step again, and record the same five values for signatures 1 and 2 a second time.
3. **Extend.** Compare the two MSB runs from the item above. Which of the five recorded columns changed between them and which did not? The *leaked_bits* entry names both how many bits the attacker is given and what value those bits take — what is that value, and what does it tell you about how this demo produces a leak? What does an unchanged *SHA-256* column tell you about the messages the two runs signed, and why does that matter when you are deciding which of your recorded numbers a classmate could be expected to match?
4. **Extend.** Read the lattice itself. Set **Curve** to *secp256k1 (Bitcoin)*, **Leak Mode** to *MSB leak — top bits known*, **Leak Size (bits)** to `24` and **Signature Count** to `12`, press **Generate Attack**, and wait for the run to finish. Open the third walkthrough step and read *How one signature becomes one lattice row*, then record from the **Basis View** table how many rows it has and the *before* and *after* values on row 1. If the run recovered the key, the key bridge below the two matrices prints a line labelled *secretCoordinate / B (mod n)*; record the hex value on it.
5. **Extend.** Collect the other two refusals. With **Leak Mode** on *MSB leak — top bits known* and **Leak Size (bits)** at `24`, set **Signature Count** to `4`, press **Measure this column**, and record the reason the panel gives for declining. Then set **Signature Count** to `32`, press it again, and record that reason. Say how the two reasons differ, and which of the two the panel itself describes as a limit of this page rather than a property of the attack.
6. **Extend.** Measure a second column. Leave **Leak Mode** on *MSB leak — top bits known*, set **Signature Count** to `10`, and press **Measure this column** again. Two measured points are now drawn over the modelled curves. Compare the two measured boundaries with each other, and each with the drawn practical curve at its own signature count. What does the pair suggest about whether the drawn curve is optimistic, pessimistic, or about right over this range?
7. **Extend.** Set **Curve** to *P-256 (NIST)* and press **Generate Attack** with the same leak mode, leak size and signature count as your first run. Record what changes in the closing *Reading the axes honestly* paragraph and in **Execution details**, and what does not change in the bits-per-signature figure it quotes. Explain what that figure depends on, and why two different standardised curves can share it.
