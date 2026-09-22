---
exhibit: downgrade-wire
module: key-exchange
minutes: 21
outcomes: [4, 5]
source_commit: 2de65778ff73
checked: 2026-09-22
anchors:
  - "#intro"
  - "#strip"
  - "#strip-play"
  - "#strip-reset"
  - "#strip-x25519mlkem768"
  - "#strip-x25519"
  - "#binding-unbound"
  - "#binding-bound"
  - "#policy-preferred"
  - "#policy-required"
  - "#strip-run"
  - "#strip-compare"
  - "#policy"
  - "#policy-run"
  - "#failopen"
  - "#retry-fail-open"
  - "#retry-fail-closed"
  - "#failopen-run"
  - "#sentinel"
  - "#sen-Serverwritesthesentinel"
  - "#sen-Clientchecksthesentinel"
  - "#scope"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. A client offers two key-exchange groups, a post-quantum hybrid first and a classical one second, and the server supports both. An attacker sitting on the wire deletes the hybrid entry from the client's list before the server reads it. Predict which group the server selects, and whether either endpoint has any way to notice the deletion at that moment. Write your prediction in the first table under Record.
2. Now suppose the handshake ends with each side computing a MAC over a hash of every handshake message it saw, and each side checking the other's. Predict, for the same deletion, whether the two MACs agree and what the connection does as a result. Write that prediction in the first table too.
3. The list entry for a group is two bytes on the wire. Predict whether deleting one entry changes two bytes of the handshake or many more, and say what else you think a client has to send for a group it is offering.
4. Two server settings: one takes the best group that survives the trip, the other refuses to finish a handshake without a post-quantum group. Two client reactions to a failed handshake: give up, or retry with a smaller offer. Predict which combinations still leave an on-path attacker with a downgrade it can use.

## Do

This exhibit is one long page of panels, not tabs. Scroll to the panel each step names.

1. Open the exhibit and read the panel **What is negotiation stripping?**. Note the one question it says decides whether a strip works.
2. Scroll to **Break it yourself: strip the offer**. Under **Client → ClientHello** read the two rows of **supported_groups (preference order)**: each row shows a group name, its codepoint and whether it is post-quantum or classical. Write both rows into the second table under Record.
3. Press **Play the downgrade**. When the results appear, record the line under **Server**, the **Cryptographic result**, the **Security verdict**, the session-key line, and the sentence printed just below the two indicators. These five go in the third table, one row per run.
4. Look at the **Transcript binding** control: it now shows **Unbound (pre-TLS-1.3 model)** selected, and the hybrid row has gone from the client's list. Press **Reset offer** to put the row back. Confirm **Server policy** is on **PQC preferred**, then select **TLS 1.3 (transcript-bound)**.
5. Press the strip button on the hybrid row, labelled **Strip X25519MLKEM768 from the ClientHello**, and watch the **On-path attacker** lane. Press **Run handshake** and record the same five things as in step 3.
6. Expand **Show the Finished MAC — compute both sides and compare**. Record, in the fourth table: the two byte counts in the deletion sentence, the hex on the two **1 · supported_groups on the wire** rows, the badge under **2 · Transcript-Hash**, and the badge under **3 · server Finished (verify_data)**.
7. Press **Reset offer**, then press **Run handshake** again with nothing stripped and **TLS 1.3 (transcript-bound)** still selected. Record the five things from step 3, then expand the Finished MAC panel again and fill in the second row of the fourth table.
8. Press **Compare unbound vs TLS 1.3** and record both cards in the fifth table. Scroll to **One config line: PQC preferred vs required**, press **Run the same strip under both policies**, and record both cards in the sixth table.
9. Scroll to **Downgrade by denial of service**. Leave **Retry without PQ (fail-open)** selected under **On handshake failure** and press **Run two rounds**; record both attempts and the line below them in the last table. Then select **Give up (fail-closed)**, press **Run two rounds** again, and record.

> Finish recording step 7 before you press **Compare unbound vs TLS 1.3**. Compare clears the results area, and the Finished MAC panel goes with it.

> The flying byte string between the lanes is decoration, and it is hidden from screen readers on purpose. Every number this worksheet asks for is in the text below it.

## Record

Everything below comes from your own run.

| Question | My prediction | What happened |
|---|---|---|
| Predict 1 — which group, and does anyone notice? | | |
| Predict 2 — do the MACs agree, and what does the connection do? | | |

| ClientHello row | Group name | Codepoint | Post-quantum or classical |
|---|---|---|---|
| First | | | |
| Second | | | |

| Run | Server line | Cryptographic result | Security verdict | Session-key line | The sentence below, in your own words |
|---|---|---|---|---|---|
| Play the downgrade | | | | | |
| Hybrid stripped, TLS 1.3 | | | | | |
| Nothing stripped, TLS 1.3 | | | | | |

| Finished MAC panel | Bytes deleted, and bytes of key_share | supported_groups the client sent | supported_groups the server received | Transcript-Hash badge | server Finished badge |
|---|---|---|---|---|---|
| Hybrid stripped, TLS 1.3 | | | | | |
| Nothing stripped, TLS 1.3 | | | | | |

| Compare card | Cryptographic result | Security verdict | What its note says, in your own words |
|---|---|---|---|
| Unbound (pre-TLS-1.3) | | | |
| TLS 1.3 (transcript-bound) | | | |

| Policy card | Cryptographic result | Security verdict | What its note says, in your own words |
|---|---|---|---|
| PQC preferred | | | |
| PQC required | | | |

| Retry policy | Attempt 1: label, offer, result | Attempt 2: label, offer, result | The line below the attempts |
|---|---|---|---|
| Retry without PQ (fail-open) | | | |
| Give up (fail-closed) | | | |

## Explain

1. Three of your rows in the third table differ in only two things: whether the hybrid group survived to the server, and which **Transcript binding** setting was selected. Using the page's two indicator names — **Cryptographic result** and **Security verdict** — explain why the run that completed is the one the page calls an alarm, and why the run that aborted is the one it calls a defense.
2. Compare your two rows in the fourth table. In one, the page said the attacker deleted nothing; in the other it reported a deletion much larger than the two bytes of a codepoint. Using the deletion sentence, say what else the attacker had to delete. Then read the note printed under the third stage and state the reason the page gives for the two MACs disagreeing — does that reason turn on how many bytes were deleted?
3. Walk the three stages the Finished MAC panel prints — **1 · supported_groups on the wire**, **2 · Transcript-Hash**, **3 · server Finished (verify_data)** — and say what changed at each stage in your stripped run and what carried the change from each stage to the next. Then find the **Simplified:** paragraph in **What is real, and what this does not prove**: where does it say a real TLS 1.3 stack usually notices the mismatch instead, and does that change whether the strip succeeds?
4. Both cards in the policy panel ran the same strip with transcript binding off. Say what each policy did with the weaker suite, and, using the paragraph printed below the two cards, name the cost the page attaches to **PQC required**.
5. In your fail-open run, attempt 2 completed and the note says every byte of it was validly bound. Explain why transcript binding did not stop that downgrade, and what the attacker had to be able to do for the retry path to work. Then compare your fail-closed run: what did the attacker come away with, and what did the client pay for that?

## Fix / Extend

1. **Fix.** A client team ships a stack that is "PQC preferred" on the server and retries without PQ when a handshake fails. Using your policy table and your fail-open table, say which of the two settings you would change first and why, and state what the page says each change costs. Say also which of the two settings transcript binding already protects them against, and which it does not.
2. **Extend.** Press **Reset offer**, leave **TLS 1.3 (transcript-bound)** selected, and this time press the strip button on the classical row, labelled **Strip x25519 from the ClientHello**. Press **Run handshake**, expand the Finished MAC panel and record which group the deletion sentence names and how many bytes it reports. Compare that byte count with the one from your hybrid strip and explain the difference, using what the client sends for each group.
3. **Extend.** Press **Reset offer**, set **Server policy** to **PQC required**, strip the hybrid row again, keep **TLS 1.3 (transcript-bound)** and press **Run handshake**. Record the **Cryptographic result** and the **Security verdict**, and compare them with the **PQC required** card in the policy panel. The two runs differ in one setting; say which check the page reports as the one that stopped the handshake in each, and what that tells you about the order the two checks run in.
4. **Extend.** Scroll to **The weaker cousin: the downgrade sentinel**. With both boxes ticked, record the line the panel prints. Untick **Client checks the sentinel** and record it again; re-tick that box, untick **Server writes the sentinel**, and record it a third time. Using the list under **Why it is weaker than transcript binding**, say which of the three reasons your two unticked runs demonstrated, and which one this panel cannot show you.
