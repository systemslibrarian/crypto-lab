---
exhibit: harvest-vault
module: post-quantum
minutes: 20
outcomes: [2, 5]
source_commit: 1c8241953291
checked: 2026-09-22
anchors:
  - "#progress-nav"
  - "#capture"
  - "#capture-message"
  - "#send-session"
  - "#deploy-pqc"
  - "#run-qday"
  - "#reset-capture"
  - "#capture-status"
  - "#capture-body"
  - "#mosca"
  - "#x-slider"
  - "#y-slider"
  - "#z-slider"
  - "#x-value"
  - "#y-value"
  - "#z-value"
  - "#z-year"
  - "#scenario-strip"
  - "label:Library"
  - "#whatbreaks"
  - "#mitigations"
  - "#matrix-grid"
  - "#matrix-info"
  - "#brief"
  - "#brief-pre"
  - "#copy-brief"
---

## Predict

This is an extension worksheet: you work it on your own, and nothing here needs an instructor standing over it. Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. The exhibit keeps a copy of each session you send, as bytes: the panel says the two public keys, the nonce and the ciphertext are copied, that this is what a passive wiretap sees and nothing more, and that your plaintext is never in the copy. After the attack runs, the panel reports for each stored record whether the stored bytes are unchanged since capture. Predict what it will report for a record that was captured *before* you press **Deploy the PQC upgrade**, and say why.
2. You will send one message before deploying the upgrade and one after it. Predict which of the two the attack recovers. For the one you expect it to miss, predict whether the reason is that the attacker failed at the same hard problem it solved for the other message, or something else — and say what that something else would be.
3. The classical handshake is Diffie-Hellman in a small group, and the attacker searches every candidate private exponent in turn. The panel reports how many exponents it tried and how many were possible. Predict roughly what fraction of the possible exponents the search will get through before it stops, and predict whether two captured sessions will cost the same amount of work.
4. The calculator on the same page asks whether X + Y > Z, where X is the number of years the data must stay secret, Y is the number of years migration takes and Z is the number of years until Q-Day. Predict whether a profile whose data must stay secret for decades can be moved out of "at risk" by changing Z alone, and say which of the three numbers an organization actually controls.

## Do

Work straight down the page. Everything in this section is in two panels.

1. Open the exhibit. In the step nav that follows you down the page, press **4 · Prove it** to reach the panel headed **PROVE IT: CAPTURE A HANDSHAKE, THEN UPGRADE**. Read the note that begins **Toy scale, stated plainly.** and keep it in view: the rest of this worksheet leans on it.
2. In **Message to send**, replace the text with a short line of your own — something you would not want read aloud. Press **Send over the classical handshake** and wait for the line under the buttons to say the session was captured. Record the new row's **Captured** time, its **Handshake** value, and the start of its **Stored bytes** cell (the hex run and the SHA-256 that follows it) in the first table.
3. Press **Deploy the PQC upgrade**. Read the line under the buttons and record what it says about the records that are already in the store. Notice that the first button has changed its wording.
4. In **Message to send**, type a second, different line. Press **Send over the hybrid handshake** — the same button as before, now relabelled. Record row two in the first table the same way.
5. Press **Run Q-Day** and wait until the line under the buttons says Q-Day is complete. For each row, record the **At Q-Day** cell in the second table: the verdict, the recovered text or the failure line, whether it is byte-identical to what was sent, what it says about the stored bytes since capture, and the exponents-tried figure with its timing.
6. Read the block headed **What this run showed** below the table and fill in the third table from it.
7. Press **5 · Your risk** in the step nav to reach the panel headed **MOSCA'S THEOREM: X + Y > Z**. Without touching the sliders, record the sector name shown as selected, the three slider values, the year printed next to Z, and the verdict line, in the fourth table. Then press the **Library** sector button and record the same row again.
8. Scroll to the block headed **Across the plausible Q-Day range** in the same panel and record its three chips in the fifth table.

> If you lose your place, **Reset exhibit** empties the store and re-arms the upgrade, and you can start again from step 2.

## Record

Every value in these tables comes from your own run.

| Session | Captured | Handshake | Stored bytes: hex run and SHA-256 |
|---|---|---|---|
| One, sent before the upgrade | | | |
| Two, sent after the upgrade | | | |

| Session | Verdict | Recovered text, or the failure line | Byte-identical to what was sent? | Stored bytes since capture | Exponents tried, and how long |
|---|---|---|---|---|---|
| One | | | | | |
| Two | | | | | |

| What this run showed | The sentence, in your own words, with its numbers |
|---|---|
| Sessions captured before the upgrade, and how many were recovered | |
| Sessions captured after the upgrade, and how many were recovered | |
| Stored records hashing to what they hashed at capture time | |
| Attacker effort: exponents, time, and out of how many possible | |

| Sector shown as selected | X | Y | Z | Year next to Z | Verdict line as printed |
|---|---|---|---|---|---|
| As the page loaded | | | | | |
| Library | | | | | |

| Chip | Verdict | The X+Y and Z comparison as printed |
|---|---|---|
| Aggressive | | |
| Center | | |
| Conservative | | |

## Explain

1. Row one came back as readable text and row two did not. Both messages were protected the same way — the lab's [README](https://github.com/systemslibrarian/crypto-lab-harvest-vault) describes the panel as running HKDF-SHA-256 and AES-256-GCM — and the failure line you recorded for row two names AES-GCM. Using your two rows, say what the attacker had to break in order to read row one, and whether AES-GCM failed there. Then say, for row two, what the attacker did get and what it did not.
2. Compare the exponents-tried figures in your two rows with each other, and with the "out of" figure in the **What this run showed** block. Why did the two rows cost different amounts of work, and why will a classmate's figures differ from yours? Using the **Toy scale, stated plainly.** note, say why this same search would not be the attack at a real Diffie-Hellman size, and what the note says breaks those instead.
3. Write down the count of stored records that hash to what they hashed at capture time, and the sentence the panel prints after it. Using only that, explain why pressing **Deploy the PQC upgrade** could not change the outcome for your first message. What would have had to be different about the order of your presses for that message to have survived?
4. For each of your two rows in the fourth table, write out the X + Y > Z comparison the page printed. Which of the three numbers could an organization in that sector actually change, and which is not theirs to change? Then use your three chips and the page's own note under **Across the plausible Q-Day range** — "The lesson isn't the exact date — it's whether you survive the whole range" — to say what the page is claiming by showing three Q-Day dates at once rather than one, and what would have to be true of a profile for its three chips to disagree with each other.

## Fix / Extend

1. **Fix.** Your service runs TLS 1.3 with ECDHE today, and a hybrid key exchange is on the roadmap three years out. Using your two Q-Day rows, write two sentences for a manager: one saying what the upgrade will do for traffic sent after it lands, and one saying what it will not do for traffic sent before. Then name the recorded values you would put in front of them as evidence — and, using the **Toy scale, stated plainly.** note, say why the exponent count is not one of them.
2. **Fix.** The **Library** profile you recorded printed a verdict at the Z the page had loaded. Using the three numbers in that row, state what would have to change, and by how much, for the same profile to print the other verdict at that same Z. Say which of those levers a library could actually pull, and what the page's context block for that profile — headed **LIBRARY PATRON PRIVACY CONTEXT** at the foot of the same panel — says about how quickly it could pull it.
3. **Extend.** Press **2 · What breaks** in the step nav to reach the panel headed **WHAT QUANTUM BREAKS — AND WHAT IT DOESN'T**. Read both columns, the note underneath them, and the collapsed check below that note. Write down which primitives the page puts in each column, and what it says Grover's algorithm does to AES-256. Then reconcile that with your row one, where a message protected with AES-256-GCM came back in plaintext: name the thing that was broken, and say why the page argues that "we use AES-256" is not an answer to this threat.
4. **Extend.** Press **6 · Mitigate** to reach the panel headed **SECTOR RISK MATRIX + MITIGATIONS**. Move focus onto each dot in turn — without activating one, which loads that sector into the calculator — and read what appears in the box below the matrix; write down two sectors that the box puts in different risk states. The legend under the matrix tells you to move the Z slider above to watch dots cross between states. Try that, then try the row of buttons labelled **Q-Day assumption:** above the matrix, and write down which of the two actually moves the dots — and which sectors change state when it does.
5. **Extend.** Back in the calculator panel, set **X - Data sensitivity lifetime (years data must remain secret)**, **Y - Migration time (years to complete PQC transition)** and **Z - Q-Day estimate (years until cryptographically relevant quantum computer)** to numbers that match a system you actually use. Read the brief in the box under **YOUR RISK BRIEF** (**Copy brief** puts the same text on your clipboard) and write down its verdict line and its "latest year to start" line. The brief prints a name for your sector: compare it with the name on the selector button you pressed, and note any difference between the two.
