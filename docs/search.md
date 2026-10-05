# Catalog search

## Overview

Catalog search is local, in-browser, ranked, cryptography-aware search over the cards in `index.html`. It searches card text and structured metadata, understands selected cryptographic names and synonyms, and tolerates small typos. Only one other file runs the search at runtime: `index.html`, alongside the engine in `catalog-search.js`. A few tools upstream decide what data gets searched. Here is the full chain.

## Runtime

- **[`catalog-search.js`](../catalog-search.js)** is the engine. `parse()` creates clauses and caches their variants; `FIELD_ALIASES` maps operators to fields; `ALIASES` and `variants()` expand names; `maxEdits()`, `editDistance()` and `fuzzyTokenScore()` handle typos; `WEIGHTS`, `fieldScore()` and `phraseBonus()` determine relevance. `score()` returns a nonnegative score for a match or `-1` for rejection. `rank()` parses once, scores prepared items, removes rejected items, then sorts by descending score and normalized title. Its UMD-style wrapper exposes `window.CryptoLabSearch` in the browser and `module.exports` so Node tests can require the same engine.
- **[`index.html`](../index.html)** holds everything else: the `#demo-search` combobox, `#search-suggestions` listbox, `[data-search-example]` buttons, their CSS, the cards, and the glue script. The external engine script loads before that script uses `window.CryptoLabSearch`.

In `index.html`, the `cardData` initializer reads each `.feature-card` and `.project-card`. `searchValues()` splits pipe-separated metadata and strips the `@file:line` evidence suffix from implementation and attack names. Those source paths are evidence for maintainers, not search terms.

| Card source | Engine field |
|---|---|
| `.feature-title` / `.project-title` | `title` |
| `.feature-copy` / `.project-copy` | `copy` |
| `.card-kicker` | `kicker` |
| `.chip` text | `chips` |
| `data-category`, plus `TITLE_TO_EXTRA_CATS` additions | `categories` |
| `TITLE_TO_SECTION` lookup, also written to `data-section` | `section` |
| `data-implements` | `implements` |
| `data-attacks` | `attacks` |
| `data-standards` | `standards` |
| `data-references` | `references` |
| `data-implementation` | `implementation` |

The initializer calls `catalog-search.js`'s `prepare()` once per card. That function joins array values and normalizes each field. `normalize()` lowercases, removes combining accents, turns hyphens and several separators into spaces, and collapses whitespace. Periods survive only between digits, so `1.0` remains intact and `Kyber.` becomes `kyber`.

On an input event, `index.html`'s `filter()` parses the query once and calls `score()` for every prepared card. Text matches intersect with the active category or curated title set. A nonempty query forces relevance order and disables `#sort-order`; `layout()` rearranges the cards by descending score, breaking ties with the displayed title. Clearing the query restores curriculum order. `syncHash()` stores the query and category in the URL fragment.

Autocomplete is built from the same card records. Category suggestion labels use sentence case while preserving MPC and KDFs; their stored values remain uppercase, so selection and filtering use the canonical metadata. `cardData` collects primitive, attack, standard, reference, implementation, chip, category and kicker values; `conceptMap` deduplicates normalized names, choosing the kind with the highest `conceptKindPriority`. `conceptData` prepares these as searchable records. `updateSuggestions()` requires at least two input characters and focus in `#demo-search`. It ranks up to four concept suggestions plus lab suggestions, deduplicates their values and displays at most eight. Queries containing `:` omit concept suggestions. Lab suggestions respect the active category/set; concept suggestions come from the whole catalog. `selectSuggestion()` replaces the input and filters again; `setActiveSuggestion()` and the input's key handler support arrow keys, Enter and Escape.

## Query syntax

`catalog-search.js`'s `FIELD_ALIASES` is the complete operator list:

| Operators | Field searched |
|---|---|
| `primitive:`, `primitives:`, `algorithm:`, `algorithms:`, `implements:` | `implements` |
| `attack:`, `attacks:` | `attacks` |
| `standard:`, `standards:` | `standards` |
| `ref:`, `reference:`, `references:` | `references` |
| `impl:`, `implementation:` | `implementation` |
| `section:` | `section` |
| `category:` | `categories` |
| `title:` | `title` |
| `description:` | `copy` |

For example, `primitive:ML-KEM` limits the clause to implemented algorithms, while a free `ML-KEM` searches all weighted fields. An unknown operator is folded into free text, not treated as a recognized field.

`parse()` groups double-quoted text into one clause, including field values such as `attack:"nonce reuse"`. Positive clauses use AND semantics: every clause must match, though different free clauses may match different fields. Quotes group text; they do not disable synonyms or single-word typo matching.

Adjacent unfielded, unquoted clauses merge when their joined text is a known alias key or value. The longest window wins, from five clauses down to two. Thus `ml kem`, `post quantum`, `zero knowledge`, `man in the middle`, and `deterministic random bit generator` reach the synonym lookup as single clauses. Merging does not cross a field, quoted clause, or change of negation status.

A free `-term` or `-"multi word term"` excludes a card if any variant matches any field. Exclusions use the same direct boundary/prefix/substring rules as positive clauses, but never fuzzy matching. They add no score or phrase bonus. A query containing only exclusions gives surviving cards score zero. Use `-"ml kem"` to exclude the phrase; `-ml kem` is an excluded `ml` and a required `kem`.

For each variant, `maxEdits()` permits no fuzzy edits for phrases or terms shorter than four characters, one edit for lengths four through eight, and two for lengths nine or more. `fuzzyTokenScore()` compares individual field tokens using `editDistance()`'s optimal-string-alignment distance: insertions, deletions, substitutions and adjacent transpositions. Length differences above the limit are rejected; terms of four or five characters must also share the token's first character. Fuzzy matching is tried only when that variant has no direct match in the field.

The built-in entries in `catalog-search.js`'s `ALIASES` are below, in normalized spelling. `variants()` includes the query itself, its direct values, and the keys and sibling values of entries containing the original query. It does not recursively expand newly found variants.

| Key(s) | Values |
|---|---|
| `kyber` | `ml kem`, `crystals kyber` |
| `ml kem` | `kyber`, `crystals kyber` |
| `dilithium` | `ml dsa`, `crystals dilithium` |
| `ml dsa` | `dilithium`, `crystals dilithium` |
| `sphincs` | `slh dsa`, `sphincs+` |
| `sphincs+` | `slh dsa`, `sphincs` |
| `slh dsa` | `sphincs`, `sphincs+` |
| `pqc` | `post quantum` |
| `post quantum` | `pqc` |
| `zk` | `zero knowledge` |
| `zkp` | `zero knowledge proof`, `zero knowledge` |
| `mitm` | `man in the middle` |
| `dh` | `diffie hellman` |
| `ecc` | `elliptic curve` |
| `fhe` | `fully homomorphic encryption`, `homomorphic` |
| `hndl` | `harvest now decrypt later` |
| `rng` | `random number generator`, `drbg`, `randomness` |
| `drbg` | `deterministic random bit generator`, `rng` |

This runtime synonym table is separate from the build-time vocabulary in `tools/catalog-vocab.js`.

## Ranking

`catalog-search.js`'s `WEIGHTS` gives each field its base score:

| Field | Weight |
|---|---:|
| `title` | 100 |
| `implements` | 72 |
| `attacks` | 68 |
| `chips` | 62 |
| `standards` | 58 |
| `categories` | 54 |
| `kicker` | 48 |
| `implementation` | 44 |
| `copy` | 40 |
| `references` | 32 |
| `section` | 28 |

`matchPosition()` requires variants shorter than four characters to match whole tokens, preventing `rsa` from matching `adversary` and `mac` from matching `machine`. Longer variants may match at a token start, so `kybe` finds `kyber`. A longer variant found only inside a token loses 25 points. There is one explicit short-term exception: `dsa` finds the whole token `ecdsa` with that same 25-point penalty.

`fieldScore()` applies one direct-match bonus, in priority order: **+30** when the entire field equals the variant; **+16** when the field starts with the variant followed by a space; otherwise **+10** for a whole-token/whole-phrase occurrence anywhere. A partial token prefix has no extra bonus. Fuzzy matches receive the field weight minus **18 per edit**, without these direct-match bonuses.

For each positive clause, `score()` takes the best variant in the best eligible field, then sums those clause scores. Mentioning the same term in several fields does not multiply its score. Any unmatched positive clause or matching exclusion rejects the card.

`phraseBonus()` adds at most one further bonus, taking the best field. It considers only positive, unfielded clauses, and needs at least two:

- The joined clause terms appearing as a contiguous, whole phrase earn **160 + round(field weight / 4)**.
- Otherwise, it finds each clause's earliest eligible direct variant occurrence. If the span between those token positions is no greater than the number of clauses, the bonus is **90 + round(field weight / 6)**.
- A span up to the number of clauses plus three earns **45 + round(field weight / 8)**.

Proximity need not follow query order. Fuzzy and penalized mid-token matches do not contribute positions. A merged alias phrase is one clause and therefore does not receive this extra bonus on its own.

## Where the metadata comes from (build time)

These tools run during maintenance, not in the browser. The browser searches the resulting `index.html` attributes, not the generated [`CATALOG.md`](../CATALOG.md).

1. **[`tools/catalog-vocab.js`](../tools/catalog-vocab.js), `ALGORITHMS` and `ATTACKS`:** declares the controlled names and detection patterns. Algorithm entries carry their kind, family and defining standard where known. Those `std` values supply standards-body metadata; the runtime alias table is maintained separately.
2. **[`tools/catalog-evidence.js`](../tools/catalog-evidence.js), `evidenceFor()`:** reads sibling lab source and distinguishes code evidence from mere mentions. `fieldsFor()` serializes implementations and attacks with `@file:line` anchors, references, standards bodies and implementation style. `writeCards()` writes these derived fields to the cards. Titles, copy, chips, categories and the judged `data-overlaps` field are not generated by this writer. `verifyAnchors()` is the separate step that reopens stored evidence against lab clones and checks review freshness.
3. **[`tools/catalog-reviewed.json`](../tools/catalog-reviewed.json), per-lab `commit`, `add`, `remove`, `covered`, `state`, `implementation` and `note` entries:** records source-reviewed supplements, rejected claims, covered languages and explicit N/A decisions. `catalog-evidence.js`'s `evidenceFor()` checks whether the pinned review still applies; `writeCards()` skips stale or unreadable review pins, reports them and leaves the affected cards unchanged rather than stopping all other updates.
4. **[`tools/catalog-sync.js`](../tools/catalog-sync.js), `cards()`, `validate()` and `build()`:** reads the card metadata, checks vocabulary membership, required implementation anchors, consistency with recorded reviews and stated overlap differences, then generates the per-lab entries, reverse index, standards-body index and overlap report in `CATALOG.md`. `main()`'s `check` mode also runs `vocabChecks()` and fails if the generated document differs. It checks the stored claims; reopening source anchors belongs to `catalog-evidence.js`'s `verifyAnchors()`.
5. **[`tools/catalog-chip-exempt.json`](../tools/catalog-chip-exempt.json), `exempt`:** records specific lab/chip exceptions for `catalog-sync.js`'s `vocabChecks()`, with dependencies and reasons that those chips are not algorithms. This is a vocabulary-check exemption list, not a browser-search override. The separate `catalog-sync.js chips` mode reports chip-claim problems and is not folded into `check`.
6. **[`tools/catalog-recall.js`](../tools/catalog-recall.js), `scanned()` and `main()`, with [`tools/fixtures/catalog/recall.json`](../tools/fixtures/catalog/recall.json), `labs`:** compares fresh evidence output with hand-established source truth. Recall asks how much of the nameable truth was found; coverage asks how much the vocabulary can name. These are separate figures. The fixture's `implements`, `outOfVocabulary` and `how` entries record the expected subset and its basis. This measures evidence extraction, not search-result relevance or precision. `check` fails if recall falls below `FLOOR` (currently 0.88).

The evidence states matter downstream: `UNKNOWN` means no named implementation was derived; `NOT-SCANNED` records unread source; source-reviewed `N/A` means no named primitive in this index. `fieldsFor()` preserves those distinctions rather than turning every gap into “implements nothing.”

## Tests and CI

[`tools/catalog-structure-check.js`](../tools/catalog-structure-check.js), its top-level assertions, checks the catalog footer, at least 200 cards, no cards after the footer, the engine script, autocomplete markup and indexing of the five evidence-related attributes. Its fixtures exercise aliases, field operators, hyphen normalization, AND semantics, quotes, typo matching and same-field proximity ranking. It does not execute browser events or test the rendered autocomplete interaction.

[`catalog-search.test.js`](../catalog-search.test.js), the `test()` groups, covers the boundary fixes, reduced-score embedded matches, unquoted aliases through five words, exclusions without fuzzy matching or phrase bonuses, sentence punctuation, numeric versions and existing operator/typo behavior.

Run both from the repository root:

```sh
node catalog-search.test.js
node tools/catalog-structure-check.js
```

Both passed when this document was written: seven engine test groups and a structure/search check over 218 cards. [`.github/workflows/readme-sync.yml`](../.github/workflows/readme-sync.yml), `jobs.check`'s “Catalog document structure” step, runs `node tools/catalog-structure-check.js` on pull requests to `main`, pushes to `main`, and manual dispatch. The standalone `catalog-search.test.js` is not currently invoked by that workflow.

## Known limitations

These are reproduced against the engine after the boundary, alias and exclusion fixes. In the checks below, `-1` means rejected; zero or greater means retained.

1. **Quotes are not an exact-only mode.** `parse()` discards quoting after grouping, so `fieldScore()` still expands aliases and permits single-word typos: quoted `kyber` finds `ML-KEM`, and quoted `kyver` finds `Kyber`.
2. **Field scope stops at the next token or quoted value.** `parse()` does not merge fielded clauses. `primitive:ml kem` misses an item whose only implementation text is `Kyber`; `primitive:"ml kem"` finds it.
3. **Exclusion cannot be restricted to a field.** `parse()` treats `-title:kyber` as a negated free term normalized to `title kyber`, not a negated title operator. A card titled `Kyber` survives it; `-kyber` excludes the card across all fields.
4. **Synonyms are not transitively closed.** `variants()` does not recursively traverse its results. `zk` misses copy containing only `ZKP`, although `zero knowledge` reaches both entries and finds it.
5. **Short partial words do not support search-as-you-type.** `matchPosition()`'s whole-token rule and `maxEdits()`'s four-character minimum mean `kyb` misses `Kyber`, while `kybe` finds it. This is the tradeoff that prevents short acronyms from matching unrelated words.

The exact checks run, with observed results:

```sh
node <<'NODE'
const S = require('./catalog-search.js');
const score = (fields, q) => S.score(S.prepare(fields), q);
console.log('quotes', [score({copy:'ML-KEM'}, '"kyber"'), score({copy:'Kyber'}, '"kyver"')]);
// quotes [ 70, 22 ]
console.log('field scope', [score({implements:'Kyber'}, 'primitive:ml kem'), score({implements:'Kyber'}, 'primitive:"ml kem"')]);
// field scope [ -1, 102 ]
console.log('field exclusion', [score({title:'Kyber'}, '-title:kyber'), score({title:'Kyber'}, '-kyber')]);
// field exclusion [ 0, -1 ]
console.log('alias chain', [score({copy:'ZKP'}, 'zk'), score({copy:'ZKP'}, 'zero knowledge')]);
// alias chain [ -1, 70 ]
console.log('short prefix', [score({copy:'Kyber'}, 'kyb'), score({copy:'Kyber'}, 'kybe')]);
// short prefix [ -1, 40 ]
NODE
```

The earlier examples are no longer limitations: `rsa` rejects `adversary`, unquoted `ml kem` finds `Kyber`, and `-kyber` excludes `Kyber`. Their checks are in `catalog-search.test.js`.

When a filter changes while the filter bar is sticky, the runtime checks the first visible result after scroll anchoring and scrolls upward only if the bar covers it. The clearance uses the bar’s measured height plus an 18px gap, so wrapped controls and mobile layouts do not rely on a fixed pixel offset. Normal scrolling does not trigger this adjustment.
