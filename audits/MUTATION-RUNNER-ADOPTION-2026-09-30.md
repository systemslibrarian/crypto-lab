# Mutation-runner adoption — where the fleet stands, and what is left

**2026-09-30.** `audits/_MASTER-TEMPLATE.md` §4.1c now requires a verdict-rendering lab to run
its mutations from a script that judges kills. This file records what that means for the labs
that already exist. **It is a backlog, not a plan.** Nothing here is scheduled, and the template
change is forward-looking: no lab is out of compliance for having been built first.

## The population

**22 labs render `data-verdict` markers.** That is the scope; the other 184 are not in it.

| tier | labs |
|---|---|
| a script that JUDGES a kill | **3** — `sleeve-check`, `privacy-pass`, `hidden-bit` |
| a script that applies/reverts but does not judge | **2** — `pqxdh-wire`, `proof-tally` |
| a machine-readable ledger, no script | **2** — `split-point`, `fold-gate` / `order-leak` (TS data modules) |
| no machine-readable mutation record at all | **14** |

`pqxdh-wire` moved from the second row to the first on 2026-09-30.

A note on how that table was produced, because the first version of it was wrong. A scan for
files matching `mutation*` missed `pqxdh-wire/scripts/mutate.mjs` — the lab that was about to be
worked on — and classified it as having no script. The labs most likely to break a detector are
the ones that named something sensibly. Every row above was confirmed by opening the file.

## The backlog

One line each, with the work as I estimate it. None of this is started.

- **`pqxdh-wire`** — DONE 2026-09-30 (`f567ac2`). Its ledger already held `file`/`find`/`replace`,
  so only the judging loop was missing, and no record changed. **13/13 mutations killed, covering
  17 marker assertions**, against a baseline suite of 20 passing tests. It cost about an hour, and
  half of that was one mistake worth passing on: the loop first ran each owning test with `-g` and
  reported all 13 baselines RED. That was true of the command and false of the lab — this lab's
  `e2e/global-teardown.ts` fails the run when any recorded kill did not execute, so a single-test
  run cannot exit 0 here. **Copying a runner between labs means meeting the other lab's
  enforcement, not just its ledger.**
- **`proof-tally`** — `tools/verdict-mutation.mjs` applies and restores; it needs the same judging
  loop `pqxdh-wire` just got. Its ledger is a 35-entry list with patches already in it.
  **Estimate: ~1 hour**, the cheapest remaining item.
- **`split-point`** — ledger is `{note, markers, claims}` with mutations written as PROSE plus
  `expectedFlip` and `assertedBy`. Each needs encoding as a concrete patch before a runner can
  do anything. **Estimate: ~3 hours**, and expect one or two encodings to be wrong on the first
  outing — two of `privacy-pass`'s twenty were.
- **`fold-gate`** — records live in `e2e/verdict-mutations.ts` as a TypeScript data module rather
  than JSON, in two arrays (`VERDICT_MUTATIONS`, `CLAIM_MUTATIONS`). Patches must be extracted
  from prose, and a runner has to import TS or the records have to move to JSON.
  **Estimate: ~3 hours.**
- **`order-leak`** — the same shape and the same work as `fold-gate`. **Estimate: ~3 hours.**

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
