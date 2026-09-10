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

Eight more checkers guard the sibling demo repos, and the fleet itself, rather than
a file derived from `index.html`:

| Invariant | Checker |
|---|---|
| every lab pins exactly one theme, and none ships a toggle | `node tools/theme-sync.js check` |
| every lab's live site is built from the sha on its `main` | `node tools/deploy-sync.js check` |
| every lab that exists on GitHub has a card here | `node tools/fleet-sync.js check` |
| the gate a Dependabot bump merges against is the gate the deploy runs | `node tools/gate-sync.js check` |
| once a bump has merged itself, the deploy dispatch cannot be skipped in silence | `node tools/dispatch-sync.js check` |
| the paragraph saying why that dispatch exists is one text fleet-wide | `node tools/dispatch-comment-sync.js check` |
| every clause of that paragraph is still TRUE of the fleet it is written into | `node tools/dispatch-claims.js check` |
| every lab that owes a dispatch is still present, and still classifiable | `node tools/dispatch-census.js check` |

The last two are also folded into `dispatch-sync check`, so the fast loop does not
grow a command. Run them directly when the answer matters on its own — after editing
`CANONICAL`, or after cloning or removing a lab.

`deploy-sync` and `fleet-sync` are the two checkers here that need the network and
`gh`; each takes about 30 seconds for the whole fleet, so neither is part of the
fast loop. **Run them after any cross-repo pass, after anything that touches a
workflow, and after building a lab.**

`fleet-sync` exists because every other checker in this repo compares the catalog
to something derived FROM the catalog. `readme-sync`, `corpus-sync` and
`concept-sync` all read the cards, so a lab with no card is missing from all three
*consistently* and every one of them stays green — the catalog cannot notice a demo
it was never told about. On 2026-09-09 four labs were live with no card, no corpus
entry and no concept-coverage line: `lattice-builder` (live since 2026-08-25),
`covert-channel-studio` (2026-09-06), `ggh-trapdoor` and `factor-forge`. Every
checker was green throughout, and `concept-coverage.md` — the file whose entire job
is answering "is anything missing?" — was answering it wrongly. `fleet-sync` asks
GitHub instead, and it also reports labs with no repo description, which drift the
same silent way.

It treats a repo as a demo when its default branch has an `index.html` anywhere in
the tree (the root in most labs, `demos/<slug>/index.html` in the older ones), which
is what exempts `crypto-lab-blind-oracle-api` — a headless Rust backend, not a
browser demo — without a hand-maintained list. **It currently reports one open item:
`crypto-lab-ghost-commit` is live and has never been carded, in any pass. That is a
scope decision, not an oversight to sweep in.**

`deploy-sync` exists because this fleet's real failure mode is not a file disagreeing
with another file — it is `main` disagreeing with what is actually served, and that
never turns anything red. On 2026-08-20 nine labs were serving a build older than
their `main` with every checker green. Four separate bugs produced that, each
invisible: a merge made with `GITHUB_TOKEN` raises no push event so `deploy.yml`
never ran; the explicit dispatch that fixed it lacked `actions: write` and 403'd
into a `|| echo "::warning::"`; the deploy job was gated `== 'push'` which also
skips `workflow_dispatch`; and in labs where build and deploy are one job, gating
that job off for pull requests silently disabled the gate itself. A run that is
`cancelled`, or `success` with its deploy job `skipped`, does not count as shipped
— those are precisely the shapes that hid all four.

`gate-sync` asks `deploy-sync`'s question one step earlier: not whether the live site
matches `main`, but whether anything could land on `main` that `main`'s own deploy
would refuse to ship. A lab can be perfectly current today and still be shaped so the
next grouped bump stops it shipping. The shape is auto-merge in one workflow and the
Pages deploy in another, where only the deploy's workflow runs the browser gate — so
a bump clears the lighter of the two, merges itself, and the heavier one fails
afterwards on the merge commit, where no pull request is watching. `crypto-lab-e91`
drifted exactly that way and was found stale on 2026-09-08; nineteen labs had the
same shape. It also catches the four silent non-deploys `deploy-sync` can only see
after the fact — `== 'push'` gating, a fused build-and-deploy gated off for pull
requests, a dispatch that 403s without `actions: write`, and a `gh workflow run`
naming a file this repo does not have. **The contract it encodes is
`audits/_MASTER-TEMPLATE.md` §6.1–6.2, not this file**; the fix is always one
workflow with one gate job that both `deploy` and `dependabot-auto-merge` name in
`needs:`, since `needs:` cannot cross files.

It is local-only and fast, so unlike `deploy-sync` and `fleet-sync` it belongs in the
fast loop. It reads workflows structurally rather than by grep, because 178 files in
this fleet carry the comment *"without it gh workflow run 403s"* and grep finds a
dispatch in repos whose only dispatch is a sentence about one. A workflow it cannot
parse is reported as **unparsed and fails** — never skipped, because a checker that
cannot read a file must not call it clean. Failures are the invariant itself and
anything that has already disabled a gate; warnings are shapes that still ship today
but are one edit from failing (two equal gates in separate files, an unscoped
`cancel-in-progress` group on a workflow that has no `pull_request` trigger *yet*).

**It finds a lab's deploy job by the publisher action that job uses**, and until
2026-09-10 the only publisher it knew was the literal `actions/deploy-pages`.
`crypto-lab-dilithium-reject` and `crypto-lab-elgamal-plain` publish with
`peaceiris/actions-gh-pages@v4`, so they had no deploy job as far as the checker was
concerned — not exempt from one rule, invisible to all of them, counted in the
placid-looking *"3 with no Pages deploy"* line. Behind that skip both were already
broken: each auto-merges with `gh pr merge --squash` and dispatches nothing, so the
`GITHUB_TOKEN` merge raises no push event and `on: push` never fires, and each still
carries the `actions: write   # required by the deploy dispatch` comment naming a
dispatch that was never written. Making them visible moved the fleet from 193 judged
labs / 15 failing to 195 / 17, with no other lab's output changing by a byte.

The publisher set is now `PAGES_PUBLISHERS` in that file. Only two of its five
entries are in use here — `actions/deploy-pages` in 193 workflow files,
`peaceiris/actions-gh-pages` in two, surveyed across all 248 on 2026-09-10; the other
three are there so a lab adopting one gets judged rather than skipped. A publisher
outside that set is still not recognised, so one further rule closes the loop:
**DEPLOY-UNRECOGNISED** fails a lab that auto-merges, has no publisher the checker
knows, *and* whose repo slug a card in `index.html` links to as a live github.io page
— the card being the evidence that a deploy exists to be judged. It is keyed on the
card because a lab genuinely can publish nothing: `crypto-lab-blind-oracle-api` is a
Rust service with no page and no card, and remains a fair skip. The rule matches no
lab today; it exists so the next new publisher cannot arrive unseen. The skipped labs
are now listed by name too — the bare count is what hid these two.

`dispatch-sync` asks the one question `gate-sync` cannot reach: not whether the
gate is wired right, but whether — once a bump **has** merged itself — the
`gh workflow run` that ships it can fail without saying so. The construct it exists
to end asked the API a second time (`gh pr view "$PR_URL" ... | grep -q MERGED`)
about a merge that had already happened in the previous step. Any failure of that
question — a rate limit, a 5xx, a token that lost scope, the PR object not yet
consistent — produces no output, `grep -q` matches nothing, the `if` takes the else
branch, and the step exits 0 having printed **nothing**: not even the
`|| echo "::warning::"`, because the `gh workflow run` it guards was never reached.
Adding `shell: bash` does not fix it and is worse than doing nothing because it
looks like one — inside an `if` condition a failing pipeline takes the else branch
with or without `pipefail`, and `set -e` is exempt there by POSIX. Measured a no-op
in 183 of 183 steps. The fix is to stop asking: the merge command's own exit status
sets a shell flag and the dispatch reads the flag.

It asserts that **shape**, never a literal, because the labs that shipped the idiom
first each wrote it differently and all of them are correct. Local-only and fast, so
it belongs in the fast loop.

`dispatch-comment-sync` owns the one thing `dispatch-sync` deliberately cannot
judge: the paragraph above that dispatch explaining why the line is there. It is the
only thing in the file that answers *"why dispatch, when there is an `on: push`
deploy right above?"* — and the answer is that a `GITHUB_TOKEN` merge raises no push
event, so that dispatch is the only thing that ships the bump. Deleting the
paragraph and deleting the line it defends are the same edit six months apart. On
2026-09-10 the fleet carried **36 wordings** of it; that was not agent drift, it
pre-dated the auto-merge rewrite and had accumulated over months of one-lab-at-a-time
edits, with nothing comparing any copy to any other. The generator now writes one
canonical text into all 195 sites and `check` fails on any that differs, so the next
variant turns something red instead of waiting to be noticed.

It reads **two shapes**, because the fleet has two: 194 labs put the dispatch inside
the merge step's own run script with the rationale directly above that line, and
`crypto-lab-attribute-gate` uses the cross-step shape `dispatch-sync` also accepts —
flag exported to `$GITHUB_ENV`, a separate step guarding on `if: env.merged` with a
one-line `run:` — where the rationale sits above that step's `- name:`, outside any
block scalar. Reading only the first shape covered 194 of 195 and said nothing about
the 195th. It also matches the dispatch **as a command, never as text**: 178 files in
this fleet carry `actions: write   # … without it gh workflow run 403s`, and a loose
match finds that line first, in the permissions block, far above the real dispatch.

It normalises **one paragraph** and nothing else. Per-repo comment paragraphs are
preserved verbatim — the dispatch-filename note (the fleet dispatches `deploy.yml`,
`pages.yml`, `deploy-pages.yml` *and* `ci.yml`, so that note is true of one repo and
false of the next) and the flag-mechanism note six labs carry above the rationale. A
comment block where zero or two paragraphs make the no-push-event argument is
**refused, not guessed at**, and still fails `check`. So is a block whose closing
claim is buried mid-line with prose after it, because the split that keeps that prose
is line-granular and would otherwise drop it. An absent block **fails and is
restored**: treating absence as clean would make the checker silent about exactly
the state that precedes the failure. After the first pass 36 distinct blocks became
**19** — one shared by 171 labs, one by the six that also explain the flag, one by
two labs, and 16 one-offs. All 19 contain the identical canonical paragraph; the
residue is entirely per-repo paragraphs kept on purpose. No executable line changed:
the 13 distinct executable bodies hash identically before and after.

**One wording fleet-wide is a bigger lever than 36 wrong ones, and it needed a
second guard.** Normalising that paragraph traded 36 small wrongnesses for one
wording with a 195-repo blast radius, and nothing bound the wording to the facts it
asserts. On 2026-09-10 an audit inverted its load-bearing clause — *"a
workflow_dispatch through the API is not suppressed"* → *"is suppressed too"*, which
is false and destroys the reasoning the whole mechanism rests on — and watched what
happened: `dispatch-proof.js` printed **"37 passed, 0 failed", exit 0**.
`dispatch-sync check` went red, but only because the 195 repos still held the OLD
text, and its remedy line said `Fix with: node tools/dispatch-comment-sync.js`.
Following that instruction writes the false sentence into ~195 repos, after which
every gate is green and the fleet documents the opposite of how it works.

`dispatch-claims.js` closes that. It reads `CANONICAL`, extracts each factual clause
as a **proposition with a polarity**, re-derives the same proposition from the
fleet's own YAML, and fails when the two disagree. The distinction that matters: it
fails on a clause that becomes **false**, not one that changes **wording**. Reword
*"is not suppressed"* to *"is honoured"* and it stays green; invert it and it fails,
naming the clause and the evidence against it. A check that pinned the literal would
be the frozen-prose failure one layer up — it would force the sentence to stay the
same rather than stay true. It is deliberately honest about its own reach: whether
GitHub really suppresses the push event of a `GITHUB_TOKEN` merge is platform
behaviour, is **not** derivable from this fleet, and is printed as UNBOUND on every
run rather than counted as checked. What *is* derived for that clause is its
corollary — that no dispatch target has another trigger that would ship the merge
anyway — and its polarity, by coherence with that derivation.

The gate re-derivation behind *"the same gate-then-deploy pipeline"* **follows
reusable-workflow calls**. `crypto-lab-pake-gate`'s deploy job needs `build`, and
`build` is nothing but `uses: ./.github/workflows/browser-gate.yml`; a walk that
stopped at the calling job would find no commands there, call that lab ungated, and
report a **true** sentence false — inviting someone to "fix" it. 195/195 targets gate
before they publish: 186 through `needs:`, 8 by fused step order, 1 through that
reusable call.

The writer is guarded at the point of use as well: `node tools/dispatch-comment-sync.js`
now **refuses to write** while any clause is false, and its remedy line in
`dispatch-sync` says what the writer *does* — propagates `CANONICAL` into ~195 repos —
because a bare "fix with" is the exact place the false-sentence path is entered.

**A lab can also leave in silence, and that is the same defect one layer down.**
Every count these checkers print is a count of labs they managed to **recognise**.
An adversarial audit found three ways a lab drops out with exit 0: the auto-merge
merging with `gh api -X PUT repos/.../merge` instead of `gh pr merge` (the job stops
being an auto-merge job); the workflow's job map indented **four** spaces — valid
YAML, jobs intact, GitHub runs it, and `jobBlocks` requires exactly two; and the
`gh workflow run` line deleted while the paragraph defending it stays, taking the
site count 195 → 194. This is the third instance of one defect in this fleet — a
checker that cannot see, reporting clean. `gate-sync` missed `peaceiris` publishers;
`gate-sync` never opened uncloned labs; now this. The shared shape is a denominator
that is **discovered** rather than declared.

`tools/dispatch-census.json` declares it: every lab, and what each one owes. A lab
that stops matching its pinned row is a NAMED failure — `MISSING-JOB`,
`MISSING-SITE`, `NOT-CLONED`, `UNPINNED-LAB`, `COUNT` — and a lab holding a
Dependabot merge the checker cannot judge is `UNRECOGNISED`, by kind
(`MERGE-NOT-RECOGNISED`, `JOB-MAP-UNREADABLE`, `RATIONALE-WITHOUT-DISPATCH`). **A
drop in the denominator is now as loud as a drift in the numerator.** Adding or
removing a lab therefore requires re-pinning: `node tools/dispatch-census.js write`,
then read the diff — that file is the only thing that remembers a lab used to be
here.

Three more files under `tools/` are not checkers and are not run in the loop:

| File | What it is |
|---|---|
| `tools/transform.mjs` | the rewriter that moved ~179 labs onto the flag idiom. Kept because it is the only precise statement of what was done to them. It **refuses rather than guesses** on any job that does not match the old construct exactly. |
| `tools/dispatch-proof.js` | the evidence for both of the above, re-runnable: the validator passes the nine reference labs, fails the old construct, the transform turns one into the other and is idempotent, the injected `gh pr view` fault ships nothing under the old shape and ships under the new, the paragraph's claims are re-derived over all 195 live dispatch sites (A5) and **bound to that derivation clause by clause** (A7), and the permanent mutation set is replayed (M). 65 checks. |
| `tools/dispatch-mutations.js` | the permanent mutation set, replayed on every proof run. Eight edits that MUST be caught and named: three that make a clause of `CANONICAL` false, three that make a lab vanish from the checkers, **M7, a rewording that stays true and must stay green** — the control that stops the clause binding from degenerating into a wording pin — and **M8, the derivation itself going blind**, because every clause is supported by the *absence* of counter-evidence and a walk that saw nothing would report all three true over nothing. Fixtures live in `tools/fixtures/dispatch/mutations/`. Each mutation also asserts the unmutated baseline is clean, so a mutation that fails on both sides is reported as proving nothing rather than counted. |

`transform.mjs` and `dispatch-comment-sync.js` had a real conflict, and the split is
worth knowing: **transform.mjs owns the executable lines and each repo's own
specifics** (dispatch filename, `|| echo` suffix, retry count, `env:`, indentation);
**dispatch-comment-sync.js owns the rationale paragraph's text.** transform.mjs used
to re-home every comment line verbatim, the rationale included, which would
re-scatter on the next repo it touched exactly what the normaliser had just unified —
arriving as drift that looked like a legitimate transform. It now calls
`normaliseBlock()` from dispatch-comment-sync for that block, so the two emit the
paragraph from one definition and cannot disagree. `dispatch-proof.js` A3b fails if
that narrowing is ever undone.

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

Those greps only prove the pieces are present, not that they are wired to each other, so
finish with `node tools/gate-sync.js` and confirm the new lab is not named in the report.

A newly cloned lab also has to be **pinned**, or `dispatch-sync check` fails it as
`UNPINNED-LAB` — deliberately, because the same silence that hides a new lab hides a
departed one. Run `node tools/dispatch-census.js write` and read the diff: one added row
is right, a removed row is a lab that stopped being seen.
Grep says `workflow_dispatch` is somewhere in the repo; `gate-sync` says the auto-merge
actually dispatches a file that exists, with the permission to do it, after clearing the
same gate the deploy depends on. **Read the report rather than the exit code while the
fleet-wide fix is still landing** — `check` exits 1 on any lab, not just yours.

Then `node tools/dispatch-sync.js check`, which judges the auto-merge step from the
inside: the new lab must set a flag from the merge's own exit status and read it
before dispatching, never re-query with `gh pr view`. That run also reports whether
the new lab's dispatch carries the canonical rationale paragraph; if it does not,
`node tools/dispatch-comment-sync.js` writes it. Copy the merge step from
`crypto-lab-attestation-gate` and change only the dispatched filename to the one the
new lab actually has.

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
