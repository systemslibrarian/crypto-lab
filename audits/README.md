# Gold-standard audits

Per-repo audits of individual labs against the 10/10 gold-standard bar, plus the master
template they are measured against. Collected here on 2026-08-01 from the demo repos,
where they had been sitting **untracked** in repo roots — invisible to anyone not running
`git status` in that specific directory, and one `rm` away from gone.

| File | Source repo | Lines | Kind |
|---|---|---|---|
| `_MASTER-TEMPLATE.md` | iron-serpent | 373 | Master template — "the single source of truth for how every `crypto-lab-*` demo is built" |
| `lattice-gentle.md` | lattice-gentle | 426 | Gold-standard audit, 2026-07-20 |
| `schnorr-forge.md` | schnorr-forge | 415 | Gold-standard roadmap, 2026-07-22 |
| `icy-dvrf.md` | icy-dvrf | 333 | 10/10 assessment, 2026-07-20 |
| `ablation-wire.md` | ablation-wire | 263 | 10/10 audit |
| `harvest-vault.md` | harvest-vault | 223 | Gold-standard suggestions |
| `dkg-gate.md` | dkg-gate | 220 | Gold-standard roadmap, 2026-07-22 |
| `credential-veil.md` | credential-veil | 178 | Gold-standard audit |
| `protocol-checker.md` | protocol-checker | 158 | Gold-standard audit |
| `spdz-forge.md` | spdz-forge | 23 | **Partial salvage** — ~3% of a lost 292-line audit |
| `hqc-timing.md` | hqc-timing | 22 | **Partial salvage** — ~5% of a lost 222-line review |

## Method documents (2026-08-11)

The per-repo audits above say *what* was wrong with one lab. These say *how* to find it, and
were written from the sweep that has now covered ~30 repos. They are the standing briefs
handed to every agent doing this work, kept here rather than in a session scratchpad because
each one is the distilled result of a run that cost real time to learn.

| File | What it is |
|---|---|
| `METHOD-honest-a11y-gate.md` | Replacing a template a11y gate with one that actually drives the lab. Includes the catalogue of ways old gates fake passing — silent `if (await btn.count())` guards, documents assembled that no visitor can reach, scanning only after the drive overwrote every state — and the mutation-testing traps that certify nothing. |
| `METHOD-claims-audit.md` | The teaching-correctness audit: *for every sentence the page renders, is this claim true in the state it is shown in?* Includes the seven confirmed cases where a repo's own test was **shaped around** its defect, and why reachability must be measured before severity is ranked. |
| `METHOD-hidden-attribute.md` | The `hidden`-that-does-not-hide class: why `[hidden]`'s (0,1,0) specificity loses to any class rule, why static detection of it is unsound, and the browser probe that settles it. Seven labs were affected. |

**Why the method docs matter more than they look.** Three separate mechanical detectors in
this sweep returned near-zero fleet-wide after being validated against known answers — the
defects that matter are semantic, so the yield comes from method, not from greps. And two
counts that looked like fleet-wide findings ("12 repos with identical test scripts", "159
repos with a stale-dist gate") collapsed to zero and three respectively once the command was
actually read. Both documents say so explicitly.
| `hqc-timing-bugs.md` | hqc-timing | 23 | **Partial salvage** — ~80% of a lost 15-line bug audit |

## The three salvages

On 2026-08-01 I misread three files of this genre as disposable AI chat logs and deleted
them. They were untracked, so git never held a copy, and they do not appear in any session
log, `~/.claude/file-history`, `~/.claude/backups` or `~/.claude/paste-cache`. They are
gone. What sits here was reconstructed from a transcript that had quoted their opening
sections, and each carries an explicit marker showing where the content stops.

`hqc-timing-bugs.md` is the least damaged and, as it happens, the least costly to lose:
both of its findings were checked against the current code and are already remediated.
The other two retain their framing but none of their recommendations.

If the source conversations still exist, re-exporting them restores the originals at
near-zero cost. That is worth doing before the scoring pass leans on this directory.

## Reading these

Treat every finding as a **claim to verify, not a fact**. The pattern across this fleet is
that external review documents frequently describe code that has since been fixed — three
checked so far, three already remediated. Confirm against current source before acting.

Two labs flagged as not teaching what they claimed have both since been fixed:

- **`format-ward`** taught FF3-1 as current practice. FF3-1 was never in a final NIST
  standard — it was introduced in the 2019 draft as the patch for the FF3 break, and the
  February 2025 second draft removes FF3 and FF3-1 both. Reframed as a withdrawn-and-broken
  exhibit in commit `81ed26b`, with the attribution corrected: Durak–Vaudenay broke FF3,
  Beyne (2021) broke FF3-1.
- **`zk-arena`** demonstrated zero-knowledge on parameters that leak ~19 bits of the secret
  from the public key alone, recoverable by Pohlig–Hellman on 200 of 200 keypairs tested.
  It now ships a safe prime-order parameter set alongside the toy one and demonstrates the
  leak explicitly rather than hiding it.

## Current contents (2026-08-03)

| File | What it holds |
|---|---|
| `SCORECARD-2026-08-02.md` | Current pedagogy scores for the fleet, each with a "what would raise it" queue |
| `SUB8-PROGRESS-2026-08-02.md` | The sub-8 improvement pass, with commits and gate evidence |
| `FALSIFIABLE-CLAIMS.md` | The 189-claim ledger; every entry resolved, with per-repo commits |
| `TRIAGE-2026-08-02-batch-{1,2}.md` | The nine recovered per-repo audits, each recommendation classified |
| `VERIFICATION-INTEGRITY-2026-08-02.md` | The stale-bundle and shared-port bugs in the test harness, and what they hid |
| `_MASTER-TEMPLATE.md` | The per-demo build/teach/look/a11y standard |
| `TEMPLATE-DECISION-2026-08-02.md` | Why that template stays here rather than being promoted |
| `RETIREMENT-PROPOSAL-2026-08-02.md` | What was retired from this directory and why |
| `hqc-timing.md`, `hqc-timing-bugs.md`, `spdz-forge.md` | Partial salvages of documents destroyed on 2026-08-01; kept until the originals are ruled unrecoverable |

Retired on 2026-08-02/03, recoverable from git history: `BORDER-CONTRAST-STATUS.md`,
`PRE-PUSH-STATUS.md`, `VERIFICATION-2026-08-01.md`, the nine per-repo audit docs, the
twelve `SCORECARD-2026-08-02-*` slice files (merged into the single scorecard above), and
`SCORECARD-2026-08-01.md` (superseded; its provenance note is carried into the merged file).
