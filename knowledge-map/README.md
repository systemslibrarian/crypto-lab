# Learning map

Public, separate landing page at
[crypto-lab.systemslibrarian.dev/knowledge-map/](https://crypto-lab.systemslibrarian.dev/knowledge-map/).
The main catalog in `index.html` remains the homepage and links to this learner
workspace. The map needs no LLM or application backend.

Search topics such as factorization, select connected labs or ideas, and follow
the existing learning journeys or suggested topic routes. Whole-module
prerequisites retain their author's wording. Connections and suggested routes
are exploration guidance, not mandatory lab prerequisites. Progress and
observation notes stay in the learner's browser.

The factorization activity compares two 14-bit toy semiprimes: Fermat's method
tests 1 candidate for 9797 and 128 for 9913. These exact counts illustrate the
method; they do not estimate real RSA security.

`catalog.json` is generated from the catalog cards, navigation literals,
`concept-coverage.md`, and `teach/_src/modules/*.json`. After changing a source,
run `node tools/knowledge-map-sync.js write` and review the diff. CI checks
freshness, model and arithmetic controls, and Chromium navigation and layout.
Catalog implementation notes preserve source-review distinctions; an index term
or attack mention is not a cryptographic audit of that lab.

See [the architecture notes](../docs/knowledge-map.md) for sources, navigation,
storage behavior, check commands and verification limits.
