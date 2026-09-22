---
exhibit: otp-vault
module: symmetric
minutes: 19
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
2. Scroll to panel **3 · Two-time pad — the catastrophic key-reuse attack**. The key-reuse switch at the top of the panel starts switched on; leave it on and read the status line under the two ciphertexts. This panel shows both messages in **Message P1** and **Message P2**, so you can check every step. Record the first four hex bytes of **C1 = P1 ⊕ K** and of the combined strip **C1 ⊕ C2 (= P1 ⊕ P2 when key reused)**. Press **Re-roll session keys** and record which of the two changed, rather than copying the new digits.
3. Below the strip, the box under **Crib (guessed word — try " the ")** holds the crib "the ", the menu beside it reads **crib is a guess for P1**, and the strip's readout says offset 0. Read the line below the controls that says what P2 reads at this offset, then press **Pin crib here**. Record the pin and the count of bytes recovered under **Both plaintexts emerge together**.
4. Type a crib of your own into the crib box: a word or short phrase you expect in either message. Set the menu beside the box to **crib is a guess for P2**. Move the crib along the strip with the arrow buttons beside the crib box, one byte at a time, or drag the crib marker above the strip. At each offset, read what the other message would say there. When the revealed bytes read as real language, press **Pin crib here**. If you pin a guess that turns out wrong, press **Undo pin** and keep moving. When part of a word appears, you can type the whole word you think it belongs to as your next crib.
5. Turn the key-reuse switch off. Read the new status line, and look at **Reconstructed P2** where you pinned the first crib. Record what it shows now. Then record the first four bytes of **C1 = P1 ⊕ K** and of the combined strip, press **Re-roll session keys**, and record which of the two changed.
6. Scroll to panel **4 · Keystream reuse in real ciphers — the same break**. Record the first four bytes of **C1 = P1 ⊕ S** and of the combined strip. Press **New (still-reused) keystream** and record which of the two changed.

## Record

Every value below comes from your own run.

| Panel 2 target | Text I typed | What the page showed |
|---|---|---|
| Same length as the ciphertext | | |
| A different length | | |

| Moment | First four bytes of C1 (hex) | First four bytes of C1 ⊕ C2 (hex) | Which of the two changed when new key material was drawn |
|---|---|---|---|
| Panel 3, key-reuse switch on | | | |
| Panel 3, key-reuse switch off | | | |
| Panel 4, keystream reused | | | |

| Panel 3 pin (switch on) | Crib, exactly as typed | Guess for P1 or P2 | Offset | What the other message read there | Bytes recovered, as the page counts them |
|---|---|---|---|---|---|
| First (the page's own crib) | | | | | |
| Second (a crib of your own) | | | | | |

| Case | Crib and offset | What the other message read there | Reads as language? | Matches the real message? |
|---|---|---|---|---|
| Panel 3, switch off: your first pin, as it reads now | | | | |

> The real messages are in **Message P1** and **Message P2**, so you can check every pin against them.

## Explain

1. Panel 2 found a key for your own 14-byte message. Using the page's explanation under the target box, say what a single one-time-pad ciphertext tells an attacker and what it does not. Why did the page refuse your other message?
2. Use the second table. With the switch on, which values changed when you re-rolled the keys, and which stayed the same? With the switch off, what changed? Explain both with the equations in the two status lines you read in panel 3.
3. One pin filled bytes in both **Reconstructed P1** and **Reconstructed P2**. Starting from C1 ⊕ C2 = P1 ⊕ P2, explain why knowing a stretch of one message gives you the same stretch of the other. What does the page say this means for key reuse?
4. The page calls an offset where every revealed byte is printable "a plausible hit". How many of the plausible hits you saw were right, and what made you decide an offset was the right one? Then explain why a crib you knew was right revealed nothing readable once you turned the switch off.
5. Panel 4 says its keystream S is a stand-in, not a ChaCha20 or AES implementation. Using the panel's own description of where a keystream comes from, explain how a repeated nonce leads to the same break as panel 3, and which part of that argument does not depend on how S was made. What did your panel 4 row in the second table show?

## Fix / Extend

1. **Fix.** One team encrypts every message to a partner with the same one-time pad to save key material. Another encrypts with a stream cipher under one key and a fixed nonce. Using the README's rules for the one-time pad and panel 4's status line, state the rule each team breaks and what each must change.
2. **Fix.** Even when every key is used only once, the README names a property the one-time pad does not provide, and what an attacker who knows part of the plaintext can do as a result. Name both, and say what the README recommends instead for general-purpose encryption.
3. **Extend.** Open the exhibit at panel **3 · Two-time pad — the catastrophic key-reuse attack** and leave the key-reuse switch on. Pin two more cribs of your own, beyond the one you pinned in class: type each into the crib box, move it with the arrow buttons beside the box or by dragging the crib marker above the strip, and press **Pin crib here** when the revealed bytes read as real language. Set the menu beside the crib box to **crib is a guess for P1** for one of them and **crib is a guess for P2** for the other. For each, write down the crib exactly as you typed it, which message you guessed it for, the offset the strip's readout gives, what the other message read there, and the count under **Both plaintexts emerge together**. Then say whether that count rose by the length of each crib, and if it did not, what else it is counting.
4. **Extend.** Under Record you wrote only which of the two strips changed when new key material was drawn. Go back and take the digits. In panel **3**, with the key-reuse switch on, write the first four bytes of **C1 = P1 ⊕ K** and of the combined strip **C1 ⊕ C2 (= P1 ⊕ P2 when key reused)**, press **Re-roll session keys**, and write both again. Repeat with the switch off. Then do the same in panel **4 · Keystream reuse in real ciphers — the same break**, using **C1 = P1 ⊕ S** and pressing **New (still-reused) keystream**. Compare the before and after digits byte by byte at each of the three moments. Say which comparison comes out identical byte for byte, which does not, and what that tells you about which of the two strips carries key material.
5. **Extend.** Open the exhibit at panel **5 · Import two ciphertexts — cryptanalysis playground** and press **Easy · common words** under **Or load a challenge:**. Read the hint. Both messages are hidden here, so you cannot read a crib off the page first: this is the panel 3 attack without the answer key beside it. Type a crib into this panel's crib box, use the menu beside it to say whether the crib guesses for P1 or P2, and move it with this panel's arrow buttons, watching the offset readout and the bytes the other message would show at each position. Press **Pin crib here** when they read as language, and pin at least two cribs this way. For each pin write down the crib and its offset, what the other message read there, and whether you judged it real language. Then tick **Reveal original P1 & P2 (instructor aid)** and add, for each pin, whether it matched the real message. Note also how many offsets the page called a plausible hit before you reached one that was.
6. **Extend.** Straight after the Easy challenge, untick **Reveal original P1 & P2 (instructor aid)** and press **Control · NO key reuse**. Check that this panel's crib box and offset readout still hold a crib that worked on Easy, and set them again if loading the challenge cleared them. Press **Pin crib here**, and write down the crib and offset, what the other message reads there, and whether it reads as language. Tick the reveal box again and compare these originals with the ones you revealed on Easy. Then say why a crib that was right a minute earlier recovers nothing here, naming what the two challenges do differently.
7. **Extend.** In panel 5, load **Medium · military-style** and then **Hard · unusual vocabulary**. Record which cribs each hint suggests and which ones worked. What made the hard challenge harder?
8. **Extend.** In panel 3, with the switch on, delete a few words from the end of **Message P1** so it is shorter than **Message P2**. Read the status line that appears, and explain which bytes of the longer message the attack can still reach.
