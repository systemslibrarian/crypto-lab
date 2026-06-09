# CLAUDE.md

This is the source for **Crypto Lab** (https://crypto-lab.systemslibrarian.dev/) — a single-page static site (`index.html` + `README.md`) deployed via GitHub Pages from `main`.

The catalog has three navigation layers and they all live in `index.html`:

- **Learning Paths** (top): curated, ordered journeys — `LEARNING_PATHS` in the JS IIFE.
- **Section H2 dividers**: curriculum-ordered section breaks within the grid — `SECTIONS` + `TITLE_TO_SECTION` in the JS IIFE.
- **Filter chips**: cross-cutting tags — `CATEGORIES` in the JS IIFE, applied to cards via `data-category`.

Two cross-cutting tags (`FOUNDATIONS`, `REAL-WORLD SYSTEMS`) are applied at runtime via `FOUNDATIONS_TITLES` and `REAL_WORLD_TITLES` arrays, so you don't repeat them in every card's `data-category`.

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

### 3. Add a row to `README.md`'s All Demos table

The table is sorted alphabetically by the **Category** column (column 2). Insert in the correct alphabetical position.

```
| [Demo Name](https://systemslibrarian.github.io/crypto-lab-<slug>/) | Category Label | Primitive A · Primitive B · Primitive C · Primitive D |
```

For WIP demos, suffix the link with ` *(WIP)*`:

```
| [Demo Name](https://systemslibrarian.github.io/crypto-lab-<slug>/) *(WIP)* | Category Label | ... |
```

### 4. (Optional) Add to a Learning Path

If the demo fits the Developer / Cryptanalyst / Post-Quantum journeys, add `{ title: 'Demo Name' }` at the right step position inside the matching `LEARNING_PATHS` entry. The JS auto-detects WIP from the card class — no separate `wip: true` needed when the card exists.

### 5. Verify

```
python -m http.server 8765
```

Open `http://localhost:8765/` and confirm:
- New card appears in the intended section (search by demo name in the filter input).
- Each `data-category` chip filters the card in.
- README table still sorts alphabetically by Category column.

A self-check script lives at the end of this file — copy it into a `node -e "..."` invocation to verify title coverage.

---

## Other maintenance

**Add/reorder filter chips** — edit `CATEGORIES` array. Curriculum order is the visual order. Two-row chip bar splits at `Math.ceil(length/2)`, so length 16 = 8 per row.

**Add a curriculum section** — add an entry to `SECTIONS`, a matching `<a href="#section-<id>" data-target="<id>">Label</a>` in `<nav class="section-nav">`, and update all card titles' `TITLE_TO_SECTION` entries to the new id where appropriate.

**Add a learning path** — add an entry to `LEARNING_PATHS` with `id`, `label`, `blurb`, `steps`. Keep `steps` ≤ ~12 for readability. CSS auto-collapses to one column under 1120px.

---

## Conventions

- No backend, no accounts — every demo is browser-only.
- One concept per demo. Don't bundle.
- Demos link to their own GitHub Pages site (`https://systemslibrarian.github.io/crypto-lab-<slug>/`), not the source repo. Source lives at `https://github.com/systemslibrarian/crypto-lab-<slug>`.
- No emojis in markdown or HTML unless the user explicitly asks for them.
- Featured cards (`.feature-card`) are folded into their curriculum section at runtime, so the catalog always starts with Foundations.

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
