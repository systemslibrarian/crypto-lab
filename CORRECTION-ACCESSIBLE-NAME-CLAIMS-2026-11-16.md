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
