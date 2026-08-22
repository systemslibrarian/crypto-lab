# Kickoff prompt — starting a coding agent inside a new lab repo

Paste the block below into a fresh agent session **in the lab repo itself**. It is
identical for every lab: it reads the repo name from the working directory and the
demo brief from `./brief.md`, so nothing needs editing per repo.

It assumes two files are already in the repo:

- `./brief.md` — the filled demo brief (see `_MASTER-TEMPLATE.md` §"Step 1"). Name it exactly
  that: in the 2026-08-22 batch three arrived as `bief.md`, `brief` and `brief`, while the
  prompt says to read `./brief.md`.
- `./CRYPTO-LAB-TEMPLATE.md` — a **local, gitignored** copy of `_MASTER-TEMPLATE.md`

On that second file: it is deliberately untracked. A committed copy of the template
inside a lab repo ages silently and becomes a second, wrong standard — see
`per-repo-audits-2026-07/README.md`, and note that a stale copy claiming to be "the
single source of truth" was deleted from the catalog root on 2026-08-20 carrying no
dependency automation and three outdated action pins. Place it with:

```sh
cp crypto-lab/audits/_MASTER-TEMPLATE.md <lab>/CRYPTO-LAB-TEMPLATE.md
printf '\nCRYPTO-LAB-TEMPLATE*.md\n' >> <lab>/.gitignore
```

If the agent can read `../crypto-lab/audits/_MASTER-TEMPLATE.md` directly, prefer that
and skip the copy entirely — one fewer thing to go stale.

---

## The prompt

```
Build this Crypto Lab demo (Vite + TypeScript, static site, no backend).

Read ./CRYPTO-LAB-TEMPLATE.md in this repo IN FULL and treat it as the BINDING spec.
Read ./brief.md — that is this demo's brief; do not ask me to paste one.
The repo name is this directory's name; use it verbatim for vite's `base` and every URL.

Build to every standard in the template, in this order:

  1. §1 Build — real crypto only (WebCrypto, or a named and justified library; hand-roll
     the inspectable teaching parts; NEVER simulate or fake math). Runnable tests that
     actually pass, including spec KATs — state the count. Mount at id="app"; define
     --accent on :root.
  2. §3 Look — copy the top bar from an existing sibling lab (e.g. ../crypto-lab-ascon)
     and adapt it; standardized hero; theme contract; scripture footer; head/favicon.
     Do NOT invent a header design and do NOT add a theme toggle.
  3. §2 Teach — SHOW the one headline mechanism, never assert it in prose or raw hex.
     Plain-language intro plus a break-it-yourself interaction against the real crypto.
  4. §4 Accessibility — wire the WCAG 2.1 AA gate and author to its checklist.
     `npm run build` then `npm run test:a11y` MUST pass with zero violations.
  5. §5 README, §6 Deploy.
  6. §6.1 + §6.2 Dependency automation — REQUIRED. Grouped .github/dependabot.yml, the
     dependabot-auto-merge job on whichever workflow gates pull_request, and that job
     must dispatch the deploy after merging. The workflow needs `pull_request` and
     `workflow_dispatch` triggers; the deploy job gated to
     `github.event_name != 'pull_request'`; concurrency including ${{ github.ref }}; and
     the auto-merge job needs `actions: write` alongside contents/pull-requests.

Hard rules:
- Do NOT dumb down the crypto to make a visual simpler.
- Honest scoping in-page and in the README: what is real vs simulated, what it does NOT
  prove, "not production crypto".
- Do NOT weaken a gate to get green — no skipped tests, no lowered coverage threshold, no
  disabled lint rule, no re-recorded a11y baseline, no continue-on-error. If something
  cannot pass honestly, leave it failing and tell me why.
- Playwright: `npx playwright install chromium` — NEVER `--with-deps`. That apt step
  wedged 547 CI runs across this fleet.
- Do NOT touch ../crypto-lab (the catalog). Other agents may be working in parallel and
  would collide on index.html. Instead, END YOUR RUN by printing the catalog data:
  card title, kicker, one-sentence copy (<36 words), exactly 4 chips, data-category,
  TITLE_TO_SECTION id, whether it belongs in FOUNDATIONS_TITLES or REAL_WORLD_TITLES,
  a suggested --accent hex, and which numbered concept in ../crypto-lab/concept-coverage.md
  it belongs under. The cards get added to the catalog in one pass afterwards.
- CRYPTO-LAB-TEMPLATE.md is a local, gitignored working copy. Do not commit it, and do not
  edit it — if it disagrees with ../crypto-lab/audits/_MASTER-TEMPLATE.md, that one wins.
- Your brief may specify supporting files that are NOT conventions in this fleet. Before
  creating any new top-level file, verify it exists elsewhere. CLAIMS.yaml, PRIOR-ART.md,
  THREAT-MODEL.md, MATH.md and verify.py appeared in ZERO of the ~180 labs and nowhere in the
  template when this was last checked (2026-08-22) — re-check rather than trusting the count. Do not invent a format — land the brief's substance in the structures
  that already exist:
    NEG-n / negative claims -> assertions in e2e/claims.spec.ts (§4.1b, REQUIRED)
    failure codes           -> exported constants surfaced in the UI, each wired to a
                               claims-suite assertion. §4.1b already requires covering every
                               failure path and that the page names the actual cause.
    THREAT-MODEL.md         -> README "What Can Go Wrong" (§5)
    PRIOR-ART.md            -> README "What It Is" + "Related Demos" (§5)
    MATH.md                 -> README "What It Is", or an in-page progressive-disclosure
                               panel where the derivation is genuinely long
    verify.py               -> a vitest test. This fleet is TypeScript.
    "Full lab depth"        -> progressive disclosure inside the page, not a mode to gate
                               content behind
  The brief's substance wins; its file layout does not. If something truly has no home, say
  so in your final report rather than creating a file only your lab has.

When done: one-line summary with the test count, confirmation that grouping / auto-merge /
PR gate / workflow_dispatch are all present, and the catalog data block.
```

---

## Why each of the non-obvious lines is there

Every one of these was paid for once already.

- **`actions: write`** — a job-level `permissions:` block *replaces* the default scopes
  rather than adding to them. Without it the post-merge deploy dispatch returns HTTP 403
  "Resource not accessible by integration", and because that call ends in
  `|| echo "::warning::"` the job still goes green while the site never rebuilds. Nine
  labs were found drifting this way on 2026-08-20.
- **`!= 'pull_request'`, not `== 'push'`** — the `== 'push'` form also skips
  `workflow_dispatch`, which is the one trigger the post-merge deploy relies on. A
  dispatched run then builds, passes the whole gate, and skips the deploy job.
- **concurrency including `${{ github.ref }}`** — a bare `pages` group with
  `cancel-in-progress` lets a pull-request run cancel a live deploy of main.
- **Never `--with-deps`** — that apt step wedged 547 CI runs in one afternoon.
- **Do not touch the catalog** — `index.html`, `concept-coverage.md` and `corpus.json`
  are shared; parallel agents collide on them. Collect card data, apply once.
- **Supporting files the brief names may not exist** — on 2026-08-22 every one of ten briefs
  in a new batch was written in a house vocabulary (`CLAIMS.yaml`, `PRIOR-ART.md`,
  `THREAT-MODEL.md`, `MATH.md`, `verify.py`, "Full lab depth", "NEG-1") that appeared in none
  of the ~180 labs and nowhere in `_MASTER-TEMPLATE.md`. Ten agents were each about to invent
  an incompatible format for the same six things. The briefs were not wrong to want them —
  they are more rigorous than the template on substance — but a convention that lives in one
  lab is drift, not a convention. The mapping in the prompt keeps the rigour and drops the
  divergence.
- **Never weaken a gate** — these labs teach that a claim is measured. A faked green
  corrupts the thing the lab exists to demonstrate. A failing bump left honestly failing
  is a good outcome.

## After the labs are built

Add all the cards in one pass, then from `crypto-lab/`:

```sh
node tools/readme-sync.js          # regenerate the README tables
node tools/readme-sync.js check
node tools/corpus-sync.js check    # ../crypto-counsel/corpus.json parity
node tools/concept-sync.js check   # concept-coverage.md parity
node tools/theme-sync.js check     # one pinned theme per lab, no toggles
node tools/deploy-sync.js check    # each live site built from the sha on its main
```

Note what the first four cannot tell you: they verify consistency *among carded demos*,
so a lab with no card is invisible to all of them. On 2026-08-20 four live labs were
missing from the catalog while every one of those checkers reported clean. `deploy-sync`
is the only one that needs the network, and the only one that compares the catalog to
reality rather than to itself.
