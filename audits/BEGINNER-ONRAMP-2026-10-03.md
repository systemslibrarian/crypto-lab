# Beginner on-ramp: a re-level pass and seven candidate labs

**2026-10-03. Written as a report; the maintainer's decisions on it are recorded below.**

> **Decided 2026-10-03.** The **22 high-confidence re-levels were applied** — `tools/lab-levels.json`,
> the cards, and `LEVELS-REVIEW.md`. The **5 flagged labs stay at Intermediate**: Export Grade,
> Entropy Collapse, Search Vault, Key Mirror, Iron Serpent. The **"Start here" path shipped** with the
> five steps whose labs exist, in this file's ordering. **Ed25519 Forge** gets a beginner front-section
> and is re-levelled only if that makes its opening genuinely Beginner. Build briefs were written for
> the three new labs; the repositories are the maintainer's to create.
>
> Catalog after the first re-level: **25 Beginner / 54 Intermediate / 140 Advanced.**
>
> **Then Ed25519 Forge shipped its front-section** (`crypto-lab-ed25519-forge#19`) and was
> re-levelled to Beginner, flagged: the opening a newcomer works through is Beginner, the hero
> above it still leads with "EdDSA - Curve25519 - RFC 8032". **26 / 53 / 140.** The three build
> briefs are `audits/BRIEF-https-padlock.md`, `audits/BRIEF-locks-and-keys.md` and
> `audits/BRIEF-what-is-pqc.md`.

The catalog ships 219 cards at three levels: **3 Beginner, 76 Intermediate, 140 Advanced.**
Three beginner labs is too few for a site meant to be usable by universities and by
people arriving with no cryptography.

This file answers two questions:

1. With Beginner meaning *no maths beyond arithmetic*, which existing Intermediate labs
   are already beginner-grade and were levelled against the old wording?
2. Of seven candidate beginner labs, which need a new repository, which are better as a
   beginner front-section on a lab that already exists, and which are already built?

---

## What was read, and what was not

Part 1 is derived from the **live page of every one of the 76 Intermediate labs** —
`https://systemslibrarian.github.io/<slug>/`, loaded in a browser, intro and first
exhibit read as a visitor sees them. Not from the cards, and not from the READMEs.
All 76 loaded; none errored.

Part 2's overlap claims are derived from the catalog's own card data (title, description,
chips, level) across all 219 cards, plus the live pages of the labs named as overlapping.
**The 140 Advanced labs were not individually read.** Where this file says a thing does not
exist in the fleet, that claim is scoped to what the card index can see — it is a reason to
look, not a proof of absence.

---

## Part 1 — Re-level: Intermediate labs that are already beginner-grade

### The test applied

A lab is proposed for Beginner when all three hold:

- **(a) On-ramp.** Plain language arrives before any hex, bit grid, or notation.
- **(b) Arithmetic only.** Completing the first exhibit needs no algebra and no modular
  arithmetic. Counting, doubling, powers of two and comparing years all count as arithmetic.
- **(c) The claim does not rest on a maths step.** The reader is never asked to follow a
  derivation to believe the lab's point.

XOR is treated as arithmetic-adjacent and acceptable **when the lab teaches it from
scratch**, which is why OTP Vault qualifies and ChaCha20 Stream does not — ChaCha20's
quarter-round is addition modulo 2³², which is modular arithmetic by name.

### Proposed: Intermediate → Beginner (22, high confidence)

| Lab | Current | Proposed | Why it passes |
|---|---|---|---|
| Hash Zoo | Intermediate | **Beginner** | Opens "Start here — What is a hash?" with three plain rules and a type-anything box |
| World Hashes | Intermediate | **Beginner** | "Start here — what is a cryptographic hash?" states four properties in plain sentences |
| Collision Vault | Intermediate | **Beginner** | Two different files, one digest; the reader computes nothing |
| OTP Vault | Intermediate | **Beginner** | XOR is introduced from scratch; crib-dragging is a word puzzle, not algebra |
| KDF Arena | Intermediate | **Beginner** | One benchmark, one control, a jargon glossary, and a plainly-stated tension |
| KDF Chain | Intermediate | **Beginner** | "Start Here — a Guided Path", six numbered steps; parameters are powers of two |
| Bcrypt Forge | Intermediate | **Beginner** | Cost factor is doubling; the rest is the anatomy of a stored hash string |
| Feistel Forge | Intermediate | **Beginner** | The whole trick is stated in four plain sentences before anything runs |
| World Ciphers | Intermediate | **Beginner** | "Start Here — The Vocabulary in One Panel" defines every term in one sentence |
| Envelope KMS | Intermediate | **Beginner** | The paper-key-inside-a-safe analogy carries the entire lab |
| Chain of Trust | Intermediate | **Beginner** | Says outright that only a small part of the checklist is cryptography |
| DNSSEC Chain | Intermediate | **Beginner** | Section one is literally titled "What this is, in plain language" |
| Ghost Commit | Intermediate | **Beginner** | Git objects and a leaked credential; there is no maths anywhere in it |
| JWT Forge | Intermediate | **Beginner** | 90-second guided tour: decode, forge, compare a correct verifier with a broken one |
| WebAuthn | Intermediate | **Beginner** | "The whole concept in one picture"; the signature is used, never computed |
| Signed Bytes | Intermediate | **Beginner** | Same meaning, different bytes — a parsing lesson, not a maths one |
| Stream Ward | Intermediate | **Beginner** | Truncate, reorder and drop chunks; the failure is visible without theory |
| Time Trust | Intermediate | **Beginner** | One clock slider; the reader moves time and watches verdicts move |
| Harvest Timeline | Intermediate | **Beginner** | Mosca's X + Y > Z is adding two numbers of years and comparing to a third |
| Blind Hello | Intermediate | **Beginner** | Starts from "when your browser opens a secure connection" and stays there |
| Downgrade Wire | Intermediate | **Beginner** | Negotiation stripping explained in plain words before anything is stripped |
| Merkle Vault | Intermediate | **Beginner** | The structure half of the Merkle pair, by the two labs' own stated split |

### Proposed, lower confidence — worth a second opinion (5)

| Lab | Proposed | The competing signal |
|---|---|---|
| Export Grade | **Beginner** | "80-bit key, 32 bits of resistance" is counting, but the TETRA/TEA1 context assumes a reader who cares about radio standards |
| Entropy Collapse | **Beginner** | Clone a machine, get the same secrets — graspable; but HMAC_DRBG and seed provenance are named throughout |
| Search Vault | **Beginner** | "Suppose you keep your company files on a server you do not control" is perfect; the payoff is leakage-abuse reasoning |
| Key Mirror | **Beginner** | The key-transparency story is plain; a VRF sits under it and is chipped on the card |
| Iron Serpent | **Beginner** | Its "Start here: a 3-step path" is beginner-grade; the rest of the page is cipher internals |

### Held at Intermediate, with the reason (the near misses)

These were examined and **not** proposed, so the decision is on record rather than silent:

| Lab | Why it stays |
|---|---|
| Babel Hash | Opens directly on a bit grid and UTF-8 hex with no explainer — fails (a), not (b) |
| AES Modes | The decision guide at the top is beginner-grade; "Block-level math" and CBC bit-flipping are not |
| Padding Oracle | First line on the page is `P[i] = AES⁻¹(C[i]) ⊕ C[i−1]` |
| ChaCha20 Stream | The quarter-round stepper is addition modulo 2³² |
| TLS Handshake | Section 1 is plain, but completing it means following an HKDF key schedule |
| Kerberos | No maths, but it needs a reader who can hold a four-party message trace |
| Nonce Collision | The opening exhibit is beginner-grade; the GCM forbidden attack is not |
| Protocol Compose | Judging MtE against EtM is security reasoning a newcomer has no basis for |
| Hybrid Guide | Assumes the reader already knows what a KEM is |
| PQ Rotation | Arithmetic only, but written for someone who operates a certificate fleet |
| Shadow Vault | Drops straight into a two-passphrase vault form; deniability is an adversary-model argument |
| Web of Trust | Graph reasoning plus GnuPG's own vocabulary (owner-trust, marginals, depth) |
| SSH Handshake | TOFU is beginner-grade, the exchange hash is not |
| HPKE Envelope | Plainly written, but it is three primitives the reader is assumed to know |
| Merkle Proofs | Deliberately the semantics half of the pair — the labs document the split themselves |
| Ratchet Wire | The 7-step welcome is excellent; DH ratchet steps are the content |

### What this would do to the shape of the catalog

| | before | **applied (the 22)** | had the 5 gone too |
|---|---|---|---|
| Beginner | 3 | **25** | 30 |
| Intermediate | 76 | **54** | 49 |
| Advanced | 140 | **140** | 140 |

**Decided and applied** — the 22 above only; the 5 flagged stay at Intermediate.

---

## Part 2 — The seven candidate beginner labs

Each candidate was checked against what the catalog already holds. Three want a new
repository; three are already built and want a re-level rather than a build; one is a
judgement call stated as such.

### 1. What is PQC? — **new repo**

**Overlap.** **17 cards name ML-KEM or Kyber** — some implementing it (Kyber Vault,
Hybrid Wire, KEM Trap, KyberSlash, Ciphertext Mirror, PQXDH Wire, Hybrid PQC, PQ TLS
Handshake), others naming it to compare against (Frodo Vault, BIKE Vault, HQC Vault,
McEliece Gate). **Every one of the 17 is Advanced except Hybrid Guide**, and the closest
beginner-shaped candidate, Kyber Vault, opens on encapsulation and lattice framing. **There is no lab
that explains why anyone should care before showing the mechanism.**

**Scope.** One page, three panels. Panel one: a padlock that works today and a padlock
that a future machine opens — no lattices, no polynomials, the word "lattice" appears
once in a footnote linking to Lattice Gentle. Panel two: run a real ML-KEM-768
encapsulation and decapsulation with `@noble/post-quantum`, showing only *public key in,
shared secret out, both sides match* — the byte sizes are displayed because "the key is
1,184 bytes instead of 32" is the honest, arithmetic-only version of what changed. Panel
three: the same exchange with one ciphertext byte flipped, so the reader sees the shared
secrets stop matching. Real primitive, real vectors, no maths shown.

### 2. Locks and Keys — **new repo**

**Overlap.** Public-key encryption exists in Iron Letter (ECIES vs RSA-OAEP, a
practitioner's comparison), Educational RSA (which *is* the modular-arithmetic lab — it
teaches the maths on purpose), and Key Exchange (an Advanced history walkthrough).
**No lab in the index says "here is a padlock anyone may close and only you can open."**

**Scope.** One keypair, generated in the browser. The public key is drawn as an open
padlock you can hand out; the private key as the only key that opens it. Encrypt a short
message to the padlock, decrypt it with the key, then try to decrypt with the wrong key
and watch it fail. Then the one thing beginners always get wrong, shown rather than
asserted: signing is the same pair used backwards. Real X25519 + HKDF + AES-GCM (or
ECIES P-256, to share vectors with Iron Letter) under the hood; no exponents, no curve
equations, no modulus on screen.

### 3. What a Hash Is — **already built; re-level, do not build**

**Overlap: near-total.** Hash Zoo already opens with "Start here — What is a hash?",
three plain rules, and a type-anything box whose whole purpose is "edit one letter and
watch the fingerprint change" — the user's exact description. World Hashes carries a
four-property version of the same panel. Collision Vault supplies the "why it matters"
in the most concrete form available: two real files, one digest.

**Recommendation.** Re-level Hash Zoo to Beginner (Part 1) and leave it as the fleet's
answer. If anything is added, it is a *first* exhibit inside Hash Zoo — not a repo.

### 4. Passwords Done Right — **already built; re-level, plus a short front-section**

**Overlap: near-total.** The ask was "why sites store hashes plus salt, shown with real
bcrypt or Argon2". Bcrypt Forge ships the anatomy of a stored `$2b$` string, a cost-factor
benchmark, timing-safe comparison, a breach database, a rainbow-table lookup and a real
dictionary attack. KDF Chain ships a six-step guided path across PBKDF2, scrypt and
Argon2id. KDF Arena races all four on one password.

**Recommendation.** Re-level Bcrypt Forge and KDF Arena to Beginner. Add one short
front-section to Bcrypt Forge — *why a site must not store the password itself* — which
is the single step those three labs all assume and none states. Perhaps 40 lines, not a
repository.

### 5. Signatures in Plain English — **front-section on Ed25519 Forge, or a thin new repo**

**Overlap: partial, and this is the judgement call.** Ed25519 Forge already does
keypair → sign → tamper → verification fails, which is exactly the requested arc — but it
is levelled Intermediate for good reason: deterministic nonces and ZIP215 edge cases are
its substance. Signed Bytes is about canonicalization, Vector Gate about rigour, JWT
Forge about a token's structure. **The arc exists; nothing presents it as the first thing
a newcomer meets.**

**Recommendation.** Cheapest honest route is a beginner front-section on Ed25519 Forge:
sign a sentence, change one character, watch verification fail, with the key material
shown as "a pair, one you publish and one you never share" and nothing about nonces until
the reader scrolls past it. A separate repo is defensible if the on-ramp series wants a
clean, uncluttered page — flagged for the maintainer rather than decided here.

### 6. The HTTPS Padlock — **new repo, and the strongest of the seven**

**Overlap: spread across five labs and stated by none.** Chain of Trust explains path
building versus validation; TLS Handshake opens with "What TLS 1.3 Gives You"; Blind Hello
explains what still leaks (the hostname); Downgrade Wire explains the negotiation an
attacker can strip; DNSSEC Chain covers the *other* trust system entirely. A newcomer
asking "what does the padlock mean?" currently has to assemble the answer from five
Intermediate labs.

**Scope.** Four claims, each either demonstrated or denied, on one page. *It promises*
the connection is encrypted, and that the name in the bar matches a certificate someone
vouched for. *It does not promise* the site is honest, that the company is who they say
they are in any legal sense, or that the hostname was private on the way out — that last
one demonstrated by showing the SNI field in the clear, with a link to Blind Hello. Real
certificate parsing and a real chain walk; no key exchange maths. This is the lab most
likely to be linked from outside the catalog.

### 7. Harvest Now, Decrypt Later — **already built; re-level, plus a story opening**

**Overlap: near-total, in two complementary halves.** Harvest Vault captures a real key
exchange, upgrades it to post-quantum, and shows why recorded traffic is already lost.
Harvest Timeline is the planning half — Mosca's inequality against an asset inventory.
Together they are precisely the lab described.

**Recommendation.** Re-level Harvest Timeline to Beginner (Part 1; X + Y > Z is
arithmetic). Add a short story-form opening to Harvest Vault — one recorded conversation,
one adversary with a hard drive, one future machine — ahead of the capture panel. No new
repository.

### Summary of the seven

| Candidate | Verdict |
|---|---|
| What is PQC? | **New repo** — 17 cards name ML-KEM or Kyber, none an on-ramp |
| Locks and Keys | **New repo** — no plain public/private-key lab exists |
| The HTTPS Padlock | **New repo** — the answer is spread across five labs and stated by none |
| Signatures in Plain English | **Front-section on Ed25519 Forge**, or a thin repo — maintainer's call |
| What a Hash Is | **Already built** — re-level Hash Zoo |
| Passwords Done Right | **Already built** — re-level Bcrypt Forge + KDF Arena, add one front-section |
| Harvest Now, Decrypt Later | **Already built** — re-level Harvest Timeline, add a story opening |

---

## The "Start here" learning path

Ordered so each step answers a question the previous one raises. Steps marked *(exists)*
need no build — only the re-level in Part 1.

| # | Step | Lab | State |
|---|---|---|---|
| 0 | Codes before computers | Dead Sea Cipher → Vigenère Break → Enigma Forge | **shipped** — already Beginner |
| 1 | What a hash is | Hash Zoo | **shipped** — re-levelled |
| 2 | Locks and keys | **new** | brief written, repo pending |
| 3 | Signatures in plain English | Ed25519 Forge | **shipped in the path**; front-section queued |
| 4 | The HTTPS padlock | **new** | brief written, repo pending — Chain of Trust stands in |
| 5 | Passwords done right | Bcrypt Forge | **shipped** — re-levelled |
| 6 | What is PQC? | **new** | brief written, repo pending |
| 7 | Harvest now, decrypt later | Harvest Timeline | **shipped** — re-levelled |

**What actually shipped in the path**, in this order: Dead Sea Cipher, Vigenère Break, Enigma
Forge, Hash Zoo, Ed25519 Forge, Chain of Trust, Bcrypt Forge, Harvest Timeline. Chain of Trust
occupies the padlock position until `crypto-lab-https-padlock` exists — it is the existing lab
closest to the question and is now Beginner. Locks and Keys and What is PQC? have no stand-in,
so the path simply does not claim those steps yet.

Step 0 is optional and deliberately placed first: the three classical-cipher labs are
already Beginner, already built, and they establish *what a cipher is* without a single
modern primitive. A newcomer who stops after step 1 has still learned something complete.

It is a `LEARNING_PATHS` entry in `index.html` with `id: 'start-here'`, and it is the first
path on the page.

---

## What this file does not claim

- It does not claim the 140 Advanced labs hold no beginner-grade material. They were not
  individually read.
- It does not claim the seven candidates have no other overlap in the fleet. Overlap was
  derived from the card index plus the live pages of the labs named — thorough for what it
  covered, and not exhaustive.
- The level proposals are a reading of each lab's intro and first exhibit, not of its whole
  page. A lab whose later panels turn mathematical is still proposed on the strength of
  what a newcomer meets first, and five such cases are named above rather than hidden.
