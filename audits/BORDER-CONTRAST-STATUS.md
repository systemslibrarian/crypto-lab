# Border-contrast status — WCAG 2.1 SC 1.4.11 (control boundaries)

_Measured 2026-08-01 across all 176 `~/repos/crypto-lab-*` working copies. Measurement only — no repo was modified._

## Recheck update — 2026-08-01

The table below is a dated measurement, not current fleet state. A fetch-first recheck
confirmed pairing-gate, world-ciphers, vrf-gate, nonce-lattice, rsa-forge, and ablation-wire
already pass on origin (minimum ratios 3.16, 3.29, 3.33, 3.31, 3.26, and 3.31).
`shamir-vs-frost` was still live and is fixed/pushed at `35eaaba` (dark minimum 3.25,
light minimum 3.30). Interrupted fixes for blind-hello, diffie-hellman-mitm, ibe-gate,
kdf-arena, and timing-oracle were also verified and pushed.

Subsequent live fixes: `hash-zoo`'s missed `#intro-input` now uses its existing strong
control token (`b785c3c`); `accumulator` now measures at least 3.07:1 against every control
adjacency in both themes (`b5a6fe4`); and `merkle-vault` now measures at least 3.16:1
against every relevant surface in both themes (`9c3ea37`). All three passed their full
local gates and settled live-page screenshot checks.

Task 5 resumed: `lwe-hints` was still live and is fixed/pushed at `1429cef`; its calculator
input boundary now measures 3.30:1 in dark theme and 4.00:1 in light theme against the
control fill, enforced by a blocking browser regression. Unit, build, and both-theme a11y
gates pass.

`syndrome-drain` was also live and is fixed/pushed at `06d7279`; its dedicated control
border measures 3.47:1 dark and 3.84:1 light against the actual control surfaces, with a
computed-style browser ratio gate. All 23 tests, build, and three browser/a11y tests pass.

`harvest-timeline` was live and is fixed/pushed at `e617bdd`; its dedicated select/text
control border measures 3.77:1 dark and 3.51:1 light against the actual fills, enforced by
a computed-style browser ratio gate. All 90 tests, build, and three browser/a11y tests pass.

`mls-group` was live and is fixed/pushed at `9371174`; its text-input boundaries now
measure 3.18:1 dark and 3.32:1 light against their rendered fills, enforced by both-theme
computed-style regressions. All 19 tests, build, and five browser/a11y tests pass.

`collision-vault` was live and is fixed/pushed at `45d3436`; its tamper-select boundary
now measures 3.35:1 dark and 5.23:1 light, enforced on desktop and mobile. All 77 tests,
lint, build, and 19 passing browser tests pass (one intentionally skipped).

`iron-serpent` was live and is fixed/pushed at `f2e73d0`; its dedicated load-bearing field
border measures 4.18:1 dark and 4.54:1 light against actual fills, with checkbox/range/file
controls excluded. All 42 tests, build, and 28 desktop/mobile browser tests pass.

`noise-pipe` was live and is fixed/pushed at `b696d6e`; its dedicated text-input border
measures 3.48:1 dark and 4.25:1 light against the actual input fill, enforced in both
themes. All 70 tests, build, and both browser/a11y tests pass.

`oram-vault` was live and is fixed/pushed at `2dbff17`; its dedicated number-input border
measures 3.55:1 dark and 4.11:1 light against the actual fill, enforced in both themes.
All 31 tests, typecheck, build, and three browser/a11y tests pass.

`j-uniward` was live and is fixed/pushed at `03b91e9`; its message-field boundary measures
4.18:1 dark and 4.83:1 light against the actual fills, enforced in both themes. All 15
custom tests, typecheck, build, and three browser/a11y tests pass.

`hybrid-wire` was live and is fixed/pushed at `a2482aa`; its boundary measures 3.26:1 dark
and 4.55:1 light, with a browser regression that composites rendered ancestor backgrounds.
All 18 tests, build, and four browser/a11y/contrast tests pass.

`rsa-educational` was live and is fixed/pushed at `261ad16`; its dedicated form-control
border measures 3.28:1 dark and 4.03:1 light against actual fills, enforced in both themes.
All 30 tests, typecheck, build, and three browser/a11y tests pass.

`nonce-guard` was live and is fixed/pushed at `2db23b3`; its dedicated textarea boundary
measures 3.59:1 dark and 4.01:1 light against the code-field fill, enforced in both themes.
All 22 tests, build, and five browser/a11y tests pass.

`broken-trust` was live and is fixed/pushed at `937fe68`; its trial-select boundary now
measures 3.47:1 dark and 4.01:1 light against its actual fill, enforced in both themes.
All 41 tests, build, and four browser/a11y/contrast tests pass.

`scloud-vault` was live and is fixed/pushed at `ff21806`; its parameter-select boundary
now measures 3.58:1 dark and 4.06:1 light against its actual fill, enforced in both themes.
All 41 tests, build, and five browser/a11y tests pass.

`stego-suite` was live and is fixed/pushed at `927cfb2`; its dedicated field boundary
measures about 3.86:1 dark and 3.84:1 light after compositing the translucent field fill,
with a browser regression for the rendered layers. Typecheck, 39 tests, build, and three
browser/a11y tests pass.

`nonce-collision` was live and is fixed/pushed at `2bb1691`; its dedicated field boundary
measures 3.30:1 dark and 4.17:1 light against the actual fill, enforced in both themes.
All 36 tests, typecheck, build, and three browser/a11y tests pass.

`falcon-seal` was live and is fixed/pushed at `4226ce6`; its dedicated textarea boundary
measures 4.69:1 dark and 4.00:1 light against the actual fill, enforced in both themes.
All 18 tests, build, and both-theme motion-neutralized accessibility scans pass.

`psi-gate` was live and is fixed/pushed at `98b3c5e`; its dedicated textarea boundary
measures 3.58:1 dark and 4.29:1 light against the actual fill, enforced with deterministic
theme setup. All 40 tests, build, and three browser/a11y tests pass on the final rerun.

`padding-oracle` was live and is fixed/pushed at `5f2f536`; its shared text/select control
boundary measures at least 3.84:1 dark and 3.98:1 light, enforced across all such controls.
All seven tests, typecheck, build, and three browser/a11y tests pass.

`signed-bytes` was live and is fixed/pushed at `c36ea47`; its dedicated textarea/text-input
boundary measures at least 3.10:1 dark and 3.62:1 light, enforced across all such controls.
Typecheck, 132 tests, build, and 12 browser/a11y/behavior tests pass.

`phantom-vault` was live and is fixed/pushed at `9672507`; its dedicated input boundary
measures at least 4.15:1 dark and 4.18:1 light against the opaque field fills, enforced
across all inputs. Dual typechecks, 46 tests, uniformity check, build, and four browser/a11y
tests pass.

`threshold-decrypt` was live and is fixed/pushed at `92f5d3b`; its dedicated text-input
boundary measures at least 3.85:1 dark and 3.41:1 light against the opaque field fill,
enforced across every text input. All 38 tests, typecheck, build, and four browser/a11y
tests pass.

`entropy-collapse` is a stale/no-longer-applicable row: current production source renders
no `<select>` or dynamically created select and has no other bordered text-entry control;
the reported selector survives only as unused CSS. The clean fetched repo was unchanged.

`enigma-forge` was live and is fixed/pushed at `2fd6f6f`; its dedicated select/text-input/
textarea boundary measures at least 3.30:1 dark and 4.07:1 light, enforced across all such
controls. All 60 tests, typecheck, build, and four browser/a11y tests pass.

`schnorr-forge` was live and is fixed/pushed at `a02b70f`; its dedicated input boundary
measures at least 3.59:1 dark and 4.60:1 light, enforced across all relevant inputs. All 69
tests, typecheck, build, size budgets, and 35 cross-browser tests pass (four expected skips).

`chain-of-trust` was live and is fixed/pushed at `d7e02a1`; its dedicated select boundary
measures at least 3.30:1 dark and 3.68:1 light after PKI readiness, enforced across all
app selects. All 78 tests, typecheck, build, and five dark/light/mobile browser/a11y tests
pass.

`isogeny-atlas` was live and is fixed/pushed at `292594b`; its dedicated text/select
boundary measures at least 3.43:1 dark and 4.09:1 light, enforced from rendered styles in
both themes. All 58 tests, typecheck, build, and 15 browser/mobile/a11y tests pass.

`musig-gate` was live and is fixed/pushed at `638c110`; its dedicated field boundary
measures at least 3.23:1 dark and 4.66:1 light, enforced across all relevant fields. All
261 unit tests, build, and 136 browser/a11y/flow tests pass (two expected mobile skips).

`dilithium-seal` was live and is fixed/pushed at `4d8ccf3`; its dedicated textarea/text-
input boundary measures at least 3.47:1 dark and 3.38:1 light, enforced from rendered
styles. All 20 tests, typecheck, build, and six browser/a11y/behavior tests pass.

`syndrome-hints` is a stale/no-longer-applicable row: the audited number-input selector
exists only as dead CSS, with zero rendered matches in both themes and no corresponding
markup or dynamic creation. All 62 tests, typecheck, build, and eight browser/a11y/behavior
tests pass; the clean repo was unchanged.

`world-hashes` was live and is fixed/pushed at `a8eea9f`; its dedicated textarea/text-input/
select boundary measures at least 4.06:1 dark and 4.49:1 light across opaque control fills.
All 58 tests, typecheck, build, and four browser/a11y/claim tests pass.

`shamir-gate` was live and is fixed/pushed at `a777192`; its dedicated text/number/textarea/
select boundary measures at least 4.58:1 dark and 3.62:1 light, enforced in both themes.
All 50 tests, typecheck, build, and four browser/a11y tests pass.

`envelope-kms` was live and is fixed/pushed at `eba0d26`; its dedicated seal-input boundary
measures at least 3.57:1 dark and 4.04:1 light after compositing translucent ancestor
surfaces. Full typecheck, lint, 62 tests, build, and four browser/a11y tests pass.

## Verdict

**The border-token pass did not finish. It covered 33 repos; 112 repos still have a load-bearing control border under 3:1.**

The 33 repos carrying a `Raise control-boundary contrast to meet WCAG 1.4.11` commit measure clean
(29 pass outright, 3 have no bordered text-entry control, 1 — `hash-zoo` — was fixed incompletely).
The remaining 142 repos were never touched, and 111 of them fail. This is roughly a quarter of the way through.

> Note on the brief: I was told a grep showed *105 of 176 repos* carry a 1.4.11 / control-boundary commit.
> That does not reproduce. Exactly **33** repos have a commit whose subject matches `control-boundary contrast`
> or `WCAG 1.4.11`; **128** have a commit mentioning "contrast" at all, but those are the older AA text-contrast
> and shared-header passes, not this one. 33 matches the "examined 33 repos" figure, so the pass stopped there.

## Counts

| | repos |
|---|---:|
| Working copies found | 176 |
| Measured | 175 |
| **Failing** (>=1 load-bearing control border under 3:1) | **112** |
| Passing (every load-bearing control border >=3:1) | 33 |
| Border not load-bearing / no bordered text-entry control | 30 |
| Could not evaluate | 1 |

Of the 112 failing repos, 106 fail in more than one theme,
1 in a light theme only,
and 5 in a dark/single theme only.

## Repos that still fail

One row per repo: its worst load-bearing control border, measured against the most favourable
plausible adjacent surface (so the ratio shown is the *best case* — the real one is often lower,
given in "worst"). "Other selectors" counts additional failing control selectors in the same repo.

| # | repo | selector | token | border | vs surface | ratio (best) | (worst) | theme(s) failing | file:line | other sel. |
|---:|---|---|---|---|---|---:|---:|---|---|---:|
| 1 | pairing-gate | `input[type="text"]` | `--border` | `#e2e8f0` | `#ffffff` | **1.23** | 1.13 | light, dark | `crypto-lab-pairing-gate/src/style.css:401` | 0 |
| 2 | world-ciphers | `select` | `--border` | `#e2e8f0` | `#ffffff` | **1.23** | 1.09 | light, dark | `crypto-lab-world-ciphers/src/style.css:357` | 2 |
| 3 | vrf-gate | `input` | `--line` | `#dbd6ce` | `#f4ede2` (grad) | **1.25** | 1.24 | light, base/dark, base/light | `crypto-lab-vrf-gate/src/style.css:137` | 1 |
| 4 | hawk | `.sign-form textarea` | `--line` | `#e3e4e6` | `#ffffff` (grad) | **1.27** | 1.26 | light, base/dark, base/light | `crypto-lab-hawk/src/styles.css:478` | 0 |
| 5 | kdf-arena | `.control-group input` | `--border` | `#e5e4e7` | `#ffffff` | **1.27** | 1.10 | light, dark | `crypto-lab-kdf-arena/src/style.css:328` | 0 |
| 6 | key-exchange | `.kx-inputs input` | `--line` | `#ddd5d2` | `#f7efe9` (grad) | **1.27** | 1.26 | base/dark, dark | `crypto-lab-key-exchange/src/extra.css:154` | 0 |
| 7 | pq-families | `.lamport-msg-wrap input[type="text"]` | `--line` | `#e4e4e6` | `#ffffff` (grad) | **1.27** | 1.26 | base/dark, dark | `crypto-lab-pq-families/src/extra.css:2074` | 0 |
| 8 | web-of-trust | `.wot-cert-row select` | `--line` | `#e4e4e6` | `#ffffff` (grad) | **1.27** | 1.20 | base/dark, dark | `crypto-lab-web-of-trust/src/extra.css:196` | 1 |
| 9 | threshold-mldsa | `textarea` | `--border` | `#d9dce2` | `#f4f7fb` (grad) | **1.28** | 1.26 | light, base/dark | `crypto-lab-threshold-mldsa/src/style.css:510` | 0 |
| 10 | ot-gate | `textarea` | `--border` | `#dfe2e8` | `#ffffff` | **1.30** | 1.14 | light, dark | `crypto-lab-ot-gate/src/style.css:606` | 0 |
| 11 | stark-tower | `.num-input` | `--bord` | `#1c2540` | `#070b12` (grad) | **1.30** | 1.02 | base/dark, light | `crypto-lab-stark-tower/css/style.css:190` | 0 |
| 12 | zk-proof-lab | `.param-select` | `--bord` | `#1c2540` | `#070b12` (grad) | **1.30** | 1.02 | base/dark, light | `crypto-lab-zk-proof-lab/css/style.css:120` | 0 |
| 13 | nonce-lattice | `select` | `--border-color` | `#d5d5d2` | `#ffffff` | **1.31** | 1.28 | light, base/dark | `crypto-lab-nonce-lattice/src/style.css:521` | 1 |
| 14 | rsa-forge | `.form-input` | `--c-border` | `#d8e2ef` | `#ffffff` | **1.31** | 1.10 | light, dark | `crypto-lab-rsa-forge/styles/main.css:508` | 1 |
| 15 | diffie-hellman-mitm | `.field input` | `--line` | `#d9d2c7` | `#f6efe6` (grad) | **1.32** | 1.31 | base/dark, dark | `crypto-lab-diffie-hellman-mitm/src/style.css:277` | 1 |
| 16 | shamir-vs-frost | `.field input` | `--border` | `#ddddef` | `#ffffff` | **1.34** | 1.05 | light, base/dark | `crypto-lab-shamir-vs-frost/src/styles.css:304` | 2 |
| 17 | ablation-wire | `.field input[type="text"]` | `--line` | `#d8dee8` | `#ffffff` | **1.35** | 1.19 | light, dark | `crypto-lab-ablation-wire/web/index.html (inline <style>):262` | 1 |
| 18 | jevil | `select` | `--border` | `#2c2636` | `#0c0a10` (grad) | **1.35** | 1.00 | dark, light | `crypto-lab-jevil/src/style.css:224` | 1 |
| 19 | lms-ledger | `textarea` | `--border` | `#1f2d24` | `#0a0d0f` | **1.35** | 1.19 | dark, light | `crypto-lab-lms-ledger/src/style.css:313` | 1 |
| 20 | merkle-proofs | `input[type="text"]` | `--border` | `#d7dee8` | `#ffffff` | **1.35** | 1.17 | light, base/dark | `crypto-lab-merkle-proofs/styles/main.css:170` | 1 |
| 21 | shor | `.n-input` | `--border` | `#1e2a3a` | `#080c14` | **1.35** | 1.23 | base/dark, light | `crypto-lab-shor/src/style.css:237` | 0 |
| 22 | stream-ward | `#app select` | `--border-strong` | `#202c3c` | `#0a0f16` | **1.35** | 1.33 | base/dark, light | `crypto-lab-stream-ward/src/styles.css:339` | 0 |
| 23 | vdf | `input[type="text"]` | `--border` | `#d9dee9` | `#ffffff` | **1.35** | 1.13 | light, base/dark | `crypto-lab-vdf/src/styles.css:128` | 1 |
| 24 | vigenere-break | `textarea` | `--border` | `#e0dbec` | `#ffffff` | **1.35** | 1.19 | light, base/dark, base/light | `crypto-lab-vigenere-break/src/style.css:113` | 2 |
| 25 | vss-gate | `input[type="text"]` | `--line` | `#c2e3f5` | `#ffffff` (grad) | **1.35** | 1.31 | light, base/dark | `crypto-lab-vss-gate/src/style.css:241` | 2 |
| 26 | bike-vault | `.mono-input` | `--border` | `#d4d6e0` | `#f8f9fc` | **1.38** | 1.13 | light, dark | `crypto-lab-bike-vault/styles/main.css:741` | 1 |
| 27 | dilithium-reject | `input` | `--line` | `#cad0d7` | `#fefefe` | **1.39** | 1.37 | light, base/dark | `crypto-lab-dilithium-reject/src/style.css:175` | 1 |
| 28 | icy-dvrf | `#app input[type="text"]` | `--border` | `#cfdde2` | `#ffffff` | **1.39** | 1.15 | light, base/dark | `crypto-lab-icy-dvrf/src/style.css:257` | 2 |
| 29 | mceliece-gate | `.input-group textarea` | `--border` | `#2a2a44` | `#0d0d1a` | **1.39** | 1.07 | dark, light | `crypto-lab-mceliece-gate/styles/main.css:1061` | 0 |
| 30 | bitcoin-wallet | `.mnemonic-input` | `--line-strong` | `#d2d2dc` | `#ffffff` | **1.40** | 1.37 | light, dark | `crypto-lab-bitcoin-wallet/src/extra.css:267` | 2 |
| 31 | hybrid-sign | `.field input` | `--border` | `#2a2a3a` | `#0a0a0f` | **1.40** | 1.22 | base/dark, light | `crypto-lab-hybrid-sign/src/style.css:394` | 1 |
| 32 | ibe-gate | `.field-row input` | `--border` | `#2a2a3a` | `#0a0a0f` | **1.40** | 1.20 | base/dark, light | `crypto-lab-ibe-gate/src/style.css:250` | 1 |
| 33 | syndrome-drain | `input[type="number"]` | `--border` | `#d4dbe3` | `#ffffff` | **1.40** | 1.24 | light, dark | `crypto-lab-syndrome-drain/src/style.css:404` | 0 |
| 34 | collision-vault | `.tamper-select` | `--border` | `#3a2630` | `#0d0a0c` | **1.41** | 1.02 | base/dark, light | `crypto-lab-collision-vault/demos/collision-vault/src/styles.css:853` | 0 |
| 35 | dead-sea-cipher | `.io-group textarea` | `--border` | `#2a2a3d` | `#0a0a0f` | **1.41** | 1.02 | base/dark, base/light, light | `crypto-lab-dead-sea-cipher/demos/dead-sea-cipher/src/style.css:213` | 2 |
| 36 | oram-vault | `.input-row input[type="number"]` | `--border` | `#2a2a3e` | `#0a0a14` | **1.41** | 1.22 | base/dark, light | `crypto-lab-oram-vault/src/style.css:470` | 1 |
| 37 | frozen-heart | `.field-toggle` | `--border` | `#d3d9e3` | `#ffffff` | **1.42** | 1.25 | light, base/dark, base/light | `crypto-lab-frozen-heart/src/style.css:348` | 1 |
| 38 | mls-group | `input[type="text"]` | `--border` | `#ccdae9` | `#ffffff` | **1.42** | 1.27 | light, base/dark | `crypto-lab-mls-group/src/style.css:219` | 1 |
| 39 | hybrid-wire | `.input` | `--border` | `#242e3e` | `#1d283a` | **1.43** | 1.36 | dark, light | `crypto-lab-hybrid-wire/demos/hybrid-wire/src/styles.css:748` | 1 |
| 40 | protocol-checker | `select` | `--border` | `#cadbd5` | `#ffffff` | **1.44** | 1.18 | light, base/dark, base/light | `crypto-lab-protocol-checker/src/style.css:312` | 0 |
| 41 | spake-gate | `.pw-input` | `--border-strong` | `#2b303c` | `#0e1016` | **1.44** | 1.31 | base/dark, light | `crypto-lab-spake-gate/src/style.css:603` | 0 |
| 42 | sphincs-ledger | `select` | `--border` | `#2d2d4a` | `#0f0f17` | **1.44** | 1.17 | base/dark, light | `crypto-lab-sphincs-ledger/demos/sphincs-ledger/src/styles.css:212` | 3 |
| 43 | broken-trust | `.trials-controls select` | `--border` | `#d0d7de` | `#ffffff` | **1.45** | 1.28 | light, dark | `crypto-lab-broken-trust/src/styles.css:369` | 1 |
| 44 | harvest-timeline | `select` | `--color-border` | `#c8d8ec` | `#ffffff` | **1.45** | 1.24 | light, dark | `crypto-lab-harvest-timeline/src/style.css:269` | 1 |
| 45 | iron-serpent | `input` | `--border` | `#d0d7de` | `#ffffff` | **1.45** | 1.36 | light, base/dark | `crypto-lab-iron-serpent/demos/iron-serpent/src/style.css:214` | 2 |
| 46 | j-uniward | `input[type="text"]` | `--input-border` | `#d0d7de` | `#ffffff` | **1.45** | 1.25 | light, dark | `crypto-lab-j-uniward/src/style.css:570` | 2 |
| 47 | lwe-hints | `.calc-row input` | `--border` | `#d0d7de` | `#ffffff` | **1.45** | 1.28 | light, dark | `crypto-lab-lwe-hints/src/styles.css:470` | 0 |
| 48 | noise-pipe | `.text-input` | `--border-color` | `#d0d7de` | `#ffffff` | **1.45** | 1.36 | light, dark | `crypto-lab-noise-pipe/styles/main.css:732` | 0 |
| 49 | rsa-educational | `input` | `--border-color` | `#d0d7de` | `#ffffff` | **1.45** | 1.16 | light, base/dark, base/light | `crypto-lab-rsa-educational/src/style.css:114` | 1 |
| 50 | scloud-vault | `.param-select` | `--border` | `#d0d7de` | `#ffffff` | **1.45** | 1.28 | light, dark | `crypto-lab-scloud-vault/src/style.css:148` | 3 |
| 51 | nonce-collision | `textarea` | `--border` | `#2e3140` | `#0f1117` | **1.46** | 1.19 | dark, light | `crypto-lab-nonce-collision/src/style.css:148` | 1 |
| 52 | nonce-guard | `textarea` | `--border` | `#2e3140` | `#0f1117` | **1.46** | 1.19 | dark, light | `crypto-lab-nonce-guard/src/style.css:411` | 1 |
| 53 | stego-suite | `textarea` | `--border` | `#c6d8e7` | `#ffffff` (grad) | **1.46** | 1.27 | light, base/dark | `crypto-lab-stego-suite/styles/main.css:275` | 2 |
| 54 | psi-gate | `textarea` | `--border` | `#2d2d44` | `#0a0a0f` | **1.48** | 1.28 | base/dark, base/light, light | `crypto-lab-psi-gate/src/style.css:345` | 0 |
| 55 | falcon-seal | `textarea` | `--border` | `#cad7cc` | `#ffffff` | **1.49** | 1.06 | base/dark, dark | `crypto-lab-falcon-seal/styles/main.css:243` | 0 |
| 56 | padding-oracle | `.text-input` | `--color-border` | `#c8d4ec` | `#ffffff` | **1.49** | 1.18 | light, dark | `crypto-lab-padding-oracle/styles/main.css:442` | 1 |
| 57 | phantom-vault | `input` | `--border` | `#1f314f` | `#080c14` (grad) | **1.50** | 1.13 | base/dark, light | `crypto-lab-phantom-vault/src/style.css:279` | 0 |
| 58 | schnorr-forge | `.mono-input` | `--border` | `#2b3440` | `#0d1117` | **1.50** | 1.27 | base/dark, light | `crypto-lab-schnorr-forge/src/style.css:150` | 0 |
| 59 | signed-bytes | `#app textarea` | `--border` | `#3a332c` | `#141210` | **1.50** | 1.29 | base/dark, base/light, light | `crypto-lab-signed-bytes/src/style.css:214` | 1 |
| 60 | threshold-decrypt | `input[type="text"]` | `--line` | `#ccd3e3` | `#ffffff` (grad) | **1.50** | 1.46 | light, base/dark | `crypto-lab-threshold-decrypt/src/style.css:193` | 0 |
| 61 | enigma-forge | `select` | `--line` | `#d9cfbe` | `#fffdf9` | **1.52** | 1.28 | light, base/dark, base/light | `crypto-lab-enigma-forge/src/styles.css:142` | 2 |
| 62 | entropy-collapse | `select` | `--border` | `#d9cfb8` | `#fffdf8` | **1.52** | 1.28 | light, base/dark | `crypto-lab-entropy-collapse/src/style.css:413` | 0 |
| 63 | musig-gate | `.mono-input` | `--border` | `#3a312a` | `#100e0c` | **1.52** | 1.26 | base/dark, light | `crypto-lab-musig-gate/src/style.css:444` | 0 |
| 64 | syndrome-hints | `input[type="number"]` | `--border` | `#3b3327` | `#12100d` | **1.53** | 1.35 | base/dark, base/light, light | `crypto-lab-syndrome-hints/src/styles.css:407` | 0 |
| 65 | world-hashes | `textarea` | `--border` | `#22354d` | `#081018` (grad) | **1.53** | 1.02 | base/dark, base/light, light | `crypto-lab-world-hashes/src/styles.css:236` | 2 |
| 66 | babel-hash | `textarea` | `--border` | `#d0d0d0` | `#ffffff` | **1.54** | 1.26 | light, base/dark | `crypto-lab-babel-hash/demos/babel-hash/src/styles.css:279` | 2 |
| 67 | chain-of-trust | `#app select` | `--border` | `#c4d4c9` | `#ffffff` | **1.54** | 1.38 | light, base/dark, base/light | `crypto-lab-chain-of-trust/src/style.css:183` | 2 |
| 68 | dilithium-seal | `textarea` | `--border` | `#c9d1d9` | `#ffffff` | **1.54** | 1.37 | light, base/dark, base/light | `crypto-lab-dilithium-seal/src/style.css:234` | 1 |
| 69 | hash-zoo *(has fix commit)* | `#intro-input` | `--border` | `#e8cc9d` | `#fffefb` | **1.54** | 1.14 | base/dark, base/light, dark | `crypto-lab-hash-zoo/src/style.css:286` | 0 |
| 70 | envelope-kms | `.seal-input` | `--border-strong` | `#263640` | `#131a29` (grad) | **1.56** | 1.26 | base/dark, light | `crypto-lab-envelope-kms/src/style.css:1892` | 0 |
| 71 | isogeny-atlas | `#app select` | `--c-border` | `#3d2a63` | `#120a1e` | **1.57** | 1.34 | dark, light | `crypto-lab-isogeny-atlas/src/style.css:213` | 1 |
| 72 | shamir-gate | `input[type="text"]` | `--border-bright` | `#2a2d6a` | `#0a0a14` | **1.58** | 1.45 | base/dark, light | `crypto-lab-shamir-gate/demos/shamir-gate/src/style.css:290` | 3 |
| 73 | multivariate | `.param-row select` | `--line-strong` | `#cecdd0` | `#ffffff` (grad) | **1.59** | 1.56 | base/dark, base/light, dark | `crypto-lab-multivariate/src/extra.css:60` | 1 |
| 74 | card-trick | `.mono-input` | `--border` | `#d9c9c5` | `#ffffff` | **1.60** | 1.35 | light, base/dark | `crypto-lab-card-trick/src/style.css:413` | 0 |
| 75 | hpke-envelope | `#app input[type="text"]` | `--border` | `#c2cde1` | `#ffffff` | **1.60** | 1.39 | light, base/dark | `crypto-lab-hpke-envelope/src/styles.css:124` | 1 |
| 76 | gg20-wallet | `input[type="text"]` | `--border` | `#c0ccd8` | `#fefeff` | **1.62** | 1.20 | light, dark | `crypto-lab-gg20-wallet/src/style.css:224` | 1 |
| 77 | hqc-vault | `select` | `--line` | `#d4c8b6` | `#fffdf8` | **1.62** | 1.02 | base/dark, dark | `crypto-lab-hqc-vault/styles/main.css:185` | 2 |
| 78 | blind-hello | `#app input[type="text"]` | `--border` | `#c3c9e4` | `#ffffff` | **1.64** | 1.26 | light, base/dark | `crypto-lab-blind-hello/src/styles.css:150` | 1 |
| 79 | pq-rotation | `input` | `--line` | `#ecf2f5` | `#0f2534` (grad) | **1.64** | 1.40 | single | `crypto-lab-pq-rotation/src/style.css:370` | 1 |
| 80 | key-mirror | `#app input[type="text"]` | `--border` | `#b9cdca` | `#ffffff` | **1.66** | 1.42 | light, base/dark | `crypto-lab-key-mirror/src/styles.css:131` | 0 |
| 81 | lattice-gentle | `#app input[type="number"]` | `--border` | `#2b3d52` | `#0c1420` | **1.66** | 1.53 | base/dark, light | `crypto-lab-lattice-gentle/src/style.css:245` | 1 |
| 82 | search-vault | `#app select` | `--border` | `#b6cdc9` | `#ffffff` | **1.67** | 1.43 | light, base/dark | `crypto-lab-search-vault/src/styles.css:229` | 1 |
| 83 | opaque-gate | `input[type="text"]` | `--color-border` | `#2a3a4a` | `#0a0a14` | **1.69** | 1.69 | dark, light | `crypto-lab-opaque-gate/src/style.css:291` | 1 |
| 84 | time-trust | `.field input[type="text"]` | `--border` | `#b0ccd6` | `#ffffff` | **1.69** | 1.48 | light, base/dark, base/light | `crypto-lab-time-trust/src/style.css:344` | 2 |
| 85 | traitor-trace | `#app select` | `--border` | `#b9c9d8` | `#ffffff` | **1.69** | 1.47 | light, base/dark | `crypto-lab-traitor-trace/src/style.css:171` | 1 |
| 86 | blind-oracle | `input[type="number"]` | `--green-soft` | `#a3cac1` | `#f3fbf7` | **1.70** | 1.29 | light, base/dark, base/light | `crypto-lab-blind-oracle/src/style.css:309` | 0 |
| 87 | blind-relay | `.ctl input[type="text"]` | `--border` | `#453558` | `#140f1d` | **1.71** | 1.45 | base/dark, light | `crypto-lab-blind-relay/src/styles.css:140` | 1 |
| 88 | fhe-arena | `input[type="number"]` | `--green-soft` | `#a3cac1` | `#fbfefc` | **1.71** | 1.67 | light, base/dark | `crypto-lab-fhe-arena/src/style.css:253` | 1 |
| 89 | kerberos | `.controls select` | `--border-strong` | `#b1bac3` | `#ffffff` | **1.71** | 1.63 | light, base/dark | `crypto-lab-kerberos/src/style.css:355` | 1 |
| 90 | time-lock-puzzle | `textarea` | `--border-2` | `#b9c6e4` | `#ffffff` | **1.71** | 1.48 | light, base/dark | `crypto-lab-time-lock-puzzle/src/styles/main.css:194` | 3 |
| 91 | ring-sign | `input[type="text"]` | `--line` | `#b0c9d2` | `#feffff` | **1.73** | 1.59 | light, dark | `crypto-lab-ring-sign/src/style.css:280` | 2 |
| 92 | quantum-vault-kpqc | `.form-group input` | _literal_ | `#c8c4bc` | `#ffffff` | **1.74** | 1.14 | base/dark, dark | `crypto-lab-quantum-vault-kpqc/web-demo/src/styles/vault.css:289` | 3 |
| 93 | pake-gate | `.field__input` | `--line-strong` | `#c3c3ce` | `#ffffff` | **1.75** | 1.47 | light, base/dark, base/light | `crypto-lab-pake-gate/src/styles.css:171` | 0 |
| 94 | spdz-forge | `#app input[type="text"]` | `--border` | `#c9c3b8` | `#ffffff` | **1.75** | 1.55 | light, base/dark | `crypto-lab-spdz-forge/src/style.css:125` | 0 |
| 95 | lll-break | `textarea` | `--line` | `#b5c3df` | `#ffffff` | **1.77** | 1.40 | light, base/dark | `crypto-lab-lll-break/src/style.css:174` | 2 |
| 96 | frodo-vault | `select` | `--line` | `#2f3f58` | `#06090f` (grad) | **1.87** | 1.39 | base/dark, light | `crypto-lab-frodo-vault/src/style.css:191` | 1 |
| 97 | kyber-vault | `textarea` | `--line` | `#2f3f58` | `#06090f` (grad) | **1.87** | 1.25 | base/dark, light | `crypto-lab-kyber-vault/demos/kyber-vault/src/style.css:438` | 0 |
| 98 | protocol-compose | `textarea` | `--line` | `#a9bfd6` | `#ffffff` (grad) | **1.89** | 1.66 | light, base/dark | `crypto-lab-protocol-compose/src/style.css:166` | 2 |
| 99 | encrochat | `.compose input[type="text"]` | `--border-strong` | `#a9c1b6` | `#ffffff` | **1.91** | 1.57 | light, base/dark | `crypto-lab-encrochat/src/style.css:313` | 0 |
| 100 | ntru-classic | `input` | _literal_ | `#304158` | `#060911` (grad) | **1.92** | 1.15 | single | `crypto-lab-ntru-classic/src/style.css:137` | 0 |
| 101 | dp-noise | `select` | `--border-strong` | `#573950` | `#100a0f` | **1.96** | 1.75 | base/dark, light | `crypto-lab-dp-noise/src/style.css:327` | 1 |
| 102 | mpcith-sign | `input` | `--border` | `#1f4a60` | `#07131b` (grad) | **1.97** | 1.55 | dark | `crypto-lab-mpcith-sign/src/style.css:215` | 1 |
| 103 | mayo-seal | `input[type="text"]` | `--border-strong` | `#b3bb92` | `#ffffff` | **2.01** | 1.81 | light, base/dark | `crypto-lab-mayo-seal/src/style.css:291` | 2 |
| 104 | lms-xmss | `input` | _literal_ | `#274868` | `#080f17` (grad) | **2.03** | 1.40 | single | `crypto-lab-lms-xmss/src/style.css:201` | 1 |
| 105 | timing-sidechannel | `input[type="text"]` | `--border` | `#c2ac88` | `#fffaf0` | **2.11** | 1.67 | base/dark, dark | `crypto-lab-timing-sidechannel/styles/main.css:260` | 1 |
| 106 | salamander | `#app input[type="text"]` | `--border-strong` | `#a9b2bd` | `#ffffff` | **2.15** | 1.89 | light, base/dark | `crypto-lab-salamander/src/style.css:237` | 1 |
| 107 | power-trace | `input[type="text"]` | `--border` | `#bfa982` | `#fffaf0` | **2.19** | 1.65 | light | `crypto-lab-power-trace/styles/main.css:219` | 0 |
| 108 | beacon-lock | `#app input[type="text"]` | `--border-strong` | `#574d3d` | `#100f0c` | **2.31** | 1.94 | base/dark, base/light, light | `crypto-lab-beacon-lock/src/styles.css:393` | 2 |
| 109 | matsui-line | `#app select` | `--border-strong` | `#a3a8d4` | `#ffffff` | **2.31** | 1.92 | light, base/dark | `crypto-lab-matsui-line/src/style.css:903` | 1 |
| 110 | timing-oracle | `input` | `--border` | `#b6a486` | `#fffaf1` | **2.34** | 1.57 | base/dark | `crypto-lab-timing-oracle/styles/main.css:211` | 0 |
| 111 | merkle-vault | `textarea` | `--border` | `#a79d89` | `#ffffff` (grad) | **2.68** | 1.90 | light, dark | `crypto-lab-merkle-vault/src/style.css:403` | 1 |
| 112 | accumulator | `#app input[type="text"]` | `--border-strong` | `#456175` | `#0a1119` | **2.91** | 2.43 | base/dark, base/light, light | `crypto-lab-accumulator/src/styles.css:271` | 1 |

## Repos that pass

aegis-gate*, aes-modes*, ascon*, bb84*, bcrypt-forge*, biham-lens*, bitcoin-script*, blind-sign*, bulletproofs*, chacha20-stream*, ciphertext-mirror*, ckks-lab*, commit-gate*, credential-veil, curve-lens*, curve448*, dkg-gate*, drbg-arena*, e91*, ec-point-arithmetic*, ecdsa-forge*, ed25519-forge*, elgamal-plain*, format-ward*, frost-threshold*, garbled-gate*, ghost-commit, hybrid-guide*, kdf-chain*, mac-race*, otp-vault*, paillier-gate, webauthn.

`*` = carries the `Raise control-boundary contrast` commit.

## Repos where control borders are not load-bearing (no change needed)

No CSS rule targeting a text input, textarea or select in these repos declares a visible border,
so there is no border token to raise. Note this is **not** a clean bill of health for 1.4.11: several
of them (e.g. `jwt-forge`, whose `.card textarea` is `border: 0`) delineate the control by fill alone,
and that fill may itself sit under 3:1 against its container. That is a different defect with a
different fix and was out of scope here.

corrupted-oracle*, downgrade-wire, grover*, harvest-vault, hqc-timing, hqc-timing-break, hybrid-pqc, iron-letter, isogeny-gate, jwt-forge, kem-trap, kyberslash, lattice-fault, model-breach, oblivious-shelf, patron-shield, pki-chain, poly1305-mac*, pq-tls-handshake, quantum-entropy, ratchet-wire, reshare-circle, shadow-vault, silent-tally, simon-period, snark-arena, ssh-handshake, tls-handshake, x3dh-wire, zk-arena.

## Not evaluated

- **blind-oracle-api** — no html file outside build dirs. No HTML or CSS exists outside build output, so there was nothing to measure.

## Method

Reproduce with the scripts in this session's scratchpad (`collect.js`, `measure2.js`, `analyze.js`, `verify.js`).

1. **Assemble a page per repo.** For each repo, take the shallowest `index.html` outside build
   directories, inline every stylesheet it actually loads (`<link rel=stylesheet>`, plus `.css`
   imported by its entry module), and strip `<script>`. 175 of 176 repos yielded a page.
2. **Load it in headless Chromium** (Playwright 1.62 / Chromium 1234) so the browser — not a regex —
   resolves `var()`, `color-mix()`, `oklch()`, alpha compositing and the cascade.
3. **Enumerate theme states.** Every `[data-theme="X"]` value found in the CSS is applied to
   `<html>` in turn, with `prefers-color-scheme` emulated to match. The bare `:root` state is also
   scored whenever it is reachable — i.e. unless the repo defines *both* a light and a dark override
   block *and* its boot script always sets one of them. (Getting this wrong initially hid ~7 real
   failures in labs whose `:root` block *is* the light theme.)
4. **Find control rules.** Every CSS rule declaring a border is classified by the tokens of its
   subject compound. Rules in a `:hover` / `:focus` / `:active` / `:disabled` state are skipped —
   those are separate success criteria.
5. **Synthesise a probe.** For each control rule, build a DOM chain matching its selector
   (`.field-row input` -> `<div class="field-row"><input></div>`), insert it into the live page, and read
   `getComputedStyle`. Because the probe sits in the real document with the theme attribute set,
   base rules **and** any `[data-theme=...]` rule further down the file both apply, so what is measured
   is the effective computed value, never the base rule in isolation. This is what keeps the six
   fragile repos honest — `hybrid-guide` passes on exactly this basis.
6. **Build the surface palette.** Candidate adjacent colours are the composited `html`/`body`
   background, the background of every container-ish rule, colour stops of container gradients, and
   every `:root` custom property whose *name* denotes a surface. Semantic fills (`--btn-*`,
   `--accent-*`, state colours) are excluded — leaving them in produced false **passes**, because a
   grey border trivially clears 3:1 against a saturated button colour it never touches.
7. **Load-bearing gate.** For each surface, the control fill is composited over it and
   `contrast(fill, surface)` computed. Only surfaces where that is **< 3:1** are scored: if the fill
   already clears 3:1 the border is not the thing delineating the control, and on a surface the
   control never sits on, the ratio is meaningless. Decorative borders (cards, panels, `hr`, table
   rules, dividers) are never classified as controls and were never measured.
8. **Failure test.** A control fails only if, across **every** surface it is load-bearing against,
   the border is under 3:1. A single qualifying surface at >=3:1 clears it. This is deliberately
   conservative — it under-reports rather than manufacturing work.
9. **Contrast maths.** WCAG 2.x relative luminance: channel/255, linearised as
   `c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4`, weighted `0.2126/0.7152/0.0722`, ratio
   `(L1+0.05)/(L2+0.05)`. Semi-transparent borders and fills are composited over their backdrop first.
10. **Source verification.** Every reported failure is then checked against the repo's own
    TS/JS/HTML: the failing class or id must actually be applied to an `<input>`, `<textarea>`,
    `<select>`, `<button>` or `<summary>`. This demoted 3 repos to pass and dropped 23 individual
    findings (see below). The file:line comes from a brace-scan of the stylesheet, matching the
    normalised selector and the first border declaration in its block.

### Validation

The 33 repos with a `Raise control-boundary contrast` commit are the control group. They come back
28 PASS + 1 PASS-after-verification + 3 no-bordered-control + 1 FAIL. The single failure,
`hash-zoo`, is a genuine incomplete fix, confirmed by reading the commit: `a8e4d7d` moved `textarea`,
`.lext-field input` and `.tab` onto the new `--border-strong` token but left `#intro-input`
(`src/style.css:283`, a real `<input id="intro-input">` in `src/ui.ts:161`) on the old `--border`.
A method that flags 1 of 33 known-good repos, for a defect that survives manual reading, is calibrated
about right.

## What I measured vs. what I inferred

**Measured:** every colour value and contrast ratio in the table. These are computed-style reads from
a real browser with the real cascade, not hand-parsed hex.

**Inferred, and the places it can be wrong:**

- **The controls are not the rendered ones.** Every lab is a Vite app whose UI is built by JS at
  runtime; `vite` is not installed in any repo's `node_modules` and `dist/` is stale (built 23 Jul,
  before the 1 Aug fixes), so the live DOM could not be rendered. Loading the static HTML gave a
  median of one control per lab. Everything here is therefore measured at the **CSS rule** level via
  synthesised probes. A rule that is authored but never matched by any rendered element would be
  reported as a failure it is not. Source verification (step 10) is what bounds this risk, and it is
  why every row names a selector and a file:line you can check in seconds.
- **Which surface is truly adjacent.** The palette is a candidate set, not a layout fact. Mitigated by
  reporting the *best* case and by the load-bearing gate, but a repo whose controls sit on a surface
  no rule names could be scored against the wrong colour. Rows marked `(grad)` are the weakest:
  the adjacent colour there is a gradient stop, so the real ratio varies across the control.
- **Buttons and tabs are excluded from the verdict.** Their borders were measured but are reported
  only as advisory (below). A button with a visible text label is generally identifiable without its
  boundary, and the earlier pass explicitly reasoned the same way ("Buttons already use the #2382a6
  rim ... and are unaffected"). Extending the verdict to buttons would roughly double the list on a
  judgement call that is the maintainer's to make, not mine.

### Findings dropped by source verification

These measured under 3:1 but the selector's subject is not an interactive control. Listed so the
exclusions are auditable rather than silent.

| repo | selector | resolved to | note |
|---|---|---|---|
| card-trick | `.field-value` | NOT-A-CONTROL (<code>) | display element ((<code>)), not a control |
| chacha20-stream | `.field-value` | NOT-A-CONTROL (<span>) | display element ((<span>)), not a control |
| credential-veil | `.credential-card .cred-field` | NOT-A-CONTROL (<div>) | display element ((<div>)), not a control |
| envelope-kms | `.insp-field` | NOT-A-CONTROL (<div>) | display element ((<div>)), not a control |
| hash-zoo | `.slider-value` | NOT-A-CONTROL (<output>) | display element ((<output>)), not a control |
| hybrid-wire | `.combiner-input` | NOT-A-CONTROL (<div>) | display element ((<div>)), not a control |
| hybrid-wire | `.combiner-input.blue` | NOT-A-CONTROL (<div>) | display element ((<div>)), not a control |
| hybrid-wire | `.combiner-input.purple` | NOT-A-CONTROL (<div>) | display element ((<div>)), not a control |
| lms-ledger | `.toggle-slider` | NOT-A-CONTROL (<span>) | switch/slider track — a judgement call, arguably the control's whole affordance |
| mpcith-sign | `.zk-slider` | NOT-A-CONTROL (<div/p/span>) | switch/slider track — a judgement call, arguably the control's whole affordance |
| mpcith-sign | `.zk-slider-fixed` | NOT-A-CONTROL (<p>) | display element ((<p>)), not a control |
| musig-gate | `.field-value` | NOT-A-CONTROL (<code>) | display element ((<code>)), not a control |
| nonce-collision | `.switch .slider` | NOT-A-CONTROL (<span>) | switch/slider track — a judgement call, arguably the control's whole affordance |
| schnorr-forge | `.field-value` | NOT-A-CONTROL (<code/div>) | display element ((<code/div>)), not a control |
| syndrome-hints | `.algo-select` | NOT-A-CONTROL (<fieldset>) | display element ((<fieldset>)), not a control |
| syndrome-hints | `.slider-out` | NOT-A-CONTROL (<output>) | display element ((<output>)), not a control |
| webauthn | `.signed-field` | NOT-A-CONTROL (<span>) | display element ((<span>)), not a control |
| webauthn | `.signed-field.highlight-origin` | NOT-A-CONTROL (<span>) | display element ((<span>)), not a control |

The `.slider` / `.toggle-slider` rows are the debatable ones: in `lms-ledger`, `nonce-collision` and
`mpcith-sign` those spans are the visible track of a CSS toggle switch whose real `<input
type=checkbox>` is visually hidden. If you count the track as the control, those three repos gain a
failure. I left them out because the switch also carries a filled knob and an adjacent label.

### Advisory: button / tab borders under 3:1

Measured but deliberately not counted in the verdict, for the reason given above.

**Fleet-wide, one decision.** 175 of 176 repos have a failing button border, but in
18 of them the *only* offender is the shared header's own theme toggle: `.cl-btn` is
`border: 1px solid color-mix(in srgb, var(--accent) 38%, transparent)`, which lands at 2.4-2.5:1 against
the fixed `#0b1512` bar in essentially every lab that carries the header. That is one shared snippet
copied 170-odd times, not 170 independent defects, and it is a single judgement to make.

**Lab-specific button/tab borders under 3:1** (157 repos), if you decide buttons are in scope:

ablation-wire, accumulator, aes-modes, babel-hash, bcrypt-forge, beacon-lock, biham-lens, bike-vault, bitcoin-script, bitcoin-wallet, blind-hello, blind-oracle, blind-relay, blind-sign, broken-trust, bulletproofs, card-trick, chacha20-stream, chain-of-trust, ciphertext-mirror, ckks-lab, collision-vault, credential-veil, curve-lens, dead-sea-cipher, diffie-hellman-mitm, dilithium-reject, dilithium-seal, downgrade-wire, dp-noise, drbg-arena, e91, encrochat, enigma-forge, entropy-collapse, envelope-kms, falcon-seal, fhe-arena, format-ward, frodo-vault, frost-threshold, frozen-heart, garbled-gate, gg20-wallet, ghost-commit, harvest-timeline, harvest-vault, hash-zoo, hawk, hpke-envelope, hqc-timing, hqc-timing-break, hqc-vault, hybrid-guide, hybrid-pqc, hybrid-sign, hybrid-wire, ibe-gate, icy-dvrf, iron-serpent, isogeny-atlas, isogeny-gate, j-uniward, jevil, jwt-forge, kdf-arena, kdf-chain, kem-trap, kerberos, key-exchange, key-mirror, kyber-vault, kyberslash, lattice-fault, lattice-gentle, lll-break, lms-ledger, lms-xmss, lwe-hints, mac-race, matsui-line, mceliece-gate, merkle-proofs, merkle-vault, mls-group, model-breach, mpcith-sign, multivariate, musig-gate, noise-pipe, nonce-collision, nonce-guard, nonce-lattice, ntru-classic, oblivious-shelf, opaque-gate, oram-vault, ot-gate, otp-vault, padding-oracle, pairing-gate, pake-gate, patron-shield, phantom-vault, pki-chain, power-trace, pq-families, pq-rotation, pq-tls-handshake, protocol-checker, protocol-compose, psi-gate, quantum-entropy, quantum-vault-kpqc, ratchet-wire, reshare-circle, ring-sign, rsa-educational, rsa-forge, salamander, schnorr-forge, scloud-vault, search-vault, shamir-gate, shamir-vs-frost, shor, signed-bytes, simon-period, snark-arena, spake-gate, spdz-forge, sphincs-ledger, ssh-handshake, stark-tower, stego-suite, stream-ward, syndrome-drain, syndrome-hints, threshold-decrypt, threshold-mldsa, time-lock-puzzle, time-trust, timing-oracle, timing-sidechannel, tls-handshake, traitor-trace, vdf, vigenere-break, vrf-gate, vss-gate, web-of-trust, webauthn, world-ciphers, world-hashes, x3dh-wire, zk-arena, zk-proof-lab.

## Per-repo caveats

| repo | caveat |
|---|---|
| blind-oracle-api | Not evaluated: no HTML or CSS outside build output. |
| ablation-wire | Stylesheet not reachable from a `<link>` or entry import; used every `.css` in the repo instead. Extra rules could be in scope that the page never loads. |
| pairing-gate | Stylesheet not reachable from a `<link>` or entry import; used every `.css` in the repo instead. Extra rules could be in scope that the page never loads. |
| ablation-wire | Rust/wasm lab; all CSS is one inline `<style>` in `web/index.html` (hence the fallback above). Measured, fails, file:line points into that block. |
| vrf-gate, hawk, key-exchange, pq-families, web-of-trust, threshold-mldsa, stark-tower, zk-proof-lab, diffie-hellman-mitm, jevil, vss-gate, stego-suite, phantom-vault, threshold-decrypt, world-hashes, envelope-kms, multivariate, pq-rotation, frodo-vault, kyber-vault, protocol-compose, ntru-classic, mpcith-sign, lms-xmss, merkle-vault | Best-case adjacent colour is a gradient stop; the real ratio varies across the control. |

No repo was skipped silently. Every one of the 176 is in exactly one of: the failure table, the pass
list, the not-load-bearing list, or the not-evaluated list.
