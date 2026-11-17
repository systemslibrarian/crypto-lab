# Correction record: accessible-name commit claims, 16 November 2026

A fleet pass on 16 November 2026 added an accessible-name assertion
(`e2e/control-names.ts`) to every gated lab, because axe's `label` rule accepts a bare
`placeholder` as a last-resort accessible name and a deleted label could therefore leave a
gate green. **The assertion itself is sound and is not in question here** — it was proven to
bite in `crypto-lab-world-ciphers` and again in `crypto-lab-ascon` and
`crypto-lab-research-explorer`, each time with axe's own `label` rule passing on the same run.

What is wrong is the SCOPE PARAGRAPH in a large number of those commit messages.

**The wording came from the dispatch brief, not from the workers who used it.** The brief
supplied a "HONEST SCOPE FOR THIS LAB" paragraph and a lab classification built by grepping
`src/` and `index.html` for `<input`, `<select`, `<textarea` and `placeholder=`. That grep
cannot see controls created at runtime, which in this fleet is the common case: labs build
them with `el('input', …)` and `document.createElement` helpers. Two workers detected the
error from the inside and reported it rather than writing the paragraph; the classification
was then withdrawn. Pushed history has NOT been rewritten and no per-lab follow-up commits
were made, by instruction.

## A. Demonstrably false: 12 commits say the lab ships no form control, and it does

Each of these carries "it currently ships no form control at all … So this assertion finds
nothing today and is a regression guard for the first control anyone adds, not a fix."
Each lab builds form controls at runtime:

| lab | commit | runtime control construction found |
|---|---|---|
| `crypto-lab-attestation-gate` | `1dc26b1` | src/ui/panels/sealed.ts:129 `el('input'`, src/ui/panels/breakit.ts:45, src/ui/panels/boot.ts:303 |
| `crypto-lab-otp-vault` | `1dd397d` | src/ui/importPanel.ts:28 `el("textarea"`, :29, src/ui/priorComparison.ts:7 |
| `crypto-lab-pake-gate` | `1fbf7c7` | src/ui/dom.ts:85 `createElement("textarea"`, :118, src/ui/tabView.ts:312 |
| `crypto-lab-polynomial-forge` | `775c06c` | src/ui/dom.ts:112 `el('input'`, :124, src/ui/act-commit.ts:24 |
| `crypto-lab-power-trace` | `4cc7e01` | src/ui/cache.ts:6 `el("input"`, src/ui/ui.ts:96, :215 |
| `crypto-lab-pulse-chain` | `a49ba61` | src/ui/verdict.ts:79 `el('input'`, src/ui/dom.ts:158, :173 `el('select'` |
| `crypto-lab-rekey-relay` | `0a41e3c` | src/ui/relay.ts:59 `el('textarea'` |
| `crypto-lab-reshare-circle` | `bcc3a48` | src/ui/cheat.ts:26 `el('input'`, src/ui/adversary.ts:158, src/ui/breakit.ts:59 |
| `crypto-lab-return-path` | `5102e18` | src/ui/boomerangPanel.ts:85 `el('select'`, src/ui/decayPanel.ts:95, src/ui/switchPanel.ts:140 |
| `crypto-lab-rsa-educational` | `c24ee73` | src/ui/keygen.ts:22 `el('input'`, :23, :24 `el('select'` |
| `crypto-lab-sm9-forge` | `2596bb9` | src/ui/lab.ts:303 `el('textarea'`, src/ui/dom.ts:175, :394 |
| `crypto-lab-accumulator` | `89c1c8c` | src/ui/dom.ts:182 `el('input'`, :192 `el('select'`, src/ui/nav.ts:48 |

In every case the GATE RESULT is still valid — green means no rendered control is named only
by a placeholder or a title. Only the scope paragraph is false.

## B. Unevidenced, not disproved: 6 commits

The same paragraph, where a wide runtime-construction probe (`el(`, `createElement(`,
`insertAdjacentHTML`) found nothing. The claim may well be true, but source text is not
evidence about the rendered DOM, so it is unsupported as written:

| lab | commit |
|---|---|
| `crypto-lab-corrupted-oracle` | `794d37e` |
| `crypto-lab-dnssec-chain` | `6d25629` |
| `crypto-lab-salamander` | `e083ff0` |
| `crypto-lab-saml-binding` | `c252227` |
| `crypto-lab-schnorr-forge` | `e7663a0` |
| `crypto-lab-protocol-checker` | `7161d03` |

For `crypto-lab-protocol-checker` the probe's three hits were `<select>` inside
`src/style.css`, i.e. CSS, not control construction — a false positive in the probe, not
evidence of controls.

## C. The wider class: 128 commits assert a control count or placeholder absence

Of 219 pushed commits in this pass, 18 are category A, **128 state a control count or that a
lab has "no `placeholder` attribute anywhere in `index.html`/`src/`"**, and 73 use
evidence-only wording. The 128 are not false in the way A is — most do ship controls — but
the number and the placeholder-absence clause come from the same grep and carry the same
defect. The clause "every rendered control already takes its name from one of the four real
mechanisms" IS backed by that lab's green gate run; the count beside it is not.

## What settles this

A follow-up pass will add a sightings instrument to the canonical `control-names.ts`: report
the number of controls checked per scan alongside the failures, and fail the gate if a lab
with known runtime controls reports zero. It lands once in the canonical module and rolls out
as byte-identical copies, not forked per worker. **This record is to be updated with the
measured counts when that pass lands**, which also settles the six labs in section B with a
number instead of a grep.

Until then, treat the scope sentence in any commit from this pass as unverified, and the gate
result in all of them as verified.

---

## UPDATE, 16 November 2026, later the same day: measured counts are now in

The sightings evidence arrived earlier than the dedicated pass, because the batch-6 worker
instrumented a temporary rendered-DOM probe on every surface its gates drive, ran it per lab,
and removed it before each commit. **That measurement supersedes the source-grep
classification in sections A and B for the labs it covers.**

### Fleet result

**434 distinct rendered controls across 37 labs, and 0 named by a placeholder or a title
alone.** No accessibility defect was found anywhere in this pass. The assertion's verdict was
correct in every lab; only the scope prose was wrong.

### Section A labs, now confirmed against the rendered DOM

| lab | commit | distinct controls rendered | verdict |
|---|---|---|---|
| `crypto-lab-otp-vault` | `1dd397d` | **29** | FALSE |
| `crypto-lab-reshare-circle` | `bcc3a48` | **36** | FALSE |
| `crypto-lab-polynomial-forge` | `775c06c` | **16** | FALSE |
| `crypto-lab-pulse-chain` | `a49ba61` | **13** | FALSE |
| `crypto-lab-return-path` | `5102e18` | **11** | FALSE |
| `crypto-lab-power-trace` | `4cc7e01` | **10** | FALSE |
| `crypto-lab-pake-gate` | `1fbf7c7` | **9** | FALSE |
| `crypto-lab-schnorr-forge` | `e7663a0` | **9** | FALSE |
| `crypto-lab-rsa-educational` | `c24ee73` | **6** | FALSE |
| `crypto-lab-salamander` | `e083ff0` | **5** | FALSE |
| `crypto-lab-sm9-forge` | `2596bb9` | **5** | FALSE |
| `crypto-lab-protocol-checker` | `7161d03` | **2** | FALSE |
| `crypto-lab-rekey-relay` | `0a41e3c` | **1** | FALSE |

### Three labs move out of section B, and one is confirmed

- `crypto-lab-schnorr-forge` (9 controls), `crypto-lab-salamander` (5) and
  `crypto-lab-protocol-checker` (2) were listed as "unevidenced, not disproved". They are now
  **demonstrably FALSE**, measured in the DOM. For protocol-checker this also retires the note
  that its probe hits were CSS false positives: the CSS hits were indeed spurious, and the lab
  nevertheless renders 2 controls.
- `crypto-lab-saml-binding` is **confirmed TRUE**: 0 controls across 13 surfaces.
- `crypto-lab-corrupted-oracle` and `crypto-lab-dnssec-chain` remain source-verified only —
  the batch-5 worker re-grepped the bare tokens and read every match by hand, finding only
  prose and identifiers. Strong, but not a DOM measurement. They are the only two of the
  eighteen still resting on source evidence.

**Revised totals for the 18: 15 false, 3 true** (1 DOM-proven, 2 source-verified).
`crypto-lab-attestation-gate` and `crypto-lab-accumulator` are false on named call sites
rather than a DOM count, their batches having finished before the probe existed.

### Root cause, identified

A source grep cannot see these controls because the tag is a function argument:
labs build them through `el(tag, attrs)` helpers (`src/ui/dom.ts` in otp-vault, search-vault
and others), with names supplied by sibling helpers such as `labelled(text, control)` which
emit `el('label', {for: id, text})`. Four further blind spots in the same classification:
nested project roots (`web-demo/`, `demos/<lab>/`, `ratchet-wire/`), `exhibits/*.html`,
`src-ts/`, and multi-line `<input\n` formatting. The grep was not merely unlucky; it was the
wrong instrument for this fleet.

### Scale of the misclassification

The withdrawn tier claimed 93 labs ship no form controls. Measured and hand-checked across
the batches that reported: **batch 6 found 37 of its 41 ship controls** (its own grep had said
9 of 45 — wrong on 28 more), **batch 5 found 41 of 46**, and batch 4's spot census found
`crypto-lab-vigenere-break` renders **11** controls where the grep saw one `<input`. Treat the
original 93 as discarded rather than merely uncertain.

### Still owed

The canonical `control-names.ts` does not yet report sightings; batch 6's probe was temporary
and is not in any committed file. The queued pass still has to land it once in the canonical
module — counts reported per scan alongside failures, and the gate failing if a lab with known
runtime controls reports zero — then roll out copies, formatted per lab (see below). The
two remaining source-verified labs above are settled by that pass.

### Copies are formatted per lab, and are not expected to match byte for byte

Recorded 2026-11-17. The rollout copied one canonical `e2e/control-names.ts` into **241**
labs and the file was byte-identical in every one of them — including its home,
`crypto-lab-schnorr-forge`, which `audits/_MASTER-TEMPLATE.md` §351-353 names as the source
for `a11y.spec.ts` and its companions.

It had never been run through a formatter, because schnorr-forge has no Prettier dependency
and neither do **229** of the 241 labs that received it. Nothing checked, so nothing went
red there. The **12** labs that do run Prettier could check, and **11** of them failed their
own Format or lint step, which skipped the deploy behind it — for a day in most cases. The
live sites were never stale; the gates were simply red. Each was formatted in its own repo,
one commit per lab, on 2026-11-17.

So byte-identity across copies is NOT an invariant and should not be asserted by a future
sweep or checker. It cannot hold: per-lab Prettier configuration differs, and
`crypto-lab-blind-oracle` pins `"semi": false`, so its correctly-formatted copy carries 44
fewer semicolons than a copy formatted under a `semi: true` config. Nothing in the hub
currently asserts identity — checked — and nothing should start.

The canonical copy in schnorr-forge is deliberately left unformatted. Adding a formatter to
a lab in order to satisfy a fleet rule is forbidden by CLAUDE.md's standing rules, and a lab
with no formatter takes the file as-is. A future rollout therefore starts from unformatted
canonical bytes and formats on arrival, per lab.
