---
exhibit: protocol-checker
module: key-exchange
minutes: 20
outcomes: []
source_commit: 24c7e9c2dd01
checked: 2026-09-22
anchors:
  - "#proto-select"
  - "#run-btn"
  - "#fix-toggle"
  - "#lab-body"
  - "#search-status"
  - "#library-grid"
  - "label:How the search actually works (for the curious)"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. The attacker in this model owns the network: it intercepts messages and sends anything it can assemble from what it has seen, but it cannot guess a nonce and cannot open a ciphertext addressed to someone else. Honest A starts a Needham-Schroeder session with a party M that she has chosen to talk to, while honest B runs as responder. Predict whether M can end up holding `Nb`, the nonce B generated for a session B believes is with A. Say what you think M would have to do with the messages it intercepts.
2. Lowe's 1995 repair changes one field: message 2 goes from `{Na, Nb}_pkA` to `{Na, Nb, B}_pkA`. Predict which party's check fails first when the same relay is tried against the repaired protocol, and which field it fails on.
3. Now a raw Diffie-Hellman exchange: A and B send public shares with nothing binding a share to its sender, and A then sends a secret under the key she derives. Predict whether an attacker who never recovers anyone's exponent can read that secret, and what it would have to send in place of B's share. Then predict what changes when each share is signed by its sender.
4. The checker shows two indicators side by side, one labelled **Cryptographic primitive** and one labelled **Security verdict**. Predict what each of them reads after a run that finds an attack. Then predict whether the numbers in the status line will be the same for you and for a classmate running the same protocol.

## Do

1. Open the exhibit and go to the **Run the search** section. Before pressing anything, read the **Protocol** picker, the three numbered protocol messages below it, and the scenario-and-goal line under those. Write down the term the page names after "does the attacker learn", and which of the three message lines carries the tag `this message`. Read both indicators and fill the "before any run" column of the first table.
2. Open the disclosure **How the search actually works (for the curious)**. Read the paragraph listing what the attacker can do with what it holds, and the paragraph after it on the order the search explores in. Note the one rule the page calls the subtle one, and what that rule lets the attacker pass along.
3. Press **Run search**. Fill the second column of the first table, then read the status line and fill the Needham-Schroeder Public Key row of the second table.
4. Find the **Attack trace** panel and note how many messages the counter under the trace says the trace holds.
5. Under the trace, step back one message at a time until that counter reads `start`. In the **Attacker's knowledge** panel beside it, record the terms the attacker holds before any message and the rule shown on each, in the `start` row of the third table.
6. Step forward one message at a time. At each stop, record what the counter reads, the wire line the trace marks as current, the terms the knowledge panel highlights as new, and the rule shown on each of them. Stop when stepping forward no longer advances the counter.
7. Read the **One attacker, two conversations** panel and the sentence under it. Fill the Needham-Schroeder Public Key column of the fourth table.
8. Tick **Message 2 includes the responder's identity B**. Before pressing anything, note what happened to the verdict, the trace and the status line, and which message line now carries the tag `this message`. Then press **Run search** and fill the Needham-Schroeder-Lowe rows of the second and fifth tables, reading the fifth from the panel headed **The engine shows its work**.

> The disclosure in step 2 closes again whenever the checker redraws, which happens when you run a search, step the trace or tick a toggle. Read it before step 3, and reopen it if you want it later.

> In step 6 the highlight marks what is new at that step. At `start` nothing is highlighted, so that row records what the panel lists at all.

## Record

Everything here comes from your own run.

| Indicator | Before any run | After the Needham-Schroeder Public Key run |
|---|---|---|
| Cryptographic primitive | | |
| Security verdict | | |

| Protocol under test | Verdict | States explored | Injections weighed | Depth | Bound |
|---|---|---|---|---|---|
| Needham-Schroeder Public Key | | | | | |
| Needham-Schroeder-Lowe | | | | | |

| Stepper reads | Wire line marked current | Terms new at this step | Rule shown on each |
|---|---|---|---|
| `start` | | | |
| `message 1` | | | |
| `message 2` | | | |
| `message 3` | | | |
| `message 4` | | | |
| `message 5` | | | |

| What the diagram showed | Needham-Schroeder Public Key |
|---|---|
| Lane marked as deceived | |
| What that lane believes | |
| Who it is actually talking to | |
| Lane with no belief shown | |
| Last wire line of the trace | |

| Re-run after the fix | How the status line ends, in my own words | What the repair panel names |
|---|---|---|
| Needham-Schroeder-Lowe | | |

## Explain

1. The **Cryptographic primitive** indicator read the same thing before and after an attack was found. Using the note under that indicator and the panel at the top of the page, explain what the page is separating by carrying two indicators, and what a reader would lose if the page carried one.
2. From your third table: at which step did the goal term first appear, and what rule was shown on it? That rule takes two inputs. Name both of them from your own tables — one is a message in the trace, the other is a term the attacker held from the start — and explain why the page can call this a leak of protocol logic rather than a recovered key.
3. Compare the wire lines of messages 1 and 2, then of messages 3 and 4. One pair shares a body but changes recipient; the other pair is the same line twice. Using the rule list in the disclosure you read in step 2, say what the attacker did to produce each of those two messages, and which of the two needed it to open the message first. Two of your rows in the third table have nothing new in them: say which, what those messages have in common, and why the attack still needs them.
4. After the fix, the repair panel names a field the pattern requires and a different field the reply carries. Using those two, explain why the relay in your trace no longer reaches its recipient. The panel's last step makes a second claim, about a term the attacker cannot build for itself: state it in your own words and say why the first claim alone would not be enough.

## Fix / Extend

1. **Fix.** You are reviewing a handshake in which the reply to a challenge returns the challenge but does not name who is sending it. Using the two fields your repair panel named, state the change you would ask for and what a reviewer should be able to check once it lands. Then, using the honesty note at the top of the page and the bound in your second table, say what a `No attack in bound` result would and would not entitle that reviewer to claim.
2. **Extend.** In **Protocol**, choose `Diffie-Hellman key exchange — unauthenticated · signed`. Changing the protocol clears the fix and the verdict, so press **Run search** on a clean page. Write down, in the columns your second table uses, the verdict for Naive Diffie-Hellman together with its states explored, injections weighed, depth and bound. Then read the **One attacker, two conversations** panel and the sentence under it, and write down which lane is marked as deceived, what that lane believes, who it is actually talking to, which lane has no belief shown, and the last wire line of the trace. Compare all of it with your third prediction.
3. **Extend.** With Diffie-Hellman still selected, tick **Sign each Diffie-Hellman share** and press **Run search** again. Write down the verdict for Signed Diffie-Hellman and the same four numbers. Then, from the repair panel headed **The engine shows its work**, write down how the status line ends in your own words and what that panel names.
4. **Extend.** Naive Diffie-Hellman gave up its secret and Signed Diffie-Hellman did not, and the obstacle the repair panel names is a signature. Using what you wrote down for those two runs and the last wire line you noted, say what the signature binds and which threat it therefore addresses. Then, using the page's own note on perfect cryptography, name a way of attacking a Diffie-Hellman exchange that this checker's verdict says nothing about, and explain why its model cannot express it. Finally: in the naive run, one lane of **One attacker, two conversations** is marked as not having run. Using what **How the search actually works (for the curious)** says about the order the search explores in, explain why the attack did not need that party.
5. **Extend.** Compare your second table with a classmate's, row for row. Say which numbers matched and which did not. Then find each of the four protocols in the **Each protocol, its goal, its verdict** section and check the chip on its card against the verdict you recorded for it — in your second table for the two Needham-Schroeder protocols, and in the two Diffie-Hellman items above for the other two. Explain both results from the way the page describes how its search works.
6. **Extend.** In **Protocol**, choose `Kerberos (toy exchange) — ticket handshake`. Note what happens to **Run search**, what the checker shows in place of the schema and the indicators, and the reason the page gives for that entry being a link. Say why a checker that cannot search an entry is better off saying so than showing a verdict for it.
