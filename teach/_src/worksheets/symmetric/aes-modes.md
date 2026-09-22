---
exhibit: aes-modes
module: symmetric
minutes: 20
outcomes: [3]
source_commit: cbfb1b4dfa2c
checked: 2026-09-22
anchors:
  - "#tab-compare"
  - "#compare-plaintext"
  - "#compare-btn"
  - "#compare-output"
  - "#tab-ecb"
  - "#ecb-plaintext"
  - "#ecb-encrypt-btn"
  - "#ecb-decrypt-tamper-btn"
  - "#ecb-decrypt-output"
  - "#tab-cbc"
  - "#cbc-plaintext"
  - "#cbc-encrypt-btn"
  - "#cbc-bitflip-btn"
  - "#cbc-targeted-btn"
  - "#cbc-vuln-content"
  - "#cbc-decrypt-tamper-btn"
  - "#cbc-decrypt-output"
  - "#tab-ctr"
  - "#ctr-plaintext"
  - "#ctr-encrypt-btn"
  - "#ctr-decrypt-tamper-btn"
  - "#ctr-decrypt-output"
  - "#tab-gcm"
  - "#gcm-plaintext"
  - "#gcm-encrypt-btn"
  - "#gcm-tamper-btn"
  - "#gcm-tamper-content"
  - "#tab-ccm"
  - "#ccm-plaintext"
  - "#ccm-encrypt-btn"
  - "#ccm-tamper-btn"
  - "#ccm-tamper-content"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. You encrypt one 16-character block repeated four times under ECB, CBC, CTR, GCM and CCM, with a fresh random key for each mode. For each mode, predict whether any two ciphertext blocks will be identical. Write your predictions in the first table under Record.
2. An attacker changes one bit, or one byte, at the start of a ciphertext, and the receiver decrypts it with the correct key. For each of the five modes, predict whether the receiver gets plaintext back and, if so, how much of it changes. Write your predictions in the second table.
3. A message that decrypts to `userdata=guest--;admin=0;-------` was encrypted with AES-CBC and nothing else. Could someone who never learns the key make it decrypt with `admin=1` instead? Say which part of the ciphertext you think they would change, and what you expect to happen to the rest of the message.

## Do

1. Open the exhibit and choose the **Compare** tab. In **Plaintext**, type one block of exactly 16 characters, spaces included, four times in a row with nothing between the copies; the box suggests `YELLOW SUBMARINE`. Press **Encrypt under all 5 modes**. For each card, record whether it warns about duplicate blocks and what its note says about integrity or authentication.
2. Write a test message of at least 40 characters using ordinary letters, digits and spaces, and copy it. You will paste it into each mode's tab so that every mode encrypts the same text.
3. Open the **ECB** tab. Paste your test message into **Plaintext** and press **Encrypt with ECB**. Note which hex fields the tab fills in, then press **Decrypt (after flipping 1 ciphertext block)**. Record what the page says it changed and what came back.
4. Open the **CBC** tab. Paste your test message into **Plaintext**, press **Encrypt with CBC** and note the hex fields, then press **Demo: Bit-Flip**. Record what the page says it changed and compare the original plaintext with the text after the bit flip.
5. Still on the **CBC** tab, press **Demo: Targeted Bit-Flip (admin=0 → admin=1)**. This demo encrypts its own fixed message under a new key. Record the lines named in the third table.
6. Open the **CTR** tab. Paste your test message into **Plaintext Message 1**, press **Encrypt with CTR** and note the hex fields, then press **Decrypt (1-bit ciphertext flip)**. Record the result.
7. Open the **GCM** tab. Paste your test message into **Plaintext** and leave the other fields as they are. Press **Encrypt with GCM** and note the hex fields, then press **Demo: Tamper Detection**. Record what the page reports.
8. Open the **CCM** tab. Paste your test message into **Plaintext**, press **Encrypt with CCM** and note the hex fields, then press **Demo: Tamper Detection**. Record what the page reports.

> If no card in step 1 warns about duplicates, count your block again: it must be exactly 16 ordinary characters, with no line break or space between the copies.

> If the CBC result in step 4 says decryption failed, check that your test message is at least 40 characters, then press **Encrypt with CBC** and **Demo: Bit-Flip** again.

## Record

Everything you record comes from your own run. Leave the hex itself out: the tables ask what the page showed and said.

| Compare card | My prediction: any identical blocks? | Duplicate warning on the card | What the card's note says about integrity or authentication |
|---|---|---|---|
| ECB | | | |
| CBC | | | |
| CTR | | | |
| GCM | | | |
| CCM | | | |

| Mode tab | Hex fields the tab fills in | My prediction for a changed ciphertext | What the page says it changed | What came back, or what the page reported |
|---|---|---|---|---|
| ECB | | | | |
| CBC | | | | |
| CTR | | | | |
| GCM | | | | |
| CCM | | | | |

| Targeted bit-flip | What the page shows |
|---|---|
| Original decrypt | |
| Text after the flip | |
| Verdict line | |

## Explain

1. Which Compare cards warned about duplicate blocks? Using those cards' notes and the tab's **What to look for** section, explain why repeated 16-character input blocks came out as repeated ciphertext blocks there and not under the other modes.
2. Use the rule the targeted demo prints, `P₁[i] = AES⁻¹(C₁)[i] ⊕ C₀[i]`, to explain your CBC **Demo: Bit-Flip** result: what happened to plaintext block 0, what happened to plaintext block 1, and why. Then explain why the targeted demo changed a byte of C₀ in order to change `admin=0` in P₁.
3. The CTR tab describes encryption as XORing the plaintext with a keystream made from counter values. Use that description to explain the change you recorded for CTR, and how CTR's result compares with your CBC result.
4. Explain the GCM and CCM results you recorded. According to the page, what does each mode check before it releases plaintext, and what does that check cover?
5. Sort ECB, CBC, CTR, GCM and CCM into "confidentiality only" and "authenticated encryption", citing one entry from your tables for each mode. Did any mode in the first group also leak something in your Compare run, without anyone changing the ciphertext?

## Fix / Extend

1. **Fix.** You maintain a service that keeps `admin=0` inside an AES-CBC ciphertext with no MAC, as in the targeted demo. Using the page's **Which mode should I use?** list and the threat model on the **CBC** tab, name two changes the page supports. For each one, say how the CBC row of your second table would read afterwards, and why.
2. **Extend.** On the **CBC** tab, replace your test message with one shorter than 16 characters. Press **Encrypt with CBC**, then **Demo: Bit-Flip**, then **Decrypt (tampered ciphertext)**, and record what the page reports each time. Using which block your change landed in, explain why a one-block message behaves differently from your longer one. If the page reports an error, note what it calls that error; the next exhibit in this module builds on it.
3. **Extend.** On the **Compare** tab, change one character in just one copy of your repeated block and press **Encrypt under all 5 modes** again. Which ECB blocks still match each other? Using the threat model on the **ECB** tab, say what an attacker who sees only that ciphertext learns about your message.
