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

*Version 7 — files the four labs that were built and live but had no card, so no checker
could see them: KMAC Gate joins §5 (the keyed sponge beside the polynomial MACs), Regex Veil —
FTE joins §37 (the covert-channel form of hiding, against a DPI adversary rather than in
pixels),
and Token Tell and Context Ward both join §32. Those two extend §32 in different directions:
Token Tell because a keyed detector's statistical evidence is only as good as possession of
the key while a signature binds bytes rather than authorship, and Context Ward because every
check can pass honestly and the system still be owned — integrity and provenance are
orthogonal to whether content should be obeyed. All four are additions to concepts already
`COVERED`, so no status changes and the Gap summary stays empty. Worth recording why they
were invisible: `concept-sync`, `readme-sync` and `corpus-sync` all reported clean throughout,
because each verifies consistency among carded demos and none can detect a demo that was never
carded at all.*

*Version 8 — files the ten labs built in the 2026-08 batch, all at once. **None of them
closes a gap**; the Gap summary was already empty at v7 and stays empty. Every one is depth
inside a concept that was already `COVERED` or `DEEP`, which is the shape this file predicted
the catalog would take once the concept space was full — so their card copy reads as
deepening, not completing. Placements: Shelf Oracle §23, Feistel Forge and Sector Vault §4,
Rekey Relay and Attribute Gate §9, Polynomial Forge §18, DNSSEC Chain §25, Masked Core §27,
Sphinx Mix §24, Attestation Gate §26. Two status changes follow: **§9 moves `COVERED` →
`DEEP`** (five demos, and pairings now carry delegation and access control as well as
identity), and §18 stays `COVERED` at two demos but is no longer a one-demo concept, which
this file's own rule says is "covered, not thoroughly taught."*

*Three of the ten were reshaped before carding, because their briefs argued from false
premises about the fleet — the reasoning is recorded under each concept: Masked Core leads on
**second-order** CPA (Power Trace already ships first-order masking and names second-order as
out of scope), Polynomial Forge leads on the **degree-bound omission** (its ceremony act is
carded on SNARK Arena and FRI on STARK Tower), and Feistel Forge keeps its thesis but gains
cross-links to World Ciphers and Bcrypt Forge. Rekey Relay and Attribute Gate are filed as a
**declared pair** with only one of them leading on collusion.*

*Version 9 — files the four labs in the 2026-09 catalog pass, two of them built and live but
never carded until now. **None closes a gap**; the Gap summary was empty at v6 and stays empty.
Placements: **GGH Trapdoor** §10, **Factor Forge** §7, **Lattice Builder** §10 and **Covert
Channel Studio** §37. **No status changes anywhere** — §10 was already `DEEP`, and §7 and §37
each stay `COVERED` at four demos for reasons recorded under them.*

*GGH Trapdoor and Factor Forge are the same shape as each other — a hardness assumption
examined from the attack side rather than the scheme side. GGH Trapdoor is the only demo in
§10 where the lattice scheme is broken, and broken by the shape of its own randomness rather
than by lattice hardness, which is the argument Falcon's sampler and ML-KEM's centered
binomial exist to answer. Factor Forge is the first demo in §7 to attack the modulus rather
than the scheme — its other three teach the trapdoor, the padding, and an elliptic-curve
comparison — so it finishes an arc rather than repeating one, and it is not promoted to `DEEP`
because the factoring side is not covered several times over: the number field sieve is a
labelled cost formula on that page, not an implementation. Both lead on a negative result,
which is why neither reads as a completion. GGH Trapdoor opens by showing that plain LLL on
the public basis already recovers a good basis at its own dimensions, and Factor Forge's
thesis is that obeying every key-generation rule removes the methods that need an accidental
structural weakness without making `N` hard.*

*Lattice Builder is a third negative result and the most unusual of them: it is the only demo
in §10 staged to show the assumption **holding**, by letting the learner discover that seven
correct coefficients out of eight leave a residual no smaller than zero correct ones. Filing
it in §10 rather than under §35 is deliberate — its category is post-quantum but its concept
is the lattice problem, and nothing in it is about migration. Covert Channel Studio is the one
placement in this pass that required a judgment rather than a lookup. It sits in §37, on the
precedent v7 set when it filed Regex Veil — FTE there as the covert-channel form of hiding;
the concept's operative content is hiding that a message exists, whatever the carrier, which
is broader than the word "Steganography" in its title. **That title is now the live boundary
question in this map** — widen it to name covert channels, or split them out as §37b on the
§23b precedent. Recorded under the concept rather than acted on, because renaming a concept
is a boundary move and those are not made from inside a filing pass. §27 and §32 were
considered for it and declined, with the reasoning kept there so it is not relitigated.*

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

Catalog basis: the 193 cards in `index.html` as of the v9 catalog pass.

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
Iron Serpent · World Ciphers · AES Modes · ChaCha20 Stream · Ascon · Snow 2 · Format Ward ·
Feistel Forge · Sector Vault.
SPN, ARX, sponge, stream, lightweight, and Feistel.

Feistel Forge makes the *construction* the subject rather than a cipher that happens to use
one. Camellia and SM4 sit on World Ciphers as national ciphers and Blowfish on Bcrypt Forge
as a password KDF, and Format Ward reaches Feistel through SP 800-38G — so Feistel ciphers
appeared in three places while nobody stepped a round or showed the property that makes the
structure work: the round function is evaluated forwards in both directions, so it need not
be invertible, and DES's is not.

Sector Vault covers the tweakable-mode axis none of the others reach — XTS-AES, the XEX
sandwich over GF(2^128), and ciphertext stealing.

**5. Message authentication — `COVERED`**
MAC Race · Poly1305 MAC · AEGIS Gate · Nonce Guard · Stream Ward · KMAC Gate. Polynomial MACs, AEAD, and
misuse-resistant AEAD. Stream Ward extends the arc past the single message: chained streaming
AEAD, where each segment's tag covers a rolling chain state plus its sequence number, so
reordering or truncating intact valid frames is caught. One-shot AEAD authenticates *content*;
this authenticates *order and completeness*.

**6. Key derivation and password hashing — `COVERED`**
KDF Chain · KDF Arena · Bcrypt Forge · Phantom Vault.

---

## II. Hardness assumptions (the trapdoor families)

**7. Factoring — `COVERED`**
Educational RSA · RSA Forge · Iron Letter · Factor Forge. Trapdoor, padding (OAEP/PSS), and
RSA-OAEP measured against an elliptic-curve alternative.

Factor Forge is the first demo here to attack the assumption instead of the scheme. Seven
real algorithms over a BigInt `N` — trial division, Fermat, Pollard rho (Brent), Pollard
p−1, Williams p+1, Lenstra ECM and the quadratic sieve — each keyed to the key-generation
rule that closes it, with a verifier that imports no algorithm module and multiplies every
claimed factor back before a result is shown. That turns RSA keygen from a list of
requirements into a list of doors, and it makes the useful fact visible: ECM's cost tracks
the *smallest factor*, not the size of `N`.

Its lead is a negative claim rather than a break, and the distinction it draws is the part
worth keeping. Obeying every rule removes the methods that need an accidental structural
weakness — a small factor, a narrow `|p − q|`, a smooth `p ± 1` — and the modulus still falls
to rho and ECM at teaching sizes, because only size defeats those. The sieves are the
exception that sets up §33: the quadratic sieve needs no accidental weakness either, which is
why the only rule that touches it is "make `N` bigger". Shor shares that and nothing else —
the multiplicative order of `a` mod `N` is a property *every* modulus has, so there is nothing
to generate your way out of, and unlike the sieves the cost stays polynomial. The page
cross-links Shor rather than simulating it, and the number field sieve appears only as the
`L_N[1/3, 1.923]` cost formula, labelled as a formula.

**8. Discrete logarithm — `COVERED`**
Curve Lens · Point Arithmetic · ElGamal Plain · DH MITM · Curve448 · Ed25519 Forge.

**9. Pairings / bilinear maps — `DEEP`**
Pairing Gate · IBE Gate · Credential Veil · Rekey Relay · Attribute Gate.

Rekey Relay and Attribute Gate are a **declared pair** — same curve, same section, both with
an escrow subplot — and they are kept distinct by which question each leads on. Attribute
Gate leads on **collusion resistance**: FAME CP-ABE, two real keys spliced into one, and the
term that refuses to cancel. Rekey Relay leads on **delegation**: BBS98 against AFGH, where
the older scheme's re-encryption key is `b·a⁻¹`, so the relay and the delegatee together
recover the delegator's private key in one modular division. Read either as the other's
mirror and the point of both is lost.

**10. Lattices (LWE / SIS / NTRU) — `DEEP`**
Kyber Vault · Frodo Vault · Scloud+ Vault · NTRU Classic · GGH Trapdoor · Dilithium Seal ·
Dilithium Reject · Falcon Seal · HAWK · LLL Break · LWE Hints · Quantum Vault KpqC ·
Lattice Gentle · Lattice Builder.
Lattice Gentle is the entry point by hand — SVP/CVP and LLL worked through before any named
scheme appears — and Lattice Builder is the entry point by eye, two dials straightening a
scrambled field until the shortest vector is readable.

Lattice Builder earns a second citation beside Kyber Vault rather than duplicating it, on the
strength of one exercise: it is the only demo in this section staged to show the assumption
**holding**. On a hand-sized Module-LWE instance (n=4, k=2, q=29, 6,561 possible keys) the
learner guesses `s` and watches `t − A·s`; getting seven of eight coefficients right leaves a
residual no smaller than getting none right — 13.4 against 13.0, against 1.0 for the true key.
There is no gradient to descend, which is *why* exhaustive search is the only method and why
the difficulty scales as it does. Every other lattice demo here either builds a scheme or
breaks one; this one makes the absence of a shortcut something you can fail to find. Its
ML-KEM is real rather than an analogy — FIPS 203 from scratch including its own Keccak,
because Web Crypto has no SHAKE, checked against all 54 NIST ACVP vectors across
ML-KEM-512/768/1024 — and the page is explicit that the board is SVP while ML-KEM rests on
Module-LWE, cousins rather than the same problem.

Read Lattice Builder's expert mode and GGH Trapdoor together: both stage one lattice under two
descriptions and run Babai rounding through each (400/400 under the short basis against
134/400 under the long one, in Lattice Builder's measurement). Lattice Builder stops at the
observation; GGH Trapdoor is that observation built into a cryptosystem, and then broken.

GGH Trapdoor is the only lattice scheme in the catalog that is dead, and it is filed here for
what its death teaches rather than as another construction. It makes the trapdoor itself the
subject: two bases for the *identical* lattice — proved identical in exact integer arithmetic,
not asserted — where Babai round-off decrypts under the short one and fails under the long
one, so "trapdoor" resolves to a measurable property, orthogonality defect, instead of a
metaphor. Micciancio's HNF public key (CaLC 2001) sits alongside it, with the honest measured
saving of 1.1–1.3× rather than the asymptotic factor of `n`.

The two breaks are why it belongs beside Falcon Seal and Kyber Vault rather than only beside
NTRU Classic. Neither solves a hard lattice problem: Nguyen's mod-2σ reduction (CRYPTO 1999)
works because every error coordinate is `±σ` and so congruent mod `2σ`, and the Nguyen–Regev
fourth-moment descent (EUROCRYPT 2006) works because a deterministic round-off signature is a
uniform sample from the secret basis's parallelepiped — it took NTRUSign with it. Both attack
the *shape of the scheme's own randomness*, which is the reason Falcon samples a discrete
Gaussian instead of rounding and the reason ML-KEM's centered binomial admits no analogue of
the mod-2σ observation. The lab leads with a caveat rather than burying it: at its own
dimensions (n = 8–60) plain LLL on the public basis already recovers a basis as good as the
private one, so nothing on the page is evidence that GGH was hard at these sizes — it was
proposed at n = 200–400 for exactly that reason. That makes it a companion to LLL Break and
Lattice Gentle, not a competitor to them.

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
Commit Gate · Polynomial Forge.

Commit Gate teaches binding and hiding on scalars. Polynomial Forge commits to a *function*
— KZG, IPA and FRI over the same polynomial — which is the form every modern proof system
actually uses, and it is why swapping the commitment scheme yields a different proof system
with the same logic. Its distinctive failure is the **degree-bound omission**: evaluation
binding stays intact and every cryptographic check passes, while the low-degree claim the
protocol rests on is simply not being made. Note the overlap boundary — the powers-of-tau
ceremony is already carded on SNARK Arena ("trusted setup ceremonies … the toxic waste
problem") and FRI on STARK Tower, so those are depth here, not the lead.

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
DP Noise · Search Vault · Shelf Oracle.

Shelf Oracle completes the PIR axis. Oblivious Shelf and Patron Shield are
information-theoretic and buy that guarantee with a second server that must never collude;
Shelf Oracle removes the second server and pays in the other currency — RLWE, a
*computational* assumption, and a noise budget that visibly falls as the server folds in
every record because it cannot tell which one was asked for. The two-server and one-server
columns run over the same shelf, so the trade is measured rather than described.

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
Ring Sign · Blind Sign · Credential Veil · Traitor Trace · Sphinx Mix.

Sphinx Mix adds the network layer the other four do not touch: they unlink a *signature* or a
*credential* from its holder, while Sphinx unlinks a *packet* from its sender across three
hops. It also carries the distinction that most explanations of anonymity systems blur —
bitwise unlinkability is a property of the packet format, anonymity is a property of the
traffic, and the first does not produce the second. One sender on a quiet network is traced
end to end with every cryptographic check green.

**25. Trust distribution and transparency — `COVERED`**
PKI Chain · Chain of Trust · Web of Trust · Key Mirror · Merkle Vault · Merkle Proofs ·
Accumulator · DNSSEC Chain.

DNSSEC Chain adds the second trust hierarchy — one that shares no keys, no CAs and no
revocation machinery with the X.509 world the other PKI demos teach — and the mechanism that
makes it unlike any other: it has to sign statements about names that **do not exist**. The
denial proofs are the lesson, because NSEC hands an enumerator the whole zone and NSEC3 only
raises the price of the dictionary.
Accumulator closes the gap this section carried through v4: dynamic add/remove against a
constant-size digest, and non-membership proofs, which authenticated trees answer only by
sorting the set and exhibiting two neighbours. It measures itself against a real RFC 6962
tree rather than asserting the difference, and it demonstrates the cost — a trusted setup
whose failure it lets you perform.

**26. Identity and authentication — `COVERED`**
WebAuthn · Kerberos v5 · JWT Forge · Time Trust · Attestation Gate.

The first four authenticate a *person* or a *claim*. Attestation Gate authenticates a
*platform state* — measured boot into PCRs, a real TPMS_ATTEST quote, RATS roles and an EAT
— and then spends its climax on the limit of that guarantee, which belongs as much to §32:
execute something outside the measured set after the final boot measurement and every check
still passes. A boot quote proves what was measured, not what is running.

---

## IV. Failure modes

**27. Side channels — timing, power, fault — `DEEP`**
Timing Oracle · Timing Side-Channel · Power Trace · KyberSlash · HQC Timing · HQC Timing
Break · Lattice Fault · Ciphertext Mirror · Broken Trust · Masked Core. Saturated; new
side-channel papers should be judged as *variants* unless they teach a new leakage
**mechanism**.

Masked Core clears that bar rather than sitting beside Power Trace. First-order CPA exploits
leakage in a **single** sample; second-order exploits **joint** leakage across two, combined
by a centred product — a different mechanism, not a stronger version of the same one. It is
also the only demo here that makes the *countermeasure* the object under measurement.
Power Trace already ships first-order masking in its Exhibit 6 countermeasure selector and
names second-order as out of scope by design, so this lab starts where that one stops; the
two cross-link.

**28. Nonce and randomness misuse — `COVERED`**
Nonce Collision · Nonce Guard · Nonce Lattice · Entropy Collapse · ECDSA Forge · Schnorr
Forge.

**29. Composition and parsing failures — `COVERED`**
Protocol Compose · Signed Bytes · Salamander · KEM Trap · JWT Forge · Padding Oracle ·
Ablation Wire · Sector Vault. The first six break a composition; Ablation Wire inverts the
question and asks which layer was carrying the guarantee all along — switch one off and watch
what an adversary recovers. It also separates hybrid-PQ confidentiality from authentication,
which is the distinction a single "PQ" badge hides.

Sector Vault is the same inversion against a mode that is behaving exactly as specified. XTS
-AES has no integrity to offer, so a bit flip, a block copy and a sector rollback all return
plaintext and raise nothing — and then real AES-GCM is switched on and stops two of those
three, with the third needing a monotonic version bound as associated data. The absent
guarantee is the lesson; the mode is not broken.

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
sound E2EE) · Token Tell (a keyed detector's evidence is only as good as the key, and a
signature binds bytes rather than authorship) · Context Ward (every check passes honestly
and the agent is compromised anyway, because integrity is orthogonal to whether content
should be obeyed). Was `PARTIAL` in v1–v3 only because Encrochat had no card; carding it finishes
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
Stego Suite · J-UNIWARD · Regex Veil — FTE · Covert Channel Studio.

Covert Channel Studio adds the carrier survey the other three do not attempt: the same bits
moved eleven ways — DNS labels, ICMP echoes, inter-arrival gaps, IP/TCP field values, packet
ordering, HTTP header permutation, protocol hopping, image LSB, circulation metadata, an
optical air gap, and cache lines via Flush+Reload — each scored by a named, cited detector
with a known-answer test. Its defender's half is the part that makes it more than a catalog:
a blind scored detection challenge with false-positive traps, and a validation lab that runs
every detector over hundreds of deterministic cases and reports ROC curves, AUC and confusion
matrices, so detector quality is measured rather than asserted. Its sharpest result is the
active warden — several channels are closed while their anomaly score *falls*, because
normalisation is disruption rather than detection and leaves no record that anyone tried;
the timing channel, meanwhile, does not die at all, retaining residual Shannon capacity under
shaping. Everything is simulated client-side; no packet is ever crafted or sent, and the cache
and optical carriers are explicitly modelled rather than measured.

*Boundary note — this concept's title is now narrower than its contents, and that is the
user's call to settle, not this file's.* The lab's own thesis refuses the equation: image LSB
is **one** of its five categories, sitting beside storage channels, timing channels,
protocol-shaped tunneling, and ordinary encrypted tunnels — which it argues are usually *not*
covert channels, since hiding content is not the same as hiding the existence or purpose of
communication. What unites §37 in practice is that second thing: hiding *that* a message
exists, whatever the carrier. v7 already stretched the concept this way once, filing Regex
Veil — FTE here as "the covert-channel form of hiding, against a DPI adversary rather than in
pixels," so this is the same stretch a second time rather than a new one. Two ways to settle
it if it stops feeling right: widen the title to name covert channels alongside steganography,
or split them out as **§37b** the way deniability was split from §23 — the letter-suffix
convention exists for exactly this. Left alone here because renaming a concept is a boundary
move.

*Two placements considered and declined, recorded so they are not relitigated.* Not §27: the
Shared-Cache Channel is Flush+Reload with Prime+Probe as its inverted variant, but a covert
channel is not a side channel — two colluding parties signalling on purpose, against one party
leaking by accident — and the lab stages that distinction deliberately, with a case study of a
side channel repurposed as a covert one. §27's own rule also demands a new leakage
*mechanism*, and this cache is modelled rather than measured, which would sit badly beside
Power Trace and KyberSlash. Not §32: the encrypted-tunnel row is a real limits-of-cryptography
point and a good cross-link to Encrochat, but it is definitional scaffolding for what a covert
channel is *not*, rather than the lab's own climax.

The text and linguistic family is out of scope here by the same logic §36 applies to Cipher
Museum: the sibling exhibit Ghost-Ink covers it in depth, and this lab links out rather than
duplicating. Status stays `COVERED` rather than moving to `DEEP` — three of the four hide
inside a medium or a message format and the fourth surveys carriers, so the space is not yet
covered several times over.

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

**Catalogued total: 193.**

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
