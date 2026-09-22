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
| `privacy-pass` | `build`, `verdict-coverage` — by an active RULESET, not legacy protection |
| `hidden-bit`, `pqxdh-wire`, `proof-tally`, `sleeve-check` | none |

**That `privacy-pass` row is a correction, and the way it was missed is the point.**
The first two drafts of this table read `none (404)` for it, because
`/repos/{repo}/branches/main/protection` answers **404 for a branch protected by a
repository ruleset** — the legacy endpoint cannot see rulesets at all. A 404 there
means "no LEGACY protection", never "unprotected", and reading it as the latter is a
checker reporting clean because it could not look: the third instance of that shape
this document records. `/repos/{repo}/rules/branches/main` is the question that
actually answers it, and it was not asked until the privacy-pass audit asked it.

Re-derived ruleset-aware across all eight on 2026-09-21: `privacy-pass` is the only
lab with a ruleset. It is named *"main: verdict coverage must pass"*, requires
`build` and `verdict-coverage`, also blocks deletion and non-fast-forward, and
carries `bypass_actors: []` with `current_user_can_bypass: never` — so it **binds
admins**, making it STRICTER than `order-leak` and `split-point`, whose
`enforce_admins: false` does not. It was created at `2026-09-21T05:06:29`, between
two of that lab's own lane commits: the mid-lane builder pattern Fix 5 exists to
stop, caught after the fact because nothing was watching for it.

So "the three protected labs" was wrong twice over: there are four, they are
protected by two different mechanisms, and the one this table called unprotected is
the one that binds admins hardest. Re-derive it with BOTH endpoints before relying
on it — this row has now been wrong in every draft that has existed.

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

---

## The audits, and what they returned

Eight independent auditors, one per lab, commissioned 2026-09-21 against the SHA
set pinned under D5. Every audit named its head SHA; every one matched; every tree
was left clean. **Result: one CONFIRMED, seven SUSPECT.**

| PR | Overall | Fixes that failed |
|---|---|---|
| `fold-gate#11` | CONFIRMED | — (two residuals, below) |
| `hidden-bit#7` | SUSPECT | 4 |
| `order-leak#5` | SUSPECT | 1, 4 |
| `pqxdh-wire#4` | SUSPECT | 4 |
| `privacy-pass#6` | SUSPECT | 4, 5 |
| `proof-tally#8` | SUSPECT | 1 |
| `sleeve-check#2` | SUSPECT | D2 |
| `split-point#5` | SUSPECT | 1 |

Fixes 2 and 3 hold in all eight, tested in both directions in every lab. Every
recorded mutation set is sound: 11 to 41 mutations per lab, all killed, none
survived, each on the marker its own record names.

**Two failures are systemic, not per-lab, and that is the finding.**

### Fix 1 is a source-text scan in all eight labs

Every lab implemented "the kill goes through the helper" as a substring or regex
match over spec source. Three auditors defeated it three different ways, and two
proved it by differential in an isolated tree — same source, same built bundle,
opposite outcome with only the spec changing, so a patch that never landed cannot
explain it:

- **Comment it out.** `fold-gate`: a live `data-result` flip on the chain verdict
  **ships green** because `expectVerdict(page, 'chain'` survives inside a comment.
  The page would serve `FOLDED 8 → 1, VALID` with its machine-readable result
  saying `fail`, gate green, and the mutation record asserting that exact case is
  covered. `proof-tally`: same shape, and the page it ships says a tampered proof
  was **ADMITTED**, painted alarm, with both the recorded kill and the coverage
  test that polices it green.
- **Keep the call, make it tautological.** `order-leak`: feed the helper values
  read off the page in the same test, apply the recorded mutation, and the
  attacker's auxiliary histogram loses every label — `["0","1","2","3"]` for
  `["Support","Finance","Research","Sales"]` — with the rule green.
- **Satisfy it from elsewhere in the file.** `split-point`: the rule is
  FILE-granular, so rewriting the killing assertion while leaving an unrelated
  helper call elsewhere leaves the recorded mutation alive through all 23 tests.
  Its tree already ships an instance: `tree-point`'s recorded `expectedFlip` is
  never observed on any run.

### Fix 4 failed in four labs, the same way each time

The oracle checks a rendered aggregate's current VALUE but not the SHAPE of the
claim beside it:

- `hidden-bit` — one switching-curve measurement replicated across every row of a
  table still captioned *"200 trials each"*: 35/35 green.
- `pqxdh-wire` — *"Three honest root updates completed"* is an English literal no
  oracle compares to the chain. Rendered live as *"Seven honest root updates
  completed"* over a four-root chain, gate green.
- `order-leak` — *"240 of 240 stored ciphertexts are distinct"* rendered beside
  *"1000 sealed rows"*, nothing red; its only oracle runs at the default row count.
- `privacy-pass` — a hard-coded `2` survives where a measured bucket count belongs
  (literal `3` is killed), and `kat-count` accepts even a WRONG literal, because
  its oracle checks the page only against itself.

Each is a builder fix, and three of the four auditors named the function in the
lab's own source that would close it.

---

## Maintainer decisions, 2026-09-22

**D6 — a mention is still not an assertion, one level down. Fix 1 as implemented
does not satisfy Fix 1.** A rule that a comment, a tautological argument, or an
unrelated line elsewhere in the file can satisfy is not enforcing "a marker's text
and its state are one claim". This applies to **all eight labs including
`fold-gate`**, whose audit returned CONFIRMED on the brief's literal wording while
its own auditor demonstrated a live state flip shipping green.

The fix, in every lab: **`expectVerdict`/`expectClaim` record the `(test title,
marker)` pairs they actually EXECUTE, and the coverage test asserts that every
mutation record's pair was observed at runtime.** All three auditors proposed this
independently. It is the same discovered-rather-than-declared correction the rest
of this brief makes — the denominator must come from what ran, not from what the
source says ran.

**Nothing merges until that lands.** `fold-gate#11` is held with the other seven.

**D7 — D2 reaches `scale-compare` and the lede in `sleeve-check`.** The
`lottery-probability` row is clean and under-claims, but the probability reading it
dropped was not retired — it moved one row down into `scale-compare`, a MARKED
verdict that calls the figure *"likelier / rarer than the TKlog coincidence"*, and
one paragraph up into an unattributed lede instructing the reader to *"Move the
scale until a run of lottery wins gets that rare"*. A marked verdict the gate judges
must not assert in the page's own voice what the page cannot show, so
`scale-compare` is reworded to the scale reading. The lede keeps Perrin's argument
and gains its attribution at the point of use, rather than being flattened.

Also corrected: the source comment and `README.md` both said the probability
reading was left to the attributed prose **above** the readout. Perrin's attributed
note is **below** it; what sits above is the unattributed lede. That claim was
false and is fixed.

**D8 — the `privacy-pass` ruleset stays, now that it is recorded.** Fix 5's point
is that access control does not change as a side effect of a harness pass, and that
holds in both directions: the lane does not remove it either. It is written into
the protection table above with its creation time and its bypass settings, so it is
no longer invisible, which was the actual defect. Whether that shape spreads to the
other seven is a deliberate decision for another day.

---

## A process finding the lane has to carry

**The eight auditors shared one Bash shell and one scratchpad directory, and it bit
three times.** `hidden-bit`'s `verdicts.spec.ts.orig` backup was overwritten by
another lab's agent using the same filename, briefly putting a FOREIGN spec into
that repo — caught by `git status` before any run used it. `privacy-pass` saw two
recorded mutations report as false survivors because the patch never applied in the
shared shell. `order-leak` found a `vite preview` and a Playwright worker it did not
start inside its own repo, and discarded an entire pass.

Pinned ports do not fix this; they prevent server collisions between labs, not
shared filesystem state or a shell whose working directory another agent moved.

**The rule that follows: any absence-shaped result — a mutation that SURVIVED, a
check that stayed green — must be proven by differential in an isolated tree.**
`git archive <sha>` into a private directory, `node_modules` symlinked, a port
nothing else holds, md5 of the source before and after, and proof the BUILT artifact
changed; where the bundle is content-hashed, its filename changing is that proof.
Best of all, read the mutated string back out of the rendered DOM.

This is not theoretical rigour. Re-verifying the four survivor-based SUSPECT
verdicts under that protocol, **three held and one of the auditors' own probes was
caught not having applied at all** — a `perl -0pi` that died on `${money(...)}`
interpolation, leaving both hashes unchanged while the page still printed the old
figures. It would have been reported as a survivor. A patcher that exits non-zero
unless exactly one occurrence is replaced is the minimum.

---

## D8 follow-on — the ruleset's provenance, and the census rule that follows

**When, exactly.** Re-derived 2026-09-22, all times `-0400`:

| | |
|---|---|
| `privacy-pass` commit `a4de0f0` | 2026-09-21 **05:05:53** |
| **ruleset 23758807 created** | 2026-09-21 **05:06:29** (36s later) |
| `privacy-pass` commit `7b3f10e` | 2026-09-21 05:13:23 |
| `privacy-pass` commit `f3beeba` (#5) | 2026-09-21 05:16:17 |
| this brief's first commit `3088cec` | 2026-09-21 08:13:41 |
| **Fix 5 written — `35345be`, "the branch-protection freeze"** | 2026-09-21 **08:17:17** |

**So the ruleset pre-dates Fix 5 by three hours and eleven minutes.** It is not a
breach of the freeze; the freeze did not exist yet. It is the behaviour the freeze
was written to stop, occurring before anyone had written it down — which is the
better reading of it and the reason D8 leaves it alone rather than treating it as
something to undo.

**Who — UNCHECKED, and it is not recoverable.** GitHub's rulesets API exposes
`created_at` and `updated_at` and **no creator field**; `GET /rulesets/23758807`
was read in full to confirm that. The audit-log endpoint is organization- and
enterprise-only and 404s for this personal account. Creating a ruleset needs admin
on the repo, which means the account owner's credentials — the maintainer directly,
or any agent acting with `gh` under that account — and the API cannot distinguish
those two. The 36-second gap after `a4de0f0` landed points at whoever was working
that lab at that moment, but that is **inference, not evidence**, and is recorded
as such rather than as a finding.

That unrecoverability is itself the argument for the next rule: if a protection
change cannot be attributed after the fact, it has to be *noticed* at the time.

**The census rule, from now on: a protection census asks BOTH endpoints.**

```
gh api repos/<owner>/<repo>/branches/main/protection   # classic; 404 means NO CLASSIC protection
gh api repos/<owner>/<repo>/rules/branches/main        # rulesets; [] means none
```

A 404 from the first **never** means unprotected. It means no *classic* protection,
and a branch can be fully protected — admin-binding, as this one is — with that
endpoint answering 404 the whole time. Every protection claim in this document
before 2026-09-22 rested on the first endpoint alone, which is why `privacy-pass`
read as unprotected through three drafts and two corrections.

This is the same defect this fleet keeps re-finding under different names: a
checker that could not see, reporting clean. `fleet-sync` exists because the
catalog could not notice a demo it was never told about. `gate-sync` was blind to
`peaceiris` publishers. `dispatch-census` exists because a lab can leave in silence.
Now: a protection census blind to rulesets. The shape is always a denominator taken
from the source that happens to be convenient rather than from the question being
asked.

---

## The runtime-pairs round, 2026-09-22

Eight builders, one per lab, implementing D6 and — in the four labs whose audit
failed it — Fix 4. All eight pushed to their existing PR branch. Nothing merged,
nothing under `.github/` touched in any lab, and the protection census is
byte-identical before and after: 1 ruleset, 3 classic, 4 none, 0 UNREAD.

**Under D5 every verdict in this document is now void.** The new heads:

| PR | Was | Now |
|---|---|---|
| `fold-gate#11` | `ee829a1719e0` | `2d475d0ec00d` |
| `hidden-bit#7` | `d5e07a4c5204` | `3f81e16ade4a` |
| `order-leak#5` | `c7b7eccff0ec` | `cf358d725296` |
| `pqxdh-wire#4` | `fec199b67372` | `e41d1dad59dc` |
| `privacy-pass#6` | `272f47322a7c` | `f63cc1ed5e60` |
| `proof-tally#8` | `eae5824ad84e` | `d8a11319dd06` |
| `sleeve-check#2` | `c788d966bd8b` | `878ca1f76705` |
| `split-point#5` | `521d03dae22d` | `8f39f7cde807` |

### A correction to D6

D6 generalised the FILE-granular escape to all eight labs. That was my inference
from three, not a measured fact about eight, and two builders disproved it:
`privacy-pass` and `hidden-bit` were already **body**-granular — their old rule
sliced the killing test's body rather than the whole file — so "an unrelated call
elsewhere in the file" did not defeat them on its own. Both demonstrated the
runtime rule against a harder compound form instead. D6's conclusion is unchanged,
because the COMMENT and the TAUTOLOGY defeated every lab; only the reach of the
third escape was overstated.

### What the round proved, beyond the fix

**Two labs' required CI check could not see part of what it claimed to judge.**
`proof-tally`'s `test:verdicts` ran only `verdicts.spec.ts`, so the new sink would
have had no observations and the runtime rule would have passed by having nothing
to check. `sleeve-check`'s ran only the `verdicts` project while `standing-verdict`'s
kill lives in `claims`, so that marker was never judgeable by the required check.
Both were found by building ON the gate rather than trusting it, which is the only
way this class is ever found. **A third, `privacy-pass`, is pinned by a workflow
line no lane agent may edit** — `npx playwright test e2e/verdicts.spec.ts` — and it
established empirically that Playwright applies a CLI file filter to top-level
projects but NOT to dependency projects, so the dependency still runs and the sink
is not empty.

**One measurement was unfalsifiable by its own rendered tolerance.** `hidden-bit`'s
switching curve ran 200 trials, where the rendered tolerance is 0.381 — WIDER than
the entire 0.004–0.380 spread the curve covers at n = 8. Every row sat inside every
other row's tolerance, so a replicated curve was indistinguishable by construction
and no oracle written against that config could have caught it. At 2,000 trials the
tolerance is 0.121 against ~0.022 sampling noise. The exhibit's own parameters, not
its oracle, were the reason the claim could not be checked; costs 2.1s.

### Four divergences the round created, which no single lab can settle

1. **When the pair is recorded.** `fold-gate`, `proof-tally` and `privacy-pass`
   record at helper ENTRY — "the call was reached". `order-leak`, `pqxdh-wire` and
   `hidden-bit` record AFTER the assertions pass — "the check held". They agree on
   a green run, which is when the rule is evaluated, so both work today.
2. **Teardown or dependent project.** `proof-tally` and `pqxdh-wire` throw from
   `globalTeardown`, explicitly because **a dependent project is SKIPPED when its
   dependency fails** — the run where a mutation is applied is exactly the run where
   the answer matters. The other six use a project with `dependencies:`;
   `fold-gate` independently identified the same skip behaviour and documented it
   in its config rather than changing approach. The gate holds either way — that run
   is red regardless — so the cost is diagnostic, not strength.
3. **How much the record pins, and therefore how strong the rule is.** From weakest
   to strongest: a bare `(spec, test, marker)` triple (`privacy-pass`, which MEASURED
   the consequence — a decoy call on the same marker in the same test satisfies it,
   17 passed, exit 0); plus a healthy-state pin (`proof-tally`); plus a declared
   status and verbatim fragment (`split-point`); the ledger's own finding sentence
   (`sleeve-check`); ORDERED `(text, state)` pairs (`hidden-bit`, ordered rather than
   membership because a two-branch test under a branch-swapping mutation returns the
   same pairs reversed); and the full pinned claim as the record's own key
   (`pqxdh-wire`, where the keys ARE the covered set so two lists cannot disagree).
4. **How the tautology is caught at all.** Five mechanisms: static one-hop taint
   (`fold-gate`), healthy-state pin (`proof-tally`), prior declaration
   (`split-point`), runtime taint of read helpers (`order-leak`), and wrapping
   Playwright's value-extraction methods to flag a raw read of a ledger marker
   (`sleeve-check`). `privacy-pass` does provenance to a fixed point over the
   expectation's identifiers.

### The one thing all eight agree on

**Runtime observation cannot see a tautology.** `pqxdh-wire` put it plainest: on an
unmutated page a tautological argument is byte-identical to a correct one, so no
rule reading a green run can separate them. Every lab closes it by some form of
PRIOR DECLARATION or by tainting the read — never by observation.

And the residual that follows is unanimous: **a measurement has no honest thing to
pin.** Its expectation is recomputed from the run on purpose (a Wilson interval, an
exact collision probability, a derived total), and pinning its value would restore
the literal that Fix 4 exists to remove. So a tautological `expectClaim` is
invisible to every rule in this round, in all eight labs, and is caught only by the
mutation sweep reporting a survivor. Three builders wrote this into their README
unprompted; `split-point` stated the general form: closing it needs something the
record can decide in advance ABOUT A MEASUREMENT, which is a design question, not a
harness one.

### Playwright facts this round established, each probed rather than assumed

- `test-results/` is wiped BEFORE `globalSetup`, so a sink written there must be
  created lazily by the first append, or live outside `outputDir`.
- A throwing `globalTeardown` exits 1 and runs after every test.
- A dependent project is skipped when its dependency fails.
- `config.grep` stays `/.*/` on Playwright 1.63 when `--grep` is passed at the CLI;
  the filter is applied there and is visible in `config.argv`. Reading `config.grep`
  made `hidden-bit`'s rule fire on all nineteen records a filtered run never asked
  for. Its fallback when argv is unavailable is "not filtered" — the strict side —
  so a future Playwright makes mutation runs go red rather than making the rule
  vacuous.
- `globalSetup` must be an absolute `fileURLToPath(...)` path: a relative one
  resolves against the resolver's idea of the config dir and breaks in exactly the
  archived-tree-with-symlinked-`node_modules` isolation this lane mandates.

---

## Maintainer decisions, 2026-09-22 (second set)

**D9 — one mechanism, and it is `pqxdh-wire`'s.** The runtime-pairs round produced
six variants of D6. They are not equally strong, and the lane does not get to keep
six. All eight labs adopt this combination:

1. **The record pins the CLAIM, keyed by marker.** `kills: { <marker>: { test, claim } }`,
   where the keys ARE the covered set, so the record and the coverage list cannot
   disagree — there is no second list to drift.
2. **The pair is recorded AFTER the assertions pass**, so "observed" means executed
   and held, not merely reached.
3. **The check runs from a throwing `globalTeardown`**, not a dependent project.
4. **The tautology is caught at runtime by tainting the read** (`order-leak`'s
   mechanism): read helpers taint what they return, and an assertion helper refuses
   a tainted expectation.

**`privacy-pass` settles the pinning question, by measurement rather than argument.**
Its rule keyed a bare `(spec, test, marker)` triple, and it probed the consequence
rather than reasoning about it: a DECOY `expectVerdict` on the same marker in the
same test satisfies the triple while the real assertion is weakened to text — **17
passed, exit 0**. A pinned claim refuses that decoy, because the decoy does not carry
the recorded claim. Six labs shipped a rule a decoy defeats; one measured it.

**The teardown question is settled by what a dependent project does when its
dependency fails: it is SKIPPED.** That is exactly the run where a mutation is
applied and the answer matters most. The gate is red either way, so this costs
diagnosis rather than strength — but a coverage rule that goes quiet on mutation
runs is the wrong shape for a harness whose whole purpose is mutation runs.
`fold-gate` found the same behaviour independently and documented it in its config
instead of changing approach; that is the weaker of the two responses.

**Recording after the assertions pass** is chosen over recording at entry for the
same reason the pin is chosen over the triple: it is the reading that cannot be
satisfied by less.

Bring the eight labs to this bar BEFORE re-auditing. Re-auditing eight labs against
a bar that has not been set would grade six different mechanisms against one
sentence, and any standardisation afterwards voids all eight verdicts again under
D5.

**D10 — a measurement with nothing to check against is not a verified claim, and
must not wear the badge of one.** Every builder in the round reported the same
residual independently: runtime observation cannot see a tautological `expectClaim`,
and a measurement has no honest thing to pin, because its expectation is recomputed
from the run on purpose and pinning its value would restore the literal Fix 4 exists
to remove.

Name the defect correctly and the remedy follows. **A tautological `expectClaim` is
a claim checked against itself** — the same shape as a figure inherited from its own
budget, which this fleet already has a rule about. There is nothing independent to
compare against, so no amount of pinning fixes it. Pinning was always the wrong tool.

So: **every `expectClaim` names its source of truth**, and there are three kinds —

- an **external constant** (a figure from a cited document),
- a **published known-answer test**,
- or a value **re-derived by independent code** under `verification/`.

A measurement with none of the three is **not a verified claim**. It is labelled
**measured, not verified** — in the manifest and on the page — and covered by a
mutation sweep that fails on a survivor. It must not carry the same badge as a
checked claim. The point is not to forbid such measurements: a page may legitimately
render a number nothing independent can confirm. The point is that a reader, and the
next auditor, must be able to tell which kind they are looking at, and today they
cannot, because both render identically.

---

## A correction to the runtime-pairs round record

**`hidden-bit`'s Fix 4 parameter change was reported but not landed.** That builder's
report states: *"The config moves 200 → 2,000 trials and q 16 → 32, and that is
load-bearing rather than caution"*, with the analysis that at 200 trials the rendered
tolerance is 0.381 — wider than the entire 0.004–0.380 spread the curve covers — so
every row sits inside every other row's tolerance and a replicated curve is
indistinguishable by construction.

Re-derived from the branch at `3f81e16` on 2026-09-22: `src/ui/switching.ts` carries
marker additions only, its controls still default to q = 48 and 400 trials per point,
and `e2e/claims.spec.ts` still drives the switching test at **q = 20, trials = 200**.
The oracle was strengthened; the parameters it depends on were not.

By that builder's own analysis the oracle therefore still cannot discriminate a
replicated curve at the count its test runs. **The fix is incomplete, and its own
report is the evidence.** This is a reminder that a builder's report is the builder's
side of the claim in exactly the way D1 says a green check is — and that a re-audit
has to read the tree, not the report.
