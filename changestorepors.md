# Changes to repositories — verification ledger

Updated 2026-10-23 (America/New_York). This file is a handoff for an
independent reviewer. It records evidence; it is not a substitute for fetching
the named commits and rerunning their checks. Nothing listed here has been
merged by this maintenance pass.

## Verification rules

1. Fetch `origin/main` and the named PR branch immediately before reviewing it.
2. Review committed objects, not another agent's working tree.
3. Confirm that the PR base and head still equal the SHAs below. If either moved,
   repeat the relevant review and tests.
4. Read complete test summaries and workflow logs. Do not infer a pass from a
   badge or from grepping for TAP text.
5. Treat deployment as unverified while a PR is open. Treat an unavailable
   provider as unknown, never as zero alerts.

## Completed work, awaiting maintainer review

### Quantum Vault KpqC

- PR: [crypto-lab-quantum-vault-kpqc #21](https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc/pull/21)
- Branch: `codex/repair-quantum-vault-kpqc-2026-10-23`
- Base: `252c7e9c749c09642e4e6ae82b7bab45ecb9d8e0`
- Head: `7443ba118b6cde2f44b8e549de821874b1fac90e`
- Scope: **64 files**, **2,921 insertions** and **2,250 deletions**. The
  development backend is now feature-gated and rejected in an ordinary release;
  the error-only `kpqc-wasm` scaffold is no longer presented as working native
  crypto; the CLI reads private keys from indexed files instead of raw argv;
  backend/algorithm IDs and native sizes fail closed; and secret buffers are
  cleared on success and error paths.
- Browser state/import handling now enforces exact algorithms, lengths, dates,
  PBKDF bounds and input-size limits. HAETAE contracts are typed and checked,
  Shamir work avoids ordinary JavaScript-array secret copies, and focused tests
  cover cleanup, state rejection, shipped-WASM contracts and workflow controls.
- Native FFI now uses the actual SMAUG mode/symbols and ABI, excludes conflicting
  RNG sources, authenticates pinned source archives before extraction, runs a
  native smoke/differential suite, and reproduces the exact four shipped loader
  and WASM artifacts. The source archive SHA-256 values are
  `2a202ba4fb3a4946d6d028aef180a1fc1637d78bdc0fe9200f6e30f2c4c71107`
  (SMAUG-T) and
  `9b69afb5fd72d8be61b994ef625ddfab2e43838f3752aaafc8071e88d136ca72`
  (HAETAE).
- Documentation now distinguishes KpqC competition selection from publication
  as a Korean Standard, states that an embedded unpinned HAETAE key does not
  authenticate the original sender, describes the password-or-KEM attack paths,
  and limits timing, zeroization and reproduction claims to the evidence actually
  present. The publication changes were checked against the official KpqC final
  selection and April 2026 status notices before editing.
- Workflow authority is split so source-reading jobs are read-only and Pages/OIDC
  authority lives in no-checkout jobs. Pull requests do not retain or deploy a
  Pages artifact; main deploys are not cancelled; Node 22/24/26 are gated; and
  only patch/minor Dependabot updates may auto-merge after successful checks.
- Authoritative Linux run:
  [39957731907](https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc/actions/runs/39957731907)
  passed the Rust default, WASM and no-default suites, release guard, clippy,
  formatting, five 30-second fuzz targets, RustSec and cargo-deny; Node 22/24/26
  each passed **88** unit tests, **14** workflow/WASM controls, **3** strict
  TypeScript controls, lint and build; Linux Chromium passed **23/23** behavior
  and accessibility tests; and native source reproduction passed. Artifact:
  [`kpqc-source-rebuild`](https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc/actions/runs/39957731907/artifacts/12503082936).
- Separate exact-head run
  [39957731774](https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc/actions/runs/39957731774)
  built all **8** fuzz targets. Its scheduled smoke job was skipped for the pull
  request as designed; the five security-boundary smoke targets ran above.
- Provider evidence at `2026-10-23T13:12:35Z`: authenticated Dependabot and
  secret-scanning endpoints each returned HTTP 200 with zero open alerts; secret
  scanning and push protection are enabled. Code scanning returned HTTP 404
  `no analysis found`, so it remains explicitly incomplete. Dependabot security
  updates are disabled, and update PR **#20** remains open. The exact npm lock
  contains **179** dependency entries and reports zero vulnerabilities at every
  severity; RustSec scanned **164** locked crate dependencies successfully.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc/pull/21#issuecomment-6365703487)
- State: Fleet item `fba6e64e-80e6-4b94-b284-ff76daf3eb51` read back complete
  at revision **4**. The PR is open, cleanly mergeable at the recorded head,
  intentionally unmerged, and deployment is unverified. Local macOS Chromium
  failed before launch and the shared Docker content store was full; no unrelated
  images were deleted, and the successful isolated Linux jobs are the browser
  and reproduction authority.

### Ratchet Wire

- PR: [crypto-lab-ratchet-wire #17](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/pull/17)
- Branch: `codex/repair-ratchet-wire-2026-10-23`
- Base: `029bff5f44e6822c17c7ce8164ecb1b5ae88d258`
- Head: `c22ad7b3aaa20797e014dd850c2d31ed5e118e17`
- Scope: **25 files**, **649 insertions** and **261 deletions**. Wire messages
  now reject malformed, non-canonical, oversized and unsafe-counter inputs
  before ratchet work; outbound plaintext has the matching 1 MiB bound; and
  failed decryption preserves receiver state while owned message, DH and KDF
  intermediates are cleared on success and error paths.
- Classical and hybrid session setup now checks public keys, signatures, KEM
  fields, nonces, ciphertext, identifiers and booleans at runtime before doing
  cryptographic work. Failed hybrid setup retains one-time prekeys and validates
  the fixed confirmation plaintext. Focused tests cover those boundaries.
- The lesson no longer claims that a signature under an in-band identity proves
  the identity belongs to Bob. It accurately teaches that the signature binds a
  pre-key to the supplied signing identity, while a fully substituted valid
  bundle is accepted until the fingerprint is pinned or compared through a
  trusted channel. The correction was checked against Signal X3DH section 4.1;
  the existing PQXDH initial-ciphertext construction was also checked and left
  unchanged because the specification permits it.
- Workflow authority is split so source-reading jobs are read-only and Pages/OIDC
  authority lives in no-checkout jobs. Pull requests neither retain nor deploy a
  Pages artifact, Node 22/24/26 are gated, main deploys are not cancelled, and
  only successful patch/minor Dependabot updates may auto-merge. Merge and
  deployment dispatch failures now fail closed. The publishing control also
  works with non-adjacent npm/Node installations such as Homebrew.
- Authoritative Linux run:
  [39963878702 attempt 2](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/actions/runs/39963878702/attempts/2)
  passed **82/82** unit tests, **2/2** publishing controls, **6/6** workflow
  controls, **5/5** compiler controls and a production build independently on
  Node 22, 24 and 26. Chromium, Firefox and WebKit ran all **54** Playwright
  cases: **50 passed** and **4 intentionally skipped**.
- The prior-head browser run found one stale locator after the teaching button
  was renamed; commit `c22ad7b` corrected it. The first corrected-head attempt
  was cancelled after its runner spent more than ten minutes stuck installing
  browsers, while its three Node lanes were already green. The clean replacement
  attempt used a fresh runner and completed normally; neither event was hidden.
- Exact-lock evidence: **101** dependency nodes, no `npm ls` problems and zero
  npm advisories at every severity. Authenticated provider evidence at
  `2026-10-23T14:02:03Z` returned zero open Dependabot alerts and zero open
  secret-scanning alerts, with secret scanning and push protection enabled.
  Code scanning returned HTTP 404 `no analysis found`, so it remains explicitly
  incomplete. Dependabot security updates and automated security fixes were
  observed disabled and were not changed.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-ratchet-wire/pull/17#issuecomment-6366692468)
- State: Fleet item `75d962ab-e4eb-45cf-9424-53196d255571` read back complete
  at revision **3**. The PR is open, cleanly mergeable at the recorded head,
  intentionally unmerged, and deployment is unverified. Local macOS Chromium
  failed before application launch and the shared Docker content store was full;
  no shared images were pruned, and the successful isolated Linux job is the
  three-browser authority.

### Reshare Circle

- PR: [crypto-lab-reshare-circle #23](https://github.com/systemslibrarian/crypto-lab-reshare-circle/pull/23)
- Branch: `codex/repair-reshare-circle-2026-10-23`
- Base: `bdba3dc208b0bf347e9f06e20f001dbec2b7f3f5`
- Head: `3aaae4e331bc85b40b31e8541840de8e7d7afc14`
- Scope: **20 files**, **639 insertions** and **158 deletions**. The prior
  verifier accepted commitment vectors without enforcing the advertised
  threshold degree and sliced sub-share arrays instead of requiring an exact
  receiver count. A correctly committed higher-degree update could therefore
  pass verification, leave the state labelled `t`, make `t` shares stop
  reconstructing, and leave the folded public commitments inconsistent with
  the new shares.
- Reshare application now checks exact protocol shapes, canonical scalar and
  subgroup encodings, valid and unique dealers, internally consistent epoch
  state, nonzero aggregate updates and preservation of the advertised degree.
  Reconstruction, redistribution and mobile-adversary inputs fail closed. The
  deliberately unchecked teaching counterfactual has a separate explicit API,
  while the normal adversary simulation runs the real verifier.
- Deterministic regressions cover the higher-degree defect, truncated/extended
  arrays, non-canonical values, missing dealings, empty and cancelling updates,
  duplicate dealers and thefts, invalid quorum coordinates, and the valid rare
  case where a nonzero refresh evaluates to zero at one share coordinate.
- README and UI prose no longer claim every numeric share must change, that old
  same-epoch quorums become worthless, or that the teaching page never
  reconstructs. Named vendor adoption claims without primary evidence were
  removed. The HJKY title, authors, venue and DOI were checked against the
  official Springer chapter before linking the citation.
- Workflow authority is split so repository code runs read-only and Pages/OIDC
  authority exists only in no-checkout jobs. Pull requests retain no Pages
  bundle, Node 22/24/26 and the browser suite gate publication, main deploys are
  not cancelled, and only successful patch/minor Dependabot updates can
  auto-merge. Seven executable controls pin those properties.
- Authoritative Linux run:
  [39969438438](https://github.com/systemslibrarian/crypto-lab-reshare-circle/actions/runs/39969438438)
  passed **44/44** unit tests, **7/7** workflow controls, TypeScript and the
  production build independently on Node 22, 24 and 26. Linux Chromium passed
  all **19/19** behavior and accessibility tests: two WCAG state sweeps and 17
  application-claim tests.
- Exact-lock evidence: **68** dependency nodes and zero npm advisories at every
  severity. `npm ls --all` resolved the installed tree; absent entries were
  declared platform/feature optional dependencies, not dependency errors.
  Authenticated provider evidence at `2026-10-23T14:27:50Z` returned zero open
  Dependabot alerts and zero open secret-scanning alerts, with secret scanning
  and push protection enabled. Code scanning returned HTTP 404 `no analysis
  found`, so it remains explicitly incomplete. Dependabot security updates were
  observed disabled and were not changed.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-reshare-circle/pull/23#issuecomment-6367234972)
- State: Fleet item `e9291ee7-2885-40bf-8578-ebe454d38010` read back complete
  at revision **3**. The PR is open, cleanly mergeable at the recorded head,
  intentionally unmerged, and the live Pages deployment is unverified. Local
  macOS Chromium failed before application launch; the successful Linux job is
  the browser authority.

### Nonce Lattice

- PR: [crypto-lab-nonce-lattice #27](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/pull/27)
- Branch: `codex/repair-nonce-lattice-2026-10-23`
- Base: `6cd0b424d212f330debee615b026893339e7c135`
- Head: `cbccecb2f0a38ebc58bd2fce3acba13853f31651`
- Scope: **26 files**, **710 insertions** and **262 deletions**. Untrusted
  shared-origin configuration values could reach `innerHTML`; impossible nonce
  ranges could loop forever; and invalid custom nonces could be replaced by a
  random nonce while the UI still described the requested leak. Runtime config,
  scalar, hex, modular-arithmetic, public-key and worker boundaries now fail
  closed, rendered values are escaped, and nonce sampling is bounded.
- Regressions cover stored-config markup injection, impossible constant-prefix
  inputs, invalid and non-canonical scalars, malformed public keys, exact
  protocol shapes and the RFC 6979 P-256/SHA-256 Appendix A.2.5 vector.
- Accuracy repairs distinguish the on-screen bit-count heuristic from a hard
  recovery boundary; state the assumptions around the Nguyen–Shparlinski
  asymptotic result; limit RFC 6979's defense claim to RNG-driven bias/reuse;
  correct TPM-FAIL sample counts; narrow the Android and PS3 narratives; and
  replace unrelated ePrint references with the verified publication records.
  RFC 6979, both lattice-paper records, Minerva, TPM-FAIL, Bitcoin.org,
  OpenSSL CVE-2026-54872 and the official 27C3 slides were checked before the
  citations or claims changed.
- Workflow authority is split so repository code runs read-only while Pages and
  OIDC authority exists only in no-checkout jobs. Pull requests keep no Pages
  artifact, Node 22/24/26 and the browser gate block publication, main deploys
  are not cancelled midway, and only successful patch/minor Dependabot updates
  may auto-merge. Seven executable controls pin those properties.
- Authoritative Linux run:
  [39972898369](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/actions/runs/39972898369)
  passed **46/46** unit tests across 12 files, **7/7** workflow controls,
  TypeScript and the production build independently on Node 22, 24 and 26.
  Ubuntu Chromium passed all **20/20** behavior, security-regression, claim and
  WCAG A/AA tests.
- Exact-lock evidence: **68** dependency nodes, a successful `npm ls --all`,
  and zero npm advisories at every severity. Authenticated provider evidence at
  the exact head returned zero open Dependabot alerts and zero open
  secret-scanning alerts, with secret scanning and push protection enabled.
  GitHub returned HTTP 404 `no analysis found` for code scanning, so that
  evidence remains explicitly incomplete. Dependabot security updates and
  automated security fixes were observed disabled and were not changed.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-nonce-lattice/pull/27#issuecomment-6367747115)
- State: Fleet item `8c7d7401-76c3-4721-8c71-f0658c84b574` read back complete
  at revision **3**. A fresh 49-PR GraphQL readback found this PR open,
  non-draft, cleanly mergeable and green at its exact head. It remains
  intentionally unmerged; no deployment was performed and the live Pages site
  was not used as evidence. Local macOS Chromium failed before page creation;
  the successful Ubuntu job is the browser authority.

### NTRU Classic

- PR: [crypto-lab-ntru-classic #24](https://github.com/systemslibrarian/crypto-lab-ntru-classic/pull/24)
- Branch: `codex/repair-ntru-classic-2026-10-23`
- Base: `df32c561aaa46be4032edbb152722b86ee4fa985`
- Head: `f81f1ce3581c3046f9438ba2a8a2e1a16a7cd010`
- Scope: **18 files**, **642 insertions** and **181 deletions**. Runtime
  boundaries now reject malformed keys, ciphertexts, messages, witnesses and
  polynomial parameters; bounded rejection sampling replaces modulo-biased
  sampling; inverse helpers validate their rings; and a Gauss-reduction step
  limit reports exhaustion instead of falsely declaring success.
- Publication review found that the demo is a hybrid, not a published NTRU
  parameter set: it combines the original HPS equations and distribution shapes
  with a demo-chosen flat `df = dg = dr = 143` profile at the NTRU-443 scale.
  README, UI and key-generation logs now say that explicitly and transfer no
  security or wire-size estimate. The original paper's
  `f in L(df,df-1)` and `g,r in L(d,d)` shapes were verified and retained; the
  superficially tempting change to a balanced `f` was rejected.
- Accuracy repairs remove an unsupported `~2^-80` decryption-failure estimate,
  a false `~609 bytes` wire-size claim, global patent-expiry language and the
  claim that NTRU was selected by NIST. The standards timeline, NIST selection
  history, 2007 US patent dedication, sparse-coefficient counts, quantum/lattice
  wording and raw-scheme tamper semantics were checked against the primary
  publications before editing. A retained-plaintext comparison is no longer
  presented as standalone ciphertext integrity.
- The verifier now actually executes the production build instead of printing
  an unconditional pass, and the inverse regression uses a genuinely
  invertible monomial with an exact expected inverse. Focused tests cover the
  new input boundaries, sampler and workflow invariants. An additional local
  1,000 round trips across 10 keys had zero failures and a minimum centered
  decode margin of **816**.
- Workflow authority is split so repository code runs read-only and Pages/OIDC
  authority exists only in no-checkout jobs. Pull requests retain and publish
  no Pages artifact, Node 22/24/26 plus the browser gate block publication,
  main deployments are not cancelled, and only successful patch/minor
  Dependabot updates may auto-merge. Seven executable controls pin those rules.
- Authoritative Linux run:
  [39977313134](https://github.com/systemslibrarian/crypto-lab-ntru-classic/actions/runs/39977313134)
  passed **60/60** unit tests, **12/12** real verification gates, **7/7**
  workflow controls, TypeScript and the production build independently on Node
  22, 24 and 26. Linux Chromium passed all **10/10** behavior and accessibility
  tests, including publication boundaries, tamper semantics and lattice claims.
- Exact-lock evidence: `npm audit` reported zero vulnerabilities and
  `npm ls --all` exited successfully; omitted packages were ordinary optional
  platform dependencies. Authenticated provider evidence at the exact head
  returned zero open Dependabot alerts and zero open secret-scanning alerts.
  GitHub returned HTTP 404 `no analysis found` for code scanning, so that
  evidence remains explicitly incomplete.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-ntru-classic/pull/24#issuecomment-6368325998)
- State: Fleet item `bebeaf26-38ac-4747-ae6c-48f8396a79ac` read back complete
  at revision **3**. A fresh 50-PR GraphQL readback found this PR open,
  non-draft, cleanly mergeable and green at its exact head. It remains
  intentionally unmerged; no deployment was performed. Local macOS Chromium
  failed during Mach-port bootstrap before any assertion; the successful Linux
  job is the browser authority.

### Oblivious Shelf

- PR: [crypto-lab-oblivious-shelf #21](https://github.com/systemslibrarian/crypto-lab-oblivious-shelf/pull/21)
- Branch: `codex/repair-oblivious-shelf-2026-10-23`
- Base: `13bf4fd8b0f560b717cbba7d1158e58a247d7339`
- Head: `02a45933d2ad23f6dc9d0f744fdcbbe2267a3c02`
- Commits: `36b6ca3096b2022f9312c17043c1db3c3e35d896` repairs the
  implementation, claims and workflow evidence; `02a45933d2ad23f6dc9d0f744fdcbbe2267a3c02`
  keeps inline source links visibly distinct after the first Linux accessibility
  run found that they relied on color alone.
- Scope: **9 files**, **439 insertions** and **168 deletions**. PIR inputs now
  fail closed on malformed or out-of-range databases, query indices, key sets
  and target sets; the implementation caps databases at one million bits,
  snapshots caller-owned data and chunks Web Crypto work instead of issuing an
  unbounded request. Focused regressions cover those boundaries and preserve
  valid queries.
- Documentation and UI now state the actual one-bit, two-server information-
  theoretic demo boundary, including non-collusion, metadata and deployment
  assumptions. The Dvir-Gopi, RAID-PIR, Popcorn and PIR-Tor descriptions were
  checked against their publications. Section 215 expiration and National
  Security Letter distinctions were checked against current US Code and the
  cited library testimony before editing; no RFC, standard name or year was
  changed by pattern matching.
- Workflow authority is split so repository code runs read-only and Pages/OIDC
  credentials exist only in no-checkout jobs. Pull requests retain no Pages
  artifact, main deployments are not cancelled, Node 22/24/26 block publishing,
  and dependency auto-merge is patch/minor-only and fail-closed. Six executable
  controls pin those rules.
- Authoritative Linux run:
  [39980416851](https://github.com/systemslibrarian/crypto-lab-oblivious-shelf/actions/runs/39980416851)
  passed `npm ci`, zero-vulnerability audit, **31/31** PIR tests, **6/6**
  workflow-control tests and the production build independently on Node 22, 24
  and 26. Linux Chromium passed all **13/13** tests: two WCAG A/AA desktop/mobile
  drives and eleven functional/claim checks. The earlier run's two color-only
  link failures were fixed before this green rerun rather than ignored.
- Local verification also passed the exact install, unit/workflow suites,
  production build, `npm audit`, `npm ls --all`, YAML parsing and
  `git diff --check`. Local macOS Chromium failed during Mach-port bootstrap
  before any assertion; the successful Linux job is the browser authority.
- Authenticated provider evidence returned zero open Dependabot alerts and zero
  open secret-scanning alerts, with secret scanning and push protection enabled.
  GitHub returned HTTP 404 `no analysis found` for code scanning, so that
  evidence remains explicitly incomplete. Dependabot security updates were
  observed disabled and were not changed.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-oblivious-shelf/pull/21#issuecomment-6368757731)
- State: Fleet item `e2b8ae72-f38b-4e5a-addf-62de07a6f81b` read back complete
  at revision **3**. The PR is open, non-draft, cleanly mergeable and green at
  the recorded head. It remains intentionally unmerged; no deployment was
  performed or claimed.

### Opaque Gate

- PR: [crypto-lab-opaque-gate #34](https://github.com/systemslibrarian/crypto-lab-opaque-gate/pull/34)
- Branch: `codex/repair-opaque-gate-2026-10-23`
- Base: `6fffc04fec90bb396016dfa12f8bd0a9f862823f`
- Head: `131cb9f33ee28c2c38fe5fda7f697aee283c5aa1`
- Commits: `4b17e9c` hardens the protocol and deployment boundaries;
  `131cb9f` aligns one browser regression with the corrected deployment claim.
- Scope: **14 files**, **725 insertions** and **207 deletions**. OPRF, envelope,
  KE1/KE2/KE3, key-schedule and AEAD boundaries now reject malformed lengths,
  non-canonical P-256 encodings, mismatched keypairs and ambiguous ephemeral
  state. Caller-owned nonces, OPRF keys and protocol state are copied, inputs
  are bounded, and the UI restores its action button through `try/finally`.
- Accuracy repairs distinguish raw OPRF output from `randomized_password` and
  remove claims that a stolen database is useless, pre-computation is
  impossible, rate limiting prevents offline guessing, or a strong password is
  automatically out of reach. The stale 10-test count, unsupported 1Password
  OPAQUE claim, overbroad WCAG language and adjacent-system descriptions were
  corrected. RFC 9807, RFC 9497, current OWASP guidance, Meta's WhatsApp
  deployment, Cloudflare, Apple Private Cloud Compute and the 1Password
  whitepaper/CPace material were checked before changing those claims.
- Workflow authority is split so repository code runs read-only while Pages and
  OIDC write scopes exist only in no-checkout jobs. Pull requests cannot retain
  or publish a Pages artifact, Node 22/24/26 quality gates block the browser and
  deploy jobs, main deployments are not cancelled, and dependency automation is
  patch/minor-only and fail-closed. All actions are pinned to verified release
  SHAs, with seven executable controls covering those invariants.
- Authoritative Linux run:
  [39984273312](https://github.com/systemslibrarian/crypto-lab-opaque-gate/actions/runs/39984273312)
  passed the clean install, high-severity audit, **21/21** protocol/boundary
  tests, **7/7** workflow controls and production build on Node 22, 24 and 26.
  Linux Chromium passed all **6/6** claim, behavior and accessibility tests. An
  earlier run's one wording-only assertion failure was corrected and rerun
  rather than ignored.
- Local verification passed the same 21 protocol tests, seven workflow tests,
  strict production build, zero-vulnerability `npm audit`, clean `npm ls`, YAML
  parsing and `git diff --check`. Local macOS Chromium died during Mach-port
  bootstrap before assertions; the successful Linux job is the browser
  authority.
- Authenticated Dependabot evidence used the current cursor-based GitHub API,
  exhausted its Link pagination and found zero open alerts. The initial legacy
  `page=1` request returned HTTP 400 and was not misread as an empty result.
  Exact-lock `npm audit` also found zero vulnerabilities. No uncollected
  provider was silently converted into a clean result.
- State: Fleet item `a1c75cc7-0b77-4eed-b3d0-e27633375a3f` read back complete
  at revision **4**. A fresh 52-PR GraphQL readback found this PR open,
  non-draft, cleanly mergeable and green at its exact head. It remains
  intentionally unmerged and undeployed.

### ORAM Vault

- PR: [crypto-lab-oram-vault #30](https://github.com/systemslibrarian/crypto-lab-oram-vault/pull/30)
- Branch: `codex/repair-oram-vault-2026-10-23`
- Base: `8a2aa66111da27768a42510c02a2391ee409f1e6`
- Head and commit: `921428c083692821539c45ce22267d3b347f4354`
  hardens the protocol, UI and deployment boundaries.
- Scope: **17 files**, **1,128 insertions** and **611 deletions**. Initialization
  now reabsorbs real blocks before overwriting shared path buckets, so every
  logical block survives setup exactly once. Client accesses serialize mutable
  state and fail closed on missing, duplicated, malformed, tampered, wrong-key
  or stale-generation data. Server paths validate and copy every fixed-size
  blob before an atomic write; returned bytes and tree snapshots no longer
  alias owned state.
- AES-256-GCM keys are non-extractable and use a private random prefix plus a
  monotonic per-key counter to prevent nonce reuse within the supported space.
  Oversized binary and UTF-8 inputs are rejected instead of truncated, stash
  plaintext is rendered through text nodes, and overlapping tree controls no
  longer race a replaced client.
- Accuracy repairs qualify the 1996 Goldreich–Ostrovsky lower bound, add the
  general Larsen–Nielsen result and OptORAMa, distinguish research prototypes
  from deployments, identify Obladi as Ring-ORAM-based, retain visible timing
  leakage, and explain that AES-GCM does not provide path completeness or
  freshness. Path ORAM, Goldreich–Ostrovsky, Larsen–Nielsen, OptORAMa,
  ZeroTrace, OBLIVIATE, Obladi and Onion ORAM publications were checked before
  changing those names, dates or construction relationships.
- Workflow authority is split so repository code runs read-only and Pages/OIDC
  credentials exist only in a no-checkout deploy job. Pull requests cannot
  package a Pages artifact, main deployments are not cancelled, Node 22/24/26
  quality gates block the browser job, and Dependabot auto-merge is patch/minor
  only and fail-closed. All five actions are pinned to independently resolved
  release SHAs, with seven executable policy controls.
- Authoritative Linux run:
  [39988138511](https://github.com/systemslibrarian/crypto-lab-oram-vault/actions/runs/39988138511)
  passed clean install, zero-vulnerability audit, typecheck, **48/48**
  unit/boundary tests, **7/7** workflow controls and production build on Node
  22, 24 and 26. Linux Chromium passed all **17/17** claim, behavior and WCAG
  A/AA tests in 29.2 seconds; PR artifact, deploy and dependency-merge jobs were
  correctly skipped.
- Local verification passed the same deterministic gates, coverage at
  **90.85%** statements / **94.42%** lines, clean `npm ls --all`, YAML parsing,
  action-SHA resolution and `git diff --check`. Local macOS Chromium died at Mach
  bootstrap before assertions. A separate Linux-container attempt also never
  launched because Docker's internal storage was full; neither was counted as
  a test result, and the successful Linux workflow is the browser authority.
- Authenticated cursor-based provider reads found zero open Dependabot alerts
  and zero open secret-scanning alerts, with secret scanning and push protection
  enabled. GitHub returned HTTP 404 `no analysis found` for code scanning, so
  that evidence remains explicitly incomplete. Dependabot security updates were
  observed disabled and were not changed.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-oram-vault/pull/30#issuecomment-6370060864)
- State: Fleet item `3f2be34b-4e8c-4a27-8213-85da5c15a172` read back complete
  at revision **3** with exact start/end SHAs. PR #30 is open, non-draft,
  cleanly mergeable and green at the recorded head. It remains intentionally
  unmerged; no live Pages deployment was performed or claimed.

### Order Leak

- PR: [crypto-lab-order-leak #14](https://github.com/systemslibrarian/crypto-lab-order-leak/pull/14)
- Branch: `codex/repair-order-leak-2026-10-23`
- Base: `37b98a13be0293ca2dfd857604e23c4da244ec9a`
- Head and commit: `8a0b35eb247174dbe0819dfd13965edf1c814b4c`
  hardens state transitions, evidence gates and dependency automation.
- Scope: **11 files**, **421 insertions** and **64 deletions**. Row resealing is
  transactional and generation-bound, so overlapping row-count changes cannot
  pair a new plaintext table with an older sealed table. Delayed randomized
  queries capture their experiment and cannot overwrite a newer column,
  scheme, population or row-count selection. Recovery controls remain disabled
  while resealing, and a failed seal retains the last coherent table.
- The shifted age auxiliary population now actually moves eight percent of its
  low-age mass to age 65 while retaining dense support; the mismatch fixture
  removes 65. Unit and browser regressions distinguish matching, shifted and
  mismatched inference and cover both asynchronous races.
- AES-GCM-SIV/RFC 8452, Boldyreva–Chenette–Lee–O'Neill OPE,
  Chenette–Lewi–Weis–Wu ORE, Naveed–Kamara–Wright inference attacks, and the
  cited Durak and Grubbs publications were checked before retaining the lab's
  terminology and claims. No publication number or year was changed by
  pattern matching.
- Repository code now runs read-only; Pages/OIDC authority exists only in a
  no-checkout deploy job. The protected `build` and `verdict-coverage`
  contexts remain present, with verdict coverage failing closed unless every
  upstream gate succeeds. Node 22/24/26, exact-lock audit, unit, workflow,
  browser and live mutation gates are explicit. Dependabot auto-merge is
  patch/minor only; major or unknown updates remain human-reviewed and
  merge/dispatch exhaustion fails closed. Eight executable policy tests guard
  these controls.
- Authoritative Linux run:
  [39992669360](https://github.com/systemslibrarian/crypto-lab-order-leak/actions/runs/39992669360)
  passed clean installs, zero-vulnerability high audits, **30/30** unit tests,
  **8/8** workflow controls and the production build on Node 22, 24 and 26.
  Linux Chromium passed **22/22** claim, race, WCAG A/AA and verdict tests. The
  mutation baseline was green with **20** specs, then all **12/12** recorded
  mutations were killed with **0 survived** and **0 neither**. The required
  verdict job separately passed **20/20** claim/verdict specs; PR deploy and
  dependency-merge jobs were correctly skipped.
- Local verification passed the high-severity audit, **30/30** unit tests,
  **8/8** workflow controls, a 27-module production build, clean dependency
  resolution, YAML parsing, and the 12-record/14-edit mutation preflight.
  Chromium failed during macOS Mach bootstrap and Firefox aborted before any
  assertion. The local mutation runner correctly stopped when its unmutated
  browser baseline could not run; no local browser or mutation pass is claimed.
- Authenticated provider reads found zero open Dependabot alerts and zero open
  secret-scanning alerts, with secret scanning and push protection enabled.
  GitHub returned HTTP 404 `no analysis found` for code scanning, so that
  evidence remains explicitly incomplete. Dependabot security updates were
  observed disabled and were not changed.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-order-leak/pull/14#issuecomment-6370548754)
- State: Fleet item `5e9e35d1-4c92-49a6-936a-6ba0d0ffff50` read back complete
  at revision **3** with exact start/end SHAs. PR #14 is open, non-draft,
  cleanly mergeable and green at the recorded head. It remains intentionally
  unmerged; no live Pages deployment was performed or claimed.

### OT Gate

- PR: [crypto-lab-ot-gate #26](https://github.com/systemslibrarian/crypto-lab-ot-gate/pull/26)
- Branch: `codex/repair-ot-gate-2026-10-23`
- Base: `32efdf590b9cbc2d5b93639bdf1cff3a148d145e`
- Head and commit: `e4dcca4e6be2c36d39cb0c6e0a91fc4f10be964b`
- Scope: **12 files**, **437 insertions** and **112 deletions**. The original
  clone was fetched and clean; the base stayed unchanged through the final
  re-fetch, and all work used an isolated worktree from committed state.
- Fixed: scalar generation now uses exact Ed25519 subgroup rejection sampling.
  Receiver and DDH scalars cover the complete subgroup including zero, while
  sender secrets remain exactly uniform and nonzero. Explicit zero-scalar point
  handling and forced boundary tests make the page's identical-distribution
  claim true rather than approximately true.
- Fixed: `randomIndex` rejects bounds beyond its 32-bit sample space; extension
  receiver choices are copied before awaited work; and message/choice controls
  stay bound to in-flight or completed evidence until reset. Unit and browser
  regressions exercise each boundary or race.
- Corrected only unsupported deployment prose: MASCOT is described as an
  OT-based preprocessing route for SPDZ-style MPC; Google's published deployed
  private intersection-sum protocol is distinguished from its random-OT
  alternatives; Meta's published PSI application is not called an IKNP
  deployment; and Path ORAM/PySyft OT claims without primary support were
  removed. Chou–Orlandi, its later security analyses, IKNP, MASCOT, Google,
  Meta, EMP, Path ORAM and the current VDAF Internet-Draft were checked first.
- Repository code now runs read-only and actions are pinned. Pages/OIDC
  authority exists only in the no-checkout deploy job. Node 22/24/26,
  exact-lock audit, unit, workflow, browser and live mutation gates feed the
  existing `build` context as an aggregate fail-closed gate. Dependabot merge
  automation is patch/minor only, verifies that the merge actually landed, and
  fails closed if merge or deploy dispatch does not complete.
- Authoritative Linux run:
  [39996221650](https://github.com/systemslibrarian/crypto-lab-ot-gate/actions/runs/39996221650)
  passed clean installs, zero-vulnerability high audits, typechecks,
  **44/44** Vitest tests, **6/6** mutation-report tests, **8/8** workflow
  controls and the 28-module build on Node 22, 24 and 26. Linux Chromium passed
  **28/28** production-browser claim, race, ANDOS and WCAG A/AA checks. The
  mutation baseline was green and all **10/10** live mutations were killed,
  each with a non-empty source diff, changed bundle, exact red owner and exact
  green/hash restoration. Aggregate `build` passed; deploy and auto-merge were
  correctly skipped.
- Local verification passed the non-browser gates. Chromium failed before any
  assertion at macOS Mach rendezvous error 141, so the local mutation runner
  correctly stopped at its required unmutated browser baseline before applying
  mutation 1. No local browser or mutation pass is claimed.
- Authenticated complete-page provider reads found zero open Dependabot alerts
  and zero open secret-scanning alerts, with secret scanning and push
  protection enabled. GitHub returned HTTP 404 `no analysis found` for code
  scanning, so that evidence remains explicitly incomplete. Dependabot security
  updates were observed disabled and were not changed.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-ot-gate/pull/26#issuecomment-6371008695)
- State: Fleet item `ed693591-071e-49c0-a61b-47c83dc25eac` read back complete
  at revision **3** with exact start/end SHAs. PR #26 is open, non-draft,
  cleanly mergeable and green at the recorded head. It remains intentionally
  unmerged; no live Pages deployment was performed or claimed.

### OTP Vault

- PR: [crypto-lab-otp-vault #26](https://github.com/systemslibrarian/crypto-lab-otp-vault/pull/26)
- Branch: `codex/repair-otp-vault-2026-10-23`
- Base: `04b056901a337a23cafc9340e8e8bf36b01fc06b`
- Head: `e1d30bad776a6ce40cb5acf2addf538ec1720bb9`
- Commits: `bd0f5f56fd46db081889cdaf053ff4720db6233e` repairs the
  lab and gates; `e1d30bad776a6ce40cb5acf2addf538ec1720bb9` records the
  reproduced mutation evidence.
- Scope: **22 files**, **699 insertions** and **134 deletions**. The original
  clone was clean; freshly fetched `origin/main` remained unchanged through
  the final checkpoint, and all reads and edits used an isolated worktree from
  committed source.
- Fixed: all user-controlled byte-column exhibits now reject inputs above 512
  bytes before random generation, XOR work or DOM rendering. The reusable key
  helper fills requests in Web Crypto's 65,536-byte quota-sized chunks and
  rejects invalid lengths. Tests cover the quota and every UI boundary.
- Fixed: imported hex no longer deletes an embedded `0x` and silently changes
  the ciphertext; whitespace, commas, trailing separators and token-leading
  prefixes remain supported. Contradictory overlapping crib pins are rejected
  instead of overwriting earlier bytes, and pinned guesses are described as
  candidate hypotheses rather than recovered facts.
- Corrected: the perfect-secrecy explanation now says why both facts matter:
  every same-length plaintext has a corresponding key, and a fresh independent
  uniform pad gives those keys equal probability, so the ciphertext preserves
  the plaintext prior. Shannon, Boneh-Shoup and Katz-Lindell material was
  checked before editing. The existing RFC 8439 and NIST SP 800-38A nonce-
  reuse claims were also checked; no publication identifier or year changed.
- Repository code now runs read-only under immutable action pins. Pages/OIDC
  authority exists only in the no-checkout deploy job. Node 22/24/26,
  exact-lock audits, typechecks, unit, workflow-control, browser and live
  mutation jobs feed the existing `build` context as a fail-closed aggregate.
  Main deployments are not cancelled, PRs do not upload Pages artifacts, and
  only successful patch/minor Dependabot updates may auto-merge; major updates
  remain for human review.
- Authoritative exact-head Linux run:
  [40000360224](https://github.com/systemslibrarian/crypto-lab-otp-vault/actions/runs/40000360224)
  passed clean installs, zero-vulnerability high audits, typechecks,
  **67/67** Vitest tests, **8/8** executable workflow controls and the
  24-module build on Node 22, 24 and 26. Linux Chromium passed **28/28** claim,
  regression, prior and WCAG A/AA checks. The mutation runner printed
  `baseline: unmutated copy PASSES` and `all 9 mutation(s) caught`; every
  mutant moved the bundle, failed its named assertion owner with retries off,
  restored the exact bundle hash and returned its owner green. Aggregate
  `build` passed; deploy and auto-merge were correctly skipped.
- Mutation artifact
  [12521866514](https://github.com/systemslibrarian/crypto-lab-otp-vault/actions/runs/40000360224/artifacts/12521866514)
  reproduced committed `mutation-evidence.json` byte-for-byte at SHA-256
  `b7a7e2c086fa82ae6a8d9287b7aef69363bd4cd222ce29098ace09fb20f27e23`.
- Local unit, workflow, build, exact-lock and audit checks passed. Playwright
  enumerated all 28 tests, but local Chromium failed before every assertion at
  macOS Mach rendezvous error 141. No local browser or mutation pass is
  claimed; the exact-head Linux jobs are the authority.
- Authenticated complete current reads found zero open Dependabot alerts and
  zero open secret-scanning alerts, with secret scanning and push protection
  enabled. The sole historical Dependabot alert is fixed. GitHub returned HTTP
  404 `no analysis found` for code scanning, so that evidence remains
  explicitly incomplete. Dependabot security updates were observed disabled
  and were not changed.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-otp-vault/pull/26#issuecomment-6371619278)
- State: Fleet item `7ad8972a-0cc4-4096-98bb-12e8e484137c` read back complete
  at revision **3** with exact start/end SHAs. PR #26 is open, non-draft,
  cleanly mergeable and green at the recorded head. It remains intentionally
  unmerged; no live Pages deployment was performed or claimed.

### crypto-counsel corpus review

- PR: [crypto-counsel #18](https://github.com/systemslibrarian/crypto-counsel/pull/18)
- Base: `cc2979bbba1dca808bfb9005496c82b54b2f180c`
- Head: `73c8955c6fa150836d60ff157ca269f7abf1d7c6`
- Result: re-derived **28** stale entries; **16 accurate**, **12 corrected** and
  **0 cannot-determine**. All **190** entries with `reviewed: null` remained
  untouched. Entry count and the minified, one-line, no-trailing-newline format
  were preserved.
- Required verification: `node scripts/validate.mjs`, both Node test files,
  `node scripts/mutations.mjs`, then the Hub corpus sync and freshness checks
  documented in the PR.
- Stacked follow-up: [crypto-counsel #19](https://github.com/systemslibrarian/crypto-counsel/pull/19),
  base `73c8955c6fa150836d60ff157ca269f7abf1d7c6`, head
  `8618c8a94da29b4631100214e2783b2231ba184e`, refreshes the README snapshot
  prose. It must not be evaluated against counsel `main` without #18 beneath it.

### Protocol Compose

- PR: [crypto-lab-protocol-compose #23](https://github.com/systemslibrarian/crypto-lab-protocol-compose/pull/23)
- Base: `5dd48e8f4abf8d222985d1578da699c61c07b0ee`
- Head: `c82da95e4db664688df254027bd913e662ba7ef4`
- Authoritative Linux run:
  [39941186545](https://github.com/systemslibrarian/crypto-lab-protocol-compose/actions/runs/39941186545)
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-protocol-compose/pull/23#issuecomment-6363154572)
- State: Fleet item complete; PR open, cleanly mergeable at the recorded head,
  intentionally unmerged, and deployment unverified.

### PSI Gate

- PR: [crypto-lab-psi-gate #28](https://github.com/systemslibrarian/crypto-lab-psi-gate/pull/28)
- Base: `f4c3181c83ba13231e3f50424c4cead95ee306f8`
- Head: `7157bf73ed9b6d4cb3efe122553c8cf4501bf3fb`
- Fixed: reversed dictionary-attack semantics; the false claim that bare
  OPRF-PSI prevents enumeration; response-batch truncation/extension handling;
  inaccurate protocol/deployment claims; and over-privileged or fail-open
  CI/deploy controls.
- Authoritative Linux run:
  [39943226236](https://github.com/systemslibrarian/crypto-lab-psi-gate/actions/runs/39943226236)
  passed Node 22/24 typechecks, **44/44** unit tests, builds and audits;
  **22/22** Playwright tests; and **2/2** focused accessibility tests.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-psi-gate/pull/28#issuecomment-6363451588)
- Provider evidence at review time: zero open Dependabot alerts and zero open
  secret-scanning alerts; secret scanning and push protection enabled. GitHub
  returned `no analysis found` for code scanning, so no clean code-scanning
  claim was made.
- State: Fleet item complete; PR open, cleanly mergeable at the recorded head,
  intentionally unmerged, and deployment unverified.

### Pulse Chain

- PR: [crypto-lab-pulse-chain #5](https://github.com/systemslibrarian/crypto-lab-pulse-chain/pull/5)
- Base: `2dc17f8647a4219557139bd9b94dd7a83d8fe74a`
- Head: `202c287dd311524915642a1801520ee12c576355`
- Fixed: repository code no longer runs with Pages/OIDC write authority; PRs
  cannot publish artifacts or deploy; main deploys are no longer cancelled;
  major Dependabot updates remain human-reviewed; exhausted merge retries fail
  closed; and README/config prose now uses the catalogued Playwright port 4717.
- Authoritative Linux run:
  [39944842583](https://github.com/systemslibrarian/crypto-lab-pulse-chain/actions/runs/39944842583)
  passed Node 22/24 builds, typechecks, audits and **52/52** tests in each lane,
  plus **32/32** production-browser checks.
- Fresh live-source run:
  [39944346982](https://github.com/systemslibrarian/crypto-lab-pulse-chain/actions/runs/39944346982)
  reproduced NIST pulse **#1995909**, retained the explicitly demonstrated
  signature/certificate mismatch, and verified current drand default and
  quicknet rounds including their derived randomness.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-pulse-chain/pull/5#issuecomment-6363672315)
- Provider evidence at review time: zero open Dependabot alerts and zero open
  secret-scanning alerts; zero advisories across **90** exact locked
  package/version pairs. Code scanning returned `no analysis found` and remains
  explicitly incomplete.
- State: Fleet item complete; PR open, cleanly mergeable at the recorded head,
  intentionally unmerged, and deployment unverified.

### Quantum Entropy

- PR: [crypto-lab-quantum-entropy #23](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/pull/23)
- Base: `44b945c15d5de424f4209239b6d96063eccc82f0`
- Head: `c329e9f2f27130ee876bd4ea489aea3527597c63`
- Fixed: the false claim that SP 800-90B's worked RCT example uses H = 7.3
  (the publication uses H = 2.0 and C = 11); the stale 47-test count; wording
  that called extractor output perfectly uniform and key-ready; and
  over-privileged, major-auto-merging or fail-open Pages controls.
- Authoritative Linux run:
  [39946321379](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/actions/runs/39946321379)
  passed Node 22/24 builds, audits and **51/51** tests in each lane, plus all
  **24/24** production-browser accessibility, claims and workshop checks.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-quantum-entropy/pull/23#issuecomment-6363875418)
- Provider evidence at review time: zero open Dependabot alerts and zero open
  secret-scanning alerts; zero advisories across **66** exact locked
  package/version pairs. Code scanning returned `no analysis found` and remains
  explicitly incomplete.
- State: Fleet item complete; PR open, cleanly mergeable at the recorded head,
  intentionally unmerged, and deployment unverified.

### Padding Oracle

- PR: [crypto-lab-padding-oracle #23](https://github.com/systemslibrarian/crypto-lab-padding-oracle/pull/23)
- Base: `c3806072edec3fe143f48bfcd5e7511bda1797f5`
- Head: `a8b1ab9d5c462d92cf6d109330fc53f6ff34bf1c`
- Fixed: overbroad ciphertext-recovery claims; an unreliable live-invalid
  oracle example; the omitted final-byte disambiguation cost; block-aligned
  plaintext being stripped as padding; UTF-8 workload and malformed-input
  boundaries; stale asynchronous sessions regaining UI authority; inaccurate
  ASP.NET, Lucky Thirteen, CBC-remediation and authenticated-decryption prose;
  and over-privileged or fail-open Pages controls. RFC **9846** was verified as
  the real July 2026 TLS 1.3 publication that obsoletes RFC 8446 and was kept.
- Authoritative Linux run:
  [40005207776](https://github.com/systemslibrarian/crypto-lab-padding-oracle/actions/runs/40005207776)
  passed clean audited Node 22/24/26 type-check, **19/19** unit-test and
  **8/8** workflow-control lanes; **12/12** Playwright functional/WCAG checks;
  and all **9/9** claim mutations after `baseline: unmutated copy PASSES`.
  Every mutant moved the production artifact, was killed by its named
  assertion with zero retries, restored the exact artifact and retested green.
- Evidence comment:
  [final verification](https://github.com/systemslibrarian/crypto-lab-padding-oracle/pull/23#issuecomment-6372255879)
- Provider evidence at review time: zero open Dependabot alerts and zero open
  secret-scanning alerts; secret scanning and push protection enabled; zero
  vulnerabilities in the exact npm lock. Code scanning returned
  `no analysis found` and remains explicitly incomplete.
- State: Fleet item `4d3a55cf-f5a4-4262-870b-a629ac1e96f9` read back complete
  at revision 3; PR open, non-draft and cleanly mergeable at the recorded head,
  intentionally unmerged, and deployment not performed.

### Hub handoff

- PR: [crypto-lab #243](https://github.com/systemslibrarian/crypto-lab/pull/243)
- Branch: `codex/refresh-futureworkoct-2026-10-21`
- Base fetched immediately before this edit:
  `0730c46f802237569c2e39fa0edc57729e158d68`. The branch incorporates that
  fresh Hub main through merge commit `b5e31dd`.
- `futureworkoct.md` is deliberately a shrinking current-state handoff, not a
  growing history log. After Padding Oracle it measured **1,204 total**,
  **1,066 complete** and **138 active** Fleet items: **105 queued**, **27
  working** and **6 blocked**. Paillier Gate is the next queued review.
- A full GitHub readback on 2026-10-23 found the preceding **54** named repair
  PRs open, non-draft and carrying a successful current-head workflow run.
  Fifty-three were mergeable; PQ Rotation **#24** was the one conflicting PR.
  OT Gate **#26** was subsequently read back separately as open, non-draft,
  cleanly mergeable and green at exact head `e4dcca4`, bringing the recorded
  total to **55**. OTP Vault **#26** was then read back open, non-draft,
  cleanly mergeable and green at exact head `e1d30ba`, bringing the total to
  **56**. Padding Oracle **#23** was then read back open, non-draft, cleanly
  mergeable and green at exact head `a8b1ab9`, bringing the total to **57**.
  Scloud Vault
  **#21**, Search Vault **#23**, Shadow Vault **#31**, Shamir Gate **#17** and
  Shor **#21** had advanced beyond the head SHAs stored with their completed
  Fleet evidence: `9956def` to `20569e3`, `715cec9` to `344a310`, `5d0ec55`
  to `500ae61`, `66874ed` to `1968e53`, and `79a145d` to `5982efd`,
  respectively. Their new heads were green, but the evidence must be reconciled
  against those commits before merge. Green checks alone neither resolve a
  conflict nor prove that earlier review evidence still applies. Opaque Gate
  **#34** was green and mergeable at exact head `131cb9f`; ORAM Vault **#30**
  was green and mergeable at exact head `921428c`; Order Leak **#14** was
  green and mergeable at exact head `8a0b35e`.
- The complete Hub consistency pass against this freshly incorporated main and
  counsel **#18** produced **11 passes and 2 failures**. `catalog-sync` showed
  that main commit `0730c46` fixed Search Vault's generated section count and
  ordering but left two generated lines stale: the query-integrity outcome and
  limit differ from `tools/catalog-exhibits.json`. `lab-dates` still identified
  Iron Letter, Protocol Compose, Threshold Decrypt, Multivariate, Broken Trust
  and Time Lock Puzzle as stale. No catalog output or date pin was mixed into
  this tracker-only PR.
- The branch head will advance whenever this ledger or the current-state handoff
  is updated. Fetch the PR branch and use its live head rather than assuming the
  local checkout remains current.

## Known limitations and non-actions

- No PR above was merged or deployed by this maintenance pass.
- A green source PR does not verify the live Pages deployment; deployment stays
  unverified until a maintainer merges and the deployment plus post-deploy
  checks finish.
- Local Chromium on this Mac can fail before page launch with a Mach bootstrap
  error. Linux Playwright logs are the browser authority when that occurs.
- Docker's internal storage was full during the ORAM Vault fallback attempt; no
  container launched and no Docker data was deleted to conceal that limitation.
- Repository security settings were observed but not changed. Dependabot
  security updates remain an owner decision where GitHub reports them disabled.
- The refreshed Hub baseline has one generated `CATALOG.md` drift and six stale
  `lab-dates` pins. They were recorded in `futureworkoct.md`; this tracker-only
  update did not rewrite catalog data.
