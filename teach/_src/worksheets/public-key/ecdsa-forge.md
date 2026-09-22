---
exhibit: ecdsa-forge
module: public-key
minutes: 45
outcomes: [5]
source_commit: 1de890f5e9f9
checked: 2026-09-22
anchors:
  - "#curve-select"
  - "#btn-generate"
  - "#private-hidden"
  - "#public-key"
  - "#msg-sign"
  - "#btn-sign-random"
  - "#btn-sign-det"
  - "#sig-view"
  - "#btn-verify"
  - "#verify-status"
  - "#vd-slider"
  - "#vd-label"
  - "#toy-d"
  - "#toy-k"
  - "#toy-e1"
  - "#toy-e2"
  - "#toy-attack-output"
  - "#victim-key"
  - "#btn-attack"
  - "#step1"
  - "#step2"
  - "#step3"
  - "#step4"
  - "#step5"
  - "#attack-detail"
  - "#attack-fullnums"
  - "#msg-compare"
  - "#btn-random-sample"
  - "#btn-det-sample"
  - "#btn-reset-sample"
  - "#random-list"
  - "#det-list"
  - "#btn-safe-attack"
  - "#safe-attack-status"
---

## Predict

Answer these before you open the exhibit. There are no penalties for wrong predictions; the point is to compare them with what you see.

1. An ECDSA signer holds a secret scalar `d` and publishes `Q = d·G`. To sign a message hash `e` the signer picks a nonce `k`, computes `r` as the x-coordinate of `k·G` reduced mod `n`, and `s = k⁻¹(e + r·d) mod n`. The signer now signs two *different* messages with the same `d` and the same `k`. Predict which of `r`, `s` and `e` come out the same across the two signatures and which come out different. Give your reason for each.
2. Write the two signing equations from question 1 side by side, one per message. Treating `d` and `k` as the unknowns and `r`, `s₁`, `s₂`, `e₁`, `e₂` as known, count the equations and count the unknowns. Predict whether someone who never sees the private key can solve for `d`, and say what the first step of that solution would be.
3. An attacker instead has only the public key `Q` and the generator `G`, and no signatures at all. Predict whether `d` can be recovered from those two points, and say what makes this case different from question 2.
4. RFC 6979 computes the nonce from the private key and the message with HMAC-SHA-256 instead of drawing it from a random number generator. Predict what happens to the signature when the *same* message is signed twice this way, and what happens to the nonce when two *different* messages are signed. Then say what each answer does to the attack you described in question 2.

## Do

1. Open the exhibit and stay in **What Is ECDSA?**. Leave **Curve** on its starting option and press **Generate Keypair**. Record what **Public key Q (compressed)** now shows, what the line beginning **Private key** shows, and the status line at the bottom of the message panel.
2. In the same section's right-hand panel, leave the text in **Message** as you found it. Press **Sign Random** and record **Signature (r, s)**. Press **Verify** and record the status line. Press **Sign Random** a second time and record the new **Signature (r, s)**, then press **Verify** again.
3. Edit **Message** — add a word to it — and press **Verify** *without* signing again. Record the status line. Restore the original wording, press **Verify** once more, and record the status line again.
4. Press **Sign Deterministic (RFC 6979)** twice in a row, leaving **Message** untouched, and record **Signature (r, s)** after each press.
5. Scroll to **The Math You Can See** and work in the right-hand panel, **The real thing: a finite field**. Move the **Walk k·G** slider and read the line under the plot. Record the point the page reports for `k = 5`, for `k = 7`, and for one more value of your choosing. Read the note printed below that line.
6. Scroll to **The Nonce-Reuse Attack** and read **Why it works: two equations, two unknowns**. Then move to **Try it yourself on the toy curve**, leave all four sliders at the values they load with, and read the four cards the panel prints below them. Record `r` from Signature 1, `r` from Signature 2, both `s` values, the recovered `k`, the recovered `d`, and what the last card reports about the freshly forged signature.
7. Still in the toy panel, make these changes one at a time and record what the panel says after each. Move **Private key d** to any other value. Move **Reused nonce k** to 7, then to 12, then back to the value it loaded with. Finally drag **Message hash e₁** until it equals **Message hash e₂**, then put it back.
8. Scroll to **Now on real 256-bit keys**. Before pressing anything, note what the **VICTIM** box shows in place of Alice's private key. Press **Run Full Compromise**. Read the five timeline steps, then expand **Show the full 256-bit values** and record the values listed in the Record table. Note what the **VICTIM** box shows now.
9. Press **Run Full Compromise** a second time and record the same values from the second run.
10. Scroll to **RFC 6979 Deterministic Nonces** and press **Reset Samples** first, so both lists start empty. Leaving **Message for comparison** as you found it, press **Sign Random** in this panel twice, then press **Sign RFC 6979** twice. Record the rows that appear under **Random nonce output** and under **RFC 6979 output**.
11. Change **Message for comparison** — add a word — and press **Sign RFC 6979** once more. Record the new row. Then press **Try the nonce-reuse attack against RFC 6979** and record the status line beneath it.

> If the toy panel answers with a degenerate nonce or asks you for two different hashes, that is one of its answers and not a mistake on your part. Record what it said and carry on with the step.

## Record

Every value below comes from your own run. The 256-bit numbers are far too long to copy out: for those, write the first six and the last six digits, which is enough to tell two runs apart.

| From the first panel | What it showed |
|---|---|
| Public key Q (compressed) | |
| The line beginning Private key | |

| Press | Signature (r, s) shown | Status line |
|---|---|---|
| Sign Random, first press | | |
| Verify, after the first Sign Random | | |
| Sign Random, second press | | |
| Verify, after the second Sign Random | | |
| Verify after editing Message | | |
| Verify after restoring Message | | |
| Sign Deterministic (RFC 6979), first press | | |
| Sign Deterministic (RFC 6979), second press | | |

| Walk k·G | Point the page reports |
|---|---|
| k = 5 | |
| k = 7 | |
| k = | |

| Toy panel, sliders as loaded | Value |
|---|---|
| r in Signature 1 | |
| r in Signature 2 | |
| s₁ | |
| s₂ | |
| Recovered k | |
| Recovered d | |
| What the forgery card reports | |

| Change I made in the toy panel | What the panel reported |
|---|---|
| Private key d moved to | |
| Reused nonce k = 7 | |
| Reused nonce k = 12 | |
| e₁ set equal to e₂ | |

| From **Show the full 256-bit values** | Run 1 | Run 2 |
|---|---|---|
| `n (order)` | | |
| `e1 = H("Transfer $10 to Bob")` | | |
| `e2 = H("Transfer $20 to Charlie")` | | |
| `r  (shared)` | | |
| `s1` | | |
| `s2` | | |
| `recovered k` | | |
| `recovered d` | | |
| `victim's real d` | | |
| the `match` line, in my own words | | |
| Alice's private key, as the VICTIM box shows it after the run | | |

| Timeline step | What it reported, in my own words |
|---|---|
| Step 2 · Spot the reused nonce | |
| Step 5 · Forge a new signature | |

| RFC 6979 panel, row by row | k, where the row shows one | r |
|---|---|---|
| Random nonce output, first press | | |
| Random nonce output, second press | | |
| RFC 6979 output, first press | | |
| RFC 6979 output, second press | | |
| RFC 6979 output, after changing the message | | |

| Status line under Try the nonce-reuse attack against RFC 6979 |
|---|
| |

## Explain

1. Your two toy signatures printed the same `r`, and the panel marks that as the tell. Using the signing rule the page prints — `r` is the x-coordinate of `k·G` reduced mod `n` — explain why reusing `k` forces `r` to repeat. Then explain why the two `s` values still came out different.
2. Take the five numbers you recorded from the toy panel — `r`, `s₁`, `s₂` and the two message hashes on the sliders — and work the panel's two lines by hand, mod 19: first `k = (e₁ − e₂)·(s₁ − s₂)⁻¹`, then `d = (s₁·k − e₁)·r⁻¹`. Check your `d` against the **Private key d** slider. Then list which of the five numbers a signer publishes and which the signer is supposed to keep.
3. Compare your two **Run Full Compromise** runs. Say which recorded values changed between the runs and which did not. For each value that did *not* change, point to the line the page prints that explains why it could not.
4. The note under the finite-field plot says that multiplying `G` is easy and that finding `k` from the highlighted point is the hard problem ECDSA relies on. Alice's public key was on the page from the start, and it did not give up her private key. The compromise recovered that same private key in one press. Say precisely what the attacker had in the second case that she did not have in the first.
5. Setting **Reused nonce k** to 7 stopped the toy attack, and the panel named the reason. Using the point you recorded for `k = 7` on the **Walk k·G** slider, work out what `r` would be for that nonce. Then substitute that `r` into `s = k⁻¹(e + r·d) mod n` and say what `s` reduces to. Does refusing that nonce protect the private key, or does it prevent a different problem?
6. Your two **Sign RFC 6979** presses on one message, and the third press after you changed the message, gave three rows. Say what each comparison shows about the nonce. Then read the paragraph at the top of **RFC 6979 Deterministic Nonces** and the status line you recorded, and state both what the page says blocks the attack and what the page says that block rests on.

## Fix / Extend

1. **Fix.** A hardware wallet signs with a nonce from a random number generator that occasionally restarts from the same seed. Say what an attacker watching that wallet's published signatures would look for, name which of the two signing buttons on this page corresponds to the fix, and state — from the page's own wording — what that fix still depends on.
2. **Fix.** You are reviewing a signing service that avoids repeats by taking its nonce from a counter: `k = 1` for the first signature, `k = 2` for the second, and so on. No nonce is ever reused. Look at the second line of the recovery the toy panel prints, `d = (s₁·k − e₁)·r⁻¹`, and say what an attacker who can guess `k` needs in order to run that line, and how many signatures it would take. Say whether the tell you identified in Explain 1 would appear here.
3. **Extend.** Move the **Walk k·G** slider through each value from 1 to 18 and write down the point for each. Count how many *distinct* x-coordinates appear. The panel builds `r` from that x-coordinate, so say how many different `r` values this toy curve can produce, and what that means for two signatures that happen to share an `r`.
4. **Extend.** Change **Curve** to the other option and press **Run Full Compromise** again. Compare `n (order)`, `e1` and `e2` with the runs you already recorded, and say which of the three the curve choice changed. Note what the status line in the first panel now asks you to do, and why.
5. **Extend.** Open **ECDSA vs Ed25519** and read the rows *Deterministic by default*, *Nonce reuse catastrophic* and *Malleable signatures*. Say which row the RFC 6979 panel is demonstrating, and name a property the table still records differently for the two schemes once RFC 6979 is in use.
