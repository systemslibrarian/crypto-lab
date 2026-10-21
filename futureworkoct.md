# Future work — October 2026

A working list, so items can be picked by number. **Items are REMOVED as they
complete**; the ledger at the end is one line each, pointing at where the detail
lives. Every figure here was re-measured on the date beside it — if a count
disagrees with its command, the command is right and the line is stale.

---

## 1. Five labs are live with no card

`tesla-broadcast`, `next-number`, `dvd-scramble`, `twist-trap`, `ake-ladder` —
created 2026-10-20 on another machine. Each needs the full "Adding a new demo"
workflow in `CLAUDE.md`: card, `TITLE_TO_SECTION`, README tables, corpus entry,
`concept-coverage.md`, dates, teach citation.

**Four more are carded but have no corpus entry**: `hash-hunt`, `log-forge`,
`prime-witness`, `residue-gate`. They were carded on the other machine and
`corpus-sync check` fails on them. `node tools/corpus-sync.js gen <slug> "<Name>"`
scaffolds one; the prose has to be written from the lab's own README.

Check: `node tools/fleet-sync.js check` and `node tools/corpus-sync.js check`

---

## 2. #31 — published test vectors, 13 of 18 rows done

Five unnamed rows remain. **The issue's own ranking is stale — re-derive before
picking:** `node tools/depth-audit.js`, then read `audits/DEPTH-AUDIT-<today>.md`.

**How these rows have actually gone, after thirteen:**

- **Where the vector lives.** The hand-rolled hard maths almost always has
  tests; the primitive that seals, keys, tags or commits its output almost never
  does. In nine of thirteen the untested module was the symmetric one. When a lab
  has no obvious KAT, ask what standardized primitive its output passes through
  before concluding none applies — `paillier-gate` (HMAC, RFC 4231) and
  `spdz-forge` (SHA-256 commitment, CAVP) both looked like "no vector applies".
- **Copy the bytes from the publication.** A vector regenerated from `@noble` or
  WebCrypto agrees with the code for the same reason it agrees with itself.
- **Assert THROUGH the lab's own function**, never against `crypto.subtle`
  beside it. In `bike-vault` the second form let a SHA-1 mutation pass.
- **Check the extraction against the publication's own octet counts.** Pulling
  hex runs of 8+ characters out of RFC 8554 dropped a message's final `2e0a` —
  160 bytes where Appendix F says 162 — and the truncated message made a correct
  lab look broken. RFC 4231 Test Case 3 writes `Key` with no `=` sign, alone
  among seven, so a reader keyed on `Key =` built a zero-length key.
- **Pin what the KEY carries, not just what the function computes.** In
  `paillier-gate` the exported `hmacSha256` takes a `CryptoKey`, so the hash
  lives in the key: all seven RFC vectors stayed green when `generateBallotKey`
  was switched to SHA-1. One assertion on `key.algorithm.hash` noticed.
- **Check what a lab's "reference" actually IS.** `kyberslash`'s was its own
  formula transcribed — a differential, blind to the same wrong constant in both
  copies. The tell is that the reference expression and the implementation
  expression are the same shape.
- **Check what the GATE invokes, not that it went green.** `hqc-vault`'s build
  job never ran `npm test`, so ten new tests ran nowhere.
  `gh api .../jobs --jq '.jobs[] | .steps[] | .name'` settles it.
- **Expect four outcomes**, not two. Of thirteen: three carried a real
  conformance bug, eight were correct but unverified, one cannot take a vector at
  all (`falcon-seal` — randomized signing, non-reference encoding), and one was
  verified against a transcription of itself.

---

## 3. Corpus prose — 20 stale, 185 never reviewed

233 entries: 28 current, 20 stale, 185 never reviewed (2026-10-20). A review
backlog, not a defect, and it cannot be swept: each entry means reading a lab and
confirming the prose describes it. **Start with the 20 STALE** — someone checked
those and the lab moved underneath them.

**Check the publication before correcting a citation.** `tls-handshake`'s entry
cites "TLS 1.3 (RFC 9846)" and RFC 9846 is REAL — July 2026, obsoleting 8446. The
lab cites it 22 times. One edit from correcting a correct citation.

**`corpus-freshness` counting a README-only change as substantive is CORRECT** and
was checked: the prose is written FROM the README, so a rewritten README can
invalidate prose derived from the old one. Do not "fix" it.

Check: `node tools/corpus-freshness.js` (`--stale`, or `--fetch` for an answer
that does not depend on when you last pulled)

---

## 4. Teach layer — 43 unchecked claims

Each needs a needle taken from the live page and VERIFIED before it can become an
automated probe, because an unverified needle reports a false failure. The report
names a cadence per item. Judgement per item, not a sweep.

The 4 UNREADABLE are **gone** — they were uninstalled local Firefox and WebKit
binaries, and all four became MATCHES once installed
(`cd tools && npx playwright install firefox webkit`).

Check: `node tools/teach-issues.js`

---

## 5. Chip rule — advisory, and staying advisory for now

The 23 findings are dispositioned in `audits/CHIP-DISPOSITION-2026-10-20.md`.
The maintainer's decisions of 2026-10-21 are implemented in
`tools/catalog-sync.js`: four new qualifier words scoped to the chip they appear
in, a declared `ENTAILS` table keyed on anchored implementations, one declared
`QUALIFYING_SIBLINGS` pair, and the executed-stack rule requiring a verified call
site rather than a dependency listing.

**Remaining before anyone proposes enabling the gate:** finish validating the
rules, and keep the distinction between implementing and discussing. The gate
decision is the maintainer's.

Check: `node tools/catalog-sync.js chips`

---

## Done — one line each

| item | where the detail is |
|---|---|
| #31, 13 of 18 rows | the lab PRs; three real conformance bugs (both TLS labs' RFC 5869 absent salt, `lms-xmss`' RFC 8554 HSS) |
| 4a chip disposition | `audits/CHIP-DISPOSITION-2026-10-20.md` |
| 4d unmarked title | "Mental Poker, Simplified: Shuffle Showdown" |
| 4e game CSPs | all 11 pages under the gate; `merkle-mystery` needed a real fix — CSSOM positioning, not `unsafe-inline` |
| 5a gate.ts copy count | 83 of 184, re-derived; CLAUDE.md |
| 5b legacy toggles | warning had gone SILENT; 46 build one, 36 confirmed wired; CLAUDE.md |
| 6 protection-census | scheduled; `FLEET_READ_TOKEN` set, census PASSED in CI in 33s |
| 7 write half of #125 | one `stampTag()`; `tests/card-stamp.test.cjs` fails 2 of 6 against the old writers |
| Trivium, Davies-Meyer | both were absent from the vocabulary; `lfsr-forge`'s N/A was false |

**Finish a card-stamping pass with `node tools/level-sync.js`.** `data-level` sits
where the writer that ran last put it; running it last took a real repin's diff
from 704 lines to 10.

## Settled — do not re-file these

- **`key-rush`'s "checked by recombining the actual share values" is TRUE.**
  `core.mjs:59` Lagrange-interpolates and `:60` throws `Reconstruction mismatch`.
- **`secret-council/vault.mjs:92`'s count is DERIVED**, from `result.possibilities`.
- **The games being outside the derived catalog views** is deliberate: they get
  `games-sync`, not cards and not an exemption.
- **`quantum-vault-kpqc`'s light theme**, **`blind-oracle-api`'s missing page**,
  and **`confirmer-signatures`' absent `dependabot.yml`** are load-bearing
  divergences. A sweep that flattens one is a regression.
