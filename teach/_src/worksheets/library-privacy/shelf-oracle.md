---
exhibit: shelf-oracle
module: library-privacy
minutes: 30
outcomes: [2, 3, 5]
source_commit: 66c860a4a312
checked: 2026-09-22
anchors:
  - "#tab-shelf"
  - "#tab-server"
  - "#tab-fold"
  - "#tab-versus"
  - "#tab-noise"
  - "#tab-scope"
  - "#shelf-item-0"
  - "#shelf-record-size"
  - "#shelf-size"
  - "#run-seed"
  - "label:Pin this seed"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. In this design the catalog holds 64 records, and a patron's request is a list of 64 numbers: a 1 at the position of the book they want and a 0 at every other position. Each of the 64 numbers is encrypted separately before it is sent, so the catalog server receives 64 encrypted numbers and no position. If you were shown those 64 encrypted entries and told that exactly one of them hides the 1, how often would a guess be right? Write the fraction, and say whether you think staring at the encrypted bytes could beat it.
2. Encryption normally draws fresh random values for every single thing it encrypts. Predict what happens to those 64 encryptions if every one of them is made with the *same* random values instead: would the encryptions of 0 still look different from each other, and would the one encryption of 1 stand out?
3. Two ways to build a catalog that does not learn which book you asked for. One needs two separate operators who never compare notes. The other needs one operator and a hard mathematical problem. Predict which is cheaper to run — fewer bytes sent, less time spent — and which asks less of the people running it. Say which of the two assumptions you would rather a library depend on, and why.
4. Suppose the catalog genuinely never learns which book was requested. List three things that someone watching the network between the patron and the catalog could still write down.

## Do

> Pick your book first and then leave the settings alone. Choosing a different book, or changing **Record size** or **Shelf length**, throws away every measurement on the other tabs. The page does say which change did it, but you will have to run everything again.

> A tab you have not opened yet is empty until you open it, and opening one can take a moment. A single click on this page can be 64 encryptions.

1. Open the exhibit. It opens on **The Shelf**. Leave **Record size** at 512 bytes and **Shelf length** at 64 records for the whole worksheet.
2. Under *Pick a book*, press the button for one book on the shelf. Do this once, now. Write down the position number and the title. Then read the card headed *The record the protocol will return* and note that what comes back is the record itself, not a yes-or-no answer.
3. Open **The Server's View**. Under *What you send* the page draws your list of 64 numbers in the clear, then a grid of opaque tiles below it, one tile per shelf position, and a line reading "Pick a tile. Which one encrypts the 1?". Press the tile you think hides the 1. Record your guess, and what the page said, in the first row of the first table under Record.
4. Move to the card headed *Break it yourself*. It holds one switch, and directly under it a red panel that begins "Deliberately broken." Turn that switch on. The tiles above are redrawn. Look along their hex and record, in the second row of the first table, how many of them now look alike. Pick the odd one out, press it, and record that guess too.
5. Turn that switch back off, so the encryption goes back to the way the protocol actually works.
6. Still under *Break it yourself*, press the filled button whose label says how many trials it will run. It runs one crude attack twice over: once against encryptions made with fresh randomness and once against encryptions that reuse it. Wait for the two result boxes and fill in the second table from them, including the chance figure the page prints beside the first box. Then open the disclosure at the foot of that card and read its three paragraphs; you will need them in Explain.
7. Open **One Server vs Two**. In the card headed *Run both protocols over the same shelf*, press the filled button that runs both of them. Fill in the third table from the comparison table that appears, including which cell in each row carries the word "better".
8. In the same card, the page now says "The two-server scheme rests on one assumption. Press the red button to spend it." Press it. Record, in the fourth table, the shelf position it names beside the position you chose in step 2.
9. Open **What It Does Not Hide**. Under *What a network observer sees* the page says "The observer has seen nothing yet. Run a few queries — try different books." Do that: press the filled button — the one that queries a random book — three times. Record the three rows of the observer's log in the fifth table, and read the two boxes underneath it.
10. Still on that tab, read the table under *What is hidden, and by what* and copy the status and the "Where that comes from" cell for the four properties listed in the sixth table.

> In step 6 the trial button runs both columns whichever way the switch from step 4 is set. That switch changes only the tiles above it, which is why step 5 turns it off before the trials rather than after.

## Record

Every value in these tables comes from your own run.

| Encryption | Tile I picked | Right or wrong | Position the page said held the 1 | How many tiles looked alike |
|---|---|---|---|---|
| Fresh randomness, switch off | | | | |
| Randomness reused, switch on | | | | |

| Reading from the trial boxes | Value |
|---|---|
| Trials run | |
| Fresh randomness, number correct | |
| Fresh randomness, percent | |
| Reused randomness, number correct | |
| Reused randomness, percent | |
| The chance figure printed beside the fresh box | |

| Row on the comparison table | One server, RLWE | Two servers, XOR | Which cell is marked "better" |
|---|---|---|---|
| Servers required | | | |
| Trust assumption | | | |
| Privacy | | | |
| Upload per query | | | |
| Download per query | | | |
| Records touched | | | |
| Can the answer be wrong? | | | |

| Reading | Value |
|---|---|
| Shelf position I chose in step 2 | |
| Position the two servers named after comparing notes | |

| Query | At (ms) | Uploaded | Downloaded | Book (not observable) |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

| Property, as the page names it | Status | Where the page says that comes from |
|---|---|---|
| Which record was requested | | |
| That a query happened | | |
| When it happened | | |
| Who is asking | | |

## Explain

The lab's own [README](https://github.com/systemslibrarian/crypto-lab-shelf-oracle) states the threat model these questions work inside: an honest-but-curious server that follows the protocol and tries to learn the position from what it receives, and a passive network observer that sees traffic but no plaintext.

1. Your guess in step 3 was one tile out of 64, and the page told you straight away whether it was right. A single result like that cannot settle whether the encryption is doing its job, in either direction. Using the two counts in your second table, say what the repeated trials establish that one guess cannot, and say what the chance figure you recorded is the chance *of*.
2. Between your two guesses nothing about the attack changed: the same eyes, the same tiles, the same question. Using what you recorded in the first table and the three paragraphs in the disclosure you opened in step 6, explain what reusing one set of random values does to 64 encryptions of 0, and why that makes the single encryption of 1 findable by someone who has no key at all.
3. Look at your third table. The two-server column wins every row that is a cost. Name the two rows where it does not win, say in your own words why the page calls those two rows the same fact said twice, and say what the red button in step 8 did to the two-server column's advantage.

## Fix / Extend

1. **Fix.** A vendor offers your library a private catalog search and says the search service never learns which title a patron looked up. Using your third table and the card headed *Honest scope* on **What It Does Not Hide**, write the two questions you would put to that vendor before believing the sentence: one naming the assumption the claim rests on, and one naming the party who has to be trusted for it to hold. For each, say what answer would satisfy you and what answer would not, and say which of the two designs in your third table the vendor's answers would place them in.
2. **Extend.** Open **One Server vs Two** and, in the card headed *What the numbers do not say*, open the disclosure at the foot of that card. The second of its three paragraphs describes running two servers under genuinely separate control as "an organisational problem, not a technical one". A patron standing at a catalog terminal can see neither operator's records. Using that phrase and your fourth table, filled in step 8, say what such a patron could check for themselves about whether the two operators are staying apart, and what they would have to take on trust instead. Then open **What It Does Not Hide**, read the card headed *Honest scope*, and say what the one-server column asks you to believe in place of non-collusion, and what that card says this page does not prove.
3. **Extend.** Your observer log, recorded into the fifth table in step 9, has columns that came out identical across the three rows and a column that did not. Open **What It Does Not Hide** and go back to the card headed *What a network observer sees*; if its log is empty because the page was reloaded or a setting changed since, press the filled button — the one that queries a random book — three times again, so the two boxes under the log are on screen. Using your three recorded rows, those two boxes and the four properties in your sixth table, say which single fact about a patron's request this design keeps from a network observer, and list what it leaves that observer holding. Then pick one item from that list which a library could reduce by something other than encryption, and say what the page suggests would reduce it.
4. **Extend.** Open **Homomorphic Selection** and use the buttons in the card headed *The homomorphic inner product* to fold the records into the answer one at a time, then eight at a time, then the rest. Watch the running answer and the measured budget as you go. Before the record you chose has been reached, what does the page say the accumulator decrypts to — and why does the budget fall anyway? Use the page's own three-line account of why the sum does the selecting.
5. **Extend.** Back on **The Shelf**, in the card headed *This run*, type a string into **Run seed** and press **Pin this seed**. Read the warning the page then prints beside it. Get a classmate to pin the same string and pick the same shelf position, and compare your tiles on **The Server's View** with theirs. Then say, using that warning, why a real system must never let a run be pinned this way, and how this failure is related to the one you produced in step 4.
6. **Extend.** Do this one last, because it discards everything you measured. Open **Noise Exhaustion** and, in the card headed *Push it until it breaks*, lower the ciphertext modulus one step at a time, retrieving at each setting, until the page reports a failure code instead of your record. Record the code and the three figures the page reports with it. Then, using the note printed under those figures, say which of those three checks a real patron's own software could run for itself, and which it could not — and say why that distinction is the reason the page insists a deployment sizes its parameters in advance. The card headed *The failure codes* names the other three codes and what raises each.
