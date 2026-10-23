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

### Hub handoff

- PR: [crypto-lab #243](https://github.com/systemslibrarian/crypto-lab/pull/243)
- Branch: `codex/refresh-futureworkoct-2026-10-21`
- Base at the last fetch: `c58b1c43c94dbd00a8bc8c4599fd27fdac9e2854`
- Last tracker-only checkpoint before this ledger: `07037fa616a5b48a271eb4145e6195206ad93bb1`
- `futureworkoct.md` is deliberately a shrinking current-state handoff, not a
  growing history log. After PSI Gate it measured **1,204 total**, **1,052
  complete** and **152 active** Fleet items: **119 queued**, **27 working** and
  **6 blocked**. Pulse Chain became the next queued review.
- The branch head will advance whenever this ledger or the current-state handoff
  is updated. Fetch the PR branch and use its live head rather than assuming the
  checkpoint above remains current.

## In progress — do not treat as completed

### Pulse Chain

- Fleet item: `ec5e2fdf-d57d-4ae0-88ee-9a5ecdda65ea`
- Fresh committed base: `2dc17f8647a4219557139bd9b94dd7a83d8fe74a`
- Isolated branch: `codex/repair-pulse-chain-2026-10-23`
- Local worktree at this checkpoint: `/tmp/pulse-chain-fix.LCnxMq`
- Local source checks already passed: **4/4 files, 52/52 Vitest tests**, both
  TypeScript builds, and the Vite production build.
- Exact lock evidence: **90 exact package/version pairs** returned no advisories
  from npm's bulk advisory endpoint. GitHub returned zero open Dependabot alerts
  and zero open secret-scanning alerts. Code scanning returned `no analysis
  found` and remains explicitly incomplete.
- Fresh live drift run:
  [39944346982](https://github.com/systemslibrarian/crypto-lab-pulse-chain/actions/runs/39944346982)
  ran at base SHA on 2026-10-23. Its log—not merely its badge—showed zero npm
  vulnerabilities; reproduced NIST pulse **#1995909** under the deployed layout;
  confirmed the current 4096-bit-signature/2048-bit-certificate mismatch; and
  verified current drand default round **6577429** and quicknet round
  **33316845**, including `SHA-256(signature)` randomness.
- Findings being fixed: repository code currently executes in a job with
  Pages/OIDC write authority; main deploys can be cancelled; major Dependabot
  updates can auto-merge; and a failed auto-merge reports success. The working
  patch isolates privileged Pages jobs, limits cancellation to PRs, tests Node
  22/24, adds an explicit audit and post-deploy route check, leaves major bumps
  for humans, and fails closed when merge retries are exhausted.
- Not yet done at this checkpoint: final local validation, fresh pre-commit
  upstream fetch, commit, push, PR, exact-head Linux CI, final evidence comment,
  Fleet completion, and the next Hub handoff update.

## Known limitations and non-actions

- No PR above was merged or deployed by this maintenance pass.
- A green source PR does not verify the live Pages deployment; deployment stays
  unverified until a maintainer merges and the deployment plus post-deploy
  checks finish.
- Local Chromium on this Mac can fail before page launch with a Mach bootstrap
  error. Linux Playwright logs are the browser authority when that occurs.
- Repository security settings were observed but not changed. Dependabot
  security updates remain an owner decision where GitHub reports them disabled.
