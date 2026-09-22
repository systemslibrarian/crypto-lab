---
exhibit: dp-noise
module: library-privacy
minutes: 24
outcomes: [4, 5]
source_commit: abca4df106c0
checked: 2026-09-22
anchors:
  - "#route-guided"
  - "#path"
  - "#seed-toggle"
  - "label:Jargon, unpacked"
  - "#pr-aggregate"
  - "#leak-table"
  - "#leak-mode"
  - "#leak-run"
  - "#leak-out"
  - "#bound-hi"
  - "#bound-out"
  - "#bound-clip"
  - "#bound-reject"
  - "#bound-expand"
  - "#bound-decision-out"
  - "#pr-repeat"
  - "#avg-n"
  - "#avg-run"
  - "#avg-chart"
  - "#avg-out"
  - "#bud-budget"
  - "#ask-sum"
  - "#bud-out"
  - "#bud-ledger"
  - "#recap"
  - "#scope"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see. Nothing here needs arithmetic beyond an average.

1. A payroll office promises it will publish only totals, never one person's pay. In the same week it publishes two of them: the total payroll, and the total payroll for everyone except one named employee. Write down what a reader who sees both can work out about that employee, and say whether the reader needs to know anything about the other people on the payroll in order to do it.
2. Now the office adds a random amount to each total before publishing it, and says so. Predict whether subtracting the two published totals still gives that employee's pay exactly, roughly, or not usefully at all. Then say what you would look for on screen to tell which of the three you are seeing — you will be able to run the same subtraction several times over.
3. Before a total can be published this way, somebody has to declare in advance the most that any one person's salary will be allowed to count for. Predict what happens to the published total if that declared cap is set lower than what the best-paid people actually earn, and what happens to the size of the random amount if the cap is set very high.
4. A reader is allowed to ask for the noisy total as often as they like, and averages all the answers they get back. Predict how that average compares with any single answer, and say what that would mean for the promise the randomness was added to keep.

## Do

1. Open the exhibit. It opens on the guided route: in the navigator headed **The core path**, check that **Guided lesson** is the route shown as selected. Leave **Classroom mode — reproducible, seeded sampling**, at the foot of the opening section, unticked, so the numbers you record are your own. Do not move any ε control anywhere on the page while you work — every reading below assumes the value the page starts with.
2. Go to the section headed **Two harmless totals, one person's salary**. Under **Predict first**, press the option that matches your answer to Predict question 1 and read the explanation the page gives for the option you chose. Then, in the card headed **The database**, find the row tagged **the target** and copy her name and her salary into the first table under Record.
3. In the card headed **The differencing attack**, leave **How the two totals are answered** on **Exactly — no noise, the broken mode** and press **Run the attack**. Record the two totals the page lists, the difference it reports underneath them, and the headline of the verdict. Then open the disclosure inside that verdict and read its two paragraphs on what would not have helped.
4. Change **How the two totals are answered** to **With differential privacy at ε = 1**. The attack re-runs on its own. Record the new headline, the noise scale named in the verdict's second paragraph, and the five values in the chips labelled `run 1` to `run 5`.
5. Press **Run the attack** again without changing anything else, and record the second headline and the second set of five values. Note whether the verdict says any run landed close to the true salary, and what it says about that.
6. Go to the section headed **Composition: ε is a budget, not a setting**. Under **Predict first**, press the option that matches your answer to Predict question 4 and read the explanation. On this route the attack comes before the defence, so the card below it is **The averaging attack — what happens with no budget at all**.
7. Leave **Number of times to ask, at ε = 0.5 each** where it starts and press **Run the averaging attack**. It is finished when that button becomes pressable again. Record **Queries asked**, **Running average**, **Error** and **ε spent** from the row of figures, and the headline beneath them.
8. In the card below it, **The ledger**, leave **Total ε budget for this session** on its opening setting. Press **Ask: total payroll (ε = 0.5)** and keep pressing it until the page stops answering. After each press record whether an answer came back and the **Charged** and **Remaining** figures. Read the verdict that appears when it refuses.

## Record

Every value below comes from your own run.

| From the printed database | What it says |
|---|---|
| The name in the row tagged "the target" | |
| Her salary, as the table prints it | |

| How the two totals were answered | Total payroll | Total payroll excluding her | The difference | Headline of the verdict |
|---|---|---|---|---|
| Exactly — no noise | | | | |
| With differential privacy, first press | | | | |
| With differential privacy, second press | | | | |

| With differential privacy | First press | Second press |
|---|---|---|
| run 1 | | |
| run 2 | | |
| run 3 | | |
| run 4 | | |
| run 5 | | |
| Noise scale named in the verdict | | |

| The averaging attack | What the page reported |
|---|---|
| Queries asked | |
| Running average | |
| Error | |
| ε spent | |
| Headline | |

| Press of Ask: total payroll (ε = 0.5) | Did an answer come back? | Charged | Remaining |
|---|---|---|---|
| First | | | |
| Second | | | |
| Third | | | |
| Fourth | | | |

> Some of the figures above are the same on every machine and some are not. Explain question 2 asks you to work out which, using the page's own note about where its randomness comes from.

## Explain

1. Compare the difference your exact run produced with the salary you copied from the printed table. Both queries the attacker asked were ones the system was built to answer. Say what the two had in common and what they differed in, and why that difference is one person. Then use the disclosure you opened in step 3 to say why a rule that only approved queries about large groups would not have stopped it.
2. Your runs with noise gave a spread of values rather than one. Using the noise scale the verdict names and the salary you copied down, say what a reader who saw only those five numbers could honestly claim about her pay. The verdict may report that a run landed close; the page says why that is not something an attacker can use, so put its reason in your own words. Then compare your values with a classmate's and, using the page's own note about where its randomness comes from, say why those five differ — and name one figure you recorded that was the same for both of you.
3. Every answer in the averaging attack was, on its own, a correctly private release, and the page says so. Using your row from that table and the verdict the ledger gave when it refused, say what the reader walked away with, where the page locates the failure, and why refusing to answer is treated as the right behaviour rather than a breakdown. Then read the recap card headed **One thing the pictures can mislead you about** and name one conclusion about the people in this payroll that stays available to a reader even when each of them individually is protected.

## Fix / Extend

1. **Fix.** A library consortium publishes each month the total fines owed across all its member libraries, and the total fines owed by every member except one named branch. Using your records from Exhibit 1, say what a reader of a single month's figures can work out. Then name the three changes this exhibit makes to a published total so that they cannot, and for each one say who has to decide it and whether that decision happens before or after anybody looks at the data. Extend 3 and 4 below work through one of the three on the page; do those first if you have not already.
2. **Fix.** A vendor tells your library that its reading-history analytics are "differentially private at ε = 1, so no individual can be identified". Using the section headed **What this demo does and does not prove** and the verdict the ledger gave when it refused, write two questions you would need answered before you could evaluate that claim, and for each one name the party who has to be trusted for the answer to hold. Then open **Jargon, unpacked** in the opening section, read the entry for ε, and say why the vendor's sentence as written claims something ε does not measure.
3. **Extend.** Open the exhibit on the guided route — **Guided lesson**, in the navigator headed **The core path** — and leave every ε control where the page starts it. Go to the section headed **Where does Δ come from? You have to answer** and work **Declared upper bound on one person's salary** through all four of its settings, noting for each one **Sensitivity Δ**, **Noise scale b = Δ/ε**, **Records clipped** and **Clipping bias** from the row of figures below the menu. Describe which way each of the two costs — the noise scale, and the clipping bias — moves as the bound rises, and say which of the two would still be there after a reader had averaged a great many published totals. Then find the note under that row of figures which says where the bound may *not* come from, and give the reason the page gives for it. Compare all of it with what you predicted in Predict question 3.
4. **Extend.** Still on the guided route, in the section headed **Where does Δ come from? You have to answer**, set **Declared upper bound on one person's salary** to **$250,000 — declared in advance** and read the line about the thirteenth person to join the payroll. Press **Clip her to the declared bound**, then **Drop her record from this release**, then **Raise the bound so it fits her**, noting the headline each one produces and, where the page reports them, **Δ used**, **Systematic bias** and **Still ε-differentially private** — one of the three is refused and reports none of those figures. Using the page's stated reason for that refusal, say what the refused option would make the size of the noise depend on, and why that is a problem even though that option introduces no bias at all. Then say which of the other two you would choose for a payroll figure your library published, and what you would have to publish alongside the number for it to mean what a reader would take it to mean.
5. **Extend.** In **The ledger**, change **Total ε budget for this session** to **3**, which starts the session's accounting again, then press **Ask: total payroll (ε = 0.5)** until it refuses once more. Say how many answers you got this time, and what changing that setting changed about the promise being made to the people in the database rather than about the mechanism. Open the refusal's disclosure and quote the sentence that says so.
6. **Extend.** Below the averaging-attack chart there is a disclosure holding the plotted numbers as a table. Open it and read the error column and the ε column together, from the top of the table to the bottom. Say what each column does as the number of queries rises, and which of the two ever stops on its own.
