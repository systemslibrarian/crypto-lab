# Learning map

The public `knowledge-map/` page is a separate learner workspace at
https://crypto-lab.systemslibrarian.dev/knowledge-map/. It reuses the Crypto Lab
catalog. The root `index.html` remains the homepage and links to this separate
workspace. The runtime is static
HTML, CSS, JavaScript and a generated JSON catalog; navigation, arithmetic and
local progress do not call an LLM or require an application backend. GitHub Pages
publishes the folder from `main`.

## Sources and teaching guidance

Catalog cards and navigation literals come from `index.html`. Concept membership
comes from authored filings in `concept-coverage.md`; existing learning journeys
retain their catalog order. Course-module roles and prerequisites come from
`teach/_src/modules/*.json`.

`knowledge-map/guides.js` holds authored topic routes, readiness notes, connection
explanations, questions and lab prompts. Its three routes, Build intuition, See
it break and Go deeper, are suggestions. Topics without a guide use catalog
membership ordered by level or the chosen learning goal. Shared-lab connections
require a lab to belong to both authored concept filings. Other suggested
connections carry an explicit teaching explanation. Shared tags and algorithm
names alone do not establish prerequisites.

Prerequisite text applies to an entire course module. Lab-specific preparation
notes and topic mathematical readiness are labeled separately. A lab with no
module has no recorded whole-module prerequisites. Extending this to mandatory
lab-level dependencies requires authored evidence rather than treating route
order as proof.

`tools/knowledge-map-sync.js write` generates `knowledge-map/catalog.json`.
Check mode compares the entire generated output, including source-file hashes,
with the saved bytes. It refuses unreadable or empty populations, duplicate
cards, dangling path or concept members, unfiled labs and missing module metadata.
It reuses `concept-sync.js`'s citation parser. Source changes require regeneration
and review; CI fails stale output and does not write to `main` automatically.

A WIP card stays WIP. The Catalog implementation notes disclosure preserves
UNKNOWN, NOT-SCANNED and N/A index terms and partial-source metadata. These
distinctions are not interchangeable with a clean scan or absence of useful
computation. Algorithm index terms and attack mentions are catalog evidence, not
per-lab cryptographic audits or proof that every named attack is demonstrated.

## Navigation and browser-local state

Search accepts topics, aliases such as factorization, lab names and card terms.
The graph pages through connected labs or related ideas in groups of six; it
marks selected, explored and suggested next labs. A journey's lab graph centers
the journey name, while its related-idea view follows the selected lab's concept
filing. Selecting a later lab reveals its graph page without preventing manual
paging.

URL fragments retain the topic, goal, journey and selected lab. Browser history
restores those selections, invalid identifiers fall back to valid members, and an
explicit link takes precedence over a saved session. Earlier concept and path
links are recognized; the redesigned page does not reproduce every former
module, section or depth view. Native controls support keyboard navigation;
search can be reached with `/`, Escape dismisses its results, and controls retain
focus within their region when the interface rerenders.

The browser stores explored lab IDs, the latest selection and per-lab observation
notes using `localStorage`. Notes have a 2,000-character limit per lab and are
displayed as text. Storage failure leaves navigation usable and reports
visit-only updates. Reset progress clears exploration marks, not observation
notes. Saved state belongs to that browser and site origin; it is not synced
between devices or accounts.

Finish and Continue marks only the learner-confirmed current lab, skips explored
later steps, and focuses the next lab mission. Off-route labs acquire no false
successor and routes do not wrap at their end. Exploration marks record the
learner's choice; they are not an assessment of mastery.

## Factorization activity

`factor-playground.js` computes Fermat's difference-of-squares method using exact
integer arithmetic. Two 14-bit toy semiprimes produce different work:

| Modulus | Recovered factors | Candidate values tested |
| --- | --- | ---: |
| 9797 | 97 × 101 | 1 |
| 9913 | 23 × 431 | 128 |

Learners predict, step through candidates or run both searches. Counts include
the successful candidate and resumed searches do not count a tested value twice.
The activity reports work as candidate counts rather than elapsed time. Its toy
examples do not estimate real RSA security. Completing this in-page experiment
does not mark an external lab explored or claim mastery.

## Checks and deployment evidence

- `node tools/knowledge-map-sync.js check` and
  `node --test tests/knowledge-map-sync.test.cjs` check source freshness and
  missing-source controls.
- `node tests/knowledge-map-model.test.cjs` checks complete discovery, authored
  route order, valid connections, search and module links.
- `node tests/knowledge-map-factor.test.cjs` checks exact arithmetic, input
  limits, prediction gating, stepping, resumed counts and activity lifecycle.
- `CRYPTO_MAP_JSDOM_PATH=/path/to/node_modules/jsdom node tests/knowledge-map-navigation.test.cjs`
  optionally exercises the shipped DOM runtime's navigation, focus, persistence,
  graph paging, notes and lesson integration. An installed `jsdom` can be used
  without the environment variable. DOM checks do not measure rendered layout.
- `node tools/knowledge-map-check.js` serves the repository locally and checks
  navigation and responsive layout in Chromium. The Teach pages layout job runs
  it in CI; optional external font requests are not required, and no external lab
  code is executed.

These checks do not establish Firefox/WebKit behavior, live external-lab
availability, complete WCAG conformance or cryptographic correctness across the
catalog. Arithmetic controls establish only the tested in-page Fermat behavior.
A successful merge or CI run alone does not prove publication: deployment must
also be checked against the served `/knowledge-map/` files. The root catalog must
remain the homepage, with its link to the separate learner workspace verified.
