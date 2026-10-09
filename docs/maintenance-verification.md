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
