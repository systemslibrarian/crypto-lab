# Crypto Lab — Concept Coverage Checklist

*Version 6 — v2 corrected the timelock/witness-encryption conflation and demoted NTT; v3
resolved the card-based ordering on the strength of its Cipher Museum crossover. v4 filed the
eight demos no concept had claimed, carded the four that were built but invisible (clearing the
hygiene backlog), split deniability out of §23 as §23b, moved §32 and §12 to `COVERED`, filed MuSig Gate
and Ablation Wire, and put the whole map under `concept-sync`. v5 filed Accumulator, which
closed the cryptographic-accumulator gap and moved §25 from `PARTIAL` to `COVERED`, leaving
five gaps. **v6 closes all five.** DP Noise (§23), Card Trick (§20), Matsui Line (§30), Beacon
Lock (§15) and Simon's Period (§33) were each built and left uncatalogued; filing them moves
every remaining `PARTIAL` to `COVERED` and empties the Gap summary table. Search Vault joins
§23 and Stream Ward joins §5 as additions rather than gap closures. The catalog is
concept-complete against this taxonomy — which is an editorial claim about these forty
boundaries, not a statement that cryptography has been exhausted.*

**Purpose.** Crypto Lab is not trying to enumerate every cryptographic artifact — the
artifact space is effectively unbounded (hundreds of standardized primitives, plus every
named attack and variant). It is trying to cover the *concept* space: the finite set of
genuinely distinct ideas the field is built from.

This file maps the catalog onto those concepts, so "what's left?" is a lookup rather than
an audit. A gap is a concept with **no demo**, or a concept whose demos **leave an arc
unfinished**. Everything else is done.

**Scope.** Crypto Lab covers mathematically grounded security *and privacy* mechanisms,
including concepts adjacent to — but not strictly classified as — cryptographic primitives.
This is a description of what the catalog already is, not an exception being carved out:
it already carries migration planners, threat models, PKI operations, passkeys, and wallet
mechanics, none of which are primitives. The test for inclusion is whether a mechanism has
a checkable mathematical guarantee a learner can break, not whether it appears in a
primitives textbook.

**How to use.** When a candidate demo appears (an ePrint paper, an article, an idea), find
its concept below. If the concept is `COVERED` or `DEEP`, the candidate is a variant —
build it only if you want depth there, not because the suite needs it. If it's `GAP` or
`PARTIAL`, it earns its place.

**Status legend**

| | Meaning |
|---|---|
| `COVERED` | Concept taught; arc complete. Leave alone. |
| `DEEP` | Covered several times over. Adding more dilutes. |
| `PARTIAL` | Taught, but an arc is unfinished or a piece is missing. |
| `GAP` | No demo teaches this concept. |

Catalog basis: the 175 cards in `index.html` as of the v6 catalog pass.

**Checked, not trusted.** Run `node tools/concept-sync.js check`. It verifies this file
against the catalog in both directions: every demo cited below resolves to a real card, and
every card is claimed by some concept. A demo that ships without being filed here fails the
check — which is the only thing keeping the gap list below honest as the catalog grows.

---

## On the taxonomy (read before trusting the gaps)

The 40 concepts below are a **judgment call, not a fact**, and every gap conclusion
downstream inherits that judgment. A different reader could reasonably split §23
(obliviousness) into three concepts, merge §30 and §31, or argue §32 ("the limits of
cryptography") isn't a concept at all. Concept boundaries in cryptography are pedagogical
conveniences; no canonical list exists.

This map is useful because it is **checkable**, not because it is correct. If your instinct
disagrees with a boundary, move it — the gap list will shift accordingly, and that is the
system working rather than failing.

The same caution applies to the finish line. "Concept-complete" is an editorial claim about
this taxonomy, not a mathematical property of cryptography.

---

## I. Foundations

**1. Perfect secrecy and its limits — `COVERED`**
OTP Vault. Information-theoretic security plus the two-time-pad break that shows what the
guarantee actually costs.

**2. Randomness, entropy, and generator failure — `DEEP`**
DRBG Arena · Corrupted Oracle · Entropy Collapse · Quantum Entropy · VRF Gate. Correct
case, backdoored case, seed-provenance case, physical extraction, and output anyone can
verify was not ground out to order.

**3. One-way functions and hashing — `COVERED`**
Babel Hash · Hash Zoo · World Hashes · Collision Vault. Construction, comparison,
sovereignty context, and real published collisions.

**4. Confusion, diffusion, and cipher structure — `DEEP`**
Iron Serpent · World Ciphers · AES Modes · ChaCha20 Stream · Ascon · Snow 2 · Format Ward.
SPN, ARX, sponge, stream, lightweight, and Feistel — the last via format-preserving
encryption, where the round structure is the whole point (SP 800-38G).

**5. Message authentication — `COVERED`**
MAC Race · Poly1305 MAC · AEGIS Gate · Nonce Guard · Stream Ward. Polynomial MACs, AEAD, and
misuse-resistant AEAD. Stream Ward extends the arc past the single message: chained streaming
AEAD, where each segment's tag covers a rolling chain state plus its sequence number, so
reordering or truncating intact valid frames is caught. One-shot AEAD authenticates *content*;
this authenticates *order and completeness*.

**6. Key derivation and password hashing — `COVERED`**
KDF Chain · KDF Arena · Bcrypt Forge · Phantom Vault.

---

## II. Hardness assumptions (the trapdoor families)

**7. Factoring — `COVERED`**
Educational RSA · RSA Forge · Iron Letter. Trapdoor, padding (OAEP/PSS), and RSA-OAEP
measured against an elliptic-curve alternative.

**8. Discrete logarithm — `COVERED`**
Curve Lens · Point Arithmetic · ElGamal Plain · DH MITM · Curve448 · Ed25519 Forge.

**9. Pairings / bilinear maps — `COVERED`**
Pairing Gate · IBE Gate · Credential Veil.

**10. Lattices (LWE / SIS / NTRU) — `DEEP`**
Kyber Vault · Frodo Vault · Scloud+ Vault · NTRU Classic · Dilithium Seal · Dilithium
Reject · Falcon Seal · HAWK · LLL Break · LWE Hints · Quantum Vault KpqC · Lattice Gentle.
Lattice Gentle is the entry point — SVP/CVP and LLL by hand before any named scheme appears.

*Optional depth, not a gap:* the NTT appears **inside** Lattice Fault, KyberSlash, and
Ciphertext Mirror but never as the transform itself. It is an enabling computational
technique — comparable to fast modular arithmetic or projective curve coordinates — not a
security concept. An "under the hood" NTT demo would be a fine addition; concept
completeness does not depend on it.

**11. Codes / syndrome decoding — `COVERED`**
McEliece Gate · BIKE Vault · HQC Vault · Syndrome Drain · Syndrome Hints.

**12. Multivariate / MQ — `COVERED`**
Multivariate UOV · MAYO Seal. UOV plus its designated successor: MAYO Seal runs real keygen,
signing, and verification over GF(16) and shows the whipping step that makes an oil space too
small to invert become solvable once k copies of the map are combined. Closed the `PARTIAL`
in v4.

**13. Isogenies — `COVERED`**
Isogeny Gate (schemes + the Castryck-Decru break) · Isogeny Atlas (the graph + open
problems).

**14. Hash-based security (no trapdoor) — `COVERED`**
SPHINCS+ Ledger · LMS/XMSS · LMS Ledger · Jevil.

**15. Delay, sequential work, and release conditions — `COVERED`**
VDF · Time-Lock Puzzle · Beacon Lock. VDF and Time-Lock Puzzle are *self-opening* delay:
someone grinds sequential work until the secret falls out. Beacon Lock supplies the third
release model — nobody grinds; everyone waits for a public randomness beacon to publish a
signature on a future round, and that signature is what opens the ciphertext. It is
Boneh-Franklin IBE where the identity is the round number, byte-compatible with drand's
tlock, and it makes both non-mathematical assumptions explicit: the beacon must stay live,
and a threshold of operators must not sign early in private.

**Terminology precision (do not blur these):**

| Model | Who does the work | Assumption |
|---|---|---|
| Time-lock puzzle (RSW) | Recipient computes sequentially | Sequential squaring is not parallelizable |
| VDF | Prover computes, anyone verifies fast | Same, plus a succinct proof |
| Beacon timelock (drand-style) | Nobody — wait for the beacon | Threshold beacon operators are honest/live |
| Witness encryption | Anyone holding an NP witness | General, largely theoretical |

Drand-style timelock is **identity-based encryption where the identity is a future round
number**, and the beacon's threshold BLS signature on that round extracts the decryption
key. That makes it an application of a primitive already in the catalog — it should
cross-link `ibe-gate` and `pairing-gate` rather than rebuild them. Witness encryption is a
*different and far more general* primitive with different assumptions and no practical
deployment; it should be named as a contrast, never as a synonym.

A demo here must show the failure modes the other two models don't have: what happens when
the beacon **stalls**, when operators **collude**, and how a threshold changes the trust
story. Icy DVRF (§19) already teaches that threshold-beacon half — over ristretto255 rather
than the pairing-based threshold BLS drand actually uses, so treat it as a conceptual
neighbour to cross-link, not a component to import.

---

## III. Protocol ideas

**16. Key exchange and forward secrecy — `DEEP`**
Key Exchange · Curve Lens · DH MITM · X3DH Wire · Ratchet Wire · Noise Pipe · MLS Group ·
SSH Handshake · TLS Handshake · Hybrid Wire · PQ TLS Handshake · Downgrade Wire · HPKE
Envelope. The classical → KEM → hybrid arc is complete.

**17. Password-authenticated key exchange — `COVERED`**
OPAQUE Gate · PAKE Gate · SPAKE Gate.

**18. Commitment — `COVERED`**
Commit Gate.

**19. Secret sharing and distributed trust — `DEEP`**
Shamir Gate · VSS Gate · DKG Gate · Reshare Circle · FROST Threshold · GG20 Wallet ·
Threshold Decrypt · Threshold ML-DSA · Shamir vs FROST · Icy DVRF · MuSig Gate. Generation,
verification, refresh, and use are all taught.

MuSig Gate closed the last open piece here in v4: n-of-n aggregation, which Schnorr Forge's
card had already promised ("the linearity behind multisig and threshold signing"). The
t-of-n / n-of-n contrast is now explicit on both sides — MuSig Gate's own copy points at
FROST for quorums, and Shamir vs FROST covers the other direction.

**20. Oblivious transfer and secure computation — `COVERED`**
OT Gate · Garbled Gate · Silent Tally · SPDZ Forge · Card Trick. The first four are all
*computational*. Card Trick supplies the one thing they cannot: den Boer's five-card trick
computes AND with information-theoretic security resting on shuffle indistinguishability —
the only non-computational security argument in the suite. The state space is ten rows and
five cuts, so every probability and total-variation distance on the page is an enumerated
sum rather than an estimate.

*Cross-project value:* this is the one gap that strengthens **both** properties. A security
argument built from physical shuffles bridges the mechanical-cipher history Cipher Museum
already covers and the modern MPC cluster here — the same tactile reasoning as a rotor or a
cipher wheel, but with an information-theoretic guarantee instead of a mechanical one. No
other item on the gap list has a sibling-project payoff.

**21. Zero knowledge — `DEEP`**
ZK Proof Lab · SNARK Arena · STARK Tower · ZK Arena · Bulletproofs · Frozen Heart ·
MPCitH Sign.

**22. Homomorphic computation — `COVERED`**
Blind Oracle (TFHE) · CKKS Lab · FHE Arena (BGV/BFV) · Paillier Gate. Full trilogy plus
additive.

**23. Obliviousness — access-pattern and metadata privacy — `COVERED`**
ORAM Vault · Oblivious Shelf · Patron Shield · PSI Gate · Blind Relay · Blind Hello ·
DP Noise · Search Vault.

DP Noise closes what was the largest hole in the map. Every other privacy demo hides a
*message, identity, relationship, or access pattern*; differential privacy is the only
technique that protects an **aggregate statistic** while deliberately publishing it — a
categorically different guarantee, and the one most people meet in the wild (census,
telemetry, analytics). It pairs with `silent-tally` exactly as predicted: MPC protects the
**inputs**, DP protects the **output**, and together they teach that hiding the data is not
the same as making the answer safe to release.

Search Vault is the complement to ORAM Vault. Searchable symmetric encryption is the
construction whose access-pattern leakage ORAM exists to hide, and running the count and IKK
leakage-abuse attacks against a log the learner generated makes "secure relative to a stated
leakage function" concrete rather than abstract.

*(On classification: some specialists file DP as statistics rather than cryptography. See
the Scope note above — the catalog's boundary is "checkable mathematical guarantee the
learner can break," which DP satisfies cleanly.)*

**23b. Deniability — `COVERED`**
Shadow Vault. One container, two passphrases, two plaintexts, and no way to prove a second
message exists.

Split out of §23 in v4. Every other concept in this section hides *who, what, or which* —
deniability attacks a different question, whether there is anything to hide at all, and the
adversary it answers to is a coercive one rather than an observing one. It was filed under
§23 briefly and read wrong there.

*Why `23b` and not `24`:* the numbering is load-bearing — the gap table and several concepts
cross-reference §15, §19, §20, §23, §25, §30, and §33 by number. A letter suffix inserts the
concept in the right place without invalidating every one of those references. Prefer this to
renumbering whenever a concept is added mid-list.

**24. Anonymity and unlinkability — `COVERED`**
Ring Sign · Blind Sign · Credential Veil · Traitor Trace.

**25. Trust distribution and transparency — `COVERED`**
PKI Chain · Chain of Trust · Web of Trust · Key Mirror · Merkle Vault · Merkle Proofs ·
Accumulator.
Accumulator closes the gap this section carried through v4: dynamic add/remove against a
constant-size digest, and non-membership proofs, which authenticated trees answer only by
sorting the set and exhibiting two neighbours. It measures itself against a real RFC 6962
tree rather than asserting the difference, and it demonstrates the cost — a trusted setup
whose failure it lets you perform.

**26. Identity and authentication — `COVERED`**
WebAuthn · Kerberos v5 · JWT Forge · Time Trust.

---

## IV. Failure modes

**27. Side channels — timing, power, fault — `DEEP`**
Timing Oracle · Timing Side-Channel · Power Trace · KyberSlash · HQC Timing · HQC Timing
Break · Lattice Fault · Ciphertext Mirror · Broken Trust. Saturated; new side-channel
papers should be judged as *variants* unless they teach a new leakage **mechanism**.

**28. Nonce and randomness misuse — `COVERED`**
Nonce Collision · Nonce Guard · Nonce Lattice · Entropy Collapse · ECDSA Forge · Schnorr
Forge.

**29. Composition and parsing failures — `COVERED`**
Protocol Compose · Signed Bytes · Salamander · KEM Trap · JWT Forge · Padding Oracle ·
Ablation Wire. The first six break a composition; Ablation Wire inverts the question and asks
which layer was carrying the guarantee all along — switch one off and watch what an adversary
recovers. It also separates hybrid-PQ confidentiality from authentication, which is the
distinction a single "PQ" badge hides.

**30. Classical cryptanalytic technique — `COVERED`**
Biham Lens (differential) · Matsui Line (linear) · Vigenère Break · Collision Vault ·
Model Breach · LLL Break.

Matsui Line completes the canonical pair. It is genuinely different mathematics —
approximation *bias* and the piling-up lemma rather than difference propagation — and it
was built exactly as this file predicted: the same toy SPN Biham Lens attacks, a linear
approximation table in place of the DDT, bias accumulation in place of characteristic
probability, with 96 cross-implementation vectors reproducing Biham Lens's ciphertexts. It
also earns its place by showing where the lemma *fails*: over three rounds the linear hull
effect scatters the true bias across keys while the piling-up prediction sits unmoved.

**31. Formal and symbolic analysis — `COVERED`**
Protocol Checker (Dolev-Yao, rediscovers Lowe's attack by search).

**32. The limits of cryptography — `COVERED`**
Model Breach (assumptions drifting from deployment) · Encrochat (endpoint compromise defeats
sound E2EE). Was `PARTIAL` in v1–v3 only because Encrochat had no card; carding it finishes
the arc — the assumption breaks, then the deployment breaks around an intact primitive. Still
the most contestable concept boundary in the list; some would fold it into §30.

---

## V. Quantum

**33. Quantum attacks — `COVERED`**
Shor (period finding → asymmetric) · Grover (amplitude amplification → symmetric search) ·
Simon's Period (query separation → structured symmetric constructions).

Simon's Period completes the triad: exponential-to-polynomial *query* complexity against
Even-Mansour and CBC-MAC, categorically different from Grover's square-root speedup. It was
built as this file specified — measurement outcomes form a GF(2) linear system the learner
watches fill up, become solvable, and yield the period, with a real solver and an exact
statevector simulation rather than sampling from a known output distribution. That choice
matters: the constructions attacked here do not satisfy Simon's promise exactly, and only an
amplitude-level simulation reproduces what actually happens to them. The Q2 model assumption
is stated in-page rather than buried, which is the honest posture Shor and Grover already
ship with.

**34. Quantum protocols and physical randomness — `COVERED`**
BB84 · E91 · Quantum Entropy.

**35. Post-quantum migration — `DEEP`**
PQ Families · Harvest Vault · Harvest Timeline · PQ Rotation · Hybrid Guide · Hybrid PQC ·
Hybrid Sign · Downgrade Wire.

---

## VI. Applied and historical

**36. Historical ciphers and their breaks — `COVERED`**
Dead Sea Cipher · Enigma Forge · Vigenère Break. (Cipher Museum carries this far deeper as
a sibling project — do not expand here.)

**37. Steganography — `COVERED`**
Stego Suite · J-UNIWARD.

**38. Blockchain and wallet mechanics — `COVERED`**
Bitcoin Script · Bitcoin Wallet.

**39. Operational key management — `COVERED`**
Envelope KMS · PQ Rotation.

---

## Gap summary — the actionable list

**Empty. There are no open gaps.**

Every concept in this map is `COVERED` or `DEEP`. The five that stood open at v5 all closed
in v6:

| Gap | Concept | Closed by |
|---|---|---|
| ~~Differential privacy~~ | §23 | **DP Noise** |
| ~~Linear cryptanalysis~~ | §30 | **Matsui Line** |
| ~~Card-based / unplugged~~ | §20 | **Card Trick** |
| ~~Beacon-based timelock~~ | §15 | **Beacon Lock** |
| ~~Simon's algorithm~~ | §33 | **Simon's Period** |

**Not counted as a gap:** NTT as a standalone primitive (§10) — optional depth, an enabling
computational technique rather than a security concept. It remains the one item that could
be built without the map calling for it.

**Landed since v3:** `mayo-seal` closed §12, `musig-gate` closed the n-of-n piece of §19,
`ablation-wire` joined §29, `accumulator` closed §25, and v6's five closed the rest.
`search-vault` joined §23 and `stream-ward` joined §5 as depth rather than gap closure.

### What "no gaps" does and does not mean

It means: against **these forty concept boundaries**, every distinct idea has at least one
demo and no arc is left unfinished. Read the taxonomy caveat above before treating that as a
stronger claim than it is. A different reader could split §23 into three concepts or argue
§32 is not a concept at all, and the gap list would reopen accordingly. That is the system
working, not failing.

It does **not** mean the catalog is finished. Three things still generate work:

1. **Depth.** `DEEP` concepts got there by repetition; `COVERED` ones often rest on a single
   demo. A concept with one demo is covered, not thoroughly taught.
2. **Quality.** Coverage is orthogonal to how well a demo teaches. The pedagogy scorecard is
   the instrument for that, and it disagrees with this file by design.
3. **Boundary movement.** New primitives and new attacks arrive; some will not fit any
   existing §, and that is the signal to move a boundary rather than force a placement.

**Catalogued total: 175.** The projection of 170–175 held.

---

## Catalog hygiene — do this before building anything

Findings from mapping. A completed demo absent from README, index, or corpus is
functionally invisible to visitors *and* to crypto-counsel.

1. ~~Four demos are built but absent from README / index.html.~~ **Fixed in v4:** Syndrome
   Hints (§11), Lattice Gentle (§10), Encrochat (§32), and Icy DVRF (§19) now have cards,
   `TITLE_TO_SECTION` entries, and README rows. Carding Encrochat is what moved §32 from
   `PARTIAL` to `COVERED`. When this recurs, cite the demo as `*Name (built, uncatalogued)*`
   so `concept-sync` reports it as backlog rather than a dangling citation, and clear the
   marker when the card lands.
2. ~~Reconcile the displayed demo count.~~ **Checked and dismissed:** neither `index.html`
   nor `README.md` hardcodes a demo total, so there is no hero number to drift. Earlier
   versions of this file listed this as a task; it was not one.
3. **Verify each demo appears in the corpus and in navigation**, not just in the card grid.
   `readme-sync`, `corpus-sync`, and `concept-sync` each check one of those surfaces; none
   checks `section-nav` reachability.
4. **Concept, not category, decides coverage.** The catalog's category labels are
   artifact-level ("Post-Quantum KEM", "Digital Signatures"); this file is idea-level. Both
   are useful — only this one answers "is anything missing?"

---

## Maintenance

**Version this file; do not freeze it.** New concepts do occasionally appear — key
transparency was not a recognized concept fifteen years ago, and neither was post-quantum
migration as an operational discipline. A frozen map goes stale silently; a versioned one
invites the next revision.

When a demo ships: add it under its concept, re-check whether that concept's status
changes, and bump the version note at the top. When a concept boundary stops feeling right,
move it and say so. Then:

```
node tools/concept-sync.js check
```

A clean run prints `Cited but no card (0)` and `Carded but unmapped (0)`. The two failures
it catches are the two that rot this file silently: a demo renamed in `index.html` leaving a
dangling citation here, and a demo shipped without ever being filed under a concept. Run it
without `check` for the same report as a plain read-out (always exit 0).

*This is the sole gap list. It replaced `futuredemos.md`, which counted 114 demos and listed
as "missing" several items since built (Enigma, OTP, collisions, JWT, Vigenère); that file was
deleted once it had nothing left to add. Recover it with `git log --diff-filter=D -- futuredemos.md`
if a historical read is ever needed.*
