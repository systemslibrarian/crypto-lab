---
exhibit: tls-handshake
module: key-exchange
minutes: 24
outcomes: [2, 3]
source_commit: dbbdc73da172
checked: 2026-09-22
anchors:
  - "#prevBtn"
  - "#nextBtn"
  - "#autoBtn"
  - "#resetBtn"
  - "#fault-none"
  - "#fault-ecdhe"
  - "#fault-transcript"
  - "#attack-reuse-cert"
  - "#attack-own-key"
  - "#attack-relay"
  - "#scope"
  - "label:Client-computed shared secret, 32 bytes"
  - "label:Server-computed shared secret, 32 bytes"
  - "label:Show one derivation in full — how server_handshake_traffic_secret is computed"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. A handshake signature, and a handshake MAC, are computed over a hash of the messages exchanged so far. Can that hash include the message that carries the signature itself? Say why, and then predict which run of messages the `CertificateVerify` signature is computed over.
2. Suppose one bit of the client's X25519 output is flipped, so the two sides run the key schedule from different secrets, and nothing else about the conversation is touched. Predict pass or fail for each of the four checks the exhibit reports: *ECDHE outputs agree*, *CertificateVerify verifies over the transcript the client hashed*, *client accepts the server Finished MAC*, *server accepts the client Finished MAC*. Write your predictions into the second table under Record.
3. Now suppose instead that an attacker alters one byte of `EncryptedExtensions` between server and client, and both sides still compute the same X25519 secret. Predict the same four checks again, in the same table. Then compare your two predictions and say which checks you expect to behave differently between them, and why.
4. An attacker sitting between client and server has three moves: replay the genuine certificate it copied off the wire and sign with a key it controls; mint its own root and leaf and sign correctly with that; or forward everything unchanged. For each move, predict whether the client accepts the handshake and whether the attacker ends up holding the session secret. Write these into the third table.

## Do

1. Open the exhibit and go to section 2, **Interactive Handshake Simulator**. Before pressing anything, read the step counter beside **Back** and **Step**, and note how many steps the walkthrough has.
2. Fill the first row of the first table from the detail card beside the ladder: the message name and the encryption badge in its heading, and the byte count on the **Flight** line under it. Then, under **Transcript so far**, record the run of messages named in the `SHA-256(...)` label and the first four characters of the hash beside it. Mark the last column if the page adds a line saying that this exact hash is what gets signed or MAC'd here.
3. Press **Step** and repeat for each remaining step, until the counter reaches the last one.
4. Without pressing any fault button yet, fill the whole **Honest session** column of the second table. The four verdicts are in the **Break this handshake** panel at the foot of section 2; the byte-match row is in section 3, **Key Exchange — X25519 (EC)DHE**, where the two cards each show a 32-byte secret with the bytes marked where the two agree; the chain row is in section 4, **Authentication — Certificates & Signatures**, and its four verdicts are read once, here, in this column only.
5. In **Break this handshake**, press **Break the ECDHE agreement**. Fill that column of the second table, including the line the panel prints naming what the injection did, and the sentence printed below the four verdicts.
6. Press **Flip a byte in flight** and fill the last column the same way.
7. Press **Honest session** to return the session to an unfaulted run.
8. In section 4, press **Reuse the server's certificate**. Fill that column of the third table from the result box that appears: its headline, the five checks it lists, whether the two transcript hashes it compares are called different or identical, what it says about forwarding the server's own `CertificateVerify`, and whether the certificate line above them calls the presented leaf the genuine server leaf.
9. Press **Sign with its own key**, then **Relay unchanged**, filling their columns the same way.

> There are other ways to move through the ladder: the left and right arrow keys do what **Step** and **Back** do, **Auto-play** walks the steps for you, and any message in the ladder can be clicked directly.

> Pressing a button in **Break this handshake** re-runs the whole handshake, so any attacker result box in section 4 disappears. That is why the tables above are filled in this order.

## Record

Everything here comes from your own run. In the second and third tables, write your prediction in each cell first, then the value you saw beside it.

| Step | Message name | Bytes on the wire | Encryption badge | Run of messages the chip names | First 4 hex of that hash | Called out as signed or MAC'd here? |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |
| 6 | | | | | | |
| 7 | | | | | | |
| 8 | | | | | | |

| What the page reports | Honest session | Break the ECDHE agreement | Flip a byte in flight |
|---|---|---|---|
| ECDHE outputs agree | | | |
| CertificateVerify verifies over the transcript the client hashed | | | |
| client accepts the server Finished MAC | | | |
| server accepts the client Finished MAC | | | |
| Section 3: any byte marked as differing between the two secrets | | | |
| Section 4, honest session only: root matches trust anchor, root self-signature valid, leaf signed by root, CertificateVerify signature valid | | | |
| The line naming what the injection did | | | |
| The sentence below the four verdicts, in your own words | | | |

| What the attacker panel reports | Reuse the server's certificate | Sign with its own key | Relay unchanged |
|---|---|---|---|
| Headline: blocked, or succeeded | | | |
| client completed ECDHE with the peer it saw | | | |
| presented chain validates under the client's trust anchor | | | |
| CertificateVerify verifies under the presented leaf key | | | |
| client accepts the handshake | | | |
| attacker ends up holding the session secret | | | |
| The two transcript hashes: different, or identical | | | |
| Forwarding the server's own CertificateVerify | | | |
| Is the presented leaf called the genuine server leaf? | | | |

## Explain

1. Two pairs of steps in your first table name the same run of messages and show the same hash. Name both pairs. Then, for the pair that includes `CertificateVerify`, use your answer to Predict 1 to explain why the signature is computed over the transcript that ends just before the message carrying it.
2. Compare your two fault columns. In one of them the `CertificateVerify` check held; in the other it did not. Say which column is which, then use what each check is computed over to explain both results, and name the check that caught the broken key agreement.
3. One of your two fault columns reports that the two sides still agreed on their X25519 secret, and that the `CertificateVerify` check failed anyway. Say which column that is, and use what the transcript hash covers to explain how one altered byte reached the signature check and both Finished MACs at once, while leaving the panel's remaining verdict, *ECDHE outputs agree*, untouched.
4. Which attacker move did the client accept? The panel's headline for that move still does not report a successful attack — say what the attacker ends up holding there, what it would have to change to hold more, and which rows of your third table would start to change if it did.

## Fix / Extend

1. **Fix.** A client is being written that validates the certificate chain and then treats "the chain validated" as "this handshake is safe". Using your **Reuse the server's certificate** column, say what that client would accept and what the attacker would be holding, and name the check it left out.
2. **Fix.** A second client checks the chain and the `CertificateVerify` signature but skips both Finished MACs. Using your second table, say which of the two faults it would still refuse and which it would accept, and describe what the two ends would be left holding in the case it accepts.
3. **Extend.** In section 5, open **Show one derivation in full — how server_handshake_traffic_secret is computed**. Record the parent secret it takes, the label it uses, and what its context value is a hash of. Say which of those three would read the same on a classmate's screen and which would not, and why.
4. **Extend.** Section 8, **Scope — What This Demo Does and Does Not Model**, states that the application-data record is the one that is actually AEAD-sealed here, and that messages badged with a handshake key are framed and computed for real but not separately encrypted. Using the badge column of your first table, say which rows that statement applies to, and what the badge is describing if it is not an encryption step this page performed.
5. **Extend.** Section 8 also states that chain validation here is three things: the root matches the trust anchor, the root self-signature verifies, and the leaf is signed by the root. Those are the first three of the four verdicts in your second table's section 4 row. List three checks the panel says a real client performs that are absent from this model, and say what a reader of your tables should therefore not conclude from those three verdicts passing.
6. **Extend.** Your second table records section 4's chain verdicts for the honest session only; take them back under each fault. In **Break this handshake**, press **Honest session** and read the four verdicts in section 4, **Authentication — Certificates & Signatures** — root matches trust anchor, root self-signature valid, leaf signed by root, CertificateVerify signature valid. Press **Break the ECDHE agreement** and read all four again, then **Flip a byte in flight** and read them a third time. Write down which verdicts changed under each fault and which did not, then say what the unchanged ones are computed over that neither injection touched, and which of the two faults reaches the signature check at all.
7. **Extend.** Two of the three attacker moves in section 4 are refused, and by different checks. Press **Reuse the server's certificate**, then **Sign with its own key**, and for each read the five checks in the result box together with the certificate line above them, which says whether the presented leaf is the genuine server leaf. Name the check that stopped each move, say what each of those checks binds the session to, and use that certificate line to explain why the two moves fail in different places.
8. **Extend.** With **Honest session** selected in **Break this handshake**, and before pressing anything else, write down the first four hex characters of five values: the leaf Ed25519 public key in section 4, the Early Secret and the Handshake Secret in section 5, the client-computed shared secret in section 3, and the ciphertext and GCM tag in section 6. Then press **New session**, which re-runs the handshake with fresh keys and returns the walkthrough to the first step, and read the same five again. Mark which of them changed. Two read the same afterwards, for two different reasons: give both, using what section 5 says about the Early Secret and what section 4 says about the leaf key.
