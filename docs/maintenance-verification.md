# Maintenance verification

The **Maintenance verification** workflow runs read-only checks on relevant pull
requests and by manual dispatch. It does not publish a site, deploy a lab, open
issues, or change branch protection. Its two jobs save source and browser evidence
as run artifacts, including when a check fails.

The export job discovers the remote fleet, resolves each default branch to a full
commit SHA, and downloads that exact revision. Depth and test-invocation scans
require a complete matching discovery/export manifest. Empty, partial, failed,
abbreviated-SHA or mismatched exports are unreadable; old folders outside the
manifest do not contribute to the report. Refresh older exports before running
these scanners.

An incomplete export need not hide diagnostics from readable sources. The opt-in
`--partial-json` mode on both scanners preserves the discovered denominator,
named UNREAD rows and full per-repository SHAs in a scope envelope. It inspects only
valid pinned exports, rejects malformed or contradictory manifests, and exits 2
when scope is incomplete. It does not update the complete Markdown assurance
report. The workflow retains these diagnostic artifacts even when the full scan
cannot run; its overall result remains failed/incomplete. Never describe a partial
report or its readable subset as a complete fleet scan.

Both complete depth reports and partial diagnostics run at most four isolated
classifier workers at once. Each repository gets a 20-second classification
budget and a 256 MiB old-generation
heap limit. Progress goes to stderr, leaving JSON intact. A timeout, worker error
or exit without a result is recorded under `scan.unreadable` with the repository
and source SHA. Export completeness (`scope`) and classification completeness
(`scan`) are separate: either gap produces exit 2. A timed-out classifier is not
evidence that the lab's cryptography failed.

Complete depth generation, JSON output and report checking require every pinned
source to finish classification. A timeout or worker error exits 2 before any
report is written or any partial score is printed. The partial mode remains the
way to obtain named diagnostic gaps.

The complete report is generated as dated run evidence, then checked against the
same pinned exports and saved in the artifact. The workflow does not require an
old committed report to have today's date, rewrite an earlier audit, commit the
new report, or publish it. Generation/check agreement establishes reproducible
classification of this capture; it does not establish independent lab testing.
The displayed-claim binding detector consumes simple local assignments without
the overlapping whitespace regexp that previously exhausted Fold Gate's
20-second budget. Computed-value and literal/non-page negative controls retain
the dimension's meaning; timeout evidence and unread languages remain explicit.

The teaching job installs Chromium, Firefox and WebKit plus their host libraries.
It runs worksheet drift, the published issue-note check, and a scoped AES Modes
page-load observation. Missing browsers remain unreadable. Manual teaching claims
remain unchecked until someone verifies them; installing browsers does not make
those claims pass.

Each named command has its own step result. A successful containing workflow or
artifact upload is not evidence that a different checker passed. The final step
keeps failed or skipped required commands visible as a job failure. The JSON test
invocation output is a derived report: exit zero means it ran, not that every lab
invokes all its tests. Review its findings and undetermined rows separately.

Protection census is excluded. The repository-scoped `GITHUB_TOKEN` cannot prove
protection on sibling repositories; that requires an appropriately authorized
read credential. No credential is requested or added by this workflow.

Test-invocation coverage reads parsed workflow `run` values with the existing
workflow-gate YAML reader. Workflow names, environment values, shell comments and
quoted diagnostics cannot establish a caller. JavaScript harness comments are
blanked with the existing catalog lexer. The scan recognizes module/CommonJS
test files and Python interpreter flags such as `python3 -B -m unittest`.
Malformed workflow/package metadata stays undetermined; a source read failure
is UNREAD and makes strict or partial execution incomplete. Quoted shell
programs and unavailable external workflow calls remain undetermined when they
could explain a missing caller. These are static caller observations: they do
not establish actual test execution, branch reachability or runner-configured
file coverage. Exercise the controls with
`node --test tests/test-invocation.test.cjs`.
