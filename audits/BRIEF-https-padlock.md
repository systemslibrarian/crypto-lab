# Build brief — `crypto-lab-https-padlock`

**2026-10-03. Brief only; no repository exists yet.** Written against
`audits/_MASTER-TEMPLATE.md`; §0 principles, §1 build, §2 teach, §3 look, §4 accessibility,
§5 README and §6 deploy all apply unchanged. Decided in
`audits/BEGINNER-ONRAMP-2026-10-03.md`, which judged this the strongest of the seven
candidate beginner labs.

```
NEW DEMO BRIEF
- Repo name:         crypto-lab-https-padlock
- Short name (H1):   HTTPS Padlock
- Subtitle:          X.509 - TLS 1.3 - what the padlock means
- One-liner:         Parses the real certificate a site presents, walks the chain to a trusted
                     root, and separates the four things the padlock proves from the four it does not.
- Concept to teach:  The padlock is a claim about the CONNECTION and the NAME, not about the
                     people behind the name.
- Primitives/spec:   RFC 5280 (X.509 path validation), RFC 8446 (TLS 1.3), RFC 6066 (SNI)
- Accent (--accent): [central assignment]
- Favicon emoji:     [central assignment]
- In scope:          certificate parsing and display; chain walk to a root; expiry and name
                     matching; the four promises and the four non-promises, each demonstrated
- Non-goals:         live network TLS, revocation checking (OCSP/CRL), key exchange internals,
                     anything that requires the reader to follow a key schedule
```

## The question the lab answers

A newcomer asks one question — *"what does the padlock mean?"* — and the catalog currently
answers it across several Intermediate labs, each correct and none of them that question.
This lab is the one place that answers it, and sends the reader on.

## Scope

Four promises, each **demonstrated** rather than asserted:

1. **The traffic is encrypted.** Shown as the one thing the page does not have to argue for.
2. **The name matches.** Parse the certificate's subject and SANs, compare them to the address,
   and let the reader try a name that does not match and watch it fail.
3. **Somebody vouched.** Walk the chain — leaf, intermediate, root — and show that the root is
   trusted because it is already on the device, not because anything in the chain says so.
4. **It has not expired.** Move the date and watch a valid certificate become invalid with no
   cryptography changing.

Four non-promises, each **demonstrated as a failure of the assumption**, not just stated:

1. **Not that the site is honest.** A certificate for an attacker-controlled name validates
   perfectly. Issue one in the lab's own toy hierarchy and watch every check pass.
2. **Not that the company is who it says.** Show what a DV certificate actually attests —
   control of a name — and what it does not.
3. **Not that the hostname was private.** The SNI field is in the clear. Show the bytes of the
   first packet with the name readable, and link to **Blind Hello** for the fix.
4. **Not that the strongest cryptography was used.** Negotiation happens before anyone has
   proven who they are; link to **Downgrade Wire**.

## Keeping it real with the maths hidden

Everything on the page is a real parse of real bytes: ship two or three pinned, vendored PEM
chains (a well-known public chain, plus a toy hierarchy minted at build time for the
attacker-name demonstration) and parse them in the browser with `@peculiar/x509`, which
`crypto-lab-chain-of-trust` already uses. Signature verification over each chain link runs in
WebCrypto.

**Nothing asks the reader to follow a derivation.** No key schedule, no curve, no modulus on
screen. The chain walk is drawn as three boxes and an arrow; a failing link turns red with an
icon and a sentence. The certificate's own fields appear as a table, not as ASN.1. A
**"show the bytes"** disclosure carries the DER/PEM for anyone who wants it — the same
progressive-disclosure shape §0.3 requires, which says to simplify the explanation and never
the cryptography.

## Visual semantics (§1, VISUAL SEMANTICS)

Colour tracks **system integrity, not the return value**. The attacker-name certificate
validating cleanly is the lab's sharpest moment and must read as **ALARM**, never as a green
success — it is a correct result that a reader is about to misunderstand. Icon plus text plus
colour in every state; checked in grayscale and under deuteranopia simulation.

## Links out

Each non-promise ends in the lab that goes deeper, and the chain-walk panel points at
**Chain of Trust** for path building versus RFC 5280 path validation. **TLS Handshake** for the
handshake itself, **Blind Hello** for SNI, **Downgrade Wire** for negotiation stripping,
**DNSSEC Chain** for the separate trust system that answers a different question. These five
are the labs this brief was written against; the catalog may hold others.

## Tests (§1 Testing, §4.1b, §4.1c)

- KATs: each vendored chain parses to known subject, issuer, validity and SANs.
- The correct path accepts the good chain and rejects every bad one: wrong name, expired,
  missing intermediate, self-signed leaf, signature altered by one byte.
- `e2e/claims.spec.ts` asserts each of the four promises and four non-promises from the
  computed outcome, never from a typed sentence (§4.1b).
- §4.1c mutations, one per verdict the lab introduces, each required to turn a NAMED test red,
  with the unmutated baseline asserted passing and the built bundle hash asserted to have moved.
- §4.1d negative claims: a passing test that a valid certificate does **not** establish the
  operator's identity, expressed as the lab's own check returning "not established".

## Why not a section inside an existing lab

Chain of Trust is now a Beginner lab and could carry this, and it should not. Its subject is
path building versus path validation, which is a different and narrower question, and the
padlock answer needs to sit at a URL a newcomer can be sent to.
