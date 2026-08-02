# Re-verify pass 3 — 2026-08-02

Re-verification of recovered 2026-08-01 scores against fetched current source.
Assigned demos (15): noise-pipe, nonce-guard, oblivious-shelf, oram-vault, ot-gate,
otp-vault, patron-shield, phantom-vault, pki-chain, poly1305-mac, psi-gate,
quantum-entropy, ratchet-wire, ring-sign, scloud-vault.

| demo | HEAD | prior | current | what changed |
|---|---|--:|--:|---|
| noise-pipe | b696d6e | 7 | 8 | Prior's named defect fixed by 175f67b: Break-it badges now distinguish held / succeeded / not-applicable / could-not-run instead of rendering every `ok:false` (including "attack never ran") as "Attack succeeded". Verified live: rs-swap on XX -> "Not applicable", rs-swap on IKpsk2 -> "defense held", replay/nonce-reuse -> genuine "Attack succeeded" with real ciphertext evidence. 7b6635b also corrected teaching prose. |

- noise-pipe remaining gaps: walkthrough is still a step-through of a handshake computed once per pattern selection (a replay, though of real crypto, softened by the new predict-before-step prompts); Break-it attacks are one-click buttons, not learner-parameterized; predict-box prompt is empty at some steps.
