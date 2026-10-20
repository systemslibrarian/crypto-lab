# Future work — October 2026

A working list, so items can be picked by number. **Every figure here was
re-measured on 2026-10-20 against `main` at `b1b9876`** rather than carried over
from the conversation that produced it.

This file is a snapshot and will rot. `CLAUDE.md` records that several earlier
root-level analysis files (`futuredemos.md`, `CARD-AUDIT.md`,
`HEADER-ROLLOUT-TODO.md` and others) were deleted rather than left to be
mistaken for current, because the generators and checkers superseded them. So
for every item below that a tool can answer, **the command is given and the tool
is the authority** — if a count here disagrees with its command, the command is
right and this line is stale.

---

## 3. #31 — published test vectors, 13 of 18 rows done

**Two denominators here, and they are not the same — do not collapse them.** 18
is the issue's row count. The seven labs this file has been naming as "next"
were the rest of one GROUP inside it, not the rest of the 18, so finishing that
group is now FINISHED, leaving **five unnamed rows**. The heading said "12 of
18 rows left" while listing seven; keeping both numbers visible is the point.

Each row is a published vector to **source, verify the provenance of, and wire
into a different sibling repo**.

Done: `pq-tls-handshake` and `tls-handshake` (both carried a real RFC 5869
conformance bug — an absent salt threw instead of defaulting to HashLen zeros),
and `time-lock-puzzle` (NIST CAVP SHA-256 and AES-256-GCM vectors into
`aes.ts`, which had no test file at all; no bug found, the code was correct and
merely unverified).

Done since: `bb84` (its `encrypt.ts` had no test file and displays an authTag
it never verified) and `bike-vault` (its F2[x] algebra was well covered; the
SHA-256 and AES-GCM the KEM output passes through were not).

`falcon-seal` is done, and it is the one row whose ground-truth gap is NOT
closable by a vector: Falcon signing is randomized (four signings of one message
give four distinct signatures) and this build's encoding differs from the
reference's compressed format, so a reference KAT would be rejected for framing
rather than for being wrong. What was closable is pinned — the WASM's key sizes
against the lab's own published 1793/2305 — and the reason the rest is not is
recorded in the test file.

Done since: `ghost-commit` (its KAT was git-generated, so an independent
`node:crypto` computation was added beside it), `hawk`, and `hqc-vault` — which
had **no unit tests and no test runner at all**, only `test:a11y`. CAVP SHA-256
and AES-256-GCM went in through the lab's own exported `sha256`, and both
bit-order directions are asserted separately, because reversing writer and
reader together still round-trips and a round-trip test cannot tell them apart.
Correct but unverified; no bug.

Done since: `kyberslash`, whose finding was a different shape — its hard maths
HAD tests, and half of it was tested against a copy of itself. The two
`reference*` helpers were labelled "Independent reference" and compute
`floor(((x << d) + floor(q/2)) / q) & mask`, character for character what the
implementation computes. Proven blind by putting the same wrong rounding
constant in BOTH copies: the two "matches the reference" tests stayed green.
`poly_tomsg` was fine — it carries ten hardcoded (coefficient, bit) pairs and
caught the mutation — but `poly_compress` had no hardcoded value anywhere, under
a describe block titled "known-answer vectors". FIPS 203 eq. 4.7 supplies the
ground truth, asserted over the COMPLETE domain [0, q) at every bit width.

**So check what a lab's "reference" actually IS before crediting it.** A second
copy of the formula is a differential, not a ground truth: it catches a typo in
one copy and is blind to a misreading of the standard. The tell is that the
reference expression and the implementation expression are the same shape.

Done since: `lms-xmss`, and it carried **two real conformance bugs** — the
second lab after the two TLS ones to do so. RFC 8554 Appendix F Test Case 1 went
in, and its HSS layer failed it two ways: `encodeLmsPublicKey` prepended
`u32(levelUsed)` to the child public key a parent signs, where Section 5.3
defines that serialization with no prefix; and the signature's leading u32
carried the active leaf-tree index where Sections 6.1/6.2 define Nspk, with a
verifier that accepted any non-negative value. The LM-OTS and LMS layers were
already correct — both LMS signatures in the vector verify through the lab's own
`lmsVerify` unchanged.

**This row is the clearest evidence for why #31 exists, so the measurement is
worth keeping.** With the first bug restored:

| | |
|---|---|
| round-trip: keygen, sign, verify | **PASSES** — blind |
| RFC 8554 Appendix F Test Case 1 | **REJECTS** — caught |
| control, unmutated | round-trip passes, vector verifies |

A lab's own round-trip cannot see a conformance bug its signer and verifier
share. Nothing but the publication can.

**It also found a gate line standing for nothing.** `phase2.ts` printed `PASS:
RFC 8554 Appendix F LMS vector structure verified (HSS parsing in Phase 3)` with
no assertion above it and no vector in the file — zero hex literals in
`phase2.ts` against 41 in `phase1.ts`, whose LM-OTS vector is real — and its
parenthesis sent a reader to Phase 3, which did not verify it either. **Worth
grepping for in the remaining rows: a `logPass`/`console.log` naming a vector,
with no hex and no assertion near it.**

I swept the fleet for it and **the sweep does not license any claim about the
fleet**, which is worth writing down rather than filing as "clean". It matched
labs that PRINT pass lines — the `tsx src/gates/phase*.ts` style — and its whole
denominator was **8 files**. Most labs use vitest, where the claim lives in a
test NAME rather than a printed string, so they never entered the denominator at
all. Within those 8 only `lms-xmss`'s two appeared, and they are the ones just
fixed. The probe also false-positived on its own fix, because the hex now lives
in an imported module and the import is multi-line, so a one-line
`^import .*test-case` missed it.

So the real version of this check is per-row and by hand: does a test that names
a publication assert anything against bytes from it? Not a grep. Treat the empty
fleet result as "this probe cannot see most labs", which is what it is.

Done since: `paillier-gate` and `spdz-forge`. **Both looked like "no vector
applies" and neither was.** Paillier has no published KAT (no RFC; ISO/IEC
18033-6 is not freely available) and SPDZ is a paper — but in each case the
vector belonged to the primitive FEEDING the hard maths:

- `paillier-gate` authenticates ballots with HMAC-SHA-256, so RFC 4231's seven
  vectors apply. All ten existing ballot tests went through `tagCiphertext` on
  both sides. No bug.
- `spdz-forge` commits with SHA-256 over `nonce || sigma` — the thing that makes
  commit-then-open bind, its central exhibit — and had **no digest literal in
  any of its six test files**. CAVP SHA-256 reaches it by splitting a published
  message: leading bytes as the nonce, final 8 as sigma. No bug.

`spdz-forge`'s KAT file is the one to copy from: it states its own limit first
("SPDZ is a paper, not an RFC"), and its vectors are hand-derived from the
published equations as literals. That IS ground truth, and it is why that row
needed nothing on the protocol.

**THE NAMED GROUP IS FINISHED.** Five unnamed rows of the 18 remain, and the
issue's own ranking is stale — re-derive them with `node tools/depth-audit.js`
and read `audits/DEPTH-AUDIT-<today>.md` before picking the next one.

**Where the vector lives, after thirteen rows.** The hard maths almost always
has tests; the primitive that seals, keys, tags or commits its output almost
never does. In nine of thirteen the untested module was the symmetric one. Look
there first, and when a lab has no obvious KAT, ask what standardized primitive
its output passes through rather than concluding none applies.

**Pin what the KEY carries, not just what the function computes.** In
`paillier-gate` the exported `hmacSha256` takes a `CryptoKey`, so the hash lives
in the key: the seven RFC vectors import their own key and stayed green when
`generateBallotKey` was switched to SHA-1. One assertion on
`key.algorithm.hash` is what noticed. A vector through a function parameterised
by a key does not pin the key.

**A misleading field name cost a bug inside the fix.** `maxLevels` was
`1 << rootH` — the leaf-TREE count, 32 — and reads like RFC 8554's L, so the
first Nspk fix wrote `maxLevels - 1` = 31 rather than 1. Renamed
`leafTreeCount`, with one `HSS_LEVELS` both sides derive Nspk from.

**Check an extraction against the publication's own octet counts.** Pulling hex
runs of 8+ characters out of the RFC dropped the message's final line `2e0a` —
160 bytes where Appendix F shows 162 — and the truncated message made the leaf
signature fail to verify, reading exactly like a lab defect. The RFC's field
definitions give an independent arithmetic check: 60, 162 and 2644 bytes.

**Check what the GATE invokes, not just that it went green.** hqc-vault's build
job ran `npm ci` → `npm run build` → `test:a11y` and never `npm test`, so the
first commit added ten tests and CI ran none of them — a test file no workflow
runs, which is what `tools/test-invocation.js` exists to find in other labs. The
build passed in 55s and looked like evidence. `gh api .../jobs --jq '.jobs[] |
.steps[] | .name'` is the question that settles it.

**A measuring probe can be the broken thing.** The audit of which #31 labs run
their units in CI used `npm (run )?test\b`, and `\b` matches at the colon in
`npm run test:a11y` — so every lab read as "runs npm test", including the one
that did not. The corrected probe excludes a following colon. Eight genuinely
do; hqc-vault was the one outlier, because it had no test script to run.

**Expect some rows to end in "no vector applies", and treat that as a result.**
Of thirteen done: **three carried a real conformance bug**, eight were correct
but unverified, one cannot take a vector at all, and one was verified against a
transcription of its own formula — a fourth outcome worth expecting. Forcing one into the last case
would mean adding an algorithm or asserting a framing mismatch as a defect.

**Choose the tampered byte deliberately.** In `falcon-seal` flipping the FINAL
signature byte leaves it valid, because that build's padded format has padding
the verifier does not cover. My first test read that `true` as a verification
failure — a conclusion about the lab drawn from my own choice of byte.

**The recurring shape, worth checking first in each:** the hand-rolled hard
maths usually HAS tests, and the symmetric primitives it feeds — a SHA-256
turning output into a key, an AES-GCM sealing step — usually do not. In three of
four labs so far the untested module was the one that seals.

**Assert the vector THROUGH the lab's own function, not against
`crypto.subtle`.** In `bike-vault` the first version of the test called
`subtle.digest` directly and a mutation switching the lab's digest to SHA-1 went
uncaught, because the assertion was testing WebCrypto rather than the lab. Export
the function if you must.

Two sources that worked and are worth reusing: NIST CAVP response files
(`shabytetestvectors.zip`, `gcmtestvectors.zip` from csrc.nist.gov — pick the
section whose parameters match what the lab actually does) and RFC text from
rfc-editor.org, whose octet counts beside each value let you check the
extraction.

The rule that makes a row worth doing: **copy the bytes from the publication**,
not from a library. A vector regenerated from `@noble` or WebCrypto agrees with
the code for the same reason it agrees with itself.

Check: `node tools/depth-audit.js` then read `audits/DEPTH-AUDIT-<today>.md`.
The ranking inside issue #31 is stale and should not be used.

---

## 4. Reports nobody has dispositioned

These run clean as reports and are nobody's failure yet. Each needs a decision,
not a fix.

4a. **DISPOSITIONED 2026-10-20** — `audits/CHIP-DISPOSITION-2026-10-20.md`. All 23
chips across 19 labs were judged by reading each lab's source for the
OPERATIONS, never for the algorithm's name (that is what the scanner does;
repeating it reproduces its answer).

**Result: none of the 23 is a demonstrable card defect**, so the file argues
against switching the gate on. 12 are algorithms the lab really implements with
no derivable anchor, 3 are marked by a SIBLING chip, 1 is a granularity
mismatch, 1 runs inside a dependency, 3 are honestly qualified in words the
marker vocabulary lacks, 1 is marginal, 2 need one more read. Totals 23.

**Two things in it are worth knowing before touching this again:**

- **I got it wrong first, by judging chips in isolation — which is what the tool
  does.** Six cards looked like overclaims until I read the whole chip SET:
  `zk-arena` already chips `Comparison`, `isogeny-gate` chips `Castryck-Decru`
  beside `SIDH`, `pq-families`' `Isogeny` is one of five family names. A card's
  marker is frequently a *different chip in the same set*. That is the finding
  with the longest reach and it is the question to settle before any gate.
- **Do not clear the 12 with reviewed anchors in `catalog-reviewed.json`.** It
  looks like the established mechanism. An anchor resolves only if the term is
  named on the line, by the path, or by a structure — and none of those twelve
  implementation lines name their algorithm (`rsBerlekampMassey` contains no
  "Reed-Solomon"). The only lines that WOULD resolve are the comments, and
  crediting an implementation to a comment is what CLAUDE.md explicitly refuses.

The gate decision itself remains the maintainer's and nothing was switched on.
Check: `node tools/catalog-sync.js chips`

4b. **Corpus prose: 185 never-reviewed entries.** The chatbot's corpus text has
never been checked against the lab it describes. Recorded as a backlog rather
than back-dated.
Check: `node tools/corpus-freshness.js`

4c. **Teach layer: 43 unchecked, 4 unreadable.** The unreadable four are local
Firefox/WebKit binaries that are not installed, which is an instrument limit
rather than a lab finding.
Check: `node tools/teach-issues.js`

4d and 4e are **DONE** (2026-10-20). `games-sync` now reports nothing across all
11 pages — four gates and both reports clean.

- The title is marked: **"Mental Poker, Simplified: Shuffle Showdown"**. The
  game's body copy was accurate throughout; only the title borrowed the
  construction name with no verb to qualify it. "Simplified" is a word from the
  check's own vocabulary and is also true — hash commitments instead of
  commutative encryption is a simplification of the classic construction.
- The four CSP-less pages carry the policy the other seven do.

**4e was not the one-line change it looks like, and the lesson is reusable.**
Three of the four pages took the strict policy with no violation. The fourth,
`merkle-mystery/chapters.html`, broke completely: `game.mjs` built every Merkle
node with `style="left:…;top:…"` inside an `innerHTML` template, a style
ATTRIBUTE is an inline style, `style-src 'self'` blocked all of them, the tree
collapsed and all seven browser tests failed on a click the stacked root node
intercepted. **The fix is not `'unsafe-inline'`** — positions are assigned
through the CSSOM after insertion, which `style-src` does not govern.

**The static check said it was safe, and three probes said the wrong thing
before one said the right thing.** Worth copying the sequence:

| probe | said | why it was wrong |
|---|---|---|
| grep for inline `<style>`, `<script>`, `on*`, `style=` | all clean | the attribute is written by JS at render time, not present in the file |
| load the page, capture CSP violations | none | the styles are applied during PLAY, not on load |
| `grep -c "^not ok"` on `node --test` | 0 failures, twice | node prints `✔`/`✖`, not TAP — it counted nothing and read as "fine" |
| Playwright screenshot injection (the documented kyber-vault hazard) | the obvious suspect | the screenshot SUCCEEDS under the policy, and the other three pages screenshot too and pass |
| every console error during a real interaction, diffed with / without / clean | **7 inline-style violations; 0/7, 7/0, 7/0** | this is the one that settled it |

**Found incidentally and fixed:** `secret-council/index.html` carried
`rel="canonical"` pointing at `/games/key-rush/` — its own page declaring itself
a duplicate of a different game. It is the only canonical link under `games/`,
so the ten pages without one are left alone rather than swept into a convention.

## 5. Standing hazards recorded in CLAUDE.md

5a. **RE-DERIVED 2026-10-20. The hazard count is 83, not 77 and not 152.**

The two figures were measuring different things and neither was the hazard. What
CLAUDE.md describes is prose asserted inside the SHARED SETUP helper — the
`boot()` that runs before every test that imports it, so one copy edit fails them
all under an accessibility name. Measured by parsing each `gate.ts`, matching
exported setup-shaped functions by brace depth, and counting text assertions
against a string literal of three or more words:

| | |
|---|---|
| labs with an `e2e/gate.ts` | **184** (CLAUDE.md's 167 is stale) |
| asserting prose anywhere in `gate.ts` | 132 |
| **asserting prose inside the SETUP function — the hazard** | **83** |
| total such assertions | 183 |
| worst single lab | `dp-noise`, 7 |

My earlier broad probe's **152** was `grep -lE 'toContainText|toHaveText'` — any
text assertion anywhere in the file, including structural ones and ones outside
setup. It is not this.

**Validated against the known incident rather than trusted:**
`crypto-lab-mceliece-gate`, the lab whose copy edit was reported as an
accessibility failure for three days, is flagged with 3, and its first sample is
`'Public key generated: 261,120 bytes.'` — exactly the shape that caused it. A
measure that missed that lab would have been wrong whatever number it produced.

CLAUDE.md's instruction stands and is unchanged: **do not sweep the 83.** Each is
a judgement about which assertions are structural and which are copy. Move them
when you next touch the lab.

5b. **RE-DERIVED 2026-10-20, and the warning had gone SILENT — fixed.**

`theme-sync`'s "Legacy toggle debt" section still existed in the code and printed
nothing, while labs were demonstrably shipping suppressed, working toggles.

**`crypto-lab-ascon` is the proof.** `src/main.ts:59` builds
`<button id="theme-toggle">`, `:673` binds it, `:674` `applyTheme()` sets
`data-theme` and writes `localStorage`, and `:680` attaches the click listener.
Fully wired, held off the page by one CSS line, and reported by nothing.

Two reasons it was missed, both in `FLIPS_THEME`:

- it required the theme operation within **300 characters after** the click
  listener, and ascon's are 600 lines apart;
- it knew the function name `setTheme`, and this lab calls its function
  `applyTheme`.

Its 20 apparent matches were **all in `e2e/` specs** — the tests click the
toggle, so the pattern matched the test rather than the lab. Scoped to non-test
source it confirmed **zero**.

**The fix follows the ELEMENT, not a distance:** bind an identifier from a
theme-toggle lookup, find a click listener attached to that identifier, and
require the same file to set the theme. Nothing depends on spacing or on what the
handler is named. Rendering and wiring are now also asked of DIFFERENT files,
because labs put the button in `index.html` and the handler in `src/` — testing
wiring only where the markup sits confirmed 2; asking every file that references
the toggle confirms 36.

| | |
|---|---|
| build a legacy toggle in non-test source | **46** |
| **confirmed wired** | **36** (CLAUDE.md recorded 35 by hand in August) |
| wiring unconfirmed — reported as a floor, not as "dead" | 10 |

Controls, all asserted: ascon confirmed; an element bound with no listener NOT
confirmed; a listener on a different element NOT confirmed; and removing a
suppression rule still fails the hard gate with exit 1. **Four looser variants
were tried and rejected** — a 4000-character window gave 24, requiring a
non-literal write gave 9, the element alone 46, any lab that builds one 49. A
rule whose answer moves that much with its own threshold is not measuring the
thing, so none was adopted and the residue is reported as unconfirmed rather than
guessed at.

A test-file exclusion was added for the DEBT question only:
`crypto-lab-timing-oracle`'s `e2e/gate.ts:284` is a comment describing its dead
button and `:295` a selector asserting it does not render — a test checking the
invariant, counted as a breach of it. `toggleDrivers` still sweeps `e2e/` and
must, for the opposite reason CLAUDE.md records.

Deleting the dead toggle code remains the real fix, now with a trustworthy count
of what there is to delete.
Check: `node tools/theme-sync.js check`

## 6. `protection-census` — scheduled, waiting on one command

**Done 2026-10-20, except the secret itself, which I cannot create.** The PAT
exists and was verified end-to-end before anything was wired: all 234 labs, both
endpoints asked of each, **0 UNREAD**, in 23 seconds — 1 ruleset, 3 classic, 230
none. It is a fine-grained PAT with Administration: Read-only, which is where
both branch protection and rulesets live.

Landed: the census is in `CHECKERS` in `tools/fleet-check.js`, the secret is
referenced by the fleet job, the generated README row moved from `manual` to
`weekly, on demand` on its own, and `CLAUDE.md`'s "Eight checkers" is now nine.

**One command left, and it needs you — writing a credential to the remote is
blocked for me:**

```
gh secret set FLEET_READ_TOKEN --body "$(tr -d ' \t\n\r' < pat)" --repo systemslibrarian/crypto-lab
```

Until that runs, the weekly job reports the census as **NOT RUN** by name and
does not fail — a missing secret here is a configuration gap in this repository,
not a finding about 234 labs. A secret that exists and no longer works is the
other case and does fail, because then the census asked and was refused. A
fine-grained PAT expires, so that case will come: rotate the secret, do not mute
the checker. `node tools/fleet-check.js --selftest` asserts both directions.

The `pat` file in the repo root is gitignored (`.gitignore:43`) and mode 600.
Delete it once the secret is set — GitHub will not show it again, but the secret
is where it needs to be and a token on disk is one more copy than necessary.

---

## 7. The write half of #125

`level-sync` and `lab-dates` now share the card **reader** but keep their own
write-position regex. That split was made deliberately rather than discovered: a
bug in the stamping path would silently rewrite every card. `card-reader.js`
already exposes `tagStart` / `tagEnd`, so the position is available when someone
wants to finish it.

**The cosmetic half is SOLVED, and it was a run order rather than a bug.**
`data-level` sits where the writer that ran LAST put it, and `main`'s order is
the one `level-sync` produces. Measured 2026-10-20 on a real repin: running
`catalog-evidence write` then `lab-dates` gave a **704-line** `index.html` diff;
running `level-sync` afterwards collapsed it to **10 lines** — the four cards
that had actually changed. Nothing else moved, and no value differed.

So: **finish any card-stamping pass with `node tools/level-sync.js`.** No code
change needed, and the write-position regexes stay separate.

That matters more than tidiness. The 704-line version contained four real
changes and 228 cards whose attributes only reordered, which is a diff nobody
can review — and this repository's recurring failure is a real change hidden
inside a plausible-looking one. The check that made it safe either way is worth
reusing: compare cards by their attribute SET rather than by text, through
`card-reader.js`, and print only the slugs whose values differ. CLAUDE.md
already notes that card-by-card diffing caught a swept derivation once and calls
that luck rather than a control; this is the same read, as a command.


---

## Settled — do not re-file these

- **`key-rush`'s "checked by recombining the actual share values" is TRUE.**
  Investigated 2026-10-20 after a finding claimed otherwise. The threshold gate
  is an integer comparison, which is what that finding saw, but `core.mjs:59`
  then Lagrange-interpolates the delivered shares and `:60` throws
  `Reconstruction mismatch` unless the result equals the dealt secret;
  `core.mjs:47` does the same on the breach path. One edit away from correcting
  a correct sentence.
- **`secret-council/vault.mjs:92`'s count is DERIVED**, from
  `result.possibilities` via `possibleSecrets` in `vault-core.mjs:105` — not a
  hardcoded figure. Its phrasing is awkward when thieves hold zero shares
  ("still fit their shares" when there are none) but it is not false.

## Not on this list, and deliberately

- **`quantum-vault-kpqc`'s light theme**, **`blind-oracle-api`'s missing page**,
  and **`confirmer-signatures`' absent `dependabot.yml`** are load-bearing
  divergences recorded in `CLAUDE.md`. A sweep that flattens one is a
  regression.
- **The games being outside the derived catalog views** is settled: they get
  their own checker (`games-sync`), not cards and not an exemption. The
  reasoning is in `CLAUDE.md` under "The learning games".
