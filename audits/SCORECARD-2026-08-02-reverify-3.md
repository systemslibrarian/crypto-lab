# Re-verify pass 3 — 2026-08-02

Re-verification of recovered 2026-08-01 scores against fetched current source.
Assigned demos (15): noise-pipe, nonce-guard, oblivious-shelf, oram-vault, ot-gate,
otp-vault, patron-shield, phantom-vault, pki-chain, poly1305-mac, psi-gate,
quantum-entropy, ratchet-wire, ring-sign, scloud-vault.

Method per demo: `git fetch origin`, read commits since the scoring session, `npm ci`,
check whether the prior justification's named defect still exists in current source,
`npm run build`, serve `dist/`, drive with Playwright chromium.

| demo | HEAD | prior | current | what changed |
|---|---|--:|--:|---|
| noise-pipe | b696d6e | 7 | 8 | 175f67b fixed the named defect: Break-it badges now distinguish held / succeeded / not-applicable / could-not-run instead of rendering every `ok:false` as "Attack succeeded". |
| nonce-guard | 2db23b3 | 8 | 8 | 4ac4e9c converted the Level 2 misattribution from an implied claim into an explicit disclosure; structure unchanged. |

## Per-demo notes

### noise-pipe — 7 -> 8 (HEAD b696d6e)

Prior justification: "Broadest and most KAT-anchored implementation in the cluster; the
walkthrough is a scrubbable replay and one attack card teaches the inverse of what its code
does."

The inverted attack card is fixed. `175f67b` added an explicit `AttackOutcome`
(`held` | `succeeded` | `n/a` | `error`) to `FailureResult` and set it at every return site in
the six simulators, with four distinct badges and neutral (non-verdict) styling for the
non-security outcomes. Confirmed live against the built page:

- rs-swap on XX -> "— Not applicable to this pattern" (previously rendered as "Attack succeeded")
- rs-swap on IKpsk2 -> "Attack failed — defense held", with real `realResponderRS` bytes
- bit-flip on XX -> "defense held", with real ciphertext/tampered-ciphertext hex
- nonce reuse -> "Attack succeeded", with two real ciphertexts
- replay on NN -> "Attack succeeded"
- PSK mismatch on a pattern without a PSK -> "Not applicable"

`7b6635b` additionally rewrote 159 lines of `src/patterns.ts` teaching content.

Remaining gaps (what would raise it):
- The walkthrough is still a step-through of a handshake computed once at pattern selection —
  real crypto, but a replay rather than a per-step computation. The new predict-before-step
  prompts partly compensate.
- Break-it attacks are one-click buttons; the learner cannot parameterize an attack.
- `#predict-box` renders only its heading at some steps (no prompt text), so the active-retrieval
  scaffold silently drops out.

### nonce-guard — 8 -> 8 (HEAD 2db23b3)

Prior justification: "Break-before-theory reordering fixed the on-ramp; H recovery plus a
forgery real AES-GCM accepts. Level 2 runs on internal probes, not the learner's messages."

The named defect is unchanged structurally — `runForbiddenAttack()` still runs on two fixed
16-byte probes rather than the learner's messages — but `4ac4e9c` stopped it from reading as a
claim about the learner's own traffic. The heading is now "Level 2 — Separate chosen-probe
demonstration" and the panel leads with "**Not derived from your Message 1 or Message 2.**"
The same commit relabelled the Level 1 readout from "DECODED (PRINTABLE)" to "ASCII PREVIEW OF
XOR BYTES (NOT DECODED PLAINTEXT)" with a paragraph explaining that recovering a plaintext needs
extra information. Verified live: with reuse on, H is recovered exactly and a forged tag is
accepted by real AES-GCM; with reuse off, both columns report "NO ATTACK — nonces are unique".
Honesty improved without the pedagogy changing, so the 8 holds.

Remaining gaps (what would raise it):
- `src/main.ts:287` — the aria-live `announce()` asserts "the GHASH authentication key H was
  recovered exactly, and a forged tag was accepted by real AES-GCM" as a fixed string, while the
  visible badges next to it are correctly gated on `atk.recovered` / `atk.forgeryAccepted`. A
  screen-reader user receives a verdict that never reads the flag the code computes.
- Level 2 still does not act on the learner's own messages.
- The default Message 1 / Message 2 share a long prefix, so the headline `P₁ ⊕ P₂` renders as
  nearly all `·` — the strongest exhibit on the page opens looking empty.
