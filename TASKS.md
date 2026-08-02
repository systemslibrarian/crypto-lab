# Task list — crypto-lab fleet

---

# START HERE — prompt for the AI picking this up

Paste everything between the rules into a fresh session, from
`/Users/gmcas/repos/crypto-lab`.

---

You are continuing maintenance on **Crypto Lab**: a catalog site at
`/Users/gmcas/repos/crypto-lab` plus **176 sibling demo repos** at
`/Users/gmcas/repos/crypto-lab-*`. Each demo is a browser-only Vite + TypeScript
teaching lab that deploys to GitHub Pages. Read `CLAUDE.md` first — it is binding.

**The goal, in one sentence:** every lab should be *claim-complete* — every claim a page
makes is computed from that run, every verdict states only what the protocol actually
learned, and every important state is tested rather than merely visited. No lab has yet
scored 10 out of 10 against that bar.

## Do this first, before trusting anything below

State drifts. Verify it:

```bash
cd /Users/gmcas/repos
for x in crypto-lab-*; do
  git -C "$x" fetch -q origin 2>/dev/null
  n=$(git -C "$x" status --porcelain | wc -l | tr -d ' ')
  a=$(git -C "$x" rev-list --count @{u}..HEAD 2>/dev/null || echo 0)
  [ "$n" != 0 ] || [ "$a" != 0 ] && echo "${x#crypto-lab-}: dirty=$n unpushed=$a"
done
```

`git fetch` first is not optional — a stale tracking ref already produced a wrong
"0 unpushed" once and cost a session's worth of confusion.

## Ground truth lives in `audits/`

| File | What it holds |
|---|---|
| `BORDER-CONTRAST-STATUS.md` | Every repo failing WCAG 1.4.11 on control borders, with selector, ratio and file:line |
| `FALSIFIABLE-CLAIMS.md` | 189 claims across 68 repos; 124 with no fix confirmation |
| `SCORECARD-2026-08-01.md` | Pedagogy scores, 74 of 174 recovered |
| `_MASTER-TEMPLATE.md` | The build/teach/look/a11y standard every lab is measured against |
| `VERIFICATION-2026-08-01.md` | How UI changes were verified by running them |
| `PRE-PUSH-STATUS.md` | Per-repo test/build results before the last push |

Read the relevant one before starting a task. Do not re-derive what is already measured.

## Nine rules that were learned the expensive way

1. **`npm ci` first, in every repo you touch.** `node_modules/.bin` is empty fleet-wide
   (symlinks did not survive a Windows-to-Mac copy). Takes about a second from cache.
   Without it nothing runs and you will misdiagnose it as a broken toolchain.
2. **`timeout` does not exist on this macOS box.** Do not use it.
3. **Script names are not uniform.** Read `package.json` every time. Some repos have no
   `test` script (`vrf-gate` uses `check`). A bare `test` is sometimes vitest WATCH mode
   and will hang forever — use `test:run`. Some repos are nested: `biham-lens` at
   `demos/biham-lens/`, `collision-vault` at `demos/collision-vault/`, `ratchet-wire` at
   `ratchet-wire/`, `quantum-vault-kpqc` at `web-demo/`.
4. **The a11y gate runs locally and it is the most common CI failure.**
   `npx playwright install chromium` once, then `npm run test:a11y`. Run it before
   pushing anything that touches markup or CSS. Some repos also have
   `npm run check:size`. Neither runs by default, and both fail CI.
5. **Check `git ls-files --error-unmatch <file>` before deleting anything.** An untracked
   file looks identical to a tracked one and is gone forever. This already destroyed three
   audit documents that cannot be recovered.
6. **The dominant defect is a test that pins behaviour a fix deliberately changed.** Five
   instances in one day. When triaging a diff, find the semantic change first, then hunt
   the test still asserting the old semantics.
7. **Verify UI changes by running the page, not the suite.** Build, `vite preview`, drive
   with Playwright, screenshot. One repo would have shipped seven empty regions with a
   fully green test run.
8. **Treat every audit finding as a claim to verify.** The overwhelming pattern is that
   findings describe code that has since been fixed. Read the current source first. Do not
   "fix" working code.
9. **Never fake a verdict to make a gate pass.** No suppressing axe rules, no deleting
   tests, no making a check non-blocking. If a budget genuinely must move, move it to a
   specific number with a comment saying why and what it was — and keep it blocking.

## Working with subagents

Agents are effective here and the work parallelises well, but **seven died mid-run on API
stalls in one evening**. Therefore:

- **Instruct every agent to commit and push per repo, never batching to the end.** This is
  what made the deaths cheap.
- **Give each agent a disjoint repo list.** Two agents in one repo already produced a
  crossed commit message.
- **When one dies, check what it landed before resuming** (`git log --oneline --since=...`),
  and tell it what you found so it does not redo work.
- Agents have corrected briefs and been right. Verify their corrections; do not dismiss them.

## Pick up here

Tasks 5, 6, 8, 9, 10 below are open, with full context on each. Highest value first:

- **Task 5** (border contrast) is the largest mechanical chunk and is well specified —
  about 70 repos were fixed today, so re-measure before assuming what remains.
- **Task 8** matters most for the stated goal, especially the nine repos whose audit batch
  never reported and for which no fix was ever attempted.
- **Task 6** is the goal itself, and needs roughly 100 demos re-scored.

Ask before pushing if the user has not already said to. Report honestly: a partial result
stated plainly is worth far more than an overstated complete one.

---


Durable copy of the working task list, written 2026-08-01 so an interrupted session loses
nothing. `RESUME-HERE.md` holds the fleet state and the hard-won environment facts; this
file holds the work queue. Keep both current.

## Current-session update — 2026-08-01

- Fresh fetch-first fleet scan completed. Six interrupted edits were recovered, fully
  verified, committed, and pushed to `main`: `blind-hello` (`089dd4c`),
  `diffie-hellman-mitm` (`34dc9a4`), `ibe-gate` (`ba74aca`), `kdf-arena` (`d4ba2fd`),
  `timing-oracle` (`675ccca`), and `stark-tower` (`883421a`).
- Task 5: `shamir-vs-frost` was the one live failure in a seven-repo recheck; fixed and
  pushed (`35eaaba`). Six other rows were stale and already pass at current origin:
  pairing-gate, world-ciphers, vrf-gate, nonce-lattice, rsa-forge, and ablation-wire.
- Task 8: `drbg-arena` and `corrupted-oracle` were verified fixed on current origin.
  `stark-tower`'s four findings are fixed and pushed.
- Task 9 current scores after remediation: `zk-proof-lab` 7, `hawk` 7,
  `tls-handshake` 8, `bcrypt-forge` 8.
- User authorized direct commits and pushes to `main` for each verified fix; do not create
  feature branches for this fleet pass.
- Task 5 continued: completed and pushed the known incomplete `hash-zoo` fix (`b785c3c`),
  raised `accumulator`'s control token above 3:1 in both themes (`b5a6fe4`), and fixed
  `merkle-vault` text-control borders (`9c3ea37`). Full tests, builds, both-theme a11y, and
  live screenshots pass; `accumulator` also passes all 12 guided flow tests.
- Task 9 follow-up: `bcrypt-forge`'s light-theme axe failure was an animation midpoint,
  not bad endpoint colors. Removed only the simultaneous foreground/background transition;
  tests, build, both themes, keyboard behavior, and live interaction pass. Pushed `9dd60f3`.
- Task 8 continued: completed and pushed claim remediations for `zk-proof-lab` (`4d8b2b4`),
  `shadow-vault` (`00f6027`), `zk-arena` (`882ba0e`), `frodo-vault` (`3113444`),
  `garbled-gate` (`fcb4b14`), `kdf-arena` (`21c0d8a`), `kdf-chain` (`1233751`),
  `mac-race` (`39a2ce4`), `aegis-gate` (`793d614`), and `bulletproofs` (`b40e111`).
  Each repo's available unit/build/browser/a11y gates passed; exact evidence and any
  environment limitation are recorded in `audits/FALSIFIABLE-CLAIMS.md`.
- Task 8 delegated completions: `chain-of-trust` now distinguishes unevaluated revocation
  as UNKNOWN (`d76cdd0`), and `nonce-guard` now labels XOR previews and the fixed
  chosen-probe exhibit honestly (`4ac4e9c`). Both were fully tested, built, accessibility
  scanned, pushed to `main`, and recorded in the claim ledger as soon as they completed.
- Task 8 delegated completion: `mayo-seal` now derives its short-system denominator and
  malformed-signature counts from live values, verifies the genuine control, and labels
  deterministic E-power samples honestly (`29d2ea2`). All 142 unit tests, the production
  build, and all 29 browser/a11y tests passed before the fix was pushed to `main`.
- Task 8 continued: `dilithium-reject` now generates every check example from a fresh real
  ML-DSA-65 signing trace and distinguishes fixed controls from selected-preset histogram
  traces (`97ac062`). All 79 unit tests, lint, build, and three browser/a11y tests passed.
- Task 8 delegated completion: `phantom-vault` now compares modulo bias with exact tallies
  over all 256 byte values and labels the run-specific rejected tail as an observation,
  not statistical proof (`61a4752`). Typechecks, 46 tests, build, and three browser/a11y
  tests passed before push.
- Task 8 delegated completion: `mceliece-gate` now derives named key-size ratios from byte
  literals and makes the tamper control reach and report t+1 from any learner-edited state
  (`20763c1`). All 27 tests, build, four browser tests, and mobile/desktop a11y passed.
- Task 8 delegated completion: `lms-ledger` now derives LMS/HSS sizes from RFC 8554 fields,
  includes the verifier-required 32-byte C, and runtime-checks the live 2,336-byte result
  (`9f44751`). All 18 tests, build, and three browser/a11y tests passed.
- Task 8 delegated completion: `dp-noise` replaces its stale copied test count with a link
  to the current deploy workflow and adds a regression against future hard-coded totals
  (`ac25d00`). All 239 tests, build, and nine browser/a11y tests passed.
- Task 8 continued: `dilithium-seal` now reports safety-cap failures and toy-loop results
  accurately, makes signature tampering one-way until re-signing, and derives browser
  performance comparisons from measured ratios (`b8c4557`). All 20 tests, build, and four
  browser/a11y tests passed.
- Task 8 delegated completion: `opaque-gate` now consistently describes its envelope as
  nonce plus HMAC authentication tag, with no ciphertext or encryption claim (`6933e10`).
  All 12 protocol/vector tests, build, and three browser/a11y tests passed.
- Task 8 continued: `mls-group` now prominently identifies itself as an RFC 9420 teaching
  subset and discloses that Ed25519 signatures, authenticated handshake framing, and
  confirmation-tag checks are omitted (`376277c`). All 19 tests, build, and three
  browser/a11y tests passed.
- Task 8 delegated completion: `spake-gate` corrects scalar reduction to the P-256 group
  order and labels M/N as loaded, curve-checked RFC points whose shown seeds are not
  recomputed (`bf2d0ce`); the previously reported links already return HTTP 200. All 18
  tests, build, and three browser/a11y tests passed.
- Task 8 delegated completion: `kyber-vault` now centers recovered Z17 representatives,
  computes the displayed toy search space from n=4/q=17, and waits for decryption before
  reporting authentication (`22b0b9e`). All 23 tests, typecheck, build, and six
  browser/a11y tests passed.
- Task 8 continued: `multivariate` now derives its 32-second tour label, performs a true
  whole-byte tamper, uses byte-based signature comparisons, updates the scheme-status chip,
  and treats larger-preset timing as measured (`e1113cf`). All 33 tests, build, and four
  browser/a11y tests passed.
- Task 8 delegated completion: `webauthn` now distinguishes its inspectable simulator from
  the separate real `navigator.credentials` ceremony and attributes rejection to the
  relevant RP checks (`8029a42`). All 38 tests, build, 49 virtual-authenticator checks, and
  three browser/a11y tests passed.
- Task 8 delegated completion: `lms-xmss` now rejects invalid q values without state
  mutation, labels its measured-depth statistic precisely, and burns the live next leaf
  before staging stale rollback copies (`74ad736`). All four correctness phases, build,
  and three browser/a11y tests passed.
- Task 8 delegated completion: `scloud-vault` replaces arbitrary scrutiny meters with dated
  process facts and consistently describes its implemented B/S values as full n×32 matrices
  (`301a92a`). All 41 tests, build, and four browser/a11y tests passed.
- Task 8 MIXED-entry resolution: `world-hashes` was already corrected to teach Kupyna as a
  wide-pipe Merkle–Damgård construction (`b48a176`); direct unit/browser regressions now
  protect that distinction (`c5e7f01`). All 58 tests, typecheck, build, and three
  browser/a11y tests passed.
- Task 8 continued: `ntru-classic` now records whether LLL actually matched a sign/rotation
  of the private key and reports the non-recovery path instead of defaulting to success
  (`cf52ccb`). All 52 tests, build, and three browser/a11y tests passed.
- Task 8 MIXED-entry resolution: `hqc-vault` now excludes the zero-flip control from tamper
  trials and derives FO totals; regressions also pin the already-corrected flip geometry,
  marker lookup, encryption equation, and nonzero DFR (`6be8c03`). Typecheck, build, and
  six browser/a11y tests passed.
- Task 8 MIXED-entry resolution: `sphincs-ledger` scopes its one-chain exposure honestly,
  verifies ledger tampering with the real verifier, labels illustrative hypertree paths,
  and rejects non-signable chain step 16 (`ac6439b`). All 55 tests, build, and four
  browser/a11y tests passed. This resolves the final NO/MIXED status in the claim ledger.
- Task 5 resumed: `lwe-hints` had a live control-boundary failure; its calculator inputs
  now measure 3.30:1 dark and 4.00:1 light with a blocking Playwright ratio assertion
  (`1429cef`). All 49 tests, build, and both-theme accessibility scans passed.
- Task 5 delegated completion: `syndrome-drain` control boundaries now measure 3.47:1 dark
  and 3.84:1 light, enforced by computed-style browser regression (`06d7279`). All 23
  tests, build, and three browser/a11y tests passed.
- Task 5 delegated completion: `harvest-timeline` controls now use dedicated borders
  measuring 3.77:1 dark and 3.51:1 light with a blocking computed-style regression
  (`e617bdd`). All 90 tests, build, and three browser/a11y tests passed.
- Task 5 delegated completion: `mls-group` text-input boundaries now measure 3.18:1 dark
  and 3.32:1 light with blocking computed-style regressions (`9371174`). All 19 tests,
  build, and five browser/a11y tests passed.
- Task 5 delegated completion: `collision-vault` tamper-select boundaries now measure
  3.35:1 dark and 5.23:1 light with desktop/mobile computed-style regressions (`45d3436`).
  All 77 tests, lint, build, and 19 passing browser tests passed (one skipped).
- Task 5 delegated completion: `iron-serpent` load-bearing field boundaries now measure
  4.18:1 dark and 4.54:1 light with blocking computed-style regressions (`f2e73d0`). All
  42 tests, build, and 28 desktop/mobile browser tests passed.
- Task 5 continued: `noise-pipe` text-input boundaries now measure 3.48:1 dark and 4.25:1
  light with blocking computed-style regressions (`b696d6e`). All 70 tests, build, and
  both-theme browser/a11y tests passed.
- Task 5 delegated completion: `oram-vault` number-input boundaries now measure 3.55:1
  dark and 4.11:1 light with blocking computed-style regressions (`2dbff17`). All 31
  tests, typecheck, build, and three browser/a11y tests passed.
- Task 5 delegated completion: `j-uniward` message-field boundaries now measure 4.18:1
  dark and 4.83:1 light with blocking computed-style regressions (`03b91e9`). All 15
  custom tests, typecheck, build, and three browser/a11y tests passed.
- Task 5 delegated completion: `hybrid-wire` boundaries now measure 3.26:1 dark and 4.55:1
  light with an ancestor-background-compositing browser regression (`a2482aa`). All 18
  tests, build, and four browser/a11y/contrast tests passed.
- Task 5 delegated completion: `rsa-educational` form-control boundaries now measure
  3.28:1 dark and 4.03:1 light with blocking computed-style regressions (`261ad16`). All
  30 tests, typecheck, build, and three browser/a11y tests passed.
- Task 5 delegated completion: `nonce-guard` textarea boundaries now measure 3.59:1 dark
  and 4.01:1 light with blocking computed-style regressions (`2db23b3`). All 22 tests,
  build, and five browser/a11y tests passed.
- Task 5 delegated completion: `broken-trust` trial-select boundaries now measure 3.47:1
  dark and 4.01:1 light with blocking rendered-style regressions (`937fe68`). All 41
  tests, build, and four browser/a11y/contrast tests passed.
- Task 5 delegated completion: `scloud-vault` parameter-select boundaries now measure
  3.58:1 dark and 4.06:1 light with blocking computed-style regressions (`ff21806`). All
  41 tests, build, and five browser/a11y tests passed.

Status key: `TODO` / `DOING` / `DONE` / `BLOCKED`.

---

## DONE

### 1. Triage and finish the 8 source-WIP repos — `DONE`
broken-trust, collision-vault, entropy-collapse, fhe-arena, isogeny-atlas, pq-families,
ratchet-wire, rsa-forge. All read diff-by-diff, completed, verified `test` + `build`, and
committed. Three had build failures from the same mid-edit pattern; two were missing tests
for behaviour an agent had already changed.

### 2. Verify the 4 unchecked unpushed commits — `DONE`
diffie-hellman-mitm, patron-shield, stream-ward, timing-sidechannel. All green, all
genuinely finished work, no edits needed.

---

## IN FLIGHT at last update (2026-08-01 ~20:30)

Five agents were running. **Check what actually landed before redoing anything** — they
commit and push per repo, so `git log --oneline --since='6 hours ago'` in a repo tells you
whether it was reached.

| Agent | Repos | Note |
|---|---|---|
| Border slice 1 | 36, starting `pairing-gate` + `world-ciphers` | died once on an API error, resumed |
| Border slice 2 | 36, `protocol-checker` … `gg20-wallet` | |
| Border slice 3 | 34, `hqc-vault` … `accumulator` | died once on an API error, resumed |
| Orphaned batch-4 claims | 8 privacy/ZK/MPC repos | died once, resumed; 5 of 8 already pushed |
| Score regressions | zk-proof-lab, drbg-arena, corrupted-oracle, tls-handshake | |

Three agents died mid-run on API errors in one evening. All were resumable from transcript.
**Instruct agents to commit and push per repo, never batching to the end** — that is what
made the deaths cheap.

Reports already landed in `audits/`: `SCORECARD-2026-08-01.md`, `FALSIFIABLE-CLAIMS.md`,
`BORDER-CONTRAST-STATUS.md`, `PRE-PUSH-STATUS.md`, `VERIFICATION-2026-08-01.md`.

## Fleet state at last update (2026-08-01, end of session)

- **0 demo repos with unpushed commits.** Everything is live.
- All 34 repos in the main push went CI-green after four failures were fixed.
- **72 border-contrast commits landed today**, against 112 repos originally failing.
  **Re-measure before assuming what is left** — trust `BORDER-CONTRAST-STATUS.md` for its
  per-repo detail (selector, ratio, file:line), not for its counts, which are now stale.
- **Task 9 is 4 of 4 done and pushed**: `tls-handshake` ("Give the Finished checks a
  reachable fail…"), `corrupted-oracle` ("Compute the attack verdict, the heatmap…") and
  `drbg-arena` ("Paint the bits that are actually broken…"), and `zk-proof-lab`
  (`4d8b2b4`). The latter now gives its graph commitment check a reachable, browser-tested
  rejection path and explicitly says its toy verifier sees the witness and assumes setup.
- All agents were stopped deliberately at end of session, not lost. Their finished work was
  pushed per repo, which is why nothing is stranded.

**17 dirty repos, and the distinction matters:**

*Six have real uncommitted source edits — agents stopped mid-task. Read each diff and
either finish or `git checkout --` it; do not assume any of it is correct or complete:*

```
blind-hello          M src/styles.css        border-contrast work, partial
diffie-hellman-mitm  M src/style.css         border-contrast work, partial
ibe-gate             M src/style.css         border-contrast work, partial — see caution below
kdf-arena            M src/style.css         border-contrast work, partial
timing-oracle        M styles/main.css       border-contrast work, partial
stark-tower          M index.html, M src/main.ts, M src/stark.ts   falsifiable-claims work, partial
```

**`ibe-gate` needs care.** It is one of the six repos whose base rule fails on its own and
is rescued by a later `[data-theme=...]` override — 3.84:1 without it. An agent was
mid-edit there when stopped, so check the *effective computed* value in both themes before
trusting or discarding the partial change.

**`stark-tower` is the only non-CSS one** and the only one where a partial edit could
change behaviour rather than appearance. It also uses a custom `node scripts/test.mjs`
harness rather than vitest.

*Eleven hold only an untracked audit document, left in place deliberately. **Do not delete
these.** They are already duplicated in `audits/`, so the dirty flag is cosmetic:*
ablation-wire, credential-veil, dkg-gate, harvest-vault, hqc-timing, icy-dvrf,
iron-serpent, lattice-gentle, protocol-checker, schnorr-forge, spdz-forge.

**Known-red CI, pre-existing and not from this session:**
`quantum-vault-kpqc` fails the dark-theme axe gate on `#btn-export-vault`, `#btn-reset`,
`#btn-clear-vault` and the Import vault label. Verified pre-existing by stashing. Its
Pages deploy is a separate workflow and is green, so the demo does ship.

---

## TODO — ordered by what unblocks what

### 3. Preserve the gold-standard audit docs — `DONE, with a caveat`
**Reversed from its original form, which was "delete these".** They are not clutter: they
are dated per-repo audits plus a 373-line master template. All 12 are now committed at
`audits/` (commit `08da05c`). The redundant untracked originals still sit in their demo
repos — removing them was blocked by the permission classifier and was left alone
deliberately. Harmless; they are duplicated in git.

**Three files of this kind were deleted in error earlier and are unrecoverable**
(spdz-forge/chat.md 292 lines, hqc-timing/chatgpt.md 222, hqc-timing/gem.md 15). Partial
salvages with explicit loss markers sit at those paths. If the source AI conversations
still exist, re-exporting them is the cheapest repair and is worth doing before task 6
leans on that directory.

### 4. Push all verified commits to origin — `DONE`
All 34 repos pushed, all CI-green. Four failed on first push and were fixed:

- `zk-arena` — bundle budget, 24.15 KB gz vs 20 KB. Real savings found first (Vite's
  modulePreload polyfill, dead in a single-entry build, ~1.2 KB); budget then raised to
  25 KB with the reasoning recorded in the file. **The gate stays blocking.**
  **Decision taken 2026-08-01: keep the 25 KB budget.** The alternative was cutting ~4 KB
  out of the safe-parameter-set feature, which is itself the fix for the lab demonstrating
  zero knowledge in a group that leaks ~19 bits of the secret from the public key alone.
  Teaching correctness beats an arbitrary byte ceiling. Not a precedent for other repos:
  the next exhibit that wants the space still has to come back and justify it.
- `gg20-wallet` — axe `scrollable-region-focusable` on the wraparound number line. Fixed
  the pattern (`.wl`, `.math`, `.table-wrap` all made focusable and named), not just the
  one element.
- `biham-lens` — axe scanning mid-animation, catching half-drawn text at 1.8:1. Not a
  palette bug: the same page scanned 2s later was clean in both themes. The scan now
  settles animations first. Had been failing roughly every other run.
- `threshold-decrypt` — its e2e test asserted the app shows "rejected" the instant a cheat
  is injected, which is exactly the behaviour that session's fix removed.

### 5. Finish the fleet-wide border-token accessibility pass — `TODO, 112 repos remain`
Last of four accessibility items. The other three are confirmed done: touch targets (170
labs), banner-landmark dedupe (170), skip-link contrast (11 real failures fixed of 113
examined; worst were `key-exchange` and `poly1305-mac` at 2.01:1 in dark).

Measured 2026-08-01, full report in `audits/BORDER-CONTRAST-STATUS.md`:

- **112 of 175 repos still fail**; 106 of those fail in more than one theme.
- 33 pass (the repos the original pass actually reached), 30 have no bordered text-entry
  control, 1 unevaluable (`blind-oracle-api`, no HTML/CSS outside build output).
- Worst: `pairing-gate` and `world-ciphers` tied at **1.23:1** (`--border: #e2e8f0` on
  `#ffffff`). `world-ciphers` is worse overall — same token fails on `select`, `input` and
  `textarea` in BOTH themes.
- `hash-zoo` is a genuine incomplete fix: commit `a8e4d7d` moved `textarea`, `.lext-field
  input` and `.tab` to `--border-strong` but left `#intro-input` on the old `--border`.

**I earlier reported "105 of 176 already done". That was wrong** — my grep included the
word `border`, which matched unrelated commits. The strict count is 33-35. The pass
covered about a fifth of the fleet, not most of it.

Two traps: only LOAD-BEARING borders count (decorative ones were deliberately left alone,
and buttons/tabs are advisory-only), and six repos — `hybrid-guide`, `ibe-gate`,
`model-breach`, `noise-pipe`, `oram-vault`, `pairing-gate` — have per-theme overrides that
rescue a base rule failing on its own. Of those, only `hybrid-guide` actually passes;
`model-breach` has no bordered control; the other four genuinely fail.

Separately: the shared header's `.cl-btn` theme toggle sits at 2.4-2.5:1 fleet-wide. That
is one copied snippet and one decision, not 170 defects.

### 6. Run the gold-standard 10/10 scoring pass — `PARTLY DONE, RECOVERY IN FLIGHT`
Fable completed this for all 174 demos and **never wrote it to a file**. The scorecard on
disk, `../__Misc/CRYPTO-LAB-PEDAGOGY-SCORECARD.md`, is dated 2026-07-23, covers 136 demos,
and is the one fable proved stale.

Recovered from the transcript so far — the eight that moved most:

| Demo | Prior | Now |
|---|:--:|:--:|
| opaque-gate | 4 | 8 |
| x3dh-wire | 5 | 9 |
| kdf-arena | 5 | 8 |
| poly1305-mac | 6 | 9 |
| aegis-gate | 7 | 9 |
| tls-handshake | 8 | 7 |
| bcrypt-forge | 7 | 6 |
| drbg-arena | 7 | 6 |

**No demo scored 10.** The gold-standard goal is not met by any lab yet, including the 9s.
Only three moved down (task 9).

If the recovery agent returns only a fraction of the 174, re-scoring the remainder is real
work — but cheaper than the first pass, since the fleet has had a remediation pass since.

The working definition of the bar, from the spdz-forge audit: **claim-complete evidence** —
every claim the page makes is computed from the run rather than asserted, every verdict
states only what the protocol actually learned, and every important browser state is tested
rather than merely visited.

### 7. Retire the superseded root docs — `DONE`
Removed `HEADER-ROLLOUT-TODO.md` (it described the shared-header rollout as complete and
live, the opposite of the decision actually taken), plus `CARD-AUDIT.md`,
`CARD-ACCURACY-FINDINGS.md` and `futuredemos.md`, all snapshots the three sync tools now
generate or check continuously. References updated in `CLAUDE.md` and `concept-coverage.md`;
all three checkers clean.

`PROMPT-standardize-parts-A-D.md` was **not** deleted. It turned out to be untracked — the
same category as three audit docs lost earlier that day — so it moved to
`audits/_STANDARDIZE-PROMPT.md` with its retired shared-header sections flagged.
**Check `git ls-files --error-unmatch <file>` before deleting anything in a repo root.**

### 8. Fix the falsifiable claims found but never fixed — `DONE`
`audits/FALSIFIABLE-CLAIMS.md` now holds **189 claims across 68 repos** — not the ~78 the
session summary reported, which counted only two of four batches. **124 have no fix
confirmation.**

The largest single gap: **an entire audit batch never reported to the main thread.** The
  privacy/ZK/MPC cluster's findings originally existed only in a subagent transcript. The
full orphaned set is now remediated: `snark-arena` (6 claims), `shadow-vault` (7), `patron-shield` (5),
`stark-tower` (4), `oram-vault` (3), `ring-sign` (3), `credential-veil` (3),
`oblivious-shelf` (3), and `search-vault` (2). Also remediated since the original audit:
`drbg-arena` (8) and `corrupted-oracle` (7).

Expect a high stale rate when cross-checking: every external review checked so far
described already-fixed code. The defect class is consistent — a demo asserts something its
own code does not compute, and the honest computation is usually already written, one
import away.

Completion update (2026-08-01): every ledger entry formerly marked `NO FIX CONFIRMATION`
or `MIXED` has now been verified and resolved, with per-repo commits and gate evidence
recorded inline in `audits/FALSIFIABLE-CLAIMS.md`.

### 9. Investigate the demos whose scores regressed — `DONE`
**Ten regressed, not three.** The two largest were never reported at the time:
`zk-proof-lab` 8->5 and `hawk` 7->5.
`tls-handshake` 8->7, `bcrypt-forge` 7->6, `drbg-arena` 7->6. Either the demo got worse or
the earlier score was too generous — determine which, per demo.

`bcrypt-forge` is the likeliest to be real. Its faked exhibits were the worst found all
session: a "rainbow table lookup" with no table, an "Attempted N of 100,000 dictionary
words" counter driven by wall-clock with zero hashes run, a key-schedule animation printing
"the key schedule ran 16,384 rounds" after 40 `Math.random()` frames, and a cost slider
taking the same 1.8s at cost 6 and cost 14 — flat across a 256x range, in the panel whose
whole thesis is that each +1 doubles the work. Commit `13bf273` claims to have replaced all
three. Verify it actually did.

### 10. Action the recommendations in the 9 recovered audit docs — `TODO`
2,589 lines in `audits/`, never worked through because nobody could see untracked files.
Read each against current repo state; act on what is still true.

Start with `_MASTER-TEMPLATE.md`, which calls itself the single source of truth for how
every lab is built. Decide whether it is promoted to the repo root or merged into
CLAUDE.md — two competing standards documents is worse than one.

---

## Operational notes

- **The a11y gate DOES run locally.** `npx playwright install chromium` works on this box,
  then `npm run test:a11y`. I wrongly assumed it could not and pushed four repos whose only
  failing stage was one I had declined to run. Run it before pushing anything that touches
  markup — it is the stage that fails most.
- **Bundle-size budgets are also local-only-checkable and also not run by default.** Several
  repos have `npm run check:size`. `zk-arena` blew its budget on a legitimate feature.
- **Do not run a fleet-wide script while agents are live in the same repos.** Two agents hit
  concurrent writers doing exactly this; nothing was lost, but in `bcrypt-forge` the
  script's commit message landed on an agent's `index.html` edits.
- **Watch out for loose grep patterns when counting fleet state.** Grepping commit subjects
  for `border` inflated "repos with the border fix" from 33 to 105 and led me to report a
  pass as nearly done when it had covered a fifth of the fleet. Match on the specific
  string, then spot-check.
- **`git fetch` before trusting any ahead/behind count.** A stale remote-tracking ref
  produced a wrong "0 unpushed" in the previous resume notes.
- **Verify agent claims, including corrections to your own briefs.** Several have corrected
  a brief rather than following it, and were right. Several external findings were stale.
  Both cases are cheap to check and expensive to get wrong.
- **Check `git ls-files --error-unmatch <file>` before deleting anything.** An untracked
  file in a repo root looks identical to a tracked one and is gone forever. This already
  cost three audit documents.
- **Tell agents to commit and push per repo, never batching to the end.** Three died on API
  errors in one evening; the ones that had been pushing incrementally lost almost nothing.
- **The dominant defect in this fleet is a test that pins behaviour a fix deliberately
  changed.** Four instances in one day: `web-of-trust`, `hqc-timing`, `threshold-decrypt`'s
  e2e spec, and `simon-period`. When triaging a diff, look for the semantic change first,
  then hunt the test still asserting the old semantics.
- **Verify UI changes by running the page, not the suite.** See
  `audits/VERIFICATION-2026-08-01.md`. `broken-trust` would have had seven empty regions
  with a fully green test run.
