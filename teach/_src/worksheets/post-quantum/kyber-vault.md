---
exhibit: kyber-vault
module: post-quantum
minutes: 20
outcomes: [4]
source_commit: 3f80e2eaa9c9
checked: 2026-09-22
anchors:
  - "#tab-encaps"
  - "#variant-ml-kem-512"
  - "#variant-ml-kem-768"
  - "#variant-ml-kem-1024"
  - "#selected-profile-title"
  - "#prev-step"
  - "#next-step"
  - "#kem-status"
  - "#hybrid-message"
  - "#hybrid-encrypt"
  - "#hybrid-decrypt"
  - "#hybrid-tamper"
  - "#hybrid-status"
  - "#tab-params"
  - "#implementation-heading"
  - "#tab-how"
  - "label:Fujisaki-Okamoto (FO) transform"
  - "#tab-lattice"
  - "#model-boundary-heading"
  - "#solve-clean"
  - "#solve-noisy"
  - "#new-lwe"
  - "#tab-compare"
  - "#run-benchmark"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. In this exhibit Bob runs KeyGen, Alice runs Encaps, and Bob runs Decaps. Of Bob's private key, Bob's public key, the ciphertext and the shared secret, predict which one has to cross the wire for both sides to end up holding the same bytes, and which one never crosses it at all.
2. The exhibit calls this a key encapsulation mechanism rather than public-key encryption. Predict whether you will get to choose the secret Alice sends, and say what you think would have to be added before a sentence of your own could be sent.
3. A button labelled **Tamper with ML-KEM ciphertext** flips part of the ciphertext before Bob decapsulates. Predict what Bob's decapsulation does: report an error, hand Bob a different secret, or hand Bob the same secret. Then predict what happens when the message is decrypted.
4. Two people run the exhibit side by side and choose the same parameter set. Predict which of the values you are about to record will match theirs exactly and which will differ: the artifact sizes in bytes, the hex of the keys and secrets, the verdict sentence at the end of the run.

## Do

1. Open the exhibit. It opens on the **Encapsulate / Decapsulate** tab. Read **What is a KEM?** and the diagram beside it, which shows what travels across the wire and what does not.
2. In the row of parameter-set buttons below that card, press the one you want to run: **ML-KEM-512**, **ML-KEM-768** or **ML-KEM-1024**. Read the **Selected parameter set** card and fill in the first table under Record.
3. Press **Next** and record the status line printed under the stepper. Press **Next** again and record it. Press **Next** a third time and record it.
4. The run is now finished. In the **Artifacts** list, record the first eight hex digits shown for Public key, Private key, Ciphertext, Alice secret and Bob secret. Then find the card that has appeared under the stepper showing the two secrets byte by byte, and copy its verdict sentence and the caption printed below that verdict.
5. Scroll to **Full hybrid encryption (ML-KEM + AES-256-GCM)** and read its first sentence. Type a short sentence of your own into **Message to encrypt**, press **Encrypt message**, and record the status line together with the first eight characters shown for **ML-KEM ciphertext**.
6. Press **Decrypt message**. Record the status line and the line that begins **Decrypted plaintext**.
7. Press **Tamper with ML-KEM ciphertext**. Record the status line and the first eight characters of **ML-KEM ciphertext** again. Then press **Decrypt message** a second time and record the status line and the one-line message the page prints directly below it.
8. Open the **Parameter sets** tab and read the limits listed under **What exactly runs here**. Then open the **How LWE works** tab and, under **Jargon, unpacked**, expand **Fujisaki-Okamoto (FO) transform**.

> Choose your parameter set before step 3. Pressing a different one later clears the run: the status line asks for a fresh session and the artifacts go back to reading as not generated. Use **Prev** if you want to step back without changing the parameter set.

> After the third press in step 3 the button no longer reads **Next**. Pressing it again starts a new run and replaces the values you recorded in step 4.

## Record

Everything here comes from your own run.

| Parameter set I chose | NIST category | Public key (B) | Private key (B) | Ciphertext (B) | Shared secret (B) |
|---|---|---|---|---|---|
| | | | | | |

| Press | What the status line said |
|---|---|
| First **Next** | |
| Second **Next** | |
| Third **Next** | |

| From the finished run | What the page showed |
|---|---|
| Public key, first eight hex digits | |
| Private key, first eight hex digits | |
| Ciphertext, first eight hex digits | |
| Alice secret, first eight hex digits | |
| Bob secret, first eight hex digits | |
| Verdict sentence under the two byte rows | |
| Caption below that verdict | |

| Button pressed | Status line | ML-KEM ciphertext, first eight characters | Other line the page showed |
|---|---|---|---|
| Encrypt message | | | |
| Decrypt message | | | |
| Tamper with ML-KEM ciphertext | | | |
| Decrypt message, second time | | | |

## Explain

1. Your two secret rows hold the same bytes, and the caption you copied says what did and did not travel. Using the diagram on this tab, name what each side held that the other never received, and name the one artifact that crossed the wire. According to the card above the diagram, what does an eavesdropper who copies that artifact still need in order to obtain the secret?
2. The stepper never asked you for a message; the hybrid card did. Using that card's first sentence and the sizes in your first table, say what ML-KEM established, what encrypted the sentence you typed, and why the page says a KEM on its own does not encrypt data.
3. In step 7 the page reported a failure only after you pressed **Decrypt message**, and not at the moment you tampered. Using the **Fujisaki-Okamoto (FO) transform** entry you expanded, say what the page tells you decapsulation returns when its own check fails, and say which part of the flow — the KEM step or the AES-256-GCM step — produced the message you recorded.
4. Find the limit about peer authentication under **What exactly runs here**. Using it, and the KEM card's description of what Encaps takes as its input, say what your run did establish between the two sides and what it did not, and what that limit says a real protocol has to add.

## Fix / Extend

1. **Fix.** You are reviewing a design that copies this flow as it stands to protect one message to a server, taking the server's ML-KEM public key from a link in an email. Using the limits under **What exactly runs here** on the **Parameter sets** tab and the hybrid card's description of the flow, say which of those limits the design trips, what the page says has to be added, and which of three things — establishing a key, encrypting a message, authenticating the other party — the design would still be missing.
2. **Extend.** Back on the **Encapsulate / Decapsulate** tab, press each of the two parameter-set buttons you did not run — **ML-KEM-512**, **ML-KEM-768** or **ML-KEM-1024** — and for each one write down the NIST category and the public key, private key, ciphertext and shared-secret sizes from the **Selected parameter set** card. Then open the **Parameter sets** tab, read the three profile cards and the card headed **Category is a requirement, not a scoreboard**, and say which of those numbers grow with the category, which does not, and what the page says should decide the choice.
3. **Extend.** Open the **Lattice visualizer** tab and read the **Model boundary** card first: it says which part of this exhibit runs the published standard and which parts are small concept models. Then, under **Learning With Errors: the noise is the whole point**, press **Solve A·s = b₀ (clean)** and write down the vector the page recovers and the sentence it prints about it; press **Solve A·s = b (published noisy)** and write down the same two things. Press **New random instance** and repeat both solves twice more. Using the secret printed above those buttons, say what the noise did to exact elimination, and quote the panel's own sentence on what this does and does not show. If a solve reports that the random matrix was singular, press **New random instance** and try that solve again.
4. **Extend.** Open the **vs X25519 / RSA** tab. From **Fresh key-establishment wire cost**, write down the total key material for X25519 ephemeral ECDH, for the parameter set you ran, and for X25519 + ML-KEM-768, and note what the caption underneath says those totals leave out. Then press **Run benchmark** and write down the median times reported for your parameter set's KeyGen, Encaps and Decaps. Using the note printed under the benchmark, say what the page tells you those numbers do and do not support.
