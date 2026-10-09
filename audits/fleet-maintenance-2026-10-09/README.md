# Crypto Lab fleet maintenance outcomes 2026 10 09

Twelve new draft repair/integration PRs are prepared, and the existing TC26 provenance PR is updated. No PR was merged, no workflow manually rerun, no lab deployed, and no public Site published. Repairs remain awaiting review. Every inspected Dependabot update has an outcome and concrete next action in [dependabot-outcomes.md](dependabot-outcomes.md); unresolved compatibility migrations remain work required.

## Checkout preservation and source revisions

The intended origin is `https://github.com/systemslibrarian/crypto-lab.git`, default branch `main`. The starting checkout was dirty with untracked `.claude/`; its starting SHA was `975a59b956c82c6205f53632bb3738c81a346012`. Git fetched current remote branches without resetting, cleaning, stashing or overwriting local files. Work proceeded in `/Users/gmcas/repos/crypto-lab-lane-fleet-maintenance-2026-10-09` on `repair/fleet-maintenance-2026-10-09`. Other repairs use isolated worktrees under `/Users/gmcas/repos/.fleet-maintenance-20261009/`.

While this session ran, the original checkout and remote main advanced externally to `f9ceb0c3e5d343b01137404413a309250f17a88c`. That commit supplied the current SAT review and three date pins. Its attribution is not established by this session. Those already-correct changes are reused. Original untracked work remains preserved. Final PR heads and exact check observations are recorded in `repair-prs.json` and Fleet Console work-item evidence.

## Repair branches awaiting review

| Repository | Starting default SHA | Repair ending SHA | Review |
| --- | --- | --- | --- |
| crypto-lab-biham-lens | `eea1f7a1568079783d617050ca25bde7e1229cc7` | `32cd0521d78323b634dc90ac884e56c0972502b3` | [PR 15](https://github.com/systemslibrarian/crypto-lab-biham-lens/pull/15) |
| crypto-lab-merkle-proofs | `46b1977db0b66b7c2e5feada3dc8acbbcee36e00` | `1917af8abcfac7fce73c8e4dda0226d59c606d3e` | [PR 30](https://github.com/systemslibrarian/crypto-lab-merkle-proofs/pull/30) |
| crypto-lab-chacha20-stream | `da53dc7595283158af55d742c117f7068262168b` | `e351adecaab5b7ad602f583241a4849bcbc793ce` | [PR 23](https://github.com/systemslibrarian/crypto-lab-chacha20-stream/pull/23) |
| crypto-lab-isogeny-gate | `65ed1ac31118fe10af0d5171022df6ed99ac3027` | `0893891b6a41d24af4d6ef39926c20f81fe9a7f8` | [PR 29](https://github.com/systemslibrarian/crypto-lab-isogeny-gate/pull/29) |
| crypto-lab-falcon-seal | `dce7c3bd204a4614654578a5b7abc4ac473f4b40` | `61ae82f089b38829eb1e054a66cfe3dd14b15c27` | [PR 23](https://github.com/systemslibrarian/crypto-lab-falcon-seal/pull/23) |
| crypto-lab-poly1305-mac | `c75eae3af7c288d210f83c66170e8d244e706086` | `9010678995a45582dd02057426f9d01954abf152` | [PR 23](https://github.com/systemslibrarian/crypto-lab-poly1305-mac/pull/23) |
| crypto-lab-mceliece-gate | `7f5362538dbdde4e474f2733af3ff17fdf191965` | `ba05c5680c0e4720a8d7c5afaa94da92b86aa54b` | [PR 28](https://github.com/systemslibrarian/crypto-lab-mceliece-gate/pull/28) |
| crypto-lab-stego-suite | `4a67502ff2287abb55389a91e3ee4027949a5921` | `64251db52fd147f582bb266c6486da00976c022e` | [PR 26](https://github.com/systemslibrarian/crypto-lab-stego-suite/pull/26) |
| crypto-lab-rsa-small-roots | `71e571b0b8524400a2c0e1f299adff8c46ee1087` | `37d70da750d1ed7872bbfd74f4c8fe3c7d20be77` | [PR 1](https://github.com/systemslibrarian/crypto-lab-rsa-small-roots/pull/1) |
| crypto-lab-tc26-pair | `ea452d1b4aec23104cda3ea7a8b7149ed013830d` | `d8edae3d16e9834ce9be426d0c7ad608b1379b39` | [PR 5](https://github.com/systemslibrarian/crypto-lab-tc26-pair/pull/5) |
| crypto-compare | `fb0e9032f7f3b7972b2c4671c1c7e9b0afbd7582` | `f1b95723a1d4812f3f78a399e7d73f85033e1b93` | [PR 38](https://github.com/systemslibrarian/crypto-compare/pull/38) |
| crypto-counsel | `3d3fa686103ea17f599c39b0712ada3954f0c00c` | `65721c07fe40be9a2236b000de6a3cfd3e78def2` | [PR 10](https://github.com/systemslibrarian/crypto-counsel/pull/10) |


Biham Lens explicitly includes installed Node types and uses the supported lowercase `es2020` target. Its current base and exact TypeScript7/Vite8 update variants passed typecheck,28 unit tests,build and26 browser tests. Merkle Proofs, ChaCha20 Stream and Isogeny Gate add explicit Node types and use Node24. Their base and exact Vitest5 variants passed76/29/113 unit tests and14/20/20 browser tests respectively, plus builds. Isogeny’s exhaustive coefficient-set test now partitions by proven curve isomorphisms, still asserts all coefficients were visited, and counts every class once. This resolves a newly enforced synchronous test timeout without increasing timeouts or weakening assertions. Exact jsdom update variants for Merkle and Isogeny were not locally rerun.

Falcon Seal, Poly1305 MAC, McEliece Gate and Stego Suite use Node24 after authenticated proposed-head logs showed the same unsupported Node20/undici call and explicit engine requirement. Current-default and exact jsdom30-head variants passed all installs, unit tests, builds and browser suites:41/11,18/15,34/7 and46/35 tests. Stego’s five compiling mutations were killed in both variants. Commands, exact source heads, log paths and log hashes are in `runtime-checks.json`; official isolated Node24.21.0 download evidence is in `node24-download.json`.

RSA Small Roots current-main workflow passed43 tests but ANSI codes broke its nonzero test-count grep. PR1 sets `FORCE_COLOR=0` for the test command, preserving `pipefail` and the nonzero assertion. The exact repaired Bash pipeline passed. Local build/unit43 and browser14 checks passed at inspected source `1ce5a8ca665b7946bb01958cbf2a9a9295fe7a84`. No publication evidence exists yet.

The hub deployment checker previously printed a global success and exited0 with230 API-ERROR results. The repair fails unreadable Pages/run/diff evidence, missing main/workflow names and unfinished runs, and withdraws that success statement. Seven actual-CLI positive/negative controls and13 existing deployment classifier fixtures pass; the new CLI controls run in PR CI.

## Proposed updates and observed failures

The capture contains104 open Dependabot PRs across59 repositories:100 observed proposed-head failures and4 observed successful application builds. All100 failing jobs and PR diffs were read through authenticated GitHub access. Exact heads, check conclusions, missing/unfinished/cancelled/skipped distinctions, dependency patches and diagnostic excerpts are preserved in `dependabot-evidence.json`. Current-default observations are separate in `default-branch-and-diagnostics.json`. Matching job names did not establish a shared cause.

Noble major export/API migrations, unsupported TypeScript7 linter peers, unpaired Vitest/coverage majors, transformer/benchmark changes, audit findings and browser assertions remain unresolved where no focused repair was prepared. These are not repaired by the eight compatibility branches. Each existing update PR is reused as its repair scope; no duplicate issue or replacement Dependabot PR was opened. See the complete104-row outcome table.

| Update-service observation | Existing work ID | Outcome and next action |
| --- | --- | --- |
| Ratchet Wire run37655056190 | `a075f42e-c1dd-4a49-bd42-6856e8768091` | Blocked. Run reports failure but authenticated jobs expose only skipped deployment/auto-merge; no build diagnostic. Obtain the missing failing job/service diagnostic from GitHub. Current application checks are separate. |
| Timing Oracle runs37800382468 and37800382436 | `caed46d4-875f-4295-b323-28c5bf6a59b6` | Blocked. Jobs remain queued/unfinished and authenticated log downloads return BlobNotFound. Restore log availability or obtain a GitHub service diagnostic before selecting a repair. |
| Syndrome Drain run37790821616 | `f84f71c7-5511-4ed3-a07c-e5b5be4fc400` | Blocked. Queued/unavailable service logs still return BlobNotFound. Obtain a readable diagnostic; no deployment-capable rerun authorized. |

## Catalog source drift

Biham’s root implementation was reread at `eea1f7a1568079783d617050ca25bde7e1229cc7`: toy SPN and real FEAL4, equivalent round-key/whitening recovery rather than master-key recovery; FEAL8 is test-only. The human pin and stale root anchors are refreshed through the normal writer. ElGamal `7424411c18f1478281d3052336dc30046fe9c145` has six repaired stale anchors while the existing WebCrypto HMAC/SHA256 evidence remains. Newly verified FHE,MAC Race and Blind Sign anchor drift is repaired using the existing findings where present. SAT’s same-source pin correction already landed externally and is reused rather than duplicated. Four original content-date findings had three externally fixed; the remaining FHE content date is repaired.

Twenty-one stale original clones were replaced only in the source scan by fetched default-branch worktrees. The final full catalog verifier passed1598 anchors and every applicable review pin; `catalog-source-worktrees.json` records the exact fetched heads and preserved original status. Normal source evidence guards remained active. Unknown,N/A,unreadable compiled components and source-scan limits remain explicit; passing anchor verification does not turn these into verified implementations or binary provenance.

## Onboarding and related references

WEP Crack and LFSR Forge are source-verified standalone labs with complete draft hub cards, exact source review pins, catalog generation, README tables/counts, concept coverage, teaching index, levels and Cryptanalyst path placement. No vocabulary term or algorithm category was invented. WEP uses generated RC4 protected bodies and CRC32/PTW experiments, not real radio capture intake. LFSR uses tiny recurrences/Geffe and known keystream, separating forecasts from exact state confirmation. WEP149 unit,2 accessibility and49 claim tests passed; LFSR13 unit and8 browser tests passed. Their inspected SHAs are `fad33459d2f9a0304a1c0b08810f375a6c1c9f51` and `2a9848eee885039dfda5d576b0727233624bee7f`.

Previously existing deployments were observed, not triggered: WEP run37889569658 and LFSR run37887344830 succeeded at those exact heads. Live JavaScript and CSS assets matched the local builds byte for byte. This supports those two draft card links, not an assertion that the hub integration is deployed.

RSA Small Roots was initially empty and correctly classified as waiting for code. It acquired a source/README commit during this pass. After source and application checks, its repair is awaiting review. `rsa-small-roots-card.html` and `rsa-small-roots-review.json` contain a writer-derived staged card/pin at the inspected SHA. It remains outside the active hub index until an approved publication and served-byte check. Its source/port/dispatch inventory is registered. Next integrate its staged card, concept7/10 placement, existing-algorithm contextual Compare mapping, corpus and derived counts after that publication evidence. Blind Oracle API `4753debe9bd5852d07c2f9bcbbddc2025b343e35` remains a supporting backend; no duplicate standalone card is prepared.

Crypto Compare PR38 adds WEP/LFSR and six verified pre-existing mapping gaps under existing algorithm entries, preserving their teaching limits. Additive dataset1.2.0 and generated stats/OG report227 linked labs,100 algorithms and17 categories. A new CI production audit failure was repaired with Next.js/ESLint-config15.5.27 and transitive source-map-js1.2.2. The unchanged production audit now reports zero vulnerabilities. Publisher advisories: [Next.js first advisory](https://github.com/advisories/GHSA-4jqv-mc3x-m676),[Next.js second advisory](https://github.com/advisories/GHSA-mcj8-r9mp-w47p),[source-map-js advisory](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). Typecheck,257 unit tests,lint,build,stats,15 demo tests,strict sync against the candidate227-card hub and11 browser tests passed after patches. Counsel PR10 adds the two complete corpus entries; candidate validation passed327 entries,228 demos including snow2,and17 categories. Its CI correctly remains blocked by current Compare main’s older219 mappings. Approve/integrate the hub and Compare changes before expecting that cross-repository validation to pass. No audit or parity check was weakened.

## Source to binary provenance

| Lab | Existing work ID | Outcome and next action |
| --- | --- | --- |
| Quantum Vault KpqC | `9f99d59d-8113-43f8-8000-f659865b1762` | Blocked at main `1c1d529613cacd31b6cada53f8454fed6e28d87e`. Compiler is now available, but build-required vendor SMAUG/HAETAE sources and immutable source-to-binary mapping remain absent. Obtain those vendor sources/pins and a reproducible recipe; reuse PR14. |
| TC26 Pair | `591a521d-9e12-4d63-8b9e-d1212065171c` | Awaiting review in existing PR5. Fresh pinned upstream C sources built with actual Mac Emscripten6.0.10-git reproduce both tracked WASM binaries byte for byte. The reporter now records actual compiler paths,versions and hashes separately from selected4.0.23. Original compiler stays unknown. CI4.0.23 still builds but mismatches both binaries; retain that environment distinction. |
| Iron Serpent | `26702ea6-f3a1-4e2d-9bd5-d248c246a641` | Blocked at main `19194ac7948a743ee67c676250bf9ebdd03a9021`. Argon2 distribution fingerprints are not a source/compiler recipe. Obtain exact vendor C source and compiler/build inputs for the bundled bytes; reuse PR9. Leviathan update failure is a separate initialization API migration. |

TC26 actual commands `python3 scripts/check-wasm-provenance.py --check` and `--rebuild` passed. Fresh temporary sources rebuilt Hypericum to `9c103702c37ac855cf1e2d17d750b10ee96fc53930e7c142f8b0833b9005bace` and Shipovnik to `5cea7a780a8fa18ac6bfcf9718dda96613e3f02de1300faed58f28c8f4530a4a`. Temporary fixtures reject tampering and distinguish actual vs selected compiler. Full build logs/report are committed in PR5; no JS/WASM changed. Selected4.0.23 CI hashes remain `e1193c88c5b2b3a2bf870ef56240193069d4a1cddc9083bb21186f8664ce7cd3` and `f118ea6d7041578bf7b139bd6bf94edc52d2a0e9aae22e7f295e4a3e77b55f63`. Application success is separate from this provenance evidence.

## Verification and console synchronization

Exact command/results are saved in `hub-checks.json`,`focused-catalog-checks.json`,`catalog-scan.json`,`final-corrections-checks.json`,`runtime-checks.json`,`compare-checks.json` and `rsa-onboarding-checks.json`. Earlier failed attempts remain visible where relevant. Final hub generator,structure,vocabulary,concept,level,teach,corpus,date and focused regression checks pass; desktop1366px and mobile390px browser readbacks show227 unique cards,no duplicate DOM nodes,no errors and no horizontal overflow.

Fleet theme and gate checks pass from the real checkout. Port/census/dispatch/comment/claims checks pass after registering actual RSA source and Biham’s moved port. Network CLI verification remains incomplete: `gh repo list` is unavailable; protection queries are UNREAD/rate-limited; the earlier deployment checker exit0 over API-ERROR was a reporting defect and is not deployment proof. Catalog recall timed out and remains incomplete. Authenticated connector evidence is used for inspected PRs and specified existing/new lab runs. The entire fleet’s live deployment and protection status is not asserted.

The installed Crypto Lab · Fleet Console plugin is available. Existing findings/work IDs are reused; new tasks were created only for verified repairs. Every saved item is read back and checked against its saved revision,evidence,SHAs and PR links. Work-item and actual tool-run synchronization is recorded; no fabricated full-fleet snapshot or promotion of unverified source states is published. Unmerged catalog changes are review branches,not deployed console/catalog state.
