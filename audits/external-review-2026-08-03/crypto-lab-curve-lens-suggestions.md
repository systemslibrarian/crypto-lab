# Crypto Lab Curve Lens — Suggestions

## Overall Assessment

Curve Lens has become one of the strongest Crypto Labs. The recent work did not merely polish the interface—it corrected the teaching sequence and made the lab substantially more trustworthy.

The lab now works as a coherent miniature course in elliptic-curve cryptography:

1. What does point addition mean?
2. How does repeated addition create a public key?
3. Why is reversing it difficult?
4. How do real curves differ?
5. How does that hardness let two people agree on a secret?

That narrative is what separates a collection of widgets from an educational experience.

## What Improved Most

### 1. Better Learning Progression

Starting with a smooth curve over the real numbers, then carrying the same group law into the finite field F₁₇, is much better than dropping visitors directly into modular arithmetic.

Showing the finite-field chord wrapping around the grid also fixes the misleading visual used by many ECC demonstrations.

### 2. “Break the Discrete Log” Panel

This is an excellent addition. It turns the security claim into an experiment:

- The visitor sees Q = kG.
- The program recovers k on the toy curve.
- The lab then contrasts that with Pollard’s rho and approximately 128-bit security for P-256.

This provides the missing bridge between “here is point multiplication” and “here is why ECC is secure.”

### 3. Toy ECDH Visualization

The toy ECDH visualization may be the best part of the lab.

Alice’s a·B and Bob’s b·A landing on the same literal dot communicates ECDH better than two columns of hexadecimal ever could. The real-curve exchange then proves that it is not merely an animation.

### 4. Serious Browser-Level Testing

The Playwright claims suite checks that the displayed derivations, plotted points, scalar traces, ECDLP answer, accessibility announcements, and ECDH results actually agree with one another.

That raises Curve Lens from an interactive article to something closer to an executable cryptography lesson.

### 5. Stronger Collection-Wide Presentation

The shared hero, primitive chips, “Why It Matters” card, mobile behavior, contrast improvements, keyboard-operable point grid, shareable state, glossary, and light/dark themes make the lab feel like part of a designed collection rather than an isolated GitHub experiment.

## Recommended Changes

### 1. Add a Five-Step Lab Navigator

Immediately beneath the hero, add a compact navigation bar:

**1 Group Law → 2 Scalar Multiplication → 3 Break ECDLP → 4 Compare Curves → 5 ECDH**

The current top navigation contains related-project links, but not a map of the lesson itself. A jump bar would make the intellectual structure immediately visible and help returning visitors move directly to a panel.

### 2. Rename “Shared Secret” to “Raw ECDH Output”

The value is correctly described as requiring a KDF, but the large heading still calls it “Shared secret,” while the warning appears in smaller text.

Recommended heading:

> **Raw ECDH output — not yet a symmetric key**

Keep the HKDF explanation directly below it so the safe interpretation is visually dominant.

### 3. Explicitly Label the Private-Key Display

The real demonstration intentionally displays Alice’s and Bob’s private scalars, which is appropriate for teaching, but a visible notice should appear above the cards:

> **Teaching view:** Private scalars are intentionally revealed here. Real applications must never display or transmit them.

This prevents a novice from interpreting the transcript as an implementation pattern.

### 4. Tighten the Mathematical Explanation of ECDH

The current explanation says that “scalar multiplication commutes.” The result is correct, but the wording is slightly loose.

A more precise explanation would be:

> Repeated group addition is associative, and integer multiplication commutes, so a(bG) = (ab)G = (ba)G = b(aG).

This explains exactly why the two parties derive the same point.

### 5. Send Top Cross-Links to the Live Labs

The related badges near the top should open the runnable demonstrations rather than primarily linking to GitHub repositories.

A smaller GitHub icon or source-code link can remain available for visitors who want the implementation.

### 6. Remove the Duplicate Skip-Link Path

The shared header adds a “Skip to content” link targeting `#app`, while the lab also includes its own skip link targeting `#main-content`.

Both work, but keyboard users may encounter two nearly identical controls. Keep one skip link, preferably targeting `#main-content`.

## Final Verdict

Before these changes, Curve Lens was a capable ECC demonstration. Now it is a coherent miniature course in elliptic-curve cryptography.

The strongest achievement is that each panel answers the question created by the previous panel. With a panel navigator and the safety-label changes, the lab would be essentially finished rather than merely improved.
