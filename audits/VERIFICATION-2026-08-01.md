# Runtime verification — 2026-08-01

Three commits authored this session change what a page *shows*, so they were verified by
building each app, serving it, and driving it in a headless browser. Not by running tests —
tests were already green and prove nothing about the rendered page.

**Verdict: PASS on all three.**

| Repo | Commit | Claim |
|---|---|---|
| `broken-trust` | `f85c8d7` | Restores a call site so the sources panel renders and quotes the run's real score |
| `curve-lens` | `9114139` | ECDLP panel reports the search's own answer and re-derives k·G to check it |
| `simon-period` | `9c8413a` | "Recovered" now means the key reproduces the whole cipher, not one lucky block |

No `verifier-*` or `run-*` skill exists in any of the three; this was a cold start using
`npm run build`, `vite preview`, and each repo's own Playwright.

## What was observed

**`broken-trust`** — all seven elements `renderSources()` populates come back filled
(`toy-params`, `verify-block`, `sh-relations`, `sh-reduction`, `sh-noise`, `ov-paper-rels`,
`teaching-presets`). Without the restored call these are all empty, the presets box
included. Clicking each of the four presets tracked correctly:

```
Clean descent          makeRelations(inst, 4000, 0,    113)  score 0     converged true   === inst.secret
Too few leaks          makeRelations(inst,  600, 0,    113)  score 0     converged false  !== inst.secret
Noisy but recoverable  makeRelations(inst, 6000, 0.1,  113)  score 588   converged false  === inst.secret
Past toy ceiling       makeRelations(inst, 4000, 0.45, 113)  score 1,839 converged false  !== inst.secret
```

The previous hardcoded text asserted `// 0 exactly at the true key` and `// === inst.secret`
unconditionally, so it would have been wrong on three of these four.

**`curve-lens`** — `Solved: k = 17 after 17 point additions.` followed by
`Check, recomputed from the recovered scalar: 17 · G = (6, 14) = Q ✓`. Four further
challenges (k = 2, 8, 8, 3) all verified.

**`simon-period`** — `Full key recovered — cipher predicted`, with `the derived key
reproduces all 32 blocks of the cipher — not just the one shown`. The single-block display
is retained, so the teaching visual survived the change.

## Probes

- 12 rapid preset clicks in `broken-trust` with no settle time, then a return to the
  starting preset: exact original values restored, no tearing. Reload with accumulated URL
  state: identical.
- `simon-period` at n = 4/5/6: blocks swept 16/32/64, matching 2^n exactly. The sweep is
  sized to the group, not hardcoded.
- `simon-period` "No period (control)" target: correctly refuses to claim recovery —
  *"NO PERIOD — nothing to find. The rank reached n = 6, so the only vector orthogonal to
  every measurement is zero. That is a proof, not a timeout."*
- Zero console or page errors in any run.

## Findings worth acting on

- **`curve-lens` prints two numbers that are always identical by construction.** `k` and
  "point additions" were 17/17, 2/2, 8/8, 3/3, because the walk starts at 1 and increments,
  so steps always equals k. Correct, but it reads as two independent confirmations when it
  is one.

  This also means the fix is not *visually* distinguishable from the bug it replaced: the
  old code printed the secret in both slots and produced the same digits. The evidence that
  it landed is the new `= Q ✓` re-derivation line and the removal of `ecdlpSecret` from
  state — not the numbers themselves. Worth either labelling the second figure or dropping
  it.

- **`broken-trust`'s "Noisy but recoverable" preset shows `converged false` yet
  `=== inst.secret`** — it recovers the key without the score reaching 0. That is
  pedagogically the most interesting of the four states, and precisely the one the old
  hardcoded comment erased.

- **`simon-period/src/main.ts:326` calls `t.exploit(0)` on every render of the unsolved
  state.** The all-blocks sweep made that O(2^n) rather than O(1). At n <= 6 that is 64
  iterations, so there is no practical cost, but it is now a full sweep on a throwaway
  placeholder value.

- Both `curve-lens` and `broken-trust` serve under a subpath (`/crypto-lab-<name>/`) and
  302 from root. Harmless, but a bare `curl localhost:PORT` looks like a failure until the
  redirect is followed — worth knowing before diagnosing a dead preview server.
