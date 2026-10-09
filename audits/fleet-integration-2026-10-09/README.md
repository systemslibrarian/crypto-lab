# Authorized fleet integration — 2026-10-09

This continues the initial [maintenance audit](../fleet-maintenance-2026-10-09/README.md) after explicit authorization to merge verified repairs and deploy. The initial audit describes its historical pre-integration state.

Eight focused lab PRs merged with expected-head guards, passing exact PR-head application checks, unprotected main branches and empty rulesets. `lab-integration.json` retains starting main, reviewed head, actual checks, and merge SHA. Current-main tests and deployed bytes are separate pending observations. TC26 PR5 remains open because selected Emscripten4.0.23 rebuild hashes differ; Mac reproduction does not establish original compiler identity.

Adversarial review repaired deployment-report false-success paths: failed fetch, malformed Pages metadata, unreadable or skipped publication, failed downloads or verification steps, skipped prerequisite jobs, newer failed/pending retries, unrelated historical commits, and PR-only runs. All39 actual-CLI controls passed;13 classifier fixtures passed. Output explicitly limits success to observed publishing jobs/configuration and requires separate live-byte verification.

Biham source was inspected at merged main a106bf8a64ece57b6944e2dfece9b7ed785e4861. Its implementation, tests and README are unchanged by PR15. The review pin and derived card were updated through the guarded writer. Full catalog verification passed1601 anchors. Generated catalog/readme/concept/teach/level checks passed at228 unique cards. `hub-integration-checks.json` records exact commands and outputs, including an initial manifest invocation error subsequently corrected to the documented --check-fixtures mode (all14 controls pass).

Hub PR144 is awaiting final exact-head CI before merge; Compare38 and Counsel10 follow after their upstream data dependencies are integrated and verified. Fleet Console work items are updated and read back as outcomes become available. Full current-head snapshot synchronization remains pending until authoritative source integration.

The later user instruction expands the dependency pass to every crypto-lab repository. Existing104-update diagnostics are reused; updates require install, applicable gates, exact-head checks and truthful migration/blocker outcomes.
