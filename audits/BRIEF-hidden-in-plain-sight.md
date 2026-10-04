# Build brief — Hidden in Plain Sight

**2026-10-04. Brief only; nothing has been built.** Written against
`audits/_MASTER-TEMPLATE.md` — §0 principles through §6 deploy apply unchanged.

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
4. **Find it.** The lab's existing chi-squared detector runs on both images and reports: the
   original clean, the stego flagged. **The invisible change is not an undetectable one**, and
   that gap is the lesson.

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
- §4.1c: one mutation per rendered verdict — an extract that returns the message without
  reading the image, a detector hard-wired to "flagged", one hard-wired to "clean", and an
  embed that changes nothing while reporting success. Each must turn a NAMED test red,
  baseline-passed and bundle-hash-moved asserted first.
- **§4.1d negative claim — the belief a beginner most likely leaves with wrongly:** *"if I
  cannot see it, it is hidden."* A passing test asserts the detector **flags the stego image
  the reader has just been told is indistinguishable**. The section cannot show step 2 without
  step 4 contradicting the inference.
  Second negative, stated in-page: LSB hiding is not encryption — anyone who guesses the
  method reads the message, because nothing about it is secret except the technique.

## §4.1a note for the host lab

If `e2e/gate.ts` in this repository asserts product copy, this is the moment to move those
assertions into `e2e/claims.spec.ts`. A front-section changes copy, and a setup helper that
asserts a sentence will fail every test that imports it under a name that has nothing to do
with what changed.

## Start Here placement

**Off the spine, as an optional side-trip beside the classical ciphers.** Steganography is a
different goal from everything else on the path — it hides the existence of a message rather
than its content — and inserting it in the main line would break the thread running from hashes
through keys to the padlock. It belongs where a curious reader will find it, not where everyone
is walked through it.
