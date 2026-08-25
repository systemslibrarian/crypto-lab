# Prompt — evaluate the ten new labs against the gold standard

Paste-ready. Give this to an agent with read access to `/Users/gmcas/repos/` and the
ability to run `node`, `npm` and `gh`. It is written to be self-contained; it names the
files to read rather than summarising them, because the summaries are where this fleet's
past mistakes came from.

---

## Who you are and what you are being asked

You are evaluating **ten newly built cryptography teaching labs** in a fleet of ~176.
The fleet is a set of single-concept, browser-only, no-backend demos, each a Vite +
TypeScript static site deployed to GitHub Pages, catalogued by a single-page site called
**Crypto Lab** (https://crypto-lab.systemslibrarian.dev/).

Your question is **not** "do these work?" — that has been measured, and the answer is
yes. Your question is:

> **What would it take to make each of these ten the gold standard for the thing it is
> trying to teach?**

Gold standard means: if a motivated newcomer and a professional cryptographer both opened
this page, would it be the best explanation of this concept on the public web? Not merely
correct. Not merely accessible. The *best*.

Write your findings to **`chat.md` in the root of `/Users/gmcas/repos/crypto-lab/`**.

---

## The ten labs, and what each teaches

All ten live as sibling directories of the catalog, at
`/Users/gmcas/repos/crypto-lab-<slug>/`, and are on GitHub as
`systemslibrarian/crypto-lab-<slug>`.

| slug | teaches | unit tests |
|---|---|---|
| `shelf-oracle` | single-server computational PIR, RLWE-based | 87 |
| `feistel-forge` | the Feistel construction — real DES stepped round by round, double-DES meet-in-the-middle | 167 |
| `rekey-relay` | proxy re-encryption, and the first-construction key-recovery collusion | 138 |
| `polynomial-forge` | polynomial commitments — KZG, IPA, FRI over BLS12-381 | 302 |
| `dnssec-chain` | DNSSEC authenticated denial of existence and the trust hierarchy | 132 |
| `masked-core` | Boolean masking of AES-128, and the power analysis that beats it | 139 |
| `sector-vault` | XTS-AES (SP 800-38E / IEEE 1619) and the integrity it does not provide | 119 |
| `attribute-gate` | attribute-based encryption — policy, not person; and collusion resistance | 136 |
| `sphinx-mix` | the Sphinx mix-network packet format (Danezis & Goldberg, S&P 2009) | 70 |
| `attestation-gate` | TPM measured boot, TPMS_ATTEST quotes, and time-of-check/time-of-use | 216 |

Each carries a `brief.md` (or `brief/`) in its root — the design brief it was built from.
Read it: it states what the lab set out to do, which is the thing you are measuring the
result against.

---

## Exactly where they are right now — do not re-derive this

Verified 2026-08-22. Take it as given and spend your effort elsewhere.

**Done:**
- All ten build, and all ten have passing unit suites (counts above) plus a Playwright
  e2e suite (`e2e/a11y.spec.ts` axe WCAG 2.1 AA gate + `e2e/claims.spec.ts` claims suite).
- All ten have clean working trees, are in sync with `origin/main`, and their live Pages
  site is built from the sha on `main` (`node tools/deploy-sync.js check` — 189/189 current).
- All ten pin exactly one theme with no toggle (`node tools/theme-sync.js check`).
- All ten carry the required dependency automation: grouped dependabot
  (`npm-minor-and-patch`), `dependabot/fetch-metadata` auto-merge, a `pull_request` CI gate,
  and `workflow_dispatch` on the deploy.

**Not done — and deliberately so:**
- **None of the ten is carded in the catalog yet.** `index.html` has no card, no
  `TITLE_TO_SECTION` entry, no `concept-coverage.md` citation, no `corpus.json` entry for
  any of them. Carding is the step after this evaluation, and your findings are meant to
  shape it.

**Known outstanding work, already decided — read `TASKS.md` §16 in the catalog repo
(`### 16. Reshape three of the ten new demos before carding them`) before you start.** It
records three specific reshapes found by comparing the briefs against the existing
179-card catalog, and you should evaluate *against those decisions* rather than
rediscovering them:
- **Masked Core** — its acts 1–2 duplicate `power-trace`'s Exhibit 6 (a countermeasure
  selector already running first-order CPA including a masking branch). The lab should
  collapse those into a recap and lead on the **second-order** attack that power-trace
  explicitly names as out of scope, plus the frozen-mask randomness failure.
- **Polynomial Forge** — its trusted-setup/toxic-waste act is already carded on SNARK
  Arena, and FRI on STARK Tower. It should lead on the **degree-bound omission attack**.
- **Feistel Forge** — the thesis holds (Feistel *ciphers* appear on World Ciphers and
  Bcrypt Forge; the Feistel *construction* is taught nowhere), but it needs cross-links to
  both, and the LIONESS link that Sphinx Mix's brief asked for.

Also recorded there: **Rekey Relay and Attribute Gate are a duplicate-risk pair** — same
curve, same catalog section, same escrow subplot, mirror-image collusion climaxes. And
**none of the ten closes a coverage gap** — `concept-coverage.md` v7 says "Empty. There
are no open gaps." All ten are *depth*, not *completion*.

---

## What "gold standard" means here — read the actual standard

The fleet's build/teach/look/a11y contract is
**`/Users/gmcas/repos/crypto-lab/audits/_MASTER-TEMPLATE.md`** (691 lines). Read it. The
sections that matter most for this evaluation:

- **§0 Principles** — real crypto only (hand-roll the primitive that *is* the subject);
  honest scoping (what is real vs simulated, what it does NOT prove); teach the college
  baseline and reward the expert without ever dumbing down the math.
- **§2 Teach — the pedagogy standard.** Six lenses: narrative clarity, intuition via
  interaction, progressive disclosure, visualization quality, newcomer accessibility,
  teaching honesty. **The named recurring failure across this fleet is "tell, not show."**
  Its prescribed fixes — show the one headline mechanism rather than asserting it; let the
  learner *cause* the failure against real crypto; a plain-language intro before any hex;
  compute-both-sides-and-compare rather than assert; no decorative motion; never draw a
  picture that contradicts the taught property.
- **§4.1c Mutation discipline** and **§4.1d Negative claims** — a test that cannot fail is
  not a test, and every lab must test what its cryptography does *not* buy.
- **§5 README standard**, **§6 deploy**.

Two more catalog files give you the shape of the whole:
- `index.html` — the 179 existing cards. This is the single source of truth for what is
  already taught. **Check every claim of novelty against it.**
- `concept-coverage.md` — the catalog mapped onto ~40 concepts, with each concept's status
  and the rule that "a concept with one demo is covered, not thoroughly taught."

---

## The standard of evidence expected of you

This fleet has been burned repeatedly by findings that were plausible and wrong, and by
fixes that looked right and did nothing. `TASKS.md` is largely a record of that. Three
rules follow from it, and they are not optional:

1. **A green gate is not evidence.** Hours before this prompt was written, one of these ten
   (`attestation-gate`) had a red deploy from a genuine WCAG 1.4.10 reflow defect — a
   43-character base64url nonce sitting in running prose with no break opportunity, which
   set a hard 378px minimum width on the document. Its own a11y gate ran at 380px and
   **passed on macOS**, because the defect left exactly 2px of headroom and only Linux font
   metrics in CI consumed it. The gate's own oracle could not even name the culprit — every
   overflowing element sat inside a scroller, so it reported `[clipped] table`. It was
   found by *narrowing the viewport until the page stopped shrinking*, and fixed to a floor
   of none at all. **Assume the other nine may sit on the same cliff, green today by
   margin rather than by correctness.**
2. **Verify against the code, not the prose.** Card copy, README claims and in-page
   assertions are hypotheses. Read `src/` and the tests.
3. **Do not fabricate counts or fleet-wide claims.** If you say "N labs do X," you ran the
   grep. Quote it.

---

## What to produce

Write **`/Users/gmcas/repos/crypto-lab/chat.md`**. Structure it as:

**1. Verdict per lab (ten sections).** For each: what it teaches, how well it currently
teaches it against the six §2 lenses, and then the substance — **the specific, ordered
list of changes that would take it from good to the best explanation of this concept on
the public web.** Distinguish clearly between:
   - *defects* (something is wrong, dishonest, or inaccessible),
   - *gaps* (the headline mechanism is asserted rather than shown; a negative claim is
     untested; a break-it-yourself interaction is missing),
   - *ambitions* (what a genuinely definitive treatment of this concept would add).

Be concrete. "Improve the visualization" is worthless. "The KZG opening is printed as a
G1 point in hex; the mechanism it exists to teach — that a single group element proves an
evaluation the verifier never computed — is never shown, and could be by animating the
pairing check's two sides converging" is the register.

**2. The cross-cutting findings.** Patterns that appear in more than one of the ten — a
shared component that teaches badly, a claim style, a repeated a11y shape, the reflow
cliff above. These are worth more than the per-lab lists, because they are what the
eleventh lab will inherit.

**3. Ranked effort.** A single table: change, which labs it touches, rough size, and what
it buys pedagogically. Ordered by value per unit of work, so the list can be worked
top-down.

**4. What you could not check, and why.** Explicitly. An honest gap here is worth more
than a confident guess.

Do not edit any lab. Do not commit anything. `chat.md` is the deliverable.
