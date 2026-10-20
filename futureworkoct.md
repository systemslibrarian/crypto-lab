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

## 3. #31 — published test vectors, 9 of 18 rows done

**Two denominators here, and they are not the same — do not collapse them.** 18
is the issue's row count. The seven labs this file has been naming as "next"
were the rest of one GROUP inside it, not the rest of the 18, so finishing that
group leaves **four named rows and five unnamed ones**. The heading said "12 of
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

Next: `kyberslash`, `lms-xmss`, `paillier-gate`, `spdz-forge`.

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
Of eight done: two carried a real conformance bug, five were correct but
unverified, one cannot take a vector at all. Forcing one into the last case
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

Also cosmetic and known: running `level-sync` then `lab-dates` reorders
`data-level` relative to `data-added`/`data-updated` versus the reverse order.
Both orders are idempotent and no value changes, so it is harmless — but it
means a regeneration can produce a large diff that carries no information.

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
