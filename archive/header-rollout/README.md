# Retired: the shared-header rollout tooling

These scripts are **retired and must not be run.** They are kept for history only.

## What they did

`reapply-header.py` removed any previously-injected header block from every lab's
`index.html` and re-inserted the current `shared-header.html` after `<body>`, keyed on the
marker comments:

```
<!-- BEGIN crypto-lab shared header — managed; edit shared-header.html + re-run reapply-header.py ... -->
<!-- END crypto-lab shared header -->
```

`apply-header.sh` drove it across the fleet; `verify-rollout.sh` and `verify-results.tsv`
checked the result.

## Why they are retired

Each lab now **owns its own header**. The marker comments were removed from all 175 labs,
so these scripts can no longer find a block to replace — and if the markers were ever
restored, re-running them would overwrite every lab's header with this directory's stale
copy, discarding per-lab work.

Two things made the old model worth abandoning:

1. **It was only half-real.** `reapply-header.py` genuinely kept the header uniform — 146 of
   160 labs were byte-identical after normalizing each repo's own name. But the `cl-hero`
   CSS block carried a comment reading *"managed, keep in sync across fleet"* while **no tool
   ever synced it**. It drifted into roughly 140 variants across 171 labs. The label was
   aspirational; the manager did not exist.

2. **Re-running it would have destroyed real work.** Five labs had hand-extended headers
   (`blind-oracle`, `curve-lens`, `ec-point-arithmetic`, `envelope-kms` at 242 lines;
   `signed-bytes` at 221). A rollout would have flattened all five back to the template.

## What to do instead

- **Changing one lab's header:** edit that lab. It is that lab's code now.
- **Starting a new demo:** copy the header from any existing lab and adapt it. There is no
  canonical source to sync from, and that is deliberate.
- **A change every lab should get:** make it a deliberate, reviewed pass across the repos —
  not an overwrite driven from here.

`shared-header.html` is archived alongside these scripts as the last version that was
rolled out. It is a historical record, not a source of truth.
