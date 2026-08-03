# Verification-integrity pass — 2026-08-02

Two silent-wrongness bugs in the fleet's own test harness, both found while fixing
something else, both now closed.

## 1. Playwright served a possibly-stale bundle (163 repos)

`webServer.command` ran `npm run preview` without building. `preview` serves whatever is in
`dist/`, so a run tested an arbitrary bundle — and a build that FAILED left the last good
bundle in place, so the suite passed green against source that no longer compiled. That
silently invalidates mutation checking, the technique this project uses to prove a test has
teeth. It produced two false "verified" results in one session.

Fix: `command: 'npm run build && npm run preview -- --port NNNN --strictPort'`. A compile
error now aborts the run ("Process from config.webServer was not able to start"). Applied
across the fleet with the guard demonstrated per repo — inject a type error, confirm abort,
restore, confirm green.

**It was not hypothetical.** The pass caught it producing wrong results in four repos:
- `silent-tally` — Exhibit 6 shipped WCAG failures in BOTH themes in `f94b1b6`; the gate
  never saw them because it scanned a stale bundle. Fixed in `9df313c` (dark used
  `.text-gray-600`, darker than the `.text-gray-500` this stylesheet already lifts for the
  same reason; light used `.text-amber-400/90`, a different class the light remap never
  covered, over a `.bg-amber-950/20` panel that composites to muddy grey-brown).
- `dp-noise` and `credential-veil` — both FAILED their baselines against stale bundles and
  passed immediately after a rebuild with no source change. Nearly written off as
  pre-existing-red.
- `spdz-forge` — a stale `dist/` was manufacturing a red a11y result.

Five repos had no typechecking at all (`falcon-seal`, `format-ward`, `hqc-vault`,
`opaque-gate`, `pki-chain`): bare `vite build`, no `tsc` anywhere including CI, so type
errors shipped and the new guard stayed blind to them. All five typechecked clean, so
`tsc --noEmit &&` was added to their builds, gating what was already true.

Three repos build with bare `vite build` and were left alone by the fleet pass
(`stark-tower`, `stego-suite`, `zk-proof-lab`) — their type coverage rests on a separate
`typecheck` script; the guard still catches build-breaking errors there, just not type-only
ones.

## 2. Shared preview ports let one demo scan another's page (74 repos)

Ports were hardcoded and duplicated — one port was used by 15 demos. With
`reuseExistingServer: !process.env.CI`, a leftover server from repo A was silently reused by
repo B, so **B's tests scanned A's page**. `bb84` reported accessibility violations that
actually belonged to `kdf-chain`. All 158 repos now hold a unique port; a fleet scan
confirms zero collisions.

Partial accidental protection existed — the `/crypto-lab-<slug>/` base path usually makes a
squatter 404 rather than serve a wrong page — but bb84 proves it is not reliable, and it
would not protect two repos sharing a base path at all.

`ghost-commit` already carried a comment explaining this exact bug class and hardening
against port 4173 specifically — but it had been assigned 4287, which collided anyway. The
reasoning was right and the check was too narrow.

**Why this was not a fleet-wide `sed`:** three repos contain digit strings that look like a
port and are not — an LCG constant `1013904223` in `e91`, a SHA-512 known-answer vector
containing `4173` in `frozen-heart`, and a Cargo.lock checksum in `frost-threshold`. A blind
replace would have silently corrupted a KAT, which is the same failure mode this whole pass
exists to eliminate.

## Genuine pre-existing reds, documented and left for a deliberate pass

- `bike-vault` — 12 real light-theme colour-contrast violations in `a11y-dynamic.spec.ts`,
  confirmed against a clean rebuild.
- `x3dh-wire` — axe `scrollable-region-focusable` (serious) in both themes, fresh build.
- `webauthn` — its Playwright a11y gate is green; a separate puppeteer `test:e2e` fails
  reproducibly at passkey creation, independent of this work. Its config fix is ready to
  re-apply once that gate is repaired.
