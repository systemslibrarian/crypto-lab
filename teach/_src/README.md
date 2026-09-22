# teach/_src — sources for the /teach/ pages

Everything under `teach/` except this folder, `teach.css`, `teach.js` and `LICENSE` is
**generated**. Edit the sources here, then run:

```
node tools/teach-build.js          # write the pages
node tools/teach-build.js check    # what CI runs: pages match sources, count lint passes
```

Never hand-edit a generated page. On a merge conflict in one, take either side, rerun the
generator, and commit what it writes.

This folder starts with an underscore on purpose. The hub is a legacy GitHub Pages build,
which runs Jekyll; Jekyll skips folders named with a leading underscore, so these sources
are not published as pages. That is also why a worksheet's "raw Markdown" link points at
GitHub rather than at the hub.

## Files

| File | What it holds |
|---|---|
| `modules/<id>.json` | One course module. One file per module so sessions can edit modules in parallel. |
| `worksheets/<module-id>/<exhibit>.md` | One worksheet: front matter plus a small Markdown subset. |
| `landing.html` | The /teach/ prose. `<!-- teach:name -->` markers are filled in by the generator. |
| `site.json` | Strings every page shares: the syllabus line, the hub URL, the repo. |
| `evidence.json` | Dated observations the privacy section is built from, recorded with `node tools/teach-observe.js <url>`. Record new ones; do not paraphrase. |

Exhibit titles and live URLs always come from the cards in `index.html`, and author,
version and date come from `CITATION.cff`. Do not retype either here.

## Module data (`modules/<id>.json`)

| Field | Rule |
|---|---|
| `id` | Same as the file name. It becomes `/teach/<id>/`. |
| `position` | Sort key for the module menu. Not shown. |
| `title`, `audience`, `course_fit` | One line each. |
| `prerequisites` | List of one-line strings. |
| `outcomes` | Three to five, each starting "Students will be able to", with a measurable Bloom's verb. |
| `exhibits` | Ordered. Each: `name` (repo name minus `crypto-lab-`), `role` (intro, break-it, fix or extension), `minutes`, `students_do` (one line, from the lab's README, not the card blurb), `source_commit` (the lab commit read), `worksheet` (null, or the exhibit name once a worksheet exists), and the three per-exhibit checks below. |
| `discussion_questions` | Three to five. |
| `instructor_notes` | `expected_observations`, `misconceptions`, `conceptual_answers`. Public, so conceptual only: never the values a run produces. |
| `trimmed` | Exhibits left out of the sequence, each `{ "name", "reason" }`. |
| `last_checked` | YYYY-MM-DD. |

An exhibit name that matches no card fails the build rather than being substituted.

### Per-exhibit checks (null until observed; every one dated)

```json
"privacy": {                     // from node tools/teach-observe.js <exhibit url> [engine]
  "checked": "YYYY-MM-DD",
  "other_origins": ["https://fonts.googleapis.com"],
  "storage": ["localStorage: theme"],
  "cookies": [],
  "notes": "what was loaded, which worksheet steps were run, which engine"
},
"support": {
  "checked": "YYYY-MM-DD",
  "results": [
    { "engine": "Chromium", "viewport": "1280x720", "result": "pass", "notes": "" },
    { "engine": "WebKit", "viewport": "390 wide", "result": "issues", "notes": "what failed" }
  ]
},
"run_specific_values": {
  "checked": "YYYY-MM-DD",
  "value": "yes | partly | no",
  "source": "the source line that makes values differ (required unless no)",
  "notes": ""
}
```

A module page says "your values will differ from your classmates'" only for exhibits whose
`run_specific_values.value` is `yes`. Name engines, never devices that were not tested.

## Worksheets (`worksheets/<module-id>/<exhibit>.md`)

Front matter, in this strict YAML subset (`key: value`, `key: [a, b]`, or a key followed by
`  - item` lines):

```
---
exhibit: padding-oracle          # must match the file name
module: symmetric                # must match the folder
minutes: 35
outcomes: [3, 4]                 # module outcome numbers this worksheet serves
source_commit: e57bb57259b8      # the lab commit the steps were checked against
checked: 2026-09-22
anchors:                         # every control a step names
  - "#p1-craft-setup-btn"        # an element id present in the lab's source
  - "label:Run Attack"           # or an exact accessible name, if there is no stable id
---
```

The body has exactly these level-two sections, in order: **Predict** (before any click),
**Do**, **Record** (values from the student's own run), **Explain**, and **Fix / Extend**
(or just Fix, or just Extend).

Markdown allowed: `##` and `###` headings, paragraphs, `- ` and `1. ` lists (one level),
pipe tables, `> ` notes, and inline `code`, **bold**, *italic* and `[links](https://...)`.
Raw HTML, images and code fences are refused so a worksheet cannot render differently from
how its raw Markdown reads. Numbered lists under Predict, Explain and Fix / Extend get
answer space when printed; empty table cells under Record are the spaces students fill in.

Anchors are what the daily drift check (`tools/teach-drift.js`) looks for on the live
exhibit. A control counts as present if it is in the DOM once the page has rendered, even
on a tab that is not open. A control that only appears after an interaction (a panel that
unlocks at a later step, a button a run creates) is not there on load, so the check cannot
see it: do not list it as an anchor. If a step needs a control with no stable id or exact
label, or one that only appears later, state the goal instead of naming the control, and
log a finding for that lab.

Explanations may not go further than the lab's own README: no broader limitation, no
stronger mechanism, no citation the lab does not carry unless checked against the primary
source. A claim the worksheet needs and the lab does not make is an open question, not a
sentence.

## The count lint

`check` fails on a digit in front of exhibits, labs, demos, categories, paths or modules
anywhere under `teach/`. A number like that goes stale the day the catalog changes. Compute
it in the generator or leave it out.
