# Lane brief — three harness fixes for the eight verdict-gated labs

_Written 2026-09-21 after the first independent audit of `crypto-lab-fold-gate`
at `9dac554`. Committed here rather than sent as a message, because the last
lane's census existed only in a transcript and that is not a record._

**Scope: all eight labs the verdict lane built** — `fold-gate`, `hidden-bit`,
`order-leak`, `pqxdh-wire`, `privacy-pass`, `proof-tally`, `sleeve-check`,
`split-point`. Every one of them was built *before* the one-claim-per-marker
rule existed, so the gaps below are almost certainly not fold-gate's alone.
fold-gate is simply the one that has now been audited.

---

## Why this exists

fold-gate's verdict gate is real and most of it is good. Audited against
`9dac554` with `CI=1`, so Playwright started its own server and no stale
listener could turn a mutation into a false survivor. Unmutated baseline 7/7
green, which is the precondition for reading any kill at all.

**What held up:**

- Marker/mutation coverage is bidirectional and enforced. A `data-verdict`
  marker with no record fails; a record naming a marker the page no longer
  renders fails.
- `chain-ops` follows the measurement, not a constant. `verdicts.spec.ts`
  recounts the group operations with its own stand-in for `foldPublic`'s points
  **without importing `src/nifs/cost.ts`**, then asserts the rendered value
  equals that count. The recorded mutation (`tally.ops += 1` → `+= 0`) kills it:
  expected `6`, received `3`.
- The direct-push claim holds. Re-derived from the API rather than from the
  builder's transcript, which is the part that was a self-report:
  `enforce_admins: true`, required checks `["build","verdict-coverage"]`, both
  matching real job names at `deploy.yml:20` and `:44`, force-push and deletions
  disabled.

**What did not:** three gaps, all of them the same shape — the harness scores a
claim it has not actually checked.

---

## Fix 1 — one shared helper asserts text AND state together

Today the coverage test requires only that `verdicts.spec.ts` *mentions*
`data-verdict="<id>"`:

```ts
expect(SPEC_SOURCE.includes(`data-verdict="${id}"`), `${id} has a recorded
  mutation but nothing in verdicts.spec.ts asserts its rendered text`).toBe(true)
```

A mention is not an assertion, and it says nothing about *state*. Seven of
fold-gate's eight recorded kills are `toContainText` alone; only `relaxed-fold`
also asserts `toHaveClass`. So a mutation that flips the words while leaving
`verdict-good` styling in place is recorded as a kill, and the marker goes on
claiming pass in every way a reader can see except the sentence.

**A marker's text and its state are ONE claim.** The mutation must flip all of
it.

Build one helper — `expectVerdict(page, id, { text, state })` — that asserts the
marker's text, its `data-result`, and its pass/fail class in a single call. Then
make the coverage test require that **every mutation record's `killedBy` test
goes through that helper**, not merely that the spec mentions the id. A
text-only kill then fails the build instead of being recorded as evidence.

## Fix 2 — `data-claim` markers join the coverage loop on the same terms

`VERDICT_MUTATIONS` has eight keys and all eight are `data-verdict`. fold-gate
renders roughly eighteen `data-claim` markers — `chain-ops`, `chain-total-ops`,
`ops-per-fold`, `folded-w-length`, `plain-residual`, `final-commitment-e` and
the rest. Individual tests assert some of them. **Nothing requires any of them
to have a mutation record.**

So a new rendered measurement ships with no mutation and nothing goes red. The
coverage test's whole purpose is to make that impossible, and it currently
enforces it over one of the two marker families.

Put `data-claim` in the same loop on the same terms: a measurement marker with
no mutation record fails the build; a record naming a `data-claim` marker the
page no longer renders fails too.

## Fix 3 — the digit-plus-unit check

The outside-marker test catches two things: an element carrying a class
containing `verdict`, and a leaf element whose text is ALL CAPS and matches the
verdict-word list.

A rendered number is neither. `1,632 B`, `42 group operations`, a bare `6` — all
invisible to it. A measurement painted outside any marker is exactly as
unchecked as a verdict painted outside one, and it is the easier mistake to
make, because a number does not look like a claim.

Extend that test: in result regions, any leaf text matching digit-plus-unit
(`/\d[\d,.]*\s*(?:B|KB|MB|bits?|bytes?|ops?|operations?|ms|s|×|x)\b/i`, plus a
bare integer in a stats grid) must sit inside a marker. Same failure message
shape as the verdict-word case.

---

## Landing it

**Three of the eight are branch-protected and need a pull request.** Derived
from the API on 2026-09-21, not assumed:

| Lab | `main` protection |
|---|---|
| `fold-gate` | `build`, `verdict-coverage` |
| `order-leak` | `build`, `verdict-coverage` |
| `split-point` | `build`, `verdict-coverage` |
| `hidden-bit`, `pqxdh-wire`, `privacy-pass`, `proof-tally`, `sleeve-check` | none (404) |

fold-gate additionally carries `enforce_admins: true`, so a direct push is
rejected outright — the builder demonstrated it with
`GH006: Protected branch update failed`.

This table is itself a correction. The first draft of this document asserted
that fold-gate was the only protected lab, on the strength of having audited
fold-gate. Three are. Re-derive it before relying on it — protection was added
by individual builders mid-lane, so it will keep changing, and "the only lab
with X" is the exact claim this fleet has now been burned by twice (see
`LANE-3A-DISPATCH-EXCEPTIONS-2026-09-10.md`, correction C2).

Re-audit all eight under the three rules above once they land. `reuseExistingServer`
must be off (`CI=1`) for every mutation run — the ports are pinned one-per-lab in
`tools/playwright-ports.json`, but a reused server defeats the pinning.

---

## The catalog side, answered

**`chain-ops` is labelled correctly and needs no change.** Beside the
`FOLDED 8 → 1, VALID` headline the page renders, in this order:

| Element | Marker | Text |
|---|---|---|
| chain verdict | `data-verdict="chain"` | `FOLDED 8 → 1, VALID` |
| cost verdict | `data-verdict="chain-cost"` | `PER-FOLD VERIFIER COST CONSTANT AT 6` |
| its detail line | `data-claim="chain-total-ops"` | `measured across 7 folds · 42 group operations in total, plus one final check` |
| stats grid | `data-claim="chain-ops"` | `GROUP OPS / FOLD` → `6` |

So the `6` the audit expected appears twice and **both places say per fold** —
once in the verdict text (`PER-FOLD VERIFIER COST CONSTANT AT`) and once in the
stat label (`GROUP OPS / FOLD`). The chain total is separately marked and
separately derived: `42`, asserted as `counted * 7` for eight steps. There is no
place where a per-fold count is presented as a chain total.

**README:18's sentence stays off the Fold Gate card** — *"This NIFS alone is
neither zero-knowledge nor a succinct proof"* — removed in `4acdcc7`. It rests
on the `final-opening` marker, whose kill was validated by text alone under Fix
1. It is very likely true. It is not yet proven to this fleet's standard, and a
catalog sentence is the wrong place to carry an unproven negative claim. It goes
back when fold-gate passes an audit under all three rules.
