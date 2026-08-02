# Decision: disposition of `audits/_MASTER-TEMPLATE.md` (and `audits/_STANDARDIZE-PROMPT.md`)

Date: 2026-08-02. Read-and-report analysis for the maintainer. Nothing has been executed;
this file is the deliverable.

**Question.** `audits/_MASTER-TEMPLATE.md` (373 lines) calls itself "the single source of
truth for how every lab is built" — a build/teach/look/a11y standard for the ~176 demo
repos. The repo root's `CLAUDE.md` (260 lines) is the binding catalog-maintenance
instruction file, auto-loaded into every AI session in this repo. Two competing standards
documents are worse than one. Options: (A) promote the template to the repo root,
(B) merge it into `CLAUDE.md`, (C) keep it under `audits/` as a referenced standard.
`audits/_STANDARDIZE-PROMPT.md` (374 lines, salvaged older prompt, already carries an
"ARCHIVED, AND PARTLY SUPERSEDED" warning header) is decided at the same time.

---

## 1. Scope and audience of each document

| | `CLAUDE.md` | `_MASTER-TEMPLATE.md` | `_STANDARDIZE-PROMPT.md` |
|---|---|---|---|
| Governs | The **catalog** (`index.html`, README tables, corpus, concept map) | How each **demo repo** is built/taught/styled/gated | Retro-standardizing an existing demo (older pass) |
| Read by | Every AI session opened in `crypto-lab` (auto-loaded) | A human or AI **pointed at it explicitly**, usually while working in a sibling demo repo | Nobody, by design — archived with a do-not-follow header |
| Drift guard | `readme-sync` / `corpus-sync` / `concept-sync` checkers + self-check script | **None** | Its own warning header |

Key structural fact: per-demo work happens in sibling repos (`../crypto-lab-<slug>/`) that
**never load this repo's `CLAUDE.md`**. So merging the template into `CLAUDE.md` would not
put it in front of its actual audience; it would only put it in front of catalog sessions
that don't need it.

## 2. Overlap / conflict table

| Topic | `CLAUDE.md` says | `_MASTER-TEMPLATE.md` says | Verdict |
|---|---|---|---|
| Shared top bar | **Retired** (commit `fbe77f4`): "each lab owns its own" header; `shared-header.html` / `reapply-header.py` live in `archive/header-rollout/`; "Do not resurrect them" | §3.0: the bar is "one canonical snippet shared by every lab (`shared-header.html` … applied by `reapply-header.py`)", "apply FIRST", "Never hand-build … a header" | **HARD CONFLICT.** The template's §3.0 mechanism (and the §"kickoff prompt" line "apply the shared top bar") resurrects the retired rollout verbatim. Also echoed in §4.2 ("the shared bar owns those"). |
| `cl-hero` managed markers | "The old … `/* BEGIN/END cl-hero standard */` markers were removed from all labs. If you see them reappear, something re-ran the retired tooling." | §3.1 instructs putting the hero CSS "under a marked managed block" and shows the `/* BEGIN cl-hero standard — managed, keep in sync across fleet */` comment | **HARD CONFLICT.** Following the template re-plants the exact marker `CLAUDE.md` treats as an alarm signal. (The hero CSS itself is fine and fleet-current — only the marker comment conflicts.) |
| Suite-count line in demo READMEs | (n/a — but README tables are generated, cards number ~176) | §5 closes every README with "*One of **120+** browser demos…*" | **STALE.** All five spot-checked repos say "170+". Anyone following §5 verbatim regresses the count. (`_STANDARDIZE-PROMPT.md` Part B is even staler: "60+", different scripture wording, five-section README.) |
| Self-reference | (n/a) | Tells the AI to read "`CRYPTO-LAB-TEMPLATE.md` in the repo" | **STALE.** No file by that name exists; the file is `audits/_MASTER-TEMPLATE.md` in the catalog repo, not in demo repos. |
| No backend / browser-only | Convention: "No backend, no accounts — every demo is browser-only." | Principle 6: "No backend. Everything runs in the browser… static site to GitHub Pages." | Agree. |
| One concept per demo | "One concept per demo. Don't bundle." | Brief field "Concept to teach: the single 'aha'"; §1 scope/non-goals discipline | Agree. |
| Emojis | "No emojis in markdown or HTML unless the user explicitly asks." | Mandates a favicon **emoji** (inline `data:` URI in HTML) per demo | **Mild tension.** A data-URI favicon is functional, not decorative, and the fleet does use them — but the letter of the convention and the letter of the template disagree. Worth one clarifying clause wherever the template ends up. |
| Demo URLs | Cards/corpus link `https://systemslibrarian.github.io/crypto-lab-<slug>/`; dev-domain subpaths 404 | §6: `base: '/crypto-lab-<demo-name>/'`, no root-absolute paths; pipeline links the Pages URL | Agree. |
| Catalog wiring for a new demo | Full binding workflow: card + JS maps + `readme-sync` + `corpus-sync` + `concept-sync` | Pipeline step 7: "Add the catalog card (title, tags, accent) to the `crypto-lab` index" — no mention of the three checkers | **Incomplete, not conflicting** — but if the template were promoted beside `CLAUDE.md`, its abbreviated step 7 would compete with the binding workflow. |
| Deploy | (n/a) | §6: Actions-based Pages, "not the legacy `gh-pages` branch", a11y-gated | Matches practice (see §3 below), though 4/5 repos still carry a vestigial `"deploy": …gh-pages -d dist` script. |
| Theme | (n/a) | §3.2: dark default, `data-theme` on `<html>`, "**Never use `prefers-color-scheme`**" | Matches practice with one nuance: `crypto-lab-ascon` uses `prefers-color-scheme` in `<meta name="theme-color">` media attributes (harmless, not the banned CSS use — the ban should say "in CSS"). |
| Only in `CLAUDE.md` | Card HTML format, `TITLE_TO_SECTION`/`CATEGORIES`/`LEARNING_PATHS`, README table generation, corpus entry house style, concept-coverage filing, self-check script | — | No counterpart in the template; zero risk of the template superseding these. |
| Only in template | — | Build stack (Vite+TS), invariants/KATs/testing, pedagogy standard (§2), hero spec, theme contract, full a11y gate wiring (§4), per-demo README standard, `deploy.yml` | No counterpart in `CLAUDE.md`; this is genuinely valuable content that exists nowhere else now that the root snapshot files were deleted. |

`_STANDARDIZE-PROMPT.md` vs the template: Parts B–E (README, Pages config, footer, head)
are older, thinner versions of the template's §5, §6, §3.3, §3.4 — every current fact in it
is stated better in the template; its Part 0/A shared-header material is retired and
already flagged. It contains nothing current that the template lacks.

## 3. Spot-check: template vs fleet reality (5 repos, read-only)

Checked: `crypto-lab-aes-modes`, `crypto-lab-bb84`, `crypto-lab-ascon`,
`crypto-lab-x3dh-wire`, `crypto-lab-bulletproofs`.

| Template claim | Reality | Status |
|---|---|---|
| `test:a11y` script exists | 5/5 have `"test:a11y": "playwright test"` + `e2e/a11y.spec.ts` | **Practice** |
| CI a11y gate blocks deploy | 5/5 workflows run Playwright/axe before `upload-pages-artifact` → `deploy-pages@v4` (4 via `npm run test:a11y`, ascon via `npx playwright test`) | **Practice** |
| Actions-based deploy, not `gh-pages` branch | 5/5 deploy via Actions; 4/5 still carry a vestigial `gh-pages -d dist` script in `package.json` | **Practice** (with harmless leftovers) |
| Hero title cap `clamp(1.6rem,3.8vw,2.7rem)` | 5/5 have it in CSS; `cl-hero` markup in `index.html` (aes-modes, bb84) or rendered from TS (ascon `src/main.ts`, x3dh-wire `src/ui.ts`, bulletproofs `src/app.ts`) | **Practice** |
| `/* BEGIN cl-hero standard */` managed markers | 0/5 — markers absent everywhere, per `CLAUDE.md`'s removal | **Template wrong** |
| Shared header applied by `reapply-header.py` | Tooling exists only in `archive/header-rollout/`; labs own `cl-topbar` markup individually (3 hits per repo, no `BEGIN crypto-lab shared header` comments) | **Template wrong** (the *look* survives; the *mechanism* is retired) |
| Scripture footer + suite-count closer | 5/5 READMEs close with the scripture line — but "**170+**", not the template's "120+" | Practice; template count stale |
| §5 README section list ("Exhibits", "Build & Verify"…) | Close family, not exact: bb84 has 7 of the sections, no "Exhibits"; aes-modes has "Correctness & Tests" instead of "Build & Verify" | **Aspiration** (directionally followed, names drift) |
| Size budgets / touch targets | The template contains **no** size-budget or touch-target prescriptions at all (its a11y bar is axe WCAG 2.1 A/AA; touch-target sizing is 2.5.8/WCAG 2.2, outside the gate) | n/a — anyone citing the template for these is citing something it never said |

Bottom line: the template is ~90% an accurate description of current fleet practice —
better than typical for a recovered doc — with two hard conflicts (§3.0 shared-header
mechanism, cl-hero markers), two stale facts (120+, `CRYPTO-LAB-TEMPLATE.md` self-name),
and one aspirational section (§5's exact README section list).

## 4. The three options

### A. Promote to repo root

- Pros: prominent; discoverable next to `README.md`; matches its "source of truth" self-billing.
- Cons: recreates exactly the situation the root cleanup fixed — `futuredemos.md`,
  `CARD-AUDIT.md`, `PROMPT-standardize-parts-A-D.md` etc. were deleted from the root
  *because* stale snapshots there get mistaken for current instruction. A root file
  claiming to be "the single source of truth" beside a binding `CLAUDE.md` is two
  competing standards in the most visible place possible. Promoting it as-is also ships
  the §3.0 header-resurrection conflict at maximum visibility. No checker guards it, so it
  drifts exactly like its deleted predecessors did. Prominence doesn't even reach the real
  audience: demo-repo sessions don't browse this repo's root either.

### B. Merge into `CLAUDE.md`

- Pros: one file; the template's content would be loaded into every catalog session.
- Cons: wrong audience — `CLAUDE.md` is loaded only in **this** repo, where per-demo
  build/teach/a11y content is never actionable (this repo's work is cards, sync scripts,
  taxonomy). It would roughly 2.4x `CLAUDE.md` (260 → ~630 lines), taxing every session's
  context with instructions that apply to none of them and burying the binding
  add-a-demo workflow mid-file. Worse for honesty: `CLAUDE.md`'s content is kept true by
  three checkers plus a self-check; the template prose has no checker, so merging welds
  unguarded, drift-prone content onto the one file the AI must trust absolutely — and the
  §3.0/marker conflicts would then live *inside* the document that currently warns
  against them.

### C. Keep in `audits/` as the referenced per-demo build standard (recommended)

- Pros: matches the actual reading pattern (pointed-at explicitly when building a demo,
  exactly as its own "How to use" section intends); keeps `CLAUDE.md` small, binding, and
  checker-backed; keeps root clean; mirrors the precedent already set for
  `_STANDARDIZE-PROMPT.md` (live-vs-archived status declared in a header note). The two
  hard conflicts are fixed by editing ~15 lines of the template, not by moving it.
- Cons: less discoverable — mitigated by one pointer line in `CLAUDE.md` (a one-line,
  low-drift-risk addition, unlike a merge). No automated checker guards the template;
  mitigated by scoping its self-description (it stops claiming "single source of truth"
  for anything `CLAUDE.md` owns) so drift in it can no longer contradict the binding file.

## 5. Recommendation

**Option C — keep `_MASTER-TEMPLATE.md` in `audits/` as the referenced per-demo build
standard, after correcting its two retired-tooling sections and two stale facts; move
`_STANDARDIZE-PROMPT.md` to `archive/header-rollout/` where the rest of the retired
shared-header material lives.**

Mechanical steps (not executed — maintainer/coordinator to run):

1. Edit `audits/_MASTER-TEMPLATE.md`:
   - Retitle/rescope the opening line: it is the standard for **building a demo repo**;
     catalog maintenance is governed by `CLAUDE.md` (drop "single source of truth" or
     qualify it as "for demo-repo build/teach/look/a11y"). Add a status header in the
     `_STANDARDIZE-PROMPT.md` style stating which sections were corrected and when.
   - Rewrite **§3.0** for the post-retirement reality: each lab owns its own `cl-topbar`
     header; to add one, copy from any existing lab and adapt (per `CLAUDE.md`); delete
     the references to `shared-header.html` / `reapply-header.py` (or point them at
     `archive/header-rollout/` as history). Keep the four demo-side expectations
     (`#app` skip target, `data-theme` contract, `--accent`, single banner) — those are
     still accurate. Remove the matching "shared top bar" phrasing from the kickoff
     prompt (step 2 in "How to use") and §4.2's "the shared bar owns those".
   - In **§3.1**, delete the `/* BEGIN cl-hero standard — managed, keep in sync across
     fleet */ … END */` marker comments around the CSS block (keep the CSS itself —
     it matches the fleet).
   - In **§5**, change "120+" to "170+" (or a count-free "One of the browser demos in
     the Crypto Lab suite" to stop this from going stale again).
   - Fix the self-name: replace both `CRYPTO-LAB-TEMPLATE.md` references with
     `audits/_MASTER-TEMPLATE.md` (or "this file").
   - Optional one-liner in §3.4/§0: note that the favicon emoji data-URI is the sole
     sanctioned emoji use, so it doesn't read as contradicting the no-emoji convention.
2. `git mv audits/_STANDARDIZE-PROMPT.md archive/header-rollout/_STANDARDIZE-PROMPT.md`
   (its warning header already says its live parts are superseded by `CLAUDE.md` and the
   template; everything current in it is stated better in the template).
3. Add one pointer line to `CLAUDE.md`'s "Conventions" (or the "add new demo" workflow):
   "Per-demo build/teach/look/a11y standard: see `audits/_MASTER-TEMPLATE.md`." (This is
   the only `CLAUDE.md` change; it makes the template referenced rather than competing.)
4. Optional honesty guard: extend the `CLAUDE.md` self-check script with a grep that
   fails if `audits/_MASTER-TEMPLATE.md` mentions `reapply-header.py` or
   `BEGIN cl-hero standard` — the two known resurrection vectors.

None of the above was executed; this repo's working tree is unchanged except for this file.
