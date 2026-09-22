---
exhibit: hybrid-wire
module: post-quantum
minutes: 20
outcomes: [4, 5]
source_commit: 5b7ae68ae3bc
checked: 2026-09-22
anchors:
  - "#tab-handshake"
  - "#next-step"
  - "#reset-handshake"
  - "#tab-threat"
  - "#tab-wires"
  - "#tab-why"
  - "#tab-deployed"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. This exhibit derives one session key from two 32-byte secrets: `session_key = HKDF-SHA-256(x25519_secret || mlkem_secret)`. In the exhibit, a wire being "broken" means an attacker has recovered that wire's 32-byte secret, not that the wire stopped carrying bytes. For each of the four rows in the first table under Record — both wires secure, X25519 broken, ML-KEM-768 broken, both broken — predict whether an attacker who is handed the broken wire's real secret, and who must guess anything still hidden, can re-derive the session key and open a record encrypted under it. Write your predictions in that table's prediction column.
2. Someone says a hybrid handshake is "twice as strong" because it runs two key exchanges. Write down what that phrase would have to mean to be true, and one sentence saying what you would claim instead.
3. One byte of the ML-KEM ciphertext is flipped in transit to Bob, who then decapsulates it. Predict what Bob ends up with — the same 32-byte post-quantum secret Alice encapsulated, or a different one — and what that does to the session key each side derives. Then predict whether a message Alice encrypted before the flip still decrypts for Bob afterwards.
4. The attacker in this exhibit gets a small, fixed number of tries: each try runs the real combiner over whatever the broken wires leaked plus a fresh random guess for whatever is still hidden, then tries the intercepted record with the key that comes out. If every try fails, write down what that does show and what it does not show.

## Do

1. Open the exhibit. It opens on the **Live handshake** tab, and its six phases have already run in your browser — the stepper reveals them one at a time, each with the time it took. Press **Next** until you reach step 6, reading each phase title as it becomes current. Between step 4 and step 5, watch the *Bob shared secret* line on the card headed *Purple wire — ML-KEM-768* change from `pending` to bytes: that is Bob decapsulating the ciphertext Alice encapsulated.
2. At step 6 the outcome cards, the combiner strip and the secure chat appear. Record *Total measured handshake time*, the heading of the card directly above the combiner strip (leave its icon out of what you write), and the first four hex characters shown under *Session key · 32 B*. Read the strip left to right first: *X25519 secret · 32 B*, then *ML-KEM secret · 32 B*, then the session key.
3. In the panel headed *Secure chat*, record the first four characters of *Alice fingerprint* and of *Bob fingerprint*, and what *Session state* reads. Leave the sender menu on Alice, type a short message into the message box, and press the send button beside it. On the message card that appears, press its decrypt button, then record the status pill on that card and what *Recipient view* shows.
4. In the same panel's button row, press the control that tampers with the session. Record the status line that appears at the foot of the page, and record *Alice fingerprint*, *Bob fingerprint* and *Session state* again.
5. Press the decrypt button on that same message card a second time. The message itself has not changed — only the session has. Record the status pill now, the *Verification note* on the card, and the status line at the foot of the page.
6. Open the **Threat model** tab and read the note headed *What "broken" means*. Leave both switches as they are and fill the first row of the first table: the verdict headline, which of the two input cells reads *known to attacker*, and the line beneath the verdict that begins *Measured this run*.
7. Use the first of the two switches, the one for the X25519 wire, to set that wire to broken, and fill that row the same way. Switch it back to secure, set the ML-KEM-768 wire to broken with the second switch, and fill that row. Finally set both to broken and fill the last row, including the plaintext the page prints for the record it opened.

## Record

Every value below comes from your own run.

| Wire state | My prediction | Verdict headline | Input cell marked known to attacker | Measured this run |
|---|---|---|---|---|
| Both wires secure | | | | |
| X25519 broken | | | | |
| ML-KEM-768 broken | | | | |
| Both broken | | | | |

> For the both-broken row, also write down the plaintext the page prints for the record it opened. For the *Measured this run* column, the phrase after "attacker:" is enough.

| Handshake outcome at step 6 | My run |
|---|---|
| Total measured handshake time | |
| Heading of the card above the combiner strip, without its icon | |
| Session key, first four hex characters | |

| Moment | Alice fingerprint, first four | Bob fingerprint, first four | Session state | Status pill on the message |
|---|---|---|---|---|
| After the handshake, before tampering | | | | |
| After tampering and the second decrypt | | | | |

| Line | What it said |
|---|---|
| Status line at the foot of the page, after you tampered | |
| Verification note on the message, after the second decrypt | |
| Status line at the foot of the page, after the second decrypt | |

## Explain

1. Look at your two single-break rows. In each one the attacker held one wire's real 32-byte secret and ran the same combiner the handshake ran. Using the note printed under the two input cells on the **Threat model** tab, and the measured line you recorded, explain why the key that came out did not open the record, and say how much of the combiner's input the attacker was still missing.
2. Your single-break rows report a number of derivations and that none of them opened the record; your both-broken row reports that the record decrypted and the key matched 32 of 32 bytes. Say what the page actually tested in each case. Then say what a run of failed derivations shows about that run, and what it does not show about X25519 or ML-KEM-768 themselves.
3. The compromised verdict ends with the sentence "Hybrid buys safety against either break alone." Using your four rows, say what that sentence claims and what it does not claim. Compare it with what you wrote for Predict 2: would you now describe this hybrid as twice as strong, and why?
4. The byte that was flipped was in the ML-KEM ciphertext, and nothing about the message you had already sent changed between your two decrypts. Using your fingerprints and *Session state*, say which side's session key moved and which did not, and explain why a key derived from both wires changed when one wire's secret did. Your *Verification note* blames the message's metadata; the status line blames the session keys. Which of the two does your own table support, and what in your record decides it?

## Fix / Extend

1. **Fix.** An engineer proposes dropping one wire to save the extra handshake bytes: one version keeps X25519 only, the other keeps ML-KEM-768 only. Using your own four rows, say what each version gives up and against which attacker in the table headed *Full threat matrix*, then state your recommendation in the form the exhibit's own verdicts use. At the foot of the page the exhibit says "Not production crypto — a teaching demo." Say what that note means for how far your recommendation can go.
2. **Fix.** Open the **Two wires** tab and read the HKDF combiner formula, then read the section "A Note on the Combiner" in the [demo's README](https://github.com/systemslibrarian/crypto-lab-hybrid-wire/blob/main/demos/hybrid-wire/README.md). Say what the combiner's inputs do tie the derived key to and what they do not, name where the README says that missing binding comes from in TLS 1.3, and write out the change the README prescribes for a protocol that has no outer transcript.
3. **Extend.** On the **Two wires** tab, open the aside headed "New to PQ crypto?" and use it to write, in two sentences, why the purple wire sends a packet back and the blue wire does not. Then press the benchmark control on that tab and record the ops/s reported for X25519, for ML-KEM-768 and for the hybrid, and the hybrid's overhead percentage. Compare that percentage with the byte figure the same tab gives for the overhead against pure X25519, and say which of the two a network engineer would care about more.
4. **Extend.** Open the **Why hybrid** tab and read the card headed "Twice as strong?" — No. Write its two-column comparison in your own words. Then name which of your four Record rows is the evidence for the model the card calls right, and say what a row would have had to show for the model it calls wrong to be the better description.
5. **Extend.** Back on the **Live handshake** tab, press **Reset**, step to 6 again and send nothing. Which values in your second Record table came out the same and which changed? For each, say what part of the handshake fixes it or lets it vary.
6. **Extend.** Open the **Deployed today** tab and pick two cards. For each, write its scheme line and where it says the hybrid is used. Then say which points in the "When to Use It" section of the repository [README](https://github.com/systemslibrarian/crypto-lab-hybrid-wire) your two cards illustrate, and which point in that section the cards on the tab do not illustrate.
