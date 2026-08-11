# External review triage — what is worth pursuing toward 10/10

Covers the 13 review files in this directory (~9,400 lines, ~330 numbered recommendations).

**Status of this document.** Five claims have been verified end-to-end against the source and
are marked **VERIFIED**. The rest are classified from their headings and surrounding text,
**not** individually checked. Treat an unverified row as a lead, not a finding — the whole
lesson of the verified set is that the reviews are strong on code and weak on severity.

---

## Calibration: how much to trust these

Every claim checked so far has been **technically correct about the code**. Not one was
invented. That is a high hit rate and the reviews deserve to be taken seriously.

The consistent weakness is **severity ranking**, because reachability was never checked:

| Claim | Technically right? | Actually reachable? | Review's ranking |
|---|---|---|---|
| noise-pipe — Reset reuses (key, nonce) | yes | **YES — one button click** | "highest-priority" — correct |
| bb84 — `bitsToBytes()` collisions | yes | yes (any short raw key) | #10 of 32 — **under-ranked** |
| bb84 — fixed key from empty raw key | yes | yes | #11 of 32 — **under-ranked** |
| patron-shield — bit-31 `Math.log2` → NaN | yes | **no** — `DB_SIZE` is 8 | "highest-priority" — over-ranked |

So: **do not work the lists in the order given.** Check reachability first, and re-rank.

---

## Tier 1 — verified real defects

### noise-pipe: concurrent sends reused a nonce — **FIXED, `f5f6a6c`**

`encryptWithAd` read `this.n`, awaited WebCrypto, then incremented. **200 of 200** concurrent
pairs reused nonce 0 with byte-identical keystream prefixes, and a **double-click on the
shipped send button** put 2 records out under 1 GCM IV in a real browser. Post-fix 0 of 200.
The most serious confirmed item in the review set so far, because it is reachable by an
ordinary user gesture rather than by a contrived input.

Its sibling races were measured rather than assumed: the pattern-selection race is 300/300 in
one tick but **0/200 at a realistic 16 ms click gap**, and the stale break-it window is
**0–8.6 ms** — both fixed anyway because the guards are a few lines each, but neither is the
emergency the ranking implied.

### timing-oracle: two panels overstated what the code did — **FIXED, `b499288`/`d93466a`**

Neither was in the review's priority list. Panel 1 counted characters the comparator never
examined — it returns on a length mismatch *before* the loop, so **98 of a 124-guess corpus**
were overstated, under a caption reading "exact every run". Panel 3's "uniform" ladder tally
moved with the secret, because `bitsOf()` strips leading zeros: **1027 of 2000** draws
rendered fewer than 10 positions while the caption said "no matter the bit values".

Both are the recommendation-2 shape — a sentence asserting something the code does not do —
and both outrank most of what the review did prioritise for this repo.

### noise-pipe: Reset reused a (key, nonce) pair — **FIXED, `7ee1e0a`**

`resetTransport()` called `setNonce(0)` on the same `CipherState` objects. send → Reset →
send encrypted different plaintext under an identical (key, nonce) pair. Demonstrated in one
click: identical plaintext produced byte-identical ciphertext under an unchanged send key.

The lab teaches this exact catastrophe three panels up. **The e2e test required the bug** —
"Reset must return the counters to zero AND leave the controls usable" pinned the rewind.
Reset is now "New session" and re-runs the handshake; counters reset because the keys changed.

### bb84: `bitsToBytes()` collides, and the QBER threshold boundary — **FIXED, `0671c36`**

Both confirmed and fixed. The collision was real — a 16-bit key, its 32-bit double and its
64-bit quadruple all derived byte-for-byte identical final keys — and is now separated by a
4-byte raw-key bit length in the hash input. But it is **structural, not reachable**: random
raw keys do not arise as exact repetitions of one another, so "the most under-ranked item in
the whole review set" (below) was itself over-ranked.

**The genuinely under-ranked item in bb84 was the threshold boundary**, which the review
filed as a wording nit. `eveDetected` was `qber > threshold`, so a run landing exactly on the
threshold took the *clean* branch and the page said "below the threshold" and "no
eavesdropper detectable". Measured over **19,200 engine runs: equality occurs in 59 (0.31%),
and 49 of those 59 have Eve present.** A 0.31% path that is 83% concentrated on the one case
where the lab denies the thing it exists to teach. Now `>=`.

Lesson for the rest of this triage: **rank by what the failing state MEANS, not by how exotic
the mechanism sounds.** A cyclic-repetition collision reads alarming and cannot happen; an
off-by-one comparison reads trivial and lands squarely on the teaching point.

### bb84 (original entry, superseded above)

`idx = (i * 8 + j) % bits.length` cycles the raw key to fill 16 bytes. Verified:

```
[1] -> ffffffff…   [1,1] -> ffffffff…   [1,1,1] -> ffffffff…   all identical
[0,1] and [0,1,0,1] also identical
[]   -> 00000000…  a FIXED key from an empty raw key
```

Two distinct raw keys hashing to one final key, in the panel that teaches privacy
amplification. Fix: pack exactly, domain-separate, include the bit length, reject empty.
This is the most under-ranked item in the whole review set.

### patron-shield: bit-31 collusion recovery — **OPEN, latent**

`Math.log2(maskS ^ maskSPrime)` returns `NaN` when bit 31 is set (the XOR is negative and the
power-of-two guard passes anyway). Correct fix is `31 - Math.clz32(diff >>> 0)`.

Not reachable today — `DB_SIZE` is `CATALOG.length` = 8 — but the repo's own test asserts only
`DB_SIZE <= 32`, so the invariant permits the range that breaks. Fix both.

### pake-gate: Dragonfly counter wrap — **PARTLY ALREADY DONE, remainder unreachable**

Checked statically against current code, not scheduled. The review asks to enforce
`1 <= counter <= 255` because the counter is serialized as one octet
(`Uint8Array.of(counter & 0xff)`) while the loop may run to 4,000, so candidates would repeat.

- The **fixed-work** path already has `maxCounter = 255` (`src/pake/dragonfly.ts:151`), so that
  half of the recommendation has landed since the review was written.
- The **legacy hunt-and-peck** path still bounds at 4,000 (`dragonfly.ts:137`). Reaching
  counter 256 needs ~255 consecutive misses, each with probability ~1/2 — about **2^-255**.
  Real in the code, unreachable in this universe.

Worth a one-line bound for tidiness; not worth an agent-hour. **This is the "several of these
demos have had work land since the review was written" caveat biting for real** — half of a
top-priority recommendation was already implemented.

### pake-gate: export session keys only after confirmation — **VERIFIED, DECLINED**

Same class as bb84's aborted-transcript key derivation. The engine exposes `sessionKeyBytes`
once candidate material exists; the review wants `exportSessionKey()` to throw before the
confirmed phase. The review itself notes **the UI already displays an unconfirmed flag**, so
nothing misleading reaches the visitor. Making the boundary structural is a decision about
the module's contract, not a defect fix — left for a deliberate call rather than guessed at.

---

## Tier 2 — the category that actually moves a demo toward 10/10

This is where the review earns its keep, and it aligns exactly with the standard this catalog
already holds itself to: *every claim computed from that run, every verdict stating only what
the protocol learned.*

Recurring across all 13 files:

- **Verdicts that overstate what was learned.** bb84's "Eavesdropper Detected" → "Excess
  Disturbance Detected" (channel noise is indistinguishable from Eve). timing-oracle's "Leak
  Detected" off a single 15% threshold. phantom-vault's "Master Passphrase Recovered" →
  "Matching Candidate Found". pake-gate calling SRP's `M1` a MAC when it is an evidence hash.
  jevil's "information-theoretically hidden" needing a scope.
- **Security labels asserted rather than computed.** j-uniward's "Safe / Moderate / Risky"
  bands, jevil's "security grade" on `K = 16`, simon-period's control styled broadly "safe".
- **Claims stated more strongly than the demo can support.** bb84's "security is guaranteed by
  physics" as a standalone line, and using AES-256 as evidence of 256-bit security; vdf's "no
  amount of hardware"; noise-pipe's handshake hash "proves nobody tampered"; simon-period's
  "doubling the key does nothing" without the Q2 qualifier.
- **Teaching-view labelling.** curve-lens displaying private scalars without saying that is a
  teaching choice; pake-gate exporting session keys before confirmation.

These are cheap, they are squarely in scope, and they are the difference between a demo that
is *correct* and one that is *trustworthy*. **Start here.**

---

## Tier 3 — scope expansions: decline, or spin out as their own demo

Applying these would violate the house rule of one concept per demo.

bb84 alone is asked for finite-sample confidence intervals, information reconciliation before
privacy amplification, an authenticated-classical-channel attack, photon loss and
no-detection modelling, weak-coherent-pulse and decoy-state context, and partial-interception
controls. That is not a fix list; it is four more labs.

Similarly: j-uniward's full ternary embedding and real STC coding layer; bitcoin-wallet's
Taproot/bech32m endpoint; patron-shield's real matrix-PIR experiment; pake-gate's
identity-binding attacks.

Several are genuinely good *demo ideas*. The right home is `concept-coverage.md`, not a patch
to an existing lab.

---

## Tier 4 — already done, or done differently

Check before actioning. Recurring items this fleet has already worked through:

- "Retire stale verdicts when inputs change" — the dominant bug class here; fixed in many labs
  already, including several since this review was written.
- "Split the browser test commands" / "rename `test:a11y`" — done in vrf-gate, vss-gate.
- "Fix the deploy script's typecheck bypass" — a fleet-wide pass already closed this class.
- "Confirm the Playwright port is unique across the fleet" — done; 158 repos verified unique.
- "Run the claims suite in deployment CI" — verified fleet-wide: 168/168 repos invoke their
  test script in CI.

---

## Suggested order of work

1. **bb84 `bitsToBytes()`** — verified, reachable, and the most under-ranked item found.
2. **patron-shield bit-31** — verified; two-line fix plus tightening the `DB_SIZE` invariant.
3. **Tier 2 wording pass across all 13** — highest value per unit effort, and it is what "10/10"
   means for a teaching catalog.
4. **Verify-then-act on the remaining high-ranked items**, especially: timing-oracle's in-flight
   HMAC stale-result race and global benchmark serialization; noise-pipe's remaining 30
   (concurrent-encryption nonce reuse is the next one worth checking); pake-gate's scalar
   rejection sampling; falcon-seal's README rewrite.
5. **Route Tier 3 into `concept-coverage.md`** as candidate demos rather than patches.

**Rule for whoever picks this up:** verify the claim against current source, and check whether
the failing state can actually be reached, before scheduling any of it. Four for four so far,
the code analysis held up and the priority did not.
