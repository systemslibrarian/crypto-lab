# Knowledge map

Separate landing page. Not linked from `index.html`.

Live once GitHub Pages publishes the folder:

https://crypto-lab.systemslibrarian.dev/knowledge-map/

`catalog.json` is generated from the catalog cards, navigation literals, concept
filing lines, and `teach/_src/modules/*.json`. After changing those sources, run
`node tools/knowledge-map-sync.js write`. CI checks the saved output with
`node tools/knowledge-map-sync.js check` and tests navigation in Chromium.

Search accepts topic names (including factorization), lab names and card terms.
The URL retains the selected view and lab; browser Back and Forward restore it.
Module prerequisites retain the module author's wording and apply to that whole
module. Concept links mean shared authored exhibit membership, not prerequisites.

`noindex` stays until this page is linked on purpose. This is an unlinked draft,
not a private page: GitHub Pages serves it to anyone who knows the address.
Preparing or pushing a branch does not publish these changes; merging to `main`
does. Keep the repair PR unmerged until the owner approves deployment.

See [the architecture notes](../docs/knowledge-map.md) for sources and test limits.
