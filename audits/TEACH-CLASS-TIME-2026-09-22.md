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
- **Shor** — a run replays its trace at 300 ms a step: median 3.3 s, about 11 seconds of
  waiting across the whole worksheet. Measured over 5,000 headless runs of N = 91, which also
  settled the probabilistic outcomes the sheet asks students to record.
- **Lattice Gentle** — nothing in the lab waits at all. Its heaviest computation on the
  worksheet path, an exhaustive search over 3,721 candidates, benchmarks at 69 microseconds.

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
| post-quantum | Shor | 15 | 18 | derives to 17.5; 26.5% of runs end on a shared factor with no period, and a session averages about six retry lines to record |
| post-quantum | Grover | 20 | 26 | the largest understatement in the fleet |
| post-quantum | Lattice Gentle | 30 | 33 | 68 Record cells, over half of its Do time |
| post-quantum | Kyber Vault | 15 | 20 | no wall-clock term at all: about 4.5 ms of ML-KEM across the whole sheet |
| post-quantum | Hybrid Wire | 15 | 20 | derives to 19.6 |
| post-quantum | Harvest Vault | 20 | 21 | derives to 20.6 |

## Module budgets

The budget used to be a planning figure the worksheets were written to hit, which is how it
became an inherited number: several worksheets were costed to land on it rather than measured.
**The derived total is now the budget.** There is no separate planned figure to keep, and the
module page's class time is that same derived sum.

| Module | Budget (was) | Budget (now, derived) | Change |
|---|---|---|---|
| symmetric | 100 | **87** | −13 |
| key-exchange | 75 | **64** | −11 |
| public-key | 110 | **107** | −3 |
| library-privacy | 60 | **69** | +9 |
| post-quantum | 95 | **117** | +22 |

Three `course_fit` sentences described the old figures and were corrected to the derived ones,
each saying what the total implies for 50- and 75-minute meetings:

- **symmetric** — 87 minutes fits two 50-minute meetings with a little room to discuss.
- **library-privacy** — 69 minutes is a two-meeting unit; it was offered as "a one- or
  two-meeting unit", and a single meeting works only in a 75-minute slot, leaving almost none.
- **post-quantum** — 117 minutes is two meetings of 75 or three of 50, **not** two of 50,
  which it overruns. It had been published as a two-meeting unit with no length given.

`public-key` and `key-exchange` state no meeting structure, so their derived totals contradict
nothing in their prose.

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
