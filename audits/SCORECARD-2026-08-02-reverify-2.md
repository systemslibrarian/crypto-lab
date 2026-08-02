# Re-verification slice 2 — 2026-08-02

Re-verifier: subagent slice 2. Read-only pass over demo repos; scores re-verified against
fetched current source, built output driven with Playwright chromium.

Assigned demos (15): garbled-gate, hash-zoo, hqc-vault, isogeny-atlas, isogeny-gate,
jwt-forge, kdf-arena, kdf-chain, key-mirror, lms-ledger, lms-xmss, mac-race,
mceliece-gate, mls-group, multivariate.

| demo | HEAD | prior | current | what changed |
|---|---|--:|--:|---|
| garbled-gate | fcb4b14 | 9 | 9 | Two post-scoring fixes landed: millionaire verdict now decoded from the garbled run with per-gate label validation (7fe9b64), and free-XOR savings split into measured bytes vs labeled counterfactual estimate (fcb4b14). All exhibits verified live: verdict flips correctly with inputs, OT trace real, 19-gate stepper live, label-reuse attack derives Alice's bit and checks the deduction against her actual bit. Prior 9 stands. |

- garbled-gate gaps: 1-100 wealth quantised to 3 bits, so nearby values honestly report "Equal" (displayed, but easy to misread as a bug); quizzes are static multiple-choice; free-XOR classic-garbling comparison remains an estimate (clearly labeled as such).
