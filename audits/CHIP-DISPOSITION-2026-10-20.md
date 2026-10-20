# Chip-rule disposition — 2026-10-20

`node tools/catalog-sync.js chips` reports **23 violations across 19 labs**. CLAUDE.md
records that the gate criterion is MET and that "dispositioning those comes first and the
decision is the maintainer's". This file is the dispositioning. **It does not turn the
gate on, and nothing here changes a card.**

Each chip was judged by reading the lab's own source for the OPERATIONS, never by
grepping for the algorithm's name — that is what the scanner already does, and repeating
it would reproduce its answer. Where a verdict rests on something I did not open, the row
says so.

## The headline

**None of the 23 is a demonstrable card defect.** Every one is either an algorithm the
lab really implements and the scanner cannot anchor, or a chip the rule judges in
isolation when the card's own neighbouring chips already mark it.

I reached the opposite conclusion first and it is worth recording how. Judging each
flagged chip ALONE — which is what the tool does — produced six cards that looked like
they were claiming constructions they do not build. Reading the whole chip SET, which is
what a visitor reads, overturned five of the six:

| lab | the flagged chip | its neighbours on the same card |
|---|---|---|
| `zk-arena` | zk-STARK | zk-SNARK · Proof Systems · **Comparison** |
| `isogeny-gate` | SIDH | CSIDH · SQIsign · **Castryck-Decru** |
| `pq-families` | Isogeny | **Lattice · Code-Based · Hash-Based · Multivariate** |
| `sleeve-check` | Streebog | **Kuznyechik** · TKlog · AES S-Box |
| `accumulator` | RSA Accumulator | Non-Membership Proofs · **Strong RSA** · Certificate Revocation |

`zk-arena` says *Comparison* on its own card. `isogeny-gate` puts *Castryck-Decru* — the
attack that broke SIDH — next to SIDH. `pq-families`' chips are all family names, a
taxonomy rather than a stack. `sleeve-check` analyses the π S-box that Kuznyechik and
Streebog SHARE. And `accumulator` turned out to implement a real RSA accumulator after
all: `src/accumulator/accumulator.ts` carries `modPow` thirteen times and `hashToPrime`,
which is the construction, not a Merkle tree.

**So the single most useful thing in this file is a limitation of the rule, not a list of
bad cards: the chip rule judges one chip at a time, and a card's marker is frequently a
DIFFERENT chip in the same set.** `Comparison`, `Castryck-Decru`, `Strong RSA` and a run
of four sibling family names are all markers a reader uses and the rule cannot see.

| class | chips | what it means |
|---|---|---|
| A — entailed by an implemented algorithm | 12 | the lab implements the named thing; the scanner cannot anchor it |
| F — marked by a SIBLING chip, not by itself | 3 | honest on the card; invisible to a per-chip rule |
| B — granularity | 1 | the chip is more specific than the vocabulary term |
| C — executed by a dependency | 1 | the primitive runs, in a package rather than this source |
| D — target or fidelity, needs a marker word | 3 | honest in substance, unmarked in form |
| G — marginal, worth a maintainer's eye | 1 | `protocol-compose`'s TLS 1.3 |
| pending a further read | 2 | named here rather than guessed |

## A — entailed by an implemented algorithm (12 chips, 9 labs)

The chip names a component, hardness assumption or sub-algorithm of something the lab
demonstrably implements. These are the `unnamed-implementation` class CLAUDE.md calls the
real ceiling, reached from the other direction: the name is present but only in comments
and UI strings, so no anchor is derivable.

| lab | chip | evidence read |
|---|---|---|
| `ckks-lab` | RLWE | implements CKKS (`toyCkks.ts:209`); ring arithmetic at `polyMulNegacyclic`, `toyCkks.ts:186`. "RLWE" appears at lines 7, 9, 214 — all comments. CKKS ciphertexts *are* RLWE pairs in Z_q[x]/(x^n+1), as the file's own header says. |
| `fhe-arena` | RLWE | implements BFV (`toyFhe.ts:132`); `polyMulNegacyclic` at `toyFhe.ts:61`. BFV is an RLWE scheme. |
| `shelf-oracle` | RLWE | implements BFV (`pir/pir.ts:8`); `pir/bfv.ts:56` is the uniform ring-element sampler, documented as "the `a` half of every RLWE sample". |
| `hqc-vault` | Reed-Solomon | `src/codes.ts:111` `rsBerlekampMassey()`, with `RS_N`/`RS_K`/`RS_T` at 62-64. The names sit in comments (1, 4) and UI strings (15, 23, 29). |
| `hqc-vault` | Reed-Muller | same file, `RM_M`/`RM_N`/`RM_K` at 243-245, `traceConcatenated()` at 326. HQC's decoder *is* concatenated RS + RM. |
| `icy-dvrf` | Chaum-Pedersen DLEQ | `dvrf/protocol.ts` carries DLEQ in 11 places and there is a dedicated `dvrf/dleq.test.ts`. Depends on `@noble/curves`. |
| `icy-dvrf` | FROST Nonces | `dvrf/protocol.ts`, 5 occurrences, beside the DLEQ implementation. |
| `garbled-gate` | Oblivious Transfer | `src/main.ts` carries OT in 19 places and "Oblivious" in 7, over `@noble/curves`. The card already credits Garbled circuits, which cannot run without it. |
| `beacon-lock` | Boneh-Franklin IBE | `core/tlock.ts`, IBE in 8 places. The card credits Pairing, BLS12-381 and Hash-to-curve — the primitives Boneh-Franklin is built from, and what drand-style timelock is. |
| `accumulator` | RSA Accumulator | `src/accumulator/accumulator.ts` is a real RSA accumulator: `modPow` ×13, `hashToPrime`, bigint arithmetic throughout, with `accumulator.test.ts` and `adversarial.test.ts` beside it. The card is credited with Merkle tree and SHA-256 only. |
| `sleeve-check` | Streebog | implements Kuznyechik, and Streebog shares its π substitution — the TKlog structure the lab exists to analyse IS Streebog's S-box. |
| `ggh-trapdoor` | Babai Round-Off | there is a `src/lattice/roundoff.ts` module with its own `roundoff.test.ts`, plus `sign/klein.test.ts` and `sign/verify.test.ts` exercising `roundOff`. GGH decryption *is* Babai round-off. |

### The obvious remedy is the one CLAUDE.md forbids

My first conclusion was: add a human-reviewed `add` to `tools/catalog-reviewed.json` for
each of the ten, anchored at the implementation line above. **That is wrong, and checking
what `verify` requires of an anchor is what caught it.**

An anchor resolves only if the term is named ON the line, or by the PATH, or by a declared
structure (`catalog-evidence.js:1387-1389`). None of these ten implementation lines name
their algorithm — `polyMulNegacyclic` does not contain "RLWE", `rsBerlekampMassey` does not
contain "Reed-Solomon". So every one of those anchors would be reported STALE-ANCHOR on the
next `verify`, trading 23 chip findings for 10 broken anchors.

The only lines that WOULD resolve are the comments — `toyCkks.ts:7` really does say RLWE.
And anchoring an implementation claim at a comment is the precise thing CLAUDE.md refuses:
closing this class "without reading comments as implementations ... would hand back the
very false claims four cards were just corrected for". `comment-only` exists to say *we
cannot tell from executable code*; converting it into a credit inverts it.

**So class A is the `unnamed-implementation` ceiling, and the reviewed-anchor file is not
the instrument for it.** Two honest options, both the maintainer's call:

1. **Declare the entailment.** Each of these ten is a mathematical fact about a scheme the
   lab is already credited with: CKKS and BFV are RLWE schemes; HQC's decoder *is*
   concatenated Reed-Solomon + Reed-Muller; GGH decryption *is* Babai round-off; drand-style
   timelock *is* Boneh-Franklin; garbled circuits require oblivious transfer. A declared
   `entails` relation on a vocabulary term would let the chip rule accept a chip entailed by
   a credited implementation, without crediting `data-implements` with anything new. It is
   checkable and it is not a loosened pattern — the relation is written down, not inferred.
2. **Exempt and name them, the way NOT-SCANNED is exempted.** Cheaper, and it leaves ten
   true chips permanently listed as unjudgeable.

Option 1 is the better one and it is a vocabulary change with a fleet-wide blast radius, so
it is proposed here rather than made. What must NOT happen is the reviewed-anchor route: it
looks like the established mechanism and it would either break ten anchors or credit ten
implementations to a comment.

## B — granularity (1 chip)

`ablation-wire` chips **AES-256-GCM**; the vocabulary term is `AES-GCM`, which the card is
already credited with implementing. The key length is a parameter of the thing it
implements, not a different algorithm. **No card change is right here** — the rule needs
to treat a chip that is strictly more specific than a credited term as satisfied.

## C — executed by a dependency (1 chip)

`bcrypt-forge` chips **Blowfish**. It calls `bcryptjs`, whose `expensive_key_schedule`
is EksBlowfish, and the lab's own worker comment says it "Runs the REAL Eksblowfish key
schedule". Its own source names Blowfish only in UI copy (`exhibits.ts:190`, `:833`) and
DOM ids. So the chip is TRUE of the stack and false of this repository's source.

This is the same shape as class B from the other side, and it is the one a maintainer
should rule on explicitly: **does a chip describe the stack, or this lab's own code?**
CLAUDE.md says a chip "is the card's claim about its own stack", which favours keeping it.

## D — a target or a fidelity, honest but unmarked (3 chips)

| lab | chip | reading |
|---|---|---|
| `shor` | RSA Factorization | implements Shor's algorithm (`shor.ts`, `factor` ×27, `modPow` ×5) and no RSA keygen or encryption. The chip names what the algorithm is pointed AT. `vs. RSA` would mark it. |
| `point-ledger` | Shor Estimates | "Estimates" already names a fidelity in plain English — and it is NOT in the marker vocabulary, which is `toy\|simulated\|simplified\|without\|not\|vs.\|intro\|style`. |
| `point-ledger` | secp256k1 | appears only in `src/sources.ts`, a citations file; the lab depends on `@noble/hashes` and not `@noble/curves`, so it does no curve arithmetic. Reads as the curve the subject matter is ABOUT. |

**`Estimates` is a marker-vocabulary gap, not a card defect.** A card that honestly
qualified its chip and still gets flagged is the exact failure mode CLAUDE.md warns of
for this rule. Worth adding to the marker list before any gate.

## F — marked by a sibling chip, not by itself (3 chips)

Honest on the card, invisible to a rule that reads one chip at a time. **No card change
is right here.**

| lab | chip | the marker the rule cannot see |
|---|---|---|
| `zk-arena` | zk-STARK | the card also chips **Comparison**, and the lab is exactly that: `data.ts` is a table of ZK systems, and the source implements `groups.ts`, `pohlig.ts`, `schnorr.ts`, `trustedsetup.ts` with no FRI and no dependencies. Note the rule flags `zk-STARK` and NOT its twin `zk-SNARK`, which is itself a sign the finding is about anchoring rather than about the claim. |
| `isogeny-gate` | SIDH | the card chips **Castryck-Decru** beside it. `src/csidh.ts` implements CSIDH and names SIDH three times next to Castryck and Decru — discussing the attack that killed it. |
| `pq-families` | Isogeny | the card chips **Lattice · Code-Based · Hash-Based · Multivariate · Isogeny** — five family names. CLAUDE.md already records that ~400 chips match no vocabulary term and are "almost all concepts like `Lattice`"; `Isogeny` differs only in that a term happened to match it. |

## G — marginal, and genuinely the maintainer's call (1 chip)

`protocol-compose` chips `MAC-then-Encrypt | Encrypt-then-MAC | CRIME | TLS 1.3` and
implements AES, AES-CBC, AES-GCM, HMAC and SHA-256. `TLS 1.3` appears once in its source,
in `attacks.ts`, with no ClientHello, no ServerHello and no key schedule.

Unlike the three above, **no sibling chip marks it**: the other three are composition
orders and an attack name, so the set reads as a topic list in which `TLS 1.3` could be
taken either as the real-world case being discussed or as the stack. This is the one row
where a marker would genuinely help a reader, and it is also the one where I would not
pick the wording myself.

## Pending a further read (2 chips)

Named rather than guessed at:

- `ciphertext-mirror` — **FO Transform.** The lab implements ML-KEM, whose CCA security
  *is* the implicit-rejection Fujisaki-Okamoto transform, so this is probably class A. But
  the occurrences I found are in `components/DecapPrimer.ts` and a card view — teaching
  copy — and I did not confirm that its decapsulation actually re-encrypts and compares.
  That one read settles it.
- `point-ledger` — **Fiat-Shamir.** Not separated from the two `point-ledger` rows above;
  the lab does no curve arithmetic, but Fiat-Shamir is a transform rather than a curve
  operation and could be present over hashes alone.

## What this says about the gate

The criterion is MET and the report is still not a gate, for a reason this exercise
makes concrete: **17 of 23 findings are about what the scanner can anchor, not about what
a card claims.** Three of those seventeen are a gap in the marker vocabulary itself
(`Estimates`), one is a granularity mismatch, one is a dependency question the rule has
never been asked.

The order that would make the gate safe:

1. Rule on class A — the entailment relation, or a named exemption. **Not** reviewed
   anchors; see above for why that route breaks. The report drops to 13.
2. Rule on class B and C — one sentence each in CLAUDE.md, no code.
3. Decide whether a card's chip SET can mark a chip. Three of the 23 are marked by a
   sibling chip today and a per-chip rule cannot see it. This is the finding with the
   longest reach: it applies to every future card, not just these three.
4. Add fidelity words like `estimates`, `compared`, `surveyed`, `explained` to the marker
   vocabulary, or mark those three chips.
5. Rule on `protocol-compose`'s TLS 1.3 — the one row where a marker would help a reader.
6. Then the gate costs little to switch on, and the decision is still the maintainer's.

**The one thing this file argues against is switching the gate on now.** It would redden
CI on 23 chips of which, after reading every lab's source, **none is demonstrably
overclaiming** — which is precisely the failure CLAUDE.md predicts for this rule: "every
algorithm the scanner misses becomes a card falsely accused of overclaiming."
