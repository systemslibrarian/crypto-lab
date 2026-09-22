# Class time on the teaching pages: what every published minute is derived from

Date: 2026-09-22. Written because `CLAUDE.md` now requires every published figure to be
derived from the thing it describes, and the minutes on twenty-four worksheets were not.

## The convention

Minutes mean **class time**, costed as:

- **Predict** — answered before the exhibit is opened. Pre-class reading. **Not counted.**
- **Do**, and the **Record** tables Do fills. Counted, and not double-counted: most Record
  cells are filled during the Do step that produces them.
- **Explain** — a spoken debrief led by the instructor, **not** written work in the room.
  Measured at roughly three-fifths of the written cost (ratio mean 0.587 across the five
  worksheets where both modes were priced on the same sheet).
- **Fix / Extend** — homework. Not counted.

Both halves are published on every worksheet and module page from one constant in
`tools/teach-build.js`, so a reader knows what the number covers. `teach-build.js check` also
now fails when a worksheet's `minutes` and its module entry disagree: they are one figure, and
nothing compared them until today.

## How the figures were wrong

Every error was a number inherited from something adjacent rather than derived:

| Source of the wrong figure | Where it bit |
|---|---|
| The module's budget became the worksheet's estimate | All five `symmetric` worksheets |
| A CI timeout became a duration | Padding Oracle: 120 + 120 + 180 s of e2e ceiling read as 7 minutes of waiting, when the real wait is about 7 seconds |
| Predict counted inside the total in one module, outside in another | All five `public-key` worksheets, and TLS Handshake |
| A cut's claimed savings taken at face value, including Fix / Extend items that cost no class time | Four of five `public-key` worksheets |
| Explain never costed at all, in any modality | Patron Shield, and Blind Relay at under a minute a question |
| Explain used as the balancing term to hit the budget | Five of six `post-quantum` worksheets |
| A measurement artefact read as a lab defect | A CSP console error attributed to `kyber-vault`, actually Playwright's screenshot injection |

## What each figure now rests on

Bottom-up accountings, per Do step, with the machine priced from the source rather than
guessed. Selected measurements, all made against the labs' own code:

- **Padding Oracle** — the Full Block attack issues about 2,060 real oracle queries, but each
  is one 16-byte `crypto.subtle.decrypt` at about 0.08 ms. The pacing is a sleep per recovered
  byte, not per query: about 7 seconds at the default speed. Total waiting across the whole
  worksheet is about a minute, under 4% of class time.
- **Hidden Bit** — a run is capped at 40 repaint-and-yield frames whatever the trial count, so
  a 200-trial run takes 0.2 to 0.35 s. Trial count barely moves the clock.
- **Nonce Collision** — all four constructions under one reused nonce: median 8.4 ms.
- **Harvest Vault** — the Q-Day search sweeps a keyspace of 8,388,449 candidates in about
  40 ms. Its own a11y spec allows 120 s and calls it "genuinely slow work": a ceiling mistaken
  for a measurement, wrong by three orders of magnitude.

## Published figures, before and after

| Module | Exhibit | Before | After | Note |
|---|---|---|---|---|
| symmetric | Hidden Bit | 15 | 15 | derives to 15.4; rounds to the same number, not inherited from it |
| symmetric | OTP Vault | 20 | 19 | three cuts applied, derives to 18.7 |
| symmetric | AES Modes | 15 | 14 | two cuts applied, derives to 14.3 — recorded as 14, not rounded up to the budget |
| symmetric | Padding Oracle | 35 | 24 | number only; no teaching moved |
| symmetric | Nonce Collision | 15 | 15 | derives to 14.8 |
| key-exchange | Diffie-Hellman MITM | 20 | 19 | |
| key-exchange | TLS Handshake | 32 | 24 | its 32 still carried Predict; the recorded two-minute overrun never existed |
| key-exchange | Downgrade Wire | 25 | 21 | |
| key-exchange | Protocol Checker | 20 | 19 | |
| public-key | Educational RSA | 20 | 29 | over its plan by 4, accepted and recorded |
| public-key | RSA Forge | 35 | 32 | |
| public-key | EC Point Arithmetic | 15 | 17 | |
| public-key | ECDSA Forge | 26 | 29 | |
| public-key | Nonce Lattice | 25 | 30 | |
| library-privacy | Patron Shield | 15 | 22 | over its plan by 7, accepted and recorded |
| library-privacy | Blind Relay | 20 | 23 | over its plan by 3, accepted and recorded |
| library-privacy | DP Noise | 25 | 24 | |
| library-privacy | Shelf Oracle | 30 | 25 | |
| post-quantum | all six | 15 / 20 / 30 / 15 / 15 / 20 | **not yet derived** | their Explain figures are residuals; a derivation is in progress |

## Module totals against the plans those modules were budgeted to

The budget was never a published field: it lived in the per-exhibit minutes, which are now
derived, so the module page's class time is the derived sum. These plans survive only here.

| Module | Planned core | Derived core | Still describes the module? |
|---|---|---|---|
| symmetric | 100 | 87 | No — 13 minutes of slack |
| key-exchange | 75 | 64 | No — 11 minutes of slack |
| public-key | 110 | 107 | Near enough |
| library-privacy | 60 | 69 | No — 9 minutes over |
| post-quantum | 95 | not yet derived | Unknown |

`library-privacy`'s `course_fit` still offers it as "a one- or two-meeting unit". At 69 minutes
of core it is not a one-meeting unit. Left unchanged pending a decision.

## Decisions recorded, so they are not re-litigated by a later recount

- **A recount changes numbers, not teaching decisions.** Where a recount frees time, that is
  reported as available time; it is not a reason to move material back into a class sequence.
- **Three overruns accepted rather than cut**: Patron Shield +7, Educational RSA +4, Blind
  Relay +3. Each is recorded with its reason in its module entry.
- **DP Noise's declared-cap block stays in Fix / Extend.** Outcome 4's cap clause is met there,
  decided on its merits. The recount frees about 1.5 minutes and restoring the block costs
  about 7, so it would not fit in any case.
- **Protocol Checker serves no module outcome in class** and its outcome list is empty, with a
  note saying what it does instead.
