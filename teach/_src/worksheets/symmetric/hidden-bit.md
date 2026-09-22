---
exhibit: hidden-bit
module: symmetric
minutes: 15
outcomes: [1]
source_commit: 00705ccbf695
checked: 2026-09-22
anchors:
  - "#tab-cpa"
  - "#cpa-scheme"
  - "#cpa-scheme-detail"
  - "#cpa-adversary"
  - "#cpa-step"
  - "#cpa-coin"
  - "#cpa-ciphertext"
  - "#cpa-trials"
  - "#cpa-run"
  - "#cpa-retirement"
  - "#cpa-wins"
  - "#cpa-advantage"
  - "#cpa-interval"
  - "#cpa-verdict"
  - "#cbc-negative"
  - "#cbc-negative-title"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. In this game a challenger samples a hidden bit (the coin) and uses it to pick which of two equal-length messages to encrypt; an adversary then tries to name the coin. How often would a blind guess be right? The page scores an adversary with `2 · wins / trials - 1`. Predict the score of a blind guesser, and of an adversary that is never wrong.
2. Suppose one key encrypts the same message twice. Predict whether the two ciphertexts will be identical under AES-ECB, and under AES-GCM, which the page describes as using "a fresh 96-bit nonce".
3. The adversary Re-encrypt and compare sees both messages, the challenge ciphertext and a public encryption oracle that encrypts messages of its choosing. Fill in the prediction column of the second table under Record: for each row, will that adversary beat a blind guess ("edge") or not ("no edge")?
4. The page describes AES-CBC, chained IV as CBC "whose next IV is the previous ciphertext tail". If a blind guess and Re-encrypt and compare both show no edge against it, would you conclude that it hides which message was encrypted? What could a third adversary, the BEAST-style IV predictor, do with an IV it can see coming?

## Do

1. Open the exhibit and stay on the **Hidden-bit game** tab. The page generates an RSA key before its controls appear, so allow a moment. This worksheet uses only the AES choices in **Scheme**.
2. In **Scheme**, choose **AES-ECB (BROKEN)** and read the hint under the menu. Set **Adversary** to **Random guess**. Press **Step one** four times. After each press, record the coin shown under **Seal the coin** and the last eight hex characters of the **Ciphertext begins** line, just before the dots. If all four coins match, keep pressing until the coin changes and record that press as the fourth.
3. Choose **AES-GCM** in **Scheme**, read its hint, and repeat step 2 in the AES-GCM columns.
4. Leave **Trials** at 200. For each of the first four rows of the second table, choose that **Scheme** and **Adversary**, press **Run**, and wait until the note under the controls begins "Fresh result". Record **Wins**, **MEASURED ADVANTAGE**, the **Wilson 95% interval** and the first words of the verdict under the advantage bar.
5. Choose **AES-CBC, chained IV (BROKEN)**. A panel headed **A flat line is not a verdict** appears below the ledger. Run and record the **Random guess** and **Re-encrypt and compare** rows the same way, then record that panel's heading as it now reads.
6. Open **Adversary** again: with this scheme it also lists **BEAST-style IV predictor**. Choose it, press **Run**, and record the last row.

## Record

Values in every table come from your own run.

| Step one press | AES-ECB coin | AES-ECB ciphertext, last eight hex | AES-GCM coin | AES-GCM ciphertext, last eight hex |
|---|---|---|---|---|
| First | | | | |
| Second | | | | |
| Third | | | | |
| Fourth | | | | |

| Scheme | Adversary | My prediction | Wins | Measured advantage | Wilson 95% interval | Verdict, first words |
|---|---|---|---|---|---|---|
| AES-GCM | Re-encrypt and compare | | | | | |
| AES-CTR | Re-encrypt and compare | | | | | |
| AES-ECB (BROKEN) | Random guess | | | | | |
| AES-ECB (BROKEN) | Re-encrypt and compare | | | | | |
| AES-CBC, chained IV (BROKEN) | Random guess | | | | | |
| AES-CBC, chained IV (BROKEN) | Re-encrypt and compare | | | | | |
| AES-CBC, chained IV (BROKEN) | BEAST-style IV predictor | | | | | |

| Chained-IV panel | Heading as it reads |
|---|---|
| After the Random guess and Re-encrypt and compare runs | |

## Explain

1. Compare the two halves of your first table. Under AES-ECB, what did presses with the same coin have in common, and was that also true under AES-GCM? The lab's [README](https://github.com/systemslibrarian/crypto-lab-hidden-bit) lists "Deterministic encryption leaks equality" under What Can Go Wrong. Explain that sentence using your AES-ECB records.
2. Re-encrypt and compare sees both messages, the challenge ciphertext and the public encryption oracle. Describe how a strategy with that name could identify the coin against AES-ECB, then explain why your AES-GCM and AES-CTR rows came out as they did. Use the hint the page shows under **Scheme** for each.
3. The same README says: "Chaining the previous ciphertext tail into the next IV gives the BEAST-style adversary a chosen-plaintext equality test." Using CBC encryption as you learned it in class, explain how an adversary that knows the IV its next oracle query will use can choose that query's message so the answer tests which message the challenge contains. Which part of the two ciphertexts would it compare?
4. Look at your three chained-IV rows and the panel heading you recorded. Using the panel's own sentence and the verdict text under the advantage bar, say what a measured advantage near zero tells you about a scheme and what it does not.

## Fix / Extend

1. **Fix.** One service encrypts short records with AES-ECB; another encrypts a stream of messages with AES-CBC, taking each IV from the end of the previous ciphertext. For each, name the adversary in your table that did best against it, say what the scheme would have to change so that repeating a message, or knowing the next IV, no longer helps that adversary, and say which of the page's AES schemes you would test in its place. Word your conclusion so it claims no more than the verdict that scheme earned in your run.
2. **Extend.** Choose **AES-GCM** and **Random guess**. Set **Trials** to 10 and press **Run**, then set it to 2000 and run again, recording the **Wilson 95% interval** each time. How does the interval's width change? Use that to explain why the page refuses fewer than ten trials for **Run** and says that "a sample is not a proof".
3. **Extend.** Compare your second table with a classmate's. Which rows match exactly and which differ? Using the README's note that "Finite samples fluctuate", explain why.
