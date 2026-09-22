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

*Version 10 — files the eight labs carded in the 2026-09 batch. **None closes a gap**; the Gap
summary has been empty since v6 and stays empty. **No status changes anywhere** — every concept
touched was already `COVERED` or `DEEP`, and the two that could have been argued upward (§20,
§24) are held where they are for a reason recorded under each. Placements: **Sleeve Check** §4,
**PQXDH Wire** §16, **Split Point** §19 and §23, **Proof Tally** §20 and §21, **Fold Gate** §21,
**Order Leak** §23, **Privacy Pass** §24, **Hidden Bit** §31.*

*Version 11 — files Ghost Commit under §39, closing the last uncatalogued live lab. It had been
built and serving since 2026-07-31 and was never carded in any pass, including the v7 pass that
existed to card exactly that class; `tools/fleet-sync.js` is what kept surfacing it. No status
change: §39 was already `COVERED` and gains its failure case beside the two safe paths.*

*Version 12 — no filing and no status change: one NUMBER corrected. §21's Fold Gate paragraph
said the NIFS verifier's per-fold work "stays fixed at five group operations". It is six, and
the lab now measures it — `src/nifs/cost.ts` tallies every operation the real `foldPublic`
performs over instrumented points, and `src/nifs/cost.test.ts` cross-checks that tally against
a count taken from the function's own source, so changing `foldPublic` moves both numbers
instead of leaving a constant quietly right. The lab repaired its own README when the
measurement landed; this file was the surviving echo, and it was found by the lab's agent
sweeping for echoes of a changed number rather than by any checker here. Worth recording as a
gap in this file's own coverage: `concept-sync` verifies that every card is cited and every
citation has a card, and is structurally blind to a factual claim inside the commentary.*

*Version 13 — no status change: Snow 2 leaves §4. It is a related project rather than a
Crypto Lab exhibit, so its card moved to Related Projects on the hub and in the README, and a
concept this file maps is no longer cited by it. §4 stays `DEEP` on the exhibits that remain,
with ChaCha20 Stream still carrying the stream-cipher construction.*

*Three of the eight needed a judgment rather than a lookup, and in two of them the concept
diverges from the catalog section — which is the divergence this file exists to allow. **Split
Point** and **Proof Tally** are both carded in the `privacy` section and neither leads on a
privacy concept here. Split Point's subject is that you can secret-share a **function** rather
than a value: every demo in §19 splits a key, and the point-function share is the strict
generalisation none of them reaches, so §19 leads and §23 takes the second citation for the PIR
application. §20 was considered for it and declined — that concept's title is secure
*computation*, and a DPF-based retrieval computes nothing. **Proof Tally** leads in §20 for the
mirrored reason: §20's four computational demos assume honest inputs, and SPDZ Forge's malicious
security is about a **party** tampering with a share, while Prio3's is about a **client**
submitting a malformed report neither aggregator can read. §21 takes its second citation for the
fully linear PCP itself.*

*Fold Gate is filed in §21 and is the first demo there that is not a proof system. Its own README
refuses both properties — this NIFS is "neither zero-knowledge nor a succinct final proof" —
because a folding scheme is the composition substrate under recursive proving rather than an
argument about a witness. That makes **recursive proof composition and IVC** a live candidate for
a §21b split on the §23b precedent, and it should be taken the moment a second folding demo lands
(HyperNova, ProtoStar, an accumulation scheme). One demo does not justify moving a boundary, and
boundary moves are not made from inside a filing pass.*

*Hidden Bit is the placement worth arguing with, and it was nearly "nothing fits." It teaches no
primitive: it teaches the **definitional framework** every other card's security claim is stated
in — IND-CPA, IND-CCA2, EUF-CMA, the PRP/PRF switching lemma, and a reduction that wraps a live
IND-CPA adversary inside a DDH distinguisher. No concept here was built for provable security,
because this map covers primitives and constructions rather than the argument around them. §31
does fit, on its first word rather than its second: game-based security is the **computational**
half of formal security analysis and Protocol Checker is the **symbolic** half, which is the
canonical pair — the two ways a security claim is made formal, by searching an idealised algebra
for an attack and by bounding an adversary's advantage against a hardness assumption. It also
answers the "one demo is covered, not thoroughly taught" critique this file's own closing section
levels at concepts shaped like §31 was.*

*That leaves §31's title narrower than its contents, exactly as §37's already is. The honest
options are the same two: widen it to name the computational model alongside the symbolic one, or
split provable security out as **§31b** on the §23b precedent. Recorded, not acted on —
renaming a concept is a boundary move and is the user's call.*

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

Catalog basis: the cards in `index.html`. The total at the end of this file is checked against them
by `concept-sync`, so it cannot drift silently.

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
Iron Serpent · World Ciphers · AES Modes · ChaCha20 Stream · Ascon · Format Ward ·
Feistel Forge · Sector Vault · Sleeve Check · Export Grade.
SPN, ARX, sponge, stream, lightweight, and Feistel.

Export Grade adds key loading as cipher structure. Real TEA1 passes its known-answer tests
while the ten-byte input is compressed into the 32-bit register the generator actually sees,
and a worker recovers that register against the same core. It belongs here rather than under
§30 because the design of the pre-generator reduction is the mechanism; exhaustive search is
the consequence the lab uses to measure it.

Feistel Forge makes the *construction* the subject rather than a cipher that happens to use
one. Camellia and SM4 sit on World Ciphers as national ciphers and Blowfish on Bcrypt Forge
as a password KDF, and Format Ward reaches Feistel through SP 800-38G — so Feistel ciphers
appeared in three places while nobody stepped a round or showed the property that makes the
structure work: the round function is evaluated forwards in both directions, so it need not
be invertible, and DES's is not.

Sector Vault covers the tweakable-mode axis none of the others reach — XTS-AES, the XEX
sandwich over GF(2^128), and ciphertext stealing.

Sleeve Check is the only demo here that asks where a cipher's structure **came from**. The other
nine teach what a construction does — how an SPN diffuses, how a Feistel round function need not
be invertible, what a tweak buys. Sleeve Check takes the confusion layer as published — π, the
256-byte table GOST released as a bare list for both Kuznyechik and Streebog with no account of
its origin — and rebuilds all 256 bytes from four small constants and field arithmetic (Perrin's
TKlog, ToSC 2019), in a module that never reads the published table. "Nothing up my sleeve" stops
being a slogan and becomes a measurement: the 17 multiplicative cosets of F₁₆ land on 2 distinct
spaces under π and 17 under the AES S-box, and only the first is a partition. The lab also ships
the cipher it is arguing about, gated on the RFC 7801 §5 vectors before any other exhibit unlocks.

It is filed here rather than under §30 or §2 deliberately. It is not cryptanalysis — no key is
recovered and no distinguisher is built, and the lab says so in its own copy and attributes the
no-attack finding to Perrin. The neighbour it belongs beside is Corrupted Oracle in §2: an
unexplained constant that turned out to be exploitable, against an unexplained constant that turns
out to be structured and, so far as anyone has shown, harmless. Provenance is checkable in both
cases; the verdict is not the same, and that is the point.

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
Envelope · PQXDH Wire. The classical → KEM → hybrid arc is complete.

PQXDH Wire extends that arc past confidentiality. Every other hybrid here treats "hybrid" as a
property of the whole handshake; PQXDH is hybrid in one half only, and the lab is built around the
asymmetry. One ML-KEM-1024 secret added to the `F ‖ DH1‖DH2‖DH3‖DH4 ‖ SS` transcript is what
survives a modelled curve break, while the Ed25519 prekey signature that authenticates the bundle
and the classical ratchet that follows are untouched — so an adversary who cannot read the first
message can still impersonate Bob with every check green. That is the distinction a single "PQ"
badge hides, and it is the one Ablation Wire (§29) draws from the other side by switching layers
off. Read it beside X3DH Wire: the payoff is the exact 32-byte KDF addition and 1,568-byte
initial-message addition between the two.

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
Threshold Decrypt · Threshold ML-DSA · Shamir vs FROST · Icy DVRF · MuSig Gate · Split Point.
Generation, verification, refresh, and use are all taught, and Split Point changes the object
being split.

Split Point is the generalisation the other eleven do not reach. Every one of them splits a
**value** — a secret, a signing key, a nonce share. A distributed point function splits a
**function**: two keys that each look random evaluate to shares of "1 at α, 0 everywhere else,"
so the share grows as log N rather than N (290 bytes against 8,192 at N = 65,536 in its own
measurement). Boyle–Gilboa–Ishai's tree construction is stepped level by level with a real
AES-128-CTR PRG, and the collusion fixture is the same lesson §19 teaches everywhere: either key
alone hides α, both together reconstruct the point function and reveal it.

Filed here rather than in §20 because §20's title is secure *computation* and a DPF-based
retrieval computes nothing; its second citation is §23, where the two-server PIR application sits
beside the other private-retrieval demos. Note also what this construction does not provide and
§19's verification demos do: a tampered server answer returns the wrong record with every privacy
condition still passing. This is query privacy, not answer integrity.

MuSig Gate closed the last open piece here in v4: n-of-n aggregation, which Schnorr Forge's
card had already promised ("the linearity behind multisig and threshold signing"). The
t-of-n / n-of-n contrast is now explicit on both sides — MuSig Gate's own copy points at
FROST for quorums, and Shamir vs FROST covers the other direction.

**20. Oblivious transfer and secure computation — `COVERED`**
OT Gate · Garbled Gate · Silent Tally · SPDZ Forge · Card Trick · Proof Tally. The first four are all
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

Proof Tally supplies what the computational four assume away: that the inputs are honest. SPDZ
Forge already teaches malicious security, but against a **party** — a corrupt aggregator tampering
with a share, caught by an information-theoretic MAC. Prio3's problem is the other one, a
**client** submitting a malformed measurement that neither aggregator can read and therefore
neither can inspect. Carrying a fully linear proof in the same shares is what lets them reject it
without either one seeing the value, which is validity and privacy out of a single split. The lab
is careful about what that does not buy, and the negative claim is the sharper half: a correctly
proven salary of zero, when the sealed truth is nonzero, passes every Prio3 check and poisons the
aggregate, because the proof constrains structure rather than truth. A second exhibit makes the
companion point that a one-report aggregate discloses that report — which is §23's DP Noise
pairing stated from the MPC side, inputs protected and output not.

Status stays `COVERED` at six demos rather than moving to `DEEP`, on the test the legend implies:
would another MPC demo dilute? It would not. Honest-majority protocols, GMW against Yao,
preprocessing, and MPC over a real dataset are all still unbuilt, and none would repeat what is
here.

**21. Zero knowledge — `DEEP`**
ZK Proof Lab · SNARK Arena · STARK Tower · ZK Arena · Bulletproofs · Frozen Heart ·
MPCitH Sign · Fold Gate · Proof Tally.

Fold Gate is the first demo here that is not a proof system, and it refuses both properties in its
own copy: this NIFS is "neither zero-knowledge nor a succinct final proof." What it isolates is
the mechanism underneath recursive proving. A random linear combination of two satisfying R1CS
instances is not itself satisfying, the leftover is exactly a computable cross term `T`, and
relaxing the system with a slack scalar `u` and an error vector `E` — `E' = E₁ + rT + r²E₂` —
absorbs it, so one folded instance stands in for all of them while the verifier's per-fold work
stays fixed over 2 to 64 real steps — six ristretto255 group operations, three scalar
multiplications and three point additions, which the lab now MEASURES by running the real
`foldPublic` over instrumented points rather than asserting with a constant. This line said
*five* until 2026-09-21; that figure was hard-coded, was wrong, and outlived the page that
carried it. Its three attack modes are the
algebra's own boundary conditions rather than decoration: tampering with `W'` after folding,
tampering with `Com(T)` after deriving `r`, and the forgery that *succeeds* when a broken verifier
reveals `r` before `T` is committed — which is the reason the transcript orders commitment first.
See the version note: recursive composition and IVC are a live candidate for a §21b split, left
unmoved on one demo.

Proof Tally's second citation sits here for the fully linear PCP. It is the one proof system in
this section whose **verifier is split**: neither aggregator can check the proof, and the check
exists only in the sum of their verifier shares. Every other demo here has a verifier that holds
the whole proof. Its lead concept is §20.

**22. Homomorphic computation — `COVERED`**
Blind Oracle (TFHE) · CKKS Lab · FHE Arena (BGV/BFV) · Paillier Gate. Full trilogy plus
additive.

**23. Obliviousness — access-pattern and metadata privacy — `COVERED`**
ORAM Vault · Oblivious Shelf · Patron Shield · PSI Gate · Blind Relay · Blind Hello ·
DP Noise · Search Vault · Shelf Oracle · Order Leak · Split Point.

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

Order Leak is the leakage that needs no access pattern at all, which stretches this concept in a
direction worth naming. Everything else here leaks as a consequence of being **used** — ORAM hides
which record was touched, SSE leaks what its queries matched, PIR hides the index. Property-
preserving encryption leaks before a single query is run: deterministic AES-GCM-SIV publishes
equality, BCLO OPE and CLWW ORE publish order, and a ciphertext column sitting at rest already
carries the shape of its answers. The attacks are run against separately generated public data —
frequency matching, sorting, NKW cumulative matching, pairwise MSDB-tree recovery — and scored
cell by cell against truth the attacker never sees, with a randomized AES-GCM control that
recovers nothing and cannot answer the query either. It is Search Vault's exact complement: SSE's
leakage has a hider and this one does not, so the only defence is an explicit leakage budget.
The lab is also precise about what authentication is not: every AES-GCM-SIV tag verifies while the
equality leakage is entirely intact.

Split Point's second citation is the PIR axis, where it moves the trade-off the other three do not
touch. Oblivious Shelf and Patron Shield buy information-theoretic privacy with a full-length
query; Shelf Oracle removes the second server and pays in RLWE. Split Point keeps the two servers
and attacks the **communication** — one serialized DPF key against the Chor XOR baseline over the
same 65,536-record shelf — while being explicit that server work does not shrink with it: both
servers still evaluate the entire domain. Its lead concept is §19, on the function-sharing idea
rather than the retrieval.

*(On classification: some specialists file DP as statistics rather than cryptography. See
the Scope note above — the catalog's boundary is "checkable mathematical guarantee the
learner can break," which DP satisfies cleanly.)*

Status stays `COVERED` at eleven demos, which is not an oversight. This concept is a bundle of
thin axes — access pattern, set intersection, metadata, aggregate release, searchable index,
property-preserving leakage — most of them taught once, so the count is high while no single axis
is covered several times over. A reader who split it into three concepts, as the taxonomy note
invites, would find three `COVERED` entries rather than one `DEEP` one.

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
Ring Sign · Blind Sign · Credential Veil · Traitor Trace · Sphinx Mix · Privacy Pass.

Sphinx Mix adds the network layer the other four do not touch: they unlink a *signature* or a
*credential* from its holder, while Sphinx unlinks a *packet* from its sender across three
hops. It also carries the distinction that most explanations of anonymity systems blur —
bitwise unlinkability is a property of the packet format, anonymity is a property of the
traffic, and the first does not produce the second. One sender on a quiet network is traced
end to end with every cryptographic check green.

Privacy Pass unlinks a **token**, which is the sixth distinct object in this concept: Ring Sign
unlinks a signature from its member, Blind Sign a signature from its issuance, Credential Veil an
attribute from its holder, Sphinx Mix a packet from its sender, and Traitor Trace runs the whole
thing backwards. This one is the deployed anonymous-authorization case — RFC 9578 token type
`0x0001`, VOPRF over P-384 with RFC 9380 hash-to-curve, and a DLEQ proof the client verifies
before it will finalize. Its sharpest exhibit is negative: removing the client's blind changes
nothing on the wire, and the issuer and origin can then pool their ledgers and match on the input
point. The guarantee lives in the blind, not in the token.

Two limits it is honest about, and both are the interesting part. A DLEQ proof valid for one
client does not prove the issuer used that key for **every** client, so an issuer publishing
per-client keys partitions redemptions by key id with both proofs verifying and both tokens
redeeming — key consistency is a separate protocol and deliberately absent. And anonymity here is
a property of the token population a deployment actually has, not of the construction; Sphinx
Mix's traffic-versus-format distinction is the same observation one layer down.

Status stays `COVERED` at six demos rather than moving to `DEEP`, on the same test applied to §20:
six objects unlinked, none of them taught twice, and mix networks beyond Sphinx, DC-nets, and
anonymous e-cash would each still add an axis rather than repeat one.

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

**31. Formal security analysis: symbolic and computational — `COVERED`**
Protocol Checker (Dolev-Yao, rediscovers Lowe's attack by search) · Hidden Bit.

*Title widened 2026-09-21, and the alternative declined on the record.* The old title,
"Formal and symbolic analysis", named only half of what the concept holds — it read as though
symbolic methods were the whole of formality. Splitting provable security out as §31b was the other
option and was rejected: it would have left two one-demo concepts and undone the very thing filing
Hidden Bit here fixed, since §31 had been a single-demo concept and this file's own closing section
calls that "covered, not thoroughly taught". Widening keeps the canonical pair together, which is
the honest shape — they are two ways of making one claim formal, not two subjects.

Hidden Bit is the **computational** half of this concept; Protocol Checker was the **symbolic**
half standing alone until now. Those two are the canonical pair — the two ways a security claim is
made formal. Symbolic analysis searches an idealised algebra for an attack and finds Lowe's;
game-based provable security bounds a measured adversary advantage and hands the bound to a
reduction. Hidden Bit makes the definitions runnable rather than quoted: a challenger seals one
bit, a named adversary guesses, and `Adv(A) = 2·wins/trials − 1` is plotted with a Wilson 95%
interval over real AES modes, RSA-2048, ristretto255 ElGamal, secp256k1 and Ed25519, with a
lazily-sampled ideal permutation and ideal function behind the PRP/PRF switching game.

Its negative claim is the whole lesson and it is asymmetric: a rising advantage proves a scheme
broken, while a flat one proves only that **these** adversaries failed. The chained-IV CBC fixture
stages both halves at once — random guessing and re-encryption both flatten while all three KATs
pass, and the BEAST-style IV predictor still reaches advantage one. Which is why the fifth exhibit
is a reduction rather than another histogram: an IND-CPA adversary wrapped inside a live DDH
distinguisher, checked against the `Adv(B) = Adv(A)/2` convention.

This was the one placement in v10 that nearly went unfiled. Provable security is the framework the
rest of this map's claims are **stated in**, not a peer of the primitives it files, so no concept
was built for it. §31 takes it on the strength of its first word — but that leaves this title
naming only one of the two demos under it. See the version note: widen the title, or split
**§31b**. Not settled here. Status stays `COVERED`; what changes is that §31 is no longer a
one-demo concept, which this file's own closing section calls "covered, not thoroughly taught."

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
Envelope KMS · PQ Rotation · Ghost Commit.

Ghost Commit is the failure case the other two only imply. Envelope KMS shows the safe path —
a DEK/KEK hierarchy, rotation, re-wrap without plaintext exposure — and PQ Rotation shows
migrating one. Neither shows what happens when the key never reached a manager at all. Ghost
Commit does: a credential committed to git keeps its blob name and its contents forever, because
removing it writes a *new* blob and leaves the old one reachable from the commit that introduced
it. Both operations feel like removal and are additions.

It earns the citation on a property rather than a primitive, and the property is durability of a
content-addressed store rather than confidentiality — the demo says plainly that there is no
security model to break on that page. The operational consequence is the lesson: once a credential
is pushed, the only action that changes an attacker's position is revoking it at the issuer. The
entropy scanner beside it is the other half — how a detector decides a string looks like a
credential, which is what makes the leak findable by someone who is not looking for it.

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

**Catalogued total: 202.**

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
