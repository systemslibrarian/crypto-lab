---
exhibit: nonce-collision
module: symmetric
minutes: 15
outcomes: [5]
source_commit: d23b6ec02c35
checked: 2026-09-22
anchors:
  - "#reuse-ctr"
  - "#run-ctr"
  - "#out-ctr"
  - "#reuse-cbc"
  - "#run-cbc"
  - "#out-cbc"
  - "#run-all-reuse"
  - "#out-gcm"
  - "#out-chacha"
  - "#cancel-gcm-btn"
  - "#cancel-gcm-run"
  - "#bits-32"
  - "#bits-96"
  - "#nonce-count"
  - "#nonce-prob"
  - "#nonce-5050"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. One key, one nonce, two messages. For each of AES-CTR, AES-GCM, ChaCha20-Poly1305 and AES-CBC (where the nonce is called an IV), predict what an attacker who sees only the ciphertexts, and the tags where there are tags, can gain: the plaintext, the ability to forge a tag, the fact that the two messages begin the same way, or the encryption key. Write your predictions in the first table under Record.
2. AES-CTR encrypts by XORing the plaintext with a keystream that depends only on the key and the nonce. Predict what C₁ ⊕ C₂ looks like when each message gets its own nonce, and when both share one. If you repeated the shared-nonce case with a brand-new key and a brand-new nonce, would C₁ ⊕ C₂ change?
3. Suppose nonce reuse lets an attacker recover the secret an AEAD tag is computed with, but not the key used to encrypt. Predict what that attacker can do to a message sent under the reused nonce, and to a message sent under a fresh one.
4. Two messages begin with the same text and are encrypted with AES-CBC. Predict whether any of their ciphertext blocks will be identical when each gets its own random IV, and when they share one IV.

## Do

1. Open the exhibit and scroll to **Same mistake, four outcomes**. Read the note on the two indicators: the cryptographic result is what the primitive returned, and the security verdict is whether the guarantee still holds.
2. On the **AES-CTR** card, make sure **Reuse the nonce** is off and press **Run**. The card encrypts two messages under fresh nonces and prints C₁ ⊕ C₂ as a lane of hex bytes. Record the first four bytes. Press **Run** again and record the first four bytes again.
3. On the **AES-CBC** card, make sure **Reuse the IV** is off and press **Run**. Record the number after *Shared leading ciphertext blocks*. Press **Run** again and record it again.
4. Press **Run all four — one reused nonce**. Every card switches to a reused nonce and runs.
5. On the **AES-GCM** card, record the cryptographic result, whether the recovered H *matches ground truth*, and the first eight hex digits of *recovered H*. On the **ChaCha20-Poly1305** card, record the cryptographic result, whether the one-time key *matches ground truth*, and the first eight hex digits of *recovered r*.
6. On the **ChaCha20-Poly1305** card, find the lane of hex bytes labelled C₁ ⊕ C₂ = P₁ ⊕ P₂. Count how many bytes at its start are 00, and note the first byte that is not. On the **AES-CTR** card, record the *as text* line: message 2, recovered by XORing message 1 back in. On the **AES-CBC** card, count the ciphertext block rows marked *identical*.
7. Press **Run all four — one reused nonce** a second time and record the same values again.

## Record

Values you record in the second, third and fourth tables come from your own run.

| Construction | My prediction | What the card computed, in your own words |
|---|---|---|
| AES-CTR | | |
| AES-GCM | | |
| ChaCha20-Poly1305 | | |
| AES-CBC | | |

| Fresh-nonce run | AES-CTR: first four bytes of C₁ ⊕ C₂ | AES-CBC: shared leading ciphertext blocks |
|---|---|---|
| First run | | |
| Second run | | |

| Reused-nonce run | Card | Cryptographic result | Matches ground truth | Recovered value, first eight hex digits |
|---|---|---|---|---|
| First run | AES-GCM | | | |
| First run | ChaCha20-Poly1305 | | | |
| Second run | AES-GCM | | | |
| Second run | ChaCha20-Poly1305 | | | |

| Reused-nonce run | AES-CTR: message 2 as recovered | ChaCha20-Poly1305: leading 00 bytes, then the first other byte | AES-CBC: block rows marked identical |
|---|---|---|---|
| First run | | | |
| Second run | | | |

## Explain

1. Did your recovered H and recovered r change between your two reused runs? The page says H is fixed by the key, and the one-time key (r, s) by the key and the nonce. What does your answer tell you about the key each run used? Now compare how the fresh AES-CTR lane and the reused ChaCha20-Poly1305 lane behaved across two runs (the consequence table lists keystream reuse for both), and explain the difference using C₁ ⊕ C₂ = P₁ ⊕ P₂. What do the 00 bytes at the start of the reused lane say about the two messages at those positions?
2. The AES-GCM and ChaCha20-Poly1305 verifiers both accepted a tag the attacker computed. Why does the page treat a VALID result here as an alarm rather than a success?
3. Name the secret each authenticated card recovered and the key the page says it did not recover. Using **Why the forgeries work — one cancellation, twice** and the consequence table, say what an attacker holding the recovered value can do under the reused nonce, and what the page says it cannot do to a message sent under a fresh nonce.
4. AES-CTR gave up message 2 but has no tag to forge. Using your AES-CBC block counts, explain what an attacker learns from identical leading CBC blocks and what the card says the attacker does not learn. Why does the page call CBC's failure weaker?

## Fix / Extend

1. **Fix.** A service encrypts with AES-GCM under one long-lived key. One engineer proposes random 96-bit nonces; another proposes a counter kept on a virtual machine that is sometimes restored from a snapshot. Using **Where a nonce actually repeats**, explain how each proposal could still repeat a nonce. Using **Fixes, and what this lab is not**, say which remedy the page offers against each risk, and what the page says AES-GCM-SIV would still leak if a nonce did repeat.
2. **Extend.** Under **Why the forgeries work — one cancellation, twice**, expand the AES-GCM derivation and press **Run it on real bytes and cancel**. Record whether each check line under the computed values passed. Press the button again (it now reads **Run it again with new keys**) and compare tag₁ and the recovered H with your first press. Which values changed, and which checks still held?
3. **Extend.** Under **Random 96-bit nonces and the birthday bound**, choose **32-bit** and move **Messages encrypted (log scale)** until the collision probability passes one half. Then choose **96-bit (GCM)** and read where the page puts a 50% chance. Compare that with the random-IV limit stated in the note below the readouts, and explain why the limit sits so far below the 50% point.
