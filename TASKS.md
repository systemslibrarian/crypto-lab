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
have to clean up after him"). Cleanup queue:
(a) LICENSE copyright revert to Paul Clark — **DONE 2026-08-06**, 177/177 repos now read
    "Paul Clark", one pathspec-scoped commit each, verified no commit touched anything but
    LICENSE. Two were blocked and handled last: `threshold-decrypt` held Gemini's unpushed
    shallow commit `4901202` ("remove opacity injection" — one line, valid but incomplete;
    pushed to unblock, still needs the full honest-gate re-pass), and `format-ward` was
    mid-a11y-work (finished as `b20d485` first). LICENSE fixes: `f49d8ed`, `c45831d`.
(b) **dependabot DECISION TAKEN 2026-08-06:** grouped weekly (one PR/ecosystem/repo, limit
    3) + auto-merge patch/minor on green CI, majors held. BLOCKER FOUND: only 50/176 repos
    run any CI on `pull_request` — the dominant `deploy.yml` (131 repos) triggers on push to
    main + workflow_dispatch only, so 126 repos have NO PR checks and nothing to gate a
    merge on. User chose to CLOSE THE GAP: add PR-triggered CI fleet-wide, then auto-merge on
    it. This also fixes a real pre-existing hole — those repos never validate a change before
    it lands on main. See the PR-CI plan under task 12. Not yet started.
(c) the 11 remaining template repos below need the honest-gate re-pass — user confirmed
    2026-08-06 that all 12 of Gemini's superficially fixed repos must be redone properly.
(d) Gemini's MISSION-SCRIPT.md (verification pipeline) output — ALL UNCOMMITTED, needs an
audit session before anything is trusted or committed: catalog `verification/` (schema.json,
registry.yaml, fixtures, HARNESS.md, README.md) + `tools/{validate-manifest,render-registry,
render-verification}.mjs`, plus untracked Pass A `verification/manifest.yaml` in shadow-vault
and ring-sign (the T2 calibration labs). Probed 2026-08-06: the validator FAILS ITS OWN
PASSING FIXTURE ("math_core file not found: math.js" + extraction_hash mismatch — it appears
to resolve paths against cwd, not the fixture dir), and the failing-banned-word fixture fails
on that same path bug rather than on the banned-word lint it exists to prove. So T0's
acceptance criterion (fixtures proving the validator works) does not hold. Good sign: neither
lab manifest forges `audit_mode.confirmed` — the human checkpoint is intact. Per
MISSION-SCRIPT §4, that audit is its own single-task session; do not fold it into the a11y
sweep.
**These 11 jump the queue: work them BEFORE the remaining opacity-only list**, because
their gates now read as fixed while the template's gradient check fake-passes:
~~hybrid-guide~~ · ~~hybrid-pqc~~ · ~~babel-hash~~ · ~~biham-lens~~ · ~~gg20-wallet~~ ·
~~grover~~ · ~~hqc-timing-break~~ · ~~lms-xmss~~ · ~~lwe-hints~~ · ~~mpcith-sign~~ ·
~~nonce-lattice~~ — **ALL 11 DONE as of 2026-08-08**; see the batch record below.
**hybrid-pqc DONE 2026-08-06 `37791f1`** (9 remain): honest gate over 6 driven states, NO
source defects (the sibling's broken selectors don't exist here). Its agent DIED on an API
error mid-commit ("Committing." was its last word) — HEAD was still baseline, work uncommitted
(3 e2e files, no source changes). Recovered by verifying from scratch, NOT trusting the dead
agent: unit 81/81, a11y 19/19 twice, gate integrity confirmed (scan asserts all five oracles),
and a mutation check (injected #8a8a8a subtitle → light scan red, dark green → reverted) proved
the gate bites before committing. LESSON: an a11y-gate agent that dies mid-commit leaves no
stranded mutation in SOURCE (the gate files aren't code-under-test), but its work is unverified
— run the suite twice + one gate mutation before adopting it.
**hybrid-guide DONE 2026-08-06 `225f1f8`** (10 remain): 3 real defects — `.hero-metric-label`
at 1.08:1 in light theme, dark-red secrets at 2.79:1 on a dark chip, a keyboard-unreachable
code block — all mutation-checked; 36 unit + 23 browser green twice.
**CONTRAST-HELPER CARRY-FORWARD:** hybrid-guide's e2e/contrast.ts fixed two measurement gaps
the enigma-forge/harvest-vault exemplars have — it now resolves colors through a CANVAS (so
`oklab()`/`color-mix()`/named colors compute, not just rgb()) and samples each background
gradient AT THE TEXT'S ACTUAL LOCATION instead of assuming the worst stop. Without those the
gate threw ~30 phantom dark-theme failures on this oklab palette. **For any repo using
oklab/color-mix or layered gradients (the hybrid-* family especially), adapt from
hybrid-guide `225f1f8`, not the older exemplars.**

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
- *Opacity injection only (41 remain; dead-sea-cipher `a96ed29` and format-ward `b20d485`
  DONE 2026-08-05/06 — format-ward found 6 defects incl. two light-theme arrows at 3.44:1
  and 3.02:1, a reflow blowout, aria-prohibited names, and an exhibit whose own defaults
  tripped its Rev.1 domain floor; all mutation-checked, 33 unit + 24 browser green twice):*
  hash-zoo · hawk · hqc-vault ·
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

**2026-08-08 — THE GREP NO LONGER FINDS THE QUEUE. 25 repos are silently mis-marked as done.**

Regenerating the opacity grep on 2026-08-08 returned **17** repos, not the 41 recorded above.
That drop is **not** progress. 26 repos received a one-line commit
`fix: remove opacity injection in a11y tests` (2026-08-06, all one file, 1–2 lines) that deletes
the `opacity` clause and changes **nothing else** — no driven states, no arithmetic contrast
helper, no asserted `emulateMedia`, and critically **no re-run to see what the now-honest gate
reports**. Only `format-ward` got a genuine pass afterward (`b20d485`).

This is the same shallow pattern this file already flagged by SHA: `threshold-decrypt`'s
`4901202` ("one line, valid but incomplete") appears in the list below — so these commits share
Gemini's provenance even though they carry the maintainer's git identity.

Deleting the clause was step one of three. Step two was re-running, and step three was treating
whatever appeared as a genuine finding. Steps two and three did not happen. Because step one is
the only step the grep can see, **these 25 now read as fixed in every automated check while
never having been audited at all.** Every honest pass so far has averaged about one real defect
per repo; there is no reason to think these 25 are clean, and nothing has looked.

**Treat this list as queue position #1** — ahead of the 17 grep-positive repos and ahead of
Gemini's 9 remaining template repos. A repo that looks done is more dangerous than one that
looks pending, because nothing will ever route a session back to it.

| Repo | Shallow commit | Repo | Shallow commit |
|---|---|---|---|
| ~~hash-zoo~~ **DONE `9a559b7`** | ~~`0c23df3`~~ | ~~pki-chain~~ **DONE `d820bd0`** | ~~`744e80c`~~ |
| ~~hawk~~ **DONE `c94a129`** | ~~`9ae8374`~~ | ~~poly1305-mac~~ **DONE `2df3f6f`** | ~~`3cfb8dc`~~ |
| ~~hqc-vault~~ **DONE `4207f50`** | ~~`54097a2`~~ | ~~pq-rotation~~ **DONE `c76b4eb`** | ~~`e7b842b`~~ |
| ~~jwt-forge~~ **DONE `a38c97c`** | ~~`1512cdd`~~ | ~~psi-gate~~ **DONE `8bc51c3`** | ~~`adea0f5`~~ |
| ~~kerberos~~ **DONE `a5fd7ff`** | ~~`8e72b87`~~ | ~~shamir-vs-frost~~ **DONE `81d3413`** | ~~`c93b42d`~~ |
| ~~key-exchange~~ **DONE `75ec61c`** | ~~`77ccaf8`~~ | ~~shor~~ **DONE `40419c8`** | ~~`2e230af`~~ |
| ~~mac-race~~ **DONE `65119ce`** | ~~`86357a5`~~ | ~~silent-tally~~ **DONE `2b69a50`** | ~~`2254db2`~~ |
| ~~merkle-proofs~~ **DONE `4bab044`** | ~~`7e8a489`~~ | ~~snark-arena~~ **DONE `e08b7f8`** | ~~`35b43f3`~~ |
| ~~mls-group~~ **DONE `d268eff`** | ~~`7a8c87c`~~ | ~~stego-suite~~ **DONE `333ea79`** | ~~`1c1015d`~~ |
| ~~oblivious-shelf~~ **DONE `ad13e27`** | ~~`e30e8ac`~~ | ~~syndrome-drain~~ **DONE `29d7831`** | ~~`5dfc70f`~~ |
| ~~opaque-gate~~ **DONE `e633533`** | ~~`86b220a`~~ | ~~syndrome-hints~~ **DONE `d10cce1`** | ~~`073ef30`~~ |
| ~~ot-gate~~ **DONE `af99a15`** | ~~`28b1820`~~ | ~~threshold-decrypt~~ **DONE `4d204af`** | ~~`4901202`~~ |
| ~~paillier-gate~~ **DONE `4d56d5c`** | ~~`e01d77e`~~ | | |

Do NOT revert these commits — removing the clause was correct as far as it went. The work owed
is the full task-13 method (wait for real content · scan driven states · measure contrast
arithmetically · assert the motion emulation took effect), then land whatever it finds.

**hash-zoo DONE 2026-08-08 `9a559b7` (24 remain) — and it settles the question this list opens
with: three real defects, every one invisible to the shallow fix.** The one-line commit removed
the opacity clause and the gate stayed green, because the gate never looked anywhere the defects
were. `.cl-hero-sub` faded `--muted` to 85% over `--bg-accent`'s radial wash and sat at 3.67:1 —
**axe reported nothing, because a radial gradient is exactly the case it files under `incomplete`
and never surfaces as a violation.** `.ibit-flip` put `#fff` on dark's lighter `--bit-changed`
under a 0.32-alpha hatch, 3.74:1, same blind spot. And `.term-def` tooltips used
`visibility: hidden`, which still occupies layout, so a 260px box on a term near the right edge
pushed the document 23px sideways at **every** viewport width — a WCAG 1.4.10 failure caused by
an element nobody can see, and one axe has no rule for at all.

So the shallow fix's green gate was green for three independent reasons, none of them "the page
is accessible". **Removing the injection does not find defects; scanning driven states with an
arithmetic oracle does.** Expect a comparable yield from the other 24.

**hawk DONE 2026-08-08 `c94a129` (23 remain) — 7 defects, and it widens the pattern.** Its old
gate was *better* than most (it genuinely drove both expensive exhibits) and still saw none of
them, because it scanned one accumulated state per theme at desktop width and asserted on
`violations` alone. Three contrast failures over gradient-composited panels (WITHDRAWN 3.92:1
dark / 4.40:1 light, its link the same, pass badge 4.30:1 light) — same gradient blind spot as
hash-zoo. Three `aria-label`s on role-less divs, which browsers discard silently and axe files
under `incomplete`. And a `.table-scroll` with no keyboard route at 380px, in a repo where the
other two `.table-scroll` wraps already carry `tabindex="0" role="region" aria-label` — the
author knew the fix and missed one, and only phone width reveals it.

**hqc-vault DONE 2026-08-08 `4207f50` (22 remain) — 12 defects, the highest count yet, and the
weakest gate found so far.** Its gate could have passed over a page where nothing ran: every
click was `.catch(() => {})` behind an `if (await el.count())` guard, so a stale selector was a
silent no-op — and one already was (`#aes-btn` does not exist; the AES panel submits a form), so
that whole exhibit went undriven and unscanned while the gate stayed green. Content was awaited
with `waitForTimeout(400)` rather than a real signal.

Its headline defect is worth knowing as a pattern: **`.panels` is a grid whose default `auto`
track takes its minimum from the widest item's min-content**, and one table's `min-width: 980px`
therefore sized the entire column — every panel rendered 1016px wide in a 380px viewport and the
document scrolled sideways, while the table's own `overflow-x: auto` wrapper never got to scroll
because nothing constrained it. `grid-template-columns: minmax(0, 1fr)` fixes it. **Any lab
laying panels out in a grid with a wide table inside is a candidate — check reflow at 380px
before assuming the `overflow-x` wrapper is doing its job.** Fixing it then exposed two more
scroll containers with no keyboard route: while the whole page scrolled, those tables never had
to, so the defect was hidden behind the bigger one.

**Three fleet-wide leads, all found by comparing repos rather than reading any one of them:**
- **`aria-label` on a role-less div is a template habit, and it is the highest-yield precheck.**
  Thirteen instances across three repos now (hqc-vault ×7, hawk ×3, enigma-forge ×3). Grep
  `<(div|span)[^>]*aria-label` filtered to lines without `role=` BEFORE starting a repo — it
  costs 30 seconds and pre-empts several gate iterations. Note two of hqc-vault's were best
  fixed by *deleting* the label, not adding a role: one on a page wrapper, and one whose
  "Category chip" label would have replaced the visible "Post-Quantum KEM". Read each before
  reflexively adding `role="group"`.
- **`.cl-hero-sub { opacity: .85 }` is shared-header markup repeated across ~170 labs, and it
  fails only in combination with a muted colour.** It was a real 3.67:1 defect in hash-zoo, where
  the rule also set `color: var(--muted)`. hawk and hqc-vault carry the identical opacity but
  inherit `--text`, so both pass. So the grep to run is not `opacity:.85` alone — it is that rule
  *together with* a muted/dimmed colour on the same element. Labs matching both are where a faded
  foreground over a gradient hits axe's two blind spots at once.
- **A wide `<select>` sizes to its longest option and can overflow a phone viewport by itself.**
  `#flip-placement` was 366px in a 380px viewport. Cheap to check anywhere a select carries a
  sentence-length option.

**jwt-forge DONE 2026-08-08 `a38c97c` (21 remain) — 2 defects, and it repeats hqc-vault's grid
pattern exactly.** `.lab { display: grid }` with a default `auto` track, one unbroken JWT rendered
`white-space: pre` inside it, and the page grew to 4103px at a 1280px viewport while
`.raw-token`'s own `overflow-x: auto` never got to scroll. **That is two of four repos so far
with the same root cause — treat `display: grid` with no `grid-template-columns` as a defect
candidate on sight**, and check reflow at BOTH widths, since this one blew out at 1280px, not
just 380px.

Two process lessons from this repo, both of which cost real time:

- **An orphaned preview server invalidated a green run, exactly as this file warns.** A killed
  run left a `vite preview` listening on 4655; `reuseExistingServer: !CI` meant the next run
  reused it and served a STALE BUNDLE. The mutation check came back green — not because the gate
  was blind, but because the page under test predated the mutation. `lsof -nP -iTCP:<port>
  -sTCP:LISTEN` before trusting any result, and kill by port after any interrupted run. The
  "4 passed" that preceded it had to be thrown away and redone too.
- **Verify a selector exists in the state you drive it from.** `[data-action="paste-toggle"]`
  renders only inside the raw Token view, and the drive had left the view on `diff`, so
  Playwright waited the full 10-minute test timeout for an element that could never appear. A
  grep of all `data-action` values tells you what exists somewhere, not what is reachable now.

- **Fix layout before chasing contrast.** While the page was 4103px wide the arithmetic oracle
  reported `.cl-hero-why-text` at 1.17:1, near-white on near-white. It was real at that moment
  and vanished with the reflow fix, because `.cl-hero-why` is a near-transparent `color-mix`
  wash and stretching the hero changed what it composited over. Some contrast failures are
  downstream of a broken layout; re-measure after fixing reflow before opening a palette.

**kerberos DONE 2026-08-08 `a5fd7ff` (20 remain) — 6 defects, including the most serious one
found so far.** `.swim-step` sets `opacity: 0` in its own rule and relies on an animation to
reveal it, while the reduced-motion block cancels animations **without restoring their end
state**. Every visitor with `prefers-reduced-motion: reduce` saw the entire swim-lane protocol
diagram — the lab's core teaching content — as blank space.

**This is the defect the `opacity: 1 !important` injection existed to hide, and it is the single
best argument for this whole sweep.** With the injection, the gate painted the content back for
the scanner alone. The shallow fix removed the injection, but the gate still never emulated
reduced motion, so it still could not see it. Only doing both — remove the injection AND emulate
the preference — surfaces it. **Add to the per-repo checklist: grep the stylesheet for
`prefers-reduced-motion` and check whether the block only cancels (`animation: none`) or also
restores end states. A rule that sets `opacity: 0` outside the media query and relies on an
animation to undo it is a blank-content defect.**

Two more from this repo:
- **The grid pattern is now 3 of 5 repos.** Here it was `.layout > .main`. Note the trap:
  that rule already had `min-width: 0`, which fixes what the element contributes to ITS parent
  and does nothing about the track sizing its own children. `min-width: 0` present is not
  evidence the grid is safe.
- **A fixed track minimum is a floor the container cannot go below.**
  `minmax(220px, 1fr)` overflowed a 380px viewport; `minmax(min(220px, 100%), 1fr)` is the fix.
  Worth grepping for `minmax([0-9]` fleet-wide.

**key-exchange DONE 2026-08-08 `75ec61c` (19 remain) — 5 defects, 31 elements invisible.**
`.hero-metric-label` took its colour from `--metric-muted`, near-white because it was authored
for `.hero-metric-card` — **a dark card that appears ZERO times in the markup**. The class
outlived the card and is now a generic small-caps label on ordinary panels, so in light theme
31 labels rendered near-white on near-white at 1.09:1. **Worth a general check: a colour token
whose companion container no longer exists is a live trap, and grepping for the container class
count is the tell.**

Also: `--accent` and `--accent-2` are fill/border colours being used as text (17 and 5 sites),
measuring 3.79–4.49:1. Split into `--accent-ink` / `--accent-2-ink` per theme. **That split is
worth trying anywhere a palette has one token doing both jobs** — it is the same fix as hawk's
`--magenta-ink` and hash-zoo's `--bit-changed-ink`, now three repos running.

Two method notes:
- **A randomized exhibit makes a real defect intermittent.** The `--accent-2` failure only
  renders when MLWE elimination happens to hit s. It passed the first full run and failed a
  later one. Where output is randomized, run the a11y spec several times before believing green
  — this repo got three a11y runs plus two full-suite runs.
- **A mutation that does not fail is not automatically a blind gate.** `#7c7c7c` on an `h3`
  correctly passed because the oracle applied the 3:1 LARGE-TEXT threshold. A stronger colour
  then failed at 2.25:1. Check the threshold that applies before concluding anything.

**mac-race DONE 2026-08-08 `65119ce` (18 remain) — 4 defect classes, 19 ARIA sites.** Highest
prohibited-name count yet. Two lessons specific to it:

- **Fix the ARIA sites by kind, not with a blanket `role="group"`.** Here the right answers were
  three different things: *remove* the label on the status chips (their visible text already said
  it, and the label only added the word "Status") and on the layout wrapper; `role="region"` +
  `tabindex="0"` on the scrolling tables; `role="group"` only on the genuinely meaningful
  groupings. Also note `<p>` is a generic role too — a div/span-only grep misses it, and two
  sites here were `<p>`.
- **The hidden-tooltip reflow bug is now 2 of 7 repos** (hash-zoo `.term-def`, mac-race
  `.gloss-pop`). Both used `visibility: hidden`, which still occupies layout, on an absolutely
  positioned popover anchored `left: 0`. Grep for `visibility: hidden` next to `position:
  absolute` — it is a one-line fix (`display: none`) and a whole-document overflow.

Also worth noting as a *negative* result: this lab applies its entrance animations only inside
`@media (prefers-reduced-motion: no-preference)`. That is the correct pattern and the reason it
had no blank-content defect, in contrast to kerberos. **When checking the reduced-motion trap,
`no-preference`-scoped animations are safe; only a rule that sets `opacity: 0` unconditionally
and relies on an animation to undo it is dangerous.**

**merkle-proofs DONE 2026-08-08 `4bab044` (17 remain) — 2 defects, the cleanest repo so far.**
Only the two `aria-label`-on-generic-role sites. Note the fix was `role="group"`, NOT
`role="list"`: both containers are filled with `<span>` chips rather than list items, so
`role="list"` would have traded one violation for another. **Check what actually populates a
container before giving it a list role.**

**This repo is the useful counterexample for the reduced-motion trap.** Its block reduces
durations to `0.01ms` instead of cancelling animations, and its one infinite animation is scoped
to `prefers-reduced-motion: no-preference`. Both patterns preserve end states, which is exactly
what kerberos got wrong. When auditing that trap, these two shapes are safe and only an
unconditional `opacity: 0` undone by an animation is dangerous.

**METHOD FIX — pick mutation targets by computed style, not by grepping the stylesheet.** Four
mutations across this sweep have now been inert or invalid, and each cost a full run to
discover: dead code (`.lext-bad`), aria-hidden decoration (`.mt-chip-warn`, a result glyph),
and twice a later same-specificity rule silently winning (`.quiz-feedback.good`,
`.mt-side--right` beating `.mt-step-side`). The reliable procedure is: drive to the state, read
`getComputedStyle(el).color` in a probe, then mutate whichever rule produces THAT value — and
re-probe to confirm the computed value moved before believing a green run.

**mls-group DONE 2026-08-08 `d268eff` (16 remain) — 3 defects, two of them well past first
paint.** Its inline glossary was announcing nothing: each term was an `<abbr aria-label="...">`,
and the code comment claimed the definition was "exposed both visually (title) and to assistive
tech (aria-label on an abbr)". **`<abbr>` has no ARIA role, so it maps to generic and the name is
discarded** — the definition reached no screen reader at all, and the comment asserting otherwise
had been sitting there unchallenged. Fixed with `aria-describedby` (a global attribute, NOT
prohibited on generic) pointing at an off-screen node.

Two lessons worth carrying:

- **`aria-label` is prohibited on generic roles; `aria-describedby` is not.** Where a label is
  genuinely wanted on an element that cannot take a name, describedby to an off-screen node is
  the escape hatch — and it is announced on focus, so it suits an already-focusable gloss.
- **Assert on axe AND arithmetic contrast; they cover different gaps.** `button.danger:hover`
  tinted its backdrop 15% toward `--danger`, which is also the label's colour, so the two
  converged at 4.05:1 — a control that gets harder to read exactly when you point at it. **The
  arithmetic pass missed it and axe caught it.** Earlier repos had the reverse (gradients axe
  refuses to measure). Neither oracle alone is sufficient. Also worth checking anywhere a hover
  tint mixes in the same hue as the text it sits under.

**And a self-inflicted regression worth remembering: the first version of the gloss fix put the
definition inline as visually-hidden text, which broke `claims.spec.ts`.** That spec asserts on
the narration's `textContent` character-for-character, and `textContent` includes visually-hidden
AND `hidden` nodes — it is DOM-based, not render-based. Any a11y fix that injects text into a
region a claims test reads will break it. Put such text outside the asserted region.

**oblivious-shelf DONE 2026-08-08 `ad13e27` (15 remain) — 2 defects.** A bare
`overflow-x: auto` table wrapper with no keyboard route, and `.set-el--target` painting its digit
in `--accent-hover` on a 28% `--accent` wash.

**That second one is now a named pattern: a tint that mixes in the same hue as the text sitting
on it.** mls-group's `button.danger:hover` did exactly this (backdrop tinted toward `--danger`,
which was also the label colour, converging at 4.05:1) and here the chip background is lightened
toward the hue the ink already is (3.84:1). **Grep for `color-mix` / tint declarations whose
mixed-in token is the same one used for `color` on or inside that element** — it is a
self-defeating palette move and both instances needed only a token swap.

Also confirming the method fix works: picking the mutation target by reading the computed colour
in the driven state hit a valid, non-inert, late-state target first try (`.sv-note`, caught in
`query generated`). That is four wasted runs avoided versus grepping the stylesheet.

**opaque-gate DONE 2026-08-08 `e633533` (14 remain) — 0 source defects, the first fully clean
repo.** Worth recording *why* it is clean, as a positive template: entrance fades live only in
`@keyframes` (never as an element's own `opacity: 0`), reduced motion collapses them to 0.001ms
rather than cancelling, no `aria-label` on a generic role, no fixed-minimum grid track.

**But building the gate still found real coverage holes.** Three exhibits had never been driven
at all: the OPRF runner, the database-breach simulation, and `Analyze breach` — which is what
actually runs the four attacks. The old spec's `/run the attack/i` matched the *forward-secrecy*
button instead, so the four attack verdicts were never scanned by anything. **A loose regex
matching the wrong button is the same class of silent skip as jwt-forge's stale `#aes-btn`
selector: the gate stays green and an exhibit is simply absent from the audit.** When adapting a
drive, enumerate `createButton(`/`<button` in the source and check every one is reached.

Also note two buttons here are gated on prior state (`Analyze breach` is disabled until Exhibit 3
registration; the forward-secrecy button does not exist until the handshake completes). Probes
that skip prerequisites hang for the full timeout — drive in order, and treat a hang as a missing
prerequisite rather than a broken locator.

**ot-gate DONE 2026-08-08 `af99a15` (13 remain) — 1 defect, and it is the first INTERMITTENT one.**
`.reconcile-meet` ran an unscoped `reconcileMeet` animation ramping `opacity: 0.4 -> 1`. A scan
landing inside that ramp reads all three of its labels at 40% opacity at once — which is exactly
what failed runs showed (badge, shared-label and frag failing together), about **one run in
four**. **Shortening the duration does NOT fix this: under `prefers-reduced-motion` a 0.01ms
animation still renders one frame of the `from` state.** Scoping the animation to
`no-preference` removes the frame entirely. Verified over six consecutive runs of the
previously-failing config.

That refines an earlier note: `animation-duration: 0.01ms` is safe against the *blank-content*
trap (the end state is reached) but NOT against a *sampled-mid-ramp* contrast flake. Scoping to
`no-preference` is strictly better and is the pattern to prefer.

Two more skipped-interaction findings, same family as opaque-gate's:
- Dealing a DDH round only renders the candidate points; the exhibit's claim is only demonstrated
  once you **guess**, which renders the verdict and reveals the reset control. The guess was never
  made, so that surface was never scanned.
- A completed OT transfer disables both sender and receiver controls — the session is one-shot,
  so the second branch is reachable only by reloading. Without that, a gate scans the same branch
  twice while appearing to cover both.

**PROCESS: `pkill -f "playwright test"` does NOT kill the vite preview server.** It bit twice in
this sweep. The second time it invalidated a green run AND made a mutation look inert. After any
interrupted run: `lsof -nP -iTCP:<port> -sTCP:LISTEN` and kill by PID before running again.

**paillier-gate DONE 2026-08-08 `4d56d5c` (12 remain) — 5 defects, one severe.** In dark theme
the forged ciphertexts and the "tally is rigged" verdict rendered at **1.26:1** — near-white on a
light pink box, unreadable exactly where the exhibit wants them read. The cause is worth
generalising: **`.result-box[data-tone]` is deliberately light in BOTH themes and sets its own
dark ink, but a nested `.attack-block code` rule re-applied `var(--ink)`**, which in dark theme
is near-white. **Any container that fixes its own background independent of the theme is a trap
for nested rules that re-apply a theme token — grep for theme-independent backgrounds and check
what sets `color` inside them.**

**This is also the first confirmed hit on the fleet-wide `.cl-hero-sub` lead**, and it validates
the refinement: the rule here carries BOTH `color: var(--muted)` AND `opacity: .85`. Every lab
carrying the opacity *without* a muted colour has passed. So the fleet grep is the pair, not the
opacity alone — 1 of 13 repos so far has had the failing combination.

Two token moves, both safe because the tokens are text-only (checked: 0 uses as a fill):
`--muted` measured 3.77:1 on the page background — a warmer, darker surface than the `--panel` it
had been tuned against — and `--accent-strong` measured 4.07:1 on the hero card and 4.45:1 on the
darker stepper panel. **Tuning a token against one surface does not make it safe on another;
the arithmetic oracle finds these because it measures the surface actually behind the text.**

**SEVEN REPOS DONE BY A PARALLEL AGENT 2026-08-08** — shor `40419c8`, silent-tally `2b69a50`,
snark-arena `e08b7f8`, stego-suite `333ea79`, syndrome-drain `29d7831`, syndrome-hints `d10cce1`,
threshold-decrypt `4d204af`. **Nothing came back clean; every one had at least one real defect.**
Headlines:

- **silent-tally: every SVG in the lab was dark-theme-only.** All four diagrams hardcode palette
  hexes in `fill`/`stroke`, which no `html[data-theme='light'] .text-*` remap can reach. Exhibit
  3's toy-field chart — the lab's central figure — was effectively invisible in light theme
  (axis labels 2.54:1, share labels 1.52:1, secret marker 1.67:1). Plus 25 prohibited
  `aria-label`s that would have *replaced* each share value with the words "Share f(N) value".
- **syndrome-hints: 50 prohibited-name sites, the sweep's highest.** The attacker's-view error
  vector renders 48 `<span class="bit">` cells each with a discarded `aria-label`, so every cell
  read as a bare index plus "?" or a padlock emoji.
- **threshold-decrypt** (the repo whose shallow `4901202` opened this list): 5 defects. Notably
  `.panel.locked { opacity: 0.72 }` faded locked panels' *prose*, not just their controls —
  1.4.3's inactive-component exemption does not cover the paragraph explaining the step (4.01:1).
- **snark-arena's biggest finding was coverage, not a defect:** the old gate never drove the
  real-proof exhibit at all. Its comment claimed the "Verify proof" buttons "were removed" — true
  of the two simulated ones, false of `#rp-prove`/`#rp-verify`/`#rp-tamper`, which run genuine
  snarkjs Groth16. **The lab's headline exhibit was absent from the audit.**

**Four new fleet-wide leads, all worth a grep before the next repo:**

1. **A dark-theme lab with no `a { color }` rule renders every link in the UA default `#0000EE`.**
   Now 3 confirmed (pki-chain 1.5:1, stego-suite 1.47:1, threshold-decrypt 1.83:1). Tailwind labs
   are immune because preflight sets `a { color: inherit }`.
   **CANDIDATE LIST, generated 2026-08-08** by parsing every CSS rule for one whose selector list
   contains a bare `a` and whose block sets `color` (a plain grep over-reports badly — many labs
   style links only via descendant selectors). **25 repos have no such rule:** biham-lens,
   bitcoin-script, blind-sign, ckks-lab, commit-gate, dead-sea-cipher, e91, fhe-arena,
   harvest-vault, hybrid-pqc, jwt-forge, kdf-chain, kyber-vault, lms-xmss, mpcith-sign,
   oram-vault, paillier-gate, poly1305-mac, psi-gate, ring-sign, shamir-vs-frost, ssh-handshake,
   vdf, vrf-gate, web-of-trust.
   **Treat this as a candidate list, not a defect list.** The defect only bites where a link
   actually renders on a surface the default blue fails against — jwt-forge and paillier-gate are
   on it and both passed their honest gates. The gate catches it empirically; this list only says
   where to look first.
2. **Hardcoded palette hexes inside SVG are a whole class of light-theme blindness.** SVG paints
   from `fill`/`stroke`, which a `.text-*` light remap cannot reach. Grep `fill="#` / `stroke="#`
   in any lab with a light theme.
3. **`display: grid` with no `grid-template-columns` is now 5 of ~12 audited.** Note stego-suite's
   `.shell` also carries `width: min(1180px, 95vw)` on the same rule and that does **not** prevent
   the auto-track blowout.
4. **A `clamp()`ed font-size can cross the large-text threshold between viewports.**
   syndrome-drain's `.lm-banner-status` resolves to 21.6px on desktop (3:1 applies, passes) and
   17.6px at 380px (4.5:1 applies, fails at 4.31:1). **The same colour legitimately passes one
   width and fails the other** — which is an argument for scanning both widths beyond reflow.

**GATE IMPROVEMENT — add `page.setDefaultTimeout(20_000)` to `boot`.** It paid for itself twice in
the agent's run (silent-tally's victim card, stego-suite's `#lsb-walk-prev` — both disabled-at-first
controls). Without it a click on a never-actionable control burns the full 900s test timeout and
reports nothing useful; with it you get a named failure in 20s. **This would have saved the two
10-minute hangs in jwt-forge and ot-gate.** Adopt fleet-wide.

**PRECHECK CORRECTION: run the aria-label grep against the RIGHT source dir.** The agent's first
pass used `src/` and found nothing in silent-tally, whose source is `src-ts/`; the gate then found
25 sites. Use `find`-based discovery, never a hardcoded `src/`.

Also confirmed twice more that **neither oracle alone is sufficient**: snark-arena's
`.bp:hover { opacity: 0.85 }` (which fades the accent fill and its white label together, dropping
white-on-accent from 5.66:1 to 4.21:1) was caught by axe and MISSED by the arithmetic oracle —
the mirror image of the gradient blind spot.

**pki-chain DONE 2026-08-08 `d820bd0` (4 remain for this session) — 6 defects.** The headline is
the second confirmed instance of the unstyled-link class: **no `a` rule existed at all**, so every
link rendered in the UA default `#0000EE` at 1.5:1 on the dark panels. Also `--fail` at 3.68:1 —
**the FAIL verdict was the least readable text on the page**, which is the branch a learner most
needs to read.

**THE HUNG-CLICK PATTERN IS NOW 3 OF 14 REPOS** (jwt-forge `paste-toggle`, ot-gate
`btn-ddh-reset`, pki-chain `ct-consistency`) and it has the same shape every time: a control that
is disabled or absent until a prerequisite runs, clicked by a drive that never satisfied it.
Here `#ct-consistency` needs TWO certificates in the log, because a consistency proof is between
two log *states* — one submission can never enable it.

**`page.setDefaultTimeout(20_000)` paid for itself on its first use.** Before adopting it this
repo burned the full 15-minute test timeout and reported nothing; with it the failure named
`#ct-consistency` in 20 seconds. **I had started diagnosing it as gate slowness — a full scan here
costs 1.6s, so 23 states is ~35s, and the "15 minutes" was one hung click all along.** Measure
scan cost before assuming a slow suite is slow.

**poly1305-mac DONE 2026-08-08 `2df3f6f` (3 remain) — 6 defects, two of them new variants worth
adding to the prechecks:**

- **An INLINE `style="color:#35d6bb"` on links.** Theme-blind (1.52:1 in light) and, being
  inline, **immune to adding an `a` rule** — the fix everyone reaches for first. This is why the
  unstyled-link candidate list is only a starting point: poly1305-mac was on it, but the actual
  defect was inline styling, not a missing rule. **Grep `style="[^"]*color` in markup, not just
  the stylesheet.**
- **A narrow-viewport collapse to a bare `grid-template-columns: 1fr`.** The desktop rules here
  already used `minmax(0, 1fr)` correctly — the `@media (max-width: 1024px)` block dropped the
  floor, at exactly the width where it matters. **The grid auto-track precheck must read the
  media-query overrides too, not just the base rule.** A repo can look correct at desktop and lose
  it at phone width. (The 920px table involved already had an `overflow-x: auto` wrapper WITH a
  keyboard route — good practice that the missing floor defeated entirely.)

Also: **a long number is one unbreakable "word".** `p.math-decimal` prints the 130-bit
accumulator in decimal; digits carry no wrap opportunities, so it pushed the document 31px
sideways by itself. `overflow-wrap: anywhere`. Worth checking anywhere a lab prints a big integer
outside a scroller.

**Gate machinery note:** the shared template in /tmp was stale — gates generated from it lacked
the clipped-fallback diagnostic added in kerberos, so this repo's reflow failure reported
"(none identified)" and cost several probe cycles. **Regenerate the template from the newest
gate before starting a repo**; the current best is pki-chain `d820bd0` (setDefaultTimeout +
clipped filter + clipped fallback).

**pq-rotation DONE 2026-08-08 `c76b4eb` (2 remain) — 5 defects.** The grid auto-track bug again,
this time on **`main.dashboard`, the top-level container**, with no `grid-template-columns` at
all. Note the trap: it carries `width: min(1200px, 96vw)`, which bounds the element and says
nothing about the track sizing its children — the same false reassurance as stego-suite's
`.shell`. **The pattern is now 7 of ~16 audited.** Fixing it exposed a `.table-wrap` that had
`role="region"` and a label but **no `tabindex`** — a named region with no keyboard route, which
reads as done in a grep.

Also a new surface variant: `.stepper-list a` used `rgba(5, 15, 24, 0.55)`, which composited to a
mid-grey against whatever sat behind it, and **both** `--ink` and `--muted` failed on it. **A card
that carries body text should not let its own contrast depend on the backdrop** — the fix is
opacity, not a colour tweak.

**TWO MORE INVALID-MUTATION MODES, both new:**
- **The element was not visible at first paint.** `.checklist li` sits in a panel that only
  renders after a run; the mutation applied but nothing scanned it.
- **A LATER declaration inside the SAME rule block won.** I inserted `color:` at the top of
  `.gloss {}` and the rule's own `color: var(--ink)` two lines down overrode it. This is not a
  specificity problem and not a source-order problem between rules — it is within one block.
  Mutate the *declaration that computes*, not the first one you find.

That makes six distinct ways a mutation can be silently inert (dead code, aria-hidden decoration,
later same-specificity rule, large-text threshold, not-visible, later declaration in the same
block). **The probe-then-verify procedure is not optional overhead; it has caught all six.**

**psi-gate DONE 2026-08-08 `8bc51c3` (1 remains) — 4 defects, one of them a new ARIA shape.**
A `<ul>` carried `role="region"`, which **replaces** its list semantics and orphaned every `<li>`
inside it — axe's `listitem` rule caught it. **Putting a landmark/region role on a semantic
element destroys that element's own semantics; the region belongs on a wrapper.** Worth grepping
for `role="region"` (or any role) applied directly to `<ul>`/`<ol>`/`<table>`/`<nav>`.

Two recurring patterns hit their third instance each:
- **hidden-tooltip reflow** (hash-zoo `.term-def`, mac-race `.gloss-pop`, psi-gate
  `.e2-term-def`) — `visibility: hidden` still occupies layout; a 304px popover pushed the
  document to 542px.
- **same-hue tint** (mls-group hover, oblivious-shelf chip, psi-gate `.align-row.matched`) — the
  row tints its background 10% toward `--match` and then paints its text `--match`.

**A SEVENTH invalid-mutation mode: a DUPLICATE selector.** Two `.info-label` rules exist in this
stylesheet and I patched the one that sets no colour. The running list is now: dead code,
aria-hidden decoration, later same-specificity rule, large-text threshold, element not visible,
later declaration in the same block, duplicate selector. **Every one was caught by probing the
computed value first — none would have been caught by reading the CSS.**

**shamir-vs-frost DONE 2026-08-08 `81d3413` — 7 defects. THE 25-REPO QUEUE IS COMPLETE.**

Its own findings, two of them new shapes:
- **Locked steps faded to `opacity: 0.4` as a whole block**, taking the step label to 2.11:1 and
  its explanatory prose to 2.16:1. Same family as threshold-decrypt. Fixed by *disabling the
  controls* instead — which is what actually communicates the state. **And the lock calls ran
  BEFORE the controls were appended, so they disabled nothing**: an ordering bug the gate exposed
  only because disabling changed behaviour where dimming had not.
- **`.fade-in` was omitted from the reduced-motion block**, which names three other classes by
  hand. A scan inside the ramp read a callout at 1.68:1. **A hand-maintained cancellation list
  goes stale** — scoping the animation to `no-preference` cannot.
- The hidden-tooltip bug for the **fourth** time, and this one also overflowed *when shown* at
  380px regardless of max-width, because it is anchored `left: 0` off the term. Pinned to the
  viewport at narrow widths.

**GATE FIX WITH FLEET-WIDE REACH — `svgUnderlay` was inventing failures.** SVG's initial `fill`
is black and `getComputedStyle` reports that for **stroke-only geometry**, so a `<line>` used as
a grid rule read as an opaque black rectangle covering whatever it crossed. That produced a
3.82:1 phantom for labels whose real ratio is 6.15:1. The helper now only composites shapes that
actually paint a fill (`rect`, `circle`, `ellipse`, `polygon`, `path`). **Any repo audited with
the earlier contrast.ts and containing an SVG with `<line>` grid rules may have had a phantom
reported or, worse, a real failure masked by a wrong backdrop — silent-tally's SVG findings are
worth re-checking against the fixed helper.**

**SVG-HELPER RE-VERIFICATION DONE 2026-08-08 — all six at-risk repos re-checked, all green.**
After finding that `svgUnderlay` composited stroke-only geometry as an opaque black backdrop, I
re-ran every audited repo that draws real `<line>` elements, with the corrected helper installed:
silent-tally (20 lines), hash-zoo (19, `3240919`), hawk (10, `d605b63`), key-exchange (7,
`1da35dd`), psi-gate (5, `fe46a22`), threshold-decrypt (5, `fafc9bd`), merkle-proofs (4,
`d532e09`). **Every one is green in all four configurations, so the earlier helper was not
masking a real failure in any of them** — the bug produced phantoms, not silence. silent-tally's
seven SVG findings stand as real.

Two notes for anyone repeating this:
- **The naive grep over-counts badly.** `<line` also matches `<linearGradient`, and every lab
  shows a baseline of 3 from an `aria-hidden` hamburger icon in `index.html` that the helper
  already skips. Match `<line[ >/]` and discount the icon.
- **The corrected `contrast.ts` is now committed in those seven repos only.** The other eighteen
  carry the older copy; they draw no real SVG figures, so it cannot bite there, but any future
  copy should be taken from one of the seven (or shamir-vs-frost `81d3413`).

**QUEUE CORRECTION 2026-08-08 — the injection also lives in spec files NOT named
`a11y.spec.ts`.** Every regeneration of this queue, mine included, globbed `a11y*.spec.ts`.
Scanning **all** `e2e/*.spec.ts` finds **17 files across 17 repos** still injecting
`opacity: 1 !important`, and three of them would never have been found:

> **Re-run 2026-08-08 after shor, mpcith-sign and nonce-lattice: 14 files, 14 repos remain** —
> ibe-gate · j-uniward · oram-vault · otp-vault · pairing-gate · threshold-mldsa ·
> time-lock-puzzle · tls-handshake · vdf · vrf-gate · vss-gate · web-of-trust · webauthn ·
> zk-proof-lab. All 14 are now plain `e2e/a11y.spec.ts`; the three hidden-filename cases are
> cleared.
>
> **Later on 2026-08-08, eight of those fourteen landed** — ibe-gate `6469fe9` (8),
> j-uniward `8ece1d3` (6+1), oram-vault `f909787` (6), otp-vault `bb5d4d6` (4),
> pairing-gate `d4a3515` (2), threshold-mldsa `0c522c1` (8), time-lock-puzzle `525e8ce` (1),
> tls-handshake `bfb556e` (7), vdf `5620344` (5), vrf-gate `9701f5e` (4+), vss-gate
> `4ac296b` (7), webauthn `6158779`+`e3248e3` (6), zk-proof-lab `922f436` (9),
> web-of-trust `fe2484b` (6). **ALL 14 DONE 2026-08-08 — the injection queue is closed.**

- `crypto-lab-shor/e2e/claims.spec.ts` — **and shor is already marked DONE.** Its `a11y.spec.ts`
  was correctly replaced, but its CLAIMS spec still forces opacity, so every claim it asserts is
  measured against a page whose rendering has been modified. Not an a11y fake-pass, but a claims
  suite testing a page the visitor never sees. **FIXED 2026-08-08 `a30e975`.** Replaced with
  `emulateMedia({reducedMotion:'reduce'})` before `goto` — `renderStep` reads the preference once
  at module load and then never applies the inline `opacity: 0`, so asking for it the way a reader
  does removes the fade without overriding anything. **And it exposed a live flake it had been
  sitting next to, not causing:** this suite fails ~1 run in 4 on untouched HEAD, because the lab
  paces its step log at 300ms/step over a random number of attempts and `runQuantum`'s retry loop
  runs past Playwright's **30s default TEST timeout** — not the 30s locator waits. Playwright then
  reports whichever expect was pending, so it read as "`.result-banner` not found", i.e. an app
  hang that was never happening. **Generalise: when a Playwright failure names a locator that
  should obviously exist, check the test timeout before believing the app.** Budget now 300s,
  matching the 900s the a11y gate already carried for the same runs.
- `crypto-lab-mpcith-sign/e2e/a11y-interactive.spec.ts` — a SECOND a11y spec beside a clean
  `a11y.spec.ts`, so the repo reads as fixed if you only open the obvious file.
- `crypto-lab-nonce-lattice/e2e/a11y-states.spec.ts` — same shape.

**Regenerate with `find . -name "*.spec.ts" -path "*e2e*"`, never a filename pattern.** The
correct command is:

```
find . -maxdepth 4 -name "*.spec.ts" -path "*e2e*" -not -path "*/node_modules/*" | while read f; do
  grep -vE '^\s*(//|\*|/\*)' "$f" | grep -qE 'opacity: *1 *!important' && echo "$f"
done
```

This is the same class of error as the one this whole section opens with — **a completion test
that looks at the wrong thing reports done for work that was never done.** First it was a grep
that detected the fix rather than the defect; now it is a glob that covered the expected filename
rather than all of them.

**THREE GEMINI TEMPLATE REPOS DONE BY A PARALLEL AGENT 2026-08-08** — babel-hash `797fd2f` (4),
biham-lens `9098a8b` (5), gg20-wallet `91c1a19` (3). **12 defects; nothing came back clean.**

**The template's fake-pass default is worse than this file recorded.** In gg20-wallet the
"gradient contrast check" measured no element at all — it compared `var(--background)` against
`var(--text)` read off two throwaway divs, so it could only ever fail if the base palette pair
failed, regardless of what the page rendered. In babel-hash and biham-lens it returned a literal
`100` on a missing element or unparseable background, and biham-lens only asserted at all when
the value was not 100. **These gates were structurally incapable of failing on page content.**

New shapes found:
- **`role="grid"` with `gridcell` children and no `row` layer** — two CRITICAL rule failures at
  once (`aria-required-children` + `aria-required-parent`), across 272 elements in biham-lens.
  **Worth a fleet grep for `role="grid"`/`role="gridcell"`** alongside the existing "role on
  `<ul>`/`<table>`" check. Fixing it exposed a keyboard defect underneath: 256 cells had
  `tabindex="0"` and a click handler but no button role and no key handler — focusable and
  unactivatable.
- **An 8th invalid-mutation mode: the element renders a PLACEHOLDER at first paint.**
  gg20-wallet's `.pd-val` shows `—` from load, so a late-looking selector fired at first paint.
  Cheap pre-filter: assert the selector's count is 0 at first paint before trusting it as a
  late-state target.

**Two earlier conclusions corrected:**
1. **The unstyled-link candidate list is weaker than I stated.** biham-lens has no `a { color }`
   rule and its links still PASS — Chromium resolves the UA link colour against `color-scheme`,
   which that lab sets per theme (7.14:1 dark, 8.65:1 light). **So the 25-repo candidate list is
   only actionable for labs that do NOT set `color-scheme` per theme.** Check that first.
2. **The `.cl-hero-sub` grep needs refining again.** gg20-wallet's rule sets **no colour at all** —
   it inherited `--text-muted` from a blanket `p {}` rule and still measured 4.28:1. So the test
   is not "`opacity:.85` plus a muted colour on the same element"; it is "`opacity:.85` on an
   element whose *computed* colour is muted". **Only a computed-style probe finds that one.**
   Now 3 of ~28 confirmed (hash-zoo, paillier-gate, gg20-wallet).

**A third confirmed instance of neither-oracle-alone-is-sufficient, and a real gap named:** axe's
`color-contrast` keys off *visual* visibility, so it measures `aria-hidden` text that still
paints; the arithmetic helper skips `aria-hidden` subtrees by design. biham-lens's
`.ddt-lane.idle` defect (3.47:1) was visible only to axe. **That boundary is a genuine gap in
contrast.ts, not just a difference** — recorded in that file's header.

Grid auto-track pattern now **9 of ~21 audited**. Also: babel-hash and biham-lens had
`webServer.command` with no `npm run build &&`, so a failing build would have served the last
good bundle — both fixed.

Three carry-forwards from these two:
- **Adapt the gate from hash-zoo `9a559b7` or hybrid-guide `225f1f8`, not the older exemplars.**
  hash-zoo's splits the machinery into `e2e/gate.ts` (boot · settle · five-oracle scan ·
  `driveAllStates`) with `e2e/contrast.ts` beside it, which made the per-state driving readable
  and is the cleanest base to copy so far.
- **Mutation-check in a LATE driven state, not at first paint.** The first mutation attempted
  here (`.lext-bad`) changed nothing because that branch renders only when the forgery fails to
  verify — unreachable in a correct implementation, so it is evidence about the source, not the
  gate (the `vrf-gate` lesson again). The second (`.lext-ok`) went red at *first paint*, which
  proves the gate bites but not that it reaches anything. Only the third (`.hist-axis`, rendered
  solely after the distribution sweep) proved state coverage — it failed in all four
  configurations naming the `distribution` state. A mutation that fires at first paint tells you
  nothing about whether the driving works. **Check the mutation actually took effect before
  believing a green run**: two attempts in hawk were inert — one hit dead code, the other was
  overridden on specificity by a two-class rule. An inert mutation and a working gate produce
  the identical green, so confirm the computed style changed, not just the source.
- **The contrast helper now skips non-rendering SVG text** (character data inside `<g>`/shape
  elements, which SVG never paints). hawk hit this via `<g>${dots}</g>` interpolating a string
  ARRAY, which JS joins with commas — invisible on screen, but the old helper measured the
  commas and reported a phantom 1:1.
- **The reflow reporter now ignores elements clipped by a scrolling ancestor.** It had been
  naming hqc-vault's 980px comparison table — which sits inside a scroller and contributes
  nothing to document scroll width — while the real overflow was 15px of `<select>`. Same class
  of mistake as the contrast phantom: a big bounding rect is not the same as ink on the page.
- **Copy `contrast.ts` + `gate.ts` from hqc-vault `4207f50`, the newest version**, which carries
  both of the above. Adapt the header comments to the new lab — they cite specific elements, and
  a stale comment is a false claim about the repo it lands in.

**THE REMAINING SIX GEMINI REPOS DONE 2026-08-08 — THE 9-REPO BATCH IS COMPLETE.**
Mine: lwe-hints `381f076` (5), mpcith-sign `5eb84ff` (7), nonce-lattice `e2de6ff` (11).
Delegated: grover `e39f1d0` (4), hqc-timing-break `1806572` (6), lms-xmss `0a078f8` (6).
**39 defects across the batch's 9 repos; nothing came back clean — 34 repos audited, 34 dirty.**

**The headline finding: a previous "accessibility fix" was the worst defect in the repo.**
nonce-lattice carried, under the comment `/* Improve color contrast for text */`:

```css
.cl-title, h1, h2, h3, h4, h5, h6 { color: #fff !important; text-shadow: 0 1px 2px #0008; }
```

Correct in dark, inverted in light — **every heading 1.04:1 on a near-white page**, with
`!important` blocking any override. **Add to the precheck: grep for `color: #fff` /
`color: white` with `!important` and no theme scope.** A single-theme gate cannot see this
class of fix, and *certifies* it. Same family as key-exchange's `--metric-muted`, which
hqc-timing-break repeated: an ink token authored for a container (`.hero-metric-card`) that
**appears zero times in the markup**, so the token's contract was never tested — second fleet
instance, now worth a grep of its own (token used by exactly one selector whose class is absent
from the HTML).

New defect shapes (both from lms-xmss, neither findable by any existing grep):
- **A CSS class-name collision between a container class and a state modifier.** `.reach` named
  both `#forge-reach` (a panel) and a `chain-cell` state. The panel's `padding: 10px 12px` leaked
  onto every reachable Winternitz cell; padding does not shrink, so reach cells had a 26px floor
  against a locked cell's 2px — 628px document at 380px, **and at every width the diagram drew
  reachable segments ~4× locked ones, misreporting the one proportion the lab exists to show.**
  A layout bug that made a teaching diagram lie.
- **A global touch-target `min-width` overflowing a dense grid.** `button { min-width: 44px }`
  against a 15px grid track: each leaf painted ~29px over its neighbours, and grid items overlap
  rather than push, so **clicks landed on the wrong leaf.** Surfaced only because Playwright
  reported the click on leaf 0 intercepted by leaf 1.

**The grid auto-track bug has a flexbox twin — the notes only covered grid.** `flex: 1` leaves
`min-width: auto`, whose minimum is the sum of the children's minimums. lms-xmss hit it twice
(`.atn-cells` floored at 468px). Add "flex item with `flex: 1` and no `min-width: 0`" to the
precheck. Grid auto-track itself is now **12 of ~24 audited**.

Other carry-forwards:
- **`aria-hidden` + a scroller has no tabindex fix.** Adding one trades
  `scrollable-region-focusable` for `aria-hidden-focus`. Remove the scroll instead (wrap or
  shrink) — hqc-timing-break's `.bar-bridge-code` went to `pre-wrap`.
- **Check for an existing paired ink token before inventing one.** hqc-timing-break had already
  defined `--warning-fg` for the exact surface its `--accent-2` labels were failing on.
- **A clipped annotation can become a keyboard-trapped scroll region.** grover's `.bar-mean-tag`
  hung 1.6px below `.bar-chart`, whose `overflow-x: auto` forces `overflow-y: auto` — the word
  "mean" became a 242×240 unreachable scroller, on the annotation for the overshoot state the
  lab exists to teach.
- **Process win — a "soft gate" collection pass.** Wrap `scan`'s five `expect`s in a try/catch
  behind an env var, run all four configs once, dump every failure: ~6 fix-run cycles become 1.
  Decisive where a run costs 2 minutes. Restore the strict gate from a saved copy and diff for
  residue before committing.
- **`.cl-hero-sub` opacity+muted lead is now 1 confirmed in ~16 checked** — grover carries the
  exact failing pairing and measures fine. Weak lead; stop treating it as a queue.
- **A theme toggle can be inert.** lms-xmss has a single dark palette, so `data-theme="light"`
  changes nothing and the shared header's toggle does nothing. Not a WCAG failure; a real
  inconsistency. Left alone deliberately.

**FIRST FOUR OF THE INJECTION QUEUE DONE 2026-08-08 — 24 defects, nothing clean.**
ibe-gate `6469fe9` (8) · j-uniward `8ece1d3` (6, plus a correctness bug) · oram-vault
`f909787` (6) · otp-vault `bb5d4d6` (4).

**A reduced-motion block that CREATED a contrast failure — new shape, high value.** ibe-gate's
stylesheet cancelled the spinner's blink and, in the same rule, faded it to `opacity: .6`:
"⧗ Running…" painted at **2.76:1**, but only for readers who asked not to be flashed at, and
only while they were waiting on the thing it reported. **An accommodation must not change the
colour.** No gate that skips reduced-motion emulation or injects opacity can see this — the old
gate did both. **Grep `@media (prefers-reduced-motion: reduce)` blocks for any declaration that
is not `animation`/`transition`/`scroll-behavior`.**

**An always-dark panel in a light theme needs an override for EVERY muted token used inside
it, and it is easy to leave one off.** ibe-gate's `.term` stays `#1a1a28` in both themes and the
stylesheet carries a light-theme override for every `.lbl-*`, every `.vchip` and the G_T
inspector — but not `.spinner`, which took `--text-dim` `#4a4a66` and measured **2.01:1**. Grep:
for each `[data-theme='light'] .<panel> { background }`, enumerate the muted tokens used by
descendants of `.<panel>` and check each has an override.

**`overflow-y: auto` that never scrolls but always clips.** j-uniward's `.panel-body` had
`scrollHeight === clientHeight` in every state at both widths — the declaration bought zero
scrolling and silently ate **94px at 1280 / 115px at 380** off every glossary bubble opened
inside it, a third of the plain-English jargon text. `expectScrollersReachable` cannot see it
(the container has focusable children) and no contrast oracle sees it. **Grep `overflow: auto` /
`overflow-y: auto` on a container with NO `max-height`/`height`, then probe scrollHeight vs
clientHeight.** Note `overflow-y: auto` with `overflow-x: visible` computes `overflow-x` to
`auto`, so it clips both axes. j-uniward's `gate.ts` now carries an `expectNotClipped` oracle —
**port it.** Two follow-ons: removing the clip turns the popover into a *reflow* failure, so the
fix needs a viewport clamp; and that clamp must run twice (immediately and on the next frame),
because layout is not final when `focus`/`mouseenter` fires. That raced once.

**An empty `role="list"`.** Any strip/grid/log builder that emits `role="list"` before it has
items produces `aria-required-children` in `incomplete` — invisible to a violations-only gate.
otp-vault had three at first paint. Grep DOM builders for `role="list"` and check the zero-item
path.

**"Dim to de-emphasise" opacity that duplicates a cue already present — four instances in one
batch** (`.step-item` .35/.6, `.byte__idx` .7, `.byte--unknown` .5, `.reveal-cell--np` .8). Each
element already carried a border style, a placeholder glyph or a distinct colour saying the same
thing; the opacity added nothing but an AA failure. **Opacity compounds** — a `.7` inside a `.5`
is a 0.35 composite no single declaration reveals, which is how otp-vault's byte index reached
**1.71:1**. Grep `opacity: 0.[1-8]` in rules whose selector also sets `border-style` or
`background`.

**Fixed hex colours inside a themed SVG**, and **a highlight stroke that does not contrast with
what it highlights** (`#ffd166` at **1.33:1** against the cells it ringed). `var()` does work in
SVG presentation attributes in Chromium — verified empirically — so a literal has no excuse.
Selection indicators are 1.4.11 and no oracle checks them: grep `stroke:`/`border-color:` on
`.selected`/`.active`/`.focus` modifiers and measure against the modified element's own fill.

**A hidden caption plus a discarded label leaves NOTHING.** oram-vault six times over: a visible
`.panel-label` marked `aria-hidden="true"` sitting directly above a container carrying an
`aria-label` that `role=generic` discards — so a screen reader got neither. Grep for that exact
pairing.

**An 11th invalid-mutation mode: the element owns no text of its own.** Recolouring ibe-gate's
`.gt-hex-dump` was inert because every byte is wrapped in a span. The computed value moved and
nothing measured it — so "the computed style changed" is necessary but not sufficient; the
element must also own a text node.

**A second confirmed case of neither-oracle-alone-is-sufficient, in the other direction:**
otp-vault's mutation at 4.22:1/4.12:1 was flagged by the arithmetic oracle and NOT by axe's own
`color-contrast`. Both instances now recorded — axe catches `aria-hidden` text that still paints,
the arithmetic oracle catches sub-threshold composites axe rounds past.

**`revealAll()` is not a state — third and fourth instances.** ibe-gate forced all five
tabpanels visible while `aria-selected` named one tab; oram-vault's `revealEverything()` un-hid
five mutually-exclusive exhibits at once, five h2s and five tabpanels live simultaneously. Both
gates certified a document no visitor can load, and no state a visitor does. otp-vault's was
worse in a different way: it "drove" the page by clicking **every visible button in DOM order
with `.catch(() => {})` around each**, so a control that never became actionable was
indistinguishable from one that worked.

**Reported, not fixed (j-uniward):** six inputs carry an `aria-label` that overrides a correct
`<label for>` — a genuine WCAG 2.5.3 *Label in Name* AA failure. axe's
`label-content-name-mismatch` only applies to roles taking name-from-content, so **no oracle
sees it**. Worth its own fleet pass; left out to keep the diff scoped.

**FOUR MORE OF THE INJECTION QUEUE DONE 2026-08-08 — 18 defects; 8 of 14 now landed, 42
defects total.** pairing-gate `d4a3515` (2) · threshold-mldsa `0c522c1` (8) ·
time-lock-puzzle `525e8ce` (1) · tls-handshake `bfb556e` (7).

**A gate can drive the whole lab and still measure nothing.** pairing-gate's old gate drove all
four sections correctly — and then scanned ONCE, at the very end. Every intermediate state it
built (the passing verdict before the tamper, the four-signer grid before the aggregate, the
accepted forgery before the defence) was constructed and thrown away unmeasured. **Driving
without scanning buys nothing** — a distinct failure from the usual "never drove anything".

**`overflow-x: auto` zeroes a min-content floor ONLY when the scroller IS the grid/flex item.**
This resolves an apparent contradiction between two repos in the same batch. time-lock-puzzle's
`.mono-box` is the grid item, so its bare `1fr` track was genuinely clean at 380px in all 20
states. threshold-mldsa's `.table-wrap` is a *block in normal flow inside* a grid item, so its
439px min-content propagated up two levels into `.shell`. **Grep for `overflow-x: auto` on a
block WRAPPER rather than on the flex/grid item itself.** Corollary found alongside it: **a
single-column `display: grid` with no `grid-template-columns` is an implicit `auto` track** and
takes a min-content minimum from the widest child anywhere on the page.

**`aria-hidden` on an element carrying real live output — a blind spot BOTH oracles share.**
time-lock-puzzle's `#chain` holds the running chain value `xₙ = …`, output no other element
shows, and it was `aria-hidden="true"`. axe's `color-contrast` skips `aria-hidden` text and so
does the arithmetic oracle (by design), so a **2.77:1** value hid behind it — and the attribute
was also removing real information from screen-reader users. **Grep `aria-hidden="true"` on
elements written by `innerHTML`/`textContent` at runtime, not just on glyphs.**

**A transient class shorter than an axe pass makes a whole-page scan non-deterministic.**
tls-handshake's `.flash` lives 500ms. The fix that worked: give `auditContrast` an optional
subtree selector, measure scoped (~2ms), and assert the class is present *both before and
after* the measurement, so an expired state fails loudly instead of passing vacuously. Grep for
`setTimeout` that adds/removes a class carrying colour.

**An ink token measured against white or the base panel, then used three recessed surfaces
deep.** threshold-mldsa hit this twice (`--muted`, `--green-ink`). For each
`background: var(--inset)` nested inside another `var(--inset)`, re-measure every token used
below it. Same family as the always-dark-panel rule above.

**A third confirmed case of the arithmetic oracle catching what axe does not:** pairing-gate's
`.diff-mark`, white on the *bright* `--error` (#f87171) at **2.77:1** — the single highlighted
nibble that proves two G_T values differ, i.e. the least readable thing in the section was the
thing the section exists to show. axe reported nothing.

**`.cl-hero-sub` opacity pairing is now 6 of ~28 confirmed** (hash-zoo, paillier-gate,
gg20-wallet, pairing-gate, threshold-mldsa, tls-handshake). It is no longer a weak lead — three
of the last five repos carried it. **Add it to the standard precheck.**

**`revealAll()` is not a state — fifth and sixth instances.** time-lock-puzzle's set
`data-active='true'` on all six tab panels at once plus `display:block` on two outputs.

**Two source facts recorded rather than worked around (tls-handshake):** `mc-bad` and the
`⚠ ATTACK SUCCEEDED` banner are unreachable — all three MITM moves fail one leg of
`attackBlocked`, which is the lab's point — and `.btn:disabled` is dead CSS. Recording these
stops the next reader adding a click that can only hang. Also **`expectNotBlank` needs an
`aria-hidden` skip in any lab with an animation-only token** (`.packet` is declared
`opacity: 0` and only visible mid-keyframe), or it reports every state.

**Reported, not fixed:** tls-handshake's `.record-grid` has four `<label>`s with no `for` and no
wrapped control. No oracle reaches them; worth a separate sweep alongside j-uniward's *Label in
Name* finding.

**vdf DONE 2026-08-08 `5620344`, 5 defects.** Its palette defines `--accent-text`,
`--ok-text` and `--warn-text`, documents exactly why each exists — and **was missing
`--alarm-text`**, so `.status.alarm`, `button.danger`, `.field-err`, `table.cmp .no` and the
"(tampered)" marker all used the raw border/swatch hue as small text (4.11:1 on the alarm pill,
4.04:1 on a panel, 3.83:1 on the inset). **The absence was invisible because every
alarm-coloured TEXT state is a tamper state, and no previous gate ever tampered** — of the three
status flavours this lab paints, only `.status.ok` had ever been scanned. **Generalise the
precheck: where a palette defines an `-text`/ink variant per semantic hue, enumerate the hues
and find the one that was left out — then find the state that would have shown it.**

Second instance in two batches of **an ink measured against one surface and then used a surface
deeper**: `--warn-text` is 5:1 on the warn pill on a panel, 4.48:1 on the same pill inside the
trapdoor `<details>`.

Also: **a bare `<code>` holding a 617-digit integer inline in prose** pushed the document to
1538px at desktop *and* at 380px — every other big integer in the lab lives in a `.mono-box`
scroller, and this one was in running text with nothing to break it.

**Correctness bug the drive exposed:** `aria-invalid="true"` and the "Enter a whole number"
alert were cleared only inside the Evaluate handler, so typing a correct value left the field
still announcing itself invalid. A screen-reader user who fixed the field was told it was still
broken. Same class as "the verdict outliving its input", which the code already guards for the
*result* — the guard could not carry this because it returns early when there is no result.
**Grep: `aria-invalid` set in a submit/validate handler and cleared only there.**

**vrf-gate `9701f5e` (delegated) and vss-gate `4ac296b` (7) DONE 2026-08-08.**

**The agent that did vrf-gate died on a session limit immediately afterwards, so its work was
re-verified from scratch rather than trusted** — suite green twice, and a fresh mutation
(`.beacon-log p` recoloured) went red in all four configurations naming `beacon round complete,
malicious validator withheld`, ~23 states deep. Its gate also carries a **better soft-collection
design than the throwaway harness used elsewhere**: `softExpect` is strict unless
`A11Y_COLLECT` is set, and `reportCollected()` fails the test if the collecting run recorded
anything — so a collection run cannot end green and be mistaken for a passing gate. **Adopt that
shape instead of a hand-patched try/catch.**

**vss-gate: a gate that scans one configuration scans one HALF, and which half depends on the
lab's defaults.** This lab ships DISHONEST — `cheatEnabled: true`, `shamirCheatEnabled: true`,
`deterministicMode: true` — so the old gate's single scan saw the FAILING tones and never
measured the honest ones (`.badge.pass` across a fully verified table, `.result-ok`). My first
draft of the drive asserted the opposite and failed on `#cheat-enabled` not being checked.
**Third time this session that writing an assertion about the app's initial state caught my own
wrong assumption — keep asserting defaults rather than assuming them.**

vss-gate's light theme was set to "the dark hue, darkened a bit" rather than measured:
`--accent` 2.81:1, `--warn` 2.71:1, `--brand` 4.01:1, `--brand-dark` 4.32:1 (as a fill under
`--paper` text), `--ok` 4.47:1. Plus **an inline `opacity: 0.7` on the whole `<footer>`** in
`index.html` — around already-muted text and links, which is how it became the one block failing
in BOTH themes (3.06:1 light, 3.96:1 dark). **Grep `<footer style=` and any inline `opacity:` in
index.html across the fleet.**

**And a token can need a second pass:** `--accent` at 36% lightness cleared 4.5:1 on near-white
but only reached 4.32:1 on the hero aside, where the page's cyan radial shows through. **Measure
a token against the DARKEST surface it lands on, not the lightest** — the mirror of the
"measured one surface, used a surface deeper" rule.

### THE INJECTION QUEUE IS CLOSED — 14 repos, 71 defects, nothing came back clean

webauthn `6158779`+`e3248e3` (6) · zk-proof-lab `922f436` (9) · web-of-trust `fe2484b` (6)
finish it.

**A BUG IN THE SHARED `contrast.ts`, WAS PRESENT IN 52 REPOS — NOW FIXED AND RE-VERIFIED — the most important finding of the
sweep.** `isVisible` guarded against text parked off-page with

```
if (r.right <= 0 || r.bottom <= 0) return false;   // getBoundingClientRect() = VIEWPORT space
```

`getBoundingClientRect()` is viewport-relative, so **once Playwright scrolls a control into view,
every element above the viewport is silently dropped from the contrast walk.** Measured on vdf at
the end of its drive: `scrollY` 960 in a 3324px document, and **27 of 105 text-owning elements —
26% of the page — were not being measured at all.** Any green contrast run on a page taller than
the viewport was worth less than it looked. It is how two real defects in zk-proof-lab hid (SVG
diagram text at 1.91–2.21:1), and it was only caught because a hand-probe disagreed with the
oracle. Fixed to document space in all 52 repos:

```
if (r.right + window.scrollX <= 0 || r.bottom + window.scrollY <= 0) return false;
```

**All 52 were re-run against the fixed oracle: 51 green, 1 real defect surfaced** —
babel-hash's `.cl-hero-why-label` at **4.47:1**, light theme, phone width only, where the hero
aside goes full-bleed and its `color-mix(--accent 6%)` wash composites differently. Fixed with an
`--accent-ink` token (`e6dd1d5`). One genuine defect out of 52 is a *low* yield, and that is the
honest read: the bug was hiding real failures (two confirmed in zk-proof-lab) but most gates were
not sitting on one. The fix and the re-run are committed and pushed across all 52. LESSON, general:
**an oracle needs its own oracle.** Every hard-won measurement fix in that file came from
disagreeing with something — axe, a hand probe, a mutation. When the helper and a manual check
disagree, the helper is the suspect.

New defect shapes from these three:

- **A class lifted out of the card it was written for.** web-of-trust's footer reuses
  `.hero-metric-label`, whose ink `--metric-muted` is a near-white at 78% *because it was
  authored for `.hero-metric-card`'s near-black gradient*. In the footer there is no such
  background: rgb(249,244,238) on rgb(255,255,254), **1.09:1**. This is the fourth instance of
  the hero-metric trap and the sharpest: the token is right, the *reuse* is wrong. **Grep: a
  class whose name references a container, used outside that container.**
- **`opacity` on an SVG `<g>` fades the label with the shape, and a child cannot opt out.**
  web-of-trust dimmed off-path node GROUPS to `.25` while tracing, taking each key's name to
  1.74:1. Dimming the shape alone gives the identical affordance. **Grep `opacity` on a selector
  matching a group/wrapper that contains text.**
- **A re-entrancy guard placed inside the step instead of on the click.** zk-proof-lab's
  `graphAuto` set `gState.auto` and then called `graphRound`/`graphChallenge`, both of which open
  with `if (gState.auto) return` — so "Run 10" did nothing at all, and every `?auto=1` preset link
  into that exhibit was dead. Symptom is a silent no-op button, invisible both to a gate that
  clicks without scanning and to one that scans only at the end. **Grep `if (state.auto` /
  `if (busy` at the head of a step a `…Auto`/`…All`/`run10` loop also calls.**
- **A W3C-spec correctness bug in webauthn:** `verifyAssertion` advanced the RP's stored
  signCount whenever the counter check passed, *regardless of the verdict*, so one forged
  assertion carrying 999 poisons the counter and the genuine authenticator is refused as a clone
  forever — DoS via a signature that did not verify. §7.2 updates it as the last step. The drive
  walked straight into it: after the tamper section, the section below could never log in again.
- **Path C had never been measured at all** because it calls real `navigator.credentials`; it is
  now driven against a Chromium CDP **virtual authenticator**, with both capability branches
  scanned. Worth knowing for any other browser-API lab in the fleet.
- **`role="log"` scrollers are a systematic 2.1.1 miss** — they only overflow after a long run,
  which no previous gate ever produced. Grep `max-height` + `overflow-y: auto` + no `tabindex`.
- **A two-class rule beating a one-class media-query override** is now confirmed twice as a
  source of phone-width grid failures.

Cleared by measurement, worth recording so it is not re-chased: **`.cl-hero-sub`'s `opacity: .85`
is harmless wherever the inherited colour is the PRIMARY text token** — webauthn 12.60:1,
zk-proof-lab 12.6:1, vdf clean. It only bites when the colour underneath is already muted. The
count of genuine instances stays at 6 of ~28.

Regenerate this list with:

```
for r in crypto-lab-*; do
  c=$(git -C "$r" log --format='%H %s' --since=2026-08-05 | grep -i "remove opacity injection" | head -1 | cut -d' ' -f1)
  [ -n "$c" ] || continue
  echo "$r $(git -C "$r" log --oneline "$c"..HEAD -- e2e/ | wc -l) later-e2e-commits"
done
```

A repo showing `0 later-e2e-commits` has had no honest pass since the shallow fix.

**LESSON, general.** A grep that detects the *fix* rather than the *defect* can be satisfied by
a commit that does not fix the defect — and once satisfied, it actively hides the work from
every future queue regeneration. When a task's completion test is a grep, record the audited
repos by name as they land (as the Done list above does) and reconcile that roster against the
grep; never let the grep alone define what remains.

**TASK 14 PROGRESS 2026-08-09 — 4 repos done, 16 defects.** bitcoin-wallet `378495b` (5) ·
accumulator `1eea96c` (3) · aes-modes `500202f` (6) · beacon-lock `c3efa97` (2).

New defect shapes, all worth a fleet grep:

- **A `::before`/`::after` `content:` glyph carrying real meaning has NO ORACLE.** axe's
  `color-contrast` and the arithmetic walk both operate on *elements*; a pseudo-element is
  neither. aes-modes' `=` duplicate marker — the 1.4.1 non-colour cue, the entire point of the
  ECB exhibit — was `--danger` painted onto a JS-chosen fill: **1.45:1 at worst in light and
  1.00:1 in dark** (`#f87171` on `#0ea5e9`, identical luminance, literally invisible). Grep
  `content: '` in rules that also set `color:`.
- **A palette in JavaScript with the ink fixed in CSS.** Reading the stylesheet tells you
  nothing. aes-modes' white `.block-cell` labels cleared 4.5:1 on **none** of the 15 palette
  entries (best 4.47:1, worst 2.15:1); the `text-shadow` under them never counted toward 1.4.3.
  Grep `style.backgroundColor =` / `style.background =` and check the CSS `color` against EVERY
  entry of the array feeding it.
- **`transform: rotate()` on a decorative element that stacks into one column.** A transform does
  not re-flow, so a wide-short box becomes a tall-narrow one lying across its neighbours and
  eating their clicks. accumulator's `.stage-arrow` intercepted every click through the middle of
  the stage at phone width. If the element is `aria-hidden` it wants `pointer-events: none`.
- **`role="button"` on a span whose only behaviour is CSS `:hover`** — announces as activatable,
  does nothing on Enter/Space (4.1.2). Grep `setAttribute('role', 'button')` with no adjacent
  key handler.
- **A lookup guarding an enhancement while the CSS class is applied unconditionally.**
  aes-modes' `ECB` glossary term had no entry, so `if (!def) return` skipped the tooltip while
  the markup had already painted the dotted underline and `cursor: help` — for the one term the
  lab is named after. Grep `if (!x) return` inside a `forEach` that also does `classList.add`.
- **The scroller that only overflows AFTER a run** (`role="log"`, `max-height` + `overflow:auto`)
  — now confirmed in a third lab. A pristine-page scan structurally cannot see it. beacon-lock's
  `.chart-host` produced **106 findings from one missing attribute**.
- **Timing note for transient-state probes:** a WebCrypto-driven loop can complete ~2,100 async
  calls without the page painting a frame, so both a post-click `toHaveCount` and a pre-armed
  `polling: 'raf'` `waitForFunction` miss it. Only a `MutationObserver` (microtask-delivered)
  catches the class.

**"The light theme never got its own accent" is now 3 of 3 confirmed instances** (key-exchange
earlier, accumulator, beacon-lock) and it is a **1.4.11 failure NO ORACLE CHECKS** — the
arithmetic pass covers text (1.4.3), not the 3:1 boundary of a non-text fill. accumulator's
`#0ea5e9` measured 6.34:1 on its dark surfaces and **2.38–2.77:1** painted unchanged on
near-white; beacon-lock's `#f59e0b` went 8.25:1 → **1.84–2.15:1**.

A fleet grep for `--accent*` declared outside any light-theme block turns up **3 remaining
candidates: ecdsa-forge · envelope-kms · frost-threshold.** They are CANDIDATES, not findings —
ecdsa-forge's is an alias (`--accent: var(--pub)`) that may well be themed through, and the
envelope-kms hit came partly from `coverage/` CSS. **My greps have been wrong twice today** (the
theme-key over-count, and this one before it was rewritten to use `find` instead of a glob), so
each needs measuring in its own pass rather than a fix on inference.

**TASK 14 PROGRESS 2026-08-09 (4) — 3 more repos, 11 defects. 15 of 78 done, 47 defects.**
dilithium-reject `dedc9ad` (6) · dilithium-seal `fc4876c` (4) · dkg-gate `34e0409` (1).

**The `.sr-only` oracle bug was found INDEPENDENTLY a second time**, by a different agent in a
different repo (dkg-gate's `mark()` pairs an `aria-hidden` glyph with an `.sr-only` twin, and the
walk reported 4.39:1 for text nobody can see). Two independent confirmations; it is real. That
agent's narrower fix — skip elements whose own `clip`/`clip-path` reduces them to **zero area** —
is the more conservative one and is probably the right shape to backport.

**And the canvas-background bug was hit from the other direction**: once a page overflows its
root, content outside every ancestor's border box falls through to the white fallback and reports
invented ratios (three footer links at 1.77:1 that are fine on the real canvas). Same root cause
as (3) above — the root's background paints beyond its border box and the ancestor walk does not
model it. Useful corollary: **a reflow failure and a burst of contrast failures in the same state
are usually ONE defect, not N.** The reflow assertion names the real culprit.

**`[hidden]` defeated by a class-level `display` — a new shape, and a nasty one.** The attribute
is honoured only by a UA rule, which any author `display` outranks. Two of dilithium-reject's four
hidden regions were `inline-flex`/`flex`, so the tamper test's two buttons sat on screen from
first paint — before any signature existed — where both handlers open `if (!state.lastSig) return`.
Enabled controls that silently did nothing. **Playwright's `el.hidden` property and
`toBeHidden()` disagree here** — the property reads the attribute, the assertion reads the
rendering — so a probe using `.hidden` reports the panel closed while it is fully visible. Fix is
a blanket `[hidden]{display:none!important}`.

**The injection was ACTIVELY DESTRUCTIVE in dkg-gate**, not merely inert. `.chip` ships
`opacity: 0` and reaches 1 via `chip-in … forwards`; the old `animation: none !important` cancelled
it with no `opacity` alongside, so every key-assembly chip — the `PK = ΣA₀` sum Exhibit 1 exists to
show — was painted at zero opacity in the scanned state, and axe skips what is invisible. The
lab's own reduced-motion block gets it right (`animation: none; opacity: 1`) — precisely what the
injection bypassed instead of exercising. **This is the concrete case the "motion suppression
hides a class of defect" argument was predicting.**

More shapes:

- **A flex container holding bare inline prose blockifies every `<strong>`/`<em>` into its own
  flex item**, inserting the container's `gap` mid-sentence and producing an un-wrappable row
  (509px at 380px). Both a 1.4.10 failure and a visible typography bug at desktop width. Grep
  `display: flex` on elements whose children include raw text plus inline emphasis.
- **`.btn:hover` (0,2,0) silently beats `.btn-secondary` (0,1,0)** — hover repainted the
  background while keeping the base `color`: **2.02:1 dark / 1.95:1 light** on every secondary
  button. Only `--danger` escaped, and only because its own `:hover` happened to come later. Grep
  `\.btn:hover` in any lab with `-secondary`/`-ghost`/`-danger` variants.
- **A button fill identical to its card is a silent 1.4.11 failure with NO oracle** — measured
  from real pixels at **1.07:1 dark / 1.01:1 light**, while the stylesheet carried a comment
  asserting buttons "are filled and self-delineating". The comment was false and nothing could
  have contradicted it.
- **"The hue left out" held twice more** — `--reject-text` with no `--accept-text`;
  `--border-strong` with no `--accent-text`. Now 5 confirmed instances.
- **A verdict written and hidden in the same tick**: `revealLeakGuess()` closed the panel that
  contained the element it had just written, so the leak-guessing game never told the reader
  whether they were right. Not an a11y defect — the exhibit simply did not work.
- Generated content (`::before` counters, a `▾` dropdown affordance that is the entire cue for
  five `appearance: none` selects) remains invisible to **both** oracles; those were sampled from
  real screenshot pixels and the measurements recorded in each repo's `contrast.ts`.

**TASK 14 PROGRESS 2026-08-09 (3) — 3 more repos, 12 defects.** chacha20-stream `0444f81` (4) ·
chain-of-trust `6ddf0ff` (4) · corrupted-oracle `648be03` (4).

**A THIRD BUG IN THE SHARED `contrast.ts` — the most serious of the three. FIXED FLEET-WIDE 2026-08-09.**
The ancestor walk is geometry-aware, which is right for ordinary boxes and WRONG for the root.
CSS propagates the root element's background to the canvas and paints it over the whole canvas
**regardless of the root's own box** (CSS Backgrounds 3, "The Canvas Background"). A lab that
sets `html, body { height: 100% }` therefore has both boxes exactly one viewport tall while the
document runs several viewports long — so every element below the fold intersects neither, the
walk ends transparent, and it **falls through to WHITE**. In the dark theme that reports real
text against a page that does not exist. **34 of the 38 contrast findings in corrupted-oracle's
first collection run were this artifact.**

It cuts both ways, and the second direction is the dangerous one: a wrong-direction backdrop can
also **mask a real failure**.

Scope, measured properly: **12 repos have an honest gate AND a percentage height on `html`/`body`;
1 (corrupted-oracle) is fixed, 11 are affected** — ckks-lab · curve448 · hawk · kerberos ·
mac-race · nonce-lattice · pki-chain · pq-rotation · threshold-decrypt · vss-gate, plus a bb84 hit
that is only in a `playwright-report/` artifact and should be re-checked before being counted.
**Backport corrupted-oracle's canvas-background compositing and re-run those 11.**

**FIFTH grep failure today, and this one nearly mis-scoped the fix.** My first attempt at that
scan used a multiline `grep -Ez` and returned **2 repos** — it did not even match
corrupted-oracle, the known case I had in hand. Only checking the grep against the known answer
caught it; a properly-parsing script found 12. **When a scan reports a suspiciously small number,
run it against a case you already know is positive before believing it.**

Other findings from these three:

- **The worst old gate yet.** corrupted-oracle's injected `.typewriter-text { width: auto
  !important }` — and `@keyframes typewriter` animates `width` from 0 to 100%. The test was
  **fabricating the layout it then measured**. Its `revealInline` also cleared inline
  `display:none` on every element on the page, and it never pressed a button.
- **`role="application"` on `#app`** — switching every screen reader out of browse mode across a
  document of prose, headings and two data tables, with not one custom keyboard widget.
- **`display: block` on a `<table>` to make it scroll drops its table role** (1.3.1). Two tables
  in one repo under the same rule; only one carried a compensating `role="table"`. The asymmetry
  was the tell. Grep `table` selectors with `display: block`.
- **A fixed `rgba()` tint reused across themes.** chacha20's XOR row washes were authored against
  a dark surface and are theme-invariant, so in light they spend all of the ink's headroom at
  once: three failures at 3.97–4.21:1, all filed by axe under `incomplete`.
- **The conditional tab stop.** `tabindex` cannot be media-scoped from CSS, so the standard
  `scrollable-region-focusable` fix trades a 2.1.1 failure for dead desktop tab stops. A
  ResizeObserver setting tabindex exactly while `scrollWidth > clientWidth`, plus an assertion
  that `scrolls === tabbable`, fixes both. Shipped in two repos; it generalises.
- **Containers that only overflow after a long run** — `.output-box` needed a 160-byte message,
  `.stat-table` needed Run Tests. **A drive that only uses default inputs will not find them.**
- **The motion injection was a verbatim copy of the lab's own reduced-motion block** in
  chain-of-trust — it replaced the block with itself. And `renderMechanism` reads
  `matchMedia(...)` at render time, which a style tag cannot change at all.
- **Sixth instance of "assert the defaults"**: an assertion of 6 `.node` elements found 5. And
  chain-of-trust's old gate unchecked Root X "so a REJECT verdict renders there too" — it was
  already there at first paint, unscanned the whole time.
- **Stale preview server bit again**, and would have invalidated a mutation check:
  `reuseExistingServer` reused a server started for a probe, so the mutation ran against the
  previous `dist` and all four configs passed green.

**TASK 14 PROGRESS 2026-08-09 (2) — 3 more repos, 8 defects.** blind-hello `9405c2e` (3) ·
blind-relay `9d85630` (3 + a teaching fix) · card-trick `3a5b6ce` (1).

**A SECOND BUG IN THE SHARED `contrast.ts`, AND IT IS THE MIRROR OF THE FIRST — FIXED FLEET-WIDE 2026-08-09.**
The walk measures `.sr-only` text. The visually-hidden idiom
(`position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%)`) has a
non-zero rect and opacity, sits at a real document position, and passes `checkVisibility()` — so
it looks visible to every test in `isVisible` and gets composited against whatever surface the
hidden span happens to sit on. axe excludes those nodes; this oracle does not. In card-trick it
fabricated **1.15:1** for per-card suit names and **1.66:1** for a card-back label.

Where the viewport-space bug HID failures, this one **INVENTS** them. Scope, measured:
**108 repos use `.sr-only`; 51 of them have an honest gate; exactly 1 (card-trick) excludes it.**
So **50 gates can currently report a failure for ink that is never laid down.**

The danger is not the red run — it is that a phantom invites a "fix" to a colour nobody sees. I
find no evidence I acted on one (every contrast fix I made was on visible elements —
`.diff-mark`, `.status.alarm`, `.arrow-label`, `.memorize-chip`, the palette tokens), but I
cannot assert none of the 50 would have produced one. **When work resumes: backport
card-trick's exclusion into the exemplar and all 50, then re-run.** It handles three spellings —
`clip: rect(0px,0px,0px,0px)`, `clip-path: inset(50%|100%)`, and the 1px-box + `overflow:hidden`
form.

**A claim I could not confirm, and the grep behind it.** The agent reported that bitcoin-wallet
still carries the `.cl-hero-why{width:100%}` + no-`box-sizing` overflow and should be re-checked.
**Measured: it does not.** bitcoin-wallet has a global `box-sizing: border-box` in `style.css`,
its `.cl-hero-why` never sets `width:100%`, and its gate — which asserts no horizontal overflow
at 380px — is green. The triage grep looked for `box-sizing` only in the file that contains
`cl-hero-why` (`extra.css`), and the rule lives in `style.css`. **Fourth grep today that answered
a different question than the one asked.** The bug was real in blind-hello and blind-relay, where
both were fixed.

Other findings from these three:

- **Reflow defects MASK one another.** blind-hello had three, and the oracle names only the
  widest culprit, so each fix revealed the next: a 538px delivery table, then a 400px hero, then
  a 419px HPKE table. **A green reflow run after one fix is not evidence the page reflows.**
- **Empty `role="list"`** in 2 of 3 repos, in different shapes — a container rendered before its
  content, and per-column lists that fill at different steps. `incomplete`-only.
- **Series colours reused as text.** card-trick's chart labels are 12px/700 painted in tokens the
  palette had validated at the **3:1 graphics** threshold for line separation; as text they need
  4.5:1 and measured 4.14 / 4.23:1. And **no oracle could see it**: the chart is one
  `<svg role="img">` with an aria-label, so axe treats every glyph inside as part of one image.
  Grep `fill: var(--series-*)` on label-shaped rules, and any `<svg role="img">` containing
  `<text>`.
- **A chip label that existed nowhere else** — blind-relay's `.wire` is correctly `aria-hidden`,
  but its label was the message form (`hdr ‖ enc ‖ ct`), and `.wire{display:none}` under 900px,
  so it was invisible to assistive tech *and* to every phone visitor. Now printed in the
  `role="status"` line.
- **Assert the trap's default:** blind-relay's `#crowd-pad` ships unchecked, and with padding ON
  the size join returns an anonymity set instead of identifying every client — a gate that
  pressed that button would scan the passing tone forever. Fifth instance of "assert the
  defaults".
- **Stale preview server cost another run** — a manual `vite preview` on the config's own port,
  and `reuseExistingServer: true` then skipped `npm run build` and served the pre-fix bundle.

**SOLVED 2026-08-10 (`credential-veil` and 3 others) — see the box-sizing entry above. Original write-up kept because the diagnosis is the useful part.** ~~OPEN, REPRODUCED, NOT FIXED — `credential-veil` reflow at 380px.~~ I built the honest gate
for this repo, ran it, and reverted the repo to pristine when the sweep was paused, so there is
no half-finished work in the tree — but the finding is real and reproducible and should not be
rediscovered from scratch:

- At a 380px viewport the document scrolls sideways: `clientWidth 380, scrollWidth 404`.
- `#app` is 380 wide with 12px padding each side and `.cl-hero` correctly measures **356**, yet
  every hero child (`h1.cl-hero-title`, `p.cl-hero-sub`, `p.cl-hero-desc`, `aside.cl-hero-why`)
  renders **392px wide, right edge 404** — i.e. 36px wider than the container they sit in.
- **None of the obvious candidates move it.** Setting `min-width: 0` on `.cl-hero-why`,
  `.cl-hero-main` or `.cl-hero` itself, `max-width: 100%` on `.cl-hero-desc`, or even
  `display: block` on `.cl-hero`, all leave `scrollWidth` at exactly 404. So it is NOT the hero
  flex row, despite the hero children being what the reflow reporter names.
- The lab also has a wide comparison table whose cells run to `right=753`; that one IS inside a
  scroller and is correctly excluded by the clipped-culprit filter.
- Also worth knowing before restarting: this repo's `playwright.config.ts` runs **four browser
  projects** (chromium, firefox, webkit, mobile-chrome) at `workers: 1`, so a four-config gate is
  16 runs and takes ~4 minutes.

Two other observations from the same pass, both worth keeping:

- **The old spec's injection was INERT here.** It pushed `animation: none; transition: none`, and
  `src/style.css` declares no `@keyframes`, no `animation` and no `transition` at all. "The
  injection was inert in this repo" is a different finding from "the injection hid something",
  and only measuring tells you which one you have — do not assume the queue's marker implies a
  hidden defect.
- **It drove FOURTEEN interactions and scanned once, at the end** — the most thorough driving any
  template gate in this fleet does, and every one of those renderings was discarded unmeasured.
- `--accent` is declared only in `:root` with no light-theme counterpart, which is the pattern
  flagged above — but here it is used exactly ONCE, as a 6% `color-mix` wash on the hero aside,
  never as a control fill. **Not a defect; recorded so the grep hit is not re-chased.**

**TASK 14 PROGRESS 2026-08-09 (5) — 3 more repos, 10 defects. 18 of 78 done, 57 defects.**
downgrade-wire `f57e014` (3) · dp-noise `a3c1909` (3) · drbg-arena `152d1c8` (4).

**A FLEET-WIDE 1.4.11 FAILURE IN THE SHARED HEADER — REPORTED, NOT FIXED. MAINTAINER'S CALL.**
`.cl-btn`'s border is `color-mix(in srgb, var(--accent) 38%, transparent)` over the bar's fixed
`#0b1512`. In any lab whose `--accent` is a dark hue that measures **1.68:1 dark / 1.23:1 light**
— well under the 3:1 a control boundary owes. **It reproduces in every repo with a dark accent.**
Per CLAUDE.md a change every lab should get is "a deliberate reviewed pass across the repos, never
an overwrite driven from this one", so it is recorded here rather than fixed from a single repo.
The per-repo control-boundary oracle is now scoped to `#app` with the exclusion written into the
helper, so it is a stated decision rather than an oversight.

**Two 1.4.11 findings that NO ORACLE can reach, both found by sampling real screenshot pixels:**

- downgrade-wire's secondary `.btn` fill is visually identical to its panel — fill **1.09:1 dark /
  1.20:1 light** — so the border is the only thing saying "button", and that border measured
  **1.41:1 / 1.62:1**. `.btn-primary` was **2.30:1** in dark. **The stylesheet's own header
  asserted "UI components >= 3:1" the whole time.** Second instance of a comment asserting the
  opposite of the measurement; the comment is not evidence.
- dp-noise defines a documented `--control-border` token and applies it **only to `select` and
  text fields** — every button-shaped control drew its boundary from `--border-strong`, a *surface*
  divider, at **1.75–1.85:1**. Ratio of uses was 1:13. And **the old gate's own 1.4.11 check
  queried exactly the three controls where the rule was already kept** — a check aimed at the one
  place it could not fail.

**A fix that was written, discarded by the cascade, and changed nothing.** dp-noise's link fix
used `.verdict a` (0,1,1), which loses silently to `#app a` (1,0,1). The declaration was in the
file, the ratio did not move at all. **When a contrast fix does not move the measured number, the
cascade ate it** — re-measure after every fix rather than assuming the edit took. Grep `#app a` for
any scoped link override that silently loses.

More:

- **Three teaching bugs**, none of them a11y. downgrade-wire's shipped default rendered *"deleted
  0 bytes … plus its **-6-byte** X25519MLKEM768 key_share"* — a negative length, a deletion that
  never happened, and the wrong group named. dp-noise's Exhibit 4b asserted a record was "above
  your declared bound" unconditionally, contradicting the `Records clipped: 0 of 13` stat directly
  above it.
- **`openEverything()` at the top of EVERY scan.** dp-noise's old gate stripped `[hidden]` before
  each scan, and the guided route's entire mechanism *is* `hidden` — so it never once scanned the
  route the page ships on, and scanned a hybrid document with both routes' content on screen
  instead. drbg-arena's cleared the inline `display:none` from all **eleven** output panels while
  clicking one exhibit, revealing ten of them empty; its header comment claimed the lab "has no
  `<details>`" — it has seven.
- **A defect that only exists in a state the drive has to build.** drbg-arena's five `role="log"`
  regions do not overflow at the shipped 32 bytes; the 2.1.1 failure appears only once the byte
  slider is moved to maximum. **A gate that does not move the length control cannot see it.**
- **`aria-label` on the root `#app` div** — prohibited, silently discarded, `incomplete`-only.
  Grep `grep -n 'aria-label' index.html | grep 'div id="app"'` across the fleet.
- **An ink whose comment names the surface it was measured against** — twice more. The comment was
  true and the token was used a surface deeper (`rgba(0,0,0,0.06)` insets, verdict tints).
- Reported not fixed: drbg-arena's `<select>` chevron is a data-URI SVG with a hardcoded
  `#8b949e`, so it cannot follow the theme (**2.59:1** light, 6.11:1 dark); and all three of its
  copy buttons call `navigator.clipboard.writeText` with **no `.catch()`**, so a denied permission
  rejects unhandled and nothing changes on screen.

**Cleared with measurements, so they are not re-chased:** downgrade-wire's `.byte-changed` stroke
is 2.76:1 against its own fill but 1.4.11 asks it against the surrounding byteblock — **3.94:1
light / 10.08:1 dark**. dp-noise's chart axes are under 3:1 deliberately: they are reference
rules, not the data, and every figure ships a full data-table alternative, which is the text
version 1.4.11 exempts a graphic against.

**TASK 14 PROGRESS 2026-08-09 (7) — 6 more repos, 36 defects. 27 of 78 done, 99 defects.**
ghost-commit `97fd6ed` (4+1) · harvest-timeline `6c7ab12` (10) · hpke-envelope `0528a43` (4) ·
frost-threshold `100cc03` (8) · frozen-heart `3c0d280` (5) · garbled-gate `5cdc340` (5).

**THE `--control-border` PATTERN IS NOW MEASURED FLEET-WIDE: 35 labs define a component-boundary
token and 29 of them apply it to ≤2 rules.** That is the shape behind the 578-finding backlog the
new oracle found — not 578 unrelated bugs but one token decision repeated across 50 labs. Two more
instances of the lab's OWN 1.4.11 spec querying exactly the elements already using the token
(harvest-timeline measured a single element, `#e1-algo`; hpke-envelope queried
`input, textarea, select`, precisely the set the token was applied to). **Fifth and sixth
instances of a check aimed where it cannot fail.**

**`--accent` candidate RESOLVED — frost-threshold was REAL.** `#06b6d4` declared once in `:root`,
never restated for light, and `button.secondary` uses it as **both its label and its only
boundary**: 2.43:1 as ink (needs 4.5) and 2.43:1 as boundary (needs 3). Fixed to 5.36:1 on both
counts. **That leaves ecdsa-forge as the only unmeasured candidate.**

**ghost-commit is OFF the task-15 list.** Its `BEGIN/END crypto-lab shared header` markers are
already gone and the prose is corrected — *"THIS LAB OWNS IT … the fleet-wide push was retired"*.
A full grep finds only those corrected comments. **Four labs remain to check: dp-noise,
iron-serpent, salamander, stream-ward.**

**The most alarming single defect of the sweep so far is a teaching one.** harvest-timeline's CRQC
scenario menus in exhibits 1, 2 and 4 opened on **`aggressive`** — CRQC in 7 years — because no
option carried `selected`. Every other statement of intent in the code says `median`: each
`update()` falls back to `CRQC_SCENARIOS[1]`, exhibit 5 is hardcoded to it, and Reset sets it by
name. So **the page opened on the most alarming projection it models, exhibits 1 and 5 contradicted
each other at first paint, and "Reset to defaults" MOVED the verdict.** Found by asserting the
shipped default rather than assuming it — seventh instance of that rule paying out.

New shapes, all worth a fleet grep:

- **`background-color` never clears an inherited `background-image`.** frost-threshold's
  `.participant` set `background-color` while `button { background: linear-gradient(…) }` had set
  `background-image` — so **every signer card rendered as a primary indigo button, gloss and all**,
  with its identifier at 1.12:1. Grep for `background-color` on an element whose base rule uses the
  `background` shorthand with a gradient.
- **An `#app`-scoped base rule silently eats every unscoped component rule.** frozen-heart's
  `#app button` (1,0,1) killed five bare `.preset…` rules — **the entire severity colour-coding was
  dead code**: a 3px stripe rendering at 1px, every tone resolving to `--border`, the pressed state
  differing only by a 1.56:1 ring. Third sighting of the ID-scoped-base-rule family.
- **A decorative wash tuned for dark and reused verbatim in light INVERTS.**
  `color-mix(--accent 22%)` lightens `#0f1117` a little and **darkens near-white to a mid
  lavender**; garbled-gate's whole hero sat on it.
- **A lab with NO `box-sizing` reset at all.** The shared `.cl-hero` snippet sets
  `.cl-hero-why { width: 100%; padding; border }` and is copied into every lab, so it overflows by
  ~36px wherever border-box is absent — a permanent 1.4.10 failure present at first paint that no
  amount of driving reveals. Hit hpke-envelope and frozen-heart. **A one-off `box-sizing` on a
  single selector is the tell that someone already hit it and patched the symptom.**
- **A translucent overlay parked at `opacity: 0` with no `visibility`/`display`.** Stays in the
  a11y tree, stays hit-testable, `checkVisibility()` true, and if laid out contributes to document
  scroll width — harvest-timeline's `.gloss-pop` was **a permanent horizontal scrollbar at 1280**.
- **Native `input[type=range]` with no `accent-color`** — the UA handle is ~1.9:1 on a white page.
- **A fix applied to a token but not to its hardcoded twin** (3rd sighting): harvest-timeline
  lightened `#9d4edd` → `#b178e3` for `--color-crqc` *with a comment explaining why*, while
  `CURVE_COLORS` kept `#9d4edd` — and the chart is where the hue is actually used, at 9px.
- **Another fake-pass helper found in the wild.** garbled-gate's own `checkGradientContrast`
  measured against `getComputedStyle(document.body).backgroundColor` — the flat colour, **not the
  two radial gradients painted over it**. It returned 5.89:1 and passed; the element actually
  renders at 3.55:1 dark / 2.87:1 light.
- **`aria-hidden` text is a blind spot BOTH oracles share** — ghost-commit's `.line-no` gutter at
  3.95:1 was found only by enumerating every `aria-hidden` element that owns visible text and
  measuring by hand.

**TASK 14 PROGRESS 2026-08-09 (6) — 3 more repos, 6 defects. 21 of 78 done, 63 defects.**
encrochat `dbdf317` (1) · entropy-collapse `344c2b1` (3) · envelope-kms `6614265` (2).

**A FOURTH ORACLE BUG — the reflow check, and I made it worse before I made it better.**
`body { overflow-x: hidden }` propagates to the viewport when `html` leaves `overflow: visible`,
so content wider than the viewport is **CUT OFF rather than scrolled to** — a worse 1.4.10 outcome
than a scrollbar, and `documentElement.scrollWidth > clientWidth` can never see it. **16 repos have
that rule; 4 of them have honest gates** (kerberos · hqc-timing-break · psi-gate · envelope-kms),
where the reflow oracle was permanently green.

Detecting the clip directly fixed that and introduced a second, quieter bug **in the same edit**:
the "is this inside a real scroller?" ancestor walk ran up to `<html>`, and with the viewport clip
in place **`<body>` itself answers "hidden"** — so all 83 overflowing elements read as legitimately
clipped, the escaping set was always empty, and the oracle still reported nothing. That is *worse*
than the original, which at least fell back to naming the widest clipped box. The walk now stops
before `<body>`: a viewport-level clip is the DEFECT, and only a genuine scrolling container inside
the page excuses an overflow.

**I found my own regression only by mutating.** A forced `min-width: 900px` produced silence; the
probe showed `overCount: 83, escapingCount: 0`. Fixed, it names `main#app @900px right=900` in both
themes at 380px and goes green on revert. **A fix that looks right and does nothing is the exact
failure this whole sweep exists to remove — and I shipped one for about ten minutes.** Mutation
testing is not a formality at the end; it is the only thing that distinguishes the two.

**A gate that reported four tests while running two.** envelope-kms represents dark as the
*absence* of `data-theme` (`index.html` writes it only for `'light'`), so a `boot` asserting
`toHaveAttribute('data-theme','dark')` died at boot — **both dark configs were never measured**,
and it surfaced only because the collection pass produced light-only findings. **3 repos use that
convention** (envelope-kms · kerberos · nonce-guard); kerberos's gate already handles it explicitly
and was never at half coverage. Grep before writing a theme assertion.

**`#app p { color: … }` — an ID-scoped ELEMENT selector as a "base" rule.** At (1,0,1) it silently
beat every class rule on a paragraph in entropy-collapse: `.panel-lede`, `.intro p`, `.not-this`,
`.throughline p`, `.fork-legend`, and `.byte-tally[data-tone='alarm']` — the fork panel's designed
danger signal — all resolved to `--text`. Same family as the `#app a` case in dp-noise. Grep
`#app <element> {`.

**`aria-hidden` swallowing a headline.** entropy-collapse's `.cracked-tag` wrapped
"🔓 SEED CRACKED" — the headline of Chapter 3 and the only place the phrase appears — in
`aria-hidden="true"`. The intent was clearly to hide the padlock glyph. Both oracles skip
`aria-hidden`, so nothing could have caught it.

**`--control-border` applied only to `select`/`input` hit all three repos again** — 5 of the last 6.
encrochat 1.77:1, entropy-collapse 1.52:1 (and *worse on hover*, 1.28:1), envelope-kms 1.25:1. And
encrochat's old 1.4.11 check was `TEXT_CONTROLS = ["#custom-msg"]` — **the single element the token
was already applied to.** Third instance of a check aimed at the one place it cannot fail.

**Your `--accent` candidate for envelope-kms: NOT a finding**, measured and cleared — it only ever
resolves to `--teal`/`--violet`/`--amber`/`--crimson`, all four of which *are* redefined for light.
The generated-content rails that carry them measure 4.84:1 at tightest. **That leaves ecdsa-forge
and frost-threshold as the only remaining candidates**, both still unmeasured.

Worth promoting: **envelope-kms ships a pixel-differencing oracle** (`contrast/measure.mjs`) that is
immune to all four of the fixed oracle bugs *by construction*. Its one hole is that text painted
exactly its background colour changes no pixels, so 1.00:1 — the worst possible failure — is
dropped silently. Pairing it with the arithmetic walk covers both; **neither alone is complete.**

**TASK 14 PROGRESS 2026-08-09 (8) — 6 more repos, 41 defects. 33 of 78 done, 140 defects.**
hybrid-sign `908095f` (8) · hybrid-wire `dbe88f3` (6) · icy-dvrf `630c518` (3) ·
isogeny-gate `932b683` (6) · jevil `8a45b75` (9) · kdf-arena `0867b70` (9).

**THE SINGLE HIGHEST-YIELD SIGNAL IN THIS FLEET, and the token's own comment is the tell.**
`--border-strong` (or `--control-border`/`--line-control`/`--ctl-border`) carrying a long comment
asserting *"Control boundaries only (WCAG 2.1 SC 1.4.11)"* — while applied to **one rule**. jevil
**1:28**, kdf-arena **1:21**, hybrid-sign **1:34**, icy-dvrf **3:13**. And in every case the rules
it *did* cover were `select`/`input` — exactly what the token was written for. The comment is a
claim nobody checked, and the check that should have caught it was aimed at the same place.

```
for r in ~/repos/crypto-lab-*; do
  echo "$r $(grep -c 'var(--border-strong)' $r/src/style.css) / $(grep -c 'var(--border)' $r/src/style.css)"
done
```
**Ratio ≤ 3 almost certainly means failing buttons, meters and chart axes.**

**A LIMIT OF EVERY ARITHMETIC ORACLE, INCLUDING THE NEW ONE — antialiasing.** isogeny-gate's
domain/codomain box outline was *authored* at 2.25:1 and **rendered at 1.43:1**: a 1px canvas/SVG
stroke on integer coordinates straddles two device columns at half strength. **The stylesheet
value is not the screen value, and no token audit can see this — only pixels can.** Grep
`strokeRect(` / `lineWidth = 1` and check for half-integer alignment.

**A "track / grid / lanes" whose FILL passes but whose EXTENT does not** — hit in all three of the
last repos. The graphic's meaning is a *ratio* and **the denominator is invisible**: isogeny's
key-space grid (the grid the prose points at did not render until a cell lit), jevil's
`role="progressbar"` track, kdf-arena's bar tracks and its memory grid — the denominator of "drawn
to scale". Grep `role="progressbar"`, `role="meter"`, `.track`, `.grid`, `.lanes` and measure the
**unfilled** state against its container.

**`:hover` compliant, resting state broken.** kdf-arena's `.preset-btn:hover` used `--warn-fg`
(fine) while the resting border used `--warn-border` (2.05:1) — **so any check that measured a
hovered control passed.** Grep `:hover { border-color` where the base rule uses a different token.

**Seventh instance of a check aimed where it cannot fail:** isogeny-gate's own `contrast.test.ts`
header claimed to cover "UI elements" while **every pair in it was text/background**. A false
coverage claim in the file whose job is coverage. It now carries a 1.4.11 block plus an assertion
that the two boundary tokens stay distinct — so "fixing" it by aliasing one to the other cannot
pass.

More:
- **The border-box trap confirmed twice more** (kdf-arena's `--warn-border`/`--accent-border` are
  `rgba()` on elements that also set their own fill), which makes borders look **~2× better than
  they are**. This is the bug I had in the new oracle; it is also live in the labs. Grep
  `border.*rgba` cross-checked against a `background-color` on the same rule.
- **A state change that removes a boundary — 3rd and 4th sightings:** jevil's
  `.btn:disabled:hover` reset the border to `--border`; kdf-arena's `.preset-btn.is-weak` swapped
  to a translucent border that made the pressed edge *worse*.
- **An `aria-label` on a tooltip REPLACES its text content**, so isogeny-gate's glossary definition
  was never readable by a screen reader — and nothing referenced the popover either. Opening a
  second term also left the first at `aria-expanded="true"` forever.
- **A source fix in kdf-arena:** `#argon2-memory` advertises `min="8"`, but RFC 9106 requires
  m ≥ 8·p and the field ships at p=4 — **the form's own minimum is a value the run cannot
  accept**, surfacing as a library error naming neither field and quoting the wrong unit.
- **Dead initial-state markup no visitor ever sees** (jevil): "Generate a key to begin.", "No
  signatures yet." and an unreachable `flash("Generate a key first.")`, all overwritten before
  first paint by `boot()`'s trailing `generate()`. **A gate written from the markup would fail
  against a correct page.** Eighth instance of "assert the defaults".
- **Playwright's `click()` can time out INSIDE the click**, not the assertion after it, when the
  handler is multi-second in-page crypto — which reads exactly like a broken selector. Heavy labs
  need the timeout on the *action*.

**TASK 14 PROGRESS 2026-08-10 (10) — 3 more repos, 17 defects. 39 of 78 done, 183 defects.**
kdf-chain `843d51e` (8) · kem-trap `c326d58` (5) · key-mirror `3ef9d0e` (4).

**THE OPEN `credential-veil` REFLOW DEFECT IS SOLVED, and it was a fleet pattern.** The cause is a
missing `box-sizing: border-box` reset: the shared `.cl-hero` block — copied into every lab —
gives `.cl-hero-why` `width: 100%` below 640px on top of ~35.6px of padding and border, so under
the default `content-box` it is WIDER than its column. 356 + 35.6 = 391.6, which is exactly the
392px measured when the defect was first recorded. **The five fixes tried then (min-width on three
elements, max-width, display:block) all left `scrollWidth` at 404 because none of them was
box-sizing.** Present at first paint, in every state — no amount of driving reveals it.

**A grep named 7 labs; measurement cut it to 4.** Fixed and measured before/after against the
built site: credential-veil 404→380, spdz-forge 403→380, time-trust 401→380, reshare-circle
400→380. **shadow-vault and silent-tally measured 380/380 and are NOT defects** despite matching
the grep; iron-letter was already fixed by its own pass. Suites green in all four.

**Two measurement errors of my own, both caught by a number looking wrong:**
- I built and previewed three repos **in parallel** and read one against a stale bundle.
- I measured at `waitUntil: 'load'` rather than after layout settled, which made time-trust read
  388 when it is actually 380. **Measure reflow after `networkidle`, not at `load`.**

From the three repos themselves:
- **`hkdfExpand` wrote its block counter into a `Uint8Array`**, so past 255 blocks it wrapped mod
  256 and returned **silently wrong OKM** — RFC 5869 §2.3 caps L at 255×HashLen precisely because
  that counter is one octet. In a demo whose own panel recomputes the RFC's test vectors.
- **Every panel reported failure into `.sr-only` alone**, so a sighted user pressing Derive saw
  nothing at all (3.3.1).
- **The denominator problem again, twice:** kdf-chain's `.cost-track` is 96% of the bar for
  PBKDF2-100k and measured 1.42:1; `#mem-grid` cells are 73% of the graphic's area and were
  invisible until filled. **Every one of the corresponding FILLS passed** (3.73–7.48:1) — it is
  only ever the extent that fails.
- **An animated state that only fails mid-pulse.** `.mem-stall.mem-busy` computes 3.82:1 from the
  mix and measures 1.78–1.91:1 once the running animation is composited. **Arithmetic alone would
  have cleared it.**
- **The same semantic role at two different mix percentages** — kem-trap's accept-side border was
  45% in one rule and 55% in two others; 45% failed and 55% landed on *exactly* 3.00:1.
- **`accent-color` set to a fixed hex** rather than a themed token: 6.40:1 in the theme it was
  picked for, 2.70:1 in the other.
- **key-mirror's old gate's FIRST action was `evil.check()`** — the honest default state, what
  every visitor loads, was never scanned once. And its `border-contrast.spec.ts` queried exactly
  one selector, `#app input[type="text"]`, **the only rule in the stylesheet using
  `--control-border`** — a ninth check aimed where it cannot fail.

**TASK 14 PROGRESS 2026-08-09 (9) — 3 more repos, 26 defects. 36 of 78 done, 166 defects.**
ibe-gate `1da9695` (9, a focused 1.4.11 re-pass on an already-gated repo) · iron-letter `c358d12`
(12) · isogeny-atlas `4e0bfc5` (5).

**A FIFTH BUG IN MY NON-TEXT ORACLE, found by an agent: it never judged a LINK styled as a
button.** The `CONTROL` selector list had no `a`, and the shared header's own Menu and GitHub
controls are `<a class="cl-btn">`. Across the fleet that was hiding **96 findings**. Now covers
`a[role=button]`, `a[class*=btn]`, `a[class*=button]` — deliberately not every anchor, because a
prose link identifies itself by its text and is not a 1.4.11 case. Recaptured and re-verified:
**70 of 70 green.**

**⚠️ THE SHARED HEADER IS NOW DIVERGENT — MAINTAINER DECISION NEEDED.** I flagged `.cl-btn`'s
border earlier and left it alone per CLAUDE.md. Agents have since fixed it in **three labs, two
different ways**:
  - ibe-gate `1da9695`, iron-letter `c358d12` — bumped the accent mix **38% → 52%**
  - isogeny-atlas `4e0bfc5` — switched to mixing **`--cl-ink` at 70%**

**The second is the only one that generalises.** isogeny-atlas's accent is a violet close in
luminance to the always-dark bar, so *no percentage of `--accent` can ever clear 3:1* — at 100% it
is still ~2.2:1 in the light theme. Mixing `--cl-ink` (the accent already carried toward `#eafff8`
so the bar's TEXT stays readable) clears 3:1 for every accent tested: 6.58 (`#35d6bb` default),
3.42–4.87 (dark accents). **160 labs still carry the original 38% form.** Recommendation:
normalise the fleet on `--cl-ink 70%` in one reviewed pass; do not leave three shapes in the
field.

**Second instance of my rollout clobbering an agent's work mid-flight.** ibe-gate's agent emptied
its baseline by fixing all six findings, and my central regeneration wrote the stale six back. No
damage — HEAD was correct and the agent restored the worktree — but the hazard is now confirmed
twice. **Do not regenerate baselines while agents hold repos.**

More from these three:
- **A hover state that fails while rest passes.** iron-letter's seal button is 5.36:1 at rest and
  **3.65:1 under the pointer**, because `hover:bg-emerald-600` lightens the fill. Visible only
  because an honest drive scans with the mouse still resting on the control it just clicked. The
  fix needed a *window*, not a swap: 1.4.3 wants ≥4.5:1 for the label and 1.4.11 ≥3:1 for the fill
  on both panels, leaving fill luminance ∈ [0.190, 0.263].
- **Every button, input and textarea in iron-letter had lost its light-theme FOCUS RING**
  (1.57–2.45:1). The neighbouring `.text-*` and `.border-*` rules had been carried to the darker
  `-700` variants; **`outline-color` was the one property nobody carried with them.**
- **`duplicate-id-aria` ×152** — a glossary emitting a fixed-id description span, so repeated
  terms collide. `incomplete`-only, invisible to a violations gate.
- **A lab source bug found by the fix's own unit test:** ibe-gate's `hue = b/255*360` maps `0x00`
  and `0xff` to the *same* hue. Survivable while lightness alone separated them; once both were
  lifted to the luminance floor the two bytes rendered as one colour. `byteColor` now has a test
  asserting the 3:1 floor over all 256 values **plus injectivity** — the only ratchet that class of
  defect can have.
- **A correctness bug:** iron-letter's "QR Code" threw and did nothing for RSA-4096 — the encoder
  tops out at 669 bytes and a 550-byte SPKI key is ~734 chars. It now says so, which is the lab's
  own argument for elliptic curves in its most concrete form. **Asserting only `#qr-container svg`
  is how the throw stayed hidden.**
- **`border-contrast.spec.ts` in isogeny-atlas measured one element against its OWN background**
  rather than the surround — an eighth check that could not fail.

### RECOMMENDATION 1 DELIVERED — an oracle for the two classes that had none (2026-08-09)

**WCAG 1.4.11 (non-text contrast) and generated content were invisible to every gate in this
fleet.** axe has no rule for either, and the arithmetic walk in `contrast.ts` measures *text
nodes* — so a control's boundary is out of scope, and a `::before` glyph is not an element and
owns no text node. Both were being caught by hand-sampling screenshots, which does not
regress-test. `e2e/nontext.ts` now measures both, wired into `scan()` in **68 repos** (2 more held
back while agents own them).

**It is a RATCHET, not a report.** A check that logs and never fails is not a gate, and this
sweep has spent its whole length deleting exactly those. Three rules:
  1. a finding NOT in the baseline fails — a regression cannot land;
  2. a baselined finding that gets WORSE fails — the list cannot rot;
  3. **a baselined finding that no longer appears ALSO fails** — a fixed entry must be deleted.
Rule 3 is what stops an allowlist becoming a permanent exemption: the file can only shrink.
**517 findings baselined; 7 repos already clean.** Green in 69 of 69, and it bites — an injected
control whose fill and border both match its panel is caught at 1.08:1.

**FOUR BUGS WERE FOUND IN THE ORACLE BEFORE IT LANDED**, and the pattern is the lesson:

| # | Bug | Caught by |
|---|---|---|
| 1 | judged the browser's own unstyled widgets (1.4.11 exempts UA-determined appearance) | a "fixed" repo still reporting 6 findings |
| 2 | read `background-color` only, ignoring gradients — composited onto WHITE | a ratio **identical in both themes**; a number that cannot depend on the theme is not measuring it |
| 3 | baseline generated from first paint while the check runs in every driven state | 10 of the first 20 repos reporting NEW on run one |
| 4 | a translucent border composited over the SURROUND, not the element's own fill (`background-clip` defaults to `border-box`; an *outline* is the opposite) | an agent, hand-measuring a gold button whose edge should read `rgb(115,97,0)` |

**Not one was found by reading the code.** Each came from a number that did not make sense,
checked against something already known. Validated in both directions throughout against
encrochat, whose 1.4.11 defect had been hand-measured: the oracle reproduces **2.01:1 / 1.91:1**
with the fix reverted and reports clean with it in place — unchanged across all four rebuilds.

**Two harness failures worth keeping**, both the same shape as the defects being hunted:
- **A survey that silently lost 16 repos.** A repo whose `webServer` failed to start produced no
  output and was read as "no findings" — 13 were about to be wired with EMPTY baselines,
  permanently ratcheted at zero against measurements that never happened. The harness now records
  `RUNFAIL`; it caught two more port-blocked repos on the final pass, which turned out to hold 968
  and 308 findings between them.
- **`nontext.ts` did not typecheck under stricter configs**, and because `webServer.command` runs
  `npm run build`, a type error in a TEST HELPER takes the whole gate down. Fixed structurally
  rather than by patching types: the file is now **generated per repo, splicing that repo's own
  `contrast.ts` paint core**, which by construction already compiles there.

**Known limits, stated rather than hidden:**
- `aria-hidden` spans inside a control — switch tracks and thumbs, custom checkbox glyphs — are
  unreachable by this oracle *and* by axe. Still hand-measurement only. One lab had a white thumb
  on a 1.82:1 track on a white button: the entire switch graphic invisible.
- Absolutely-positioned pseudo-elements are marked `unverified: true`; they can paint outside
  their host and the oracle measures against the host's backdrop, so those ratios are not
  trustworthy.

### RECOMMENDATION 2 — the teaching-correctness sweep (started 2026-08-10)

**Thesis:** for a site whose purpose is teaching cryptography correctly, a demo that lies is
worse than one with a contrast failure. So: for every claim the page renders, **is this
sentence true in the state it is being shown in?**

**Instrument first, and the instrument reported its own limit.** I wrote
`scratchpad/teaching-classes.md` from ~13 known answers found incidentally by the a11y work,
then built three mechanical detectors and validated each against a defect somebody had
already found:

| detector | validation | fleet result |
|---|---|---|
| shipped default contradicts the code's own fallback | 3 hits pre-fix, 0 post-fix | **0** — `harvest-timeline` was the only one |
| batch runner disabled by its own re-entrancy guard | names both dead callees, clean post-fix | **0** — `zk-proof-lab` was the only one |
| printed difference that can go negative | fires on pre-fix source | 11 candidates, **0 real** |

The first two are genuine negative results worth having: those defects were serious but
**singular**. The third is the lesson — its 11 candidates were `Math.abs`-guarded, already
fixed, or matched no subtraction at all. Getting the first detector right took **three**
attempts (a literal `<select>` span found nothing in the repo that defined the class;
file-wide `selected` was defeated by `selectedIndex`; any-template/any-fallback over-fired on
fixed source). Each failure was visible only because a known answer existed to check against.

**Conclusion: these defects are semantic.** A sentence asserting something the code does not
do — a regex cannot see the relationship between a claim and its computation. The audit is
therefore done by driving the lab and reading what it says. Brief:
`scratchpad/claims-audit-brief.md`.

**shor — 5 defects, committed `195537f`.** The strongest single result of either
recommendation so far:
1. `✓ Stage 3 — recovered the period r` appended after EVERY continued-fractions step,
   `step.success` or not — so the banner sat one line below the step's own *"the period was
   not recovered, so this base is discarded"*. **53 of 720 engine runs** take that branch.
2. The convergents caption promised a highlighted row in that same failed state, where
   nothing is crowned.
3. `#live-callout` was written and never cleared: Reset returned three panels to placeholders
   and left this one asserting *"This demo factored N = 143 → 11 × 13"*; running a prime next
   put *"there is nothing to factor"* and *"this demo factored N = 143"* on screen together.
4. `parseInt('15.5') === 15` — typing a fraction factored a different number from the one in
   the field, while the error copy promised "a whole number".
5. A per-run outcome stated as a property of the input (*"N was resolved classically … for
   this input"*, when a third of runs on that N do not).

Four claims were **cleared with numbers** (0/720 counterexamples on the p×q identity and on
the crowned convergent being the true minimal order; the resource estimates checked against
the RSA table). A negative result stated with its sample size is worth more than an
unrefuted one.

**grover — 5 defects, all in one panel, and a test that encoded the same error.**
The race panel renders an explicit invariant: *"Both bars share one timeline: equal width =
equal number of oracle queries."* The bar was scaled by `groverQueryCount` = **2k*+1**, the
*reflection* count. Diffusion is not an oracle call, and the lab's own glossary defines query
complexity as "number of oracle calls", so:

1. The quantum bar was drawn **~2x too wide at every n**, against a caption asserting width
   *is* the query count.
2. At **n = 2 and n = 3** the inflated count (3, 5) exceeds the classical figure (2, 4), so
   `Math.min(1, …)` pinned both bars to **100% — a dead heat** — directly beneath a caption
   promising *"Grover reaches the target … while the classical search is still scanning"*,
   and beside status lines reading **1 query against 2**. Three rendered things, three
   different answers. Both settings are one slider drag from the default.
3. A 1.5% visibility floor silently inflated the bar a further **1.22x (n=16) to 4.89x
   (n=20)** — breaking the stated invariant exactly where the speedup is most dramatic.
4. The **speedup table one row below disagrees with the race panel by π/2**: it is N/√N where
   the race is (N/2)/k*. At n=16 the table says **256x** while the panel above it says
   32,768 / 201 = **163x**. Neither stated its basis.
5. Two dead branches printed nothing: `n <= 20 ? '' : …` and `n === 128 ? … : ''` — the
   slider maxes at 20, so *"~317 years"* and *"~10^15 years"* were unreachable.

Fixed: a new `groverOracleQueries` (= k*) scales the bar; the reflection count is still shown
but never called a query; a floored bar is hatched and states its true share ("to scale it
would be 0.15% of the classical timeline"); both speedup figures now name the quantities they
compare. Also tightened the hero's *"halving the effective bits of AES and hashes"* to say
**preimage** resistance — the exact conflation the lab's own glossary warns about.

**The suite had encoded the bug.** `claims.spec.ts` asserted `2k*+1 < N/2` — false at n = 2
and n = 3 — and ran only `n ∈ {4, 10, 16}`, skipping precisely the range that would have
exposed it. This is the fleet's dominant defect class arriving from the other direction: not
a test pinning behaviour a fix changed, but a test **built around the defect's own
assumption** and scoped to avoid its counterexample.

Regression: the new tests measure the *laid-out* bar widths and assert `width == k*/(N/2)` at
**every n from 2 to 20**, or that a floored bar says so and states its true share. Verified by
mutation — reverting to `2k*+1` fails all three, and they fail at **n = 2**, the setting the
old test skipped. First mutation attempt was invalid (removing the call left an unused import,
`noUnusedLocals` broke the build, Playwright's webServer never started — the recorded
"a mutation that breaks the build proves nothing" hazard, hit live).

**One methodological note:** my first version of the new test read 0.375 where it expected
0.5 — `.race-bar` carries `transition: width .15s linear`, which `emulateMedia({reducedMotion})`
does **not** disable, so `getBoundingClientRect` returned the *previous* n's width mid-animation.
Any test measuring geometry after a state change must wait for the laid-out width to agree
with the inline target width. Reduced-motion emulation is not transition suppression.

**hash-zoo — 4 defects, `6357fb8`** (32 unit + 46 Playwright pass).
1. *"This flips **every** input bit in turn"*, under a button reading "Run every-bit sweep" —
   the engine caps at 4096 flips and samples above it. Measured: 512 B → 100% of bits,
   **513 B → 50.00%**, 4 kB → 12.50%, a 12 kB paste → **4.17%**, 20 kB → 2.50%.
2. *"Parallelizable, SIMD-friendly, fastest of the three"* — stated flat, **twice**, two
   sections above a timing panel measuring the opposite. Over 35 timed runs at 7 sizes
   SHA-256 was fastest in **34**, and BLAKE3 measured **3–4x slower** at every size ≥ 1 kB
   (1 MB: 3.1 ms vs 10.7 ms). The repo's README already explained why a JS build inverts the
   ranking; the page did not.
3. Two panels written and never cleared — clearing the message left the histogram reporting
   statistics for a message that was gone; editing the secret left the forgery panel
   publishing SHA-256 of the **old** secret under "all you legitimately hold".
4. Landed a half-finished fix a dead agent left in the working tree with `tsc` broken: the
   input strip drew the first 512 bits whatever the slider said — 288 of 800 positions on a
   100-byte message showed no highlight under a caption promising one.

**paillier-gate — 6 defects, `33f0e4f`** (62 unit + 18 Playwright pass).
1. *"It is below the honest 6"* printed unconditionally, one clause after printing the two
   numbers that contradict it. Encrypt-then-MAC drops the rewritten ballot, so the tally
   loses that voter's own vote — and votes are 0 or 1. **False for 4 of the 10 selectable
   targets.**
2. **`hidden` did not hide.** `.ledger { display: grid }` and `.handoff { display: flex }`
   outrank the UA `[hidden] { display: none }` rule, so from first paint — before any keypair
   existed — the page rendered a **542x361** ledger of an operation that had not happened,
   every value slot empty, plus a **542x84** hand-off button for a ciphertext that did not
   exist. Every reset path called `.hidden = true` and silently did nothing.
3. `#aggregation-table` was the one panel a fresh keypair did not retire; the factor panel's
   "≈ N steps for a K-bit prime" had two halves that disagreed (87 of 200 keygens produce a
   modulus one bit short, making `floor(bits/2)` wrong); two more verdicts outlived the
   controls they describe.

Cleared with numbers: 64-bit factors 25/25 in 3–9 ms; 96-bit gives up 23/25 as the copy says;
the re-randomize failure branch fired 0/300. The `ms === 0` rate fallback is **unreachable**
(0 of 50 runs, min 3 ms) — reported as unreachable, not counted as a defect or "fixed".

**Both repos' existing suites had encoded the defects' own assumptions**, which is now the
single most reliable pattern in this sweep. hash-zoo's strip test ran **only bit 0** — the one
position where a fixed prefix is correct — and passed straight through the windowing mutation.
paillier's `exhibits.spec.ts` **and** `tests/ballots.test.ts` each deliberately targeted the
ballot at index 2 *because* dropping it costs the tally nothing, then asserted the unchanged
number, while never reading the sentence beside it that said otherwise. Same shape as grover,
whose suite asserted the buggy invariant over the input range where it happens to hold.
**When auditing a claim, read the test that covers it and ask what it avoids.**

**A fourth detector, generalised from grover — and it confirms the pattern.** grover's defect
had a structural signature worth chasing: *a display dimension that is floored or clamped,
next to prose asserting the dimension is to scale.* Two stages, because the candidate is
mechanical but the verdict is semantic:

- Stage 1 (floored/clamped display dimensions): **25+ repos**, floors from 0.4% to 7%, plus
  `Math.min(100, …)` clamps that pin a bar at full width while the value exceeds its max.
- Stage 2 (a proximate to-scale claim in rendered prose): **1 hit fleet-wide**, and it is
  about bcrypt cost, not a bar.

Validated against pre-fix grover, where stage 2 fires on the rendered caption. So the floors
are almost all honest visibility minimums with nothing claiming otherwise — **grover was the
only lab that promised its bars were to scale and then floored them.**

**A fifth detector — written-but-never-cleared panels** (`scratchpad/staleclaim.py`), the
class behind shor's `#live-callout`. Static: bind element ids to their cached variables, find
`.innerHTML`/`.textContent` writes, find the reset scope (named `reset*`/`clear*` function,
arrow, or `resetBtn.addEventListener('click', …)`), and diff. Validated **both** directions —
it names `live-callout` on pre-fix shor and goes quiet on post-fix.

Raw fleet output is noise: **45 files** have uncleared panels, because a lab whose `render()`
repaints everything has a reset that clears nothing (grover: 26 "uncleared", all fine). The
signal is the *shor shape* — a reset that clears most panels and misses one or two. Filtering
to `cleared >= 3 and 1 <= missed <= 3` leaves **exactly one** candidate fleet-wide,
`time-lock-puzzle/src/ui/solve.ts` (misses `reveal`, `solveParams`) — and on inspection it is
a **false positive**: `resetStats()` hides `#reveal` with `display:none` and `showReveal()`
always rewrites its text, so stale content cannot reach the screen. `solveParams` is rebuilt
in `loadPuzzle`. Real result: **1 candidate, 0 defects.**

**A sixth detector — and the first one that found things: `hidden` that does not hide.**
Generalised from paillier-gate. The UA rule is `[hidden] { display: none }`, an **attribute
selector**, which any class rule setting `display` outranks — so a panel the markup declares
hidden paints anyway, and every `el.hidden = true` in the codebase silently does nothing.

Unlike the static detectors this one **measures**: `scratchpad/hiddencheck.mjs` starts each
lab's own vite dev server, loads the page, and asks the browser whether any element carrying
`hidden` computes to a display other than `none`. Validated both directions against
paillier-gate — **2 of 6 painted before its fix, 0 after**.

Stage 1 (uses `hidden`, no `[hidden]` CSS override): **72 of 112 repos**. Measured all 72.

| repo | painted | what was showing |
|---|---|---|
| `aegis-gate` `4d347df` | 1086x264 | Exhibit 3's nonce-reuse output, every slot empty, including the row "B recovered from C_A, C_B, and known A" — **the answer to the Predict prompt directly above it** |
| `enigma-forge` `f498f82` | 926x140 + 1280x151 | an import dialog, and a full-width presenter overlay with focusable ✕ / Prev / Next |
| `mac-race` | 1105x161 | the length-extension forged-message layout, captioned "What the server actually hashes — SHA-256(secret ∥ forged bytes)", before the attack was run |

Fixed at the root in each (`[hidden] { display: none !important }`), not by renaming the
colliding class — the `!important` is load-bearing, since otherwise any future `display` on a
hideable class wins again, which is exactly how all four shipped. Each has a regression test
asserting the property for **every** element carrying `hidden`, with a count assertion so it
cannot pass vacuously, and each was mutation-verified with `display: revert`.

**What this sweep does NOT cover, stated plainly: 38 of the 72 repos had no `[hidden]`
elements at first paint at all**, so the check is *silent* about them, not clean — they
matched stage 1 on `.hidden = true` applied later, or on `aria-hidden`/`overflow: hidden`.
Real coverage is **34 repos measured, 3 defects**. A follow-up pass should re-run the check
after driving each lab's states, since an element hidden only after an interaction is exactly
as likely to collide.

**FULL-FLEET RE-RUN — the stage-1 filter was unsound, and it cost one repo.**
`[hidden]` has specificity **(0,1,0) — identical to a class**. So excluding repos that had
*any* `[hidden]` CSS rule was wrong: an author rule without `!important` still loses to any
class rule that comes later, and a reset placed at the top of a file loses to everything
below it. (A first attempt to re-filter statically also failed — `grep … | head -3` reported
repos I had already fixed as unfixed, because the `!important` was on the fourth matching
line. Truncated greps answer a different question.)

So I stopped inferring and **measured all 163 labs that have an index.html and Playwright.
163/163 completed, zero errors.** One new defect, in a repo the original filter had excluded:

**`zk-arena` `c900c8d`** — six per-class patches (`.warning-banner[hidden]`,
`.back-to-top[hidden]`, `.quiz-result[hidden]`, `.viz-truncation[hidden]`,
`.kbd-overlay[hidden]`, `.proto-verdict[hidden]`), each added after a specific panel was
caught showing through, and a seventh element that never got one: a 184x56 **"Copy share
link" button offering to share a quiz result nobody had produced.** The clearest possible
argument for fixing the root instead of the collision.

**And it exposed a live instance of the stale-`dist` hazard.** zk-arena's
`webServer.command` was `npm run preview` with no `npm run build &&`, so the suite tested the
last successful build — the `[hidden]` fix was in the stylesheet and the new test failed
anyway. Re-checked all 163 configs: **160 already had `build &&`**; `zk-arena`, `bike-vault`
and `x3dh-wire` did not (all three now fixed); `lll-break` runs `npm run dev`, which compiles
from source and is unaffected. My first count of this said "159 missing" — `grep -A 3` was
too narrow a window to reach the `command:` line. Checked before reporting.

**DRIVEN-STATE GAP CLOSED — and it was closed by asking a better question, not by driving.**
This is a **cascade** property, not a state property: if a rule gives an element a `display`
that outranks `[hidden]`, that element paints whenever the code hides it — at first paint,
after an interaction, whenever. So instead of driving every lab's states, probe directly:
**for every id the source sets `hidden` on, set the attribute in the browser, read the
computed display, restore.** `scratchpad/hideids.py` extracts the targets (var→element
binding plus inline and markup forms); `scratchpad/hidetargets.mjs` probes them.

Validated both directions on zk-arena: 0 with its fix, 24 with the fix reverted, including
the known `#quiz-share`. **All 163 labs swept, 0 errors. Two more defects, neither visible to
the first-paint sweep:**

- **`hqc-vault` `ded4a8e`** — *"Hide step-by-step" did not hide the step-by-step.*
  `#kem-steps` is governed by `stepContainer.hidden = !stepMode` and filled with the
  FO-transform walkthrough by the same render pass; `.kem-steps { display: grid }` outranked
  the attribute. The first-paint sweep called this repo clean because the container **carries
  `hidden` from the start but is empty until a run fills it** — no box, no visible defect.
  The defect exists exactly when a visitor would meet it.
- **`multivariate` `b72232e`** — `#audience-toggle` is a hide target and `.ghost-button
  { display: flex }` outranks the attribute, so hiding that control would have left a
  clickable button on screen. Invisible at first paint because **it is not hidden then.**

An intermediate instrument was discarded after failing validation: enumerating classes from
`document.styleSheets` reported **0 classes checked** on a repo with a known defect, because
under vite's dev server the CSSOM exposed 4 rules in total. Probing elements directly needs
no CSSOM and also covers `display` set by id, tag or inline style.

Fleet-wide the class now stands at **6 defects** — `paillier-gate`, `aegis-gate`,
`enigma-forge`, `mac-race`, `zk-arena`, `hqc-vault`, `multivariate` (7 labs; paillier-gate
was found by the claims audit, the rest by sweeps) — across **163 labs measured twice**, at
first paint and against every hide target. The residue is elements created dynamically that
never exist in the DOM at load.

**hqc-vault's test also shows the vacuous-pass trap in miniature:** the first version toggled
step mode without running the KEM, so it asserted against an **empty container** and passed
while proving nothing. It now drives a real keygen and encap first. Same failure mode as the
count assertions added elsewhere in this sweep — *a test that cannot fail is not evidence.*

### The two repos left mid-edit by agents that died — finished and verified

Both were picked up cold, with the standing rule that a dead agent's uncommitted work is a
*claim*, not a result. Both claims held up, and both repos had something still wrong.

**lattice-gentle `2e1cbb2` — 4 defects, all confirmed by mutation rather than by reading the
comments.** `aria-label` on a bare `<p>` (prohibited on role `paragraph`, so the label was
discarded and axe files it under `incomplete` only); a redundant `role="list"` on an `<ol>`
that triggered `aria-required-children` **whenever the log is empty — which is first paint and
after every Reset**, so the page shipped an ARIA violation in its default state; the 3:1
control boundary applied to exactly two selectors; and a light theme that overrode
`--accent-ink` but not `--accent`.

Reverting the border token fails naming `button boundary vs its own fill`; removing the
reflow cap fails with `{"clientWidth": 380, "scrollWidth": 421, "widest": "div.reduce-panel
@392px right=421"}` in exactly the "big numbers — one step" state — **independently
reproducing the dead agent's measurement to the pixel.**

**falcon-seal — the gate found two defects the previous pass had not.**
1. A **reflow failure at first paint**: `.hero` laid out 730px in a 380px viewport, document
   744px. The hero was the *symptom*. Measuring min-content per grid item found the cause:
   `#panel-4`'s comparison tables give it a min-content of **730px**, and with `.page`'s
   implicit `auto` track that single panel sized the one column for the whole page. Fixed
   with `grid-template-columns: minmax(0, 1fr)`. The `overflow-x: auto` on `.table-wrap`
   could never have helped while the item was free to grow.
2. **The reflow bug was masking a keyboard defect.** With the fix in, axe immediately flagged
   `scrollable-region-focusable` on `#real-falcon-info > .table-wrap` — a dynamically
   rendered scroller with no `tabindex`. It was not a violation before *because the panel was
   730px wide and the region never had to scroll.* Fixing 1.4.10 exposed 2.1.1.
3. The previous pass also added `tabindex="0"` to seven regions **without a focus style** —
   the rule covered only `button`, `a`, `textarea`. Focusable with no visible focus indicator
   is a 2.4.7 failure introduced by the fix. Added, with `outline-offset: 0` since these sit
   flush inside grid panels.

**Two "findings" from dead agents dissolved under isolation**, and both were contention, not
defects: lattice-gentle's reported *"light @380 takes 5.7 minutes while the others take 14s"*
(the whole suite runs in **56s** alone), and mac-race's two failures at 17.5 minutes (**15.6s**
alone). Concurrent work on this box distorts timing badly enough to invent findings. The
recorded parallel-repo hazard has a second form: not just stale bundles, but **timeouts that
read as defects**.

### Task 11 and recommendation 2, merged — verifying the external review pays

The external review's labs overlap what a claims audit would examine anyway, so they are now
worked together: verify each recommendation against current code, **measure reachability**,
then fix.

**bb84 `0671c36` — 2 confirmed, 1 verified-and-declined.**

1. **The threshold boundary.** `eveDetected` was `qber > safeThreshold`, so a run landing
   exactly on the threshold took the *clean* branch and the page said the QBER was "below"
   the threshold, "under" the threshold, and "no eavesdropper detectable" — all false at
   equality. Measured over **19,200 engine runs** (5 thresholds × 4 photon counts × Eve
   on/off × 4 noise rates): equality occurs in **59 runs (0.31%), and 49 of those 59 have
   Eve present.** The boundary is overwhelmingly the run where BB84's entire teaching point
   gets an on-screen denial with the eavesdropper on the line, and it concentrates at
   threshold 20% / 64 photons — both one slider drag from the defaults. Now `>=`, which is
   also the fail-closed reading; the wording moved from "exceeds" to "is at or above".
2. **Privacy amplification did not bind the raw-key length.** `bitsToBytes` fills its 16-byte
   minimum by repeating the bit sequence cyclically, so a 16-bit key, its 32-bit double and
   its 64-bit quadruple all derived **byte-for-byte identical** final keys. Fixed by putting
   a 4-byte bit length beside the counter in the hash input. Reported as **structural, not
   reachable** — random raw keys are not exact repetitions of one another.
3. **Declined, with the reason.** `privacyAmplification` still runs on aborted transcripts:
   `runBB84` derives both keys before anything reads `eveDetected`. The UI refuses to expose
   them so nothing reaches the visitor, and making the core fail-closed means restructuring
   the return type into a discriminated union — a decision about the module's contract, not a
   defect fix. Left for a deliberate call.

**The existing e2e test had encoded the strict boundary** — it asserted the detected QBER
`toBeGreaterThan` its own threshold, which the corrected code violates at equality. That is
the **sixth** instance of this pattern in the sweep.

**The calibration in the task-11 notes held**: accurate on the code, silent on reachability.
Both confirmed findings were real; both needed measurement before their severity was
knowable, and the measurement changed the verdict in opposite directions — the boundary case
turned out far more serious than its 0.31% rate suggests, and the collision far less.

**noise-pipe `f5f6a6c` — 5 confirmed, plus a teaching defect the review never ranked.**
- **Concurrent-encryption nonce reuse.** `encryptWithAd` read `this.n`, awaited WebCrypto, then
  incremented. Not a rare race: **200 of 200** concurrent pairs reused nonce 0 with
  byte-identical keystream prefixes, and in a real browser a **double-click on the shipped
  send button** put 2 records out under 1 distinct GCM IV. Fixed by serializing every
  `CipherState` op and reserving the counter before the first await. Post-fix **0 of 200**.
- Pattern-selection race: a *slower* pattern started first always settles last — **300/300**
  in one tick, **0/200** at a realistic 16 ms gap. Latent but unbounded; guarded.
- Stale break-it results: window measured at **0–8.6 ms**, so not hand-reachable — fixed
  anyway because the guard is four lines and the browser test reproduces "IK accepted the
  forged responder static key" under the NN heading.
- **The teaching defect, which the review did not rank at all: the forward-secrecy verdict
  was printed, not computed.** All 13 patterns claimed *"Stealing both static private keys …
  AEAD rejects the static-only key"*, while **4 of 13 (NN, NK, KN, IN) ran no decryption at
  all**, **3 of 13 own exactly one static key**, and NN contradicted itself inside a single
  sentence. Now it enumerates every DH the attacker can actually form from the keys that
  pattern owns, tries each, and reports the count. **The one e2e test covering this ran only
  NN — the single pattern where the wrong key count was masked.**

**timing-oracle `b499288`, `d93466a` — 5 confirmed.**
- **Panel 1 counted characters the loop never ran.** The comparator returns on
  `a.length !== b.length` *before* the loop, so a wrong-length guess executes **zero**
  comparisons. Across a 124-guess corpus reachable from the shipped defaults, **98 differed
  in length and every one was overstated** — guessing the secret minus its last character
  reported "only 25 byte checks ran" for a comparator that ran none, under a caption reading
  "exact every run". Now modelled as a length gate, and it teaches what that gate leaks: the
  secret's **length**, before a single character is probed.
- **Panel 3's "uniform" ladder tally moved with the secret.** `bitsOf()` strips leading
  zeros, so the rendered width was a function of the top bit: **1027 of 2000** draws rendered
  fewer than 10 positions, and the on-screen tally ranged over all ten values 1–10 while the
  caption said *"no matter the bit values"*. Padded to a fixed 10-bit window.
- Benchmark serialization confirmed **empirically, not structurally**: with the page in view,
  **three panels were in the Running state at the same instant** while each verdict claimed
  "measured on this machine".
- UTF-16 code units labelled "bytes" (`🔑🔑🔑` = 6 units, 12 bytes) — fixed in panel 1, left
  alone in the HMAC panel, which really does compare bytes.

**The dominant pattern held four more times, and it is now unmistakable.** timing-oracle's
`operations` assertions all used **equal-length pairs** (unequal lengths appeared only in the
boolean test); its ladder test picked `0b10000000` and `0b11111111`, **both with the top bit
set — the only case where the width survives**; its panel-1 e2e used equal-length strings.
noise-pipe's forward-secrecy test ran only NN. That is **ten instances** across the sweep.

**Cleared, and worth recording as cleared:** noise-pipe's transport reset (already fixed in
`7ee1e0a`); timing-oracle's in-flight HMAC race (already fixed *more thoroughly* than the
review proposed — generation guard **and** an `inFlight` flag, with a browser test) and its
verdict-overreach class (already done in `bfdbfd6`). Roughly a third of what the review
raised for these two repos was already done.

**A caveat the agent flagged rather than buried:** timing-oracle's modeled-overlay e2e test
had latent flakiness — a debounced resize redraw re-renders canvases when document height
shifts, and serializing the benchmarks changed completion timing enough to expose it. It was
quiesced and confirmed stable over two consecutive full runs, but **it compares canvas pixel
hashes, which is inherently brittle and deserves a different assertion later.**

**phantom-vault `9780a0c`, `b82a2cc` — the worst teaching defect of the sweep: the page
certified passphrases its own panel cracks.** `Strength:` was `min(format ceiling,
composition ceiling)` — two *upper bounds* — printed as a verdict. Over the shipped
`DEFAULT_WORDLIST`, **5 of 8 entries score better than "Weak"**:
- `"correct horse battery staple"` → **"Very Strong, about 129 bits"**, cracked at guess 4.
- `password123` → **"Fair, 57 bits"**, cracked at guess 5 in 249 ms — and that is exactly
  what the lab's own **"Try a weak passphrase" button types in.**

A lab whose subject is passphrase strength told visitors a passphrase was strong and then
broke it on the same screen. Only the "Weak" band is a verdict now; above it reads "at
most …" on the label, `aria-valuetext` and live region. Compounding it, the "Not capped"
branch actively **endorsed** the passphrase ("not what's holding you back") — firing for
`password123` at length 8 and for `correct horse battery staple` across lengths 8–25.

Also: the entropy-cap panel kept describing the passphrase after `clearSensitive()` wiped it
(no `input` event — **100% of derivations**); the attack panel called a search that compared
**0 of 8** candidates a clean "exhaustion"; "94-symbol charset" (it is 89); and the collision
margin used `alphabet^length` rather than the reachable space. Per TRIAGE Tier 2, "MASTER
PASSPHRASE RECOVERED" is now "CREDENTIAL-CONSISTENT PASSPHRASE FOUND", with evidence strength
computed — 37.6 bits at the minimum shipped format, against the panel's own "billions of
entries" (2^30), implying ~0.5% collision odds.

**simon-period `8c365cd` — 6 teaching defects, all on the control path.** The pattern is
striking: nearly every one is a claim that is true of the *periodic* target and printed for
the *injective* one, whose entire job is to show the algorithm finding nothing.
- The arithmetic panel asserted f "collided by accident on top of its period", "a union of
  s-cosets", and "kills every y with y·s = 1" — three false claims, on **480/480** control
  rounds at each of n=4,5,6, where an injective f leaves exactly one input.
- *"0 of 32 outcomes cancelled to exactly zero — they are impossible"*: an impossibility
  asserted about the **empty set**, 480/480 control rounds.
- The rank meter printed **"5 / 4 needed"** and announced it to screen readers; 100/100
  control runs at every width end above the stated requirement.
- The race labelled the control's classical bar "birthday (classical)" and quoted "birthday
  bound 2^(n/2) ≈ 8.0" beside a measured 64.0 — a permutation never collides (**0 of 40**
  trials found a period at each width).
- The honesty panel asserted Even-Mansour never satisfies Simon's promise while the target
  card can print the opposite: a complete census found **2 of the 15 possible k₁ at n=4** are
  exactly 2-to-1, so **13.3% of "New secret" presses put two exhibits in flat contradiction.**

**Cleared by complete census, not sampling:** simon-period's EM period uniqueness — all 109
k₁ values at n=4,5,6, **0** with a second period, so the "stalled forever" failure is
unreachable (the test was still tightened, since the invariant permitted it). phantom-vault's
modulo-bias panel is never vacuous — all 15 charset combinations give sizes none of which
divides 256.

**Stale recommendations found again:** two of simon-period's were already fixed. Across the
four repos triaged so far, roughly a third of the review is already done — which is the
strongest argument for verifying before scheduling.

**A CI-integrity finding, checked fleet-wide before being believed.** In both repos
`test:a11y` and `test:e2e` were **the same command**, so splitting them naively would have
silently dropped the claims suite from CI; the agent moved deployment to `test:e2e` so the
split kept full coverage.

Fleet check: **31 repos define both scripts, and in 12 the two commands are identical.** But
every one of those 12 is the unfiltered `playwright test`, and **none filters to a subset** —
so *coverage is complete today in all of them*. This is a **latent naming trap, not a live
gap**: the two names imply a split that does not exist, so anyone who later narrows
`test:a11y` to the a11y spec silently drops the claims suite from whatever invokes it. Worth
a one-line fix when those repos are next touched; not worth a pass of its own.

(Recording the distinction deliberately. The first count — "12 repos with identical
commands" — would have read as 12 defects. Checking what the command actually ran turned it
into zero defects and one trap.)

**jevil `0e7845d` — a lab's security claim broken by its own engine.** The page said *"Even
unlimited computing power can't tell which is `f`"* — while the public key publishes a
256-bit binding fingerprint of the coefficients, derived deterministically from a seed. **With
zero signatures issued and zero points revealed, a brute-force over the seed space recovered
the exact key from the fingerprint alone.** And the seed was **8 bytes** — a 2^64 key space,
on a page whose hero advertised *"~124-bit-safe"*. Both fixed: 32-byte seed, and the claim
scoped to the evaluation equations, which is where it is actually true.

Also in jevil:
- *"Infinitely many polynomials fit"* is **false in a finite field** — with m distinct points
  exactly `|F|^(D+1−m)` fit. The page now computes and prints it (2^704 → 1 at default
  params), which is a better lesson than the wrong word.
- **The transcript verifier accepted almost everything: 10 of 11 tampered fields still
  verified** (`ood`, `version`, `field`, `rootHint` and every parameter identity ignored; an
  unknown `field` fell through to the base field). Worse, **a transcript exported from a
  completely different key verified "ok"**, because the fingerprint being checked lives in
  the same file. Now split into `OK_INTERNALLY_CONSISTENT` vs `OK_ANCHORED`.
- `deriveOOD` never enforced out-of-domain: **0 of 1000 keys collided** (expected ~1.3e-18),
  so it has never fired — an expectation rather than an invariant. Now rejection-sampled,
  with the rejection branch tested via an **injected draw source** rather than waited for.

**patron-shield `3b1d77b` — the calibration held exactly, and 7 more confirmed.** The briefed
bit-31 defect measured **200/200 `NaN` at bit 31, 6200/6200 correct at bits 0–30**; fixed, and
the `DB_SIZE <= 32` invariant is now exercised by running the whole protocol on a synthetic
32-record database including index 31. *Note for future mutation testing:* `>>> 0` and
`clz32` are **each independently sufficient**, so reverting either half alone does not
reproduce the bug — only reverting both does.
- **√N scaling used `Math.round`**, so **2 of 6 slider positions** printed a column-mask width
  too small to address the catalog: N=100,000 showed 316, and 316² = 99,856 — **144 records
  with no cell at all.** **The claims test recomputed the same `Math.round` formula**, so it
  agreed with the bug. Seventh instance of the pattern.
- *"you transfer one record's worth of data"* — contradicted by an exhibit two panels down
  that displays **two** record-sized responses.
- `generateQuery` accepted non-integers, worse than the review said: `NaN` produced a
  structurally valid query targeting record 0 while reporting `differingBit: NaN`.
- **A skip link pointing at `#app`, which does not exist** — and axe never caught it, because
  its skip-link rule is best-practice, not WCAG A/AA. A reminder that a green a11y suite is
  scoped to what it checks.

**35 mutations across the two repos, all confirmed to bite with green builds** — and the agent
**rewrote two of its own tests that turned out to be blind**: jevil's params-identity cases
each violated more than one identity, so a later check masked the earlier one, and a
point-count flood was caught by the duplicate check rather than the size cap it was meant to
exercise. Self-auditing the test, not just the code.

**Declined and reported rather than silently changed:** jevil's modulo bias is **real and
measured** (`q0 mod T = 1` for every offered T, a 2^-59…2^-56 relative bias against a 2^-124
target), but fixing it changes every derived position — a derivation-contract change, so it
went into `KNOWN-GAPS.md` instead.

**Task 14 batch — lll-break `13a9058`, matsui-line `943a216`, mayo-seal `6b5ba1c`.** Three
more honest gates; **13 defects**. What makes this batch worth recording is how precisely the
commit messages document *how the old gates faked passing*:

- **lll-break's** old spec injected `animation:none!important`, forced every `<details>` open
  from script, guarded every drive step with `if (await btn.count())` — so a missing control
  silently skipped instead of failing — then scanned **once**, in two themes, at one
  viewport. Exhibits 1 and 5 were never touched, no slider ever moved, 380px never scanned.
  Its one 1.4.11 check queried `input, select, textarea` — **exactly the three selectors the
  correct token was already applied to.** (The same shape as lattice-gentle. That token
  check has now been found self-confirming in three separate repos.)
  Found 6: every button dissolved into its panel; 629px of content in a 380px viewport; seven
  `tabindex="0"` regions with no focus indicator; **the focus ring itself invisible in the
  light theme**; footer links with no colour rule at all; and a meaningful-graphic failure
  measured from screenshot pixels.
- **matsui-line's** old spec was worse: it stripped `hidden` from every `[hidden]` element and
  added `active is-active open` to each, producing **a document no visitor can reach** — the
  custom-mask inputs and a Cancel button for a measurement that was not running, on screen
  together. It then scanned four times, always *after* the whole drive, so every state
  `driveDemos()` built was overwritten before anything measured it. The narrow test drove at
  380px, scanned, toggled the theme and scanned again **without re-driving**.
  Found 3, including `.btn-primary` painting its border the same colour as its fill.
- **mayo-seal** — 35 states per configuration, and it folded in the `hidden`-attribute check
  from the standing brief. Found 3, the sharpest being a zero inside a failing matrix cell:
  `--text-muted` was chosen against the *page* surfaces, but a `.cell--bad` composites the
  alarm tint to `rgb(229, 190, 175)`, a surface those numbers never described, and the ink
  measured **3.95:1**. Scoped to `.cell--zero.cell--bad` only, because the same oracle
  measured `.cell--ok` and `.cell--oilblock` in every driven state and neither fails.

I finished mayo-seal after its agent stalled, and **verified the mutation myself rather than
trusting the diff**: reverting the cell colour fails both light configurations with
`3.95:1 (needs 4.5:1) … fg rgb(85, 96, 58) on rgb(229, 190, 175) — "0"`, reproducing the
agent's measurement exactly — and it fails in a **late driven state** ("the whipping
walkthrough run at TOY parameters"), not at first paint. A gate that only sees the default
state could not have found any of the three.

**j-uniward `a611c7d`, `75a52a2`, `ed7740c` — the lab's central teaching claim is false in its
own shipped default state.** The blurb said *"At low payloads its exposure is the lowest of
the three"*; the README went further — *"no rigged comparison: at the recommended payloads
J-UNIWARD genuinely wins."* Measured with the lab's own modules over its own bundled covers:
**F5's per-change mean exposure is LOWER than J-UNIWARD's in 13 of the 15 (cover, rate)
states**, including the shipped 0.10 bpnzac default on `sample-grass.jpg` — **J-UNIWARD 7.1%,
F5 4.5%, with F5 winning 12 of 12 keyed runs at every rate 0.10–0.50.** LSB also beats it at
≥0.20 on grass.

The cause is structural and is now taught rather than hidden: F5 only edits non-zero ACs,
which are already the cheap textured ones, while J-UNIWARD's pool is *every* AC and its
trellis restarts every 12 message bits. The panel now names the ordering it measured, and
prints summed distortion too — the objective J-UNIWARD actually minimises, which it wins at
0.10 on both textured covers and loses at 0.40.

**And its headline safety metric could not fail.** *"DC / flat coefficients hit: 0 — structure
preserved"* counted ACs costing ≥ 1e7, but **the maximum AC cost across all covers is 1.1e5 —
0 of 64,512 ACs per cover can reach the threshold.** The number was pinned at 0 by
construction for any DCT-domain method, and `scripts/test.ts` asserted the same tautology.
Meanwhile J-UNIWARD *does* hit flat coefficients: worst placement at the **96.2nd percentile**
at 0.50 bpnzac. Replaced with a costliest-decile counter that fires in **6 of 12** keyed runs
at 0.50 and 0 of 12 at ≤0.40 — and the test now fails if it never fires.

Also: F5 was compared at a payload it never carried (**163 of 216–520 requested bits** on the
smooth cover — 75%→31%) while its bar sat under "the same payload across all three methods";
"Carriers used: 3,510 / 3,501 NZAC" printed a numerator exceeding its own denominator; and the
lab's own *"Smooth (sunset gradient)"* cover was badged **"Rich texture — ideal for adaptive
embedding"** (a gradient sweeps the full luma range, variance 498) while simultaneously
showing "13 bytes / Safe" in the table and **"(-7 bytes at current rate)"** in the banner.

**bitcoin-wallet `6102b03`, `2b1a65f` — a false claim, with the lab's own exhibit built to
agree with it.** *"Typing one wrong word makes the whole phrase fail to validate."* Enumerated
with the repo's own validator: **61,141 of 982,560 single-word substitutions across 40 phrases
still validate — 6.22%, about 1 in 16** — flat across all twelve positions (~128 of the other
2,047 words at every one). The last word is not special: 7 entropy bits + 4 checksum bits.

**The exhibit was scoped to confirm the falsehood.** "Mangle the last word" searches for a
corruption the checksum *catches*, and `engine.test.ts` backed the sentence with a single
substitution (`about`→`zoo`) that happens to fail. A counterweight now exists — **"Find a
change the checksum misses"** — with badge, an independent SHA-256 oracle and the validator
all agreeing it stays valid. That is the **eighth** instance of the pattern, and the first
where the *user-facing exhibit*, not just the test, was shaped around the defect.

Also: *"xpub can watch, only the seed can spend"*, contradicted three panels down by the same
page printing the derived child's `priv hex` and WIF; and *"Wallets call `.getNextAddress()`
exactly this way"* over a table deriving `bc1` addresses from `m/44'/0'/0'/0/i` — right
arithmetic, wrong wallet practice, which the page's own path gloss already contradicted.

**Two new verification notes, both worth remembering.** In j-uniward and bitcoin-wallet, one
mutation each makes the tests **hang rather than fail** — a synchronous infinite loop
(`readBits` on an exhausted segment; an unbounded CKDpriv retry), uninterruptible by any
timeout. Both are recorded in the test files, because a hanging mutation looks like a stuck
agent rather than a proof. And the agent **corrected an imprecision of its own** in a
follow-up commit (`ed7740c`): "13 of 15 comparable" had conflated the 11 states where F5
carried the full payload with the 4 where it did not.

**Judgement calls reported rather than guessed — these are yours:**
1. **j-uniward's exposure metric.** Mean per-change percentile is blind to change count, which
   is *why* F5 wins it; switching to summed distortion would flip the ordering back. The
   sentences are now computed and both quantities printed, but whether the bars should show
   distortion instead is a teaching decision.
2. **j-uniward's carrier-density band edges** (3% / 7%) are calibrated on the three bundled
   covers; the driving number is printed beside the badge, but the thresholds are the agent's.
3. **bitcoin-wallet defaults to mainnet and auto-generates a real key on page load**, before
   any click — verified factual, warning present and honest, nothing rendered is false. But
   defaulting to testnet/signet and removing auto-generate are safety decisions.
4. An account-type selector (`44'/49'/84'/86'`) is the honest fix for the derivation-path
   claim; a reference table was added instead, since the selector is a feature.

### THE GATE'S OWN AXE ORACLE WAS DEAD — 10 repos (2026-08-12)

**Found independently by two agents in the same batch, and confirmed by measurement.**

`AxeBuilder.withTags()` and `AxeBuilder.withRules()` both write `options.runOnly`, so
**chaining them keeps only the last** — the plugin's docblock says *"Cannot be used with
`AxeBuilder#withTags`"*. The reference gate in `drbg-arena/e2e/gate.ts`, the file the standing
brief names as the copy source, is written as:

```ts
await new AxeBuilder({ page }).withTags(TAGS).withRules([...4 landmark rules]).analyze()
```

so axe ran **four best-practice rules and not one WCAG rule**, while a green result read as a
full A/AA pass.

**Measured, not argued:** on drbg-arena the chained form executes **4 rules**; `withTags`
alone executes **63**. One agent proved it a second way — it emptied an SVG's `aria-label`, an
unmistakable `svg-img-alt` failure, and **the gate stayed green**.

**Affected (live chained form, comments excluded): 10 repos** — `dkg-gate`, `downgrade-wire`,
`dp-noise`, `drbg-arena`, `encrochat`, `entropy-collapse`, `envelope-kms`, plus `lll-break`,
`matsui-line` and `mayo-seal`, **which I certified earlier the same day**. The three are now
fixed (`c3828b4`, `a86d7fe`, `10c4b65`) and all pass under the full 63-rule set, so the
defects found in them stand — **but the gate that certified them was far narrower than its own
commit message claimed, and saying so is the point.** The other seven still need it.

The fix is two runs merged, never one chain — the landmark rules are still wanted precisely
because they are best-practice rather than WCAG-tagged, so `withTags` alone cannot reach them.

### A second dead oracle in the same file — 7 repos

`expectNoNewNonTextFailures` is called **only from inside `expectScrollersReachableSoft()`**,
which returns early when it is not collecting — so the 1.4.11 ratchet never executes in a
strict run. That is why drbg-arena's non-text baseline is empty.

Checked by locating the enclosing function of the call, not by counting call sites (the naive
count flags every repo, since one call site is normal). In a correct gate — `grover` — the
call is inside `scan()` and runs at every state. **Affected: `dilithium-reject`,
`dilithium-seal`, `dkg-gate`, `drbg-arena`, `encrochat`, `envelope-kms`, `vrf-gate`.**

**Union needing repair: 10 repos.** Both bugs share a cause worth stating plainly: *a gate
copied from a reference is only as good as the reference, and nothing in this sweep was
checking the reference itself.* Every "honest gate" commit in those repos overstated its
coverage in good faith.

**REPAIR COMPLETE — all 13 repos.** `mayo-seal` `10c4b65`, `lll-break` `c3828b4`,
`matsui-line` `a86d7fe` (mine); `downgrade-wire` `34912ab`, `dp-noise` `f3b246a`,
`entropy-collapse` `209a9e8`; `dilithium-reject` `837055c`, `dilithium-seal` `233b0e7`,
`vrf-gate` `25e562c` (mine); `drbg-arena` `2606580`, `dkg-gate` `a1b6dec`, `encrochat`
`1c07899`, `envelope-kms` `ca23ff2`.

**Verified closed by re-running both detectors fleet-wide:** zero live chained builders remain;
every `expectNoNewNonTextFailures` now runs from `scan()` (via a soft wrapper whose call site
I confirmed individually, since the wrapper made my own detector report a false positive).

**The precise scope of the blindness, measured:** `withTags(TAGS)` selects **69 of axe-core
4.12's 105 rule definitions**; the chained form ran **4**.

**The liveness proof was designed not to be vacuous.** The agent deliberately did *not* use a
second `role="main"` — `landmark-one-main` was one of the four rules the broken form already
ran, so it would have proved nothing. It used `<html lang="en">` → `<html>` instead, and the
control experiment is unambiguous: identical page, identical drive, **old form 1 passed / new
form 1 failed on `html-has-lang`**, in all four repos. Separately, all four late-state colour
mutations were caught by axe's own `color-contrast` — itself WCAG-tagged — which is a second
independent proof the WCAG set is live.

**`dkg-gate` had no 1.4.11 coverage whatsoever**: it has no `auditControlBoundaries`, so
`nontext.ts` was its only non-text oracle, and that oracle never executed.

**Baselines recaptured** (they were empty because nothing had ever looked). Every one of these
repos now finds **exactly two findings, both in the shared top bar, and nothing else** —
everything inside `<main>`, the hero and the footer audit clean with no exemptions. Where the
two themes differ the **worse** figure is recorded, because the ratchet fires on
`ratio < baseline - 0.01`, so recording the dark number would fail every light run.

**The measurement was reproduced independently through the gate's own path:**
```
CHAINED withTags().withRules()  ->  4 rules
withTags() alone                -> 63 rules
withRules() alone               ->  4 rules
```
across ~26 / 48 / 32 scanned states per configuration × 4 configurations in those three repos.

**A negative result worth as much as the positives.** With 63 rules live, `downgrade-wire`,
`dp-noise` and `entropy-collapse` are **clean** — violations and `incomplete` both empty, both
themes, both widths. That is credible rather than suspicious: each had a prior honest-gate
pass that fixed its defects using the oracles that were **not** dead — the arithmetic contrast
walk, the non-text audit, reflow, scroller reachability. Only axe's WCAG ruleset was blind,
and it turns out to add nothing there. Checked explicitly: no `aria-label` on a role-less
container (dp-noise's `dl.stat-row` was the obvious candidate; axe does not flag it), no
`aria-required-children` on an empty list, and the control-border pattern already fixed in all
three.

**The proof of liveness was designed so it could not be faked**: each mutation triggered a rule
that is **not one of the four landmark rules** — `link-name` on an icon-only topbar link
(failing in exactly the 2 of 4 configurations where the text span is `display:none`, as the
CSS predicts) and `label` on two fields. The old chained form provably could not have seen
any of them.

**Two process notes worth carrying into every future mutation:**
- **The CSS specificity trap mimics a dead gate.** A `.exit__revisit { color: … }` mutation at
  (0,1,0) was beaten by `.verdict__body p` at (0,2,1); the element kept its original computed
  colour and the gate correctly stayed green. **Probing the live page for the computed value
  is what distinguishes "the oracle is blind" from "the mutation never applied."** I hit the
  same class myself in padding-oracle, where an added `position: static` was overridden by a
  later declaration in the same rule.
- **Check the built bundle, not the source.** One `sed` hit the wrong line and silently
  no-oped; a `grep` on `dist/assets/*.css` caught it.

### THE `.cl-btn` DECISION — settled fleet-wide, with the full distribution (2026-08-12)

**Measured across every lab using the shipped `38%` mix: 156 labs, and ALL 156 fail 3:1.**
Median **2.34:1**, best **2.91:1**, worst **1.20:1** (`downgrade-wire`, accent `#9f1239`).
Zero labs pass. The sweep had been baselining 2.45:1 from the teal-fallback labs; labs that
define a dark `--accent` at `:root` are **materially worse** — `blind-hello` 1.27,
`spake-gate` 1.29, `blind-relay` 1.29, `frozen-heart` 1.29, `nonce-collision` 1.29.

**And no percentage can fix it.** The border is
`color-mix(in srgb, var(--accent) 38%, transparent)` over a bar that is always `#0b1512`:

| | |
|---|---|
| ceiling of the shipped design (pure white as the accent, 38%) | **3.57:1** |
| mix needed with pure white | 34% |
| mix needed with the fleet teal `#35d6bb` | 46% |
| mix needed with indigo `#4338ca` | **impossible at any percentage** |
| mix needed with crimson `#9f1239` | **impossible at any percentage** |

For the dark accents, *even 100% of the accent* does not reach 3:1 against the bar — the
accent itself is too dark. **So the earlier "38% → 52%" patch could not have worked fleet-wide
no matter what number was chosen.** That is the whole argument in one line: the parameter was
never the problem.

**`--cl-ink` at 70% is the fix, and it works because `--cl-ink` is the accent already mixed
toward the header's near-white ink** — it inherits the lab's hue while being guaranteed
readable on the bar:

| | measured on the bar |
|---|---|
| teal-derived `--cl-ink` at 70% | **6.92:1** |
| indigo-derived `--cl-ink` at 70% | **3.57:1** |

Applied and verified in `dilithium-reject` (2.45 → 3.84:1), `dilithium-seal` and `vrf-gate`.
**Recommendation for the deliberate fleet pass CLAUDE.md requires: replace the `--accent` mix
with `color-mix(in srgb, var(--cl-ink) 70%, transparent)` in all 156.** The remaining labs are
ratcheted at their current values, so none can silently get worse in the meantime.

#### Supporting detail — the six labs where the repaired ratchet first exposed it

This sat open for weeks as "160 labs on the original 38% form, 2 fixed one way, 1 fixed the
only form that generalises". The repaired 1.4.11 ratchets answered it, because every repo
where the oracle came alive found the same control failing at a **different** ratio:

| lab | `.cl-btn` / `#cl-theme-toggle` | why it differs |
|---|---|---|
| `drbg-arena` | 2.45:1 both themes | no `--accent`; fleet-teal fallback |
| `dilithium-reject` | 2.45:1 | same |
| `vrf-gate` | 2.45:1 | same |
| `envelope-kms` | 2.45:1 | `--accent` set on `.cl-hero`, never reaches the bar |
| `dilithium-seal` | 1.85:1 | `--accent: #9182f3` |
| `dkg-gate` | 1.93 dark / **1.59** light | `--accent` at `:root` |
| `encrochat` | 1.73 dark / **1.52** light | `--accent` at `:root` |

**The defect is the design, not the value.** `color-mix(in srgb, var(--accent) 38%, transparent)`
makes the ratio a function of each lab's accent against a bar that is always `#0b1512`. No
single percentage can fix it fleet-wide — which is exactly why the earlier "38% → 52%" patch
worked in the lab it was measured in and left every other lab broken.

**The form that generalises is `color-mix(in srgb, var(--cl-ink) 70%, transparent)`** —
accent-independent, because `--cl-ink` is the header's own ink and is already required to be
readable on that bar. Now applied and measured in `dilithium-reject` (2.45 → 3.84:1),
`dilithium-seal` and `vrf-gate`. The remaining labs are ratcheted rather than fixed, and per
CLAUDE.md the shared markup is a deliberate reviewed fleet pass — **this is the evidence for
that pass, and the recommendation is the `--cl-ink` form.**

**pake-gate `b65e1c1` — 5 defects.**
- **The breach panel asserted a property of the empty set.** "Server breach" is reachable in
  **two clicks from first paint, without running a handshake** — the scan then reads **0 wire
  fields** while printing `candidates tested: 10`, ten *"not present on the wire — no offline
  test exists"* rows, and the verdict *"Nothing resolved offline"*. Its left column also
  called an SRP transcript *"A captured balanced-PAKE transcript"*. **The existing test ran
  `Honest run` first and only checked the scan came back clean — so it met neither state.**
- ***"at billions of candidates per GPU-day"* traced to nothing.** Measured on the lab's own
  engine: one candidate is a 4096-bit modexp with a 256-bit exponent at **3.4 ms — 291/sec,
  2.5×10⁷/day.** Roughly five orders of magnitude out. The verdict now reports the rate
  measured from the grind that just ran.
- ***"The fixed-work variant is flat" could not fail.*** `fixedWork()` never ran a fixed-work
  loop — it called the early-exit counter and returned `modeledIterations: cap` as a literal,
  so **the panel line, the unit test and the browser test all compared a constant with
  itself.**
- Three wire captions named the wrong construction (SRP's `M1` is a hash, not a MAC; CPace's
  tag covers that party's own `Y‖AD`, not the transcript; J-PAKE's tag is keyed, not computed
  over the key), and `dragonfly.ts` advertised *"the ACCURATE RFC 7664 derivation"* while its
  own inline comment recorded a deviation.

**mceliece-gate `66bdf67` — 6 defects, the headline one established by complete census.**
- **The over-radius decapsulation output asserted four false things** — and this is the
  panel's headline lesson. Census of **all 143,360** `(codeword, weight-3)` states the
  "Exceed correction radius" button can produce: **57.1% (81,920) do not decode at all**, yet
  the page called the result a *"Corrected codeword"* and a *"Recovered message"*; the other
  **42.9% (61,440) do decode — onto a different codeword** — where the badge said *"Decoding
  failed"*. Both branches now read `trace.success`, **which the code already computed and
  threw away.** Nothing tested it: the e2e and jsdom tests both stop at the weight readout
  without pressing Decapsulate.
- **A documented failure message that was unreachable**: census over all **2^16 = 65,536**
  received vectors — `pattersonDecode` throws **0** times.
- ***"An attacker cannot"*** — refuted by step 3 of the same panel, where the brute-force
  attacker wins **30,720 of 30,720** distance-2 ciphertexts.
- **The key-size bars announced their drawing floor as their measurement.** 5 of 6 KEM bars
  are under 1% (0.306%–0.861%) and all five announced an identical *"2% of maximum"* —
  ML-KEM-512 (800 B) and HQC-128 (2,249 B) claiming the same size **in the chart whose only
  job is relative scale**; RSA-2048's 0.113% was overstated **17.7×**.

That last one is **the grover class recurring**: a visibility floor printed as if it were the
measurement. In grover the floored bar contradicted a caption promising the axis was to
scale; here the floor is *spoken aloud* as a percentage. Worth watching for wherever a chart
has a minimum bar size.

**Cleared by complete census, not sampling:** mceliece-gate's security boundary holds
absolutely — **0 of 143,360** weight-(t+1) states decode back to the sent codeword, true
minimum distance 5, and Patterson corrects all **35,072** within-radius vectors with 0
failures. pake-gate's Dragonblood candidates genuinely vary (a random 6-list would look that
uniform only 34/2000 of the time).

**The agent caught its own blind test**: its first regression for the fixed-work defect
**did not bite** — it re-ran the scan instead of observing `fixedWork`'s output, so reverting
both halves cancelled out. It surfaced `iterationsPerformed` and re-verified. That is the
"two independently sufficient halves" trap in a new form.

**Two coordination errors of mine, both corrected:** I **double-assigned mceliece-gate** to
this audit and to a running a11y agent, and the agent committed to a branch while every other
repo this session is on `main`. Both repos were fast-forwarded onto `main` (the claims commit
was a descendant, so no file changed) and the a11y agent's six in-flight files were left
untouched.

### Task 14 batches 2026-08-12 — 12 repos, ~40 defects

`world-ciphers` `ca0a0a3` · `world-hashes` `4df6879` · `signed-bytes` `b5d19e4` ·
`vigenere-break` `be9c0c8` · `search-vault` `2ed380c` · `ring-sign` `2e5cc27` ·
`spdz-forge` `0bdfd0a` · `time-trust` `a0b3fd0` · `traitor-trace` `5eca986` ·
`hybrid-wire` `b913b27` · plus `mceliece-gate` `6fcdaa0`, `pq-families` `b4520a3`,
`protocol-checker` `9b509ab`, `protocol-compose` `ede1a85`, `quantum-entropy` `ec95c1c`,
`pq-tls-handshake` `8ff994e`.

**The self-confirming 1.4.11 spec is now 14 for 14** — every repo whose old border-contrast
check queried a narrow selector had that selector be exactly the set the correct token was
already applied to. `traitor-trace` is the sharpest: its `style.css` **states the defect in a
comment** ("--border measured 1.70:1 at best") and then scopes the fix to 2 of 23 uses.

**Defects worth remembering from this run:**
- A toggle whose segments had `border: none` and a fill identical to the card — **1.00:1**,
  i.e. no boundary at all (`vigenere-break`).
- `#app button:hover { filter: brightness(1.12) }` repainted the fill and dropped its own
  white ink to **4.13:1**. **A CSS filter is applied after every property axe and the
  arithmetic walk read, so no oracle sees it** — measured from screenshot pixels (`spdz-forge`).
- `ring-sign` scrolled to 441px at 380px. The checker named `header.cl-hero` (433px) whose
  **min-content is 136px**; the real cause was a `white-space: nowrap` status line three
  panels down giving a bare `auto` track a 405px floor. **Fifth time the checker named the
  wrong element.**
- `time-trust`'s overflow was **intermittent**: a 40-hex TOTP secret is random per load, so
  the overflow ranged 0–10px and a once-at-one-width gate could pass on a narrow draw.
- `traitor-trace` never received the `box-sizing` reset its siblings have — 403px at 380px,
  every state. `signed-bytes` had the same gap (401px), its only `border-box` being inside a
  textarea rule.
- `search-vault`'s light theme overrode ten tokens and left `--accent` at the dark value:
  **2.49:1 on white**. Fixed with a separate `--accent-solid` rather than by darkening
  `--accent`, **because the shared top bar reads `--accent`** — darkening it would have taken
  the bar's own edge from 2.09 to 1.48. Same trap avoided in `traitor-trace` and
  `pq-families`.

**A false positive an agent caused, caught, and killed** — worth more than several fixes:
Chromium applies `:focus-visible` **styling** only after a keyboard interaction, while
`Element.matches(':focus-visible')` returns true regardless. So an unprimed programmatic
`focus()` reports "no focus indicator" for elements that have one — **one phantom defect per
focusable region, in every repo of this sweep**. The agent primed with a real Tab, verified
against 43 actual key presses, and fixed its oracle. I swept the fleet afterwards: exactly one
file uses `matches(':focus-visible')` and it primes correctly, so nothing shipped on a
phantom. (That answer took three rounds of tightening my detector — it first matched comments,
then matched `outlineWidth` in the non-text oracle, which measures a ring's contrast rather
than probing focus.)

**Two more process traps recorded:**
- A **stale detached `vite preview` produced a false RED**: post-revert, a suite ran against a
  `dist` still containing the mutation because `reuseExistingServer` reused it. Check `lsof`
  before trusting a post-mutation result *either way*.
- **Copied helper docblocks carry stale claims two levels deep** — one repo's `contrast.ts`
  header described `filter: brightness(1.12)` and `--accent-hover`, CSS that repo does not
  have, inherited from the lab it was copied from. When copying `contrast.ts`/`nontext.ts`
  forward, grep the destination for the *source* lab's selectors.

**An oracle can also over-claim.** Twice in `traitor-trace` the graphics check demanded 3:1
where the design carries the cue another way (a tinted cover-subset under an outline; probe
cells distinguished by glyph and border style). Both were corrected to measure the cue that
exists, with the reasoning recorded in `gate.ts` rather than the check silently dropped. The
same instinct fixed `hybrid-wire`, where the contrast oracle judged every gradient at its
worst *stop* — inventing a backdrop the footer text never sits on (accent links read 3.56:1
where they render ~4.9:1). Gradients are now sampled at the text's real position. **A gate
that cries wolf gets ignored, which is its own failure mode.**

**Open, needs your judgement:** `vigenere-break/e2e/claims.spec.ts` has **8 failures on
pristine `main`**, proven pre-existing in a HEAD worktree. Five are unambiguous test bugs (an
unscoped `.strip .cell`; a `[role="status"]` strict-mode collision; `/^.?Score/` where the
emoji is a surrogate **pair**). Three need cryptanalytic judgement: a χ²-argmin compared
against rounded option text, an OTP-boundary IoC bound of 0.058 receiving 0.0641, and
`renderCounters` preferring "too short" over "mostly non-letters". Left alone rather than
guessed.

### A third oracle bug — fabricated, not merely blind (2026-08-12)

`auditControlBoundaries` reads only `backgroundColor`. On a gradient-filled control that
property is transparent, so the check **reported a flat 1:1 for every gradient button and
resolved every backdrop to WHITE** — fabricating measurements rather than missing them.

**Scope, checked before alarm: 17 repos contain it, and ZERO rely on it alone.** Every one
also runs `nontext.ts`, whose paint core samples gradients properly and covers the same
control set. So the flawed check is redundant rather than load-bearing, and nothing was hidden
by it. Its one good idea — *a border must clear 3:1 against the control's own fill, not just
against the surround* — was merged into `nontext.ts` where the paint core is correct.

That is now **three distinct oracle defects** found in this sweep, and they fail in three
different directions:
| oracle | failure | consequence |
|---|---|---|
| axe chained `withTags().withRules()` | ran 4 rules, not 63 | **under-measured** — green meant nothing |
| `expectNoNewNonTextFailures` behind an early return | never executed | **under-measured** — baseline captured blind |
| `auditControlBoundaries` on gradients | flat 1:1, backdrop white | **fabricated** — right answer by accident, or wrong |
| (plus) contrast oracle judging gradients at their worst stop | invented backdrops | **over-measured** — would drive fixes to text that was fine |

**The lesson is not "oracles are unreliable" but "an oracle is a claim, and claims get
checked."** Every one of these was found by making the oracle fail on purpose, and every one
had been quietly shaping conclusions before that.

### NEW CLASS — an id-scoped type selector silently killing class rules

`salamander` had `#app p { color: var(--text) }`. Specificity **(1,0,1)**, which beats *any*
class rule on a `<p>` — so **eleven declarations were dead**, including both verdict inks
(`--alarm-text`, `--ok-text`) and the whole muted hierarchy. Rules written `#app .foo` (1,1,0)
survived, which is exactly what hid the damage. The rule was also redundant, since `body`
already set the same colour. Deleted; the eleven declarations came alive; a re-run of the full
four-configuration collection then found **zero** further findings.

**Why no oracle catches this: it fails SAFE.** Every affected element renders in the
high-contrast default colour, so a contrast walk sees nothing wrong. Only a computed-value
probe — "is the colour this rule specifies actually the colour being painted?" — can see it.
That makes it the first defect class in this sweep that is invisible to *both* axe and the
arithmetic oracle by construction, rather than by an oracle bug.

A sharp detail from the same repo: the agent's mutation target for proving the gate bites
**only existed because of this defect** — before the specificity fix that declaration was dead,
so mutating it would have proved nothing.

**Fleet scan: 55 id-scoped type selectors setting `color`, across 41 repos.** Most are
`#app a`, a deliberate uniform link colour, and harmless unless a class rule is fighting it.
**The subset worth opening is the non-link cases**, where the same shape as salamander is
possible: `#app p` in `frozen-heart`, `quantum-entropy`, `spake-gate`; `#app h5` in
`blind-hello`; `#app h4` in `reshare-circle`; `#app h1..h4` in `icy-dvrf`; `#qr-step-table th`
in `chacha20-stream`. **Not investigated — this is a scoped follow-up, not a finding.**

Also from that batch: **`salamander` has no retired header markers** — `index.html` and
`style.css` both already say in prose that the lab owns its header and that the
`reapply-header.py` push was retired. Task 15's list of five can drop it.

### The control-token pattern, quantified — 74 candidates (NOT 74 defects)

Three agents in a row reported the same shape independently: *a token defined "for control
boundaries", with a comment saying so, applied to exactly one control* — usually the text
inputs, which is also exactly what the repo's own 1.4.11 spec queried.

Measured across the fleet: **116 labs define such a token** (`--border-strong`,
`--control-border`, `--line-control`, `--line-strong`); in **74** of them the token is used
**≤3 times** while the surface-divider token is used **≥6 times**.

**That is a candidate list, not a defect count, and the distinction matters.** One usage can
legitimately cover every control if it sits on a base `button, input, select, textarea` rule.
I spot-checked three before reporting:

| lab | its single usage | verdict |
|---|---|---|
| `vdf` | `input[type="text"], input[type="number"]` | **the exact pattern** — text inputs only |
| `quantum-entropy` | `#app button.secondary` | recently fixed by other means; count is misleading |
| `pq-tls-handshake` | `.chip` | same — fixed in this sweep, low count regardless |

So the metric cannot distinguish "narrow and broken" from "fixed a different way". Use it to
**prioritise** the remaining task-14 repos — a lab with a one-selector control token is worth
opening first — and measure per repo rather than trusting the count.

Confirmed instances so far, each measured: `lattice-gentle`, `lll-break`, `matsui-line`,
`musig-gate`, `nonce-collision`, `ntru-classic`, `dilithium-seal`, `vrf-gate`,
`mceliece-gate`, `pq-families`, `protocol-checker` — **eleven**, and every one of them also
had a border-contrast spec that queried precisely the selectors the token was already on.

### Audit of the auditors — three more checks, all clean

After finding two dead oracles in the reference gate, I swept the other ways a gate can fail
to measure. All three come back clean across the **102 honest gates**, which is worth
recording so the next person does not re-derive them:

| check | result |
|---|---|
| gates that audit far fewer states than they drive (the "scan once, after the drive" antipattern) | **0** |
| gates with no per-state audit function at all | **0** |
| gates that assert `violations` but ignore axe's `incomplete` bucket | **0 of 102** |

The one candidate for the first check was a false positive I verified before reporting:
`musig-gate`'s `analyzeAll()` is called once, but it is a helper *inside* `scan()`, and `scan()`
runs 52 times. **The "scan only after the drive" antipattern exists only in the old template
gates still in the task-14 queue** — not in any honest gate written by this sweep.

That `incomplete` result matters: it is the bucket where `aria-prohibited-attr` and
`aria-required-children` are reported, and a violations-only gate is blind to the single most
common ARIA defect in this fleet.

### Other patterns from the same batch, worth a fleet grep

- **A base component block placed BELOW its same-specificity modifiers silently kills them.**
  Five dead rules in `musig-gate`, one of which meant the selected prediction rendered
  identically to the unselected ones — with no ARIA state either.
- **A bare single-column `display: grid`** is an implicit `auto` track with a min-content
  floor. It cost two repos a reflow failure, and **in both the checker named the wrong
  element** — `ntru-classic` scrolled to **1903px at a 1280px viewport** while the checker
  pointed at `header.cl-hero`, merely the widest thing in a track something else stretched.
- **`flex: 0 0 auto` with an `auto` basis is max-content that refuses to shrink.**
- **All three labs in one batch put their control edge on the surface-divider token while
  defining a correct control-border token and applying it only to text inputs** — and in all
  three the old 1.4.11 check queried exactly those inputs. That is now **six** repos.
- **A scripted `el.focus()` cannot measure 2.4.7.** Chromium applies `:focus-visible` styling
  only for keyboard-originated focus, while `Element.matches(':focus-visible')` returns true
  regardless — so a programmatic probe reports "no focus indicator" for elements that have
  one. Any gate checking focus rings must press Tab.
- **`label-content-name-mismatch` is `experimental`**, so a default axe run never executes
  SC 2.5.3 at all.
- **A `::before` with `content: ''` *and a background* is a drawn graphic** under 1.4.11 that
  the standard generated-content check skips as "empty" — that is how a toggle knob hid.
- **`ntru-classic` has no light theme at all** — `style.css` has no `[data-theme]` selector,
  so `data-theme` is written by the shared bar and read by nothing, and the toggle is a dead
  control. The gate previously scanned the same rendering twice under two names. `boot()` now
  asserts the single palette so the day a light theme lands the gate fails until measured.
  **Needs a decision: implementing it means re-picking ~40 hex values plus canvas colours.**
- **Never revert a mutation with `git checkout -- <file>`** — one agent's mutation script
  silently reverted all of a repo's real CSS fixes. Use file copies.

### The empirical result of recommendation 2

Five detectors, each validated against a known answer, each returning ~zero across the fleet:

| detector | fleet candidates | real |
|---|---|---|
| shipped default contradicts the code's own fallback | 0 | 0 |
| batch runner disabled by its own re-entrancy guard | 0 | 0 |
| printed difference that can go negative | 11 | 0 |
| floored/clamped display dimension + a to-scale claim | 25+ → 1 | 1 (grover) |
| verdict panel written but never cleared on reset | 45 → 1 | 0 |

**Mechanical detection does not scale for this defect class.** Both real hauls — shor's five
and grover's five — came from reading a lab and driving it, not from a grep. That is the
finding, and it sets the shape of the rest of the sweep: audit labs one at a time, and treat
detectors as a way to *clear* ground cheaply rather than to find defects.

Three greps in this stretch answered the wrong question, all in the same way — **a silent
failure reads exactly like a clean result**:
- `--include=*.ts` unquoted, so zsh globbed it before grep saw it → empty sweep.
- `xargs -a file` does not exist on BSD/macOS xargs; the run failed and `2>/dev/null`
  swallowed the error → "0 findings". Same failure mode as the survey that silently lost 16
  repos. **Do not silence stderr on a diagnostic run.**
- The first stale-panel regex required the element lookup and the write in one expression;
  the fleet's dominant idiom caches the element in a `const`, so it found nothing on the
  known answer. Always run a new detector against a known positive *first*.

**Four techniques carried forward into the brief** — they are what did the work:
- Quantify how often the bad branch is taken by running the lab's own engine headless in
  node. "53 of 720" is a shipped defect; "theoretically reachable" is an argument.
- Pin `crypto.getRandomValues` to zeros to make a rare state deterministic and testable.
- Assert an **invariant between two rendered things** (count of success banners == count of
  crowned rows), not a string. It survives copy edits and catches the whole class.
- Drive **transitions** — Reset, then a second run with different input — not just states.
  That is where the written-but-never-cleared class hides, and it is invisible otherwise.

### Task 15 — CLOSED, and it was already done (2026-08-09)

The record said five labs still carried live `BEGIN/END crypto-lab shared header` markers, one
pointing contributors at retired tooling. **A fleet grep for the actual harmful framing — the
markers themselves, and any "managed / do not edit / re-run reapply-header" instruction — returns
nothing.** The surviving mentions in salamander and stream-ward are the *corrected* prose
("THIS LAB OWNS IT … the fleet-wide push was retired"), which names the tooling only to say it is
gone. 14 files reference it in that same corrected sense. Closed by checking rather than by doing.

### The first three oracle bugs — fixed and re-verified 2026-08-09

Backported to **70 repos** and pushed. 63 of the current lineage took both fixes; **7 older-lineage
repos** (bike-vault · curve448 · dead-sea-cipher · e91 · enigma-forge · format-ward ·
harvest-vault) have a 190–291-line `contrast.ts` predating the `paintAt`/canvas machinery, so they
took the `.sr-only` fix only — applied **independently rather than all-or-nothing**, so they got
the fix that applies to them instead of neither. 8 repos have a `contrast.ts` with no gate; they
are in the task-14 queue and get replaced wholesale.

Chose the **narrower** `.sr-only` fix of the two offered: skip only elements whose own
`clip`/`clip-path` reduces them to ZERO area, so a genuine partial clip is still measured.

**Re-verified: 68 gates green.** The 3 that did not run were not gate failures — my patch had a
strict-mode type error (`const [top,right,bottom,left] = nums` on a `number[]` yields
`number | undefined` under `noUncheckedIndexedAccess`), and in the repos whose build typechecks
the e2e tree the `npm run build &&` in `webServer.command` **correctly refused to serve a stale
bundle**. That guard, added earlier in this sweep for exactly this reason, did its job. Tuple-typed
and re-swept: every patched repo that typechecks now compiles clean.

**A SIXTH tooling error, and the most instructive one.** The first re-verification run reported
**70 of 70 failing**. That is not a finding, it is a signature — a 100% failure rate means the
harness, not the subject. `timeout` does not exist on macOS, so every invocation died before
Playwright started and was recorded as FAIL. One repo run by hand passed in 19.6s and named the
cause immediately.

**The rule this sweep has now earned six times over: validate the instrument against a known
answer before believing its output.** It has caught a mis-scoped oracle fix (a grep said 2 repos,
the truth was 12), an over-counted theme bug (6 vs 2), a queue defined by a glob that matched the
expected filename rather than all filenames, a grep that detected the fix rather than the defect,
a `box-sizing` claim from a grep that searched the wrong file, and now a phantom 70-repo
regression. Every one was caught by checking the tool against a case whose answer was already
known — never by reading the tool's code.

### Theme persistence — **2 repos, BOTH FIXED 2026-08-09**

`index.html`'s anti-flash script has to read the same localStorage key the *reachable* toggle
writes. Each lab's own toggle is hidden by the shared header's CSS
(`body :is(#theme-toggle,…):not(#cl-theme-toggle){display:none!important}`), so the header's is
the only one a visitor can press, and it writes `'theme'`.

- **bitcoin-wallet** read `'crypto-lab-theme'`, which nothing writes. Fixed in `378495b`.
- **opaque-gate** read `'cv-theme'` only. Fixed in `9809866`, and measured both ways against the
  built site: before `{afterToggle: "light", afterReload: "dark", persists: false}`, after
  `afterReload: "light"`.

**I over-counted this at first and the correction matters more than the finding.** A grep for
reader keys said six repos were broken. Four were not: ckks-lab, harvest-vault and model-breach
all read `getItem('theme') || getItem('<legacy>')` — `'theme'` FIRST, with the old key as a
fallback — and webauthn's header script was customised to write `'crypto-lab-theme'`, matching
its reader. **A grep that reads one side of a contract cannot tell you the contract is broken.**
Check the writer, the reader, AND which control is reachable, per repo. Same family as the two
earlier queue errors: a grep that detected the fix rather than the defect, and a glob that
covered the expected filename rather than all of them.

Found only because an honest gate sets the theme via `localStorage` instead of by clicking, so a
key mismatch becomes a hard failure instead of a silent one.

### 14. Replace the remaining template a11y gates — `TODO` — **79 repos, REGENERATED 2026-08-08**

The list this file carried (~110) was stale. Regenerated from disk by scanning **all**
`e2e/*.spec.ts` for an `addStyleTag` that suppresses motion:

```
find . -maxdepth 4 -name "*.spec.ts" -path "*e2e*" -not -path "*/node_modules/*" | while read f; do
  body=$(grep -vE '^\s*(//|\*|/\*)' "$f")
  echo "$body" | grep -qE 'addStyleTag' || continue
  echo "$body" | grep -qE 'transition: *none|transition-duration: *0|animation: *none|animation-duration: *0' && echo "$f"
done
```

**83 files across 81 repos**, of which **79 are `a11y.spec.ts` in a repo with no honest gate** —
one of those 79 is **`DeckBook`, which is NOT a crypto-lab repo** — it is a separate project that
the filesystem scan swept in. It carries the same template gate and the same defect, but it is
outside this fleet's scope; **flagged for the maintainer, not worked here. The crypto-lab queue
is therefore 78.** —
i.e. the old template gate, entire. The injection is the *marker*, not the whole defect: these
specs are also violations-only, single-theme, single-viewport, and most `revealAll()` or scan
once at the end. The work per repo is the same as the closed queue: replace the spec with an
honest gate and fix what it finds.

**How motion injection differs from the opacity one.** Opacity FABRICATES contrast results.
Motion suppression HIDES one specific class of defect — an element whose only route to its
visible state is an animation, in a stylesheet whose reduced-motion block cancels that animation
without restoring its end state. `emulateMedia({reducedMotion: 'reduce'})` plus an
`expectNotBlank` assertion is what catches it; a style tag cannot, because it bypasses the lab's
own `@media` block instead of exercising it.

The 79:

 accumulator · aes-modes · beacon-lock · bitcoin-wallet · blind-hello
blind-relay · card-trick · chacha20-stream · chain-of-trust · corrupted-oracle
credential-veil · dilithium-reject · dilithium-seal · dkg-gate · downgrade-wire · dp-noise
drbg-arena · encrochat · entropy-collapse · falcon-seal · frozen-heart · ghost-commit
harvest-timeline · hpke-envelope · hybrid-sign · icy-dvrf · iron-letter · isogeny-atlas
kdf-arena · kdf-chain · kem-trap · key-mirror · lattice-gentle · lll-break · matsui-line
mayo-seal · mceliece-gate · multivariate · musig-gate · noise-pipe · nonce-collision
nonce-guard · ntru-classic · padding-oracle · pake-gate · patron-shield · phantom-vault
power-trace · pq-families · pq-tls-handshake · protocol-checker · protocol-compose
quantum-entropy · quantum-vault-kpqc/web-demo · ratchet-wire/ratchet-wire · reshare-circle
ring-sign · rsa-educational · rsa-forge · salamander · schnorr-forge · scloud-vault
search-vault · shadow-vault · signed-bytes · simon-period · spake-gate · spdz-forge
stark-tower · stream-ward · time-trust · timing-oracle · timing-sidechannel · traitor-trace
vigenere-break · world-ciphers · world-hashes · x3dh-wire

**Four non-`a11y` specs also inject** and are a separate, smaller shape — a functional suite
suppressing animation for flake control. Two are DONE: paillier-gate `e2e/exhibits.spec.ts`
(`b95131a`) and silent-tally `e2e/claims.spec.ts` (`1a5d28d`), both switched to
`emulateMedia` + an in-page assertion, which is strictly better because it exercises the lab's
own reduced-motion block rather than bypassing it, and fails if that block stops working. Still
open: `matsui-line/e2e/visual.spec.ts` and `simon-period/e2e/claims.spec.ts`.

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
| **MIT LICENSE** | **DONE 2026-08-04** — 177/177. 157 added, 20 already had one, 0 failed. Verified: no commit touched anything but `LICENSE`, nothing unpushed. (Copyright holder briefly rewritten to "Systems Librarian" by Gemini 2026-08-05; reverted to "Paul Clark" fleet-wide 2026-08-06 — see cleanup queue (a) above.) |
| **Dependabot** | Config pushed fleet-wide by Gemini 2026-08-05 (ungrouped, no limit — bad). Decision taken 2026-08-06: regroup + auto-merge; blocked on PR-CI (below). |
| **PR-CI + auto-merge** | `TODO` (decided 2026-08-06) — the plan below. |
| **SHA-pinned Actions** | `TODO` — DECIDED 2026-08-06: do it, but LAST (after PR-CI + Dependabot auto-merge). Inventory: 907 tag-pinned refs, 41 already SHA-pinned. |

**SHA-pinning plan (decided 2026-08-06).** Rationale: mutable tags (`@v4`) let a compromised
action run with the deploy workflows' `pages: write` + OIDC `id-token` — the tj-actions/
changed-files compromise (Mar 2025) is the concrete precedent; only SHA-pinned users were
safe. Sequence it LAST because (1) it changes what CI runs, and once PR-CI exists each pin
change validates on a PR before hitting main; (2) the github-actions Dependabot ecosystem we
are enabling MAINTAINS the pins automatically (bumps SHA, keeps the `# v4` comment) — pinning
without it rots, pinning with it is the standard secure pattern, so Dependabot must land first.
Prioritize third-party actions (peaceiris, treosh, jetli, Swatinem, dtolnay, docker/*,
EmbarkStudios, github/codeql-action) — that is where the supply-chain risk and the tj-actions
precedent live; several are already partially SHA-pinned, so partly a finish-the-job. Method:
enumerate every `uses:` across the fleet, resolve tag→SHA via the GitHub API, rewrite as
`uses: owner/action@<sha> # <tag>` preserving the tag in a trailing comment; spot-check.
TWO NON-GOALS to avoid overreach: (a) pinning FREEZES each repo's CURRENT action version — it
does NOT unify the existing version drift (checkout v4/v5/v7, setup-node v4-v7); that is a
separate normalization grouped Dependabot drives over time. (b) `dtolnay/rust-toolchain@stable`
/`@nightly` are intentionally-floating toolchain selectors — pin the action CODE to a SHA but
confirm it still installs stable/nightly at runtime; per-action check, not a blind pin.

**PR-CI + auto-merge plan (decided 2026-08-06).** Goal: grouped weekly Dependabot with
patch/minor auto-merged once CI is green, majors held for review. Blocker: only 50/176 repos
run CI on `pull_request`; `deploy.yml` (131 repos) triggers on push-to-main + workflow_dispatch
only, so a Dependabot PR gets no checks on 126 repos. **DESIGN VALIDATED on enigma-forge 2026-08-06 — edit-in-place REJECTED, use a standalone
`pr-ci.yml`.** The validation proved the concept (PR runs build+test green; deploy job shows
`skipped` not failed; a real Dependabot PR went green under its read-only token; push-to-main
still deploys) BUT surfaced a fleet-breaking footgun: `deploy.yml` has a STATIC
`concurrency: { group: pages, cancel-in-progress: true }` shared by push AND pull_request, so a
PR run — every Dependabot dep bump — entering that group CANCELS an in-progress production
deploy (hit twice during validation). So editing deploy.yml in place is out. The enigma-forge
validation edit was reverted (`d01401d`). Confirmed: 0 repos have a bare-`vitest` test script
(all run-mode), so `npm test` is CI-safe fleet-wide.

Rollout design (per repo, standalone file — reasons: uniform check name for branch-protection
automation, `contents: read` only + no Pages steps so it CANNOT cancel a deploy, deploy.yml
untouched = zero risk to the deploy path):
  1. Add `.github/workflows/pr-ci.yml`:
       name: PR CI
       on: { pull_request: { branches: [main] } }
       permissions: { contents: read }
       jobs:
         pr-build:                         # uniform job name → uniform check "pr-build"
           runs-on: ubuntu-latest
           steps:
             - uses: actions/checkout@v4
             - uses: actions/setup-node@v4
               with: { node-version: 20, cache: npm }
             - run: npm ci
             - run: npm run typecheck --if-present
             - run: npm test --if-present
             - run: npm run build --if-present
             - run: npx playwright install --with-deps chromium
             - run: npm run test:a11y --if-present
             - run: npm run test:e2e --if-present
     Tailor: nested-package repos (biham-lens demos/biham-lens, collision-vault
     demos/collision-vault, ratchet-wire, quantum-vault-kpqc web-demo/) need a
     `defaults.run.working-directory` or `cd`; odd harnesses (stark-tower custom, vrf-gate
     `check`) need their script added. REFINEMENT: guard the playwright install so the ~16
     repos with no a11y/e2e script don't download a browser for nothing (`if:` on a
     playwright-config presence check).
  2. Regrouped `.github/dependabot.yml`: npm + github-actions, weekly, `groups: {"*"}` each,
     `open-pull-requests-limit: 3`.
  3. `.github/workflows/dependabot-auto-merge.yml`: on pull_request, if actor==dependabot[bot],
     fetch-metadata, and for semver-patch/minor `gh pr merge --auto --squash` (needs
     `permissions: { contents: write, pull-requests: write }`).
  4. Per repo via gh api: `allow_auto_merge=true`, and branch protection on main requiring the
     `pr-build` check with **enforce_admins=false** — so Dependabot PRs wait for green but
     direct admin pushes to main (the fleet's whole workflow) still land unblocked.
NEXT: validate the exact standalone pr-ci.yml on enigma-forge + one nested + one odd-script
repo with a throwaway PR each, THEN batch under the 3-4 agent cap, one file per commit per
repo, per-repo verified. High-stakes despite living in task 12 — not a mechanical sed pass.

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
