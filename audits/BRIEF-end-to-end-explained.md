# Build brief — `crypto-lab-end-to-end-explained`

**2026-10-04. Brief only; no repository exists yet.** Written against
`audits/_MASTER-TEMPLATE.md` — §0 principles through §6 deploy apply unchanged.

**Verdict: new repository.**

```
NEW DEMO BRIEF
- Repo name:         crypto-lab-end-to-end-explained
- Short name (H1):   Who Can Read This
- Subtitle:          End-to-end - in transit - server-side
- One-liner:         Sends one message three ways and shows, for each, exactly which parties
                     hold a key that opens it - and what the server still learns either way.
- Concept to teach:  "Encrypted" is not one thing. The question is always WHO HOLDS THE KEY,
                     and metadata is not encrypted by any of them.
- Primitives/spec:   AES-256-GCM and HKDF-SHA-256 via WebCrypto; X25519 (RFC 7748) for the
                     end-to-end case
- Accent (--accent): [central assignment]
- Favicon emoji:     [central assignment]
- Category:          [central assignment]
- In scope:          three delivery models side by side; one real encryption each; the key
                     holders named per model; the metadata the server keeps in all three
- Non-goals:         X3DH, the Double Ratchet, forward secrecy, deniability, group messaging,
                     key transparency, endpoint compromise (each named and handed on)
```

## Overlap check — what I read, and what I found

I opened **X3DH Wire**, **Ratchet Wire** and **Encrochat**.

Each is excellent and each starts one step past this question. X3DH Wire is the handshake that
lets Alice message an offline Bob; Ratchet Wire is a live Signal-style chat with a Key State
panel and a seven-step guide; Encrochat runs a real Double Ratchet and then compromises the
endpoint. Encrochat's opening paragraph is the closest thing I found to a plain statement of
what end-to-end encryption *is* — and it is there as setup for its own argument about phones,
not as the lab's subject.

What none of the three does is **compare** end-to-end against the two things people actually
confuse it with: a connection that is encrypted in transit but readable at the server, and
storage the provider can open. That comparison is the lab.

## Scope — one message, three ways

The same message is sent three times, and each run names **every party that holds a key able
to open it**:

1. **Server-readable.** Encrypted on the wire and at rest, with a key the provider holds. The
   provider's panel can open it, on screen.
2. **Encrypted in transit.** Encrypted between each hop, decrypted at the server, re-encrypted
   onward. The server's panel can open it at the middle step — and this is the one most people
   mean when they say "it's encrypted".
3. **End-to-end.** Keys derived from an X25519 exchange between the two devices. The server's
   panel is handed the same bytes and **cannot** open them; the failure is shown as a real
   decryption failure, not a greyed-out box.

Then the panel that earns the lab its place: **what the server still has in all three cases.**
Who messaged whom, when, how often, how large, from what address. Rendered as the record the
provider could hand over, with the message body blank in case 3 and everything else intact.

## Keeping it real with the maths hidden

WebCrypto throughout: X25519 via `@noble/curves` for case 3, HKDF-SHA-256 to turn the shared
secret into a key, AES-256-GCM for every encryption. **No key schedule on screen, no ratchet,
no notation.** The ciphertext appears as a short byte strip; full hex is one `<details>` away.

The decryption failure in case 3 is a real `OperationError` from a real AEAD tag check, not a
branch that prints "denied" — and the §4.1c mutation set exists to prove that.

## Visual semantics

Each model is drawn as the same three-box picture — you, the server, them — with **a key icon
on every party that can open the message**. The reader should be able to count keys. Colour
tracks who holds one, never "good" and "bad": encrypted-in-transit is not a defect, it is a
different promise, and a lab that painted it red would be teaching a slogan.

The metadata panel must read as **neutral and complete**, not as an alarm. It is what all three
models leak, including the best one.

## Tests

- KATs: RFC 7748 X25519 vectors; an AES-GCM vector from the NIST CAVP set, with provenance
  recorded beside it.
- Round-trip per model, and the negative that matters: in case 3 the server's key **fails** to
  decrypt, asserted as a thrown AEAD failure rather than a comparison.
- `e2e/claims.spec.ts` (§4.1b) asserts each model's "who can read this" verdict from the
  computed outcome.
- §4.1c: one mutation per rendered verdict — a server panel that reports success on case 3, one
  that reports failure on cases 1 and 2, a key-holder count hard-wired per model, and a metadata
  panel that drops a field. Each must turn a NAMED test red, baseline-passed and
  bundle-hash-moved asserted first.
- **§4.1d negative claim — the belief a beginner most likely leaves with wrongly:** *"end-to-end
  encryption means nobody can tell I was talking to this person."* A passing test asserts the
  metadata record is **fully populated in case 3**, so the page cannot imply a protection the
  mechanism does not provide. Second negative, stated in-page and tested: end-to-end says
  nothing about the two endpoints themselves — which is **Encrochat**'s entire subject.

## Links out

**Agreeing in Public** for how the two devices got a shared key at all. **X3DH Wire** for doing
that when one of them is offline. **Ratchet Wire** for what happens over a long conversation.
**Encrochat** for the endpoint. **Key Mirror** for how you know the key really belongs to your
friend.

## Start Here placement

After the HTTPS Padlock. The padlock answers "who can read this between me and the site";
this answers "and what about the site itself", which is the natural next question and the one
newcomers most often get wrong.
