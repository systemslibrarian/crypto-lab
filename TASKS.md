# Task list — crypto-lab fleet

Durable copy of the working task list, written 2026-08-01 so an interrupted session loses
nothing. `RESUME-HERE.md` holds the fleet state and the hard-won environment facts; this
file holds the work queue. Keep both current.

Status key: `TODO` / `DOING` / `DONE` / `BLOCKED`.

---

## DONE

### 1. Triage and finish the 8 source-WIP repos — `DONE`
broken-trust, collision-vault, entropy-collapse, fhe-arena, isogeny-atlas, pq-families,
ratchet-wire, rsa-forge. All read diff-by-diff, completed, verified `test` + `build`, and
committed. Three had build failures from the same mid-edit pattern; two were missing tests
for behaviour an agent had already changed.

### 2. Verify the 4 unchecked unpushed commits — `DONE`
diffie-hellman-mitm, patron-shield, stream-ward, timing-sidechannel. All green, all
genuinely finished work, no edits needed.

---

## IN FLIGHT (3 background agents, launched 2026-08-01 ~18:00)

Results land in `audits/`. If the session died before they reported, the files either
exist or the work needs redoing — check `audits/` first.

- **Scoring + claims recovery** -> `audits/SCORECARD-2026-08-01.md` and
  `audits/FALSIFIABLE-CLAIMS.md`
- **Border contrast audit** -> `audits/BORDER-CONTRAST-STATUS.md`
- **Pre-push verification** -> `audits/PRE-PUSH-STATUS.md`

---

## TODO — ordered by what unblocks what

### 3. Preserve the gold-standard audit docs — `DONE, with a caveat`
**Reversed from its original form, which was "delete these".** They are not clutter: they
are dated per-repo audits plus a 373-line master template. All 12 are now committed at
`audits/` (commit `08da05c`). The redundant untracked originals still sit in their demo
repos — removing them was blocked by the permission classifier and was left alone
deliberately. Harmless; they are duplicated in git.

**Three files of this kind were deleted in error earlier and are unrecoverable**
(spdz-forge/chat.md 292 lines, hqc-timing/chatgpt.md 222, hqc-timing/gem.md 15). Partial
salvages with explicit loss markers sit at those paths. If the source AI conversations
still exist, re-exporting them is the cheapest repair and is worth doing before task 6
leans on that directory.

### 4. Push all verified commits to origin — `TODO`
33 repos hold 1 unpushed commit each, plus `crypto-lab` itself. Blocked on the pre-push
agent's report; do not push anything it flags. CI runs
`npm ci && typecheck && test && build && test:a11y` before Pages deploys, so a bad push
degrades to a no-op — but read the report first anyway.

Needs an explicit go-ahead: it is outward-facing, and the standing instruction has been to
review commits before they ship.

### 5. Finish the fleet-wide border-token accessibility pass — `TODO`
Last of four accessibility items. The other three are confirmed done: touch targets (170
labs), banner-landmark dedupe (170), skip-link contrast (11 real failures fixed of 113
examined; worst were `key-exchange` and `poly1305-mac` at 2.01:1 in dark).

Border state was unknown at pause; 105 of 176 repos carry a 1.4.11-related commit, so it
is partly done. The audit agent is measuring what remains.

Two traps: only LOAD-BEARING borders count (decorative ones were deliberately left alone),
and six repos — `hybrid-guide`, `ibe-gate`, `model-breach`, `noise-pipe`, `oram-vault`,
`pairing-gate` — have per-theme overrides that rescue a base rule that fails on its own.
`ibe-gate` would be 3.84:1 without its override, `noise-pipe` 2.53:1. Anyone "simplifying"
those base rules reintroduces the failure.

### 6. Run the gold-standard 10/10 scoring pass — `PARTLY DONE, RECOVERY IN FLIGHT`
Fable completed this for all 174 demos and **never wrote it to a file**. The scorecard on
disk, `../__Misc/CRYPTO-LAB-PEDAGOGY-SCORECARD.md`, is dated 2026-07-23, covers 136 demos,
and is the one fable proved stale.

Recovered from the transcript so far — the eight that moved most:

| Demo | Prior | Now |
|---|:--:|:--:|
| opaque-gate | 4 | 8 |
| x3dh-wire | 5 | 9 |
| kdf-arena | 5 | 8 |
| poly1305-mac | 6 | 9 |
| aegis-gate | 7 | 9 |
| tls-handshake | 8 | 7 |
| bcrypt-forge | 7 | 6 |
| drbg-arena | 7 | 6 |

**No demo scored 10.** The gold-standard goal is not met by any lab yet, including the 9s.
Only three moved down (task 9).

If the recovery agent returns only a fraction of the 174, re-scoring the remainder is real
work — but cheaper than the first pass, since the fleet has had a remediation pass since.

The working definition of the bar, from the spdz-forge audit: **claim-complete evidence** —
every claim the page makes is computed from the run rather than asserted, every verdict
states only what the protocol actually learned, and every important browser state is tested
rather than merely visited.

### 7. Delete the obsolete `HEADER-ROLLOUT-TODO.md` — `TODO`
Leftover from before the shared-header rollout was deliberately retired (commit `fbe77f4`).
CLAUDE.md now states each lab owns its header and the tooling is archived in
`archive/header-rollout/`. This file still reads as pending work and invites someone to
resurrect it. Skim for anything still true, then remove.

While there, consider the same for `CARD-AUDIT.md`, `CARD-ACCURACY-FINDINGS.md`,
`PROMPT-standardize-parts-A-D.md` and `futuredemos.md` — CLAUDE.md already marks the last
as superseded by `concept-coverage.md`.

### 8. Fix the falsifiable claims found but never fixed — `TODO`
The sweep found ~78 across the fleet, each with file:line, and "the large majority" were
fixed — so a minority were not, and the remainder was never enumerated. Blocked on
`audits/FALSIFIABLE-CLAIMS.md`.

Expect a high stale rate when cross-checking: every external review checked so far
described already-fixed code. The defect class is consistent — a demo asserts something its
own code does not compute, and the honest computation is usually already written, one
import away.

### 9. Investigate the three demos whose scores regressed — `TODO`
`tls-handshake` 8->7, `bcrypt-forge` 7->6, `drbg-arena` 7->6. Either the demo got worse or
the earlier score was too generous — determine which, per demo.

`bcrypt-forge` is the likeliest to be real. Its faked exhibits were the worst found all
session: a "rainbow table lookup" with no table, an "Attempted N of 100,000 dictionary
words" counter driven by wall-clock with zero hashes run, a key-schedule animation printing
"the key schedule ran 16,384 rounds" after 40 `Math.random()` frames, and a cost slider
taking the same 1.8s at cost 6 and cost 14 — flat across a 256x range, in the panel whose
whole thesis is that each +1 doubles the work. Commit `13bf273` claims to have replaced all
three. Verify it actually did.

### 10. Action the recommendations in the 9 recovered audit docs — `TODO`
2,589 lines in `audits/`, never worked through because nobody could see untracked files.
Read each against current repo state; act on what is still true.

Start with `_MASTER-TEMPLATE.md`, which calls itself the single source of truth for how
every lab is built. Decide whether it is promoted to the repo root or merged into
CLAUDE.md — two competing standards documents is worse than one.

---

## Operational notes

- **Do not run a fleet-wide script while agents are live in the same repos.** Two agents hit
  concurrent writers doing exactly this; nothing was lost, but in `bcrypt-forge` the
  script's commit message landed on an agent's `index.html` edits.
- **`git fetch` before trusting any ahead/behind count.** A stale remote-tracking ref
  produced a wrong "0 unpushed" in the previous resume notes.
- **Verify agent claims, including corrections to your own briefs.** Several have corrected
  a brief rather than following it, and were right. Several external findings were stale.
  Both cases are cheap to check and expensive to get wrong.
