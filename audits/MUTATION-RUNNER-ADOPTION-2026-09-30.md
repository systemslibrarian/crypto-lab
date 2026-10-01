# Mutation-runner adoption — where the fleet stands, and what is left

**2026-09-30.** `audits/_MASTER-TEMPLATE.md` §4.1c now requires a verdict-rendering lab to run
its mutations from a script that judges kills. This file records what that means for the labs
that already exist. **It is a backlog, not a plan.** Nothing here is scheduled, and the template
change is forward-looking: no lab is out of compliance for having been built first.

## The population

**22 labs render `data-verdict` markers.** That is the scope; the other 184 are not in it.

| tier | labs |
|---|---|
| a script that JUDGES a kill | **8** — `sleeve-check`, `privacy-pass`, `hidden-bit`, `pqxdh-wire`, `proof-tally`, `split-point`, `fold-gate`, `order-leak` |
| a script that applies/reverts but does not judge | **0** |
| a machine-readable ledger, no script | **0** |
| no machine-readable mutation record at all | **14** |

`pqxdh-wire` moved to the first row on 2026-09-30. `proof-tally`, `split-point`, `fold-gate` and
`order-leak` followed on 2026-10-01, which empties the two middle rows: **every lab that had a
machine-readable mutation record now has a runner that judges it.** The 14 in the last row are
untouched and still not backlog.

**One row of the table above was wrong when it was written, in exactly the way the note below
predicts.** `proof-tally` was listed as applying and reverting without judging, on a reading of
`tools/verdict-mutation.mjs`. The lab also had `tools/verdict-kill.mjs`, which already replayed
every record and required the named test to go red — so it belonged in the first row for rules 1
and half of 2 before this work started. A scan that missed `mutate.mjs` once missed
`verdict-kill.mjs` next, for the same reason: it was named after what it does rather than after
the word being searched for.

A note on how that table was produced, because the first version of it was wrong. A scan for
files matching `mutation*` missed `pqxdh-wire/scripts/mutate.mjs` — the lab that was about to be
worked on — and classified it as having no script. The labs most likely to break a detector are
the ones that named something sensibly. Every row above was confirmed by opening the file.

## The backlog

One line each. Everything listed here is now DONE; the estimates it was written with are kept
below the results, because the gap between them is the useful part.

- **`pqxdh-wire`** — DONE 2026-09-30 (`f567ac2`). Its ledger already held `file`/`find`/`replace`,
  so only the judging loop was missing, and no record changed. **13/13 mutations killed, covering
  17 marker assertions**, against a baseline suite of 20 passing tests. It cost about an hour, and
  half of that was one mistake worth passing on: the loop first ran each owning test with `-g` and
  reported all 13 baselines RED. That was true of the command and false of the lab — this lab's
  `e2e/global-teardown.ts` fails the run when any recorded kill did not execute, so a single-test
  run cannot exit 0 here. **Copying a runner between labs means meeting the other lab's
  enforcement, not just its ledger.**
- **`proof-tally`** — DONE 2026-10-01 (`80a414d`). **35/35 killed, 0 survived**, baseline 22 specs.
  No record changed: the ledger's 35 entries already held `file`/`find`/`replace`, and
  `tools/verdict-kill.mjs` already judged rule 1 per record. What was missing was the rest:
  a `find === replace` no-op would have passed, the restore md5 was checked once after all 35
  rather than after each, nothing asked whether the bundle moved, and a non-compiling patch
  crashed with a stack trace instead of reading `DOES NOT BUILD`. Each of the four rules was then
  confirmed to BITE by making it fail on purpose — and the lab's own suite caught the attempt:
  adding four synthetic records to exercise the branches turned `e2e/verdicts.spec.ts` red,
  because a recorded mutation whose marker the page never renders is itself a finding here. The
  branches were proven by temporarily altering a real record instead.
- **`split-point`** — DONE 2026-10-01 (`fcd81f3`). **16/16 killed, 0 survived**, baseline 21 specs.
  Sixteen prose mutations encoded as patches, and **all sixteen were right first time**, against
  the one-or-two-wrong this file predicted. The reason is worth keeping: this ledger's prose
  already named the file and gave an exact before/after pair, so encoding was transcription. Two
  needed a decision and both were settled by READING rather than by judging what a claim meant —
  `if (share[index] === 0) continue;` occurs twice in `src/pir/server.ts`, and the record names
  `serverAnswerProgressive`, so the anchor carries the `foldedRecords += 1;` only that copy has.
- **`fold-gate`** — DONE 2026-10-01 (`96c35ee`). **41/41 killed, 0 survived**, baseline 19 specs.
  The records stayed in TypeScript: four files import that module, including `src/ui/app.ts`,
  which RENDERS from it, so moving them to JSON would have meant duplicating the records or
  rewriting every importer to make a script's life easier. Node imports the module directly
  (type stripping, 23.6+). Eight of the 41 could not be read straight out of the prose because it
  elided exactly the part a string match needs — `JSON.stringify(A, …)`,
  `valid: constraintValid && ...`, `verifierGroupOps(…)` — and those expansions now live in the
  patch rather than waiting to be redone.
- **`order-leak`** — DONE 2026-10-01 (`d59137a`). **12/12 killed, 0 survived**, baseline 18 specs,
  14 edits across 12 records, because `patch` had to become a LIST: one record changes the same
  interpolated aggregate in both `query()` and `recover()`, and another cannot render a map index
  until the callback takes one.

  **This is the lab that produced a survivor, and it was an encoding error.** Record `[1]` quotes
  the literals it wants — `240 of 240 stored ciphertexts are distinct` — and neither literal
  contains the word "only". I anchored on the two branches that DO (`and only ${classes.distinct}`
  and `into only ${classes.distinct}`), which are precisely the branches that never execute while
  the randomized control is intact. The patch applied, the bundle moved, the page never rendered
  the mutated string, and the test stayed green. **Under the prose ledger that would have been
  written up as a kill.** Re-anchored on the control-held branches at `src/app.ts:102` and `:150`,
  it kills.

The 14 labs with no machine-readable record are **deliberately not listed as backlog**. They need
a ledger before they need a runner, which is a different and much larger job, and §4.1c does not
ask them to have one.

## What adoption is actually for

Not automation. Refusal. On the day `privacy-pass`'s runner was written it judged 20 mutations
and refused two of them: one patch replaced a line with the empty string, applied cleanly, then
matched 24,385 times on the way back and poisoned the twelve results after it; one pointed at a
map's `aria-label` rather than the counted total its own record named, and SURVIVED. Under the
prose ledger both would have been written up as kills.

That is the number worth carrying into any estimate above: **two encodings in twenty were wrong,
and a person reading a terminal would have recorded both as evidence.**

## What the four labs added to that number

Across the four, **84 mutations were encoded or re-judged and one encoding was wrong** — 1 in 84,
not 2 in 20. The rate is not the point; what the rate depends on is.

| lab | records | wrong first time | why |
|---|---|---|---|
| `proof-tally` | 35 | 0 | patches already concrete; nothing to encode |
| `split-point` | 16 | 0 | prose named the file and an exact before/after pair |
| `fold-gate` | 41 | 0 | same, for 33 of them; 8 needed the source read to expand an ellipsis |
| `order-leak` | 12 | **1** | prose named a branch by the TEXT IT PRINTS, and two branches print almost the same text |

**A ledger's prose predicts how safely it can be encoded.** Where it quotes code, encoding is
transcription. Where it quotes OUTPUT, or names a branch by what the branch says, the encoder has
to decide which branch was meant — and the one that never runs looks identical on the way in and
goes green on the way out.

The three estimates of ~3 hours each were about right for `fold-gate` and `order-leak` and
generous for `split-point`. `proof-tally`'s ~1 hour was right for the work it turned out to need,
which was not the work the estimate described.

## What none of these four changed

No source file, no test, and no workflow. Every diff is the ledger plus one runner, which is what
made each of them safe to land on its own. Three consequences worth naming:

- **CI does not run any of these runners.** Each lab's gate still runs its own suite and its own
  coverage or replay check, which is what enforces that recorded kills executed. Running 35, 16,
  41 or 12 rebuild-and-replay cycles in CI costs 8 to 15 minutes per lab, and wiring it in is a
  workflow change and a maintainer's call.
- **Typed `observed` records are left in place** in `fold-gate` and `order-leak`, which carry
  pasted reporter lines, and `order-leak`'s even name the bundle hash before and after. §4.1c's
  rule is that an observation is written by the thing that ran it; these are now superseded by a
  runner and redundant rather than wrong. Deleting another author's recorded evidence is a
  maintainer's call, not a side effect of adding a runner.
- **All four runners refuse a dirty working copy** and mutate a `git archive HEAD` tree rather
  than the checkout. §4.1c warns that a session dying mid-check strands an inverted condition in
  the tree; a `finally` covers a thrown error and not a kill signal.
