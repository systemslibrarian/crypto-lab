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

**Only `fold-gate` carries `enforce_admins: true`.** `order-leak` and
`split-point` both have it `false`, so protection there does not bind a repo
admin and a direct push by one is not rejected. Re-derived 2026-09-21 after the
lane's order-leak agent flagged it. "The three protected labs" are not
identically protected, and treating them as one class is how the exception rule
gets misapplied — which is the second correction this document has had to make
about its own protected-lab claim.

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

---

## Maintainer decisions, 2026-09-21

Recorded here rather than left in the transcript, for the reason at the top of this
file. All eight lane PRs were open and mergeable when these were taken:
`fold-gate#11`, `hidden-bit#7`, `order-leak#5`, `pqxdh-wire#4`, `privacy-pass#6`,
`proof-tally#8`, `sleeve-check#2`, `split-point#5`.

**D1 — a green check is the builder's side of the claim; merge on the auditor's.**
No lane PR merges until an independent auditor returns CONFIRMED on all six fixes
for that lab. SUSPECT holds the PR, it does not qualify it. Where a branch is
behind `main`, update it and let CI re-run before merging, so the verdict is about
the tree that actually lands rather than the tree that was audited. **Once
`fold-gate#11` has merged and passed, README:18's sentence — *"This NIFS alone is
neither zero-knowledge nor a succinct proof"* — goes back on the Fold Gate card**,
closing the item left open at the end of "The catalog side, answered".

**D2 — if the page cannot show the difference, it cannot claim it.** Two
measurements survive their own mutation set for the same reason: their oracle sums
terms that are equal by construction, and summing N equal terms is arithmetically
identical to multiplying one of them by N. No test written against these pages can
separate the two, so the mechanism word in the sentence beside each number is
unbacked.

| Lab | Marker | The word it cannot back |
|---|---|---|
| `proof-tally` | `replay-total` | *Summed over every submission* — the exhibit submits one report twice, so its two contributions are equal and a page that doubled the first is observationally identical |
| `sleeve-check` | `lottery-probability` | *probability of that run* — the exponent is one literal scaled by the run count; composing independent wins and scaling one figure are the same arithmetic |

Both are reworded **in their existing open PRs** to what the page can actually
demonstrate, with any mechanism word it cannot back dropped, and the limit noted in
each README. **Both are re-audited before merging** — a reword that weakens a
sentence still has to face the same gate.

**Adding a rendered case where the sum and the product differ is a design change,
not a harness fix, and is deferred to a separate decision.** It is the only thing
that would make either sentence provable, and it changes what the exhibit teaches;
that is not a call the lane makes on its way past.

**D3 — the majors pass stays parked until all eight lane PRs are merged.**

**D4 — fold-gate's RE-QUERY gets its own small PR, after #11 merges.** It is not
folded into #11. `dispatch-sync check` names `crypto-lab-fold-gate` as the fleet's
one remaining RE-QUERY: its dispatch is guarded by a second `gh pr view` of the PR
it just merged, so a failure of that call prints nothing, exits 0, and ships
nothing. It is a real defect and it is unrelated to the six fixes. Folding it in
would mean the thing that merges is no longer the thing that was audited, which is
the one property D1 exists to protect.

**D5 — a verdict names one tree, and merges only that tree.** Each auditor
records the PR head SHA it audited. **A PR merges only while its head is still
that exact SHA.** Anything that lands on the branch afterwards — a reword, a
follow-up fix, an update-branch merge from `main` — voids the verdict and the PR
is re-audited before it can merge.

This closes the gap that was already open in this document. The fold-gate audit
that produced the six fixes was conducted at `9dac554`; PR #11 is `ee829a17`,
the commit that *implements* those fixes. The audit and the PR were one commit
apart and it would have been easy to read the first as covering the second.
D1 says green checks are the builder's side; D5 says the auditor's side has to
name which bytes it was about, or it is not evidence about what merges either.

The SHA set these audits were commissioned against, re-derived from the API on
2026-09-21 and matching each local checkout exactly:

| PR | Head SHA |
|---|---|
| `fold-gate#11` | `ee829a1719e0` |
| `hidden-bit#7` | `d5e07a4c5204` |
| `order-leak#5` | `c7b7eccff0ec` |
| `pqxdh-wire#4` | `fec199b67372` |
| `privacy-pass#6` | `272f47322a7c` |
| `proof-tally#8` | `eae5824ad84e` |
| `sleeve-check#2` | `c788d966bd8b` |
| `split-point#5` | `521d03dae22d` |

Two of those already carry work that post-dates the original build: `proof-tally`
the D2 reword, `sleeve-check` the D2 reword plus the commit that cites
`LOG2_LOTTERY` and moves its oracle onto the citation rather than the page. That
is exactly why the head is recorded rather than the PR number.

Note the interaction with D1's other half: updating a branch that has fallen
behind `main` is itself a new head, so it voids the verdict. Where both apply,
update first and audit the result — never audit, then update, then merge.
