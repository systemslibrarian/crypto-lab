# Lane brief — six harness fixes for the eight verdict-gated labs

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

**What did not:** six items. Fixes 1-3 and 6 are all the same shape — the
harness scores a claim it has not actually checked. Fix 4 is the inverse and is
recorded because it matters just as much: a suspected code defect that testing
DISPROVED, leaving a real but different gap in the spec's oracle. Fix 5 is a
standing constraint rather than a defect.

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

## Fix 4 — the chain total: the code is right, the ORACLE is weak

This was raised as a suspected code defect: that `chain-total-ops` derives the
total from a single per-fold count, so *"measured across 7 folds"* and
*"PER-FOLD VERIFIER COST CONSTANT AT 6"* would be claims the run does not
support, and a mutation changing one fold only would survive.

**Tested rather than reasoned about. It does not survive.** `src/ui/app.ts:79`
was mutated so the first fold alone tallies one less, the suite was run with
`CI=1`, and the verbatim failure was:

```
Error: expect(locator).toContainText(expected) failed
  Locator: locator('[data-verdict="chain-cost"]')
  Expected substring: "PER-FOLD VERIFIER COST CONSTANT AT"
  Received string:    "PER-FOLD VERIFIER COST VARIED OVER 5, 6 · measured across 7 folds ·
                       41 group operations in total, plus one final check"
```

Baseline 7/7 passing in the same session; 1 failed / 6 passed under the
mutation, on that marker's own assertion. Three things are proven by the
received string alone: the total is **41**, so the page really does sum seven
tallies rather than multiplying one out; `constant` really does compare every
fold, since it flipped to `VARIED OVER 5, 6`; and the fold count comes from
`perFoldOps.length`, not a literal. The source agrees —
`total: perFold.reduce((sum, ops) => sum + ops, 0)`, and `verifierGroupOps` is
called inside the loop, once per fold.

So the page may say "measured". It is measured. **What is weak is the spec's
oracle**, and that is a real gap worth closing:

```ts
expect(await page.locator('[data-claim="chain-total-ops"]').getAttribute('data-value'),
  'seven folds of measured cost, summed').toBe(String(counted * 7))
```

The page sums; the oracle multiplies one count by a literal `7`. It happens to
agree today. It is structurally the wrong shape — it cannot distinguish "summed
seven measurements" from "multiplied one measurement", which is precisely the
distinction the sentence beside it claims. The literal also breaks silently the
moment anyone exercises the 2/4/16/32/64-step buttons the UI already offers, and
`await expect(cost).toContainText('measured across 7 folds')` has the same
literal built in.

Two changes, both in the spec:

1. Have the oracle build its own per-fold array by running the stand-in counter
   once per fold, sum that, and derive the expected fold count from the chain
   length under test. Then the test verifies the *shape* of the claim, not just
   its current value.
2. **Record the one-fold mutation above in `VERDICT_MUTATIONS`.** It is a real
   kill with verbatim evidence and it belongs in the record. It is also the only
   mutation in the set that distinguishes a summed total from a multiplied one,
   which no existing mutation does — every other one moves all folds at once.

## Fix 5 — nobody touches branch protection

**No lane agent changes branch protection on any lab, in either direction.**

The three protected labs — `fold-gate`, `order-leak`, `split-point` — stay as
pilots. The other five stay unprotected. Whether that spreads is the
maintainer's decision and is not delegated to the lane.

This matters more than it looks. Branch protection changes who can land what,
and it arrived in these three because individual builders turned it on
mid-lane rather than through any decision recorded anywhere. An agent adding it
to the remaining five would be making a fleet-wide access-control change as a
side effect of a test-harness fix. An agent removing it from the three would
silently disable the gate those labs' audits were conducted against.

If a lab's fixes need a pull request because it is protected, open one. That is
the whole accommodation required.

## Fix 6 — exercise the chain at a non-default step count

Fix 4 established that the fold count comes from `perFoldOps.length` rather than
a literal. **That is only ever demonstrated at one value.** The UI offers six
step counts — `2, 4, 8, 16, 32, 64` in the `#step-count` select — and
`verdicts.spec.ts` drives exactly one of them. Every chain interaction in the
file, in `driveEveryState` and in all four chain tests, is
`getByRole('button', { name: 'Fold 8 steps' })`.

So 7 is both the expected value and the only value, and three different things
hide in that coincidence:

1. **A literal fold count in the page would pass.** Nothing distinguishes
   `perFoldOps.length` from a hard-coded `7` when the only run has seven folds.
   The whole point of Fix 4's finding is unfalsifiable at a single count.
2. **The spec's own literals are correct by luck**, not by derivation —
   `toContainText('measured across 7 folds')` and `toBe(String(counted * 7))`.
   Fix 4 asks for the oracle to derive them; this is what proves the derivation
   actually happened.
3. **`driveEveryState`'s denominator misses whatever only renders elsewhere.**
   That function is what the marker-coverage test and the outside-marker test
   both enumerate over, so a marker — or an unmarked number — that appears only
   at 2 steps or only at 64 is outside the set those tests judge. It is the
   discovered-rather-than-declared denominator again, and it is the most
   expensive of the three, because it silently shrinks the coverage rule that
   the rest of this brief is built on.

**Two different requirements, and they do not have the same answer.**

*For the chain-claim oracle* — the tests that assert what the cost verdict says
— the default plus **64** is enough. 64 is the largest, it is where a
constant-per-fold claim carries the most weight, and it is furthest from the
default in every literal that could be hiding. Two runs break every literal;
running all six there buys little for the runtime.

*For `driveEveryState`* — enough is **all six**. It is not a test, it is the
DENOMINATOR that the marker-coverage test and the outside-marker test both
enumerate over. Anything that renders only at 2, 4, 16 or 32 is outside the set
those tests judge, and stays outside no matter how carefully the rules
themselves are written. A coverage rule applied to a set that was never fully
walked is the defect this whole brief exists to close, one level up from where
it was found.

### The rule, for all eight labs

> **`driveEveryState` visits every option of every control that changes what
> renders — each control on its own, not the full cross-product.**

Per-control, not combinatorial, is the whole point of it being affordable. Six
step counts plus four attack buttons is ten visits, not forty. The cross-product
would buy interaction coverage, which is a different question and not one the
marker rules ask. What the marker rules need is simply that no renderable state
is unreachable by the walk.

Every lab in the set has its own controls — selects, mode toggles, parameter
inputs, attack buttons. Enumerate them per lab rather than copying fold-gate's
list. A control that does not change what renders can be skipped, but say so in
the commit rather than leaving it to be inferred.

One practical trap for whoever implements it: **the button's label is dynamic.**
`src/ui/app.ts:456` sets `runChain.textContent = \`Fold ${next} steps\`` when the
select changes, and `:511` sets `Fold ${count} steps again` after a run. So
`getByRole('button', { name: 'Fold 8 steps' })` stops matching as soon as the
select moves. Select first, then locate the button by `#run-chain` or by the
label the count implies — do not assume the 8-step name survives.

This applies to every lab in the set that renders a claim over a variable-sized
run, not only fold-gate.

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
