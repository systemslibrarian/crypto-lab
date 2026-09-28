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
| `exhibits` | Ordered. Fields in their own table below. |
| `discussion_questions` | Three to five. |
| `instructor_notes` | `expected_observations`, `misconceptions`, `conceptual_answers`. Public, so conceptual only: never the values a run produces. Each note is either a plain string or an object; the object form is documented below. |
| `assessment` | Required. `{ "name", "description" }`. The description is capped at two sentences — see below for why that cap is deliberate. |
| `trimmed` | Exhibits left out of the sequence, each `{ "name", "reason" }`. |
| `last_checked` | YYYY-MM-DD. |

An exhibit name that matches no card fails the build rather than being substituted.

### Exhibit fields (entries in `exhibits`)

| Field | Rule |
|---|---|
| `name` | The repo name minus `crypto-lab-`. Must match a card in `index.html`. |
| `role` | `intro`, `break-it`, `fix` or `extension`. |
| `minutes` | Positive integer. Re-derived against what a student actually does, not a budget. |
| `students_do` | One line, taken from the lab's README rather than the card blurb. |
| `source_commit` | The lab commit that was read, 7 to 40 hex characters. |
| `source_commit_date` | Optional, `YYYY-MM-DD`: the date of that pinned commit. It is what dates an exhibit's citation. Where the record does not hold it the citation carries **no year field at all**, and specifically not `(n.d.)` — omitting a field is honest, asserting an absence is not. Never the lab's latest commit date, which would date a build the worksheet was never checked against. |
| `worksheet` | `null`, or the exhibit name once a worksheet exists. |
| `outcome_note` | Required when the worksheet serves no outcome, saying what the exhibit does instead. Rendered on the module page. |
| `time_note` | Optional, one line, rendered beside `outcome_note` on the module page. |
| `privacy`, `support`, `run_specific_values` | The three per-exhibit checks below. |

### The assessment artifact

`assessment` names the one object a student hands in, and the description is held
to **two sentences by the validator**. That cap is deliberate and worth keeping.

The worksheets are ungraded inquiry; the artifact is the thing collected from what
they already produce. A longer field becomes a second set of instructions sitting
beside the worksheets, and then the two drift — the worksheets say what to do, and
an instructions-shaped assessment says it again, differently. The cap makes that
impossible rather than discouraged.

It follows that a prompt list and a rubric do not belong here. A rubric is grading
criteria for an instructor, not a description of the object; the artifact is
written to be gradable by a human with no answer key, because values differ from
run to run. The same bar as `instructor_notes` applies: no run-specific values.

### Instructor note objects

A note may be a plain string, or an object when it carries something that has to
be re-checked against the live exhibit:

| Field | Rule |
|---|---|
| `text` | The note itself. |
| `exhibit` | Optional: which exhibit it belongs to. |
| `rederived` | `YYYY-MM-DD`, when this was last checked against the live page. Required. |
| `observable.kind` | `text-present`, `text-absent` or `manual`. |
| `observable.needle` | The text to look for. Required for `text-present` and `text-absent`. |
| `observable.why`, `observable.cadence`, `observable.cadence_days` | Required when `kind` is `manual`: why it is not automated, the cadence in words, and the same cadence as an integer. |
| `observable.steps`, `observable.note` | Optional detail. |

A note that states a defect is a claim about a live page, so it carries the date
it was re-derived and something a checker can look for. `tools/teach-issues.js`
re-reads them.

### Per-exhibit checks (null until observed; every one dated)

A `support` result that is not a pass needs a one-line `headline` for the module
page and its own `rederived` date; the same applies to a `privacy` record with
other origins, cookies or storage. The headline is what the module page prints,
so it is a sentence rather than a code.

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
  "headline": "one instructor-facing line, required when any result is not a pass",
  "results": [
    { "engine": "Chromium", "viewport": "1280x720", "result": "pass", "notes": "" },
    { "engine": "WebKit", "viewport": "390x720", "result": "issues", "notes": "what failed",
      // required on any result that is not a pass:
      "rederived": "YYYY-MM-DD",              // when this was last checked against the LIVE page
      "issue": { "kind": "horizontal-overflow", "overflow_px": 92 } }
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

**A recorded issue needs a re-derivation date, and a shape a tool can re-check.** The
module page publishes these issues to instructors, which makes each one a claim about a
lab that goes stale the way a class-time figure does. Re-derived for the first time on
2026-09-22, three of the four recorded here were wrong: two no longer reproduced at all,
and one had moved from about 136px to about 92px. So a result that is not a `pass`
carries `rederived`, the date it was last checked against the live page, and an `issue`
whose `kind` says how to re-check it:

- `horizontal-overflow` — carries `overflow_px`; `tools/teach-issues.js` loads the live
  exhibit in that engine at the narrowest viewport named and measures it.
- `manual` — no tool can re-derive this one. It is reported as UNCHECKED on every run,
  with its age, rather than passing quietly: a check that cannot look must not report
  clean.

`node tools/teach-issues.js` re-derives them all and exits non-zero on any that has
moved, gone, or cannot be read; the scheduled Teach pages workflow runs it with
`--open-issues`. It never edits these files — clearing a record is a judgement about
whether the lab changed or the engine did, and that belongs to a maintainer.

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
