# CLAUDE.md

> **Trigger phrase: "add new demo"** (also: "add a new demo", "new demo"). When the user says any of these followed by a GitHub repo URL, slug, or description, execute the "Adding a new demo" workflow below end-to-end without further prompting unless required info is missing. Do not commit or push — finish the edits, run the self-check plus `node tools/readme-sync.js check`, `node tools/corpus-sync.js check`, `node tools/concept-sync.js check`, and `node tools/theme-sync.js check`, and report back so the user can review the diff.

This is the source for **Crypto Lab** (https://crypto-lab.systemslibrarian.dev/) — a single-page static site (`index.html` + `README.md`) deployed via GitHub Pages from `main`.

The catalog has three navigation layers and they all live in `index.html`:

- **Learning Paths** (top): curated, ordered journeys — `LEARNING_PATHS` in the JS IIFE.
- **Section H2 dividers**: curriculum-ordered section breaks within the grid — `SECTIONS` + `TITLE_TO_SECTION` in the JS IIFE.
- **Filter chips**: cross-cutting tags — `CATEGORIES` in the JS IIFE, applied to cards via `data-category`.

Two cross-cutting tags (`FOUNDATIONS`, `REAL-WORLD SYSTEMS`) are applied at runtime via `FOUNDATIONS_TITLES` and `REAL_WORLD_TITLES` arrays, so you don't repeat them in every card's `data-category`.

`index.html` is the single source of truth. Three maintainer-facing files derive from it and
each has a checker that fails when it drifts:

| File | Holds | Checker |
|---|---|---|
| `README.md` | Featured / Learning Paths / All Demos tables | `node tools/readme-sync.js check` |
| `../crypto-counsel/corpus.json` | RAG snapshot of every card | `node tools/corpus-sync.js check` |
| `concept-coverage.md` | the catalog mapped onto ~40 concepts; the gap list | `node tools/concept-sync.js check` |

A fourth checker guards the sibling demo repos rather than a file derived from
`index.html`:

| Invariant | Checker |
|---|---|
| every lab pins exactly one theme, and none ships a toggle | `node tools/theme-sync.js check` |

`concept-coverage.md` is the only gap list. Several older analysis files that used to sit in
this root — `futuredemos.md`, `CARD-AUDIT.md`, `CARD-ACCURACY-FINDINGS.md`,
`HEADER-ROLLOUT-TODO.md`, `PROMPT-standardize-parts-A-D.md` — were snapshots that the
generators and checkers above now supersede, and were deleted rather than left to be mistaken
for current. They remain in git history if a historical read is needed.

---

## Adding a new demo

When the user says "add a new demo" or drops a new repo URL, do all of these:

### 1. Add a card to `index.html`

Insert the card block inside `<div class="project-grid">`, just before its closing `</div>`. The JS reorders cards into sections at runtime, so position within the grid doesn't matter — only `data-section` (auto-assigned from `TITLE_TO_SECTION`).

```html
<a class="project-card" data-category="CATEGORY [| SECONDARY]" href="https://systemslibrarian.github.io/crypto-lab-<slug>/" target="_blank" rel="noopener" style="--accent: #COLOR;">
  <div class="card-kicker">SHORT KICKER</div>
  <div class="project-title">DEMO NAME</div>
  <div class="project-copy">ONE-SENTENCE EXPLANATION — under ~36 words, no fluff.</div>
  <div class="project-meta">
    <div class="stack">
      <span class="chip">PRIMITIVE A</span>
      <span class="chip">PRIMITIVE B</span>
      <span class="chip">PRIMITIVE C</span>
      <span class="chip">PRIMITIVE D</span>
    </div>
    <span class="arrow">&rarr;</span>
  </div>
</a>
```

If the live demo page is not yet deployed, add `wip-card` to the class and a badge:

```html
<a class="project-card wip-card" data-category="..." ...>
  <span class="wip-card-badge">WIP</span>
  ...
</a>
```

**Valid `data-category` values** (one or more, separated by ` | `):
`FOUNDATIONS`, `ENCRYPTION`, `SIGNATURES`, `KEY EXCHANGE`, `PROTOCOLS`, `MPC & THRESHOLD`, `PRIVACY`, `ZERO-KNOWLEDGE`, `HOMOMORPHIC`, `HASHING & KDFS`, `RANDOMNESS`, `POST-QUANTUM`, `ATTACKS`, `REAL-WORLD SYSTEMS`, `STEGANOGRAPHY`, `HISTORICAL`.

Do **not** put `FOUNDATIONS` or `REAL-WORLD SYSTEMS` directly in `data-category` — add the title to `FOUNDATIONS_TITLES` / `REAL_WORLD_TITLES` instead (step 2c).

**Accent color** — rotate so neighboring cards differ:
- `#35d6bb` (teal)
- `#ffb84d` (amber)
- `#ff6b7f` (crimson)
- `#9f88ff` (violet)

### 2. Wire the demo into the JS maps (same `<script>` IIFE)

**a.** Add the demo's exact title to `TITLE_TO_SECTION` with one of these section ids:

| section id | covers |
|---|---|
| `foundations` | hashes, MACs, KDFs, RNG, ECC basics, commitments, secret sharing, password hashing |
| `symmetric` | block/stream ciphers, AES modes, AEAD, lightweight crypto |
| `public-key` | RSA, ECDSA, Ed25519, BLS, IBE, hash-based sigs, blind/ring sigs |
| `key-exchange` | DH/ECDH, X3DH, Noise, MLS, Kerberos, PKI, OPAQUE, WebAuthn, envelope KMS |
| `privacy` | ZK, FHE/HE, MPC, PIR, ORAM, PSI, threshold decryption/signing |
| `post-quantum` | PQ KEMs, PQ sigs, hybrids, migration planners, quantum algorithms (Shor/Grover/BB84) |
| `cryptanalysis` | attacks, side-channels, padding/timing oracles, fault injection, protocol composition flaws |
| `historical` | historical ciphers, steganography |

**b.** If the demo is a foundational primitive (a building block other things use): add the title to `FOUNDATIONS_TITLES`. The JS auto-appends `FOUNDATIONS` to its `data-category`.

**c.** If the demo is a deployed, named, real-world protocol (TLS, Kerberos, PKI, Signal stack, KMS, WebAuthn, etc.): add the title to `REAL_WORLD_TITLES`. The JS auto-appends `REAL-WORLD SYSTEMS`.

### 3. Regenerate `README.md`'s tables

The Featured and All Demos tables are **generated from the cards** — Category
mirrors the card kicker, Stack mirrors the chips, sorted by Category then
title, with the ` *(WIP)*` suffix derived from the card class. Never hand-edit
the rows; after any card change run:

```
node tools/readme-sync.js
```

`node tools/readme-sync.js check` verifies parity without writing (CI-friendly).

### 4. (Optional) Add to a Learning Path

If the demo fits the Developer / Cryptanalyst / Post-Quantum / Key Exchange journeys, add `{ title: 'Demo Name' }` at the right step position inside the matching `LEARNING_PATHS` entry. The JS auto-detects WIP from the card class — no separate `wip: true` needed when the card exists. The README's Learning Paths table is generated from this array — rerun `node tools/readme-sync.js` after any path change.

### 5. Verify

```
python -m http.server 8765
```

Open `http://localhost:8765/` and confirm:
- New card appears in the intended section (search by demo name in the filter input).
- Each `data-category` chip filters the card in.
- `node tools/readme-sync.js check` reports the README tables in sync.
- `node tools/theme-sync.js check` reports the new lab pinning one theme with no toggle.
  It reads **every** page in the lab, not just the root `index.html` — a sub-page that boots
  from `localStorage` or `prefers-color-scheme` instead of pinning a literal will fail it.

Then check the demo repo itself carries its dependency automation, because a lab without it
opens **one pull request per dependency, forever** — ungrouped, this fleet reached 1,461 open
PRs across 176 repos:

```
test -f ../crypto-lab-<slug>/.github/dependabot.yml && grep -q npm-minor-and-patch ../crypto-lab-<slug>/.github/dependabot.yml && echo "grouping OK"
grep -rq 'dependabot/fetch-metadata' ../crypto-lab-<slug>/.github/workflows/ && echo "auto-merge OK"
grep -rq 'pull_request' ../crypto-lab-<slug>/.github/workflows/ && echo "PR gate OK"
grep -rq 'workflow_dispatch' ../crypto-lab-<slug>/.github/workflows/ && echo "dispatch OK"
```

All four are required and all four are specified in `audits/_MASTER-TEMPLATE.md` §6.1–6.2.
The last one is not optional bookkeeping: a merge made with `secrets.GITHUB_TOKEN` raises no
push event, so without an explicit dispatch the bump lands on `main` and the live site keeps
serving the old build with nothing going red to say so.

A self-check script lives at the end of this file — copy it into a `node -e "..."` invocation to verify title coverage.

### 6. Sync the crypto-counsel corpus

The **crypto-counsel** chatbot (sibling repo, `../crypto-counsel`) embeds a snapshot
of every demo card in its `corpus.json` as `demo_crypto_lab_<slug>` entries. That
snapshot does **not** update itself — a new demo here is invisible to the chatbot
until its corpus entry is added. So for each new demo:

1. Generate a skeleton seeded from the demo's README:

   ```
   node tools/corpus-sync.js gen <slug> "<Demo Name>"
   ```

2. Fill in the `TODO` prose (What It Is, When to Use It, the Live Demo paragraph),
   grounded in the demo's README — match the house style of existing entries
   (4-6 sentence "What It Is"; three "Use it to/for …, because …" bullets plus one
   "Do not use it …, because it is a demo app and does not provide hardened
   operational controls."; Live Demo link pointing at the demo's own Pages site,
   `https://systemslibrarian.github.io/crypto-lab-<slug>/`).

   Use that github.io form, **not** `https://crypto-lab.systemslibrarian.dev/<slug>/`.
   The dev domain serves this catalog page; per-demo subpaths under it 404. Earlier
   versions of this file specified the dev-domain form, which is how 242 dead Live
   Demo links accumulated across the corpus before being repointed. A handful of
   demos are not under the `crypto-lab-` prefix (`snow2`, `crypto-compare`) — take
   the URL from the demo's card `href` in `index.html` rather than assembling it.

3. Append the finished `{ "id": …, "text": … }` object to the corpus array in
   `../crypto-counsel/corpus.json` (it is minified, single-line, no trailing
   newline — preserve that), and bump the counts in that repo's `README.md`
   (total entries, "N crypto-lab demo cards", and the `Demo slugs (N)` list).

4. Confirm parity:

   ```
   node tools/corpus-sync.js check
   ```

   A clean run prints `Missing from corpus (0): []` and `Stale in corpus (0): []`.

Do not append `TODO` placeholder text to the live corpus — refine the prose first.

### 7. File the demo under its concept in `concept-coverage.md`

`concept-coverage.md` maps the catalog onto the ~40 distinct *ideas* cryptography is built
from, so "what's left to build?" is a lookup rather than an audit. It is idea-level where the
card kickers are artifact-level, and it is the file that answers **is anything missing?** A
demo that ships without being filed there silently invalidates its gap list.

For each new demo:

1. Find the concept it teaches and add the exact card title to that concept's citation line
   (the `·`-separated run directly under the `**N. Concept — \`STATUS\`**` header). Only that
   first paragraph is parsed as citations — later paragraphs are commentary.
2. Re-check the concept's status: a `GAP` or `PARTIAL` may now be `COVERED`. If the demo
   closes a gap listed in the **Gap summary** table, remove that row.
3. Bump the version note at the top of the file, saying what changed.
4. Confirm parity:

   ```
   node tools/concept-sync.js check
   ```

   A clean run prints `Cited but no card (0)` and `Carded but unmapped (0)`.

If a demo is built but its card is not landing yet, cite it as
`*Name (built, uncatalogued)*` — `concept-sync` treats that as known backlog rather than a
dangling citation. Clear the marker when the card ships.

If nothing in the map fits the demo, say so rather than forcing a placement — that is a real
signal the taxonomy needs a boundary moved, which is the user's call.

---

## Other maintenance

**Add/reorder filter chips** — edit `CATEGORIES` array. Curriculum order is the visual order. Two-row chip bar splits at `Math.ceil(length/2)`, so length 16 = 8 per row.

**Add a curriculum section** — add an entry to `SECTIONS`, a matching `<a href="#section-<id>" data-target="<id>">Label</a>` in `<nav class="section-nav">`, and update all card titles' `TITLE_TO_SECTION` entries to the new id where appropriate.

**Add a learning path** — add an entry to `LEARNING_PATHS` with `id`, `label`, `blurb`, `steps`. Keep `steps` ≤ ~12 for readability. CSS auto-collapses to one column under 1120px.

**Themes — one per lab, pinned, no toggle.** Dark everywhere, except
`quantum-vault-kpqc`, which is light on purpose.

The fleet used to ship a light palette and a header toggle. The toggle persisted
its choice, so one past click pinned a returning visitor to light forever, and the
light palettes read badly. Both were removed: each lab stamps `data-theme` on
`<html>` and pins it before first paint with a literal, overwriting any stored
preference rather than reading one.

`quantum-vault-kpqc` pins **light**. Its warm hanji (한지) paper palette with
Korean-flag navy/red accents is the intended, culturally-aware look for a demo of
Korean post-quantum cryptography, and it is also the palette that passes its axe
gate — the dark one has known failures on four controls. **A fleet-wide dark sweep
must skip it.** This is not a straggler to clean up; it was flattened once already
by a sweep that looked locally correct in all 175 repos at once.

Two checks defend this, and they catch different things:

- `node tools/theme-sync.js check` reads **every visitable page** in every lab from here —
  not just the repo-root `index.html`. It used to read only the first one it found, and
  that is precisely what hid `zk-proof-lab`: its lobby pinned dark while its eight
  `exhibits/*.html` pages carried no `data-theme` and booted from
  `localStorage.getItem('theme') ?? prefers-color-scheme`, so a deep-linked visitor on a
  light-preferring OS got the light palette. 404 pages, OG-card templates and timing
  harnesses are excluded on purpose — they are not demo pages. It
  catches a wrong pinned theme, a missing `data-theme`, a boot script that reads a
  stored preference again, and a returning `#cl-theme-toggle`. It then sweeps each
  repo's source for code that still *drives* a toggle — clicking it, or asserting
  the page reaches light. That second sweep exists because the removal pass
  rewrote `e2e/` but never walked `scripts/` or `contrast/`, where six labs keep
  custom CI runners; their Playwright suites were green while their deploys were
  red. Run it after any cross-repo pass. Its expected-theme map is the source of
  truth for the exception.
- Each lab's own `e2e/theme.spec.ts` asserts the *resolved* theme and that no theme
  control renders. That one runs in CI and blocks the deploy, but it cannot see an
  `<html data-theme>` that disagrees with the boot script — only the source check can.
  **It is not fleet-wide coverage: only 20 of 176 repos have one** (verified
  2026-08-19). For the other ~155 labs `theme-sync.js` is the *only* thing defending
  the theme contract, so do not treat a green lab CI as evidence the theme is checked.

**The suppression rule is load-bearing.** Removing `#cl-theme-toggle` did not remove
every toggle. 82 labs still build an older `#theme-toggle` of their own, and in **35 of
them the button is fully wired** — the click handler flips the theme and writes it to
`localStorage`. Not one of them renders it, for exactly one reason: an inline rule in
each page,

```css
body :is(#theme-toggle,#themeToggle,.theme-toggle,.theme-toggle-btn,[data-theme-toggle]){display:none!important}
```

Delete that line and the lab has a working, persisting toggle again — the precise
failure the removal existed to end. Nothing checked it until 2026-08-19; a pass that
tidied those inline `<style>` blocks would have resurrected 35 toggles silently and
looked correct in every repo. `theme-sync.js` now **fails** if a lab can build a legacy
toggle but no longer suppresses it, and lists the 35 wired ones under *"Legacy toggle
debt"* as a non-failing warning. Deleting the dead toggle code is the real fix and is
still outstanding; until then, do not touch those `<style>` blocks casually.

`[data-theme="light"]` blocks survive in most stylesheets as dead code. Nothing
selects them; deleting them fleet-wide was judged not worth the risk. Don't treat
their presence as evidence a lab still has a light theme.

The full contract, with the anti-flash snippet to copy, is `audits/_MASTER-TEMPLATE.md` §3.2.

**Lab headers — each lab owns its own.** There is no shared header to sync, and no script
that pushes one. `reapply-header.py`, `apply-header.sh`, `shared-header.html` and the
rollout verifiers are **retired** in `archive/header-rollout/` (see its README for why).
Do not resurrect them.

- Changing one lab's header: edit that lab.
- New demo: copy a header from any existing lab and adapt it.
- A change every lab should get: a deliberate reviewed pass across the repos, never an
  overwrite driven from this one.

The old `<!-- BEGIN/END crypto-lab shared header -->` and `/* BEGIN/END cl-hero standard */`
markers were stripped in a fleet-wide pass. **That pass is now complete** — as of 2026-08-19
there are zero live markers anywhere in the fleet, so TASKS.md task 15 is done. The earlier
note here named five survivors (`dp-noise`, `ghost-commit`, `iron-serpent`, `salamander`,
`stream-ward`); that list is retired, and `dp-noise` and `iron-serpent` are clean.

Because no marker should exist now, seeing one **is** a genuine signal that something re-ran
the retired tooling. Treat it as such.

Four `index.html` files still mention the tooling in prose, and three of them are *correct* to:
`ghost-commit`, `salamander` and `stream-ward` say "THIS LAB OWNS IT … the fleet-wide push
(shared-header.html + reapply-header.py) was retired … Edit this copy directly." Leave those.

`otp-vault` was the last one still giving the wrong instruction — *"Part 0 (canonical shared
header) is applied here once the catalog shared-header.html snippet is provided; do not
hand-build one"* — which pointed a contributor at retired tooling and told them not to build
the thing each lab now owns. Fixed 2026-08-19 to the ghost-commit wording. **No lab carries
that instruction any more**, so grep for "do not hand-build one" should stay empty.

---

## Conventions

- No backend, no accounts — every demo is browser-only.
- One concept per demo. Don't bundle.
- Demos link to their own GitHub Pages site (`https://systemslibrarian.github.io/crypto-lab-<slug>/`), not the source repo. Source lives at `https://github.com/systemslibrarian/crypto-lab-<slug>`.
- No emojis in markdown or HTML unless the user explicitly asks for them.
- Featured cards (`.feature-card`) are folded into their curriculum section at runtime, so the catalog always starts with Foundations.
- Per-demo build/teach/look/a11y standard: see `audits/_MASTER-TEMPLATE.md`. It governs how a demo repo is built; this file governs the catalog.

---

## Self-check

After adding a demo, run this to verify nothing is orphaned:

```bash
node -e "
const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const titles=[];
const re=/class=\"(?:feature|project)-title\">([^<]+)</g;
let m;while((m=re.exec(html))!==null)titles.push(m[1].trim());
const idx=html.indexOf('var TITLE_TO_SECTION = {');
const end=html.indexOf('};',idx);
const block=html.slice(idx+'var TITLE_TO_SECTION = '.length,end+1);
const mapped=Object.keys(eval('('+block+')'));
console.log('HTML titles:',titles.length,'| Mapped:',mapped.length);
console.log('Mapped but not in HTML:',JSON.stringify(mapped.filter(t=>!titles.includes(t))));
console.log('In HTML but not mapped:',JSON.stringify(titles.filter(t=>!mapped.includes(t))));
const pIdx=html.indexOf('var LEARNING_PATHS = [');
const pEnd=html.indexOf('];',pIdx);
const paths=eval('('+html.slice(pIdx+'var LEARNING_PATHS = '.length,pEnd+1)+')');
const orphans=[];paths.forEach(p=>p.steps.forEach(s=>{if(!s.wip&&!titles.includes(s.title))orphans.push({path:p.id,title:s.title});}));
console.log('Orphan path step titles:',JSON.stringify(orphans));
"
```

A clean run prints empty arrays for the three checks.
