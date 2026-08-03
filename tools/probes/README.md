# Fleet probes

Drop-in Playwright specs for bug classes that recur across demos. Copy one into a
lab's `e2e/`, run it, delete it — or keep it if that lab needs the guard.

## `hidden-attribute.spec.ts`

Reports any element carrying the `hidden` attribute that the browser still paints.

The UA stylesheet says `[hidden] { display: none }`, but **any** author rule that
sets a display on the same element beats it — author styles outrank the UA sheet
regardless of specificity. So a panel that ships `hidden`, whose class also
carries `display: grid` / `flex` / `block`, renders anyway, and every
`el.hidden = true` against it is a silent no-op.

Confirmed live in four labs so far:

- `rsa-forge` — six result regions painted before the learner ran anything, so
  empty byte rows and "—" placeholders showed for exhibits never executed.
- `stego-suite` — sequencing tips that never retired.
- `hpke-envelope` — a PSK panel visible *and focusable* in Base and Auth modes,
  which use no PSK.
- `aes-modes` — `predict-answer` spans rendering before the learner answers,
  which gives away the quiz.

Sampling six random labs found one affected, so this is recurring rather than
universal. 77 labs use the attribute without a `[hidden]{display:none}` guard,
which is the latent population — but only labs whose CSS sets a display on the
same element actually break, so run the probe rather than assuming.

The one-line fix is `[hidden] { display: none !important; }` in the lab's
stylesheet, which restores the attribute's meaning everywhere at once instead of
patching each class.
