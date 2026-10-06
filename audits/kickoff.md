# Kickoff prompt — starting a coding agent inside a new lab repo

Paste the block below into a fresh agent session **in the lab repo itself**. It is
identical for every lab: it works out the repo name from the git remote and finds the
demo brief in the repo, so nothing needs editing per repo.

**It is the whole prompt.** If you find yourself hand-writing one beside this file,
that is a defect in this file — fix it here instead, so the next window inherits the
fix. The last time a prompt was written by hand (2026-10-06, `crypto-lab-wep-crack`)
roughly half of what it said was missing here: the §4.1a–c mechanics, the port rule,
the served-bytes proof and the merge step to copy, while this file was still telling
the agent to pick a card accent.

It assumes two things are in the repo:

- **the filled demo brief** (see `_MASTER-TEMPLATE.md` §"Step 1"). `brief.md` is the
  name to use. **The prompt no longer depends on it**, because insisting has not
  worked: in the 2026-08-22 batch three arrived as `bief.md`, `brief` and `brief`, and
  on 2026-10-06 one arrived as `crypto-lab-wep-crack-revised-brief.md`. The prompt
  resolves the brief and says which file it read, which is cheaper than four more
  rounds of renaming.
- `./CRYPTO-LAB-TEMPLATE.md` — a **local, gitignored** copy of `_MASTER-TEMPLATE.md`,
  and only if the catalog is not cloned beside the lab.

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

WHAT YOU ARE. This window is a new lab repo. Get its slug from `git remote -v` and
use that verbatim for vite's `base` and every URL you emit.

TWO SPECS, AND WHICH WINS.
- WHAT to build: the demo brief in this repo. It should be `./brief.md`; if it is
  not, find it (a markdown file naming this lab and its panels) and SAY WHICH FILE
  YOU READ in your first report. If there is more than one candidate, or none, stop
  and ask rather than picking.
- HOW to build it: `../crypto-lab/audits/_MASTER-TEMPLATE.md` if the catalog is
  cloned beside you, else `./CRYPTO-LAB-TEMPLATE.md`. If neither exists, STOP and
  say so — do not build to a remembered standard.
Read both in full before writing code. Where they conflict on structure, the
template wins and you say so. Where the brief is stricter on substance, the brief
wins. Report a material conflict rather than quietly weakening either.

FIRST, THE OVERLAP CHECK, and do it from SOURCE. If the brief names neighbouring
labs, open their actual files in ../crypto-lab-<slug>/ and record the commit you
read each at. A chip or a card description is discovery evidence, never proof that
a lab does or does not implement something. If a neighbour already runs this
experiment, say so and stop before building a duplicate.

BUILD ORDER

  1. §1 Build — real crypto only: WebCrypto, or a named and justified library;
     hand-roll the part the lab exists to teach, so a reader can open the file.
     Never simulate or fake maths. Runnable tests that pass, including published
     vectors — state the count and where each vector came from. Mount at id="app".
  2. §3 Look — copy the top bar from a sibling lab (e.g. ../crypto-lab-ascon) and
     adapt it; the standardized hero; the theme contract; scripture footer;
     head/favicon. Do NOT invent a header and do NOT add a theme toggle. Pin dark
     with a literal on <html data-theme>, before first paint, reading no stored
     preference.
  3. §2 Teach — SHOW the one headline mechanism; never assert it in prose or raw
     hex. Plain-language intro, then a break-it-yourself interaction against the
     real crypto. Progressive disclosure, not a second mode.
  4. §4 Accessibility — wire the WCAG 2.1 AA gate and author to its checklist.
     `npm run build` then `npm run test:a11y` MUST pass with zero violations.
     Check 1.4.10 reflow at 320px, 1.4.11 non-text contrast at 3:1 on every
     control boundary (use the --control-border token, not --border — a 1.78:1
     button border is the failure this keeps producing), 2.4.4 link purpose, and
     2.5.3 Label in Name.
  5. §4.1a-d, all four, each named in your report:
     - §4.1a: e2e/gate.ts asserts STRUCTURE only — the controls exist, the first
       branch is the one that ships, nothing is [hidden] that should be visible.
       No product copy in a setup helper: an assertion there fails every test that
       imports it, under a name that has nothing to do with what changed.
     - §4.1b: e2e/claims.spec.ts asserts every claim the page DISPLAYS, each
       against a computed expression rather than a sentence someone typed.
     - §4.1c: one mutation per rendered verdict. For each, in this order, and
       report all five: the baseline passes; the source diff is NON-EMPTY; the
       built bundle hash MOVED; a NAMED test goes red; the file is restored and
       green again. Run the suite with --retries=0 while mutating — a retry that
       dies of ERR_CONNECTION_REFUSED produces mixed output that proves nothing.
       A mutation that silently did not apply looks exactly like one nothing
       caught, and no test report can tell you which you have.
     - §4.1d: state the lab's negative claim in the page and assert it — what a
       passing check does NOT establish.
  6. §5 README, §6 Deploy (Actions-based Pages, a11y-gated).
  7. §6.1 + §6.2 Dependency automation — REQUIRED. Grouped
     .github/dependabot.yml; the dependabot-auto-merge job on whichever workflow
     gates pull_request; that job dispatches the deploy after it merges. Triggers
     `pull_request` AND `workflow_dispatch`; the deploy job gated
     `github.event_name != 'pull_request'`; concurrency including
     ${{ github.ref }}; `actions: write` on the auto-merge job alongside
     contents/pull-requests.
     Copy the merge step from ../crypto-lab-attestation-gate and change ONLY the
     dispatched filename: the flag comes from the merge command's own exit status
     and the dispatch reads the flag. Never re-ask with `gh pr view` — that
     construct is a measured no-op in 183 of 183 steps in this fleet.

HARD RULES

- Do NOT dumb down the crypto to make a visual simpler.
- Verify every citation against its PRIMARY source before you write it. Cite the
  RFC or FIPS section for the SCHEME and the actual publication for the NUMBERS;
  if a document publishes no test data, do not credit it with yours, and add a
  test that asserts the attribution cannot drift.
- Honest scoping in-page and in the README: what is real, what is modelled, what
  it does NOT prove, "not production crypto".
- A probabilistic result from a paper is reproduced as one — never as a guarantee
  and never as a browser benchmark.
- Never weaken a gate to get green — no skipped tests, no lowered coverage
  threshold, no disabled lint rule, no re-recorded a11y baseline, no
  continue-on-error. If something cannot pass honestly, leave it failing and tell
  me why.
- Playwright: `npx playwright install chromium` — NEVER `--with-deps`. That apt
  step wedged 547 CI runs across this fleet. Serve on your OWN port with
  `--strictPort`, and take that port from `node ../crypto-lab/tools/port-sync.js`
  — do NOT take 4173 from the template's sample config: 36 labs already share it,
  and `reuseExistingServer` means a run that finds something listening USES it, so
  a shared port can pass a mutation check against an unmutated server still
  running from a previous run.
- The chip rule. A chip is the card's claim about its own stack and has no verb to
  qualify it, so chip plainly only what you implement. Anything you TARGET but do
  not build is MARKED instead — `vs. <thing>` names a target, `Toy-Scale Only` and
  `Modelled Decode Time` name a fidelity. Anything the brief puts out of scope
  must not appear as a chip at all; name it as a future extension in prose.
- Say nothing about the catalog as a whole — no counts, no "the only lab that…",
  no "every other lab…". Scope every sentence to this lab.
- Define `--accent` on :root — a lab with none paints the fleet top bar teal
  whatever its card says — and derive `--accent-ink` and `--accent-text` FROM it
  rather than copying them from another lab. The a11y gate measures contrast and
  not hue, so a crimson accent with a teal `--accent-text` passes the gate and
  looks broken, which is exactly what shipped in one lab for two days. Then treat
  your accent, your favicon and your category as PROVISIONAL: all three are
  assigned centrally by measuring the RENDERED catalog grid. Flag them in the
  handoff and do not add a card anywhere.
- Do NOT touch ../crypto-lab or ../crypto-counsel. Other windows edit index.html
  and corpus.json and would collide. No card, no corpus entry, no
  concept-coverage line — those land in one pass afterwards, from the handoff you
  print at the end.
- Your brief may name supporting files that are NOT conventions in this fleet.
  Before creating any new top-level file, verify it exists elsewhere.
  CLAIMS.yaml, PRIOR-ART.md, THREAT-MODEL.md, MATH.md and verify.py appeared in
  ZERO labs and nowhere in the template when last checked (2026-08-22) —
  re-check rather than trusting the count. Land the brief's substance in the
  structures that already exist:
    NEG-n / negative claims -> assertions in e2e/claims.spec.ts (§4.1d)
    failure codes           -> exported constants surfaced in the UI, each wired
                               to a claims-suite assertion (§4.1b already
                               requires covering every failure path, and that the
                               page names the actual cause)
    THREAT-MODEL.md         -> README "What Can Go Wrong" (§5)
    PRIOR-ART.md            -> README "What It Is" + "Related Demos" (§5)
    MATH.md                 -> README "What It Is", or an in-page
                               progressive-disclosure panel where the derivation
                               is genuinely long
    verify.py               -> a vitest test. This fleet is TypeScript.
    "Full lab depth"        -> progressive disclosure inside the page, not a mode
                               to gate content behind
  The brief's substance wins; its file layout does not. If something truly has no
  home, say so in your report rather than creating a file only your lab has.
- Commit the brief into this repo, so the spec the build was made against travels
  with it.

FINISH THE RUN

Commit, push to main, enable Pages, and then PROVE IT SHIPPED. A push is not
evidence, and a green check on the commit is not evidence either — the check that
matters may not have run:

    node ../crypto-lab/tools/deploy-sync.js check
    curl -s https://systemslibrarian.github.io/<slug>/assets/<your css> | grep -- '--accent'

Ask the served bytes for the thing you changed, not the workflow for its opinion.
If the deploy failed, read WHICH job and step failed before changing anything — a
"job was not started because it repeatedly failed to be acquired" line is a
runner-allocation failure, so re-run it and fix nothing.

THEN PRINT A CATALOG HANDOFF, as one block that can be pasted into the catalog
window:

- the brief file you read, and the repo slug
- final commit sha on main, the live Pages URL, and the served-bytes check with
  its actual output
- card title, kicker, one-sentence copy under 36 words, exactly 4 chips
- data-category, the TITLE_TO_SECTION section id, and whether it belongs in
  FOUNDATIONS_TITLES or REAL_WORLD_TITLES
- level — beginner | intermediate | advanced — with the one-line reason, judged on
  what the lab asks of a READER (beginner = no maths beyond arithmetic)
- which numbered concept in ../crypto-lab/concept-coverage.md it files under
- the Playwright port you pinned
- a source-review note for tools/catalog-reviewed.json: which files you read, the
  real call site (file:line) for every algorithm the lab implements, and any
  algorithm name that appears only in prose or a COMMENT rather than in executing
  code — say which, because that is what decides whether a chip is honest and
  whether an anchor points at work or at a dependency
- a GitHub About under 350 characters, in complete sentences, and the topics to
  set (the fleet convention is `cryptography` and `crypto-lab` plus what is
  specific to this lab)
- accent, favicon and category marked PROVISIONAL
- the overlap check result, with the commit you read each neighbouring lab at

One-line summary at the end: the test count, the §4.1c result as N of N killed,
and confirmation that grouping / auto-merge / PR gate / workflow_dispatch are all
present.
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
- **Copy the merge step, never write one** — the construct this fleet removed asked the
  API a second time (`gh pr view "$PR_URL" | grep -q MERGED`) about a merge that had
  already happened. Any failure of that question produces no output, `grep -q` matches
  nothing, the `if` takes the else branch, and the step exits 0 having printed nothing at
  all. Measured a no-op in 183 of 183 steps. `crypto-lab-attestation-gate` has the
  version that sets a flag from the merge's own exit status.
- **Never `--with-deps`** — that apt step wedged 547 CI runs in one afternoon.
- **Take the port from `port-sync`, not the template** — the template shows `4173` in
  three places and then forbids it 80 lines later, and a third sample uses `4283`, outside
  the range the rule states. Measured 2026-10-02: 36 labs are on 4173 and nine pairs share
  a port. Playwright's `reuseExistingServer` then means a §4.1c mutation check can pass
  against an **unmutated checkout still running from a previous run**, which reads as "the
  mutation was not caught" and sends someone to fix a check that works. Ask the tool.
- **The §4.1c five-step report** — a mutation that fails to apply and a mutation nothing
  catches are the same green run. The only things that separate them are outside the test
  report: a non-empty source diff and a bundle hash that moved. `--retries=0` is the other
  half, because a retry that dies of `ERR_CONNECTION_REFUSED` mixes two runs' output into
  one verdict.
- **§4.1a, structure not copy** — a shared `boot()` in `e2e/gate.ts` runs before every
  test that imports it, so one sentence asserted there fails all of them at once. On
  2026-09-26 `crypto-lab-mceliece-gate` changed a textarea's default string in the same
  commit that corrected its security claims; `gate.ts` still asserted the old sentence,
  both axe runs failed, the deploy was skipped, and **the step that went red was called
  "Accessibility gate"** while four of its six a11y tests had passed. The live site served
  the uncorrected claims for three days. A copy change must not be reported as an
  accessibility failure.
- **Prove it with the served bytes** — a lab change is not shipped until `deploy-sync`
  says the lab is current *and* the bytes carry the change. On 2026-09-30 a lane reported
  `crypto-lab-adaptor-gate` complete on 127 unit and 116 browser tests passing locally;
  the browser gate had failed on CI on that same commit and every run after it, so none of
  it was live, and the report stood for three hours.
- **Derive the accent companions, and treat the accent as provisional** — the a11y gate
  measures contrast, not hue, so it cannot see a crimson `--accent` shipped with a teal
  `--accent-text`. `crypto-lab-locks-and-keys` did exactly that, in eight places, from
  2026-10-04 until it was caught centrally. And the CARD's accent is a property of the
  GRID, judged on rendered adjacency at five widths: cards reorder into sections at
  runtime, so a colour reasoned from file order has been wrong every time it was tried.
  Same for the favicon, which only collides when you look at the fleet (🎲 already belongs
  to four labs). This file used to ask the agent for "a suggested `--accent` hex", which
  invited a choice nobody downstream could use.
- **The chip rule** — a chip has no verb, so it cannot say "an attack ON this". Marking is
  how a target or a fidelity gets named without borrowing the implementation vocabulary.
  `crypto-lab-hqc-timing` is the case to hold: entirely about HQC's decoder, implements
  neither, and under a grep it is an HQC implementation.
- **Say nothing about the catalog** — a sentence like "the only lab that…" earns an
  exception permanent protection and is the claim most likely to be inherited without
  checking. Lane 3a wrote that `sector-vault` was the only lab with
  `cancel-in-progress: false`; the value belongs to `syndrome-drain` and nineteen repos
  carry it.
- **Do not touch the catalog** — `index.html`, `concept-coverage.md` and `corpus.json`
  are shared; parallel agents collide on them, and three such collisions in eight days are
  recorded in `CLAUDE.md`. Collect handoff data, apply once.
- **Supporting files the brief names may not exist** — on 2026-08-22 every one of ten briefs
  in a new batch was written in a house vocabulary (`CLAIMS.yaml`, `PRIOR-ART.md`,
  `THREAT-MODEL.md`, `MATH.md`, `verify.py`, "Full lab depth", "NEG-1") that appeared in none
  of the ~180 labs and nowhere in `_MASTER-TEMPLATE.md`. Ten agents were each about to invent
  an incompatible format for the same six things. The briefs were not wrong to want them —
  they are more rigorous than the template on substance — but a convention that lives in one
  lab is drift, not a convention. The mapping in the prompt keeps the rigour and drops the
  divergence.
- **Resolve the brief rather than insisting on its name** — four briefs have arrived
  misnamed across two batches. A prompt that halts on the filename spends a round trip on
  something the agent can see; a prompt that reads the wrong file silently is worse. Saying
  which file it read is what makes the difference visible.
- **Never weaken a gate** — these labs teach that a claim is measured. A faked green
  corrupts the thing the lab exists to demonstrate. A failing bump left honestly failing
  is a good outcome.

## After the lab is built — the catalog pass

The handoff block above is the input to this. Run it in ONE pass per batch of labs, from a
worktree of the catalog (`git worktree add ../crypto-lab-lane-<name> -b <branch> origin/main`),
staging explicit paths:

```sh
# 1. the card, by hand, from the handoff — then the evidence, DERIVED
node tools/catalog-evidence.js write    # never hand-type a data-* evidence field
node tools/level-sync.js                # re-stamp: the writer drops data-level
node tools/lab-dates.js                 # re-stamp: and data-added / data-updated

# 2. the derived files
node tools/readme-sync.js
node tools/concept-sync.js check        # after filing the lab under its concept
node tools/catalog-sync.js check

# 3. the registries a new lab has to join
node tools/port-sync.js                 # pin its Playwright port
node tools/dispatch-census.js write     # then READ THE DIFF: one added row is right

# 4. the network ones, after a cross-repo pass
node tools/fleet-sync.js check
node tools/deploy-sync.js check
node tools/gate-sync.js check
node tools/dispatch-sync.js check
node tools/theme-sync.js check
```

**The ordering in step 1 is not cosmetic.** `catalog-evidence write` rewrites each card's
head and drops the stamped `data-level`, `data-added` and `data-updated` attributes;
running `level-sync` and `lab-dates` afterwards is what puts them back. Getting this
backwards has produced a card with triplicated attributes and a card with none.

The source-review note from the handoff goes in `tools/catalog-reviewed.json`, pinned to
the lab's commit, with `add` to move an anchor off an import line and `remove` to drop a
derived claim the lab does not actually make. `add` replaces anchors and does **not** drop
a derived attack — a note that said otherwise was published once and had to be corrected.

Note what the derived-file checkers cannot tell you: `readme-sync`, `corpus-sync`,
`concept-sync` and `catalog-sync` all verify consistency *among carded demos*, so a lab
with no card is invisible to all of them. On 2026-08-20 four live labs were missing from
the catalog while every one of those checkers reported clean. `fleet-sync` and
`deploy-sync` are the two that compare the catalog to reality rather than to itself.
