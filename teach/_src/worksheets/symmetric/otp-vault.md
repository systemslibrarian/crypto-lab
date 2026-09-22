---
exhibit: otp-vault
module: symmetric
minutes: 20
outcomes: [2]
source_commit: 6b2bb1c14f73
checked: 2026-09-22
anchors:
  - "#ps-target"
  - "#ttp-reuse-key"
  - "#ttp-p1"
  - "#ttp-p2"
  - "#ttp-reroll-keys"
  - "#ttp-crib-word"
  - "#ttp-crib-target"
  - "#ttp-crib-offset"
  - "#ttp-nudge-left"
  - "#ttp-nudge-right"
  - "#ttp-pin"
  - "#ttp-undo"
  - "#ks-new-keystream"
  - "#import-challenge-easy"
  - "#import-challenge-medium"
  - "#import-challenge-hard"
  - "#import-challenge-control"
  - "#import-crib-word"
  - "#import-crib-target"
  - "#import-crib-offset"
  - "#import-nudge-left"
  - "#import-nudge-right"
  - "#import-pin"
  - "#import-reveal-truth"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. An attacker holds one 14-byte one-time-pad ciphertext and nothing else. You pick any 14-byte message. Predict whether some key turns that ciphertext into your message: for every message you could pick, for only some, or only for the message that was really sent. What would your answer mean for what the attacker can learn?
2. Two messages are encrypted with the same key: C1 = P1 ⊕ K and C2 = P2 ⊕ K. Write C1 ⊕ C2 and simplify it. Do the same when the second message has its own key, C2 = P2 ⊕ K₂. Which of your two results still contains a key?
3. One key is reused for both messages. A new random key is drawn and both messages are encrypted again with it. Predict which of C1, C2 and C1 ⊕ C2 will change. Then predict the same when each message has its own key and both keys are redrawn.
4. You guess that P1 contains the word "the " and slide that guess along C1 ⊕ C2, XORing it with the bytes underneath at each position. Predict what you will see where the guess is in the right place, and where it is not. How will you tell the two apart?

## Do

1. Open the exhibit and scroll to panel **2 · Perfect secrecy — every plaintext is possible**. Replace the text in **Target plaintext (must be 14 bytes)** with a 14-character message of your own, using only unaccented letters, digits and spaces. Record what the page shows. Then type a message of a different length and record what the page says.
2. Scroll to panel **3 · Two-time pad — the catastrophic key-reuse attack**. The key-reuse switch at the top of the panel starts switched on; leave it on and read the status line under the two ciphertexts. This panel shows both messages in **Message P1** and **Message P2**, so you can check every step. Record the first four hex bytes of **C1 = P1 ⊕ K** and of the combined strip **C1 ⊕ C2 (= P1 ⊕ P2 when key reused)**. Press **Re-roll session keys** and record both again.
3. Below the strip, the box under **Crib (guessed word — try " the ")** holds the crib "the ", the menu beside it reads **crib is a guess for P1**, and the strip's readout says offset 0. Read the line below the controls that says what P2 reads at this offset, then press **Pin crib here**. Record the pin and the count of bytes recovered under **Both plaintexts emerge together**.
4. Type a new crib into the crib box: a word or short phrase you expect in either message. Move it along the strip with the arrow buttons beside the crib box, one byte at a time, or drag the crib marker above the strip. At each offset, read what the other message would say there. When the revealed bytes read as real language, press **Pin crib here**. Pin at least two more cribs this way, with the menu set to **crib is a guess for P2** for at least one of them. If you pin a guess that turns out wrong, press **Undo pin**. When part of a word appears, you can type the whole word you think it belongs to as your next crib.
5. Turn the key-reuse switch off. Read the new status line, and look at **Reconstructed P2** where you pinned the first crib. Record what it shows now. Then record the first four bytes of **C1 = P1 ⊕ K** and of the combined strip, press **Re-roll session keys**, and record them again.
6. Scroll to panel **4 · Keystream reuse in real ciphers — the same break**. Record the first four bytes of **C1 = P1 ⊕ S** and of the combined strip. Press **New (still-reused) keystream** and record them again.
7. Scroll to panel **5 · Import two ciphertexts — cryptanalysis playground**. Under **Or load a challenge:** press **Easy · common words** and read the hint. This time the messages are hidden. Crib-drag as in step 4, using this panel's crib box, menu, arrow buttons and **Pin crib here**, until you have pinned at least two cribs that read as language. Then tick **Reveal original P1 & P2 (instructor aid)** and compare.
8. Untick the reveal box and press **Control · NO key reuse**. Check that the crib box and offset still hold a crib that worked on the Easy challenge (set them again if not), press **Pin crib here**, and record what the other message reads there. Tick the reveal box again and compare these originals with the Easy challenge's.

## Record

Every value below comes from your own run.

| Panel 2 target | Text I typed | What the page showed |
|---|---|---|
| Same length as the ciphertext | | |
| A different length | | |

| Moment | First four bytes of C1 (hex) | First four bytes of C1 ⊕ C2 (hex) |
|---|---|---|
| Panel 3, switch on, before Re-roll session keys | | |
| Panel 3, switch on, after Re-roll session keys | | |
| Panel 3, switch off, before Re-roll session keys | | |
| Panel 3, switch off, after Re-roll session keys | | |
| Panel 4, before New (still-reused) keystream | | |
| Panel 4, after New (still-reused) keystream | | |

| Panel 3 pin (switch on) | Crib, exactly as typed | Guess for P1 or P2 | Offset | What the other message read there | Bytes recovered, as the page counts them |
|---|---|---|---|---|---|
| First (the page's own crib) | | | | | |
| Second | | | | | |
| Third | | | | | |
| Fourth, if you had time | | | | | |

| Case | Crib and offset | What the other message read there | Reads as language? | Matches the real message? |
|---|---|---|---|---|
| Panel 3, switch off: your first pin, as it reads now | | | | |
| Easy · common words: first pin | | | | |
| Easy · common words: second pin | | | | |
| Control · NO key reuse: a crib that worked on Easy | | | | |

> For panel 3 the real messages are in **Message P1** and **Message P2**; for panel 5, use the reveal box.

## Explain

1. Panel 2 found a key for your own 14-byte message. Using the page's explanation under the target box, say what a single one-time-pad ciphertext tells an attacker and what it does not. Why did the page refuse your other message?
2. Use the second table. With the switch on, which values changed when you re-rolled the keys, and which stayed the same? With the switch off, what changed? Explain both with the equations in the two status lines you read in panel 3.
3. One pin filled bytes in both **Reconstructed P1** and **Reconstructed P2**. Starting from C1 ⊕ C2 = P1 ⊕ P2, explain why knowing a stretch of one message gives you the same stretch of the other. What does the page say this means for key reuse?
4. The page calls an offset where every revealed byte is printable "a plausible hit". How many of the plausible hits you saw were right, and what made you decide an offset was the right one? Then explain why a crib you knew was right revealed nothing readable with the switch off and in the Control challenge.
5. Panel 4 says its keystream S is a stand-in, not a ChaCha20 or AES implementation. Using the panel's own description of where a keystream comes from, explain how a repeated nonce leads to the same break as panel 3, and which part of that argument does not depend on how S was made. What did your panel 4 rows in the second table show?

## Fix / Extend

1. **Fix.** One team encrypts every message to a partner with the same one-time pad to save key material. Another encrypts with a stream cipher under one key and a fixed nonce. Using the README's rules for the one-time pad and panel 4's status line, state the rule each team breaks and what each must change.
2. **Fix.** Even when every key is used only once, the README names a property the one-time pad does not provide, and what an attacker who knows part of the plaintext can do as a result. Name both, and say what the README recommends instead for general-purpose encryption.
3. **Extend.** In panel 5, load **Medium · military-style** and then **Hard · unusual vocabulary**. Record which cribs each hint suggests and which ones worked. What made the hard challenge harder?
4. **Extend.** In panel 3, with the switch on, delete a few words from the end of **Message P1** so it is shorter than **Message P2**. Read the status line that appears, and explain which bytes of the longer message the attack can still reach.
