# Build brief — `crypto-lab-agreeing-in-public`

**2026-10-04. Brief only; no repository exists yet.** Written against
`audits/_MASTER-TEMPLATE.md` — §0 principles through §6 deploy apply unchanged.

**Verdict: new repository.**

```
NEW DEMO BRIEF
- Repo name:         crypto-lab-agreeing-in-public
- Short name (H1):   Agreeing in Public
- Subtitle:          X25519 - RFC 7748 - key agreement
- One-liner:         Two strangers who have never met end up holding the same 32 bytes, while
                     an observer who saw every message sent holds nothing.
- Concept to teach:  A shared secret can be built in the open. Watching the conversation is
                     not enough to join it.
- Primitives/spec:   RFC 7748 (X25519, Curve25519), via @noble/curves
- Accent (--accent): [central assignment]
- Favicon emoji:     [central assignment]
- Category:          [central assignment]
- In scope:          the paint-mixing picture; one real X25519 exchange; the eavesdropper's
                     complete transcript; what the shared secret is then used for
- Non-goals:         the discrete logarithm, modular exponentiation, curve arithmetic, the
                     man-in-the-middle attack (named and handed on, not built), key schedules
```

## Overlap check — what I read, and what I found

I opened **DH MITM** and **Key Exchange**.

DH MITM is good and it is not this. Its first panel reads `p = 23, g = 5 (everyone knows
these)` and `A = 5⁶ mod 23 = 8`: modular exponentiation is the *opening move*, which is right
for a lab whose second half breaks the discrete log on toy primes. Key Exchange is wider
still — five generations from 1976 to hybrid ML-KEM — and although it carries a "NEW HERE?"
paragraph, that paragraph sends the reader to "the hands-on math" in the Diffie–Hellman
playground.

Both treat the mathematics as the subject. This lab treats the *outcome* as the subject and
hands the mathematics on. It is also the bridge the Start Here path currently lacks: **Locks
and Keys** ends with "you have a pair of keys", **HTTPS Padlock** begins with "your browser
and a server have a secure connection", and nothing in between says how two strangers got a
shared key.

## Scope — three panels

1. **The picture first.** Two people each start with a private colour and a shared public one.
   They mix, swap mixtures in the open, and mix again — and land on the same final colour that
   an observer cannot reproduce from the two mixtures alone. Drawn, animated once on demand,
   no numbers. The page says plainly that this is an analogy and that the next panel is the
   real thing.
2. **The real exchange.** Press one button. Alice and Bob each generate 32 random bytes and
   compute their public value; the two public values cross; each combines the other's with
   their own. **The two results are asserted equal, byte for byte, on screen.** This is exactly
   RFC 7748 §6.1: Alice sends `K_A = X25519(a, 9)`, Bob sends `K_B = X25519(b, 9)`, and both
   hold `K = X25519(a, X25519(b, 9)) = X25519(b, X25519(a, 9))`.
3. **What the eavesdropper has.** The complete transcript of everything that crossed the wire,
   shown in full — and a panel that lets the reader try to derive the shared secret from it and
   fails. Honest framing: *not* "it is impossible", but "nobody knows a way, and the whole of
   modern key exchange rests on that".

Closing: what the shared secret is actually for — it becomes the key that encrypts the rest of
the conversation — and the one thing this does not give you, which is who you are talking to.

## Keeping it real with the maths hidden

`@noble/curves`' X25519, with the RFC 7748 §5.2 test vectors pinned. **The page shows no
modulus, no exponent, no curve equation, and never uses the words "discrete logarithm".** The
32-byte values are shown as short coloured byte strips, with the full hex one `<details>` away.

RFC 7748 §6.1 also notes that both parties MAY check whether the resulting `K` is the all-zero
value and abort. The lab performs that check and mentions it in one plain sentence in the
"show the working" disclosure — it is a real part of doing this correctly and costs a beginner
nothing to see skipped past.

## Visual semantics

The moment the two independently-computed secrets are shown equal is the whole lab, and it
must read as **arrival, not as a green pass/fail badge**: the same byte strip appearing twice,
side by side, visibly identical. The eavesdropper's panel must read as **ordinary and complete**
— nothing is hidden from them — because the point is that a full transcript is not enough.

## Tests

- RFC 7748 §5.2 X25519 KATs pass, and the `a` / `b` basepoint vectors from §6.1.
- Round-trip: over many generated pairs, both sides agree; across *different* pairs, they do
  not. The negative control matters as much as the positive one.
- `e2e/claims.spec.ts` (§4.1b) asserts the "these are the same bytes" verdict from the computed
  comparison, not from a sentence.
- §4.1c: one mutation per rendered verdict — a comparison hard-wired to "identical", a
  comparison hard-wired to "different", and an eavesdropper panel that claims recovery it did
  not perform. Each must turn a NAMED test red, baseline-passed and bundle-hash-moved asserted
  first.
- **§4.1d negative claim — the belief a beginner most likely leaves with wrongly:** *"we agreed
  on a secret, so I know who I agreed with."* A passing test asserts that an exchange run
  against a substituted public value **still produces a matching pair of secrets** — the
  mechanism is perfectly happy, and identity is a separate problem. The lab then hands the
  reader to **DH MITM**, which is the lab that makes that attack concrete.

## Links out

**Locks and Keys** before it, **HTTPS Padlock** after it. **DH MITM** for the attack in panel 3's
closing note. **Key Exchange** for the five generations. **What Is PQC** for why this particular
hard problem is the one a quantum computer would undo.

## Start Here placement

Immediately after Locks and Keys and before the HTTPS Padlock — the step the path was written
around and currently skips.
