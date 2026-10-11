# Maintainer verification evidence

These are reviewed, versioned copies of the existing maintenance helpers, not
another fleet scanner. They do not deploy applications, write GitHub issues,
install dependencies, submit dependency metadata or update Fleet records.

Work items: `c176df69-a998-478a-a69c-f9511164c2ba`
(`tool:live-verifier:incomplete-evidence`) and
`366208d3-362b-4725-a545-0f33928aa182`
(`tool:integration-verifier:failure-diagnostics-role`). Preserve their original
requests and historical failure measurements when recording integration.

The original local helpers already contained unlogged amendments. Archiving
those amendments does not attribute their authorship to this repair run.
`archive-inputs.json` identifies the captured inputs by hash. Their original
captured bytes remain available as history in the owner's maintenance directory.
Updating an existing local helper requires a matching captured input hash first;
preserve its previous bytes and record the installed versioned revision. Do not
overwrite concurrent amendments.

## Live browser reader

```sh
FLEET_MAINTENANCE_ROOT=/path/to/existing/maintenance-evidence \
  python3 -B audits/fleet-maintenance-2026-10-09/tools/run-publisher-live-checks.py \
  --cohort=publisher-security-evidence crypto-lab-example
```

The existing cohort must contain inspected checks/pushed and postmerge records;
the root must contain its existing `console-current-critical-20261009/fleet.json`
URL inventory. Reading that inventory does not refresh its historical source
or provider observations. The actual Git HEAD must match the inspected
postmerge revision, and tracked source must be clean before and after execution.
Revision or tracked-file changes during a suite invalidate its current result.
Review the original lab's configurations and assertions
before selecting its suites. Dynamic test directories or extra global lifecycle
hooks are incomplete evidence, requiring review.

A new attempt acquires its per-lab lock, archives the previous canonical bytes
(including malformed records), and atomically marks current verification
incomplete **before** loading inputs or running a browser. Timeout, missing or
malformed inputs, changed source, configuration errors and unreadable results
remain incomplete with nonzero command status. Partial suite results and timeout
output are preserved. Interrupted runs leave the current incomplete marker;
concurrent invocations cannot overwrite the active writer. An inaccessible
evidence destination remains an explicit error; it is never current success.

The wrapper retains original projects, device settings, timeouts and assertions,
removes the local web server, sets the actual public URL and disables retries.
It accepts the actual ESM default object and the single CommonJS TypeScript
default wrapper. Ambiguous nested exports, malformed project/device settings,
a runtime test directory differing from the inspected source, and imported
global lifecycle hooks require review and remain incomplete. Configuration or
runner errors without a readable failed-test count are incomplete, rather than
application assertion failures.
`npm exec --no` uses already-installed tooling and refuses implicit installation.
Zero exit without a readable positive browser test count is incomplete; a
readable nonzero browser assertion result remains failed. Neither state is
compiler/source-to-WASM reproduction, CI success or deployment success.

## Integration policy

The finite role table records workflows inspected during maintenance. It does
not derive every future workflow's required stages. Before reuse, inspect the
actual current-head workflow, its job roles and conditions; resolve ambiguous
job names by workflow identity rather than choosing a green duplicate.

Ratchet's `Upload Playwright report on failure` is diagnostic, guarded by
`if: failure()`; its skipped state is expected after passing browser tests.
`Upload Pages artifact` remains mandatory. A failed, cancelled, unreadable or
unfinished diagnostic is not waived. Required application stages remain
mandatory even when a deployment job is green. Empty requirements, ambiguous
duplicates and malformed named steps cannot establish success. Complete
collection controls reject truncated, changing and duplicate API responses;
run-start/attempt ordering prevents an old failed or cancelled run from
overriding a newer verified attempt. Source freshness uses actual Git ancestry.

## Offline controls

```sh
python3 -B -m unittest discover \
  -s audits/fleet-maintenance-2026-10-09/tools -p 'test_*.py' -v
```

Sixteen live-reader tests execute the actual CLI, temporary Git repository and
filesystem evidence with the external browser command substituted. Three
additional controls use the actual installed Playwright loader and runner:
both CommonJS/ESM configurations preserve two named projects, devices, shared
headers and timeouts; malformed exports/settings and an imported lifecycle
hook fail closed. They navigate no page, install nothing and execute no
repository lifecycle script. Install the existing locked tools with
`npm ci --ignore-scripts --prefix tools` before these controls; missing tooling
fails rather than silently skipping them. Their synthetic configuration
assertions are not public application checks. Sixteen policy tests
exercise source ancestry, complete collections, latest attempts and positive
and negative job/step evidence. Existing hub CI runs these controls without
changing its triggers or read-only permissions.
