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
  growing history log. After Nonce Lattice it measured **1,204 total**,
  **1,058 complete** and **146 active** Fleet items: **113 queued**, **27
  working** and **6 blocked**. NTRU Classic became the next queued review.
- GitHub GraphQL readback on 2026-10-23 found all **49** named repair PRs open,
  non-draft and carrying a successful current-head status rollup. Forty-eight
  were mergeable; PQ Rotation **#24** was the one conflicting PR. Green checks
  do not resolve that conflict.
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
