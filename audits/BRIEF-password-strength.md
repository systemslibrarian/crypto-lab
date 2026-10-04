# Build brief — `crypto-lab-password-strength`

**2026-10-04. Brief only; no repository exists yet.** Written against
`audits/_MASTER-TEMPLATE.md` — §0 principles through §6 deploy apply unchanged.

**Verdict: new repository.**

```
NEW DEMO BRIEF
- Repo name:         crypto-lab-password-strength
- Short name (H1):   How Strong Is My Password
- Subtitle:          Guessing cost - passphrases - NIST SP 800-63B
- One-liner:         Counts how many guesses a password costs an attacker who knows exactly how
                     you built it, and rolls a real dice passphrase to compare.
- Concept to teach:  Strength is how many guesses it takes, not how complicated it looks - so
                     length beats symbols, and a pattern you chose is a pattern an attacker
                     assumes.
- Primitives/spec:   crypto.getRandomValues for generation; the EFF large wordlist (7,776
                     words); NIST SP 800-63B Rev. 4 for the guidance
- Accent (--accent): [central assignment]
- Favicon emoji:     [central assignment]
- Category:          [central assignment]
- In scope:          guess-count from the actual search space; length vs symbols, compared
                     head to head; a real generated passphrase; what the figures assume
- Non-goals:         password storage and hashing (Bcrypt Forge owns it), breach-corpus
                     lookup, password managers, credential stuffing, any network request
```

## The hard constraint

**No password the reader types ever leaves the page — there is nowhere for it to go.** No
backend, no analytics, no breach-corpus API, no autocomplete, no form submission, and the input
is never written to `localStorage`, a URL, or the document title. A lab that asked people to
type real passwords and then phoned home would be the single worst thing in this fleet. The
page says this in its own words, above the input, and `e2e` asserts that typing into it
produces **zero outbound requests**.

## Overlap check — what I read, and what I found

I opened **Bcrypt Forge**. It is the other half of this subject and it is the **defender's**
half: the anatomy of a stored `$2b$` string, the cost-factor benchmark, timing-safe comparison,
a breach database, a rainbow-table lookup and a real dictionary attack. Its question is *how
should a site store what you chose*.

This lab's question is *what should you choose, and why* — the user's side. The two meet at the
dictionary attack, and that is the link, not a merger. Folding a strength meter into Bcrypt
Forge would blur a lab that currently has one clear subject, and that lab is now a Beginner lab
whose opening I would be displacing.

## Scope — four panels

1. **Guesses, not stars.** Type something; the page reports **how many guesses it costs an
   attacker who knows exactly how you built it** — which character sets, which pattern, which
   substitutions. No five-star meter. The number is the output, expressed as a count and then
   as a time at a stated guessing rate, with the rate **named on screen** because a guessing
   time without an assumed rate is not a measurement.
2. **Length against symbols.** Two passwords side by side: a short one with substitutions and
   punctuation, and a longer plain one. The counts are computed, not asserted, and the longer
   plain one wins by a distance the reader can see. This is where NIST SP 800-63B Rev. 4 §3.1.1.2
   is quoted directly: verifiers *"SHALL NOT impose other composition rules (e.g., requiring
   mixtures of different character types)"*, and they **SHALL NOT** require periodic rotation.
3. **Roll one.** A real passphrase from the **EFF large wordlist** — 7,776 words, five dice per
   word — drawn with `crypto.getRandomValues`, with the dice shown rolling. EFF puts this at
   about **12.9 bits per word** and recommends **six words, about 77 bits**. The same guess-count
   from panel 1 is applied to it, so the comparison is like for like.
4. **What these numbers assume.** The honest panel. The figures assume the attacker is guessing
   offline against a stolen hash, knows the construction, and guesses at the stated rate. Change
   any of those and the number moves. A password that appears in a breach corpus costs **one**
   guess whatever its shape — which is why SP 800-63B §3.1.1.2 requires verifiers to screen
   against a blocklist, and why this panel exists rather than a reassuring badge.

## Keeping it real with the maths hidden

The generation is real: `crypto.getRandomValues` indexing a vendored copy of the EFF large
wordlist, with the modulo bias rejected rather than ignored. **No entropy formula on screen** —
the page says "how many guesses", and the `log2` figure lives in a `<details>` for readers who
want it. Dice are drawn because five dice per word is the honest picture of where the
unguessability comes from, and it connects straight back to **Good Randomness**.

## Visual semantics

**No five-star meter, no green "Strong!" badge.** Colour tracks the guess count against a stated
threshold with the threshold visible, and the verdict is always a number plus a sentence. A
password that scores well but is in a common-password list must read as **ALARM** despite its
count — the count is correct and the conclusion a reader would draw from it is wrong, which is
exactly the case the fleet's colour rule exists for.

## Tests

- The wordlist is asserted to be exactly 7,776 entries, deduplicated, matching the vendored
  file's checksum — the lab's strength claims rest on that count.
- Guess-count KATs: fixed inputs produce fixed counts, so a change to the model is visible in a
  diff rather than hidden in a slider.
- Generation: over many runs every word comes from the list, no word index is out of range, and
  the rejection sampling leaves no bias detectable at the sample size the test uses (stated,
  not implied).
- **A test that typing into the password field produces zero network requests**, asserted by
  intercepting every request in the page context. This is the lab's most important test.
- `e2e/claims.spec.ts` (§4.1b) asserts every rendered verdict from the computed count.
- §4.1c: one mutation per rendered verdict — a guess count hard-wired high, one hard-wired low,
  a generator that draws from a truncated wordlist, a blocklist check that always passes, and
  the removal of the no-network guard. Each must turn a NAMED test red, baseline-passed and
  bundle-hash-moved asserted first.
- **§4.1d negative claim — the belief a beginner most likely leaves with wrongly:** *"my
  password scored well, so my account is safe."* A passing test asserts that a password with a
  **high** guess count which also appears in the vendored common-password list is reported as
  weak, and that the lab states plainly that reuse across sites, phishing and a breach at the
  provider are all unaffected by anything on this page. Those are **Your Authenticator App**'s
  and **End-to-End Encryption**'s territory, and they are linked rather than implied away.

## Links out

**Bcrypt Forge** for what the site does with it. **Good Randomness** for why the dice are not a
gimmick. **Your Authenticator App** for the second factor. **Hash Zoo** for what a stored hash
is in the first place.

## Start Here placement

Immediately before Bcrypt Forge — the user's side, then the server's side, read as one pair.
