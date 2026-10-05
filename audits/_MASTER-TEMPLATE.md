# Crypto Lab — Master Template & Standard

_The standard for how a `crypto-lab-*` **demo repo** is **built**, how it **teaches**, and how it **looks** (build/teach/look/a11y). Catalog maintenance is governed by the repo root's `CLAUDE.md`, which is binding where the two touch. Folds together the `BUILD-TEMPLATE`, the `PROMPT-standardize` pass, and the `ADA` WCAG accessibility-gate spec — brought up to date (Actions-based Pages deploy, the CI accessibility gate, the standardized hero, and the pedagogy standard from the fleet teaching review)._

> **Status (2026-08-02):** corrected per `audits/TEMPLATE-DECISION-2026-08-02.md`. §3.0 was
> rewritten for the post-retirement header reality (the shared-header rollout was retired in
> catalog commit `fbe77f4`; each lab owns its own header), the `cl-hero` managed-block
> markers were dropped, §5's demo count was made count-free, and stale self-references to a
> `CRYPTO-LAB-TEMPLATE.md` filename were fixed. Everything else is as recovered.

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

**If the agent will run inside the lab repo, use `audits/kickoff.md` instead** — it is the
same standard worded for that case (reads `./brief.md` and the repo name itself, keeps the
agent out of the shared catalog files, and records why each non-obvious line is there).

Paste this prompt together with the filled brief. (In Claude Code / any agent that can read files, point it at this file — `audits/_MASTER-TEMPLATE.md` in the catalog repo — or copy it into the demo repo; otherwise paste this file's contents above the prompt.)

```
Build a new Crypto Lab browser demo (Vite + TypeScript, static site, no backend).

Read audits/_MASTER-TEMPLATE.md (in the crypto-lab catalog repo) in full and treat it
as the BINDING spec. Build to every standard in it, in this order:

  1. §1 Build — real crypto only (WebCrypto or a named, justified library; hand-roll
     the inspectable teaching parts; NEVER simulate or fake math). Runnable tests that
     actually pass, including spec KATs (state the count). Mount content at id="app";
     define --accent on :root.
  2. §3 Look — add the standard top bar (copy the header from any existing lab and
     adapt it) and the standardized hero (short-name <h1> + spec subtitle + "Why it
     matters" box beside it; title size capped at clamp(1.6rem,3.8vw,2.7rem)); theme
     contract; scripture footer; head/favicon. Do NOT invent a new header design and do
     NOT add a theme toggle — match the fleet's cl-topbar.
  3. §2 Teach — SHOW the one headline mechanism (animate/step it, never assert it in
     prose or raw hex); add a plain-language "what is this / why it matters" intro and a
     break-it-yourself interaction against the real crypto; no decorative/idle animation;
     pitch to a college newcomer while rewarding an expert (progressive disclosure).
  4. §4 Accessibility — wire the WCAG 2.1 AA gate and author to its checklist.
     `npm run build` then `npm run test:a11y` MUST pass with zero violations.
  5. §5 README (the standard sections) and §6 Deploy (Actions-based Pages, a11y-gated).
  6. §6.1 + §6.2 Dependency automation — REQUIRED, not optional. Ship
     .github/dependabot.yml with the grouped config, add the dependabot-auto-merge job
     to whichever workflow runs the gate on pull_request, and have that job dispatch the
     deploy after it merges. Also: the workflow must trigger on pull_request as well as
     push, the deploy job must be gated to `github.event_name != 'pull_request'`, the concurrency
     group must include ${{ github.ref }}, and the deploy workflow must accept
     workflow_dispatch. Omitting any of these is how a lab starts opening one pull request
     per dependency with no CI signal on any of them.

Hard rules: do NOT dumb down the crypto to make a visual simpler; honest scoping in-page
and in the README ("not production", what's real vs simulated, what it does NOT prove).
Do NOT weaken a gate to get a green run — no skipped tests, no lowered coverage threshold,
no disabled lint rule, no re-recorded a11y baseline, no continue-on-error. If a bump or a
change cannot pass honestly, leave it failing and say so.
When done, report a one-line summary with the test count, and confirm all four of
grouping / auto-merge / PR gate / workflow_dispatch are present.

DEMO BRIEF:
[paste the filled NEW DEMO BRIEF block here]
```

### Standardizing an existing demo instead

If the demo already exists and only needs to match the fleet, tell the AI: *"Read audits/_MASTER-TEMPLATE.md from the crypto-lab catalog repo and apply §3 (Look), §4 (Accessibility), §5 (README), and §6 (Deploy) to this repo. Do not touch the cryptographic logic (§1) or invent new content — chrome, a11y, README, and deploy only."*

---

## 0. Principles (non-negotiable)

1. **Real crypto only.** Use WebCrypto (`SubtleCrypto`) or a named, justified library for the actual operations. Never simulate or fake math. For the primitive that *is* the teaching subject, hand-roll the inspectable internals rather than hiding them in a library — transparency is the point. Known-answer tests (KATs) from the spec must pass.
2. **Honest scoping.** Every demo says, in-page and in the README: what's real vs simulated, what it does **NOT** prove, and "not production crypto — a teaching demo." No marketing language.
3. **Teach the college baseline; reward the expert.** Plain-language on-ramp for a motivated newcomer, with depth/rigor/caveats available on demand (progressive disclosure). **Never dumb down the crypto to reach the beginner** — simplify the *explanation*, never the math.
4. **Accessible.** WCAG 2.1 AA, **gated in CI**. Non-negotiable.
5. **Consistent chrome fleet-wide.** Shared top bar + standardized hero + scripture footer, identical everywhere.
6. **No backend.** Everything runs in the browser; any key/secret material is per-session in memory, never persisted. Ships as a static site to GitHub Pages.

---

## 1. Build a new demo

Vite + TypeScript, static to GitHub Pages, no backend. This pass produces the demo's **cryptographic logic, UI, and in-page content only** — the chrome (§3), README (§5), and deploy (§6) are applied afterward. Two demo-side prerequisites the later passes need:
- Mount app content at `id="app"`.
- Define `--accent` on `:root`.

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

### 3.0 Top bar (apply FIRST)

**Each lab owns its own header.** The shared-header rollout (`shared-header.html` applied by `reapply-header.py`) was deliberately retired — catalog commit `fbe77f4`; the tooling survives only as history in `archive/header-rollout/`. Do not resurrect it. To give a new demo its top bar, **copy the header from any existing lab and adapt it** (the per-repo values are the GitHub link and the accent). Changing one lab's header means editing that lab; a change every lab should get is a deliberate reviewed pass across the repos, never an overwrite driven from the catalog.

The bar's look and behavior (`cl-topbar`, always-dark) should match the fleet, and it expects four things from the demo:
1. **Skip-link target** — a content wrapper with `id="app"`.
2. **Theme contract** — `data-theme="dark"` on `<html>`, pinned before first paint. Dark is the only theme; the bar carries no toggle.
3. **Brand accent** — `:root` defines `--accent` (set to the demo's catalog accent; the bar silently falls back to teal `#35d6bb` if undefined — a missing `--accent` is why a bar looks wrong).
4. **Single banner** — the header JS auto-demotes any other `role="banner"`/top-level `<header>`, and the bar's CSS hides any theme toggle a lab still ships; leave the lab's element, don't delete it.

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
- **The mobile query has to reset `.cl-hero-main`, not only `.cl-hero-why`.** `flex: 1 1 22rem`
  and `min-width: min(100%, 20rem)` are a ROW basis; once `flex-direction` becomes `column`
  that 22rem is read as a height, and the title block reserves dead space under itself at
  every width below 640px. The query above now sets `.cl-hero-main{flex-basis:auto;min-width:0}`
  alongside the `.cl-hero-why` reset it always had. Labs built from an earlier copy of this
  snippet inherited the gap; it is a one-line fix in each.

Standard CSS (map colors to the demo's own theme vars so it passes AA; do not wrap it in `BEGIN/END cl-hero standard` marker comments — those belonged to the retired sync tooling and were removed fleet-wide):

```css
.cl-hero{display:flex;align-items:flex-start;justify-content:space-between;gap:clamp(1rem,4vw,3rem);flex-wrap:wrap;margin:clamp(1rem,3vw,2rem) 0 1.5rem;}
.cl-hero-main{flex:1 1 22rem;min-width:min(100%,20rem);}
.cl-hero-title{margin:0;font-size:clamp(1.6rem,3.8vw,2.7rem);font-weight:700;line-height:1.1;letter-spacing:.01em;}
.cl-hero-sub{margin:.4rem 0 0;font-size:clamp(.9rem,1.6vw,1.05rem);letter-spacing:.01em;opacity:.85;}
.cl-hero-desc{margin:.55rem 0 0;font-size:1rem;line-height:1.5;color:var(--text-dim);max-width:60ch;}
.cl-hero-why{flex:0 1 min(40%,26rem);min-width:min(100%,15rem);border:1px solid var(--border);border-radius:10px;padding:.85rem 1.05rem;background:color-mix(in oklab,var(--accent) 6%,transparent);}
.cl-hero-why-label{display:block;font-size:.68rem;font-weight:700;letter-spacing:.14em;}
.cl-hero-why-text{margin:.35rem 0 0;font-size:.95rem;line-height:1.5;}
@media (max-width:640px){.cl-hero{flex-direction:column;}.cl-hero-main{flex-basis:auto;min-width:0;}.cl-hero-why{flex-basis:auto;width:100%;}}
```

### 3.2 Theme contract (anti-flash)

In `<head>`, **before** any `<link>`/`<style>`:

```html
<script>
  // Dark is the only theme. Pin it before first paint, and overwrite any
  // 'light' a visitor stored back when the header carried a theme toggle.
  (function () {
    try {
      localStorage.setItem('theme', 'dark');
    } catch (e) {}
    document.documentElement.setAttribute('data-theme', 'dark');
  })();
</script>
```

Also put `data-theme="dark"` on the `<html>` tag itself, so the theme holds with JS off.

Write **only** the `theme` key. An earlier version of this pass also stamped `cv-theme`,
`cl-theme` and `crypto-lab-theme`, on the theory that some lab might read one of those
instead — exactly one does, and it reads `theme` first anyway. The extra keys broke labs
whose tests claim nothing but the theme is persisted.

**Dark is the only theme.** **Never use `prefers-color-scheme`,** and never add a theme
toggle — the fleet had one and it was removed, because the light palettes read badly and
a single past click pinned a returning visitor to light forever.

*One deliberate exception:* `quantum-vault-kpqc` pins **light**, not dark. Its warm hanji
(한지) paper palette with Korean-flag accents is the intended look for a demo of Korean
post-quantum cryptography, and it is also the palette that passes its a11y gate. It has
the same shape as every other lab — one theme, stamped before first paint, no toggle —
just the other one. A fleet-wide dark sweep must skip it.

The stylesheet defines its full palette under `:root` (dark). Existing
`:root[data-theme="light"]` blocks are dead code: harmless, never applied, and not worth
a fleet-wide CSS rewrite to delete. Don't build a toggle or theme-flipping logic in
`src/main.ts`.

**If the lab ships a strict CSP, the pin needs a hash — and the hash needs a test.**
Several labs carry a `<meta http-equiv="Content-Security-Policy">` with `script-src 'self'`
and no `'unsafe-inline'`. The snippet above is an inline script, so under that policy the
browser refuses to run it: the page loads, `theme-sync check` passes (it verifies the script
is *present*, not that it is *permitted*), and the pin is quietly dead. Do **not** answer that
by adding `'unsafe-inline'`. Add the script's own hash instead:

```
script-src 'self' 'sha256-<base64 of sha256 over the exact bytes between <script> and </script>>';
```

That closes the policy hole and opens a quieter one. Change **one byte** of the script — a
reindent, a reworded comment, a trailing space — and the hash no longer matches, the browser
silently refuses the script again, and every test still passes. So a lab that allows its pin
by hash must also carry a test that **recomputes the hash from the file's own bytes** on every
run, asserts every inline `<script>` has a matching declared hash, and fails on any inline
`on*=` handler (a hash cannot authorise one). `crypto-lab-covert-channel-studio/test/csp.test.js`
is the reference implementation — Node's built-in `node:test` and `node:crypto`, so it needs no
new dependency. Wire it into CI; a guard CI never runs is decoration. Prove it bites by
injecting one space into the script and watching it fail.

One adaptation when copying it: that lab asserts the CSP contains no `'unsafe-inline'` at all,
which is right there but wrong in a lab whose `style-src` legitimately carries it. Scope that
assertion to `script-src`.

### 3.3 Scripture footer (last visible element)

```html
<footer class="scripture-footer">
  <p>So whether you eat or drink or whatever you do, do it all for the glory of God. — 1 Corinthians 10:31</p>
</footer>
```

Verbatim, exactly once, styled only with existing CSS vars (`--border`, `--text-dim`/`--text-muted`). Matches the README's closing line.

### 3.4 Page `<head>` & favicon

- **Title:** `[Demo Name] — crypto-lab` (same human name as the catalog card / README H1).
- **Meta description:** exactly one, one sentence, naming the primitive(s), no marketing.
- **Favicon:** a single **inline `data:` URI emoji** (immune to the subpath-404 trap):
  ```html
  <link rel="icon" type="image/svg+xml"
    href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔒</text></svg>" />
  ```
  Remove any `href="/favicon.svg"`-style root-absolute favicon. `lang="en"`, `charset`, `viewport` present.
  (This favicon data-URI is the one sanctioned emoji use in the fleet — it does not relax
  `CLAUDE.md`'s "no emojis in markdown or HTML" convention for content.)

---

## 4. Accessibility (WCAG 2.1 AA — gated in CI)

Accessibility is **enforced, not aspirational**: `@axe-core/playwright` scans the *production build* for zero WCAG 2.1 A/AA violations, and the GitHub Pages deploy is blocked if it fails. This is the `ADA` gate spec.

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
    colorScheme: 'dark',                             // dark is the only theme
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port <PORT> --strictPort',  // build FIRST — see §4.1
    url: 'http://localhost:<PORT>/<REPO-BASE>/',
    reuseExistingServer: !process.env.CI,
  },
})
```

**`<PORT>` is assigned, not chosen — ask the tool.** From the catalog repo:

```
node tools/port-sync.js            # reports every port in use, and re-pins the registry
```

Take a port no lab holds, put it in all three places above, and re-run `node
tools/port-sync.js` to pin it in `tools/playwright-ports.json`. **This sample used to read
`4173` in all three slots**, which §4.1's own port rule below forbids by name — and the cost
is measured: on 2026-10-02 **36 labs were on 4173**, nine pairs shared a port, and 26 labs
with a Playwright config were absent from the registry. A literal in a copyable sample beats
a rule in prose every time, so the literal is gone.

**`e2e/a11y.spec.ts` — do NOT hand-write this from scratch, and do NOT copy the old template
gate.** Copy a current honest gate (`e2e/gate.ts` + `contrast.ts` + `nontext.ts` +
`nontext-baseline.ts` + `a11y.spec.ts`) from **`crypto-lab-schnorr-forge`** — as of 2026-08-14
it is the only lab verified clean on every known oracle defect — then rewrite every
lab-specific passage for what YOUR lab paints.

> **Do not copy the gate from an arbitrary "recent" lab.** 129 of 131 `nontext.ts` files in the
> fleet still compute `hasBorder` from `borderTopStyle` while testing all four border widths, so
> a control bordered on one side only is mis-measured (the "fifth oracle defect"). Latent rather
> than exploited so far, but copying it propagates it. `schnorr-forge/e2e/nontext.ts` carries the
> per-side `paintedSides` fix. Earlier revisions of this section named `timing-oracle` and
> `simon-period`, and `METHOD-honest-a11y-gate.md` named `drbg-arena` — all three carry the bug,
> and `drbg-arena` additionally still has `auditControlBoundaries`, the oracle that FABRICATED
> 1:1 findings on gradient controls. Leaving
another lab's documentation in those files has repeatedly produced gates whose prose describes
a repo that does not exist.

**The template gate this section used to print was removed on 2026-08-14 after it was replaced
fleet-wide.** It is recorded here only so it is recognizable on sight, because ~80 labs shipped
it and its failure modes are subtle. Every line of it was wrong in a way that made the gate
report coverage it did not have:

```ts
// ANTI-PATTERN — do not copy. This is what the retired template gate did.
await page.addStyleTag({ content: `*{animation:none!important;transition:none!important}` })
document.querySelectorAll('[hidden],[role="tabpanel"]').forEach((el) => {
  el.removeAttribute('hidden'); el.style.display = ''; el.classList.add('active')
})
for (const b of await page.locator('button').all()) { /* click by label regex */ }
await page.waitForTimeout(400)
const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
```

- **`addStyleTag` motion suppression bypasses the lab's own `@media (prefers-reduced-motion)`
  block instead of exercising it**, so a block that cancels an animation without restoring its
  end state can never be observed. Worse, where a page parks content at inline `opacity: 0` and
  reveals it via an animation's `forwards` fill, the injection kills the reveal and the content
  is **scanned invisible** (patron-shield scanned both its query masks that way in every run).
  Use `page.emulateMedia({ reducedMotion: 'reduce' })` BEFORE navigation, and assert in-page
  that `matchMedia('(prefers-reduced-motion: reduce)').matches` is true — both
  `test.use({reducedMotion})` AND the `reducedMotion` key in `playwright.config.ts` are
  **measured no-ops on Playwright 1.61.x**.
- **Force-revealing `[hidden]` and tab panels from script scans states the page never renders**
  and simultaneously destroys the ability to catch the `[hidden]` cascade trap (a class rule
  setting `display` outranks the UA `[hidden]` rule, so the element paints while the code
  believes it is hidden — four live instances found on 2026-08-14 alone). Drive the real
  controls instead.
- **`waitForTimeout(400)` is the scan race.** Where a page builds asynchronously, axe scans an
  empty container and passes having checked nothing. Wait on real content; assert the shipped
  defaults before scanning so an empty render cannot pass.
- **`violations`-only ignores axe's `incomplete` bucket**, where every contrast decision axe
  declined to make ends up — it refuses to compute contrast over a gradient or an unresolved
  `color-mix()`, and it silently discards `aria-label` on role-less elements. Assert
  `incomplete` too, and compute contrast arithmetically alongside it.
- **Never chain `.withTags(...).withRules(...)`** — both write `options.runOnly`, so the second
  SILENTLY REPLACES the first. Chained, axe ran 4 best-practice rules and *zero* WCAG rules
  while reading as a full A/AA pass. Run the two sets as separate `analyze()` calls and merge.

A gate is only worth what a mutation proves: degrade a token the oracle owns, confirm the gate
fails **naming** the finding, and confirm the build still succeeded during the mutation — a
failed build serves the previous bundle and passes green, which proves nothing.

**`package.json`:** `"test:a11y": "playwright test"`. And **exclude `e2e/` from Vitest** (`vite.config.ts → test: { include: ['src/**/*.test.ts'] }`) so the Playwright specs aren't collected as unit tests.

**Port:** one per lab, unique **in committed state** — a port fix living only in a working
tree is not a fix — and **pinned in `tools/playwright-ports.json`**, which is the registry
`port-sync` judges against. `node tools/port-sync.js` is the authority on what is free; do
not pick by grepping siblings and do not read a count from this file. Two things that follow:

- **Never the Vite default 4173.** A shared port means `reuseExistingServer` silently scans a
  *different lab's* preview — that has really happened here (`bb84` reported `kdf-chain`'s
  violations) — and during a §4.1c mutation check it can scan an **unmutated checkout still
  running from a previous run**, which reads as "the mutation was not caught" and sends
  someone to fix a check that works.
- **Keep `--strictPort`.** Without it Playwright takes the next free port, so the collision
  stops being visible and the config stops describing what actually ran.

This paragraph used to carry its own census — "as of 2026-08-14 three duplicate pairs and one
4173 default remain" — naming `hybrid-pqc`/`j-uniward`, `hybrid-sign`/`bitcoin-script`,
`harvest-vault`/`ibe-gate` and `blind-relay`. Seven weeks later every one of those labs was
still unfixed and the real figures were nine pairs and 36 labs on 4173, so the census was
both stale and read as the whole problem. A list of findings in a template is not a tracker;
`port-sync` is.

**Ship a `LICENSE` file** — MIT, `Copyright (c) <year> Paul Clark`, at the repo root. This was
missed on 156 of 176 repos, which meant the default applied: exclusive copyright, i.e. a public
teaching demo nobody was permitted to copy or adapt. (Closed fleet-wide 2026-08-05, 176/176.)
Also ensure the repo root has a `.gitignore` covering `node_modules/`, `dist/`, `test-results/`,
`playwright-report/` and `chat.md` — in a **nested** lab (`demos/<slug>/`) a `.gitignore` in the
subfolder does **not** cover the repo root.

`chat.md` is the working-notes file a session leaves behind, and it belongs on disk and out of
the repo for the same reason this template's own local copy does: a committed snapshot of one
conversation ages silently into a second, wrong account of what the lab does. It was missing from
190 of 217 clones on 2026-09-29 and added to 181 of them in one pass; nine were skipped because
another session had them on a feature branch, and nine more already **tracked** a `chat.md`, where
the ignore line is inert until the file is `git rm --cached`'d. A new lab should start with the
line rather than acquire it later.

**`playwright.config.ts` — build before you serve.** The `webServer.command` MUST run the
build, not just the preview:

```ts
command: 'npm run build && npm run preview -- --port <PORT> --strictPort',
```

`preview` serves whatever is already in `dist/`. Without the build in front, a run tests a
stale bundle — and worse, a build that *fails* leaves the previous good bundle in place, so
the whole suite passes green against source that no longer compiles. That silently
invalidates mutation checking, which is the only way we prove a test has teeth. It produced
two false "verified" results in a single session on 2026-08-02 before being caught and
fixed fleet-wide. With the build in front, a compile error aborts the run instead:
`Process from config.webServer was not able to start. Exit code: 2`.

Related trap when verifying by hand: `reuseExistingServer: !process.env.CI` means a preview
server already listening on that port is reused and the command never runs at all. If you
are mutation-testing locally, make sure no stray preview is holding the port.

**CI:** in `deploy.yml`, before deploy — `npm test` (the unit/correctness suite), then
`npx playwright install --with-deps chromium`, then `npm run test:a11y`; any of them failing
blocks the deploy on `main` (see §6 for the full job).

**Gate on the WHOLE suite, not just the a11y half.** A 2026-08-14 sweep found **29 repos whose
deploy job runs `test:a11y` alone**, so the unit and algorithmic suites never blocked a publish —
in `bulletproofs` that skipped nine correctness suites (IPA, proof, batch-verify, serialization,
boundaries); in `jevil` and `aegis-gate` it skipped the entire core suite. Those repos could
publish a build whose cryptography was broken so long as the browser specs passed. Note also
that `"test:a11y": "playwright test"` runs **every** Playwright spec despite its name, so a repo
naming that script in CI may be running more than the name suggests — and a repo whose functional
tests are NOT Playwright specs (a `tsx` or `node` script) is running none of them.

### 4.1a The gate's SETUP asserts structure, never product copy (REQUIRED)

A shared `boot()` in `e2e/gate.ts` runs before every test that imports it, so one assertion
there fails all of them at once — under whatever name those tests carry. On 2026-09-26
`crypto-lab-mceliece-gate` changed one textarea's default string, in the same commit that
corrected the lab's security claims. `gate.ts` still asserted the old sentence, so `boot()`
threw, both axe runs failed, the build job failed, the deploy was skipped, and `deploy-sync`
reported the lab stale. **The step that went red was called "Accessibility gate", and four
of its six a11y tests had passed.** For three days the live site served
"the most battle-tested post-quantum proposal in existence" while `main` held the correction,
and the one red thing in sight named the wrong subject.

So in a setup helper:

- **Assert STRUCTURE** — the controls exist, the arrival panel is the one that ships, counts
  (`.tab-btn` → 6), `[hidden]`/`toBeEmpty()` on lazily-rendered panels, a skip link whose
  target exists, no theme control, `details[open]` at zero, a default that matches a *shape*
  (`toHaveValue(/^[0-9a-f]{64}$/)`).
- **Never assert what a string SAYS** — `toContainText('VALID')`, `toHaveText('UTF-8 text')`,
  or a default message asserted as a whole sentence. Those belong in §4.1b's
  `claims.spec.ts`, where a failure names copy as the subject.

**The lab §4.1 tells you to copy now obeys this**, and it did not until 2026-10-02:
`crypto-lab-schnorr-forge`'s `boot()` carried three copy assertions, one of them the full
sentence `'Schnorr is the signature ECDSA wishes it were.'`, so every lab built by copying it
inherited the shape and wrote its own sentence into `boot()`. They were moved to
`e2e/claims.spec.ts` and each was mutation-checked: changing the source string fails that one
claims test and nothing else, and — the point of the exercise — `npm run test:a11y` now passes
2/2 with the copy still wrong, where before it failed both under the name "Accessibility gate".
Copy its `claims.spec.ts` along with its gate.

Fleet-wide this remains a standing hazard rather than a bug list: **77 of the 167 labs with an
`e2e/gate.ts` assert product copy in it** (surveyed 2026-09-29), from one string to fifteen.
Do not sweep them — each is a judgement about which assertions are structural. Move them when
you next touch the lab.

### 4.1b `e2e/claims.spec.ts` — the claims suite (REQUIRED)

Alongside `a11y.spec.ts`, every lab needs a suite that checks the page tells the truth. This is
what separates a demo that is *correct* from one that is *trustworthy*.

**The rule that makes these tests worth anything: compare two values the page itself printed,
rather than asserting against a hardcoded string.** A test that re-derives the same expression
the source uses will happily agree with a bug — that has happened here: a fix was "verified" by
a test that recomputed the identical faulty branch condition.

**But internal consistency is not enough — a page can be consistently wrong.** A test that only
checks the page agrees with itself passes a mutation that corrupts the underlying maths, because
the corrupted value is reported consistently everywhere. Real example: flipping the rotation
direction in a lattice-attack recovery matcher left the "page reports only its checked outcome"
test green; only an **independent re-derivation** caught it. So aim for a mix:

- *cross-checks* — two surfaces that must agree (a counter vs the rows it counts; hand-authored
  prose vs the computed value vs a `maxlength` attribute);
- *independent re-derivations* — recompute the claim from the page's raw inputs by a different
  route than the source takes, and assert the page's answer matches;
- *parts-sum-to-whole* — where the maths offers one (lift + margin = q/2).

Cover at minimum: the headline claim recomputed from values on screen (e.g. parse `p` and `q`
out of the verdict and assert `p * q` equals the displayed modulus); each **failure** path, and
that the page names the actual cause; **retirement** — change an input, assert the stale verdict
is gone *and* that the page says it was retired; the `[hidden]` probe from §4.1; and a **no-op
guard** — re-selecting the same value must NOT retire a fresh verdict.

### 4.1c Prove the tests bite — mutation discipline (REQUIRED)

A green suite is not evidence until you have watched it fail. Before trusting any test:

1. **Invert a condition in the SOURCE** (not the test).
2. Confirm **the build SUCCEEDS**. A mutation that breaks `tsc` proves *nothing* — the suite runs
   against the last good bundle and passes.
3. Confirm the **bundle hash CHANGES** (`md5 dist/assets/*.js`) — proof it reached the browser.
4. Confirm **the owning test FAILS**, naming the finding.
5. **Restore**, and confirm the hash returns to its pre-mutation value.

Rules learned the hard way:
- **Commit the real work BEFORE mutating.** A session that dies mid-check otherwise strands an
  inverted condition in the tree. Four were caught in one day here; two did not break `tsc` and
  would have shipped.
- **One mutation at a time, restored immediately.**
- Do **not** `git checkout -- <file>` to undo a mutation if that file also holds real work; use a
  surgical string-level revert.
- **If a mutation leaves every test green, the branch may be UNREACHABLE.** That is evidence about
  the *source*, not the tests — the right fix may be deleting dead code.
- Verify the mutation actually APPLIED before trusting a negative result. A `lang` mutation that
  silently no-op'd on `<html lang="en" data-theme="dark">` produced a false "oracle is dead".

#### A lab that renders VERDICT MARKERS runs its mutations from a script (REQUIRED, forward-looking)

The five steps above are a person's checklist, and a person performing them writes the result
down afterwards. That is where they fail. A sentence describing a mutation cannot be replayed,
and a paragraph describing a run is the author's side of the claim rather than the run's.

So, for a lab carrying `data-verdict` / `data-claim` markers, three requirements:

1. **Each mutation is recorded as a CONCRETE PATCH** — the file, an anchor that must occur
   exactly once, and its replacement — never as a sentence describing an edit.
2. **A kill is defined by four rules, and the script enforces all four:** the owning test PASSED
   unmutated in the same run; the patch actually CHANGED the file; the run served the MUTATED
   code; and a patch that does not compile is **DOES NOT BUILD** and is never a kill.
3. **Every `observed` record is written by the thing that ran it, never typed.** Writing those
   records back into the ledger is OPTIONAL — see below.

Rule 2's third clause is a property, not a mechanism, and the fleet proves it two ways.
`crypto-lab-privacy-pass` requires the built bundle's hash to move. `crypto-lab-hidden-bit`
classifies the failure instead, refusing any red run whose output matches a build error, a
server that never started, or a connection refused, and pins the port with `CI=1` so no reused
server can answer. `crypto-lab-pqxdh-wire` does both. Any of the three satisfies the rule; what
is not acceptable is trusting a red run without asking which.

**On writing back.** `privacy-pass` writes each `observed` line into its ledger; `hidden-bit`
and `pqxdh-wire` deliberately do not, and their reason is the better one to understand before
copying either. Both make an unperformed record FAIL THE SUITE — their helpers write the (test,
marker) pairs they actually executed to a run-scoped sink, and a global teardown fails the run
when a recorded kill never appeared there. An archived string would be a second copy of an
answer already enforced. `privacy-pass` writes one because its records are quoted in prose
elsewhere. Archival is a choice; enforcement is the requirement, and a lab that has neither has
nothing.

**This is forward-looking.** Nothing here obliges a retrofit of an existing lab. It governs a
new verdict-rendering lab and any lab whose mutation records are being rewritten anyway.

### 4.1d Negative claims — test what the cryptography does NOT buy (REQUIRED)

§1 and §2 require every demo to state what it does **not** prove. Nothing tests that, which
makes it the only honesty rule in this document with no enforcement — in a document that has
§4.1c specifically to prove tests bite. Prose nothing checks is prose that drifts.

Every lab declares at least one **negative claim**: one sentence naming a security property
the construction does not provide. Scope it to the construction on the page, never to the
field. "XTS does not detect modification or rollback" is right; "full-disk encryption does
not detect modification" is false, and contradicted by dm-integrity and T10 PI.

Each negative claim needs an **evidence fixture**: a reachable state in which every check the
page performs reports success *and* the named property is violated anyway. The fixture is
what makes the claim a result rather than a disclaimer.

Assert three things in `e2e/claims.spec.ts`:

1. **Reach the fixture.** Drive the page into that state through the UI.
2. **Everything is green.** Every verdict the page renders in that state reports success —
   asserted against the rendered verdicts, not a flag the test sets. If any check fails, the
   fixture is wrong: it is demonstrating the mechanism working, not its limit.
3. **The limitation is on screen in that state.** Visible, not in the README, not behind a
   disclosure the user has to open. Assert the negative-claim text is present and tied to
   that fixture.

The shape to aim for is a verdict that reads as success and failure at once — `ATTESTED —
AND COMPROMISED`, `DECRYPTED — AND MODIFIED`. Where the construction has no failure code to
raise, say so on the page: the absence of a code is the exhibit, and a lab that invents one
to look thorough has taught the opposite of the lesson.

Per §4.1c the test must bite. Delete the negative-claim text and assertion 3 must fail; break
a check inside the fixture and assertion 2 must fail. A negative-claim test that survives
both is decorative.

This goes in the existing claims suite. Do not add a `CLAIMS.yaml`, a `THREAT-MODEL.md`, or a
second verifier in another language — see §4.1b for why the suite is the enforceable home.

### 4.1e Two hazards that make a green run meaningless

**A test step that runs zero tests exits 0.** `node --test` can load none of your files and
report success, and the gate passes with a log reading zero tests — which is how
`crypto-lab-padding-oracle` ended up with a hand-written harness, and why
`tools/test-invocation.js` exists to find test files no workflow runs. So assert the COUNT,
not just the exit code: read the runner's summary line in CI and fail when it reports 0, and
check that the glob in your workflow actually matches the files on disk. A lab whose tests
are invoked as `node --import tsx --test` is invisible to a pattern expecting `node --test` —
if a detector says your lab has no tests, check the invocation before believing it.

**Per-platform visual baselines need the `-linux` set too.** A lab whose snapshots are named
`*-visual-darwin.png` and `*-visual-linux.png` keeps one baseline per rendering environment,
and `playwright test --update-snapshots` writes only the platform you ran on. Updating on
macOS leaves `-linux` holding the old render, and CI renders in
`mcr.microsoft.com/playwright:<pinned>` — so the gate fails on exactly the snapshots that
were "already updated". Do not try to regenerate them locally: on Apple silicon that
container runs under QEMU, and emulated amd64 crashed `chrome-headless-shell` on all 13 tests
with a core dump each. **Take the render CI produced** — the failing run uploads
`test-results/` with an `-actual.png` per failure — then check it rather than trusting it:
read each image against the baseline it replaces and confirm the only difference is the one
you intended, and confirm the first attempt and the automatic retry produced BYTE-IDENTICAL
images, which is what separates a deterministic render from a flaky one.

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
- **The always-dark `.cl-topbar` is self-contained** — scope your base `p{}` / `button{}` rules to `#app`, not globally, so they don't fight the lab's top bar.
- **`data-theme="dark"`** is pinned on `<html>` and there is no toggle; any CSP must allow the head's inline anti-flash script.
- Every interactive control has an accessible name (visible `<label>` or `aria-label`); text inputs are real `<textarea>`/`<input>`, never `contenteditable`; keyboard-operable with visible focus; layout stacks < 640px; a single banner landmark (the top bar; the hero is the page content header).

**Acceptance:** `npm run build` clean; zero axe violations; run `npm run build && npm run test:a11y` locally before every push.

---

## 5. README standard

The current fleet README (richer than the old five-section form) uses these sections, in order, with **correctness as the headline**:

**What It Is** (name the exact primitives, the problem, the security model, "not production") · **Exhibits** (numbered tour of the interactive pieces) · **When to Use It** (incl. at least one "do NOT use") · **Live Demo** (the Pages URL + what the user can do) · **What Can Go Wrong** · **Real-World Usage** · **How to Run Locally** · **Related Demos** · **Build & Verify** (test count + KAT files + the a11y gate) · **Performance** (where relevant) · footer.

Close every README with:

```
---

*One of the browser demos in the [Crypto Lab](https://crypto-lab.systemslibrarian.dev/) suite.*

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*
```

When adding/altering exhibits, **update `What It Is` and the numbered `Exhibits` list to match** — preserve the structure, honesty framing (KATs, "not production"), footer, and scripture line. Extend, never restructure.

---

## 6. Deploy — GitHub Pages via Actions (a11y-gated)

Actions-based deploy (not the legacy `gh-pages` branch). `.github/workflows/deploy.yml` builds, runs unit tests, installs the Playwright browser, **runs the axe a11y gate, and only then deploys** — so a broken build or an accessibility regression never ships:

```yaml
on:
  push:
    branches: [main]
  pull_request:            # the gate must judge PRs too — see §6.1
    branches: [main]
  workflow_dispatch:       # so a deploy can be re-run by hand — see §6.2

concurrency:
  group: pages-${{ github.ref }}   # NOT a bare `pages`: with cancel-in-progress
  cancel-in-progress: true         # a PR run would cancel a live main deploy
# 16 workflow files still carry the bare `pages` group (measured 2026-10-02, after
# the reference lab in §4.1 was fixed). `gate-sync` reports it as a warning rather
# than a failure because it only bites once the workflow gains a pull_request
# trigger -- which the block above adds. So if you copy a lab's deploy.yml, fix the
# group as you copy it.

# build job, after `npm run build`:
- run: npm test
- run: npm run build
- name: Install Playwright browser
  run: npx playwright install --with-deps chromium
- name: Accessibility gate (axe-core, WCAG A/AA)
  run: npm run test:a11y
- uses: actions/upload-pages-artifact@v5
  with: { path: dist }

# deploy job: actions/deploy-pages@v5
  if: github.event_name != 'pull_request'   # a PR is tested, never published
  # NOT `== 'push'`. That also skips workflow_dispatch, which is the one trigger
  # §6.2 depends on: the dispatched run would build, pass the gate, and skip the
  # deploy job, so the site still never updates.
```

Current action versions, counted across all 220 cloned labs on 2026-10-02 rather than
asserted: `actions/checkout@v7` (264 uses), `actions/setup-node@v7` (253),
`actions/upload-pages-artifact@v5` (212), `actions/deploy-pages@v5` (212),
`dependabot/fetch-metadata@v3` (214), `actions/configure-pages@v6` (96 — only the labs that
need it). **No lab is on `fetch-metadata@v2`**, which is what this file told you to install
until 2026-10-02; a new lab built from it started one major behind and Dependabot opened a
bump against it the same week. If a version here disagrees with the fleet, the fleet is
right — re-count before trusting the list.

**Pin `node-version: 22`.** This file said nothing about Node until 2026-10-02 and the fleet
shows the cost: 127 workflow files on 22, 93 on **20**, 32 on 24. Node 20 left maintenance in
April 2026, so those 93 run a release that no longer gets security fixes — drift by omission,
in the one field nobody thought to standardise. 22 is the fleet's majority and the reference
lab's value; 24 is fine for a new lab, 20 is not.

**Set the repository's Pages source to "GitHub Actions" — this file never said so, and the
omission cost three months.** The workflow above uploads an artifact and publishes it with
`actions/deploy-pages`, which only works when Pages is configured for `build_type: workflow`.
The two states to know, because they are NOT symmetric:

- **`workflow` + a branch publisher** (`peaceiris/actions-gh-pages`, a `gh-pages` push) —
  the run goes green, the branch updates, and **the site never changes**, because Pages under
  `workflow` serves only an uploaded artifact. `crypto-lab-dilithium-reject` and
  `crypto-lab-elgamal-plain` sat in this state from 2026-07-11 to 2026-10-01 with every check
  green; dilithium-reject's live CSS was missing an accessibility fix its own `main` had
  carried the whole time, measured at 204px of horizontal scroll against WCAG 1.4.10.
  `deploy-sync` calls this **PUBLISH-UNSERVED** and fails it.
- **`legacy` + an artifact publisher** — merely dead configuration: Pages builds the branch
  regardless, so the site is current and the upload does nothing. Reported as
  **ARTIFACT-UNUSED**, a note rather than a failure.

Check it, do not assume it:

```
gh api repos/systemslibrarian/crypto-lab-<slug>/pages --jq '.build_type'   # must print: workflow
```

**Then ask the served bytes for the thing you changed.** A green run is not evidence that it
shipped — §6.2 is entirely about a green run that ships nothing:

```
node tools/deploy-sync.js check                          # from the catalog repo
curl -s https://systemslibrarian.github.io/crypto-lab-<slug>/assets/<css> | grep -- '--accent'
```

Also: `vite.config.ts` `base: '/crypto-lab-<demo-name>/'` (read the real repo name, don't guess); **no root-absolute asset paths** (`/foo` 404s under the project subpath — use `./foo`, a Vite-imported asset, or a `data:` URI); pin `@playwright/test` to a current build to avoid the corrupt-cache install loop. Verify the live URL loads with no 404s after deploy.

### 6.1 Dependabot — grouped, gated, self-merging (REQUIRED)

Without this a new lab opens **one pull request per dependency**. Ungrouped, this
fleet reached **1,461 open PRs across 176 repos**, none of which had any CI signal
because the only workflow fired on push to `main`. Ship `.github/dependabot.yml`
with the lab:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule: { interval: "weekly" }
    open-pull-requests-limit: 5
    groups:
      npm-minor-and-patch:
        patterns: ["*"]
        update-types: ["minor", "patch"]   # majors stay individual, on purpose
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule: { interval: "weekly" }
    open-pull-requests-limit: 5
    groups:
      github-actions:
        patterns: ["*"]
```

Majors are deliberately **not** grouped. When the 2026-08-18 backlog was landed,
109 bumps had to be held back and they were overwhelmingly majors — a breaking
major inside the grouped PR makes the whole thing unmergeable, which is the
hand-unpicking this exists to prevent.

Then add an auto-merge job to the workflow that runs the gate on `pull_request`:

```yaml
  dependabot-auto-merge:
    needs: build            # every gate job — this is what makes it safe
    if: github.event_name == 'pull_request' && github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    permissions: { contents: write, pull-requests: write, actions: write }
    # actions: write is required for the deploy dispatch below. Without it
    # `gh workflow run` returns HTTP 403 "Resource not accessible by integration",
    # the merged bump never deploys, and a `|| echo` fallback hides it.
    steps:
      - id: meta
        uses: dependabot/fetch-metadata@v3
      - name: Merge any bump whose gate went green
        run: |
          for attempt in 1 2 3; do
            gh pr merge --squash --delete-branch "$PR_URL" && merged=1 && break
            sleep 15          # a sibling PR merging first moves main under us
          done
          [ -n "$merged" ] || { echo "::warning::gate passed, merge did not land"; exit 0; }
          # A merge made with GITHUB_TOKEN raises no push event -- GitHub suppresses
          # them so workflows cannot retrigger themselves -- so deploy would never run
          # and the site would keep serving the previous build. Ask for it explicitly;
          # a workflow_dispatch through the API is not suppressed. The dispatched run
          # is the same gate-then-deploy pipeline, so a bad merge still ships nothing.
          #
          # Dispatch the file THIS lab has: most are deploy.yml, some deploy-pages.yml
          # or pages.yml. A copied name 404s only on the auto-merge path, after the
          # merge has landed. See §6.2.
          gh workflow run deploy.yml --repo "$GITHUB_REPOSITORY" --ref main
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

`needs:` is the whole safety argument — the gate decides, not the version number.
A major that breaks the lab fails the gate and the PR stays open for a human.

**The comment above that dispatch line is part of the block, not decoration.** Until
2026-09-23 this sample carried `# see §6.2` there and put the argument in prose below,
outside the YAML — so a lab built by copying this block got a dispatch with nothing in
the file saying why it exists. Eight labs created after the 2026-09-10 normalisation
pass are missing it or have drifted from it, every one of them born that way rather than
having lost it: `fold-gate`, `hidden-bit`, `order-leak`, `pqxdh-wire`, `privacy-pass`,
`proof-tally`, `split-point` (absent) and `kpqc-pair` (drifted). Deleting that paragraph
and deleting the dispatch it defends are the same edit six months apart, which is why
`tools/dispatch-comment-sync.js` holds one wording fleet-wide and `dispatch-sync check`
fails a lab whose copy differs. Copy the comment with the code.

**If this lab's gate lives in a reusable workflow** (one that `deploy.yml` calls
via `uses: ./.github/workflows/test.yml`), the job must NOT go there: a called
workflow may not request more permission than its caller grants, and the whole
deploy dies at startup saying only *"workflow file issue"*. Put it in its own file
triggered on `workflow_run` of that workflow instead.

### 6.2 Deploy after an auto-merge — GitHub will not do it for you

A merge performed with `secrets.GITHUB_TOKEN` raises **no push event**; GitHub
suppresses them so workflows cannot retrigger themselves. So `deploy.yml`
(`on: push`) never runs after an auto-merge: the bump lands on `main` and the live
site keeps serving the previous build, with no red run anywhere to say so. Nine
repos were found drifting this way. The merge step must therefore dispatch the
deploy explicitly — a `workflow_dispatch` through the API is not suppressed —
which is why `workflow_dispatch:` is required in the trigger block above.

**Dispatch the file this lab actually has.** The dispatch line names a workflow
file, and the fleet is not consistent about that name: most labs have
`deploy.yml`, some have `deploy-pages.yml`. Copy a reference lab verbatim and you
get `gh workflow run deploy.yml` in a repo where that file does not exist. It 404s
**only on the auto-merge path, and only after the merge has already landed** — the
push-triggered deploy keeps working, so the lab looks healthy until a Dependabot PR
merges and the site quietly stops updating. That is the same silent non-deploy this
whole section exists to prevent, reintroduced by the fix for it. Check the filename
after copying.

**Gate the deploy on `!= 'pull_request'`, never on `== 'push'`.** They read as
equivalent and are not: `== 'push'` also skips `workflow_dispatch`, which disables
the dispatch above. And if build and deploy are one job, split them before gating —
gating the single job off for pull requests disables the PR gate itself, so the PR
runs nothing and reports nothing.

**The gate a bump auto-merges against must be the gate the deploy runs.** If
auto-merge is gated on a lighter CI workflow than the deploy is, a bump that breaks
the heavier gate merges cleanly and then the deploy fails — so `main` silently stops
shipping with nothing red in between. `crypto-lab-e91` drifted exactly that way: its
auto-merge ran build plus engine tests, its deploy ran the browser gate, and a
grouped minor bump floated a deliberately pinned `@playwright/test` version back up,
un-deferring a WCAG defect that only the browser gate could see.

**A major that lands is a claim about behaviour, not just a version string.** Two
worth knowing, both hit today. `typescript` 5 → 7 stops tolerating an undeclared
side-effect import, so a Vite lab missing `src/vite-env.d.ts` fails with `TS2882` on
`import "./styles.css"`. And `vitest` 2 → 4 does not make tests slower — it makes
them *timeout-enforceable*. Vitest 2 raced a `setTimeout` against the test, so a body
that is `async` but only ever awaits already-resolved promises starves the macrotask
queue and the timer never fires: a 12.6s test passes a 5s budget. Vitest 4 measures
elapsed time and fails afterwards. The tell is a failure reporting a duration far
above the timeout it supposedly exceeded. It reads as a performance regression and is
not one, so fix it with a per-test timeout carrying the measurement, never by
shrinking what the test does.

**And the reciprocal, for labs on `node --test`:** it has no default timeout at
all — `--test-timeout` defaults to `Infinity`, so a hung test runs until the
GitHub Actions job limit with nothing red for six hours. The tell is a job that
looks **stuck** rather than a failure with a suspicious duration, which is the
harder signal to read: a stuck job invites a re-run rather than an investigation.

Pass `--test-timeout` — but know exactly what it buys, because it is **less than
it looks**. It only fires for a test that yields to the macrotask queue. Measured
directly, under a 100ms budget:

| test shape | caught? | measured |
|---|---|---|
| synchronous busy-loop | **no** | ran 2000ms, reported `ok` |
| `async`, awaits a real `setTimeout` | yes | failed at 102ms |
| `async`, awaits only already-resolved promises | **no** | ran 2000ms, reported `ok` |

So `node --test --test-timeout` is *vitest 2's* mechanism, not vitest 4's: it
races a timer that a non-yielding test never lets run — and the third row is the
starvation shape described above, exactly. Keep the flag, because it does cover
real async hangs (a `fetch`, a timer, I/O), and say in the CI file what it does
not cover.

**Prove it with a synchronous busy-loop, never with a small `--test-timeout`.**
Running a suite at `--test-timeout=1` fails every test that yields at all, which
looks like proof and is not: it reports the same result for a suite the flag
protects and one it does not. That distinction matters more than the flag, because
a check that closes the question while measuring nothing is worse than no check.

**The backstop that catches every shape is `timeout-minutes` on the job.** GitHub's
default is 360 minutes, which is where the six hours comes from. Set it per job at
several times the measured run — the labs audited here run 35–132s, so 15 is
generous. Only 6 of 194 labs set it at all.

**Two adaptations for labs with no dependencies.** A lab with a bare `package.json`
and no lockfile cannot run `npm ci` or `cache: npm`; both fail the run outright, so
use `npm install` or drop the step. Keep the npm Dependabot block anyway even while
it is dormant: the group name is the contract, and it should already be right on the
day someone adds a first dependency. In those labs `github-actions` is the ecosystem
that actually opens PRs.

---

## Pipeline for a new demo

1. Fill §1's seven sections + the repo metadata (name, one-liner, catalog category, card title, tags, `--accent`, favicon emoji).
2. Create the GitHub repo (name + About one-liner).
3. Build the demo (§1) → working crypto + UI + tests, mounted at `#app` with `--accent` defined.
4. Apply the chrome (§3): header copied from an existing lab, hero, theme contract, footer, head/favicon.
5. Meet the teaching bar (§2) and the a11y gate (§4).
6. Write the README (§5); wire the Actions deploy (§6), **including `.github/dependabot.yml`
   and the auto-merge job (§6.1) and the post-merge deploy dispatch (§6.2)**. Skipping these
   is how a lab starts opening one pull request per dependency, forever.
7. Add the catalog card (title, tags, accent) to the `crypto-lab` index; deploy and verify the live URL.
8. Run the catalog's checkers from `crypto-lab/`: `node tools/readme-sync.js check`,
   `node tools/corpus-sync.js check`, `node tools/concept-sync.js check`,
   `node tools/theme-sync.js check`, and — because step 7 is the one most often
   skipped — `node tools/fleet-sync.js check`, which asks GitHub whether any live lab
   has no card. The other four all read the cards, so a lab that never got one is
   invisible to every one of them at once. The last one reads **every** page in the new lab, not
   just its root `index.html` — a sub-page that boots from `localStorage` or
   `prefers-color-scheme` instead of pinning a literal will fail it, which is exactly the
   defect it was widened to catch.

9. **Pin the new lab in the two registries that have a declared denominator**, or two
   checkers fail it for not existing in them:

   ```
   node tools/dispatch-census.js write   # then read the diff: one ADDED row is right
   node tools/port-sync.js               # pins this lab's Playwright port
   ```

   `dispatch-sync check` fails an unpinned lab as **UNPINNED-LAB** on purpose — the same
   silence that hides a new lab hides a departed one, so a drop in the denominator is as loud
   as a drift in the numerator. `tools/dispatch-census.json` is the only thing that remembers
   a lab used to be here.

10. **Confirm it shipped, from the served bytes** — not from a green check:
    `node tools/deploy-sync.js check`, then `curl` the live page for the thing you changed.
    See §6.

## What will judge this lab

This file tells you what to build. **Twenty-three checkers in the catalog repo judge the
fleet, and this file named 7 of them until 2026-10-02** — so the other 16 were rules a new
lab could only discover by going red, which is why the same corrections kept being applied to
new labs one at a time. These are the ones that judge YOUR lab rather than the catalog's own
files; run them from `crypto-lab/`:

| Checker | Fails your lab when |
|---|---|
| `fleet-sync.js check` | it is live on GitHub with no card here |
| `theme-sync.js check` | any page in it does not pin one theme with a literal, or a theme control returns |
| `gate-sync.js check` | a Dependabot bump could merge against a lighter gate than the deploy runs (§6.1) |
| `dispatch-sync.js check` | the auto-merge re-queries the merge instead of reading its exit status, or the lab is unpinned (§6.2, step 9) |
| `dispatch-comment-sync.js check` | the dispatch rationale paragraph differs from the fleet's one wording |
| `dispatch-census.js check` | it stopped matching its pinned row, or was never pinned |
| `deploy-sync.js check` | the live site is not built from the sha on `main` — including PUBLISH-UNSERVED (§6) |
| `port-sync.js check` | its Playwright port collides, is unpinned, or `--strictPort` is missing (§4.1) |
| `test-invocation.js` | it has test files no workflow runs (§4.1e) |
| `catalog-evidence.js verify` | a `file:line` anchor on its card no longer resolves |
| `catalog-sync.js check` | a chip names an algorithm its source does not implement, or `CATALOG.md` drifts |
| `readme-sync.js check` · `corpus-sync.js check` · `concept-sync.js check` | its card is missing from a file derived from the cards |
| `protection-census.js` | (read-only) reports what protects its default branch, asked of BOTH endpoints |

The rest guard the catalog's own generated files and the teaching layer
(`tools-sync`, `corpus-freshness`, `catalog-recall`, `teach-build`, `teach-drift`,
`teach-layout`, `dispatch-claims`, `depth-audit`). `README.md`'s "Maintaining the fleet"
table is generated from the tools themselves and is the current list — **read it rather than
this one**, for the same reason the port census was deleted from §4.1: a hand-kept copy of a
generated list is drift waiting to happen.

Seven run weekly in `.github/workflows/fleet.yml` with no one watching, so a lab can break
long after you ship it: `fleet-sync`, `deploy-sync`, `gate-sync`, `dispatch-sync`,
`theme-sync`, `catalog-evidence verify`, `catalog-recall check`.

---

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*
