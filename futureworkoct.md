# Future work — October 2026

A working list, so items can be picked by number. **Items are REMOVED as they
complete**; the ledger at the end is one line each, pointing at where the detail
lives. Every figure here was re-measured on the date beside it — if a count
disagrees with its command, the command is right and the line is stale.

---

## Where this left off — 2026-10-21

Both repos are clean and fully merged. `crypto-lab` main is **`34d7b50`**,
`crypto-counsel` main is **`52098dc`**. Nothing is in flight: no open PRs in
either repo, no branches besides `main` on either remote, no stale
remote-tracking refs, and no local branches besides `main`.

Landed this session: **#239** (five new cards), **#240** (cryptanalyst split
PROPOSAL only), **#241** (this file), and crypto-counsel **#16** (five corpus
entries) and **#17** (eleven stale snapshot lines, Snow 2 moved to Related
Projects, `validate.mjs` widened with M25-M27).

**Two things are waiting on a maintainer DECISION rather than on work** — items 6
and 7 below. Item 6 is the one that blocks a change already written down.

**Pick up with:** item 6 if you want to decide the path split; otherwise item 2
(#31 vectors, five rows left) is the largest piece of real work and item 3 (the
20 stale corpus entries) is the one with the clearest starting point.

Before touching anything, re-fetch and re-run the fast loop — the figures below
were measured on the dates beside them and other sessions work in these repos:

```
git -C . fetch origin && git -C ../crypto-counsel fetch origin
for c in readme-sync corpus-sync concept-sync catalog-sync tools-sync \
         theme-sync gate-sync dispatch-sync port-sync lab-dates \
         games-sync teach-build knowledge-map-sync; do
  printf '%-22s ' "$c"; node "tools/$c.js" check >/dev/null 2>&1 && echo PASS || echo FAIL
done
```

(Quote `"tools/$c.js"` and pass `check` as its own argument. zsh does not
word-split an unquoted `$c`, so `node tools/$c` with `c="x.js check"` looks for a
file literally named `x.js check` and every checker reports MODULE_NOT_FOUND.)

---

## 1. Nine snapshot lines carry HTML entities where the card has the character

Reported by the maintainer 2026-10-21, **NOT verified here and explicitly deferred
— do not start it without being asked.** In `../crypto-counsel`'s
`crypto_lab_readme` All Demos lines: `&amp;` where the card has `&`, and
`&#949;-&#948;` where it has `ε-δ`.

Named: Commit Gate, PKI Chain, WebAuthn, Syndrome Drain, Chain of Trust, Lattice
Gentle, MuSig Gate, DP Noise, Covert Channel Studio.

**Re-derive the set before fixing it rather than trusting this list** — it is a
report, not a measurement, and the count is the part most likely to be stale. The
derivation that found the eleven drift lines is the one to reuse: read each card's
kicker and chips out of `index.html`, cross-check against the generated All Demos
table in `README.md`, and compare. Decoding entities is a separate question from
that comparison, so whatever closes this should also say which side is canonical.

Do NOT bundle it with a drift pass: an entity fix touches lines no card changed,
and mixing the two makes both unreviewable.

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

## 6. DECISION: split the Cryptanalyst Path, or leave it at 20 steps

**Waiting on the maintainer. No code is written and nothing is blocked
technically — the proposal is the deliverable and it is already merged.**

`audits/CRYPTANALYST-PATH-SPLIT-PROPOSAL-2026-10-21.md` (merged in #240) sets out
the case. The path is 20 steps against `CLAUDE.md`'s "keep `steps` <= ~12"; it was
17 before #239 added three, so the additions are not the cause. It is the longest
of the eight paths and the only one past 17.

Three options:

1. **Leave it at 20.** Nothing to do; delete this item.
2. **Two paths**, as proposed — A "Structure and Statistics" 11 steps (1 beginner,
   5 intermediate, 5 advanced; keeps the only beginner on-ramp), B "Implementation
   and Composition" 9 steps (1 intermediate, 8 advanced). Verified against merged
   main: all 20 appear exactly once, none duplicated, no group names a non-step.
3. **Three paths.** The proposal names the seed if composition deserves its own:
   Salamander, Frozen Heart and Padding Oracle, matching
   `concept-coverage.md` §29 "Composition and parsing failures".

If 2 or 3 is chosen, the implementation is mechanical and the proposal lists it.
**The one trap is writer order:** `knowledge-map-sync write` records a path count
and hashes `index.html`, so it must run AFTER any card stamper, or the map's hash
describes a file that no longer exists in that form.

---

## 7. DECISION: two drifted Related Projects lines in the corpus snapshot

**Offered during #17 and deliberately left out of it**, because the instruction
was to add Snow 2 "in the same form as the other three" — so all three were left
untouched. Two of them have since been shown to differ from the catalog README:

| | snapshot | catalog README |
|---|---|---|
| Cipher Museum | `Interactive museum spanning ... history — thirteen halls` | `An interactive museum spanning ... history. Thirteen halls` |
| Meow Decoder | ends at `via QR-code GIFs.` | plus `AES-256-GCM + Argon2id + ML-KEM-1024 + fountain codes. Python + Rust.` |

Both are wording, neither is a link. Small, and a one-line re-derivation each
from the README's Related Projects block.

**The third line, Crypto Compare, is NOT a defect — do not "fix" it.** The
snapshot's `https://crypto-compare.systemslibrarian.dev/` is that project's own
live address: its repository's `CNAME` contains exactly that host and its README
links it. An earlier read of mine called it dead by applying the rule about
`crypto-lab.systemslibrarian.dev/<slug>/` 404ing, which is a DIFFERENT host
serving the catalog page. The conflation is the thing worth remembering.

If anything the discrepancy runs the other way: **the catalog README uses the
github.io form for a project that has its own domain.** That is a question about
`README.md` here, not about the snapshot, and nobody has decided it. Changing it
would also move the generated All Demos table's sibling block, so check what
`readme-sync` writes before assuming it is a one-line edit.

---

## 8. The nine detached worktrees under `~/repos/.fleet-maintenance-20261009/`

**Left alone on 2026-10-21 by instruction. Listed here so the state is not
rediscovered as a surprise.**

All nine are `crypto-counsel` worktrees on DETACHED HEADs, and all nine were
clean (no uncommitted paths) when checked. Because they hold no branch, their
commits — `0d032ee`, `051a93c`, `2186e49` (x2), `4de0cfe`, `7631877`, `a6b1036`,
`08dade2` (x2) — are now referenced ONLY by those worktrees. Nothing points at
them from any branch in either repo.

So: removing a worktree makes its commit unreachable and eventually
garbage-collectable. Not urgent, and not a decision to take casually — if any of
that work matters, tag it or push it to a branch BEFORE removing the worktree,
not after.

```
git -C ../crypto-counsel worktree list
```

---

## 9. Branch-cleanup restore window

`~/branch-cleanup-2026-10-21.txt` holds 34 rows: 30 deleted remote branches
(26 crypto-lab from PRs #192-#240, 4 crypto-counsel from #14-#17) and 4 deleted
local branches, each with its full tip SHA, PR number and the PR's merged head
SHA. Every row restores with:

```
git push origin <sha>:refs/heads/<branch>
```

or the "Restore branch" button on that PR. 20 stale remote-tracking refs were
pruned in crypto-lab, 0 in crypto-counsel.

**Delete that file once you are satisfied nothing is missing.** It is the only
record outside GitHub's own reflog, and keeping it indefinitely makes it look
like a live list rather than a receipt.

"Automatically delete head branches" is now ON in both repos, so this was
one-time: a merged PR's branch goes away on its own from here.

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
| five uncarded labs + four missing corpus entries | #239 and crypto-counsel #16; `fleet-sync` and `corpus-sync` both clean |
| cryptanalyst path at 20 steps | PROPOSAL ONLY in crypto-lab #240, `audits/CRYPTANALYST-PATH-SPLIT-PROPOSAL-2026-10-21.md`; the split is the maintainer's call |
| eleven stale `crypto_lab_readme` lines | crypto-counsel #17; Snow 2 was a MOVE to Related Projects, and `validate.mjs` was widened with M25-M27 as its controls |
| branch cleanup, both repos | 30 remote + 4 local deleted, 20 tracking refs pruned; manifest `~/branch-cleanup-2026-10-21.txt`; auto-delete now ON, so one-time. Decide from the PR, never `git branch --merged` — squash merges make almost every merged branch read as unmerged |
| futureworkoct queue update | #241 |

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
