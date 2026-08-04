# Crypto Lab — Master Template & Standard

_The single source of truth for how every `crypto-lab-*` demo is **built**, how it **teaches**, and how it **looks**. Folds together the `BUILD-TEMPLATE`, the `PROMPT-standardize` pass, and the `ADA` WCAG accessibility-gate spec — brought up to date (Actions-based Pages deploy, the CI accessibility gate, the standardized hero, and the pedagogy standard from the fleet teaching review)._

Lifecycle: **Build → Teach → Look → Accessibility → README → Deploy.**

---

## How to use this template with a coding AI

Point your coding AI (Claude Code, Opus, etc.) at this file and have it build to the standard. **The template is the spec; you supply only the demo-specific facts.**

### Step 1 — Fill in the demo brief

Copy this block and fill the bracketed values (leave everything else):

```
NEW DEMO BRIEF
- Repo name:         crypto-lab-[demo-name]
- Short name (H1):   [e.g. OPAQUE, KDF Arena, X3DH]
- Subtitle:          [spec/expansion, e.g. aPAKE · RFC 9807]
- One-liner:         [one sentence naming the primitive(s); no marketing language]
- Concept to teach:  [the single "aha" a learner should walk away with]
- Primitives/spec:   [RFC/FIPS/paper refs, or "classical cipher — n/a"]
- Accent (--accent): [hex]
- Favicon emoji:     [one emoji]
- In scope:          [the exact algorithms/attacks/variants to build]
- Non-goals:         [what is explicitly OUT of scope]
```

### Step 2 — Give the AI this kickoff prompt

Paste this prompt together with the filled brief. (In Claude Code / any agent that can read files, keep `CRYPTO-LAB-TEMPLATE.md` in the repo so it can read it directly; otherwise paste this file's contents above the prompt.)

```
Build a new Crypto Lab browser demo (Vite + TypeScript, static site, no backend).

Read CRYPTO-LAB-TEMPLATE.md in full and treat it as the BINDING spec. Build to
every standard in it, in this order:

  1. §1 Build — real crypto only (WebCrypto or a named, justified library; hand-roll
     the inspectable teaching parts; NEVER simulate or fake math). Runnable tests that
     actually pass, including spec KATs (state the count). Mount content at id="app";
     define --accent on :root.
  2. §3 Look — apply the shared top bar and the standardized hero (short-name <h1> +
     spec subtitle + "Why it matters" box beside it; title size capped at
     clamp(1.6rem,3.8vw,2.7rem)); theme contract; scripture footer; head/favicon.
     Do NOT hand-build a header or theme toggle — the shared bar owns those.
  3. §2 Teach — SHOW the one headline mechanism (animate/step it, never assert it in
     prose or raw hex); add a plain-language "what is this / why it matters" intro and a
     break-it-yourself interaction against the real crypto; no decorative/idle animation;
     pitch to a college newcomer while rewarding an expert (progressive disclosure).
  4. §4 Accessibility — wire the WCAG 2.1 AA gate and author to its checklist.
     `npm run build` then `npm run test:a11y` MUST pass with zero violations in BOTH themes.
  5. §5 README (the standard sections) and §6 Deploy — use the canonical deploy.yml from
     §6 VERBATIM (filename, two-job split, Node 22, npm ci included), and pick a unique
     local preview port per §4.1 (never 4173).

Hard rules: do NOT dumb down the crypto to make a visual simpler; honest scoping in-page
and in the README ("not production", what's real vs simulated, what it does NOT prove).
When done, report a one-line summary stating: unit-test count, spec-KAT count, and
confirmation the a11y gate passed in BOTH themes against the production build.

DEMO BRIEF:
[paste the filled NEW DEMO BRIEF block here]
```

### Standardizing an existing demo instead

If the demo already exists and only needs to match the fleet, tell the AI: *"Read CRYPTO-LAB-TEMPLATE.md and apply §3 (Look), §4 (Accessibility), §5 (README), and §6 (Deploy) to this repo. Do not touch the cryptographic logic (§1) or invent new content — chrome, a11y, README, and deploy only."*

---

## 0. Principles (non-negotiable)

1. **Real crypto only.** Use WebCrypto (`SubtleCrypto`) or a named, justified library for the actual operations. Never simulate or fake math. For the primitive that *is* the teaching subject, hand-roll the inspectable internals rather than hiding them in a library — transparency is the point. Known-answer tests (KATs) from the spec must pass.
2. **Honest scoping.** Every demo says, in-page and in the README: what's real vs simulated, what it does **NOT** prove, and "not production crypto — a teaching demo." No marketing language.
3. **Teach the college baseline; reward the expert.** Plain-language on-ramp for a motivated newcomer, with depth/rigor/caveats available on demand (progressive disclosure). **Never dumb down the crypto to reach the beginner** — simplify the *explanation*, never the math.
4. **Accessible.** WCAG 2.1 AA, in **both** themes, **gated in CI**. Non-negotiable.
5. **Consistent chrome fleet-wide.** Shared top bar + standardized hero + scripture footer, identical everywhere.
6. **No backend.** Everything runs in the browser; any key/secret material is per-session in memory, never persisted. Ships as a static site to GitHub Pages.

---

## 1. Build a new demo

Vite + TypeScript, static to GitHub Pages, no backend. This pass produces the demo's **cryptographic logic, UI, and in-page content only** — the chrome (§3), README (§5), and deploy (§6) are applied afterward. Two demo-side prerequisites the later passes need:
- Mount app content at `id="app"`.
- Define `--accent` on `:root` (in both palettes if light/dark exist).

Fill these seven sections for the specific demo, then build:

- **SCOPE** — exact algorithms/attacks/variants that are IN; explicit NON-GOALS (each gets a one-line "what this isn't" note in the UI).
- **SECURITY / CORRECTNESS INVARIANTS** — a numbered list the architecture *embodies*, not merely describes. For attack demos: fail-closed rules + strict isolation of any deliberately-vulnerable mode (never the default, visibly marked broken). For non-attack demos: KATs pass, constant-time where claimed, strict parsing, independent validations reported independently. **If an invariant conflicts with a feature, the invariant wins.**
- **ARCHITECTURE** — small, separately-testable modules; keep the inspectable crypto isolated (`src/<domain>/<primitive>.ts`, `types.ts`, `<verify|attack>.ts`, `src/ui/`).
- **UI** — the panels/controls and the single core interaction that produces the "aha." Name the central metaphor/toggle and the step-by-step user action. Stacks < 640px.
- **VISUAL SEMANTICS** — precisely what correct-vs-broken looks like. Color tracks **system integrity / correctness**, not the raw return value (a forged-but-accepted result reads as ALARM, not green success). Never convey state by color alone — always icon + text + color (WCAG 1.4.1); verify in grayscale and deuteranopia.
- **EDGE CASES** — enumerate malformed/boundary inputs and the exact fail-closed behavior; each teaches via a tooltip.
- **EXTENSION SEAMS** — the likely future extension and the 1–3 places to shape now (mark with `// [extension] point`). Don't build it yet.

**Testing:** runnable tests (Vitest), actually executed. Cover round-trips, spec KATs, correct-path accepts good / rejects every bad, and (for attack demos) a passing test that the vulnerable path exhibits the flaw. Tests live **colocated in `src/` as `*.test.ts`** — not a top-level `test/` or `tests/` dir (the include pattern below depends on it). **Exclude `e2e/` from the Vitest run** (`test.include: ['src/**/*.test.ts']`) so Playwright specs don't get collected.

**Scripts:** `"build": "tsc --noEmit && vite build"` — the typecheck rides inside `build`, so it gates every local build and the deploy without a separate CI step. `"test": "vitest run"`, `"dev": "vite"`, `"preview": "vite preview"`.

**Definition of done:** `npm run dev` serves it; the core interaction produces the "aha"; tests pass (state count + coverage); content mounts at `#app`; `:root` defines `--accent`. No header/hero/README/footer here — those are §3–§6.

---

## 2. Teach — the pedagogy standard

From the fleet teaching review. A demo can be perfectly correct and still teach badly. Score every demo on six lenses; aim high on all six:

1. **Narrative clarity** — what-it-is and why-it-matters in plain language, up front.
2. **Intuition via interaction** — poking at it builds a mental model; not a toy with knobs.
3. **Progressive disclosure** — simple first, complexity layered; not everything at once.
4. **Visualization quality** — visuals **illuminate the mechanism**, not decorate.
5. **Newcomer accessibility** — jargon introduced, not assumed.
6. **Teaching honesty** — teaches the truth; never oversimplifies into something false.

The recurring failure across the fleet is **"tell, not show."** Fix it with these, in priority order:

- **Show the one headline mechanism.** Animate/step-through the single idea the demo exists to teach — the homomorphism `Enc(a)⊞Enc(b)=Enc(a+b)`, the DH exponent-tower collapsing to `g^(ab)`, the polynomial through the points, noise creeping toward the ceiling. Never assert it in prose or raw hex.
- **Break-it-yourself against real crypto.** Let the learner *cause* the failure (reuse a nonce, forge a signature the real verifier rejects, type a candidate secret that fits). A button that the genuine primitive accepts/rejects teaches far more than a warning banner.
- **A plain-language "what is X / why it matters" intro** on every demo (2–4 sentences, zero math, before any hex or slider). This is the single highest-leverage fix.
- **Compute-both-sides-and-compare**, not assert — show byte-for-byte equality with pass/fail coloring.
- **Decorative motion is banned.** No idle/looping animation that represents nothing (`Math.random()` "wire rain", perpetual pulses). Motion must be purposeful — tied to an action or illustrating the mechanism — or it doesn't ship.
- **Visual honesty.** Never draw a picture that contradicts the taught property (a smooth interpolating curve for Shamir over F_p, a straight chord over a finite field). Default to the real discrete object; if you draw an illustrative simplification, label it as one.

Audience calibration: **college newcomer at the baseline, professional cryptographer rewarded on demand.** The expert-facing rigor lives in honesty + the shown mechanism; the beginner on-ramp is the intro card + jargon scaffolding.

---

## 3. Look — the visual standard

### 3.0 Shared top bar (apply FIRST — never hand-built)

The top bar is **one canonical managed snippet, identical on all 118+ labs**. Source of truth: `shared-header.html` in the sibling **`crypto-lab` catalog repo** (github.com/systemslibrarian/crypto-lab). **Never hand-build, copy-edit, restyle, or fork a header, top bar, nav, or theme toggle** — a competing per-demo bar is the exact mistake this prevents. Do not paste the snippet by hand either; apply it with the script so the markers, `__REPO__` substitution, and formatting come out right.

**Applying it** — `reapply-header.py` lives in the catalog repo and assumes the lab repos are checked out as **siblings of `crypto-lab` under the same parent folder** (it resolves the snippet path relative to itself). From that parent folder:

```
python crypto-lab/reapply-header.py crypto-lab-<slug>   # one repo (a new demo)
python crypto-lab/reapply-header.py                     # no arg = every crypto-lab-* sibling
```

Idempotent — safe to re-run anytime. The script strips any previously injected block, inserts the current snippet **immediately after `<body>`** in `index.html` (root or nested `demos/<slug>/index.html`; skips `node_modules`/`dist`), substitutes the repo folder name for `__REPO__` in the GitHub link (**the only per-repo value**), and runs the repo's own Prettier if installed so `prettier --check` in the deploy workflow stays green. The injected block is fenced by `<!-- BEGIN crypto-lab shared header … -->` / `<!-- END crypto-lab shared header -->` markers — everything inside is managed; to change the header fleet-wide, edit `shared-header.html` once and re-run the script, never a lab's copy. When committing, scope to the index file only (`git add index.html`), never `git add -A` (some repos track `node_modules` or carry unrelated WIP).

**What the injected bar already provides** (a new lab must not duplicate any of it):
- a "Skip to content" link targeting `#app` (WCAG 2.4.1);
- a sticky, **always-dark** (`#0b1512`) bar with fully self-contained styles, tinted by the lab's `--accent`;
- brand / Menu / GitHub links (the GitHub link is where `__REPO__` lands);
- the theme toggle **`#cl-theme-toggle`** (☀/☾) that flips `data-theme` on `<html>` and persists `localStorage['theme']`;
- JS that demotes any other `role="banner"` / top-level `<header>` to `role="group"`, keeping a single banner landmark;
- CSS that auto-hides a legacy lab's own toggle matching `#theme-toggle, #themeToggle, .theme-toggle, .theme-toggle-btn, [data-theme-toggle]` (the element stays in the DOM so old theme JS keeps working — but a **new** demo simply doesn't build a toggle at all: the anti-flash script in §3.2 plus the bar's toggle are the entire theme system).

The bar expects four things from the demo (fix the demo, never the snippet):
1. **Skip-link target** — a content wrapper with `id="app"`.
2. **Theme contract** — the toggle flips `data-theme` on `<html>` between `dark`/`light` and stores `localStorage['theme']`; page renders correctly for both, **dark default**.
3. **Brand accent** — `:root` defines `--accent` (set to the demo's catalog accent; the bar silently falls back to teal `#35d6bb` if undefined — a missing `--accent` is why a bar looks wrong).
4. **Single banner** — the header JS auto-demotes any other `role="banner"`/top-level `<header>` and hides the lab's own toggle; leave the lab's element, don't delete it.

### 3.1 The hero (standardized — the recognizable name, one size fleet-wide)

Directly below the top bar. The hero carries **three distinct text roles** (keep them distinct — the common mistake is making the description and the why-box say the same thing) plus a standardized **"Why it matters" box**. Exactly **one `<h1>`** on the page = the hero title.

**Layout** — the title block is on the **left** (title → spec → description, top to bottom); the **"Why it matters" box is to the side** (right on desktop, drops below on mobile):

```
┌──────────────────────────────┬──────────────────┐
│  TITLE            (short name)│  WHY IT MATTERS  │
│  spec · label     (subtitle)  │  2–3 sentences   │  ← box to the side
│  one-sentence description      │  on the stakes   │
│  of what the demo demonstrates │                  │
└──────────────────────────────┴──────────────────┘
        (on mobile the box stacks below the title block)
```

- **Subtitle** (`.cl-hero-sub`) — the *spec/qualifier label* only: `aPAKE · RFC 9807`. Not a sentence.
- **Description** (`.cl-hero-desc`) — one sentence answering **what** this demo demonstrates / what you'll see and do here (mechanism-oriented, concrete).
- **Why it matters** (`.cl-hero-why`) — 2–3 sentences on the real-world **stakes** / why a learner should care (motivation, consequence). Never a restatement of the description.

```html
<header class="cl-hero">
  <div class="cl-hero-main">
    <h1 class="cl-hero-title">OPAQUE</h1>
    <p class="cl-hero-sub">aPAKE · RFC 9807</p>
    <p class="cl-hero-desc">Runs the real OPRF → encrypted envelope → 3-message handshake so you can watch a login where the server never sees your password.</p>
  </div>
  <aside class="cl-hero-why" aria-label="Why it matters">
    <span class="cl-hero-why-label">WHY IT MATTERS</span>
    <p class="cl-hero-why-text">Breaches leak billions of credentials — OPAQUE makes the server unable to leak what it never had.</p>
  </aside>
</header>
```

- **Title split:** big title = the concise scheme/primitive/brand name only (`OPAQUE`, `KDF Arena`, `X3DH`, `Paillier`; branded demos like `Iron Letter` keep the brand). Subtitle = the qualifier/spec/expansion, one line, **preserving technical casing** (`aPAKE · RFC 9807`, never `APAKE`). Separator `·`.
- **Size is capped at `clamp(1.6rem, 3.8vw, 2.7rem)`** — the `crypto-lab-x3dh-wire` scale, the maximum. Do not exceed it. This is what makes verbose and terse names read as siblings.

Standard CSS (under a marked managed block; map colors to the demo's own theme vars so it passes AA in both themes):

```css
/* BEGIN cl-hero standard — managed, keep in sync across fleet */
.cl-hero{display:flex;align-items:flex-start;justify-content:space-between;gap:clamp(1rem,4vw,3rem);flex-wrap:wrap;margin:clamp(1rem,3vw,2rem) 0 1.5rem;}
.cl-hero-main{flex:1 1 22rem;min-width:min(100%,20rem);}
.cl-hero-title{margin:0;font-size:clamp(1.6rem,3.8vw,2.7rem);font-weight:700;line-height:1.1;letter-spacing:.01em;}
.cl-hero-sub{margin:.4rem 0 0;font-size:clamp(.9rem,1.6vw,1.05rem);letter-spacing:.01em;opacity:.85;}
.cl-hero-desc{margin:.55rem 0 0;font-size:1rem;line-height:1.5;color:var(--text-dim);max-width:60ch;}
.cl-hero-why{flex:0 1 min(40%,26rem);min-width:min(100%,15rem);border:1px solid var(--border);border-radius:10px;padding:.85rem 1.05rem;background:color-mix(in oklab,var(--accent) 6%,transparent);}
.cl-hero-why-label{display:block;font-size:.68rem;font-weight:700;letter-spacing:.14em;}
.cl-hero-why-text{margin:.35rem 0 0;font-size:.95rem;line-height:1.5;}
@media (max-width:640px){.cl-hero{flex-direction:column;}.cl-hero-why{flex-basis:auto;width:100%;}}
/* END cl-hero standard */
```

### 3.2 Theme contract (anti-flash)

In `<head>`, **before** any `<link>`/`<style>`:

```html
<script>
  (function () {
    const saved = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', saved ?? 'dark');
  })();
</script>
```

Dark default. **Never use `prefers-color-scheme`.** The stylesheet defines its full palette under `:root` (dark) with overrides under `:root[data-theme="light"]`. Don't build a second toggle or duplicate the header's flip/persist logic in `src/main.ts`.

### 3.3 Scripture footer (last visible element)

```html
<footer class="scripture-footer">
  <p>
    Related demos:
    <a href="https://systemslibrarian.github.io/crypto-lab-<sibling>/">crypto-lab-<sibling></a> ·
    <a href="https://systemslibrarian.github.io/crypto-lab-<sibling>/">crypto-lab-<sibling></a>
  </p>
  <p>So whether you eat or drink or whatever you do, do it all for the glory of God. — 1 Corinthians 10:31</p>
</footer>
```

The **Related demos** line links the sibling labs the brief points to (typically the ones its Non-goals defer to) — 2–5 links, `·`-separated. The scripture line is **verbatim** (exactly this wording — no KJV variants), exactly once, visible in both themes, styled only with existing CSS vars (`--border`, `--text-dim`/`--text-muted`). Matches the README's closing line.

### 3.4 Page `<head>` & favicon

- **Title:** `[Demo Name] — crypto-lab` (same human name as the catalog card / README H1).
- **Meta description:** exactly one, one sentence, naming the primitive(s), no marketing.
- **Social meta (required):** Open Graph + Twitter tags mirroring the title and meta description — `og:type` (`website`), `og:title`, `og:description`, `og:url` (the live Pages URL), `twitter:card` (`summary`), `twitter:title`, `twitter:description`. No image tag needed.
- **Favicon:** a single **inline `data:` URI emoji** (immune to the subpath-404 trap):
  ```html
  <link rel="icon" type="image/svg+xml"
    href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔒</text></svg>" />
  ```
  Remove any `href="/favicon.svg"`-style root-absolute favicon. `lang="en"`, `charset`, `viewport` present.

---

## 4. Accessibility (WCAG 2.1 AA — gated in CI)

Accessibility is **enforced, not aspirational**: `@axe-core/playwright` scans the *production build* for zero WCAG 2.1 A/AA violations in **both** themes, and the GitHub Pages deploy is blocked if it fails. This is the `ADA` gate spec.

### 4.1 Wiring the gate

**Dependencies:** `npm i -D @playwright/test@^1.61.1 @axe-core/playwright` (pin to a current build to dodge the corrupt-cache install loop).

**`playwright.config.ts`** — runs against `vite preview`, so what passes is what ships:

```ts
import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:<PORT>/<REPO-BASE>/', // if vite base is "./", use http://localhost:<PORT>/
    colorScheme: 'dark',                              // scan the real dark default; the toggle reaches light
  },
  webServer: {
    command: 'npm run preview -- --port <PORT> --strictPort',
    url: 'http://localhost:<PORT>/<REPO-BASE>/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

`<PORT>`: pick a port in **4200–4399 that no sibling lab already uses** (the fleet holds e.g. 4254, 4293, 4314, 4341, 4373 — grep the sibling repos' `playwright.config.ts` files). Never the Vite default 4173 — with 100+ labs checked out side by side, a shared port means `reuseExistingServer` silently scans a *different lab's* preview locally.

**`e2e/a11y.spec.ts`** — reveal collapsed/animated/injected content and drive the live demo so dynamic result regions get scanned, then assert zero violations in both themes:

```ts
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

async function prepare(page: Page): Promise<void> {
  await page.addStyleTag({ content: `*,*::before,*::after{animation:none!important;transition:none!important}` })
  await page.evaluate(() => {
    document.querySelectorAll('details').forEach((d) => ((d as HTMLDetailsElement).open = true))
    document.querySelectorAll<HTMLElement>('[hidden],[role="tabpanel"]').forEach((el) => {
      el.removeAttribute('hidden'); el.style.display = ''; el.classList.add('active', 'is-active', 'open')
    })
  })
  for (const b of await page.locator('button').all()) {
    const label = ((await b.textContent()) || '').toLowerCase()
    if (/run|compute|sign|verify|encrypt|simulate|start/.test(label)) await b.click().catch(() => {})
  }
  await page.waitForTimeout(400)
}
async function scan(page: Page): Promise<void> {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  expect(
    violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target.join(' ')).slice(0, 5) })),
  ).toEqual([])
}
test('no WCAG A/AA violations — dark theme', async ({ page }) => {
  await page.goto('.'); await prepare(page); await scan(page)
})
test('no WCAG A/AA violations — light theme', async ({ page }) => {
  await page.goto('.'); await page.locator('#cl-theme-toggle').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await prepare(page); await scan(page)
})
```

**The `prepare()` above is the generic floor, not the standard.** Author a demo-specific `driveDemos()` that puts **every** panel into its post-interaction state before scanning — run the signature flow, step the trace to its end, trigger the failure/reject path, open every tab and glossary — the way the fleet's best specs walk eight-plus interactions. Axe only checks what's in the DOM: **an unscanned state is an ungated state**, and dynamic result regions are exactly where contrast and live-region violations hide.

**`package.json`:** `"test:a11y": "playwright test"`. And **exclude `e2e/` from Vitest** (`vite.config.ts → test: { include: ['src/**/*.test.ts'] }`) so the Playwright specs aren't collected as unit tests.

**CI:** in `deploy.yml`, before deploy — `npx playwright install --with-deps chromium` then `npm run test:a11y`; a11y violations block the deploy on `main` (see §6).

### 4.2 Author to these rules from the start (exactly what the gate checks)

- **Contrast** ≥ 4.5:1 body text, ≥ 3:1 large text / UI components. Never convey state by **color alone** (icon + text + color).
- **`<html>` gets its own `background-color`**, and `color-scheme: dark`/`light` per theme. Use the `background-color` **longhand**, not the `background` shorthand (axe/WebKit miss the shorthand).
- **Text on a colored fill** (accent / gold / amber / danger / success) uses a **dedicated ink token** ≥ 4.5:1 — no near-white on a light accent.
- **Muted text:** lower the color's *lightness*, never use `opacity`.
- **Inline links:** a persistent `text-decoration` underline, not color alone.
- **Styled `<select>`:** `appearance: none` + a custom chevron.
- **Scrollable `overflow:auto` regions:** `tabindex="0"` + `role="region"` (or `group`) + an `aria-label`. (Fails on the Linux CI runner even when it passes local Windows Chromium.)
- **Live / async outputs:** `role="status"` + `aria-live="polite"` (or `role="log"`).
- **Lists:** `role="list"` → children `role="listitem"`; don't put a role/`tabindex` on a `role="presentation"` element; don't wrap a native control in a role/`tabindex` element.
- **The always-dark `.cl-topbar` is self-contained** — scope your base `p{}` / `button{}` rules to `#app`, not globally, so they don't fight the shared bar.
- **`#cl-theme-toggle`** flips `html[data-theme]`; your CSS keys off `[data-theme="light"]` (not `.light`); any CSP must allow the toggle's inline handler.
- Every interactive control has an accessible name (visible `<label>` or `aria-label`); text inputs are real `<textarea>`/`<input>`, never `contenteditable`; keyboard-operable with visible focus; layout stacks < 640px; a single banner landmark (the shared bar; the hero is the page content header).

**Acceptance:** `npm run build` clean; zero axe violations in both themes; run `npm run build && npm run test:a11y` locally before every push.

---

## 5. README standard

The current fleet README (richer than the old five-section form) uses these sections, in order, with **correctness as the headline**:

**What It Is** (name the exact primitives, the problem, the security model, "not production") · **Exhibits** (numbered tour of the interactive pieces) · **When to Use It** (incl. at least one "do NOT use") · **Live Demo** (the Pages URL + what the user can do) · **What Can Go Wrong** · **Real-World Usage** · **How to Run Locally** · **Related Demos** · **Build & Verify** (test count + KAT files + the a11y gate) · **Performance** (where relevant) · footer.

Close every README with:

```
---

*One of 120+ browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*
```

When adding/altering exhibits, **update `What It Is` and the numbered `Exhibits` list to match** — preserve the structure, honesty framing (KATs, "not production"), footer, and scripture line. Extend, never restructure.

---

## 6. Deploy — GitHub Pages via Actions (a11y-gated)

Actions-based deploy (not the legacy `gh-pages` branch). Use this file **verbatim** as `.github/workflows/deploy.yml` — do not improvise the filename, the two-job split, the Node version, or `npm ci`. (Fleet drift — a `pages.yml` here, an `npm install` there, a repo whose workflow uploads the artifact but never deploys it, a deploy that skips unit tests — all came from treating this as a suggestion.) It runs unit tests, builds, installs the Playwright browser, **runs the axe a11y gate, and only then deploys** — so a broken build or an accessibility regression never ships:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Unit tests (Vitest, incl. spec KATs)
        run: npm test
      - name: Build (typecheck gates the build)
        run: npm run build
      - name: Install Playwright browser
        run: npx playwright install --with-deps chromium
      - name: Accessibility gate (axe-core, WCAG A/AA, both themes)
        run: npm run test:a11y
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Also: `vite.config.ts` `base: '/crypto-lab-<demo-name>/'` (read the real repo name, don't guess); **no root-absolute asset paths** (`/foo` 404s under the project subpath — use `./foo`, a Vite-imported asset, or a `data:` URI); pin `@playwright/test` to a current build to avoid the corrupt-cache install loop. Verify the live URL loads with no 404s after deploy.

---

## Pipeline for a new demo

1. Fill §1's seven sections + the repo metadata (name, one-liner, catalog category, card title, tags, `--accent`, favicon emoji).
2. Create the GitHub repo (name + About one-liner).
3. Build the demo (§1) → working crypto + UI + tests, mounted at `#app` with `--accent` defined.
4. Apply the chrome (§3): shared header via `python crypto-lab/reapply-header.py crypto-lab-<slug>` (§3.0 — never hand-built), hero, theme contract, footer, head/favicon.
5. Meet the teaching bar (§2) and the a11y gate (§4).
6. Write the README (§5); wire the Actions deploy (§6).
7. Wire it into the catalog by following the **"Adding a new demo" workflow in the `crypto-lab` repo's `CLAUDE.md` end-to-end** — the card in `index.html`, the `TITLE_TO_SECTION` entry (+ `FOUNDATIONS_TITLES`/`REAL_WORLD_TITLES` if applicable), the README table row, the optional learning-path step, **and the crypto-counsel corpus sync** (`node tools/corpus-sync.js gen <slug> "<Demo Name>"`, fill the prose, then `node tools/corpus-sync.js check` until it reports zero missing/stale). A demo without a corpus entry is permanently invisible to the chatbot. Deploy and verify the live URL loads with no 404s.

---

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*
