# Knowledge map

The separate `knowledge-map/` landing page reuses the existing catalog. It does
not call an LLM. Paths are authored sequences, concepts are filings in
`concept-coverage.md`, and module roles and prerequisites come from
`teach/_src/modules/*.json`. Shared tags or algorithms do not create learning
relationships. Related-concept links require a shared lab in two authored filings
and are explicitly described as exploration rather than prerequisites.

`tools/knowledge-map-sync.js write` generates `knowledge-map/catalog.json`.
Its check mode compares the entire generated output, including hashes of the
source files, to the saved bytes. It refuses unreadable or empty populations,
duplicate cards, dangling path or concept members, unfiled labs and missing module
metadata. It reuses `concept-sync.js`'s citation parser. A card marked WIP remains
WIP. UNKNOWN, NOT-SCANNED and N/A index terms and partial-source metadata remain
visible; none is silently interpreted as a clean source scan.

Generation is deliberate: changing a source requires regenerating and reviewing
the saved diff. CI fails stale output; it does not write to `main` automatically.
The runtime needs only the generated JSON and the static page, JS and CSS.

The selected view owns the detail selection. Changing a path, concept, module or
section retains the selected lab only if it belongs to that view; otherwise it
selects the first member. Previous and next steps carry the sequence they belong
to, so following a module step retains that module. Depth is a coverage report
with no implied sequence. A URL fragment records the view, scope and lab, with
invalid identifiers falling back to valid members. Browser history restores that
state. Native buttons, search, select and details controls support the keyboard;
focus survives re-rendering and Escape dismisses search results.

Prerequisite text describes an entire course module, not a mandatory lab-level
dependency graph. A lab with no module has no recorded module prerequisites.
Extending this to lab-level prerequisite edges requires authored evidence rather
than interpreting path order as a prerequisite.

The `README catalog` workflow checks data freshness and positive/negative source
controls. The `Teach pages` layout job runs `tools/knowledge-map-check.js` against
an isolated local HTTP server in Chromium: every authored view, topic search,
next steps, prerequisites, local module links, history, malformed deep links,
catalog-load failure and horizontal overflow at 320, 390, 768 and 1280 pixels.
It blocks optional external font requests and never executes external lab code.
It does not establish Firefox/WebKit behavior, real lab availability, complete
WCAG conformance, cryptographic correctness or a successful Pages deployment.

The catalog does not link to this draft. `noindex` limits indexing and provides
no access control. The repository publishes `main` through GitHub Pages, so
merging a map repair ships it even if the catalog link remains absent. A draft PR
allows review without changing the served page.
