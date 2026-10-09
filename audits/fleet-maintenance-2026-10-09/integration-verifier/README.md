# Integration verification controls

The hub deployment checker previously accepted a successful build dependency
whose required verification step was skipped. The new regression exercises the
actual checker and fails against the prior implementation. Required stages now
reject skips; only a committed failure/cancellation-only diagnostic artifact
upload may be skipped. Pages artifact uploads remain mandatory.

This directory preserves the existing maintenance helpers used for the repair
cohorts, with their fixes and executable regression controls. It is an audit
recipe, not a new fleet scheduler. `fleet_github.py` reuses an existing Git
credential in memory; it creates no token and does not print credentials.

Run the offline Python controls here:

```sh
python3 -m unittest -v test_source_map_verification_policy test_fleet_verification_cli
```

They use temporary local Git repositories, a real local HTTP server and fake API
responses. No GitHub credentials, remote mutation or deployment are used. Positive
controls require current jobs, mandatory steps and identical HTTP resources.
Negative controls cover missing/failed/skipped stages, unreadable APIs, missing
pages, stale bytes, empty distributions and failed fresh merge readiness. A failed
new read replaces canonical success with unreadable evidence and retains history.

The helpers are run from an evidence root containing cohort `pushed.json`,
`pull-requests.json`, `merges.json`, and the captured fleet URL registry. Review
the cohort inputs before invoking a merger. It refreshes readiness first and uses
an ordinary exact-head GitHub merge; it does not bypass repository protections.
The workflow-role and historical reviewed-SHA exceptions are bounded to this
maintenance session. New source requires new inspection; an unchanged tree is
checked explicitly, not inferred from a reported PR base.

`--pending` revisits unfinished integrations only. Omit it for a fresh full cohort
verification. Current CI, actual deployment, matching live bytes and source-to-
binary reproducibility are separate states. Authenticated WASM deployment
artifacts do not establish original compiler or vendor-source provenance.

`verify-production.cjs` retains the session's public-hub browser verifier. Its
WCAG 2.1 label/name control must fail with `--negative-a11y`; ordinary runs assert
zero violations at desktop and mobile widths. It needs the existing inspected
hub/Compare dependency installations and cohort paths in the evidence root.

`regression-controls.json` preserves the actual before/after output, including
the first fixture path-handling failure and its correction. The integrated repair
receipts record exact heads and bounded deployment checks; they do not claim that
every remaining fleet finding is complete.

The current verifier ranks current-head workflow attempts by `run_started_at`, falling back to creation time only for legacy reports without usable attempt-start data. A later rerun retains its old run ID and creation time; it can supersede a newer-created run with success, failure, cancellation or pending evidence. Slow old completions cannot determine freshness. `attempt-order-negative.json` retains the reproduced earlier false-success selection; the regression suite covers all four outcomes in both input orders. No real workflow was rerun for this control. Native work item:cfd720bc-7e6b-417c-883f-bcc34f44134e.

Quantum integration requires independent native and web jobs and every mandatory step; its PR additionally requires the nightly fuzz build. A skipped failure-diagnostic upload is distinct from a missing/failed mandatory artifact or deploy stage. Public file comparisons and current-head deployment remain separate gates; application tests and matching committed WASM bytes do not establish reproducible compiler provenance.
