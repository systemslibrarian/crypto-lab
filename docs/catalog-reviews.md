# Pinned corrections to source derivation

`tools/catalog-reviewed.json` supplements source shapes the catalog scanner cannot
judge accurately. Its `commit` identifies inspected source; the writer's existing
stale/unreadable-review guard controls whether corrections may be applied.

`remove` corrects implementation and attack claims. `removeReferences` separately
accepts canonical algorithm names whose apparent mention is not a reference to
that algorithm. It affects only generated references, preserves raw mention and
implementation evidence, and stays unapplied when the review is stale or unreadable.
Malformed names fail instead of silently doing nothing.

TC26's provenance documentation uses “opaque-WASM coverage” to describe unread
compiled components. That adjective is not a reference to the OPAQUE password
protocol. Its source-pinned reference correction preserves `WebAssembly:2`, the
unknown original compiler and the separately measured source reproduction.
Other labs' OPAQUE references and implementations remain eligible for derivation.

After reviewing current lab source, run `node tools/catalog-evidence.js write
--lab <slug>`, then regenerate the catalog and README with their existing tools.
Run `node --test tests/catalog-reference-review.test.cjs` for current/stale/unreadable,
positive/negative and evidence-preservation controls.
