# Resume notes — paused 2026-08-01

Session paused for credit. Everything committed is pushed. Nothing is lost.

## State

- **176 repos, 0 committed-but-unpushed.**
- All three catalog checkers clean: `readme-sync`, `corpus-sync`, `concept-sync`.
- 8 agents were stopped mid-flight. Their **finished** commits were pushed (10 repos).
  Their **unfinished** edits are still sitting in working trees — see below.

## 21 repos with uncommitted agent work-in-progress

These are partial edits from agents that were killed mid-task. They are on disk,
unstaged, and **not** verified. Do not assume they are correct or complete.

```
bb84  biham-lens  bitcoin-wallet  card-trick  curve-lens  gg20-wallet  hawk
hqc-timing  ibe-gate  kdf-arena  kyberslash  nonce-lattice  opaque-gate
padding-oracle  simon-period  spdz-forge  threshold-decrypt  threshold-mldsa
vrf-gate  web-of-trust  zk-arena
```

For each, next session should either finish the work (`git diff` shows what the agent
was doing) or `git checkout --` to discard it. Two worth knowing about specifically:

- **`hawk`** — was mid-fix on a genuinely flaky test. `scripts/verify-phase4.ts:142`
  inflates a lattice vector by a hardcoded `+80` per coordinate and asserts it exceeds
  the acceptance bound. Both the vector and the bound are freshly random per run, so it
  passes or fails by luck. It passed CI and failed Deploy on the same commit. The fix is
  to derive the offset from the measured norm at runtime. The agent had just reached its
  200-trial proof run when stopped.
- **`zk-arena`** — was adding disclosure + a realistic-size mode for the toy group
  (Pohlig–Hellman recovers bits from the public key alone). It reported 30 UI checks
  passing and was verifying a trusted-setup bug when stopped.

## Work that was in flight and did NOT finish

1. **Fleet flaky-test sweep** — reconnaissance only, no results returned. Worth
   redoing: statistical tests with fixed thresholds, timing assertions, unseeded
   keygen inside assertions. Also asked it to flag *vacuous* tests (ones that would
   pass even if the code were broken).
2. **5 batch audits for falsifiable claims** — batches in the session scratchpad
   (`batchaa`..`batchae`). Partial results landed as the 10 pushed commits. Most of the
   fleet was not reached.
3. **Non-automatable accessibility audit** — meaningless alt text, canvas-only lessons,
   color-as-sole-indicator, keyboard traps. axe already passes fleet-wide; this was
   after the ~65% axe cannot see. No results returned.

## Open decisions (mine to recommend, yours to make)

1. **8 fully-merged local branches** — 7 named `crypto-accuracy-audit` (noise-pipe,
   nonce-guard, nonce-lattice, oblivious-shelf, opaque-gate, oram-vault, ot-gate) plus
   `dp-noise/teaching-lab-restructure`. All 0 commits ahead of `main`. Deleting loses
   nothing. Also an obsolete `dp-noise` stash (a README edit already superseded).
2. **`.gitattributes` fleet-wide** — optional. The index is already clean (exactly ONE
   tracked CRLF file fleet-wide). `core.autocrlf=input` already blocks new CRLF.
3. **1,360 cosmetic CRLF-on-disk files** across 126 repos — recommend leaving them.
   Invisible to git, no functional impact. The only 3 that actually broke were shell
   scripts, already fixed.

## Known environment problem

**`node_modules/.bin` is empty in every repo** — the symlinks did not survive the
Windows-to-Mac copy. This is why no agent this session could run `vitest`, `tsx`, or
`vite` locally. It is not only the win32-x64 binary mismatch. A fresh `npm ci` per repo
would fix it; nobody was authorized to run one.

Consequence worth remembering: **local test failures went unnoticed for weeks.**
`format-ward`'s suite was red (28/30) from a domain-floor change, and nothing caught it
because nothing could run it. CI does run these suites on push, so CI is the real gate.

## Verification habits that paid off this session

- CI on push runs `npm ci && typecheck && test && build && test:a11y` before Pages
  deploys, so a bad push degrades to a no-op rather than breaking a live demo.
- Two external AI reviews found in-repo turned out to be **already remediated**. Check
  before acting on a stale finding.
- Agents corrected me on real facts more than once (supersingular class counts over
  GF(419); the FF3-1 attack attribution). Verify their corrections independently —
  both of those checked out.
