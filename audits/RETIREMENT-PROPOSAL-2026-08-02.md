# `audits/` retirement proposal — 2026-08-02

Answering "most of the files under audits are old and can be removed?" — roughly half, but
not yet, and not all. Every file below is tracked in git, so any removal is recoverable
(unlike the three untracked audit docs lost on 2026-08-01). Nothing here has been executed.

## Keep — living documents

| File | Why it stays |
|---|---|
| `_MASTER-TEMPLATE.md` | As of today it is the referenced per-demo build standard, linked from `CLAUDE.md`. |
| `TEMPLATE-DECISION-2026-08-02.md` | The record of why that decision went the way it did. |
| `FALSIFIABLE-CLAIMS.md` | The evidence ledger for Task 8's 189 claims, with per-repo commits inline. It is the proof the work happened. |
| `TRIAGE-2026-08-02-batch-{1,2}.md` | Task 10's record, and it holds the PROPOSED lists still awaiting maintainer decisions. |
| `README.md` | Index for this directory; needs updating as part of any cleanup. |

## Merge, then retire — the detail is worth keeping, the file count is not

The eleven 2026-08-02 slice files carry a per-demo justification **and** a concrete "what
would raise it" list. That is the roadmap for pushing demos toward 10, so it must be
consolidated rather than deleted.

- `SCORECARD-2026-08-02-slice-{1..7}.md`
- `SCORECARD-2026-08-02-reverify-{1..4}.md`

Proposal: merge all of them into a single `SCORECARD-2026-08-02.md` preserving every
justification and improvement list, then remove the slice files. Do this only after
slice 7 lands, so nothing is merged mid-write.

Once that merged file exists, `SCORECARD-2026-08-01.md` becomes history: its scores are
superseded and its calibration role is taken over. Its provenance section — which records
that an earlier session claimed 174 demos were scored when the transcript supports 74 — is
worth quoting into the merged file before retiring it.

## Retire — spent snapshots

| File | Superseded by |
|---|---|
| `PRE-PUSH-STATUS.md` | CI. It is a 2026-08-01 pre-push test-result snapshot. |
| `VERIFICATION-2026-08-01.md` | The per-repo blocking regressions added since. |
| `BORDER-CONTRAST-STATUS.md` | Task 5 is complete; every listed repo now carries a blocking both-theme contrast regression, which enforces continuously what this file measured once. Its counts were already stale before the pass finished. |
| The nine per-repo audit docs: `ablation-wire`, `credential-veil`, `dkg-gate`, `harvest-vault`, `hqc-timing`, `hqc-timing-bugs`, `icy-dvrf`, `lattice-gentle`, `protocol-checker`, `schnorr-forge`, `spdz-forge` | `TRIAGE-2026-08-02-batch-{1,2}.md`, which classifies every recommendation as done, stale, still-applicable, or proposed. |

Caveat on two of those: `hqc-timing.md` and `spdz-forge.md` are **partial salvages** of
documents destroyed on 2026-08-01, carrying explicit loss markers. Their surviving content
is fully triaged, but if there is any chance of re-exporting the original conversations,
retire them last.

## Suggested sequence

1. Wait for slice 7.
2. Build `SCORECARD-2026-08-02.md` from the eleven slice files, preserving all detail.
3. Quote the 08-01 provenance note into it.
4. Remove the eleven slice files, `SCORECARD-2026-08-01.md`, `PRE-PUSH-STATUS.md`,
   `VERIFICATION-2026-08-01.md`, `BORDER-CONTRAST-STATUS.md`, and the nine per-repo docs
   in one commit whose message lists exactly what was removed and what supersedes it.
5. Update `audits/README.md` to describe the smaller directory.

That takes `audits/` from 31 files to about 7.
