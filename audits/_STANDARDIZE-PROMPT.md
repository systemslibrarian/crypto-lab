> **ARCHIVED, AND PARTLY SUPERSEDED.** Preserved here because it was sitting untracked in
> the repo root and would have been lost. Its Part-A shared-header sections describe the
> `shared-header.html` rollout that was deliberately RETIRED (commit `fbe77f4`) — each lab
> now owns its own header, and the rollout tooling lives in `archive/header-rollout/`. Do not
> follow those sections. The README, Pages-config, footer and `<head>` guidance is still
> broadly current, but `CLAUDE.md` and `audits/_MASTER-TEMPLATE.md` are the live references.

# PROMPT: Standardize Crypto-Lab Demo — Parts 0 + A–E
## Target: crypto-lab-[DEMO-NAME]

This prompt standardizes an existing Vite + TypeScript crypto-lab demo so it matches
every other lab in the suite.
Do NOT modify any cryptographic logic, demo functionality, or algorithm code.
Touch only the shared header, theme contract, README, GitHub Pages config, footer, and
page `<head>` (title/description/favicon).

The header / top bar is NOT designed per demo — it is one canonical snippet shared by
every lab (`shared-header.html` in the catalog repo). Apply it as-is (Part 0). Never
hand-build a header, top bar, or theme-toggle button; that competing layout is the exact
mistake this prompt exists to prevent.

---

## ANTI-HALLUCINATION RULES

- Read every file before editing it. Do not assume its current contents.
- Do not invent CSS variable names, algorithm details, or file paths.
  Use only what exists in the actual files.
- If a step cannot be completed, stop and report the blocker. Do not proceed.
- After every edit, re-read the changed file and confirm the new content
  is present verbatim.

---

## PHASE 0 — Confirm working directory

Run `pwd` and `ls` to confirm the current directory.
You are already inside the correct repo — do not clone anything.

Before touching any file, read:
- `index.html` — full structure and existing toggle/footer markup
- All `.css` files — identify every existing CSS variable name
- `src/main.ts` or equivalent entry file — existing toggle logic
- `README.md` — preserve any existing badge block at the top
- `vite.config.ts` — confirm base path
- `package.json` — confirm deploy script and repo name
- The live GitHub Pages URL for this repo
- `../crypto-lab/shared-header.html` — the canonical shared header (the source of truth; do not hand-build one)
- `../crypto-lab/HEADER-ROLLOUT-TODO.md` — how the shared header is applied to a new demo

---

## Part 0 — Shared Global Header (apply FIRST)

The top bar is NOT hand-built per demo. Every lab shares one identical, canonical header so
the whole suite looks and behaves the same. The source of truth is `shared-header.html` in
the catalog repo; it is applied by `reapply-header.py`. **Never write your own header, top
bar, or nav, and never restyle this one** — per-demo layout adjustment is exactly the mistake
this part prevents.

### Step 0.1 — Apply the canonical header

From inside this demo repo:

```bash
python ../crypto-lab/reapply-header.py crypto-lab-[demo-name]
```

This strips any previously-injected header block and inserts the current snippet immediately
after `<body>`. It is idempotent — safe to re-run. The only per-repo value it substitutes is
the GitHub repo name in the header's GitHub link (`__REPO__`).

If the catalog repo is not checked out beside this one, paste the contents of
`shared-header.html` verbatim immediately after `<body>` and replace `__REPO__` with
`crypto-lab-[demo-name]`. Do not alter the snippet's markup or CSS.

### Step 0.2 — Make the demo compatible with the header

The shared header expects four things from each lab. Verify each — fix the demo, never the snippet:

1. **Skip-link target.** The header's "Skip to content" link points at `#app`. Confirm the
   main content wrapper has `id="app"` (the Vite default mount point). If the app mounts
   elsewhere, add `id="app"` to the top-level content container.
2. **Theme contract.** The bar's toggle flips `data-theme` on `<html>` between `dark` and
   `light` and stores it in `localStorage['theme']`. The page must render correctly for both
   values, with **dark as the default**. Either CSS convention is fine (`:root` = dark with a
   `:root[data-theme="light"]` override, OR `:root` = light with a `[data-theme="dark"]`
   override) — do NOT re-architect a working sheet; just confirm both states look right.
3. **Brand accent (`--accent`).** The header tints its badge and buttons from each lab's
   `--accent` CSS variable and **silently falls back to teal `#35d6bb` if it is undefined**.
   Confirm `:root` defines `--accent`, and set it to this demo's catalog card accent color so
   the bar matches the rest of the site. (If the lab has light/dark palettes, define `--accent`
   in both so the always-dark bar still tints correctly.) A missing `--accent` is the most
   common reason a lab's header looks teal when it shouldn't.
4. **Single banner / no duplicate toggle.** The header JS auto-demotes any other
   `role="banner"` or top-level `<header>` to a `group` landmark, and hides the lab's own
   in-page theme toggle. So do NOT delete the lab's existing header to "make room" — leave it;
   the script handles uniqueness.

### Part 0 verification checklist
- [ ] Header block present exactly once, immediately after `<body>`, containing the `cl-topbar` marker
- [ ] `__REPO__` replaced with the real repo name in the GitHub link
- [ ] An `id="app"` element exists for the skip link to target
- [ ] `:root` defines `--accent` set to the demo's catalog accent (header is not falling back to teal)
- [ ] Snippet markup and styles are byte-for-byte from `shared-header.html` (no per-demo tweaks)

`git commit -m "Part 0: apply canonical shared Crypto Lab header"`

---

## Part A — Theme Contract (the toggle lives in the shared header)

The visible theme toggle is part of the shared header (Part 0). **Do NOT build a second
toggle button.** Part A only guarantees the page honors the dark/light contract the bar's
toggle drives.

### Step A1 — Anti-flash script

In `<head>`, **before** any `<link>` or `<style>` tags, insert:

```html
<script>
  (function () {
    const saved = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', saved ?? 'dark');
  })();
</script>
```

Dark is the default when `localStorage` is empty.
Do not use `prefers-color-scheme` under any circumstances.
If this script already exists verbatim, skip this step.

### Step A2 — Remove any competing toggle logic

If the lab shipped its own theme toggle, leave the button element in the DOM (the header CSS
hides it) but delete any old JS that fights the shared toggle — specifically anything that:
- reads or writes a `localStorage` key other than `'theme'`
- uses `prefers-color-scheme`
- sets a theme class/attribute other than `data-theme` on `<html>`

The shared header owns the click → flip → persist logic. Do not duplicate it in `src/main.ts`.

### Step A3 — Theme-responsive CSS

Confirm the stylesheet defines its full palette under `:root` (dark) and overrides the
relevant variables under `:root[data-theme="light"]`. The bar's toggle only swaps that
attribute — if the light overrides are missing, toggling will appear to do nothing.

### Part A verification checklist
- [ ] Dark theme applied on first load with empty localStorage
- [ ] No flash of wrong theme on hard refresh
- [ ] Clicking the header toggle switches theme and persists across refresh
- [ ] Light theme actually restyles the page (light overrides present)
- [ ] No second toggle button visible; no `prefers-color-scheme` anywhere
- [ ] No new dependencies added

`git commit -m "Part A: theme contract honored by shared-header toggle"`

---

## Part B — README Standardization

### Step B1 — Five-section README

Replace or rewrite `README.md` using exactly these five sections in order.
Preserve any existing badge block at the very top.

#### 1. What It Is
- One short paragraph (3–5 sentences)
- Name the cryptographic primitive(s) exactly as they appear in the code
- State what problem this algorithm solves
- State the security model (e.g. symmetric, asymmetric, post-quantum, ZK)
- No marketing language — be precise and honest about what the
  algorithm is and is not

#### 2. When to Use It
- Bulleted list of 3–5 concrete scenarios where this algorithm is
  the right choice
- Follow each bullet with one sentence explaining why it fits
- Include at least one bullet on when NOT to use it
- Ground every claim in the algorithm's actual properties —
  no generalizations

#### 3. Live Demo
- Link to the live GitHub Pages URL
- Describe in 2–3 sentences what the user can do in the demo
- If the demo supports encrypt/decrypt, say so explicitly
- Name any controls (key size, iterations, parameters)

#### 4. How to Run Locally
```bash
git clone https://github.com/systemslibrarian/crypto-lab-[demo-name]
cd crypto-lab-[demo-name]
npm install
npm run dev
```
Note any environment variables if present (there should be none).

#### 5. Part of the Crypto-Lab Suite
One sentence pointing back to the collection:
> One of 60+ live browser demos at
> [systemslibrarian.github.io/crypto-lab](https://systemslibrarian.github.io/crypto-lab/)
> — spanning Atbash (600 BCE) through NIST FIPS 203/204/205 (2024).

### Step B2 — README footer (verbatim — do not alter wording)

Every README closes with exactly:

```
---

*"Whether you eat or drink, or whatever you do, do all to the glory of God." — 1 Corinthians 10:31*
```

`git commit -m "Part B: five-section README with scripture footer"`

---

## Part C — GitHub Pages Configuration

### Step C1 — vite.config.ts

Confirm `base` is set to the correct subpath for this repo:
```ts
base: '/crypto-lab-[demo-name]/'
```
Read the actual repo name from `package.json` or `git remote -v`.
Do not guess. If missing or wrong, fix it.

### Step C2 — package.json deploy script

Confirm this script exists:
```json
"deploy": "npm run build && gh-pages -d dist"
```
If missing, add it.
If `gh-pages` is not in `devDependencies`, add it:
```bash
npm install --save-dev gh-pages
```

### Step C3 — Live URL verification

After deploying, visit:
`https://systemslibrarian.github.io/crypto-lab-[demo-name]/`

- Confirm page loads (no 404)
- Confirm assets load (no broken CSS/JS paths)
- Confirm Vite base path is correct in built `dist/index.html`
- **No root-absolute asset paths.** Because the site is served from a project subpath
  (`/crypto-lab-[demo-name]/`), any `href`/`src` beginning with `/` (e.g.
  `<link rel="icon" href="/favicon.svg">`) resolves to the domain root and 404s in
  production. Use a relative path (`./favicon.svg`), a Vite-imported asset, or an inline
  `data:` URI instead. Check the favicon especially — this is a recurring trap.

### Part C verification checklist
- [ ] `vite.config.ts` base matches exact repo name
- [ ] Deploy script present and correct in `package.json`
- [ ] `gh-pages` in `devDependencies`
- [ ] Live URL resolves and loads the demo correctly
- [ ] No 404 on assets after deploy

`git commit -m "Part C: GitHub Pages config verified"`

---

## Part D — Scripture Footer in UI

The page itself must display the scripture as the last visible element.

### Step D1 — Footer HTML

In `index.html`, add before the closing `</body>` tag (if not already present):

```html
<footer class="scripture-footer">
  <p>So whether you eat or drink or whatever you do, do it all for the glory of God. — 1 Corinthians 10:31</p>
</footer>
```

If a footer already exists, replace its content with the exact text above.
Do not add a second footer. Do not alter the wording.

### Step D2 — Footer CSS

Add to the main stylesheet using only existing CSS variables:

```css
.scripture-footer {
  text-align: center;
  padding: 2rem 1rem;
  font-size: 0.85rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-muted);
  margin-top: 2rem;
}
```

Substitute `--border-color` and `--text-muted` with the actual variable
names found in the existing CSS. Do not introduce new color values.

### Part D verification checklist
- [ ] Footer is the last visible element on the page
- [ ] Quote text is verbatim — no paraphrasing or punctuation changes
- [ ] Footer visible in both dark and light themes
- [ ] No hardcoded colors introduced
- [ ] Matches the README's closing tagline exactly

`git commit -m "Part D: scripture footer in UI verbatim"`

---

## Part E — Page `<head>` & Favicon

The `<head>` drifts demo-to-demo (inconsistent titles, missing or root-absolute favicons,
absent descriptions). Standardize it without touching the demo's own logic.

### Step E1 — Title

Set `<title>` to a single consistent pattern:

```
[Demo Name] — crypto-lab
```

Use the same human-readable name as the demo's catalog card / README `# H1`. Do not invent
a new name or cram in the algorithm spec.

### Step E2 — Meta description

Ensure exactly one `<meta name="description">` exists, one sentence, matching the catalog
card copy (the primitive(s) named precisely, no marketing language):

```html
<meta name="description" content="One-sentence description naming the primitive(s).">
```

### Step E3 — Favicon (inline, never 404s)

Use a single inline `data:` URI emoji favicon — it requires no asset file and is immune to
the project-subpath 404 trap (Part C). Pick one emoji that fits the demo:

```html
<link rel="icon" type="image/svg+xml"
  href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔒</text></svg>" />
```

Remove any `href="/favicon.svg"`-style external/root-absolute favicon. Do not add a second
`rel="icon"`.

### Part E verification checklist
- [ ] `<title>` follows `[Demo Name] — crypto-lab`
- [ ] Exactly one `<meta name="description">`, matching the catalog card copy
- [ ] Exactly one `rel="icon"`, an inline `data:` URI (no root-absolute path, no 404)
- [ ] `lang="en"`, `charset`, and `viewport` meta tags present

`git commit -m "Part E: standardize page head and favicon"`

---

## Final commit

After Part 0 and all five parts pass their checklists, push:

```bash
git push origin main
```

Report a one-line summary:
`✓ [repo-name] — Parts 0 + A–E complete, all checklists passed, pushed to main`

*"So whether you eat or drink or whatever you do,*
*do it all for the glory of God." — 1 Corinthians 10:31*
