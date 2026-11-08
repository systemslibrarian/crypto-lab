# Crypto Lab audit corpus — PRIVACY

Generated 2026-11-08T20:20:28.593Z from 12 lab record(s).

Every finding must cite **commit_sha + lab slug + field**. A field printed as
`MISSING` was not found by the generator; it is not a claim that the lab lacks it.

---
## Patron Shield

- **slug**: `crypto-lab-patron-shield`
- **repo**: https://github.com/systemslibrarian/crypto-lab-patron-shield
- **live**: https://systemslibrarian.github.io/crypto-lab-patron-shield/
- **commit_sha**: `f2019eeca22545cf7e4ad25513bf24b84aeb007f` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PRIVACY  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, spec_citations, verification

**Name (H1)**: Patron Shield  — _read from index.html_

**Subtitle**: 2-Server IT-PIR · Chor et al. 1995  — _read from index.html_

**Description**: Retrieve one book from a catalog by sending each of two servers a random XOR mask that differ in exactly one bit, then XOR the replies to rebuild the record neither server could identify.  — _read from index.html_

**Why it matters**: Every catalog search you run can be logged, exposing your medical, political, and personal reading interests. Information-theoretic PIR hides which record you fetched with no assumptions about server compute — provably private as long as the two servers never collude.  — _read from index.html_

**Card copy**: Information-theoretic private information retrieval applied to catalog privacy. A direct bridge from library ethics to concrete mathematical guarantees.

**Chips**: IT-PIR · XOR Secret Sharing · Chor et al. 1995

**Implements**: Private information retrieval `src/pir.ts:253`

**Attacks shown**: _none derived_

**References**: AES, AES-CTR, Private set intersection, Shamir secret sharing, Simon

**Standards body**: _none_

**Implementation**: hand-rolled

**Stated limitations (page)**:

- _(scope-note, index.html)_ Scoped precisely: from its own mask, either server learns zero information about which record you requested. It does not hide that a query happened, who asked, when, how often, or the response size — those are transport and identity problems this protocol does not address.
- _(scope-note, index.html)_ These three figures count query bits only — what the client sends. Each server still returns a record-sized response, so the total bytes on the wire are the two queries plus two responses; in the matrix scheme each server returns one parity per row, so the responses grow with √N as well. PIR shrinks the query, not the reply.

**README — What Can Go Wrong**:

```text
- **Server collusion breaks everything:** if the two servers share their query masks, XORing them (`S ⊕ S′ = {i}`) reveals the requested index — exactly the attack the demo lets you trigger.
- **Metadata is not protected:** two-server IT-PIR hides the index, not the query timing, frequency, size, IP address, or the fact that a query happened at all.
- **O(n) communication:** each query touches the entire database, so naive IT-PIR does not scale to large catalogs without further engineering (e.g. RAID-PIR-style optimizations).
- **PRNG quality matters:** the privacy proof depends on a uniformly random mask; a biased or predictable PRNG for subset selection weakens or destroys the guarantee.
- **Scope is the lookup only:** it protects the catalog query, not any downstream borrowing transaction or logs the surrounding application keeps outside the protocol.
```

**Claims tested** (e2e/claims.spec.ts, 29 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:41
    - :41 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:54
    - :54 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:62
    - :62 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:117
    - :117 `toHaveClass` expected `/selected/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:122
    - :122 `toHaveClass` expected `/phase-visible/, { timeout: 30_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:123
    - :123 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:124
    - :124 `toBeEnabled` expected `{ timeout: 30_000 }` _(expression)_
- `nothing runs until a book is chosen` — e2e/claims.spec.ts:134
    - :137 `toBeDisabled` expected _no expected value_ _(none)_
    - :138 `toHaveAttribute` expected `'aria-disabled', 'true'` _(expression)_
    - :139 `toHaveText` expected _no expected value_ _(none)_
    - :142 `toHaveClass` expected `/phase-visible/` _(regex)_
    - :144 `toHaveClass` expected `/phase-hidden/` _(regex)_
    - :146 `toBeHidden` expected _no expected value_ _(none)_
    - :150 `toHaveClass` expected `/phase-hidden/` _(regex)_
- `selecting a book names it and arms the query` — e2e/claims.spec.ts:153
    - :156 `toHaveLength` expected `DB_SIZE` _(expression)_
    - :161 `expect` expected _no expected value_ _(none)_
    - :162 `expect` expected _no expected value_ _(none)_
    - :163 `toBeEnabled` expected _no expected value_ _(none)_
    - :164 `toHaveAttribute` expected `'aria-disabled', 'false'` _(expression)_
    - :165 `toHaveCount` expected `1` _(literal)_
    - :168 `toBe` expected `encodeURIComponent(titles[5])` _(expression)_
    - :172 `toHaveCount` expected `1` _(literal)_
    - :173 `expect` expected _no expected value_ _(none)_
    - :174 `toBe` expected `encodeURIComponent(titles[2])` _(expression)_
- `the query button exposes the same disabled state to every user` — e2e/claims.spec.ts:177
    - :184 `toBeDisabled` expected _no expected value_ _(none)_
    - :185 `toHaveAttribute` expected `'aria-disabled', 'true'` _(expression)_
    - :187 `toHaveClass` expected `/phase-visible/, { timeout: 30_000 }` _(expression)_
    - :188 `toBeEnabled` expected `{ timeout: 30_000 }` _(expression)_
    - :189 `toHaveAttribute` expected `'aria-disabled', 'false'` _(expression)_
- `the two masks differ in exactly the bit the page says they do` — e2e/claims.spec.ts:192
    - :203 `toBe` expected `target` _(expression)_
    - :204 `toBe` expected `1 << differing` _(expression)_
    - :205 `expect` expected _no expected value_ _(none)_
    - :206 `expect` expected _no expected value_ _(none)_
    - :214 `toHaveCount` expected `DB_SIZE` _(expression)_
    - :216 `toHaveClass` expected _no expected value_ _(none)_
    - :221 `toHaveCount` expected `1` _(literal)_
    - :222 `toHaveClass` expected `/bit-highlight/` _(regex)_
    - :226 `toBe` expected _no expected value_ _(none)_
- `the reconstruction hex is the XOR of the two responses, and it is the title` — e2e/claims.spec.ts:231
    - :244 `expect` expected _no expected value_ _(none)_
    - :245 `toBe` expected `r1.length` _(expression)_
    - :246 `toBe` expected `r1.length` _(expression)_
    - :249 `expect` expected _no expected value_ _(none)_
    - :255 `toEqual` expected `r1` _(expression)_
    - :256 `toEqual` expected `r2` _(expression)_
    - :269 `toEqual` expected _no expected value_ _(none)_
    - :272 `toEqual` expected `setBits(await hexValue(page, 'mask-s2-hex'), DB_SIZE)` _(expression)_
    - :273 `toEqual` expected _no expected value_ _(none)_
    - :276 `toEqual` expected _no expected value_ _(none)_
    - :283 `expect` expected _no expected value_ _(none)_
    - :288 `toBe` expected `expectedTitle` _(expression)_
    - :289 `toBe` expected `expectedTitle` _(expression)_
    - :293 `toBeVisible` expected _no expected value_ _(none)_
    - :294 `toBe` expected `CORRECT_BADGE` _(expression)_
    - :295 `expect` expected _no expected value_ _(none)_
    - :296 `expect` expected _no expected value_ _(none)_
- `the download claim matches the number of responses the page shows` — e2e/claims.spec.ts:299
    - :312 `expect` expected _no expected value_ _(none)_
    - :315 `toBe` expected `2` _(literal)_
    - :316 `toHaveLength` expected `DB_SIZE` _(expression)_
    - :319 `expect` expected _no expected value_ _(none)_
    - :322 `expect` expected _no expected value_ _(none)_
    - :325 `toBe` expected `CORRECT_BADGE` _(expression)_
    - :326 `expect` expected _no expected value_ _(none)_
- `the cancellation grid survives exactly the requested record` — e2e/claims.spec.ts:329
    - :343 `toHaveCount` expected `union.length` _(expression)_
    - :349 `toBe` expected `'db[${idx}]'` _(expression)_
    - :354 `toBe` expected _no expected value_ _(none)_
    - :357 `toBe` expected _no expected value_ _(none)_
    - :364 `toBe` expected `'✓ keeps'` _(literal)_
    - :365 `toBe` expected `target` _(expression)_
    - :367 `toBe` expected `'✕ cancels'` _(literal)_
    - :370 `toBe` expected `1` _(literal)_
    - :371 `toBe` expected `String(target)` _(expression)_
    - :374 `expect` expected _no expected value_ _(none)_
- `the privacy counters add up to the index lists beside them` — e2e/claims.spec.ts:379
    - :395 `toEqual` expected _no expected value_ _(none)_
    - :401 `expect` expected _no expected value_ _(none)_
    - :402 `toBe` expected `listed.length` _(expression)_
    - :403 `toBe` expected `DB_SIZE` _(expression)_
    - :404 `expect` expected _no expected value_ _(none)_
    - :412 `toEqual` expected `[target]` _(expression)_
    - :416 `toEqual` expected `b1` _(expression)_
    - :418 `toEqual` expected `b2` _(expression)_
- `every book in the catalog is retrieved correctly` — e2e/claims.spec.ts:421
    - :430 `toBe` expected `titles[i]` _(expression)_
    - :431 `toBe` expected _no expected value_ _(none)_
    - :434 `toBe` expected `i` _(expression)_
    - :437 `toBe` expected `1 << i` _(expression)_
- `Run again redraws the mask but recovers the same book` — e2e/claims.spec.ts:441
    - :451 `toHaveClass` expected `/phase-visible/, { timeout: 30_000 }` _(expression)_
    - :452 `toBeEnabled` expected `{ timeout: 30_000 }` _(expression)_
    - :455 `toBe` expected `titles[7]` _(expression)_
    - :456 `toBe` expected _no expected value_ _(none)_
    - :460 `expect` expected _no expected value_ _(none)_
- `the collusion attack recovers exactly the book that was requested` — e2e/claims.spec.ts:468
    - :478 `toBeHidden` expected _no expected value_ _(none)_
    - :479 `toHaveAttribute` expected `'aria-expanded', 'false'` _(expression)_
    - :482 `toBeVisible` expected _no expected value_ _(none)_
    - :483 `toHaveAttribute` expected `'aria-expanded', 'true'` _(expression)_
    - :484 `toBe` expected `'Servers colluded — query exposed'` _(literal)_
    - :487 `toBe` expected `s1` _(expression)_
    - :488 `toBe` expected `s2` _(expression)_
    - :490 `toBe` expected `s1 ^ s2` _(expression)_
    - :491 `toBe` expected `0` _(literal)_
    - :494 `toBe` expected `target` _(expression)_
    - :497 `toBe` expected `'[${target}]'` _(expression)_
    - :498 `toBe` expected `'"${titles[target]}"'` _(expression)_
    - :499 `toBe` expected `'(unknown)'` _(literal)_
    - :503 `toBeHidden` expected _no expected value_ _(none)_
    - :504 `toHaveAttribute` expected `'aria-expanded', 'false'` _(expression)_
    - :505 `toBe` expected `'Simulate the servers colluding →'` _(literal)_
- `a new run retires the previous collusion result instead of leaving it up` — e2e/claims.spec.ts:508
    - :516 `toBe` expected `'"${titles[0]}"'` _(expression)_
    - :521 `toBeHidden` expected _no expected value_ _(none)_
    - :522 `toHaveAttribute` expected `'aria-expanded', 'false'` _(expression)_
    - :525 `toBe` expected `'"${titles[5]}"'` _(expression)_
    - :526 `toBe` expected `'[5]'` _(literal)_
- `choosing a different book clears the finished run` — e2e/claims.spec.ts:529
    - :534 `toHaveClass` expected `/phase-visible/` _(regex)_
    - :537 `toHaveClass` expected `/phase-hidden/` _(regex)_
    - :538 `toHaveClass` expected `/phase-hidden/` _(regex)_
    - :539 `toHaveClass` expected `/phase-visible/` _(regex)_
    - :540 `expect` expected _no expected value_ _(none)_
- `the √N column mask can address every record, at every slider position` — e2e/claims.spec.ts:545
    - :563 `toBe` expected `n` _(expression)_
    - :564 `toBe` expected `n` _(expression)_
    - :567 `expect` expected _no expected value_ _(none)_
    - :569 `expect` expected _no expected value_ _(none)_
    - :577 `expect` expected _no expected value_ _(none)_
    - :585 `toBe` expected _no expected value_ _(none)_
    - :591 `expect` expected _no expected value_ _(none)_
    - :595 `expect` expected _no expected value_ _(none)_
    - :598 `expect` expected _no expected value_ _(none)_
    - :607 `toBe` expected `3` _(literal)_
    - :608 `expect` expected _no expected value_ _(none)_
    - :616 `expect` expected _no expected value_ _(none)_
    - :617 `expect` expected _no expected value_ _(none)_
- `the naive / PIR toggle shows exactly one panel` — e2e/claims.spec.ts:620
    - :624 `expect` expected _no expected value_ _(none)_
    - :625 `expect` expected _no expected value_ _(none)_
    - :627 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :628 `toBeVisible` expected _no expected value_ _(none)_
    - :629 `toBeHidden` expected _no expected value_ _(none)_
    - :632 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :633 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :634 `toBeVisible` expected _no expected value_ _(none)_
    - :635 `toBeHidden` expected _no expected value_ _(none)_
    - :638 `toBeVisible` expected _no expected value_ _(none)_
    - :639 `toBeHidden` expected _no expected value_ _(none)_
- `the catalog toggle shows the count it claims to show` — e2e/claims.spec.ts:642
    - :649 `expect` expected _no expected value_ _(none)_
    - :650 `toHaveCount` expected `Number(m![1])` _(expression)_
    - :654 `toHaveCount` expected `total` _(expression)_
    - :655 `toBe` expected `'Show ${m![1]} of ${total}'` _(expression)_
    - :658 `toHaveCount` expected `Number(m![1])` _(expression)_
- `a book can be chosen and queried from the keyboard alone` — e2e/claims.spec.ts:661
    - :668 `toHaveClass` expected `/selected/` _(regex)_
    - :672 `toHaveClass` expected `/phase-visible/, { timeout: 30_000 }` _(expression)_
    - :676 `toHaveText` expected `titles[4], { timeout: 30_000 }` _(expression)_
- `the skip link lands on the main region it names` — e2e/claims.spec.ts:681
    - :685 `toMatch` expected `/^#.+/` _(regex)_
    - :692 `toHaveCount` expected `1` _(literal)_
    - :697 `expect` expected _no expected value_ _(none)_
    - :700 `toBe` expected `targetId` _(expression)_
    - :701 `toContainText` expected `'Library Catalog'` _(literal)_
- `the page links to the repository it actually lives in` — e2e/claims.spec.ts:704
    - :709 `expect` expected _no expected value_ _(none)_
    - :711 `expect` expected _no expected value_ _(none)_
- `the visualizer says the servers are simulated in this one browser` — e2e/claims.spec.ts:717
    - :720 `expect` expected _no expected value_ _(none)_
    - :721 `expect` expected _no expected value_ _(none)_
    - :722 `expect` expected _no expected value_ _(none)_
- `privacy is scoped to the index, and correctness is not claimed from it` — e2e/claims.spec.ts:725
    - :734 `expect` expected _no expected value_ _(none)_
    - :736 `expect` expected _no expected value_ _(none)_
    - :742 `expect` expected _no expected value_ _(none)_
    - :743 `expect` expected _no expected value_ _(none)_
    - :745 `expect` expected _no expected value_ _(none)_
    - :751 `expect` expected _no expected value_ _(none)_
    - :753 `toMatch` expected _no expected value_ _(none)_
- `the query-space figure is computed from the database size, not hardcoded` — e2e/claims.spec.ts:758
    - :764 `toBe` expected `DB_SIZE` _(expression)_
    - :765 `toBe` expected `2 ** DB_SIZE` _(expression)_

**Mutation records** (2 file(s)):

- `mutation-evidence.json` (7656 bytes)
- `scripts/claim-mutations.mjs` (6803 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-patron-shield

## What It Is

This project is a browser demo of Two-Server Information-Theoretic Private Information Retrieval (IT-PIR), implemented from the Chor et al. (1995) protocol shown in the app and code. It demonstrates how a user can retrieve one catalog entry without revealing which entry was requested to either server. The problem it solves is query privacy for database lookups, especially in library-search settings where search logs expose sensitive interests. The security model is two-server, non-colluding, information-theoretic privacy rather than computational hardness.

## When to Use It

- Use it for educational cryptography demos where users need to see exactly how two-server IT-PIR queries and XOR reconstruction work. It fits because the UI exposes each protocol phase and intermediate values.
- Use it to teach privacy-preserving library catalog concepts in workshops or classes. It fits because the catalog metaphor maps directly to sensitive query privacy.
- Use it as a starting point for front-end protocol visualization patterns. It fits because the state machine and rendering logic are separated and easy to extend.
- Do NOT use it as a production PIR service backend — it is a teaching demo, a client-side demonstration with simulated servers and no real distributed server trust boundary.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-patron-shield](https://systemslibrarian.github.io/crypto-lab-patron-shield/)**

In the demo, you can choose a catalog title, run a private query, and watch each step of IT-PIR execution from mask generation through response reconstruction. After a run, the privacy analysis makes the protocol's one trust assumption explicit — the two servers must not collude — and lets you trigger a **collusion attack** that XORs the two query masks (`S ⊕ S′ = {i}`) to recover your exact book, showing precisely what the non-collusion assumption protects. You can also switch between the naive query view and PIR view to compare what a server learns in each model. Controls include book selection, catalog show-all toggle, query execution buttons, the collusion-attack toggle, and the naive/PIR comparison toggle.

## What Can Go Wrong

- **Server collusion breaks everything:** if the two servers share their query masks, XORing them (`S ⊕ S′ = {i}`) reveals the requested index — exactly the attack the demo lets you trigger.
- **Metadata is not protected:** two-server IT-PIR hides the index, not the query timing, frequency, size, IP address, or the fact that a query happened at all.
- **O(n) communication:** each query touches the entire database, so naive IT-PIR does not scale to large catalogs without further engineering (e.g. RAID-PIR-style optimizations).
- **PRNG quality matters:** the privacy proof depends on a uniformly random mask; a biased or predictable PRNG for subset selection weakens or destroys the guarantee.
- **Scope is the lookup only:** it protects the catalog query, not any downstream borrowing transaction or logs the surrounding application keeps outside the protocol.

## Real-World Usage

- **[RAID-PIR (Demmler, Herzberg, and Schneider, CCSW 2014)](https://encrypto.de/papers/DHS14.pdf):** builds practical multi-server PIR variants from the Chor et al. linear-XOR scheme. Its optimized queries partition work across servers and expand AES-CTR PRG seeds; their privacy is therefore reduced to PRG security rather than being information-theoretic.
- **Percy++ (Ian Goldberg, University of Waterloo):** an open-source reference library implementing IT-PIR and computational PIR, used in privacy research.
- **PIR-Tor (Mittal et al., 2011):** proposes IT-PIR so Tor clients can fetch relay descriptors without revealing which relays they intend to use.
- **Checklist (Kogan and Corrigan-Gibbs, USENIX Security 2021):** private blocklist lookups — a two-server PIR protocol lets a browser check a URL against Google's Safe Browsing list without revealing the URL.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-patron-shield
cd crypto-lab-patron-shield
npm install
npm run dev
`​``

## Tests / Verification

Prove the crypto yourself — don't take the README's word for it.

`​``bash
npm test            # PIR correctness self-audit (vitest, src/pir.test.ts)
npm run build       # tsc type-check + production bundle
npm run test:e2e    # both browser suites — what CI gates the deploy on
npm run test:a11y   # WCAG A/AA gate only (Playwright + axe-core, both themes)
npm run test:claims # on-screen claims gate only
npm run test:workflow  # immutable actions, least privilege, lockfile and merge controls
npm run test:mutations # replay concrete protocol faults against their owning assertions
`​``

`npm test` runs the unit suite that backs every claim on this page:

- **Correctness (known-answer test).** For every catalog index, `r1 ⊕ r2`
  reconstructs the stored record **byte for byte — all 64, title and author** —
  checked across 500 random masks and for **both** cases of the reconstruction
  proof (target bit set vs. clear), against the database that was *supplied*
  rather than the module's global catalog. A title-only check would call a record
  with a corrupted author "Correct"; `recordsMatch` is tested directly against
  exactly that counterexample.
- **Privacy by construction.** The two query masks differ in **exactly one** bit,
  and that bit is the target index (`S ⊕ S′ = 1 << i`); masks stay within
  `DB_SIZE` bits and are freshly random each run.
- **The collusion attack really works — at every index the mask width allows.**
  `recoverByCollusion` recovers exactly the queried index from both masks (100
  trials/index), and correctly returns `-1` for inputs that are not a valid
  one-bit-differing query pair. It is exercised over a synthetic **32**-record
  database, index 31 included: `maskS ^ maskSPrime` is a *signed* int32, so with
  bit 31 set the XOR is negative, the power-of-two guard passes anyway, and
  `Math.log2` of a negative is `NaN`. That is the one index the `DB_SIZE ≤ 32`
  limit permits and the old implementation could not recover.
- **Index validation.** `generateQuery` rejects non-integer indices. `NaN` used to
  pass a comparison-only range check (`NaN < 0` and `NaN >= DB_SIZE` are both
  false) and be coerced to bit 0 by the shift, producing a structurally valid
  query for record 0 while reporting `differingBit: NaN`.
- **Database shape.** `runServer` takes its record count *and* record length from
  the database it is handed — not a global and not a hardcoded 64 — and rejects
  empty databases, unequal record lengths, and mask bits naming records that do
  not exist.
- **Encoding.** Field truncation happens at UTF-8 code-point boundaries, so a
  multibyte title or author can never decode to a replacement character.
- **Oracle linearity + plumbing.** `runServer` behaves as a linear XOR oracle
  (single-bit mask returns exactly that record; `server(m1) ⊕ server(m2) =
  server(m1 ⊕ m2)`), `xorBytes` is self-inverse, and records encode to a fixed
  64-byte layout.

CI (`.github/workflows/deploy.yml`) runs `npm test` **before** the build, so a
broken protocol blocks the deploy — the accessibility gate then runs the same
way.

The browser suite (`npm run test:e2e`) additionally gates the claims the page
*renders*: that the √N column mask can address every record at every slider
position (`side² ≥ N > (side-1)²`, not merely that it equals the page's own
formula), that the scaling figures are labelled as query bits only, that privacy
is scoped to the requested index, that the trust model does not sell
"at least one server is honest" as buying correctness, and that the skip link
reaches a region that exists and takes focus.

**Implementation limit (honest disclosure):** the live 1-D protocol packs each
query mask into a single 32-bit integer, so it is capped at `DB_SIZE ≤ 32`
records (the catalog here is 8). That is a JavaScript-number convenience, not a
property of PIR. The O(n)-communication scaling lesson is therefore *illustrated*
by the √N slider in the app rather than by growing the live database; a
production build would use a bit-vector or the √N matrix layout.

## Related Demos

- [crypto-lab-oblivious-shelf](https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/) — sibling 2-server IT-PIR demo with a step-by-step privacy audit.
- [crypto-lab-oram-vault](https://systemslibrarian.github.io/crypto-lab-oram-vault/) — Path ORAM hides access patterns rather than a single query index.
- [crypto-lab-psi-gate](https://systemslibrarian.github.io/crypto-lab-psi-gate/) — private set intersection for contact discovery.
- [crypto-lab-silent-tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) — Shamir-based MPC secure sum.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Oblivious Shelf

- **slug**: `crypto-lab-oblivious-shelf`
- **repo**: https://github.com/systemslibrarian/crypto-lab-oblivious-shelf
- **live**: https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/
- **commit_sha**: `066653b6905add901a44151f2a1a6b40247b07f8` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PRIVACY  ·  **level**: advanced  ·  **--accent**: #c8a96e
- **MISSING FIELDS**: verification

**Name (H1)**: Oblivious Shelf  — _read from src/main.ts_

**Subtitle**: IT-PIR · Chor–Goldreich–Kushilevitz–Sudan 1995  — _read from src/main.ts_

**Description**: Fetch one bit of a library catalog record — its checked-out flag — by sending XOR-based queries to two non-colluding servers, watching each server stay blind to which book you requested.  — _read from src/main.ts_

**Why it matters**: What you read, search, or look up is sensitive metadata. Within its protocol assumptions, IT-PIR hides the requested index from either server without relying on a computational hardness assumption.  — _read from src/main.ts_

**Card copy**: Retrieve one catalog bit with two-server XOR PIR, then run a bounded 2-out-of-5 GF(8) robustness lesson with missing, dishonest, stale, colluding and exceeded-bound cases.

**Chips**: XOR PIR · Chor et al. 1995 · 2-Server PIR · Robust PIR · Privacy Audit

**Implements**: Private information retrieval `src/pir.ts:160`

**Attacks shown**: _none derived_

**References**: Diffie-Hellman, LWE, Private set intersection, Shamir secret sharing

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `10.1145/359168.359176` — first seen README.md:54 (2×)

**Stated limitations (page)**:

- _(limitation, src/main.ts)_ Query only, not borrowing. IT-PIR protects the catalog lookup. It does not protect the physical act of borrowing a book, requesting an interlibrary loan, or checking out a physical item — those transactions leave records by necessity. Non-collusion is a real assumption. If both servers are operated by the same institution, share infrastructure, or are jointly subpoenaed, the guarantee collapses immediately. The scheme requires genuinely independent and adversarially separated servers. O(n) communication is expensive. For a catalog of one million entries, each query requires transmitting one million bits to each server. Practical deployment at scale requires systems engineering (e.g., RAID-PIR) beyond this basic scheme. Metadata is not protected. IT-PIR hides the queried index, not the fact that a query occurred, its timing, its frequency, the patron's IP address, or traffic patterns. Traffic analysis can correlate repeated queries from the same network over time.
- _(limitation, src/robust-ui.ts)_ Privacy, availability and answer correctness are different properties. Correcting a bad answer does not undo query collusion, and hiding a target does not authenticate a reply. Agreement is not provenance. There is no signature, MAC, external database commitment or freshness proof. Enough replicas agreeing on stale data can return stale data. The threshold is a guarantee, not a detector. Beyond 2b+u ≤ 3, this decoder may refuse, recover by luck, or accept a wrong line; the pinned exceeded-bound preset demonstrates the last outcome. This is the linear unit-vector/Shamir warmup. It is a bounded teaching adaptation of Beimel–Stahl's sharing and Reed–Solomon robustness principles, not their sublinear Theorem 5.2 construction, Goldberg's full 2007 protocol, Percy++ or production PIR. Operational metadata remains visible. The server count, catalog size, query occurrence, timing, source address and client identity are outside this protocol. Primary sources: Beimel and Stahl, §§2.2, 2.3.1, 5–6; Goldberg 2007, §§1–3; Shamir 1979.

**README — What Can Go Wrong**:

```text
- **Server collusion:** if both servers share logs or are controlled by the same party, the guarantee fails — the scheme provides no protection against a colluding pair.
- **Dishonest or stale robust replicas:** Robust Shelf corrects only within `2b + u <= 3`. A server's self-reported digest would not authenticate its answer, and enough replicas agreeing on stale or false data can make the client accept it.
- **Query linkage:** repeated queries from the same IP for the same item are not protected by PIR alone; traffic analysis can correlate queries over time.
- **O(n) communication in the basic XOR scheme:** the construction this demo runs sends an n-bit subset indicator to each server, so a catalog of 1 million items costs 1 million bits per server per query. This is a property of the simplest scheme, not of 2-server IT-PIR in general — Chor et al.'s same paper gives a 2-server scheme with O(n^(1/3)) communication — but practical deployment still needs the engineering in systems like RAID-PIR.
- **Implementation bugs in subset generation:** if the random subset S is not uniformly distributed, the privacy proof breaks. Use a cryptographically secure PRNG.
- **Metadata leakage:** PIR protects the index, not the fact that a query occurred, its timing, its size, or the patron's identity.
```

**Claims tested** (e2e/claims.spec.ts, 18 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:37
    - :37 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:50
    - :50 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:62
    - :62 `toHaveAttribute` expected `'aria-busy', 'false', {` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:65
    - :65 `toHaveCount` expected `8, { timeout: 15_000 }` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:87
    - :87 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:93
    - :93 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:108
    - :108 `expect` expected _no expected value_ _(none)_
- `before any selection the demo is inert and says so` — e2e/claims.spec.ts:126
    - :129 `toBeDisabled` expected _no expected value_ _(none)_
    - :130 `toBeDisabled` expected _no expected value_ _(none)_
    - :131 `toContainText` expected `'No book selected'` _(literal)_
    - :132 `toHaveCount` expected `0` _(literal)_
    - :133 `toBeHidden` expected _no expected value_ _(none)_
    - :137 `toHaveCount` expected `0` _(literal)_
    - :138 `toBeHidden` expected _no expected value_ _(none)_
- `scope, research timeline, and legal caveats stay accurate` — e2e/claims.spec.ts:141
    - :145 `toContainText` expected `'one bit'` _(literal)_
    - :146 `toContainText` expected `'view limited to the protocol'` _(literal)_
    - :149 `toContainText` expected `'Random draws can occasionally repeat'` _(literal)_
    - :152 `toContainText` expected `'Dvir and Gopi'` _(literal)_
    - :153 `toContainText` expected `"Dvir–Gopi's sub-polynomial upper bound"` _(literal)_
    - :154 `toContainText` expected `'C ≥ (5 − o(1)) log₂ n'` _(literal)_
    - :155 `expect` expected _no expected value_ _(none)_
    - :157 `toContainText` expected `'ITC 2025 literature summary'` _(literal)_
    - :158 `toContainText` expected `'Microsoft SEAL'` _(literal)_
    - :159 `toContainText` expected `'millions of entries'` _(literal)_
    - :162 `toContainText` expected `'expired on March 15, 2020'` _(literal)_
    - :163 `toContainText` expected `'45-minute window'` _(literal)_
    - :164 `toContainText` expected `'not legal advice'` _(literal)_
    - :165 `toContainText` expected `'both query shares together reveals the target'` _(literal)_
- `selecting a book arms the demo and retargets the explanation diagrams` — e2e/claims.spec.ts:168
    - :171 `expect` expected _no expected value_ _(none)_
    - :175 `toBeEnabled` expected _no expected value_ _(none)_
    - :176 `toBeEnabled` expected _no expected value_ _(none)_
    - :177 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :178 `toHaveCount` expected `1` _(literal)_
    - :179 `toContainText` expected `'#4'` _(literal)_
    - :182 `toHaveText` expected `'#4'` _(literal)_
    - :183 `toHaveText` expected `'#4'` _(literal)_
    - :184 `toHaveText` expected `'#4'` _(literal)_
    - :185 `toHaveText` expected `'4'` _(literal)_
    - :186 `toHaveText` expected `'4'` _(literal)_
    - :189 `toHaveText` expected `'#11'` _(literal)_
    - :190 `toHaveText` expected `'11'` _(literal)_
- `the recovered bit is the protocol output and agrees with the catalog` — e2e/claims.spec.ts:193
    - :201 `toBe` expected `ra !== rb` _(expression)_
    - :205 `toBe` expected _no expected value_ _(none)_
    - :214 `expect` expected _no expected value_ _(none)_
    - :217 `expect` expected _no expected value_ _(none)_
    - :220 `expect` expected _no expected value_ _(none)_
    - :223 `toHaveText` expected _no expected value_ _(none)_
    - :229 `expect` expected _no expected value_ _(none)_
    - :230 `expect` expected _no expected value_ _(none)_
- `both server XOR chains recompute to the responses the recovery step used` — e2e/claims.spec.ts:233
    - :247 `toEqual` expected `[TARGET]` _(expression)_
    - :250 `toEqual` expected `S` _(expression)_
    - :256 `toEqual` expected `S` _(expression)_
    - :257 `toEqual` expected `S2` _(expression)_
    - :260 `toBe` expected _no expected value_ _(none)_
    - :263 `toBe` expected _no expected value_ _(none)_
    - :269 `toBe` expected `ra` _(expression)_
    - :270 `toBe` expected `rb` _(expression)_
    - :273 `toHaveCount` expected `0` _(literal)_
    - :274 `toHaveCount` expected `0` _(literal)_
    - :278 `expect` expected _no expected value_ _(none)_
- `the anonymity-set counters are the whole catalog and sum consistently` — e2e/claims.spec.ts:285
    - :297 `expect` expected _no expected value_ _(none)_
    - :298 `toBe` expected `S.length` _(expression)_
    - :302 `toHaveLength` expected `2` _(literal)_
    - :304 `toBe` expected `n` _(expression)_
    - :305 `toBe` expected `n` _(expression)_
    - :312 `expect` expected _no expected value_ _(none)_
    - :313 `expect` expected _no expected value_ _(none)_
    - :316 `expect` expected _no expected value_ _(none)_
    - :317 `expect` expected _no expected value_ _(none)_
    - :320 `toBeVisible` expected _no expected value_ _(none)_
    - :327 `expect` expected _no expected value_ _(none)_
    - :329 `toBe` expected `n` _(expression)_
    - :330 `toBe` expected `expected` _(expression)_
    - :331 `expect` expected _no expected value_ _(none)_
    - :340 `toBe` expected `'S = ${fmt(S)}'` _(expression)_
    - :341 `toBe` expected _no expected value_ _(none)_
- `every book in the catalog recovers its own bit` — e2e/claims.spec.ts:346
    - :356 `toBe` expected `ra !== rb` _(expression)_
    - :357 `toBe` expected _no expected value_ _(none)_
    - :362 `toContainText` expected `'book #${i}'` _(expression)_
    - :363 `toHaveText` expected `'Step 7 — Patron recovers db[${i}]'` _(expression)_
    - :371 `toEqual` expected `[i]` _(expression)_
- `Run Again redraws S but recovers the same bit` — e2e/claims.spec.ts:375
    - :391 `toBe` expected `1` _(literal)_
    - :392 `expect` expected _no expected value_ _(none)_
- `changing the selection clears the previous verdict instead of leaving it stale` — e2e/claims.spec.ts:398
    - :404 `toHaveText` expected `'Step 7 — Patron recovers db[2]'` _(literal)_
    - :409 `toHaveCount` expected `0` _(literal)_
    - :410 `toBeHidden` expected _no expected value_ _(none)_
    - :411 `toContainText` expected `'#13'` _(literal)_
    - :415 `toHaveText` expected `'Step 7 — Patron recovers db[13]'` _(literal)_
    - :417 `toBe` expected `await cardSaysCheckedOut(page, 13)` _(expression)_
- `regression: interrupting a run mid-animation leaves the demo usable` — e2e/claims.spec.ts:420
    - :428 `toBeVisible` expected `{ timeout: 5_000 }` _(expression)_
    - :431 `toHaveCount` expected `0` _(literal)_
    - :432 `toHaveAttribute` expected `'aria-busy', 'false'` _(expression)_
    - :436 `toHaveText` expected `'Step 7 — Patron recovers db[3]'` _(literal)_
    - :439 `toBe` expected `ra !== rb` _(expression)_
    - :440 `toBe` expected `await cardSaysCheckedOut(page, 3)` _(expression)_
- `keyboard selection drives the same protocol as the mouse` — e2e/claims.spec.ts:443
    - :452 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :456 `toHaveText` expected `'Step 7 — Patron recovers db[2]'` _(literal)_
    - :458 `toBe` expected `await cardSaysCheckedOut(page, 2)` _(expression)_

**Mutation records** (1 file(s)):

- `scripts/mutations.mjs` (9541 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-oblivious-shelf

## What It Is

crypto-lab-oblivious-shelf implements the basic 2-server XOR Information-Theoretic Private Information Retrieval (IT-PIR) construction from Chor, Goldreich, Kushilevitz, and Sudan (1995), plus a bounded robust-PIR companion. A patron chooses one of 16 books, but either protocol retrieves only that book's one-bit checked-out flag, not its title or full catalog record. The original lesson sends a uniformly random subset to one server and that subset with the target toggled to the other. Robust Shelf instead uses five replicated servers and degree-one unit-vector shares over GF(8), so any two honest answers reconstruct and wrong or missing answers are correctable exactly within `2b + u <= 3`; one query recipient learns nothing about the index, while any two can recover it. Both lessons are one-round browser teaching models whose guarantees require the assumptions stated on the page; they are not deployed private retrieval services.

## When to Use It

- Use this lab to study how two correlated XOR queries recover one database bit while either protocol query alone hides its target.
- Use IT-PIR designs when the required non-collusion, identical-database, randomness, and network-metadata assumptions can be enforced and audited.
- Use information-theoretic PIR when privacy must not depend on a computational hardness assumption.
- Do not use PIR as the sole privacy measure — it hides the requested index within its protocol model, not the physical borrowing transaction, patron identity, IP address, or query timing.
- Do not use the 2-server scheme when both servers are operated by the same institution — collusion collapses the guarantee immediately.
- Do NOT treat this as production infrastructure — it is a browser teaching demo with simulated servers, not a deployed PIR service.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-oblivious-shelf](https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/)**

Select any book from the 16-entry catalog grid to set it as the target index, then click **Generate Query** to run the full 2-server XOR PIR protocol with real arithmetic. Each step — random subset generation, symmetric difference, server-side XOR computation, and client-side recovery — is displayed sequentially in the walkthrough panel. Click **Run Again** to draw another independent subset S; a repeat is possible, although unlikely for this 16-bit example. The privacy audit panel shows the protocol query each simulated server sees and derives which targets remain consistent with that view. It does not model transport metadata, server collusion, or auxiliary logs.

The **Robust Shelf** section reuses the selected book and the exact same 16-bit database snapshot. It generates all five 16-symbol GF(8) queries with Web Crypto, computes every server's real field dot product, and decodes only the replies that arrived. Presets and per-server controls make replicas unavailable, add a chosen nonzero answer delta, or flip a stale replica's target bit before its dot product. The decoder sees transmitted points only — never the fault labels or direct database bit — and the page compares an accepted value with the retained catalog bit only afterward. A separate collusion control derives all 16 candidate targets from one query view or interpolates the one-hot vector from two.

## Robust Shelf Model

- **Profile:** five full replicas, evaluation points `1..5`, GF(8) represented in the polynomial basis for `z^3 + z + 1`, degree-one query and answer polynomials, one-round queries sent before availability is known.
- **Privacy:** each coordinate of one server's query is uniform because `r -> s + r*omega` is a bijection for nonzero `omega`; two distinct query views interpolate every constant and reveal the one-hot target.
- **Availability and faults:** with `u` erasures and `b` wrong replies, the punctured dimension-two Reed–Solomon word is uniquely decodable when `5-u >= 2+2b`, equivalently `2b+u <= 3`.
- **Exceeded threshold:** no fail-closed promise exists. The included `b=2, u=1` run constructs a wrong line with three agreements, and the decoder accepts the wrong bit while the page labels the guarantee exceeded first.
- **Adaptation boundary:** this is the linear unit-vector/Shamir warmup combined with bounded Reed–Solomon answer decoding. It is not Beimel–Stahl Theorem 5.2's sublinear cube construction, Goldberg's full 2007 protocol, Percy++, RAID-PIR, or a production implementation.

## What Can Go Wrong

- **Server collusion:** if both servers share logs or are controlled by the same party, the guarantee fails — the scheme provides no protection against a colluding pair.
- **Dishonest or stale robust replicas:** Robust Shelf corrects only within `2b + u <= 3`. A server's self-reported digest would not authenticate its answer, and enough replicas agreeing on stale or false data can make the client accept it.
- **Query linkage:** repeated queries from the same IP for the same item are not protected by PIR alone; traffic analysis can correlate queries over time.
- **O(n) communication in the basic XOR scheme:** the construction this demo runs sends an n-bit subset indicator to each server, so a catalog of 1 million items costs 1 million bits per server per query. This is a property of the simplest scheme, not of 2-server IT-PIR in general — Chor et al.'s same paper gives a 2-server scheme with O(n^(1/3)) communication — but practical deployment still needs the engineering in systems like RAID-PIR.
- **Implementation bugs in subset generation:** if the random subset S is not uniformly distributed, the privacy proof breaks. Use a cryptographically secure PRNG.
- **Metadata leakage:** PIR protects the index, not the fact that a query occurred, its timing, its size, or the patron's identity.

## Research Systems and Prototypes

- **[RAID-PIR](https://encrypto.de/papers/DHS14.pdf) (Demmler, Herzberg, and Schneider, 2014):** A multi-server PIR design that combines pseudorandomly expanded queries with RAID-inspired striping, mirroring, and parity techniques to reduce storage and communication costs.
- **[Percy++](https://crysp.uwaterloo.ca/software/) (University of Waterloo):** An open-source C++ library implementing information-theoretic and computational PIR protocols for research and experimentation.
- **[PIR-Tor](https://www.usenix.org/conference/usenix-security-11/pir-tor-scalable-anonymous-communication-using-private-information) (Mittal et al., 2011):** A Tor-directory design that evaluates both computational and information-theoretic PIR architectures for privately retrieving relay information.
- **[Popcorn](https://www.usenix.org/system/files/conference/nsdi16/nsdi16-paper-gupta-trinabh-update.pdf) (Gupta et al., 2016):** A video-delivery prototype that composes information-theoretic and computational PIR components rather than relying on IT-PIR alone.
- **[Checklist](https://www.usenix.org/conference/usenixsecurity21/presentation/kogan) (Kogan and Corrigan-Gibbs, 2021):** A two-server, offline/online PIR system for private blocklist lookups, evaluated with Safe Browsing data.

## Primary References

- [Chor, Goldreich, Kushilevitz, and Sudan, *Private Information Retrieval*](https://madhu.seas.harvard.edu/papers/1995/pir-journ.pdf)
- [Beimel and Stahl, *Robust Information-Theoretic Private Information Retrieval*](https://www.cs.bgu.ac.il/~beimel/Papers/BS_Journal.pdf) — §§2.2, 2.3.1, 5–6; the exact robust definitions, vector Shamir sharing, unit-vector warmup, and Byzantine/decoding boundary used by the companion lesson.
- [Goldberg, *Improving the Robustness of Private Information Retrieval*](https://crysp.uwaterloo.ca/courses/pet/F09/cache/www.cypherpunks.ca/~iang/pubs/robustpir.pdf) — §§1–3; unavailable, incorrect, and colluding-server distinctions plus polynomial answer reconstruction. Stronger extensions in the paper are not claimed here.
- [Shamir, *How to Share a Secret*](https://dl.acm.org/doi/10.1145/359168.359176) — the polynomial-sharing foundation.
- [Wehner and de Wolf, *Improved Lower Bounds for Locally Decodable Codes and Private Information Retrieval*](https://arxiv.org/abs/quant-ph/0403140)
- [Dvir and Gopi, *2-Server PIR with Sub-polynomial Communication*](https://arxiv.org/abs/1407.6692)
- [United States Code, 50 U.S.C. § 1861](https://www.govinfo.gov/link/uscode/50/1861)
- [United States Code, 18 U.S.C. § 2709](https://www.govinfo.gov/link/uscode/18/2709)
- [American Library Association guidance on law-enforcement inquiries](https://www.ala.org/advocacy/privacy/lawenforcement/inquiries)

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-oblivious-shelf
cd crypto-lab-oblivious-shelf
npm install
npm run dev
`​``

Verification commands:

`​``bash
npm test
npm run build
npm run test:a11y
npm run test:mutations
`​``

The unit suite pins the full GF(8) tables and exact fixture, exhaustively checks every slope vector on a reduced database and every two-server pair, enumerates erasure patterns and nonzero single-answer corruptions, and proves the stale and exceeded-bound paths from actual computations. Browser claims independently recompute the displayed field dot products, decoder candidates, collusion result and communication figures. The accessibility drive opens the new result states at desktop, 380-pixel and 320-pixel widths. The mutation gate begins from an unmodified passing browser/unit baseline, applies concrete source changes one at a time, requires each named owner test to turn red, restores the file exactly and finishes with a clean build.

## Related Demos

- [crypto-lab-patron-shield](https://systemslibrarian.github.io/crypto-lab-patron-shield/) — IT-PIR applied to full catalog privacy, with a collusion-attack toggle.
- [crypto-lab-oram-vault](https://systemslibrarian.github.io/crypto-lab-oram-vault/) — Path ORAM hides access patterns rather than a single query index.
- [crypto-lab-psi-gate](https://systemslibrarian.github.io/crypto-lab-psi-gate/) — private set intersection for contact discovery.
- [crypto-lab-silent-tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) — Shamir-based MPC secure sum.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## ORAM Vault

- **slug**: `crypto-lab-oram-vault`
- **repo**: https://github.com/systemslibrarian/crypto-lab-oram-vault
- **live**: https://systemslibrarian.github.io/crypto-lab-oram-vault/
- **commit_sha**: `002c28c13409479b12c86b70c92ea4855f534aee` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PRIVACY  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, verification

**Name (H1)**: ORAM Vault  — _read from src/main.ts_

**Subtitle**: Path ORAM · bounded hierarchical ORAM · access-pattern privacy  — _read from src/main.ts_

**Description**: Drive live reads and writes through a binary-tree ORAM, then compare its real traffic with a bounded executable hierarchy that probes every level and rebuilds on a public binary schedule.  — _read from src/main.ts_

**Why it matters**: Encryption hides file contents, but the sequence of locations you read still leaks behavior — routines, relationships, panic. In its stated semi-honest model, Path ORAM hides which logical block each storage access targets; access count and timing remain visible.  — _read from src/main.ts_

**Card copy**: Compare executable Path and bounded hierarchical ORAM, then test three distrustful clients with distinct rights, signed updates, rollback limits, state divergence, and the access-pattern failure under client–server collusion.

**Chips**: Path ORAM · Hierarchical ORAM · Multi-Client ORAM · Access Patterns

**Implements**: AES `src/multiclient/envelope.ts:176`, AES-GCM `src/client/encryption.ts:103`, ECDSA `src/multiclient/protocol.ts:236`, HMAC `src/hierarchical/client.ts:185`, P-256 `src/multiclient/protocol.ts:236`, SHA-256 `src/multiclient/protocol.ts:219`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Private information retrieval `src/multiclient/envelope.ts:49`

**References**: Merkle tree, Oblivious transfer, Private information retrieval, Private set intersection, Shamir secret sharing

**Standards body**: IETF, NIST

**Implementation**: WebCrypto AES-GCM, P-256 ECDSA, HMAC and SHA-256 / local TypeScript Path, bounded hierarchical and bounded multi-client ORAM teaching implementations

**Spec citations, exactly as written**:

- `arXiv:1007.1259v2` — first seen README.md:131 (1×)
- `arXiv:1811.04366` — first seen src/main.ts:741 (1×)
- `arXiv:1811.04366v4` — first seen src/multiclient/naive.ts:26 (3×)
- `ASIACRYPT 2020` — first seen README.md:204 (1×)
- `doi.org/10.1007/978-3-030-71522-9_1550` — first seen README.md:206 (1×)
- `doi.org/10.1145/233551.233553` — first seen README.md:132 (2×)
- `ePrint 2015/224` — first seen README.md:43 (11×)
- `ePrint 2016/678` — first seen README.md:205 (5×)
- `ePrint 2017/329` — first seen README.md:42 (18×)
- `ePrint 2020/1551` — first seen README.md:204 (8×)
- `eprint.iacr.org/2015/224` — first seen README.md:202 (2×)
- `eprint.iacr.org/2016/678` — first seen README.md:205 (2×)
- `eprint.iacr.org/2017/329` — first seen README.md:203 (2×)
- `eprint.iacr.org/2020/1551` — first seen README.md:204 (2×)
- `EUROCRYPT 2021` — first seen README.md:130 (1×)
- `RFC 4231` — first seen README.md:230 (2×)

**Stated limitations (page)**:

- _(caveat, src/main.ts)_ Implementation complexityTrivialModerate (16-line pseudocode)

**README — What Can Go Wrong**:

```text
- **Finite-stash failure** remains possible. Its probability depends on bucket size and the provisioned stash capacity; recursion solves the position-map storage problem, not stash overflow.
- **Timing and termination leakage** remains. This browser code is not constant-time and does not schedule or pad application operations.
- **Position map is O(N).** For large N, the position map doesn't fit on the client. Recursive ORAM stores it in another ORAM instance.
- **The bounded hierarchy trades away asymptotic efficiency.** Its 341 slots are about 21.31N, and a rebuild decrypts up to all 16 real blocks into trusted memory. The cited constructions require efficient oblivious hashing/sorting machinery that this table intentionally does not reproduce.
- **The module boundary is informational, not isolation.** Client and server code share one page; a malicious same-origin script can inspect client state.
- **No path freshness/completeness proof.** AES-GCM now rejects malformed or modified individual blobs, and missing target blocks fail closed, but a malicious server can still replay or omit valid data. Path ORAM §6.4 describes a Merkle-tree extension for integrity with freshness; Onion ORAM describes a malicious-server construction. Ring ORAM is a different bandwidth-optimized construction, not a malicious-security layer for this demo.
- **Side-channels in the browser.** Cache timing, allocation and garbage collection can leak information. A deployment must separately engineer the client, scheduling, padding and hardware for its side-channel threat model.
- **A colluding client defeats obliviousness in the multi-client store, and no `o(n)` construction can prevent it.** Maliciously Secure Multi-Client ORAM (IACR ePrint 2017/329) §2.2 Theorem 1 rules that out for any multi-client ORAM touching `o(n)` physical addresses per operation, which this Path-ORAM-shaped store does. Exhibit 7 executes the break rather than describing it.
- **The multi-client store provides tamper resistance, not integrity.** An unauthorised write lands on the server; every honest reader then rejects it and `blame` names the writer. Preventing the write would need a server-side access-control check, which the construction deliberately removes (GORAM, IACR ePrint 2015/224, §4) because such a check would reveal which entry is being written.
- **The multi-client store refuses concurrency rather than supporting it.** Two overlapping accesses race on the shared leaf map and the path write-back; the lesson serialises accesses, refuses an overlapping one with a stated reason, and exhibits the lost update that appears when the refusal is lifted. Linearizability is not claimed.
```

**Claims tested** (e2e/claims.spec.ts, 36 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:33
    - :33 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:56
    - :56 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:64
    - :64 `toBe` expected `p.L + 1` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:65
    - :65 `toBe` expected `(1 << (p.L + 1)) - 1` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:66
    - :66 `toBe` expected `p.Z * p.buckets` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:67
    - :67 `toBe` expected `1 << p.L` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:96
    - :96 `toContainText` expected `'Initialized:', READY` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:102
    - :102 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:115
    - :115 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:135
    - :135 `expect` expected _no expected value_ _(none)_
- `the replay hides record identity but retains the visible timing cluster` — e2e/claims.spec.ts:162
    - :167 `toHaveText` expected `'Not yet run.'` _(literal)_
    - :169 `toContainText` expected `'Done.', READY` _(expression)_
    - :180 `toHaveLength` expected `6` _(literal)_
    - :181 `toHaveLength` expected `6` _(literal)_
    - :185 `toBe` expected `clientRows[i][1]` _(expression)_
    - :187 `toBe` expected `blobsPerAccess` _(expression)_
    - :189 `expect` expected _no expected value_ _(none)_
    - :190 `expect` expected _no expected value_ _(none)_
    - :192 `toBe` expected `Number(clientRows[i][3]) % p.N` _(expression)_
    - :199 `expect` expected _no expected value_ _(none)_
    - :200 `expect` expected _no expected value_ _(none)_
    - :201 `expect` expected _no expected value_ _(none)_
    - :202 `toContainText` expected _no expected value_ _(none)_
    - :209 `expect` expected _no expected value_ _(none)_
    - :212 `expect` expected _no expected value_ _(none)_
- `a written block reads back, and each access reads the path the last one assigned` — e2e/claims.spec.ts:218
    - :228 `toContainText` expected `'WRITE(block 5', READY);` _(expression)_
    - :232 `toContainText` expected `'READ(block 5', READY);` _(expression)_
    - :236 `expect` expected _no expected value_ _(none)_
    - :241 `toBe` expected `wrote.newLeaf` _(expression)_
    - :242 `expect` expected _no expected value_ _(none)_
    - :243 `expect` expected _no expected value_ _(none)_
    - :247 `toContainText` expected `'path P(${read1.newLeaf})', READY` _(expression)_
    - :249 `toBe` expected `read1.newLeaf` _(expression)_
    - :253 `toBe` expected `p.N` _(expression)_
    - :255 `expect` expected _no expected value_ _(none)_
    - :256 `expect` expected _no expected value_ _(none)_
    - :258 `toBe` expected _no expected value_ _(none)_
    - :261 `toContainText` expected _no expected value_ _(none)_
- `the server tree shows no block IDs and the client tree accounts for every slot` — e2e/claims.spec.ts:266
    - :273 `toContainText` expected `'re-randomised', READY` _(expression)_
    - :276 `toHaveCount` expected `0` _(literal)_
    - :281 `toHaveCount` expected `slots` _(expression)_
    - :284 `toBe` expected `slots` _(expression)_
    - :285 `toBe` expected `real.length` _(expression)_
    - :287 `expect` expected _no expected value_ _(none)_
    - :288 `expect` expected _no expected value_ _(none)_
    - :292 `toHaveCount` expected `p.L + 1` _(expression)_
    - :293 `toHaveCount` expected `p.L + 1` _(expression)_
    - :294 `toHaveCount` expected `p.buckets` _(expression)_
    - :298 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :299 `toHaveText` expected `'Reveal client block IDs'` _(literal)_
    - :300 `toHaveCount` expected `0` _(literal)_
    - :303 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :304 `toHaveCount` expected `slots` _(expression)_
    - :305 `toEqual` expected `real` _(expression)_
- `the eviction explanation is legal under the position map it is drawn from` — e2e/claims.spec.ts:308
    - :315 `toContainText` expected `'re-randomised', READY` _(expression)_
    - :322 `expect` expected _no expected value_ _(none)_
    - :323 `expect` expected _no expected value_ _(none)_
    - :326 `toBe` expected `rows.length` _(expression)_
    - :331 `expect` expected _no expected value_ _(none)_
    - :333 `toBe` expected _no expected value_ _(none)_
    - :338 `expect` expected _no expected value_ _(none)_
    - :345 `expect` expected _no expected value_ _(none)_
- `an out-of-range block ID is refused by name and runs no access` — e2e/claims.spec.ts:351
    - :356 `toContainText` expected `'re-randomised', READY` _(expression)_
    - :367 `expect` expected _no expected value_ _(none)_
    - :373 `toHaveText` expected _no expected value_ _(none)_
    - :379 `toBe` expected `readsBefore` _(expression)_
    - :380 `toBe` expected `writesBefore` _(expression)_
    - :381 `toEqual` expected `mapBefore` _(expression)_
    - :388 `toContainText` expected `'at most 32 UTF-8 bytes'` _(literal)_
    - :389 `toBe` expected `readsBefore` _(expression)_
    - :390 `toBe` expected `writesBefore` _(expression)_
    - :391 `toEqual` expected `mapBefore` _(expression)_
    - :395 `toContainText` expected `'READ(block 0)', READY` _(expression)_
    - :396 `expect` expected _no expected value_ _(none)_
- `regression: re-initializing drops the previous vault\` — e2e/claims.spec.ts:399
    - :408 `toBeVisible` expected `READY` _(expression)_
    - :412 `toContainText` expected `'Initialized:', READY` _(expression)_
    - :414 `toHaveCount` expected `0` _(literal)_
    - :415 `toContainText` expected _no expected value_ _(none)_
    - :418 `toBe` expected `stale` _(expression)_
    - :420 `toContainText` expected _no expected value_ _(none)_
- `regression: a replaced vault refuses to answer instead of answering wrong` — e2e/claims.spec.ts:425
    - :438 `toContainText` expected `'WRITE(block 5', READY);` _(expression)_
    - :440 `toContainText` expected `'READ(block 5) = "SECRET"', READY` _(expression)_
    - :445 `toContainText` expected `'Initialized.', READY` _(expression)_
    - :450 `toContainText` expected `'Vault replaced', READY` _(expression)_
    - :451 `toContainText` expected `'another exhibit initialized the shared server'` _(literal)_
    - :452 `toContainText` expected `'Press Initialize'` _(literal)_
    - :454 `toContainText` expected `'(empty)'` _(literal)_
    - :455 `toContainText` expected `'SECRET'` _(literal)_
    - :458 `toBeDisabled` expected _no expected value_ _(none)_
    - :460 `toHaveCount` expected `0` _(literal)_
    - :464 `toContainText` expected `'Initialized:', READY` _(expression)_
    - :465 `toBeEnabled` expected _no expected value_ _(none)_
    - :468 `toContainText` expected `'WRITE(block 5', READY);` _(expression)_
    - :470 `toContainText` expected `'READ(block 5) = "SECRET"', READY` _(expression)_
- `the walkthrough reads and writes one path and returns the stored value` — e2e/claims.spec.ts:475
    - :482 `toContainText` expected `'Ready.', READY` _(expression)_
    - :483 `toHaveText` expected `'(no accesses yet)'` _(literal)_
    - :490 `toContainText` expected `'Complete!', READY` _(expression)_
    - :495 `expect` expected _no expected value_ _(none)_
    - :496 `toEqual` expected `pathBuckets(oldLeaf, p.L)` _(expression)_
    - :502 `expect` expected _no expected value_ _(none)_
    - :503 `expect` expected _no expected value_ _(none)_
    - :507 `expect` expected _no expected value_ _(none)_
    - :508 `toBe` expected `p.L + 1` _(expression)_
    - :509 `toBe` expected `p.Z` _(expression)_
    - :510 `toBe` expected `blobs` _(expression)_
    - :511 `toBe` expected `Number(mBlobs![3])` _(expression)_
    - :512 `expect` expected _no expected value_ _(none)_
    - :513 `expect` expected _no expected value_ _(none)_
    - :517 `toMatch` expected `/block\s*(ID\s*)?5/i` _(regex)_
    - :519 `expect` expected _no expected value_ _(none)_
    - :527 `expect` expected _no expected value_ _(none)_
    - :528 `toContainText` expected `'map entry is now leaf ${newLeaf}'` _(expression)_
    - :529 `toContainText` expected `'wrote it to the old path'` _(literal)_
    - :530 `expect` expected _no expected value_ _(none)_
    - :533 `toHaveText` expected `'Returned: "HELLO, PATH ORAM!"'` _(literal)_
    - :534 `toContainText` expected `'Block 5 = "HELLO, PATH ORAM!"'` _(literal)_
    - :537 `toHaveCount` expected `6` _(literal)_
    - :538 `toHaveCount` expected `1` _(literal)_
    - :539 `toHaveClass` expected `/active/` _(regex)_
    - :540 `toBeDisabled` expected _no expected value_ _(none)_
- `the walkthrough is inert before initialization and resets between runs` — e2e/claims.spec.ts:543
    - :548 `toBeDisabled` expected _no expected value_ _(none)_
    - :550 `toHaveText` expected `'Initialize ORAM to begin walkthrough.'` _(literal)_
    - :551 `toHaveCount` expected `0` _(literal)_
    - :552 `toHaveCount` expected `0` _(literal)_
    - :555 `toContainText` expected `'Ready.', READY` _(expression)_
    - :558 `toHaveCount` expected `1` _(literal)_
    - :559 `toHaveClass` expected `/active/` _(regex)_
    - :561 `toContainText` expected `'Block 5 written.', READY` _(expression)_
    - :562 `toHaveText` expected `'Written successfully.'` _(literal)_
    - :566 `toContainText` expected `'Ready.', READY` _(expression)_
    - :567 `toHaveText` expected `'(no accesses yet)'` _(literal)_
    - :568 `toHaveCount` expected `0` _(literal)_
    - :569 `toHaveCount` expected `0` _(literal)_
    - :570 `toBeDisabled` expected _no expected value_ _(none)_
    - :588 `expect` expected _no expected value_ _(none)_
    - :595 `expect` expected _no expected value_ _(none)_
    - :597 `toBe` expected `20` _(literal)_
    - :606 `expect` expected _no expected value_ _(none)_
    - :607 `expect` expected _no expected value_ _(none)_
    - :608 `expect` expected _no expected value_ _(none)_
    - :609 `toBe` expected `numLeaves - 1` _(expression)_
    - :615 `toBe` expected _no expected value_ _(none)_
- `the adversary panel counts, χ² and verdict are all the same sample` — e2e/claims.spec.ts:635
    - :642 `toBeDisabled` expected _no expected value_ _(none)_
    - :643 `toBeDisabled` expected _no expected value_ _(none)_
    - :645 `toContainText` expected `'Initialized.', READY` _(expression)_
    - :648 `toContainText` expected `'Done.', READY` _(expression)_
    - :651 `toBe` expected `20` _(literal)_
    - :652 `toHaveCount` expected `h.total` _(expression)_
    - :653 `toHaveCount` expected `h.total` _(expression)_
    - :656 `expect` expected _no expected value_ _(none)_
    - :661 `toBe` expected `Number((h.total / numLeaves).toFixed(1))` _(expression)_
    - :662 `toBeCloseTo` expected _no expected value_ _(none)_
    - :669 `expect` expected _no expected value_ _(none)_
    - :670 `expect` expected _no expected value_ _(none)_
    - :671 `expect` expected _no expected value_ _(none)_
    - :672 `toContainText` expected `h.verdict` _(expression)_
    - :677 `toContainText` expected `'${20 * (i + 2)} total accesses', READY` _(expression)_
    - :681 `toBe` expected `5 * numLeaves` _(expression)_
    - :682 `toBe` expected `h.total` _(expression)_
    - :683 `toBe` expected `Number((h.total / numLeaves).toFixed(1))` _(expression)_
    - :684 `expect` expected _no expected value_ _(none)_
    - :686 `toBeCloseTo` expected `recomputed, 1` _(expression)_
    - :687 `expect` expected _no expected value_ _(none)_
    - :691 `toBe` expected `'This run is consistent with uniform paths (fail to reject H₀ at α=0.05).'` _(literal)_
    - :693 `toBe` expected _no expected value_ _(none)_
- `the adversary log shows paths only, and each path is the leaf last assigned` — e2e/claims.spec.ts:699
    - :707 `toContainText` expected `'Initialized.', READY` _(expression)_
    - :709 `toContainText` expected `'Done.', READY` _(expression)_
    - :713 `toBe` expected `clientRows.length` _(expression)_
    - :719 `toBe` expected `i + 1` _(expression)_
    - :720 `toBe` expected `i + 1` _(expression)_
    - :725 `expect` expected _no expected value_ _(none)_
    - :730 `expect` expected _no expected value_ _(none)_
    - :732 `expect` expected _no expected value_ _(none)_
    - :733 `expect` expected _no expected value_ _(none)_
    - :744 `expect` expected _no expected value_ _(none)_
    - :752 `expect` expected _no expected value_ _(none)_
    - :756 `toHaveCount` expected `0` _(literal)_
    - :757 `toHaveCount` expected `0` _(literal)_
    - :758 `toHaveText` expected `'Log cleared.'` _(literal)_
    - :761 `toContainText` expected `'Done. 20 total accesses', READY` _(expression)_
    - :762 `toHaveCount` expected `20` _(literal)_
- `the costs table arithmetic matches the ORAM the demo actually runs` — e2e/claims.spec.ts:767
    - :776 `toBe` expected `'1 block'` _(literal)_
    - :778 `toBe` expected `'Z·(L+1) = ${perAccess} blocks'` _(expression)_
    - :780 `toBe` expected `reads` _(expression)_
    - :784 `toBe` expected `'~${2 * perAccess}× per access'` _(expression)_
    - :787 `expect` expected _no expected value_ _(none)_
    - :788 `expect` expected _no expected value_ _(none)_
    - :791 `toBeVisible` expected _no expected value_ _(none)_
    - :792 `toHaveAttribute` expected `'href', '#caveats'` _(expression)_
- `scope copy distinguishes TEE leakage, Ring ORAM, and missing freshness` — e2e/claims.spec.ts:795
    - :799 `toContainText` expected `'A TEE alone does not automatically hide its access pattern'` _(literal)_
    - :800 `toContainText` expected `'Obladi'` _(literal)_
    - :801 `toContainText` expected `'Ring ORAM rather than Path ORAM'` _(literal)_
    - :802 `toContainText` expected `'no authenticated tree for path completeness or freshness'` _(literal)_
    - :803 `toContainText` expected `'paper proves an exponential tail for Z=5'` _(literal)_
    - :804 `toContainText` expected `'reports empirical support for Z=4'` _(literal)_
    - :805 `toContainText` expected `'perfect access-pattern privacy'` _(literal)_
- `server-view copy retains the transcript information the server really observes` — e2e/claims.spec.ts:808
    - :812 `toContainText` expected `'encrypted path reads/writes and their size, order, and timing'` _(literal)_
    - :813 `toContainText` expected `'receives no logical block ID or logical READ/WRITE label'` _(literal)_
    - :814 `toContainText` expected `'does not prove that client timing hides the logical operation'` _(literal)_
    - :815 `toContainText` expected `'Nothing else'` _(literal)_
- `the caveats link from exhibit 1 crosses to the exhibit that holds them` — e2e/claims.spec.ts:818
    - :820 `toBeVisible` expected _no expected value_ _(none)_
    - :821 `toBeHidden` expected _no expected value_ _(none)_
    - :824 `toBeVisible` expected _no expected value_ _(none)_
    - :825 `toBeHidden` expected _no expected value_ _(none)_
    - :826 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :827 `toBeVisible` expected _no expected value_ _(none)_
    - :828 `toHaveCount` expected `1` _(literal)_
- `the comparison table recomputes real Path and hierarchy traffic` — e2e/claims.spec.ts:833
    - :838 `toContainText` expected _no expected value_ _(none)_
    - :855 `toHaveCount` expected `expectedOperations.length` _(expression)_
    - :862 `toBe` expected `expectedOperations[index]` _(expression)_
    - :863 `toBe` expected `expectedResults[index]` _(expression)_
    - :867 `expect` expected _no expected value_ _(none)_
    - :868 `toBe` expected `pathOneWay` _(expression)_
    - :869 `toBe` expected `pathOneWay` _(expression)_
    - :870 `toBe` expected `2 * pathOneWay` _(expression)_
    - :873 `toBe` expected `2 * fixedHierarchyOneWay` _(expression)_
    - :888 `toBe` expected `'${expectedLevels} / ${expectedRebuildSlots}'` _(expression)_
    - :889 `expect` expected _no expected value_ _(none)_
    - :893 `expect` expected _no expected value_ _(none)_
    - :894 `expect` expected _no expected value_ _(none)_
    - :895 `expect` expected _no expected value_ _(none)_
    - :899 `expect` expected _no expected value_ _(none)_
    - :900 `expect` expected _no expected value_ _(none)_
    - :901 `expect` expected _no expected value_ _(none)_
    - :902 `expect` expected _no expected value_ _(none)_
- `the skipped-probe control returns equal data but exposes the cache hit` — e2e/claims.spec.ts:905
    - :909 `toContainText` expected _no expected value_ _(none)_
    - :914 `toHaveCount` expected `2` _(literal)_
    - :915 `toContainText` expected `'DEPTH-CONTROL'` _(literal)_
    - :916 `toContainText` expected `'DEPTH-CONTROL'` _(literal)_
    - :917 `toContainText` expected `'5 probes and read 31 lookup slots'` _(literal)_
    - :918 `toContainText` expected `'stopped after 1 probe and 1 lookup slot'` _(literal)_
    - :919 `toContainText` expected `'correct plaintext did not imply an oblivious access'` _(literal)_
- `the hierarchy lesson keeps its finite adaptation and threat-model limits visible` — e2e/claims.spec.ts:922
    - :926 `toContainText` expected `'about 21.31N server slots'` _(literal)_
    - :927 `toContainText` expected `'transient O(N) client memory'` _(literal)_
    - :928 `toContainText` expected `'not a performance benchmark'` _(literal)_
    - :929 `toContainText` expected `'not a transferred security proof'` _(literal)_
    - :930 `toContainText` expected `'does not reproduce Alibi\'s combined-stash attack or repair'` _(literal)_
    - :931 `toContainText` expected `'informational, not process isolation'` _(literal)_
    - :932 `toContainText` expected `'does not hide timing or termination'` _(literal)_
    - :933 `toHaveCount` expected `1` _(literal)_
    - :934 `toHaveCount` expected `1` _(literal)_
    - :935 `toHaveCount` expected `1` _(literal)_
    - :952 `toBeVisible` expected _no expected value_ _(none)_
- `every multi-client refusal is the one the rendered rights table predicts` — e2e/claims.spec.ts:972
    - :980 `toBe` expected `16` _(literal)_
    - :984 `toContainText` expected `'released', HEAVY` _(expression)_
    - :988 `expect` expected _no expected value_ _(none)_
    - :993 `expect` expected _no expected value_ _(none)_
    - :1000 `toBe` expected _no expected value_ _(none)_
    - :1010 `toBe` expected _no expected value_ _(none)_
    - :1016 `toMatch` expected `/AccessDeniedError|EntryVerificationError|EnvelopeAuthError/` _(regex)_
    - :1019 `expect` expected _no expected value_ _(none)_
    - :1020 `toEqual` expected `[]` _(expression)_
- `the shared-key deployment exposes a clinician entry to the billing client` — e2e/claims.spec.ts:1023
    - :1029 `toContainText` expected `'Three outcomes computed', HEAVY` _(expression)_
    - :1036 `expect` expected _no expected value_ _(none)_
    - :1038 `toBe` expected `entry` _(expression)_
    - :1039 `expect` expected _no expected value_ _(none)_
    - :1040 `expect` expected _no expected value_ _(none)_
    - :1047 `toBe` expected `leaves[2]` _(expression)_
    - :1051 `expect` expected _no expected value_ _(none)_
    - :1052 `expect` expected _no expected value_ _(none)_
    - :1054 `expect` expected _no expected value_ _(none)_
    - :1055 `expect` expected _no expected value_ _(none)_
    - :1057 `toEqual` expected `[]` _(expression)_
- `the collusion table’s candidate set always contains the entry it names` — e2e/claims.spec.ts:1060
    - :1064 `toContainText` expected `'mean candidate set', HEAVY` _(expression)_
    - :1067 `toBe` expected `8` _(literal)_
    - :1080 `toBe` expected `candidates.length` _(expression)_
    - :1082 `expect` expected _no expected value_ _(none)_
    - :1083 `expect` expected _no expected value_ _(none)_
    - :1086 `toEqual` expected `[actual]` _(expression)_
    - :1091 `expect` expected _no expected value_ _(none)_
    - :1095 `toBe` expected `narrowed` _(expression)_
    - :1096 `toEqual` expected `[]` _(expression)_
- `the collusion panel states the bound as evidence rather than as a proof` — e2e/claims.spec.ts:1099
    - :1102 `toContainText` expected `'mean candidate set', HEAVY` _(expression)_
    - :1104 `toContainText` expected `'evidence consistent with'` _(literal)_
    - :1105 `toContainText` expected `'not a proof of it'` _(literal)_
    - :1106 `toContainText` expected `'o(n)'` _(literal)_
    - :1107 `toContainText` expected `'implements neither'` _(literal)_
- `every multi-client control behaves as the page says it expects` — e2e/claims.spec.ts:1110
    - :1114 `toContainText` expected `'controls', HEAVY` _(expression)_
    - :1117 `toBe` expected `12` _(literal)_
    - :1120 `toBe` expected _no expected value_ _(none)_
    - :1125 `toContainText` expected _no expected value_ _(none)_
    - :1131 `toContainText` expected `'EnvelopeAuthError'` _(literal)_
    - :1132 `toContainText` expected `'EntryVerificationError'` _(literal)_
    - :1133 `toContainText` expected `'StaleEntryError'` _(literal)_
    - :1134 `toContainText` expected `'ConcurrencyRefusedError'` _(literal)_
    - :1135 `toContainText` expected `'AccessDeniedError'` _(literal)_
    - :1136 `toEqual` expected `[]` _(expression)_
- `the server view and the omniscient view are different panels with different content` — e2e/claims.spec.ts:1139
    - :1144 `toContainText` expected `'controls', HEAVY` _(expression)_
    - :1151 `toMatch` expected `/path:read:\d+/` _(regex)_
    - :1152 `expect` expected _no expected value_ _(none)_
    - :1153 `expect` expected _no expected value_ _(none)_
    - :1154 `expect` expected _no expected value_ _(none)_
    - :1159 `toMatch` expected `/^(?:(?:log|state|path|stash):(?:read|write):\d+\|?)+$/` _(regex)_
    - :1169 `expect` expected _no expected value_ _(none)_
    - :1170 `toBe` expected `reads` _(expression)_
    - :1171 `toBe` expected `writes` _(expression)_
    - :1174 `toMatch` expected `/(Clinician|Billing|Contractor) (read|write) entry \d+ via leaf \d+/` _(regex)_
    - :1175 `toMatch` expected `/(Clinician|Billing|Contractor) (read|write) entry \d+ via leaf/` _(regex)_
    - :1176 `expect` expected _no expected value_ _(none)_
- `starting one multi-client scenario retires the others` — e2e/claims.spec.ts:1179
    - :1182 `toContainText` expected `'released', HEAVY` _(expression)_
    - :1184 `expect` expected _no expected value_ _(none)_
    - :1187 `toContainText` expected `'controls', HEAVY` _(expression)_
    - :1191 `toContainText` expected `'Retired'` _(literal)_
    - :1192 `toContainText` expected `'Retired'` _(literal)_
    - :1193 `toHaveCount` expected `1` _(literal)_
    - :1194 `toContainText` expected `'AccessDeniedError'` _(literal)_
- `the multi-client lesson keeps its actors, collusion model and non-claims visible` — e2e/claims.spec.ts:1197
    - :1203 `toContainText` expected `'Data owner'` _(literal)_
    - :1204 `toContainText` expected `'honest by assumption'` _(literal)_
    - :1205 `toContainText` expected `'No coordinator and no key service'` _(literal)_
    - :1207 `toContainText` expected `'Client ↔ client'` _(literal)_
    - :1208 `toContainText` expected `'Client ↔ server'` _(literal)_
    - :1209 `toContainText` expected `'Server → client'` _(literal)_
    - :1211 `toContainText` expected `'Secrecy — claimed'` _(literal)_
    - :1212 `toContainText` expected `'Tamper resistance — claimed'` _(literal)_
    - :1213 `toContainText` expected `'Accountable integrity — claimed'` _(literal)_
    - :1214 `toContainText` expected `'Integrity — NOT claimed'` _(literal)_
    - :1215 `toContainText` expected `'Anonymity — NOT claimed'` _(literal)_
    - :1216 `toContainText` expected `'Concurrency or linearizability — refused outright'` _(literal)_
    - :1217 `toContainText` expected `'Freshness / rollback resistance'` _(literal)_
    - :1218 `toContainText` expected `'A first-contact client cannot detect the same rollback'` _(literal)_
    - :1220 `toContainText` expected `'key-exposure-free'` _(literal)_
    - :1221 `toContainText` expected `'oblivious gossiping protocol'` _(literal)_
    - :1222 `toContainText` expected `'informational'` _(literal)_
    - :1223 `toContainText` expected `'docs/multi-client-design.md'` _(literal)_
    - :1225 `toHaveCount` expected `1` _(literal)_
    - :1226 `toHaveCount` expected `1` _(literal)_
    - :1227 `toHaveCount` expected `1` _(literal)_
    - :1228 `toHaveCount` expected `1` _(literal)_
    - :1229 `toHaveCount` expected `1` _(literal)_

**Mutation records** (1 file(s)):

- `scripts/mutations.mjs` (11731 bytes)

<details><summary>Full README</summary>

```markdown
# crypto-lab-oram-vault

## What It Is

**Browser-based ORAM lab** implementing Path ORAM from Stefanov et al. "Path ORAM: An Extremely Simple Oblivious RAM Protocol" (CCS 2013, JACM 2018) and a bounded hierarchical-ORAM teaching adaptation grounded in Alibi §2.5/Figure 2 and Goodrich–Mitzenmacher §5/Figure 2.

A fully interactive browser demo of Path ORAM — an Oblivious RAM construction that hides which logical block a client accesses from a storage server in the protocol's stated model. Encryption hides data contents; Path ORAM randomizes and rewrites a full tree path so physical storage locations do not reveal the logical address. Related ORAM research includes secure-processor prototypes, SGX memory/file systems, and oblivious databases, but those systems do not all use Path ORAM.

The demo separates client and server APIs: the server module stores fixed-size encrypted blobs and receives whole-path read/write requests, never logical block IDs, the position map, or stash contents. This is an explanatory module boundary inside one browser page, not process or cryptographic isolation. Blocks use AES-256-GCM through Web Crypto; within the demo's encryption module, a private per-key counter gives every supported block encryption a distinct 96-bit nonce, and random leaf assignments use `crypto.getRandomValues`.

The hierarchical extension executes the generic scan/probe/delete/reinsert/rebuild schedule with a one-block cache and levels of logical capacity 2, 4, 8 and 16. Each hashed level gets a fresh secret HMAC-SHA-256 placement key on rebuild; after a hit, later levels receive unique dummy labels. Its bucket table is deliberately overprovisioned so a level containing at most `c` real blocks has `c` buckets of `c` slots each. That eliminates data-dependent build failure for this fixed `N=16` lesson, but costs 341 server slots and transient `O(N)` client rebuild memory. It is not the papers' asymptotically efficient oblivious hash table or a transferred security proof. It has no cuckoo stash or combined stash, so it neither reproduces nor claims to repair the combined-stash vulnerability studied later in Alibi.

**Parameters:** both routes use N=16 logical blocks and 32-byte data. Path ORAM uses Z=4, L=4 and 124 encrypted server slots. The bounded hierarchy uses five levels (cache plus capacities 2/4/8/16), 341 encrypted server slots, four placement keys and fixed 31-slot reads plus 31-slot rewrites before scheduled rebuild traffic. Both use 12-byte AES-GCM nonces.

## When to Use It

- Understanding why encryption hides contents but not access patterns
- Comparing the restricted 1996 Goldreich–Ostrovsky lower bound with the general online Ω(log N) lower bound proved by Larsen–Nielsen (2018)
- Evaluating ORAM for healthcare record systems, SGX enclaves, cloud storage
- Visualizing how the Path ORAM tree + stash + position map work together
- Comparing Path ORAM's fixed per-access tree traffic with hierarchical lookup traffic and binary-carry rebuild spikes
- Comparing ORAM cost vs. alternatives (PIR, TEE, differential privacy)
- Seeing why two clients who do not trust each other cannot simply share a single-client ORAM's key and position map
- Separating authorization, confidentiality, access-pattern privacy, tamper resistance, accountable integrity, freshness and concurrency as distinct properties with distinct failures
- Do NOT use for production — use a maintained library (PathORAM C++, Go equivalents); this is educational and runs in a browser.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-oram-vault](https://systemslibrarian.github.io/crypto-lab-oram-vault/)**

The demo presents seven exhibits: the access-pattern attack and side-channel threat model — with a one-click replay that runs the same Monday/Tuesday/Friday logical accesses through a live ORAM, removing record identity from the path trace while leaving the timing burst visible; an interactive binary tree contrasting the server's encrypted view with the client's view; a step-by-step READ/WRITE trace; a side-by-side adversary/client log; a costs/when-to-use panel; and an executable Path-versus-hierarchy comparison. The tree includes a live block → leaf position map and an eviction-legality explanation. The comparison sends the same eight-operation workload through both constructions, verifies all 16 final blocks against a separate reference map, displays traffic from the actual server logs, and runs a skipped-dummy-probe counterexample. The seventh exhibit shares one encrypted store between three mutually distrustful clients with different rights, and runs four scenarios from live protocol state: the honest baseline, the executable failure of naively sharing single-client ORAM state, a client-plus-server collusion attack on obliviousness, and twelve protocol/property controls. Privacy claims are scoped to logical-address hiding against a semi-honest storage server and link to the residual-leakage caveats; the multi-client exhibit states its own, narrower model on the page.

## What Can Go Wrong

- **Finite-stash failure** remains possible. Its probability depends on bucket size and the provisioned stash capacity; recursion solves the position-map storage problem, not stash overflow.
- **Timing and termination leakage** remains. This browser code is not constant-time and does not schedule or pad application operations.
- **Position map is O(N).** For large N, the position map doesn't fit on the client. Recursive ORAM stores it in another ORAM instance.
- **The bounded hierarchy trades away asymptotic efficiency.** Its 341 slots are about 21.31N, and a rebuild decrypts up to all 16 real blocks into trusted memory. The cited constructions require efficient oblivious hashing/sorting machinery that this table intentionally does not reproduce.
- **The module boundary is informational, not isolation.** Client and server code share one page; a malicious same-origin script can inspect client state.
- **No path freshness/completeness proof.** AES-GCM now rejects malformed or modified individual blobs, and missing target blocks fail closed, but a malicious server can still replay or omit valid data. Path ORAM §6.4 describes a Merkle-tree extension for integrity with freshness; Onion ORAM describes a malicious-server construction. Ring ORAM is a different bandwidth-optimized construction, not a malicious-security layer for this demo.
- **Side-channels in the browser.** Cache timing, allocation and garbage collection can leak information. A deployment must separately engineer the client, scheduling, padding and hardware for its side-channel threat model.
- **A colluding client defeats obliviousness in the multi-client store, and no `o(n)` construction can prevent it.** Maliciously Secure Multi-Client ORAM (IACR ePrint 2017/329) §2.2 Theorem 1 rules that out for any multi-client ORAM touching `o(n)` physical addresses per operation, which this Path-ORAM-shaped store does. Exhibit 7 executes the break rather than describing it.
- **The multi-client store provides tamper resistance, not integrity.** An unauthorised write lands on the server; every honest reader then rejects it and `blame` names the writer. Preventing the write would need a server-side access-control check, which the construction deliberately removes (GORAM, IACR ePrint 2015/224, §4) because such a check would reveal which entry is being written.
- **The multi-client store refuses concurrency rather than supporting it.** Two overlapping accesses race on the shared leaf map and the path write-back; the lesson serialises accesses, refuses an overlapping one with a stated reason, and exhibits the lost update that appears when the refusal is lifted. Linearizability is not claimed.

## Real-World Usage

- Introduced by Stefanov, van Dijk, Shi, Fletcher, Ren, Yu, and Devadas at CCS 2013; extended JACM 2018.
- Ascend and PHANTOM are ORAM-backed secure-processor research prototypes; neither is Intel SGX.
- ZeroTrace evaluated Path ORAM and Circuit ORAM on Intel SGX, while OBLIVIATE adapted ORAM for SGX file access.
- Obladi is related oblivious-OLTP work but builds on Ring ORAM, not Path ORAM.
- Goldreich–Ostrovsky's 1996 Ω(log N) lower bound applied to statistically secure balls-in-bins ORAMs; Larsen–Nielsen proved the general online computational bound in 2018. OptORAMa supplied the first asymptotically optimal general ORAM in 2020.
- The 16-line pseudocode makes Path ORAM the simplest practical ORAM construction.

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-oram-vault
cd crypto-lab-oram-vault
npm install
npm run dev
`​``

## Related Demos

- [crypto-lab-oblivious-shelf](https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/) — 2-server IT-PIR hides a single query index instead of access patterns.
- [crypto-lab-patron-shield](https://systemslibrarian.github.io/crypto-lab-patron-shield/) — IT-PIR applied to library catalog privacy.
- [crypto-lab-psi-gate](https://systemslibrarian.github.io/crypto-lab-psi-gate/) — private set intersection for contact discovery.
- [crypto-lab-silent-tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) — Shamir-based MPC secure sum.

## Seven Exhibits

1. **Why Encryption Alone Isn't Enough** — the access-pattern attack, side-channel threat model, what ORAM prevents, and a one-click replay showing independent random paths while the access-count/timing cluster remains visible
2. **Tree Visualization** — interactive binary tree showing server view (identical encrypted blobs) vs. client view (real block IDs from the client's retained record of its latest path write-back); a live block → leaf position-map table that highlights and re-randomizes the accessed row; an eviction-legality explainer that uses the position map to check why each recorded on-path block may rest only in buckets its assigned leaf shares with the write-back path; live path highlighting during accesses
3. **Access Walkthrough** — step-by-step trace of a single READ or WRITE: position-map lookup, re-randomization, path read, stash update, greedy eviction, write-back
4. **Adversary vs. Client** — side-by-side log of what the server observes (uniform random paths) vs. what the client actually did (specific block accesses)
5. **Costs and When to Use** — bandwidth overhead table, use-case guide, research-system distinctions, cross-links to related labs
6. **Path vs. Hierarchy** — one workload executed by both implementations; current-run output verification, fixed all-level probes, fresh HMAC-key rebuilds, measured binary-carry spikes, client/server-state comparison and an executable skipped-probe depth leak
7. **Distrustful Clients** — three clients with different rights over one encrypted store; the honest baseline with every release and every refusal derived from live protocol state, the executable failure of sharing single-client ORAM state, a client-plus-server collusion attack on obliviousness with a measured rate, and twelve negative controls including stale state, wrong client, wrong entry, replay, rollback, tampering and a concurrent write

## Protocol Implementation

Implements the core access shape of Algorithm 1 from the 2018 JACM paper, with added runtime validation, serialized client operations, authenticated-block failure handling, and generation checks for the demo's singleton server:

`​``
Access(op, a, data*):
  1. x ← position[a]
  2. position[a] ← uniform random leaf
  3. Read path P(x) from server
  4. Decrypt all blocks → add real blocks to stash
  5. if READ: data ← stash[a]
     if WRITE: stash[a] ← data*
  6. Greedy eviction: write back path P(x) with fresh-nonce encryption
  7. Return data
`​``

Every access reads AND writes a full path. The position map is re-randomized
before the old path is read and written back. Block re-encryption through the
demo module uses a private per-key nonce prefix and monotonic counter, so its
supported 2³² encryptions under one generated key cannot reuse a GCM nonce. The
same-origin-code limitation above still applies: this module rule is not misuse
resistance against code that can reach client state.

The bounded hierarchical route follows this finite schedule:

`​``
Access(op, a, data*):
  1. Scan the one-block cache for a
  2. For every hashed level i:
       probe HMAC(key_i, a) if not found
       otherwise probe HMAC(key_i, unique-dummy(access, i))
       read and freshly rewrite the complete selected bucket
  3. Remove the authenticated target; apply READ or WRITE
  4. Reinsert at level 0
  5. Carry through occupied levels; extract and clear each complete level
  6. Build the first empty level (or the bottom) under a fresh placement key
`​``

The storage observer's hierarchy API contains only `{phase, operation, level,
bucket, slotCount}`. The learner trace separately exposes probe kind, hit level
and logical id as an omniscient explanatory view; those fields are not passed to
the server. Rebuild timing follows the public access counter, and the client
refuses before its 32-bit dummy-label counter could wrap. The executable
`skip-after-hit` control returns the same plaintext but reads only one slot on a
cache hit instead of the fixed 31, demonstrating why correct output alone does
not establish obliviousness.

Primary construction sources:

- [Falk, Noble and Ostrovsky, *Alibi*, EUROCRYPT 2021, §2.5 and Figure 2](https://web.cs.ucla.edu/~rafail/PUBLIC/248.pdf)
- [Goodrich and Mitzenmacher, *Privacy-Preserving Access of Outsourced Data via Oblivious RAM Simulation*, arXiv:1007.1259v2 (2 May 2011), §5 and Figure 2](https://arxiv.org/abs/1007.1259)
- [Goldreich and Ostrovsky, *Software Protection and Simulation on Oblivious RAMs*, JACM 1996](https://doi.org/10.1145/233551.233553)

## Multi-Client Sharing (Exhibit 7)

Exhibit 7 is a separate store. It does not change Path ORAM, the hierarchy, or
any pinned result above; it instantiates its own `MultiClientStore` with the same
geometry (N=16, Z=4, L=4, 31 buckets) so the single-client singleton is untouched.

**Construction implemented:** the S-GORAM shape of GORAM — A-GORAM (§4) with
predicate encryption replaced by broadcast encryption (§5) — with the
tamper-resistance mechanism PIR-MCORAM specifies (ePrint 2017/329 §3), evaluated
in the GORAM attacker model (§2.3). The pre-implementation design decision
record, including every alternative considered and rejected and why, is
[`docs/multi-client-design.md`](docs/multi-client-design.md).

**What is cryptographically enforced, not merely hidden from the UI:**

- **Read rights** — each entry has its own data key `k_j`. The envelope carries
  one fixed-size wrap slot per registered client, holding `k_j` under that
  client's key when `ACM(i,j) ∈ {R, RW}` and indistinguishable random bytes
  otherwise. A client without a real wrap fails AES-256-GCM authentication. This
  is a trivial instantiation of broadcast encryption, not Gentry–Waters.
- **Write rights** — the owner issues an ECDSA P-256 capability over
  `(client, entry)`. A writer bumps the entry version and signs
  `(index, version, ciphertext digest)`. Every parse verifies the capability
  under the owner's key, the writer signature under that client's key, and that
  the capability names that writer and that entry.
- **Accountability** — an append-only, client-signed upload log is kept as a hash
  chain on the server; `blame` walks it to the last consistent version and names
  the signer of the upload that broke the entry. Direct catch-up reveals the
  requested starting sequence and how many signed path records the client missed;
  this synchronization channel is not oblivious.
- **Returning-client rollback detection** — per-entry monotonic versions and
  client-local watermarks. A rolled-back envelope with entirely genuine
  signatures is refused only when that client has already seen a newer version.
  The signed upload log authenticates path history but is not a global,
  owner-signed per-entry version head.
- **Synchronisation** — accesses are serialised; an overlapping access is refused
  with a named error rather than silently racing.

**Actors and trust boundaries.** The owner is honest by assumption and holds the
access-control matrix, all master key material and the capability signing key.
Clients are mutually distrustful and may be malicious; each
holds only its own capability. The server is untrusted for confidentiality and
honest-but-curious for the accountability claim. There is deliberately **no
coordinator or key service** — adding one would be the proxy-based construction
of ePrint 2017/329 §5, which this lesson rejects because a trusted sequencer
would hold the access-control matrix and know every logical index.

**Collusion, in three directions.** Client ↔ client is assumed possible, so
secrecy and attribution are claimed only outside the union of corrupted clients'
rights. Client ↔ server is assumed *not* to happen (GORAM §2.3, *"not to collude
with clients"*) — and exhibit 7 removes that assumption and executes the
resulting break. Server → client lying by omission, replay or reordering is
assumed possible; signatures, the remembered log digest and local version
watermarks detect some tampering and rollback for returning clients, while
integrity and global freshness are not claimed.

**Not claimed:** integrity in ePrint 2017/329 §2.1's sense (which requires a
server-side access-control check this construction removes); obliviousness
against malicious clients (ruled out at this access cost by that paper's §2.2
Theorem 1); anonymity (the signature-based mechanism is substituted for a
chameleon hash, and the textbook discrete-log chameleon hash is not key-exposure
free); concurrency or linearizability; revocation of knowledge already released
(key rotation stops future reads and retracts nothing); first-contact or global
freshness, freshness against a server that withholds state, or protection after
a client loses its local memory; and any theorem from any of the cited papers.

Primary multi-client sources, with the sections read:

- [Maffei, Malavolta, Reinert and Schröder, *GORAM — Group ORAM for Privacy and Access Control in Outsourced Personal Records*, IACR ePrint 2015/224 (25 August 2015), §2.1–2.3, §3.1–3.2, §4–§5](https://eprint.iacr.org/2015/224)
- [Maffei, Malavolta, Reinert and Schröder, *Maliciously Secure Multi-Client ORAM*, ACNS 2017, IACR ePrint 2017/329, §2.1–2.3, §3, §4, §5, §6](https://eprint.iacr.org/2017/329)
- [Chow, Fech, Lai and Malavolta, *Multi-client Oblivious RAM with Poly-logarithmic Communication*, ASIACRYPT 2020, IACR ePrint 2020/1551, §5.1–5.3 and Figure 3](https://eprint.iacr.org/2020/1551)
- [Backes, Herzberg, Kate and Pryvalov, *Anonymous RAM*, ESORICS 2016, IACR ePrint 2016/678, §3.1–3.2](https://eprint.iacr.org/2016/678)
- [Chow and Lai, *Multi-Client Oblivious RAM*, Encyclopedia of Cryptography, Security and Privacy, Springer 2025, pp. 1592–1594](https://doi.org/10.1007/978-3-030-71522-9_1550) — full entry, including its coalition-based obliviousness definition and warning that mutually distrustful clients must jointly maintain the database structure. The bounded lesson demonstrates why its cheaper selected adaptation does not meet that full definition.

## Testing

The protocol modules ship with a Vitest suite (`npm test`) that asserts both the
**correctness** and the **security properties** the demo claims — not just that the
code runs:

- **Encryption** — AES-256-GCM round-trips; a fresh 96-bit nonce per module
  encryption call (no reuse); dummy blocks are byte-shaped like real blocks yet decrypt to `null`;
  tampered ciphertext and wrong-key blocks are rejected by the GCM tag.
- **Correctness and boundaries** — every block is physically present exactly once
  after initialization; read-after-write, last-write-wins, a 200-step reference
  workload, serialized concurrent calls, copied return values, fixed-size server
  payloads, atomic path writes, and fail-closed missing/tampered blocks.
- **Obliviousness** — every access is exactly one full path read + one full path
  write; the server log holds only `{bucketId, operation, timestamp}` (never block
  ids); a READ and a WRITE produce the same API-operation and byte-length footprint; the accessed
  block is re-randomized to a fresh leaf each access; repeatedly hitting one block
  yields a near-uniform path distribution (χ² goodness-of-fit, df=15).
- **Observed stash occupancy** — the high-water mark stays within the explicit
  test ceiling across a 1000-access workload (the live demo surfaces this as the
  "Stash Peak" stat). This is empirical evidence for the configured `Z=4` toy,
  not the paper's proved exponential tail bound, which is established for `Z=5`.
- **Bounded hierarchy** — exact table geometry, an RFC 4231 HMAC vector, all-block
  recovery, reference-map workloads, serialization and input boundaries, every-level
  real/dummy probing, binary-carry rebuild cadence, event-derived traffic, and a
  server view with no logical labels or hit state.
- **Construction comparison and negative control** — the same workload executes in
  both implementations, every final block is checked against a separate map, Path
  and hierarchy traffic are derived from their event logs, and stopping after a
  cache hit is shown to leak one-slot versus 31-slot lookup depth while preserving
  the returned value.
- **Multi-client authorization and secrecy** — a client with no wrap slot fails GCM
  authentication rather than being refused by a flag; a capability issued to a
  different client or for a different entry is rejected; the fixed-size envelope
  is byte-identical in length whatever a client's rights are; the signed upload
  log is a hash chain whose head every client re-derives, including its own last
  record; an overlapping access is refused by name.
- **Multi-client integrity boundary, freshness and revocation** — the Figure 3
  experiment of ePrint 2020/1551 §5.2 with its preconditions asserted and a
  concrete adversary win, which is why Definition 16 integrity is not claimed;
  tampered ciphertext rejected; an unauthorised write landing, being
  rejected on read, and `blame` naming the writer; a rollback under entirely
  genuine signatures refused by a returning client, accepted by a first-contact
  reader, and returned once the freshness check is switched off, which pins both
  the protection and its local-memory boundary; a
  concurrent write refused, and the update lost when the refusal is lifted; key
  rotation stopping future reads while retracting nothing.
- **Naive sharing, executed on the existing Path ORAM** — one client decrypts
  another's plaintext during its own legitimate access; the shipped integrity
  check fires on honest data; and a bounded series of genuine remaps reports
  when two independent position-map copies actually diverge. A remap can select
  the current leaf, so neither the page nor the tests claim that one write must
  change the numeric leaf.
- **Multi-client server transcript** — authorized reads and writes plus ordinary
  authorization refusals produce the identical ORAM data-event sequence and slot
  counts across entries and clients; malformed, stale, tampered and concurrent
  requests fail closed outside this padding claim. The full transcript is not
  fixed: log catch-up exposes variable signed-record counts and requested starting
  sequences. No data event carries an entry index or a client identity; and the leaf alone, once a
  corrupted client decrypts the shared leaf map, narrows sixteen entries to a
  handful that always contains the accessed one — reported as a reduction, which
  is what the measurement supports, not as an identification.
- **UI smoke** — `main.ts` boots under happy-dom with every wired control resolving,
  tab switching works, a Path READ renders the tree, the comparison and
  skipped-probe controls run end-to-end, and a multi-client baseline run verifies
  against its retained mirror.

`​``bash
npm run typecheck   # tsc --noEmit over src + tests
npm test            # vitest run (120 tests)
npm run test:mutation # clean baseline, then all 22 mutations caught (12 hierarchy, 10 multi-client)
npm run test:a11y   # Playwright: 29 claim, border and axe tests at desktop and 380px
npm run test:workflow
npm run test:coverage
`​``

CI (`.github/workflows/deploy.yml`) runs clean-install, audit, type-check, unit,
workflow-policy and build gates on Node 22/24/26, then browser claim/accessibility
tests. Only the no-checkout deploy job receives Pages/OIDC authority, and both
artifact packaging and deployment require the `main` ref even on manual runs.

## Stack

Vite · TypeScript strict · Vanilla CSS · Web Crypto API · Vitest · GitHub Pages

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## PSI Gate

- **slug**: `crypto-lab-psi-gate`
- **repo**: https://github.com/systemslibrarian/crypto-lab-psi-gate
- **live**: https://systemslibrarian.github.io/crypto-lab-psi-gate/
- **commit_sha**: `dccad1e410d9a2dfe6be9714b8564aaa2502e60e` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PRIVACY  ·  **level**: advanced  ·  **--accent**: MISSING
- **MISSING FIELDS**: accent, mutations, verification

**Name (H1)**: PSI Gate  — _read from src/main.ts_

**Subtitle**: DH-PSI · ristretto255 · three-round Diffie-Hellman  — _read from src/main.ts_

**Description**: Watch two parties compute A ∩ B by commutatively blinding hashed elements, so each learns only the matches and never the other's non-matching set.  — _read from src/main.ts_

**Why it matters**: Contact discovery, ad-conversion measurement, and compromised-password checks all need to intersect private lists without leaking the rest. PSI delivers that guarantee, resting on commutative blinding and the DDH assumption.  — _read from src/main.ts_

**Card copy**: Classic DH-PSI over ristretto255 with RFC 9380 hash-to-curve, showing how two parties learn their overlap (and each other's set size) and nothing more.

**Chips**: DH-PSI · ristretto255 · Hash-to-Curve · Contact Discovery

**Implements**: EC point arithmetic `src/group.ts:192`, Hash-to-curve `src/group.ts:167`, OPRF `src/attacks.ts:389`, Private set intersection `src/oprf-psi.ts:92`, ristretto255 `src/attacks.ts:353`, SHA-256 `src/oprf-psi.ts:96`

**Attacks shown**: Dictionary attack `src/attacks.ts:77`, Replay attack `src/attacks.ts:126`, Side-channel (unspecified) `src/main.ts:1942`, Signature malleability `src/attacks.ts:298`

**Comment-only (named in code comments, not executed)**: Diffie-Hellman `src/attacks.ts:2`, Ed25519 `src/attacks.ts:318`, Merkle tree `src/attacks.ts:385`, OPAQUE `src/group.ts:156`, secp256k1 `src/attacks.ts:249`, X25519 `src/attacks.ts:249`

**References**: Bloom filter, Diffie-Hellman, Double Ratchet, Ed25519, OPAQUE, Oblivious transfer, Paillier, Private information retrieval, SHA-512, TFHE, X25519

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `doi.org/10.1007/978-3-642-15317-4_26` — first seen README.md:219 (1×)
- `RFC 9380` — first seen README.md:10 (6×)
- `RFC 9496` — first seen README.md:108 (9×)
- `rfc9496` — first seen README.md:108 (1×)

**Stated limitations (page)**:

- _(caveat, src/main.ts)_ Not constant-time. JavaScript BigInt and array ops leak timing through engine internals (GC, JIT). Use a native constant-time library (libsodium, BoringSSL) in production. Not malicious-secure. No ZK proofs of correct β-application, no commitment to set sizes, no DoS defenses. See VOLE-PSI for malicious security. Not side-channel hardened. No defense against cache, branch, or power side channels. Not formally verified. The simulator sketch above is a proof intuition, not a machine-checked proof. See Hazay-Lindell or Pinkas-Schneider-Zohner for full proofs. PSI Protocol Comparison Protocol Year Communication Computation Security Notes DH-PSI (this demo) 1986 O(n + m) group elts O(n + m) scalar muls Semi-honest, DDH Simple, slow; baseline for understanding PSI Basic OPRF-PSI (inspired by JL10) 2010 O(n + m) group elts O(n + m) scalar muls Semi-honest (this demo) Simplified exponentiation OPRF; inspired by JL10, but omits its malicious-security machinery KKRT16 2016 O(n) ciphertexts O(n) symmetric ops Semi-honest OT-extension based; ~10⁶ elts/sec in C++ SpOT-Light (PRTY19) / CM20 2019 / 2020 O(n) bits asymptotic O(n) Semi-honest Communication-optimal for small intersection PaXoS (PRTY20) / VOLE-PSI (RS21) 2020 / 2021 O(n) O(n) field ops Malicious State-of-the-art; malicious security at near-semi-honest cost FHE-PSI (Chen-Laine-Rindal) 2017 O(n) ciphertexts Heavy (FHE) Semi-honest Asymmetric: useful when one party has tiny set, other has huge

**README — What Can Go Wrong**:

```text
- **Set sizes are revealed.** Both parties learn how many elements the other has.
  Hiding set sizes requires more sophisticated protocols (PaXoS, CM20).

- **Dictionary attacks work against small domains.** Alice receives the intersection
  in this construction, so malicious Alice can place an enumerable domain (phone
  numbers, PINs, short codes) in A and recover Bob's matching elements. An online
  service needs authenticated queries, strict batch and rate limits, and abuse
  monitoring. A bare OPRF-PSI protocol does not prevent the receiver from submitting
  the same dictionary.

- **Scalar reuse is catastrophic.** If Alice reuses α across sessions with Bob, Bob
  can link sessions and detect which elements changed. Fresh α per session is mandatory.

- **Semi-honest security only.** The protocol assumes both parties follow it honestly.
  An actively malicious party can deviate — reuse scalars intentionally, inflate or
  deflate its set, or lie about results. Malicious-security PSI requires additional
  ZK proofs. Received-point validation *is* implemented on every receive path, so a
  malformed or identity encoding aborts rather than corrupting the run; that closes
  one specific active attack, not the model.

- **Inherent information leakage.** Even a perfect PSI tells Alice which of her elements
  are in Bob's set. That fact alone may be sensitive depending on context.
```

**Claims tested** (e2e/claims.spec.ts, 25 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:46
    - :46 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:50
    - :50 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:75
    - :75 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:76
    - :76 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:85
    - :85 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:114
    - :114 `toHaveText` expected `'Step ${index + 1} / 6'` _(expression)_
- `exhibit 1 reports the true intersection of the two lists it printed` — e2e/claims.spec.ts:134
    - :141 `expect` expected _no expected value_ _(none)_
    - :142 `expect` expected _no expected value_ _(none)_
    - :144 `expect` expected _no expected value_ _(none)_
    - :147 `toBe` expected `0` _(literal)_
    - :150 `toBeVisible` expected _no expected value_ _(none)_
    - :153 `toBe` expected `expected.length` _(expression)_
    - :154 `toBe` expected `aliceContacts.length` _(expression)_
    - :155 `toBe` expected `serverUsers.length` _(expression)_
    - :159 `toEqual` expected `sorted(expected)` _(expression)_
    - :163 `toEqual` expected `sorted(expected)` _(expression)_
    - :164 `toEqual` expected _no expected value_ _(none)_
    - :168 `toBe` expected `aliceContacts.length` _(expression)_
    - :176 `expect` expected _no expected value_ _(none)_
    - :177 `toEqual` expected `[` _(expression)_
    - :186 `toHaveText` expected `'Run PSI Again'` _(literal)_
    - :188 `toHaveText` expected `'Run PSI Again'` _(literal)_
    - :189 `toEqual` expected `sorted(expected)` _(expression)_
- `exhibit 2 converges only the shared element, and only after both locks` — e2e/claims.spec.ts:194
    - :201 `toBe` expected `true` _(expression)_
    - :205 `toEqual` expected `['bob@example.com']` _(expression)_
    - :214 `toHaveLength` expected `2` _(literal)_
    - :215 `toBe` expected `bothSides[1]` _(expression)_
    - :217 `toBe` expected `hashOf.size` _(expression)_
    - :225 `toEqual` expected `[]` _(expression)_
    - :227 `toHaveCount` expected `2` _(literal)_
    - :231 `toBe` expected `'false'` _(literal)_
    - :241 `toEqual` expected `shared` _(expression)_
    - :242 `toEqual` expected `shared` _(expression)_
    - :245 `toBe` expected `sharedHexB` _(expression)_
    - :251 `toEqual` expected `[]` _(expression)_
    - :255 `toHaveClass` expected `/e2-snap ok/` _(regex)_
    - :257 `toHaveLength` expected `2` _(literal)_
    - :258 `toBe` expected `snapHexes[1]` _(expression)_
    - :259 `toBe` expected `true` _(expression)_
    - :264 `toEqual` expected `sorted(shared)` _(expression)_
    - :265 `toEqual` expected `sorted(shared)` _(expression)_
    - :266 `toBe` expected `'✓ YES'` _(literal)_
    - :267 `toHaveText` expected `'✓ YES'` _(literal)_
    - :268 `toEqual` expected `shared` _(expression)_
    - :269 `toBe` expected `bobSet.length` _(expression)_
    - :270 `toBe` expected `aliceSet.length` _(expression)_
    - :273 `toBeDisabled` expected _no expected value_ _(none)_
    - :275 `toBeDisabled` expected _no expected value_ _(none)_
- `the simulator reports the intersection of the sets in its own textareas` — e2e/claims.spec.ts:289
    - :293 `expect` expected _no expected value_ _(none)_
    - :294 `expect` expected _no expected value_ _(none)_
    - :297 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :300 `toBe` expected `alice.length` _(expression)_
    - :301 `toBe` expected `bob.length` _(expression)_
    - :302 `toBe` expected `expected.length` _(expression)_
    - :303 `toBe` expected `'✓'` _(literal)_
    - :304 `toEqual` expected `sorted(expected)` _(expression)_
    - :308 `toEqual` expected `[expected.length, bob.length]` _(expression)_
    - :309 `toEqual` expected `[alice.length]` _(expression)_
    - :310 `toEqual` expected `[` _(expression)_
- `the alignment grid ticks exactly the matching rows and leaks nothing else` — e2e/claims.spec.ts:316
    - :322 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :335 `toHaveLength` expected `2` _(literal)_
    - :339 `toHaveLength` expected `alice.length` _(expression)_
    - :340 `toHaveLength` expected `bob.length` _(expression)_
    - :341 `toHaveLength` expected `expected.length` _(expression)_
    - :342 `toHaveLength` expected `expected.length` _(expression)_
    - :350 `toEqual` expected `tickedB` _(expression)_
    - :352 `toEqual` expected `[]` _(expression)_
    - :354 `toEqual` expected `[]` _(expression)_
    - :355 `toBe` expected _no expected value_ _(none)_
    - :360 `toBe` expected `true` _(expression)_
    - :361 `toHaveAttribute` expected `'aria-pressed', 'false'` _(expression)_
    - :364 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :365 `toHaveText` expected `'Hide plaintext'` _(literal)_
    - :378 `toEqual` expected `sorted(alice)` _(expression)_
    - :379 `toEqual` expected `sorted(bob)` _(expression)_
    - :380 `toEqual` expected `sorted(expected)` _(expression)_
    - :381 `toEqual` expected `sorted(expected)` _(expression)_
    - :382 `toBe` expected `true` _(expression)_
    - :385 `toHaveText` expected `'Reveal plaintext'` _(literal)_
    - :386 `toBeHidden` expected _no expected value_ _(none)_
- `editing a set retracts the verdict instead of leaving it standing` — e2e/claims.spec.ts:389
    - :392 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :398 `toHaveCount` expected `0` _(literal)_
    - :399 `toHaveCount` expected `0` _(literal)_
    - :400 `toBeEnabled` expected _no expected value_ _(none)_
    - :401 `toHaveText` expected `'Run PSI'` _(literal)_
    - :406 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :408 `toBe` expected `1` _(literal)_
    - :409 `toEqual` expected `['y@example.com']` _(expression)_
    - :414 `toHaveCount` expected `0` _(literal)_
    - :416 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :418 `toBe` expected `1` _(literal)_
- `an empty set is refused, and the refusal names the reason` — e2e/claims.spec.ts:421
    - :426 `toHaveText` expected `'Both sets must be non-empty.'` _(literal)_
    - :427 `toHaveCount` expected `0` _(literal)_
    - :428 `toBeEnabled` expected _no expected value_ _(none)_
    - :434 `toHaveText` expected `'Both sets must be non-empty.'` _(literal)_
    - :438 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
- `OPRF-PSI and over-size sets each say why there is no alignment grid` — e2e/claims.spec.ts:441
    - :449 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :450 `toBe` expected `2` _(literal)_
    - :451 `toEqual` expected `['b@x.com', 'c@x.com']` _(expression)_
    - :452 `toHaveCount` expected `0` _(literal)_
    - :453 `toContainText` expected _no expected value_ _(none)_
    - :463 `toBeVisible` expected `{ timeout: 30_000 }` _(expression)_
    - :465 `toBe` expected `5` _(literal)_
    - :466 `toBe` expected `'✓'` _(literal)_
    - :467 `toHaveCount` expected `0` _(literal)_
    - :468 `toContainText` expected _no expected value_ _(none)_
- `attack 1: the inflated size Alice sees is the real size plus the padding` — e2e/claims.spec.ts:475
    - :478 `toBeVisible` expected _no expected value_ _(none)_
    - :484 `toBe` expected `actual + delta` _(expression)_
    - :485 `expect` expected _no expected value_ _(none)_
    - :486 `expect` expected _no expected value_ _(none)_
    - :488 `expect` expected _no expected value_ _(none)_
    - :489 `toContainText` expected _no expected value_ _(none)_
- `attack 2: output-holder Alice learns the covered fraction of Bob\` — e2e/claims.spec.ts:494
    - :497 `toBeVisible` expected _no expected value_ _(none)_
    - :505 `expect` expected _no expected value_ _(none)_
    - :506 `toBe` expected `Math.round((learned.length / bobSize) * 100)` _(expression)_
    - :507 `expect` expected _no expected value_ _(none)_
    - :509 `toHaveLength` expected `bobSize` _(expression)_
    - :510 `toBe` expected `100` _(literal)_
    - :514 `toEqual` expected `[dictSize, learned.length, bobSize, coverage]` _(expression)_
    - :515 `expect` expected _no expected value_ _(none)_
- `attack 3: reused α links exactly the elements that stayed put` — e2e/claims.spec.ts:518
    - :521 `toBeVisible` expected _no expected value_ _(none)_
    - :532 `toBe` expected `trueIntersection(s1, s2).length` _(expression)_
    - :533 `toBe` expected `s2.filter((el) => !s1.includes(el)).length` _(expression)_
    - :534 `toBe` expected `s1.filter((el) => !s2.includes(el)).length` _(expression)_
    - :535 `toBe` expected `s1.length` _(expression)_
    - :536 `toBe` expected `s2.length` _(expression)_
    - :541 `toBe` expected `stable` _(expression)_
    - :542 `toBe` expected `s1.length` _(expression)_
    - :543 `toBe` expected `'✗ YES — privacy violation'` _(literal)_
    - :544 `expect` expected _no expected value_ _(none)_
    - :549 `toBe` expected `linked! > 0` _(expression)_
    - :551 `toHaveLength` expected `Math.min(3, linked!)` _(expression)_
    - :552 `toMatch` expected `/^[0-9a-f]{16}…$/` _(regex)_
    - :557 `toBe` expected `true` _(expression)_
    - :561 `expect` expected _no expected value_ _(none)_
    - :562 `toEqual` expected `[linked!, added, removed]` _(expression)_
    - :563 `expect` expected _no expected value_ _(none)_
- `attack 4: every invalid encoding is rejected on the real receive path` — e2e/claims.spec.ts:566
    - :569 `toBeVisible` expected _no expected value_ _(none)_
    - :575 `expect` expected _no expected value_ _(none)_
    - :576 `toHaveLength` expected `rows.length` _(expression)_
    - :588 `expect` expected _no expected value_ _(none)_
    - :589 `toBe` expected `'✓ rejected'` _(literal)_
    - :590 `toBe` expected `'✓ rejected by validation'` _(literal)_
    - :591 `toMatch` expected `/^[0-9a-f]{16}…[0-9a-f]{4}$/` _(regex)_
    - :598 `expect` expected _no expected value_ _(none)_
    - :600 `toBe` expected `randomAccepted ? '✗ multiplied by β' : '✓ rejected by validation'` _(expression)_
    - :605 `toMatch` expected `/^All 3 invalid-by-construction encodings were rejected by psi\.ts's bobRound2/` _(regex)_
    - :606 `expect` expected _no expected value_ _(none)_
    - :607 `expect` expected _no expected value_ _(none)_
    - :612 `expect` expected _no expected value_ _(none)_
    - :613 `expect` expected _no expected value_ _(none)_
- `attack 5: a lying OPRF Bob produces exactly the phantoms and omissions claimed` — e2e/claims.spec.ts:616
    - :619 `toBeVisible` expected _no expected value_ _(none)_
    - :626 `expect` expected _no expected value_ _(none)_
    - :627 `expect` expected _no expected value_ _(none)_
    - :632 `toHaveLength` expected `3` _(literal)_
    - :646 `toBe` expected `label` _(expression)_
    - :647 `toBe` expected `fSize` _(expression)_
    - :648 `toEqual` expected `sorted(intersection)` _(expression)_
    - :651 `expect` expected _no expected value_ _(none)_
    - :652 `expect` expected _no expected value_ _(none)_
    - :653 `expect` expected _no expected value_ _(none)_
    - :660 `toEqual` expected `[` _(expression)_
    - :668 `expect` expected _no expected value_ _(none)_
    - :669 `expect` expected _no expected value_ _(none)_
    - :670 `expect` expected _no expected value_ _(none)_
- `exhibit 5 gate tests all pass` — e2e/claims.spec.ts:675
    - :677 `toBeVisible` expected `{ timeout: 15_000 }` _(expression)_
    - :682 `expect` expected _no expected value_ _(none)_
    - :684 `expect` expected _no expected value_ _(none)_
    - :685 `toBe` expected `true` _(expression)_
    - :687 `toHaveCount` expected `0` _(literal)_
- `the canonical test vectors are self-consistent and imply the stated intersection` — e2e/claims.spec.ts:703
    - :705 `toBeVisible` expected _no expected value_ _(none)_
    - :710 `toHaveLength` expected `3` _(literal)_
    - :711 `toHaveLength` expected `3` _(literal)_
    - :715 `toBe` expected `rows.get('α seed')` _(expression)_
    - :716 `toBe` expected `rows.get('β seed')` _(expression)_
    - :724 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :726 `toBe` expected `prev` _(expression)_
    - :729 `toBe` expected `new Set([...A, ...B]).size` _(expression)_
    - :730 `toBe` expected `hashOf.size` _(expression)_
    - :741 `toEqual` expected `[A.length, A.length, B.length, B.length]` _(expression)_
    - :742 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :744 `toBe` expected `batch.length` _(expression)_
    - :751 `toEqual` expected `sorted(trueIntersection(A, B))` _(expression)_
    - :752 `expect` expected _no expected value_ _(none)_
    - :754 `expect` expected _no expected value_ _(none)_
    - :756 `expect` expected _no expected value_ _(none)_
    - :760 `toEqual` expected `[...rows.entries()]` _(expression)_
- `the wire transcript is the same trace, and its byte counts add up` — e2e/claims.spec.ts:763
    - :765 `toBeVisible` expected _no expected value_ _(none)_
    - :777 `expect` expected _no expected value_ _(none)_
    - :778 `toBe` expected `match![1]` _(expression)_
    - :781 `toHaveLength` expected `3` _(literal)_
    - :782 `toHaveLength` expected `3` _(literal)_
    - :783 `toHaveLength` expected `3` _(literal)_
    - :785 `toHaveLength` expected `0` _(literal)_
    - :790 `toHaveLength` expected `2` _(literal)_
    - :795 `expect` expected _no expected value_ _(none)_
    - :798 `toBe` expected `count * 32` _(expression)_
    - :802 `toBe` expected `lines.length` _(expression)_
    - :804 `toEqual` expected `[bytes, points]` _(expression)_
    - :805 `expect` expected _no expected value_ _(none)_
- `the copied JSON is the trace the page is showing` — e2e/claims.spec.ts:808
    - :811 `toBeVisible` expected _no expected value_ _(none)_
    - :815 `toHaveText` expected `/^Copied [\d,]+ bytes\.$/` _(regex)_
    - :817 `toBe` expected `copied.length` _(expression)_
    - :820 `toBe` expected `'PSI-GATE-v1'` _(literal)_
    - :821 `toBe` expected `'ristretto255'` _(literal)_
    - :822 `toEqual` expected `splitList(rows.get('A = {a_i}')!)` _(expression)_
    - :823 `toEqual` expected `splitList(rows.get('B = {b_j}')!)` _(expression)_
    - :824 `toBe` expected `rows.get('α (32 bytes, big-endian)')` _(expression)_
    - :825 `toBe` expected `rows.get('β (32 bytes, big-endian)')` _(expression)_
    - :827 `toBe` expected `rows.get('X_${i + 1} = α·H(a${i + 1})')` _(expression)_
    - :828 `toBe` expected `rows.get('Y_${i + 1} = β·X_${i + 1}')` _(expression)_
    - :831 `toBe` expected `rows.get('Z_${j + 1} = β·H(b${j + 1})')` _(expression)_
    - :832 `toBe` expected `rows.get('W_${j + 1} = α·Z_${j + 1}')` _(expression)_
    - :834 `toEqual` expected `sorted(trueIntersection(json.inputs.A, json.inputs.B))` _(expression)_
    - :837 `toHaveText` expected `'', { timeout: 10_000 }` _(expression)_
- `a blocked clipboard falls back and says so` — e2e/claims.spec.ts:840
    - :851 `toBeVisible` expected _no expected value_ _(none)_
    - :854 `toHaveText` expected `'Clipboard blocked — see console for JSON.'` _(literal)_
    - :857 `expect` expected _no expected value_ _(none)_
    - :858 `toBe` expected `'PSI-GATE-v1'` _(literal)_
- `the DDH sampler reaches the verdict its own statistic implies` — e2e/claims.spec.ts:861
    - :864 `toBeVisible` expected `{ timeout: 90_000 }` _(expression)_
    - :865 `toHaveCount` expected `2` _(literal)_
    - :866 `toBeEnabled` expected `{ timeout: 90_000 }` _(expression)_
    - :870 `toBe` expected `observations` _(expression)_
    - :871 `toBe` expected `30` _(literal)_
    - :872 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :880 `expect` expected _no expected value_ _(none)_
    - :881 `expect` expected _no expected value_ _(none)_
    - :885 `toHaveClass` expected `/status ok/` _(regex)_
    - :886 `toContainText` expected `'cannot reject H₀ even at α = 0.05'` _(literal)_
    - :888 `toHaveClass` expected `/status warn/` _(regex)_
    - :889 `toContainText` expected `'Rejected at α = 0.05, not rejected at α = 0.01'` _(literal)_
    - :891 `toHaveClass` expected `/status warn/` _(regex)_
    - :892 `toContainText` expected `'Rejected at α = 0.01'` _(literal)_
    - :900 `toBe` expected `0` _(literal)_
    - :901 `toBe` expected `count` _(expression)_
    - :903 `toHaveCount` expected `0` _(literal)_
- `the benchmark table is arithmetically consistent with its own timings` — e2e/claims.spec.ts:906
    - :910 `toBeVisible` expected `{ timeout: 180_000 }` _(expression)_
    - :911 `toBeEnabled` expected `{ timeout: 180_000 }` _(expression)_
    - :917 `expect` expected _no expected value_ _(none)_
    - :918 `toBe` expected `true` _(expression)_
    - :919 `toEqual` expected `['hashToPoint', 'scalarMul', 'randomScalar']` _(expression)_
    - :926 `expect` expected _no expected value_ _(none)_
    - :927 `expect` expected _no expected value_ _(none)_
    - :933 `expect` expected _no expected value_ _(none)_
    - :937 `expect` expected _no expected value_ _(none)_
    - :945 `expect` expected _no expected value_ _(none)_
    - :947 `expect` expected _no expected value_ _(none)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# crypto-lab-psi-gate

## What It Is

Browser-based Private Set Intersection (PSI) demo implementing the classic
Diffie-Hellman-based PSI protocol (Meadows 1986, Huberman-Franklin-Hogg 1999).
Two parties compute `A ∩ B` without revealing non-matching elements to each other.

Uses **ristretto255** via `@noble/curves` for DDH-hard group operations and
RFC 9380-compliant hash-to-curve. Demonstrates the three-round interactive protocol,
side-by-side comparison of what each party learns, and five executable attack scenarios
(set size inflation, dictionary enumeration, scalar reuse, malformed points, and a lying
OPRF publisher) with honest discussion of PSI's limitations. All cryptography runs
in-browser — no backends, no servers.

## When to Use It

- Understanding the cryptographic primitive behind Apple password monitoring and
  Google's Private Join and Compute — and the pure-cryptography alternative to how
  Signal solves contact discovery (Signal uses SGX enclaves plus ORAM, not PSI)
- Teaching how two parties can compute a joint function without revealing inputs
  (the essence of secure two-party computation)
- Learning why the Decisional Diffie-Hellman (DDH) assumption matters for PSI
  correctness and privacy
- Evaluating PSI for contact discovery, password breach checking, ad attribution,
  or healthcare data sharing applications
- Do NOT use this for production PSI — this demo is semi-honest secure only and
  doesn't include authenticated inputs, query/batch limits, abuse controls, or set-size
  hiding. Select a reviewed protocol and maintained implementation for the required
  threat model; the open-source Private Join and Compute code also explicitly documents
  an honest-but-curious model and is not an officially supported Google product.

## Live Demo

**[systemslibrarian.github.io/crypto-lab-psi-gate](https://systemslibrarian.github.io/crypto-lab-psi-gate/)**

The page runs the full three-round DH-PSI protocol in the browser across six exhibits: a contact-discovery scenario contrasting naive hashing with PSI, a step-by-step protocol walkthrough (opening with a plain-language "blinding as a padlock" primer, then following each email as a stable colour-and-icon chip through H(x) → single-blind → double-blind until the two independently-blinded paths of a shared element visibly snap onto the same byte-identical point), a live simulator where you paste your own sets and see a side-by-side alignment grid of the double-blinded values matching row by row, five attack demos, a sourced deployments-and-applications tour, and a Cryptographer's Lab with profile-specific test vectors, a byte-level wire transcript, live benchmarks, and a simulator-based security argument. All cryptography runs client-side with no servers.

## What Can Go Wrong

- **Set sizes are revealed.** Both parties learn how many elements the other has.
  Hiding set sizes requires more sophisticated protocols (PaXoS, CM20).

- **Dictionary attacks work against small domains.** Alice receives the intersection
  in this construction, so malicious Alice can place an enumerable domain (phone
  numbers, PINs, short codes) in A and recover Bob's matching elements. An online
  service needs authenticated queries, strict batch and rate limits, and abuse
  monitoring. A bare OPRF-PSI protocol does not prevent the receiver from submitting
  the same dictionary.

- **Scalar reuse is catastrophic.** If Alice reuses α across sessions with Bob, Bob
  can link sessions and detect which elements changed. Fresh α per session is mandatory.

- **Semi-honest security only.** The protocol assumes both parties follow it honestly.
  An actively malicious party can deviate — reuse scalars intentionally, inflate or
  deflate its set, or lie about results. Malicious-security PSI requires additional
  ZK proofs. Received-point validation *is* implemented on every receive path, so a
  malformed or identity encoding aborts rather than corrupting the run; that closes
  one specific active attack, not the model.

- **Inherent information leakage.** Even a perfect PSI tells Alice which of her elements
  are in Bob's set. That fact alone may be sensitive depending on context.

## Real-World Evidence and Application Patterns

The DH-PSI protocol dates to Meadows 1986 and was analyzed by Huberman, Franklin, and
Hogg (1999). The following primary sources document deployed PSI systems or published
neighboring private-matching systems; they do not all implement this demo's protocol:

- **Apple Password Monitoring** — Apple documents a form of cryptographic PSI for
  comparing saved credentials with breached-password data
  ([Apple Platform Security](https://support.apple.com/guide/security/password-monitoring-sec78e79fc3b/web)).
- **Google Password Checkup** — Google documented PSI with blinding against an encrypted
  database of more than four billion unsafe credentials at launch
  ([Google Security Blog](https://security.googleblog.com/2019/06/helping-organizations-do-more-without-collecting-more-data.html)).
- **Google Private Join and Compute** — an open-source, honest-but-curious PSI variant
  that reveals intersection cardinality and a sum over matching records, not the
  matching identifiers
  ([project documentation](https://github.com/google/private-join-and-compute)).
- **Meta Private Lift** — a published neighboring MPC design using private matching,
  secure two-party aggregation, and distributed differential privacy. Its public FBPCS
  repository is archived, so it is historical evidence rather than a current library
  recommendation
  ([design](https://github.com/facebookresearch/fbpcs/blob/main/docs/PrivateRCT.md)).
- **Healthcare record matching** — a legitimate PSI application pattern, but this demo
  does not claim a specific hospital or billing deployment.

Two systems commonly filed under PSI that do not actually use it, and are worth
knowing as contrasts:

- **Signal contact discovery** — Signal documented an Intel SGX enclave and ORAM
  design, not a PSI protocol. Signal's own writeup names private set
  intersection among the options that "don't work" for them, alongside bloom filters
  and PIR. This describes that published design, not necessarily Signal's current
  implementation ([Private Contact Discovery](https://signal.org/blog/private-contact-discovery/),
  [ORAM update](https://signal.org/blog/building-faster-oram/)).
- **DP3T / Google-Apple Exposure Notification** — a historical decentralized design
  in which clients matched downloaded diagnosis keys on-device rather than running
  two-party PSI. Apple says Exposure Notification has been unavailable since
  September 18, 2023
  ([Apple Developer](https://developer.apple.com/exposure-notification/),
  [DP3T documents](https://github.com/DP-3T/documents)).

Modern high-performance PSI (KKRT16, PaXoS, VOLE-PSI) builds on oblivious PRFs
and related oblivious-transfer/VOLE techniques. Ristretto255 is a distinct
prime-order group abstraction that can be implemented using Curve25519; it is not
the X25519 key-agreement function or the Signal Double Ratchet
([RFC 9496](https://www.rfc-editor.org/rfc/rfc9496.html)).

## How to Run Locally

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-psi-gate
cd crypto-lab-psi-gate
npm install
npm run dev
`​``

## Related Demos
- [crypto-lab-opaque-gate](https://systemslibrarian.github.io/crypto-lab-opaque-gate/) — OPAQUE aPAKE built on an OPRF, the same primitive that hardens production PSI.
- [crypto-lab-ot-gate](https://systemslibrarian.github.io/crypto-lab-ot-gate/) — oblivious transfer, the foundation of modern high-performance OPRF-based PSI.
- [crypto-lab-oblivious-shelf](https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/) — private information retrieval, a neighboring "query without revealing" primitive.
- [crypto-lab-paillier-gate](https://systemslibrarian.github.io/crypto-lab-paillier-gate/) — Paillier additive homomorphic encryption, used in some PSI and private-aggregation variants.
- [crypto-lab-silent-tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) — private aggregation over secret-shared inputs, another two-party privacy computation.

## The DH-PSI Protocol

`​``
Group G with generator g, prime order q (ristretto255).
Hash function H: {0,1}* → G  (hash-to-curve, RFC 9380)

Alice has A = {a_1, ..., a_n}
Bob   has B = {b_1, ..., b_m}

Round 1 (Alice):  Pick random α.  Send X_i = α·H(a_i) shuffled.
Round 2 (Bob):    Validate every X_i.  Pick random β.
                  Send Y_i = β·X_i and Z_j = β·H(b_j) shuffled.
Round 3 (Alice):  Validate every Y_i and Z_j.  Compute W_j = α·Z_j.
                  Intersection = {a_i : Y_i ∈ {W_j}}.
`​``

Validation is `isValidPoint` and it runs on every point that arrives from the
counterparty, in both DH-PSI (`psi.ts`) and OPRF-PSI (`oprf-psi.ts`), before any
scalar touches it. Ristretto255 makes non-canonical encodings and torsion points
undecodable, but the identity O is a perfectly valid encoding, and β·O = O would
collapse every Y_i to a single point. That one is caught only by the check.
Exhibit 4's injection probe feeds each malicious encoding through `bobRound2`
itself and reports what the protocol did with it.

**Why it works:** A shared element gets both α and β applied to it, and scalar
multiplication is commutative — `β·(α·H(x)) = α·(β·H(x)) = αβ·H(x)` — so Alice's
`Y_i` and Bob's `W_j` for that element are the *same curve point, byte-for-byte*.
That collision is the intersection. Non-matched elements never receive both
scalars, so they stay random and never collide. Exhibit 2 lets you watch the two
blinding orders converge onto that identical point; the DDH assumption is what
makes every non-colliding point unlinkable to its plaintext.

## Six Exhibits

| # | Exhibit | What you see |
|---|---------|--------------|
| 1 | Contact Discovery Problem | PrayerWarriors.Mobi scenario; naive vs PSI approach |
| 2 | Protocol Walkthrough | Plain-language padlock primer, then each email tracked as a stable colour/icon chip through H(x) → single- → double-blind, until the two blinding orders of a shared element snap onto the same byte-identical point |
| 3 | Live Simulator | Paste your own sets; run PSI instantly, with a side-by-side alignment grid of double-blinded values (from the same execution as the result above it) and a reveal-plaintext toggle |
| 4 | Attack Demos | Set size inflation, dictionary attack, scalar reuse, malformed-point injection (each candidate encoding fed through `psi.ts`'s real receive path, not just through `isValidPoint`), malicious OPRF publication |
| 5 | Deployments and Application Patterns | Sourced Apple and Google PSI examples, neighboring Meta MPC, a clearly labeled healthcare use case, plus Signal and DP3T as non-PSI contrasts |
| 6 | Cryptographer's Lab | Test vectors, wire transcript, benchmarks, security argument, PSI protocol comparison |

### Cryptographer's Lab (Exhibit 6)

For reviewers and implementers who need byte-level rigor:

- **Canonical test vectors** — fixed inputs (α seed = `…0007`, β seed = `…000b`,
  A = `{alice,bob,mom}@example.com`, B = `{bob,mom,eve}@example.com`) produce a
  deterministic trace. Any implementation of this exact `PSI-GATE-v1` profile —
  including its custom domain-separation tag and scalar encoding — must reproduce
  every H(x), X_i, Y_i, Z_j, and W_j byte-for-byte. Generic DH-PSI or ristretto255
  implementations need not do so.
- **Wire-format transcript** — every ristretto point on the wire as a 32-byte
  hex dump, color-coded by sender. Verifies linear O(n+m) communication.
- **Benchmarks** — live measurement of `hashToPoint`, `scalarMul`,
  `randomScalar`, and end-to-end PSI at multiple set sizes in your browser.
- **DDH pseudorandomness sampler** — bins the output bytes of α·H(x) over 5,000
  fresh inputs and runs a two-sided χ² test against uniform (df = 255, exact
  quantiles for α = 0.05 and α = 0.01). Byte positions 1–30 carry the test; byte
  0 and byte 31 are charted *separately* because RFC 9496 pins them — a ristretto
  encoding is the canonical encoding of an even field element below 2²⁵⁵ − 19, so
  byte 0 is always even and byte 31 never reaches `0x80`. Both constraints are
  measured on each run rather than asserted. Pooling all 32 positions is what
  makes a "flatness" test fail on correct data, and the sharper lesson is the
  one the panel states: pseudorandomness of the group element is not uniformity
  of its encoding.
- **Simulator-based security argument** — sketches of the simulators for
  corrupt Alice and corrupt Bob under DDH; honest list of what this
  implementation is NOT (constant-time, malicious-secure, side-channel hardened,
  formally verified).
- **Protocol comparison** — DH-PSI vs OPRF-PSI vs KKRT16 vs CM20 vs PaXoS/VOLE-PSI
  vs FHE-PSI, with communication, computation, security model, and year.

## Stack

- **Vite + TypeScript strict** — `noUnusedLocals`, `noUnusedParameters`, full strict mode
- **`@noble/curves`** — ristretto255 via `ristretto255_hasher` (RFC 9380 hash-to-curve, RFC 9496 ristretto encoding)
- **Vitest + GitHub Actions** — golden test vectors, randomized property tests, CI on supported Node 22 and 24 releases
- **Web Worker offload** — `src/psi-worker.ts` keeps the UI responsive during 1k+ PSI runs and DDH sampling
- **CSP-hardened** — hash-pinned inline script, no remote sources, `worker-src 'self' blob:`
- **No backends, no server** — GitHub Pages static deployment
- **No `Math.random()`** — all randomness via `crypto.getRandomValues`

## Protocols

Two alternative protocols are implemented and can be toggled in Exhibit 3:

- **DH-PSI** (`src/psi.ts`) — the three-round Meadows/HFH protocol; pedagogical baseline.
- **Basic OPRF-PSI** (`src/oprf-psi.ts`) — a simplified exponentiation construction
  inspired by the adaptive-PSI line of work including Jarecki-Liu 2010. Bob publishes
  PRF tags once; Alice queries with a per-query α and unblinds with α⁻¹. This demo omits
  JL10's malicious-security machinery and must not be described as the full JL10 protocol
  ([publication](https://doi.org/10.1007/978-3-642-15317-4_26)).

## Testing

`​``
npm test          # Vitest run (44 tests: group ops, DH-PSI, OPRF-PSI, attacks, test vectors)
npm run test:watch
`​``

CI runs on every push/PR via `.github/workflows/deploy.yml`: typecheck, Vitest,
production build, dependency audit, and the Playwright claims/accessibility gate.
Only a successful non-PR run can configure and deploy GitHub Pages.

## GitHub Topics

`cryptography` `private-set-intersection` `psi` `secure-computation`
`contact-discovery` `ristretto255` `diffie-hellman` `ddh` `signal-protocol`
`privacy-preserving` `browser-demo` `educational` `typescript` `vite`

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Blind Relay

- **slug**: `crypto-lab-blind-relay`
- **repo**: https://github.com/systemslibrarian/crypto-lab-blind-relay
- **live**: https://systemslibrarian.github.io/crypto-lab-blind-relay/
- **commit_sha**: `fcf1b428dfadb33930c3e59d5c60a5d97152b909` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `073155f236b346d3af57b876538b2e533a29d4b1`
- **read_from**: working tree (clean)
- **category**: PRIVACY | PROTOCOLS  ·  **level**: advanced  ·  **--accent**: #7e22ce
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Blind Relay  — _read from index.html_

**Subtitle**: Oblivious HTTP · RFC 9458 · HPKE  — _read from index.html_

**Description**: Runs a real HPKE-sealed, BHTTP-encoded request through a simulated relay and gateway so you can watch exactly what each party knows — then flip the switch that lets them compare notes.  — _read from index.html_

**Why it matters**: Every request tells someone both who you are and what you asked. TLS hides content from the network, but the server that answers you still sees both facts at once. OHTTP splits them across two organizations — a guarantee exactly as strong as those two refusing to collude.  — _read from index.html_

**Card copy**: Oblivious HTTP splits knowledge between a relay that sees your address and a gateway that sees your request — flip the collusion toggle and watch the guarantee evaporate.

**Chips**: OHTTP · HPKE · Binary HTTP · RFC 9458

**Implements**: ChaCha20 `src/main.ts:3`, ChaCha20-Poly1305 `src/main.ts:3`, DHKEM `src/main.ts:2`, HKDF `src/ohttp/response.ts:22`, HPKE `vite.config.ts:15`, Poly1305 `src/main.ts:3`, SHA-256 `src/ohttp/response.ts:23`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: AES `src/relay/exchange.ts:103`, X25519 `src/ohttp/keyconfig.ts:32`

**References**: AES, Diffie-Hellman, Encrypted Client Hello, Privacy Pass, Private information retrieval, X25519

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `RFC 2606` — first seen src/relay/exchange.ts:38 (1×)
- `RFC 5737` — first seen README.md:25 (4×)
- `RFC 9000` — first seen src/ohttp/bhttp.ts:37 (1×)
- `RFC 9180` — first seen README.md:15 (4×)
- `RFC 9292` — first seen README.md:21 (14×)
- `RFC 9458` — first seen README.md:1 (20×)

**Stated limitations (page)**:

- _(honesty, src/ui/statics.ts)_ Real: every cryptographic byte. HPKE (RFC 9180) runs the hub lab's implementation — DHKEM(X25519, HKDF-SHA256), HKDF-SHA256, AES-128-GCM / ChaCha20-Poly1305 — and this lab adds the genuine RFC 9458 encapsulation around it: key config, 7-byte header, info binding, and the exported-secret response schedule, all verified against the RFC 9458 Appendix A test vector. Requests are genuinely BHTTP-encoded (RFC 9292). The relay panel shows the actual ciphertext; the gateway panel shows the actual decryption.

**README — What Can Go Wrong**:

```text
- **Collusion** — the guarantee is a promise between two organizations; the demo's switch shows
  the failure is total and requires no cryptanalysis.
- **Per-user key configs** — a gateway handing each client a distinct key config turns the key
  itself into a tracking cookie (RFC 9458 §7 requires key consistency).
- **Identifying request content** — OHTTP anonymizes the envelope, not the letter; cookies or
  account tokens inside the request re-link everything.
- **Traffic analysis** — one request in, one request out: anyone reading both logs can correlate
  by size and timing without the parties "colluding" formally — exhibit 3 performs the size join
  live and shows BHTTP padding as the (partial) countermeasure.
- **Malleability is not the risk** — flipping any byte fails closed (AEAD); a hostile relay can
  deny service but cannot read or undetectably alter.
```

**Claims tested** (e2e/claims.spec.ts, 18 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:44
    - :44 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:61
    - :61 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:82
    - :82 `toBeEnabled` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:84
    - :84 `toContainText` expected `'Step 9 of 9'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:89
    - :89 `toBeEnabled` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:90
    - :90 `toBeEnabled` expected _no expected value_ _(none)_
- `pipeline: the wire bytes the relay carries ARE the client\` — e2e/claims.spec.ts:97
    - :104 `toEqual` expected `[` _(expression)_
    - :116 `toBe` expected `sealed` _(expression)_
    - :121 `toHaveLength` expected `64` _(literal)_
    - :122 `toBe` expected `enc` _(expression)_
    - :123 `expect` expected _no expected value_ _(none)_
    - :129 `toBe` expected `'${label}00${sealed.slice(0, 14)}'` _(expression)_
    - :134 `expect` expected _no expected value_ _(none)_
    - :135 `toBe` expected `sealed.length / 2` _(expression)_
    - :137 `toBe` expected `carriedResponse.length / 2` _(expression)_
    - :140 `toBe` expected `knows(client, 'request (plaintext)')` _(expression)_
    - :141 `toBe` expected `knows(client, 'request (plaintext)')` _(expression)_
    - :145 `expect` expected _no expected value_ _(none)_
    - :146 `expect` expected _no expected value_ _(none)_
- `pipeline: the sealed request really is sealed — the query is visible to the client and gateway, absent from the relay` — e2e/claims.spec.ts:150
    - :163 `expect` expected _no expected value_ _(none)_
    - :164 `expect` expected _no expected value_ _(none)_
    - :165 `expect` expected _no expected value_ _(none)_
    - :170 `expect` expected _no expected value_ _(none)_
    - :171 `expect` expected _no expected value_ _(none)_
    - :172 `expect` expected _no expected value_ _(none)_
- `pipeline: facts appear only at the step where the party acquires them` — e2e/claims.spec.ts:175
    - :179 `toContainText` expected `'Step 1 of 9'` _(literal)_
    - :183 `toEqual` expected `[]` _(expression)_
    - :184 `toEqual` expected `[]` _(expression)_
    - :185 `expect` expected _no expected value_ _(none)_
    - :187 `toBeDisabled` expected _no expected value_ _(none)_
    - :188 `toBeEnabled` expected _no expected value_ _(none)_
    - :192 `toContainText` expected `'Step 4 of 9'` _(literal)_
    - :194 `expect` expected _no expected value_ _(none)_
    - :195 `toBe` expected `raw(knows(parties[0], 'sealed request'))` _(expression)_
    - :197 `toEqual` expected `[]` _(expression)_
    - :201 `toContainText` expected `'Step 5 of 9'` _(literal)_
    - :203 `toBe` expected `knows(parties[0], 'request (plaintext)')` _(expression)_
    - :207 `toContainText` expected `'Step 9 of 9'` _(literal)_
    - :208 `toBeDisabled` expected _no expected value_ _(none)_
    - :209 `toBeDisabled` expected _no expected value_ _(none)_
    - :210 `toBeEnabled` expected _no expected value_ _(none)_
- `key schedules: salt is literally enc ‖ response_nonce, the response nonce rides the wire, and both sides derive the same key` — e2e/claims.spec.ts:217
    - :229 `toBe` expected `enc + nonce` _(expression)_
    - :232 `toHaveLength` expected `64` _(literal)_
    - :235 `toHaveLength` expected `32` _(literal)_
    - :236 `toHaveLength` expected `24` _(literal)_
    - :237 `toBe` expected `sched(rows, 'labeled key schedule')` _(expression)_
    - :243 `toBe` expected `true` _(expression)_
    - :247 `expect` expected _no expected value_ _(none)_
    - :248 `expect` expected _no expected value_ _(none)_
    - :249 `expect` expected _no expected value_ _(none)_
    - :253 `expect` expected _no expected value_ _(none)_
    - :254 `toBe` expected `'200'` _(literal)_
    - :256 `toBe` expected `'chest pain symptoms'` _(literal)_
    - :257 `toBe` expected `true` _(expression)_
- `the AEAD you pick is bound into the header on the wire and changes the derived key length` — e2e/claims.spec.ts:260
    - :270 `toBe` expected `'01' + '0020' + '0001' + '0001'` _(expression)_
    - :271 `toBe` expected `true` _(expression)_
    - :272 `toHaveLength` expected `32` _(literal)_
    - :278 `toBe` expected `'01' + '0020' + '0001' + '0003'` _(expression)_
    - :279 `toBe` expected `true` _(expression)_
    - :281 `toHaveLength` expected `64` _(literal)_
- `POST shape: the gateway reads the body it was sent and the target echoes its exact byte length` — e2e/claims.spec.ts:284
    - :292 `toBe` expected `'POST https://api.example.com/v1/submit'` _(literal)_
    - :293 `toBe` expected `'POST https://api.example.com/v1/submit'` _(literal)_
    - :297 `toBe` expected `'POST'` _(literal)_
    - :298 `toBe` expected `'/v1/submit'` _(literal)_
    - :302 `toBe` expected `expected` _(expression)_
- `collusion: the joined row is exactly the relay\` — e2e/claims.spec.ts:309
    - :317 `toBe` expected `knows(client, 'own identity')` _(expression)_
    - :320 `toHaveAttribute` expected `'aria-checked', 'false'` _(expression)_
    - :321 `toContainText` expected `'HOLDS'` _(literal)_
    - :322 `toHaveCount` expected `0` _(literal)_
    - :325 `toHaveAttribute` expected `'aria-checked', 'true'` _(expression)_
    - :329 `expect` expected _no expected value_ _(none)_
    - :330 `expect` expected _no expected value_ _(none)_
    - :334 `expect` expected _no expected value_ _(none)_
    - :335 `expect` expected _no expected value_ _(none)_
    - :336 `expect` expected _no expected value_ _(none)_
    - :339 `toContainText` expected `'Every HPKE seal/open verified'` _(literal)_
    - :340 `toHaveCount` expected `0` _(literal)_
    - :344 `toHaveAttribute` expected `'aria-checked', 'false'` _(expression)_
    - :345 `toContainText` expected `'HOLDS'` _(literal)_
    - :346 `toHaveCount` expected `0` _(literal)_
- `attacks: a wrong key and a flipped byte both fail closed; the leaked key recovers the exact plaintext` — e2e/claims.spec.ts:353
    - :364 `toBeVisible` expected _no expected value_ _(none)_
    - :367 `expect` expected _no expected value_ _(none)_
    - :369 `toBe` expected `raw(knows(gateway, 'HPKE private key'))` _(expression)_
    - :370 `expect` expected _no expected value_ _(none)_
    - :371 `expect` expected _no expected value_ _(none)_
    - :372 `toContainText` expected `'HOLDS'` _(literal)_
    - :373 `toHaveCount` expected `0` _(literal)_
    - :374 `toContainText` expected `'decryption failed'` _(literal)_
    - :380 `expect` expected _no expected value_ _(none)_
    - :382 `expect` expected _no expected value_ _(none)_
    - :383 `expect` expected _no expected value_ _(none)_
    - :384 `expect` expected _no expected value_ _(none)_
    - :385 `expect` expected _no expected value_ _(none)_
    - :386 `toContainText` expected `'fails closed'` _(literal)_
    - :387 `toHaveCount` expected `0` _(literal)_
    - :391 `toBeVisible` expected _no expected value_ _(none)_
    - :394 `expect` expected _no expected value_ _(none)_
    - :397 `toBe` expected `raw(knows(client, 'request as BHTTP bytes'))` _(expression)_
    - :399 `expect` expected _no expected value_ _(none)_
    - :400 `toBe` expected `knows(gateway, 'request (decrypted)')` _(expression)_
    - :401 `toContainText` expected `'BROKEN'` _(literal)_
    - :402 `toHaveCount` expected `0` _(literal)_
    - :403 `toContainText` expected `'Decryption succeeded'` _(literal)_
- `correlation, unpadded: the size join identifies every client, and every row it claims is backed by the logs` — e2e/claims.spec.ts:410
    - :418 `toHaveLength` expected `4` _(literal)_
    - :419 `toHaveLength` expected `4` _(literal)_
    - :425 `toBe` expected `4` _(literal)_
    - :426 `toEqual` expected `gatewaySizes` _(expression)_
    - :427 `toEqual` expected `[...gatewaySizes].sort((a, b) => a - b)` _(expression)_
    - :428 `toBe` expected `4` _(literal)_
    - :432 `toHaveLength` expected `4` _(literal)_
    - :437 `expect` expected _no expected value_ _(none)_
    - :438 `expect` expected _no expected value_ _(none)_
    - :440 `toHaveCount` expected `0` _(literal)_
    - :445 `expect` expected _no expected value_ _(none)_
    - :446 `expect` expected _no expected value_ _(none)_
    - :447 `toContainText` expected `'nothing was decrypted'` _(literal)_
    - :448 `toHaveCount` expected `0` _(literal)_
    - :453 `toHaveLength` expected `4` _(literal)_
    - :456 `expect` expected _no expected value_ _(none)_
    - :457 `expect` expected _no expected value_ _(none)_
    - :459 `toContainText` expected _no expected value_ _(none)_
- `correlation, padded: sizes collapse to one anonymity set, timing still names everyone` — e2e/claims.spec.ts:464
    - :473 `expect` expected _no expected value_ _(none)_
    - :480 `toBeDisabled` expected _no expected value_ _(none)_
    - :481 `toBeDisabled` expected _no expected value_ _(none)_
    - :482 `toContainText` expected `'Padding ON'` _(literal)_
    - :489 `toBe` expected `1` _(literal)_
    - :492 `toBe` expected `padTo + overhead` _(expression)_
    - :493 `toEqual` expected `relaySizes` _(expression)_
    - :495 `toBe` expected `4` _(literal)_
    - :498 `toHaveCount` expected `0` _(literal)_
    - :500 `toHaveLength` expected `1` _(literal)_
    - :501 `expect` expected _no expected value_ _(none)_
    - :502 `expect` expected _no expected value_ _(none)_
    - :503 `expect` expected _no expected value_ _(none)_
    - :506 `expect` expected _no expected value_ _(none)_
    - :507 `toHaveCount` expected `0` _(literal)_
    - :512 `toHaveLength` expected `4` _(literal)_
    - :514 `expect` expected _no expected value_ _(none)_
    - :515 `expect` expected _no expected value_ _(none)_
    - :516 `expect` expected _no expected value_ _(none)_
    - :517 `toHaveCount` expected `0` _(literal)_
- `play advances the pipeline and pause stops it` — e2e/claims.spec.ts:524
    - :528 `toContainText` expected `'Step 1 of 9'` _(literal)_
    - :531 `toContainText` expected `'Pause'` _(literal)_
    - :532 `toContainText` expected `'Step 3 of 9', { timeout: 10000 }` _(expression)_
    - :535 `toContainText` expected `'Play all steps'` _(literal)_
    - :538 `toBe` expected `frozen` _(expression)_
- `the comparison table states an assumption for each of the four architectures` — e2e/claims.spec.ts:541
    - :544 `toHaveCount` expected `5` _(literal)_
    - :546 `toHaveCount` expected `4` _(literal)_
    - :547 `toContainText` expected `'2 specific parties do not collude'` _(literal)_
    - :548 `toContainText` expected `'information-theoretic'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Blind Relay — Oblivious HTTP (RFC 9458)

## What It Is

An interactive browser demo of **Oblivious HTTP (RFC 9458)**: a three-party HTTP request where the
**relay** knows your address but not your request, the **gateway** knows your request but not your
address, and neither can be trusted alone.

The point it teaches: encryption stops a party from *reading* data — it does nothing about a party
*knowing that you asked*. OHTTP gets privacy from a different move entirely: splitting knowledge
between two parties who must not collude. **Privacy as an architecture, not an algorithm.**

The cryptography is real and runs in your tab:

- **HPKE (RFC 9180)** — consumed from the hub lab
  [crypto-lab-hpke-envelope](https://github.com/systemslibrarian/crypto-lab-hpke-envelope)
  (DHKEM(X25519, HKDF-SHA256) · HKDF-SHA256 · AES-128-GCM / ChaCha20-Poly1305), not reimplemented here.
- **RFC 9458 encapsulation** — hand-rolled in this repo: key configuration, the 7-byte header,
  the `info` binding, and the exported-secret response key schedule, all verified against the
  RFC 9458 Appendix A test vector.
- **Binary HTTP (RFC 9292)** — a hand-rolled known-length codec covering exactly the messages the
  demo sends (not a conformance suite).

The **network is simulated**: all four parties live in one page, and the IP addresses are
RFC 5737 documentation placeholders. Security model: OHTTP's guarantee is *organizational*
(two named parties must not collude), and the demo's centerpiece is the switch that revokes it.
**Not production crypto — a teaching demo.**

## Exhibits

1. **The knowledge split, live** — type a query (or a POST body), run a real exchange, and play or
   step it through client → relay → gateway → target. Each party's card is populated from the
   actual bytes the crypto yields that party: the relay's card shows genuine HPKE ciphertext, the
   gateway's shows the genuine decryption, complete with what each party *cannot* know and why.
2. **The collusion toggle** — the honest centerpiece. Relay and gateway compare notes: a plain
   JOIN over data each already holds recovers *who asked what*, instantly and completely. The
   cryptographic-result indicator and the privacy verdict are rendered separately — every AEAD
   verified, and privacy is BROKEN anyway.
3. **Correlation without collusion** — the quieter failure: four clients send four queries, and
   you join the relay's log to the gateway's log two ways. On ciphertext *size* (the real
   encapsulation lengths — no key material touched), RFC 9292 zero padding collapses the join into
   one anonymity set. On *timing*, padding changes nothing and everyone is identified again — the
   honest demonstration that the remaining fix (batching/mixing) is a cost OHTTP declines to pay.
4. **Break it yourself** — take the relay's seat against the real verifier: decrypt with a key you
   generate (real `OpenError`), flip one ciphertext byte and watch the gateway fail closed, then
   borrow the gateway's leaked key and watch decryption *succeed* — rendered as the alarm it is.
5. **Two directions, two key schedules** — the request rides full HPKE; the response derives from
   `context.Export("message/bhttp response")` + a fresh public nonce through plain HKDF, with the
   client's and gateway's independent derivations compared byte-for-byte.
6. **OHTTP vs VPN vs Tor vs IT-PIR** — what each hides, from whom, under what assumption, at what
   cost — honest that OHTTP has the *weakest* collusion story of the four.
7. **Where you already use this** — Apple iCloud Private Relay (same split, MASQUE-based),
   Firefox telemetry (OHTTP itself), Privacy Pass rate limiting. Named, not implemented.

## When to Use It

- Use OHTTP-style splits when the *metadata* (who asked) is the sensitive part and the two
  operators are genuinely independent — telemetry, safe-browsing lookups, token issuance.
- Use it when the target must remain an ordinary HTTP service and Tor's latency is unacceptable.
- Do **NOT** use it when your threat model includes the relay and gateway cooperating (legal
  compulsion reaches both), when request *content* identifies you (a session cookie defeats the
  entire scheme), or when timing/size correlation is in scope — OHTTP hides none of that.

## Live Demo

**<https://systemslibrarian.github.io/crypto-lab-blind-relay/>** — run an exchange, step the
request through the split, flip the collusion switch, and mount the three relay-seat attacks.

## What Can Go Wrong

- **Collusion** — the guarantee is a promise between two organizations; the demo's switch shows
  the failure is total and requires no cryptanalysis.
- **Per-user key configs** — a gateway handing each client a distinct key config turns the key
  itself into a tracking cookie (RFC 9458 §7 requires key consistency).
- **Identifying request content** — OHTTP anonymizes the envelope, not the letter; cookies or
  account tokens inside the request re-link everything.
- **Traffic analysis** — one request in, one request out: anyone reading both logs can correlate
  by size and timing without the parties "colluding" formally — exhibit 3 performs the size join
  live and shows BHTTP padding as the (partial) countermeasure.
- **Malleability is not the risk** — flipping any byte fails closed (AEAD); a hostile relay can
  deny service but cannot read or undetectably alter.

## Real-World Usage

Apple iCloud Private Relay (two-hop split via MASQUE), Firefox telemetry & search suggestions
(OHTTP proper, relay run by a separate operator), Privacy Pass rate-limited token issuance
(issuer/mediator split). See the in-page panel for the precise claims.

## How to Run Locally

This lab **consumes the hub's HPKE module** from a sibling checkout:

`​``bash
git clone https://github.com/systemslibrarian/crypto-lab-hpke-envelope
git -C crypto-lab-hpke-envelope checkout 7d7992ba5160f5d6c9f46186b8480dd09a9e6ffa
git clone https://github.com/systemslibrarian/crypto-lab-blind-relay
cd crypto-lab-blind-relay
npm install
npm run dev        # Vite dev server
npm test           # crypto vectors and module-resolution controls (Vitest)
npm run build      # typecheck + production build
npm run test:a11y  # WCAG 2.1 A/AA gate, 2 themes x 2 viewports (Playwright)
`​``

CI checks the same inspected HPKE commit out into `./hub/` instead;
`vite.config.ts` looks in both places. Imported HPKE source uses this lab's
locked Noble packages in either layout. Vite deduplicates those packages so
installing dependencies in the sibling checkout does not change the build graph.
An HPKE source update requires reviewing the new commit and rerunning the
crypto, build and browser gates before changing the workflow pin.

## Related Demos

- [crypto-lab-hpke-envelope](https://systemslibrarian.github.io/crypto-lab-hpke-envelope/) — the
  HPKE internals this lab deliberately does not rebuild.
- [crypto-lab-patron-shield](https://systemslibrarian.github.io/crypto-lab-patron-shield/) and
  [crypto-lab-oblivious-shelf](https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/) —
  information-theoretic PIR: the strong end of the assumption spectrum this lab compares against.
- [crypto-lab-blind-hello](https://systemslibrarian.github.io/crypto-lab-blind-hello/) — TLS
  Encrypted Client Hello, HPKE's other headline deployment.

## Build & Verify

- **62 Vitest unit tests**, all passing: **17 known-answer tests against the RFC 9458 Appendix A
  vector** (`src/ohttp/kat.test.ts` — key config bytes, BHTTP encodings, `info` construction,
  request decapsulation + ciphertext reproduction, response secret/salt/prk/key/nonce, and the
  full encapsulated response), plus BHTTP round-trips, varint and padding checks, fail-closed
  suites for request/response/key-config parsing and tampering, knowledge-split/collusion model
  tests, and the passive correlation models — size join (correct unpadded, ambiguous padded) and
  timing join (defeats padding; reports ambiguity instead of guessing when arrivals overlap),
  and two module-resolution controls proving the consumed source shares the consumer's
  locked package, with a negative control that resolves a second instance without deduplication.
- **16 Playwright e2e tests**: a WCAG 2.1 A/AA gate that drives the lab the way a visitor drives it
  — an exchange sealed and walked through all nine pipeline steps, auto-play started and paused,
  collusion flipped on and off, four clients simulated and joined on size and on timing with padding
  off and then on, all three attacks fired, the request re-run as a POST under ChaCha20-Poly1305,
  and every disclosure opened by its own summary — and **scans after every single step**, in both
  themes at 1280px and 380px. Nothing is injected into the page: reduced motion is asked for and
  asserted, so the lab's own `prefers-reduced-motion` handling is exercised rather than bypassed.
  `violations` is not the whole oracle — the gate also fails on axe's `incomplete` bucket, on an
  arithmetic composite-aware contrast measurement (opacity and `color-mix()` included), on
  text-control border contrast (WCAG 1.4.11), on any scrolling region with no keyboard route, on any
  horizontal document overflow, and on any visible text left at `opacity: 0`. Alongside it, two
  teaching invariants (collusion renders BROKEN while the crypto
  indicator stays factually valid; padding beats the size join while the timing join still
  identifies everyone), and a **claims suite** (`e2e/claims.spec.ts`) asserting every headline
  verdict against values the page itself computed: the relay's ciphertext is byte-identical to the
  client's sealed request, the wire header is the header bound into `info`, `salt` is literally
  `enc ‖ response_nonce`, the response nonce is the prefix of the response on the wire, the padded
  crowd's wire size equals the pad target plus the overhead a different exhibit displayed, the
  leaked-key attack reproduces the client's BHTTP bytes exactly, both fail-closed attacks reach a
  real `OpenError` and say why, the collusion join quotes the relay's WHO and the gateway's WHAT,
  and every correlation counter matches the log rows it claims to summarise.
- Deploys via GitHub Actions Pages; unit tests and the accessibility gate block the deploy.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## DP Noise

- **slug**: `crypto-lab-dp-noise`
- **repo**: https://github.com/systemslibrarian/crypto-lab-dp-noise
- **live**: https://systemslibrarian.github.io/crypto-lab-dp-noise/
- **commit_sha**: `77f720377165f9235691f2aec0706f31207d2d17` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PRIVACY  ·  **level**: advanced  ·  **--accent**: #ec4899
- **MISSING FIELDS**: verification

**Name (H1)**: DP Noise  — _read from index.html_

**Subtitle**: Differential privacy · ε-δ · Laplace mechanism  — _read from index.html_

**Description**: Runs the real Laplace and Gaussian mechanisms over a twelve-person payroll so you can watch what DP actually promises about two databases that differ by one person: not that they become impossible to tell apart, but that an attacker's odds of telling them apart move by at most a factor of e^ε. Watch that cap tighten as ε shrinks, see exactly how often the optimal attacker still wins — and watch the guarantee break when you spend the budget.  — _read from index.html_

**Why it matters**: Publishing only aggregates is not privacy: two innocuous totals subtract to one person's salary. Differential privacy is the first definition that survives an attacker who already knows everything else, and it is what now stands between you and the 2020 US Census, your iPhone keyboard, and Chrome's telemetry.  — _read from index.html_

**Card copy**: Real payroll differential privacy keeps distinguishing advantage bounded; an expert card computes distinct ℓ-diversity, ordered t-closeness, utility loss, and linked-release disclosure, while geo-indistinguishability computes its ε-times-distance privacy bound.

**Chips**: Laplace Mechanism · Gaussian Mechanism · Planar Laplace Mechanism · &#949;-&#948; Budget · Composition · ℓ-Diversity · t-Closeness

**Implements**: Gaussian mechanism `src/dp/discrete.ts:40`, Laplace mechanism `src/dp/laplace.ts:45`, Planar Laplace mechanism `src/dp/geo.ts:134`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Bloom filter `src/dp/params.ts:62`

**References**: Bloom filter, CKKS

**Standards body**: _none_

**Implementation**: hand-rolled

**Spec citations, exactly as written**:

- `arXiv:0803.0032` — first seen README.md:123 (2×)
- `arXiv:1212.1984` — first seen README.md:32 (2×)

**README — What Can Go Wrong**:

```text
- **A float sampler.** `b·ln(u)` over a double-precision uniform does not have the Laplace distribution — it has one with gaps and duplicated masses whose low-order bits depend on the true answer. Mironov (CCS 2012) recovers the answer from them. Exhibit 4 offers this mode, labelled; the page's default draws only exact rational Bernoullis.
- **A lattice mismatch.** Releasing on a coarse grid without first rounding the true answer onto that grid gives the two neighbouring databases *disjoint supports*, an infinite likelihood ratio, and no privacy — from a step that looks like a rendering detail. This page rounds first, and pays one extra step of sensitivity for it (`ε/(gridSteps + 1)`, not `ε/gridSteps`).
- **Sensitivity read off the data.** Δ must come from a declared bound. A Δ computed from the observed maximum salary is itself a function of the data and leaks it.
- **No composition accounting.** Exhibit 5 runs the averaging attack: individually private answers, averaged, give the true value. Privacy that is displayed but never charged is not privacy.
- **A budget that warns instead of refusing.** A release cannot be un-released. The only fail-closed response to an exhausted budget is to stop answering, which is what `Ledger.request` does — it returns `null`, and the caller is required to treat that as "no answer exists".
- **Quoting an ε without its provenance or its conversion.** Exhibit 6 shows the same Census mechanism carrying three defensible ε a full unit apart, depending only on which accountant converted ρ.
- **Quoting a location ε without a metric or unit.** `ε = 0.5` in Exhibit 7 means `0.5 km⁻¹` on a local Euclidean plane. Changing kilometres to metres without changing ε changes the guarantee by a factor of one thousand.
- **Cropping and renormalising at a map boundary.** A finite output set gives different normalising constants to inputs near its border. The executable grid control shows the naive rate-ε shortcut violating an εd bound; deterministic post-processing of an already-private ideal draw and defining a new renormalised grid mechanism are not the same operation.
- **Treating one protected point as a protected path.** Independent releases compose, and correlated trajectories require an explicit model. The path panel pays the sum of the per-point bounds and labels its two-candidate example rather than claiming general trajectory privacy.
- **Treating ℓ-diversity or t-closeness as a privacy guarantee.** They are criteria on one published table. Two tables that each satisfy them, published independently, can still disclose an individual's sensitive value exactly — the card in Exhibit 1 does it with two releases of the same sixteen people. Neither criterion quantifies over what else has been released, which is the gap differential privacy was defined to close.
- **Expecting DP to protect a group.** ε bounds what can be learned about *one person*. Conclusions about a population — that this company pays engineers well — are exactly what the release is for, and DP neither prevents them nor claims to.
```

**Claims tested** (e2e/claims.spec.ts, 10 test(s)):

- `the differencing comparison follows the session budget without charging or resampling it` — e2e/claims.spec.ts:3
    - :11 `toContainText` expected `'ε = 2 per run'` _(literal)_
    - :12 `toContainText` expected `'ε = 10 across the five runs'` _(literal)_
    - :13 `toContainText` expected `'budget 1.50, charged 0.000, remaining 1.500'` _(literal)_
    - :14 `toContainText` expected `'admit the first query and refuse the second'` _(literal)_
    - :15 `toContainText` expected `'Nothing released yet.'` _(literal)_
    - :18 `toContainText` expected `'budget 3.00, charged 0.000, remaining 3.000'` _(literal)_
    - :19 `toContainText` expected `'admit both queries of one run'` _(literal)_
    - :20 `toEqual` expected `answers` _(expression)_
    - :21 `toContainText` expected `'Nothing released yet.'` _(literal)_
    - :24 `toContainText` expected `'budget 3.00, charged 1.500, remaining 1.500'` _(literal)_
    - :25 `toContainText` expected `'admit the first query and refuse the second'` _(literal)_
    - :27 `toContainText` expected `'budget 3.00, charged 2.500, remaining 0.500'` _(literal)_
    - :28 `toContainText` expected `'refuse the first query'` _(literal)_
    - :31 `toContainText` expected `'admit both queries of one run'` _(literal)_
    - :33 `toContainText` expected `'budget 10.00, charged 0.000, remaining 10.000'` _(literal)_
    - :34 `toContainText` expected `'admit both queries of one run'` _(literal)_
    - :35 `toContainText` expected `'all five runs would remain within this budget'` _(literal)_
    - :37 `toContainText` expected `'Nothing released yet.'` _(literal)_
    - :38 `toContainText` expected `'does not charge the session ledger'` _(literal)_
- `the scope card points to current CI evidence instead of a stale test count` — e2e/claims.spec.ts:41
    - :45 `toContainText` expected `'current CI run'` _(literal)_
    - :46 `toContainText` expected `'executes the full Vitest suite before it can build or deploy'` _(literal)_
    - :47 `toContainText` expected `'rather than a test count copied into this page'` _(literal)_
    - :48 `toContainText` expected `/\b\d+ tests pass\b/i` _(regex)_
    - :49 `toHaveAttribute` expected _no expected value_ _(none)_
    - :57 `expect` expected _no expected value_ _(none)_
- `geo bound and finite-grid labels follow independently recomputed probabilities` — e2e/claims.spec.ts:104
    - :108 `expect` expected _no expected value_ _(none)_
    - :109 `expect` expected _no expected value_ _(none)_
    - :113 `toBeCloseTo` expected `epsilon * separation, 14` _(expression)_
    - :114 `toBeCloseTo` expected `epsilon * separation, 14` _(expression)_
    - :115 `toBeCloseTo` expected `Math.exp(epsilon * separation), 14` _(expression)_
    - :133 `toBeCloseTo` expected `naive, 14` _(expression)_
    - :134 `toBeCloseTo` expected `repaired, 14` _(expression)_
    - :135 `expect` expected _no expected value_ _(none)_
    - :136 `expect` expected _no expected value_ _(none)_
    - :137 `toContainText` expected `'violates bound'` _(literal)_
    - :138 `toContainText` expected `'within bound'` _(literal)_
- `geo sampled utility is the current seeded run and parameter edits retire it` — e2e/claims.spec.ts:141
    - :165 `toBeCloseTo` expected `sum / 2_000, 13` _(expression)_
    - :166 `toBeCloseTo` expected `within / 2_000, 14` _(expression)_
    - :167 `toBeCloseTo` expected `nearest / 2_000, 14` _(expression)_
    - :168 `toBeCloseTo` expected `4, 14` _(expression)_
    - :169 `toBeCloseTo` expected `1 - 2 / Math.E, 14` _(expression)_
    - :172 `toContainText` expected `'No planar samples drawn yet'` _(literal)_
    - :173 `toContainText` expected `'No release transcript yet'` _(literal)_
- `geo path inference uses the visible transcript and pays for every release` — e2e/claims.spec.ts:176
    - :191 `toBeCloseTo` expected `loss, 13` _(expression)_
    - :192 `toBeCloseTo` expected `4 * 0.5 * 1, 14` _(expression)_
    - :193 `toBeCloseTo` expected `posterior, 13` _(expression)_
    - :194 `toHaveCount` expected `4` _(literal)_
    - :195 `toContainText` expected _no expected value_ _(none)_
- `the class table is the arithmetic the registry rows imply, not a label` — e2e/claims.spec.ts:267
    - :272 `toHaveLength` expected `16` _(literal)_
    - :273 `toBe` expected `2` _(literal)_
    - :274 `toBe` expected `3` _(literal)_
    - :277 `toEqual` expected `[4, 3, 3, 4, 2]` _(expression)_
    - :290 `toHaveLength` expected `groups.size` _(expression)_
    - :296 `expect` expected _no expected value_ _(none)_
    - :304 `toBe` expected `members!.length` _(expression)_
    - :305 `toBe` expected `'[${counts.join(',')}]'` _(expression)_
    - :306 `toBe` expected `distinct` _(expression)_
    - :307 `toBe` expected `'${expected.n}/${expected.d}'` _(expression)_
    - :312 `toBe` expected `withinT` _(expression)_
- `the similarity class is distinct 3-diverse and still over t, computed both ways` — e2e/claims.spec.ts:316
    - :330 `toBe` expected `3` _(literal)_
    - :331 `toBe` expected `true` _(expression)_
    - :336 `toBe` expected `true` _(expression)_
    - :339 `toHaveText` expected `'${d.n}/${d.d}'` _(expression)_
    - :340 `toContainText` expected `'over t'` _(literal)_
    - :341 `toContainText` expected `'still over t'` _(literal)_
- `the repaired release passes t at equality and the page says what it cost` — e2e/claims.spec.ts:344
    - :364 `toBe` expected `'9/64'` _(literal)_
    - :366 `toContainText` expected `'Meets k'` _(literal)_
    - :374 `toHaveText` expected `String(truth)` _(expression)_
    - :375 `toHaveText` expected `'[0, ${possible}]'` _(expression)_
    - :376 `toHaveText` expected `String(possible)` _(expression)_
    - :381 `toHaveText` expected `'[${truth}, ${truth}]'` _(expression)_
    - :382 `toHaveText` expected `'0'` _(literal)_
- `the intersection is the one the two rendered candidate sets imply` — e2e/claims.spec.ts:385
    - :391 `toHaveLength` expected `3` _(literal)_
    - :392 `toContainText` expected _no expected value_ _(none)_
    - :397 `toContainText` expected `'not attacker-visible'` _(literal)_
    - :430 `toBe` expected `k` _(expression)_
    - :431 `toBe` expected `l` _(expression)_
    - :432 `toBe` expected `'${max.n}/${max.d}'` _(expression)_
    - :433 `toBe` expected `true` _(expression)_
    - :434 `expect` expected _no expected value_ _(none)_
    - :438 `toHaveText` expected `'{${expected.join(', ')}}'` _(expression)_
    - :443 `toBe` expected `true` _(expression)_
    - :444 `toBe` expected `true` _(expression)_
    - :447 `toBe` expected `true` _(expression)_
    - :452 `toBe` expected `true` _(expression)_
    - :453 `expect` expected _no expected value_ _(none)_
- `the deterministic-release counterexample is computed, and keeps its scope` — e2e/claims.spec.ts:456
    - :462 `toContainText` expected `'differ'` _(literal)_
    - :463 `toContainText` expected `'1 ≤ e^ε · 0'` _(literal)_
    - :464 `toContainText` expected `'no finite ε satisfies that'` _(literal)_
    - :468 `toContainText` expected `'about THIS'` _(literal)_
    - :469 `toContainText` expected `'could never appear inside some differentially private mechanism'` _(literal)_
    - :470 `toContainText` expected `'does not stop a release teaching true things about a population'` _(literal)_

**Mutation records** (1 file(s)):

- `scripts/mutations.mjs` (10258 bytes)

<details><summary>Full README</summary>

```markdown
# DP Noise

**Differential privacy · ε-δ · Laplace mechanism** — runs the real Laplace and Gaussian mechanisms over a twelve-person payroll so you can watch what DP actually promises about two databases that differ by one person. Not that they become impossible to tell apart: that an attacker's odds of telling them apart move by at most a factor of `e^ε`. The advantage is *bounded*, never eliminated — the optimal attacker still succeeds with probability `(1 + tanh(ε/2))/2`, and the page shows that number next to the bound. Then watch even that guarantee evaporate when the budget is spent.

**Live demo:** https://systemslibrarian.github.io/crypto-lab-dp-noise/
**Teaching with it:** [TEACHING.md](TEACHING.md) — prerequisites, 15/30/60-minute routes, discussion prompts, expected misconceptions, and which interactions are stochastic.

---

## What It Is

Differential privacy (Dwork, McSherry, Nissim & Smith, TCC 2006) is a promise about a *computation*, not about a released table: for every pair of databases differing in one person's record, and every possible output `x`,

`​``
Pr[M(D) = x]  ≤  e^ε · Pr[M(D′) = x]
`​``

Everything else follows from that inequality. Bayes turns it into a bound on belief — an observer who thought it an even chance you were in the data cannot end up more than `e^ε/(1+e^ε)` sure — and that is the sentence ε actually buys.

This page implements the mechanisms rather than describing them:

- **The discrete Laplace mechanism**, sampled exactly as the difference of two Geometric(1 − e^−γ) draws, using only rational Bernoulli comparisons (Canonne–Kamath–Steinke 2020).
- **The discrete Gaussian mechanism**, sampled by CKS20's rejection algorithm, with σ calibrated by the **analytic Gaussian mechanism** (Balle & Wang, ICML 2018) rather than the loose textbook bound.
- **The textbook continuous Laplace**, offered and labelled — sampling `b·ln(u)` over a double is what nearly every tutorial does, and it is what Mironov (CCS 2012) turned into a recovery attack.
- **Basic and advanced composition** (DMNS; Dwork–Rothblum–Vadhan, in Kairouz–Oh–Viswanath's heterogeneous form), both computed on every request, with the cheaper one billed.
- **k-anonymity** (Sweeney 2002) and the **homogeneity attack** (Machanavajjhala et al. 2007), for the contrast — then **distinct ℓ-diversity** and **ordered t-closeness** (Li, Li & Venkatasubramanian, ICDE 2007), computed as exact BigInt fractions, and a **two-release intersection attack** (Ganta, Kasiviswanathan & Smith, KDD 2008) that exposes their single-release composition limit.
- **zCDP → (ε, δ) conversion**, so the 2020 Census's published ε can be re-derived from the ρ the Bureau actually budgeted in.
- **Geo-indistinguishability on a local Euclidean plane**, with the ideal planar Laplace density, an attained ε-times-distance likelihood-ratio bound, sampled radial and nearest-service utility, a finite-grid boundary counterexample, and repeated-release transcript accounting (Andrés et al., CCS 2013, §§3–5.3).

All live randomness comes from `crypto.getRandomValues`. The payroll mechanisms use exact rational ε and exact rational Bernoulli comparisons. The geo exhibit is intentionally different and says so wherever it runs: it samples the ideal planar density with 53-bit IEEE-754 uniforms, so it is a bounded teaching implementation, not the paper's finite-precision digital mechanism and not an exact discrete sampler.

The location lesson was checked against Andrés, Bordenabe, Chatzikokolakis and Palamidessi, [*Geo-Indistinguishability: Differential Privacy for Location-Based Systems*](https://arxiv.org/abs/1212.1984), CCS 2013 / arXiv:1212.1984: Definition 3.1 and §§3–5.3. The ideal planar mechanism comes from §§4.1–4.2; the radial utility calculation follows Observation 5.1 and Proposition 5.2; the repeated/correlated-location limits follow §§3.3 and 5.3. The 7 × 7 normalised exponential grid is this lab's separate bounded counterexample/control, not a reproduction of the paper's finite-precision calibration.

**Security model:** a *statistical* guarantee against an adversary with unlimited computing power and unlimited side knowledge, bounding what can be concluded about **any one individual**. It is not a cryptographic primitive; nothing here is encrypted. **This is not production code** — it is a teaching demo.

## How the Page Is Structured

The page is a lesson with a reference inside it, and it opens as the lesson.

- **One curriculum table** (`src/ui/curriculum.ts`) drives three things that used to be three parallel lists able to drift apart: the objectives stated up front, the core path's four steps, and the exit challenge's four questions. An objective with no interaction behind it, or an interaction nothing tests, is now not expressible.
- **Learning objectives** are stated up front, before any exhibit.
- **A core path** of four ideas sits immediately after the intro: why aggregates fail, what ε promises, why sensitivity matters, why privacy is a budget. Each names the one interaction that establishes it, the exit question that tests it, and is marked *Established* only once that interaction has actually run — not by scrolling past it, and **not by a linked ε arriving from another exhibit**. Exactly one step carries a *Start here* tag: the first not yet established.
- **Two routes.** The **guided route** is the default and removes the expert panels (k-anonymity, the ℓ-diversity/t-closeness card and its intersection attack, the guessing experiment, the composition-rule chart, post-processing, the deployments panel and geo-indistinguishability), naming in plain text what it has set aside. **Explore everything** restores them. The honest-scoping section is never hidden on either route.
- **Linked ε.** On the guided route one ε drives Exhibits 2, 3 and 4 together, with a readout beside every control showing `b = Δ/ε` at the current values, what an attacker's belief could reach, and what one release would cost the session ledger. Unlink it to park two exhibits at different ε.
- **Attack before defence.** On the guided route Exhibit 5 reorders so the averaging attack runs before the ledger appears — the budget arrives as the answer to a problem you have already watched happen. The swap moves DOM nodes rather than setting CSS `order`, so reading and focus order stay in step with the visual order.
- **An exit challenge** of four scenarios that appear nowhere else on the page, reported as concepts to revisit rather than as a score. Each wrong answer links to the exact interaction that re-establishes the idea — and where that interaction is one the guided route sets aside, the link widens the route on the way and says so.
- **Every release quotes its price.** The dial, the guessing game and the DP-mode differencing attack all name what they would cost the same session ledger. They quote rather than charge, because being locked out of a teaching panel teaches nothing — but no release on the page is allowed to look free.
- **Classroom mode** swaps the samplers onto a fixed seed so a lesson can be rehearsed and repeated. It is never the default, it selects and retries nothing, and every seeded panel says so on screen.

See [TEACHING.md](TEACHING.md) for lesson routes and debrief answers.

## Exhibits

1. **Two harmless totals, one person's salary** — the whole twelve-record database, printed, and then the **differencing attack** run against it: "total payroll" minus "total payroll excluding Alice" is Alice's exact salary, to the dollar, from two queries that never name a person. Switch the same two queries to ε = 1 and the attack still runs and stops meaning anything. Beside it, the obvious alternative: generalise the quasi-identifiers until the table is k-anonymous. The page **measures** k at each generalisation (1 → 1 → 3 → 6) and then runs the **homogeneity attack** — at k = 3 and again at k = 6, every equivalence class is unanimous about the sensitive attribute, so the k guarantee holds fully intact and the salary band falls out anyway. A second expert card then runs the two repairs that history actually proposed — ℓ-diversity and t-closeness — and shows residual disclosure their single-release criteria do not rule out. See *The release criteria* below.
2. **The definition, drawn** — the headline mechanism. Two worlds, one with Alice and one without, both asked "how many people earn more than $100,000?" (true answers 6 and 5). The first chart is the two output distributions; the second is the **log of their pointwise likelihood ratio, between rails at ±ε**. Drag ε from 0.01 to 10 and watch that line step from one rail straight to the other and sit there — the bound is *attained at every output*, not merely respected, which is what a tight ε looks like. Switch to the Gaussian and the same line becomes a straight diagonal through both rails: a Gaussian tail is too light for any pure ε, and the page computes the **exact δ** — `Σₓ (Pr[M(D)=x] − e^ε·Pr[M(D′)=x])₊` — that the failure costs. The panel also prints two numbers that turn out to be identical, and explains why: the total variation distance between two discrete Laplace distributions one step apart is exactly `tanh(ε/2)`, so the optimal attacker's success rate `(1 + tanh(ε/2))/2` is exactly the belief bound `e^ε/(1 + e^ε)`. The mechanism is tight in both senses at once, and the suite asserts the equality at every stop on the ladder.
3. **Can you tell which world you are in?** — the break-it-yourself panel. Draw 2,000 real releases from each world and watch the histograms build across animation frames, overlaid on the exact PMF; the panel then measures the total variation distance off the histograms and compares it with the closed-form prediction. Then the game: a cryptographic coin picks a world, the real mechanism releases one answer, and you guess. Your running score sits next to the best score *any* attacker could achieve at that ε — a theorem, not a comment on your attention span.
4. **The dial: what ε costs in usefulness** — pick a query, an ε and a mechanism, and read both sides at once: how far an attacker's belief can move, and how wrong the answer is. The typical error and the 95% interval are summed off the mechanism's own PMF. Switching from the headcount to the total payroll changes the noise by five orders of magnitude at the same ε, because **sensitivity**, not ε alone, sets the scale — and the panel shows where Δ came from (a declared clamp, never the observed data). A second panel releases the payroll and the headcount and divides them, because **post-processing is free**.
4b. **Where does Δ come from? You have to answer** — the deployment skill the rest of the page only describes. Declare a bound on one person's salary *before* looking at the data, and read what it costs on both sides: raise it and the noise rises in proportion, lower it and every record above it is clipped, so the answer is biased by an amount no averaging will remove. Then a thirteenth person is hired at $480,000, above the bound that was already published, and you choose: clip her, drop her record, or quietly raise the bound to fit. The third is offered because it is the one a well-meaning engineer picks, and it is then **refused** — Δ read off the observed maximum makes the *noise scale* a function of the data, so two neighbouring databases produce releases with different scale parameters and an attacker reads the top salary off the noise itself.
5. **Composition: ε is a budget, not a setting** — a working, fail-closed ledger. Ask questions, watch the budget deplete, and watch a query that would overdraw get **refused** rather than answered. Both composition rules are plotted as functions of k with the crossover computed. Then the attack the ledger exists to prevent: ask the same ε = 0.5 question a few hundred times and average, and the running error falls as 1/√n straight onto the predicted `b√2/√n` curve until the true payroll is recovered — from answers that were each, individually, differentially private.
6. **ε in the wild** — Apple, Google's RAPPOR, and the 2020 US Census, each ε put through the same belief calculation the rest of the page uses so the numbers can be compared rather than admired. The column that matters is **provenance**: published by the operator, measured by outside researchers from a shipping binary, or derived here from some other published parameter. The Census entry re-derives its own ε from ρ = 2.63, landing on 18.19 by the standard conversion and 17.43 by the Rényi-optimised one against the Bureau's published 17.14 — one mechanism, three defensible labels.
7. **A privacy budget measured per kilometre** — instantiate geo-indistinguishability on a declared local Euclidean plane. The exhibit computes two normalised planar densities and a collinear output that attains `ε·distance`; samples the polar mechanism and compares current-run error with the exact radial CDF and mean; measures whether a noisy point still selects the nearest service; and lets an observer compare two candidate paths from the released transcript alone. A separate 7 × 7 grid shows that directly truncating and renormalising `exp(−εd)` at a border can exceed the requested bound, while a half-rate control stays within it. That grid is a separate teaching construction, not the finite-precision mechanism of the paper.

## The release criteria: ℓ-diversity, t-closeness, and what they still leak

A second expert card in Exhibit 1 implements the two repairs to k-anonymity and then shows a repeated-release disclosure that neither single-table criterion rules out. It is on the **Explore everything** route only; the guided route and the four core steps are unchanged by it, and nothing on it marks a core step established.

### Which definitions, exactly

Both terms name a family, and this page implements one member of each and says so everywhere it appears.

| Implemented here | Stated as | NOT implemented |
| --- | --- | --- |
| **distinct ℓ-diversity** — every equivalence class contains at least ℓ distinct sensitive values | Li, Li & Venkatasubramanian, ICDE 2007, §2, item 1, attributed there to Machanavajjhala et al. | entropy ℓ-diversity (Machanavajjhala et al. Definition 4.1) and recursive (c, ℓ)-diversity (Definition 4.2), both strictly stronger |
| **ordered t-closeness** — every class's distribution is within Earth Mover distance t of the whole released table's, under the ordered ground distance `\|i − j\|/(m − 1)` | Li et al. Definition 2 (the t-closeness principle) with §5.1 (numerical attributes) | the equal and hierarchical ground distances of §5.2, and every other distance the principle admits |

A note on attribution that matters: the **ICDE 2006** ℓ-diversity paper this lab read does **not** define "distinct ℓ-diversity" as a definition of its own. It states the ℓ-diversity *principle* ("at least ℓ well-represented values") and instantiates it as entropy and recursive diversity, observing only that entropy ℓ-diversity implies at least ℓ distinct values. The name "distinct ℓ-diversity" is Li et al.'s, in §2, where it arrives with its own warning: *"Distinct ℓ-diversity does not prevent probabilistic inference attacks."* This page uses that name and that warning.

Primary texts checked: [Machanavajjhala et al., ICDE 2006](https://www.cs.cornell.edu/johannes/papers/2006/2006-icde-publishing.pdf), [Li et al., ICDE 2007](https://www.cs.purdue.edu/homes/ninghui/papers/t_closeness_icde07.pdf), and [Ganta et al., KDD 2008](https://www.shivakasiviswanathan.com/KDD08.pdf).

### The arithmetic, in exact integers

Li et al. §5.1 derive, for `r_i = p_i − q_i`:

`​``
D[P, Q] = (1/(m − 1)) · ( |r₁| + |r₁+r₂| + … + |r₁+…+r_{m−1}| )
`​``

Their second form sums i from 1 to m; the two agree because the final partial sum is zero. This lab sums all m terms and **asserts the final term is zero at every class of every release**, so the identity is checked rather than assumed.

Nothing is computed in floating point. With `c_i` the cumulative count in the class, `C` the class size, `g_i` the cumulative count in the table and `N` the table size:

`​``
D = ( Σᵢ |N·c_i − C·g_i| ) / ( (m−1)·C·N )
`​``

— a BigInt numerator over a BigInt denominator. The verdict `D ≤ t` is a **cross-multiplication**, `numerator · t.d ≤ t.n · denominator`, so no rounding can decide a pass. The declared `t = 9/64` is exactly the largest class distance in all three releases that pass, which puts the "no more than t" boundary on screen instead of in a sentence.

### The table, and the five releases

Sixteen synthetic records, one per (ZIP prefix, age decade) cell, with an ordered five-band sensitive domain. Its b3/b4 edge matches the lab's integer-dollar query exactly: b3 includes $100,000 and b4 begins at $100,001, because the query asks for salaries **more than** $100,000. Global distribution `(4, 3, 3, 4, 2)/16`.

| Release | k | distinct ℓ | max class EMD | Meets k ≥ 4, ℓ ≥ 3, t = 9/64 |
| --- | --- | --- | --- | --- |
| ZIP to 3 digits + age to 20-year bands | 2 | **1** | 29/64 | no — one class is unanimous (b1 twice): the homogeneity attack |
| Age to 10-year bands | 4 | 3 | **17/64** | no — the 30–39 class holds {b1, b2, b3}, three distinct bands all below $100,000: the **similarity attack** |
| ZIP to 3 digits | 4 | 3 | **9/64** | yes, at equality |
| Age split at 30 | 4 | 3 | **9/64** | yes, at equality — the independently compliant age release used below |
| Age to 20-year bands | 8 | 4 | **9/64** | yes, at equality — the repaired release |

Every one of those numbers is recomputed from the rendered rows by a browser claim test that implements the EMD itself and never reads a verdict label.

### What it cost

The utility metric is one declared query, not a score: *"how many people are in their thirties?"* A record is **certain** when its published age range lies entirely inside the question and merely **possible** when the ranges overlap without containment, so a release answers with an interval and the number reported is its width.

- The release that **fails** t (age decades) answers exactly: `[4, 4]`, ambiguity **0**.
- The release that **passes** t (twenty-year bands) answers `[0, 8]`, ambiguity **8**, against a true answer of 4.

That is the trade, derived from the rows of each release. Li et al. say the same thing about their own criterion: t-closeness "limits the amount of useful information that is released, as it limits information about the correlation between quasi-identifier attributes and sensitive attributes. However, this is precisely what one needs to limit."

### Two compliant releases, one disclosed band

The attack is a bounded adaptation of the intersection attack in Ganta, Kasiviswanathan and Smith, KDD 2008 (arXiv:0803.0032), §1.1.1. Alongside two linked releases of the same population and the stated target background, it makes explicit the two properties the paper highlights: **exact sensitive value disclosure** ("the sensitive value corresponding to each member of the group is published exactly") and **locatability** ("given any individual's non-sensitive values ... one can locate the group in which individual has been put in").

In this bounded adaptation the declared sensitive value is the **salary band**, not the raw dollar salary. Each published class exposes its exact band multiset (the counts shown above), from which the attacker obtains the candidate-band set. The result below therefore establishes disclosure of one exact published band; it does not claim recovery of the underlying salary.

Two releases of the same sixteen people, published independently, each meeting the full declared policy — **4-anonymous, distinct 3-diverse and 9/64-close**:

- by ZIP prefix → the target's class admits bands `{b2, b3, b4}`;
- by whether age is under 30 → the target's class admits bands `{b1, b4, b5}`.

This is a bounded constructed counterexample. The unequal age partition (four records under 30, twelve records 30 and over) is declared up front and chosen to make both individual releases satisfy the policy; it is not presented as output from Mondrian, Incognito or an optimisation algorithm. What the run establishes is existence: satisfying these three single-table criteria does not make this pair compose safely.

Neither reveals the target's exact band or high-earner predicate on its own: each release still narrows the target to three bands, and each candidate set straddles the $100,000 boundary. Intersected, they leave `{b4}` — the exact band, and with it the same secret the counting query in Exhibit 2 exists to protect.

The raw registry printed on the page is explicitly labelled **omniscient teaching ground truth**, not an attacker-visible release. Before the attack runs, `publishRelease` removes record ids, names, exact ages and salaries. The attacker receives only the two published class views plus explicit background observations — ZIP prefix `981**` and “under 30” — and is never passed the target record or real band. The truth is compared with the result afterwards; tests assert that the public projection contains no target identity or salary and move the target between bands to confirm the attack follows the published values rather than retained truth.

**This is residual disclosure, not unique identification** — the attacker never learns which row is the target — and **one constructed counterexample is not a composition theorem**. The cited paper measured the effect across two census datasets; that is a different claim and is not reproduced here.

### And none of it is differential privacy

The repaired release is a **deterministic** function of the table. Take the output event *"the serialised release equals the exact string produced on the database that contains the record"*. On the registry that event has probability 1; on the neighbouring registry with the target removed, the serialisation differs, so it has probability 0. ε-DP would require `1 ≤ e^ε · 0`, and no finite ε satisfies that. The two serialisations are computed and compared on every run; the flag is `withTarget !== withoutTarget` and both branches of that comparison are tested.

The scope is kept narrow, on the page and here:

- it is about **this deterministic release and this event**, and is **not** a claim that a k, ℓ or t transformation could never appear inside some differentially private mechanism;
- it says nothing about whether ℓ-diversity or t-closeness succeed on their own terms;
- and ε does not rescue what the criteria miss: DP does not stop a release teaching true things about a population, and promises nothing about any particular sensitive value — only that the released answer would have looked much the same had one person never been in the table.

### Distinctions the card keeps visible

k-anonymity vs distinct ℓ-diversity · distinct vs entropy vs recursive ℓ-diversity · similarity and skewness attacks vs homogeneity · class distribution vs whole-table distribution · a release criterion vs a randomised neighbouring-world mechanism · one release vs linked repeated releases · what record linkage assumes vs what the table shows outright · residual disclosure vs unique identification · synthetic teaching data vs production de-identification.

Increasing k, raising ℓ or tightening t does **not** buy a monotonically increasing amount of privacy, and the page shows why rather than saying so: raising k above leaves the homogeneity disclosure untouched, a distinct 3-diverse class still discloses which end of the scale someone is on, and two releases that each meet every displayed criterion still reveal an exact band when combined. Li et al. say of their own measure that "the relationship between the value t and information gain is unclear", and quote the pair (0.01, 0.99) vs (0.11, 0.89) sitting at the same EMD as (0.4, 0.6) vs (0.5, 0.5).

### Why a second table

The twelve-person payroll could not carry this lesson, and the reason is recorded rather than papered over. Salary tracks department there almost exactly, so every generalisation that separates the target from the low-paid support staff leaves *them* a unanimous class, and every generalisation that does not leaves the target's candidate set unchanged. No pair of independent releases of those twelve rows both satisfies a stated k/ℓ/t policy *and* intersects to something new about one person. Rather than weaken a release until an attack appeared, this exhibit declares a second sixteen-row synthetic registry built for the job. **Nothing in `src/dp/database.ts` is touched**, and a unit test asserts the payroll's k, its homogeneity leak and its record count are exactly what they were.

### Claim → code → test

| Claim on the page | Code | Test |
| --- | --- | --- |
| every record is in exactly one class, at every release | `describeRelease` via `analyse` in `kanon.ts` | *partitions the registry at every release* |
| measured k and distinct ℓ per release | `describeRelease`, `distinctBands` | *%s is %s-anonymous and distinct %s-diverse* |
| the class and whole-table band counts | `countBands` | *computes the exact counts the README prints*; *uses the WHOLE table as the reference distribution* |
| the exact EMD and its normalisation | `orderedEmd` | hand calculations on two- and three-point domains; *has a final cumulative term of exactly zero*; *normalises by (m−1)·C·N* |
| the t verdict, including equality | `meetsThreshold` | *passes below t, passes AT t, and fails above it*; *is met at equality by all three passing releases* |
| distinct ℓ passes where t fails | `ClassReport.noneAboveThreshold` | *finds a distinct 3-diverse class whose values are all below the threshold* |
| the repaired release meets all three | `describeRelease` | *is repaired by a release that meets k, ℓ and t together* |
| the utility interval and its width | `answerAgeQuery` | *derives the truth from the actual rows, at every release* |
| each release meets its stated criteria alone | `describeRelease` | *publishes two releases that each satisfy the stated k, ℓ and t on their own* |
| the attacker gets no hidden record state | `publishRelease` | *removes identities and raw salaries before the attacker runs* |
| the intersection, from attacker-visible rows only | `intersectReleases` | *narrows five bands to one, and the one is right*; *reads the published rows, and tracks them when they change*; *follows the target's own band when that band changes* |
| this event rules out finite ε for the deterministic release | `neighbourContrast`, `separatesWorlds` | *computes the two neighbouring releases rather than asserting the conclusion*; *distinguishes a separating event from an event that establishes nothing* |
| the payroll results are unchanged | — | *leaves the payroll table and every result computed from it untouched* |

Malformed inputs fail explicitly rather than returning a number: an empty class, an empty table, a mismatched or one-value domain, negative/fractional/inconsistent counts, a zero denominator or negative value in either side of the threshold comparison, an unreadable published age range, a backwards query range, missing or ambiguous attacker observations, an unknown release id, and a neighbouring-world request for a record that is not in the table.


## When to Use It

- **Use differential privacy** when you must publish statistics computed over people's data and cannot enumerate in advance what an attacker already knows. That last clause is the whole point: every pre-DP approach fails against side information, and DP is the first definition that quantifies over it.
- **Use the Gaussian mechanism** when you compose many queries, or when the query is vector-valued and its ℓ₂ sensitivity is much smaller than its ℓ₁ — and you can accept a δ.
- **Use the Laplace mechanism** when you want pure ε with no failure probability at all.
- **Do NOT use it to protect inputs.** DP protects the *output* of a computation from revealing an individual. If the problem is that no one should see the raw inputs at all, that is secure multi-party computation — see [crypto-lab-silent-tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/). The two are complementary and neither substitutes for the other.
- **Do NOT use it as a re-identification shield for a released microdata table.** DP is not anonymisation; a DP release of a dataset is not "the dataset with the names removed", and treating it that way is how deployments get their utility and their privacy both wrong.
- **Do NOT use this code.** It is a teaching implementation. Use [Google's differential privacy libraries](https://github.com/google/differential-privacy) or [OpenDP](https://github.com/opendp/opendp).

## What Can Go Wrong

- **A float sampler.** `b·ln(u)` over a double-precision uniform does not have the Laplace distribution — it has one with gaps and duplicated masses whose low-order bits depend on the true answer. Mironov (CCS 2012) recovers the answer from them. Exhibit 4 offers this mode, labelled; the page's default draws only exact rational Bernoullis.
- **A lattice mismatch.** Releasing on a coarse grid without first rounding the true answer onto that grid gives the two neighbouring databases *disjoint supports*, an infinite likelihood ratio, and no privacy — from a step that looks like a rendering detail. This page rounds first, and pays one extra step of sensitivity for it (`ε/(gridSteps + 1)`, not `ε/gridSteps`).
- **Sensitivity read off the data.** Δ must come from a declared bound. A Δ computed from the observed maximum salary is itself a function of the data and leaks it.
- **No composition accounting.** Exhibit 5 runs the averaging attack: individually private answers, averaged, give the true value. Privacy that is displayed but never charged is not privacy.
- **A budget that warns instead of refusing.** A release cannot be un-released. The only fail-closed response to an exhausted budget is to stop answering, which is what `Ledger.request` does — it returns `null`, and the caller is required to treat that as "no answer exists".
- **Quoting an ε without its provenance or its conversion.** Exhibit 6 shows the same Census mechanism carrying three defensible ε a full unit apart, depending only on which accountant converted ρ.
- **Quoting a location ε without a metric or unit.** `ε = 0.5` in Exhibit 7 means `0.5 km⁻¹` on a local Euclidean plane. Changing kilometres to metres without changing ε changes the guarantee by a factor of one thousand.
- **Cropping and renormalising at a map boundary.** A finite output set gives different normalising constants to inputs near its border. The executable grid control shows the naive rate-ε shortcut violating an εd bound; deterministic post-processing of an already-private ideal draw and defining a new renormalised grid mechanism are not the same operation.
- **Treating one protected point as a protected path.** Independent releases compose, and correlated trajectories require an explicit model. The path panel pays the sum of the per-point bounds and labels its two-candidate example rather than claiming general trajectory privacy.
- **Treating ℓ-diversity or t-closeness as a privacy guarantee.** They are criteria on one published table. Two tables that each satisfy them, published independently, can still disclose an individual's sensitive value exactly — the card in Exhibit 1 does it with two releases of the same sixteen people. Neither criterion quantifies over what else has been released, which is the gap differential privacy was defined to close.
- **Expecting DP to protect a group.** ε bounds what can be learned about *one person*. Conclusions about a population — that this company pays engineers well — are exactly what the release is for, and DP neither prevents them nor claims to.

## Live Demo

https://systemslibrarian.github.io/crypto-lab-dp-noise/

Run the differencing attack and recover a salary. Drag ε and watch two distributions merge. Declare a salary bound, then meet the person who does not fit it. Run the averaging attack and take the true payroll back, then spend a budget until the mechanism refuses to answer. Four ideas, about fifteen minutes, and a navigator that tells you which one you are on.

Then switch to **Explore everything** for the rest: play twelve rounds of the guessing game, watch the Gaussian sail through the ±ε rails, compare deployed ε values, and run the planar location mechanism through its exact metric bound, sampled utility, finite-map failure and repeated-release transcript.

## Real-World Usage

| Deployment | Model | ε | Provenance |
| --- | --- | --- | --- |
| Apple — keyboard and emoji telemetry | Local | ≈ 16/day | Measured by outside researchers ([Tang et al. 2017](https://arxiv.org/abs/1709.02753)) |
| Google RAPPOR — Chrome telemetry | Local | ε∞ ≈ 2.04 | Derived from the Chrome parameters in the paper's §5.4, f = 0.75 with h = 2 hash functions ([Erlingsson et al. 2014](https://arxiv.org/abs/1407.6981)) |
| US Census 2020 — redistricting file | Global | 17.14 at δ = 10⁻¹⁰ | Published; budgeted as ρ = 2.63 in zCDP |

The 2020 Census is the largest deployment of differential privacy ever attempted and the one with the most at stake — the PL 94-171 file draws voting districts.

## How to Run Locally

`​``bash
npm install
npm run dev        # http://localhost:5173/crypto-lab-dp-noise/
npm test           # current unit suite; prints the live test/file totals
npm run build      # typecheck + production build
npm run test:a11y  # accessibility/reflow gates in the pinned dark theme (needs a build first)
npm run test:mutations # clean baseline, then 22 focused source mutations (8 geo, 14 release-criteria)
`​``

`npm run test:a11y` runs two suites. `e2e/a11y.spec.ts` is the axe conformance sweep — every exhibit driven through its states on both routes, in the lab's pinned dark theme at desktop and phone width. `e2e/task.spec.ts` is the one that asks whether the lesson can actually be *completed*: the whole core path with a keyboard alone, the same path at 375 × 667 asserting no horizontal overflow with every disclosure open, and every core conclusion read out of the data tables with the SVGs removed from the document. Automated WCAG checks are necessary and they do not establish that a dense mathematical interaction is operable.

## Related Demos

- [crypto-lab-silent-tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) — secure multi-party computation. MPC protects the inputs; DP protects the output. The natural pair.
- [crypto-lab-blind-oracle](https://systemslibrarian.github.io/crypto-lab-blind-oracle/) — oblivious pseudorandom functions, another way of computing on data you are not allowed to see.
- [crypto-lab-ckks-lab](https://systemslibrarian.github.io/crypto-lab-ckks-lab/) — homomorphic encryption, where the noise is the ciphertext's rather than the privacy's.

## Build & Verify

The **current Vitest suite** is executed in CI before deploy; `npm test` prints its live test and file totals. What it actually pins down:

- **Sampler correctness.** `bernoulliExpNeg` is checked against `e^−γ` at five values of γ — the CKS20 parity is easy to transcribe inverted, which silently yields `Bernoulli(1 − e^−γ)`, a sampler that looks right and is exactly wrong. `uniformBelow` is χ²-tested for modulo bias. The discrete Laplace's sampled PMF, mean and variance are checked against the closed form; the discrete Gaussian's mean and variance against σ.
- **The ε bound itself**, asserted at **every stop on the ε ladder** and end-to-end on the real database: the largest likelihood ratio between the two neighbouring payrolls equals `e^ε` to six digits — attained, not merely respected — and needs a δ below 1e-12. Asserted twice: once over a comfortable range, and once over **the range Exhibit 2 actually examines**, which is about fifteen times wider. That second assertion exists because the first one passed while the page disagreed with it — out past roughly 75 lattice steps both PMFs underflow to zero in a double, so a ratio taken as the quotient `a/b` returned `Infinity` and the bound was reported as broken at ε = 7 and ε = 10 for a mechanism that meets it exactly. The ratio is now taken from the closed-form log ratio, which never underflows.
- **The verdicts are wired to the computations they describe.** Exhibit 2's "the rails hold" banner branches on the measured maximum ratio against `e^ε`, not on which mechanism is selected; Exhibit 4b's refusal branches on `isPrivateCalibration` applied to where that choice's Δ came from, not on the option's name; and Exhibit 1 derives "recovered exactly" from `recovered === truth`. A banner that cannot come out the other way establishes nothing, so none of these is written as a literal.
- **RAPPOR's ε∞ carries its `h`.** Theorem 1 of Erlingsson et al. is `ε∞ = 2h·ln((1 − f/2)/(f/2))`, where `h` is the number of Bloom-filter hash functions — an easy factor to drop, because it sits outside the logarithm, and dropping it reports a guarantee twice as strong as the paper proves for Chrome's `h = 2`. A test asserts the linear scaling in `h` and pins the Chrome parameters (`f = 0.75`, `h = 2`, §5.4) to ε∞ ≈ 2.043.
- **Reference values.** Φ to twelve digits at nine points plus a relative-error check at Φ(−8) ≈ 6.22e-16, where an absolute-error test would pass for an implementation that returned zero. Laplace closed forms (95% interval = 2.9957·b, 75th percentile = b·ln2). The 2020 Census zCDP conversions.
- **Cross-checks between independent routes.** The δ summed pointwise off the *discrete* Gaussian's PMF agrees within 10% with Balle & Wang's closed form for the *continuous* Gaussian at the same σ. The analytic calibration is verified to beat the textbook one everywhere the textbook one is claimed to hold, and the textbook σ is verified to actually satisfy its target δ.
- **The attacks.** The differencing attack recovers the target's salary to the dollar under exact answers and fails under DP; the averaging attack converges within 4 standard deviations of the predicted `b√2/√n`. k is measured at every generalisation level, and the homogeneity leak is asserted at k = 3 and k = 6.
- **The fail-closed ledger.** An over-budget request returns null *and leaves the ledger unchanged* — the second half is the part worth testing. The session ledger the exhibits share is tested separately: a quote must predict a refusal without spending anything, and one panel's spending has to be visible to another's quote.
- **Contribution bounding.** Δ comes from the declared bound and not from the database: the same bound over two databases with different maxima must give the same Δ and the same noise scale, while `expand` — the option the page refuses — is asserted to give *different* sensitivities for neighbouring databases, which is the leak stated as a test. The bias/noise trade is asserted to run in opposite directions across the offered bounds, and the best bound is asserted to depend on ε rather than on the data alone, because an exercise whose answer never changes is not a decision.
- **The instructional state.** Completion is idempotent and never notifies twice for the same step, `update` never touches the completion set, and the store opens on the guided route with cryptographic randomness — a default that silently flipped to seeded would make every "this is the real mechanism" claim on the page false.
- **The curriculum's own integrity.** Every core step has exactly one challenge question and no question is shared; every link is a real in-page anchor; the mid-sentence concept form keeps its proper nouns, so nothing can regenerate it by lowercasing and print "the gaussian"; and the set of revisit targets flagged as expert-gated is asserted exactly, because a flag that drifts sends a guided reader to a section that is not on their page.
- **Geo-indistinguishability.** Known-answer tests pin the planar density, attained metric bound, radial CDF and quantiles. A seeded 50,000-draw check distinguishes the Gamma(shape 2) radius from independent coordinate noise. Finite-grid probabilities are normalised and independently audited at every output cell; the naive border violation and half-rate control are both pinned. Transcript inference accepts public paths and releases but no ground-truth argument, and its loss is checked against the sum of every per-release metric bound. Browser claims independently reproduce the seeded current-run utility and transcript rather than trusting rendered labels.
- **ℓ-diversity and t-closeness.** Exact k, distinct ℓ, class and whole-table distributions, and the ordered EMD as a BigInt fraction, with hand calculations on two- and three-point domains, the zero final cumulative term, normalisation invariance under doubling both distributions, malformed-distribution refusals, and the threshold applied below, **at** and above t. The similarity class is asserted to be distinct 3-diverse *and* over t; the repaired release to meet all three criteria; the utility interval to be derived from the rows and to contain the truth. The intersection attack is asserted to use two releases that each pass k, ℓ **and t**, to receive a public projection with no identity or raw salary, to leave multiple bands and both sides of the high-earner boundary possible from either release alone, to narrow five bands to one when combined, and to move when the published rows move. The payroll's own k, homogeneity leak and record count are asserted unchanged.
- **Focused mutation evidence.** `npm run test:mutations` first requires every owning suite to pass unmodified, then makes twenty-two concrete source edits — eight covering geo density normalisation, likelihood orientation, radial CDF/sampling, finite-grid normalisation/audit and transcript accounting, and fourteen covering distinct-value counting, the reference distribution, the EMD normalisation factor, a dropped and a reversed cumulative term, `≤` versus `<` at the threshold, a scenario label standing in for the computed verdict, the age-partition boundary, secret-bearing fields in the public projection, a dropped release in the intersection, ground truth leaked into the attacker, an inverted deterministic-release event check, a stale utility truth and a collapsed query interval. Every edit must fail its named owning test; the runner restores and hashes the sources, then reruns the clean baseline before accepting the run.

Statistical assertions run on a seeded generator, so a failure means the sampler is wrong rather than that a coin landed badly. The page itself uses `crypto.getRandomValues` and never `Math.random()`.

**Accessibility gates**, both blocking the Pages deploy:

- **Conformance.** `@axe-core/playwright` scans the production build for zero WCAG 2.1 A/AA violations in the lab's pinned dark theme across the complete state drive — every exhibit, both routes, sampled and refusal states, all disclosures, desktop and phone reflow. Exhibit 7 adds its idle, invalid, sampled-utility, four-release and twelve-release states to that same gate.
- **Task completion.** A separate suite asks the question axe cannot: the four core ideas established with **keyboard input only** (Tab, Enter, arrow keys — no synthetic clicks); the same path at **375 × 667** with an assertion of no horizontal overflow, including with every disclosure open; and every core conclusion read **with the chart SVGs removed from the document**, which asserts the findings exist as numbers rather than that the pictures were described.
- **The lesson's own claims.** Three tests hold the instructional spine to what it says: a linked ε sync must *not* establish another exhibit's step (this one was written against a real bug — moving the dial used to tick off the definition); exactly one step carries the next-action tag, and it advances; and a revisit pointer into expert-gated material actually reveals it.

## Performance

The exact samplers are the expensive part, and deliberately so. A discrete Laplace draw costs about `1/γ` geometric trials, so the 4,000 draws behind Exhibit 3's histograms run in a few hundred milliseconds at ε = 1 and are chunked across animation frames — the motion on this page *is* the computation, never decoration. Queries with a large Δ are released on a coarse lattice for the same reason: an exact integer sampler at Δ = $250,000 would need minutes per draw. Readers who ask for reduced motion get the same work done in one pass.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Search Vault

- **slug**: `crypto-lab-search-vault`
- **repo**: https://github.com/systemslibrarian/crypto-lab-search-vault
- **live**: https://systemslibrarian.github.io/crypto-lab-search-vault/
- **commit_sha**: `673211d4a5be86934a456b632a5ea4db4e170766` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PRIVACY | ATTACKS  ·  **level**: intermediate  ·  **--accent**: #14b8a6
- **MISSING FIELDS**: verification

**Name (H1)**: Search Vault  — _read from index.html_

**Subtitle**: Exact SSE · OXT · PEKS · fuzzy and multi-user search  — _read from index.html_

**Description**: Builds and attacks a real encrypted index, compares naïve two-token AND with bounded OXT, runs pairing-based public-key search, measures gram-based typo recovery, and executes multi-user collusion.  — _read from index.html_

**Why it matters**: Encrypted search separates what storage can read from what it can find. Exact SSE, OXT, PEKS, fuzzy bundles, and multi-user delegation expose different equality, volume, access, guessing, neighborhood, and collusion surfaces. The role split changes. The need to state and test leakage does not.  — _read from index.html_

**Card copy**: Exact, fuzzy, Boolean, public-key and multi-user encrypted search — execute real pairings and Paillier split trust, then expose similarity, query-pattern, result-integrity and collusion boundaries.

**Chips**: SSE · OXT · PEKS · BLS12-381 · Fuzzy Search · Edit Distance · Similarity Leakage · MUSE · Paillier · Split Trust · Collusion · Leakage Abuse · Query Integrity

**Implements**: AES `src/core/aead.ts:14`, AES-GCM `src/core/aead.ts:65`, BLS12-381 `src/muse/core.ts:143`, Hash-to-curve `src/muse/core.ts:276`, HMAC `src/core/prf.ts:25`, OXT `src/oxt/core.ts:226`, Paillier `src/muse/math.ts:27`, Pairing `src/muse/core.ts:143`, PEKS `src/peks/core.ts:113`, ristretto255 `src/oxt/core.ts:22`, SHA-256 `src/core/prf.ts:37`, SHA-512 `src/core/prf.ts:46`

**Attacks shown**: Dictionary attack `src/peks/dictionary.ts:12`, Keyword inference `src/ui/attack-view.ts:43`

**Comment-only (named in code comments, not executed)**: Bloom filter `src/muse/zgbf.ts:1`, EC point arithmetic `src/peks/core.ts:134`

**References**: Bloom filter, Boneh-Franklin IBE, Diffie-Hellman, Private information retrieval, Private set intersection, SHA-1

**Standards body**: IETF, NIST

**Implementation**: WebCrypto AES-GCM / @noble/curves BLS12-381 and ristretto255 / hand-rolled Paillier / bounded local models

**Spec citations, exactly as written**:

- `CRYPTO 2005` — first seen README.md:162 (1×)
- `CRYPTO 2013` — first seen README.md:150 (1×)
- `doi.org/10.1007/11844662_6` — first seen README.md:160 (1×)
- `ePrint 2009/593` — first seen README.md:42 (3×)
- `eprint.iacr.org/2009/593` — first seen README.md:151 (1×)
- `eprint.iacr.org/2013/169` — first seen README.md:150 (1×)
- `eprint.iacr.org/2015/668` — first seen README.md:156 (1×)
- `eprint.iacr.org/2018/090` — first seen README.md:153 (1×)
- `eprint.iacr.org/2018/1168` — first seen README.md:157 (1×)
- `EUROCRYPT 2004` — first seen README.md:38 (2×)
- `FIPS 180-4` — first seen README.md:205 (1×)
- `FIPS 198-1` — first seen README.md:19 (2×)
- `NIST SP 800-38D` — first seen README.md:22 (2×)
- `RFC 2104` — first seen README.md:19 (2×)
- `RFC 4231` — first seen README.md:203 (3×)
- `RFC 9380` — first seen README.md:38 (6×)
- `RFC 9496` — first seen README.md:27 (7×)
- `rfc9380` — first seen README.md:159 (1×)
- `rfc9496` — first seen README.md:154 (1×)

**README — What Can Go Wrong**:

```text
- **Access-pattern leakage is not a footnote.** With exact background statistics, the attack in Exhibit 4 recovers all 14 queries in tens of milliseconds. The jitter slider is a synthetic sensitivity control; no value is calibrated to realistic attacker error.
- **Volume leakage is enough on its own.** Any keyword whose document count is unique in the vocabulary is identified by result size, with no co-occurrence analysis at all. Padding result sets is the standard countermeasure, and it costs storage and bandwidth.
- **Deterministic tokens link queries over time.** The server cannot read a token, but it recognises every repeat, so it can build a per-user query-frequency profile and line it up against public word-frequency data.
- **Background similarity is an assumption to evaluate.** The adversary needs statistics for a *similar* corpus, not yours — leaked archives, public filings, and comparable organisations all supply them.
- **A static index hides an ongoing hazard.** This demo builds the index once. Adding documents later leaks whether a new document matches an earlier query unless the scheme is explicitly forward-private.
- **Tampering fails closed, and that is deliberate.** Each posting is sealed with its own address as associated data, so a server that relocates, forges or flips a row causes the whole result to be rejected rather than silently mis-answered. Six tests cover this path.
- **Authentic records can still form an incomplete or stale answer.** Omitting one valid posting leaves every returned AES-GCM ciphertext authentic; replaying a previously valid answer can also preserve record authenticity. The integrity exercise detects those cases only because the client retained an independent checkpoint for the expected answer and current snapshot. That checkpoint is intentionally a teaching construction, not a claim of a general verifiable-SSE protocol.
- **OXT changes leakage; it does not erase it.** This adapter avoids sending the full x-term posting list, but it reveals a repeatable stag for `s`, the s-list size, one candidate point and exact membership outcome per s-list row, result volume, and the final document-identifier access request. Same-x queries repeat candidate points only where their s-lists overlap; zero repeats therefore does not prove that x changed.
- **Exact XSet membership is not active result verification.** It avoids Bloom-filter false positives when the honest-but-curious server executes the lookup. AES-GCM rejects changed or relocated identifier ciphertexts, but a malicious server can still omit a valid match or falsely include an authentic s-list row that failed the x-term test. The client therefore gets neither active-server soundness/correctness nor completeness from these mechanisms; the static adapter also supplies no version/freshness proof. The complete OXT theorem is not claimed for the flat TSet substitution.
- **The ORAM comparison has a narrow trust boundary.** Padding this 24-document corpus to three logical fetches costs 144 encrypted block transfers under the displayed `Z=4`, `L=5`, one-document-per-block model. It hides final addresses and volume only from a separate non-colluding semi-honest storage server; it does not hide the OXT search transcript, query volume, or timing, and no ORAM is executed here.
- **An exposed PEKS trapdoor is a keyword oracle for a small dictionary.** Anyone with the public key and trapdoor can create a fresh tag for a candidate and invoke public `Test` locally. A secure channel can stop an outside capture, but not the search server that receives the trapdoor.
- **A bounded miss proves only a bounded miss.** If no tested candidate passes, the target may be absent or beyond the chosen bound. It does not establish trapdoor privacy or security.
- **Public writers are not authenticated.** Basic PEKS lets anyone with `X` make a tag, but does not prove a word appears in a separately encrypted body, bind tag to body, or authenticate the sender. `Test` also
```

**Claims tested** (e2e/claims.spec.ts, 17 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:26
    - :26 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:32
    - :32 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:52
    - :52 `expect` expected _no expected value_ _(none)_
- `exhibit 1: every keyword indexes to its own row count, and the 14 parts sum to the store` — e2e/claims.spec.ts:64
    - :71 `toHaveLength` expected `KEYWORD_COUNT` _(expression)_
    - :79 `expect` expected _no expected value_ _(none)_
    - :81 `expect` expected _no expected value_ _(none)_
    - :84 `expect` expected _no expected value_ _(none)_
    - :85 `toBe` expected _no expected value_ _(none)_
    - :88 `toBe` expected `'${rows} of ${rows} rows stored'` _(expression)_
    - :89 `toHaveCount` expected `rows` _(expression)_
    - :97 `toBe` expected `'${stored} rows across ${KEYWORD_COUNT} keywords and ${TOTAL_DOCS} documents'` _(expression)_
    - :100 `toBe` expected `stored` _(expression)_
    - :101 `toHaveCount` expected `stored` _(expression)_
- `exhibit 1: a row reaches the server only after its sealed value is derived` — e2e/claims.spec.ts:104
    - :119 `expect` expected _no expected value_ _(none)_
    - :120 `toBe` expected _no expected value_ _(none)_
    - :125 `toBe` expected `'Step 3 of ${steps}.'` _(expression)_
    - :126 `toBe` expected `'0 of ${postings} rows stored'` _(expression)_
    - :127 `toContainText` expected `'nothing stored yet'` _(literal)_
    - :128 `expect` expected _no expected value_ _(none)_
    - :132 `toBe` expected `'0 of ${postings} rows stored'` _(expression)_
    - :133 `toHaveCount` expected `1` _(literal)_
    - :136 `toBe` expected `'1 of ${postings} rows stored'` _(expression)_
    - :137 `toHaveCount` expected `0` _(literal)_
    - :138 `toHaveCount` expected `1` _(literal)_
    - :141 `toContainText` expected `'INDEXED'` _(literal)_
    - :142 `toHaveCount` expected `postings` _(expression)_
    - :144 `toBeDisabled` expected _no expected value_ _(none)_
    - :145 `toBeDisabled` expected _no expected value_ _(none)_
- `exhibit 2: the verdict, the client results, the access pattern and the ledger name one set` — e2e/claims.spec.ts:152
    - :160 `toContainText` expected `'ANSWERED — AND OBSERVED'` _(literal)_
    - :167 `toHaveLength` expected `claimed` _(expression)_
    - :168 `expect` expected _no expected value_ _(none)_
    - :174 `toEqual` expected `claimedIds` _(expression)_
    - :175 `toContainText` expected `'every posting authenticated under AES-GCM'` _(literal)_
    - :178 `toBe` expected `'${claimed} documents'` _(expression)_
    - :179 `toBe` expected `claimedIds.join(', ')` _(expression)_
    - :180 `toBe` expected _no expected value_ _(none)_
    - :186 `toHaveLength` expected `claimed + 1` _(expression)_
    - :187 `expect` expected _no expected value_ _(none)_
    - :188 `expect` expected _no expected value_ _(none)_
    - :191 `toBe` expected `'The server’s log — 1 queries observed'` _(literal)_
    - :193 `toHaveCount` expected `1` _(literal)_
    - :194 `toBe` expected `String(claimed)` _(expression)_
    - :195 `toBe` expected `claimedIds.join(' ')` _(expression)_
- `exhibit 2: a keyword outside the index reaches the miss path and names the keyword` — e2e/claims.spec.ts:198
    - :206 `toContainText` expected `'NO MATCH'` _(literal)_
    - :208 `expect` expected _no expected value_ _(none)_
    - :209 `expect` expected _no expected value_ _(none)_
    - :212 `toHaveText` expected `'No results'` _(literal)_
    - :213 `toContainText` expected _no expected value_ _(none)_
    - :216 `toContainText` expected `'authenticated under AES-GCM'` _(literal)_
    - :217 `toBe` expected `'0 documents'` _(literal)_
    - :218 `toBe` expected `'—'` _(literal)_
    - :221 `toHaveLength` expected `1` _(literal)_
    - :222 `expect` expected _no expected value_ _(none)_
    - :225 `toBe` expected `'The server’s log — 1 queries observed'` _(literal)_
    - :227 `toBe` expected `'0'` _(literal)_
    - :228 `toBe` expected `'—'` _(literal)_
- `exhibit 2: an empty query is refused and never reaches the server` — e2e/claims.spec.ts:231
    - :235 `toContainText` expected `'NOTHING TO SEARCH'` _(literal)_
    - :236 `expect` expected _no expected value_ _(none)_
    - :237 `toBe` expected `'The server’s log — 0 queries observed'` _(literal)_
    - :238 `toContainText` expected `'No queries observed yet.'` _(literal)_
- `exhibit 2: clearing the log empties it and retires every verdict drawn from it` — e2e/claims.spec.ts:241
    - :250 `toContainText` expected `'QUERIES RECONSTRUCTED'` _(literal)_
    - :252 `toContainText` expected `'IKK attack'` _(literal)_
    - :256 `toBe` expected `'The server’s log — 0 queries observed'` _(literal)_
    - :257 `toContainText` expected `'No queries observed yet.'` _(literal)_
    - :258 `toHaveCount` expected `0` _(literal)_
    - :259 `toContainText` expected `'NOT ENOUGH OBSERVED YET'` _(literal)_
    - :260 `toContainText` expected `'Nothing to work with yet'` _(literal)_
    - :262 `toContainText` expected `'QUERIES RECONSTRUCTED'` _(literal)_
    - :263 `toHaveCount` expected `0` _(literal)_
    - :264 `toContainText` expected `'Press “Run the attack”'` _(literal)_
    - :265 `expect` expected _no expected value_ _(none)_
    - :269 `toContainText` expected `'NOTHING TO ATTACK YET'` _(literal)_
    - :270 `expect` expected _no expected value_ _(none)_
- `exhibit 3: the exposure headline is the page’s own touched/total, and the charts agree` — e2e/claims.spec.ts:277
    - :280 `toContainText` expected `'NOT ENOUGH OBSERVED YET'` _(literal)_
    - :282 `toContainText` expected `'OF THE DATABASE HAS BEEN IN SOME RESULT SET'` _(literal)_
    - :291 `toBe` expected `TOTAL_DOCS` _(expression)_
    - :292 `toBe` expected `Math.round((touched / total) * 100)` _(expression)_
    - :293 `expect` expected _no expected value_ _(none)_
    - :296 `toBe` expected _no expected value_ _(none)_
    - :299 `toHaveCount` expected `queries` _(expression)_
    - :304 `toHaveCount` expected `tokens` _(expression)_
    - :308 `toBe` expected `queries` _(expression)_
    - :312 `toBe` expected `tokens` _(expression)_
    - :314 `toHaveCount` expected `tokens` _(expression)_
    - :315 `toHaveCount` expected `pairs` _(expression)_
    - :317 `toHaveCount` expected `pairs` _(expression)_
    - :321 `toHaveCount` expected `touched` _(expression)_
    - :341 `toBe` expected `Math.round((correct / total) * 100)` _(expression)_
    - :344 `toHaveCount` expected `total` _(expression)_
    - :352 `toBe` expected `total` _(expression)_
    - :353 `toHaveLength` expected `correct` _(expression)_
    - :358 `toHaveLength` expected `pinned` _(expression)_
    - :359 `toBe` expected `true` _(expression)_
- `exhibit 4: the headline recovery is the tally of the attack’s own per-token table` — e2e/claims.spec.ts:364
    - :368 `toBeVisible` expected _no expected value_ _(none)_
    - :374 `toBe` expected `KEYWORD_COUNT` _(expression)_
    - :375 `toBe` expected `total` _(expression)_
    - :376 `toBe` expected `100` _(literal)_
    - :379 `expect` expected _no expected value_ _(none)_
    - :382 `toContainText` expected _no expected value_ _(none)_
- `exhibit 4: degrading the adversary’s background knowledge degrades recovery` — e2e/claims.spec.ts:387
    - :390 `toHaveText` expected `'exact'` _(literal)_
    - :392 `toBeVisible` expected _no expected value_ _(none)_
    - :397 `toHaveText` expected `'±150% synthetic jitter'` _(literal)_
    - :399 `toBeVisible` expected _no expected value_ _(none)_
    - :402 `toBe` expected `exact.total` _(expression)_
    - :403 `expect` expected _no expected value_ _(none)_
- `exhibit 4: a zero-result token is excluded, and the exclusion is stated` — e2e/claims.spec.ts:406
    - :409 `toContainText` expected `'NO MATCH'` _(literal)_
    - :411 `toBeVisible` expected _no expected value_ _(none)_
    - :415 `expect` expected _no expected value_ _(none)_
    - :420 `toBe` expected `total + 1` _(expression)_
- `exhibit 5: the score counts exactly the rows it marked, and a wrong guess names the truth` — e2e/claims.spec.ts:427
    - :433 `toBeVisible` expected _no expected value_ _(none)_
    - :448 `toBe` expected `KEYWORD_COUNT` _(expression)_
    - :453 `toEqual` expected `new Set(truth.keys())` _(expression)_
    - :475 `toBe` expected `boardSize` _(expression)_
    - :476 `toBe` expected `rightIdx.length` _(expression)_
    - :477 `toBe` expected `rightIdx.length + wrongIdx.length` _(expression)_
    - :478 `toBe` expected `correct` _(expression)_
    - :484 `toHaveLength` expected `boardSize` _(expression)_
    - :485 `toHaveLength` expected `correct` _(expression)_
    - :486 `toHaveLength` expected `boardSize - answered` _(expression)_
    - :488 `toHaveLength` expected `answered - correct` _(expression)_
    - :492 `expect` expected _no expected value_ _(none)_
    - :497 `toContainText` expected `'THE PATTERN WAS THE SECRET'` _(literal)_
    - :507 `toBe` expected `'${correct} / ${boardSize}'` _(expression)_
    - :510 `toBe` expected `'${attack.correct} / ${attack.total}'` _(expression)_
    - :511 `toBe` expected _no expected value_ _(none)_
- `exhibit 5: with nothing observed the board refuses and its buttons are disabled` — e2e/claims.spec.ts:516
    - :519 `toContainText` expected `'Nothing to work with yet'` _(literal)_
    - :520 `toBeDisabled` expected _no expected value_ _(none)_
    - :521 `toBeDisabled` expected _no expected value_ _(none)_
    - :524 `toHaveCount` expected `KEYWORD_COUNT` _(expression)_
    - :525 `toBeEnabled` expected _no expected value_ _(none)_
    - :526 `toBeEnabled` expected _no expected value_ _(none)_
    - :535 `expect` expected _no expected value_ _(none)_
    - :536 `toHaveLength` expected `Number(m![1])` _(expression)_
- `exhibit 6: the per-search figure is the measured total over the measured runs` — e2e/claims.spec.ts:544
    - :552 `toBe` expected `0` _(literal)_
    - :555 `toContainText` expected `'MS PER SEARCH'` _(literal)_
    - :562 `toBe` expected `50` _(literal)_
    - :563 `expect` expected _no expected value_ _(none)_
    - :565 `expect` expected _no expected value_ _(none)_
    - :568 `toBe` expected _no expected value_ _(none)_
    - :571 `toHaveCount` expected `before + runs` _(expression)_
- `auxiliary modes expose sample size and seeded variation without retaining stale recovery` — e2e/claims.spec.ts:574
    - :577 `toBeVisible` expected _no expected value_ _(none)_
    - :579 `toHaveCount` expected `0` _(literal)_
    - :580 `toBeDisabled` expected _no expected value_ _(none)_
    - :582 `toContainText` expected `'Auxiliary sample: 12 documents'` _(literal)_
    - :583 `toContainText` expected `'Actual recovery across seeds'` _(literal)_
    - :586 `toContainText` expected `'Auxiliary sample: 64 documents'` _(literal)_

**Mutation records** (2 file(s)):

- `scripts/fuzzy-mutations.mjs` (9985 bytes)
- `scripts/muse-mutations.mjs` (10871 bytes)

<details><summary>Full README</summary>

```markdown
# Search Vault

**Single-keyword SSE · OXT conjunctions · public-key and fuzzy search · multi-user collusion**

Executable searchable encryption across five query models: a symmetric encrypted index whose access pattern enables inference attacks, a bounded OXT conjunction whose cross-tokens change the leakage, public-key searchable tags whose exposed trapdoor enables offline keyword guessing, a gram-based fuzzy index whose typo recovery exposes query-neighborhood overlap, and a multi-writer/multi-reader construction whose iterative-testing trace enables collusion.

**Live demo:** https://systemslibrarian.github.io/crypto-lab-search-vault/

---

## What It Is

An encrypted inverted index, built and searched in your browser, plus published attacks that turn its leakage back into queries. A bounded two-keyword OXT extension compares one structured conjunction with two independent SSE searches. A focused PEKS extension separates public sender, recipient, and server roles with real BLS12-381 pairings. A fuzzy-search lesson compares exact SSE with a deletion-gram candidate index and makes added similarity leakage executable. The final lesson separates writers from readers, propagates one colluding reader’s known label through a real pairing-based iterative-testing transcript, and compares that leak with a bounded two-server split.

The scheme is a single-keyword SSE construction in the Song–Wagner–Perrig (2000) / Curtmola–Garay–Kamara–Ostrovsky (SSE-1, 2006) style, with real primitives throughout:

| Value | Derivation | Primitive |
| --- | --- | --- |
| search token `t_w` | `HMAC(K_prf, "token" ‖ w)` | HMAC-SHA-256 (RFC 2104 / FIPS 198-1) |
| posting key `k_w` | `HMAC(K_enc, "posting" ‖ w)` | HMAC-SHA-256 |
| index address `addr_i` | `HMAC(t_w, "address" ‖ i)` | HMAC-SHA-256 |
| posting value | `AES-256-GCM(k_w, docId)`, AAD = `addr_i` | AES-256-GCM (NIST SP 800-38D) |
| document body | `AES-256-GCM(k_d, title ‖ body)` | AES-256-GCM |

The SSE primitives run through WebCrypto. Keys are generated per session with `crypto.getRandomValues`, held in memory, and never persisted or transmitted.

**The conjunctive extension.** Exhibit 7 accepts exactly two distinct indexed keywords joined by `AND`. In isolated state, the naïve route issues two real existing-SSE queries and intersects both complete posting lists at the client. The bounded OXT route chooses the lower-frequency term `s` from client-only corpus knowledge (ASCII order breaks ties), walks only its flat addressed TSet, and tests the other term `x` against a sorted exact XSet of canonical RFC 9496 ristretto255 encodings:

`​``text
XSet(w,id) = [F_X(w) F_I(id)]B
y(s,c,id)  = F_I(id) / F_Z(s,c) mod l
xtoken(c)   = [F_Z(s,c) F_X(x)]B
[y]xtoken   = [F_I(id) F_X(x)]B
`​``

Five independent OXT-only keys feed length-framed HMAC-SHA-256 labels, HMAC-SHA-512-to-nonzero-scalar derivation, and AES-256-GCM identifier ciphertexts. TSet scalars use canonical 32-byte little-endian encodings, and every identifier has one fixed UTF-8 byte length so ciphertext length does not distinguish document identifiers. Each keyword list is CSPRNG-shuffled before its one-based counters are bound; all 55 TSet rows are shuffled again before server insertion so setup order does not expose list boundaries. XSet membership is exact, not a Bloom filter. This is a static two-term teaching adapter, not the original paper’s optimized TSet and not a transfer of its complete proof. RFC 9496 specifies the group encoding and operations; decisional Diffie–Hellman hardness is a separate explicit assumption.

**The public-key extension.** Exhibit 8 implements an algebra-preserving Type-3 BLS12-381 adaptation of Boneh–Di Crescenzo–Ostrovsky–Persiano PEKS (EUROCRYPT 2004). With `e : G1 × G2 → GT`, the recipient chooses `x` and publishes `X = xP2`. A sender with only `X` and keyword `w` samples fresh nonzero `r`, stores `A = rP2` and `B = H2(e(H1(w), rX))`, and discards `r`. The recipient issues `T_w = xH1(w)`; the server tests whether `B = H2(e(T_w, A))`. `H1` is RFC 9380 hash-to-BLS12-381-G1 under a PEKS-specific domain, while `H2` is SHA-256 over a domain-separated, length-framed 576-byte noble Fp12 coefficient encoding.

Bilinearity proves executable correctness: `e(xH1(w), rP2) = e(H1(w), rX)`. It does **not** prove that the original symmetric-pairing BDH reduction transfers to this Type-3 adaptation. A precisely stated Type-3 hardness assumption and a separate formal reduction would be required; this lab supplies neither and makes no such security claim. The recipient, sender, server, and attacker are separate objects in one browser tab, not production network or process isolation.

**The fuzzy-search extension.** Exhibit 9 is a bounded adaptation of Li et al., IACR ePrint 2009/593, §§3.4–6 and Algorithm 2. At threshold `d`, every indexed word and query produces the set of relative-order-preserving subsequences obtained by deleting from zero through `d` characters. HMAC-SHA-256 turns each gram into a deterministic 32-byte trapdoor; every keyword–gram association carries an independently randomized AES-256-GCM payload bound to that trapdoor as associated data. The honest-but-curious server performs exact trapdoor lookups and returns encrypted candidate rows. Only the client decrypts candidate keywords, computes unit-cost Levenshtein distance, and requests documents for candidates within the threshold.

The three threshold rows are separately built alternatives, not storage that a deployment should sum. The lesson reports candidate-keyword false-positive/false-negative rates before filtering against a separately computed plaintext oracle; the two final-document columns are an oracle consistency check rather than a measured rate, because the lesson refuses to render a filtered answer that disagrees with the corpus oracle, so they can only read zero. The default `asudit` query at `d=1` recovers `audit`; at `d=2`, `lawsuit` also collides at the gram layer but its measured distance is 3, so the client filters it before requesting documents. This exact-map adapter is not the paper’s symbol trie, LSH, ranked or semantic search, or a reproduction of the paper’s deployment performance.

**The multi-user extension.** Exhibit 10 follows Van Rompay–Molva–Önen’s PoPETs 2017 keyword-access-pattern attack and the role split in their SCC 2018 MUSE construction. Writer `w` chooses `gamma_w`, reader `r` chooses `rho_r`, the writer stores `I_w(x)=e(H(x),P2^gamma_w)` with the search service, and authorization is `Delta_r,w=(P2^(1/rho_r))^gamma_w`. In the single-server route, `e(H(q)^rho_r,Delta_r,w)=I_w(q)`, so iterative testing reveals the exact matching opaque row. A server colluding with a reader who labels its own `audit` query thereby labels a target reader’s equal query and writer B’s matching row, even though the colluding reader is not authorized for writer B.

The defensive comparison executes the SCC paper’s Query Multiplexer/Data Host separation with fresh query blinding `xi`. QM transforms the blinded trapdoor with real BLS12-381 pairings and makes packed selector queries; DH blinds stored GT values by the same `xi`, builds a zero-sum garbled Bloom filter, evaluates real Paillier homomorphic selection, sanitizes each response with a fresh encryption of zero, encrypts writer ids with AES-256-GCM, and shuffles. QM learns which shuffled responses have zero-XOR shares and therefore result length, but not writer routing; DH knows response routing but lacks the Paillier decryption key and positivity. Combining both views reconstructs the association, so non-collusion is an explicit assumption rather than a hidden claim.

This is a bounded adaptation. It uses three writers, three readers, 128-bit ZGBF shares and a fresh 1024-bit teaching Paillier modulus. The latter is deliberately non-production. Recursive OT, in-line ZGBF, optimized parameters, malicious-party security, revocation, updates, network isolation and the paper’s complete proof are not reproduced. Executable algebraic correctness does not transfer the SCC 2018 proof to this Type-3/browser/Paillier adapter.

**The security model.** The server is *honest but curious*: it follows the protocol and records everything it sees. It cannot invert a token (it holds no key) and cannot read a posting or a document (AES-GCM). What it does see, by design, is the **leakage profile**:

- **search pattern** — tokens are deterministic, so repeat queries are linkable;
- **volume** — how many documents a token matches;
- **access pattern** — exactly which documents matched, because it has to hand them over.
- **fuzzy neighborhood pattern** — deterministic query bundles reveal their size, repeated trapdoors, intersections with prior bundles, matching-row volume, and the final access request.
- **keyword-access pattern in iterative MUSE** — the server sees which encrypted row each query matched, joining equal queries and equal encrypted keywords across readers and writers.

That third item is the subject of the demo. Exhibit 2 also contains a separate dishonest-server integrity exercise: it alters a copy of the real answer after the normal honest-but-curious server computes it, so learners can compare per-record authenticity with answer completeness and freshness without changing the base server model. Leakage-abuse attacks (Islam–Kuzu–Kantarcioglu, NDSS 2012; Cash–Grubbs–Perry–Ristenpart, CCS 2015) reconstruct queries from the pattern alone, given background statistics about a similar corpus. Both attacks are implemented here and run against the log the page has actually accumulated while you used it.

**Not production crypto — a teaching demo.** The SSE/OXT/fuzzy corpus is deliberately small (24 documents, 14 keywords), fuzzy thresholds are limited to 0–2, the PEKS store has six synthetic tags, and the MUSE graph has three writers and three readers, so every exercise finishes while you watch. The indexes are static and every role is co-located in one page. No JavaScript constant-time, process-isolation, malicious-party, dynamic-update, revocation, active result-soundness/correctness, completeness, freshness, or production Paillier claim is made.

---

## Exhibits

1. **Build the encrypted index** — step through one keyword becoming an encrypted inverted index, one real PRF call at a time: keyword → token → posting key → address → sealed value → a row landing in the server's store. The hex shown is the vault's own bytes, not a re-enactment. Alongside it, the server's complete store: 55 rows with nothing to say which belong together.
2. **Search it — and watch what the server learns** — run a real query and see both ends at once. The client column shows the keyword and the decrypted results; the server column shows the 32 bytes it received, the address walk it performed (`addr_0`, `addr_1`, … until a miss), and the document identifiers it returned. A running log records every query. Searching a keyword that is not indexed shows the miss path. A second integrity exercise then switches among an honest answer, omission of one authentic posting, one fabricated posting, and replay of an older snapshot. The client retains a snapshot id, expected count, and SHA-256 digest of the complete ordered encrypted answer, making visible why AES-GCM authenticity of each returned record is not the same guarantee as completeness or freshness.
3. **What the pattern alone reveals** — three views built from the log and nothing else: a query-frequency histogram (search pattern), a result-set overlap graph (access pattern), and a document co-occurrence matrix. Plus the share of the database that has appeared in some result set.
4. **Break it: turn the access pattern back into queries** — the count attack pins any token whose result size is unique in the keyword universe; the IKK attack matches the observed token co-occurrence matrix against a known corpus's matrix by simulated annealing. A slider degrades the adversary's background knowledge so you can watch recovery fall off. The per-token table reports what the adversary said, how confident it was, and what the token actually was.
5. **Your turn: you are the server** — you get the tokens, their result sizes, their overlaps, and the same public statistics the attack gets. Assign keywords to tokens by hand, score yourself, then let the machine try the same puzzle.
6. **SSE, ORAM, FHE** — what each hides and what each costs. The SSE latency column is measured in your browser on this vault; the ORAM and FHE columns are labelled as cited, order-of-magnitude figures, because this page runs neither.
7. **Two-keyword AND — naïve SSE versus bounded OXT** — execute both routes over the same corpus, inspect the exact tokens, posting sets, stag, cross-tokens, candidate points, match positions, counts and final access request, then run five controlled trace pairs that separate repeated s-term lookup from conditional candidate-point equality. A derived Path ORAM table accounts for fixed-volume protection as encrypted block transfers, not round trips.
8. **Public-key search — and the trapdoor dictionary attack** — generate a recipient key, build randomized tags using only its public key, issue and repeat a recipient trapdoor, scan every tag with public `Test`, and separate search-pattern, volume, and access leakage from an active bounded dictionary attack. Both a recovered target and an honestly worded bounded miss are executable states.
9. **Fuzzy search — typo recovery leaks a neighborhood** — run the existing exact SSE route beside three real deletion-gram indexes, vary `d` from 0 through 2, inspect storage/query/response costs and both candidate and final error rates, then compare exact-token equality with server-visible fuzzy-bundle overlap against three explicitly labelled prior queries.
10. **Multi-user search — known-query collusion versus split trust** — execute reader/writer role and authorization refusals, build an iterative-testing equality graph from real pairing matches, propagate one colluding reader’s `audit` label beyond its permission, then compare QM, DH, reader and combined views from a blinded ZGBF/Paillier run.

Plus a **scope** panel stating what is real, what is scaled down, what this does not prove, and what is deliberately out of scope.

---

## When to Use It

**Use searchable symmetric encryption when:**

- you must search a large encrypted store and per-query cost has to scale with the number of *matches*, not the size of the database;
- the threat you care about is a passive host reading data at rest, or a breach of storage;
- you can tolerate the server learning which records match a query, and you have thought about what that means for your data.

**Do NOT use it when:**

- **the query itself is the secret you must protect against the storage provider.** This is the case the demo exists to make: given background knowledge about your corpus, the access pattern can be inverted. If your queries are sensitive (a journalist's sources, a patient's diagnosis codes), SSE alone is the wrong tool — you want ORAM, or PIR, or to not outsource the index.
- you need conjunctive or ranked search and assume the leakage is unchanged. It is not; richer queries leak more.
- your index changes constantly and you have not chosen a scheme with forward and backward privacy.
- you are tempted to reach for order-preserving or deterministic encryption to make SQL work. That leaks far more than this does.

The OXT exhibit is a construction-and-leakage lesson, not a production recommendation. It supports only two-term `AND`, reveals the selected s-term lookup and list size, every membership-test position, conditional point equalities, final result volume, and requested document identifiers. The PEKS exhibit is likewise a construction-and-attack lesson. Public-key tag creation can be useful when senders must not share the recipient’s search secret, but basic PEKS adds a full tag scan, exposes deterministic trapdoors, permits offline guessing for low-entropy words, and supplies no sender authentication or tag/body binding. The fuzzy exhibit is useful for studying the accuracy/leakage trade-off of one published gram construction; it is not evidence that all fuzzy encrypted-search designs leak the same trace. The MUSE exhibit is useful for studying authorization and user/server collusion; its split-trust route is appropriate only when the QM/DH non-collusion assumption and remaining result-length leakage are credible.

---

## Live Demo

https://systemslibrarian.github.io/crypto-lab-search-vault/

You can: step the index build for any of the 14 keywords; search real and non-existent keywords and watch the server's log fill; observe a realistically skewed round; read the three SSE leakage views; run both inference attacks at any level of adversary background-knowledge error; try to deanonymise tokens yourself; time 50 searches; compare a real naïve conjunction with bounded OXT; measure five equality/intersection controls; inspect the fixed-result Path ORAM cost; build real PEKS tags, repeat a trapdoor, and run successful, absent-target, and zero-guess bounded dictionary cases; vary a fuzzy threshold and inspect real candidate, cost, error, and query-neighborhood evidence; then run a multi-user known-query attack and inspect QM, DH, reader and combined split-trust views.

---

## What Can Go Wrong

- **Access-pattern leakage is not a footnote.** With exact background statistics, the attack in Exhibit 4 recovers all 14 queries in tens of milliseconds. The jitter slider is a synthetic sensitivity control; no value is calibrated to realistic attacker error.
- **Volume leakage is enough on its own.** Any keyword whose document count is unique in the vocabulary is identified by result size, with no co-occurrence analysis at all. Padding result sets is the standard countermeasure, and it costs storage and bandwidth.
- **Deterministic tokens link queries over time.** The server cannot read a token, but it recognises every repeat, so it can build a per-user query-frequency profile and line it up against public word-frequency data.
- **Background similarity is an assumption to evaluate.** The adversary needs statistics for a *similar* corpus, not yours — leaked archives, public filings, and comparable organisations all supply them.
- **A static index hides an ongoing hazard.** This demo builds the index once. Adding documents later leaks whether a new document matches an earlier query unless the scheme is explicitly forward-private.
- **Tampering fails closed, and that is deliberate.** Each posting is sealed with its own address as associated data, so a server that relocates, forges or flips a row causes the whole result to be rejected rather than silently mis-answered. Six tests cover this path.
- **Authentic records can still form an incomplete or stale answer.** Omitting one valid posting leaves every returned AES-GCM ciphertext authentic; replaying a previously valid answer can also preserve record authenticity. The integrity exercise detects those cases only because the client retained an independent checkpoint for the expected answer and current snapshot. That checkpoint is intentionally a teaching construction, not a claim of a general verifiable-SSE protocol.
- **OXT changes leakage; it does not erase it.** This adapter avoids sending the full x-term posting list, but it reveals a repeatable stag for `s`, the s-list size, one candidate point and exact membership outcome per s-list row, result volume, and the final document-identifier access request. Same-x queries repeat candidate points only where their s-lists overlap; zero repeats therefore does not prove that x changed.
- **Exact XSet membership is not active result verification.** It avoids Bloom-filter false positives when the honest-but-curious server executes the lookup. AES-GCM rejects changed or relocated identifier ciphertexts, but a malicious server can still omit a valid match or falsely include an authentic s-list row that failed the x-term test. The client therefore gets neither active-server soundness/correctness nor completeness from these mechanisms; the static adapter also supplies no version/freshness proof. The complete OXT theorem is not claimed for the flat TSet substitution.
- **The ORAM comparison has a narrow trust boundary.** Padding this 24-document corpus to three logical fetches costs 144 encrypted block transfers under the displayed `Z=4`, `L=5`, one-document-per-block model. It hides final addresses and volume only from a separate non-colluding semi-honest storage server; it does not hide the OXT search transcript, query volume, or timing, and no ORAM is executed here.
- **An exposed PEKS trapdoor is a keyword oracle for a small dictionary.** Anyone with the public key and trapdoor can create a fresh tag for a candidate and invoke public `Test` locally. A secure channel can stop an outside capture, but not the search server that receives the trapdoor.
- **A bounded miss proves only a bounded miss.** If no tested candidate passes, the target may be absent or beyond the chosen bound. It does not establish trapdoor privacy or security.
- **Public writers are not authenticated.** Basic PEKS lets anyone with `X` make a tag, but does not prove a word appears in a separately encrypted body, bind tag to body, or authenticate the sender. `Test` also gives no completeness or freshness guarantee.
- **A trapdoor remains useful after its query.** A server can retain it and test existing and future tags. Equal-keyword tags are randomized before query, but repeated trapdoors, volume, and matching opaque identifiers remain visible after issuance.
- **A fuzzy gram hit is not yet a search result.** The `asudit`/`lawsuit` threshold-2 control is a real false-positive candidate from the listing construction. Returning it without client-side Levenshtein filtering would release documents outside the declared fuzzy predicate.
- **Opaque fuzzy bundles still reveal relations.** HMAC hides a gram’s text from a server without the key, but deterministic equality exposes bundle size, repeated grams, cross-query intersections, matching-row volume, and final document access. The default inference assumes three prior query labels became known out of band; it proves one extra neighborhood link under that assumption, not universal plaintext recovery.
- **The displayed fuzzy rates are bounded measurements.** Candidate rates cover this fixed 14-keyword vocabulary, and the final-document consistency check covers these 24 documents. They are not estimates for another corpus, and increasing `d` need not preserve their values.
- **Authorization does not erase equality leakage.** In iterative-testing MUSE, a colluding user can reveal its own query or index labels. Matching-row edges then propagate those labels to other readers and writers beyond the colluder’s permission.
- **Split trust moves the failure boundary.** QM learns result length and which shuffled replies are positive; DH knows which writer produced each reply. Either view alone omits the association in this model, but QM and DH collusion reconstructs it immediately.
- **A ZGBF can return a false positive.** It has no false negatives under the declared honest execution, but a non-member can map to a zero-XOR response. The page compares every result with its plaintext oracle and reports any measured false positive instead of replacing it with the expected answer.
- **A correct bounded run is not the SCC proof.** The browser uses Type-3 BLS12-381 and a 1024-bit Paillier teaching key, not the complete optimized construction or production parameters. Paillier is malleable and the lesson assumes honest-but-curious services; passing examples and negative controls establish this implementation’s behavior, not active-server security or general MUSE security.

---

## Real-World Usage

Searchable encryption is what gets deployed when fully homomorphic encryption is too slow, which is nearly always. Variants appear in encrypted-database products, encrypted-search appliances, and client-side-encrypted note and mail services that still offer a search box. The academic line runs Song–Wagner–Perrig (2000) → Curtmola et al.'s SSE-CKA security definitions (2006) → the OXT conjunctive scheme of Cash–Jarecki–Jutla–Krawczyk–Roşu–Steiner (2013) → the leakage-abuse attacks that reshaped the field's expectations (Islam–Kuzu–Kantarcioglu 2012, Cash–Grubbs–Perry–Ristenpart 2015) → forward- and backward-private dynamic schemes designed in their wake.

The lasting lesson is the one this demo is built around: for SSE, **the leakage profile is the security model.** A scheme is not "secure" or "insecure" in the abstract — it is secure *relative to a stated leakage function*, and whether that leakage is acceptable is a question about your data and your adversary, not about the cryptography.

For PEKS, public encryption changes who may create searchable data, not whether query artifacts need a threat model. Basic PEKS tags do not encrypt the body, authenticate the sender, hide the post-query access pattern, or protect a low-entropy exposed trapdoor from public guess verification.

For fuzzy encrypted search, typo tolerance introduces a second selection layer: a server-side candidate mechanism followed by a client-side predicate. The two layers can have different error profiles, and the larger deterministic query transcript can expose similarity even when the underlying exact tokens would only expose equality.

For multi-user encrypted search, access control and query privacy are separate obligations. A reader can be correctly denied writer B while a colluding server still uses equality edges through writer A to label that reader’s query and writer B’s matching ciphertext. Splitting query transformation from index hosting removes that particular combined view only while the two service roles remain non-colluding and the construction’s remaining leakage—here public authorization and QM-visible result length—is acceptable.

### Primary sources and construction boundary

- Cash, Jarecki, Jutla, Krawczyk, Roşu, and Steiner, [*Highly-Scalable Searchable Symmetric Encryption with Support for Boolean Queries*](https://eprint.iacr.org/2013/169), CRYPTO 2013 — OXT construction, cross-tags, and conjunctive-search leakage basis.
- Li, Wang, Wang, Cao, Ren, and Lou, [*Enabling Efficient Fuzzy Keyword Search over Encrypted Data in Cloud Computing*](https://eprint.iacr.org/2009/593), ePrint 2009/593 / INFOCOM 2010 — §3.4’s edit-distance definition, §4.2 Algorithm 2’s deletion-gram sets, §5.1’s listing route, and §6’s completeness, false-positive, and fuzzy query-overlap trace. This lab uses an exact-map HMAC/AES-GCM adapter rather than reproducing the paper’s trie or performance evaluation.
- Van Rompay, Molva, and Önen, [*A Leakage-Abuse Attack Against Multi-User Searchable Encryption*](https://petsymposium.org/popets/2017/popets-2017-0034.pdf), PoPETs 2017(3), §§3.1–4.2 and Figure 2 — iterative testing, the keyword-access-pattern equivalence graph, user/server collusion and known-label propagation.
- Van Rompay, Molva, and Önen, [*Secure and Scalable Multi-User Searchable Encryption*](https://eprint.iacr.org/2018/090), SCC 2018, §§2–7 and Appendices A–C — reader/writer roles, leakage, BLS pairing transformation, ZGBF, additively-homomorphic OT shape, response unlinkability and the QM/DH non-collusion model. Exhibit 10 is the bounded adaptation described above, not the complete optimized scheme or a transferred proof.
- [RFC 9496](https://www.rfc-editor.org/rfc/rfc9496.html), especially Appendix A — ristretto255 encodings, valid multiples, and invalid-encoding rejection cases pinned by the tests. The RFC does not prove DDH.
- Stefanov et al., [*Path ORAM: An Extremely Simple Oblivious RAM Protocol*](https://people.csail.mit.edu/devadas/pubs/PathORAMJACM.pdf) — the path, bucket, position-map, and stash model behind the derived transfer table.
- Cash et al., [*The Fallacy of Composition of Oblivious RAM and Searchable Encryption*](https://eprint.iacr.org/2015/668) — why a separate ORAM store does not erase the search server’s transcript and why non-collusion is an assumption.
- Lai et al., [*Result Pattern Hiding Searchable Encryption for Conjunctive Queries*](https://eprint.iacr.org/2018/1168) — related OXT/HXT leakage terminology. This lab does not conflate HXT’s keyword-pair result pattern with every OXT result observation.
- Boneh, Di Crescenzo, Ostrovsky, and Persiano, [*Public Key Encryption with Keyword Search*](https://web.cs.ucla.edu/~rafail/PUBLIC/61.pdf), EUROCRYPT 2004 — original `KeyGen`, `PEKS`, `Trapdoor`, and `Test` construction and security game.
- [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380.html), especially §8.8 and Appendix J.9.1 — BLS12-381 hash-to-curve suite and the unit-test point.
- Byun et al., [*Off-Line Keyword Guessing Attacks on Recent Keyword Search Schemes over Encrypted Data*](https://doi.org/10.1007/11844662_6), 2006 — low-entropy keyword-space attack boundary.
- Rhee, Susilo, and Kim, [*Secure searchable public key encryption scheme against keyword guessing attacks*](https://www.jstage.jst.go.jp/article/elex/6/5/6_5_237/_pdf), 2009 — explicit public-PEKS-then-`Test` offline attack used here.
- Abdalla et al., [*Searchable Encryption Revisited: Consistency Properties, Relation to Anonymous IBE, and Extensions*](https://www.iacr.org/cryptodb/archive/2005/CRYPTO/927/927.pdf), CRYPTO 2005 — computational consistency and the anonymous-IBE relation.
- IRTF CFRG, [*Pairing-Friendly Curves* Internet-Draft](https://datatracker.ietf.org/doc/draft-irtf-cfrg-pairing-friendly-curves/) — work-in-progress concrete estimate near 126 bits for BLS12-381. The lab deliberately makes no exact 128-bit claim.

The original Boneh et al. PEKS paper uses a symmetric pairing. This implementation instead follows the algebra in Type-3 groups because BLS12-381 has no efficient G1↔G2 isomorphism. That engineering adaptation preserves the demonstrated correctness equation; it is not presented as inheriting the paper’s proof.

---

## How to Run Locally

`​``bash
npm install
npm run dev          # http://localhost:5173
npm test             # unit tests, including the spec KATs
npm run build        # typecheck + production build
npm run test:mutations # clean baselines plus 33 fuzzy/MUSE source mutations
npm run test:a11y    # axe-core WCAG 2.1 AA gate against the production build
npm run test:e2e     # the same Playwright run, including the functional claims suite
`​``

Both Playwright scripts build first and start `vite preview` on port **4237** automatically, so what is scanned and driven is what ships.

---

## Related Demos

- [crypto-lab-oram-vault](https://systemslibrarian.github.io/crypto-lab-oram-vault/) — Path ORAM: hiding the access pattern this demo leaks.
- [crypto-lab-psi-gate](https://systemslibrarian.github.io/crypto-lab-psi-gate/) — private set intersection: computing on two private sets without revealing the non-matching elements.
- [crypto-lab-fhe-arena](https://systemslibrarian.github.io/crypto-lab-fhe-arena/) — fully homomorphic encryption: the expensive end of the same trade-off.
- [crypto-lab-ibe-gate](https://systemslibrarian.github.io/crypto-lab-ibe-gate/) — the related Type-3 pairing identity in executable Boneh–Franklin IBE.
- [crypto-lab-pairing-gate](https://systemslibrarian.github.io/crypto-lab-pairing-gate/) — BLS12-381 pairing and RFC 9380 foundations.

---

## Build & Verify

**232 unit tests in 23 files**, all passing, run by `npm test` and gating the deploy. Exhibit 9 adds 29 tests for the published gram example, bounded exhaustive completeness, cross-checks between distinct rolling-row and full-matrix Levenshtein implementations, index/query/response accounting, candidate filtering, final-document equality and server-bound access requests, retained opaque query bundles, server-visible overlap inference, invalid input, ciphertext binding, and isolated transcripts. Exhibit 10 adds 23 tests for pairing delegation, atomic authorization, known-label propagation, Paillier packing and selector randomization, ZGBF construction and aborts, split-server views, fresh query bytes, result-envelope binding, role separation, and a plaintext result oracle. Two clean-baseline mutation gates then apply 33 concrete source faults one at a time, require each named owning test to fail, restore exact source bytes, and re-run each unmodified baseline.

**19 published positive known-answer cases plus all 29 RFC 9496 invalid encodings:**

| File | Vectors |
| --- | --- |
| `src/core/prf.test.ts` | 6 × HMAC-SHA-256 from RFC 4231 §4 (cases 1, 2, 3, 4, 6, 7) |
| `src/core/prf.test.ts` | 1 × untruncated HMAC-SHA-512 from RFC 4231 §4.2 |
| `src/core/prf.test.ts` | 3 × SHA-256 from FIPS 180-4 (empty, `"abc"`, the 448-bit two-block message) |
| `src/core/aead.test.ts` | 2 × AES-256-GCM from the GCM specification's vector set (test cases 13 and 14), checked in both directions |
| `src/oxt/core.test.ts` | 6 × RFC 9496 Appendix A.1 ristretto255 multiples (`B[0]`, `B[1]`, `B[2]`, `B[6]`, `B[10]`, `B[15]`) plus all 29 Appendix A.2 invalid encodings |
| `src/peks/core.test.ts` | 1 × RFC 9380 Appendix J.9.1 BLS12381G1 hash-to-curve point, checked in both affine coordinates |

Beyond the KATs, the suite covers: index construction (one posting per keyword–document pair, distinct pseudorandom addresses, no two identical ciphertexts); search correctness for every keyword in the corpus; the miss path for unindexed keywords and random tokens; six SSE fail-closed cases; what the server's ledger does and does not record; leakage computations and inference attacks; and the query-integrity checkpoint. OXT tests independently pin the `F_X=2`, `F_I=3`, `F_Z=5` cancellation transcript; exercise wide little-endian scalar reduction and forced-zero retry; require 55 unique flat TSet rows and 55 sorted exact XSet elements; verify every one of the 91 keyword pairs in both operand orders against plaintext; reject unsupported grammar before a transcript; check the three required leakage controls plus repeated-s and identical-query cases; authenticate, bind, and corpus-check result identifiers; demonstrate why an authentic s-list row is not an active-server x-membership proof; and derive all four Path ORAM padding cases. PEKS tests pin an independently derived fixed `x=7, r=11` transcript; verify the two pairing routes and full H2 digest; require randomized equal-keyword tags; reject wrong keywords, foreign recipients, tampered digests, identity, malformed, non-canonical, and non-subgroup point encodings; prove the server record shape contains no keyword, scalar, randomness, body, or demo GT element; and exercise recovered, absent, truncated, zero-bound, normalized-duplicate, and wrong-recipient dictionaries.

**Functional browser gate:** `e2e/claims.spec.ts` drives the production build and asserts each SSE number against other rendered evidence rather than constants. `e2e/query-integrity.spec.ts` separately drives all four integrity cases plus unindexed-keyword refusal. `e2e/oxt.spec.ts` cross-checks rendered query volumes and counts against actual rows and match badges, measures naïve repeat-token flags, compares every full stag/xtoken/candidate byte under reversed operands, requires invalid input to clear evidence, distinguishes parser rejection from crypto execution failure, pins all five controlled traces and all four ORAM rows, and proves an in-flight completion cannot restore stale evidence. `e2e/peks.spec.ts` proves the sender/server record counts agree, repeated-word tag bytes differ in that measured run, every server tag receives `Test`, matched rows equal the verdict and ledger, repeated trapdoors match in all 48 bytes, the attack headline equals its first passing row, bounded misses make no security claim, build failure keeps dependent controls disabled, an in-flight attack cannot restore evidence after its trapdoor is retired, and a rebuild retires all prior-key evidence. `e2e/fuzzy.spec.ts` independently recomputes deletion grams, edit distances, threshold candidate sets, storage rows, response hits, and error rates; verifies the threshold-2 false positive is filtered before document access; and exercises zero-threshold, invalid-input, retired-evidence, and in-flight stale-completion controls. `e2e/muse.spec.ts` derives the authorized matching rows from the rendered plaintext oracle, checks that every rejected operation leaves the transcript unchanged, follows the known-label equality class, reconciles result/false-positive rows with shuffled response positivity, checks the explicit combined-server failure view, compares full repeated-query bytes, and exercises key-generation failure. Uncaught page or console errors fail the run.

**Accessibility gate:** `@axe-core/playwright` scans the production build for WCAG 2.1 A/AA violations in the supported dark theme at desktop and 380px. The shared drive scans 44 learner states per viewport, including OXT arrival, valid and reversed queries, rejected grammar, controlled traces, the PEKS arrival/build/query/repeat/attack states, five fuzzy-search success/control/error states, and the generated MUSE role, attack, split-view and collusion evidence. Arithmetic text and control contrast, non-text contrast ratchets, keyboard-reachable scrollers, focus visibility, reduced motion, unique landmarks, and horizontal reflow are separate enforced oracles. Zero new violations are required; a regression blocks deployment.

---

## Performance

Search is fast because SSE lets the server do an ordinary index lookup: the work is proportional to the number of matching documents, not the size of the database. Exhibit 6 measures it live — 50 full searches, each covering token derivation, address probing, AES-GCM posting decryption and document fetch — and reports the per-search figure for your browser. On a modern laptop it lands in the low single-digit milliseconds.

The attacks are comparably cheap: the count attack is a table lookup, and the IKK annealing (8 restarts × 12,000 iterations, plus a greedy polish) resolves 14 tokens in tens of milliseconds. Being cheap to attack is the point.

The bounded OXT query walks only the selected s-term list and performs one ristretto255 multiplication plus one exact XSet lookup per row. That is a teaching-workload statement, not a deployment benchmark or a claim about the paper’s optimized TSet. The Path ORAM table is derived arithmetic only: 48 encrypted block transfers per logical fetch and 144 after padding to three fetches under the displayed assumptions.

Basic PEKS has a different cost: this exhibit runs one pairing-based `Test` for every stored tag, so query work is proportional to the tag store rather than the number of matches. Each offline guess also constructs a real randomized tag and runs `Test`; the dictionary is deliberately small and the UI yields between guesses. No deployment-scale timing claim is made.

The fuzzy threshold ledger measures the current browser session’s real index associations, bytes, trapdoor count, exact-map lookups, returned rows, response bytes, and bounded error rates. On this vocabulary the three alternative indexes contain 14, 109, and 401 keyword–gram associations for `d=0,1,2`; those counts are test fixtures for this corpus, not an asymptotic or deployment benchmark.

The MUSE run generates one teaching Paillier key, performs real BLS12-381 pairings for three writers, builds one 64-cell ZGBF per requested index twice, and evaluates packed selectors. That bounded workload is intentionally small; no deployment latency, asymptotic improvement, or production-parameter claim is made.

---

*Part of the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Auxiliary-corpus sensitivity

[Revisiting the attacker’s knowledge in inference attacks against SSE](https://arxiv.org/abs/2504.09879), 14 April 2025, ACNS 2025, studies auxiliary-data similarity and sample size. Exhibit 4 now separates exact-target statistics, arbitrary statistic jitter, and independently sampled modeled corpora (64 documents, 12 from the same auxiliary generator, or a declared payroll-heavy distribution shift). Counts and co-occurrences come jointly from each corpus; counts are rescaled to the public target size for the count attack. The fixed handwritten target is not asserted to be drawn from that generator. Matrix RMSE and three actual seeded recovery results are evaluation metrics, not attacker inputs or a replication of the paper. Annealing is heuristic: no monotonic recovery guarantee, realistic-error calibration, or general SSE safety threshold is claimed.

```

</details>

---

## Shelf Oracle

- **slug**: `crypto-lab-shelf-oracle`
- **repo**: https://github.com/systemslibrarian/crypto-lab-shelf-oracle
- **live**: https://systemslibrarian.github.io/crypto-lab-shelf-oracle/
- **commit_sha**: `a37363270b71f552238147d4cd66717f7027c4c2` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PRIVACY  ·  **level**: advanced  ·  **--accent**: #9f88ff
- **MISSING FIELDS**: verification

**Name (H1)**: Shelf Oracle  — _read from index.html_

**Subtitle**: Single-server PIR · RLWE/BFV · query expansion · stateful preprocessing  — _read from index.html_

**Description**: Encrypt a one-hot selection vector under BFV, then compress 64 selectors into four fixed ciphertext blocks and execute their Galois-key expansion. Watch one server scan every record without learning the selected block or index, and account for serialized bytes, major operations and the measured invariant-noise budget. Then trade a full client setup stream and retained private state for an eight-record online parity query, and exercise refresh, loss and database-update boundaries.  — _read from index.html_

**Why it matters**: Two-server PIR gives you privacy no computer can break — as long as the two operators never compare notes. Removing that assumption is possible, and this is what removing it costs. The BFV paths scan every record and spend a finite noise budget; the stateful path instead streams the public database during setup and retains private one-use state.  — _read from index.html_

**Card copy**: Compare direct and compressed full-scan BFV with a separate bounded Piano-style stateful route: client setup streams the database, retains private hints, and reduces online work to eight record probes while exposing refresh, loss and update costs.

**Chips**: BFV · RLWE · Query Expansion · Noise Budget · Stateful PIR

**Implements**: BFV `src/pir/bfv.ts:88`, ChaCha20 `src/pir/chacha20.ts:123`, NTT `src/pir/ntt.ts:61`, Private information retrieval `src/pir/pir.ts:191`, Ring-LWE `src/pir/bfv.ts:88`, SHA-256 `src/pir/records.ts:80`

**Attacks shown**: _none derived_

**Comment-only (named in code comments, not executed)**: Gaussian mechanism `src/pir/params.ts:55`, Kyber `src/pir/rng.ts:122`, Poly1305 `src/pir/chacha20.ts:24`

**References**: BGV, LWE, Poly1305, Private set intersection

**Standards body**: IETF, NIST

**Implementation**: hand-rolled direct/compressed BFV PIR, bounded Piano-style stateful PIR, NTT and ChaCha20; WebCrypto SHA-256

**Spec citations, exactly as written**:

- `10.1137/23M1598507` — first seen README.md:163 (1×)
- `doi.org/10.1137/23M1598507` — first seen README.md:117 (2×)
- `ePrint 2012/144` — first seen README.md:25 (4×)
- `ePrint 2017/1142` — first seen README.md:159 (1×)
- `ePrint 2022/081` — first seen README.md:161 (1×)
- `ePrint 2022/1703` — first seen README.md:163 (1×)
- `ePrint 2023/452` — first seen README.md:116 (4×)
- `ePrint 2024/1587` — first seen README.md:160 (1×)
- `ePrint 2026/2546` — first seen README.md:85 (1×)
- `eprint.iacr.org/2012/144` — first seen README.md:158 (1×)
- `eprint.iacr.org/2017/1142` — first seen README.md:159 (2×)
- `eprint.iacr.org/2022/081` — first seen README.md:65 (3×)
- `eprint.iacr.org/2022/1703` — first seen README.md:163 (1×)
- `eprint.iacr.org/2023/452` — first seen README.md:23 (4×)
- `eprint.iacr.org/2024/1587` — first seen README.md:160 (2×)
- `eprint.iacr.org/2026/2546` — first seen README.md:85 (2×)
- `EUROCRYPT 2022` — first seen README.md:115 (2×)
- `RFC 8439` — first seen README.md:156 (11×)

**Stated limitations (page)**:

- _(scope-note, index.html)_ Not production cryptography. This is a teaching implementation: schoolbook record products, exact NTT/CRT only for dense expansion-key products, no constant-time discipline, the secret key in ordinary browser memory, and a 64-record shelf. Both "servers" are objects in this page — no network is involved. What is real is the mathematics and state transition: every ciphertext, substitution, key switch, homomorphic multiply, parity, refresh and noise measurement on this page is computed, not scripted.

**README — What Can Go Wrong**:

```text
- **Decryption-feedback research — 20 October 2026.** Ordinary encryption security (IND-CPA), correct decryption, and security when an adversary learns computation results (IND-CPA-D) are different guarantees. Choe, Kang and Stehlé report attacks on particular BFV/BGV configurations using heuristic correctness assumptions, with experiments in OpenFHE and HElib. Crafted operations can exceed heuristic noise bounds; two attacks recover keys, while a third breaks indistinguishability. Parameter tables and noise estimates alone do not establish security in this feedback model. This browser lab does not reproduce those attacks or establish that its implementation is vulnerable. [Choe, Kang and Stehlé, *New IND-CPA-D Attacks on BFV and BGV*, ePrint 2026/2546](https://eprint.iacr.org/2026/2546), received 19 October and revised 20 October 2026; accepted to ACM CCS 2026. **Demonstrated results; attack-model-conditional.**

The threat models, failure states and recovery boundaries.

**Who the adversary is.** An *honest-but-curious* server that follows the selected protocol and tries to learn the index from what it receives, plus a *passive network observer* that sees traffic but no plaintext. Privacy against the server is **computational**. The BFV routes rest on decision-RLWE, with the compressed route's additional circular-security assumption; the stateful route rests on pseudorandom secret coordinates and correct one-use client state. These are separate models, not interchangeable evidence.

**What breaks it.**

- **`NOISE_BUDGET_EXHAUSTED`** — every record folded into the answer contributes its own encryption error, including the ones multiplied by an encrypted zero. Past the ceiling the answer still decrypts; it decrypts to garbage. The page detects it three ways, and reports them separately because only two are things a real client could do: the record's own SHA-256 tag fails, coefficients come back outside `[0, 16)` where the encoder can never put them, and — using the secret key and the true record, which a real client has neither of — the measured budget reaches zero. **A deployment sizes its parameters in advance; it does not discover exhaustion at runtime.**
- **`PARAM_UNSAFE`** — the modulus bit length exceeds the cited HES 2018 128-bit-row ceiling for this ring degree, or would push this implementation past 2⁵³ where JavaScript integers stop being exact. The first means even the page's limited reference comparison no longer applies; it does not by itself prove insecurity. The second is more immediate: past that bound JavaScript arithmetic is not exact, so the demo could produce plausible garbage while claiming exactness.
- **`DIM_MISMATCH`** — the query is not the same length as the shelf. Refused **before any homomorphic work**, because a short query answers over a prefix and a long one reads past the end, and both return a ciphertext that decrypts to something.
- **`INDEX_OUT_OF_RANGE`** — the requested shelf position does not exist.

The stateful path reports its own state-machine failures rather than borrowing BFV's noise codes. `WINDOW_EXHAUSTED` requires a new setup epoch; `STATE_LOST`, `DATABASE_UPDATED` and `ROLLBACK_DETECTED` say why old private state cannot safely answer; and `MALFORMED_RESPONSE` and `REQUEST_ABANDONED` consume the committed request and invalidate the epoch instead of rolling it back. `HINT_UNAVAILABLE`, `NO_COVER_TARGET` and `STATE_INVALID` are defensive fail-closed guards if an internal invariant is ever broken, not naturally exhausted paths in the canonical fixed model: eight one-use targets in a chunk have eight refresh slots, while a 33-commit window cannot consume all 64 cover targets. Preflight failures still send one random index per chunk and accept a 512-byte response before reporting the local error, so a different error-shaped request is not introduced. That fixed shape is not availability: without the retained private state, the response cannot recover the requested record.

**What th
```

**Claims tested** (e2e/claims.spec.ts, 46 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:47
    - :47 `toHaveCount` expected `64` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:52
    - :52 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:53
    - :53 `expect` expected _no expected value_ _(none)_
- `the page tells the truth about what it retrieved` — e2e/claims.spec.ts:56
- `CROSS-CHECK: the record the fold returns is the record the shelf shows` — e2e/claims.spec.ts:57
    - :64 `expect` expected _no expected value_ _(none)_
    - :68 `toBeVisible` expected _no expected value_ _(none)_
    - :73 `toBe` expected `shelfText` _(expression)_
    - :74 `toContainText` expected _no expected value_ _(none)_
- `CROSS-CHECK: the fold and the exhaustion panel agree on the budget ceiling` — e2e/claims.spec.ts:79
    - :95 `toBeCloseTo` expected `parseFloat(noiseCeiling), 2` _(expression)_
- `INDEPENDENT RE-DERIVATION: the ceiling is log2(floor(q/t)) from the printed ring` — e2e/claims.spec.ts:98
    - :112 `toBe` expected `1024` _(literal)_
    - :113 `expect` expected _no expected value_ _(none)_
    - :114 `toBe` expected `17` _(literal)_
    - :123 `toBeCloseTo` expected `Math.log2(Math.floor(q / t)), 2` _(expression)_
- `INDEPENDENT RE-DERIVATION + PARTS-SUM-TO-WHOLE: the query is N ciphertexts` — e2e/claims.spec.ts:126
    - :155 `toBeCloseTo` expected `derived, -1` _(expression)_
    - :159 `toBe` expected `64` _(literal)_
    - :160 `toBeCloseTo` expected `tiles, 0` _(expression)_
- `CROSS-CHECK: the head-to-head upload matches the Server’s View query size` — e2e/claims.spec.ts:163
    - :177 `toBeVisible` expected _no expected value_ _(none)_
    - :184 `toBeCloseTo` expected `fromServerView, -1` _(expression)_
    - :188 `toBe` expected `2 * Math.ceil(64 / 8)` _(expression)_
- `the collusion attack names the position that was actually selected` — e2e/claims.spec.ts:191
    - :194 `toContainText` expected `'Position 41'` _(literal)_
    - :198 `toBeVisible` expected _no expected value_ _(none)_
    - :200 `toContainText` expected `'position 41'` _(literal)_
- `compressed-query expansion is executed and costed from this implementation` — e2e/claims.spec.ts:204
    - :209 `expect` expected _no expected value_ _(none)_
    - :216 `toContainText` expected _no expected value_ _(none)_
    - :219 `expect` expected _no expected value_ _(none)_
- `CROSS-CHECK: direct, expanded and shelf routes return the same selected record` — e2e/claims.spec.ts:222
    - :228 `expect` expected _no expected value_ _(none)_
    - :236 `toContainText` expected _no expected value_ _(none)_
    - :242 `toBe` expected `shelfText` _(expression)_
    - :248 `toContainText` expected `'Plain record: ${shelfText}'` _(expression)_
    - :249 `toContainText` expected `'Direct route: ${shelfText}'` _(expression)_
    - :250 `toContainText` expected `'Compressed route, selected response: ${shelfText}'` _(expression)_
    - :251 `toContainText` expected _no expected value_ _(none)_
- `INDEPENDENT RE-DERIVATION: wire bytes, substitutions, operations and noise match the run` — e2e/claims.spec.ts:256
    - :286 `toBe` expected `4 * ciphertextBytes` _(expression)_
    - :287 `toBe` expected `64 * ciphertextBytes` _(expression)_
    - :288 `toBe` expected `ciphertextBytes` _(expression)_
    - :289 `toBe` expected `4 * ciphertextBytes` _(expression)_
    - :292 `toHaveCount` expected `4` _(literal)_
    - :296 `toBe` expected `16 + 4 * (2 + digits * ciphertextBytes)` _(expression)_
    - :297 `toBe` expected `evaluationKeys + compressedUpload` _(expression)_
    - :308 `toBe` expected `n / inputs + 1` _(expression)_
    - :309 `toBe` expected `'${inputs} → ${inputs * 2}'` _(expression)_
    - :310 `toBe` expected `inputs` _(expression)_
    - :311 `toBe` expected `inputs * digits * 2` _(expression)_
    - :313 `toBe` expected `2 * inputs` _(expression)_
    - :314 `toBe` expected `2 * inputs` _(expression)_
    - :318 `toBe` expected `15` _(literal)_
    - :319 `toBe` expected `15 * digits * 2` _(expression)_
    - :322 `toBe` expected `'64'` _(literal)_
    - :323 `toBe` expected `'4'` _(literal)_
    - :324 `toBe` expected `'64'` _(literal)_
    - :325 `toBe` expected `'64'` _(literal)_
    - :326 `toBe` expected `4 * totalSwitches` _(expression)_
    - :327 `toBe` expected _no expected value_ _(none)_
    - :336 `toBe` expected `Math.floor(evaluationKeys / (directUpload - compressedUpload)) + 1` _(expression)_
    - :347 `expect` expected _no expected value_ _(none)_
    - :348 `expect` expected _no expected value_ _(none)_
    - :350 `toContainText` expected `'does not claim sublinear server work'` _(literal)_
    - :351 `toContainText` expected _no expected value_ _(none)_
    - :354 `toContainText` expected `'Discarded one-response trial'` _(literal)_
    - :355 `toContainText` expected _no expected value_ _(none)_
    - :358 `expect` expected _no expected value_ _(none)_
- `stateful preprocessing PIR executes the claims it prints` — e2e/claims.spec.ts:364
- `INDEPENDENT RE-DERIVATION: the fixed wire and both displayed equations match the run` — e2e/claims.spec.ts:386
    - :400 `toHaveLength` expected `8` _(literal)_
    - :402 `toBe` expected `true` _(expression)_
    - :403 `toBe` expected `chunk` _(expression)_
    - :405 `expect` expected _no expected value_ _(none)_
    - :412 `expect` expected _no expected value_ _(none)_
    - :423 `toHaveLength` expected `32` _(literal)_
    - :425 `toBe` expected `recovery[24 + i]` _(expression)_
    - :430 `toHaveLength` expected `24` _(literal)_
    - :432 `toBe` expected `refresh[16 + i]` _(expression)_
    - :434 `toContainText` expected _no expected value_ _(none)_
    - :437 `toContainText` expected _no expected value_ _(none)_
    - :440 `toContainText` expected _no expected value_ _(none)_
    - :443 `expect` expected _no expected value_ _(none)_
- `CROSS-CHECK: a cached repeat spends a distinct target and survives unrelated panel renders` — e2e/claims.spec.ts:446
    - :461 `expect` expected _no expected value_ _(none)_
    - :464 `expect` expected _no expected value_ _(none)_
    - :470 `toBe` expected `firstEffective` _(expression)_
    - :471 `toBe` expected `'2'` _(literal)_
    - :472 `toBe` expected `'2'` _(literal)_
    - :473 `expect` expected _no expected value_ _(none)_
    - :477 `toBe` expected `'2'` _(literal)_
    - :478 `toBe` expected `'cached-cover'` _(literal)_
- `FAILURE EVIDENCE: a retained non-target update corrupts stale recovery before detection, then rebuilds` — e2e/claims.spec.ts:481
    - :490 `toContainText` expected _no expected value_ _(none)_
    - :502 `expect` expected _no expected value_ _(none)_
    - :510 `toHaveCount` expected `2` _(literal)_
    - :511 `toContainText` expected _no expected value_ _(none)_
    - :514 `toContainText` expected _no expected value_ _(none)_
    - :517 `toHaveText` expected `'DATABASE_UPDATED:'` _(literal)_
    - :518 `expect` expected _no expected value_ _(none)_
    - :523 `toHaveText` expected `'1'` _(literal)_
    - :524 `toHaveText` expected `'8 B'` _(literal)_
    - :525 `toHaveText` expected `'512 B'` _(literal)_
    - :526 `toContainText` expected `'32768 B'` _(literal)_
    - :529 `expect` expected _no expected value_ _(none)_
    - :536 `toContainText` expected _no expected value_ _(none)_
    - :539 `expect` expected _no expected value_ _(none)_
- `INDEPENDENT RE-DERIVATION: the finite bound, crossover, codec and source limits are exact` — e2e/claims.spec.ts:542
    - :550 `expect` expected _no expected value_ _(none)_
    - :556 `toBeCloseTo` expected `independentlyDerived, 18` _(expression)_
    - :557 `toBeCloseTo` expected `Math.log2(independentlyDerived), 2` _(expression)_
    - :558 `expect` expected _no expected value_ _(none)_
    - :561 `toHaveCount` expected `3` _(literal)_
    - :570 `toBe` expected `64 * 512` _(expression)_
    - :571 `toBe` expected `queryCount * (8 + 512)` _(expression)_
    - :572 `toBe` expected `setup + online` _(expression)_
    - :573 `toBe` expected `queryCount * 64 * 512` _(expression)_
    - :575 `toContainText` expected _no expected value_ _(none)_
    - :583 `toContainText` expected `'uint64/protobuf'` _(literal)_
    - :584 `toContainText` expected `'O(N^ε) preprocessing-update time'` _(literal)_
    - :585 `toContainText` expected _no expected value_ _(none)_
    - :588 `toHaveCount` expected `1` _(literal)_
    - :589 `expect` expected _no expected value_ _(none)_
    - :594 `toHaveCount` expected `1` _(literal)_
    - :595 `toHaveCount` expected `1` _(literal)_
- `the failure paths fire, and the page names the actual cause` — e2e/claims.spec.ts:599
- `NOISE_BUDGET_EXHAUSTED is real: the same click succeeds at 2^26 and fails at 2^18` — e2e/claims.spec.ts:600
    - :609 `toBeVisible` expected _no expected value_ _(none)_
    - :611 `toBe` expected `truth` _(expression)_
    - :616 `toHaveText` expected _no expected value_ _(none)_
    - :620 `toBe` expected `truth` _(expression)_
    - :624 `toMatch` expected `/integrity tag broken/` _(regex)_
    - :625 `expect` expected _no expected value_ _(none)_
    - :639 `toBe` expected `true` _(expression)_
    - :640 `expect` expected _no expected value_ _(none)_
- `DIM_MISMATCH names both lengths, and they match the shelf on screen` — e2e/claims.spec.ts:643
    - :648 `expect` expected _no expected value_ _(none)_
    - :655 `toBe` expected `shelfValue` _(expression)_
    - :656 `toBe` expected `Math.floor(shelfValue / 2)` _(expression)_
- `INDEX_OUT_OF_RANGE names the range the shelf actually has` — e2e/claims.spec.ts:659
    - :664 `expect` expected _no expected value_ _(none)_
    - :666 `expect` expected _no expected value_ _(none)_
- `PARAM_UNSAFE fires from both routes: the table and the exactness guard` — e2e/claims.spec.ts:669
    - :676 `toContainText` expected `'PARAM_UNSAFE'` _(literal)_
    - :681 `toContainText` expected _no expected value_ _(none)_
    - :684 `toContainText` expected _no expected value_ _(none)_
    - :691 `expect` expected _no expected value_ _(none)_
    - :698 `expect` expected _no expected value_ _(none)_
    - :699 `expect` expected _no expected value_ _(none)_
- `the parameter verdict flips both ways with the modulus` — e2e/claims.spec.ts:702
    - :705 `toContainText` expected _no expected value_ _(none)_
    - :709 `toContainText` expected `'PARAM_UNSAFE'` _(literal)_
    - :711 `toContainText` expected _no expected value_ _(none)_
- `the six-sigma prediction is below the measured budget, as a bound must be` — e2e/claims.spec.ts:716
    - :722 `toBeVisible` expected _no expected value_ _(none)_
    - :735 `expect` expected _no expected value_ _(none)_
    - :736 `expect` expected _no expected value_ _(none)_
- `the indistinguishability claim, measured` — e2e/claims.spec.ts:740
- `the distinguisher is at chance on fresh randomness and certain on reused` — e2e/claims.spec.ts:741
    - :748 `toBeVisible` expected _no expected value_ _(none)_
    - :758 `toBe` expected `40` _(literal)_
    - :762 `toBe` expected `trials` _(expression)_
    - :766 `expect` expected _no expected value_ _(none)_
    - :770 `toBeCloseTo` expected `(freshHits / trials) * 100, 1` _(expression)_
    - :772 `toBeCloseTo` expected `(reusedHits / trials) * 100, 1` _(expression)_
- `the negative claim, shown` — e2e/claims.spec.ts:776
- `every observed query is the same size, and their times differ` — e2e/claims.spec.ts:777
    - :782 `toHaveCount` expected `i + 1` _(expression)_
    - :797 `toBe` expected `1` _(literal)_
    - :798 `toBe` expected `1` _(literal)_
    - :799 `toContainText` expected _no expected value_ _(none)_
    - :804 `expect` expected _no expected value_ _(none)_
    - :805 `toContainText` expected _no expected value_ _(none)_
- `the claim table marks occurrence and timing as not hidden` — e2e/claims.spec.ts:810
    - :815 `toContainText` expected _no expected value_ _(none)_
    - :825 `toContainText` expected _no expected value_ _(none)_
    - :834 `expect` expected _no expected value_ _(none)_
    - :837 `toContainText` expected `'a length that is visible but constant'` _(literal)_
- `verdict retirement` — e2e/claims.spec.ts:841
- `changing a parameter retires the measurement AND says it was retired` — e2e/claims.spec.ts:842
    - :846 `toBeVisible` expected _no expected value_ _(none)_
    - :855 `toHaveCount` expected `0` _(literal)_
    - :856 `toContainText` expected _no expected value_ _(none)_
    - :859 `toContainText` expected _no expected value_ _(none)_
- `the exhaustion verdict is retired when the modulus moves under it` — e2e/claims.spec.ts:864
    - :868 `toBeVisible` expected _no expected value_ _(none)_
    - :870 `toContainText` expected `'Result retired'` _(literal)_
    - :871 `toContainText` expected _no expected value_ _(none)_
- `NO-OP GUARD: re-selecting the same book does NOT retire a fresh measurement` — e2e/claims.spec.ts:876
    - :883 `toBeVisible` expected _no expected value_ _(none)_
    - :890 `toHaveAttribute` expected _no expected value_ _(none)_
    - :896 `toBeVisible` expected _no expected value_ _(none)_
    - :897 `toContainText` expected _no expected value_ _(none)_
    - :906 `toContainText` expected _no expected value_ _(none)_
- `the page is what it says it is` — e2e/claims.spec.ts:912
- `every hidden panel is genuinely not displayed` — e2e/claims.spec.ts:923
    - :932 `expect` expected _no expected value_ _(none)_
    - :934 `toBe` expected `'none'` _(literal)_
    - :935 `toBe` expected `0` _(literal)_
- `the honest-scope claims are on the page, not only in the README` — e2e/claims.spec.ts:939
    - :941 `toContainText` expected `'Not production cryptography'` _(literal)_
    - :942 `toContainText` expected `'no network is involved'` _(literal)_
    - :945 `toContainText` expected `'What this page does not prove'` _(literal)_
    - :946 `toContainText` expected `'Schoolbook'` _(literal)_
    - :947 `toContainText` expected `'No constant-time discipline'` _(literal)_
- `pinning a seed warns that the secret key becomes reproducible` — e2e/claims.spec.ts:950
    - :952 `toContainText` expected _no expected value_ _(none)_
    - :958 `toContainText` expected `'shelf-oracle'` _(literal)_
    - :959 `toContainText` expected `'INCLUDING the secret key'` _(literal)_
    - :961 `toContainText` expected _no expected value_ _(none)_
- `a pinned seed makes the run reproducible, byte for byte` — e2e/claims.spec.ts:966
    - :982 `toEqual` expected `first` _(expression)_
    - :985 `toBe` expected `first.length` _(expression)_
- `the page does not fight the reader` — e2e/claims.spec.ts:989
- `the eight-tab roving keyboard order includes Stateful PIR` — e2e/claims.spec.ts:990
    - :1003 `expect` expected _no expected value_ _(none)_
    - :1004 `toHaveAttribute` expected `'aria-selected', 'true'` _(expression)_
    - :1006 `toBeVisible` expected _no expected value_ _(none)_
    - :1009 `expect` expected _no expected value_ _(none)_
    - :1011 `expect` expected _no expected value_ _(none)_
    - :1013 `expect` expected _no expected value_ _(none)_
    - :1014 `toBeVisible` expected _no expected value_ _(none)_
- `activating a control keeps focus on it across the re-render` — e2e/claims.spec.ts:1017
    - :1026 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :1027 `expect` expected _no expected value_ _(none)_
    - :1033 `toContainText` expected `'1 of 64'` _(literal)_
    - :1034 `expect` expected _no expected value_ _(none)_
- `the live region is ONE node that survives every render` — e2e/claims.spec.ts:1037
    - :1043 `toHaveCount` expected `1` _(literal)_
    - :1051 `toHaveAttribute` expected `'data-witness', 'original'` _(expression)_
    - :1052 `toBe` expected `before` _(expression)_
    - :1053 `expect` expected _no expected value_ _(none)_
    - :1057 `toHaveCount` expected `1` _(literal)_
    - :1058 `expect` expected _no expected value_ _(none)_
- `a demonstration failure code does not overwrite a real retrieval verdict` — e2e/claims.spec.ts:1065
    - :1073 `toContainText` expected _no expected value_ _(none)_
    - :1078 `toHaveText` expected _no expected value_ _(none)_
    - :1082 `toContainText` expected _no expected value_ _(none)_
    - :1085 `toHaveCount` expected `0` _(literal)_
- `a second parameter change updates the retirement reason, not just the first` — e2e/claims.spec.ts:1088
    - :1096 `toBeVisible` expected _no expected value_ _(none)_
    - :1101 `toContainText` expected _no expected value_ _(none)_
    - :1108 `toContainText` expected _no expected value_ _(none)_
    - :1111 `toContainText` expected _no expected value_ _(none)_
- `the fold panel\` — e2e/claims.spec.ts:1116
    - :1122 `toHaveCount` expected `64` _(literal)_
    - :1123 `expect` expected _no expected value_ _(none)_
    - :1137 `expect` expected _no expected value_ _(none)_

**Mutation records** (1 file(s)):

- `scripts/mutations.mjs` (15064 bytes)

<details><summary>Full README</summary>

```markdown
# Shelf Oracle

**Single-server computational private information retrieval: direct RLWE and bounded stateful preprocessing, in the browser.**

Live demo: **https://systemslibrarian.github.io/crypto-lab-shelf-oracle/**

---

## What It Is

A library catalog ordinarily answers *which book do you want?* by learning the answer. **Private information retrieval (PIR)** changes that interface: under an explicit security model and its assumptions, the client gets the requested record without revealing its index to the server.

The classic information-theoretic route shown here needs **two** servers that never collude. This lab also demonstrates computational routes with **one**.

**The construction.** Single-server computational PIR in the style of **SealPIR** — Sebastian Angel, Hao Chen, Kim Laine and Srinath Setty, *PIR with Compressed Queries and Amortized Query Processing*, IEEE Symposium on Security and Privacy, 2018. The mature baseline uses the direct one-hot form:

1. The client encrypts a **selection vector** `b` of length `N` under BFV: `b[index] = 1`, every other entry `0`.
2. The server computes `Σᵢ Rᵢ · Enc(bᵢ)` over its own plaintext records — one **plaintext-by-ciphertext multiplication** per record, then homomorphic addition.
3. Every term with `bᵢ = 0` contributes the zero polynomial. The single term with `bᵢ = 1` contributes `R_index`. So the sum **is** the record, and one ciphertext comes back.

The **Compressed Query** exhibit covers the same 64-record catalog with four fixed 16-selector blocks. The selected block encrypts `16⁻¹ · X^localIndex`; the other three encrypt zero. All four ciphertexts cross the wire, with no plaintext index or selected-block field; the choice is present only under encryption and hidden under the compressed path's stated assumptions. The server expands every block with the odd substitutions `X → X^1025`, `X^513`, `X^257` and `X^129`, noisy binary-gadget key switching, additions and negacyclic shifts; scans all 64 records; and returns four fixed ciphertexts. The client keeps the response for its private block. The direct decrypt, compressed decrypt and independently built catalog record must agree byte for byte and pass the record's SHA-256 decode tag; that tag detects decoding errors here, not a malicious server.

The **Stateful Preprocessing** exhibit is a separate, bounded adaptation of Zhou, Park, Shi and Zheng's [*Piano: Extremely Simple, Single-Server PIR with Sublinear Server Computation*](https://eprint.iacr.org/2023/452) (major revision dated 12 November 2023; IEEE S&P 2024). A client-specific setup streams the static 64-record database and privately retains PRF-defined parity hints, punctured backup hints and replacement records. An online request sends exactly one one-byte record index for each of eight chunks; the server XORs those eight 512-byte records and returns one 512-byte parity. That eight-byte upload is this fixed `N = 64` lesson's canonical codec. The pinned reference implementation transports `uint64` indices through protobuf, so eight bytes is neither its wire format nor a copied Piano benchmark. If the wanted record is `x` and its same-chunk replacement is `r`, the client recovers `DB[x] = P ⊕ response ⊕ DB[r]`, then consumes a backup to refresh the used hint. Sampling deliberately permits `r = x` and duplicate replacements: both are valid in that equation. When `r = x`, the target index can therefore appear in its chunk on the wire; privacy is a distributional claim, not a promise that the target value is never transmitted. There is no server `ProcessDB` artifact in this adaptation—the server keeps the original database—so its preprocessing is identity/none; the expensive setup is the client-specific database stream and retained private state.

**The BFV encryption** — used by the direct and compressed routes, not the stateful one — follows Junfeng Fan and Frederik Vercauteren, *Somewhat Practical Fully Homomorphic Encryption*, IACR ePrint 2012/144, hand-rolled here over `R_q = Z_q[X] / (X^n + 1)`. Key generation, encryption, decryption, plaintext multiplication and ciphertext addition remain the direct path. Expansion adds automorphisms and key switching, but still no ciphertext-by-ciphertext multiplication and therefore no relinearization. Dense switch-key products use two auxiliary NTT primes and exact CRT reconstruction with an executable coefficient bound; the record fold remains the readable schoolbook implementation.

**The security models.** On the direct path, `Enc(0)` and `Enc(1)` are indistinguishable without the secret key under the **decision-RLWE** assumption, so the query carries no index that a computationally bounded adversary can extract. The compressed path additionally publishes key-dependent Galois keys and therefore inherits the circular-security assumption stated below; ordinary IND-CPA alone does not cover that extra material. The stateful path instead relies on secret PRF-derived coordinates—modeled as independent for the stated availability calculation—and strict one-use state discipline: a real query, cached repeat, local setup miss or local failure still puts one index per chunk on the wire and receives 512 bytes. A cached repeat spends a fresh, previously unused effective target as its cover; once a request is committed, any target or refresh slot allocated to it stays consumed and is never rolled back for a retry. Live state always draws from WebCrypto; deterministic entropy injection exists only at the explicitly named test boundary. All three paths assume an honest-but-curious server for query privacy, not a malicious server, and they make separate computational assumptions. The word *computational* is the entire difference from [Oblivious Shelf](https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/) and [Patron Shield](https://systemslibrarian.github.io/crypto-lab-patron-shield/), which are information-theoretic and pay for it with a second server that must never collude.

**The parameters.** The mature direct exhibits default to `n = 1024`, `q` prime just under 2²⁶, `t = 17`, a uniform ternary secret and centred-binomial error with `η = 21` (`σ = √10.5 ≈ 3.24`). The compressed comparison fixes both its direct reference and expanded route at `q = 2²⁷ − 39`, the largest prime below 2²⁷, so the route comparison does not mix moduli while expansion gains one more bit of switching headroom. Those modulus bit lengths are at or below the **128-bit classical** row's `log q ≤ 27` ceiling in the *Homomorphic Encryption Security Standard* (HomomorphicEncryption.org, November 2018). That table assumes discrete-Gaussian error near `σ = 3.19`, while this lab uses a differently shaped centred-binomial law. The comparison is therefore only against the published bit ceiling, not a claim that the table's security estimate transfers. It also does not justify releasing key-dependent Galois hints: the evaluation-key path additionally relies on a circular-security assumption for that key-dependent BFV material. The page keeps both limitations visible.

**The bounded stateful parameters.** That exhibit fixes `N = 64`, record size `B = 512` bytes, eight chunks of eight records, and a window ceiling `Q = ⌊√N ln N⌋ = 33` committed requests. It uses 256 primary hints: `⌈ln 33 + (40 + 1) ln 2⌉ = 32` groups of eight, plus eight punctured backups and replacements per chunk. The extra bit follows the conservative exponential sizing rule used by the authors' current reference client; these are pinned teaching parameters, not the paper's asymptotic regime. In the independent-coordinate model, a fixed target's setup miss probability is exactly `(7/8)^256 ≈ 2^-49.32`. Across a session, after allowing seven programmed hints in one chunk to be deterministic non-hits, at least 249 coordinates remain uniform; the displayed union bound is `33 · (7/8)^249 ≈ 1.20 × 10^-13 ≈ 2^-42.92`. That number covers only primary-hint availability under independent secret coordinates and this bounded refresh schedule. It is not a 128-bit claim or an end-to-end security bound. There are exactly eight refresh slots for the eight possible effective targets in each chunk; one-use targets mean a canonical epoch never needs a ninth. Repeating an application target uses a distinct unused effective target for cover; once all eight targets in one chunk are spent, later covers can only come from other chunks. The separate 33-commit outer window remains the normal epoch ceiling.

**Not production cryptography.** A row of a 2018 table is an estimate under its stated distribution, not a proof or a certificate for this different distribution, and it says nothing about this implementation. Nothing is constant time; the direct server loop skips zero plaintext coefficients, so its running time depends on its own data; secrets and retained state sit in ordinary browser memory; and none of it has been audited. Both "servers" are objects in one page, with no network involved. Each expansion is deliberately bounded to sixteen 512-byte records; four fixed blocks cover the 64-record catalog. Adding their folds into one answer has an inadequate, sample-dependent margin: deterministic regression samples include both exhausted answers and answers below half a bit. The bounded adaptation therefore returns all four fixed responses and spends four times the response bytes; the page measures the discarded sum from each run. This is not SealPIR's multi-dimensional recursion or production response path, and the page makes no claim that one ciphertext under this one-modulus engine can expand to 64 or 256 correct selectors.

The stateful lesson is likewise an adaptation, not a claim to reproduce Piano's theorem, reference benchmarks, pipelined construction or asymptotic storage. At this tiny `N`, keeping eight backups and replacements for every chunk is deliberately linear overprovision, and the full retained-state encoding is larger than the database. Its server has no global preprocessing structure, so it must not be described as the Lin–Mook–Wichs doubly-efficient construction. The lesson does not implement dynamic Piano, authenticated storage, crash recovery, multi-client sharing, malicious-server privacy, answer integrity, availability, traffic hiding or timing protection. What **is** real is the arithmetic and state transition: setup parities are computed from the displayed database, exact wire buffers are parsed, server probes execute, answers recover through the displayed XOR equation, and used hints refresh from consumed backups. Timing is never used to turn the formula ledger into a benchmark claim.

---

## Exhibits

1. **The Shelf** — 64 public-domain works with real authors, dates and Library of Congress class letters. Pick one; that choice is the application value each retrieval path is meant to hide. Shows the exact 512-byte record a successful query returns, its SHA-256 integrity tag, and — behind a disclosure — the byte-to-coefficient packing, four bits at a time, taken from the record actually on screen. Also carries the **run seed**: pin one and the BFV and two-server exhibits become reproducible, including the secret key, with the warning that deserves. It deliberately does not control the live stateful panel, whose setup and cover choices always cross the platform-entropy boundary.

2. **The Server's View** — the plaintext selection vector greyed out as *what never leaves your machine*, beside 64 opaque ciphertexts as *what the server gets*. Guess which one encrypts the `1`. Then a real distinguisher runs 40 trials and reports its measured accuracy against the 1-in-16 baseline — and a single clearly-marked switch reuses one random pair across every entry, at which point the same crude attack is right **every time**. Nothing about the attack changes; only the encryption does.

3. **Homomorphic Selection** — the headline mechanism, stepped. Fold one record, eight, or the rest, and watch all 64 light up as the server multiplies them in: this direct one-hot construction evaluates the encrypted selection over every record without learning which bit is the `1`. The **noise budget falls, measured** — the running ciphertext is decrypted and compared against what it ought to hold — beside the six-sigma prediction derived from the parameters alone. Until the chosen record is folded in, the accumulator decrypts to literal zero. At the end, one decryption produces a record the server never identified.

4. **Compressed Query** — the selected catalog record is retrieved twice from the full 64-record catalog: first with 64 direct ciphertexts, then with four fixed ciphertext blocks that expand to 64 selectors. Only the client knows which block carries `16⁻¹ · X^localIndex`; no block or index field crosses the wire. The panel serializes and round-trips the four reusable Galois keys, traces all four expansion rounds for each block, counts key-switch convolutions and all 64 record products, measures noise before and after expansion, and derives the upload-amortization crossover from actual buffers. It also shows the non-result: query compression leaves the 64-record scan intact and returns four responses to avoid exposing the selected block.

5. **Stateful Preprocessing** — preprocess the static shelf into a private, client-specific Piano-style state, then retrieve through an eight-byte request and 512-byte response while the server probes exactly eight records. The panel exposes the primary hint, replacement and punctured-backup refresh equation; repeat retrievals use an ordinary unused effective target as cover instead of sending a cache flag. Separate ledgers show the 32,768-byte setup stream, setup reads and parity XORs, retained client-state bytes, online wire bytes and online server probes without turning unlike operations into one score. Interactive exercises lose all client state, send a fixed-shape cover that cannot recover the record, update a non-target record retained by the old state, demonstrate that its old valid tag is not freshness, invalidate the changed snapshot, and rebuild before independently recovering the changed record. To make that stale-state failure reproducible, the update exercise deliberately chooses its target and replacement relation from client-private audit state; it is a controlled negative diagnostic, not an ordinary application query or evidence for the independent-target privacy and availability claims. Rollback, malformed-response and window-exhaustion transitions remain executable core tests and visible limitations, not buttons the panel pretends to exercise.

6. **One Server vs Two** — both protocols run over the identical shelf, with upload and download taken by serializing and milliseconds taken by timing. Two servers win every row that is a cost: cheaper, faster, exact. They lose exactly two, and the two are the same fact said twice — this scheme needs one server, so there is no non-collusion assumption to make. One red button spends the assumption they rest on — XOR the two masks and the index falls out in a single operation, with no cryptanalysis and no time. There is no equivalent button for the single-server column, and that is the trade. This table remains the original direct-path comparison; the Compressed Query and Stateful Preprocessing panels separately account for their different setup and online models.

7. **Noise Exhaustion** — three knobs that all move real arithmetic: ciphertext modulus, record size, shelf length. Push until the budget reaches zero and the answer decrypts to garbage, reported through the record's own integrity tag and a count of coefficients outside the encodable range. Includes the parameter assessment against the published table, and a failure-code lab where each of the four BFV-path codes is raised by a real input.

8. **What It Does Not Hide** — the negative claim, shown. Run queries and watch an observer's log fill with rows identical in **size** and different in **time**: fixed response length is a property of these paths, and occurrence, timing, frequency and identity are not. A table separates what the protocol hides from what a deployment would have to, distinguishes stateful PIR from ORAM, and links forward to [Search Vault](https://systemslibrarian.github.io/crypto-lab-search-vault/) and [ORAM Vault](https://systemslibrarian.github.io/crypto-lab-oram-vault/).

---

## When to Use It

**Use single-server computational PIR when you cannot get non-collusion.** In the lab's original direct-BFV head-to-head, two-server PIR is cheaper on every displayed cost, but it needs two operators under genuinely separate control — separate staff, separate jurisdictions, separate subpoena exposure. That is an organisational problem, not a technical one, and it is the reason single-server constructions get built at all. The stateful panel has a different setup/storage/online lifecycle and is deliberately not collapsed into that timing table.

**Use it when the query index is the sensitive thing.** On this lab's one-dimensional BFV routes, the database must be small enough — or the deployment rich enough — to pay `O(N)` server work per query. Query expansion reduces the query ciphertexts sent after setup; it does not remove the record products. That full scan is a property of those routes, not a requirement for every PIR scheme's online query phase. The bounded stateful route demonstrates a different trade: a full client-specific setup and substantial private state in exchange for eight online probes.

**Use preprocessing only when its lifecycle is acceptable.** [Corrigan-Gibbs, Henzinger and Kogan](https://eprint.iacr.org/2022/081) formalize a client-preprocessing model in which a linear setup produces a client hint for a bounded sequence of adaptive queries. Their paper says its most efficient scheme is optimal for its trade-off between server online time and client storage. [Piano](https://eprint.iacr.org/2023/452) gives a PRF-based construction in that family. This lab now executes a deliberately small Piano-style adaptation, but its client must stream the whole static database, protect and advance private state, refresh every used hint, send a cover query for a cached repeat, and rebuild after state loss or any database update. The exhibit's concrete formula ledger is evidence about this `N = 64` adaptation only; it does not numerically instantiate or transfer either paper's asymptotic theorem or lower bound.

**Do NOT use it as an access-control mechanism.** Nothing checks that an encrypted BFV selection is one-hot, and nothing can — the server cannot read it. A malformed direct query can ask for a linear combination and receive its sum; malformed compressed blocks can yield one such result for each returned block. The stateful server strictly parses one in-chunk byte per chunk, but it still authenticates no client and returns the requested eight-record XOR. PIR bounds what the *server* learns, not what the *client* is authorized to extract.

**Do NOT use it when query-event metadata is sensitive.** With fresh randomness, the requested indices in a sequence of full-scan BFV queries remain hidden under each route's stated multi-message assumptions. The stateful path keeps its request and response shapes fixed too, but its occurrence, timing, count, rate and client identity remain visible, and losing or rolling back state can make later behaviour linkable. ORAM addresses a different problem: hiding a logical access sequence from a server that observes data-dependent physical storage locations. Stateful PIR is not ORAM: this lesson's server receives one probe index in every fixed chunk, while its private client state supplies the hiding distribution.

**Do NOT use this code.** It is a teaching implementation. Production BFV work uses audited libraries such as SEAL, OpenFHE or Lattigo; production preprocessing PIR additionally needs a reviewed protocol implementation, protected persistent client state, authenticated database versioning and an operational recovery design.

---

## Live Demo

**https://systemslibrarian.github.io/crypto-lab-shelf-oracle/**

You can: pick any of 64 books; watch the encrypted selection vector be built and try to distinguish `Enc(1)` from `Enc(0)` yourself; break the encryption's randomness and watch a distinguisher go from chance to certain; step the homomorphic inner product record by record with a live measured noise budget; retrieve the same full-catalog record through direct and actually expanded compressed queries; preprocess the shelf into private state, execute and refresh Piano-style hints, compare setup and online costs, lose that state, update the database and rebuild; run single-server and two-server PIR head to head with real byte counts; make the two servers collude and recover the index instantly; shrink the modulus until decryption returns garbage; trip the demonstrated failure codes; and watch what a network observer still sees after all of it.

---

## What Can Go Wrong

- **Decryption-feedback research — 20 October 2026.** Ordinary encryption security (IND-CPA), correct decryption, and security when an adversary learns computation results (IND-CPA-D) are different guarantees. Choe, Kang and Stehlé report attacks on particular BFV/BGV configurations using heuristic correctness assumptions, with experiments in OpenFHE and HElib. Crafted operations can exceed heuristic noise bounds; two attacks recover keys, while a third breaks indistinguishability. Parameter tables and noise estimates alone do not establish security in this feedback model. This browser lab does not reproduce those attacks or establish that its implementation is vulnerable. [Choe, Kang and Stehlé, *New IND-CPA-D Attacks on BFV and BGV*, ePrint 2026/2546](https://eprint.iacr.org/2026/2546), received 19 October and revised 20 October 2026; accepted to ACM CCS 2026. **Demonstrated results; attack-model-conditional.**

The threat models, failure states and recovery boundaries.

**Who the adversary is.** An *honest-but-curious* server that follows the selected protocol and tries to learn the index from what it receives, plus a *passive network observer* that sees traffic but no plaintext. Privacy against the server is **computational**. The BFV routes rest on decision-RLWE, with the compressed route's additional circular-security assumption; the stateful route rests on pseudorandom secret coordinates and correct one-use client state. These are separate models, not interchangeable evidence.

**What breaks it.**

- **`NOISE_BUDGET_EXHAUSTED`** — every record folded into the answer contributes its own encryption error, including the ones multiplied by an encrypted zero. Past the ceiling the answer still decrypts; it decrypts to garbage. The page detects it three ways, and reports them separately because only two are things a real client could do: the record's own SHA-256 tag fails, coefficients come back outside `[0, 16)` where the encoder can never put them, and — using the secret key and the true record, which a real client has neither of — the measured budget reaches zero. **A deployment sizes its parameters in advance; it does not discover exhaustion at runtime.**
- **`PARAM_UNSAFE`** — the modulus bit length exceeds the cited HES 2018 128-bit-row ceiling for this ring degree, or would push this implementation past 2⁵³ where JavaScript integers stop being exact. The first means even the page's limited reference comparison no longer applies; it does not by itself prove insecurity. The second is more immediate: past that bound JavaScript arithmetic is not exact, so the demo could produce plausible garbage while claiming exactness.
- **`DIM_MISMATCH`** — the query is not the same length as the shelf. Refused **before any homomorphic work**, because a short query answers over a prefix and a long one reads past the end, and both return a ciphertext that decrypts to something.
- **`INDEX_OUT_OF_RANGE`** — the requested shelf position does not exist.

The stateful path reports its own state-machine failures rather than borrowing BFV's noise codes. `WINDOW_EXHAUSTED` requires a new setup epoch; `STATE_LOST`, `DATABASE_UPDATED` and `ROLLBACK_DETECTED` say why old private state cannot safely answer; and `MALFORMED_RESPONSE` and `REQUEST_ABANDONED` consume the committed request and invalidate the epoch instead of rolling it back. `HINT_UNAVAILABLE`, `NO_COVER_TARGET` and `STATE_INVALID` are defensive fail-closed guards if an internal invariant is ever broken, not naturally exhausted paths in the canonical fixed model: eight one-use targets in a chunk have eight refresh slots, while a 33-commit window cannot consume all 64 cover targets. Preflight failures still send one random index per chunk and accept a 512-byte response before reporting the local error, so a different error-shaped request is not introduced. That fixed shape is not availability: without the retained private state, the response cannot recover the requested record.

**What the protocol does not defend against.**

- **A malicious server.** These exhibits provide no answer integrity. A server that wants to lie can return a different record with a matching tag; the tag is part of the record it holds. On the stateful path, the ordered-database SHA-256 digest detects a change only when the client is given the current snapshot to compare, and a valid tag on an old record does not establish freshness. The external generation high-water mark can reject an older serialized state only if the application retains it separately. Neither mechanism authenticates the server or supplies a monotonic database commitment. Verifiable PIR and authenticated freshness are separate requirements.
- **Traffic metadata.** Occurrence, timing, frequency, count, client identity and database shape all leak. What does *not* leak is the index: the direct route always returns one ciphertext, while the compressed route always returns four, whichever record was requested. The direct observer exercise sends one ciphertext per shelf position; the compressed route sends four fixed query blocks after its reusable Galois-key setup. Those lengths are visible and fixed for the 64-record shape — they do not vary with the chosen index. Padding and traffic shaping are separate mechanisms for the things that do leak; PIR does not claim them.
- **Repeated queries.** With fresh randomness, each requested index on the BFV routes — and therefore the requested-index sequence — remains hidden under each route's stated multi-message assumptions: decision-RLWE for direct queries, plus the stated circular-security assumption for compressed evaluation material. On the bounded stateful route, an already cached application target triggers a normal query for a fresh unused effective target; that recovered cover record is cached too, and the requested cached record is returned locally. Every effective target is one-use within an epoch. This consumes online work and state even for repeats; it is not evidence for unbounded queries. Query occurrence, timing, count, rate and client identity remain visible on every route.
- **A malformed client query.** Unauthenticated by construction — see *When to Use It*.
- **Side channels.** Nothing here is constant time. The BFV server's inner loop skips zero plaintext coefficients, so its running time depends on its own data; that costs nothing in this demo because the shelf is public, and it is exactly the shortcut a deployment must not take. The stateful path also does not hide setup, rebuilds, failures or the cadence of requests. Fixed buffer sizes are not a timing- or traffic-analysis defense.

---

## Real-World Usage

Single-server PIR is a live research and deployment area, not a museum piece.

- **SealPIR** (Angel–Chen–Laine–Setty, IEEE S&P 2018) uses **query expansion**: for a dimension that fits in one BFV polynomial, the client sends one ciphertext plus reusable Galois keys and the server expands it into the selection vector with substitutions and key switching. This lab executes that mechanism over sixteen positions per ciphertext and uses four fixed blocks to cover its 64-record catalog without revealing the selected block. It does not implement SealPIR's multi-dimensional recursion, modulus switching, seeded ciphertext compression or production parameter sets, and it copies none of the paper's benchmark numbers.
- **Client-preprocessing PIR** first pays for a client-specific hint, then amortizes that setup over a bounded adaptive query sequence. Corrigan-Gibbs, Henzinger and Kogan's [EUROCRYPT 2022 paper](https://eprint.iacr.org/2022/081) says its most efficient scheme is optimal for its trade-off between server online time and client storage. That model-specific result is important context, not a numeric theorem this `N = 64` exercise instantiates or transfers.
- **Piano** (Zhou–Park–Shi–Zheng, [ePrint 2023/452](https://eprint.iacr.org/2023/452), major revision 12 November 2023; IEEE S&P 2024) builds sublinear-time preprocessing PIR from PRFs. This lab implements a bounded, inspectable adaptation of its current primary/backup-hint idea. It does not copy the paper's asymptotic guarantees, benchmark results, larger parameter choices, pipelining or separate dynamic-database construction.
- **Doubly efficient PIR is a different preprocessing model.** For any constant `ε > 0`, Lin, Mook and Wichs [construct an unkeyed Ring-LWE scheme](https://doi.org/10.1137/23M1598507) with deterministic server preprocessing, `O(N^(1+ε))` preprocessing time and size, polylogarithmic online query work and communication, and `O(N^ε)` updates (STOC 2023; SIAM *Journal on Computing*, published 5 March 2026). Shelf Oracle implements none of that machinery: its Piano-style state is client-specific, its server's `ProcessDB` is identity/none, and every database update invalidates the whole teaching epoch. The Lin–Mook–Wichs result is included to prevent the two models from being credited to each other.
- **OnionPIR** and the **Spiral** family push the same line further with better rate and smaller responses.
- **Two-server, information-theoretic PIR** (Chor–Goldreich–Kushilevitz–Sudan, FOCS 1995) remains active and practical; it is not obsolete, it simply buys its unconditional privacy with a non-collusion assumption. This lab implements it too, so the comparison can be measured rather than asserted.
- The underlying homomorphic encryption is deployed at scale — Microsoft SEAL, OpenFHE, Lattigo — in private set intersection, encrypted database queries and privacy-preserving telemetry.
- The library-privacy framing is not decorative. What patrons read is sensitive metadata, and the profession has defended it for a long time; PIR is one of the few mechanisms that lets a catalog answer a question it is not allowed to remember.

---

## How to Run Locally

`​``bash
npm install
npm run dev          # http://localhost:5173/crypto-lab-shelf-oracle/

npm test             # the cryptographic unit suite
npm run build        # tsc --noEmit && vite build
npm run test:a11y    # production-browser accessibility, claims and research gates
`​``

The browser gate builds first and serves the production bundle, so what passes is what ships. Playwright's Chromium is installed with `npx playwright install chromium` — never `--with-deps`.

---

## Related Demos

- **[Oblivious Shelf](https://systemslibrarian.github.io/crypto-lab-oblivious-shelf/)** — two-server XOR IT-PIR (Chor et al. 1995) over a 16-entry shelf, step by step. The other half of this lab's trade.
- **[Patron Shield](https://systemslibrarian.github.io/crypto-lab-patron-shield/)** — the same two-server scheme framed as library ethics, with a one-click collusion attack.
- **[FHE Arena](https://systemslibrarian.github.io/crypto-lab-fhe-arena/)** — BGV/BFV with ciphertext-by-ciphertext multiplication, relinearization and the noise budget this lab borrows and puts to work.
- **[Search Vault](https://systemslibrarian.github.io/crypto-lab-search-vault/)** — searchable encryption that deliberately leaks the access pattern, then inverts it with the count and IKK attacks. What happens when the leakage this lab refuses to produce is produced.
- **[ORAM Vault](https://systemslibrarian.github.io/crypto-lab-oram-vault/)** — Path ORAM hides a logical access sequence from a server that observes data-dependent physical storage locations. Shelf Oracle's BFV routes perform the same full 64-record scan for every query. Its bounded stateful route instead exposes one secret-distributed probe per fixed chunk and depends on private one-use client state. Neither model hides query-event timing or count, and neither turns PIR into ORAM.

---

## Build & Verify

**121 unit tests** across eight files, all passing (`npm test`).

**Primary-source anchors.** Eight primary sources bound the implementation and its claims. The first two supply values that the suite checks directly; the others define constructions, models and security caveats rather than serving as invented interoperability vectors:

- **RFC 8439** (*ChaCha20 and Poly1305 for IETF Protocols*) — the §2.3.2 block-function vector and the §2.4.2 encryption vector, in `src/pir/chacha20.test.ts`. ChaCha20 samples every BFV ciphertext and its block function also supplies domain-separated stateful coordinates. The RFC vectors anchor that primitive implementation; they do not by themselves transfer Piano's security theorem to this adaptation.
- **The Homomorphic Encryption Security Standard** (HomomorphicEncryption.org, November 2018) — all **18 published modulus ceilings** of the uniform-ternary-secret classical table (`n ∈ {1024 … 32768}` × `{128, 192, 256}`-bit), checked one row at a time in `src/pir/records.test.ts`. Its error is discrete Gaussian; this lab's error is centred binomial. Tests require the UI to label the result as a bit-size comparison rather than transferring the table's security estimate. `PARAM_UNSAFE` marks a modulus above the cited 128-bit-row ceiling (or an exact-arithmetic failure), not a proof of insecurity.
- **Fan and Vercauteren, *Somewhat Practical Fully Homomorphic Encryption*** ([IACR ePrint 2012/144](https://eprint.iacr.org/2012/144)) — the BFV construction from which this teaching implementation takes its ciphertext convention and key-switching setting.
- **Angel, Chen, Laine and Setty, *PIR with Compressed Queries and Amortized Query Processing*** ([IACR ePrint 2017/1142](https://eprint.iacr.org/2017/1142)) and the [Microsoft SealPIR implementation](https://github.com/microsoft/SealPIR/blob/master/src/pir_server.cpp) — the paper's server-side inverse scaling and the implementation's algebraically equivalent client pre-scaling, plus the odd-automorphism expansion schedule exercised here.
- **Geelen and Vercauteren, *Fully Homomorphic Encryption for Cyclotomic Prime Moduli*** ([IACR ePrint 2024/1587](https://eprint.iacr.org/2024/1587)) — an explicit statement of the distinction the UI preserves: an IND-CPA reduction without evaluation keys does not by itself establish security for key-dependent evaluation material; the latter invokes a circular-security assumption.
- **Corrigan-Gibbs, Henzinger and Kogan, *Single-Server Private Information Retrieval with Sublinear Amortized Time*** ([IACR ePrint 2022/081](https://eprint.iacr.org/2022/081); EUROCRYPT 2022) — the client-preprocessing model and bounded adaptive queries. The paper says its most efficient scheme is optimal for its trade-off between server online time and client storage; this lab neither numerically instantiates nor transfers that model-specific theorem.
- **Zhou, Park, Shi and Zheng, *Piano: Extremely Simple, Single-Server PIR with Sublinear Server Computation*** ([IACR ePrint 2023/452](https://eprint.iacr.org/2023/452), revision dated 12 November 2023; IEEE S&P 2024) and the authors' [current reference implementation](https://github.com/wuwuz/Piano-PIR-new/tree/f7107cfadc15a0ac3df20f0bc64f126bf359b702) — the PRF-selected primary hints, punctured backups, replacements, bounded window and refresh idea adapted here. The pinned code link keeps the referenced implementation from drifting; this browser lesson derives its small parameters explicitly and does not copy the reference benchmark.
- **Lin, Mook and Wichs, *Doubly Efficient Private Information Retrieval and Fully Homomorphic RAM Computation from Ring LWE*** ([SIAM *Journal on Computing*, DOI 10.1137/23M1598507](https://doi.org/10.1137/23M1598507), published 5 March 2026; preliminary version at STOC 2023; [ePrint 2022/1703](https://eprint.iacr.org/2022/1703)) — the contrasting unkeyed, deterministic server-preprocessing model. Its asymptotic preprocessing, online and update results are not properties of this client-preprocessed adaptation.

BFV and SealPIR do not supply interoperability test vectors for this implementation, so the rest of the suite uses independent definitions and cross-checks rather than pretending otherwise. The original path's strongest check is a **three-way cross-scheme agreement**: single-server RLWE PIR, two-server XOR PIR and a plain array read must return the identical bytes. The compressed path independently requires the direct BFV query, the expanded query and the separately built catalog record to agree byte for byte and pass the embedded SHA-256 tag.

Also covered: the negacyclic property checked directly (`X^(n-1) · X = -1`, not `+1` — a cyclic ring round-trips perfectly and no correctness test would notice); schoolbook multiplication against a definitional oracle; the new NTT/CRT products against a separate quadratic definition, including the wraparound sign and an executable exactness bound; BFV round-trips over every plaintext value; additive homomorphism; that reused randomness makes `Enc(1) − Enc(0)` exactly `Δ`; every raw switch-key sample checked against `B^j · σ(s)` with its sampled error bound; the published odd substitution schedule; all sixteen one-hot expansion positions at the shipped modulus; full-catalog direct/expanded/plain retrieval agreement for an index outside the first block; positive but smaller post-expansion noise; canonical evaluation-key serialization and refusal of missing, truncated, mismatched and noncanonical setup material; detection that a canonical but corrupted evaluation key changes the output; an exact server-query shape with no block or index field; that the stepped fold reaches the same ciphertext as the one-shot server; that a partial answer decrypts to zero until the chosen record is folded in; that the measured budget falls monotonically; that the six-sigma prediction is a bound the measurement respects; UTF-8 truncation that never splits a sequence; wire-format round-trips at every modulus; and every failure code, raised and named.

The stateful suite independently reconstructs setup parities from the exact database, checks both recovery and backup refresh equations, and exercises all 64 targets. It treats `r = x` and duplicate replacements as valid cases rather than resampling them; verifies the exact eight-byte canonical query and 512-byte response parsers; and rejects truncated, oversized, cross-chunk and noncanonical forms. It also checks cached-repeat cover work, one-use effective targets, synthetic setup misses (including a cached-repeat cover and malformed or abandoned responses), the 33-request window boundary, fixed-shape local index failure, state loss, abandoned and malformed responses with no rollback, canonical state round-trips, stale-state rejection against an external high-water mark, rejection of a database update while a request is pending, and full invalidation after a database update. Live entry points are checked to cross the WebCrypto boundary, while reproducible entropy is limited to functions named `ForTest`.

**The browser gate** (`npm run test:a11y`) runs three test files against the production build:

- **`e2e/a11y.spec.ts`** — zero WCAG 2.1 A/AA violations, at 1280px, 380px and 280px, across roughly forty driven states per width. It is not an axe wrapper: it asserts axe's `incomplete` bucket as well as `violations` (which is where `aria-prohibited-attr` and every `color-mix()` contrast decision live), computes contrast arithmetically over composited backdrops, measures non-text contrast per border side against a ratchet baseline that is currently **empty**, and adds reflow, scroller-reachability and invisible-focus-target oracles that axe has no rules for. Reduced motion is set through `emulateMedia` and asserted from inside the page; nothing is injected and no panel is revealed from script.
- **`e2e/claims.spec.ts`** — checks that the page tells the truth by comparing values the page itself printed rather than hardcoded strings: the record the fold returns against the record the shelf shows; the budget ceiling re-derived as `log2(⌊q/t⌋)` from the printed ring parameters; the query size re-derived from `n` and `log q` where the source measures a serialized buffer; the compressed-query buffer ledger, substitution schedule and executed operation counters independently re-derived; direct, expanded and plain-record bytes compared; and the head-to-head upload against the Server's View figure. The stateful checks independently re-derive the canonical wire shape, recovery and refresh equations, session bound, amortized crossover and codec/source limitations; confirm cached repeats spend a distinct target while unrelated renders preserve the session; and exercise stale output after a retained non-target database update, detection and rebuild. The file also checks that each failure code names its actual cause with numbers matching the controls on screen; verdict **retirement** (change a parameter or key and the stale measurement is gone *and the page says why*) alongside a **no-op guard** (re-selecting the same book retires nothing); the `[hidden]` cascade probe; and that the page does not fight its reader — focus stays on the control you activated across the rebuild, the live region is one node that survives every render, and a demonstration failure code does not overwrite a real retrieval verdict.
- **`e2e/research-2026-10.spec.ts`** — preserves the dated decryption-feedback research note, its IND-CPA-D and heuristic-correctness boundaries, its distinction between published attacks and this lab, and its primary-source link.

**Defects found by the gate and by an adversarial review pass, and fixed rather than baselined:** `.panel { display: grid }` outranking the UA's `[hidden]` rule, which left six tabpanels in the tab order painting nothing; a missing `box-sizing: border-box` plus the grid `min-width: auto` default, which pushed the document sideways at 380px; `aria-label` on role-less tiles; keyboard focus being thrown to `<body>` on every re-render; live regions rebuilt inside a cleared subtree, so none of them could announce anything; a demonstration failure code overwriting a real retrieval verdict; a retirement reason latched on the first change; a hidden panel re-encrypting a 64-ciphertext query nobody was looking at; the comparison table conveying "better" by colour alone; and two rows of the what-is-hidden table contradicting each other about query length.

**Mutation-tested, by a committed runner.** A green suite is not evidence until it has been watched failing. `npm run test:mutations` (`scripts/mutations.mjs`) replays seventeen named mutations from a clean baseline, and CI runs it on every pull request and push before the deploy job, uploading `mutation-evidence.json` as the `mutation-evidence` artifact. Each recipe names ONE owning test; the runner requires the unmodified copy to pass the whole unit suite and build, the named owner to be green, the patch to change the production bundle (JavaScript and CSS are hashed, because one recipe mutates the stylesheet), the owner to go red on a test failure — a timeout, a crash, a missing module or a preview server that failed to start is refused, not counted — and the source and bundle to be restored byte for byte with the owner green again. The original eight cover the negacyclic sign in the direct ring, the `DIM_MISMATCH` guard, fresh encryption randomness, the `[hidden]` rule, the no-op selection guard, focus restoration, live-region persistence, and the on-screen-panel re-render. Four target the compressed path: the odd Galois schedule, the automorphism's negacyclic sign, preservation of the substituted `c0` term during key switching, and subtraction rather than addition when the NTT convolution is folded modulo `X^n + 1`. Five target the bounded Piano core: the replacement-record XOR in recovery, refresh-slot consumption before send, invalidation after a malformed response, rejection of an oversized query encoding, and database-digest equality. Twelve are owned by Vitest tests and five by Playwright claims run against a fresh production build. Measured on 2026-10-27: 17 of 17 caught, every owner green before and after.

---

## Performance

Measured in-page, on the reader's own machine, at the shipped defaults (`n = 1024`, `q ≈ 2²⁶`, 64 records of 512 bytes):

| | Shelf Oracle (1 server, RLWE) | Chor et al. XOR (2 servers) |
|---|---|---|
| Upload per query | ~416 KiB | 16 B |
| Download per query | ~6.5 KiB | 1 KiB |
| Client work | ~50 ms | ~0.1 ms |
| Server work | ~80 ms | ~0.6 ms |
| Records touched | 64 of 64 | ~half of 64, per server |
| Privacy | computational (RLWE) | information-theoretic |
| Trust assumption | none between operators | the two must never collude |

That table is the original 64-record **direct** baseline at its default 26-bit modulus. The separate Compressed Query exhibit compares both routes over all 64 records at the expansion path's 27-bit modulus. A ciphertext is 6,912 bytes: the 64-ciphertext direct query is 442,368 bytes, while four fixed compressed-query blocks total 27,648 bytes. Four binary Galois keys serialize to 746,520 reusable setup bytes, so the first compressed upload totals 774,168 bytes and cumulative compressed upload becomes smaller on query two. The direct response is 6,912 bytes; the compressed server returns four fixed responses totaling 27,648 bytes so response shape does not reveal the selected block. Both routes still perform 64 record products. Those figures are derived from actual serialized buffers; the exhibit separately measures the reader's timings and noise. Seeded compression of the uniform ciphertext half remains unimplemented and is named rather than assumed.

The **stateful preprocessing** ledger uses different units and stays separate from that BFV table:

| Stateful component (`N = 64`, `B = 512`) | Exact teaching cost |
|---|---:|
| Client-specific setup stream | 64 records = 32,768 B |
| Server `ProcessDB` | identity/none; original database only |
| Setup parity work | 2,048 primary + 448 backup = 2,496 record-XOR contributions |
| Setup replacement retention | 64 record copies |
| Base private client state | 197,696 B before sparse caches |
| Normal-query cache ceiling | 33 × 513 B = 16,929 B |
| Online upload / download | 8 B / 512 B = 520 B per committed request |
| Online server probes / XOR contributions | 8 records / 8 per committed request |
| Bounded epoch | at most 33 committed requests, and at most eight target-chunk refreshes per chunk |

These are formula and serialized-buffer counts, not browser timings. The wire numbers count this lesson's canonical payloads and omit protobuf, HTTP and other transport framing. At the full 33-request window, setup traffic amortizes to `32,768 / 33 ≈ 992.97` bytes per request; adding the 520 online bytes gives `≈ 1,512.97` bytes per request. Against the deliberately simple baseline that re-downloads all 32,768 database bytes for every lookup, cumulative stateful wire traffic first wins on query two: 33,808 bytes versus 65,536. A client allowed to download and retain this static public database once would need no PIR queries at all, so that crossover is a wire-accounting exercise, not a deployment recommendation. In the update exercise, comparing the presented snapshot with the retained digest scans another 32,768 input bytes; the page records that separately from online wire traffic, and the digest still does not authenticate freshness. Any database update invalidates the whole epoch and pays the setup stream, parity work and state rebuild again; this lab implements no incremental update algorithm.

Noise budget at those defaults: the ceiling is `log2(⌊q/t⌋) = 21.91` bits, a freshly encrypted record measures about **16.5** bits — encryption spends roughly five bits on its own sampled error before the server does anything — and the finished 64-record answer measures about **7.6**. At `q = 2¹⁸` the same query exhausts and the page says so through the record's own integrity tag.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*


```

</details>

---

## Sphinx Mix

- **slug**: `crypto-lab-sphinx-mix`
- **repo**: https://github.com/systemslibrarian/crypto-lab-sphinx-mix
- **live**: https://systemslibrarian.github.io/crypto-lab-sphinx-mix/
- **commit_sha**: `ccb58d0e7e9c8da190b71a442cef8b5eb4a82e8e` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `c7142e186d98c90543f297d7911e7e99a7b1bdc1`
- **read_from**: working tree (clean)
- **category**: PRIVACY  ·  **level**: advanced  ·  **--accent**: #a58cff
- **MISSING FIELDS**: mutations, verification

**Name (H1)**: Sphinx Mix  — _read from src/main.ts_

**Subtitle**: Mix-network packet format · Danezis & Goldberg, IEEE S&P 2009  — _read from src/main.ts_

**Description**: Peel a real Sphinx packet across three mixes — per-hop ristretto255 blinding, a header that never changes length, a LIONESS-protected payload — then watch one sender on a quiet network get traced end to end with every cryptographic check green.  — _read from src/main.ts_

**Why it matters**: Anonymity systems fail in a way encryption does not: every check can pass and the system can still expose you. Sphinx is the packet format Nym, Katzenpost and Loopix are built on, and knowing exactly where its guarantee stops is the difference between using it and trusting it.  — _read from src/main.ts_

**Card copy**: Peel a real Sphinx packet across three mixes — per-hop blinding, a header that never changes length. Then trace one sender end to end on a quiet network with every cryptographic check green.

**Chips**: Sphinx · ristretto255 · LIONESS · Traffic Analysis

**Implements**: ChaCha20 `src/sphinx/kat/vectors.ts:57`, HMAC `src/sphinx/kdf.ts:19`, ristretto255 `src/sphinx/kat/vectors.ts:23`, SHA-256 `src/sphinx/kdf.ts:14`, SHA-512 `src/sphinx/kat/vectors.ts:138`

**Attacks shown**: Ciphertext malleability `README.md:58`

**Comment-only (named in code comments, not executed)**: Diffie-Hellman `src/sphinx/group.ts:6`, EC point arithmetic `src/sphinx/group.ts:30`, Hellman chains `src/sphinx/header.ts:70`, X25519 `src/sphinx/group.ts:4`

**References**: DES, Diffie-Hellman, EC point arithmetic, Ed25519, FF1, Schnorr, X25519

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `ePrint 2008/475` — first seen README.md:28 (2×)
- `eprint.iacr.org/2008/475` — first seen README.md:28 (1×)
- `FIPS 180-4` — first seen README.md:24 (3×)
- `RFC 2104` — first seen README.md:24 (1×)
- `RFC 4231` — first seen README.md:24 (2×)
- `RFC 7748` — first seen README.md:46 (3×)
- `RFC 8439` — first seen README.md:25 (3×)
- `RFC 9496` — first seen README.md:23 (7×)
- `SP 800-38G` — first seen README.md:276 (1×)

**README — What Can Go Wrong**:

```text
The threat model, and the places this construction has historically been got wrong.

**The adversary exhibit 6 models.** A global passive observer: it sees every packet on every
link with a timestamp, including the sender-to-first-mix and last-mix-onward links, and it
knows each mix's flushing rule. It holds no mix private key, so — because Sphinx works — it
cannot link a mix's input bytes to its output bytes. Timing and counting are all it has, and
they are usually enough.

**Payload tagging is a subtle correlation channel with a long history in mix design.** It is
the reason the payload gets a wide-block permutation rather than a stream cipher, and it is
the specific mistake this lab was nearly built with. A stream-cipher payload lets an adversary
who controls the entry and exit points flip a chosen bit on the way in and look for the
corresponding flip on the way out: a low-noise, targeted link between two observations, costing
one bit. Because the mixes do not authenticate the payload, nothing on the path stops it. The
answer is not to add a MAC — a MAC the mixes could check would have to be re-computable at every
hop, which hands the mixes a linking oracle of their own — but to make the mark unrecognisable.
LIONESS does that. Exhibit 5 lets you perform the attack and watch it fail to produce a signal.

**Anti-tagging is not integrity, and this lab says which one it chose.** LIONESS is a PRP, not
an authentication code. It converts targeted modification into unpredictable corruption; it
hands nobody an authenticity verdict. This lab uses the paper's route to a corruption check —
**recognisable payload structure**: the plaintext begins with κ zero bytes and the recipient
checks for them, so corruption survives with probability 2⁻¹²⁸. That detects damage. It does not
authenticate a sender, and it offers nothing against an adversary who can predict or influence
the plaintext structure. Explicit end-to-end authenticity requires a separate authenticator the
sender and recipient share, under a key no mix holds, and Sphinx leaves that to the layer above
on purpose: a mix format that demanded it would have to know something about the recipient.

**Check ordering is load-bearing.** A mix verifies the header MAC *before* recording the replay
tag. Reversed, an adversary could take a legitimate packet in flight, corrupt one byte of the
routing block and race it to the mix; the forged packet would poison the seen-set and the real
packet would be dropped behind it as a replay. That is a one-byte denial of service against any
packet an adversary can see. `src/sphinx/failures.test.ts` has a test named for exactly that.

**The replay set grows without bound.** A mix that remembers every tag forever eventually
cannot. A mix that expires tags re-opens the replay window for anything older than the cutoff.
Production designs bound it with an epoch: mix keys rotate, and tags older than the current
epoch are discarded along with the key that could have derived them. This lab does not implement
epochs, and says so in-page.

**A threshold mix does not flush a partial pool.** Raise the threshold above the traffic and
real packets sit in pools indefinitely. Exhibit 6 reports the stranded count rather than
quietly draining the pools to make the delivery figures look better; that trade is the actual
cost of the strategy.

**What exhibit 6's entropy figure does not model,** stated because pretending otherwise would be
the exact dishonesty this lab is about: long-term intersection and statistical disclosure attacks
across many rounds; active attacks such as n−1 flooding, where an adversary fills a pool with its
own packets so the one real packet is the only unknown; fingerprinting outside the mixnet; and any
adversary able to inject or delay. It is a **single-round lower bound** on what a passive observer
learns. A real adversary learns at least this much. Cover traffic's measurable effect in this model
is on delivery and latency rather than on the entro
```

**Claims tested** (e2e/claims.spec.ts, 24 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:44
    - :44 `toHaveText` expected `'Sphinx Mix'` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:49
    - :49 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:50
    - :50 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:56
    - :56 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:58
    - :58 `toBe` expected `true` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:64
    - :64 `expect` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:79
    - :79 `toBe` expected `0` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:114
    - :114 `expect` expected _no expected value_ _(none)_
- `the page tells the truth` — e2e/claims.spec.ts:120
- `every failure code in the reference is a code the lab actually exports` — e2e/claims.spec.ts:121
    - :125 `toEqual` expected _no expected value_ _(none)_
    - :130 `toBe` expected `pills.length` _(expression)_
- `the header sizes the hero implies and the length act prints agree, and sum` — e2e/claims.spec.ts:133
    - :141 `toBe` expected `packet` _(expression)_
    - :148 `toBe` expected `header` _(expression)_
    - :153 `toBe` expected `MAX_HOPS` _(expression)_
    - :154 `toBe` expected `(2 * r + 1) * KAPPA` _(expression)_
    - :155 `toBe` expected `KAPPA` _(expression)_
- `the header size does not change with the path length — every value on the control` — e2e/claims.spec.ts:158
    - :164 `toHaveCount` expected `Number(hops)` _(expression)_
    - :172 `toBe` expected `2 * (Number(hops) - 1) * KAPPA` _(expression)_
    - :179 `toBe` expected `beta` _(expression)_
    - :180 `toBe` expected `filler` _(expression)_
    - :182 `toBe` expected `1` _(literal)_
- `the Hamming distance the Peel act prints is the distance between the two dumps it shows` — e2e/claims.spec.ts:185
    - :189 `toHaveText` expected `'Hop 1 / 3'` _(literal)_
    - :192 `toHaveCount` expected `2` _(literal)_
    - :195 `expect` expected _no expected value_ _(none)_
    - :196 `toBe` expected `inBytes.length` _(expression)_
    - :206 `expect` expected _no expected value_ _(none)_
    - :208 `expect` expected _no expected value_ _(none)_
    - :212 `toBeCloseTo` expected `(printedBits / totalBits) * 100, 1` _(expression)_
    - :218 `toBe` expected `blockLen * 8` _(expression)_
    - :220 `expect` expected _no expected value_ _(none)_
    - :222 `toBeCloseTo` expected `blockLen / 256, 2` _(expression)_
- `the Peel act’s histogram label carries the same counts as its bars` — e2e/claims.spec.ts:225
    - :230 `expect` expected _no expected value_ _(none)_
    - :232 `toHaveLength` expected `16` _(literal)_
    - :236 `toBe` expected `blockLen` _(expression)_
- `each failure path is reached and the page names the actual cause` — e2e/claims.spec.ts:239
    - :244 `toHaveText` expected `'HMAC_FAIL'` _(literal)_
    - :248 `expect` expected _no expected value_ _(none)_
    - :262 `toBeVisible` expected _no expected value_ _(none)_
    - :264 `toBe` expected `1` _(literal)_
    - :267 `toHaveText` expected `'REPLAY_DETECTED'` _(literal)_
    - :268 `toContainText` expected _no expected value_ _(none)_
    - :271 `toBe` expected `afterAccept` _(expression)_
    - :282 `toHaveText` expected `'HMAC_FAIL'` _(literal)_
    - :283 `toContainText` expected `'delivered normally'` _(literal)_
    - :285 `toBe` expected `beforeForge + 1` _(expression)_
    - :289 `toContainText` expected `'forgotten every tag'` _(literal)_
    - :290 `toBe` expected `0` _(literal)_
- `a payload flip is caught by nobody on the path and destroys the payload` — e2e/claims.spec.ts:293
    - :299 `expect` expected _no expected value_ _(none)_
    - :301 `toContainText` expected `'Every mix accepted it'` _(literal)_
    - :302 `toContainText` expected `'irrecoverable'` _(literal)_
    - :312 `toBe` expected `1` _(literal)_
    - :313 `toBe` expected `1024 * 8` _(expression)_
    - :314 `expect` expected _no expected value_ _(none)_
    - :315 `expect` expected _no expected value_ _(none)_
    - :317 `toBeCloseTo` expected `(changed / total) * 100, 1` _(expression)_
- `NEG-1: one sender, immediate forwarding — all checks green, anonymity set 1` — e2e/claims.spec.ts:327
    - :330 `toBeVisible` expected `{ timeout: 120_000 }` _(expression)_
    - :332 `toHaveText` expected _no expected value_ _(none)_
    - :335 `toHaveText` expected `'EVERY PACKET TRACED'` _(literal)_
    - :336 `toContainText` expected `'traced end to end'` _(literal)_
    - :342 `toBe` expected `0` _(literal)_
    - :345 `toBe` expected `1` _(literal)_
    - :346 `toBe` expected `1` _(literal)_
    - :352 `expect` expected _no expected value_ _(none)_
    - :358 `toBe` expected `'TRACED'` _(literal)_
    - :363 `expect` expected _no expected value_ _(none)_
    - :364 `expect` expected _no expected value_ _(none)_
- `mixing, not cryptography, is what moves the meter — and the ceiling is log2(senders)` — e2e/claims.spec.ts:367
    - :370 `toBeVisible` expected `{ timeout: 120_000 }` _(expression)_
    - :373 `toBeVisible` expected `{ timeout: 180_000 }` _(expression)_
    - :381 `toBe` expected `8` _(literal)_
    - :383 `toBeCloseTo` expected `Math.log2(senders), 2` _(expression)_
    - :384 `expect` expected _no expected value_ _(none)_
    - :385 `expect` expected _no expected value_ _(none)_
    - :389 `toHaveText` expected _no expected value_ _(none)_
    - :397 `toBe` expected `injected` _(expression)_
- `retirement: changing the path length clears the stale filler figure` — e2e/claims.spec.ts:400
    - :410 `toBe` expected `two` _(expression)_
    - :411 `toBe` expected `2 * 4 * KAPPA` _(expression)_
    - :412 `toContainText` expected `'5 hops'` _(literal)_
    - :413 `toContainText` expected `'2 hops'` _(literal)_
- `no-op guard: re-selecting the same path length does not retire a fresh result` — e2e/claims.spec.ts:416
    - :425 `toBe` expected `before` _(expression)_
    - :426 `toContainText` expected `'4 hops'` _(literal)_
- `the honest-scoping notice says what is real and what is simulated` — e2e/claims.spec.ts:429
    - :432 `expect` expected _no expected value_ _(none)_
    - :433 `toMatch` expected `/What is real/` _(regex)_
    - :434 `toMatch` expected `/What is simulated/` _(regex)_
    - :435 `expect` expected _no expected value_ _(none)_
    - :436 `toMatch` expected `/nothing here is constant-time/i` _(regex)_
- `the parameters panel and the length act agree on kappa and r` — e2e/claims.spec.ts:439
    - :448 `toBe` expected `KAPPA` _(expression)_
    - :449 `toBe` expected `packet` _(expression)_
    - :451 `toBe` expected `32 + (2 * r + 1) * kappa + kappa` _(expression)_
    - :455 `toBe` expected `r` _(expression)_
    - :457 `toBe` expected `header` _(expression)_
- `a closed disclosure really is hidden — the [hidden] cascade probe` — e2e/claims.spec.ts:460
    - :479 `toEqual` expected `[]` _(expression)_
- `research boundary is visible in the rendered lesson` — e2e/claims.spec.ts:483
    - :485 `toContainText` expected `'diffusion/format diagnostics only'` _(literal)_

**Mutation records**: _MISSING — no file matching /mutation/i_

<details><summary>Full README</summary>

```markdown
# Sphinx Mix

**Mix-network packet format · Danezis & Goldberg, IEEE S&P 2009**

Peel a real Sphinx packet across three mixes — per-hop ristretto255 blinding, a header
that never changes length, a LIONESS-protected payload — then watch one sender on a quiet
network get traced end to end with every cryptographic check green.

---

## What It Is

A browser demo of the **Sphinx mix-network packet format**, built to teach one distinction
that most explanations of anonymity systems blur:

> **Bitwise unlinkability is a property of the packet format. Anonymity is a property of
> the traffic. The first does not produce the second.**

**The primitives, exactly.**

| Role | Primitive | Specification |
|---|---|---|
| Group, per-hop blinding chain | **ristretto255** | RFC 9496 (December 2023) |
| Header MAC `μ` | **HMAC-SHA-256**, truncated to κ = 16 bytes | RFC 2104; RFC 4231 test vectors; FIPS 180-4 |
| Routing-block PRG `ρ`, filler | **ChaCha20** keystream | RFC 8439 (June 2018) |
| Payload PRP `π` | **LIONESS**, from ChaCha20 + HMAC-SHA-256 | Anderson & Biham, *Two Practical and Provably Secure Block Ciphers: BEAR and LION*, FSE 1996 |
| Blinding-factor derivation `h_b` | **SHA-512**, reduced mod ℓ | FIPS 180-4 |
| Packet format | **Sphinx** | Danezis & Goldberg, IEEE S&P 2009; [ePrint 2008/475](https://eprint.iacr.org/2008/475) |

The Sphinx paper is a construction and a security proof, not a standards document; there is
no RFC for it and no published KAT file. It is nevertheless the live packet format behind
**Nym**, **Katzenpost** and the **Loopix** design, all of which specify their own
instantiation of the same construction.

**Why ristretto255, and why not X25519.** Sphinx does not perform one Diffie–Hellman; it
performs a chain, built by re-blinding the same group element at each hop:

`​``
alpha_0 = g^x            s_0 = y_0^x            b_0 = h_b(alpha_0, s_0)
alpha_1 = alpha_0^{b_0}  s_1 = y_1^{x b_0}      b_1 = h_b(alpha_1, s_1)
alpha_2 = alpha_1^{b_1}  s_2 = y_2^{x b_0 b_1}
`​``

Each mix recomputes its own `s_i = alpha_i^{x_i}`; the sender predicts all of them from `x`
alone. That only works if exponents compose as plain integers modulo the group order.
**RFC 7748's X25519 clamps its scalar before every multiplication** — clearing the three
low bits, clearing bit 255, setting bit 254 — so `X25519(b, X25519(a, G))` is *not*
`X25519(b·a, G)`: the second clamp lands on `b` itself, not on the product, and the product
of two clamped scalars is not clamped. Iterated blinding therefore does not compose, and a
Sphinx built on the clamped API silently derives a different secret at the mix than the
sender predicted. Curve25519's cofactor of 8 adds a second problem: small-order elements
become a live degeneracy the format has to handle rather than a case that cannot arise.
ristretto255 removes both — prime order, no cofactor, canonical validated encodings, and
scalar multiplication that is just scalar multiplication. The in-page **parameters**
disclosure carries this same derivation for readers who never open the README.

**Why LIONESS and not a stream cipher over the payload.** Under a stream cipher a payload is
malleable bit for bit: flip bit 37 of the ciphertext and bit 37 of the plaintext flips,
everything else survives. An adversary controlling the first and last hop can therefore *tag*
a packet — mark it on the way in, recognise the mark on the way out, link the two
observations. LIONESS is an **unbalanced four-round Feistel network** whose rounds alternate
a stream cipher keyed by the narrow left half with a keyed hash of the wide right half:

`​``
R ^= S(L ^ k1)      L ^= H(k2, R)      R ^= S(L ^ k3)      L ^= H(k4, R)
`​``

One flipped ciphertext bit randomises all 1024 bytes. The change is still invisible to the
mixes — but it is no longer a *signal*, because the adversary cannot recognise its own mark
on the far side. `src/sphinx/lioness.test.ts` measures both behaviours side by side.

**Parameters.** κ = 16 bytes, r = 5 (maximum path length), routing block β = (2r+1)·κ = 176
bytes, header = 224 bytes, payload = 1024 bytes, whole packet = 1248 bytes — for *every*
path length from one hop to five.

**Honest scoping.** **Not production crypto — a teaching demo.**

* **Real:** the ristretto255 group operations, the per-hop blinding chain, the HMAC-SHA-256
  header MACs, the ChaCha20 filler and routing-block keystream, the LIONESS permutation,
  every failure check, and every packet built or peeled anywhere on the page. Everything runs
  in the browser; no key material leaves the tab and there is no backend to send it to.
* **Simulated:** the clock, and only the clock. Exhibit 6 schedules arrivals in integer
  rounds rather than wall-clock time, because a browser tab cannot demonstrate a mixnet in
  real seconds. The packets in it are real Sphinx packets and every cryptographic check
  really runs.
* **Not present:** constant-time execution (JavaScript offers no timing guarantees at all),
  a directory authority, key rotation, epoch handling, packet-size negotiation, or any
  persistence — mix keys are regenerated on every page load.

**What this does NOT prove.** The Hamming/histogram checks are diffusion and format regressions, not proofs of computational unlinkability. A public half-bit XOR mask passes such diagnostics while remaining perfectly linkable. The [PoPETs 2024 Sphinx analysis](https://petsymposium.org/popets/2024/popets-2024-0140.php) proves an adapted construction under GDH with explicit service/integrated and reply-path models. This forward-only lab does not automatically inherit that theorem or reproduce the reply/nymserver attack. **A packet format alone does not provide anonymity.**
That comes from mixing and from traffic conditions the packet format cannot supply. The
evidence is exhibit 6's first preset — one sender, immediate forwarding, every check green,
anonymity-set entropy exactly 0 bits — and it is asserted as a test, not merely stated:
`e2e/claims.spec.ts`.

---

## Exhibits

1. **Build a path** — Pick a message; watch the header construct in reverse, innermost layer
   first, because that is the order the construction runs in. Each step shows the routing
   block for one hop, its MAC, its filler, and the length staying put.
2. **Peel** — Step a packet through three mixes one hop at a time. Each hop derives its
   shared secret, checks the header MAC, unwraps the routing block, blinds the group element
   and forwards. The measurement panel shows input against output as a **Hamming distance**
   and a **byte-distribution histogram**, with the coincidentally-matching bytes highlighted —
   not as "zero shared bytes", which is false and which a disclosure explains at length.
3. **Fixed length** — Drive the path from one hop to five. The header, the payload and the
   whole packet are byte-identical in size at every setting. A proportional bar shows how much
   of the innermost routing block is real instructions and how much is filler, and the filler
   grows by exactly as much as the instructions shrink.
4. **Replay** — Send a packet, watch it arrive; send the same bytes again and watch the first
   mix refuse them with `REPLAY_DETECTED`. A control clears every mix's memory so you can see
   what a stateless mix would allow. The disclosure explains why the tag is over the shared
   secret rather than over the packet bytes.
5. **Tagging** — Flip one byte of the header and one byte of the payload, side by side.
   The header flip dies at the next hop with `HMAC_FAIL`; the payload flip is caught by
   nobody, forwarded normally through every remaining hop, and arrives irrecoverable. A
   comparison table puts the two outcomes against an untouched control.
6. **Timing correlation** — Run the whole mixnet. Start with one sender and immediate
   forwarding: every check passes and an observer holding no keys traces every packet from end
   to end. Add senders, add cover traffic, switch to a pool mix, and watch the anonymity-set
   entropy meter climb toward its ceiling of log₂(senders).

Plus, on the page itself: a plain-language "what is a mix network" intro, a break-it-yourself
learner check, the five failure codes with their explanations, and the parameters the lab runs
at.

---

## When to Use It

**Use a Sphinx-style mix format when** you need to hide *who is talking to whom* from an
adversary who can see the network, and you can accept latency measured in seconds to minutes.
Its distinguishing properties are a header whose size is independent of path length, a
per-hop shared secret nobody else can derive, replay resistance, and payload tagging
resistance — all in a single compact format.

**Do NOT use it when:**

* **You need low latency.** Anonymity here comes from *delay and batching*. Exhibit 6 shows
  what a zero-delay mixnet is worth: nothing. Any deployment that forwards immediately to keep
  latency down has spent the packet format and bought no anonymity with it.
* **There is only one plausible sender.** A mix format cannot manufacture an anonymity set.
  A single-user deployment is fully traceable however correct the cryptography is.
* **You need end-to-end authenticity from the format.** Sphinx deliberately does not provide
  it — see *What Can Go Wrong*.
* **You want to build it from `X25519`.** The clamped API does not compose under iterated
  blinding. Use a prime-order group.
* **You want to copy this code.** This is a teaching implementation: not constant-time, no
  key rotation, no directory, no epochs.

---

## Live Demo

**<https://systemslibrarian.github.io/crypto-lab-sphinx-mix/>**

Everything runs client-side. You can build a packet from a message you type, step it hop by
hop and read the shared secret each mix derives, drive the path length from one to five and
watch the header refuse to change size, replay a packet into a `REPLAY_DETECTED`, flip
individual bytes of the header and the payload and compare what happens, and run a mixnet
under six different traffic configurations while an entropy meter reports what a passive
observer learns.

---

## What Can Go Wrong

The threat model, and the places this construction has historically been got wrong.

**The adversary exhibit 6 models.** A global passive observer: it sees every packet on every
link with a timestamp, including the sender-to-first-mix and last-mix-onward links, and it
knows each mix's flushing rule. It holds no mix private key, so — because Sphinx works — it
cannot link a mix's input bytes to its output bytes. Timing and counting are all it has, and
they are usually enough.

**Payload tagging is a subtle correlation channel with a long history in mix design.** It is
the reason the payload gets a wide-block permutation rather than a stream cipher, and it is
the specific mistake this lab was nearly built with. A stream-cipher payload lets an adversary
who controls the entry and exit points flip a chosen bit on the way in and look for the
corresponding flip on the way out: a low-noise, targeted link between two observations, costing
one bit. Because the mixes do not authenticate the payload, nothing on the path stops it. The
answer is not to add a MAC — a MAC the mixes could check would have to be re-computable at every
hop, which hands the mixes a linking oracle of their own — but to make the mark unrecognisable.
LIONESS does that. Exhibit 5 lets you perform the attack and watch it fail to produce a signal.

**Anti-tagging is not integrity, and this lab says which one it chose.** LIONESS is a PRP, not
an authentication code. It converts targeted modification into unpredictable corruption; it
hands nobody an authenticity verdict. This lab uses the paper's route to a corruption check —
**recognisable payload structure**: the plaintext begins with κ zero bytes and the recipient
checks for them, so corruption survives with probability 2⁻¹²⁸. That detects damage. It does not
authenticate a sender, and it offers nothing against an adversary who can predict or influence
the plaintext structure. Explicit end-to-end authenticity requires a separate authenticator the
sender and recipient share, under a key no mix holds, and Sphinx leaves that to the layer above
on purpose: a mix format that demanded it would have to know something about the recipient.

**Check ordering is load-bearing.** A mix verifies the header MAC *before* recording the replay
tag. Reversed, an adversary could take a legitimate packet in flight, corrupt one byte of the
routing block and race it to the mix; the forged packet would poison the seen-set and the real
packet would be dropped behind it as a replay. That is a one-byte denial of service against any
packet an adversary can see. `src/sphinx/failures.test.ts` has a test named for exactly that.

**The replay set grows without bound.** A mix that remembers every tag forever eventually
cannot. A mix that expires tags re-opens the replay window for anything older than the cutoff.
Production designs bound it with an epoch: mix keys rotate, and tags older than the current
epoch are discarded along with the key that could have derived them. This lab does not implement
epochs, and says so in-page.

**A threshold mix does not flush a partial pool.** Raise the threshold above the traffic and
real packets sit in pools indefinitely. Exhibit 6 reports the stranded count rather than
quietly draining the pools to make the delivery figures look better; that trade is the actual
cost of the strategy.

**What exhibit 6's entropy figure does not model,** stated because pretending otherwise would be
the exact dishonesty this lab is about: long-term intersection and statistical disclosure attacks
across many rounds; active attacks such as n−1 flooding, where an adversary fills a pool with its
own packets so the one real packet is the only unknown; fingerprinting outside the mixnet; and any
adversary able to inject or delay. It is a **single-round lower bound** on what a passive observer
learns. A real adversary learns at least this much. Cover traffic's measurable effect in this model
is on delivery and latency rather than on the entropy of an already-delivered packet; its other
job — defeating long-term intersection attacks by making a sender's output rate independent of
whether it has anything to say — needs a multi-round model this one cannot show.

**Diffusion is not unlinkability.** Coincidentally matching bytes are normal, and Hamming distance and marginal histograms help catch gross regressions. They do not measure adversarial linking advantage. A fixed public XOR mask can produce half-bit changes and uniform marginals while being perfectly invertible; the regression suite includes this counterexample. Computational unlinkability needs a construction-specific model and proof, not a histogram threshold.

---

## Real-World Usage

Sphinx is not a historical curiosity; it is the packet format currently in production use for
mixnets.

* **Nym** — the Nym mixnet uses a Sphinx-derived packet format over a Loopix-style stratified
  topology with Poisson mixing and cover traffic.
* **Katzenpost** — a mixnet framework whose wire format is Sphinx, with an explicit
  specification of the instantiation (group, KDFs, payload PRP) that the paper leaves open.
* **Loopix** (Piotrowska, Hayes, Elahi, Meiser, Danezis, USENIX Security 2017) — the design that
  pairs Sphinx packets with Poisson mixing and loop cover traffic, and the source of the
  argument that the packet format alone is not the anonymity story.
* **Lightning Network onion routing** — BOLT #4 specifies a Sphinx-derived format for HTLC
  routing, with a 1300-byte routing packet and per-hop shared secrets derived exactly this way.
  It is the widest deployment of the construction by packet count.

LIONESS itself shows up wherever a wide-block PRP is needed on a budget: Sphinx payloads, and
historically in disk-encryption proposals where a sector must behave as a single block.

---

## How to Run Locally

`​``bash
npm install
npm run dev          # http://localhost:5173/crypto-lab-sphinx-mix/

npm test             # unit, failure-path and spec-KAT suites (Vitest)
npm run build        # typechecks src/ and e2e/, then builds

npx playwright install chromium   # NOT --with-deps
npm run test:a11y    # axe WCAG 2.1 A/AA gate against the production build
npm run test:claims  # the page-tells-the-truth suite
`​``

`npm run test:a11y` and `npm run test:claims` both build first and serve the result on port
4646, so what they judge is what ships.

---

## Related Demos

* **Feistel Forge** — DES: a *balanced* sixteen-round Feistel network. **LIONESS, the wide-block
  permutation protecting this lab's payload, is an unbalanced four-round Feistel network: the same
  construction doing a different job.** Feistel Forge's first exhibit shows why the round function
  `F` need not be invertible and the structure is still reversible — which is exactly the property
  LIONESS relies on to use a stream cipher and a hash as its rounds. Read them together.
* **Format Ward** — format-preserving encryption (SP 800-38G), the fleet's other Feistel, where
  the round structure is the whole point.
* **Blind Relay** — Oblivious HTTP. The other way to split metadata: two non-colluding parties,
  no mixing, low latency. The complement to this lab's trade.
* **ORAM Vault** and **Patron Shield** — hiding access patterns rather than routes.
* **Ring Sign**, **Credential Veil**, **Traitor Trace** — anonymity and unlinkability at the
  signature and credential layer rather than the network layer.
* **ChaCha20 Stream** — the stream cipher this lab uses for `ρ` and inside LIONESS.
* **Curve Lens** and **Point Arithmetic** — the elliptic-curve groundwork under ristretto255.

---

## Build & Verify

**70 unit tests across 7 files, all passing**, plus **14 claims tests** and **2 accessibility
tests** driving the production build in Chromium.

| Suite | File | Covers |
|---|---|---|
| Spec KATs | `src/sphinx/kat/kat.test.ts` (12 tests) | RFC 9496 App. A.1 — all 16 ristretto255 base-point multiples; RFC 9496 App. A.3 — 6 encodings a conforming decoder must reject; RFC 8439 App. A.1 blocks 0 and 1 and §2.4.2 encryption; RFC 4231 — all 7 HMAC-SHA-256 cases including the 128-bit truncation this lab's `γ` uses; FIPS 180-4 SHA-256/512 |
| End-to-end | `src/sphinx/roundtrip.test.ts` | round-trip at every path length 1–5; the header identical in size at all of them; the identifier reaching only the exit; every mix deriving the secret the sender predicted; empty and maximum-length messages |
| Failure paths | `src/sphinx/failures.test.ts` | all five failure codes reached through the real path, plus the MAC-before-replay ordering that stops a one-byte denial of service |
| Diffusion/format diagnostics (not an unlinkability proof) | `src/sphinx/unlinkability.test.ts` | Hamming distance within 6σ of `8n/2` for header, group element and payload; a χ² test on the output byte distribution; coincidental byte matches asserted as *expected*, not as a defect |
| LIONESS | `src/sphinx/lioness.test.ts` | permutation in both directions; one flipped bit randomising the whole 1024-byte block, at five positions; the stream-cipher contrast measured at exactly one bit |
| Tagging | `src/sphinx/tagging.test.ts` | header flip caught at the next hop; payload flip caught by nobody and arriving destroyed; `γ` recomputed identically after a payload flip, which is the asymmetry made measurable |
| Traffic | `src/sphinx/traffic.test.ts` | the entropy arithmetic; NEG-1 as an executable fixture; the log₂(senders) ceiling; a bigger pool never lowering entropy; cover traffic filling pools that would otherwise strand packets |
| Claims | `e2e/claims.spec.ts` (14 tests) | NEG-1 against the live page; the Hamming distance re-derived *in the test* from the two hex dumps on screen; the filler length re-derived from the paper's formula; parts-sum-to-whole on header/payload/packet and instructions/filler; every failure path named on screen; retirement and no-op guards; the `[hidden]` cascade probe |
| Accessibility | `e2e/a11y.spec.ts` (2 tests) | WCAG 2.1 A/AA, zero violations and zero unexplained `incomplete` results, over ~40 driven states at 1280px and 380px |

Sphinx has no published test vectors, so the KATs pin every **primitive** the construction is
assembled from, at the exact call sites this lab uses — through `mulBase`, `rho` and
`truncatedMac`, not through the library directly, because a KAT that bypassed this lab's own
wrappers would still pass if the library were wired up wrong. The Sphinx layer above them is
covered by round-trip, failure-path and statistical property tests. Calling those KATs would be
claiming external validation this construction does not have.

The accessibility gate is not the retired fleet template: it sets `reducedMotion` through
`emulateMedia` and asserts from inside the page that it took effect, injects nothing, opens every
disclosure through its own `<summary>`, drives every panel through its real tab button, and
asserts axe's `incomplete` bucket alongside `violations` — with an arithmetic composite-aware
contrast walk, a per-side non-text-contrast oracle, a reflow check and a keyboard-reachability
check for scrolling regions, none of which axe has a rule for.

---

## Performance

Every figure is real cryptography in the browser, single-threaded.

| Operation | Cost |
|---|---|
| Build a 3-hop packet | 6 ristretto255 scalar multiplications + 3 LIONESS passes over 1024 bytes |
| Process one hop | 2 scalar multiplications (shared secret, blinding) + 1 LIONESS pass |
| Exhibit 6, largest configuration | 48 real packets over 3 hops each — roughly 1 second, built in chunks that yield to the event loop so the page keeps painting |

The dominant cost is the scalar multiplication, at roughly 2 ms per operation. Exhibit 6's
controls are capped at 8 senders × 2 messages × 2 cover packets deliberately: the ceiling is a
responsiveness budget, not a limit of the construction.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Privacy Pass

- **slug**: `crypto-lab-privacy-pass`
- **repo**: https://github.com/systemslibrarian/crypto-lab-privacy-pass
- **live**: https://systemslibrarian.github.io/crypto-lab-privacy-pass/
- **commit_sha**: `b615bfa927557234c46a10f6fbfe3217c4b3fec8` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `993a1a95dd32dbf677f52867b41d8c64221da083`
- **read_from**: working tree (clean)
- **category**: PRIVACY | PROTOCOLS  ·  **level**: advanced  ·  **--accent**: #F2C14E
- **MISSING FIELDS**: verification

**Name (H1)**: Privacy Pass  — _read from src/main.ts_

**Subtitle**: Anonymous tokens · VOPRF · RFC 9578  — _read from src/main.ts_

**Description**: Blind a token request, have the issuer evaluate it under a key it must prove it used, redeem it elsewhere, then ask both services to pool their ledgers and try to match a request.  — _read from src/main.ts_

**Why it matters**: This is the token behind CAPTCHA-free anti-bot and rate-limit checks that need a signal without needing an identity. Remove the blinding and the wire format stays familiar, but the privacy guarantee disappears.  — _read from src/main.ts_

**Card copy**: A token proves the issuer authorised someone without anyone — issuer, origin, or the two colluding — learning who. Remove the client's blind and nothing on the wire changes; the guarantee is simply gone.

**Chips**: VOPRF P-384 · DLEQ Proof · RFC 9578 · Hash-to-Curve

**Implements**: Hash-to-curve `src/oprf/voprf.ts:47`, OPRF `src/main.ts:3`, P-384 `src/oprf/voprf.ts:1`, Privacy Pass `src/main.ts:4`, SHA-256 `src/oprf/voprf.ts:25`, SHA-384 `src/oprf/voprf.ts:64`

**Attacks shown**: _none derived_

**References**: EC point arithmetic, OPAQUE, RSA

**Standards body**: IETF, NIST

**Implementation**: @noble

**Spec citations, exactly as written**:

- `ePrint 2026/2131` — first seen README.md:35 (3×)
- `eprint.iacr.org/2026/2131` — first seen README.md:35 (4×)
- `RFC 9380` — first seen README.md:5 (2×)
- `RFC 9474` — first seen README.md:37 (2×)
- `RFC 9497` — first seen README.md:61 (6×)
- `RFC 9576` — first seen README.md:31 (1×)
- `RFC 9577` — first seen README.md:31 (1×)
- `RFC 9578` — first seen README.md:5 (14×)
- `rfc9380` — first seen README.md:61 (1×)
- `rfc9474` — first seen README.md:31 (3×)
- `rfc9497` — first seen README.md:61 (10×)
- `rfc9578` — first seen README.md:61 (11×)

**README — What Can Go Wrong**:

```text
Removing the blind makes an issuer's input point directly comparable with a redemption. Skipping DLEQ verification lets an issuer evaluate under a different key than the one it published. A valid DLEQ proof for one client does not prove the issuer used that same key for every client; key consistency is deliberately not implemented here.
```

**Claims tested** (e2e/claims.spec.ts, 8 test(s)):

- `private blind issuance redeems but gives the colluding ledgers no match` — e2e/claims.spec.ts:52
    - :65 `toHaveLength` expected `bytes * 2` _(expression)_
    - :83 `toHaveCount` expected `0` _(literal)_
- `Blind RSA panel renders every manifest claim and source boundary` — e2e/claims.spec.ts:86
    - :88 `toBeVisible` expected _no expected value_ _(none)_
    - :90 `toContainText` expected `claim.text` _(expression)_
    - :92 `toContainText` expected `'290'` _(literal)_
    - :93 `toContainText` expected `'VOPRF path is not an RSA oracle'` _(literal)_
    - :94 `toHaveAttribute` expected `'href', 'https://systemslibrarian.github.io/crypto-lab-rsa-forge/#oracle-without-factoring'` _(expression)_
- `removing blinding produces an explicit link alarm` — e2e/claims.spec.ts:97
    - :99 `toBeVisible` expected _no expected value_ _(none)_
    - :110 `toHaveCount` expected `1` _(literal)_
    - :111 `toBe` expected `''` _(literal)_
- `valid proofs under client-specific keys redeem and reveal partitioning` — e2e/claims.spec.ts:114
    - :133 `toBe` expected `clients` _(expression)_
    - :138 `toHaveCount` expected `buckets` _(expression)_
- `an unpublished issuer key aborts issuance, and the token a careless client keeps is refused` — e2e/claims.spec.ts:142
    - :146 `toContainText` expected `'BROKEN unpublished-key mode'` _(literal)_
    - :149 `toHaveLength` expected `2` _(literal)_
    - :150 `toBe` expected `ledgerKeys[1].replace(/^answered under: /, '')` _(expression)_
    - :152 `toContainText` expected `'Token key id does not match the issuer public key'` _(literal)_
    - :153 `toBeDisabled` expected _no expected value_ _(none)_
- `a redeemed token cannot be replayed` — e2e/claims.spec.ts:156
    - :165 `toBeVisible` expected _no expected value_ _(none)_
- `mode changes retire stale results while selecting the same mode is a no-op` — e2e/claims.spec.ts:169
    - :175 `toContainText` expected `'Prior verdict retired'` _(literal)_
    - :177 `toBeDisabled` expected _no expected value_ _(none)_
- `[hidden] negative claim does not paint outside its fixture` — e2e/claims.spec.ts:180
    - :182 `toBeHidden` expected _no expected value_ _(none)_
    - :183 `toBe` expected `'none'` _(literal)_

**Mutation records** (2 file(s)):

- `e2e/verdict-mutations.json` (29158 bytes)
- `scripts/mutation.mjs` (13810 bytes)

<details><summary>Full README</summary>

```markdown
# Privacy Pass

## What It Is

An in-browser teaching demo of RFC 9578 token type `0x0001`: VOPRF(P-384, SHA-384). It performs real P-384 group arithmetic and RFC 9380 hash-to-curve through `@noble/curves`, while the blind, evaluation, DLEQ proof, finalization, token construction, and private redemption checks are visible in this repository. It is not production crypto: it has no HTTP transport, attester, rate-limit deployment model, key-consistency protocol, batching, or server-side protection.

## Exhibits

1. Issue a token to watch the client blind its token input, the issuer evaluate it, and the client reject or accept the DLEQ proof before finalizing.
2. Redeem the token at a separate origin. The origin recomputes the VOPRF output with the issuer key and rejects a reused nonce in the browser-session spent set. Both outcomes render green: the page compares the origin's decision against the one the protocol requires (first presentation accepted, every later one refused) and reserves the alarm colour for the origin disagreeing with that, so the refusal reads as the mechanism working rather than as a failure.
3. Pool the issuer and origin ledgers. Correct blinding leaves no equality-testable link; choosing `BROKEN: remove blinding` makes the matching input point visible and triggers an alarm.
4. Choose `BROKEN: per-client published key` to publish a different issuer key to each client in the fixture, and size that fixture with the client-roster control — two, three, or four clients. Every DLEQ proof verifies and every token redeems, but a colluding issuer and origin can partition the redemptions by key id, and the link map draws one line per key bucket at whichever size is running.
5. Choose `BROKEN: unpublished issuer key` to have the issuer answer under a key it never published. The DLEQ proof is valid under the issuer's own key and worthless against the published one, so the careful client aborts before finalizing, and the sub-panel shows the origin refusing the token a client that skipped that check would have kept.

## When to Use It

Use this to learn why Privacy Pass can convey an issuer's authorization without carrying an account identity into a different origin. Do not use this page as an implementation, interoperability target, or evidence that a deployment provides anonymity: deployment policy and key consistency are outside its scope.

## Live Demo

https://systemslibrarian.github.io/crypto-lab-privacy-pass/

Issue, redeem, replay, and deliberately break a token flow in one browser session. The three roles are local teaching objects, not network services.

## What Can Go Wrong

Removing the blind makes an issuer's input point directly comparable with a redemption. Skipping DLEQ verification lets an issuer evaluate under a different key than the one it published. A valid DLEQ proof for one client does not prove the issuer used that same key for every client; key consistency is deliberately not implemented here.

## Real-World Usage

Privacy Pass protocols support anonymous authorization tokens for applications such as challenge and abuse mitigation. RFC 9576 defines the architecture, RFC 9577 defines common token structures, and RFC 9578 defines this VOPRF token type. Type `0x0002` uses [Blind RSA](https://www.rfc-editor.org/rfc/rfc9474), is publicly verifiable, and is not implemented here.

## The Other Token Type: Blind RSA and √eNFS (2026)

Privacy Pass defines two issuance types: `0x0001` VOPRF, privately verifiable and used by this lab, and `0x0002` Blind RSA, publicly verifiable (RFC 9578 §§8.2.1–8.2.2). Shea et al. name Apple Private Access Tokens, Fastly, Persona, Cloudflare, and iCloud Private Relay as Blind RSA deployments ([IACR ePrint 2026/2131, §7.2](https://eprint.iacr.org/2026/2131.pdf)).

Blind RSA exposes an issuer as a raw RSA oracle on blinded values. Attack queries are indistinguishable from honest issuance queries, providing the phase-1 access required by √eNFS. Lysyanskaya proved RSABSSA secure under one-more RSA, but the paper argues that assumption does not model this delayed-target RSA attack ([RFC 9474 §7](https://www.rfc-editor.org/rfc/rfc9474#section-7); [ePrint §7.2](https://eprint.iacr.org/2026/2131.pdf)). The measured 1024-bit result took 1,380 CPU core-years over five months and made `2^32` oracle queries. Separately, the paper extrapolates that at 2048 bits the attack needs about `2^90` computation and `2^43` queries: roughly `2^38` CAPTCHAs at 30 tokens each. Cloudflare's more than `2^43` total HTTP requests per day are an infrastructure comparison, not available Blind RSA signing queries. The paper's hypothetical scale calculation assumes Apple's one-per-minute limit: about 17 million years for one device, or 2.3 days across 2.3 billion devices issuing at that rate. Persona's per-call price gives a hypothetical estimate of about $13 trillion. Key-rotation epochs range from hours to weeks (ePrint §7.2).

The paper's mitigations are frequent key rotation in the short term, larger keys in the medium term, and zero-knowledge proofs or post-quantum schemes in the long term. Use the VOPRF type when public verifiability is unnecessary. This lab does not run the attack: its VOPRF path is not an RSA oracle, so √eNFS does not apply to it. See the [Crypto Lab RSA Forge √eNFS section](https://systemslibrarian.github.io/crypto-lab-rsa-forge/#oracle-without-factoring) for the adjacent RSA demo.

## How to Run Locally

`​``bash
npm ci
npm run dev
`​``

## Related Demos

See the Crypto Lab [Blind Sign](https://crypto-lab.systemslibrarian.dev/) and [RSA Forge √eNFS section](https://systemslibrarian.github.io/crypto-lab-rsa-forge/#oracle-without-factoring), plus the OPAQUE demonstrations, for adjacent ideas. Blind RSA signatures and password OPRFs are different constructions with different privacy properties.

## Build & Verify

`​``bash
npm test
npm run build
npx playwright install chromium
npm run test:a11y
`​``

The unit suite has 16 tests. It iterates the vector corpus in `src/kat/`: 3 RFC 9497 Appendix A.4.2 P-384 VOPRF vectors and 5 RFC 9578 Appendix A.1 type-`0x0001` issuance vectors. `vite.config.ts` measures that corpus and defines the counts the page prints, and **the gate re-counts the same corpus from `e2e/claims.spec.ts` and compares each printed part to it** — the total and both halves. That second half is what the sentence here used to assume: until 2026-09-22 the oracle checked only that the total the page published equalled the two numbers the page itself printed, which is true of any pair of numbers it chooses to print, so a literal in `src/kat/` survived that check even when it was WRONG — a literal 4 rendered "9 vectors: 4 RFC 9497 … + 5 RFC 9578" over three RFC 9497 vectors with every test green. Any count that disagrees with the vectors on disk now fails (`M20`). The unit suite also covers strict request, response, and token parsing and serialization; the live Client, Issuer, and Origin exchange those byte encodings rather than sharing protocol objects. It also covers batch proofs, value-derived linkability, proof failures, and replay rejection. The Playwright gate runs 18 tests from 17 declarations — the overflow check runs at two viewports — covering WCAG 2.1 A/AA on every reachable protocol state, arithmetic palette contrast, responsive overflow, complete rendered wire lengths, all three broken modes, visual link counts at two fixture sizes, the fail-closed abort, replay, verdict retirement, `[hidden]` behavior, and verdict coverage. The implementation follows [RFC 9497](https://www.rfc-editor.org/rfc/rfc9497), [RFC 9578](https://www.rfc-editor.org/rfc/rfc9578), and [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380).

## Verdict Coverage

Every outcome this page renders carries a `data-verdict` marker and every number it renders
carries a `data-claim` marker, and `e2e/verdicts.spec.ts` derives coverage by walking the live
DOM rather than trusting a list. The walk is the denominator both coverage rules are applied
to, so it visits **every option of every control that changes what renders** — four modes, the
three client-roster sizes inside the mode they parameterise, four command buttons, and the
wire-values disclosure, whose contents do not render at all while it is closed. Per control, not
the cross-product. Five checks run:

- every marker the page renders, in either family, must appear in `e2e/verdict-mutations.json`
  with a mutation that forced it false, and every marker the manifest claims must actually
  render. Measurements are in that loop on the same terms as verdicts: a rendered number with no
  mutation fails the build;
- nothing may carry verdict styling, verdict vocabulary, or an unmarked number in a result region
  — "verdict styling" is resolved from the `--good` / `--alarm` tokens at runtime, so an inline
  colour with no class is caught as well as a copied class, and a number is caught by unit
  (`1,632 B`, `52 bytes`) or as a bare integer, because a number does not look like a claim and is
  invisible to the other two detectors;
- every recorded kill must go through `e2e/expect-verdict.ts`, which asserts a marker's text, its
  `data-result` and the palette it paints itself in as ONE claim, and **must be observed doing so
  at runtime**. The helpers append every `(spec, test, marker)` pair they EXECUTE to a run-scoped
  sink under `test-results/`, and the check reads that sink. It used to read the spec's source and
  ask whether the call appeared in the killing test's text, which is a mention rather than an
  assertion: commenting the call out left the text in place, and the rule was file-granular, so a
  call in any other test satisfied every record naming that file. Both now fail, because neither
  one runs. A test that did not run at all is also a failure rather than a skip — a check that
  cannot look must not report clean. Two of the recorded mutations (`M10`, `M5`) move only the
  state and would survive a `toContainText` kill. The pair is per test, so a decoy call on the same
  marker inside the same test still satisfies it — measured, not assumed, and noted in
  `e2e/coverage.ts`; what covers that case is re-applying the mutation, which is what the records
  in `e2e/verdict-mutations.json` are;
- the killing test may not build its expectation out of the marker it is asserting. Runtime
  observation cannot see this one — a tautological call really does execute — so this rule reads
  the argument's provenance: the claim expression, plus the declaration of every identifier it
  reaches, may not contain the marker's own selector, its name, or any id on the marker or an
  ancestor of it. That id list is read off the rendered page rather than typed into the rule.
  Reading a DIFFERENT region stays legal and is how the good oracles here work: the partition test
  counts key buckets off the origin ledger and then requires one drawn link per bucket;
- two negative controls run last. One replays the three escapes above against the rules
  themselves; the other appends a raw unmarked banner the way a careless builder would, an
  unmarked byte count and a bare integer in a ledger, and markers no mutation covers in both
  families, and fails unless every detector fires.

`e2e/verdict-mutations.json` records, for each of the fifteen markers, the source mutation, the
test that killed it, and the verbatim failure — with the passing baseline from the same run,
because a mutation without its baseline is not evidence of anything. Twenty mutations are
recorded; every one of them was re-run for the current tree in an isolated `git archive` checkout
with its own port, an exactly-one-occurrence patcher, and the built bundle's content hash
recorded before and after, because a patch that never applied reports as a survivor.

Two of the twenty exist because a measurement can be unfalsifiable rather than wrong. `M19`
replaces the counted key-bucket total with a literal `2`: it survived everything while the
fixture could only ever run two clients, which is why the client-roster control exists and why
`e2e/claims.spec.ts` runs that fixture at two sizes. `M20` puts a wrong literal where the KAT
count is measured; it survived while the oracle compared the page only to itself.

The specs run as three Playwright projects, and `verdict-coverage` `dependencies:` on `claims`,
because rules about what other tests executed have to run after them. A dependency project runs
its whole file list even when the command line names one file, so the `verdict-coverage` CI job —
`npx playwright test e2e/verdicts.spec.ts` — still runs `claims.spec.ts` first and still has a
run to judge. `verdict-coverage` is its own CI job, and `deploy` and `dependabot-auto-merge` both
`needs:` it, so the check can block.

## Performance

P-384 hash-to-curve and scalar multiplication run on demand when an experiment button is pressed. No secrets or spent-token state are persisted beyond the current page session.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

```

</details>

---

## Order Leak

- **slug**: `crypto-lab-order-leak`
- **repo**: https://github.com/systemslibrarian/crypto-lab-order-leak
- **live**: https://systemslibrarian.github.io/crypto-lab-order-leak/
- **commit_sha**: `f3de3fe9790fb595fdfaf9e8a4269e644eca04a7` (the commit these bytes were read from)
- **clone is 1 commit(s) behind** `origin/main` `4a4a060e074742449e678e49e02a8687927c4847`
- **read_from**: working tree (clean)
- **category**: PRIVACY | ATTACKS  ·  **level**: intermediate  ·  **--accent**: #A06CD5
- **MISSING FIELDS**: verification

**Name (H1)**: Order Leak  — _read from src/app.ts_

**Subtitle**: Property-preserving encryption · OPE · ORE  — _read from src/app.ts_

**Description**: Sort an encrypted column, run WHERE on it, then hand the same ciphertexts to an attacker with a census table and watch the column return without the key.  — _read from src/app.ts_

**Why it matters**: Encryption at rest is not the end of the conversation. Schemes that preserve equality or order for a database also publish the shape an inference attack needs.  — _read from src/app.ts_

**Card copy**: A column you can still sort or match on has already published the shape of its answers. Equality, order and a public distribution hand back the plaintext cell by cell — the key is never touched.

**Chips**: AES-GCM-SIV · BCLO OPE · CLWW ORE · Inference Attacks

**Implements**: AES `src/ppe/dte.ts:28`, AES-GCM `src/ppe/dte.ts:28`, AES-SIV `src/ppe/dte.ts:28`, HMAC `src/ppe/ope-bclo.ts:31`, SHA-256 `src/ppe/ope-bclo.ts:2`

**Attacks shown**: Frequency analysis `src/app.ts:291`

**References**: FF1

**Standards body**: IETF, NIST

**Implementation**: WebCrypto

**Spec citations, exactly as written**:

- `doi.org/10.1007/978-3-642-01001-9_13` — first seen README.md:33 (1×)
- `doi.org/10.1007/978-3-662-52993-5_24` — first seen README.md:33 (1×)
- `doi.org/10.1109/SP.2017.44` — first seen README.md:33 (1×)
- `doi.org/10.1145/2043556.2043566` — first seen README.md:33 (1×)
- `doi.org/10.1145/2810103.2813651` — first seen README.md:33 (1×)
- `doi.org/10.1145/2976749.2978379` — first seen README.md:33 (1×)
- `RFC 8452` — first seen README.md:33 (2×)
- `rfc8452` — first seen README.md:33 (1×)

**README — What Can Go Wrong**:

```text
Frequency ties are labelled ambiguous rather than guessed. Sorting is complete only for a dense column whose auxiliary distribution matches. Values outside the 8-bit OPE teaching domain are rejected. The randomized AES-GCM control uses a fresh 96-bit nonce for every row. It is not exempted from the attacks: the query and the recovery both run against it, and the verdict is computed from the bucket sizes they measure rather than asserted from the scheme name.

Row-count changes seal a replacement table transactionally: query controls pause while sealing, only the newest requested table may commit, and a delayed randomized query cannot overwrite a newer experiment's status.
```

**Claims tested** (e2e/claims.spec.ts, 16 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:58
    - :58 `toContainText` expected `'Dataset reshuffled to ${rows} rows'` _(expression)_
- `OPE sorting recovers dense age but fails explicitly on sparse salary` — e2e/claims.spec.ts:61
    - :73 `toHaveAttribute` expected `'data-score', '${rows}/${rows}'` _(expression)_
    - :78 `toHaveAttribute` expected `'data-score', '${rows}/${rows}'` _(expression)_
    - :88 `toBeDisabled` expected _no expected value_ _(none)_
- `changing auxiliary data retires recovery while a no-op scheme selection does not` — e2e/claims.spec.ts:91
    - :95 `toBeEnabled` expected _no expected value_ _(none)_
    - :102 `toBeDisabled` expected _no expected value_ _(none)_
- `a delayed randomized query cannot overwrite a newer experiment` — e2e/claims.spec.ts:105
- `overlapping row-count changes commit only the newest sealed table` — e2e/claims.spec.ts:127
    - :147 `toHaveValue` expected `'24'` _(literal)_
- `tiny datasets warn, the warning names the sample it judges, and hidden content stays unpainted` — e2e/claims.spec.ts:158
    - :160 `toHaveCount` expected `0` _(literal)_
    - :172 `toHaveCount` expected `0` _(literal)_
    - :180 `toBeHidden` expected _no expected value_ _(none)_
- `the randomized control survives a query and a recovery that both really run` — e2e/claims.spec.ts:183
    - :238 `toHaveAttribute` expected `'data-score', '0/${rows}'` _(expression)_
- `authenticated deterministic ciphertexts can still be recovered` — e2e/claims.spec.ts:248
    - :251 `toBeVisible` expected _no expected value_ _(none)_
    - :253 `toBeVisible` expected _no expected value_ _(none)_
    - :257 `toHaveAttribute` expected `'data-score', '0/${rows}'` _(expression)_
- `the sealed column shows the equality leak under DTE and the two panels stay aligned` — e2e/claims.spec.ts:260
    - :277 `expect` expected _no expected value_ _(none)_
- `the public histogram is the attacker's auxiliary table and it totals the sealed rows` — e2e/claims.spec.ts:291
- `pairwise MSDB tree and cumulative matching recover salary but shifted statistics degrade it` — e2e/claims.spec.ts:301
    - :319 `toHaveAttribute` expected `'data-score', '${rows}/${rows}'` _(expression)_
    - :331 `toHaveAttribute` expected `'data-score', '240/240'` _(expression)_
- `mismatched auxiliary support is named and recovery fails closed` — e2e/claims.spec.ts:334
    - :345 `toBeDisabled` expected _no expected value_ _(none)_
- `every column is interactive under DTE, OPE, ORE, and randomized control` — e2e/claims.spec.ts:348
    - :361 `toHaveAttribute` expected `'aria-pressed', 'true'` _(expression)_
    - :363 `toContainText` expected `scheme.status` _(expression)_
- `the live tradeoff explains that the database feature is also the attacker signal` — e2e/claims.spec.ts:368
    - :371 `toContainText` expected `'Find rows equal to a search value'` _(literal)_
    - :372 `toContainText` expected `'Equal values always produce equal ciphertexts'` _(literal)_
    - :373 `toContainText` expected `'Count repeated ciphertexts'` _(literal)_
    - :376 `toContainText` expected `'No stable pattern remains for a count or a rank to match'` _(literal)_
- `per-row verdicts follow the guess against the sealed truth` — e2e/claims.spec.ts:379
    - :395 `toHaveAttribute` expected `'data-score', '${rows}/${rows}'` _(expression)_
    - :403 `toHaveAttribute` expected `'data-score', '0/${rows}'` _(expression)_
- `a rogue population option cannot reach the status line as markup` — e2e/claims.spec.ts:417
    - :434 `toHaveCount` expected `0` _(literal)_

**Mutation records** (2 file(s)):

- `e2e/verdict-mutations.ts` (22138 bytes)
- `scripts/mutation.mjs` (18057 bytes)

<details><summary>Full README</summary>

```markdown
# Order Leak

## What It Is

Order Leak is a browser-only teaching demo of deterministic AES-GCM-SIV, an exact-hypergeometric BCLO teaching profile, and binary CLWW order-revealing encryption over an 8-bit domain. It demonstrates that ciphertext equality and order are useful database features and also inference signals. It is not production crypto: the domains are deliberately small, and the concrete HMAC-SHA-256 PRF encoding is a documented lab profile rather than a standardized wire format.

## Exhibits

1. The DBA view runs equality, range, and sorting queries on sealed values.
2. The attacker view receives only ciphertext observations and separately generated synthetic public data, then performs frequency matching, sorting, NKW cumulative matching, and pairwise MSDB-tree recovery.
3. Reveal scores every recovered cell against separately held truth. The randomized AES-GCM control is put through the same equality query and the same frequency attack as the leaky schemes, and the page reports what they returned at whatever row count is selected: no row matched, every stored ciphertext distinct, no bucket holding more than one row. Those figures are counted per run, not printed from the default — the claims suite runs the control at 240 rows and at 1,000 so a literal cannot be right at both.
4. The authentication fixture verifies every AES-GCM-SIV tag while showing that authentication does not hide equality leakage.
5. Matching and shifted auxiliary populations show how inference quality depends on public-data fit; a 24-row option warns that tiny samples are unstable.

## When to Use It

Use this to learn why encrypted database query features need an explicit leakage budget. Do not use it to select a database product, encrypt real records, or conclude that authenticated encryption alone prevents inference.

## Live Demo

https://systemslibrarian.github.io/crypto-lab-order-leak/

Choose any of the three columns, switch independently among DTE, OPE, ORE, and randomized AES-GCM, run a ciphertext query, recover it from public statistics, and reveal the cell-by-cell score. Every row stores the full three-column by four-scheme matrix; the controls select a real ciphertext, not a simulated view.

## What Can Go Wrong

Frequency ties are labelled ambiguous rather than guessed. Sorting is complete only for a dense column whose auxiliary distribution matches. Values outside the 8-bit OPE teaching domain are rejected. The randomized AES-GCM control uses a fresh 96-bit nonce for every row. It is not exempted from the attacks: the query and the recovery both run against it, and the verdict is computed from the bucket sizes they measure rather than asserted from the scheme name.

Row-count changes seal a replacement table transactionally: query controls pause while sealing, only the newest requested table may commit, and a delayed randomized query cannot overwrite a newer experiment's status.

## Real-World Usage

Property-preserving encryption was popularized for encrypted database query systems such as [CryptDB](https://doi.org/10.1145/2043556.2043566). Deterministic encryption leaks equality; OPE and ORE leak ordering. The constructions and attacks are grounded in [RFC 8452](https://www.rfc-editor.org/rfc/rfc8452), [Boldyreva et al.](https://doi.org/10.1007/978-3-642-01001-9_13), [Chenette et al.](https://doi.org/10.1007/978-3-662-52993-5_24), [Naveed et al.](https://doi.org/10.1145/2810103.2813651), [Durak et al.](https://doi.org/10.1145/2976749.2978379), and [Grubbs et al.](https://doi.org/10.1109/SP.2017.44).

## How to Run Locally

`​``bash
npm install
npm run dev
`​``

## Related Demos

[Crypto Lab](https://crypto-lab.systemslibrarian.dev/) includes related work on searchable encryption and format-preserving encryption. Those are explicit non-goals here: searchable encryption adds token and access-pattern questions, while format-preserving encryption is deterministic but does not preserve order.

## Build & Verify

`​``bash
npm test
npm run test:workflow
npm run build
npm run test:a11y
npm run test:mutations
`​``

The suite has 30 unit tests, 8 workflow-control tests, and 22 production-browser claim, verdict-coverage, and accessibility tests. A separate replay gate proves that all 12 recorded rendered-claim mutations are still caught. Two known-answer tests reproduce the RFC 8452 AES-128 and AES-256 empty-plaintext vectors. The suite also checks the live leakage explanation, full sealed matrix and ciphertext-only query API, atomic resealing and stale-query retirement, matching versus shifted auxiliary populations, all 65,536 CLWW comparisons, full-domain OPE monotonicity, exact hypergeometric support, dense-versus-sparse sorting behavior, grouped cumulative matching, pairwise MSDB tree reconstruction, malformed ciphertext rejection, per-session key material for all three schemes, attack-module isolation, randomized-control uniqueness, score arithmetic, support-mismatch rejection, edge cases, arithmetic text contrast, non-text contrast, reflow, and WCAG 2.1 A/AA across desktop and mobile states.

## Performance

The main demo uses 240-1,000 rows so each attack remains inspectable in a browser. The 24-row edge case is deliberately below the supported statistical range and displays a warning.

---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*

## Rendered verdicts

Every outcome the page renders carries a `data-verdict` marker and every rendered
MEASUREMENT carries a `data-claim` one. Both families are held to the same rule: each
marker has a recorded §4.1c mutation in `e2e/verdict-mutations.ts` naming the edit that
forces it false, the passing baseline from the same run, and the assertion that then
failed.

A marker's words and its state are ONE claim. `e2e/expect-marker.ts` is the only way this
lab asserts one: `expectVerdict` checks the text, the `data-result` and the pass/fail
class in a single call, and `expectClaim` checks a measurement's text and its `data-value`
together. The record carries the mutation that proves this is load-bearing: moving a
per-row verdict's state while leaving its words alone is caught on `data-result` and the
paint, with no text assertion failing at all.

**That every recorded mutation goes through those helpers is checked over what RAN, not
over the spec's source text.** The rule here until 2026-09-22 matched
`expectVerdict(page, '<id>'` as a string in `e2e/claims.spec.ts`, and this README claimed
it made "a spec that merely mentions a marker id" fail the build. It did not. A mention is
what it enforced, and an independent audit defeated it three ways: comment the call out and
the string survives; keep the call but feed it values read off the page in the same test,
so it holds for any page; or satisfy the file-wide match from an unrelated call in another
test. The middle one was this lab's — with it in place the recorded `public-value` mutation
shipped the attacker's histogram as `["0","1","2","3"]` instead of the four department
names, gate green.

What is enforced now:

- each helper appends the `(test title, marker)` pair it **executes** to a run-scoped file,
  and the coverage job fails on any recorded mutation whose pair nobody executed. All three
  escapes above fail it, each naming the marker and the test;
- a helper handed an expectation that came back from a page read of the same marker throws
  rather than asserting, because such a call compares the page to itself;
- `claims.spec.ts` may not read page content by any other route (`textContent`,
  `getAttribute`, `evaluateAll`, an assigned `page.evaluate`), which leaves
  `expect-marker.ts` as the only way it can learn what the page says. This last one **is** a
  source scan, and it is a bypass guard on a runtime rule rather than the rule itself.

`npm run test:verdicts` runs the claims suite first (the pairs do not exist until it has
run) and then derives coverage by walking the rendered page rather than from any hand-kept
list. It fails if the page renders a marker with no recorded mutation, and separately if a
verdict word, verdict styling, or an unmarked number is rendered outside a marker -- which
is what catches a later contributor pasting in a raw banner, or painting a figure nothing
asserts. Three further tests prove those checks can fail: one adds exactly such a banner and
exactly such a number, one feeds a helper the page's own answer, and one asserts that a pair
nothing executed is not recorded as executed.

The denominator for all of that is `driveEveryState`, which visits every option of every
control that changes what renders: the column and scheme segments, the four row counts and
the three public populations. That is not decoration -- the `sample-warning` verdict
renders at exactly one row count, and before this walk existed it sat outside the set both
coverage rules enumerate over, unmarked and unrecorded, with every check green.

Every rendered aggregate is judged at more than one row count for the same reason. The ORE
comparison count is derived as `n(n-1)/2` and asserted at 240 rows and at 1,000; so are the
randomized control's distinct-ciphertext and bucket figures, which until 2026-09-22 had one
oracle running at the default only. With that single oracle, a page holding the literals
`240 of 240` and `240 rows into 240 ... largest 1` rendered *"matched 0 of 1000 sealed rows
... and 240 of 240 stored ciphertexts are distinct"* — two different row counts in one
sentence — with every test green. Both literals now die on the 1,000-row pass, and the
mutation that proves it is in the record.

The job runs as its own required check and `deploy` needs it, so neither a merge nor a
direct push to main can ship past it.


```

</details>

---

## DC-net

- **slug**: `crypto-lab-dc-net`
- **repo**: https://github.com/systemslibrarian/crypto-lab-dc-net
- **live**: https://systemslibrarian.github.io/crypto-lab-dc-net/
- **commit_sha**: `339b660be6d37424e73c75bd2629568e4fe47cda` (the commit these bytes were read from)
- **read_from**: working tree (clean)
- **category**: PRIVACY | PROTOCOLS  ·  **level**: intermediate  ·  **--accent**: #65d9c5
- **MISSING FIELDS**: verification

**Name (H1)**: DC-net  — _read from src/ui/app.ts_

**Subtitle**: Dining cryptographers · anonymous broadcast · XOR masks  — _read from src/ui/app.ts_

**Description**: Give every neighboring pair one fresh shared mask, XOR each participant’s masks into one public contribution, and watch every mask cancel without naming the sender.  — _read from src/ui/app.ts_

**Why it matters**: A DC-net can hide who sent a bit without hiding the bit itself. The same algebra also makes collisions ambiguous, disruption cheap, and mask reuse catastrophic.  — _read from src/ui/app.ts_

**Card copy**: Cancel five participants’ pairwise XOR masks to reveal one anonymous public message, compare observer and coalition views, then execute collisions, jamming, dropout, commitment, reuse and later-disclosure failures.

**Chips**: DC-net · Pairwise XOR · Coalition Views · Disruption

**Implements**: DC-net `src/dcnet/round.ts:171`, SHA-256 `src/dcnet/commitment.ts:148`

**Attacks shown**: Known-plaintext attack `src/ui/app.ts:166`

**References**: Shamir secret sharing

**Standards body**: NIST

**Implementation**: WebCrypto SHA-256 and random generation / local TypeScript DC-net and exhaustive finite observer models

**Spec citations, exactly as written**:

- `10.1007/BF00206326` — first seen README.md:79 (2×)
- `doi.org/10.1007/BF00206326` — first seen README.md:79 (2×)
- `FIPS 180-4` — first seen README.md:82 (2×)

**README — What Can Go Wrong**:

```text
- A one-sender round reveals the message to everyone. DC-net protects compatible sender identity under its assumptions; it is not message encryption or receiver anonymity.
- An even number of `1` inputs aggregates to `0`, and an odd number aggregates to `1`. For longer messages, concurrent payloads XOR and can cancel, look corrupted, or accidentally look valid. Basic DC-net does not count senders or reliably detect collisions.
- A contribution with an unknown or duplicate participant label or the wrong length is malformed and is rejected by this lesson. A malicious participant can instead publish arbitrary bytes of the correct shape and jam the result without being identified by the basic protocol.
- Under SHA-256 collision and second-preimage resistance, the modeled commitment binds a participant label to the contribution and context encoded here. A fresh unpredictable 32-byte nonce raises the cost of enumerating the one-byte contribution before reveal; this lesson does not claim a formal hiding theorem. With all commitments collected before any reveal, it blocks one adaptive last-speaker strategy. It does not prove that the contribution follows the DC-net equation, stop a precommitted jammer, force a reveal, authenticate a participant, or provide Dissent/Verdict-style accountability.
- A missing participant makes incident masks appear only once, so the current round must abort. To continue without that participant, reform the membership and key graph and draw new masks; treating the absent contribution as zero corrupts the algebra.
- Reusing every mask incident to a participant exposes that participant's input XOR across the two transcripts. If one input is known to be empty, the other input is recovered directly.
- Recorded broadcasts can become more revealing if supposedly erased masks are disclosed later. JavaScript cannot prove erasure or prevent a participant from retaining key material.
- Coalition knowledge is graph-dependent. A cut set can split honest participants into smaller components, and a singleton component has no sender anonymity from that observer.
- All participants, observers, randomness, commitments, and attacks execute in one browser origin. The roles are views over one model, not process, hardware, transport, or trust isolation.
- The model supplies no production membership, Sybil defense, source authentication, transport privacy, availability, collision resolution, disruption accountability, durable state, or side-channel resistance.

See [SECURITY.md](SECURITY.md) and [docs/a-d-04-brief.md](docs/a-d-04-brief.md) for the precise model and acceptance mapping.
```

**Claims tested** (e2e/claims.spec.ts, 29 test(s)):

- `(assertions outside a test block)` — e2e/claims.spec.ts:47
    - :47 `toEqual` expected `[]` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:52
    - :52 `toHaveTitle` expected `"DC-net — crypto-lab"` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:53
    - :53 `toHaveText` expected `"DC-net"` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:54
    - :54 `toHaveAttribute` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:63
    - :63 `toHaveAttribute` expected `"aria-selected", "true"` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:64
    - :64 `toBeVisible` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:77
    - :77 `toHaveLength` expected `1` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:99
    - :99 `toMatch` expected `/^[0-9a-f]{2}$/` _(regex)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:108
    - :108 `toHaveLength` expected `1` _(literal)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:149
    - :149 `toBe` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:173
    - :173 `toEqual` expected `EDGES.map(([id]) => id)` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:174
    - :174 `toEqual` expected `PARTICIPANTS` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:175
    - :175 `toEqual` expected `PARTICIPANTS` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:182
    - :182 `toBe` expected `expected` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:183
    - :183 `toBe` expected `expected` _(expression)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:185
    - :185 `toBe` expected _no expected value_ _(none)_
- `(assertions outside a test block)` — e2e/claims.spec.ts:188
    - :188 `toBe` expected _no expected value_ _(none)_
- `DC-net learner-visible claims` — e2e/claims.spec.ts:193
- `fixed transcript derives every mask, broadcast, and aggregate` — e2e/claims.spec.ts:194
    - :200 `toEqual` expected `FIXTURE_MASKS` _(expression)_
    - :201 `toEqual` expected `{ A: 0, B: 0, C: 0, D: 0x48, E: 0 }` _(expression)_
    - :202 `toEqual` expected `FIXTURE_BROADCASTS` _(expression)_
    - :203 `toEqual` expected `FIXTURE_BROADCASTS` _(expression)_
    - :204 `toBe` expected `0x48` _(expression)_
    - :207 `expect` expected _no expected value_ _(none)_
    - :210 `toHaveAttribute` expected _no expected value_ _(none)_
- `public transcripts expose contributions but not simulator secrets` — e2e/claims.spec.ts:216
    - :221 `toHaveCount` expected `1` _(literal)_
    - :222 `toHaveCount` expected `0` _(literal)_
    - :223 `expect` expected _no expected value_ _(none)_
    - :238 `toContainText` expected _no expected value_ _(none)_
    - :244 `toHaveCount` expected `0` _(literal)_
    - :245 `expect` expected _no expected value_ _(none)_
    - :253 `toHaveCount` expected `0` _(literal)_
    - :254 `expect` expected _no expected value_ _(none)_
- `fresh browser rounds still satisfy independently recomputed equations` — e2e/claims.spec.ts:259
    - :266 `toHaveAttribute` expected _no expected value_ _(none)_
    - :272 `toEqual` expected `{ A: 0, B: 0xa7, C: 0, D: 0, E: 0 }` _(expression)_
    - :273 `toBe` expected `0xa7` _(expression)_
    - :275 `toHaveAttribute` expected _no expected value_ _(none)_
    - :279 `toContainText` expected _no expected value_ _(none)_
- `input freshness distinguishes changes, no-ops, restoration, and rejection` — e2e/claims.spec.ts:284
    - :293 `toHaveAttribute` expected `"data-stale", "false"` _(expression)_
    - :294 `toContainText` expected _no expected value_ _(none)_
    - :299 `toHaveAttribute` expected `"data-stale", "true"` _(expression)_
    - :300 `toContainText` expected _no expected value_ _(none)_
    - :305 `toHaveAttribute` expected `"data-stale", "false"` _(expression)_
    - :309 `toHaveAttribute` expected `"data-stale", "true"` _(expression)_
    - :310 `toContainText` expected _no expected value_ _(none)_
    - :313 `toBe` expected `originalAggregate` _(expression)_
    - :317 `toHaveAttribute` expected `"data-stale", "false"` _(expression)_
    - :318 `toBe` expected `originalAggregate` _(expression)_
    - :323 `toHaveAttribute` expected `"data-stale", "false"` _(expression)_
    - :325 `toHaveAttribute` expected `"data-stale", "true"` _(expression)_
    - :327 `toHaveAttribute` expected `"data-stale", "false"` _(expression)_
    - :334 `toHaveAttribute` expected `"data-stale", "false"` _(expression)_
    - :336 `toHaveAttribute` expected `"data-stale", "true"` _(expression)_
    - :338 `toHaveAttribute` expected `"data-stale", "false"` _(expression)_
- `observer components, candidates, and priors match the five-cycle algebra` — e2e/claims.spec.ts:341
    - :387 `toHaveAttribute` expected `"data-stale", "false"` _(expression)_
    - :388 `toBe` expected _no expected value_ _(none)_
    - :391 `toBe` expected _no expected value_ _(none)_
    - :400 `expect` expected _no expected value_ _(none)_
    - :415 `toBe` expected _no expected value_ _(none)_
    - :419 `expect` expected _no expected value_ _(none)_
    - :422 `toBe` expected _no expected value_ _(none)_
    - :426 `toBe` expected `"32"` _(literal)_
    - :427 `expect` expected _no expected value_ _(none)_
    - :434 `toHaveAttribute` expected `"data-stale", "true"` _(expression)_
    - :441 `expect` expected _no expected value_ _(none)_
    - :453 `toEqual` expected `[` _(expression)_
- `the exhaustive one-bit marker agrees with an independent 32-world oracle` — e2e/claims.spec.ts:461
    - :498 `toBe` expected `32` _(literal)_
    - :499 `toEqual` expected `d` _(expression)_
    - :500 `toEqual` expected `d` _(expression)_
    - :501 `expect` expected _no expected value_ _(none)_
    - :507 `expect` expected _no expected value_ _(none)_
- `zero through three senders reveal parity, not a sender count` — e2e/claims.spec.ts:512
    - :545 `toHaveLength` expected `count` _(expression)_
    - :546 `toBe` expected `count % 2` _(expression)_
    - :547 `toBe` expected `parity` _(expression)_
    - :548 `toBe` expected `parity` _(expression)_
    - :549 `toBe` expected _no expected value_ _(none)_
    - :552 `toBe` expected _no expected value_ _(none)_
    - :556 `toContainText` expected _no expected value_ _(none)_
    - :561 `toContainText` expected _no expected value_ _(none)_
    - :571 `toHaveLength` expected `2` _(literal)_
    - :583 `toBe` expected `byteEvidence[0]!.right` _(expression)_
    - :584 `toBe` expected `0` _(literal)_
    - :585 `expect` expected _no expected value_ _(none)_
    - :591 `toBe` expected `row.left ^ row.right` _(expression)_
    - :592 `toBe` expected `"match"` _(literal)_
- `malformation, shaped jamming, dropout, and reformation stay distinct` — e2e/claims.spec.ts:596
    - :604 `toBe` expected `"48"` _(literal)_
    - :605 `toBe` expected _no expected value_ _(none)_
    - :608 `expect` expected _no expected value_ _(none)_
    - :612 `toBe` expected `"ok"` _(literal)_
    - :613 `toBe` expected `"B"` _(literal)_
    - :614 `toBe` expected `"true"` _(literal)_
    - :616 `toBe` expected `0x48 ^ FIXTURE_BROADCASTS.B! ^ 0xff` _(expression)_
    - :617 `expect` expected _no expected value_ _(none)_
    - :621 `toBe` expected `"missing"` _(literal)_
    - :622 `toBe` expected `"C"` _(literal)_
    - :623 `toBe` expected `"false"` _(literal)_
    - :636 `toBe` expected `"BC,CD"` _(literal)_
    - :637 `toBe` expected _no expected value_ _(none)_
    - :644 `toBe` expected `0x48` _(expression)_
    - :645 `toBe` expected `FIXTURE_MASKS.BC! ^ FIXTURE_MASKS.CD!` _(expression)_
    - :646 `toBe` expected `presentInputXor ^ boundaryMaskXor` _(expression)_
    - :647 `toBe` expected `expectedPartial` _(expression)_
    - :648 `toBe` expected _no expected value_ _(none)_
    - :651 `expect` expected _no expected value_ _(none)_
    - :655 `toBe` expected _no expected value_ _(none)_
    - :658 `toBe` expected `"A,B,D,E"` _(literal)_
    - :659 `toBe` expected `"48"` _(literal)_
    - :678 `toEqual` expected `[` _(expression)_
    - :699 `toBe` expected `row.previous` _(expression)_
    - :701 `toBe` expected `"true"` _(literal)_
    - :702 `toContainText` expected _no expected value_ _(none)_
    - :705 `toContainText` expected _no expected value_ _(none)_
    - :708 `expect` expected _no expected value_ _(none)_
- `commitments bind the complete stated context but not honest behavior` — e2e/claims.spec.ts:713
    - :720 `toHaveAttribute` expected `"data-stale", "false"` _(expression)_
    - :723 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :724 `toBe` expected _no expected value_ _(none)_
    - :736 `toBe` expected _no expected value_ _(none)_
    - :754 `toBe` expected `"true"` _(literal)_
    - :756 `toContainText` expected `"does not authenticate labels"` _(literal)_
    - :757 `toContainText` expected `"Dissent/Verdict-style blame"` _(literal)_
    - :758 `toContainText` expected _no expected value_ _(none)_
    - :761 `toContainText` expected `"no formal hiding theorem is claimed"` _(literal)_
    - :764 `toHaveAttribute` expected `"data-stale", "false"` _(expression)_
    - :766 `toMatch` expected `/^[0-9a-f]{64}$/` _(regex)_
    - :767 `toBe` expected `firstDigest` _(expression)_
- `mask reuse and later disclosure independently recover the displayed inputs` — e2e/claims.spec.ts:770
    - :782 `expect` expected _no expected value_ _(none)_
    - :807 `toEqual` expected `PARTICIPANTS` _(expression)_
    - :827 `expect` expected _no expected value_ _(none)_
    - :830 `expect` expected _no expected value_ _(none)_
    - :833 `toBe` expected `first ^ second` _(expression)_
    - :834 `toBe` expected `broadcastXor` _(expression)_
    - :835 `toBe` expected `inputXor` _(expression)_
    - :836 `toBe` expected `expectedInputs[index]` _(expression)_
    - :837 `toBe` expected _no expected value_ _(none)_
    - :846 `toEqual` expected `PARTICIPANTS` _(expression)_
    - :878 `toBe` expected `0` _(literal)_
    - :879 `toBe` expected `expectedInputs[index]` _(expression)_
    - :880 `toBe` expected _no expected value_ _(none)_
    - :888 `toBe` expected `firstBroadcast ^ nextBroadcast` _(expression)_
    - :889 `toBe` expected `firstInput ^ nextInput` _(expression)_
    - :890 `toBe` expected `inputXor` _(expression)_
    - :891 `expect` expected _no expected value_ _(none)_
    - :898 `toHaveAttribute` expected _no expected value_ _(none)_
    - :902 `expect` expected _no expected value_ _(none)_
    - :905 `toContainText` expected _no expected value_ _(none)_
    - :908 `toContainText` expected _no expected value_ _(none)_
    - :912 `toBe` expected `"D"` _(literal)_
    - :914 `toBe` expected `FIXTURE_BROADCASTS.D` _(expression)_
    - :915 `toBe` expected `"CD,DE"` _(literal)_
    - :921 `expect` expected _no expected value_ _(none)_
    - :935 `toBe` expected `recorded ^ FIXTURE_MASKS.CD! ^ FIXTURE_MASKS.DE!` _(expression)_
    - :936 `toBe` expected `0x48` _(expression)_
    - :937 `expect` expected _no expected value_ _(none)_
    - :940 `toContainText` expected _no expected value_ _(none)_
    - :943 `toContainText` expected _no expected value_ _(none)_
- `visible limits and primary comparisons do not overstate the model` — e2e/claims.spec.ts:948
    - :963 `expect` expected _no expected value_ _(none)_
    - :965 `toMatch` expected `/\p{Extended_Pictographic}/u` _(regex)_
    - :983 `toHaveAttribute` expected _no expected value_ _(none)_
    - :988 `toContainText` expected _no expected value_ _(none)_
    - :991 `toContainText` expected _no expected value_ _(none)_
    - :994 `toContainText` expected _no expected value_ _(none)_

**Mutation records** (1 file(s)):

- `scripts/claim-mutations.mjs` (21254 bytes)

<details><summary>Full README</summary>

```markdown
# DC-net

## What It Is

DC-net is an executable lesson about the dining-cryptographers anonymous-broadcast protocol. Five participants share pairwise masks along a declared ring, publish one masked contribution each, and recover the XOR of their input messages without revealing which compatible participant supplied a lone nonzero message. The page computes every mask, contribution, aggregate, observer view, coalition view, collision, disruption, and mask-reuse result from the TypeScript implementation. An optional SHA-256 commit/reveal exercise is a separately labeled teaching adaptation for one narrow last-speaker problem; it is not a disruption-accountability protocol. This is a bounded browser model, not an anonymous messaging service.

### One DC-net round

For participant `v`, input bit vector `x_v`, and every pairwise mask `k_e` on an edge incident to `v`, the broadcast is:

`​``text
b_v = x_v XOR XOR(k_e for every edge e incident to v)
`​``

Every edge mask appears at both endpoints. XORing all broadcasts therefore cancels every mask twice:

`​``text
XOR(b_v for every v) = XOR(x_v for every v)
`​``

The honest path requires each edge mask to be independent, fresh, uniformly distributed in the ideal model, the same length as the message, and used for one round only. The browser obtains concrete masks from Web Crypto's cryptographically strong random source. That is a practical CSPRNG-backed execution, not experimental proof of the information-theoretic theorem. Unit tests separately enumerate every mask assignment in small fixtures and compare complete transcript distributions.

The output hides the sender under the stated graph and observer knowledge; it does not hide the message. With exactly one sender, the aggregate is that sender's message. With multiple simultaneous senders, the aggregate is their bitwise XOR.

### What an observer can infer

The key-sharing graph is public and is not the transport topology. To model an observer or coalition, remove the edges whose masks that observer knows. Each remaining connected component is an anonymity set, and the transcript reveals the XOR parity of the inputs in that component. Participants also know their own inputs, while coalition members pool their inputs and incident masks.

The default five-participant ring makes those distinctions executable:

- an outside observer that knows no masks sees one connected component containing all five participants;
- a single non-sender knows their own input and incident masks but cannot distinguish the other four connected participants; and
- coalition `{A, C}` removes its incident edges, isolates `B`, and leaves `D` connected to `E`; when `D` is the one sender, the compatible set is exactly `{D, E}`.

A “possible sender” result always depends on the declared exactly-one-sender assumption. With multiple senders, component parity is not a sender list. Equal transcript likelihoods also do not manufacture equal prior probabilities: the posterior renormalizes the priors supplied to the model and is uniform only when those priors were uniform.

## Exhibits

1. **Fresh masks cancel** runs a complete ring round, displays every input, edge mask, participant broadcast, and the independently checked aggregate.
2. **Who remains possible?** compares the outside observer, one participant, and a coalition by removing exactly the masks each view knows and deriving the remaining connected components and component parities.
3. **Collision and disruption** contrasts zero, one, two, and three simultaneous senders; malformed encodings; a correctly shaped arbitrary contribution; and a missing participant.
4. **Reuse and later disclosure** shows that reusing the same masks makes two public participant transcripts cancel to the XOR of that participant's two inputs, and that later disclosure of recorded-round masks can shrink or destroy past anonymity.
5. **Commit before reveal** hashes a canonically encoded session, round, participant, membership, graph, contribution length, contribution, and fresh 32-byte nonce before reveals begin, then tests changed and withheld reveals without claiming accountability.

## When to Use It

- Use it to inspect the classical DC-net cancellation mechanism, because the page exposes the real inputs, pairwise masks, participant broadcasts, and XOR aggregate.
- Use it for reasoning about observer and coalition knowledge, because anonymity sets are recomputed from the declared key graph rather than asserted in prose.
- Use it to study collisions, disruption, dropout, commitments, and mask reuse, because each limitation changes an executable result under a named assumption.
- Do not use it to carry real anonymous messages, because it is a demo app and does not provide hardened operational controls.

## Live Demo

Open [DC-net on GitHub Pages](https://systemslibrarian.github.io/crypto-lab-dc-net/). Run the honest round first, inspect the observer views, then compare collision, jammer, dropout, commitment, reuse, and disclosure cases.

## What Can Go Wrong

- A one-sender round reveals the message to everyone. DC-net protects compatible sender identity under its assumptions; it is not message encryption or receiver anonymity.
- An even number of `1` inputs aggregates to `0`, and an odd number aggregates to `1`. For longer messages, concurrent payloads XOR and can cancel, look corrupted, or accidentally look valid. Basic DC-net does not count senders or reliably detect collisions.
- A contribution with an unknown or duplicate participant label or the wrong length is malformed and is rejected by this lesson. A malicious participant can instead publish arbitrary bytes of the correct shape and jam the result without being identified by the basic protocol.
- Under SHA-256 collision and second-preimage resistance, the modeled commitment binds a participant label to the contribution and context encoded here. A fresh unpredictable 32-byte nonce raises the cost of enumerating the one-byte contribution before reveal; this lesson does not claim a formal hiding theorem. With all commitments collected before any reveal, it blocks one adaptive last-speaker strategy. It does not prove that the contribution follows the DC-net equation, stop a precommitted jammer, force a reveal, authenticate a participant, or provide Dissent/Verdict-style accountability.
- A missing participant makes incident masks appear only once, so the current round must abort. To continue without that participant, reform the membership and key graph and draw new masks; treating the absent contribution as zero corrupts the algebra.
- Reusing every mask incident to a participant exposes that participant's input XOR across the two transcripts. If one input is known to be empty, the other input is recovered directly.
- Recorded broadcasts can become more revealing if supposedly erased masks are disclosed later. JavaScript cannot prove erasure or prevent a participant from retaining key material.
- Coalition knowledge is graph-dependent. A cut set can split honest participants into smaller components, and a singleton component has no sender anonymity from that observer.
- All participants, observers, randomness, commitments, and attacks execute in one browser origin. The roles are views over one model, not process, hardware, transport, or trust isolation.
- The model supplies no production membership, Sybil defense, source authentication, transport privacy, availability, collision resolution, disruption accountability, durable state, or side-channel resistance.

See [SECURITY.md](SECURITY.md) and [docs/a-d-04-brief.md](docs/a-d-04-brief.md) for the precise model and acceptance mapping.

## Real-World Context

David Chaum's original construction uses one-time shared key bits for unconditional sender untraceability under its graph and observer assumptions, and discusses pseudorandom expansion as a computational alternative. The lesson keeps those cases distinct: its exhaustive finite model reasons about uniform one-use masks, while its interactive browser run uses Web Crypto randomness.

Dissent and Verdict address operational problems beyond this lesson. Dissent combines scheduled DC-net runs with accountable group messaging machinery; Verdict uses proactively verifiable DC-nets and zero-knowledge proofs to reject malformed contributions before disruption. They are comparisons here, not implemented protocols or properties inherited by the SHA-256 commitment exercise.

Primary sources:

- David Chaum, [The Dining Cryptographers Problem: Unconditional Sender and Recipient Untraceability](https://ir.cwi.nl/pub/2438), _Journal of Cryptology_ 1(1), 1988, pp. 65–75; [DOI 10.1007/BF00206326](https://doi.org/10.1007/BF00206326).
- Henry Corrigan-Gibbs and Bryan Ford, [Dissent: Accountable Anonymous Group Messaging](https://bford.info/pub/net/dissent-abs/), ACM CCS 2010.
- Henry Corrigan-Gibbs, David Isaac Wolinsky, and Bryan Ford, [Proactively Accountable Anonymous Messaging in Verdict](https://www.usenix.org/conference/usenixsecurity13/technical-sessions/presentation/corrigan-gibbs), USENIX Security 2013.
- NIST, [FIPS 180-4: Secure Hash Standard](https://csrc.nist.gov/pubs/fips/180-4/upd1/final), the SHA-256 definition used by the bounded commitment adaptation.
- W3C, [Web Cryptography API, 2017 Recommendation](https://www.w3.org/TR/2017/REC-WebCryptoAPI-20170126/), the browser interface used for random generation and SHA-256.

## How to Run Locally

Use Node.js 22.13 or newer within the 22.x line, Node.js 24.x, or Node.js 26 or newer. The lab has no runtime package dependency; its cryptographic random generation and SHA-256 commitment use the browser's Web Crypto implementation.

`​``sh
npm ci
npm run dev
`​``

The application is a static browser lesson with no backend, accounts, network peers, or persistent secrets.

## Related Demos

- [Sphinx Mix](https://systemslibrarian.github.io/crypto-lab-sphinx-mix/) executes packet construction and peeling under a different anonymity and traffic model.
- [Blind Relay](https://systemslibrarian.github.io/crypto-lab-blind-relay/) separates source identity and HTTP content across operators rather than using a DC-net key graph.
- [Silent Tally](https://systemslibrarian.github.io/crypto-lab-silent-tally/) privately aggregates Shamir-shared counts; its threshold and output goals are different from anonymous broadcast.

## Build & Verify

The unit suite covers graph validation, exact XOR cancellation, exhaustive small-graph transcript distributions, participant and coalition views, component parity, prior-preserving posteriors, collision parity, malformed and correctly shaped dishonest contributions, dropout, new-draw handling, exact full-assignment replay refusal, reuse, later disclosure, and commitment context/reveal failures. Browser claim tests independently parse and recompute learner-visible masks, broadcasts, aggregates, connected components, candidate sets, posteriors, and refusal states rather than trusting application labels.

Accessibility checks traverse the honest and adversarial states, fail on axe violations or incomplete results, verify text and non-text contrast, keyboard and live-region behavior, reduced motion, dark-theme behavior under both operating-system preferences, and 320/380/390/768/1440-pixel reflow. The mutation runner starts from a clean committed baseline, requires each concrete source mutation to change the production bundle and fail its named owning assertion, restores the exact source bytes, and proves the restored assertion again.

`​``sh
npm run format:check
npm run typecheck
npm run lint
npm run test:coverage
npm run build
npm audit --audit-level=high
npx playwright install chromium
npm run test:claims
npm run test:a11y
npm run test:mutations
`​``

`npm run ci` runs the static, unit, coverage, and production-build portion. The mutation command intentionally requires a clean committed tree. GitHub Actions requires both the application/browser gate and the independent clean-baseline mutation job before its least-privilege deployment jobs can publish GitHub Pages.

The lab is MIT licensed; see [LICENSE](LICENSE).

---

_One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite._

_"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31_

```

</details>

---
