# Harness Interface Contract

This document specifies the interface contract for any test harness interacting with the Crypto Lab verification manifests. The harness build itself is out of scope (P5); this contract ensures that any compliant harness consumes manifests identically.

## 1. Inputs
The harness receives exactly two inputs:
1. One manifest (`verification/manifest.yaml`)
2. The pinned source tree corresponding to the manifest's `repository.commit_sha`

## 2. Evaluation Scope
For each claim in the manifest with a `computable` block, the harness must:
1. Parse the `inputs`, `expression`, and `expected` fields according to the declared `language` (e.g., Python, Sage, JavaScript).
2. Evaluate the `expression` in a strict sandbox:
   - **No I/O** is permitted.
   - **No imports** are allowed beyond standard math libraries. The lab's own code must not be imported or executed by the harness (P2).
3. Compare the evaluation result against `expected` according to the specified `relation` (e.g., equality, inequality, round_trip, distribution_test).
4. Record the outcome as pass or fail.

## 3. Dependency Resolution
Claims may specify dependencies via the `depends_on` array. The harness must resolve these dependencies using a topological sort.
- If a cycle is detected, the harness must immediately report an error and abort evaluation for the affected claims.

## 4. Official Vectors
If a claim's verification `method` is `official_vectors`:
- The harness must resolve the named vector set exclusively from a local, pre-registered path under `verification/reference-packs/`.
- **Never fetch vectors from the web** during evaluation.

## 5. Status Updates
The harness is strictly a read and evaluate tool. Its results **must not** automatically update the `verification_status` of any claim. 
- Updates to `verification_status` occur exclusively via the human-review workflow based on harness output.
