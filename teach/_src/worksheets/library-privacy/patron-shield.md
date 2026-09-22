---
exhibit: patron-shield
module: library-privacy
minutes: 22
outcomes: [1, 2, 3, 5]
source_commit: 93f3f7226fe7
checked: 2026-09-22
anchors:
  - "#book-0"
  - "#book-1"
  - "#book-2"
  - "#book-3"
  - "#catalog-toggle-btn"
  - "#selected-title-text"
  - "#query-btn"
  - "#simulation-note"
  - "#mask-s1"
  - "#mask-s2"
  - "#s1-indices"
  - "#s1-count"
  - "#s2-indices"
  - "#s2-count"
  - "#title-reveal"
  - "#correctness-badge"
  - "#final-book-title"
  - "#collude-btn"
  - "#collude-bit"
  - "#collude-title"
  - "#run-again-btn"
  - "#new-book-btn"
  - "#toggle-naive"
  - "#toggle-pir"
  - "#naive-display"
  - "#pir-display"
  - "#scaling-slider"
  - "#scaling-linear"
  - "#scaling-sqrt"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see. No mathematics is needed for any of them.

1. A patron searches an ordinary library catalog for one title. For each of these four facts, say whether the operator of that catalog ends up holding it: the title requested, who asked, when they asked, how often that patron asks.
2. Now the same lookup is handled by two services run by two different organisations. Each service is sent a list of catalog positions, combines the records sitting at those positions into a single reply, and sends that reply back; the patron's own device puts the two replies together to get the book. Predict what one of those services, reading only the list it received, could say about which book the patron wanted.
3. Predict what those two organisations could work out about that patron if they laid the two lists they received side by side. Which of the four facts in question 1 would they hold between them?
4. Name one fact about a patron's catalog use that an arrangement like this cannot hide, and say why a librarian might still care about it.

## Do

1. Open the exhibit. Before choosing anything, scroll to **Naive vs. Private Query**. The **Naive query** view is the one showing. Record its request line, exactly as it reads now, in the first row of the first table.
2. Scroll up to **Library Catalog**. Four of the eight books are shown, and **Showing 4 of 8 — show all** opens the rest. Click one of the four cards already showing — these steps use **The Midnight Library** — and read the line that appears under the catalog. Record the title and the index it names in the fourth table.
3. Go back to **Naive vs. Private Query** and record the **Naive query** request line again. Then press **PIR query** and record the line that view shows, before any query has run.
4. Scroll to **Protocol Visualizer** and read the note headed **Teaching simulation** at the top of that section. You will need it for Explain 5.
5. Back in **Library Catalog**, press **Query Privately**. Four steps run in a few seconds. When the last one finishes, scroll back up to the panel headed **Client generates query pair** and look at the two grids of eight squares, one under **Server 1 receives** and one under **Server 2 receives**: each square stands for one catalog slot, and each server was sent its own grid.
6. Scroll down to **What each server knew** and record, in the second and third tables: the slots listed under **Server 1 saw:** and the count beneath them, the same two values for **Server 2 saw:**, the title under **Retrieved title:**, and the line that appears under that title.
7. Press **Run again** and record those same six values for a second run of the same book.
8. Press **Simulate the servers colluding**, near the end of the privacy analysis. Record in the fourth table the position the page names, the book it names, and how that button reads once you have pressed it.
9. Return to **Naive vs. Private Query**, press **PIR query**, and record that line as it reads now. Put it beside the **Naive query** line you recorded in step 3.

> Your first run opens the rest of the catalog by itself, so all eight books show from then on. That is the page working, not a mistake.

> If you click a different book card, the finished run clears and the panels reset. Choose again and press **Query Privately** to start a fresh run.

## Record

Every value below comes from your own run.

| Moment | The request line, exactly as the page shows it |
|---|---|
| **Naive query**, before a book is chosen | |
| **Naive query**, after you chose your book | |
| **PIR query**, before any query has run | |
| **PIR query**, after your second run | |

| Run | Server 1 saw (slots) | Count under Server 1 | Server 2 saw (slots) | Count under Server 2 |
|---|---|---|---|---|
| First, after Query Privately | | | | |
| Second, after Run again | | | | |

| Run | Retrieved title | The line under the retrieved title |
|---|---|---|
| First | | |
| Second | | |

| What the page showed | Value |
|---|---|
| The book you chose, and the index in the line under the catalog | |
| The position named after the servers colluded | |
| The book named after the servers colluded | |
| How the collusion button reads after you pressed it | |

## Explain

1. Put two of your recorded request lines side by side: the **Naive query** line after you chose a book, and the **PIR query** line after your second run. For each, say what the operator receiving it could write in its log about the title requested, and what a librarian could honestly tell a patron about what that operator holds.
2. Compare **Server 1 saw:** with **Server 2 saw:** in your first run, then compare your first run with your second. Did the same book produce the same lists twice? The note beneath the two grids calls each square a bit, and says that neither server "can determine which bit differs — or which book you want. Only a party holding *both* can see it." Using your own recorded lists, say what that sentence means for a log kept by one operator over a term of student searches.
3. In your run, neither list on its own named your book, and the page named it exactly once the two were put together. Using what appeared after you pressed the collusion button, explain in your own words what "the servers must not collude" is asking of two organisations, and say which of your recorded values one operator would have had to obtain from the other to do this alone.
4. Find the paragraph in the privacy analysis that begins "Scoped precisely". List the facts it says this design does not hide. For each one, name the party in a real library deployment who would be in a position to learn it, and say which of your Predict 1 answers it matches.
5. The note headed **Teaching simulation** says what this page actually is, and what a real deployment would need instead. Using that note and the paragraph beginning "The two masks are not independent", name the assumption the page's privacy claim rests on and every party who has to be trusted for it to hold. Then say what, if anything, a patron at a catalog terminal could check for themselves.

## Fix / Extend

1. **Fix.** A vendor tells your library that its catalog search is private because "neither of our two servers can tell which book a patron looked up". Using the paragraph beginning "The two masks are not independent" and the note headed **Teaching simulation**, write two questions you would put to that vendor before the library repeats the claim to patrons. For each question, name the recorded value or the page sentence that prompted it.
2. **Fix.** A library plans to run both servers itself, on one set of machines, under one administrator's account. The page says the threat model requires the servers to be operated by "independent, non-colluding parties". Say what that plan gives up, which of your recorded values demonstrates it, and how you would word the residual risk in a privacy impact assessment.
3. **Extend.** Press **Query a different book**, choose a card for a different title, press **Query Privately**, then press **Simulate the servers colluding** again. Did the page name the new book? Compare the two **Server 1 saw:** lists from your two different books and say what an operator holding both lists, and nothing else, could conclude about the two requests.
4. **Extend.** Scroll to **How PIR scales — the √N trick** and move the **Catalog size** slider to two of its positions, recording **1-D query (this demo)** and **√N matrix query** at each. The note under those figures says they count "query bits only". Say what it tells you still has to travel back from each server, and why a library with a large catalog would want to know that before costing such a service.
