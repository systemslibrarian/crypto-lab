# Build brief — `crypto-lab-what-is-pqc`

**2026-10-03. Brief only; no repository exists yet.** Written against
`audits/_MASTER-TEMPLATE.md`; §0 principles, §1 build, §2 teach, §3 look, §4 accessibility,
§5 README and §6 deploy all apply unchanged. Decided in
`audits/BEGINNER-ONRAMP-2026-10-03.md`, which found 17 cards naming ML-KEM or Kyber and every
one of them levelled Advanced but one — a subject with plenty of depth and no way in.

```
NEW DEMO BRIEF
- Repo name:         crypto-lab-what-is-pqc
- Short name (H1):   What Is PQC
- Subtitle:          ML-KEM-768 - FIPS 203 - why today's keys are at risk
- One-liner:         Runs a real ML-KEM-768 encapsulation and decapsulation beside a classical
                     X25519 exchange, so the only visible difference is what a future machine
                     could undo.
- Concept to teach:  "Post-quantum" is not a stronger padlock; it is a padlock built on a
                     different hard problem, because the one today's keys use has a known
                     quantum solution.
- Primitives/spec:   FIPS 203 (ML-KEM), RFC 7748 (X25519), via @noble/post-quantum and
                     @noble/curves
- Accent (--accent): [central assignment]
- Favicon emoji:     [central assignment]
- In scope:          a real ML-KEM-768 exchange; the same exchange with X25519; what each side
                     sends and how big it is; one corrupted ciphertext; what "harvest now" means
- Non-goals:         lattices, LWE, polynomial rings, the NTT, Fujisaki-Okamoto, hybrids,
                     migration planning, timing attacks
```

## The one thing it must not do

**Never say post-quantum cryptography is "stronger".** It is not a bigger lock; it rests on a
different hard problem. The lab's job is to make that distinction stick in plain language,
because the "stronger" framing is the single most common misunderstanding and it leads people
to the wrong decisions about what to migrate and when.

## Scope — three panels

1. **Two people agree on a secret, in the open.** Run a real **X25519** exchange. Both sides end
   up holding the same bytes while an observer sees only what crossed the wire. Then the
   sentence that does the work: *a machine that does not exist yet is expected to be able to
   take what crossed the wire and work out the secret anyway.* No Shor, no period finding, no
   factoring — the link to **Shor** is there for a reader who wants it.
2. **The same thing, on a different hard problem.** Run a real **ML-KEM-768** encapsulation and
   decapsulation. Public key in, ciphertext and shared secret out, both sides match. Side by
   side with panel 1, the **only** visible differences are the sizes — 32 bytes against 1,184
   and 1,088 — and that is the honest, arithmetic-only statement of what changed. Not "stronger":
   **bigger, and built on a different problem**.
3. **Break one byte.** Flip a bit of the ML-KEM ciphertext and watch the two sides end up with
   different secrets. This is also where the lab is honest about something real: ML-KEM's
   decapsulation does not fail loudly, it returns a different secret — which is the subject of
   **KEM Trap**, linked here.

Then a closing panel in plain story form: someone records today's traffic and keeps it. Link to
**Harvest Timeline** (now Beginner) and **Harvest Vault** for that story in full, and to
**PQ Chooser** for a reader who has to make a decision.

## Keeping it real with the maths hidden

The cryptography is real: `@noble/post-quantum`'s ML-KEM-768 and `@noble/curves`' X25519, with
pinned FIPS 203 known-answer vectors checked in the test suite, exactly as the fleet's existing
PQ labs do. **The words lattice, LWE, polynomial, ring and NTT appear nowhere on the page**
except in one sentence pointing at **Lattice Gentle** for the reader who wants the picture
underneath. There is no byte-level panel, no decomposition of the ciphertext, no parameter
table.

Sizes are shown because they are the one thing a beginner can check and reason about with
arithmetic alone, and because they are the real engineering consequence — handshakes got bigger,
which is why **Downgrade Wire** and hybrid deployments exist.

## Visual semantics

Panels 1 and 2 are deliberately **symmetrical**: same layout, same labels, same colours. The
reader should see two things doing the same job, which is the whole argument against "stronger".
Any visual that made the ML-KEM panel look safer or heavier would be making the claim this lab
exists to refuse.

Panel 3's mismatched secrets must read as **a difference, not an error** — nothing crashed, and
that is exactly the trap.

## Tests

- FIPS 203 ML-KEM-768 KATs pass; RFC 7748 X25519 vectors pass. Both pinned, both from the
  publication, with the provenance recorded beside them — including, honestly, whether a vector
  came from the specification or was reproduced from a validated implementation.
- Round-trip: encapsulate and decapsulate agree, over many runs.
- Negative: a corrupted ciphertext produces a **different** shared secret rather than an error,
  asserted as the measured outcome.
- `e2e/claims.spec.ts` asserts each panel's verdict from the computed values (§4.1b).
- §4.1c mutations per verdict, each required to turn a NAMED test red, baseline-passed and
  bundle-hash-moved asserted first.
- §4.1d negative claims, and this lab needs them more than most: a passing test that running
  ML-KEM establishes **nothing** about who is on the other end — authentication is a separate
  problem, and a reader who leaves thinking "post-quantum" means "safe" has been taught wrongly.

## Links out

**Shor** for why the classical problem falls. **Lattice Gentle** for the picture underneath.
**KEM Trap** for the silent decapsulation failure. **Harvest Timeline** and **Harvest Vault**
for the everyday case. **PQ Chooser** for a decision. **Kyber Vault** for the same primitive at
depth. Named because this brief was written against them; the catalog may hold others.
