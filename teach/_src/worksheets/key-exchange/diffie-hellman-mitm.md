---
exhibit: diffie-hellman-mitm
module: key-exchange
minutes: 20
outcomes: [1]
source_commit: 8d69dbc7ae4f
checked: 2026-09-22
anchors:
  - "#passive"
  - "#p-preset"
  - "#p-a"
  - "#p-b"
  - "#p-run"
  - "#p-break"
  - "#p-toy"
  - "#p-out"
  - "#mitm"
  - "#m-preset"
  - "#m-a"
  - "#m-b"
  - "#m-m1"
  - "#m-m2"
  - "#m-run"
  - "#m-next"
  - "#m-all"
  - "#m-steplabel"
  - "#m-out"
  - "#i-msg"
  - "#i-edit"
  - "#i-send"
  - "#i-out"
  - "#fix"
  - "#f-clean"
  - "#f-tamper"
  - "#f-out"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. Eve records everything that crosses the wire: the modulus `p`, the generator `g`, Alice's public value `A` and Bob's public value `B`. To get the shared secret she has to recover a private exponent. The attack this exhibit runs costs roughly `√p` steps. Write down roughly how many steps that is for `p = 23`, and for a 2048-bit modulus, and say which of the two you expect a browser tab to finish.
2. Mallory can change messages in flight, not just read them. Predict whether she has to solve a discrete logarithm to end up reading Alice's messages. Then say how many secret keys exist once the exchange finishes, and who holds each one.
3. Take Eve and Mallory separately. For each, predict whether replacing `p = 23` with a 2048-bit modulus stops that attacker.
4. Alice signs her public value with a long-term identity key and Bob checks the signature before he uses the value. Predict what Bob's check does when the value that reaches him is not the value Alice signed, and whether he carries on with the exchange anyway.

## Do

The page is one scrollable lesson, not a set of tabs. Each step below names the part it happens in.

1. Open the exhibit and scroll to Part 2, **Eve is watching — and it doesn't help her**. Leave **Group parameters** on `Tiny — p = 23, g = 5` and leave **Alice secret a** and **Bob secret b** at the values you find. Press **Run exchange**, then fill the Tiny column of the first table from **On the wire (everything Eve sees)** and **Computed privately (never transmitted)**.
2. Press **Break it · recover a**. Fill the Tiny row of the third table: the exponent the panel says it recovered, the number of group operations, and the milliseconds it reports.
3. The same panel now prints a cost table. Copy its four rows into the second table, under the headings the page uses: **Preset**, **Size**, **BSGS cost ≈ √p** and **Status**.
4. Set **Group parameters** to `Small — p = 2357, g = 2`. The panel re-runs the exchange by itself and the exponent boxes refill with that preset's starting values. Press **Break it · recover a** and fill the Small row of the third table.
5. Set **Group parameters** to `Realistic — 2048-bit (RFC 3526 group 14)`. Fill the Realistic column of the first table — for long numbers write down what the panel shows you, including the digit count it prints. Then try to press **Break it · recover a**, record in the third table whether you can, and read the note in the banner just above the panel.
6. Scroll to Part 3, **Mallory in the middle**. Leave **Group parameters** on `Small — p = 2357, g = 2` and leave **Alice a**, **Bob b**, **Mallory ↔ Alice (m₁)** and **Mallory ↔ Bob (m₂)** at their starting values. Press **Run the attack**.
7. Press **Next** repeatedly, reading each line as it appears, until the step counter beside it reaches the last step; **Show all** jumps straight there. Fill the fourth table from the three party cards and from the numbered walkthrough lines, then write down the verdict line printed under the two key cards.
8. Keep or replace the text in **Alice's message** and **Mallory rewrites it to**, then press **Send through Mallory**. Fill the fifth table from the five numbered relay lines and the two cards underneath them.
9. Scroll to Part 4, **Sign the handshake**. Press **Run signed exchange (honest)** and fill the first row of the sixth table from **Transcript Bob verifies**, **Bob's verify()** and **Bob proceeds?**. Then press **Run signed exchange (Mallory tampers)** and fill the second row the same way, plus the status sentence in your own words.

> Copy the cost table in step 3 before you change the preset. Changing **Group parameters** repaints that panel with the exchange view, and the cost table comes back only after another **Break it · recover a**.

> Every break in steps 2 and 4 finishes in a moment; the **BSGS cost ≈ √p** rows you copied are the scale of each search. On the Realistic preset the page switches the button off instead of starting a search it cannot finish, so nothing you can press here will hang the tab.

> In step 7, if **Next** is greyed out, the walkthrough is already sitting at its last step. Press **Run the attack** to start it again from step 1.

> Part 4 signs a fixed exchange of its own — the same group and exponents Part 3 starts with. Run step 9 before you change any exponent in Part 3 if you want the two parts' numbers to line up.

## Record

Everything in these tables comes from your own run.

| What the panel shows | Tiny | Realistic |
|---|---|---|
| A = gᵃ mod p | | |
| B = gᵇ mod p | | |
| Alice: Bᵃ mod p | | |
| Bob: Aᵇ mod p | | |
| The status line under them | | |

| Preset | Size | BSGS cost ≈ √p | Status |
|---|---|---|---|
| Tiny | | | |
| Small | | | |
| Medium | | | |
| Realistic | | | |

| Preset | Could you press Break it? | Exponent the panel says it recovered | Group operations | Milliseconds |
|---|---|---|---|---|
| Tiny | | | | |
| Small | | | | |
| Realistic | | | | |

| Party | Value it sends | Value it receives | Key it computes |
|---|---|---|---|
| Alice | | | |
| Bob | | | |
| Mallory, facing Alice | | | |
| Mallory, facing Bob | | | |

| Relay line | What the page showed |
|---|---|
| What Mallory read | |
| What Mallory forwarded | |
| What Bob receives | |
| Bob reads Alice's original bytes directly? | |

| Signed run | The self value in Transcript Bob verifies | Bob's verify() | Bob proceeds? |
|---|---|---|---|
| Honest | | | |
| Mallory tampers | | | |

## Explain

1. Compare your group-operation counts for Tiny and Small with the **BSGS cost ≈ √p** column you copied. The panel says each extra bit of the modulus roughly doubles this attack's work while the exchange itself stays a few multiplications. Does your column agree? Using the Realistic row of the same table, say what running this attack there would cost.
2. Your first table shows the exchange still finished at production size; your fourth shows Mallory ending the run holding a key with each side, without pressing **Break it · recover a** at all. Using the page's note about what Mallory did *not* need, say what she needed instead, and whether running Part 3 on the Realistic group would have stopped her. Then name, for Eve and for Mallory separately, the defence this page offers against each, citing one row of your tables as evidence for each.
3. The second card in your fifth table asks whether Bob can read Alice's original bytes. Say what failed there and why, using what your fourth table recorded about Alice's key and Bob's key. What does the page say Alice and Bob ended up sharing with each other?
4. In your sixth table the two runs differ in exactly one field of the transcript Bob verifies. Name that field, and compare the tampered run's value with the value Alice receives in your fourth table. Then use the **Unauthenticated DH** and **Authenticated DH (signed)** columns to explain why Mallory cannot simply produce a signature over the transcript she wants Bob to see.

## Fix / Extend

1. **Fix.** A service you maintain does raw, unauthenticated Diffie–Hellman over a 2048-bit group, and the team proposes moving to a larger group. Using your sixth table and the page's **How real protocols authenticate DH** list, say what that move does and does not change, name the change the page proposes instead, and say which row of your sixth table the service's handshake would then resemble.
2. **Extend.** In Part 3, set **Alice a** and **Bob b** to the same number, and **Mallory ↔ Alice (m₁)** and **Mallory ↔ Bob (m₂)** to the same number as each other. Press **Run the attack**, then **Send through Mallory** again. Record the verdict line and the second card. The page attributes this outcome to the toy modulus; look at the four exponents you typed and at step 5 and step 6 of the walkthrough, and say what else about them explains it.
3. **Extend.** In Part 2, put your own number into **Alice secret a**. Before pressing anything, read the notice that appears at the top of the panel and write down which control it tells you to press. Then press **Break it · recover a** and compare your group-operation count with a classmate who typed a different number on the same preset. Which of the two numbers in your second table's row for that preset changed, and which did not? Say what that tells you about whether the cost column describes one particular search or the size of the space being searched.
4. **Extend.** In Part 2, set **Group parameters** to `Medium — p = 1000003, g = 2`. The panel re-runs the exchange by itself and the exponent boxes refill with that preset's starting values. Press **Break it · recover a** and write down three things: the exponent the panel says it recovered, the number of group operations, and the milliseconds it reports. Put that operation count beside the **BSGS cost ≈ √p** figure in the `Medium` row of your second table, and say whether the step up from `Small` to `Medium` moves the way that column predicts.
5. **Extend.** In Part 2, set **Group parameters** to `Tiny — p = 23, g = 5` and press **Break it · recover a**. Under the cost table the panel prints two paragraphs: the first warns against generalising that curve to real Diffie–Hellman and names a different algorithm for finite-field groups, the second is about many servers sharing one prime. From those two paragraphs: what sets the security level of the Realistic group, why does the page put that group at about 112 bits rather than at the exponent in its own cost table — the `Realistic` row of your second table — and what does the page say goes wrong when many servers share one prime?
