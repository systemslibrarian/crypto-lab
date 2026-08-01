# What Would Make SPDZ Forge the Gold Standard

Audit date: 2026-07-17

> **PARTIAL SALVAGE — about 3% of the original.** The full 292-line audit was deleted in
> error on 2026-08-01 and is not recoverable: it was untracked, so git never held it, and
> it does not appear in any session log, `~/.claude/file-history`, or `~/.claude/paste-cache`.
> Only the opening reproduced below survived, in a transcript. **The three named blockers
> and all remediation detail are lost.**
>
> If you still have the source this came from (a ChatGPT/Claude/Gemini conversation),
> re-exporting it is the cheapest way to restore it. Otherwise this repo needs a fresh
> gold-standard audit — see task #6.

## Bottom line

SPDZ Forge already has the bones of an exceptional teaching lab: real finite-field arithmetic, CSPRNG-backed sharing, authenticated Beaver triples, known-answer tests, an unusually honest real-vs-modeled boundary, a strong five-stage learning sequence, and an accessibility gate. The next step is not more visual polish or more prose.

The gold-standard bar is **claim-complete evidence**: every malicious action the page says SPDZ handles must enter through the same authenticated opening path the protocol relies on, every verdict must say only what the protocol learned, and every important browser state must be tested rather than merely visited.

There are three blockers before this can be called the definitive interactive SPDZ reference:

<!-- END OF SALVAGED CONTENT — the three blockers and roughly 280 further lines were lost. -->
