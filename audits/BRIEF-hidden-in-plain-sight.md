# Build brief — Hidden in Plain Sight

**2026-10-04. BUILT and merged as `crypto-lab-stego-suite#22`.** Written against
`audits/_MASTER-TEMPLATE.md` — §0 principles through §6 deploy apply unchanged.

> **Corrected 2026-10-04, during the build.** Step 4 as first written below said the
> detector would flag the carrier, and the lesson was *"invisible is not undetectable."*
> **That is not what this lab's detector does.** Measured against its own sample image:
> one sentence changes 76 of 65,536 pixels (~0.14% of capacity) and the global chi-squared
> test does not move until roughly **98% of capacity — about 23.5 KB of hidden data**. The
> lab's own payload curve already said so: *"the global test only flags the carrier as the
> payload nears full capacity."*
>
> Padding the picture to make the detector fire, while telling a reader one sentence was
> hidden, would have passed every test and taught something false. **What was built
> instead:** step 4 reports nothing found on BOTH pictures, a new step 5 fills the picture
> and it IS found, and the §4.1d negative claim is the sharper one —
> **"a clean result is not proof that nothing is hidden."** The reader has already read the
> message out of the carrier the detector just called clean.
>
> Two further things the build established, recorded so they are not re-derived:
> filling with the sentence repeated to capacity does **not** trip the detector either
> (repeated ASCII is bit-lopsided; the test keys on the 50/50 evening-out a *random*
> payload produces, which is also what the lab's own curve uses), and the section's buttons
> needed `--control-border` rather than `--border` to clear WCAG 1.4.11 at 3:1.
>
> The original step 4 and its negative claim are left below, struck through, so the mistake
> is visible rather than quietly rewritten.

**Verdict: a beginner front-section inside `crypto-lab-stego-suite`. No new repository.**

```
FRONT-SECTION BRIEF
- Host repo:         crypto-lab-stego-suite  (no new repo)
- Section heading:   Start here: hide a message in a picture
- Placement:         between the hero and Exhibit 1, ahead of the cover-image picker
- Concept to teach:  Hiding a message is a different goal from scrambling it - and "you cannot
                     see it" is not the same as "nobody can find it".
- Primitives/spec:   the lab's own LSB embed/extract and chi-squared steganalysis, reused
- Accent/favicon:    unchanged - the host lab keeps its own
- In scope:          embed, look, extract, detect - four button presses, no parameters
- Non-goals:         DCT and adaptive embedding, payload-rate curves, the detector's internals
```

## Overlap check — what I read, and why this is not a new repo

I opened **Stego Suite** and **J-UNIWARD**.

Stego Suite already contains, in order: *"Exhibit 1 — Steganography vs Cryptography: Two
Different Goals"*, *"Exhibit 2 — LSB Substitution: The Simplest Technique"* with a **"Watch one
bit hide at a time"** stepper, and *"Exhibit 3 — Chi-Squared Steganalysis: Detecting LSB"*
which opens *"First, the whole idea in one picture"*. Its controls include **Embed message**,
**Extract message**, **Test cover image**, **Test stego image** and **Run payload detectability
curve**.

That is the requested lab — embed, see that it is invisible, watch analysis find it — already
built, already real, and already partly written in plain language. What it is not is **the
opening**: the page begins with a cover-image picker and three embedding methods, and the
reader has to know which exhibit to read first.

A new repository would rebuild LSB embedding and a chi-squared detector that already exist here
and work, and would then have to be kept in step with them. The honest fix is a front-section
that uses the machinery below it. J-UNIWARD is the JPEG-domain, cost-map lab and is a fair
Advanced sibling; it gets no front-section.

## The section — four button presses

1. **Hide it.** A fixed sample image and a short message, one button. No method picker, no
   payload rate, no key field.
2. **Look at it.** Original and stego side by side, full size. They are indistinguishable, and
   the section says so plainly — *and* gives the number of pixels that actually changed, which
   is arithmetic and makes the point sharper than the picture does.
3. **Get it back.** One button extracts the message, proving something really is in there.
4. ~~**Find it.** The lab's existing chi-squared detector runs on both images and reports: the
   original clean, the stego flagged. **The invisible change is not an undetectable one**, and
   that gap is the lesson.~~
   **AS BUILT — "Try to find it."** The detector runs on both pictures and reports **nothing
   found on either**, including the one carrying the sentence the reader has just read back.
5. **AS BUILT — "Now fill the picture up."** The same method, picture and detector, with a
   payload big enough to use the whole picture: now it is found. At that payload the change
   has also stopped being invisible, which the section names rather than letting the reader
   notice unaided.

Closing line: one sentence on the difference from encryption — a scrambled message is obviously
a message; a hidden one is not meant to look like anything — pointing at Exhibit 1 for the full
treatment, and at the DCT and adaptive exhibits for what people do about step 4.

## Keeping it real with the maths hidden

Every step calls the lab's existing functions. **No bit planes, no chi-squared statistic, no
p-value, no bits-per-pixel** in the section itself; the detector's verdict is rendered as
"clean" / "flagged", with the statistic and threshold in a `<details>` that points into
Exhibit 3. The pixel-change count is a plain count.

## Visual semantics

Step 2 must read as **neutral** — two images that look the same, no badge on either. Step 4's
"flagged" is **not an alarm about the lab**; it is the correct behaviour of a detector and the
point of the section, so it reads as a finding, not a failure. Icon plus text plus colour, as
everywhere.

## Tests

The host lab's existing suites stay as they are; this adds to them.

- Round-trip: the extracted message equals the embedded one, byte for byte.
- The detector's two verdicts are asserted as **computed** outcomes on the two images, not as
  strings: clean on the cover, flagged on the stego.
- `e2e/claims.spec.ts` (§4.1b) drives the four buttons in order and asserts each rendered
  verdict.
- §4.1c: one mutation per rendered verdict. **As built, five:** a read that answers without
  consulting the picture, a detector hard-wired to find something, one hard-wired to find
  nothing, an embed that changes nothing, and a read aimed at the wrong picture. Each turns a
  NAMED test red, baseline-passed and bundle-hash-moved asserted first. 5 of 5 KILLED.
- ~~**§4.1d negative claim:** *"if I cannot see it, it is hidden."* A passing test asserts the
  detector **flags the stego image** the reader has just been told is indistinguishable.~~
  **AS BUILT — §4.1d negative claim:** *"a clean result is not proof that nothing is hidden."*
  A passing test asserts, on one page in one run, that the carrier the detector reports as
  clean is **demonstrably carrying a message the reader already recovered from it**.
  Second negative, stated in-page: LSB hiding is not encryption — anyone who guesses the
  method reads the message, because nothing about it is secret except the technique.

## §4.1a note for the host lab

If `e2e/gate.ts` in this repository asserts product copy, this is the moment to move those
assertions into `e2e/claims.spec.ts`. A front-section changes copy, and a setup helper that
asserts a sentence will fail every test that imports it under a name that has nothing to do
with what changed.

**As built: left alone, deliberately.** `gate.ts` does assert product copy, but inside
`driveAllStates`, where the assertions act as "wait until this state exists" guards rather
than setup assertions — and this change altered no existing copy. The new section's own
assertions live in `e2e/first-look.spec.ts`. The hazard stands and is recorded here rather
than swept.

## Start Here placement

**Off the spine, as an optional side-trip beside the classical ciphers.** Steganography is a
different goal from everything else on the path — it hides the existence of a message rather
than its content — and inserting it in the main line would break the thread running from hashes
through keys to the padlock. It belongs where a curious reader will find it, not where everyone
is walked through it.
