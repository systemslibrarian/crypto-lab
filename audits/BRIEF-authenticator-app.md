# Build brief — `crypto-lab-authenticator-app`

**2026-10-04. Brief only; no repository exists yet.** Written against
`audits/_MASTER-TEMPLATE.md` — §0 principles through §6 deploy apply unchanged.

**Verdict: new repository.**

```
NEW DEMO BRIEF
- Repo name:         crypto-lab-authenticator-app
- Short name (H1):   Your Authenticator App
- Subtitle:          TOTP - RFC 6238 - HOTP - RFC 4226
- One-liner:         Derives the same six digits your phone shows, from the same shared secret
                     and the same clock, and then relays one to a fake site to show what it
                     does not protect.
- Concept to teach:  The six digits are a short-lived fingerprint of (this site's secret + the
                     current half-minute) - which is why they expire, why they are per-site,
                     and why handing one to the wrong site still works for the attacker.
- Primitives/spec:   RFC 6238 (TOTP), RFC 4226 (HOTP), HMAC-SHA-1 via WebCrypto
- Accent (--accent): [central assignment]
- Favicon emoji:     [central assignment]
- Category:          [central assignment]
- In scope:          real TOTP derivation; the 30-second step; per-site secrets; one-time use;
                     a live phishing relay
- Non-goals:         QR/otpauth URI parsing, HOTP counter drift, push-based 2FA, SMS codes,
                     WebAuthn itself (linked, not rebuilt)
```

## Overlap check — what I read, and what I found

I opened **Time Trust** and read it through. Its third panel is *"TOTP acceptance window ·
RFC 6238 · RFC 4226"* with a Phone (prover) and a Server (verifier), and it is real. But
TOTP there is **evidence for a different argument**: Time Trust's subject, stated in its own
hero, is that the clock is an unauthenticated input, and all six of its panels exist to show
a valid signature attached to a wrong decision. It does not derive the digits, does not say
where the secret came from, and does not touch phishing.

Putting this content in front of Time Trust would make that lab open on something other than
what it is about. So: a separate lab, which links to Time Trust for the clock-skew question
it already answers better than a beginner lab should try to.

## Scope — four panels

1. **Where the six digits come from.** One shared secret, set up once when you scanned the QR
   code, plus the current time. Press a button and watch the same six digits your phone shows
   appear here. Plain language only: *"your phone and the site are both looking at a clock and
   both know one secret; the code is what those two things make together."*
2. **Why it expires.** A live 30-second countdown; at the boundary the digits roll over. The
   previous code is shown going stale beside the new one.
3. **Why a code from one site is useless at another.** Two sites, two secrets, same instant.
   The codes differ, and feeding site A's code to site B is rejected. Also: feeding the same
   code to the same site twice is rejected — RFC 6238 §5.2 requires exactly that.
4. **What it does not protect against.** A fake login page relays the code to the real site
   **while it is still valid**. Nothing is broken; the code was handed to the wrong party and
   it worked. Ends by naming the thing that does fix it — a credential bound to the origin —
   and links to **WebAuthn**.

## Keeping it real with the maths hidden

Everything is computed in-page with WebCrypto `HMAC` over `SHA-1`:
**`HOTP(K,C) = Truncate(HMAC-SHA-1(K,C))`** (RFC 4226 §5.2), with **`TOTP = HOTP(K, T)`** and
**`T = (Current Unix time − T0) / X`**, default **`X = 30` seconds, `T0 = 0`** (RFC 6238 §4.2).
The final step is `D = Snum mod 10^Digit` (RFC 4226 §5.3) with `Digit = 6`.

**None of that notation appears on the page.** No `mod`, no counter, no byte offset. The
dynamic-truncation step is described as *"take a few bytes from the result and read them as a
number"*, and a **"show the working"** disclosure carries the HMAC output, the chosen offset,
and the truncation, closed by default (§0.3 progressive disclosure).

RFC 6238 §1.2 and §5.1 make HMAC-SHA-1 the default construction, which is what deployed
authenticator apps use; the lab says so in one sentence rather than silently choosing it.

## Visual semantics

Colour tracks system integrity. **Panel 4's relay must read as ALARM even though every check
passed** — a correct TOTP verification is exactly what the attacker wanted, and showing it
green would teach the opposite of the lesson. Icon plus text plus colour in every state;
checked in grayscale and under deuteranopia.

## Tests

- **KATs from the specification.** RFC 6238 Appendix B publishes TOTP test values for a known
  key across fixed timestamps; those are the ground truth, asserted in `src/**/*.test.ts`.
  Whether a vector came from the RFC or was reproduced from an implementation travels with it.
- Correct path: the right code at the right instant verifies; a code from the adjacent window,
  a code from the other site, and a second use of an accepted code are each rejected.
- `e2e/claims.spec.ts` (§4.1b) asserts every rendered verdict from the computed outcome, never
  from a typed sentence.
- §4.1c: one mutation per rendered verdict — a verifier that accepts any six digits, one that
  accepts a stale window, one that ignores which site's secret was used, one that lets a code
  be used twice, and a relay panel that reports failure when the relay in fact succeeded. Each
  must turn a NAMED test red, with the unmutated baseline asserted passing and the built bundle
  hash asserted to have moved first.
- **§4.1d negative claim — the belief a beginner most likely leaves with wrongly:** *"the
  six-digit code means only I can get in."* A passing test asserts the lab's own verifier
  **accepts** the relayed code, so the page cannot claim a protection the mechanism does not
  provide.

## Links out

**Time Trust** for what happens when the clock itself is the attacker's. **WebAuthn** for the
origin-bound credential that does survive panel 4. **Hash Zoo** for what HMAC is built on.

## Start Here placement

After the padlock and end-to-end encryption, where the reader has moved from "how does the web
protect this" to "how do I protect my account". It pairs naturally with the password lab that
follows it.
