# Per-repo audit originals — July 2026

Nine "what would make this a 10/10 / gold standard" audits that were sitting **untracked** in
their own demo repos as `chat.md`, plus one stray template. Archived here on 2026-08-04 so the
demo repos could be left clean without destroying anything.

## Why they were archived rather than deleted

They were untracked, and an untracked file looks identical to a tracked one right up to the
moment it is gone forever. **This project has already lost three audit documents that way.**
Their *content* is already triaged into `../TRIAGE-2026-08-02-batch-1.md` and
`../TRIAGE-2026-08-02-batch-2.md`, so nothing here is unique analysis — but the triage files are
derived summaries, and these are the originals they were derived from.

| File | From | Size |
|---|---|---|
| `ablation-wire.md` | `crypto-lab-ablation-wire/chat.md` | 16 KB |
| `credential-veil.md` | `crypto-lab-credential-veil/chat.md` | 9 KB |
| `dkg-gate.md` | `crypto-lab-dkg-gate/chat.md` | 18 KB |
| `harvest-vault.md` | `crypto-lab-harvest-vault/chat.md` | 11 KB |
| `icy-dvrf.md` | `crypto-lab-icy-dvrf/chat.md` | 21 KB |
| `lattice-gentle.md` | `crypto-lab-lattice-gentle/chat.md` | 27 KB |
| `protocol-checker.md` | `crypto-lab-protocol-checker/chat.md` | 7 KB |
| `schnorr-forge.md` | `crypto-lab-schnorr-forge/chat.md` | 18 KB |
| `spdz-forge.md` | `crypto-lab-spdz-forge/chat.md` | 2 KB |
| `_iron-serpent-stray-template.md` | `crypto-lab-iron-serpent/CRYPTO-LAB-TEMPLATE.md` | 373 lines |

## The stray template

`_iron-serpent-stray-template.md` was an untracked copy of the demo-authoring template sitting in
a lab repo. It is **not** identical to `../_MASTER-TEMPLATE.md` (373 lines vs 399) — it is an
older revision, so it was archived rather than dropped as a duplicate. It is superseded and
should not be worked from. The live authoring template is kept outside this repo (Google Drive)
and is gitignored here; the tracked in-repo standard is `../_MASTER-TEMPLATE.md`.

## Status

**Historical.** Read `../TRIAGE-2026-08-02-batch-{1,2}.md` for the triaged, current view of these
recommendations. Nothing here should be actioned directly without checking it against current
repo state first — most of it predates a great deal of work.
