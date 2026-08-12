You are continuing a fleet-wide accessibility-gate remediation across ~176 sibling repos under /Users/gmcas/repos/. Work the repos listed at the top of this task, in order, ONE AT A TIME, end to end.

## The problem

Each still has the old template `e2e/a11y.spec.ts`: it suppresses motion (and sometimes opacity) via `addStyleTag`, and is typically violations-only, single-theme, single-viewport, and either `revealAll()`s every panel (a document no visitor can load) or drives the lab and scans ONCE at the end (so every state it built is thrown away unmeasured). Several never interact with the page at all.

Motion suppression by style tag is not merely cosmetic: it BYPASSES the lab's own `@media (prefers-reduced-motion: reduce)` block instead of exercising it, so it cannot catch the defect where an element's only route to its visible state is an animation the reduced-motion block cancels without restoring the end state. Opacity injection is worse — it fabricates contrast results outright.

## What to build

Replace the spec with an honest gate. **Copy `e2e/gate.ts` and `e2e/contrast.ts` from /Users/gmcas/repos/crypto-lab-drbg-arena — the current version.** It carries all three `contrast.ts` fixes found so far: the visibility guard tests DOCUMENT space (`r.bottom + window.scrollY`), it skips elements whose own `clip`/`clip-path` reduces them to zero area (the `.sr-only` idiom paints nothing but keeps a 1x1 rect and passes `checkVisibility()`), and it composites the ROOT's canvas background before falling through to white (CSS paints the root background over the whole canvas regardless of the root's box). Verify all three are present in whatever you copy; do not reintroduce an older form. Read both fully before adapting. Their header comments cite specific elements of THAT lab; rewrite them for the lab you are in — a stale comment is a false claim about the repo it lands in. Delete any helper you do not call rather than shipping another lab's prose in its docblock.

The gate must:
- `page.emulateMedia({ reducedMotion: 'reduce' })` BEFORE `goto`, then **assert the preference took effect**. Inject nothing. Never force-reveal panels or `<details>` from script — click the summary.
- `page.setDefaultTimeout(20_000)`.
- Four configurations: **{dark, light} × {1280, 380}**.
- **`driveAllStates`** — every tab, panel, error and empty state, prerequisite/locked state BEFORE the unlock, every branch of any mode fork, and every Reset. **Scan after every single step.** Wait on real completion signals, never a fixed timeout.
- The oracles in the copied `scan()`: axe `violations`; axe `incomplete` except `color-contrast`; the arithmetic contrast oracle; scrollers keyboard-reachable; no horizontal document overflow; plus `expectNotBlank`, which catches the reduced-motion end-state defect.

**Do not reintroduce any of the three fixed oracle bugs.** They are instructively different: the viewport-space guard HID failures (26% of one page at the end of a drive), the `.sr-only` gap INVENTED them (1.15:1 for text nobody can see), and the canvas-background gap did BOTH.

**Two whole classes of failure have NO oracle at all — you must measure them by hand from real screenshot pixels:**
- **WCAG 1.4.11 non-text contrast** (3:1 for control boundaries and meaningful graphics). Check every button fill against its card, every border that is the only thing delineating a control, and every selection/highlight stroke against what it marks. Three labs so far had a button fill within 1.2:1 of its own panel, and in one the stylesheet's header comment asserted "UI components >= 3:1" while the buttons measured 1.09:1. **A comment is not evidence.**
- **Generated content** (`::before`/`::after`). axe and the arithmetic walk both operate on elements; a pseudo-element is neither. One lab's duplicate-block marker — the non-colour cue its exhibit exists for — measured 1.00:1.

## Hard-won lessons — each cost a run

**Verify the gate BITES.** Mutate a colour so it must fail, in a LATE driven state; confirm it goes red in the configs it should and names that state; revert. First probe `getComputedStyle` in that state to confirm the value MOVED, and that the element owns a text node of its own. Eleven invalid-mutation modes so far: dead code; an `aria-hidden` decoration; a later same-specificity rule; a two-class rule beating a one-class rule; the 3:1 large-text threshold; the element not visible in that state; a later declaration in the SAME block; a duplicate selector elsewhere; a PLACEHOLDER at first paint; and the element owning no text because every character is in a child span.

**ASSERT THE LAB'S DEFAULTS, NEVER ASSUME THEM.** Four times in this sweep an assertion about initial state caught a wrong assumption. One lab ships with its "cheat" toggles ON, so its old gate had been scanning the failing tones and never the passing ones. A gate that scans one configuration scans one HALF, and which half depends on the defaults.

**Stale preview servers have invalidated runs.** `pkill -f "playwright test"` does NOT kill vite preview. After any interrupted run: `lsof -nP -iTCP:<port> -sTCP:LISTEN`, kill by PID.

**Check `webServer.command` includes `npm run build &&`.**

**Soft-gate collection pass.** Run all four configs once with assertions collected rather than thrown, dump everything, fix in one pass. The best shape (vrf-gate) is permanent and safe: a `softExpect` strict unless an env var is set, plus a `reportCollected()` that FAILS if a collecting run recorded anything — so a collection run can never be mistaken for a passing gate. If you hand-patch a try/catch instead, restore from a saved copy and DIFF for zero residue before committing.

## Defect patterns to pre-check — all confirmed repeatedly

- **A blanket rule that beats every element's own colour.** `[data-theme='light'] button { color: #fff }` is (0,1,1) and beats any single-class rule a button sets for itself — one lab's word chips painted white on near-white, 1.12:1. Grep for `[data-theme=...] <element> { color }`.
- **Theme persistence:** `index.html`'s anti-flash script must read the SAME localStorage key the shared header's toggle writes (`'theme'` in 159 of 165 labs). A mismatch means the theme silently never persists. Check it.
- **Where a palette defines an ink variant per semantic hue, find the hue left out — then find the state that would have shown it.** 5 confirmed instances.
- **A palette that defines a component-boundary token and applies it only to `select`/`input`.** Compare `grep -c 'var(--control-border)'` against `grep -c 'var(--border-strong)'`; one lab's ratio was 1:13, and its old 1.4.11 check queried exactly the three controls where the rule was already kept.
- **When a contrast fix does not move the measured number, the cascade ate it.** One fix used `.verdict a` (0,1,1), which loses silently to `#app a` (1,0,1) — the declaration was in the file and the ratio did not budge. Re-measure after every fix.
- **`aria-label` on the root `#app` div** — prohibited, silently discarded, `incomplete`-only.
- **A defect that only exists in a state the drive has to build.** One lab's `role="log"` regions do not overflow at the shipped default; the 2.1.1 failure appears only once a length control is moved to maximum. Drive the extremes of every slider and input, not just the defaults.
- **An ink measured against one surface, used a surface deeper** — and its mirror: **measure a token against the DARKEST surface it lands on.**
- **A class lifted out of the container it was written for** (e.g. a `.hero-metric-label` whose near-white ink exists only because its card paints near-black; reused in a footer, 1.09:1).
- **`opacity` on an SVG `<g>` fades the label with the shape, and a child cannot opt out.** Dim the shape, not the group.
- **A light theme that never got its own accent inks.**
- **A `prefers-reduced-motion` block that CREATES a defect** — grep every such block for declarations that are not `animation`/`transition`/`scroll-behavior`.
- **An always-dark panel in a light theme needs an override for EVERY muted token used inside it.**
- **Opacity used to de-emphasise where another cue already says the same thing.** Opacity compounds. A dimmed *enabled* control gets no inactive-component exemption.
- **`aria-hidden` on an element carrying real live output** — BOTH oracles skip it, a shared blind spot.
- **Grid auto-track sizing** — bare `1fr`/`auto` take min-content minimums; `minmax(0, 1fr)`, including in `max-width` overrides. `overflow-x: auto` zeroes that floor ONLY when the scroller IS the grid/flex item. A single-column `display: grid` with no `grid-template-columns` is an implicit `auto` track. Flex twin: `flex: 1` leaves `min-width: auto`.
- **An unbreakable hex/base64 token in prose** — `overflow-wrap: anywhere`, NOT `break-word`.
- **`aria-label`/`aria-labelledby` on a role-less element** is PROHIBITED and silently discarded; axe files it under `incomplete`, never `violations`.
- **An empty `role="list"`** (`aria-required-children` on every load); **`role="grid"` with no `row` layer**; **`aria-controls` pointing at an absent id**; **`aria-invalid` cleared only in the submit handler**.
- **`role="log"` scrollers** only overflow after a long run — a systematic 2.1.1 miss.
- **A re-entrancy guard inside the step instead of on the click** — a batch runner sets `state.auto` and the functions it calls open with `if (state.auto) return`, so the button silently does nothing.
- **A highlight/selection stroke that does not contrast with what it highlights** (1.4.11; no oracle checks it).
- **Fixed hex colours inside a themed SVG** — `var()` works in SVG presentation attributes.

## Rules

- **Fix the real defects. Do not weaken the gate to make it pass.** If something looks like a defect but is not, say so with the measurement that cleared it.
- If a finding is in the LAB'S SOURCE and is a genuine correctness or teaching bug, fix it and call it out.
- Full suite (unit + browser) **twice, green both times**, before committing.
- Commit per repo, push to origin main, trailer `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- Leave each tree clean; kill any preview servers you started.
- Do NOT edit /Users/gmcas/repos/crypto-lab/TASKS.md — report your notes.

Report per repo: commit sha, defect count, each defect with measured before/after numbers, the mutation and what it proved, anything that looked like a defect but was not (with the measurement), and any NEW pattern worth a fleet-wide grep.

---

## Lessons added 2026-08-11, after ~20 more repos

### How the old gates fake passing — say what yours did, in the commit

Read the spec you are replacing before deleting it. Every one of these was found in a real
repo, and naming the mechanism is the durable part of the work:

- `if (await btn.count())` guarding each drive step — a missing control **skips silently
  instead of failing**.
- Stripping `hidden` from every element and adding `active is-active open` to each,
  assembling **a document no visitor can reach** (custom-mask inputs and a Cancel button for
  a measurement that is not running, together).
- Scanning only AFTER the whole drive, so **every state built was overwritten before
  anything measured it**.
- Driving at 380px, scanning, then toggling the theme and scanning again **without
  re-driving**.
- A 1.4.11 check querying **exactly the selectors the correct token was already applied to** —
  self-confirming, and found in THREE separate repos (`lattice-gentle`, `lll-break`,
  and again in a third). If you see a border-contrast spec, check what it selects before
  trusting it.

### New defect patterns

- **A token is only safe against the surfaces it was chosen for.** `--text-muted` cleared
  4.5:1 against every *page* surface, but a `.cell--bad` composited an alarm tint to
  `rgb(229, 190, 175)` — a surface those numbers never described — and the ink measured
  **3.95:1** there. When a state tints a background, re-measure the ink on the composite.
- **`[hidden]` has specificity (0,1,0), identical to a class**, so any later
  `.foo { display: … }` beats it and the attribute silently does nothing. Seven labs had
  this. Check by setting `hidden` on an element and reading the computed display — do not
  infer from the CSS. Fix at the root with `[hidden] { display: none !important }`, never by
  renaming the one colliding class.
- **Fixing reflow can expose a keyboard defect it was masking.** After a 1.4.10 fix, axe
  immediately flagged a scrollable region with no `tabindex` — not a violation before *only
  because the panel was too wide to ever scroll*.
- **Anything given `tabindex="0"` needs a visible focus indicator** (2.4.7). One pass made
  seven regions focusable and left them all without one — a defect introduced by the fix.
- **A green axe run is only as broad as its rule set.** One repo had a skip link pointing at
  an element that does not exist; axe never flagged it, because its skip-link rule is
  best-practice, not WCAG A/AA.
- **Reflow: fix the cause, not the element the checker names.** A grid item's automatic
  minimum size is its min-content, so ONE wide panel sizes the whole page's column. In one
  repo the overflow check named `.hero` and the cause was a comparison table three panels
  down. Measure min-content per grid item.

### Mutation testing — a trap that certifies nothing

**Beware fixes whose halves are each independently sufficient.** In one repo the fix was
`31 - Math.clz32(diff >>> 0)`; `>>> 0` and `clz32` *each alone* prevent the bug, so reverting
one token leaves the test passing and "proves" it bites when it does not. **Revert the whole
fix**, and if a shared helper masks the effect, isolate the case and re-run it alone.

Also still true, and still catching people: a mutation that leaves an unused variable breaks
`tsc`, Playwright then serves the last good `dist`, and the suite passes green against source
that no longer compiles. **Confirm the build succeeded during every mutation.**

### Timing findings are usually contention

Two "defects" reported this week were pure resource contention: a suite reported at 17.5
minutes runs in **15.6s** alone, and a "5.7-minute test configuration" was part of a suite
that runs in **56s** alone. Never run two repos' suites at once, and re-measure any timing
anomaly in isolation before reporting it.
