# `hidden` that does not hide — the defect class, and how to check it

## The mechanism

The UA stylesheet says:

    [hidden] { display: none }

`[hidden]` is an **attribute selector**, specificity **(0,1,0)** — exactly the same as a
class selector. So:

- `.ledger { display: grid }` beats it whenever it comes later in the cascade, which
  author styles always do relative to the UA sheet.
- An author's own `[hidden] { display: none }` **without `!important`** does NOT reliably
  fix it either: same specificity as `.ledger`, so whichever comes later wins. If the
  override sits near the top of the file — the natural place for a reset — every class
  rule below it beats it.

Only `[hidden] { display: none !important }` is robust.

## Why it is a teaching defect, not just an a11y one

Every instance found so far revealed something the lab meant to withhold:

- `paillier-gate` — a 542x361 ledger of a homomorphic addition that had not happened,
  every value slot empty, plus a hand-off button for a ciphertext that did not exist.
- `aegis-gate` — Exhibit 3's output, including the row "B recovered from C_A, C_B, and
  known A", sitting directly under the Predict prompt that asks the visitor to guess
  exactly that.
- `mac-race` — "What the server actually hashes — SHA-256(secret ∥ forged bytes)" with the
  forgery's structure laid out, before the attack was run.
- `enigma-forge` — an import dialog and a full-width presenter overlay whose ✕/Prev/Next
  controls were focusable.

The markup already said `hidden`. The intent was right; the cascade silently discarded it.

## How to check it — measure, do not infer

Static reasoning about this is a trap and I fell into two of them:

1. **Filtering to repos with no `[hidden]` rule is unsound** (see specificity above): a repo
   with a non-`!important` override can still be broken.
2. `grep -rh '\[hidden\]' repo | head -3` reports a repo as unfixed when the `!important`
   is on the fourth matching line. Truncated greps answer a different question.

So: start the lab's own vite dev server, load the page, and ask the browser.
`scratchpad/hiddencheck.mjs` does exactly that and prints every element carrying `hidden`
whose computed `display` is not `none`, with its size and text.

Validate before trusting a null: it reproduces paillier-gate's 2-of-6 pre-fix and 0 post-fix.

## Known coverage gap

The check runs at **first paint only**. A repo reporting `total: 0` has no `[hidden]`
elements at that moment — the check is *silent* about it, not clean. Elements that only
get `hidden` after an interaction are equally exposed and are not covered. Driving each
lab's states first would close this.

## The fix

Add near the top of the stylesheet, and say why:

    [hidden] { display: none !important; }

Fix the root, not the one colliding class — otherwise the next `display` on a hideable
class silently reintroduces it, which is how every instance shipped.

Regression test: assert the property for EVERY element carrying `hidden`, and assert the
count is non-zero so it cannot pass vacuously. Mutate with `display: revert` to prove it
bites.
