# Maintenance coverage

The tools in `tools/` answer different questions. A successful catalog refresh is
not a cryptographic audit, a test run of every lab, or proof that a build shipped.

| Check layer | Automatic execution | What it establishes |
| --- | --- | --- |
| Detector regression fixtures | `README catalog` workflow on pull requests, main pushes, and manual dispatch | Nine detector suites plus a cadence regression check known defects, clean controls, source-evidence shapes, and clone guards. Each suite continues after another fails. |
| Catalog consistency | `README catalog` workflow | Generated files and catalog claims agree with their declared inputs. |
| Fleet and deployment checks | Weekly `Fleet check` workflow | Eight checkers read sibling sources or GitHub: discovery, served revision, workflow gates, dispatch, theme, anchors, recall, and dates. |
| Teaching checks | `teach.yml`, with job-specific triggers | Teaching builds, layout, and scheduled drift checks have separate execution paths. |
| Fleet Console collection | Separate nightly Site refresh | Reads cataloged source, derives evidence, checks anchors, and imports workflow observations. It does not execute all tools or all lab tests. |

## Reading a result

- Keep the exact command, inspected commit, capture time, scope, and exit result.
  `catalog-evidence.js selftest` does not replace `catalog-evidence.js verify`.
- A containing workflow's success is not an individual check's result. Scheduled
  jobs can differ from push jobs. A cancelled, timed-out, skipped, missing, or
  unreadable run must not become a success because an unrelated job passed.
- Missing clones, unknown algorithms, reviewed N/A models, opaque components, and
  incomplete executions answer different questions; preserve those distinctions.
- The source scanner recognizes evidence shapes and vocabulary. Its recall
  fixture measures a reviewed sample, not the entire fleet; it does not certify
  cryptographic correctness or current standards conformance.

## Remaining limits

Import evidence requires executable import/require syntax before reading quoted
module paths. Presentation and projection bindings do not establish their
subject's implementation, including through path fallback. UI location alone
does not invalidate a real computation import. Gaussian measurement sigma is
not an alias for the differential-privacy Gaussian mechanism. Regression cases
keep the reviewed false matches and real imports/mechanisms as paired controls.

Protocol identity still requires multiple distinct structures and rejects a
dominant foreign prefix; single borrowed message names remain partial evidence.
These rules improve precision, rather than asserting cryptographic conformance.

`dispatch-proof.js` and its mutation set need a populated sibling fleet. They are
not part of the offline regression job. Tools such as `test-invocation.js`,
`depth-audit.js`, and `corpus-freshness.js` also need their own relevant inputs and
run evidence; a regression fixture passing is not a live fleet check.

`protection-census.js` remains manual because the ordinary repository-scoped
workflow credential cannot read sibling administrative protection settings.
The console should report that access gap, never infer protection from it.

Dependency vulnerability checks, cryptographic known-answer and rejection tests,
browser behavior, and research/standards review require their own observations.
Use the per-tool source headers and observed command results to decide what was
actually checked; do not treat the tool inventory as completed work.

## Necessity review — 7 October 2026

Reviewed the 38 runnable entries and four support modules at hub commit
`40c6344e188063b2f5f0eeae1016ae3ba92f3a0b`, using their input paths, entrypoints,
callers, fixtures, and workflow references. No safe redundant deletion was
established. This is a purpose and dependency review, not a line-by-line correctness
certification of every checker.

Several names overlap because they inspect different failures. For example,
`deploy-sync` asks whether a revision shipped, `gate-sync` whether it passed the
right gate, and `dispatch-sync` whether the post-merge dispatch can fail silently.
Removing one would remove a separate check.

There are **29 checking/generation commands, one fleet runner, four regression
commands, four specialized helpers, and four support modules**. The eight
regression/helper commands are useful but should not be presented as eight extra
checks of today's labs. Do not schedule both a wrapper and its children just to
increase a tool-run count.

| File in `tools/` | Disposition | Distinct responsibility or dependency |
| --- | --- | --- |
| `catalog-evidence.js` | Keep | Derives implementation evidence; verifies anchors and pinned reviews. |
| `catalog-recall.js` | Keep | Measures missed detections against independently reviewed sample truth. |
| `catalog-structure-check.js` | Keep | Checks HTML/catalog structure and search behavior beyond generated text equality. |
| `catalog-sync.js` | Keep | Generates/checks CATALOG.md, claim anchors, vocabulary, and chip rules. |
| `clone-guard-proof.js` | Keep as regression | Proves dirty clones and torn snapshots cannot contaminate generation. |
| `concept-sync.js` | Keep | Checks the separate concept coverage map against catalog membership. |
| `corpus-freshness.js` | Keep | Checks whether reviewed corpus prose predates relevant lab changes. |
| `corpus-sync.js` | Keep | Checks corpus membership; it cannot establish prose freshness. |
| `deploy-sync.js` | Keep | Compares source and deployment observations, including stale publication causes. |
| `depth-audit-export.sh` | Keep as helper | Supplies commit-recorded remote exports to `depth-audit.js export`; do not schedule twice. |
| `depth-audit.js` | Keep | Derives assurance dimensions from exported source; does not replace lab tests. |
| `dispatch-census.js` | Keep | Guards the declared dispatch population against missing or unclassifiable labs. |
| `dispatch-claims.js` | Keep | Checks factual claims in canonical dispatch explanations against workflow evidence. |
| `dispatch-comment-sync.js` | Keep | Checks/writes consistent explanations; truth is checked separately by dispatch-claims. |
| `dispatch-mutations.js` | Keep as regression | Negative and clean controls called by dispatch-proof; no separate routine run needed. |
| `dispatch-proof.js` | Keep as regression | Exercises actual validator, transform, rationale binding, and mutation set. |
| `dispatch-sync.js` | Keep | Detects silent dispatch failure paths; incorporates census and claims checks. |
| `evidence-shape-proof.js` | Keep as regression | Tests false algorithm credits while preserving legitimate positive matches. |
| `fleet-check.js` | Keep as runner | Runs eight independent checks and consolidates their reports. |
| `fleet-sync.js` | Keep | Discovers repository/catalog omissions that agreement between generated files cannot detect. |
| `gate-sync.js` | Keep | Compares merge and deploy gates and inspects workflow failure shapes. |
| `lab-dates.js` | Keep | Separates demo-change dates from dependency or documentation churn. |
| `level-sync.js` | Keep | Keeps audience-level metadata and its review document aligned. |
| `port-sync.js` | Keep | Prevents test-server collisions and checks strict port configuration. |
| `protection-census.js` | Keep, access-limited | Reads both classic protection and ruleset evidence; unavailable access remains unknown. |
| `readme-sync.js` | Keep | Generates/checks README demo and learning-path tables from cards. |
| `render-registry.mjs` | Keep as publishing helper | Renders the tracked verification registry and per-lab manifest statuses; no independent verification. |
| `render-verification.mjs` | Keep as publishing helper | Renders individual manifests into mathematical-verification documents. |
| `teach-build.js` | Keep | Builds/checks teaching pages and catalog course links. |
| `teach-drift.js` | Keep | Checks whether worksheet controls still exist on live exhibits. |
| `teach-issues.js` | Keep | Rechecks whether published defect notes still describe live exhibits. |
| `teach-layout.js` | Keep | Measures generated teaching-page layout at desktop/mobile sizes. |
| `teach-observe.js` | Keep, on demand | Observes a live exhibit's network contacts for privacy notes. |
| `test-invocation.js` | Keep | Detects test suites with no visible workflow caller; existence alone is insufficient. |
| `theme-sync.js` | Keep | Enforces the chosen single-theme UI contract, separate from security assurance. |
| `tools-sync.js` | Keep | Generates the maintenance inventory and cadence; keeps fixture-only cadence distinct. |
| `transform.mjs` | Keep as repair/proof helper | Preserves the dispatch migration and is imported by dispatch-proof; never run as a routine scanner. |
| `validate-manifest.mjs` | Keep | Validates verification schema and evidence rules; used by `tools/package.json` tests. |
| `catalog-vocab.js` | Keep as support | Shared algorithm, attack, and standards vocabulary. |
| `clone-source.js` | Keep as support | Shared committed-source reading and torn-snapshot guard. |
| `depth-audit-report.js` | Keep as support | Report writer called by depth-audit; separates presentation from classification. |
| `sibling-labs.js` | Keep as support | Shared clone enumeration and population floor; excludes linked worktrees. |

The renderers and migration helper are not evidence detectors. Their absence of a
nightly run is not a lab defect. Lack of a recent result for a real checker remains
a coverage question, and retaining its file does not answer it.

During anchor verification, a current remote commit absent from the local clone
is `CLONE-BEHIND`, even when the review pin differs from remote HEAD. Fetch and
update the checkout before deciding whether reviewed source changed. A failed
diff against an unfetched remote object must not create a `STALE-REVIEW` request.
Dependency-only movement preserves the source review after fetch; actual source
movement still requires review, and verification remains nonzero until the clone
can establish the comparison.
