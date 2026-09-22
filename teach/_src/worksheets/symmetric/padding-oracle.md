---
exhibit: padding-oracle
module: symmetric
minutes: 35
outcomes: [3, 4]
source_commit: 3a7e02e6daeb
checked: 2026-09-22
anchors:
  - "#tab-1"
  - "#p1-craft-setup-btn"
  - "#p1-craft-byte"
  - "#p1-predict-valid-btn"
  - "#p1-predict-invalid-btn"
  - "#p1-craft-result"
  - "#tab-3"
  - "#p3-plaintext"
  - "#p3-speed"
  - "#p3-encrypt-btn"
  - "#p3-run-btn"
  - "#p3-result"
  - "#tab-4"
  - "#p4-plaintext"
  - "#p4-generate-btn"
  - "#p4-run-btn"
  - "#tab-5"
  - "#tab-6"
  - "#p6-bench-plaintext"
  - "#p6-bench-btn"
  - "#p6-bench-rows"
  - "#p6-aead-btn"
  - "#p6-tamper-btn"
  - "#p6-aead-result"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. A receiver decrypts a block that reads `0x10` sixteen times, which is a full block of PKCS#7 padding. An attacker can change only the **last** decrypted byte. For each value below, predict whether the receiver will still call the padding valid. Write your predictions in the first table under Record.
2. Suppose a server answers only "padding valid" or "padding invalid" and never shows the decrypted text. Can an attacker who never learns the key still recover the plaintext? Say what you think the attacker would have to change between one question and the next.
3. Roughly how many questions ("oracle queries") do you expect it to take to recover one 16-byte block: fewer than a hundred, hundreds, a few thousand, or millions? Explain your guess.
4. Three servers receive the same attack. One reports padding errors, one gives the same response whatever its padding check found, and one checks a MAC before it decrypts anything. Predict which of them will give up the plaintext.

## Do

1. Open the exhibit and stay on the **CBC & Padding** tab. Read the CBC decryption rule at the top of the tab.
2. Scroll to **Your Turn: Craft the Last Padding Byte** and press **Set Up Practice Ciphertext**.
3. Choose a value in **Force last decrypted byte to**, then press **Predict: Valid** or **Predict: Invalid** to match your prediction from question 1. Read the oracle's answer and the page's explanation, and record the answer. Repeat for every value in the list.
4. Open the **Full Block** tab. Type your own text of about 16 characters into **Target plaintext**. Set **Animation speed** to Slow if you want to watch the first bytes recover one at a time.
5. Press **Encrypt Target Block**, then **Run Full Block**. When it finishes, record the result, the byte-for-byte badge and the number of oracle queries used.
6. Without changing your text, press **Encrypt Target Block** and **Run Full Block** again. Record the second run.
7. Open the **Defenses** tab. Under **Same Attack, Three Servers**, leave or change **Plaintext to attack**, then press **Run Attack Against All Three**. Record each row of the table.
8. Under **AES-GCM Live Demo: Tampering Rejected**, press **Encrypt with AES-GCM**, then **Tamper Ciphertext**. Record what the page reports.

## Record

Values you record in the second and third tables come from your own run.

| Forced last byte | My prediction | Oracle's answer |
|---|---|---|
| 0x00 | | |
| 0x01 | | |
| 0x02 | | |
| 0x03 | | |
| 0x0f | | |
| 0x10 | | |
| 0x41 | | |

| Full Block run | Target plaintext | Badge (match or mismatch) | Oracle queries used |
|---|---|---|---|
| First run | | | |
| Second run | | | |

| Server | Outcome | Oracle queries | Padding checks reached | MAC rejections |
|---|---|---|---|---|
| Leaky CBC | | | | |
| Silent CBC | | | | |
| Encrypt-then-MAC | | | | |

| AES-GCM tamper | What the page reported, in your own words |
|---|---|
| After Tamper Ciphertext | |

## Explain

1. Which forced values did the oracle accept? Using the rule that the last byte of a block says how many padding bytes there are, explain why those values pass and the others fail.
2. The attacker never sees the key. Using the decryption rule on the CBC & Padding tab, explain how changing one byte of the previous ciphertext block, and watching only valid or invalid, lets the attacker learn one byte of plaintext.
3. Your two Full Block runs used the same text. Why did the number of oracle queries change, and why is your count different from a classmate's? What stayed the same?
4. The silent server still ran a padding check on every query. Why did the attack fail against it, and why does the page call this the fragile defense?
5. Against Encrypt-then-MAC, the attack's queries never reached the padding check. What stopped them first?

## Fix / Extend

1. **Fix.** You maintain a service that decrypts AES-CBC messages and returns one error for bad padding and a different one for bad data. Rank the three defenses on the Defenses tab (uniform errors, Encrypt-then-MAC, authenticated encryption) and justify the ranking by what an attacker can still observe under each.
2. **Extend.** Open the **Hall of Fame** tab and pick one real exploit. Identify what played the part of the oracle in that system: an error code, a protocol alert or a timing difference.
3. **Extend.** Open the **Full Decryption** tab, type a message several blocks long into **Plaintext to encrypt and decrypt**, press **Generate Ciphertext**, then **Run Full Attack**. Describe how the query count grows with the number of blocks and compare it with the complexity the tab states.
