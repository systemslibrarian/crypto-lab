# Lane brief — `crypto-lab-pq-chooser`, the unified PQ selection table

_Written 2026-09-29, out of a fleet-wide audit that asked whether any lab already
presents a unified post-quantum selection table (sizes + measured cost +
implementation notes across ML-KEM, ML-DSA, FN-DSA/Falcon, SLH-DSA s/f, hybrids).
**None does.** This brief is the scope that audit settled. It is a brief only — no
repo is created here, and `--accent`, the favicon emoji and the catalog category
are left for central assignment._

Built to `audits/_MASTER-TEMPLATE.md`. Where a section below says §n, that is the
template's section, and the template wins on anything this file does not name.

---

## Why this exists

The audit swept all 212 clones. Eighteen labs mention three or more PQ families;
exactly two files span KEM *and* signature families with sizes at all. The pieces
of a chooser exist and are scattered across four labs, no two of which hold more
than one piece:

| Piece | Where it already lives | What is missing |
|---|---|---|
| Cross-family signature table with an implementation-complexity column | `crypto-lab-falcon-seal/src/compare.ts:31` (L1) and `:71` (L5) | No KEMs. Timings hardcoded and self-declared *"indicative"* (`:121`) |
| Classical baselines beside PQ, and a genuinely live benchmark | `crypto-lab-dilithium-seal/src/ui/tab2-compare.ts:20` and `src/ui/benchmark-panel.ts` | ML-DSA only. No KEM, no Falcon |
| One scheme per family, plus a handshake-byte calculator | `crypto-lab-pq-families/src/data.ts`, `src/ui.ts:621` | One representative parameter set per family; every figure hardcoded |
| Declared sizes pinned to real library output | `crypto-lab-hybrid-pqc/src/crypto/kem.test.ts:41` | One parameter set each (768/65); a test, not a display |
| TLS handshake byte rows | `crypto-lab-hybrid-guide/src/data.ts:132` | Three hardcoded rows |

So the gap is not "nobody has compared PQ schemes". It is that **no lab derives the
comparison**, and no lab puts KEMs and signatures in one view at parameter-set
granularity.

**This is a new lab, not an extension of `pq-families`.** That lab's `Scheme`
interface is one-representative-per-family by construction and its thesis is *why
lattices won*; fourteen parameter sets with live benchmarks would drown the
argument it exists to make. Its `ui.ts` is already 2,824 lines across 20+ render
functions. The two labs cross-link instead (below).

---

## The finding that motivated the size discipline

The audit found **zero spec mismatches** across all 212 clones: every hardcoded
ML-KEM, ML-DSA, Falcon and SLH-DSA size in the fleet matches FIPS 203/204/205 and
Falcon v1.2. The numbers are right.

What it also found is that **being right is not the same as being derived**. Three
labs printed Falcon's 666 B as a bare integer beside ML-DSA-44's 2420 and
SLH-DSA-128s's 7856 — and 666 is the *padded* size, while raw compressed Falcon-512
signatures measure 652–657 B. Nothing in the data said which of those three numbers
was variable. That was corrected on 2026-09-29 in `falcon-seal`, `pq-families` and
`multivariate`, each lab gaining an optional per-row note that only the Falcon rows
set, with a test pinning both halves.

A typed-in number cannot carry that distinction on its own. A derived one gets it
for free: the padded and unpadded Falcon variants are separate exports, and a table
that calls both shows the difference instead of asserting it. **That is the argument
for this lab.**

---

## Settled scope

### S1. Every size derived, none typed in

Every public-key, ciphertext and signature figure comes from real
`@noble/post-quantum` 0.7.x output at page load — `keygen()`, `encapsulate()`,
`sign()` — and is read off `.length`. The version is already a fleet dependency
(`crypto-lab-hybrid-pqc/package.json`), and its exports were confirmed to cover the
entire matrix:

- **KEMs** — `ml_kem512`, `ml_kem768`, `ml_kem1024`
- **Lattice signatures** — `ml_dsa44`, `ml_dsa65`, `ml_dsa87`
- **Hash-based** — `slh_dsa_sha2_{128,192,256}{s,f}` (all six)
- **NTRU** — `falcon512`, `falcon1024`, **and** `falcon512padded`, `falcon1024padded`
- **Hybrids** — `ml_kem768_x25519`, `QSF_ml_kem768_p256`, `QSF_ml_kem1024_p384`

**No typed-in sizes anywhere in display code.** The spec figures appear in exactly
one place — the test oracles — pinned to FIPS 203 (pk 800/1184/1568, ct
768/1088/1568), FIPS 204 (pk 1312/1952/2592, sig 2420/3309/4627), FIPS 205 (pk 32,
sig 7856/17088) and Falcon v1.2 (pk 897/1793, padded sig 666/1280). The test asserts
derived-equals-spec; the page never reads the constant. This inverts
`hybrid-pqc/src/crypto/kem.test.ts:41`, which declares a size and checks it against
output — the right assertion, pointed the wrong way for a table whose whole claim is
that it did not type the number in.

Falcon is the one scheme whose signature length is a **range**, not a value. The
table renders it as a measured range over N samples, with the padded variant beside
it, and says which is which. That is the misquote panel's row 3 demonstrated rather
than stated.

### S2. Derivation cost is real and shapes the architecture

Measured on this machine (Apple M5, Node 26, median of 5) — these drive a scheduling
decision, so they are measured rather than assumed:

| Scheme | keygen | sign |
|---|---|---|
| SLH-DSA-128s | 102 ms | **795 ms** |
| SLH-DSA-192s | 168 ms | **1652 ms** |
| SLH-DSA-256s | 104 ms | **1639 ms** |
| Falcon-1024 | 286 ms | 5 ms |
| Falcon-512 | 82 ms | 5 ms |
| ML-KEM (any) | ~1 ms | ~1 ms |
| ML-DSA (any) | ~2 ms | 9–20 ms |

Deriving the full matrix eagerly on the main thread costs **roughly 5 seconds on a
fast desktop**, dominated by three SLH-DSA `s`-variant signatures, and proportionally
worse on a phone. So:

- Derivation runs in a **Web Worker**, never on the main thread.
- The table renders immediately with each row in a **pending** state and fills
  progressively as results arrive. Cheap sets (ML-KEM, ML-DSA, Falcon, SLH-DSA `f`)
  land first; the three `s`-variants stream in behind them.
- A row that has not resolved says *deriving…*, never a placeholder number. **A
  figure that is not yet derived is not displayed** — that is this repo's standing
  rule about inherited figures, applied to the loading state, where the temptation
  to show the spec value "just until it resolves" is strongest.
- Signing cost is itself one of the things the table is about, so the wait is
  content: the `s`-variant rows say *SLH-DSA-192s is still signing* while the
  others are done, which teaches the s/f tradeoff before any number appears.
- **Per-row `measuring…` state, visible.** Not a spinner on the table: each row
  says what it is doing, so a reader who never scrolls back still learns which
  schemes were slow.
- **A one-click "skip slow sets" control.** It abandons the three `s`-variant
  derivations and marks those rows **not measured, skipped by you** — an explicit
  third state, never a spec-filled number and never a blank. The control exists
  because a reader on a slow device should be able to reach the rest of the table
  without waiting, and the state exists because the cost of skipping must stay
  visible on the row that was skipped.

### S3. NIST category column, unaligned where the specs are

The column reports **each scheme's own claimed category**, and the categories do not
line up across schemes. ML-DSA-44 is **category 2**, not 1, while Falcon-512 and
SLH-DSA-128s are category 1. The smallest set of each scheme is therefore not a
like-for-like comparison, and the table must say so rather than sorting the three
into one "level 1" row.

`falcon-seal` already gets this right and its wording is the precedent —
`src/compare.ts:5` on the field, and the caption at `src/ui.ts:734`. Reuse the
reasoning, not the prose.

### S4. Live benchmarks beside the classical baselines

Median **and p95** ops/sec for keygen / encap-sign / decap-verify, measured on the
visitor's own device, with **X25519, ECDSA P-256 and RSA-2048** in the same table
measured by the same harness in the same run. A ratio column against the classical
baseline is the number people actually want.

Reuse `crypto-lab-dilithium-seal/src/ui/benchmark-panel.ts` rather than writing a
second harness. It already solves the part that is easy to get wrong: warm-up
iterations, per-sample timing rather than a batch mean, median + p95 + min + max,
and the `performance.now()` coarsening problem (`benchmark-panel.ts:38` — a page
that is not cross-origin-isolated gets clamped resolution, so naive samples quantise
and a median lands on exactly 0.0). A harness that does not know that reports
sub-millisecond operations as free.

**RSA-2048 is benchmarked for sign and verify only.** Its keygen runs to seconds in
WebCrypto and is wildly variable (it searches for primes), so including it would
dominate the wait and measure the search, not the algorithm. The keygen cell reads
**not measured**, with the one-line reason on the row: *RSA key generation is a
randomised prime search; its time says more about luck than about RSA.* Omitting
the cell silently would be the inherited-figure problem wearing an absence.

**The benchmark must not silently become a different measurement.** It reports the
resolution it ran at and the iteration count beside every figure, as that panel
already does.

### S5. TLS wire cost computed from real key shares

Bytes on the wire for one TLS 1.3 handshake, computed from the **actual concatenated
key-share and signature bytes the run produced** — not from constants, and not from
a sum of spec numbers. Pick a KEM and a signature; the page encapsulates, signs, and
adds up what it is actually holding.

This would be **the first lab in the fleet to derive that figure.** `pq-families`
computes handshake bytes from hardcoded constants (`src/ui.ts:621`); `hybrid-guide`
carries three hardcoded rows (`src/data.ts:132`). Both are correct today and neither
would notice if it stopped being.

The hybrid exports make the interesting case derivable: `ml_kem768_x25519` produces a
concatenated key share, so the "hybrid costs ~3% more than ML-KEM alone" claim
becomes a measurement of two byte lengths rather than an assertion.

### S6. Implementation-risk column, sourced from the fleet

Not editorial judgement — each cell links to the lab that demonstrates it:

| Scheme | Risk | Evidence |
|---|---|---|
| Falcon / FN-DSA | Floating-point FFT Gaussian sampler; constant-time hardening is hard. A 2026 preprint reports power-trace key recovery against PQClean Falcon signing on Cortex-M4 (ePrint 2026/2124) | `crypto-lab-pq-families/src/data.ts:138`; sampler exhibit in `crypto-lab-falcon-seal` |
| SLH-DSA | Signing cost. The `s` variants sign in **hundreds of milliseconds to seconds** (S2 above, measured) — the stateless guarantee is paid for in signing time | `crypto-lab-pq-families/src/data.ts:371`; measured in this lab's own benchmark |
| ML-KEM | **Implicit rejection** — decapsulation never fails. A bad ciphertext returns a pseudorandom key, so the caller gets no error and a naive integration cannot tell rejection from success | `crypto-lab-kem-trap` (its whole subject: how an ACVP-validated KEM is destroyed by the code that calls it) |
| ML-KEM | KyberSlash — division by q = 3329 in reference `poly_tomsg` / `poly_compress` leaks through timing | `crypto-lab-pq-families/src/data.ts:159`; `crypto-lab-kyberslash` |

The SLH-DSA row is the one to get right: the lab's own benchmark supplies the
evidence for its own risk column, which is the shape every row should aspire to.

### S7. "Commonly misquoted numbers" panel — exactly five rows

Each row carries its evidence anchor. These are the five the audit earned; the panel
does not grow by invention.

| # | Misquote | Correct | Evidence |
|---|---|---|---|
| 1 | ML-DSA-65 signature **3293** | **3309** | Round-3 Dilithium3 value. `crypto-lab-dilithium-seal/src/__tests__/sources.test.ts:172` and `e2e/provenance.spec.ts:130` already assert the stale number must not appear |
| 2 | ML-DSA-87 signature **4595** | **4627** | Round-3 Dilithium5 value. Same guard, same file |
| 3 | Falcon-512 signature 666 treated as fixed | **652–657 raw, 666 padded** | Measured from `falcon512` vs `falcon512padded`. Corrected in three labs 2026-09-29; `crypto-lab-falcon-seal/src/compare.ts:114` holds the shared wording |
| 4 | ML-KEM-1024 ciphertext assumed larger than its public key | **both 1568** | The ct-larger-than-pk pattern that holds at 512 and 768 breaks at 1024 |
| 5 | UOV public key "278 KB" | **278,432 B = 272 KiB** | The byte count's leading digits read as kilobytes. `crypto-lab-multivariate/src/data.ts:142` documents this exact error and its correction |

Rows 1, 2 and 5 are *other labs' recorded corrections*, cited to the lab that made
them. Row 3 is this fleet's most recent. Row 4 is the one with no incident behind
it — it is a trap in the shape of the data, included because it is the one a reader
is most likely to walk into unaided.

**The panel is derived where it can be.** Rows 1–3 are checkable at runtime: the
page holds the real signature lengths, so it can show that the stale number is not
what the library produces. A panel that merely lists wrong numbers is prose; one
that contradicts them with its own output is the lab's thesis applied to itself.

**The panel lives here and nowhere else.** `pq-families` gets a one-line link to it,
not a copy. A second copy would be a fleet-wide wording with no checker binding the
two — the exact shape `dispatch-comment-sync` exists to prevent, and the copy in
`pq-families` would be the one that cannot check itself, since that lab derives
nothing.

### S8. Reuse, not reimplementation

| Take | From | For |
|---|---|---|
| `benchmark-panel.ts` — warm-up, per-sample timing, median/p95, resolution reporting | `crypto-lab-dilithium-seal/src/ui/benchmark-panel.ts` | S4 wholesale |
| The declared-equals-produced assertion, **inverted** | `crypto-lab-hybrid-pqc/src/crypto/kem.test.ts:41` | S1 test oracles |
| Padded-vs-compressed framing and the shared footnote wording | `crypto-lab-falcon-seal/src/compare.ts:114`, `src/ui.ts:851` | S1 Falcon row, S7 row 3 |
| The round-3 guard: assert the stale value is absent, not just that the right one is present | `crypto-lab-dilithium-seal/src/__tests__/sources.test.ts:172` | S7 rows 1–2 |
| Unaligned-category reasoning | `crypto-lab-falcon-seal/src/compare.ts:5` | S3 |

### S9. Cross-links out

The chooser answers *which one*, and hands off every *why*:

- `crypto-lab-pq-families` — why lattices won; the five-family landscape this table's rows sit inside
- `crypto-lab-falcon-seal` — Falcon's sampler, and why its signatures are variable-length
- `crypto-lab-dilithium-seal` — ML-DSA in depth, and the round-3-vs-FIPS-204 distinction
- `crypto-lab-hybrid-guide` — whether to go hybrid at all, and the migration timeline
- `crypto-lab-kem-trap` — ML-KEM implicit rejection, the S6 risk row
- `crypto-lab-kyberslash` — the timing leak, the other S6 ML-KEM row

---

## Template obligations (§1–§6)

- **§0.1 Real crypto only.** Every figure is library output. The teaching subject here
  is *comparison and derivation*, not a primitive, so nothing is hand-rolled — and the
  README must say so plainly rather than implying hand-built internals.
- **§0.2 Honest scoping.** The page states: benchmarks are this device in this browser
  on this run, not a hardware ranking; TLS wire cost counts key exchange and
  authentication, not a full handshake; NIST categories are each scheme's own claim.
- **§1 Invariants.** (1) No display path reads a size constant — enforced by a test that
  greps display modules for the spec integers. (2) A row that has not derived shows no
  number. (3) Falcon renders a range, never a point. (4) Spec constants exist only in
  test oracles.
- **§1 Architecture.** `src/derive/` (worker + per-scheme adapters), `src/bench/`
  (the ported harness), `src/wire/` (TLS cost), `src/ui/`. Sizes and benchmarks are
  separately testable without a DOM.
- **§1 Visual semantics.** Pending, derived and failed-to-derive are three visibly
  distinct states, by icon + text + colour, never colour alone. A scheme the browser
  cannot run is *unavailable*, never a blank or a zero.
- **§2 Teach.** The headline mechanism is that the numbers appear *as they are computed*.
  The s/f tradeoff teaches itself through the fill order (S2).
- **§4.1b claims spec.** Every rendered claim checked: the misquote panel's five rows,
  the category column's unalignment note, the Falcon range, the hybrid overhead
  percentage.
- **§4.1d negative claims.** What this does **not** buy: a device benchmark is not a
  security ranking; smaller is not safer; a passing derivation says nothing about
  constant-time behaviour — the S6 column exists precisely because the size table
  cannot see implementation risk.
- **§6.1/§6.2** Dependabot grouped config, auto-merge on the same gate the deploy runs,
  and the deploy dispatch. Then `gate-sync`, `dispatch-sync`, `dispatch-census write`,
  `theme-sync`, `fleet-sync`.

## Catalog side

Card, `TITLE_TO_SECTION` → `post-quantum`, then `readme-sync`, `corpus-sync gen`,
`concept-sync`. The chooser is a candidate Learning Path step for the Post-Quantum
journey, likely last — it is the *choose one* after the individual schemes are
understood.

`--accent`, favicon emoji and `data-category` are **left unassigned here**, for
central assignment against the neighbouring cards.

## Maintainer decisions, 2026-09-29

The three questions this brief opened with were put to the maintainer and answered
the same day. Recorded as decisions with their reasons, not closed silently.

**1. SLH-DSA `s`-variants — KEEP THEM.** The worker and progressive fill stand as
written in S2, with two additions now folded into that section: a visible per-row
`measuring…` state, and a one-click **skip slow sets** control. Skipping marks
those rows *not measured, skipped by you* — an explicit third state alongside
derived and pending. **Never spec-filled, never blank.** The whole lab exists
because a typed-in number is indistinguishable from a derived one; a placeholder
dropped into a skipped row would reintroduce that defect at the one moment the
reader has been told a measurement was skipped.

*Verification item, after build:* the S2 timings are an Apple M5. **Re-measure on a
mid-range phone and record the figure**, because the skip control's value is set
entirely by a number nobody has yet. If a mid-range Android takes 20 s rather than
5, the `s`-variants may need to be derive-on-click rather than eager-behind-the-others
— that is a decision the measurement makes, not this brief.

**2. RSA-2048 — sign and verify benchmarked; keygen NOT measured.** Agreed as
recommended and folded into S4. The keygen cell carries a one-line reason rather
than being dropped, because an omitted cell reads as an oversight while a stated
*not measured* is a claim the reader can check.

**3. The misquoted-numbers panel lives in `pq-chooser`.** `pq-families` gets a
one-line link, not a copy. Rows 1–3 are checkable only where the derived output
is, and a second copy would be one wording in two places with nothing binding them
— the failure `dispatch-comment-sync` exists to prevent, except that here the
second copy would be the one unable to check itself.

**Sequencing:** the `pq-families` link is NOT to be added yet. It lands after the
build session reports, so the link and the thing it points at ship in that order.

---

## Status, 2026-09-29

`systemslibrarian/crypto-lab-pq-chooser` **now exists and is being built in a
separate session.** This file is the brief that session builds against; it is not a
record of what was built. The catalog-side work in the section above — the hub card,
`TITLE_TO_SECTION`, the corpus entry, the concept-coverage line, and the
`pq-families` link — is deliberately **not done yet** and waits on that session's
report.
