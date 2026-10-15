# Crypto Lab evidence explorer

`/evidence/` is a read-only public companion to Crypto Lab. It serves one dated,
allowlisted snapshot, with no service credentials, live console calls, work queue,
notes, edits, or maintenance controls. The browser fetches only `data/evidence.json`.

## Snapshot and provenance

The selected source is the last saved snapshot on **October 11, 2026 (UTC)**:

- Collection began: `2026-10-11T06:20:47.129646+00:00`.
- Collection completed: `2026-10-11T23:42:09.392Z`.
- Saved: `2026-10-11T23:42:31.765Z`.
- Catalog commit: `2dbd5ea44ee1a0fbf0bfbd13d0dcc9eb8507d00f`.
- Private input SHA-256: `be878bc9739e66d3407773dfb679b2bcc7485678a9bc1ed0f6d325e67d5645e2`.

The snapshot was retrieved as a saved object, not reconstructed from current
repositories or scraped from the console interface. Later saved revisions retain
the same collection-start timestamp; they were not substituted for this October 11
save. Individual source links preserve the recorded commit, which can differ from
a repository's current HEAD. The private snapshot and control response remain
outside this repository and must never be committed.

| Measure | Count |
| --- | ---: |
| Labs | 228 |
| Distinct named algorithms | 175 |
| Named algorithm evidence records | 942 |
| Distinct standards labels | 80 |
| Lab–algorithm standards associations | 753 |
| Labs with named implementations | 221 |
| N/A reviewed models | 7 |
| Labs with partially unscanned source | 7 |
| Relationship records | 3,246 |
| Authored catalog pairs, included above | 72 |

The seven labs with partially unscanned source overlap other evidence states;
they are not an additional mutually exclusive group. Source shapes, pinned reviews,
checked anchors, references, and attack associations are distinct evidence claims.
A passed source anchor is not a passed cryptographic test or security audit.

> associations are vocabulary-based, derived from source-backed algorithm records, and do not establish conformance, certification, or full protocol support.

## Public projection and field classification

`tools/public-evidence.cjs` constructs new objects by naming each public field.
It never serializes a whole input record or removes a short denylist from a copy.
Unknown fields are excluded by default. Private and uncertain fields, including
their nested values, never enter the public projection.

`field-classification.json` lists **field paths only, not source values**. The
source inventory contains 844 distinct leaf/empty-container paths: **36 PUBLIC**,
**721 PRIVATE**, and **87 UNSURE**. Every PRIVATE and UNSURE path is excluded.
An empty-array path can be UNSURE while specifically approved leaves inside that
array are PUBLIC; it is not permission to copy the array object.

| Classification | Treatment |
| --- | --- |
| PUBLIC | Explicitly copied catalog metadata, evidence labels, source locations/URLs, unscanned-component labels, standards, recorded relationships, and snapshot dates/commit. |
| PRIVATE | Excluded operational records, workflow/CI details, maintenance flags, work and provider history, review bookkeeping, raw anchor bundles, and related nested data. |
| UNSURE | Excluded unused or redundant fields, snippets, candidates, comment-only/protocol-partial records, catalog duplicates, and unapproved metadata. |

Four candidate records are excluded rather than promoted to named implementations.
Comments and partial protocol mentions are also excluded from named algorithm
totals. The exporter preserves the snapshot's explicit named-implementation set.
Unknown fields added by a future source cannot silently become public.

## Relationships: preserve the source's meaning

The first three types below are the existing console relationship labels and
selection rules. The catalog-pair collection has no semantic `type` field; its
exported `type` is JSON `null` (an empty CSV cell).

| Actual type | Records | Meaning |
| --- | ---: | --- |
| `implemented` | 942 | Source-backed named algorithm record, with its anchor. |
| `referenced` | 1,721 | Recorded reference not already a named implementation in that lab. |
| `attacks` | 511 | Indexed attack association, with its anchor. |
| `null` | 72 | Authored catalog pair, shared terms, stated distinction, and catalog source. |

`target_kind` distinguishes a lab, algorithm, or attack identifier; it is not a
pedagogical relationship type. The proposed `background`, `method`, `application`,
and `related` types are **not present** in the source and have not been assigned.
Catalog shared terms remain as authored, not an inferred current-source overlap.

## Files and reproducibility

All downloadable files are in `data/`:

- `evidence.json`: schema version, pinned snapshot provenance, totals, full lab
  records, algorithm and standards indexes, and relationships.
- `labs.csv`: one row per lab, including state, coverage, source commit and links.
- `algorithms.csv`: one row per lab–algorithm evidence record, not one per unique name.
- `standards.csv`: one row per lab–standard–algorithm association.
- `relationships.csv`: all typed source associations and untyped catalog pairs.

JSON keys are explicitly constructed. Records use a fixed code-point sort, and CSV
uses RFC-style double-quote escaping and CRLF line endings. Array-valued CSV cells
contain JSON arrays. Formula-leading CSV cells receive an apostrophe before the
value, including after leading whitespace; canonical values remain in JSON.
Each CSV row includes `schema_version`, `snapshot_date`, `catalog_commit`, and the
three headline totals. `snapshot_date` is the collection-start timestamp.

Run offline without dependency installation:

```sh
node tools/public-evidence.cjs check
node --test tests/public-evidence.test.cjs
```

Regenerate CSVs from the committed public JSON:

```sh
node tools/public-evidence.cjs write
```

An authorized maintainer with the exact private input can reproduce the public
projection using an **absolute path outside the checkout**:

```sh
node tools/public-evidence.cjs import /absolute/private/snapshot.json
```

The importer verifies the exact input hash before writing anything. A new
snapshot requires deliberate review of the pin, schema, classification, and
expected totals; changing a date alone cannot pass. CI uses only the committed
public projection and synthetic negative controls, never private credentials.

The `Public evidence` workflow runs on pull requests and pushes to main/the feature
branch. It rejects unknown output keys, invalid source URLs, private host/token
markers, dangling relationships, invented pair types, inconsistent indexes/totals,
and stale CSVs. Synthetic tests add private fields at multiple source depths and
prove they are excluded. These checks validate export integrity, not cryptography.

## Citation and licensing

Data in `data/` is **CC BY 4.0**, attributed to Paul A. Clark; see `data/LICENSE`.
The explorer, generator and tests remain under the repository's **MIT** license.
No release/version bump or additional DOI was created.

Paul A. Clark. *Crypto Lab: Interactive Browser-Based Cryptography Demonstrations.*
https://doi.org/10.5281/zenodo.23105362 . For this data, also give the snapshot date
and catalog commit above; the DOI identifies Crypto Lab, not a separate snapshot
release.
