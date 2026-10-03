# Dependency majors — plan for a dedicated session

**Written 2026-10-03. Nothing here has been started.** This is the plan for the 82 open
major-version Dependabot pull requests across the fleet, plus two items that are not
`@noble` and do not belong in the same pass.

The 82 are not a backlog in the sense of neglected work. `audits/_MASTER-TEMPLATE.md` §6.1
deliberately leaves majors ungrouped so that "a major that breaks the lab fails the gate and
the PR stays open for a human". The system is doing what it was built to do. What follows is
the human.

---

## 1. The `@noble/*` family — 31 PRs, one codemod

This is the high-value target and the only group where a scripted pass is appropriate.

| Package | Open PRs | Target |
|---|---:|---|
| `@noble/hashes` | 14 | 2.4.0 |
| `@noble/curves` | 10 | 2.4.0 |
| `@noble/ciphers` | 4 | 2.4.0 |
| `@noble/secp256k1` | 2 | 3.2.0 |
| `@noble/ed25519` | 1 | 3.2.0 |

### What breaks

The v2 line removed the per-algorithm export subpaths. Confirmed on
`crypto-lab-accumulator#16`, whose build fails with:

```
Error: "./sha256" is not exported under the conditions ["node", "development", "import"]
```

So `@noble/hashes/sha256` has to become `@noble/hashes/sha2`, and the named exports move with
it. This is an import-path change, not a semantic one — which is exactly what makes a codemod
appropriate here and nowhere else in this document.

### Order, and why

1. **`@noble/hashes`** first. It is the largest group, and `curves` and `ciphers` depend on
   it, so a lab bumping curves while still on hashes v1 can end up with both majors resolved
   in one tree. Landing hashes first means every later bump sees a consistent base.
2. **`@noble/curves`** second, same codemod shape.
3. **`@noble/ciphers`, `@noble/secp256k1`, `@noble/ed25519`** last, as mop-up. Few labs, same
   mechanics, and by then the rewrite is proven.

### Per-lab verification, before any merge

These are **runtime cryptography dependencies, not test tooling**, so a green build is not
evidence. For each lab:

- **Every KAT and published-vector suite green.** These labs assert against NIST, IETF and
  Wycheproof vectors. An import rewrite that silently resolves to a *different* function still
  compiles and still builds — the vectors are the only thing that would notice.
- **`claims.spec.ts` green.** Several labs print digests, keys and signatures on the page.
- **Confirm the codemod did not touch a vectors file.** Where a lab's ground truth is pinned
  hex, the rewrite must not have rewritten the truth it is checked against.
- **Served bytes after deploy**, not the workflow's opinion. §6 of the master template, and the
  rule this repository keeps relearning.
- Re-run `catalog-evidence verify` at the end: every `file:line` anchor into these labs can
  move when imports are rewritten.

### Estimate

About half a day for the codemod and all 31 PRs, plus about half a day of verification. One
dedicated session. **Do not interleave it with other work** — a torn snapshot across 31 labs
is far harder to unpick than to avoid.

---

## 2. `crypto-compare` — the audit gate, which is a different problem

`crypto-compare`'s build runs `npm audit --audit-level=low`, and it currently fails on **7
high-severity advisories, all in dev dependencies**. Because that step is in the gate, it
fails **every** Dependabot PR on this repository regardless of what the PR changes. That is
why `#33` is red while having nothing to do with the finding.

| Package | Severity | Fix | Major? |
|---|---|---|---|
| `braces` (root advisory) | high, CVSS 7.5 | via `tailwindcss` 4.3.3 | yes |
| `micromatch`, `fast-glob`, `chokidar`, `tailwindcss` | high | same | yes |
| `eslint-config-next`, `@next/eslint-plugin-next` | high | `eslint-config-next` 14.2.35 | yes |

Root advisory: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) —
braces stack-exhaustion denial of service through deeply nested patterns.

`npm audit fix` fixes **nothing** without `--force`: both remedies are `isSemVerMajor: true`.
There is no lockfile-only patch or minor available, which is why nothing was applied.

### Options, with trade-offs — none applied, pick one

1. **Take the two majors.** `tailwindcss` 4 already has a PR open (`#8`); `eslint-config-next`
   would need one. Clears all 7 and unblocks every other PR on the repo.
   *Cost:* Tailwind 4 is a real migration — the config format changed — so this is a focused
   piece of work, not a bump.
2. **Scope the gate to production dependencies:** `npm audit --omit=dev --audit-level=low`.
   All 7 findings are dev-only, so the gate goes green and keeps judging what ships to users.
   *Cost:* a dev-dependency compromise stops being gated, which matters because dev
   dependencies execute on CI with a token.
3. **Raise the threshold** to `--audit-level=critical`.
   *Cost:* the weakest option. It silences this finding by silencing the class, and a CVSS 7.5
   in a build tool is not nothing.
4. **Move the audit out of the gate** into the weekly fleet job, where it reports without
   blocking merges.
   *Cost:* an advisory can then land on `main` unnoticed for up to a week.

**Recommendation: 2 then 1** — scope the gate to production dependencies now so the repository
is not wedged, and schedule the Tailwind 4 migration as its own piece of work. Option 3 is the
one to avoid: it is the only one that makes the fleet less safe without making anything else
easier.

---

## 3. TypeScript 7 — hold, and do not attempt

4 PRs. The failure is not in the labs:

```
npm error code ERESOLVE
npm error ERESOLVE could not resolve
```

Peer ranges across the ecosystem do not yet accept TypeScript 7. There is no codemod for a
peer-dependency conflict and no lab-side change that resolves it. **Hold until the
dependencies that declare those peers publish ranges that accept 7**, then revisit as an
ordinary bump. Forcing it with `--legacy-peer-deps` would move the breakage from install time
to run time, which is strictly worse.

---

## 4. The rest of the majors

`vitest` 5 and `@vitest/coverage-v8` 5 (25 PRs) fail on a types regression —
`TS2591: Cannot find name 'node:fs'` — which wants `@types/node` or a `types` entry in each
lab's tsconfig. The tsconfig edit is mechanical; the per-lab type errors that surface
afterwards are not, so this is a half-day of attended work rather than a codemod.

`jsdom` 30 (6 PRs) produces unhandled errors inside the Vitest run and needs reading per lab.

`vite` 8 (5 PRs) mostly fails on unrelated gate problems rather than on Vite, and should be
re-measured once the audit gate above is settled.
