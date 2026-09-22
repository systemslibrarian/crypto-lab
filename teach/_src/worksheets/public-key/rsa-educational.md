---
exhibit: rsa-educational
module: public-key
minutes: 29
outcomes: [1, 2]
source_commit: ad0235d64da7
checked: 2026-09-22
anchors:
  - "#overview"
  - "#keygen"
  - "#kg-p"
  - "#kg-q"
  - "#kg-e"
  - "#kg-generate"
  - "#kg-random"
  - "#kg-weak"
  - "#encrypt"
  - "#ed-msg"
  - "#ed-math-toggle"
  - "#ed-e-tiny"
  - "#ed-e-real"
  - "#roundtrip"
  - "#rt-replay"
  - "#sign"
  - "#sv-msg"
  - "#sv-tamper"
  - "#breaks"
  - "#wb-factor"
  - "#wb-factor-2048"
  - "#realworld"
  - "#rw-run-oaep"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. You are about to build an RSA key from p = 257 and q = 263 with public exponent e = 17. Work out n and φ(n) on paper now and write both into the prediction column of the first table under Record. Then write down the equation the private exponent d has to satisfy. You are not expected to solve it yet.
2. Predict how many multiplications it takes to compute m^17 mod n if you simply multiply m by itself over and over. Then predict how many steps a method that repeatedly *squares* would need for e = 17, and how many it would need for e = 65537. Write all four numbers into the square-and-multiply table.
3. The same short message is encrypted twice to the same public key, with no padding. Predict whether the two ciphertexts come out equal, and say what someone watching the wire learns either way. Then: an attacker with no private key takes two ciphertexts, multiplies them together modulo n, and hands the product to the key's owner. Predict what the owner's decryption produces.
4. A key is published whose modulus n fits in 17 bits. Predict how long a browser tab needs to recover p and q from it, and say what the attacker can compute once it has them.

## Do

The exhibit is one page of numbered sections, not tabs. Work top to bottom.

1. Open the exhibit and go to **2 · Generate a key, step by step**. The page has already built a key before you touch anything. Check that **Prime p** reads 257, **Prime q** reads 263 and **Exponent e** reads 17; if any of them differs, type the two primes first, choose **Exponent e** last, and press **Generate**. Record the seven rows of the derivation, and the note printed beside each one, in the first table.
2. Check that Section 2's status line reads the valid-keypair message before going on — the sections below are built from the key generated here.
3. Go to **3 · Encrypt & decrypt** and leave **Message (short)** reading `Hi`. Record the three value rows, the two character codes shown under the sentence beginning "How text becomes a number", and the warning line under the heading.
4. Add one character to the end of **Message (short)** so the box reads `Hii`. Record what the status line says. Then delete that character so the box reads `Hi` again.
5. Now open **Show the encryption math (square-and-multiply)**. Record the "squarings + multiplies" line while **Tiny exponent (e = 3)** is the selected button, then press **Real key exponent (e = 17)** and record that line as well. The number printed in that button is the e your own key uses.
6. Go to **3½ · The round trip, in one picture**. Record the five boxes across the flow — their small top labels read `text`, `encode`, `ciphertext`, `recovered` and `decode` — and then the two equation lines beside the clock. Press **Replay the round trip**; the legend beside the ring names the two hops, so note which of them is drawn first, or note that both appear at once.
7. Go to **4 · Sign & verify** and leave **Message to sign** as it is. Record the four rows and the verdict line in the "tamper off" column of the sign-and-verify table. Now tick **Tamper with the message after signing** and record the same four rows and the verdict in the "tamper on" column. Untick it again.
8. Go to **5 · What breaks at scale**. Read the line under the "Your key" heading and record the bit length it reports. Press **Factor it!** and record the time in the alarm line, the recovered primes, the reconstructed d, the "Anyone can now decrypt" row, and the strategy-and-iterations sentence. On the other card, record the state of **Factor it (infeasible)** and what that card's last sentence says about where its cost figure comes from.
9. Go to **6 · Why real RSA adds padding**. Record the two textbook ciphertext rows and the verdict under them. Press **Run the real OAEP comparison** — it builds a 2048-bit key first, so give it a few seconds — and record the first eight characters of each of its two rows, plus its verdict. Finally record the four rows under **A second reason: textbook RSA is malleable** and the verdict beneath them.

> Editing **Prime p** or **Prime q** rebuilds the **Exponent e** list, so choose e last. While p and q are not two different primes, that list is empty.

> Everything below Section 2 is rebuilt when you press **Generate** or **Roll random primes**, and the math disclosure in Section 3 closes again whenever you edit **Message (short)**. Open it after you have finished typing, as step 5 does.

> If Section 2 shows a warning instead of the valid-keypair message, no new derivation is on screen. Set two different primes, choose an exponent, and press **Generate** before continuing.

## Record

Everything here comes from your own run.

| Derivation row in Section 2 | My prediction (Predict 1) | Value the page showed | Note printed beside it |
|---|---|---|---|
| p (prime) | | | |
| q (prime) | | | |
| n = p · q | | | |
| φ(n) = (p − 1)(q − 1) | | | |
| e (public exponent) | | | |
| d = e⁻¹ mod φ | | | |
| check: e · d mod φ | | | |

| Section 3 | What I recorded |
|---|---|
| Message → integer m | |
| The two character codes shown for `H` and `i` | |
| Ciphertext c = m^e mod n | |
| Decrypted c^d mod n | |
| Warning line under the heading | |
| Status line when the box read `Hii` | |

The first row below has no value from the page; it is your own estimate from Predict 2. Fill the last row in Fix / Extend 6.

| Square-and-multiply trace | My prediction: number of steps | The line the page printed |
|---|---|---|
| Repeated multiplication, no squaring, e = 17 | | |
| Tiny exponent (e = 3) | | |
| Real key exponent (e = 17) | | |
| Real key exponent after Roll random primes | | |

| Section 3½ | What I recorded |
|---|---|
| `text` box | |
| `encode` box | |
| `ciphertext` box | |
| `recovered` box | |
| `decode` box | |
| The e · d line | |
| The line writing that product as a multiple of φ | |
| Which hop was drawn first | |

| Section 4 row | Tamper off | Tamper on |
|---|---|---|
| H(message) signed | | |
| Signature s | | |
| Delivered message verifier sees | | |
| Recovered s^e mod n vs fresh H(m) | | |
| Verdict line | | |

| Section 5 | What I recorded |
|---|---|
| Bit length the card reports for my key | |
| Time in the alarm line | |
| Recovered primes p, q | |
| Reconstructed private d | |
| Anyone can now decrypt | |
| Strategy and iterations | |
| Does that d match the d in the first table? | |
| State of Factor it (infeasible) | |
| What the card says about where its cost figure comes from | |

| Section 6 | What I recorded |
|---|---|
| Textbook: encrypt once | |
| Textbook: encrypt again | |
| Textbook verdict line | |
| OAEP: encrypt once, first eight characters | |
| OAEP: encrypt again, first eight characters | |
| OAEP verdict line | |
| a, and Enc(a) | |
| b, and Enc(b) | |
| Enc(a)·Enc(b) mod n | |
| That decrypts to | |
| Verdict line | |

## Explain

1. Look at your `d = e⁻¹ mod φ` and `check: e · d mod φ` rows, and at the aside headed **WHAT IS φ?**. In its wording, say what φ(n) counts, why (p − 1)(q − 1) is that count when n = p · q, and why d is inverted modulo φ rather than modulo n. Then say which of your seven rows someone holding only n and e cannot fill in.
2. Copy your two equation lines from the Section 3½ table and check the arithmetic yourself. Using the paragraph printed beside them, explain why raising to d undoes raising to e. That paragraph closes with a smaller note about gcd(m, n) = 1: say what it states is needed to cover every m below n, and which two named results it says do that work.
3. Section 5 reconstructed a private exponent without being given one. Using your strategy-and-iterations sentence, say what that attack had to search through, and compare its reconstructed d with the d in your first table. Then, using the two panels in **1 · The big idea: a trapdoor** and the last sentence on the 2048-bit card, say what the page claims is different about a 2048-bit modulus, and what it says it did *not* do to arrive at that figure.
4. The signature row did not change when you ticked the tamper box, but the verdict did. Using the "Recovered s^e mod n vs fresh H(m)" row, say which of those two values changed and why, and what the verifier had to know in order to compute each of them. Then quote the reason the warning under the Section 4 heading gives for calling these signatures forgeable.
5. Name the two properties of textbook RSA that Section 6 demonstrates, and point to the recorded row that is your evidence for each. Compare the textbook ciphertext you recorded in Section 6 with the one you recorded in Section 3: are they the same number, and why? Then say what changed in the OAEP rows, and what the sentence under the malleability rows claims OAEP's padding does to a product of ciphertexts.

## Fix / Extend

1. **Fix.** A service generates RSA keys by drawing p and q from a short list of small primes, much like the values suggested in **Prime p** and **Prime q** here. Using your Section 5 row — the time, the iteration count and the recovered primes — and the two cards in that section, name the change the page supports, and say which of your recorded Section 5 values would read differently afterwards, and why.
2. **Fix.** A product encrypts short, fixed-format tokens with textbook RSA and stores the ciphertexts. Using your Section 6 rows, say what someone who sees only the stored ciphertexts can work out. The closing line of Section 6 names one padding scheme for encryption and another for signatures: name both, and say which of your Section 6 rows would read differently under the encryption one.
3. **Extend.** In **3 · Encrypt & decrypt**, open **Show the encryption math (square-and-multiply)** again, and put the two lines you recorded in the square-and-multiply table beside each other. For each line, is the total the page prints smaller or larger than the number it prints after "not"? Use the per-bit rows under each trace — one row per exponent bit, each marked as a multiply or a skip — to say where every multiply came from, and what has to be true of an exponent before this method saves work.
4. **Extend.** In **2 · Generate a key, step by step**, press **Roll random primes**. The page draws two fresh primes and rebuilds the derivation from them, so write down the **Prime p**, **Prime q** and **Exponent e** it now shows, together with the trace rows for n, φ(n) and d. Those numbers are yours alone: they will not match your neighbour's. Then put the class key back: type 257 into **Prime p** and 263 into **Prime q**, choose 17 in **Exponent e**, and press **Generate**.
5. **Extend.** Still in Section 2, press **Try a too-small / repeated prime**. Write down what the status line says and where the link inside it points. Then type 9 into **Prime p**, press **Generate**, and write down that message too; note that no derivation is left on screen either time. Put the class key back when you are done — 257 in **Prime p**, 263 in **Prime q**, 17 in **Exponent e**, then **Generate**.
6. **Extend.** Press **Roll random primes** again. In Section 3, open **Show the encryption math (square-and-multiply)** and press the second of the two exponent buttons — the one that read **Real key exponent (e = 17)** on the class key, and that now carries your new key's exponent instead. Record that line in the last row of the square-and-multiply table and compare it with the other two. Then press **Factor it!** again and compare the time, the iteration count and the bit length the card now reports with your first run.
7. **Extend.** In Section 2 set **Prime p** to 11 and **Prime q** to 13, take whichever value **Exponent e** offers first, and press **Generate**. Record what Section 3's status line now says, what the `text` and `decode` boxes of the Section 3½ flow show, and — after pressing **Run the real OAEP comparison** again — what each of the two blocks in Section 6 says it encrypted. Say which message each part of the page fell back to, and whether the two halves of the Section 6 comparison are still encrypting the same thing. Put the class key back when you are done.
