---
exhibit: blind-relay
module: library-privacy
minutes: 20
outcomes: [1, 2, 3, 5]
source_commit: 9de776c3565d
checked: 2026-09-22
anchors:
  - "#pipe-h"
  - "#query-input"
  - "#method-select"
  - "#run-btn"
  - "#next-btn"
  - "#all-btn"
  - "#step-status"
  - "#parties"
  - "#collude-h"
  - "#collude-switch"
  - "#collude-out"
  - "#corr-h"
  - "#crowd-btn"
  - "#crowd-pad"
  - "#crowd-join"
  - "#crowd-join-time"
  - "#crowd-out"
  - "label:What padding does and does not fix"
  - "#break-h"
  - "#attack-wrongkey"
  - "#attack-tamper"
  - "#attack-leak"
  - "#attack-out"
  - "#cmp-h"
  - "#honesty-h"
---

## Predict

Answer these before class, before you open the exhibit. This section is reading and writing you do away from the lab; the lab time on this sheet starts at **Do**. There are no penalties for wrong predictions; the point is to compare them with what you see. No mathematics is needed for any question on this sheet.

1. A patron searches through a service run by two operators: a **relay**, which receives the request from the patron's computer and passes it on, and a **gateway**, which opens the request and asks the catalog. For each operator, predict which of these it learns — the patron's network address, the words of the search, both, or neither. Write one line for the relay and one for the gateway.
2. Each operator keeps the ordinary records its job produces: the relay a list of addresses and arrival times, the gateway a list of searches and arrival times. Predict what the two could work out together that neither could work out alone, and whether they would have to break any encryption to do it.
3. Four patrons search at almost the same moment through that same pair of operators. Nobody decrypts anything, and the two operators never speak to each other — someone simply obtains both sets of records later. Predict whether that person could tell which patron sent which search, and name what in the records they would use.
4. A vendor tells your library: "patron searches are encrypted end to end, so we cannot see who searched for what." Predict what has to be true — about organizations, not about mathematics — for that sentence to hold, and say whether a patron's own computer could check it.

## Do

1. In the panel **The knowledge split, live**, the box labelled **Your sensitive input (query, or note body for POST)** already holds a query. Replace it with a query you invent for this exercise. Do not type a real search of your own, a real name, or anything else about yourself: the panel asks you to make one up, and whatever you type is displayed in full further down the page and printed again in the collusion step below. Leave the two menus beside the box as they are, and press **Run the exchange**.
2. Press **Jump to end**, which fills every card at once. (Walking the exchange one step at a time, with the status line under those buttons, is an Extend item in the last section; you do not need it to fill the tables below.) Then read the four party cards — Client, Relay, Gateway, Target — and fill in the first Record table in the page's own words. Copy the Client card's "cannot know" line and the reason under it exactly; you will need it twice — in Explain question 3, and again in Fix / Extend. Finally, copy the value the Relay card shows beside `timing + sizes` into the second table.
3. Go to the panel **The collusion toggle** and read the paragraph under the heading before you touch anything. Record what the **Cryptographic result** box and the **Privacy verdict** box say now. Press **Relay and gateway compare notes**, and record both boxes again, plus the three lines of the joined log (**WHO**, **WHAT**, **JOINED ON**). Press the same control a second time to switch it back, and record both boxes once more.
4. Go to the panel **Correlation without collusion**. Leave **Pad every request to 256 bytes (RFC 9292 §3.8)** unticked and press **Simulate 4 clients at once**. Read the two logs side by side before you join anything — one is headed "Relay's access log (knows WHO)", the other "Gateway's log (knows WHAT, sorted by size)" — and note from those headings which of the two facts each log holds and which it lacks. Press **Join the logs on size** and record the result; then press **Join the logs on timing** and record that too.
5. Now tick **Pad every request to 256 bytes (RFC 9292 §3.8)**. The page clears the result and asks for a fresh run, so press **Simulate 4 clients at once** again, then **Join the logs on size** and **Join the logs on timing** once more, recording both. Finish this panel by opening **What padding does and does not fix** and reading it.

## Record

Every value below comes from your own run. Write phrases from the page rather than summaries, so you can quote them in the Explain section and in Fix / Extend.

> The joined log prints your invented query in full. Use wording you are willing to hand in.

| Party card | A fact listed after "knows" | A fact listed after "cannot know", and the reason the page gives |
|---|---|---|
| Client | | |
| Relay | | |
| Gateway | | |
| Target | | |

| From the Relay card | What it reads |
|---|---|
| The value beside `timing + sizes` | |

| The collusion toggle | Cryptographic result, in the page's words | Privacy verdict, in the page's words |
|---|---|---|
| Before you press it | | |
| After one press | | |
| After a second press | | |

| Joined log line | What it read |
|---|---|
| WHO | |
| WHAT | |
| JOINED ON | |

| Padding | Join | Privacy verdict, in the page's words | How many of the clients the verdict names |
|---|---|---|---|
| Unticked | on size | | |
| Unticked | on timing | | |
| Ticked | on size | | |
| Ticked | on timing | | |

## Explain

1. Using your first table, name the party in this run that held the patron's address, the party that held the words of the search, and any party that held neither. Then finish this sentence for a colleague who will not see the exhibit: while the two operators stay apart, what the patron is relying on is not encryption but ____.
2. When you pressed the toggle, the **Cryptographic result** box and the **Privacy verdict** box said opposite-sounding things at the same time. Explain how both can be true together, and use the **JOINED ON** line you recorded to say what the two operators actually combined — and whether anything had to be decrypted for it.
3. The Client card names one thing the client cannot know, with a reason. Quote the reason, then say what a patron, or a library acting for its patrons, would have to do instead of checking that thing on the patron's own computer. Name one item a library could actually ask a vendor for.

## Fix / Extend

1. **Fix.** A vendor brochure says patron searches are protected because they are encrypted in transit and the vendor's own servers never see a patron's address. Using your record tables and the row headed "What you must assume" in the panel **Where this sits: OHTTP vs VPN vs Tor vs IT-PIR**, name the assumption that claim actually rests on and the party who has to keep it. Then write one question the library should ask before signing. Claim no more than the exhibit showed you.
2. **Fix.** Suppose your library keeps a web-proxy log and a discovery vendor keeps a search log, and neither is shared with the other today. Using your correlation rows, say what could be recovered if one party later obtained both sets, and propose one change to what is logged, how long it is kept, or who holds it, that would reduce it. Say which half of the problem padding would cover and which half it would not.
3. **Extend.** Return to **The knowledge split, live** and watch the exchange one step at a time instead of jumping to the end. If the page still holds the query you invented in class, leave it; on a freshly loaded page the box is back to the lab's own example, so put an invented query in its place. Either way, do not type a real search of your own, a real name, or anything else about yourself. Press **Run the exchange**, then press **Next step** repeatedly until it stops advancing, reading the status line under those buttons after each press: it names the step and says what is travelling at that moment. Write down, in the page's own words, what the status line says is on the wire at the step where the relay hands the request on, and at the step where the gateway opens it, and compare those two lines with what you recorded on the Relay and Gateway cards. Note that re-running clears the results from the earlier panels.
4. **Extend.** Compare the four padding rows in your Record table — unticked and ticked, each joined on size and on timing. Say what ticking **Pad every request to 256 bytes (RFC 9292 §3.8)** changed and what it left unchanged, then open **What padding does and does not fix** in the panel **Correlation without collusion** again and use the page's own explanation to say what the person reading both logs used in each case. What does that suggest about a request log described as "encrypted"?
5. **Extend.** Go to the panel **Break it yourself** and press **3 · Decrypt with the gateway's leaked key**; the attack buttons stay disabled until an exchange has been run, so run one first if the page has been reloaded. Read the paragraph above the boxes, then write down what the **Cryptographic result** box and the **Privacy verdict** box each say. This is the case where a decryption that *works* is the bad news: explain why success is the bad outcome here, and say which single party ended up holding both facts that the design had been keeping apart. Connect your answer to the Client card "cannot know" line you quoted in Explain question 3.
6. **Extend.** Return to **The knowledge split, live**, set **Request shape** to the POST option, type a different invented note into the input box, and press **Run the exchange** again, then **Jump to end**. Compare the Gateway card with the one you recorded. Say what the card shows and what it does not show, then use the step description that says the gateway "reads your request in full" to decide whether your note was hidden from the gateway or merely not displayed. Note that re-running clears the results from the earlier panels.
7. **Extend.** In **Break it yourself**, press **1 · Decrypt with a key you generate** and then **2 · Flip one byte, then forward it**, and read what each reports. Using the page's own paragraph under each result, say what a dishonest relay can still do to a patron's request even though it cannot read it, and what that would look like to the patron.
8. **Extend.** Read the panel **Honest scoping — what this lab does and does not show**, together with the footnote under the two logs about the arrival clock. List which of the things you recorded were real cryptographic values and which were simulated, and say how that changes what you would be willing to claim about this exhibit in a class presentation.
