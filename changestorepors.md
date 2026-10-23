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

### Hub handoff

- PR: [crypto-lab #243](https://github.com/systemslibrarian/crypto-lab/pull/243)
- Branch: `codex/refresh-futureworkoct-2026-10-21`
- Base fetched immediately before this edit:
  `cc49eb16881e1b4cf1c8a7a17c0a77aa7b1bda57`
- `futureworkoct.md` is deliberately a shrinking current-state handoff, not a
  growing history log. After Quantum Vault it measured **1,204 total**,
  **1,055 complete** and **149 active** Fleet items: **116 queued**, **27
  working** and **6 blocked**. Ratchet Wire became the next queued review.
- GitHub GraphQL readback on 2026-10-23 found all **46** named repair PRs open
  with a successful current-head status rollup. Forty-five were mergeable;
  PQ Rotation **#24** was the one conflicting PR. Green checks do not resolve
  that conflict.
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
- Repository security settings were observed but not changed. Dependabot
  security updates remain an owner decision where GitHub reports them disabled.
- The refreshed Hub baseline has six stale `lab-dates` pins. They were recorded
  in `futureworkoct.md`; this tracker-only update did not rewrite catalog data.
