# Lane 3a — the dispatch re-query census and its exception list

_Read-only census taken 2026-09-10, before lane 3b rewrote the fleet's Dependabot
auto-merge steps. This is the record 3b was built on, so it is committed here rather
than left in a transcript — it was previously only in a workflow transcript and a
temp file, which is not a record at all._

**Two of its claims were wrong. They are corrected below, in place, with the
evidence.** The corrections are kept visible rather than silently edited, because a
census that quietly changes its mind is worth less than one that shows where it was
wrong.

---

## What it found

Six shards inventoried every workflow under the fleet root; a completeness critic then
re-derived the count three independent ways.

| | |
|---|---|
| Steps piping `gh pr view` into a filter | **180** (critic's count, three derivations agreeing) |
| Shard total | 183 — the extra 3 are `gh`-into-filter but not `gh pr view` |
| Steps declaring `shell: bash` | **0** |
| Steps where `shell: bash` would change behaviour | **0 of 183** |

**The measurement that redirected the lane.** The proposed fix was to add `shell: bash`
so GitHub's explicit bash (`-e -o pipefail`) would make a failing `gh pr view` fail the
step. It would not have. Inside an `if` condition a failing pipeline takes the else
branch identically with or without `pipefail`, and `set -e` is exempt in that position:

```
set -e -o pipefail
if false | grep -q MERGED; then echo MERGED; else echo NOT-MERGED; fi
  -> NOT-MERGED, step exit status 0        (identical with pipefail off)
```

So the mechanical edit was a no-op in every one of the 183 steps. That is why 3b
propagated the `merged=1` flag idiom instead — the repair eight labs already shipped.

---

## The exception list

Every entry carries an explicit status. **`excluded` = do not apply the uniform edit.
`cleared` = investigated, apply it normally.** Status is a field, never an inference
from prose: an earlier lane lost four labs because an exception *log* was read as an
exclusion *list*.

### Excluded — already carry the target shape

`attestation-gate` (the reference implementation, `deploy.yml:106–121`), `context-ward`,
`covert-channel-studio`, `factor-forge`, `lattice-builder`, `rekey-relay`,
`shelf-oracle`, `sphinx-mix`.

`silent-tally` — the fleet's only standalone `workflow_run`-triggered auto-merge. It
resolves the PR with `n=$(gh api …)` — command substitution, not a pipe — so a failing
`gh` *does* fail the step under `bash -e`. Structurally sound; no pipe-shaped pattern
can see it.

### Excluded — diverge by accident, need the shape added rather than replaced

`ablation-wire`, `elgamal-plain`, `dilithium-reject`, `ckks-lab`, `hybrid-sign`, `shor`.
Each merges and then dispatches nothing, carrying a vestigial
`actions: write   # required by the deploy dispatch` comment naming a dispatch that does
not exist. Three of them — `ckks-lab`, `hybrid-sign`, `shor` — had no `workflow_dispatch`
trigger anywhere, so there was no manual recovery path either.

### Excluded — one-line variant

`attribute-gate` — its merge step writes `echo "merged=1" >> "$GITHUB_ENV"` and nothing
reads it; the Deploy step re-queries anyway. That orphan is a fossil of the correct fix,
and a tidy-up sweep would delete the one artifact documenting the intended repair.

### Cleared

`crypto-compare` and `crypto-counsel` — both carry the canonical construct and **neither
is under the `crypto-lab-` prefix**, so a glob on `crypto-lab-*` silently skips them.

`quantum-vault-kpqc` — its standing fleet exception is the **light theme only**. Its
construct is byte-identical to the rest and has no bearing on the theme contract. Do not
let one exception leak into an unrelated pass.

25 cross-file dispatchers — auto-merge in one workflow dispatching another. All 25
targets verified present and declaring `workflow_dispatch`.

---

## Corrections

**C1 — `sector-vault` does not omit `|| echo`.** The census recorded it as deliberately
omitting the `|| echo "::warning::"` suffix on its dispatch, and that was carried into
3b's brief as a divergence to preserve. It is false. `sector-vault` has carried
`|| echo` since its **first commit** (`c49b7ba`, "Add the README, the deploy pipeline,
and the NEG-1 evidence fixture"); the count is 1 at every revision of
`.github/workflows/deploy.yml`. Nothing flattened it — the claim was wrong when written.

**C2 — the `cancel-in-progress: false` case is `syndrome-drain`, and it is one of
nineteen, not one.** The census attributed this to `sector-vault`; it belongs to
`syndrome-drain`, whose block carries its own comment, *"One concurrent deploy; don't
cancel an in-progress release."* That comment and value did survive 3b intact — only the
`group:` line changed — so the guardrail held. But the divergence is not unique:
nineteen repos set `cancel-in-progress: false`, namely `crypto-counsel`,
`ablation-wire`, `aegis-gate`, `dead-sea-cipher`, `drbg-arena`, `ecdsa-forge`,
`frodo-vault`, `hybrid-sign`, `ibe-gate`, `isogeny-gate`, `jevil`, `opaque-gate`,
`psi-gate`, `ratchet-wire`, `shamir-gate`, `shamir-vs-frost`, `syndrome-drain`,
`world-ciphers` and `world-hashes`. It was unique *within the nineteen labs of that
sweep*, and a scope-limited fact became an unscoped one on the way into the record.

**What C2 costs, and why it is worth writing down.** "The only lab with X" is the exact
shape that earns an exception permanent protection, and it is also the easiest claim to
inherit without re-deriving. A scoped uniqueness claim that loses its scope will be cited
later as fleet-wide. Re-derive uniqueness before relying on it; the tools that answer it
are `theme-sync`, `dispatch-sync` and `gate-sync`.

---

*Superseded operationally by lane 3b and by `tools/dispatch-sync.js`, which enforces the
invariant this census motivated. Kept because it is the reasoning 3b was built on, and
because its two errors are instructive.*
