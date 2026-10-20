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

## 1. Claims in `games/` — DONE 2026-10-20, and one was a false finding

Worked on 2026-10-20. Two of the three items were real; one was not, and the
record matters more than the tidy list.

1. **`the-digital-trade/index.html` — FIXED.** It labelled a field
   "Independently saved listing fingerprint (SHA-256)". Nothing was
   independently saved: `game.mjs:29` computes it in-page from the `listed`
   constant at `game.mjs:8`. Now reads "Listing fingerprint, taken on trust from
   the listing", which matches what the page's own lesson text already said —
   "the listed digest is *assumed* to have come from an authenticated source".
2. **`key-rush/index.html` — NOT A DEFECT, left alone.** The claim "a delivery
   or disclosure is checked by recombining the actual share values" is TRUE.
   The threshold *gate* is an integer comparison, which is what the original
   finding saw, but both outcomes then recombine for real: `core.mjs:59`
   Lagrange-interpolates the delivered shares and `core.mjs:60` throws
   `Reconstruction mismatch` unless the result equals the dealt secret, and
   `core.mjs:47` does the same on the breach path. I was one edit away from
   "correcting" a correct sentence.
3. **`secret-council/game.mjs` — FIXED.** Two hardcoded `17`s sat beside the
   computed value (`:221`, `:327`) where `PRIME` was already imported at `:1`
   and used nine lines below. Both now derive. `PRIME` is 17, so the rendered
   text is byte-identical — verified in a browser, "All 17 secret values remain
   possible with 2 visible shares." — while the figure is no longer typed.
   `game.mjs` is live: `chapters.html` loads it, which is where the retired
   lab's redirect notice sends readers.
   The third site, `vault.mjs:92`, was **not** a hardcoded figure: its number is
   `result.possibilities`, derived from `possibleSecrets` in `vault-core.mjs:105`.
   Its phrasing is awkward when thieves hold zero shares ("still fit their
   shares" when there are none) but it is not false, so it is left.

Verified: 32 core and 16 browser tests pass, `games-sync check` clean.

---

## 2. `games/secret-council/vault.html` is live but unreachable

HTTP 200, fully CI-tested (`council-vault-core` + `council-vault-browser`, with
screenshot artifacts), and **linked from nowhere** — not the arcade, not the
redirect notice, not `chapters.html`. Reachable only by typing the URL.

Decide: link it, or retire it and drop its CI job. Note the directory itself is
NOT dead — `key-rush/core.mjs` imports the GF(17) field arithmetic from
`secret-council/core.mjs`, and `index.html` there is a deliberate redirect.

Check: `grep -rl 'vault.html' games/ index.html` → currently 0 links.

---

## 3. #31 — published test vectors, 16 of 18 rows left

Each row is a published vector to **source, verify the provenance of, and wire
into a different sibling repo**. Two are done: `pq-tls-handshake` and
`tls-handshake`, both of which turned out to carry a real conformance bug rather
than just a missing score.

Next by score: **`time-lock-puzzle` (4/15, missing T I C H)** — NIST publishes
AES and AES-GCM vectors for what it computes. Then the 5/15 group: `bb84`,
`bike-vault`, `falcon-seal`, `ghost-commit`, `hawk`, `hqc-vault`, `kyberslash`,
`lms-xmss`, `paillier-gate`, `spdz-forge`.

The rule that makes a row worth doing: **copy the bytes from the publication**,
not from a library. A vector regenerated from `@noble` or WebCrypto agrees with
the code for the same reason it agrees with itself.

Check: `node tools/depth-audit.js` then read `audits/DEPTH-AUDIT-<today>.md`.
The ranking inside issue #31 is stale and should not be used.

---

## 4. Reports nobody has dispositioned

These run clean as reports and are nobody's failure yet. Each needs a decision,
not a fix.

4a. **Chip rule: 23 chips across 19 labs.** The gate criterion is MET (recall
89.2%, 21 fixture labs, all miss classes resolved), so `catalog-sync chips`
*may* become a failing check — but turning it on reddens CI on those 23 until
they are dispositioned, and `CLAUDE.md` says that decision is the maintainer's.
Check: `node tools/catalog-sync.js chips`

4b. **Corpus prose: 185 never-reviewed entries.** The chatbot's corpus text has
never been checked against the lab it describes. Recorded as a backlog rather
than back-dated.
Check: `node tools/corpus-freshness.js`

4c. **Teach layer: 43 unchecked, 4 unreadable.** The unreadable four are local
Firefox/WebKit binaries that are not installed, which is an instrument limit
rather than a lab finding.
Check: `node tools/teach-issues.js`

4d. **`games-sync` report: 1 unmarked construction title.** "Mental Poker:
Shuffle Showdown" names SRA commutative encryption that the source does not
contain. Either mark the title the way a chip is marked, or rename it.
Check: `node tools/games-sync.js`

4e. **`games-sync`: 4 pages carry no CSP**, so the copy-versus-policy check
cannot be asked of them (`merkle-mystery/chapters.html`,
`quantum-courier/index.html`, `sealed-showdown/index.html`,
`secret-council/index.html`). Adding `connect-src 'none'` to each would bring
them under that gate.

---

## 5. Standing hazards recorded in CLAUDE.md

5a. **Product copy asserted in `e2e/gate.ts`.** A shared `boot()` runs before
every test that imports it, so a copy edit fails all of them under an
accessibility name — this is what hid a security correction in
`crypto-lab-mceliece-gate` for three days. `CLAUDE.md` records **77 of 167**
labs, surveyed 2026-09-29. **That number needs re-deriving before anyone acts:**
my broader probe (`grep -lE 'toContainText|toHaveText' e2e/gate.ts`) counts
**152**, but that also catches structural assertions, so the two are not
measuring the same thing. Do not sweep all of them — each is a judgement about
which assertions are structural and which are copy.

5b. **Legacy theme toggles.** `CLAUDE.md` records 82 labs that can build an
older `#theme-toggle` and 35 where the handler is fully wired, suppressed only
by one inline `display:none!important` rule. Deleting the dead toggle code is
the real fix and is outstanding. Note `theme-sync check` currently reports no
legacy-toggle debt section at all, so **that figure needs re-deriving too**
before it is trusted either way.
Check: `node tools/theme-sync.js check`

---

## 6. `protection-census` cannot be scheduled

It is the only fleet checker that stays manual, because `secrets.GITHUB_TOKEN`
is scoped to its own repository and reading a sibling's branch protection
answers `403`. Scheduling it needs a fine-grained PAT covering every
`crypto-lab-*` repo with one permission, **Administration: Read-only**. The full
note is in `.github/workflows/fleet.yml` beside the job that would run it.

Its last survey was **2026-09-22** (3 classic, 1 ruleset, 200 none, 0 UNREAD
across 204 labs) and the fleet is now 234, so it is stale.
Check: `node tools/protection-census.js` — needs network and your own `gh` auth.

---

## 7. The write half of #125

`level-sync` and `lab-dates` now share the card **reader** but keep their own
write-position regex. That split was made deliberately rather than discovered: a
bug in the stamping path would silently rewrite every card. `card-reader.js`
already exposes `tagStart` / `tagEnd`, so the position is available when someone
wants to finish it.

Also cosmetic and known: running `level-sync` then `lab-dates` reorders
`data-level` relative to `data-added`/`data-updated` versus the reverse order.
Both orders are idempotent and no value changes, so it is harmless — but it
means a regeneration can produce a large diff that carries no information.

---

## Not on this list, and deliberately

- **`quantum-vault-kpqc`'s light theme**, **`blind-oracle-api`'s missing page**,
  and **`confirmer-signatures`' absent `dependabot.yml`** are load-bearing
  divergences recorded in `CLAUDE.md`. A sweep that flattens one is a
  regression.
- **The games being outside the derived catalog views** is settled: they get
  their own checker (`games-sync`), not cards and not an exemption. The
  reasoning is in `CLAUDE.md` under "The learning games".
