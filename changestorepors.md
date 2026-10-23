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

### Hub handoff

- PR: [crypto-lab #243](https://github.com/systemslibrarian/crypto-lab/pull/243)
- Branch: `codex/refresh-futureworkoct-2026-10-21`
- Base at the last fetch: `db07bd5bbef3c26d4a9d9905b5cf910355a821cf`
- Rebased tracker checkpoint before this ledger update:
  `1147fb2b3a19f4d172d1a757f384dc6db9c09002`
- `futureworkoct.md` is deliberately a shrinking current-state handoff, not a
  growing history log. After Pulse Chain it measured **1,204 total**, **1,053
  complete** and **151 active** Fleet items: **118 queued**, **27 working** and
  **6 blocked**. Quantum Entropy became the next queued review.
- The branch head will advance whenever this ledger or the current-state handoff
  is updated. Fetch the PR branch and use its live head rather than assuming the
  checkpoint above remains current.

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
