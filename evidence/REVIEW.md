# Public evidence change review

This review concerns the public export and explorer, not the cryptographic
correctness or deployed state of individual labs.

## Scope and source

- Add `/evidence/` to the existing Crypto Lab repository; preserve the private
  console and all lab repositories.
- Use the last saved October 11, 2026 snapshot, with the exact raw input digest
  and catalog commit recorded in `README.md` and the exporter.
- Retain 228 labs, 175 named algorithms, 80 distinct standards labels, 221 labs
  with named implementation evidence and 7 reviewed N/A models.
- Preserve 7 partially unscanned labs, 942 algorithm records, 753 standards
  associations, and 3,246 relationships, including 72 untyped catalog pairs.
- Keep this change on a feature branch/PR. No merge, deployment, release, or
  console mutation is part of this change.

## Public-field review

The projection includes only explicitly named fields. The inventory classifies
36 paths as PUBLIC, 721 as PRIVATE, and 87 as UNSURE. All PRIVATE and UNSURE
paths are excluded, including nested source snippets and candidate claims.
The inventory itself contains field paths and classifications, never raw values.

The output validator found **zero unapproved/private fields** in the new public
dataset. Synthetic negative controls also prove that newly introduced private
and unknown fields do not cross the projection, and that unapproved output keys
or private URL/token markers fail validation. Both the exact private input and
the reviewed public JSON have pinned SHA-256 digests.

A targeted scan of the existing tracked tree, before staging this change, found
no private-console hostname, ChatGPT conversation URL, `conversationUrl`,
`work_items`, or `refresh_runs` markers. This is a limited marker scan, not a
claim that all historical commits or deployed assets were audited. Existing
public maintenance audit reports were not changed or incorporated into the data.

## Relationship review

| Source meaning | Export type | Count |
| --- | --- | ---: |
| Named implementation | `implemented` | 942 |
| Reference without a named implementation in the same lab | `referenced` | 1,721 |
| Indexed attack association | `attacks` | 511 |
| Authored catalog pair with no declared semantic type | `null` | 72 |

The proposed background/method/application/related classification is absent from
the source. None of those types was inferred. Catalog shared terms remain
authored terms, not an independent validation of either lab.

## Validation

- Public schema, exact baseline digests, reference integrity, totals and all four
  CSV regeneration comparisons: passed.
- Eleven Node tests: passed, including wrong-input rejection, deep private-field
  injection, deterministic shuffled input, leak/consistency negative controls,
  CSV formula protection, composed filters, routes, pagination and relation types.
- DOM exercise: all six views and all 228 lab-detail pages passed; search focus,
  empty results, clear filters, partial/N/A filters, the first and last of eight lab result pages,
  standards view, catalog-pair view, downloads and skip link passed. Exactly one
  data request was made, to the public JSON; no private service calls.
- Existing knowledge-map and teaching-page freshness checks: passed. The map's
  only change is the stored hash of `index.html`, whose navigation now links to
  the evidence explorer.
- JavaScript syntax and whitespace checks: passed.
- Visual layout in a real browser: **not verified locally**; no browser was
  available. The DOM exercise does not verify responsive layout, rendering or
  assistive-technology behavior.

CI runs the public data checks and the Node tests from the committed public data.
It does not use private snapshots, service credentials, or a live console.

Data is CC BY 4.0. Code remains MIT. The existing Crypto Lab DOI
`10.5281/zenodo.23105362` is preserved without a release/version bump.
