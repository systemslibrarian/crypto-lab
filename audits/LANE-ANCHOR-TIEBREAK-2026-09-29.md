# Lane brief — the anchor tie-break: a KAT constant outranks the implementation

**Status: brief only. No code changed. Opened 2026-09-29 out of the vocabulary lane
(`catalog/vocab-package-name-and-zuc`), which found it and deliberately did not fix it.**

## The observation

Adding a `ZUC` term gave `crypto-lab-air-stream` this anchor:

```
ZUC@src/core/families.ts:113
```

Line 113 is `const zucKey = hexToBytes('173d14ba5003731d7a60049470f00a29')` — the ETSI/SAGE
test-vector key, inside the lab's KAT function. The implementation is elsewhere:

```
src/zuc/zuc.ts:177   export function generateZucEea3Keystream(
src/zuc/zuc.ts:199   export function encryptZucEea3(
src/zuc/constants.ts ZUC_S0, ZUC_S1, ZUC_D
```

Both candidates are shape `decl`, which `catalog-evidence.js` ranks 5 — the top rank:

```js
const RANK = { decl: 5, call: 4, protocol: 3, import: 2, path: 1 };
const keepBest = (map, name, at, shape) => {
  const have = map.get(name);
  if (!have || RANK[shape] > RANK[have.shape]) map.set(name, { at, shape });
};
```

`>` is strict, so **a tie is broken by walk order**, and `src/core/` is walked before
`src/zuc/`. The anchor lands on the first file that happened to declare a ZUC-named
identifier.

## Why it matters, in the tool's own words

The comment directly above `RANK` states the intent:

> The anchor should point at the strongest evidence in the lab, not the first file the walk
> happened to open. A declaration says more than an import: `from './hqc'` proves a module is
> used, `function hqcDecode(` shows the work being done, and **the anchor is there to be read
> by a person.**

A test-vector constant does not show the work being done. It is honest evidence that the lab
runs ZUC, and it is the weaker of two available anchors — so the rule is currently met in
letter and missed in spirit, by an ordering accident rather than a judgement.

## Not ZUC-specific

Two more instances were seen in one week, both from the same tie:

- `crypto-lab-world-hashes` SM3 moved `src/length-extension.ts:118` → `:110` when the SM3
  pattern was widened to include `SM3_IV` — from `sm3Compress`, the compression function, to
  the constant beside it. The vocabulary lane **narrowed the pattern back** specifically to
  keep the stronger anchor, which is a workaround at the wrong layer: the vocabulary paid for
  a ranking defect.
- Any lab whose KAT fixtures name the algorithm and sort before its implementation directory
  is exposed to the same thing. Nobody has counted how many.

## What this lane would do

1. **Count it first.** Add a mode that reports, per implemented algorithm, every candidate
   anchor and which one won. The claim "this affects N labs" is not yet derived, and this
   brief should not be read as asserting it is widespread.
2. **Then consider a tie-break**, cheapest plausible first:
   - on equal rank, prefer a file whose PATH names the term (`pathTerms` already computes
     this) — would fix ZUC, would not fix SM3 (same file);
   - on equal rank, prefer a function/class declaration over a `const` binding — would fix
     both, and is a change to `shapeOf`'s notion of `decl` rather than to `keepBest`;
   - split `decl` into two ranks rather than adding a tie-break at all.
3. **Measure the fleet-wide anchor diff before landing.** The A/B harness the vocabulary lane
   used works here unchanged: run `catalog-evidence --json` under old and new ranking and diff
   per lab. Anchors are `catalog-sync check`'s load-bearing evidence and `catalog-evidence
   verify` re-opens all 915 of them, so a ranking change is a fleet-wide diff and must not
   ride along inside an unrelated PR. That is the whole reason this is a separate lane.

## What it must not do

Do not "fix" this by making the vocabulary narrower, the way SM3 was handled. That trades an
anchor problem for a coverage problem and hides the defect in a different file.

## Prior art in this repo

`RANK` and `keepBest` are in `tools/catalog-evidence.js`. The reasoning about anchors as
evidence is in `CLAUDE.md` under the `CATALOG.md` heading: *"Every implemented algorithm
carries a `file:line` anchor, and a claim without one fails `catalog-sync check`."* The point
of that rule is that the anchor is readable proof; a tie broken by directory name is the
weakest link in it.
