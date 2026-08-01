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
  5. §5 README (the standard sections) and §6 Deploy (Actions-based Pages, a11y-gated).

Hard rules: do NOT dumb down the crypto to make a visual simpler; honest scoping in-page
and in the README ("not production", what's real vs simulated, what it does NOT prove).
When done, report a one-line summary with the test count.

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

**Testing:** runnable tests (Vitest), actually executed. Cover round-trips, spec KATs, correct-path accepts good / rejects every bad, and (for attack demos) a passing test that the vulnerable path exhibits the flaw. **Exclude `e2e/` from the Vitest run** (`test.include: ['src/**/*.test.ts']`) so Playwright specs don't get collected.

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

### 3.0 Shared top bar (apply FIRST)

The top bar is **one canonical snippet shared by every lab** (`shared-header.html` in the catalog repo, applied by `reapply-header.py <repo>` — idempotent; the only per-repo value is `__REPO__` in the GitHub link). **Never hand-build or restyle a header, top bar, nav, or theme toggle** — a competing per-demo bar is the exact mistake this prevents.

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
  <p>So whether you eat or drink or whatever you do, do it all for the glory of God. — 1 Corinthians 10:31</p>
</footer>
```

Verbatim, exactly once, visible in both themes, styled only with existing CSS vars (`--border`, `--text-dim`/`--text-muted`). Matches the README's closing line.

### 3.4 Page `<head>` & favicon

- **Title:** `[Demo Name] — crypto-lab` (same human name as the catalog card / README H1).
- **Meta description:** exactly one, one sentence, naming the primitive(s), no marketing.
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
    baseURL: 'http://localhost:4173/<REPO-BASE>/', // if vite base is "./", use http://localhost:4173/
    colorScheme: 'dark',                            // scan the real dark default; the toggle reaches light
  },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/<REPO-BASE>/',
    reuseExistingServer: !process.env.CI,
  },
})
```

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

Actions-based deploy (not the legacy `gh-pages` branch). `.github/workflows/deploy.yml` builds, runs unit tests, installs the Playwright browser, **runs the axe a11y gate, and only then deploys** — so a broken build or an accessibility regression never ships:

```yaml
# build job, after `npm run build`:
- run: npm test
- run: npm run build
- name: Install Playwright browser
  run: npx playwright install --with-deps chromium
- name: Accessibility gate (axe-core, WCAG A/AA)
  run: npm run test:a11y
- uses: actions/upload-pages-artifact@v3
  with: { path: dist }
# deploy job: actions/deploy-pages@v4
```

Also: `vite.config.ts` `base: '/crypto-lab-<demo-name>/'` (read the real repo name, don't guess); **no root-absolute asset paths** (`/foo` 404s under the project subpath — use `./foo`, a Vite-imported asset, or a `data:` URI); pin `@playwright/test` to a current build to avoid the corrupt-cache install loop. Verify the live URL loads with no 404s after deploy.

---

## Pipeline for a new demo

1. Fill §1's seven sections + the repo metadata (name, one-liner, catalog category, card title, tags, `--accent`, favicon emoji).
2. Create the GitHub repo (name + About one-liner).
3. Build the demo (§1) → working crypto + UI + tests, mounted at `#app` with `--accent` defined.
4. Apply the chrome (§3): shared header, hero, theme contract, footer, head/favicon.
5. Meet the teaching bar (§2) and the a11y gate (§4).
6. Write the README (§5); wire the Actions deploy (§6).
7. Add the catalog card (title, tags, accent) to the `crypto-lab` index; deploy and verify the live URL.

---

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*
