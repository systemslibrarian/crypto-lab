# Build brief — `crypto-lab-good-randomness`

**2026-10-04. Brief only; no repository exists yet.** Written against
`audits/_MASTER-TEMPLATE.md` — §0 principles through §6 deploy apply unchanged.

**Verdict: new repository.**

```
NEW DEMO BRIEF
- Repo name:         crypto-lab-good-randomness
- Short name (H1):   Good Randomness
- Subtitle:          CSPRNG - seeds - why a guessable key is no key
- One-liner:         Generates keys from the browser's real CSPRNG and from a seeded generator
                     anyone can rerun, then recovers every "random" key the second one will
                     ever produce.
- Concept to teach:  A key is only a secret because nobody can guess it. A generator that
                     starts from a guessable seed produces guessable keys, and nothing about
                     the output looks wrong.
- Primitives/spec:   crypto.getRandomValues (Web Cryptography API) as the real source; a
                     seeded ChaCha20-based generator as the predictable one
- Accent (--accent): [central assignment]
- Favicon emoji:     [central assignment]
- Category:          [central assignment]
- In scope:          dice vs computer; one real CSPRNG; one seeded generator the reader can
                     rerun and predict; a key recovered because its seed was guessable
- Non-goals:         DRBG internals and the SP 800-90A constructions, entropy assessment and
                     SP 800-90B, the Dual_EC backdoor, VM cloning, statistical test batteries
```

## Overlap check — what I read, and what I found

I opened **DRBG Arena**, **Entropy Collapse**, **Noise to Numbers** and **Corrupted Oracle**.

All four are about randomness and all four start where this one would end. DRBG Arena walks the
three NIST SP 800-90A constructions through seed → state → output → reseed. Entropy Collapse
restores one machine's HMAC_DRBG onto two and watches them emit identical secrets. Noise to
Numbers is SP 800-90B min-entropy assessment of a physical source — its opening paragraph,
*"a program that starts from the same state takes the same steps"*, is the clearest statement
of this lab's thesis that I found anywhere, and it is the setup for a lab about assessment
methodology. Corrupted Oracle runs Dual_EC beside two honest generators; its prose is
unusually plain and it still assumes the reader knows why a backdoored generator matters.

Each assumes the reader already accepts that unguessable numbers are the foundation. This lab
is the one that establishes it, and then hands them on — to Entropy Collapse for the failure at
scale, to Corrupted Oracle for the deliberate one.

## Scope — three panels

1. **Dice, then a computer.** Roll real dice on screen; the result is unguessable because the
   physics is. Then ask what a computer does, given that a program with the same input takes the
   same steps. Plain language, no definitions yet.
2. **Two generators, same-looking output.** `crypto.getRandomValues` on the left; a generator
   seeded with something guessable — today's date, a counter, a four-digit PIN — on the right.
   **Both outputs look identical in character.** Both pass the simple checks a reader would
   think to apply (even spread of digits, no repeats). This is the panel that does the work:
   *looking random is not evidence of anything*.
3. **Recover the key.** The reader picks the seed from a small set, the lab regenerates the
   "random" key the second generator produced, and uses it to decrypt a message that generator
   encrypted. Then the same attempt against the CSPRNG key, which has nowhere to start from.

Closing: one real-world line — real TLS and SSH hosts have shipped duplicate, guessable keys
with no flaw in the cryptography — with the link to **Entropy Collapse**, which is the lab that
shows it.

## Keeping it real with the maths hidden

The real source is the Web Cryptography API's `crypto.getRandomValues`, which is what a browser
actually uses. The predictable source is a seeded ChaCha20 stream — a real, respectable
construction deliberately given a bad seed, because the lesson is **the seed, not the algorithm**,
and using a toy LCG would let a reader conclude the generator was the problem.

**No entropy figures, no min-entropy, no statistical test names, no state diagrams.** The
"how guessable" number is expressed as *how many tries* — a four-digit PIN is ten thousand
tries, which is arithmetic a beginner can hold — and the lab counts them live while it searches.

## Visual semantics

Panel 2 is the trap and must look it: the two outputs side by side, **visually indistinguishable,
both passing the reader's own checks**, neither marked. No colour until panel 3 resolves which
was which. Painting the seeded one red in panel 2 would give the game away and destroy the
lesson, which is precisely that you cannot see it.

Panel 3's recovery reads as **ALARM**, not as a successful computation.

## Tests

- The CSPRNG path is asserted structurally (32 bytes, drawn from `crypto.getRandomValues`), not
  statistically — a test that asserted randomness of a random source would be flaky by
  construction, and saying so is part of the lab's honesty note.
- The seeded generator has fixed KATs: a given seed yields a given stream, reproducibly.
- The recovery test is the real one: from the seed alone, the test reconstructs the key and
  decrypts the ciphertext, and the same attempt against a CSPRNG key fails.
- `e2e/claims.spec.ts` (§4.1b) asserts each verdict from the computed outcome.
- §4.1c: one mutation per rendered verdict — a recovery panel that claims success without
  decrypting, one that claims failure after a real decryption, a "looks random" check hard-wired
  to pass, and a seeded generator quietly swapped for the CSPRNG so the attack could never work.
  Each must turn a NAMED test red, baseline-passed and bundle-hash-moved asserted first.
- **§4.1d negative claim — the belief a beginner most likely leaves with wrongly:** *"if the
  output looks random, the generator is fine."* A passing test asserts that the seeded
  generator's output **passes the page's own look-random checks** while its key is still fully
  recoverable. The page cannot show those checks passing without also showing they establish
  nothing.

## Links out

**Entropy Collapse** for the same failure on real machines. **Corrupted Oracle** for a generator
sabotaged on purpose. **DRBG Arena** for how the approved ones are built. **Noise to Numbers**
for where the first unguessable bits come from. **Locks and Keys** for what the keys are then
used for.

## Start Here placement

Early — after What a Hash Is and before Locks and Keys. Every lab after it generates a key, and
this is the one that says why that step is not a formality.
