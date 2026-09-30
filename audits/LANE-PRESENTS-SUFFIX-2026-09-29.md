# Lane brief — PRESENTS is anchored on a prefix, and the giveaway is sometimes a suffix

**Status: brief only. No code changed. Opened 2026-09-29 out of the SM9 Forge carding lane,
which found it and handled its own case with a review pin instead.**

## The observation

`catalog-evidence.js` guards the declaration shape with:

```js
const PRESENTS = /^(?:render|draw|paint|format|describe|explain|label|display|chart|plot|tooltip|caption|legend|summar|narrat|annotate)/i;
```

The `^` is load-bearing and also the limit. `crypto-lab-sm9-forge` declares

```ts
function bonehFranklinDiagram(): HTMLElement {
```

which draws Boneh-Franklin IBE as the contrast to SM9's inversion and computes nothing. It
carries its giveaway as a **suffix**, so `PRESENTS` misses it and the decl shape credited the
lab with implementing Boneh-Franklin IBE. That claim was removed by a hand review
(`remove: ["Boneh-Franklin IBE"]` in `tools/catalog-reviewed.json`), which is the right patch
for one lab and not a fix for the class.

This is the third member of one family, and the family is worth naming:

| guard | catches | missed |
|---|---|---|
| `PRESENTS` | a function that DRAWS an algorithm | a function whose drawing verb is a suffix |
| `MODELS` (landed in #59) | a const whose VALUE is a projection | — |
| — | — | this brief |

## What a suffix-aware guard would cost — measured, not guessed

Static count over all 213 sibling clones: identifiers that (a) are declared, (b) match a
vocabulary term, and (c) end in `Diagram|Chart|Figure|Illustration|Panel|View|Graphic|Sketch|Visual`:

- **35 identifiers across 19 labs**
- of the sample inspected, **6 are already caught** by the existing prefix (`renderHkdfDiagram`,
  `renderEcdhPanel`, `renderFrostPanel`, `renderHmacPanel`, `renderShamirPanel`, `renderDHVisual`)
- **20 are not caught today**, and their leading verbs are `build`, `wire`, `mount`, `init`, or
  nothing at all — `lwePanel`, `kyberPanel`, `dilithiumPanel`, `hmacPanel`, `bcryptChart`

That 20 is an **upper bound on identifiers touched, not on claims removed**, and the difference
is the whole question this lane has to answer. `crypto-lab-kdf-chain` really does implement
HKDF; suppressing `buildHkdfPanel` would move its anchor, not remove its claim.
`crypto-lab-lattice-gentle`'s `kyberPanel` may be the only Kyber-named declaration in a lab
that is genuinely a teaching diagram of Kyber — there, suppressing is correct and the claim
should go.

## What this lane must do before landing anything

1. **Split the 20 into anchor-moves and claim-removals.** For each, ask whether the lab has any
   other evidence for that term. An anchor that moves is cheap; a claim that disappears needs a
   person to agree it was false.
2. **Run the A/B.** `catalog-evidence --json` under old and new guards, diffed per lab — the
   harness used in #59 works unchanged. #59's own rule moved 0 anchors, which is the bar to
   beat; the rejected digit-suffix variant in that PR moved 21 and fixed nothing, which is the
   shape of failure to watch for.
3. **Decide about `Panel`.** It is the most common suffix here and the weakest signal: a panel
   can hold a live computation as easily as a picture. `Diagram`, `Figure`, `Illustration` and
   `Sketch` are unambiguous; `Panel`, `View` and `Chart` are not. A guard that took only the
   unambiguous four would be smaller, safer, and would still have caught
   `bonehFranklinDiagram`.

## What it must not do

Do not widen `PRESENTS` to an unanchored match. `/diagram/i` without `^` or `$` would fire on
`diagramFromKyberKeygen` and on any identifier that merely mentions the word, which is the
substring failure recorded under `protocol-identity` in `catalog-recall.js`: 38 findings,
mostly nonsense.

Do not reach for the vocabulary instead. Narrowing a term to dodge a bad anchor trades a
detection problem for a coverage one — the mistake made once already when SM3's pattern was
narrowed to keep an anchor, and recorded in `catalog-vocab.js` beside it.

## Prior art

`PRESENTS` and `MODELS` are in `tools/catalog-evidence.js`. `tools/evidence-shape-proof.js`
asserts both, and is where a suffix guard's cases belong. The measurement method, and the
record of a variant that was tried and rejected, are in `catalog-recall.js` under
`doNotReopen`.
