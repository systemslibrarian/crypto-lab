# Shared-header rollout — status & TODO

Tracks the rollout of the **Crypto Lab shared global header** (`shared-header.html`)
and the duplicate-toggle hide rule across all `crypto-lab-*` demo repos.

Tooling lives in this repo:
- `shared-header.html` — the canonical header snippet (source of truth)
- `reapply-header.py` — strips any old injected block and re-inserts the current snippet
  (handles root `index.html` and nested `demos/<slug>/index.html`); local edits only
- `apply-header.sh` — original injector (superseded by the Python script)

---

## Status: header applied LOCALLY to all 118 web labs

All `crypto-lab-*` repos are now cloned (119 local) and carry the accent-aware
header + hidden in-page toggle. Nothing has been pushed yet.

**Intentionally skipped:** `crypto-lab-blind-oracle-api` (Rust backend, no web page).

### Two push groups

**Group A — 85 original labs** (were already cloned; only the header changed):
ready to push now, scoped to the header file only.

**Group B — 33 newly cloned labs** (cloned this session): header applied, but
**HOLD the push** — more changes are planned for these, to be batched together.

```
crypto-lab-aegis-gate          crypto-lab-lll-break
crypto-lab-ascon               crypto-lab-lms-xmss
crypto-lab-bb84                crypto-lab-model-breach
crypto-lab-bulletproofs        crypto-lab-mpcith-sign
crypto-lab-ckks-lab            crypto-lab-multivariate
crypto-lab-curve448            crypto-lab-nonce-lattice
crypto-lab-frodo-vault         crypto-lab-ntru-classic
crypto-lab-grover              crypto-lab-oram-vault
crypto-lab-harvest-vault       crypto-lab-paillier-gate
crypto-lab-hybrid-sign         crypto-lab-pq-rotation
crypto-lab-ibe-gate            crypto-lab-pq-tls-handshake
crypto-lab-isogeny-gate        crypto-lab-quantum-vault-kpqc
crypto-lab-jevil               crypto-lab-scloud-vault
crypto-lab-j-uniward           crypto-lab-shamir-gate
crypto-lab-kerberos            crypto-lab-shor
crypto-lab-lattice-fault       crypto-lab-threshold-mldsa
                               crypto-lab-vss-gate
```

---

## Push note (scope every commit to the header file ONLY)

Working trees are **not clean** — `node_modules` is tracked in some repos and shows
platform churn (Linux→Windows binaries), and several repos have unrelated
pre-existing source edits + untracked build artifacts. So:

```
git -C <repo> add index.html        # or demos/<slug>/index.html
git -C <repo> commit -m "Add shared Crypto Lab header"
git -C <repo> push
```

Never `git add -A` in these repos — it would sweep in node_modules churn and WIP.

---

## Resume prompt (for Group B, once their other changes are done)

> Push the Crypto Lab shared-header change for the Group B repos in
> `HEADER-ROLLOUT-TODO.md`. Scope each commit to the header file only
> (`index.html` or `demos/<slug>/index.html`) — never `git add -A`.
