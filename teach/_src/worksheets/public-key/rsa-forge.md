---
exhibit: rsa-forge
module: public-key
minutes: 32
outcomes: [3]
source_commit: 2152e7023198
checked: 2026-09-22
anchors:
  - "#tab-4"
  - "#cfg-vulnerable"
  - "#cfg-safe"
  - "#cfg-result-title"
  - "#cfg-result-text"
  - "#hastad-setup"
  - "#hastad-n1"
  - "#hastad-n2"
  - "#hastad-n3"
  - "#hastad-message"
  - "#hastad-broadcast"
  - "#hastad-c1"
  - "#hastad-c2"
  - "#hastad-c3"
  - "#hastad-attack"
  - "#hastad-recovered-text"
  - "#hastad-whatjust-text"
  - "#tab-5"
  - "#bb-setup"
  - "#bb-n"
  - "#bb-e"
  - "#bb-target-msg"
  - "#bb-oracle-input"
  - "#bb-oracle-query"
  - "#bb-oracle-result"
  - "#bb-hom-run"
  - "#bb-hom-prod"
  - "#bb-hom-encab"
  - "#bb-hom-verdict"
  - "#bb-run"
  - "#bb-query-count"
  - "#bb-iteration"
  - "#bb-interval-size"
  - "#bb-byte-row"
  - "#bb-attack-log"
  - "#bb-recovered-text"
  - "#bb-whatjust-text"
  - "#bb-run-oracle-mode"
  - "#bb-om-b0"
  - "#bb-om-b1"
  - "#bb-om-yes"
  - "#bb-om-no"
  - "#bb-om-feedback"
  - "#bb-om-total"
  - "#bb-om-autocomplete"
  - "#bb-abort"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. The same short message, with no padding, is encrypted to three different recipients whose public keys all use e = 3. An attacker intercepts all three ciphertexts and knows all three public moduli, and never sees a private key. Predict whether the message can be recovered, and name the two things the attacker would have to compute. Write your prediction in the first table under Record.
2. Now the same message goes to three recipients using e = 65537 and OAEP padding instead. Predict whether the same attack recovers it, and say which change you think does the work — the larger exponent, or the padding.
3. A service answers exactly one question about any ciphertext you hand it: is the decryption PKCS#1 v1.5 conformant, yes or no. It never returns plaintext and never says anything else. Predict roughly how many questions it takes to recover one short plaintext under a 16-byte modulus — tens, thousands, tens of thousands, or more — and explain your guess.
4. An attacker who cannot decrypt anything multiplies an intercepted ciphertext c by sᵉ mod n, for a multiplier s of their own choosing. Predict what happens to the plaintext hidden inside that ciphertext, and say whether the attacker gets to see the result.

## Do

Steps 1 to 6 are on the **Small Exponent Attack** tab; steps 7 to 12 are on the **Bleichenbacher Oracle** tab. Press the buttons in the order given: each panel reveals its next card only once the previous step has run.

1. Open the exhibit and choose the **Small Exponent Attack** tab. Read the description under the panel title, then the card **Pick Your Config — Will Your Message Survive?**.
2. Press the configuration card **Faster boot, simpler code**, the one marked `e = 3 · padding = none (textbook)`. Record the headline the result box shows and what its text says happened to the message.
3. Press the other card, **NIST-recommended defaults**, marked `e = 65537 · padding = OAEP-SHA256`. This one builds three full-size RSA keys before it runs, so give it a few seconds. Record its headline and the recovered value its text reports.
4. Scroll to **Setup — Three Recipients, e=3 (Manual)** and press **Generate 3 Recipient Keys (e=3)**. Three recipient cards appear. Record the first eight hex digits of **n₁ (modulus)**, **n₂ (modulus)** and **n₃ (modulus)**.
5. In **Message (max 6 chars for demo)**, replace the suggested text with up to six ordinary letters or digits of your own, then press **Broadcast to 3 Recipients**. Record the first eight hex digits of **c₁ = m³ mod n₁**, **c₂ = m³ mod n₂** and **c₃ = m³ mod n₃**.
6. Press **Execute CRT + Cube Root Attack**. Record the line under **Message Recovered Without Private Key** and whether it matches what you typed, then read the **What just happened** sentence below it.
7. Open the **Bleichenbacher Oracle** tab. Read **PKCS#1 v1.5 Encryption Padding Structure** and write down, in the fourth table, what the page says "conformant" means.
8. Press **Generate Demo Key + Conformant Ciphertext**. Record the first eight hex digits of **Modulus n (128-bit)**, the value shown under **e (public exponent)**, and the **Target message**.
9. Go to the card **The Padding Oracle**. The box under **Test ciphertext (hex) — try any value:** is already filled with the intercepted ciphertext. Press **Query Oracle** and record the answer the log shows. Then replace the contents of that box with `01`, press **Query Oracle** again, and record that answer.
10. In **Execute Bleichenbacher Attack**, press **Show Enc(a) × Enc(b) = Enc(a × b)**. Record what the page prints for **Enc(a) × Enc(b) mod n** and for **Enc(a × b) directly**, and the verdict line beneath them.
11. Press **Run Attack (Auto)**. Watch the interval bar and the cells under **Plaintext recovery — bytes that are uniquely determined by the current interval [a, b]**. When the run stops, record **Oracle queries**, **Iterations**, **Interval bits remaining**, the recovered plaintext line, and the last line of the attack log.
12. Press **You Are the Oracle (step through)**. For each of the first five queries, read the two bytes the panel shows you, answer **CONFORMANT** or **NOT CONFORMANT** truthfully, and record the two bytes, your answer and the feedback line. Then read **Total queries**, press **Let the machine finish**, and record the recovered plaintext line for this second run.

> If a button appears to do nothing, check the order. The manual Håstad cards appear one at a time, and every control on the Bleichenbacher tab needs **Generate Demo Key + Conformant Ciphertext** to have been pressed first. The page reports an out-of-order press only to a screen reader, so there is nothing on screen to see.

> Keep your step 5 message to ordinary letters and digits. The panel caps the box at six characters, and accented or non-Latin characters take more than one byte each.

## Record

Everything in these tables comes from your own run. Where a value is long hex, the first eight digits are enough.

| Configuration you picked | My prediction: recovered, or not? | Headline the result box showed | What its text reported about the message |
|---|---|---|---|
| Faster boot, simpler code | | | |
| NIST-recommended defaults | | | |

| Recipient | Modulus nᵢ, first 8 hex digits | Ciphertext cᵢ, first 8 hex digits |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |

| Håstad run | What I recorded |
|---|---|
| Message I typed | |
| Recovered message line | |
| Does it match what I typed? | |

| Bleichenbacher setup | What I recorded |
|---|---|
| What the page says "conformant" means | |
| Modulus n, first 8 hex digits | |
| e (public exponent) | |
| Target message | |

| Oracle query | Value I sent | Oracle's answer |
|---|---|---|
| Pre-filled ciphertext | | |
| `01` | | |

| Homomorphism demo | What the page printed |
|---|---|
| Enc(a) × Enc(b) mod n | |
| Enc(a × b) directly | |
| Verdict line | |

| Attack run | Oracle queries | Iterations | Interval bits remaining | Recovered plaintext line |
|---|---|---|---|---|
| Run Attack (Auto) | | | | |
| You Are the Oracle, then Let the machine finish | | | | |

| Hand-answered query | First byte | Second byte | My answer | Feedback line |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| Total queries after five decisions | | | | |

## Explain

1. The card **Attack — CRT Reconstruction + Cube Root** states that m³ is smaller than n₁·n₂·n₃, so the Chinese Remainder Theorem gives exactly M = m³. Using your own three moduli and three ciphertexts, explain why three intercepted ciphertexts were enough, and point out where a private key would have been needed in that argument and was not.
2. Your two configuration runs disagreed. Using the card **Why OAEP Destroys This Attack**, say which of its bullets breaks the CRT step and which breaks the cube-root step. Then quote what the safe run reported as the recovered value, and explain why that is what a failed attack looks like on this panel.
3. Your two oracle queries in step 9 came back differently. Using the page's own definition of conformant — `EM[0] == 0x00` and `EM[1] == 0x02`, equivalently m in [2B, 3B−1] — say precisely what the attacker learns from each of the two answers, and why "not conformant" is still worth a query.
4. Using your homomorphism row and the paragraph above the attack buttons, explain how multiplying c by sᵉ moves the hidden plaintext to m × s without anything being decrypted, and why a conformant answer to that modified ciphertext narrows the interval [a, b] around m.
5. Compare **Total queries** after your five hand-answered decisions with **Oracle queries** from the automatic run. What does that comparison tell you about a human acting as the oracle, and about a server that answers this question quickly? Then name, for each of the two attacks you ran today, the configuration choice that made it possible, and what the page gives as the fix for it.

## Fix / Extend

1. **Fix.** You maintain a service that decrypts PKCS#1 v1.5 ciphertexts and returns a distinct error when the padding is wrong. Using the card **Why TLS 1.3 Removed RSA Key Exchange Entirely**, list the changes that card supports, and say for each one which part of your step 11 run it takes away: the one-bit answer, the key exchange itself, or the padding scheme.
2. **Fix.** An internal service broadcasts the same unpadded status message to three regional endpoints, each with its own RSA key and e = 3. Using the bullets on **Why OAEP Destroys This Attack**, name a change that card supports that would stop your step 6 attack, say which of your recorded values would look different afterwards, and say why you chose that change over the others it lists.
3. **Extend.** Press **You Are the Oracle (step through)** again, and on one query answer **CONFORMANT** when the two bytes shown are not `00` and `02`. Record the feedback line, then press **Let the machine finish** and record what the attack finally reports. Explain why the page re-encrypts its candidate before it calls anything recovered. If the run does not stop on its own, press **Abort** and record the last line of the log instead.
4. **Extend.** Press **Generate 3 Recipient Keys (e=3)** again, broadcast the same message you used in step 5, and run the attack again. Record whether c₁, c₂ and c₃ changed, and whether the recovered message changed. Using the card's own description of what that button does, say which part of the run supplied the new values.
