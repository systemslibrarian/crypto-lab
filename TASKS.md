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
| `FALSIFIABLE-CLAIMS.md` | 189 claims across 68 repos; every one now resolved, with per-repo commits inline |
| `SCORECARD-2026-08-02-*.md` | Current pedagogy scores for the whole fleet, with a "what would raise it" list per demo |
| `TRIAGE-2026-08-02-batch-{1,2}.md` | The nine recovered per-repo audits, each recommendation classified done / stale / still-applicable / proposed |
| `_MASTER-TEMPLATE.md` | The build/teach/look/a11y standard every lab is measured against |
| `TEMPLATE-DECISION-2026-08-02.md` | Why that template stays in `audits/` rather than being promoted or merged |

Read the relevant one before starting a task. Do not re-derive what is already measured.

Retired on 2026-08-02 (in git history if a historical read is needed):
`BORDER-CONTRAST-STATUS.md` — Task 5 is complete and every listed repo now carries a
blocking both-theme contrast regression, which enforces continuously what that file
measured once. `PRE-PUSH-STATUS.md` and `VERIFICATION-2026-08-01.md` — dated snapshots
superseded by CI and by the per-repo regressions. The nine per-repo audit docs — fully
triaged into the two `TRIAGE-2026-08-02` files. See `RETIREMENT-PROPOSAL-2026-08-02.md`.

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

- Credit-window checkpoint: durable handoff written to `RESUME-HERE.md`. Task 8 is DONE.
  Task 5 remains active; its conservative next recheck queue and clean/active repo state
  are recorded there. Tasks 6 and 10 remain open after Task 5.

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
- Task 5 delegated completion: `stego-suite` field boundaries now measure about 3.86:1
  dark and 3.84:1 light after compositing translucent fills, with a blocking browser
  regression (`927cfb2`). Typecheck, 39 tests, build, and three browser/a11y tests passed.
- Task 5 delegated completion: `nonce-collision` field boundaries now measure 3.30:1 dark
  and 4.17:1 light with blocking computed-style regressions (`2bb1691`). All 36 tests,
  typecheck, build, and three browser/a11y tests passed.
- Task 5 continued: `falcon-seal` textarea boundaries now measure 4.69:1 dark and 4.00:1
  light with blocking computed-style regressions (`4226ce6`). All 18 tests, build, and
  both-theme motion-neutralized accessibility scans passed.
- Task 5 delegated completion: `psi-gate` textarea boundaries now measure 3.58:1 dark and
  4.29:1 light with blocking computed-style regressions and deterministic theme setup
  (`98b3c5e`). All 40 tests, build, and three browser/a11y tests passed on final rerun.
- Task 5 delegated completion: `padding-oracle` text/select boundaries now measure at least
  3.84:1 dark and 3.98:1 light with a minimum-across-controls browser regression
  (`5f2f536`). All seven tests, typecheck, build, and three browser/a11y tests passed.
- Task 5 delegated completion: `signed-bytes` text-field boundaries now measure at least
  3.10:1 dark and 3.62:1 light with all-controls computed-style regressions (`c36ea47`).
  Typecheck, 132 tests, build, and 12 browser/a11y/behavior tests passed.
- Task 5 delegated completion: `phantom-vault` input boundaries now measure at least
  4.15:1 dark and 4.18:1 light with minimum-across-inputs regressions (`9672507`). Dual
  typechecks, 46 tests, uniformity check, build, and four browser/a11y tests passed.
- Task 5 delegated completion: `threshold-decrypt` text-input boundaries now measure at
  least 3.85:1 dark and 3.41:1 light with all-input computed-style regressions (`92f5d3b`).
  All 38 tests, typecheck, build, and four browser/a11y tests passed.
- Task 5 recheck: `entropy-collapse` is stale/no longer applicable. Current production
  source renders no select or other bordered text-entry control; only an unused `select`
  CSS rule remains. The repo was left unchanged after a clean fetch/source verification.
- Task 5 delegated completion: `enigma-forge` form-control boundaries now measure at least
  3.30:1 dark and 4.07:1 light with all-controls computed-style regressions (`2fd6f6f`).
  All 60 tests, typecheck, build, and four browser/a11y tests passed.
- Task 5 delegated completion: `schnorr-forge` input boundaries now measure at least 3.59:1
  dark and 4.60:1 light with minimum-across-inputs regressions (`a02b70f`). All 69 tests,
  typecheck, build, size budgets, and 35 cross-browser tests passed (four expected skips).
- Task 5 delegated completion: `chain-of-trust` select boundaries now measure at least
  3.30:1 dark and 3.68:1 light with all-select computed-style regressions (`d7e02a1`). All
  78 tests, typecheck, build, and five dark/light/mobile browser/a11y tests passed.
- Task 5 delegated completion: `isogeny-atlas` text/select boundaries now measure at least
  3.43:1 dark and 4.09:1 light with rendered computed-style regressions (`292594b`). All
  58 tests, typecheck, build, and 15 browser/mobile/a11y tests passed.
- Task 5 continued: `musig-gate` field boundaries now measure at least 3.23:1 dark and
  4.66:1 light with all-field computed-style regressions (`638c110`). All 261 unit tests,
  build, and 136 browser/a11y/flow tests passed (two expected mobile skips).
- Task 5 delegated completion: `dilithium-seal` textarea/text-input boundaries now measure
  at least 3.47:1 dark and 3.38:1 light with rendered regressions (`4d8ccf3`). All 20 tests,
  typecheck, build, and six browser/a11y/behavior tests passed.
- Task 5 recheck: `syndrome-hints` is stale/no longer applicable. The audited number-input
  selector exists only in dead CSS and renders zero matches in both themes. All 62 tests,
  typecheck, build, and eight browser/a11y/behavior tests passed; repo unchanged.
- Task 5 delegated completion: `world-hashes` text/select boundaries now measure at least
  4.06:1 dark and 4.49:1 light with minimum-across-controls regressions (`a8eea9f`). All
  58 tests, typecheck, build, and four browser/a11y/claim tests passed.
- Task 5 delegated completion: `shamir-gate` form-control boundaries now measure at least
  4.58:1 dark and 3.62:1 light with computed-style regressions (`a777192`). All 50 tests,
  typecheck, build, and four browser/a11y tests passed.
- Task 5 delegated completion: `envelope-kms` seal-input boundaries now measure at least
  3.57:1 dark and 4.04:1 light after compositing translucent ancestors (`eba0d26`). Full
  typecheck, lint, 62 tests, build, and four browser/a11y tests passed.
- Task 5 continued: `card-trick` form-field boundaries now measure at least 3.52:1 dark and
  4.70:1 light with all-field computed-style regressions (`a37f82f`). All 138 unit tests,
  build, and 62 desktop/mobile/browser/a11y tests passed.
- Task 5 delegated completion: `multivariate` load-bearing select boundaries now measure
  at least 4.31:1 dark and 5.01:1 light with computed-style regressions (`fddef9c`). All
  33 tests, typecheck, build, and six browser/a11y/audience tests passed.
- Task 5 delegated completion: `babel-hash` form-control boundaries now measure 4.02:1
  dark and 4.49:1 light with all-control computed-style regressions (`55e5c96`). All 28
  tests, lint, typecheck/build, and three browser/a11y tests passed.
- Task 5 delegated completion: `gg20-wallet` text-control boundaries now use scoped tokens
  and pass both themes (`86fa94c`); all 19 tests, typecheck/build, and four browser/a11y
  checks passed.
- Task 5 delegated completion: `pq-rotation` controls now use a scoped opaque border and
  pass its dark-theme composited regression (`5ffb07b`). All 36 tests, typecheck/build,
  and two browser/a11y checks passed.
- Task 5 delegated completion: `key-mirror` text-input boundaries now measure 3.33:1 dark
  and 3.31:1 light (`e8b2a1e`). All 50 tests, typecheck/build, and four browser/a11y
  checks passed.
- Task 5 delegated completion: `lattice-gentle` text/number-input boundaries now measure
  3.96:1 dark and 3.21:1 light (`f3ef9d9`). All 57 tests, typecheck/build, and 13
  browser/a11y/mobile checks passed.
- Task 5 delegated completion: `search-vault` text/select boundaries now measure 3.73:1
  dark and 3.16:1 light (`3bec966`). All 78 tests, typecheck/build, and seven
  browser/a11y checks passed. The helper was stopped before beginning `opaque-gate`.

## Current-session update — 2026-08-02

- Task 5 resumed. Fetch-first scan of the 21-repo queue: all clean and synced; the only
  dirty flag is `spdz-forge`'s preserved untracked `chat.md`. Three helper slices are
  working the queue in parallel (A: hpke-envelope..time-lock-puzzle, B:
  pake-gate..protocol-compose, C: encrochat..beacon-lock); `ring-sign` was done directly.
- Task 5 continued: `ring-sign` text/range/select boundaries now use a scoped
  `--line-strong` token measuring at least 3.43:1 dark and 3.84:1 light against both fill
  and exterior surfaces, with blocking both-theme computed-style regressions (`cf0ff1b`).
  All 35 unit tests, build, and four browser/a11y tests passed.
- Task 5 slice A complete — all seven repos fixed (none stale), each with a scoped
  control-border token, blocking both-theme computed-style regressions, full gates green,
  committed and pushed individually; HEADs verified by the coordinator: `hpke-envelope`
  (`103b22d`, 3.69+ dark / 3.74+ light), `opaque-gate` (`f6c62a0`, 3.50/4.34),
  `time-trust` (`047c0e0`, 3.48/4.44), `blind-relay` (`8ba9865`, 3.58/3.98), `fhe-arena`
  (`97fab8e`, 3.67/3.57), `kerberos` (`ea60d1c`, 4.55/4.33), `time-lock-puzzle`
  (`c703250`, 3.61/4.31).
- Task 6/10 fan-out (16:00): five scoring agents cover the 92 unscored demos, four
  re-verify agents cover 59 of the 74 recovered scores, two triage agents work the nine
  recovered audit docs, one agent drafts the `_MASTER-TEMPLATE.md` consolidation
  recommendation. All write incrementally to `audits/` slice files; `SCORES-2026-08-02.md`
  at the root maps them and holds the merged results.
- Task 10 first item DONE: `_MASTER-TEMPLATE.md` decision taken per
  `audits/TEMPLATE-DECISION-2026-08-02.md` — kept in `audits/` as the referenced demo-repo
  build standard (promoting or merging would either recreate the stale-root-snapshot
  problem or 2.4x CLAUDE.md for an audience that never loads it). Correction pass applied:
  opening rescoped with a status header, §3.0 rewritten for the retired shared-header
  reality, `cl-hero` managed-block markers dropped, README closer made count-free,
  `CRYPTO-LAB-TEMPLATE.md` self-references fixed, favicon/no-emoji tension clarified.
  `_STANDARDIZE-PROMPT.md` moved to `archive/header-rollout/`. CLAUDE.md gained a
  one-line pointer under Conventions.
- Task 10 triage batch 1 complete (tables in `audits/TRIAGE-2026-08-02-batch-1.md`):
  `ablation-wire` 13/13 recommendations already done (1 external-process item proposed);
  `credential-veil` 8/8 done via `e82cc2b` (2 proposed: differential BBS tests, production
  track); `harvest-vault` 12/12 done tier by tier; `hqc-timing` both salvaged bug findings
  verified fixed, the lost ~210 lines remain unrecoverable; `dkg-gate` gained the one still-
  applicable slice — property-by-property threat model, bias-statistics honesty, and a
  mobile-reflow e2e gate (`c3e845a`, pushed, verified by coordinator; 96/96 tests, build,
  5/5 a11y; 7 larger items proposed with rationale). Confirms the stale-audit pattern:
  33 of 39 non-lost recommendations were already implemented.
- Task 5 slice C complete — all seven repos fixed (none stale), scoped control tokens,
  blocking both-theme composited regressions (gradient repos assert every gradient stop),
  full gates green, pushed individually; HEADs and clean trees verified by coordinator:
  `encrochat` (`3b38ae5`, 3.56 dark / 3.81 light), `ntru-classic` (`b12e723`, 5.07 both
  states), `dp-noise` (`e79fb33`, 3.45/4.00), `mpcith-sign` (`6a7c347`, 3.46+ both,
  pixel-verified), `mayo-seal` (`3b87bcc`, 3.84/3.48), `power-trace` (`3a206b5`, 4.13/4.13
  — dark ALSO failed at 2.91 vs the rendered panel gradient despite the audit calling it
  light-only; fixed both), `beacon-lock` (`8a265a0`, 3.66/4.08).
- Task 5 slice B complete — all six repos fixed (none stale), pushed, HEADs and clean
  trees verified by coordinator: `pake-gate` (`1c7cf8b`, 3.72 dark / 4.07 light),
  `spdz-forge` (`67948dd`, 4.13/3.61, preserved chat.md untouched), `lll-break`
  (`a7382c3`, 3.68/3.56 — also deflaked the pre-existing red `test:ui` axe gate that was
  scanning mid-fade; killMotion added to the smoke suite, no assertion weakened),
  `frodo-vault` (`e4daf2b`, 3.76/3.83), `kyber-vault` (`38d08c2`, 4.09/4.13, nested
  package), `protocol-compose` (`2c2ae74`, 3.80/3.96, regression at both token and
  rendered level). **TASK 5 IS COMPLETE: 21 of 21 queue repos done.**
- Task 10 triage batch 2 complete (tables in `audits/TRIAGE-2026-08-02-batch-2.md`):
  `icy-dvrf` 9/10 done day-of-audit, gates re-verified green (SHA-pinned actions and
  transcript replay proposed); `schnorr-forge` 15 done 2 partial, gates re-verified;
  `protocol-checker` machine-derived verdicts landed day-of-audit, four feature-scale
  items proposed (incl. the fleet-wide LICENSE decision — no repo has one);
  `spdz-forge` read-only: the three lost P0 blockers were implemented by `7802c6b`,
  GS-06..08 remain unrecoverable, fresh audit proposed; `lattice-gentle` had one live
  defect — the toy Dilithium 4-bit challenge accepts tampered messages ~1/16 of the time
  and the UI called that "SIGNATURE ACCEPTED" with a caption claiming disagreement was
  guaranteed; now labeled as a reachable toy-scale forgery with pinned seeds for both
  branches and a deterministic e2e drive (`fca3ad7`, pushed, verified; 58/58 tests, 13
  Playwright green three consecutive runs). **TASK 10 TRIAGE IS COMPLETE** — remaining
  output is the PROPOSED lists awaiting maintainer decisions.

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

### 5. Finish the fleet-wide border-token accessibility pass — `DONE 2026-08-02`

The full 21-repo remainder queue was completed and pushed on 2026-08-02 (slices A/B/C plus
ring-sign; per-repo commits, ratios, and gates in the Current-session update above). Every
repo in the original 112-repo failing set has now either been fixed with a blocking
both-theme regression, been verified stale, or been reclassified as rendering no bordered
text-entry control. The section below is retained as the original task spec.
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

### 13. a11y scan-race audit — `TODO` — **HIGHEST YIELD, DO THIS FIRST**

**41 of 169 a11y specs remain.** This is currently the best defect seam known in the fleet:
**3 repos audited, real bugs found in 2 of them.**

**The bug.** A spec that goes from `page.goto` straight to an axe scan, with no wait, scans
whatever has painted by then. Where a page builds its UI asynchronously — a slow hash, an FHE
keygen, a proof, a worker — axe scans an **empty container and passes having checked nothing**.
The gate reports coverage it does not have. It usually shows up as "flaky", which is why it
survived: **treat a flaky a11y test as a coverage hole until proven otherwise.**

**What it has already found:**

| Repo | Hidden by the race |
|---|---|
| `bcrypt-forge` | 3 palette tokens tuned against white but drawn on a tinted panel — 3.97:1, 3.96:1, and one at exactly 4.50:1 |
| `bulletproofs` | Two WCAG 2.1.1 keyboard-inaccessible scroll containers, plus every "secondary" control at 4.39:1 dark / **2.66:1** light |
| `ckks-lab` | Modulus chips at 3.71:1 dark / 4.42:1 light, reachable only by driving exhibit 3 |
| `bb84` | Nothing — clean negative, honestly reported |
| `dead-sea-cipher` | An SC 1.4.3 failure at 4.49:1, never seen because the scan only ever visited the untouched page |

**Method — all four parts matter:**

1. **Wait for the real content** before scanning, then see what the deterministic result is.
2. **Scan states beyond first paint.** A gate that only scans the untouched page cannot see a
   violation in a result panel, an error state, or a failed verdict. Drive the page there.
3. **Measure contrast arithmetically** where a palette matters. **axe is not a complete
   contrast oracle** — it under-reported (named 1 of 2 failing nodes in `bcrypt-forge`) and it
   **refuses to compute contrast over a background gradient**, dropping those nodes into
   `incomplete` where a violations-only assertion never sees them (that blind spot hid the
   `bulletproofs` failures). Copy the `e2e/contrast.ts` helper from `bulletproofs` or `ckks-lab`.
4. **Settle motion with `page.emulateMedia`, and ASSERT the media query matched.**
   `test.use({ reducedMotion: 'reduce' })` **silently does nothing** on Playwright 1.61.1.

Regenerate the remaining list with the snippet in `RESUME-HERE.md`. Roughly 3 repos per agent.

### 13+14a MERGED SWEEP — the work queue — `IN PROGRESS`

Tasks 13 (scan race) and 14a (opacity injection) are **one sweep, not two**: same file, same run.
**78 distinct repos** need a visit; only 14 have both defects, so two separate passes would mean
92 visits and would re-open the same spec twice.

**Cadence: ONE agent, ONE repo at a time** (user's call, 2026-08-05 — credits are finite and
every multi-repo agent yesterday died on an API error or the watchdog). Work the queue in order;
the densest repos are first.

**Order 1 — both defects (12).** curve448 · e91 · harvest-vault · hqc-timing · hybrid-guide ·
hybrid-pqc · j-uniward · kyberslash · lms-ledger · lwe-hints · mpcith-sign · nonce-lattice

**Order 2 — opacity injection only (43).** dead-sea-cipher · format-ward · hash-zoo · hawk ·
hqc-vault · hybrid-wire · ibe-gate · jwt-forge · kerberos · key-exchange · kyber-vault ·
mac-race · merkle-proofs · mls-group · oblivious-shelf · opaque-gate · oram-vault · ot-gate ·
otp-vault · paillier-gate · pairing-gate · pki-chain · poly1305-mac · pq-rotation · psi-gate ·
shamir-vs-frost · shor · silent-tally · snark-arena · sphincs-ledger · stego-suite ·
syndrome-drain · syndrome-hints · threshold-decrypt · threshold-mldsa · time-lock-puzzle ·
tls-handshake · vdf · vrf-gate · vss-gate · web-of-trust · webauthn · zk-proof-lab

**Order 3 — scan race only (21).** ascon · babel-hash · biham-lens · blind-oracle · curve-lens ·
diffie-hellman-mitm · ec-point-arithmetic · ecdsa-forge · ed25519-forge · elgamal-plain ·
fhe-arena · frodo-vault · frost-threshold · garbled-gate · gg20-wallet · grover ·
isogeny-gate · jevil · lattice-fault · lms-xmss · nonce-lattice

**Done (13):** bulletproofs · ckks-lab · bb84 *(clean negative)* · aegis-gate · commit-gate ·
bitcoin-script · blind-sign · broken-trust · envelope-kms · bcrypt-forge · dead-sea-cipher(part) ·
bike-vault (`15d8531`) · enigma-forge (`d9fd909`)

**2026-08-05 evening: enigma-forge's sweep work was found STRANDED UNCOMMITTED** — an agent
died after finishing but before committing. The work was verified from scratch (61 unit +
57 browser tests green, the conflict-cell contrast fix mutation-checked red-then-green) and
landed. It found four real defect classes: crib-window conflict cells at 1.36:1 dark /
1.38:1 light (the exact letters the self-map lesson turns on), a `.success-banner.failed`
state with no CSS rule at all (failure text painted in the success palette), three
aria-labels on role-less divs silently discarded by browsers (axe files this under
`incomplete`), and four kinds of scrolling container with no keyboard route — three of
which only overflow at 380px, where a desktop-only gate never looks. NOTE: the final commit
was made by GEMINI (the user runs it as a concurrent writer in this fleet) seconds after
this session staged the files — content verified identical to what was tested. Before
assigning any repo, fetch and check for a dirty tree or fresh commits you did not make;
re-check right before committing.

**Yield so far: 12 real defects in 11 repos audited.**

**Queue regenerated on disk 2026-08-05 evening** (Gemini is landing fixes concurrently, so
these lists go stale fast — regenerate with the greps below before each assignment; the
Order 1/2/3 lists above and below this note are superseded):

- *Both defects (8):* hybrid-guide · hybrid-pqc · j-uniward · kyberslash ·
  lms-ledger · lwe-hints · mpcith-sign · nonce-lattice

**harvest-vault DONE 2026-08-05 (`170d307`)** — four real defects, each mutation-checked:
`.qday-band` light theme at 2.02:1 behind a stale override (hidden forever in axe's
`incomplete` bucket), a keyboard-unreachable 704px capture table at 380px, reduced-motion
`opacity: 0` ghost text stacked over the static fallback, and `.step-link.current` light
theme at 4.09:1. 41/41 unit, 28/28 browser (11 driven states × both themes × 1280/380px).
Reported, NOT fixed (needs a layout decision): the three 2026 timeline markers render at
the identical position and "YOU ARE HERE" intercepts pointer clicks aimed at the 2025
Gidney marker. Mid-task Gemini landed `1104a5f` there — its opacity-injection removal was
kept; its post-goto unasserted `emulateMedia`, its force-revealed scans, and its
"gradient contrast check" (which measured two appended divs' CSS variables, not the page)
were replaced.

**UPDATE 2026-08-06: the user has STOPPED Gemini** ("not doing a good job — we will slowly
have to clean up after him"). Cleanup queue: (a) LICENSE copyright revert to Paul Clark —
IN FLIGHT 2026-08-06, one pathspec-scoped commit per repo; (b) dependabot config decision
still open (ungrouped weekly, no PR limit, all 176 repos — regroup, limit, or remove);
(c) the 11 remaining template repos below need the honest-gate re-pass — user confirmed
2026-08-06 ("we will have to go back and fix the 12 repos that he half ass fixed").
**These 11 jump the queue: work them BEFORE the remaining opacity-only list**, because
their gates now read as fixed while the template's gradient check fake-passes:
babel-hash · biham-lens · gg20-wallet · grover · hqc-timing-break · hybrid-guide ·
hybrid-pqc · lms-xmss · lwe-hints · mpcith-sign · nonce-lattice.

**GEMINI FLEET-WIDE ACTIONS observed 2026-08-05 evening, flagged for the maintainer:**
(1) `.github/dependabot.yml` pushed to ALL 176 repos — ungrouped, weekly, both ecosystems,
no `open-pull-requests-limit`: exactly the configuration task 12 said to decide against
before running (ceiling ≈ 1,700 PRs fleet-wide; 18 dependabot branches existed within the
first hour). (2) Every LICENSE rewritten from "Copyright (c) 2026 Paul Clark" to
"Copyright (c) 2026 Systems Librarian" — reversing the 2026-08-04 standardization.
Neither reverted; both are the maintainer's call.
(3) At 20:02 Gemini bulk-applied a near-identical a11y template ("Fix a11y scan races and
add gradient contrast check") to 12 repos: babel-hash · biham-lens · gg20-wallet · grover ·
harvest-vault · hqc-timing-break · hybrid-guide · hybrid-pqc · lms-xmss · lwe-hints ·
mpcith-sign · nonce-lattice. The template removes the opacity injection (good) but keeps
`revealAll()` fabricated states, applies reduced-motion emulation without asserting it took
effect, scans only the untouched page, and its gradient check RETURNS A PASSING 5.0 WHEN
THE ELEMENT IS MISSING OR UNPARSEABLE — a fake-pass default. The task 13/14a greps now read
these repos as fixed, so **these 12 need an honest-gate re-pass** (harvest-vault already got
one, `170d307`). Claude sessions are taking the disjoint opacity-only list (43 repos, no
overlap with Gemini's 12) to stop the mid-air collisions.
- *Opacity injection only (42; dead-sea-cipher done 2026-08-05 `a96ed29` — ten defects
  fixed, worst 1.52:1 dimmed Kasiski strip text, two keyboard-unreachable scrollers, all
  mutation-checked; 46 unit + 41 browser green twice):* format-ward · hash-zoo · hawk · hqc-vault ·
  hybrid-wire · ibe-gate · jwt-forge · kerberos · key-exchange · kyber-vault · mac-race ·
  merkle-proofs · mls-group · oblivious-shelf · opaque-gate · oram-vault · ot-gate · otp-vault ·
  paillier-gate · pairing-gate · pki-chain · poly1305-mac · pq-rotation · psi-gate ·
  shamir-vs-frost · shor · silent-tally · snark-arena · sphincs-ledger · stego-suite ·
  syndrome-drain · syndrome-hints · threshold-decrypt · threshold-mldsa · time-lock-puzzle ·
  tls-handshake · vdf · vrf-gate · vss-gate · web-of-trust · webauthn · zk-proof-lab
- *Scan race only (10):* babel-hash · biham-lens · gg20-wallet · grover · hqc-timing-break ·
  isogeny-gate · jevil · lattice-fault · lms-xmss · ratchet-wire

62 repos remain. curve448, e91, enigma-forge and the old Order 3 tail (ascon, blind-oracle,
curve-lens, diffie-hellman-mitm, ec-point-arithmetic, ecdsa-forge, ed25519-forge,
elgamal-plain, fhe-arena, frodo-vault, frost-threshold, garbled-gate) now pass both checks.
Note the scan-race grep is a heuristic — a spec with any wait passes it even if one scan
still races; treat a pass as "not obviously racing", not "audited". Two WCAG 2.1.1 keyboard traps, contrast down
to 2.66:1, three instances of ARIA-prohibited names being silently discarded.

Regenerate the queue with the node snippet used on 2026-08-05 (match `opacity: *1 *!important` on
NON-COMMENT lines — the raw string over-counts, since fixed specs mention it in a docblock).

### 14a. Remove the `opacity: 1 !important` injection — `TODO` — **57 specs, HIGH PRIORITY**

Found in `broken-trust` (fixed, `feae4ae`) and then measured fleet-wide: **57 a11y specs inject
`opacity: 1 !important`** along with the motion suppression.

**This is worse than the `transition: none` problem, and worth doing first.** That one *hides*
defects. This one **fabricates results**. Real pages render text at partial opacity — a hero
subtitle at 0.85, a disabled control at 0.55, a zero-value bar at 0.4 — and forcing those opaque
hands axe foreground colours **the page never paints**. Every contrast number the gate then
reports is fiction in both directions: it can clear a real failure, and it can invent one no
user could ever see.

So for any lab in the list below, a green contrast gate currently means **nothing**, and a red
one may be chasing a colour that does not exist.

Fix: delete the `opacity` clause outright. Do not replace it — partial opacity is real rendering
and is exactly what the gate should be measuring. Then re-run and treat whatever appears as a
genuine finding.

Affected (57): bike-vault curve448 dead-sea-cipher e91 enigma-forge format-ward harvest-vault
hash-zoo hawk hqc-timing hqc-vault hybrid-guide hybrid-pqc hybrid-wire ibe-gate j-uniward
jwt-forge kerberos key-exchange kyber-vault kyberslash lms-ledger lwe-hints mac-race
merkle-proofs mls-group mpcith-sign nonce-lattice oblivious-shelf opaque-gate oram-vault ot-gate
otp-vault paillier-gate pairing-gate pki-chain poly1305-mac pq-rotation psi-gate shamir-vs-frost
shor silent-tally snark-arena sphincs-ledger stego-suite syndrome-drain syndrome-hints
threshold-decrypt threshold-mldsa time-lock-puzzle tls-handshake vdf vrf-gate vss-gate
web-of-trust webauthn zk-proof-lab

Regenerate the list by matching `opacity: *1 *!important` on non-comment lines — matching the
raw string over-counts, because two specs now mention it only in a docblock explaining why it
was removed.

### 14. Remove the `transition: none` injection — `TODO`

**162 of 169 specs** inject `transition: none` or `transition-duration: 0` before scanning.
While that injection is present the suite is **structurally incapable** of observing a
transition or theme-swap defect: it deletes the thing it is meant to be checking.

Largest by count, lowest by certainty — **not a bulk edit.** Removing it exposes a real
animation-drain race. In `dead-sea-cipher` the light palette builds on `CanvasText`, which
Chromium re-resolves lazily after a `color-scheme` change, and `getAnimations()` returned ~516
entries taking ~600 ms to drain, so axe read colour pairings the page never renders. The fix
is polling until nothing is animating — **never re-adding the injection.**

Best done as part of task 13 per repo, since both touch the same file.

### 15. Strip the resurrected shared-header markers — `DONE 2026-08-04`

Eight repos fixed, not the five first counted — the initial scans were too narrow twice
(first only `BEGIN/END` syntax, then only `index.html` + `*.css`). A marker also lived in
**TypeScript** (`mls-group/src/app.ts` generating the hero markup) and in **prose**
(`traitor-trace/CONTRIBUTING.md`). Lesson: scan every file type, then classify.

| Repo | What it said | Commit |
|---|---|---|
| `ghost-commit` | live `BEGIN/END` in `index.html` + `style.css` | `3b34f05` |
| `salamander` | same | `72e99ea` |
| `stream-ward` | same (`styles.css`) | `f1ba2a9` |
| `mls-group` | `BEGIN/END cl-hero standard markup` in `src/app.ts` | `53f8235` |
| `traitor-trace` | CONTRIBUTING: "reapplied by `crypto-lab/reapply-header.py`" | `b168a9e` |
| `card-trick` / `musig-gate` / `schnorr-forge` | "(managed cl-hero standard)" | `24cf583` / `da8f8f8` / `027c7bb` |

Comments only — no markup or style changed; every repo built and passed its suite.
Three descriptive mentions remain (`blind-oracle`, `kdf-chain`, `zk-arena`) and are fine:
they reference the standard as a convention, without telling anyone to run anything.

**Still open, related:** three demo repos carry **tracked** stale copies of the authoring
template — `dp-noise` (373 lines), `ghost-commit` (444), `stream-ward` (444). The live
template is kept in Google Drive and gitignored in the catalog, so these are drift. Removing
tracked files is the user's call; flagging rather than deleting.

### 15b. Strip the resurrected shared-header markers — *(original entry)*

CLAUDE.md states the `<!-- BEGIN/END crypto-lab shared header -->` and
`/* BEGIN/END cl-hero standard */` markers "were removed from all labs" and that seeing them
reappear means "something re-ran the retired tooling."

**They are present in 5 repos:** `dp-noise`, `ghost-commit`, `iron-serpent`, `salamander`,
`stream-ward`.

These are LIVE markers in `index.html` and `src/style.css`, not prose mentions. `ghost-commit`'s
reads: *"managed; edit shared-header.html + re-run reapply-header.py"* — pointing a contributor
straight at tooling that was deliberately retired to `archive/header-rollout/`. A further 24
files carry benign prose mentions of the old tooling; those are lower priority but worth a pass.

**The fix is to remove the marker comments, not the header.** Each lab owns its own header now,
so the markup and CSS stay exactly as they are — only the "managed, do not edit, re-run the
script" framing goes, because it is the instruction that is false and dangerous.

Found while landing the port fix in `traitor-trace`, whose `CONTRIBUTING.md` makes the same
stale claim in prose. That agent correctly declined to mix the fix into a port commit.

Worth checking whether these five were simply missed by the original strip pass, or whether
something re-ran the retired tooling in them — the answer changes whether this can recur.

### 12. Fleet-wide maintainer files — `IN PROGRESS`

Mechanical, identical across repos, and the only remaining tasks that need no per-repo
investigation. Do them **one at a time**, verifying each fully before starting the next.

| Item | State |
|---|---|
| **MIT LICENSE** | **DONE 2026-08-04** — 177/177. 157 added, 20 already had one, 0 failed. Verified: no commit touched anything but `LICENSE`, nothing unpushed. |
| **Dependabot** | `TODO` — 174 of 176 repos have no `.github/dependabot.yml`. |
| **SHA-pinned Actions** | `TODO` — 175 of 176 repos reference actions by tag, not SHA. |

**Dependabot — decide before running.** The config itself is trivial and identical; the real
question is blast radius. Two ecosystems apply (`npm` and `github-actions`), and across 174
repos a weekly schedule can open a very large number of PRs at once. Worth choosing
deliberately: schedule interval, whether to group updates into a single PR per repo
(`groups:` keeps it to one), and an `open-pull-requests-limit`. Ungrouped weekly npm updates
across this fleet would be unmanageable.

**SHA-pinning — note the risk.** Unlike LICENSE and Dependabot this one *changes what CI
runs*. It needs a GitHub API lookup to resolve each action tag to a commit SHA, and it should
keep the tag in a trailing comment (`uses: actions/checkout@<sha> # v4`) so the version stays
readable. Do it after Dependabot, and expect it to need spot-checking rather than trust.

**Reuse the LICENSE script's pattern** (`scratchpad/add-license.sh`): stage ONLY the intended
path and abort that repo if anything else appears in the staged set. Repos in this fleet hold
unrelated uncommitted work, and `git add -A` would swallow it.

### 11. Triage the external review of 13 demos — `TODO`

The user supplied an outside review (ChatGPT) of 13 demos, filed verbatim in
`audits/external-review-2026-08-03/`. Roughly 9,400 lines, ~330 numbered recommendations:

| Demo | Recs | Demo | Recs |
|---|---|---|---|
| bb84 | 32 | patron-shield | 28 |
| j-uniward | 32 | pake-gate | 29 |
| timing-oracle | 33 | bitcoin-wallet | 20 |
| simon-period | 33 | jevil | 12 |
| noise-pipe | 31 | falcon-seal | 11 |
| phantom-vault | 30 | curve-lens | 6 |
| vdf | 15 | | |

**Do not bulk-apply these.** They are a mix of genuine code defects, fair wording
corrections, and scope expansions that would violate the house rule of one concept per
demo. Each needs checking against current repo state before any of it is actioned — several
of these demos have had work land since the review was written.

**Calibration: see `audits/external-review-2026-08-03/TRIAGE.md` for the full triage.**

**Calibration so far.** The one claim checked end-to-end — patron-shield's "Bit-31
Collusion-Recovery Bug", which it calls the highest-priority code defect — is **real**:
`recoverByCollusion()` does `Math.log2(maskS ^ maskSPrime)`, and with bit 31 set the XOR is
`-2147483648`, the power-of-two guard passes anyway, and `Math.log2` of a negative returns
`NaN`. The suggested `31 - Math.clz32(diff >>> 0)` fix is correct.

But it is **not reachable today**: `DB_SIZE` is `CATALOG.length` = 8. It is a latent defect,
and the repo's own test asserts only `DB_SIZE <= 32` — i.e. the test permits exactly the
range that breaks. Fix the function AND tighten the invariant.

So: accurate on the code, over-ranked on severity because reachability was not checked.
Expect that pattern throughout — **verify each claim against the repo, and check whether the
failing state can actually be reached, before scheduling work.**

Suggested triage order — start where a defect is most likely to be both real and reachable:
`noise-pipe` (transport reset, concurrent-encryption nonce reuse), `timing-oracle`
(in-flight stale-result race), `bb84` (`bitsToBytes()` collisions, equality boundary,
computing a key after an abort), `patron-shield` (bit-31 + integer validation).

Several recommendations restate work already done in this fleet (retiring stale verdicts,
splitting browser test commands, deploy scripts that bypass typecheck). Check before
re-doing.

---

## Operational notes

- **A mutation check that breaks the build proves NOTHING.** Playwright serves `dist/`, and
  a failed build leaves the last good bundle in place, so the suite passes green against
  source that no longer compiles. This produced two false "verified" results on 2026-08-02.
  Two rules follow: always confirm the build actually succeeded during a mutation, and
  prefer type-safe mutations (invert a comparison, swap an operand) over ones that leave a
  variable unused — `tsc` rejects those and you get a stale-bundle pass instead of a real
  failure. Fixed structurally on 2026-08-02 by putting `npm run build &&` in front of every
  `webServer.command`; see `audits/_MASTER-TEMPLATE.md` §4.1.
- **A unit test that bypasses the DOM can certify behaviour the page cannot reach.**
  `hqc-timing`'s 30 tests passed against preset constants while the noise slider's `max`
  clamped those same values to a third of what the presets asked for, so the page could
  never do what the suite certified. When a constant drives a control, assert it fits the
  control's range.
- **A regression that mirrors the source's own branch logic agrees with the bug.**
  `harvest-timeline`'s test recomputed the condition it was checking and asserted the
  headline matched that branch, so it could not catch the branch itself being wrong. Assert
  the claim against the rendered data instead.

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
