# Shared-header rollout — COMPLETE

The Crypto Lab shared global header (`shared-header.html`) — accent-aware, single
banner landmark, AA-contrast, with the duplicate in-page toggle hidden — is live on
**all 118 web labs** and pushed to `main`. The catalog also ships the 2026
Cybersecurity Excellence Awards "Gold Winner" banner.

**Skipped (no web page):** `crypto-lab-blind-oracle-api` (Rust backend).

## Tooling (kept for future demos)

- `shared-header.html` — canonical header snippet (source of truth)
- `reapply-header.py` — strips any old injected block and re-inserts the current
  snippet; handles root `index.html` and nested `demos/<slug>/index.html`

### Applying the header to a NEW demo later

```
python reapply-header.py crypto-lab-<slug>     # one repo
python reapply-header.py                        # all crypto-lab-* repos (idempotent)
```

Then commit **scoped to the header file only** (never `git add -A`, because some
repos track `node_modules` and have unrelated WIP):

```
git -C crypto-lab-<slug> add index.html         # or demos/<slug>/index.html
git -C crypto-lab-<slug> commit -m "Add shared Crypto Lab header"
git -C crypto-lab-<slug> push
```
