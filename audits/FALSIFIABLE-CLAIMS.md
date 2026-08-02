# Crypto Lab — falsifiable claims, reconstructed 2026-08-01

## Provenance

Reconstructed on 2026-08-01 from the Claude Code session transcript
`~/.claude/projects/-Users-gmcas-repos-crypto-lab/72054ee4-8e8a-446f-89dd-2b5d9dc97349.jsonl`
and its 187 subagent transcripts. Nothing here existed on disk. A "falsifiable claim" is the
session's own term: **the page asserts X while its own code does not-X.**

**Recovered: 189 claims across 68 repos.**

The session summary says "roughly 60", later "~78". Both figures are undercounts of what the
transcript actually contains. 78 = batch 2's 60 plus batch 3's 18. It excludes batch 1's 34
display-vs-reality findings and all 56 of batch 4's, because **batch 4's full report never
reached the main thread** — only a two-row correction did. See "What did not land" below.

**Known incomplete or uncertain:**

- Line numbers are as the reporting agent cited them and may have shifted since.
- Fix status is inferred from what the transcript states, not from inspecting the repos. Where
  a fix agent reported completion, that is recorded; nobody re-verified the working tree during
  this reconstruction.
- Several fix agents ran under a constraint worth knowing: `npm test` could not run anywhere in
  the fleet (win32/x64 rollup binaries on an arm64 Mac). Verification was vendored
  `tsc --noEmit` plus hand-built harnesses. Tests added by those agents typecheck but were not
  executed.
- The main thread stated it had personally verified only two of the claims it collected
  (`ssh-handshake`'s auth lab, and the `fhe-arena` / `entropy-collapse` divergences). Everything
  else rests on an agent's reading, each carrying a file:line citation.
- Claims that a repo is *clean* are recorded where stated but are not exhaustive.

## Counts

| Source | Claims | Reached the main thread? |
|---|--:|---|
| Batch 1 — hashes / MACs / KDFs / RNG (`ada8dfcbf97915247`) | 34 | Yes, 15:41 |
| Batch 2 — post-quantum (`aff82ddf8c014c6cf`) | 60 | Yes, 15:52 (8 minutes before close) |
| Batch 3 — protocols (`ae556a9f2afe088ce`) | 22 | Yes |
| Batch 4 — privacy / ZK / MPC (`a4640b7c4c7166a94`) | 49 in the main report, 7 more in its correction | **Only the 7 corrections** |
| Main thread, pre-batch | 19 | n/a (originated there) |

## Fix coverage

| | Repos | Claims |
|---|--:|--:|
| Fix agent dispatched and reported complete | 27 | 65 |
| Partial or mixed coverage | 5 | see per-repo notes |
| **No fix confirmation anywhere in the transcript** | 36 | 124 |

## What did not land — the actionable remainder

Two clusters were reported so late (or not at all) that no fix work followed.

**Batch 4 (privacy / ZK / MPC) — 49 claims, never delivered.** Its final report is present only
in `agent-a4640b7c4c7166a94.jsonl`. Searching the main transcript for its verdict strings
returns zero hits. The affected repos with no fix agent are:
`snark-arena` (6), `zk-proof-lab` (8), `shadow-vault` (7), `patron-shield` (5), `ring-sign` (3),
`oram-vault` (3), `stark-tower` (4), `credential-veil` (3), `oblivious-shelf` (3),
`search-vault` (2), `zk-arena` (1), `garbled-gate` (1), `dp-noise` (1), `bulletproofs` (1).

**Batch 2 (post-quantum) — 60 claims, delivered 8 minutes before close.** Three fix agents were
dispatched (`hawk`+`falcon-seal`, `bike-vault`, `isogeny-gate`), covering roughly 22 of the 60.
The remainder had no fix agent: `sphincs-ledger` (4), `frodo-vault` (4), `dilithium-seal` (4),
`multivariate` (5), `kyber-vault` (3), `hqc-vault` (3), `lms-xmss` (3), `mayo-seal` (3),
`mceliece-gate` (2), `lms-ledger` (2), `dilithium-reject` (2), `scloud-vault` (2),
`ntru-classic` (1).

**Batch 1 — 34 claims, one repo fixed.** Only `bcrypt-forge` (8 claims) got a fix agent.
`drbg-arena` (8), `corrupted-oracle` (7), `kdf-arena` (4), `mac-race` (2), `nonce-guard` (2),
`phantom-vault` (1), `kdf-chain` (1) and `aegis-gate` (1) did not.

## Claims by repo

### `aegis-gate`

**Fix status: FIXED.** `793d614` counts AES-GCM, AEGIS, and tied wins from the four measured
rows and explicitly limits the conclusion to this native-Web-Crypto versus TypeScript
implementation race. It also repairs the Vitest/Playwright test boundary. All 87 unit
tests, build, and dark/light accessibility tests pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch1#34` | `src/main.ts:917` — the benchmark's conclusion paragraph, including "GCM wins this browser race," is a fixed string appended regardless of measured throughput. (Low severity — the claim will hold in practice and the accompanying explanation is correct — but it is not derived from the run.) | (see claim text — the reporting agent gave both halves in one sentence) |

### `babel-hash`

**Fix status: fix agent reported complete.** Fix defects found in pedagogy pass (`a2445bb90a6f8f69d`)

Main thread confirms the hardcoded `verified: false` is now computed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | `src/crypto/hmac.ts:44-48` — `attemptLengthExtensionOnHMAC` returns `verified: false` | A literal, regardless of input. Harmless today because the UI calls real verification, but a hardcoded security verdict inside a function named "attempt". |

### `bcrypt-forge`

**Fix status: fix agent reported complete.** Fix bcrypt-forge fake exhibits (`a22206ae2690a5943`)

Main thread confirms: "cost 4 -> 624 real bcrypt compares in 0.5s, 8 of 9 cracked; cost 12 -> 60 compares in 12.2s, 2 of 9." Key schedule now takes 6ms of real work.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch1#5` | `src/exhibits.ts:191-194` — prints "the key schedule ran 2^cost = 16,384 rounds" after 40 `Math.random()` animation frames. No Blowfish executed. The "Round N of 16,384" counter (`:182`) is interpolated from the frame index. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#6` | `index.html:665-666` and `index.html:168` — "potentially weeks or months" / "weeks of attacker effort" vs the figure computed one line above at `src/exhibits.ts:975`: **6.9 hours**. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#7` | `src/exhibits.ts:920-931` — "Look Up in Rainbow Table" reveals `data-pw` on a 180 ms timer; no lookup structure exists in the repo. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#8` | `src/exhibits.ts:980-990` — "Attempted N of 100,000 dictionary words" derived from elapsed wall-clock; zero hashes attempted. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#9` | `src/exhibits.ts:973` — hardcoded `250` ms/hash fallback rendered as a measurement, while a real cost-12 timing is taken 20 lines earlier and discarded. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#10` | `index.html:364` vs `src/exhibits.ts:325` — ships showing "~100 ms" for cost 10; the JS lookup table says "~60 ms" for the same cost, and swaps in the moment the slider is touched. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#11` | `src/exhibits.ts:366` — cost-ratio bar clamps at 100%, so 8× and 16× render identically next to labels that differ by 2×. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#12` | `index.html:580-583` — pure-JS bcryptjs raced against native WebCrypto PBKDF2 (`src/crypto-worker.ts:44` vs `:62-69`), framed as an algorithm comparison with no implementation caveat. | (see claim text — the reporting agent gave both halves in one sentence) |

### `bike-vault`

**Fix status: fix agent reported complete.** Fix bike-vault BGF and numbers (`aa5dc6ef3f0c0be42`)

BGF genuinely implemented (BIKE spec Algorithm 1). Measured DFR 3.23% -> 0.57%, avg iterations 3.28 -> 1.52; the "before" figure independently reproduced the auditor’s 3.2%. 32 tests pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#3` | Black/Gray classification, "Flip both Black and Gray bits" — `crypto-lab-bike-vault/index.html:403-411`; Gray legend `src/decoderviz.ts:135`; docstring `src/bike.ts:363-368` | only `c[j] >= T` is ever flipped; Gray bits never flipped in any iteration — `src/bike.ts:455-460` |
| `batch2#13` | "error vector **e** of weight **t = 134**" — `index.html:396` | `SIM_T = 13` — `src/bike.ts:39`; live line below prints "Error vector weight: 13" — `src/main.ts:169` |
| `batch2#14` | "private rows have weight w/2 = **71**" — `index.html:188`, `:239`, `:328`, `src/circulant.ts:81` | `SIM_HALF_W = 7` — `src/bike.ts:40`; keyviz caption in the same card says "weight 7 each" — `src/keyviz.ts:63` |
| `batch2#15` | "We use **BIKE Level 1** parameters"; button "Generate BIKE Level 1 Keypair" — `index.html:274`, `:317` | r=587, w=14, t=13 — `src/bike.ts:37-39`; correction printed in the same panel — `src/main.ts:65` |
| `batch2#16` | "For BIKE Level 1, DFR < 2^−128" — `index.html:412`, `:511` | measured 16 failures in 500 round-trips at shipped params = 3.2% (≈2^−5) |
| `batch2#17` | key-size bar chart, McEliece `--bar-pct: 100%` vs BIKE 25% — `index.html:350`, `:371` | printed byte counts in the same rows are 1,541 vs 261,120 — a 169× ratio rendered as 4× |
| `batch2#18` | "threshold T recomputed each iteration from the live syndrome weight" — `src/bike.ts:371`; viz prints T per iteration — `src/decoderviz.ts:85` | slope divides by 12323 not 587 — `src/bike.ts:349-358`; T = 4 in all 500 measured runs |

### `blind-oracle`

**Fix status: fix agent reported complete.** (fixed inline, pre-batch)

Main thread reports fixed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | "Both tracks landed on the same number" | Printed unconditionally; the run shown was 300 vs 44. |

### `bulletproofs`

**Fix status: FIXED.** `b40e111` corrects the decimal Ristretto255 subgroup-order constant
in the source comment to match the already-correct hexadecimal value. The complete custom
test chain (including 47 proof tests and 8 UI accessibility assertions), build, and
dark/light Playwright accessibility tests pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#49` | `ℓ = 2^252 + 27742317777884353535851937790883648493` — `src/crypto/scalar.ts:3` | Correct value is `…777372…`. The hex constant on line 10 is right, so nothing computes wrong; source-comment only, not displayed. |

### `chain-of-trust`

**Fix status: FIXED.** `d76cdd0` adds an UNKNOWN verdict for otherwise-valid imported
chains whose revocation check was not evaluated, while real failures still take precedence
as REJECT. All 78 unit tests, build, browser assertions, and dark/light/mobile accessibility
tests pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch3#15` | NOT-EVALUATED revocation counts toward ACCEPT.** `src/pki/validate.ts:328` `ok: true` is the `revocationSource === 'not-evaluated'` branch. Honest in the detail text, but the top-line verdict still reads ACCEPT; a third `UNKNOWN` state would be cleaner. | (see claim text — the reporting agent gave both halves in one sentence) |

### `collision-vault`

**Fix status: fix agent reported complete.** Fix bcrypt babel collision grover (`a2d8a315b2027a646`)

Repo was in that fix agent’s scope.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | Byte-map crafted-region drawn from `firstDiff + 128` | `compareTraces` already computes the exact block indices — the demo shows an estimate while holding the measurement. |

### `corrupted-oracle`

**Fix status: verified fixed on current `main` (2026-08-01), commit `49413a53`.** Fresh
source review confirmed all seven findings are covered. Verification after `npm ci`: 32
unit tests, production build, and dark/light Playwright accessibility checks all pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch1#21` | `src/ui/attack-theater.ts:122, 230-231` — "TOTAL COMPROMISE — All predictions matched" gated on a row count, not on the match results. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#22` | `src/ui/attack-theater.ts:124, 207` — "From a single intercepted output" contradicts the same panel's step 1 and `state-recovery.ts:43-51`, both of which require two blocks. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#23` | `src/ui/attack-theater.ts:207` — "Native code does this in well under a second," an unmeasured constant in the slot that held the measured elapsed/rate figure from `:197-199`. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#24` | `src/ui/panels.ts:125` vs `:266` — "real NIST constants" on the always-visible page; every generate and the attack use `DEMO_Q`. Disclosed only inside the About modal. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#25` | `src/ui/visualizer.ts:29-34` + `src/ui/panels.ts:234, 250, 273` — heatmap color chosen by panel identity, not by data, on a page whose thesis is that the streams are indistinguishable; plus a permanent all-dark bottom row on the Dual_EC grid from padding 30 bytes to 32 (`visualizer.ts:23-24`). | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#26` | `src/stats/nist-tests.ts:30-44, 152` — block-frequency p-value broken in the failing tail: χ² = 47,736 returns p = 1.000000 → PASS; all-zero input returns NaN, rendered as `p=NaN`. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#27` | `src/ui/panels.ts:767, 154` vs `src/algorithms/dual-ec-drbg.ts:4-5` — "NIST withdrew Dual_EC_DRBG in June 2014"; the repo's own source header correctly says removal landed in SP 800-90A Rev. 1, June 2015. | (see claim text — the reporting agent gave both halves in one sentence) |

### `credential-veil`

**Fix status: FIXED.** `d15e4e8` derives unlinkability and revocation verdicts from the
presentations.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#26` | "All 3 presentations verify … The signature bytes are 100% identical each time." — `main.ts:454` | `main.ts:447` calls `verifyEd25519` **once**; `:448–450` maps the same hex three times; `markCommonBytes(hex, [hex])` compares the string to itself. |
| `batch4#27` | "the wallet had to reveal the index" (status-list rejection) — `main.ts:668`, `index.html:290` | `CRED_INDEX = 17` is a module constant (`main.ts:612`); the presentation at `:657` contains no index; `verifyPresentation` never sees it. The REJECT is `list.isRevoked(17)`. |
| `batch4#28` | "two showings of the same credential share nothing a verifier could correlate" — `index.html:184`, verdict at `main.ts:430` | `credential.ts:142–143` copies revealed values verbatim; all three presentations carry `Class: C`. `markCommonBytes` (`main.ts:375`) scans proof octets only. |

### `dilithium-reject`

**Fix status: FIXED.** `97ac062` replaces the fixed/stipulated check examples with values
from a fresh real instrumented ML-DSA-65 signing trace and explicitly distinguishes the
fixed ML-DSA-65 Sign/Step controls from separately labelled selected-preset histogram
traces. The repo passed lint, 79 unit tests, its production build, and three browser tests
including dark/light accessibility scans.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#45` | "Click a check for a **freshly sampled** example" — `crypto-lab-dilithium-reject/src/main.ts:208` | `const simulatedWeight = ML_DSA_65.omega + 3` — `src/main.ts:1010-1014`; `ct0` and `r0` also fixed expressions — `:999-1008` |
| `batch2#46` | panel labelled "Fixed at ML-DSA-65" — `src/main.ts:125` | bar click sends `state.currentPreset` — `src/main.ts:623` |

### `dilithium-seal`

**Fix status: FIXED.** `b8c4557` reports whether the toy signer actually accepted or hit
its safety cap, removes the unrelated real-ML-DSA average, disables repeated XOR tampering
until a fresh signature is made, and reports browser-specific Ed25519/ML-DSA ratios from
the benchmark results. All 20 tests, the production build, and four browser tests including
dark/light accessibility scans passed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#23` | "Rejected N oversized responses, **then accepted attempt 40**" — `crypto-lab-dilithium-seal/src/ui/viz-render.ts:102-109` | returns 40 rejects at the cap with no accept — `src/ui/fiat-shamir-viz.ts:103-121`. Measured: 3.52% of runs |
| `batch2#24` | "Real ML-DSA averages ~4-5 tries" — `src/ui/viz-render.ts:109` | toy params give mean 12.08 attempts — `src/ui/fiat-shamir-viz.ts:18-23` |
| `batch2#51` | "Signature tampered (1 byte flipped) — click Verify to see it fail" — `src/ui/tab1-sign-verify.ts:249` | `lastSignature[10] ^= 0xff` is self-inverse — `:247`; two presses restore the signature and Verify prints VERIFIED |
| `batch2#60` | "Ed25519 is typically 10-50× faster than ML-DSA" — `src/ui/tab2-compare.ts:73` | printed directly above the live measured ratio at `:170-179` with no reconciliation |

### `dp-noise`

**Fix status: FIXED.** `ac25d00` removes the stale numeric test total from the UI and README,
links the evidence card to the current deploy workflow, and adds a browser regression
against copied “N tests pass” claims. The current suite passed 239 tests across 18 files,
the production build, and nine browser tests including dark/light full-state WCAG scans.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#48` | "180 tests pass" — `index.html` scope card, "Real here" | Actual suite is **223 tests across 18 files** (run and confirmed). Stale in the safe direction, but it is a displayed number the repo contradicts. |

### `drbg-arena`

**Fix status: verified fixed on current `main` (2026-08-01), commit `f5c8b839`.** Fresh
source review confirmed all eight batch-1 findings and the CAVP-vector finding are covered.
Verification after `npm ci`: 29 unit tests, production build, and seven Playwright
behavior/accessibility checks all pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch1#13` | `src/ui/exhibit5.ts:114-116, 126-127` — claims the LCG grid shows "visible diagonal banding" and "your eye catches the LCG instantly." `:27` takes the **high** byte of the LCG (its good bits); the rendered stream is indistinguishable snow and passes all four of the demo's own tests. Verified empirically. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#14` | `src/ui/exhibit5.ts:292` — `announce('Statistical tests complete — all DRBGs pass...')` fires unconditionally, ignoring the `passed` flags just rendered. Same claim baked statically at `:142-143`. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#15` | `src/ui/exhibit5.ts:101-102` — prose says "All three bars sit at essentially 8.00 bits/byte"; the label beside it prints the real ~7.78-7.83 (a sample-size artifact, never explained). | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#16` | `src/stats/nist-tests.ts:202` — normalized Shannon entropy is stuffed into the `pValue` field and printed in the same column as three real p-values (`src/ui/exhibit5.ts:227`). | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#17` | `src/ui/exhibit2.ts:290` vs `:250` — `doAvalanche` updates `lastEntropy` but not `referenceOutput`; Flip-then-Same-Seed renders **"✗ N hex digits differ (unexpected)"** in the exhibit whose point is determinism. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#18` | `src/ui/exhibit3.ts:134-136` — learner entropy silently zero-padded to 48 bytes; typing `ff` yields 8 real bits presented as a full-strength instantiation. Undisclosed. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#19` | `src/ui/exhibit2.ts:243`, `src/ui/exhibit4.ts:129` — a fresh random nonce is injected on every Generate and never displayed, so fixed entropy yields different output — contradicting Exhibit 1's core claim. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#20` | `src/ui/exhibit3.ts:25, 88` — "Faster than HMAC_DRBG on hardware with AES-NI" and a "Speed: Fast (AES-NI)" table cell; nothing is timed, though both constructions run on the same click. | (see claim text — the reporting agent gave both halves in one sentence) |
| `main` | "Verified Against NIST CAVP Vectors" | One of the vectors existed in no NIST file. Real ones substituted. |

### `entropy-collapse`

**Fix status: fix agent reported complete.** Fix display-vs-reality defects (`abf9308786e518d88`)

Dispatched with both entropy-collapse items in the brief.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | `src/ui/entropyPanel.ts:159` reads out "2^64 possible seeds" | `makeVictim` (~line 76) clamps the secret to 2^31 for any stop at or above 31 bits, so the victim is never drawn from the advertised space. |
| `main` | `src/ui/forkPanel.ts:115` — the reseeded SAFE child is rendered with mode diff | Nearly all 32 bytes highlight, making the secure child visually the loudest of the three — the opposite of the lesson. |

### `envelope-kms`

**Fix status: fix agent reported complete.** Fix four mis-teaching claims (`a947c5417d92f2b70`)

Best fix design of the session: each of the five experiments got a weakened mode removing exactly the one defense it rests on, tagged real build / weakened build. Live observations: "balance: 42" came back "calance: 42"; integrity block d4600ab68ec7c502 instead of a6a6a6a6a6a6a6a6.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch3#10` | asserted test-vector coverage the page can never show.** `index.html:300-301` displays "RFC 3394 AES Key Wrap with byte-exact RFC test vectors". The vectors do run and do throw on mismatch (`rfc-vectors.ts:47-71`), but `app.ts:863` calls `runRfcVectors()` bare inside `bootstrap()` and `main.ts:7` awaits it with no catch — a KAT failure renders a **blank page**, not a failed-vector message. Related: `rfc-vectors.ts:43` declares the return type as the literal `{ok:true}`, so no caller can branch on failure, and `key-wrap.test.ts:9` asserts `toEqual({ok:true})` — a tautology. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch3#11` | dead "Property broken" affordance.** `src/ui/security-lab.ts:26-31` renders a "✕ Property broken" badge and `:44` promises "Watch the math refuse", but all five entries in `PROPERTY_CATALOG` (`properties.ts:275-310`) set `held:false` only if a real primitive breaks. The broken state is unreachable. | (see claim text — the reporting agent gave both halves in one sentence) |

### `falcon-seal`

**Fix status: fix agent reported complete.** Fix hawk and falcon-seal signing (`a268af9ed3efc7c93`)

Agent reported completion. Caveat it raised: falcon-seal’s vitest suite could not be executed in that environment.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#5` | "samples a short signature vector s **such that h·s ≈ c**" — `crypto-lab-falcon-seal/src/ui.ts:649`, tour `:1405`; quiz answer "only a holder of the short basis can produce s" marked correct `:455`, `:1411` | `s = gaussianSamplePoly(n)`; `c` is not an input and the private key is never read — `src/falcon.ts:214-224`, `:197-249` |
| `batch2#27` | "Public key h: **897 B** · private (f, g): **1281 B**" for the object just generated — `src/ui.ts:1017` | those are `publishedPublicKeyBytes` constants — `src/falcon.ts:28-29, 185, 191` |
| `batch2#28` | "this build uses the fixed **1,330-byte** padded format" — `src/ui.ts:1355`, `:822` | wrapper returns `CRYPTO_BYTES + sizeof(unsigned short)` = 1332, displayed live at `src/ui.ts:1348` |

### `frodo-vault`

**Fix status: FIXED.** `3113444` distinguishes the default toy error range from the
learner-controlled slider, describes the failure demo as scalar rather than n=4, centers
the ciphertext preview on the byte actually changed, and computes the public-key total
before displaying its checkmark. It also repairs the Vitest/Playwright test boundary. All
53 unit tests, production build, and dark/light accessibility tests pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#21` | "e ∈ {−1, 0, 1}" — `crypto-lab-frodo-vault/src/main.ts:546`, bridge row `:398` | slider `max="48"` — `src/main.ts:577`, sampled at `src/math.ts:161` |
| `batch2#22` | "toy decryption-failure demo (**n=4**, q=17)" — `src/main.ts:213`, rendered `:872` | `runFailureDemo` has no dimension — `src/main.ts:287-306` |
| `batch2#43` | tamper diff panel with nothing highlighted, under "Flipped one bit at byte 9231" — `src/main.ts:741`, `:1409` | flip index uniform over 15,744 bytes (`src/main.ts:1407`), diff renders only the first 64 (`src/math.ts:220-227`). ~99.6% of flips invisible |
| `batch2#44` | "`${params.publicKey}` bytes **✓**" — `src/main.ts:692`, `:695`, `:698` | prints the stored constant, not the computed sum; the tick verifies nothing |

### `garbled-gate`

**Fix status: FIXED.** `fcb4b14` labels the live garbled-table byte count as measured and
the classic four-row Free XOR comparison as a counterfactual estimate based on the run's
average row size. All 20 unit/UI tests, build, and dark/light accessibility tests pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#46` | "Measured on the last run: … (Free XOR saved ≈ N bytes vs. classic 4-row garbling)" — `main.ts:826` | `garbledBytes` is genuinely measured; `freeXorBytesSaved` (`yao.ts:686–687`) is `xorGates × 4 × avgRowBytes`, a counterfactual. Both are framed as measured. |

### `harvest-timeline`

**Fix status: fix agent reported complete.** Fix harvest-timeline (`a4cd51906b2fdc964`)

Main thread reports fixed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | A Print button | Never rendered in any browser. |

### `hawk`

**Fix status: fix agent reported complete.** Fix hawk and falcon-seal signing (`a268af9ed3efc7c93`)

Agent reported completion with vendored tsc clean and the verify-phase suite run. One leftover noted by the agent: `index.html:10` meta description still stale.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#1` | "the signer knew the secret short basis" — `crypto-lab-hawk/src/main.ts:1193`, `:1196`, `:1068` | signing uses only `polyMod2(f,g,F,G)`, which is published as `basisMod2` — `src/hawk.ts:386, 422-426, 446-447`. A public-key-only forgery verifies |
| `batch2#2` | "table lookup in two fixed CDTs" during signing — `src/main.ts:1449`, `:155`, `src/gaussian.ts:9` | `hawkSign` performs zero Gaussian draws — `src/hawk.ts:410-470` |
| `batch2#25` | "Signature bytes (measured)" beside "HAWK-512 target sig size 555 B"; "Public key (NIST-I) HAWK 1,024 B" — `src/main.ts:591-593`, `:152-153` | serializer produces 920 B and 14,336 B — `src/hawk.ts:737-754`, `:777-787` |
| `batch2#26` | "Rejection loop? Falcon: **No**" — `src/main.ts:156`, `:92` | `while (true)` rejection loop — `src/gaussian.ts:205-213`; the page's own Honesty Panel says "plus rejection sampler" at `src/main.ts:1076` |
| `batch2#52` | "Restart count" headline metric — `src/main.ts:578-581`, explained `:1485` | bound chosen so genuine norms stay well under it — `src/hawk.ts:341-344`; the loop at `:438-455` never restarts |

### `hqc-vault`

**Fix status: MIXED.**

The two main-thread claims (encryption equation, DFR=0) are reported fixed. A separate agent (`a34f9e99a7d370877`) fixed parameter sizes. The three batch-2 hqc-vault claims (#8, #9, #10) had no fix agent.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#8` | "Beyond roughly 15 flips the seed flips into nonsense" — `crypto-lab-hqc-vault/src/main.ts:196-199`, `:753-754` | flips spread over all 384 bits of `v` while only 120 are the codeword — `src/hqc.ts:410-436`. Measured at slider max 40: 81% still recover exactly |
| `batch2#9` | "Either way the FO check rejects" / verifier "rejects **every** tampered ciphertext" — `src/main.ts:754-756`, `src/verifier.ts:114-115` | slider defaults to 0 (`src/main.ts:203`) and `flipLevels` includes 0 (`src/verifier.ts:28`); live line above reads "FO check accepted? YES" |
| `batch2#10` | "their growing length is the secret's position leaking out" — `src/sideChannel.ts:93-96`, `:101-102` | `0xa5` not excluded from the random fill, so ~16 spurious markers precede the target — `src/sideChannel.ts:9-13`. Measured: target=2048/3072 returns the target 0/200 times; no monotone trend |
| `main` | The displayed HQC encryption equation, u = r1 + h*r2 + e with a second error vector | HQC Encrypt is u = r1 + h*r2 (no error term on u) and v = mG + s*r2 + e; there is no second error vector in HQC. Wrong in code, step-through and five display sites. |
| `main` | "HQC has perfect correctness (DFR = 0)" in `src/glossary.ts`, `src/codes.ts` and all three HQC rows of the comparison table | HQC’s DFR is small but non-zero by design, parameterised below 2^-128 / 2^-192 / 2^-256. The sibling demo syndrome-drain contradicted it. |

### `isogeny-gate`

**Fix status: fix agent reported complete.** Fix isogeny-gate walk exhibit (`a76640f22df74a25d`)

Landed and pushed, CI green per the main thread. The brief targeted the walk exhibit specifically; whether every one of the seven isogeny-gate claims was covered is not stated.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#4` | "Because the class-group action commutes, they arrive at the very same curve" — `crypto-lab-isogeny-gate/src/main.ts:159-163`, glossary `:352-353`; "Your exponent vector *is* a CSIDH secret" `:132-137` | `stepInGraph` steps the vertex representative, not the reached curve — `src/graph.ts:123-130`, `:35`. Measured: walk ≠ `groupAction` for 36/64 vectors; order-dependence for 37/64. Real `groupAction`: 0/64 failures |
| `batch2#34` | `E₀: y² = x³ + x` — `crypto-lab-isogeny-gate/src/main.ts:662` | `E0: {a: 0n, b: 1n}` = y² = x³ + 1 — `src/csidh.ts:62`; the computed j printed two lines below is 0 (y²=x³+x has j ≡ 52 mod 419) |
| `batch2#35` | "4 points (the **5**-torsion subgroup)" — `src/main.ts:665` | counts affine kernel points only — `src/main.ts:660`, `:474-480` |
| `batch2#36` | "**The** supersingular curves over GF(419) form a graph"; "Nothing is hand-placed or faked" — `src/main.ts:122-124`, `src/graph.ts:6-8` | 14 vertices — a twist-collapsed, ℓ=3-free projection of a 27-class orbit; 36 supersingular j-invariants exist. Never disclosed in UI |
| `batch2#37` | "searching **64**-cell key space", "64 candidate secret vectors" — `src/main.ts:952`, `:970` | 64 vectors collapse to 27 distinct classes — brute force returns Alice's literal secret only 42% of the time |
| `batch2#58` | "searching 64-cell key space… N tested" during an animation — `src/main.ts:952` | search and verification run synchronously at `:962-964` and the full result panel is written at `:968-978` before the animation starts |
| `batch2#59` | Exhibit 4's "Alice's public key j = X" under the same name as Exhibit 3's | `src/main.ts:962` calls a fresh `keyExchange()` with new random secrets, unrelated to `:803`; differs ~26 times in 27 |

### `kdf-arena`

**Fix status: FIXED.** `72d9fc0` derives the memory captions and ratios from each run.
`21c0d8a` makes the attacker-rig slider reach both compute- and RAM-bound states and update
the real Argon2id input used by the next benchmark. The runtime audit proves both branches
and the input synchronization; 20 tests, build, dark/light axe, screen-reader checks, and
100 Lighthouse accessibility all pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch1#1` | `src/ui.ts:72` — caption hardcodes "the honest ~64,000× ratio"; the grid's actual ratio at defaults is **131,072×** (scrypt 131,072 KB vs 1 KB) and changes with any cost-parameter edit. Never recomputed. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#2` | `src/ui.ts:72` — same caption asserts "scrypt and Argon2id fill most of theirs"; the page's own "Weaken: 8 MiB memory" preset (`src/main.ts:149`) drops Argon2id's grid to 6% while the sentence stays. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#3` | `src/ui.ts:340-341` — the attacker rig's **"Compute-bound"** status message and its hint are **unreachable**. `ATTACKER.ramKB` = 8 GiB and `parallelLanes` = 8192 (`src/bench.ts:53-54`) with slider `min="8192"` KiB (`src/ui.ts:257`) force `fitByRam` = 1024 < 8192 always. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#4` | `src/ui.ts:256-257` — slider labeled "Drag Argon2id memory (KiB)" and seeded from the run's real value, but it drives only the visualization; the benchmark reads `#argon2-memory` (`src/main.ts:140`). Dragging it changes no derivation. | (see claim text — the reporting agent gave both halves in one sentence) |

### `kdf-chain`

**Fix status: FIXED.** `1233751` makes one grid cell equal exactly 1 MiB, so 4–128 MiB is
drawn at the stated 32× ratio, and adds a browser test for both endpoints. All 10 protocol
tests, build, the new scale test, and dark/light accessibility tests pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch1#33` | `src/ui.ts:1021-1027, 1095-1096` — memory-cell counts (16/36/49/81/121) are ≈√-scaled against the labels they carry (4/16/19/64/128 MiB), so a 32× difference draws as 7.5× while the caption reads "Streaming N cells (… 128 MiB)." | (see claim text — the reporting agent gave both halves in one sentence) |

### `kerberos`

**Fix status: fix agent reported complete.** Fix Kerberos false claims (`a6059e923bd9aecce`)

Strongest fix approach of the session: implemented pre-authentication rather than deleting the unearned flag, turning the contradiction into the exhibit. Regression-checked.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch3#18` | the replay button resubmits nothing.** `/Users/gmcas/repos/crypto-lab-kerberos/src/app.ts:290,306`. Panel says "Re-submitting the exact same **ciphertext** should be rejected even though the cipher and HMAC verify perfectly." The handler runs `service.hasReplay(replayKey)` — a `Map.has()` on a string. No ciphertext resubmitted, no decryption, no HMAC check. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch3#19` | a file that promises no hardcoding, hardcoding.** `/Users/gmcas/repos/crypto-lab-kerberos/src/ui/attack-panel.ts:21` comments "The pass/fail glyph is set from the honest computed outcome, **never hardcoded**"; `:119-122` is a literal `ok: false` with a constant `detail` string, rendered under the label **"Live result"** (`:42`). This is the sharpest one in the whole cluster — the file asserts the exact property it violates twelve lines later. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch3#20` | "Live result" cards ignore the learner's slider.** `attack-panel.ts:57-59` hardcodes `nowMs + 10*60*1000` / `+2*60*1000`. Dragging the clock slider changes the handshake but never these cards. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch3#21` | a blanket honesty claim contradicted by the above.** `index.html:13` / `README.md:30`: "Every outcome shown is computed live … none of the teaching layer fakes a result." The AES-256-CTS-HMAC-SHA1-96 claim is *true* (verified against RFC 3962 §B live in-page), which makes the overclaim next to it worse, not better. | (see claim text — the reporting agent gave both halves in one sentence) |

### `key-mirror`

**Fix status: fix agent reported complete.** Fix four mis-teaching claims (`a947c5417d92f2b70`)

Turned out worse than diagnosed: `open()` returns null on tag failure but every step used `pt!` and logged "AES-GCM tag: valid" unconditionally.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch3#4` | a green "all crypto verified" chip that inspects nothing.** `/Users/gmcas/repos/crypto-lab-key-mirror/src/ui/attack.ts:328-333` prints the hand-written string "Every AES-GCM tag verified · every X25519 agreement succeeded". `renderVerdict()` (`:322`) inspects no step result; `open()` returns `string \| null` (`src/e2ee/box.ts:72`) and no caller checks for null. A decryption failure still renders the green chip. | (see claim text — the reporting agent gave both halves in one sentence) |

### `kyber-vault`

**Fix status: FIXED.** `22b0b9e` converts clean solver residues to centered Z17
representatives before comparing/displaying them, computes the toy search space from the
panel's actual n=4 and q=17, and leaves tampering in a neutral pending state until Decrypt
runs authentication. All 23 tests, typecheck, production build, and six browser tests
including dark/light static and dynamic-state accessibility scans passed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#19` | "Recovered s = [15, 1, 0, 2]. **Exactly the true secret**" — `crypto-lab-kyber-vault/demos/kyber-vault/src/main.ts:514-516`, `:522` | panel above shows `s = [-2, 1, 0, 2]`; solver returns [0,q) representatives — `src/crypto/lwe.ts:102` |
| `batch2#20` | "For n=6 and q=3329…" from a button inside a q=17, 4×4 panel — `src/main.ts:928`, panel copy `:485` | `Q = 3329`, literal n=6 — `src/crypto/lwe.ts:159-165`; `ILLUSTRATIVE_Q = 17`, `LWE_DIM = 4` — `src/main.ts:39,42` |
| `batch2#41` | "Ciphertext tampered. Decryption should fail authentication." set at tamper time — `demos/kyber-vault/src/main.ts:891`, rendered `:477` | actual decapsulation runs only on the Decrypt handler — `src/main.ts:864-879` |

### `lattice-fault`

**Fix status: fix agent reported complete.** Rework lattice-fault Attack 4 (`ab307ea2ea12d39bb`)

Exhibit rebuilt on the real mechanism.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | Attack exhibit: the attacker recomputes y from public data | K is private, so the attack as described does not work against ML-DSA. Exhibit rebuilt on the real mechanism. |

### `lll-break`

**Fix status: fix agent reported complete.** (fixed inline, pre-batch)

Main thread reports fixed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | Panel headed "SECURE (Kyber-512 style)" beside "practical attacks out of reach" | The same panel printed an attack cost of 2^3.19. |

### `lms-ledger`

**Fix status: FIXED.** `9f44751` derives the LMS and full two-level HSS sizes from RFC 8554
fields, includes and displays the verifier-required 32-byte randomizer C, and runtime-checks
the live 2,336-byte LMS signature against the active-parameter formula. All 18 tests, the
production build, and three browser tests including dark/light accessibility scans passed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#30` | "Signature size ≈ 2 × LMS-sig = **~3.4 KB** at h=10" — `crypto-lab-lms-ledger/src/main.ts:419` | same page states 1,452 B at `:222`, `:440`, `:453` → 2.9 KB. No formula in `src/lms.ts` yields 3.4 KB |
| `batch2#31` | "Sig size 2,304 bytes" — `src/main.ts:564`, `:571` | omits the 32-byte randomizer C the verifier requires — `src/lms.ts:134`, `:357`. The repo's own `signatureSizeBytes` (2,336 B) is dead code — `src/lms.ts:383-385` |

### `lms-xmss`

**Fix status: NO FIX CONFIRMATION.** No fix agent for these claims appears anywhere in the
transcript. Treat all 3 claims below as live.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#11` | "Signatures remaining N / 1024", "Used N%" — `crypto-lab-lms-xmss/src/main.ts:290-291` | `parseInt` with no validation — `src/main.ts:676`. Empty field yields q=NaN, all guards pass, page renders "NaN / 1024" and `width:NaN%` then signs at q=NaN; `-5` renders "1029 / 1024" |
| `batch2#53` | "positions a typical message can hit rose from X to Y of 34" — `src/main.ts:811`, `:828` | measures `depths.filter(d => d <= 127)` — "positions below median depth" — `src/main.ts:795-796` |
| `batch2#54` | Danger Zone: "reusing private state can trigger catastrophic index reuse" — `src/main.ts:146`, `:678` | reuse is blocked (`src/main.ts:622-626`, `src/lms.ts:128-130`); the demonstrated reuse is staged at hardcoded `FORGERY_DEMO_INDEX = 7` (`src/main.ts:17`), a leaf never marked used and never shown burned in the grid |

### `mac-race`

**Fix status: FIXED.** `39a2ce4` derives the timing conclusion from the measured column
spreads, preserves the secret-length guess used when the forgery was created, and no longer
reveals the hidden length after rejection or rotation. All 58 unit tests, build, the live
guess-history browser test, and dark/light accessibility scans pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch1#28` | `src/timing.ts:58` — fixed `summary` string ("Constant-time comparison keeps timing flatter") printed under the measured table (`src/ui.ts:211`) regardless of the measured rows; nothing checks the constant-time column's spread. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#29` | `src/ui.ts:1104-1105` — length-extension summary reads the slider at verify time, not the value used in the forge, so it can report a guess that was never made; `:1105` also reveals the true secret length on the first wrong guess, ending the guessing game. | (see claim text — the reporting agent gave both halves in one sentence) |

### `mayo-seal`

**Fix status: FIXED.** `29d2ea2` renders the positive 16^70 denominator, derives the
malformed-signature totals from measured outcomes and verifies the genuine same-message
control, and labels the E-power samples deterministic. The repo passed 142 unit tests, its
production build, and all 29 browser tests including dark/light accessibility scans.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#12` | "A random target is hit about once in 16⁻⁷⁰ draws" — `crypto-lab-mayo-seal/src/ui/whipviz.ts:164-171` | `balance.slack = k·o − m` is negative in that branch — `src/mayo/uov.ts:154`. Correct positive value computed at `uov.ts:163` and never read. `src/ui/predict.ts:55` tells the learner to check this figure for 16⁷⁰ |
| `batch2#49` | "The genuine signature for the same message still verifies" + hardcoded 2/2 counts — `crypto-lab-mayo-seal/src/ui/forge.ts:249` | `good` is generated at `src/ui/forge.ts:212` and never passed to `verify()`; `outcomes` array is present and uncounted |
| `batch2#50` | "`${tested}` **random** combinations of the E powers" — `src/mayo/preconditions.ts:93` | deterministic `(trial * 5 + l * 3) % 16` — `src/mayo/preconditions.ts:85` |

### `mceliece-gate`

**Fix status: FIXED.** `20763c1` removes the false average-webpage comparison and derives
named ML-KEM, RSA, and fixed-photo ratios from byte literals; the tamper control now adds
the number of fresh errors required to reach t+1 and reports the measured weight and t.
All 27 tests, the production build, four browser tests, and mobile/desktop accessibility
audits passed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#29` | "roughly **five times** the size of an average webpage" — `crypto-lab-mceliece-gate/src/ui.ts:380` | derived from a 50,000-byte literal — `src/keysize.ts:13`. Real median page weight ~2.2 MB, so ~1/10th, not 5× |
| `batch2#42` | "an extra error now exceeds the correction radius" — `src/ui.ts:879`, aria-label `:417` | only increments weight by 1 from current — `src/ui.ts:865-880`; at weight 0-1 decoding succeeds while the live over-radius warning at `:812` stays hidden |

### `mls-group`

**Fix status: FIXED.** `376277c` changes the page title and adds an always-visible scope
panel identifying the lab as an RFC 9420 teaching subset. It explicitly discloses that
Ed25519 credential signatures, authenticated handshake framing, and confirmation-tag
construction/verification are omitted and that modelled commits/messages are unsigned.
All 19 tests, the production build, and three browser tests including dark/light
accessibility scans passed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch3#12` | ciphersuite names Ed25519; no signing exists.** `src/crypto/ciphersuite.ts:3`: `name: 'MLS_128_DHKEMX25519_AES128GCM_SHA256_Ed25519'`. No Ed25519 import, keygen, sign or verify anywhere in `src/`. Mitigating: the constant is never rendered. But the in-app disclosure at `app.ts:395` never says commits and messages are **unsigned**, and asserts "confirmation tag checks" are real — worth re-verifying. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch3#13` | unqualified RFC 9420 framing.** `index.html:9` title "MLS Group Lab - RFC 9420 Interactive Demo"; the caveat block is a collapsed `<details>` far down the page. | (see claim text — the reporting agent gave both halves in one sentence) |

### `multivariate`

**Fix status: FIXED.** `e1113cf` derives the tour label from its 32.4-second step total,
inverts all eight bits for the claimed byte tamper, replaces contradictory tweet analogies
with byte counts, updates the scoreboard status from the live scheme event, and asks users
to compare measured keygen timing instead of promising a visible slowdown. All 33 tests,
the production build, and four browser tests including dark/light and audience-mode
accessibility scans passed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#32` | "Run **60-sec** demo" — `crypto-lab-multivariate/src/ui.ts:317`, `:339` | `TOUR_STEPS` durations sum to 32,400 ms — `src/ui.ts:1552-1624` |
| `batch2#33` | Rainbow "sig fits in **2 tweets**" (66 B) vs UOV "**1 tweet**" (128 B) in the same column — `src/data.ts:127`, `:142`, rendered `src/ui.ts:1114` | bars in the same row scale from those byte counts |
| `batch2#55` | "Flip one **byte**" — `crypto-lab-multivariate/src/ui.ts:537`, `:534`, `:992`, `:1601`, `README.md:12` | `bad[i] = (bad[i] ^ 0x01)` — one bit — `src/ui.ts:986`; rendered hex `7A → 7B` contradicts the label on screen |
| `batch2#56` | scoreboard status chip "Research" — `src/ui.ts:1871` | `wireScoreboard()` never updates it — `src/ui.ts:1884-1906` |
| `batch2#57` | "Larger parameters — keygen slows visibly" — `src/data.ts:245` | v=8,o=4 vs v=6,o=3 is <5× on an operation rendering sub-10 ms either way — `src/ui.ts:759-762`, `:97` |

### `noise-pipe`

**Fix status: fix agent reported complete.** Fix four mis-teaching claims (`a947c5417d92f2b70`)

Agent reported completion; tsc clean across all five repos in that batch.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch3#5` | non-attacks display as "⚠ Attack succeeded".** `src/ui.ts:1081-1083` renders `r.ok ? 'Defense held' : '⚠ Attack succeeded'`, but `ok:false` is also returned for not-applicable and error cases: `noise.ts:965` ("has no pre-known responder static key — there's nothing to forge"), `:1032`, `:1097`, plus `'Setup error'` at `:902,1018,1083,1137,1239` and `'Unknown attack'` at `ui.ts:1071`. Selecting NN and clicking "Substitute an attacker's key" tells the learner the attack succeeded when nothing was attempted. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch3#6` | "live handshake state" is false for two of six attacks.** `index.html` states "Run real attacks against the live handshake state", but `ui.ts:1051` and `:1054` both do `const tmpHandshake = await runFullHandshake(info.pattern)` — bitflip and nonce-reuse run against a throwaway session. Whatever the learner did in the Transport panel is discarded. | (see claim text — the reporting agent gave both halves in one sentence) |

### `nonce-guard`

**Fix status: FIXED.** `4ac4e9c` labels the XOR bytes as an ASCII preview rather than
plaintext and identifies Level 2 as a separate fixed chosen-probe demonstration rather than
a result derived from the learner's messages. All 22 unit tests, build, two browser claim
regressions, and dark/light accessibility scans pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch1#30` | `src/main.ts:251-253` — `gcmXor` printed three times under three labels, the third headed **"DECODED (PRINTABLE)"** (`src/crypto.ts:76`). Nothing was decoded; that is P₁⊕P₂ rendered as ASCII, which is noise unless one plaintext is known. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch1#31` | `src/main.ts:206` — the Level-2 attack runs on internal fixed probes, not the learner's ciphertexts. Honestly disclosed at `:210`, listed here because the enclosing panel reads as the learner's own break. | (see claim text — the reporting agent gave both halves in one sentence) |

### `ntru-classic`

**Fix status: NO FIX CONFIRMATION.** No fix agent for these claims appears anywhere in the
transcript. Treat all 1 claim below as live.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#7` | "LLL recovered the key… an exact match… Nothing was faked" printed unconditionally — `crypto-lab-ntru-classic/src/main.ts:1217-1222` | no `found` flag; defaults `shortestIndex=0`, `rotation=0`, `sign=1` survive the no-match fall-through — `src/ntru-lattice.ts:212-231` |

### `oblivious-shelf`

**Fix status: FIXED.** `47b43a0` computes the anonymity set instead of asserting that the
servers are blind.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#31` | "Server A cannot distinguish which element of S (if any) is the target" — `main.ts:351,356` | Steps 4–6 render the target with `set-el--target` / `xor-term--target` highlighting inside the panels headed "Server A computes" / "Server B computes" (`main.ts:815,820,825`). |
| `batch4#32` | "Fetch a library catalog record" — `main.ts:65,88` | `PIRResult.recovered` is a single boolean (`pir.ts:25,104`); title/author/call number come from the local `CATALOG` (`catalog.ts`) and were never transmitted. Contradicted by the demo's own `main.ts:207`. |
| `batch4#33` | "wants book #9" / "Query S△{9}" — `main.ts:101,137,146` | Static literals; the live target is `selectedIndex` ∈ 0–15. |

### `opaque-gate`

**Fix status: FIXED.** `6933e10` centralizes and consistently renders the implemented
envelope format as a nonce plus HMAC authentication tag with no ciphertext, and corrects
the registration, login, breach exercise, glossary, hero, and README language accordingly.
All 12 protocol/vector tests, the production build, and three browser tests including
dark/light accessibility scans passed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch3#9` | "encrypted-envelope" contains no ciphertext.** `src/main.ts:1667` hero: "the real OPRF → **encrypted-envelope** → 3-message 3DH handshake". `src/envelope.ts:156-159`: `envelope = concat(envelopeNonce, authTag)` — 64 bytes of nonce plus HMAC tag, nothing encrypted. The demo's own glossary (`main.ts:232`, `:365`) correctly says "a nonce plus one HMAC tag", contradicting its own hero. Exhibit 4's "decrypt the envelope directly" / "no open" (`:1557-1559`) inherits the same mislabel. | (see claim text — the reporting agent gave both halves in one sentence) |

### `oram-vault`

**Fix status: FIXED.** `e16f2e2` derives the ORAM claims from observed runs.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#14` | "The adversary sees a uniform stream — cannot detect repeated block access." / "Distribution looks uniform." — `main.ts:1079,1081` | `verdict` computed at `:1064–1068` can read "need ≥5 expected/leaf for a valid test" or "this sample deviates" — On the first 20-access run the panel declares the test invalid while the status bar declares uniformity; ~5% of valid runs exceed χ²=24.996 under the same text. |
| `batch4#20` | "Three identical morning reads of record #42 → three unrelated paths." — `main.ts:972` | `distinctPaths` computed at `:967–969`, used only in the status line at `:977`. With 16 leaves, ~18% of runs show a collision under that sentence. |
| `batch4#21` | "Stash Peak N / 20 ✓" with tooltip "Path ORAM keeps this O(log N) whp" — `main.ts:572–578` | `bound = Z*(L+1)` is a path size, not the stash bound; `maxStashSize` seeded to N=16 by `oram-client.ts:84`, so it reads "16 / 20 ✓" before any user access. |

### `pake-gate`

**Fix status: fix agent reported complete.** Fix four mis-teaching claims (`a947c5417d92f2b70`)

Wordlist now fixed and independent of the password; verified `Tr0ub4dor&3-quokka-9917` tests 10 candidates, no hit, miss verdict renders. That branch was dead code before.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch3#1` | the dictionary attack cannot miss.** `/Users/gmcas/repos/crypto-lab-pake-gate/src/ui/attacker.ts:166-168`. UI says "Grind the stolen SRP {salt, v}… For each guess recompute v'", but the code splices the true password in: `DICTIONARY.includes(...) ? DICTIONARY : [...slice(0,5), truePassword, ...slice(5)]`. The attack always hits, by construction, undisclosed. Consequently `attacker.ts:199` "No dictionary hit (password not in this list)" is unreachable. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch3#2` | "Run offline grind" grinds nothing.** `attacker.ts:140-157`. Button labelled "Run offline grind" with a `guesses: N` counter actually runs `auditTranscript(transcript, guess).clean` (`:147`) — a substring scan for the password in wire bytes. Line 147 also forces `clean = true` when `transcript.length === 0`, so the verdict prints with no transcript at all. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch3#3` | a plotted "measured" bar is the input echoed back.** `src/pake/dragonblood.ts:72` sets `modeledIterations: cap` — the input parameter — and discards `firstValidCounter`'s real result. `dragonbloodPanel.ts:60` plots it as a measured bar. | (see claim text — the reporting agent gave both halves in one sentence) |

### `patron-shield`

**Fix status: FIXED.** `db2037f` makes the PIR limits and displays match the live protocol.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#10` | "✓ Correct — r₁ ⊕ r₂ rebuilt the exact book" — `index.html:380` | `isCorrect` computed at `pir.ts:134`, carried in `PIRResult`, never read; `main.ts:308–310` unhides the badge unconditionally — A verified result asserted while the verification is computed and discarded. |
| `batch4#34` | "capped at DB_SIZE ≤ 32 records" — `index.html:549` | `pir.ts:80` `1 << DB_SIZE`: JS shifts mod 32, so at 32 the mask is identically zero; `1 << 31` also hits the sign bit and `generateQuery` lacks the `>>> 0` fix used at `main.ts:341`. True bound is 31. |
| `batch4#35` | "Showing 8 of 8 — show all" — `main.ts:130–132` | `CATALOG` has 8 entries; `PREVIEW_COUNT = 8`. Clicking re-renders the same eight. |
| `batch4#36` | `mask = 0x????????` (32 bits) — `index.html:484` | `main.ts:255` pads to `ceil(DB_SIZE/4)` = 2 hex digits; the real mask is `0x3f`. |
| `batch4#37` | "send each server a √N-bit column mask … Each server returns one parity per row" — `index.html:534–537` | `runServer` (`pir.ts:100–110`) is a flat 1-D loop; no matrix layout exists in `src/`. Mitigated by the explicit disclosure at `:546–553`. |

### `phantom-vault`

**Fix status: FIXED.** `61a4752` replaces the noisy small-run comparison with exact
deterministic tallies over all 256 byte values and labels the current-run rejected-tail
count as an observation rather than statistical proof. Typechecks, 46 tests, the
uniformity check, production build, and three browser tests including dark/light
accessibility scans passed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch1#32` | `src/ui/distribution.ts:70-77` — panel promises the naive chart visibly "leans on the low positions" and prints two mean-deviation figures, but the sample is only this run's ~20-70 bytes across 89 bins; both figures are sampling noise and can come out in the wrong order. | (see claim text — the reporting agent gave both halves in one sentence) |

### `pki-chain`

**Fix status: fix agent reported complete.** Fix four mis-teaching claims (`a947c5417d92f2b70`)

Agent reported completion; tsc clean.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch3#7` | "X.509 · RFC 5280" over a JSON model.** `src/main.ts:548` displays "Certificate Chain Trust · X.509 · RFC 5280". `src/pki.ts:76-86` signs `JSON.stringify({subject, issuer, publicKey, validFrom, validTo, serialNumber})`. No DER, no ASN.1, no RFC 5280 extension exists in the codebase, and there is no in-app disclosure. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch3#8` | CA compromise changes no verdict.** `README.md:5` claims "any forged or revoked link invalidates all descendants". `pki.ts:361-381` `compromisedSubtree` returns subject strings only, and `main.ts:784-789` re-renders **without calling `recomputeValidation`**. | (see claim text — the reporting agent gave both halves in one sentence) |

### `psi-gate`

**Fix status: fix agent reported complete.** Fix silent-tally and psi-gate (`af6e89ca2fd778242`)

Validated: 20 consecutive runs of the real worker gave 19 "consistent with uniform at alpha=0.05" and 1 borderline. `assertValidPoints` now called on all four real receive paths. The agent also found byte 0 is a second, larger constraint the brief had missed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#51` | `main.ts:1436-1439` — "its byte-wise marginals are flat to within sampling noise", over a chi-square verdict. | `psi-worker.ts:101-104` bins all 32 bytes of each ristretto encoding as uniform draws over 0-255, but byte 31 always has its high bit clear (this repo asserts that at `attacks.ts:239-249`) and byte 0 is always even per RFC 9496. Expected chi-square ~411 at count=5000, outside every acceptance band the page prints. The exhibit built to demonstrate flatness should routinely print its own failure branch. |
| `batch4#52` | `attacks.ts:285-287` — "Ristretto255 + identity check rejected all 4 malicious encodings ... invalid-curve and small-subgroup attacks are impossible by construction". | `isValidPoint` is called only from `attacks.ts:231,244,257,276` and `tests/group.test.ts` — never from `psi.ts:136-141`, `psi.ts:157` or `oprf-psi.ts:128`, the three places a received point actually arrives. The certificate is for validation that never runs on any protocol path. |
| `batch4#53` | `main.ts:1400-1405` — page reports rejection "at alpha = 0.05". | The alpha=0.05 acceptance band [213.997, 297.829] is strictly inside the alpha=0.01 band [198.380, 317.097], so branch 2 of the three-way verdict is unreachable and a falling-through chi-square is outside the 0.01 interval. The printed significance level is not the one tested. |
| `batch4#54-56` | "Neither party learned anything else" (`main.ts:171-173`); the Exhibit 3 alignment grid the learner is told to compare byte-for-byte; "Simulate Scalar Reuse". | The "learned nothing else" line prints directly under the server’s full plaintext user database (`:137-139`); the alignment grid is a separate execution with fresh scalars and shuffling disabled (`main.ts:587` vs the worker run at `:667-671`), so those hexes belong to a different run than the result above them; the reuse exhibit labels two intersections `attacks.ts:136-137` computed with fresh scalars via `runPSI`, not the reused alpha. |

### `quantum-entropy`

**Fix status: fix agent reported complete.** Fix display-vs-reality defects (`abf9308786e518d88`)

Dispatched with the 99.7% headline in the brief.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | Hardcoded headline "Shannon says 99.7% random" | Drag the bias slider to 70% and the heading still says 99.7% while the statistic directly beneath reads 88.13%. |

### `quantum-vault-kpqc`

**Fix status: fix agent reported complete.** (fixed inline, pre-batch)

Main thread reports fixed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | "a single share reveals NOTHING" | One value in the share space was unreachable, and it was the secret itself. |

### `ring-sign`

**Fix status: FIXED.** `7f719ce` computes what the verifier learns instead of asserting it.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#13` | "Signer identity to verifier: hidden (only sees manager-issued credential proof)" — `main.ts:772` (live status region) | `group.ts:105–110,136–144` ships `memberPublicJwk` + stable `credentialId` in every signature — Signatures are pseudonymous and trivially linkable. `main.ts:776` concedes it — the false version is the one in the live readout. |
| `batch4#29` | "Reuse detected: no" branch — `main.ts:684` | `runExhibit2` (`main.ts:260–272`) signs both messages with `state.signerIndex`; `reused` is always true and the branch is dead code. The ledger's "REJECTED double-spend" is a foregone conclusion of control flow, not of the key images. |
| `batch4#30` | "The verifier sees only the data here" — `main.ts:626` | `LsagSignature` carries `signerIndex` (`ring.ts:40`), read directly at `main.ts:610`. |

### `scloud-vault`

**Fix status: NO FIX CONFIRMATION.** No fix agent for these claims appears anywhere in the
transcript. Treat all 2 claims below as live.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#47` | scrutiny "meters" rendered as filled bars — `crypto-lab-scloud-vault/src/exhibits/transparency.ts:107-112` | widths are hardcoded 100/45/18%; nothing is counted |
| `batch2#48` | "this demo uses a **single-vector simplification**" — `src/exhibits/exhibit4.ts:103-104`, `src/crypto/params.ts:26`, `README.md:11,28` | `B` is a full n×32 matrix — `src/crypto/kem.ts:43`, `:240-255`; the single-vector form was removed as not IND-CPA — `kem.ts:11-13`. Same panel's line at `exhibit4.ts:87` correctly says "n×32 matrix LWE" |

### `search-vault`

**Fix status: FIXED.** `37b816f` handles unknown queries without breaking leakage attacks
and corrects the guessing baseline.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#43` | "Type a keyword … or a word that is not in the corpus." — `search.ts:86` | `server.ts:64–69` logs zero-result queries as a distinct token; `attack.ts:70` throws when tokens > candidates; `attack-view.ts:180` and `challenge.ts:179` have no try/catch. The page's core payoff dies from its own suggestion. |
| `batch4#44` | "Guessing at random ≈ X / N" — `challenge.ts:200` | Uses `ps.length / KEYWORDS.length`, the expectation for independent uniform guesses; both the attack and the learner produce an injective assignment, whose expected fixed points is 1 regardless of N. Correct today (T=C=14), wrong for T < C. |

### `shadow-vault`

**Fix status: FIXED.** `00f6027` scopes deniability to contents rather than existence,
discloses global precomputation and format fingerprints, makes the offset visualization
honest, strengthens password warnings, and lets decryption reproduce non-default Argon2id
parameters. Typecheck, build, 12 browser tests, and both-theme a11y pass; Rust tests were
unavailable because this machine has no `cargo`, and no Rust code changed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#11` | "not even that it exists" — `encrypt.ts:378–379` (coercion-scenario climax) | `lib.rs:409–465` always writes exactly two slots; `encrypt.ts:155` requires both passphrases; the page's own `index.html:299,402` say a format-aware adversary knows a second slot exists — The hardcoded conclusion asserts existential deniability the page and code both deny. |
| `batch4#12` | "The cost scales per passphrase attempt — attacking two passphrases is twice as expensive." — `index.html:411` | `lib.rs:74–95`: the salt is `SHA-256("shadow-vault:v1:{role}")`, identical in every container ever made; the code comment says "Argon2id precomputation is GLOBAL … paid once by the world, not once per target" — With a constant salt, one precomputed table amortises the memory cost to zero for every attacker after the first. |
| `batch4#38` | "Nothing marks … whether any exist at all" — `visualizer.ts:76–77` | `lib.rs:25` `VALID_CONTAINER_SIZES: [4096, 8192, 16384, 32768]`; `wasm.ts:228–233` rejects any other length. File length is a fingerprint; slot count is a constant of the format (two). |
| `batch4#39` | "no headers, no magic bytes, no length fields" — `index.html:415` | `lib.rs:178` writes a 4-byte LE length at `slot[0..4]` (inside the AEAD, but the format does have a length field, and `index.html:416`'s diagram omits it). |
| `batch4#40` | "(redacted) … The exact offset is hidden on purpose" — `index.html:365,368` | `lib.rs:552–553` returns `offsetPercent`; `decrypt.ts:163` writes it into an inline `style="width:N%"` readable in the DOM (~54 bytes granularity at 8 KB). |
| `batch4#41` | "Good — resistant to most attacks" at 60–79 bits — `encrypt.ts:46–47` | `encrypt.ts:34` `bits = length × log2(charsetSize)` with three trivial penalties; no dictionary or pattern check. `Password123!` scores ≈78 bits. |
| `batch4#42` | Decrypt derives key "via Argon2id" from the passphrase — `index.html:406,416`, no parameter controls in the DECRYPT panel | `decrypt.ts:132–135` uses `getParams()` — current slider state, reset to defaults on reload. A 128 MB vault is unopenable after refresh, and the failure is indistinguishable from a wrong passphrase (`decrypt.ts:167`). |

### `shamir-gate`

**Fix status: fix agent reported complete.** (fixed inline, pre-batch)

Main thread: "fixed, witness written into the tab".

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | "for every possible secret S in [0,256] there exists exactly one degree-2 polynomial" (proof tab) | For the fixed shares (1,75) and (2,140), S = 10 gives f(x) = 10 + 65x — degree 1, fits both points, and the old generator could never produce it. |

### `shor`

**Fix status: fix agent reported complete.** Fix shor chart plus spec deviations (`ac5f8767b5a1a7689`)

Main thread reports fixed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | Headline chart: classical factoring cost ~10^23, quantum gap 10^14x | Actual ~10^34; gap ~10^25. Understated classical factoring by ~11 orders of magnitude. |

### `silent-tally`

**Fix status: fix agent reported complete.** Fix silent-tally and psi-gate (`af6e89ca2fd778242`)

Agent reported completion. Note the fix agent was dispatched from batch 4’s *correction*, which is the only part of batch 4 the main thread ever saw.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#47` | "these are real polynomials, not an artist's impression" — `exhibit6.ts` caption | The curves are real Lagrange quadratics, but the plotted point heights are `Number(share % 520n)/100` (`exhibit6.ts:124–125`) — cosmetic. Honest in the source comment, not on the page. |
| `batch4#50` | `exhibit6.ts:87-88, :101-102` — "that is 2^61 - 1 possibilities, all equally likely" and "exactly one polynomial passes through these points for every candidate secret f(0) — all 2^61 - 1 of them, equally likely". | Contradicted by `exhibit2.ts:33-34`, `min="1" max="9999"`, enforced by both validators. Only 9,999 field elements are candidate secrets and they are not equally likely given a public constraint the page itself imposes. |

### `snark-arena`

**Fix status: FIXED.** `8f79cf2` computes the verdicts that Exhibits 01, 02, 03, and 05
previously asserted.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#1` | "Only `x = 3` satisfies all three." — `index.html:209`, `src/ui/playground.ts:52` | `R1CS_PRIME = 8191` (`src/crypto/r1cs.ts:14`), `PUBLIC_OUT = 35` (`:20`); slider clamped `max="9"` (`index.html:189`) — Over F₈₁₉₁ there are **three** roots — 3, 3527, 4661 (enumerated and confirmed). Uniqueness over the integers is transplanted onto a finite field, in the Key Takeaway of the finite-field exhibit. |
| `batch4#15` | "a proving key from an actual ceremony" / "a real powers-of-tau + phase-2 trusted setup" — `index.html:236,218` | README §"Real SNARKs on GitHub Pages" lines 83–87: one phase-1 and one phase-2 contribution with published entropy `-e="random"` / `-e="random2"`. The demo's own quiz (`ui/quiz.ts:23–31`) teaches that a single-party setup equals no trust. |
| `batch4#16` | "✓ Verified (simulated verifier path, N ms)" on two Verify buttons; "Verification time: 1.4 ms / 3.8 ms" — `index.html:272,324` | `main.ts:69–72`, `:79–82`: `ms = (1 + Math.random())` / `(3 + Math.random()*2)`; no proof object exists. Disclosed as "simulated," but the trust banner also says timings "follow snarkjs benchmark conventions." |
| `batch4#17` | "Security holds if at least one participant destroys toxic waste" beside a live-looking ceremony — `index.html:288–289` | `main.ts:156–157` hardcodes four safe / one bad; `:161` always prints "Ceremony is safe." The conditional is never evaluated. |
| `batch4#18` | "Proof size: 256 bytes" rendered inside the "Proof generated in N ms" block — `ui/realproof.ts:92`, `index.html:240` | `realproof.ts:15` `const PROOF_BYTES = 256` — correct for Groth16/BN254, but a constant sitting beside a genuinely measured `${ms}`. |
| `batch4#19` | "✗ Soundness broken — the forged proof is accepted" — `ui/kzg.ts:66` | `fg.verify.accepts` is computed at `crypto/setup.ts:203` and never gated on. |

### `spake-gate`

**Fix status: FIXED.** `bf2d0ce` corrects scalar documentation from mod p to the P-256
group order and labels M/N as loaded and curve-checked RFC compressed points, with the
derivation seeds shown but not recomputed. The reported dead links were stale: the current
GitHub Pages links for SPAKE, OPAQUE, and PAKE all returned HTTP 200. All 18 tests, the
production build, and three browser tests including dark/light accessibility scans passed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch3#16` | minor.** `src/spake/password.ts:38` docstring says "mod p" where `bytesToScalarMod` reduces mod the group **order** (`group.ts:15,135`) — comment-only, not displayed. `src/ui/constants.ts:35` labels M/N "derived by hashing the seed" over hardcoded `decodePoint(M_COMPRESSED)` — but `constants.ts:66-72` explicitly discloses this. | (see claim text — the reporting agent gave both halves in one sentence) |
| `batch3#17` | dead Live Demo link.** README uses `https://crypto-lab.systemslibrarian.dev/crypto-lab-spake-gate/`; per your CLAUDE.md, per-demo subpaths on that domain 404. Same form in its Related Demos links. | (see claim text — the reporting agent gave both halves in one sentence) |

### `sphincs-ledger`

**Fix status: MIXED.**

The main-thread collision-resistance claim is reported fixed. The four batch-2 sphincs-ledger claims (#6, #38, #39, #40) had no fix agent.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch2#6` | "forge a signature for a higher step without the private seed… so it verifies" presented as a general WOTS+ fact — `crypto-lab-sphincs-ledger/demos/sphincs-ledger/index.html:296-298` | no Winternitz checksum chains exist — `src/crypto/wots.ts`. Documented in `NOTES-scaled-values.md:69-77`; the word "checksum" appears in no rendered string. Contradicts `crypto-lab-lms-ledger/src/main.ts:882` |
| `batch2#38` | "SHA-256 of the new message does not match… SPHINCS+ verification rejects it" + INVALID badge — `demos/sphincs-ledger/src/main.ts:824-825`, `:774` | only sets `entry.valid = false` — `src/ledger/ledger.ts:89`. No `verify()` runs |
| `batch2#39` | "the amber path a single signature actually walks" — `demos/sphincs-ledger/index.html:243` | `activeLeafFrac = 0.42`, a fixed constant; no signature data reaches the function — `src/visualization/hypertree.ts:19` |
| `batch2#40` | "VALID FORGERY" at forge-step 16 | `wotsSign` only produces steps 0-15 (`src/crypto/wots.ts:59`); step 16 returns the public key itself with `stepsToPublicKey = 0` (`:178`), so verify trivially passes on a degenerate non-signature. Input allows `max="16"` — `index.html:304` |
| `main` | "reduces entirely to SHA-256 collision resistance" | SPHINCS+ was specifically designed not to need collision resistance — which is why n=16 buys 128-bit security instead of capping at 64. |

### `stark-tower`

**Fix status: fixed and locally committed (2026-08-01), commit `883421a`; not pushed.** The
leak prose now follows the measured counter; the byte estimate labels its 1,024-row
reference and distinguishes compact proof material from JSON transport; the security tile
is explicitly a conjectural FRI-query term and makes no production verdict. The original
audit's proposed blanket 31-bit cap was not repeated: independent challenges can accumulate
entropy, while the honest limitation is that this toy omits field-dependent algebraic error
terms and therefore cannot establish end-to-end security. Tests, DOM behavior checks,
typecheck, build, both-theme accessibility, and a live screenshot all pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#22` | "The true value never leaked." — `main.ts:643–646` | `exp.leakedCount` genuinely incremented at `stark.ts:841` and displayed as its own stat tile with a pass/fail class the prose ignores. |
| `batch4#23` | "≈ FRI query bytes" — `index.html:370` | `main.ts:430–434` hardcodes `folds=10`, `pathLen=10+rateLog` (a 1024-row trace); the demo's traces are 8 or 16 rows. |
| `batch4#24` | "proof bytes" / "The proof is N bytes" — `main.ts:487,538` | `stark.ts:925` `JSON.stringify(proof).length` — decimal strings and hex paths, several times a binary encoding, in the section about proof size. |
| `batch4#25` | Security calculator: up to "480 ≈ security bits — production-grade ✓" — `index.html:368`, `main.ts:443,453` | No field-size term. Over the demo's own F_p (p = 3·2³⁰+1, `field.ts:10`), soundness is capped near 31 bits regardless of query count. |

### `stego-suite`

**Fix status: fix agent reported complete.** (fixed inline, pre-batch)

Main thread reports fixed.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | chi-squared LSB detector verdict | At 100% embedding it printed "No LSB embedding detected" — the statistic was doubled. |

### `tls-handshake`

**Fix status: fix agent reported complete.** Fix SSH and TLS false claims (`a8d4a8c94d58eedf2`)

On-page scope section added stating the chain is not X.509, no hostname/SAN/validity/key-usage/revocation check exists, and only the application-data record is AEAD-sealed. Phase-check gates pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch3#18` | Section 4 presents "certificate authentication" with self-signed / issued-by framing (`src/main.ts:247,250`) and lists "expired or misissued certs, and missing SNI/hostname checks" as real-world failures (`main.ts:379`). | The scope disclosure exists only in a source comment at `src/certs.ts:11-14` ("a production X.509 chain carries far more ... explicit non-goals here"). Grepping `src/main.ts` for any on-page equivalent returns only a footer link to pki-chain at `:399`. A learner would reasonably conclude they are looking at X.509. |

### `vrf-gate`

**Fix status: fix agent reported complete.** Fix display-vs-reality defects (`abf9308786e518d88`)

Dispatched with the VDF self-contradiction in the brief.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | "extra cores cannot help — that sequential chain is the delay"; table row "Sequential computation? Yes"; an "Observed speedup" figure | Three lines away a banner correctly states the toy VDF’s delay is zero because its modulus factors into two published primes. The exhibit contradicts itself. |

### `webauthn`

**Fix status: NO FIX CONFIRMATION.** No fix agent for these claims appears anywhere in the
transcript. Treat all 1 claim below as live.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch3#14` | "real WebAuthn ceremony" sits above the simulator.** `src/ui.ts:217` hero: "Run a real WebAuthn ceremony with live ECDSA P-256 keys". The ceremony immediately below is the simulated authenticator (`engine.ts:2`: "This is NOT the full CBOR/COSE"). The keys are real and `ui.ts:171` corrects the record further down, but the hero reads as Path C while sitting above Path A. | (see claim text — the reporting agent gave both halves in one sentence) |

### `world-hashes`

**Fix status: MIXED.**

The main-thread Kupyna claim is reported fixed. Batch 1 found no display-vs-reality defects in this repo.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `main` | Kupyna taught as a sponge construction | Kupyna is Groestl-style wide-pipe Merkle-Damgard. |

### `zk-arena`

**Fix status: FIXED.** `882ba0e` discloses the concrete <code>s + 1 mod q</code> guess,
displays it, and leaves acceptance to the real verifier. All 81 unit tests, build, size
gate, and end-to-end tests pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#45` | "The best you can do is guess randomness for `999`" (τ-destroyed branch) — `ui.ts:1083` | `ui.ts:1100–1102` stipulates `sTried = (commitment.s + 1n) % Q` with the comment "Model that as a wrong s; it fails." The verdict is still computed by the real `verifyOpening`, but no attempt occurs. Not disclosed on the page. |

### `zk-proof-lab`

**Fix status: FIXED.** Initial verdict fixes landed in `602412c`; the remaining graph,
witness-hiding, and setup claims were resolved in `4d8b2b4`.

The first pass made every verdict computed, removed the exposed Schnorr nonce, and added
tamper checks. The follow-up made the graph commitment's rejection branch user-reachable
and browser-tested, relabeled the toy SNARK witness as exposed to its verifier, and changed
the nonexistent setup visualization to "assumed and narrated; not simulated." Unit tests,
typecheck, build, browser quality checks, and all 18 dark/light accessibility scans pass.

| Ref | Claimed on the page | What the code actually does |
|---|---|---|
| `batch4#2` | "✗ CAUGHT — hash does not match commitment!" + "Binding property holds." + `detected: true` — `js/commit.js:143–147` | `fakeHash` (`:142`) is never compared to `cs.hA` — The exact `attemptForge()`-returns-a-constant pattern: the conclusion is asserted, never derived. |
| `batch4#3` | "Verification equation check: witness relation holds" — `snark.html:106`, `js/snark.js:78–80` | `js/snark.js:49` assigns `publicInput = witness*witness + 3*witness + 7`; `:63` "checks" that same expression — Tautology — it cannot be false. |
| `batch4#4` | "digest binds public input to proof envelope" — `js/snark.js:81–83` | `js/snark.js:64` `digestBound: true` — A literal. Nothing binds anything on the honest path. |
| `batch4#5` | "✓ VERIFIED — values match" — `js/schnorr.js:116` | `stepRun.ok` computed at `:88`, never consulted — Prints VERIFIED even if the equation failed. |
| `batch4#6` | "Binding is enforced here, not assumed" / "rejects any that does not match the published digest" — `graph-coloring.html:61,138` | `js/graph.js:159–163` re-hashes the commitment's own stored `color`/`nonce`; rejection branch `:167–170` unreachable — The comparison is `h === h`. Binding is in fact assumed. |
| `batch4#7` | "the verifier accepts without ever seeing w" — `js/snark.js:109` | `js/snark.js:75` renders `privateWitness` under the label "Private witness w" (`snark.html:93`); it is also in the copied transcript and localStorage — The page prints the witness while narrating that it is hidden. |
| `batch4#8` | "Secret x (hidden)" — `exhibits/schnorr.html:68`; "computing x requires solving the discrete logarithm" — `:161` | Same lines render `x = 17` in plaintext; `js/schnorr.js:135` puts the nonce `r` in the exported transcript — `x = (s−r)·c⁻¹ mod 2052` recovers it in one step; also p=2053 makes brute-force DL ~2¹¹ ops. |
| `batch4#9` | "zk-SNARK Pipeline (**Setup** → Prove → Verify)" + "Setup model: Visual trusted setup simulation" — `snark.html:42,79` | `js/snark.js` has no setup step, no keys, no SRS, no visualization — only a log line "Setup keypair assumed" (`:105`) — A promised phase that does not exist. |

## Repos explicitly reported clean

These were swept and no falsifiable claim was found. Recorded because the negative result is
also information.

- `hash-zoo`, `world-hashes`, `poly1305-mac` — batch 1: "every headline figure on screen traces
  to a live computation".
- `spdz-forge`, `card-trick` — batch 4: the only two demos in the privacy/ZK cluster with zero
  falsifiable claims after a full sweep.
- `ratchet-wire`, `web-of-trust`, `jwt-forge`, `time-trust` — batch 3.
- `kerberos` was reported clean by batch 3 and then found to have four claims by a targeted
  sweep in the same batch. The four are listed above. Treat "clean" verdicts as provisional.

## The pattern

The main thread's own summary of the defect class, which the per-claim evidence supports:

> Nearly every defect was a verdict the page printed but never computed — and in almost every
> case the honest computation already existed a few lines away. `silent-tally`'s coalition
> exhibit needed one import. `psi-gate`'s validator was written and never called.
> `collision-vault` had the measurement and displayed the estimate.

Two recurring sub-patterns worth grepping the whole fleet for:

1. **Throwaway-session attacks** — `tls-handshake` and `noise-pipe` independently ship attack
   panels that run against a freshly generated session while the page implies the learner's own.
2. **"Live result" as decoration** — `kerberos` and `key-mirror` both render a computed-looking
   verdict from a hand-written constant. The label itself is worth a fleet-wide grep.

## Open decisions the session left to the owner

- `format-ward`: SP 800-38G Rev. 1 2nd public draft removes FF3 and FF3-1 entirely (Beyne's
  linear cryptanalysis of the tweak schedule), leaving FF1 as the only specified method. A demo
  featuring FF3-1 was citing Rev. 1 as its authority. Noted in the glossary and README rather
  than silently rescoped.
- `zk-arena`: its toy group leaks ~19 bits of the secret from the public key alone via
  Pohlig-Hellman (verified 200/200 random keypairs). Currently disclosed on the page; whether to
  re-parameterize instead is an open call.
